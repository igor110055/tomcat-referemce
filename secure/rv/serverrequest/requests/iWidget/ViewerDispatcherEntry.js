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
function ViewerDispatcherEntry(oCV) {
	ViewerDispatcherEntry.baseConstructor.call(this, oCV);
	
	if (oCV) {
		ViewerDispatcherEntry.prototype.setDefaultFormFields.call(this);

		this.setCallbacks( {
			"prompting" : {"object" : this, "method" : this.onPrompting}
		});
				
		var iWidget = oCV.getViewerWidget();
		if (iWidget.m_originalFormFields) {
			this.setOriginalFormFields(iWidget.m_originalFormFields);
			iWidget.m_originalFormFields = null;
		}
	}
}

ViewerDispatcherEntry.prototype = new ReportDispatcherEntry();
ViewerDispatcherEntry.baseConstructor = ReportDispatcherEntry;
ViewerDispatcherEntry.prototype.parent = ReportDispatcherEntry.prototype;

/**
 * Gets called right before the request is sent
 */
ViewerDispatcherEntry.prototype.prepareRequest = function() {
	this.parent.prepareRequest.call(this);
	var oWidget = this.getViewer().getViewerWidget();
	
	
	
	if (this.getFormField("widget.reloadToolbar")) {
		this.addFormField("cv.buxCurrentUserRole", oWidget.getUserRole());
	}
	if(oWidget){	
		DispatcherEntry.addWidgetInfoToFormFields(oWidget, this);
	}
	// Set it to false here before we send the request. This bolean lets us know when all the
	// inline scripts from the data response are done executing
	this.getViewer().inlineScriptsDoneExecuting = false;
		
};

/**
 * Add any iWidget specific form fields
 */
ViewerDispatcherEntry.prototype.setDefaultFormFields = function() {
	var oCV = this.getViewer();
	var widget = oCV.getViewerWidget();
	var envParams = oCV.envParams;
	
	this.addFormField("bux", "true");	
	this.addFormField("cv.showFaultPage", "false");		
	this.addDefinedNonNullFormField("baseReportModificationTime", envParams["baseReportModificationTime"]);
	this.addDefinedNonNullFormField("originalReport", envParams["originalReport"]);
	this.addDefinedNonNullFormField("ui.reportDrop", envParams["ui.reportDrop"]);
	this.addDefinedNonNullFormField("ui.preserveRapTags", envParams["ui.preserveRapTags"]);

	if (widget.getProperties()) {
		var flashChartOptionValue = widget.getProperties().getFlashCharts(); //properties is in undo/redo stack, so we can get current setting.
		if( flashChartOptionValue != null ) {
			this.addDefinedNonNullFormField("savedFlashChartOption", flashChartOptionValue);
				
			if (envParams.hasAVSChart) {
				this.addDefinedNonNullFormField("hasAVSChart", envParams.hasAVSChart);
			}
			else {
				this.addDefinedNonNullFormField("hasAVSChart", oCV.hasAVSChart());
			}
		}
	}
	
	var cvGateway = widget.getAttributeValue("gateway");
	if(cvGateway) {
		this.addDefinedNonNullFormField("cv.gateway", cvGateway);	
	}
	var cvWebcontent = widget.getAttributeValue("webcontent");
	if(cvWebcontent) {
		this.addDefinedNonNullFormField("cv.webcontent", cvWebcontent);
	}
	
	if (oCV.envParams["cv.outputKey"]) {
		this.addFormField("cv.outputKey", oCV.envParams["cv.outputKey"]);
		this.addFormField("b_action", "cvx.high");
		delete oCV.envParams["cv.outputKey"];
	}

	if (widget.getXNodeId()) {
		this.setHeaders({"X-Node-ID" : widget.getXNodeId()});
		widget.setXNodeId(null);
	}
};

ViewerDispatcherEntry.prototype.onPrompting = function(response) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().onPrompting(response);
	}
};
