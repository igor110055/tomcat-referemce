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


/**
 * This action is used when we get an event to refresh a view from the canvas
 */
function RefreshViewEventAction()
{
	this.m_bCanvasRefreshEvent = true;
}
RefreshViewEventAction.prototype = new RefreshViewAction();
