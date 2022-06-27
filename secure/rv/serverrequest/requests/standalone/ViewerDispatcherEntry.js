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
function ViewerDispatcherEntry(oCV) {
	ViewerDispatcherEntry.baseConstructor.call(this, oCV);
	
	if (oCV) {
		ViewerDispatcherEntry.prototype.setDefaultFormFields.call(this);
		
		this.setCallbacks( {
			"complete" : {"object" : this, "method" : this.onComplete},
			"prompting" : {"object" : this, "method" : this.onPrompting},
			"cancel" : {"object" : this, "method" : this.onCancel}
		});
	}
}

ViewerDispatcherEntry.prototype = new ReportDispatcherEntry();
ViewerDispatcherEntry.baseConstructor = ReportDispatcherEntry;
ViewerDispatcherEntry.prototype.parent = ReportDispatcherEntry.prototype;

ViewerDispatcherEntry.prototype.setDefaultFormFields = function() {
	var oCV = this.getViewer();
	var envParams = oCV.envParams;
	
	this.addFormField("cv.showFaultPage", "true");

	this.addDefinedNonNullFormField("cv.header", envParams["cv.header"]);	
	this.addDefinedNonNullFormField("cv.toolbar", envParams["cv.toolbar"]);	
	this.addDefinedNonNullFormField("ui.backURL", envParams["ui.backURL"]);
	this.addDefinedNonNullFormField("errURL", envParams["ui.backURL"]);
	this.addDefinedNonNullFormField("errURL", envParams["ui.errURL"]);
	this.addDefinedNonNullFormField("cv.catchLogOnFault", "true");
	this.addDefinedNonNullFormField("m_sessionConv", envParams["m_sessionConv"]);
	
	// needed for legacy viewer portlet
	if (envParams["m_session"]) {
		this.addFormField("m_session", envParams["m_session"]);
		this.addFormField("cv.ignoreState", "true");
	}
};

ViewerDispatcherEntry.prototype.prepareRequest = function() {
	this.parent.prepareRequest.call(this);
	if(this.getUsePageRequest()) {
		this.m_oCV.setKeepSessionAlive(true);	
		if (typeof this.m_oCV.envParams["cv.responseFormat"] != "undefined" && this.m_oCV.envParams["cv.responseFormat"] != null && this.m_oCV.envParams["cv.responseFormat"] != "") {
			this.addFormField("cv.responseFormat", this.m_oCV.envParams["cv.responseFormat"]);
		} else if (this.getFormField("cv.responseFormat") != "view") {
			this.addFormField("cv.responseFormat", "page");		
		}
		
		var oPinFreezeManager = this.m_oCV.getPinFreezeManager();
		if (oPinFreezeManager && oPinFreezeManager.hasFrozenContainers()) {
			this.addFormField("pinFreezeInfo",  oPinFreezeManager.toJSONString());
		}		
	}
};

ViewerDispatcherEntry.prototype.sendRequest = function(){
	// if we're not doing an ajax call then build and post a form
	if (this.getUsePageRequest()) {
		this.prepareRequest();
		var formRequest = this.buildRequestForm();

		if(typeof document.progress != "undefined") {
			setTimeout("document.progress.src=\"" + this.m_oCV.getSkin() + "/branding/progress.gif" + "\";", 1);
		}
				
		formRequest.submit();
	} else {
		this.getViewer().closeContextMenuAndToolbarMenus();  
		this.parent.sendRequest.call(this);	
	}	
};

ViewerDispatcherEntry.prototype.buildRequestForm = function() {
	var oCV = this.getViewer();
	var requestForm = document.createElement("form");

	requestForm.setAttribute("id", "requestForm");
	requestForm.setAttribute("name", "requestForm");
	requestForm.setAttribute("method", "post");
	requestForm.setAttribute("target", "_self");
	requestForm.setAttribute("action", oCV.getGateway());
	requestForm.style.display = "none";

	document.body.appendChild(requestForm);

	var formFields = this.getRequest().getFormFields();
	var formFieldNames = formFields.keys();
	for (var index = 0; index < formFieldNames.length; index++)	{
		requestForm.appendChild(this.createHiddenFormField(formFieldNames[index], formFields.get(formFieldNames[index])));
	}
	
	// Loop through all the form field to send along any missing ones
	for(param in oCV.envParams) {
		if(!formFields.exists(param) && param != "cv.actionState") {
			requestForm.appendChild(this.createHiddenFormField(param, oCV.envParams[param]));
		}
	}	

	return requestForm;
};

ViewerDispatcherEntry.prototype.createHiddenFormField = function(name, value) {
	var formField = document.createElement("input");
	formField.setAttribute("type", "hidden");
	formField.setAttribute("name", name);
	formField.setAttribute("id", name);
	formField.setAttribute("value", value);
	return(formField);
};

ViewerDispatcherEntry.prototype.onCancel = function() {
	var oCV = this.getViewer();
	
	// after a cancel we always need to set the status to complete
	oCV.setStatus("complete");

	// the cancel callback on the Viewer object is used to do a backURL.
	// only call it if ajax is off or the report hasn't shown up yet
	if (this.getUsePageRequest() || !oCV.isReportRenderingDone()) {
		oCV.executeCallback("cancel");
	}
};

ViewerDispatcherEntry.prototype.onFault = function(asynchResponse) {
	// currently fault callbacks are only set when we're in RS
	// so blank out of fault dialog and add in their callback
	if (this.getViewer().callbackExists("fault")) {
		this.getViewer().setSoapFault(asynchResponse.getSoapFault());
		this.getViewer().executeCallback("fault");
	}
	else {
		this.parent.onFault.call(this, asynchResponse);
	}	
};

ViewerDispatcherEntry.prototype.onComplete = function(response) {
	var oCV = this.getViewer();
	oCV.saveBackJaxInformation(response);
	// we only need to clear the selection if the report had already been rendered once before,
	// otherwise we run into timing issues and the context menu doesn't show all the items
	if (oCV.isReportRenderingDone()) {
		this.getViewer().getSelectionController().resetSelections();
	}
	this.parent.onComplete.call(this, response);
};

ViewerDispatcherEntry.prototype.onPrompting = function(response) {
	var oCV = this.getViewer();
	
	oCV.updateSkipToNavigationLink(true);
	
	// Report Studio sets up a prompt callback, if it's not there
	// then treat prompting as complete
	if (!oCV.executeCallback("prompt")) {
		this.onComplete(response);
	}	
};

ViewerDispatcherEntry.prototype.onEntryComplete = function(response) {
	if (this.getRequestHandler()) {
		// Need to keep the dispatcher entry around in case we have to resubmit in safe mode
		this.getRequestHandler().setDispatcherEntry(this);
	}
		
	this.parent.onEntryComplete.call(this, response);
};

