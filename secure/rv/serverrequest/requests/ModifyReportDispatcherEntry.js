/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/*
 *******************************************************************************
 *** View DispatcherEntry.js for information on the dispatcher entry classes ***
 *******************************************************************************
 */
function ModifyReportDispatcherEntry(oCV)
{
	ModifyReportDispatcherEntry.baseConstructor.call(this, oCV);
	this.m_action = null;
	if (oCV) {
		this.m_viewerWidget = oCV.getViewerWidget();

		this.setRequestHandler(new RequestHandler(oCV));
		this.setWorkingDialog(oCV.getWorkingDialog());
		this.setRequestIndicator(oCV.getRequestIndicator());

		this.setCallbacks({ 
			"complete" : {"object" : this, "method" : this.onComplete},
			"prompting" : {"object" : this, "method" : this.onPrompting}
		});	
	}
}
ModifyReportDispatcherEntry.prototype = new AsynchDataDispatcherEntry();
ModifyReportDispatcherEntry.baseConstructor = AsynchDataDispatcherEntry;
ModifyReportDispatcherEntry.prototype.parent = AsynchDataDispatcherEntry.prototype;


ModifyReportDispatcherEntry.prototype.initializeAction = function(action)
{
	this.setKey(action.getActionKey());
	this.setCanBeQueued(action.canBeQueued());
	
	this.m_action = action;
};

ModifyReportDispatcherEntry.prototype.getAction = function() {
	return this.m_action;
};

ModifyReportDispatcherEntry.prototype.prepareRequest = function()
{	
	if(this.m_viewerWidget){
		DispatcherEntry.addWidgetInfoToFormFields(this.m_viewerWidget, this);
	}
	
	var actionFormFields = new ActionFormFields(this);
	actionFormFields.addFormFields();

	if (this.m_viewerWidget) {
		this.addFormField("cv.id", this.m_viewerWidget.getViewerId());
	}
	this.addFormField("keepIterators", "true");
	this.addFormField("run.prompt", this.m_action.getPromptOption());

	if(this.m_action.reuseQuery() === true) {
		this.addFormField("reuseResults", "true");
	}
	else if (this.m_action.reuseGetParameter() === true) {
		this.addFormField("reuseResults", "paramInfo");
	}

	if(this.m_action.keepRAPCache() === false && this.m_viewerWidget) {
		// delete the rap cache
		this.m_viewerWidget.clearRAPCache();
	}
	
	if (this.m_action.reuseConversation() === true) {
		this.addFormField("cv.reuseConversation", "true");
	}
	
	if (this.m_action.isUndoable() && this.m_action.getUndoRedoQueue()) {
		this.m_action.getUndoRedoQueue().initUndoObj({"tooltip" : this.m_action.getUndoHint(), "saveSpec" : this.m_action.saveSpecForUndo()});
	}
	
	// So that we'll end up on the same tab
	if (this.getViewer().getCurrentlySelectedTab() && !this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")) {
		this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup", this.getViewer().getCurrentlySelectedTab());
	}
	
	this.getViewer().clearTabs();
};

ModifyReportDispatcherEntry.prototype.onComplete = function(asynchDATAResponse, arg1)
{
	if (this.getRequestHandler()) {
		this.getRequestHandler().onComplete(asynchDATAResponse);
	}
};

ModifyReportDispatcherEntry.prototype.onPrompting = function(response) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().onPrompting(response);
	}
};

/**
 * Need to update the Viewer state with any information we might have gotten in the working response
 * @param {Object} asynchDATAResponse
 * @param {Object} arg1
 */
ModifyReportDispatcherEntry.prototype.onWorking = function(asynchDATAResponse, arg1)
{
	this.parent.onWorking.call(this, asynchDATAResponse, arg1);
	var responseState = asynchDATAResponse.getResponseState();
	if (this.getRequestHandler()) {
		this.getRequestHandler().updateViewerState(responseState);
	}	
};