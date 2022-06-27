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

function GroupAction()
{
	this.m_sAction = "GroupColumn";
}
GroupAction.prototype = new ModifyReportAction();

GroupAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_GROUP_UNGROUP;
};

GroupAction.prototype.updateMenu = function(jsonSpec) {
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	var selectionController = this.m_oCV.getSelectionController();
	var aSelectedObjects = selectionController.getAllSelectedObjects();
	if (aSelectedObjects.length === 0 || selectionController.getDataContainerType() != 'list')
	{
		return this.disableMenuItem(jsonSpec);
	}

	if (aSelectedObjects[0].getCellRef().getAttribute("no_data_item_column") === "true")
	{
		return this.disableMenuItem(jsonSpec);
	}
	
	
	var bDimensionalDataSource = !selectionController.isRelational();
	for (var index = 0; index < aSelectedObjects.length; ++index)
	{
		/* disable if a selected object is a measure and
		 * data source is dimentional or its layout type is 'summary
		 */
		if (selectionController.getUsageInfo(aSelectedObjects[index].getSelectedContextIds()[0][0]) == selectionController.c_usageMeasure &&
			(bDimensionalDataSource || aSelectedObjects[index].getLayoutType() === "summary")) {
			return this.disableMenuItem(jsonSpec);
		}
	}

	jsonSpec.disabled = false;
	jsonSpec.iconClass = "group";

	return jsonSpec;
};

GroupAction.prototype.disableMenuItem = function(jsonSpec)
{
	jsonSpec.disabled = true;
	jsonSpec.iconClass = "groupDisabled";
	return jsonSpec;
};

GroupAction.prototype.addActionContextAdditionalParms = function()
{
	return this.addClientContextData(/*maxValuesPerRDI*/3);
};
