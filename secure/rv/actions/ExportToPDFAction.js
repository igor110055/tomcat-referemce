/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToPDFAction()
{
	this.m_format = "PDF";
}

ExportToPDFAction.prototype = new ExportFromIframeAction();

ExportToPDFAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_PDF;
};
