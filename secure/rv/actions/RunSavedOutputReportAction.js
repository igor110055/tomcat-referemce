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

 /**
 * RunSavedOutputReportAction - implements re-run in cognos viewer
 */
function RunSavedOutputReportAction(){}
RunSavedOutputReportAction.prototype = new CognosViewerAction();

RunSavedOutputReportAction.prototype.updateMenu = function(jsonSpec) {
	var sAction = this.m_oCV.envParams["ui.action"];
	var bLiveReport = (sAction != "view" && sAction != "buxView" && this.m_oCV.getStatus() !== "fault");
	this.addMenuItemChecked(bLiveReport, jsonSpec);
	return jsonSpec;
};

RunSavedOutputReportAction.prototype.dispatchRequest = function(filters) {
	var cognosViewer = this.getCognosViewer();

	// The savedReportName will only be set if the user opened a saved dashboard, switched to saved output
	// and then reran the report. In this situation we need to clear the savedReportName so that when the user
	// saves the dashboard, a new report is created under the dashboard (bug COGCQ00278882)
	if (cognosViewer.envParams["savedReportName"]) {
		delete cognosViewer.envParams["savedReportName"];
	}

	// clear off the error page if this is invoked after a fault
	if( cognosViewer.getStatus() === 'fault')
	{
		var widget = this.getCognosViewer().getViewerWidget();
		widget.clearErrorDlg();
	}

	var sAction = cognosViewer.envParams["ui.action"];
	var formWarpRequest = document.getElementById("formWarpRequest" + cognosViewer.getId());

	if (cognosViewer.envParams["ui.reRunObj"])
	{
		cognosViewer.envParams["ui.object"] = cognosViewer.envParams["ui.reRunObj"];
	}
	else if (sAction == "view" && formWarpRequest && typeof formWarpRequest["reRunObj"] != "undefined" && formWarpRequest["reRunObj"] != null && formWarpRequest["reRunObj"].value.length > 0)
	{
		cognosViewer.envParams["ui.object"] = formWarpRequest["reRunObj"].value;
	}


	var oReq = new ViewerDispatcherEntry(cognosViewer);
	oReq.addFormField("ui.action", "bux");
	oReq.addFormField("widget.runFromSavedOutput", "true");
	oReq.addFormField("ui.object", cognosViewer.envParams["ui.object"]);
	oReq.addFormField("run.outputFormat", "HTML");
	oReq.addFormField("ui.primaryAction","");
	oReq.addFormField("widget.reloadToolbar", "true");
	oReq.addDefinedNonNullFormField("cv.objectPermissions", cognosViewer.envParams["cv.objectPermissions"]);
	oReq.addDefinedNonNullFormField("run.prompt", cognosViewer.envParams["promptOnRerun"]);
	oReq.addDefinedNonNullFormField("limitedInteractiveMode", cognosViewer.envParams["limitedInteractiveMode"]);
	oReq.addDefinedNonNullFormField("widget.globalPromptInfo", cognosViewer.getViewerWidget().getGlobalPromptsInfo());
	oReq.addDefinedNonNullFormField("baseReportSearchPath", cognosViewer.envParams["baseReportSearchPath"]);
	oReq.addNonEmptyStringFormField("cv.updateDataFilters", filters);

	// Clear the properties dialog to it'll get rebuilt. This is needed for the 'View report specification' link
	cognosViewer.getViewerWidget().clearPropertiesDialog();

	cognosViewer.preparePromptValues(oReq);
	
	cognosViewer.dispatchRequest(oReq);

	this.fireModifiedReportEvent();

	cognosViewer.envParams["ui.action"] = "run";
};

RunSavedOutputReportAction.prototype.execute = function() {
	this.gatherFilterInfoBeforeAction("RunSavedOutputReport");
};
