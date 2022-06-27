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
 * NewAnnotationAction - implements adding new annotations in cognos viewer
 */
function NewAnnotationAction() {}
NewAnnotationAction.prototype = new AnnotationAction();

NewAnnotationAction.prototype.executeAction = function(viewer, widget, selection)
{
	if (viewer && widget && selection) {
		var cellRef = selection.getCellRef();
		var ctxId = viewer.findCtx(cellRef);
		var value = selection.getDisplayValues()[0];
		window.setTimeout(function () { widget.getAnnotationHelper().addComment(ctxId, value); },0);
	}
};