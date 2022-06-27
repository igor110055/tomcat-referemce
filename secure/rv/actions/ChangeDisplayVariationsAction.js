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

function ChangeDisplayVariationsAction(){}

ChangeDisplayVariationsAction.prototype = new CognosViewerAction();

function ChangeDisplayVariationsAction()
{
	this.m_requestParams = null;
}

ChangeDisplayVariationsAction.prototype.setRequestParms = function(parms)
{
	this.m_requestParams = parms;
};


ChangeDisplayVariationsAction.prototype.execute = function() {
	var groupId = this.m_requestParams.groupId; //from dialog.
	var viewer = this.getCognosViewer();
	var selectedObject = this.getSelectedReportInfo();
	if(selectedObject)
	{
		var viewerWidget = viewer.getViewerWidget();
		if (typeof selectedObject.suggestedDisplayVariations == "undefined")
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
			asynchRequest.addFormField("cv.actionContext", this.addActionContext(groupId));

			viewer.dispatchRequest(asynchRequest);
		}
		else
		{
			viewerWidget.updateDisplayTypeDialogVariations(selectedObject.possibleDisplayTypes,selectedObject.suggestedDisplayVariations );
		}
	}

};

ChangeDisplayVariationsAction.prototype.handleResponse = function(asynchJSONResponse)
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();

	var reportInfos = asynchJSONResponse.getResult();
	for ( var i in reportInfos.containers)
	{
		var selectedReportInfo = this.getReportInfo(reportInfos.containers[i].container);
		selectedReportInfo.possibleDisplayTypes = reportInfos.containers[i].possibleDisplayTypes;
		selectedReportInfo.variationGroups = reportInfos.containers[i].variationGroups;
	}
	var selectedObject = this.getSelectedReportInfo();
	viewerWidget.updateDisplayTypeDialogVariations(selectedObject.possibleDisplayTypes,selectedObject.variationGroups);
};

ChangeDisplayVariationsAction.prototype.addActionContext = function(groupId)
{
	var actionContext = "<getInfoActions>";
	actionContext += "<getInfoAction name=\"GetInfo\">";
	actionContext += "<include><suggestedDisplayVariations/></include>";
	actionContext += this.getDataItemInfoMap();;
	actionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
	actionContext += "<groupId>";
	actionContext += groupId;
	actionContext += "</groupId>";
	actionContext += "</getInfoAction>";
	actionContext += "</getInfoActions>";
	return actionContext;
};
