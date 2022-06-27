/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2016
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
function ViewerDispatcherEntry(oCV) {
	ViewerDispatcherEntry.baseConstructor.call(this, oCV);
	
	if (oCV) {
		ViewerDispatcherEntry.prototype.setDefaultFormFields.call(this);
	}
}

ViewerDispatcherEntry.prototype = new ReportDispatcherEntry();
ViewerDispatcherEntry.baseConstructor = ReportDispatcherEntry;

ViewerDispatcherEntry.prototype.setDefaultFormFields = function() {
	var oCV = this.getViewer();
	var envParams = oCV.envParams;
	
	for(var param in envParams)	{
		if(this.getFormField(param) == null && param.indexOf("frag-") != 0 && param != "cv.fragmentEvent" && param != "cv.transientSpec" && param != "cv.actionState" && param != "globalViewerTransient") {
			this.addFormField(param, envParams[param]);
		}
	}
	
	this.getFormFields().remove("b_action");
	
	this.addFormField("cv.ignoreState", "true");
	this.addFormField("cv.responseFormat", "fragment");
	this.addFormField("cv.id", "_THIS_");
	
	this.addFormField("cv.catchLogOnFault", "false");
	this.addDefinedNonNullFormField("cv.header", envParams["cv.header"]);
	this.addDefinedNonNullFormField("cv.toolbar", envParams["cv.toolbar"]);	
	this.addDefinedNonNullFormField("m_session", envParams["m_session"]);
	this.addDefinedNonNullFormField("m_sessionConv", envParams["m_sessionConv"]);
};

/**
 * Override the sendRequest method when we're in fragments since we need to do a retrieve
 */
ViewerDispatcherEntry.prototype.sendRequest = function() {
	// So that we'll end up on the same tab
	if (this.getViewer().getCurrentlySelectedTab() && !this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")) {
		this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup", this.getViewer().getCurrentlySelectedTab());
	}
	
	if(this.getFormField("cv.fragmentEvent") == null && (this.getFormField("ui.action") == "forward" || this.getFormField("ui.action") == "back")) {
		this.addFormField("cv.fragmentEvent", "false");
		this.getViewer().m_viewerFragment.changePromptValues(this.getFormFields());
	}

	var sParams = this.getRequest().convertFormFieldsToUrl();
	var dispatcher = eval(this.getViewer().getId())
	
	dispatcher.retrieve(sParams);	
};
