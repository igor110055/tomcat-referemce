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

// This action is used to rerender the html output, using the same query
function RedrawAction() {
	this.m_specUpdated = false;
}
RedrawAction.prototype = new ModifyReportAction();
RedrawAction.prototype.reuseQuery = function() { return true; };
RedrawAction.prototype.keepRAPCache = function() { return false; };

RedrawAction.prototype.setSpecUpdated = function(flag)
{
	this.m_specUpdated = flag;
};

RedrawAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_ADVANCED_EDITING;
};

RedrawAction.prototype.addActionContext = function()
{
	if (this.m_specUpdated) {
		return "<reportActions><GetInfo><specUpdatedInBUA/></GetInfo></reportActions>";
	}
	return "<reportActions><GetInfo/></reportActions>";
};



