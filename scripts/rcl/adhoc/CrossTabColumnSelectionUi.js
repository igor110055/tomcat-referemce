/**
 * This file defines the ui controller for the crosstab column selection
 * screen
 *
 * @author Lance Hankins
 *
 **/


//---------------------------------------------------------------------------//
//  ColumnSelectionFieldExtractor
//---------------------------------------------------------------------------//
function CrossTabColumnSelectionFieldExtractor()
{
}

CrossTabColumnSelectionFieldExtractor.prototype.extractListBoxItem = function (anObject)
{
   return new ListBoxItem(anObject.getValue(), anObject.getDisplayText() );
};


//---------------------------------------------------------------------------//
//  CrossTabColumnSelectionUiController
//---------------------------------------------------------------------------//
function CrossTabColumnSelectionUiController (aDocument, aWizardReport, aPackageRoot, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      CrossTabColumnSelectionUiController.superclass.constructor.call(this, aDocument, aWizardReport, aPleaseWaitDiv);

      this.measuresList = new JsListBox ("crosstabMeasuresList", "crosstabMeasuresList", this.wizardReport.getCrossTabMeasures(), new CrossTabColumnSelectionFieldExtractor() );
      this.measuresList.sortFn = null;

      this.rowsList = new JsListBox ("crosstabRowsList", "crosstabRowsList", this.wizardReport.getCrossTabRowEdges(), new CrossTabColumnSelectionFieldExtractor() );
      this.rowsList.sortFn = null;

      this.columnsList = new JsListBox ("crosstabColumnsList", "crosstabColumnsList", this.wizardReport.getCrossTabColumnEdges(), new CrossTabColumnSelectionFieldExtractor() );
      this.columnsList.sortFn = null;

      this.allLists = [
         this.measuresList,
         this.rowsList,
         this.columnsList
      ];

      this.currentList = null; // set later...

      this.packageRoot = aPackageRoot;

      this.crnMdTree = new CrnMetaDataTree (this.wizardReport.packagePath, this.packageRoot, "mdTreeContainer");
      this.crnMdTree.tree.addObserver(this);
   }
}

CrossTabColumnSelectionUiController.prototype = new AbstractReportWizardUiController();
CrossTabColumnSelectionUiController.prototype.constructor = CrossTabColumnSelectionUiController;
CrossTabColumnSelectionUiController.superclass = AbstractReportWizardUiController.prototype;




CrossTabColumnSelectionUiController.prototype.applyToEachList = function(aFunction)
{
   for (var i = 0; i < this.allLists.length; ++i)
   {
      aFunction(this.allLists[i]);
   }
};

CrossTabColumnSelectionUiController.prototype.refreshAll = function()
{
   this.crnMdTree.refreshView();
   this.applyToEachList(function (aList) { aList.refreshView(); } );
};


CrossTabColumnSelectionUiController.prototype.initializeUi = function()
{
   this.setStageTitle(applicationResources.getProperty("reportWizard.columnSelection.stageTitle"));

   this.refreshAll();
   this.disableReportComplete();

   this.endPleaseWaitDiv();
   this.initKeyHandler();
};

CrossTabColumnSelectionUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};


CrossTabColumnSelectionUiController.prototype.addRow = function()
{
   this.addSelectedToList(this.rowsList, function (aColumn) {
      aColumn.columnType = ReportColumnTypeEnum.ROW_EDGE;
      aColumn.groupDirective = new GroupDirective(0);
   });

};

CrossTabColumnSelectionUiController.prototype.addColumn = function()
{
   this.addSelectedToList(this.columnsList, function (aColumn) {
      aColumn.columnType = ReportColumnTypeEnum.COLUMN_EDGE;
      aColumn.groupDirective = new GroupDirective(0);
   });
};

CrossTabColumnSelectionUiController.prototype.addMeasure = function()
{
   this.addSelectedToList(this.measuresList, function (aColumn) {
      aColumn.columnType = ReportColumnTypeEnum.MEASURE;
   });
};

CrossTabColumnSelectionUiController.prototype.addSelectedToList = function(aList, aColumnAdjustmentFn)
{
   var selected = this.crnMdTree.tree.getSelectedSrcObjects();

   if (selected.length > 0)
   {
      var newColumns = ReportColumn.createFromQueryItems(selected);
      for (var i = 0; i < newColumns.length; ++i)
      {
         aColumnAdjustmentFn(newColumns[i]);
      }

      aList.appendSourceObjectsFromArray(newColumns);

      aList.refreshView();

      if(this.rowsList.availableItems.length > 0 && this.columnsList.availableItems.length > 0)
      {
         this.document.getElementById("runButton").disabled = false;
         this.document.getElementById("finishButton").disabled = false;
      }
   }
};



CrossTabColumnSelectionUiController.prototype.removeSelectedColumns = function()
{
   if (this.currentList)
   {
      this.currentList.removeSelected();
      this.currentList.refreshView();

      if(this.rowsList.availableItems.length == 0 || this.columnsList.availableItems.length == 0)
      {
         this.document.getElementById("runButton").disabled = true;
         this.document.getElementById("finishButton").disabled = true;
      }
   }
};


CrossTabColumnSelectionUiController.prototype.shiftSelectedUp = function()
{
   if (this.currentList)
   {
      this.currentList.shiftSelectedUp();
   }
};


CrossTabColumnSelectionUiController.prototype.shiftSelectedDown = function()
{
   if (this.currentList)
   {
      this.currentList.shiftSelectedDown();
   }
};


CrossTabColumnSelectionUiController.prototype.sortSelected = function()
{
   var items = this.currentList.getSelectedItems();
   for (var i = 0; i < items.length; ++i )
   {
      items[i].srcObject.toggleSort();
      items[i].text = items[i].srcObject.getDisplayText();
   }

   this.currentList.refreshView();
};



CrossTabColumnSelectionUiController.prototype.onColumnsListClick = function()
{
   this.currentList = this.columnsList;

   this.rowsList.deselectAll();
   this.measuresList.deselectAll();

   this.document.getElementById("rowActions").style.display = "none";
   this.document.getElementById("measureActions").style.display = "none";
   this.document.getElementById("columnActions").style.display = "block";
};

CrossTabColumnSelectionUiController.prototype.onRowsListClick = function()
{
   this.currentList = this.rowsList;

   this.columnsList.deselectAll();
   this.measuresList.deselectAll();

   this.document.getElementById("measureActions").style.display = "none";
   this.document.getElementById("columnActions").style.display = "none";
   this.document.getElementById("rowActions").style.display = "block";
};

CrossTabColumnSelectionUiController.prototype.onMeasuresListClick = function()
{
   this.currentList = this.measuresList;

   this.rowsList.deselectAll();
   this.columnsList.deselectAll();

   this.document.getElementById("rowActions").style.display = "none";
   this.document.getElementById("columnActions").style.display = "none";
   this.document.getElementById("measureActions").style.display = "block";
};



CrossTabColumnSelectionUiController.prototype.applyAggregateFunction = function(aFunction)
{
   //For each selected item
   //   get the ReportColumn associated with the ListBoxItem
   //   change its aggregate function
   //   then reset the display text in the ListBoxItem

   var selectedItems = this.measuresList.getSelectedItems();
   for (var i=0; i<selectedItems.length; ++i)
   {
      var reportColumn = selectedItems[i].srcObject;  //get the ReportColumn object

      aFunction.toggleFunction (reportColumn); //toggle the aggregate

      selectedItems[i].text = reportColumn.getDisplayText();  //set the display text in the ListBoxItem

   }
   this.measuresList.refreshView();
};






CrossTabColumnSelectionUiController.prototype.beforeSubmit = function()
{
   this.applyToEachList(function (aList) {
      aList.selectAll();
   });

   var allColumns = this.rowsList.getSelectedSrcObjects();
   allColumns = allColumns.concat(this.columnsList.getSelectedSrcObjects());
   allColumns = allColumns.concat(this.measuresList.getSelectedSrcObjects());


   this.wizardReport.columns = allColumns;
   return true;
};


/**
 * implementation of observer interface, wired to the md tree
 **/
CrossTabColumnSelectionUiController.prototype.processEvent = function (anEvent)
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


CrossTabColumnSelectionUiController.prototype.setCurrentSelectionDisplayInfo = function(aValue)
{
   this.document.getElementById("currentSelectionInfo").innerHTML = aValue;
};
