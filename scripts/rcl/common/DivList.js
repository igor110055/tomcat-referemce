/**
 * @fileoverview
 *
 * This file defines a div based list (somewhat of an html select replacement)
 *
 * @author Lance Hankins
 *
 **/



/**
 * adapter which adapts CrnDialog value picker operation to DivList needs...
 * @param aPackagePath
 * @param aValueRef
 * @param aDisplayTextRef
 * @param aIsMultiSelect
 * @param aInitialFilter
 * @param aItemsPerPage
 * @param aFilterType
 */
function CrnDialogValueProvider (aPackagePath, aValueRef, aDisplayTextRef, aIsMultiSelect, aInitialFilter, aItemsPerPage, aFilterType, aExtraParams)
{
   this.crnDialog = new CrnDialog();
   this.packagePath = aPackagePath;
   this.valueRef = aValueRef;
   this.displayTextRef = aDisplayTextRef;
   this.isMultiSelect = aIsMultiSelect;
   this.initialFilter = aInitialFilter;
   this.itemsPerPage = aItemsPerPage;
   this.filterType = aFilterType ? aFilterType : "displayValue";

   this.extraParams = aExtraParams;

   // set later...
   this.divList = null;
   this.cascades = [];
}


CrnDialogValueProvider.prototype.setDivList = function (aDivList)
{
   this.divList = aDivList;
};


/**
 * called by CrnDialog when its finished...
 * @param aPicker
 */
CrnDialogValueProvider.prototype.dialogFinished = function (aPicker)
{
   if (aPicker.wasCancelled)
   {
      this.divList.onDialogCancelButtonPressed(this);
   }
   else
   {
      this.divList.onDialogOkButtonPressed(aPicker.selectedValues);


      //--- this is an attempt to work around ticket #936 (for IE6
      //this.divList.focusModifyButton();
      this.divList.focusOnSomeTextInput();
   }
};

CrnDialogValueProvider.prototype.show = function (aInitialValues, aMaxNumberOfSelections)
{
   this.crnDialog.setDialogListener(this);

   var cascadeContext = null;
   if (this.cascades.length > 0)
   {
      cascadeContext = new CascadeContext();
      this.cascades.each(function (aDivList) {
         cascadeContext.addItem(aDivList.valuePickerDialog.valueRef,  aDivList.getSelectedValues());
      });
   }

   this.crnDialog.positionY = 30;
   this.crnDialog.showValuePickerDialog("Select Values", this.valueRef, this.displayTextRef, this.isMultiSelect, this.initialFilter, this.packagePath, this.itemsPerPage, this.filterType, this.extraParams, aInitialValues, cascadeContext, aMaxNumberOfSelections);
};


CrnDialogValueProvider.prototype.addCascade = function (aDivList)
{
   this.cascades.push(aDivList);
};










/**
 * DivList
 * @constructor
 */
function DivList (aDocument, aContainerId, aHeightCssExpr, aMaxItems, aInitialValues, aFieldExtractor, aValuePickerDialog)
{
   if (arguments.length > 0)
   {
      DivList.superclass.constructor.call(this);
      this.document = aDocument;
      this.containerId = aContainerId;
      this.heightCssExpr = aHeightCssExpr;
      this.maxItems = aMaxItems;
      this.fieldExtractor = aFieldExtractor;

      this.valuePickerDialog = aValuePickerDialog;

      this.setItemsFromSourceObjects(aInitialValues);

      this.emptyMessage = null;


      //--- event handlers, bound later... referenced here just so we can unwire them
      this.onClickFn = null;
      this.onMouseOverFn = null;
      this.onMouseOutFn = null;
   }
}

//--- inheritance chain...
DivList.prototype = new Observable();
DivList.prototype.constructor = DivList;
DivList.superclass = Observable.prototype;


/**
 * sets the items visible available in this DivList, from a list of Source Objects (the
 * fieldExtractor will be used to extract a DivListItem from each SourceObject).
 * @param aItems - an Array of source objects
 */
DivList.prototype.setItemsFromSourceObjects = function (aSourceObjects)
{
   if (JsUtil.isGood(aSourceObjects))
   {
      var divListItems;

      if (JsUtil.isArray(aSourceObjects))
      {
         divListItems = [];

         for (var i = 0; i < aSourceObjects.length; ++i)
         {
            divListItems.push(this.fieldExtractor.extractDivListItem(aSourceObjects[i]));
         }
      }
      else
      {
         divListItems = [];

         aSourceObjects.each(function (anObject) {
            divListItems.push(this.fieldExtractor.extractDivListItem(anObject));
         }.bind(this));
      }

      this.setItems(divListItems);
   }
   else
   {
      this.setItems([]);
   }
};




/**
 * set the list of items
 * @param aItems - must be an array of DivList.DivListItem objects
 */

DivList.prototype.setItems = function (aItems)
{
   if (!JsUtil.isArray(aItems) || (aItems.length > 0 && !(aItems[0] instanceof DivList.DivListItem)))
   {
      alert("ERROR  - DivList.prototype.setItems(aItems) was called, but aItems is not an array of DivList.DivListItem objects");
      return;
   }

   this.items = aItems;

   if (this.items)
   {
      this.items.each(function(anItem) {
         anItem.divList = this;
      }.bind(this));
   }
};


/**
 * re-render this widget to its display area...
 */
DivList.prototype.refreshView = function()
{
   /*
       <div class="divList" id="divList_(containerId)">
          <ul class="divListItems">
          </ul>
          <div class="divListButtons">
             ...
          </div>
       </div>
    */

   var listDiv = this.getDocument().getElementById("divList_" + this.containerId);

   var ul = null;

   //--- first time rendering, render the whole skeleton, with buttons, etc...
   if (!JsUtil.isGood(listDiv))
   {
      listDiv = this.getDocument().createElement("div");
      listDiv.className = "divList";
      listDiv.id = "divList_" + this.containerId;

      var ul = this.getDocument().createElement("ul");
      ul.className = "divListItems";
      ul.style.height = this.heightCssExpr;
      listDiv.appendChild(ul);


      var divListButtons = this.getDocument().createElement("div");
      divListButtons.className = "divListButtons";

      listDiv.appendChild(divListButtons);

      var resetButton = document.createElement("input");
      resetButton.type = "button";
      resetButton.id = listDiv.id + "_reset";
      resetButton.value = "Reset";
      Event.observe(resetButton, "click", function(anEvent) {
         this.onResetButtonPressed(anEvent);
      }.bind(this), false);

      divListButtons.appendChild(resetButton);

      var modifyButton = document.createElement("input");
      modifyButton.type = "button";
      modifyButton.id = listDiv.id + "_modify";
      modifyButton.value = "Modify";
      Event.observe(modifyButton, "click", function(anEvent) {
         this.onModifyButtonPressed(anEvent);
      }.bind(this), false);

      divListButtons.appendChild(modifyButton);

      //--- now insert or replace at the appropriate location...
      var target = this.getDocument().getElementById(this.containerId);

      target.appendChild(listDiv);
   }
   //--- else we're just updating the contents of a previous version of the divList
   //    here we really just need to update the <ul> and its contents...
   else
   {
      ul = this.getDocument().createElement("ul");
      ul.className = "divListItems";
      ul.style.height = this.heightCssExpr;

      var previousUl = listDiv.getElementsByTagName("ul")[0];

      Event.stopObserving(previousUl, "click", this.onClickFn, false);
      Event.stopObserving(previousUl, "mouseover", this.onMouseOverFn, false);
      Event.stopObserving(previousUl, "mouseout", this.onMouseOutFn, false);

      listDiv.replaceChild(ul, previousUl);
   }

   //--- wire handlers for the body of this DivList (which is largely the <ul>)...
   this.onClickFn = this.onModifyButtonPressed.bindAsEventListener(this);
   Event.observe(ul, "click", this.onClickFn, false);

   this.onMouseOverFn = function(anEvent) { Element.addClassName(this,"divListHover");}.bind(ul);
   Event.observe(ul, "mouseover", this.onMouseOverFn, false);

   this.onMouseOutFn = function(anEvent) { Element.removeClassName(this,"divListHover"); }.bind(ul)
   Event.observe(ul, "mouseout", this.onMouseOutFn, false);


   //--- now just update the items...
   for (var i = 0; i < this.items.length; ++i)
   {
      ul.appendChild(this.items[i].toDomElement());
   }

   if (this.items.length == 0 && this.emptyMessage != null)
   {
      var emptyMessageDiv = this.document.createElement("div");
      emptyMessageDiv.className = "emptyMessage";
      emptyMessageDiv.innerHTML = this.emptyMessage;

      ul.appendChild(emptyMessageDiv);
   }
};



DivList.prototype.onModifyButtonPressed = function()
{
   if (this.valuePickerDialog)
   {
      this.valuePickerDialog.setDivList(this);
      this.valuePickerDialog.show(this.items, this.maxItems);
   }
};

DivList.prototype.onResetButtonPressed = function()
{
   this.setItems([]);
   this.refreshView();
};

DivList.prototype.onDialogOkButtonPressed = function(aSelectedValues)
{
   var newItems = [];
   for (var i = 0; i < aSelectedValues.length; ++i)
   {
      newItems.push(new DivList.DivListItem(aSelectedValues[i].value, aSelectedValues[i].text));
   }
   this.setItems(newItems);
   this.refreshView();
};

DivList.prototype.onDialogCancelButtonPressed = function(aDialog)
{
   // no-op...
};


/**
 * returns an array of DivListItem objects which represent the current
 * selections of the DivList
 */
DivList.prototype.getSelectedItems = function()
{
   return this.items;
};

/**
 * returns an array of String value objects which represent the current
 * selections of the DivList.   This is the DivListItem.value field from
 * getCurrentItems();
 */
DivList.prototype.getSelectedValues = function()
{
   var values = [];
   for (var i = 0; i < this.items.length; ++i)
   {
      values.push(this.items[i].value);
   }

   return values;
};

DivList.prototype.focusModifyButton = function()
{
   this.document.getElementById("divList_" + this.containerId + "_modify").focus();
};

DivList.prototype.focusOnSomeTextInput = function()
{
   var inputs = this.document.getElementsByName("input");
   for (var i = 0; i < inputs.length; ++i)
   {
      if (inputs[i].type == "text")
      {
         inputs[i].focus();
         break;
      }
   }

};


DivList.prototype.getDocument = function()
{
   return this.document;
};



///////////////////////////////////////////////////////////////////////////////
// inner classes :
///////////////////////////////////////////////////////////////////////////////



/**
 * DivListItem - an item in the DivList
 * @param aValue the value
 * @param aText the display text
 * @constructor
 */
DivList.DivListItem = function (aValue, aText)
{
   this.value = aValue;
   this.text  = aText;

   // set later, by the DivList...
   this.divList = null;
}

DivList.DivListItem.prototype.getDocument = function()
{
   return this.divList.getDocument();
};

DivList.DivListItem.prototype.toString = function()
{
   return "(" + this.value + ") (" + this.text + ")";
};

/**
 * creates a dom element representation of this item
 */
DivList.DivListItem.prototype.toDomElement = function()
{
   var doc = this.getDocument();
   var liNode = doc.createElement("li");
   liNode.className = "divListItem";

   liNode.appendChild(doc.createTextNode(this.text));

   return liNode;
};



/**
 * SimpleFieldExtractor - extracts properties from source object to create
 * a DivListItem
 * @param aValue the value
 * @param aText the display text
 * @constructor
 */
DivList.SimpleFieldExtractor = function (aValueProperty, aTextProperty)
{
   this.valueProperty = aValueProperty;
   this.textProperty = aTextProperty;
}


DivList.SimpleFieldExtractor.prototype.extractDivListItem = function (aSourceObject)
{
   return new DivList.DivListItem(aSourceObject[this.valueProperty], aSourceObject[this.textProperty]);
}






