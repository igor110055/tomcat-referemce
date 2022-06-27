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

function ExportAction() {
	this.m_format = "";
	this.m_responseFormat = "";
}

ExportAction.prototype = new CognosViewerAction();

ExportAction.prototype.getWindowTitle = function() {
	return "";
};

ExportAction.prototype.execute = function() {
	if (!this.m_format) {
		return false;
	}

	this.initializeForm();
	this.insertGenericFormElements();
	this.insertSpecializedFormElements();

	return this.sendRequest();
};

ExportAction.prototype.addFormField = function(sName, sValue) {
	if(console) { 
		console.log("Required method ExportAction.addFormField not implemented");
	}
};

ExportAction.prototype.initializeForm = function() {
	if(console) {
		console.log("Required method ExportAction.initializeForm not implemented");
	}
};

ExportAction.prototype.sendRequest = function() {
	if(console) {
		console.log("Required method ExportAction.sendRequest not implemented");;
	}
};

ExportAction.prototype.insertGenericFormElements = function() {
	var sRunPrompt = "false";
	var bAction = 'cognosViewer';

	this.addFormField("b_action", bAction);
	this.addFormField("cv.toolbar", "false");
	this.addFormField("cv.header", "false");
	this.addFormField("ui.windowtitleformat", 'chromeless_window_action_format');
	this.addFormField("ui.name", this.getObjectDisplayName());
	this.addFormField("cv.responseFormat", this.m_responseFormat);
	this.addFormField("ui.reuseWindow", "true");

	var sUiSpec = this.m_oCV.envParams["ui.spec"]; // TODO: we may not need this when we move to one Tomcat environment
	var sUiConversation = this.m_oCV.getConversation();

	this.addFormField("ui.action", 'export');
	this.addFormField("ui.conversation", sUiConversation);
	this.addFormField("run.prompt", sRunPrompt);
	this.addFormField('asynch.attachmentEncoding', 'base64');
	this.addFormField("run.outputEncapsulation", 'URLQueryString');
	this.addFormField("ui.spec", sUiSpec);
	this.addFormField("rap.reportInfo", this.m_oCV.envParams["rapReportInfo"]);

	if (this.m_oCV.envParams["ui.routingServerGroup"]) {
		this.addFormField("ui.routingServerGroup", this.m_oCV.envParams["ui.routingServerGroup"]);
	}

	var viewerWidget = this.m_oCV.getViewerWidget();
	if(viewerWidget != null) {
		//Technically, this call could be asynchronous, however we assume that if
		//the user is exporting a report, there's already a storeid.
		dojo.when(viewerWidget.getWidgetStoreID(),
			dojo.hitch(this, function(widgetStoreID) {
				if(typeof widgetStoreID != "undefined" && widgetStoreID != null) {
					this.addFormField('widgetStoreID', widgetStoreID);
				}
			})
		);
		var cvGateway = viewerWidget.getAttributeValue("gateway");
		if(cvGateway) {
			this.addFormField('cv.gateway', cvGateway);
		}
		var cvWebcontent = viewerWidget.getAttributeValue("webcontent");
		if(cvWebcontent) {
			this.addFormField('cv.webcontent', cvWebcontent);
		}
	}
	this.addFormField("rap.parametersInfo", CViewerCommon.buildParameterValuesSpec(this.m_oCV));

};

ExportAction.prototype.insertSpecializedFormElements = function(request) {
	this.addFormField("run.outputFormat", this.m_format);
	this.addFormField("ui.windowtitleaction", this.getWindowTitle());
};

ExportAction.prototype.updateMenu = function(json) {
	json.visible = !this.isPromptWidget();
	if (this.m_oCV.isIWidgetMobile()) {
		json.flatten = true;
	}
	return json;
};

function ExportFromIframeAction() {
	this.m_format = "";
	this.m_responseFormat = "downloadObject";
}

ExportFromIframeAction.prototype = new ExportAction();

ExportFromIframeAction.prototype.initializeForm = function() {
	this.oRequest = new HiddenIframeDispatcherEntry(this.getCognosViewer());
	this.addFormField("cv.detachRelease", "true");
};

ExportFromIframeAction.prototype.addFormField = function(sName, sValue) {
	this.oRequest.addFormField(sName, sValue);
};

ExportFromIframeAction.prototype.sendRequest = function() {
	this.getCognosViewer().dispatchRequest(this.oRequest);
	return true;
};
