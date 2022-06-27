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

dojo.provide("ViewerIWidgetInlineDialog");

dojo.require("dijit._base.focus");

/**
 * Class that will take care of showing an inline dialog centered in the widget.
 * @param {Object} oCV
 * @param {Object} sHTML
 */
dojo.declare("ViewerIWidgetInlineDialog", null, {
	constructor: function(oCV, sHTML, aButtons, sButtonContainerId) {
		this.initialize(oCV, sHTML);
		this.m_aButtons = aButtons;
		this.m_sButtonContainerId = sButtonContainerId;
	},

	initialize: function(oCV, sHTML) {
		this.m_oCV = oCV;
		this.m_html = sHTML;

		this.m_viewerDiv = dojo.byId("RVContent" + this.m_oCV.getId());
		this.positionOptions = {horizontal:"center", vertical:"center"};

		this.onScrollHandle = null;
		this.m_dialogDiv = null;
		if( this.m_oCV.getViewerWidget ){
			this.m_background = this.m_oCV.getViewerWidget().getReportBlocker();;
		}

	},

	/**
	 * Sets the vertical option for the dialog. Currently only supports top and middle
	 * @param {Object} option
	 */
	setVerticalPositionOption: function(option) {
		this.positionOptions.vertical = option;
	},

	getDialogDiv: function() {
		return this.m_dialogDiv;
	},

	initializeDialog: function() {
		this.m_dialogDiv = document.createElement("div");
		dojo.addClass(this.m_dialogDiv, 'inlineDialog');
		this.m_dialogDiv.style.display = "none";
		this.m_dialogDiv.innerHTML = this.m_html;

		dojo.place(this.m_dialogDiv, this.m_background.getNode().nextSibling, 'before');

		var buttonDiv = dojo.byId(this.m_sButtonContainerId);
		if (buttonDiv && this.m_aButtons && this.m_aButtons.length > 0) {
			dojo.forEach(this.m_aButtons, function(button) {
						var span = document.createElement("span");
						buttonDiv.appendChild(span);
						var dijitButton = new dijit.form.Button(button, span);
					});
		}
	},
	
	createBackgroundTabCatchDiv: function()
	{
		// we need a div with a tabIndex of zero as the first child of the Viewer div. This will catch the user
		// hitting F12 on a widget and place the focus on the first focusable item in the dialog.
		if (this.m_tabCatch == null) {
			this.m_tabCatch = dojo.byId("BACKGROUND_TABCATCH" + this.m_oCV.getId());

			if (!this.m_tabCatch) {
				this.m_tabCatch = document.createElement("div");
				this.m_tabCatch.id = "BACKGROUND_TABCATCH" + this.m_oCV.getId();
				this.m_tabCatch.style.display = "none";
				this.m_tabCatch.style.position = "absolute";
				this.m_tabCatch.style.left = "0";
				this.m_tabCatch.style.top = "0";
				this.m_tabCatch.style.height = "0px";
				this.m_tabCatch.style.width = "0px";
				this.m_tabCatch.setAttribute("tabIndex", "0");
				if (this.m_viewerDiv.firstChild) { // may be empty in JsUnit tests
					dojo.place(this.m_tabCatch, this.m_viewerDiv.firstChild, "before");
				}
				else {
					this.m_viewerDiv.appendChild(this.m_tabCatch);
				}
			}
		}
	},

	initializeBackground: function() {
	
		this.createBackgroundTabCatchDiv();
	},

	initializeKeyboardSupport: function() {
		// setup the keyboard support so we keep looping through
		// the open dialog when the user hits TAB
		var tabElems = dijit._getTabNavigable(this.m_dialogDiv);
		var firstElem = tabElems.lowest || tabElems.first;
		var lastElem = tabElems.last || tabElems.highest || firstElem;

		if (firstElem) {
			this.m_tabCatch.onfocus = function() {dijit.focus(firstElem);};
			this.m_background.getNode().onfocus = function() {dijit.focus(firstElem);};
		}

		if (lastElem && firstElem) {
			lastElem.onblur = function() {dijit.focus(firstElem);};
		} else if (firstElem) {
			firstElem.onblur = function() {dijit.focus(firstElem);};
		}

		if (this.m_oCV.getKeepFocus() != false && firstElem && firstElem.focus) {
			firstElem.focus();
		}
	},

	show: function() {
		this.m_oCV.setVisibleDialog(this);

		if (this.m_tabCatch == null) {
			this.initializeBackground();
		}

		if (this.m_dialogDiv == null) {
			this.initializeDialog();
		}

		this.m_background.setClassNameOverride( 'inlineDialog-background-error' );
		this.m_background.show();
		this.m_tabCatch.style.display = "block";
		this.m_dialogDiv.style.display = "block";

		this.initializeKeyboardSupport();
	},

	hide: function() {
		this.m_oCV.setVisibleDialog(null);

		if (this.onScrollHandle != null) {
			dojo.disconnect(this.onScrollHandle);
			this.onScrollHandle = null;
		}

		if (this.m_background != null) {
			this.m_background.hide();
		}
		if (this.m_tabCatch != null) {
			this.m_tabCatch.style.display = "none";
		}
		if (this.m_dialogDiv != null) {
			this.m_dialogDiv.style.display = "none";
		}
	},

	destroy: function() {
		this.hide();

		if (this.m_dialogDiv != null) {
			this.m_dialogDiv.parentNode.removeChild(this.m_dialogDiv);
			this.m_dialogDiv = null;
		}
		if (this.m_tabCatch != null) {
			this.m_tabCatch.parentNode.removeChild(this.m_tabCatch);
			this.m_tabCatch = null;
		}
		if (this.m_background != null) {
			this.m_background.destroy();
			this.m_background = null;
		}
	},

	/**
	* Will add a open/close link at that the top of page for debugging
	* @param {Object} sDialogObj
	*/
	setDebugHelper: function(sDialogObj) {
		var debugDiv = document.createElement("div");
		debugDiv.style.zIndex = "100";
		debugDiv.style.display = "block";
		debugDiv.style.position = "relative";
		debugDiv.style.backgroundColor = "#FFFFFF";
		debugDiv.innerHTML = "<table><tr><td>" +
			"<a href=\"#\" onclick=\"" + sDialogObj + ".show();\">show</a>" + "     " +
			"<a href=\"#\" onclick=\"" + sDialogObj + ".hide();\">hide</a></td></tr></table>";
		document.body.insertBefore(debugDiv, document.body.firstChild);
	}
});