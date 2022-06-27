//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for the REI edit screen UiModel
 *
 * @constructor
 * @author Lance Hankins
 **/
function AbstractReiUiModel (aRei, aHasCustomPrompt)
{
   if (arguments.length > 0)
   {
      this.rei = aRei;
      this.hasCustomPrompt = aHasCustomPrompt;

      this.allowSave = false;
      this.allowGetSql = ServerEnvironment.isAdminUser;
   }
}



//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for the REI edit screen UiControllers
 *
 * @constructor
 * @author Lance Hankins
 **/
function AbstractReiUiController (aDocument, aModel, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);

      this.model = aModel;
//      this.tabBar = new TabBar();
//
//      this.tabBar.addTabListener( {tabWasSelected : function (aTab) {
//         uiController.tabWasSelected(aTab);
//      }});

      this.pleaseWaitDiv = aPleaseWaitDiv;
      this.startPleaseWaitDiv();
   }
}

AbstractReiUiController.prototype = new AbstractUiController();
AbstractReiUiController.prototype.constructor = AbstractReiUiController;
AbstractReiUiController.superclass = AbstractUiController.prototype;

AbstractReiUiController.prototype.startPleaseWaitDiv = function ()
{
}

AbstractReiUiController.prototype.endPleaseWaitDiv = function ()
{
   this.pleaseWaitDiv.end();
}

/**
* initialize the ui...
**/
AbstractReiUiController.prototype.initUi = function()
{
};

AbstractReiUiController.prototype.buttonClicked = function(anIt)
{
   switch(anIt.id) {
   case "run":
      this.run();
      break;
   case "save":
      this.save();
      break;
   case "saveAs":
      this.saveAs();
      break;
   case "cancel":
      this.cancel();
      break;
   }
};

/**
* hook for derived classes to do something (e.g. client side validation)
* before submitting.  If the method returns false, the submit will be
* cancelled.
**/
AbstractReiUiController.prototype.beforeSubmit = function()
{
  return true;
};

AbstractReiUiController.prototype.launchConfirmDialog = function()
{
   if (confirm(applicationResources.getProperty("general.confirmSaveActivity")))
   {
      this.confirmSaveActive();
   }
   else
   {
      this.confirmDiscardActive();
   }
};

/**
* hook for derived classes to process saving or discarding active content
**/
AbstractReiUiController.prototype.confirmSaveActive = function()
{
}

AbstractReiUiController.prototype.confirmDiscardActive = function()
{
}

AbstractReiUiController.prototype.setViewGesture = function(aGesture)
{
   this.document.forms[0].viewGesture.value = aGesture;
};

AbstractReiUiController.prototype.jumpTo = function(aStage)
{
   this.setViewGesture("jumpTo");
   this.document.forms[0].jumpTo.value = aStage;
   this.beginPleaseWaitDiv(applicationResources.getProperty("general.pleaseWait"));

   if (!this.doSubmit())
   {
      this.endPleaseWaitDiv();
   }
};

/**
 * @private
 **/
AbstractReiUiController.prototype.doSubmit = function(aStage)
{
   if (this.beforeSubmit())
   {
      this.willSubmit();
      document.forms[0].submit();
      return true;
   }
   else
   {
      return false;
   }

};




/**
 * run button pressed...
 **/
AbstractReiUiController.prototype.run = function()
{
   if (!this.beforeSubmit())
      return;


   //--- set all the form variables, then submit them using async request
   this.setViewGesture("run");

   this.willSubmit();


   this.beginPleaseWaitDiv(applicationResources.getProperty("profileWizard.submittingReport"));
   //--- do async request to launch reports...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.contextPath + "/secure/actions/editRei.do";

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
 * getSql button pressed...
 **/
AbstractReiUiController.prototype.getSql = function()
{
   if (!this.model.allowGetSql)
   {
      window.alert(applicationResources.getProperty("profileWizard.notAllowed"));
      return;
   }
   if (!this.beforeSubmit())
      return;

   //--- set all the form variables, then submit them using async request
   this.setViewGesture("getSql");

   this.willSubmit();


   var geom = new BrowserGeometry();
   var windowName = window.name + "_getSql";
   win = JsUtil.openNewWindow("about:blank",
                     windowName,
                     "width=1000,height=600,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=no");

   win.focus();



   this.document.forms[0].target = windowName;
   this.document.forms[0].submit();

   this.document.forms[0].target = window.name;
};

/**
* save button pressed...
**/
AbstractReiUiController.prototype.save = function()
{
   if (!this.model.allowSave)
   {
      window.alert(applicationResources.getProperty("profileWizard.notAllowed"));
      return;
   }
   if (this.beforeSubmit())
   {
      this.beginPleaseWaitDiv(applicationResources.getProperty("profileWizard.saving"));
      this.setViewGesture("save");
      this.doSubmit();
   }
};

/**
* saveAs button pressed...
**/
AbstractReiUiController.prototype.saveAs = function()
{
   if (!this.beforeSubmit())
      return;

   var targetType = document.getElementsByName("targetType");

   if (targetType[0].value == "ANONYMOUS_REPORT")
   {
      uiController.setServerInfoMessage("You can not Save As on an anonymous report");
      return;
   }
   var currentSelection = null;
   var reportName = null;

   var rclDialog = new RclDialog();
   var hideDoc = (this.getStageName() == "params" ? this.document.getElementById("promptIframe").contentWindow.document : this.document);

   var dialogListener = {
      thisDoc : document,
      dialogFinished : function (aPicker) {
         if (aPicker.wasCancelled == false)
         {
            currentSelection = aPicker.selectedValues[0].id;
            reportName = aPicker.inputValue;
            document.forms[0].saveToFolderPath.value = currentSelection;
            document.forms[0].saveAsNewProfileName.value = reportName;

            if (aPicker.saveAsType == "public")
            {
               document.forms[0].privateProfile.value = false;
            }
            else
            {
               document.forms[0].privateProfile.value = true;
            }
            uiController.setViewGesture("saveAs");
            uiController.doSubmit();
            if (is_ie)
            {
               JsUtil.hideAllSelects(hideDoc);
            }

         }
         else
         {
            uiController.endPleaseWaitDiv();
         }
      }
   };

   rclDialog.setDialogListener (dialogListener);




   rclDialog.visibleDocument = hideDoc;
   this.beginPleaseWaitDiv(applicationResources.getProperty("profileWizard.savingProfile"));
   rclDialog.showFolderChooserDialog(applicationResources.getProperty("profileWizard.selectFolder"),
                                     "",
                                     document.forms[0].saveToFolderPath.value,
                                     false, "folderWithInputChooser", this.document.forms[0].saveAsNewProfileName.value);

};

/**
* cancel button pressed...
**/
AbstractReiUiController.prototype.cancel = function()
{
   window.close();
};


AbstractReiUiController.prototype.onFinishActionChanged = function()
{
   var form = this.document.forms[0];

   if (form.onFinishAction[2].checked == true)
   {
      form.saveAsNewProfileName.disabled = false;
      form.saveAsNewProfileName.select();
   }
   else
   {
      form.saveAsNewProfileName.disabled = true;
   }
};

AbstractReiUiController.prototype.setStageTitle = function(aStageName)
{
   this.document.getElementById("rwStageName").innerHTML = aStageName;

   var wizardStep = this.document.forms[0].currentStage.value;

   var progressBarImage = this.document.getElementById(wizardStep + "Image");
   progressBarImage.src = progressBarImage.src.replace("off", "on");

   var progressBarArrowImage = this.document.getElementById(wizardStep + "ArrowImage");
   progressBarArrowImage.src = progressBarArrowImage.src.replace("trans", "black");

   var progressBarText = this.document.getElementById(wizardStep + "ImageText");
   progressBarText.style.fontWeight = "bold";
}

/**
 * implementation of TabBar listener...
 **/
AbstractReiUiController.prototype.tabWasSelected = function(aTabBarIt)
{
   if (aTabBarIt.tabBar == this.tabBar)
   {
      //--- clicking on current tab does nothing...
      if (this.getStageName() == aTabBarIt.id)
         return;

      if ("params" == aTabBarIt.id)
      {
         this.jumpTo("params");
      }
      else if ("outputs" == aTabBarIt.id)
      {
         this.jumpTo("outputs");
      }
      else if ("destinations" == aTabBarIt.id)
      {
         this.jumpTo("destinations");
      }
      else if ("filters" == aTabBarIt.id)
      {
         this.jumpTo("filters");
      }
      else if ("sorts" == aTabBarIt.id)
      {
         this.jumpTo("sorts");
      }
      else if ("content" == aTabBarIt.id)
      {
         this.jumpTo("content");
      }
      else
      {
         alert(applicationResources.getPropertyWithParameters("profileWizard.uiController.unknownTabClick", new Array(aTabBarIt.name)));
      }
   }
};



/**
* hook for derived classes to do something when form submission is
* imminent...
**/
AbstractReiUiController.prototype.willSubmit = function()
{

};

AbstractReiUiController.prototype.beginPleaseWaitDiv = function(aMessage)
{
   if (is_ie)
   {
      var hideDoc = (this.getStageName() == "params" ? this.document.getElementById("promptIframe").contentWindow.document : this.document);
      JsUtil.hideAllSelects(hideDoc);
   }


   this.pleaseWaitDiv = new PleaseWaitDiv("contentContainer", aMessage);
   this.pleaseWaitDiv.begin();
}

AbstractReiUiController.prototype.endPleaseWaitDiv = function(aMessage)
{
   if (is_ie)
   {
      var hideDoc = (this.getStageName() == "params" ? this.document.getElementById("promptIframe").contentWindow.document : this.document);
      JsUtil.restoreHiddenSelects(hideDoc);
   }

   this.pleaseWaitDiv.end();
}

AbstractReiUiController.prototype.disableNext = function()
{
   this.document.getElementById("nextButton").disabled = true;
}

AbstractReiUiController.prototype.disablePrevious = function()
{
   this.document.getElementById("previousButton").disabled = true;
}



/**
 * called when the window is resized.
 **/
AbstractReiUiController.prototype.onReiDialogResize = function()
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
};


AbstractReiUiController.prototype.addRerToWatchlist = function(aRerId)
{
   JsUtil.createCookie( "newRerWatchId" + aRerId, aRerId );
}

AbstractReiUiController.prototype.closeWindowAfterWait = function()
{
   window.setTimeout("window.close();", 4000);
}
