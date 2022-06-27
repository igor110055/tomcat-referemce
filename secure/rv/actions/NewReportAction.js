/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function NewReportAction() {
	this._viewerIWidget = null;
	this._packageSearchPath = null;
	this._webContentRoot = null;
	this._gateway = null;
	this._capabilitiesXml =  null;
	this._cafContextId = null;
}
NewReportAction.prototype = new EditContentAction();
NewReportAction.prototype.parent = EditContentAction.prototype;

NewReportAction.prototype.clearSelections = function() {};

NewReportAction.prototype.getCognosViewer = function() {
	return this.getViewerIWidget().getViewerObject();
};

NewReportAction.prototype.setRequestParms = function(params) {
	this.parent.setRequestParms.call(this, params);
	
	this._packageSearchPath = params.packageSearchPath;
	this._viewerIWidget = params.viewerIWidget;	
	this._webContentRoot = params.webContentRoot;
	this._gateway = params.gateway;
	this._capabilitiesXml =  params.capabilitiesXml;
	this._cafContextId = params.cafContextId;
};

NewReportAction.prototype.getViewerIWidget = function() {
	return this._viewerIWidget;
};

NewReportAction.prototype.getGateway = function() {
	return this._gateway;
};

NewReportAction.prototype.getCapabilitiesXml = function() {
	return this._capabilitiesXml;
};

NewReportAction.prototype.getCafContextId = function() {
	return this._cafContextId ? this._cafContextId : "";
};

NewReportAction.prototype.getWebContent = function() {
	return this._webContentRoot;
};

NewReportAction.prototype.setReportSettings = function() {
	var oContext = {
		"showOpenTransition" : false,
		"model" : this._packageSearchPath
	};

	var buaWindow = this.getBUAWindow();
	buaWindow.Application.SetBUAContext(oContext);
};

/**
 * Adds any extra parameters needed when creating a new report
 */
NewReportAction.prototype.addExtraLaunchParameters = function(RSParameters) {
	RSParameters.model = this._packageSearchPath;
};


NewReportAction.prototype.cancelPressed = function() {
	this.getViewerIWidget().iContext.iEvents.fireEvent("com.ibm.bux.widget.action", null, { action: 'deleteWidget' });
};

/**
 * Get the information from CWA and recall the onLoad of the Viewer iWidget
 */
NewReportAction.prototype.runUpdatedReportFromBUA = function() {
	var iWidget = this.getViewerIWidget();
	
	iWidget.setAttributeValue("reportCreatedInCW", "true");
	
	var oContext = this.getBUAWindow().Application.GetBUAContext();
	iWidget.setNewReportInfo({
		"ui.spec" : oContext.reportXML,
		"m_tracking" : oContext.tracking ? oContext.tracking : "",
		"parameterValues" : oContext.parameterValues ? oContext.parameterValues : ""
	});
	
	iWidget.onLoad();
};