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

function AsynchRequest(gateway, webContentRoot) {
	// initialize the base class
	AsynchRequest.baseConstructor.call(this);

	this.m_gateway = gateway;
	this.m_webContentRoot = webContentRoot;
	this.m_callbacks = {};
	
	this.m_soapFault = null;
	this.m_faultDialog = null;
	this.m_promptDialog = null;
	this.m_logonDialog = null;
}
// set up the base class
AsynchRequest.prototype = new XmlHttpObject();
AsynchRequest.baseConstructor = XmlHttpObject;
AsynchRequest.prototype.parent = XmlHttpObject.prototype;

AsynchRequest.prototype.getTracking = function() {return "";}; // treat as an abstract method
AsynchRequest.prototype.getConversation = function() {return "";}; // treat as an abstract method
AsynchRequest.prototype.getPrimaryAction = function() {return "";}; // treat as an abstract method
AsynchRequest.prototype.getActionState = function() {return "";}; // treat as an abstract method
AsynchRequest.prototype.getAsynchStatus = function() {return "";}; // treat as an abstract method
AsynchRequest.prototype.getResult = function() {return null;}; // treat as an abstract method
AsynchRequest.prototype.getSoapFault = function() { return this.m_soapFault; };
AsynchRequest.prototype.constructFaultEnvelope = function() { return null; }; // treat as an abstract method
AsynchRequest.prototype.getPromptHTMLFragment = function() {return "";};// treat as an abstract method
AsynchRequest.prototype.isRAPWaitTrue = function() {return false;}; // treat as an abstract method
AsynchRequest.prototype.getRAPRequestCache = function() { return null;}; // treat as an abstract method
AsynchRequest.prototype.getMainConversation = function() { return null;}; // treat as an abstract method
AsynchRequest.prototype.getMainTracking = function() { return null;}; // treat as an abstract method
AsynchRequest.prototype.construct = function() {}; // treat as an abstract method

/**
 * Executes a callback. Returns false if the callback wasn't found
 * @param {Object} callback
 */
AsynchRequest.prototype.executeCallback = function(callback) {
	if (this.m_callbacks[callback]) {
		var callbackArguments = this.concatResponseArguments(this.m_callbacks.customArguments);		
		var callbackFunc = GUtil.generateCallback(this.m_callbacks[callback].method, callbackArguments, this.m_callbacks[callback].object);
		callbackFunc();
		return true;
	}
	
	return false;
};

AsynchRequest.prototype.setCallbacks = function(callbacks) {
	if (!this.m_callbacks) {
		this.m_callbacks = {};
	}
	
	for (callback in callbacks) {
		this.m_callbacks[callback] = callbacks[callback];
	}
};

AsynchRequest.prototype.getCallbacks = function() {
	return this.m_callbacks;
};

AsynchRequest.prototype.newRequest = function() {
	var asynchRequest = this.construct();

	// copy any headers over
	asynchRequest.setHeaders(this.getHeaders());
	
	if (this.getFormFields().exists("b_action")) {
		asynchRequest.addFormField("b_action", this.getFormField("b_action"));
	}
	
	if (this.getFormFields().exists("cv.catchLogOnFault")) {
		asynchRequest.addFormField("cv.catchLogOnFault", this.getFormField("cv.catchLogOnFault"));
	}

	asynchRequest.setPromptDialog(this.m_promptDialog);
	asynchRequest.setFaultDialog(this.m_faultDialog);
	asynchRequest.setLogonDialog(this.m_logonDialog);
	asynchRequest.m_asynch = this.m_asynch;

	// if the request was sent using the dispatcher queue,
	// then it needs to be notified of the new request object
	if (this.m_callbacks.newRequest) {
		var newRequestCallback = GUtil.generateCallback(this.m_callbacks.newRequest.method, [asynchRequest], this.m_callbacks.newRequest.object);
		newRequestCallback();		
	}

	return asynchRequest;
};

AsynchRequest.prototype.success = function() {
	var asynchStatus = this.getAsynchStatus();
	
	switch(asynchStatus) {
		case "stillWorking":
		case "working":
			this.working();
			break;
		case "prompting":
			this.prompting();
			break;
		case "fault":
		case "complete":
		case "conversationComplete":
			this.complete();
			break;
		default:
			// the AsynchRequest class is sometimes used for non-asynch type requests.
			// if we diddn't get a status back simply call the complete callback
			this.complete();
			break;			
	}
};

AsynchRequest.prototype.setFaultDialog = function(faultDialog) {
	if(faultDialog instanceof IFaultDialog) {
		if(typeof console != "undefined") { 
			console.log("AsynchRequest.prototype.setFaultDialog is deprecated"); 
		} 		
		
		this.m_faultDialog = faultDialog;
	} else if(faultDialog && typeof console != "undefined") {
		console.log("The parameter faultDialog must be an instance of IFaultDialog");
	}
};

AsynchRequest.prototype.setPromptDialog = function(promptDialog) {	
	if(promptDialog instanceof IPromptDialog) {
		if(typeof console != "undefined") { 
			console.log("AsynchRequest.prototype.setPromptDialog is deprecated"); 
		} 	
		this.m_promptDialog = promptDialog;
	} else if(promptDialog && typeof console != "undefined") {
		console.log("The parameter promptDialog must be an instance of IPromptDialog");
	}
};

AsynchRequest.prototype.setLogonDialog = function(logonDialog) {
	if(logonDialog instanceof ILogOnDialog) {
		if(typeof console != "undefined") { 
			console.log("AsynchRequest.prototype.setLogonDialog is deprecated"); 
		} 	
		this.m_logonDialog = logonDialog;
	} else if(logonDialog && typeof console != "undefined") {
		console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
	}
};


AsynchRequest.prototype.resubmitRequest = function() {
	var asynchRequest = this.newRequest();
	asynchRequest.m_formFields = this.m_formFields;
	asynchRequest.sendRequest();
	return asynchRequest;
};

AsynchRequest.prototype.sendRequest = function() {
	var asynchRequest = this;
	var callbacks = {
		"complete":{"object":asynchRequest,"method":asynchRequest.successHandler},
		"fault":{"object":asynchRequest,"method":asynchRequest.errorHandler}
	};
	
	this.init("POST", this.m_gateway, "", this.m_asynch);

	this.executeCallback("preHttpRequest");

	this.parent.setCallbacks.call(this, callbacks);
	this.parent.sendRequest.call(this);
};

AsynchRequest.prototype.errorHandler = function() {
	this.executeCallback("postHttpRequest");

	// let the dispatcher queue know the request is done
	this.executeCallback("entryFault");

	this.executeCallback("error");
};

AsynchRequest.prototype.successHandler = function() {
	this.executeCallback("postHttpRequest");

	// hide any currently open dialogs
	if(typeof window["AsynchRequestPromptDialog"] != "undefined" && window["AsynchRequestPromptDialog"] != null) {
		window["AsynchRequestPromptDialog"].hide();
		window["AsynchRequestPromptDialog"] = null;
	}

	// check to see if dispatch caught the request and returned a login dialog
	if(this.getResponseHeader("Content-type").indexOf("text/html") != -1) {
		var responseText = this.getResponseText();
		if(responseText.indexOf("<ERROR_CODE>CAM_PASSPORT_ERROR</ERROR_CODE>") != -1) {
			this.passportTimeout();
		} else {
			// let the dispatcher queue know the request is done
			this.executeCallback("entryFault");

			if (!this.executeCallback("fault")) {
				// unknown/unexpected html response, throw it up in a new window
				var htmlWindow = window.open("","",'height=400,width=500');
				if(htmlWindow != null) {
					htmlWindow.document.write(responseText);
				}
			}
		}
	} else {
		// verify we didn't receive a fault
		this.m_soapFault = this.constructFaultEnvelope();
		if(this.m_soapFault != null) {
			var camElement = XMLHelper_FindChildByTagName(this.m_soapFault, "CAM", true);
			if(camElement != null && XMLHelper_FindChildByTagName(camElement, "promptInfo", true)) {
				this.passportTimeout();
			} else {
				this.fault();
			}
		} else {
			this.success();
		}
	}
};

AsynchRequest.prototype.cancel = function() {
	this.parent.cancel.call(this);
	
	// Create a new basic object to do the cancel
	var tracking = this.getFormField("m_tracking");
	if (tracking) {
		var request = new XmlHttpObject();
		request.init("POST", this.m_gateway, "", false);
		if (this.getFormField("cv.outputKey")) {
			request.addFormField("b_action", "cvx.high");
			request.addFormField("cv.outputKey", this.getFormField("cv.outputKey"));
			request.setHeaders(this.getHeaders());
		}
		else {
			request.addFormField("b_action", "cognosViewer");
		}
		request.addFormField("cv.responseFormat", "successfulRequest");		
		request.addFormField("ui.action", "cancel");
		request.addFormField("m_tracking", tracking);
		if (this.getFormField("cv.debugDirectory")) {
			request.addFormField("cv.debugDirectory", this.getFormField("cv.debugDirectory"));
		}		
		request.sendRequest();
		
		this.executeCallback("cancel");
	}	
};


AsynchRequest.prototype.working = function() {
	this.executeCallback("working");

	// ALWAYS handle the working internally
	var asynchRequest = this.newRequest();
	asynchRequest.addFormField("m_tracking", this.getTracking());
	if (this.getFormField("cv.outputKey")) {
		asynchRequest.addFormField("cv.outputKey", this.getFormField("cv.outputKey"));
		asynchRequest.addFormField("b_action", "cvx.high");
	}

	if (this.isRAPWaitTrue()) {
		// if rapWait is true, we can to send all parameters with current tracking again.
		asynchRequest.m_formFields = this.m_formFields;
		asynchRequest.addFormField("m_tracking", this.getTracking());
		asynchRequest.addFormField("rapWait", "true");
		var requestCache = this.getRAPRequestCache();
		if (requestCache !== null && typeof requestCache != "undefined" ) {
			asynchRequest.addFormField("rapRequestCache", requestCache);
		}
		
		var mainConversation = this.getMainConversation();
		if (mainConversation) {
			asynchRequest.addFormField("mainConversation", mainConversation);
		}

		var mainTracking = this.getMainTracking();
		if (mainTracking) {
			asynchRequest.addFormField("mainTracking", mainTracking);
		}

	} else {
		/**
		 * ****************************************************************************
		 * ANY CHANGES TO THESE PARAMETERS MUST ALSO BE MADE IN MobileXmlOutput.java
		 * ****************************************************************************
		 */
		asynchRequest.addFormField("ui.action", "wait");
		asynchRequest.addFormField("ui.primaryAction", this.getPrimaryAction());
		asynchRequest.addFormField("cv.actionState", this.getActionState());
		if (this.getFormField("ui.preserveRapTags")) {
			asynchRequest.addFormField("ui.preserveRapTags", this.getFormField("ui.preserveRapTags"));
		}
		if (this.getFormField("ui.backURL")) {
			asynchRequest.addFormField("ui.backURL", this.getFormField("ui.backURL"));		
		}
		if (this.getFormField("errURL")) {
			asynchRequest.addFormField("errURL", this.getFormField("errURL"));		
		}
		if (this.getFormField("cv.showFaultPage")) {
			asynchRequest.addFormField("cv.showFaultPage", this.getFormField("cv.showFaultPage"));		
		}
		if (this.getFormField("cv.catchLogOnFault")) {
			asynchRequest.addFormField("cv.catchLogOnFault", this.getFormField("cv.catchLogOnFault"));		
		}
	}

	if (this.getFormField("bux")) {
		asynchRequest.addFormField("bux", this.getFormField("bux"));		
	}		
	
	if ( this.getFormField("cv.debugDirectory")) {
		asynchRequest.addFormField("cv.debugDirectory",  this.getFormField("cv.debugDirectory"));
	}

	asynchRequest.sendRequest();
};

AsynchRequest.prototype.prompting = function() {
	// let the dispatcher queue know the request is done
	this.executeCallback("entryComplete");
	if(!this.executeCallback("prompting")) {
		if(this.m_promptDialog != null){
			this.showPromptPage();
		} else if(typeof console != "undefined") {
			console.log("An unhandled prompt response was returned: %o", this.xmlHttp);
		}
	}
	this.executeCallback("postEntryComplete");
};

AsynchRequest.prototype.promptPageOkCallback = function(promptValues) {
	var asynchRequest = this.newRequest();
	asynchRequest.addFormField("ui.action", "forward");
	asynchRequest.addFormField("m_tracking", this.getTracking());
	asynchRequest.addFormField("ui.conversation", this.getConversation());
	asynchRequest.addFormField("ui.primaryAction", this.getPrimaryAction());
	asynchRequest.addFormField("cv.actionState", this.getActionState());

	for(var promptValue in promptValues) {
		asynchRequest.addFormField(promptValue, promptValues[promptValue]);
	}

	asynchRequest.sendRequest();
	window["AsynchRequestObject"] = null;
};

AsynchRequest.prototype.promptPageCancelCallback = function() {
	window["AsynchRequestPromptDialog"].hide();
	this.complete();
};

AsynchRequest.prototype.showPromptPage = function() {
	window["AsynchRequestObject"] = this;
	window["AsynchRequestPromptDialog"] = this.m_promptDialog;
	var cvIdParam = this.m_promptDialog.getViewerId() == null ? "" : "?cv.id=" + this.m_promptDialog.getViewerId();
	window["AsynchRequestPromptDialog"].initialize(this.m_webContentRoot + "/rv/showStandalonePrompts.html" + cvIdParam, 400, 400);
	window["AsynchRequestPromptDialog"].show();
};

AsynchRequest.prototype.passportTimeout = function() {
	// let the dispatcher queue know the request is done
	this.executeCallback("entryFault");
	
	if(!this.executeCallback("passportTimeout")) {
		if(this.m_logonDialog != null) {
			this.m_logonDialog.show(response.getSoapFault());
		} else if(typeof console != "undefined") {
			console.log("An unhandled passport timeout fault was returned: %o", this.getSoapFault());
		}
	}
};

AsynchRequest.prototype.fault = function() {
	// let the dispatcher queue know the request is done
	this.executeCallback("entryFault");

	if(!this.executeCallback("fault")) {
		if(this.m_faultDialog != null) {
			this.m_faultDialog.show(this.getSoapFault());
		} else if(typeof console != "undefined") {
			console.log("An unhandled soap fault was returned: %o", this.getSoapFault());
		}
	}
};

AsynchRequest.prototype.complete = function() {
	// let the dispatcher queue know the request is done
	this.executeCallback("entryComplete");

	this.executeCallback("complete");
	
	this.executeCallback( "postEntryComplete" );
};

AsynchRequest.prototype.getSoapFaultCode = function() {
	var soapFault = this.constructFaultEnvelope();
	if(soapFault) {
			var faultCode = XMLHelper_FindChildByTagName(soapFault, "faultcode", true);
			if(faultCode != null) {
				return XMLHelper_GetText(faultCode);
			}
	}
	return null;
};

AsynchRequest.prototype.getSoapFaultDetailMessageString = function() {
	var soapFault = this.constructFaultEnvelope();
	if(soapFault) {
			var entry = XMLHelper_FindChildByTagName(soapFault, "messageString", true);
			if(entry != null) {
				return XMLHelper_GetText(entry);
			}
	}
	return null;
};
