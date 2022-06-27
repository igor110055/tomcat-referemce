/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 
function DelayedLoadingContext( id ){
	this.widgetid = id;
	this.m_promptValues = null;
}

DelayedLoadingContext.prototype.setPromptValues = function( promptValues ) {
	if (promptValues ===  null) {
		this.m_promptValues = null;
		return;
	}
	
	if (!this.m_promptValues) {
		this.m_promptValues = {};
	}
	
	// The m_promptValues object will have the parameter name as a property and
	// it's value is the parameter value. This way if a parameter is updated multiple times
	// we'll only keep track of the latest value.
	// COGCQ00854465
	applyJSONProperties(this.m_promptValues, promptValues);
};
 
DelayedLoadingContext.prototype.getPromptValues = function() {
	return this.m_promptValues;
};
 
DelayedLoadingContext.prototype.setForceRunReport = function( forceRunReport ) {
	this.m_forceRunReport = forceRunReport;
};
 
DelayedLoadingContext.prototype.getForceRunReport = function() {
	return this.m_forceRunReport;
};
 
DelayedLoadingContext.prototype.isEmpty = function() {
	return !(this.m_promptValues || this.m_forceRunReport);
};
 
 
DelayedLoadingContext.prototype.reset = function() {
	delete(this.m_promptValues);
	this.m_promptValues = null;
	this.m_forceRunReport = false;
	delete( this._cascadingPromptParamsToClear );
 };
 
DelayedLoadingContext.prototype.setCascadingPromptParamsToClear = function( cascadingPromptParamsToClear ) {
	this._cascadingPromptParamsToClear = cascadingPromptParamsToClear;
};

DelayedLoadingContext.prototype.getCascadingPromptParamsToClear = function() {
	return this._cascadingPromptParamsToClear;
};


 
  