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

function DownloadReportAction() {
	this._reportFormat = null;
}
DownloadReportAction.prototype = new CognosViewerAction();

/**
 * This is a PUBLIC API, do not change.
 */
DownloadReportAction.prototype.setRequestParms = function(params) {
	if (params) {
		this._reportFormat = params.format;
	}
};

DownloadReportAction.prototype.execute = function() {
	if (!this._reportFormat) {
		return false;
	}

	var oCV = this.getCognosViewer();
	var envParams = oCV.envParams;

	var request = new HiddenIframeDispatcherEntry(oCV);
	request.addFormField("ui.action", "render");
	request.addFormField("cv.toolbar", "false");
	request.addFormField("cv.header", "false");
	request.addFormField("run.outputFormat", this._reportFormat);
	request.addFormField("ui.name", this.getObjectDisplayName());
	request.addFormField("cv.responseFormat", "downloadObject");
	request.addFormField("ui.conversation", oCV.getConversation());
	request.addFormField("run.prompt", "false");
	request.addFormField("asynch.attachmentEncoding", "base64");
	request.addFormField("run.outputEncapsulation", "URLQueryString");
	request.addFormField("cv.detachRelease", "true");

	oCV.dispatchRequest(request);
	
	return true;
};
