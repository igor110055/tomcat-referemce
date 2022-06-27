/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function EditContentAction()
{
	this._oMissingMemberRecoveryMode = null;
}
EditContentAction.prototype = new CognosViewerAction();
EditContentAction.superclass = CognosViewerAction.prototype;

EditContentAction.prototype.execute = function() {
	if (typeof this.preferencesChanged != "undefined" && this.preferencesChanged !== null && this.preferencesChanged === true )	{
		this.deleteCWAContainer();
		return;
	}

	window.CVEditContentActionInstance = this;

	var buaAlreadyLoaded = window.viewerCWAContainer ? true : false;
	
	if (!window.viewerCWAContainer) {
		this.createCWAContainer();
	}
	
	this.addWindowEventListeners();
	this.buildBUAObjects();
	
	window.viewerCWAContainer.show();
	
	if (buaAlreadyLoaded) {
		window.BUAEvent("appReady");
	}
};

EditContentAction.prototype.createCWAContainer = function() {
	this.deleteCWAContainer();
	
	var containerDiv = this.createCWAIFrame();
	var blocker = this.createBlocker();
	window.viewerCWAContainer = {
		"type" : "iframe",
		"containerDiv" : containerDiv,
		"blocker" : blocker,
		"iframePadding" : "18",
		"show" : function() { 
			this.resize();
			this.containerDiv.style.display = "block";
			this.blocker.style.display = "block";			
		},
		"hide" : function() {
			this.blocker.style.display = "none";
			this.containerDiv.style.display = "none";
		},
		"resize" : function() {
			var windowBox = dojo.window.getBox();
			this.containerDiv.style.height = windowBox.h - this.iframePadding + "px";
			this.containerDiv.style.width = windowBox.w - this.iframePadding + "px";				
		}
	};
};

EditContentAction.prototype.deleteCWAContainer = function() {
	var containerObj = window.viewerCWAContainer;
	if (containerObj) {
		containerObj.hide();
		document.body.removeChild(containerObj.containerDiv);
		document.body.removeChild(containerObj.blocker);
	
		delete window.viewerCWAContainer;
		window.viewerCWAContainer = null;
	}
};

EditContentAction.prototype.hideCWAContainer = function() {
	this.removeWindowEventListeners();
	if (window.viewerCWAContainer) {
		window.viewerCWAContainer.hide();
	}

	window.CVEditContentActionInstance = null;
};

EditContentAction.prototype.createCWAIFrame = function() {
	var containerDiv = document.createElement("div");
	containerDiv.className = "buaContainer";
	document.body.appendChild(containerDiv);
	
	var iframeElement = document.createElement("iframe");
	iframeElement.setAttribute("id","buaIframe");
	iframeElement.setAttribute("src", this.getWebContent() + "/pat/rsapp.htm");
	iframeElement.setAttribute("name", "buaIframe");
	iframeElement.setAttribute("frameborder",'0');
	iframeElement.className = "buaIframe";
	
	containerDiv.appendChild(iframeElement);
	
	return containerDiv;
};

EditContentAction.prototype.createBlocker = function() {
	var blocker = document.createElement("div");
	blocker.setAttribute("id","reportBlocker");
	blocker.setAttribute("name", "reportBlocker");
	blocker.setAttribute("tabIndex", "1");
	blocker.className = "reportBlocker";
	
	document.body.appendChild(blocker);
	
	return blocker;
};

EditContentAction.prototype.buildBUAObjects = function() {
	window.RSParameters = {
		"rs_UIProfile" : "BUA",
		"ui.action" : "edit",
		"gateway" : location.protocol + "//" + location.host + this.getGateway(),
		"theme" : "corporate",//make look&feel consistent between CW and CWA
		"capabilitiesXML" : this.getCapabilitiesXml(),
		"cafcontextid" : this.getCafContextId(),
		"paneOnRight" : this.getViewerIWidget().getPaneOnRight()
	};

	var viewerWidget = this.getViewerIWidget();
	if(viewerWidget !== null) {
		var cvGateway = viewerWidget.getAttributeValue("gateway");
		if(cvGateway) {
			window.RSParameters["cv.gateway"] = cvGateway;
		}
		var cvWebcontent = viewerWidget.getAttributeValue("webcontent");
		if(cvWebcontent) {
			window.RSParameters["cv.webcontent"] = cvWebcontent;
		}
	}

	this.addExtraLaunchParameters(window.RSParameters);
};

EditContentAction.prototype.getBUAIframe = function() {
	return document.getElementById("buaIframe");
};

EditContentAction.prototype.getBUAWindow = function() {
	var buaWindow = null;
	var buaIframe = this.getBUAIframe();
	if(buaIframe !== null) {
		buaWindow = buaIframe.contentWindow;
	}

	return buaWindow;
};

EditContentAction.prototype.setReportSettings = function() {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();

	//Fire an IWidget event to get the title
	widget.fireEvent("com.ibm.bux.widget.getDisplayTitle", null, { callback: function(sTitle) { window.CVEditContentActionInstance.openReportWithBUA(sTitle); } });
};

EditContentAction.prototype.openReportWithBUA = function(sTitle) {
	var subStringIndex = this.m_oCV.envParams["ui.spec"].indexOf("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
	if (subStringIndex == -1) { subStringIndex = 0; } else { subStringIndex = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>".length; }
	var sReportXML = this.m_oCV.envParams["ui.spec"].substr(subStringIndex, this.m_oCV.envParams["ui.spec"].length);

	var oContext = {
		"displayName" : xml_decode(sTitle), //Chrome HTML encoded this sTtitle
		"parameterValues" : this.m_oCV.getExecutionParameters(),
		"reportXML" : sReportXML,
		"showOpenTransition" : false
	};
	
	if (this.ifPassTrackingtoBUA()) {
		oContext.tracking = this.m_oCV.getTracking();
	}
	
	var buaWindow = this.getBUAWindow();
	buaWindow.Application.SetBUAContext(oContext);
};

EditContentAction.prototype.getViewerIWidget = function() {
	return this.m_oCV.getViewerWidget();
};

EditContentAction.prototype.getGateway = function() {
	return this.m_oCV.getGateway();
};

EditContentAction.prototype.getCapabilitiesXml = function() {
	return this.m_oCV.capabilitiesXML;
};

EditContentAction.prototype.getCafContextId = function() {
	return typeof this.m_oCV.cafContextId != "undefined" ? this.m_oCV.cafContextId : "";
};

EditContentAction.prototype.getWebContent = function() {
	return this.getCognosViewer().getWebContentRoot();
};

EditContentAction.prototype.addExtraLaunchParameters = function(RSParameters) {};

EditContentAction.prototype.runUpdatedReportFromBUA = function() {
	var buaWindow = this.getBUAWindow();
	var originalSpec = this.m_oCV.envParams["ui.spec"];

	var oContext = buaWindow.Application.GetBUAContext();
	if (oContext.isSpecModified) {
		this.m_oCV.envParams["ui.spec"] = oContext.reportXML;
		this.m_oCV.setTracking(oContext.tracking);
		this.m_oCV.setExecutionParameters(oContext.parameterValues);

		this._invokeRedrawAction(originalSpec);
	}
};

EditContentAction.prototype._invokeRedrawAction = function(originalSpec)
{
		this.getUndoRedoQueue().setOriginalSpec(originalSpec);
		var redrawAction = this.m_oCV.getAction("Redraw");
		redrawAction.setSpecUpdated(true);
		this.m_oCV.getViewerWidget().setPromptParametersRetrieved(false);
		redrawAction.execute();
};


EditContentAction.prototype.ifPassTrackingtoBUA = function()
{
	if (this.m_oCV.getRAPReportInfo()) {
		return this.m_oCV.getRAPReportInfo().getPassTrackingtoBUA();
	}

	return true;
};

EditContentAction.prototype.setRequestParms = function(params) {
	EditContentAction.superclass.setRequestParms(params);
	if (params) {
		if (params.preferencesChanged) {
			this.preferencesChanged = params.preferencesChanged;
		}
		
		if (params.MissingMemberRecoveryMode) {
			this._oMissingMemberRecoveryMode = params.MissingMemberRecoveryMode;
		}		
	}
};

EditContentAction.prototype.runUpdatedReportFromBUA_MissingMemberRecoveryMode = function() {
	var buaWindow = this.getBUAWindow();
	var originalSpec = this.m_oCV.envParams["ui.spec"];

	var oContext = buaWindow.Application.GetBUAContext();
	
	this.m_oCV.setTracking(oContext.tracking);
	
	this.m_oCV.envParams["ui.spec"] = oContext.reportXML;
	this.m_oCV.setExecutionParameters(oContext.parameterValues);
	
	if (this._oMissingMemberRecoveryMode && this._oMissingMemberRecoveryMode.oFaultDialog) {
		this._oMissingMemberRecoveryMode.oFaultDialog.hide();
	}
	
	this._invokeRedrawAction(originalSpec);
};

EditContentAction.prototype.cancelPressed = function() {};

EditContentAction.prototype.addWindowEventListeners = function() {
	if (window.attachEvent)	{
		window.attachEvent("onresize", window.CVEditContentActionInstance.onWindowResize);
	}
	else {
		window.addEventListener("resize", window.CVEditContentActionInstance.onWindowResize, false);
	}
};

EditContentAction.prototype.removeWindowEventListeners = function() {
	if (window.detachEvent)	{
		window.detachEvent("onresize", window.CVEditContentActionInstance.onWindowResize);
	}
	else {
		window.removeEventListener("resize", window.CVEditContentActionInstance.onWindowResize, false);
	}
};

EditContentAction.prototype.onWindowResize = function() {
	var containerObj = window.viewerCWAContainer;
	if (containerObj) {
		containerObj.resize();
	}
};

/**
 * Interface that CWA will call
 * @param eventType
 */
function BUAEvent(eventType)
{
	var editContentObj = window.CVEditContentActionInstance;
	switch (eventType)
	{
		case "appReady":
			editContentObj.setReportSettings();
			break;
		case "donePressed":
			editContentObj.hideCWAContainer();
			if (editContentObj._oMissingMemberRecoveryMode) {
				editContentObj.runUpdatedReportFromBUA_MissingMemberRecoveryMode();
			} else {
				editContentObj.runUpdatedReportFromBUA();
			}
			break;
		case "cancelPressed":
			editContentObj.cancelPressed();
			editContentObj.hideCWAContainer();
			break;
	}
}
