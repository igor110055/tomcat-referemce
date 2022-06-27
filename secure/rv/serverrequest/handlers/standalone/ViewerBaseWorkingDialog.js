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
 
function ViewerBaseWorkingDialog( cognosViewer )
{
	if( !cognosViewer )
	{
		return;
	}
	
	this.setCognosViewer( cognosViewer );
	this.m_oCV = cognosViewer;
	this.m_sNamespace = cognosViewer.getId();
	this.m_sGateway = cognosViewer.getGateway();
	this.m_UIBlacklist = null;
	this.m_bUse = true;
	this.m_bCancelSubmitted = false;
}
ViewerBaseWorkingDialog.prototype = new IRequestIndicator();
 
ViewerBaseWorkingDialog.prototype.setCognosViewer = function(oCV)
{
	this.m_oCV = oCV;
};

ViewerBaseWorkingDialog.prototype.getCognosViewer = function()
{
	return this.m_oCV;
};
 
ViewerBaseWorkingDialog.prototype.getGateway = function()
{
	return this.m_sGateway;
};

 /**
  * Returns the unique namespace
  * @return (string)
  */
ViewerBaseWorkingDialog.prototype.getNamespace = function()
{
	return this.m_sNamespace;
};
 
 /**
  * Used by lineage action.
  * TODO: should be deprecated when moving to new framework. This is specific to lineage action and is
  * used to suppress fault response if the request is cancelled. This should be handled
  * outside of this class.
  * the wait page when getting lineage
  * @deprecated
  */
ViewerBaseWorkingDialog.prototype.cancelSubmitted = function()
{
	return this.m_bCancelSubmitted;
};

 /**
  * @deprecated - see comments for cancelSubmitted().
  */
ViewerBaseWorkingDialog.prototype.setCancelSubmitted = function(bSubmitted)
{
	this.m_bCancelSubmitted = bSubmitted;
};

 /**
  * Will initialize and draw the wait page. This method should be used to render the page
  */
ViewerBaseWorkingDialog.prototype.show = function()
{
	var waitPageContainer = document.getElementById(this.getContainerId());
	if(waitPageContainer) {
		waitPageContainer.style.display = "block";
		this.enableCancelButton();
	} else {
		this.create();		
	}

	var blocker = document.getElementById("reportBlocker" + this.m_oCV.getId());
	if (blocker) {
		blocker.style.display = "block";
	}
};
 
 /**
  * Initializes the wait page div
  * @private
  */
ViewerBaseWorkingDialog.prototype.create = function()
{
	if (typeof document.body != "undefined") {
		if(this.isModal()) {
			this.createModalWaitDialog();
		} else {
			this.createInlineWaitDialog();
		}
	}
};

ViewerBaseWorkingDialog.prototype.createContainer = function(isModal) {
	var waitPageContainer = document.createElement("div");
	waitPageContainer.setAttribute("id", this.getContainerId());	
	waitPageContainer.className = isModal ? "modalWaitPage" : "inlineWaitPage";
	return waitPageContainer;
};

ViewerBaseWorkingDialog.prototype.createModalWaitDialog = function(){
	this._createBlocker();
	
	var waitPageContainer = this.createContainer(true);
	waitPageContainer.innerHTML = this.renderHTML();
	waitPageContainer.style.zIndex = "7002";
	waitPageContainer.setAttribute("role", "region");
	waitPageContainer.setAttribute("aria-label", RV_RES.GOTO_WORKING);
	document.body.appendChild(waitPageContainer);

	var iframeBackground = this.createModalIframeBackground();
	document.body.appendChild(iframeBackground);
	
	
	var iBottom = 0;
	var iLeft = 0;
	if (typeof window.innerHeight != "undefined") {
		iBottom = Math.round((window.innerHeight/2) - (waitPageContainer.offsetHeight/2));
		iLeft = Math.round((window.innerWidth/2) - (waitPageContainer.offsetWidth/2));
	}
	else {
		iBottom = Math.round((document.body.clientHeight/2) - (waitPageContainer.offsetHeight/2));
		iLeft = Math.round((document.body.clientWidth/2) - (waitPageContainer.offsetWidth/2));
	}

	waitPageContainer.style.bottom = iBottom + "px";
	waitPageContainer.style.left = iLeft + "px";

	iframeBackground.style.left = iLeft - 1 + "px";
	iframeBackground.style.bottom = iBottom - 1 + "px";
	iframeBackground.style.width = waitPageContainer.offsetWidth + 2 + "px";
	iframeBackground.style.height = waitPageContainer.offsetHeight + 2 + "px";			
};

ViewerBaseWorkingDialog.prototype._createBlocker = function() {
	var blocker = document.getElementById("reportBlocker" + this.m_oCV.getId());
	if (blocker) {
		return;
	}
	
	var mainTd = document.getElementById("mainViewerTable" + this.m_oCV.getId());
	if (mainTd) {
		blocker = document.createElement("div");
		mainTd.parentNode.appendChild(blocker);
		
		blocker.id = "reportBlocker" + this.m_oCV.getId();
		blocker.style.zIndex = "6001";
		blocker.style.position = "absolute";
		blocker.style.top = "0px";
		blocker.style.left = "0px";
		blocker.style.width = "100%";
		blocker.style.height = "100%";
		blocker.style.display = "none";
		blocker.style.opacity = "0";
		blocker.style.backgroundColor = "#FFFFFF";
		blocker.style.filter = "alpha(opacity:0)";
	}	
};

ViewerBaseWorkingDialog.prototype.createInlineWaitDialog = function(){
	var sNamespace = this.m_oCV.getId();
	var cvReportDiv = document.getElementById("CVReport" + sNamespace);
	if(cvReportDiv) {
		var waitPageContainer = this.createContainer(false);
		waitPageContainer.innerHTML = "<table width=\"100%\" height=\"100%\"><tr><td valign=\"middle\" align=\"center\" role=\"presentation\">" + this.renderHTML() + "</td></tr></table>";
		cvReportDiv.appendChild(waitPageContainer);
	}
};

/**
 * Builds the wait page hidden iframe (used so the wait page draws over iframes)
 * @param bSavedReport (boolean) Indicates whether or not the wait page should render the delivery options
 * @private
 */
ViewerBaseWorkingDialog.prototype.createModalIframeBackground = function()
{
	var hiddenIframe = document.createElement("iframe");

	var sWebContentRoot = "..";

	var oCV = this.getCognosViewer();
	if (oCV !== null)
	{
		sWebContentRoot = oCV.getWebContentRoot();
	}

	hiddenIframe.setAttribute("id", this.getContainerId() + "Iframe");
	hiddenIframe.setAttribute("title", "Empty iframe");
	hiddenIframe.setAttribute("src",sWebContentRoot + '/common/images/spacer.gif');
	hiddenIframe.setAttribute("scrolling",'no');
	hiddenIframe.setAttribute("frameborder",'0');
	hiddenIframe.style.position="absolute";
	hiddenIframe.style.zIndex="6002";
	hiddenIframe.style.display="block";

	return hiddenIframe;
};


ViewerBaseWorkingDialog.prototype.updateCoords = function(waitPageDiv, waitPageIFrame)
{
	if(this.m_container !== null && m_iframeBackground !== null) {
		// position the wait page in the middle of the report
		var iBottom = 0;
		var iLeft = 0;
		if (typeof window.innerHeight != "undefined") {
			iBottom = Math.round((window.innerHeight/2) - (waitPageDiv.offsetHeight/2));
			iLeft = Math.round((window.innerWidth/2) - (waitPageDiv.offsetWidth/2));
		}
		else {
			iBottom = Math.round((document.body.clientHeight/2) - (waitPageDiv.offsetHeight/2));
			iLeft = Math.round((document.body.clientWidth/2) - (waitPageDiv.offsetWidth/2));
		}
	
		waitPageDiv.style.bottom = iBottom + "px";
		waitPageDiv.style.left = iLeft + "px";
	
		waitPageIFrame.style.left = waitPageDiv.style.left;
		waitPageIFrame.style.bottom = waitPageDiv.style.bottom;
		waitPageIFrame.style.width = waitPageDiv.offsetWidth + "px";
		waitPageIFrame.style.height = waitPageDiv.offsetHeight + "px";		
	}
};

 /**
  * Will hide the wait page
  */
ViewerBaseWorkingDialog.prototype.hide = function()
{
	var waitPageContainer = document.getElementById(this.getContainerId());
	if(waitPageContainer) {
		waitPageContainer.parentNode.removeChild(waitPageContainer);
	}	
	var waitIframe = document.getElementById(this.getContainerId() + "Iframe");
	if(waitIframe) {
		waitIframe.parentNode.removeChild(waitIframe);
	}	
	
	var blocker = document.getElementById("reportBlocker" + this.m_oCV.getId());
	if (blocker) {
		blocker.parentNode.removeChild(blocker);
	}

};

ViewerBaseWorkingDialog.prototype.isModal = function() {
	var sNamespace = this.m_oCV.getId();
	var cvReportDiv = document.getElementById("CVReport" + sNamespace);
	var isModal = true;
	if(cvReportDiv && cvReportDiv.innerHTML === "") {
		isModal = false;
	}
	
	return isModal; 
};


ViewerBaseWorkingDialog.prototype.disableCancelButton = function(cancelLink) {};
ViewerBaseWorkingDialog.prototype.enableCancelButton = function() {};
 
 