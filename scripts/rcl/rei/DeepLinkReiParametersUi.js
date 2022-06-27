
//-----------------------------------------------------------------------------
/**
 * Parameters UI Model
 *
 * @constructor
 * @author Scott Allman
 **/
function DeepLinkReiParametersUiModel (aRei, aReportParameterInfo, aHasCustomPrompt)
{
   if (arguments.length > 0)
   {
      AbstractReiUiModel.prototype.constructor.call(this, aRei, aHasCustomPrompt);
      this.reportParamInfo = aReportParameterInfo;
   }
}

DeepLinkReiParametersUiModel.prototype = new AbstractReiUiModel();
DeepLinkReiParametersUiModel.prototype.constructor = DeepLinkReiParametersUiModel;
DeepLinkReiParametersUiModel.superclass = AbstractReiUiModel.prototype;



//-----------------------------------------------------------------------------
/**
 * Parameters UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function DeepLinkReiParametersUiController (aDocument, aModel)
{
   if (arguments.length > 0)
      AbstractReiUiController.prototype.constructor.call(this, aDocument, aModel);
}

DeepLinkReiParametersUiController.prototype = new AbstractReiUiController();
DeepLinkReiParametersUiController.prototype.constructor = DeepLinkReiParametersUiController;
DeepLinkReiParametersUiController.superclass = AbstractReiUiController.prototype;

/**
 * Deep link doesn't implement any of these methods (yet...)
 **/
DeepLinkReiParametersUiController.prototype.getSql = function()
{
};

DeepLinkReiParametersUiController.prototype.jumpTo = function(aStage)
{
};
DeepLinkReiParametersUiController.prototype.save = function()
{
};
DeepLinkReiParametersUiController.prototype.saveAs = function()
{
};
DeepLinkReiParametersUiController.prototype.disablePrevious = function()
{
};
DeepLinkReiParametersUiController.prototype.disableNext = function()
{
};
DeepLinkReiParametersUiController.prototype.jumpTo = function(aStage)
{
};


/**
* cancel button pressed...
**/
DeepLinkReiParametersUiController.prototype.cancel = function()
{
   history.go(-1);
};

/**
 * run button pressed...
 **/
DeepLinkReiParametersUiController.prototype.run = function()
{
   if (!this.beforeSubmit())
      return;


   //--- set all the form variables, then submit them using async request
   this.setViewGesture("run");

   this.willSubmit();


   this.beginPleaseWaitDiv(applicationResources.getProperty("profileWizard.submittingReport"));
   //--- do async request to launch reports...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.contextPath + "/secure/actions/deepLinkRunReport.do";

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      try
      {
         uiController.endPleaseWaitDiv();
         //alert("evaling: \n\n" + anXmlHttpRequest.responseText);
         eval(anXmlHttpRequest.responseText);
      }
      catch (e)
      {
         var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
         var writeString = anXmlHttpRequest.responseText;
         writeString = serverEnv + writeString;

         if (writeString.indexOf("<html>") == -1)
         {
            alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, anXmlHttpRequest.responseText)));
         }
         else
         {
            window.document.write(writeString);
         }
      }
   });

   xmlHttpRequest.open("POST", url, true);

   xmlHttpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
   );

   //--- harvest all inputs set on the form (we could hardcode just the ones we
   //    need, but this should be less fragile over time).
   var inputTags = this.document.getElementsByTagName("input");

   var httpParams = '';

   for (var i = 0; i < inputTags.length; ++i)
   {
      httpParams += inputTags[i].name + "=" + encodeURIComponent(inputTags[i].value) + "&";
   }

   xmlHttpRequest.send(httpParams);
};


/**
* initialize the ui...
**/
DeepLinkReiParametersUiController.prototype.initUi = function()
{
   DeepLinkReiParametersUiController.superclass.initUi.call(this);
   this.setStageTitle(applicationResources.getProperty("profileWizard.stageTitle.parameterValues"));
   this.disablePrevious();
   this.onReiDialogResize();
};


DeepLinkReiParametersUiController.prototype.getStageName = function()
{
   return "params";
};





/**
* @private
**/
DeepLinkReiParametersUiController.prototype.getPromptIframeUiController = function()
{
   return frames["promptIframe"].uiController;
};


/**
* hook for derived classes to do something (e.g. client side validation)
* before submitting.  If the method returns false, the submit will be
* cancelled.
**/
DeepLinkReiParametersUiController.prototype.beforeSubmit = function()
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
DeepLinkReiParametersUiController.prototype.willSubmit = function()
{
   this.getPromptIframeUiController().willSubmit();
   this.document.forms[0].reiXml.value = this.model.rei.toXml();
};

/**
 * get the report execution inputs...
 **/
DeepLinkReiParametersUiController.prototype.getRei = function()
{
  return this.model.rei;
};



/**
 * override of baseclass method, called when the window is resized
 **/
DeepLinkReiParametersUiController.prototype.onReiDialogResize = function()
{
   var geom = new BrowserGeometry();
   var newHeight;
   var newWidth;

   if (is_ie6 || is_ie4 || is_ie5)
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

   var div = $('reiCenterContent');
   div.style.height = newHeight + "px";
   div.style.width = newWidth + "px";

   var iframe = $('promptIframe');
   iframe.style.height = (newHeight-10) + "px";
   iframe.style.width = (newWidth - 4) + "px";
};

