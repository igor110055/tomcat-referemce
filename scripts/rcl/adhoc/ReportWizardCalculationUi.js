/**
 * This file defines the UiModel and Controller classes for the Adhoc
 * filter UI...
 *
 * @author Lance Hankins
 * @author Roger Moore
 * @author Ryan Baula
 *
 **/

//---------------------------------------------------------------------------//
//  ReportWizardFilterUiModel
//---------------------------------------------------------------------------//
function ReportWizardCalculationUiModel (aPackagePath, aPackageRoot, aCurrentColumns)
{
   this.packagePath = aPackagePath;
   this.packageRoot = aPackageRoot;
   this.currentColumns = aCurrentColumns;
}



//---------------------------------------------------------------------------//
//  ReportWizardCalculationUiControllerUiController
//---------------------------------------------------------------------------//
function ReportWizardCalculationUiController (aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);

      this.model = aModel;
      this.crnMdTree = new CrnMetaDataTree (this.model.packagePath, this.model.packageRoot, "mdTreeContainer");
      this.crnMdTree.tree.isMultiSelect = false;

      this.tabBar = new TabBar();
      this.tabBar.addTabListener(this);
      this.tabBar.createAndAdd("model", applicationResources.getProperty("reportWizard.calculatedFields.model"));
      this.tabBar.createAndAdd("currentColumns", applicationResources.getProperty("reportWizard.calculatedFields.currentColumns"));

      this.currentTab = null;


      //--- node types
      this.currentColumnsTree = new Tree("currentColumnsTreeContainer");
      this.currentColumnsTree.isMultiSelect = false;

      var root = this.currentColumnsTree.createNode("currentColumns", applicationResources.getProperty("reportWizard.calculatedFields.currentReportColumns"), this.crnMdTree.folderNodeType, null, false);
      this.currentColumnsTree.addRootNode(root);

      var eachColumn;
      for (var i = 0; i < this.model.currentColumns.length; ++i)
      {
         eachColumn = this.model.currentColumns[i];
         root.addChild(this.currentColumnsTree.createNode("csc-" + i, eachColumn.name, this.crnMdTree.queryItemAttribute, eachColumn, false));
      }
   }
}


ReportWizardCalculationUiController.prototype = new AbstractUiController();
ReportWizardCalculationUiController.prototype.constructor = ReportWizardCalculationUiController;
ReportWizardCalculationUiController.superclass = AbstractUiController.prototype;


ReportWizardCalculationUiController.prototype.refreshAll = function()
{
   this.crnMdTree.refreshView();
   this.currentColumnsTree.refreshView();
}

ReportWizardCalculationUiController.prototype.initializeUi = function()
{
   this.tabBar.insertIntoDocument(this.document, this.document.getElementById("tabBarContainer"));
   this.tabBar.selectFirstTab(true);


   this.refreshAll();

   this.document.forms[0].calculatedColumnName.select();
   this.initKeyHandler();
};

ReportWizardCalculationUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};

ReportWizardCalculationUiController.prototype.tabWasSelected = function(aTab)
{
   this.currentTab = aTab;

   if ("model" == aTab.id)
   {
      this.document.getElementById("mdModelContainer").style.display = "block";
      this.document.getElementById("currentColumnsContainer").style.display = "none";
   }
   else
   {
      this.document.getElementById("mdModelContainer").style.display = "none";
      this.document.getElementById("currentColumnsContainer").style.display = "block";

   }
}

ReportWizardCalculationUiController.prototype.insertSelected = function()
{
   var selected;
   var valueProperty;

   if (this.currentTab.id == "model")
   {
      selected = this.crnMdTree.tree.getSelectedSrcObjects();
      valueProperty = "ref";
   }
   else
   {
      selected = this.currentColumnsTree.getSelectedSrcObjects();
      valueProperty = "expression";
   }

   if (selected.length > 0)
   {
      var filterExpr = this.document.getElementById("calculatedColumnExpression");

      filterExpr.value = filterExpr.value + selected[0][valueProperty];

      //--- BEGIN IE SPECIFIC ----
      // TODO: FIX THIS
      var textRange = filterExpr.createTextRange();
      textRange.move("character", filterExpr.value.length);
      textRange.select();
      //--- END IE SPECIFIC ----
   }
}

ReportWizardCalculationUiController.prototype.willSubmit = function(aAction)
{
   if (aAction == ActionConstants.CANCEL_CALCULATED_COLUMN || aAction == ActionConstants.CANCEL_FILTER ||
       aAction == ActionConstants.EXECUTE_CALC_EXECUTE_REPORT)
   {
      return true;
   }

   if (this.document.forms[0].calculatedColumnName.value.length == 0)
   {
      alert(applicationResources.getProperty("reportWizard.errMsg.provideNameForCalculatedColumn"));
      return false;
   }

   if (this.document.forms[0].calculatedColumnExpression.value.length == 0)
   {
      alert(applicationResources.getProperty("reportWizard.errMsg.provideNonEmptyExpression"));
      return false;
   }

   return true;
}

ReportWizardCalculationUiController.prototype.submit = function(aAction)
{
   if ( this.willSubmit(true))
   {
      this.document.getElementById('actionType').value = aAction;
      this.document.forms[0].submit();
   }
}

ReportWizardCalculationUiController.prototype.saveColumnButton = function()
{
   this.submit(ActionConstants.EXECUTE_ADD_CALCULATED_COLUMN);
}

ReportWizardCalculationUiController.prototype.cancelButton = function()
{
//   this.submit(ActionConstants.CANCEL_CALCULATED_COLUMN);
   window.close();
}

ReportWizardCalculationUiController.prototype.previousButton = function()
{
   this.submit(ActionConstants.CANCEL_CALCULATED_COLUMN);
}

ReportWizardCalculationUiController.prototype.finishButton = function()
{
   this.submit(ActionConstants.EXECUTE_CALC_EXECUTE_REPORT);
}

ReportWizardCalculationUiController.prototype.jumpToColumnSelectionButton = function()
{
   this.submit(ActionConstants.CANCEL_FILTER);
}
