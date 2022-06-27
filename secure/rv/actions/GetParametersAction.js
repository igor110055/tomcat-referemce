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

function GetParametersAction()
{
	this.m_payload = "";
	this.isPrimaryPromptWidget = false;
	this.m_requestParamsCopy = null;
}

GetParametersAction.prototype = new RunReportAction();

GetParametersAction.prototype.setRequestParms = function(payload)
{
	this.m_payload = payload;
};


/*
 * Adds the options to the request that is sent to the server
 */
GetParametersAction.prototype.addRequestOptions = function(asynchRequest)
{
	asynchRequest.addFormField("asynch.alwaysIncludePrimaryRequest", "false" );
	asynchRequest.addFormField("ui.action", "getParameters" );
	asynchRequest.addFormField("ui.spec", this.m_oCV.envParams["ui.spec"] );
	asynchRequest.addFormField("ui.object", this.m_oCV.envParams["ui.object"] );
	asynchRequest.addFormField("isPrimaryPromptWidget", this.isPrimaryPromptWidget? "true" : "false" );
	asynchRequest.addFormField("parameterValues", this.m_oCV.getExecutionParameters());
	if (this.m_oCV.envParams["bux"] == "true") {
		asynchRequest.addFormField("bux", "true");
	}
};

GetParametersAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();
	
	var asynchRequest = new AsynchJSONDispatcherEntry(oCV);
	asynchRequest.setCallbacks({
		"complete": {"object": this, "method": this.handleGetParametersResponse}
		});

	this.addRequestOptions( asynchRequest );
	// save prompt params
	if (oCV.getActiveRequest()) {
		this.m_requestFormFieldsCopy = oCV.getActiveRequest().getFormFields();
	}

	// special case where we don't want to go through the ViewerDispatcher
	// since we don't want this request to get queue. We need to get the parameter information
	// asap so the other reports on the canvas can start executing with the new prompt information
	asynchRequest.sendRequest();
};


GetParametersAction.prototype.handleGetParametersResponse = function (asynchResponse)
{
	try
	{
		var jsonResponse = asynchResponse.getResult();
		var response = jsonResponse.xml;
		var cognosViewer = this.getCognosViewer();
		var viewerWidget = cognosViewer.getViewerWidget();
		
		if (typeof response != "undefined" && response != null) {
			var sReportPrompts = xml_decode(response);
			this.m_oCV.envParams["reportPrompts"] = sReportPrompts;
			if (this.isPrimaryPromptWidget) {
				this.m_oCV.raisePromptEvent(sReportPrompts, this.m_requestFormFieldsCopy);
			}
			else {
				viewerWidget.sharePrompts(this.m_payload);
			}
		}

		if (typeof viewerWidget != "undefined") {
			viewerWidget.promptParametersRetrieved = true;
			// do we need to re-add the Reprompt button to the toolbar ?
			var savedRepromptButton = viewerWidget.getButtonFromSavedToolbarButtons("Reprompt");
			if (typeof savedRepromptButton != "undefined" && savedRepromptButton != null) {
				var blueDotMenu = cognosViewer.findBlueDotMenu();
				if (cognosViewer.addedButtonToToolbar(blueDotMenu, savedRepromptButton.button, "Refresh", savedRepromptButton.position)) {
					cognosViewer.resetbHasPromptFlag();
					viewerWidget.updateToolbar();
				}
				viewerWidget.removeFromSavedToolbarButtons("Reprompt");
			}
		}
	}
	catch(e) {	}
};
