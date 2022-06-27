/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
/*-----------------------------------------------------------------------------------------------------

Class :			CStyle

Description :

-----------------------------------------------------------------------------------------------------*/


function CUIStyle(normal, rollover, depressed, depressed_rollover, disabled) {
	this.m_active = normal;
	this.m_normal = normal;
	this.m_rollover = rollover;
	this.m_activeRollover = rollover;
	this.m_depressed = depressed;
	this.m_depressed_rollover = depressed_rollover;
	this.m_disabled = disabled;
}

function CUIStyle_getActiveState() {
	return this.m_active;
}

function CUIStyle_setActiveState(state) {
	switch(state) {
		case "normal":
			this.m_active = this.m_normal;
			break;
		case "depressed":
			this.m_active = this.m_depressed;
			break;
		case "disabled":
			this.m_active = this.m_disabled;
			break;
		default:
			this.m_active = this.m_normal;
	}
}

function CUIStyle_getActiveRolloverState() {
	return this.m_activeRollover;
}

function CUIStyle_setActiveRolloverState(state) {
	switch(state) {
		case "normal":
			this.m_activeRollover = this.m_rollover;
			break;
		case "depressed":
			this.m_activeRollover = this.m_depressed_rollover;
			break;
		case "disabled":
			this.m_activeRollover = this.m_disabled;
			break;
		default:
			this.m_activeRollover = this.m_rollover;
	}
}



function CUIStyle_getNormalState() {
	return this.m_normal;
}

function CUIStyle_getRolloverState() {
	return this.m_rollover;
}

function CUIStyle_getDepressedState() {
	return this.m_depressed;
}

function CUIStyle_getDepressedRolloverState() {
	return this.m_depressed_rollover;
}

function CUIStyle_getDisabledState() {
	return this.m_disabled;
}

function CUIStyle_setNormalState(state) {
	this.m_normal = state;
}

function CUIStyle_setRolloverState(state) {
	this.m_rollover = state;
}

function CUIStyle_setDepressedState(state) {
	this.m_depressed = state;
}

function CUIStyle_setDepressedRolloverState(state) {
	this.m_depressed_rollover = state;
}

function CUIStyle_setDisabledState(state) {
	this.m_disabled = state;
}

CUIStyle.prototype.getNormalState = CUIStyle_getNormalState;
CUIStyle.prototype.getRolloverState = CUIStyle_getRolloverState;
CUIStyle.prototype.getDepressedState = CUIStyle_getDepressedState;
CUIStyle.prototype.getDepressedRolloverState = CUIStyle_getDepressedRolloverState;
CUIStyle.prototype.getDisabledState = CUIStyle_getDisabledState;
CUIStyle.prototype.setNormalState = CUIStyle_setNormalState;
CUIStyle.prototype.setRolloverState = CUIStyle_setRolloverState;
CUIStyle.prototype.setDepressedState = CUIStyle_setDepressedState;
CUIStyle.prototype.setDepressedRolloverState = CUIStyle_setDepressedRolloverState;
CUIStyle.prototype.setDisabledState = CUIStyle_setDisabledState;
CUIStyle.prototype.setActiveState = CUIStyle_setActiveState;
CUIStyle.prototype.getActiveState = CUIStyle_getActiveState;
CUIStyle.prototype.getActiveRolloverState = CUIStyle_getActiveRolloverState;
CUIStyle.prototype.setActiveRolloverState = CUIStyle_setActiveRolloverState;

// Copyright (C) 2008 Cognos Incorporated. All rights reserved.
// Cognos (R) is a trademark of Cognos Incorporated.

/*-----------------------------------------------------------------------------------------------------

Class :			CToolbarSelect

Description :

-----------------------------------------------------------------------------------------------------*/


function CToolbarSelect(parent, name, command, label, toolTip) {
	this.m_parent = parent;
	this.m_name = name;
	this.m_command = command;
	this.m_label = label;
	this.m_toolTip = toolTip;

	this.m_items = [];

	if(typeof this.m_parent == "object" && typeof this.m_parent.add == "function")
	{
		this.m_parent.add(this);
	}

	//add a defalt item
	if (label)
	{
		this.add("", label);
	}
}

function CToolbarSelect_draw() {
	var html = '<select id="' + this.m_name + '" name="' + this.m_name + '" onchange="' + this.m_command + '"';
	if (this.m_toolTip != "") {
		html += ' title="' + this.m_toolTip + '"';
	}
	html += '>';
	html += this.drawItems();
	html += '</select>';
	return html;
}

function CToolbarSelect_drawItems()
{
	var html="";
	for (var i=0; i<this.m_items.length; i++)
	{
		html += '<option value="'+ this.m_items[i].getUse() +'">'+ this.m_items[i].getDisplay() +'</option>';
	}
	return html;
}

function CToolbarSelect_add(sUse, sDisplay)
{
	var newItem = new CSelectItem(sUse, sDisplay);
	this.m_items = this.m_items.concat(newItem);
}

function  CToolbarSelect_isVisible() {
	//return this.m_bVisible;
	return true;
}

CToolbarSelect.prototype.draw = CToolbarSelect_draw;
CToolbarSelect.prototype.drawItems = CToolbarSelect_drawItems;
CToolbarSelect.prototype.isVisible = CToolbarSelect_isVisible;
CToolbarSelect.prototype.add = CToolbarSelect_add;

function CSelectItem (sUse, sDisplay)
{
	this.m_sUse = sUse;
	this.m_sDisplay = sDisplay;
}

function CSelectItem_getUse()
{
	return this.m_sUse;
}

function CSelectItem_getDisplay()
{
	return this.m_sDisplay;
}

CSelectItem.prototype.getUse = CSelectItem_getUse;
CSelectItem.prototype.getDisplay = CSelectItem_getDisplay;

// Copyright (C) 2008 Cognos Incorporated. All rights reserved.
// Cognos (R) is a trademark of Cognos Incorporated.

/*-----------------------------------------------------------------------------------------------------

Class :			CToolbarPicker

Description :	Toolbar Button wrapper for the CColorPicker and CAlignmentPicker prompt controls

-----------------------------------------------------------------------------------------------------*/


function CToolbarPicker(parent, sCommand, sPromptId, sRef, sType) {
	this.m_parent = parent;
	this.m_command = sCommand;
	this.m_oPicker = null;

	this.m_sPromptId = sPromptId;
	this.m_sRef = sRef;
	this.m_sType = sType;

	if(typeof this.m_parent == "object" && typeof this.m_parent.add == "function")
	{
		this.m_parent.add(this);
	}
}

function CToolbarPicker_draw() {

	var html = '<div id="' + this.m_sType + this.m_sPromptId + '" onclick="' + this.m_sRef + '.preventBubbling(event);"></div>';
	return html;
}

function CToolbarPicker_init()
{
	this.m_oPicker = eval (this.m_command);
	g_pickerObservers = g_pickerObservers.concat(this.m_sRef);
}

function  CToolbarPicker_isVisible() {
	//return this.m_bVisible;
	return true;
}

function CToolbarPicker_togglePicker()
{
	this.m_oPicker.togglePicker();
}

function CToolbarPicker_setActiveColor(s)
{
	this.m_oPicker.setActiveColor(s);
}

function CToolbarPicker_setColor(s)
{
	this.m_oPicker.setColor(s);
}

function CToolbarPicker_setAlignment(s)
{
	this.m_oPicker.setAlignment(s);
}

function CToolbarPicker_setActiveAlignment(s)
{
	this.m_oPicker.setActiveAlignment(s);
}

function CToolbarPicker_setPalette(s)
{
	this.m_oPicker.setPalette(s);
}

function CToolbarPicker_applyCustomStyle()
{
	this.m_oPicker.applyCustomStyle();
}

function CToolbarPicker_updateCustomStyle()
{
	this.m_oPicker.updateCustomStyle();
}

function CToolbarPicker_hide()
{
	this.m_oPicker.hide();
}

function CToolbarPicker_preventBubbling(e)
{
	this.m_oPicker.preventBubbling(e);
}

function CToolbarPicker_buttonMouseHandler(button, action)
{
	this.m_oPicker.buttonMouseHandler(button, action);
}

CToolbarPicker.prototype.draw = CToolbarPicker_draw;
CToolbarPicker.prototype.isVisible = CToolbarPicker_isVisible;
CToolbarPicker.prototype.init = CToolbarPicker_init;
CToolbarPicker.prototype.togglePicker = CToolbarPicker_togglePicker;
CToolbarPicker.prototype.setColor = CToolbarPicker_setColor;
CToolbarPicker.prototype.setAlignment = CToolbarPicker_setAlignment;
CToolbarPicker.prototype.setActiveAlignment = CToolbarPicker_setActiveAlignment;
CToolbarPicker.prototype.setActiveColor = CToolbarPicker_setActiveColor;
CToolbarPicker.prototype.setPalette = CToolbarPicker_setPalette;
CToolbarPicker.prototype.applyCustomStyle = CToolbarPicker_applyCustomStyle;
CToolbarPicker.prototype.updateCustomStyle = CToolbarPicker_updateCustomStyle;
CToolbarPicker.prototype.hide = CToolbarPicker_hide;
CToolbarPicker.prototype.preventBubbling = CToolbarPicker_preventBubbling;
CToolbarPicker.prototype.buttonMouseHandler = CToolbarPicker_buttonMouseHandler;

// Copyright (C) 2008 Cognos Incorporated. All rights reserved.
// Cognos (R) is a trademark of Cognos Incorporated.

/*-----------------------------------------------------------------------------------------------------

Class :			CToolbarButton

Description :

-----------------------------------------------------------------------------------------------------*/

var tbUniqueId = 0;

function makeId() {
	return tbUniqueId++;
}

gDropDownButtonStyle = new CUIStyle('dropDownArrow','dropDownArrowOver',"","","");
gHeaderDropDownButtonStyle = new CUIStyle('bannerDropDownArrow','bannerDropDownArrowOver',"","","");

function CToolbarButton(parent, action, iconPath, toolTip, style, bHideDropDown, label, dropDownToolTip, webContentRoot) {
	this.m_id = 'tbbutton'+makeId();
	this.m_bVisible = true;
	this.m_action = action;
	this.m_toolTip = toolTip;
	if (typeof webContentRoot != "undefined" && webContentRoot != "")
	{
		this.m_webContentRoot = webContentRoot;
	}
	else
	{
		this.m_webContentRoot = "..";
	}
	this.m_icon = (iconPath) ? new CIcon(iconPath, toolTip, this.webContentRoot) : null;
	this.m_parent = parent;
	this.m_menu = null;
	if (typeof bHideDropDown == "boolean") {
		this.m_bHideDropDown = bHideDropDown;
	}
	else {
		this.m_bHideDropDown = false;
	}
	this.m_style = new CUIStyle(style.getNormalState(),style.getRolloverState(),style.getDepressedState(),style.getDepressedRolloverState(),style.getDisabledState());
	this.m_observers = new CObserver(this);

	if(typeof this.m_parent == "object" && typeof this.m_parent.add == "function") {
		this.m_parent.add(this);
	}

	this.m_label = (label) ? label : null;
	this.m_dropDownToolTip = (dropDownToolTip) ? dropDownToolTip : this.m_toolTip;
	this.m_dropDownStyle = gDropDownButtonStyle;
}

function CToolbarButton_getId() {
	return this.m_id;
}

function CToolbarButton_draw() {
	var html="";

	html += '<div style="margin-right:3px;"><button type="button" id="';
	html += this.m_id;
	html += '"';

	if(typeof this.getStyle() == "object")
	{
		html += ' class="' + this.getStyle().getActiveState() + '"';
		if (this.getStyle().getActiveState() != this.getStyle().getDisabledState())
		{
			if (this.isEnabled())
			{
				html += ' tabIndex="1"';
			}
			html += ' hideFocus="true"';
		}
	}
	if (this.m_toolTip != "")
	{
		html += ' title="' + this.m_toolTip + '"';
	}

	html += '>';
	if (this.m_icon != null)
	{
		html += this.m_icon.draw();
	}

	if (this.m_label != null)
	{
		html += this.m_label;
	}

	html += '</button>';

	if(this.m_menu != null && !this.m_bHideDropDown)
	{
		html += '<button type="button" id="';
		html += ('menu' + this.getId());
		html += '"';
		if(typeof this.getStyle() == "object")
		{
			html += ' class="'+this.getDropDownStyle().getActiveState() + '"';
			if (this.getStyle().getActiveState() != this.getStyle().getDisabledState())
			{
				if (this.isEnabled())
				{
					html += ' tabIndex="1"';
				}
				html += ' hideFocus="true"';
			}
		}
		if (this.m_dropDownToolTip != "")
		{
			html += ' title="' + this.m_dropDownToolTip + '"';
		}

		html += '><img style="vertical-align:middle;" border="0" src="' + this.m_webContentRoot + '/common/images/toolbar_drop_arrow.gif"';
		if (this.m_dropDownToolTip != "")
		{
			html += ' alt="' + this.m_dropDownToolTip + '"';
			html += ' title="' + this.m_dropDownToolTip + '"';
		}
		else
		{
			html += ' alt=""';
		}
		html += ' width="7" height="16"/></button>';
	}

	html += '</div>';

	return html;
}

function CToolbarButton_attachEvents() {

	if(typeof this.getParent().getHTMLContainer != "function") {
		return; // this method must be implemented by the parent
	}

	var htmlContainer = this.getParent().getHTMLContainer();
	if(htmlContainer == null) {
		return;
	}

	var hTbItem = eval(htmlContainer.document ? htmlContainer.document.getElementById(this.m_id) : htmlContainer.ownerDocument.getElementById(this.m_id));
	if(hTbItem == null) {
		return; // just to be safe
	}

	hTbItem.onmouseover = this.onmouseover;
	hTbItem.onmouseout = this.onmouseout;
	hTbItem.onclick = this.onclick;
	hTbItem.onkeypress = this.onkeypress;
	hTbItem.onfocus = this.onfocus;
	hTbItem.onblur = this.onblur;

	hTbItem.tbItem = eval(this);

	// attach the drop down arrow event handlers to the toolbar button as well
	if(this.m_menu != null && !this.m_bHideDropDown)
	{
		var hmenu = eval(htmlContainer.document ? htmlContainer.document.getElementById('menu'+this.getId()) : htmlContainer.ownerDocument.getElementById('menu'+this.getId()));
		hmenu.onmouseover = this.onmouseover;
		hmenu.onmouseout = this.onmouseout;
		hmenu.onclick = this.onclick;
		hmenu.onkeypress = this.onkeypress;
		hmenu.onfocus = this.onfocus;
		hmenu.onblur = this.onblur;

		hmenu.tbItem = eval(this);
	}
}

function CToolbarButton_createDropDownMenu(menuStyle, dropDownToolTip) {
	this.m_dropDownToolTip = (dropDownToolTip) ? dropDownToolTip : this.m_toolTip;
	this.m_menu = new CMenu('dropDown'+this.getId(),menuStyle, this.m_webContentRoot);
	this.m_menu.setParent(this);
	return this.m_menu;
}

function CToolbarButton_addOwnerDrawControl(control) {
	this.m_menu = control;

	if(typeof control.setParent != "undefined") {
		this.m_menu.setParent(this);
	}
}

function CToolbarButton_getParent() {
	return this.m_parent;
}

function CToolbarButton_setParent(parent) {
	this.m_parent = parent;
}

function CToolbarButton_getAction() {
	return this.m_action;
}

function CToolbarButton_setAction(action) {
	this.m_action = action;
}

function CToolbarButton_getToolTip() {
	return this.m_toolTip;
}

function CToolbarButton_setToolTip(tooltip) {
	this.m_toolTip = tooltip;
}

function CToolbarButton_getDropDownToolTip() {
	return this.m_dropDownToolTip;
}

function CToolbarButton_setDropDownToolTip(tooltip) {
	this.m_dropDownToolTip = tooltip;
}

function CToolbarButton_getIcon() {
	return this.m_icon;
}

function CToolbarButton_setIcon(iconPath) {
	this.m_icon.setPath(iconPath);
}

function CToolbarButton_onmouseover(evt)
{
	var toolbarButton = this.tbItem;
	if(typeof toolbarButton == "object")
	{
		if(!toolbarButton.isEnabled()) {
			return;
		}
		if(toolbarButton.getMenu() != null && !toolbarButton.m_bHideDropDown && ('menu'+toolbarButton.getId()) == this.id) {
			this.className = toolbarButton.getDropDownStyle().getActiveRolloverState();
		}
		else
		{
			if(typeof toolbarButton.getStyle() == "object") {
				this.className = toolbarButton.getStyle().getActiveRolloverState();
			}

			if(toolbarButton.getMenu() != null && !toolbarButton.m_bHideDropDown)
			{
				var dropDownArrow = this.document ? this.document.getElementById('menu'+toolbarButton.getId()) : this.ownerDocument.getElementById('menu'+toolbarButton.getId());
				if(typeof dropDownArrow == "object") {
					dropDownArrow.className = toolbarButton.getDropDownStyle().getActiveRolloverState();
				}
			}
		}

		// send the message up to our parent
		if(toolbarButton.getParent() != null && typeof toolbarButton.getParent().onmouseover == "function") {
			toolbarButton.getParent().onmouseover(evt);
		}

		// notify our observers of this event
		toolbarButton.getObservers().notify(CToolbarButton_onmouseover);
	}
}

function CToolbarButton_onmouseout(evt) {
	var toolbarButton = this.tbItem;

	if(typeof toolbarButton == "object")
	{
		if(!toolbarButton.isEnabled()) {
			return;
		}
		if(toolbarButton.getMenu() != null && !toolbarButton.m_bHideDropDown && ('menu'+toolbarButton.getId()) == this.id) {
			this.className = toolbarButton.getDropDownStyle().getActiveState();
		}
		else
		{
			if(typeof toolbarButton.getStyle() == "object") {
				this.className = toolbarButton.getStyle().getActiveState();
			}

			if(toolbarButton.getMenu() != null && !toolbarButton.m_bHideDropDown)
			{
				var dropDownArrow = this.document ? this.document.getElementById('menu'+toolbarButton.getId()) : this.ownerDocument.getElementById('menu'+toolbarButton.getId());
				if(typeof dropDownArrow == "object") {
					dropDownArrow.className = toolbarButton.getDropDownStyle().getActiveState();
				}
			}

		}

		// send the message up to our parent
		if(toolbarButton.getParent() != null && typeof toolbarButton.getParent().onmouseout == "function") {
			toolbarButton.getParent().onmouseout(evt);
		}

		// notify our observers of this event
		toolbarButton.getObservers().notify(CToolbarButton_onmouseout);
	}
}

function CToolbarButton_onclick(evt) {

	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// get the toolbar button from the html element
	var toolbarButton = this.tbItem;

	if(toolbarButton != null) {
		if(!toolbarButton.isEnabled()) {
			return;
		}
		var menu = toolbarButton.getMenu();
		if(menu != null && ((this.id == ('menu'+toolbarButton.getId())) || (toolbarButton.m_bHideDropDown && this.id == toolbarButton.getId()))) {
			if(menu.isVisible()) {
				menu.remove();
			} else {
				// the user clicked the drop down arrow
				if(typeof menu.setHTMLContainer != "undefined") {
					menu.setHTMLContainer(this.document ? this.document.body : this.ownerDocument.body);
				}

				//Close all the other dropdown menus first
				if(typeof toolbarButton.m_parent.closeMenus == "function") {
					toolbarButton.m_parent.closeMenus();
				}

				menu.draw();
				menu.show();
			}
		} else {
			eval(this.tbItem.m_action);
		}

		// send the message up to our parent
		if(toolbarButton.getParent() != null && typeof toolbarButton.getParent().onclick == "function") {
			toolbarButton.getParent().onclick(evt);
		}

		// notify our observers of this event
		toolbarButton.getObservers().notify(CToolbarButton_onclick);
	}

	if (this.blur) {
		this.blur();
	}

	evt.cancelBubble = true;
	return false;
}

function CToolbarButton_onkeypress(evt) {

	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	//check for the Enter or Space key
	if (evt.keyCode == 13 || evt.keyCode == 0) {

		// get the toolbar button from the html element
		var toolbarButton = this.tbItem;

		if(toolbarButton != null) {
			if(!toolbarButton.isEnabled()) {
				return;
			}
			var menu = toolbarButton.getMenu();
			if(menu != null && ((this.id == ('menu'+toolbarButton.getId())) || (toolbarButton.m_bHideDropDown && this.id == toolbarButton.getId()))) {
				if(menu.isVisible()) {
					menu.remove();
				} else {
					// the user clicked the drop down arrow
					if(typeof menu.setHTMLContainer != "undefined") {
						menu.setHTMLContainer(this.document ? this.document.body : this.ownerDocument.body);
					}

					menu.draw();
					menu.show();
				}
			} else {
				eval(this.tbItem.m_action);
			}

			// send the message up to our parent
			if(toolbarButton.getParent() != null && typeof toolbarButton.getParent().onkeypress == "function") {
				toolbarButton.getParent().onkeypress(evt);
			}

			// notify our observers of this event
			toolbarButton.getObservers().notify(CToolbarButton_onkeypress);
		}
		return false;
	}

	evt.cancelBubble = true;
	return true;
}

function CToolbarButton_getMenu() {
	return this.m_menu;
}

function CToolbarButton_getMenuType() {
	// current toolbar buttons only support drop down menus
	return 'dropDown';
}

function CToolbarButton_setStyle(style) {
	this.m_style = style;
}

function CToolbarButton_getStyle() {
	return this.m_style;
}

function CToolbarButton_getDropDownStyle() {
	return this.m_dropDownStyle;
}

function CToolbarButton_setDropDownStyle(style) {
	this.m_dropDownStyle = style;
}

function CToolbarButton_isVisible() {
	return this.m_bVisible;
}

function CToolbarButton_hide() {
	this.m_bVisible = false;
}

function CToolbarButton_show() {
	this.m_bVisible = true;
}

function CToolbarButton_enable() {

	this.getStyle().setActiveState('normal');
	this.getStyle().setActiveRolloverState('normal');
	if (this.getIcon())
	{
		this.getIcon().enable();
	}
	this.updateHTML();
}

function CToolbarButton_disable() {

	this.getStyle().setActiveState('disabled');
	this.getStyle().setActiveRolloverState('disabled');
	if (this.getIcon())
	{
		this.getIcon().disable();
	}
	this.updateHTML();
}

function CToolbarButton_isEnabled() {
	if  (this.getIcon())
	{
		return this.getIcon().isEnabled();
	}
	else
	{
		return true;
	}
}

function CToolbarButton_pressed() {
	this.getStyle().setActiveState('depressed');
	this.getStyle().setActiveRolloverState('depressed');
	this.updateHTML();
}

function CToolbarButton_reset() {

	this.getStyle().setActiveState('normal');
	this.getStyle().setActiveRolloverState('normal');
	this.updateHTML();
}

function CToolbarButton_updateHTML() {
	if(typeof this.getStyle() == "object")
	{
		if(typeof this.getParent().getHTMLContainer == "function")
		{
			var htmlContainer = this.getParent().getHTMLContainer();
			if(htmlContainer != null)
			{
				var htmlElement = htmlContainer.document ? htmlContainer.document.getElementById(this.getId()) : htmlContainer.ownerDocument.getElementById(this.getId());
				if(htmlElement != null)
				{
					var toolbarImage = htmlElement.getElementsByTagName("img");
					if(typeof toolbarImage != "undefined" && toolbarImage instanceof Array && toolbarImage.length > 0)
					{
						if (this.getIcon())
						{
							if(this.getIcon().isEnabled())
							{
								toolbarImage[0].src = this.getIcon().getPath();
							}
							else
							{
								toolbarImage[0].src = this.getIcon().getDisabledImagePath();
							}
						}

						if(this.getToolTip())
						{
							htmlElement.title = this.getToolTip();
							toolbarImage[0].title = this.getToolTip();
						}
					}

					var dropDownIcon;
					if(this.getStyle().getActiveState() != this.getStyle().getDisabledState())
					{
						htmlElement.tabIndex = 1;
						if (this.getMenu() != null && !this.m_bHideDropDown)
						{
							htmlElement.nextSibling.tabIndex = 1;
							htmlElement.nextSibling.title = this.getToolTip();
							dropDownIcon = htmlElement.nextSibling.getElementsByTagName("img");
							if(dropDownIcon != null)
							{
								dropDownIcon[0].title = this.getToolTip();
							}

						}
					}
					else
					{
						if (htmlElement.tabIndex != "undefined")
						{
							htmlElement.removeAttribute("tabIndex");
							if (this.getMenu() != null)
							{
								htmlElement.nextSibling.removeAttribute("tabIndex");
								htmlElement.nextSibling.title = this.getToolTip();
								dropDownIcon = htmlElement.nextSibling.getElementsByTagName("img");
								if(dropDownIcon != null)
								{
									dropDownIcon[0].title = this.getToolTip();
								}
							}
						}
					}

					htmlElement.className = this.getStyle().getActiveState();
				}
			}
		}
	}
}

function CToolbarButton_getObservers() {
	return this.m_observers;
}

function CToolbarButton_setFocus() {
	if (this.m_menu != null && !this.m_bHideDropDown) {
		document.getElementById(this.m_id).nextSibling.focus();
	}
	else {
		document.getElementById(this.m_id).focus();
	}
}

CToolbarButton.prototype.draw = CToolbarButton_draw;
CToolbarButton.prototype.attachEvents = CToolbarButton_attachEvents;
CToolbarButton.prototype.onblur = CToolbarButton_onmouseout;
CToolbarButton.prototype.onfocus = CToolbarButton_onmouseover;
CToolbarButton.prototype.onkeypress = CToolbarButton_onkeypress;
CToolbarButton.prototype.onmouseover = CToolbarButton_onmouseover;
CToolbarButton.prototype.onmouseout = CToolbarButton_onmouseout;
CToolbarButton.prototype.onclick = CToolbarButton_onclick;
CToolbarButton.prototype.setParent = CToolbarButton_setParent;
CToolbarButton.prototype.getParent = CToolbarButton_getParent;
CToolbarButton.prototype.getAction = CToolbarButton_getAction;
CToolbarButton.prototype.setAction = CToolbarButton_setAction;
CToolbarButton.prototype.getToolTip = CToolbarButton_getToolTip;
CToolbarButton.prototype.setToolTip = CToolbarButton_setToolTip;
CToolbarButton.prototype.getDropDownToolTip = CToolbarButton_getDropDownToolTip;
CToolbarButton.prototype.setDropDownToolTip = CToolbarButton_setDropDownToolTip;
CToolbarButton.prototype.getIcon = CToolbarButton_getIcon;
CToolbarButton.prototype.setIcon = CToolbarButton_setIcon;
CToolbarButton.prototype.getMenu = CToolbarButton_getMenu;
CToolbarButton.prototype.getMenuType = CToolbarButton_getMenuType;
CToolbarButton.prototype.getId = CToolbarButton_getId;
CToolbarButton.prototype.setStyle = CToolbarButton_setStyle;
CToolbarButton.prototype.getStyle = CToolbarButton_getStyle;
CToolbarButton.prototype.getDropDownStyle = CToolbarButton_getDropDownStyle;
CToolbarButton.prototype.setDropDownStyle = CToolbarButton_setDropDownStyle;
CToolbarButton.prototype.createDropDownMenu = CToolbarButton_createDropDownMenu;
CToolbarButton.prototype.addOwnerDrawControl = CToolbarButton_addOwnerDrawControl;
CToolbarButton.prototype.getObservers = CToolbarButton_getObservers;
CToolbarButton.prototype.update = new Function("return true");
CToolbarButton.prototype.isVisible = CToolbarButton_isVisible;
CToolbarButton.prototype.hide = CToolbarButton_hide;
CToolbarButton.prototype.show = CToolbarButton_show;
CToolbarButton.prototype.isEnabled = CToolbarButton_isEnabled;
CToolbarButton.prototype.enable = CToolbarButton_enable;
CToolbarButton.prototype.disable = CToolbarButton_disable;
CToolbarButton.prototype.pressed = CToolbarButton_pressed;
CToolbarButton.prototype.reset = CToolbarButton_reset;
CToolbarButton.prototype.setFocus = CToolbarButton_setFocus;
CToolbarButton.prototype.updateHTML = CToolbarButton_updateHTML;

// Copyright (C) 2008 Cognos Incorporated. All rights reserved.
// Cognos (R) is a trademark of Cognos Incorporated.

/**
	Class: CModal
	Description:

	@param title	String to show in the header. [Mandatory]
	@param sCloseToolTip String to use as tooltip for close button. [Madatory]
	@param parent	The container of this dialog. [Optional]
	@param t	Top coordinate. [Optional] By Default the dialog is centered.
	@param l	Left coordinate. [Optional] By Default the dialog is centered.
	@param h	Height of the dialog. [Optional] By Default the dialog is centered.
	@param w	Width of the dialog. [Optional] By Default the dialog is centered.
*/

/* Constants */
var CMODAL_ID = 'CMODAL_FRAME';
var CMODAL_BLUR = 'CMODAL_BLUR';
var CMODAL_CONTENT_ID = 'CMODAL_CONTENT';
var CMODAL_HEADER = 'CMODAL_HEADER';
var CMODAL_BACKGROUND_LAYER_ID = 'CMODAL_BK';
var CMODAL_BACK_IFRAME_ID = 'CMODAL_BK_IFRAME';
var CMODAL_ZINDEX = 111;

/* Global variables */
var CMODAL_dragEnabled = false;
var CMODAL_resizeDirection = null;
var CMODAL_startLeft = null;
var CMODAL_startTop = null;
var CMODAL_startWidth = null;
var CMODAL_startHeight = null;
var CMODAL_deltaX = null;
var CMODAL_deltaY = null;

function CModal(title, sCloseToolTip, parent, t, l, h, w, hideButtonBar, hideHeader, dynamicSize, blurBackground, webContentRoot)
{
	this.m_hideButtonBar = false;
	if(typeof hideButtonBar != "undefined")
	{
		this.m_hideButtonBar = hideButtonBar;
	}

	this.m_hideHeader = false;
	if(typeof hideHeader != "undefined")
	{
		this.m_hideHeader= hideHeader;
	}

	this.m_title = title;
	this.m_sCloseToolTip = sCloseToolTip;
	if (parent) {
		this.m_parent = parent;
	} else {
		this.m_parent = (document.body ? document.body : document.documentElement);
	}

	var oBL = document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
	if(oBL)
	{
		oBL.parentNode.removeChild(oBL);
	}

	if (typeof webContentRoot != "undefined" && webContentRoot != "")
	{
		this.m_webContentRoot = webContentRoot;
	}
	else
	{
		this.m_webContentRoot = "..";
	}

	oBL = document.createElement("div");
	oBL.id = CMODAL_BACKGROUND_LAYER_ID;
	oBL.style.display = "none";
	oBL.style.position = "absolute";

	oBL.style.top = "0px";
	oBL.style.left = "0px";
	oBL.style.zIndex = (CMODAL_ZINDEX - 2);

	oBL.style.width = "100%";
	oBL.style.height = "100%";

	if(typeof blurBackground != "undefined" && blurBackground)
	{
		oBL.style.backgroundColor = 'rgb(238, 238, 238)';
		oBL.style.opacity = '0.6';
		oBL.style.filter = 'alpha(opacity:60)';
	}

	oBL.innerHTML = '<table width="100%" height="100%" role="presentation"><tr><td role="presentation" onmousemove="CModalEvent_mousemoving(event)" onmouseup="CModalEvent_disableDrag(event)"></td></tr></table>';
	this.m_parent.appendChild(oBL);

	this.m_backLayer = oBL;

	this.m_top = (t == null ? 0 : t);
	this.m_left = (l == null ? 0 : l);
	this.m_height = (h == null ? 0 : h);
	this.m_width = (w == null ? 0 : w);

	if(typeof dynamicSize != "undefined" && dynamicSize == true)
	{
		this.m_height = CModal_dynamicHeight();
		this.m_width = CModal_dynamicWidth();
	}

	if (window.attachEvent)
	{
		window.attachEvent("onresize", CModalEvent_onWindowResize);
		window.attachEvent("onscroll", CModalEvent_onWindowResize);
	}
	else
	{
		window.addEventListener("resize", CModalEvent_onWindowResize, false);
		window.addEventListener("scroll", CModalEvent_onWindowResize, false);
	}

	var f = document.getElementById(CMODAL_ID);
	if(f)
	{
		f.parentNode.removeChild(f);
	}

	f = document.createElement("span");
	f.id = CMODAL_ID;
	f.CModal = this;
	f.className = 'CModal_frame';
	f.style.zIndex = CMODAL_ZINDEX;
	f.style.border = "#99aacc 1px solid";

	var div = this.createHiddenDiv("CMODAL_TAB_LOOP_BEFORE", 0);
	div.onfocus = function() {document.getElementById("CMODAL_AFTER_PLACEHOLDER").focus();};

	this.m_parent.appendChild(f);

	div = this.createHiddenDiv("CMODAL_AFTER_PLACEHOLDER", -1);
	div = this.createHiddenDiv("CMODAL_TAB_LOOP_AFTER", 0);
	div.onfocus = function() {document.getElementById(CMODAL_CONTENT_ID).contentWindow.focus();};


	this.m_back_iframe = document.getElementById(CMODAL_BACK_IFRAME_ID);
	if(this.m_back_iframe)
	{
		this.m_back_iframe.parentNode.removeChild(this.m_back_iframe);
	}

	this.m_back_iframe = document.createElement("iframe");
	this.m_back_iframe.id = CMODAL_BACK_IFRAME_ID;
	this.m_back_iframe.frameBorder = 0;
	this.m_back_iframe.src = this.m_webContentRoot + "/common/blank.html";
	this.m_back_iframe.style.position = "absolute";
	this.m_back_iframe.style.zIndex = CMODAL_ZINDEX - 1;
	this.m_back_iframe.onfocus = function() {document.getElementById(CMODAL_BACKGROUND_LAYER_ID).focus();};
	this.m_back_iframe.tabIndex = 1;
	this.m_back_iframe.title = "Empty frame";
	this.m_back_iframe.role = "presentation";
	this.m_parent.appendChild(this.m_back_iframe);
	// render framework of the modal dialog
	f.innerHTML = this.renderDialogFrame();

	this.m_frame = f;
}

function CModal_createHiddenDiv(divId, tabIndex) {
	var div = document.getElementById(divId);
	if (div)
	{
		div.parentNode.removeChild(div);
	}

	div = document.createElement("div");
	div.id = divId;
	div.tabIndex = tabIndex;
	div.style.position = "absolute";
	div.style.overflow = "hidden";
	div.style.width = "0px";
	div.style.height = "0px";
	this.m_parent.appendChild(div);

	return div;
}

function CModal_hide() {
	this.m_top = parseInt(this.m_frame.offsetTop,10);
	this.m_left = parseInt(this.m_frame.offsetLeft,10);
	this.m_height = parseInt(this.m_frame.offsetHeight,10);
	this.m_width = parseInt(this.m_frame.offsetWidth,10);

	this.m_backLayer.style.display = "none";
	this.m_frame.style.display = "none";
	if (this.m_back_iframe) {
		this.m_back_iframe.style.display = "none";
	}
}

function CModal_reCenter() {
	this.m_left = (document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth - this.m_width)/2;
	this.m_top = (document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight - this.m_height)/2;
}

function CModal_renderDialogFrame() {
	var sTableAttrs = 'summary="" cellpadding="0" cellspacing="0" border="0" role="presentation"';
	var out =
		'<table role="presentation" style="width:100%; height:99%; padding-top:2px;" ' + sTableAttrs + ' onmouseup="CModalEvent_disableDrag(event)" onmousemove="CModalEvent_mousemoving(event)">';
				if(!this.m_hideHeader)
				{
					out += '' + 
						'<tr>' +
							'<td role="presentation" onmousedown="CModalEvent_enableDrag(event);">' +
								'<table class="dialogHeader" width="100%" ' + sTableAttrs + '>' +					
									'<tr>' +
										'<td id="' + CMODAL_HEADER + '" valign="top" class="dialogHeaderTitle" width="100%" nowrap="nowrap">' +
											getConfigFrame().htmlencode(this.m_title) +
										'</td><td align="right" valign="middle">' +
											'<a onclick="hideCModal()" style="cursor:pointer;">' +
												'<img height="16" width="16" vspace="2" border="0" class="dialogClose" onmouseover="this.className = \'dialogCloseOver\'" onmouseout="this.className = \'dialogClose\'" onmouseup="this.className = \'dialogClose\'" src="' + p_sSkinFolder + '/portal/images/close.gif" alt="' + getConfigFrame().htmlencode(this.m_sCloseToolTip) + '" title="' + getConfigFrame().htmlencode(this.m_sCloseToolTip) + '">' +
											'</a>' +
										'</td>' +
									'</tr>' + 
								'</table>' + 
							'</td>' + 
						'</tr>';
				}

			out += '<tr><td role="presentation" width="100%" height="100%" class="body_dialog_modal" onmousemove="CModalEvent_mousemoving(event)" onmouseup="CModalEvent_disableDrag(event)">' +
				'<iframe title="modal dialog" id="' + CMODAL_CONTENT_ID + '" name="' + CMODAL_CONTENT_ID + '" class="body_dialog_modal" src="' + this.m_webContentRoot + '/' + "qs" + '/blankNewWin.html" style="padding:0px;margin:0px;width:100%;height:100%;" frameborder="0">no iframe support?</iframe>' +
			'</td></tr>';

			if(!this.m_hideButtonBar)
			{
				out += '<tr><td>' +
					'<table ' + sTableAttrs + ' class="dialogButtonBar" style="padding:0px">' +
						'<tr>' +
							'<td width="2" valign="middle"><img width="2" alt="" src="' + this.m_webContentRoot + '/ps/images/space.gif"></td>' +
							'<td valign="middle"><table border="0" cellpadding="1" cellspacing="0" role="presentation">' +
								'<tr>' +
									'<td><img height="1" width="8" alt="" src="' + this.m_webContentRoot + '/ps/images/space.gif"></td>' +
									'<td>' + CModal_renderButton(msgQS['OK'], 'okCModal()') + '</td>' +
									'<td><img height="1" width="8" alt="" src="' + this.m_webContentRoot + '/ps/images/space.gif"></td>' +
									'<td>' + CModal_renderButton(msgQS['CANCEL'], 'cancelCModal()') + '</td>' +
									'<td><img height="1" width="8" alt="" src="' + this.m_webContentRoot + '/ps/images/space.gif"></td>' +
								'</tr></table>' +
							'</td><td width="100%">&nbsp;</td>' +
							'<td style="padding:3px;" valign="bottom" class="CModal_sideSE" onmousedown="CModalEvent_enableResize(event)">' +
								'<img role="presentation" class="CModal_sideSE" style="cursor:se-resize;" alt="" height="12" width="12" border="0" src="' + this.m_webContentRoot + '/common/images/dialog_resize.gif" onmousedown="CModalEvent_enableResize(event);return false;" onmouseup="CModalEvent_disableDrag(event);return false;" onmousemove="CModalEvent_mousemoving(event);return false;">' +
							'</td>' +
						'</tr></table></td></tr>';
			}
			out += '</table>';

	return out;
}

function CModal_renderButton(label, jsFct) {
	var out = '<table cellpadding="0" cellspacing="0" style="padding: 2px 10px 3px;" class="commandButton" onmouseover="this.className=\'commandButtonOver\'"' +
		' onmouseout="this.className = \'commandButton\'" onmousedown="this.className=\'commandButtonDown\'">' +
		'<tr>' +
			'<td style="cursor:pointer;" valign="middle" align="center" nowrap id="btnAnchor" onclick="' + jsFct + '">' + ' <img height="1" width="60" alt="" src="' + this.m_webContentRoot + '/ps/images/space.gif"><br>' +
				label + '</td></tr></table>';
	return out;
}

function CModal_show() {
	this.m_backLayer.style.display = "";
	this.reCenter();

	var position = CMenu_getScrollingPosition();
	this.m_frame.style.top = (position.y + this.m_top) + "px";
	this.m_frame.style.left = (position.x + this.m_left) + "px";
	this.m_frame.style.height = this.m_height + "px";
	this.m_frame.style.width = this.m_width + "px";
	this.m_frame.style.display = 'inline';
	this.m_frame.focus();

	if (this.m_back_iframe) {
		this.m_back_iframe.style.top = this.m_frame.offsetTop + "px";
		this.m_back_iframe.style.left = this.m_frame.offsetLeft + "px";
		this.m_back_iframe.style.height = this.m_frame.offsetHeight + "px";
		this.m_back_iframe.style.width = this.m_frame.offsetWidth + "px";
		this.m_back_iframe.style.display = "block";
	}
}

CModal.prototype.hide = CModal_hide;
CModal.prototype.createHiddenDiv = CModal_createHiddenDiv;
CModal.prototype.reCenter = CModal_reCenter;
CModal.prototype.renderDialogFrame = CModal_renderDialogFrame;
CModal.prototype.show = CModal_show;

/* Event handlers for CModal (global functions) */
function hideCModal() {
	var cdlg = document.getElementById(CMODAL_ID);
	if (cdlg && cdlg.CModal) {
		cdlg.CModal.hide();
	}
}

function destroyCModal() {
	var oBL = document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
	if(oBL)
	{
		oBL.style.display = "none";
	}

	var modelContent = document.getElementById(CMODAL_ID);
	if(modelContent)
	{
		modelContent.style.display = "none";
	}

	var back_iframe = document.getElementById(CMODAL_BACK_IFRAME_ID);
	if(back_iframe)
	{
		back_iframe.style.display = "none";
	}

	if (window.detachEvent)
	{
		window.detachEvent("onresize", CModalEvent_onWindowResize);
		window.detachEvent("onscroll", CModalEvent_onWindowResize);
	}
	else
	{
		window.removeEventListener("resize", CModalEvent_onWindowResize, false);
		window.removeEventListener("scroll", CModalEvent_onWindowResize, false);
	}
}

function cancelCModal() {
	var iframe = document.getElementById(CMODAL_CONTENT_ID);
	if (iframe && iframe.contentWindow && typeof iframe.contentWindow.cancelDialog == "function") {
		iframe.contentWindow.cancelDialog();
	}
	else {
		hideCModal();
	}
}

function okCModal() {
	var iframe = document.getElementById(CMODAL_CONTENT_ID);
	if (iframe && iframe.contentWindow && typeof iframe.contentWindow.execute == "function") {
		iframe.contentWindow.execute();
	}
	else {
		hideCModal();
	}
}

function CModal_dynamicWidth()
{
	return (window.innerWidth != null ? window.innerWidth: document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth:document.body != null? document.body.clientWidth:null)-150;
}
function CModal_dynamicHeight()
{
	return (window.innerHeight != null? window.innerHeight: document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight:document.body != null? document.body.clientHeight:null)-150;
}

function CModal_setModalHeight(modalDialog)
{
	var storedHeight = modalDialog.getAttribute("storedHeight");
	if(modalDialog.offsetHeight > document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight)
	{
		if(storedHeight == null)
		{
			modalDialog.setAttribute("storedHeight", modalDialog.offsetHeight);
		}
		modalDialog.style.height = document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight + "px";
	}
	else if(storedHeight != null)
	{
		if(storedHeight < document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight)
		{
			modalDialog.style.height = storedHeight + "px";
		}
		else
		{
			modalDialog.style.height = document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight + "px";
		}
	}
}

function CModal_setModalWidth(modalDialog)
{
	var storedWidth = modalDialog.getAttribute("storedWidth");
	if(modalDialog.offsetWidth > document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth)
	{
		if(storedWidth == null)
		{
			modalDialog.setAttribute("storedWidth", modalDialog.offsetWidth);
		}

		modalDialog.style.width = document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth + "px";
	}
	else if(storedWidth != null)
	{
		if(storedWidth < document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth)
		{
			modalDialog.removeAttribute("storedWidth");
			modalDialog.style.width = storedWidth + "px";
		}
		else
		{
			modalDialog.style.width = document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth + "px";
		}
	}
}

function CModalEvent_onWindowResize(e){

	var modalDialog = document.getElementById(CMODAL_ID);
	var backLayer = document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
	var back_iframe = document.getElementById(CMODAL_BACK_IFRAME_ID);

	if(modalDialog && backLayer && back_iframe)
	{
		CModal_setModalWidth(modalDialog);
		CModal_setModalHeight(modalDialog);

		var position = CMenu_getScrollingPosition();

		var topCoord = (position.y + ((backLayer.clientHeight -  modalDialog.offsetHeight)/2));
		var leftCoord = (position.x + ((backLayer.clientWidth -  modalDialog.offsetWidth)/2));

		modalDialog.style.top = topCoord + "px";
		modalDialog.style.left = leftCoord + "px";
		back_iframe.style.top = topCoord + "px";
		back_iframe.style.width = modalDialog.style.width;
		back_iframe.style.height = modalDialog.style.height;
		back_iframe.style.left = leftCoord + "px";
	}
}

function CModalEvent_mousemoving(e) {
	var oDlg = null;
	var oIFrame = null;
	if (CMODAL_dragEnabled) {
		if (e == null && (typeof event == "object") && event.clientX != null) {
			e = event;
		}

		oDlg = document.getElementById(CMODAL_ID);
		if (CMODAL_startLeft == null) {
			CMODAL_startLeft = parseInt(oDlg.style.left,10) - e.clientX;
			CMODAL_startTop = parseInt(oDlg.style.top,10) - e.clientY;
		}
		oDlg.style.left = CMODAL_startLeft + e.clientX;
		oDlg.style.top = CMODAL_startTop + e.clientY;

		oIFrame = document.getElementById(CMODAL_BACK_IFRAME_ID);
		if (oIFrame) {
			oIFrame.style.left = oDlg.style.left;
			oIFrame.style.top = oDlg.style.top;
		}
	}
	if (CMODAL_resizeDirection) {
		if (e == null && (typeof event == "object") && event.clientX != null) {
			e = event;
		}

		oDlg = document.getElementById(CMODAL_ID);
		if (CMODAL_startLeft == null) {
			CMODAL_startLeft = parseInt(oDlg.style.left,10);
			CMODAL_startTop = parseInt(oDlg.style.top,10);
			CMODAL_startHeight = parseInt(oDlg.style.height,10);
			CMODAL_startWidth = parseInt(oDlg.style.width,10);
		}

		var h = 0, w = 0;
		switch (CMODAL_resizeDirection) {
			case 'NE':
			case 'E':
			case 'SE':
				w = (e.clientX - CMODAL_startLeft + CMODAL_deltaX);
				if (w < 100) {
					w = 100;
				}
				oDlg.style.width = w + "px";
		}
		switch (CMODAL_resizeDirection) {
			case 'SW':
			case 'S':
			case 'SE':
				h = (e.clientY - CMODAL_startTop + CMODAL_deltaY);
				if (h < 100) {
					h = 100;
				}
				oDlg.style.height = h + "px";
		}
		switch (CMODAL_resizeDirection) {
			case 'NW':
			case 'N':
			case 'NE':
				oDlg.style.top = e.clientY;
				h = (CMODAL_startHeight + (CMODAL_startTop - e.clientY) + CMODAL_deltaY);
				if (h < 100) {
					h = 100;
				}
				oDlg.style.height = h + "px";
		}
		switch (CMODAL_resizeDirection) {
			case 'NW':
			case 'W':
			case 'SW':
				oDlg.style.left = e.clientX;
				w = (CMODAL_startWidth + (CMODAL_startLeft - e.clientX) + CMODAL_deltaX);
				if (w < 100) {
					w = 100;
				}
				oDlg.style.width = w + "px";
		}
		oIFrame = document.getElementById(CMODAL_BACK_IFRAME_ID);
		if (oIFrame) {
			oIFrame.style.left = oDlg.offsetLeft;
			oIFrame.style.top = oDlg.offsetTop;
			oIFrame.style.height = oDlg.offsetHeight;
			oIFrame.style.width = oDlg.offsetWidth;
		}
	}

	if (e.returnValue) { e.returnValue = false; }
	else if (e.preventDefault) { e.preventDefault(); }
	else { return false; }
}

function CModalEvent_disableDrag(e) {
	CMODAL_dragEnabled = false;
	CMODAL_resizeDirection = null;
	CMODAL_startLeft = null;
	CMODAL_startTop = null;
	CMODAL_deltaX = 0;
	CMODAL_deltaY = 0;

	// remove dragging style
	var cn = document.getElementById(CMODAL_ID).className;
	var modelHeader = document.getElementById(CMODAL_HEADER);
	if(modelHeader != null)
	{
		modelHeader.style.cursor = 'default';
	}
	document.getElementById(CMODAL_ID).className = cn.replace(/\s*\bCModal_dragging\b/g, "");
	// show content frame
	document.getElementById(CMODAL_CONTENT_ID).style.visibility = "visible";

	if (typeof document.getElementById(CMODAL_CONTENT_ID).contentWindow.refreshContent == "function") {
		document.getElementById(CMODAL_CONTENT_ID).contentWindow.refreshContent();
	}

	if (e.returnValue) { e.returnValue = false; }
	else if (e.preventDefault) { e.preventDefault(); }
	else { return false; }
}

function CModalEvent_enableDrag(e) {
	CMODAL_dragEnabled = true;
	CMODAL_startLeft = null;
	CMODAL_startTop = null;

	if (e == null && (typeof event == "object") && event.clientX != null) {
		e = event;
	}

	// apply dragging style to frame
	document.getElementById(CMODAL_ID).className += " CModal_dragging";
	document.getElementById(CMODAL_HEADER).style.cursor = 'move';
	// hide content frame
	document.getElementById(CMODAL_CONTENT_ID).style.visibility = "hidden";

	if (e.returnValue) { e.returnValue = false; }
	else if (e.preventDefault) { e.preventDefault(); }
	else { return false; }
}

function CModalEvent_enableResize(e) {
	CMODAL_startLeft = null;
	CMODAL_startTop = null;
	CMODAL_startWidth = null;
	CMODAL_startHeight = null;
	CMODAL_deltaX = 0;
	CMODAL_deltaY = 0;

	if (e == null && (typeof event == "object") && event.clientX != null) {
		e = event;
	}

	var oDlg = document.getElementById(CMODAL_ID);
	CMODAL_startLeft = parseInt(oDlg.style.left,10);
	CMODAL_startTop = parseInt(oDlg.style.top,10);
	CMODAL_startHeight = parseInt(oDlg.style.height,10);
	CMODAL_startWidth = parseInt(oDlg.style.width,10);
	CMODAL_deltaX = (CMODAL_startLeft + CMODAL_startWidth - e.clientX);
	CMODAL_deltaY = (CMODAL_startTop + CMODAL_startHeight - e.clientY);

	var src = (e.srcElement ? e.srcElement : e.target);
	if ( (/\bCModal_side(\w+)\b/).test(src.className) ) {
		// set resize direction using className
		CMODAL_resizeDirection = RegExp.$1;
		// apply dragging style to frame
		document.getElementById(CMODAL_ID).className += " CModal_dragging";
		// hide content frame
		document.getElementById(CMODAL_CONTENT_ID).style.visibility = "hidden";
	}

	if (e.returnValue) { e.returnValue = false; }
	else if (e.preventDefault) { e.preventDefault(); }
	else { return false; }
}

/*-----------------------------------------------------------------------------------------------------

Class :			CMenuEntry

Description :   Common superclass of CMenuItem and CInfoPanel

-----------------------------------------------------------------------------------------------------*/

function CMenuEntry() {
	this.m_menu = null;
	this.m_menuType="";
	this.m_action = null;
	this.m_bEnabled = true;
}

function CMenuEntry_setParent(parent) {
	this.m_parent = parent;
}

function CMenuEntry_getParent() {
	return this.m_parent;
}

function CMenuEntry_setWebContentRoot(sWebContentRoot) {
	this.m_webContentRoot = sWebContentRoot;
}

function CMenuEntry_setId(id) {
	this.m_id = id;
}

function CMenuEntry_getId() {
	return this.m_id;
}

function CMenuEntry_getObservers() {
	return this.m_observers;
}

function CMenuEntry_onkeydown(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);
	
	if(typeof evt != "object" || evt == null) {
		return;
	}

	var i = 0, ii, numItems, nextMenuItem, parent;
	var performNotification = true;
	var target = evt.currentTarget || evt.srcElement;
	//if a Shift-Tab is detected
	if (evt.keyCode == 9 && evt.shiftKey) {
		parent = this.getParent();
		for (i = 0; i < parent.getNumItems(); i++) {
			if (parent.get(i) == this) {
				parent.hide();
				// notify our observers that we've closed the menu because of a tab keydown event
				this.getObservers().notify("CMenuItem_closeMenuTabEvent");

				var parentMenuType = parent.getMenuType ? parent.getMenuType() : null;
				if (parentMenuType !== cHorizonalBar && parentMenuType !== cVerticalBar) {
					//For menus with a parent item, suppress propogation of the 
					//shift+tab event so that focus goes to the correct member.
					if (isIE()) {
						evt.preventDefault();
					}
					else {
						evt.returnValue = false;
					}
				}
				break;
			}
			else if (this.getParent().get(i).m_bEnabled == true) {
				break;
			}
		}
	}
	//if a normal Tab is detected
	else if (evt.keyCode == 9) {
		// If our parent is a CMenuItem, than we're part of a menu. Catch the
		// tab event for the last menuItem in the menu so we can close the menu.
		if (this.isInMenu())
		{
			for (i = (this.getParent().getNumItems() - 1); i >= 0; i++) {
				if (this.getParent().get(i) == this) {
					if (this.getMenu()) {
						this.getMenu().hide();
					}
					this.getParent().hide();
					// notify our observers that we've closed the menu because of a tab keydown event
					this.getObservers().notify("CMenuItem_closeMenuTabEvent");
					if (isIE()) {
						evt.preventDefault();
					}
					else {
						evt.returnValue = false;
					}
					break;
				}
				else if (this.getParent().get(i).m_bEnabled == true) {
					break;
				}
			}
		} else if (typeof this.getParent().closeAllMenus == "function") {
			this.getParent().closeAllMenus();
		} else if (typeof this.getParent().closeMenus == "function") {
			this.getParent().closeMenus();
		}
	}

	// down arrow, select the next menu item in the menu or close the menu
	// if we're already at the last menu item -- or if is a dropdown, 
	// expand submenu.
	else if (evt.keyCode == 40) {
		if(this.isInMenu()) {
			numItems = this.getParent().getNumItems();
			for (i = 0; i < numItems; i++) {
				if (this === this.getParent().get(i)) {
					var iStart = 0;
					var bStartedFromTop = true;
					
					if (i != (numItems-1)) {
						iStart = i+1;
						bStartedFromTop = false;
					}

					for (ii = iStart; ii < numItems; ii++) {
						nextMenuItem = this.getParent().get(ii);
						if (	typeof nextMenuItem.isVisible == "function" && nextMenuItem.isVisible() &&
								typeof nextMenuItem.setFocus == "function") {
							nextMenuItem.setFocus();
							break;
						}
						
						// If we reached the last item and didn't start from the top 
						// then keep going but start from the top
						if (ii == (numItems-1) && !bStartedFromTop) {
							ii = 0;
							bStartedFromTop = true;
						}
					}
					break;
				}
			}
		} else if(this.isEnabled()) {
			performNotification = false;
			
			//For a drop-down menu, expand submenu
			var menu = this.getMenu();
			if(this.getMenuType() == 'dropDown') {
				if(menu.isVisible() == false) {
					// the user clicked on the menu
					menu.setHTMLContainer(target.document ? target.document.body : target.ownerDocument.body);
					menu.draw();
					menu.show();
				} else {
					menu.remove();
				}
			}
		}
	}

	// up arrow
	else if (evt.keyCode == 38  && this.isInMenu()) {
		numItems = this.getParent().getNumItems();
		for (i = 0; i < numItems; i++) {
			if (this === this.getParent().get(i)) {
				var iStart = i-1;
				var bStartedFromBottom = false;

				if (i <= 0) {
					iStart = numItems-1;
					bStartedFromBottom = true;
				}

				for (ii = iStart; ii >= 0; ii--) {
					nextMenuItem = this.getParent().get(ii);
					if (	typeof nextMenuItem.isVisible == "function" && nextMenuItem.isVisible() &&
							typeof nextMenuItem.setFocus == "function") {
						nextMenuItem.setFocus();
						break;
					}
					
					// If we reached the top but didn't start from the bottom,
					// then keep going from the bottom
					if (ii == 0 && !bStartedFromBottom) {
						bStartedFromBottom = true;
						ii = numItems;
					}
				}
				break;
			}
		}
	}
	
	//left/right key
	else if (evt.keyCode == 37 || evt.keyCode == 39) {
		if(this.isEnabled() && this.getMenu() != null) {
			//Expand menu if it will open to the left or right (cascaded menu)
			var menu = this.getMenu();
			if(this.getMenuType() == 'cascaded') {
				// stop notification so we do not hide the menu
				performNotification = false;
				// show the menu
				if(menu.isVisible() == false) {
					menu.setHTMLContainer(target.document ? target.document.body : target.ownerDocument.body);
					menu.draw();
					menu.show();
				}
			}
		} else {
			//Collapse menu if it's been opened from the left or right (cascaded menu)
			
			// stop notification so we do not hide the parent menu
			performNotification = false;
			
			parent = this.getParent();
			if(parent && parent.getParent() && parent.getParent().getMenuType() == "cascaded") {
				// hide the menu
				parent.hide();
			}
		}
	}

	// send the message up to our parent
	if(performNotification && this.getParent() != null && typeof this.getParent().onkeydown == "function") {
		this.getParent().onkeydown(evt);
	}

	// notify our observers of this event
	this.getObservers().notify(CMenuItem_onkeydown);
}

function CMenuEntry_onkeypress(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// in firefox the keyCode will always be zero, so use the charCode if it's there. In IE, the charCode is undefined.
	var keyPressed = evt.keyCode;
	if (keyPressed == 0 && typeof evt.charCode != "undefined") {
		keyPressed = evt.charCode;
	}

	if(typeof evt == "object" && evt != null) {
		
		var target = evt.currentTarget || evt.srcElement;

		//flag which determines if we notify observers of the event
		var performNotification = true;

		// in Firefox the onkeypress gets called for the tab key. Make sure we don't notify our
		// observers since the menu will get closed
		if (keyPressed == 9 || keyPressed == 37 || keyPressed == 38 || keyPressed == 39 || keyPressed == 40) {
			performNotification = false;
		}
		//check for the Enter or Space key
		else if (keyPressed == 13 || keyPressed == 32) {
			//menu item should always be enabled if you can tab to it, but just in case
			if(!this.isEnabled()) {
				return;
			}
			if(this.getMenu() != null) {
				var menu = this.getMenu();
				if(this.getMenuType() == 'cascaded') {
					// stop notification so we do not hide the menu
					performNotification = false;
					// show the menu
					if(menu.isVisible() == false) {
						menu.setHTMLContainer(target.document ? target.document.body : target.ownerDocument.body);
						menu.draw();
						menu.show();
					} else {
						menu.remove();
					}
				} else if(this.getMenuType() == 'dropDown') {
					if(menu.isVisible() == false) {
						// the user clicked on the menu
						menu.setHTMLContainer(target.document ? target.document.body : target.ownerDocument.body);
						menu.draw();
						menu.show();
					} else {
						menu.remove();
					}
				}
			} else {
				// handle the event
				eval(this.getAction());
			}

		}
		//check for Esc key
		else if (keyPressed == 27) {
			//close the menu
			this.getParent().hide();

			//cancel event being bubbled up the hierarchy since only one level of menus needs to hide
			return;
		}

		if (performNotification) {
			// send the message up to our parent
			if(this.getParent() != null && typeof this.getParent().onkeypress == "function") {
				this.getParent().onkeypress(evt);
			}

			// notify our observers of this event
			this.getObservers().notify(CMenuItem_onkeypress);
		}
	}

	// only cancel the event for the Enter k or Space ey
	if (keyPressed == 13 || keyPressed == 0 || keyPressed == 40 || keyPressed == 38) {
		if(evt != null) {
			evt.cancelBubble = true;
		}
		return false;
	}

	return true;
}

function CMenuEntry_getMenu() {
	return this.m_menu;
}

function CMenuEntry_getMenuType() {
	return this.m_menuType;
}

function CMenuEntry_isEnabled() {
	return this.m_bEnabled;
}

function CMenuEntry_isInMenu()
{
	return this.getParent() instanceof CMenu;
}

function CMenuEntry_getAction() {
	return this.m_action;
}

function CMenuEntry_setAction(action) {
	this.m_action = action;
}

CMenuEntry.prototype.getObservers = CMenuEntry_getObservers;
CMenuEntry.prototype.setId = CMenuEntry_setId;
CMenuEntry.prototype.getId = CMenuEntry_getId;
CMenuEntry.prototype.onkeypress = CMenuEntry_onkeypress;
CMenuEntry.prototype.onkeydown = CMenuEntry_onkeydown;
CMenuEntry.prototype.getMenu = CMenuEntry_getMenu;
CMenuEntry.prototype.getMenuType = CMenuEntry_getMenuType;
CMenuEntry.prototype.setParent = CMenuEntry_setParent;
CMenuEntry.prototype.getParent = CMenuEntry_getParent;
CMenuEntry.prototype.setWebContentRoot = CMenuEntry_setWebContentRoot;
CMenuEntry.prototype.isEnabled = CMenuEntry_isEnabled;
CMenuEntry.prototype.isInMenu = CMenuEntry_isInMenu;
CMenuEntry.prototype.getAction = CMenuEntry_getAction;
CMenuEntry.prototype.setAction = CMenuEntry_setAction;

// Copyright (C) 2008 Cognos Incorporated. All rights reserved.
// Cognos (R) is a trademark of Cognos Incorporated.

/*-----------------------------------------------------------------------------------------------------

Class :			CMenuItem

Description :

-----------------------------------------------------------------------------------------------------*/

var theMenuCnt = 1;

function CMenuItem(parent, label, action, iconPath, style, webContentRoot, skin) {
	this.m_label = label;
	if (this.m_label)
	{
		this.m_label = this.m_label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	}
	this.setId(escape(label) + theMenuCnt++);
	this.m_bVisible = true;
	this.setAction(action);
	this.setWebContentRoot(webContentRoot);
	var v_sIconPath = iconPath
	if ((typeof gCognosViewer != "undefined") && (gCognosViewer.envParams["isTitan"]) && (gCognosViewer.envParams["isTitan"] == true))
	{
		v_sIconPath = "blankIcon";
	}
	this.m_icon = new CIcon(v_sIconPath, "", this.m_webContentRoot);
	this.setParent(parent);
	this.m_style = style;
	this.m_observers = new CObserver(this);

	//skin folder
	if (typeof skin != "undefined" && skin != "")
	{
		this.m_sSkin = skin;
	}
	else
	{
		this.m_sSkin = (typeof getPromptSkin != "undefined" ? getPromptSkin() : this.m_webContentRoot + "/skins/corporate");
	}

	if(typeof this.m_parent == "object" && typeof this.m_parent.add == "function") {
		this.m_parent.add(this);
	}

	this.m_sDropDownArrow = "dropdown_arrow_banner.gif";
}

CMenuItem.prototype = new CMenuEntry();

CMenuItem.prototype.setDropDownArrow = function(dropDownArrow)
{
	this.m_sDropDownArrow = dropDownArrow;
};

CMenuItem.prototype.getDropDownArrow = function()
{
	return this.m_sDropDownArrow;
};

function CMenuItem_setId(id) {
	this.m_id = id;
}

function CMenuItem_setIcon(iconPath) {
	this.m_icon.setPath(iconPath);
}

function CMenuItem_setToolTip(tooltip) {
	this.m_icon.m_toolTip = tooltip;
}

function CMenuItem_getToolTip() {
	return this.m_icon.m_toolTip;
}

function CMenuItem_setAltText(sAltText) {
	this.m_sAltText = sAltText;
}

function CMenuItem_getAltText() {
	if (this.m_sAltText) {
		return this.m_sAltText;
	} else {
		return "";
	}
}

function CMenuItem_genARIATags() {
	var html = "";
	if (this.isInMenu()) {
		html += ' role="menuitem" ';
	} else {
		html += ' role="button" ';
	}

	if (this.m_menuType=='dropDown' || this.m_menuType == 'cascaded') {
		html += ' aria-haspopup="true" ';
	}

	if (this.getAltText().length == 0) {
		this.setAltText(this.m_label);
	}

	if ((this.getAltText() && this.getAltText().length > 0) || (this.m_icon && this.m_icon.getToolTip())) {
		html += ' aria-labelledby="' + this.m_id + 'label" ';
	}
	
	if (!this.isEnabled()) {
		html += ' aria-disabled="true" ';
	}

	return html;
}

function CMenuItem_genMenuItemAltText() {
	var html = "";

	if ((this.getAltText() && this.getAltText().length > 0) || (this.m_icon && this.m_icon.getToolTip())) {
		html += '<div style="position: absolute; overflow: hidden; width: 0; height: 0;" id="' + this.m_id + 'label">';
		if (this.getAltText() && this.getAltText().length > 0) {
			html += this.getAltText();
		} else {
			html += this.m_icon.getToolTip();
		}
		html += '</div>';
	}

	return html;
}

function CMenuItem_draw() {
	var html = '<div>';

	var bSiblingContainsIcon = false, siblingCount = null, siblingMenuItem = null, siblingIdx = 0;

	if(this.m_menu == null || this.m_menuType=='dropDown') {
		html += '<table ';

		html += this.genARIATags();

		// If we're in a menu then allow the user to move to a disabled menuItem.
		// If it's a toolbar button, don't let the user tab to it
		if (this.isInMenu())
		{
			if (this.isEnabled()) {
				html += ' hideFocus="true" ';
			}
			html += ' tabIndex="0" ';
		}
		else if (this.isEnabled())
		{
			html += ' tabIndex="0"';
		}
		html += ' width="100%" ';

		html += 'class="';
		if(typeof this.getStyle() == "object") {
			if(this.isEnabled()) {
				html += this.getStyle().getNormalState();
			}
			else {
				html += this.getStyle().getDisabledState();
			}
		}

		html += '" id="';
		html += this.getId();

		html += '" cellpadding="0" cellspacing="0" style="margin-bottom:1px;"><tr>';

		bSiblingContainsIcon = false;
		if(this.m_icon.getPath() == "" && this.m_parent instanceof CMenu) {
			siblingCount = this.m_parent.getNumItems();
			for(siblingIdx = 0; siblingIdx < siblingCount; ++siblingIdx) {
				siblingMenuItem = this.m_parent.get(siblingIdx);
				if(typeof siblingMenuItem.getIcon == "function" && siblingMenuItem.getIcon().getPath()) {
					// temporary for now to get alignment working on the context menu.
					bSiblingContainsIcon = true;
					break;
				}
			}
		}

		if(bSiblingContainsIcon || this.m_icon.getPath() != "")
		{
			var f = "";
			if(getViewerDirection()=="rtl"){
				 f = ' float: right;';
			}
    		html += '<td width="16" style="padding-right: 2px; padding-left: 2px;'+ f + '">';

			if(this.m_icon.getPath() != "")
			{
				html += this.m_icon.draw();
			}
			else
			{
				html += '<img alt="" src="' + this.m_webContentRoot + '/common/images/spacer.gif" width="16"/>';
			}

			html += '</td>';
		}


		if(getViewerDirection()=="rtl"){
			html += '<td nowrap="nowrap" align="right">';
		}else{
			html += '<td nowrap="nowrap" align="left">';
		}
		html += this.m_label;
		html += this.genMenuItemAltText();
		html += '</td>';

		if(this.m_menuType=='dropDown')
		{
			html += '<td width="10%" align="right" style="padding-right: 3px;padding-left: 3px">';
			html += '<img alt="" src="' + this.m_sSkin;

			// TODO remove this once dropdown_arrow.gif makes it into the shared directory
			if (this.getDropDownArrow() == 'dropdown_arrow_banner.gif')
			{
				html += '/shared/images/';
			}
			else
			{
				html += '/portal/images/';
			}
			html += this.getDropDownArrow() + '" WIDTH="7" HEIGHT="16" style="vertical-align:middle;"/>';
			html += '</td>';
		}
		html += '</tr></table></div>';

	} else {
		html += '<table';
		html += this.genARIATags();
		// If we're in a menu then allow the user to move to a disabled menuItem.
		// If it's a toolbar button, don't let the user tab to it		
		if (this.isEnabled() || this.isInMenu())
		{
			html += ' tabIndex="0" hideFocus="true"';
		}
		html += ' width="100%" class="';

		if(typeof this.getStyle() == "object") {
			if(this.isEnabled()) {
				html += this.getStyle().getNormalState();
			}
			else {
				html += this.getStyle().getDisabledState();
			}
		}

		html += '" id="';
		html += this.getId();

		html += '" cellpadding="0" cellspacing="0" style="margin-bottom:1px;"><tr>';

		html += '<td';

		bSiblingContainsIcon = false;
		if(this.m_icon.getPath() == "") {
			siblingCount = this.m_parent.getNumItems();
			for(siblingIdx = 0; siblingIdx < siblingCount; ++siblingIdx) {
				siblingMenuItem = this.m_parent.get(siblingIdx);
				if(typeof siblingMenuItem.getIcon == "function" && siblingMenuItem.getIcon().getPath()) {
					// temporary for now to get alignment working on the context menu.
					bSiblingContainsIcon = true;
					break;
				}
			}
		}

		if(bSiblingContainsIcon || this.m_icon.getPath() != "") {
			html += ' width="16" style="padding-right: 2px; padding-left: 2px;">';
		} else {
			html += ' width="1">';
		}

		html += this.m_icon.draw();
		html += '</td>';

		if(getViewerDirection()=="rtl"){
			html += '<td nowrap="nowrap" align="right">';
		}else{
			html += '<td nowrap="nowrap" align="left">';
		}
		html += this.m_label;
		html += this.genMenuItemAltText();
		html += '</td>';


		if(getViewerDirection()=="rtl"){
			html += '<td width="10%" align="left">';
			html += '<img style="vertical-align:middle;" alt="" src="' + this.m_sSkin + '/viewer/images/menu_expand_rtl.gif" WIDTH="13" HEIGHT="13"/>';
		}else{
			html += '<td width="10%" align="right">';
			html += '<img style="vertical-align:middle;" alt="" src="' + this.m_sSkin + '/viewer/images/menu_expand.gif" WIDTH="13" HEIGHT="13"/>';
		}
		html += '</td>';
		html += '</tr></table>';
		html += '</div>';
	}

	return html;
}

function CMenuItem_onmouseover(evt) {

	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// get the menu item from the html element which is handling the event
	var menuItem = null;
	if(typeof this.menuItem != "undefined") {
		menuItem = this.menuItem;
	}
	else if (this instanceof CMenuItem) {
		menuItem = this;
	}

	if(menuItem == null || !(menuItem instanceof CMenuItem) || !menuItem.isEnabled()) {
		return;
	}

	var menu = menuItem.getMenu();

	if(typeof menuItem.getStyle() == "object" && (menu != null || typeof menuItem.getIcon().getPath() != "undefined")) {
		this.className = menuItem.getStyle().getRolloverState();
	}


	if(menu != null) {
		var pageWidth = 0;
		var pageHeight = 0;

		if(typeof window.innerWidth != "undefined") {
			pageWidth = window.innerWidth;
		}
		else {
			pageWidth = document.body.clientWidth;
		}

		if(typeof window.innerHeight != "undefined") {
			pageHeight = window.innerHeight;
		}
		else {
			pageHeight = document.body.clientHeight;
		}

		if(menuItem.getMenuType() == 'cascaded') {
			if(menu.isVisible() == false) {
				menu.setHTMLContainer(this.document ? this.document.body : this.ownerDocument.body);
				menu.draw();
				menu.show();
			}
		} else if(menuItem.getMenuType() == 'dropDown') {
			// check with the parent to see if there current are menus open. If there are, we'll automatically open this menu
			var menuItemParent = menuItem.getParent();

			var numOfItems = menuItemParent.getNumItems();
			for(var i = 0; i < numOfItems; ++i) {
				var currentItem = menuItemParent.get(i);
				if(currentItem != menuItem && typeof currentItem.getMenu == "function" && currentItem.getMenu() && currentItem.getMenu().isVisible()) {
					// the user clicked on the menu
					menu.setHTMLContainer(this.document ? this.document.body : this.ownerDocument.body);
					menu.draw();
					menu.show();
					break;
				}
			}
		}
	}

	// send the message up to our parent
	if(menuItem.getParent() != null && typeof menuItem.getParent().onmouseover == "function") {
		menuItem.getParent().onmouseover(evt);
	}

	// notify our observers of this event
	menuItem.getObservers().notify(CMenuItem_onmouseover);
}

function CMenuItem_onfocus(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// get the menu item from the html element which is handling the event
	var menuItem = null;
	if(typeof this.menuItem != "undefined") {
		menuItem = this.menuItem;
	}
	else if (this instanceof CMenuItem) {
		menuItem = this;
	}

	if(menuItem == null || !(menuItem instanceof CMenuItem) || !menuItem.isEnabled()) {
		return;
	}

	if(typeof menuItem.getStyle() == "object") {
		this.className = menuItem.getStyle().getRolloverState();
	}

	// send the message up to our parent (a fake mouseover)
	if(menuItem.getParent() != null && typeof menuItem.getParent().onmouseover == "function") {
		menuItem.getParent().onmouseover(evt);
	}

	// notify our observers of this event
	menuItem.getObservers().notify(CMenuItem_onfocus);
}

function CMenuItem_onmouseout(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	var menuItem = null;
	if(typeof this.menuItem != "undefined") {
		menuItem = this.menuItem;
	}
	else if (this instanceof CMenuItem) {
		menuItem = this;
	}

	// get the menu item from the html element which is handling the event
	if(menuItem == null || !(menuItem instanceof CMenuItem) || !menuItem.isEnabled()) {
		return;
	}

	if(typeof menuItem.getStyle() == "object") {
		this.className = menuItem.getStyle().getNormalState();
	}

	// send the message up to our parent
	if(menuItem.getParent() != null && typeof menuItem.getParent().onmouseout == "function") {
		menuItem.getParent().onmouseout(evt);
	}

	// notify our observers of this event
	menuItem.getObservers().notify(CMenuItem_onmouseout);
}

function CMenuItem_onclick(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	if(evt != null) {
		evt.cancelBubble = true;
	}

	return false;
}


function CMenuItem_onmouseup(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	var menuItem = null;
	if(typeof this.menuItem != "undefined") {
		menuItem = this.menuItem;
	}
	else if (this instanceof CMenuItem) {
		menuItem = this;
	}

	if(menuItem != null && menuItem instanceof CMenuItem) {
		if(!menuItem.isEnabled()) {
			return;
		}
		if(menuItem.getMenu() != null) {
			if(menuItem.getMenuType() == 'cascaded') {
				// do nothing for now
			} else if(menuItem.getMenuType() == 'dropDown')
			{
				var menu = menuItem.getMenu();
				if(menu.isVisible() == false)
				{
					if (!this.document && !this.ownerDocument) {
						return;
					}
					// the user clicked on the menu
					menu.setHTMLContainer(this.document ? this.document.body : this.ownerDocument.body);
					menu.draw();
					menu.show();

				} else {
					menu.remove();
				}
			}
		} else {
			// handle the event
			eval(menuItem.getAction());
		}

		if (typeof getReportFrame != "undefined" && typeof getReportFrame().clearTextSelection != "undefined") {
			getReportFrame().clearTextSelection();
		}
		else if (typeof clearTextSelection != "undefined") {
			clearTextSelection();
		}

		if(menuItem.getMenuType() != 'cascaded') {
			// send the message up to our parent
			if(menuItem.getParent() != null && typeof menuItem.getParent().onmouseup == "function") {
				menuItem.getParent().onmouseup(evt);
			}

			// notify our observers of this event
			menuItem.getObservers().notify(CMenuItem_onmouseup);
		}

		if(typeof this.menuItem != "undefined" && menuItem.getMenu()!=null && menuItem.getMenuType()=='cascaded' && menuItem.getAction() != "")
		{
			// handle the event
			eval(menuItem.getAction());
		}
	}

	if(evt != null) {
		evt.cancelBubble = true;
	}

	return false;
}

function CMenuItem_onkeydown(evt) {
	//get the event in a cross-browser fashion
	var menuItem = null;
	if(typeof this.menuItem != "undefined") {
		menuItem = this.menuItem;
	}
	else if (this instanceof CMenuItem) {
		menuItem = this;
	}

	if(menuItem == null || !(menuItem instanceof CMenuItem)) {
		return;
	}

	return CMenuEntry_onkeydown.call(menuItem, evt);
}

function CMenuItem_onkeypress(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	var menuItem = null;
	if(typeof this.menuItem != "undefined") {
		menuItem = this.menuItem;
	}
	else if (this instanceof CMenuItem) {
		menuItem = this;
	}

	if(menuItem != null && menuItem instanceof CMenuItem) {
		return CMenuEntry_onkeypress.call(menuItem, evt);
	}
}

function CMenuItem_createDropDownMenu(menuStyle) {
	this.m_menu = new CMenu('dropDownMenu_'+this.getId(),menuStyle, this.m_webContentRoot);
	this.m_menu.setParent(this);
	this.m_menuType = 'dropDown';
	return this.m_menu;
}

function CMenuItem_createCascadedMenu(menuStyle) {
	this.m_menu = new CMenu('cascadedMenu_'+this.getId(),menuStyle, this.m_webContentRoot);
	this.m_menu.setParent(this);
	this.m_originalMenuType = this.m_menuType;
	this.m_menuType = 'cascaded';
	return this.m_menu;
}

function CMenuItem_clearCascadedMenu() 
{
	if (this.m_menu) {
		this.m_menu.remove();
		this.m_menu = null;
	}
	if (this.m_originalMenuType) {
		this.m_menuType = this.m_originalMenuType;
	}
}

function CMenuItem_addOwnerDrawControl(control, type) {
	this.m_menu = control;
	this.m_menuType = type;

	if(typeof control.setParent != "undefined") {
		this.m_menu.setParent(this);
	}
}


function CMenuItem_attachEvents() {

	if(typeof this.getParent().getHTMLContainer != "function") {
		return; // this method must be implemented by the parent
	}

	var htmlContainer = this.getParent().getHTMLContainer();
	if(htmlContainer == null) {
		return;
	}

	var hMenuItem = eval(htmlContainer.document ? htmlContainer.document.getElementById(this.getId()) : htmlContainer.ownerDocument.getElementById(this.getId()));

	if(hMenuItem == null) {
		return; // just to be safe
	}

	hMenuItem.onmouseover = this.onmouseover;
	hMenuItem.onmouseout = this.onmouseout;
	hMenuItem.onmouseup	= this.onmouseup;
	hMenuItem.onkeypress = this.onkeypress;
	hMenuItem.onfocus = this.onfocus;
	hMenuItem.onblur = this.onblur;
	hMenuItem.onkeydown = this.onkeydown;
	hMenuItem.onclick = this.onclick;

	hMenuItem.menuItem = eval(this);
}

function CMenuItem_remove() {

}

function CMenuItem_getStyle() {
	return this.m_style;
}

function CMenuItem_setStyle(style) {
	this.m_style = style;
}

function CMenuItem_hide() {
	this.m_bVisible = false;
}

function CMenuItem_show() {
	this.m_bVisible = true;
}

function CMenuItem_enable() {
	if(typeof this.getStyle() == "object") {
		if(typeof this.getParent().getHTMLContainer == "function") {
			var htmlContainer = this.getParent().getHTMLContainer();
			if(htmlContainer != null) {
				var htmlElement = htmlContainer.document ? htmlContainer.document.getElementById(this.getId()) : htmlContainer.ownerDocument.getElementById(this.getId());
				if(htmlElement != null) {
					htmlElement.className = this.getStyle().getNormalState();
				}
			}
		}
		this.m_bEnabled = true;
		this.getIcon().enable();

		this.updateHTML();
	}
}

function CMenuItem_updateHTML()
{
	if(typeof this.getStyle() == "object")
	{
		if(typeof this.getParent().getHTMLContainer == "function")
		{
			var htmlContainer = this.getParent().getHTMLContainer();
			if(htmlContainer != null)
			{
				var htmlElement = htmlContainer.document ? htmlContainer.document.getElementById(this.getId()) : htmlContainer.ownerDocument.getElementById(this.getId());
				if(htmlElement != null)
				{
					var toolbarImage = htmlElement.getElementsByTagName("img");
					if(typeof toolbarImage != "undefined")
					{
						if (this.getIcon())
						{
							if(this.getIcon().isEnabled())
							{
								toolbarImage[0].src = this.getIcon().getPath();
							}
							else
							{
								toolbarImage[0].src = this.getIcon().getDisabledImagePath();
							}
						}

						if(this.getToolTip())
						{
							htmlElement.title = this.getToolTip();
							toolbarImage[0].title = this.getToolTip();
						}
					}
					
					if (this.isEnabled())
					{
						if (htmlElement.getAttribute("aria-disabled"))
						{
							htmlElement.removeAttribute("aria-disabled");
						}
					}
					else
					{
						htmlElement.setAttribute("aria-disabled", "true");
					}

					var dropDownIcon;
					if(this.getStyle().getActiveState() != this.getStyle().getDisabledState())
					{
						htmlElement.tabIndex = 0;

						if (this.getMenu() != null && !this.m_bHideDropDown && htmlElement.nextSibling)
						{
							htmlElement.nextSibling.tabIndex = 0;
							htmlElement.nextSibling.title = this.getToolTip();
							dropDownIcon = htmlElement.nextSibling.getElementsByTagName("img");
							if(dropDownIcon != null)
							{
								dropDownIcon[0].title = this.getToolTip();
							}

						}
					}
					else
					{
						if (htmlElement.tabIndex != "undefined")
						{
							htmlElement.removeAttribute("tabIndex");
							if (this.getMenu() != null)
							{
								htmlElement.nextSibling.removeAttribute("tabIndex");
								htmlElement.nextSibling.title = this.getToolTip();
								dropDownIcon = htmlElement.nextSibling.getElementsByTagName("img");
								if(dropDownIcon != null)
								{
									dropDownIcon[0].title = this.getToolTip();
								}
							}
						}
					}

					htmlElement.className = this.getStyle().getActiveState();
				}
			}
		}
	}
}

function CMenuItem_disable() {
	if(typeof this.getStyle() == "object") {
		if(typeof this.getParent().getHTMLContainer == "function") {
			var htmlContainer = this.getParent().getHTMLContainer();
			if(htmlContainer != null) {
				var htmlElement = htmlContainer.document ? htmlContainer.document.getElementById(this.getId()) : htmlContainer.ownerDocument.getElementById(this.getId());
				if(htmlElement != null) {
					htmlElement.className = this.getStyle().getDisabledState();
				}
			}
		}
		this.m_bEnabled = false;
		this.getIcon().disable();

		this.updateHTML();
	}
}

function CMenuItem_isVisible() {
	return this.m_bVisible;
}

function CMenuItem_getIcon() {
	return this.m_icon;
}

function CMenuItem_getLabel() {
	return this.m_label;
}

function CMenuItem_setFocus() {
	var e = document.getElementById(this.m_id);
	if(e) {
		e.focus();
		return true;
	}
	return false;
}

CMenuItem.prototype.draw = CMenuItem_draw;
CMenuItem.prototype.onmouseover = CMenuItem_onmouseover;
CMenuItem.prototype.onmouseout = CMenuItem_onmouseout;
CMenuItem.prototype.onmouseup = CMenuItem_onmouseup;
CMenuItem.prototype.onkeypress = CMenuItem_onkeypress;
CMenuItem.prototype.onkeydown = CMenuItem_onkeydown;
CMenuItem.prototype.onfocus = CMenuItem_onfocus;
CMenuItem.prototype.onblur = CMenuItem_onmouseout;
CMenuItem.prototype.onclick = CMenuItem_onclick;
CMenuItem.prototype.attachEvents = CMenuItem_attachEvents;
CMenuItem.prototype.remove = CMenuItem_remove;
CMenuItem.prototype.setStyle = CMenuItem_setStyle;
CMenuItem.prototype.getStyle = CMenuItem_getStyle;
CMenuItem.prototype.createDropDownMenu = CMenuItem_createDropDownMenu;
CMenuItem.prototype.createCascadedMenu = CMenuItem_createCascadedMenu;
CMenuItem.prototype.clearCascadedMenu = CMenuItem_clearCascadedMenu;
CMenuItem.prototype.addOwnerDrawControl = CMenuItem_addOwnerDrawControl;
CMenuItem.prototype.isVisible = CMenuItem_isVisible;
CMenuItem.prototype.hide = CMenuItem_hide;
CMenuItem.prototype.show = CMenuItem_show;
CMenuItem.prototype.enable = CMenuItem_enable;
CMenuItem.prototype.disable = CMenuItem_disable;
CMenuItem.prototype.getIcon = CMenuItem_getIcon;
CMenuItem.prototype.setIcon = CMenuItem_setIcon;
CMenuItem.prototype.getLabel = CMenuItem_getLabel;
CMenuItem.prototype.setFocus = CMenuItem_setFocus;
CMenuItem.prototype.setToolTip = CMenuItem_setToolTip;
CMenuItem.prototype.getToolTip = CMenuItem_getToolTip;
CMenuItem.prototype.updateHTML = CMenuItem_updateHTML;
CMenuItem.prototype.update = new Function("return true");
CMenuItem.prototype.genARIATags = CMenuItem_genARIATags;
CMenuItem.prototype.setAltText = CMenuItem_setAltText;
CMenuItem.prototype.getAltText = CMenuItem_getAltText;
CMenuItem.prototype.genMenuItemAltText = CMenuItem_genMenuItemAltText;

/*

Class CSeperator

todo : Add commments describing class....

*/

/*
CSeperator styles:

1. horizonal_blank
2. vertical_blank
3. vertical_line
4. horizonal_line

*/

function CSeperator(type, size, style, webContentRoot) {
	this.m_type=type;
	this.m_size=size;
	this.m_bVisible = true;
	if(style !== null && typeof style == "object") {
		this.m_style = new CUIStyle(style.getNormalState(),style.getRolloverState(),style.getDepressedState(),style.getDepressedRolloverState(),style.getDisabledState());
	}
	else {
		this.m_style = new CUIStyle("","","","","");
	}

	if (typeof webContentRoot != "undefined" && webContentRoot != "")
	{
		this.m_webContentRoot = webContentRoot;
	}
	else
	{
		this.m_webContentRoot = "..";
	}

	this.m_toolbarSeperatorClass = "bannerDivider";
}

CSeperator.prototype.setToolbarSeperatorClass = function(seperatorClass)
{
	this.m_toolbarSeperatorClass = seperatorClass;
};

CSeperator.prototype.getToolbarSeperatorClass = function()
{
	return this.m_toolbarSeperatorClass;
};

CSeperator.prototype.setWebContentRoot = function(sWebContentRoot)
{
	this.m_webContentRoot = sWebContentRoot;
};

function CSeperator_draw() {

	if(this.m_style == "") {
		return;
	}

	var html="";

	switch(this.m_type) {
		case "horizonal_blank":
			html += '<td style="padding:0px;"><img border="0" alt="" src="' + this.m_webContentRoot + '/common/images/spacer.gif" height="1" width="';
			html += this.m_size;
			html += '"/></td>';
			break;
		case "horizontal_line":
			html += '<div class="' + this.getStyle().getActiveState() + '"></div>';			
			break;
		case "vertical_blank":
			html += '<tr>';
			html += '<td style="padding:0px;"><img border="0" alt="" src="' + this.m_webContentRoot + '/common/images/spacer.gif" width="1" height="';
			html += this.m_size;
			html += '"/></td></tr>';
			break;
		case "vertical_line":
			html += '<td class="toolbarVerticalSeperator"><div class="' + this.getToolbarSeperatorClass() + '"/></td>';
			break;
	}

	return html;
}

function CSeperator_getSize() {
	return this.m_size;
}

function CSeperator_setSize(size) {
	this.m_size = size;
}

function CSeperator_setStyle(style) {
	this.m_style = style;
}

function CSeperator_getStyle() {
	return this.m_style;
}

function CSeperator_setType(type) {
	this.m_type = type;
}

function CSeperator_getType() {
	return this.m_type;
}

function CSeperator_hide() {
	this.m_bVisible = false;
}

function CSeperator_show() {
	this.m_bVisible = true;
}

function CSeperator_isVisible() {
	return this.m_bVisible;
}

CSeperator.prototype.draw = CSeperator_draw;
CSeperator.prototype.setSize = CSeperator_setSize;
CSeperator.prototype.getSize = CSeperator_getSize;
CSeperator.prototype.setStyle = CSeperator_setStyle;
CSeperator.prototype.getStyle = CSeperator_getStyle;
CSeperator.prototype.getType = CSeperator_getType;
CSeperator.prototype.setType = CSeperator_setType;
CSeperator.prototype.isVisible = CSeperator_isVisible;
CSeperator.prototype.show = CSeperator_show;
CSeperator.prototype.hide = CSeperator_hide;

/*

Class CInfoPanel

todo : Add commments describing class....

*/

/*
CSeperator styles:

1. horizonal_blank
2. vertical_blank
3. vertical_line
4. horizonal_line

*/

function CInfoPanel(size, webContentRoot, id) {
	this.m_size=size;
	this.m_bVisible = true;
	this.m_properties = [];
	this.setId(id);
	this.m_observers = new CObserver(this);
	this.setWebContentRoot(webContentRoot);
}

CInfoPanel.prototype = new CMenuEntry();

CInfoPanel.prototype.setWebContentRoot = function(sWebContentRoot)
{
	this.m_webContentRoot = sWebContentRoot;
};

function CInfoPanel_addCheckedProperty(name, value) {
	var o = {
		'name': name,
		'value': value,
		'type': "checkBox",
		'spacer': false
	};
	this.m_properties[this.m_properties.length] = o;
}
function CInfoPanel_addProperty(name, value) {
	var o = {
		'name': name,
		'value': value,
		'spacer': false
	};
	this.m_properties[this.m_properties.length] = o;
}

function CInfoPanel_addSpacer(height) {
	var o = {
		'spacer': true,
		'height': height
	};
	this.m_properties[this.m_properties.length] = o;
}

function CInfoPanel_draw()
{
	var i=0;
	var html='<table CELLPADDING="0" CELLSPACING="0" role="presentation">';

    if (this.m_properties.length > 0) {
		var contentHtml = "<tr><td>";
		var summary = "";
        for (i = 0; i < this.m_properties.length; i++) {
            if (this.m_properties[i].spacer) {
                //contentHtml += '<tr><td style="padding:0px;"><img border="0" alt="" src="' + this.m_webContentRoot + '/common/images/spacer.gif" height="' + this.m_properties[i].height + '" width="1"></td></tr>';
            }
            else {
                if (this.m_properties[i].type != null && this.m_properties[i].type == 'checkBox') {
                    contentHtml += '<tr><td><span><span class="formText">';
                    if (this.m_properties[i].value == 'true') {
                        contentHtml += '<input type="checkbox" disabled="true" checked>';
                    }
                    else {
                        contentHtml += '<input type="checkbox" disabled="true">';
                    }
                    contentHtml += this.m_properties[i].name;
                    contentHtml += '</span>&nbsp;</input>';
                    contentHtml += '<span></td></tr>';
                }
                else {
                    contentHtml += '<tr><td><span><span class="menuItem_normal" style="font-weight:bold">';
                    contentHtml += this.m_properties[i].name;
                    contentHtml += '</span>&nbsp;<span class="menuItem_normal">';
                    contentHtml += this.m_properties[i].value;
                    contentHtml += '</span></span></td></tr>';
                }
                summary += this.m_properties[i].name + " " + this.m_properties[i].value + ", ";
            }
        }
        var id = this.getId() ? "id=\"" + this.getId() + "\" " : "";
        var tableHtml = "<table summary=\"" + summary + "\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" " + id + " tabindex=\"0\" style=\"margin-bottom:1px;";
        if (typeof this.m_size != "undefined" && this.m_size != "") {
            tableHtml += "width:" + this.m_size;
        }
        tableHtml += "\"\t>";
        html += tableHtml + contentHtml + "</table></td></tr>";
    }
	html += '</table>';
	return html;
}

function CInfoPanel_getSize() {
	return this.m_size;
}

function CInfoPanel_setSize(size) {
	this.m_size = size;
}

function CInfoPanel_hide() {
	this.m_bVisible = false;
}

function CInfoPanel_show() {
	this.m_bVisible = true;
}

function CInfoPanel_isVisible() {
	return this.m_bVisible;
}

function CInfoPanel_isEnabled() { return true; }

function CInfoPanel_onkeydown(evt) {
	//get the event in a cross-browser fashion
	var infoPanel = null;
	if(typeof this.infoPanel != "undefined") {
		infoPanel = this.infoPanel;
	}
	else if (this instanceof CInfoPanel) {
		infoPanel = this;
	}

	if(infoPanel == null || !(infoPanel instanceof CInfoPanel)) {
		return;
	}

	return CMenuEntry_onkeydown.call(infoPanel, evt);
}

function CInfoPanel_onkeypress(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	var infoPanel = null;
	if(typeof this.infoPanel != "undefined") {
		infoPanel = this.infoPanel;
	}
	else if (this instanceof CInfoPanel) {
		infoPanel = this;
	}

	if(infoPanel != null && infoPanel instanceof CInfoPanel) {
		return CMenuEntry_onkeypress.call(infoPanel, evt);
	}
}

function CInfoPanel_setFocus() {
	if(this.getId()) {
		document.getElementById(this.getId()).focus();
	}
}

function CInfoPanel_attachEvents() {
	
	if(typeof this.getParent().getHTMLContainer != "function") {
		return; // this method must be implemented by the parent
	}

	var htmlContainer = this.getParent().getHTMLContainer();
	if(htmlContainer == null) {
		return;
	}

	var hMenuItem = eval(htmlContainer.document ? htmlContainer.document.getElementById(this.getId()) : htmlContainer.ownerDocument.getElementById(this.getId()));

	if(hMenuItem == null) {
		return; // just to be safe
	}

	hMenuItem.onkeypress = this.onkeypress;
	hMenuItem.onkeydown = this.onkeydown;
	
	hMenuItem.infoPanel = eval(this);
}

CInfoPanel.prototype.draw = CInfoPanel_draw;
CInfoPanel.prototype.onkeypress = CInfoPanel_onkeypress;
CInfoPanel.prototype.onkeydown = CInfoPanel_onkeydown;
CInfoPanel.prototype.addProperty = CInfoPanel_addProperty;
CInfoPanel.prototype.addCheckedProperty = CInfoPanel_addCheckedProperty;
CInfoPanel.prototype.addSpacer = CInfoPanel_addSpacer;
CInfoPanel.prototype.setSize = CInfoPanel_setSize;
CInfoPanel.prototype.getSize = CInfoPanel_getSize;
CInfoPanel.prototype.isVisible = CInfoPanel_isVisible;
CInfoPanel.prototype.show = CInfoPanel_show;
CInfoPanel.prototype.hide = CInfoPanel_hide;
CInfoPanel.prototype.isEnabled = CInfoPanel_isEnabled;
CInfoPanel.prototype.setFocus = CInfoPanel_setFocus;
CInfoPanel.prototype.attachEvents = CInfoPanel_attachEvents;
// Copyright (C) 2008 Cognos Incorporated. All rights reserved.
// Cognos (R) is a trademark of Cognos Incorporated.

/*-----------------------------------------------------------------------------------------------------

Class :			CMenu

Description :

-----------------------------------------------------------------------------------------------------*/

var g_ownerDocument = null;

function CMenu(id,style,webContentRoot) {
	this.m_htmlContainer = document.body;
	this.m_bVisible = false;
	this.m_id = id;
	this.m_htmlDivElement = null;
	this.m_parent = null;
	this.m_menuItems = [];
	this.m_style = style;
	this.m_callback = null;
	this.m_observers = new CObserver(this);
	this.m_bForceCallback = false;
	this.m_loadingMenuItem = false;

	this.m_oCV = null;

	if (typeof webContentRoot != "undefined" && webContentRoot != "")
	{
		this.m_webContentRoot = webContentRoot;
	}
	else
	{
		this.m_webContentRoot = "..";
	}
}

function CMenu_setHTMLContainer(container) {
	this.m_htmlContainer = container;
	g_ownerDocument = this.m_htmlContainer.document ? this.m_htmlContainer.document : this.m_htmlContainer.ownerDocument;
}

function CMenu_getHTMLContainer() {
	return this.m_htmlContainer;
}

function CMenu_setParent(parent) {
	this.m_parent = parent;
}

function CMenu_getParent() {
	return this.m_parent;
}

function CMenu_getId() {
	return this.m_id;
}

function CMenu_getHTMLDiv() {
	return this.m_htmlDivElement;
}

function CMenu_create() {

	var newElement = this.m_htmlContainer.document ? this.m_htmlContainer.document.createElement("div") : this.m_htmlContainer.ownerDocument.createElement("div");

	if(typeof this.getStyle() == "object") {
		newElement.className = this.getStyle().getNormalState();
	}

	//Only set display=block when needed, because it causes flickering in Mozilla
	newElement.style.display = "none";
	newElement.style.visibility = "hidden";
	newElement.style.position = "absolute";
	newElement.style.left = "0px";
	newElement.style.top = "0px";
	newElement.id = this.m_id;
	
	newElement.setAttribute("role", "region");
	if (window.RV_RES) {
		newElement.setAttribute("aria-label", RV_RES.IDS_JS_A11Y_DYNAMIC_MENU);
	}

	//append the new menu
	this.m_htmlContainer.appendChild(newElement);

	//create a reference to it
	this.m_htmlDivElement = newElement;
}

function CMenu_setAltText(altText) {
	this.m_altText = altText;
}

function CMenu_getAltText() {
	if (this.m_altText) {
		return this.m_altText;
	} else {
		return "";
	}
}

function CMenu_genARIATags() {
	var html = ' role="menu"';

	if (this.getAltText() && this.getAltText().length > 0) {
		html += ' aria-labelledby="' + this.m_id + 'label" ';
	}
	else if (window.RV_RES) {
		html += ' aria-label="' + RV_RES.IDS_JS_A11Y_DYNAMIC_MENU + '" ';
	}

	return html;
}

function CMenu_genMenuAltText() {
	var html = "";

	if (this.getAltText() && this.getAltText().length > 0) {
		html += '<tr><td><div style="position: absolute; overflow: hidden; width: 0; height: 0;" id="' + this.m_id + 'label">' + this.getAltText() + '</div></td></tr>';
	}

	return html;
}

function CMenu_draw() {
	if(this.m_htmlContainer == null) {
		return;
	}

	if(this.m_htmlDivElement == null) {
		this.create();
	}

	var html="";

	if(this.m_menuItems.length == 0 || this.m_bForceCallback == true) {

		this.setForceCallback(false);

		if(this.m_callback != null) {

			this.setLoadingMenuItem(true);

			var menu = this;
			var callbackFunc = function() {if (menu && menu.executeCallback) {menu.executeCallback();}};
			setTimeout(callbackFunc, 1000);

			// build a html div with a wait cursor
			html='<table class="menuItem_normal" CELLPADDING="0" CELLSPACING="0" tabindex="0" hidefocus="true"';
			html += this.genARIATags();
			html += '>';

			html += this.genMenuAltText();

			html += '<tr>';

			var loadingMsg = "";
			if (this.m_oCV && RV_RES.GOTO_LOADING) {
				loadingMsg = RV_RES.GOTO_LOADING;
			}
			else if(typeof gUIFrameWorkMenuLoadingMessage != "undefined") {
				loadingMsg = gUIFrameWorkMenuLoadingMessage;
			} else {
				loadingMsg = '...';
			}


			html += '<td>';
			html += '<img style="vertical-align:middle;" alt="' + loadingMsg + '" width="16" height="16" src="' + this.m_webContentRoot + '/common/images/tv_loading.gif"/>';
			html += '</td>';

			html += '<td nowrap="nowrap" align="left">';
			html += loadingMsg;

			html += '</td>';

			html += '</tr>';

			html += '</table>';
		}

	} else {
		this.setLoadingMenuItem(false);
		//add the items
		var i=0;
		html='<table CELLPADDING="0" CELLSPACING="0" tabindex="0" style="outline: none;" hidefocus="true"';

		html += this.genARIATags();
		html += '>';

		html += this.genMenuAltText();

		var anyVisibleItems = false;
		for (i=0; i < this.m_menuItems.length; i++) {
			if(this.m_menuItems[i].isVisible()) {
				anyVisibleItems = true;
				html += '<tr><td>';
				html += this.m_menuItems[i].draw();
				html += '</td></tr>';
			}
		}
		if (!anyVisibleItems) {
			this.remove();
			return;
		}
		html += '</table>';
	}

	try
	{
		this.m_htmlDivElement.innerHTML = html;
		// attach the event handlers
		this.attachEvents();
	}
	catch (e)
	{

	}

	this.updateCoords();

	// update hidden iframe
	var iFrameId = "uiFrameworkHiddenIframe" + this.m_id;
	var isNS7 = ((!isIE()) && (document.getElementById)) ? true : false;
	setTimeout('updateIframeCoords("' + iFrameId + '", "' + this.m_htmlDivElement.id + '", ' + isNS7 + ')',50);
	//Only gets applied when rv is in fragment mode
	if ((typeof gCognosViewer != "undefined") && (gCognosViewer.envParams["cv.responseFormat"]) && (gCognosViewer.envParams["cv.responseFormat"] == 'fragment'))
	{
		AdjustPortalFont(this.m_htmlDivElement);
	}
}

function CMenu_setLoadingMenuItem(bLoadingMenuItem)
{
	this.m_loadingMenuItem = bLoadingMenuItem;
}

function CMenu_getLoadingMenuItem()
{
	return this.m_loadingMenuItem;
}

/**
 * CMenu_getScrollingPosition
 * Cross Browser method to get the scroll position of a mouse click.
 * QuirksMode supports document.body.scrollTop, document.body.scrollLeft
 * Strict Mode
 * Firefox, Opera, Safari, Konqueror support window.pageYOffset, window.pageXOffset
 * IE 6.0 supports document.documentElement.scrollTop, document.documentElement.scrollLeft
 * @return Object - contain x,y information of the position of the mouse click.
 */

function CMenu_getScrollingPosition()
{
 var position = {"x":0,"y": 0};

 if (typeof window.pageYOffset != "undefined")
 {
   position = {"x":window.pageXOffset,"y":window.pageYOffset};
 }

 else if (typeof document.documentElement.scrollTop != "undefined" && document.documentElement.scrollTop > 0)
 {
   position = {"x":document.documentElement.scrollLeft,"y":document.documentElement.scrollTop};
 }

 else if (typeof document.body.scrollTop != "undefined")
 {
   position = {"x":document.body.scrollLeft,"y":document.body.scrollTop};
 }

 return position;
}
/**
 * AdjustPortalFont
 * @author whelanp
 * This function fixes a problem with font sizes in the portal environment,
 * we are using the computed style of the fragment div to set the font on the menu item
 * this keeps it consistent with the font being used by the rest of the page.
 * Problems this solves, menus get appended to the body of the document, if the body does
 * not set the font size correctly the font can either be too small or too big.  If we are
 * in fragment mode there is always a div created with the appropriate css rules applied to it
 * thus getting the font size from the fragment div fixes the problem.
 * To fix a browser bug that causes tables to not properly inherit there parents font size, we've appended
 * a class to the menu as well. This class sets all table descendents of any element with PortalFontFix as a
 * class to use font-size:100% this forces the tables to use 100% of there parents font-size.
 * class is located in CRNFragment.css
 * .PortalFontFix table	{font-size:100%;}
 *
 */
function AdjustPortalFont(div)
{
	var fragArray = fragments;
	if (fragArray)
	{
		div.className += " PortalFontFix";
		var fragDiv = null;
		for (var frag in fragArray)
		{
			if (frag.indexOf("rvCanvas") > -1)
			{
				fragDiv = $(fragArray[frag].div);
				if (fragDiv != null)
				{
					break;
				}
			}
		}

		if (fragDiv != null)
		{
			div.style.fontSize = xGetComputedStyle(fragDiv, "font-size");
		}
	}
}

function CMenu_updateCoords() {
	var myParent = this.getParent();
	var mnu = this.m_htmlDivElement;
	if(mnu != null)
	{

		var myDocument = this.m_htmlContainer.document ? this.m_htmlContainer.document : this.m_htmlContainer.ownerDocument;

		//Backup the visibilty and display properties of this menu
		var originalVisibility  = mnu.style.visibility;
		var originalDisplay = mnu.style.display;

		mnu.style.visibility = "hidden";
		mnu.style.display = "block";
		//This line is used to make sure the width of the DIV element is correct in Mozilla
		if(mnu.firstChild != null) {
			mnu.style.width = mnu.firstChild.offsetWidth;
		}

		var x=0, y=0;
		var db = mnu.parentNode; //db = Document body
		// calculate the page width
		var pageWidth = db.clientWidth;
		var pageHeight = db.clientHeight;
		var pagePosition = CMenu_getScrollingPosition();
		var scrollLeft = pagePosition.x;
		var scrollTop = pagePosition.y;

		if(myParent == null)
		{
			//If this is the main context menu...
			x = mnu.style.left;
			y = mnu.style.top;

			//Remove "px" on x and y coordinates if it exists
			if (x.substr(x.length - 2, 2) == "px")
			{
				x = parseInt(x.substring(0, x.length-2),10);
				y = parseInt(y.substring(0, y.length-2),10);
			}

			//Change the y coordinate if the menu goes below the visible page
			if (y + mnu.offsetHeight >= (pageHeight))
			{
				if (y - mnu.offsetHeight > 0) {
					y = y + scrollTop - mnu.offsetHeight;
				}
				else {
					y = Math.max(pageHeight - mnu.offsetHeight, 0);
				}
			}
			else {
				y = y + scrollTop;
			}

			//Change the x coordinate if the menu goes below the visible page
			if (x + mnu.offsetWidth >= (pageWidth))
			{
				if (x - mnu.offsetWidth > 0) {
					x = x + scrollLeft - mnu.offsetWidth;
				}
				else {
					x = Math.max(pageWidth - mnu.offsetWidth, 0);
				}
			}
			else {
				x = x + scrollLeft;
			}
		}
		else
		{
			//This is one of the menu items...
			if(!(myParent instanceof CToolbarButton) && !(myParent instanceof CMenuItem)) {
				return;
			}

			// make sure the parent has implemented the method "getMenuType"
			if(typeof myParent.getMenuType != "function") {
				return;
			}
			var myParentHTMLElement = myDocument.getElementById(this.getParent().getId());
			var myParentDropdownButton = myDocument.getElementById('menu' + this.getParent().getId());
			if(myParentHTMLElement == null) {
				return;
			}

			var current = myParentHTMLElement;

			// handle drop down menus
			if(myParent.getMenuType() == 'dropDown') {

				x = 0; y = myParentHTMLElement.offsetHeight;

				while(current != null) {
					x += current.offsetLeft; y += current.offsetTop;
					current = current.offsetParent;
				}

				if(getViewerDirection()=="rtl"){
					var xMirrored = x - (mnu.offsetWidth - myParentHTMLElement.offsetWidth);
					if(xMirrored > scrollLeft){
						x = xMirrored;
					}
				}

				// For defect COGCQ00646908.
				// If we are in a portlet we must also take into account its scrollable position.
				// The caveat here is that the portlet div is scrollable and a parent element that is scrollable is not necessarily an
				// offsetParent (and in this case it is not).  Therefore, we must travel up the parentNode DOM tree and calculate the scroll
				// position values of the portlet div (and any subsequent scrollable element) and subtract them accordingly.
				if ((typeof gCognosViewer != "undefined") && (gCognosViewer.envParams["cv.responseFormat"]) && (gCognosViewer.envParams["cv.responseFormat"] == 'fragment')) {
					var scrollPos = myParentHTMLElement;
					while((scrollPos != document.body) && (scrollPos = scrollPos.parentNode)) {
						// if the scroll values return a null, we must OR a 0-value to force return a number instead of null or NaN
						x -= scrollPos.scrollLeft || 0;
						y -= scrollPos.scrolltop || 0;
					}
					
					// In portlets we also need to take into consideration the windows scroll position.
					if (scrollLeft) {
						x += scrollLeft;
					}
				}

				// if the right side of the drop down menu extends beyond browser window viewing area, adjust accordingly
				if((x + mnu.offsetWidth) > (pageWidth + scrollLeft)) {
					x = x + myParentHTMLElement.offsetWidth - mnu.offsetWidth;
					if(myParentDropdownButton != null) {
						x = x + myParentDropdownButton.offsetWidth;
					}
				}

				// if the bottom of the drop down menu extends below the browser viewing area and there is enough room to draw at the top, then draw to the top
				if(((y + mnu.offsetHeight) > (pageHeight + scrollTop)) && (y - (mnu.offsetHeight + myParentHTMLElement.clientHeight) >= 0)) {
					y -= (mnu.offsetHeight + myParentHTMLElement.clientHeight);
				}
			} else if(myParent.getMenuType() == 'cascaded') {

				x = myParentHTMLElement.offsetWidth;

				while(current != null) {
					x += current.offsetLeft; y += current.offsetTop;
					current = current.offsetParent;
				}

				if(getViewerDirection()=="rtl"){
					var xMirrored = x - (mnu.offsetWidth + myParentHTMLElement.offsetWidth);
					if(xMirrored > scrollLeft){
						x = xMirrored;
					}
				}

				// if the right side of the cascaded menu extends beyond the viewing area of the browser window right side, render to the left insted of the right
				if((x + mnu.offsetWidth) > (pageWidth + scrollLeft)) {
					x -= (myParentHTMLElement.offsetWidth + mnu.offsetWidth);
				}

				// if the bottom of the cascaded menu extends beyond the bottom of the browser viewing area, draw to the top
				if((y + mnu.offsetHeight) > (pageHeight + scrollTop)) {
					y -= (mnu.offsetHeight-myParentHTMLElement.clientHeight);
				}
			}
		}

		//Restore the visibilty and display properties of this menu
		mnu.style.visibility = originalVisibility;
		mnu.style.display = originalDisplay;

		this.setXCoord(x);
		this.setYCoord(y);
		this.setZIndex(500);
	}
}

function CMenu_add(menuItem) {
	if(typeof menuItem.getObservers == "function" && typeof menuItem.getObservers() == "object") {
		menuItem.getObservers().attach(this, this.closeSubMenus, menuItem.onmouseover);
		menuItem.getObservers().attach(this, this.closeAllMenus, menuItem.onmouseup);
		menuItem.getObservers().attach(this, this.closeSubMenus, menuItem.onfocus);
		menuItem.getObservers().attach(this, this.closeAllMenus, menuItem.onkeypress);
	}
	this.m_menuItems[this.m_menuItems.length] = menuItem;
}

function CMenu_get(index) {
	if(index >= 0 && index < this.getNumItems()) {
		return this.m_menuItems[index];
	}
	return null;
}

CMenu.prototype.getItem = function(sItemId)
{
	var sId = sItemId;
	if (this.m_oCV) {
		sId = this.m_oCV.getId() + sItemId;
	}

	for (var iIndex=0; iIndex < this.getNumItems(); iIndex++)
	{
		var uiItem = this.get(iIndex);
		if(typeof uiItem.getId == "function" && uiItem.getId() == sId)
		{
			return uiItem;
		}
	}
};

function CMenu_getNumItems() {
	return this.m_menuItems.length;
}

function CMenu_hide() {
	this.hideHiddenIframe();
	if(this.m_htmlDivElement != null) {
		this.m_htmlDivElement.style.visibility = "hidden";
	}
	this.m_bVisible = false;

	// get the actual element that spawned the menu
	var theControl = this.getParent();

	if (theControl != null && typeof theControl.setFocus == "function") {
		theControl.setFocus();
	} else if (theControl != null && typeof theControl.focus == "function") {
		theControl.focus();
	} else if (typeof this.m_focusCell == "object" && typeof this.m_focusCell.focus == "function" ) {
		this.m_focusCell.focus();
	}
}

function CMenu_setFocus() {
	try {
		var menuItem = null;
		for (var menuItemIndex = 0; menuItemIndex < this.getNumItems() && !menuItem; menuItemIndex++) {
			var _menuItem = this.get(menuItemIndex);
			if (_menuItem.isVisible && _menuItem.isVisible() ) {
				menuItem = _menuItem; 
			}
		} 
		if (!menuItem || !menuItem.setFocus()) {
			this.m_htmlDivElement.childNodes[0].focus();
		}
	} catch (e) {}
}

function CMenu_show() {
	if(this.m_htmlDivElement != null) {
		this.m_bVisible = true;

		// Only attach the onresize & onscroll events when we're not on an iOS. This is to fix an issue
		// where we'd get an scoll event right away when displaying our menu, so the menu would show up and
		// then get removed right away
		if (!window.isIOS()) {		
			var cmenuObj = this;
			
			if (window.attachEvent) {
				window.attachEvent("onresize", function() { cmenuObj.remove()});
				window.attachEvent("onscroll", function() { cmenuObj.remove()});
			}
			else {
				window.addEventListener("resize", function() { cmenuObj.remove()}, false);
				window.addEventListener("scroll", function() { cmenuObj.remove()}, false);
			}
		
			var contentDiv = null;
			if (this.m_oCV != null) {
				contentDiv = document.getElementById(this.m_oCV.getId() + "content");
			}
			
			if (contentDiv) {
				if (contentDiv.parentNode.parentNode.attachEvent) {
					contentDiv.parentNode.parentNode.attachEvent("onscroll", function() { cmenuObj.remove()});
				}
				else {
					contentDiv.parentNode.parentNode.addEventListener("scroll", function() { cmenuObj.remove()}, false);
				}
			}
		}
		
		// update the x and y coords
		this.updateCoords();

		var isNS7 = ((!isIE()) && (document.getElementById)) ? true : false;

		var iFrameId = "uiFrameworkHiddenIframe" + this.m_id;
		var hiddenIframeElement = this.m_htmlContainer.document ? this.m_htmlContainer.document.getElementById(iFrameId) : this.m_htmlContainer.ownerDocument.getElementById(iFrameId);
		if (hiddenIframeElement == null) {
			hiddenIframeElement = this.createHiddenIFrame(iFrameId);
		}

		if(hiddenIframeElement) {
			hiddenIframeElement.style.display = "block";
			hiddenIframeElement.style.left = "0px";
			hiddenIframeElement.style.top = "0px";
			updateIframeCoords(iFrameId, this.m_htmlDivElement.id, isNS7);
			setTimeout('updateIframeCoords("'+iFrameId+'", "'+this.m_htmlDivElement.id+'", '+isNS7+')',50);
		}

		//Show the context menu
		this.m_htmlDivElement.style.display = "block";
		this.m_htmlDivElement.style.visibility = "visible";
		this.setFocus();
	}
}

function CMenu_createHiddenIFrame(iFrameId)
{
	var container = this.getHTMLContainer();

	var iframeElem = container.document ? container.document.createElement("iframe") : container.ownerDocument.createElement("iframe");

	iframeElem.setAttribute("id",iFrameId);
	iframeElem.setAttribute("src",this.m_webContentRoot + '/common/images/spacer.gif');
	iframeElem.setAttribute("scrolling",'no');
	iframeElem.setAttribute("frameborder",'0');
	iframeElem.style.position="absolute";
	iframeElem.style.minWidth="0px";
	iframeElem.style.minHeight="0px";
	iframeElem.style.left="0px";
	iframeElem.style.top="0px";
	iframeElem.style.zIndex=499;
	iframeElem.style.display="none";
	iframeElem.setAttribute("title", "Empty frame");
	iframeElem.setAttribute("role", "presentation");

	container.appendChild(iframeElem);

	return iframeElem;
}

function CMenu_isVisible() {
	return this.m_bVisible;
}

function CMenu_remove() {
	this.removeHiddenIframe();

	for(var i = 0; i < this.getNumItems(); ++i) {
		var currentItem = this.get(i);
		if(typeof currentItem.getMenu == "function" &&  currentItem.getMenu() != null) {
			currentItem.getMenu().remove();
		}
	}

	if(this.m_htmlContainer != null && this.m_htmlDivElement != null) {
		this.m_htmlContainer.removeChild(this.m_htmlDivElement);
	}

	this.m_htmlDivElement = null;
	this.m_bVisible = false;
}

function CMenu_removeHiddenIframe()
{
	try
	{
		if (g_ownerDocument)
		{
			var hiddenIframeElement = g_ownerDocument.getElementById("uiFrameworkHiddenIframe" + this.m_id);
			if (hiddenIframeElement != null) {
				hiddenIframeElement.style.display = "none";
				if (hiddenIframeElement.parentNode && hiddenIframeElement.parentNode.removeChild) {
					hiddenIframeElement.parentNode.removeChild(hiddenIframeElement);
				}
			}
		}
	}
	catch(e)
	{
	}
}

function CMenu_hideHiddenIframe() {
	try
	{
		var hiddenIframeElement = g_ownerDocument.getElementById("uiFrameworkHiddenIframe" + this.m_id);
		if(hiddenIframeElement) {
			hiddenIframeElement.style.display = "none";
		}
	}
	catch(e)
	{
	}
}

function CMenu_enable() {

}

function CMenu_disable() {

}

function CMenu_getState() {

}

function CMenu_clear() {
	if(this.m_htmlDivElement != null) {
		this.m_htmlDivElement.innerHTML="";
	}
	this.m_menuItems.splice(0, this.m_menuItems.length);
}

function CMenu_attachEvents() {
	for(var i = 0; i < this.m_menuItems.length; i++) {
		if(typeof this.m_menuItems[i].attachEvents == "function") {
			this.m_menuItems[i].attachEvents();
		}
	}

	this.m_htmlDivElement.onkeypress = this.onkeypress;
	this.m_htmlDivElement.tbMenu = eval(this);

}

function CMenu_closeSubMenus(state) {
	// Called during a notification...
	// make sure we hide any submenus which have been opened.
	for(var i = 0; i < this.m_menuItems.length; i++) {
		var menuItem = this.m_menuItems[i];
		var subject = state.getSubject();
		if(menuItem != subject && typeof menuItem.getMenu == "function" && menuItem.getMenu() != null && menuItem.getMenu().isVisible()) {
			menuItem.getMenu().remove();
		}
	}
}

function CMenu_closeAllMenus(state) {
	// Called during a notification...
	var current = this;
	var highestMenu = null;
	while(current) {
		if(current instanceof CMenu) {
			highestMenu = current;
		}
		current = current.getParent();
	}

	if(highestMenu != null) {
		highestMenu.remove();
	}
}


function CMenu_setStyle(style) {
	this.m_style = style;
}

function CMenu_getStyle() {
	return this.m_style;
}

function CMenu_setXCoord(x) {
	var htmlDiv = this.getHTMLDiv();
	if(htmlDiv != null) {
		htmlDiv.style.left = x + "px";
	}
}

function CMenu_setYCoord(y) {
	var htmlDiv = this.getHTMLDiv();
	if(htmlDiv != null) {
		htmlDiv.style.top = y + "px";
	}
}

function CMenu_setZIndex(zIndex) {
	var htmlDiv = this.getHTMLDiv();
	if(htmlDiv != null) {
		htmlDiv.style.zIndex = zIndex;
	}
}

// set a callback routine to populate the menu
function CMenu_registerCallback(callback) {
	this.m_callback = callback;
}

function CMenu_executeCallback() {
	if(typeof this.m_callback == "function")
	{
		this.m_callback();
	}
	else if(typeof this.m_callback == "string")
	{
		eval(this.m_callback);
	}
}

function CMenu_getObservers() {
	return this.m_observers;
}

function CMenu_onmouseover(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// notify our parent (if one exists) of this event
	if(this.getParent() != null && typeof this.getParent().onmouseover == "function") {
		this.getParent().onmouseover(evt);
	}

	// notify observers of this event
	this.getObservers().notify(CMenu_onmouseover);
}

function CMenu_onmouseout(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// notify our parent (if one exists) of this event
	if(this.getParent() != null && typeof this.getParent().onmouseout == "function") {
		this.getParent().onmouseout(evt);
	}

	// notify observers of this event
	this.getObservers().notify(CMenu_onmouseout);
}

function CMenu_onmouseup(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// notify our parent (if one exists) of this event
	if(this.getParent() != null && typeof this.getParent().onmouseup == "function") {
		this.getParent().onmouseup(evt);
	}

	// notify observers of this event
	this.getObservers().notify(CMenu_onmouseup);
}

function CMenu_onkeypress(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	var menu = this.tbMenu;

	if (typeof menu == "object") {
		// down arrow, select the first enabled item or close the menu if there aren't any enabled menu items
		if (evt.keyCode == 40) {
			var bMenuItemEnabled = false;
			for(var i = 0; i < menu.m_menuItems.length; i++) {
				var menuItem = menu.m_menuItems[i];
				if (	typeof menuItem.isVisible == "function" && menuItem.isVisible() &&
						typeof menuItem.setFocus == "function") {
					menuItem.setFocus();
					bMenuItemEnabled = true;
					break;
				}
			}

			if (!bMenuItemEnabled) {
				menu.hide();
			}
		}

		// up arrow, simply hide the menu
		if (evt.keyCode == 38) {
			menu.hide();
		}
	}

	// notify our parent (if one exists) of this event
	if(typeof this.getParent == "function" && this.getParent() != null && typeof this.getParent().onkeypress == 'function') {
		this.getParent().onkeypress(evt);
	}

	// notify observers of this event
	if (typeof this.getObservers == "function") {
		this.getObservers().notify(CMenu_onkeypress);
	}
}

function CMenu_getForceCallback()
{
	return this.m_bForceCallback;
}

function CMenu_setForceCallback(forceCallback)
{
	this.m_bForceCallback = forceCallback;
}

CMenu.prototype.draw = CMenu_draw;
CMenu.prototype.updateCoords = CMenu_updateCoords;
CMenu.prototype.add = CMenu_add;
CMenu.prototype.get = CMenu_get;
CMenu.prototype.getNumItems = CMenu_getNumItems;
CMenu.prototype.hide = CMenu_hide;
CMenu.prototype.hideHiddenIframe = CMenu_hideHiddenIframe;
CMenu.prototype.removeHiddenIframe = CMenu_removeHiddenIframe;
CMenu.prototype.show = CMenu_show;
CMenu.prototype.enable = CMenu_enable;
CMenu.prototype.disable = CMenu_disable;
CMenu.prototype.getState = CMenu_getState;
CMenu.prototype.clear = CMenu_clear;
CMenu.prototype.attachEvents = CMenu_attachEvents;
CMenu.prototype.setParent = CMenu_setParent;
CMenu.prototype.getParent = CMenu_getParent;
CMenu.prototype.getHTMLContainer = CMenu_getHTMLContainer;
CMenu.prototype.setHTMLContainer = CMenu_setHTMLContainer;
CMenu.prototype.getHTMLDiv = CMenu_getHTMLDiv;
CMenu.prototype.create = CMenu_create;
CMenu.prototype.remove = CMenu_remove;
CMenu.prototype.getId = CMenu_getId;
CMenu.prototype.isVisible = CMenu_isVisible;
CMenu.prototype.setStyle = CMenu_setStyle;
CMenu.prototype.getStyle = CMenu_getStyle;
CMenu.prototype.closeSubMenus = CMenu_closeSubMenus;
CMenu.prototype.closeAllMenus = CMenu_closeAllMenus;
CMenu.prototype.setXCoord = CMenu_setXCoord;
CMenu.prototype.setYCoord = CMenu_setYCoord;
CMenu.prototype.setZIndex = CMenu_setZIndex;
CMenu.prototype.update = new Function("return true");
CMenu.prototype.registerCallback = CMenu_registerCallback;
CMenu.prototype.executeCallback = CMenu_executeCallback;
CMenu.prototype.getObservers = CMenu_getObservers;
CMenu.prototype.onmouseover = CMenu_onmouseover;
CMenu.prototype.onmouseout = CMenu_onmouseout;
CMenu.prototype.onmouseup = CMenu_onmouseup;
CMenu.prototype.onkeypress = CMenu_onkeypress;
CMenu.prototype.createHiddenIFrame = CMenu_createHiddenIFrame;
CMenu.prototype.setForceCallback = CMenu_setForceCallback;
CMenu.prototype.getForceCallback = CMenu_getForceCallback;
CMenu.prototype.setFocus = CMenu_setFocus;
CMenu.prototype.genARIATags = CMenu_genARIATags;
CMenu.prototype.setAltText = CMenu_setAltText;
CMenu.prototype.getAltText = CMenu_getAltText;
CMenu.prototype.genMenuAltText = CMenu_genMenuAltText;
CMenu.prototype.setLoadingMenuItem = CMenu_setLoadingMenuItem;
CMenu.prototype.getLoadingMenuItem = CMenu_getLoadingMenuItem;

function updateIframeCoords(id, containerId, isNS7)
{
	if (g_ownerDocument == null) {
		return;
	}
	var container = g_ownerDocument.getElementById(containerId);
	var hiddenIframeElement = g_ownerDocument.getElementById(id);
	if (hiddenIframeElement && container) {
		if(isNS7 == true) {
			hiddenIframeElement.style.left = container.offsetLeft + "px";
			hiddenIframeElement.style.top = container.offsetTop + "px";
			hiddenIframeElement.style.width = container.offsetWidth + "px";
			hiddenIframeElement.style.height = container.offsetHeight + "px";
		} else {
			hiddenIframeElement.style.pixelLeft = container.offsetLeft;
			hiddenIframeElement.style.pixelTop = container.offsetTop;
			hiddenIframeElement.style.pixelWidth = container.offsetWidth;
			hiddenIframeElement.style.pixelHeight = container.offsetHeight;
		}
	}
}

// Copyright (C) 2008 Cognos Incorporated. All rights reserved.
// Cognos (R) is a trademark of Cognos Incorporated.

/*

Class CIcon

todo : Add commments describing class....

*/

function CIcon(iconPath, toolTip, webContentRoot) {
	this.m_iconPath = iconPath;
	this.m_toolTip = toolTip;
	this.m_enabled = true;

	// The UI framework defaults the icon width/height to 16. If you need to change this, call setHeight and/or setWidth
	this.m_height = 16;
	this.m_width = 16;

	if (typeof webContentRoot != "undefined" && webContentRoot != "")
	{
		this.m_webContentRoot = webContentRoot;
	}
	else
	{
		this.m_webContentRoot = "..";
	}
}

function CIcon_draw() {

	var html="";

	html += '<img style="vertical-align:middle;" src="';

	if(typeof this.m_iconPath != "undefined" && this.m_iconPath !== "" && this.m_iconPath != "blankIcon") {
		if(this.m_enabled == true) {
			html += this.m_iconPath;
		}
		else {
			html += this.getDisabledImagePath();
		}

		html += '" title="';

		if(typeof this.m_toolTip == "string" && this.m_toolTip.length > 0) {
			html += this.m_toolTip;
		}

		html += '" alt="';

		if(typeof this.m_toolTip == "string" && this.m_toolTip.length > 0) {
			html += this.m_toolTip;
		}

		html += '" width="';
		html += this.m_width;
		html += '" height="';
		html += this.m_height;
		html += '"/>';
	} else {
		html += this.m_webContentRoot + '/common/images/spacer.gif';
		html += '" alt=""';
		if (this.m_iconPath == "blankIcon")
		{
			html += ' width="';
			html += this.m_width;
			html += '" height="';
			html += this.m_height;
			html += '"/>';
		}
		else
		{
			html += ' width="1" height="1"/>';
		}
	}

	return html;
}

function CIcon_getDisabledImagePath() {
	var imagePathArray = this.m_iconPath.split('/');
	var iconPath="";
	for(var i = 0; i < (imagePathArray.length -1); ++i) {
		iconPath += imagePathArray[i] + '/';
	}
	iconPath += 'dis_' + imagePathArray[imagePathArray.length-1];
	return iconPath;
}

function CIcon_getPath() {
	return this.m_iconPath;
}

function CIcon_setPath(path) {
	this.m_iconPath = path;
}

function CIcon_getToolTip() {
	return this.m_toolTip;
}

function CIcon_setToolTip(toolTip) {
	this.m_toolTip = toolTip;
}

function CIcon_enable() {
	this.m_enabled = true;
}

function CIcon_disable() {
	this.m_enabled = false;
}

function CIcon_isEnabled() {
	return this.m_enabled;
}

function CIcon_setHeight(height) {
	this.m_height = height;
}

function CIcon_getHeight() {
	return this.m_height;
}

function CIcon_setWidth(width) {
	this.m_width = width;
}

function CIcon_getWidth() {
	return this.m_width;
}

CIcon.prototype.draw = CIcon_draw;
CIcon.prototype.enable = CIcon_enable;
CIcon.prototype.disable = CIcon_disable;
CIcon.prototype.isEnabled = CIcon_isEnabled;
CIcon.prototype.getDisabledImagePath = CIcon_getDisabledImagePath;
CIcon.prototype.getPath = CIcon_getPath;
CIcon.prototype.setPath = CIcon_setPath;
CIcon.prototype.setHeight = CIcon_setHeight;
CIcon.prototype.getHeight = CIcon_getHeight;
CIcon.prototype.setWidth = CIcon_setWidth;
CIcon.prototype.getWidth = CIcon_getWidth;
CIcon.prototype.getToolTip = CIcon_getToolTip;
CIcon.prototype.setToolTip = CIcon_setToolTip;

// Copyright (C) 2008 Cognos Incorporated. All rights reserved.
// Cognos (R) is a trademark of Cognos Incorporated.


/*-----------------------------------------------------------------------------------------------------

Class :			CBar

Description :

-----------------------------------------------------------------------------------------------------*/

var cHorizonalBar = 0;
var cVerticalBar = 1;


function CBar(containerId, style, sId, imagePath, showTooltip, hideTooltip, cookieVar, cookieName) {

	this.m_align = 'left';
	this.m_items = [];
	this.m_htmlContainerId = containerId;
	this.m_htmlContainer = null;
	this.m_id = 'cbar'+containerId;
	this.m_menuType = cVerticalBar;
	this.m_style = style;
	this.m_parent = null;
	this.m_observers = new CObserver(this);
	this.m_cookieVar = cookieVar;
	this.m_cookieName = cookieName;

	//reference to the object name
	this.m_sId = (sId) ? sId : null;

	this.m_display = DISPLAY_INLINE;
	this.m_imagePath = (imagePath) ? imagePath : '../common/images/toolbar/';
	this.m_imgCollapseSrc = this.m_imagePath + 'toolbar_collapse.gif';
	this.m_imgExpandSrc = this.m_imagePath + 'toolbar_expand.gif';
	this.m_showTooltip = showTooltip ? showTooltip : null;
	this.m_hideTooltip = hideTooltip ? hideTooltip : null;


}

function CBar_hideBar() {
	var bar = document.getElementById('bar'+ this.m_id);
	var barToggleIcon = document.getElementById('barIcon'+ this.m_id);

	if(barToggleIcon)
	{
		barToggleIcon.src= this.m_imgExpandSrc;
		if (this.m_showTooltip != null) {
			barToggleIcon.alt = this.m_showTooltip;
			barToggleIcon.title = this.m_showTooltip;
		}
	}

	if(bar)
	{
		bar.style.display = DISPLAY_NONE;
		if (typeof setQSCookie == "function") {
			setQSCookie(this.m_cookieVar, this.m_cookieName, 0);
		}
	}
}

function CBar_showBar() {
	var bar = document.getElementById('bar'+ this.m_id);
	var barToggleIcon = document.getElementById('barIcon'+ this.m_id);

	if(barToggleIcon)
	{
		barToggleIcon.src= this.m_imgCollapseSrc;
		if (this.m_hideTooltip != null) {
			barToggleIcon.alt = this.m_hideTooltip;
			barToggleIcon.title = this.m_hideTooltip;
		}
	}

	if(bar)
	{
		bar.style.display = this.m_display;
		if (typeof setQSCookie == "function") {
			setQSCookie(this.m_cookieVar, this.m_cookieName, 1);
		}
	}
}

function CBar_toggleBar(){
	var bar = document.getElementById('bar'+ this.m_id);

	var barDisplay = bar.style.display;

	if ( (barDisplay == this.m_display) || (barDisplay==""))
	{
		this.hideBar();
	}
	else
	{
		this.showBar();
	}
}

function CBar_getParent() {
	return this.m_parent;
}

function CBar_setParent(parent) {
	this.m_parent = parent;
}

function CBar_draw() {

	if(this.m_htmlContainer == null) {
		this.m_htmlContainer = document.getElementById(this.m_htmlContainerId);
		if(this.m_htmlContainer == null) { // if we can't find the container, return
			return;
		}
	}

	var html = "";
	html += '<table cellpadding="0" cellspacing="0" border="0" role="presentation"';
	if (this.m_sId != null)
	{
		html += 'style="display: inline;"><tr>';
		/*The height of 26 is chosen so that the collapse/expand icons will always line up in Firefox. Bug #483255*/
		html += '<td'+(isFF() ? ' style="vertical-align:bottom"':'')+' style="height:26px"><img id="barIcon'+ this.m_id +'" border="0" src="'+ this.m_imgCollapseSrc + '"';
		if (this.m_hideTooltip != null) {
			html += ' alt="'+this.m_hideTooltip+'" title="'+this.m_hideTooltip+'"';
		}
		html +=' onclick="'+this.m_sId +'.toggleBar();" style="cursor:pointer;cursor:hand;"></td>';
	}
	else
	{
		var marginStyle = "";
		if (this.m_htmlContainer.style.textAlign == "right") {
			marginStyle = 'margin-left:auto; margin-right: 0;';
		}
		else if (this.m_htmlContainer.style.textAlign == 'left') {
			marginStyle = 'margin-left:0; margin-right: auto;';
		}
		else if (this.m_htmlContainer.style.textAlign == 'center') {
			marginStyle = 'margin-left:auto; margin-right: auto;';
		}

		if (marginStyle != "") {
			html += ' style="'+marginStyle+'"';
		}
		html += '><tr>';
	}
	html += '<td id="bar'+ this.m_id +'">';
	html += '<table cellpadding="0" cellspacing="0" border="0" role="presentation" class="';
	if(this.getStyle() != null)
	{
		html += this.getStyle().getNormalState();
	}
	html += '" id="';
	html += this.m_id;
	html += '" style="'+ this.m_style +'"><tr>';

	html += this.drawItems();

	html += '</tr></table></td>';
	html += '</tr></table>';

	this.m_htmlContainer.innerHTML = html;

	this.m_htmlContainer.style.textAlign = this.m_align;

	//initialize any items
	for(var i = 0; i < this.m_items.length; ++i) {
		if(typeof this.m_items[i].init == "function")
		{
			this.m_items[i].init();
		}
	}
	this.attachEvents();
}

function CBar_drawItems() {
	var html = "";
	for(var i = 0; i < this.m_items.length; ++i) {
		if(typeof this.m_items[i].draw == "function") {
			if(this.m_menuType == cHorizonalBar && !(this.m_items[i] instanceof CSeperator) ) {
				html += '<td style="white-space:nowrap;';

				if(this.m_items[i] instanceof CMenuItem)
				{
					html += ';padding-left:1px; padding-right: 1px;';
				}

				html += '">';
			}

			if(this.m_items[i].isVisible()) {
				html += this.m_items[i].draw();
			}

			if(this.m_menuType == cHorizonalBar && !(this.m_items[i] instanceof CSeperator) ) {
				html += '</td>';
			}

		}
	}
	return html;
}

function CBar_attachEvents() {
	for(var i = 0; i < this.m_items.length; ++i) {
		if(typeof this.m_items[i].attachEvents == "function" && this.m_items[i].isVisible()) {
			this.m_items[i].attachEvents();
		}
	}
}

function CBar_add(item) {
	if(typeof item.getObservers == "function" && typeof item.getObservers() == "object" && typeof item.onmouseover == "function" && item instanceof CMenuItem) {
		item.getObservers().attach(this, this.closeMenus, item.onmouseover);
	}
	this.m_items[this.m_items.length] = item;
}

function CBar_getNumItems() {
	return this.m_items.length;
}

function CBar_getId() {
	return this.m_id;
}

function CBar_get(index) {
	if(index >= 0 && index < this.getNumItems()) {
		return this.m_items[index];
	}
	return null;
}

function CBar_hide(index) {
	if(index > 0 && index < this.getNumItems()) {
		if(typeof this.m_items[i].hide == "function") {
			this.m_items[i].hide();
		}
	}
}

function CBar_show(index) {
	if(index > 0 && index < this.getNumItems()) {
		if(typeof this.m_items[i].show == "function") {
			this.m_items[i].show();
		}
	}
}


function CBar_enable(index) {
	if(index > 0 && index < this.getNumItems()) {
		if(typeof this.m_items[i].enable == "function") {
			this.m_items[i].enable();
		}
	}
}

function CBar_disable(index) {
	if(index > 0 && index < this.getNumItems()) {
		if(typeof this.m_items[i].disable == "function") {
			this.m_items[i].disable();
		}
	}
}

function CBar_getState(index) {
	if(index > 0 && index < this.getNumItems()) {
		if(typeof this.m_items[i].getState == "function") {
			this.m_items[i].getState();
		}
	}
}

function CBar_setMenuType(menuType) {
	this.m_menuType = menuType;
}

function CBar_getMenuType() {
	return this.m_menuType;
}

function CBar_setStyle(style) {
	this.m_style = style;
}

function CBar_setAlign(align) {
	this.m_align = align;
}

function CBar_getStyle() {
	return this.m_style;
}

function CBar_closeMenus(state) {
	// make sure we hide any submenus which have been opened.
	for(var i = 0; i < this.getNumItems(); i++) {
		var currentItem = this.get(i);
		if(typeof state == "object") {
			if(state.getSubject() == currentItem) {
				continue;
			}
		}
		if(typeof currentItem.getMenu == "function" && currentItem.getMenu() != null && currentItem.getMenu().isVisible()) {
			currentItem.getMenu().remove();
		}
	}
}

function CBar_getHTMLContainer() {
	return this.m_htmlContainer;
}

function CBar_getObservers() {
	return this.m_observers;
}

function CBar_onmouseover(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// notify our parent (if one exists) of this event
	if(this.getParent() != null && typeof this.getParent().onmouseover == "function") {
		this.getParent().onmouseover(evt);
	}

	// notify observers of this event
	this.getObservers().notify(CBar_onmouseover);
}

function CBar_onmouseout(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// notify our parent (if one exists) of this event
	if(this.getParent() != null && typeof this.getParent().onmouseout == "function") {
		this.getParent().onmouseout(evt);
	}

	// notify observers of this event
	this.getObservers().notify(CBar_onmouseout);
}

function CBar_onmouseup(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// notify our parent (if one exists) of this event
	if(this.getParent() != null && typeof this.getParent().onmouseup == "function") {
		this.getParent().onmouseup(evt);
	}

	// notify observers of this event
	this.getObservers().notify(CBar_onmouseup);
}

function CBar_onkeypress(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// notify our parent (if one exists) of this event
	if(this.getParent() != null && typeof this.getParent().onkeypress == "function") {
		this.getParent().onkeypress(evt);
	}

	// notify observers of this event
	this.getObservers().notify(CBar_onkeypress);
}

CBar.prototype.draw = CBar_draw;
CBar.prototype.add = CBar_add;
CBar.prototype.get = CBar_get;
CBar.prototype.hide = CBar_hide;
CBar.prototype.show = CBar_show;
CBar.prototype.enable = CBar_enable;
CBar.prototype.disable = CBar_disable;
CBar.prototype.getState = CBar_getState;
CBar.prototype.attachEvents = CBar_attachEvents;
CBar.prototype.drawItems = CBar_drawItems;
CBar.prototype.getId = CBar_getId;
CBar.prototype.setMenuType = CBar_setMenuType;
CBar.prototype.getMenuType = CBar_getMenuType;
CBar.prototype.getNumItems = CBar_getNumItems;
CBar.prototype.setStyle = CBar_setStyle;
CBar.prototype.getStyle = CBar_getStyle;
CBar.prototype.setAlign = CBar_setAlign;
CBar.prototype.closeMenus = CBar_closeMenus;
CBar.prototype.setParent = CBar_setParent;
CBar.prototype.getParent = CBar_getParent;
CBar.prototype.getHTMLContainer = CBar_getHTMLContainer;
CBar.prototype.getObservers = CBar_getObservers;
CBar.prototype.update = new Function("return true");
CBar.prototype.getObservers = CBar_getObservers;
CBar.prototype.onmouseover = CBar_onmouseover;
CBar.prototype.onmouseout = CBar_onmouseout;
CBar.prototype.onmouseup = CBar_onmouseup;
CBar.prototype.onkeypress = CBar_onkeypress;
CBar.prototype.hideBar = CBar_hideBar;
CBar.prototype.showBar = CBar_showBar;
CBar.prototype.toggleBar = CBar_toggleBar;
/*

Class CStaticText

Static text to be shown in the banner or header

*/
function CStaticText(text, style)
{
	this.m_text = text;
	this.m_style = style;
	this.m_bVisible = true;
	this.m_sId = "";
}

CStaticText.prototype.setId = function(sId)
{
	this.m_sId = sId;
};

CStaticText.prototype.getId = function()
{
	return this.m_sId;
};

CStaticText.prototype.setText = function(text)
{
	this.m_text = text;
};

CStaticText.prototype.setLabelledBy = function(text) 
{
	this.m_labelledBy = text;
};

CStaticText.prototype.draw = function()
{
	var html="";

	html += '<td style="white-space: nowrap;" class="';
	html += this.m_style.getNormalState() + '"';
	if (this.getId() != "")
	{
		html += ' id="' + this.getId() + '"';
	}
	html += '>';
	var labelledByAttribute = this.m_labelledBy ? 'aria-labelledby="' + this.getId() + 'label"' : "";
	html += '<div role="presentation" tabIndex="0" ' + labelledByAttribute + '>';
	html += this.m_text;
	html += '</div>';
	if (this.m_labelledBy) {
		html += '<div style="position: absolute; overflow: hidden; width: 0; height: 0;" id="' + this.getId() + 'label">';
		html += this.m_labelledBy;
		html += '</div>';
	}
	
	html += '</td>';

	return html;
};

CStaticText.prototype.isVisible = function()
{
	return this.m_bVisible;
};

CStaticText.prototype.hide = function()
{
	this.m_bVisible = false;
};

CStaticText.prototype.hide.show = function()
{
	this.m_bVisible = true;
};

/* Constants */
var DISPLAY_INLINE = 'inline';
var DISPLAY_NONE = "none";
var DISPLAY_BLOCK = "block";

