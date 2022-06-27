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

function XmlHttpObject() {
	this.m_formFields = new CDictionary();
	this.xmlHttp = XmlHttpObject.createRequestObject();
	this.m_requestIndicator = null;
	this.m_httpCallbacks = {};
	this.m_asynch = true;
	this.m_headers = null;
}

XmlHttpObject.prototype.setHeaders = function(headers) {
	this.m_headers = headers;
};

XmlHttpObject.prototype.getHeaders = function() {
	return this.m_headers;
};

XmlHttpObject.prototype.newRequest = function() {
	var request = new XmlHttpObject();
	request.init(this.m_action, this.m_gateway, this.m_url, this.m_asynch);
	
	// if the request was sent using the dispatcher queue,
	// then it needs to be notified of the new request object
	this.executeHttpCallback("newRequest");
	
	return request;
};

XmlHttpObject.prototype.abortHttpRequest = function() {
	if(this.xmlHttp != null) {
		this.xmlHttp.abort();
		this.xmlHttp = null;

		this.executeHttpCallback("cancel");
		
		this.m_httpCallbacks = {};
	}	
};

XmlHttpObject.prototype.cancel = function() {
	this.abortHttpRequest();
};

/**
 * Executes a callback. Returns false if the callback wasn't found
 * @param {Object} callback
 */
XmlHttpObject.prototype.executeHttpCallback = function(callback) {
	if (this.m_httpCallbacks && this.m_httpCallbacks[callback]) {
		var callbackArguments = this.concatResponseArguments(this.m_httpCallbacks.customArguments);		
		var callbackFunc = GUtil.generateCallback(this.m_httpCallbacks[callback].method, callbackArguments, this.m_httpCallbacks[callback].object);
		callbackFunc();
		return true;
	}
	
	return false;
};

/**
 * Will add callbacks to the existing callback and will replace any conflicting callbacks
 * @param {Object} callbacks
 */
XmlHttpObject.prototype.setCallbacks = function(callbacks) {
	if (!this.m_httpCallbacks) {
		this.m_httpCallbacks = {};
	}
	
	for (callback in callbacks) {
		this.m_httpCallbacks[callback] = callbacks[callback];
	}
};

XmlHttpObject.prototype.getCallbacks = function() {
	return this.m_httpCallbacks;
};

XmlHttpObject.createRequestObject = function() {
	var request = null;

	if (window.XMLHttpRequest)		{
        request = new XMLHttpRequest();						// Firefox, Safari, ...
	} else if (window.ActiveXObject)	{
       request = new ActiveXObject("Msxml2.XMLHTTP");		// Internet Explorer
	} else {
		//throw error. exit.
	}
	return request;
};


XmlHttpObject.prototype.waitForXmlHttpResponse = function() {
	//explicit so there's no confusion
	var request = this.xmlHttp;
	if (request && request.readyState === 4) {
		if(request.status === 200) {
			this.httpSuccess();
		} else { 
			this.httpError();
		}
	} else {
		//wait...
	}
};

XmlHttpObject.prototype.init = function(action, gateway, url, asynch) {
	this.m_action = action;
	this.m_gateway = gateway;
	this.m_url = url;
	this.m_asynch = asynch;
};

XmlHttpObject.prototype.httpSuccess = function() {
	this.executeHttpCallback("postHttpRequest");
	
	// let the dispatcherQueue know the request is done		
	this.executeHttpCallback("entryComplete");
	
	this.executeHttpCallback("complete");
	
	this.m_httpCallbacks = null;
};

XmlHttpObject.prototype.httpError = function() {
	// let the dispastcher queue know a fault happened
	this.executeHttpCallback("entryFault");

	this.executeHttpCallback("fault");

	this.m_httpCallbacks = null;
};

XmlHttpObject.prototype.forceSynchronous = function() {
	this.m_asynch = false;
};

XmlHttpObject.prototype.sendRequest = function() {
	this.sendHtmlRequest(this.m_action, this.m_gateway, this.m_url, this.m_asynch);
};

XmlHttpObject.prototype.sendHtmlRequest = function(action, gateway, url, async) {
	var request = this.xmlHttp;
	if (request) {
		request.open(action, gateway, async);
	
		//should be after the "open" for best results...
		if (async) {
			request.onreadystatechange = GUtil.generateCallback(this.waitForXmlHttpResponse, [], this);
		} else {
			request.onreadystatechange = GUtil.generateCallback(this.waitForXmlHttpResponse, [], this); // IE needs this.
			if (!isIE()) {
				request.onload = GUtil.generateCallback(this.httpSuccess, [], this);
				request.onerror = GUtil.generateCallback(this.httpError, [], this);
			}
		}
	
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		if (this.m_headers) {
			for (header in this.m_headers) {
				request.setRequestHeader(header, this.m_headers[header]);
			}
		}
		
		this.executeHttpCallback("preHttpRequest");
		
		var requestBody = this.convertFormFieldsToUrl();
		if( url ){
			requestBody += url;
		}

		request.send( requestBody );
	}
};

XmlHttpObject.prototype.getResponseXml = function() {
	return ( this.xmlHttp ) ? this.xmlHttp.responseXML : null;
};

XmlHttpObject.prototype.getResponseText = function() {
	return (this.xmlHttp) ? this.xmlHttp.responseText : "";
};

XmlHttpObject.prototype.getResponseHeader = function(item) {
	return (this.xmlHttp ) ? this.xmlHttp.getResponseHeader(item) : null;
};

XmlHttpObject.prototype.getStatus = function() {
	return this.xmlHttp.status;
};

XmlHttpObject.prototype.addFormField = function(name, value) {
	this.m_formFields.add(name, value);
};

XmlHttpObject.prototype.getFormFields = function() {
	return this.m_formFields;
};

XmlHttpObject.prototype.getFormField = function(formField) {
	return this.m_formFields.get(formField);
};


XmlHttpObject.prototype.clearFormFields = function() {
	this.m_formFields = new CDictionary();
};

XmlHttpObject.prototype.convertFormFieldsToUrl = function() {

	var url = "";
	var formFieldNames = this.m_formFields.keys();
	for (var index = 0; index < formFieldNames.length; index++)
	{
		if (index > 0) {
			url += "&";
		}
		url += encodeURIComponent(formFieldNames[index]) + "=" + encodeURIComponent(this.m_formFields.get(formFieldNames[index]));
	}
	return url;
};

XmlHttpObject.prototype.concatResponseArguments = function(customArguments) {
	var responseArguments = [this];
	if(customArguments) {
		responseArguments = responseArguments.concat(customArguments);
	}
	return responseArguments;
};

