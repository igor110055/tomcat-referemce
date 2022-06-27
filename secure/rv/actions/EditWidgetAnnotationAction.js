/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * EditWidgetAnnotationAction - implements editing an existing annotation to the cognos viewer widget
 */
function EditWidgetAnnotationAction() {}
EditWidgetAnnotationAction.prototype = new AnnotationAction();

EditWidgetAnnotationAction.prototype.execute = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();
	if (widget) {
		window.setTimeout(function () { widget.getAnnotationHelper().editWidgetComment(); },0);
	}
};