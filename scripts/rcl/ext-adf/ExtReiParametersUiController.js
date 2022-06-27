//-----------------------------------------------------------------------------
/**
 * Parameters UI Controller
 *
 * @constructor
 * @author Scott Allman
 **/
function ExtReiParametersUiController (aDocument, aModel)
{
   if (arguments.length > 0)
      ReiParametersUiController.prototype.constructor.call(this, aDocument, aModel);
}

ExtReiParametersUiController.prototype = new ReiParametersUiController();
ExtReiParametersUiController.prototype.constructor = ExtReiParametersUiController;
ExtReiParametersUiController.superclass = ReiParametersUiController.prototype;

ExtReiParametersUiController.prototype.setStageTitle = function(aStageName)
{
   //do nothing
};
ExtReiParametersUiController.prototype.disableNext = function(aStageName)
{
   //do nothing
};
ExtReiParametersUiController.prototype.disablePrevious = function(aStageName)
{
   //do nothing
};

ExtReiParametersUiController.prototype.onReiDialogResize = function(aStageName)
{
   //do nothing
};

/**
* hook for derived classes to do something when form submission is
* imminent...
**/
ExtReiParametersUiController.prototype.willSubmit = function()
{
   this.getPromptIframeUiController().willSubmit();
   Adf.editReportProfileUi.setReiXml(this.model.rei.toXml());
};


// Overriding the base class to prevent from using the legacy key handler.
ExtReiParametersUiController.prototype.initKeyHandler = function()
{

};
