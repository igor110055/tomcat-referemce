/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2011, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * This class manages the loading state of the Viewer. In particular:
 * * viewerLoadInitiated - has the post to the server been made to
 *     retrieve the viewer?
 * * canRunReports - for actions which need a subsequent report
 *     run (i.e. using the modifyReport action), has the report been run?
 * * isViewerReady - has the viewer been loaded and all outstanding
 *     callbacks in the queue been serviced?
 */
function ViewerLoadManager(widget) {
	this.m_oWidget = widget;
	this.m_oDelayedLoadingContext = new DelayedLoadingContext();
	this.m_aQueue = [];
	this.m_fOnEmptyCallback = null;
	this.m_bPendingRequest = false;
	this.m_bViewerLoadInitiated = false;
	this.m_bCanRunReports = false;
}

/**
 * Invoke to indicate that the load of the Viewer object
 * has been initiated (and therefore shouldn't be repeated).
 */
ViewerLoadManager.prototype.viewerLoadInitiated = function() {
	this.m_bViewerLoadInitiated = true;
};

/**
 * @return whether the load of the Viewer object has yet been
 * initiated.
 */
ViewerLoadManager.prototype.isViewerLoadInitiated = function() {
	return this.m_bViewerLoadInitiated;
};

/**
 * @return true iff a report has already been run, so the viewer
 * is ready to subsequently run the report
 */
ViewerLoadManager.prototype.canRunReports = function() {
	return this.m_bCanRunReports;
};

/**
 * Invoke to indicate a report run is being initiated.
 * The canRunReport flag will be set on the subsequent response
 * from the server.
 */
ViewerLoadManager.prototype.runningReport = function() {
	if(!this.m_bCanRunReports) {
		this._queue( { fCallback: dojo.hitch(this, function() {
			this.m_bCanRunReports = true;
			return false;
		})});
	}
};

/**
 * @return true iff the Viewer has been loaded and is ready for use
 */
ViewerLoadManager.prototype.isViewerReady = function() {
	if(!this.isViewerLoaded()) {
		return false;
	}

	//Queue should be empty, no pending onEmpty callback, and no requests in progress
	if(!this._isEmpty() || this.m_fOnEmptyCallback || this.m_bPendingRequest) {
		return false;
	}

	return true;
};

/**
 * @return true iff Viewer is loaded
 */
ViewerLoadManager.prototype.isViewerLoaded = function() {
	//Need a viewer in memory
	var oCV = this.m_oWidget.getViewerObject();
	if(!oCV) {
		return false;
	}

	if(this.m_oWidget.isLiveReport()) {
		var sStatus = oCV.getStatus();
		return  sStatus === "complete" || sStatus === "prompting" || sStatus === "fault";
	}

	return true;
};

/**
 * Invokes f when there is a viewer ready. f must return true
 * iff it sent a request to the server
 * (i.e. processDelayedEventsQueue will be invoked), false otherwise.
 * If sGroupId is specified, then if there are consecutive callbacks with the
 * same group id, only the last one will be executed.  *
 * @return true iff f was invoked synchronously (i.e. before
 * _runWhenHasViewer terminated), false otherwise.
 */
ViewerLoadManager.prototype.runWhenHasViewer = function(f, sGroupId) {
	if(this.isViewerReady()) {
		this._run(f);
		return true;
	} else {
		var oCallback = {fCallback: f};
		if(sGroupId) {
			oCallback.sGroupId = sGroupId;
		}
		this._queue(oCallback);

		//If Viewer hasn't started loading yet, load without running the report.
		if(!this.m_bViewerLoadInitiated) {
			this.getDelayedLoadingContext().setForceRunReport(true);
			this.m_oWidget.setRunReportOption(false);
			this.m_oWidget.postReport(null);
		}

		return false;
	}
};

/**
 * Invoke to process the queue of callbacks waiting for a
 * loaded viewer. Will process callbacks until one needs to
 * block until a response from the server is received.
 */
ViewerLoadManager.prototype.processQueue = function() {
	//Clear pending request flag - the last request has returned
	this.m_bPendingRequest = false;

	//Service each function in the queue until one goes to the server,
	//then stop servicing queue. Queue servicing will resume upon
	//response from the server.
	var bServerRequest = false;
	while(!bServerRequest && !this._isEmpty()) {
		var oCallback = this.m_aQueue.shift();

		//If this entry has a group id, check if there's a later entry with the
		//same group id. Only run the later one.
		while(oCallback.sGroupId && !this._isEmpty() && this.m_aQueue[0].sGroupId === oCallback.sGroupId) {
			oCallback = this.m_aQueue.shift();
		}

		bServerRequest = this._run(oCallback.fCallback);
	}

	//onEmptyCallback is treated like the perpetually last entry in
	//the queue. It is only invoked if the rest of the queue is empty,
	//and there is no pending request to the server.
	//Once invoked, it is cleared.
	if(this._isEmpty() && !bServerRequest && this.m_fOnEmptyCallback) {
		var fCallback = this.m_fOnEmptyCallback;
		this.m_fOnEmptyCallback = null;
		fCallback();
	}
};

ViewerLoadManager.prototype._run = function(f) {
	var bServerRequest = f.call();
	if(bServerRequest) {
		//Set pending request flag.
		//Don't allow simultaneous requests because
		//the second will clobber the first.
		this.m_bPendingRequest = true;
	}
	return bServerRequest;
};

ViewerLoadManager.prototype._isEmpty = function() {
	return !this.m_aQueue.length;
};

ViewerLoadManager.prototype._queue = function(oEntry) {
	this.m_aQueue.push(oEntry);
};

/**
 * Set the callback to be invoked when the queue is empty. Once
 * invoked, this member is cleared (i.e. only invoked once).
 */
ViewerLoadManager.prototype.setOnEmptyCallback = function(fCallback) {
	this.m_fOnEmptyCallback = fCallback;
};

/**
 * @return the DelayedLoadingContext
 */
ViewerLoadManager.prototype.getDelayedLoadingContext = function() {
	return this.m_oDelayedLoadingContext;
};
