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
function AsynchJSONDispatcherEntry(oCV) {
	// create the AsynchDATARequest
	if (oCV) {
		var request = new AsynchJSONRequest(oCV.getGateway(), oCV.getWebContentRoot());
		this.setRequest(request);
		
		AsynchJSONDispatcherEntry.baseConstructor.call(this, oCV);
		
		AsynchJSONDispatcherEntry.prototype.setDefaultFormFields.call(this);
	}
}

AsynchJSONDispatcherEntry.prototype = new DispatcherEntry();
AsynchJSONDispatcherEntry.baseConstructor = DispatcherEntry;

AsynchJSONDispatcherEntry.prototype.setDefaultFormFields = function() {
	this.addFormField("cv.responseFormat", "asynchJSON");
};