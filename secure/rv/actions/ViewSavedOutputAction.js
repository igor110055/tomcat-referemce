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

function ViewSavedOutputAction()
{
	this.m_obj = "";
	this.creationTime = "";
	this.m_mostRecent = false;
}
ViewSavedOutputAction.prototype = new CognosViewerAction();

ViewSavedOutputAction.prototype.addAdditionalRequestParms = function(cognosViewerRequest) {};

ViewSavedOutputAction.prototype.setRequestParms = function(payload) {
	this.m_obj = payload.obj;
	this.creationTime = payload.creationTime;
	this.m_mostRecent = payload.mostRecent;
};

ViewSavedOutputAction.prototype.updateMenu = function() {
	// update the menu so the saved output that's going to be viewed is shown as selected
	var snapshotsAction = this.getCognosViewer().getAction("Snapshots");
	snapshotsAction.populateMenu(false);
};

ViewSavedOutputAction.prototype.execute = function() {
	var cognosViewer = this.getCognosViewer();
	var widget = cognosViewer.getViewerWidget();
	

	if( cognosViewer.getStatus() === 'fault')
	{
		widget.clearErrorDlg();
	}

	// clear the global prompt information
	cognosViewer.getViewerWidget().setPromptParametersRetrieved(false);
	cognosViewer.envParams["reportPrompts"] = "";

	var sAction = cognosViewer.envParams["ui.action"];
	var formWarpRequest = document.getElementById("formWarpRequest" + cognosViewer.getId());
	if (sAction == "view" && formWarpRequest && formWarpRequest.reRunObj && formWarpRequest.reRunObj.value ) {
		cognosViewer.envParams["ui.reRunObj"] = formWarpRequest["reRunObj"].value;
	} else if (sAction != "view") {
		cognosViewer.envParams["ui.reRunObj"] = cognosViewer.envParams["ui.object"];
	}

	var searchPath = "storeID('" + this.m_obj + "')";
	cognosViewer.envParams["ui.action"] = "buxView";
	cognosViewer.envParams["ui.object"] = cognosViewer.envParams["ui.reRunObj"];
	cognosViewer.envParams["creationTime"] = this.creationTime;

	if (this.m_mostRecent === true) {
		widget.setSavedOutputSearchPath(null);
	}
	else {
		widget.setSavedOutputSearchPath(searchPath);
	}

	// update the menu so the saved output that's going to be viewed is shown as selected
	this.updateMenu();

	// clear the undo queue
	this.getUndoRedoQueue().clearQueue();

	// Clear the properties dialog to it'll get rebuilt. This is needed for the 'View report specification' link
	cognosViewer.getViewerWidget().clearPropertiesDialog();

	if (cognosViewer.getCurrentlySelectedTab() && widget.getSavedOutput()) {
		cognosViewer.setKeepTabSelected(cognosViewer.getCurrentlySelectedTab());
	}
	
	this.dispatchRequest(searchPath);

	this.fireModifiedReportEvent();
};

ViewSavedOutputAction.prototype.dispatchRequest = function(searchPath) {
	this.m_request = new ViewerDispatcherEntry(this.m_oCV);
	this.m_request.addFormField("ui.action", "buxView");
	// we need to include the report name or we'll end up doing 2 CM queries.
	this.m_request.addFormField("ui.name", this.m_oCV.envParams["ui.name"]);
	this.m_request.addFormField("widget.reloadToolbar", "true");
	this.m_request.addFormField("cv.objectPermissions", this.m_oCV.envParams["cv.objectPermissions"]);
	this.m_request.addFormField("ui.savedOutputSearchPath", searchPath);

	this.m_request.setCallbacks( {"complete" : {"object" : this, "method" : this.onComplete}});
			
	this.addAdditionalRequestParms(this.m_request);
	
	this.m_oCV.dispatchRequest(this.m_request);
};

ViewSavedOutputAction.prototype.onComplete = function(asynchDATAResponse, arg1) {
	this.m_oCV.setTracking("");
	this.m_oCV.setConversation("");
	this.m_request.onComplete(asynchDATAResponse, arg1);
};
