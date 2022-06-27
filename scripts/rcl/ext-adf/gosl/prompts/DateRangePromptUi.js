
//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the date range prompt screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function DateRangePromptUiController (aDocument)
{
   if (arguments.length > 0)
   {
      DateRangePromptUiController.superclass.constructor.call(this, aDocument);

      //--- date widgets setup in initUi...
      this.startDate = null;
      this.endDate = null;
   }

}

//--- inheritance chain...
DateRangePromptUiController.prototype = new AbstractCustomPromptUiController();
DateRangePromptUiController.prototype.constructor = DateRangePromptUiController;
DateRangePromptUiController.superclass = AbstractCustomPromptUiController.prototype;

/**
* initialize the UI
**/
DateRangePromptUiController.prototype.initUi = function()
{
   var paramSet = this.getRei().parameterSet;

   //--- start and end date...
   this.startDate = new DateParameterWidget ("StartDate", applicationResources.getProperty("prompt.startDate"), paramSet);
   this.endDate = new DateParameterWidget ("EndDate", applicationResources.getProperty("prompt.endDate"), paramSet);

//   var insertAt = $('dateWidgets');
//
//   this.startDate.insertIntoDocument(insertAt);
//   this.endDate.insertIntoDocument(insertAt);

   this.mainPanel = new Ext.Panel({
      renderTo: Ext.getBody(),
//      title: 'Date Range Prompt',
      border: false,
      bodyStyle: 'padding: 20px 10px 20px 10px;',
      items: [{
         title: 'Reporting Period',
         xtype: 'panel',
         layout: 'hbox',
         bodyStyle: 'padding: 10px 10px 10px 10px;',
         width: 760,
         layoutConfig: {
            defaultMargins: {
               top: 0,
               left: 0,
               right: 10,
               bottom: 0
            }
         },
         items: [this.startDate, this.endDate]
      }]
   });
//   this.mainPanel = new Ext.Panel({
//      renderTo: Ext.getBody(),
//      title: 'Date Range Prompt - V2',
//      layoutConfig: {
//         defaultMargins: {
//            top: 0,
//            left: 0,
//            right: 10,
//            bottom: 0
//         }
//      },
//      layout: 'hbox',
//      bodyStyle: 'padding: 20px 10px 20px 10px',
//
//      items: [this.startDate, this.endDate]
//   });

   this.startDate.initFromParamValues();
   this.endDate.initFromParamValues();

   //--- base class initUi...
   DateRangePromptUiController.superclass.initUi.call(this);
};


/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
DateRangePromptUiController.prototype.beforeSubmit = function()
{
   if(!this.startDate.validate("%Y-%m-%d", true))
   {
      alert("Start Date is invalid; Please enter a valid date using the format yyyy-mm-dd.");
      return false;
   }

   if(!this.endDate.validate("%Y-%m-%d", true))
   {
      alert("End Date is invalid; Please enter a valid date using the format yyyy-mm-dd.");
      return false;
   }

   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
DateRangePromptUiController.prototype.willSubmit = function()
{
   var paramSet = this.getRei().parameterSet;
   paramSet.clear();

   this.startDate.willSubmit();
   this.endDate.willSubmit();
};
