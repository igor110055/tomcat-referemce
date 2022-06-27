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

function FreezeRowHeadingsAction()
{
}
 
FreezeRowHeadingsAction.prototype = new UndoableClientActionBase();
FreezeRowHeadingsAction.superclass = UndoableClientActionBase.prototype;

FreezeRowHeadingsAction.prototype.execute = function()
{
	var lidToFreeze = this.m_sContainerId? this.m_sContainerId : this.getSelectedCrosstabContainerId();
	if (lidToFreeze) {
		//Selection borders in high contrast mode aren't cleaned up properly when cloned, 
		//so remove all selections before performing freeze
		this.m_oCV.getSelectionController().resetSelections();
		
		this.m_oCV.getPinFreezeManager().freezeContainerRowHeadings(lidToFreeze);
		this.addClientSideUndo(this, [lidToFreeze]);
	}
};

FreezeRowHeadingsAction.prototype.getUndoHint = function() 
{
	return RV_RES.IDS_JS_FREEZEROWHEADINGS;	
};

FreezeRowHeadingsAction.prototype.getUndoClass = function()
{
	return "UnfreezeRowHeadings";
};

FreezeRowHeadingsAction.prototype.getSelectedCrosstabContainerLid = function()
{
	var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
	if (selectedObjects && selectedObjects.length && selectedObjects[0].getDataContainerType() == "crosstab") {
		var lid=(selectedObjects[0].getLayoutElementId());
		if (lid) {
			return lid;
		}
	}
	return null;
};

/**
 * return the selected container id (without namespace) if it is valid for pin freeze rows (ie: its a crosstab)
 */
FreezeRowHeadingsAction.prototype.getSelectedCrosstabContainerId = function()
{
	var lid = this.getSelectedCrosstabContainerLid();
	if (lid) {
		return this.removeNamespace(lid);
	}
	return null;
};

/**
 * row headings can be frozen if the layout type is right and the row headings aren't already frozen.
 */
FreezeRowHeadingsAction.prototype.canFreezeRowHeadings = function()
{
	var pfManager = this.m_oCV.getPinFreezeManager();
	if (pfManager) {
		var containerId=this.getSelectedCrosstabContainerId();
		if (containerId) {
			if(!pfManager.hasFrozenRowHeadings(containerId) && pfManager.getValidSelectedContainerId(false)) {
				return true;
			}
		}
	}
	return false;
};

FreezeRowHeadingsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.canFreezeRowHeadings();
	return jsonSpec;
};
