/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */
// $Id: GeneratedPrompts.js 8523 2013-08-09 18:17:48Z dk $

Ext.QuickTips.init();


Adf = Ext.ns('Adf');
Adf.widgets = Ext.ns('Adf.widgets');




//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================

/**
 * info about a single parameter
 * @param aCaption
 * @param aName
 * @param aDataType
 * @param aModelFilterItem
 * @param aIsOptional
 * @param aIsMultiValue
 * @param aIsBoundedRange
 * @param aIsUnboundedRange
 * @class
 * @constructor
 */
function ParameterInfo(aCaption, aName, aDataType, aModelFilterItem, aIsOptional, aIsMultiValue, aIsBoundedRange, aIsUnboundedRange)
{
   this.caption = aCaption;
   this.name = aName;
   this.dataType = aDataType;

   this.isMultiValue = aIsMultiValue;
   this.isOptional = aIsOptional;
   this.isUnboundedRange = aIsUnboundedRange;
   this.isBoundedRange = aIsBoundedRange;

   // optionally set after construction...
   this.modelUseItem = null;
   this.modelDisplayItem = null;

   this.isBreakAfter = false;
   this.isSubmitCommaSeparatedList = false;
}



//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================


/**
 * abstract baseclass for generated prompts.
 * @param aParamInfo
 * @class
 * @constructor
 */
function AbstractGeneratedPrompt(aParamInfo)
{
   this.paramInfo = aParamInfo;
   this.allowedValues = null;
   this.defaultValues = null;
   this.useDefaultsIfNoValuesEntered = false;
   this.discardDefaultsIfValuesEntered = false;

   // set when added to screen
   this.screen = null;
}


//AbstractGeneratedPrompt.constructor = AbstractGeneratedPrompt;
AbstractGeneratedPrompt.prototype = {
   constructor: AbstractGeneratedPrompt,

   getDomId: function()
   {
      return "dgp_" + this.paramInfo.name;
   },

   createNewParameter: function()
   {
      // TODO: just hardcoding type to 'GenericString' for the moment (don't think its currently used)
      return new ReportParameter(this.paramInfo.name, [], 'GenericString');
   },

   getPromptContainerDiv: function()
   {
      var doc = this.screen.document;
      var container = doc.createElement("div");
      container.className = "promptContainer";

      var requiredImage = "";

      if (this.paramInfo.isOptional == false)
         requiredImage = '<img src="' + ServerEnvironment.baseUrl + '/images/required.gif" alt="req"/>';


      container.innerHTML = '<div class="promptTitle">' + this.paramInfo.caption + requiredImage + '</div>';


      return container;
   }
};

//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================

/**
 * prompt which allows the user to select from a series of distinct values
 *
 * @param aParamInfo
 * @param aAllowedValues
 * @class
 * @constructor
 */
function ChooseFromDistinctValuesPrompt(aParamInfo, aAllowedValues)
{
   if (arguments.length > 0)
   {
      ChooseFromDistinctValuesPrompt.superclass.constructor.call(this, aParamInfo);

      this.allowedValues = aAllowedValues;
      this.onchangeCallBack = "return true;";
      this.uiHint = "select";
   }
}

//--- inheritence chain...
ChooseFromDistinctValuesPrompt.prototype = new AbstractGeneratedPrompt();
ChooseFromDistinctValuesPrompt.prototype.constructor = ChooseFromDistinctValuesPrompt;
ChooseFromDistinctValuesPrompt.superclass = AbstractGeneratedPrompt.prototype;


/**
 * render the selectbox for this prompt
 **/
ChooseFromDistinctValuesPrompt.prototype.renderPrompt = function (aInsertionPoint, aParamSet)
{
   var doc = this.screen.document;

   //--- map of selected values
   var param = aParamSet.getParameter(this.paramInfo.name);
   if( JsUtil.isGood(param) && this.paramInfo.isSubmitCommaSeparatedList )
   {
      param.convertFromSingleCommaSeparatedValue();
   }
   var selectedItems = new Array();

   if (param)
   {
      var rawValues = param.getRawValues();
      for (var i = 0; i < rawValues.length; ++i)
      {
         selectedItems['' + rawValues[i]] = true;
      }
      this.initialValues = rawValues;
   }

   if( !JsUtil.isGood(selectedItems) || (JsUtil.isGood(selectedItems) && selectedItems.length < 1 ) )
   {
      if (JsUtil.isGood(this.defaultValues))
      {
         var rawValues = this.defaultValues.getRawValues();
         for (var i = 0; i < rawValues.length; ++i)
         {
            selectedItems['' + rawValues[i]] = true;
         }
         this.initialValues = rawValues;
      }
   }


   if (this.uiHint == 'checkbox')
   {
      var html = this.renderCheckboxes(selectedItems);
   }
   else // (this.uiHint == 'select')
   {
      var html = this.renderSelect(selectedItems);
   }

   var container = this.getPromptContainerDiv(doc);
   container.innerHTML = container.innerHTML + html;

   if (this.uiHint == 'select')
   {
      var selectAllButton = "<input type='button' name='Select All' value='"+applicationResources.getProperty("prompt.button.selectAll")+"' onclick=\"uiController.selectAll('" + this.getDomId() + "'); " + this.onchangeCallBack + "\" alt='"+applicationResources.getProperty("prompt.button.selectAll.alt")+"' title='"+applicationResources.getProperty("prompt.button.selectAll.title")+"'/>";
      var unSelectAllButton = "<input type='button' name='Unselect All' value='"+applicationResources.getProperty("prompt.button.unselectAll")+"' onclick=\"uiController.unSelectAll('" + this.getDomId() + "'); " + this.onchangeCallBack + "\" alt='"+applicationResources.getProperty("prompt.button.unselectAll.alt")+"' title='"+applicationResources.getProperty("prompt.button.unselectAll.title")+"'/>";
      container.innerHTML += "<br/><br/>";
      container.innerHTML += this.paramInfo.isMultiValue ? selectAllButton : '';
      container.innerHTML += this.paramInfo.isOptional ? unSelectAllButton : '<br/>';
   }

   aInsertionPoint.appendChild(container);
}

ChooseFromDistinctValuesPrompt.prototype.renderSelect = function (aSelectedItemsSet)
{
   //--- render select, turning on items which should be selected
   var allowedValues = this.allowedValues;

   var multi = this.paramInfo.isMultiValue ? ' multiple="multiple" ' : ' ';
   var size = this.paramInfo.isMultiValue ? ' size="10" ' : ' ';

   //--- falling back to HTML string method (see note above)
   var html = '<div class="chooseDistinctValuesPrompt"><select id="' + this.getDomId() + '" ' + size + multi + ' onchange="' + this.onchangeCallBack + '">';

   var selected;

   for (var i = 0; i < allowedValues.length; ++i)
   {
      selected = (aSelectedItemsSet[allowedValues[i].getValue()]) ? ' selected="selected" ' : ' ';
      html += '<option value="' + allowedValues[i].getValue() + '"' + selected + '>' + allowedValues[i].getDisplayValue() + '</option>';
   }

   html += "</select></div>";
   return html;
}

ChooseFromDistinctValuesPrompt.prototype.renderCheckboxes = function (aSelectedItemsSet)
{
   //--- render select, turning on items which should be selected
   var allowedValues = this.allowedValues;

   var inputType = this.paramInfo.isMultiValue ? 'checkbox' : 'radio';
   var html = '';
   var selected;
   for (var i = 0; i < allowedValues.length; ++i)
   {
      selected = (aSelectedItemsSet[allowedValues[i].getValue()]) ? ' checked="checked" ' : ' ';
      html += '<input type="' + inputType + '" name="' + this.paramInfo.name + '" value="' + allowedValues[i].getValue() + '"' + selected + '/>' + allowedValues[i].getDisplayValue() + '<br/>';
   }

   return html;
}

/**
 * harvests current state of this prompt to produce a corresponding
 * ReportParameter (with the appropriate parameter values)
 **/
ChooseFromDistinctValuesPrompt.prototype.harvestParameter = function()
{
   var param = this.createNewParameter();

   if (this.uiHint == 'checkbox')
   {
      var elements = this.screen.document.getElementsByName(this.paramInfo.name);
      for (var index = 0; index < elements.length; index ++)
      {
         var eachBox = elements[index];
         if (eachBox.checked)
         {
            param.addValue(new ConcreteReportParameterValue(this.getDisplayTextFor(eachBox.value), eachBox.value));
         }
      }
   }
   else
   {
//      var selected = new HtmlSelect(this.screen.document.getElementById(this.getDomId())).getSelectedItems();
      var selected;
      if (Ext.getCmp(this.getDomId()))
      {
         selected = Ext.getCmp(this.getDomId()).getSelectedItems();
      }
      else
      {
         selected = new HtmlSelect(this.screen.document.getElementById(this.getDomId())).getSelectedItems();
      }

      for (var i = 0; i < selected.length; ++i)
      {
         param.addValue(new ConcreteReportParameterValue(selected[i].text, selected[i].value));
      }
   }

   if( this.useDefaultsIfNoValuesEntered && param.values.length < 1 )
   {
      param = this.defaultValues;
   }
   if( JsUtil.isGood(param) && this.discardDefaultsIfValuesEntered && param.values.length > 1 )
   {
      param.removeValues(this.defaultValues);
   }

   if( JsUtil.isGood(param) && this.paramInfo.isSubmitCommaSeparatedList )
   {
      param.convertToSingleCommaSeparatedValue()
   }

   return param;
}

ChooseFromDistinctValuesPrompt.prototype.getDisplayTextFor = function(aValue)
{
   for (var index = 0; index < this.allowedValues.length; index++)
   {
      if (aValue == this.allowedValues[index].getValue())
      {
         return this.allowedValues[index].getDisplayValue();
      }
   }
}



//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================



function HierarchicalJsListBox(aName, aSelectId, aSourceItems, aFieldExtractor)
{
   JsListBox.prototype.constructor.call(this, aName, aSelectId, aSourceItems, aFieldExtractor);
   this.childListBox = null;
   this.isInitialized = false;
}

Ext.extend(HierarchicalJsListBox, JsListBox, {
   propagateSelectionChanges: function()
   {
      var selectedItems = this.getSelectedItems();

      var newListItems = new Object();

      var eachItem;
      for (var i = 0; i < selectedItems.length; ++i)
      {
         eachItem = selectedItems[i].srcObject;

         JsUtil.copyObjectProperties(eachItem.children, newListItems);
      }

      if (JsUtil.isGood(this.childListBox))
      {
         this.childListBox.resetAvailableItems(newListItems);
         this.childListBox.refreshView();
      }
   },

   selectAll: function()
   {
      HierarchicalJsListBox.superclass.selectAll.call(this);
      this.propagateSelectionChanges();
   },

   refreshView: function(aContainer, aParentInitializeFn)
   {
      if (JsUtil.isGood(aContainer))
      {
         this.lbContainer = aContainer;
         this.propagateContainer( aContainer );
      }
      HierarchicalJsListBox.superclass.refreshView.call(this);

      if (!this.isInitialized)
      {
         // Written in this weird way because all child list boxes need to created before selecting items in the lists
         // and cascading the selections.
         var initFunction = Ext.isFunction(aParentInitializeFn) ? aParentInitializeFn.createSequence(this.initialize, this) : this.initialize.createDelegate(this);
         if (JsUtil.isGood(this.childListBox))
         {
            // Initialize the child list box.
            this.childListBox.refreshView(null, initFunction);
         }
         else
         {
            // No more child lists. Call the sequence of functions to select items in the list and update child list
            // based on the selections of the parent lists. The function for the top most list is called first.
            initFunction();
         }
      }
      else
      {
         if (JsUtil.isGood(this.childListBox))
         {
            this.childListBox.refreshView();
         }
      }
   },

   propagateContainer: function( aContainer )
   {
      if (JsUtil.isGood(this.childListBox))
      {
         this.childListBox.lbContainer = aContainer;
         this.childListBox.propagateContainer( aContainer );
      }
   },

   initialize: function()
   {
      var param

      if (JsUtil.isGood(this.lbContainer))
      {
         param = this.lbContainer.prompts[this.name];
      }
      else
      {
         param = genPromptScreen.prompts[this.name];
      }

      if (JsUtil.isGood(param) && JsUtil.isGood(param.initialValues))
      {
         this.selectItemsFromValues(param.initialValues);
         this.propagateSelectionChanges();
      }
      this.isInitialized = true;
   }
});


//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================


function GenericHierarchicalObject(anId, aLabel)
{
   this.id = anId;
   this.label = aLabel;
   this.children = new Object();
}

GenericHierarchicalObject.prototype.constructor = GenericHierarchicalObject;
GenericHierarchicalObject.prototype.addChild = function(aSubObject)
{
   this.children[aSubObject.id] = aSubObject;
}

GenericHierarchicalObject.prototype.getChild = function(anId)
{
   return this.children[anId];
}



//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================



/**
 * prompt which allows the user to select a single date
 * @class
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function SelectSingleDatePrompt(aParamInfo)
{
   if (arguments.length > 0)
   {
      SelectSingleDatePrompt.superclass.constructor.call(this, aParamInfo);
   }
}

//--- inheritence chain...
SelectSingleDatePrompt.prototype = new AbstractGeneratedPrompt();
SelectSingleDatePrompt.prototype.constructor = SelectSingleDatePrompt;
SelectSingleDatePrompt.superclass = AbstractGeneratedPrompt.prototype;


/**
 * render the date input and associated button for this prompt
 **/
SelectSingleDatePrompt.prototype.renderPrompt = function (aInsertionPoint, aParamSet)
{

   var doc = this.screen.document;
   var container = this.getPromptContainerDiv(doc);

   //--- set the initial value based on the parameter value...
   var param = aParamSet.getParameter(this.paramInfo.name);

   if ( !(param && param.values.length > 0 && param.values[0].getDisplayValue().length > 0 ) &&
         ( this.defaultValues && this.defaultValues.values.length > 0 ) )
   {
      aParamSet.addParameter(ReportParameter.createSingleConcreteParameter(this.paramInfo.name, this.defaultValues.values[0].getDisplayValue(), this.defaultValues.values[0].getDisplayValue()));
   }

   var widgetDiv = doc.createElement("div");
   container.appendChild(widgetDiv);
   aInsertionPoint.appendChild(container);

   // xsdDateTime
   var includeTime = this.paramInfo.dataType.indexOf("Time") != -1;

   var enableFuzzyDates = this.uiHint != "hideRelative";
   this.dateParamWidget = new DateParameterWidget(this.paramInfo.name, "", aParamSet, includeTime, 15, "00:00:00", enableFuzzyDates);
   this.dateParamWidget.insertIntoDocument(widgetDiv);
};



/**
 * harvests current state of this prompt to produce a corresponding
 * ReportParameter (with the appropriate parameter values)
 **/
SelectSingleDatePrompt.prototype.harvestParameter = function()
{
   this.dateParamWidget.willSubmit();
   return this.dateParamWidget.paramSet.getParameter(this.paramInfo.name);
};



//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================



/**
 * prompt which allows the user to select a single raw value
 * @class
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProvideSingleRawValuePrompt(aParamInfo)
{
   if (arguments.length > 0)
   {
      ProvideSingleRawValuePrompt.superclass.constructor.call(this, aParamInfo);
   }
}

//--- inheritence chain...
ProvideSingleRawValuePrompt.prototype = new AbstractGeneratedPrompt();
ProvideSingleRawValuePrompt.prototype.constructor = ProvideSingleRawValuePrompt;
ProvideSingleRawValuePrompt.superclass = AbstractGeneratedPrompt.prototype;


/**
 * render the input field for this prompt
 **/
ProvideSingleRawValuePrompt.prototype.renderPrompt = function (aInsertionPoint, aParamSet)
{
   var doc = this.screen.document;

   var container = this.getPromptContainerDiv(doc);

   var input = doc.createElement("input");
   input.id = this.getDomId();
   input.type = "text";
   input.size = 10;

   container.appendChild(input);


   //--- set the initial value based on the parameter value...
   var param = aParamSet.getParameter(this.paramInfo.name);

   if (param && param.values.length > 0)
   {
      input.value = param.values[0].getDisplayValue()
   }
   else if ( this.defaultValues && this.defaultValues.values.length > 0 )
   {
      input.value = this.defaultValues.values[0].getDisplayValue();
   }

   aInsertionPoint.appendChild(container);
}



/**
 * harvests current state of this prompt to produce a corresponding
 * ReportParameter (with the appropriate parameter values)
 **/
ProvideSingleRawValuePrompt.prototype.harvestParameter = function()
{
   var param = this.createNewParameter();
   var rawValue = this.screen.document.getElementById(this.getDomId()).value;

   if( rawValue.length > 0 )
   {
      param.addValue(new ConcreteReportParameterValue(rawValue, rawValue));
   }
   else if ( this.useDefaultsIfNoValuesEntered && this.defaultValues && this.defaultValues.values.length > 0 )
   {
      param = this.defaultValues;
   }

   return param;
}


//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================


/**
 * prompt which allows the user to add one or more raw values
 * @class
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function SearchAndSelectPrompt(aParamInfo)
{
   if (arguments.length > 0)
   {
      ProvideMultipleRawValuesPrompt.superclass.constructor.call(this, aParamInfo);
   }
}

//--- inheritence chain...
SearchAndSelectPrompt.prototype = new AbstractGeneratedPrompt();
SearchAndSelectPrompt.prototype.constructor = SearchAndSelectPrompt;
SearchAndSelectPrompt.superclass = AbstractGeneratedPrompt.prototype;

/**
 * render the input field for this prompt
 **/
SearchAndSelectPrompt.prototype.renderPrompt = function (aInsertionPoint, aParamSet, aReportId)
{
   var doc = this.screen.document;
   this.reportId = aReportId;

   //--- map of selected values
   var param = aParamSet.getParameter(this.paramInfo.name);

   if( JsUtil.isGood(param) && this.paramInfo.isSubmitCommaSeparatedList )
   {
      param.convertFromSingleCommaSeparatedValue();
   }

   var currentValues;

   if (param)
   {
      currentValues = param.getRawValues();
      if( currentValues.length < 1 )
      {
         if (JsUtil.isGood(this.defaultValues))
         {
            param.replaceValues(this.defaultValues);
         }
      }
   }
   else if( JsUtil.isGood(this.defaultValues) )
   {
      param = this.defaultValues;
      currentValues = param.getRawValues();
      aParamSet.addParameter( param );
   }
   else
   {
      currentValues = [];
   }

   var html = '<div id="' + this.paramInfo.name + 'Widget"></div>';

   var container = this.getPromptContainerDiv(doc);
   container.innerHTML = container.innerHTML + html;

   aInsertionPoint.appendChild(container);

   this.ssWidget = new SearchAndSelectWidget(doc, this.paramInfo.name + "Widget", this.paramInfo.name, aParamSet,
           ServerEnvironment.baseUrl + "/secure/actions/genericValidate.do?reportId=" + this.reportId + "&promptName="
                   + this.paramInfo.name + "&promptValue=", "", false,
           "[pseudo].[xmlPrompt]",
           "[pseudo].[xmlPrompt]");
   this.ssWidget.extraSearchParamsProvider = this;

   this.ssWidget.insertIntoDocument();
   this.ssWidget.initFromParamValues();
}

SearchAndSelectPrompt.prototype.getExtraSearchParams = function(aWidget)
{
   var extraParams = "reportId=" + this.reportId + "&promptName=" + this.paramInfo.name;

   return extraParams;
}

/**
 * harvests current state of this prompt to produce a corresponding
 * ReportParameter (with the appropriate parameter values)
 **/
SearchAndSelectPrompt.prototype.harvestParameter = function()
{
   var param = this.ssWidget.createParameterObject();
   if( this.useDefaultsIfNoValuesEntered && ( !JsUtil.isGood(param) || param.values.length < 1 ) && this.defaultValues && this.defaultValues.values.length > 0)
   {
      param = this.defaultValues;
   }
   if( JsUtil.isGood(param) && this.discardDefaultsIfValuesEntered && param.values.length > 1 )
   {
      param.removeValues(this.defaultValues);
   }
   if( JsUtil.isGood(param) && this.paramInfo.isSubmitCommaSeparatedList )
   {
      param.convertToSingleCommaSeparatedValue()
   }

   return param;
}



//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================


/**
 * prompt which allows the user to add one or more raw values
 * @class
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProvideMultipleRawValuesPrompt(aParamInfo)
{
   if (arguments.length > 0)
   {
      ProvideMultipleRawValuesPrompt.superclass.constructor.call(this, aParamInfo);
   }
}

//--- inheritence chain...
ProvideMultipleRawValuesPrompt.prototype = new AbstractGeneratedPrompt();
ProvideMultipleRawValuesPrompt.prototype.constructor = ProvideMultipleRawValuesPrompt;
ProvideMultipleRawValuesPrompt.superclass = AbstractGeneratedPrompt.prototype;


/**
 * render the input field for this prompt
 **/
ProvideMultipleRawValuesPrompt.prototype.renderPrompt = function (aInsertionPoint, aParamSet, aReportId)
{
   var doc = this.screen.document;

   //--- map of selected values
   var param = aParamSet.getParameter(this.paramInfo.name);
   if( JsUtil.isGood(param) && this.paramInfo.isSubmitCommaSeparatedList )
   {
      param.convertFromSingleCommaSeparatedValue();
   }
   var currentValues;

   if (param)
   {
      currentValues = param.getRawValues();
      if( currentValues.length < 1 )
      {
         if( JsUtil.isGood( this.defaultValues ))
         {
            param.replaceValues(this.defaultValues);
            currentValues = param.getRawValues();
         }
      }
   }
   else if( JsUtil.isGood(this.defaultValues) )
   {
      param = this.defaultValues;
      currentValues = param.getRawValues();
   }
   else
   {
      currentValues = [];
   }

   //--- render hmm
   var html = '';
   var multi = this.paramInfo.isMultiValue ? ' multiple="multiple" ' : ' ';

   var html = '<div class="multipleRawValuesPrompt">' +
              '   <div class="column">' +
              '      <div>'+applicationResources.getProperty("generatedPrompt.newValue")+'</div>' +
              '      <input type="text" size="12" id="newValueFor_' + this.getDomId() + '" name="newValue"/>' +
              '   </div>' +
              '   <div class="column">' +
              '      <div>&nbsp;</div>' +
              '      <input type="button" value="'+applicationResources.getProperty("button.add")+'" onclick="javascript:ProvideMultipleRawValuesPrompt.onAddButtonClicked(\'' + this.getDomId() + '\');" alt="'+applicationResources.getProperty("button.add")+'" title="'+applicationResources.getProperty("button.add")+'"/><br/>' +
              '      <input type="button" value="'+applicationResources.getProperty("button.remove")+'" onclick="javascript:ProvideMultipleRawValuesPrompt.onRemoveButtonClicked(\'' + this.getDomId() + '\');" alt="'+applicationResources.getProperty("button.remove")+'" title="'+applicationResources.getProperty("button.remove")+'"/>' +
              '   </div>' +
              '   <div class="column">' +
              '      <div>'+applicationResources.getProperty("generatedPrompt.currentValues")+'</div>' +
              '         <select id="' + this.getDomId() + '" size="10" ' + multi + '>';


   for (var i = 0; i < currentValues.length; ++i)
   {
      html += '<option value="' + currentValues[i] + '" selected="selected">' + currentValues[i] + '</option>';
   }

   html += "</select></div></div>";

   var container = this.getPromptContainerDiv(doc);
   container.innerHTML = container.innerHTML + html;

   aInsertionPoint.appendChild(container);
}



/**
 * harvests current state of this prompt to produce a corresponding
 * ReportParameter (with the appropriate parameter values)
 **/
ProvideMultipleRawValuesPrompt.prototype.harvestParameter = function()
{
   var param = this.createNewParameter();

   if (!this.isSearchAndSelect)
   {
      var select = new HtmlSelect(this.screen.document.getElementById(this.getDomId()));
      select.selectAll();

      var selected = select.getSelectedItems();

      for (var i = 0; i < selected.length; ++i)
      {
         param.addValue(new ConcreteReportParameterValue(selected[i].text, selected[i].value));
      }

      if( this.useDefaultsIfNoValuesEntered && selected.length < 1 )
      {
         param = this.defaultValues;
      }
   }
   else
   {
      param = this.ssWidget.createParameterObject();
   }
   if( this.discardDefaultsIfValuesEntered && param.values.length > 1 )
   {
      param.removeValues(this.defaultValues);
   }

   if( JsUtil.isGood(param) && this.paramInfo.isSubmitCommaSeparatedList )
   {
      param.convertToSingleCommaSeparatedValue()
   }

   return param;
}

ProvideMultipleRawValuesPrompt.onAddButtonClicked = function (aDomId)
{
   var doc = document;

   var input = doc.getElementById("newValueFor_" + aDomId);

   var select = new HtmlSelect(doc.getElementById(aDomId));
   select.addValue(input.value);

   input.value = '';
}

ProvideMultipleRawValuesPrompt.onRemoveButtonClicked = function (aDomId)
{
   var doc = document;

   var select = new HtmlSelect(doc.getElementById(aDomId));
   select.removeSelectedItems();
}


//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================


/**
 * Genereted Prompt Screen
 * @class
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function GeneratedPromptScreen(aDocument, aNumColumns)
{
   this.prompts = new Object();
   this.document = aDocument;
   this.numColumns = aNumColumns;
   this.useNumColumns = true;
   this.cascadingLists = new Array();
   this.promptGroups = new Array();
   this.listInitCode = "";
}

GeneratedPromptScreen.prototype.setTitle = function(aTitle)
{
   this.title = aTitle;
}

GeneratedPromptScreen.prototype.addPrompt = function (aPrompt)
{
   this.prompts[aPrompt.paramInfo.name] = aPrompt;
   aPrompt.screen = this;
}

GeneratedPromptScreen.prototype.addCascadingList = function (aList)
{
   this.cascadingLists[this.cascadingLists.length]=aList;
}

GeneratedPromptScreen.prototype.addPromptGroup = function(aPromptGroup)
{
   this.promptGroups.push(aPromptGroup);
   aPromptGroup.setScreen(this);
};

GeneratedPromptScreen.prototype.renderPrompts = function (anInsertionPoint, aParamSet, aReportId)
{
   if (JsUtil.isGood(this.title))
   {
      var titleDiv = this.document.createElement("div");
      titleDiv.className = "title";
      titleDiv.innerHTML = this.title;
      anInsertionPoint.appendChild(titleDiv);

      this.addSpacer(anInsertionPoint);
   }

   var i = 0;
   for (var name in this.prompts)
   {
      this.prompts[name].renderPrompt(anInsertionPoint, aParamSet, aReportId);

      if (( this.isUseNumColumns && ++i >= this.numColumns ) || this.prompts[name].paramInfo.isBreakAfter)
      {
         this.addSpacer(anInsertionPoint);

         i = 0;
      }
   }
   eval(this.listInitCode);
   for (var index =0; index < this.cascadingLists.length; index++)
   {
      var eachList = this.cascadingLists[index];
      eachList.refreshView();
   }

   for (var j = 0; j < this.promptGroups.length; j++)
   {
      this.promptGroups[j].renderGroup(anInsertionPoint, aParamSet, aReportId);

      this.addSpacer(anInsertionPoint);
   }

};

GeneratedPromptScreen.prototype.addSpacer = function (anInsertionPoint)
{
      var spacerDiv = this.document.createElement("div");
      spacerDiv.className = "promptRowSpacerDiv";
      spacerDiv.innerHTML = "&nbsp;";

      anInsertionPoint.appendChild(spacerDiv);
}




//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================



function PromptGroup(aName, aTitle, aIsExpanded)
{
   this.name = aName;
   this.title = aTitle;
   this.expanded = aIsExpanded;
   this.prompts = new Object();
   this.cascadingLists = new Array();
   this.listInitCode = "";
}
;

PromptGroup.prototype.addPrompt = function(aPrompt)
{
   this.prompts[aPrompt.paramInfo.name] = aPrompt;
};

PromptGroup.prototype.setScreen = function(aScreen)
{
   this.screen = aScreen;
};

PromptGroup.prototype.addCascadingList = function(aList)
{
   this.cascadingLists[this.cascadingLists.length]=aList;
};

PromptGroup.prototype.renderGroup = function(anInsertionPoint, aParamSet, aReportId)
{
   var sectionDiv = this.screen.document.createElement("div");
   sectionDiv.className = "section";

   anInsertionPoint.appendChild(sectionDiv);

   var headerDiv = this.screen.document.createElement("div");
   headerDiv.className = "header";
   headerDiv.id = this.name;

   var html = '';

   html = '  <div class="collapseButton" onclick="PromptGroup.toggleGroup(\'' + this.name + '\');" id="' + this.name + 'ButtonCollapse">' +
          '     <img alt="expand" src="' + ServerEnvironment.baseUrl + '/images/triangleDown.gif"/>' +
          '  </div>' +
          '  <div class="collapseButton" onclick="PromptGroup.toggleGroup(\'' + this.name + '\');" id="' + this.name + 'ButtonExpand">' +
          '     <img alt="expand" src="' + ServerEnvironment.baseUrl + '/images/triangleUp.gif"/>' +
          '  </div>' +
          '  <div id="' + this.name + 'DivTitleLink"">' +
          '     <a href="javascript:PromptGroup.toggleGroup(\'' + this.name + '\');" title="Click to show parameters">' + this.title + '</a>' +
          '  </div>';
   headerDiv.innerHTML = html;

   sectionDiv.appendChild(headerDiv);

   var promptDiv = this.screen.document.createElement("div");
   promptDiv.id = this.name + 'Div';
   promptDiv.className = "sectionContent";

   sectionDiv.appendChild(promptDiv);


   //   for (var i = 0; i < this.prompts.length; i++)
   for (var name in this.prompts)
   {
      this.prompts[name].screen = this.screen;
      this.prompts[name].renderPrompt(promptDiv, aParamSet, aReportId)
      if (this.prompts[name].paramInfo.isBreakAfter)
      {
         var spacerDiv = this.screen.document.createElement("div");
         spacerDiv.className = "promptRowSpacerDiv";
         spacerDiv.innerHTML = "&nbsp;";

         promptDiv.appendChild(spacerDiv);
      }
   }

   var clearDiv = this.screen.document.createElement("div");
   clearDiv.style.clear = "both";
   promptDiv.appendChild(clearDiv);

   eval(this.listInitCode);
   for (var index =0; index < this.cascadingLists.length; index++)
   {
      var eachList = this.cascadingLists[index];
      eachList.refreshView(this);
   }

   if (!this.expanded)
   {
      PromptGroup.hideGroup(this.name);
   }
   else
   {
      PromptGroup.showGroup(this.name);
   }
};

PromptGroup.toggleGroup = function(anElementId)
{
   var element = document.getElementById(anElementId + 'Div');

   if (element.style.display == "none")
   {
      PromptGroup.showGroup(anElementId);
   }
   else
   {
      PromptGroup.hideGroup(anElementId);
   }
};

PromptGroup.showGroup = function(anElementId)
{
   document.getElementById(anElementId + 'Div').style.display = "";
   document.getElementById(anElementId + 'ButtonCollapse').style.display = "none";
   document.getElementById(anElementId + 'ButtonExpand').style.display = "";

};

PromptGroup.hideGroup = function(anElementId)
{
   document.getElementById(anElementId + 'Div').style.display = "none";
   document.getElementById(anElementId + 'ButtonCollapse').style.display = "";
   document.getElementById(anElementId + 'ButtonExpand').style.display = "none";

};


//extend : function(){
//// inline overrides
//   var io = function (o)
//   {
//      for (var m in o)
//      {
//         this[m] = o[m];
//      }
//   };
//
//   var oc = Object.prototype.constructor;
//
//   return function (sb, sp, overrides)
//   {
//      // 2 parameters passed.
//      if (Ext.isObject(sp))
//      {
//         overrides = sp;
//         sp = sb;
//         sb = overrides.constructor != oc ? overrides.constructor : function ()
//         {
//            sp.apply(this, arguments);
//         };
//      }
//
//      var F = function ()
//      {
//      }, sbp, spp = sp.prototype;
//      F.prototype = spp;
//      sbp = sb.prototype = new F();
//      sbp.constructor = sb;
//      sb.superclass = spp;
//      if (spp.constructor == oc)
//      {
//         spp.constructor = sp;
//      }
//      sb.override = function (o)
//      {
//         Ext.override(sb, o);
//      };
//      sbp.superclass = sbp.supr = (function ()
//      {
//         return spp;
//      });
//      sbp.override = io;
//      Ext.override(sb, overrides);
//      sb.extend = function (o)
//      {
//         return Ext.extend(sb, o);
//      };
//      return sb;
//   };
//}
//(),