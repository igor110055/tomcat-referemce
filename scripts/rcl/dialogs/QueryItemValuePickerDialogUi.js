/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: QueryItemValuePickerDialogUi.js 4535 2007-07-26 20:21:15Z lhankins $




//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the QueryItemValuePicker screen...
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function QueryItemValuePickerDialogUiController (aDocument, aIsMultiSelect, aPageNumber, aTotalPages, aMaxNumberOfSelections)
{
   if (arguments.length > 0)
   {
      QueryItemValuePickerDialogUiController.superclass.constructor.call(this, aDocument);
      this.init(aDocument, aIsMultiSelect, aPageNumber, aTotalPages, aMaxNumberOfSelections);
   }
}

//--- This class extends AbstractUiController
QueryItemValuePickerDialogUiController.prototype = new AbstractUiController();
QueryItemValuePickerDialogUiController.prototype.constructor = QueryItemValuePickerDialogUiController;
QueryItemValuePickerDialogUiController.superclass = AbstractUiController.prototype;


/**
 * @private
 **/
QueryItemValuePickerDialogUiController.prototype.init = function(aDocument, aIsMultiSelect, aPageNumber, aTotalPages, aMaxNumberOfSelections)
{
   this.isMultiSelect = aIsMultiSelect;
   this.pageNumber = aPageNumber;
   this.totalPages = aTotalPages;
   this.maxNumberOfSelections = aMaxNumberOfSelections;
   this.dialogListener = null;

   this.availableValues = new HtmlSelect(this.document.getElementById("availableValues"));
   this.selectedValues = new HtmlSelect(this.document.getElementById("selectedValues"));

};

/**
 * initializes the UI...
 **/
QueryItemValuePickerDialogUiController.prototype.initUi = function()
{
   this.document.getElementById("filterBy").focus();
};

QueryItemValuePickerDialogUiController.prototype.setDialogListener = function (aDialogListener)
{
   this.dialogListener = aDialogListener;
};

/**
 * called to setup the previous selections (usually just after initializing the UI)
 * @param aPreviousSelections
 */
QueryItemValuePickerDialogUiController.prototype.setInitialSelections = function (aInitialSelections, aValuePropertyName, aDisplayTextPropertyName)
{
   if (aInitialSelections)
   {
      var valueProperty = aValuePropertyName ? aValuePropertyName : "value";
      var textProperty = aDisplayTextPropertyName ? aDisplayTextPropertyName : "text";
      this.selectedValues.addAll(aInitialSelections, valueProperty, textProperty);
   }
};


QueryItemValuePickerDialogUiController.prototype.nextPage = function ()
{
   this.setSkipToPage(this.pageNumber + 1);
};

QueryItemValuePickerDialogUiController.prototype.previousPage = function ()
{
   this.setSkipToPage(this.pageNumber - 1);
};

QueryItemValuePickerDialogUiController.prototype.firstPage = function ()
{
   this.setSkipToPage(0);
};

QueryItemValuePickerDialogUiController.prototype.lastPage = function ()
{
   this.setSkipToPage(this.totalPages-1);
};

QueryItemValuePickerDialogUiController.prototype.setSkipToPage = function (aValue)
{
   if (this.willSubmit())
   {
      this.document.forms[0].skipToPage.value = aValue;
      this.document.forms[0].submit();
   }
};

QueryItemValuePickerDialogUiController.prototype.onOkButtonPress = function ()
{
   var numSelections = this.selectedValues.getAllItems().length;

   if (numSelections == 0)
   {
      if (!confirm(applicationResources.getProperty("dialogs.qivp.warn.selectedNoItems")))
      {
         return false;
      }
   }
   else if (numSelections > this.maxNumberOfSelections)
   {
      alert(applicationResources.getPropertyWithParameters("dialogs.qivp.warn.execeededMaxNumberOfSelections", [numSelections, this.maxNumberOfSelections]));
      return false;
   }


   this.dialogFinished("OK");
   return true;
};

QueryItemValuePickerDialogUiController.prototype.onCancelButtonPress = function ()
{
   this.dialogFinished("Cancel");
};

QueryItemValuePickerDialogUiController.prototype.addToSelected = function ()
{
   this.selectedValues.addAll(this.availableValues.getSelectedItems(), "value", "text");
   this.availableValues.deselectAll();
};

QueryItemValuePickerDialogUiController.prototype.removeFromSelected = function ()
{
   this.selectedValues.removeSelectedItems();
};


/**
 * called when submission is imminent, usually when we're going another page in the
 * paged data
 *
 * @return true or false.  true indicates submission can proceed, false indicates
 * there's a problem.
 */
QueryItemValuePickerDialogUiController.prototype.willSubmit = function ()
{
   // set the display text form field to contain display text for
   // all selected items...
   this.selectedValues.selectAll();
   this.document.forms[0].selectedXml.value = this.selectedValues.toXml();

   return true;
};


QueryItemValuePickerDialogUiController.prototype.dialogFinished = function (aGesture)
{
   if (this.dialogListener)
   {
      this.dialogListener.dialogFinished(aGesture, this);
   }
};

/**
 * this is called by CrnDialog once the dialog is finished, returns the results of
 * this dialog. 
 */
QueryItemValuePickerDialogUiController.prototype.getDialogResults = function ()
{
   // returns array of HtmlOption objects...
   this.selectedValues.removeDuplicates();
   this.selectedValues.selectAll();
   return this.selectedValues.getSelectedItems();
};

