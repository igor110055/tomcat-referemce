/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/



//-----------------------------------------------------------------------------
/**
 * I represent a single MenuItem in a Menu Grouop
 *
 * @param anId - some unique id
 * @param aText - the text to display
 * @param aOnClick - the javascript to execute when a click occurs
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function MenuItem (anId, aText, aOnClick)
{
   if (arguments.length > 0)
   {
      this.id = anId;
      this.text = aText;
      this.onClick = aOnClick;

      this.children = new Array();


      this.expanded = false;
      this.selected = false;


      //--- css contains all style type properties for this item...
      this.css = new Object();

      this.css.selected = null;
      this.css.nonSelected = null;

      this.css.selectedIcon = null;
      this.css.nonSelectedIcon = null;

      this.menuGroup = null;
      this.parent = null;

      //--- dom contains all variables which point to current, active dom elements for this item.
      this.dom = new Object();

      this.dom.row = null;
      this.dom.childExpandIcon = null;
      this.dom.itemIcon = null;
   }
}


/*
 * @return if any descendant is selected, returns it, otherwise returns null...
 */
MenuItem.prototype.getSelectedDescendant = function()
{
   if (this.selected)
   {
      return this;
   }

   var i;

   for (i = 0; i < this.children.length; ++i)
   {
      var selected = this.children[i].getSelectedDescendant();

      if (selected != null)
      {
         return selected;
      }
   }

   return null;
};

/**
 * @private
 **/
MenuItem.prototype.postInsert = function()
{
   this.dom.row = $(this.getRowId());

   if (!this.dom.row)
      alert("didn't find [" + this.getRowId() + "]");

   Event.observe(this.dom.row, "mouseover", function(anEvent) { this.onMouseOver(); }.bind(this), false);
   Event.observe(this.dom.row, "mouseout", function(anEvent) { this.onMouseOut(); }.bind(this), false);

   Event.observe($(this.getRowId()), "click", function(anEvent) {
      var target = Event.element(anEvent);

      if (Element.hasClassName(target, "miExpandCollapseIcon"))
      {
         this.toggleExpansion();
      }
      else
      {
         this.select();
      }

   }.bind(this), true);


   if (this.children.length > 0)
   {
      var icons = this.dom.row.getElementsByTagName("img");

      this.dom.childExpandIcon = icons[0];

      if(this.css.selectedIcon)
      {
         this.dom.itemIcon = icons[1];
      }
   }
   else
   {
      if(this.css.selectedIcon)
      {
         this.dom.itemIcon = this.dom.row.getElementsByTagName("img")[0];
         Event.observe(this.dom.itemIcon, "click", function(anEvent) { this.select(); }.bind(this), false);
      }
   }

   //--- recurse...
   for (var i = 0; i < this.children.length; ++i)
   {
      this.children[i].postInsert();
   }

   if (this.expanded == false)
   {
      this.collapseChildNodes();
   }
   this.swapExpansionIcon();
};


/**
 * unwire this js object from the dom...
 **/
MenuItem.prototype._unwire = function()
{
   this.dom.row.className = null;
   this.dom.row = null;

   //this.dom.itemIcon.src = null;
   this.dom.itemIcon = null;

   if (this.dom.childExpandIcon)
   {
      //this.dom.childExpandIcon.src = null;
      this.dom.childExpandIcon = null;
   }

   this.dom = null;
};



/**
 * Add a child menu item to this menu item.  Usually done during menu construction time.
 *
 * @param aChild - a child MenuItem
 **/
MenuItem.prototype.addChild = function(aChild)
{
   this.children.push(aChild);

   aChild.menuGroup = this.menuGroup;
   aChild.parent = this;

   //--- default values to parent nodes...
   if (!aChild.css.selected)
      aChild.css.selected = this.css.selected;

   if (!aChild.css.nonSelected)
      aChild.css.nonSelected = this.css.nonSelected;

   if (!aChild.css.selectedIcon)
      aChild.css.selectedIcon = this.css.selectedIcon;

   if (!aChild.css.nonSelectedIcon)
      aChild.css.nonSelectedIcon = this.css.nonSelectedIcon;

   return aChild;
};


/**
 * hide this MenuItem
 **/
MenuItem.prototype.hide = function()
{
   if (this.selected)
   {
      this.unselect();
   }
   var itemTextDiv = document.getElementById(this.getRowId()+'_text');
   itemTextDiv.style.display = 'none';

   this.dom.itemIcon.height = 0;
   this.dom.itemIcon.src = '';
   this.dom.row.className = 'miHiddenItem';
   this.dom.row.onclick = function () { return false; };



   if (this.parent.children.length == 1)
   {
      this.parent.dom.childExpandIcon.height = 0;
      if (this.parent.expanded)
      {
         this.parent.expanded = false;
	   }
   }
};

/**
 * show this MenuItem (unhide it)
 **/
MenuItem.prototype.show = function()
{
   this.menuGroup.menuBar.getCurrentlySelectedItem().unselect();
   var itemTextDiv = document.getElementById(this.getRowId()+'_text');
   itemTextDiv.style.display = 'block';

   this.dom.itemIcon.height = 16;
   this.dom.itemIcon.src = this.css.selectedIcon;
   this.dom.row.className = this.css.selected;
   this.selected = true;

   if (this.parent.children.length == 1)
   {
      this.parent.dom.childExpandIcon.height = 16;
      if (this.parent.expanded == false)
      {
	      this.parent.toggleExpansion();
	   }
   }
};


/**
 * @private
 **/
MenuItem.prototype.getRowId = function()
{
   if (this.parent)
   {
      return this.parent.getRowId() + "_" + this.id;
   }

   return "mi_" + this.menuGroup.id + "_" + this.id;
};



/**
 * causes this MenuItem to be selected
 **/
MenuItem.prototype.select = function()
{

   if (this.menuGroup.menuBar.selectedItem)
   {
      this.menuGroup.menuBar.selectedItem.unselect();
   }

   this.menuGroup.menuBar.selectedItem = this;

   this.menuGroup.toggleTitle();

   this.dom.row.className = this.css.selected;
   this.dom.itemIcon.src = this.css.selectedIcon;

   this.selected = true;

   if (JsUtil.isGood(this.parent))
   {
      this.parent.childSelected();
   }


   if (this.menuGroup.menuBar.disableOnClick != true)
   {
      eval(this.onClick);
   }


};

/**
 * causes this MenuItem to be unselected
 **/
MenuItem.prototype.unselect = function()
{
   this.dom.row.className = this.css.nonSelected;
   this.dom.itemIcon.src = this.css.nonSelectedIcon;

   this.selected = false;
   if (JsUtil.isGood(this.parent))
   {
      this.parent.childUnselected();
   }
};


/**
 * @private
 **/
MenuItem.prototype.onMouseOver = function()
{
   if (this.selected == false)
   {
      this.dom.row.className = "miHoverItem";
   }

};

/**
 * @private
 **/
MenuItem.prototype.onMouseOut = function()
{
   if (this.selected == false)
   {
      this.dom.row.className = this.css.nonSelected;
   }

};



/**
 * @private
 **/
MenuItem.prototype.childSelected = function()
{
   this.dom.itemIcon.src = this.css.selectedIcon;
   if (!this.expanded)
   {
      this.toggleExpansion();
   }
   if (JsUtil.isGood(this.parent))
   {
      this.parent.childSelected();
   }
};

/**
 * @private
 **/
MenuItem.prototype.childUnselected = function()
{
   this.dom.itemIcon.src = this.css.nonSelectedIcon;
   if (JsUtil.isGood(this.parent))
   {
      this.parent.childUnselected();
   }
};

/**
 * @private
 **/
MenuItem.prototype.swapExpansionIcon = function()
{
   if (this.css.selectedIcon)
   {
      this.dom.itemIcon.src = (this.expanded ? this.css.selectedIcon : this.css.nonSelectedIcon);
   }
};

/**
 * toggles the open/closed state of this MenuItem (valid if this item has child
 * items).
 **/
MenuItem.prototype.toggleExpansion = function()
{
   if (this.dom.childExpandIcon)
   {
      if (this.expanded)
      {
         this.collapseChildNodes();
      }
      else
      {
         this.expandChildNodes();
      }
   }
   else
   {
      this.swapExpansionIcon();
   }
//   this.menuGroup.menuBar.updateMenuHeight();
};

/**
 * expands all child nodes
 **/
MenuItem.prototype.expandChildNodes = function()
{

   this.dom.childExpandIcon.src = this.menuGroup.css.minusIcon;

   var childDiv = this.getChildDivElement();
   if (childDiv)
   {
      childDiv.className = this.menuGroup.css.nestedItemsDiv;
   }

   this.expanded = true;

   this.swapExpansionIcon();
};

/**
 * collapses all child nodes
 **/
MenuItem.prototype.collapseChildNodes = function()
{
   if (this.children.length > 0)
   {
 	  this.dom.childExpandIcon.src = this.menuGroup.css.plusIcon;
   }

   var childDiv = this.getChildDivElement();
   if (childDiv)
   {
      childDiv.className = this.menuGroup.css.hidden;
   }

   this.expanded = false;
   this.swapExpansionIcon();

};


/**
 * @private
 **/
MenuItem.prototype.getChildDivElement = function()
{
   var divNode = null;

   if (this.children.length > 0)
   {
      divNode = this.children[0].dom.row.parentNode;

      while(divNode.tagName.toLowerCase() != "div")
      {
         divNode = divNode.parentNode;
      }
   }

   return divNode;
};



/**
 * @private
 **/
MenuItem.prototype.getExpandCollapseIconHtml = function()
{
   if (this.children.length > 0)
   {
      return '<img src="' + this.menuGroup.css.minusIcon + '" class="miExpandCollapseIcon"/>';
   }

   return '';
};

/**
 * @private
 **/
MenuItem.prototype.getItemIconHtml = function()
{
   if (this.css.selected)
   {
      return '<img src="' + this.css.selectedIcon + '" class="miIcon"/>';
   }
   else
   {
      return '<img src="' + this.css.nonSelectedIcon + '" class="miIcon"/>';
   }
};


/**
 * @private
 **/
MenuItem.prototype.toHtml = function()
{
   var html = '<tr class="' + this.css.nonSelected + '" id="' +  this.getRowId() + '" >' +
              '   <td class="miIcons">' + this.getExpandCollapseIconHtml() + this.getItemIconHtml() + '</td>' +
              '   <td class="miText"><div id="' + this.getRowId()+'_text">' + this.text + '</div></td>' +
              '</tr>';


   if (this.children.length > 0)
   {
      html += '<tr><td align="left" colspan="2"><div class="miNestedItemsDiv" style="padding-left:10px"><table width="100%" border="0" cellpadding="0" cellspacing="0">';

      for (var i = 0; i < this.children.length; ++i)
      {
         html += this.children[i].toHtml();
      }
      html += '</table></div></td></tr>';

   }

   return html;
};


/**
 * @private
 **/

MenuItem.prototype.getItemById = function(anId)
{
   if (this.id == anId)
   {
      return this;
   }

   var item = null;
   for (var i = 0; i < this.children.length; ++i)
   {
      item = this.children[i].getItemById(anId);

      if (item != null)
      {
         return item;
      }
   }

   return null;
};




//-----------------------------------------------------------------------------
/**
 * I represent a group of items in the menubar.
 *
 * @param aParentMenuBar - the menubar which owns this group
 * @param anId - some unique id
 * @param aText - the text to display
 * @param aOpen - whether or not this group is open
 * @param aItemSelectedCss - the CSS class to use for selected items
 * @param aItemNonSelectedCss - the CSS class ot use for non selected items.
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function MenuGroup (aParentMenuBar, anId, aText, aOpen, aItemSelectedCss, aItemNonSelectedCss)
{
   if (arguments.length > 0)
   {
      this.menuBar = aParentMenuBar;

      this.id = anId;
      this.text = aText;
      this.isOpen = aOpen;

      this.items = new Array();

      this.index = -1;

      //--- default css settings for this MenuGroup, can be overridden...
      this.css = new Object();

      this.css.itemSelectedCss = aItemSelectedCss;
      this.css.itemNonSelectedCss = aItemNonSelectedCss;

      this.css.itemSelectedIcon = null;
      this.css.itemNonSelectedIcon = null;

      this.css.nestedItemsDiv = "miNestedItemsDiv";

      this.css.headerDivOn  = "mgHeaderDivOn";
      this.css.headerDivOff = "mgHeaderDivOff";
      this.css.bodyDiv      = "mgBodyDiv";
      this.css.hidden       = "mgHidden";


      this.css.openIcon    = this.menuBar.baseContext + "/images/triangleDown.gif";
      this.css.closedIcon  = this.menuBar.baseContext + "/images/triangleRight.gif";

      this.css.minusIcon = this.menuBar.baseContext + "/images/minus.gif";
      this.css.plusIcon  = this.menuBar.baseContext + "/images/plus.gif";


      //--- initialized elsewhere...
      this.headerDiv = null;
      this.headerImage = null;
      this.bodyDiv = null;
   }
}

/**
 * grab the currently selected item
 **/
MenuGroup.prototype.getCurrentlySelectedItem = function()
{
   var i;
   var selected = null;

   for (i = 0; i < this.items.length; ++i)
   {
      selected = this.items[i].getSelectedDescendant();

      if (selected)
         return selected;
   }

   return null;
};


/**
 * toggle the "selected" state of this group's title (it will be on if a
 * menuitem in this group is selected, off otherwise).
 **/

MenuGroup.prototype.toggleTitle = function()
{
   this.menuBar.groups.each(function (aGroup) {

      $(aGroup.getTitleDivId()).className =
         (aGroup.id == this.id) ? "mgGroupTitleOn" : "mgGroupTitleOff";

   }.bind(this));
};

/**
 * add a MenuItem to this group. Usually done during menu construction time.
 **/
MenuGroup.prototype.addItem = function(anItem)
{
   this.items.push(anItem);

   anItem.menuGroup = this;


   //--- provide group defaults if the following properties have not been explicitly
   //    set already...
   if (!anItem.css.selected)
      anItem.css.selected = this.css.itemSelectedCss;

   if (!anItem.css.nonSelected)
      anItem.css.nonSelected = this.css.itemNonSelectedCss;

   if (!anItem.css.selectedIcon)
      anItem.css.selectedIcon = this.css.itemSelectedIcon;

   if (!anItem.css.nonSelectedIcon)
      anItem.css.nonSelectedIcon = this.css.itemNonSelectedIcon;

   return anItem;
};

/**
 * @private
 **/

MenuGroup.prototype.getItemById = function(anId)
{
   var item = null;

   for(var i = 0; i < this.items.length; ++i)
   {
      item = this.items[i].getItemById(anId);
      if (item != null)
      {
         return item;
      }
   }
   return null;
};


/**
 * @private
 **/
MenuGroup.prototype.getHeaderDivId = function()
{
   return "mg_" + this.id + "_hdr";
};


/**
 * @private
 **/
MenuGroup.prototype.getBodyDivId = function()
{
   return "mg_" + this.id + "_body";
};

/**
 * @private
 **/
MenuGroup.prototype.getTitleDivId = function()
{
   return "mg_" + this.id + "_title";
};


/**
 * toggles this group on and off...
 *
 **/
MenuGroup.prototype.toggleGroup = function()
{
   if (this.isOpen)
   {
      this.closeGroup();
   }
   else
   {
      this.openGroup();
   }
};

/**
 * closes this group
 **/
MenuGroup.prototype.closeGroup = function()
{
   this.bodyDiv.className = this.css.hidden;
   this.headerImage.src = this.css.closedIcon;
   this.headerDiv.className = this.css.headerDivOff;

   this.isOpen = false;;
};

/**
 * opens this group
 **/
MenuGroup.prototype.openGroup = function()
{
   this.bodyDiv.className = this.css.bodyDiv;
   this.headerImage.src = this.css.openIcon;
   this.headerDiv.className = this.css.headerDivOn;

   this.isOpen = true;
};

               


/**
 * @private
 **/
MenuGroup.prototype.postInsert = function()
{
   this.bodyDiv = $(this.getBodyDivId());
   this.headerDiv = $(this.getHeaderDivId());

   Event.observe(this.headerDiv, "click", function () { this.toggleGroup() }.bind(this), false);

   this.headerImage = this.headerDiv.getElementsByTagName("img")[0];

   for (var i = 0; i < this.items.length; ++i)
   {
      this.items[i].postInsert();
   }

   if (this.isOpen == false)
   {
      this.closeGroup();
   }
};


/**
 * @private
 **/
MenuGroup.prototype._unwire = function()
{
   this.items.each(function (anItem) {
      anItem._unwire();
   });
};




/**
 * @private
 **/
MenuGroup.prototype.toHtml = function()
{
   var height = '';

   var html = '';

   //id="' + this.getTitleDivId() + '"

   html += '<div class="mgMenuGroupContainer">' +
           '<div id="' + this.getHeaderDivId() + '" class="' + this.css.headerDivOn + '">' +
           '   <table border="0" width="100%">' +
           '      <tr>' +
           '        <td width="20px" align="left"><img src="' + this.css.openIcon + '"/></td>' +
           '        <td id="' + this.getTitleDivId() + '" class="mgGroupTitleOff" align="left">' + this.text + '</td>' +
           '      </tr>' +
           '   </table>' +
           '</div>' +
           '<div id="' + this.getBodyDivId() + '" class="' + this.css.bodyDiv + '" style="height:' + height + '">' +
           '   <table border="0" border="0" cellpadding="0" cellspacing="0" width="100%">';

   for (var i = 0; i < this.items.length; ++i)
   {
      html += this.items[i].toHtml();
   }

   html += '   </table>' +
           '</div>' +
           '</div>';

   return html;
};


/**
 * @private
 **/
MenuGroup.prototype.hideItem = function(anId)
{
   var item = this.getItemById(anId);
   if (item != null)
   {
      item.hide();
   }
};

MenuGroup.prototype.showItem = function(anId)
{
   var item = this.getItemById(anId);
   if (item != null)
   {
      item.show();
   }
};



//-----------------------------------------------------------------------------
/**
 * I represent a MenuBar which can contain many MenuGroups (which in turn can
 * contain many MenuItems).
 *
 * @param aInsertionPoint - where to insert the menu
 * @param anId - base url of the webapp (used for images)
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/

function MenuBar (aInsertionPoint, aBaseContext)
{
   if (arguments.length > 0)
   {
      this.insertionPoint = aInsertionPoint;
      this.disableOnClick = false;

      this.groups = new Array();

      this.baseContext = aBaseContext;

      DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
         this._unwire();
      }.bind(this));
   }
}


/**
 * @private
 **/
MenuBar.prototype._unwire = function()
{
   //alert("unwiring menubar");
   this.groups.each(function (aGroup) {
      aGroup._unwire();
   });
};





/**
 * create a new MenuGroup for this bar
 **/
MenuBar.prototype.createGroup = function (anId, aText, aOpen, aItemSelectedCss, aItemNonSelectedCss)
{
   var newGroup = new MenuGroup (this, anId, aText, aOpen, aItemSelectedCss, aItemNonSelectedCss);
   this.groups.push(newGroup);

   newGroup.index = this.groups.length-1;

   return newGroup;
};

/**
 * expand all groups...
 **/
MenuBar.prototype.openAllGroups = function ()
{
   for (var i = 0; i < this.groups.length; ++i)
   {
      this.groups[i].openGroup();
   }
};


/**
 * inserts this menu into the HTML document at the designated insertion point.  Call this
 * once when you first get ready to display the menu (usually when the document's
 * onload event fires).
 **/
MenuBar.prototype.insertIntoDocument = function()
{
   var containerDiv = $(this.insertionPoint);

   var displayProperty = containerDiv.style.display;
   containerDiv.style.display = 'none';

   var html = '';

   for (var i = 0; i < this.groups.length; ++i)
   {
      html += this.groups[i].toHtml();
   }

   containerDiv.innerHTML = html;


   for (var i = 0; i < this.groups.length; ++i)
   {
      this.groups[i].postInsert();
   }

   containerDiv.style.display = displayProperty;
};



/**
 * get the currently selected menuItem
 **/
MenuBar.prototype.getCurrentlySelectedItem = function()
{
   var selectedItem = null;

   for (var i = 0; i < this.groups.length && selectedItem == null; ++i)
   {
      selectedItem = this.groups[i].getCurrentlySelectedItem();
   }

   return selectedItem;
};



MenuBar.prototype.updateMenuHeight = function()
{
   this.resetMenuHeights();
   var cHeight = document.body.clientHeight - 185;
   var totalMenuHeight = 0;
   for (var i = 0; i < this.groups.length; ++i)
   {
      var menuDiv = document.getElementById(this.groups[i].getBodyDivId());
      if (this.groups[i].isOpen)
      {
         menuDiv.divHeight = menuDiv.clientHeight;
         totalMenuHeight += menuDiv.clientHeight;
      }
   }
   if (totalMenuHeight > cHeight)
   {
      this.resizeMenuHeights();
   }
};


MenuBar.prototype.resizeMenuHeights = function()
{
   var openCount = 0;
   for (var i = 0; i < this.groups.length; ++i)
   {
      if (this.groups[i].isOpen)
      {
         openCount++;
      }
   }
   var cHeight = document.body.clientHeight - 185;
   var mHeight = cHeight/openCount;
   for (var i = 0; i < this.groups.length; ++i)
   {
      var menuDiv = document.getElementById(this.groups[i].getBodyDivId());
      if (this.groups[i].isOpen)
      {
         menuDiv.style.height = mHeight;
      }
   }
};


MenuBar.prototype.resetMenuHeights = function()
{
   for (var i = 0; i < this.groups.length; ++i)
   {
      var menuDiv = $(this.groups[i].getBodyDivId());
      if (this.groups[i].isOpen)
      {
         menuDiv.style.height = '';
         menuDiv.divHeight = 30;
      }
   }
};




