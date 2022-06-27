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
function PromptDialog(oCV) {
	this.m_oCV = oCV;
	this.m_dialogImpl = null;
}
PromptDialog.prototype = new IPromptDialog();

PromptDialog.prototype.initialize = function(url,width,height) {
	this.m_dialogImpl = new CModal("", "", document.body, null, null, width, height, true, true, false, true, this.m_oCV.getWebContentRoot());
	var dialogIframe = document.getElementById(CMODAL_CONTENT_ID);
	dialogIframe.src = url;
};

PromptDialog.prototype.show = function() {
	this.m_dialogImpl.show();
};

PromptDialog.prototype.hide = function() {
	this.m_dialogImpl.hide();
	destroyCModal();
};