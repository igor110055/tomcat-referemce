/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * Override the loadExtra method to load the extra core file
 */
CCognosViewer.prototype.loadExtra = function() {
	var iWidget = this.getViewerWidget();
	if (iWidget) {
		iWidget.loadExtraJavascriptFiles(this.getWebContentRoot());
	}
};
