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
var __excel_win = null;
var __pdf_win = null;

if (window.attachEvent)
{
	window.attachEvent("onkeydown", viewerMainKeyPress);
	window.attachEvent("onresize", onResizeViewerEvent);
}
else if (window.addEventListener)
{
	window.addEventListener("keypress", viewerMainKeyPress, false);
	window.addEventListener("resize", onResizeViewerEvent, false);
}

function attachLeavingRV() {
	if (window.attachEvent)
	{
		window.attachEvent("onbeforeunload", leavingRV);
	}
	else if (window.addEventListener)
	{
		window.addEventListener("beforeunload", leavingRV, false);
	}
	else
	{
		// We should not get here, but just in case for older browsers.
		try
		{
			var oUnload = window.onunload;
			// add leavingRV if not already in the onunload events
			if ( !(""+oUnload).match(/leavingRV/gi) )
			{
				window.oLeavingRV_onunload = window.onunload;
				window.onunload = function()
				{
					window.oLeavingRV_onunload();
					leavingRV();
				};
			}
		}
		catch (e)
		{
			// Can't set unload event.
		}
	}	
}

function detachLeavingRV() {
	if (window.detachEvent)
	{
		window.detachEvent("onbeforeunload", leavingRV);
	}
	else
	{
		window.removeEventListener("beforeunload", leavingRV, false);
	}	
}

window.attachLeavingRV();

function CContextMenu(rvMainWnd) {
	if (rvMainWnd == null) {
		return;
	}

	/**
		A reference to CMainWnd associated with this context menu.
		@type CMainWnd
	*/
	this.m_mainWnd = rvMainWnd;
	this.setCV(this.m_mainWnd.getCV());
	var sWebContentRoot = this.m_mainWnd.getCV().getWebContentRoot();
	var sSkin = this.m_mainWnd.getCV().getSkin();
	var sBlacklist = this.m_mainWnd.getUIHide();

	/**
		A reference to localized strings from CCognosViewer (used as shortcut).
		@type object
	*/
	this.m_contextMenu = new CMenu('rvContextMenu' + this.getCVId(),gMenuStyle, sWebContentRoot);
	this.m_contextMenu.m_oCV = this.getCV();

	// Download chart menu item
	this.m_downloadChart = new CMenuItem(this.m_contextMenu, RV_RES.RV_DOWNLOAD_CHART, "if(typeof " + getCognosViewerSCObjectRefAsString(this.getCVId()) + " != \'undefined\') " + getCognosViewerSCObjectRefAsString(this.getCVId()) + ".downloadSelectedChartImage('" + this.getCVId() + "');", sWebContentRoot + '/rv/images/action_chart.gif', gMenuItemStyle, sWebContentRoot, sSkin);
	this.m_downloadChart.hide();

	// Context Menu Seperator
	this.m_downloadChartSeperator = new CSeperator('horizontal_line'+this.getCVId(), '1',gMenuSeperatorStyle, sWebContentRoot);
	this.m_downloadChartSeperator.hide();
	this.m_contextMenu.add(this.m_downloadChartSeperator);

	// drill down item
	var oDrillMgr = this.getCV().getDrillMgr();
	if(oDrillMgr)
	{
		if (this.getCV().envParams["ui.action"] == "view")
		{
			if (this.getCV().bCanUseCognosViewerIndexSearch && sBlacklist.indexOf(' RV_CONTEXT_MENU_GOTO ') == -1)
			{
				this.m_goto = new CMenuItem(this.m_contextMenu, RV_RES.RV_GO_TO, this.getCVObjectRef() + ".getDrillMgr().launchGoToPage(null,true);", sWebContentRoot + "/rv/images/action_go_to.gif", gMenuItemStyle, sWebContentRoot, sSkin);
				var dtMenu = this.m_goto.createCascadedMenu(gMenuStyle);
				//new CMenuItem(dtMenu, RV_RES.RV_SEARCH, this.getCVObjectRef() + '.getDrillMgr().launchSearchPage();', "", gMenuItemStyle, this.getCV().getWebContentRoot(), this.getCV().getSkin());
			}
		}
		else
		{
			if(typeof RV_RES.RV_DRILL_DOWN != "undefined")
			{
				this.m_drillDown = new CMenuItem(this.m_contextMenu, RV_RES.RV_DRILL_DOWN, this.getCVObjectRef() + ".getDrillMgr().rvDrillDown();", sWebContentRoot + '/rv/images/action_drill_down.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				this.m_drillDown.disable();
			}

			// drill up
			if(typeof RV_RES.RV_DRILL_UP != "undefined")
			{
				this.m_drillUp = new CMenuItem(this.m_contextMenu, RV_RES.RV_DRILL_UP, this.getCVObjectRef() + ".getDrillMgr().rvDrillUp();", sWebContentRoot + '/rv/images/action_drill_up.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				this.m_drillUp.disable();
			}

			if(this.getCV().isInteractiveViewer() && this.getCV().getAdvancedServerProperty("VIEWER_JS_ENABLE_EXPAND_COLLAPSE") == "true") {
				// Context Menu Separator
				this.m_contextMenu.add(gMenuSeperator);
				
				if(typeof RV_RES.IDS_JS_EXPAND_MEMBER != "undefined") {
					this.m_expand = new CMenuItem(this.m_contextMenu, RV_RES.IDS_JS_EXPAND_MEMBER, this.getCVObjectRef() + ".expand();", "", gMenuItemStyle, sWebContentRoot, sSkin);
					this.m_expand.disable();
				}
				
				if(typeof RV_RES.IDS_JS_COLLAPSE_MEMBER != "undefined") {
					this.m_collapse = new CMenuItem(this.m_contextMenu, RV_RES.IDS_JS_COLLAPSE_MEMBER, this.getCVObjectRef() + ".collapse();", "", gMenuItemStyle, sWebContentRoot, sSkin);
					this.m_collapse.disable();
				}
			}			

			
			if (!this.getCV().m_viewerFragment && typeof RV_RES.IDS_JS_FREEZECOLUMNHEADINGS !== "undefined" && typeof RV_RES.IDS_JS_FREEZEROWHEADINGS !== "undefined") {
				this.m_freezeRowHeadings = new CMenuItem(this.m_contextMenu, RV_RES.IDS_JS_FREEZEROWHEADINGS, this.getCVObjectRef() + ".getPinFreezeManager().freezeSelectedRowHeadings();", sWebContentRoot + '/rv/images/action_freeze_row_heading.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				this.m_unfreezeRowHeadings = new CMenuItem(this.m_contextMenu, RV_RES.IDS_JS_UNFREEZEROWHEADINGS, this.getCVObjectRef() + ".getPinFreezeManager().unfreezeSelectedRowHeadings();", sWebContentRoot + '/rv/images/action_freeze_row_heading.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				this.m_freezeColumnHeadings = new CMenuItem(this.m_contextMenu, RV_RES.IDS_JS_FREEZECOLUMNHEADINGS, this.getCVObjectRef() + ".getPinFreezeManager().freezeSelectedColumnHeadings();", sWebContentRoot + '/rv/images/action_freeze_column_heading.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				this.m_unfreezeColumnHeadings = new CMenuItem(this.m_contextMenu, RV_RES.IDS_JS_UNFREEZECOLUMNHEADINGS, this.getCVObjectRef() + ".getPinFreezeManager().unfreezeSelectedColumnHeadings();", sWebContentRoot + '/rv/images/action_freeze_column_heading.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				this.m_freezeColumnHeadings.hide();
				this.m_unfreezeColumnHeadings.hide();
				this.m_freezeRowHeadings.hide();
				this.m_unfreezeRowHeadings.hide();
			}
			
			if(typeof RV_RES.RV_GO_TO != "undefined")
			{
				if(sBlacklist.indexOf(' RV_CONTEXT_MENU_GOTO ') == -1)
				{
					// seperator
					if (sBlacklist.indexOf(' RV_CONTEXT_MENU_DRILL_UP ') == -1 || !sBlacklist.indexOf(' RV_CONTEXT_MENU_DRILL_DOWN ') == -1) {
						this.m_contextMenu.add(gMenuSeperator);
					}
				}
				// go to
				this.m_goto = new CMenuItem(this.m_contextMenu, RV_RES.RV_GO_TO, this.getCVObjectRef() + ".getDrillMgr().launchGoToPage(null,true);", sWebContentRoot + "/rv/images/action_go_to.gif", gMenuItemStyle, sWebContentRoot, sSkin);
				var drillThroughMenu = this.m_goto.createCascadedMenu(gMenuStyle);
				drillThroughMenu.m_oCV = this.getCV();

				if (this.getCV().envParams["cv.containerApp"] == "AA")
				{
					drillThroughMenu.registerCallback(this.getCVObjectRef() + ".m_viewerFragment.raiseGotoContextMenuEvent()");
				}
				else
				{
					drillThroughMenu.registerCallback(this.getCVObjectRef() + ".getDrillMgr().getDrillThroughParameters()");
				}
			}
		}
	}

	var subsMan = this.getCV().getSubscriptionManager();
	if (subsMan && this.getCV().bCanUseCognosViewerConditionalSubscriptions)
	{
		this.m_subscriptionSeperator = new CSeperator('horizontal_line', '1',gMenuSeperatorStyle, sWebContentRoot);
		this.m_subscriptionSeperator.hide();
		this.m_contextMenu.add(this.m_subscriptionSeperator);

		// custom subscriptions
		if(RV_RES.RV_NEW_WATCH_RULE)
		{
			this.m_subscription = new CMenuItem(this.m_contextMenu, RV_RES.RV_NEW_WATCH_RULE, this.getCVObjectRef() + ".getSubscriptionManager().NewSubscription();", sWebContentRoot + '/rv/images/action_new_subscription.gif', gMenuItemStyle, sWebContentRoot, sSkin);
			this.m_subscription.disable();
		}
	}

	var bGlossary = false;
	if(this.getCV().bCanUseGlossary && RV_RES.RV_GLOSSARY && sBlacklist.indexOf(' RV_CONTEXT_MENU_GLOSSARY ') == -1)
	{
		bGlossary = true;
		this.m_contextMenu.add(gMenuSeperator);
		this.m_glossaryItem = new CMenuItem(this.m_contextMenu, RV_RES.RV_GLOSSARY, this.getCVObjectRef() + ".executeAction('Glossary');", sWebContentRoot + '/rv/images/action_glossary.gif', gMenuItemStyle, sWebContentRoot, sSkin);
		this.m_glossaryItem.disable();
	}

	if (this.isLinegaeVisisble(sBlacklist))
	{
		if (!bGlossary)
		{
			this.m_contextMenu.add(gMenuSeperator);
		}
		this.m_lineageItem = new CMenuItem(this.m_contextMenu, RV_RES.RV_LINEAGE, this.getCVObjectRef() + ".executeAction('Lineage');", sWebContentRoot + '/rv/images/action_lineage.gif', gMenuItemStyle, sWebContentRoot, sSkin);
		this.m_lineageItem.disable();
	}
}
CContextMenu.prototype = new CViewerHelper();

CContextMenu.prototype.isLinegaeVisisble = function(sBlacklist)
{
	if(!isSafari() && this.getCV().bCanUseLineage && RV_RES.RV_LINEAGE && sBlacklist.indexOf(' RV_CONTEXT_MENU_LINEAGE ') == -1)
	{
		// don't allow lineage for reports ran from a studio if the lineage URI is getting redirected to another provider
		if (this.getCV().envParams["ui.object"] || (this.getCV().envParams["metadataInformationURI"] && this.getCV().envParams["metadataInformationURI"].indexOf("iis=") == -1))
		{
			return true;
		}
	}

	return false;
};


/**
 * Cleans up the menu since we never want the first visible menuItem to be a seperator.
 */
CContextMenu.prototype.hideFirstSeperators = function()
{
	var contextMenuLength = this.m_contextMenu.m_menuItems.length;
	for (var iIndex = 0; iIndex < contextMenuLength; iIndex++)
	{
		var menuItem = this.m_contextMenu.m_menuItems[iIndex];
		if (menuItem.isVisible() && typeof menuItem.m_toolbarSeperatorClass != "string")
		{
			break;
		}
		else if (typeof menuItem.m_toolbarSeperatorClass == "string")
		{
			menuItem.hide();
		}
	}
};

/**
 * update the freeze headings options
 */
CContextMenu.prototype.updateFreezeHeadings = function()
{
	if (this.getCV().m_viewerFragment) {
		return;
	}
	
	if (this.getCV().getPinFreezeManager()) {
		var oPinFreezeManager=this.getCV().getPinFreezeManager();
		if (this.m_freezeRowHeadings) {
			if (oPinFreezeManager.canFreezeSelectedRowHeadings()) {
				this.m_freezeRowHeadings.show();
			} else {
				this.m_freezeRowHeadings.hide();
			}
		}
		if (this.m_unfreezeRowHeadings) {
			if (oPinFreezeManager.canUnfreezeSelectedRowHeadings()) {
				this.m_unfreezeRowHeadings.show();
			} else {
				this.m_unfreezeRowHeadings.hide();
			}
		}
		if (this.m_freezeColumnHeadings) {
			if (oPinFreezeManager.canFreezeSelectedColumnHeadings()) {
				this.m_freezeColumnHeadings.show();
			} else {
				this.m_freezeColumnHeadings.hide();
			}
		}
		if (this.m_unfreezeColumnHeadings) {
			if (oPinFreezeManager.canUnfreezeSelectedColumnHeadings()) {
				this.m_unfreezeColumnHeadings.show();
			} else {
				this.m_unfreezeColumnHeadings.hide();
			}
		}
	}
};

function CContextMenu_draw(evt) {
	this.updateSubscriptionContextMenuItem();

	if (this.m_bFaultModalShown)
	{
		this.update(this.subject);
		this.m_bFaultModalShown = false;
	}

	this.hideFirstSeperators();
	this.m_contextMenu.remove(); // calling remove() to make sure all existing sub items are removed/updated correctly when this menu is updated
	this.m_contextMenu.setHTMLContainer(document.body);
	this.m_contextMenu.draw();
	// In IE, if we're showing the context menu from a keyboard event
	// we need to calculate the coords of the DOM element
	if (isIE() && evt.keyCode && evt.keyCode != 0) {
		var node = getCrossBrowserNode(evt);
		var coords = clientToScreenCoords(node, document.body);
		this.m_contextMenu.setXCoord(coords.leftCoord + node.scrollWidth);
		this.m_contextMenu.setYCoord(coords.topCoord);				
	}
	else {
		this.m_contextMenu.setXCoord(evt.clientX);
		this.m_contextMenu.setYCoord(evt.clientY);		
	}

	// We might be displaying a log on page, if we are, don't show the menu
	if (getCVWaitingOnFault() == null)
	{
		this.m_contextMenu.show();
		this.m_bFaultModalShown = false;
	}
	else
	{
		this.m_bFaultModalShown = true;
	}

	var lastMenuItem = this.m_contextMenu.get(this.m_contextMenu.getNumItems()-1);

	if(lastMenuItem && typeof lastMenuItem.getObservers == "function" && typeof lastMenuItem.getObservers() == "object")
	{
		lastMenuItem.getObservers().attach(this, this.closeMenuTabEvent, "CMenuItem_closeMenuTabEvent");
	}
}

function CContextMenu_getDrillUpMenuItem() {
	return this.m_drillUp;
}

function CContextMenu_getDrillDownMenuItem() {
	return this.m_drillDown;
}

function CContextMenu_getGoToMenuItem() {
	return this.m_goto;
}
/**
 * Called when the context menu gets closed because the user tabbed past the last item in the context menu.
 * Sets the focus back to the last selected cell
 */
function CContextMenu_closeMenuTabEvent() {
	var oCV = this.m_mainWnd.getCV();
	var selectionController = oCV.getSelectionController();
	var selLength = selectionController.getAllSelectedObjects().length;

	if (selLength > 0) {
		// get the last selected cell
		var selection = selectionController.getAllSelectedObjects()[selLength - 1];

		var allChildren = selection.getCellRef().getElementsByTagName("span");
		if (allChildren.length > 0) {
			for (var i = 0; i < allChildren.length; i++) {
				var span = allChildren[i];
				if (span.getAttribute("tabindex") != null && span.style.visibility != "hidden") {
					span.focus();
				}
			}
		}
	}
}

function CContextMenu_hide() {
	this.m_contextMenu.remove();
}

function CContextMenu_hideDownloadChartMenuItem() {
	this.m_downloadChart.hide();
	this.m_downloadChartSeperator.hide();
}

function CContextMenu_showDownloadChartMenuItem() {
	this.m_downloadChart.show();
	this.m_downloadChartSeperator.show();
}

function CContextMenu_update(subject)
{
	if(subject instanceof CSelectionController)
	{
		this.subject = subject;

		var sBlacklist = this.m_mainWnd.getUIHide();

		var oDrillMgr = this.getCV().getDrillMgr();
		if(oDrillMgr)
		{
			if (this.getCV().envParams["ui.action"] != "view")
			{
				var oGotoMenuItem = this.getGoToMenuItem();
				var oMenu = oGotoMenuItem.getMenu();
				if(oMenu)
				{
					// when the selection changes clear out the cached report drill targets (if any)
					oMenu.clear();
				}

				if (!subject.getSelectionBasedFeaturesEnabled() || sBlacklist.indexOf(' RV_CONTEXT_MENU_GOTO ') != -1) {
					oGotoMenuItem.hide();
				}

				var oDrillDownMenuItem = this.getDrillDownMenuItem();
				if (sBlacklist.indexOf(' RV_CONTEXT_MENU_DRILL_DOWN ') != -1)
				{
					oDrillDownMenuItem.hide();
				}
				else if(oDrillMgr.canDrillDown())
				{ 
					this.updateDrillMenu(oDrillDownMenuItem, "DrillDown");
					oDrillDownMenuItem.enable();
				}
				else
				{
					if (!subject.getSelectionBasedFeaturesEnabled()) {
						oDrillDownMenuItem.hide();
					} else {
						oDrillDownMenuItem.disable();
					}
				}

				var oDrillUpMenuItem = this.getDrillUpMenuItem();
				if (sBlacklist.indexOf(' RV_CONTEXT_MENU_DRILL_UP ') != -1)
				{
					oDrillUpMenuItem.hide();
				}
				if(oDrillMgr.canDrillUp())
				{
					this.updateDrillMenu(oDrillUpMenuItem, "DrillUp");
					oDrillUpMenuItem.enable();
				}
				else
				{
					if (!subject.getSelectionBasedFeaturesEnabled()) {
						oDrillUpMenuItem.hide();
						gMenuSeperator.hide();
					} else {
						oDrillUpMenuItem.disable();
					}
				}
				
				if(this.m_expand) {
					this.getCV().canExpand() ? this.m_expand.enable() : this.m_expand.disable();
				}
				
				if(this.m_collapse) {
					this.getCV().canCollapse() ? this.m_collapse.enable() : this.m_collapse.disable();
				}				
			}

			if (sBlacklist.indexOf(' RV_CONTEXT_MENU_DOWNLOAD_CHART ') != -1)
			{
				this.hideDownloadChartMenuItem();
			}
			else
			{
				if(!subject.hasSelectedChartNodes())
				{
					if (!subject.getSelectionBasedFeaturesEnabled()) {
						this.hide();

					} else {
						this.hideDownloadChartMenuItem();
					}
				}
				else
				{
					this.showDownloadChartMenuItem();
				}
			}
		}

		var bContext = false;
		if(this.m_lineageItem || this.m_glossaryItem)
		{
			var selections = subject.getAllSelectedObjects();
			if(selections != null && selections.length > 0)
			{
				for (var i=0; i < selections.length; i++)
				{
					if (selections[i].hasContextInformation())
					{
						bContext = true;
						break;
					}
				}
			}
		}

		this.updateFreezeHeadings();
		
		if (this.m_glossaryItem && bContext && this.getCV().envParams["glossaryURI"] != null && this.getCV().envParams["glossaryURI"] != "")
		{
			this.m_glossaryItem.enable();
		}
		else if (this.m_glossaryItem)
		{
			this.m_glossaryItem.disable();
		}

		if (this.m_lineageItem && bContext)
		{
			this.m_lineageItem.enable();
		}
		else if (this.m_lineageItem)
		{
			this.m_lineageItem.disable();
		}
	}

}

/**
 * Uses the DrillContextMenuHelper to get the JSON for the drill sub menus and then uses the
 * information found in the JSON to create old school menus for the CC Viewer (CMenuItem). 
 */
CContextMenu.prototype.updateDrillMenu = function(oButton, sAction)
{
	oButton.clearCascadedMenu();
	var tempJson = {};
	DrillContextMenuHelper.updateDrillMenuItems(tempJson, this.getCV(), sAction);
	if (tempJson.items) {
		var drillItems = tempJson.items;
		var drillMenu = oButton.createCascadedMenu(gMenuStyle);
		var sWebContentRoot = this.getCV().getWebContentRoot();
		var sSkin = this.m_mainWnd.getCV().getSkin();
		for (var i=0; i < drillItems.length; i++) {
			var drillItem = drillItems[i];
			if (drillItem.separator) {
				// make sure we don't end with a seperator
				if (i < (drillItems.length - 1)) {
					drillMenu.add(gMenuSeperator);
				}
			}
			else {
				// The only menus only accept a string for the action, so build up the correct payload string
				var userSelectedDrillItem = drillItem.action && drillItem.action.payload && drillItem.action.payload.userSelectedDrillItem ? drillItem.action.payload.userSelectedDrillItem : "";
				var payload = userSelectedDrillItem ? "{\"userSelectedDrillItem\" : \"" + userSelectedDrillItem + "\"}" : "{}";
				
				if (sAction == "DrillDown") {
					new CMenuItem(drillMenu, drillItem.label, this.getCVObjectRef() + ".getDrillMgr().rvDrillDown(" + payload  + ");", "", gMenuItemStyle, sWebContentRoot, sSkin);
				}
				else {
					new CMenuItem(drillMenu, drillItem.label, this.getCVObjectRef() + ".getDrillMgr().rvDrillUp(" + payload  + ");", "", gMenuItemStyle, sWebContentRoot, sSkin);				
				}
			}
		}
	}	
};

function CContextMenu_updateSubscriptionContextMenuItem()
{
	var sBlacklist = this.m_mainWnd.getUIHide();

	var subsMan = this.getCV().getSubscriptionManager();
	if (sBlacklist.indexOf(' RV_CONTEXT_MENU_ALERT_USING_NEW_WATCH_RULE ') != -1 && this.m_subscription)
	{
		this.m_subscription.hide();
	}
	else if (subsMan && this.m_subscription && subsMan.CanCreateNewWatchRule())
	{
		this.m_subscriptionSeperator.show();
		this.m_subscription.show();
		if (subsMan.IsValidSelectionForNewRule())
		{
			this.m_subscription.enable();
		}
		else
		{
			this.m_subscription.disable();
		}
	}
	else if (this.m_subscription)
	{
		this.m_subscriptionSeperator.hide();
		this.m_subscription.hide();
	}
}

CContextMenu.prototype.draw = CContextMenu_draw;
CContextMenu.prototype.hide = CContextMenu_hide;
CContextMenu.prototype.closeMenuTabEvent = CContextMenu_closeMenuTabEvent;
CContextMenu.prototype.getDrillUpMenuItem = CContextMenu_getDrillUpMenuItem;
CContextMenu.prototype.getDrillDownMenuItem = CContextMenu_getDrillDownMenuItem;
CContextMenu.prototype.getGoToMenuItem = CContextMenu_getGoToMenuItem;
CContextMenu.prototype.hideDownloadChartMenuItem = CContextMenu_hideDownloadChartMenuItem;
CContextMenu.prototype.showDownloadChartMenuItem = CContextMenu_showDownloadChartMenuItem;
CContextMenu.prototype.update = CContextMenu_update;
CContextMenu.prototype.updateSubscriptionContextMenuItem = CContextMenu_updateSubscriptionContextMenuItem;

function CReportHistory(mainWnd, stack_idx, reportName, params)
{
	this.m_mainWnd = mainWnd;
	this.m_stack_idx = stack_idx;
	this.m_reportName = "";

	if(typeof reportName == "undefined" || reportName == null || reportName.length == 0)
	{
		if(typeof mainWnd != "undefined" && mainWnd != null)
		{
			 var previousReport = RV_RES.RV_PREVIOUS_REPORT;
			 this.m_reportName = previousReport;
		}
	}
	else
	{
		this.m_reportName = reportName;
	}


	this.m_params = params;
}

CReportHistory.prototype.getDropDownMenuIcon = function()
{
	var sIcon = "/ps/portal/images/";

	if(this.m_params["ui.action"] == "view")
	{
		sIcon += "icon_result_";
		if(this.m_params["ui.format"] == "PDF")
		{
			sIcon += "pdf.gif";
		}
		else
		{
			sIcon += "html.gif";
		}
	}
	else
	{
		sIcon += "action_run.gif";
	}

	return sIcon;
};

CReportHistory.prototype.addParamNode = function(previousReportNode, sName, sValue)
{
	var paramNode = previousReportNode.ownerDocument.createElement("param");
	previousReportNode.appendChild(paramNode);

	paramNode.setAttribute("name", sName);
	paramNode.appendChild(previousReportNode.ownerDocument.createTextNode(sValue));

};

CReportHistory.prototype.saveAsXML = function(previousReportsNode)
{
	var previousReportNode = previousReportsNode.ownerDocument.createElement("previousReport");
	previousReportsNode.appendChild(previousReportNode);

	for(var paramName in this.m_params)
	{
		this.addParamNode(previousReportNode, paramName, this.m_params[paramName]);
	}

	this.addParamNode(previousReportNode, "ui.name", this.getReportName());
};

CReportHistory.prototype.getIdx = function()
{

	return this.m_stack_idx;
};

CReportHistory.prototype.getReportName = function()
{
	return this.m_reportName;
};

CReportHistory.prototype.getParameters = function()
{
	return this.m_params;
};


CReportHistory.prototype.createRequestForm = function()
{

	var oCV = this.m_mainWnd.getCV();

	var formWarpRequest = document.getElementById("formWarpRequest" + oCV.getId());

	// build a form and submit it.
	var form = document.createElement("form");

	form.setAttribute("id", "previousReport");
	form.setAttribute("name", "previousReport");
	form.setAttribute("target", formWarpRequest.getAttribute("target") ? formWarpRequest.getAttribute("target") : "");
	form.setAttribute("method", "post");
	form.setAttribute("action", formWarpRequest.getAttribute("action"));
	form.style.display = "none";

	document.body.appendChild(form);

	for(var paramName in this.m_params)
	{
		if(paramName != "m_tracking")
		{
			form.appendChild(createHiddenFormField(paramName, this.m_params[paramName]));
		}
	}

	for(var cvParam in oCV.envParams)
	{
		if( cvParam.indexOf("cv.") == 0  && cvParam != "cv.previousReports" && cvParam != "m_tracking" && cvParam != "cv.actionState")
		{
			form.appendChild(createHiddenFormField(cvParam, oCV.envParams[cvParam]));
		}
	}

	if(this.getIdx() > 0)
	{
		this.m_mainWnd.m_reportHistoryList = this.m_mainWnd.m_reportHistoryList.slice(0, this.getIdx());
		form.appendChild(createHiddenFormField("cv.previousReports",this.m_mainWnd.saveReportHistoryAsXML()));
	}


	form.appendChild(createHiddenFormField("ui.name", this.getReportName()));

	form.appendChild(createHiddenFormField("b_action", "cognosViewer"));

	var formWarpRequestInputs = formWarpRequest.getElementsByTagName("INPUT");
	for (var index = 0; index < formWarpRequestInputs.length; ++index)
	{
		if(typeof form[formWarpRequestInputs[index].name] == "undefined" && formWarpRequestInputs[index].name != "cv.previousReports" && formWarpRequestInputs[index].name.length > 0)
		{
			form.appendChild(createHiddenFormField(formWarpRequestInputs[index].name, formWarpRequestInputs[index].value));
		}
	}

	return form;
};

CReportHistory.prototype.execute = function()
{
	var oCV = this.m_mainWnd.getCV();

	if(typeof oCV.m_viewerFragment != "undefined")
	{
		var oRequest = new ViewerDispatcherEntry(oCV);
		oRequest.addFormField("ui.action", this.m_params["ui.action"]);
		for(var paramName in this.m_params)
		{
			if(paramName != "ui.action" && paramName != "m_tracking" && paramName != "cv.actionState")
			{
				oRequest.addFormField(paramName, this.m_params[paramName]);
			}
		}

		if(this.getIdx() > 0)
		{
			this.m_mainWnd.m_reportHistoryList = this.m_mainWnd.m_reportHistoryList.slice(0, this.getIdx());
			oRequest.addFormField("cv.previousReports",this.m_mainWnd.saveReportHistoryAsXML());
		}
		else
		{
			oRequest.removeFormField("cv.previousReports");
		}
		
		if (this.m_reportName && this.m_reportName.length > 0) {
			oRequest.addFormField("ui.name", this.m_reportName);
		}

		oRequest.addFormField("cv.responseFormat", "fragment");
		oRequest.addFormField("cv.ignoreState", "true");
		oRequest.addFormField("cv.id", "_THIS_");
		oRequest.addFormField("m_tracking", "");
		oCV.dispatchRequest(oRequest);
	}
	else
	{
		var form = this.createRequestForm();
		form.submit();
	}

};

/**
	Contains function specific to Cognos Viewer clients.
	@param CCognosViewer oCV reference to the CCognosViewer instance using this class.
*/
function CViewerManager(oCV)
{
	this.setCV(oCV);
}

CViewerManager.prototype = new CViewerHelper();

CViewerManager.prototype.Print = function() {
	var savedOutputIframe = document.getElementById("CVIFrame" + this.getCVId());

	if (savedOutputIframe) {
		if(isIE()) {
			savedOutputIframe.contentWindow.document.execCommand("print", true, null);
		} else {
			savedOutputIframe.focus();
			savedOutputIframe.contentWindow.print();
		}
	}
	
	// reset focus back to the print toolbar button
	var cv = this.getCV();
	var mainWnd = cv.rvMainWnd;
	var toolbarCtrl = mainWnd.getToolbarControl();

	if (typeof toolbarCtrl != "undefined" && toolbarCtrl != null) {
		var printButton = toolbarCtrl.getItem("print");
		if (printButton) {
			printButton.setFocus();
		}
	}
};

CViewerManager.prototype.DownloadReport = function()
{
	var theURL="";
	var f = document.forms["formWarpRequest" + this.getCVId()];
	theURL += 'b_action=xts.run&m=portal/download.xts&m_obj=';
	theURL += f["ui.object"].value;
	theURL += '&m_name=';
	theURL += f["ui.name"].value;
	if (f["ui.format"] && f["ui.format"].value)
	{
		theURL += '&format=';
		theURL += f["ui.format"].value;
	}

	theURL = constructGETRequestParamsString(theURL);

	theURL = f.action + '?' + theURL;

	location.href = theURL;
};

CViewerManager.prototype.SaveReport = function(bWaitPage)
{
	var oCV = this.getCV();
	var oReq = new ViewerDispatcherEntry(oCV);

	// don't want to show a full working dialog
	oReq.setWorkingDialog(null);

	oReq.addFormField("ui.action", "save");

	if(!bWaitPage) {
		oReq.addFormField("run.continueConversation", "true");
	}
	else {
		this.getCV().closeActiveHTTPConnection();
		if (oCV.getWorkingDialog()) {
			oCV.getWorkingDialog().hide();
		}
		this.getCV().setKeepSessionAlive(true);

		oReq.addFormField("run.continueConversation", "false");

		var callback = GUtil.generateCallback(executeBackURL, [this.getCV().getId()], null);
		oReq.setCallbacks( {
			"complete" : {"method" : callback}
		});
	}

	oReq.addFormField("run.saveOutput", "true");

	this.getCV().dispatchRequest(oReq);
};



CViewerManager.prototype.SaveAsReportView = function(bWaitPage)
{
	var formWarpRequest = document.getElementById("formWarpRequest" + this.getCVId());
	if(formWarpRequest)
	{
		var bContinueConversation = !bWaitPage;
		var formFields = {"m":"portal/viewer-saveAs.xts"};
		formFields["run.continueConversation"] = bContinueConversation;
		formFields["initializeSave"] = "true";
		formFields["ui.object"] = formWarpRequest["ui.object"].value;
		formFields["ui.backURL"] = formWarpRequest["ui.backURL"].value;
		formFields["ui.routingServerGroup"] = this.getRoutingServerGroup();
		cvLoadDialog(this.getCV(), formFields, 600, 425, RV_RES.IDS_JS_SAVE_AS_REPORT_VIEW_IFRAME_TITLE);
	}
};

CViewerManager.prototype.init = function(oProperties)
{
	if (oProperties && typeof oProperties == "object")
	{
		for (var sProp in oProperties)
		{
			this[sProp] = oProperties[sProp];
		}
	}
};

CViewerManager.prototype.SendReport = function(bWaitPage)
{
	var bContinueConversation = !bWaitPage;
	var formFields = {"m":"portal/viewer-email.xts"};
	formFields["run.continueConversation"] = bContinueConversation;
	formFields["ui.routingServerGroup"] = this.getRoutingServerGroup();
	cvLoadDialog(this.getCV(), formFields, 800, 550, RV_RES.IDS_JS_EMAIL_REPORT_IFRAME_TITLE);
};

CViewerManager.prototype.validatePromptControls = function()
{
	// prompting validation (cleans up controls state)
	if(typeof this.getCV().preProcessControlArray != "undefined" && typeof preProcessForm != "undefined") {
		preProcessForm(this.getCV().preProcessControlArray);
	}
};

CViewerManager.prototype.RunReport = function()
{
	this.validatePromptControls();

	var oReq = null;

	var sSearchPath = this.getCV().envParams["ui.object"];
	var sSpecification = this.getCV().envParams["ui.spec"];
	var sAction = this.getCV().envParams["ui.action"];
	var formWarpRequest = document.forms["formWarpRequest" + this.getCVId()];

	if(sSpecification != null && sSpecification != "")
	{
		oReq = new ViewerDispatcherEntry(this.getCV());
		oReq.addFormField("ui.action", "runSpecification");
		oReq.addFormField("ui.spec", sSpecification);

		var sSpecificationType = this.getCV().envParams["specificationType"];
		if(sSpecificationType != null)
		{
			oReq.addFormField("specificationType", sSpecificationType);
		}
	}
	else if(sSearchPath != null && sSearchPath != "")
	{
		if (this.getCV().isBux)
		{
			oReq = new ViewerDispatcherEntry(this.getCV());
			oReq.addFormField("ui.action", "bux");
		}
		else
		{
			oReq = new ViewerDispatcherEntry(this.getCV());
			oReq.addFormField("ui.action", "run");
		}

		// If we're doing a view, get the "re-run" search path.
		// The search path associated with a view is not a search path that we would use on a run ie (defaultOutput(...))
		if(sAction == "view")
		{
			if (this.getCV().envParams["ui.reRunObj"])
			{
				sSearchPath = this.getCV().envParams["ui.reRunObj"];
			}
			else if (typeof formWarpRequest["reRunObj"] != "undefined" && formWarpRequest["reRunObj"] != null)
			{
				sSearchPath = formWarpRequest["reRunObj"].value;
			}
		}
		oReq.addFormField("ui.object", sSearchPath);
	}

	oReq.addFormField("run.outputFormat", this.getCV().rvMainWnd.getCurrentFormat());
	oReq.addFormField("ui.primaryAction","");

	var promptOnRerun = this.getCV().envParams["promptOnRerun"];
	if (promptOnRerun != null)
	{
		oReq.addFormField("run.prompt", promptOnRerun);
	}
	else
	{
		oReq.addFormField("run.prompt", "true");
	}

	this.getCV().preparePromptValues(oReq);

	this.getCV().dispatchRequest(oReq);

};

CViewerManager.prototype.viewReport = function(format)
{
	if(this.getCV().rvMainWnd.getCurrentFormat() == format)
	{
		return;
	}

	var f = document.forms["formWarpRequest" + this.getCVId()];
	if(f["ui.action"].value == 'view')
	{
		this.viewOutput(format);
	}
	else
	{
		var oReq = new ViewerDispatcherEntry(this.getCV());
		oReq.addFormField("ui.action", "render");
		oReq.addFormField("run.outputFormat", format);

		if( this.isExcelFormat(format))
		{
			this.viewInExcel(oReq);
		}
		else if (this.getCV().isAccessibleMode() && format == 'PDF')
		{
			this.viewPDFInNewWindow(oReq);
		}		
		else if (isSafari() && format == 'PDF')
		{
			oReq.addFormField("ui.reuseWindow", "true");
			this.viewPDFInNewWindow(oReq);
		}
		else
		{
			this.getCV().deleteTabs();

			this.getCV().dispatchRequest(oReq);
		}
	}
};

CViewerManager.prototype.isExcelFormat = function(format)
{
	if(format == 'xlsxData' || format == 'XLS' || format == 'CSV' || format == 'XLWA' || format == 'singleXLS' || format == 'spreadsheetML')
	{
		return true;
	}
	return false;
};

CViewerManager.prototype.viewOutput = function(format)
{
	var oFWR = document.forms["formWarpRequest" + this.getCVId()];
	var oReq = new ViewerDispatcherEntry(this.getCV());
	oReq.addFormField("ui.action", "view");
	oReq.addFormField("cv.responseFormat", "view");
	oReq.addFormField("ui.format", format);

	var sObject = "";
	switch(format)
	{
		case "HTML":
			sObject = this.getCV().oOutputFormatPath.HTML;
			break;
		case "PDF":
			sObject = this.getCV().oOutputFormatPath.PDF;
			break;
		case "singleXLS":
			sObject = this.getCV().oOutputFormatPath.singleXLS;
			break;
		case "XLS":
			sObject = this.getCV().oOutputFormatPath.XLS;
			break;
		case "XLWA":
			sObject = this.getCV().oOutputFormatPath.XLWA;
			break;
		case "CSV":
			sObject = this.getCV().oOutputFormatPath.CSV;
			break;
		case "XML":
			sObject = this.getCV().oOutputFormatPath.XML;
			break;
		case "spreadsheetML":
			sObject = this.getCV().oOutputFormatPath.spreadsheetML;
			break;
		case "xlsxData":
			sObject = this.getCV().oOutputFormatPath.xlsxData;
			break;
	}

	if (sObject)
	{
		oReq.addFormField("ui.object", sObject);
	}

	oReq.addFormField("reRunObj", oFWR.reRunObj.value);
	oReq.addFormField("ui.format", format);
	oReq.addFormField("ui.name", oFWR["ui.name"].value);

	if( this.isExcelFormat(format))
	{
		this.viewInExcel(oReq);
	}
	else if (this.getCV().isAccessibleMode() && format == 'PDF')
	{
		this.viewPDFInNewWindow(oReq);
	}
	else if (isSafari() && format == 'PDF')
	{
		oReq.addFormField("ui.reuseWindow", "true");
		this.viewPDFInNewWindow(oReq);
	}
	else
	{
		this.getCV().dispatchRequest(oReq);
	}
};

CViewerManager.prototype.viewPDFInNewWindow = function(oReq)
{
	this.viewInNewWindow(oReq, __pdf_win);
};

CViewerManager.prototype.viewInExcel = function(oReq)
{
	this.viewInNewWindow(oReq, __excel_win);
};

CViewerManager.prototype.viewInNewWindow = function(oReq, browserHandle)
{
	var oldUnload=window.onbeforeunload;
	window.onbeforeunload=null;

	if (browserHandle != null) {
		browserHandle.close();
	}
	var target = "winNAT_" + ( new Date() ).getTime();
	var sPath = this.getCV().getWebContentRoot() + "/" + "rv/blankNewWin.html?cv.id=" + this.getCVId();

	var sFormID = "viewForm" + this.getCVId();
	var oForm = document.getElementById(sFormID);
	if (oForm) {
		oForm.parentNode.removeChild(oForm);
	}

	oForm = document.createElement("form");
	oForm.setAttribute("method", "post");
	oForm.setAttribute("id", sFormID);
	oForm.setAttribute("action", this.getCV().getGateway());
	oForm.style.display = "inline";

	var oFWR = document["formWarpRequest" + this.getCVId()];
	if (oFWR && oFWR["run.outputFormat"]) {
		oReq.addFormField("previousFormat", oFWR["run.outputFormat"].value);
	}


	var formFieldNames = oReq.getFormFields().keys();
	for (var index = 0; index < formFieldNames.length; index++)
	{
		var name = formFieldNames[index];

		// we'll force the action and respons format later on so we don't indirectly send this request to the fragment server
		// since we're now doing a render, don't pass along the tracking. We still need to pass the
		// conversation since we want to reuse the parameters and options
		if(name != "cv.responseFormat" && name != "b_action" && name != "m_tracking")
		{
			oForm.appendChild(createHiddenFormField(name, oReq.getFormField(name)));
		}
	}

	oForm.appendChild(createHiddenFormField("cv.responseFormat", "page"));
	oForm.appendChild(createHiddenFormField("b_action", "cognosViewer"));
	oForm.appendChild(createHiddenFormField("BIline1", RV_RES.RV_RUNNING));
	oForm.appendChild(createHiddenFormField("BIline2", RV_RES.RV_PLEASE_WAIT));
	if (this.getCV().envParams['ui.name']) {
		oForm.appendChild(createHiddenFormField("ui.name", this.getCV().envParams['ui.name']));
	}

	document.body.appendChild(oForm);
	oForm.target = target;

	browserHandle = window.open(sPath, target, "rv");

	window.onbeforeunload=oldUnload;
};

/* drill through functions */

CViewerManager.prototype.cancel = function()
{
	var oCV = this.getCV();
	oCV.cancel();
};

//take an input string and convert it into
//xml friendly entity references
CViewerManager.prototype.sXmlEncode = function(sInputString)
{
	var sOutputString = "" + sInputString;

	if ((sOutputString == '0') || ((sInputString != null) && (sInputString != false)))
	{
		//&amp;
		sOutputString = sOutputString.replace(/&/g, "&amp;");
		//&lt;
		sOutputString = sOutputString.replace(/</g, "&lt;");
		//&gt;
		sOutputString = sOutputString.replace(/>/g, "&gt;");
		//&quot;
		sOutputString = sOutputString.replace(/"/g, "&quot;");
		//&apos;
		sOutputString = sOutputString.replace(/'/g, "&apos;");
	}

	else if (sInputString == null)
	{
		//return empty string if the value is null or false
		sOutputString = "";
	}

	return sOutputString;
};

CViewerManager.prototype.exit = function(callback)
{
	var form = document.getElementById("formWarpRequest" + this.getCVId());
	var oCV = this.getCV();

	// In the case of a view, and there are no previous reports opened, just execute the back URL.
	if(form && form["ui.action"] && form["ui.action"].value == "view" && callback)
	{
		executeBackURL(this.getCVId());
	}
	else if(oCV.getKeepSessionAlive() == false)
	{
		oCV.exit(callback);
	}
};


function executeBackURL(s_CVId)
{
	var sCVId = "";
	if (s_CVId) {
		sCVId = s_CVId;
	}

	// we never want to execute a backURL if we're in BUX.
	if (window["oCV" + sCVId] && window["oCV" + sCVId].isBux)
	{
		return false;
	}

	var form = document.getElementById("formWarpRequest" + sCVId);
	if(form["ui.backURL"].value.length < 2048)
	{
		// if the back url is less than the 2kb limit imposed by IE, do a location.href
		document.location.href = form["ui.backURL"].value;
		return;
	}

	var backURL = decodeURIComponent(form["ui.backURL"].value);
	var URLandParameters = backURL.split("?");
	var backURLForm = document.createElement("form");

	backURLForm.style.display = "none";
	backURLForm.setAttribute("method", "post");
	backURLForm.setAttribute("action", URLandParameters[0]);
	backURLForm.setAttribute("target", "_self");

	var parameterList = URLandParameters[1].split("&"); // must be ampersand symbol

	for(var nextParameter = 0; nextParameter < parameterList.length; nextParameter++)
	{
		// We cannot use "split" here using "=" because there are "=" within the parameters
		// that must be kept.
		var equalsIndexPos = parameterList[nextParameter].indexOf("=");
		var parameterName = parameterList[nextParameter].substr(0, equalsIndexPos);
		var parameterValue = parameterList[nextParameter].substr(equalsIndexPos + 1);

		var urlFormField = document.createElement("input");
		urlFormField.setAttribute("type", "hidden");
		urlFormField.setAttribute("name", decodeURIComponent(parameterName));
		urlFormField.setAttribute("value", decodeURIComponent(parameterValue));

		backURLForm.appendChild(urlFormField);
	}

	document.body.appendChild(backURLForm);
	backURLForm.submit();
}

CViewerManager.prototype.getRoutingServerGroup = function()
{
	var oCV = this.getCV();
	if(oCV.envParams["ui.routingServerGroup"])
	{
		return oCV.envParams["ui.routingServerGroup"];
	}

	return "";
};

CViewerManager.prototype.launchQS = function()
{
	var formWarpRequest = document.forms["formWarpRequest" + this.getCVId()];

	// check to see if we're a fragment. If so, launch query studio in a new window
	var oCV = this.getCV();
	if(typeof oCV.m_viewerFragment != "undefined")
	{
		cognosLaunchInWindow("","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480",
							 "ui.gateway", formWarpRequest.action,
							 "ui.tool", "QueryStudio",
							 "ui.action", "edit",
							 "ui.object", formWarpRequest["ui.object"].value,
							 "ui.routingServerGroup", this.getRoutingServerGroup()); //TODO Support views
	}
	else
	{
		cognosLaunch("ui.gateway", formWarpRequest.action,
					 "ui.tool", "QueryStudio",
					 "ui.action", "edit",
					 "ui.object", formWarpRequest["ui.object"].value,
					 "ui.backURL", formWarpRequest["ui.backURL"].value,
					 "ui.routingServerGroup", this.getRoutingServerGroup());
	}
};

CViewerManager.prototype.launchAS = function()
{
	var formWarpRequest = document.forms["formWarpRequest" + this.getCVId()];
	cognosLaunchInWindow("","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480",
						 "ui.gateway", formWarpRequest.action,
						 "ui.tool", "AnalysisStudio",
						 "ui.action", "edit",
						 "ui.object", formWarpRequest["ui.object"].value,
						 "ui.routingServerGroup", this.getRoutingServerGroup()); //TODO Support views
};

CViewerManager.prototype.launchRS = function()
{
	var formWarpRequest = document.forms["formWarpRequest" + this.getCVId()];
	cognosLaunchInWindow("_blank","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480",
						 "ui.gateway", formWarpRequest.action,
						 "ui.tool","ReportStudio",
						 "ui.action","edit",
						 "ui.profile", "Professional",
						 "ui.object",formWarpRequest["ui.object"].value,
						 "ui.routingServerGroup", this.getRoutingServerGroup());//TODO Support views
};

CViewerManager.prototype.returnHome = function(url)
{
	var formWarpRequest = document.forms["formWarpRequest" + this.getCVId()];
	formWarpRequest["ui.backURL"].value = url;
	executeBackURL(this.getCVId());
};

CViewerManager.prototype.doPostBack = function()
{
	var f = document.forms["formWarpRequest" + this.getCVId()];
	f.appendChild(createHiddenFormField("b_action", "xts.run"));
	f.appendChild(createHiddenFormField("m", f["ui.postBack"].value));
	f.submit();
};

CViewerManager.prototype.hideAbout = function()
{
	this.getCV().removeTransparentBackgroundLayer();
	var cvId = this.getCV().getId();
	if (document.getElementById("viewerAboutDiv" + cvId))
	{
		document.getElementById("viewerAboutDiv" + cvId).parentNode.removeChild(document.getElementById("viewerAboutDiv" + cvId));
	}

	if (document.getElementById("viewerAboutIframe" + cvId))
	{
		document.getElementById("viewerAboutIframe" + cvId).parentNode.removeChild(document.getElementById("viewerAboutIframe" + cvId));
	}
};

function viewerAboutOnKeyDown(evt)
{
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	var srcNode = getCrossBrowserNode(evt);

	if (evt.keyCode == "13" || evt.keyCode == "27" || evt.keyCode == "32") // enter, esc or space
	{
		var oCV = window["oCV" + srcNode.getAttribute("viewerId")];
		oCV.m_oCVMgr.hideAbout();
		return stopEventBubble(evt);
	}
}
CViewerManager.prototype.fileExist = function( fileURL )
{
	var http = null

	if (window.XMLHttpRequest) {
		http = new XMLHttpRequest();
	}
	else {
		http = new ActiveXObject("Msxml2.XMLHTTP");
	}
	
	http.open( 'HEAD', fileURL, false);
	http.send();
	return ( http.status == 200 );
}

CViewerManager.prototype.getAboutBoxImageURL = function()
{
	var aboutImgFileName = 'about_' + this.getCV().getProductLocale() + '.jpg';
	var srcDirectory = this.getCV().getWebContentRoot() + '/rv/images/';
	var fileURL = srcDirectory + aboutImgFileName;

	if( !this.fileExist(fileURL) )
	{
	 	fileURL = srcDirectory + 'about_en.jpg' ;
	}

	return fileURL;
}

CViewerManager.prototype.about = function()
{
	if (document.getElementById("viewerAbout" + this.getCV().getId()))
	{
		this.hideAbout();
	}

	this.getCV().createTransparentBackgroundLayer();

	var iAboutWidth = 650;
	var iAboutHeight = 522;
	
	var iframe = document.createElement("iframe");
	iframe.id = "viewerAboutIframe" + this.getCV().getId();
	iframe.style.position = "absolute";
	iframe.style.zIndex = 99;
	iframe.style.width = iAboutWidth + "px";
	iframe.style.height = iAboutHeight + "px";
	iframe.setAttribute("src", this.getCV().getWebContentRoot() + '/common/blank.html');
	iframe.setAttribute("scrolling",'no');
	iframe.setAttribute("frameborder",'0');
	iframe.setAttribute("title", RV_RES.IDS_JS_MODAL_BACK_IFRAME);
	iframe.setAttribute("role", "presentation");
	document.body.appendChild(iframe);

	var id = this.getCV().getId();

	// div to catch Shift-Tab and place the focus on the OK button
	var divTabCatchBefore = document.createElement("div");
	divTabCatchBefore.tabIndex = 0;
	divTabCatchBefore.onfocus = function() {document.getElementById("viewerAboutOK" + id).focus();};
	document.body.appendChild(divTabCatchBefore);

	var div = document.createElement("div");
	div.id = "viewerAboutDiv" + this.getCV().getId();
	div.style.position = "absolute";
	div.onkeydown = viewerAboutOnKeyDown;
	div.style.zIndex = 100;
	div.style.width = iAboutWidth + "px";
	div.style.height = iAboutHeight + "px";
	div.style.outline = "none";
	div.setAttribute("role", "dialog");
	div.setAttribute("aria-label", RV_RES.RV_ABOUT_DESCRIPTION);

	var aboutImgURL = this.getAboutBoxImageURL();
	var copyright = RV_RES.RV_ABOUT_DESCRIPTION.replace(/"/g, "&quot;") + RV_RES.IDS_PROP_LEGAL.replace(/"/g, "&quot;");
	div.innerHTML = '<img role="img" id="viewerAbout' + this.getCV().getId() + '" tabIndex="0" alt="' + copyright + '" title="' + copyright + '" src="' + aboutImgURL + '" onclick="' + getCognosViewerObjectString(this.getCV().getId()) + '.m_oCVMgr.hideAbout()"></img>'; 
	div.setAttribute("viewerId", this.getCV().getId());

	document.body.appendChild(div);

	this.createOKButton(div);

	// div to catch tab and place the focus back on the about box
	var divTabCatchAfter = document.createElement("div");
	divTabCatchAfter.tabIndex = 0;
	divTabCatchAfter.onfocus = function() {document.getElementById("viewerAbout" + id).focus();};
	document.body.appendChild(divTabCatchAfter);

	// position the about dialog in the middle of the report
	var iBottom = 0;
	var iLeft = 0;
	if (typeof window.innerHeight != "undefined")
	{
		iBottom = Math.round((window.innerHeight/2) - (iAboutHeight/2));
		iLeft = Math.round((window.innerWidth/2) - (iAboutWidth/2));
	}
	else
	{
		iBottom = Math.round((document.body.clientHeight/2) - (iAboutHeight/2));
		iLeft = Math.round((document.body.clientWidth/2) - (iAboutWidth/2));
	}

	div.style.bottom = iframe.style.bottom = iBottom + "px";
	div.style.left = iframe.style.left = iLeft + "px";

	setTimeout("document.getElementById('viewerAbout" + id + "').focus();", 1);
};

CViewerManager.prototype.createOKButton = function(aboutDiv)
{
	var aboutOK = document.createElement("div");
	aboutOK.style.backgroundcolor="#FFFFFF";
	aboutOK.id = "viewerAboutOK"  + this.getCV().getId();
	aboutOK.setAttribute("role", "button");
	aboutOK.setAttribute("viewerId", this.getCV().getId());
	aboutOK.setAttribute("tabIndex", "0");

	var oCVMgr = this;
	aboutOK.onclick = function() { oCVMgr.hideAbout(); };
	aboutOK.onkeydown = viewerAboutOnKeyDown;
	aboutOK.className = "aboutOkButton";
	aboutDiv.appendChild(aboutOK);

	var span = document.createElement("span");
	span.style.padding = "7px 30px 7px 30px";
	span.appendChild(document.createTextNode(RV_RES.IDS_JS_OK));
	aboutOK.appendChild(span);
};

CViewerManager.prototype.updateUserName = function()
{
	var request = new DataDispatcherEntry(this.getCV());
	request.addFormField("ui.action", "CMRequest");
	request.addFormField("CMRequest", "<CMRequest><searchPath>~</searchPath><properties><property>defaultName</property></properties></CMRequest>");
	request.addFormField("cv.responseFormat", "CMRequest");
	request.addFormField("cv.catchLogOnFault", "true");
	request.addFormField("cv.id", this.getCVId());
	request.setCallbacks( {
		"complete" : {"object" : this, "method" : this.updateUserNameCallback}
	});

	request.setCanBeQueued(true);

	this.getCV().dispatchRequest(request);
};

CViewerManager.prototype.updateUserNameCallback = function(response) {
	var userName = this.getUserNameFromResponse(response);
	if (userName != null)
	{
		var userNameId = "userNameTD" + this.getCVId();

		var userNameTD = document.getElementById(userNameId);
		if (userNameTD != null)
		{
			userNameTD.innerHTML = html_encode(userName);
		}

		var banner = this.getCV().rvMainWnd.getBannerToolbar();
		if (banner)
		{
			for (var iIndex=0; iIndex < banner.getNumItems(); iIndex++)
			{
				if (typeof banner.get(iIndex).getId == "function" && banner.get(iIndex).getId() == userNameId)
				{
					banner.get(iIndex).setText(html_encode(userName));
					break;
				}
			}
		}
	}
};

CViewerManager.prototype.getUserNameFromResponse = function(response)
{
	if (response) {
		var xmlParsedCMresponse = XMLBuilderLoadXMLFromString(response.getResult());

		var defaultName = XMLHelper_FindChildByTagName(xmlParsedCMresponse, "defaultName", true);
		if (defaultName != null)
		{
			var defaultNameValue = XMLHelper_FindChildByTagName(defaultName, "value", false);
			if (defaultNameValue != null)
			{
				return XMLHelper_GetText(defaultNameValue);
			}
		}
	}

	return null;
};

CViewerManager.prototype.getAvailableOutput = function()
{
	var oCV = this.getCV();
	var formWarpRequest = document.getElementById("formWarpRequest" + this.getCVId());

	var request = new JSONDispatcherEntry(this.getCV());
	request.addFormField("ui.action", "getAvailableOutputs");
	request.addFormField("cv.responseFormat", "getAvailableOutputs");
	request.addFormField("ui.object", formWarpRequest["ui.object"].value);
	request.addFormField("ui.reportVersion", formWarpRequest["ui.reportVersion"].value);
	request.addFormField("reRunObj", formWarpRequest["reRunObj"].value);
	request.addFormField("ui.outputLocale", formWarpRequest["ui.outputLocale"].value);
	request.addFormField("ui.burstKey", formWarpRequest["ui.burstKey"].value);
	request.addFormField("cv.id", this.getCVId());

	request.setCallbacks({"complete":{"object":this, "method":this.getAvailableOutputResponseCallback}});

	oCV.dispatchRequest(request);
};

CViewerManager.prototype.getAvailableOutputResponseCallback = function(response)
{
	var oCV = this.getCV();
	oCV.init(response.getJSONResponseObject());
	oCV.rvMainWnd.renderAvailableOutputs();
};

/*
 * Used to perform the log on and log off actions
 */
CViewerManager.prototype.authenticate = function(action, url)
{

	this.exit();
	this.getCV().setKeepSessionAlive(true);

	if (window.delCookie) {
		delCookie('cc_state');
	}

	if (action == 'logon' || action == 'relogon') {
		location.href = url + "&h_CAM_action=logon&m_reload=";
	}

	if (action == 'logoff') {
		location.href = url + "&h_CAM_action=logoff";
	}
};

/*
 * Used to launch CC's new_general.xts
 * @sNewClass - type of object to create
 * @sNewSearchPath - default location to save the new object
 */
CViewerManager.prototype.launchNewGeneral = function(sNewClass, sNewSearchPath)
{
	var formWarpRequest = document.getElementById("formWarpRequest" + this.getCVId());
	if(formWarpRequest)
	{
		var sSearchPath = "";
		if (formWarpRequest["reRunObj"])
		{
			sSearchPath = formWarpRequest["reRunObj"].value;
		}
		else
		{
			sSearchPath = formWarpRequest["ui.object"].value;
		}

		var sBackURL = this.getCV().getGateway() + "?" + constructGETRequestParamsString("b_action=xts.run&m=portal/viewer-closeIframe.xts&cv.id=" + this.getCVId());

		var formFields = {
			"m":"portal/new_general.xts",
			"m_new_class":sNewClass,
			"so.searchPath":sNewSearchPath,
			"m_name":this.getCV().envParams["ui.name"],
			"m_obj_searchPath":sSearchPath,
			"m_obj":sSearchPath};
		formFields["ui.backURL"] = sBackURL;
		cvLoadDialog(this.getCV(), formFields, 500, 425, RV_RES.IDS_JS_ADD_TO_MY_FOLDERS_IFRAME_TITLE);
	}
};

/*
 * Used to add to the user bookmarks. Only available in IE
 */
CViewerManager.prototype.addToBookmarks = function()
{
	var formWarpRequest = document.getElementById("formWarpRequest" + this.getCVId());
	var envParams = this.getCV().envParams;

	var sURLParams = "b_action=cognosViewer";

	for(var envParam in envParams)
	{
		// get all the ui. params except a few
		if (envParam.indexOf("ui.") == 0 && envParam != "ui.primaryAction" && envParam != "ui.backURL" && envParams != "ui.spec" && envParam != "ui.conversation" && envParam != "ui.cafcontextid")
		{
			sURLParams += "&" + envParam + "=";
			if (envParam == "ui.action" && envParams["ui.primaryAction"] != "")
			{
				sURLParams += encodeURIComponent(envParams["ui.primaryAction"]);
			}
			else
			{
				sURLParams += encodeURIComponent(envParams[envParam]);
			}
		}

		// all the run params
		if (envParam.indexOf("run.") == 0)
		{
			sURLParams += "&" + envParam + "=" + encodeURIComponent(envParams[envParam]);
		}
	}

	var sURL = this.getCV().sGateway + "?" + constructGETRequestParamsString(sURLParams);

	var sBookmarkText = "";

	if (formWarpRequest["ui.action"].value == 'view')
	{
		if (typeof envParams['versionName'] != "undefined" && envParams['versionName'] != "")
		{
			sBookmarkText = RV_RES.RV_VIEW_REPORT;
		}
		else
		{
			sBookmarkText = RV_RES.RV_VIEW_RECENT_REPORT;
		}
	}

	if (formWarpRequest["ui.action"].value == 'run')
	{
		sBookmarkText = RV_RES.RV_RUN_REPORT;
	}

	if (sBookmarkText != "")
	{
		sBookmarkText += " - ";
	}

	sBookmarkText += envParams["ui.name"];

	window.external.AddFavorite(sURL, sBookmarkText);
};

function leavingRV()
{
	if (window.gaRV_INSTANCES && window.gaRV_INSTANCES.length)
	{
		for (var idxRV = 0; idxRV < window.gaRV_INSTANCES.length; idxRV++)
		{
			try
			{
				var oCV = window.gaRV_INSTANCES[idxRV];
				if (oCV)
				{
					var oRV = oCV.getRV();
					if (oRV)
					{
						oRV.exit();
					}
				}
			}
			catch (e)
			{
			}
		}
	}
}

function viewerMainKeyPress(evt)
{
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	if (window.gaRV_INSTANCES && window.gaRV_INSTANCES.length)
	{
		for (var idxRV = 0; idxRV < window.gaRV_INSTANCES.length; idxRV++)
		{
			try
			{
				var oCV = window.gaRV_INSTANCES[idxRV];
				if (oCV && oCV.getId() == "_NS_")
				{
					// in firefox the keyCode will always be zero, so use the charCode if it's there. In IE, the charCode is undefined.
					var keyPressed = evt.keyCode;
					if (keyPressed == 0 && typeof evt.charCode != "undefined") {
						keyPressed = evt.charCode;
					}

					// put focus on the report
					if (!oCV.getViewerWidget() && (keyPressed == "64" || keyPressed == "50") && evt.shiftKey == true && evt.ctrlKey == true) { // Ctrl + Shift + 2
						var rvContent = document.getElementById("RVContent" + oCV.getId());
						if (rvContent) {
							rvContent.setAttribute("tabIndex", "-1");
							rvContent.focus();
							return stopEventBubble(evt);
						}
					}
					// put focus on the page navigation
					else if (!oCV.getViewerWidget() && (keyPressed == "78" || keyPressed == "110") && evt.shiftKey == true && evt.ctrlKey == true) { // Ctrl + Shift + n
						var navLinks = document.getElementById("CVNavLinks" + oCV.getId());
						if (navLinks) {
							navLinks.setAttribute("tabIndex", "-1");
							navLinks.focus();
							return stopEventBubble(evt);
						}
					}
				}
			}
			catch (e)
			{
			}
		}
	}
}

var g_ViewerResizeTimer = 0;
function onResizeViewerEvent(evt) {
	// The resize event gets fired a lot when resizing the browser and we don't want to 
	// resize the pinned container on every resize event. Add a 200ms timeout, and if no other
	// resize event is received in that 200 ms then go ahead and resize the pinned containers.
	clearTimeout(g_ViewerResizeTimer);
	g_ViewerResizeTimer = setTimeout(resizePinnedContainers, 200);
}

function constructGETRequestParamsString(urlParams)
{
	if (typeof CAFXSSEncode == "function") {
		// we should encode the part only AFTER ? symbol
		if(urlParams.indexOf('?') >=0 ){
			var aArray = urlParams.split('?');
			//For URL like "?xxxx", aArray[0] is empty JS string
			return aArray[0] + "?" + CAFXSSEncode(aArray[aArray.length-1]);
		}
		//Does not contain ?
		return CAFXSSEncode(urlParams);
	}
	else {
		return urlParams;
	}
}

function sortReportHistoryStackDescending(a,b) {
	return (b.getIdx() - a.getIdx());
}

function sortReportHistoryStackAscending(a,b) {
	return (b.getIdx() - a.getIdx());
}

// Toolbar Styles
gToolbarButtonStyle = new CUIStyle('toolbarButton', 'toolbarButtonOver', 'toolbarButtonPressed', 'toolbarButtonOverPressed', 'toolbarButton');
gToolbarStyle = new CUIStyle('mainViewerHeader3', "", "", "", "");

gBannerButtonStyle = new CUIStyle('bannerToolbarButton', 'bannerToolbarButtonOver', "", "", "");
gBannerToolbarStyle = new CUIStyle('bannerButtonContainer', "", "", "", "");

// Menu Styles
gMenuItemStyle = new CUIStyle('menuItem_normal', 'menuItem_hover', "", "", 'menuItem_disabled');
gMenuStyle = new CUIStyle('clsMenu', "", "", "", "");
gMenuSeperatorStyle = new CUIStyle('menuHorizontalSeperator',"","","","");

// Banner link style
gBannerItemStyle = new CUIStyle('bannerMenuItem','bannerMenuItemOver',"","","");

// Static Text
gBannerStaticText = new CUIStyle('bannerText',"","","","");

// Link
gBannerLink = new CUIStyle('bannerLink','bannerLink',"","","");

// Context Menu Seperator
gMenuSeperator = new CSeperator('horizontal_line', '1',gMenuSeperatorStyle);

// Toolbar Seperator
gToolbarSeperator = new CSeperator("horizonal_blank", "5");


function CMainWnd(oCV)
{
	this.setCV(oCV);
	this.m_contextMenu = null;
	this.m_reportHistoryList = [];
	this.m_currentFormat = "";
	this.m_toolbar = null;
	this.m_bannerToolbar = null;
	this.m_browserHistoryIndex = history.length;
	this.m_showContextMenuOnClick = false;
	
	if (oCV.getConfig && oCV.getConfig()) {
		var eventsConfig = oCV.getConfig().getEventsConfig();
		this.m_showContextMenuOnClick = eventsConfig ? eventsConfig.getShowContextMenuOnClick() : false;
	}
}

CMainWnd.prototype = new CViewerHelper();

CMainWnd.prototype.setBannerToolbar = function(bannerToolbarSpecification)
{
	this.m_bannerToolbar = new CViewerToolbar();
	this.m_bannerToolbar.init(bannerToolbarSpecification);
};

CMainWnd.prototype.getBannerToolbar = function()
{
	if (this.m_bannerToolbar)
	{
		return this.m_bannerToolbar.getCBar();
	}

	return null;
};

CMainWnd.prototype.closeContextMenuAndToolbarMenus = function() {
	var toolbar = this.getToolbar();
	if (toolbar) {
		toolbar.closeMenus();
	}
	
	var cm = this.getContextMenu();
	if (cm) {
		cm.m_contextMenu.remove();
	}
};

CMainWnd.prototype.setToolbar = function(toolbarSpecification)
{
	this.m_toolbar = new CViewerToolbar();
	this.m_toolbar.init(toolbarSpecification);
};

CMainWnd.prototype.getToolbar = function()
{
	if (this.m_toolbar)
	{
		return this.m_toolbar.getCBar();
	}

	return null;
};

CMainWnd.prototype.getToolbarControl = function()
{
	return this.m_toolbar;
};

CMainWnd.prototype.setCurrentFormat = function(sFormat)
{
	this.m_currentFormat = sFormat;
};

CMainWnd.prototype.updateToolbar = function(sFormat)
{
	this.updateCurrentFormat(sFormat, this.getCV().getWebContentRoot());
	this.updateKeepThisVersion();
};


CMainWnd.prototype.updateKeepThisVersion = function()
{
	if (this.getCV().getStatus() == 'complete')
	{
		var secondaryRequests = this.getCV().getSecondaryRequests();

		var bSave = false;
		var bSaveAs = false;
		var bEmail = false;

		if (secondaryRequests)
		{
			for (var iIndex=0; iIndex < secondaryRequests.length; iIndex++)
			{
				switch (secondaryRequests[iIndex])
				{
					case 'save':
						bSave = true;
						break;
					case 'saveAs':
						bSaveAs = true;
						break;
					case 'email':
						bEmail = true;
						break;
				}
			}
		}

		var toolbarControl = this.getToolbarControl();
		if (toolbarControl)
		{
			var keepThisVersion = toolbarControl.getItem("keepThisVersion");
			if (keepThisVersion)
			{
				if (!bSave && !bSaveAs && !bEmail) { keepThisVersion.hide(); } else { keepThisVersion.show(); }

				var keepThisVersionMenu = keepThisVersion.getMenu();

				if (bSave || bSaveAs || bEmail)
				{
					if (keepThisVersionMenu)
					{
						var saveMenuItem = keepThisVersionMenu.getItem("saveReport");
						if (saveMenuItem)
						{
							if (bSave) { saveMenuItem.show(); } else { saveMenuItem.hide(); }
						}

						var saveAsMenuItem = keepThisVersionMenu.getItem("saveAsReportView");
						if (saveAsMenuItem)
						{
							if (bSaveAs) { saveAsMenuItem.show(); } else { saveAsMenuItem.hide(); }
						}

						var emailMenuItem = keepThisVersionMenu.getItem("emailReport");
						if (emailMenuItem)
						{
							if (bEmail) { emailMenuItem.show(); } else { emailMenuItem.hide(); }
						}
					}
				}
			}
		}
	}
};

function CMainWnd_updateCurrentFormat(sFormat, sWebContentRoot)
{
	var sIcon = "";
	var sTooltip = "";

	switch(sFormat)
	{
		case 'HTML':
		case 'HTMLFragment':
		case 'XHTMLFRGMT':
			sIcon = sWebContentRoot + "/rv/images/action_view_html.gif";
			sTooltip = RV_RES.RV_VIEW_HTML;
			break;
		case 'PDF':
			sIcon = sWebContentRoot + "/rv/images/action_view_pdf.gif";
			sTooltip = RV_RES.RV_VIEW_PDF;
			break;
		case 'XML':
			sIcon = sWebContentRoot + "/rv/images/action_view_xml.gif";
			sTooltip = RV_RES.RV_VIEW_XML;
			break;
	}

	if(sIcon != "" && sTooltip != "")
	{
		var toolbarControl = this.getToolbarControl();
		if(toolbarControl)
		{
			var bIsUIActionView = this.getCV().envParams["ui.action"] == "view";
			var formatButton = null;
			if(bIsUIActionView)
			{
				formatButton = toolbarControl.getItem("viewIn");
			}
			else
			{
				formatButton = toolbarControl.getItem("runIn");
			}

			if(formatButton)
			{
				formatButton.setIcon(sIcon);
				formatButton.setToolTip(sTooltip);

				var sRV = this.getCVObjectRef() + ".getRV().";
				formatButton.setAction("javascript:" + sRV + "viewReport('" + sFormat + "');");
			}
		}
	}

	this.setCurrentFormat(sFormat);
}

CMainWnd.prototype.getCurrentFormat = function()
{
	return this.m_currentFormat;
};

function CMainWnd_getSelectionController()
{
	var selectionController;

	try
	{
		selectionController = getCognosViewerSCObjectRef(this.getCV().getId());
	}
	catch(e)
	{
		// ignore the exception and set the selection controller to null
		selectionController = null;
	}

	return selectionController;
}

var g_oPressTimer = null;
var g_bLongPressDetected = false;
var g_oPreviousValues = {};

if (window.attachEvent)
{
	window.attachEvent("onmouseout", f_cancelLongTouch);
	window.attachEvent("ontouchstart", onTouchStart);
	window.attachEvent("ontouchend", f_cancelLongTouch);
	window.attachEvent("ontouchleave", f_cancelLongTouch);
	window.attachEvent("ontouchcancel", f_cancelLongTouch);
}
else if (window.addEventListener)
{
	window.addEventListener("mouseout", f_cancelLongTouch);
	window.addEventListener("touchstart", onTouchStart);
	window.addEventListener("touchend", f_cancelLongTouch);
	window.addEventListener("touchleave", f_cancelLongTouch);
	window.addEventListener("touchcancel", f_cancelLongTouch);
}

function f_cancelLongTouch (evt) {
	if (isIOS())
	{ 
    	if ( g_oPressTimer !== null) {
    	    clearTimeout( g_oPressTimer );
			g_oPressTimer = null;
		}
    }
}

function onTouchStart(evt)
{
	if (isIOS())
	{
    
    	g_bLongPressDetected = false;
    
    	g_oPressTimer = setTimeout(function() {
			var node = getNodeFromEvent(evt);
			// get the existing values so that they can be restored later
			g_oPreviousValues.webkitTouchCallout = node.style.getPropertyValue("webkitTouchCallout");
			g_oPreviousValues.webkitUserSelect = node.style.getPropertyValue("webkitUserSelect");
			// set values to none
			node.style.webkitTouchCallout = "None";
			node.style.webkitUserSelect = "None";
        	g_bLongPressDetected = true;
    	}, 1500);
	}
    return false;
}


function CMainWnd_pageClicked(evt)
{
	var oCV = this.getCV();

	f_cancelLongTouch (evt);
	
	if (this.m_showContextMenuOnClick || ( isIOS() && g_bLongPressDetected)) {
		var node = getNodeFromEvent(evt);
		// Only draw the context menu if the user clicked on a node that doesn't have a link
		if (node && typeof node.onclick != "function" && (node.nodeName.toLowerCase() != "span" || typeof node.parentNode.onclick != "function")) {
			oCV.dcm(evt, true);
			if ( isIOS() && g_bLongPressDetected)
			{
				node.style.webkitTouchCallout = g_oPreviousValues.webkitTouchCallout;
				node.style.webkitUserSelect = g_oPreviousValues.webkitUserSelect;
			}
			return stopEventBubble(evt);
		}
	}

	this.hideOpenMenus();
		
	if(oCV != null)
	{
		if (typeof oCV.sortColumn == "undefined" || !oCV.sortColumn(evt)) {	
			var oDrillMgr = oCV.getDrillMgr();
			if (oDrillMgr)
			{
				var bDrilled = oDrillMgr.singleClickDrillEvent(evt, 'RV');
			}
		}
	}

	if (oCV.getViewerWidget())
	{
		oCV.getViewerWidget().updateToolbar();
	}

	setNodeFocus(evt);
	
	if (bDrilled) {
		return stopEventBubble(evt);
	}
}

function CMainWnd_hideOpenMenus()
{
	var cm = this.getContextMenu();
	if (typeof cm != "undefined" && cm != null)
	{
		cm.hide();
	}
	var tb = this.getToolbar();
	if (typeof tb != "undefined" && tb != null)
	{
		tb.closeMenus();
	}

	var banner = this.getBannerToolbar();
	if (banner != "undefined" && banner != null)
	{
		banner.closeMenus();
	}
}

function CMainWnd_draw()
{
	var toolbar = this.getToolbar();
	if (toolbar && this.m_uiBlackList.indexOf(' RV_TOOLBAR_BUTTONS '))
	{
		var sRunOutputFormat = "";
		var f = document.forms['formWarpRequest' + this.getCVId()];

		if (f["run.outputFormat"] && f["run.outputFormat"].value)
		{
			sRunOutputFormat = f["run.outputFormat"].value;
		}
		else if (f["ui.format"] && f["ui.format"].value)
		{
			sRunOutputFormat = f["ui.format"].value;
		}

		if(sRunOutputFormat != "")
		{
			this.updateCurrentFormat(sRunOutputFormat, this.getCV().getWebContentRoot());
		}

		toolbar.draw();
	}

	var bannerToolbar = this.getBannerToolbar();
	if (bannerToolbar)
	{
		bannerToolbar.draw();
	}
}

function CMainWnd_addToReportHistory(reportHistoryObj) {
	this.m_reportHistoryList[this.m_reportHistoryList.length] = reportHistoryObj;
}


function CMainWnd_getReportHistory() {
	return this.m_reportHistoryList;
}

function CMainWnd_getContextMenu() {
	return this.m_contextMenu;
}

function CMainWnd_displayContextMenu(evt, selectNode)
{
	if(!this.getCV().bEnableContextMenu)
	{
		return false;
	}

	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	var selectionController = this.getSelectionController();

	if(selectionController != null)
	{
		var cm = this.getContextMenu();

		if(selectNode && this.getCV().bCanUseCognosViewerSelection == true)
		{
			if (!selectionController.pageContextClicked(evt))
			{
				if (typeof cm != "undefined" && cm != null)
				{
					cm.m_contextMenu.remove();
				}
				return false;
			}
		}

		cm = this.getContextMenu();
		if (typeof cm != "undefined" && cm != null)
		{
			cm.draw(evt);
			// need the cell node in firefox to reset the focus to the cell when the context menu closes
			if (!isIE())
			{
				cm.m_contextMenu.m_focusCell = getNodeFromEvent(evt);
			}
		}
		var tb = this.getToolbar();
		if (typeof tb != "undefined" && tb != null)
		{
			tb.closeMenus();
		}

		var banner = this.getBannerToolbar();
		if (banner != "undefined" && banner != null)
		{
			banner.closeMenus();
		}
	}
}

function CMainWnd_getReportHistoryLength() {
	return this.m_reportHistoryList.length;
}

function CMainWnd_executePreviousReport(stackIdx)
{
	// if the stack index is -1, the previous report button button was pressed, and this function was not called from the
	// drop down menu. Set the stack index to the most recent report
	if(stackIdx == -1)  {
		stackIdx = this.getReportHistoryLength() - 1;
	}

	for(var i = 0; i < this.getReportHistoryLength(); ++i)
	{
		var currentObj = this.m_reportHistoryList[i];
		if(currentObj.getIdx() == stackIdx)
		{
			currentObj.execute();
			return;
		}
	}
}

function CMainWnd_getReportHistoryConversations()
{
	var reportHistoryConversations = [];

	var reportHistoryList = this.getReportHistory();
	for(var reportHistoryIdx = 0; reportHistoryIdx < reportHistoryList.length; ++reportHistoryIdx)
	{
		var reportHistory = reportHistoryList[reportHistoryIdx];
		var tracking = reportHistory.getTrackingInfo();
		if(tracking != "") {
			reportHistoryConversations.push(tracking);
		}
	}

	return reportHistoryConversations;
}

function CMainWnd_getUIHide()
{
	return this.m_uiBlackList;
}

CMainWnd.prototype.loadPreviousReports = function()
{

	// load any previous reports
	var sPreviousReports = this.getCV().envParams["cv.previousReports"];
	if(typeof sPreviousReports != "undefined" && sPreviousReports != null)
	{
		var xmlParsedCvPreviousReports = XMLBuilderLoadXMLFromString(sPreviousReports);

		// get the root node
		var rootNode = XMLHelper_GetFirstChildElement( xmlParsedCvPreviousReports );
		if(XMLHelper_GetLocalName(rootNode) == "previousReports")
		{
			var previousReportEntries = rootNode.childNodes;
			for(var index = 0; index < previousReportEntries.length; ++index)
			{
				var previousReportEntry = previousReportEntries[index];
				var paramNodes = previousReportEntry.childNodes;

				var reportName = "";
				var params = {};

				for(var paramNodeIndex = 0; paramNodeIndex < paramNodes.length; ++paramNodeIndex)
				{
					var sParamName = paramNodes[paramNodeIndex].getAttribute("name");
					switch(sParamName)
					{
						case "ui.name":
							reportName = XMLHelper_GetText(paramNodes[paramNodeIndex]);
							break;
						default:
							params[sParamName] = XMLHelper_GetText(paramNodes[paramNodeIndex]);
							break;
					}
				}

				this.addToReportHistory(new CReportHistory(this, index, reportName, params));
			}
		}
	}
};

CMainWnd.prototype.init = function()
{
	this.m_uiBlackList = "";
	if (typeof this.getCV().UIBlacklist == "string")
	{
		this.m_uiBlackList = this.getCV().UIBlacklist;
	}

	if ((typeof gCognosViewer != "undefined") && (gCognosViewer.envParams["isTitan"]) && (gCognosViewer.envParams["isTitan"] == true))
	{
		gMenuItemStyle = new CUIStyle('titanui menuItem_normal', 'titanui menuItem_hover', "", "", 'titanui menuItem_disabled');
	}

	// reset context menu and toolbar with new blacklist
	this.m_contextMenu = null;
	if(this.getCV().bEnableContextMenu && typeof CContextMenu != "undefined" && this.m_uiBlackList.indexOf(' RV_CONTEXT_MENU ') == -1) {
		this.m_contextMenu = new CContextMenu(this);
	}

	this.loadPreviousReports();

	// make sure the global seperators have the correct webContent root
	gMenuSeperator.setWebContentRoot(this.getCV().getWebContentRoot());
	gToolbarSeperator.setWebContentRoot(this.getCV().getWebContentRoot());
};

CMainWnd.prototype.renderPreviousReports = function()
{

	var toolbar = this.getToolbarControl();
	var previousReportButton = toolbar.getItem("previousReport");
	var sWebContentRoot = this.getCV().getWebContentRoot();
	var sSkin = this.getCV().getSkin();
	if(previousReportButton)
	{
		var previousReportDropDownMenu = previousReportButton.getMenu();
		var reportHistoryList = this.getReportHistory();
		for(var index = 0; index < reportHistoryList.length; ++index)
		{
			var reportHistoryObject = reportHistoryList[index];
			new CMenuItem(previousReportDropDownMenu, reportHistoryObject.getReportName(), "javascript:" + this.getCV().getObjectId() + ".rvMainWnd.executePreviousReport(" + index + ");", sWebContentRoot + reportHistoryObject.getDropDownMenuIcon(), gMenuItemStyle, sWebContentRoot, sSkin);
		}

		previousReportDropDownMenu.draw();
	}
};

function CMainWnd_update(subject)
{
	// validate the subject
	if(typeof subject == "undefined" || subject === null) {
		return;
	}

	// if we're being notified by the selection controller that selection has changed, notify the toolbar and context menu
	if(subject instanceof CSelectionController)
	{
		var rvToolbar = this.getToolbarControl();

		if(typeof rvToolbar != "undefined" && rvToolbar != null)
		{
			var oDrillMgr = this.getCV().getDrillMgr();
			if(oDrillMgr)
			{
				var gotoToolbarButton = rvToolbar.getItem("goto");
				if(gotoToolbarButton)
				{
					var menu = gotoToolbarButton.getMenu();
					if(menu)
					{
						// when the selection changes clear out the cached report drill targets (if any)
						menu.clear();
					}
				}

				var drillDownToolbarButton = rvToolbar.getItem("drillDown");
				if (drillDownToolbarButton)
				{
					if (oDrillMgr.canDrillDown()) { drillDownToolbarButton.enable(); } else { drillDownToolbarButton.disable(); }
				}

				var drillUpToolbarButton = rvToolbar.getItem("drillUp");
				if (drillUpToolbarButton)
				{
					if (oDrillMgr.canDrillUp()) { drillUpToolbarButton.enable(); } else { drillUpToolbarButton.disable(); }
				}
			}

			var lineageButton = rvToolbar.getItem("lineage");
			if(lineageButton)
			{
				var selections = subject.getAllSelectedObjects();
				if(selections != null && selections.length > 0)
				{
					lineageButton.enable();
				}
				else
				{
					lineageButton.disable();
				}
			}
		}

		var rvContextMenu = this.getContextMenu();
		if(typeof rvContextMenu != "undefined" && rvContextMenu != null)
		{
			rvContextMenu.update(subject);
		}
	}
}

function CMainWnd_addDrillTargets(drillTargets) {
	this.m_oCV.addDrillTargets(drillTargets);
}

function CMainWnd_getDrillTargets() {
	return this.m_oCV.getDrillTargets();
}

function CMainWnd_getDrillTarget(idx)
{
	return this.m_oCV.getDrillTarget(idx);
}

function CMainWnd_getNumberOfDrillTargets() {
	return this.m_oCV.getNumberOfDrillTargets();
}

CMainWnd.prototype.renderAvailableOutputs = function()
{
	var sObjectId = this.getCVObjectRef() + ".getRV().";
	var oCV = this.getCV();
	var toolbarCtrl = this.getToolbarControl();
	var sBlacklist = this.getUIHide();
	var sWebContentRoot = oCV.getWebContentRoot();
	var sSkin = oCV.getSkin();

	var viewInButton = null;
	var oFormatDropDownMenu = null;
	if (typeof toolbarCtrl != "undefined" && toolbarCtrl != null) {
		viewInButton = toolbarCtrl.getItem("viewIn");
		if (viewInButton)
		{
			oFormatDropDownMenu = viewInButton.getMenu();
		}
	}

	if(oFormatDropDownMenu.getNumItems() == 0)
	{
		// view in html
		if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_HTML ') == -1)
		{
			this.m_viewInHtmlButton = new CMenuItem(oFormatDropDownMenu, RV_RES.RV_VIEW_HTML, "javascript:" + sObjectId + "viewReport('HTML');", sWebContentRoot + '/rv/images/action_view_html.gif', gMenuItemStyle, sWebContentRoot, sSkin);
			if(oCV.oOutputFormatPath.HTML == "")
			{
				this.m_viewInHtmlButton.disable();
			}
		}

		// view in PDF
		if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_PDF ') == -1)
		{
			this.m_viewInPDFButton = new CMenuItem(oFormatDropDownMenu, RV_RES.RV_VIEW_PDF, "javascript:" + sObjectId + "viewReport('PDF');", sWebContentRoot + '/rv/images/action_view_pdf.gif', gMenuItemStyle, sWebContentRoot, sSkin);
			if(oCV.oOutputFormatPath.PDF == "")
			{
				this.m_viewInPDFButton.disable();
			}
		}

		// view in XML
		if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_XML ') == -1)
		{
			this.m_viewInXMLButton = new CMenuItem(oFormatDropDownMenu, RV_RES.RV_VIEW_XML, "javascript:" + sObjectId + "viewReport('XML');", sWebContentRoot + '/rv/images/action_view_xml.gif', gMenuItemStyle, sWebContentRoot, sSkin);
			if(oCV.oOutputFormatPath.XML == "")
			{
				this.m_viewInXMLButton.disable();
			}
		}

		// view in excel options
		if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_XLS ') == -1)
		{
			this.m_viewInXLSButton = new CMenuItem(oFormatDropDownMenu, RV_RES.RV_VIEW_OPTIONS, "", sWebContentRoot + '/rv/images/action_view_excel_options.gif', gMenuItemStyle, sWebContentRoot, sSkin);
			this.excelFormatCascadedMenu = this.m_viewInXLSButton.createCascadedMenu(gMenuStyle, RV_RES.RV_VIEW_OPTIONS);


			if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_XLS_SPREADSHEETML_DATA ') == -1)
			{
				this.viewInSpreadsheetMLDataMenuItem = new CMenuItem(this.excelFormatCascadedMenu, RV_RES.RV_VIEW_SPREADSHEETML_DATA, "javascript:" + sObjectId + "viewReport('xlsxData');", sWebContentRoot + "/rv/images/action_view_excel_2007.gif", gMenuItemStyle, sWebContentRoot, sSkin);
				if(oCV.oOutputFormatPath.xlsxData == "")
				{
					this.viewInSpreadsheetMLDataMenuItem.disable();
				}
			}

			if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_XLS_SPREADSHEETML ') == -1)
			{
				this.viewInSpreadsheetMLMenuItem = new CMenuItem(this.excelFormatCascadedMenu, RV_RES.RV_VIEW_SPREADSHEETML, "javascript:" + sObjectId + "viewReport('spreadsheetML');", sWebContentRoot + "/rv/images/action_view_excel_2007.gif", gMenuItemStyle, sWebContentRoot, sSkin);
				if(oCV.oOutputFormatPath.spreadsheetML == "")
				{
					this.viewInSpreadsheetMLMenuItem.disable();
				}
			}

			if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_XLS_XLWA ') == -1)
			{
				this.viewInXLSWebArchiveMenuItem = new CMenuItem(this.excelFormatCascadedMenu , RV_RES.RV_VIEW_XLWA, "javascript:" + sObjectId + "viewReport('XLWA');", sWebContentRoot + "/rv/images/action_view_excel_2002.gif", gMenuItemStyle, sWebContentRoot, sSkin);
				if(oCV.oOutputFormatPath.XLWA == "")
				{
					this.viewInXLSWebArchiveMenuItem.disable();
				}
			}

			if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_XLS_SINGLEXLS ') == -1)
			{
				this.viewInSingleXLSMenuItem = new CMenuItem(this.excelFormatCascadedMenu , RV_RES.RV_VIEW_SINGLE_EXCEL, "javascript:" + sObjectId + "viewReport('singleXLS');", sWebContentRoot + "/rv/images/action_view_excel_options.gif", gMenuItemStyle, sWebContentRoot, sSkin);
				if(oCV.oOutputFormatPath.singleXLS == "")
				{
					this.viewInSingleXLSMenuItem.disable();
				}
			}

			if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_XLS_XLS ') == -1)
			{
				this.viewInSingleXLSMenuItem = new CMenuItem(this.excelFormatCascadedMenu , RV_RES.RV_VIEW_EXCEL, "javascript:" + sObjectId + "viewReport('XLS');", sWebContentRoot + "/rv/images/action_view_excel_2000.gif", gMenuItemStyle, sWebContentRoot, sSkin);
				if(oCV.oOutputFormatPath.XLS == "")
				{
					this.viewInSingleXLSMenuItem.disable();
				}
			}

			if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_XLS_CSV ') == -1)
			{
				var iconPath = "";
				if (getViewerDirection() == "rtl") {
					iconPath = "/rv/images/action_view_csv_rtl.gif";
				}
				else {
					iconPath = "/rv/images/action_view_csv.gif";					
				}
				this.viewInCSVMenuItem = new CMenuItem(this.excelFormatCascadedMenu , RV_RES.RV_VIEW_CSV, "javascript:" + sObjectId + "viewReport('CSV');", sWebContentRoot + iconPath, gMenuItemStyle, sWebContentRoot, sSkin);
				if(oCV.oOutputFormatPath.CSV == "")
				{
					this.viewInCSVMenuItem.disable();
				}
			}
		}
	}

	oFormatDropDownMenu.draw();
	if (oFormatDropDownMenu.isVisible()) {
		oFormatDropDownMenu.show();
	}
};

CMainWnd.prototype.saveReportHistoryAsXML = function()
{
	var sReportHistorySpecification = "";
	var reportHistoryList = this.getReportHistory();
	if(reportHistoryList.length > 0)
	{
		var previousReports = self.XMLBuilderCreateXMLDocument("previousReports");
		var iStartingIndex = 0;
		if (reportHistoryList.length > 20)
		{
			iStartingIndex = reportHistoryList.length - 20;
		}

		for(var index = iStartingIndex; index < reportHistoryList.length; ++index)
		{
			reportHistoryList[index].saveAsXML(previousReports.documentElement);
		}

		sReportHistorySpecification = XMLBuilderSerializeNode(previousReports);
	}

	return sReportHistorySpecification;
};

CMainWnd.prototype.addCurrentReportToReportHistory = function()
{
	var oCV = this.getCV();

	var params = {};
	var reportName = oCV.envParams["ui.name"];

	var sAction = oCV.envParams["ui.action"];
	if(sAction == "view")
	{
		params["ui.action"] = "view";
		params["ui.format"] = oCV.envParams["ui.format"];
	}
	else
	{
		params["ui.action"] = "currentPage";
		params["ui.conversation"] = oCV.getConversation();
		params["m_tracking"] = oCV.getTracking();
		params["run.outputFormat"] = oCV.envParams["run.outputFormat"];
		if (oCV.envParams["rapReportInfo"]) {
			params["rapReportInfo"] = oCV.envParams["rapReportInfo"];
		}
		if (oCV.envParams.limitedInteractiveMode) {
			params.limitedInteractiveMode = oCV.envParams.limitedInteractiveMode;
		}
		if (oCV.envParams["ui.spec"]) {
			params["ui.spec"] = oCV.envParams["ui.spec"];
		}
		if (oCV.envParams.uiSpecAddedFromRun) {
			params.uiSpecAddedFromRun = oCV.envParams.uiSpecAddedFromRun;
		}
	}

	if(typeof oCV.envParams["ui.object"] != "undefined")
	{
		params["ui.object"] = oCV.envParams["ui.object"];
	}
	else
	{
		params["ui.spec"] = oCV.envParams["ui.spec"];
		params["ui.object"] = "";
	}

	params["ui.primaryAction"] = oCV.envParams["ui.primaryAction"];
	
	if(oCV.envParams["ui.routingServerGroup"])
	{
		params["ui.routingServerGroup"] = oCV.envParams["ui.routingServerGroup"];
	}

	this.addToReportHistory(new CReportHistory(this, this.m_reportHistoryList.length, reportName, params));
};

CMainWnd.prototype.draw = CMainWnd_draw;
CMainWnd.prototype.addDrillTargets = CMainWnd_addDrillTargets;
CMainWnd.prototype.getDrillTarget = CMainWnd_getDrillTarget;
CMainWnd.prototype.getDrillTargets = CMainWnd_getDrillTargets;
CMainWnd.prototype.getNumberOfDrillTargets = CMainWnd_getNumberOfDrillTargets;
CMainWnd.prototype.addToReportHistory = CMainWnd_addToReportHistory;
CMainWnd.prototype.getReportHistoryLength = CMainWnd_getReportHistoryLength;
CMainWnd.prototype.getReportHistory = CMainWnd_getReportHistory;
CMainWnd.prototype.executePreviousReport = CMainWnd_executePreviousReport;
CMainWnd.prototype.getContextMenu = CMainWnd_getContextMenu;
CMainWnd.prototype.displayContextMenu = CMainWnd_displayContextMenu;
CMainWnd.prototype.hideOpenMenus = CMainWnd_hideOpenMenus;
CMainWnd.prototype.pageClicked = CMainWnd_pageClicked;
CMainWnd.prototype.getUIHide = CMainWnd_getUIHide;
CMainWnd.prototype.update = CMainWnd_update;
CMainWnd.prototype.getSelectionController = CMainWnd_getSelectionController;
CMainWnd.prototype.getReportHistoryConversations = CMainWnd_getReportHistoryConversations;
CMainWnd.prototype.updateCurrentFormat = CMainWnd_updateCurrentFormat;

/**
 * Function that will resize the iframe. This should only be called when we're viewing
 * saved HTML output, we're standalone (i.e. not in QS or fragments) and we're in IE
 */
function resizeIFrame(evt)
{
	var oCV = window.gaRV_INSTANCES[0];
	var oReportDiv = document.getElementById("CVReport" + oCV.getId());
	var oReportIFrame = document.getElementById("CVIFrame" + oCV.getId());

	if (typeof oReportDiv != "undefined" && oReportDiv != null && typeof oReportIFrame != "undefined" && oReportIFrame != null)
	{
		oCV.attachedOnResize = true;
		oCV.setMaxContentSize();
		oReportIFrame.style.height = oReportDiv.clientHeight + "px";
	}
}
