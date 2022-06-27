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

function DrillAction()
{
}
DrillAction.prototype = new CognosViewerAction();

/**
 * Only set when the user has picked a specific entry off of the drill down or up subMenu
 */
DrillAction.prototype.setRequestParms = function(parms) {
	if (parms && parms.userSelectedDrillItem) {
		this.m_userSelectedDrillItem = parms.userSelectedDrillItem;
	}
};

DrillAction.prototype.submitDrillRequest = function(drillParams, drillOption, drillRefQuery) {
	var oCV = this.getCognosViewer();
	var oReq = new ViewerDispatcherEntry(oCV);
	oReq.addFormField("ui.action", "drill");
	oReq.addFormField("rv_drillOption", drillOption);
	oReq.addFormField("rv_drillparams", drillParams);
	oReq.addFormField("rv_drillRefQuery", drillRefQuery);
	oCV.dispatchRequest(oReq);	
};
