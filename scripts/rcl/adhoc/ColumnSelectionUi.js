/**
 * This file defines the UiModel and Controller classes for the Adhoc
 * column selection UI...
 *
 * @author Lance Hankins
 * @author Roger Moore
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
};


//---------------------------------------------------------------------------//
//  ColumnSelectionUiController
//---------------------------------------------------------------------------//
function ColumnSelectionUiController (aDocument, aWizardReport, aPackageRoot, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      ColumnSelectionUiController.superclass.constructor.call(this, aDocument, aWizardReport, aPleaseWaitDiv);

      this.selectedColumnsList = new JsListBox ("selectedColumnsList", "selectedColumnsList", this.wizardReport.columns, new ColumnSelectionFieldExtractor() );
      this.selectedColumnsList.sortFn = null;

      this.packageRoot = aPackageRoot;

   }
}

ColumnSelectionUiController.prototype = new AbstractReportWizardUiController();
ColumnSelectionUiController.prototype.constructor = ColumnSelectionUiController;
ColumnSelectionUiController.superclass = AbstractReportWizardUiController.prototype;

ColumnSelectionUiController.prototype.refreshAll = function()
{
   this.crnMdTree.refreshView();
   this.selectedColumnsList.refreshView();
};


ColumnSelectionUiController.prototype.initializeUi = function()
{
   this.startPleaseWaitDiv();
   this.disableReportComplete();

   this.crnMdTree = new CrnMetaDataTree (this.wizardReport.packagePath, this.packageRoot, "mdTreeContainer");
   this.crnMdTree.tree.addObserver(this);

   this.setStageTitle(applicationResources.getProperty("reportWizard.columnSelection.title"));

   this.refreshAll();

   this.endPleaseWaitDiv();
   this.initKeyHandler();
};

ColumnSelectionUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};


ColumnSelectionUiController.prototype.insertSelectedColumns = function()
{
   var selected = this.crnMdTree.tree.getSelectedSrcObjects();

   if (selected.length > 0)
   {
      var newColumns = ReportColumn.createFromQueryItems(selected);

      for (var i = 0; i < newColumns.length; ++i)
      {
         this.addReportColumnToSelected(newColumns[i]);
      }

      this.selectedColumnsList.refreshView();
   }

   if(this.selectedColumnsList.availableItems.length > 0)
   {
      this.document.getElementById("runButton").disabled = false;
      this.document.getElementById("finishButton").disabled = false;
   }
};

ColumnSelectionUiController.prototype.addReportColumnToSelected = function(aNewColumn)
{
   var suffix = 2;
   var originalName = aNewColumn.name;

   while (this.selectedColumnsList.containsItemWithText(aNewColumn.name))
   {
      aNewColumn.name = originalName + " " + suffix;
      suffix++;
   }

   this.selectedColumnsList.appendSourceObject(aNewColumn);
};


ColumnSelectionUiController.prototype.removeSelectedColumns = function()
{
   var targetItems = this.selectedColumnsList.removeSelected();
   this.selectedColumnsList.refreshView();

   if(this.selectedColumnsList.availableItems.length == 0)
   {
      this.document.getElementById("runButton").disabled = true;
      this.document.getElementById("finishButton").disabled = true;
   }
};

ColumnSelectionUiController.prototype.renameSelectedColumns = function()
{
   var selectedList = this.selectedColumnsList.getSelectedItems();
   if(selectedList.length == 1)
   {
      aColumn = selectedList[0].srcObject;

      if (document.getElementById('newQueryItemName').value != '')
      {
         aColumn.name = document.getElementById('newQueryItemName').value;
         selectedList[0].text = aColumn.getDisplayText();
      }
   }

   this.selectedColumnsList.refreshView();
   document.getElementById('renameQueryItem').style.display = 'none';
   document.getElementById('renameInstruct').style.display = '';
   document.getElementById('newQueryItemName').value = '';
   this.showColumnInformation();
};

ColumnSelectionUiController.prototype.showRenameSelectedColumns = function()
{
  document.getElementById('renameQueryItem').style.display = '';
  document.getElementById('renameInstruct').style.display = 'none';
  document.getElementById('columnInformation').style.display = '';
  this.showColumnInformation();
};

ColumnSelectionUiController.prototype.showColumnInformation = function()
{
   var colInfo = document.getElementById('columnInformation');
   var selectedList = this.selectedColumnsList.getSelectedItems();
   var aColumn;
   var columnSourceName;
   if(selectedList.length == 1)
{
      aColumn = selectedList[0].srcObject;
      if(aColumn.isCalculated == true)
      {
        columnSourceName = applicationResources.getPropertyWithParameters("reportWizard.columnSelection.calculatedColumnName", new Array(aColumn.name));
      }
      else
      {
         columnSourceName = aColumn.queryItemName;
      }

      colInfo.style.display = '';
      colInfo.innerHTML = '';
      colInfo.innerHTML += '<br/><div class="label" id="colInfo' + aColumn.queryItemName +'">'+applicationResources.getProperty("reportWizard.columnSelection.currentSelectionInformation")+'</div>'
      colInfo.innerHTML += '&nbsp;&nbsp;' + applicationResources.getProperty("reportWizard.columnSelection.columnLabel") + ": " + aColumn.name  + '<br/>&nbsp;&nbsp;' +
                           applicationResources.getProperty("reportWizard.columnSelection.columnSource") + ": " + columnSourceName;
   }
};

ColumnSelectionUiController.prototype.shiftSelectedUp = function()
{
   this.selectedColumnsList.shiftSelectedUp();
};

ColumnSelectionUiController.prototype.shiftSelectedToTop = function()
{
   this.selectedColumnsList.shiftSelectedToTop();
};

ColumnSelectionUiController.prototype.shiftSelectedDown = function()
{
   this.selectedColumnsList.shiftSelectedDown();
};

ColumnSelectionUiController.prototype.shiftSelectedToBottom = function()
{
   this.selectedColumnsList.shiftSelectedToBottom();
};



ColumnSelectionUiController.prototype.applyAggregateFunction = function(aFunction)
{
   //For each selected item
   //   get the ReportColumn associated with the ListBoxItem
   //   change its aggregate function
   //   then reset the display text in the ListBoxItem

   var selectedItems = this.selectedColumnsList.getSelectedItems();
   for (var i=0; i<selectedItems.length; ++i)
   {
      var reportColumn = selectedItems[i].srcObject;  //get the ReportColumn object

      aFunction.toggleFunction (reportColumn); //toggle the aggregate

      selectedItems[i].text = reportColumn.getDisplayText();  //set the display text in the ListBoxItem

   }
   this.selectedColumnsList.refreshView();
};


ColumnSelectionUiController.prototype.preSubmit = function()
{
   this.selectedColumnsList.selectAll();
};





ColumnSelectionUiController.prototype.sortBy = function()
{
   var selectedList = this.selectedColumnsList.getSelectedItems();
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
      this.selectedColumnsList.refreshView();
   }
};

ColumnSelectionUiController.prototype.removeSortDirectionFromSelectedColumns = function()
{
   var columns = this.selectedColumnsList.getSelectedItems();
   var aColumn;
   for ( var i = 0 ; i < columns.length ; i++ )
   {
      aColumn = columns[i].srcObject;
      aColumn.sortDirective = null;
      columns[i].text = aColumn.getDisplayText();  //set the display text in the ListBoxItem
   }
};

//-------------------------------------------------------------------------------------------------
// Description :  This method sets the selcted columns sort direction to the one specified.
//-------------------------------------------------------------------------------------------------
ColumnSelectionUiController.prototype.setSelectedColumnsSortDirection = function( aSortDirection )
{
   var columns = null;
   var aColumn = null;

   columns = this.selectedColumnsList.getSelectedItems();
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
};

ColumnSelectionUiController.prototype.groupBy = function()
{
   var selectedList = this.selectedColumnsList.getSelectedItems();
   if(selectedList.length > 0)
   {
      aColumn = selectedList[0].srcObject;
      if(aColumn.groupDirective)
      {
         this.removeGroupDirectiveFromSelectedColumns();
      } else
      {
         this.setSelectedColumnsGrouped();
      }
      this.selectedColumnsList.refreshView();
   }
};

ColumnSelectionUiController.prototype.suppress = function()
{
   var selectedList = this.selectedColumnsList.getSelectedItems();
   var aColumn;
   for(var i = 0; i< selectedList.length; i++)
   {
      aColumn = selectedList[i].srcObject;
      if(aColumn.isSuppressed)
      {
         aColumn.isSuppressed = false;
         aColumn.isHidden = false;
      }
      else
      {
         aColumn.isSuppressed = true;
         aColumn.isHidden = true;
      }
      selectedList[i].text = aColumn.getDisplayText();

   }
   this.selectedColumnsList.refreshView();
}

ColumnSelectionUiController.prototype.setSelectedColumnsGrouped = function( aSortDirection )
{
   var columns = null;
   var aColumn = null;

   columns = this.selectedColumnsList.getSelectedItems();
   for ( var i = 0 ; i < columns.length ; i++ )
   {
      aColumn = columns[i].srcObject;
      aColumn.groupDirective = new GroupDirective(0);
      columns[i].text = aColumn.getDisplayText();  //set the display text in the ListBoxItem
   }
};

ColumnSelectionUiController.prototype.removeGroupDirectiveFromSelectedColumns = function()
{
   var columns = this.selectedColumnsList.getSelectedItems();
   var aColumn;
   for ( var i = 0 ; i < columns.length ; i++ )
   {
      aColumn = columns[i].srcObject;
      aColumn.groupDirective = null;
      columns[i].text = aColumn.getDisplayText();  //set the display text in the ListBoxItem
   }
};


ColumnSelectionUiController.prototype.beforeSubmit = function()
{
   this.selectedColumnsList.selectAll();
   var newColumns = this.selectedColumnsList.getSelectedSrcObjects();
   this.wizardReport.columns = newColumns;
   return true;
};


/**
 * implementation of observer interface, wired to the md tree
 **/
ColumnSelectionUiController.prototype.processEvent = function (anEvent)
{
   if (anEvent.type == ObservableEventType.COMPOUND_EVENT)
   {
      var allEvents = anEvent.payload;
      var selectedEvents = [];

      for (var i = 0; i < allEvents.length; ++i)
      {
         if (allEvents[i].type == ObservableEventType.TREE_NODE_SELECTED)
         {
            selectedEvents.push(allEvents[i]);
         }
      }

      if (selectedEvents.length == 1)
      {
         this.setCurrentSelectionDisplayInfo(selectedEvents[0].payload.srcObject.description);
      }
      else
      {
         this.setCurrentSelectionDisplayInfo('');
      }
   }
};


ColumnSelectionUiController.prototype.setCurrentSelectionDisplayInfo = function(aValue)
{
   this.document.getElementById("currentSelectionInfo").innerHTML = aValue;
};
