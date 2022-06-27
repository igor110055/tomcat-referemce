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

function SnapshotsAction() {}
SnapshotsAction.prototype = new CognosViewerAction();

SnapshotsAction.prototype.updateMenu = function(jsonSpec) {
	var widget = this.m_oCV.getViewerWidget();
	jsonSpec.disabled = (widget.getAttributeValue("reportCreatedInCW") == "true") || (widget.getAttributeValue("fromReportPart") == "true") || (this.m_oCV.envParams["reportpart_id"] && this.m_oCV.envParams["reportpart_id"].length) > 0 ? true : false;
	jsonSpec.visible = !this.isPromptWidget();
	return jsonSpec;
};

SnapshotsAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	if (widget.getSavedOutputsCMResponse() == null)	{
		this.queryCMForSavedOutputs({"complete" : {"object" : this, "method" : this.handleQueryResponse}});
	} 
	else if (typeof widget.savedOutputMenuUpdated != "undefined" && widget.savedOutputMenuUpdated == false) {
		this.populateMenu(true);
		widget.savedOutputMenuUpdated = true;
	}
};

SnapshotsAction.prototype.queryCMForSavedOutputs = function(callback) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();

	var searchPath = "";
	var formWarpRequest = document.getElementById("formWarpRequest" + oCV.getId());
	if (oCV.envParams["originalReport"])
	{
		searchPath = oCV.envParams["originalReport"];
	}
	else if (formWarpRequest && formWarpRequest["reRunObj"] != null && formWarpRequest["reRunObj"].value.length > 0)
	{
		searchPath = formWarpRequest["reRunObj"].value;
	}
	else
	{
		searchPath = oCV.envParams["ui.object"];
	}
	searchPath += "/reportVersion/*[@format='HTML' or @format='XHTML']/..";

	var cmRequest =
		"<CMRequest>" +
			"<searchPath>" + xml_encode(searchPath) + "</searchPath>" +
			"<properties>" +
				"<property>searchPath</property>" +
				"<property>creationTime</property>" +
				"<property>storeID</property>" +
			"</properties>" +
			"<sortBy>" +
				"<sortItem>" +
					"<property>creationTime</property>" +
					"<order>descending</order>" +
				"</sortItem>" +
			"</sortBy>" +
		"</CMRequest>";

	var request = new DataDispatcherEntry(oCV);
	request.addFormField("ui.action", "CMRequest");
	request.addFormField("cv.responseFormat", "CMRequest");
	request.addFormField("ui.object", searchPath);
	request.addFormField("CMRequest", cmRequest);
	request.setCallbacks(callback);
	oCV.dispatchRequest(request);	
};

SnapshotsAction.prototype.setSavedOutputsCMResponse = function(response) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	
	var xmlParsedCMresponse = XMLBuilderLoadXMLFromString(response.getResult());
	widget.setSavedOutputsCMResponse(xmlParsedCMresponse);	
};

SnapshotsAction.prototype.handleQueryResponse = function(response) {
	this.setSavedOutputsCMResponse(response);
	this.populateMenu(true);
};

SnapshotsAction.prototype.canShowLiveMenuItem = function() {
	var oCV = this.getCognosViewer();
	return ( oCV.envParams["cv.responseFormat"] !== "activeReport" && (oCV.isLimitedInteractiveMode() || (oCV.envParams["cv.objectPermissions"] && oCV.envParams["cv.objectPermissions"].indexOf("execute") != -1)) );
};

SnapshotsAction.prototype.getMenuItemActionClassHandler = function() {
	var oCV = this.getCognosViewer();
	return oCV.envParams["cv.responseFormat"] === "activeReport" ? "ViewActiveReport" : "ViewSavedOutput";	
};

SnapshotsAction.prototype.populateMenu = function(bOpen) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	var sAction = oCV.envParams["ui.action"];

	var cmResponse = widget.savedOutputsCMResponse;

	var root = oCV.findBlueDotMenu();
	root.open = bOpen;
	var buttonSpec = oCV.findToolbarItem("Snapshots", root);

	var queryResult = XMLHelper_FindChildByTagName(cmResponse, "result", true);
	var queryItems = XMLHelper_FindChildrenByTagName(queryResult, "item", false);

	var menuItems = [];
	var mostRecentCreationTime = null;
	var mostRecentStoreID = null;
	var oMenuItem = null;
	var bSameAsCurrent;

	if ( this.canShowLiveMenuItem() ) {
		bSameAsCurrent = (sAction != "view" && sAction != "buxView" && oCV.getStatus() !== "fault");

		oMenuItem = { name: "live", label: RV_RES.IDS_JS_SNAPSHOTS_LIVE, action: bSameAsCurrent ? {} : { name: "RunSavedOutputReport", payload: {} }, items: null };
		this.addMenuItemChecked(bSameAsCurrent, oMenuItem);
		menuItems.push(oMenuItem);
		if (queryItems.length > 0) {
			menuItems.push({separator: true});
		}
	}

	if (queryItems.length > 0) {
		var actionClassHanlder = this.getMenuItemActionClassHandler();		
		var versions = [];
		for (var iIndex=0; iIndex < queryItems.length; iIndex++) {
			if (iIndex < 5) {
				var queryItem = queryItems[iIndex];
				var sItemLabel = XMLHelper_GetText(XMLHelper_FindChildByTagName(queryItem, "creationTime_localized", true));
				sItemLabel = enforceTextDir(sItemLabel);
				var storeIDNode = XMLHelper_FindChildByTagName(queryItem, "storeID", true);
				var sStoreID = XMLHelper_GetText(XMLHelper_FindChildByTagName(storeIDNode, "value", true));

				var creationTimeNode = XMLHelper_FindChildByTagName(queryItem, "creationTime", true);
				var sCreationTime = XMLHelper_GetText(XMLHelper_FindChildByTagName(creationTimeNode, "value", true));

				if (mostRecentCreationTime == null) {
					mostRecentCreationTime = sCreationTime;
					mostRecentStoreID = sStoreID;
				}
				
				bSameAsCurrent = (sAction == "view" || sAction == "buxView") && oCV.envParams["creationTime"] == sCreationTime && widget.getSavedOutputSearchPath() != null;
				oMenuItem = { name: "savedOutput", label: sItemLabel, action: bSameAsCurrent ? {} : { name: actionClassHanlder, payload: {obj:sStoreID, creationTime:sCreationTime, mostRecent:false} }, items: null };
				this.addMenuItemChecked(bSameAsCurrent, oMenuItem);
				versions.push(oMenuItem);
			}
			else {
				versions.push({ name: "viewAllSnapshots", label: RV_RES.IDS_JS_VIEW_ALL_SNAPSHOTS, action: { name: "ViewAllSnapshots", payload: {} }, items: null });
				break;
			}
		}

		bSameAsCurrent = false;
		if (widget.getSavedOutputSearchPath() == null && (sAction == "view" || sAction == "buxView")) {
			bSameAsCurrent = true;
		}

		oMenuItem = { name: "savedOutput", label: RV_RES.IDS_JS_MOST_RECENT_SNAPSHOT, action: bSameAsCurrent ? {} : { name: actionClassHanlder, payload: {obj:mostRecentStoreID, creationTime:mostRecentCreationTime, mostRecent:true} }, items: null };
		this.addMenuItemChecked(bSameAsCurrent, oMenuItem);
		menuItems.push(oMenuItem);
		menuItems.push({separator: true});
		menuItems = menuItems.concat(versions);
	}

	buttonSpec.open = bOpen;
	buttonSpec.items = menuItems;

	var updateItems = [];
	updateItems.push(buttonSpec);
	widget.fireEvent("com.ibm.bux.widgetchrome.toolbar.update", null, updateItems);
};

SnapshotsAction.prototype.resetMenu = function(bOpen) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();

	var root = oCV.findBlueDotMenu();
	var buttonSpec = oCV.findToolbarItem("Snapshots", root);
	if (buttonSpec) {
		buttonSpec.open = false;

		var menuItems = [{ name: "loadng", label: RV_RES.GOTO_LOADING, iconClass: "loading"}];
		buttonSpec.items = menuItems;

		var updateItems = [buttonSpec];
		widget.fireEvent("com.ibm.bux.widgetchrome.toolbar.update", null, updateItems);
	}
};
