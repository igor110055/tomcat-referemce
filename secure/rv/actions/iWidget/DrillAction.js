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

function DrillAction() {
	this.m_bUseReportInfoSelection = false; //default is false
	this.m_aDrillSelectedObjects = []; //local array to store selected objects
	this.m_useMARequest = false; //flag to enable action arguments block for use ma instead V5 request for getting child/parent information
	this.m_userSelectedDrillItem = null;	
}
DrillAction.prototype = new ModifyReportAction();

DrillAction.prototype.getHoverClassName = function() { return ""; };

/**
 * Only set when the user has picked a specific entry off of the drill down or up subMenu
 */
DrillAction.prototype.setRequestParms = function(parms) {
	if (parms) {
		this.m_userSelectedDrillItem = parms.userSelectedDrillItem;
	}
};


DrillAction.prototype.setKeepFocusOnWidget = function(keepFocus)
{
	this.m_bKeepFocusOnWidget = keepFocus;
};

DrillAction.prototype.keepFocusOnWidget = function()
{
	if (typeof this.m_bKeepFocusOnWidget != "undefined")
	{
		return this.m_bKeepFocusOnWidget;
	}

	return true;
};

DrillAction.prototype.getDrillabilityForItemFromReportInfo = function(itemName)
{
	if( !this.m_oCV )
	{
		return null;
	}

	var reportInfo = this.m_oCV.getRAPReportInfo();
	if(!reportInfo)
	{
		return null;
	}

	var containers = reportInfo.getContainers();
	for( var container in containers )
	{
		var drillability = reportInfo.getDrillability(container);
		if( drillability[itemName])
		{
			return drillability[itemName];
		}
	}
	return null;

};

DrillAction.prototype.onDoubleClick = function(evt)
{
	this.execute();
};

DrillAction.prototype.preProcess = function()
{
	//should only have drill spec if handling a synchronize drill event - in which
	//case we don't want to fire drill event again
	if( typeof this.m_drillSpec === "undefined" || this.m_drillSpec === null )
	{
		var aDrillSpecObjects = this.generateDrillSpecObjects();
		if (!aDrillSpecObjects) {
			return null;
		}

		var oCognosViewer = this.getCognosViewer();
		var oViewerWidget = oCognosViewer.getViewerWidget();

		if (oViewerWidget) {
			var sModelPath =  oCognosViewer.getModelPath();
			oViewerWidget.getWidgetContextManager().raiseDrillEvent(aDrillSpecObjects, this.m_sAction, sModelPath);
		}
	}
};


/*
 * returns array of Drill spec object
 *
 * drill spec object has following properties
 *
		oDrillSpecObject = {
				"dataItem": "",
				"mun":  "",
				"lun":  "",
				"hun": "",
				"displayValue": "",
				"summary": "" //optional
		};
 */
DrillAction.prototype.generateDrillSpecObjects = function()
{
	try
	{
		var aDrillSpecObjects = [];
		var oCV = this.getCognosViewer();
		var drillMgr = oCV.getDrillMgr();
		var selectionController = oCV.getSelectionController();

		var bIsSyncDrill = true;
		var aDrillParams = drillMgr.getDrillParameters(this.m_drillOption, true, bIsSyncDrill, this.m_userSelectedDrillItem );
		if (aDrillParams.length === 0) {
			return null;
		}
		var oSelectedObject = drillMgr.getSelectedObject();

		if (aDrillParams.length > 3*4 && (oSelectedObject.getDataContainerType() == "crosstab" || oSelectedObject.getLayoutType() == "chartElement" )) {
			//In drillParams, which is a flat array, each context id corresponds to 4 entries (value, mun, lun, hun).
			//For crosstab and chart, the fourth ctx id and beyond are from master-detail links,
			//need to remove them to avoid synced-drilling on them.
			aDrillParams.length = 3 * 4;
		}

		var aContextIds = drillMgr.getSelectedObject().getSelectedContextIds();
		for (var i=0, drillGroupIndex = 0; drillGroupIndex < aContextIds.length && i <aDrillParams.length; ++drillGroupIndex) {
			
			var ctxValue = aContextIds[drillGroupIndex][0];
			
			var sDataItem = selectionController.getRefDataItem(ctxValue);
			var sMUN = selectionController.getMun(ctxValue);
			var sDisplayValue = selectionController.getDisplayValue(ctxValue);
			
			//Exclude the member that cannot be drilled on from the drill spec. 
			if( selectionController.getDrillFlagForMember( ctxValue ) === 0 ){
				i = i + 4; //skip over the entries for the excluded member
				continue; 
			}
			
			var oDrillSpecObject = {
					"dataItem": aDrillParams[i++],
					"mun": aDrillParams[i++],
					"lun": aDrillParams[i++],
					"hun": aDrillParams[i++]
			};


			//insert the display values.
			if (sDataItem != "" && sDisplayValue != "") {
				if (oDrillSpecObject.dataItem === sDataItem) {
					oDrillSpecObject.displayValue = sDisplayValue;
				}
			}

			var sUsageValue = selectionController.getUsageInfo(ctxValue);
			oDrillSpecObject.isMeasure = (sUsageValue === '2')? "true" : "false";

			//insert if drilling on summary
			var drillSummary = false;
			if (sMUN != "" && sUsageValue != '2') {
				var drillabilityObj = this.getDrillabilityForItemFromReportInfo(sDataItem);
				if ((drillabilityObj != null && drillabilityObj.disableDown == true) || this.m_oCV.getSelectionController().getDrillFlagForMember(ctxValue) == 1) {
					drillSummary = true;
				}
			}
			if (drillSummary) {
				if (oDrillSpecObject.dataItem === sDataItem) {
					oDrillSpecObject.summary = "true";
				}
			}

			aDrillSpecObjects.push(oDrillSpecObject);
		}

		return (aDrillSpecObjects.length>0)? aDrillSpecObjects : null;
	} catch( e )
	{
		return null;
	}
};

/*
 * This function parses the drill spec and creates a selected object
 * based on the spec.
 * Returns false if an exception occurs, true otherwise
 */
DrillAction.prototype.parseDrillSpec = function( evt )
{
	try
	{
		var oCV = this.getCognosViewer();
		if( oCV.getStatus() !== 'complete' || oCV.getConversation() === "")
		{
			return false;
		}

		this.m_drillSpec = evt.payload.drillSpec;
		var xmlDom = XMLBuilderLoadXMLFromString(this.m_drillSpec);
		var drillParametersNode = xmlDom.firstChild;
		var selectionController = getCognosViewerSCObjectRef(oCV.getId());
		selectionController.m_aSelectedObjects = []; //do we need to do this?

		// For some testcases (please see COGCQ00245956), especially for charts, the selected chart area is not cleaned-up properly
		// and the object of the old selection is hanging around creating strange behaviour.
		// So, clear the selection chart area if an old one is hanging around. Here is the only place to do this.
		if (selectionController.hasSelectedChartNodes())
		{
			selectionController.clearSelectionData();
		}

		var aDrillGroups = XMLHelper_FindChildrenByTagName(drillParametersNode, "DrillGroup", false);
		for(var iDrillGroupIndex = 0; iDrillGroupIndex < aDrillGroups.length; ++iDrillGroupIndex)
		{
			var munNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "MUN", false);

			var sMun = XMLHelper_GetText(munNode);
			var sLun = "";
			var sHun = "";
			var sDisplayValue = "";
			var sSummary = "";

			var displayValueNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "DisplayValue", false);
			if(displayValueNode != null)
			{
				sDisplayValue = XMLHelper_GetText(displayValueNode);
			}
			var lunNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "LUN", false);
			if(lunNode != null)
			{
				sLun = XMLHelper_GetText(lunNode);
			}

			var hunNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "HUN", false);
			if(hunNode != null)
			{
				sHun = XMLHelper_GetText(hunNode);
			}

			var summaryNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "Summary", false);
			if(summaryNode != null)
			{
				sSummary = XMLHelper_GetText(summaryNode);
			}

			this.selectObject(sMun, sLun, sHun, sDisplayValue, sSummary, selectionController );
		}
	}
	catch( e )
	{
		return false;
	}

	return( selectionController.m_aSelectedObjects.length > 0 );
};

DrillAction.prototype.parseDrillSpecObjects = function( aDrillSpecObjects )
{

	if (this.useReportInfoSelection()) {
		return this.parseDrillSpecObjectsWithReportInfo(aDrillSpecObjects);
	}

	try
	{
		var oCV = this.getCognosViewer();
		if( oCV.getStatus() !== 'complete' || oCV.getConversation() === "")
		{
			return false;
		}

		this.m_drillSpec = "";

		var selectionController = getCognosViewerSCObjectRef(oCV.getId());
		selectionController.m_aSelectedObjects = []; //do we need to do this?

		// For some testcases (please see COGCQ00245956), especially for charts, the selected chart area is not cleaned-up properly
		// and the object of the old selection is hanging around creating strange behaviour.
		// So, clear the selection chart area if an old one is hanging around. Here is the only place to do this.
		if (selectionController.hasSelectedChartNodes())
		{
			selectionController.clearSelectionData();
		}

		for(var i in aDrillSpecObjects)
		{
			var oSpec = aDrillSpecObjects[i];
			var sSummary = (oSpec.summary)? oSpec.summary :"";
			//For sync drill, drill flags are ignored so that we can sychronized dataItemDimensionalEdgeSummary
			var bIsSyncDrill = true;
			this.selectObject(oSpec.mun, oSpec.lun, oSpec.hun, oSpec.displayValue, sSummary, selectionController, bIsSyncDrill );
		}
	}
	catch( e )
	{
		return false;
	}

	return( selectionController.m_aSelectedObjects.length > 0 );
};

DrillAction.prototype.getDrillabilityForCtxValue = function(sCtxId){
	if (console && console.log) {
		console.log("Required method, getDrillabilityForCtxValue, not implemented.");
	}
};

DrillAction.prototype.setDrillabilityForSelectObject = function(sCtxId){

	this.drillability = this.getDrillabilityForCtxValue( sCtxId );
};

DrillAction.prototype.canDrillDown = function(){
	if (console && console.log) {
		console.log("Required method, canDrillDown, not implemented.");
	}
};

DrillAction.prototype.canDrilUp = function(){
	if (console && console.log) {
		console.log("Required method, canDrilUp, not implemented.");
	}
};

DrillAction.prototype.selectObject = function(sMun, sLun, sHun, sDisplayValue, sOnSummary, selectionController, bIsSyncDrill )
{
	var sActualHun = sHun;
	var sActualLun = sLun;
	var sActualMun = sMun;

	var bIgnoreDrillFlag = false;
	
	var sCtxId = selectionController.getCtxIdFromMun(sMun);
	var sCtxIdByMun = sCtxId;
	if(sCtxId === "")
	{
		var oActualLunAndHun = selectionController.replaceNamespaceForSharedTM1DimensionOnly(sLun, sHun, sMun);
		sActualLun = oActualLunAndHun.lun;
		sActualHun = oActualLunAndHun.hun;
		if(sActualHun !== sHun){//The HUN has been udpated with the new namespace for TM1 shared dimension
			sActualMun = this._replaceNamespace(sMun, sActualHun);//Replace MUN with the new namespace for TM1 shared dimension
		}
		//set bIgnoreDrillFlag to true if this is sync drill and you're getting ctxId from metadata.  This is to allow for sync of dataItemDimensionalEdgeSummary.
		bIgnoreDrillFlag = ( bIsSyncDrill == true ); 
		sCtxId = selectionController.getCtxIdFromMetaData(sActualLun, sActualHun, bIgnoreDrillFlag);
		if( sCtxId === "" )
		{
			return false;
		}
	}
	
	this.setDrillabilityForSelectObject(sCtxId);
	
	if((bIgnoreDrillFlag == true) || (this.m_sAction == "DrillDown" && this.canDrillDown()) || (this.m_sAction == "DrillUp" && this.canDrillUp() ) )
	{
		var beforeNumber = selectionController.getSelections().length;
		selectionController.selectObject( sActualMun, sActualLun, sActualHun, bIgnoreDrillFlag );
		var selectionObjects = selectionController.getSelections();

		if (sCtxIdByMun === "" && selectionObjects.length > beforeNumber) {
			var aMuns = selectionObjects[selectionObjects.length -1].m_aMuns;
			aMuns[aMuns.length] = [];
			aMuns[aMuns.length-1].push(sActualMun);
			var aDisplayValues = selectionObjects[selectionObjects.length -1].m_aDisplayValues;
			aDisplayValues.push(sDisplayValue);
			selectionObjects[selectionObjects.length -1].useDisplayValueFromObject = true;
		}
		if (sOnSummary == "true") {
			selectionObjects = selectionController.getSelections();
			selectionObjects[selectionObjects.length-1].onSummary = true;
		}
	}
};


DrillAction.prototype._replaceNamespace = function(mun, sActualHun) {
	var sResult = null;
	if(sActualHun){
		var sNamespace = sActualHun.substr(0, sActualHun.indexOf("].[") + 1);
		if(mun && sNamespace && !(mun.match("^" + sNamespace))){
			var iFirstDotPos = mun.indexOf("].[");
			sResult = sNamespace + mun.substr(iFirstDotPos + 1, mun.length);
		}
	}

	return sResult || mun;
};


DrillAction.prototype.addActionContextAdditionalParms = function()
{
	var params = "";

	var selectionObjects = (this.useReportInfoSelection())? this.m_aDrillSelectedObjects : this.getCognosViewer().getSelectionController().getSelections();
	var sItem = null;
	for (var i = 0; i < selectionObjects.length; ++i)
	{
		if (selectionObjects[i].onSummary)
		{
			sItem = (this.useReportInfoSelection())? selectionObjects[i].item :
						selectionObjects[i].getDataItems()[0][0]; //expect only one because this is passed down from drill event.

			params += "<dataItem>" + xml_encode(sItem) + "</dataItem>";
		}
	}

	if (params != "") {
		params = "<onSummary>" + params + "</onSummary>";
	}

	if (this.m_userSelectedDrillItem) {
		params += ("<userSelectedDrillItem>" + this.m_userSelectedDrillItem + "</userSelectedDrillItem>");
	}
	//following flags to make drill performance optimisation with switching V5 to MA for some requests
	if (this.m_useMARequest === true) {
		params = params + "<useMAGetChildRequest>false</useMAGetChildRequest>";
		params = params + "<useMAGetParentRequest>false</useMAGetParentRequest>";
	}
	
	params += this.addClientContextData(/*maxValuesPerRDI*/3);
	return params;
};

DrillAction.prototype.getDrillOptionsAsString =  function(){
	var oViewerWidget = this.getViewerWidget();
	var result = "";
	if(oViewerWidget){
		result = "<addSummaryMembers>" + oViewerWidget.getDrillOptions().addSummaryMembers + "</addSummaryMembers>";
		result = result + "<backwardsCompatible>" + oViewerWidget.getDrillOptions().backwardsCompatible + "</backwardsCompatible>";
	}
	return result;
};

DrillAction.prototype.getItemInfo = function( cognosViewer, itemName )
{
	var rapReportInfo = cognosViewer.getRAPReportInfo()
	if( !rapReportInfo )
	{
		return null;
	}

	var containers = rapReportInfo.getContainers();
	for( var container in containers )
	{
		var itemInfo = rapReportInfo.getItemInfo( container );
		if( itemInfo[itemName])
		{
			return itemInfo[itemName];
		}
	}
	return null;
};

DrillAction.prototype.isSelectionFilterEnabled = function() {
	var oWidget = this.getViewerWidget();
	
	if (!oWidget) {
		return false;
	}
	
	return oWidget.isSelectionFilterEnabled();
};


DrillAction.prototype.getHierarchyHasExpandedSet = function( cognosViewer, itemName )
{
	var itemInfo = this.getItemInfo( cognosViewer, itemName );
	return ( itemInfo && itemInfo.hierarchyHasExpandedMembers );
};

DrillAction.prototype.getIsRSDrillParent = function( cognosViewer, itemName )
{
	var itemInfo = this.getItemInfo( cognosViewer, itemName );
	return ( itemInfo && itemInfo.isRSDrillParent );
};

/*
 * Sets m_bUseReportInfoSelection flag
 */
DrillAction.prototype.setUseReportInfoSelection = function( bFlag )
{
	this.m_bUseReportInfoSelection = bFlag;
}

/*
 * returns m_bUseReportInfoSelection flag
 */
DrillAction.prototype.useReportInfoSelection = function()
{
	return this.m_bUseReportInfoSelection;
}

/*
 * parses input object and populates m_aDrillSelectedObjects array.
 */
DrillAction.prototype.parseDrillSpecObjectsWithReportInfo = function( aDrillSpecObjects )
{
	try
	{
		var oReportInfo = this.m_oCV.getRAPReportInfo();
		if(!oReportInfo){
			return null;
		}

		this.m_drillSpec = "";
		this.m_aDrillSelectedObjects = [];

		for(var i in aDrillSpecObjects) {
			this.populateSelectObjectWithReportInfo(aDrillSpecObjects[i], oReportInfo );
		}
	}
	catch( e )
	{
		return false;
	}

	return( this.m_aDrillSelectedObjects.length > 0 );
};

/*
 * Creates an object with enough infomation to create Lean-selection and
 * adds the object to m_aDrillSelectedObjects array.
 *
 * The object has all the fields from returned object of getItemDetails and the drill-spec object
 * obj = {
 * 	item,
 * 	hun,
 *	lid,
 * 	queryName,
 * 	mun,
 * 	lun,
 *  displayValue,
 * 	isMeasure,
 * 	onSummary
 * }

 */
DrillAction.prototype.populateSelectObjectWithReportInfo = function(oSpec, oReportInfo)
{

	var oItemDetails = oReportInfo.getItemDetails(oSpec.dataItem, oSpec.hun);
	if (!oItemDetails) {
		oItemDetails = oReportInfo.getItemDetailsByHun(oSpec.hun);
		if (!oItemDetails) {
			return null;
		}
	}

	if (oSpec.mun) {
		oItemDetails.mun = oSpec.mun;
	}

	if (oSpec.lun) {
		oItemDetails.lun = oSpec.lun;
	}
	if (oSpec.displayValue) {
		oItemDetails.displayValue = oSpec.displayValue;
	}

	if (oSpec.isMeasure === "true") {
		oItemDetails.isMeasure = true;
	}

	if (oSpec.summary === "true") {
		oItemDetails.onSummary = true;
	}

	this.m_aDrillSelectedObjects.push(oItemDetails);
};

/*
 * Override
 */
DrillAction.prototype.getSelectionContext = function()
{
	if (this.useReportInfoSelection() ) {
		return this.genLeanSelection();
	} else {
		return CognosViewerAction.prototype.getSelectionContext.call(this);
	}

};

/*
 * Returns string representing selectedCell elements.
 * m_aDrillSelectedObjects array is used as source of selected cells.
 */
DrillAction.prototype.genLeanSelection = function()
{

	if (this.m_aDrillSelectedObjects.length ==0) {
		return "";
	}

	var sSelection = "";
	for (var idx in this.m_aDrillSelectedObjects) {
		var obj = this.m_aDrillSelectedObjects[idx];
		/*
		 * Fields of obj: queryName, hun, lun, mun, displayValue, lid, and onSummary
		 */
		sSelection += "<selectedCell>";
		sSelection += (
			"<name>" + obj.item + "</name>" +
			"<display>" + obj.displayValue + "</display>" +
			"<rapLayoutTag>" + obj.lid + "</rapLayoutTag>" +
			"<queryName>" + obj.queryName + "</queryName>"
			);

		if (obj.mun) {
			sSelection += ("<nodeUse>" + obj.mun + "</nodeUse>");
			sSelection += ("<nodeType>memberUniqueName</nodeType>");
		}
		if (obj.hun) {
			sSelection += ("<nodeHierarchyUniqueName>" + obj.hun + "</nodeHierarchyUniqueName>");
		}

		var sUsage = (obj.isMeasure)? "measure" : "nonMeasure";
		sSelection += ("<nodeUsage>" + sUsage + "</nodeUsage>");
		sSelection += "</selectedCell>";
	}

	return ("<selection>" + sSelection + "</selection>");
};

/*
 * Overrride
 * This function is used in AddActionContexts, i.e <reportActions>
 *
 * If widget is not visible, we want <reportActions runReport=false>
 */
DrillAction.prototype.runReport = function()
{
	if (this.getViewerWidget()) {
		return this.getViewerWidget().shouldReportBeRunOnAction()
	}
	else {
		return true;
	}
};

/*
 * Override
 *
 * Enables Queuing if widget is not visible
 */
DrillAction.prototype.canBeQueued = function()
{
	if (this.getViewerWidget()) {
		return !(this.getViewerWidget().isVisible());
	}
	else {
		return false;
	}
};

