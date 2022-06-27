
/**
 * This file defines the UiModel and Controller classes for the Adhoc
 * Group By UI...
 *
 * @author Lance Hankins
 * @author DK
 *
 * @version $Id:groupByUi.js 534 2005-07-31 20:39:35 -0500 (Sun, 31 Jul 2005) lhankins $
 *
 **/


//=================================================================================================
// Class       :  Group By UI Model
// Description :
//=================================================================================================

function GroupByUiModel(aReportColumns)
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

      if (column.groupDirective)
      {
         selected.push(column);
         column.groupDirective = null;  // so we don't have to do this later...
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

}


//-------------------------------------------------------------------------------------------------
// Description :  This method initializes the Group By Model object.
//-------------------------------------------------------------------------------------------------

GroupByUiModel.prototype.init = function()
{
}




//=================================================================================================
// Class       :  Group By UI Controller
// Description :
//=================================================================================================
function GroupByUiController( aModel )
{
   this.uiModel = aModel;
}

GroupByUiController.prototype.initializeUi = function()
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

GroupByUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};


//-------------------------------------------------------------------------------------------------
// Description :  This method selects all of the items in the Available Columns listbox.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.selectAllAvailableColumns = function()
{
   this.uiModel.availableList.selectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method unselects all of the items selected in the Available Columns listbox.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.unselectAllAvailableColumns = function()
{
   this.uiModel.availableList.deselectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method selects all of the items in the Selected Columns listbox.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.selectAllSelectedColumns = function()
{
   this.uiModel.selectedList.selectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method unselects all of the items selected in the Selected Columns listbox.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.unselectAllSelectedColumns = function()
{
   this.uiModel.selectedList.deselectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method performs actions when the Submit button is pressed.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.submitForm = function()
{
   //--- adjust the source object model to reflect the user's selections on group-by's
   var column = null;

   this.uiModel.selectedList.selectAll();
   var selectedItems = this.uiModel.selectedList.getSelectedItems();
   for (var i = 0; i < selectedItems.length; ++i)
   {
      column = selectedItems[i].srcObject;
      column.groupDirective = new GroupDirective(i);
   }

   document.getElementById("reportXml").value = AdhocReport.toXml('todo-add-title', this.uiModel.allColumns);
   document.forms[0].submit();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method performs actions when the Cancel button is pressed.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.cancelForm = function()
{
   document.forms[0].submit();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns from the Available Columns Listbox to
//                the Selected Columns Listbox.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.moveSelectedToSelectedList = function()
{
   this.uiModel.availableList.moveSelectedToOtherList( this.uiModel.selectedList );
   this.uiModel.availableList.refreshView();
   this.uiModel.selectedList.refreshView();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns from the Selected Columns Listbox to
//                the Available Columns Listbox.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.moveSelectedToAvailableList = function()
{
   this.uiModel.selectedList.moveSelectedToOtherList( this.uiModel.availableList );
   this.uiModel.availableList.refreshView();
   this.uiModel.selectedList.refreshView();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns up in the Selected Listbox.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.moveSelectedColumnsUp = function()
{
   this.uiModel.selectedList.shiftSelectedUp();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns down in the Selected Listbox.
//-------------------------------------------------------------------------------------------------

GroupByUiController.prototype.moveSelectedColumnsDown = function()
{
   this.uiModel.selectedList.shiftSelectedDown();
}

