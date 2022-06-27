/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: ReiContentUi.js 8088 2013-03-13 16:06:23Z sallman $

///////////////////////////////////////////////////////////////////////////////
// Page Local Extensions to classes defined elsewhere...
///////////////////////////////////////////////////////////////////////////////
InsertContentDirective.prototype.toPropertySet = function(aContainer)
{
   var otherColumns = [];

   for (var i = 0; i < aContainer.queryItemRefs.length; ++i)
   {
      otherColumns.push(new LabelValuePair(aContainer.queryItemRefs[i].refItem, aContainer.queryItemRefs[i].refItem));
   }

   var relativeColumnPropertyType = new PropertyType("relativeColumn", new ConstantValueProvider(otherColumns));


   var ps = new PropertySet();
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.name"), this.newColumnName, PropertyTypes.string));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.location"), this.insertRelation.name, PropertyTypes.insertRelation));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.relativeTo"), this.insertRelativeToRef, relativeColumnPropertyType));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.regularAggregate"), this.regularAggregate.name, PropertyTypes.regularAggregateEnum));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.summaryFunction"), this.summaryFunction.name, PropertyTypes.aggregateFunctionEnum));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.sort"), this.sort.name, PropertyTypes.sortEnum));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.backgroundColor"), this.getCssAttribute("background-color", "transparent"), PropertyTypes.color));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.foregroundColor"), this.getCssAttribute("color", "black"), PropertyTypes.color));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.textAlign"), this.getCssAttribute("text-align", "right"), PropertyTypes.horizontalAlignment));
   return ps;
};


InsertContentDirective.prototype.fromPropertySet = function(aPs)
{
   this.newColumnName = aPs.getProperty(applicationResources.getProperty("profileWizard.content.name")).value;
   this.insertRelativeToRef = aPs.getProperty(applicationResources.getProperty("profileWizard.content.relativeTo")).value;
   this.insertRelation = Enum.parseEnumFromName(RelationalInsertionPointEnum, aPs.getProperty(applicationResources.getProperty("profileWizard.content.location")).value);
   this.regularAggregate = Enum.parseEnumFromName(RegularAggregateEnum, aPs.getProperty(applicationResources.getProperty("profileWizard.content.regularAggregate")).value);
   this.summaryFunction = Enum.parseEnumFromName(AggregateFunctionEnum, aPs.getProperty(applicationResources.getProperty("profileWizard.content.summaryFunction")).value);

   this.css = "background-color:" + aPs.getProperty(applicationResources.getProperty("profileWizard.content.backgroundColor")).value + ";" +
              "color:" + aPs.getProperty(applicationResources.getProperty("profileWizard.content.foregroundColor")).value + ";" +
              "text-align:" + aPs.getProperty(applicationResources.getProperty("profileWizard.content.textAlign")).value + ";";

   this.sort = Enum.parseEnumFromName(SortEnum, aPs.getProperty(applicationResources.getProperty("profileWizard.content.sort")).value);
};



//-----------------------------------------------------------------------------
/**
 * Rei Content UI Model
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiContentUiModel (aRei, aHasCustomPrompt, aBiQuerySet, aContainers, aPackagePath, aPackageRoot)
{
   if (arguments.length > 0)
   {
      AbstractReiUiModel.prototype.constructor.call(this, aRei, aHasCustomPrompt);
      this.biQuerySet = aBiQuerySet;
      this.containers = aContainers;
      this.packagePath = aPackagePath;
      this.packageRoot = aPackageRoot;
   }
}

ReiContentUiModel.prototype = new AbstractReiUiModel();
ReiContentUiModel.prototype.constructor = ReiContentUiModel;
ReiContentUiModel.superclass = AbstractReiUiModel.prototype;


ReiContentUiModel.prototype.init = function()
{
   //--- local runtime extensions to CrnList...
   for (var i = 0; i < this.containers.length; ++i)
   {
      this.containers[i].suppressDirectives = new Object();
      this.containers[i].insertDirectives = new Object();
   }


   var eachDirective;
   for (var i = 0; i < this.rei.contentAdjustments.adjustments.length;++i)
   {
      eachDirective = this.rei.contentAdjustments.adjustments[i];

      var container = this.getContainerByXpath(eachDirective.containerXpath);

      if ("suppress" == eachDirective.getType())
      {
         container.suppressDirectives[eachDirective.refItemName] = eachDirective;
      }
      else if ("insert" == eachDirective.getType())
      {
         container.insertDirectives[eachDirective.newColumnName] = eachDirective;
      }
      else
      {
         alert(applicationResources.getPropertyWithParameters("profileWizard.content.error.dontKnowDirective",  new Array(eachDirective.getType())));
      }
   }
};


ReiContentUiModel.prototype.getContainerByXpath = function(anXpath)
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      if (anXpath == this.containers[i].xpath)
      {
         return this.containers[i];
      }
   }

   alert(applicationResources.getPropertyWithParameters("profileWizard.error.failedToFindContainerWithXpath", new Array(anXpath)));
};




//-----------------------------------------------------------------------------
/**
 * Rei Content UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiContentUiController (aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractReiUiController.prototype.constructor.call(this, aDocument, aModel);

      this.model.init();

      this.containersList = new JsListBox("containers", "containers", this.model.containers, new SimpleFieldExtractor("xpath", "name"));

      var defaultColumnFieldExtractor = {
         extractListBoxItem : function (anObject) {

            var displayText = anObject.refItem;

            if (anObject.isDimension())
            {
               displayText += " ("+applicationResources.getProperty("profileWizard.grouped")+")";
            }

            if (anObject.container.suppressDirectives[anObject.refItem])
            {
               displayText += " ("+applicationResources.getProperty("profileWizard.suppressed")+")";
            }

            return new ListBoxItem(anObject.refItem, displayText);
         }
      };

      this.defaultColumnsList = new JsListBox("defaultColumns", "defaultColumns", new Object(), defaultColumnFieldExtractor);

      this.auxColumnsList = new JsListBox("additionalColumns", "additionalColumns", new Object(), new SimpleFieldExtractor("newColumnName", "newColumnName"));


      //--- Md Tree...
      this.crnMdTree = new CrnMetaDataTree (this.model.packagePath, this.model.packageRoot, "mdTreeContainer");
      this.crnMdTree.tree.isMultiSelect = false;
      this.crnMdTree.tree.addObserver(this);


      //--- Function Md Tree...
      this.crnFunctionMdTree = new CrnFunctionMetaDataTree (this.model.packagePath, "functionMdTreeContainer");
      this.crnFunctionMdTree.tree.addObserver(this);

      //--- Tab Bar...
      this.customizeTabs = new TabBar();
      this.customizeTabs.addTabListener(this);
      this.customizeTabs.createAndAdd("model", applicationResources.getProperty("profileWizard.content.model"));
      this.customizeTabs.createAndAdd("functions", applicationResources.getProperty("profileWizard.content.functions"));

      this.currentCustomizeTab = null;
   }
}

ReiContentUiController.prototype = new AbstractReiUiController();
ReiContentUiController.prototype.constructor = ReiContentUiController;
ReiContentUiController.superclass = AbstractReiUiController.prototype;



/**
* initialize the ui...
**/
ReiContentUiController.prototype.initUi = function()
{
   ReiContentUiController.superclass.initUi.call(this);
   this.setStageTitle(applicationResources.getProperty("profileWizard.stageTitle.modifyContent"));
   this.disableNext();

   this.customizeTabs.insertIntoDocument(this.document, this.document.getElementById("customizeTabsContainer"));
   this.customizeTabs.selectFirstTab(true);


   this.containersList.refreshView();
   this.defaultColumnsList.refreshView();
   this.auxColumnsList.refreshView();


   this.crnMdTree.refreshView();
   this.crnFunctionMdTree.refreshView();
   this.initKeyHandler();
};

ReiContentUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReiKeyHandler(this);
};


ReiContentUiController.prototype.getStageName = function()
{
   return "content";
};


ReiContentUiController.prototype.getSelectedContainer = function()
{
   var selected = this.containersList.getSelectedItems();
   return selected.length == 1 ? selected[0].srcObject : null;
};



/**
 * container selection changed...
 **/
ReiContentUiController.prototype.containerSelectionChanged = function()
{
   var container = this.getSelectedContainer();
   var defaultColumns;
   var auxColumns;

   if (container)
   {
      defaultColumns = container.queryItemRefs;
      auxColumns = container.insertDirectives;

      this.document.getElementById("addNewColumnButton").style.display = "block";
   }
   else
   {
      this.document.getElementById("addNewColumnButton").style.display = "none";
      this.document.getElementById("editColumnButton").style.display = "none";
      this.document.getElementById("deleteColumnButton").style.display = "none";
   }


   this.auxColumnsList.resetAvailableItems(container.insertDirectives);
   this.auxColumnsList.refreshView();


   this.defaultColumnsList.resetAvailableItems(defaultColumns);
   this.defaultColumnsList.refreshView();
};

/**
 * default column selection changed...
 **/
ReiContentUiController.prototype.defaultColumnSelectionChanged = function()
{
   var selected = this.defaultColumnsList.getSelectedItems();
   this.document.getElementById("suppressButton").disabled = selected.length == 0;
};

/**
 * default column selection changed...
 **/
ReiContentUiController.prototype.additionalColumnSelectionChanged = function()
{
   var selected = this.auxColumnsList.getSelectedItems();

   if (selected.length > 0)
   {
      this.document.getElementById("editColumnButton").style.display = "block";
      this.document.getElementById("deleteColumnButton").style.display = "block";
   }
   else
   {
      this.document.getElementById("editColumnButton").style.display = "none";
      this.document.getElementById("deleteColumnButton").style.display = "none";
   }
};


/**
 * suppress the selected fields
 **/
ReiContentUiController.prototype.suppressSelected = function()
{
   var selected = this.defaultColumnsList.getSelectedItems();
   var container = this.getSelectedContainer();

   for (var i = 0; i < selected.length;++i)
   {
      var refItem = selected[i].srcObject.refItem;

      if (selected[i].srcObject.isDimension())
      {
         alert(applicationResources.getProperty("profileWizard.error.cantSuppressGroupedColumns"));
      }
      else
      {
         if (container.suppressDirectives[refItem])
         {
            delete container.suppressDirectives[refItem];
         }
         else
         {
            container.suppressDirectives[refItem] = new SuppressContentDirective (container.xpath, refItem, false);
         }
      }
   }

   this.defaultColumnsList.resetAvailableItems(container.queryItemRefs);
   this.defaultColumnsList.refreshView();
};



/**
 * show the customize div...
 **/
ReiContentUiController.prototype.toggleCustomizeDiv = function(aIsVisible)
{
   if (aIsVisible)
   {
      var container = this.getSelectedContainer();

      this.document.getElementById("containers").disabled = true;
      this.document.getElementById("customizationsContainerDiv").style.display = "block";
      this.document.getElementById("currentContainerName").innerHTML = applicationResources.getPropertyWithParameters("profileWizard.content.additionalColumnFor", new Array(container.name));


      this.newColumnPropertyEditor = new PropertySetEditor('newColumnProperties', 'newColumnProperties', applicationResources.getProperty("profileWizard.content.additionalColumnProperties"), this.currentAuxColumn.toPropertySet(container));
      this.newColumnPropertyEditor.refreshView();
      this.newColumnPropertyEditor.propertySet.getProperty(applicationResources.getProperty("profileWizard.content.name")).focus();

      this.document.getElementById("newColumnExpression").value = this.currentAuxColumn.newColumnExpression;
   }
   else
   {
      this.document.getElementById("containers").disabled = false;
      this.document.getElementById("customizationsContainerDiv").style.display = "none";
   }
};



/**
 * add aux column
 **/
ReiContentUiController.prototype.addNewColumn = function()
{
   var container = this.getSelectedContainer();

   this.currentAuxColumn = new InsertContentDirective (
           container.xpath,
           container.queryItemRefs[container.queryItemRefs.length-1].refItem,
           RelationalInsertionPointEnum.AFTER,
           applicationResources.getProperty("profileWizard.content.newColumn"),       
           "",
           RegularAggregateEnum.AUTOMATIC,
           AggregateFunctionEnum.NONE,
           SortEnum.DONT_SORT,
           ""
   );

   this.toggleCustomizeDiv(true);
};

/**
 * delete aux column
 **/
ReiContentUiController.prototype.deleteColumn = function()
{
   var container = this.getSelectedContainer();
   var selected = this.auxColumnsList.getSelectedItems();

   for (var i = 0; i < selected.length; ++i)
   {
      delete container.insertDirectives[selected[i].srcObject.newColumnName];
   }

   this.auxColumnsList.removeSelected();
   this.auxColumnsList.refreshView();
};

/**
 * edit aux column
 **/
ReiContentUiController.prototype.editColumn = function()
{
   var container = this.getSelectedContainer();

   var selected = this.auxColumnsList.getSelectedItems();

   if (selected.length != 1)
   {
      alert(applicationResources.getProperty("profileWizard.content.error.selectOneItem"));
      return;
   }

   this.currentAuxColumn = selected[0].srcObject;

   this.toggleCustomizeDiv(true);
};


/**
 * add from selected tree node into the new column expression box
 **/
ReiContentUiController.prototype.addToNewColumnExpression = function()
{
   var selected;
   var dropText;

   if (this.currentCustomizeTab.id == "model")
   {
      selected = this.crnMdTree.tree.getSelectedSrcObjects();

      if (selected.length == 0)
         return;

      dropText = selected[0].ref;
         }
         else
         {
      selected = this.crnFunctionMdTree.tree.getSelectedSrcObjects();

      if (selected.length == 0)
         return;

      if (selected[0].dropText == null)
      {
         alert(applicationResources.getProperty("profileWizard.error.noDropTextForFunction"));
         dropText = '';
      }
      else
      {
         dropText = selected[0].dropText;
      }
   }

   var newColumnExpr = this.document.getElementById("newColumnExpression");

   newColumnExpr.value = newColumnExpr.value + dropText;

   //--- put cursor at end
   if (is_ie)
   {
      var textRange = newColumnExpr.createTextRange();
      textRange.move("character", newColumnExpr.value.length);
      textRange.select();
   }

};

ReiContentUiController.prototype.findRegularAggregateEnumFromModelValue = function(aModelValue)
{
   var key;
   var eachEnum;

   for (key in RegularAggregateEnum)
   {
      eachEnum = RegularAggregateEnum[key];

      if (JsUtil.isObject(eachEnum) && eachEnum.modelValue==aModelValue)
         return eachEnum;
   }

   alert(applicationResources.getPropertyWithParameters("profileWizard.content.error.failedToFindEnum", new Array(aModelValue, RegularAggregateEnum) ));
   return null;
}

/**
 * save new column
 **/
ReiContentUiController.prototype.saveNewColumn = function()
{
   var oldName = this.currentAuxColumn.newColumnName;

   this.newColumnPropertyEditor.blur();

   this.currentAuxColumn.fromPropertySet(this.newColumnPropertyEditor.propertySet);
   this.currentAuxColumn.newColumnExpression = this.document.getElementById("newColumnExpression").value;

   if (this.validateNewColumn(this.currentAuxColumn))
   {
      var container = this.getSelectedContainer();

      container.insertDirectives[this.currentAuxColumn.newColumnName] = this.currentAuxColumn;

      //--- if it was renamed, delete the old one...
      if (oldName != this.currentAuxColumn.newColumnName && container.insertDirectives[oldName])
      {
         delete container.insertDirectives[oldName];
      }

      this.currentAuxColumn = null;

      this.toggleCustomizeDiv(false);

      this.auxColumnsList.resetAvailableItems(container.insertDirectives);
      this.auxColumnsList.refreshView();
   }
};



/**
 * validate new column
 **/
ReiContentUiController.prototype.validateNewColumn = function(aNewColumn)
{
   if (JsUtil.isEmptyString(aNewColumn.newColumnExpression))
   {
      alert(applicationResources.getProperty("profileWizard.error.provideNonEmptyExpression"));
      return false;
   }
   else if (JsUtil.isEmptyString(aNewColumn.newColumnName))
   {
      alert(applicationResources.getProperty("profileWizard.error.provideNonEmptyColumnName"));
      return false;
   }

   return true;
};

/**
 * validate new column w/o alerts
 **/
ReiContentUiController.prototype.validatePossibleSave = function()
{
   if (JsUtil.isEmptyString(this.document.getElementById("newColumnExpression").value) ||
           JsUtil.isEmptyString(this.newColumnPropertyEditor.propertySet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value))
   {
      return false;
   }

   return true;
};

/**
 * cancel new column
 **/
ReiContentUiController.prototype.cancelNewColumn = function()
{
   var container = this.getSelectedContainer();

   this.currentAuxColumn = null;

   this.toggleCustomizeDiv(false);

   this.auxColumnsList.resetAvailableItems(container.insertDirectives);
   this.auxColumnsList.refreshView();
};


ReiContentUiController.prototype.tabWasSelected = function(aTab)
{
   if (aTab.tabBar == this.customizeTabs)
   {
      this.currentCustomizeTab = aTab;

      var model = "model" == aTab.id ? "block" : "none";
      var functions = "functions" == aTab.id ? "block" : "none";;

      this.document.getElementById("mdModelContainer").style.display = model;
      this.document.getElementById("functionMdContainer").style.display = functions;
   }
   else
   {
      ReiContentUiController.superclass.tabWasSelected.call(this,aTab);
   }
};



/**
 * implementation of observer interface, wired to the 2 trees that are
 * on the left hand side of the screen.
 **/
ReiContentUiController.prototype.processEvent = function (anEvent)
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
      }
   }
   else
   {
      alert(applicationResources.getPropertyWithParameters("profileWizard.error.dontKnowHowToHandleEvent", new Array(anEvent.type)));
   }
};


ReiContentUiController.prototype.setCurrentSelectionDisplayInfo = function(aValue)
{
   this.document.getElementById("currentSelectionInfo").innerHTML = aValue;
};



ReiContentUiController.prototype.confirmSaveActive = function()
{
   this.saveNewColumn();
}

ReiContentUiController.prototype.confirmDiscardActive = function()
{

}

/**
* hook for derived classes to do something (e.g. client side validation)
* before submitting.  If the method returns false, the submit will be
* cancelled.
**/
ReiContentUiController.prototype.beforeSubmit = function()
{
   if (this.currentAuxColumn != null && this.validatePossibleSave())
   {
      this.launchConfirmDialog();
   }

   return true;
};

/**
* hook for derived classes to do something when form submission is
* imminent...
**/
ReiContentUiController.prototype.willSubmit = function()
{
   this.model.rei.contentAdjustments.clear();

   var key;
   var eachDirective;

   var containers = this.model.containers;

   for (var i = 0; i < containers.length; ++i)
   {
      for (key in containers[i].suppressDirectives)
      {
         eachDirective = containers[i].suppressDirectives[key];
         this.model.rei.contentAdjustments.addAdjustment(eachDirective);
      }

      for (key in containers[i].insertDirectives )
      {
         eachDirective = containers[i].insertDirectives[key];
         this.model.rei.contentAdjustments.addAdjustment(eachDirective);
      }
   }



   this.document.forms[0].reiXml.value = this.model.rei.toXml();
};

/**
 * get the report execution inputs...
 **/
ReiContentUiController.prototype.getRei = function()
{
  return this.model.rei;
};

ReiContentUiController.prototype.previousButton = function()
{
   this.jumpTo('sorts');
};
