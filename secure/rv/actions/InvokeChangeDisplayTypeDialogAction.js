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

function InvokeChangeDisplayTypeDialogAction(){}

InvokeChangeDisplayTypeDialogAction.prototype = new CognosViewerAction();

InvokeChangeDisplayTypeDialogAction.prototype.execute = function() {
	var viewer = this.getCognosViewer();
	var selectedObject = this.getSelectedReportInfo();
	if(selectedObject)
	{
		var viewerWidget = viewer.getViewerWidget();
		var bGetInfoOnServer = false;
		if (selectedObject.suggestedDisplayTypesEnabled == true) {
			bGetInfoOnServer = (typeof selectedObject.possibleDisplayTypes == "undefined") || (typeof selectedObject.suggestedDisplayTypes == "undefined")? true : false;
		} else {
			bGetInfoOnServer = (typeof selectedObject.possibleDisplayTypes == "undefined");
		}
		if (bGetInfoOnServer)
		{
			var asynchRequest = new AsynchJSONDispatcherEntry(this.m_oCV);
			asynchRequest.setCallbacks({
				"complete": {"object": this, "method": this.handleResponse}
				});
			asynchRequest.setRequestIndicator(viewer.getRequestIndicator());
			
			asynchRequest.addFormField("ui.action", "getInfoFromReportSpec");
			asynchRequest.addFormField("bux", "true");
			
			asynchRequest.addNonEmptyStringFormField("modelPath", this.m_oCV.getModelPath());
			asynchRequest.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);
			asynchRequest.addDefinedFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
			asynchRequest.addFormField("cv.actionContext", this.addActionContext());
			asynchRequest.addFormField("ui.conversation", encodeURIComponent(this.m_oCV.getConversation()));
			
			viewer.dispatchRequest(asynchRequest);
		}
		else
		{
			viewerWidget.invokeDisplayTypeDialog(selectedObject.possibleDisplayTypes,selectedObject.suggestedDisplayTypes );
		}
	}

};

InvokeChangeDisplayTypeDialogAction.prototype.handleResponse = function(asynchJSONResponse)
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();

	var reportInfos = asynchJSONResponse.getResult();
	for ( var i in reportInfos.containers)
	{
		var selectedReportInfo = this.getReportInfo(reportInfos.containers[i].container);
		selectedReportInfo.possibleDisplayTypes = reportInfos.containers[i].possibleDisplayTypes;
		selectedReportInfo.suggestedDisplayTypes = reportInfos.containers[i].suggestedDisplayTypes;
	}
	var selectedObject = this.getSelectedReportInfo();
	viewerWidget.invokeDisplayTypeDialog(selectedObject.possibleDisplayTypes,selectedObject.suggestedDisplayTypes);
};

InvokeChangeDisplayTypeDialogAction.prototype.addActionContext = function()
{
	var actionContext = "<getInfoActions>";
	actionContext += "<getInfoAction name=\"GetInfo\">";
	actionContext += "<include><possibleDisplayTypes/></include>";
	actionContext += "<include><suggestedDisplayTypes/></include>";
	actionContext += this.getDataItemInfoMap();;
	actionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
	actionContext += "</getInfoAction>";
	actionContext += "</getInfoActions>";
	return actionContext;
};

InvokeChangeDisplayTypeDialogAction.prototype.updateMenu = function(jsonSpec)
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	jsonSpec.visible = oRAPReportInfo.containsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	var reportInfo = this.getSelectedReportInfo();	
	jsonSpec.disabled = (reportInfo == null || reportInfo.displayTypeId == null || !this.isInteractiveDataContainer(reportInfo.displayTypeId));
	
	if (jsonSpec.disabled)
	{
		jsonSpec.iconClass = "chartTypesDisabled";
		return jsonSpec;
	}
	jsonSpec.iconClass = "chartTypes";	
	return jsonSpec;

};
