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
 * DrillDownAction - implements drill down in cognos viewer
 */
function DrillDownAction()
{
	this.m_sAction = "DrillDown";
}

DrillDownAction.prototype = new DrillAction();


DrillDownAction.prototype.updateMenu = function(jsonSpec) {
	return jsonSpec;
};

DrillDownAction.prototype.execute = function() {
	var oCV = this.getCognosViewer();
	var drillMgr = oCV.getDrillMgr();
	
	if(drillMgr.canDrillDown() == false) {
		return;
	}
	
	var drillParams = drillMgr.rvBuildXMLDrillParameters("drillDown", this.m_userSelectedDrillItem);
	var refQuery = drillMgr.getRefQuery();

	if (oCV.envParams["cv.id"] == "AA")	{
		oCV.m_viewerFragment.raiseAADrillDownEvent();
	}

	this.submitDrillRequest(drillParams, "down", refQuery);
};