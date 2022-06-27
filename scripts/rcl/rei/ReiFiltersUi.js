//-----------------------------------------------------------------------------
/**
 * Query UI Model
 *
 * @constructor
 * @author Jeremy Siler
 **/
function RuntimeFilterRelationOperator (anOperator)
{
   this.id = anOperator;
   this.operator = anOperator;
}

//-----------------------------------------------------------------------------
/**
 * Query UI Model
 *
 * @constructor
 * @author Jeremy Siler
 **/
function RuntimeFilterRelationList (aDataType)
{
   this.dataType = aDataType;
   this.operatorList = new Object();
}

RuntimeFilterRelationList.prototype.addRelation = function(aRelation)
{
   this.operatorList[aRelation.id] = aRelation;
};

//-----------------------------------------------------------------------------
/**
 * Query UI Model
 *
 * @constructor
 * @author Jeremy Siler
 **/
function QueryItem (aName, aPath, aDataType, aSupportsValuePicker)
{
   this.name = aName;
   this.path = aPath;
   this.dataType = aDataType;
   this.supportsValuePicker = aSupportsValuePicker;
}

//-----------------------------------------------------------------------------
/**
 * Query UI Model
 *
 * @constructor
 * @author Jeremy Siler
 **/
function ReportQuery (aName)
{
   this.id = aName;
   this.name = aName;
   this.queryItems = new Object();
}

ReportQuery.prototype.addQueryItem = function(aQueryItem)
{
   this.queryItems[aQueryItem.name] = aQueryItem;
};

//-----------------------------------------------------------------------------
/**
 * Filer UI Model
 *
 * @constructor
 * @author Jeremy Siler
 **/
function RuntimeFilter ()
{
   this.name = "";
   this.dataItemName = "";
   this.fullQueryExpression = "";
   this.relation = "";
   this.singleRelation = "";
   this.values = "";
   this.query = "";
   this.valuesLength = 0;
}

RuntimeFilter.prototype.getExpression = function()
{
   return this.getColumnExpression() + " " + this.relation +
          (uiController.model.operatorsThatDontRequireRValue[this.relation] ? "" : " " + this.values);
};

RuntimeFilter.prototype.getColumnExpression = function()
{
   if (  this.isDataItemNameSet())
   {
      return "[" + this.dataItemName + "]";
   }
   else if ( this.isFullQueryExpSet())
   {
      return this.fullQueryExpression;
   }
   {
      return "";
   }
};

RuntimeFilter.prototype.isDataItemNameSet = function()
{
   return this.dataItemName!=null && this.dataItemName.length>0;
};

RuntimeFilter.prototype.isFullQueryExpSet = function()
{
   return this.fullQueryExpression!=null && this.fullQueryExpression.length>0;
};

RuntimeFilter.prototype.copyFilter = function(aFilter)
{
   this.name = aFilter.name;
   this.dataItemName = aFilter.dataItemName;
   this.fullQueryExpression = aFilter.fullQueryExpression;
   this.relation = aFilter.relation;
   this.singleRelation = aFilter.singleRelation;
   this.values = aFilter.values;
   this.query = aFilter.query;
   this.valuesLength = aFilter.valuesLength;
};


//-----------------------------------------------------------------------------
/**
 * Filters UI Model
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiFiltersUiModel (aRei, aHasCustomPrompt, aQuerySet)
{
   if (arguments.length > 0)
   {
      this.querySet = aQuerySet;
      this.operatorsThatDontRequireRValue = new Object();  // populated below
      this.relationSet = this.getRelationSets();
      AbstractReiUiModel.prototype.constructor.call(this, aRei, aHasCustomPrompt);
   }
}

ReiFiltersUiModel.prototype = new AbstractReiUiModel();
ReiFiltersUiModel.prototype.constructor = ReiFiltersUiModel;
ReiFiltersUiModel.superclass = AbstractReiUiModel.prototype;

ReiFiltersUiModel.prototype.getRelationSets = function()
{
   var modelList = new Object();

   var lessThan = new RuntimeFilterRelationOperator("<");
   var lessThanEqualTo = new RuntimeFilterRelationOperator("<=");
   var greaterThan = new RuntimeFilterRelationOperator(">");
   var greaterThanEqualTo = new RuntimeFilterRelationOperator(">=");
   var equalTo = new RuntimeFilterRelationOperator("=");
   var notEqualTo = new RuntimeFilterRelationOperator("<>");
   var before = new RuntimeFilterRelationOperator("before");
   var after = new RuntimeFilterRelationOperator("after");
   var contains = new RuntimeFilterRelationOperator("contains");
   var between = new RuntimeFilterRelationOperator("between");
   var isNull = new RuntimeFilterRelationOperator("is null");
   var isNotNull = new RuntimeFilterRelationOperator("is not null");
   var startsWith = new RuntimeFilterRelationOperator("starts with");
   var endsWith = new RuntimeFilterRelationOperator("ends with");
   var inClause = new RuntimeFilterRelationOperator("in");
   var likeClause = new RuntimeFilterRelationOperator("like");

   this.operatorsThatDontRequireRValue[isNull.operator] = true;
   this.operatorsThatDontRequireRValue[isNotNull.operator] = true;

   var numberRelationList = new RuntimeFilterRelationList("NUMBER");
   numberRelationList.addRelation(lessThan);
   numberRelationList.addRelation(lessThanEqualTo);
   numberRelationList.addRelation(greaterThan);
   numberRelationList.addRelation(greaterThanEqualTo);
   numberRelationList.addRelation(equalTo);
   numberRelationList.addRelation(notEqualTo);
   numberRelationList.addRelation(isNull);
   numberRelationList.addRelation(isNotNull);

   var dateRelationList = new RuntimeFilterRelationList("DATETIME");
   dateRelationList.addRelation(lessThan);
   dateRelationList.addRelation(lessThanEqualTo);
   dateRelationList.addRelation(greaterThan);
   dateRelationList.addRelation(greaterThanEqualTo);
   dateRelationList.addRelation(equalTo);
   dateRelationList.addRelation(notEqualTo);
   dateRelationList.addRelation(between);
   dateRelationList.addRelation(isNull);
   dateRelationList.addRelation(isNotNull);

   var stringRelationList = new RuntimeFilterRelationList("STRING");
   stringRelationList.addRelation(equalTo);
   stringRelationList.addRelation(notEqualTo);
   stringRelationList.addRelation(contains);
   stringRelationList.addRelation(startsWith);
   stringRelationList.addRelation(endsWith);
   stringRelationList.addRelation(contains);
   stringRelationList.addRelation(isNull);
   stringRelationList.addRelation(isNotNull);
   stringRelationList.addRelation(inClause);
   stringRelationList.addRelation(likeClause);

   modelList[numberRelationList.dataType] = numberRelationList;
   modelList[dateRelationList.dataType] = dateRelationList;
   modelList[stringRelationList.dataType] = stringRelationList;

   return modelList;
}


//-----------------------------------------------------------------------------
/**
 * Filters UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiFiltersUiController (aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractReiUiController.prototype.constructor.call(this, aDocument, aModel);

      this.queryList = new JsListBox("queryList", "queryList", this.model.querySet, new SimpleFieldExtractor("id", "name"));
      this.queryItemList = new JsListBox("queryItemList", "queryItemList", new Object(), new SimpleFieldExtractor("path", "name"));
      this.relationList = new JsListBox("relationList", "relationList", new Object(), new SimpleFieldExtractor("operator", "id"));



      this.newFilterCount = 0;

      //--- filtersByName will be the controllers master list...
      this.filtersByName = new Object();
      var reiFilters = this.model.rei.runtimeFilterSet.filters;

      for (var i = 0; i < reiFilters.length; i++)
      {
         var runtimeFilter = new RuntimeFilter();

         this.newFilterCount++;
         var defaultName = this.newFilterCount == 1 ? applicationResources.getProperty("profileWizard.filters.defaultName") : applicationResources.getProperty("profileWizard.filters.defaultName") + " " + this.newFilterCount;

         runtimeFilter.name = defaultName;
         runtimeFilter.dataItemName = reiFilters[i].dataItemName;
         runtimeFilter.fullQueryExpression = reiFilters[i].fullQueryExpression;
         runtimeFilter.relation = reiFilters[i].relation;
         runtimeFilter.values = reiFilters[i].values;
         runtimeFilter.query = reiFilters[i].query;

         this.filtersByName[defaultName] = runtimeFilter;
       }


      this.currentFilters = new JsListBox("currentFilters", "currentFilters", this.filtersByName, new SimpleFieldExtractor("name", "name"));
   }
}

ReiFiltersUiController.prototype = new AbstractReiUiController();
ReiFiltersUiController.prototype.constructor = ReiFiltersUiController;
ReiFiltersUiController.superclass = AbstractReiUiController.prototype;



/**
* initialize the ui...
**/
ReiFiltersUiController.prototype.initUi = function()
{
   this.setStageTitle(applicationResources.getProperty("profileWizard.stageTitle.addCustomFilters"));

   if (this.model.querySet == null || this.model.querySet.length == 0)
   {
      $("filterMessage").style.display = '';
      $("filterTable").style.display = 'none';
   }
   else
   {
      this.filterGuesture = "add";

      this.currentFilters.refreshView();

      this.queryList.refreshView();
      this.queryItemList.refreshView();

   }

   Calendar.setup( {
         inputField : "filterDate", // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button : "pickFilterDateButton" // ID of the button
      }
   );

    Calendar.setup( {
         inputField : "startDate", // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button : "pickStartDateButton" // ID of the button
      }
   );

    Calendar.setup( {
         inputField : "endDate", // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button : "pickEndDateButton" // ID of the button
      }
   );

   ReiFiltersUiController.superclass.initUi.call(this);

   this.initKeyHandler();
};

ReiFiltersUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReiKeyHandler(this);
};



ReiFiltersUiController.prototype.getStageName = function()
{
   return "filters";
};

ReiFiltersUiController.prototype.confirmSaveActive = function()
{
   this.saveActiveFilter();
};

ReiFiltersUiController.prototype.confirmDiscardActive = function()
{
};

ReiFiltersUiController.prototype.launchConfirmDialog = function()
{
   if (confirm(applicationResources.getProperty("general.confirmSaveActivity")))
   {
      this.confirmSaveActive();
      
      if (this.isActiveFilterIncomplete())
      {
         return false;
      }
   }
   else
   {
      this.confirmDiscardActive();
   }

   return true;
};

/**
* hook for derived classes to do something (e.g. client side validation)
* before submitting.  If the method returns false, the submit will be
* cancelled.
**/
ReiFiltersUiController.prototype.beforeSubmit = function()
{
   if (this.activeFilter != null)
   {
      return this.launchConfirmDialog();
   }

   return true;
};



/**
* hook for derived classes to do something when form submission is
* imminent...
**/
ReiFiltersUiController.prototype.willSubmit = function()
{
   var runtimeFilter;
   this.model.rei.runtimeFilterSet.filters = new Array();

   var filterArray = this.currentFilters.getAllItems();

   for (var i = 0; i < filterArray.length; i++)
   {
      runtimeFilter = this.filtersByName[filterArray[i].srcObject.name];

      this.model.rei.runtimeFilterSet.addFilter(new ReiRuntimeFilter(runtimeFilter.dataItemName, runtimeFilter.relation, runtimeFilter.values, runtimeFilter.query, runtimeFilter.fullQueryExpression))
   }

   this.document.forms[0].reiXml.value = this.model.rei.toXml();
};

/*
* Sets the active filter
*/
ReiFiltersUiController.prototype.onCurrentFilterSelectionChange = function()
{
   var selectedFilterItems = this.currentFilters.getSelectedItems();

   if (selectedFilterItems.length == 1)
   {
      $("deleteButton").disabled = false;
      $("editButton").disabled = false;

      $("filterExpr").value = "(" + selectedFilterItems[0].srcObject.query + ")\n\n" + selectedFilterItems[0].srcObject.getExpression();
   }
   else
   {
      $("deleteButton").disabled = true;
      $("editButton").disabled = true;
      $("filterExpr").value = "";
   }
};


/*
* Updates the column list
*/
ReiFiltersUiController.prototype.onQuerySelectionChanged = function()
{
   var selectedQuery = this.queryList.getSelectedItems();

   var newListItems = new Object();

   var eachQuery;
   for (var i = 0; i < selectedQuery.length; ++i)
   {
      eachQuery = selectedQuery[i].srcObject;

      JsUtil.copyObjectProperties(eachQuery.queryItems, newListItems);

      this.activeFilter.query = eachQuery.name;
      this.updateFilterExpression();
   }

   this.queryItemList.resetAvailableItems(newListItems);
   this.queryItemList.refreshView();
};


/*
* Updates the active filter expression
*/
ReiFiltersUiController.prototype.updateFilterExpression = function()
{
//  $("filterExpr").value = this.activeFilter.getExpression();
  $("filterExpr").value = "(" + this.activeFilter.query + ")\n\n" + this.activeFilter.getExpression();
};


/*
* Add a new runtime filter
*/
ReiFiltersUiController.prototype.addNewFilter = function()
{
   this.filterGuesture = "add";

   this.setUiDisplay("add");

   this.activeFilter = new RuntimeFilter();

   this.queryList.deselectAll();
   this.queryItemList.resetAvailableItems(new Object());
   this.relationList.resetAvailableItems(new Object());

   this.newFilterCount++;
   var defaultName = this.newFilterCount == 1 ? applicationResources.getProperty("profileWizard.filters.defaultName") : applicationResources.getProperty("profileWizard.filters.defaultName") + " " + this.newFilterCount;

   this.activeFilter.name = defaultName;

   this.updateFilterExpression();
};


ReiFiltersUiController.prototype.getCurrentSelectedFilter = function()
{
   var selected = this.currentFilters.getSelectedItems();

   return selected.length == 1 ? selected[0].srcObject : null;
};



/**
 * edit an existing filter...
 **/
ReiFiltersUiController.prototype.editExistingFilter = function()
{
   var selectedFilter = this.getCurrentSelectedFilter();

   if (selectedFilter)
   {
      this.activeFilter = new RuntimeFilter();
      this.activeFilter.copyFilter(selectedFilter);

      this.filterGuesture = "edit";
      this.setUiDisplay("edit");

      //--- now set the state of the UI based on the current value
      this.queryList.deselectAll();
      this.queryList.selectItemsFromValues([this.activeFilter.query]);
      this.onQuerySelectionChanged();

      if (this.activeFilter.isDataItemNameSet())
      {
         this.queryItemList.setIemAsSelectedByText([this.activeFilter.dataItemName]);
      }
      else
      {
         this.queryItemList.selectItemsFromValues([this.activeFilter.fullQueryExpression]);
      }



      this.onQueryItemSelectionChanged(false);

      this.relationList.selectItemsFromValues([this.activeFilter.relation]);


   }
};




/*
* Deletes the selectd filters
*/
ReiFiltersUiController.prototype.deleteSelectedFilters = function()
{
   var deleteValid = false;

   var selectedFilter = this.currentFilters.getSelectedItems();

   if (selectedFilter[0] != null)
   {
      deleteValid = true;
   }

   if (!deleteValid)
   {
      alert(applicationResources.getProperty("profileWizard.filters.selectFilterToDelete"));
   }
   else
   {
      this.currentFilters.removeSelected();
      this.currentFilters.refreshView();

       $("filterExpr").value = "";

      if (this.document.forms[0].currentFilters.options.length == 0)
      {
         $("deleteButton").disabled = true;
         $("editButton").disabled = true;
      }
   }
};


/*
* Saves a new runtime filter
*/
ReiFiltersUiController.prototype.saveActiveFilter = function()
{
   if (!this.activeFilter)
   {
      alert(applicationResources.getProperty("profileWizard.filters.noActiveFilter"));
   }
   else if (this.isActiveFilterIncomplete())
   {
      alert(applicationResources.getProperty("profileWizard.filters.completeFilterExpression"));
   }
   else
   {
      this.setUiDisplay("finished");

      if (this.filterGuesture == "add")
      {
         this.filtersByName[this.activeFilter.name] = this.activeFilter;
         this.currentFilters.appendSourceObject(this.activeFilter);
         this.currentFilters.refreshView();
         this.currentFilters.selectItemsFromValues([this.activeFilter.name]);
         this.onCurrentFilterSelectionChange();
      }
      else
      {
         var originalFilter = this.filtersByName[this.activeFilter.name];
         originalFilter.copyFilter(this.activeFilter);
      }

      this.activeFilter = null;
   }
};

ReiFiltersUiController.prototype.isActiveFilterIncomplete = function()
{
   if (!this.activeFilter)
   {
      return false;
   }

   if (this.activeFilter.dataItemName != "" && this.model.operatorsThatDontRequireRValue[this.activeFilter.relation])
   {
      return false;
   }

   return (this.activeFilter.dataItemName == "" || this.activeFilter.relation == "" || this.activeFilter.values == "");
};

/*
* Cancels a new runtime filter
*/
ReiFiltersUiController.prototype.cancelActiveFilter = function()
{
   this.setUiDisplay("cancel");
   this.activeFilter = null;

   this.onCurrentFilterSelectionChange();
};


ReiFiltersUiController.prototype.onQueryItemSelectionChanged = function(reload)
{
   var queryItem = this.getCurrentQueryItem();

   if (queryItem)
   {
      document.forms[0].queryItemRef.value = queryItem.path;

      this.activeFilter.dataItemName = queryItem.name;

      var dataType = queryItem.dataType;

      var newListItems = new Object();
      JsUtil.copyObjectProperties(this.model.relationSet[dataType].operatorList, newListItems);
      this.relationList.resetAvailableItems(newListItems);
      this.relationList.refreshView();

      if(reload == null || reload != false)
      {
         this.activeFilter.relation = "";
         this.activeFilter.values = "";
         this.relationList.deselectAll();
         this.updateFilterExpression();
      }

      //$("launchValuePickerButton").disabled = (dataType == 'NUMBER');



      if (dataType == "DATETIME")
      {
          $("datePicker").style.display = '';
          $("manualFilterValue").style.display = 'none';
          $("launchValuePickerButton").style.display = 'none';
      }
      else
      {
          $("manualFilterValue").style.display = '';
          $("datePicker").style.display = 'none';
          $("launchValuePickerButton").style.display = '';
      }
       $("manualFilterValue").value = "";
       $("launchValuePickerButton").disabled = !(queryItem.supportsValuePicker);
   }
};



ReiFiltersUiController.prototype.getCurrentQueryItem = function()
{
   var selectedQueryItem = this.queryItemList.getSelectedItems();
   return selectedQueryItem.length == 1 ? selectedQueryItem[0].srcObject : null;
};


ReiFiltersUiController.prototype.getCurrentRelation = function()
{
   var selectedRelation = this.relationList.getSelectedItems();
   return selectedRelation.length == 1 ? selectedRelation[0].srcObject : null;
};


ReiFiltersUiController.prototype.onRelationChange = function()
{
   this.activeFilter.relation = this.getCurrentRelation().operator;
   this.activeFilter.singleRelation = this.activeFilter.relation ;


   if (this.activeFilter.relation)
   {
      if (this.model.operatorsThatDontRequireRValue[this.activeFilter.relation])
      {
         $("dateRangeColumn").style.display = 'none';
         $("valueColumn").style.display = 'none';
      }
      else
      {
         if (this.activeFilter.valuesLength > 1)
         {
            this.activeFilter.relation = "in";

            if (uiController.activeFilter.singleRelation == "<>")
            {
               uiController.activeFilter.relation = "not in";
            }
         }
         if (this.activeFilter.relation == "between")
         {
           $("dateRangeColumn").style.display = '';
           $("valueColumn").style.display = 'none';
         }
         else
         {
           $("dateRangeColumn").style.display = 'none';
           $("valueColumn").style.display = '';
         }

         if (this.model.operatorsThatDontRequireRValue[this.activeFilter.relation])
         {
            this.activeFilter.values = "";
         }
      }
   }

   this.updateFilterExpression();
};

ReiFiltersUiController.prototype.showValuePicker = function ()
{

   if (document.forms[0].queryItemRef.value == null || document.forms[0].queryItemRef.value == "")
   {
      alert(applicationResources.getProperty("profileWizard.error.chooseColumnToFilterBy"))
   }
   else
   {
      var crnDialog = new CrnDialog();

      var dialogListener = {
         thisDoc : document,
         dialogFinished : function (aPicker) {
            if (aPicker.wasCancelled == false)
            {
               uiController.onValuePickerDialogFinished(aPicker.selectedValues);
            }
         }
      };

      crnDialog.setDialogListener (dialogListener);

      // TODO: the value picker now supports this, but we're storing this in a string
      // form like '(1, 2, 3)'.
      var initialValues = null;

      crnDialog.showValuePickerDialog("Select Values",
                                      document.forms[0].queryItemRef.value,
                                      "",
                                      true,
                                      null,
                                      document.forms[0].crnPackage.value,
                                      100,
                                      "displayValue", null, initialValues, null, 1000);
   }
};


/**
 * manual filter value was entered...
 **/
ReiFiltersUiController.prototype.onManualFilterValueChange = function ()
{
   if (document.forms[0].queryItemRef.value == 'null' || document.forms[0].queryItemRef.value == "")
   {
      alert(applicationResources.getProperty("profileWizard.error.chooseColumnToFilterBy"));
      return;
   }


   var queryItem = this.getCurrentQueryItem();
   var dataType = queryItem.dataType;


   if (this.model.operatorsThatDontRequireRValue[this.activeFilter.relation])
   {
      this.activeFilter.values = "";
   }
   else
   {
      var filterValue = document.forms[0].manualFilterValue.value;
      this.activeFilter.relation = this.activeFilter.singleRelation;

      if (dataType == 'NUMBER' || dataType == 'DATETIME')
      {
         this.activeFilter.values = filterValue;
      }
      else
      {
         this.activeFilter.values = this.createStringLiteral(filterValue);
      }
   }

   this.updateFilterExpression();
};


ReiFiltersUiController.prototype.onValuePickerDialogFinished = function (aSelectedValues)
{
   var queryItem = this.getCurrentQueryItem();
   var dataType = queryItem.dataType;
   var selectedValues = aSelectedValues;


   var expressionValues = '(';


   for (var i = 0; i < selectedValues.length; ++i)
   {
      if (selectedValues.length == 1 && dataType == "DATETIME")
      {
         expressionValues += selectedValues[i].value;
         expressionValues = expressionValues.replace(/T([0-9]{2}:?){3}/, "");
      }
      else if (dataType == 'NUMBER')
      {
         expressionValues += selectedValues[i].value;
      }
      else
      {
         expressionValues += this.createStringLiteral(selectedValues[i].value);
      }

      if (i != selectedValues.length - 1)
      {
         expressionValues += ", ";
      }
   }
   expressionValues += ")";

   this.activeFilter.values = expressionValues;
   this.activeFilter.valuesLength = selectedValues.length;

   if (this.activeFilter.valuesLength > 1)
   {
      this.activeFilter.relation = "in";

      if (this.activeFilter.singleRelation == "<>")
      {
         this.activeFilter.relation = "not in";
      }
   }
   else
   {
      this.activeFilter.relation = this.activeFilter.singleRelation;
   }

   this.updateFilterExpression();
};

ReiFiltersUiController.prototype.createStringLiteral= function (aRawValue)
{
   var doubleQuotes = aRawValue.replace(/\'/g, "''"); //replace all single quotes with two single quotes as cognos expects

   //var escapedValue =  JsUtil.escapeXml(doubleQuotes);  //we don't want to do this because it is not what Cognos expects; only replace single quotes with two

   return "'" + doubleQuotes + "'";
};

/*
* Sets display and disabled buttons
*/
ReiFiltersUiController.prototype.setUiDisplay = function(aCommand)
{
   if (aCommand == "cancel" || aCommand == "finished")
   {
      $("newFilterDefRow").style.display = 'none';
      $("saveCancelButtons").style.display = 'none';
      $("saveButton").disabled = true;
      $("cancelButton").disabled = true;
      $("addButton").disabled = false;
   }
   else
   {
      $("newFilterDefRow").style.display = '';
      $("saveCancelButtons").style.display = '';
      $("saveButton").disabled = false;
      $("cancelButton").disabled = false;
      $("addButton").disabled = true;
   }
};

/*
* Sets display and disabled buttons
*/
ReiFiltersUiController.prototype.onDateRangeValueChange = function()
{
   var startDate = $("startDate");
   var endDate = $("endDate");

   if (startDate.value != "" && endDate.value != "")
   {
     this.activeFilter.values = startDate.value + " and " + endDate.value;
     this.activeFilter.valuesLength = 1;
     this.updateFilterExpression();
   }
};

ReiFiltersUiController.prototype.onDateValueChange = function()
{
    var filterDate = $("filterDate");

    if (filterDate.value != "")
    {
        var date = DateUtils.parseDate(filterDate.value);
        if (date == null)
        {
            alert(filterDate.value + ' is not a valid date.  Please use the form yyyy-mm-dd or mm/dd/yyyy');
            return;
        }

        this.activeFilter.values = DateUtils.formatDate(date, 'yyyy-MM-dd');
        this.activeFilter.valuesLength = 1;
        this.updateFilterExpression();
    }
};



ReiFiltersUiController.prototype.previousButton = function()
{
   this.jumpTo('destinations');
};

ReiFiltersUiController.prototype.nextButton = function()
{
   this.jumpTo('sorts');
};

