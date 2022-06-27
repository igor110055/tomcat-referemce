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

/**
 * Override the page click event so that mobile can show their
 * own context menu
 */
CMainWnd.prototype.pageClicked =  function(evt) {
	var oCV = this.getCV();
	var selectionController = oCV.getSelectionController();

	if (selectionController && oCV.bCanUseCognosViewerSelection == true) {
		selectionController.resetSelections();
		
		var nodeSelected = selectionController.pageClickedForMobile(evt);

		// Only show the menu in Mobile if there's something selected
		if (nodeSelected) {
			
			// If we have a bookmark drill through with no target then execute the drill through instead of showing a menu
			if (this._bookmarkDrillThrough(evt, oCV)) {
				return;
			}
			
			var contextMenu = CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection(oCV, oCV.getContextMenu());
			
			this._fixGotoMenu(contextMenu);

			var containerType = selectionController.getContainerType();
				
			// if we're dealing with a chart then get the tooltip
			var chartTooltip = containerType === "chart" ? selectionController.getChartTooltip() : null;
			
			var payload = {
				"action" : "showMenu",
				"event" : evt,
				"payload" : contextMenu.length > 0 ? contextMenu : null,
				"displayValues" : selectionController.getDisplayValues(selectionController),
				"chartTooltip" : chartTooltip,
				"containerType" : containerType
			};
			
			// window.onAction is the entry point into Mobile, call them so they can show their own menu
			if (window.onAction) {
				window.onAction(payload);
			}
			else if(typeof console != "undefined") {
				// must not be in Mobile, log it to the console
				console.log(payload);
			}
		}
	}
};

/**
 * If the user clicked on a cell with a bookmark drill with no target report
 * then execute the drill through
 * @returns true if a drill through was executed
 */
CMainWnd.prototype._bookmarkDrillThrough = function(evt, oCV) {
	var oDrillMgr = oCV.getDrillMgr();
	var drillThroughs = oDrillMgr.getAuthoredDrillsForCurrentSelection();
	if (drillThroughs) {
		// If we have a bookmark drill through with no target then execute the drill through instead of showing a menu
		var drillTargets = XMLHelper_FindChildrenByTagName(drillThroughs, "drillTarget", false);
		if (drillTargets && drillTargets.length == 1) {
			var drillTarget = drillTargets[0];
			var bookmarkRef = drillTarget.getAttribute("bookmarkRef");
			var path = drillTarget.getAttribute("path");
			if (bookmarkRef && bookmarkRef.length > 0 && (!path || path.length == 0)) {
				oDrillMgr.singleClickDrillEvent(evt, 'RV');
				return true;
			}
		}
	}	
	
	return false;
};

/**
 * Override the displayContextMenu so that we call Mobile instead
 */
CMainWnd.prototype.displayContextMenu = function(evt, selectNode) {
	if(!this.getCV().bEnableContextMenu) {
		return false;
	}
	
	this.pageClicked(evt);
};


/**
 * Mobile doesn't want all the drill through items in a sub-menu
 */
CMainWnd.prototype._fixGotoMenu = function(contextMenu) {
	if (contextMenu && contextMenu.length) {
		var gotoMenuItem = null;
		var menuSize = contextMenu.length;
		var menuPosition = 0;
		
		// find the 'Goto' menu
		for (var i=0; i < menuSize; i++) {
			if (contextMenu[i].name === 'Goto') {
				menuPosition = i;
				gotoMenuItem = contextMenu.splice(i, 1);
				break;
			}
		}
		
		// Loop through all the sub-menu items and move them into the main menu
		if (gotoMenuItem && gotoMenuItem[0] && gotoMenuItem[0].items) {
			var gotoItems = gotoMenuItem[0].items;
			var gotoSize = gotoItems.length;
			for (var i=0; i < gotoSize; i++) {
				// Mobile doesn't want separators or the 'Goto' menu item
				if (!gotoItems[i].separator) {
					contextMenu.splice(menuPosition, 0, gotoItems[i]);
					menuPosition++;
				}
			}
		}
	}
};