//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the product comparison prompt screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProductLinePromptUiController (aDocument)
{
   AbstractCustomPromptUiController.prototype.constructor.call(this, aDocument);

   //--- set during initUi...
   this.productLineSelect = null;
}

//--- inheritance chain...
ProductLinePromptUiController.prototype = new AbstractCustomPromptUiController();
ProductLinePromptUiController.prototype.constructor = ProductLinePromptUiController;
ProductLinePromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
ProductLinePromptUiController.prototype.initUi = function()
{
   this.productLineSelect = new HtmlSelect(this.document.getElementById("productLine"));

   var paramSet = this.getRei().parameterSet;

   var param = paramSet.getParameter("Product Line");

   if (JsUtil.isGood(param))
   {
      this.productLineSelect.resetSelectedItems(param.getRawValues());
   }
};

/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
ProductLinePromptUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
ProductLinePromptUiController.prototype.willSubmit = function()
{
   var selected = this.productLineSelect.getSelectedItems();
   var paramSet = this.getRei().parameterSet;

   paramSet.addParameter(ReportParameter.createSingleConcreteParameter("Product Line", null, selected[0].value));
};

