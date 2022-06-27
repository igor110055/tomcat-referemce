/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * This class is used to make requests in a hidden iframe
 */

HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX = "viewerHiddenRequest";
HiddenIframeDispatcherEntry.FORM_NAME = "viewerHiddenFormRequest";

function HiddenIframeDispatcherEntry(oCV) {
	HiddenIframeDispatcherEntry.baseConstructor.call(this, oCV);
	
	if (oCV) {
		HiddenIframeDispatcherEntry.prototype.setDefaultFormFields.call(this);
		this.setRequestHandler(new RequestHandler(oCV));
		this.setWorkingDialog(oCV.getWorkingDialog());
		this.setRequestIndicator(oCV.getRequestIndicator());
		this.m_httpRequestConfig = oCV.getConfig() && oCV.getConfig().getHttpRequestConfig() ? oCV.getConfig().getHttpRequestConfig() : null;
		
		this.setIframeId(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX + oCV.getId());
		this.originalGetViewerConfiguration = null;
	}
}
HiddenIframeDispatcherEntry.prototype = new DispatcherEntry();
HiddenIframeDispatcherEntry.baseConstructor = DispatcherEntry;

HiddenIframeDispatcherEntry.prototype.setDefaultFormFields = function() {
	var oCV = this.getViewer();
	var sCAF = oCV.getCAFContext();
	this.addDefinedNonNullFormField("ui.cafcontextid", sCAF);
};

HiddenIframeDispatcherEntry.prototype.sendRequest = function() {
	this._createHiddenIframe();
	var form = this._createForm();
	this._setupCallbacks();
	this.onPreHttpRequest(this.getRequest());
	form.submit();
};

/**
 * Do any cleanup or callbacks once the iframe is finished running the request
 */
HiddenIframeDispatcherEntry.prototype._iframeRequestComplete = function() {
	window.getViewerConfiguration = this.originalGetViewerConfiguration;
	this.onPostHttpRequest();
	this.onEntryComplete();
};

/**
 * Using our public callback mechanism setup callbacks for the hidden iframes
 */
HiddenIframeDispatcherEntry.prototype._setupCallbacks = function() {
	// Save the original getViewerConfiguration method if we have one
	this.originalGetViewerConfiguration = window.getViewerConfiguration;

	// We only need to setup these callbacks if we're using Ajax otherwise
	// the iframes onload callback will be triggered and we'll get the status there
	if (this.getFormField("cv.useAjax") != "false") {	
		var hiddenIframeDispatcherEntry = this;
		var requestIndicator = this.getRequestHandler().getRequestIndicator();
		var workingDialog = this.getRequestHandler().getWorkingDialog();
		
		window.getViewerConfiguration = function() {
			var configObj = {
				"httpRequestCallbacks" : {
					"reportStatus" : {
						"complete" : function() { hiddenIframeDispatcherEntry.onComplete() },
						"working" : function() { hiddenIframeDispatcherEntry.onWorking() },
						"prompting" : function() { hiddenIframeDispatcherEntry.onPrompting() }
					}
				}
			};
			
			return configObj;
		};
	}
};


HiddenIframeDispatcherEntry.prototype.setIframeId = function(id) {
	this._iframeId = id;
};

HiddenIframeDispatcherEntry.prototype.getIframeId = function() {
	return this._iframeId;
};


/**
 * Creates the form that will POST the request to the hidden iframe
 */
HiddenIframeDispatcherEntry.prototype._createForm = function(params) {
	var oCV = this.getViewer();
	var formId = HiddenIframeDispatcherEntry.FORM_NAME + oCV.getId();
	var requestForm = document.getElementById(formId);
	if (requestForm) {
		requestForm.parentNode.removeChild(requestForm);
		requestForm = null;
	}
	
	var sDispatcherURI = location.protocol + '//' + location.host + oCV.m_sGateway;
	
	requestForm = document.createElement("form");
	requestForm.setAttribute("method","post");
	requestForm.setAttribute("action", sDispatcherURI);		
	requestForm.setAttribute("target", this.getIframeId());
	requestForm.setAttribute("id", formId);
	requestForm.style.display = "none";

	var formFields = this.getRequest().getFormFields();
	var formFieldNames = formFields.keys();
	for (var index = 0; index < formFieldNames.length; index++)	{
		requestForm.appendChild(createHiddenFormField(formFieldNames[index], formFields.get(formFieldNames[index])));
	}

	
	document.body.appendChild(requestForm);
	
	return requestForm;
};


/**
 * Creates the hidden iframe that will be used for the request
 */
HiddenIframeDispatcherEntry.prototype._createHiddenIframe = function() {
	var oCV = this.getViewer();
	var iframeId = this.getIframeId();
	var iframeElem = document.getElementById(iframeId);
	if (iframeElem) {
		iframeElem.parentNode.parentNode.removeChild(iframeElem.parentNode);
	}
	
	// There's a bug in IE where you can't post to an iframe if it's created dynamically, 
	// however if you append an iframe into a div using innerHTML then it work.
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.style.left="0px";
	div.style.top="0px";		
	div.style.display = "none";
	document.body.appendChild(div);
	
	div.innerHTML = "<iframe frameborder=\"0\" id=\"" + iframeId + "\" name=\"" + iframeId + "\"></iframe>";
	iframeElem = document.getElementById(iframeId);

	// only set the onload after it's appended to the DOM or it will get triggered right away in certain browsers	
	var thisObj = this;
	var func = function() {HiddenIframeDispatcherEntry.handleIframeLoad(thisObj);};
	if(iframeElem.attachEvent) {
		iframeElem.attachEvent("onload", func);
	}
	else {
		iframeElem.addEventListener("load", func, true);
	}
};

/**
 * Hides the iframe. This gets called when we got a fault that we
 * showed to the user and they hit the Ok button in the fault dialog.
 */
HiddenIframeDispatcherEntry.hideIframe = function(cvId) {
	var iframeElement = document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX + cvId);
	
	if (iframeElement) {
		iframeElement.parentNode.style.display = "none";
	}
};

HiddenIframeDispatcherEntry.showIframeContentsInWindow = function(cvId) {
	var iframeElement = document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX + cvId);
	if (!iframeElement) {
		return;
	}

	var html = iframeElement.contentWindow.document.getElementsByTagName('html')[0].innerHTML;
	var htmlWindow = window.open("","",'height=400,width=500');
	if(htmlWindow) {
		htmlWindow.document.write("<html>" + html + "</html>");
	}
};


/**
 * Gets called when the iframe is loaded. Status can be complete, working, fault, ...
 */
HiddenIframeDispatcherEntry.handleIframeLoad = function(dispatcherEntry) {	
	if (!dispatcherEntry) {
		return;
	}

	var iframeElement = document.getElementById(dispatcherEntry.getIframeId());
	if (!iframeElement) {
		return;
	}
	
	var oCV = iframeElement.contentWindow.window.gaRV_INSTANCES ? iframeElement.contentWindow.window.gaRV_INSTANCES[0] : null;
	var status = oCV ? oCV.getStatus() : null;
	if (status == "complete") {
		dispatcherEntry.onComplete();
	}
	if (status == "working") {
		dispatcherEntry.onWorking();
	}
	if (status == "prompting") {
		dispatcherEntry.onPrompting();
	}
	if (!oCV || status == "fault" || status == "") {
		dispatcherEntry.onFault();
	}
};


HiddenIframeDispatcherEntry.prototype.onFault = function() {
	this._iframeRequestComplete();
	HiddenIframeDispatcherEntry.showIframeContentsInWindow(this.getViewer().getId());
};

HiddenIframeDispatcherEntry.prototype.onPrompting = function() {
	this._iframeRequestComplete();
	
	if (this.m_httpRequestConfig) {
		var callback = this.m_httpRequestConfig.getReportStatusCallback("prompting");
		if (typeof callback == "function") {
			callback();
		}
	}

	HiddenIframeDispatcherEntry.showIframeContentsInWindow(this.getViewer().getId());
};
	

HiddenIframeDispatcherEntry.prototype.onComplete = function() {
	this._iframeRequestComplete();

	if (this.m_httpRequestConfig) {
		var callback = this.m_httpRequestConfig.getReportStatusCallback("complete");
		if (typeof callback == "function") {
			callback();
		}
	}
	
	var iframeElement = document.getElementById(this.getIframeId());
	
	// We don't want the iframe to ever release the conversation, so unhook the leavingRV method.
	if (typeof iframeElement.contentWindow.detachLeavingRV == "function") {
		iframeElement.contentWindow.detachLeavingRV();
	}
	var divContainer = iframeElement.parentNode;
	divContainer.style.display = "none";	
	
	if (this.getCallbacks() && this.getCallbacks()["complete"]) {
		HiddenIframeDispatcherEntry.executeCallback(this.getCallbacks()["complete"]);
	}
};

HiddenIframeDispatcherEntry.prototype.cancelRequest = function(forceSynchronous) {
	this._iframeRequestComplete();
	// guard against sending multiple cancel requests
	if (!this.m_bCancelCalled) {
		this.m_bCancelCalled = true;
		var iframeElement = document.getElementById(this.getIframeId());
		if (!iframeElement) {
			return;
		}
		
		var oCV = iframeElement.contentWindow[getCognosViewerObjectString(this.getViewer().getId())];
		if (oCV) {
			oCV.cancel();
		}		
	}
};

HiddenIframeDispatcherEntry.executeCallback = function(callback) {
	if (callback) {
		var callbackFunc = GUtil.generateCallback(callback.method, callback.params, callback.object);
		callbackFunc();
	}
};

HiddenIframeDispatcherEntry.getIframe = function(cvId) {
	var iframe = document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX + cvId);
	return iframe;
};