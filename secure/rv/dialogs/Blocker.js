/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 
function Blocker( oCVId )
{
	this.oCV_Id = oCVId;
	this.m_viewerDiv =  dojo.byId("RVContent" + this.oCV_Id);
	this.m_containerDiv = this._findContainerDiv()
	this.initialize();
};
 
Blocker.prototype._findContainerDiv = function()
{
	var containerDiv = null;

	// we need to find the correct container div. It'll be the one with a height set in pixels
	if (!this.m_containerDiv) {
		containerDiv = this.m_viewerDiv;
		while (containerDiv) {
			if (containerDiv.style && containerDiv.style.height && containerDiv.style.height.indexOf("px") != -1) {
				return containerDiv;
			}
			containerDiv = containerDiv.parentNode;
		}
	}

	if (typeof console != "undefined" && console && console.log) {
		console.log("ViewerIWidgetInlineDialog: Could not find the container div for showing the dialog.");
	}

	return this.m_viewerDiv;
};

Blocker.prototype.setClassNameOverride = function(className) 
{
	if( !className){ return; }
	this.m_classNameOverride = className;
	this.applyClassNameOverride();
};

Blocker.prototype.applyClassNameOverride = function()
{
	if(!this.m_classNameOverride || !this.m_background){ return; }
	dojo.removeClass( this.m_background );
	dojo.addClass( this.m_background, this.m_classNameOverride );
};

Blocker.prototype.getNode = function(){
	return this.m_background;
};

Blocker.prototype.initialize = function()
{
	// we only ever have to create one background div for all our dialogs, so lets
	// see if it's already created
	if (!this.m_background) {
		this.m_background = dojo.byId("BACKGROUND" + this.oCV_Id);

		if (!this.m_background) {
			this.m_background = document.createElement("div");
			this.m_background.id = "BACKGROUND" + this.oCV_Id;
			this.m_background.className = "report-blocker";
			this.m_background.tabIndex = "0";

			dojo.place(this.m_background, this.m_containerDiv, 'before');
		}
	}
};

Blocker.prototype.show = function()
{
	if( this.m_background ){
		this.m_background.style.display = 'block';
	}
};


Blocker.prototype.hide = function()
{
	if( this.m_background ){
		this.m_background.style.display = 'none';
	}
};

Blocker.prototype.destroy = function()
{
	if (this.m_background != null) {
		this.m_background.parentNode.removeChild(this.m_background);
		this.m_background = null;
	}
}