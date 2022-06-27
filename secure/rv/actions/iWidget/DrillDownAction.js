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
 * DrillDownAction - implements drill down in cognos viewer
 */
function DrillDownAction()
{
	this.m_sAction = "DrillDown";
	//TODO make it so that we can use m_sAction instead of a separate parameter
	this.m_drillOption = "drillDown";
}

DrillDownAction.prototype = new DrillUpDownAction();

DrillDownAction.prototype.getUndoHint = function()
{
	return RV_RES.RV_DRILL_DOWN;
};

DrillDownAction.prototype.getHoverClassName = function() { return "dl"; };

DrillDownAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	this.updateDrillabilityFromSelections();

	if (!this.canDrillDown()) {
		jsonSpec.disabled = true;
	} else {
		jsonSpec.disabled = false;
		DrillContextMenuHelper.updateDrillMenuItems(jsonSpec, this.m_oCV, this.m_sAction);
	}
	return jsonSpec;
};
