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
 
function RequestHandler( oCV ) {
	if (oCV) {
		RequestHandler.baseConstructor.call(this, oCV);
	}
}
 
RequestHandler.prototype = new BaseRequestHandler();
RequestHandler.baseConstructor = BaseRequestHandler;
RequestHandler.prototype.parent = BaseRequestHandler.prototype;

RequestHandler.prototype.resubmitInSafeMode = function() {
	this.getViewer().resubmitInSafeMode(this.getDispatcherEntry());
};

/**
 * Should on be called when the response has a status of 'complete' or 'prompting'
 * @param {Object} response
 */
RequestHandler.prototype.onComplete = function(response) {
	this.parent.onComplete.call(this, response);
	
	this.processDATAReportResponse(response);
	
	this.postComplete();
};

/**
 * Should only be called once when the Viewer first loads. This is because
 * the initial response from the server didn't go through the dispatcher entries,
 * so we need logic to handle complete, working, fault, ...
 */
RequestHandler.prototype.processInitialResponse = function(oState) {
	this.parent.processInitialResponse.call(this, oState);

	var oCV = this.getViewer();
	var status = oCV.getStatus();
	
	oCV.setMaxContentSize();

	var bShowWaitPage = ( oCV.isWorking(status) || status == "default" );
	if (bShowWaitPage) {
		if (oCV.getWorkingDialog()) {
			oCV.getWorkingDialog().show();
		}
		// add a delay for this callback to allow the server request to clean up, and not block any futher server requests		
		setTimeout(getCognosViewerObjectRefAsString(oCV.getId())+".executeCallback(\"wait\");",10);
	}
	else if (status == "fault")	{
		oCV.setSoapFault(oState.m_sSoapFault);
		oCV.executeCallback("fault");
	}
	else if(oState.status == "cancel") {
		oCV.executeCallback("cancel");
	}
	else {
		oCV.updateSkipToReportLink();

		// in case where ajax is off, we sent the pinFreeze info as a form field. re-initialize the pinFreeze manager
		if (oCV.envParams && oCV.envParams["pinFreezeInfo"]) {
			var oPinFreezeManager = oCV.getPinFreezeManager();
			oPinFreezeManager.fromJSONString(oCV.envParams["pinFreezeInfo"]);
			delete oCV.envParams["pinFreezeInfo"];
		}

		if (status != "prompting" || !oCV.executeCallback("prompt")) {
			this.postComplete();
		}
		else {
			oCV.updateSkipToNavigationLink(true);
		}		
	}

	this.showReport();
	
	this.getViewer().renderTabs();
	
	this.onAsynchStatusUpdate(status);
};

/**
 * Called once the Viewer state and HTML report have been updated.
 * This is last set of 'tweaks' needed to show the UI
 */
RequestHandler.prototype.postComplete = function() {
	this.parent.postComplete.call(this);

	var oCV = this.getViewer();

	var oRVContent = document.getElementById('RVContent' + oCV.getId());
	if (oRVContent)	{
		oRVContent.scrollTop=0;
	}
	
	oCV.updateSkipToReportLink();

	if (oCV.rvMainWnd) {
		oCV.updateLayout(oCV.getStatus());
		if (!oCV.getUIConfig() || oCV.getUIConfig().getShowToolbar()) {
			var oToolbar = oCV.rvMainWnd.getToolbar();
			if (oToolbar) {
				oCV.rvMainWnd.updateToolbar(oCV.outputFormat);
				oToolbar.draw();
			}
		}

		if (!oCV.getUIConfig() || oCV.getUIConfig().getShowBanner()) {
			var oBannerToolber = oCV.rvMainWnd.getBannerToolbar();
			if (oBannerToolber) {
				oBannerToolber.draw();
			}
		}
	}
	
	if (oCV.getBrowser() == 'moz') {
		if (oRVContent) {
			if (oCV.outputFormat == 'XML' && oCV.getStatus() != 'prompting') {
				oRVContent.style.overflow = "hidden";
			}
			else {
				oRVContent.style.overflow = "auto";
			}
		}
	}

	oCV.gbPromptRequestSubmitted = false;

	this.showReport();

	if (oCV.getPinFreezeManager() && oCV.getPinFreezeManager().hasFrozenContainers()) {
		var oReportDiv = document.getElementById("CVReport" + oCV.getId());
		if (oReportDiv) {			
			setTimeout(function() {
				oCV.getPinFreezeManager().renderReportWithFrozenContainers(oReportDiv);
				// force IE to repaint the div or the the RVContent div won't resize and you'll be left with scrollbars
				if (isIE()) {
					oCV.repaintDiv(oRVContent);
				}
			}, 1);
		}
	}
		
	oCV.setMaxContentSize();
	
	oCV.executeCallback("done");

	oCV.doneLoading();
};