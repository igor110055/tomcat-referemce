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

function ViewerHttpRequestConfig() {
	this.reportStatus = {};	// object that holds callbacks for all the different report statuses
	this.UI = {};	// object that contains the requestIndicator and workingDialog objects
}

ViewerHttpRequestConfig.prototype.configure = function(configuration) {
	applyJSONProperties(this, configuration);
};

ViewerHttpRequestConfig.prototype.getRequestIndicator = function() {
	if (this.UI) {
		return this.UI.requestIndicator ? this.UI.requestIndicator : null; 
	}
};

ViewerHttpRequestConfig.prototype.getWorkingDialog = function() {
	if (this.UI) {
		return this.UI.workingDialog ? this.UI.workingDialog : null; 
	}
};

ViewerHttpRequestConfig.prototype.getReportStatusCallback = function(status) {
	if (this.reportStatus) {
		var callback = this.reportStatus[status];
		if (callback) {
			return callback;
		}
		
		if (status == "complete" && this.reportStatus["initialComplete"]) {
			var tempCallback = this.reportStatus["initialComplete"];
			this.reportStatus["initialComplete"] = null;
			return tempCallback;
		}
	}

	return null;
};

