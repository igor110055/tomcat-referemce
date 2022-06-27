/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function CCognosViewerSaveReport( cognosViewer, payload )
{
	this.m_cognosViewer = cognosViewer;
	this.m_params = null;
	//chrome always send use the storeid of the dashboard to save report in so we know if it is save-as or save operation
	this.dashboardToSaveIn = payload.cm$storeID;
	this.m_doSaveAsOnFault = false;
}

/**
 * Can save if the user has write permission, creating a new dashboard or we're doing a saveAs (also creating a 'new' dashboard)
 * @param {Object} permission
 */
CCognosViewerSaveReport.prototype.canSave = function( permission )
{
	return ( this.doSaveAs() || permission && permission.indexOf( "write" ) !== -1  ) ;
};

CCognosViewerSaveReport.prototype.isSavedOutput = function()
{
	//do not save if report is a saved output
	var sAction = this.m_cognosViewer.envParams["ui.action"];
	return ( typeof sAction !== "undefined" && sAction === "view");
};

/**
 *
 */
CCognosViewerSaveReport.prototype.doSaveAs = function()
{
	//savedReportName is only set when report had been saved in the dashboard
	var result = ( this.m_doSaveAsOnFault || !this.m_cognosViewer.envParams["savedReportName"] || !this.isSameDashboard() ); 
	return result;
};

CCognosViewerSaveReport.prototype.isSameDashboard = function()
{
	var result = ( this.m_cognosViewer.envParams["ui.object"].indexOf( this.dashboardToSaveIn ) !== -1 );
	return result;
};

CCognosViewerSaveReport.prototype.getUIAction = function()
{
	return ( this.doSaveAs() ? "saveInDashboard" : "updateSavedReport");
};

CCognosViewerSaveReport.prototype.populateRequestParams = function(asynchRequest) {

	asynchRequest.addFormField('ui.action', this.getUIAction());
	asynchRequest.addFormField('cv.ignoreState', 'true');
	asynchRequest.addFormField("dashboard-id", this.dashboardToSaveIn);
	asynchRequest.addNonEmptyStringFormField("executionParameters", this.m_cognosViewer.m_sParameters);

	for(var param in this.m_cognosViewer.envParams)
	{
		if( param.indexOf("frag-") == 0 || param == "cv.actionState" ||
			param == "ui.primaryAction" || param == "dashboard" ||
			param == "ui.action" || param == "cv.responseFormat" ||
			param == "b_action") {
			continue;
		}

		asynchRequest.addFormField(param, this.m_cognosViewer.envParams[param]);
	}
};

CCognosViewerSaveReport.prototype.getCognosViewer = function()
{
	return this.m_cognosViewer;
};

CCognosViewerSaveReport.prototype.getViewerWidget = function()
{
	return this.getCognosViewer().getViewerWidget();
};


CCognosViewerSaveReport.prototype.dispatchRequest = function()
{
	var cognosViewer = this.m_cognosViewer;
	var viewerWidget = this.getViewerWidget();
	var callbacks = {
		"complete":{"object":viewerWidget,"method":viewerWidget.handleWidgetSaveDone},
		"fault":{"object":this,"method":this.onFault}
		};

	var asynchRequest = new AsynchJSONDispatcherEntry(cognosViewer);
	asynchRequest.setCallbacks(callbacks);

	this.populateRequestParams(asynchRequest);

	cognosViewer.dispatchRequest(asynchRequest);
};

CCognosViewerSaveReport.prototype.onFault = function(asynchJSONResponse, arg1){

	var cognosViewer = this.m_cognosViewer;
	var viewerWidget = this.getViewerWidget();

	var soapFaultEnvelope = asynchJSONResponse.getSoapFault();
	var soapFaultNode = XMLHelper_FindChildByTagName(soapFaultEnvelope, "Fault", true);
	
	if( this.ifIsEmptySelectionFault( soapFaultNode ) )
	{
		this.handleEmptySelectionFault();
		return;
	}

	// set retry to False - can't retry a save
	var retryNode = soapFaultEnvelope.createElement("allowRetry");
	retryNode.appendChild(soapFaultEnvelope.createTextNode("false"));
	soapFaultNode.appendChild(retryNode);

	var sSoapFault = XMLBuilderSerializeNode(soapFaultNode);

	cognosViewer.setSoapFault(sSoapFault);
	viewerWidget.handleFault();

	var saveDonePayload = {'status':false};
	viewerWidget.iContext.iEvents.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload );
};


/**
 * Returns true if the fault is caused by an attempt to update a non-existing report
 */
CCognosViewerSaveReport.prototype.ifIsEmptySelectionFault = function( soapFault ){
	if(soapFault) {
		var errorCodeElement = XMLHelper_FindChildByTagName(soapFault, 'errorCode', true);
		if( errorCodeElement )
		{
			var errorCode = XMLHelper_GetText(errorCodeElement, false);
			return ( errorCode === 'cmEmptySelection' );
		}
	}

	return false;
};

/**
 * Sends a save-as request
 */
CCognosViewerSaveReport.prototype.handleEmptySelectionFault = function(){
	
	delete (this.m_cognosViewer.envParams["savedReportName"]);
	this.m_doSaveAsOnFault = true;
	this.dispatchRequest();
};
