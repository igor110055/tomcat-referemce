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
 * DeleteAnnotationAction - implements deleting existing annotations in cognos viewer
 */
function DeleteAnnotationAction() {}
DeleteAnnotationAction.prototype = new AnnotationAction();

DeleteAnnotationAction.prototype.executeAction = function(viewer, widget, selection)
{
	if (viewer && widget &&  selection) {
		var cellRef = selection.getCellRef();
		var ctxId = viewer.findCtx(cellRef);
		widget.getAnnotationHelper().deleteComment(ctxId);
	}
};