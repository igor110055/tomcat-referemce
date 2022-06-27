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


function ResizeChartAction() {
	this.m_width = 0;
	this.m_height = 0;
	this.m_actionContext = null;
}

ResizeChartAction.prototype = new CognosViewerAction();

ResizeChartAction.prototype.setRequestParms = function(requestParams) {
	if(requestParams && requestParams.resize)	{
		this.m_width = requestParams.resize.w;
		this.m_height = requestParams.resize.h;
		this.m_actionContext = requestParams.resize.actionContext;
	}
};

ResizeChartAction.prototype.execute = function() {
	var oCV = this.getCognosViewer();
	var oReq = new ViewerDispatcherEntry(oCV);
	oReq.addFormField("ui.action", "modifyReport");
	
	if (!this.m_actionContext) {
		this.m_actionContext = "<reportActions><ChangeDataContainerSize><idSelectAll/><height>" + this.m_height + "</height><width>" + this.m_width + "</width></ChangeDataContainerSize></reportActions>";
	}
	
	oReq.addFormField("cv.actionContext", this.m_actionContext);
	oReq.addFormField("keepIterators", "true");
	oReq.addFormField("cv.reuseConversation", "true");
	oReq.addFormField("reuseResults", "true");
	oReq.addDefinedFormField("ui.spec", oCV.envParams["ui.spec"]);
	oReq.addDefinedFormField("modelPath", oCV.getModelPath());
	oReq.addDefinedFormField("packageBase", oCV.envParams["packageBase"]);
	
	oReq.setCanBeQueued(true);
	
	oCV.dispatchRequest(oReq);
}