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

/**
 * Class which knows what form fields are needed for the Action classes
 * and info requests
 * @param {Object} DispatcherEntry
 */
function ActionFormFields(dispatcherEntry) {
	this.m_dispatcherEntry = dispatcherEntry;
	this.m_oCV = dispatcherEntry.getViewer();
}

ActionFormFields.prototype.addFormFields = function() {
	var dispatcherEntry = this.m_dispatcherEntry;
	var action = dispatcherEntry.getAction();
	
	action.preProcess();

	dispatcherEntry.addFormField("ui.action", "modifyReport");

	if(this.m_oCV.getModelPath() !== "") {
		dispatcherEntry.addFormField("modelPath", this.m_oCV.getModelPath());
		if(typeof this.m_oCV.envParams["metaDataModelModificationTime"] != "undefined") {
			dispatcherEntry.addFormField("metaDataModelModificationTime", this.m_oCV.envParams["metaDataModelModificationTime"]);
		}
	}

	if( action.doAddActionContext() === true ) {
		var actionContext = action.addActionContext();
		dispatcherEntry.addFormField("cv.actionContext", actionContext);
		if (window.gViewerLogger) {
			window.gViewerLogger.log('Action context', actionContext, "xml");
		}
	}

	var isBux = this.m_oCV.envParams["bux"] == "true";
	
	if (isBux) {
		dispatcherEntry.addFormField("cv.showFaultPage", "false");
	}
	else {
		dispatcherEntry.addFormField("cv.showFaultPage", "true");
	}
	dispatcherEntry.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);
	dispatcherEntry.addDefinedFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
	dispatcherEntry.addDefinedFormField("modelPath", this.m_oCV.envParams["modelPath"]);
	dispatcherEntry.addDefinedFormField("packageBase", this.m_oCV.envParams["packageBase"]);
	dispatcherEntry.addDefinedFormField("rap.state", this.m_oCV.envParams["rap.state"]);
	dispatcherEntry.addDefinedFormField("rap.reportInfo", this.m_oCV.envParams["rapReportInfo"]);
	dispatcherEntry.addDefinedFormField("ui.primaryAction", this.m_oCV.envParams["ui.primaryAction"]);
	dispatcherEntry.addNonNullFormField("cv.debugDirectory", this.m_oCV.envParams["cv.debugDirectory"]);
	dispatcherEntry.addNonNullFormField("ui.objectClass", this.m_oCV.envParams["ui.objectClass"]);
	dispatcherEntry.addNonNullFormField("bux", this.m_oCV.envParams["bux"]);
	dispatcherEntry.addNonNullFormField("baseReportModificationTime", this.m_oCV.envParams["baseReportModificationTime"]);
	dispatcherEntry.addNonNullFormField("originalReport", this.m_oCV.envParams["originalReport"]);

	//Flash chart option
	var flashChartOptionValue = this.m_oCV.getFlashChartOption();
	if( flashChartOptionValue != null)
	{
		dispatcherEntry.addFormField("savedFlashChartOption", flashChartOptionValue);
		if (flashChartOptionValue && action !=null && typeof(action.m_requestParams)!= "undefined" && typeof(action.m_requestParams.targetType)!= "undefined")	{
			var hasAVSChart = false;
			var sTarget = null;
			if (typeof(action.m_requestParams.targetType.targetType)!= "undefined") {
				//fix for Defect:COGCQ00676339 Error generated on conversion of crosstab to chart, with chart animation enabled
				//TargetType may be an Object type
				sTarget = action.m_requestParams.targetType.targetType;
			} else {
				sTarget = action.m_requestParams.targetType;
			}
			
			if (sTarget.match('v2_') != null || sTarget.match('_v2') != null)
			{
				hasAVSChart = true;
			}
			else
			{
				var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
				var selectedReportInfo = action.getSelectedReportInfo();
				if (oRAPReportInfo && selectedReportInfo) {
					// get all the display types except for the currently selected container. We already checked
					// the currently selected container in the about 'if' statement
					var sDisplayTypes = oRAPReportInfo.getDisplayTypes(selectedReportInfo.container);
					
					if (sDisplayTypes.match('v2_') != null || sDisplayTypes.match('_v2') != null) {
						hasAVSChart = true;
					}
				}
			}
			dispatcherEntry.addFormField("hasAVSChart", hasAVSChart);
		}
		else
		{
			dispatcherEntry.addFormField("hasAVSChart", this.m_oCV.hasAVSChart());
		}
	}

	var sEP = this.m_oCV.getExecutionParameters();
	if (sEP) {
		dispatcherEntry.addFormField("executionParameters", encodeURIComponent(sEP));
	}

	dispatcherEntry.addFormField("ui.conversation", encodeURIComponent(this.m_oCV.getConversation())); //MARK: needed? (its a primary request)
	dispatcherEntry.addFormField("m_tracking", encodeURIComponent(this.m_oCV.getTracking())); //MARK: needed? (its a primary request)

	var sCAF = this.m_oCV.getCAFContext();
	if (sCAF) {
		dispatcherEntry.addFormField("ui.cafcontextid", sCAF);
	}
	
	if (action.forceRunSpecRequest()) {
		dispatcherEntry.addFormField("widget.forceRunSpec", "true");
	}
};

