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

function ViewerConfig() {
	this.uiConfig = new ViewerUIConfig();
	this.findConfig = typeof ViewerFindActionConfig == "function" ? new ViewerFindActionConfig() : null;
	this.httpRequestConfig = typeof ViewerHttpRequestConfig == "function" ? new ViewerHttpRequestConfig() : null;
	this.eventsConfig = typeof ViewerEventsConfig == "function" ? new ViewerEventsConfig() : null;
}

ViewerConfig.prototype.configure = function(configuration) {
	if (!configuration) {
		return;
	}
	
	if (configuration.findAction && this.findConfig) {
		this.findConfig.configure(configuration.findAction);
	}
	
	if (configuration.UI) {
		this.uiConfig.configure(configuration.UI);
	}
	
	if (configuration.httpRequestCallbacks && this.httpRequestConfig) {
		this.httpRequestConfig.configure(configuration.httpRequestCallbacks);
	}
	
	if (configuration.events && this.eventsConfig) {
		this.eventsConfig.configure(configuration.events);
	}
};

ViewerConfig.prototype.getUIConfig = function() {
	return this.uiConfig;
};

ViewerConfig.prototype.getFindActionConfig = function() {
	return this.findConfig;
};

ViewerConfig.prototype.getHttpRequestConfig = function() {
	return this.httpRequestConfig;
};

ViewerConfig.prototype.getEventsConfig = function() {
	return this.eventsConfig;
};
