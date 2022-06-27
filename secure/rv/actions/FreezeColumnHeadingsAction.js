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

function FreezeColumnHeadingsAction()
{
}
 
FreezeColumnHeadingsAction.prototype = new UndoableClientActionBase();
FreezeColumnHeadingsAction.superclass = UndoableClientActionBase.prototype;

FreezeColumnHeadingsAction.prototype.execute = function()
{
	var lidToFreeze = this.m_sContainerId ? this.m_sContainerId : this.getSelectedCrosstabOrListContainerId();
	if (lidToFreeze) {
		//Selection borders in high contrast mode aren't cleaned up properly when cloned, 
		//so remove all selections before performing freeze
		this.m_oCV.getSelectionController().resetSelections();
		
		this.m_oCV.getPinFreezeManager().freezeContainerColumnHeadings(lidToFreeze);
		this.addClientSideUndo(this, [lidToFreeze]);
	}
};

FreezeColumnHeadingsAction.prototype.getUndoHint = function() 
{
	return RV_RES.IDS_JS_FREEZECOLUMNHEADINGS;	
};

FreezeColumnHeadingsAction.prototype.getUndoClass = function()
{
	return "UnfreezeColumnHeadings";
};

FreezeColumnHeadingsAction.prototype.getSelectedCrosstabOrListContainerLid = function()
{
	var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
	if (selectedObjects && selectedObjects.length && 
			(selectedObjects[0].getDataContainerType() == "crosstab" ||
			 selectedObjects[0].getDataContainerType() == "list")) {
		var lid=(selectedObjects[0].getLayoutElementId());
		if (lid) {
			return lid;
		}
	}
	return null;
};

/**
 * return the selected container id (without namespace) if it is valid for pin freeze Columns (ie: its a crosstab)
 */
FreezeColumnHeadingsAction.prototype.getSelectedCrosstabOrListContainerId = function()
{
	var lid = this.getSelectedCrosstabOrListContainerLid();
	if (lid) {
		return this.removeNamespace(lid);
	}
	return null;
};

/**
 * Column headings can be frozen if the layout type is right and the Column headings aren't already frozen.
 */
FreezeColumnHeadingsAction.prototype.canFreezeColumnHeadings = function()
{
	var pfManager = this.m_oCV.getPinFreezeManager();
	if (pfManager) {
		var containerId=this.getSelectedCrosstabOrListContainerId();
		if (containerId) {
			if(!pfManager.hasFrozenColumnHeadings(containerId) && pfManager.getValidSelectedContainerId(true)) {
				return true;
			}
		}
		return false;
	}
};


FreezeColumnHeadingsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.canFreezeColumnHeadings();
	return jsonSpec;
};
