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
 * DeleteWidgetAnnotationAction - implements deleting existing annotations on the cognos viewer widget
 */
function DeleteWidgetAnnotationAction() {}
DeleteWidgetAnnotationAction.prototype = new AnnotationAction();

DeleteWidgetAnnotationAction.prototype.execute = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();
	if (widget) {
		widget.getAnnotationHelper().deleteWidgetComment();
	}
};