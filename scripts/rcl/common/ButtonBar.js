/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: ButtonBar.js 4533 2007-07-26 19:34:05Z lhankins $


/**
 * @fileoverview
 * This file defines a button bar that can host simple buttons or drop downs.
 *
 *
 **/


/** @type undefined */
var undefined;

/** @type Object */
var Node = Node ? Node : {};
/** @type number */
Node.ELEMENT_NODE = 1;
/** @type number */
Node.ATTRIBUTE_NODE = 2;
/** @type number */
Node.TEXT_NODE = 3;
/** @type number */
Node.CDATA_SECTION_NODE = 4;
/** @type number */
Node.ENTITY_REFERENCE_NODE = 5;
/** @type number */
Node.ENTITY_NODE = 6;
/** @type number */
Node.PROCESSING_INSTRUCTION_NODE = 7;
/** @type number */
Node.COMMENT_NODE = 8;
/** @type number */
Node.DOCUMENT_NODE = 9;
/** @type number */
Node.DOCUMENT_TYPE_NODE = 10;
/** @type number */
Node.DOCUMENT_FRAGMENT_NODE = 11;
/** @type number */
Node.NOTATION_NODE = 12;

/**
 * the interface for menu button listeners
 * @constructor
 */
function ButtonBarListener ()
{
}

/**
 * invoked when a menu button is clicked
 */
ButtonBarListener.prototype.buttonClicked = function(aButtonBarIt)
{
   // do nothing
}

/**
 * ButtonBarIt: An entry in the ButtonBar, reponsible for its dropdown
 * @constructor
**/
function ButtonBarIt (aMenuConfigObj)
{
   this.init(aMenuConfigObj);
}

/**
 * @private
 */
ButtonBarIt.prototype.init = function(aMenuConfigObj)
{
   this.config = aMenuConfigObj;
   this.id = (JsUtil.isGood(this.config.id)) ? this.config.id : null;
   this.name = (JsUtil.isGood(this.config.name)) ? this.config.name : null;

   this.subItems = (JsUtil.isGood(this.config.entries)) ? this.config.entries : new Array();
   this.icon = (JsUtil.isGood(this.config.icon)) ? this.config.icon : null;

   this.selected = false;
   this.hovered = false;
   this.dom = new Object();
   this.buttonBar = null;

   this.afterSeparator = false;
}

/**
 * @private
 */
ButtonBarIt.prototype.getChildOffsetLeft = function()
{
   return 0;
//   var amount = this.dom.buttonDiv.offsetLeft + this.buttonBar.buttonContainer.offsetLeft;
//   if (is_ie5up) { amount += 500; }
//   return amount;
}

/**
 * @private
 */
ButtonBarIt.prototype.getLevelTwoOffsetLeft = function()
{
   return this.getChildOffsetLeft() + this.dom.dropdown.clientWidth - 1;
}

/**
 * @private
 */
ButtonBarIt.prototype.getChildOffsetTop = function()
{
   return this.dom.buttonDiv.offsetHeight + 1;
   // return this.dom.buttonDiv.offsetTop + this.buttonBar.buttonContainer.offsetTop + this.dom.buttonDiv.offsetHeight + 1;
}

/**
 * @private
 */
ButtonBarIt.prototype.createDropdownDOM = function()
{
   this.dom.dropdown = this.buttonBar.document.createElement("div");
   this.dom.dropdown.id = this.name + "_dropdown";
   this.dom.dropdown.className = "bbar-button-dropdown";
   this.dom.dropdown.buttonBarIt = this;

   JsUtil.attachDOMCallback(this.dom.dropdown, "onmouseover", "ButtonBarIt.dropdownHover(event);");
   JsUtil.attachDOMCallback(this.dom.dropdown, "onmouseout", "ButtonBarIt.dropdownUnhover(event);");
   JsUtil.attachDOMCallback(this.dom.dropdown, "onselectstart", "return false;");

   for (var idx = 0; idx < this.subItems.length;++idx)
   {
      var itemDom = new Object();
      if (!this.subItems[idx].sep)
      {
         var iconSource;
         var toggleCheck = (JsUtil.isGood(this.subItems[idx].icon)) ? this.subItems[idx].icon.split(":") : "";
         if (toggleCheck[0] == "toggle") {
            iconSource = ServerEnvironment.baseUrl + "/images/bbar_icons/blank";
         } else {
            iconSource = (JsUtil.isGood(this.subItems[idx].icon)) ? ServerEnvironment.baseUrl + "/images/bbar_icons/" + this.subItems[idx].icon : ServerEnvironment.baseUrl + "/images/bbar_icons/blank";
         }
         if (is_ie5up) {
            iconSource += ".gif";
         } else {
            iconSource += ".png";
         }

         var itemDiv = this.buttonBar.document.createElement("div");
         itemDiv.title = this.subItems[idx].name;
         itemDiv.className = "bbar-menuitm bbar-menuitm-unfocused";
         JsUtil.attachDOMCallback(itemDiv, "onmouseover", "ButtonBarIt.focus(this, \'" + JsUtil.escapeApostrophe(this.name + "___" + this.subItems[idx].name) + "\');");
         JsUtil.attachDOMCallback(itemDiv, "onmouseout", "ButtonBarIt.unfocus(this, \'" + JsUtil.escapeApostrophe(this.subItems[idx].name) + "\');");
         JsUtil.attachDOMCallback(itemDiv, "onclick", "ButtonBar.hideAllSubmenus(\'" + JsUtil.escapeApostrophe(this.buttonBar.name) + "\'); ButtonBarIt.itemClicked(this, \'" + JsUtil.escapeApostrophe(this.name + "___" + this.subItems[idx].name) + "\');");
         itemDom.itemDiv = itemDiv;

         var itemIcon = this.buttonBar.document.createElement("img");
         itemIcon.style.verticalAlign = "-45%";
         itemIcon.src = iconSource;
         itemDom.itemIcon = itemIcon;
         itemDiv.appendChild(itemIcon);

         var itemText = this.buttonBar.document.createElement("div");
         itemText.className = "bbar-menutxt";
         itemText.innerHTML = this.subItems[idx].name;
         itemDom.itemText = itemText;
         itemDiv.appendChild(itemText);

         if (JsUtil.isGood(this.subItems[idx].entries)) {
            var itemArrow = this.buttonBar.document.createElement("div");
            itemArrow.className = "bbar-menuitm-expand";
            itemDom.itemArrow = itemArrow;
            var itemArrowImg = this.buttonBar.document.createElement("img");
            itemArrowImg.id = this.subItems[idx].name + '_arrowimg';
            itemArrowImg.src = ServerEnvironment.baseUrl + '/images/arrow_expand.gif';
            itemDom.itemArrowImg = itemArrowImg;
            itemArrow.appendChild(itemArrowImg);
            itemDiv.appendChild(itemArrow);
         }
         this.subItems[idx].dom = itemDom;

         this.dom.dropdown.appendChild(itemDiv);
      }
      else
      {
         var separator = this.buttonBar.document.createElement("div");
         separator.className = "bbar-separator";

         this.dom.dropdown.appendChild(separator);
      }
   }

//   this.buttonBar.document.body.appendChild(this.dom.dropdown);
   this.dom.buttonDiv.appendChild(this.dom.dropdown);

   this.dom.dropdown.style.top = this.getChildOffsetTop();
   this.dom.dropdown.style.left = this.getChildOffsetLeft();
   this.dom.dropdown.level = 1;

   for (var jdx = 0; jdx < this.subItems.length; ++jdx) {
      if (JsUtil.isGood(this.subItems[jdx].entries) && this.subItems[jdx].entries.length > 0) {
         this.createLevelTwoDropdownDOM(this.subItems[jdx]);
      }
   }
}

/**
 * @private
 */
ButtonBarIt.prototype.createLevelTwoDropdownDOM = function(aSubitem) {
   aSubitem.dom.dropdown = this.buttonBar.document.createElement("div");
   aSubitem.dom.dropdown.id = this.name + "_" + aSubitem.name + "_dropdown";
   aSubitem.dom.dropdown.className = "bbar-button-dropdown";
   aSubitem.dom.dropdown.parentSubitem = aSubitem;
   aSubitem.dom.dropdown.buttonBarIt = this;

   JsUtil.attachDOMCallback(aSubitem.dom.dropdown, "onmouseover", "ButtonBarIt.dropdownHover(event);");
   JsUtil.attachDOMCallback(aSubitem.dom.dropdown, "onmouseout", "ButtonBarIt.dropdownUnhover(event);");
   JsUtil.attachDOMCallback(aSubitem.dom.dropdown, "onselectstart", "return false;");

   for (var idx = 0; idx < aSubitem.entries.length; ++idx)
   {
      var itemDom = new Object();
      if (!aSubitem.entries[idx].sep)
      {
         var iconSource;
         var toggleCheck = (JsUtil.isGood(aSubitem.entries[idx].icon)) ? aSubitem.entries[idx].icon.split(":") : "";
         if (toggleCheck[0] == "toggle") {
            iconSource = ServerEnvironment.baseUrl + "/images/bbar_icons/blank";
         } else {
            iconSource = (JsUtil.isGood(aSubitem.entries[idx].icon)) ? ServerEnvironment.baseUrl + "/images/bbar_icons/" + aSubitem.entries[idx].icon : ServerEnvironment.baseUrl + "/images/bbar_icons/blank";
         }
         if (is_ie5up) {
            iconSource += ".gif";
         } else {
            iconSource += ".png";
         }

         var itemDiv = this.buttonBar.document.createElement("div");
         itemDiv.className = "bbar-menuitm bbar-menuitm-unfocused";
         JsUtil.attachDOMCallback(itemDiv, "onmouseover", "ButtonBarIt.focus(this, \'" + JsUtil.escapeApostrophe(this.name + "___" + aSubitem.name + "___" + aSubitem.entries[idx].name) + "\');");
         JsUtil.attachDOMCallback(itemDiv, "onmouseout", "ButtonBarIt.unfocus(this, \'" + JsUtil.escapeApostrophe(aSubitem.entries[idx].name) + "\');");
         JsUtil.attachDOMCallback(itemDiv, "onclick", "ButtonBar.hideAllSubmenus(\'" + JsUtil.escapeApostrophe(this.buttonBar.name) + "\'); ButtonBarIt.itemClicked(this, \'" + JsUtil.escapeApostrophe(this.name + "___" + aSubitem.name + "___" + aSubitem.entries[idx].name) + "\');");
         itemDom.itemDiv = itemDiv;

         var itemIcon = this.buttonBar.document.createElement("img");
         itemIcon.style.verticalAlign = "-45%";
         itemIcon.src = iconSource;
         itemDom.itemIcon = itemIcon;
         itemDiv.appendChild(itemIcon);

         var itemText = this.buttonBar.document.createElement("div");
         itemText.className = "bbar-menutxt";
         itemText.innerHTML = aSubitem.entries[idx].name;
         itemDom.itemText = itemText;
         itemDiv.appendChild(itemText);

         if (JsUtil.isGood(aSubitem.entries[idx].entries)) {
            var itemArrow = this.buttonBar.document.createElement("div");
            itemArrow.className = "bbar-menuitm-expand";
            itemDom.itemArrow = itemArrow;
            var itemArrowImg = this.buttonBar.document.createElement("img");
            itemArrowImg.id = aSubitem.entries[idx].name + '_arrowimg';
            itemArrowImg.src = ServerEnvironment.baseUrl + '/images/arrow_expand.gif';
            itemDom.itemArrowImg = itemArrowImg;
            itemArrow.appendChild(itemArrowImg);
            itemDiv.appendChild(itemArrow);
         }
         aSubitem.entries[idx].dom = itemDom;

         aSubitem.dom.dropdown.appendChild(itemDiv);
      }
      else
      {
         var separator = this.buttonBar.document.createElement("div");
         separator.className = "bbar-separator";

         aSubitem.dom.dropdown.appendChild(separator);
      }
   }

   aSubitem.dom.itemDiv.appendChild(aSubitem.dom.dropdown);
//   this.buttonBar.document.body.appendChild(aSubitem.dom.dropdown);

   aSubitem.dom.dropdown.style.left = this.getLevelTwoOffsetLeft();
   aSubitem.dom.dropdown.level = 2;
}

/**
 * displays the first-level flyout associated with this menu button
 * @private
 */
ButtonBarIt.prototype.popupSubmenu = function()
{
//        this.buttonBar.document.body.removeChild(this.dom.dropdown);

   this.dom.dropdown.style.visibility = "visible";
}

/**
 * displays the second-level flyout associated with the given menu item
 * @private
 */
ButtonBarIt.prototype.popupLevelTwoSubmenu = function(aSubentry, aTopOffset)
{
//   if (JsUtil.isGood(aSubentry.dom)) {
//      this.buttonBar.document.body.removeChild(aSubentry.dom.dropdown);
//   }
//   this.createLevelTwoDropdownDOM(aSubentry, aTopOffset);

   if (!JsUtil.isGood(aSubentry.dom.dropdown)) {
      debugger;
      alert("No dropdown created yet!");
   }

   if (JsUtil.isGood(this.buttonBar.levelTwoPopup)) {
      this.buttonBar.levelTwoPopup.style.visibility = "hidden";
   }
   aSubentry.dom.dropdown.style.top = aTopOffset;
   aSubentry.dom.dropdown.style.visibility = "visible";
   this.buttonBar.levelTwoPopup = aSubentry.dom.dropdown;
}

/**
 * @private
 */
ButtonBarIt.prototype.dropdownHover = function(aSource)
{
   this.buttonBar.hoverCount++;
   this.buttonBar.clearUnhoverTimeout();
}

/**
 * @private
 */
ButtonBarIt.prototype.dropdownUnhover = function(aSource)
{
   if (aSource.level == 2) {
      this.unfocusEverythingBut(aSource, aSource.parentSubitem.entries, null)
   }
   this.buttonBar.hoverCount--;
   this.buttonBar.setUnhoverTimeout();
}

/**
 * causes everything except the specified subentry to be unfocused
 * @private
 */
ButtonBarIt.prototype.unfocusEverythingBut = function(aDropdown, anItemArray, aSubentry) {
   var childNodes = aDropdown.childNodes;
   for (var idx = 0; idx < childNodes.length; ++idx) {
      if (childNodes[idx].nodeType == Node.ELEMENT_NODE) {
         if (childNodes[idx].className != "bbar-separator") {
            childNodes[idx].className = "bbar-menuitm bbar-menuitm-unfocused";
         }
      }
   }

   for (var idx = 0; idx < anItemArray.length; idx++) {
      if (anItemArray[idx] != aSubentry && JsUtil.isGood(anItemArray[idx].dom) && JsUtil.isGood(anItemArray[idx].dom.dropdown)) {
         anItemArray[idx].dom.dropdown.style.visibility = "hidden";
      }
   }
}

/**
 * static method that receives onmouseover events for menu items
 */
ButtonBarIt.focus = function(anElem, aName)
{
   var subentry;
   var itemArray;
   var parentDropdown = anElem.parentNode;
   var it = parentDropdown.buttonBarIt;

   if (JsUtil.isGood(it)) {
      subentry = ButtonBar.findSubentry(it.buttonBar, aName);
      itemArray = it.subItems;
      if (parentDropdown.level == 2) {
         itemArray = subentry.entries;
      } else if (JsUtil.isGood(subentry.entries) && subentry.entries.length > 0) {
         var topOffset = anElem.offsetTop;


         it.popupLevelTwoSubmenu(subentry, topOffset);
         subentry.dom.dropdown.parentItem = anElem;
      }
   }

   if (JsUtil.isGood(subentry)) {
      it.unfocusEverythingBut(parentDropdown, itemArray, subentry);
      anElem.className = "bbar-menuitm bbar-menuitm-focused";
   }
}

/**
 * static method that receives onclick events for menu items
 */
ButtonBarIt.itemClicked = function(anElem, aName) {
   var subentry;
   var parentDropdown = anElem.parentNode;
   var it = parentDropdown.buttonBarIt;

   if (JsUtil.isGood(it)) {
      subentry = ButtonBar.findSubentry(it.buttonBar, aName);

      // we have the subentry, now see if it's a toggle
      if (JsUtil.isGood(subentry.icon) && subentry.icon.split(":")[0] == "toggle") {
         it.buttonBar.clearToggleGroup(subentry.icon.split(":")[1]);
         it.buttonBar.checkToggleItem(aName);
      }

      // invoke listeners
      for (var idx = 0; idx < it.buttonBar.menuListeners.length; idx++)
      {
         it.buttonBar.menuListeners[idx].itemClicked(subentry);
      }
   }
}

/**
 * static method that receives onmouseout events for menu items
 */
ButtonBarIt.unfocus = function(anElem, aName)
{
   // anElem.className = "bbar-menuitm bbar-menuitm-unfocused";
}

ButtonBarIt.separator = { sep:true };

/**
 * static method that receives onmouseover events for menu flyout elements
 */
ButtonBarIt.dropdownHover = function(event) {
   var wrap = new Object();
   var evt = event ? event : window.event;
   var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
   source = ButtonBar.getFirstAncestorOrSelfByClassName(source, new String("bbar-button-dropdown"));
   // get the TabBar responsible for the clicked tab
   source.buttonBarIt.dropdownHover(source);
   try
   {
      evt.consume();
   }
   catch (e)
   { // swaller this
   }
}

/**
 * static method that receives onmouseout events for menu flyout elements
 */
ButtonBarIt.dropdownUnhover = function(event) {
   var wrap = new Object();
   var evt = event ? event : window.event;
   var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
   source = ButtonBar.getFirstAncestorOrSelfByClassName(source, new String("bbar-button-dropdown"));
   // get the TabBar responsible for the clicked tab
   source.buttonBarIt.dropdownUnhover(source);
   try
   {
      evt.consume();
   }
   catch (e)
   { // swaller this
   }
}

/**
 * ButtonBar: The top-level menu bar
 * @constructor
 */
function ButtonBar (aName)
{
   this.init(aName);
}

/**
 * @private
 */
ButtonBar.prototype.init = function(aName)
{
   this.name = aName;
   window["bbar_" + this.name] = this;

   // indexed by order in the list
   this.itsByOrder = new Array();
   // indexed by the it's id field
   this.its = new Object();

   this.inserted = false;

   this.buttonListeners = new Array();
   this.menuListeners = new Array();

   this.hoverCount = 0;
   this.unhoverTimeout = null;

   this.currentSubmenu = null;

   this.separatorAdded = false;
}

/**
 * set the display type for icons/text/both
 * @param aDis one of ButtonBar.DISPLAY_ICON, ButtonBar.DISPLAY_TEXT, or ButtonBar.DISPLAY_BOTH
 */
ButtonBar.prototype.setDisplay = function(aDis) {
   this.display = aDis;
}

/**
 * inserts the ButtonBar into the document
 */
ButtonBar.prototype.insertIntoDocument = function(aDocument, anInsertionPoint)
{
   this.document = aDocument;
   this.insertionPoint = anInsertionPoint;

   if (JsUtil.isGood(this.insertionPoint))
   {
      JsUtil.clearChildNodes(this.insertionPoint);
   }
   else
   {
      alert("Problem with insertionPoint.");
   }

   this.buttonContainer = this.document.createElement("div");
   this.buttonContainer.id = "bbar-main-container";
   this.buttonContainer.className = "bbar-container";

   JsUtil.attachDOMCallback(this.buttonContainer, "oncontextmenu", "return false;");
   JsUtil.attachDOMCallback(this.buttonContainer, "onselectstart", "return false;");

   this.insertionPoint.appendChild(this.buttonContainer);

   this.buttonWrap = this.document.createElement("div");
   this.buttonWrap.className = "bbar-wrap";
   this.buttonContainer.appendChild(this.buttonWrap);

   this.buttonClear = this.document.createElement("br");
   this.buttonClear.className = "bbar-clear";
   this.buttonWrap.appendChild(this.buttonClear);

   var idx;
   for (idx = 0; idx < this.itsByOrder.length; ++idx)
   {
      // get the it
      var it = this.itsByOrder[idx];
      this.renderNewButton(it);
      if (it != ButtonBarIt.separator) {
         it.createDropdownDOM();
      }
   }

   this.inserted = true;

//   JsUtil.attachDOMCallback(this.document.body, "onmousedown", "ButtonBar.hideAllSubmenus('" + this.name + "')");
}

/**
 * @private
 */
ButtonBar.prototype.clearUnhoverTimeout = function() {
   if (JsUtil.isGood(this.unhoverTimeout)) {
      clearTimeout(this.unhoverTimeout);
   }
}

/**
 * @private
 */
ButtonBar.prototype.setUnhoverTimeout = function() {
   this.unhoverTimeout = window.setTimeout("ButtonBar.maybeHideAllSubmenus('" + this.name + "');", 1000);
}

/**
 * add a listener for top-level menu button clicks
 */
ButtonBar.prototype.addButtonListener = function(aButtonListener)
{
   this.buttonListeners.push(aButtonListener);
}

/**
 * remove a menu button listener
 */
ButtonBar.prototype.removeButtonListener = function(aButtonListener)
{
   this.buttonListeners = JsUtil.removeElementFromArrayByValue(this.buttonListeners, aButtonListener);
}

/**
 * add a listener for menu item selections
 */
ButtonBar.prototype.addMenuListener = function(aMenuListener)
{
   this.menuListeners.push(aMenuListener);
}

/**
 * remove a menu item listener
 */
ButtonBar.prototype.removeMenuListener = function(aMenuListener)
{
   this.menuListeners = JsUtil.removeElementFromArrayByValue(this.menuListeners, aMenuListener);
}

/**
 * add a top-level menu button to this bar
 */
ButtonBar.prototype.add = function(anIt)
{
   if (JsUtil.isGood(this.its[anIt.id]))
   {
      // it already exists in this ButtonBar
      return;
   }

   this.its[anIt.id] = anIt;
   this.itsByOrder.push(anIt);

   if (anIt != ButtonBarIt.separator) {
      anIt.buttonBar = this;
      if (this.inserted) {
         this.renderNewButton(anIt);
      }
   }

   return anIt;
}

ButtonBar.prototype.createAndAdd = function(aMenuConfigObj)
{
   var it = new ButtonBarIt(aMenuConfigObj);
   return this.add(it);
}

ButtonBar.prototype.addSeparator = function()
{
   return this.add(ButtonBarIt.separator);
}

ButtonBar.prototype.select = function(anIt)
{
   if (anIt.subItems.length > 0) {
      anIt.buttonBar.hideAllSubmenus();
      anIt.popupSubmenu();
   }
}

/**
 * hides all flyouts, but only if the hover count is zero
 */
ButtonBar.prototype.maybeHideAllSubmenus = function() {
   if (this.hoverCount == 0) {
      this.hideAllSubmenus();
   }
}

/**
 * hides all flyouts
 */
ButtonBar.prototype.hideAllSubmenus = function()
{
   for (var idx in this.its)
   {
      if (this.its[idx] == ButtonBarIt.separator) continue;
      if (JsUtil.isGood(this.its[idx].dom.dropdown))
      {
         this.its[idx].dom.dropdown.style.visibility = "hidden";
      }
      for (var jdx = 0; jdx < this.its[idx].subItems.length; ++jdx) {
         if (JsUtil.isGood(this.its[idx].subItems[jdx].dom) && JsUtil.isGood(this.its[idx].subItems[jdx].dom.dropdown)) {
            this.its[idx].subItems[jdx].dom.dropdown.style.visibility = "hidden";
         }
      }
   }
}

/**
 * @private
 */
ButtonBar.prototype.renderNewButton = function(anIt)
{
   if (anIt == ButtonBarIt.separator) {
      this.separatorAdded = true;
      return;
   }

   // create the top-level div for the tab
   var buttonDiv = this.document.createElement("div");
   buttonDiv.origId = anIt.id;
   buttonDiv.id = anIt.id + "-tab";
   var className = "bbar-button bbar-button-unfocused ";
   if (this.separatorAdded)
   {
      anIt.afterSeparator = true;
   }
   className += (anIt.afterSeparator) ? "float-right" : "float-left";
   buttonDiv.className = className;
   buttonDiv.buttonBar = anIt.buttonBar;
   buttonDiv.title = anIt.name;
   
   JsUtil.attachDOMCallback(buttonDiv, "onmouseover", "ButtonBar.buttonHover(event)");
   JsUtil.attachDOMCallback(buttonDiv, "onmouseout",  "ButtonBar.buttonUnhover(event)");
   JsUtil.attachDOMCallback(buttonDiv, "onmousedown", "ButtonBar.buttonMousedown(event)");
   JsUtil.attachDOMCallback(buttonDiv, "onmouseup",   "ButtonBar.buttonMouseup(event)");
   JsUtil.attachDOMCallback(buttonDiv, "onclick",     "ButtonBar.buttonClicked(event)");

   this.buttonWrap.insertBefore(buttonDiv, this.buttonClear);
   // assign the element to its place in the dom subtree
   anIt.dom.buttonDiv = buttonDiv;

   // create the left sliding-curtain span
   var buttonSpan = this.document.createElement("span");
   buttonSpan.className = "bbar-button-bg-left";
   buttonDiv.appendChild(buttonSpan);
   // assign the element to its place in the dom subtree
   anIt.dom.buttonSpan = buttonSpan;

   if (JsUtil.isGood(anIt.icon)) {
      var buttonIcon = this.document.createElement("img");
      buttonIcon.src = ServerEnvironment.baseUrl + "/images/bbar_icons/" + anIt.icon + ".gif";
      buttonIcon.className = "bbar-button-icon";
      buttonDiv.appendChild(buttonIcon);
      anIt.dom.buttonIcon = buttonIcon;
   } else {
      buttonDiv.style.paddingLeft = "20px";
   }
   if (JsUtil.isGood(anIt.name)) {
      // create the a tag for the right sliding-curtain
      var buttonA = this.document.createElement("a");
      JsUtil.attachDOMCallback(buttonA, "onclick", "return false;");
      buttonA.innerHTML = anIt.name;
      buttonDiv.appendChild(buttonA);
      // assign the element to its place in the dom subtree
      anIt.dom.buttonA = buttonA;
   }

   var buttonImgDiv = this.document.createElement("div");

   var buttonImg = this.document.createElement("img");
   if (anIt.subItems.length > 0) {
      buttonImgDiv.className = "bbar-arrow-down";
      buttonImg.src = ServerEnvironment.baseUrl + "/images/arrow_down_grey.gif";
   } else {
      buttonImgDiv.className = "bbar-arrow-down-trans";
      buttonImg.src = ServerEnvironment.baseUrl + "/images/arrow_down_trans.gif";
   }
   buttonImgDiv.appendChild(buttonImg);
   buttonDiv.appendChild(buttonImgDiv);
   anIt.dom.buttonImg = buttonImg;
   anIt.dom.buttonImgDiv = buttonImgDiv;
}

/**
 * clears all toggle checkmarks and flags from the specified toggle group
 * @param aToogleGroup the name of the toggle group to clear
 */
ButtonBar.prototype.clearToggleGroup = function(aToggleGroup)
{
   var subItems;
   var eachSubItem;

   for (var i = 0; i < this.itsByOrder.length; ++i) {
      subItems = this.itsByOrder[i].subItems;

      if (JsUtil.isGood(subItems)) {
         for (var j = 0; j < subItems.length; ++j) {
            eachSubItem = subItems[j];

            if (eachSubItem.icon == "toggle:" + aToggleGroup) {
               this.setSubentryIcon(eachSubItem, "blank");
            }
            if (JsUtil.isGood(eachSubItem.entries)) {
               for (var k = 0; k < eachSubItem.entries.length; ++k) {
                  if (eachSubItem.entries[k].icon == "toggle:" + aToggleGroup) {
                     this.setSubentryIcon(eachSubItem.entries[k], "blank");
                  }
               }
            }
         }
      }
   }
}

/**
 * checks the member of the specified toggle group with the specified value
 * @param aToggleGroup the toggle group
 * @param the value of the item to check
 */
ButtonBar.prototype.checkToggleGroupForValue = function(aToggleGroup, aValue)
{
   var subItems;
   var eachSubItem;

   for (var i = 0; i < this.itsByOrder.length; ++i) {
      subItems = this.itsByOrder[i].subItems;

      if (JsUtil.isGood(subItems)) {
         for (var j = 0; j < subItems.length; ++j) {
            eachSubItem = subItems[j];

            if (eachSubItem.icon == "toggle:" + aToggleGroup) {
               if (JsUtil.isGood(eachSubItem.value) && eachSubItem.value == aValue) {
                  this.setSubentryIcon(eachSubItem, ButtonBar.TOGGLE_ICON);
               }
            }
            if (JsUtil.isGood(eachSubItem.entries)) {
               for (var k = 0; k < eachSubItem.entries.length;++k) {
                  if (eachSubItem.entries[k].icon == "toggle:" + aToggleGroup) {
                     if (JsUtil.isGood(eachSubItem.entries[k].value) && eachSubItem.entries[k].value == aValue) {
                        this.setSubentryIcon(eachSubItem.entries[k], ButtonBar.TOGGLE_ICON);
                     }
                  }
               }
            }
         }
      }
   }
}

/**
 * sets the toggle state for the specified item
 * @param an item to check
 */
ButtonBar.prototype.checkToggleItem = function(anItemName)
{
   var subentry = ButtonBar.findSubentry(this, anItemName);
   this.setSubentryIcon(subentry, ButtonBar.TOGGLE_ICON);
}

/**
 * @private
 */
ButtonBar.prototype.setSubentryIcon = function(aSubentry, anIconName)
{
   var iconSource = ServerEnvironment.baseUrl + "/images/bbar_icons/" + anIconName;
   if (is_ie5up) {
      iconSource += ".gif";
   } else {
      iconSource += ".png";
   }
   aSubentry.dom.itemIcon.src = iconSource;
}

/**
 * @private
 */
ButtonBar.prototype.buttonHover = function(anId)
{
   //alert("button hover [" + anId + "]");
   this.hoverCount++;
   var it = this.its[anId];
   var className = "bbar-button bbar-button-focused ";
   className += (it.afterSeparator) ? "float-right" : "float-left";
   it.dom.buttonDiv.className = className;
   if (it.subItems.length > 0) {
      it.dom.buttonImg.src = ServerEnvironment.baseUrl + "/images/arrow_down_black.gif";
   }
   this.clearUnhoverTimeout();
}

/**
 * @private
 */
ButtonBar.prototype.buttonUnhover = function(anId)
{
   //alert("button UN-hover [" + anId + "]");
   this.hoverCount--;
   var it = this.its[anId];
   var className = "bbar-button bbar-button-unfocused ";
   className += (it.afterSeparator) ? "float-right" : "float-left";
   it.dom.buttonDiv.className = className;
   if (it.subItems.length > 0) {
      it.dom.buttonImg.src = ServerEnvironment.baseUrl + "/images/arrow_down_grey.gif";
   }
   this.setUnhoverTimeout();
}

/**
 * @private
 */
ButtonBar.prototype.buttonMousedown = function(anId)
{
   var it = this.its[anId];
}

/**
 * @private
 */
ButtonBar.prototype.buttonMouseup = function(anId)
{
   var it = this.its[anId];
}

/**
 * @private
 */
ButtonBar.prototype.buttonClicked = function(anId)
{
   var it = this.its[anId];
   this.select(it);
   for (var idx = 0; idx < this.buttonListeners.length; ++idx)
   {
      this.buttonListeners[idx].buttonClicked(it);
   }
}

/**
 * static method that will try to hide all flyouts
 */
ButtonBar.maybeHideAllSubmenus = function(aName) {
   if (JsUtil.isGood(window["bbar_" + aName])) {
      window["bbar_" + aName].maybeHideAllSubmenus();
   }
}

/**
 * static method that will hide all flyouts
 */
ButtonBar.hideAllSubmenus = function(aName) {
   if (JsUtil.isGood(window["bbar_" + aName])) {
      window["bbar_" + aName].hideAllSubmenus();
   }
}

/**
 * static method that receives onmouseover events for top-level menu buttons
 */
ButtonBar.buttonHover = function(event)
{
   var wrap = new Object();
   var evt = event ? event : window.event;
   var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
   source = ButtonBar.getFirstAncestorOrSelfByClassName(source, new String("bbar-button"));
   // get the TabBar responsible for the clicked tab
   source.buttonBar.buttonHover(source.origId);
   try
   {
      evt.consume();
   }
   catch (e)
   { // swaller this
   }
}

/**
 * static method that receives onmouseout events for top-level menu buttons
 */
ButtonBar.buttonUnhover = function(event)
{
   var wrap = new Object();
   var evt = event ? event : window.event;
   var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
   source = ButtonBar.getFirstAncestorOrSelfByClassName(source, new String("bbar-button"));
   // get the TabBar responsible for the clicked tab
   source.buttonBar.buttonUnhover(source.origId);
   try
   {
      evt.consume();
   }
   catch (e)
   { // swaller this
   }
}

/**
 * static method that receives onmousedown events for top-level menu buttons
 */
ButtonBar.buttonMousedown = function(event)
{
    var wrap = new Object();
   var evt = event ? event : window.event;
   var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
   source = ButtonBar.getFirstAncestorOrSelfByClassName(source, new String("bbar-button"));
   // get the TabBar responsible for the clicked tab
   source.buttonBar.buttonMousedown(source.origId);
   try
   {
      evt.consume();
   }
   catch (e)
   { // swaller this
   }
}

/**
 * static method that receives onmouseup events for top-level menu buttons
 */
ButtonBar.buttonMouseup = function(event)
{
    var wrap = new Object();
   var evt = event ? event : window.event;
   var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
   source = ButtonBar.getFirstAncestorOrSelfByClassName(source, new String("bbar-button"));
   // get the TabBar responsible for the clicked tab
   source.buttonBar.buttonMouseup(source.origId);
   try
   {
      evt.consume();
   }
   catch (e)
   { // swaller this
   }
}

/**
 * static method that receives onclick events for top-level menu buttons
 */
ButtonBar.buttonClicked = function(event)
{
   var wrap = new Object();
   var evt = event ? event : window.event;
   var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
   source = ButtonBar.getFirstAncestorOrSelfByClassName(source, new String("bbar-button"));
   // get the TabBar responsible for the clicked tab
   source.buttonBar.buttonClicked(source.origId);
   try
   {
      evt.consume();
   }
   catch (e)
   { // swaller this
   }
}

/**
 * static method utilized by event-receivers to forward to the appropriate elements that triggered the events
 * in the first place
 *
 * looks up the highest-level element from the current tree location that is in the appropriate CSS class grouping
 * @private
 */
ButtonBar.getFirstAncestorOrSelfByClassName = function (target, className)
{
   var parent = target;

   do {
      if (target.nodeType == Node.ELEMENT_NODE && ButtonBar.hasClassName(parent, className))
      {
         return parent;
      }
   }
   while (parent = parent.parentNode);

   return null;
}

/**
 * @private
 */
ButtonBar.hasClassName = function (target, className)
{
   function _isLastOfMultipleClassNames (all, className)
   {
      var spaceBefore = all.lastIndexOf(className) - 1;
      return all.endsWith(className) &&
             all.substring(spaceBefore, spaceBefore + 1) == " ";
   }

   //	className = className.trim();
   var cn = target.className;
   if (!cn)
   {
      return false;
   }
   //	cn = cn.trim();
   if (cn == className)
   {
      return true;
   }
   if (cn.indexOf(className + " ") > -1)
   {
      return true;
   }
   //	if (_isLastOfMultipleClassNames(cn,className)) {
   //		return true;
   //	}
   return false;
}

/**
 * @private
 */
ButtonBar.findSubentry = function(aButtonBar, aName)
{
   var nameAry = aName.split("___");
   var subentry = ButtonBar.findByNameInArray(aButtonBar.itsByOrder, nameAry[0]);
   if (JsUtil.isGood(nameAry[1])) {
      subentry = ButtonBar.findByNameInArray(subentry.subItems, nameAry[1]);
      if (JsUtil.isGood(nameAry[2])) {
         subentry = ButtonBar.findByNameInArray(subentry.entries, nameAry[2]);
      }
   }

   return subentry;
}

/**
 * @private
 */
ButtonBar.findByNameInArray = function(anArray, aName) {
   for (var idx = 0; idx < anArray.length; ++idx ) {
      if (anArray[idx].name == aName) {
         return anArray[idx];
      }
   }
   return null;
}


ButtonBar.TOGGLE_ICON = "toggle_check";

ButtonBar.DISPLAY_TEXT = 0;
ButtonBar.DISPLAY_ICON = 1;
ButtonBar.DISPLAY_BOTH = 2;


ImageHelper.registerForPreLoad([
   ServerEnvironment.baseUrl + "/images/buttonHover.gif",
   ServerEnvironment.baseUrl + "/images/button3.gif"
]);