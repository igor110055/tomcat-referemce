/**
 * This is the key handler for JsGrid.  It should be used in conjunction with
 * the UI controller containing the JsGrid for full keyboard support.
 *
 * @author Cory Williamson
 */


//-----------------------------------------------------------------------

function GridKeyHandler(aUiHandler, aGrid)
{
   this.uiHandler = aUiHandler;
   this.grid = aGrid;
   this.selectionController = new GridSelectionController(aGrid);
   this.loadKeyCodes();
}

GridKeyHandler.prototype.loadKeyCodes = function(aDocument)
{
   this.keyDown = applicationResources.getProperty("keycode.grid.down");
   this.keyUp = applicationResources.getProperty("keycode.grid.up");
   this.keyToggle = applicationResources.getProperty("keycode.grid.toggle");
   this.keyHome = applicationResources.getProperty("keycode.grid.home");
   this.keyEnd = applicationResources.getProperty("keycode.grid.end");
   this.keyDeselect = applicationResources.getProperty("keycode.grid.deselect");

   this.gridNavigationKeys = new Array();
   this.gridNavigationKeys.push(this.keyDown);
   this.gridNavigationKeys.push(this.keyUp);
   this.gridNavigationKeys.push(this.keyToggle);
   this.gridNavigationKeys.push(this.keyHome);
   this.gridNavigationKeys.push(this.keyEnd);
   this.gridNavigationKeys.push(this.keyDeselect);
}

GridKeyHandler.prototype.init = function(aDocument)
{
   this.handleKeyEventBind = this.handleKeyEvent.bind(this);
   this.handleKeyReleaseBind = this.handleKeyRelease.bind(this);

   if (aDocument != null)
   {
      Event.observe(aDocument, 'keydown', this.handleKeyEventBind, true);
      Event.observe(aDocument, 'keyup', this.handleKeyReleaseBind, true);
   }
   else
   {
      Event.observe(document, 'keydown', this.handleKeyEventBind, true);
      Event.observe(document, 'keyup', this.handleKeyReleaseBind, true);
   }
};

GridKeyHandler.prototype.destroy = function(aDocument)
{
   if (JsUtil.isGood(this.handleKeyEventBind) && JsUtil.isGood(this.handleKeyReleaseBind))
   {
      if (aDocument != null)
      {
         Event.stopObserving(aDocument, 'keydown', this.handleKeyEventBind, true);
         Event.stopObserving(aDocument, 'keyup', this.handleKeyReleaseBind, true);
      }
      else
      {
         Event.stopObserving(document, 'keydown', this.handleKeyEventBind, true);
         Event.stopObserving(document, 'keyup', this.handleKeyReleaseBind, true);
      }
   }
}

GridKeyHandler.prototype.handleKeyRelease = function(anEvent)
{
   //---Restrict the reloading to navigational keys, since it's annoying to have it reload for any keyup
   if (this.gridNavigationKeys.indexOf(anEvent.keyCode) >= 0)
   {
      this.grid.shouldFireSelectionChanged = true;
      this.grid.fireSelectionChanged();
   }
};


GridKeyHandler.prototype.handleKeyEvent = function(anEvent)
{
   this.grid.shouldFireSelectionChanged = false;

   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;
   var altKey = anEvent.altKey;
   var keyCode = anEvent.keyCode;

   //---down arrow
   if (this.keyDown == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.handleDownSelection(shiftKey);
   }

   //---up arrow
   else if (this.keyUp == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.handleUpSelection(shiftKey);
   }

   //---shift+space
   else if (this.keyToggle == keyCode && shiftKey && !(ctrlKey || altKey))
   {
      this.selectionController.switchCurrentSelection();
   }

   //---home
   else if (this.keyHome == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.selectFirstItem(shiftKey);
   }

   //---end
   else if (this.keyEnd == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.selectLastItem(shiftKey);
   }

   //---escape
   else if (this.keyDeselect == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.deselectItems();
   }

   //---delegate to uiHandler
   else
   {
      if (this.uiHandler.handleKeyEvent)
      {
         this.uiHandler.handleKeyEvent(anEvent);
      }
   }

   if (this.gridNavigationKeys.indexOf(anEvent.keyCode) >= 0)
   {
      //---We don't want the broswer automatically scrolling the div on navigation key presses
      Event.stop(anEvent);
   }

};


function GridSelectionController(aGrid)
{
   this.lastSelectedIndex = -1;
   this.focalItemIndex = 0;

   this.grid = aGrid
   //---Must set to be notified of selection changes from mouse events
   this.grid.setKeyHandler(this);
}

GridSelectionController.UP = new Enum(0, 0);
GridSelectionController.DOWN = new Enum(1, 1);

GridSelectionController.prototype.handleDownSelection = function(aShiftKey)
{
   var rows = this.grid.rows;
   var allSelected;
   if (!aShiftKey)
   {
      allSelected = [];
   }
   else
   {
      allSelected = this.grid.getSelectedRows();
   }

   this.grid.clearCurrentSelections();

   //---Handle case where no items have been selected
   if (this.lastSelectedIndex < 0)
   {
      allSelected.push(rows[0]);
      this.lastSelectedIndex = 0;
   }
   else
   {
      if (this.focalItemIndex > this.lastSelectedIndex && aShiftKey)
      {
         //---In some cases the getSelectedRows returns the selection in reverse order..this it to protect against it.
         if (allSelected[0].rowNumber < allSelected[allSelected.length - 1].rowNumber)
         {
            allSelected.shift();
         }
         else
         {
            allSelected.pop();
         }
      }

      this.lastSelectedIndex = Math.min(this.lastSelectedIndex + 1, rows.length - 1);
      this.addUnique(rows[this.lastSelectedIndex], allSelected);
   }

   if (!aShiftKey)
   {
      this.focalItemIndex = this.lastSelectedIndex;
   }

   this.grid.selectRange(allSelected);

   this.scrollContainer(GridSelectionController.DOWN, this.lastSelectedIndex == 0 ? true : false);


   if (!is_ie)
   {
      window.getSelection().removeAllRanges();
   }

};


GridSelectionController.prototype.handleUpSelection = function(aShiftKey)
{
   var rows = this.grid.rows;
   var allSelected;
   if (!aShiftKey)
   {
      allSelected = [];
   }
   else
   {
      allSelected = this.grid.getSelectedRows();
   }

   this.grid.clearCurrentSelections();

   //---Handle case where no items have been selected
   if (this.lastSelectedIndex < 0)
   {
      allSelected.push(rows[0]);
      this.lastSelectedIndex = 0;
   }
   else
   {
      if (this.focalItemIndex < this.lastSelectedIndex && aShiftKey)
      {
         allSelected.pop();
      }

      this.lastSelectedIndex = Math.max(this.lastSelectedIndex - 1, 0);
      this.addUnique(rows[this.lastSelectedIndex], allSelected);
   }

   if (!aShiftKey)
   {
      this.focalItemIndex = this.lastSelectedIndex;
   }

   this.grid.selectRange(allSelected);


   this.scrollContainer(GridSelectionController.UP, this.lastSelectedIndex == 0 ? true : false);


   if (!is_ie)
   {
      window.getSelection().removeAllRanges();
   }
};


GridSelectionController.prototype.getSelectedItemDistance = function(aDirection)
{
   var totalSize = 0;
   //---The 2 represents the border-width (more specifically, border-top-width + border-bottom-width) value
   //---of the div.colHeader style.
   var distanceFromTop = this.getElementHeight(document.getElementById("gridHeader")) + 2;


   var rows = this.grid.rows;

   for (var i = 0; i < rows.length; i++)
   {
      distanceFromTop += this.getElementHeight(document.getElementById("row_" + i));
      if (this.lastSelectedIndex == i)
      {
         //---We want the distance to the top of the item if the direction is up
         if (aDirection == GridSelectionController.UP)
         {
            distanceFromTop = distanceFromTop - this.getElementHeight(document.getElementById("row_" + i));
         }
         i = rows.length;
      }
   }
   return distanceFromTop;
};

GridSelectionController.prototype.isItemInView = function(aItemDistance, aContainerHeight, aScrollPosition)
{
   //aScrollPosition is the minRange, aScrollPosition + containerHeight is the max
   if (this.isBetween(aItemDistance, aScrollPosition, aScrollPosition + aContainerHeight))
   {
      return true;
   }
   else
   {
      return false;
   }
};

GridSelectionController.prototype.isBetween = function(aNumber, aLowerBound, aUpperBound)
{
   if (aNumber < aLowerBound || aNumber > aUpperBound)
   {
      return false;
   }
   else
   {
      return true;
   }
};

GridSelectionController.prototype.scrollContainer = function(aDirection, aAtBeginning)
{
   var container = document.getElementById("workspaceBody");
   var containerHeight = this.getElementHeight(container);
   var scrollPosition = container.scrollTop;
   var itemDistance = this.getSelectedItemDistance(aDirection);


   if (!this.isItemInView(itemDistance, containerHeight, scrollPosition) || aAtBeginning)
   {
      var upperBound = scrollPosition + containerHeight;

      //---Determine if we add in the category
      var itemHeight = this.getElementHeight(document.getElementById("row_" + this.grid.rows[this.lastSelectedIndex].rowNumber));

      if (aAtBeginning)
      {
         itemHeight += this.getElementHeight(document.getElementById("gridHeader"));
      }


      //---Scroll to item at top
      if (itemDistance < scrollPosition)
      {
         container.scrollTop = itemDistance;
      }
      //---Scroll to item at bottom
      else
      {
         container.scrollTop = scrollPosition + (itemDistance - upperBound);
      }
   }
};


GridSelectionController.prototype.switchCurrentSelection = function()
{
   this.grid.rows[this.lastSelectedIndex].toggleSelection();
};


GridSelectionController.prototype.selectFirstItem = function(aShiftKey)
{
   this.grid.clearCurrentSelections();

   if (aShiftKey)
   {
      var allSelected = [];
      this.lastSelectedIndex = Math.max(this.lastSelectedIndex, 0);
      for (var i = this.lastSelectedIndex; i >= 0; i--)
      {
         allSelected.push(this.grid.rows[i]);
      }

      this.grid.selectRange(allSelected);
   }
   else
   {
      this.grid.rows[0].select();
   }

   this.lastSelectedIndex = 0;
   this.scrollContainer();
};


GridSelectionController.prototype.selectLastItem = function(aShiftKey)
{
   this.grid.clearCurrentSelections();

   if (aShiftKey)
   {
      var allSelected = [];
      this.lastSelectedIndex = Math.max(this.lastSelectedIndex, 0);
      for (var i = this.lastSelectedIndex; i < this.grid.rows.length; i++)
      {
         allSelected.push(this.grid.rows[i]);
      }

      this.grid.selectRange(allSelected);
   }
   else
   {
      this.grid.rows[this.grid.rows.length - 1].select();
   }

   this.lastSelectedIndex = this.grid.rows.length - 1;
   this.scrollContainer();
};


GridSelectionController.prototype.deselectItems = function()
{
   this.grid.clearCurrentSelections();
   this.lastSelectedIndex = -1;
   this.focalItemIndex = 0;
};


GridSelectionController.prototype.addUnique = function(anItem, anArray, aFront)
{
   if (!this.contains(anItem, anArray))
   {
      if (JsUtil.isGood(aFront) && aFront == true)
      {
         anArray.unshift(anItem);
      }
      else
      {
         anArray.push(anItem);
      }
   }
}


GridSelectionController.prototype.contains = function(anItem, anArray)
{
   for (var i = 0; i < anArray.length; i++)
   {
      if (anItem == anArray[i])
      {
         return true;
      }
   }

   return false;
};

GridSelectionController.prototype.getElementHeight = function(anElement)
{
      return Element.getHeight(anElement);
};

GridSelectionController.prototype.selectionChanged = function(aSelectedIndex, aFocalIndex)
{
   this.lastSelectedIndex = aSelectedIndex;
   this.focalItemIndex = aFocalIndex;
}