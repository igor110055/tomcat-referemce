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
function PromptDialog(oCV){
	this.m_oCV = oCV;
	this.m_url = "";
	this.m_width = 0;
	this.m_height = 0;
	this.m_dialogImpl = null;
}
PromptDialog.prototype = new IPromptDialog();
PromptDialog.prototype.initialize = function(url,width,height) {
	this.m_url = url;
	this.m_width = width;
	this.m_height = height;
};
PromptDialog.prototype.show = function() {
	this.m_dialogImpl = new bux.dialogs.IFrameDialog();
	this.m_dialogImpl.src = this.m_url;
	this.m_dialogImpl.width = this.m_width;
	this.m_dialogImpl.height = this.m_height;
	this.m_dialogImpl.startup();
	this.m_dialogImpl.show();
};
PromptDialog.prototype.hide = function() {
	this.m_dialogImpl.hide();
	this.m_dialogImpl.destroy();
	delete this.m_dialogImpl;
	this.m_dialogImpl = null;
};
