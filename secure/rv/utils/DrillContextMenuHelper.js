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

function DrillContextMenuHelper() {}

/**
 * Visualization support: (also can be used for charts if VIEWER_JS_ENABLE_DRILL_SUBMENU is set to "charts")
 * This function either populates a drill submenu (see needsDrillSubMenu) or ensures jsonSpec is
 * set properly for a simple Drill Down or Drill Up menu item.  The submenu contains a "default"
 * and a set of one or more individual pieces that a user can decide to drill on.
 */
DrillContextMenuHelper.updateDrillMenuItems = function(jsonSpec, oCV, sAction)
{
	//There will be a submenu only if conditions are met....
	var subMenuItems = [];
	if (DrillContextMenuHelper.needsDrillSubMenu(oCV)) {
		var selectionController = oCV.getSelectionController();
		var selectedObjects = selectionController.getAllSelectedObjects();
		var selObj = selectedObjects[0];
	
		//For intersections, add the "Default menu item"
		if (selObj.getUseValues().length > 1 && typeof RV_RES != "undefined") {
			var oDrillOnMenuItem = { name: sAction, label: RV_RES.RV_DRILL_DEFAULT, action: { name: sAction, payload: {} } };
			subMenuItems.push(oDrillOnMenuItem);
		}

		//Add the innermost item.  For intersections, add the innermost level of dim1 and dim2
		var firstDim=(selObj.getUseValues().length>1) ? 1 : 0;
		var lastDim=selObj.getUseValues().length-1;
		lastDim=(lastDim>2) ? 2 : lastDim;	//Never allow the last dim to process more than rows/columns
		for (var iDim=firstDim; iDim<=lastDim; ++iDim) {
			DrillContextMenuHelper.addSubMenuItem(sAction, subMenuItems, selObj, iDim, 0);
		}
		//Do nested levels (either dim0 for edges or dim1 and dim2 for intersections)
		var bRenderedSeparator=false;
		for (var iDim=firstDim; iDim<=lastDim; ++iDim) {
			for (var iLevel=1; iLevel<selObj.getUseValues()[iDim].length; ++iLevel) {
				if (bRenderedSeparator==false) {
					subMenuItems.push({separator: true});
					bRenderedSeparator=true;	//If upper levels exist, render a separator.
				}
				DrillContextMenuHelper.addSubMenuItem(sAction, subMenuItems, selObj, iDim, iLevel);
			}
		}
	}

	DrillContextMenuHelper.completeDrillMenu(sAction, subMenuItems, jsonSpec);
};

/**
 * Visualization support:
 * Return true if a drill submenu needs to be shown under the Drill Up or Drill Down menu item. 
 * 
 * Rules: Show the submenu:
 * IF the number of dimensions OR the number of levels in the first dimension are > 1
 * AND its a visualization OR its a chart and the VIEWER_JS_ENABLE_DRILL_SUBMENU advanced server property is set to "charts".
 * 
 * NOTE: The Drill Up/Drill Down menu item won't be shown at all if the net drillability is determined to be 0.
 * 
 * @return true if this is the case.
 */
DrillContextMenuHelper.needsDrillSubMenu = function(oCV)
{
	var selectionController = (oCV && oCV.getSelectionController());
	if (selectionController) {
		var selectedObjects = selectionController.getAllSelectedObjects();
		if(selectedObjects.length == 1 && selectedObjects[0].isHomeCell && selectedObjects[0].isHomeCell() == false)	{
			var bDrillSubmenu = selectedObjects[0].isSelectionOnVizChart(); 
			if (!bDrillSubmenu) {
				var drillSubMenuType = oCV.getAdvancedServerProperty("VIEWER_JS_ENABLE_DRILL_SUBMENU");
				bDrillSubmenu = (drillSubMenuType=="charts" && selectionController.hasSelectedChartNodes());
			}
			
			if (bDrillSubmenu) {
				var selObj = selectedObjects[0];
				return (bDrillSubmenu && selObj.getUseValues() && (selObj.getUseValues().length > 1 || selObj.getUseValues()[0].length > 1));
			}
		}
	}
	return false;
};

/**
 * For the selected object at position iDim and iLevel, if that component of the selection is drillable,
 * add an item to the submenu.
 */
DrillContextMenuHelper.addSubMenuItem = function(sAction, subMenuItems, selObj, iDim, iLevel)
{
	var drillOption = selObj.getDrillOptions()[iDim][iLevel];
	if (DrillContextMenuHelper.isOptionDrillable(sAction, drillOption)) {
		var sItemLabel = DrillContextMenuHelper.getItemValue(selObj, iDim, iLevel);
		if (sItemLabel) {
			var sDataItem  = selObj.getDataItems()[iDim][iLevel];
			var oDrillOnMenuItem = { name: sAction, label: sItemLabel, action: { name: sAction, payload: { userSelectedDrillItem: sDataItem } } };
			subMenuItems.push(oDrillOnMenuItem);
		}
	}
};

/**
 * If a submenu is required, add the items, otherwise ensure the basic action is defined.
 */
DrillContextMenuHelper.completeDrillMenu = function(sAction, subMenuItems, jsonSpec)
{
	if (subMenuItems.length > 0) {
		jsonSpec.items = subMenuItems;
	} else {
		jsonSpec.items = null;
		if (jsonSpec.action==null) {
			jsonSpec.action = { name: sAction, action: { name: sAction } };
		}
	}
};


/**
 * Return true if the drillFlag value is drillable for the current action (eg: DrillDown and 2,3,4; DrillUp and 1,3,4) 
*/
DrillContextMenuHelper.isOptionDrillable = function(sAction, drillFlag)
{
	//0=none, 1=up, 2=down, 3=downorup, 4=upordown
	return (drillFlag>=3 || (sAction=="DrillDown" && drillFlag==2) || (sAction=="DrillUp" && drillFlag==1));
};

/**
 * Return the item value for the selected object...(usually the useValue of a label like "Camping Equipment")
 */
DrillContextMenuHelper.getItemValue = function(selObj, iDim, iLevel)
{
	var itemsLabel = (iLevel==0) ? selObj.getDisplayValues()[iDim] : null;
	return ((itemsLabel) ? itemsLabel : selObj.getUseValues()[iDim][iLevel]); 
};
