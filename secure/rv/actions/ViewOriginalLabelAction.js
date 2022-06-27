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

function ViewOriginalLabelAction() {}

ViewOriginalLabelAction.prototype = new CognosViewerAction();

ViewOriginalLabelAction.prototype.getCellRef = function() {
	return this.m_oCV.getSelectionController().getSelections()[0].getCellRef();
};

ViewOriginalLabelAction.prototype.updateMenu = function(jsonSpec) {
	if (this.getNumberOfSelections() == 1)
	{
		var selRef = this.getCellRef();
		if (selRef.getAttribute("rp_name"))
		{
			var menuItems = [];
			menuItems.push({ name: "originalLabel", label: selRef.getAttribute("rp_name"), iconClass: "", action: null, items: null });
			jsonSpec.items = menuItems;
			return jsonSpec;
		}
	}

	return "";
};
