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

function RepromptRAPAction()
{
	this.m_sAction = "Reprompt";
}

RepromptRAPAction.prototype = new ModifyReportAction();

RepromptRAPAction.prototype.getPromptOption = function() { return "true"; };

RepromptRAPAction.prototype.isUndoable = function() { return false; };

RepromptRAPAction.prototype.reuseQuery =function() { return false; };

RepromptRAPAction.prototype.reuseGetParameter =function() { return false; };

RepromptRAPAction.prototype.keepFocusOnWidget = function() { return false; };

RepromptRAPAction.prototype.preProcess =function()
{
	var cv = this.getCognosViewer();
	cv.m_raiseSharePromptEvent = true;
};

RepromptRAPAction.prototype.addAdditionalOptions = function(cognosViewerRequest)
{
	cognosViewerRequest.addFormField("run.outputFormat", "HTML");
	cognosViewerRequest.addFormField("bux", "true");		
};
