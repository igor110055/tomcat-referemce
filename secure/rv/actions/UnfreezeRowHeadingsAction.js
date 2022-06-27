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

function UnfreezeRowHeadingsAction()
{
}
 
UnfreezeRowHeadingsAction.prototype = new UndoableClientActionBase();
UnfreezeRowHeadingsAction.superclass = UndoableClientActionBase.prototype;

UnfreezeRowHeadingsAction.prototype.execute = function()
{
	if (this.m_oCV.getPinFreezeManager()) {
		var oReportDiv = document.getElementById("CVReport" + this.m_oCV.getId());
		var containerId = this.m_sContainerId ? this.m_sContainerId : this.getSelectedContainerId();

		//Selection borders in high contrast mode aren't cleaned up properly when cloned, 
		//so remove all selections before performing unfreeze
		this.m_oCV.getSelectionController().resetSelections();
		
		this.m_oCV.getPinFreezeManager().unfreezeContainerRowHeadings(containerId, oReportDiv);
		
		this.addClientSideUndo(this, [containerId]);		
	}
};

UnfreezeRowHeadingsAction.prototype.getUndoHint = function() 
{
	return RV_RES.IDS_JS_UNFREEZEROWHEADINGS;	
};

UnfreezeRowHeadingsAction.prototype.getUndoClass = function()
{
	return "FreezeRowHeadings";
};

/**
 * return true if the row headings for the selected container are frozen
 */
UnfreezeRowHeadingsAction.prototype.areRowHeadingsFrozen = function()
{
	if (this.m_oCV.getPinFreezeManager() &&	this.m_oCV.getPinFreezeManager().hasFrozenRowHeadings(this.getSelectedContainerId())) {
		return true;
	}
	return false;
};

UnfreezeRowHeadingsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.areRowHeadingsFrozen();
	return jsonSpec;
};
