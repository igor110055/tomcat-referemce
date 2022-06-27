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

function ExportToExcel2007Action()
{
	this.m_format = "spreadsheetML";
}

ExportToExcel2007Action.prototype = new ExportFromIframeAction();

ExportToExcel2007Action.prototype.getWindowTitle = function()
{
	return RV_RES.RV_EXCEL_2007;
};