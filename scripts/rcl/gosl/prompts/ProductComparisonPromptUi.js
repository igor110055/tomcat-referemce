//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the product comparison prompt screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProductComparisonPromptUiController (aDocument)
{
   AbstractCustomPromptUiController.prototype.constructor.call(this, aDocument);

   //--- set during initUi...
   this.select1 = null;
   this.select2 = null;
}

//--- inheritance chain...
ProductComparisonPromptUiController.prototype = new AbstractCustomPromptUiController();
ProductComparisonPromptUiController.prototype.constructor = ProductComparisonPromptUiController;
ProductComparisonPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
ProductComparisonPromptUiController.prototype.initUi = function()
{
   this.select1 = new HtmlSelect(this.document.getElementById("product1"));
   this.select2 = new HtmlSelect(this.document.getElementById("product2"));


   var paramSet = this.getRei().parameterSet;

   var product1Param = paramSet.getParameter("Product1");
   var product2Param = paramSet.getParameter("Product2");

   if (JsUtil.isGood(product1Param))
   {
      this.select1.resetSelectedItems(product1Param.getRawValues());
   }
   if (JsUtil.isGood(product2Param))
   {
      this.select2.resetSelectedItems(product2Param.getRawValues());
   }
};

/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
ProductComparisonPromptUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
ProductComparisonPromptUiController.prototype.willSubmit = function()
{
   var selected1 = this.select1.getSelectedItems();
   var selected2 = this.select2.getSelectedItems();

   var paramSet = this.getRei().parameterSet;

   paramSet.addParameter(ReportParameter.createSingleConcreteParameter("Product1", null, selected1[0].value));
   paramSet.addParameter(ReportParameter.createSingleConcreteParameter("Product2", null, selected2[0].value));
};

