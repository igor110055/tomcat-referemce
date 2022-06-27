
/**
 * This file defines the UiModel and Controller classes for the Adhoc
 * Sort By UI...
 *
 * @author Lance Hankins
 * @author DK
 * @version $Id:sortByUi.js 534 2005-07-31 20:39:35 -0500 (Sun, 31 Jul 2005) lhankins $
 *
 **/


//=================================================================================================
// Class       :  Group By UI Model
// Description :
//=================================================================================================

function SortByUiModel(aReportColumns)
{
   this.allColumns = new Array();

   var available = new Array();
   var selected = new Array();

   var key;
   var column;

   for (key in aReportColumns)
   {
      column = aReportColumns[key];

      this.allColumns.push(column);

      if (column.sortDirective)
      {
         selected[column.sortDirective.order] = column;
      }
      else
      {
         available.push(column);
      }
   }

   //--- custom extractor...
   var extractor = new Object();

   extractor.extractListBoxItem = function (anObject)
   {
      var newItem = new ListBoxItem(anObject.queryItem.path, anObject.queryItem.name);
      return newItem;
   }



   this.availableList = new JsListBox( "availableList",
                                            "availableList",
                                            available,
                                            extractor );

   this.selectedList = new JsListBox( "selectedList",
                                           "selectedList",
                                           selected,
                                           extractor );
   this.selectedList.sortFn=null; //no sorting

   // Sort the internal array contained by the Dynamic Listbox because it initializes the internal array as an associative array of objects
   // but displays the items as if the internal array was an index array and we use the index of the item to maintain the sorting order.
   // So, since the order of an array can be different depending on how the array is accessed; an associative array or an index array.
   // We sort the internal list so both access methods return the items in the same order.
   this.selectedList.availableItems.sort( function( a, b ){
      return a.srcObject.sortDirective.order-b.srcObject.sortDirective.order;
   });

   this.selectedList.cellRenderer = new Object();
   this.selectedList.cellRenderer.renderText = function( aListBoxItem )
   {
      var column = aListBoxItem.srcObject;
      if ( column.sortDirective == null )
      {
         column.sortDirective = new SortDirective( SortDirective.Ascending, 0 );
      }
      return aListBoxItem.text + "  (" + column.sortDirective.getDisplayText() + ")";
   }

}


//-------------------------------------------------------------------------------------------------
// Description :  This method initializes the Group By Model object.
//-------------------------------------------------------------------------------------------------

SortByUiModel.prototype.init = function()
{
}




//=================================================================================================
// Class       :  Group By UI Controller
// Description :
//=================================================================================================
function SortByUiController( aModel )
{
   this.uiModel = aModel;
}

SortByUiController.prototype.initializeUi = function()
{
   // Display the columns in the Available and Selected listboxes.
   this.uiModel.availableList.refreshView();
   this.uiModel.selectedList.refreshView();

   // Select the first item in the Available Columns listbox.
   if ( this.uiModel.availableList.length > 0 )
   {
      this.uiModel.availableList.setItemAsSelectedByIndex( "0" );
   }

   // Select the first item in the Selected Columns listbox.
   if ( this.uiModel.selectedList.length > 0 )
   {
      this.uiModel.selectedList.setItemAsSelectedByIndex( "0" );
   }
   this.initKeyHandler();
};

SortByUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};

//-------------------------------------------------------------------------------------------------
// Description :  This method selects all of the items in the Available Columns listbox.
//-------------------------------------------------------------------------------------------------

SortByUiController.prototype.selectAllAvailableColumns = function()
{
   this.uiModel.availableList.selectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method unselects all of the items selected in the Available Columns listbox.
//-------------------------------------------------------------------------------------------------

SortByUiController.prototype.unselectAllAvailableColumns = function()
{
   this.uiModel.availableList.deselectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method selects all of the items in the Selected Columns listbox.
//-------------------------------------------------------------------------------------------------

SortByUiController.prototype.selectAllSelectedColumns = function()
{
   this.uiModel.selectedList.selectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method unselects all of the items selected in the Selected Columns listbox.
//-------------------------------------------------------------------------------------------------

SortByUiController.prototype.unselectAllSelectedColumns = function()
{
   this.uiModel.selectedList.deselectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method performs actions when the Submit button is pressed.
//-------------------------------------------------------------------------------------------------

SortByUiController.prototype.submitForm = function()
{
   //--- adjust the source object model to reflect the user's selections on sort-by's
   var column = null;

   this.uiModel.selectedList.selectAll();
   var selectedItems = this.uiModel.selectedList.getSelectedItems();
   for (var i = 0; i < selectedItems.length; ++i)
   {
      column = selectedItems[i].srcObject;
      column.sortDirective.order = i;
   }

   this.removeSortDirectionFromAvailableColumns();

   var submitAction = document.getElementById("submitAction").value;
   document.forms[0].action = submitAction;
   //alert(submitAction);

   document.getElementById("reportXml").value = AdhocReport.toXml('todo-add-title', this.uiModel.allColumns);
   document.getElementById('actionType').value = ActionConstants.EXECUTE_SORT_BY;
   document.forms[0].submit();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method performs actions when the Cancel button is pressed.
//-------------------------------------------------------------------------------------------------
SortByUiController.prototype.cancelForm = function()
{
   var submitAction = document.getElementById("submitAction").value;
   document.forms[0].action = submitAction;
   //alert(submitAction);
   document.getElementById('actionType').value = ActionConstants.CANCEL_SORT_BY
   document.forms[0].submit();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns from the Available Columns Listbox to
//                the Selected Columns Listbox.
//-------------------------------------------------------------------------------------------------
SortByUiController.prototype.moveSelectedToSelectedList = function()
{
   // Note: The SortDirective object will be created for each column moved when the JsListBox
   // displays the column in the listbox.  A custom renderText was assigned to the listbox.
   this.uiModel.availableList.moveSelectedToOtherList( this.uiModel.selectedList );
   this.uiModel.availableList.refreshView();
   this.uiModel.selectedList.refreshView();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns from the Selected Columns Listbox to
//                the Available Columns Listbox.
//-------------------------------------------------------------------------------------------------
SortByUiController.prototype.moveSelectedToAvailableList = function()
{
   this.uiModel.selectedList.moveSelectedToOtherList( this.uiModel.availableList );
   // Remove the SortDirective object from all of the columns in the Available listbox.
   // It will be reassigned if the column is moved back to Selected listbox.
   this.removeSortDirectionFromAvailableColumns();
   this.uiModel.availableList.refreshView();
   this.uiModel.selectedList.refreshView();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns up in the Selected Listbox.
//-------------------------------------------------------------------------------------------------

SortByUiController.prototype.moveSelectedColumnsUp = function()
{
   this.uiModel.selectedList.shiftSelectedUp();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns down in the Selected Listbox.
//-------------------------------------------------------------------------------------------------

SortByUiController.prototype.moveSelectedColumnsDown = function()
{
   this.uiModel.selectedList.shiftSelectedDown();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method sets the selcted column to sort ascending.
//-------------------------------------------------------------------------------------------------
SortByUiController.prototype.setSelectedColumnToAscending = function()
{
   this.setSelectedColumnsSortDirection( SortDirective.Ascending );
}


//-------------------------------------------------------------------------------------------------
// Description :  This method sets the selcted column to sort ascending.
//-------------------------------------------------------------------------------------------------
SortByUiController.prototype.setSelectedColumnToDescending = function()
{
   this.setSelectedColumnsSortDirection( SortDirective.Descending );
}


//-------------------------------------------------------------------------------------------------
// Description :  This method sets the selcted columns sort direction to the one specified.
//-------------------------------------------------------------------------------------------------
SortByUiController.prototype.setSelectedColumnsSortDirection = function( aSortDirection )
{
   var columns = null;
   var aColumn = null;

   columns = uiModel.selectedList.getSelectedItems();
   for ( var i = 0 ; i < columns.length ; i++ )
   {
      aColumn = columns[i].srcObject;
      aColumn.sortDirective.direction = aSortDirection;
   }
   if ( columns.length > 0 )
   {
      uiModel.selectedList.refreshView();
   }
}


//-------------------------------------------------------------------------------------------------
// Description :  This method removes the sort directive from all columns in the Available listbox
//                before submitting the page and when moving a selected column back to the
//                Available listbox.
//-------------------------------------------------------------------------------------------------
SortByUiController.prototype.removeSortDirectionFromAvailableColumns = function()
{
   var columns = null;
   var aColumn = null;

   columns = uiModel.availableList.availableItems;
   for ( var i = 0 ; i < columns.length ; i++ )
   {
      aColumn = columns[i].srcObject;
      aColumn.sortDirective = null;
   }
}
