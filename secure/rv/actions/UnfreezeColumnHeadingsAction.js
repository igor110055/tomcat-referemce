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

function UnfreezeColumnHeadingsAction()
{
}
 
UnfreezeColumnHeadingsAction.prototype = new UndoableClientActionBase();
UnfreezeColumnHeadingsAction.superclass = UndoableClientActionBase.prototype;

UnfreezeColumnHeadingsAction.prototype.execute = function()
{
	if (this.m_oCV.getPinFreezeManager()) {
		var oReportDiv = document.getElementById("CVReport" + this.m_oCV.getId());
		var containerId = this.m_sContainerId ? this.m_sContainerId : this.getSelectedContainerId();
		
		//Selection borders in high contrast mode aren't cleaned up properly when cloned, 
		//so remove all selections before performing unfreeze
		this.m_oCV.getSelectionController().resetSelections();
		
		this.m_oCV.getPinFreezeManager().unfreezeContainerColumnHeadings(containerId, oReportDiv);
		
		this.addClientSideUndo(this, [containerId]);
	}
};

UnfreezeColumnHeadingsAction.prototype.getUndoHint = function() 
{
	return RV_RES.IDS_JS_UNFREEZECOLUMNHEADINGS;	
};

UnfreezeColumnHeadingsAction.prototype.getUndoClass = function()
{
	return "FreezeColumnHeadings";
};

/**
 * return true if the Column headings for the selected container are frozen
 */
UnfreezeColumnHeadingsAction.prototype.areColumnHeadingsFrozen = function()
{
	if (this.m_oCV.getPinFreezeManager() &&	this.m_oCV.getPinFreezeManager().hasFrozenColumnHeadings(this.getSelectedContainerId())) {
		return true;
	}
	return false;
};

UnfreezeColumnHeadingsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.areColumnHeadingsFrozen();
	return jsonSpec;
};
