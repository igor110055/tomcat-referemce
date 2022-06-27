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
function LogOnDialog(oCV) {
	this.m_oCV = oCV;
}

LogOnDialog.prototype = new ILogOnDialog();

LogOnDialog.prototype.handleUnknownHTMLResponse = function(responseText) {
	if (responseText) {
		// this is an HTML response, most likely a fault page.
		document.write(responseText);
	}	
};

LogOnDialog.prototype.show = function(soapFault) {
	launchLogOnDialog(this.m_oCV.getId(), soapFault);
};

LogOnDialog.prototype.hide = function() {
};