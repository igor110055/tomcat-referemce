/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */
Ext.QuickTips.init();


Adf = Ext.ns('Adf');
Adf.widgets = Ext.ns('Adf.widgets');



//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================

/**
 * This class is a result object that is returned from a legacy validator.
 *
 * @param aIsValid A flag that indicates if the value tested is valid.
 * @param aValue Value of a valid value. Otherwise null if the value tested is invalid.
 * @param aDisplayText Display text of a valid value, otherwise null if the value tested is invalid.
 * @constructor
 */
function ValidationResult (aIsValid, aValue, aDisplayText)
{
   this.isValid = aIsValid;
   this.value = aValue;
   this.displayText = aDisplayText;
}


//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================

/**
 * This class is a little helper object used to format the extra parameters that are passed to the ADF Value Picker
 * dialog. If the parameter has more than 1 value then the values is a list of comma separated values.
 *
 * @param aName (String) The name of the parameter.
 * @param aValues (Array(String)) The values for the parameter.
 * @constructor
 */
function ExtraSearchParam (aName, aValues)
{
   this.name = aName;
   this.values = aValues;
}

ExtraSearchParam.prototype = {

   /**
    *
    * @returns {string}
    */
   toQueryParam: function()
   {
      var queryParam = this.name + "=";
      for (var i = 0; i < this.values.length; ++i)
      {
         queryParam += this.values[i] + ",";
      }
      if (this.values.length > 0)
      {
         queryParam = queryParam.substr(0, queryParam.length-2);
      }
      return queryParam;
   }
};


//======================================================================================================================
//**********************************************************************************************************************
//======================================================================================================================

/**
 * This class is the Search and Selection Widget. This component allows a user to define a list of values for a
 * report parameter on a custom prompt page.  This widget has a text field that allows a user to enter individual values
 * into the list or a search icon button that displays the ADF Value Picker to allow the user to choose values to add
 * to the list.
 *
 * To add a manually entered value into the list, the user must enter the value in the text field and press Enter or
 * press the &gt;&gt; button. Note, the value entered by the user is validated on the server before being added to the
 * list.
 *
 * To use the ADF Value Picker, the user presses the search icon button beside the entry field. If there is any text
 * in the text field then the ADF Value Picker will use that value to filter the list of available values.
 *
 * To remove the values from the selection grid, the user selects the values they wish to remove and press the
 * &lt;&lt; button.
 *
 * NOTE: Preferred name of the class to use Adf.widgets.SearchAndSelectWidget
 * NOTE: The validator has been converted to expect an array of JSON objects.
 *
 *
 * Example:
   myWidget = new Adf.widgets.SearchAndSelectWidget(
      Ext.getDoc(),
      '',
      'MyProductLineList',
      paramSet,
      ServerEnvironment.baseUrl + "/secure/actions/ext/genericValidate.do?reportId=101&promptName=MyProductLineList&promptValue=",
      "Product Test",
      false,
      "[gosales_goretailers].[Products].[Product line code]",
      "[gosales_goretailers].[Products].[Product line]"
   );
   myWidget.render(Ext.getBody());
   myWidget.initFromParamValues();
 *
 *
 *
 * @param aDocument (Object) A reference to the HTML document.
 * @param aId (String) ID of the container that will hold this widgets.
 * @param aParamName (String) The name of the parameter in the parameter set for this widget.
 * @param aParamSet (ReportParameterSet) The domain object used to pass data to and from the server.
 * @param aValidateAction (String) A URL used for validating a manually entered value. The value will be appended to the
 *                                     end of the URL.
 * @param aLabel (String) The label for this widget that will appear in the widget's title bar.
 * @param aIsRequired (Boolean) Indicates if this parameter is a required value.
 * @param aValueRef (String) The item value ref for the value of an item in the selected list.
 * @param aDisplayTextRef (String) The item value ref for the display text for an item selected list.
 * @param aConfig (Object) An EXTJS config object to provide extra values to the main panel of the widget.
 * @constructor
 */
function SearchAndSelectWidget (aDocument, aId, aParamName, aParamSet, aValidateAction, aLabel, aIsRequired, aValueRef, aDisplayTextRef, aConfig)
{
   this.document = aDocument;
   this.domId = aId;

   this.paramName = aParamName;
   this.paramSet = aParamSet;
//   this.validator = new Adf.widgets.AjaxValidator(aValidateAction);
   this.validationUrl = aValidateAction;
   this.label = aLabel;
   this.isRequired = aIsRequired;

   this.containerId = this.domId + "_container";
   this.inputId = this.domId + "_input";
   this.selectId = this.domId + "_select";


   this.extraSearchParamsProvider  = null;


   this.valueRef = aValueRef;
   this.displayTextRef = aDisplayTextRef;

   //--- defaults...
   this.dialogTitle = "Select " + this.label;
   this.filterType = "raw";
   this.itemsPerPage = 100;

   this.imageDir = ServerEnvironment.baseUrl + "/images";

   this.ADD_BUTTON_ID = Ext.id();
   this.REMOVE_BUTTON_ID = Ext.id();

   aConfig = Ext.apply({
      title: this.label + (this.isRequired ? '<img src="' + this.imageDir + '/required.gif" alt="req"/>' : ''),
      layout: 'column',
      id: this.containerId,
      width: 500,
      bodyStyle: "padding: 10px;",

      items: [{
         // Search field and button panel.
         xtype: 'panel',
         height: 200,
         width: 200,
         border: false,
         layout: 'column',
         items:[{
            xtype: 'textfield',
            id: this.inputId,
            enableKeyEvents: true,
            hideLabel: true,
            columnWidth: 1,
            listeners: {
               scope: this,
               keypress: function(aTextField, aEventObject)
               {
                  this.onInputKeyPress(aEventObject);
               }
            }
         },{
            xtype: 'button',
            icon: this.imageDir + '/search.png',
            scope: this,
            handler: function(aButton, aEventObject)
            {
               this.launchSearchDialog();
            }
         }]
      }, {
         // Add and Remove Button Panel.
         xtype: 'panel',
         border: false,
         layout: 'vbox',
         layoutConfig: {
            pack: 'center',
            align: 'stretch'
         },
         height: 200,
         width: 60,
         items: [{
            xtype: 'button',
            margins: '0 10 0 10',
            id: this.ADD_BUTTON_ID,
            text: '&gt;&gt;',
            scope: this,
            handler: function(aButton, aEventObject)
            {
               this.addUserSuppliedValue();
            }
         }, {

            xtype: 'button',
            margins: '6 10 10 10',
            id: this.REMOVE_BUTTON_ID,
            text: '&lt;&lt;',
            scope: this,
            handler: function(aButton, aEventObject)
            {
               this.removeFromSelected();
            }
         }]
      }, {
         // Seleced Grid Panel.
         xtype: 'grid',
         height: 200,
         id: this.selectId,
         hideHeaders: true,
         store: new Ext.data.JsonStore({
            root: 'items',
            id: 'value',
            fields: ['value', 'text']
         }),
         viewConfig: {forceFit: true},
         colModel: new Ext.grid.ColumnModel({
            columns: [
//               {header: 'Value', sortable: true, dataIndex: 'value'},
               {header: 'Text', sortable: true, dataIndex: 'text'}
            ]
         }),
         sm: new Ext.grid.RowSelectionModel({singleSelect:true})
      }]
   }, aConfig);

   SearchAndSelectWidget.superclass.constructor.call(this, aConfig);
}

Adf.widgets.SearchAndSelectWidget = Ext.extend(SearchAndSelectWidget, Ext.Panel, {

   /**
    * This method updated the parameter set with the current selected values that will be submitted to the server.
    */
   willSubmit: function()
   {
      this.paramSet.addParameter(this.createParameterObject());
   },


   /**
    * This method creates the report parameter to add the parameter set that will be submitted to the server. It
    * packages all of the value
    *
    * @returns {ReportParameter} The report parameter with the with the currently selected values.
    */
   createParameterObject: function()
   {
      var o = {
         paramValues: []
      };

      Ext.getCmp(this.selectId).getStore().each(function(aRecord){
         this.paramValues.push(new ConcreteReportParameterValue(aRecord.data.text, aRecord.data.value));
      }, o);

      return new ReportParameter(this.paramName, o.paramValues, 'GenericString');
   },


   /**
    * This method initialize the widget's initial values from an existing report parameter.
    */
   initFromParamValues: function()
   {
      var param = this.paramSet.getParameter(this.paramName);

      if (!Ext.isEmpty(param))
      {
         var o = {
            items: []
         };

         Ext.each(param.values, function(aItem, aIndex, aAllItems){
            this.items.push({
               value: aItem.getValue(),
               text: aItem.getDisplayValue()
            });
         }, o);

         Ext.getCmp(this.selectId).getStore().loadData(o, false);
      }
   },


   /**
    * This method updates the associated parameter's state with the currently selected (highlighted) values in the
    * selected grid.
    *
    * @deprecated An old legacy method, it doesn't make much sense to only submit values that are highlighted in the
    * selected grid.
    */
   updateParamValues: function()
   {
      var listBoxItems = Ext.getCmp(this.selectId).getSelectionModel().getSelections();

      var o = {
         paramValues: []
      };

      Ext.each(listBoxItems, function(aItem, aIndex, aAllItems){
         this.paramValues.push(new ConcreteReportParameterValue(aItem.data.text, aItem.data.value));
      }, o);

      this.paramSet.addParameter(new ReportParameter(this.paramName, o.paramValues, 'GenericString'));
   },



   /**
    * This method is called when user presses enter on the input field, or the > button.  Validate the
    * value and add it if it passes validation...
    */
   addUserSuppliedValue: function()
   {
      if (!this.validationMask)
      {
         this.validationMask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Please Waiting...Validating'
         });
      }
      this.validationMask.show();
      var value = Ext.getCmp(this.inputId).getValue();
      RequestUtil.request({
         url: this.validationUrl + value,
//         method: 'POST',
         scope: this,
         success: function(aResponse, aOptions)
         {
            var result = null;
            if (aResponse.responseText.indexOf("var validationResult") > -1)
            {
               // Legacy Validation Response.
               //     var validationResult = new ValidationResult(true, "5", "Golfing Equipment");
               eval(aResponse.responseText);
               result = validationResult;
            }
            else
            {
               result = Ext.decode(aResponse.responseText);
            }

            if (result.isValid)
            {
               Ext.getCmp(this.selectId).getStore().loadData({items:[{
                  value: result.value,
                  text: result.displayText
               }]}, true);
               Ext.getCmp(this.inputId).setValue("");
            }
            else
            {
               Ext.Msg.alert("Invalid Value", "Sorry, '" + value + "' is not a valid id");
            }
         },
         callback: function(aOptions, aSuccess, aResponse)
         {
            this.validationMask.hide();
         }
      });
   },


   /**
    * This method process key presses when the search text field has the focus. It validates and adds the
    * user entered value when the user presses the Enter key.
    *
    * @param aEventObject (Ext.EventObject) Key press event.
    * @returns {boolean}
    */
   onInputKeyPress: function(aEventObject)
   {
      if (aEventObject.getKey() == 13)
      {
         this.addUserSuppliedValue();
         return false;
      }
   },


   /**
    * This method removes the currently selected items from the selected values list.
    */
   removeFromSelected: function()
   {
      var selectedRecords = Ext.getCmp(this.selectId).getSelectionModel().getSelections();
      Ext.getCmp(this.selectId).getStore().remove(selectedRecords);
   },


   /**
    * This method launches the value picker dialog and let the user pick from a list of values.
    */
   launchSearchDialog: function()
   {
      var extraParams = (this.extraSearchParamsProvider ? this.extraSearchParamsProvider.getExtraSearchParams(this) : null);

      // The config values passed to the Value Picker Dialog.
      // @param title (String) - the title of the dialog.
      // @param queryItemPath (String) - a ref to the value query item.
      // @param displayValueRef (String) - a ref to the display text query item.
      // @param singleSelect (Boolean) - true for single selection or false to allow multi-selection.
      // @param aInitialFilter (String) - initial value for filter
      // @param aPackagePath (String) - the package path
      // @param aItemsPerPage (Number) - # of items per page
      // @param aFilterType (String) - the type of filter to apply, one of {"raw", "value", "displayValue" }
      // (defaults to "displayValue")
      // @param aExtraParams (String) - extra params that will be propagated down with the param value request
      // @param aInitialSelections (Array(Objects)) - initial selections to start with, this must be an array of objects
      // that have at least the following two properties { "value", "text" }
      // @param aCascadeContext (String) - the cascade context, if any
      // @param aMaxNumberOfSelections (Number) - the max # of selections that can be selected (defaults to 1000)

      var dialog = new Adf.widgets.QueryItemValuePickerDialog({
         title: this.dialogTitle,
         queryItemPath : this.valueRef,
         displayValueRef : this.displayTextRef,
         singleSelect : false,
         initialFilter: Ext.getCmp(this.inputId).getValue(),
         packagePath : null,
         itemsPerPage: this.itemsPerPage,
         filterType: this.filterType,
         extraParams: extraParams,
         initialValues: null,
         cascadeContextXml: null,
         maxNumberOfSelections: 1000,

         callBackScope : this,
         callBack : this.onDialogOkButtonPressed
      });
      dialog.show();

   },


   /**
    * This method handles the call back from Value Picker dialog.
    *
    * The format is of the value objects returned is:
    * valueObject = {
    *    value: 'some value',
    *    text: 'some display text'
    * };
    *
    * aSelectedValues = [{
    *    value: 'value 1',
    *    text: 'Display Text 1'
    * }, {
    *    value: 'value 2',
    *    text: 'Display Text 2'
    * }];
    *
    * @param aSelectedValues (Array) An array of values returned from the Value Picker dialog that were selected
    *                         by the user.
    */
   onDialogOkButtonPressed: function(aSelectedValues)
   {
      var newItems = [];
      for (var i = 0; i < aSelectedValues.length; ++i)
      {
         newItems.push({
            value: aSelectedValues[i].value,
            text: aSelectedValues[i].text
         });
      }
      if (newItems.length > 0)
      {
         Ext.getCmp(this.selectId).getStore().loadData({
            items: newItems
         }, true);
      }
   },

   

   /**
    * This method inserts this widget into the document.
    *
    * @param aInsertionPoint The placeholder (ID) or container (ID) to put the Search and Select widget. If the value
    * is null then the DOM ID passed in the constructor is used.
    */
   insertIntoDocument: function(aInsertionPoint)
   {
      this.render(Ext.value(aInsertionPoint, this.domId, false));
   }
});

