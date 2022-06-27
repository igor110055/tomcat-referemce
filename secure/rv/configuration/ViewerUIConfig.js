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

function ViewerUIConfig() {
	this.showBanner = true;
	this.showToolbar = true;
	this.showContextMenu = true;
	this.showPageNavigation = true;
	this.primarySelectionColor = null;
	this.secondarySelectionColor = null;
	this.showSecondarySelection = true;
}

ViewerUIConfig.prototype.configure = function(configuration) {
	applyJSONProperties(this, configuration);
};

ViewerUIConfig.prototype.getShowBanner = function() {
	return this.showBanner;
};

ViewerUIConfig.prototype.getShowToolbar = function() {
	return this.showToolbar;
};

ViewerUIConfig.prototype.getShowContextMenu = function() {
	return this.showContextMenu;
};

ViewerUIConfig.prototype.getShowPageNavigation = function() {
	return this.showPageNavigation;
};

ViewerUIConfig.prototype.getPrimarySelectionColor = function() {
	return this.primarySelectionColor;
};

ViewerUIConfig.prototype.getSeondarySelectionColor = function() {
	return this.secondarySelectionColor;
};

ViewerUIConfig.prototype.getShowSecondarySelection = function() {
	return this.showSecondarySelection;
};
