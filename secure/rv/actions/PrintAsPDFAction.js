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

function PrintAsPDFAction() {
	this.m_format = "PDF";
	this.m_responseFormat = "page";
}

PrintAsPDFAction.prototype = new ExportAction();

PrintAsPDFAction.prototype.getWindowTitle = function() {
	return RV_RES.IDS_PRINT_AS_PDF;
};

PrintAsPDFAction.prototype.initializeForm = function() {
	this.nForm = document.createElement("form");
	this.nForm.setAttribute("method", "post");
	
	var sDispatcherURI = location.protocol +'//'+ location.host + this.m_oCV.m_sGateway;
	this.nForm.setAttribute("action", sDispatcherURI);
};

PrintAsPDFAction.prototype.sendRequest = function() {
	var viewerID = this.m_oCV.getId();
	var sName = 'get' + this.m_format + viewerID;

	this.nForm.setAttribute("id",sName);
	this.nForm.setAttribute("name", sName);
	this.nForm.setAttribute("target", this.m_format + 'Window' + viewerID);
	
	document.body.appendChild(this.nForm);
	
	var sWindowId = this.nForm.getAttribute("target");
	window.open("",sWindowId,'resizable=yes,menubar=no,directories=no,location=no,status=no,toolbar=no,titlebar=no');
	this.nForm.submit();
	document.body.removeChild(this.nForm);
	this.nForm = null;
	
	return true;
};

PrintAsPDFAction.prototype.addFormField = function(sName, sValue) {
	this.nForm.appendChild(createHiddenFormField(sName, sValue));
};