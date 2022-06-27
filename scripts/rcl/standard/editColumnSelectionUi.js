
/**
 * This file defines the UiModel and Controller classes for the Edit Report
 * Columns Selection UI...
 *
 * @author DK
 * @author Ryan Baula
 *
 **/



//---------------------------------------------------------------------------//
//  ColumnSelectionFieldExtractor
//---------------------------------------------------------------------------//
function ColumnSelectionFieldExtractor()
{
}

ColumnSelectionFieldExtractor.prototype.extractListBoxItem = function (anObject)
{
   return new ListBoxItem(anObject.getValue(), anObject.getDisplayText() );
}


//=================================================================================================
// Class       :  Edit Column Selection UI Model
// Description :
//=================================================================================================

function EditColumnSelectionUiModel()
{
   this.selectedColumnsList = new JsListBox ("selectedColumnsList", "selectedColumnsList", new Object(), new ColumnSelectionFieldExtractor() );
   this.selectedColumnsList.sortFn=null;

   this.availableList = new JsListBox( "availableList", "availableList", new Object(), new ColumnSelectionFieldExtractor() );
}


//---------------------------------------------------------------------------//
//  addSelectedColumns -- adds the given collection of ReportColumns
// as selected columns.  It is expected that the collection will be a map of path to ReportColumn
//---------------------------------------------------------------------------//
EditColumnSelectionUiModel.prototype.addSelectedColumns = function (aColumns)
{
   this.selectedColumnsList.appendSourceObjects(aColumns);
}

//---------------------------------------------------------------------------//
//  addAvailableColumns -- adds the given collection of ReportColumns
// as "available" columns.  It is expected that the collection will be a map of path to ReportColumn
//---------------------------------------------------------------------------//
EditColumnSelectionUiModel.prototype.addAvailableColumns = function (aColumns)
{
   this.availableList.appendSourceObjects(aColumns);
}


//-------------------------------------------------------------------------------------------------
// Description :  This method adds dummy data to the columns.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiModel.prototype.CreateTestData = function()
{

}




//=================================================================================================
// Class       :  Edit Column Selection UI Controller
// Description :
//=================================================================================================
function EditColumnSelectionUiController( aModel )
{
   this.model = aModel;
}

EditColumnSelectionUiController.prototype.refreshAll = function()
{
   this.model.selectedColumnsList.refreshView();
   this.model.availableList.refreshView();
}

EditColumnSelectionUiController.prototype.initializeUi = function()
{
   // Display the columns in the Available and Selected listboxes.
   this.refreshAll();

   //todo select first item from both lists
}


//-------------------------------------------------------------------------------------------------
// Description :  This method selects all of the items in the Available Columns listbox.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.selectAllAvailableColumns = function()
{
   this.model.availableList.selectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method unselects all of the items selected in the Available Columns listbox.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.unselectAllAvailableColumns = function()
{
   this.model.availableList.deselectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method selects all of the items in the Selected Columns listbox.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.selectAllSelectedColumns = function()
{
   this.model.selectedColumnsList.selectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method unselects all of the items selected in the Selected Columns listbox.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.unselectAllSelectedColumns = function()
{
   this.model.selectedColumnsList.deselectAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method performs actions when the Sort button is pressed.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.sortButtonHandler = function()
{
   //alert( "Sort Button was pressed" );
//   this.setNeededHiddenFields("standard", ActionConstants.DISPLAY_SORT_BY);
//   document.forms[0].submit();

   var selectedList = this.model.selectedColumnsList.getSelectedItems();
   if(selectedList.length > 0)
   {
      aColumn = selectedList[0].srcObject;
      if(aColumn.sortDirective)
      {
         if(aColumn.sortDirective.direction == SortDirective.Ascending)
         {
            this.setSelectedColumnsSortDirection(SortDirective.Descending)
         } else if(aColumn.sortDirective.direction == SortDirective.Descending)
         {
            this.removeSortDirectionFromSelectedColumns();
         }
      } else
      {
         this.setSelectedColumnsSortDirection(SortDirective.Ascending)
      }
      this.model.selectedColumnsList.refreshView();
   }
}

EditColumnSelectionUiController.prototype.removeSortDirectionFromSelectedColumns = function()
{
   var columns = this.model.selectedColumnsList.getSelectedItems();
   var aColumn;
   for ( var i = 0 ; i < columns.length ; i++ )
   {
      aColumn = columns[i].srcObject;
      aColumn.sortDirective = null;
      columns[i].text = aColumn.getDisplayText();  //set the display text in the ListBoxItem
   }
}

//-------------------------------------------------------------------------------------------------
// Description :  This method sets the selcted columns sort direction to the one specified.
//-------------------------------------------------------------------------------------------------
EditColumnSelectionUiController.prototype.setSelectedColumnsSortDirection = function( aSortDirection )
{
   var columns = null;
   var aColumn = null;

   columns = this.model.selectedColumnsList.getSelectedItems();
   for ( var i = 0 ; i < columns.length ; i++ )
   {
      aColumn = columns[i].srcObject;
      if(aColumn.sortDirective == null)
      {
         aColumn.sortDirective = new SortDirective(null, 0);
      }
      aColumn.sortDirective.direction = aSortDirection;
      columns[i].text = aColumn.getDisplayText();  //set the display text in the ListBoxItem
   }
}




//-------------------------------------------------------------------------------------------------
// Description :  This method performs actions when the Filter button is pressed.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.filterButtonHandler = function()
{
   this.setNeededHiddenFields("standard", ActionConstants.DISPLAY_FILTER);

   document.forms[0].submit();
}

EditColumnSelectionUiController.prototype.preSubmit = function()
{
   this.model.selectedColumnsList.selectAll();
   this.model.availableList.selectAll();
}


EditColumnSelectionUiController.prototype.buildXml = function(title)
{
   var srcObjects = new Array();

   var listItems = this.model.selectedColumnsList.getSelectedItems();
   for (var i = 0; i < listItems.length; ++i)
   {
      srcObjects.push(listItems[i].srcObject);
   }

   listItems = this.model.availableList.getSelectedItems();
   for (var i = 0; i < listItems.length; ++i)
   {
      srcObjects.push(listItems[i].srcObject);
   }

   return AdhocReport.toXml (title, srcObjects);
}

EditColumnSelectionUiController.prototype.setNeededHiddenFields = function(reportName, actionType)
{
    this.preSubmit();
    var xmlString = this.buildXml(reportName);

    document.getElementById('reportXml').value =  xmlString;
    document.getElementById('actionType').value =  actionType;
}



//-------------------------------------------------------------------------------------------------
// Description :  This method performs actions when the Process button is pressed.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.executeButtonHandler = function()
{
    var reportTitle = "Standard Report";

    this.setNeededHiddenFields(reportTitle, ActionConstants.EXECUTE_PROCESS);

    document.forms[0].submit();
    /*
   var rvWindowName = openExecuteReportWindow();
    this.doSubmit("actionStr", rvWindowName);
    */
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns from the Available Columns Listbox to
//                the Selected Columns Listbox.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.moveSelectedToSelectedColumnsList = function()
{
   var selectedItems = this.model.availableList.getSelectedItems();
   for (var i=0; i<selectedItems.length; ++i)
   {
       var reportColumn = selectedItems[i].srcObject;  //get the ReportColumn object
       reportColumn.isSuppressed=false;
   }

   this.model.availableList.moveSelectedToOtherList( this.model.selectedColumnsList );
   this.refreshAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns from the Selected Columns Listbox to
//                the Available Columns Listbox.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.moveSelectedToAvailableList = function()
{
   var selectedItems = this.model.selectedColumnsList.getSelectedItems();
   for (var i=0; i<selectedItems.length; ++i)
   {
      var reportColumn = selectedItems[i].srcObject;  //get the ReportColumn object
      reportColumn.isSuppressed=true;
   }

   this.model.selectedColumnsList.moveSelectedToOtherList( this.model.availableList );
   this.refreshAll();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns up in the Selected Listbox.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.moveSelectedColumnsUp = function()
{
   this.model.selectedColumnsList.shiftSelectedUp();
}


//-------------------------------------------------------------------------------------------------
// Description :  This method moves the selected Columns down in the Selected Listbox.
//-------------------------------------------------------------------------------------------------

EditColumnSelectionUiController.prototype.moveSelectedColumnsDown = function()
{
   this.model.selectedColumnsList.shiftSelectedDown();
}

EditColumnSelectionUiController.prototype.doSubmit = function(aActionStr, aWindowName)
{
   var oldTarget = document.forms[0].target;
   document.forms[0].target = aWindowName;
   document.forms[0].submit();
   document.forms[0].target = oldTarget;
}



function openExecuteReportWindow()
{
   var rvWindowName = ServerEnvironment.windowNamePrefix + "RptViewer_" + Math.round(Math.random()*10000);

   win = JsUtil.openNewWindow("",
                     rvWindowName,
                     "width=1010,height=693,top=0,left=0,menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
   return rvWindowName;


}