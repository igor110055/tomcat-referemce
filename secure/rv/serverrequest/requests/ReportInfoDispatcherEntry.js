/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/*
 *******************************************************************************
 *** View DispatcherEntry.js for information on the dispatcher entry classes ***
 *******************************************************************************
 */
function ReportInfoDispatcherEntry(oCV)
{
	ReportInfoDispatcherEntry.baseConstructor.call(this, oCV);
	
	if (oCV) {
		this.setCallbacks( {
			"complete" : {"object" : this, "method" : this.onComplete },
			"prompting": {"object": this, "method": this.onPrompting}
			});
		
		this.getRequestHandler().setFaultDialog(new ModalFaultDialog(oCV));
	}
}

ReportInfoDispatcherEntry.prototype = new AsynchJSONDispatcherEntry();
ReportInfoDispatcherEntry.baseConstructor = AsynchJSONDispatcherEntry;

ReportInfoDispatcherEntry.prototype.initializeAction = function(action)
{
	this.setKey(action.getActionKey());
	this.setCanBeQueued(action.canBeQueued());
	
	this.m_action = action;
};

ReportInfoDispatcherEntry.prototype.getAction = function() {
	return this.m_action;
};

ReportInfoDispatcherEntry.prototype.prepareRequest = function()
{
	var actionFormFields = new ActionFormFields(this);
	actionFormFields.addFormFields();
};

ReportInfoDispatcherEntry.prototype.onComplete = function(asynchJSONResponse, arg1)
{
	//The request for a single entry has completed...
	if (this.m_oCV.getViewerDispatcher().queueIsEmpty()==true) {
		var callbackFunction = this.m_action.getOnCompleteCallback();
		callbackFunction(asynchJSONResponse);
	}
};


ReportInfoDispatcherEntry.prototype.onPrompting = function(asynchJSONResponse, arg1)
{	
		var callbackFunction = this.m_action.getOnPromptingCallback();		
		 callbackFunction(asynchJSONResponse);			
};

ReportInfoDispatcherEntry.prototype.onPostEntryComplete = function()
{
	var oCV = this.getViewer();
	if (oCV && oCV.getViewerWidget()) {
		var cvWidget = oCV.getViewerWidget();
		cvWidget.getLoadManager().processQueue();
	}
};