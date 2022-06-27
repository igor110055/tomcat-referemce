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
 * Used to print the report in HTML from a hidden iframe.
 */

function PrintAction() {
	this._pageNumber = null;
	this._pageCount = null;
}
PrintAction.prototype = new CognosViewerAction();

PrintAction.ERROR_CODE_INVALID_INT = "Print-001";
PrintAction.ERROR_CODE_REPORT_NOT_COMPLETE = "Print-002";
PrintAction.ERROR_CODE_INVALID_PAGE_RANGE = "Print-003";

PrintAction.prototype.setRequestParms = function(params) {
	if (params) {
		if (params.pageNumber) {
			this._pageNumber = params.pageNumber;
		}
		
		if (params.pageCount) {
			this._pageCount = params.pageCount;
		}
	}
};

PrintAction.prototype.execute = function() { 
	var oCV = this.getCognosViewer();
	var pageInfo = this.getCognosViewer().getPageInfo();
	
	// The error are part of a PUBLIC API, do not change
	if (this._pageNumber && !this.isPositiveInt(this._pageNumber)) {
		return this.buildActionResponseObject("error", PrintAction.ERROR_CODE_INVALID_INT, RV_RES.IDS_JS_ERROR_INVALID_INT);
	}
	else if (this._pageCount && !this.isPositiveInt(this._pageCount)) {
		return this.buildActionResponseObject("error", PrintAction.ERROR_CODE_INVALID_INT, RV_RES.IDS_JS_ERROR_INVALID_INT);
	} 
	else if (oCV.getStatus() != "complete") {
		return this.buildActionResponseObject("error", PrintAction.ERROR_CODE_REPORT_NOT_COMPLETE, RV_RES.IDS_JS_ERROR_REPORT_NOT_COMPLETE);
	}
	else if (pageInfo && pageInfo.pageCount && this._pageNumber > pageInfo.pageCount) {
		return this.buildActionResponseObject("error", PrintAction.ERROR_CODE_INVALID_PAGE_RANGE, RV_RES.IDS_JS_ERROR_INVALID_PAGE_RANGE);
	}
	
	var envParams = oCV.envParams;

	var pageNumber = this._pageNumber > 0 ? this._pageNumber : "1";
	var pageCount = this._pageCount ? this._pageCount : "0";  // 0 means print all remaining pages
	
	var request = new HiddenIframeDispatcherEntry(oCV);
	request.addFormField("ui.action", "reportAction");
	request.addFormField("cv.responseFormat", "print");
	request.addFormField("ui.conversation", oCV.getConversation());
	request.addFormField("m_tracking", oCV.getTracking());
	request.addFormField("cv.header", "false");
	request.addFormField("cv.toolbar", "false");
	request.addFormField("cv.id", oCV.getId());
	request.addFormField("cv.useAjax", "false");
	request.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageNumber", pageNumber);
	request.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageCount", pageCount);

	request.setCallbacks({
		"complete" : { "object" : this, "params" : [], "method" : this.printIframe }
	});
	
	oCV.dispatchRequest(request);
};



/**
 * Call the javascript command to print the iframe
 */
PrintAction.prototype.printIframe = function() {
	var iframe = HiddenIframeDispatcherEntry.getIframe(this.getCognosViewer().getId());

	if (iframe) {
		if(isIE()) {
			iframe.contentWindow.document.execCommand("print", true, null);
		} else {
			iframe.focus();
			iframe.contentWindow.print();
		}
	}
};
