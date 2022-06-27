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

var InfoBarHelper = {};

InfoBarHelper.getContainerId = function(oCV, layoutIndex) {
	var layoutElement = oCV.getLayoutElement(layoutIndex);
	var lid = layoutElement.getAttribute("lid");
	var containerId = lid === null ? "" : lid;

	//The "lid" attribute is composed of layout ID + namespacePrefix + widget identifier.
	//We only want the layout ID, so remove the rest.
	containerId = containerId.replace(oCV.getViewerWidget().getViewerId(), "").replace("RAP_NDH_", "");
	return containerId;
};

InfoBarHelper.infoBarRemoveFilter = function(widgetId, layoutIndex, itemName, txtDetails) {
	var oCV = eval("window.oCV" + widgetId);
	if (typeof oCV != "undefined") {
		var containerId = this.getContainerId(oCV, layoutIndex);
		oCV.executeAction("Filter", { type:"remove", id: containerId, item: itemName, details: txtDetails });
	}
};

InfoBarHelper.infoBarRemoveSlider = function(widgetId, sliderId) {
	var oCV = eval("window.oCV" + widgetId);
	var payload = {};
	payload[ sliderId ] = { blockedEvents: [ '*' ] };
	oCV.fireWidgetEvent( "com.ibm.bux.widget.updateEventFilter", payload );
	if (typeof oCV != "undefined") {
		oCV.executeAction("UpdateDataFilter", {"filterPayload":"{ \"clientId\" :\"" + sliderId + "\"}"});
	}
};

InfoBarHelper.infoBarRemoveSort = function(widgetId, layoutIndex, itemName, byLabel) {
	var oCV = eval("window.oCV" + widgetId);
	if (typeof oCV != "undefined") {
		var containerId = this.getContainerId(oCV, layoutIndex);
		if (byLabel == "true") {
			oCV.executeAction("Sort", {
				order: "none",
				id: containerId,
				item: itemName,
				type: "label"
			});
		}
		else {
			oCV.executeAction("Sort", {
				order: "none",
				id: containerId,
				item: itemName
			});
		}
	}
};