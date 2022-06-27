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
function AsynchDataDispatcherEntry(oCV) {
	// create the AsynchDATARequest
	if (oCV) {
		var request = new AsynchDATARequest(oCV.getGateway(), oCV.getWebContentRoot());
		this.setRequest(request);
		
		AsynchDataDispatcherEntry.baseConstructor.call(this, oCV);

		AsynchDataDispatcherEntry.prototype.setDefaultFormFields.call(this);
	}
}

AsynchDataDispatcherEntry.prototype = new DispatcherEntry();
AsynchDataDispatcherEntry.baseConstructor = DispatcherEntry;

AsynchDataDispatcherEntry.prototype.setDefaultFormFields = function() {
	this.addFormField("cv.responseFormat", "data");
};
