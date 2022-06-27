/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function RepromptAction()
{
	this.m_repromptAction = null;
}

RepromptAction.prototype = new CognosViewerAction();
RepromptAction.superclass = CognosViewerAction.prototype;

RepromptAction.prototype.updateMenu = function( jsonSpec )
{
	var oCV = this.getCognosViewer();
	jsonSpec.visible =  (!this.isPromptWidget() && oCV.hasPrompt() );
	if (!jsonSpec.visible) {
		jsonSpec.save = true;
	} else {
		delete jsonSpec.save;
	}
	return jsonSpec;
};

RepromptAction.prototype.setRequestParms = function(params) {
	RepromptAction.superclass.setRequestParms(params);
	if (params && params["preferencesChanged"]) {
		this["preferencesChanged"] = params["preferencesChanged"];
	}
};

RepromptAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();
	if( oCV.isLimitedInteractiveMode())
	{
		this.m_repromptAction = new RepromptRunAction();
	}
	else
	{
		this.m_repromptAction = new RepromptRAPAction();
	}

	this.m_repromptAction.setCognosViewer( oCV );
	if (this["preferencesChanged"]) {
		this.m_repromptAction.reuseConversation(false);
	}
	this.m_repromptAction.execute();
};
