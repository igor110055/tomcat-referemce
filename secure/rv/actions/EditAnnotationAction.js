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
 * EditAnnotationAction - implements editing an existing annotation in cognos viewer
 */
function EditAnnotationAction() {}
EditAnnotationAction.prototype = new AnnotationAction();

EditAnnotationAction.prototype.executeAction = function(viewer, widget, selection)
{
	if (viewer && widget &&  selection) {
		var cellRef = selection.getCellRef();
		var ctxId = viewer.findCtx(cellRef);
		window.setTimeout(function () { widget.getAnnotationHelper().editComment(ctxId); },0);
	}
};