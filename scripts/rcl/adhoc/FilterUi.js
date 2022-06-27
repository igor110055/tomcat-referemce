/**
 * This file defines the UiModel and Controller classes for the Filter  UI
 *
 * @author Lance Hankins
 *
 **/



//---------------------------------------------------------------------------//
//  Local Extensions to ReportFilter...
//---------------------------------------------------------------------------//

ReportFilter.prototype.isDirty = function(aName, aExpression, aUsage)
{
   return !(this.name == aName && this.usage == aUsage && this.expression == aExpression);
};




//---------------------------------------------------------------------------//
//  FilterExtractor
//---------------------------------------------------------------------------//
function FilterExtractor()
{
}

FilterExtractor.prototype.extractListBoxItem = function (anObject)
{
   return new ListBoxItem(anObject.name, anObject.name );
};




//---------------------------------------------------------------------------//
// FilterUiController
//---------------------------------------------------------------------------//

function FilterUiController(aDocument, aWizardReport, aPackageRoot, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      FilterUiController.superclass.constructor.call(this, aDocument, aWizardReport, aPleaseWaitDiv);

      this.packageRoot = aPackageRoot;

      //--- Md Tree...
      this.crnMdTree = new CrnMetaDataTree (this.wizardReport.packagePath, this.packageRoot, "mdTreeContainer");
      this.crnMdTree.tree.isMultiSelect = false;
      this.crnMdTree.tree.addObserver(this);


      //--- Function Md Tree...
      this.crnFunctionMdTree = new CrnFunctionMetaDataTree (this.wizardReport.packagePath, "functionMdTreeContainer");
      this.crnFunctionMdTree.tree.addObserver(this);

      //--- Tab Bar...
      this.tabBar = new TabBar();
      this.tabBar.addTabListener(this);
      this.tabBar.createAndAdd("model", applicationResources.getProperty("reportWizard.filters.model"));
      this.tabBar.createAndAdd("currentColumns", applicationResources.getProperty("reportWizard.filters.currentColumns"));
      this.tabBar.createAndAdd("functions", applicationResources.getProperty("reportWizard.filters.functions"));


      this.currentTab = null;



      //--- Current Columns (LHS - non filters)
      this.currentColumnsTree = new Tree("currentColumnsTreeContainer");
      this.currentColumnsTree.isMultiSelect = false;

      var root = this.currentColumnsTree.createNode("currentColumns", applicationResources.getProperty("reportWizard.filters.currentReportColumns"), this.crnMdTree.folderNodeType, null, false);
      this.currentColumnsTree.addRootNode(root);

      var eachColumn;
      for (var i = 0; i < this.wizardReport.columns.length; ++i)
      {
         eachColumn = this.wizardReport.columns[i];
         root.addChild(this.currentColumnsTree.createNode("csc-" + i, eachColumn.name, this.crnMdTree.queryItemAttribute, eachColumn, false));
      }

      this.currentColumnsTree.addObserver(this);

      //--- Currently defined Filters...
      this.filters = this.wizardReport.getFilters();
      this.availableFilters = new JsListBox ("availableFilters", "availableFilters", this.wizardReport.filters , new FilterExtractor() );

      this.activeFilter = null;


      //--- Etc...
      this.newFilterCount = 0;
      this.isNewFilter = false;
   }
}

FilterUiController.prototype = new AbstractReportWizardUiController();
FilterUiController.prototype.constructor = FilterUiController;
FilterUiController.superclass = AbstractReportWizardUiController.prototype;



FilterUiController.prototype.initializeUi = function()
{
   this.startPleaseWaitDiv();
   this.disableReportComplete();

   this.setStageTitle(applicationResources.getProperty("reportWizard.filters.stageTitle"));


   this.tabBar.insertIntoDocument(this.document, this.document.getElementById("tabBarContainer"));
   this.tabBar.selectFirstTab(true);

   this.refreshAll();
   this.disableReportComplete();

   this.endPleaseWaitDiv();
   this.initKeyHandler();
};

FilterUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};



FilterUiController.prototype.refreshAll = function()
{
   this.crnMdTree.refreshView();
   this.currentColumnsTree.refreshView();
   this.crnFunctionMdTree.refreshView();


   this.availableFilters.refreshView();
}



FilterUiController.prototype.tabWasSelected = function(aTab)
{
   this.currentTab = aTab;

   var model = "model" == aTab.id ? "block" : "none";
   var currentCols = "currentColumns" == aTab.id ? "block" : "none";
   var functions = "functions" == aTab.id ? "block" : "none";;

   this.document.getElementById("mdModelContainer").style.display = model;
   this.document.getElementById("currentColumnsContainer").style.display = currentCols;
   this.document.getElementById("functionMdContainer").style.display = functions;
}



/**
 * the add button was pressed, we'll add a new calc column and let the user
 * edit its details...
 **/
FilterUiController.prototype.addNewFilter = function()
{
   this.newFilterCount++;
   var defaultName = this.newFilterCount == 1 ? applicationResources.getProperty("reportWizard.filters.newFilter") : applicationResources.getProperty("reportWizard.filters.newFilter")+" " + this.newFilterCount;

   this.isNewFilter = true;

   var form = this.document.forms[0];

   var dataType = null; // ???

   /* TODO determine which kind of filter should be used.
      detailed (required) are applied before query
      summary (optional) are applied after query

      within Cognos Report Studio
        detailed - can be from the source ,data items, or the query
        summary  - can be from the data items or the query not the source
   */
   if(this.wizardReport.reportType == "CROSSTAB")
   {
      this.activeFilter = new ReportFilter(defaultName, "", FilterUsageEnum.REQUIRED, "REQUIRED");
   }
   else if(this.wizardReport.reportType == "LIST")
   {
      this.activeFilter = new ReportFilter(defaultName, "", FilterUsageEnum.REQUIRED, "OPTIONAL");
   }

   this.wizardReport.filters.push(this.activeFilter);

   this.refreshAvailableFilters();

   this.activeFilterChanged();
}




/**
 * @private
 **/
FilterUiController.prototype.refreshAvailableFilters = function()
{
   this.availableFilters.resetAvailableItems(this.filters);
   this.wizardReport.filters = this.filters;
   this.availableFilters.refreshView();
}


/**
 * @private
 **/
FilterUiController.prototype.activeFilterChanged = function()
{
   var form = this.document.forms[0];

   if (this.activeFilter != null)
   {
      this.setEditElementsDisabled(false);

      form.filterName.value = this.activeFilter.name;
      form.filterExpression.value = this.activeFilter.expression;

      form.filterName.select();
      form.filterName.focus();
   }
   else
   {
      this.setEditElementsDisabled(true);

      form.filterName.value = "";
      form.filterExpression.value = "";

   }
}



/**
 * @private
 **/
FilterUiController.prototype.setEditElementsDisabled = function(aIsDisabled)
{
   var form = this.document.forms[0];
   form.filterName.disabled = aIsDisabled;
   form.filterExpression.disabled = aIsDisabled;

   this.document.getElementById("activeFilterContainer").style.display = aIsDisabled ? "none" : "block";

   this.document.getElementById("cancelButton").disabled = aIsDisabled;
   this.document.getElementById("saveButton").disabled = aIsDisabled;
   this.document.getElementById("insertValueButton").disabled = aIsDisabled;
}


/**
 * save button was pressed, update the active filter with the new values
 **/
FilterUiController.prototype.saveActiveFilter = function()
{
   var form = this.document.forms[0];

   var name = form.filterName.value;
   var expression = form.filterExpression.value;

   if (this.validateInput(name, expression))
   {
      this.activeFilter.name = name;
      this.activeFilter.expression = expression;


      this.refreshAvailableFilters(this.wizardReport.filters);
      this.availableFilters.deselectAll();


      this.activeFilter = null;
      this.activeFilterChanged();
   }
}

/**
 * cancel button was pressed
 **/
FilterUiController.prototype.cancelActiveFilter = function()
{
//   this.activeFilter = null;
//   this.activeFilterChanged();
   this.discardActiveFilterIfDirty();
}


/**
 * validate the supplied name and expression
 **/
FilterUiController.prototype.validateInput = function(aName, aExpression)
{
   if (aName == null || JsUtil.trim(aName).length == 0)
   {
      alert(applicationResources.getProperty("reportWizard.errMsg.nameFieldMustBeNonZeroLength"));
      return false;
   }

   if (aExpression == null || JsUtil.trim(aExpression).length == 0)
   {
      alert(applicationResources.getProperty("reportWizard.errMsg.nameFieldMustBeNonZeroLength"));
      return false;
   }

   if (aName != this.activeFilter.name && this.wizardReport.getFilterByName(aName) != null)
   {
      alert(applicationResources.getPropertyWithParameters("reportWizard.errMsg.filterNameAlreadyExists", new Array(aName)));
      return false;
   }
   return true;
};


/**
 * insert the selected node from the LHS into the expr box
 **/
FilterUiController.prototype.insertSelected = function()
{
   var selected;
   var dropText;

   if (this.currentTab.id == "model")
   {
      selected = this.crnMdTree.tree.getSelectedSrcObjects();

      if (selected.length == 0)
         return;

      dropText = selected[0].ref;
   }
   else if (this.currentTab.id == "currentColumns")
   {
      selected = this.currentColumnsTree.getSelectedSrcObjects();

      if (selected.length == 0)
         return;

      dropText = selected[0].expression;
   }
   else
   {
      selected = this.crnFunctionMdTree.tree.getSelectedSrcObjects();

      if (selected.length == 0)
         return;


      if (selected[0].dropText == null)
      {
         alert(applicationResources.getProperty("reportWizard.errMsg.noDropText"));
         dropText = '';
      }
      else
      {
         dropText = selected[0].dropText;
      }
   }


   var filterExpr = this.document.getElementById("filterExpression");

   filterExpr.value = filterExpr.value + dropText;

   if (is_ie)
   {
      var textRange = filterExpr.createTextRange();
      textRange.move("character", filterExpr.value.length);
      textRange.select();
   }
};



/**
 * the available calc listbox changed
 **/
FilterUiController.prototype.onAvailableFiltersChange = function()
{
   this.confirmIfActiveFilterIsDirty();

   var selected = this.availableFilters.getSelectedSrcObjects();
   if (selected.length > 0)
   {
      this.document.getElementById("deleteButton").disabled = false;
   }
   else
   {
      this.activeFilter = null;
      this.document.getElementById("deleteButton").disabled = true;
   }


   if (selected.length == 1)
   {
      this.activeFilter = selected[0];
   }
   else
   {
      this.activeFilter = null;
   }

   this.isNewFilter = false;

   this.activeFilterChanged();
};



/**
 * we're about to do something which will wipe the existing active filter,
 * see if its dirty and confirm the user wishes to discard the changes...
 **/
FilterUiController.prototype.confirmIfActiveFilterIsDirty = function()
{
   if (this.activeFilter != null)
   {
      var form = this.document.forms[0];

      var name = form.filterName.value;
      var expression = form.filterExpression.value;
      var usage = this.activeFilter.usage; // TODO: update this once we have ui for it...

      if (this.activeFilter.isDirty(name, expression, usage))
      {
         if (confirm(applicationResources.getPropertyWithParameters("reportWizard.confirmMsg.saveChanges", new Array(name))))
         {
            this.saveActiveFilter();
         }
      }
   }
};

FilterUiController.prototype.discardActiveFilterIfDirty = function()
{
   if (this.activeFilter != null)
   {
      var form = this.document.forms[0];

      var name = form.filterName.value;
      var expression = form.filterExpression.value;
      var usage = this.activeFilter.usage; // TODO: update this once we have ui for it...

      if (this.activeFilter.isDirty(name, expression, usage))
      {
         if (confirm(applicationResources.getPropertyWithParameters("reportWizard.confirmMsg.saveChanges", new Array(name))))
         {
            this.saveActiveFilter();
         }
         else
         {
            this.discardActiveFilterIfNew();
         }
      }
      else
      {
         this.discardActiveFilterIfNew();
      }
   }
};

FilterUiController.prototype.discardActiveFilterIfNew = function()
{
   if(this.isNewFilter)
   {
      this.deleteActiveFilter();
      this.activeFilter = null;
      this.activeFilterChanged();
   }
   else
   {
      this.activeFilter = null;
      this.activeFilterChanged();
   }
}

FilterUiController.prototype.deleteActiveFilter = function()
{
   if (this.activeFilter != null)
   {
      this.filters = JsUtil.removeElementFromArrayByValue(this.wizardReport.filters, this.activeFilter);
      this.refreshAvailableFilters();
   }
}


/**
 * delete any selected columns...
 **/
FilterUiController.prototype.deleteSelectedFilters = function()
{
   var selected = this.availableFilters.getSelectedSrcObjects();

   if (selected.length > 0)
   {
      var result = [];
      this.filters = JsUtil.removeElementsFromArrayByValues(this.wizardReport.filters, selected);
      this.refreshAvailableFilters();

      if (selected.length == 1)
      {
         this.activeFilter = null;
         this.activeFilterChanged();
      }
   }


}

FilterUiController.prototype.beforeSubmit = function()
{
   this.confirmIfActiveFilterIsDirty();
   return true;
}





/**
 * implementation of observer interface, wired to the 3 trees that are
 * on the left hand side of the screen.
 **/
FilterUiController.prototype.processEvent = function (anEvent)
{
   //debugger;
   if (anEvent.type.family == "tree")
   {
      if (anEvent.type == ObservableEventType.TREE_NODE_SELECTED)
      {
         var srcObject = anEvent.payload.srcObject;

         if (anEvent.payload.tree == this.crnMdTree.tree)
         {
            this.setCurrentSelectionDisplayInfo(srcObject.description);
         }
         else if (anEvent.payload.tree == this.crnFunctionMdTree.tree)
         {

            this.setCurrentSelectionDisplayInfo(srcObject.syntax ? srcObject.syntax : srcObject.tip);
         }
         
         else if (anEvent.payload.tree == this.currentColumnsTree)
         {
            this.setCurrentSelectionDisplayInfo(srcObject.expression);
         }
      }
   }
   else
   {
      alert(applicationResources.getPropertyWithParameters("reportWizard.errMsg.dontKnowHowToHandleEvent", new Array(anEvent.type)));
   }
};


FilterUiController.prototype.setCurrentSelectionDisplayInfo = function(aValue)
{
   this.document.getElementById("currentSelectionInfo").innerHTML = aValue;
};
