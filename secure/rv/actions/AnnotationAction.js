/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function AnnotationAction() {}
AnnotationAction.prototype = new CognosViewerAction();

AnnotationAction.prototype.updateMenu = function(jsonSpec)
{
	var viewerWidgetRef = this.m_oCV.getViewerWidget();

	var aAnnotations = this.m_oCV.aBuxAnnotations;
	var annItems = [];
	for (var annIndex=0; annIndex < aAnnotations.length; annIndex++)
	{
		var ann = eval("new " + aAnnotations[annIndex] + "()");
		ann.setCognosViewer(this.m_oCV);
		if (ann && ann.isEnabled(jsonSpec.placeType))
		{
			var newAnnItem = {};
			newAnnItem.name = aAnnotations[annIndex];
			newAnnItem.label = ann.getMenuItemString(viewerWidgetRef.getAttributeValue("itemName"));
			newAnnItem.action = {};
			newAnnItem.action.name = aAnnotations[annIndex];
			newAnnItem.action.payload = "";
			newAnnItem.items = null;
			newAnnItem.iconClass = ann.getMenuItemIconClass();// aAnnotations[annIndex];
			annItems.push(newAnnItem);
		}
	}

	jsonSpec.items = annItems;
	jsonSpec.disabled = !(jsonSpec.items && jsonSpec.items.length);
	
	if(jsonSpec.disabled) {
		jsonSpec.iconClass = "disabledAnnotation";
	} else {
		jsonSpec.iconClass = "annotation";
	}

	return jsonSpec;
};

AnnotationAction.prototype.execute = function()
{
	var viewer = this.getCognosViewer();
	var selCon = viewer.getSelectionController();
	var selections = selCon.getSelections();
	if (selections && selections.length == 1) {
		var widget = viewer.getViewerWidget();
		if (widget) {
			this.executeAction(viewer, widget, selections[0]);
		}
	}
};

AnnotationAction.prototype.executeAction = function(viewer, widget, selection)
{
	//Do nothing -- derived classes should override this method to perform the necessary action
};