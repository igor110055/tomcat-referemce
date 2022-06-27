//-----------------------------------------------------------------------------
/**
 * I am the UI controller for this prompt screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function SalesRepPromptUiController (aDocument)
{
   if (arguments.length > 0)
   {
      SalesRepPromptUiController.superclass.constructor.call(this, aDocument);
   }
}

//--- inheritance chain...
SalesRepPromptUiController.prototype = new AbstractCustomPromptUiController();
SalesRepPromptUiController.prototype.constructor = SalesRepPromptUiController;
SalesRepPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI (reset it to appropriate state, based on previously stored params)
**/
SalesRepPromptUiController.prototype.initUi = function()
{
   var paramSet = this.getRei().parameterSet;

   this.labsSelect = new HtmlSelect(this.document.getElementById("salesReps"));

   var labsParam = paramSet.getParameter("SalesRep");

   if (labsParam)
   {
      this.labsSelect.resetSelectedItems(labsParam.getRawValues());
   }

   //--- base class initUi...
   SalesRepPromptUiController.superclass.initUi.call(this);
};


/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
SalesRepPromptUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
SalesRepPromptUiController.prototype.willSubmit = function()
{
   var paramSet = this.getRei().parameterSet;
   paramSet.clear();
   paramSet.addParameter(ReportParameter.createFromSelectElement("SalesRep", this.labsSelect.domElement,  false));
};
