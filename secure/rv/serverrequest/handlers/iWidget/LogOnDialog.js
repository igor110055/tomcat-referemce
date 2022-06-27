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
function LogOnDialog(oCV){
	if (oCV) {
		this.m_oCV = oCV;
	}
}
LogOnDialog.prototype = new ILogOnDialog();

LogOnDialog.prototype.getViewer = function() {
	return this.m_oCV;
};

LogOnDialog.prototype.handleUnknownHTMLResponse = function(responseText) {
	this.show(null);
};
	
LogOnDialog.prototype.show = function(soapFault) {
	var promptInfoNamespace = this.getPromptInfoNamespacesFromAuthenticationFault(soapFault);

	if (window["CVEditContentActionInstance"]) {
			window["CVEditContentActionInstance"].transitionFromBUA();
	}

	IWidgetLogonhandler.handleLogon(this.getViewer().getId(), promptInfoNamespace);
};

LogOnDialog.prototype.getPromptInfoNamespacesFromAuthenticationFault = function(soapFaultDocument) {
	if (!soapFaultDocument) { 
		return null; 
	}

	var camElement = XMLHelper_FindChildByTagName(soapFaultDocument, "CAM", true);
	if (camElement == null) { return null; }

	var promptInfo = XMLHelper_FindChildByTagName(camElement, "promptInfo", true);
	if (promptInfo == null) { return null; }

	var displayObjects = XMLHelper_FindChildByTagName(camElement, "displayObjects", true);
	if (displayObjects == null) { return null; }

	var items = XMLHelper_FindChildrenByTagName(displayObjects, "item", true);
	if (items == null || items.length != 1) { return null; }

	var itemNode = items[0];
	if (itemNode == null) { return null; }
	var nameNode = XMLHelper_FindChildByTagName(itemNode, "name", true);
	var name = XMLHelper_GetText(nameNode, false);
	if (name === 'CAMNamespace') {
		var valueNode = XMLHelper_FindChildByTagName(itemNode, "value", true);
		var value = XMLHelper_GetText(valueNode, false);
		if (value!=null) {
			return value;
		}
	}
	return null;
};

