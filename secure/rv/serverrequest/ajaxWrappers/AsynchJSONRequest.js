/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */


function AsynchJSONRequest(gateway, webContentRoot) {
	// initialize the base class
	AsynchJSONRequest.baseConstructor.call(this, gateway, webContentRoot);

	this.m_jsonResponse = null;
}

// set up the base class
AsynchJSONRequest.prototype = new AsynchRequest();
AsynchJSONRequest.baseConstructor = AsynchRequest;


AsynchJSONRequest.prototype.getJSONResponseObject = function() {
	if(this.m_jsonResponse == null) {
		if(this.getResponseHeader("Content-type").indexOf("application/json") != -1) {
			var text = this.getResponseText();
			if(text != null) {
				var validJson = this.removeInvalidCharacters(text);
				this.m_jsonResponse = eval("(" + validJson + ")");
			}
		}
	}
	return this.m_jsonResponse;
};

AsynchJSONRequest.prototype.getTracking = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return jsonResponse.tracking;
	}

	return "";
};

AsynchJSONRequest.prototype.getConversation = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return jsonResponse.conversation;
	}

	return "";
};

AsynchJSONRequest.prototype.getAsynchStatus = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return jsonResponse.status;
	}

	return "unknown";
};

AsynchJSONRequest.prototype.getPrimaryAction = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return jsonResponse.primaryAction;
	}

	return "";
};

AsynchJSONRequest.prototype.getActionState = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return jsonResponse.actionState;
	}

	return "";
};

AsynchJSONRequest.prototype.getDebugLogs = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return jsonResponse.debugLogs;
	}

	return "";
};

AsynchJSONRequest.prototype.isRAPWaitTrue = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return (jsonResponse.rapWait === "true");
	}

	return false;
};


AsynchJSONRequest.prototype.getRAPRequestCache = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		var requestCache = jsonResponse.rapRequestCache;
		if (requestCache !== null && typeof requestCache != "undefined" ) {
			return requestCache;
		}
	}

	return null;
};

AsynchJSONRequest.prototype.getMainConversation = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return jsonResponse.mainConversation;
	}

	return null;	
};

AsynchJSONRequest.prototype.getMainTracking = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse) {
		return jsonResponse.mainTracking;
	}

	return null;		
};

AsynchJSONRequest.prototype.getResult = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse && jsonResponse.json) {
		var validJson = this.removeInvalidCharacters(jsonResponse.json);
		return eval("(" + validJson + ")");
	}
	return null;
};

AsynchJSONRequest.prototype.removeInvalidCharacters = function(text) {
	if (text) {
		text = text.replace(/(\n|\r|\t)+/g,"");//characters throw exception in eval
	}
	return text;
};

AsynchJSONRequest.prototype.getPromptHTMLFragment = function() {
	var jsonResponse = this.getJSONResponseObject();
	if(jsonResponse && jsonResponse.promptHTMLFragment) {
		return jsonResponse.promptHTMLFragment;
	}
	return "";
};

AsynchJSONRequest.prototype.constructFaultEnvelope = function() {

	if(this.m_soapFault == null) {
		var jsonResponse = this.getJSONResponseObject();
		if(jsonResponse.status == "fault") {
			this.m_soapFault = XMLBuilderLoadXMLFromString(jsonResponse.fault);
		}
	}
	return this.m_soapFault;
};

AsynchJSONRequest.prototype.construct = function() {
	var asynchRequest = new AsynchJSONRequest(this.m_gateway, this.m_webContentRoot);
	asynchRequest.setCallbacks(this.m_callbacks);
	if (this.getFormFields().exists("cv.responseFormat")) {
		asynchRequest.addFormField("cv.responseFormat", this.getFormField("cv.responseFormat"));
	}
	else {
		asynchRequest.addFormField("cv.responseFormat", "asynchJSON");

	}	
	
	return asynchRequest;
};
