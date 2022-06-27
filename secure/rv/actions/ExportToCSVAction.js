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

function ExportToCSVAction()
{
	this.m_format = "CSV";
}

ExportToCSVAction.prototype = new ExportFromIframeAction();

ExportToCSVAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_CSV;
};
