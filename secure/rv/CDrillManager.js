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
CDrillManager -- shared class between Query Studio and Report Viewer, which handles drill up/down and drill through
*/

function CtxArrayPlaceHolder(){}

var self = window;
// CDrillManager constructor
function CDrillManager(oCV)
{
	this.m_drawDrillTargets = false;

	this.setCV(oCV);
}

CDrillManager.prototype = new CViewerHelper();

CDrillManager.prototype.getSelectionController = function()
{
	var selectionController;
	try
	{
		selectionController = getCognosViewerSCObjectRef(this.getCV().getId());
	}
	catch(e)
	{
		selectionController = null;
	}

	return selectionController;
};

CDrillManager.prototype.getSelectedObject = function()
{
	var selectionController = this.getSelectionController();
	if(selectionController == null)
	{
		return null;
	}

	var SelObj = null;
	var selectionList = null;

	if (selectionController.hasSelectedChartNodes()) {
		selectionList = selectionController.getSelectedChartNodes();
	} else {
		selectionList = selectionController.getSelections();
	}
	if(selectionList && selectionList.length == 1) {
		SelObj = selectionList[0];
	}
	return SelObj;
};


/***************************************************************************************************

COMMON METHODS BETWEEN REPORT VIEWER AND QUERY STUDIO

****************************************************************************************************/

CDrillManager.prototype.canDrillUp = function()
{
	if(this.getDrillOption('drillUp') == true && this.hasMuns()) {
		return true;
	}

	return false;
};

CDrillManager.prototype.canDrillDown = function()
{
	if(this.getDrillOption('drillDown') == true)
	{
		return true;
	}

	return false;
};

CDrillManager.prototype.hasMuns = function(selectionObj)
{

	// if no selection object is passed in, get the current selected object from the selection controller
	if(typeof selectionObj == "undefined") {
		selectionObj = this.getSelectedObject();
	}

	if(selectionObj == null) {
		return false;
	}

	var munArray = selectionObj.getMuns();

	var muns="";
	for(var munIdx = 0; munIdx < munArray.length && muns == ""; ++munIdx)
	{
		if(typeof munArray[munIdx][0] != "undefined") {
			muns += munArray[munIdx][0];
		}
	}

	return (muns != "");
};

CDrillManager.prototype.getRefQuery = function()
{
	var refQuery = "";

	var selectionObj = this.getSelectedObject();
	if(selectionObj == null) {
		return "";
	}

	var refQueries = selectionObj.getRefQueries();
	// for area charts, having a ctx of ::1:: is valid, so look for the first non empty refQuery
	for (var i=0; i < refQueries.length; i++) {
		if (refQueries[i] != null) {
			for (var j=0; j < refQueries[i].length; j++) {
				if (refQueries[i][j] != null && refQueries[i][j] != "") {
					return refQueries[i][j];
				}
			}
		}
	}

	return refQuery;
};

CDrillManager.prototype.isIsolated = function()
{
	var selectionController = this.getSelectionController();
	if(selectionController == null || selectionController.getDrillUpDownEnabled() == false)
	{
		return false;
	}

	var selectionObj = this.getSelectedObject();
	if(selectionObj == null)
	{
		return false;
	}

	if(selectionObj instanceof CSelectionChartObject && selectionController != null)
	{
		var chartArea = selectionObj.getArea();
		if(chartArea != null)
		{
			var isolated = chartArea.getAttribute("isolated");
			if(typeof isolated != "undefined" && isolated != null && isolated == "true")
			{
				return true;
			}
		}
	}
	else
	{
		var cellRef = selectionObj.getCellRef();
		if(typeof cellRef == "object" && cellRef != null)
		{
			var spanElement = cellRef.getElementsByTagName("span");
			if(spanElement != null && typeof spanElement != "undefined" && spanElement.length > 0)
			{
				var sIsolated = spanElement[0].getAttribute("isolated");
				if(sIsolated != null && sIsolated != "undefined" && sIsolated == "true")
				{
					return true;
				}
			}
		}
	}

	return false;
};

CDrillManager.prototype.getDrillOption = function(drillOption)
{
	var selectionController = this.getSelectionController();
	if(selectionController == null || selectionController.getDrillUpDownEnabled() == false || typeof drillOption == "undefined")
	{
		return false;
	}

	var selectionObj = this.getSelectedObject();
	if(selectionObj == null)
	{
		return false;
	}

	if (this.isIsolated())
	{
		if (drillOption == "drillDown")
		{
			return false;
		}
		else if (drillOption == "drillUp")
		{
			return true;
		}
	}

	if(drillOption == "drillDown")
	{
		if(selectionObj instanceof CSelectionChartObject && selectionController != null)
		{
			var chartArea = selectionObj.getArea();
			if(chartArea != null)
			{
				var bIsChartTitle = chartArea.getAttribute("isChartTitle");
				if (typeof bIsChartTitle != "undefined" && bIsChartTitle != null && bIsChartTitle == "true")
				{
					return false;
				}
			}
		}
	}

	var drillOptions = selectionObj.getDrillOptions();
	
	//Normally, look at the level closest to the data to determine if you can drill up or down on a particular node or cell.
	//But...when the drill submenu is enabled, return true if you can drill up/down on upper levels as well...because all items are in the menu.
	var processAllLevels = (typeof DrillContextMenuHelper !== "undefined" && DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV));

	for(var idx = 0; idx < drillOptions.length; ++idx)
	{
		var maxLevel=(processAllLevels) ? drillOptions[idx].length : 1;
		for (var level = 0; level < maxLevel; ++level) {
			var currentDrillOption = drillOptions[idx][level];
			if(currentDrillOption == "3" /*drill up and down*/)
			{
				return true;
			}
			else if(drillOption == "drillUp" && currentDrillOption == "1")
			{
				return true;
			}
			else if(drillOption == "drillDown" && currentDrillOption == "2")
			{
				return true;
			}
		}
	}

	// if the drill option flag is not present, the user cannot drill on this cell
	return false;
};

CDrillManager.prototype.canDrillThrough = function()
{
	var selectionController = this.getSelectionController();
	if(selectionController == null || selectionController.getModelDrillThroughEnabled() == false)
	{
		return false;
	}

	return true;
};

/**
 * Returns true if we did a drill up/down action
 */
CDrillManager.prototype.singleClickDrillEvent = function(evt, app)
{
	var selectionController = this.getSelectionController();

	if (selectionController != null)
	{
		if(this.getCV().bCanUseCognosViewerSelection == true)
		{
			selectionController.pageClicked(evt);
		}
	}

	var node = getCrossBrowserNode(evt);;

	try
	{
		if(node.className && node.className.indexOf("dl") == 0)
		{
			if(this.canDrillDown())
			{
				this.singleClickDrillDown(evt, app);
				return true;
			}
			else if(this.canDrillUp())
			{
				this.singleClickDrillUp(evt, app);
				return true;
			}
		}
	}
	catch (e)
	{
	}

	if(app == 'RV')
	{
		return this.getDrillThroughParameters('execute', evt);
	}

	return false;
};

CDrillManager.prototype.singleClickDrillDown = function(evt, app /*either 'qs' or 'rv'*/)
{
	if(app == 'QS') {
		this.qsDrillDown();
	}
	else {
		this.rvDrillDown();
	}
};

CDrillManager.prototype.singleClickDrillUp = function(evt, app /*either 'QS' or 'RV'*/)
{
	if(app == 'QS') {
		this.qsDrillUp();
	}
	else {
		this.rvDrillUp();
	}
};

CDrillManager.prototype.getDrillParameters = function(drillType, includeMetadata, bIsSyncDrill, userSelectedDrillItem)
{
	var drillParamsArray = [];

	var selectionObj = this.getSelectedObject();
	if(selectionObj == null) {
		return drillParamsArray; // return an empty array
	}

	if(typeof includeMetadata == "undefined")
	{
		includeMetadata = true;
	}

	var dataItemsArray = selectionObj.getDataItems();
	var munArray = selectionObj.getMuns();
	var lunArray = selectionObj.getDimensionalItems("lun");
	var hunArray = selectionObj.getDimensionalItems("hun");
	var drillOptions = selectionObj.getDrillOptions();

	if(typeof dataItemsArray == "undefined" || typeof munArray == "undefined" || typeof drillOptions == "undefined" || munArray == null || dataItemsArray == null || drillOptions == null) {
		return drillParamsArray; // return an empty array
	}

	if(munArray.length != dataItemsArray.length) {
		return drillParamsArray; // return an empty array
	}

	var num_of_items = munArray.length;
	for(var item_idx = 0; item_idx < num_of_items; ++item_idx) {
		if(dataItemsArray[item_idx].length != 0) {
			var iLevel=(userSelectedDrillItem) ? this.findUserSelectedDrillItem(userSelectedDrillItem, dataItemsArray[item_idx]) 
											   : 0;
			if (iLevel<0) {
				continue;
			}
			
			if( (bIsSyncDrill === true) || this.getDrillOption(drillType))
			{
				if(munArray[item_idx][iLevel] == "" || drillParamsArray.toString().indexOf(munArray[item_idx][iLevel],0) == -1) {
					drillParamsArray[drillParamsArray.length] = dataItemsArray[item_idx][iLevel];
					drillParamsArray[drillParamsArray.length] = munArray[item_idx][iLevel];

					if(includeMetadata === true)
					{
						drillParamsArray[drillParamsArray.length] = lunArray[item_idx][iLevel];
						drillParamsArray[drillParamsArray.length] = hunArray[item_idx][iLevel];
					}
				}
			}
		}
	}

	return drillParamsArray;
};

/**
 * return the level within a list of data items where an item matching the userSelectedDrillItem was found.
 * return -1 if not found.
 */
CDrillManager.prototype.findUserSelectedDrillItem = function(userSelectedDrillItem, dimDataItems) {
	for (var iLevel=0; iLevel<dimDataItems.length; ++iLevel) {
		if (userSelectedDrillItem==dimDataItems[iLevel]) {
			return iLevel;
		}
	}
	return -1;	//Not found...
};

CDrillManager.prototype.getModelDrillThroughContext = function(XMLBuilderLocation)
{
	var modelDrillContext="";

	if(this.canDrillThrough() === true)
	{
		if(typeof gUseNewSelectionContext == "undefined")
		{
			var modelPath = "";
			if(typeof getConfigFrame != "undefined")
			{
				modelPath = decodeURIComponent(getConfigFrame().cfgGet("PackageBase"));
			}
			else if(this.getCV().getModelPath() !== "")
			{
				modelPath = this.getCV().getModelPath();
			}

			modelDrillContext = getViewerSelectionContext(this.getSelectionController(), new CSelectionContext(modelPath));
		}
		else
		{
			var parameterValues = new CParameterValues();

			var selectionController = this.getSelectionController();

			if(selectionController) {

				var selectionList = selectionController.getAllSelectedObjects();

				for(var sel_idx = 0; sel_idx < selectionList.length; ++ sel_idx) {
					var selectionObj = selectionList[sel_idx];

					var munArray = selectionObj.getMuns();
					var metaDataItems = selectionObj.getMetadataItems();
					var useValues = selectionObj.getUseValues();
					for(var context_idx = 0; context_idx < metaDataItems.length; ++context_idx) {
						for(var idx = 0; idx < metaDataItems[context_idx].length; ++idx) {

							if(metaDataItems[context_idx][idx] == null || metaDataItems[context_idx][idx] == "") {
								continue;
							}

							var name = metaDataItems[context_idx][idx];
							var useValue;

							// if we have a mun, set it as the use value, otherwise use the useValue we have stored
							if(munArray[context_idx][idx] != null && munArray[context_idx][idx] != "") {
								useValue = munArray[context_idx][idx];
							}
							else {
								useValue = useValues[context_idx][idx];
							}

							// set the display value to what we have stored as the use value
							var displayValue = useValues[context_idx][idx];
							parameterValues.addSimpleParmValueItem(name, useValue, displayValue, "true");
						}
					}
				}
			}

			var contextElement = XMLBuilderLocation.XMLBuilderCreateXMLDocument("context");
			modelDrillContext = parameterValues.generateXML(XMLBuilderLocation, contextElement);
		}

	}

	return modelDrillContext;
};

/***************************************************************************************************

REPORT VIEWER SPECIFIC METHODS

****************************************************************************************************/

CDrillManager.prototype.rvDrillUp = function(payload)
{
	this.getCV().executeAction("DrillUp", payload);
};

CDrillManager.prototype.rvDrillDown = function(payload)
{
	this.getCV().executeAction("DrillDown", payload);
};

CDrillManager.prototype.rvBuildXMLDrillParameters = function(drillType, userSelectedDrillItem)
{
	var drillParamsArray = this.getDrillParameters(drillType, true, false /*bIsSyncDrill*/, userSelectedDrillItem);
	if(drillParamsArray.length == 0)
	{
		// handle the error
		return drillParams;   // TODO: drillParams ?? It does not exists here.
	}

	return this.buildDrillParametersSpecification(drillParamsArray);
};

CDrillManager.prototype.buildDrillParametersSpecification = function(drillParamsArray)
{
	var drillParams = '<DrillParameters>';

	var idx = 0;
	while(idx < drillParamsArray.length) {
		drillParams += '<DrillGroup>';
		drillParams += '<DataItem>';
		drillParams += sXmlEncode(drillParamsArray[idx++]);
		drillParams += '</DataItem>';
		drillParams += '<MUN>';
		drillParams += sXmlEncode(drillParamsArray[idx++]);
		drillParams += '</MUN>';
		drillParams += '<LUN>';
		drillParams += sXmlEncode(drillParamsArray[idx++]);
		drillParams += '</LUN>';
		drillParams += '<HUN>';
		drillParams += sXmlEncode(drillParamsArray[idx++]);
		drillParams += '</HUN>';
		drillParams += '</DrillGroup>';
	}

	drillParams += '</DrillParameters>';

	return drillParams;

};

CDrillManager.prototype.getAuthoredDrillsForCurrentSelection = function() 
{
	var sResult = null;
	// get the report authored drills
	var aReportAuthoredDrills = this.getAuthoredDrillThroughTargets();
	if(aReportAuthoredDrills.length > 0)
	{

		var sAuthoredDrillThroughTargets = "<AuthoredDrillTargets>";

		for(var iIndex = 0; iIndex < aReportAuthoredDrills.length; ++iIndex)
		{
			sAuthoredDrillThroughTargets +=  eval('"' + aReportAuthoredDrills[iIndex] + '"');
		}

		sAuthoredDrillThroughTargets += "</AuthoredDrillTargets>";

		var cv = this.getCV();
		var authoredDrillAction = cv.getAction("AuthoredDrill");

		var drillTargetSpecifications = cv.getDrillTargets();
		if(drillTargetSpecifications.length > 0)
		{
			sResult = authoredDrillAction.getAuthoredDrillThroughContext(sAuthoredDrillThroughTargets, drillTargetSpecifications);
		}
	}	
	
	return sResult;
};

CDrillManager.prototype.getAuthoredDrillsForGotoPage = function()
{
	var sResult = "";
	var rvDrillTargetsNode = this.getAuthoredDrillsForCurrentSelection();
	if (rvDrillTargetsNode) {
		sResult = XMLBuilderSerializeNode(rvDrillTargetsNode);
	}
	
	return sResult;
};

CDrillManager.prototype.launchGoToPage = function(drillTargets, bDirectLaunch)
{
	var selectionController = this.getSelectionController();
	if((selectionController != null && selectionController.getModelDrillThroughEnabled() == true) || (typeof drillTargets != "undefined" && drillTargets != null && drillTargets != ""))
	{
		// get the authored drills
		var sAuthoredDrills = this.getAuthoredDrillsForGotoPage();

		// build up the model drill context
		var modelDrillContext = this.getModelDrillThroughContext(self);

		var form = document.getElementById("drillForm");
		if(form != null) {
			document.body.removeChild(form);
		}

		form = document.createElement("form");

		var cvid = this.getCVId();
		var warpForm = document.forms["formWarpRequest" + cvid];


		form.setAttribute("id", "drillForm");
		form.setAttribute("name", "drillForm");
		form.setAttribute("target", warpForm.getAttribute("target"));
		form.setAttribute("method", "post");
		form.setAttribute("action", warpForm.getAttribute("action"));
		form.style.display = "none";

		document.body.appendChild(form);

		if(this.getCV().getModelPath() !== "")
		{
			form.appendChild(createHiddenFormField("modelPath", this.getCV().getModelPath()));
		}

		if(typeof warpForm["ui.object"] != "undefined" && warpForm["ui.object"].value != "")
		{
			form.appendChild(createFormField("drillSource", warpForm["ui.object"].value));
		}
		else if(typeof this.getCV().envParams["ui.spec"] != "undefined")
		{
			form.appendChild(createFormField("sourceSpecification", this.getCV().envParams["ui.spec"]));
		}

		if(sAuthoredDrills != "")
		{
			form.appendChild(createHiddenFormField("m", "portal/drillthrough.xts"));
			form.appendChild(createFormField("invokeGotoPage", "true"));
			form.appendChild(createFormField("m", "portal/drillthrough.xts"));
			form.appendChild(createFormField("modelDrillEnabled", selectionController.getModelDrillThroughEnabled()));

			if(typeof gUseNewSelectionContext == "undefined")
			{
				form.appendChild(createFormField("newSelectionContext", "true"));
			}
		}
		else
		{
			if(typeof gUseNewSelectionContext == "undefined")
			{
				form.appendChild(createHiddenFormField("m", "portal/goto2.xts"));
			}
			else
			{
				form.appendChild(createHiddenFormField("m", "portal/goto.xts"));
			}
		}

		form.appendChild(createHiddenFormField("b_action", "xts.run"));
		form.appendChild(createHiddenFormField("drillTargets", sAuthoredDrills));

		if(typeof gUseNewSelectionContext == "undefined")
		{
			form.appendChild(createHiddenFormField("drillContext", modelDrillContext));
		}
		else
		{
			form.appendChild(createHiddenFormField("modeledDrillthru", modelDrillContext));
		}

		form.appendChild(createHiddenFormField("errURL", "javascript:window.close();"));


		if(typeof bDirectLaunch != "undefined" && bDirectLaunch == true)
		{
			form.appendChild(this.createFormField("directLaunch", "true"));
		}

		var routingServerGroup = "";
		if(this.getCV().envParams["ui.routingServerGroup"])
		{
			routingServerGroup = this.getCV().envParams["ui.routingServerGroup"];
		}
		form.appendChild(createHiddenFormField("ui.routingServerGroup", routingServerGroup));


		if(this.getCV().getExecutionParameters() != "") {
			form.appendChild(createHiddenFormField("encExecutionParameters", this.getCV().getExecutionParameters()));
		}

		if(warpForm.lang && warpForm.lang.value != "")
		{
			form.appendChild(createHiddenFormField("lang", warpForm.lang.value));
		}

		if (!this.getCV() || !this.getCV().launchGotoPageForIWidgetMobile(drillForm)) {
			if (typeof this.getCV().launchGotoPage === "function") {
				this.getCV().launchGotoPage(form);
			}
			else {
				var target = "winNAT_" + ( new Date() ).getTime();
				var sPath = this.getCV().getWebContentRoot() + "/rv/blankDrillWin.html?cv.id=" + cvid;
				
				window.open(sPath, target, "toolbar,location,status,menubar,resizable,scrollbars=1");
				form.target = target;
			}
		}
	}
};

CDrillManager.prototype.buildSearchPageXML = function(XMLBuilderLocation, pkg, model, ctxArr, defMeasArr, dataSpecification, filtArr)
{
	var cognosSearchElement = null;
	if (typeof XMLBuilderLocation.XMLElement == "function")
	{
		cognosSearchElement = XMLBuilderLocation.XMLBuilderCreateXMLDocument("cognosSearch");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(cognosSearchElement.documentElement, "xmlns:cs", "http://developer.cognos.com/schemas/cs/1/");
		var packageElement = cognosSearchElement.createElement("package");
		if (typeof pkg == "string" && pkg !== "")
		{
			packageElement.appendChild(cognosSearchElement.createTextNode(pkg));
		}
		cognosSearchElement.documentElement.appendChild(packageElement);
		var modelElement = cognosSearchElement.createElement("model");
		if (typeof model == "string" && model !== "")
		{
			modelElement.appendChild(cognosSearchElement.createTextNode(model));
		}
		cognosSearchElement.documentElement.appendChild(modelElement);
		var selectedContextElement = cognosSearchElement.createElement("selectedContext");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "xmlns:xs", "http://www.w3.org/2001/XMLSchema");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "xmlns:bus", "http://developer.cognos.com/schemas/bibus/3/");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "SOAP-ENC:arrayType", "bus:parameterValue[]", "http://schemas.xmlsoap.org/soap/encoding/");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
		cognosSearchElement.documentElement.appendChild(selectedContextElement);
		for (var idxCtx in ctxArr)
		{
			var itemElement = cognosSearchElement.createElement("item");
			XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(itemElement, "xsi:type", "bus:parameterValue", "http://www.w3.org/2001/XMLSchema-instance");
			var busNameElement = XMLBuilderLocation.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:name", cognosSearchElement);
			XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busNameElement, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
			busNameElement.appendChild(cognosSearchElement.createTextNode(ctxArr[idxCtx].name));
			var busValueElement = XMLBuilderLocation.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:value", cognosSearchElement);
			XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busValueElement, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
			XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busValueElement, "SOAP-ENC:arrayType", "bus:parmValueItem[]", "http://schemas.xmlsoap.org/soap/encoding/");
			for (var j = 0; j < ctxArr[idxCtx].values.length; j++)
			{
				var itemChildElement = cognosSearchElement.createElement("item");
				XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(itemChildElement, "xsi:type", "bus:simpleParmValueItem", "http://www.w3.org/2001/XMLSchema-instance");
				var busUseElement = XMLBuilderLocation.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:use", cognosSearchElement);
				XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busUseElement, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
				busUseElement.appendChild(cognosSearchElement.createTextNode(ctxArr[idxCtx].values[j][0]));
				var busDisplayElement = XMLBuilderLocation.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:display", cognosSearchElement);
				XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busDisplayElement, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
				var nodeValue = ctxArr[idxCtx].values[j][1] == null ? "" : ctxArr[idxCtx].values[j][1];
				busDisplayElement.appendChild(cognosSearchElement.createTextNode(nodeValue));
				itemChildElement.appendChild(busUseElement);
				itemChildElement.appendChild(busDisplayElement);
				busValueElement.appendChild(itemChildElement);
			}
			itemElement.appendChild(busNameElement);
			itemElement.appendChild(busValueElement);
			selectedContextElement.appendChild(itemElement);
		}

		var defaultMeasureElement = cognosSearchElement.createElement("defaultMeasure");
		cognosSearchElement.documentElement.appendChild(defaultMeasureElement);

		dataSpecification.buildXML(XMLBuilderLocation, cognosSearchElement, "data");

		var filterElement = cognosSearchElement.createElement("filter");
		cognosSearchElement.documentElement.appendChild(filterElement);
	}

	return cognosSearchElement;
};

CDrillManager.prototype.openSearchPage = function(objPath, sourceContext)
{
	// build up the model drill context
	this.getModelDrillThroughContext(self);

	var searchForm = document.getElementById("searchPage");
	if(searchForm != null) {
		document.body.removeChild(searchForm);
	}

	searchForm = document.createElement("form");

	searchForm.setAttribute("id", "searchPage");
	searchForm.setAttribute("name", "searchPage");
	searchForm.setAttribute("method", "post");
	searchForm.setAttribute("target", searchForm.name);
	searchForm.setAttribute("action", this.getCV().getGateway() + "/gosearch");
	searchForm.style.display = "none";

	document.body.appendChild(searchForm);

	searchForm.appendChild(createHiddenFormField("csn.action", "search"));
	searchForm.appendChild(createHiddenFormField("csn.drill", sourceContext));

	var __search_win = window.open("", searchForm.name, "directories=no,location=no,status=no,toolbar=no,resizable=yes,scrollbars=yes,top=100,left=100,height=480,width=640" );
	__search_win.focus();
	searchForm.submit();
};

CDrillManager.prototype.launchSearchPage = function()
{
	var selCon = this.getSelectionController();
	var warpForm = document.forms["formWarpRequest" + this.getCVId()];
	var ctxArr = this.determineSelectionsForSearchPage(selCon);
	var dataSpecification = this.getSearchContextDataSpecfication(selCon);
	var spXML = this.buildSearchPageXML(self, warpForm.packageBase.value, this.getCV().getModelPath(), ctxArr, [], dataSpecification, []);
	this.openSearchPage(warpForm.packageBase.value, XMLBuilderSerializeNode(spXML));
};

/***************************************************************************************************

QUERY STUDIO SPECIFIC METHODS

****************************************************************************************************/

CDrillManager.prototype.qsDrillDown = function()
{
	if(!this.canDrillDown()) {
		// throw up a a generic error page (for now)
		getConfigFrame().dlgGenericSelectionMessage(false);
		return;
	}

	// build the drill down command
	var drillCommand = 'DD:';
	this.qsSendDrillCommand(drillCommand);
};

CDrillManager.prototype.qsDrillUp = function()
{
	if(!this.canDrillUp()) {
		// throw up a a generic error page (for now)
		getConfigFrame().dlgGenericSelectionMessage(false);
		return;
	}

	// build the drill up command
	var drillCommand = 'DU:';
	this.qsSendDrillCommand(drillCommand);
};

CDrillManager.prototype.qsSendDrillCommand = function(drillCommand)
{
	var drillType;
	if(drillCommand == "DU:") {
		drillType = "drillUp";
	}
	else {
		drillType = "drillDown";
	}

	var drillParamsArray = this.getDrillParameters(drillType, false, false /*bIsSyncDrill*/);
	if(drillParamsArray.length == 0){
		// throw up a a generic error page (for now)
		getConfigFrame().dlgGenericSelectionMessage(false);
		return;
	}
	for(var idx = 0; idx < drillParamsArray.length; ++idx) {
		drillCommand += getConfigFrame().escapeParam(drillParamsArray[idx]);
		if(idx+1 < drillParamsArray.length) {
			drillCommand += ',';
		}
	}

	getConfigFrame().sendCmd(drillCommand, "", true);
};

CDrillManager.prototype.qsLaunchGoToPage = function(bDirectLaunch)
{
	var selectionController = this.getSelectionController();
	if(selectionController != null && selectionController.getModelDrillThroughEnabled() == true)
	{
		// build up the model drill context
		var modelDrillContext = this.getModelDrillThroughContext(cf);

		if(modelDrillContext=="") {
			// throw up a a generic error page (for now)
			getConfigFrame().dlgGenericSelectionMessage(false);
			return;
		}

		var gotoForm = document.getElementById("gotoPage");
		if(gotoForm != null) {
			document.body.removeChild(gotoForm);
		}

		gotoForm = document.createElement("form");

		gotoForm.setAttribute("id", "gotoPage");
		gotoForm.setAttribute("name", "gotoPage");
		gotoForm.setAttribute("method", "post");
		gotoForm.style.display = "none";

		document.body.appendChild(gotoForm);

		var configFrame = getConfigFrame();
		gotoForm.appendChild(this.createFormField("objpath", decodeURIComponent(configFrame.cfgGet("PackageBase"))));

		if(typeof gUseNewSelectionContext == "undefined")
		{
			gotoForm.appendChild(this.createFormField("m", "portal/goto2.xts"));
		}
		else
		{
			gotoForm.appendChild(this.createFormField("m", "portal/goto.xts"));
		}

		gotoForm.appendChild(this.createFormField("b_action", "xts.run"));

		if(typeof gUseNewSelectionContext == "undefined")
		{
			gotoForm.appendChild(this.createFormField("drillContext", modelDrillContext));
		}
		else
		{
			gotoForm.appendChild(this.createFormField("modeledDrillthru", modelDrillContext));
		}

		if (typeof getConfigFrame().routingServerGroup != "undefined")
		{
			gotoForm.appendChild(this.createFormField("ui.routingServerGroup", getConfigFrame().routingServerGroup));
		}

		if(typeof bDirectLaunch != "undefined" && bDirectLaunch == true)
		{
			gotoForm.appendChild(this.createFormField("directLaunch", "true"));
		}

		var executionParameters = configFrame.goApplicationManager.getReportManager().getParameterManager().getExecutionParameters();
		if (executionParameters)
		{
			gotoForm.appendChild(this.createFormField("encExecutionParameters", executionParameters));
		}

		var target = "winNAT_" + ( new Date() ).getTime();
		var sPath = this.getCV().getWebContentRoot() + "/rv/blankDrillWin.html?cv.id=" + this.getCVId();

		window.open(sPath, target, "toolbar,location,status,menubar,resizable,scrollbars=1");
		gotoForm.target = target;
	}
};

CDrillManager.prototype.qsLaunchSearchPage = function()
{
	var cf = getConfigFrame();
	var selCon = goWindowManager.getSelectionController();
	var ctxArr = this.determineSelectionsForSearchPage(selCon);
	var dataSpecification = this.getSearchContextDataSpecfication(selCon);
	var pkgBase = decodeURIComponent(cf.cfgGet("PackageBase"));
	var spXML = this.buildSearchPageXML(cf, pkgBase, decodeURIComponent(cf.cfgGet("cmLastModel")), ctxArr, [], dataSpecification, []);
	this.openSearchPage(pkgBase, cf.XMLBuilderSerializeNode(spXML));
};

CDrillManager.prototype.determineSelectionsForSearchPage = function(selectionController)
{
	var ctxArr = new CtxArrayPlaceHolder();
	var allSelections = selectionController.getAllSelectedObjects();
	for (var i = 0; i < allSelections.length; i++)
	{
		var colName = allSelections[i].getColumnName();
		if (!this.containsByIndiceInArray(ctxArr, colName))
		{
			ctxArr[colName] = {};
			ctxArr[colName].name = colName;
			ctxArr[colName].values = [];
		}
		var idx0 = "";

		var muns = allSelections[i].getMuns();
		if (muns != null && muns.length > 0)
		{
			idx0 = muns[0][0];
		}
		var idx1 = allSelections[i].getDisplayValues()[0];
		if (!(this.containsInArray(ctxArr[colName].values, 0, idx0) && this.containsInArray(ctxArr[colName].values, 1, idx1))) {
			ctxArr[colName].values[ctxArr[colName].values.length] = [idx0, idx1];
		}
	}
	return ctxArr;
};

CDrillManager.prototype.getSearchContextDataSpecfication = function(selectionController)
{
	var parameterValues = new CParameterValues();
	var dataManager = selectionController.getCCDManager();
	var contextData = dataManager.m_cd;

	for(var ctxId in contextData)
	{
		var sUsage = dataManager.GetUsage(ctxId);
		if(sUsage != "2" /*2==MEASURE*/)
		{
			var sRefDataItem = dataManager.GetRDIValue(ctxId);
			var sUseValue = dataManager.GetDisplayValue(ctxId);
			parameterValues.addSimpleParmValueItem(sRefDataItem, sRefDataItem, sUseValue, "true");
		}
	}

	return parameterValues;
};

CDrillManager.prototype.containsByIndiceInArray = function(a, v)
{
	for (var i in a)
	{
		if (i == v) {
			return true;
		}
	}
	return false;
};

CDrillManager.prototype.containsInArray = function(a, idx, v)
{
	for (var i in a)
	{
		if (a[i][idx] == v) {
			return true;
		}
	}
	return false;
};

// temp function for now
CDrillManager.prototype.createFormField = function(name, value)
{
	var formField = document.createElement("input");
	formField.setAttribute("type", "hidden");
	formField.setAttribute("name", name);
	formField.setAttribute("value", value);
	return(formField);
};

/***************************************************************************************************

DRILL THROUGH METHODS

****************************************************************************************************/


CDrillManager.prototype.getAuthoredDrillThroughTargets = function()
{
	var aAuthoredDrillItems = [];
	var selectionController = this.getSelectionController();
	var oHtmlItem = null;

	if(selectionController != null)
	{
		if(selectionController.getSelectedColumnIds().length == 1)
		{
			var selections = selectionController.getSelections();
			for(var selectionIndex = 0; selectionIndex < selections.length; ++selectionIndex)
			{
				var selectionObject = selections[selectionIndex];

				oHtmlItem = selectionObject.getCellRef();
				while( oHtmlItem )
				{
					if(oHtmlItem.getAttribute("dtTargets") != null)
					{
						aAuthoredDrillItems.push("<rvDrillTargets>" + oHtmlItem.getAttribute("dtTargets") + "</rvDrillTargets>");
						break;
					}

					oHtmlItem = XMLHelper_GetFirstChildElement( oHtmlItem );
				}
			}
		}
		else if(selectionController.hasSelectedChartNodes())
		{
			var chartNodes = selectionController.getSelectedChartNodes();
			var selectedChartNode = chartNodes[0];
			oHtmlItem = selectedChartNode.getArea();
			if(oHtmlItem.getAttribute("dtTargets") != null)
			{
				aAuthoredDrillItems.push("<rvDrillTargets>" + oHtmlItem.getAttribute("dtTargets") + "</rvDrillTargets>");
			}
		}
		else if (selectionController.getSelectedDrillThroughImage() !=  null) {
			var imageNode = selectionController.getSelectedDrillThroughImage();
			if(imageNode && imageNode.getAttribute("dtTargets") != null) {
				aAuthoredDrillItems.push("<rvDrillTargets>" + imageNode.getAttribute("dtTargets") + "</rvDrillTargets>");
			}
			
		} else if( selectionController.getSelectDrillThroughSingleton() != null) {
			var singletonNode = selectionController.getSelectDrillThroughSingleton();
			if(singletonNode && singletonNode.getAttribute("dtTargets") != null) {
				aAuthoredDrillItems.push("<rvDrillTargets>" + singletonNode.getAttribute("dtTargets") + "</rvDrillTargets>");
			}
		}
	}

	return aAuthoredDrillItems;
};


CDrillManager.prototype.getDrillThroughParameters = function(method, evt)
{
	if(typeof method == "undefined")
	{
		method = 'query';
	}

	var aAuthoredDrillThroughTargets = [];

	if(typeof evt != "undefined")
	{
		var cellRef = getCrossBrowserNode(evt, true);

		try
		{
			while(cellRef)
			{
				if(typeof cellRef.getAttribute != "undefined" && cellRef.getAttribute("dtTargets"))
				{
					aAuthoredDrillThroughTargets.push("<rvDrillTargets>" + cellRef.getAttribute("dtTargets") + "</rvDrillTargets>");
					break;
				}

				cellRef = cellRef.parentNode;
			}
		}
		catch(e)
		{
			return false;
			// if an exception occurs, just eat it
		}
	}
	else
	{

		var oCV = this.getCV();
		var oDrillMgr = oCV.getDrillMgr();
		var selectionController = oDrillMgr.getSelectionController();

		if(selectionController != null)
		{
			var chartArea = null;
			if(selectionController.hasSelectedChartNodes())
			{
				var chartNodes = selectionController.getSelectedChartNodes();
				var selectedChartNode = chartNodes[0];
				chartArea = selectedChartNode.getArea();
			}
			if(chartArea != null)
			{
				aAuthoredDrillThroughTargets.push("<rvDrillTargets>" + chartArea.getAttribute("dtTargets") + "</rvDrillTargets>");
			}
			else
			{
				aAuthoredDrillThroughTargets = this.getAuthoredDrillThroughTargets();
			}
		}
	}

	if(aAuthoredDrillThroughTargets.length > 0)
	{
		var sAuthoredDrillThroughTargets = "<AuthoredDrillTargets>";

		for(var iIndex = 0; iIndex < aAuthoredDrillThroughTargets.length; ++iIndex)
		{
			sAuthoredDrillThroughTargets +=  eval('"' + aAuthoredDrillThroughTargets[iIndex] + '"');
		}

		sAuthoredDrillThroughTargets += "</AuthoredDrillTargets>";

		var authoredDrillAction = this.getCV().getAction("AuthoredDrill");

		if(method == "query")
		{
			authoredDrillAction.populateContextMenu(sAuthoredDrillThroughTargets);
			this.showOtherMenuItems();
		}
		else
		{
			if (this.getCV().envParams["cv.id"] == "AA")
			{
				this.getCV().m_viewerFragment.raiseAuthoredDrillClickEvent();
			}
			else
			{
				authoredDrillAction.execute(sAuthoredDrillThroughTargets);
			}
		}

		return true;
	}
	else if (method == 'query')
	{
		this.showOtherMenuItems();
		return true;
	}
	else
	{
		return false;
	}
};

CDrillManager.prototype.executeAuthoredDrill = function(drillTargetsSpecification)
{
	var unEncodedDrillTargetsSpecification = decodeURIComponent(drillTargetsSpecification);
	var authoredDrillAction = this.getCV().getAction("AuthoredDrill");
	authoredDrillAction.executeDrillTarget(unEncodedDrillTargetsSpecification);
};

CDrillManager.prototype.doesMoreExist = function(menuObj)
{
	for(var i = 0; i < menuObj.getNumItems(); i++)
	{
		var menuItem = menuObj.get(i);
		if(menuItem != null)
		{
			if((menuItem instanceof CMenuItem) && (menuItem.getLabel() == RV_RES.RV_MORE) && (menuItem.getAction() == this.getCVObjectRef() + '.getDrillMgr().launchGoToPage();')) {
				return true;
			}
		}
	}
	return false;
};

CDrillManager.prototype.showOtherMenuItems = function()
{
	// just add the more menu item
	var cv = this.getCV();
	var mainWnd = cv.rvMainWnd;
	var toolbarCtrl = mainWnd.getToolbarControl();

	var gtButton = null;
	var gtDropDownMenu = null;
	if (typeof toolbarCtrl != "undefined" && toolbarCtrl != null) {
		gtButton = toolbarCtrl.getItem("goto");
		if (gtButton)
		{
			gtDropDownMenu = gtButton.getMenu();
		}
	}

	var contextMenu = mainWnd.getContextMenu();
	var sBlackList = mainWnd.getUIHide();
	var gtContextMenu = null;
	if (typeof contextMenu != "undefined" && contextMenu != null && contextMenu.getGoToMenuItem()) {
		gtContextMenu = contextMenu.getGoToMenuItem().getMenu();
	}

	var searchMenuItem = null;
	var selectionController = this.getSelectionController();

	// there's no report authored drills, just add the more menu item
	if (gtDropDownMenu != null) {
		//Do not add another more menu item if the dropdown menu already has one
		if(this.doesMoreExist(gtDropDownMenu) == false)
		{
			if(typeof gMenuSeperator != "undefined" && gtDropDownMenu.getNumItems() > 0 && (cv.bCanUseCognosViewerIndexSearch || sBlackList.indexOf(' RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ') == -1))
			{
				gtDropDownMenu.add(gMenuSeperator);
			}

			var moreDropDownItem = new CMenuItem(gtDropDownMenu, RV_RES.RV_MORE, this.getCVObjectRef() + '.getDrillMgr().launchGoToPage();', "", gMenuItemStyle, cv.getWebContentRoot(), cv.getSkin());
//			if (cv.bCanUseCognosViewerIndexSearch) {
//				searchMenuItem = new CMenuItem(gtDropDownMenu, RV_RES.RV_SEARCH, this.getCVObjectRef() + '.getDrillMgr().launchSearchPage();', "", gMenuItemStyle, cv.getWebContentRoot(), cv.getSkin());
//			}

			if(sBlackList.indexOf(' RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ') != -1)
			{
				moreDropDownItem.hide();
			}
			else if(selectionController == null || selectionController.getModelDrillThroughEnabled() == false)
			{
				moreDropDownItem.disable();
			}
		}
	}

	if (gtContextMenu != null) {

		if(typeof gMenuSeperator != "undefined" && gtContextMenu.getNumItems() > 0 && (cv.bCanUseCognosViewerIndexSearch || sBlackList.indexOf(' RV_CONTEXT_MENU_GOTO_RELATED_LINKS ') == -1))
		{
			gtContextMenu.add(gMenuSeperator);
		}

		var moreContextMenuItem = new CMenuItem(gtContextMenu, RV_RES.RV_MORE, this.getCVObjectRef() + '.getDrillMgr().launchGoToPage();', "", gMenuItemStyle, cv.getWebContentRoot(), cv.getSkin());
//		if (cv.bCanUseCognosViewerIndexSearch) {
//			searchMenuItem = new CMenuItem(gtContextMenu, RV_RES.RV_SEARCH, this.getCVObjectRef() + '.getDrillMgr().launchSearchPage();', "", gMenuItemStyle, cv.getWebContentRoot(), cv.getSkin());
//		}

		if(sBlackList.indexOf(' RV_CONTEXT_MENU_GOTO_RELATED_LINKS ') != -1)
		{
			moreContextMenuItem.hide();
		}
		else if(selectionController == null || selectionController.getModelDrillThroughEnabled() == false)
		{
			moreContextMenuItem.disable();
		}
	}

	if (searchMenuItem != null && selectionController != null)
	{
		var allSelections = selectionController.getAllSelectedObjects();
		if (allSelections == null || allSelections.length === 0)
		{
			searchMenuItem.disable();
		}
	}

	if (gtDropDownMenu != null) {
		gtDropDownMenu.draw();
		if (gtDropDownMenu.isVisible()) {
			gtDropDownMenu.show();
		}
	}
	if (gtContextMenu != null) {
		gtContextMenu.draw();
		if (gtContextMenu.isVisible()) {
			gtContextMenu.show();
		}
	}
};

CDrillManager.prototype.ddc = function(evt) {
	var node = getNodeFromEvent(evt);
	if(node != null && node.getAttribute("ddc")!=="1") {
		// adding a 'ddc' attribute to prevent processing the same node more than once.
		node.setAttribute("ddc", "1");
		if(node.getAttribute("dtTargets")) {
			node.className = "dl " + node.className;
			node.setAttribute("href", "#");
			return;
		}
		var selectionController = this.getSelectionController();
		if(selectionController != null) {
			var selectedChartArea = selectionController.getSelectionObjectFactory().getSelectionChartObject(node);
			if(selectedChartArea != null) {
				var drillOptions = selectedChartArea.getDrillOptions();
				for(var idx = 0; idx < drillOptions.length; ++idx) {
					var currentDrillOption = drillOptions[idx][0];
					if ((node.getAttribute("isChartTitle") === "true" && currentDrillOption == "1") || currentDrillOption == "3" || currentDrillOption == "2") {
						node.className = "dl " + node.className;
						node.setAttribute("href", "#");
						break;
					}
				}
			}
		}
	}
};
