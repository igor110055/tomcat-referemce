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

CCognosViewer.prototype.isMobile = function() { return true; };

/**
 * When in mobile we don't want to submit the drill through form like we usually do.
 * Instead we need to dispatch a request with all the drill through form fields
 * so that it can go through Mobiles proxy
 */
CCognosViewer.prototype.sendDrillThroughRequest = function(form) {
	var aCells = getChildElementsByAttribute(form, "input", "name", "ui.action");
	if (aCells && aCells.length > 0) {
		aCells[0].setAttribute("value", "authoredDrillThroughMobile");
	}
	
	ViewerMobileRequest.passFormFieldsToMobile(form);
};

CCognosViewer.prototype.launchGotoPage = function(form) {
	ViewerMobileRequest.passFormFieldsToMobile(form);
};

/**
 * Never show the page links when we're generating
 * output for Mobile
 */
CCognosViewer.prototype.shouldWriteNavLinks = function() {
	return false;
};

/**
 * For cancel requests make sure we use a ViewerDispatcherEntry class
 * since it will call into the Mobile code to do the request
 */
CCognosViewer.prototype.getCancelDispatcherEntry = function() {
	return new ViewerDispatcherEntry(this);
};

CCognosViewer.prototype.notifyTabChange = function(newTabId) {	
	var payload = {
		"action" : "savedOutputTabChange",
		"tabId" : newTabId			
	};

	if (typeof window.onAction == "function") {	
		window.onAction(payload);
	}
	else if(typeof console != "undefined") {
		// must not be in Mobile, log it to the console
		console.log(payload);
	}
};
