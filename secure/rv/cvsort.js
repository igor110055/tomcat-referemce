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
function CognosViewerSort( event, oCV ) {
	this.m_oCV = oCV;
	if( event )
	{
		this.m_oEvent = event;

		this.m_oNode = getCrossBrowserNode(event, true);
	}
}

CognosViewerSort.prototype.setNode = function( node )
{
	this.m_oNode = node;
};

CognosViewerSort.prototype.getNode = function()
{
	return this.m_oNode;
};

/*
 * Checks to see if this is a sort action
 */
CognosViewerSort.prototype.isSort = function() {

	if(this.m_oNode && this.m_oNode.nodeName == 'IMG' && (this.m_oNode.id).indexOf('sortimg') >= 0 )
	{
		return true;
	}
	else
	{
		return false;
	}
};

CognosViewerSort.prototype.execute = function() {
	var selectionController = getCognosViewerSCObjectRef(this.m_oCV.getId());
	selectionController.selectSingleDomNode(this.m_oNode.parentNode);

	var sortAction = this.getSortAction();
	sortAction.setCognosViewer(this.m_oCV);
	sortAction.execute();

	if (window.gViewerLogger) {
		window.gViewerLogger.addContextInfo(selectionController);
	}
};

/*
 * The order of sort is ascending, descending and none.
 * Figure out what the current sort should be based on previous sort order.
 * Eg. if previous sort order is ascending, then next sort order should be descending.
 */
CognosViewerSort.prototype.getSortAction = function() {

	var sortAction = this.m_oCV.getAction("Sort");

	var sortOrder = this.m_oNode.getAttribute( 'sortOrder' );
	if( sortOrder.indexOf('nosort') != -1 )
	{
		sortAction.setRequestParms({order:"ascending", type:"value"});
	}
	else if ( sortOrder.indexOf('ascending') != -1 )
	{
		sortAction.setRequestParms({order:"descending", type:"value"});
	}
	else if( sortOrder.indexOf('descending') != -1)
	{
		sortAction.setRequestParms({order:"none", type:"value"});
	}

	return sortAction;
};

function SortAction()
{
	this.m_sAction = "Sort";
	this.m_sortOrder = "none";
	this.m_sortType = "";
	this.m_sItem = "";
	this.m_sId="";
}

SortAction.prototype = new ModifyReportAction();

SortAction.prototype.doExecute = function() {
	//Abort execute iff existing sort is none and new sort is none
	if (this.m_sortOrder === "none") {
		//Allow the execute if there is no container - i.e. no field is selected.
		//This occurs when the user cancels a sort from the infobar.
		if (this.getContainerId(this.m_oCV.getSelectionController())) {
			var currentSort = this.getCurrentSortFromSelection();
			if (this.m_sortType === "value" && currentSort.indexOf("sortByValue") === -1) {
				return false;
			} else if (this.m_sortType === "label" && currentSort.indexOf("sortByLabel") === -1) {
				return false;
			}
		}
	}
	return true;
};

SortAction.prototype.execute = function() {
	if(this.doExecute()) {
		ModifyReportAction.prototype.execute.call(this);
	}
};

SortAction.prototype.getUndoHint = function()
{
	if (this.m_sortOrder == "none")	{
		return RV_RES.IDS_JS_DONT_SORT;
	}
	else {
		return RV_RES.IDS_JS_SORT;
	}
};

SortAction.prototype.setRequestParms = function(payload)
{
	this.m_sortOrder = payload.order;
	this.m_sortType = payload.type;
	if (payload.id!=null && typeof payload.id != "undefined") {
		this.m_sId   = payload.id;
	}
	if (payload.item!=null && typeof payload.item != "undefined") {
		this.m_sItem = payload.item;
	}
};

SortAction.prototype.addActionContextAdditionalParms = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var parms = "<order>" + this.m_sortOrder + "</order>";
	if(this.m_sortType == "label")
	{
		parms += "<byLabel/>";
	}
	if (this.getContainerId(selectionController)=="" && this.m_sId != null && typeof this.m_sId != "undefined" && this.m_sId != "") {
		parms+= ("<id>" + xml_encode(this.m_sId) + "</id>");
	}
	if (this.m_sItem != null && typeof this.m_sItem != "undefined" && this.m_sItem!="") {
		parms+= ("<item>" + xml_encode(this.m_sItem) + "</item>");
	}

	parms += this.addClientContextData(/*maxValuesPerRDI*/3);
	
	parms += this.getSelectedCellTags();

	return parms;
};

SortAction.prototype.toggleMenu = function(jsonSpec, enabled)
{
	if (enabled)
	{
		jsonSpec.iconClass = "sort";
		jsonSpec.disabled = false;
	}
	else
	{
		jsonSpec.iconClass = "sortDisabled";
		jsonSpec.disabled = true;
	}
	return jsonSpec;
};

SortAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	this.buildMenu(jsonSpec);
	if (jsonSpec.disabled == true)	{
		return this.toggleMenu(jsonSpec, false);
	}

	return this.buildDynamicMenuItem(this.toggleMenu(jsonSpec, true), "Sort");
};

SortAction.prototype.buildSelectedItemsString = function(selectedObjects, isSortByValue/*isSortByValue=false means sortByLabel*/, containerReportInfo)
{
	try {
		var selObj = selectedObjects[selectedObjects.length -1];
		if (isSortByValue) {
			var itemsLabel = selObj.getDisplayValues()[0];
			if (typeof itemsLabel == "undefined") {
				itemsLabel = selObj.getUseValues()[0][0];
			}
			return itemsLabel;
		} else {
			return selObj.getDataItemDisplayValue(containerReportInfo);
		}
	}
	catch (e) {
		if (console && console.log) {
			console.log(e);
		}
	}
};

SortAction.prototype.buildMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	if(!this.isSelectionSortable())
	{
		return this.toggleMenu(jsonSpec, false);
	}
	jsonSpec = this.toggleMenu(jsonSpec, true);

	var sortItems = [];

	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if(selectedObjects.length == 1 && selectedObjects[0].isHomeCell() == false)
	{
		var containerType = selectionController.getDataContainerType();
		var containerId = this.getContainerId( selectionController );
		var selectedReportInfo = this.getReportInfo(containerId);

		//if the selection is on the section of the sectioned list, the containerType is "".
		if (containerType == "" && !this.isSelectionOnChart() && selectedObjects[0].getLayoutType() == "section") {
			if (selectedReportInfo != null) {
				containerType = selectedReportInfo.displayTypeId;
			}
		}
		var reportInfo, sItemLabel, sSelectionInfo;
		var currentSortFromSelection = this.getCurrentSortFromSelection();

		var bSelectionOnChart = this.isSelectionOnChart();
		var bSortByValue = currentSortFromSelection.indexOf("sortByValue") != -1;
		var bSortByValueAscending = currentSortFromSelection.indexOf("sortByValueAscending") != -1;
		var bSortByValueDescending = currentSortFromSelection.indexOf("sortByValueDescending") != -1;
		var bIsIWidgetMobile = this.m_oCV.isIWidgetMobile();
		
		if(containerType == "list" )
		{
			var oSortByValueAscendingMenuItem = { name: "SortAscending", label: RV_RES.IDS_JS_SORT_ASCENDING, action: { name: "Sort", payload: {order:"ascending", type:"value"} }, items: null };
			this.addMenuItemChecked(bSortByValueAscending, oSortByValueAscendingMenuItem, "sortAscending");
			sortItems.push(oSortByValueAscendingMenuItem);

			var oSortByValueDescendingMenuItem = { name: "SortDescending", label: RV_RES.IDS_JS_SORT_DESCENDING, action: { name: "Sort", payload: { order:"descending", type:"value"} }, items: null };
			this.addMenuItemChecked(bSortByValueDescending, oSortByValueDescendingMenuItem, "sortDescending");
			sortItems.push(oSortByValueDescendingMenuItem);

			var oSortMenuItem = { name: "DontSort", label: RV_RES.IDS_JS_DONT_SORT, action: { name: "Sort", payload: {order:"none",type:"value"} }, items: null };
			this.addMenuItemChecked(!bSortByValue, oSortMenuItem, "sortNone");
			sortItems.push(oSortMenuItem);
		}
		else if (containerType == "crosstab" || bSelectionOnChart)
		{
			if  (selectedObjects[0].getLayoutType() == 'columnTitle' || bSelectionOnChart)
			{
				reportInfo = this.m_oCV.getRAPReportInfo();
				if(this.canSortByValueOnCrosstab(selectedObjects[0], reportInfo))
				{
					sItemLabel = RV_RES.IDS_JS_SORT_BY_VALUE;
					// need to show what item will get sorted if we're dealing with charts since
					// charts don't show selection
					if (bSelectionOnChart) {
						sSelectionInfo = this.buildSelectedItemsString(selectedObjects, true /*sortByValue*/, selectedReportInfo);
						if (typeof sSelectionInfo !== "undefined") {
							sItemLabel += ":" + sSelectionInfo;
						}
					}
					var oSortByValueMenuItem = { name: "SortByValue", label: sItemLabel, action: null, items: [{ name: "Ascending", label: RV_RES.IDS_JS_SORT_BY_ASCENDING, action: { name: "Sort", payload: {order:"ascending",type:"value"} }, items: null }, { name: "Descending", label: RV_RES.IDS_JS_SORT_BY_DESCENDING, action: { name: "Sort", payload: {order:"descending",type:"value"} }, items: null }, { name: "SortNone", label: RV_RES.IDS_JS_DONT_SORT, action: { name: "Sort", payload: {order:"none",type:"value"} }, items: null } ] };

					this.addMenuItemChecked(bSortByValue, oSortByValueMenuItem);
					this.addMenuItemChecked(bSortByValueAscending, oSortByValueMenuItem.items[0], "sortAscending");
					this.addMenuItemChecked(bSortByValueDescending, oSortByValueMenuItem.items[1], "sortDescending");
					this.addMenuItemChecked(!bSortByValue, oSortByValueMenuItem.items[2], "sortNone");

					if (bIsIWidgetMobile) {
						oSortByValueMenuItem.flatten = true;
					}
					
					sortItems.push(oSortByValueMenuItem);
				}

				if(this.canSortByLabelOnCrosstab(selectedObjects[0]))
				{
					sItemLabel = RV_RES.IDS_JS_SORT_BY_LABEL;
					// need to show what item will get sorted if we're dealing with charts since
					// charts don't show selection
					if (bSelectionOnChart) {
						sSelectionInfo = this.buildSelectedItemsString(selectedObjects, false /*sortByLabel*/, selectedReportInfo);
						if (typeof sSelectionInfo !== "undefined") {
							sItemLabel += ":" + sSelectionInfo;
						}
					}

					var oSortByLabelMenuItem = { name: "SortByLabel", label: sItemLabel, action: null, items: [{ name: "Ascending", label: RV_RES.IDS_JS_SORT_BY_ASCENDING, action: { name: "Sort", payload: {order:"ascending",type:"label"} }, items: null }, { name: "Descending", label: RV_RES.IDS_JS_SORT_BY_DESCENDING, action: { name: "Sort", payload: {order:"descending",type:"label"} }, items: null }, { name: "SortNone", label: RV_RES.IDS_JS_DONT_SORT, action: { name: "Sort", payload: {order:"none",type:"label"} }, items: null } ] };

					var bSortByLabel = currentSortFromSelection.indexOf("sortByLabel") != -1;
					this.addMenuItemChecked(bSortByLabel, oSortByLabelMenuItem);
					this.addMenuItemChecked(currentSortFromSelection.indexOf("sortByLabelAscending") != -1, oSortByLabelMenuItem.items[0], "sortAscending");
					this.addMenuItemChecked(currentSortFromSelection.indexOf("sortByLabelDescending") != -1, oSortByLabelMenuItem.items[1], "sortDescending");
					this.addMenuItemChecked(!bSortByLabel, oSortByLabelMenuItem.items[2], "sortNone");

					if (bIsIWidgetMobile) {
						oSortByLabelMenuItem.flatten = true;
					}

					sortItems.push(oSortByLabelMenuItem);
				}
			}
		}
	}

	if(sortItems.length == 0)
	{
		this.toggleMenu(jsonSpec, false);
	}
	else
	{
		if (bIsIWidgetMobile) {
			if (containerType == "crosstab" || bSelectionOnChart) {
				jsonSpec.useChildrenItems = true;
			}
			else {
				jsonSpec.flatten = true;
			}
		}
		
		jsonSpec.items = sortItems;
		this.toggleMenu(jsonSpec, true);
	}
	return jsonSpec;
};

SortAction.prototype.isSelectionSortable = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if (selectedObjects.length == 1) {
		var selectedObject = selectedObjects[0];
		//If the select object should be disabled when the user selects a measured cell(s).
		if (selectionController.getDataContainerType() == "crosstab" && selectedObject.getLayoutType() == 'datavalue')
		{
			return false;
		}

		if (selectionController.hasSelectedChartNodes())
		{
			var node = selectedObject.getArea();
			if (node.nodeName == 'AREA' || node.nodeName == 'IMG')
			{
				return selectedObjects[0].getLayoutType() == 'ordinalAxisLabel' || selectedObjects[0].getLayoutType() == 'legendLabel';
			}
		}
		else
		{
			var data = selectedObject.getDataItems();
			if(selectedObject.getCellRef().getAttribute("type") == "datavalue" && !(data && data.length)) {
				//Not sortable if there is no logical data in the selection
				return false;
			}
			var oCell = selectedObject.getCellRef();
			if (oCell.getAttribute("no_data_item_column") === "true") {
				return false;
			}
			if (oCell.getAttribute("canSort") != "false") {
				return true;
			}
		}


	}

	return false;
};


SortAction.prototype.getCurrentSortFromSelection = function()
{
	var containerId = this.getContainerId(this.m_oCV.getSelectionController());
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();

	var currentSortFromSelection = "";

	if(containerId != "" && oRAPReportInfo) {
		var container = oRAPReportInfo.getContainer(containerId);
		if(typeof container.sort != "undefined") {
			var selectionController = this.m_oCV.getSelectionController();
			var selectedObjects = selectionController.getAllSelectedObjects();

			if(selectedObjects.length == 1) {
				var dataItems = selectedObjects[0].getDataItems();
				if(dataItems.length < 1) {
					return currentSortFromSelection;
				}
				var dataItem = dataItems[0][0];

				for(var index = 0; index < container.sort.length; ++index) {
					var sortInfo = container.sort[index];

					if(typeof sortInfo.labels == "string" && sortInfo.labels == dataItem) {
						currentSortFromSelection += sortInfo.order == "descending" ? "sortByLabelDescending" : "sortByLabelAscending";
					}

					if(typeof sortInfo.valuesOf == "string" && (sortInfo.valuesOf == dataItem || this.isSortedValueOnRenamedColumn(selectedObjects[0], sortInfo))) {
						currentSortFromSelection += sortInfo.order == "descending" ? "sortByValueDescending" : "sortByValueAscending";
					}
					else if(sortInfo.valuesOf instanceof Array) {
						var match = true;
						for(var valueSortIdx = 0; valueSortIdx < sortInfo.valuesOf.length; ++valueSortIdx) {
							if(valueSortIdx < selectedObjects[0].m_contextIds[0].length) {
								var ctx = selectedObjects[0].m_contextIds[0][valueSortIdx];
								var selectionDisplayValue = selectionController.getDisplayValue(ctx);
								var sortDisplayValue = this.findItemLabel(container, sortInfo.valuesOf[valueSortIdx].item);

								if(sortDisplayValue != selectionDisplayValue) {
									match = false;
									break;
								}
							}
						}
						if(match) {
							currentSortFromSelection += sortInfo.valuesOf[0].order == "descending" ? "sortByValueDescending" : "sortByValueAscending";
						}
					}
				}
			}
		}
	}

	return currentSortFromSelection;
};

SortAction.prototype.isSortedValueOnRenamedColumn =function(selectedObject, sortInfo){
 if(sortInfo && selectedObject){
 	return (sortInfo.valuesOf === selectedObject.getColumnRP_Name() && selectedObject.getLayoutType() === "columnTitle");
 }	
};

SortAction.prototype.findItemLabel = function(container, item) {
	var itemInfo = container.itemInfo;
	if (itemInfo) {
		for (var i = 0; i < itemInfo.length; i++) {
			if (itemInfo[i].item === item) {
				if (itemInfo[i].itemLabel) {
					return itemInfo[i].itemLabel;
				}
				break;
			}
		}
	}
	return item;
};

SortAction.prototype.canSortByValueOnCrosstab = function(selectedObject, reportInfo)
{
	var selectionController = this.m_oCV.getSelectionController();
	var containerId = this.getContainerId(this.m_oCV.getSelectionController());

	if (selectionController.isRelational() == true) {
		return false;
	}

	if (selectionController.selectionsHaveCalculationMetadata() && this.selectedObjectIsLeaf(containerId, selectedObject, reportInfo)) {
		//The DAM layer allows "tagging" of calculation values which are part of sets with uuid designators.
		//These uuid's are simply passed through and returned as if they were mun's (but are not muns and can't be used in expressions)
		//We don't support these as discrete values.
		var aMuns = selectedObject.getMuns()[0];
		for (var index = 0; index < aMuns.length; ++index)
		{
			if (aMuns[index] != null && aMuns[index].indexOf("uuid:") >= 0)
			{
				return false;
			}
		}

		return true;
	}

	return false;
};

SortAction.prototype.selectedObjectIsLeaf = function (containerId, selectedObject, reportInfo)
{
	if (reportInfo) {
		var dataItems = selectedObject.getDataItems();
		if (dataItems != null && typeof dataItems != "undefined" && dataItems.length > 0) {
			var oDrillability = reportInfo.getDrillability(containerId, dataItems[0][0]);
			if (oDrillability) {
				return oDrillability.leaf == true;
			}
		}
	}
	return false;
};

SortAction.prototype.canSortByLabelOnCrosstab = function(selectedObject)
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if(selectedObjects.length == 1) {
		// FIXME: This variable (selectedObject) is masking the first parameter. Remove variable or the parameter.
		var selectedObject = selectedObjects[0];
		if (this.isSelectSingleMember(selectedObject)==false)
		{
			if (selectionController.selectionsNonMeasureWithMUN() || !selectionController.selectionsHaveCalculationMetadata()) {
					return true;
			}
		}
	}
	return false;
};
