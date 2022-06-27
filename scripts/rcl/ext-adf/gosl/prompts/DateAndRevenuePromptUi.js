/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

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


   var dateValue = '';
   if (JsUtil.isGood(beginDateParam))
   {
      var dateAndTime = beginDateParam.values[0].value;
//      this.startDateField.setValue(dateAndTime.substring(0, dateAndTime.indexOf(' ')));
      dateValue = dateAndTime.substring(0, dateAndTime.indexOf(' '));
   }


   var minRevenueValue = 100;
   if (JsUtil.isGood(minRevenueParam))
   {
//      this.minimumRevenueField.setValue(minRevenueParam.getRawValues()[0]);
      minRevenueValue = (minRevenueParam.getRawValues()[0]);
   }


   this.startDateField = new Ext.form.DateField({
      fieldLabel: applicationResources.getProperty('prompt.startDate'),
      id: 'startDate',
      format: 'Y-m-d',
      value: dateValue
   });

   this.minimumRevenueField = new Ext.form.NumberField({
      fieldLabel: applicationResources.getProperty('prompt.dateAndRevenue.minimumRevenue'),
      id: 'minimumRevenue',
      name: 'minimumRevenue',
      value: minRevenueValue
   });

   var mainPanel = new Ext.form.FormPanel({
      url: ServerEnvironment.baseUrl + '/secure/actions/ext/dateAndRevenuePrompt.do',
      renderTo: Ext.getBody(),
      title: applicationResources.getProperty('prompt.dateAndRevenue.beginDateAndRevenuePrompt'),
//      layout: 'form',
      bodyStyle: 'padding: 20px 10px 20px 10px',
      items: [this.startDateField, this.minimumRevenueField]
   });



   //--- base class initUi...
   DateAndRevenuePromptUiController.superclass.initUi.call(this);

};



/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
DateAndRevenuePromptUiController.prototype.beforeSubmit = function()
{

   if (!this.startDateField.isValid())
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


   var minRevenue = this.minimumRevenueField.getValue();
   paramSet.addParameter(ReportParameter.createSingleConcreteParameter("MinimumRevenue", null, minRevenue));

   //--- start date...
   var startDateDisplayText = this.startDateField.getValue().format('Y-m-d');
   if (!JsUtil.isEmptyString(startDateDisplayText))
   {
      // We add a timestamp to the end of the Date to keep CRN happy...
      var startDate = startDateDisplayText + " 00:00:00";
      paramSet.addParameter(ReportParameter.createSingleConcreteParameter("StartDate", startDateDisplayText, startDate));
   }
};

