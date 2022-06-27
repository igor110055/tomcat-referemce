/**
 * This file defines the UiModel and Controller classes for the Calculated Columns UI
 *
 * @author Lance Hankins
 * @author Roger Moore
 *
 **/



//---------------------------------------------------------------------------//
//  Local Extensions to ReportColumn...
//---------------------------------------------------------------------------//

ReportColumn.prototype.isDirty = function(aName, aExpression)
{
   return !(this.name == aName && this.expression == aExpression);
};




//---------------------------------------------------------------------------//
//  CalculatedColumnExtractor
//---------------------------------------------------------------------------//
function CalculatedColumnExtractor()
{
}

CalculatedColumnExtractor.prototype.extractListBoxItem = function (anObject)
{
   return new ListBoxItem(anObject.name, anObject.name );
};




//---------------------------------------------------------------------------//
// CalculatedFieldsUiController
//---------------------------------------------------------------------------//

function CalculatedFieldsUiController(aDocument, aWizardReport, aPackageRoot, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      CalculatedFieldsUiController.superclass.constructor.call(this, aDocument, aWizardReport, aPleaseWaitDiv);

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
      this.tabBar.createAndAdd("model", applicationResources.getProperty("reportWizard.calculatedFields.model"));
      this.tabBar.createAndAdd("currentColumns", applicationResources.getProperty("reportWizard.calculatedFields.currentColumns"));
      this.tabBar.createAndAdd("functions", applicationResources.getProperty("reportWizard.calculatedFields.functions"));

      this.currentTab = null;



      //--- Current Columns (LHS - non calculations)
      this.currentColumnsTree = new Tree("currentColumnsTreeContainer");
      this.currentColumnsTree.isMultiSelect = false;


      var root = this.currentColumnsTree.createNode("currentColumns", applicationResources.getProperty("reportWizard.calculatedFields.currentReportColumns"), this.crnMdTree.folderNodeType, null, false);
      this.currentColumnsTree.addRootNode(root);

      var eachColumn;
      for (var i = 0; i < this.wizardReport.columns.length; ++i)
      {
         eachColumn = this.wizardReport.columns[i];
         root.addChild(this.currentColumnsTree.createNode("csc-" + i, eachColumn.name, this.crnMdTree.queryItemAttribute, eachColumn, false));
      }

      this.currentColumnsTree.addObserver(this);


      //--- Currently defined Calculations...

      this.calculatedColumns = this.wizardReport.getCalculatedColumns();
      this.availableCalculatedColumns = new JsListBox ("availableCalculatedColumns", "availableCalculatedColumns", this.calculatedColumns , new CalculatedColumnExtractor() );

      this.activeCalculation = null;


      //--- Etc...
      this.newCalcFieldCount = 0;
      this.isNewCalc = false;
   }
}

CalculatedFieldsUiController.prototype = new AbstractReportWizardUiController();
CalculatedFieldsUiController.prototype.constructor = CalculatedFieldsUiController;
CalculatedFieldsUiController.superclass = AbstractReportWizardUiController.prototype;



CalculatedFieldsUiController.prototype.initializeUi = function()
{
   this.startPleaseWaitDiv();
   this.disableReportComplete();

   this.setStageTitle(applicationResources.getProperty("reportWizard.calculatedFields.stageTitle"));


   this.tabBar.insertIntoDocument(this.document, this.document.getElementById("tabBarContainer"));
   this.tabBar.selectFirstTab(true);

   this.refreshAll();

   this.endPleaseWaitDiv();
   this.initKeyHandler();
};

CalculatedFieldsUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};




CalculatedFieldsUiController.prototype.refreshAll = function()
{
   this.crnMdTree.refreshView();
   this.currentColumnsTree.refreshView();
   this.crnFunctionMdTree.refreshView();
   
   this.availableCalculatedColumns.refreshView();
}



CalculatedFieldsUiController.prototype.tabWasSelected = function(aTab)
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
CalculatedFieldsUiController.prototype.addNewCalculatedColumn = function()
{
   // TODO: on round trip back to this screen, this count will be 0 again
   this.newCalcFieldCount++;
   var defaultName = this.newCalcFieldCount == 1 ? applicationResources.getProperty("reportWizard.calculatedFields.defaultCalculationName") : applicationResources.getProperty("reportWizard.calculatedFields.defaultCalculationName")+" " + this.newCalcFieldCount;

   this.isNewCalc = true;

   var form = this.document.forms[0];

   var dataType = "decimal"; // TODO: ok...??? Not sure still works if dataType = "varchar"

   this.activeCalculation = new ReportColumn(defaultName, dataType, "sum", ReportColumnTypeEnum.GENERIC, "", AggregateFunctionEnum.NONE, true, null, null, false, false);
   this.calculatedColumns.push(this.activeCalculation);

   this.refreshAvailableCalculatedColumns();

   this.activeCalculationChanged();
   this.availableCalculatedColumns.selectItemsFromValues([defaultName]);

}


/**
 * @private
 **/
CalculatedFieldsUiController.prototype.refreshAvailableCalculatedColumns = function()
{
   this.availableCalculatedColumns.resetAvailableItems(this.calculatedColumns);
   this.availableCalculatedColumns.refreshView();
}


/**
 * @private
 **/
CalculatedFieldsUiController.prototype.activeCalculationChanged = function()
{
   var form = this.document.forms[0];

   if (this.activeCalculation != null)
   {
      this.setEditElementsDisabled(false);

      form.calculatedColumnName.value = this.activeCalculation.name;
      form.calculatedColumnExpression.value = this.activeCalculation.expression;

      form.calculatedColumnName.select();
      form.calculatedColumnName.focus();
   }
   else
   {
      this.setEditElementsDisabled(true);

      form.calculatedColumnName.value = "";
      form.calculatedColumnExpression.value = "";

   }
}



/**
 * @private
 **/
CalculatedFieldsUiController.prototype.setEditElementsDisabled = function(aIsDisabled)
{
   var form = this.document.forms[0];
   form.calculatedColumnName.disabled = aIsDisabled;
   form.calculatedColumnExpression.disabled = aIsDisabled;

   this.document.getElementById("cancelButton").disabled = aIsDisabled;
   this.document.getElementById("saveButton").disabled = aIsDisabled;
   this.document.getElementById("insertValueButton").disabled = aIsDisabled;

   this.document.getElementById("activeCalculationContainer").style.display = aIsDisabled ? "none" : "block";
}


/**
 * save button was pressed, update the active calculation with the new values
 **/
CalculatedFieldsUiController.prototype.saveActiveCalculation = function()
{
   var form = this.document.forms[0];

   var name = form.calculatedColumnName.value;
   var expression = form.calculatedColumnExpression.value;

   if (this.validateInput(name, expression))
   {
      this.activeCalculation.name = name;
      this.activeCalculation.expression = expression;


      this.availableCalculatedColumns.resetAvailableItems(this.calculatedColumns);

      this.availableCalculatedColumns.deselectAll();
      this.availableCalculatedColumns.refreshView();


      this.activeCalculation = null;
      this.activeCalculationChanged();
   }
}


/**
 * cancel button was pressed
 **/
CalculatedFieldsUiController.prototype.cancelActiveCalculation = function()
{
   this.discardActiveCalcIfDirty();
}


/**
 * validate the supplied name and expression
 **/
CalculatedFieldsUiController.prototype.validateInput = function(aName, aExpression)
{
   if (aName == null || JsUtil.trim(aName).length == 0)
   {
      alert(applicationResources.getProperty("reportWizard.errMsg.fieldMustBeNonZeroLength"));
      return false;
   }

   if (aExpression == null || JsUtil.trim(aExpression).length == 0)
   {
      alert(applicationResources.getProperty("reportWizard.errMsg.fieldMustBeNonZeroLength"));
      return false;
   }

   if (aName != this.activeCalculation.name && (this.wizardReport.getColumnByName(aName) != null || this.getCalculatedColumnByName(aName) != null))
   {
      var params = new Array(1);
      params[0]=aName;
      alert(applicationResources.getPropertyWithParameters('reportWizard.errMsg.columnNameAlreadyExists',params));

      return false;
   }
   return true;
};


/**
 * insert the selected node from the LHS into the expr box
 **/
CalculatedFieldsUiController.prototype.getCalculatedColumnByName = function(aName)
{
   for (var i = 0; i < this.calculatedColumns.length; ++i)
   {
      if (this.calculatedColumns[i].name == aName)
      {
         return this.calculatedColumns[i];
      }
   }
   return null;
};

/**
 * insert the selected node from the LHS into the expr box
 **/
CalculatedFieldsUiController.prototype.insertSelected = function()
{
   var selected;
   var dropText;

   if (this.currentTab.id == "model")
   {
      selected = this.crnMdTree.tree.getSelectedSrcObjects();

      if (selected.length == 0)
         return;

      dropText = selected[0].ref;

      if(!allowOnlyNumbers(selected[0]))
      {
         // TODO Does the dataType need to be set, didn't seem to matter in report.
         this.activeCalculation.dataType = selected[0].dataType;
         this.activeCalculation.regularAggregate = "none";
      }
   }
   else if (this.currentTab.id == "currentColumns")
   {
      selected = this.currentColumnsTree.getSelectedSrcObjects();

      if (selected.length == 0)
         return;

      dropText = selected[0].expression;

      if(!allowOnlyNumbers(selected[0]))
      {
         this.activeCalculation.dataType = selected[0].dataType;
         this.activeCalculation.regularAggregate = "none";
      }
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


   var calcExpr = this.document.getElementById("calculatedColumnExpression");

   calcExpr.value = calcExpr.value + dropText;

   //--- BEGIN IE SPECIFIC ----
   // TODO: FIX THIS
   var textRange = calcExpr.createTextRange();
   textRange.move("character", calcExpr.value.length);
   textRange.select();
   //--- END IE SPECIFIC ----
};



/**
 * the available calc listbox changed
 **/
CalculatedFieldsUiController.prototype.onAvailableCalculatedColumnsChange = function()
{
   this.confirmIfActiveCalcIsDirty();

   var selected = this.availableCalculatedColumns.getSelectedSrcObjects();
   if (selected.length > 0)
   {
      this.document.getElementById("deleteButton").disabled = false;
   }
   else
   {
      this.activeCalculation = null;
      this.document.getElementById("deleteButton").disabled = true;
   }


   if (selected.length == 1)
   {
      this.activeCalculation = selected[0];
   }
   else
   {
      this.activeCalculation = null;
   }

   this.isNewCalc = false;

   this.activeCalculationChanged();
};



/**
 * we're about to do something which will wipe the existing active calculation,
 * see if its dirty and confirm the user wishes to discard the changes...
 **/
CalculatedFieldsUiController.prototype.confirmIfActiveCalcIsDirty = function()
{
   if (this.activeCalculation != null)
   {
      var form = this.document.forms[0];

      var name = form.calculatedColumnName.value;
      var expression = form.calculatedColumnExpression.value;

      if (this.activeCalculation.isDirty(name, expression))
      {
         var params = new Array(1);
         params[0] = name;
         if (confirm(applicationResources.getPropertyWithParameters("reportWizard.confirmMsg.saveChanges", params)))
         {
            this.saveActiveCalculation();
         }
      }
   }
};

CalculatedFieldsUiController.prototype.discardActiveCalcIfDirty = function()
{
   if (this.activeCalculation != null)
   {
      var form = this.document.forms[0];

      var name = form.calculatedColumnName.value;
      var expression = form.calculatedColumnExpression.value;

      if (this.activeCalculation.isDirty(name, expression))
      {
         var params = new Array(1);
         params[0] = name;
         if (confirm(applicationResources.getPropertyWithParameters("reportWizard.confirmMsg.saveChanges", params)))
         {
            this.saveActiveCalculation();
         }
         else
         {
            this.discardActiveCalcIfNew();
         }
      }
      else
      {
         this.discardActiveCalcIfNew();
      }

      this.isNewCalc = false;
   }
};

CalculatedFieldsUiController.prototype.discardActiveCalcIfNew = function()
{
   if(this.isNewCalc)
   {
      this.deleteActiveCalc();
      this.activeCalculation = null;
      this.activeCalculationChanged();
   }
   else
   {
      this.activeCalculation = null;
      this.activeCalculationChanged();
   }
}


/**
 * delete any selected columns...
 **/
CalculatedFieldsUiController.prototype.deleteSelectedColumns = function()
{
   var selected = this.availableCalculatedColumns.getSelectedSrcObjects();

   if (selected.length > 0)
   {
      var result = [];

      this.calculatedColumns = JsUtil.removeElementsFromArrayByValues(this.calculatedColumns, selected);
      this.refreshAvailableCalculatedColumns();

      if (selected.length == 1)
      {
         this.activeCalculation = null;
         this.activeCalculationChanged();
      }
   }
}

CalculatedFieldsUiController.prototype.deleteActiveCalc = function()
{
   if (this.activeCalculation != null)
   {
      this.calculatedColumns = JsUtil.removeElementFromArrayByValue(this.calculatedColumns, this.activeCalculation);
      this.refreshAvailableCalculatedColumns();
   }
}

/**
 * implementation of observer interface, wired to the 3 trees that are
 * on the left hand side of the screen.
 **/
CalculatedFieldsUiController.prototype.processEvent = function (anEvent)
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




CalculatedFieldsUiController.prototype.setCurrentSelectionDisplayInfo = function(aValue)
{
   this.document.getElementById("currentSelectionInfo").innerHTML = aValue;
};


CalculatedFieldsUiController.prototype.beforeSubmit = function()
{
   this.confirmIfActiveCalcIsDirty();
   this.wizardReport.updateCalculatedColumns(this.calculatedColumns);
   return true;
}
