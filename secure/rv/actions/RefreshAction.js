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

function RefreshAction()
{
	this.m_sAction = "Refresh";
}

RefreshAction.prototype = new RunReportAction();
RefreshAction.superclass = RunReportAction.prototype;

RefreshAction.prototype.execute = function()
{
	RefreshAction.superclass.execute.call(this);
};