/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function BaseRequestHandler( oCV  ) {
	if (oCV) {
		this.m_oCV = oCV;
		this.m_workingDialog = null;
		this.m_requestIndicator = null;
		this.m_faultDialog = null;
		this.m_logOnDialog = null;
		this.m_promptDialog = null;
		this.m_httpRequestConfig = this.m_oCV.getConfig() && this.m_oCV.getConfig().getHttpRequestConfig() ? this.m_oCV.getConfig().getHttpRequestConfig() : null;
	}
}
BaseRequestHandler.prototype = new IRequestHandler();
BaseRequestHandler.prototype.onError = function(response) {};
BaseRequestHandler.prototype.onComplete = function() {};
BaseRequestHandler.prototype.onPrompting = function() {};
BaseRequestHandler.prototype.resubmitInSafeMode = function() {};
BaseRequestHandler.prototype.massageHtmlBeforeDisplayed = function() {};
BaseRequestHandler.prototype.onPostEntryComplete = function() {
	this._processDelayedLoadingQueue();
};

BaseRequestHandler.prototype.getViewer = function() {
	return this.m_oCV;
};

BaseRequestHandler.prototype.setDispatcherEntry = function(dispatcherEntry) {
	this.m_oDispatcherEntry = dispatcherEntry;
};

BaseRequestHandler.prototype.getDispatcherEntry = function() {
	return this.m_oDispatcherEntry;
};

/**
 * Should only be called once when the Viewer first loads. This is because
 * the initial response from the server didn't go through the dispatcher entries,
 * so we need logic to handle complete, working, fault, ...
 */
BaseRequestHandler.prototype.processInitialResponse = function(oState) {
	this.updateViewerState(oState);	
};

BaseRequestHandler.prototype.setLogOnDialog = function(logOnDialog) {
	if (logOnDialog == null) {
		this.m_logOnDialog = null;
	} else if(logOnDialog instanceof ILogOnDialog) {
		this.m_logOnDialog = logOnDialog;
	} else if(logOnDialog && typeof console != "undefined") {
		console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
	}
};

BaseRequestHandler.prototype.setWorkingDialog = function(workingDialog) {
	if (workingDialog == null) {
		this.m_workingDialog = null;
	}
	else if (this.m_httpRequestConfig && this.m_httpRequestConfig.getWorkingDialog()) {
		this.m_workingDialog = this.m_httpRequestConfig.getWorkingDialog();
	}
	else if(workingDialog instanceof IRequestIndicator) {
		this.m_workingDialog = workingDialog;
	}
	else if(workingDialog && typeof console != "undefined") {
		console.log("The parameter workingDialog must be an instance of IRequestIndicator");
	}
};

BaseRequestHandler.prototype.getWorkingDialog = function() {
	return this.m_workingDialog;
};

BaseRequestHandler.prototype.setRequestIndicator = function(requestIndicator) {
	if (requestIndicator == null) {
		this.m_requestIndicator = null;
	}
	else if (this.m_httpRequestConfig && this.m_httpRequestConfig.getRequestIndicator()) {
		this.m_requestIndicator = this.m_httpRequestConfig.getRequestIndicator();
	}
	else if(requestIndicator instanceof IRequestIndicator) {
		this.m_requestIndicator = requestIndicator;
	}
	else if(requestIndicator && typeof console != "undefined") {
		console.log("The parameter requestIndicator must be an instance of IRequestIndicator");
	}
};

BaseRequestHandler.prototype.getRequestIndicator = function() {
	return this.m_requestIndicator;
};

BaseRequestHandler.prototype.setFaultDialog = function(faultDialog) {
	if (faultDialog == null) {
		this.m_faultDialog = null;
	} else if(faultDialog instanceof IFaultDialog) {
		this.m_faultDialog = faultDialog;
	} else if(faultDialog && typeof console != "undefined") {
		console.log("The parameter faultDialog must be an instance of IFaultDialog");
	}
};

BaseRequestHandler.prototype.setPromptDialog = function(promptDialog) {
	if (promptDialog == null) {
		this.m_promptDialog = null;
	} else if(promptDialog instanceof IPromptDialog) {
		this.m_promptDialog = promptDialog;
	} else if(promptDialog && typeof console != "undefined") {
		console.log("The parameter promptDialog must be an instance of IPromptDialog");
	}
};

BaseRequestHandler.prototype.preHttpRequest = function(request) {
	if (request && typeof request.getFormField == "function") {
		if (request.getFormField("ui.action") != "wait" && request.getFormField("rapWait") != "true") {
			if (this.m_requestIndicator) {
				this.m_requestIndicator.show();
			}
		}
	}
};

BaseRequestHandler.prototype.postHttpRequest = function(response) {
	if (response && typeof response.getAsynchStatus == "function") {
		var status = response.getAsynchStatus();
		if (status != "working" && status != "stillWorking") {
			if (this.m_workingDialog) {
				this.m_workingDialog.hide();
			}
			if (this.m_requestIndicator) {
				this.m_requestIndicator.hide();
			}
		}
	}
	else {
		if (this.m_workingDialog) {
			this.m_workingDialog.hide();
		}
		if (this.m_requestIndicator) {
			this.m_requestIndicator.hide();
		}
	}
};

BaseRequestHandler.prototype.onFault = function(response) {
	var oCV = this.getViewer();

	if (this.m_workingDialog) {
		this.m_workingDialog.hide();
	}
	if (this.m_requestIndicator) {
		this.m_requestIndicator.hide();
	}

	if (typeof FaultDialog == "undefined") {
		if(typeof console != "undefined") {
			console.log("An unhandled fault was returned: %o", response);
		}
		return;
	}

	if (!this.m_faultDialog) {
		this.m_faultDialog = new FaultDialog(this.getViewer());
	}

	// onFault was called with an text/html response, we have no idea what this response is
	if (response && response.getResponseHeader && response.getResponseHeader("Content-type").indexOf("text/html") != -1) {
		this.m_faultDialog.handleUnknownHTMLResponse(response.getResponseText());
	}
	else if (response && response.getSoapFault) {
		this.m_faultDialog.show(response.getSoapFault());
	}
	else if (oCV.getSoapFault()) {
		// if the fault happened right away then it'll be stored in the Viewer object
		var soapFault = XMLBuilderLoadXMLFromString(oCV.getSoapFault());
		this.m_faultDialog.show(soapFault);
		oCV.setSoapFault("");
	}
	else if(typeof console != "undefined") {
		console.log("An unhandled fault was returned: %o", response);
	}
};

BaseRequestHandler.prototype.isAuthenticationFault = function(response) {
	var oCV = this.getViewer();
	var soapFaultDocument = null;

	if (response && response.getSoapFault) {
		soapFaultDocument = response.getSoapFault();
	}
	else if (oCV.getSoapFault()) {
		// if the fault happened right away then it'll be stored in the Viewer object
		soapFaultDocument = XMLBuilderLoadXMLFromString(oCV.getSoapFault());
	}

	if(soapFaultDocument != null) {
		var camElement = XMLHelper_FindChildByTagName(soapFaultDocument, "CAM", true);
		return (camElement != null && XMLHelper_FindChildByTagName(camElement, "promptInfo", true) != null);
	}

	return false;
};

BaseRequestHandler.prototype.onPassportTimeout = function(response) {
	var oCV = this.getViewer();
	if (this.m_workingDialog) {
		this.m_workingDialog.hide();
	}
	if (this.m_requestIndicator) {
		this.m_requestIndicator.hide();
	}

	if (!this.m_logOnDialog) {
		this.m_logOnDialog = new LogOnDialog(this.getViewer());
	}

	if (response && response.getResponseHeader && response.getResponseHeader("Content-type").indexOf("text/html") != -1) {
		this.m_logOnDialog.handleUnknownHTMLResponse(response.getResponseText());
	}
	else if (response && response.getSoapFault) {
		this.m_logOnDialog.show(response.getSoapFault());
	}
	else if (oCV.getSoapFault()) {
		// if the fault happened right away then it'll be stored in the Viewer object
		var soapFault = XMLBuilderLoadXMLFromString(oCV.getSoapFault());
		this.m_logOnDialog.show(soapFault);
		oCV.setSoapFault("");
	}
	else if(typeof console != "undefined") {
		console.log("BaseRequestHandler.prototype.onPassportTimeout: An unhandled authentication fault was returned: %o", response);
	}
};

BaseRequestHandler.prototype.onWorking = function(response) {
	if (this.m_workingDialog) {
		var stillWorking = response && typeof response.getAsynchStatus == "function" && response.getAsynchStatus() == "stillWorking" ?  true : false;
		if (!stillWorking) {
			if (this.m_requestIndicator) {
				this.m_requestIndicator.hide();
			}

			this.m_workingDialog.show();
		}
	}
};

BaseRequestHandler.prototype.onCancel = function() {
	if (this.m_workingDialog) {
		this.m_workingDialog.hide();
	}
	if (this.m_requestIndicator) {
		this.m_requestIndicator.hide();
	}
	
	var oCV = this.getViewer();
	// Clear the prompt submitted flag since we've cancelled the request
	oCV.gbPromptRequestSubmitted = false;
	
	this._processDelayedLoadingQueue();
};

BaseRequestHandler.prototype._processDelayedLoadingQueue = function() {
	var oCV = this.getViewer();
	if (oCV && oCV.getViewerWidget()) {
		var cvWidget = oCV.getViewerWidget();
		if (cvWidget.getLoadManager()) {
			cvWidget.getLoadManager().processQueue();
		}
	}	
};

BaseRequestHandler.prototype.onPrompting = function(response) {
	var oCV = this.getViewer();
	if (this.m_workingDialog) {
		this.m_workingDialog.hide();
	}
	if (this.m_requestIndicator) {
		this.m_requestIndicator.hide();
	}

	if (!this.m_promptDialog) {
		this.m_promptDialog = new PromptDialog(this.getViewer());
	}

	window["AsynchRequestObject"] = response;
	window["AsynchRequestPromptDialog"] = this.m_promptDialog;
	var cvIdParam = "?cv.id=" + oCV.getId();
	window["AsynchRequestPromptDialog"].initialize(oCV.getWebContentRoot() + "/rv/showStandalonePrompts.html" + cvIdParam, 400, 400);
	window["AsynchRequestPromptDialog"].show();
};

BaseRequestHandler.prototype.processDATAReportResponse = function(response) {
	var oCV = this.getViewer();
	if (!oCV || oCV.m_destroyed) {
		if (console) {
			console.warn("Tried to process a data response on an invalid CCognosViewer", oCV);
		}
		return;
	}
	var responseState = response.getResponseState();
	if (!responseState) {
		this.resubmitInSafeMode();
	}

	if (this.loadReportHTML(response.getResult()) === false) {
		this.resubmitInSafeMode();
	}

	this.updateViewerState(responseState);
};

BaseRequestHandler.prototype.updateViewerState = function(oState) {
	var oCV = this.getViewer();

	applyJSONProperties(oCV, oState);

	var status = oCV.getStatus();

	if(typeof oCV.envParams["ui.spec"] != "undefined" && oCV.envParams["ui.spec"].indexOf("&lt;") === 0) {
		oCV.envParams["ui.spec"] = xml_decode(oCV.envParams["ui.spec"]);
	}

	if(status != "fault") {
		if(oCV.envParams["rapReportInfo"]) {
			this._processRapReportInfo(oCV);
		}

		if(typeof oState.clientunencodedexecutionparameters != "undefined")	{
			var formWarpRequest = document.getElementById("formWarpRequest" + oCV.getId());
			if(formWarpRequest != null && typeof formWarpRequest["clientunencodedexecutionparameters"] != "undefined") {
				formWarpRequest["clientunencodedexecutionparameters"].value = oState.clientunencodedexecutionparameters;
			}

			if(typeof document.forms["formWarpRequest"] != "undefined" && typeof document.forms["formWarpRequest"]["clientunencodedexecutionparameters"] != "undefined") {
				document.forms["formWarpRequest"]["clientunencodedexecutionparameters"].value = oState.clientunencodedexecutionparameters;
			}
		}
	}
	else {
		// clear the tracking, so we don't attempt to re-use it on subsequent requests
		oCV.setTracking("");
	}
};

BaseRequestHandler.prototype._processRapReportInfo = function(oCV) {
	if(oCV.envParams["rapReportInfo"]) {
		var oReportInfo = eval("(" + oCV.envParams["rapReportInfo"] + ")");

		if (typeof RAPReportInfo != "undefined") {
			var rapReportInfo = new RAPReportInfo(oReportInfo, oCV);
			oCV.setRAPReportInfo(rapReportInfo);
		}
	}
};

BaseRequestHandler.prototype.loadReportHTML = function(sResponseText) {
	var oCV = this.getViewer();
	if (window.IBM&&window.IBM.perf){window.IBM.perf.log("viewer_gotHtml", oCV);}

	if(oCV.m_undoStack.length > 0)	{
		oCV.m_undoStack[oCV.m_undoStack.length-1].m_bRefreshPage = true;
	}

	oCV.pageNavigationObserverArray = [];
	oCV.m_flashChartsObjectIds = [];

	// IE bug: innerHTML do not handle <form>s, the page will be ignored if there is a <form> tag around the HTML code.
	// The main form (formWarpRequest) is wrapped around the <div> we are using for the report, we should not have a <form> in the output anyway.
	var sHTML = sResponseText.replace(/<form[^>]*>/gi,"").replace(/<\/form[^>]*>/gi,"");

	oCV.m_sHTML = sHTML;
	oCV.setHasPrompts(false);

	var id = oCV.getId();
	var oRVContent = document.getElementById("RVContent" + id);
	var oReportDiv = document.getElementById("CVReport" + id);

	// if the report contains prompts, then set the display to none to fix a possible flicker for
	// when the prompt sizes itself (trakker 531880)
	if (sHTML.match(/prompt\/control\.js|PRMTcompiled\.js|prmt_core\.js/gi)) {
		oCV.setHasPrompts( true );
		// Don't set the content div style to none since it causes a weird issue in IE11 where the div's scroll position 
		// won't be reset to 0, so the top of the report/prompt control will be cut off with no way of getting to it
		// COGCQ00887152
		oReportDiv.style.display = "none";
	}

	if (window.gScriptLoader) {
		var bUseNamespacedGRS = oCV.getViewerWidget() ? true : false;
		var oCVDiv = oCV.getViewerWidget() ? document.getElementById("_" + oCV.getViewerWidget().iContext.widgetId + "_cv") : oReportDiv;
		sHTML = window.gScriptLoader.loadCSS(sHTML, oCVDiv, bUseNamespacedGRS, id);
	}

	if (oCV.sBrowser == 'ie') {
		// IE specific 'fix' where if sHTML has script tags at the beginning they won't be loaded into the DOM. Adding
		// a valid tag first causes all subsequent scripts to be loaded into the DOM.
		sHTML = "<span style='display:none'>&nbsp;</span>" + sHTML;
	}

	oReportDiv.innerHTML=sHTML;

	this.massageHtmlBeforeDisplayed();
	
	if (window.gScriptLoader) {
		var callback = GUtil.generateCallback(oCV.showLoadedContent, [oRVContent], oCV);
		oCV.m_resizeReady = false;
		if (!window.gScriptLoader.loadAll(oReportDiv, callback, id, true) ) {
			if (window.gScriptLoader.containsAjaxWarnings()) {
				return false;
			}
		}
	}
	else {
		oRVContent.style.display = "block";
	}

	oCV.updateOutputForA11ySupport();
		
	this._clearFindState();
	
	return true;
};

BaseRequestHandler.prototype._clearFindState = function() {
	var oCV = this.getViewer();
	var findState = oCV.getState() && oCV.getState().getFindState() ? oCV.getState().getFindState() : null;
	if (findState && !findState.findOnServerInProgress()) {
		oCV.getState().clearFindState();
	}
};

/**
 * Make sure the report div is visible
 */
BaseRequestHandler.prototype.showReport = function() {
	var oCV = this.getViewer();
	var oReportDiv = document.getElementById("CVReport" + oCV.getId());
	if (oReportDiv) {
		oReportDiv.style.display = "";
	}
};

/**
 * Called once the Viewer state and HTML report have been updated.
 * This is last set of 'tweaks' needed to show the UI
 */
BaseRequestHandler.prototype.postComplete = function() {
	var oCV = this.getViewer();

	if (oCV.shouldWriteNavLinks()) {
		oCV.writeNavLinks(oCV.getSecondaryRequests().join(" "));
	}
	
	if (oCV.getStatus() === "complete") {
		oCV.m_undoStack = [new CognosViewerSession(oCV)];
	}
};

BaseRequestHandler.prototype.onAsynchStatusUpdate = function(status) {
	if (this.m_httpRequestConfig) {
		var statusCallback = this.m_httpRequestConfig.getReportStatusCallback(status);
		if (statusCallback) {
			statusCallback();
		}
	}
};

BaseRequestHandler.prototype.addCallbackHooks = function() {
	if (!this.m_httpRequestConfig) {
		return;
	}

	this._addCallback("complete", "onComplete");
	this._addCallback("working", "onWorking");
	this._addCallback("prompting", "onPrompting");
};

BaseRequestHandler.prototype._addCallback = function(status, functionToAddTo) {
	var callbackStatus = status;
	var originalFunction = this[functionToAddTo];
	this[functionToAddTo] = function(response) {
		originalFunction.apply(this, arguments);

		var status = null;
		// For working responses we'll have a 'response' object here so get the status from it
		// so we can tell the difference between working and stillworking
		if (response && typeof response.getAsynchStatus == "function") {
			status = response.getAsynchStatus();
		}
		else {
			// Complete can be called when we're in a prompting state, so get the real
			// status from the CCognosViewer object
			status = callbackStatus == "complete" ? this.getViewer().getStatus() : callbackStatus;
		}

		// We should only call the working callback once, no use in calling it for every subsequent working/stillWorking
		if (status == "stillWorking") {
			return;
		}

		var callback = this.m_httpRequestConfig.getReportStatusCallback(status);
		if (typeof callback == "function") {
			setTimeout(callback, 10);
		}
	};
};
