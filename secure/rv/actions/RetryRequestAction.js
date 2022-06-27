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

function RetryRequestAction()
{
	this.m_lastActionParams = null;
}

RetryRequestAction.prototype = new CognosViewerAction();

RetryRequestAction.prototype.setRequestParms = function(parms)
{
	this.m_lastActionParams = parms;
};

RetryRequestAction.prototype.execute = function()
{
	if (this.m_lastActionParams) {
		var request = new ViewerDispatcherEntry(this.m_oCV);

		var formFieldNames = this.m_lastActionParams.keys();
		for (var index = 0; index < formFieldNames.length; index++) {
			request.addFormField(formFieldNames[index], this.m_lastActionParams.get(formFieldNames[index]));
		}
		
		request.addFormField("cv.responseFormat", "data");
		request.addFormField("widget.reloadToolbar", "true");
		request.addNonEmptyStringFormField("limitedInteractiveMode", this.m_oCV.envParams["limitedInteractiveMode"]);
		
		this.m_oCV.dispatchRequest(request);
		
		this.m_oCV.getViewerWidget().setOriginalFormFields(null);
	}
};
