/**
 * @fileoverview
 * This file defines a dynamic listbox helper class
 *
 * @author Lance Hankins
 *
 **/

/**
 * SimpleFieldExtractor
 * @constructor
 */
function SimpleFieldExtractor(aValueProperty, aTextProperty)
{
   this.valueProperty = aValueProperty;
   this.textProperty = aTextProperty;
}


SimpleFieldExtractor.prototype.extractListBoxItem = function (anObject)
{
   return new ListBoxItem(anObject[this.valueProperty], anObject[this.textProperty]);
};


/**
 * NoOpFieldExtractor
 * @constructor
 */
function NoOpFieldExtractor()
{
}


NoOpFieldExtractor.prototype.extractListBoxItem = function (anObject)
{
   return new ListBoxItem(anObject, anObject);
};




/**
 * ExtraPropertyFieldExtractor allows you to add a single, extra property
 * to every list box item (useful for adding an extra property for use in
 * custom sorting functions)
 * @constructor
 */
function ExtraPropertyFieldExtractor(aValueProperty, aTextProperty, aExtraProperty)
{
   this.valueProperty = aValueProperty;
   this.textProperty = aTextProperty;
   this.extraProperty = aExtraProperty;
}

/**
 * Creates a ListBoxItem with the extra property value set from the function parameter
 * @returns a ListBoxItem with the properties from the parameter
 */
ExtraPropertyFieldExtractor.prototype.extractListBoxItem = function (anObject)
{
   var newItem = new ListBoxItem(anObject[this.valueProperty], anObject[this.textProperty]);
   newItem[this.extraProperty] = anObject[this.extraProperty];
   return newItem;
};





/**
 * ListBoxItem
 * @param aValue the ListBoxItem's value
 * @param aText the ListBoxItem's text
 * @constructor
 */
function ListBoxItem(aValue,aText)
{
   this.value = aValue;
   this.text  = aText;
   this.srcObject = null;   // set just after extraction..

   this.originalListBox = null;
}

ListBoxItem.prototype.toString = function()
{
   return "(" + this.value + ") (" + this.text + ")";
};


/**
 * DefaultCellRenderer : you can provide your own if you don't like the default behavior
 * @constructor
 */
function DefaultCellRenderer()
{
}

/**
 * extracts the rendered text property from a ListBoxItem
 * @param aListBoxItem the ListBoxItem
 * @return the ListBoxItem's rendered text property
 */
DefaultCellRenderer.prototype.renderText = function(aListBoxItem)
{
   return aListBoxItem.text;
};

/**
 * static property containing the singleton instance
 */
DefaultCellRenderer.instance = new DefaultCellRenderer();



/**
 * DefaultFilter : you can provide your own if you don't like the default behavior
 * @constructor
 * @param aFilterValue the filter value
 * @param aListBox the ListBox to which to apply this filter
 */
function DefaultFilter(aFilterValue, aListBox)
{
   this.filterValue = aFilterValue.toLowerCase();
   this.listBox = aListBox;
}

/**
 * sets the filter value
 * @param aValue the filter value
 */
DefaultFilter.prototype.setFilterValue = function(aValue)
{
   this.filterValue = aValue.toLowerCase();
   this.listBox.filterHasChanged();
};

/**
 * @return a boolean specifying whether or not this ListBoxItem should be displayed
 */
DefaultFilter.prototype.shouldDisplay = function(aListBoxItem)
{
   if ("" == this.filterValue)
      return true;

   return aListBoxItem.text.toLowerCase().indexOf(this.filterValue) != -1;
};




/**
 * DefaultRemoveListener : you can provide your own if you don't like the default behavior
 * @constructor
 */
function DefaultRemoveListener()
{
}

/**
 * @return a boolean specifying whether to allow removal
 */
DefaultRemoveListener.prototype.allowRemove = function (aListBoxItem)
{
   return true;
};

/**
 * static property containing the singleton instance
 */
DefaultRemoveListener.instance = new DefaultRemoveListener();



/**
 * JsListBox
 * @param aName the name
 * @param aSelectId the id of the <SELECT> element in the document
 * @param aSourceItems the source items for this list box
 * @param aFieldExtractor an optional field extractor
 * @constructor
 */
function JsListBox(aName, aSelectId, aSourceItems, aFieldExtractor)
{
   this.name = aName;
   this.selectId = aSelectId;

   this.fieldExtractor = (aFieldExtractor != null ? aFieldExtractor : new NoOpFieldExtractor());
   this.extractAvailableFromSourceItems(aSourceItems);

   //--- default to a sensible sort fn...
   this.sortFn = SortUtil.createCompareStringValuesForFieldFn("text");

   //--- you can override this later if you want different cell rendering
   //    behavior...
   this.cellRenderer = DefaultCellRenderer.instance;


   this.removeListener = DefaultRemoveListener.instance;

   this.filter = new DefaultFilter("", this);
   this.filterChangePending = false;
}

/**
 * @param aSourceItems - an object or an array containing source objects...
 **/
JsListBox.prototype.extractAvailableFromSourceItems = function(aSourceItems)
{
   this.availableItems = new Array();

   if (JsUtil.isGood(aSourceItems))
   {
      if (JsUtil.isArray(aSourceItems))
      {
         for(var i = 0; i < aSourceItems.length; ++i)
         {
            this.availableItems.push(this.extractItemFromSourceObject(aSourceItems[i]));
         }
      }
      else
      {
         var eachKey;
         for(eachKey in aSourceItems)
         {
            this.availableItems.push(this.extractItemFromSourceObject(aSourceItems[eachKey]));
         }
      }
   }
};



/**
 * converts a single source object into a corresponding listBoxItem.
 **/
JsListBox.prototype.extractItemFromSourceObject = function (aSourceObject)
{
   var listBoxItem = this.fieldExtractor.extractListBoxItem(aSourceObject);
   listBoxItem.srcObject = aSourceObject;
   listBoxItem.originalListBox = this;
   return listBoxItem;
};



JsListBox.prototype.refreshView = function()
{
   var selectedItems = this.getSelectedItems();
   var previousSelections = new Object();

   for (var i = 0; i < selectedItems.length; ++i)
   {
      previousSelections[selectedItems[i].value] = "true";
   }


   var element = document.getElementById(this.selectId);

   var display = element.style.display;
   element.style.display = "none";

   //--- reset old listbox items...
   element.options.length = 0;

   //--- now sort current availItems...
   if (this.sortFn != null)
   {
      SortUtil.sortArray(this.availableItems, this.sortFn, 1);
   }

   //--- now reset the actual items...
   for (var i = 0; i < this.availableItems.length; ++i)
   {
      if (this.filter.shouldDisplay(this.availableItems[i]))
      {
         var newOptItem = document.createElement("option");

         newOptItem.value = this.availableItems[i].value;
         newOptItem.text  = this.cellRenderer.renderText(this.availableItems[i]);
         newOptItem.listBoxItem = this.availableItems[i];

         if (previousSelections[newOptItem.value])
         {
            newOptItem.selected = true;
         }

         element.options[element.options.length] = newOptItem;
      }
   }

   element.style.display = display;
};





/**
 * used to set the selection/deselection of list boxes
 * @param aNewAvailItems the list of available items to which to reset this list box
 */
JsListBox.prototype.resetAvailableItems = function(aNewAvailItems)
{
   var previousSelection = this.getSelectedItems();

   this.extractAvailableFromSourceItems(aNewAvailItems);
   this.refreshView();

   if (previousSelection != null)
   {
      this.selectItems(previousSelection);
   }
};


JsListBox.prototype.removeSelected = function()
{
   var retVal = new Object();
   var element = document.getElementById (this.selectId);

   var newItems = new Array();
   var removedItems = new Array();

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].selected && this.removeListener.allowRemove(element.options[i]))
      {
         removedItems.push(element.options[i].listBoxItem);
      }
   }

   var itemFound = false;

   for (var i = 0; i < this.availableItems.length; i++)
   {
     itemFound = false;

      for (var j=0; j < removedItems.length; j++)
      {
         if (this.availableItems[i] == removedItems[j])
         {
            itemFound = true;
            break;
         }
      }

     if (!itemFound)
     {
         newItems.push(this.availableItems[i]);
     }
   }

   this.availableItems = newItems;

   return removedItems;
};





JsListBox.prototype.removeAllItems = function()
{
   var retVal = new Object();
   var element = document.getElementById (this.selectId);

   var newItems = new Array();
   var removedItems = new Array();

   for (var i = 0; i < element.options.length; ++i)
   {
      if (this.removeListener.allowRemove(element.options[i]))
      {
         removedItems.push(this.availableItems[i]);
      }
      else
      {
         newItems.push(this.availableItems[i]);
      }

   }

   this.availableItems = newItems;
   return removedItems;
};



/**
 * @param aNewItems a collection of sourceItems, from which the extractor will
 * extract value and text fields
 */
JsListBox.prototype.appendSourceObjects = function(aNewItems)
{
   var eachKey;

   for (eachKey in aNewItems)
   {
      this.appendSourceObject(aNewItems[eachKey]);
   }
};

/**
 * @param aNewItems - an Array of sourceItems, from which the extractor will 
 * extract value and text fields
 */
JsListBox.prototype.appendSourceObjectsFromArray = function(aNewItems)
{
   for (var i = 0; i < aNewItems.length;++i)
   {
      this.appendSourceObject(aNewItems[i]);
   }
};


JsListBox.prototype.appendSourceObject = function(aSingleNewItem)
{
   var listBoxItem = this.fieldExtractor.extractListBoxItem(aSingleNewItem);
   listBoxItem.originalListBox = this;
   listBoxItem.srcObject = aSingleNewItem;

   this.availableItems.push(listBoxItem);
};


/**
 * adds list items to this JsListBox
 * @param aNewItems an Array of ListItems
 */
JsListBox.prototype.appendListItems = function(aNewItems)
{
   for (i = 0; i < aNewItems.length; ++i)
   {
      this.availableItems.push (aNewItems[i]);
   }
};


/**
 * removes list items from this JsListBox
 * @param aNewItems an Array of ListItems
 */
JsListBox.prototype.removeListItems = function(aTargetListItems)
{
   // TODO: we can optimize this, right now its O(n^2)
   var newAvailItems = new Array();

   for (i = 0; i < this.availableItems.length; ++i)
   {
      var shouldRemove = false;

      for (j = 0; j < aTargetListItems.length; ++j)
      {
         if (this.availableItems[i].value == aTargetListItems[j].value)
         {
            shouldRemove = true;
            break;
         }
      }

      if(!shouldRemove)
      {
         newAvailItems.push(this.availableItems[i]);
      }
   }

   this.availableItems = newAvailItems;
};



JsListBox.prototype.setAllItems = function(aFlag)
{
   var element = document.getElementById (this.selectId);

   if (!aFlag)
   {
      element.selectedIndex = -1;
   }

   for (var i = 0; i < element.options.length; ++i)
   {
      element.options[i].selected = aFlag;
   }
};

JsListBox.prototype.selectAll = function()
{
   this.setAllItems(true);
};

JsListBox.prototype.deselectAll = function()
{
   this.setAllItems(false);
};



/**
 *  remove items from list A based on other list
 * @param aOtherList a JsListBox
 */
JsListBox.prototype.removeItemsBasedOnOtherList = function(aOtherList)
{
   var itemsToRemove = aOtherList.availableItems;
   var origItems = this.availableItems;
   var newItems = new Array();

   for (var i = 0; i < origItems.length; ++i)
   {
       itemFound = false;
       for (var j = 0; j < itemsToRemove.length; j++)  {

            if (origItems[i].value == itemsToRemove[j].value)  {
                itemFound = true;
                break;
            }
        }

        if (!itemFound)
        {
           newItems[newItems.length] = origItems[i];
        }
    }

    this.availableItems = newItems;
};


/**
 * @return all selected list box items in the current list to their original list (uses the
 * originalListBox property on ListBoxItem to do this).
 */
 JsListBox.prototype.returnSelectedToOriginalList = function()
{
   this.returnSelectedToOriginalList(false);
};

/**
 * @param removeIfInOriginal determines what happens if the items are in their original list box
 * @return a boolean: true -- remove them; the items will be deleted, false -- keep them
 **/
JsListBox.prototype.returnSelectedToOriginalList = function(removeIfInOriginal)
{
   var targetItems = this.removeSelected();

   for (var i = 0; i < targetItems.length; ++i)
   {
      if (  targetItems[i].originalListBox == this &&
            removeIfInOriginal )
      {
         continue;   //just skip and it will be removed   
      }
      targetItems[i].originalListBox.availableItems.push (targetItems[i]);
   }

};



/**
 * move all my currently selected items to some other list...
 */
JsListBox.prototype.moveSelectedToOtherList = function(aOtherList)
{
   var targetItems = this.removeSelected();

   for (var i = 0; i < targetItems.length; ++i)
   {
      aOtherList.availableItems.push(targetItems[i]);
   }
};

/**
 * copy all my currently selected items to some other list...
 */
JsListBox.prototype.copySelectedToOtherList = function(aOtherList,aAllowDuplicates)
{
   var existingMap = new Object();

   if (!aAllowDuplicates) //build map of id's so that we can quickly determine if a given id is in the "other list"
   {
      var allOtherItems = aOtherList.getAllItems();
      for (var i=0; i<allOtherItems.length; i++)
      {
         var item =  allOtherItems[i];
         existingMap[item.value] = item;
      }
   }

   var targetItems = this.getSelectedItems();

   for (var i = 0; i < targetItems.length; ++i)
   {
      var item = targetItems[i];
      if (aAllowDuplicates || existingMap[item.value]==null)
      {
         aOtherList.availableItems[aOtherList.availableItems.length] = item ;
      }
   }
};


/**
 * ssed specifically for copying selected columns SUM fields to separate list box.
 */
JsListBox.prototype.copySelectedValuesToOtherList = function(aOtherList, literal)
{
   var copyItems = this.getSelectedItems();
   var element =  document.getElementById (aOtherList.selectId);

   var text;
   var value;
   var j = 0;

   //--- reset old listbox items...
   element.options.length = 0;

   //--- now reset the actual items...
   for (var i = 0; i < copyItems.length; ++i)
   {
      text = copyItems[i].text;
      value = copyItems[i].value;
      if (literal == null || text.indexOf(literal) != -1)
      {
        var newOptItem = document.createElement("option");

        newOptItem.value = value;
        newOptItem.text  = text;
        newOptItem.listBoxItem = copyItems[i];

        element.options[element.options.length] = newOptItem;
        element.options[element.options.length-1].selected = true;
      }
   }
};

/**
 * used specifically for copying selected columns Names to a separate list box
 */
JsListBox.prototype.copySelectedNamesToOtherList = function(aOtherList)
{
   var copyItems = this.getSelectedItems();
   var element =  document.getElementById (aOtherList.selectId);

   var text;
   var value;
   var j = 0;

   //--- reset old listbox items...
   element.options.length = 0;

   //--- now reset the actual items...
   for (var i = 0; i < copyItems.length; ++i)
   {
      text = copyItems[i].text;
      value = copyItems[i].value;

      var newOptItem = document.createElement("option");
      newOptItem.value = value;
      newOptItem.text  = text;
      newOptItem.listBoxItem = copyItems[i];

      element.options[element.options.length] = newOptItem;
      element.options[element.options.length-1].selected = true;
   }
};



/**
 * @param aItemsToSelect an Array of ListBoxItem objects
 **/
JsListBox.prototype.selectItems = function(aItemsToSelect)
{
   var itemCompareFn = function (a,b) {
      return a.value == b.value;
   };

   this.selectItemsFromXXX(itemCompareFn, aItemsToSelect);
};


/**
 * @param aItemsToSelect an Array of objects containing 'value' properties
 **/
JsListBox.prototype.selectItemsFromValues = function(aItemsToSelect)
{
   var itemCompareFn = function (a,b) {
      return a.value == b;
   };

   this.selectItemsFromXXX(itemCompareFn, aItemsToSelect);
};


JsListBox.prototype.selectItemsFromXXX = function(aCompareFn, aValues)
{
   var element = document.getElementById (this.selectId);

   //--- iterate through child options, selecting them if they're
   //    present in the supplied array...

   for (var i = 0; i < element.options.length; ++i)
   {
      if (!element.options[i].selected)
      {
         for (var j = 0; j < aValues.length; ++j)
         {
            if(aCompareFn(element.options[i], aValues[j]))
            {
               element.options[i].selected = true;
            }
         }
      }
   }
};

JsListBox.prototype.unselectItemsFromValues = function(aItemsToUnselect)
{
   var itemCompareFn = function (a,b) {
      return a.value == b;
   };

   this.unselectItemsFromXXX(itemCompareFn, aItemsToUnselect);
};

JsListBox.prototype.unselectItemsFromXXX = function(aCompareFn, aValues)
{
   var element = document.getElementById (this.selectId);

   //--- iterate through child options, selecting them if they're
   //    present in the supplied array...

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].selected)
      {
         for (var j = 0; j < aValues.length; ++j)
         {
            if(aCompareFn(element.options[i], aValues[j]))
            {
               element.options[i].selected = false;
            }
         }
      }
   }
};

/**
 * @return array of selected ListBoxItem objects
 **/
JsListBox.prototype.getSelectedItems = function()
{
   var selected = new Array();

   var element = document.getElementById (this.selectId);

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].selected)
      {
         for(var j = 0; j < this.availableItems.length; j++)
         {
            // handle case where values are equal, but display text is not...
            if (element.options[i].value == this.availableItems[j].value &&
                element.options[i].text == this.availableItems[j].text)
            {
               selected.push(this.availableItems[j]);
               break;
            }
         }
      }
   }

   return selected;
};


/**
 * @return array of selected srcObjects
 **/
JsListBox.prototype.getSelectedSrcObjects = function()
{
   var selected = this.getSelectedItems();
   var selectedSrc = [];

   for (var i = 0; i < selected.length; ++i)
   {
      selectedSrc.push(selected[i].srcObject);
   }

   return selectedSrc;
};


/**
* @return array of selected values
*
**/
JsListBox.prototype.getSelectedValues = function()
{
   var selected = new Array();

   var element = document.getElementById (this.selectId);

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].selected)
      {
         for(var j = 0; j < this.availableItems.length; j++)
         {
            if (element.options[i].value == this.availableItems[j].value)
            {
               selected.push(this.availableItems[j].value);
               break;
            }
         }
      }
   }

   return selected;
};


/**
 * @return an Array of ListBoxItem objects
 *
 **/
JsListBox.prototype.getAllItems = function()
{
   return this.availableItems;
};


/**
 * @return an Array of ints which represent the currently selected indices...
 *
 **/
JsListBox.prototype.getSelectedIndices = function()
{
   var selectedIndices = new Array();
   var element = document.getElementById (this.selectId);

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].selected)
      {
         selectedIndices[selectedIndices.length] = i;
      }
   }
   return selectedIndices;
};


JsListBox.prototype.clearList = function()
{
   var element = document.getElementById (this.selectId);
   element.options.length = 0;
   this.availableItems = new Array();
};

JsListBox.prototype.getLength = function()
{
   var element = document.getElementById (this.selectId);
   return element.options.length;
};

/**
 *  We keep this misspelled version for backward compatibility.
 * Notice, the missing 't' in items.  Please use setItemAsSelectedByText
 **/
JsListBox.prototype.setIemAsSelectedByValue = function(anItemValue)
{
   this.setItemAsSelectedByValue(anItemValue);
};


JsListBox.prototype.setItemAsSelectedByValue = function(anItemValue)
{
   var element = document.getElementById (this.selectId);

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].value == anItemValue)
      {
         element.options[i].selected = true;
      }
   }
};

/**
 * Sets the item with the given index as selected
 * The indices start with zero and end with this.availableItems.length-1
 **/
JsListBox.prototype.setItemAsSelectedByIndex = function(anIndex)
{
   var element = document.getElementById (this.selectId);
   element.options[anIndex].selected = true;
};

/**
 *  We keep this misspelled version for backward compatibility.
 * Notice, the missing 't' in items.  Please use setItemAsSelectedByText
 **/
JsListBox.prototype.setIemAsSelectedByText = function(anItemText)
{
   this.setItemAsSelectedByText(anItemText);
};

JsListBox.prototype.setItemAsSelectedByText = function(anItemText)
{
   var element = document.getElementById (this.selectId);

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].text == anItemText)
      {
         element.options[i].selected = true;
      }
   }
};


/**
 * returns true if this list contains an item with the supplied value
 **/
JsListBox.prototype.containsItemWithValue = function(aValue)
{
   var element = document.getElementById (this.selectId);

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].value == aValue)
      {
         return true;
      }
   }
   return false;
};


/**
 * returns true if this list contains an item with the supplied display text
 **/
JsListBox.prototype.containsItemWithText = function(aText)
{
   var element = document.getElementById (this.selectId);

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].text == aText)
      {
         return true;
      }
   }
   return false;
};


JsListBox.prototype.resortBasedOnTheseValues = function(aValues)
{
   var newAvailItems = new Array();

   for (var i = 0; i < aValues.length; ++i)
   {
      for (var j = 0; j < this.availableItems.length; ++j)
      {
         if (this.availableItems[j].value == aValues[i])
         {
            newAvailItems[newAvailItems.length] = this.availableItems[j];
            break;
         }
      }
   }


   this.availableItems = newAvailItems;
};



JsListBox.prototype.setNameAndValueFromArray = function(aNames, aValues)
{

   var newAvailItems = new Array();

   for (var i = 0; i < aValues.length; ++i)
   {
      for (var j = 0; j < this.availableItems.length; ++j)
      {
         if (this.availableItems[j].value == aValues[i])
         {
            newAvailItems[newAvailItems.length] = this.availableItems[j];
            break;
         }
      }
   }


   this.availableItems = newAvailItems;
};




/**
 * moves all selected items to the top.
 *
 * NOTE: one side effect of this method is that it will remove any
 * sortFn which is installed on this list (since sorting doesn't make sense
 * if we allow shifting).
 *
 **/
JsListBox.prototype.shiftSelectedToTop = function()
{
   this.sortFn = null;

   var targets = this.removeSelected();
   this.availableItems = targets.concat(this.availableItems);

   this.refreshView();

   //--- re-select them...
   var select = document.getElementById (this.selectId);
   for (var i = 0; i < targets.length; ++i)
   {
      select.options[i].selected = true;
   }
};




/**
 * moves all selected items to the top.
 *
 * NOTE: one side effect of this method is that it will remove any
 * sortFn which is installed on this list (since sorting doesn't make sense
 * if we allow shifting).
 *
 **/
JsListBox.prototype.shiftSelectedToBottom = function()
{
   this.sortFn = null;

   var targets = this.removeSelected();
   this.availableItems = this.availableItems.concat(targets);

   this.refreshView();

   //--- re-select them...
   var select = document.getElementById (this.selectId);
   for (var i = 0; i < targets.length; ++i)
   {
      select.options[(select.options.length-1)-i].selected = true;
   }
};



/**
 * shift all currently selected objects up by one.  This method automatically
 * calls refreshView when its done.
 *
 * NOTE: one side effect of this method is that it will set the remove any
 * sortFn which is installed on this list (since sorting doesn't make sense
 * if we allow shifting).
 **/
JsListBox.prototype.shiftSelectedUp = function()
{
   this.sortFn = null;

   var previousSelection = this.getSelectedItems();


   var selectedIndices = this.getSelectedIndices();
   var element = document.getElementById (this.selectId);

   var indexItem;
   var tmpItem;

   for (var i = 0; i < selectedIndices.length; i++)
   {
      indexItem = selectedIndices[i];

      if (indexItem != 0)
      {
         tmpItem = this.availableItems[indexItem-1];
         this.availableItems[indexItem-1] = this.availableItems[indexItem];
         this.availableItems[indexItem] = tmpItem;
      }
   }

   this.refreshView();

   //--- re-select anything that was already selected...
   if (previousSelection != null)
   {
      this.selectItems(previousSelection);
   }
};


/**
 * shift all currently selected objects down by one.  This method automatically
 * calls refreshView when its done.
 *
 * NOTE: one side effect of this method is that it will set the remove any
 * sortFn which is installed on this list (since sorting doesn't make sense
 * if we allow shifting).
 **/
JsListBox.prototype.shiftSelectedDown = function()
{
   this.sortFn = null;

   var previousSelection = this.getSelectedItems();

   var selectedIndices = this.getSelectedIndices();
   var element = document.getElementById (this.selectId);

   var indexItem;
   var tmpItem;

   for (var i = (selectedIndices.length-1); i >= 0 ; i--)
   {
      indexItem = selectedIndices[i];

      if (indexItem != (this.availableItems.length-1))
      {
         tmpItem = this.availableItems[indexItem+1];
         this.availableItems[indexItem+1] = this.availableItems[indexItem];
         this.availableItems[indexItem] = tmpItem;
      }
   }

   this.refreshView();

   //--- re-select anything that was already selected...
   if (previousSelection != null)
   {
      this.selectItems(previousSelection);
   }
};


/**
 * changes the text filter for this listbox, will cause a refresh eventually...
 *
 */
JsListBox.prototype.setTextFilter = function(aNewValue)
{
   this.filter.filterValue = aNewValue.toLowerCase();
   this.filterHasChanged();
};



//--- this static variable is a HACK because we can't pass a "this" pointer to setTimeout

JsListBox.instanceMap = new Object();

JsListBox.prototype.filterHasChanged = function()
{
   if(this.filterChangePending == false)
   {
      this.filterChangePending = true;

      //--- HACK because we can't pass this pointer to setTimeout
      JsListBox.instanceMap[this.selectId] = this;


      var callbackFnTxt = "var listBox = JsListBox.instanceMap['" + this.selectId + "'];" +
                          "listBox.filterChangePending = false;" +
                          "listBox.refreshView();" +
                          "delete JsListBox.instanceMap['" + this.selectId + "'];";

      setTimeout(callbackFnTxt,1000);
   }
};
