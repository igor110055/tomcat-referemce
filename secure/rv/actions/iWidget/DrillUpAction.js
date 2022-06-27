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

/**
 * DrillUpAction - implements drill up in cognos viewer
 */
function DrillUpAction()
{
	this.m_sAction = "DrillUp";
	this.m_drillOption = "drillUp";
}

DrillUpAction.prototype = new DrillUpDownAction();
DrillUpAction.prototype.getHoverClassName = function() { return "dl"; };

DrillUpAction.prototype.getUndoHint = function()
{
	return RV_RES.RV_DRILL_UP;
};

DrillUpAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	this.updateDrillabilityFromSelections();

	if (!this.canDrillUp()) {
		jsonSpec.disabled = true;
	} else {
		jsonSpec.disabled = false;
		DrillContextMenuHelper.updateDrillMenuItems(jsonSpec, this.m_oCV, this.m_sAction);
	}
	return jsonSpec;
};
