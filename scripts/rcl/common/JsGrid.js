/**
 Copyright 2001-2008, Focus Technologies LLC.
 All rights reserved.
 **/

// $Id: JsGrid.js 6034 2008-11-06 15:12:59Z dpaul $


/**
 * @fileoverview
 * @author Lance Hankins
 * @version $Id: JsGrid.js 6034 2008-11-06 15:12:59Z dpaul $
 *
 * This file defines a JsGrid class.
 *
 * -----------------------------------------------------------------------------
 * Known Issues :
 * -----------------------------------------------------------------------------
 * 1) can't seem to right-align text in cells in mozilla (related to display:
 * -moz-inline-box)
 *
 *
 **/


//-----------------------------------------------------------------------------
/**
 * a grid event
 * @constructor
 * @class
 **/
function JsGridEvent(aType, aPayload)
{
   if (arguments.length > 0)
   {
      JsGridEvent.superclass.constructor.call(this, aType, aPayload);
   }
}

//--- JsGrid extends Observable...
JsGridEvent.prototype = new ObservableEvent();
JsGridEvent.prototype.constructor = JsGridEvent;
JsGridEvent.superclass = ObservableEvent.prototype;


/**
 * Types of JsGrid Events...
 */
ObservableEventType.GRID_ROW_SELECTED = new ObservableEventType("JsGrid", "GRID_ROW_SELECTED");
ObservableEventType.GRID_ROW_DESELECTED = new ObservableEventType("JsGrid", "GRID_ROW_DESELECTED");


//-----------------------------------------------------------------------------
/**
 * I represent a particular DataType
 * @constructor
 * @class
 **/
function DataType(aName, aSortFn)
{
   this.name = aName;
   this.sortFn = aSortFn;
}

DataType.STRING = new DataType("STRING", SortUtil.compareStringValues);
DataType.NUMERIC = new DataType("NUMERIC", SortUtil.compareNumericValues);
DataType.STRING_DATE = new DataType("STRING_DATE", SortUtil.compareStringifiedDates);


//-----------------------------------------------------------------------------
/**
 * I represent a single cell of data in a JsGrid
 * @constructor
 * @class
 **/
function Cell(aValue, aValueWithMarkup)
{
   this.value = aValue;
   this.valueWithMarkup = (aValueWithMarkup ? aValueWithMarkup : aValue);

   //--- the following items are set after creation...
   this.row = null;
}

Cell.prototype.toDomElement = function(aColumnNumber)
{
   var cellDiv = this.row.grid.document.createElement("div");
   cellDiv.className = "column-" + aColumnNumber + " cell";
   cellDiv.innerHTML = this.valueWithMarkup;

   return cellDiv;
};

Cell.prototype.toString = function()
{
   return this.value;
};


//-----------------------------------------------------------------------------
/**
 * I represent a row of data in a JsGrid
 * @constructor
 * @class
 **/
function Row(aGrid, aRowNumber)
{
   this.grid = aGrid;
   this.rowNumber = aRowNumber;

   this.isSelected = false;
   this.cells = new Array();

   //--- the following items are set after creation...
   this.domElement = null;
   this.userObject = null;
}

/**
 * adds a cell to this row...
 **/
Row.prototype.addCell = function (aCell)
{
   this.cells.push(aCell);
   aCell.row = this;
};

/**
 * static method for handling row clicks.  "this" pointer here is actually
 * the dom element...
 */
Row.clickHandlerFn = function (anEvent)
{
   this.jsgRow.handleEvent(anEvent);
};


/**
 * adds a cell to this row...
 **/
Row.prototype.toDomElement = function ()
{
   var rowDiv = this.grid.document.createElement("div");
   rowDiv.className = this.getCssClass();

   //--- bi-directional reference...
   this.domElement = rowDiv;
   rowDiv.jsgRow = this;

   rowDiv.id = "row_" + this.rowNumber;

   //--- event handlers...
   var clickHandler = function (anEvent)
   {
      this.handleEvent(anEvent);
   }.bind(this);

   Event.observe(rowDiv, "click", clickHandler, false);
   Event.observe(rowDiv, "mousedown", clickHandler, false);
   Event.observe(rowDiv, "mouseup", clickHandler, false);

   //--- cells...
   for (var i = 0; i < this.cells.length; ++i)
   {
      rowDiv.appendChild(this.cells[i].toDomElement(i));
   }

   return rowDiv;
};

/**
 * update the underlying user object and then re-draw the row...
 **/
Row.prototype.updateUserObjectAndRedraw = function(aNewUserObject)
{
   //--- unwire old userObject
   this.userObject.jsgRow = null;

   //--- associate new userObject and then re-extract this row
   this.userObject = aNewUserObject;
   this.userObject.jsgRow = this;

   this.cells = [];
   this.grid.dataProvider.populateRow(this.userObject, this);


   var oldDomElement = this.domElement;
   var newDomElement = this.toDomElement();

   oldDomElement.parentNode.replaceChild(newDomElement, oldDomElement);
   oldDomElement.jsgRow = null;
};


Row.prototype._unwire = function()
{
   // unwire old row...
   this.userObject.jsgRow = null;
   this.userObject = null;

   this.domElement.jsgRow = null;
   this.domElement = null;

};

Row.prototype.getCssClass = function()
{
   return this.isSelected ? "selected row" : "row";
};


/**
 * toggle this row's selection
 **/
Row.prototype.toggleSelection = function()
{
   if (this.isSelected)
      this.deSelect();
   else
      this.select();
};

/**
 * select this row...
 **/
Row.prototype.select = function()
{
   this.isSelected = true;
   this.domElement.className = this.getCssClass();
   this.grid.rowWasSelected(this);
};

/**
 * de-select this row...
 **/
Row.prototype.deSelect = function()
{
   this.isSelected = false;
   this.domElement.className = this.getCssClass();

   this.grid.rowWasDeSelected(this);
};

/**
 * event handler for "single select" mode
 **/
Row.prototype.singleSelect = function(anEvent)
{
   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;

   if (anEvent.type == "mousedown")
   {
      //--- user is ctrl-clicking, toggles current selection...
      if (ctrlKey)
      {
         if (this.isSelected)
            this.toggleSelection();
         else
         {
            this.grid.selectSingleRow(this);
            this.grid.notifySelectionChanged(this.rowNumber, this.rowNumber);
         }
      }
      else
      {
         this.grid.selectSingleRow(this);
         this.grid.notifySelectionChanged(this.rowNumber, this.rowNumber);
      }
   }
};

/**
 * event handler for "multi select" mode
 **/
Row.prototype.multiSelect = function(anEvent)
{
   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;

   if (anEvent.type == "mousedown")
   {
      //--- user is ctrl-clicking...
      if (ctrlKey)
      {
         this.toggleSelection();
      }

      //--- user is shift-clicking...
      else if (shiftKey)
      {
         this.grid.beginBatchOperation();


         //--- find the highest selected index, clear all but that,
         //    then select all between the current index and that one

         var start = this.grid.getHighestSelectedRowNumber();
         this.grid.clearCurrentSelections();

         if (start != -1)
         {
            this.grid.getHighestSelectedRowNumberRange(start, this.rowNumber);
         }
         else
         {
            this.select();
         }

         this.grid.notifySelectionChanged(this.rowNumber, start);


         this.grid.endBatchOperation();
      }
      //--- normal click...
      else
      {
         this.grid.selectSingleRow(this);
         this.grid.notifySelectionChanged(this.rowNumber, this.rowNumber);
      }
   }
};

/**
 * dispatches the event to the appropriate handler (based on whether the
 * grid is in single or multi-select mode).
 */
Row.prototype.handleEvent = function(anEvent)
{
   anEvent = JsUtil.normalizeEvent(anEvent);

   //--- normalize event despite browser
   if (this.grid.allowMultiSelect == true)
   {
      this.multiSelect(anEvent);
   }
   else
   {
      this.singleSelect(anEvent);
   }
};


/**
 * sensible toString for debugging
 **/
Row.prototype.toString = function()
{
   return this.cells.join(",");
};


//-----------------------------------------------------------------------------
/**
 * I represent a column in a JsGrid
 * @constructor
 * @class
 **/
function ColumnDescriptor(aDisplayText, aIsSortable, aDataType)
{
   this.displayText = aDisplayText;
   this.isSortable = aIsSortable;
   this.dataType = aDataType;
   this.sortDirection = 0;

   this.onSort = null;

   //--- set later...
   this.grid = null;
   this.columnNumber = -1;
   this.domElement = null;
   this.domSortImage = null;
}


/**
 * handle column header click
 */
ColumnDescriptor.prototype.handleEvent = function(anEvent)
{
   anEvent = JsUtil.normalizeEvent(anEvent);

   if (anEvent.type == "click")
   {
      if (this.isSortable)
      {
         if (this.onSort)
         {
            this.onSort();
         }
         else
         {
            var dir = this.sortDirection != 0 ? this.sortDirection * (-1) : 1;
            this.grid.sortBy(this, dir);
         }
      }
   }
};


/**
 * @private
 **/
ColumnDescriptor.prototype.toDomElement = function(aColumnNumber)
{
   this.columnNumber = aColumnNumber;

   var doc = this.grid.document;

   this.domElement = doc.createElement("div");
   this.domElement.className = this.getClassName();


   var table = doc.createElement("table");

   var tbody = doc.createElement("tbody");
   var tr = doc.createElement("tr");
   var td1 = doc.createElement("td")
   var td2 = doc.createElement("td")

   // NOTE: IE doesn't let me do doc.createTExtNode here...
   td1.innerHTML = this.displayText;

   this.domSortImage = doc.createElement("img");
   this.domSortImage.className = "sortDirImage";
   this.domSortImage.src = this.getSortImageSrc();

   td2.appendChild(this.domSortImage);


   tr.appendChild(td1);
   tr.appendChild(td2);
   tbody.appendChild(tr);
   table.appendChild(tbody);
//   table.appendChild(tr);

   this.domElement.appendChild(table);


   Event.observe(this.domElement, "click", function(anEvent)
   {
      this.handleEvent(anEvent);
   }.bind(this), false);

   return this.domElement;
};


/**
 * @private
 * unwire...
 **/
ColumnDescriptor.prototype._unwire = function()
{
   this.domElement = null;
};


ColumnDescriptor.prototype.setSortDirection = function (aNewValue)
{
   this.sortDirection = aNewValue;

   //--- if you're sorting before you've called refreshView for the first time, this
   //    will be null...
   if (this.domElement)
   {
      this.domSortImage.src = this.getSortImageSrc();
      this.domElement.className = this.getClassName();
   }
};

ColumnDescriptor.prototype.getClassName = function ()
{
   return "column-" + this.columnNumber + " colHeader" + (this.isSortable ? " sortable" : "") + (this.sortDirection != 0 ? " sorted" : "");
};

ColumnDescriptor.prototype.getSortImageSrc = function ()
{
   var imageName;

   if (this.sortDirection == -1)
      imageName = "sortDescending.gif";
   else if (this.sortDirection == 1)
      imageName = "sortAscending.gif";
   else
      imageName = "noSort.gif";


   return this.grid.imageDir + "/" + imageName;
};


//-----------------------------------------------------------------------------
/**
 * I am the JsGrid
 * @constructor
 * @class
 **/
function JsGrid(aDocument, aInsertionPoint, aAllowMultiSelect, aColumnDescriptors, aDataProvider)
{
   if (arguments.length > 0)
   {
      JsGrid.superclass.constructor.call(this);
      this.init(aDocument, aInsertionPoint, aAllowMultiSelect, aColumnDescriptors, aDataProvider);

      DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function()
      {
         this._unwire();
      }.bind(this));
   }
}

//--- JsGrid extends Observable...
JsGrid.prototype = new Observable();
JsGrid.prototype.constructor = JsGrid;
JsGrid.superclass = Observable.prototype;


/**
 * called from constructor, initializes this object...
 **/
JsGrid.prototype.init = function (aDocument, aInsertionPoint, aAllowMultiSelect, aColumnDescriptors, aDataProvider)
{
   this.imageDir = "."
   this.document = aDocument;
   this.insertionPoint = aInsertionPoint;
   this.dataProvider = aDataProvider;

   this.allowMultiSelect = aAllowMultiSelect;
   this.columnDescriptors = aColumnDescriptors;

   this.maxRowsForDisplay = -1;

   this.currentSelections = new Object();

   for (var i = 0; i < this.columnDescriptors.length; ++i)
   {
      this.columnDescriptors[i].grid = this;
      this.columnDescriptors[i].columnNumber = i;
   }

   this.currentSortColumn = null;

   this.domElement = null;

   this.extractRows();
};

/**
 * Add a key handler of type GridSelectionController
 */
JsGrid.prototype.setKeyHandler = function(aKeyHandler)
{
   this.keyHandler = aKeyHandler;
}


/**
 * extracts rows from DataProvider...
 **/
JsGrid.prototype.extractRows = function()
{
   var sourceObjects = this.dataProvider.getSourceObjects();
   this.rows = [];

   var eachRow = null;
   for (var i = 0; i < sourceObjects.length; ++i)
   {
      eachRow = new Row(this, i);
      this.rows.push(eachRow);

      //--- bi-directional relationship
      eachRow.userObject = sourceObjects[i];
      eachRow.userObject.jsgRow = eachRow;

      this.dataProvider.populateRow(sourceObjects[i], eachRow);
   }
};

/**
 * unwire - null out all dom references, prevent IE memory leaks...
 **/
JsGrid.prototype._unwire = function()
{
   //alert('unwiring grid......');
   this.rows.each(function (aRow)
   {
      aRow._unwire();
   });

   this.columnDescriptors.each(function (aColumn)
   {
      aColumn._unwire();
   });
};

/**
 * Notify the key handler that the selection was changed.  Called from handling mouse events.
 */
JsGrid.prototype.notifySelectionChanged = function(aSelectedIndex, aFocalIndex)
{
   if (JsUtil.isGood(this.keyHandler))
   {
      this.keyHandler.selectionChanged(aSelectedIndex, aFocalIndex);
   }
}




/**
 * a row is telling us that it has been selected...
 **/
JsGrid.prototype.rowWasSelected = function(aRow)
{
   this.currentSelections[aRow.rowNumber] = aRow;
   if (!JsUtil.isGood(this.shouldFireSelectionChanged) || this.shouldFireSelectionChanged == true)
   {
      this.publishEvent(new JsGridEvent(ObservableEventType.GRID_ROW_SELECTED, aRow));
   }
};

JsGrid.prototype.fireSelectionChanged = function()
{
   var row = this.currentSelections[this.currentSelections.size - 1];
   this.publishEvent(new JsGridEvent(ObservableEventType.GRID_ROW_SELECTED, row));
};

/**
 * a row is telling us that it has been selected...
 **/
JsGrid.prototype.rowWasDeSelected = function(aRow)
{
   delete this.currentSelections[aRow.rowNumber];
   this.publishEvent(new JsGridEvent(ObservableEventType.GRID_ROW_DESELECTED, aRow));
};

/**
 * clear current selections
 **/
JsGrid.prototype.clearCurrentSelections = function()
{
   this.beginBatchOperation();

   var key;
   for (key in this.currentSelections)
   {
      this.currentSelections[key].deSelect();
   }

   this.currentSelections = new Object();

   this.endBatchOperation();
};


/**
 * select items by index...
 */
JsGrid.prototype.selectByIndex = function(aArrayOfIndices)
{
   this.beginBatchOperation();
   for (var i = 0; i < aArrayOfIndices.length; ++i)
   {
      this.rows[aArrayOfIndices[i]].select();
   }
   this.endBatchOperation();
};

/**
 * select by row
 */
JsGrid.prototype.selectRange = function(aArrayOfRows)
{
   this.beginBatchOperation();

   for (var i = 0; i < aArrayOfRows.length; i++)
   {
      if (JsUtil.isGood(aArrayOfRows[i]))
      {
         aArrayOfRows[i].select();
      }
   }

   this.endBatchOperation();
}

/**
 * select items between the two supplied indices...
 */
JsGrid.prototype.getHighestSelectedRowNumberRange = function(aStart, aEnd)
{
   this.beginBatchOperation();
   var start = (aStart < aEnd) ? aStart : aEnd;
   var end = (start == aStart) ? aEnd : aStart;


   for (var i = start; i <= end; ++i)
   {
      this.rows[i].select();
   }
   this.endBatchOperation();
};


/**
 * returns the "highest selected item" (by rowNumber).
 */
JsGrid.prototype.getHighestSelectedRowNumber = function()
{
   for (var i = this.rows.length - 1; i >= 0; --i)
   {
      if (this.rows[i].isSelected)
      {
         //alert("highest is [" + this.rows[i].rowNumber + "]");
         return this.rows[i].rowNumber;
      }
   }

   return -1;
};


/**
 * select a single row (and unselect everything else).
 **/
JsGrid.prototype.selectSingleRow = function (aRow)
{
   this.beginBatchOperation();

   this.clearCurrentSelections();
   aRow.select();

   this.endBatchOperation();
};

/**
 * get selected rows
 **/
JsGrid.prototype.getSelectedRows = function ()
{
   return JsUtil.objectToArray(this.currentSelections);
};


/**
 * get selected userObjects
 **/
JsGrid.prototype.getSelectedUserObjects = function ()
{
   var selectedRows = this.getSelectedRows();
   var selectedObjects = new Array();

   for (var i = 0; i < selectedRows.length; ++i)
   {
      selectedObjects.push(selectedRows[i].userObject);
   }
   return selectedObjects;
};

/**
 * sort rows by the designated column and refresh the view...  This method
 * is typically called by the columnDescriptor's when someone clicks on a
 * column header
 **/
JsGrid.prototype.sortBy = function (aColumn, aSortDirection)
{
   if (this.currentSortColumn == aColumn)
   {
      this.currentSortColumn.setSortDirection(aSortDirection);
   }
   else
   {
      if (this.currentSortColumn)
         this.currentSortColumn.setSortDirection(0);

      this.currentSortColumn = aColumn;
      this.currentSortColumn.setSortDirection(aSortDirection);
   }

   SortUtil.sortArrayViaMethod(this.rows, this.sortRowsCallBackMethod, this, 1);


   //--- now we have to re-number the rows and reset our currentSelections
   //    variable (which is key'd by rowNumber)...
   this.currentSelections = new Object();

   var eachRow;

   for (var i = 0; i < this.rows.length; ++i)
   {
      eachRow = this.rows[i];
      eachRow.rowNumber = i;

      if (eachRow.isSelected)
      {
         this.currentSelections[eachRow.rowNumber] = eachRow;
      }
   }

   this.refreshView();
};

/**
 * just re-sort by the current pref (useful if you've reset the
 * rows)
 **/
JsGrid.prototype.reSort = function ()
{
   var sortCol = this.currentSortColumn != null ? this.currentSortColumn : this.columnDescriptors[0];
   var sortDir = this.currentSortColumn != null ? this.currentSortColumn.sortDirection : 1;
   this.sortBy(sortCol, sortDir);
};


/**
 * @private
 **/
JsGrid.prototype.sortRowsCallBackMethod = function (aRow1, aRow2)
{
   var sortColumn = this.currentSortColumn.columnNumber;
   return this.currentSortColumn.sortDirection * this.currentSortColumn.dataType.sortFn(aRow1.cells[sortColumn].value, aRow2.cells[sortColumn].value);
};


/**
 * refreshes the visual display of the grid (inserts it into the document)...
 **/
JsGrid.prototype.refreshView = function()
{
   var insertionPoint = this.document.getElementById(this.insertionPoint);

   //-- we'll remove this in a minute...
   var oldGridDiv = this.domElement;


   //--- outer div to hold the whole grid...
   this.domElement = this.document.createElement("div");
   this.domElement.className = "grid";
   this.domElement.id = "grid";

   //--- grid header...
   var gridHeader = this.document.createElement("div");
   gridHeader.className = "gridHeader";
   gridHeader.id = "gridHeader";

   this.domElement.appendChild(gridHeader);

   var gridHeaderRow = this.document.createElement("div");
   gridHeaderRow.className = "row headerRow";
   gridHeader.appendChild(gridHeaderRow);

   for (var i = 0; i < this.columnDescriptors.length; ++i)
   {
      gridHeaderRow.appendChild(this.columnDescriptors[i].toDomElement(i));
   }


   //--- grid body...
   var gridBody = this.document.createElement("div");
   gridBody.className = "gridBody";

   this.domElement.appendChild(gridBody);

   for (var i = 0; i < this.rows.length; ++i)
   {
      gridBody.appendChild(this.rows[i].toDomElement());

      // TODO: the following is experimental...
      if (this.maxRowsForDisplay != -1 && i >= this.maxRowsForDisplay)
      {
         var limit = this.document.createElement("div");
         limit.className = "row";
         limit.innerHTML = "...";
         gridBody.appendChild(limit);
         break;
      }
   }

   //    alert(this.domElement.innerHTML);
   //--- insert the grid div...
   if (oldGridDiv)
   {
      insertionPoint.replaceChild(this.domElement, oldGridDiv);
   }
   else
   {
      insertionPoint.appendChild(this.domElement);
   }
};

