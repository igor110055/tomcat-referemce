/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2016
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/*
 * DispatcherEntry classes are used for sending http requests from the Viewer.
 *
 * Hierarchy of classes
 *
 * DispatcherEntry
 *		AsynchDataDispatcherEntry
 *			ModifyReportDispatcherEntry
 *			ReportDispatcherEntry
 *				ViewerDispatcherEntry
 *		AsynchJSONDispatcherEntry
 *			ReportInfoDispatcherEntry
 *		DataDispatcherEntry
 *		JSONDispatcherEntry
 *
 * DispatcherEntry:	This is the base class for all requests sent by the Viewer. It provides defaults for handling faults,
 *					working and passport timeouts. It adds common form fields that ALL requests should have,
 *					for example b_action=cognosViewer. By default it will use a basic XmlHttpObject to do the request
 *
 * AsynchDataDispatcherEntry:	This class should be used when needing to make an asynch request that returns a DATA resposne.
 *								It'll create an asynchDATARequest object to make the http request as well as set
 *								the cv.resposneFormat to data.
 *
 * ModifyReportDispatcherEntry:	This class should be used when performing an action that will modify the report. It requires an
 *							action object to be set via the initializeAction method.
 *
 * ReportDispatcherEntry:	This is the base class for all secondary requests done to the report (page up, drill, change format, ...).
 *							It should be treated as an abstract class and never be created directly. It will add common form fields
 *							needed for secondary requests (tracking, conversation, ...) and it will handle updating UI with the response
 *
 * ViewerDispatcherEntry:	This class can be found under 3 different folders (fragments, iWidget, standalone) depending where
 *							the Viewer is being used. This is the class you should use/create for all secondary requests. Any formfields
 *							that are specific to fragments, iWidget or standalone should be added to these classes
 *
 * AsynchJSONDispatcherEntry:	This class should be used when needing to make an asynch request that returns a JSON response. It'll
 *								create an asynchJSONRequest object to make the http request as well as set the cv.resposneFormat to asynchJSON
 *
 * ReportInfoDispatcherEntry:	This class is used to gather information about the report (collectFilterableItems, collectFilterValues, getInfo)
 *
 * DataDispatcherEntry:	This class should be used when needing to make a request that returns a data response.
 *
 * JSONDispatcherEntry: This class should be used when needing to make a request that returns a json response.
 *
 *
 * There are a few different ways to modify the default behavior of the dispatcherEntry classes.
 *
 * 1. Setting your own callback. By default all the callbacks are taken care of and the only one you need to specify
 * is the callback for complete. However, you can override the default callbacks by simply calling setCallbacks and specify
 * any of the callbacks you wish to override. For example, if I wanted to change the behavior of handling faults so that my function
 * would get called, I'd do the following, where this.onFault is a function that I'd implement.
 *
 *		oDispatcherEntry.setCallbacks( {
 *			"complete" : {"object":this, "method":this.onComplete},
 *			"fault" : {"object" : this, "method" : this.onFault}
 *		});
 *
 * The list of possible callbacks are:
 *		complete: gets called when the response is complete
 *		postComplete: 	last thing that will get called, useful if you want the normal complete 
 *						code execute and get called back when it's all done
 *		working: gets called if the asynch response has a status of working or stillWorking. Note, the wait request
 *				will still get sent internally. This callback is simply if you need to do something
 *				before the wait request is sent.
 *		error: gets called if an http error happened
 *		cancel: gets called when a request was canceled
 *		prompting: gets called when the response has a status of prompting
 *		passportTimeout: gets called when the response contains a passportTimeout fault
 *		fault: gets called when the response has a status of fault
 *		closeErrorDlg: gets called when the user closes the log on dialog without login in or if he hits Ok on a fault dialog
 *
 * 2. Setting your own dialogs for the request indicator and/or working dialog. By default, only the ModifyReportDispatcherEntry and
 * ReportDispatcherEntry classes will show feedback to the user in the UI that a request is executing. You can override that behavior for
 * any of the dispatcherEntry classes by calling set setWorkingDialog and/or setRequestIndicator. The dialog you pass to those functions
 * needs to extend the IRequestIndicator class.
 */
function DispatcherEntry(oCV)
{
	this.m_oCV = oCV;
	this.m_requestKey = null;
	this.m_canBeQueued = false;
	this.m_originalFormFields = null;
	this.m_bUsePageRequest = false;

	if (oCV) {
		if (!this.m_request) {
			this.m_request = new XmlHttpObject();
			this.m_request.init("POST", this.m_oCV.getGateway(), "", true);
		}

		if (!this.m_requestHandler) {
			this.setRequestHandler(new BaseRequestHandler(oCV));
		}

		DispatcherEntry.prototype.setDefaultFormFields.call(this);

		this.setCallbacks( {
			"entryComplete" : {"object":this, "method":this.onEntryComplete},
			"entryFault" : {"object":this, "method":this.onEntryFault},
			"newRequest" : {"object":this, "method": this.onNewRequest},
			"fault" : {"object" : this, "method" : this.onFault},
			"error" : {"object" : this, "method" : this.onError},
			"passportTimeout" : {"object" : this, "method" : this.onPassportTimeout},
			"working" : {"object" : this, "method" : this.onWorking },
			"prompting" : {"object" : this, "method" : this.onPrompting},
			"preHttpRequest" : {"object" : this, "method" : this.onPreHttpRequest},
			"postHttpRequest" : {"object" : this, "method" : this.onPostHttpRequest},
			"postEntryComplete" : { "object" : this, 'method' : this.onPostEntryComplete}
		});
	}
}

DispatcherEntry.prototype.setHeaders = function(headers) {
	this.m_request.setHeaders(headers);
};

DispatcherEntry.prototype.getHeaders = function() {
	return this.m_request.getHeaders();
};

DispatcherEntry.prototype.setOriginalFormFields = function(formFields) {
	this.m_originalFormFields = formFields;
};

DispatcherEntry.prototype.getOriginalFormFields = function() {
	return this.m_originalFormFields;
};

DispatcherEntry.prototype.setRequestHandler = function(handler) {
	// This is the central location where we can override some of the status callbacks
	handler.addCallbackHooks();
	this.m_requestHandler = handler;
};

DispatcherEntry.prototype.getRequestHandler = function() {
	return this.m_requestHandler;
};

DispatcherEntry.prototype.setWorkingDialog = function(workingDialog) {
	if (this.getRequestHandler()) {
		this.m_requestHandler.setWorkingDialog(workingDialog);
	}
};

DispatcherEntry.prototype.setRequestIndicator = function(requestIndicator) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().setRequestIndicator(requestIndicator);
	}
};

DispatcherEntry.prototype.forceSynchronous = function() {
	this.getRequest().forceSynchronous();
};

DispatcherEntry.prototype.setUsePageRequest = function(bUsePageRequest) {
	this.m_bUsePageRequest = bUsePageRequest;
};

DispatcherEntry.prototype.getUsePageRequest = function() {
	return this.m_bUsePageRequest;
};

/**
 * Add any form fields that ALL request should have
 */
DispatcherEntry.prototype.setDefaultFormFields = function() {
	var envParams = this.getViewer().envParams;
	this.addFormField("b_action", "cognosViewer");
	this.addFormField("cv.catchLogOnFault", "true");
	this.addDefinedNonNullFormField("protectParameters", envParams["protectParameters"]);
	this.addDefinedNonNullFormField("ui.routingServerGroup", envParams["ui.routingServerGroup"]);
	this.addDefinedNonNullFormField("cv.debugDirectory", envParams["cv.debugDirectory"]);
	this.addDefinedNonNullFormField("cv.showFaultPage", envParams["cv.showFaultPage"]);
	this.addDefinedNonNullFormField("cv.useRAPDrill", envParams["cv.useRAPDrill"]);
	this.addDefinedNonNullFormField("container", envParams["container"]);
	this.addNonEmptyStringFormField("cv.objectPermissions", envParams["cv.objectPermissions"]);
};

DispatcherEntry.prototype.getViewer = function() {
	return this.m_oCV;
};

DispatcherEntry.prototype.prepareRequest = function()
{
	// Will get called before the request is executed.
};

DispatcherEntry.addWidgetInfoToFormFields = function(oWidget/*ViewerIWdiget Object*/, oDispatcherEntry/*DispatcherEntry Object*/){	
	if(oWidget){ 		
		var sBUXRTStateInfo = oWidget.getBUXRTStateInfoMap();	
		if(sBUXRTStateInfo){
			oDispatcherEntry.addFormField("cv.buxRTStateInfo",sBUXRTStateInfo);
		}
		var sDisplayName = oWidget.getDisplayName();
		if(sDisplayName && sDisplayName.length >0){
			oDispatcherEntry.addFormField("displayTitle", sDisplayName);
		}
	}
};

DispatcherEntry.prototype.canBeQueued = function() {
	return this.m_canBeQueued;
};

DispatcherEntry.prototype.setCanBeQueued = function(canBeQueued) {
	this.m_canBeQueued = canBeQueued;
};

DispatcherEntry.prototype.getKey = function() {
	return this.m_requestKey;
};

DispatcherEntry.prototype.setKey = function(key) {
	this.m_requestKey = key;
};

/**
 * The request must be of type XmlHttpObject or extend that class
 * @param {Object} request
 */
DispatcherEntry.prototype.setRequest = function(request) {
	this.m_request = request;
};

DispatcherEntry.prototype.getRequest = function() {
	return this.m_request;
};

/**
 * JSON structure of the following format
 * {	customArguments:[arg1, arg2, ...],
 *		"complete": {"object" : obj, "method": method},
 *		"prompting": {"object" : obj, "method": method},
 *		...
 *	};
 *
 * Possible callbacks
 * complete - gets called when the response is complete
 * working - gets called if the asynch response has a status of working or stillWorking
 * error - gets called if an http error happened
 * cancel - gets called when a request was canceled
 * prompting - gets called when the response has a status of prompting
 * passportTimeout - gets called when the response contains a passportTimeout fault
 * fault - gets called when the response has a status of fault
 * preHttpRequest - gets called right before the http request is sent
 * postHttpRequest - gets called right after the http response is received
 *
 */
DispatcherEntry.prototype.setCallbacks = function(callbacks) {
	this.getRequest().setCallbacks(callbacks);
};

DispatcherEntry.prototype.getCallbacks = function() {
	return this.getRequest().getCallbacks();
};

/**
 * Executes the request. Also adds in our own callbacks so that we're notified for a
 * fault or when the entry is complete, that way we can remove the entry from the queue
 */
DispatcherEntry.prototype.sendRequest = function() {
	this.prepareRequest();

	// save the original form fields, in case we have to retry the request
	var formFields = this.getRequest().getFormFields();
	var formFieldNames = formFields.keys();
	if (!this.m_originalFormFields) {
		this.m_originalFormFields = new CDictionary();
		for (var index = 0; index < formFieldNames.length; index++) {
			this.m_originalFormFields.add(formFieldNames[index], formFields.get(formFieldNames[index]));
		}
	}

	this.getRequest().sendRequest();
};

/**
 * Callback for when the request object creates a new request internaly so
 * that we know about the new request object. This will happen most often
 * for waits
 * @param {Object} request
 */
DispatcherEntry.prototype.onNewRequest = function(request) {
	this.setRequest(request);
};

/**
 * Will retry the original request
 */
DispatcherEntry.prototype.retryRequest = function() {
	var oCV = this.getViewer();
	oCV.setRetryDispatcherEntry(null);

	var request = this.getRequest().newRequest();
	request.setHeaders(null);
	this.setRequest(request);

	var formFieldNames = this.m_originalFormFields.keys();
	for (var index = 0; index < formFieldNames.length; index++) {
		var formField = formFieldNames[index];
		var formFieldValue = this.m_originalFormFields.get(formField);

		if (formField == "cv.responseFormat" && formFieldValue == "iWidget") {
			this.addFormField("cv.responseFormat", "data");
		}
		else if (formField == "ui.action" && formFieldValue == "wait") {
			this.addFormField("ui.action", this.m_originalFormFields.get("ui.primaryAction"));
		}
		else if(formField != "m_tracking" && formField != "cv.outputKey") {
			this.addFormField(formField, formFieldValue);
		}
	}

	this.addFormField("widget.reloadToolbar", "true");
	if (this.m_oCV.getViewerWidget()) {
		this.addFormField("cv.buxCurrentUserRole", this.m_oCV.getViewerWidget().getUserRole());
	}

	this.addNonEmptyStringFormField("cv.objectPermissions", oCV.envParams["cv.objectPermissions"]);
	this.addNonEmptyStringFormField("limitedInteractiveMode", oCV.envParams["limitedInteractiveMode"]);

	this.m_oCV.getViewerDispatcher().dispatchRequest(this);
};

DispatcherEntry.prototype.abortHttpRequest = function() {
	// guard against sending multiple cancel requests
	if (!this.m_bCancelCalled) {
		if (this.getRequestHandler()) {
			this.getRequestHandler().onCancel();
		}
		this.m_bCancelCalled = true;
		this.getRequest().abortHttpRequest();
		this.onEntryComplete();
	}
};

DispatcherEntry.prototype.cancelRequest = function(forceSynchronous) {
	// guard against sending multiple cancel requests
	if (!this.m_bCancelCalled) {
		this.m_bCancelCalled = true;
		if (this.getRequestHandler()) {
			this.getRequestHandler().onCancel();
		}

		if (forceSynchronous) {
			this.getRequest().forceSynchronous();
		}
		this.getRequest().cancel();
		this.onEntryComplete();
	}
};

DispatcherEntry.prototype.getFormFields = function() {
	return this.m_request.getFormFields();
};

DispatcherEntry.prototype.getFormField = function(name) {
	if (this.m_request) {
		return this.m_request.getFormField(name);
	} else {
		return "";
	}
};

DispatcherEntry.prototype.clearFormFields = function() {
	this.m_request.clearFormFields();
};

DispatcherEntry.prototype.formFieldExists = function(name) {
	if (this.m_request) {
		return this.m_request.getFormFields().exists(name);
	}

	return false;
};

DispatcherEntry.prototype.removeFormField = function(name) {
	if (this.formFieldExists(name)) {
		this.m_request.getFormFields().remove(name);
	}
};

DispatcherEntry.prototype.addFormField = function(name, value) {
	this.m_request.addFormField(name, value);
};

DispatcherEntry.prototype.addDefinedNonNullFormField = function(name, value) {
	if (typeof value != "undefined" && value != null) {
		this.addFormField(name, value);
	}
};


DispatcherEntry.prototype.addDefinedFormField = function(name, value) {
	if (typeof value != "undefined") {
		this.addFormField(name, value);
	}
};

DispatcherEntry.prototype.addNonNullFormField = function(name, value) {
	if (value != null) {
		this.addFormField(name, value);
	}
};

DispatcherEntry.prototype.addNonEmptyStringFormField = function(name, value) {
	if (typeof value != "undefined" && value != null && value != "") {
		this.addFormField(name, value);
	}
};

DispatcherEntry.prototype.onWorking = function(response, arg1) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().onWorking(response);
	}
};

/**
 * onFault is called when we got a SOAP fault back
 */
DispatcherEntry.prototype.onFault = function(response) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().onFault(response);
	}
};

/**
 * onError is called when we got an http error.
 */
DispatcherEntry.prototype.onError = function(response) {
	// When we abort an http request (cancel) we'll also get an error. Simply ignore it.
	if (this.m_bCancelCalled) {
		return;
	}
	
	if (this.getRequestHandler()) {
		this.getRequestHandler().onError(response);
	}
};

/**
 * We're not a 100% that the user will leave the page but we still need to unhook the http error
 * handling in case he does leave the page so that the cancelled http request error doesn't show up in the UI
 */
DispatcherEntry.prototype.possibleUnloadEvent = function() {
	this.setCallbacks( {"error" : {} });
};

DispatcherEntry.prototype.onPreHttpRequest = function(request) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().preHttpRequest(request);
	}
};

DispatcherEntry.prototype.onPostHttpRequest = function(response) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().postHttpRequest(response);
	}
};

DispatcherEntry.prototype.onPassportTimeout = function(response) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().onPassportTimeout(response);
	}
};

DispatcherEntry.prototype.onPrompting = function(response) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().onPrompting(response);
	}
};

/**
 * Callback when the request is complete so that we can remove
 * the dispatcher entry from the queue before processing the response
 * @param {Object} response
 */
DispatcherEntry.prototype.onEntryComplete = function(response) {
	if (!this.m_oCV._beingDestroyed) {
		this.m_oCV.getViewerDispatcher().requestComplete(this);
	}
};

/**
 * Callback when the request generates a fault so that we can remove the dispatcher entry
 * from the queue before processing the response
 * @param {Object} response
 */
DispatcherEntry.prototype.onEntryFault = function(response) {
	this.m_oCV.setFaultDispatcherEntry(this);
	this.m_oCV.resetViewerDispatcher();
	if (!this.m_bCancelCalled) {
		this.m_oCV.setRetryDispatcherEntry(this);
	}
};

/**
 * Called when the user closes the log on dialog without login in or closes the fault dialog
 */
DispatcherEntry.prototype.onCloseErrorDlg = function() {
	var callbacks = this.getCallbacks();
	if (callbacks["closeErrorDlg"]) {
		var callbackFunc = GUtil.generateCallback(callbacks["closeErrorDlg"].method, [], callbacks["closeErrorDlg"].object);
		callbackFunc();
	}
};

DispatcherEntry.prototype.onPostEntryComplete = function() {	
	if (this.getRequestHandler()) {
		this.getRequestHandler().onPostEntryComplete();
	}

	this.executeCallback("postComplete");
};

DispatcherEntry.prototype.executeCallback = function(callback) {
	var callbacks = this.getCallbacks();
	if (callbacks[callback]) {
		var callbackArguments = (callbacks.customArguments)?[this, callbacks.customArguments]: [this];		
		var callbackFunc = GUtil.generateCallback(callbacks[callback].method, callbackArguments, callbacks[callback].object);
		callbackFunc();
		return true;
	}
	
	return false;
};

