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

function ChangeDisplayTypeAction()
{
	this.m_requestParams = null;
	this.m_sAction = 'ChangeDataContainerType';
	this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES = 5;
}

//base class for change display type action
ChangeDisplayTypeAction.prototype = new ModifyReportAction();

ChangeDisplayTypeAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_CHANGE_DISPLAY;
};

ChangeDisplayTypeAction.prototype.setRequestParms = function(parms)
{
	this.m_requestParams = parms;
};

ChangeDisplayTypeAction.prototype.addActionContextAdditionalParms = function()
{
	this._cleaerPinAndFreeze();
	
	var bestVisualization = false;
	if (this.m_requestParams.bestVisualization) {
		bestVisualization = true;
	} else if (((this.m_requestParams.targetType.targetType == undefined) || 
			(this.m_requestParams.targetType.targetType == "undefined")) &&
			(this.m_requestParams.targetType.templateId == undefined))
	{
		var paramObject = eval("(" + this.m_requestParams.targetType + ")"); //from dialog.
	} else {
		var paramObject = this.m_requestParams.targetType; //from dialog.
	}	
	var canvas = this.m_oCV.getViewerWidget().findContainerDiv();
	var sWidgetSize = "";
	if (canvas) {
		sWidgetSize = "<widgetWidth>" + (parseInt(canvas.style.width, 10) -ResizeChartAction.PADDING.getWidth()) + "px</widgetWidth>" +
			"<widgetHeight>" + (parseInt(canvas.style.height, 10) - ResizeChartAction.PADDING.getHeight()) + "px</widgetHeight>";
	}

	var sActionContext = "";
	
	if (bestVisualization) {
		sActionContext += "<bestVisualization>true</bestVisualization>"
		sActionContext += this.getDataItemInfoMap();
	} else {
		sActionContext += "<target>"; 
		sActionContext += paramObject.targetType;
		sActionContext += "</target>";
		if (paramObject.templateId) {
			sActionContext += "<templateId>";
			sActionContext += ((paramObject.templateId)? paramObject.templateId : "");
			sActionContext += "</templateId>";
			sActionContext += "<variationId>"; 
			sActionContext += ((paramObject.variationId)? paramObject.variationId : "");
			sActionContext += "</variationId>";
			sActionContext += this.getDataItemInfoMap();
		}
		sActionContext += "<label>";
		sActionContext += paramObject.label;
		sActionContext += "</label>";
	}

	sActionContext += sWidgetSize;
	sActionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
	return (sActionContext);
};

ChangeDisplayTypeAction.prototype._cleaerPinAndFreeze = function() {
	var pinFreezeManager = this.m_oCV.getPinFreezeManager();
	if (pinFreezeManager) {
		var containerId = this.getContainerId(this.m_oCV.getSelectionController());
		pinFreezeManager.clearPinInfo(containerId);
	}	
};

ChangeDisplayTypeAction.prototype.updateMenu = function(jsonSpec)
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	jsonSpec.visible = (oRAPReportInfo) ? oRAPReportInfo.containsInteractiveDataContainer() : jsonSpec.visible; 
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	var reportInfo = this.getSelectedReportInfo();	
	jsonSpec.disabled = (reportInfo == null || reportInfo.displayTypeId == null || !this.isInteractiveDataContainer(reportInfo.displayTypeId));

	if (jsonSpec.disabled)
	{
		jsonSpec.iconClass = "chartTypesDisabled";
		return jsonSpec;
	}
	jsonSpec.iconClass = "chartTypes";	
	
	return this.buildDynamicMenuItem(jsonSpec, "ChangeDisplayType");

};

ChangeDisplayTypeAction.prototype.createEmptyMenuItem = function()
{
	return {name: "None", label: RV_RES.IDS_JS_CHANGE_DISPLAY_SELECT_DATA, iconClass: "", action: null, items: null };
};

ChangeDisplayTypeAction.prototype.getActionContextString = function(groupId)
{
	var actionContext = "<getInfoActions>";
	actionContext += "<getInfoAction name=\"GetInfo\">";
	actionContext += "<include><suggestedDisplayTypes/></include>";
	actionContext += this.getDataItemInfoMap();
	actionContext += "<groupId>";
	actionContext += groupId;
	actionContext += "</groupId>";
	actionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
	actionContext += "</getInfoAction>";
	actionContext += "</getInfoActions>";
	return actionContext;
};

ChangeDisplayTypeAction.prototype.fetchSuggestedDisplayTypes = function(groupId) 
{
	var oCV = this.getCognosViewer();
	var asynchRequest = new AsynchJSONDispatcherEntry(oCV);
	asynchRequest.addFormField("ui.action", "getInfoFromReportSpec");
	asynchRequest.addFormField("bux", "true");
	asynchRequest.addFormField("ui.object", oCV.envParams["ui.object"]);
	asynchRequest.addFormField("cv.actionContext", this.getActionContextString(groupId));
	asynchRequest.addDefinedFormField("ui.spec", oCV.envParams["ui.spec"]);
	asynchRequest.addNonEmptyStringFormField("modelPath", oCV.getModelPath());
	if (groupId == "undefined") {
		asynchRequest.setCallbacks({"complete" : {"object" : this, "method" : this.handleSuggestedDisplayTypesResponse}});
	} else {
		asynchRequest.setCallbacks({"complete" : {"object" : this, "method" : this.handleSuggestedDisplayVariationsResponse}});
	}
	oCV.dispatchRequest(asynchRequest);	

};

ChangeDisplayTypeAction.prototype.handleSuggestedDisplayTypesResponse = function(asynchJSONResponse)
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();

	this.addSuggestedDisplayTypesMenuItems(asynchJSONResponse.getResult());
};

ChangeDisplayTypeAction.prototype.addSuggestedDisplayTypesMenuItems = function (reportInfos)
{
	var buttonSpec = this.getCognosViewer().findToolbarItem("ChangeDisplayType");
	if (buttonSpec) {
		buttonSpec.open = false;
	}
	
	var menuItems = [];
	var reportInfo = this.getSelectedReportInfo();
	var container = undefined;
	for (var x=0; x < reportInfos.containers.length; x++)
	{
		if (reportInfo.container == reportInfos.containers[x].container)
		{
			container = reportInfos.containers[x];
			break;
		}
	}
	if (container == undefined)
	{
		return;
	}
	var nbrToDisplay = container.suggestedDisplayTypes.length <= this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES ? container.suggestedDisplayTypes.length : this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES;
	menuItems.push({title: RV_RES.IDS_JS_CHANGE_DISPLAY_RECOMMENDED});
	menuItems.push({separator: true});
	for (var i=0; i < nbrToDisplay; i++)
	{
		menuItems.push({ name: container.suggestedDisplayTypes[i].name, label: container.suggestedDisplayTypes[i].title, description: container.suggestedDisplayTypes[i].description, iconClass: container.suggestedDisplayTypes[i].iconClass, action: { name: "ChangeDisplayType", payload: {targetType: {templateId: container.suggestedDisplayTypes[i].templateId }, label: container.suggestedDisplayTypes[i].title}}, items: null });
	}
	menuItems.push({separator: true});
	menuItems.push({ name: "ChangeDisplayMore", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE, iconClass: "ChartTypeOther", action: { name: "InvokeChangeDisplayTypeDialog", payload: {}}, items: null });

	buttonSpec.open = true;
	buttonSpec.items = menuItems;

	var updateItems = [];
	updateItems.push(buttonSpec);
	this.getCognosViewer().getViewerWidget().fireEvent("com.ibm.bux.widgetchrome.toolbar.update", null, updateItems);

	return menuItems;
};

ChangeDisplayTypeAction.prototype.buildMenu = function(jsonSpec)
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	jsonSpec.visible = (oRAPReportInfo) ? oRAPReportInfo.containsInteractiveDataContainer() : jsonSpec.visible; 
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	var reportInfo = this.getSelectedReportInfo();	
	jsonSpec.disabled = (reportInfo == null || reportInfo.displayTypeId == null || !this.isInteractiveDataContainer(reportInfo.displayTypeId));
		
	if (jsonSpec.disabled)
	{
		jsonSpec.iconClass = "chartTypesDisabled";
	}
	else
	{
		jsonSpec.iconClass = "chartTypes";
		
		var enableVisCoach = this.getCognosViewer().getAdvancedServerProperty("VIEWER_JS_enableVisCoach");
		if (enableVisCoach !== 'false' && (typeof reportInfo.suggestedDisplayTypesEnabled != "undefined") && (reportInfo.suggestedDisplayTypesEnabled != null) && (reportInfo.suggestedDisplayTypesEnabled == "true"))
		{
			//toolbar menu, so generate the dynamic menu
			this.fetchSuggestedDisplayTypes("undefined");
			return this.buildDynamicMenuItem(jsonSpec, "ChangeDisplayType");
		}
		else
		{
			jsonSpec.items = [];
			var isV2 = (reportInfo.displayTypeId.match("v2_") != null || reportInfo.displayTypeId == "crosstab" || reportInfo.displayTypeId == "list");
			if(isV2)
			{
				jsonSpec.items.push({ name: "ChangeDisplayBar", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_BAR, iconClass: "ChartTypeBar", action: { name: "ChangeDisplayType", payload: {targetType: "v2_bar_rectangle_clustered" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayColumn", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_COLUMN, iconClass: "ChartTypeColumn", action: { name: "ChangeDisplayType", payload: {targetType: "v2_column_rectangle_clustered" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayLine", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LINE, iconClass: "ChartTypeLine", action: { name: "ChangeDisplayType", payload: {targetType: "v2_line_clustered_markers" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayPie", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_PIE, iconClass: "ChartTypePie", action: { name: "ChangeDisplayType", payload: {targetType: "v2_pie" }}, items: null });

				jsonSpec.items.push({ name: "ChangeDisplayCrosstab", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_CROSSTAB, iconClass: "ChartTypeCrosstab", action: { name: "ChangeDisplayType", payload: {targetType: "Crosstab" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayList", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LIST, iconClass: "ChartTypeList", action: { name: "ChangeDisplayType", payload: {targetType: "List" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayMore", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE, iconClass: "ChartTypeOther", action: { name: "InvokeChangeDisplayTypeDialog", payload: "" }, items: null });
			}
			else
			{
				jsonSpec.items.push({ name: "ChangeDisplayBar", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_BAR, iconClass: "ChartTypeBar", action: { name: "ChangeDisplayType", payload: {targetType: "bar_clustered_flat" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayColumn", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_COLUMN, iconClass: "ChartTypeColumn", action: { name: "ChangeDisplayType", payload: {targetType: "column_clustered_flat" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayLine", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LINE, iconClass: "ChartTypeLine", action: { name: "ChangeDisplayType", payload: {targetType: "line_clustered_flat_markers" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayPie", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_PIE, iconClass: "ChartTypePie", action: { name: "ChangeDisplayType", payload: {targetType: "pie_flat" }}, items: null });

				jsonSpec.items.push({ name: "ChangeDisplayCrosstab", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_CROSSTAB, iconClass: "ChartTypeCrosstab", action: { name: "ChangeDisplayType", payload: {targetType: "Crosstab" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayList", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LIST, iconClass: "ChartTypeList", action: { name: "ChangeDisplayType", payload: {targetType: "List" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayMore", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE, iconClass: "ChartTypeOther", action: { name: "InvokeChangeDisplayTypeDialog", payload: "" }, items: null });
			}
		}
		for (var i in jsonSpec.items)
		{
			jsonSpec.items[i].action.payload = { targetType: jsonSpec.items[i].action.payload };
			jsonSpec.items[i].action.payload.targetType.label = jsonSpec.items[i].label;
		}
	}

	return jsonSpec;
};

