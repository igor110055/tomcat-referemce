/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2012, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToExcel2007DataAction()
{
	//this.m_format = "spreadsheetML";
	this.m_format = "xlsxData";
}

ExportToExcel2007DataAction.prototype = new ExportFromIframeAction();

ExportToExcel2007DataAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_EXCEL_2007_DATA; 
};