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

function AsynchDATARequest(gateway, webContentRoot) {
	// initialize the base class
	AsynchDATARequest.baseConstructor.call(this, gateway, webContentRoot);

	this.m_oResponseState = null;
	this.m_sResponseState = null;
	this.m_endOfStateIdx = -1;
	this.cStatePrefix = "<xml><state>";
	this.cStateSuffix = "</state></xml>";
}

// A server request that expects a data response (state and HTML)
// set up the base class
AsynchDATARequest.prototype = new AsynchRequest();
AsynchDATARequest.baseConstructor = AsynchRequest;

AsynchDATARequest.prototype.getEndOfStateIdx = function() {
	if (this.m_endOfStateIdx==-1) {
		var prefix = this.getResponseText().substring(0,12);
		if (prefix==this.cStatePrefix) {
			this.m_endOfStateIdx = this.getResponseText().indexOf(this.cStateSuffix);
			if (this.m_endOfStateIdx!=-1) {
				this.m_endOfStateIdx+=this.cStateSuffix.length;
			}
		}
	}
	return this.m_endOfStateIdx;
};

AsynchDATARequest.prototype.getResponseStateText = function() {
	if (!this.m_sResponseState) {
		this.getResponseState();
	}
	
	return this.m_sResponseState;
};

AsynchDATARequest.prototype.getResponseState = function() {
	if(this.m_oResponseState==null && this.getEndOfStateIdx()!=-1) {
		this.m_sResponseState = this.getResponseText().substring(this.cStatePrefix.length, this.getEndOfStateIdx() - this.cStateSuffix.length);
		if(this.m_sResponseState != null) {
			this.m_sResponseState = xml_decode(this.m_sResponseState);
			this.m_oResponseState=eval("(" + this.m_sResponseState + ")");
		}
	}
	return this.m_oResponseState;
};

AsynchDATARequest.prototype.getAsynchStatus = function() {
	if (this.getResponseState()!=null && typeof this.getResponseState().m_sStatus != "undefined")	{
		return this.getResponseState().m_sStatus;
	}
	return "unknown";
};

AsynchDATARequest.prototype.getTracking = function() {
	if (this.getResponseState()!=null && typeof this.getResponseState().m_sTracking != "undefined") {
		return this.getResponseState().m_sTracking;
	}
	return "";
};

AsynchDATARequest.prototype.getConversation = function() {
	if (this.getResponseState()!=null && typeof this.getResponseState().m_sConversation != "undefined") {
		return this.getResponseState().m_sConversation;
	}
	return "";
};

AsynchDATARequest.prototype.getPrimaryAction = function() {
	if (this.getResponseState()!=null && typeof this.getResponseState().envParams != "undefined" && this.getResponseState().envParams["ui.primaryAction"] != "undefined") {
		return this.getResponseState().envParams["ui.primaryAction"];
	}
	return "";
};

AsynchDATARequest.prototype.getActionState = function() {
	if (this.getResponseState()!=null && typeof this.getResponseState().m_sActionState != "undefined") {
		return this.getResponseState().m_sActionState;
	}
	return "";
};

AsynchDATARequest.prototype.getResult = function() {
	if (this.getEndOfStateIdx()!=-1) {
		return this.getResponseText().substring(this.getEndOfStateIdx(), this.getResponseText().length);
	}
	return "";
};

AsynchDATARequest.prototype.getDebugLogs = function() {
	if (this.getResponseState()!=null && typeof this.getResponseState().debugLogs != "undefined") {
		return this.getResponseState().debugLogs;
	}
	return "";	
};

AsynchDATARequest.prototype.getPromptHTMLFragment = function() {
	return this.getResult();
};

AsynchDATARequest.prototype.constructFaultEnvelope = function() {

	if(this.m_soapFault == null) {
		var state = this.getResponseState();
		if(state != null) {
			if(state.m_sSoapFault) {
				var faultString = state.m_sSoapFault;
				this.m_soapFault = XMLBuilderLoadXMLFromString(faultString);
			}
		}
	}

	return this.m_soapFault;
};

AsynchDATARequest.prototype.construct = function() {
	var asynchRequest = new AsynchDATARequest(this.m_gateway, this.m_webContentRoot);
	asynchRequest.setCallbacks(this.m_callbacks);
	if (this.getFormFields().exists("cv.responseFormat")) {
		asynchRequest.addFormField("cv.responseFormat", this.getFormField("cv.responseFormat"));
	}
	else {
		asynchRequest.addFormField("cv.responseFormat", "data");
	}
	
	return asynchRequest;
};

AsynchDATARequest.prototype.getEnvParam = function(param) {
	var responseState = this.getResponseState();
	if (responseState && typeof responseState.envParams != "undefined" && typeof responseState.envParams[param] != "undefined") {
		return responseState.envParams[param];
	}
	
	return null;	
};

AsynchDATARequest.prototype.isRAPWaitTrue = function() {
	var rapWait = this.getEnvParam("rapWait");
	if (rapWait != null) {
		return rapWait == "true" ? true : false;
	}

	return false;
};

AsynchDATARequest.prototype.getRAPRequestCache = function() {
	return this.getEnvParam("rapRequestCache");
};

AsynchDATARequest.prototype.getMainConversation = function() {
	return this.getEnvParam("mainConversation");
};

AsynchDATARequest.prototype.getMainTracking = function() {
	return this.getEnvParam("mainTracking");
};
