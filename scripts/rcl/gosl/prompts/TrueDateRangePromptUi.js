
//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the date range prompt screen
 *
 * @constructor
 * @author - Jonathan James
 **/
function TrueDateRangePromptUiController (aDocument)
{
   if (arguments.length > 0)
   {
      TrueDateRangePromptUiController.superclass.constructor.call(this, aDocument);

      //--- date widgets setup in initUi...
      this.dateRange = null;
   }

}

//--- inheritance chain...
TrueDateRangePromptUiController.prototype = new AbstractCustomPromptUiController();
TrueDateRangePromptUiController.prototype.constructor = TrueDateRangePromptUiController;
TrueDateRangePromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
TrueDateRangePromptUiController.prototype.initUi = function()
{
   var paramSet = this.getRei().parameterSet;

   //--- start and end date...
   this.dateRange = new DateRangeWidget("pDateRange", "Date Range", paramSet, false, 60);

   var insertAt = $('dateWidgets');

   this.dateRange.insertIntoDocument(insertAt);


   //--- base class initUi...
   TrueDateRangePromptUiController.superclass.initUi.call(this);
};


/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
TrueDateRangePromptUiController.prototype.beforeSubmit = function()
{
   if(!this.dateRange.validate("%Y-%m-%d", false))
   {
      alert("Either start or end must be populated using the format yyyy-mm-dd.");
      return false;
   }

   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
TrueDateRangePromptUiController.prototype.willSubmit = function()
{
   var paramSet = this.getRei().parameterSet;
   paramSet.clear();

   this.dateRange.willSubmit();
};
