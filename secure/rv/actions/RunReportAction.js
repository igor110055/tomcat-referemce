/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 /**
 * This is the base class for generating request to re-run the report.
 * Classes derived from this will add to it their specific options.
 */
function RunReportAction()
{
	this.m_reuseQuery = false;
	this.m_promptValues = null;
	this.m_sendParameterValues = false;
	this.m_clearCascadeParamsList = null;
	
}

RunReportAction.prototype = new CognosViewerAction();

RunReportAction.prototype.setRequestParams = function( params ) {
	if( !params ){ return; }
	
	this.m_promptValues = params.promptValues;
	this.m_clearCascadeParamsList = params.clearCascadeParamsList;
};


RunReportAction.prototype.setSendParameterValues = function(sendParameterValues) {
	this.m_sendParameterValues = sendParameterValues;
};

RunReportAction.prototype.reuseQuery =function() { return this.m_reuseQuery; };
RunReportAction.prototype.setReuseQuery = function( value ) { this.m_reuseQuery = value; };
RunReportAction.prototype.getPromptOption = function() { return "false";};
RunReportAction.prototype.canBeQueued = function() { return false; };

RunReportAction.prototype.getAction = function( limitedInteractiveMode ) {
	return limitedInteractiveMode ? 'run' : 'runSpecification';
}

/**
 * Overrides base method in CognosViewerAction
 */
RunReportAction.prototype.addAdditionalOptions = function(cognosViewerRequest)
{
	this._addCommonOptions(cognosViewerRequest);
	this._addRunOptionsFromProperties(cognosViewerRequest);
	this._addClearCascadeParams( cognosViewerRequest );
	this._addPromptValuesToRequest( cognosViewerRequest );


};

RunReportAction.prototype._addClearCascadeParams = function( oReq )
{
	if( !this.m_clearCascadeParamsList || this.m_clearCascadeParamsList.length == 0){
		return;
	}

	var iCount = this.m_clearCascadeParamsList.length;
	for( var i=0; i <iCount; i++){
		oReq.addFormField('c' + this.m_clearCascadeParamsList[i], '1');//adding bogus value so viewer won't reject the parameter.
	}
};
RunReportAction.prototype._addPromptValuesToRequest = function( cognosViewerRequest )
{
	if ( !this.m_promptValues ){ return; }
	
	cognosViewerRequest.addFormField("sharedPromptRequest", "true");
	for (var promptValue in this.m_promptValues)
	{
		cognosViewerRequest.addFormField( promptValue, this.m_promptValues[promptValue] );
	}
	
};


RunReportAction.prototype._addCommonOptions = function(oReq)
{
	var limitedInteractiveMode = this.getCognosViewer().isLimitedInteractiveMode();
	if( typeof this.m_action === "undefined" )
	{
		this.m_action = this.getAction( limitedInteractiveMode );
	}

	oReq.addFormField("run.prompt", this.getPromptOption());
	oReq.addFormField("ui.action", this.m_action);

	if( limitedInteractiveMode )
	{
		oReq.addFormField("run.xslURL", "bux.xsl");
	}

	oReq.addFormField("run.outputFormat", "HTML");

	if( this.reuseQuery() === true )
	{
		oReq.addFormField("reuseResults", "true");
	}
};


RunReportAction.prototype._addRunOptionsFromProperties = function(oReq)
{
	var properties = this.getCognosViewer().getViewerWidget().getProperties();
	if (properties.getRowsPerPage() != null)
	{
		oReq.addFormField("run.verticalElements", properties.getRowsPerPage());
	}
};

/**
 * Overrides base method in CognosViewerAction
 */
RunReportAction.prototype.execute = function()
{
	var oReq = this.createCognosViewerDispatcherEntry(this.m_action);
	oReq.setCanBeQueued( this.canBeQueued() );

	if( (this.m_action === "forward" || this.m_action === "back") && ( typeof this.m_bAbortAction === "undefined" || this.m_bAbortAction === true ) )
	{
		return false;
	}
	
	var oCV = this.getCognosViewer();
	if (this.m_sendParameterValues && oCV.envParams["delayedLoadingExecutionParams"]) {
		oReq.addFormField("delayedLoadingExecutionParams", oCV.envParams["delayedLoadingExecutionParams"]);
		delete oCV.envParams["delayedLoadingExecutionParams"];
	}

	this.getCognosViewer().dispatchRequest(oReq);
	return true;
};

RunReportAction.prototype.doAddActionContext = function()
{
	return false;
};

RunReportAction.prototype.updateMenu = function(json)
{
	json.visible = !this.isPromptWidget();
	return json;
};
