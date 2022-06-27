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
/**
 * CViewerToolbar
 * @constructor
 */
function CViewerToolbar()
{
	this.m_specification = null;
	this.m_oCBar = null;
	this.m_sWebContentRoot = null;
	this.m_sSkin = null;
}

/**
 * Returns the namespace defined in the JSON specification
 * @return (string)
 */
CViewerToolbar.prototype.getNamespace = function()
{
	if(this.m_specification && typeof this.m_specification.namespace != "undefined")
	{
		return this.m_specification.namespace;
	}

	return "";
};

/**
 * Returns the webContentRoot
 * @return (string)
 */
CViewerToolbar.prototype.getSkin = function()
{
	if (this.m_sSkin == null)
	{
		var oCV = null;
		try
		{
			oCV = getCognosViewerObjectRef(this.getNamespace());
		}
		catch(exception){}

		if (oCV)
		{
			this.m_sSkin = oCV.getSkin();
		}
		else
		{
			this.m_sSkin = this.getWebContentRoot() + "/skins/corporate";
		}
	}

	return this.m_sSkin;
};


/**
 * Returns the webContentRoot
 * @return (string)
 */
CViewerToolbar.prototype.getWebContentRoot = function()
{
	if (this.m_sWebContentRoot == null)
	{
		var oCV = null;
		try
		{
			oCV = getCognosViewerObjectRef(this.getNamespace());
		}
		catch(exception){}
		if (oCV)
		{
			this.m_sWebContentRoot = oCV.getWebContentRoot();
		}
		else
		{
			this.m_sWebContentRoot = "..";
		}
	}

	return this.m_sWebContentRoot;
};

/**
 * Returns the div id where the toolbar renders itself
 * @return (string)
 */
CViewerToolbar.prototype.getDivId = function()
{
	if(this.m_specification && typeof this.m_specification.divId != "undefined")
	{
		return this.m_specification.divId;
	}

	return "";
};

/**
 * Returns the local defined style used by the viewer front end
 * @return (string)
 */
CViewerToolbar.prototype.getStyle = function()
{
	if(this.m_specification && typeof this.m_specification.style != "undefined")
	{
		return this.m_specification.style;
	}

	return "";
};

/**
 * Returns the toolbar specification (CViewerToolbarSpecification) defined by the JSON specification passed in to the initialize method
 * @return CViewerToolbarSpecification
 */
CViewerToolbar.prototype.getToolbarSpecification = function()
{
	if(this.m_specification && typeof this.m_specification.S != "undefined")
	{
		return new CViewerToolbarSpecification(this,this.m_specification.S);
	}

	return null;
};

/**
 * Returns the ui item specified by the id (the id should not contain the namespace, the viewer toolbar will look after appending it
 * @return UI item (CMenuItem, CToolbarButton, StaticText, etc)
 */
CViewerToolbar.prototype.getItem = function(sId)
{
	if(this.m_oCBar)
	{
		var numItems = this.m_oCBar.getNumItems();
		sId = this.getNamespace() + sId;
		for(var index = 0; index < numItems; ++index)
		{
			var uiItem = this.m_oCBar.get(index);
			if(typeof uiItem.getId == "function" && uiItem.getId() == sId)
			{
				return uiItem;
			}
		}
	}

	return null;
};

/**
 * Initializes the viewer toolbar
 * @param jsonSpecification - JSON object specification
 */
CViewerToolbar.prototype.init = function(jsonSpecification)
{
	if(typeof jsonSpecification != "undefined" && typeof jsonSpecification == "object" && jsonSpecification != null)
	{
		this.m_specification = jsonSpecification;
	}
};

/**
 * Returns the CBar object
 */
CViewerToolbar.prototype.getCBar = function()
{
	if (!this.m_oCBar && this.m_specification)
	{
		this.load();
	}
	return this.m_oCBar;
};

/**
 * Creates a CBar object using the json specification
 */
CViewerToolbar.prototype.load = function()
{
	var toolbar = null;

	if(this.m_specification != null)
	{
		var divId = this.getDivId();
		var divNode = document.getElementById(divId);
		var toolbarSpecification = this.getToolbarSpecification();
		if(divNode && toolbarSpecification)
		{
			toolbar = toolbarSpecification.draw();
		}
	}
	this.m_oCBar = toolbar;

	return toolbar;
};

/**
 * Renders the viewer toolbar within the containing <div> element.
 */
CViewerToolbar.prototype.draw = function()
{
	if (this.m_oCBar)
	{
		this.m_oCBar.draw();
	}
};

/**
 * CViewerToolbarSpecification
 * @constructor
 */
function CViewerToolbarSpecification(viewerToolbar, jsonSpecification)
{
	this.m_viewerToolbar = viewerToolbar;
	this.m_toolbarSpecification = jsonSpecification;
}

/**
 * Builds ui elements using the toolbar specification
 */
CViewerToolbarSpecification.prototype.draw = function()
{
	if(this.m_toolbarSpecification)
	{
		var toolbarStyle = gToolbarStyle;
		if (this.m_viewerToolbar.getStyle() === 'banner')
		{
			toolbarStyle = gBannerToolbarStyle;
		}

		var toolbar = new CBar(this.m_viewerToolbar.getDivId(), toolbarStyle, null, this.m_viewerToolbar.getWebContentRoot());

		toolbar.setMenuType(cHorizonalBar);  // TODO: Where is cHorizontalBar defined?
		toolbar.style = this.m_viewerToolbar.getStyle();
		toolbar.setAlign("right");

		// have we placed a button, menuItem on the toolbar yet
		var bToolbarHasItem = false;
		// keeps the seperatorSpec until we go to place the next item
		var oSeperatorObj = null;
		var oSeperatorSpecification = null;

		for (var iIndex=0; iIndex < this.m_toolbarSpecification.length; iIndex++)
		{
			for(var uiItem in this.m_toolbarSpecification[iIndex])
			{
				try
				{
					var object = eval("new " + uiItem + "();");

					// P = Seperator
					if (uiItem == "P")
					{
						if (bToolbarHasItem && oSeperatorSpecification == null)
						{
							oSeperatorObj = object;
							oSeperatorSpecification = this.m_toolbarSpecification[iIndex][uiItem];
						}
					}
					else
					{
						bToolbarHasItem = true;

						if (oSeperatorSpecification != null && oSeperatorObj != null)
						{
							oSeperatorObj.load(toolbar, oSeperatorSpecification, this.m_viewerToolbar);
							oSeperatorObj = null;
							oSeperatorSpecification = null;
						}

						object.load(toolbar, this.m_toolbarSpecification[iIndex][uiItem], this.m_viewerToolbar);
					}
				}
				catch(exception){}
			}
		}

		return toolbar;
	}

	return null;
};


// CVButton
function B(){}

B.prototype.isValid = function(jsonSpecification)
{
	if(jsonSpecification != null)
	{
		return true;
	}

	return false;
};

B.prototype.load = function(parentObject, jsonSpecification, viewerToolbar)
{
	if(this.isValid(jsonSpecification))
	{
		var sTooltip = "";
		var sImage = "";
		var sAction = "";
		var sName = jsonSpecification.N;

		var menuItems = null;
		if (typeof jsonSpecification.M != "undefined" && jsonSpecification.M.IS != "undefined")
		{
			menuItems = jsonSpecification.M.IS;
		}

		// if we don't have an icon defined, then use the first menu item for the button
		if (typeof jsonSpecification.C == "undefined")
		{
			if(menuItems)
			{
				var firstMenuItem = menuItems[0]["I"];
				if (firstMenuItem != null && this.isValid(firstMenuItem))
				{
					sTooltip = firstMenuItem.O;
					if (typeof sTooltip == "undefined" || sTooltip == "")
					{
						sTooltip = firstMenuItem.E;
					}
					sImage = firstMenuItem.C;
					sAction = firstMenuItem.A;
				}
			}
		}
		else
		{
			sTooltip = jsonSpecification.O;
			sImage = jsonSpecification.C;
			sAction = jsonSpecification.A;
		}

		var toolbarButton = null;

		if (viewerToolbar.getStyle() === "banner")
		{
			toolbarButton = new CMenuItem(parentObject, "", sAction, sImage, gBannerButtonStyle, viewerToolbar.getWebContentRoot(), viewerToolbar.getSkin());
			toolbarButton.setDropDownArrow("dropdown_arrow_banner.gif");
		}
		else
		{
			toolbarButton = new CMenuItem(parentObject, "", sAction, sImage, gMenuItemStyle, viewerToolbar.getWebContentRoot(), viewerToolbar.getSkin());
			toolbarButton.setDropDownArrow("dropdown_arrow_narrow.gif");
		}

		toolbarButton.setId(viewerToolbar.getNamespace() + sName);
		toolbarButton.setToolTip(sTooltip);

		if (typeof jsonSpecification.ALT != "undefined")
		{
			toolbarButton.setAltText(jsonSpecification.ALT);
		}

		if(typeof jsonSpecification.D != "undefined" && jsonSpecification.D == "true")
		{
			toolbarButton.disable();
		}

		if(typeof jsonSpecification.M != "undefined")
		{
			var menuSpecification = jsonSpecification.M;

			// only add the menu if there's more then one entry, or we have a callback to populate the menu
			if	(
					typeof menuSpecification.Y != "undefined" &&
					(
						typeof menuSpecification.A != "undefined" ||
						(menuItems && menuItems.length > 1) ||
						(typeof menuSpecification.H == "undefined" || menuSpecification.H == "false")
					)
				)
			{
				var menu = new M();
				toolbarButton.m_menu = menu.load(parentObject, menuSpecification, viewerToolbar);
				toolbarButton.m_menu.setParent(toolbarButton);
				toolbarButton.m_menuType = menuSpecification.Y;
			}
		}

		return toolbarButton;
	}

	return null;
};

// Menu Item
function I(){}

I.prototype.isValid = function(jsonSpecification)
{
	if(typeof jsonSpecification != "undefined" && jsonSpecification != null)

	{
		return true;
	}

	return false;
};

I.prototype.load = function(parentObject, jsonSpecification, viewerToolbar)
{
	if(this.isValid(jsonSpecification))
	{
		var sText = jsonSpecification.E;
		var sImage = jsonSpecification.C;
		var sAction = jsonSpecification.A;
		var sName = jsonSpecification.N;

		var menuItems = null;
		if (typeof jsonSpecification.M != "undefined" && jsonSpecification.M.IS != "undefined")
		{
			menuItems = jsonSpecification.M.IS;
		}

		// if we don't have an icon defined, then use the first menu item for the button
		if (typeof jsonSpecification.E == "undefined")
		{
			if(menuItems && menuItems[0])
			{
				var firstMenuItem = menuItems[0]["I"];
				if (firstMenuItem != null && this.isValid(firstMenuItem))
				{
					sText = firstMenuItem.E;
					if (typeof sText == "undefined" || sText == "")
					{
						sText = firstMenuItem.O;
					}
					sAction = firstMenuItem.A;
				}
			}
			else {
				return null;
			}
		}
		else
		{
			sText = jsonSpecification.E;
			sImage = jsonSpecification.C;
			sAction = jsonSpecification.A;
		}

		var menuStyle = null;

		if (parentObject.style && parentObject.style === "banner")
		{
			menuStyle = gBannerItemStyle;
		}
		else
		{
			menuStyle = gMenuItemStyle;
		}

		var menuItem = new CMenuItem(parentObject, sText, sAction, sImage, menuStyle, viewerToolbar.getWebContentRoot(), viewerToolbar.getSkin());

		if(typeof jsonSpecification.ALT != "undefined")
		{
			menuItem.setAltText(jsonSpecification.ALT);
		}

		if (parentObject.style && parentObject.style === "banner")
		{
			menuItem.setDropDownArrow("dropdown_arrow_banner.gif");
		}
		else
		{
			menuItem.setDropDownArrow("dropdown_arrow_narrow.gif");
		}

		menuItem.setId(viewerToolbar.getNamespace() + sName);

		if(typeof jsonSpecification.D != "undefined" && jsonSpecification.D == "true")
		{
			menuItem.disable();
		}

		if(typeof jsonSpecification.M != "undefined")
		{
			var menuSpecification = jsonSpecification.M;

			// only add the menu if there's more then one entry, or we have a callback to populate the menu
			if	(
					typeof menuSpecification.Y != "undefined" &&
					(
						typeof menuSpecification.A != "undefined" ||
						(menuItems && menuItems.length > 1) ||
						(typeof menuSpecification.H == "undefined" || menuSpecification.H == "false")
					)
				)
			{
				var menu = new M();
				menuItem.m_menu = menu.load(parentObject, menuSpecification, viewerToolbar);
				menuItem.m_menu.setParent(menuItem);
				menuItem.m_menuType = jsonSpecification.M.Y;
			}
		}

		return menuItem;
	}

	return null;
};

// Menu
function M(){}

M.prototype.isValid = function(jsonSpecification)
{
	return (typeof jsonSpecification != "undefined" && jsonSpecification != null && typeof jsonSpecification.id != "undefined");
};

M.prototype.load = function(parentObject, jsonSpecification, viewerToolbar)
{
	if(this.isValid(jsonSpecification))
	{
		var menu = new CMenu(jsonSpecification.id, gMenuStyle, viewerToolbar.getWebContentRoot());
		menu.setParent(parentObject);

		if (typeof jsonSpecification.ALT != "undefined")
		{
			menu.setAltText(jsonSpecification.ALT);
		}

		try
		{
			menu.m_oCV = getCognosViewerObjectRef(viewerToolbar.getNamespace());
		}
		catch(e){}//if we can't get the cognos viewr object, eat the exception

		if(typeof jsonSpecification.A != "undefined")
		{
			menu.registerCallback(jsonSpecification.A);
		}

		var menuItems = jsonSpecification.IS;
		if (menuItems)
		{
			for(var iIndex=0; iIndex < menuItems.length; iIndex++)
			{
				for(var uiItem in menuItems[iIndex])
				{
					try
					{
						var menuItem = new I();
						menuItem.load(menu, menuItems[iIndex][uiItem], viewerToolbar);
					}
					catch(exception){}
				}
			}
		}

		return menu;
	}

	return null;
};

// StaticText
function T(){}

T.prototype.isValid = function(jsonSpecification)
{
	return (typeof jsonSpecification != "undefined" && jsonSpecification != null && typeof jsonSpecification.E != "undefined");
};

T.prototype.load = function(parentObject, jsonSpecification, viewerToolbar)
{
	if(this.isValid(jsonSpecification))
	{
		var textStyle = null;

		if (viewerToolbar.getStyle() === "banner")
		{
			textStyle = gBannerStaticText;
		}
		else
		{
			//todo
		}

		if (jsonSpecification.E && jsonSpecification.E.length > 0) {
			var oStaticText = new CStaticText(jsonSpecification.E, textStyle);
			if (jsonSpecification.N == "userName")
			{
				oStaticText.setId("userNameTD" + viewerToolbar.getNamespace());
			}
			
			if (jsonSpecification.ALT) {
				oStaticText.setLabelledBy(jsonSpecification.ALT + " " + jsonSpecification.E);
			}
			
			parentObject.add(oStaticText);
		}
	}
	return null;
};

// Link
function L(){}

L.prototype.isValid = function(jsonSpecification)
{
	return (typeof jsonSpecification != "undefined" && jsonSpecification != null && typeof jsonSpecification.E != "undefined");
};

L.prototype.load = function(parentObject, jsonSpecification, viewerToolbar)
{
	if(this.isValid(jsonSpecification))
	{
		var linkStyle = null;

		if (viewerToolbar.getStyle() === "banner")
		{
			linkStyle = gBannerLink;
		}
		else
		{
			//todo
		}

		var sAction = jsonSpecification.A;

		// todo: for now simply use the CMenuItem class
		var menuItem = new CMenuItem(parentObject, jsonSpecification.E, sAction, "", linkStyle, viewerToolbar.getWebContentRoot(), viewerToolbar.getSkin());

		// Workaround since CMenuItem currently looks at all its siblings to see if one has an icon
		menuItem.iconPlaceholder = false;

		if (jsonSpecification.ALT != "undefined")
		{
			menuItem.setAltText(jsonSpecification.ALT);
		}

		return menuItem;
	}

	return null;
};

// Seperator
function P() {}

P.prototype.isValid = function(jsonSpecification)
{
	return (typeof jsonSpecification != "undefined" && jsonSpecification != null && typeof jsonSpecification.Y != "undefined");
};

P.prototype.load = function(parentObject, jsonSpecification, viewerToolbar)
{
	if(this.isValid(jsonSpecification))
	{
		var seperator = new CSeperator(jsonSpecification.Y, "", "", viewerToolbar.getWebContentRoot());
		if (viewerToolbar.getStyle() === "banner")
		{
			seperator.setToolbarSeperatorClass("bannerDivider");
		}
		else
		{
			seperator.setToolbarSeperatorClass("toolbarDivider");
		}

		parentObject.add(seperator);

		return seperator;
	}

	return null;
};
