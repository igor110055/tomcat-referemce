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
function ViewerDispatcher()
{
	this.m_activeRequest = null;
	this.m_requestQueue = [];
	this.m_bUsePageRequest = false;
}

ViewerDispatcher.prototype.getActiveRequest = function() {
	return this.m_activeRequest;
};

ViewerDispatcher.prototype.setUsePageRequest = function(bUsePageRequest)
{
	this.m_bUsePageRequest = bUsePageRequest;
};

ViewerDispatcher.prototype.getUsePageRequest = function() {
	return this.m_bUsePageRequest;
};

ViewerDispatcher.prototype.dispatchRequest = function(dispatcherEntry)
{
	if (this.m_activeRequest==null) {
		this.startRequest(dispatcherEntry);
	} else if (dispatcherEntry.canBeQueued()==true) {
		this.m_requestQueue.push(dispatcherEntry);
	} else if (window.cognosViewerDebug && console && console.warn) {
		console.warn("Warning! Dropped a dispatcher entry!");
	}
};

ViewerDispatcher.prototype.startRequest = function(dispatcherEntry)
{
	this.m_activeRequest=dispatcherEntry;
	if (dispatcherEntry!=null) {
		dispatcherEntry.setUsePageRequest(this.m_bUsePageRequest);
		dispatcherEntry.sendRequest();
	}
};

/*
 * Will cancel the request(s) matching the provided key
 */
ViewerDispatcher.prototype.cancelRequest = function(key) {
	for (var i=0; i < this.m_requestQueue.length; i++) {
		var request = this.m_requestQueue[i];
		if (request.getKey() === key) {
			
			// we don't want the onEntryComplete callback to be called since it'll fire off the next request in the queue
			request.setCallbacks( { "onEntryComplete" : null } );
			request.cancelRequest(false);

			this.m_requestQueue.splice(i, 1);
			// Since we removed an item from the array back up i or we might hit an out of bounds
			i--;
		}
	}
	
	if (this.m_activeRequest && this.m_activeRequest.getKey() === key) {
		this.m_activeRequest.setCallbacks( { "onEntryComplete" : null } );
		this.m_activeRequest.cancelRequest(false);
		
		// If we're canceling the active request, let the queue know so that it start running
		// any other requests in the queue
		this.requestComplete();
	}
};

ViewerDispatcher.prototype.possibleUnloadEvent = function()
{
	if (this.m_activeRequest) {
		this.m_activeRequest.possibleUnloadEvent();
	}
};

ViewerDispatcher.prototype.requestComplete = function(dispatcherEntry)
{
	this.startRequest(this.nextRequest());
};

ViewerDispatcher.prototype.nextRequest = function()
{
	//Get the next request to run:
	//If there are queued requests, check if its necessary to run them all.
	//NOTE: For now, just look at the duplicate requests at the head of the queue.
	var requestEntry=null;
	if (this.m_requestQueue.length>0) {
		requestEntry = this.m_requestQueue.shift();
		if (requestEntry.getKey() != null) {
			while(this.m_requestQueue.length > 0 &&
				  this.m_requestQueue[0].getKey() == requestEntry.getKey()) {
				requestEntry = this.m_requestQueue.shift();
			}
		}
	}
	return requestEntry;
};

ViewerDispatcher.prototype.queueIsEmpty = function()
{
	return (this.m_requestQueue.length==0);
};
