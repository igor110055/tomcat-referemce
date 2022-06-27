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
 * DrillUpAction - implements drill up in cognos viewer
 */
function DrillUpAction()
{
	this.m_sAction = "DrillUp";
}

DrillUpAction.prototype = new DrillAction();

DrillUpAction.prototype.updateMenu = function(jsonSpec) {
	return jsonSpec;
};

DrillUpAction.prototype.execute = function() {
	var oCV = this.getCognosViewer();
	var drillMgr = oCV.getDrillMgr();
	
	if(drillMgr.canDrillUp() == false) {
		// add error handling
		return;
	}

	var drillParams = drillMgr.rvBuildXMLDrillParameters("drillUp", this.m_userSelectedDrillItem);
	var refQuery = drillMgr.getRefQuery();

	if (oCV.envParams["cv.containerApp"] == "AA")
	{
		oCV.m_viewerFragment.raiseAADrillUpEvent();
	}

	this.submitDrillRequest(drillParams, "up", refQuery);
};
