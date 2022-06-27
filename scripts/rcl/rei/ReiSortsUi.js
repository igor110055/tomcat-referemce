

///////////////////////////////////////////////////////////////////////////////
// local extensions to other classes...
///////////////////////////////////////////////////////////////////////////////
SortOverride.prototype.getListItemDisplayText = function()
{
   var text = this.refItemName + " (";

   if (this.isDimension)
   {
      text += applicationResources.getProperty("profileWizard.grouped")+", ";
   }


   text += (this.sortDirection == 0 ? applicationResources.getProperty("profileWizard.ascending") : applicationResources.getProperty("profileWizard.descending")) + ")";
   return text;
};



//-----------------------------------------------------------------------------
/**
 * Parameters UI Model
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiSortsUiModel (aRei, aHasCustomPrompt, aBiQuerySet, aContainers)
{
   if (arguments.length > 0)
   {
      AbstractReiUiModel.prototype.constructor.call(this, aRei, aHasCustomPrompt);
      this.biQuerySet = aBiQuerySet;
      this.containers = aContainers;
   }
}

ReiSortsUiModel.prototype = new AbstractReiUiModel();
ReiSortsUiModel.prototype.constructor = ReiSortsUiModel;
ReiSortsUiModel.superclass = AbstractReiUiModel.prototype;


ReiSortsUiModel.prototype.getContainerByXpath = function (anXpath)
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      if (this.containers[i].xpath == anXpath)
         return this.containers[i];
   }
   
   return null;
};

//-----------------------------------------------------------------------------
/**
 * Parameters UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiSortsUiController (aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractReiUiController.prototype.constructor.call(this, aDocument, aModel);
   }
}

ReiSortsUiController.prototype = new AbstractReiUiController();
ReiSortsUiController.prototype.constructor = ReiSortsUiController;
ReiSortsUiController.superclass = AbstractReiUiController.prototype;



/**
* initialize the ui...
**/
ReiSortsUiController.prototype.initUi = function()
{
   ReiSortsUiController.superclass.initUi.call(this);
   this.setStageTitle(applicationResources.getProperty("profileWizard.stageTitle.sorting"));

   this.containerList = new JsListBox("containers", "containers", this.model.containers, new SimpleFieldExtractor("xpath", "name"));



   var columnFieldExtractor = {
      extractListBoxItem : function (anObject) {

         var displayText = anObject.refItem;

         if (anObject.isDimension())
         {
            displayText += " (Grouped)";
         }

         return new ListBoxItem(anObject.refItem, displayText);
      }
   };

   this.columnList = new JsListBox("columns", "columns", new Object(), columnFieldExtractor);

   this.defaultSortsSelect = new HtmlSelect(this.document.getElementById("defaultSorts"));

   this.overrideAvailableColumns = new JsListBox("overrideAvailableColumns", "overrideAvailableColumns", new Object, columnFieldExtractor);


   var sortOverrideFieldExtractor = {
      extractListBoxItem : function (anObject) {
         return new ListBoxItem(anObject.refItemName, anObject.getListItemDisplayText());
      }
   };


   this.sortOverrideList = new JsListBox("overrideSorts", "overrideSorts", new Object, sortOverrideFieldExtractor);


   this.currentOverrides = null;




   this.containerList.refreshView();
   this.columnList.refreshView();
   this.updateCurrentOverridesDescription();
   this.initKeyHandler();
};

ReiSortsUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReiKeyHandler(this);
};


ReiSortsUiController.prototype.getStageName = function()
{
   return "sorts";
};


ReiSortsUiController.prototype.getSelectedContainer = function()
{
   var selected = this.containerList.getSelectedItems();
   return selected.length == 1 ? selected[0].srcObject : null;
};



ReiSortsUiController.prototype.containerSelectionChanged = function()
{

   var container = this.getSelectedContainer();

   var newColumns = new Object();
   var newSorts = new Object();

   this.defaultSortsSelect.removeAll();

   if (container)
   {
      newColumns = container.queryItemRefs;


      //--- update default sorts...
      var sorts = container.getSortBys();
      for (var i = 0; i < sorts.length; ++i)
      {
         this.defaultSortsSelect.addValue(sorts[i].getName(), sorts[i].getName() + (sorts[i].isDimension() ? " (Grouped)" : ""));
      }


      this.currentOverrides = this.model.rei.sortOverrides.getOverridesFor(container.xpath);
      if (this.currentOverrides)
      {
         this.document.getElementById("addOverrideButton").style.display = "none";
         this.document.getElementById("editOverrideButton").style.display = "block";
         this.document.getElementById("removeOverrideButton").style.display = "block";
      }
      else
      {
         this.document.getElementById("addOverrideButton").style.display = "block";
         this.document.getElementById("editOverrideButton").style.display = "none";
         this.document.getElementById("removeOverrideButton").style.display = "none";
      }
   }
   else
   {
      this.document.getElementById("addOverrideButton").style.display = "none";
      this.document.getElementById("editOverrideButton").style.display = "none";
      this.document.getElementById("removeOverrideButton").style.display = "none";
   }

   this.columnList.resetAvailableItems(newColumns);
   this.columnList.refreshView();
};


ReiSortsUiController.prototype.updateCurrentOverridesDescription = function ()
{
   var descrDiv = this.document.getElementById("currentOverridesDescription");

   var sortOverrides = this.model.rei.sortOverrides;

   var html = '';

   var eachOverride;

   for (var key in sortOverrides.overrides)
   {
      eachOverride = sortOverrides.overrides[key];

      var container = this.model.getContainerByXpath(eachOverride.containerXpath);

      var containerName = container != null ? container.name : eachOverride.containerXpath;

      html += '<div class="sortOverrideDescr">'; 

      html += '<table>' +
              '   <tbody>' +
              '      <td class="containerName">' + containerName + '</td>' +
              '      <td class="overrideList">';


      for (var i = 0; i < eachOverride.sortOverrides.length; ++i)
      {
         html += '<div>' + eachOverride.sortOverrides[i].refItemName + ' &nbsp;(' + (eachOverride.sortOverrides[i].sortDirection == 0 ? 'Ascending' : 'Descending') + ')' + '</div>';
      }

      
      html += '      </td>' +
              '   </tbody>' +
              '</table>';


      html += '</div>';
   }

   if (html == '')
   {
      html = 'No Overrides Defined';
   }

   descrDiv.innerHTML = html;
};


/**
 * add a ContainerSortOverride for the currently selected Query...
 **/
ReiSortsUiController.prototype.addSortOverrides = function()
{
   var container = this.getSelectedContainer();

   this.currentOverrides = new ContainerSortOverrides(container.xpath);

   this.toggleOverridesDiv(true);
};

/**
 * add a ContainerSortOverride for the currently selected Query...
 **/
ReiSortsUiController.prototype.editSortOverrides = function()
{
   var container = this.getSelectedContainer();
   this.currentOverrides = this.model.rei.sortOverrides.getOverridesFor(container.xpath);

   this.toggleOverridesDiv(true);
};



/**
 * remove ContainerSortOverride for the currently selected Query...
 **/
ReiSortsUiController.prototype.removeSortOverrides = function()
{
   var container = this.getSelectedContainer();
   this.model.rei.sortOverrides.removeOverridesFor(container.xpath);

   this.toggleOverridesDiv(false);

   this.containerSelectionChanged();
   this.updateCurrentOverridesDescription();

};


/**
 * shift the selected sorts up...
 **/
ReiSortsUiController.prototype.shiftSelectedSortsUp = function()
{
   this.sortOverrideList.shiftSelectedUp();
};

/**
 * shift the selected sorts up...
 **/
ReiSortsUiController.prototype.shiftSelectedSortsDown = function()
{
   this.sortOverrideList.shiftSelectedDown();
};

/**
 * toggle sort directions on selected items...
 **/
ReiSortsUiController.prototype.toggleSelectedSortDirections = function()
{
   var items = this.sortOverrideList.getSelectedItems();
   for (var i = 0; i < items.length; ++i)
   {
      items[i].srcObject.toggleDirection();
      items[i].text = items[i].srcObject.getListItemDisplayText();
   }

   this.sortOverrideList.refreshView();
};

/**
 * show the overrides div...
 **/
ReiSortsUiController.prototype.toggleOverridesDiv = function(aIsVisible)
{
   if (aIsVisible)
   {
      var container = this.getSelectedContainer();

      this.document.getElementById("containers").disabled = true;
      this.document.getElementById("overrideDisplayDiv").style.display = "none";
      this.document.getElementById("overrideContainerDiv").style.display = "block";
      this.document.getElementById("currentQueryName").innerHTML = container.name;

      this.overrideAvailableColumns.resetAvailableItems(container.queryItemRefs);
      this.overrideAvailableColumns.refreshView();


      this.sortOverrideList.resetAvailableItems(this.currentOverrides.sortOverrides);
      this.sortOverrideList.refreshView();

      this.overrideDivIsActive = true;
   }
   else
   {
      this.document.getElementById("containers").disabled = false;
      this.document.getElementById("overrideDisplayDiv").style.display = "block";      
      this.document.getElementById("overrideContainerDiv").style.display = "none";
      this.overrideDivIsActive = false;
   }
};



ReiSortsUiController.prototype.addSortColumn = function()
{
   var selected = this.overrideAvailableColumns.getSelectedItems();

   for (var i = 0; i < selected.length; ++i)
   {
      var column = selected[i].srcObject;
      var sortOverride = new SortOverride(column.getName(), 0, 0, column.isDimension());
      this.sortOverrideList.appendSourceObject(sortOverride);
   }
   this.sortOverrideList.refreshView();

};

ReiSortsUiController.prototype.removeSortColumn = function()
{
   this.sortOverrideList.removeSelected();
   this.sortOverrideList.refreshView();
};

ReiSortsUiController.prototype.saveCurrentOverrides = function()
{
   this.sortOverrideList.selectAll();
   var sorts = this.sortOverrideList.getSelectedItems();

   this.currentOverrides.clear();

   var eachOverride;
   for (var i = 0; i < sorts.length; ++i)
   {
      eachOverride = sorts[i].srcObject;
      eachOverride.sortOrder = i;

      this.currentOverrides.addOverride(eachOverride);
   }


   this.model.rei.sortOverrides.add(this.currentOverrides);

   this.currentOverrides = null;

   this.toggleOverridesDiv(false);
   this.containerSelectionChanged();

   this.updateCurrentOverridesDescription();
};

ReiSortsUiController.prototype.cancelCurrentOverrides = function()
{
   this.currentOverrides = null;
   this.toggleOverridesDiv(false);
   this.containerSelectionChanged();
};


ReiSortsUiController.prototype.confirmSaveActive = function()
{
   this.saveCurrentOverrides();
}

ReiSortsUiController.prototype.confirmDiscardActive = function()
{

}

/**
* hook for derived classes to do something (e.g. client side validation)
* before submitting.  If the method returns false, the submit will be
* cancelled.
**/
ReiSortsUiController.prototype.beforeSubmit = function()
{
   if (this.currentOverrides != null && this.overrideDivIsActive)
   {
      this.launchConfirmDialog();
   }

   return true;
};

/**
* hook for derived classes to do something when form submission is
* imminent...
**/
ReiSortsUiController.prototype.willSubmit = function()
{
   this.document.forms[0].reiXml.value = this.model.rei.toXml();
};

/**
 * get the report execution inputs...
 **/
ReiSortsUiController.prototype.getRei = function()
{
  return this.model.rei;
};

ReiSortsUiController.prototype.previousButton = function()
{
   this.jumpTo('filters');
};

ReiSortsUiController.prototype.nextButton = function()
{
   this.jumpTo('content');
};