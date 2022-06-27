/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */


SAVE_REPORT_TYPE = {
	reportView : 'application/x-ibmcognos_v5reportview+xml',
	report : 'application/x-ibmcognos_v5report+xml'
};


function ViewerIWidgetSave( viewerWidget, payload )
{
	this.m_ViewerWidget = viewerWidget;
	this.m_payload = payload;
	this._setIsSavedDashboard();

}

ViewerIWidgetSave.prototype.setDoCWCopy = function(value) {
	this._doCWCopy = value;
};

ViewerIWidgetSave.prototype._getSavedReport = function(){
	var sSavedReport = this._getWidgetAttributeValue('savedReportPath') ;
	if( !sSavedReport )
	{
		//for backwards compatibility
		sSavedReport = this._getWidgetAttributeValue( 'savedReportName');
	}
	return sSavedReport;
};

/**
 * Check if current dashboard is already saved
 */
ViewerIWidgetSave.prototype._setIsSavedDashboard = function()
{
	var sSavedReport = this._getSavedReport();
	this._bIsSavedDashboard = ( sSavedReport !== null && sSavedReport !== undefined && sSavedReport.length !== 0) ;	
	
};

ViewerIWidgetSave.prototype._isSavedDashboard = function(){
	return this._bIsSavedDashboard;
};

/**
 * Can save if the user has write permission, creating a new dashboard or we're doing a saveAs (also creating a 'new' dashboard)
 * @param {Object} permission
 */
ViewerIWidgetSave.prototype.canSave = function( permission )
{
	//user is allowed to save in dashboard if they are doing a save new or save-as without write permission
	return ( this._doSaveNewOrSaveAs() || permission && permission.indexOf( "write" ) !== -1 || this.m_ViewerWidget.isDropped()  ) ;
};

ViewerIWidgetSave.prototype.isSavedOutput = function()
{
	//do not save if report is a saved output
	var sAction = this.m_cognosViewer.envParams["ui.action"];
	return ( typeof sAction !== "undefined" && sAction === "view");
};

ViewerIWidgetSave.prototype._doSaveNewOrSaveAs = function(){
	var result = ( this.m_payload.operation === 'save' && !this._isSavedDashboard() ) || ( this.m_payload.operation === 'saveAs');
	return result;
};


ViewerIWidgetSave.prototype._getWidgetAttributeValue = function( attribName ){
	return this._getViewerWidget().getAttributeValue( attribName );
};

ViewerIWidgetSave.prototype._getEnvParam = function( paramName ){
	return this._getViewerWidget().getEnvParam( paramName );
};


ViewerIWidgetSave.prototype._getViewerWidget = function(){
	return this.m_ViewerWidget;
};

ViewerIWidgetSave.prototype._isLimitedInteractiveMode = function(){
	return this._getViewerWidget().isLimitedInteractiveMode();
};

ViewerIWidgetSave.prototype._getDefaultReportName = function(){
	return this._getEnvParam( 'ui.name');
};

ViewerIWidgetSave.prototype._getReportSpec = function(){
	return this._getEnvParam( 'ui.spec');
};

ViewerIWidgetSave.prototype._getCurrentReportIsReportView = function(){
	return ( this._getEnvParam( 'ui.objectClass') === 'reportView' );
};

ViewerIWidgetSave.prototype.doGetSavePropertiesFromServer = function(){
	this.delayedLoadingContext = this._getViewerWidget().getLoadManager().getDelayedLoadingContext();

	if (this._getEnvParam( 'delayedLoadingExecutionParams')) {
		return true;
	}
	
	return ( this.delayedLoadingContext && this.delayedLoadingContext.getPromptValues() !== null  );
};

/**
 * This function gets the information that is needed from the server in order to do the save.
 * Currently, it sends the execution parameters to the server to get it in the proper syntax
 * to be saved in CM.
 */
ViewerIWidgetSave.prototype.getSavePropertiesFromServer = function(){
	var oCV = this._getViewerWidget().getViewerObject();
	var serverRequest = new JSONDispatcherEntry( oCV );
	var widget = this._getViewerWidget();
	
	//set the callback function
	serverRequest.setCallbacks({
		customArguments: [ this.m_payload ],
		complete: {"object": widget, "method": widget.handleGetSavePropertiesFromServerResponse }
	});
	
	this._addRequestOptions(serverRequest);
	serverRequest.sendRequest();
};

ViewerIWidgetSave.prototype._addRequestOptions = function(serverRequest)
{
	serverRequest.addFormField("ui.action", "noOp" );
	serverRequest.addFormField("bux", "true");
	serverRequest.addFormField("cv.responseFormat", "IWidgetSavePropertiesJSON");
	
	// delayedLoadingExecutionParams contains the saved prompt values that was obtained on the initial load of viewer widget but 
	// before the report is ran (which means no ui.conversation). This needs to be sent to the server so the saved prompt values can be merged with
	// any new prompt values that is stored in the delayedLoadingContext before being saved.  Otherwise, only global prompt values are save and
	// caused the report to prompt next time, the tab is made visible.
	if( this._getEnvParam( 'delayedLoadingExecutionParams') ){
		serverRequest.addFormField("delayedLoadingExecutionParams", this._getEnvParam('delayedLoadingExecutionParams') );
	} 
	else
	{
		// if there is no delayedLoadingExecutionParams, it means that the report had ran and there is conversation and it
		// should be sent to the server so that the prompt values contained in it will be merged with the ones in delayedLoadingContext.
		serverRequest.addFormField("ui.conversation",  this._getViewerWidget().getViewerObject().getConversation() );
	}

	var promptValues = this.delayedLoadingContext.getPromptValues();
	for( var promptValue in promptValues ){
		serverRequest.addFormField( promptValue, promptValues[promptValue] )
	}
};

ViewerIWidgetSave.prototype._getExecutionParameters = function(){

	return this._getViewerWidget().getViewerObject().getExecutionParameters();
};

ViewerIWidgetSave.prototype._setExecutionParameters = function( body ) 
{
	var sParameters = this._getExecutionParameters();
	var doc = XMLBuilderLoadXMLFromString( sParameters );
	
	if( !doc.documentElement )
	{
		return;
	}
	var root = XMLBuilderCreateXMLDocument ( 'root');
	var eParameters = root.createElement( 'parameters' );
	XMLBuilderSetAttributeNodeNS(eParameters, "xmlns:SOAP-ENC", "http://schemas.xmlsoap.org/soap/encoding/");
	XMLBuilderSetAttributeNodeNS(eParameters, "xsi:type", "bus:parameterValueArrayProp", "http://www.w3.org/2001/XMLSchema-instance" );
	XMLBuilderSetAttributeNodeNS(eParameters, "xmlns:bus", "http://developer.cognos.com/schemas/bibus/3/" );
	XMLBuilderSetAttributeNodeNS(eParameters, "xmlns:xs", "http://www.w3.org/2001/XMLSchema" );
	
	root.documentElement.appendChild(eParameters);
	
	var allItems = XMLHelper_FindChildrenByTagName(doc.documentElement, 'item', false);
	
	var eValue = root.createElement("value");
	XMLBuilderSetAttributeNodeNS(eValue, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
	
	eParameters.appendChild( eValue );

	var iNumberOfParms = allItems.length;
	for (var i = 0; i < allItems.length; i++)	{
		var eName = XMLHelper_FindChildByTagName(allItems[i], 'name', false);
		if( eName && eName.childNodes[0].nodeValue.indexOf( 'credential:') !== -1 ){
			iNumberOfParms--;
			continue;
		}
		eValue.appendChild( allItems[i] );
	}
	
	XMLBuilderSetAttributeNodeNS(eValue, "SOAP-ENC:arrayType", "bus:parameterValue[" + iNumberOfParms + "]", "http://schemas.xmlsoap.org/soap/encoding/");
	body.parameters = XMLBuilderSerializeNode( eParameters );	
};

/**
 * Sets the source report to be copied or base report for the report view
 */
ViewerIWidgetSave.prototype._setSourceObject = function(resource, bUseCurrentReport) {

	var sOriginalReportValue = (bUseCurrentReport === true)  
									? this._getEnvParam('ui.object') 
									: this._getEnvParam('originalReport');	
	
	if (sOriginalReportValue) {
		resource.sourceObject = sOriginalReportValue;
	}
};

ViewerIWidgetSave.prototype._setReportTypeToReportView = function(resource) {
	resource.type = SAVE_REPORT_TYPE.reportView;
};

ViewerIWidgetSave.prototype._setReportTypeToReport = function(resource) {
	resource.type = SAVE_REPORT_TYPE.report;
};

ViewerIWidgetSave.prototype._setReportSpec = function( body ) {
	body.specification = this._getReportSpec();
};

ViewerIWidgetSave.prototype._setResourceForSave = function(resource){

	if( !this._getCurrentReportIsReportView() && !this._isLimitedInteractiveMode() ){
		this._setReportSpec( resource.body );
		this._setReportTypeToReport(resource);
	}
	return resource;
};

ViewerIWidgetSave.prototype._setResourceForCopy = function(resource){
	this._setReportSpec( resource.body );
	this._setReportTypeToReport(resource);
	return resource;
};

ViewerIWidgetSave.prototype._setResourceForSaveNew = function(resource){
	var bUseCurrentReport = false;
	
	if (this._getEnvParam('originalReport') == null) {
		//this is a special case for copy/pasted ci published widget
		// when originalReport is null we use ui.object env. variable to set SourceObject
		bUseCurrentReport = true;
	}

	this._setSourceObject( resource, bUseCurrentReport );
	
	if( this._isLimitedInteractiveMode() )
	{
		this._setReportTypeToReportView( resource );
	}else
	{
		this._setReportTypeToReport( resource );
		this._setReportSpec(resource.body );
		
	}
	return resource;
};

ViewerIWidgetSave.prototype._setResourceForSaveAs = function( resource ){

	if( this._getCurrentReportIsReportView() )
	{
		this._setReportTypeToReportView( resource );
		this._setSourceObject( resource );
	} 
	else if( this._isLimitedInteractiveMode() )
	{
		this._setReportTypeToReportView( resource );
		this._setSourceObject( resource, true /*bUseCurrentReport*/ );
	}
	else
	{
		this._setReportTypeToReport( resource );
		this._setSourceObject( resource, true /*bUseCurrentReport*/ );
		this._setReportSpec( resource.body );
	}
	return resource;
};


ViewerIWidgetSave.prototype._getResource = function(){	
	var resource = {};
	
	if (this._doCWCopy === true) {
		resource.copyOnCreate = true;
	}
	
	resource.body = {};
	
	var bDoSave = (this.m_payload.operation === 'save');
	var bIsCopy = (this.m_payload.operation === 'copy');
	
	if ( bIsCopy )
	{
		this._setResourceForCopy( resource );
	}
	else if( bDoSave)
	{
		this._setResourceForSave( resource );
	}
	else
	{			
		if( this._isSavedDashboard() )
		{
			this._setResourceForSaveAs(resource);
		}
		else
		{
			this._setResourceForSaveNew(resource);
		}
	}


	
	this._setExecutionParameters( resource.body );
	if (!bIsCopy){
		// list of itemSets for chrome to update after a save
		resource.itemSetUpdate = { name: 'savedReportPath',
								   type: 'searchPath' };
	}
	return resource;
};

ViewerIWidgetSave.prototype._getWidgetId = function(){
	return this._getViewerWidget().getWidgetId();
};

/**
 *  payload = {
 *  			widgetId : <widget id>,
 *  			resource : [
 *   					 	{ 
 *   						  type			: <report or report view>
 *   						  sourceObject	: <source report to be cloned or saved as report view>
 *  						  body			: { <list of cm properties to be updated> }
 *  						  itemSetUpdate	: { <list of itemsets to be updated by BUX after a successful save }
 *  					    }
 *  					  ]
 * 			  }
 * 
 *  body = { 
 *  		specification 	: <optional - report spec if saving report>,
 *  		parameters 		: <execution parameters>
 *  	   }
 *  
 *  itemSetUpdate = { 
 *  					name : 'savedReportPath',
 *  					type : 'searchPath'
 *  				}
 */
ViewerIWidgetSave.prototype.getPayload = function(){
	var payload = {};
	payload.resource = new Array();
	payload.widgetId = this._getWidgetId();
	payload.resource.push( this._getResource() );
	return payload;
};




