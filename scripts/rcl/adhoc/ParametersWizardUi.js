
//-----------------------------------------------------------------------------
/**
 * Parameters Wizard UI Model
 *
 * @constructor
 **/
function ParametersWizardUiModel (aRei, aReportParameterInfo, aHasCustomPrompt)
{
   if (arguments.length > 0)
   {
      this.reportParamInfo = aReportParameterInfo;
      this.rei = aRei;
      this.hasCustomPrompt = aHasCustomPrompt;
   }
}

//ParametersWizardUiModel.prototype = new AbstractReiUiModel();
//ParametersWizardUiModel.prototype.constructor = ParametersWizardUiModel;
//ParametersWizardUiModel.superclass = AbstractReiUiModel.prototype;



//-----------------------------------------------------------------------------
/**
 * Parameters UI Controller
 *
 * @constructor
 **/
function ParametersWizardUiController (aDocument, aModel,aWizardReport,aPleaseWaitDiv)
{
   if (arguments.length > 0)
      AbstractReportWizardUiController.prototype.constructor.call( this,aDocument, aWizardReport,aPleaseWaitDiv);
   this.model=aModel;

}

ParametersWizardUiController.prototype = new AbstractReportWizardUiController();
ParametersWizardUiController.prototype.constructor = ParametersWizardUiController;
ParametersWizardUiController.superclass = AbstractReportWizardUiController.prototype;



/**
* initialize the ui...
**/
ParametersWizardUiController.prototype.initUi = function()
{
//   ParametersWizardUiController.superclass.initUi.call(this);
   this.setStageTitle(applicationResources.getProperty("profileWizard.stageTitle.parameterValues"));
   this.disablePrevious();
   this.initKeyHandler();
};

ParametersWizardUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportWizardKeyHandler(this);
};


ParametersWizardUiController.prototype.getStageName = function()
{
   return "params";
};





/**
* @private
**/
ParametersWizardUiController.prototype.getPromptIframeUiController = function()
{
   return frames["promptIframe"].uiController;
};


/**
* hook for derived classes to do something (e.g. client side validation)
* before submitting.  If the method returns false, the submit will be
* cancelled.
**/
ParametersWizardUiController.prototype.beforeSubmit = function()
{
   var promptBeforeSubmit = this.getPromptIframeUiController().beforeSubmit();

   if (!promptBeforeSubmit)
      return false;

   //--- kind of a hack, but the REI is only updated during willSubmit()
   this.getPromptIframeUiController().willSubmit();

   var msg = '';
   var errorFound;
   var paramInfo;

   for (var i = 0; i < this.model.reportParamInfo.length; ++i)
   {
      paramInfo = this.model.reportParamInfo[i];
      if (!paramInfo.isSatisfiedBy(this.model.rei.parameterSet))
      {
         msg += applicationResources.getPropertyWithParameters("prompt.reiParameters.errMsg.requiredParamters", new Array(paramInfo.name))+"\n";
         errorFound = true;
      }
   }

   if (errorFound)
   {

      //this.beginPleaseWaitDiv("Validating Inputs...");

      alert(applicationResources.getProperty("prompt.reiParameters.errMsg.badParameters")+":\n\n" + msg);

      //this.endPleaseWaitDiv();
      return false;
   }


   return true;
};

/**
* hook for derived classes to do something when form submission is
* imminent...
**/
ParametersWizardUiController.prototype.willSubmit = function()
{
   this.getPromptIframeUiController().willSubmit();
   this.document.forms[0].reiXml.value = this.model.rei.toXml();
};

/**
 * get the report execution inputs...
 **/
ParametersWizardUiController.prototype.getRei = function()
{
  return this.model.rei;
};

ParametersWizardUiController.prototype.nextButton = function()
{
  this.jumpTo('filter');
};

/**
 * override of baseclass method, called when the window is resized
 **/
ParametersWizardUiController.prototype.onReiDialogResize = function()
{
   var geom = new BrowserGeometry();
   var newHeight;
   var newWidth;

   if (is_ie)
   {
      newHeight = (geom.height - 122);
      newWidth = (geom.width-10);
   }
   else
   {
      newHeight = (geom.height - 132);
      newWidth = (geom.width-10);
   }

   if (newHeight < 20)
      newHeight = 20;


   //window.status = 'resizing to [' + newHeight + "]";

   var div = $('centerContentDiv');
   div.style.height = newHeight + "px";
   div.style.width = newWidth + "px";

   var iframe = $('promptIframe');
   iframe.style.height = (newHeight-10) + "px";
   iframe.style.width = (newWidth - 4) + "px";
};

