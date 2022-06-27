//-----------------------------------------------------------------------------
/**
 * Abstract base class for the scheduler wizard screen UiModel
 *
 * @constructor
 * @author Roger Moore
 **/
function AbstractSchedulerUiModel ()
{

}



//-----------------------------------------------------------------------------
/**
 * Abstract base class for the scheduler wizard screen UiControllers
 *
 * @constructor
 * @author Lance Hankins
 **/
function AbstractSchedulerUiController (aDocument, aModel, aPleaseWaitDiv)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);

      this.model = aModel;
      this.pleaseWaitDiv = aPleaseWaitDiv;
      this.startPleaseWaitDiv();
   }
}

AbstractSchedulerUiController.prototype = new AbstractUiController();
AbstractSchedulerUiController.prototype.constructor = AbstractSchedulerUiController;
AbstractSchedulerUiController.superclass = AbstractUiController.prototype;

AbstractSchedulerUiController.prototype.startPleaseWaitDiv = function ()
{
}

AbstractSchedulerUiController.prototype.endPleaseWaitDiv = function ()
{
   this.pleaseWaitDiv.end();
}

/**
* initialize the ui...
**/
AbstractSchedulerUiController.prototype.initUi = function()
{
};

AbstractSchedulerUiController.prototype.buttonClicked = function(anIt)
{
   switch(anIt.id) {
   case "save":
      this.save();
      break;
   case "cancel":
      this.cancel();
      break;
   }
};




AbstractSchedulerUiController.prototype.setViewGesture = function(aGesture)
{
   this.document.forms[0].viewGesture.value = aGesture;
};

AbstractSchedulerUiController.prototype.jumpTo = function(aStage)
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
AbstractSchedulerUiController.prototype.doSubmit = function(aStage)
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
* hook for derived classes to do something (e.g. client side validation)
* before submitting.  If the method returns false, the submit will be
* cancelled.
**/
AbstractSchedulerUiController.prototype.beforeSubmit = function()
{
  return true;
};


/**
* save button pressed...
**/
AbstractSchedulerUiController.prototype.save = function()
{
   if (this.beforeSubmit())
   {
      this.beginPleaseWaitDiv(applicationResources.getProperty("profileWizard.saving"));
      this.setViewGesture("save");
      this.doSubmit();
   }
};



/**
* cancel button pressed...
**/
AbstractSchedulerUiController.prototype.cancel = function()
{
   window.close();
};


AbstractSchedulerUiController.prototype.onFinishActionChanged = function()
{
  /*
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
   */
};

AbstractSchedulerUiController.prototype.setStageTitle = function(aStageName)
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
AbstractSchedulerUiController.prototype.tabWasSelected = function(aTabBarIt)
{
   if (aTabBarIt.tabBar == this.tabBar)
   {
      //--- clicking on current tab does nothing...
      if (this.getStageName() == aTabBarIt.id)
         return;

      if ("type" == aTabBarIt.id)
      {
         this.jumpTo("type");
      }
      else if ("timing" == aTabBarIt.id)
      {
         this.jumpTo("timing");
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
AbstractSchedulerUiController.prototype.willSubmit = function()
{

};

AbstractSchedulerUiController.prototype.beginPleaseWaitDiv = function(aMessage)
{
   if (is_ie)
   {
      var hideDoc = this.document;
      JsUtil.hideAllSelects(hideDoc);
   }


   this.pleaseWaitDiv = new PleaseWaitDiv("contentContainer", aMessage);
   this.pleaseWaitDiv.begin();
}

AbstractSchedulerUiController.prototype.endPleaseWaitDiv = function(aMessage)
{
   if (is_ie)
   {
      var hideDoc = this.document;
      JsUtil.restoreHiddenSelects(hideDoc);
   }

   this.pleaseWaitDiv.end();
}

AbstractSchedulerUiController.prototype.disableNext = function()
{
   this.document.getElementById("nextButton").disabled = true;
}

AbstractSchedulerUiController.prototype.disablePrevious = function()
{
   this.document.getElementById("previousButton").disabled = true;
}

AbstractSchedulerUiController.prototype.disableSave = function()
{
   this.document.getElementById("saveButton").disabled = true;
}

AbstractSchedulerUiController.prototype.enableSave = function()
{
   this.document.getElementById("saveButton").disabled = true;
}




/**
 * called when the window is resized.
 **/
AbstractSchedulerUiController.prototype.onSchedulerDialogResize = function()
{
   //alert("onSchedulerDialogResize");
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

   var div = $('schedulerCenterContent');
   div.style.height = newHeight + "px";
   div.style.width = newWidth + "px";
};

