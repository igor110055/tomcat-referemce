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

function ExportToExcelSingleSheetAction()
{
	this.m_format = "singleXLS";
}

ExportToExcelSingleSheetAction.prototype = new ExportFromIframeAction();

ExportToExcelSingleSheetAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_EXCEL_2000SF;
};