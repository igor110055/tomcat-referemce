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

/**
 * Override the sendRequest method so we call to mobile
 * instead of posting a form/sending an ajax request
 */
ViewerDispatcherEntry.prototype.sendRequest = function() {
	this.prepareRequest();
	
	var oCV = this.getViewer();
	
	// Make sure we always return a mobile output
	if (oCV.envParams["ui.action"] == "view") {
		this.addFormField("cv.responseFormat", "mobileView");
	}
	else {
		this.addFormField("cv.responseFormat", "mobileData");
	}
	
	// Sometimes mobile will show the response in a new window. We need to make
	// sure we reset the viewerDispatcher or else this request will be stuck in the
	// queue and no other requests will go through
	oCV.resetViewerDispatcher();
	
	// Since Mobile always uses non-ajax request we need to round trip all our form fields
	// Loop through all the form field to send along any missing ones
	var formFields = this.getRequest().getFormFields();
	for(param in oCV.envParams) {
		if(!formFields.exists(param) && param != "cv.actionState") {
			this.addFormField(param, oCV.envParams[param]);
		}
	}

	if (!ViewerMobileRequest.passRequestFieldsToMobile(this.getRequest())) {
		var formRequest = this.buildRequestForm();
		formRequest.submit();
	}
};