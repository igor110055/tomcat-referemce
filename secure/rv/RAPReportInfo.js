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

/**
 * RAPReportInfo encapsulates information returned from getInfo
 * A RAPReportInfo instance attached to the viewer object is automatically updated
 * for each response.
 */
function RAPReportInfo(reportInfo, oCV)
{
	this.m_reportInfoJSON = reportInfo;
	this.m_containerInfoJSON = {};
	this.m_iContainerCount = 0;
	this.m_bPromptPart = null;
	this.m_bSingleContainer = null;
	this.m_bDetailFilteringDisabled = null;
	this.m_aDrilledOnHUNs = null;
	this.m_bPassTrackingToBUA = null;
	this.m_sDisplayTypes = null;
	this.m_bContainsInteractiveDataContainer = null;
	this.m_bContainsFilters = false;
	this.m_bContainsSlider = false;
	
	//The referenceInfoObject is a map that supports the "isReferenced()" method.
	//A caller can ask reportInfo if an entity is referenced (usu. by name).
	this.m_referenceInfoObject = {};
	
	this.initializeContainerInfo();
	this._addNonVisibleReferences(this.m_reportInfoJSON.reportLevelProperties);
	
	this._populateHun( oCV );	
}

/**
 * initialize the reportInfo and its containers as an associative array.
 */
RAPReportInfo.prototype.initializeContainerInfo = function() {
	if(this.m_reportInfoJSON)
	{
		var reportInfoContainerArray = this.m_reportInfoJSON.containers;
		if (reportInfoContainerArray) {
			this.m_iContainerCount = reportInfoContainerArray.length;
			for(var containerIdx = 0; containerIdx < this.m_iContainerCount; ++containerIdx)
			{
				var containerLID=reportInfoContainerArray[containerIdx].container;
				this.m_containerInfoJSON[containerLID]=reportInfoContainerArray[containerIdx];
				this.m_containerInfoJSON[containerLID].m_itemInfoJSON = this._initializeItemInfo(reportInfoContainerArray[containerIdx].itemInfo);
				this.m_containerInfoJSON[containerLID].m_drillabilityJSON = this._initializeDrillability(reportInfoContainerArray[containerIdx].drillability);
				this._addFilterReferences(reportInfoContainerArray[containerIdx].filter);
				this._addSliderReferences(reportInfoContainerArray[containerIdx].sliders);
				
				// the position of the container is used for the infoBar - keep track of it for now but should be refactored if ever
				// we revisit the info bar
				this.m_containerInfoJSON[containerLID].layoutIndex = containerIdx;
				if(reportInfoContainerArray[containerIdx].filter) {
					this.m_bContainsFilters = true;
				}

				if(reportInfoContainerArray[containerIdx].sliders) {
					this.m_bContainsSlider = true;
				}
			}
		}
	}
};

RAPReportInfo.prototype._initializeItemInfo = function(itemInfo) {
	var itemInfoJSON = {};
	for( var idx in itemInfo )
	{
		itemInfoJSON[itemInfo[idx].item] = itemInfo[idx];
		this.m_referenceInfoObject[itemInfo[idx].item] = true;
	}
	
	return itemInfoJSON;
};

RAPReportInfo.prototype._initializeDrillability = function(drillability) {
	var drillabilityJSON = {};
	for( var idx in drillability )
	{
		drillabilityJSON[drillability[idx].item] = drillability[idx];
		this.m_referenceInfoObject[drillability[idx].item] = true;
	}
	
	return drillabilityJSON;
};

RAPReportInfo.prototype._addFilterReferences = function(filters) {
	//Filters....
	for( var idx in filters ) {
		this.m_referenceInfoObject[filters[idx].item] = true;
		if (filters[idx].type==="contextSlice" && filters[idx].hierarchyName) {
			//context slices can be referenced by hierarchy name.
			this.m_referenceInfoObject[filters[idx].hierarchyName] = true;
		}
	}
};

RAPReportInfo.prototype._addSliderReferences = function(sliders) {
	//Sliders...
	for( var idx in sliders ) {
		this.m_referenceInfoObject[sliders[idx].name] = true;	//For sliders, its the name attribute not the item attribute.
	}
};

RAPReportInfo.prototype._addNonVisibleReferences = function(oReportLevelProperties) {
	//Non-visible items...
	if(oReportLevelProperties && oReportLevelProperties.nonVisibleFiltersMemberItemInfo){
		for(var i = 0;i<oReportLevelProperties.nonVisibleFiltersMemberItemInfo.length; i++){
			this.m_referenceInfoObject[oReportLevelProperties.nonVisibleFiltersMemberItemInfo[i]]=true;
		}
	}
};

RAPReportInfo.prototype.isReferenced = function(item) {
	return (this.m_referenceInfoObject[item]) ? true : false;
};

/**
 * Return drillability based on containerLID and item name
 */
RAPReportInfo.prototype.getDrillability = function( sContainerLID, sItemName) {
	if( !sItemName )
	{
		return this.m_containerInfoJSON[sContainerLID].m_drillabilityJSON;
	}
	else
	{
		return this.m_containerInfoJSON[sContainerLID].m_drillabilityJSON[ sItemName ];
	}
};

RAPReportInfo.prototype.getContainers = function()
{
	return this.m_containerInfoJSON;
};

RAPReportInfo.prototype.getContainer = function(lid) {
	return this.m_containerInfoJSON[lid];
};

RAPReportInfo.prototype.getContainerIds = function(containerType) {
	var containerIds = [];
	for (containerName in this.m_containerInfoJSON) {
		var container = this.m_containerInfoJSON[containerName];
		if (container && container.displayTypeId == containerType) {
			containerIds.push(container.container);
		}
	}
	
	return containerIds;
};

/**
 * Returns the container based on position in the report
 */
RAPReportInfo.prototype.getContainerFromPos = function( iPos )
{
	return this.m_reportInfoJSON.containers[iPos];
};

RAPReportInfo.prototype.getReportLevelProperties = function()
{
	return this.m_reportInfoJSON.reportLevelProperties;	
};

/**
 * Return itemInfo based on containerLID and item name
 */
RAPReportInfo.prototype.getItemInfo = function( sContainerLID, sItemName) {
	if( !sItemName )
	{
		return this.m_containerInfoJSON[sContainerLID].m_itemInfoJSON;
	}
	
	if( this.m_containerInfoJSON[sContainerLID] ){
		return this.m_containerInfoJSON[sContainerLID].m_itemInfoJSON[sItemName];
	}
	return null;
};

/**
* @param {String} itemName This is a string parameter
*/
RAPReportInfo.prototype.isReportLevel_nonVisibleFilterItem = function(itemName){
	if(itemName && itemName.length > 0){
		var oReportLevelProperties = this.m_reportInfoJSON.reportLevelProperties;
		if(oReportLevelProperties){
			if(oReportLevelProperties && oReportLevelProperties.nonVisibleFiltersMemberItemInfo){
				for(var i = 0;i<oReportLevelProperties.nonVisibleFiltersMemberItemInfo.length; i++){
					if(itemName === oReportLevelProperties.nonVisibleFiltersMemberItemInfo[i]){
						return true;
					}
				}
			}
		}		
	}	
	return false;
}


/**
 * Return true if this container is a child container
 * (childContainers have a parentContainer, parentContainers do not)
 */
RAPReportInfo.prototype.isChildContainer = function(lid) {
	return ((this.m_containerInfoJSON[lid] && 
			 this.m_containerInfoJSON[lid].parentContainer) ? true : false);
};

/**
 * Return an object with item details, or returns null if item is not found
 * 
 * obj = {
 * 	item,
 * 	hun,
 *	lid, 
 * 	queryName
 * }
 */
RAPReportInfo.prototype.getItemDetails = function(sItemName, sHun) {
	var obj = null;
	
	for (var lid in this.m_containerInfoJSON) {
		
		var oItem = this.getItemInfo(lid, sItemName);
		if(oItem && oItem.hun === sHun) {
			obj = {};
			obj.item = oItem.item;
			if (oItem.hun) {
				obj.hun = oItem.hun;
			}
			obj.lid= lid;
			obj.queryName = oItem.queryName;
			
			break;
		}
	}
	
	return (obj)? obj: null;
};

/**
 * Returns the object getItemDetails function returns, or returns null if item is not found
 */
RAPReportInfo.prototype.getItemDetailsByHun = function(sHun) {

	var sItemName = null;
	
	// find item with same hun
	for (var lid in this.m_containerInfoJSON) {
		
		var oItems = this.getItemInfo(lid);
		for (var sName in oItems) {
			var oItem = oItems[sName];
			if (oItem.hun === sHun) {
				sItemName = sName;
				break;
			}
		}
	}
	
	return (sItemName? this.getItemDetails(sItemName, sHun): null);
};



/**
 * If item does not have 'hun' info, find and set from meta data.
 * If found, 
 * 		updates it in both m_containerInfoJSON and m_reportInfoJSON, 
 * 		updates string value of envParams['rapReportInfo'] as it is still in use.
 * 
 * This function is called from CognosViewer.updateRapReportInfo 
 */
RAPReportInfo.prototype._populateHun = function(oCV) {
	if (oCV) {
		var oCCDManager = oCV.getSelectionController().getCCDManager();
		var envParams = oCV.envParams;
		var oldRAPReportInfo = oCV.getRAPReportInfo()
		
		var bUpdateEnvParams = false;
		for (var lid in this.m_containerInfoJSON) {		
			var oItemInfo = this.m_containerInfoJSON[lid].m_itemInfoJSON;		
			for (var sItemName in oItemInfo) {
				var oItem = oItemInfo[sItemName];
				/**
				 * sometimes the report is a mix of low-level and high-level spec, therefore,
				 * need to loop to make sure all the hun info are obtained
				 */
				if (oItem.hun) {
					continue;
				}
				
				var sHun = this.getHUNForItem( oItem, oCCDManager, lid, oldRAPReportInfo );
				if ( sHun ) {
					oItem.hun = sHun;
					bUpdateEnvParams = true;
				} 
			}		
		}
		
		/**
		 * need to update the rapReportInfo in the envParams with HUN info as it 
		 * does not have it.
		 */
		if (bUpdateEnvParams && typeof JSON != "undefined" && JSON != null && JSON.stringify) {
			envParams["rapReportInfo"] = JSON.stringify(this.m_reportInfoJSON);
		}
	}
};

RAPReportInfo.prototype.getHUNForItem = function( oItem, oCCDManager, lid, oldRAPReportInfo ) {
	var sHun = this.getHUNFromCCDManager( oCCDManager, oItem );
	var oldItem = null;
	if( !sHun  && oldRAPReportInfo ) {
		/**
		 * Get the hun from previous report info - this should only happen in the case of delayed
		 * viewer loading.
		 */
		 oldItem = oldRAPReportInfo.getItemInfo( lid, oItem.item );
		 if( oldItem )
		 {
			 sHun = oldItem.hun;
		 }
	}
	return sHun;
};

RAPReportInfo.prototype.getHUNFromCCDManager = function( oCCDManager, oItem ) {
	var oQueryCtxidMap = {};
	var sHUN = null;
	var queryId = this._findQueryMetadataId(oCCDManager, oQueryCtxidMap, oItem.queryName);
	if (queryId) {
		sHUN = oCCDManager.GetHUNForRDI(oItem.item, queryId);
	}
	return sHUN;
};


RAPReportInfo.prototype._findQueryMetadataId = function(oCCDManager, oMap, queryName) {
	
	if (oMap[queryName]) {
		return oMap[queryName];
	}
	
	var ctxId = oCCDManager.GetMetadataIdForQueryName(queryName);
	if (ctxId) {
		oMap[queryName] = ctxId;	
		return ctxId;
	}
	
	return null;
};

RAPReportInfo.prototype.isPromptPart = function() {
	if (this.m_bPromptPart === null) {
		if (this.m_reportInfoJSON.reportLevelProperties && 
			this.m_reportInfoJSON.reportLevelProperties.promptWidget === true) {
				this.m_bPromptPart = true;
		} else {
				this.m_bPromptPart = false;
		}
	}
	return this.m_bPromptPart;
};

RAPReportInfo.prototype.getContainerCount = function() {
	return this.m_iContainerCount;
};

/**
 * Returns true if there's only one container and reportLevelProperties.singleContainerReport is set to true
 */
RAPReportInfo.prototype.isSingleContainer = function() {
	if (this.m_bSingleContainer === null) {
		if (this.m_iContainerCount === 1 && this.m_reportInfoJSON.reportLevelProperties && this.m_reportInfoJSON.reportLevelProperties.singleContainerReport === true) {
			this.m_bSingleContainer = true;
		}
		else {
			this.m_bSingleContainer = false;
		}
	}
	
	return this.m_bSingleContainer;
};

/**
 * Returns true is reportLevelProperties.detailFilteringDisabled is set to true
 */
RAPReportInfo.prototype.isDetailFilteringDisabled = function() {
	if (this.m_bDetailFilteringDisabled === null) {
		if (this.m_reportInfoJSON.reportLevelProperties && this.m_reportInfoJSON.reportLevelProperties.detailFilteringDisabled === true) {
			this.m_bDetailFilteringDisabled = true;
		}
		else {
			this.m_bDetailFilteringDisabled = false;
		}
	}
	
	return this.m_bDetailFilteringDisabled;
	
};

RAPReportInfo.prototype.getPassTrackingtoBUA = function() {
	if (this.m_bPassTrackingToBUA === null) {
		if (this.m_reportInfoJSON.reportLevelProperties && this.m_reportInfoJSON.reportLevelProperties.shouldNotPassTrackingtoBUA === true) {
			this.m_bPassTrackingToBUA = false;
		}
		else {
			this.m_bPassTrackingToBUA = true;
		}
	}
	
	return this.m_bPassTrackingToBUA;
};

/**
 * Get the list of HUNs that have been drilled on
 */
RAPReportInfo.prototype.getDrilledOnHUNs = function() {
	if (!this.m_aDrilledOnHUNs && this.m_reportInfoJSON.reportLevelProperties && this.m_reportInfoJSON.reportLevelProperties.drilledOnHUNs) {
		this.m_aDrilledOnHUNs = this.m_reportInfoJSON.reportLevelProperties.drilledOnHUNs;
	}
	
	return this.m_aDrilledOnHUNs;
};

/**
 * Gets a comma separated string of display types
 * @param skipContainerLID - if specified will return a comma separated list of display types
 * for all the containers except the one that matches the lid
 */
RAPReportInfo.prototype.getDisplayTypes = function(skipContainerLID) {
	if (this.m_sDisplayTypes === null || skipContainerLID) {
		var sDisplayTypes = "";
		var displayTypesArray = [];
		
		for (var lid in this.m_containerInfoJSON) {
			if (!skipContainerLID || lid != skipContainerLID) {
				displayTypesArray.push(this.m_containerInfoJSON[lid].displayTypeId);
			}
		}
		sDisplayTypes = displayTypesArray.join(",");

		// if empty, check for prompt widget
		if (sDisplayTypes == "" && this.isPromptPart()) {
			sDisplayTypes = "promptWidget";
		}

		// we should only cache the list of display types if it's the full list (didn't skip any containers)
		if (!skipContainerLID) {
			this.m_sDisplayTypes = sDisplayTypes;
		}
		
		return sDisplayTypes;
	}
	
	return this.m_sDisplayTypes;
};

RAPReportInfo.prototype.isChart = function(lid) {
	var id = lid.toLowerCase();
	return id != 'mapchart' && id.match('chart$') == 'chart';
};

/**
 * Returns true if the container with the lid is a visualization (ie: type viz)
 */
RAPReportInfo.prototype.isViz = function(lid) {
	if (this.m_containerInfoJSON[lid]) {
		var displayTypeId = this.m_containerInfoJSON[lid].displayTypeId;
		if (displayTypeId) {
			return (displayTypeId.toLowerCase()=='viz');
		}
	}
	return false;	
};

/**
 * Returns true|false if the container with the lid is an interactive container
 */
RAPReportInfo.prototype.isInteractiveDataContainer = function(lid) {
	var result = false;

	if (this.m_containerInfoJSON[lid]) {
		var displayTypeId = this.m_containerInfoJSON[lid].displayTypeId;
		if (displayTypeId) {
			var id = displayTypeId.toLowerCase();
			result = id == 'crosstab' || id == 'list' || id== 'viz' || this.isChart(id);
		}

	}
	
	return result;	
};

/**
 * Returns true|false depending if there's an interactive report container (list/crosstab/chart) in the report
 */
RAPReportInfo.prototype.containsInteractiveDataContainer = function() {
	if (this.m_bContainsInteractiveDataContainer == null) {
		this.m_bContainsInteractiveDataContainer = false;
		
		for (var lid in this.m_containerInfoJSON) {
			if (this.isInteractiveDataContainer(lid)) {
				this.m_bContainsInteractiveDataContainer = true;
				break;
			}
		}
	}
	
	return this.m_bContainsInteractiveDataContainer;
};

/**
 * Returns true if any of the containers contains filter information
 */
RAPReportInfo.prototype.containsFilters = function() {
	return this.m_bContainsFilters;
};

/**
 * Returns the filter object that matches the refDataItem passed in. If bWithLabel is set to true, then
 * the filter object will only be returned if it contains an itemLabel.
 * 
 * If no match is found then null is returned.
 */
RAPReportInfo.prototype.getFilterObject = function(refDataItem, bWithLabel) {
	for (var lid in this.m_containerInfoJSON) {
		var filterObj = this.getFilterObjectFromContainer(lid, refDataItem, bWithLabel);
		if (filterObj) {
			return filterObj;
		}
	}
	
	return null;
};

/**
 * Returns the filter object that matches the refDataItem passed in for the specified container. 
 * If bWithLabel is set to true, then the filter object will only be returned if it contains an itemLabel.
 * 
 * If no match is found then null is returned.
 */
RAPReportInfo.prototype.getFilterObjectFromContainer = function(lid, refDataItem, bWithLabel) {
	var oContainer = this.m_containerInfoJSON[lid];
	if (oContainer && oContainer.filter) {
		var length = oContainer.filter.length;
		// This container has filters....does it filter an item with the same refDataItem?
		for (var i = 0; i < length; ++i) {
			var filterItem = oContainer.filter[i];
			if (refDataItem == filterItem.item) {
				if (!bWithLabel || (filterItem.itemLabel && filterItem.itemLabel.length > 0) ) {
					return filterItem;
				}
			}
		}
	}
	
	return null;	
};

/**
 * Returns the name of the slider or the item of the filter that has same HUN with the specified unique name. 
 * 
 * If no match is found then null is returned.
 * 
 * @param uniqueName 	a mun, lun or hun can be passed
 */

RAPReportInfo.prototype.hunHasFilterOrSlider = function(uniqueName) {
	if (!uniqueName) {
		return null;
	}
	
	for (var lid in this.m_containerInfoJSON) {
		var oContainer = this.m_containerInfoJSON[lid];
		if (oContainer && oContainer.filter) {
			var length = oContainer.filter.length;
			for (var i = 0; i < length; ++i) {
				var filterItem = oContainer.filter[i];
				if (filterItem.HUN && uniqueName.indexOf(filterItem.HUN)==0) {
					return filterItem.item;
				}
			}
		}
		
		if (oContainer && oContainer.sliders) {
			var length = oContainer.sliders.length;
			for (var i = 0; i < length; ++i) {
				var sliderItem = oContainer.sliders[i];
				if (sliderItem.hun && uniqueName.indexOf(sliderItem.hun)==0) {
					return sliderItem.name;
				}
			}
		}
	}
	return null;
};

RAPReportInfo.prototype.hasSlider = function(){
	return this.m_bContainsSlider;
};

/**
 * Returns a map of sliders for this report indexed by ClientID
 */
RAPReportInfo.prototype.collectSliderSetFromReportInfo = function() {
	var reportInfoSliderIDs = {};

	for (var lid in this.m_containerInfoJSON) {		
		var sliders = this.m_containerInfoJSON[lid].sliders;
		if(sliders) {
			for(var sliderIndex = 0; sliderIndex < sliders.length; ++sliderIndex) {
				var sliderClientID = sliders[sliderIndex].clientId;
				reportInfoSliderIDs[sliderClientID] = sliders[sliderIndex];
			}
		}		
	}

	return reportInfoSliderIDs;
};

/**
 * When the advanced server property VIEWER_CW_RAP_TIMER is set, this block of info is populated
 * with timing information about RAP server events that can be reported in the infobar.
 */
RAPReportInfo.prototype._getEventTimings = function() {
	return (this.m_reportInfoJSON && this.m_reportInfoJSON.reportLevelProperties && 
		this.m_reportInfoJSON.reportLevelProperties.eventTimings) ? 
			this.m_reportInfoJSON.reportLevelProperties.eventTimings : null;
};

RAPReportInfo.prototype.destroy = function() {
	GUtil.destroyProperties(this);
};
