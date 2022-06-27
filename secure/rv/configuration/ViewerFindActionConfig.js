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

function ViewerFindActionConfig() {
	//PUBLIC API - Do not change. Start
	this.noMatchFoundCallback = null;
	this.findActionCompleteCallback = null;
	this.matchBackgroundColor = "yellow";
	this.focusBackgroundColor = "red";
	//PUBLIC API - Do not change. End
	
	this.updateStyle();
}

ViewerFindActionConfig.BACKGROUND = 'background: '; 
ViewerFindActionConfig.prototype.configure = function(configuration) {
	applyJSONProperties(this, configuration);
	
	this.updateStyle();
};
ViewerFindActionConfig.prototype.updateStyle = function() {
	this.matchBackgroundColor = this.matchBackgroundColor.toUpperCase();
	this.focusBackgroundColor = this.focusBackgroundColor.toUpperCase();
	
	this.matchUIStyle = ViewerFindActionConfig.BACKGROUND + this.matchBackgroundColor;
	this.focusUIStyle = ViewerFindActionConfig.BACKGROUND + this.focusBackgroundColor;
}

ViewerFindActionConfig.prototype.getNoMatchFoundCallback = function() {
	return typeof this.noMatchFoundCallback == "function" ? this.noMatchFoundCallback : this._defaultNoMatchFoundCallback;
};
ViewerFindActionConfig.prototype._defaultNoMatchFoundCallback = function() {
	if (console && console.log) {
		console.log('invoked _defaultNoMatchFoundCallback!');
	}
}

ViewerFindActionConfig.prototype.getFindActionCompleteCallback = function() {
	return typeof this.findActionCompleteCallback == "function" ? this.findActionCompleteCallback : this._defaultFindActionCompleteCallback;
};
ViewerFindActionConfig.prototype._defaultFindActionCompleteCallback = function() {
	if (console && console.log) {
		console.log('invoked _defaultFindActionCompleteCallback!');
	}
}

ViewerFindActionConfig.prototype.getMatchUIStyle = function() {
	return this.matchUIStyle;
};

ViewerFindActionConfig.prototype.getFocusUIStyle = function() {
	return this.focusUIStyle;
};

ViewerFindActionConfig.prototype.getMatchColor = function() {
	return this.matchBackgroundColor;
};
ViewerFindActionConfig.prototype.getFocusColor = function() {
	return this.focusBackgroundColor;
};

ViewerFindActionConfig.prototype.isFocusColorSameAsMatch = function() {
	return (this.focusBackgroundColor === this.matchBackgroundColor)
};
