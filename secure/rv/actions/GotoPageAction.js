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

function GotoPageAction() {
	this.pageNumber = null;
}
GotoPageAction.prototype = new CognosViewerAction();

GotoPageAction.ERROR_CODE_INVALID_INT = "Goto-001";
GotoPageAction.ERROR_CODE_REPORT_NOT_COMPLETE = "Goto-002";
GotoPageAction.ERROR_CODE_INVALID_PAGE_RANGE = "Goto-003";

GotoPageAction.prototype.setRequestParms = function(params) {
	if (params) {
		this.pageNumber = params.pageNumber;	// This is a Public API, we must always support .pageNumber
		this.anchorName = params.anchorName;	// This is a Public API, we must always support .anchorName
	}
};

GotoPageAction.prototype.execute = function() {
	var oCV = this.getCognosViewer();
	var pageInfo = oCV.getPageInfo();
	
	// Make sure we're dealing with a valid integer
	if (!this.isPositiveInt(this.pageNumber)) {
		return this.buildActionResponseObject("error", GotoPageAction.ERROR_CODE_INVALID_INT, RV_RES.IDS_JS_ERROR_INVALID_INT);
	}
	else if (oCV.getStatus() != "complete") {
		return this.buildActionResponseObject("error", GotoPageAction.ERROR_CODE_REPORT_NOT_COMPLETE, RV_RES.IDS_JS_ERROR_REPORT_NOT_COMPLETE);
	}
	else if (pageInfo && pageInfo.pageCount && this.pageNumber > pageInfo.pageCount) {
		return this.buildActionResponseObject("error", GotoPageAction.ERROR_CODE_INVALID_PAGE_RANGE, RV_RES.IDS_JS_ERROR_INVALID_PAGE_RANGE);
	}
	
	if (pageInfo.currentPage == this.pageNumber) {
		this.scrollTo();
		return true;
	}
	
	var request = new ViewerDispatcherEntry(oCV);
	request.addFormField("ui.action", "reportAction");
	request.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageNumber", this.pageNumber);
	
	if (this.anchorName) {
		request.setCallbacks( { "postComplete" : {"object":this, "method": this.scrollTo}
							  });
	}
	
	oCV.dispatchRequest(request);
};

GotoPageAction.prototype.scrollTo = function() {
	
	if(this.anchorName) {
		var anchorElements = document.getElementsByName(this.anchorName);
		if (anchorElements && anchorElements.length>0 && anchorElements[0].scrollIntoView) {
			anchorElements[0].scrollIntoView();
		} else {
			document.location = '#'+this.anchorName;
		}
	}
};
