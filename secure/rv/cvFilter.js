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
function FilterAction() {
	this.m_sAction = "Filter";
	this.m_sType = "";
	this.m_sItem = "";
	this.m_sFormattedNumber= "";
	this.m_sFormattedEndNumber= "";
	this.m_jsonDetails = "";
}


FilterAction.prototype = new ModifyReportAction();

FilterAction.prototype.execute = function()
{
	ModifyReportAction.prototype.execute.apply(this, arguments)
	if (this.m_sType.indexOf("remove") != -1) {
		this.getCognosViewer().getViewerWidget().clearRAPCache();
	}
};

FilterAction.prototype.genSelectionContextWithUniqueCTXIDs = function() { return true; };

FilterAction.prototype.getUndoHint = function()
{
	if (this.m_sType.indexOf("remove") != -1) {
		return RV_RES.IDS_JS_REMOVE_FILTER;
	} else {
		return RV_RES.IDS_JS_FILTER;
	}
};

FilterAction.prototype.setRequestParms = function( parms )
{
	if (parms.type!=null && typeof parms.type != "undefined") {
		this.m_sType = parms.type;
		if (parms.id!=null && typeof parms.id != "undefined") {
			this.m_sId   = parms.id;
		}
		if (parms.item!=null && typeof parms.item != "undefined") {
			this.m_sItem = parms.item;
		}
		if (parms.details) {
			this.m_jsonDetails = parms.details;
		}
		if (parms.formattedNumber!=null && typeof parms.formattedNumber != "undefined") {
			this.m_sFormattedNumber = parms.formattedNumber;
		}
		if (parms.formattedEndNumber!=null && typeof parms.formattedEndNumber != "undefined") {
			this.m_sFormattedEndNumber = parms.formattedEndNumber;
		}
	} else {
		this.m_sType = parms;
	}
};

FilterAction.prototype.addActionContextAdditionalParms = function()
{
	var parms = "<type>" + this.m_sType + "</type>";
	if (this.m_sId != null && typeof this.m_sId != "undefined") {
		parms+= ("<id>" + xml_encode(this.m_sId) + "</id>");
	}
	if (this.m_sItem != null && typeof this.m_sItem != "undefined" && this.m_sItem!="") {
		parms+= ("<item>" + xml_encode(this.m_sItem) + "</item>");
	}
	if (this.m_jsonDetails && this.m_jsonDetails!="")
	{
		parms+= "<details>" + xml_encode(this.m_jsonDetails) + "</details>";
	}
	if (this.m_sFormattedNumber != null && typeof this.m_sFormattedNumber != "undefined" && this.m_sFormattedNumber!="") {
		parms+= ("<formattedNumber>" + this.m_sFormattedNumber + "</formattedNumber>");
	}
	if (this.m_sFormattedEndNumber != null && typeof this.m_sFormattedEndNumber != "undefined" && this.m_sFormattedEndNumber!="") {
		parms+= ("<formattedEndNumber>" + this.m_sFormattedEndNumber + "</formattedEndNumber>");
	}
	return parms;
};

FilterAction.prototype.buildSelectedItemsString = function(selectedObjects)
{
	var itemsLabel = "";
	var numberOfSelectedItems = selectedObjects.length;
	var numberOfItemsToAdd = numberOfSelectedItems > 5 ? 5 : numberOfSelectedItems;

	for(var index = 0; index < numberOfSelectedItems; ++index)
	{
		var value = this.getItemLabel(selectedObjects[index]);

		if (typeof value == "undefined" || value == "")
		{
			 //a selectedObject has neither displayValue nor useValue.
			return "";
		}
		if((index) < numberOfItemsToAdd)
		{
			itemsLabel += value;
		}
		if((index+1) < numberOfItemsToAdd)
		{
			itemsLabel += ", ";
		}
	}

	if(numberOfSelectedItems > 5)
	{
		itemsLabel += ", ++";
	}

	return itemsLabel;
};

FilterAction.prototype.getItemLabel = function (selectedObject)
{
	var value = selectedObject.getDisplayValues()[0];
	if (typeof value == "undefined")
	{
		value = selectedObject.getUseValues()[0][0];
	}
	return value;
};

FilterAction.prototype.toggleMenu = function(jsonSpec, enabled)
{
	if (enabled)
	{
		jsonSpec.iconClass = "filter";
		jsonSpec.disabled = false;
	}
	else
	{	jsonSpec.iconClass = "filterDisabled";
		jsonSpec.disabled = true;
	}
	return jsonSpec;
};

FilterAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = (this.ifContainsInteractiveDataContainer() && !this.detailFilteringIsDisabled());
	var result = jsonSpec;
	if (jsonSpec.visible) {
		var canAddOrRemoveFilters=(this.m_oCV.getSelectionController().getAllSelectedObjects().length > 0 
									|| this.isSelectionFilterable() || this.isRemoveAllValid()); 
		if (!canAddOrRemoveFilters) {
			result = this.toggleMenu(jsonSpec, false);
		}
		else {
			this.buildMenu(jsonSpec);
			if (jsonSpec.disabled == true) {
				result = this.toggleMenu(jsonSpec, false);
			}
			else {
				result = this.buildDynamicMenuItem(jsonSpec, "Filter");
			}
		}
	}
	return result;
};

FilterAction.prototype.detailFilteringIsDisabled = function()
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	if (oRAPReportInfo) {
		return oRAPReportInfo.isDetailFilteringDisabled();
	}

	return false;
};

FilterAction.prototype.buildMenu = function(jsonSpec)
{

	jsonSpec.visible = (this.ifContainsInteractiveDataContainer() &&
						!this.detailFilteringIsDisabled());
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	var selectionIsFilterable=this.isSelectionFilterable();
	this.toggleMenu(jsonSpec, selectionIsFilterable);

	var filterItems = [];
	var filterValueActionsAdded = false;
	var renderedRemoveSeparator = false;

	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if(selectedObjects.length > 0 && selectionController.selectionsInSameDataContainer() && selectionController.selectionsFromSameDataItem())
	{
		var refDataItem = selectedObjects[0].getDataItems()[0][0];
		if (selectionIsFilterable) {
			filterValueActionsAdded = this.addFilterValueActionsToMenu(selectionController, filterItems, refDataItem);
		}

		if (this.isRemoveItemFilterValid(refDataItem)) {
			if (filterValueActionsAdded == true) {
				filterItems.push({separator: true});
				renderedRemoveSeparator=true;
			}

			var label = this.getRefDataItemLabel(refDataItem);
			filterItems.push({ name: "RemoveFilterFor", label: RV_RES.IDS_JS_REMOVE_FILTER_FOR + " " + enforceTextDir(label), iconClass: "", action: { name: "Filter", payload: "remove" }, items: null });
		}
	}

	if (this.isRemoveAllValid()==true) {
		if (filterValueActionsAdded && !renderedRemoveSeparator) {
			filterItems.push({separator: true});
		}
		filterItems.push({ name: "RemoveAllFiltersForWidget", label: RV_RES.IDS_JS_REMOVE_ALL_FILTERS_FOR_WIDGET, iconClass: "", action: { name: "Filter", payload: "removeAllForWidget" }, items: null });
	}

	if(filterItems.length == 0)
	{
		return this.toggleMenu(jsonSpec, false);

	} else	{
		jsonSpec.items = filterItems;
		this.toggleMenu(jsonSpec, true);
		return jsonSpec;
	}

};

FilterAction.prototype.getRefDataItemLabel = function(refDataItem)
{
	var label = refDataItem;
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
	if (oRAPReportInfo) {
		var oFilter = oRAPReportInfo.getFilterObject(refDataItem, true);
		if (oFilter) {
			label = oFilter.itemLabel;
		}
	}

	return label;
};

FilterAction.prototype.addFilterValueActionsToMenu = function(selectionController, filterItems, refDataItem)
{
	var selectedObjects = selectionController.getAllSelectedObjectsWithUniqueCTXIDs();


	// Don't add the filter actions if the data container is a list and the list
	// column header is selected
	var numberOfSelectedValues = selectedObjects.length;
	var sel = 0;
	if (selectedObjects[0].m_dataContainerType=='list') {
		for (sel=0; sel<selectedObjects.length; ++sel) {
			if (selectedObjects[sel].m_sLayoutType == 'columnTitle') {
				numberOfSelectedValues=0;
				break;
			}
		}
	}

	if (numberOfSelectedValues == 0)
	{
		return false;
	}
	var itemsLabel = this.buildSelectedItemsString(selectedObjects);
	if (itemsLabel == "")
	{
		if (numberOfSelectedValues == 1 && selectedObjects[0].getLayoutType() == "datavalue")
		{
			itemsLabel = RV_RES.IDS_JS_NULL;
			filterItems.push({ name: "InFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_INCLUDE, itemsLabel), iconClass: "", action: { name: "Filter", payload: "in" }, items: null });
			filterItems.push({ name: "NotInFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_EXCLUDE, itemsLabel), iconClass: "", action: { name: "Filter", payload: "not" }, items: null });
		}
	}
	else {
		if (selectionController.selectionsAreDateTime() || 
			(selectionController.selectionsHaveCalculationMetadata() && !selectionController.selectionsNonMeasureWithMUN() )) {
			// Don't present numeric filtering options if column titles are
			// selected
			for (sel=0; sel<numberOfSelectedValues; ++sel) {
				if (selectedObjects[sel].m_sLayoutType == 'columnTitle') {
					return false;
				}
			}
			if(numberOfSelectedValues == 1)
			{
				if (selectedObjects[0].getUseValues()[0][0]) {
					filterItems.push({ name: "LessFilter", label: RV_RES.IDS_JS_FILTER_LESS_THAN + " " + itemsLabel, iconClass: "", action: { name: "Filter", payload: { type:"lessThan", formattedNumber: itemsLabel }}, items: null });
					filterItems.push({ name: "LessEqualFilter", label: RV_RES.IDS_JS_FILTER_LESS_THAN_EQUAL + " " + itemsLabel, iconClass: "", action: { name: "Filter", payload: { type:"lessThanEqual", formattedNumber: itemsLabel }}, items: null });
					filterItems.push({ name: "GreaterEqualFilter", label: RV_RES.IDS_JS_FILTER_GREATER_THAN_EQUAL + " " + itemsLabel, iconClass: "", action: { name: "Filter", payload: { type:"greaterThanEqual", formattedNumber: itemsLabel }}, items: null });
					filterItems.push({ name: "GreaterFilter", label: RV_RES.IDS_JS_FILTER_GREATER_THAN + " " + itemsLabel, iconClass: "", action: { name: "Filter", payload: { type:"greaterThan", formattedNumber: itemsLabel }}, items: null });
				}
			}
			else if(numberOfSelectedValues == 2)
			{
				if (selectedObjects[0].getUseValues()[0][0] && selectedObjects[1].getUseValues()[0][0]) {
					var formattedNumber = this.getItemLabel(selectedObjects[0]);
					var formattedEndNumber = this.getItemLabel(selectedObjects[1]);
					filterItems.push({ name: "BetweenFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_BETWEEN, [formattedNumber, formattedEndNumber]), iconClass: "", action: { name: "Filter", payload: {type: "between", formattedNumber: formattedNumber, formattedEndNumber: formattedEndNumber}}, items: null });
					filterItems.push({ name: "NotBetweenFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_NOT_BETWEEN, [formattedNumber, formattedEndNumber]), iconClass: "", action: { name: "Filter", payload: {type: "notBetween", formattedNumber: formattedNumber, formattedEndNumber: formattedEndNumber }}, items: null });
				}
			}
			else
			{
				return false;
			}
		}
		else
		{
			var containerType = selectionController.getDataContainerType();
			if (containerType == "crosstab" && selectedObjects[0].getLayoutType() == 'columnTitle')	{
				if (this.isSelectSingleMember(selectedObjects[0])==true)	{
					return false;
				}
			}
			filterItems.push({ name: "InFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_INCLUDE, enforceTextDir(itemsLabel)), iconClass: "", action: { name: "Filter", payload: "in" }, items: null });
			filterItems.push({ name: "NotInFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_EXCLUDE, enforceTextDir(itemsLabel)), iconClass: "", action: { name: "Filter", payload: "not" }, items: null });
		}
	}

	return true;
};

FilterAction.prototype.isRemoveAllValid = function()
{
	// If the reportInfo has any filters for any container, remove all is valid.
	var reportInfo = this.m_oCV.getRAPReportInfo();
	if(reportInfo) {
		return reportInfo.containsFilters();
	}
	return false;
};

FilterAction.prototype.isRemoveItemFilterValid = function(refDataItem)
{
	var containerId = this.getContainerId(this.m_oCV.getSelectionController());
	var reportInfo = this.m_oCV.getRAPReportInfo();
	if(containerId != null && reportInfo)
	{
		var oFilter = reportInfo.getFilterObjectFromContainer(containerId, refDataItem, false);
		return oFilter ? true : false;
	}
	return false;
};

FilterAction.prototype.isSelectionFilterable = function() {
	var selectionController = this.m_oCV.getSelectionController();

	var selectedObjects = selectionController.getAllSelectedObjects();
	if (selectedObjects.length > 0) {
		var cellRef = selectedObjects[0].getCellRef();
		if (cellRef && cellRef.getAttribute && cellRef.getAttribute("no_data_item_column") === "true") {
			return false;
		}
		
		if (selectionController.hasSelectedChartNodes()) {
			//CHARTS: Selections are not filterable if:
			//		1) Any title is selected (eg legendTitle, numericAxisTitle, ordinalAxisTitle)
			//		2) A calc/measure that is on an edge is selected (eg. legendLabel, ordinalAxisLabel)
			var measureOrCalculationType=false;
			if (selectionController.selectionsAreDateTime() || 
				(selectionController.selectionsHaveCalculationMetadata() && !selectionController.selectionsNonMeasureWithMUN() )) {
				measureOrCalculationType=true;
			}
			for (var sel=0; sel<selectedObjects.length; ++sel) {
				if (selectedObjects[sel].getLayoutType()) {
					if (selectedObjects[sel].getLayoutType().match('Title$')=='Title') {
						return false;
					}
					if (measureOrCalculationType && selectedObjects[sel].getLayoutType().match('Label$')=='Label') {
						return false;
					}
				}
			}
		}
	}
	return true;
};


function GetFilterInfoAction()
{
	this.m_requestParms = null;
}

GetFilterInfoAction.prototype = new ModifyReportAction();

GetFilterInfoAction.prototype.isUndoable = function()
{
	return false;
};

GetFilterInfoAction.prototype.canBeQueued = function() 
{
	return true;
};

GetFilterInfoAction.prototype.setRequestParms = function( parms )
{
	this.m_requestParms = parms;
};

GetFilterInfoAction.prototype.runReport = function()
{
	return false;
};

GetFilterInfoAction.prototype.updateInfoBar = function()
{
	return false;
};

GetFilterInfoAction.prototype.fireModifiedReportEvent = function()
{
	// do nothing
};

GetFilterInfoAction.prototype.buildActionContextAdditionalParmsXML = function()
{
	var itemDoc = XMLBuilderCreateXMLDocument("item");
	var itemElement = itemDoc.documentElement;
	for( var parm in this.m_requestParms )
	{
		if( this.m_requestParms.hasOwnProperty( parm ) )
		{
			var parameterElement = itemDoc.createElement( parm );
			parameterElement.appendChild( itemDoc.createTextNode( this.m_requestParms[parm]));
			itemElement.appendChild( parameterElement );
		}
	}

	return itemDoc;
};

GetFilterInfoAction.prototype.addActionContextAdditionalParms = function()
{
	if( this.m_requestParms === null )
	{
		return "";
	}
	return XMLBuilderSerializeNode( this.buildActionContextAdditionalParmsXML() );
};

GetFilterInfoAction.prototype.createFilterInfoDispatcherEntry = function()
{
	var filterInfoDispatcherEntry = new ReportInfoDispatcherEntry(this.m_oCV);
	filterInfoDispatcherEntry.initializeAction(this);
	return filterInfoDispatcherEntry;
};

GetFilterInfoAction.prototype.execute = function() {
	this.getCognosViewer().setKeepFocus(this.keepFocusOnWidget());
	var filterInfoDispatcherEntry = this.createFilterInfoDispatcherEntry();
	this.m_oCV.dispatchRequest(filterInfoDispatcherEntry);
	this.fireModifiedReportEvent();
};

GetFilterInfoAction.prototype.getOnPromptingCallback = function(){
	return this.getOnCompleteCallback();
};

function GetFilterValuesAction()
{
	this.m_sAction = 'CollectFilterValues';
	this.m_sRetryClass = 'GetFilterValues';
}

GetFilterValuesAction.prototype = new GetFilterInfoAction();

GetFilterValuesAction.prototype.addActionContextAdditionalParms = function()
{
	if( this.m_requestParms === null )
	{
		return "";
	}
	var itemDoc = this.buildActionContextAdditionalParmsXML();
	var itemElement = itemDoc.documentElement;
	for( var parm in this.m_requestParms ) {
		if (parm == "name") {
			// If we can find a min and max, send it....
			var selectionController = this.m_oCV.getSelectionController();
			if (typeof selectionController != "undefined" &&
				typeof selectionController.getCCDManager() != "undefined") {
				var minMax = selectionController.getCCDManager().GetPageMinMaxForRDI(this.m_requestParms[parm]);
				if (typeof minMax != "undefined") {
					var pageMinElement = itemDoc.createElement( "pageMin" );
					pageMinElement.appendChild( itemDoc.createTextNode( minMax.pageMin ) );
					var pageMaxElement = itemDoc.createElement( "pageMax" );
					pageMaxElement.appendChild( itemDoc.createTextNode( minMax.pageMax ) );
					itemElement.appendChild(pageMinElement);
					itemElement.appendChild(pageMaxElement);
				}
				if (this.m_oCV.isSinglePageReport() == true) {
					var singlePage = itemDoc.createElement("singlePageReport");
					itemElement.appendChild(singlePage);
				}
			}
			break;
		}
	}

	var additionalParms = XMLBuilderSerializeNode( itemDoc );
	return (additionalParms + this.addClientContextData(/*maxValuesPerRDI*/3));
};

GetFilterValuesAction.prototype.getOnCompleteCallback = function()
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();
	var params = this.m_requestParms;

	var callback = function(response) {
		viewerWidget.handleGetFilterValuesResponse(response, params);
	};

	return callback;
};

GetFilterValuesAction.prototype.canBeQueued = function() { return true; };
GetFilterValuesAction.prototype.getActionKey = function()
{
	if (typeof this.m_requestParms != "undefined" &&
		typeof this.m_requestParms.source != "undefined") {
			return this.m_sAction+this.m_requestParms.source;
	}
	return null;
};

function GetFilterableItemsAction()
{
	this.m_sAction = 'CollectFilterableItems';		
}

GetFilterableItemsAction.prototype = new GetFilterInfoAction();

GetFilterableItemsAction.prototype.addActionContextAdditionalParms = function()
{
	return this.addClientContextData(/*maxValuesPerRDI*/3);
};

GetFilterableItemsAction.prototype.getOnCompleteCallback = function()
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();
	var callback = function(response) {
		viewerWidget.handleGetFilterableItemsResponse(response);
	};

	return callback;
};


function UpdateDataFilterAction()
{
	this.m_sAction = "UpdateDataFilter";
	this.m_bForceRunSpec = false;
}

UpdateDataFilterAction.prototype = new ModifyReportAction();

UpdateDataFilterAction.prototype.runReport = function() {
	return this.getViewerWidget().shouldReportBeRunOnAction();
};

UpdateDataFilterAction.prototype.getActionKey = function()
{
	if (typeof this.m_requestParams != "undefined") {
		try
		{
			var parms = eval("(" + this.m_requestParams + ")");
			if (parms.clientId !== null) {
				return this.m_sAction + parms.clientId;
			}
		}
		catch (e)
		{
			// If eval fails for any reason, return a null actionKey.
		}
	}
	return null;
};

UpdateDataFilterAction.prototype.canBeQueued = function()
{
	return true;
};

UpdateDataFilterAction.prototype.keepFocusOnWidget = function()
{
	return false;
};

UpdateDataFilterAction.prototype.isUndoable = function()
{
	return false;
};

UpdateDataFilterAction.prototype.setRequestParms = function( parms )
{
	this.m_requestParams = parms.filterPayload;
	this.m_drillResetHUN = parms.drillResetHUN;
	this.m_isFacet = parms.isFacet;
	if (parms.forceCleanup) {
		this.m_sForceCleanup = parms.forceCleanup;
	}
};

UpdateDataFilterAction.prototype.forceRunSpecRequest = function() {
	return this.m_bForceRunSpec;
};

UpdateDataFilterAction.prototype.preProcessContextValues = function() {

	var resultingProcessedRequestParamsValues = [];

	var requestParamsObject = dojo.fromJson(this.m_requestParams);
			
	if(requestParamsObject && requestParamsObject["com.ibm.widget.context"] && (requestParamsObject["com.ibm.widget.context"]["values"] || requestParamsObject["com.ibm.widget.context"]["ranges"]) ) {	
		var oRAPReportInfo = this.m_oCV.m_RAPReportInfo;
		var reportContainers = oRAPReportInfo.getContainers();
		if(!reportContainers) {
			resultingProcessedRequestParamsValues;
		}
		
		// strip out data items which we don't care about (aren't part report info)
		var key = "";
		var contextObject = "";
		if(requestParamsObject["com.ibm.widget.context"]["values"]) {
			key = "values";
			contextObject = requestParamsObject["com.ibm.widget.context"]["values"];
		} else {
			key = "ranges";
			contextObject = requestParamsObject["com.ibm.widget.context"]["ranges"];
		}

		var existingSliderInfo = oRAPReportInfo.collectSliderSetFromReportInfo();
		
		for(dataItem in contextObject) {
			if (oRAPReportInfo && oRAPReportInfo.isReferenced(dataItem)) {
				var clonedRequestParam = dojo.clone(requestParamsObject);
				var newValues = {};
				newValues[dataItem] = requestParamsObject["com.ibm.widget.context"][key][dataItem];
				clonedRequestParam["com.ibm.widget.context"][key] = newValues;
				
				if(requestParamsObject["com.ibm.widget.context.bux.selectValueControl"] && requestParamsObject["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"] && requestParamsObject["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"]) {
					var newSpecification = {};
					clonedRequestParam["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"] = {};
					
					var packageBase = document.forms["formWarpRequest" + this.m_oCV.getId()].packageBase.value;
					
					for(modelItem in requestParamsObject["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"]) {
						if(modelItem.indexOf(packageBase) != -1) {
							newSpecification[dataItem] = requestParamsObject["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"][modelItem][dataItem];
							if (newSpecification[dataItem]) {
								clonedRequestParam["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"][modelItem] = newSpecification;
								break;
							}
						}
					}					
				}
				
				var itemCount = contextObject[dataItem] && key !== "ranges" ? contextObject[dataItem].length : 0;
				if (this.checkIfFilterExpressionChanged(dataItem, requestParamsObject.clientId, itemCount, existingSliderInfo)) {
					this.m_bForceRunSpec = true;
				}

				resultingProcessedRequestParamsValues.push(dojo.toJson(clonedRequestParam));
			}
		}
	} else {
		resultingProcessedRequestParamsValues.push(dojo.toJson(requestParamsObject));
	}
	
	return resultingProcessedRequestParamsValues;
};

/**
 * Returns true if this is a new filter or if the filterExpression in the reportSpec will
 * change because of this updateDataFilter action. It'll change if the slider/select value
 * was re-configured on a different data item or if we're going from one item to multiple items
 */
UpdateDataFilterAction.prototype.checkIfFilterExpressionChanged = function(dataItem, sliderId, itemCount, existingSliderInfo) {
	if (!existingSliderInfo || !existingSliderInfo[sliderId] || existingSliderInfo[sliderId].name != dataItem) {
		return true;
	}

	var existingItemCount = existingSliderInfo[sliderId].values ? existingSliderInfo[sliderId].values.length : 0;
	
	if (itemCount == existingItemCount) {
		return false;
	}
	
	// If we've gone from 1 value to multiple or from multiple to 1 then we need to do a runSpec
	return (itemCount === 1) !== (existingItemCount === 1);
};

UpdateDataFilterAction.prototype.addActionContext = function()
{	
	var actionContext = "<reportActions";
	var inlineValues = "";

	if(!this.runReport()) {
		actionContext += " run=\"false\"";
		inlineValues = "<inlineValues/>";
	}

	actionContext += ">";
	
	
	if( this.m_drillResetHUN  && this.m_drillResetHUN.length > 0 ) {
		actionContext += this._getDrillResetActionContext();
	}

	if(this.m_sForceCleanup) {
		actionContext += "<reportAction name=\"" + this.m_sAction + "\">" + dojo.toJson(this.m_sForceCleanup) + "</reportAction>";
	}
	
	var processedRequestParamValues;
	var isXMLFilterPayload = (this.m_requestParams.charAt(0)==="<"); 
	if ( this.m_isFacet || isXMLFilterPayload) {
		processedRequestParamValues = [ this.m_requestParams ];
	} else {
		processedRequestParamValues =  this.preProcessContextValues();	
	}
	
	for(var idx = 0; idx < processedRequestParamValues.length; ++idx) {
	
		var actionParams = processedRequestParamValues[idx];
		
		actionContext += "<reportAction name=\"" + this.m_sAction + "\">" + inlineValues;
	
		actionContext += (isXMLFilterPayload) ? actionParams : xml_encode(actionParams);
		
		if(idx > 0) {
			actionContext += "<augment>true</augment>";
		}		
	
		if (!this.m_isFacet) {
			actionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
		}
		
		actionContext += "</reportAction>";
		
		actionContext += "<reportAction name=\"GetInfo\"><include><sliders/></include>";
				
		actionContext += "</reportAction>";		
	}
	
	actionContext += "</reportActions>";

	return actionContext;
};

UpdateDataFilterAction.prototype._getDrillResetActionContext = function()
{
	var drillResetAction = new DrillResetAction();
	drillResetAction.setCognosViewer( this.getCognosViewer() );
	var params = { drilledResetHUNs : this.m_drillResetHUN };
	drillResetAction.setRequestParms( params );
	drillResetAction.setUpdateInfoBar( false );
	var drillResetActionContext = drillResetAction.getReportActionContext();
	return drillResetActionContext;
};
