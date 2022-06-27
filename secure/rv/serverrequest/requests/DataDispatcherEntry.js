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
function DataDispatcherEntry(oCV) {
	// even if this won't be an asynch type request, we can still use the 
	// AsynchDATARequest object to make the request
	if (oCV) {
		this.setRequest(new AsynchDATARequest(oCV.getGateway(), oCV.getWebContentRoot()));	
	}
	
	DataDispatcherEntry.baseConstructor.call(this, oCV);
}

DataDispatcherEntry.prototype = new DispatcherEntry();
DataDispatcherEntry.baseConstructor = DispatcherEntry;
