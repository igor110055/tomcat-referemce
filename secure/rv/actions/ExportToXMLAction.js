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

function ExportToXMLAction()
{
	this.m_format = "XML";
}

ExportToXMLAction.prototype = new ExportFromIframeAction();

ExportToXMLAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_XML;
};