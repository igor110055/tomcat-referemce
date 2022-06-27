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
 * Override the updateMenu method since Mobile wants to hide the drill up
 * menu item when the current selection doesn't support drill up
 */
DrillUpAction.prototype.updateMenu = function(jsonSpec) {
	var drillMgr = this.getCognosViewer().getDrillMgr();

	if(drillMgr && drillMgr.canDrillUp() == false) {
		jsonSpec.visible = false;
	}
	else {
		jsonSpec.visible = true;
		DrillContextMenuHelper.updateDrillMenuItems(jsonSpec, this.m_oCV, this.m_sAction);
	}
	
	return jsonSpec;
};
