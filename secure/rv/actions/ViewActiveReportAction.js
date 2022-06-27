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

function ViewActiveReportAction(){};
ViewActiveReportAction.prototype = new ViewSavedOutputAction();

ViewActiveReportAction.prototype.addAdditionalRequestParms = function(request) {
	request.addFormField("cv.responseFormat", "CMRequest");
	request.setCallbacks( {
		"complete" : {"object" : this, "method" : this.handleQueryResponse}
	});
};

ViewActiveReportAction.prototype.handleQueryResponse = function(response){

	var viewerWidget = this.m_oCV.getViewerWidget();
	viewerWidget.showLoading();
	var xmlParsedCMresponse = XMLBuilderLoadXMLFromString(response.getResult());
	var storeIDNode = XMLHelper_FindChildByTagName(xmlParsedCMresponse, "storeID", true);
	var sStoreID = XMLHelper_GetText(XMLHelper_FindChildByTagName(storeIDNode, "value", true));	
	var activeReportIframe = dojo.byId(this.m_oCV.getViewerWidget().getIFrameId());
	activeReportIframe.src = this.m_oCV.getGateway() + "/output/cm/" + sStoreID + "/";
};