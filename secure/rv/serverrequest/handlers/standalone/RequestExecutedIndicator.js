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
 
function RequestExecutedIndicator( cognosViewer)
{
	if (cognosViewer) {
		RequestExecutedIndicator.baseConstructor.call( this, cognosViewer );
	}
};

RequestExecutedIndicator.baseConstructor = WorkingDialog;
 
RequestExecutedIndicator.prototype = new WorkingDialog();
 
/**
 * returns the html for a very simple wait dialog with a wait icon and some text.
 */
RequestExecutedIndicator.prototype.renderHTML = function()
{
	var waitPageHtml = "<table id=\"CVWaitTable" + this.getNamespace() + "\" requestExecutionIndicator=\"true\" class=\"viewerWorkingDialog\" role=\"presentation\">";
	waitPageHtml += "<tr><td align=\"center\">";
	waitPageHtml += "<div class=\"body_dialog_modal\">";
	waitPageHtml += "<table align=\"center\" cellspacing=\"0\" cellpadding=\"0\" style=\"vertical-align:middle; text-align: left;\" role=\"presentation\">";
	waitPageHtml += "<tr><td rowspan=\"2\">";
	waitPageHtml += "<img alt=\"" + RV_RES.GOTO_WORKING + "\" src=\"" + this.getCognosViewer().getSkin() + "/branding/progress.gif\" style=\"margin:5px;\" width=\"48\" height=\"48\" name=\"progress\"/>";
	waitPageHtml += "</td><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
	waitPageHtml += RV_RES.GOTO_WORKING;
	waitPageHtml += "</span></td></tr><tr><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
	waitPageHtml += RV_RES.RV_PLEASE_WAIT;
	waitPageHtml += "</span></td></tr><tr><td style=\"height:7px;\" colspan=\"2\"></td></tr></table></div></td></tr></table>";

	return waitPageHtml;
};

RequestExecutedIndicator.prototype.getContainerId = function() {
	return "CVWaitindicator" + this.getNamespace();
};


