
//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the geographic hierarchy screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function RerPromptUiController (aDocument)
{
   if (arguments.length > 0)
   {
      RerPromptUiController.superclass.constructor.call(this, aDocument);



      //--- setup in initUi...
      this.reports = null;
      this.startDate = null;
      this.endDate = null;
   }

}

//--- inheritance chain...
RerPromptUiController.prototype = new AbstractCustomPromptUiController();
RerPromptUiController.prototype.constructor = RerPromptUiController;
RerPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
RerPromptUiController.prototype.initUi = function()
{
   var paramSet = this.getRei().parameterSet;

   this.reports = new HtmlSelect($("reports"));
   this.userLogons = new HtmlSelect($("userLogons"));



   //--- pre-select any param values that are part of the starting REI...

   var reportsParam = paramSet.getParameter("Report");

   if (JsUtil.isGood(reportsParam))
   {
      this.reports.resetSelectedItems(reportsParam.getRawValues());
   }

   var userLogonParam = paramSet.getParameter("UserLogon");
   if (JsUtil.isGood(userLogonParam))
   {
      this.userLogons.resetSelectedItems(userLogonParam.getRawValues());
   }


   var minPdfSizeParam = paramSet.getParameter("MinPdfSize");
   if (JsUtil.isGood(minPdfSizeParam))
   {
      $("minPdfSize").value = minPdfSizeParam.getRawValues()[0];
   }

   var minHtmlSizeParam = paramSet.getParameter("MinHtmlSize");
   if (JsUtil.isGood(minHtmlSizeParam))
   {
      $("minHtmlSize").value = minHtmlSizeParam.getRawValues()[0];
   }





   //--- start and end date...

   this.startDate = new DateParameterWidget ("StartDate", applicationResources.getProperty("prompt.startDate"), paramSet, true, 15, "00:00:00");
   this.endDate = new DateParameterWidget ("EndDate", applicationResources.getProperty("prompt.endDate"), paramSet, true, 15, "23:59:59");

   var insertAt = $('dateWidgets');

   this.startDate.insertIntoDocument(insertAt);
   this.endDate.insertIntoDocument(insertAt);

   //--- base class initUi...
   RerPromptUiController.superclass.initUi.call(this);
};



RerPromptUiController.prototype.selectAllReports = function()
{
   this.reports.selectAll();
};

RerPromptUiController.prototype.deSelectAllReports = function()
{
   this.reports.deselectAll();
};



/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
RerPromptUiController.prototype.beforeSubmit = function()
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
RerPromptUiController.prototype.willSubmit = function()
{
   var paramSet = this.getRei().parameterSet;
   paramSet.clear();

   paramSet.addParameter(ReportParameter.createFromSelectElement("Report", this.reports.domElement,  false));
   paramSet.addParameter(ReportParameter.createFromSelectElement("UserLogon", this.userLogons.domElement,  false));

   var minPdfSize = $F('minPdfSize');
   if (minPdfSize)
   {
      paramSet.addParameter(ReportParameter.createSingleConcreteParameter("MinPdfSize", minPdfSize, minPdfSize));
   }

   var minHtmlSize = $F('minHtmlSize');
   if (minHtmlSize)
   {
      paramSet.addParameter(ReportParameter.createSingleConcreteParameter("MinHtmlSize", minHtmlSize, minHtmlSize));
   }

   this.startDate.willSubmit();
   this.endDate.willSubmit();
};


