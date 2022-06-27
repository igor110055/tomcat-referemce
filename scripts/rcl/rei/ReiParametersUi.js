
//-----------------------------------------------------------------------------
/**
 * Parameters UI Model
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiParametersUiModel (aRei, aReportParameterInfo, aHasCustomPrompt)
{
   if (arguments.length > 0)
   {
      AbstractReiUiModel.prototype.constructor.call(this, aRei, aHasCustomPrompt);
      this.reportParamInfo = aReportParameterInfo;
   }
}

ReiParametersUiModel.prototype = new AbstractReiUiModel();
ReiParametersUiModel.prototype.constructor = ReiParametersUiModel;
ReiParametersUiModel.superclass = AbstractReiUiModel.prototype;



//-----------------------------------------------------------------------------
/**
 * Parameters UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiParametersUiController (aDocument, aModel)
{
   if (arguments.length > 0)
      AbstractReiUiController.prototype.constructor.call(this, aDocument, aModel);
}

ReiParametersUiController.prototype = new AbstractReiUiController();
ReiParametersUiController.prototype.constructor = ReiParametersUiController;
ReiParametersUiController.superclass = AbstractReiUiController.prototype;



/**
* initialize the ui...
**/
ReiParametersUiController.prototype.initUi = function()
{
   ReiParametersUiController.superclass.initUi.call(this);
   this.setStageTitle(applicationResources.getProperty("profileWizard.stageTitle.parameterValues"));
   this.disablePrevious();
   this.initKeyHandler();
};

ReiParametersUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReiKeyHandler(this);
};


ReiParametersUiController.prototype.getStageName = function()
{
   return "params";
};





/**
* @private
**/
ReiParametersUiController.prototype.getPromptIframeUiController = function()
{
   if(frames["promptIframe"])
   {
      return frames["promptIframe"].uiController;
   }

   return null; };


/**
* hook for derived classes to do something (e.g. client side validation)
* before submitting.  If the method returns false, the submit will be
* cancelled.
**/
ReiParametersUiController.prototype.beforeSubmit = function()
{
   var promptIFrame = this.getPromptIframeUiController();
   if(!promptIFrame)
   {
      return true;
   }
   var promptBeforeSubmit = promptIFrame.beforeSubmit();

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
ReiParametersUiController.prototype.willSubmit = function()
{
   var promptIFrame = this.getPromptIframeUiController();
   if(promptIFrame)
   {
      promptIFrame.willSubmit();
   }
   this.document.forms[0].reiXml.value = this.model.rei.toXml();
};

/**
 * get the report execution inputs...
 **/
ReiParametersUiController.prototype.getRei = function()
{
  return this.model.rei;
};

ReiParametersUiController.prototype.nextButton = function()
{
  this.jumpTo('outputs');
};


