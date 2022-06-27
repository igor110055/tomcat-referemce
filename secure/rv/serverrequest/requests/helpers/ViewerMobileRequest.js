/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ViewerMobileRequest() {}

/**
 * Loops through all the form fields in the form and call Mobile with them.
 * Returns true if window.onAction is called, otherwise will return false
 */
ViewerMobileRequest.passFormFieldsToMobile = function(form) {
	var formFieldsPayload = {};
	
	var inputNodes = form.getElementsByTagName("input");
	if (inputNodes) {
		for (var i=0; i < inputNodes.length; i++) {
			var name = inputNodes[i].getAttribute("name");
			var value = inputNodes[i].getAttribute("value");
			if (name && value) {
				formFieldsPayload[name] = value;
			}
		}
	}
	
	return ViewerMobileRequest._callMobile(formFieldsPayload);
};


/**
 * Will call the mobile javascript function passing all the request form fields.
 * Returns true if window.onAction is called, otherwise will return false
 */
ViewerMobileRequest.passRequestFieldsToMobile = function (request) {
	var formFieldsPayload = {};
	var formFields = request.getFormFields();
	var formFieldNames = formFields.keys();
	for (var index = 0; index < formFieldNames.length; index++)	{
		var name = formFieldNames[index];
		formFieldsPayload[name] = formFields.get(name);
	}

	return ViewerMobileRequest._callMobile(formFieldsPayload);
};


ViewerMobileRequest._callMobile = function(formFieldsPayload) {
	var payload = {
		"action" : "httpRequest",
		payload : formFieldsPayload
	};
		
	if (window.onAction) {	
		window.onAction(payload);
		
		return true;
	}
	else if (typeof console != "undefined" && console && console.log) { 
		console.log(payload)
		return false;
	}
	
	return false;	
};