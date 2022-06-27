/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2015
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
//
// This class represents the basic representation of a selection object.
//

/*
  Constructor.

  Parameters:

  Returns:
*/
function CSelectionObject()
{
	this.initialize();
}

CSelectionObject.prototype.initialize = function()
{
	this.m_oCellRef = {};
	this.m_sColumnRef = "";
	this.m_sColumnName = "";
	this.m_aDataItems = [];
	this.m_aUseValues = [];
	this.m_aDisplayValues = [];
	this.m_sCellTypeId = "";
	this.m_sLayoutType = "";
	this.m_sTag = "";
	this.m_aMuns = [];
	this.m_aRefQueries = [];
	this.m_aMetadataItems = [];
	this.m_aDrillOptions = [];
	this.m_selectionController = {};
	this.m_contextIds = [];
	this.m_ctxAttributeString = "";
	this.m_fetchedContextIds = false;
	this.m_selectedClass =  [];
	this.m_cutClass=[];
	this.m_dataContainerType = "";
	this.m_oJsonContext = null;
};

CSelectionObject.prototype.isSelectionOnVizChart = function() { return false; };

/*
  Parameters: none

  Returns: object reference to html <td> element
*/
CSelectionObject.prototype.getCellRef = function()
{
	return this.m_oCellRef;
};

/**
 * Get the original data item name (before renamed)
 * */
CSelectionObject.prototype.getColumnRP_Name = function()
{
	if(this.m_oCellRef != null){
		return this.m_oCellRef.getAttribute("rp_name");
	}
};

/*
  Parameters: none

  Returns: string
*/
CSelectionObject.prototype.getColumnRef = function()
{
	return this.m_sColumnRef;
};

/*
  Parameters: none

  Returns: string
*/
CSelectionObject.prototype.getColumnName = function()
{
	if (this.m_sColumnName == "")
	{
		if (this.m_selectionController.hasContextData() && this.m_contextIds.length)
		{
			this.m_sColumnName = this.m_selectionController.getRefDataItem(this.m_contextIds[0][0]);
		}
	}
	return this.m_sColumnName;
};

CSelectionObject.prototype.getDataItemDisplayValue = function(containerReportInfo) {
	var aDataItems = this.getDataItems();
	var item = "";
	if (aDataItems && aDataItems[0] && aDataItems[0][0]) {
		item = this.getDataItems()[0][0];
		if (containerReportInfo && containerReportInfo.itemInfo && containerReportInfo.itemInfo.length) {
			var itemInfo = containerReportInfo.itemInfo;
			for (var i=0; i < itemInfo.length; i++) {
				if (itemInfo[i].item === item && itemInfo[i].itemLabel) {
					return itemInfo[i].itemLabel;
				}
			}
		}
	}

	return item;
};

/*
  Parameters: none

  Returns: array of strings
*/
CSelectionObject.prototype.getDataItems = function()
{
	if (!this.m_aDataItems.length) {
		this.fetchContextIds();
		for (var i = 0; i < this.m_contextIds.length; ++i) {
			this.m_aDataItems[this.m_aDataItems.length] = [];
			for (var j = 0; j < this.m_contextIds[i].length; ++j) {
				var contextId = this.m_contextIds[i][j];
				this.m_aDataItems[this.m_aDataItems.length-1].push(this.m_selectionController.isContextId(contextId)? this.m_selectionController.getRefDataItem(contextId) : "");
			}
		}
	}
	return this.m_aDataItems;
};

/*
  Parameters: none

  Returns: array of strings
*/
CSelectionObject.prototype.getUseValues = function()
{
	if (!this.m_aUseValues.length) {
		this.fetchContextIds();
		for (var i = 0; i < this.m_contextIds.length; ++i) {
			this.m_aUseValues[this.m_aUseValues.length] = [];
			for (var j = 0; j < this.m_contextIds[i].length; ++j) {
				var contextId = this.m_contextIds[i][j];
				this.m_aUseValues[this.m_aUseValues.length-1].push(this.m_selectionController.isContextId(contextId) ? this.m_selectionController.getUseValue(contextId) : "");
			}
		}
	}
	return this.m_aUseValues;
};

/*
  Parameters: none

  Returns: string
*/
CSelectionObject.prototype.getCellTypeId = function()
{
	return this.m_sCellTypeId;
};

/*
  Parameters: none

  Returns: array of strings
*/
CSelectionObject.prototype.getDisplayValues = function()
{
	return this.m_aDisplayValues;
};

/*
  Parameters: none

  Returns: string
*/
CSelectionObject.prototype.getLayoutType = function()
{
	return this.m_sLayoutType;
};

/*
  Parameters: none

  Returns: string
*/
CSelectionObject.prototype.getTag = function()
{
	return this.m_sTag;
};

/*
  Parameters: none

  Returns: Array
*/
CSelectionObject.prototype.getMuns = function()
{
	if (!this.m_aMuns.length) {
		this.fetchContextIds();
		for (var i = 0; i < this.m_contextIds.length; ++i) {
			this.m_aMuns[this.m_aMuns.length] = [];
			for (var j = 0; j < this.m_contextIds[i].length; ++j) {
				var contextId = this.m_contextIds[i][j];
				this.m_aMuns[this.m_aMuns.length-1].push(this.m_selectionController.isContextId(contextId) ? this.m_selectionController.getMun(contextId) : "");
			}
		}
	}
	return this.m_aMuns;
};

/*
  Parameters: none

  Returns: Array
*/
CSelectionObject.prototype.getRefQueries = function()
{
	if (!this.m_aRefQueries.length) {
		this.fetchContextIds();
		for (var i = 0; i < this.m_contextIds.length; ++i) {
			this.m_aRefQueries[this.m_aRefQueries.length] = [];
			for (var j = 0; j < this.m_contextIds[i].length; ++j) {
				var contextId = this.m_contextIds[i][j];
				this.m_aRefQueries[this.m_aRefQueries.length-1].push(this.m_selectionController.isContextId(contextId) ? this.m_selectionController.getRefQuery(contextId) : "");
			}
		}
	}
	return this.m_aRefQueries;
};

CSelectionObject.prototype.getDimensionalItems = function(sType)
{
	var aItems = [];
	this.fetchContextIds();
	for (var i = 0; i < this.m_contextIds.length; ++i) {
		aItems[aItems.length] = [];
		for (var j = 0; j < this.m_contextIds[i].length; ++j) {
			var contextId = this.m_contextIds[i][j];

			var sItem = "";
			if(this.m_selectionController.isContextId(contextId))
			{
				switch(sType)
				{
					case "hun":
						sItem = this.m_selectionController.getHun(contextId);
						break;
					case "lun":
						sItem = this.m_selectionController.getLun(contextId);
						break;
					case "dun":
						sItem = this.m_selectionController.getDun(contextId);
						break;
				}
			}
			aItems[aItems.length-1].push(sItem);
		}
	}

	return aItems;
};

/*
  Parameters: none

  Returns: Array
*/
CSelectionObject.prototype.getMetadataItems = function()
{
	if (!this.m_aMetadataItems.length) {
		this.fetchContextIds();
		for (var i = 0; i < this.m_contextIds.length; ++i) {
			this.m_aMetadataItems[this.m_aMetadataItems.length] = [];
			for (var j = 0; j < this.m_contextIds[i].length; ++j) {
				var contextId = this.m_contextIds[i][j];
				var sMetaDataItem="";
				if(this.m_selectionController.isContextId(contextId))
				{
					var sLun = this.m_selectionController.getLun(contextId);
					var sHun = this.m_selectionController.getHun(contextId);

					if(sLun && sLun != "")
					{
						sMetaDataItem  = sLun;
					}
					else if(sHun && sHun != "")
					{
						sMetaDataItem  = sHun;
					}
					else
					{
						sMetaDataItem = this.m_selectionController.getQueryModelId(contextId);
					}

				}

				this.m_aMetadataItems[this.m_aMetadataItems.length-1].push(sMetaDataItem);
			}
		}
	}
	return this.m_aMetadataItems;
};

/*
  Parameters: none

  Returns: Array
*/
CSelectionObject.prototype.getDrillOptions = function()
{
	if (!this.m_aDrillOptions.length) {
		this.fetchContextIds();
		for (var i = 0; i < this.m_contextIds.length; ++i) {
			this.m_aDrillOptions[this.m_aDrillOptions.length] = [];
			for (var j = 0; j < this.m_contextIds[i].length; ++j) {
				var contextId = this.m_contextIds[i][j];
				this.m_aDrillOptions[this.m_aDrillOptions.length-1].push(this.m_selectionController.isContextId(contextId) ? this.m_selectionController.getDrillFlag(contextId) : 0);
			}
		}
	}
	return this.m_aDrillOptions;
};

/*
  Parameters: none

  Returns: array
*/
CSelectionObject.prototype.getSelectedContextIds = function()
{
	return this.m_contextIds;
};


CSelectionObject.prototype.fetchContextIds = function()
{
	if (!this.m_fetchedContextIds && this.m_contextIds.length && this.m_selectionController.hasContextData())
	{
		var fetchContextIds = [];
		for (var i = 0; i < this.m_contextIds.length; i++) {
			for (var j = 0; j < this.m_contextIds[i].length; j++) {
				fetchContextIds.push(this.m_contextIds[i][j]);
			}
		}
		this.m_selectionController.fetchContextData(fetchContextIds);
		this.m_fetchedContextIds = true;
	}
};

CSelectionObject.prototype.setSelectionController = function(sc) {
	if (sc) {
		this.m_selectionController = sc;
	}
};

CSelectionObject.prototype.getLayoutElementId = function() {
	return this.m_layoutElementId;
};

CSelectionObject.prototype.hasContextInformation = function() {
	for (var i=0; i < this.m_contextIds.length; i++)
	{
		for (var j=0; j < this.m_contextIds[i].length; j++)
		{
			if (this.m_contextIds[i][j].length > 0)
			{
				return true;
			}
		}
	}

	return false;
};

/**
 * Checks to see if the current selection is the home cell
 * @return true if the selection is on the home cell
 */
CSelectionObject.prototype.isHomeCell = function() {
	var className = this.getCellRef().className;
	if (className && (className == "xm" || className.indexOf("xm ") != -1 || className.indexOf(" xm") != -1)) {
		return true;
	}

	return false;
};


CSelectionObject.prototype.getDataContainerType = function() {
	return this.m_dataContainerType;
};

/*
 * Returns an object with name/value pairs of the context ids of this object
 *
 * Refer this file for structure: http://c3/teams/BUX/Public%20Documents/Caspian/Design%20Documents/GenericWidgetContextEvents.xls
 */
CSelectionObject.prototype.getContextJsonObject = function(oSelectionController, modelPath) {

	if (this.m_oJsonContext === null) {

		var nameValueObj = {};
		var aItemSpecValues = [];
		var selectedItemName  = null;

		this.getDataItems(); //Invoke to populate data-items. AS report might not have them yet.
		this.getUseValues(); //Invoke to populate use-values

		if (this.m_contextIds.length == 0) {
			return null;
		}

		var i=0, j=0;
		var itemName = this._getBestPossibleItemName(this.m_aDataItems[i][j], this.m_contextIds[i][j], oSelectionController);
		selectedItemName = itemName;

		this._populateJsonContextObj(itemName, this.m_aUseValues[i][j], oSelectionController.getDisplayValue(this.m_contextIds[i][j]), oSelectionController.getMun(this.m_contextIds[i][j]), nameValueObj, aItemSpecValues);
		j++;

		for ( ; i < this.m_aDataItems.length; i++, j=0) {
			for ( ; j < this.m_aDataItems[i].length; j++) {
				itemName = this._getBestPossibleItemName(this.m_aDataItems[i][j], this.m_contextIds[i][j], oSelectionController);
				// this is only necessary for area map since the first context id is empty string.
				if( !selectedItemName ){ selectedItemName = itemName; }

				this._populateJsonContextObj(itemName, this.m_aUseValues[i][j], oSelectionController.getDisplayValue(this.m_contextIds[i][j]), oSelectionController.getMun(this.m_contextIds[i][j]), nameValueObj, aItemSpecValues);
			}
		}

		this.m_oJsonContext = this._createGenericPayloadStructureJson(selectedItemName, nameValueObj, aItemSpecValues, modelPath);
	}

	return this.m_oJsonContext;
};

CSelectionObject.prototype._getBestPossibleItemName = function(itemName, ctxId, oSelectionController) {

	var bestItemName = null;
	if (oSelectionController.isMeasure(ctxId)) {

		if (! oSelectionController.isValidColumnTitle(this.m_oCellRef) ) {

			if (! oSelectionController.isRelational([ctxId] )) {
				//Dimensional Measure
				bestItemName = oSelectionController.getCCDManager().GetBestPossibleDimensionMeasureName(ctxId);
			}
			return (bestItemName) ? bestItemName : itemName;
		}
	}

	bestItemName = oSelectionController.getCCDManager().GetBestPossibleItemName(ctxId);
	return (bestItemName) ? bestItemName : itemName;
};

CSelectionObject.prototype._isTypeColumnTitle = function() {
	//Check for getAttribute function's presence for a slice of chart because m_oCellRef is an empty object
	if (this.m_oCellRef && typeof this.m_oCellRef.getAttribute == 'function') {
		return (this.m_oCellRef.getAttribute('type') ==='columnTitle');
	}

	return false;
};

/*
 * Populates a property with itemName in the passed obj and detailObj.
 *
 * If itemName is already present in the obj, do not overwrite.
 * Use displayValue if present over useValue
 *
 */
CSelectionObject.prototype._populateJsonContextObj = function(itemName, useValue, displayValue, mun, nameValueObj, aItemSpecValues) {

	if (nameValueObj && aItemSpecValues && itemName && typeof nameValueObj[itemName] == 'undefined') {

		var value = displayValue? displayValue: useValue;

		nameValueObj[itemName] = [value]; //should be array


		var detailObj = {};

		if (displayValue) {
			detailObj['caption'] = displayValue;
		}
		if (mun) {
			detailObj['mun'] = mun;
		}
		if (useValue) {
			detailObj['use'] = useValue;
		}

		aItemSpecValues.push(detailObj);
	}

};

CSelectionObject.prototype._createGenericPayloadStructureJson = function(selectedItemName, nameValueObject, aItemSpecValues, modelPath) {

	if (selectedItemName && nameValueObject && aItemSpecValues ) {

		var modelPathName = (modelPath)? modelPath : ".";

		var itemSpecObj = {};
		itemSpecObj[modelPathName] = {"values": aItemSpecValues};

		var obj = {
			"com.ibm.widget.context": {
				"values": nameValueObject
				},
			"com.ibm.widget.context.report.select": {
				"select": {
					"selectedItem": selectedItemName,
					"itemSpecification": itemSpecObj
					}
				}
		};

		return obj;
	}
	return null;
};

/*
 * For discrete data only, populate name/value pair and detail item spec into passed objects, 
 * 
 * @param nameValueObj - used in common part of generic payload
 * @param itemSpecObj - used in detail selection part of generic payload
 * 
 */
CSelectionObject.prototype.populateSelectionPayload = function(nameValueObj, itemSpecObj, bExcludeContext) {

	this.getDataItems(); //Invoke to populate data-items. AS report might not have them yet.
	this.getUseValues(); //Invoke to populate use-values

	if (this.m_contextIds.length == 0) {
		return false;
	}
	
	bExcludeContext = (( bExcludeContext === undefined ) ? false : bExcludeContext );

	var oSelectionController = this.m_selectionController;
	for (var i=0, j=0 ; i < this.m_aDataItems.length; i++, j=0) 
	{	
		var noOfDataItems  = ( bExcludeContext ? 1 : this.m_aDataItems[i].length );		
		for ( ; j < noOfDataItems; j++) {
			if (!oSelectionController.isMeasure(this.m_contextIds[i][j])) {
				var itemName = this.m_aDataItems[i][j];
				this._populateItemInSelectionPayload(itemName, this.m_aUseValues[i][j], oSelectionController.getDisplayValue(this.m_contextIds[i][j]), oSelectionController.getMun(this.m_contextIds[i][j]), nameValueObj, itemSpecObj);
			}
		}
	}

	return true;
};

/*
 * Populates discrete data of it into two objects, one used in common part of generic payload, 
 * and another used in detail selection part of generic payload
 * 
 * @param nameValueObj - used in common part of generic payload
 * @param itemSpecObj - used in detail selection part of generic payload
 * 
 */
CSelectionObject.prototype._populateItemInSelectionPayload = function(itemName, useValue, displayValue, mun, nameValueObj, itemSpecObj) {

	if (nameValueObj && itemName ) {

		var value = useValue? useValue : displayValue;
		if(nameValueObj[itemName]) {
			nameValueObj[itemName].push(value);
		} else {
			nameValueObj[itemName] = [value]; //should be array
		}

		var detailObj = {};
		
		detailObj['caption'] = value;
		if (mun) {
			detailObj['mun'] = mun;
		}
		
		var itemSpecValuesObj = itemSpecObj[itemName];
		if (!itemSpecValuesObj) {
			itemSpecValuesObj = {'values': []};
			itemSpecObj[itemName] = itemSpecValuesObj;
		}
		itemSpecValuesObj.values.push(detailObj);
	}
};

CSelectionObject.prototype.getCtxAttributeString = function() {
	return this.m_ctxAttributeString;
};

CSelectionObject.prototype.isDataValueOrChartElement = function(){
	return (this.m_sLayoutType === 'datavalue' || this.m_sLayoutType === 'chartElement' )
};

/*
 * Creates a JSON object with enough details so that could be re-maped to new set of cd and md if all attributes exists in new set
 */
CSelectionObject.prototype.marshal = function(oSelectionController, sCVid) {

	if (!this.m_oJsonForMarshal) {

		var nameValueObj = {};
		var aItemSpecValues = [];
		var selectedItemName  = null;

		this.getDataItems(); //Invoke to populate data-items. AS report might not have them yet.
		this.getUseValues(); //Invoke to populate use-values

		if (this.m_contextIds.length == 0) {
			return null;
		}

		var i=0, j=0;
		
		//ctx attribute could be [[""], ["22"], [""]] 
		//make sure i,j are starting with not-empty
		if (this.m_contextIds[i][j].length == 0) {
			var foundValue = false;
			do  {
				for ( ; j < this.m_contextIds[i].length; j++) {
					if (this.m_contextIds[i][j].length > 0 ) {
						foundValue = true; 
						break;
					}
				}
				if (!foundValue) {
					j=0;
					i++;
				}
			} while (!foundValue)
		}
		
		
		var itemName = this._getBestPossibleItemName(this.m_aDataItems[i][j], this.m_contextIds[i][j], oSelectionController);
		var isMeasure = oSelectionController.isMeasure(this.m_contextIds[i][j]);
		var itemRef = this._getBestPossibleItemReference(this.m_contextIds[i][j], isMeasure, oSelectionController.getCCDManager());
		var queryName = oSelectionController.getCCDManager().GetQuery(this.m_contextIds[i][j]);
		var isDataValueOrChartElement = this.isDataValueOrChartElement();
		
		var oSelectedItem = this._populateJsonForMarshal(itemName, itemRef, isMeasure, this.m_aUseValues[i][j], oSelectionController.getDisplayValue(this.m_contextIds[i][j]), oSelectionController.getMun(this.m_contextIds[i][j]), isDataValueOrChartElement );
		j++;

		var aContext = [];
		for ( ; i < this.m_aDataItems.length; i++, j=0) {
			for ( ; j < this.m_aDataItems[i].length; j++) {
				itemName = this._getBestPossibleItemName(this.m_aDataItems[i][j], this.m_contextIds[i][j], oSelectionController);
				isMeasure = oSelectionController.isMeasure(this.m_contextIds[i][j]);
				itemRef = this._getBestPossibleItemReference(this.m_contextIds[i][j], isMeasure, oSelectionController.getCCDManager());
				
				var oContext = this._populateJsonForMarshal(itemName, itemRef, isMeasure, this.m_aUseValues[i][j], oSelectionController.getDisplayValue(this.m_contextIds[i][j]), oSelectionController.getMun(this.m_contextIds[i][j]));
				if (oContext) {
					aContext.push(oContext);
				} 
			}
		}

		var lid = (typeof this.getArea == 'function') ? getImmediateLayoutContainerId(this.getArea()) : getImmediateLayoutContainerId(this.getCellRef());
		if (lid && lid.indexOf(sCVid)>0) {
			lid = lid.substring(0, lid.indexOf(sCVid)-1); //remove CV id
		} 
		this.m_oJsonForMarshal = {
			'lid': lid, //Do not use this - this.getLayoutElementId(),
			'query': queryName,
			'selectedItem': oSelectedItem,
			'context': aContext 
		};
	}
	
	return this.m_oJsonForMarshal;
};

CSelectionObject.prototype._populateJsonForMarshal = function(itemName, itemRefObj, isMeasure, useValue, displayValue, mun, isDataValueOrChartElement) {

	if (itemName) {
		var detailObj = {};
		
		detailObj['itemName'] = itemName;
		detailObj['isMeasure'] = isMeasure? 'true' : 'false'; //use string so that can be saved in itemset
		detailObj['mdProperty'] = itemRefObj.mdProperty;
		detailObj['mdValue'] = itemRefObj.mdValue;
		detailObj['isDataValueOrChartElement'] =  isDataValueOrChartElement ? 'true' : 'false'

		/*if (displayValue) {
			detailObj['caption'] = displayValue;
		}*/
		if (mun) {
			detailObj['mun'] = mun;
		}
		if (useValue) {
			detailObj['use'] = useValue;
		}
		return detailObj;
	}
	return null;
};

CSelectionObject.prototype._getBestPossibleItemReference = function(ctxId, isMeasure, oCCDManager) {

	var bestItemRef = null;
	var property = null;
	if (isMeasure) {
		//Search in order of ["i", "m", "r"]
		
		property = "i";
		bestItemRef = oCCDManager.GetQMID(ctxId); /* i value */		
		if(bestItemRef == null) {
			property = "m";
			bestItemRef = oCCDManager.GetMUN(ctxId); /* m value */
		}
		if(bestItemRef == null) {
			property = "r";
			bestItemRef = oCCDManager.GetRDIValue(ctxId); /* r value */
		}
	} else {
		//Search in order of ["l", "h", "i", "r"]
		
		property = "l";
		bestItemRef = oCCDManager.GetLUN(ctxId); /* l value */
		if(bestItemRef == null) {
			property = "h";
			bestItemRef = oCCDManager.GetHUN(ctxId); /* h value */
		}
		if(bestItemRef == null) {
			property = "i";
			bestItemRef = oCCDManager.GetQMID(ctxId); /* i value */
		}
		if(bestItemRef == null) {
			property = "r";
			bestItemRef = oCCDManager.GetRDIValue(ctxId); /* r value */
		}
	}
	
	return {'mdProperty': property, 'mdValue': bestItemRef};
};


//
// This class represents the basic representation of a chart selection object.
//

/*
  Constructor.

  Parameters:

  Returns:
*/


// set up the base class
CSelectionChartObject.prototype = new CSelectionObject();
CSelectionChartObject.prototype.constructor = CSelectionChartObject;
CSelectionChartObject.baseclass = CSelectionObject.prototype;

function CSelectionChartObject()
{
	// initialize the base class
	CSelectionChartObject.baseclass.initialize.call(this);
	this.m_chartArea = null;
	this.m_context = "";
	this.m_chartCtxAreas = [];
	this.m_selectedVizChart = false;
}

CSelectionChartObject.prototype.isSelectionOnVizChart = function() {
	return this.m_selectedVizChart;
};

CSelectionChartObject.prototype.setSelectionOnVizChart = function(chartNode) {
	var imageNode = this.m_selectionController.getSelectedChartImageFromChartArea(chartNode);
	if (imageNode) {
		this.m_selectedVizChart = imageNode.parentNode.getAttribute("vizchart") == "true" ? true : false;
	}
};

CSelectionChartObject.prototype.getArea = function()
{
	return this.m_chartArea;
};

CSelectionChartObject.prototype.getContext = function()
{
	return this.m_context;
};

CSelectionChartObject.prototype.getCtxAreas = function()
{
	return this.m_chartCtxAreas;
};

CSelectionChartObject.prototype.setCtxAreas = function(ctxAreas)
{
	this.m_chartCtxAreas = ctxAreas;
};

CSelectionChartObject.prototype.getCtxAttributeString = function() {
	return this.m_context;
};

/**
 * This class contains the objects that help with chart selection
 * @param chartArea
 * @param cognosViewer
 * @returns {CChartHelper}
 */
function CChartHelper(chartArea, selectionObjectFactory, cognosViewer){
	var imageMap = chartArea.parentNode;
	this.m_selectionObjectFactory = selectionObjectFactory;
	this.m_map = imageMap;
	cognosViewer.loadExtra();
	this.imageMapHighlighter = new CImageMapHighlight(imageMap, cognosViewer.sWebContentRoot);
	this.initialize();
}

CChartHelper.prototype.initialize = function() {
	this.buildMapCtxAreas();
	this.m_chartCtxNodes = {};
};

/**
 * Scan the map and build and object with all unique context as properties names, and an array of the
 * areas with that context as value
 */
CChartHelper.prototype.buildMapCtxAreas = function() {
	var ctxAreas = {};
	var areas = this.m_map.childNodes;
	var areaCount = areas.length;
	var areaCtx = null;
	for (var i=0; i<areaCount; i++ ) {
		var a = areas[i];
		areaCtx = a.getAttribute("ctx");
		if (areaCtx) {
			if (ctxAreas[areaCtx]) {
				ctxAreas[areaCtx].push(a);
			} else {
				ctxAreas[areaCtx] = [a];
			}
		}
	}
	this.m_ctxAreas = ctxAreas;
};

CChartHelper.prototype.getChartNode = function(chartArea)
{
	if (!this.isAreaInitialized(chartArea)) {
		var imageMap = chartArea.parentNode;
		this.m_map = imageMap;
		this.initialize();
		this.imageMapHighlighter.initialize(imageMap);
	}
	var areaCtx = chartArea.getAttribute("ctx");
	if (!this.m_chartCtxNodes[areaCtx]) {
		this.m_chartCtxNodes[areaCtx] = this.m_selectionObjectFactory.getSelectionChartObject(chartArea);
		this.m_chartCtxNodes[areaCtx].setCtxAreas(this.m_ctxAreas[areaCtx]);
	}
	return this.m_chartCtxNodes[areaCtx];
};

CChartHelper.prototype.isAreaInitialized = function(chartArea) {
	return this.imageMapHighlighter.isAreaInitialized(chartArea);
};

CChartHelper.prototype.getImageMapHighlighter = function() {
	return this.imageMapHighlighter;
};

//
// This class creates a factory for selection objects.
//

/*
  Constructor.

  Parameters:

  Returns: selection object factory
*/
function CSelectionObjectFactory(selectionController)
{
	this.m_selectionController = selectionController;
}

CSelectionObjectFactory.prototype.getSelectionController = function()
{
	return this.m_selectionController;
};

/*
 *	Retrieves span tags from inside the target tag, but excluding any
 *	inside a different layout element id.
 *	Parameters: target, an HTML Element
 *	Returns:	an array of span HTML Elements
 */
CSelectionObjectFactory.prototype.getChildSpans = function(target) {
	var toVisit = [];
	for(var i = 0; i < target.childNodes.length; i++) {
		var child = target.childNodes[i];
		if (!child.getAttribute || child.getAttribute("skipSelection") != "true") {
			toVisit.push(target.childNodes[i]);
		}
	}

	//Find the layout element id associated with target
	var targetParent = target;
	var targetLid = "";

	while(!targetLid && targetParent) {
		targetLid = targetParent.attributes ? targetParent.attributes["LID"] : "";
		targetParent = targetParent.parentNode;
	}
	targetLid = targetLid ? targetLid.value : "";

	//Get children
	var allChildren = [];
	while(toVisit.length > 0) {
		var child = toVisit.pop();
		var lid = child.attributes ? child.attributes["LID"] : "";
		lid = lid ? lid.value : "";
		//Omit children under a different layout element id
		if(!lid || lid == targetLid) {
			//Record all span tags
			if(child.nodeName.toLowerCase() == "span") {
				allChildren.push(child);
			}
			else {
				for(i = 0; i < child.childNodes.length; i++) {
					toVisit.push(child.childNodes[i]);
				}
			}
		}
	}
	return allChildren;
};

/*
  Parameters:
  cellRef - an HTML reference to a <td> element

  Returns: selection object
*/

CSelectionObjectFactory.prototype.getSelectionObject = function(cellRef, matchOnCTX) {
	var newSelObj = new CSelectionObject();
try{
	newSelObj.setSelectionController(this.getSelectionController());
	newSelObj.m_oCellRef = cellRef;
	newSelObj.m_sColumnRef = cellRef.getAttribute("cid");
	newSelObj.m_sCellTypeId = cellRef.getAttribute("uid");
	newSelObj.m_sLayoutType = cellRef.getAttribute("type");
	newSelObj.m_sTag = cellRef.getAttribute("tag");
	newSelObj.m_layoutElementId = this.getLayoutElementId(cellRef);
	newSelObj.m_dataContainerType = this.getContainerType(cellRef);

	//Query Studio specific code
	if (typeof cf != "undefined")
	{
		var miniQueryObj = cf.cfgGet("MiniQueryObj");
		if(miniQueryObj)
		{
			var tagElement = miniQueryObj.findChildWithAttribute("tag", newSelObj.m_sTag);
			if(tagElement && tagElement.getAttribute("id") != null)
			{
				newSelObj.m_sColumnName = tagElement.getAttribute("id");
			}
		}
	}

	//get all of the child textItem nodes which are not of a different layout id
	var allChildren = this.getChildSpans(cellRef);
	if (allChildren.length > 0)
	{
		for (var i = 0; i < allChildren.length; i++)
		{
			var oChild = allChildren[i];
			if (oChild.nodeType == 1 && oChild.nodeName.toLowerCase() == "span" && oChild.style.visibility != "hidden")
			{
				var contextNode = null;
				if (cellRef.getAttribute("ctx") != null && cellRef.getAttribute("ctx") != "") {
					contextNode = cellRef;
				}
				else if(oChild.getAttribute("ctx") != null && oChild.getAttribute("ctx") != "") {
					contextNode = oChild;
				}
				else if(oChild.getAttribute("dtTargets") && oChild.childNodes && oChild.childNodes.length) {
					for (var idxCN = 0; idxCN < oChild.childNodes.length; idxCN++)
					{
						if (oChild.childNodes[idxCN].nodeType == 1 && oChild.childNodes[idxCN].style.visibility != "hidden") {
							contextNode = oChild.childNodes[idxCN];
						}
					}
				} else {
					// for saved outputs with authored drill through we'll have a span within a span. The CTX attribute
					// will be on the inner span so go find it.
					for (var childIndex = 0; childIndex < oChild.childNodes.length; childIndex++) {
						var nestedChild = oChild.childNodes[childIndex];
						if(typeof nestedChild.getAttribute != "undefined" && nestedChild.getAttribute("ctx") != null && nestedChild.getAttribute("ctx") != "") {
							contextNode = nestedChild;
							break;
						}
					}
				}

				var context = "";
				if(contextNode && contextNode.getAttribute("ctx"))
				{
					 context = contextNode.getAttribute("ctx");
				}

				newSelObj.m_aDisplayValues[newSelObj.m_aDisplayValues.length] = this.getSelectionController().getDisplayValue(context, cellRef.parentNode);

				// Check to see if we're explicity matching on a ctx id. If we are and we don't match, move on to the next node
				if(typeof matchOnCTX != "undefined" && matchOnCTX != context) {
					continue;
				}

				newSelObj = this.processCTX(newSelObj, context);
			}
		}
	}
	else if(cellRef.getAttribute("ctx") != null && cellRef.getAttribute("ctx") != "" && newSelObj.m_sLayoutType == "datavalue")
	{
		newSelObj = this.processCTX(newSelObj, cellRef.getAttribute("ctx"));
	}

	this.getSelectionController().processColumnTitleNode(newSelObj);
}catch(ex) {
	// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
}

	return newSelObj;
};

/*
  Parameters:
  selObj - a CSelectionObject object
  context - the ctx attribute from the span or td

  Returns: selection object
*/
CSelectionObjectFactory.prototype.processCTX = function(selObj, context)
{
	if (typeof context != "string" || context.length == 0)
	{
		return selObj;
	}
	var ctx;

	// A:B::C:D::E   becomes   [[A,B],[C,D],[E]]
	if (typeof selObj.m_contextIds == "object" && selObj.m_contextIds !== null && selObj.m_contextIds.length > 0)
	{
		var tempContextIds = context.split("::");
		for(ctx = 0; ctx < selObj.m_contextIds.length; ++ctx)
		{
			try
			{
				if (tempContextIds[ctx])
				{
					selObj.m_contextIds[ctx] = selObj.m_contextIds[ctx].concat(tempContextIds[ctx].split(":"));
				}
			}
			catch (e)
			{
			}
		}
	}
	else
	{
		selObj.m_contextIds = this.m_selectionController.m_oCognosViewer.getReportContextHelper().processCtx(context);
	}

	selObj.m_ctxAttributeString = context;
	return selObj;
};

/*
  Parameters:
  tag - a reference to the column

  Returns: selection object
*/
CSelectionObjectFactory.prototype.getSecondarySelectionObject = function(tag, layoutType, theDocument)
{
	if (!theDocument) {
		theDocument = document;
	}
	var newSelObj = new CSelectionObject();
	newSelObj.setSelectionController(this.getSelectionController());

	// Non-default initialization
	newSelObj.m_oCellRef = null;
	newSelObj.m_sColumnRef = null;
	newSelObj.m_sCellTypeId = null;
	newSelObj.refQuery = "";

	var allTds = theDocument.getElementsByTagName("td");

	// Figure out from the secondary selection what needs to be selected
	for (var i = 0; i < allTds.length; i++)
	{
		var colTag = allTds[i].getAttribute("tag");
		if (colTag != null && colTag != "")
		{
			if (tag == colTag)
			{
				var colClass = allTds[i].className;
				if (colClass != null && colTag != "")
				{
					if ((layoutType == "columnTitle" && colClass == "lt") || (layoutType == "datavalue" && colClass == "lc"))
					{
						newSelObj.m_sColumnRef = allTds[i].getAttribute("cid");
						newSelObj.m_sCellTypeId  = allTds[i].getAttribute("uid");
						break;
					}
				}
			}
		}
	}

	if (newSelObj.m_sCellTypeId == null) {
		return null;
	}
	return newSelObj;
};

CSelectionObjectFactory.prototype.getSelectionChartObject = function(chartNode)
{
	var contextIds = "";
	if(chartNode.getAttribute("flashChart") != null)
	{
		if(typeof chartNode.getCtx != "undefined")
		{
			try
			{
				contextIds = chartNode.getCtx();
			}
			catch(e)
			{
				contextIds ="";
			}

		}
	}
	else
	{
		contextIds = chartNode.getAttribute("ctx");
	}

	var newSelObj = new CSelectionChartObject();
	newSelObj.setSelectionController(this.getSelectionController());

	if(contextIds != null)
	{
		newSelObj.m_contextIds = contextIds.split("::");

		for(var ctx = 0; ctx < newSelObj.m_contextIds.length; ++ctx)
		{
			newSelObj.m_contextIds[ctx] = newSelObj.m_contextIds[ctx].split(":");
		}
	}

	newSelObj.m_layoutElementId = this.getLayoutElementId(chartNode);
	newSelObj.m_sLayoutType = chartNode.getAttribute("type");
	newSelObj.m_chartArea = chartNode;
	newSelObj.m_context = contextIds;
	newSelObj.setSelectionOnVizChart(chartNode);


	return newSelObj;
};

CSelectionObjectFactory.prototype.getContainerTypeFromClass = function(className)
{
	var containerType = "";
	switch(className)
	{
		case "ls":
			containerType = "list";
			break;
		case "xt":
			containerType = "crosstab";
			break;
		case "rt":
			containerType = "repeaterTable";
			break;
	}

	return containerType;
};

//get the container type
CSelectionObjectFactory.prototype.getContainerType = function(el) {

	var type = "";
	if (el) {
		if (el.className) {
			type = this.getContainerTypeFromClass(el.className);
		}
		if (!type) {
			var parentNode = el.parentNode;
			if (parentNode) {
				type = this.getContainerType(parentNode);
			}
		}
	}
	return type;
};


//get the unique ID for the layout object.
CSelectionObjectFactory.prototype.getLayoutElementId = function(el) {
	var id = "";
	var viewerId = this.getSelectionController().getNamespace();
	if (el) {
		if (el.getAttribute && el.getAttribute("chartcontainer") == "true") {
			for (var childIndex=0; childIndex < el.childNodes.length; childIndex++) {
				var childNode = el.childNodes[childIndex];
				if (childNode.nodeName.toLowerCase() == "img" && childNode.getAttribute("lid") != null) {
					return childNode.getAttribute("lid");
				}
			}
		}

		id = (el.getAttribute && el.getAttribute("LID")) || "";
		if (!id) {
			var parentNode = el.parentNode;
			if (parentNode) {
				id = this.getLayoutElementId(parentNode);
			}
		} else if(el.tagName.toUpperCase() == "MAP") {
			// temporary until we get rsvp to update v5ReportEngine.xsl
			id = id.replace(viewerId, "");
			id = viewerId + id;
			// end of temp code
			var imageMapName = "#" + id;
			var imgNodes = getElementsByAttribute(el.parentNode, "IMG", "usemap", imageMapName);
			if (imgNodes.length > 0)
			{
				id = imgNodes[0].getAttribute("LID");
			}
		}
	}
	return  id;
};

//
// This class creates a controller for all of the selection objects.
//

/*
  Constructor.

  Parameters:

  Returns: selection controller
*/
function CSelectionController(sNamespace, oCognosViewer)
{
	this.m_bSelectionBasedFeaturesEnabled = false;
	this.m_bDrillUpDownEnabled = false;
	this.m_bModelDrillThroughEnabled = false;
	this.m_oCognosViewer = null;
	this.m_bSavedSelections = false;
	if (oCognosViewer) {
		this.m_oCognosViewer = oCognosViewer;
	}

	this.initialize(sNamespace);

	this.FILTER_SELECTION_STYLE = 0;
	this.FILTER_SELECTION_CONTEXT_MENU_STYLE = 1;
}

CSelectionController.prototype.initialize = function(sNamespace)
{
	this.m_sNamespace = sNamespace;
	this.m_aCutColumns = [];
	this.m_aSelectedObjects = [];
	this.m_selectedClass = [];
	this.m_cutClass = [];
	this.m_oObserver = new CObserver(this);

	this.m_bSelectionArraysSetup = false;
	this.m_aSelectionHoverNodes = [];

	//deprecated
	this.m_bUsingCCDManager = false;	//This bool can go when we switch to JSON format exclusively
	this.m_aReportMetadataArray = [];
	this.m_aReportContextDataArray = [];

	//JSON
	this.m_oCDManager = new CCDManager();

	this.m_oSelectionObjectFactory = new CSelectionObjectFactory(this);

	this.m_selectedChartArea = null;
	this.m_selectedChartNodes = [];

	this.m_selectionContainerMap = null;
	this.m_chartHelpers = {};

	if(this.m_oCognosViewer != null)
	{
		this.m_oCDManager.SetCognosViewer(this.m_oCognosViewer);
	}

	this.m_maxSecondarySelection = -1;

	this.c_usageMeasure = '2';
	this.m_ccl_dateTypes = { 59:'dateTime', 60:'interval' };
	
	this.m_selectionStyles = new CSelectionDefaultStyles( this );
	this.m_originalSelectionStyles = this.m_selectionStyles;
	this.m_bAllowHorizontalDataValueSelection = false;
	
};

CSelectionController.prototype.secondarySelectionIsDisabled = function(){
	return this.m_selectionStyles.secondarySelectionIsDisabled();
};


CSelectionController.prototype.getPrimarySelectionColor = function(){
	return this.m_selectionStyles.getPrimarySelectionColor();
};


CSelectionController.prototype.getHighContrastBorderStyle = function(){
	return this.m_selectionStyles.getHighContrastBorderStyle();
};


CSelectionController.prototype.getSecondarySelectionColor = function(){
	return this.m_selectionStyles.getSecondarySelectionColor();
};

CSelectionController.prototype.resetSelectionStyles = function(){
	this.setSelectionStyles();
};

CSelectionController.prototype.setSelectionStyles = function( styleType ){

	switch( styleType ) 
	{	
		//case "filter":
	case this.FILTER_SELECTION_STYLE:
		{
			if( !this.m_selectionFilterStyles ){
				this.m_selectionFilterStyles = new CSelectionFilterStyles( this );
			}
			
			this.m_selectionStyles = this.m_selectionFilterStyles;	
			break;
		}
		
		//case "filterContextMenu":
	case this.FILTER_SELECTION_CONTEXT_MENU_STYLE:
		{
			if( !this.m_selectionFilterContextMenuStyles ){
				this.m_selectionFilterContextMenuStyles = new CSelectionFilterContextMenuStyles( this );
			}
			
			this.m_selectionStyles = this.m_selectionFilterContextMenuStyles;	
			break;
		}
		
	default:
		this.m_selectionStyles = this.m_originalSelectionStyles;
	}

};

CSelectionController.prototype.resetAllowHorizontalDataValueSelection = function()
{
	this.m_bAllowHorizontalDataValueSelection = false;
};

CSelectionController.prototype.setAllowHorizontalDataValueSelection = function( bAllow)
{
	this.m_bAllowHorizontalDataValueSelection = bAllow;
};

CSelectionController.prototype.allowHorizontalDataValueSelection = function()
{
	return this.m_bAllowHorizontalDataValueSelection;
};

/**
 * Resets the selection, note this function will NOT update the UI, it
 * simply resets the internal selection array.
 */
CSelectionController.prototype.clearSelectionData = function()
{
	this.m_aSelectedObjects = [];
	this.m_selectedChartNodes = [];
	this.m_oSelectedDrillThroughImage = null;
	this.m_oSelectedDrillThroughSingleton = null;
};

CSelectionController.prototype.getCCDManager = function()
{
	return this.m_oCDManager;
};

CSelectionController.prototype.getCtxIdFromDisplayValue = function(sDisplayValue)
{
	if (!this.m_bUsingCCDManager) {
		var contextDataArray = this.getReportContextDataArray();
		var CD_DISPLAY_VALUE_IDX = 1;
		for (var sCtxId in contextDataArray)
		{
			var contextItem = contextDataArray[sCtxId];
			if(contextItem[CD_DISPLAY_VALUE_IDX] == sDisplayValue) {
				return sCtxId;
			}
		}

		return "";
	} else {
		var sId = this.m_oCDManager.GetContextIdForDisplayValue(sDisplayValue);
		return (sId == null) ? "" : sId;
	}
};

CSelectionController.prototype.getCtxIdFromMetaData = function(sLun, sHun, bIgnoreDrillFlag)
{
	return this.m_oCDManager.getContextIdForMetaData(sLun, sHun, bIgnoreDrillFlag);
};

/**
*replace the namespace substring if the passed in LUN or HUN are from a different namespace (but
*the shared TM1 dimension) compared with the metadata held by data manager instance
**/
CSelectionController.prototype.replaceNamespaceForSharedTM1DimensionOnly = function(lun, hun, mun)
{
	var sLun = lun;
	var sHun = hun;

	if(mun && mun.indexOf("->:[TM].") > 0){
		sLun = 	this.m_oCDManager._replaceNamespaceForSharedTM1DimensionOnly(lun);
		sHun = 	this.m_oCDManager._replaceNamespaceForSharedTM1DimensionOnly(hun);
	}

	return { "lun" : sLun, "hun" :sHun};
};

CSelectionController.prototype.getCtxIdFromMun = function(sMun)
{
	if (!this.m_bUsingCCDManager) {
		var metaDataArray = this.getReportMetadataArray();
		var MD_USE_VALUE_IDX = 0;
		for(var sKey in metaDataArray)
		{
			var metaDataItem = metaDataArray[sKey];
			if(metaDataItem[MD_USE_VALUE_IDX] == sMun)
			{
				var CD_METADATA_KEY_IDX = 2;
				var contextDataArray = this.getReportContextDataArray();
				for(var sCtxId in contextDataArray)
				{
					var contextItem = contextDataArray[sCtxId];
					if(contextItem[CD_METADATA_KEY_IDX] == sKey) {
						return sCtxId;
					}
				}
			}
		}

		return "";
	} else {
		var sId = this.m_oCDManager.GetContextIdForMUN(sMun);
		return (sId == null) ? "" : sId;
	}
};

CSelectionController.prototype.canDrillDown = function(sCtxId)
{
	var drillFlag = this.getDrillFlagForMember(sCtxId);
	return (drillFlag == 3 || drillFlag == 2);
};

CSelectionController.prototype.canDrillUp = function(sCtxId)
{
	var drillFlag = this.getDrillFlagForMember(sCtxId);
	return (drillFlag == 3 || drillFlag == 1);
};


CSelectionController.prototype.getQueryModelId = function(sCtxId)
{
	var qmid = "";
	if (!this.m_bUsingCCDManager) {
		var contextObj = this.m_aReportContextDataArray[sCtxId];
		if(contextObj && typeof contextObj[3] != "undefined"){
			var queryModelItemRefId = contextObj[3];
			var contextQueryModelItem = this.m_aReportMetadataArray[queryModelItemRefId];
			if(typeof contextQueryModelItem != "undefined" && typeof contextQueryModelItem[1] != "undefined" && contextQueryModelItem[1] == "I")
			{
				qmid = contextQueryModelItem[0];
			}
		}

	} else {
		qmid = this.m_oCDManager.GetQMID(sCtxId);
	}
	return qmid;
};

CSelectionController.prototype.getRefQuery = function(sCtxId)
{
	if (!this.m_bUsingCCDManager) {
		return this.getMetaDataItemUseValue(4/*ref query item reference*/, sCtxId);
	} else {
		var sRefQuery = this.m_oCDManager.GetQuery(sCtxId);
		return (sRefQuery == null) ? "" : sRefQuery;
	}
};

/**
	@deprecated Use CCognosViewer.getReportContextHelper().getRefDataItem() instead
 */
CSelectionController.prototype.getRefDataItem = function(sCtxId)
{
	return this.m_oCognosViewer.getReportContextHelper().getRefDataItem(sCtxId);
};


/**
	@deprecated Use CCognosViewer.getReportContextHelper().getMun() instead
*/
CSelectionController.prototype.getMun = function(sCtxId)
{
	return this.m_oCognosViewer.getReportContextHelper().getMun(sCtxId);
};

CSelectionController.prototype.getHun = function(sCtxId)
{
	if (!this.m_bUsingCCDManager) {
		var sHun = null;
		var aData = this.getRDI(sCtxId);

		if (aData && aData.length > 4 && aData[1] == "R") {
			var sRefDataItem = aData[4];
			var aReportMetadataArray = this.getReportMetadataArray();
			aData = aReportMetadataArray[sRefDataItem];
		}

		if (aData && aData.length > 1 && aData[1] == "H")
		{
			sHun = aData[0];
		}

		return sHun;
	} else {
		return this.m_oCDManager.GetHUN(sCtxId);
	}
};

CSelectionController.prototype.fetchContextData = function(fetchContextIds, callback)
{
	var numberOfItemsWithNoContext = 0;

	if (this.m_bUsingCCDManager) {
		numberOfItemsWithNoContext = this.m_oCDManager.FetchContextData(fetchContextIds, callback);
	}

	return numberOfItemsWithNoContext;

};

//////////////////
// These can go once we have moved to JSON objects
CSelectionController.prototype.getMetaDataItem = function(sKey)
{
	var metaDataArray = this.getReportMetadataArray();
	if(typeof metaDataArray[sKey] != "undefined")
	{
		return metaDataArray[sKey];
	}

	return null;
};

CSelectionController.prototype.getContextDataItem = function(sCtxId)
{
	var contextDataArray = this.getReportContextDataArray();
	if(typeof contextDataArray[sCtxId] != "undefined")
	{
		return contextDataArray[sCtxId];
	}

	return null;
};

CSelectionController.prototype.getMetaDataItemUseValue = function(iKeyIndex, sCtxId)
{
	/**
	 * 0 == ref data item
	 * 2 == mun
	 * 3 == level or qmid
	 * 4 == query
	 */
	var contextItem = this.getContextDataItem(sCtxId);
	if(contextItem != null)
	{
		var metaDataQueryKey = contextItem[iKeyIndex];
		if(metaDataQueryKey != "")
		{
			var metaDataItem = this.getMetaDataItem(metaDataQueryKey);
			if(metaDataItem != null)
			{
				return metaDataItem[0/*use value index*/];
			}
		}
	}

	return "";
};

CSelectionController.prototype.getRDI = function(sCtxId) {
	var contextItem = this.getContextDataItem(sCtxId);
	if(contextItem != null)
	{
		var metaDataQueryKey = contextItem[0];
		if(metaDataQueryKey != "")
		{
			var metaDataItem = this.getMetaDataItem(metaDataQueryKey);
			if(metaDataItem != null)
			{
				return metaDataItem;
			}
		}
	}
};




/////////////////////

CSelectionController.prototype.getNamespace = function()
{
	return this.m_sNamespace;
};

CSelectionController.prototype.setSelectionBasedFeaturesEnabled = function(bValue)
{
	this.m_bSelectionBasedFeaturesEnabled = bValue;
};

CSelectionController.prototype.getSelectionBasedFeaturesEnabled = function()
{
	return this.m_bSelectionBasedFeaturesEnabled;
};

CSelectionController.prototype.setDrillUpDownEnabled = function(bValue)
{
	this.m_bDrillUpDownEnabled = bValue;
};

CSelectionController.prototype.getDrillUpDownEnabled = function()
{
	return this.m_bDrillUpDownEnabled;
};

CSelectionController.prototype.setModelDrillThroughEnabled = function(bValue)
{
	this.m_bModelDrillThroughEnabled = bValue;
};

CSelectionController.prototype.getBookletItemForCurrentSelection = function() {
	var selectedObjects = this.getAllSelectedObjects();
	
	if (selectedObjects && selectedObjects.length > 0) {
		var selectedObject = selectedObjects[0];
		if (selectedObject.hasContextInformation()) {
			var bookletItem = this.m_oCDManager.GetBIValue(selectedObject.m_contextIds[0][0]);
			if (!bookletItem) {
				return null;
			}
			
			return bookletItem;
		}
	}
	
	return null;
};

CSelectionController.prototype.getModelPathForCurrentSelection = function() {
	var modelPath = null;
	var bookletItem = this.getBookletItemForCurrentSelection();
	if (bookletItem) {
		var modelPath = this.m_oCDManager.getModelPathFromBookletItem(bookletItem);
	}
	
	return modelPath;
}

CSelectionController.prototype.getModelDrillThroughEnabled = function()
{
	// With booklets we can't simply use the global drill through flag.
	// Dig into the metadata to see if drill through has been turned off for the referenced report
	var bookletItem = this.getBookletItemForCurrentSelection();
	if (bookletItem) {
		var modleDrillThroughEnabled = this.m_oCDManager.GetBookletModelBasedDrillThru(bookletItem);
		return modleDrillThroughEnabled == 1 ? true : false;
	}
	else {
		return this.m_bModelDrillThroughEnabled;		
	}
};

/*
  Parameters:

  Returns: boolean
*/
CSelectionController.prototype.clearSelectedObjects = function(theDocument)
{
	try
	{
		if (!theDocument) {
			theDocument = document;
		}
		this.updateUI(theDocument, this.getSelections(), true, false);
		this.m_aSelectedObjects = [];
		if (typeof this.onSelectionChange == "function")
		{
			this.onSelectionChange();
		}
		return true;
	}
	catch (e)
	{
		return false;
	}
};

/*
  Parameters:

  Returns: boolean
*/
CSelectionController.prototype.resetSelections = function(theDocument)
{
	try
	{
		if (!theDocument) {
			theDocument = document;
		}
		if (this.hasSelectedChartNodes()) { // and isBUX
			this.resetChartSelections(theDocument);
		}

		this.m_oSelectedDrillThroughImage = null;
		this.m_oSelectedDrillThroughSingleton = null;

		if(this.getSelections()) {
			this.updateUI(theDocument, this.getSelections(), true, false);
			this.updateUI(theDocument, this.getCutColumns(), true, false);
			this.m_aCutColumns = [];
			this.m_aSelectedObjects = [];
			this.m_selectedClass = [];
			this.m_cutClass = [];

			if (typeof this.onSelectionChange == "function")
			{
				this.onSelectionChange();
			}
		}
		return true;
	}
	catch (e)
	{
		return false;
	}
};

CSelectionController.prototype.resetChartSelections = function(theDocument)
{
	var chartHelpers = this.m_chartHelpers;
	for (var mapName in chartHelpers) {
		if (chartHelpers[mapName]) {
			var mapHighlighter = chartHelpers[mapName].getImageMapHighlighter();
			if (mapHighlighter.hideAllAreas) {
				mapHighlighter.hideAllAreas();
			}
		}
	}
	this.m_selectedChartNodes = [];
	this.m_selectionContainerMap = null;
};

/*
  Parameters:

  Returns: boolean
*/
CSelectionController.prototype.addSelectionObject = function(CSelectionObject, theDocument)
{
	try
	{
		if (!theDocument) {
			theDocument = document;
		}
		//test to see if this object is already selected
		var theCell = CSelectionObject.getCellRef();
		if (this.isCellSelected(theCell) !== true || (typeof theCell != "object" || theCell === null))
		{
			//test to see if this object is currently cut
/* TODO: Put this back in once Report Server starts to produce context data
			if (this.isColumnCut(CSelectionObject.getColumnName()) !== true)
			{
				this.m_aSelectedObjects[this.m_aSelectedObjects.length] = CSelectionObject;
				if (typeof this.onSelectionChange == "function")
					this.onSelectionChange();
				this.updateUI(theDocument, this.getSelections(), false, false);
			}
   /TODO */


/* TODO: Take this out once Report Server starts to produce context data */
			if (this.isColumnCut(CSelectionObject.getTag()) !== true)
			{
				this.m_aSelectedObjects[this.m_aSelectedObjects.length] = CSelectionObject;
				if (typeof this.onSelectionChange == "function")
				{
					this.onSelectionChange();
				}
				this.updateUI(theDocument, this.getSelections(), false, false);
			}
/* /TODO */
		}
		return true;
	}
	catch (e)
	{
		return false;
	}
};

/*
 * Removes selected object from the selection and update the UI.
  Parameters:

  Returns: boolean
*/
CSelectionController.prototype.removeSelectionObject = function(CSelectionObject, theDocument)
{
	try
	{

		if (!theDocument) {
			theDocument = document;
		}
		var removed = [];
		var idxSelObjects;
		for (idxSelObjects = 0; idxSelObjects < this.m_aSelectedObjects.length; idxSelObjects++)
		{
			var selObjCellRef = this.m_aSelectedObjects[idxSelObjects].getCellRef();
			var cselObjCellRef = CSelectionObject.getCellRef();
			if (typeof selObjCellRef == "object" && typeof cselObjCellRef == "object" && selObjCellRef !== null && cselObjCellRef !== null)
			{
				if (selObjCellRef == cselObjCellRef)
				{
					removed[removed.length] = idxSelObjects;
				}
			}
		}


		if (removed.length > 0)
		{
			this.updateUI(theDocument, this.getSelections(), true, false);
			var newArr = [];
			for (idxSelObjects = 0; idxSelObjects < this.m_aSelectedObjects.length; idxSelObjects++)
			{
				var addToNewArr = true;
				for (var j = 0; j < removed.length; j++)
				{
					if (idxSelObjects == removed[j])
					{
						addToNewArr = false;
					}
				}
				if (addToNewArr)
				{
					newArr[newArr.length] = this.m_aSelectedObjects[idxSelObjects];
				}
			}
			this.m_aSelectedObjects = newArr;
			this.updateUI(theDocument, this.getSelections(), false, false);
		}
		if (typeof this.onSelectionChange == "function")
		{
			this.onSelectionChange();
		}
		return true;
	}
	catch (e)
	{
		return false;
	}
};

CSelectionController.prototype.isSavedCellSelected = function( cellNode )
{
	return this.isCellSelectedHelper(cellNode, this.getSavedSelectedObjects() );
};

CSelectionController.prototype.isCellSelected = function( cellNode ){
	return this.isCellSelectedHelper(cellNode, this.getSelections());
}

/*
  Parameters:

  Returns: boolean
*/


CSelectionController.prototype.isCellSelectedHelper = function(cellNode, selectedObjects )
{
	try
	{
		for (var i = 0; i < selectedObjects.length; i++)
		{
			var selObjCellRef = selectedObjects[i].getCellRef();
			if (typeof selObjCellRef == "object" && selObjCellRef !== null)
			{
				if (selObjCellRef == cellNode)
				{
					return true;
				}
			}
		}
	}
	catch (e)
	{
	}
	return false;
};

/*
  Parameters:

  Returns: boolean
*/
CSelectionController.prototype.isColumnSelected = function(columnName)
{
	try
	{
		for (var i = 0; i < this.m_aSelectedObjects.length; i++)
		{
/* TODO: Put this back in once Report Server starts to produce context data
			if (this.m_aSelectedObjects[i].getColumnName() == columnName)
			{
				return true;
			}
   /TODO */


/* TODO: Take this out once Report Server starts to produce context data */
			if (this.m_aSelectedObjects[i].getTag() == columnName)
			{
				return true;
			}
/* /TODO */
		}
	}
	catch (e)
	{
	}
	return false;
};

/*
  Parameters:

  Returns: boolean
*/
CSelectionController.prototype.isColumnCut = function(columnName)
{
	try
	{
		for (var i = 0; i < this.m_aCutColumns.length; i++)
		{
/* TODO: Put this back in once Report Server starts to produce context data
			if (this.m_aCutColumns[i].getColumnName() == columnName)
			{
				return true;
			}
   /TODO */


/* TODO: Take this out once Report Server starts to produce context data */
			if (this.m_aCutColumns[i].getTag() == columnName)
			{
				return true;
			}
/* /TODO */
		}
	}
	catch (e)
	{
	}
	return false;
};

/*
  Parameters:

  Returns: array of selected objects
*/
CSelectionController.prototype.getSelections = function()
{
	return this.m_aSelectedObjects;
};


/*
  Parameters: a dom node

  Returns: nothing
 */
CSelectionController.prototype.selectSingleDomNode = function(nNode)
{
	this.clearSelectedObjects();
	var oSelObject = this.getSelectionObjectFactory().getSelectionObject(nNode);
	var oDocument = null;
	if (isIE()) {
		oDocument = nNode.document;
	} else {
		oDocument = nNode.ownerDocument;
	}
	this.addSelectionObject(oSelObject, oDocument);
};

/*
  Parameters:

  Returns: array of selected objects
*/
CSelectionController.prototype.hasCutColumns = function()
{
	if (this.m_aCutColumns.length === 0)
	{
		return false;
	}
	else
	{
		return true;
	}
};

/*
  Parameters:

  Returns: boolean
*/
CSelectionController.prototype.setCutColumns = function(cutValue, theDocument)
{
	try
	{

		if (!theDocument) {
			theDocument = document;
		}
		this.updateUI(theDocument, this.getSelections(), true, false);
		this.updateUI(theDocument, this.getCutColumns(), true, 1);
		this.m_aCutColumns = [];
		//sets all currently selected columns to cutValue
		if (cutValue === true)
		{
			for (var i = 0; i < this.m_aSelectedObjects.length; i++)
			{
				this.m_aCutColumns[i] = this.m_aSelectedObjects[i];
			}
			this.m_aSelectedObjects = [];
		}
		this.updateUI(theDocument, this.getCutColumns(), false, 2);
		/* I don't know yet if we want to observe the cutting of columns, leave it out for now.
		if (typeof this.onSelectionChange == "function")
		{
			this.onSelectionChange();
		}
		*/

		return true;
	}
	catch (e)
	{
		return false;
	}
};

/*
  Parameters:

  Returns: array of cut columns
*/
CSelectionController.prototype.getCutColumns = function()
{
	return this.m_aCutColumns;
};

/*
  Parameters:

  Returns: reference to observer function
*/
CSelectionController.prototype.getObservers = function()
{
	return this.m_oObserver;
};

/*
  Parameters:

  Returns: void
*/
CSelectionController.prototype.attachObserver = function(observer)
{
	this.m_oObserver.attach(observer);
};

/*
  This is called when a selection changes

  Parameters:

  Returns: void
*/
CSelectionController.prototype.onSelectionChange = function()
{
	this.getObservers().notify();
};

/*
  Parameters:

  Returns: array of columns to draw
*/
CSelectionController.prototype.getSelectedColumns = function(allSelections)
{
	var columnsToDraw = [];
	if (typeof allSelections == "undefined")
	{
		allSelections = this.getSelections();
	}
	var allSelectionsLength = allSelections.length;
	for (var i = 0; i < allSelectionsLength; i++)
	{
		var currentSelection = allSelections[i];
		var addNewEntry = true;
		for (var j = 0; j < columnsToDraw.length; j++)
		{
			if (columnsToDraw[j][0] == currentSelection.getColumnRef() && columnsToDraw[j][1] == currentSelection.getCellTypeId())
			{
				addNewEntry = false;
				break;
			}
		}
		if (addNewEntry)
		{
			columnsToDraw[columnsToDraw.length] = [
				currentSelection.getColumnRef(),
				currentSelection.getCellTypeId(),
				currentSelection.getLayoutType(),
				currentSelection.getTag(),
				currentSelection.getColumnName()
			];
		}
	}
	return columnsToDraw;
};

/*
 * Returns an array of unique (ctx id) selected objects.
 */
CSelectionController.prototype.getAllSelectedObjectsWithUniqueCTXIDs = function()
{
	var uniqueSelectedItems = [];
	var selectedObjects = this.getAllSelectedObjects();

	for (var i=0; i < selectedObjects.length; i++) {
		var found=false;
		var selectionObject = selectedObjects[i];
		for (var ii=0; ii < uniqueSelectedItems.length; ii++) {
			// if the ctx id matches, then don't add it to the unique array
			if (selectionObject.m_contextIds[0][0] == uniqueSelectedItems[ii].m_contextIds[0][0]) {
				found = true;
				break;
			}
		}

		if (!found) {
			uniqueSelectedItems.push(selectionObject);
		}
	}

	return uniqueSelectedItems;
};

CSelectionController.prototype.getAllSelectedObjects = function()
{
	var selectedItems = this.getSelections();
	if(this.hasSelectedChartNodes()) {
		selectedItems = selectedItems.concat(this.getSelectedChartNodes());
	}

	return selectedItems;
};
/*
  Parameters:

  Returns: array of column ids
*/
CSelectionController.prototype.getSelectedColumnIds = function(aAllSelections)
{
	var aColumnIds = [];
	if (typeof aAllSelections == "undefined")
	{
		aAllSelections = this.getSelections();
	}
	var aSelectedColumns = this.getSelectedColumns(aAllSelections);
	for (var idxSelCols = 0; idxSelCols < aSelectedColumns.length; idxSelCols++)
	{
		var addNewEntry = true;
		for (var idxColIds = 0; idxColIds < aColumnIds.length; idxColIds++)
		{
			if (aColumnIds[idxColIds] == aSelectedColumns[idxSelCols][4])
			{
				addNewEntry = false;
				break;
			}
		}
		if (addNewEntry)
		{
			aColumnIds[aColumnIds.length] = aSelectedColumns[idxSelCols][4];
		}
	}
	return aColumnIds;
};


var STYLE_SELECTION = {};

CSelectionController.prototype.selecting = function(c,style)
{

	var sText = "." + c + style;
	var doc = document;
	var oIFrame = document.getElementById('CVIFrame' + this.m_sNamespace);
	if (oIFrame)
	{
		doc = oIFrame.contentWindow.document;
	}

	var nStyle = doc.createElement('style');
	nStyle.setAttribute("type", "text/css");
	if (nStyle.styleSheet)
	{
		// IE
		nStyle.styleSheet.cssText = sText;
	}
	else
	{
		// Mozilla & Firefox
		nStyle.appendChild( doc.createTextNode(sText) );
	}

	doc.getElementsByTagName("head").item(0).appendChild(nStyle);

	STYLE_SELECTION[ c ] = nStyle;
};

CSelectionController.prototype.deselecting = function(anArray)
{
	for(var i = 0; i < anArray.length; ++i)
	{
		if ( STYLE_SELECTION[ anArray[i] ])
		{
			var node = STYLE_SELECTION[ anArray[i] ];
			node.parentNode.removeChild( node );
			STYLE_SELECTION[ anArray[i] ] = null;
		}
	}

	if (isIE() && typeof this.m_oCognosViewer.m_viewerFragment != "undefined")
	{
		// force IE to repaint the div
		var reportDiv = document.getElementById("CVReport" + this.m_oCognosViewer.getId());
		if(reportDiv != null)
		{
			var display = reportDiv.style.display;
			reportDiv.style.display = "none";
			reportDiv.style.display = display;
		}
	}
};


CSelectionController.prototype.showViewerContextMenu = function()
{
	if (this.hasSelectedChartNodes())
	{
		return true;
	}

	if (this.m_aSelectedObjects && this.m_aSelectedObjects.length > 0)
	{
		return true;
	}

	return false;
};

function getStyleFromClass(c)
{
	for (var i = 0; i < document.styleSheets.length; i++)
	{
		var ss = document.styleSheets[i];
		var _rules = (ss.cssRules ? ss.cssRules : ss.rules);

		for (var j = 0; j < _rules.length; j++)
		{
			var cr = _rules[j];
			var reClass = new RegExp('\\b' + c + '\\b', 'g');

			if (cr.selectorText && cr.selectorText.match(reClass))
			{
				return cr;
			}
		}
	}

	return 0;
};


CSelectionController.prototype.canUpdateSelection = function( contextIds )
{
	return this.m_selectionStyles.canApplyToSelection( contextIds );
	
};


CSelectionController.prototype.setStyleForSelection = function( contextIds )
{
	return this.m_selectionStyles.setStyleForSelection( contextIds );
	
};

/*
  Parameters:

  Returns: boolean
*/

CSelectionController.prototype.updateUI = function(theDocument, allSelections, deselectAll, isCut)
{
	if (!theDocument) {
		theDocument = document;
	}
	try
	{
		if (allSelections && allSelections.length > 0)
		{
			var allSelectionsLength, idxAllSelections, selectedTD;
			if (isCut == 1 || isCut == 2)
			{
				if (deselectAll)
				{
					this.deselecting(this.m_cutClass);
				}
				else
				{
					var cS_color = getStyleFromClass("cutSelection").style.color;
					var cS_backgroundColor = getStyleFromClass("cutSelection").style.backgroundColor;
					allSelectionsLength = allSelections.length;
					for (idxAllSelections = 0; idxAllSelections < allSelectionsLength; idxAllSelections++)
					{
						selectedTD = allSelections[idxAllSelections].getCellRef();
						var selectedClass = "cutQS" + selectedTD.getAttribute("cid");
						this.selecting(selectedClass,"\n{ background-color: "+cS_backgroundColor+"; color: "+cS_color+";}\n");
						this.m_cutClass.push(selectedClass);
					}
				}
			}
			else
			{
				if(this.m_oCognosViewer)
				{
					this.findSelectionURLs();

					selectedTD="";
					allSelectionsLength = allSelections.length;
					for (idxAllSelections = 0; idxAllSelections < allSelectionsLength; idxAllSelections++)
					{
						selectedTD = allSelections[idxAllSelections].getCellRef();

						// if we have an oldClassName it means we were showing our hover class, reset it to the original
						// class before doing the select
						if (selectedTD.getAttribute("oldClassName") != null)
						{
							selectedTD.className = selectedTD.getAttribute("oldClassName");
							selectedTD.removeAttribute("oldClassName");
						}
						
						this.setStyleForSelection( allSelections[idxAllSelections].m_contextIds );
						
						// do the secondary selection first
						if( !this.secondarySelectionIsDisabled() || deselectAll ){
							var reportDiv = document.getElementById("CVReport" + this.getNamespace());
							var secondarySelectedItems = getElementsByAttribute(reportDiv, ["td", "th"], "name", selectedTD.getAttribute("name"), this.m_maxSecondarySelection);
	
							for (var cellIndex=0; cellIndex < secondarySelectedItems.length; cellIndex++)
							{
								var cell = secondarySelectedItems[cellIndex];
								if (deselectAll)
								{
									this.restoreOldBackgroundImage(cell);
								}
								else if (  cell.getAttribute("oldBackgroundImageStyle") == null)
								{
									this.saveOldCellStyles(cell);
									this.setSecondarySelectionStyles(cell);
								}
							}
						}

						// primary selection
						this.saveOldCellStyles(selectedTD);
						if (deselectAll)
						{
							this.restoreOldBackgroundImage(selectedTD);
							if (this.m_oCognosViewer.isHighContrast())
							{
								this.restoreOldBorder(selectedTD);
								this.restoreOldPadding(selectedTD);
							}
						}
						else
						{
							this.setPrimarySelectionStyles(selectedTD);
							if (this.m_oCognosViewer.isHighContrast())
							{
								var size = getBoxInfo(selectedTD, true);
								this.saveOldBorder(selectedTD);
								this.saveOldPadding(selectedTD, size);

								var borderWidth = 3;
								var topSize = size.borderTopWidth + size.paddingTop - borderWidth;
								var bottomSize = size.borderBottomWidth + size.paddingBottom - borderWidth;
								var leftSize = size.borderLeftWidth + size.paddingLeft - borderWidth;
								var rightSize = size.borderRightWidth + size.paddingRight - borderWidth;

								selectedTD.style.border = borderWidth + "px " + this.getHighContrastBorderStyle() + " black";
								selectedTD.style.padding = topSize + "px " + rightSize + "px " + bottomSize + "px " + leftSize + "px";
							}
						}
					}
				}
			}
		}

		return true;
	}
	catch (e)
	{
		//alert("error selecting column -- please contact your administrator!");
		return false;
	}
};

CSelectionController.prototype.findSelectionURLs = function() {
	if ( !(this.sS_backgroundImageURL && this.pS_backgroundImageURL) ) {
		if(this.m_oCognosViewer.isBux || isSafari() || this.m_oCognosViewer.isMobile())	{
			// BUX doesn't have the same CSS classes, Safari & Mobile needs relative paths
			// We are using relative paths (relative to the current folger, ie. <gateway>/cgi-bin/)
			this.pS_backgroundImageURL = "url(../common/images/selection_primary.png)";
			this.sS_backgroundImageURL = "url(../common/images/selection_secondary.png)";
		}
		else {
			this.pS_backgroundImageURL = this.getBackgroundImage(getStyleFromClass("primarySelection"));
			this.sS_backgroundImageURL = this.getBackgroundImage(getStyleFromClass("secondarySelection"));
		}
	}
};

// make sure the item we are selecting is a rsvp chart image
CSelectionController.prototype.setSelectedChartImgArea = function(chartArea)
{
	var isAreaValidSelection = true;
	var isRSVPChart = chartArea.getAttribute("rsvpChart");
	var inChartContainer = chartArea.parentNode.getAttribute("chartContainer");
	if (isRSVPChart != "true" && inChartContainer != "true") {
		this.m_selectedChartNodes = [];
		isAreaValidSelection = false;
	}
	else {
		var selectedChartNode = this.getSelectionObjectFactory().getSelectionChartObject(chartArea);
		this.m_selectedChartNodes = [selectedChartNode];
	}
	return isAreaValidSelection;
};
CSelectionController.prototype.setSelectedChartArea = function(chartArea, e )
{
	var isBUX = typeof this.m_oCognosViewer.isBux !== "undefined";
	var isAreaValidSelection = false;
	if (chartArea !== null) {
		// make sure the item we are selecting is a rsvp chart image
		if (chartArea.tagName == "IMG") {
			isAreaValidSelection = this.setSelectedChartImgArea(chartArea);
		}
		else
			if (chartArea.nodeName == 'AREA' && chartArea.attributes["ctx"]) {
				isAreaValidSelection = true;
				if (isBUX) {
					this.setBuxSelectedChartArea(chartArea, e );
				} else {
					this.m_selectedChartNodes = [this.getSelectionObjectFactory().getSelectionChartObject(chartArea)];
				}
			}
		if (isAreaValidSelection) {
			this.getObservers().notify();
		}
	}
	return isAreaValidSelection;
};

CSelectionController.prototype.setBuxSelectedChartArea = function(chartArea, e) {
	var mapHelper = this.getChartHelper(chartArea);
	var selectedChartNode = mapHelper.getChartNode(chartArea);
	this.setStyleForSelection(selectedChartNode.m_contextIds );
	var imageMapHighlighter = mapHelper.getImageMapHighlighter();
	imageMapHighlighter.setFillColour( this.getPrimarySelectionColor());
	imageMapHighlighter.setStrokeColour( this.getPrimarySelectionColor());

	if (typeof e == "undefined") {
		e = {};
	}
	if (this.ctrlKeyPressed(e) || this.shiftKeyPressed(e)) {
		// multiple selection
		if (imageMapHighlighter.isAreaHighlighted(chartArea)) {
			// remove chart node from selection
			imageMapHighlighter.hideAreas(selectedChartNode.getCtxAreas());
			var chartAreaCtx = chartArea.getAttribute("ctx");
			var selectedNodesCount = this.m_selectedChartNodes.length;
			for (var i = 0; i < selectedNodesCount; i++) {
				var selChartNode = this.m_selectedChartNodes[i];
				if (chartAreaCtx == selChartNode.getContext()) {
					this.m_selectedChartNodes.splice(i, 1);
					break;
				}
			}
		}
		else {
			// add chart node to selection
			this.updateSelectionContainer(chartArea);
			imageMapHighlighter.highlightAreas(selectedChartNode.getCtxAreas(), true);
			this.m_selectedChartNodes.push(selectedChartNode);
		}

	}
	else {	// single selection
		if( this.hasSavedSelectedChartNodes()){
			var noOfSavedChartNodes = this.m_savedSelectedChartNodes.length;
			var savedChartNodes = this.m_savedSelectedChartNodes;
			 for( var i = 0; i < noOfSavedChartNodes; i++){
				 var area = savedChartNodes[i].getArea();
				 var chartHelper = this.getSavedChartHelper( area );
				 var mapHighlighter = chartHelper.getImageMapHighlighter();
				 var areaId = mapHighlighter.getAreaId( area )
				 if( imageMapHighlighter.getAreaId(chartArea)  === areaId){
					 mapHighlighter.hideAreaById( areaId + this.m_savedPrimarySelectionColor );
					 break;
				 }
			 } 
		}
		this.updateSelectionContainer(chartArea);
		imageMapHighlighter.highlightAreas(selectedChartNode.getCtxAreas());

		this.m_selectedChartNodes = [selectedChartNode];
	}
};



CSelectionController.prototype.updateSelectionContainer = function(chartArea)
{
	var imageMap = chartArea.parentNode;
	if (this.m_selectionContainerMap && this.m_selectionContainerMap.name != imageMap.name) {
		var imageMapHighlighter = this.getChartHelper(chartArea).getImageMapHighlighter();
		imageMapHighlighter.hideAllAreas();
	}
	this.m_selectionContainerMap = imageMap;
};

CSelectionController.prototype.getChartHelper = function(chartArea) {
	var imageMap = chartArea.parentNode;
	var mapName = imageMap.name;
	if (!this.m_chartHelpers[mapName]) {
		this.m_chartHelpers[mapName] = new CChartHelper(chartArea, this.getSelectionObjectFactory(), this.m_oCognosViewer);
	}
	return this.m_chartHelpers[mapName];
};

CSelectionController.prototype.getSavedChartHelper = function(chartArea) {
	var imageMap = chartArea.parentNode;
	var mapName = imageMap.name;
	return this.m_savedChartHelpers[mapName];
};


CSelectionController.prototype.getSelectedChartArea = function()
{
	return this.m_selectedChartArea;
};

CSelectionController.prototype.getSelectedChartNodes = function()
{
	return this.m_selectedChartNodes ;
};

CSelectionController.prototype.hasSelectedChartNodes = function()
{
	return this.m_selectedChartNodes && this.m_selectedChartNodes.length && this.m_selectedChartNodes.length > 0;
};

CSelectionController.prototype.getSelectedChartImage = function()
{
	var selectedChartArea = null;
	if(this.hasSelectedChartNodes())
	{
		var selectedChartNode = this.m_selectedChartNodes[0];
		selectedChartArea = selectedChartNode.getArea();
	}
	if (selectedChartArea === null)
	{
		return null;
	}

	if (selectedChartArea.tagName == "IMG")
	{
		return selectedChartArea;
	}

	return this.getSelectedChartImageFromChartArea(selectedChartArea);
};

CSelectionController.prototype.getSelectedChartImageFromChartArea = function(oChartArea){

	var imageMap = oChartArea.parentNode;
	var imageMapName = "#" + imageMap.getAttribute("name");

	return this.checkChildrenForChart(imageMap.parentNode, imageMapName);
};

CSelectionController.prototype.checkChildrenForChart = function(parent, imageMapName) {
	var child = parent.firstChild;
	while (child !== null)
	{
		if (!child.tagName) {
			return null;
		}
		else if (child.tagName == "IMG" && child.getAttribute("usemap") == imageMapName)
		{
			return child;
		}
		// if we have a div or span always look through its children
		else if (child.tagName === "DIV" || child.tagName === "SPAN") {
			var result = this.checkChildrenForChart(child, imageMapName);
			if (result) {
				return result;
			}
		}

		child = child.nextSibling;
	}

	return null;
};

CSelectionController.prototype.downloadSelectedChartImage = function(sCVID)
{
	var chartImage = this.getSelectedChartImage();
	if (chartImage !== null)
	{
		var theDocument = this.getDocumentFromImage(chartImage);
		var imageURL = chartImage.name.replace(".", "_");
		var imageName = imageURL.substr(5);

		var theURL = '?m_name=';
		theURL += imageName;
		theURL += '&format=png&b_action=xts.run&m=portal/download.xts&m_obj=';

		if (isIE()) {
			imageURL = theDocument.parentWindow.eval("graphicSrc" + imageName);
		}
		else {
			imageURL = theDocument.defaultView.eval("graphicSrc" + imageName);
		}

		var encodedPrams = "";

		if (typeof imageURL != "undefined" && imageURL !== null)
		{
			var urlArray = imageURL.split('&');
			if (urlArray.length === 0)
			{
				return;
			}

			if (imageURL.indexOf("/repository/") < 0)
			{
				for (var i = 0; i < urlArray.length; ++i)
				{
					var urlParam = urlArray[i];
					var equalPos = urlParam.indexOf('=');
					if (equalPos != -1) {
						var urlParamName = urlParam.substr(0,equalPos);
						var urlParamValue = urlParam.slice(equalPos+1);

						if (urlParamName == 'search')
						{
							encodedPrams += urlParamValue;
							break;
						}
					}
				}
			}

			// if we didn't find a searchPath then the chart must be saved on the file system. Use
			// the img src for the URL to use - it'll call the dispatcher
			if (encodedPrams == "") {
				theURL = chartImage.getAttribute("src");
				if (theURL.indexOf('?') != -1) {
					theURL += "&download=true";
				}
				else {
					theURL += "?download=true";
				}
			}

			if (typeof getConfigFrame == "function")
			{
				theURL += encodedPrams;
				theURL = getConfigFrame().constructGETRequestParamsString(theURL);
				window.open(theURL, "_blank", "width=0,height=0");
			}
			else
			{
				theURL = constructGETRequestParamsString(theURL);
				theURL += encodedPrams;
				var gateway = this.m_oCognosViewer.getGateway();

				var oIFrame = document.getElementById('CVIFrame' + this.m_sNamespace);
				if (oIFrame) {
					var iframe_src = oIFrame.src;
					if (iframe_src.indexOf("repository") >= 0 && theURL.indexOf("repository") < 0) {
						//viewer uses CM's rest API
						var indOfContent = iframe_src.indexOf("content");
						theURL = iframe_src.substring(0, indOfContent) + theURL;
					}
				}

				// if the image is saved on the file system then the URL already has the gateway
				if (theURL.indexOf(gateway) == -1) {
					var formWarpRequest = document.forms["formWarpRequest" + sCVID];
					theURL = formWarpRequest.action + theURL;
				}

				// Remove onBeforeUnLoad for this submission but set it back after.
				if (typeof window.detachLeavingRV == "function") {
					window.detachLeavingRV();
				}


				location.href = theURL;

				if (typeof window.attachLeavingRV == "function") {
					setTimeout(window.attachLeavingRV, 100);
				}
			}
		}
	}
};

CSelectionController.prototype.getDocumentFromImage = function(image) {
	var imageDocument = null;
	if (image.ownerDocument) {
		imageDocument = image.ownerDocument;
	}
	else {
		imageDocument = image.document;
	}
	return imageDocument;
};

//Determine whether pageClicked should be invoked on on the mouseDown or the mouseUp.
CSelectionController.prototype.shouldExecutePageClickedOnMouseDown = function(e) {
	//Special case where deselecting should be postponed until mouse up because
	//another event could cancel deselecting:

	//1. More than one column must be selected
	var selections = this.getSelections();
	if (selections.length > 1) {
		//2. Must be a live report
		if(this.m_oCognosViewer.envParams["ui.action"] !== 'view') {
			//3. Must be in a list

			//Get non-text ancestor node
			var node = getNodeFromEvent(e);
			try {
				while (node && (node.nodeType == 3 || (node.getAttribute && node.getAttribute("uid") === null))) {
					node = node.parentNode;
				}
			}
			catch(ex) {
				// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
			}


			var container = this.getSelectionObjectFactory().getContainerType(node);
			if(container === "list") {
				//4. Must already be selected
				for (var i = 0; i < selections.length; i++) {
					if(selections[i].m_oCellRef == node) {
						//All conditions met - postpone to mouse up
						return false;
					}
				}
			}
		}
	}

	//Default case: execute select action on mouse down
	return true;
};

/**
 * Get the container type for the currently selected node
 * Used for mobile
 */
CSelectionController.prototype.getContainerType = function() {
	var containerType = "";
	if (this.hasSelectedChartNodes()) {
		containerType = "chart";
	}
	else if (this.getDataContainerType() === "list") {
		containerType = "list";
	}
	else {
		containerType = "crosstab";
	}

	return containerType;
};

/**
 * Build up an object for the display values of all the defining cells
 * Used for mobile
 */
CSelectionController.prototype.getDisplayValues = function() {
	var displayValues = {};

	var oSelection = this.getAllSelectedObjects()[0];

	if (oSelection) {
		var ctxIds = oSelection.getSelectedContextIds();
		if (ctxIds) {
			for (var axis=0; axis < ctxIds.length; axis++) {
				var axisDisplayValues = [];
				var axisIds = ctxIds[axis];

				for (var nestingLevel=0; nestingLevel < axisIds.length; nestingLevel++) {
					var cellId = axisIds[nestingLevel];
					var displayValue = this.getDisplayValue(cellId);
					axisDisplayValues.push(displayValue);

					// Mobile doesn't want any of the defining cells for the primary selection so break out of the loop
					if (axis === 0) {
						break;
					}
				}

				var sAxis = "";
				switch(axis) {
					case 0:
						sAxis = "selected";
						break;
					case 1:
						sAxis = "rows";
						break;
					default:
						sAxis = "columns";
				}

				displayValues[sAxis] =  axisDisplayValues;
			}
		}
	}

	return displayValues;
};

/**
 * Get the tooltip from the map for chart selections
 */
CSelectionController.prototype.getChartTooltip = function() {
	var oSelection = this.getAllSelectedObjects()[0];
	if (oSelection) {
		var area = oSelection.getArea();
		if (area) {
			var title = area.getAttribute("title");
			if (title && title.length > 0) {
				return area.getAttribute("title");
			}
		}
	}

	return "";
};

/**
 * used for when we're in mobile. Retruns true if a node was selected
 */
CSelectionController.prototype.pageClickedForMobile = function(e)
{
	this.pageClicked(e);

	var selectionLength = this.getAllSelectedObjects().length;

	// Special case for mobile when there's a drill through on an image. Since they want to show a menu instead of doing the drill through
	// and clicking on an image doesn't create a selection object, add the image to the selection controller so that it gets
	// detected when looking for drill information
	if (selectionLength == 0) {
		var node = getNodeFromEvent(e, true);
		if ( !node ){
			return false;
		}
		
		if ( node.nodeName.toLowerCase() == "img" && node.getAttribute("dttargets")) {
			this.selectDrillThroughImage(node);
			return true;
		} else if( node.getAttribute("dttargets") ){
			this.selectDrillThroughSingleton( node );
			return true;
		} else if ( node.parentNode && node.parentNode.getAttribute( "dttargets") ){
			this.selectDrillThroughSingleton( node.parentNode );
			return true;
		}
		
		return false;
	}

	return true;
};

CSelectionController.prototype.clearSavedSelections = function()
{
	this.m_bSavedSelections = false;
	
	if( this.hasSavedSelectedObjects() ){
		this.updateUI( null, this.getSavedSelectedObjects(), true, false );
		delete( this.m_aSavedSelectedObjects );
	}
	
	if( this.hasSavedSelectedChartNodes() ){
		var chartHelpers = this.m_savedChartHelpers;
		for( var mapName in chartHelpers){
			if( chartHelpers[mapName]){
				var mapHighlighter = chartHelpers[mapName].getImageMapHighlighter();
				if (mapHighlighter.hideAllAreas) {
					mapHighlighter.hideAllAreas();
				} 
			}
		}
		
		delete this.m_savedChartHelpers;
		
		delete this.m_savedSelectedChartNodes;
	}
};

CSelectionController.prototype.hasSavedSelectedChartNodes = function(){
	return ( this.m_savedSelectedChartNodes && this.m_savedSelectedChartNodes.length > 0 );
};


CSelectionController.prototype.getSavedSelectedChartNodes = function(){
	return this.m_savedSelectedChartNodes;
};

/**
 * This function saves the previous selections and the primary selection colour
 */
CSelectionController.prototype.saveSelections = function()
{
	this.m_savedSelectionStyles = this.m_selectionStyles;
	
	if( this.m_aSelectedObjects.length > 0 )
	{	
		this.m_aSavedSelectedObjects = [];
		
		var noOfSelectedObjects = this.m_aSelectedObjects.length;
		var temp = [];
		for( var i=0; i < noOfSelectedObjects; i++ ){
			if( this.isMeasure( this.m_aSelectedObjects[i].m_contextIds[0][0] ) ){
				temp.push( this.m_aSelectedObjects[i] );
			} else {
				this.m_aSavedSelectedObjects.push( this.m_aSelectedObjects[i] );
			}
		}
		
		this.m_aSelectedObjects = temp;
	}
	
	if(this.hasSelectedChartNodes()){
		this.m_savedChartHelpers = this.m_chartHelpers;
		this.m_chartHelpers = {};
		
		this.m_savedSelectedChartNodes = [];
		var noOfSelectedChartNodes = this.m_selectedChartNodes.length;
		var temp =  [];
		for( var i=0; i < noOfSelectedChartNodes; i++ ) 
		{
			if( this.isMeasure( this.m_selectedChartNodes[i].m_contextIds[0][0] ) )
			{
				var chartArea = this.m_selectedChartNodes[i].getArea();
				var mapName = this.getImageMapName(chartArea);
				this.m_chartHelpers[mapName] = this.m_savedChartHelpers[mapName];
				delete this.m_savedChartHelpers[mapName];
				temp.push( this.m_selectedChartNodes[i]);
			} else {
				this.m_savedSelectedChartNodes.push( this.m_selectedChartNodes[i]);
			}
		}
		this.m_selectedChartNodes = temp;
	}
	
	this.m_bSavedSelections = true;
};

CSelectionController.prototype.hasSavedSelections = function()
{
	return this.m_bSavedSelections;
}

CSelectionController.prototype.hasSavedSelectedObjects = function()
{
	return ( this.m_aSavedSelectedObjects && this.m_aSavedSelectedObjects.length > 0 ) || this.hasSavedSelectedChartNodes();
}

CSelectionController.prototype.getSavedSelectedObjects = function()
{
	return this.m_aSavedSelectedObjects;
};


CSelectionController.prototype.getImageMapName = function(chartArea){
	var imageMap = chartArea.parentNode;
	return imageMap.name;
};
/**
 * Fix up the chart helpers - for saved nodes, use the saved chart helper
 */

CSelectionController.prototype.repaintBUXSelectedChartArea = function( chartNodes, bUseSavedChartHelpers, bExcludeMeasuresOnly ) {
	var chartHelperUsed = {};
	var noOfChartNodes = chartNodes.length;	
	
	for( var i = 0; i < noOfChartNodes; i++){

		var chartArea = chartNodes[i].getArea();
		var mapName = this.getImageMapName(chartArea);
		var chartHelper;
		if( !chartHelperUsed[ mapName] ){
			chartHelper = (bUseSavedChartHelpers) ? this.getSavedChartHelper( chartArea ) : this.getChartHelper( chartArea );			
			chartHelperUsed[ mapName ] = chartHelper;
			var imageMapHighlighter = chartHelper.getImageMapHighlighter();
			imageMapHighlighter.hideAllAreas();
			imageMapHighlighter.setFillColour( this.getPrimarySelectionColor() );
			imageMapHighlighter.setStrokeColour( this.getPrimarySelectionColor());
		} else {
			chartHelper = chartHelperUsed[ mapName];
		}
		
		
		var contextIds = chartNodes[i].m_contextIds;
		if( bExcludeMeasuresOnly && contextIds.length === 1 && contextIds[0].length === 1 && this.isMeasure(contextIds[0][0])){
			continue;
		}
		
		imageMapHighlighter.highlightAreas( chartNodes[i].getCtxAreas(), 1 );
	}

}

CSelectionController.prototype.repaintSavedSelections = function()
{
	var tempStyle = this.m_selectionStyles;
	this.m_selectionStyles = this.m_savedSelectionStyles;
	var selections = this.getSavedSelectedChartNodes();
	var bIsChartSelection = false;
	if( selections && selections.length > 0 ){
		bIsChart = true;
	} else {
		selections = this.getSavedSelectedObjects();
	}
	this.repaintSelectionsHelper( selections, true /*bRepaintSavedSelections*/, bIsChartSelection );
	this.resetSelectionStyles();
	
	this.m_selectionStyles = tempStyle;
};

CSelectionController.prototype.repaintSelections = function()
{
	var selections = this.getSelectedChartNodes();
	var bIsChartSelection = false;
	if( selections && selections.length > 0 ){
		bIsChartSelection = true;
	} else {
		selections = this.getSelections();
	}
	this.repaintSelectionsHelper( selections, false /*bRepaintSavedSelections*/, bIsChartSelection );
};

CSelectionController.prototype.repaintSelectionsHelper = function( selections, bRepaintSavedSelections,  bIsChartSelection )
{
	try
	{			
		if( bIsChartSelection ){
			this.repaintBUXSelectedChartArea( selections, bRepaintSavedSelections );
		} else {
			/**
			 * For crosstab and list
			 */
			// remove current selections UI
			this.updateUI(document, selections, true /*deselect*/, false /*isCut*/);

			// update with new selections UI
			this.updateUI(document, selections, false /*deselect*/, false /*isCut*/ );
		}

	}
	catch (e)
	{
		//alert("error selecting column -- please contact your administrator!");
		return false;
	}
}


CSelectionController.prototype.resetAll = function()
{
	this.resetSelectionStyles();
	this.clearSavedSelections();
	this.resetSelections();
	this.resetAllowHorizontalDataValueSelection();
};

CSelectionController.prototype.pageClicked = function(e )
{
try{
	var node = getNodeFromEvent(e);
	// make sure we don't reselect a node that's already selected (performance)
	if (this.m_aSelectedObjects.length > 0 && !this.shiftKeyPressed(e) && !this.ctrlKeyPressed(e)) {
		var tempNode = node;
		// need to find the node with 'uid' since it's that node that's part of the selection object
		if (!tempNode.getAttribute("uid")) {
			var parentNode = tempNode.parentNode;
			if (parentNode && parentNode.nodeType == 1 && typeof parentNode.getAttribute != "undefined" && parentNode.getAttribute("uid") != null) {
				tempNode = parentNode;
			}
		}

		if (this.isCellSelected(tempNode)) {
			if(  typeof this.m_oCognosViewer.isBux !== "undefined" ){
				this.repaintSelections();
			}
			
			// If the user right clicks on a cell without pressing ctrl or shift don't change the selection,
			// he's looking to open the context menu with the currently selected cells
			if (e.button !== 0) {
				return false;
			}
		}
	}

	if (node.tagName && node.tagName.toUpperCase() == "INPUT") {
		//This key was for a text input entry, allow the event to bubble
		return true;
	}

	if ((e.keyCode != null) && (e.keyCode != 13) && (e.keyCode != 32) && (e.keyCode != 27) && (e.keyCode != 0) && (e.keyCode != 121) && (e.keyCode != 93)) {
		return false;
	}

	var nodeDocument = getDocumentFromEvent(e);
	if (!this.hasContextData() || !this.hasMetadata())
	{
		// Update anyway- necessary for updating context menu for authored drill
		// when there is no selection when context data is absent
		if(node.nodeName == 'AREA' || node.nodeName == 'IMG' || (typeof node.getAttribute == "function" && node.getAttribute("flashChart") != null))
		{
			this.setSelectedChartArea(node, e);
		}
		this.getObservers().notify();
		return false;
	}

	if(typeof node.selectedCell != "undefined")
	{
		var divRegion = node;
		node = node.selectedCell;
		divRegion.removeAttribute("selectedCell");
	}

	if (typeof cf != "undefined" && typeof cf.hidePickers == "function")
	{
		cf.hidePickers();
	}

	if (e.keyCode == 27)
	{
		if (typeof g_reportSelectionController != "undefined")
		{
			g_reportSelectionController.clearSelections();
		}

		this.resetSelections(nodeDocument);
	}
	else if(node.nodeName == 'AREA' || node.nodeName == 'IMG' || (typeof node.getAttribute != "undefined" && node.getAttribute("flashChart") != null))
	{
		if (e.button !== 2 || this.getAllSelectedObjects().length <= 1 || typeof this.m_oCognosViewer.isBux === "undefined") {
			this.selectNode(node, e);
			this.setSelectedChartArea(node, e );
		}
	}
	//Do not select a blank crosstab corner cell
	else if (!(node.firstChild == null && node.cellIndex == 0 && node.parentNode.rowIndex == 0 && node.getAttribute("cid") == null))
	{
		//Prevent a right-click in BUX from changing the selection only when there are already multiple selections
		//This enables the context menu actions which require multiple select, like calculations
		var widget = this.m_oCognosViewer.getViewerWidget();
		
		this.selectNode(node, e);
	}

	if (window.gViewerLogger) {
		window.gViewerLogger.addContextInfo(this);
	}
}
catch (e) {
	// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
}
};

CSelectionController.prototype.getSelectionObjectFactory = function()
{
	return this.m_oSelectionObjectFactory;
};

CSelectionController.prototype.isDrillLinkOnCrosstabCell = function(node)
{
	return (node.getAttribute("ctx") == null && node.parentNode.getAttribute("dtTargets") != null);
};

CSelectionController.prototype.selectObject = function(sMun, sLun, sHun, bIgnoreDrillFlag)
{
	var ctxId = this.getCtxIdFromMun(sMun);
	if(ctxId == "")
	{
		ctxId = this.getCtxIdFromMetaData(sLun, sHun, bIgnoreDrillFlag);
	}

	if(ctxId != null && this.m_oCDManager.GetUsage(ctxId) != "2") // check that it's not a measure
	{
		var reportTable = document.getElementById("rt" + this.getNamespace());
		if(reportTable != null)
		{
			var cellRef = getElementsByAttribute(reportTable, "*", "ctx", ctxId);
			if( cellRef && cellRef.length === 0 )
			{
				var attributeValueExp = new RegExp("(^|:)" + ctxId + "(:|$)", "i");
				cellRef = getElementsByAttribute( reportTable, "*", "ctx", ctxId, -1, attributeValueExp);
			}

			var selectionObject = null;
			if(cellRef != null && cellRef.length > 0)
			{
				selectionObject = new CSelectionObject();
				selectionObject.setSelectionController(this);

				selectionObject.m_sColumnRef = cellRef[0].getAttribute("cid");
				selectionObject.m_sCellTypeId = cellRef[0].getAttribute("uid");
				selectionObject.m_sLayoutType = cellRef[0].getAttribute("type");
				selectionObject.m_sTag = cellRef[0].getAttribute("tag");
				selectionObject.m_layoutElementId = this.m_oSelectionObjectFactory.getLayoutElementId(cellRef[0]);
				selectionObject.m_dataContainerType = this.m_oSelectionObjectFactory.getContainerType(cellRef[0]);
				selectionObject.m_contextIds = [[ctxId]];

				this.m_aSelectedObjects[this.m_aSelectedObjects.length] = selectionObject;
			}
			else
			{
				var flashCharts = getElementsByAttribute(reportTable, "*", "flashChart", "true");
				if(flashCharts != null)
				{
					for(var index = 0; index < flashCharts.length; ++index)
					{
						var ldx = flashCharts[index].getLDX();
						if(ldx.indexOf("<ctx>" + ctxId + "</ctx>") != -1)
						{
							selectionObject = new CSelectionObject();
							selectionObject.setSelectionController(this);

							var lid = flashCharts[index].getAttribute("lid");
							selectionObject.m_layoutElementId = lid.replace(this.m_oCognosViewer.getId(), "");
							selectionObject.m_dataContainerType = "chart";
							selectionObject.m_contextIds = [[ctxId]];

							this.m_aSelectedObjects[this.m_aSelectedObjects.length] = selectionObject;
						}
					}
				}
			}
		}
	}
};

CSelectionController.prototype.buildSelectionObject = function(node, e)
{
	var SelObj = null;
try {
	while (node.nodeType == 3) { // test to see if this is a text node
		node = node.parentNode;
	}

	// crosstab cell check on a drill link. RSVP does not output ctx values on a crosstab cell, so we need to have special handling for drill link on a xtab cell.
	if(this.isDrillLinkOnCrosstabCell(node))
	{
		node = node.parentNode;
	}

	var ctx = node.getAttribute("ctx");
	var uid = node.getAttribute("uid");

	if ((uid == null) && ((ctx != null) || (node.parentNode && node.parentNode.nodeType == 1 && typeof node.parentNode.getAttribute != "undefined" && node.parentNode.getAttribute("uid") != null)))  // this is a textitem or chart img
	{
		//Test to see if we're clicking on a chart in a sectioned report
		if (node.nodeName == "IMG" && (node.src.indexOf("SM=") > -1 || (isIE() > -1 && node.src.indexOf("space.gif") > -1))) {
			return null;
		}
		node = node.parentNode;

		// special case for Bug#498910. Analysis Studio is adding a members attributes within the same td, broken up by divs.
		// If the parent node is a DIV and the class is "BLOCK", move up one level higher in the DOM
		if((node.className.toUpperCase() == "BLOCK" && node.nodeName.toUpperCase() == "DIV") || (node.getAttribute("dtTargets") != null))
		{
			node = node.parentNode;
		}

		uid = node.getAttribute("uid");
	}

	if (uid != null)  // this is a valid column element
	{
		var nodeChildren = node.childNodes;
		for (var i = 0; i < nodeChildren.length; i++)
		{
			if (nodeChildren[i].nodeName.toUpperCase() == "TABLE" && (nodeChildren[i].className == "ls" || nodeChildren[i].className=="xt"))
			{
				//Note that we can't purely match on the "ls" or "xt" classes for a table because they could be user assigned in RS, we must dig further
				var trs = nodeChildren[i].rows;
				for (var j = 0; j < trs.length; j++)
				{
					var tds = trs[j].cells;
					for (var k = 0; k < tds.length; k++)
					{
						if (tds[k].getAttribute("uid") != null)
						{
							//We've found a nested list or crosstab, therefore we don't want to select the outer list cell
							return null;
						}
					}
				}
			}
		}

		if(node.className.toUpperCase() == "REPEATERTABLECELL" && ctx != null)
		{
			SelObj = this.getSelectionObjectFactory().getSelectionObject(node, ctx);
		}
		else
		{
			SelObj = this.getSelectionObjectFactory().getSelectionObject(node);
		}
	}
}catch (e) {
	// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
}

	return SelObj;
};

/**
 * Helper function to figure out if the shift key was pressed. Needed since there's
 * a bug in safari where the event from a right mouse click will ALWAYS have shiftKey set
 * to true. So if we're in Safari and the event is from the right mouse, we'll pretend the shift key
 * wasn't clicked. This is a small change in behavior, but only for safari users and there's no
 * way around it
 * @param {Object} e
 */
CSelectionController.prototype.shiftKeyPressed = function(e) {
	if (e.keyCode == "121") {
		// context menu is Shift + F10, so if the key is F10 pretend the shift isn't
		// pressed or we'll do multiple selection
		return false;
	}
	if (isSafari()) {
		if (e.button != 2) {
			return e.shiftKey ? e.shiftKey : false;
		}
		else {
			return false;
		}
	}

	return e.shiftKey ? e.shiftKey : false;
};

/**
 * Helper function to figure out if the ctrl key was pressed. Needed since there's
 * a bug in safari where the event from a right mouse click will ALWAYS have ctrl set
 * to true. So if we're in Safari and the event is from the right mouse, we'll pretend the ctrl key
 * wasn't clicked. This is a small change in behavior, but only for safari users and there's no
 * way around it
 * @param {Object} e
 */
CSelectionController.prototype.ctrlKeyPressed = function(e) {
	if (isSafari()) {
		if (e.button != 2) {
			return e.ctrlKey ? e.ctrlKey : false;
		}
		else {
			return false;
		}
	}

	return e.ctrlKey ? e.ctrlKey : false;
};

CSelectionController.prototype.isSelectionsPreviouslySaved = function( selections )
{
	var bIsPreviousSelectedObjectAFilter = false;
	if( !this.m_aSavedSelectedObjects || !this.m_aSavedSelectedObjects.length || !selections || !selections.length )
	{
		return false;
	}
	
	for( var i = 0; i < selections.length; i++ ){
		if( this.isSavedCellSelected( selections[i].getCellRef() ) ){
			return true;
		}
	}
	
	return false;
	
};



CSelectionController.prototype.selectNode = function(node, e)
{
try{
	while (node.nodeType == 3) { // test to see if this is a text node
		node = node.parentNode;
	}

	// crosstab cell check on a drill link. RSVP does not output ctx values on a crosstab cell, so we need to have special handling for drill link on a xtab cell.
	if(this.isDrillLinkOnCrosstabCell(node))
	{
		node = node.parentNode;
	}

	var nodeDocument = null;
	if (isIE()) {
		nodeDocument = node.document;
	}
	else {
		nodeDocument = node.ownerDocument;
	}

	var ctx = node.getAttribute("ctx");
	var uid = node.getAttribute("uid");

	var callRefresh = false;
	if (typeof e == "undefined") {
		e = {};
	}
	var reportElementNode = false;
	if (typeof g_reportSelectionController != "undefined")
	{
		reportElementNode = this.checkForReportElementNode(node);
	}

	if ((ctx == null && uid == null && node.parentNode.nodeType == 1 && node.parentNode.getAttribute("uid") == null && reportElementNode == false) || (!this.ctrlKeyPressed(e) && !this.shiftKeyPressed(e))) //if didn't use ctrl or shift click, deselect the other selections
	{
		if (this.getSelections().length > 0) {
			callRefresh = true;
		}
		if (this.hasCutColumns() == true) {
			this.clearSelectedObjects(nodeDocument);
		}
		else
		{			
			this.resetSelections( nodeDocument);
			
			//make sure to repaint saved selections
			this.repaintSavedSelections();
			
			//TODO this needs to be removed
			//This will remove all selection objects from the list of selected columns in Query Studio
			if (typeof cf != "undefined" && typeof cf.removeAllSelectionsFromCfgVariables == "function") {
				cf.removeAllSelectionsFromCfgVariables();
			}

			this.m_oCognosViewer.setCurrentNodeFocus(null);
		}
		if (this.ctrlKeyPressed(e) || this.shiftKeyPressed(e)) {
			clearTextSelection(nodeDocument);
		}
		if (typeof g_reportSelectionController != "undefined" && reportElementNode == false)
		{
			if (g_reportSelectionController.getSelections().length > 0) {
				callRefresh = true;
			}
			g_reportSelectionController.clearSelections();
		}
	}

	var dtTargetsNode = node.getAttribute("dtTargets") ? node : null;
	var areaNodeSelected = (node.nodeName.toLowerCase()==="area");

	if ((uid == null) && ((ctx != null) || (node.parentNode && node.parentNode.nodeType == 1 && typeof node.parentNode.getAttribute != "undefined")))  // this is a textitem or chart img
	{
		//Test to see if we're clicking on a chart in a sectioned report
		if (node.nodeName == "IMG" && (node.src.indexOf("SM=") > -1 || (isIE() > -1 && node.src.indexOf("space.gif") > -1))) {
			return false;
		}
		node = node.parentNode;

		dtTargetsNode = (!dtTargetsNode && node.getAttribute("dtTargets")) ? node : dtTargetsNode;

		// special case for Bug#498910. Analysis Studio is adding a members attributes within the same td, broken up by divs.
		// If the parent node is a DIV and the class is "BLOCK", move up one level higher in the DOM
		if((node.className.toUpperCase() == "BLOCK" && node.nodeName.toUpperCase() == "DIV") || (node.getAttribute("dtTargets") != null))
		{
			node = node.parentNode;
		}

		dtTargetsNode = (!dtTargetsNode && typeof node.getAttribute != "undefined" && node.getAttribute("dtTargets")) ? node : dtTargetsNode;

		uid = (typeof node.getAttribute != "undefined") ? node.getAttribute("uid") : null;

		// For saved output with a drill through we have a span within a span, so go all the way up to the TD
		if (uid == null && node.nodeName.toLowerCase() == "span" && node.parentNode.nodeName.toLowerCase() == "td") {
			node = node.parentNode;
			uid = node.getAttribute("uid");
		}
	}

	if (uid != null)  // this is a valid column element
	{
		var nodeChildren = node.childNodes;
		for (var i = 0; i < nodeChildren.length; i++)
		{
			if (nodeChildren[i].nodeName.toUpperCase() == "TABLE" && (nodeChildren[i].className == "ls" || nodeChildren[i].className=="xt"))
			{
				//Note that we can't purely match on the "ls" or "xt" classes for a table because they could be user assigned in RS, we must dig further
				var trs = nodeChildren[i].rows;
				for (var j = 0; j < trs.length; j++)
				{
					var tds = trs[j].cells;
					for (var k = 0; k < tds.length; k++)
					{
						if (tds[k].getAttribute("uid") != null)
						{
							//We've found a nested list or crosstab, therefore we don't want to select the outer list cell
							return false;
						}
					}
				}
			}
		}
		var SelObj;
		if(node.className.toUpperCase() == "REPEATERTABLECELL" && ctx != null)
		{
			SelObj = this.getSelectionObjectFactory().getSelectionObject(node, ctx);
		}
		else
		{
			SelObj = this.getSelectionObjectFactory().getSelectionObject(node);
		}

		// Determine if this column is already selected (if so, unselect it if CTRL or SHIFT clicked)
		if (this.isCellSelected(node) == false)
		{ // If the cell is not selected, select it
			if (this.shiftKeyPressed(e))
			{
				var allSelections = this.getSelections();
				if (allSelections.length > 0)
				{
					var lastSelection = allSelections[allSelections.length - 1];

					//Make sure both selections have the same layout and they are in the same table
					if (lastSelection.getLayoutType() == SelObj.getLayoutType() && (lastSelection.getCellRef().parentNode.parentNode == SelObj.getCellRef().parentNode.parentNode))
					{
						//Check if we want to multi-select rows or columns
						if(this.cellsAreInSameColumn(lastSelection.getCellRef(), SelObj.getCellRef()))
						{
							this.selectVertical(lastSelection, SelObj, nodeDocument);
						}

						//Shift-selection on the same row
						else if(lastSelection.getCellRef().parentNode.rowIndex == SelObj.getCellRef().parentNode.rowIndex)
						{
							this.selectHorizontal(lastSelection, SelObj, nodeDocument);
						}
					}
				}
				clearTextSelection(nodeDocument);
			}
			else if (this.ctrlKeyPressed(e)) {
				clearTextSelection(nodeDocument);
			}

			this.addSelectionObject(SelObj, nodeDocument);

			// This will add the selection object to the list of selected columns in Query Studio
			if (typeof cf != "undefined" && typeof cf.addSelectionToCfgVariables == "function") {
				cf.addSelectionToCfgVariables(SelObj.getColumnName());
			}

			this.m_oCognosViewer.setCurrentNodeFocus(node);
		}
		else
		{
			if (this.ctrlKeyPressed(e))
			{ // Otherwise the cell is selected, and this is a CTRL click, so unselect it
				this.removeSelectionObject(SelObj, nodeDocument);

				// This will remove the selection of the specified column if it's the only selection in that column in Query Studio
				if (typeof cf != "undefined" && typeof cf.removeSelectionFromCfgVariables == "function")
				{
/* TODO: Put this back in once Report Server starts to produce context data
					if (!this.isColumnSelected(SelObj.getColumnName()))
						cf.removeSelectionFromCfgVariables(SelObj.getTag());
   /TODO */


/* TODO: Take this out once Report Server starts to produce context data */
					if (!this.isColumnSelected(SelObj.getTag())) {
						cf.removeSelectionFromCfgVariables(SelObj.getTag());
					}
/* /TODO */
				}
				clearTextSelection(nodeDocument);
			}
			else if (this.shiftKeyPressed(e)) {
				clearTextSelection(nodeDocument);
			}
		}
		callRefresh = true;
	}
	else if (reportElementNode)
	{
		var style = null;
		while ((typeof node.id == "undefined" || node.id == null || node.id == "") && node.parentNode != null) {
			node = node.parentNode;
		}

		if (node.id == "reportTitle") {
			style = 'TitleStyle';
		}
		else if (node.id == "reportSubtitle") {
			style = 'SubtitleStyle';
		}
		else if (node.id.indexOf("reportFilter") == 0) {
			style = 'FilterStyle';
		}

		if (style != null)
		{
			selectReportElement(e,node.id,style);
			callRefresh = true;
		}
	}
	// special case where we need to select a drill through node that has no UI for Mobile
	else if (dtTargetsNode != null && this.m_oCognosViewer && this.m_oCognosViewer.isMobile() && !areaNodeSelected) {
		var SelObj = this.getSelectionObjectFactory().getSelectionObject(dtTargetsNode);
		this.addSelectionObject(SelObj, nodeDocument );
	}
	//This will refresh the dialogs with a new list of selected columns in Query Studio
	if (callRefresh == true && (typeof cf != "undefined" && typeof cf.refreshDialog == "function")) {
		cf.refreshDialog();
	}
	
}
catch(ex) {
	// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
}
};

CSelectionController.prototype.selectDrillThroughImage = function(node) {
	this.m_oSelectedDrillThroughImage = node;
};

CSelectionController.prototype.getSelectedDrillThroughImage = function() {
	return this.m_oSelectedDrillThroughImage ? this.m_oSelectedDrillThroughImage : null;
};

CSelectionController.prototype.selectDrillThroughSingleton = function(node) {
	this.m_oSelectedDrillThroughSingleton = node;
}

CSelectionController.prototype.getSelectDrillThroughSingleton = function() {
	return this.m_oSelectedDrillThroughSingleton ? this.m_oSelectedDrillThroughSingleton : null;
};

//Deprecated way
CSelectionController.prototype.getReportContextDataArray = function()
{
	return this.m_aReportContextDataArray;
};

CSelectionController.prototype.getReportMetadataArray = function()
{
	return this.m_aReportMetadataArray;
};

CSelectionController.prototype.setupContextDataArray = function(contextDataArray)
{
	this.m_aReportContextDataArray = contextDataArray;
};

CSelectionController.prototype.setupMetaDataArray = function(metaDataArray)
{
	this.m_aReportMetadataArray = metaDataArray;
};


//JSON Way
CSelectionController.prototype.addContextData = function(contextDataJSONSpec) {
	this.m_aSelectedObjects = [];


	this.m_oCDManager.SetContextData(contextDataJSONSpec);
	if (!this.m_bUsingCCDManager) {
		this.m_bUsingCCDManager = true;
	}
	for(var i = 0; i < this.m_selectedClass.length; ++i) {
		this.deselecting(this.m_selectedClass);
	}
};

CSelectionController.prototype.addMetaData = function(metaDataJSONSpec) {
	this.m_aSelectedObjects = [];
	this.m_oCDManager.SetMetadata(metaDataJSONSpec);
	if (!this.m_bUsingCCDManager) {
		this.m_bUsingCCDManager = true;
	}
};

// Y Valve Deprecated and Old ways
CSelectionController.prototype.getDrillFlag = function(contextId) {
	var drill = "";
	if (!this.m_bUsingCCDManager) {
		var contextObj = this.m_aReportContextDataArray[contextId];
		var dataItemRefId = contextObj[0];
		var contextDataItem = this.m_aReportMetadataArray[dataItemRefId];
		if(typeof contextDataItem != "undefined" && typeof contextDataItem[3] != "undefined")
		{
			drill = contextDataItem[3];
		}

	} else {
		drill = this.m_oCDManager.GetDrillFlag(contextId);
	}
	return drill;
};


CSelectionController.prototype.getDrillFlagForMember = function(sCtxId)
{
	var drillFlag = "0";
	if (!this.m_bUsingCCDManager) {
		var contextItem = this.getContextDataItem(sCtxId);
		if(contextItem != null)
		{
			// check to see that this is a "member"
			var metaDataRefMunKey = contextItem[2]; //Mun reference key
			if(metaDataRefMunKey != "")
			{
				var metaDataRefDataItemKey = contextItem[0]; //data item reference key
				var metaDataItem = this.getMetaDataItem(metaDataRefDataItemKey);
				if(metaDataItem != null)
				{
					drillFlag = metaDataItem[3];	//drill flag index
				}
			}
		}
	} else {
		drillFlag = this.m_oCDManager.GetDrillFlagForMember(sCtxId);
	}

	return (drillFlag == null) ? 0 : drillFlag;
};

CSelectionController.prototype.getDataType = function(contextId) {
	var dtype = null;
	if (!this.m_bUsingCCDManager) {
		var aData = this.getRDI(contextId);
		if (aData && aData.length > 2)
		{
			dtype = parseInt(aData[2],10);
		}
	} else {
		dtype = parseInt(this.m_oCDManager.GetDataType(contextId),10);
	}
	return dtype;
};

CSelectionController.prototype.getUsageInfo = function(contextId) {
	if (this.m_bUsingCCDManager) {
		return this.m_oCDManager.GetUsage(contextId);
	}
};



CSelectionController.prototype.isMeasure = function(contextId) {
	return (this.getUsageInfo(contextId) == this.c_usageMeasure);
};

CSelectionController.prototype.getDepth = function(contextId) {
	var sLevel = null;
	if (!this.m_bUsingCCDManager) {
		var aData = this.getRDI(contextId);
		if (aData && aData.length > 5 && aData[1] == "R") {
			sLevel = aData[5];
		}
	} else {
		sLevel = this.m_oCDManager.GetDepth(contextId);
	}
	return sLevel;
};

CSelectionController.prototype.getUseValue = function(contextId)
{
	var value = "";
	if (!this.m_bUsingCCDManager) {
		var contextObj = this.m_aReportContextDataArray[contextId];
		if(typeof contextObj[1] != "undefined")
		{
			value = contextObj[1];
		}
	} else {
		value = this.m_oCDManager.GetDisplayValue(contextId);
	}
	return value;
};

CSelectionController.prototype.getTextValue = function(aSpans) {

	var value = null;

	// need to find the span that has a ctx attribute equal or starts with
	// the contextId passed in
	for (var iIndex=0; iIndex < aSpans.length; iIndex++)
	{
		if (aSpans[iIndex].style.visisbility != "hidden")
		{
			if(isIE())
			{
				value = aSpans[iIndex].innerText;
			}
			else
			{
				value = aSpans[iIndex].textContent;
			}

			// need to check if there are any other spans with the same ctx. RSVP sometimes
			// uses multiple spans when generting one label
			var sibling = aSpans[iIndex].nextSibling;
			while (sibling != null)
			{
				if (sibling.nodeName.toUpperCase() == "SPAN" && sibling.style.visibility != "hidden")
				{
					if(isIE())
					{
						value += sibling.innerText;
					}
					else
					{
						value += sibling.textContent;
					}
				}

				sibling = sibling.nextSibling;
			}
			break;
		}
	}

	return value;
};

CSelectionController.prototype.getDisplayValueFromDOM = function(contextId, srcNode) {

    var value = null;
	var htmlNodes;
	var ctxRegex = new RegExp("(^|\\s)" + contextId + "(\\s|$|:)", "i");

	if (typeof srcNode != "undefined")
	{
		htmlNodes = getElementsByAttribute(srcNode, ["span", "td", "th"], "ctx", contextId, 1, ctxRegex);
	}
	else
	{
		var oIFrame = document.getElementById('CVIFrame' + this.m_sNamespace);
		if (typeof oIFrame == "undefined" || oIFrame == null)
		{
			var oRVContent = document.getElementById('RVContent' + this.m_sNamespace);
			if (typeof oRVContent == "undefined" || oRVContent == null)
			{
				htmlNodes = getElementsByAttribute(document.body, ["span", "td", "th"], "ctx", contextId, 1, ctxRegex);
			}
			else
			{
				htmlNodes = getElementsByAttribute(oRVContent, ["span", "td", "th"], "ctx", contextId, 1, ctxRegex);
			}
		}
		else
		{
			htmlNodes = getElementsByAttribute(oIFrame.contentWindow.document.body, ["span", "td", "th"], "ctx", contextId, 1, ctxRegex);
		}
	}

	var aSpans;
	if(htmlNodes.length > 0 && (htmlNodes[0].nodeName.toUpperCase() == "TD" || htmlNodes[0].nodeName.toUpperCase() == "TH"))
	{
		aSpans = htmlNodes[0].childNodes;
	}
	else
	{
		aSpans = htmlNodes;
	}

	// For Annotations/Comments get the value through getUseValue().
	if (aSpans.length == 0 ||
		(aSpans[0].className.indexOf("chart_area")==-1 && aSpans[0].className.indexOf("bux-comment")==-1))
	{
		value = this.getTextValue(aSpans);
	}

	return value;
};

CSelectionController.prototype.getDisplayValue = function(contextId, srcNode) {

	var value = this.getDisplayValueFromDOM(contextId, srcNode);

	if (value == null)
	{
		value = this.getUseValue(contextId);
	}

	return value;
};

CSelectionController.prototype.getDun = function(contextId)
{
	if (this.m_bUsingCCDManager)
	{
		return this.m_oCDManager.GetDUN(contextId);
	}
	else
	{
		var contextObj = this.m_aReportContextDataArray[contextId];
		if(contextObj && typeof contextObj[5] != "undefined"){
			var dimensionRefId = contextObj[5];
			var contextDimension = this.m_aReportMetadataArray[dimensionRefId];
			if(typeof contextDimension != "undefined" && typeof contextDimension[1] != "undefined" && contextDimension[1] == "D")
			{
				return contextDimension[0];
			}
		}
	}
};

CSelectionController.prototype.getPun = function(contextId) {
	if (this.m_bUsingCCDManager) {
		return this.m_oCDManager.GetPUN(contextId);
	}
};

CSelectionController.prototype.getLun = function(contextId) {
	var lun = "";
	if (!this.m_bUsingCCDManager) {
		var contextObj = this.m_aReportContextDataArray[contextId];
		if(contextObj && typeof contextObj[3] != "undefined"){
			var queryModelItemRefId = contextObj[3];
			var contextQueryModelItem = this.m_aReportMetadataArray[queryModelItemRefId];
			if(typeof contextQueryModelItem != "undefined" && typeof contextQueryModelItem[1] != "undefined" && contextQueryModelItem[1] == "L")
			{
				lun = contextQueryModelItem[0];
			}
		}

	} else {
		lun = this.m_oCDManager.GetLUN(contextId);
	}
	return lun;
};

CSelectionController.prototype.isContextId = function(contextId) {
	var isContext = false;
	if (!this.m_bUsingCCDManager) {
		var contextObj = this.m_aReportContextDataArray[contextId];
		isContext = (typeof contextObj == "object");
	} else {
		this.m_oCDManager.FetchContextData([contextId]);
		isContext = this.m_oCDManager.ContextIdExists(contextId);
	}
	return isContext;
};


CSelectionController.prototype.hasContextData = function() {
	var hasContextData =  false;
	if (!this.m_bUsingCCDManager) {
		if (this.m_aReportContextDataArray && this.m_aReportContextDataArray.length && this.m_aReportContextDataArray.length() > 0) {
			return true;
		}
	} else {
		hasContextData = this.m_oCDManager.HasContextData();
	}
	return hasContextData;
};

CSelectionController.prototype.hasMetadata = function() {
	var hasMetadata =  false;
	if (!this.m_bUsingCCDManager) {
		if (this.m_aReportMetadataArray && this.m_aReportMetadataArray.length && this.m_aReportMetadataArray.length() > 0) {
			return true;
		}
	} else {
		hasMetadata = this.m_oCDManager.HasMetadata();
	}
	return hasMetadata;
};


/***	Gets a new index value of a cell after all the groups/non-datavalues are added or removed (depends on indexType)	***/
CSelectionController.prototype.getDifferentCellIndex = function(cellRow, cellIndex, indexType)
{
	//Go through each cell in the current row
	for(var i = 0; i < cellRow.cells.length; i++)
	{
		//If we see a cell of type "datavalue", stop and return the new cellindex value
		if (this.getSelectionObjectFactory().getSelectionObject(cellRow.cells[i]).getLayoutType() == "datavalue")
		{
			break;
		}
	}
	if (indexType == "relative")
	{
		return (cellIndex - i);
	}
	else if(indexType == "actual")
	{
		return (cellIndex + i);
	}
};

/***	Checks if two given cells are in the same column	***/
CSelectionController.prototype.cellsAreInSameColumn = function(cellOneRef, cellTwoRef)
{
	//If both selections are on the same row, they are obviously not in the same column
	if (cellOneRef.parentNode.rowIndex == cellTwoRef.parentNode.rowIndex)
	{
		return false;
	}

	//If it's a crosstab...
	if (cellOneRef.getAttribute("cid") === null)
	{
		//Compare the UIDs
		if (cellOneRef.getAttribute("uid") === cellTwoRef.getAttribute("uid"))
		{
			//If the UIDs match and the selections are column titles, they are in the same column
			if (cellOneRef.getAttribute("type") != "datavalue") {
				return true;
			}
			//if they are datavalues, see if both belong to the same column
			else if(this.getDifferentCellIndex(cellOneRef.parentNode,cellOneRef.cellIndex, "relative") == this.getDifferentCellIndex(cellTwoRef.parentNode,cellTwoRef.cellIndex, "relative")) {
				return true;
			}
		}
		else
		{
			return false;
		}
	}

	//If it's a list and the headers of both selections are same, then they are in the same column
	else if (cellOneRef.getAttribute("cid") === cellTwoRef.getAttribute("cid"))
	{
		return true;
	}
	else
	{
		return false;
	}
};

/***	Selects all the required cells between two selections in a certain column	***/
CSelectionController.prototype.selectVertical = function(sourceObj, targetObj, theDocument)
{
	if (!theDocument) {
		theDocument = document;
	}
	var currentRow = sourceObj.getCellRef().parentNode;
	var tempSelObj, i;

	var bGoDown = (sourceObj.getCellRef().parentNode.rowIndex < targetObj.getCellRef().parentNode.rowIndex);
	var lengthOfNonDataValueCells = (sourceObj.getCellRef().parentNode.cells.length - sourceObj.getCellRef().cellIndex);

	//Loop through all the rows (starting from the source cell's row)
	 //Do until we reach the target object
	while (currentRow.rowIndex != targetObj.getCellRef().parentNode.rowIndex)
	{
		if(bGoDown) {
			//source objects's row comes before the target object's row in the table, so go forward from the source
			currentRow = currentRow.nextSibling;
		}
		else {
			//source objects's row comes after the target object's row in the table, so go backward from the source
			currentRow = currentRow.previousSibling;
		}

		if (currentRow == null)
		{
			break; //There are no more rows (start or end of table)
		}

		//If the current row has the same number of cells or more than the row which had source object, go through individual cells
		if (currentRow.cells.length >= lengthOfNonDataValueCells)
		{
			for(i = 0; i < currentRow.cells.length; i++)
			{
				//Make sure both are in the same column and have the same layout
				if ((currentRow.cells[i].getAttribute("type") == sourceObj.getLayoutType()) && this.cellsAreInSameColumn(sourceObj.getCellRef(), currentRow.cells[i]))
				{
					//Get the cell that's anywhere below the source object's cell but only if they are in the same column
					tempSelObj = this.getSelectionObjectFactory().getSelectionObject(currentRow.cells[i]);
					//Add the selection if it's not already selected
					if(this.addSelectionObject(tempSelObj, theDocument))
					{
						// This will add the selection object to the list of selected columns in Query Studio
						if (typeof cf != "undefined" && typeof cf.addSelectionToCfgVariables == "function")
						{
							cf.addSelectionToCfgVariables(tempSelObj.getColumnName());
						}
					}
					break;
				}
			}
		}

	}

};

/****	Selects all the required cells between two selections on a certain row	***/
CSelectionController.prototype.selectHorizontal = function(sourceObj, targetObj, theDocument)
{
	var compareUID = "";

	//If it's a crosstab, and the UIDs of the selections don't match, exit this function
	if (sourceObj.getColumnRef() == null)
	{
		if (sourceObj.getCellRef().getAttribute("uid") == targetObj.getCellRef().getAttribute("uid")) {
			//crosstab, and same UIDs
			compareUID = sourceObj.getCellRef().getAttribute("uid");
		}
		else {
			return;
		}
	}

	//Set up start and end points of our loop
	var minNodeCellIndex, maxNodeCellIndex;
	var nodeParent = targetObj.getCellRef().parentNode; // A <tr> element
	var tempSelObj;

	if (targetObj.getCellRef().cellIndex < sourceObj.getCellRef().cellIndex)
	{
		minNodeCellIndex = targetObj.getCellRef().cellIndex;
		maxNodeCellIndex = sourceObj.getCellRef().cellIndex;
	}
	else
	{
		maxNodeCellIndex = targetObj.getCellRef().cellIndex;
		minNodeCellIndex = sourceObj.getCellRef().cellIndex;
	}

	//Go through each cell
	for (var i = minNodeCellIndex + 1; i < maxNodeCellIndex; i++)
	{
		//Select the cell if the layouts match and it's not a datavalue <----------if it's a list
		if (((sourceObj.getColumnRef() != null) && (sourceObj.getLayoutType() == targetObj.getLayoutType()) && (sourceObj.getLayoutType() != "datavalue") || this.allowHorizontalDataValueSelection() ) ||
		//Select the cell if the UIDs match <----- if it's a crosstab
			((sourceObj.getColumnRef() == null) && (nodeParent.cells[i].getAttribute("uid") == compareUID)))
		{
			tempSelObj = this.getSelectionObjectFactory().getSelectionObject(nodeParent.cells[i]);
			//Add the selection if it's not already selected
			if(this.addSelectionObject(tempSelObj, theDocument))
			{
				// This will add the selection object to the list of selected columns in Query Studio
				if (typeof cf != "undefined" && typeof cf.addSelectionToCfgVariables == "function") {
					cf.addSelectionToCfgVariables(tempSelObj.getColumnName());
				}
			}
		}
	}
};

CSelectionController.prototype.pageDoubleClicked = function(e) {
try{
	var node = getNodeFromEvent(e);

	if(typeof node.selectedCell != "undefined")
	{
		var divRegion = node;
		node = node.selectedCell;
		divRegion.removeAttribute("selectedCell");
	}

	while (node.nodeType == 3)
	{ // test to see if this is a text node
		node = node.parentNode;
	}

	var ctx = node.getAttribute("ctx");
	var uid = node.getAttribute("uid");

	if ((ctx != null) || (node.parentNode.nodeType == 1 && node.parentNode.getAttribute("uid") != null))  // this is a textitem
	{
		node = node.parentNode;

		// special case for Bug#498910. Analysis Studio is adding a members attributes within the same td, broken up by divs.
		// If the parent node is a DIV and the class is "BLOCK", move up one level higher in the DOM
		if(node.className.toUpperCase() == "BLOCK" && node.nodeName.toUpperCase() == "DIV") {
			node = node.parentNode;
		}

		uid = node.getAttribute("uid");
	}

	if (uid != null && node.firstChild != null && (node.getAttribute("type") == "columnTitle" || node.getAttribute("type") == "section"))  // this is a valid column title element
	{
		if (typeof goWindowManager != "undefined" && goWindowManager && typeof goWindowManager.getApplicationFrame == "function")
		{
			goWindowManager.getFeatureManager().launchFeature('Rename');
		}
	}
	if (typeof g_reportSelectionController != "undefined") {
		g_reportSelectionController.clearSelections();
	}
}
catch(ex) {
	// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
}

};

CSelectionController.prototype.getSelectionHoverNodes = function()
{
	return this.m_aSelectionHoverNodes;
};

CSelectionController.prototype.setSelectionHoverNodes = function(selectionHoverNodes)
{
	this.m_aSelectionHoverNodes = selectionHoverNodes;
};

CSelectionController.prototype.addSelectionHoverNode = function(node)
{
	this.m_aSelectionHoverNodes[this.m_aSelectionHoverNodes.length] = node;
};

CSelectionController.prototype.pageHover = function(e) {
try {
	var node = getNodeFromEvent(e);

	while (node.nodeType == 3) { // test to see if this is a text node
		node = node.parentNode;
	}

	if ((node.getAttribute("ctx") != null) || (node.parentNode.nodeType == 1 && node.parentNode.getAttribute("uid") != null))  // this is a textitem
	{
		if (node.parentNode.nodeName.toLowerCase() != "tr") {
			node = node.parentNode;
		}
	}

	var aSelectionHoverNodes = this.getSelectionHoverNodes();

	var selectionCount = this.getAllSelectedObjects().length;

	if (!(aSelectionHoverNodes.length == 1 && aSelectionHoverNodes[0] == node))
	{
		for (var i = 0; i < aSelectionHoverNodes.length; i++)
		{
			this.sortIconHover(aSelectionHoverNodes[i], true);
			if (selectionCount == 0)
			{
				this.pageChangeHover(aSelectionHoverNodes[i], true);
			}
		}

		this.setSelectionHoverNodes([]);

		if (selectionCount == 0)
		{
			this.sortIconHover(node, false);
			if (this.pageChangeHover(node, false))
			{
				this.addSelectionHoverNode(node);
			}
		}
		else
		{
			if (this.sortIconHover(node, false))
			{
				this.addSelectionHoverNode(node);
			}
		}
	}
}
catch(ex) {
	// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
}

};

CSelectionController.prototype.sortIconHover = function(node, hoverOff)
{
	if (!this.isValidColumnTitle(node))
	{
		return false;
	}

	var sortImgNode = this.getSortImgNode(node);
	if(sortImgNode != null && sortImgNode != "undefined")
	{
		if(sortImgNode.getAttribute( 'sortOrder' ) === 'nosort')
		{
			if (hoverOff)
			{
				sortImgNode.style.visibility = "hidden";
			}
			else
			{
				sortImgNode.style.visibility = 'visible';
			}
		}
		return true;
	}

	return false;
};

CSelectionController.prototype.isValidColumnTitle = function(node)
{
	if (node && node.parentNode)
	{
		var uid = node.getAttribute("uid");

		if (uid != null && (!(node.firstChild == null && node.cellIndex == 0 && node.parentNode.rowIndex == 0 && node.getAttribute("cid") == null))  && (node.getAttribute("type") == "columnTitle" || node.getAttribute("type") == "section"))
		{
			return true;
		}
	}

	return false;
};

CSelectionController.prototype.pageChangeHover = function(node, hoverOff) {
try {
	if ((node.getAttribute("ctx") != null) || (node.parentNode && node.parentNode.nodeType == 1 && node.parentNode.getAttribute("uid") != null))  // this is a textitem
	{
		if (node.parentNode.nodeName.toLowerCase() != "tr") {
			node = node.parentNode;
		}
	}

	if (this.isValidColumnTitle(node))  // this is a valid column title element
	{
/* TODO: Put this back in once Report Server starts to produce context data
		var columnSelected = this.isColumnSelected(aReportMetadataArray[cid]);
   /TODO */


/* TODO: Take this out once Report Server starts to produce context data */
		var columnSelected = this.isColumnSelected(node.getAttribute("tag"));
/* /TODO */
		if (!columnSelected)
		{
/* TODO: Put this back in once Report Server starts to produce context data
			columnSelected = this.isColumnCut(aReportMetadataArray[cid]);
   /TODO */


/* TODO: Take this out once Report Server starts to produce context data */
			columnSelected = this.isColumnCut(node.getAttribute("tag"));
/* /TODO */
		}

		if (!columnSelected)
		{
			if (hoverOff)
			{

				if (node.getAttribute("oldClassName") != null)
				{
					node.className = node.getAttribute("oldClassName");
					node.removeAttribute("oldClassName");
				}

				this.restoreOldBackgroundImage(node);
			}
			else
			{

				if (node.getAttribute("oldClassName") != null) {
					node.className = node.getAttribute("oldClassName");
				}
				else {
					node.setAttribute("oldClassName", node.className);
				}

				if (node.getAttribute("oldBackgroundImageStyle") != null) {
					node.style.backgroundImage = node.getAttribute("oldBackgroundImageStyle");
				}
				else {
					this.saveOldCellStyles(node);
				}
				node.className += " hoverSelection";
				return true;
			}
		}
	}
}
catch(ex) {
	// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
}
	return false;
};

//helper function to get the span node containing the sort image
CSelectionController.prototype.getSortImgNode = function( node)
{
	var elements = node.getElementsByTagName("img");
	for( var i = 0; i < elements.length ; i++)
	{
		var sId = elements[i].id.toString();
		if( sId != null && sId.length > 0 && sId.indexOf("sortimg") >= 0 )
		{
			node = elements[i];
			return node;
		}
	}
	return null;
};

CSelectionController.prototype.restoreOldPadding = function(node)
{
	if (node && node.style && node.getAttribute("oldPaddingStyle") != null)
	{
		if (node.getAttribute("oldPaddingStyle").length > 0)
		{
			node.style.padding = node.getAttribute("oldPaddingStyle");
		}
		node.removeAttribute("oldPaddingStyle");
	}
};

CSelectionController.prototype.saveOldPadding = function(node, size)
{
	if (node && node.getAttribute("oldPaddingStyle") == null)
	{
		node.setAttribute("oldPaddingStyle", size.paddingTop + "px " + size.paddingRight + "px " + size.paddingBottom + "px " + size.paddingLeft + "px");
	}
};

CSelectionController.prototype.saveOldBorder = function(node)
{
	if (node && node.getAttribute("oldBorderStyle") == null)
	{
		node.setAttribute("oldBorderStyle", node.style.border);
	}
};

CSelectionController.prototype.restoreOldBorder = function(node)
{
	if (node && node.style && node.getAttribute("oldBorderStyle") != null)
	{
		if (node.getAttribute("oldBorderStyle").length > 0)
		{
			node.style.border = node.getAttribute("oldBorderStyle");
		}
		else
		{
			node.style.borderColor = node.style.borderWidth = node.style.borderStyle = "";
		}
		node.removeAttribute("oldBorderStyle");
	}
};

CSelectionController.prototype.setPrimarySelectionStyles = function(cell) {
	if (this.getPrimarySelectionColor()) {
		cell.style.backgroundColor = this.getPrimarySelectionColor();
	}
	else {
		cell.style.backgroundImage = this.pS_backgroundImageURL;
		cell.style.backgroundRepeat = "repeat";
	}
};

CSelectionController.prototype.setSecondarySelectionStyles = function(cell) {
	if (this.getSecondarySelectionColor()) {
		cell.style.backgroundColor = this.getSecondarySelectionColor();
	}
	else {
		cell.style.backgroundImage = this.sS_backgroundImageURL;
		cell.style.backgroundRepeat = "repeat";
	}
};

CSelectionController.prototype.saveOldCellStyles = function(node)
{
	if (node && node.getAttribute("oldBackgroundImageStyle") == null)
	{
		node.setAttribute("oldBackgroundColor", this.getStyleProperty(node, "backgroundColor"));
		node.setAttribute("oldBackgroundImageStyle", this.getBackgroundImage(node));
		node.setAttribute("oldBackgroundRepeat", this.getStyleProperty(node, "backgroundRepeat"));
		node.style.backgroundImage = "";
		node.style.backgroundRepeat = "";
	}
};

CSelectionController.prototype.restoreOldBackgroundImage = function(node)
{
	if (node && node.style && node.getAttribute("oldBackgroundImageStyle") != null)
	{
		node.style.backgroundImage = node.getAttribute("oldBackgroundImageStyle");
		node.removeAttribute("oldBackgroundImageStyle");
		node.style.backgroundRepeat = node.getAttribute("oldBackgroundRepeat");
		node.removeAttribute("oldBackgroundRepeat");
		node.style.backgroundColor = node.getAttribute("oldBackgroundColor");
		node.removeAttribute("oldBackgroundColor");
	}
};


CSelectionController.prototype.getStyleProperty = function(node, property)
{
	if(node && node.style && node.style[property])
	{
		return node.style[property];
	}

	return "";
};

CSelectionController.prototype.getBackgroundImage = function(node)
{
	if(node && node.style)
	{
		return node.style.backgroundImage;
	}
	return "";
};

CSelectionController.prototype.pageContextClicked = function(e)
{
	var node = getNodeFromEvent(e);

	if(typeof node.selectedCell != "undefined")
	{
		var divRegion = node;
		node = node.selectedCell;
		divRegion.removeAttribute("selectedCell");
	}

	while (node != null && node.tagName != "TD")
	{
		node = node.parentNode;
	}

	if (node != null)
	{
		var nodeBackgroundImage = this.getBackgroundImage(node);

		this.findSelectionURLs();

		if (this.getSelections().length == 0 ||  nodeBackgroundImage != this.pS_backgroundImageURL )
		{
			this.pageClicked(e);
		}
	}
	if (typeof populateContextMenu != "undefined")
	{
		populateContextMenu();
		moveContextMenu(e);
	}

	var bReturn = false;

	if (this.showViewerContextMenu())
	{
		//NS6 specific
		if (typeof e.preventDefault == "function")
		{
			e.preventDefault();
		}
		bReturn = true;
	}

	return bReturn;
};

CSelectionController.prototype.chartContextMenu = function(e)
{
	if(!this.hasSelectedChartNodes())
	{
		return;
	}

	if (typeof populateContextMenu != "undefined")
	{
		populateContextMenu();
		moveContextMenu(e);
	}

	//NS6 specific
	if (typeof e.preventDefault == "function")
	{
		e.preventDefault();
	}
	return false;
};

CSelectionController.prototype.titleAreaContextMenu = function(e, sType, sId)
{
	if (typeof populateContextMenu != "undefined")
	{
		goWindowManager.getApplicationFrame().cfgSet("contextMenuType", sType);
		goWindowManager.getApplicationFrame().cfgSet("contextMenuId", sId);
		populateContextMenu(sType.toUpperCase());
		moveContextMenu(e, sType.toUpperCase());
	}

	//NS6 specific
	if (typeof e.preventDefault == "function")
	{
		e.preventDefault();
	}
	return false;
};

CSelectionController.prototype.selectionsAreAllSameType = function()
{
	var allSelections = this.getSelections();
	if (allSelections.length > 0)
	{
		var layoutType = allSelections[0].getLayoutType();
		for (var i = 1; i < allSelections.length; i++)
		{
			if (layoutType != allSelections[i].getLayoutType()) {
				return 0;  // They aren't all the same type
			}
		}
		return 1;  // They are all the same type
	}
	return -1;  // There are no selections
};

CSelectionController.prototype.selectionsAreAllOnSameColumn = function()
{
	var allSelections = this.getSelections();
	var i = 0;
	if (allSelections.length > 0)
	{
		var colRef = allSelections[0].getColumnRef();
		if (colRef != null && colRef != "")
		{
			for (i = 1; i < allSelections.length; i++)
			{
				if (colRef != allSelections[i].getColumnRef()) {
					return false;  // They aren't all on the same column
				}
			}
		}
		else
		{
			var cellTypeId = allSelections[0].getCellTypeId();
			for (i = 1; i < allSelections.length; i++)
			{
				if (cellTypeId != allSelections[i].getCellTypeId()) {
					return false;  // They aren't all on the same column
				}
			}
		}
		return true;  // They are all on the same column
	}
	return false;  // There are no selections
};

CSelectionController.prototype.checkForReportElementNode = function(node)
{
	if (typeof node != "undefined" && node != null && typeof node.className != "undefined" && node.className != null)
	{
		if (node.className == "tt")
		{
			// Check to see if this is the report title or subtitle
			if (typeof node.parentNode != "undefined" && node.parentNode != null && typeof node.parentNode.parentNode != "undefined" && node.parentNode.parentNode != null && (node.parentNode.className == "reportSubtitleStyle" || node.parentNode.id == "reportTitleLink")) {
				node = node.parentNode.parentNode;
			}
			else {
				return false;
			}
		}
/*
		else if (node.className == "textItem")
		{
			// Handle page footer here
			if (typeof node.parentNode != "undefined" && node.parentNode != null && node.parentNode.className == "tableCell"
				&& typeof node.parentNode.parentNode != "undefined" && node.parentNode.parentNode != null && node.parentNode.parentNode.className == "tableRow"
				&& typeof node.parentNode.parentNode.parentNode != "undefined" && node.parentNode.parentNode.parentNode != null && node.parentNode.parentNode.className == "tb"
				&& typeof node.parentNode.parentNode.parentNode.parentNode != "undefined" && node.parentNode.parentNode.parentNode.parentNode != null && node.parentNode.parentNode.parentNode.className == "pf"
				)
				node = node.parentNode;
			else
				return false;
		}
*/
		else if (typeof node.parentNode != "undefined" && node.parentNode != null)
		{
			// Check to see if this is the report filter area
			var parentNode = node.parentNode;
			while (typeof parentNode != "undefined" && parentNode != null)
			{
				if (typeof parentNode.className != "undefined" && parentNode.className != null && parentNode.className.substr(0, 2) == "ft")
				{
					node = parentNode;
					break;
				}
				else {
					parentNode = parentNode.parentNode;
				}
			}
		}
		else {
			return false;
		}
		var nodeCN = node.className.substr(0, 2);
		if (nodeCN == "ta" || nodeCN == "ts" || nodeCN == "ft") {
			return true;
		}
	}
	return false;
};

CSelectionController.prototype.chartClicked = function(htmlElement)
{
	this.setSelectedChartArea(htmlElement);
};

/**
 * A workaround for a RSVP bug: when a list column is renamed, the column title loses its ctx.
 * this function pick the the ctx of the first row in the same column and set it to the column title node.
 */
CSelectionController.prototype.processColumnTitleNode = function(selectedObject)
{
	if (!selectedObject || !this.m_oCognosViewer.isBux) {
		return;
	}

	var oCell = selectedObject.getCellRef();
	// quick check to make sure we're dealing with a column title and that we
	// haven't already tried to process it once
	if ( oCell.getAttribute("contextAugmented") == "true" || "list" != selectedObject.getDataContainerType() || "columnTitle" != selectedObject.getLayoutType()) {
		return;
	}

	var selectedContextIds = selectedObject.getSelectedContextIds();
	var missingQueryModelId = false;
	if (typeof selectedContextIds == "object"  && selectedContextIds != null && selectedContextIds.length > 0) {
		// special case where relational list headers have context but are missing a query model id
		if (this.isRelational(selectedContextIds) && this.getQueryModelId(selectedContextIds[0][0]) == null) {
			missingQueryModelId = true;
		} else {
			return;
		}
    }

	var lid = oCell.parentNode.parentNode.parentNode.getAttribute("lid"); //lid on table node.
	var parentNode = oCell.parentNode.nextSibling; //get to the next tr node.
	var aCells = getChildElementsByAttribute(parentNode, "td", "cid", oCell.getAttribute("cid"));
	var ctxValue = null;
	var canSort = true;
	var spanElements;
	if (aCells.length > 0) {
		var tdCell = aCells[0];
		var childNodesLength = tdCell.childNodes.length;
		// we need to loop through the TD's child elements one by one to make sure
		// we don't start looking for span's inside an embeded list or crosstab
		for (var tdChildIndex=0; tdChildIndex < childNodesLength; tdChildIndex++) {
			var childNode = tdCell.childNodes[tdChildIndex];
			// found an embeded list/crosstab/chart, don't bother looking at the span's in them.
			if ( childNode.getAttribute &&
				((childNode.nodeName.toLowerCase() == "table" && typeof childNode.getAttribute("lid") == "string")
				|| childNode.nodeName.toLowerCase() == 'map' || childNode.nodeName.toLowerCase() == "img" || childNode.getAttribute("chartcontainer") == "true") ) {
				// if the first item in the column content is another list or crosstab, then disable sort
				if (tdChildIndex == 0) {
					canSort = false;
				}
			} else {
				spanElements = [];
				if (childNode.nodeName.toLowerCase() == "span") {
					spanElements.push(childNode);
				}
				// the case where we have nested span elements
				var nestedSpanElements = childNode.getElementsByTagName ? childNode.getElementsByTagName("span"): [];
				for (var nestedSpanIndex = 0; nestedSpanIndex < nestedSpanElements.length; ++nestedSpanIndex)
				{
					if (lid == getImmediateLayoutContainerId(nestedSpanElements[nestedSpanIndex]))
					{
						spanElements.push(nestedSpanElements[nestedSpanIndex]);
					}
				}

				for (var spanIndex = 0; spanIndex < spanElements.length; ++spanIndex) {
					var oChild = spanElements[spanIndex];
					if (oChild.nodeType == 1 && oChild.nodeName.toLowerCase() == "span" && oChild.style.visibility != "hidden") {
						if(oChild.getAttribute("ctx") != null && oChild.getAttribute("ctx") != "") {
							ctxValue = oChild.getAttribute("ctx");
							break;
						}
					}
				}
			}
		}
	}

	if (ctxValue != null) {
		var ctxId = ctxValue.split("::")[0].split(":")[0];

		// if we're not here because of a missing query model id, then we must be missing
		// the entire context
		if (!missingQueryModelId) {
			//set the ctx for the column header node to speed up subsequent runs
			spanElements = oCell.getElementsByTagName("span");

			 if (spanElements.length != 0)
			{

				var contextObject = this.m_oCDManager.m_cd[ctxId];
				var textValue = this.getTextValue(spanElements);
				var newContextObject = {"u": textValue === null ? "" : textValue};
				if(typeof contextObject != "undefined")
				{
					if(typeof contextObject["r"] != "undefined") {	newContextObject.r = contextObject["r"]; }
					if(typeof contextObject["q"] != "undefined") {	newContextObject.q = contextObject["q"]; }
					if(typeof contextObject["i"] != "undefined") {	newContextObject.i = contextObject["i"]; }
				}
				var clonedCtxId = "cloned" + ctxId;
				this.m_oCDManager.m_cd[clonedCtxId] = newContextObject;
				spanElements[0].setAttribute("ctx", clonedCtxId);
				selectedObject = this.getSelectionObjectFactory().processCTX(selectedObject, clonedCtxId);
			}
		} else {
			// we were only missing the query model id, if we found one then set it in the context data
			var qmid = this.getQueryModelId(ctxId);
			if (qmid == null) {
				// for calculated columns, none of the cells in the column will have a query model item
			}

			if (qmid != null) {
				var oriCtxId = selectedContextIds[0][0];
				this.m_oCDManager.m_cd[oriCtxId].i = this.m_oCDManager.m_cd[ctxId].i;
				return false;
			}
		}
	}
    else
    {
        canSort = false; //not sortable with the absense of ctx.
    }


	if (!canSort) {
		oCell.setAttribute("canSort", "false");
	}

	oCell.setAttribute("contextAugmented", "true");
};

/**
 * Goes through all the selections to make sure they're in the same
 * data container
 */
CSelectionController.prototype.selectionsInSameDataContainer = function() {
	try {
		var aSelectedObjects = this.getAllSelectedObjects();
		var sLayoutElementId = aSelectedObjects[0].getLayoutElementId();
		for (var index=1; index<aSelectedObjects.length; index++) {
			if (sLayoutElementId != aSelectedObjects[index].getLayoutElementId()) {
				return false;
			}
		}
	} catch (e) {
		return false;
	}

	return true;
};

/**
 * Goes through all the selections to make sure they're from the same data item
 */
CSelectionController.prototype.selectionsFromSameDataItem = function() {
	try {
		var aSelectedObjects = this.getAllSelectedObjects();
		var refDataItem = aSelectedObjects[0].getDataItems()[0][0];
		for (var index=1; index<aSelectedObjects.length; index++) {
			if (refDataItem != aSelectedObjects[index].getDataItems()[0][0]) {
				return false;
			}
		}
	} catch (e) {
		return false;
	}

	return true;
};



/**
 * Checks to see if the first selection is on relational data.
 * @return false if OLAP data, true otherwise
 */
CSelectionController.prototype.isRelational = function(aCtxs) {
	try {
		if (!aCtxs) {
			var selection = this.getAllSelectedObjects()[0];
			aCtxs = selection.getSelectedContextIds();
		}

		for (var axisIndex=0; axisIndex < aCtxs.length; axisIndex++) {
			for (var nestIndex=0; nestIndex < aCtxs[axisIndex].length; nestIndex++) {
				var ctx = aCtxs[axisIndex][nestIndex];
				var mun = this.getMun(ctx);
				var lun = this.getLun(ctx);
				var hun = this.getHun(ctx);

				if (mun != null && typeof mun != "undefined" && mun.length > 0) {
					return false;
				}

				if (lun != null && typeof lun != "undefined" && lun.length > 0) {
					return false;
				}

				if (hun != null && typeof hun != "undefined" && hun.length > 0) {
					return false;
				}
			}
		}

		return true;
	} catch (e) {
		return true;
	}

	return true;
};

/**
 * Gets the type of the data container in which the selections are
 * @return 'list', 'crosstab' or an empty string if there was an error finding the container type
 */
CSelectionController.prototype.getDataContainerType = function() {
	try {
		if( !this.getAllSelectedObjects()[0] ){
			return "";
		}
		
		return this.getAllSelectedObjects()[0].m_dataContainerType;
	} catch (e) {
		return "";
	}
};

/**
 * Looks to make sure that the selected cells are either columns or rows
 * @return true if the selected cells are either columns or rows
 */
CSelectionController.prototype.areSelectionsColumnRowTitles = function() {
	try {
		var aSelectedObjects = this.getAllSelectedObjects();
		for (var index=0; index < aSelectedObjects.length; index++) {
			var selectedObject = aSelectedObjects[index];
			if (selectedObject.getLayoutType() != "columnTitle" || selectedObject.isHomeCell()) {
				return false;
			}
		}
	} catch (e) {
		return false;
	}

	return true;
};

/**
 * Checks to see if all the current selections are measures
 * @return true if all the current selections are measures, false otherwise
 */
CSelectionController.prototype.selectionsAreMeasures = function() {
	try {
		var aSelectedObjects = this.getAllSelectedObjects();
		for (var index=0; index < aSelectedObjects.length; index++) {
			var selectedObject = aSelectedObjects[index];
			if (this.getUsageInfo(selectedObject.getSelectedContextIds()[0][0]) != this.c_usageMeasure) {
				return false;
			}
		}
	} catch (e) {
		return false;
	}

	return true;
};

/**
 * @return true if the current selections have muns and aren't measures
 */
CSelectionController.prototype.selectionsNonMeasureWithMUN = function() {
	var aSelectedObjects = this.getAllSelectedObjects();
	if (aSelectedObjects.length == 0) {
		return false;
	}

	for (var index=0; index < aSelectedObjects.length; index++) {
		var selectedObject = aSelectedObjects[0];
		if (selectedObject.getSelectedContextIds().length == 0) {
			return false;
		}
		var contextId = selectedObject.getSelectedContextIds()[0][0];
		var mun = this.getMun(contextId);
		var sUsage = this.getUsageInfo(contextId);
		if (mun == null || typeof mun == "undefined" || mun.length == 0 || sUsage == this.c_usageMeasure) {
			return false;
		}
	}

	return true;
};

/**
 * @return true if the current selections are all measure or calculation
 */
CSelectionController.prototype.areSelectionsMeasureOrCalculation = function() {
	var aSelectedObjects = this.getAllSelectedObjects();

	if (aSelectedObjects.length == 0) {
		return false;
	}

	var bHaveCalcMetaData = this.selectionsHaveCalculationMetadata();
	for (var index=0; index < aSelectedObjects.length; index++) {
		var selectedObject = aSelectedObjects[index];

		var contextId = selectedObject.getSelectedContextIds()[0][0];
		if( !this.isCalculationOrMeasure(contextId, bHaveCalcMetaData) ){
			return false;
		}
	}

	return true;
};

/**
 * @return true if the metadata is appropriate for calculations.
 * Measure OR (Relational: no model item, Dimensional: no MUN)
 */
CSelectionController.prototype.selectionsHaveCalculationMetadata = function() {
	try {
		var containerType = this.getDataContainerType();
		var aSelectedObjects = this.getAllSelectedObjects();
		for (var index=0; index < aSelectedObjects.length; index++) {
			var selectedObject = aSelectedObjects[index];
			var contextIds = selectedObject.getSelectedContextIds();
			var contextId = contextIds[0][0];
			var sHun = this.getHun(contextId);


			if( !this.hasCalculationMetadata( contextId, contextIds, containerType) ){
				return false;
			}

		}
	} catch (e) {
		return false;
	}
	return true;
};



CSelectionController.prototype.isCalculationOrMeasure = function( contextId, bHaveCalcMetaData ){
	var mun = this.getMun(contextId);
	var sUsage = this.getUsageInfo(contextId);
	if (!(( (mun == null || typeof mun == "undefined" || mun.length == 0) && bHaveCalcMetaData) ||
	sUsage == this.c_usageMeasure)) {
		return false;
	}

	return true;
};

/**
 * @return true if the metadata is appropriate for calculations.
 * Measure OR (Relational: no model item, Dimensional: no MUN)
 */
CSelectionController.prototype.hasCalculationMetadata = function( contextId, contextIds, containerType ){
	var sHun = this.getHun(contextId);
	if (this.getUsageInfo(contextId) != this.c_usageMeasure) {
		if ((this.isRelational(contextIds) && this.getQueryModelId(contextId) != null)
		 || (!this.isRelational(contextIds) && containerType == "list" && (sHun && sHun != "")))
		{
			return false;
		}
	}
	return true;
};

CSelectionController.prototype.selectionsAreDateTime = function() {
	try {
		var aSelectedObjects = this.getAllSelectedObjects();
		for (var index=0; index < aSelectedObjects.length; index++) {
			var selectedObject = aSelectedObjects[index];
			var contextIds = selectedObject.getSelectedContextIds();
			var contextId = contextIds[0][0];
			var dType = this.getDataType(contextId);
			if (dType && typeof this.m_ccl_dateTypes[dType]!=="undefined") {
				return true;
			}
		}
	} catch (e) {
		return false;
	}
	return false;
};

/*
 * @return array of json object which contains the context of each selected object
 */
CSelectionController.prototype.getSelectedObjectsJsonContext = function() {
	try {
		var aSelectedObjects = this.getAllSelectedObjects();
		if ( aSelectedObjects=== null || aSelectedObjects.length <=0 ) {
			return null;
		}

		var modelPath = this.m_oCognosViewer.getModelPath();
		var aJsonObjects = [];
		for (var i=0; i < aSelectedObjects.length; i++) {

			var obj = aSelectedObjects[i].getContextJsonObject(this, modelPath);

			aJsonObjects.push(obj);
		}
		return aJsonObjects;
	} catch (e) {
		//ignore
	}
};

CSelectionController.prototype.destroy = function()
{
	delete this.m_oCognosViewer;
	delete this.m_aCutColumns;
	delete this.m_aSelectedObjects;
	delete this.m_selectedClass;
	delete this.m_cutClass;
	
	if (this.m_oObserver && this.m_oObserver.destroy) {
		this.m_oObserver.destroy();
	}
	delete this.m_oObserver;

	delete this.m_aReportMetadataArray;
	delete this.m_aReportContextDataArray;

	if (this.m_oCDManager && this.m_oCDManager.destroy) {
		this.m_oCDManager.destroy();
	}
	
	delete this.m_oCDManager;
	
	if(this.m_oSelectionObjectFactory && this.m_oSelectionObjectFactory.destroy) {
		this.m_oSelectionObjectFactory.destroy();
	}
	delete this.m_oSelectionObjectFactory;

	delete this.m_selectedChartArea;
	delete this.m_selectedChartNodes;

	delete this.m_selectionContainerMap;
	delete this.m_chartHelpers;
	delete this.m_oJsonForMarshal;
	
	if( this.hasSavedSelections() ){
		this.clearSavedSelections();
	}
}


function clearTextSelection(theDocument)
{
	if (!theDocument) {
		theDocument = document;
	}
	try
	{
		if (typeof theDocument.selection == "object" && theDocument.selection !== null)
		{
			theDocument.selection.empty();
		}
		else if (typeof window.getSelection == "function" && typeof window.getSelection() == "object" && window.getSelection() !== null)
		{
			//NS6 specific
			window.getSelection().removeAllRanges();
		}
	}
	catch(e)
	{
	}
}