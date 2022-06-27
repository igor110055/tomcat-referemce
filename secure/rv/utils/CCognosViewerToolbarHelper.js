/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 function CCognosViewerToolbarHelper() {}
 
CCognosViewerToolbarHelper.updateToolbarForCurrentSelection = function(oCV, oToolbar) {
	if (oToolbar) {
		var actionFactory = oCV.getActionFactory();
		for(var toolbarItem = 0; toolbarItem < oToolbar.length; ++toolbarItem)
		{
			var name = oToolbar[toolbarItem]["name"];
			if (typeof name != "undefined" && name != null) {
				var action = actionFactory.load(name);
				if (action != null && typeof action != "undefined") {
					var updatedToolbarItem = action.updateMenu(oToolbar[toolbarItem]);
					if (updatedToolbarItem.visible == false) {
						if (updatedToolbarItem.save) {
							// save the button and location in case we need to add it back later
							oCV.getViewerWidget().addButtonToSavedToolbarButtons(name,oToolbar[toolbarItem],toolbarItem);
						}
						oToolbar.splice(toolbarItem, 1);
						--toolbarItem;
					} else {
						oToolbar[toolbarItem] = updatedToolbarItem;
					}
				}
			} else if (typeof oToolbar[toolbarItem]._root != "undefined") {
				CCognosViewerToolbarHelper.updateToolbarForCurrentSelection(oCV, oToolbar[toolbarItem]._root);
			} else if (oToolbar[toolbarItem].separator) {
				if (toolbarItem == 0 || (toolbarItem > 0 && oToolbar[toolbarItem - 1].separator) || toolbarItem == oToolbar.length)	{
					oToolbar.splice(toolbarItem, 1);
					--toolbarItem;
				}
			}
		}
	}
};


CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection = function(oCV, oContextMenu) {
	
	// we don't want to modify the original context menu spec, so create a temp object
	// TODO: Get a way to simply hide a menu item instead of setting the json for it to empty.
	var tempContextMenu = [];

	if (oContextMenu) {
		var actionFactory = oCV.getActionFactory();
		for (var contextMenuItem = 0; contextMenuItem < oContextMenu.length; ++contextMenuItem) {
			var menuItem = oContextMenu[contextMenuItem];
			var name = oContextMenu[contextMenuItem]["name"];
			
			var isItemValidInArea = true;
			if (typeof name != "undefined") {
				var action = actionFactory.load(name);
	
				if (action != null && typeof action != "undefined") {
					if (typeof action.buildMenu == "function") {
						//TODO context menus don't support callbacks, once the support is in, we can call updateMenu as we normally do, for now
						menuItem = action.buildMenu(oContextMenu[contextMenuItem]);
					}
					else {
						menuItem = action.updateMenu(oContextMenu[contextMenuItem]);
					}
	
					isItemValidInArea = action.isValidMenuItem();
					
				} else if(typeof menuItem.items != "undefined") {
					menuItem.items = CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection(oCV, menuItem.items);
	
					//We don't want empty or nested menu with one item
					isItemValidInArea = (menuItem.items && menuItem.items.length>0)? true:false;
					
					if (isItemValidInArea && menuItem.items.length ==1) {
						menuItem = menuItem.items[0];
					} 
				}
			}
	
			if (menuItem && menuItem.visible !== false && isItemValidInArea) {
				// only add the separator if the previous menuItem wasn't a separator
				if (menuItem.separator === true) {
					if (tempContextMenu.length > 0 && typeof tempContextMenu[tempContextMenu.length - 1].separator == "undefined") {
						tempContextMenu[tempContextMenu.length] = menuItem;
					}
				}
				else if (menuItem.useChildrenItems == true && menuItem.items && menuItem.items.length > 0) {
					if (!menuItem.disabled) {
						for (var subItems = 0; subItems < menuItem.items.length; subItems++) {
							tempContextMenu[tempContextMenu.length] = menuItem.items[subItems];
						}
					}
				}
				else if (typeof menuItem._root != "undefined") {
					tempContextMenu[tempContextMenu.length] = { "_root" : CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection(oCV, menuItem._root)};
				}				
				else {
					tempContextMenu[tempContextMenu.length] = menuItem;
				}
			}
		}
		
		
		if (tempContextMenu.length>1) {
			//remove the separator if it is at the end.
			if (tempContextMenu[tempContextMenu.length - 1].separator) {
				tempContextMenu =  tempContextMenu.splice(0, tempContextMenu.length - 1);
			}
		}
	}
	return tempContextMenu;
};
