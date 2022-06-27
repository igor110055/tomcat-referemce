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
/*
 *******************************************************************************
 *** View DispatcherEntry.js for information on the dispatcher entry classes ***
 *******************************************************************************
 */
/**
 * Should be treated as an abstract class and ViewerDispatcherEntry should
 * be used for the request
 * @param {Object} oCV
 */
function ReportDispatcherEntry(oCV) {
	ReportDispatcherEntry.baseConstructor.call(this, oCV);
	
	if (oCV) {
		ReportDispatcherEntry.prototype.setDefaultFormFields.call(this);
	
		this.setRequestHandler(new RequestHandler(oCV));
		this.setWorkingDialog(oCV.getWorkingDialog());
		this.setRequestIndicator(oCV.getRequestIndicator());
		
		this.setCallbacks( {
			"complete" : {"object" : this, "method" : this.onComplete},
			"prompting" : {"object" : this, "method" : this.onComplete}
		});
	}
}

ReportDispatcherEntry.prototype = new AsynchDataDispatcherEntry();
ReportDispatcherEntry.baseConstructor = AsynchDataDispatcherEntry;
ReportDispatcherEntry.prototype.parent = AsynchDataDispatcherEntry.prototype;

ReportDispatcherEntry.prototype.prepareRequest = function() {
	var action = this.getFormField("ui.action");
	var actionState = this.getViewer().getActionState();
	if (actionState !== "" && ( action == "wait" || action == "forward" || action == "back")) {
		this.addFormField("cv.actionState", actionState);
	}	
	
	var safeTabActions = ["nextPage", "previousPage", "firstPage", "lastPage", "reportAction", "cancel", "wait"];
	var clearTabs = true;
	for (var i=0; i < safeTabActions.length; i++) {
		if (safeTabActions[i] == action) {
			clearTabs = false;
			break;
		}
	}
	
	if (clearTabs) {
		this.getViewer().clearTabs();
	}
	
	// So that we'll end up on the same tab
	if (this.getViewer().getCurrentlySelectedTab() && !this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")) {
		this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup", this.getViewer().getCurrentlySelectedTab());
	}
};


/**
 * Add all the default form fields needed for report requests (next page, render, ...)
 */
ReportDispatcherEntry.prototype.setDefaultFormFields = function() {
	var oCV = this.getViewer();
	var envParams = oCV.envParams;
	
	this.addFormField("cv.id", oCV.getId());
	if (envParams["cv.showFaultPage"]) {
		this.addFormField("cv.showFaultPage", envParams["cv.showFaultPage"]);
	}
	else {
		this.addFormField("cv.showFaultPage", "false");		
	}
	
	this.addDefinedNonNullFormField("ui.object", envParams["ui.object"]);
	this.addDefinedNonNullFormField("ui.primaryAction", envParams["ui.primaryAction"]);
	this.addDefinedNonNullFormField("ui.objectClass", envParams["ui.objectClass"]);
	this.addNonEmptyStringFormField("specificationType", envParams["specificationType"]);
	this.addNonEmptyStringFormField("cv.promptForDownload", envParams["cv.promptForDownload"]);
	this.addNonEmptyStringFormField("ui.conversation", oCV.getConversation());
	this.addNonEmptyStringFormField("m_tracking", oCV.getTracking());
	
	var sExecutionParameters = oCV.getExecutionParameters();
	this.addNonEmptyStringFormField("executionParameters", sExecutionParameters);

	var sCAF = oCV.getCAFContext();
	this.addDefinedNonNullFormField("ui.cafcontextid", sCAF);
};

/**
 * Need to update the Viewer state with any information we might have gotten in the working response
 * @param {Object} asynchDATAResponse
 * @param {Object} arg1
 */
ReportDispatcherEntry.prototype.onWorking = function(asynchDATAResponse, arg1) {
	var responseState = asynchDATAResponse.getResponseState();
	var reqHandler = this.getRequestHandler();
	if (reqHandler) {
		var workingDialog = reqHandler.getWorkingDialog();
		if( workingDialog && workingDialog.setSecondaryRequests && responseState.m_aSecRequests )
		{
			workingDialog.setSecondaryRequests( responseState.m_aSecRequests );
		}
	}	
	
	DispatcherEntry.prototype.onWorking.call(this, asynchDATAResponse, arg1);	
	
	if (reqHandler) {
		this.getRequestHandler().updateViewerState(responseState);
	}

};

ReportDispatcherEntry.prototype.onComplete = function(asynchDATAResponse, arg1) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().onComplete(asynchDATAResponse);
	}
};
