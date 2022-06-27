

//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for all ReportWizard related UI controllers
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function AbstractReportWizardUiController (aDocument, aWizardReport, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      AbstractReportWizardUiController.superclass.constructor.call(this, aDocument);
      this.wizardReport = aWizardReport;
      this.pleaseWaitDiv = aPleaseWaitDiv;
   }
}

AbstractReportWizardUiController.prototype = new AbstractUiController();
AbstractReportWizardUiController.prototype.constructor = AbstractReportWizardUiController;
AbstractReportWizardUiController.superclass = AbstractUiController.prototype;

/**
 * used to throw up a transparent "please wait" div, also hides
 * selects (which don't respect transparency in IE)...
 **/
AbstractReportWizardUiController.prototype.startPleaseWaitDiv = function ()
{
   if (is_ie)
      this.hideAllSelects();

   this.pleaseWaitDiv.begin();
};

/**
 * used to close transparent "please wait" div, also restores
 * selects (which don't respect transparency in IE)...
 **/
AbstractReportWizardUiController.prototype.endPleaseWaitDiv = function ()
{
   this.pleaseWaitDiv.end();

   if (is_ie)
      this.restoreHiddenSelects();
};


AbstractReportWizardUiController.prototype.setStageTitle = function(aStageName)
{
   this.document.getElementById("rwStageName").innerHTML = aStageName;

   var wizardStep = this.document.forms[0].wizardStep.value;

   var progressBarImage = this.document.getElementById(wizardStep + "Image");
   progressBarImage.src = progressBarImage.src.replace("off", "on");

   var progressBarImageArrow = this.document.getElementById(wizardStep + "ArrowImage");
   progressBarImageArrow.src = progressBarImageArrow.src.replace("trans", "black");

   var progressBarText = this.document.getElementById(wizardStep + "ImageText");
   progressBarText.style.fontWeight = "bold";
};

AbstractReportWizardUiController.prototype.jumpTo = function(aJumpTo)
{
   this.document.getElementById("jumpTo").value = aJumpTo;
   this.setViewGestureAndSubmit("jumpTo");
};

AbstractReportWizardUiController.prototype.next = function()
{
   this.setViewGestureAndSubmit("next");
};

AbstractReportWizardUiController.prototype.previous = function()
{
   this.setViewGestureAndSubmit("previous");
};

AbstractReportWizardUiController.prototype.cancel = function()
{
   this.setViewGestureAndSubmit("cancel");
};

AbstractReportWizardUiController.prototype.preview = function()
{
   this.setViewGestureAndSubmit("preview");
};

AbstractReportWizardUiController.prototype.save = function()
{
   this.setViewGestureAndSubmit("save");
};

AbstractReportWizardUiController.prototype.saveAs = function()
{
   this.setViewGestureAndSubmit("saveAs");
};

AbstractReportWizardUiController.prototype.nextButton = function()
{
   this.setViewGestureAndSubmit("next");
};

AbstractReportWizardUiController.prototype.finishButton = function()
{
   if (this.verifyWizardReportIsExecutable())
   {
      this.setViewGestureAndSubmit("finish");
   }
};

AbstractReportWizardUiController.prototype.previousButton = function()
{
   this.setViewGestureAndSubmit("previous");
};

AbstractReportWizardUiController.prototype.cancelButton = function()
{
   this.setViewGestureAndSubmit("cancel");
};

AbstractReportWizardUiController.prototype.saveButton = function()
{
   this.setViewGestureAndSubmit("save");
};

AbstractReportWizardUiController.prototype.saveAsButton = function()
{
   this.setViewGestureAndSubmit("saveAs");
};

AbstractReportWizardUiController.prototype.validateButton = function()
{
   this.validateReport(true);
};

AbstractReportWizardUiController.prototype.disableNext = function()
{
   this.document.getElementById("nextButton").disabled = true;
};

AbstractReportWizardUiController.prototype.disablePrevious = function()
{
   this.document.getElementById("previousButton").disabled = true;
};

AbstractReportWizardUiController.prototype.disableRun = function()
{
   this.document.getElementById("runButton").disabled = true;
};

AbstractReportWizardUiController.prototype.disableFinish = function()
{
   this.document.getElementById("finishButton").disabled = true;
};

AbstractReportWizardUiController.prototype.disableReportComplete = function()
{
   if (this.wizardReport.columns.length == 0)
   {
      this.disableRun();
      this.disableFinish();
   }
};

AbstractReportWizardUiController.prototype.previewButton = function()
{
   var geom = new BrowserGeometry();
   win = JsUtil.openNewWindow("",
                     ServerEnvironment.windowNamePrefix + "_reportPreviewWindow",
                     "width=1000,height=680,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");
   document.forms[0].target = ServerEnvironment.windowNamePrefix + '_reportPreviewWindow';
   this.setViewGestureAndSubmit("preview");
   this.endPleaseWaitDiv();
   document.forms[0].target = '';
};

AbstractReportWizardUiController.prototype.runButton = function()
{
   if (this.beforeSubmit())
   {

      if (!this.verifyWizardReportIsExecutable())
         return;
      
      this.willSubmit(true);
      this.document.forms[0].wizardXml.value = this.wizardReport.toXml();


      //--- do async request to launch reports...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();

      var url = ServerEnvironment.contextPath + "/secure/actions/reportWizard.do";

      var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
         try
         {
            //alert("evaling: \n\n" + anXmlHttpRequest.responseText);
            eval(anXmlHttpRequest.responseText);
         }
         catch (e)
         {
            alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, anXmlHttpRequest.responseText)));
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

      var httpParams = 'viewGesture=run' +
                       '&wizardStep=' + this.document.forms[0].wizardStep.value +
                       '&wizardXml=' + this.document.forms[0].wizardXml.value;

      xmlHttpRequest.send(httpParams);

      this.endPleaseWaitDiv();

   }
};

/**
 * verify the wizard report is in a state where it could be executed...
 **/
AbstractReportWizardUiController.prototype.verifyWizardReportIsExecutable = function()
{
   //--- forces wizardReport to be updated based on current ui state...
   this.beforeSubmit();
   if (this.wizardReport.columns.length == 0)
   {
      alert(applicationResources.getProperty("reportWizard.errMsg.cantRunReportWithNoColumns"));
      return false;
   }

   var validationResult = this.validateReport(false);

   if (!validationResult.isValid)
   {
      DialogUtil.rclAlertWarning (applicationResources.getProperty("reportWizard.validation.cannotRunOrSaveInvalidReport"), "Report Failed Validation");
      return false;
   }
   else
   {
      return true;
   }
};



/**
 * hook for derived classes to cancel a pending submit...
 **/
AbstractReportWizardUiController.prototype.beforeSubmit = function()
{
   return true;
};

/**
 * hook for derived classes to do something right before a pending submit
 **/
AbstractReportWizardUiController.prototype.willSubmit = function(aShowWaitDiv)
{
   if (aShowWaitDiv)
   {
      this.startPleaseWaitDiv();
   }
};


/**
 * set the view gesture, call the the pre-submit hooks, then submit...
 **/
AbstractReportWizardUiController.prototype.setViewGestureAndSubmit = function(aViewGesture)
{
   this.document.getElementById("viewGesture").value = aViewGesture;
   if (this.beforeSubmit())
   {
      this.willSubmit(true);
      this.document.forms[0].wizardXml.value = this.wizardReport.toXml();
      this.document.forms[0].submit();
   }
};

/**
 * validate the current report
 * @param aPopUpResultsInSeparateWindow - if true, a validation result will be popped up in a separate
 * window.   IF false, a ReportValidationResult JS object will be
 */
AbstractReportWizardUiController.prototype.validateReport = function(aPopUpResultsInSeparateWindow)
{
//   FadeMessageController.getInstance().showFadeMessage("<br/><br/>Validating Report...<br/><br/>", 5000);
   window.status = "validating report...";


   if (this.beforeSubmit())
   {
      this.willSubmit(false);


      this.document.forms[0].wizardXml.value = this.wizardReport.toXml();
      this.document.getElementById("viewGesture").value = "validate";




      if (aPopUpResultsInSeparateWindow)
      {
         this.document.getElementById("responseFormat").value = "HTML";

         var windowName = window.name + "_validate";

         var geom = new BrowserGeometry();

         var win = JsUtil.openNewWindow("",
                                        windowName,
                                        "width=830,height=380,top=" + (geom.top + 95) + ",left=" + (geom.left + 100) + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

         var oldTarget = this.document.forms[0].target;
         this.document.forms[0].target = windowName;
         this.document.forms[0].submit();

         this.document.forms[0].target = oldTarget;
      }
      else
      {
         this.document.getElementById("responseFormat").value = "JS";


         try
         {
            var ajaxRequest = new Ajax.Request(ServerEnvironment.contextPath + "/secure/actions/reportWizard.do", {
                           method : 'post',
                           asynchronous : false,
                           parameters : Form.serialize(this.document.forms[0]),
                           onSuccess : function (aTransport) {
                              //debugger;

                              //alert("ajax request succeeded \n\n" + aTransport.responseText);
                              eval(aTransport.responseText);

                              this.validationResult = validationResult;
                           }.bind(this),
                           onFailure: function () {
                              alert("ajax request failed");
                           }
                        }
                     );
         }
         finally
         {
            window.status = "";
         }



         return this.validationResult;
      }
   }
};