//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the product comparison prompt screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function DateAndRevenuePromptUiController (aDocument)
{
   AbstractCustomPromptUiController.prototype.constructor.call(this, aDocument);

   //--- set during initUi...
   this.DateAndRevenueSelect = null;
}

//--- inheritance chain...
DateAndRevenuePromptUiController.prototype = new AbstractCustomPromptUiController();
DateAndRevenuePromptUiController.prototype.constructor = DateAndRevenuePromptUiController;
DateAndRevenuePromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
DateAndRevenuePromptUiController.prototype.initUi = function()
{
   var paramSet = this.getRei().parameterSet;

   var beginDateParam = paramSet.getParameter("StartDate");
   var minRevenueParam = paramSet.getParameter("MinimumRevenue");

   if (JsUtil.isGood(beginDateParam))
   {
      var dateAndTime = beginDateParam.getRawValues()[0];
      document.forms[0].startDate.value = dateAndTime.substring(0, dateAndTime.indexOf(' '));
   }

   if (JsUtil.isGood(minRevenueParam))
      document.forms[0].minimumRevenue.value = minRevenueParam.getRawValues()[0];


   //--- base class initUi...
   DateAndRevenuePromptUiController.superclass.initUi.call(this);

};

/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
DateAndRevenuePromptUiController.prototype.beforeSubmit = function()
{
   var startDateDisplayText = this.document.forms[0].startDate.value;

   if (!DateAndRevenuePromptUiController.superclass.validateDateStr(startDateDisplayText, "%Y-%m-%d", true))
   {
      alert(applicationResources.getProperty("prompt.dateAndRevenue.invalidDateFormat"));
      return false;
   }
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
DateAndRevenuePromptUiController.prototype.willSubmit = function()
{

   var paramSet = this.getRei().parameterSet;
   paramSet.clear();


   var minRevenue = document.forms[0].minimumRevenue.value;
   paramSet.addParameter(ReportParameter.createSingleConcreteParameter("MinimumRevenue", null, minRevenue));

   //--- start date...
   var startDateDisplayText = this.document.forms[0].startDate.value;
   if (!JsUtil.isEmptyString(startDateDisplayText))
   {
      // We add a timestamp to the end of the Date to keep CRN happy...
      var startDate = startDateDisplayText + " 00:00:00";
      paramSet.addParameter(ReportParameter.createSingleConcreteParameter("StartDate", startDateDisplayText, startDate));
   }
};

