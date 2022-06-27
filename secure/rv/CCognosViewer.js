/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2016
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
/**
	@fileoverview
	This file implements all that is necessary to send requests to the server side of Cognos Viewer (using the URL Api),
	process the responses and to perform actions on a report like next page or email.
	It manages the report state (conversation, tracking, prompting), the report output and the features on the client for the viewer.
*/

/**
	Initialize the CCognosViewer object.
	@constructor
	@param {string} sId Identifier used for this object. This identifier will be used to mark elements used by this class.
	@param {string} sGateway Path to "cognos.cgi". For example: "/cognos8/cgi-bin/cognos.cgi".
*/

var CV_BACKGROUND_LAYER_ID = "CV_BACK";

if (typeof window.gaRV_INSTANCES == "undefined")
{
	window.gaRV_INSTANCES = [];
}

// Stubbed logger object, it will get augmented if/when logging is turned on
if (!window.gViewerLogger) {
	window.gViewerLogger = {
		log : function(hint, content, type) {},
		addContextInfo : function(selectionController) {}
	};
}

function CognosViewerSession(oCV)
{
	this.m_sConversation = oCV.getConversation();
	this.m_sParameters = oCV.getExecutionParameters();
	this.m_envParams = {};
	applyJSONProperties(this.m_envParams, oCV.envParams);

	this.m_bRefreshPage = false;
}

function CCognosViewer(sId, sGateway)
{
	// Declare a global instance of CCognosViewer if none exists [for backward compatibility].
	// This global instance will be refered too by global prompt functions like setPromptControl() and promptButtonNext().
	if (typeof window.gCognosViewer == "undefined")
	{
		window.gCognosViewer = this;
	}

	if (typeof ViewerConfig == "function") {
		this.m_viewerConfig = new ViewerConfig();
		try {
			if (typeof window.getViewerConfiguration == "function") {
				this.m_viewerConfig.configure(window.getViewerConfiguration());
			}
			else if (window.parent && typeof window.parent.getViewerConfiguration == "function") {
				this.m_viewerConfig.configure(window.parent.getViewerConfiguration());
			}
		}
		catch(e) {
			// ignore errors for this block.
		}
		this.m_viewerUIConfig = this.m_viewerConfig.getUIConfig();
	}

	this.m_sActionState = "";

	this.m_bKeepSessionAlive = false;

	/**
	 * @type array
	 * @private
	 */
	this.m_undoStack = [];

	/**
		@type array
		@private
	*/
	this.m_aSecRequests = [];

	/**
		@type bool
		@private
	*/
	this.m_bDebug = false;

	/**
		@type string
		@private
	*/
	this.m_sCAFContext = "";
	/**
		@type string
		@private
	*/
	this.m_sContextInfoXML = "";
	/**
		@type string
		@private
	*/
	this.m_sConversation = "";
	/**
	 * @type string
	 * @private
	 */
	this.m_sStatus = "";
	/**
		@type string
		@private
	*/
	this.m_sGateway = sGateway;
	/**
		@type string
		@private
	*/
	this.m_sId = sId;
	/**
		@type string
		@private
	*/
	this.m_sMetadataInfoXML = "";
	/**
		@type string
		@private
	*/
	this.m_sParameters = "";
	/**
		@type string
		@private
	*/
	this.m_sReportState = "";

	this.envParams = {};

	/**
		@type string
		@private
	*/
	this.m_sTracking = "";
	/**
		@type string
		@private
	*/
	this.m_sSoapFault = "";
	/**
		@type string
		@private
	*/
	this.m_sWaitHTML = "";
	/**
		@type CDrillManager
		@private
	*/
	this.m_oDrillMgr = null;
	/**
		@type CDrillManager
		@private
	*/
	this.goDrillManager = null;


	this.m_oWorkingDialog = null;

	this.m_oRequestExecutedIndicator = null;

	this.m_bUseWorkingDialog = true;

	/**
		@type CSubscriptionManager
		@private
	*/
	this.m_oSubscriptionManager = null;

	/**
		@type CViewerManager
		@private
	*/
	this.m_oCVMgr = null;

	/**
		@type boolean
		@private
	*/
	this.m_bUseSafeMode = true;

	if (typeof CViewerManager == "function")
	{
		this.m_oCVMgr = new CViewerManager(this);
	}

	if (window.gaRV_INSTANCES)
	{
		// only add the cognos viewer object to the array if it isn't already in it
		var bFound = false;
		for (var iIndex=0; iIndex < window.gaRV_INSTANCES.length; iIndex++)
		{
			if (window.gaRV_INSTANCES[iIndex].m_sId == sId)
			{
				window.gaRV_INSTANCES[iIndex] = this;
				bFound = true;
				break;
			}
		}

		if (!bFound)
		{
			window.gaRV_INSTANCES = window.gaRV_INSTANCES.concat(this);
		}
	}

	this.m_bReportHasPrompts = false;

	this.m_viewerWidget = null;

	this.m_flashChartsObjectIds = [];

	this.m_raiseSharePromptEvent = true;

	this.m_actionFactory = null;

	this.m_calculationCache = {};

	this.m_drillTargets = [];

	this.m_reportRenderingDone = false;

	if (typeof PinFreezeManager !== "undefined") {
		this.m_pinFreezeManager = new PinFreezeManager(this);
	}

	if (typeof ViewerDispatcher !== "undefined") {
		this.m_viewerDispatcher = new ViewerDispatcher();
	}

	this.m_retryDispatcherEntry = null;

	this.m_RAPReportInfo=null;

	if (typeof ViewerState == "function") {
		this.m_viewerState = new ViewerState();
	}

	this.m_aInfoBar = null;
}

CCognosViewer.prototype.setScheduledMobileOutput = function(value) {
	this.m_mobileScheduledOutput = value;
	if (value) {
		this.m_sStatus = "complete";
	}
};

/**
 * Called from XSL and saved output, do not change this API
 */

CCognosViewer.prototype.setTabInfo = function(tabsPaylaod) {
	this.m_tabsPayload = tabsPaylaod;
	
	// If we needed to keep the selected tab (going from live to saved output) then
	// update the tabs payload info with the correct tabId - if we can find it
	if (this.m_tabsPayload && this.m_tabsPayload.tabs && this._keepTabSelected) {
		var found = false;
		for (var i=0; i < this.m_tabsPayload.tabs.length; i++) {
			var tab = this.m_tabsPayload.tabs[i];
			if (tab.id == this._keepTabSelected) {
				this.m_tabsPayload.currentTabId = this._keepTabSelected;
				break;
			}
		}
		
		this._keepTabSelected = null;
	}
};

CCognosViewer.prototype.setKeepTabSelected = function(tabId) {
	this._keepTabSelected = tabId;
};

CCognosViewer.prototype.getTabController = function() {
	return this.m_tabControl;
};

CCognosViewer.prototype.getCurrentlySelectedTab = function() {
	return this.m_currentlySelectedTab ? this.m_currentlySelectedTab : null; 
};

/**
 * Needed when going from saved output to a live report, or vice versa
 */
CCognosViewer.prototype.deleteTabs = function() {
	if (this.m_tabControl) {
		this.m_tabControl.destroy();
		delete this.m_tabControl;
		this.m_tabControl = null;
	}
	
	this.m_tabsPayload = null;
};

CCognosViewer.prototype.renderTabs = function() {
	if (!this.m_tabsPayload) {
		return;
	}
	
	var viewingSavedOutput = this.isSavedOutput() && !this.m_mobileScheduledOutput;
	
	var navLinks = document.getElementById("CVNavLinks" + this.getId());
	if (navLinks || !this.shouldWriteNavLinks() || viewingSavedOutput) {

		var reportDiv = this.getReportDiv();
		
		this.m_bHasTabs = true;
	
		// If we've switched from saved output to live or vice versa we need to delete the 
		// tab control so it gets re-created.
		if (this.m_tabControl && this.m_tabControl.isSavedOutput() != viewingSavedOutput) {
			this.deleteTabs();
		}
		
		if (!this.m_tabControl) {
			// No use in creating a tab control if the status isn't complete and we're not viewing saved output
			if (this.getStatus() != "complete" && !viewingSavedOutput) {
				return;
			}
			
			var tr = document.createElement("tr");
			var containerTD = document.createElement("td");

			tr.appendChild(containerTD);
	
			var mainTR = document.getElementById("mainViewerTR" + this.getId());
			if (!mainTR) {
				return;
			}			
			
			if (this.m_tabsPayload.position == "topLeft") {
				mainTR.parentNode.insertBefore(tr, mainTR);
			}
			else {
				mainTR.parentNode.appendChild(tr);
			}
			
			
			var tabContainer = null;
			if (this.m_viewerWidget) {
				tabContainer = this.m_viewerWidget.findContainerDiv().firstChild;
			}
			else {
				tabContainer = containerTD;
			}
			
			var oCV = this;
			if (viewingSavedOutput) {
				this.m_tabControl = new CognosTabControl(tabContainer, function(tabId) { oCV.switchSavedOutputTab(tabId, true); });

				this.switchSavedOutputTab(this.m_tabsPayload.currentTabId, false);
			}
			else {
				this.m_tabControl = new CognosTabControl(tabContainer, function(tabId) { oCV.switchTabs(tabId); });
			}

			if (this.m_viewerWidget) {
				this.m_tabControl.setSpaceSaverContainer(containerTD);
				this.m_tabControl.setScrollAttachNode(this.m_viewerWidget.findContainerDiv());
				this.m_tabControl.useAbsolutePosition(true);
			}
			
			this.m_tabControl.setIsSavedOutput(viewingSavedOutput);
			
			// If we're dealing with the initial http response (not ajax) then we should mimic loading of the styles.
			// We need to move the links into the head using the gScriptLoader so it knows about them and also namespace and move
			// the styles into the head. This is all needed since with tabs we need to be able to remove/add styles for each tab
			if (!window.gScriptLoader.m_bScriptLoaderCalled) {
				var content = document.getElementById("RVContent" + this.getId());

				var links = this._getNodesWithViewerId(content, "link", null);
				for (var i=0; i < links.length; i++) {
					window.gScriptLoader.moveLinks(links[i]);
					if (links[i].getAttribute("href").indexOf("promptCommon.css") > 0) {
						this.setHasPrompts(true);
					}
				}
				
				window.gScriptLoader.loadStyles(content, this.getId());
				
				this.repaintDiv(content);
			}
		}
		
		if (this.getStatus() == "prompting") {
			this.previouslySelectedTab = null;    // In case the user hits Cancel on the prompt, we want to stay on the currently selected tab
			this.m_tabControl.hide();
		}
		else {
			if (this.isHighContrast()) {
				this.m_tabControl.setHighContrast(true);
			}
			this.m_tabControl.render(this.m_tabsPayload);
			
			this.m_currentlySelectedTab = this.m_tabControl.getSelectedTabId();
		
			// Special case where RSVP returned a different tab then the one that was asked for. Can happen with conditional rendering
			if (this.m_switchingToTabId && this.m_currentlySelectedTab != this.m_switchingToTabId) {
				this._removeTabContent(reportDiv.parentNode, this.m_switchingToTabId);
				this._removeTabContent(reportDiv.parentNode, this.m_currentlySelectedTab);
				if (navLinks) {
					this._removeTabContent(navLinks.parentNode, this.m_switchingToTabId);
					this._removeTabContent(navLinks.parentNode, this.m_currentlySelectedTab);
				}
				this.m_tabInfo = {};
			}
			
			this.m_switchingToTabId = null;
		
			reportDiv.setAttribute("tabId", this.m_currentlySelectedTab);	
			if (navLinks) {
				navLinks.setAttribute("tabId", this.m_currentlySelectedTab);
			}
			
			if (isIE() && viewingSavedOutput && window.resizeIFrame && !this.m_viewerFragment && !this.m_viewerWidget) {
				window.resizeIFrame();
			}
		}
		
		this.setMaxContentSize();
	}
	else {
		var obj = this;
		setTimeout(function() { obj.renderTabs(); }, 100);
	}
	
};

CCognosViewer.prototype.cancelTabSwitch = function() {
	var reportDiv = this.getReportDiv();

	var tabCancelled = this.m_switchingToTabId;
	this.m_currentlySelectedTab = tabCancelled;
	
	this.m_tabControl.selectTab(this.previouslySelectedTab, false);
	this.switchTabs(this.previouslySelectedTab);
	
	if (reportDiv) {
		reportDiv.parentNode.removeChild(reportDiv);
	}
	
	if (this.m_tabInfo[this.m_currentlySelectedTab] && this.m_tabInfo[this.m_currentlySelectedTab].styles) {
		this._addTabStylesToHead(this.m_tabInfo[this.m_currentlySelectedTab].styles);
	}
	
	this.previouslySelectedTab = null;
	this.m_tabInfo[tabCancelled] = null;
};

CCognosViewer.prototype.switchSavedOutputTab = function(tabId, userInvoked) {
	// Clear the selection
	var selectionController = this.getSelectionController();
	if (selectionController) {
		selectionController.clearSelectedObjects();
	}
	
	this.m_currentlySelectedTab = this.m_tabControl.getSelectedTabId();
	
	if (userInvoked) {
		this.notifyTabChange(tabId);		
	}
	
	if (this.m_viewerWidget) {
		this.m_viewerWidget.getSavedOutput().switchSavedOutputTab(tabId, userInvoked);
		this.getTabController().resetPosition();
	}
	else {
		if (!this.savedOutputTabNodes) {
			var iframe = document.getElementById("CVIFrame" + this.getId());
			this.savedOutputTabNodes = getElementsByAttribute(iframe.contentWindow.document.body, "*", "tabid");
		}
		
		if (!this.savedOutputTabNodes) {
			return;
		}
		
		// Loops through all the tabs and either show or hide them
		for (var i=0; i < this.savedOutputTabNodes.length; i++) {
			var table = this.savedOutputTabNodes[i];
			table.style.display = table.getAttribute("tabid") == tabId ? "" : "none";
		}
		
		this.setMaxContentSize();
	}
};

CCognosViewer.prototype.notifyTabChange = function(newTabId) {
	// Function will get overriden when we're in mobile
};

CCognosViewer.prototype._getNodesWithViewerId = function(parentNode, nodeName, id) {
	var result = [];
	
	var nodes = parentNode.getElementsByTagName(nodeName);
	
	// Loops through all the style elements to find those with the correct namespaceId
	for (var i=0; i < nodes.length; i++) {
		var node = nodes[i];
		if (!id || (node.getAttribute && node.getAttribute("namespaceId") == id)) {
			node.parentNode.removeChild(node);
			result.push(node);
			i--;
		}
	}

	return result;
};

/**
 * Used to remove the styles that were added by a report tab. 
 */
CCognosViewer.prototype._removeTabStylesFromHead = function() {
	var id = this.getId();
	
	return this._getNodesWithViewerId(document.getElementsByTagName("head").item(0), "style", id);
};
 
CCognosViewer.prototype._addTabStylesToHead = function(tabStyles) {
	if (!tabStyles) {
		return;
	}
	
	for (var i=0; i < tabStyles.length; i++) {
		document.getElementsByTagName("head").item(0).appendChild(tabStyles[i]);
	}
};

CCognosViewer.prototype.switchTabs = function(tabId) {
	//Defect 51503 - If already on tab that was clicked on then do nothing
	if (this.m_currentlySelectedTab == tabId) {
		return;
	}

	// Clear the selection
	var selectionController = this.getSelectionController();
	if (selectionController) {
		selectionController.clearSelectedObjects();
	}

	var reportDiv = this.getReportDiv();
	
	this.m_nReportDiv = null;	// reset the member variable that keeps a link to the report div

	// Keep track of the current height. Needed if we're moving to a new tab to stop
	// the tab control from 'jumping' around.
	var oldDivHeight = reportDiv.clientHeight;
	
	// Hide the currently visible report div and nav links
	reportDiv.removeAttribute("id");
	reportDiv.style.display = "none";

	// We need to keep information about each tab in the case the user switches back to it.
	if (!this.m_tabInfo) {
		this.m_tabInfo = {};
	}
	
	var removedStyles = this._removeTabStylesFromHead();
	var dataManager = this.getSelectionController().getCCDManager();
	this.m_tabInfo[this.m_currentlySelectedTab] = {
			"conversation" : this.getConversation(),
			"metadata" : dataManager.getClonedMetadataArray(),
			"contextdata" : dataManager.getClonedContextdataArray(),
			"secondaryRequests" : this.getSecondaryRequests(),
			"styles" : removedStyles,
			"hasPromptControl" : this.getHasPrompts()
	};

	var tabContentDiv = this._findChildWithTabId(reportDiv.parentNode, tabId);
	
	this.previouslySelectedTab = this.m_currentlySelectedTab;	// Needed in case the user hit Cancel on the new tab, we want to return to the previously selected tab

	
	// If we have a cached div that contains a prompt control then remove it from the DOM. We cannot simply flip between divs with tab controls
	// since we might get ID collisions
	if (tabContentDiv && this.m_tabInfo[tabId] && this.m_tabInfo[tabId].hasPromptControl) {
		if (tabContentDiv) {
			tabContentDiv.parentNode.removeChild(tabContentDiv);
			tabContentDiv = null;
		}
		
		delete this.m_tabInfo[tabId];
		this.m_tabInfo[tabId] = null;
	}
	
	// Do we already have a div for the tab we're switching to
	if (tabContentDiv) {
		this.m_currentlySelectedTab = tabId;
		
		tabContentDiv.style.display = "block";
		tabContentDiv.setAttribute("id", "CVReport" + this.getId());
		
		if (this.m_tabInfo && this.m_tabInfo[tabId]) {
			var tabInfo = this.m_tabInfo[tabId];
			if (tabInfo.conversation) {
				this.setConversation(tabInfo.conversation);
			}
			
			if (tabInfo.metadata) {
				dataManager.SetMetadata(tabInfo.metadata);
			}
			
			if (tabInfo.contextdata) {
				dataManager.SetContextData(tabInfo.contextdata);
			}
			
			if (tabInfo.secondaryRequests) {
				this.setSecondaryRequests(tabInfo.secondaryRequests);
			}
			
			if (tabInfo.styles) {
				this._addTabStylesToHead(tabInfo.styles);
			}
			
			this.setHasPrompts(tabInfo.hasPromptControl);
		}
		
		if (this.shouldWriteNavLinks()) {
			this.writeNavLinks(this.getSecondaryRequests().join(" "));
		}
		
		if (this.getPinFreezeManager() && this.getPinFreezeManager().hasFrozenContainers()) {
			this.getPinFreezeManager().rePaint();
			
			// force IE to repaint the div or the the RVContent div won't resize
			if (isIE()) {
				var oRVContent = document.getElementById("RVContent" + this.getId());
				this.repaintDiv(oRVContent);				
			}
		}		
		
		if (this.m_viewerWidget) {
			this.m_viewerWidget.placeTabControlInView();
		}
		
		// The tab that was clicked on is already in focus. Make sure we don't move the focus around.
		this._keepFocus = null;
		
		this.doneLoadingUpdateA11Y("complete");
		this.getTabController().resetPosition();
		
		this.setMaxContentSize();
	}
	else {
		this.m_switchingToTabId = tabId;

		var newReportDiv = reportDiv.cloneNode(false);
		newReportDiv.style.display = "block";
		newReportDiv.setAttribute("id", "CVReport" + this.getId());
		newReportDiv.removeAttribute("tabId");	// We don't want to clone the tabId
		reportDiv.parentNode.appendChild(newReportDiv);
		newReportDiv.innerHTML = "<table height='" + oldDivHeight + "px'><tr><td height='100%'></td></tr></table>";
				
		var request = new ViewerDispatcherEntry(this);
		request.addFormField("ui.action", "reportAction");
		request.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup", tabId);
		
		if (this.m_viewerWidget) {
			this.m_viewerWidget.placeTabControlInView();
		}
		
		this.dispatchRequest(request);
	}
};

/**
 * Removed the content div associated to a particular tab
 */
CCognosViewer.prototype._removeTabContent = function(parentNode, tabId) {
	var tabContentDiv = this._findChildWithTabId(parentNode, tabId);
	while(tabContentDiv) {
		tabContentDiv.parentNode.removeChild(tabContentDiv);
		tabContentDiv = this._findChildWithTabId(parentNode, tabId);
	}	
};

CCognosViewer.prototype._findChildWithTabId = function(parentNode, tabId) {
	var matchedNode = null;
	
	for (var i=0; i < parentNode.childNodes.length; i++) {
		var childNode = parentNode.childNodes[i];
		if (childNode.getAttribute("tabId") == tabId) {
			matchedNode = childNode;
			break;
		}
	}
	
	return matchedNode;
};

/**
 * Clears all the content divs associated to the tabs except the visible div
 */
CCognosViewer.prototype.clearTabs = function() {
	if (!this.m_bHasTabs) {
		return;
	}
	
	this.m_tabInfo = {};
	
	var reportDiv = this.getReportDiv();
	var parentNode = reportDiv.parentNode;
	
	for (var i=0; i < parentNode.childNodes.length; i++) {
		var node = parentNode.childNodes[i];
		if (node.getAttribute("id") != "CVReport" + this.m_sId) {
			parentNode.removeChild(node);
			i--;
		}
	}
};

CCognosViewer.prototype.isSavedOutput = function() {
	var action = this.envParams["ui.action"];
	return action === 'view' || action === 'buxView';
};

CCognosViewer.prototype.renderSavedOutputIFrame = function(url, title, renderTabs) {
	var reportDiv = document.getElementById("CVReport" + this.getId());
	var iframe = document.createElement("iframe");
	iframe.style.width = "100%";
	iframe.style.height = reportDiv.clientHeight ? reportDiv.clientHeight + "px" : "99%";
	iframe.id = "CVIFrame" + this.getId();
	iframe.title = title;
	iframe.setAttribute("frameBorder", "0");
		
	reportDiv.appendChild(iframe);
	
	var obj = this;
	var func = function() { 
		obj.renderTabs(); 
	};

	setTimeout(function() {
		// If we're suppose to render tabs, set the onload of the iframe
		if (renderTabs) {
			if(iframe.attachEvent) {
				iframe.attachEvent("onload", func);
			}
			else {
				iframe.addEventListener("load", func, true);
			}		
		}

		iframe.src = url; 
	}, 1);
};

/**
 * This gets called from rv.xsl
 */
CCognosViewer.prototype.updatePageState = function(pageState) {
	if (pageState && this.getState()) {
		this.getState().setPageState(pageState);
	}
};

/**
 * Public API used by customers, do not change!
 */
CCognosViewer.prototype.getPageInfo = function() {
	if (this.m_viewerState && this.m_viewerState.getPageState()) {
		var pageState = this.m_viewerState.getPageState();
		return {
			"currentPage" : pageState.getCurrentPage(),
			"pageCount" : pageState.getPageCount()
		};
	}

	return {};
};

CCognosViewer.prototype.isIWidgetMobile = function() {
	return this.m_viewerWidget && this.m_viewerWidget.isMobile();
};

CCognosViewer.prototype.isInteractiveViewer = function() {
	return false;
};

/**
 * Returns true if we're in CW and inside the mobile app. If that's the case
 * the goto page will be launched via an iwidget event
 */
CCognosViewer.prototype.launchGotoPageForIWidgetMobile = function(form) {
	if (this.isIWidgetMobile()) {
		this.m_viewerWidget.launchGotoPageForIWidgetMobile(form);
		return true;
	}

	return false;
};

CCognosViewer.prototype.executeDrillThroughForIWidgetMobile = function(form) {
	if (this.isIWidgetMobile()) {
		this.m_viewerWidget.executeDrillThroughForIWidgetMobile(form);
		return true;
	}
	return false;
};

CCognosViewer.prototype.getState = function() {
	return this.m_viewerState;
};

CCognosViewer.prototype.getConfig = function() {
	return this.m_viewerConfig;
};

CCognosViewer.prototype.getUIConfig = function() {
	return this.m_viewerUIConfig;
};

CCognosViewer.prototype.setCurrentNodeFocus = function(node) {
	this.m_currentNodeFocus = node;
};

CCognosViewer.prototype.getCurrentNodeFocus = function(node) {
	return this.m_currentNodeFocus;
};

/**
 * Override this method if you need to load extra javascript files
 */
CCognosViewer.prototype.loadExtra = function() {};

CCognosViewer.prototype.setRetryDispatcherEntry = function(dispatcherEntry) {
	this.m_retryDispatcherEntry = dispatcherEntry;
};

CCognosViewer.prototype.getRetryDispatcherEntry = function() {
	return this.m_retryDispatcherEntry;
};

CCognosViewer.prototype.resetViewerDispatcher = function() {
	if (this.m_viewerDispatcher !== null) {
		delete this.m_viewerDispatcher;
		this.m_viewerDispatcher = new ViewerDispatcher();
	}
};

CCognosViewer.prototype.getViewerDispatcher = function() {
	return this.m_viewerDispatcher;
};

CCognosViewer.prototype.setFaultDispatcherEntry = function(dispatcherEntry) {
	this.m_faultDispatcherEntry = dispatcherEntry;
};

CCognosViewer.prototype.getFaultDispatcherEntry = function() {
	return this.m_faultDispatcherEntry;
};

CCognosViewer.prototype.dispatchRequest = function(dispatcherEntry) {
	this.setFaultDispatcherEntry(null);
	this.getViewerDispatcher().dispatchRequest(dispatcherEntry);
};

CCognosViewer.prototype.getActiveRequest = function() {
	return this.getViewerDispatcher().getActiveRequest();
};

CCognosViewer.prototype.getProductLocale = function() {
	if (this.sProductLocale) {
		return this.sProductLocale;
	}

	// default to english if the productLocale wasn't set
	return "en";
};

CCognosViewer.prototype.getDirection = function() {
	if (this.sDirection) {
		return this.sDirection;
	}

	return "ltr";
};

CCognosViewer.prototype.isBidiEnabled = function() {
	if (this.bIsBidiEnabled) {
		return true;
	}

	return false;
};

CCognosViewer.prototype.getBaseTextDirection = function() {
	if(this.isBidiEnabled()){
		if (this.sBaseTextDirection) {
			return this.sBaseTextDirection;
		}
	}
	return "";
};


CCognosViewer.prototype.getActionFactory = function(){
	if (!this.m_actionFactory) {
		this.m_actionFactory = new ActionFactory(this);
	}

	return this.m_actionFactory;
};

CCognosViewer.prototype.getAction = function(action) {
	var action = this.getActionFactory().load(action);
	action.setCognosViewer(this);
	return action;
};

CCognosViewer.prototype.getCalculationCache = function(){
	return this.m_calculationCache;
};

CCognosViewer.prototype.updateOutputForA11ySupport = function() {
	this.updateBorderCollapse();
	
	// Defect COGCQ00849044 - drill through links outside of data tables don't get
	// the correct labelledBy to let a JAWS use know there's a drill through link
	if (this.getA11YHelper()) {
		this.getA11YHelper().addLabelledByForItemsOutsideOfContainers();
	}

	var v_sAgent = navigator.userAgent.toLowerCase();

	var v_bIsIPhone 	= v_sAgent.indexOf( "iphone" ) != -1;
	var v_bIsIPod 		= v_sAgent.indexOf( "ipod" ) != -1;
	var v_bIsIPad 		= v_sAgent.indexOf( "ipad" ) != -1;
	var v_bIsIOS 		= v_bIsIPhone || v_bIsIPod || v_bIsIPad;
	var v_bIsAndroid 	= v_sAgent.indexOf( "android") != -1;

	if ( v_bIsIOS || v_bIsAndroid  )
	{
		document.body.classList.add( "clsViewerMobile" );
	}
};

CCognosViewer.prototype.checkForHighContrast = function()
{
	if (this.isBux) {
		this.m_bHighContrast = dojo.hasClass(document.body, "dijit_a11y") ? true : false;
	}
	else {
		var tempDiv = document.createElement("div");
		tempDiv.id = this.m_sId + "hc";
		tempDiv.style.border = "1px solid";
		tempDiv.style.borderColor = "red green";
		tempDiv.style.height = "10px";
		tempDiv.style.top = "-999px";
		tempDiv.style.position = "absolute";
		document.body.appendChild(tempDiv);

		var computedStyle = null;
		if (isIE())
		{
			computedStyle = tempDiv.currentStyle;
		}
		else
		{
			computedStyle = tempDiv.ownerDocument.defaultView.getComputedStyle(tempDiv, null);
		}

		if (!computedStyle) {
			return;
		}


		this.m_bHighContrast = computedStyle.borderTopColor == computedStyle.borderRightColor;
		document.body.removeChild(tempDiv);
	}
};

CCognosViewer.prototype.isHighContrast = function()
{
	if (typeof this.m_bHighContrast === "undefined") {
		this.checkForHighContrast();
	}
	return this.m_bHighContrast;
};

CCognosViewer.prototype.isLimitedInteractiveMode = function() {
	return this.envParams && this.envParams.limitedInteractiveMode && this.envParams.limitedInteractiveMode === "true";
};

CCognosViewer.prototype.updateBorderCollapse = function()
{

	if (this.isHighContrast() == true)
	{
		var reportDiv = null;
		if (this.envParams["ui.action"] == "view" && !this.isBux)
		{
			var iframe = document.getElementById("CVIFrame" + this.getId());
			reportDiv = iframe.contentWindow.document;
		}
		else
		{
			reportDiv = document.getElementById("CVReport" + this.getId());
		}

		var tables = reportDiv.getElementsByTagName("table");
		for (var i = 0; i < tables.length; i++)
		{
			if (tables[i].style.borderCollapse == "collapse")
			{
				tables[i].style.borderCollapse = "separate";
			}
		}
	}
};

CCognosViewer.prototype.isAccessibleMode = function()
{
	if (this.m_bAccessibleMode == true)
	{
		return true;
	}

	return false;
};

/**
 * @return true if the current report is a single page report.
 */
CCognosViewer.prototype.isSinglePageReport = function()
{
	for (var request in this.m_aSecRequests) {
		if (this.m_aSecRequests[request] == 'nextPage' || this.m_aSecRequests[request] == 'previousPage')
		{
			return false;
		}
	}
	return true;
};

/**
 * @return true if the current report can sent nextPage request
 */
CCognosViewer.prototype.hasNextPage = function()
{
	for (var request in this.m_aSecRequests) {
		if (this.m_aSecRequests[request] == 'nextPage')
		{
			return true;
		}
	}
	return false;
};
/**
 * @return true if the current report can sent previousPage request
 */
CCognosViewer.prototype.hasPrevPage = function()
{
	for (var request in this.m_aSecRequests) {
		if (this.m_aSecRequests[request] == 'previousPage')
		{
			return true;
		}
	}
	return false;
};

/**
 * KeyDown events handler attached to the document, which disables hotkey page navigation within the viewer
 * @private
 */
CCognosViewer.prototype.captureHotkeyPageNavigation = function(evt)
{

	evt = (evt) ? evt : ((event) ? event : null);
	if(evt)
	{
		var node = getNodeFromEvent(evt);
		var nodeName = (node && node.nodeName) ? node.nodeName.toLowerCase() : null;
		if( (evt.keyCode == 8 && nodeName != "input" && nodeName != "textarea") || (evt.altKey == true && (evt.keyCode == 37 || evt.keyCode == 39)) )
		{
			evt.returnValue = false;
			evt.cancelBubble = true;
			if(typeof evt.stopPropagation != "undefined")
			{
				evt.stopPropagation();
			}
			if(typeof evt.preventDefault != "undefined")
			{
				evt.preventDefault();
			}

			return false;
		}
	}

	return true;
};

CCognosViewer.prototype.setUseWorkingDialog = function(bUseWorkingDialog) {
	this.m_bUseWorkingDialog = bUseWorkingDialog;
};

CCognosViewer.prototype.getWorkingDialog = function( ) {
	if (!this.m_oWorkingDialog && this.m_bUseWorkingDialog && typeof WorkingDialog !== "undefined") {
		if (this.getConfig() && this.getConfig().getHttpRequestConfig() && this.getConfig().getHttpRequestConfig().getWorkingDialog()) {
			this.m_oWorkingDialog = this.getConfig().getHttpRequestConfig().getWorkingDialog();
		}
		else {
			this.m_oWorkingDialog = new WorkingDialog(this);
		}
	}

	return this.m_oWorkingDialog;
};

CCognosViewer.prototype.getRequestIndicator = function() {
	if (this.m_bUseWorkingDialog && !this.m_oRequestExecutedIndicator  && typeof RequestExecutedIndicator !== "undefined") {
		if (this.getConfig() && this.getConfig().getHttpRequestConfig() && this.getConfig().getHttpRequestConfig().getRequestIndicator()) {
			this.m_oRequestExecutedIndicator = this.getConfig().getHttpRequestConfig().getRequestIndicator();
		}
		else {
			this.m_oRequestExecutedIndicator = new RequestExecutedIndicator(this);
		}
	}

	return this.m_oRequestExecutedIndicator;
};

/**
 * Call this method to disable hot key page navigation within the viewer (back space, alt+left arrow, alt+right arrow)
 */
CCognosViewer.prototype.disableBrowserHotkeyPageNavigation = function() {
	if (document.attachEvent)
	{
		document.attachEvent("onkeydown", this.captureHotkeyPageNavigation);
	}
	else if (document.addEventListener)
	{
		document.addEventListener("keydown", this.captureHotkeyPageNavigation, false);
	}
};

/**
 * Sets if the current HTML being displayed contains prompt controls
 * @param (boolean) hasPrompts
*/
CCognosViewer.prototype.setHasPrompts = function(hasPrompts)
{
	if (!hasPrompts) {
		this.preProcessControlArray = [];
	}
	this.m_bReportHasPrompts =  hasPrompts;
};

/**
 * Checks to see if the HTML being displayed contains prompt controls
 * @return (boolean)
 */
CCognosViewer.prototype.getHasPrompts = function() {
	return this.m_bReportHasPrompts;
};


/**
 * Sets the request mode (page/data)
 * @param (boolean) bPageRequest
*/
CCognosViewer.prototype.setUsePageRequest = function(bPageRequest)
{
	this.m_viewerDispatcher.setUsePageRequest(bPageRequest);
};

/**
 * Gets the request mode (page/data)
 * @return (boolean)
 */
CCognosViewer.prototype.getUsePageRequest = function() {
	return this.m_viewerDispatcher.getUsePageRequest();
};

/**
 * If you don't want the viewer to release the current conversation on a page reload, use this method to keep the session alive
 * on page reloads
 * @param (boolean)
 */
CCognosViewer.prototype.setKeepSessionAlive = function(bValue) {
	this.m_bKeepSessionAlive = bValue;
};

/**
 * Return the "Keep Session Alive" boolean value
 * @return (boolean)
 */
CCognosViewer.prototype.getKeepSessionAlive = function() {
	return this.m_bKeepSessionAlive;
};

/**
 * Returns the web content root
 * @return (string)
 */
CCognosViewer.prototype.getWebContentRoot = function()
{
	if (typeof this.sWebContentRoot != "undefined")
	{
		return this.sWebContentRoot;
	}
	else
	{
		return "..";
	}
};

/**
 * Returns the skin directory
 * @return (string)
 */
CCognosViewer.prototype.getSkin = function()
{
	if (typeof this.sSkin != "undefined")
	{
		return this.sSkin;
	}
	else
	{
		return this.getWebContentRoot() + "/skins/corporate";
	}
};

CCognosViewer.prototype.getSelectionController = function()
{
	var selectionController;
	try
	{
		selectionController = getCognosViewerSCObjectRef(this.m_sId);
	}
	catch(e)
	{
		selectionController = null;
	}

	return selectionController;
};

/**
	Set up a function to call for events in CCognosViewer.
	@param {string} sEventName Event names are:
		<ul>
		<li><code>done</code> (when a report page is returned)</li>
		<li><code>error</code> (when an error code is returned)</li>
		<li><code>prompt</code> (when an prompt page is returned)</li>
		<li><code>wait</code> (when we get a ?working? and ?stillWorking? state)</li>
		</ul>
	@param {function} oFct Function to call when this even occurs.
	@param {bool} bCaptureEvent If set to true, the normal behavior will not be used.
*/
CCognosViewer.prototype.addCallback = function(sEventName, oFct,  bCaptureEvent)
{
	if (!this.m_aCallback)
	{
		this.m_aCallback = [];
	}

	this.m_aCallback = this.m_aCallback.concat({
		m_sEvent: sEventName,
		m_oCallback: oFct,
		m_bCaptureEvent: (bCaptureEvent===true)
	});
};

/**
	Determines if the element supports drill down or not.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Default is <code>false</code>.
	@type bool
*/
CCognosViewer.prototype.canDrillDown = function(sId)
{
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			return (selectionController.canDrillDown(sCtx));
		}
	}
	return false;
};

/**
	Determines if the element supports drill up or not.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Default is <code>false</code>.
	@type bool
*/
CCognosViewer.prototype.canDrillUp = function(sId)
{
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			return (selectionController.canDrillUp(sCtx));
		}
	}
	return false;
};

/**
	Call this function to know if all required prompts have valid inputs.
*/
CCognosViewer.prototype.canSubmitPrompt = function()
{
	var oPromptElement = null;

	if (this.preProcessControlArray && this.preProcessControlArray instanceof Array)
	{
		var kCount = this.preProcessControlArray.length;
		for ( var k=0; k < kCount; k++ )
		{
			oPromptElement = eval( this.preProcessControlArray[k] );
			if ( oPromptElement.isValid() === false )
			{
				// RTC 123130 : cascade children cannot block submit/refresh if m_reportRenderingDone. 
				if (!this.m_reportRenderingDone || !oPromptElement.getCascadeOnParameter || !oPromptElement.getCascadeOnParameter()) {
					return false;
				}
			}
		}
	}

	return true;
};

CCognosViewer.prototype.closeContextMenuAndToolbarMenus = function() {
	if (this.rvMainWnd) {
		this.rvMainWnd.closeContextMenuAndToolbarMenus();
	}
};

/**
	Context Menu Handler in Report Viewer.
	dcm == Display Context Menu
	@private
*/
CCognosViewer.prototype.dcm = function(event, selectNode)
{
	if (this.canDisplayContextMenu())
	{
		if (this.preSelectNode == true) {
			selectNode = false;
			this.preSelectNode = false;
		}
		if (this.rvMainWnd.displayContextMenu(event, selectNode) != false)
		{
			return stopEventBubble(event);
		}
	}
};

/**
 * Determines if the viewer should show a context menu
 * @private
 */
CCognosViewer.prototype.canDisplayContextMenu = function()
{
	if (!this.getUIConfig() || this.getUIConfig().getShowContextMenu()) {
		return ( !this.isWorkingOrPrompting() && this.rvMainWnd != null && typeof this.bCanUseCognosViewerContextMenu != "undefined" && this.bCanUseCognosViewerContextMenu);
	}

	return false;
};

/**
	Handler for drill actions in Report Viewer.
	de == Drill Event
	@private
*/
CCognosViewer.prototype.de = function(event)
{
	var oDrillMgr = this.getDrillMgr();
	if (oDrillMgr)
	{
		oDrillMgr.singleClickDrillEvent(event, 'RV');
	}
};

/**
	@param {string} Message
	@private
*/
CCognosViewer.prototype.debug = function(sMsg)
{
	if (this.m_bDebug)
	{
		var sCallee = "";
		var oCaller = this.debug.caller;
		if (typeof oCaller == "object" && oCaller !== null)
		{
			sCallee = oCaller.toString().match(/function (\w*)/)[1];
		}
		if (!sCallee)
		{
			sCallee = '?';
		}
		alert(sCallee + ": " + sMsg);
	}
};

CCognosViewer.prototype.callbackExists = function(sEvent) {
	var bEventWasCaptured = false;

	if (this.m_aCallback && this.m_aCallback.length) {
		for (var idxCallback = 0; idxCallback < this.m_aCallback.length; ++idxCallback) {
			var oCB = this.m_aCallback[idxCallback];

			if (oCB.m_sEvent == sEvent) {
				return true;
			}
		}
	}
	return false;
};

/**
	@param {string} sEvent Event name to call the callback functions for.
	@type boolean
	@return <i>true</i> if there was a callback associated with the event and that it's capture event was set to true. <i>false</i> otherwise.
	@private
*/
CCognosViewer.prototype.executeCallback = function(sEvent)
{
	var bEventWasCaptured = false;

	if (this.m_aCallback && this.m_aCallback.length)
	{
		for (var idxCallback = 0; idxCallback < this.m_aCallback.length; ++idxCallback)
		{
			var oCB = this.m_aCallback[idxCallback];

			if (oCB.m_sEvent == sEvent)
			{
				if (typeof oCB.m_oCallback == "function")
				{
					oCB.m_oCallback();
				}
				if (oCB.m_bCaptureEvent)
				{
					bEventWasCaptured = true;
				}
			}

		}
	}
	return bEventWasCaptured;
};

/**
	CAF context information.
	@return CAF encoded string.
	@type string
*/
CCognosViewer.prototype.getCAFContext = function()
{
	return this.m_sCAFContext;
};


/**
	Get the fault
	@return string
*/
CCognosViewer.prototype.getSoapFault = function()
{
	return this.m_sSoapFault;
};

/**
	Returns the identifiers of the columns related to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return array of identifiers of the columns making up this element.
	@type string[]
*/
CCognosViewer.prototype.getColumnContextIds = function(sId)
{
	return  this.getContextIds(sId, 2);
};

/**
	Conversation info (encoded string).
	@return CAF encoded string.
	@type string
*/
CCognosViewer.prototype.getConversation = function()
{
	return this.m_sConversation;
};

/**
 * Status of the ongoing report server conversation
 * @return conversation status
 * @type string
 */
CCognosViewer.prototype.getStatus = function()
{
	return (this.m_sStatus ? this.m_sStatus : "");
};

/**
 * Checks if current status is a working state
 * @param {string} sState? Optional parameter. If not a string, the current state of CCognosViewer will be used.
 * @return true/false
 * @type boolean
 */
CCognosViewer.prototype.isWorking = function(sState)
{
	if (typeof sState != "string") {
		sState = this.getStatus();
	}
	return ((""+sState).match(/^(working|stillWorking)$/) ? true : false);
};

/**
 * Checks if current status is a working or prompting state
 * @return true/false
 * @type boolean
 */
CCognosViewer.prototype.isWorkingOrPrompting = function()
{
	return (this.getStatus().match(/^(working|stillWorking|prompting)$/) ? true : false);
};

/**
 * Returns the action state. This value will only be set if the action is in a interupted state (wait/prompting)
 * @return action state
 * @type string
 */
CCognosViewer.prototype.getActionState = function()
{
	return this.m_sActionState;
};

/**
	Get the name of the ref data item associated with the element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Name of the ref data item associated with the element. Returns <code>null</code> if there is not any.
	@type string
	@deprecated Use CCognosViewer.getReportContextHelper().getDataItemName() instead
*/
CCognosViewer.prototype.getDataItemName = function(sId)
{
	var sName = null;
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aName = selectionController.getRefDataItem(sCtx);
			if (aName) {
				sName = aName;
			}
		}
	}
	return sName;
};

/**
	Get the Name of the data type associated with the element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Name of the data type associated with the element. Returns <code>null</code> if there is not any.
	@type int
*/
CCognosViewer.prototype.getDataType = function(sId)
{
	var sType = null;
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aType = selectionController.getDataType(sCtx);
			if (aType) {
				sType = aType;
			}
		}
	}
	return sType;
};


/**
	Returns the level associated with the element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Depth (relative to the hierarchy) of the element. Returns <code>null</code> if there is not any.
	@type integer
*/
CCognosViewer.prototype.getDepth = function(sId)
{
	var sLevel = null;
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aLevel = selectionController.getDepth(sCtx);
			if (aLevel) {
				sLevel = aLevel;
			}
		}
	}
	return sLevel;
};

/**
	@return CAF encoded string.
	@type string
	@private
*/
CCognosViewer.prototype.getDrillMgr = function()
{
	if (!this.m_oDrillMgr) {
		this.loadExtra();
		if (typeof CDrillManager == "function") {
			this.m_oDrillMgr = new CDrillManager(this);
			this.goDrillManager = this.m_oDrillMgr;
		}
	}

	return this.m_oDrillMgr;
};


/**
	@return the subscription handler.
	@type object
	@private
*/
CCognosViewer.prototype.getSubscriptionManager = function()
{
	if (!this.m_oSubscriptionManager) {
		this.loadExtra();
		if (typeof CSubscriptionManager == "function") {
			this.m_oSubscriptionManager = new CSubscriptionManager(this);
		}
	}

	return this.m_oSubscriptionManager;
};


/**
	Execution Parameters (encoded string).
	@return CAF encoded string.
	@type string
*/
CCognosViewer.prototype.getExecutionParameters = function()
{
	return this.m_sParameters;
};

/**
	@private
	@return Gateway path.
	@type string
*/
CCognosViewer.prototype.getGateway = function()
{
	return this.m_sGateway;
};
/**
	@public
	@return current specification
	@type string
*/
CCognosViewer.prototype.getSpecification = function()
{
	return this.envParams["ui.spec"];
};

/**
	Returns the Hierarchy Unique Name (HUN) associated to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Name (HUN) of the hierarchy associated with the element. Returns <code>null</code> if there is not any.
	@type string
*/
CCognosViewer.prototype.getHierarchyUniqueName = function(sId)
{
	var sHun = null;
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aHUN = selectionController.getHun(sCtx);
			if (aHUN) {
				sHun = aHUN;
			}
		}
	}
	return sHun;
};

/**
	Returns the Dimension Unique Name (DUN) associated to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Name (DUN) of the dimension associated with the element. Returns <code>null</code> if there is not any.
	@type string
*/
CCognosViewer.prototype.getDimensionUniqueName = function(sId)
{
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aDUN = selectionController.getDun(sCtx);
			if (aDUN) {
				return aDUN;
			}
		}
	}
	return null;
};

/**
	@private
	@return Id Identifier for this instance of CCognosViewer.
	@type string
*/
CCognosViewer.prototype.getId = function()
{
	return this.m_sId;
};

/**
	Returns the Level Id (LUN) associated to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Identifier for the level associated with the element. Returns <code>null</code> if there is not any.
	@type string
*/
CCognosViewer.prototype.getLevelId = function(sId)
{
	var sLevel = null;
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aLUN = selectionController.getLun(sCtx);
			if (aLUN) {
				sLevel = aLUN;
			}
		}
	}
	return sLevel;
};

/**
	Returns the Member Unique Name (MUN) associated to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Name (MUN) of the member associated with the element. Returns <code>null</code> if there is not any.
	@type string
	@deprecated Use CCognosViewer.getReportContextHelper().getMun() instead
*/
CCognosViewer.prototype.getMemberUniqueName = function(sId)
{
	var sMUN = null;
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aMUN = selectionController.getMun(sCtx);
			if (aMUN) {
				sMUN = aMUN;
			}
		}
	}
	return sMUN;
};

/**
	This function return the name of the javascript reference (variable) to this object. The default is "window" if the id is invalid.
	@private
	@return Id Identifier for this instance of CCognosViewer.
	@type string
*/
CCognosViewer.prototype.getObjectId = function()
{
	var sObjId = "window";
	if (typeof this.getId() == "string") {
		sObjId = getCognosViewerObjectRefAsString(this.getId());
	}
	return sObjId;
};

/**
	Returns the Query Id associated to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Model id associated with the element. Returns <code>null</code> if there is not any.
	@type string
*/
CCognosViewer.prototype.getQueryModelId = function(sId)
{
	var sQuery = null;
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aQMID = selectionController.getQueryModelId(sCtx);
			if (aQMID) {
				sQuery = aQMID;
			}
		}
	}
	return sQuery;
};

/**
	Returns the Query name associated to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Query name associated with the element. Returns <code>null</code> if there is not any.
	@type string
*/
CCognosViewer.prototype.getQueryName = function(sId)
{
	var sQuery = null;
	var sCtx = this.findCtx(sId).split("::")[0];
	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			var aQuery = selectionController.getRefQuery(sCtx);
			if (aQuery) {
				sQuery = aQuery;
			}
		}
	}
	return sQuery;
};

CCognosViewer.prototype.getContextIds = function(sId, index)
{
	var aIds = [];
	var sCtx = this.findCtx(sId);
	if (sCtx)
	{
		var aIDparts = sCtx.split("::");
		if (aIDparts && aIDparts.length > 1 && index < aIDparts.length)
		{
			aIds = aIDparts[index].split(":");
		}
	}
	return aIds;
};


/**
	Returns the identifiers of the rows related to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return array of identifiers of the rows making up this element.
	@type string[]
*/
CCognosViewer.prototype.getRowContextIds = function(sId)
{
	return this.getContextIds(sId, 1);
};

/**
	Returns the identifiers of the page related to an element.
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return array of identifiers of the rows making up this element.
	@type string[]
 */
CCognosViewer.prototype.getPageContextIds = function(sId)
{
	return this.getContextIds(sId, 3);
};

/**
	@private
	@param {string} sKey the key of the string
	@type string
	@return The localized string matching the key. Returns the key if it there is not string associated.
*/
CCognosViewer.prototype.getString = function(sKey)
{
	if (RV_RES && RV_RES[sKey]) {
		return RV_RES[sKey];
	}
	return sKey;
};

/**
	@private
	@type CViewerManager
	@return A CViewerManager instance or a "window" object if the former do not exists.
*/
CCognosViewer.prototype.getRV = function()
{
	if (typeof this.m_oCVMgr == "object")
	{
		return this.m_oCVMgr;
	}
	return window;
};

/**
	@private
	@type array
	@return available secondary requests
*/
CCognosViewer.prototype.getSecondaryRequests = function()
{
	return this.m_aSecRequests;
};

/**
	Tracking info (encoded string).
	@type string
	@return CAF encoded string.
*/
CCognosViewer.prototype.getTracking = function()
{
	return this.m_sTracking;
};

/**
	@private
	@type string
	@param {string} sId Identifier or a HTML element
	@return Returns an empty string if not found.
*/
CCognosViewer.prototype.findCtx = function(sId)
{
	var sCtx = "";
	if (typeof sId == "string")
	{
		// return sId if it matches something in the context data
		var aCtx = this.getReportContextHelper().processCtx(sId);
		var sRefDataItem = aCtx[0][0];
		var selectionController = this.getSelectionController();
		if (selectionController) {
			if (selectionController.isContextId(sRefDataItem))
			{
				sCtx = sId;
			}
		}
	}
	if (!sCtx)
	{
		var oHTMLElement = this.findElementWithCtx(sId);
		if (oHTMLElement)
		{
			sCtx = oHTMLElement.getAttribute("ctx");
		}
	}
	return sCtx;
};

/**
	@private
	@type HTMLelement
	@param {string} sId Identifier or a HTML element
	@return Returns a HTML element with a <i>ctx</i> attribute. Processed recursively on the children. Returns <code>null</node> if there is not any.
*/
CCognosViewer.prototype.findElementWithCtx = function(sId)
{
	var oElement = sId;
	if (typeof sId == "string") {
		oElement = this.findElementWithCtx(document.getElementById(sId));
	}
	if (oElement)
	{
		if (oElement.getAttribute && oElement.getAttribute("ctx"))
		{
			return oElement;
		}
		for (var idxChild = 0; idxChild < oElement.childNodes.length; idxChild++)
		{
			var oChild = this.findElementWithCtx(oElement.childNodes[idxChild]);
			if (oChild) {
				return oChild;
			}
		}
	}
	return null;
};

/**
	Returns the use value associated to an element.
	@type string
	@param {string} sId Identifier or the HTML element with a ctxId attribute.
	@return Use value associated with the element. Returns <code>null</code> if there is not any.
*/
CCognosViewer.prototype.getUseValue = function(sId)
{
	var sVal = null;

	var sCtx = this.findCtx(sId).split("::")[0];

	if (sCtx) {
		var selectionController = this.getSelectionController();
		if (selectionController) {
			sVal = selectionController.getUseValue(sCtx);
		}
	}
	return sVal;
};

/**
	@private
	@param {object} oProp Properties to add to this instance of CCognosViewer, like flags and strings.
*/
CCognosViewer.prototype.init = function(oProperties)
{
	if (oProperties && typeof oProperties == "object")
	{
		for (var sProp in oProperties)
		{
			this[sProp] = oProperties[sProp];
		}
	}
};

/**
 * @private
 * Method that should only be called when the user hits the back button in the browser
 */
CCognosViewer.prototype.initViewer = function(originalState) {
	var requestHandler = new RequestHandler(this);
	var backJaxForm = document.getElementById('formBackJax' + this.getId());
	if (backJaxForm && typeof backJaxForm.state != "undefined" && backJaxForm.state.value.length > 0) {
		requestHandler.loadReportHTML(backJaxForm.result.value);

		var oState = eval("(" + backJaxForm.state.value + ")");
		requestHandler.updateViewerState(oState);

		requestHandler.postComplete();
	}
	else {
		// If ajax is off and the status is working, save the fact that we've visited
		// this page so we know we've done the wait request. If we get called again
		// (browser back button) then simply keep going back in the browser history
		// since we don't want to execute the wait again or it'll cause an asynch error.
		if (this.getUsePageRequest()) {
			var status = originalState ? originalState.m_sStatus : null;

			// For some reason the form field trick does not work in IE, instead
			// we can use the hash to know if the user hit the back button. Note the
			// hash trick doesn't work in Chrome, so the other browsers
			// will use the form field trick
			if (isIE()) {
				if (window.location.hash == '#working') {
					window.history.go(-2);
					return;
				}
				else if (status === "working" || status === "stillWorking") {
					window.location.hash = "#working";
				}
			}
			else if (backJaxForm && backJaxForm.working){
				if (backJaxForm.working.value == "true") {
					window.history.go(-1);
					return;
				}
				else if (status === "working" || status === "stillWorking") {
					backJaxForm.working.value = "true";
				}
			}
		}

		requestHandler.processInitialResponse(originalState);
	}
};

/**
 * @private
 * @Saves the responseXML for a completed request
 */
CCognosViewer.prototype.saveBackJaxInformation = function(dataResponse) {
	var backJaxForm = document.getElementById('formBackJax' + this.getId());
	if (backJaxForm) {
		if (typeof backJaxForm.state != "undefined") {
			backJaxForm.state.value = dataResponse.getResponseStateText();
		}
		if (typeof backJaxForm.result != "undefined") {
			backJaxForm.result.value = dataResponse.getResult();
		}
	}
};

/**
	Pre-selects a node prior handling of the context menu.
	pcc == Page Context Clicked
	@private
*/
CCognosViewer.prototype.pcc = function(evt)
{
	// we only want to preselect the node if the right mouse button was clicked.
	if (evt && typeof evt.button != "undefined" && evt.button != "1")
	{
		this.preSelectNode = true;
		var selectionController = this.getSelectionController();
		if(selectionController) {
			selectionController.pageContextClicked(evt);
		}
	}
};

/**
 * @private
 * @param {XMLHTTP response} oResponse
 */
CCognosViewer.prototype.isValidAjaxResponse = function(responseXML)
{
	return (responseXML && responseXML.childNodes && responseXML.childNodes.length > 0 && responseXML.childNodes[0].nodeName != "parsererror" ? true : false);
};

/**
 * @private
 */
CCognosViewer.prototype.resubmitInSafeMode = function(dispatcherEntry)
{
	//re-submit the request in "page" mode. We'll need to inform the user we're doing this (Post beta)
	if (this.m_bUseSafeMode) {
		this.resetViewerDispatcher();
		this.setUsePageRequest(true);
		this.envParams["cv.useAjax"] = "false";
		if (dispatcherEntry) {
			dispatcherEntry.retryRequest();
		}
	}
};

/**
 *
 */
CCognosViewer.prototype.showLoadedContent = function(oRVContent)
{
	if (oRVContent !== null && typeof oRVContent != "undefined") {
		oRVContent.style.display = "block";
	}
	this.m_resizeReady = true;
	this.doneLoading();
	
	
	var obj = this;
	setTimeout(function() { obj.renderTabs(); }, 1);
};

/**
* Called once the HTML and scripts have been loaded and processResponseState is finished.
* Will resize the widget and take care of any accessibility stuff needed (focus, JAWS, ...)
*/
CCognosViewer.prototype.doneLoading = function()
{
	var viewerIWidget = this.getViewerWidget();
	if (viewerIWidget) {
		if (window.IBM&&window.IBM.perf){window.IBM.perf.log("viewer_doneLoading", this);}
		var status = this.getStatus();
		if (!this.m_reportRenderingDone && this.m_resizeReady && this.m_stateSet) {
			var noAutoResize =  status == "working" || status == "stillWorking" || status == "fault";
			viewerIWidget.fireEvent("com.ibm.bux.widget.render.done", null, {noAutoResize:noAutoResize});
			if (status == "complete") {
				if (window.IBM&&window.IBM.perf){window.IBM.perf.log("viewer_doneLoading", this);}
				if (typeof viewerIWidget.postLoadContent == 'function') {
					viewerIWidget.postLoadContent();
				}

				this.m_reportRenderingDone = true;
				if (!noAutoResize) {
					var thisObj = this;
					//need a delay because bux widget delays the resize operation.
					setTimeout(function() { thisObj.m_readyToRespondToResizeEvent = true; }, 20);
				}
			}
		}

		if (status != "fault") {
			viewerIWidget.clearErrorDlg();
		}

		this.doneLoadingUpdateA11Y(status);
	}
	else {
		var status = this.getStatus();
		if (status == "complete") {
			this.m_reportRenderingDone = true;
			this.JAWSTalk(RV_RES.IDS_JS_READY);
		}
		else if (status == "working") {
			this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
		}

	}
};

CCognosViewer.prototype.doneLoadingUpdateA11Y = function(status) {
	// if we're refreshing the report because of a modify report request, set the focus
	// to the first table in the report
	if (this.getKeepFocus() !== false && this.getKeepFocus() != null) {
		var keepFocus = this.getKeepFocus();
		
		if (status == "complete") {
			this.setKeepFocus(false);
		}

		var focusOn = null;
		if (this.getVisibleDialog() !== null) {
			focusOn = this.getVisibleDialog().getDialogDiv();
		} else if (keepFocus === true) {
			focusOn = document.getElementById("CVReport" + this.getId());
		} else if (typeof keepFocus == "string") {
			focusOn = document.getElementById(keepFocus);
		} else if (keepFocus !== null) {
			focusOn = keepFocus;
			if (this.isBux) {
				dojo.window.scrollIntoView(focusOn);
			}
		}
		
		if (focusOn) {
			setFocusToFirstTabItem(focusOn);
		}

		if (status == "complete") {
			this.JAWSTalk(RV_RES.IDS_JS_READY);
		} else if (status == "working" || status == "stillWorking") {
			this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
		}
	}
};

/**
 * Creates a div with a role of alert so that JAWS speaks the content of the div
 * @param {Object} sString
 */
CCognosViewer.prototype.JAWSTalk = function(sString) {
	// This doesn't work with voice over
	if (this.isMobile() || this.isIWidgetMobile()) {
		return;
	}
	
	var id = this.getId();
	var div = document.getElementById("JAWS_Alert_" + id);
	if (div) {
		div.parentNode.removeChild(div);
	}

	div = document.createElement("div");
	div.id = "JAWS_Alert_" + id;
	div.style.position = "absolute";
	div.style.top = "-9000px";
	div.style.display = "none";
	div.setAttribute("role", "alert");
	div.appendChild(document.createTextNode(sString));

	var content = document.getElementById("RVContent" + id);
	if (content) {
		content.appendChild(div);
	} else if (typeof console != "undefined" && console && console.log) {
		console.log("CCognosViewer: Could not find the Viewer div to append the JAWS alert.");
	}
};


/**
 * insert icons if
 *	a. server is set to true, and widget is set to true
 *	b. server is set to true, and widget is undefined.
 *	c. server is set to false, and widget is set to true
 */
CCognosViewer.prototype.canInsertExpandIconsForAllCrosstabs = function()
{
	if( this.isLimitedInteractiveMode() || this.isBlacklisted("ExpandMember") || this.isIWidgetMobile() ) {
		return false;
	}

	var bServerSetting = this.getAdvancedServerProperty("VIEWER_JS_EXPAND_COLLAPSE_CONTROLS_DEFAULT");
	if( bServerSetting === null ){
		return false;
	}

	var bWidgetSetting = this.getViewerWidget().getProperties().getShowExpandCollapseIconFlag();
	return	( bServerSetting.toLowerCase() === 'on' && bWidgetSetting !== false )
		||  ( bServerSetting.toLowerCase() === 'off' && bWidgetSetting === true );
};

/**
 * Needed for IE10 to make sure we don't have any extra scrollbars
 */
CCognosViewer.prototype.setMaxContentSize = function() {
	if ("10" != window.getIEVersion()) {
		return;
	}
	
	if (document.body.className === "viewer") {
		var height = document.body.offsetHeight;
		var nonReportHeight = this.getNonReportHeight(document.getElementById("CVReport" + this.getId()));
				
		var viewerTable = document.getElementById("mainViewerTable" + this.getId());
		viewerTable.style.maxHeight = height - nonReportHeight - 2 + "px";
		var callback = GUtil.generateCallback(this.setMaxContentSize,[true], this);
		if (!this.attachedOnResize) {
			this.attachedOnResize = true;
			if (window.attachEvent)	{
				window.attachEvent("onresize", callback);
			}
			else if (window.addEventListener) {
				window.addEventListener("resize", callback, false);
			}		
		}
	}
};

CCognosViewer.prototype.getNonReportHeight = function(node) {
	var restOfPageHeight = 0;
	var parentNode = node.parentNode;
	if (!parentNode) {
		return restOfPageHeight;
	}
	
	if (parentNode.childNodes.length > 1) {
		for (var i=0; i < parentNode.childNodes.length; i++) {
			var childNode = parentNode.childNodes[i];
			if (childNode != node && !isNaN(childNode.clientHeight) && childNode.style.display != "none") {
				restOfPageHeight += childNode.clientHeight;
			}
		}
	}
	
	// Keep going until we reach the main Viewer table
	if (node.getAttribute("id") != ("mainViewerTable" + this.m_viewerId)) {
		restOfPageHeight += this.getNonReportHeight(parentNode);
	}
	
	return restOfPageHeight;		
};

CCognosViewer.prototype.addPageAdornments = function()
{
	this.m_layoutElements = null;
	this.m_lidToElement = null;
	this.initFlashCharts();
	this.insertSortIconsForAllLists();
	var widgetProperties = this.getViewerWidget().getProperties();
	if(this.canInsertExpandIconsForAllCrosstabs() ) {
		this.insertExpandIconsForAllCrosstabs();
	}

	var oReportDiv = document.getElementById("CVReport" + this.getId());
	if (oReportDiv) {
		var oCV = this;
		
		// We need to pin the containers in a setTimeout to get around a timing issue in IE where
		// the UI wasn't rendered and we were trying to freeze. We also have the addInfoBar in the setTimeout
		// since it needs to be done AFTER the pin is applied
		setTimeout(function() {
			if (oCV.getPinFreezeManager() && oCV.getPinFreezeManager().hasFrozenContainers()) {
				oCV.getPinFreezeManager().renderReportWithFrozenContainers(oReportDiv);
			}
			oCV.addInfoBar();
		}, 1);
	}
	
	this.getViewerWidget().reselectSelectionFilterObjects();
	this.getViewerWidget().addChromeWhitespaceHandler(this.getId());
};

CCognosViewer.prototype.addFlashChart = function(refId)
{
	this.m_flashChartsObjectIds.push(refId);
};

CCognosViewer.prototype.flashChartError = function(parameters) {
	// turn off animations, and refresh the report
	var cvWidget = this.getViewerWidget();
	var properties = cvWidget.getProperties();
	properties.setProperty("flashCharts", false);

	var redrawAction = this.getAction("Redraw");
	redrawAction.isUndoable = function() { return false; };
	redrawAction.execute();
};

CCognosViewer.prototype.initFlashCharts = function()
{
	var viewerIWidget = this.getViewerWidget();
	if(this.m_flashChartsObjectIds.length > 0)
	{
		var reportTable = document.getElementById("rt" + this.getId());

		if (window.addEventListener) {
			reportTable.addEventListener("mousedown", onFlashChartRightClick, true);
		}
		else {
			var objectIds = {};
			var onmouseup = function() {
					this.releaseCapture();
			};
			var onmousedown = function() {
					onFlashChartRightClick(event);
					this.setCapture();
			};
			for (var i = 0; i < this.m_flashChartsObjectIds.length; ++i) {
				var objectId = this.m_flashChartsObjectIds[i];
				var flashObject = document.getElementById(objectId);
				objectIds[objectId] = 1;
				flashObject.parentNode.onmouseup = onmouseup;
				flashObject.parentNode.onmousedown = onmousedown;
			}
			if (this.m_flashChartsObjectIds.length > 0) {
				reportTable.attachEvent("oncontextmenu", function(){
					if (objectIds[window.event.srcElement.id]) {
						return false;
					}
				});
			}
		}
		if (viewerIWidget) {
			viewerIWidget.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive", null, true);
		}
	} else {
		if (viewerIWidget) {
			viewerIWidget.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive", null, false);
		}
	}
};

CCognosViewer.prototype.initializeLayoutElements = function() {
	var reportTable = document.getElementById("rt" + this.getId());
	var layoutElements = getElementsByAttribute(reportTable, "*", "lid");
	this.m_lidToElement = {};
	this.m_layoutElements=[];
	var elementIdx = 0;
	var pfManager = this.getPinFreezeManager();
	for(var i = 0; i < layoutElements.length; i++) {
		var e = layoutElements[i];
		if (!pfManager || !pfManager.getContainerElement(e) || pfManager.isElementInMainOutput(e)) {
			this.m_layoutElements[elementIdx]=e;
			this.m_lidToElement[e.getAttribute("lid")] = e;
			elementIdx++;
		}
	}
};

CCognosViewer.prototype.getLayoutElement = function(iLayoutIndex) {
	if (!this.m_layoutElements) {
		this.initializeLayoutElements();
	}

	if (this.m_layoutElements) {
		return this.m_layoutElements[iLayoutIndex];
	}

	return null;
};

CCognosViewer.prototype.getLayoutElementFromLid = function(lid) {
	if(!this.m_lidToElement) {
		this.initializeLayoutElements();
	}
	return this.m_lidToElement[lid];
};

CCognosViewer.prototype.getInfoBars = function() {
	return this.m_aInfoBar ? this.m_aInfoBar : null;
};

CCognosViewer.prototype.addInfoBar = function()
{
	if (this.getAdvancedServerProperty("VIEWER_JS_HIDE_INFO_BAR") === "true") {
		return;
	}

	var oRAPReportInfo = this.getRAPReportInfo();
	if(oRAPReportInfo)
	{
		var reportTable = document.getElementById("rt" + this.getId());

		this.initializeLayoutElements();

		var aInfoBarIDs = [];
		this.m_aInfoBar = [];

		for(var layoutElementIdx = 0; layoutElementIdx < this.m_layoutElements.length; ++layoutElementIdx)
		{
			var layoutElement = this.m_layoutElements[layoutElementIdx];
			var lid = layoutElement.getAttribute("lid");


			if (lid) {
				//the layout element with its lid attribute having RAP_ prefix is added by RAP for no data handler.
				if (lid.indexOf("RAP_NDH_") > -1) {
					lid = lid.substring(8);
				}

				// need to strip off the Viewer's id
				lid = lid.substring(0, lid.indexOf(this.getId()));
			}

			var container = oRAPReportInfo.getContainer(lid);
			if (container && typeof container.parentContainer == "undefined") {
				var childContainers = this.collectChildContainers(container.container);
				if (this.getPinFreezeManager()) {
					oPinFreezeContainerElement=this.getPinFreezeManager().getContainerElement(layoutElement);
					layoutElement=(oPinFreezeContainerElement) ? oPinFreezeContainerElement : layoutElement;
				}
				var infoBar = new InfoBar(this, layoutElement, container, childContainers, layoutElementIdx);
				infoBar.setTimingDetails(oRAPReportInfo._getEventTimings());
				infoBar.render();
				if (infoBar.hasSomethingRendered() ) {
					aInfoBarIDs.push(infoBar.getId());
				}
				this.m_aInfoBar.push(infoBar);
			}
		}

		var oWidget = this.getViewerWidget();
		if (oWidget) {
			oWidget.refreshInfoBarRenderedState(aInfoBarIDs);
		}
	}
};

CCognosViewer.prototype.collectChildContainers = function(parentContainerId)
{
	var childContainers = [];
	var oRAPReportInfo = this.getRAPReportInfo();

	if (oRAPReportInfo) {
		var containerCount = oRAPReportInfo.getContainerCount();

		for (var cidx = 0; cidx < containerCount; ++cidx) {
			var container = oRAPReportInfo.getContainerFromPos(cidx);
			if (typeof container.parentContainer != "undefined" && container.parentContainer == parentContainerId) {
				childContainers.push(container);
			}
		}
	}
	return childContainers;
};

CCognosViewer.prototype.addReportInfo = function()
{

	var widget = this.getViewerWidget();
	if( typeof widget === "undefined" || widget === null) {
		return;
	}

	// If there's no original report then don't show the reset info. This happens on a publish
	// Also, if we're in mobile don't show the reset
	if (!widget.getAttributeValue("originalReport") || this.isIWidgetMobile()) {
		return;
	}


	var baseReportModificationTime = this.envParams["baseReportModificationTime"];
	var savedBaseReportModificationTime = widget.getAttributeValue( "baseReportModificationTime" );
	if( typeof baseReportModificationTime !== "undefined" &&
		typeof savedBaseReportModificationTime !== "undefined" &&
		savedBaseReportModificationTime &&
		savedBaseReportModificationTime != '<empty>' &&
		baseReportModificationTime !== savedBaseReportModificationTime )
	{

		var cvid = this.getId();
		var rvContent = document.getElementById("CVReport" + cvid);
		var rvContentParent = rvContent.parentNode;

		var id = "ReportInfo" + cvid;
		var divElement = document.createElement("div");
		divElement.setAttribute("id", id + "_container");
		divElement.setAttribute("cvid", cvid);
		divElement.className = "new-info-indicator BUXNoPrint";


		//Create icon
		var imgElement = document.createElement( "img");

		var img = null;
		if(this.getDirection() === "rtl") {
			img = "/rv/images/action_show_info_rtl.png";
		} else {
			img = "/rv/images/action_show_info.png";
		}
		imgElement.src = this.getWebContentRoot() + img ;

		imgElement.className = 'reportInfoIcon';
		imgElement.setAttribute("tabIndex", "0");
		imgElement.setAttribute("alt", "");
		imgElement.setAttribute("title", "");
		imgElement.setAttribute("role", "presentation");

		var reportInfoTitle = RV_RES.IDS_JS_REPORT_INFO_TITLE;
		var reportInfoText = RV_RES.IDS_JS_REPORT_INFO_TEXT;
		var reportInfoLinkText = RV_RES.IDS_JS_REPORT_INFO_LINK_TEXT;

		divElement.appendChild( imgElement );
		rvContentParent.insertBefore( divElement, rvContent );

		this.m_reportInfoTooltip = new bux.reportViewer.ReportInfo({
				connectId: [id + "_container"],
				focusElement: imgElement,
				position: ["above","below"],
				title: reportInfoTitle,
				text: reportInfoText,
				linkText: reportInfoLinkText,
				linkScript: getCognosViewerObjectRefAsString(cvid) + ".reportInfoResetReport();",
				allowMouseOverToolTip: true
		});
	}
};

/*
 * This method is invoked by the markup produced by addReportInfo
 */
CCognosViewer.prototype.reportInfoResetReport = function()
{
	this.executeAction( "ResetToOriginal" );
};

/*
 * This method hides ReportInfo (if it exist) when 'Reset to Original' option is invoked
 * Currently, only invoked by ResetToOriginalAction
 */
CCognosViewer.prototype.hideReportInfo = function()
{
	var reportInfoContainerDiv = document.getElementById( "ReportInfo" + this.getId() + "_container" );
	if( typeof reportInfoContainerDiv !== "undefined" && reportInfoContainerDiv !== null )
	{
		reportInfoContainerDiv.style.visibility =  "hidden";
	}
};

/**
 * Currently only called when adding sort icons to the CC Viewer
 */
CCognosViewer.prototype.insertSortIcons = function()
{
	var limitedInteractiveMode = this.envParams ? this.envParams.limitedInteractiveMode : true;

	if (typeof limitedInteractiveMode === "undefined" || limitedInteractiveMode === true) {
		return;
	}

	// For now we only want to show the sort icons for a run. This means that it will not show up
	// in studios or when run from a studio
	if (this.envParams["ui.action"] === "run" || this.envParams["ui.primaryAction"] === "run") {
		this.insertSortIconsForAllLists();
	}
};

CCognosViewer.prototype._getContainers = function(sContainerType) {
	var aNodes = [];

	var sLayoutType = "", sClassName = "";

	if(sContainerType === "list") {
		sLayoutType = "list";
		sClassName = "ls";
	} else if(sContainerType === "crosstab") {
		sLayoutType = "crosstab";
		sClassName = "xt";
	}

	var nReportDiv = document.getElementById("CVReport" + this.getId());

	// If we have reportInfo then use it to find all the containers, it's a lot more
	// reliable then using the css class on the table which can be changed in report studio
	if (this.getRAPReportInfo()) {
		var aContainerIds = this.getRAPReportInfo().getContainerIds(sLayoutType);
		for(var i = 0; i < aContainerIds.length; ++i) {
			var aContainerTables = getElementsByAttribute(nReportDiv, "table", "lid", aContainerIds[i] + this.getId(), 1);
			if (aContainerTables && aContainerTables.length > 0) {
				aNodes.push(aContainerTables[0]);
			}
		}
	} else {
		aNodes = getElementsByClassName(nReportDiv, "table", sClassName);
	}

	return aNodes;
};


CCognosViewer.prototype.insertSortIconsForAllLists = function()
{

	var aListTableElements = this._getContainers("list");

	for (var i = 0; i < aListTableElements.length; ++i) {
		this.insertSortIconsToList(aListTableElements[i]);
	}
};

CCognosViewer.prototype.insertSortIconsToList = function(listTableElement)
{
	var columnHeaderElements = getElementsByAttribute(listTableElement, '*', "type", 'columnTitle');
	
	for (var i = 0; i < columnHeaderElements.length; ++i) {
		var columnHeader = columnHeaderElements[i];

		// we need to create a selection object for the column header so any missing context information
		// can be calculated
		this.getSelectionController().getSelectionObjectFactory().getSelectionObject(columnHeader);
		// double check to ensure we're not adding the sort icon to a crosstab node memeber or a crosstab corner
		if (columnHeader.getAttribute("canSort") != "false" && columnHeader.getAttribute("CTNM") === null && columnHeader.getAttribute("CC") === null) {
			var sortImgAlreadyInserted = false;

			for (var iChild=0; iChild < columnHeader.childNodes.length; iChild++) {
				var child = columnHeader.childNodes[iChild];
				if (child.nodeName.toLowerCase() == "img" )
				{
					// make sure we didn't already add a sort icon. Happens when we have lists inside of lists
					if( child.id && child.id.indexOf("sortimg") === 0)
					{
						sortImgAlreadyInserted = true;
						break;
					}

					//remove the sort icon from QS report
					var sLid = child.getAttribute( "lid");
					if(sLid && sLid.indexOf("SortIcon") !== -1)
					{
						columnHeader.removeChild( child );
						break;
					}
				}

			}

			if (!sortImgAlreadyInserted && this.canInsertSortIcon(columnHeader) ) {
				this.insertSortIconToColumnHeader(columnHeader);
			}
		}
	}
};

CCognosViewer.prototype.isDrillBlackListed = function() {
	if (typeof this.m_bDrillBlacklisted == "undefined") {
		this.m_bDrillBlacklisted = this.isBlacklisted("DrillDown") || this.isBlacklisted("DrillUp");
	}
	
	return this.m_bDrillBlacklisted;
};


CCognosViewer.prototype.isBlacklisted = function(item) {
	return this.UIBlacklist && this.UIBlacklist.indexOf(" " + item + " ") > 0;
};

CCognosViewer.prototype.canInsertSortIcon = function(oColumnHeaderElement) {
	var sortValue = oColumnHeaderElement.getAttribute('rp_sort');
	return ( (!this.isLimitedInteractiveMode() && !this.isBlacklisted("Sort")) || ( sortValue !== undefined && sortValue !== null && sortValue.length > 0 ) );
};

CCognosViewer.prototype.insertSortIconToColumnHeader = function(oColumnHeaderElement) {
	if (!oColumnHeaderElement.style.whiteSpace) {
		oColumnHeaderElement.style.whiteSpace='nowrap'; //note: TD nowrap= attribute is deprecated and ocassionally wraps in IE!
	}

	var imgElement = document.createElement("img");
	imgElement.setAttribute("id", 'sortimg' + Math.random());
	if( (!this.isLimitedInteractiveMode() && !this.isBlacklisted("Sort")) )
	{
		imgElement.onmouseover = function() {this.setAttribute("oldClassName", this.className); this.className += " sortIconOver";};
		imgElement.onmouseout = function() {this.className = this.getAttribute("oldClassName"); this.removeAttribute("oldClassName");};
	}
	imgElement.src = this.getImgSrc(oColumnHeaderElement );


	var sortInfo = this.getSortInfo(oColumnHeaderElement);
	var sSort = this.getSortOrder(sortInfo);
	imgElement.setAttribute( 'alt', this.getSortAltText( sSort ));
	imgElement.setAttribute( 'title', this.getSortAltText( sSort ));
	imgElement.className = this.getSortClass( sortInfo );
	imgElement.setAttribute('sortOrder', sSort);

	oColumnHeaderElement.appendChild( imgElement );
};


CCognosViewer.prototype.canInsertShowExpandCollapseIconForNode = function( oItemInfo, contextId )
{
	var selectionController = this.getSelectionController();
	var bHasCalculationMetadata = selectionController.hasCalculationMetadata( contextId, [contextId], "crosstab" );
	return( ( selectionController.canDrillDown( contextId ) || oItemInfo.alwaysCanExpandCollapse )
			&& !selectionController.isCalculationOrMeasure( contextId, bHasCalculationMetadata ));

};

CCognosViewer.prototype.insertExpandIconsForAllCrosstabs = function() {
	var aCrosstabTableElements = this._getContainers("crosstab");
	var _this = this;

	var oRAPReportInfo = this.getRAPReportInfo();
	var oContextHelper = this.getReportContextHelper();

	for(var i = 0; i < aCrosstabTableElements.length; i++) {
		var nCrosstabTable = aCrosstabTableElements[i];
		var sContainerLID = nCrosstabTable.getAttribute("lid");
		//Remove viewer namespace from lid
		sContainerLID = sContainerLID.substring(0, sContainerLID.length - this.getId().length);
		var aHeaderNodes = getElementsByAttribute(nCrosstabTable, ["td","th"], "ctnm", "true");
		for(var j = 0; j < aHeaderNodes.length; j++) {

			var nHeaderNode = aHeaderNodes[j];
			var sCtx = this.findCtx(nHeaderNode);
			var sDataItemName = oContextHelper.getDataItemName(sCtx);

			if(sDataItemName) {
				var oItemInfo = oRAPReportInfo.getItemInfo(sContainerLID, sDataItemName);
				var aContextIds = oContextHelper.processCtx( sCtx );
				if( this.canInsertShowExpandCollapseIconForNode( oItemInfo, aContextIds[0][0] ) ) {
					var sMun = oContextHelper.getMun(sCtx);
					var bIsExpanded = sMun && oItemInfo.expandedMembers && oItemInfo.expandedMembers[sMun] === true;
					var nIcon = document.createElement("div");
					nIcon.setAttribute("skipSelection", "true");
					nIcon.className = "expandButton " + (bIsExpanded ? "collapse" : "expand");
					nHeaderNode.insertBefore(nIcon, nHeaderNode.firstChild);
					var nCaption = document.createElement("span");
					nCaption.className = "expandButtonCaption";
					nCaption.innerHTML = (bIsExpanded ? "[-]" : "[+]");
					nIcon.appendChild(nCaption);
				}
			}
		}
	}
};

CCognosViewer.prototype.removeExpandIconsForAllCrosstabs = function() {
	var aCrosstabTableElements = this._getContainers("crosstab");
	for(var i = 0; i < aCrosstabTableElements.length; i++) {
		var nCrosstabTable = aCrosstabTableElements[i];
		var sContainerLID = nCrosstabTable.getAttribute("lid");
		//Remove viewer namespace from lid
		sContainerLID = sContainerLID.substring(0, sContainerLID.length - this.getId().length);
		var aHeaderNodes = getElementsByAttribute(nCrosstabTable, "td", "ctnm", "true");
		for(var j = 0; j < aHeaderNodes.length; j++) {

			var nHeaderNode = aHeaderNodes[j];
			if(    nHeaderNode.firstChild.className === 'expandButton collapse'
				|| nHeaderNode.firstChild.className === 'expandButton expand' )
			{
				nHeaderNode.removeChild( nHeaderNode.firstChild );
			}
		}
	}
};

CCognosViewer.prototype.fillInContextData = function() {
	if (!this.isLimitedInteractiveMode()) {
		var reportDiv = document.getElementById("CVReport" + this.getId());
		var listTableElements = getElementsByClassName(reportDiv, "table", 'ls');
		for (var i = 0; i < listTableElements.length; ++i) {
			var columnHeaderElements = getElementsByAttribute(listTableElements[i], '*', "type", 'columnTitle');
			for (var j = 0; j < columnHeaderElements.length; ++j) {
				this.getSelectionController().getSelectionObjectFactory().getSelectionObject(columnHeaderElements[j]);
			}
		}
	}
};

CCognosViewer.prototype.getSortAltText = function (sSort)
{
	if( sSort === "ascending" )
	{
		return RV_RES.IDS_JS_SORT_ASCENDING;
	}
	else if( sSort === "descending")
	{
		return RV_RES.IDS_JS_SORT_DESCENDING;
	} else if (sSort === "nosort")
	{
		return RV_RES.IDS_JS_NOT_SORTED;
	}
};

CCognosViewer.prototype.getSortInfo = function (oColumnHeaderElement)
{
	var sortInfo = oColumnHeaderElement.getAttribute('rp_sort');
	if (sortInfo)
	{
		sortInfo = sortInfo.split('.');
	}

	return sortInfo;
};


CCognosViewer.prototype.getSortClass = function( sortInfo )
{
	var classname = 'sortIconHidden';
	if (sortInfo)
	{
		if( sortInfo[0] === 'd'|| sortInfo[0] === 'a')
		{
			classname = 'sortIconVisible';
		}
	}
	return classname;
};

CCognosViewer.prototype.getSortOrder = function( sortInfo )
{
	var sortOrder = 'nosort';
	if( sortInfo )
	{
		if( sortInfo[0] === 'd')
		{
			sortOrder = 'descending';
		}
		else if( sortInfo[0] === 'a')
		{
			sortOrder = 'ascending';
		}
	}
	return sortOrder;
};


CCognosViewer.prototype.getImgSrc = function( oColumnHeaderElement )
{
	var sortOrder = oColumnHeaderElement.getAttribute('rp_sort');
	var src = this.getWebContentRoot() + "/rv/images/" + this.getSortIconName( sortOrder );
	return src;
};

CCognosViewer.prototype.getSortIconName = function( sortOrder )
{
	var iconName = 'sort_no.gif';
	if (sortOrder) {
		sortOrder = sortOrder.split('.');
		if( sortOrder[0] === 'd')
		{
			iconName = 'sort_descending.gif';
		}
		else if( sortOrder[0] === 'a')
		{
			iconName = 'sort_ascending.gif';
		}
	}
	return iconName;
};

CCognosViewer.prototype.shouldWriteNavLinks = function() {
	if (this.envParams["cv.navlinks"] == "false") {
		return false;
	}
	else if (!this.getUIConfig() || this.getUIConfig().getShowPageNavigation()) {
		if (this.rvMainWnd || (this.isBux && !this.isActiveReport()) ) {
			return true;
		}
	}

	return false;
};

CCognosViewer.prototype.isActiveReport = function() {
	if (this.envParams["cv.responseFormat"] === "activeReport" ) {
		return true;
	}

	return false;
};

CCognosViewer.prototype.resetRaiseSharePromptEventFlag = function()
{
	this.m_raiseSharePromptEvent = true;
};

CCognosViewer.prototype.resetbHasPromptFlag = function()
{
	this.m_bHasPrompt = null;
};

CCognosViewer.prototype.disableRaiseSharePromptEvent = function()
{
	this.m_raiseSharePromptEvent = false;
};

CCognosViewer.prototype.widgetHasPromptParameters = function()
{
	var cvWidget = this.getViewerWidget();
	return (cvWidget && cvWidget.promptParametersRetrieved == true && this.envParams && typeof this.envParams["reportPrompts"] != "undefined" && this.envParams["reportPrompts"] != null && this.envParams["reportPrompts"].length > 0);
};
// ***
/**
 *  Returns the pompt parameters info
 * @return { transientSpec: TransientSpec,value:parameter values}
*/
CCognosViewer.prototype.getPromptParametersInfo = function()
{
	var result = null;
	if (this.widgetHasPromptParameters()) {
		result = "<widget><parameterValues>" + sXmlEncode(this.getExecutionParameters()) + "</parameterValues>" + this.envParams["reportPrompts"] + "</widget>" ;
	}
	return result;
};

CCognosViewer.prototype.raisePromptEvent = function(sharedPrompts, formFields,clearCascadePromptParams)
{
	try
	{
		var cvWidget = this.getViewerWidget();
		cvWidget.getWidgetContextManager().raisePromptEvent(sharedPrompts, formFields, formFields.get("ui.action"), this.getModelPath(),clearCascadePromptParams);

	} catch ( e )
	{
	}
};

/**
 * Returns the model path using the selection if available or
 * the 'main' model path if no cells are selected.
 */
CCognosViewer.prototype.getModelPath = function() {
	var modelPath = this.getSelectionController().getModelPathForCurrentSelection();
	if (modelPath) {
		return modelPath;
	}
	else if (this.envParams.modelPath) {
		return this.envParams.modelPath;
	}
	else if(typeof document.forms["formWarpRequest" + this.getId()].modelPath !== "undefined") {
		return document.forms["formWarpRequest" + this.getId()].modelPath.value;
	}
	
	return "";
};

CCognosViewer.prototype.setKeepFocus = function(value) {
	this._keepFocus = value;
};

CCognosViewer.prototype.getKeepFocus = function() {
	if (typeof this._keepFocus != "undefined") {
		return this._keepFocus;
	}

	return false;
};


CCognosViewer.prototype.onFocus = function(evt) {
	var a11yHelper = this.getA11YHelper();
	if (a11yHelper) {
		a11yHelper.onFocus(evt);
	}
};

CCognosViewer.prototype.getA11YHelper = function() {
	if (!this.a11yHelper) {
		this.loadExtra();
		if (typeof ViewerA11YHelper == "function") {
			this.a11yHelper = new ViewerA11YHelper(this);
		}
		else {
			if (typeof console !== "undefined" && console.log) {
				console.log("CCognosViewer: Could not create ViewerA11YHelper object.");
			}
			return null;
		}
	}

	return this.a11yHelper;
};

CCognosViewer.prototype.onKeyDown = function(evt) {
	if (this.getA11YHelper()) {
		this.getA11YHelper().onKeyDown(evt);
	}
};

/**
 * Function that will hide/show the jump to report link
 */
CCognosViewer.prototype.updateSkipToReportLink = function()
{
	var status = this.getStatus();
	var oSkipToReport = document.getElementById("cvSkipToReport" + this.getId());
	if (oSkipToReport) {
		oSkipToReport.style.display = status == "prompting" ? "none" :  "";
	}
};

/**
 * Function that will hide/show the jump to navigation link
 */
CCognosViewer.prototype.updateSkipToNavigationLink = function(bHide)
{
	var oSkipToNavigation = document.getElementById("cvSkipToNavigation" + this.getId());
	if (oSkipToNavigation)
	{
		oSkipToNavigation.style.display = bHide ? "none" :  "";
	}
};


CCognosViewer.prototype.pageAction = function(pageAction) {
	this.setKeepFocus("CVNavLinks" + this.getId());

	var request = new ViewerDispatcherEntry(this);
	request.addFormField("ui.action", pageAction);
	if (this.getCurrentlySelectedTab()) {
		request.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup", this.getCurrentlySelectedTab());	
	}
	this.dispatchRequest(request);
};

/**
	Helper function to generate one link for the page navigation.
	@private
	@param {object} oLink A object that contains the link info. oLink.text is the string to show to the user. oLink.sImg is the name of the icon to show for the normal (active) state. oLink.sImgDisabled is the name of the icon for the disabled state.
	@param {string} sRequest The request to send when the link is clicked. Possible values are <code>firstPage</code>, <code>nextPage</code>, <code>previousPage</code> and <code>lastPage</code>.
	@param {string} bActive True if the link should be active (normal state). False to disabled the link.
	@type string
	@return The HTML string that makes up the navigation links.
*/
CCognosViewer.prototype.writeNavLink = function(oLink, sRequest, bActive, bSavedOutput)
{
	var sPattern = "";
	if (bActive)
	{
		sPattern =
			'<td nowrap="nowrap">' +
				'<img src="LINK_IMG" width="15" height="15" alt="" style="vertical-align:middle;">' +
			'</td>' +
			'<td nowrap="nowrap">';

		if (bSavedOutput)
		{
			sPattern += '<a href="#" tabindex="0" onclick="' + getCognosViewerObjectRefAsString(this.getId()) + '.getViewerWidget().getSavedOutput().pageAction(\'LINK_REQUEST\');return false;"';
		}
		else
		{
			sPattern += '<a href="#" tabindex="0" onclick="' + getCognosViewerObjectRefAsString(this.getId()) + '.pageAction(\'LINK_REQUEST\');return false;"';
		}
		sPattern +=	'>LINK_TEXT</a>&#160;' +
		'</td>';
	}
	else
	{
		sPattern =
			'<td nowrap="nowrap">' +
				'<img src="LINK_IMG" width="15" height="15" alt="" style="vertical-align:middle;">' +
			'</td>' +
			'<td nowrap="nowrap">LINK_TEXT&#160;</td>';
	}

	var sImg = this.sSkin + (!bActive && oLink.sImgDisabled ? oLink.sImgDisabled : oLink.sImg);
	return sPattern.replace(/LINK_REQUEST/g, sRequest).replace(/LINK_TEXT/g, oLink.sText).replace(/LINK_IMG/g, sImg);
};

/**
	Loads up the necessary info for the navigation links (localized strings, icon names, skin to use).
	@private
*/
CCognosViewer.prototype.loadNavLinks = function()
{
	// load navlinks string and image path dynamically, synchronously.
	var sText = window.gScriptLoader.loadFile(this.getGateway(), "b_action=xts.run&m=portal/report-viewer-navlinks.xts");
	if (sText)
	{
		this.init(eval("(" + sText + ")"));
	}
};

/**
	Build the HTML code for the navigation links and update them in the UI.
	@param {string} sSR space separated secondary requests
	@private
*/
CCognosViewer.prototype.writeNavLinks = function(sSR, bSavedOutput)
{
	var oNavLinksDiv = document.getElementById("CVNavLinks" + this.getId());
	if (oNavLinksDiv)
	{
		var nNavLinksDivContainer = document.getElementById("CVNavLinks_Container" + this.getId());

		if (typeof this.oNavLinks != "object" || typeof sSR != "string" || !sSR.match(/\bfirstPage\b|\bpreviousPage\b|\bnextPage\b|\blastPage\b|\bplayback\b/i))
		{
			oNavLinksDiv.style.display = "none";
			if (nNavLinksDivContainer) {
				nNavLinksDivContainer.style.display = "none";
			}
			this.updateSkipToNavigationLink(true);
			return;
		}

		this.updateSkipToNavigationLink(false);

		if (nNavLinksDivContainer) {
			nNavLinksDivContainer.style.display = "";
		}

		oNavLinksDiv.style.display = (isIE() ? "block" : "table-cell");

		var sHTML = "";
		sHTML += '<table border="0" cellpadding="0" cellspacing="0" class="pageControls BUXNoPrint" role="presentation"><tbody><tr>';

		sHTML += this.writeNavLink(this.oNavLinks.oFirst, 'firstPage', sSR.match(/\bfirstPage\b/gi), bSavedOutput);
		sHTML += this.writeNavLink(this.oNavLinks.oPrevious, 'previousPage', sSR.match(/\bpreviousPage\b/gi), bSavedOutput);
		sHTML += this.writeNavLink(this.oNavLinks.oNext, 'nextPage', sSR.match(/\bnextPage\b/gi), bSavedOutput);
		sHTML += this.writeNavLink(this.oNavLinks.oLast, 'lastPage', sSR.match(/\blastPage\b/gi), bSavedOutput);

		sHTML += '</tr></tbody></table>';

		// if there was a hidden span for JAWS, keep it around.
		var oNavLinksLabel = document.getElementById("CVNavLinks_label" + this.getId());
		var navLinkLabel = "";
		if (oNavLinksLabel) {
			navLinkLabel += "<span id=\"CVNavLinks_label" + this.getId() + "\" style=\"visibilty:hidden; display:none;\">" + oNavLinksLabel.innerHTML + "</span>";
		}

		oNavLinksDiv.innerHTML = navLinkLabel + sHTML;
	}
	else if (this.shouldWriteNavLinks())
	{
		setTimeout(getCognosViewerObjectRefAsString(this.getId()) + '.writeNavLinks("' + sSR + '","' + bSavedOutput + '");', 100);
	}
};

/**
 *   Ignores mouse clicks in the background layer when request is running
 */
function CVBackgroundLayer_ignoreMouseClick( e )
{
	if (e.returnValue) { e.returnValue = false; }
	else if (e.preventDefault) { e.preventDefault(); }
	else { return false; }
}

/**
 * Creates a transparent background to be displayed when request is running so that mouse clicks can be ignored
 */
CCognosViewer.prototype.createTransparentBackgroundLayer = function()
{
	this.removeTransparentBackgroundLayer();

	var oBL = document.createElement( "div" );
	oBL.id = CV_BACKGROUND_LAYER_ID;
	oBL.style.display = "none";
	oBL.style.position = "absolute";
	oBL.setAttribute("role", "region");
	oBL.setAttribute("aria-label", RV_RES.IDS_JS_A11Y_BACKGROUND_TINT);

	oBL.style.top = "0px";
	oBL.style.left = "0px";
	oBL.style.zIndex = 98;

	oBL.style.width = "100%";
	oBL.style.height = "100%";

	oBL.style.backgroundColor = 'rgb(238, 238, 238)'; //arbitrary colour
	oBL.style.opacity = '0';
	oBL.style.filter = 'alpha(opacity:0)';

	oBL.innerHTML = '<table tabindex="1" width="100%" height="100%"><tr><td role="presentation" onclick="CVBackgroundLayer_ignoreMouseClick(event)"></td></tr></table>';
	oBL.style.display = 'inline';

	document.body.appendChild( oBL );
};

/**
 * Removes the transparent background layer
 */
CCognosViewer.prototype.removeTransparentBackgroundLayer = function()
{
	var oBL = document.getElementById( CV_BACKGROUND_LAYER_ID );
	if( oBL )
	{
		oBL.parentNode.removeChild( oBL );
	}
};

/**
 * Closes active http connections. Note this method will not issue a cancel. If you need to cancel an RSVP request, use the cancel method
 * @return (boolean)
 */
CCognosViewer.prototype.closeActiveHTTPConnection = function()
{
	var dispatcherEntry = this.getActiveRequest();
	if (dispatcherEntry) {
		dispatcherEntry.abortHttpRequest();
	}
};

/**
 * Returns true if the viewer is in asynch mode, and the request is cancellable
 * @return (boolean)
 */
 CCognosViewer.prototype.canCancel = function()
 {
	var sTracking = this.getTracking();
	var sStatus = this.getStatus();

	return sTracking != "" && sStatus != "complete";
 };

/**
 * Cancels the current request, and restores the viewer back to the previous state.
 */
CCognosViewer.prototype.cancel = function(cancelLink)
{
	if (this.getWorkingDialog() && this.getWorkingDialog().disableCancelButton) {
		// Disable the button so the user knows we've done a cancel and won't hit it multiple times
		this.getWorkingDialog().disableCancelButton(cancelLink);
	}
	
	this.removeTransparentBackgroundLayer();
	this.clearPrompts();

	if (this.m_viewerFragment && this.envParams["fragment.fireEventWhenComplete"]) {
		this.envParams["fragment.fireEventWhenComplete"] = "";
	}

	var cognosViewerUndo = null;
	if(this.m_undoStack.length > 0) {
		cognosViewerUndo = this.m_undoStack.pop();
	}

	var dispatcherEntry = this.getActiveRequest();
	if(this.canCancel() === true || dispatcherEntry) {
		if (dispatcherEntry) {
			dispatcherEntry.cancelRequest(true);
		}
		else {
			// if we don't have an active request the cancel
			// came from a prompt page, the working dialog when ajax is off or fragments
			var request = null;
			var refreshPage = cognosViewerUndo != null && cognosViewerUndo.m_bRefreshPage;

			if (typeof this.getCancelDispatcherEntry == "function") {
				request = this.getCancelDispatcherEntry();
			}
			// for fragments, when we cancel we want to replace the report
			// with the run button. Also when we're cancelling from a prompt page
			// and we have an earlier 'complete' conversation
			else if (refreshPage || this.m_viewerFragment) {
				request = new ViewerDispatcherEntry(this);
			}
			else {
				if (this.getId() == 'RS') {
				    request = new ViewerDispatcherEntry(this);
				    request.addFormField("cv.responseFormat", "rs");
				}
				else {
				    request = new DispatcherEntry(this);
				    request.addFormField("cv.responseFormat", "successfulRequest");
				}
			}
			request.forceSynchronous();
			request.addFormField("ui.action", "cancel");
			request.addFormField("m_tracking", this.getTracking());
			
			// Blank out the tracking so that if the cancel function gets called again we won't send multiple cancel requests.
			// This can happen if we're leaving the Viewer after the cancel
			this.setTracking("");

			// If we have an old conversation, send the 'cv.previousSession'
			// form field which will cause the server to do a currentPage after the
			// cancel so the user will see the report he had before the reprompt
			if (refreshPage) {
				var undoSpec = "<CognosViewerUndo><conversation>";
				undoSpec += cognosViewerUndo.m_sConversation;
				undoSpec += "</conversation></CognosViewerUndo>";
				request.addFormField("cv.previousSession", undoSpec);
			}

			this.dispatchRequest(request);

			if (!this.isBux && !this.m_viewerFragment && (this.getUsePageRequest() || !this.isReportRenderingDone())) {
				this.executeCallback("cancel");
			}
		}


		this.setStatus("complete");

		var action = this.envParams["ui.action"];
		var oriPageRequest = this.getUsePageRequest();
		var oriStackSize = this.m_undoStack.length;

		if(cognosViewerUndo != null) {
			this.m_sConversation = cognosViewerUndo.m_sConversation;
			this.m_sParameters = cognosViewerUndo.m_sParameters;
			this.envParams = {};
			applyJSONProperties(this.envParams, cognosViewerUndo.m_envParams);

			this.m_undoStack.push(cognosViewerUndo);
		}

		this.setTracking("");

		if (this.previouslySelectedTab) {
			this.cancelTabSwitch();
		}
		else if (action != "view" && oriStackSize <= 0 && this.rvMainWnd) {
			// If the stack size was 0, then the user hit cancel from the wait dialog or from the initial prompt page. Try and go
			// back to the previous report if there was one.
			this.rvMainWnd.executePreviousReport(-1);
		}
		

		return true;
	}
	else if (this.rvMainWnd && typeof this.envParams != "undefined" && (this.envParams["ui.primaryAction"] == "authoredDrillThrough" || this.envParams["ui.primaryAction"] == "authoredDrillThrough2"))	{
		this.rvMainWnd.executePreviousReport(-1);
		return true;
	}
	else {
		if (!this.isBux) {
			executeBackURL(this.getId());
		}
		return true;
	}

	return false;
};

CCognosViewer.prototype.clearPrompts = function()
{
	if (this.preProcessControlArray)
	{
		var kCount = this.preProcessControlArray.length;
		var k = 0;
		for (k=0; k<kCount; k++)
		{
			var oPrmtCtrl = eval(this.preProcessControlArray[k]);
			if (oPrmtCtrl)
			{
				if (oPrmtCtrl.clearSubmit) {
					oPrmtCtrl.clearSubmit();
				}
			}
		}
	}
};

/**
 *	Sends a wait request to the report server. If the current status is not "working" or "stillWorking", the request will not be sent
 *  @return (boolean)
 */
CCognosViewer.prototype.wait = function()
{
	if(this.isWorking())
	{
		this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);

		var request = new ViewerDispatcherEntry(this);
		request.addFormField("ui.action", "wait");
		request.addFormField("ui.primaryAction", this.envParams["ui.primaryAction"]);
		request.addFormField("cv.actionState", this.envParams["cv.actionState"]);
		request.addNonEmptyStringFormField("bux", this.envParams["bux"]);
		request.addNonEmptyStringFormField("ui.preserveRapTags", this.envParams["ui.preserveRapTags"]);
		this.dispatchRequest(request);
		return true;
	}

	return false;
};

/**
	@param {string} sValue CAF encoded string.
*/
CCognosViewer.prototype.setCAFContext = function(sValue)
{
	this.m_sCAFContext = sValue;
};

/**
	@param {string} sXML XML for the context.
*/
CCognosViewer.prototype.setContextInfo = function(sXML)
{
	this.m_sContextInfoXML = sXML;
};

/**
	@param {string} sValue CAF encoded string.
*/
CCognosViewer.prototype.setConversation = function(sValue)
{
	this.m_sConversation = sValue;
};

/**
	@param {string} sValue CAF encoded string.
*/
CCognosViewer.prototype.setActionState = function(sValue)
{
	this.m_sActionState = sValue;
};

/**
 * Sets the conversation status
 * @param string (conversation status)
 */
CCognosViewer.prototype.setStatus = function(sStatus)
{
	this.m_sStatus = sStatus;
};

/**
	@param {bool} bDebug Enable/disable debugging in {@link CCognosViewer}.
	@private
*/
CCognosViewer.prototype.setDebug = function(bDebug)
{
	this.m_bDebug = bDebug;
};

/**
	@param {string} sValue CAF encoded string.
*/
CCognosViewer.prototype.setExecutionParameters = function(sValue)
{
	this.m_sParameters = sValue;
};

/**
	@param {string} sXML XML for the metadata.
*/
CCognosViewer.prototype.setMetadataInfo = function(sXML)
{
	this.m_sMetadataInfoXML = sXML;
};

/**
	@param {array} aValue
*/
CCognosViewer.prototype.setSecondaryRequests = function(aValue)
{
	if (aValue) {
		this.m_aSecRequests = aValue;
	}
	else {
		this.m_aSecRequests = [];
	}
};

/**
	@param {string} sValue CAF encoded string.
*/
CCognosViewer.prototype.setTracking = function(sValue)
{
	this.m_sTracking = sValue;
};

/**
	@param (string) sValue fault code
 */
CCognosViewer.prototype.setSoapFault = function(sValue)
{
	this.m_sSoapFault = sValue;
};

CCognosViewer.prototype.showOutputInNewWindow = function(sURL)
{
	var formWarpRequest = document.getElementById("formWarpRequest" + this.getId()); 
	var doPostBack = formWarpRequest.elements["ui.postBack"];
	var backURL = formWarpRequest.elements["ui.backURL"];

	// Only open a new window if we can do something (close, backURL) with the current window.
	if (window.opener || doPostBack || (backURL && backURL.value !== 'javascript:window.close();')) {
		window.open(sURL, "", "");
		this.updateNewBrowserWindow();
	}
	// The current window wasn't created by javascript, so simply replace the 
	// current window with the new URL
	else {
		// For accessible PDF we always show the PDF in it's own browser. If we're replacing the current browser, make sure we detach
		// our windowUnload events so that we don't release the conversation which causes the PDF to get removed from the repository service
		if (this.isAccessibleMode() && this.envParams["run.outputFormat"] == "PDF" && window.detachLeavingRV) {
			window.detachLeavingRV();
		}
		window.location = sURL;
	}
};

CCognosViewer.prototype.hideToolbar = function(bHide) {
	this.m_bHideToolbar = bHide;
};

CCognosViewer.prototype.showExcel = function(sURL)
{	
	var currentWindowClosing = true;
	var formWarpRequest = document.getElementById("formWarpRequest" + this.getId()); 
	var backURL = formWarpRequest.elements["ui.backURL"];

	if (backURL && backURL.value.indexOf('javascript:window.close()') !== 0 && backURL.value.indexOf("close.html") === -1) {
		currentWindowClosing = false;
	}

	var windowObj = window;

	// For IE and Firefox get the parent window (if available) to call
	// window.open. This is to fix
	// issues where the open/save dialog would go away
	if (window.opener && (isIE() || isFF()) && currentWindowClosing) {
		windowObj = window.opener ? window.opener : window;
	}
	// We won't be able to close the current window if it wasn't open using javascript. So if 
	// the window.opener is null and we're going to close the current window, simply replace the URL with the new one
	else if (!window.opener && currentWindowClosing) {
		// if the output format is spreadsheetML, we need to detach the window unload events before changing the window location
		var outputFormat = this.envParams["run.outputFormat"].toLowerCase();
		if ((outputFormat == "spreadsheetml" || outputFormat == "csv" || outputFormat == "singlexls" || outputFormat == "xlsxdata" || outputFormat == "xlwa")
			&& window.detachLeavingRV && window.attachLeavingRV) {
			window.detachLeavingRV();
			window.location = sURL;
			window.attachLeavingRV();
			return;
		} else {
			window.location = sURL;
			return;
		}
	}
	
	
	var popupDialog = null;
	var properties = "";
		
	try {
		if (this.envParams["cv.excelWindowOpenProperties"]) {
			properties=this.envParams["cv.excelWindowOpenProperties"];
		}
		
		popupDialog = windowObj.open(sURL, "",properties);
		
	} catch (e) {
		// permission denied to access property open for window.opener.open
		// APAR COGCQ00839573
		windowObj = window;
		popupDialog = windowObj.open(sURL, "",properties);
		
	}
	// check to see if the dialog have
	if (!popupDialog || popupDialog.closed || typeof popupDialog.closed == 'undefined') {
		// if Browser pop up blocker is enabled dialog will not open
		alert(RV_RES.RV_BROWSER_POPUP_IS_ENABLED);
		
	}

	this.updateNewBrowserWindow();
};


CCognosViewer.prototype.updateNewBrowserWindow = function()
{
	var id = this.getId();
	var doPostBack = document.forms["formWarpRequest" + id].elements["ui.postBack"];
	var backURL = document.forms["formWarpRequest" + id].elements["ui.backURL"];
	if (doPostBack && doPostBack.value)
	{
		setTimeout(getCognosViewerObjectRefAsString(id) + '.getRV().doPostBack();', 100);
	}
	else if (backURL && backURL.value)
	{
		if (backURL.value.length < 2048)
		{
			setTimeout('location.replace("' + backURL.value + '");', 100);
		}
		else
		{
			backURL = decodeURIComponent(backURL.value);
			var URLandParameters = backURL.split("?");
			var backURLForm = document.createElement("form");

			backURLForm.style.display = "none";
			backURLForm.setAttribute("target", "_self");
			backURLForm.setAttribute("method", "post");
			backURLForm.setAttribute("action", URLandParameters[0]);

			var parameterList = URLandParameters[1].split("&"); // must be ampersand symbol

			for(var nextParameter = 0; nextParameter < parameterList.length; nextParameter++)
			{
				// We cannot use "split" here using "=" because there are "=" within the parameters
				// that must be kept.
				var equalsIndexPos = parameterList[nextParameter].indexOf("=");
				var parameterName = parameterList[nextParameter].substr(0, equalsIndexPos);
				var parameterValue = parameterList[nextParameter].substr(equalsIndexPos + 1);

				var urlFormField = document.createElement("img");
				urlFormField.setAttribute("type", "hidden");
				urlFormField.setAttribute("name", decodeURIComponent(parameterName));
				urlFormField.setAttribute("value", decodeURIComponent(parameterValue));

				backURLForm.appendChild(urlFormField);
			}

			document.body.appendChild(backURLForm);
			backURLForm.submit();
		}
	}
	else
	{
		window.close();
	}
};



/**
 * ****** Legacy method for QS only. *******
 */
CCognosViewer.prototype.showWaitPage = function() {};

/**
 * ****** Legacy method for QS only. *******
 * @param {Object} oCCognosViewerRequest
 */
CCognosViewer.prototype.sendRequest = function(oCCognosViewerRequest) {
	var oDispEntry = new ViewerDispatcherEntry(this);
	oDispEntry.addFormField("ui.action", oCCognosViewerRequest.getAction());

	if (oCCognosViewerRequest.getCallback() != null) {
		oDispEntry.setCallbacks( { "complete" : {"object" : null, "method" : oCCognosViewerRequest.getCallback()}});
	}

	var aFormFields = oCCognosViewerRequest.getFormFields().keys();
	for (var idxFormField = 0; idxFormField < aFormFields.length; idxFormField++) {
		oDispEntry.addFormField(aFormFields[idxFormField], oCCognosViewerRequest.getFormFields().get(aFormFields[idxFormField]));
	}

	var aOptions = oCCognosViewerRequest.m_oOptions.keys();
	for (var idxOption = 0; idxOption < aOptions.length; idxOption++) {
		oDispEntry.addFormField(aOptions[idxOption], oCCognosViewerRequest.getOption(aOptions[idxOption]));
	}

	var aParameters = oCCognosViewerRequest.m_oParams.keys();
	for (var idxParameter = 0; idxParameter < aParameters.length; idxParameter++) {
		oDispEntry.addFormField(aParameters[idxParameter], oCCognosViewerRequest.getParameter(aParameters[idxParameter]));
	}

	this.dispatchRequest(oDispEntry);
};

/**
	Used by prompt controls to submit (forward) requests.
	@private
	@param {string} sAction <code>cancel</code>, <code>back</code>, <code>next</code> or <code>finish</code>.
	@param {string} sUrl "Back url" to use after the prompt has been cancelled.
*/
CCognosViewer.prototype.promptAction = function(sAction, sUrl)
{
	// make sure the widget retains focus once the page is loaded
	this.setKeepFocus(true);

	if ( typeof datePickerObserverNotify == "function" )
	{
		datePickerObserverNotify();
	}

	var widget = this.getViewerWidget();

	if (sAction == "cancel")
	{
		this.cancelPrompt(sUrl);
		if (widget)
		{
			if (!this.isReportRenderingDone())
			{
				var payload = { action: 'deleteWidget' };
				widget.fireEvent("com.ibm.bux.widget.action", null, payload);
			}
		}
	}
	else
	{
		var oReq = new ViewerDispatcherEntry(this);
		oReq.addFormField("ui.action", sAction == "back" ? "back" : "forward");

		if (sAction == "finish") {
			oReq.addFormField("run.prompt", false);
		}
		else if (sAction == "back" || sAction == "next") {
			oReq.addFormField("run.prompt", true);
		}
		if (sAction == "reprompt") {
			if ( typeof repromptObserverNotify == "function" )
			{
				repromptObserverNotify(this);
			}
			oReq.addFormField("_promptControl", sAction);
		}
		else {
			oReq.addFormField("_promptControl", "prompt");
		}

		if (widget) {
			widget.fireEvent("com.ibm.bux.widget.modified", null, {'modified':true});
			if (widget.isSelectionFilterEnabled) {
				widget.clearSelectionFilter();
			}
		}

		this.submitPromptValues(oReq);
	}
};

/**
	@private
	@param {string} sUrl "Back url" to use after the prompt has been cancelled.
*/
CCognosViewer.prototype.cancelPrompt = function(sUrl)
{
	this.cancel();
};

/**
	Notifies other controls when a prompt control is updated
	@private
	@param {integer} iState
	@param {object} oNotifier
*/
CCognosViewer.prototype.notify = function(iState, oNotifier)
{
	var kCount = 0, k = 0;
	var oPromptElement = null;
	if (this.rangeObserverArray && this.rangeObserverArray instanceof Array)
	{
		kCount = this.rangeObserverArray.length;
		for (k=0; k<kCount; k++)
		{
			oPromptElement = eval(this.rangeObserverArray[k]);
			if (oPromptElement && typeof oPromptElement == "object" && typeof oPromptElement.update == "function")
			{
				oPromptElement.update();
			}
		}
	}

	var bPageEnabled = true;
	if (this.preProcessControlArray && this.preProcessControlArray instanceof Array)
	{
		kCount = this.preProcessControlArray.length;
		for (k=0; k<kCount; k++)
		{
			oPromptElement = eval(this.preProcessControlArray[k]);
			if ((typeof oPromptElement.getValid == "function") && !oPromptElement.getValid())
			{
				bPageEnabled = false;
				break;
			}
		}
	}
	this.notifyPageNavEnabled(bPageEnabled);

	if (this.multipleObserverArray && this.multipleObserverArray instanceof Array)
	{
		kCount = this.multipleObserverArray.length;
		for (k=0; k<kCount; k++)
		{
			oPromptElement = eval(this.multipleObserverArray[k]);
			if (oPromptElement && typeof oPromptElement == "object" && typeof oPromptElement.checkInsertRemove == "function")
			{
				oPromptElement.checkInsertRemove();
			}
		}
	}

	for (var idxNotif = 0; idxNotif < gaNotifyTargets.length; idxNotif++)
	{
		var oTarget = gaNotifyTargets[idxNotif];
		if (typeof oTarget != "undefined" && typeof oTarget.notify == "function")
		{
			oTarget.notify(iState, oNotifier);
		}
	}
};

/**
	@private
	@param {bool} bEnabled
*/
CCognosViewer.prototype.notifyPageNavEnabled = function(bEnabled)
{
	if (this.pageNavigationObserverArray && this.pageNavigationObserverArray instanceof Array)
	{
		var kCount = this.pageNavigationObserverArray.length;

		//determine if there is a finish button on the page, if so we'll disable the next.
		var bFinishPresent = false;
		var oPromptElement = null;
		var iPromptElementType = null;
		var k = 0;
		for (k=0; k<kCount; k++)
		{
			try
			{
				oPromptElement = eval(this.pageNavigationObserverArray[k]);
				iPromptElementType = oPromptElement.getType();
				if (iPromptElementType == PROMPTBUTTON_FINISH)
				{
					bFinishPresent = true;
					break;
				}
			}
			catch(e)
			{
			}
		}

		for (k=0; k<kCount; k++)
		{
			try
			{
				oPromptElement = eval(this.pageNavigationObserverArray[k]);
				iPromptElementType = oPromptElement.getType();
				if (!bEnabled)
				{
					if ((iPromptElementType == PROMPTBUTTON_NEXT) || (iPromptElementType == PROMPTBUTTON_OK) || (iPromptElementType == PROMPTBUTTON_FINISH))
					{
						oPromptElement.setEnabled(false);
					}
				}
				else
				{
					if (iPromptElementType == PROMPTBUTTON_FINISH)
					{
						oPromptElement.setEnabled(this.bCanFinish);
					}
					else if (iPromptElementType == PROMPTBUTTON_NEXT)
					{
						oPromptElement.setEnabled(this.bNextPage || !bFinishPresent);
					}
					else if (iPromptElementType == PROMPTBUTTON_OK)
					{
						oPromptElement.setEnabled(true);
					}
				}
			}
			catch(e2)
			{
			}
		}
	}
};

/**
 * If the drilled-on HUN matches the prompt parameter values, the drill needs to be reset.
 * This function returns the drilled-on HUN that matches the prompt parameter value.
 */
CCognosViewer.prototype.getDrillResetHUNs = function(sharePromptEventPayload)
{
	var drilledOnHUNs = null;
	if (this.getRAPReportInfo()) {
		drilledOnHUNs = this.getRAPReportInfo().getDrilledOnHUNs();
	}
	if( !drilledOnHUNs ){ return null; }

	var executionParameters = this.getExecutionParameters();
	if( !executionParameters ) { return null; }

	var changedPromptParamsList = this._getListOfChangedPromptParameters(sharePromptEventPayload);

	if (!changedPromptParamsList || changedPromptParamsList.length === 0) {
		return null;
	}

	var aDrillResetHUNs = [];
	for( var i = 0; i < drilledOnHUNs.length; i++ ){
		for (var j =0; j < changedPromptParamsList.length; j++) {
			if( changedPromptParamsList[j].indexOf( drilledOnHUNs[i] ) !== -1 ) {
				aDrillResetHUNs.push( drilledOnHUNs[i] );
			}
		}
	}

	return aDrillResetHUNs;
};

CCognosViewer.prototype.getOldParameters = function(){
	var oldParmValues = new CParameterValues();
	var documentNode = XMLBuilderLoadXMLFromString(this.getExecutionParameters());
	if (documentNode.childNodes.length == 1) {
		oldParmValues.loadWithOptions(documentNode.childNodes[0], /*credentials*/false);
	}

	if( !oldParmValues || !oldParmValues.m_parameterValues || !oldParmValues.m_parameterValues.m_aValues){
		return null;
	}

	return  oldParmValues.m_parameterValues.m_aValues;
};

CCognosViewer.prototype._createDummyRequest = function() {
	var dummyReq = new ViewerDispatcherEntry( this	);
	return this.preparePromptValues(dummyReq);
};

/**
 * Prompt parameter values are of the format:
 * 	<selectChoices>
 * 		<selectBoundRange>...</selectBoundRange>
 * 		<selectUnboundedEndRange>...</selectUnboundedEndRange>
 * 		<selectOption>...</selectOption>
 * 	<selectChoices>
 * However, this function only checks and returns the changed values for <selectOption> (since this function is used to determine if drill reset is necessary)
 * 
 */
CCognosViewer.prototype._getChangedPromptParametersValues = function( oldParmValueItems, newParmValue, changedPromptParamsList ) {
	
	var documentNode = XMLBuilderLoadXMLFromString( newParmValue );
	if( !documentNode) {
		//Just in case parameter value is non-XML string - not very likely
		for( var j=0; j < oldParmValueItems.length; j++ )
		{
			var oldParmValue = oldParmValueItems[j].m_useValue;
			if( newParmValue.indexOf( sXmlEncode( oldParmValue ) ) < 0 ){
				changedPromptParamsList.push(oldParmValue);
			}
		}
		return;
	}
	
	var newParameters = documentNode.getElementsByTagName( "selectOption");
	if( !newParameters )
	{
		return;
	}

	var noOfOldParameterValues = oldParmValueItems.length;
	var noOfNewParameterValues = newParameters.length;
	
	for( var i=0; i < noOfNewParameterValues; i++ )
	{
		var  newParmValue = newParameters[i].attributes.getNamedItem("useValue").nodeValue;
		bMatchOldParam = false;
		for( var j=0; j < noOfOldParameterValues; j++ )
		{
			var oldParmValue = oldParmValueItems[j].m_useValue;
			if( newParmValue.indexOf( oldParmValue ) ===  0 ){
				bMatchOldParam = true;
				break; // no need to continue
			}
		}
		if( !bMatchOldParam )	
		{
			changedPromptParamsList.push( newParmValue )
		}

	}
};


CCognosViewer.prototype._getListOfChangedPromptParameters = function(sharePromptEventPayload)
{
	var oldParameters = this.getOldParameters();
	if( !oldParameters ) { return null; }

	var changedPromptParamsList = [];
	if( !sharePromptEventPayload ){
		
		var oRequest = this._createDummyRequest();

		for (var oldParm in oldParameters){
			var oldParmValueItems = oldParameters[oldParm].m_parmValueItems;
			var newParmValue  = oRequest.getRequest().getFormFields().get('p_' + oldParm);
            if (!newParmValue) { continue; }

			this._getChangedPromptParametersValues(oldParmValueItems, newParmValue, changedPromptParamsList);
		}
	} else {
		if( !sharePromptEventPayload.parameters ){ return null; }

		var newParameters = sharePromptEventPayload.parameters;
		for( var i = 0; i < newParameters.length; i++ ){
			var newParmName = newParameters[i].parmName;
			if( !newParmName || !oldParameters[newParmName] ){ continue; }

			var oldParmValueItems = oldParameters[newParmName].m_parmValueItems;
			if( !oldParmValueItems || oldParmValueItems.length == 0 ){ continue; }

			this._getChangedPromptParametersValues( oldParmValueItems, newParameters[i].parmValue, changedPromptParamsList );
		}
	}
	return changedPromptParamsList;
};

/**
	@private
	@param {object} oReq
*/
CCognosViewer.prototype.submitPromptValues = function(oReq)
{
	if ( this.gbPromptRequestSubmitted === true )
	{
		return false;
	}
	
	if (this.isReportRenderingDone())
	{
		// APAR 96797 & 98810 - clear old setting if rerunning a tabbed report with prompts
		this.m_currentlySelectedTab = null;
	}

	this.gbPromptRequestSubmitted = true;
	if(  this.isBux ) {
		var aDrillResetHUNs = this.getDrillResetHUNs(null/*share prompt event payload*/);
		if(aDrillResetHUNs && aDrillResetHUNs.length !== 0 ){
			var parms = { 'drilledResetHUNs' : aDrillResetHUNs };
			this.executeAction( "DrillReset", parms );
			return;
		}
	}

	oReq = this.preparePromptValues(oReq);

	if (window.portletSharePrompt) {
		var portletPromptParams = this.portletPromptParams(oReq);
		if (portletPromptParams.length > 0) {
			portletSharePrompt(portletPromptParams);
		}
	}

	this.dispatchRequest(oReq);
};

/**
 * Prepare parameters to be shared with other portlets
 *
	@private
	@param {object} oReq
	@return (array)
*/
CCognosViewer.prototype.portletPromptParams = function(oReq) {
	var result = [];
	var requestParam = null;
	var validSharePrompt = true; // false for search or credentials requests
	var aParameters = oReq.getFormFields().keys();
	for (var idxParameter = 0; idxParameter < aParameters.length; idxParameter++) {
        requestParam = aParameters[idxParameter];
        // don't share credential parameters or search request
        if (requestParam == "_promptControl" && oReq.getFormField(requestParam) == "search") {
            validSharePrompt = false;
            break;
        }
        else
            if (requestParam.indexOf("p_") === 0) {
                if (requestParam.indexOf("p_credential") === 0) {
                    validSharePrompt = false;
                    break;
                }
                else {
                    result.push([requestParam, oReq.getFormField(requestParam)]);
                }
            }
    }
    if (result && !validSharePrompt) {
        result = [];
    }
    return result;
};

CCognosViewer.prototype.preparePromptValues = function(oReq)
{
	// Use aInputs to keep track of input fields submitted.
	var aInputSubmitted = [];

	if (this.preProcessControlArray)
	{
		var kCount = this.preProcessControlArray.length;
		var k = 0;
		for (k=0; k<kCount; k++)
		{
			var oPrmtCtrl = eval(this.preProcessControlArray[k]);
			var bPrmtEnabled = (typeof oPrmtCtrl.isEnabled == "function" ? oPrmtCtrl.isEnabled() : true);
			if (oPrmtCtrl && typeof oPrmtCtrl.preProcess == "function" && bPrmtEnabled)
			{
				oPrmtCtrl.preProcess();
				if (oPrmtCtrl.m_oSubmit)
				{
					// Query Studio still passes us the old CCognosViewerRequest object
					if (oReq.addParameter) {
						oReq.addParameter(oPrmtCtrl.m_oSubmit.name, oPrmtCtrl.m_oSubmit.value);
					}
					else {
						oReq.addFormField(oPrmtCtrl.m_oSubmit.name, oPrmtCtrl.m_oSubmit.value);
					}
					aInputSubmitted.push(oPrmtCtrl.m_oSubmit);

					if (oPrmtCtrl.m_sPromptId && oPrmtCtrl.m_oForm && oPrmtCtrl.m_oForm.elements && typeof oPrmtCtrl.m_oForm.elements['p_' + oPrmtCtrl.m_sRef] == "object")
					{
						// we have a promptID based control, add its value separately (ie multiple search controls on the same parameter on the same page).
						if (oReq.addParameter) {
							oReq.addParameter('p_' + oPrmtCtrl.m_sPromptId, oPrmtCtrl.m_oForm.elements['p_' + oPrmtCtrl.m_sRef].value);
						}
						else {
							oReq.addFormField('p_' + oPrmtCtrl.m_sPromptId, oPrmtCtrl.m_oForm.elements['p_' + oPrmtCtrl.m_sRef].value);
						}
					}

				}
			}
		}
	}

	var elFWR = document.getElementById("formWarpRequest" + this.getId());
	if (elFWR)
	{
		var aInputs = elFWR.elements;
		for (var idxInput = 0; idxInput < aInputs.length; idxInput++)
		{
			var elInput = aInputs[idxInput];
			if ( !elInput.name || !elInput.name.match(/^p_/) )
			{
				continue;
			}
			var bToAdd = true;
			for (var idxSubmitted = 0; idxSubmitted < aInputSubmitted.length; idxSubmitted++)
			{
				if (aInputSubmitted[idxSubmitted] == elInput)
				{
					bToAdd = false; break;
				}
			}
			if (bToAdd)
			{
				oReq.addFormField(elInput.name, elInput.value);
				aInputSubmitted.push(elInput);
			}
		}
	}

	var oRM = this['CognosReport'];
	if (oRM)
	{
		var aParams = oRM.prompt.getParameters();
		for (var i = 0; i < aParams.length; i++)
		{
			var sName = "p_" + aParams[i].getName();
			if ( !oReq.getFormField(sName) )
			{
				oReq.addFormField(sName, aParams[i].getXML());
			}
		}
	}

	return oReq;
};

CCognosViewer.prototype.setViewerWidget = function( cvWidget )
{
	this.m_viewerWidget = cvWidget;
};
CCognosViewer.prototype.getViewerWidget = function()
{
	return this.m_viewerWidget;
};

CCognosViewer.prototype.getFlashChartOption = function()
{
	var cvWidget = this.getViewerWidget();
	var flashCharts = null;
	if (cvWidget) {
		var props = cvWidget.getProperties();
		if (props) {
			flashCharts = props.getFlashCharts();
		}
	}
	return flashCharts;
};

CCognosViewer.prototype.fireWidgetEvent = function( evt, payload )
{
	var viewerIWidget = this.getViewerWidget();
	if (viewerIWidget != null) {
		viewerIWidget.fireEvent(evt, null, payload);
	}
};

CCognosViewer.prototype.isMobile = function() { return false; };

/**
 * Set the currently visible modal dialog
 * @param {Object} dialog
 */
CCognosViewer.prototype.setVisibleDialog = function(dialog) {
	this.m_visibleDialog = dialog;
};

/**
 * Get the visible modal dialog (if any)
 */
CCognosViewer.prototype.getVisibleDialog = function() {
	if (typeof this.m_visibleDialog != "undefined") {
		return this.m_visibleDialog;
	}

	return null;
};

CCognosViewer.prototype.getContentLocale = function() {
	var formWarpRequest = document.getElementById("formWarpRequest" + this.getId());
	if (formWarpRequest && formWarpRequest["ui.contentLocale"] && formWarpRequest["reRunObj"] && formWarpRequest["reRunObj"].value.length > 0)
	{
		return formWarpRequest["ui.contentLocale"].value;
	}
	return null;
};

/**
	Show/hide header, toolbar based on the current state.
	@private
	@param {string} sState Conversation's state
*/
CCognosViewer.prototype.updateLayout = function(sState)
{
	var cvid = this.getId();
	var oHeader = document.getElementById('CVHeader' + cvid);
	var oToolbar = document.getElementById('CVToolbar' + cvid);
	if (!oHeader && !oToolbar)
	{
		setTimeout(getCognosViewerObjectRefAsString(cvid) + '.updateLayout("' + sState + '");', 100);
		return;
	}

	if (oHeader) {
		var hideBannerConfig = this.getUIConfig() && !this.getUIConfig().getShowBanner();
		if ((sState == "prompting" && !this.bShowHeaderWithPrompts) || hideBannerConfig) {
			oHeader.parentNode.style.display = "none";
		}
		else {
			oHeader.parentNode.style.display = "";
		}
	}
	if (oToolbar) {
		if (sState == "prompting" || this.m_bHideToolbar == true) {
			oToolbar.parentNode.style.display = "none";
		}
		else {
			oToolbar.parentNode.style.display = "";
		}
	}
};

/**
	Update the state of the response specification.
	@private
	@param {string} sResponseSpecification specification state
*/
CCognosViewer.prototype.updateResponseSpecification = function(sResponseSpecification)
{
	this.sResponseSpecification = sResponseSpecification;
};

/**
	Returns the response specification if available.
	@private
	@param
*/
CCognosViewer.prototype.getResponseSpecification = function()
{
	return this.sResponseSpecification;
};

/**
 * Releases the currect conversation. Returns true if release was called, otherwise false
 * @param {Object} callback
 */
CCognosViewer.prototype.release = function(asynchronous)
{
	if( this.getStatus() != 'fault' )
	{
		this._release(asynchronous);
	}
};

/**
 * Releases the currect conversation. Returns true if release was called, otherwise false
 * @param {Object} callback
 */
CCognosViewer.prototype._release = function(asynchronous)
{
	var form = document.getElementById("formWarpRequest" + this.getId());
	var tracking = this.getTracking();
	if(!tracking && form && form["m_tracking"] && form["m_tracking"].value) {
		tracking = form["m_tracking"].value;
		form["m_tracking"].value = "";
	}

	// blank out the tracking so we never do multiple releases for the same tracking
	this.setTracking("");

	if(tracking)
	{
		var request = new DispatcherEntry(this);
		if( this.isWorkingOrPrompting() ) {
			request.addFormField("ui.action", "cancel");
		}
		else {
			request.addFormField("ui.action", "release");
		}

		request.addFormField("cv.responseFormat", "successfulRequest");
		request.addNonEmptyStringFormField("ui.primaryAction", this.envParams["ui.primaryAction"]);
		request.addNonEmptyStringFormField("ui.objectClass", this.envParams["ui.objectClass"]);
		request.addFormField("m_tracking", tracking);
		if (asynchronous != true) {
			request.forceSynchronous();
		}

		// If the current request is using a cv.outputKey then the release
		// request should get load balanced to the same Viewer
		var activeRequest = this.getActiveRequest() ? this.getActiveRequest() : this.getFaultDispatcherEntry();
		if (activeRequest && activeRequest.getFormField("cv.outputKey")) {
			request.addFormField("b_action", "cvx.high");
			request.addFormField("cv.outputKey", activeRequest.getFormField("cv.outputKey"));
			request.addFormField("cv.waitForResponse", "false");
			request.setHeaders(activeRequest.getHeaders());
		}

		// Don't go through the queue, we need to send this request asap.
		request.sendRequest();

		return true;
	}

	return false;
};

CCognosViewer.prototype.cleanupStyles = function() {
	if (this.getViewerWidget()) {
		this.getViewerWidget().cleanupStyles();
	}
};

/**
 * Will release the conversation and clean up the Viewer object
 * @param {Object} callback
 */
CCognosViewer.prototype.destroy = function(asynchronous) {
	this.release(asynchronous);
	if (!this.m_destroyed)
	{
		//cleanup action
		if( typeof window.gaRV_INSTANCES != "undefined") {
			for (var iIndex=0; iIndex < window.gaRV_INSTANCES.length; iIndex++)
			{
				if (window.gaRV_INSTANCES[iIndex].m_sId == this.getId())
				{
					window.gaRV_INSTANCES.splice(iIndex, 1);
					this.m_destroyed = true;
					break;
				}
			}
		}


		if (this.m_layoutElements) {
			for (var i=0; i<this.m_layoutElements.length; i++) {
				var e = this.m_layoutElements[i];
				var j = e.getAttribute("lid");
				this.m_layoutElements.splice(i, 1);
				delete this.m_lidToElement[j];

				var parentNode = e.parentNode;
				if (parentNode) {
					parentNode.removeChild(e);
				}
			}
			delete this.m_layoutElements;
			delete this.m_lidToElement;
		}

		if (this.m_oDrillMgr) {
			this.m_oDrillMgr.setCV(null);
		}
		var selectionController = this.getSelectionController();
		if (selectionController) {
			GUtil.destroyProperties(selectionController);
		}

		var cvId = this.getId();
		this.m_viewerDispatcher = null;

		GUtil.destroyProperties(this, true);

		cleanupGlobalObjects(cvId);
	}
};

/**
 * Releases the conversation
 * @param {Object} callback
 */
CCognosViewer.prototype.exit = function()
{
	this.release();
};

/**
 * Executes a viewer action
 * @param (string) The action to execute (ie. run)
 */
CCognosViewer.prototype.executeAction = function(sAction, parms )
{
	var action = this.getAction(sAction);
	action.setRequestParms( parms );
	return action.execute();
};

/**
 * Gets a calculation object
 */
CCognosViewer.prototype.getCalculation = function(sCalculation){
	var calc = null;
	var calcCache = this.getCalculationCache();
	if (calcCache[sCalculation]) {
		calc = calcCache[sCalculation];
	} else {
		calc = eval("new " + sCalculation + "();");
		calc.setCognosViewer(this);
		calcCache[sCalculation] = calc;
	}

	return calc;
};

CCognosViewer.prototype.findBlueDotMenu = function(aMenuItems)
{
	var root = null;
	var items = (aMenuItems) ? aMenuItems : this.getToolbar();

	for(var idx = 0; idx < items.length; ++idx) {
		if (typeof items[idx]._root != "undefined") {
			root = items[idx]._root;
			break;
		}
	}

	return root;
};

/**
 * Finds an item in the toolbar. If toolbarSpec is null, it'll search through
 * the top level buttons (i.e. Not the blue dot menu)
 */
CCognosViewer.prototype.findToolbarItem = function(itemName, toolbarSpec)
{
	var spec = typeof toolbarSpec == "undefined" || toolbarSpec == null ? this.getToolbar() : toolbarSpec;
	var buttonSpec = null;

	for(var iIndex = 0; iIndex < spec.length; ++iIndex) {
		var name = spec[iIndex]["name"];
		if (typeof name != "undefined" && name == itemName) {
			buttonSpec = spec[iIndex];
			break;
		}
	}

	return buttonSpec;
};

/**
 * Finds the index of an item in the toolbar. If toolbarSpec is null, it'll search through
 * the top level buttons (i.e. Not the blue dot menu)
 */
CCognosViewer.prototype.findToolbarItemIndex = function(itemName, toolbarSpec)
{
	var spec = typeof toolbarSpec == "undefined" || toolbarSpec == null ? this.getToolbar() : toolbarSpec;
	var buttonIndex = null;

	for(var iIndex = 0; iIndex < spec.length; ++iIndex) {
		var name = spec[iIndex]["name"];
		if (typeof name != "undefined" && name == itemName) {
			buttonIndex = iIndex;
			break;
		}
	}

	return buttonIndex;
};

/**
 * Attempt to re-add a button to the toolbar where it originally was. 
 * First choice is to place it after the precedingButton if available, 
 * otherwise fall back on using the provided buttonLocation.
 * @param A toolbar spec
 * @param The button to add
 * @param (string) The button name that should precede the added button (optional)
 * @param (string) The index to place the button (optional)
 */
CCognosViewer.prototype.addedButtonToToolbar = function(toolBarSpec, buttonToAdd, precedingButton, buttonLocation)
{
	if (typeof buttonToAdd != "undefined" && buttonToAdd != null) {
		if (this.findToolbarItem(buttonToAdd.name, toolBarSpec) == null) {
			// first try adding the button after a specific one
			precedingButton = this.findToolbarItemIndex(precedingButton, toolBarSpec);
			if (typeof precedingButton != "undefined" && precedingButton != null) {
				toolBarSpec.splice(++precedingButton, 0, buttonToAdd);
				return true;
			}
			// fallback using an index, hoping it's the correct place to put it
			else if (typeof buttonLocation != "undefined" && buttonLocation != null) {
				toolBarSpec.splice(buttonLocation, 0, buttonToAdd);
				return true;
			}
		}
	}	
	return false;
};

CCognosViewer.prototype.addDrillTargets = function(drillTargets)
{
	this.m_drillTargets = drillTargets;
};

CCognosViewer.prototype.getDrillTargets = function()
{
	return this.m_drillTargets;
};

CCognosViewer.prototype.getDrillTarget = function(idx)
{
	if(idx >= this.m_drillTargets.length)
	{
		return null;
	}
	return this.m_drillTargets[idx];
};

CCognosViewer.prototype.getNumberOfDrillTargets = function()
{
	return this.m_drillTargets.length;
};

CCognosViewer.prototype.isReportRenderingDone = function()
{
	return this.m_reportRenderingDone;
};

CCognosViewer.prototype.setReportRenderingDone = function(flag)
{
	this.m_reportRenderingDone = flag;
};

CCognosViewer.prototype.hasAVSChart = function()
{
	var oRAPReportInfo = this.getRAPReportInfo();
	if (oRAPReportInfo) {
		var sDisplayTypes = oRAPReportInfo.getDisplayTypes();
		return sDisplayTypes.match("_v2") != null || sDisplayTypes.match("v2_") != null;
	}

	return false;

};

/**
 * Accessor for the PinFreezeManager used by this Viewer
 */
CCognosViewer.prototype.getPinFreezeManager = function() {
	return this.m_pinFreezeManager;
};

CCognosViewer.prototype.getReportContextHelper = function() {
	if(!this.m_reportContextHelper) {
		this.m_reportContextHelper = new ReportContextHelper(this.getSelectionController().getCCDManager());
	}
	return this.m_reportContextHelper;
};

CCognosViewer.prototype.getRAPReportInfo = function() {
	return this.m_RAPReportInfo;
};

CCognosViewer.prototype.setRAPReportInfo = function(oRapReportInfo) {
	this.m_RAPReportInfo = oRapReportInfo;
};

/**
 * Return true iff the DOM node is currently available to the user to see.
 */
CCognosViewer.prototype.isNodeVisible = function(node) {
	if(this.m_pinFreezeManager) {
		return this.m_pinFreezeManager.isNodeVisible(node);
	}
	return true;
};

/**
 * Returns the warp request form used by this viewer.
 */
CCognosViewer.prototype.getWarpRequestForm = function() {
	return document.getElementById("formWarpRequest" + this.getId());
};

CCognosViewer.prototype.getBrowser = function() {
	return this.sBrowser;
};

/**
 * In IE you sometimes need to 'repaint' a div to make it update. Simple helper function to do that
 */
CCognosViewer.prototype.repaintDiv = function(oDiv) {
	var display = oDiv.style.display;
	oDiv.style.display = "none";
	oDiv.style.display = display;
};

CCognosViewer.prototype.isMetadataEmpty = function () {

	var oSC = this.getSelectionController();
	if (oSC) {
		var oCCDM = oSC.getCCDManager();
		if (oCCDM) {
			return oCCDM.isMetadataEmpty();
		}
	}
	return true;
};

CCognosViewer.prototype.setContextMenu = function(contextMenu) {
	this.m_contextMenu = contextMenu;
};

CCognosViewer.prototype.getContextMenu = function() {
	return this.m_contextMenu;
};

CCognosViewer.prototype.setToolbar = function(toolbar) {
	this.m_toolbar = toolbar;
};

CCognosViewer.prototype.getToolbar = function() {
	return this.m_toolbar;
};

CCognosViewer.prototype.getAdvancedServerProperty = function(property) {
	if(this.m_advancedProperties && this.m_advancedProperties[property] !== undefined &&
			this.m_advancedProperties[property] !== null) {
		return this.m_advancedProperties[property];
	} else {
		return null;
	}
};

/**
 * Returns true if current report has prompts or ambiguous connection info. 
 * Checking is done once and the result is saved and reused. 
 * The resetbHasPromptFlag function can be called to reset the saved result.
 * 
 * If VIEWER_JS_PROMPT_AGAIN_SHOW_ALWAYS advanced server property is set to true, then return true. 
 * This is backup switch to go back to old behavior.
 * 
 * When a prompt (Required, optional or model based prompts) is applied, evnParams['reportPrompts'] has the information. 
 * If 'reportPrompt' in envParams is not empty, then return true. 
 * Note that prompt information appears also in execution parameters but this check is more effient. 
 * 
 * When user selects one from ambiguous commections, the infromation is stored in execution parameters. 
 * Note that Slider/Checkbox filter is also saved in execution parameters.
 * Check if execution parameters include ambiguous connection info which parameter name has prefix 'credential:', then return true.
 *  
 */
CCognosViewer.prototype.hasPrompt = function() {
	
	if (typeof this.m_bHasPrompt === "undefined" || this.m_bHasPrompt === null) {
		var foundPrompt = false;
		if (this.getAdvancedServerProperty("VIEWER_JS_PROMPT_AGAIN_SHOW_ALWAYS") === "true" ||
			(this.envParams.reportPrompts && this.envParams.reportPrompts.length>0 )) {
			foundPrompt = true;
		} else {
			//Check if selection of ambiguous connections is in execution parameter
			var paramValues = new CParameterValues();
			var documentNode = XMLBuilderLoadXMLFromString(this.getExecutionParameters());
			if (documentNode.childNodes.length == 1) {
				paramValues.loadWithOptions(documentNode.childNodes[0], /*credentials*/true);
				
				var numberOfParameters = paramValues.length();
				for (var index = 0; index < numberOfParameters; ++index) {
					var parameter = paramValues.getAt(index);
					if (parameter !== null && parameter.length() > 0 &&
						parameter.name().indexOf("credential:") != -1) {
						foundPrompt = true;
						break;
					}
				}
			}
		}
		
		this.m_bHasPrompt = foundPrompt;
	}
	return this.m_bHasPrompt;
};


/**
 * PUBLIC API, do not change!
 * Used by ADP to get the stateData from the RSVP response
 */
CCognosViewer.prototype.getDrillState = function() {
	//PUBLIC API, do not change!
	return this.m_sStateData ? this.m_sStateData : "";
};

CCognosViewer.prototype.isSelectionFilterEnabled = function() {
	if (typeof this.m_bSelectionFilterSwitch == "undefined") {
		this.m_bSelectionFilterSwitch = false;
	}
	return this.m_bSelectionFilterSwitch;
};
	

/**
 * PUBLIC API, do not change
 * Used to send a contextChange event
 */
CCognosViewer.prototype.broadcastContextChange = function(evt, payload) {
	if (this.getViewerWidget()) {
		this.getViewerWidget().broadcastContextChange(payload);
	}
	
	stopEventBubble(evt);
};
/**
 * PUBLIC API, do not change
 * Used to send a contextChanged.prompt event
 */
CCognosViewer.prototype.broadcastParameterChange = function(evt, payload) {
	if (this.getViewerWidget()) {
		this.getViewerWidget().broadcastParameterChange(payload);
	}

	stopEventBubble(evt);
};

/*
 * returns the DIV element that has rendered report
 */
CCognosViewer.prototype.getReportDiv = function() {
	if (!this.m_nReportDiv) {
		this.m_nReportDiv = document.getElementById("CVReport" + this.m_sId);
	}
	return this.m_nReportDiv;
};

/**
	Initialize the CDocumentWriter object.
	@constructor
	@param {string} sId The unqiue id of the anchor tag which is a placholder for the script to execute
	@param {string} sScript The script to be executed
 */
function CDocumentWriter(sId, sScript)
{
	this.m_sId = sId;
	this.m_sText = "";
	this.m_sScript = sScript;
}

/**
 * Determines if the document writer can handle the embedded script successfully.
 * @return (boolean)
 */
CDocumentWriter.prototype.isValid = function()
{
	if(typeof this.m_sScript != "undefined" && this.m_sScript && window.gScriptLoader)
	{
		//Previously, there was a check that m_sScript contained <script> and </script>
		//tags, but now that the code is extracted directly from the DOM, tags are not
		//included in the script string.
		return true;
	}

	return false;
};

/**
 * Executes the inline script. This method will return false if an error occurs
 * @return (boolean)
 */
CDocumentWriter.prototype.execute = function()
{

	if(this.isValid() && window.gScriptLoader)
	{
		var reDocumentWrite = /document\.write(ln)?\s*\(/gi;
		var sScript = this.m_sScript.replace(reDocumentWrite, "this.write(").replace(window.gScriptLoader.m_reScriptTagOpen, "").replace(window.gScriptLoader.m_reScriptTagClose, "");

		try
		{
			eval(sScript);
			var placeHolderNode = document.getElementById(this.m_sId);

			if(placeHolderNode)
			{
				placeHolderNode.innerHTML = this.m_sText;
				return true;
			}
		}
		catch(e){}
	}

	return false;
};

/**
 * Builds a string and caches it locally to be inserted later on during execution
 */
CDocumentWriter.prototype.write = function(oArgument)
{
	var sResult = "";
	if(typeof oArgument == "function")
	{
		sResult = eval(oArgument);
	}
	else if(typeof oArgument == "string")
	{
		sResult = oArgument;
	}

	this.m_sText += sResult;
};

/**
 * Finds the first node under the container with a tabIndex of 0 and sets the focus to it. Note, we can't use dijit._getTabNavigable here
 * since it's pretty expensive for large reports since it'll loop through ALL the elements. All we need to do is find the first one
 * which is usually within the first 10 elements we try.
 * @param {Object} container
 */
function setFocusToFirstTabItem(container) {
	if (!window.dojo) {
		return;
	}
	var arrNodes = dojo.query("*", container);
	var nodesLen = arrNodes.length;

	for (var i = 0; i < nodesLen; i++) {
		var node = arrNodes[i];
		// skip any hidden nodes
		if (!node.style || (node.style.display != "none" && node.style.visibility != "hidden")) {
			if (node.getAttribute("tabIndex") == 0) {
				try {
					node.focus();
				}
				catch (e) {
					// IE 8 sometimes throws an exception if the node isn't fully initialized.
				}
				break;
			}
		}
	}
}

function ReportContextHelper(oCDManager) {
	this.m_oCDManager = oCDManager;
}

ReportContextHelper.prototype.destroy = function() {
	if (this.m_oCDManager && this.m_oCDManager.destroy) {
		this.m_oCDManager.destroy();
	}
	delete this.m_oCDManager;
};
/**
 * Splits a context string into arrays of individual context values.
 * For example:
 *	*	"9" returns [["9"]]
 *	*	"9::8::7" returns [["9"],["8"],["7"]]
 *	*	"9::8:7::3:2" returns [["9"],["8","7"],["3","2"]]
 * sCtx must be a string.
 */
ReportContextHelper.prototype.processCtx = function(sCtx) {
	var aContextIds0 = sCtx.split("::");
	var aContextIds1 = [];
	for(var i = 0; i < aContextIds0.length; ++i) {
		aContextIds1[i] = aContextIds0[i].split(":");
	}
	if(aContextIds1 && aContextIds1.length && aContextIds1[0].length) {
		return aContextIds1;
	} else {
		return null;
	}
};

/**
 * Retrieves the data item from the context.
 * sCtx must be a string with a context value or id.
 */
ReportContextHelper.prototype.getDataItemName = function(sCtx) {
	var aRefDataItem = this.processCtx(sCtx);
	if (aRefDataItem) {
		return this.getRefDataItem(aRefDataItem[0][0]);
	}
	return null;
};

ReportContextHelper.prototype.getRefDataItem = function(sCtxId) {
	var sRefDataItem = this.m_oCDManager.GetRDIValue(sCtxId);
	return (sRefDataItem == null) ? "" : sRefDataItem;
};


/**
 * Gets the Member Unique Name from a context string or id.
 * oParam can be:
 *	*	a string - either a :: delimited ctx string, such as "9::8:7::3:2",
 *		or a single context id, such as "9"
 *	*	a number - a single context id, such as 9
 *	*	an already-processed string in an array, such as [["9"],["8","7"],["3","2"]]
 * Returns "" if no MUN is found.
 */
ReportContextHelper.prototype.getMun = function(oParam)
{
	var aCtx = null;
	if(typeof oParam === "string") {
		aCtx = this.processCtx(oParam);
	} else if(typeof oParam === "number") {
		aCtx = this.processCtx(oParam.toString());
	} else {
		aCtx = oParam;
	}

	if (aCtx) {
		var sMun = this.m_oCDManager.GetMUN(aCtx[0][0]);
		return (sMun == null) ? "" : sMun;
	}

	return "";
};

