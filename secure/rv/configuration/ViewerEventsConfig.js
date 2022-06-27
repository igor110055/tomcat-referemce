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

function ViewerEventsConfig() {
	this.showContextMenuOnClick = false;
}

/**
 * The data passed to this function is PUBLIC and show always be backwards compatible.
 */
ViewerEventsConfig.prototype.configure = function(configuration) {
	applyJSONProperties(this, configuration);
};

ViewerEventsConfig.prototype.getShowContextMenuOnClick = function() {
	return this.showContextMenuOnClick;	
};
