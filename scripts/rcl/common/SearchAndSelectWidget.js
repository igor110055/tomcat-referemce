/**
 * @fileoverview
 * This file defines a search and select widget
 *
 * @author Lance Hankins
 *
 **/



//-----------------------------------------------------------------------------
/**
* ExtraSearchParam
* @constructor
* @class
**/
function ExtraSearchParam (aName, aValues)
{
   this.name = aName;
   this.values = aValues;
}

ExtraSearchParam.prototype.toQueryParam = function()
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
};



//-----------------------------------------------------------------------------
/**
* SearchAndSelectWidget
* @constructor
* @class
**/
function SearchAndSelectWidget (aDocument, aId, aParamName, aParamSet, aValidateAction, aLabel, aIsRequired, aValueRef, aDisplayTextRef)
{
   this.document = aDocument;
   this.domId = aId;

   this.paramName = aParamName;
   this.paramSet = aParamSet;
   this.validator = new AjaxValidator(aValidateAction);
   this.label = aLabel;
   this.isRequired = aIsRequired;

   this.insertionPoint = null;
   this.containerId = this.domId + "_container";
   this.inputId = this.domId + "_input";
   this.selectId = this.domId + "_select";

   this.htmlSelect = null;

   this.extraSearchParamsProvider  = null;

   this.crnDialog = new CrnDialog();
   this.crnDialog.setDefaultPosition(30,10);

   this.valueRef = aValueRef;
   this.displayTextRef = aDisplayTextRef;

   //--- defaults...
   this.dialogTitle = "Select " + this.label;
   this.filterType = "raw";
   this.itemsPerPage = 100;

   this.imageDir = ServerEnvironment.baseUrl + "/images";
}


/**
 * submission is imminent, update my resepective parameter values...
 **/
SearchAndSelectWidget.prototype.willSubmit = function()
{
   this.paramSet.addParameter(this.createParameterObject());
};

SearchAndSelectWidget.prototype.createParameterObject = function()
{
   return ReportParameter.createFromSelectElement(this.paramName,  this.htmlSelect.domElement, true);
};



/**
 * initialize the widget's initial values from an existing report parameter
 **/
SearchAndSelectWidget.prototype.initFromParamValues = function()
{
   var param = this.paramSet.getParameter(this.paramName);

   if (JsUtil.isGood(param))
   {
      var eachPv;
      for (var i = 0; i < param.values.length; ++i)
      {
         eachPv = param.values[i];
         this.htmlSelect.addValue(eachPv.getValue(), eachPv.getDisplayValue());
      }
   }
};

/**
 * update the associated parameter's state based on our current values
 **/
SearchAndSelectWidget.prototype.updateParamValues = function()
{
   var listBoxItems = this.htmlSelect.getSelectedItems();
   var paramValues = [];
   for (var i = 0; i < listBoxItems.length; ++i)
   {
      paramValues.push(new ConcreteReportParameterValue(listBoxItems[i].text, listBoxItems[i].value));
   }

   this.paramSet.addParameter(new ReportParameter(this.paramName, paramValues, 'GenericString'));
};




/**
 * called when user presses enter on the input field, or the > button.  Validate the
 * value and add it if it passes validation...
 **/
SearchAndSelectWidget.prototype.addUserSuppliedValue = function()
{
   var inputElement = this.document.getElementById(this.inputId);
   var value = JsUtil.trim(inputElement.value);

   var result = this.validator.validateValue(value);


   if (result.isValid)
   {
      this.htmlSelect.addValue(result.value,  result.displayText);
      inputElement.value = '';
   }
   else
   {
      alert("sorry, '" + value + "' is not a valid id");
   }
};




/**
 * if the user presses enter after typing in the input box, call addUserSuppliedValue
 **/
SearchAndSelectWidget.prototype.onInputKeyPress = function(anEvent)
{
   var evt = JsUtil.normalizeEvent(anEvent);
   if (evt.keyCode == 13)
   {
      this.addUserSuppliedValue();
      return false;
   }
};

/**
 * remove selected items from values...
 **/
SearchAndSelectWidget.prototype.removeFromSelected = function()
{
   this.htmlSelect.removeSelectedItems();
};


/**
 * launch the search dialog and let the user pick from a list of values...
 **/
SearchAndSelectWidget.prototype.launchSearchDialog = function()
{
   var extraParams = (this.extraSearchParamsProvider ? this.extraSearchParamsProvider.getExtraSearchParams(this) : null);

   this.crnDialog.setDialogListener (this);
   this.crnDialog.showValuePickerDialog(this.dialogTitle,
                                        this.valueRef,
                                        this.displayTextRef,
                                        true,
                                        this.document.getElementById(this.inputId).value,
                                        null,
                                        this.itemsPerPage,
                                        this.filterType,
                                        extraParams,
                                        null,
                                        null,
                                        1000);
};

/**
 * search dialog finished...
 **/
SearchAndSelectWidget.prototype.dialogFinished = function(aPicker)
{
   // TODO: re-show all selects...
   if (aPicker.wasCancelled == false)
   {
      var selectedValues = aPicker.selectedValues;

      for (var i = 0; i < selectedValues.length; ++i)
      {
         this.htmlSelect.addValue(selectedValues[i].value, selectedValues[i].text);
      }
   }
};




/**
 * insert this widget into the document...
 **/
SearchAndSelectWidget.prototype.insertIntoDocument = function(aInsertionPoint)
{
   var html = '' +
     '<div class="searchAndSelectWidget">' +
     '<table>' +
       '<tr id="' + this.containerId + '">' +
          '<td class="labelArea">' +
             '<span class="label">' + this.label + '</span>' +
              (this.isRequired ?  '<img src="' + this.imageDir + '/required.gif" alt="req"/>' : '') +
          '</td>' +
          '<td class="inputArea">' +
             '<input type="text" id="' + this.inputId + '" size="12" onkeypress="return document.getElementById(\'' + this.containerId + '\').widget.onInputKeyPress(event);"/>' +
             '<img src="' + this.imageDir + '/search.png" alt="search" onclick="document.getElementById(\'' + this.containerId + '\').widget.launchSearchDialog();"/>' +
          '</td>' +
          '<td class="buttons">' +
             '<input type="button" class="button" value=">>" onclick="document.getElementById(\'' + this.containerId + '\').widget.addUserSuppliedValue();"/><br/>' +
             '<input type="button" class="button" value="<<" onclick="document.getElementById(\'' + this.containerId + '\').widget.removeFromSelected();"/>' +
          '</td>' +
          '<td class="selectedValues">' +
             '<select id="' + this.selectId + '" multiple="true" size="8">' +
             '</select>' +
          '</td>' +
       '</tr>' +
    '</table>' +
    '</div>';


   this.document.getElementById(this.domId).innerHTML = html;

   this.document.getElementById(this.containerId).widget = this;

   this.htmlSelect = new HtmlSelect(this.document.getElementById(this.selectId));
};
