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
  /**
  * This Action allows end user to save the report inside a report viewer widget
  * to an stand alone Cognos Report Object outside of Cognos workspace
  * */
function SaveAsReportAction(){
	_progressDisplay = null;
};

SaveAsReportAction.prototype = new CognosViewerAction();

SaveAsReportAction.prototype.onSaveCallback = function(){
	if (!this._progressDisplay) {
			dojo["require"]("bux.dialogs.InformationDialog"); //@lazyload
			this._progressDisplay = new bux.dialogs.Working(BUXMSG.CPN.IDS_CPN_SAVING);
			this._progressDisplay.startup();
			this._progressDisplay.show();
		}
};

SaveAsReportAction.prototype.afterSaveCallback = function(){
	if (this._progressDisplay) {
		this._progressDisplay.destroy();
		this._progressDisplay = null;
	}
};

SaveAsReportAction.prototype.execute = function( ){	
	 this.getCognosViewer().executeAction( 'RemoveAllDataFilter', { callback : {method: this.doSaveAs, object: this} } );	
};

SaveAsReportAction.prototype.updateMenu = function(jsonSpec){		
		jsonSpec.visible = this.hasEnvUISpec();
		return jsonSpec;		
};

SaveAsReportAction.prototype.hasEnvUISpec = function(){
	if(this.m_oCV){
		var sSpec = this.m_oCV.envParams["ui.spec"];
		return (sSpec && sSpec.length >0);
	}
	return false;
};

SaveAsReportAction.prototype.doSaveAs = function(strippedReportSpec){
	dojo["require"]("bux.dialogs.FileDialog");
	dojo["require"]("bux.iwidget.canvas.ReportIOHandler");
	this.m_cv = this.getCognosViewer();
	var sReportSpec = strippedReportSpec;
	var sObjectClass = this.m_cv.envParams["ui.objectClass"];
	var onCallback = this.onSaveCallback;
	var afterCallback = this.afterSaveCallback;
	var oSaveAsDlgParams = {
		filter:"content-report", //Only returns report objects in the file dialog
		title: RV_RES.IDS_JS_SAVE_AS_FDG_TITLE,
		sMainActionButtonLabel: RV_RES.IDS_JS_OK,
		"class": "bux-fileDialog"
	};
	var oIOHandler = new bux.iwidget.canvas.ReportIOHandler(sReportSpec, sObjectClass, onCallback, afterCallback, oSaveAsDlgParams);
	oIOHandler._doSaveAs();
};