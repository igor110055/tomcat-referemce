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

function RepromptRunAction(){}

RepromptRunAction.prototype = new RunReportAction();

RepromptRunAction.prototype.reuseQuery =function() { return false; };

RepromptRunAction.prototype.reuseGetParameter =function() { return false; };

RepromptRunAction.prototype.preProcess =function()
{
	var cv = this.getCognosViewer();
	cv.m_raiseSharePromptEvent = true;
};

RepromptRunAction.prototype.getPromptOption = function() { return "true"; };

