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

function RefreshActiveReportAction()
{
	this.m_sAction = "RefreshActiveReport";
}

RefreshActiveReportAction.prototype = new CognosViewerAction();

RefreshActiveReportAction.prototype.execute = function()
{
	var viewerWidget = this.m_oCV.getViewerWidget();
	var activeReportIframe = dojo.byId(viewerWidget.getIFrameId());
	var srcUrl = activeReportIframe.src;
	activeReportIframe.src = srcUrl;
	viewerWidget.showLoading();
};