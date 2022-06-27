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

/*
 *******************************************************************************
 *** View DispatcherEntry.js for information on the dispatcher entry classes ***
 *******************************************************************************
 */
function JSONDispatcherEntry(oCV) {
	// even if this won't be an asynch type request, we can still use the 
	// AsynchJSONRequest object to make the request
	if (oCV) {
		this.setRequest(new AsynchJSONRequest(oCV.getGateway(), oCV.getWebContentRoot()));
	}
	JSONDispatcherEntry.prototype.setDefaultFormFields.call(this);
	
	JSONDispatcherEntry.baseConstructor.call(this, oCV);
}

JSONDispatcherEntry.prototype = new DispatcherEntry();
JSONDispatcherEntry.baseConstructor = DispatcherEntry;

JSONDispatcherEntry.prototype.setDefaultFormFields = function() {
	this.addFormField("cv.responseFormat", "JSON");
};
