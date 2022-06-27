/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

// Helper class which takes of of dynamic loading of menus
function LoadMenuAction()
{
	this.m_action = null;
}

LoadMenuAction.prototype = new CognosViewerAction();

LoadMenuAction.prototype.FROM_TOOLBAR = 'toolbar';
LoadMenuAction.prototype.FROM_TOOLBAR_BLUEDOTMENU = 'toolbarBlueDotMenu';
LoadMenuAction.prototype.FROM_CONTEXTMENU = 'contextMenu';
LoadMenuAction.prototype.FROM_CONTEXTMENU_MOREACTIONS = 'contextMenuMoreActions';

LoadMenuAction.prototype.TOOLBAR_UPDATE_EVENT ="com.ibm.bux.widgetchrome.toolbar.update";
LoadMenuAction.prototype.CONTEXTMENU_UPDATE_EVENT ="com.ibm.bux.widget.contextMenu.update";


LoadMenuAction.prototype.setRequestParms = function(payload)
{
	this.m_action = payload.action;
	this.m_sFrom = (payload.from) ? payload.from : this.FROM_TOOLBAR;
};

LoadMenuAction.prototype.execute = function()
{
	var actionFactory = this.m_oCV.getActionFactory();
	var action = actionFactory.load(this.m_action);

	var toolbarItem = this.getMenuSpec();
	var buildMenuCallback = GUtil.generateCallback(this.buildMenuCallback, [toolbarItem], this);
	toolbarItem = action.buildMenu(toolbarItem, buildMenuCallback);
	if(toolbarItem != null)
	{
		this.buildMenuCallback(toolbarItem);
	}
};

LoadMenuAction.prototype.buildMenuCallback = function(toolbarItem)
{
	toolbarItem.open = true;
	toolbarItem.action = null;	
	this.fireEvent(toolbarItem);
};


LoadMenuAction.prototype.getMenuSpec = function() {
	var oCV = this.m_oCV;
	var sFrom = this.m_sFrom;
	
	if (!sFrom || !oCV) {
		return null;
	}
	
	var parentNode = null;
	var menuSpec = null;
		
	switch (sFrom) {
		case this.FROM_TOOLBAR: 
			parentNode = oCV.getToolbar();
			break;
		case this.FROM_TOOLBAR_BLUEDOTMENU:
			parentNode = oCV.findBlueDotMenu();
			break;
		case this.FROM_CONTEXTMENU_MOREACTIONS:
			parentNode = oCV.findToolbarItem("MoreActions", oCV.getContextMenu());
			break;
	}
	if (parentNode) {
		menuSpec = oCV.findToolbarItem(this.m_action, parentNode);
	}

	if (menuSpec) {
		//attach 'from' to menuSpec
		menuSpec.from = sFrom;
	}

	return menuSpec;
};

LoadMenuAction.prototype.fireEvent = function(buttonSpec) {

	var updateItems = [];
	if (buttonSpec) {
		updateItems.push(buttonSpec);
	}
	
	var widget = this.m_oCV.getViewerWidget();
	var sFrom = buttonSpec.from;
	
	switch (sFrom) {
		case this.FROM_TOOLBAR: 
		case this.FROM_TOOLBAR_BLUEDOTMENU:
			widget.fireEvent( this.TOOLBAR_UPDATE_EVENT, null, updateItems);
			break;
		case this.FROM_CONTEXTMENU_MOREACTIONS:
			widget.fireEvent( this.CONTEXTMENU_UPDATE_EVENT, null, updateItems);
			break;
	};
};