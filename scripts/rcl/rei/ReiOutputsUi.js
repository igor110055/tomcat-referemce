//-----------------------------------------------------------------------------
/**
 * Parameters UI Model
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiOutputsUiModel(aRei, anEmailDestinationId, aHasCustomPrompt)
{
   if (arguments.length > 0)
   {
      AbstractReiUiModel.prototype.constructor.call(this, aRei, aHasCustomPrompt);
      this.emailDestinationId = anEmailDestinationId;
   }
}

ReiOutputsUiModel.prototype = new AbstractReiUiModel();
ReiOutputsUiModel.prototype.constructor = ReiOutputsUiModel;
ReiOutputsUiModel.superclass = AbstractReiUiModel.prototype;


//-----------------------------------------------------------------------------
/**
 * Parameters UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiOutputsUiController(aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractReiUiController.prototype.constructor.call(this, aDocument, aModel);
   }
}

ReiOutputsUiController.prototype = new AbstractReiUiController();
ReiOutputsUiController.prototype.constructor = ReiOutputsUiController;
ReiOutputsUiController.superclass = AbstractReiUiController.prototype;


/**
 * initialize the ui...
 **/
ReiOutputsUiController.prototype.initUi = function()
{
   ReiOutputsUiController.superclass.initUi.call(this);

   this.setStageTitle(applicationResources.getProperty("profileWizard.stageTitle.outputPreferences"));

   if (!this.model.hasCustomPrompt) this.disablePrevious();

   this.populateDefaultOutputsSpan();

   this.document.forms[0].pdfEnabled.checked = this.model.rei.outputPreferenceSet.getPdfPref().isEnabled;
   this.document.forms[0].htmlEnabled.checked = this.model.rei.outputPreferenceSet.getHtmlPref().isEnabled;
   this.document.forms[0].xlsEnabled.checked = this.model.rei.outputPreferenceSet.getXlsPref().isEnabled;
   this.document.forms[0].xls2007Enabled.checked = this.model.rei.outputPreferenceSet.getXls2007Pref().isEnabled;
   this.document.forms[0].csvEnabled.checked = this.model.rei.outputPreferenceSet.getCsvPref().isEnabled;
   this.document.forms[0].xmlEnabled.checked = this.model.rei.outputPreferenceSet.getXmlPref().isEnabled;

   document.getElementById("overrideDefaultOutputs").checked = (
           this.model.rei.outputPreferenceSet.getPdfPref().isEnabled ||
           this.model.rei.outputPreferenceSet.getHtmlPref().isEnabled ||
           this.model.rei.outputPreferenceSet.getXlsPref().isEnabled ||
           this.model.rei.outputPreferenceSet.getXls2007Pref().isEnabled ||
           this.model.rei.outputPreferenceSet.getCsvPref().isEnabled ||
           this.model.rei.outputPreferenceSet.getXmlPref().isEnabled );

   if (ServerEnvironment.betaFeaturesEnabled)
   {
      if (this.model.rei.rerFolderPath == "public")
      {
         this.document.getElementById("rerPublicFolder").checked = true;
      }
      else
      {
         this.document.getElementById("rerPrivateFolder").checked = true;
      }
   }
   
   this.document.forms[0].numberOfDaysUntilOuputExpiration.value = this.model.rei.outputExpirationDays;
   this.document.forms[0].launchPreference.value = this.model.rei.launchPreference;
   this.document.forms[0].maxExecutionTime.value = this.model.rei.maxExecutionTime;
   //only show the burst option if it is available for the specific report
   var canBurst = this.document.forms[0].canBurst.value;
   if(canBurst == "true")
      this.document.forms[0].isBurst.checked = this.model.rei.isBurst;
   //added so that the maxExecution time input box would be blank instead of showing null
   if(this.document.forms[0].maxExecutionTime.value=='null')
   {
      this.document.forms[0].maxExecutionTime.value = '';
   }

// LWH: commenting out due to #1433 and #1455 (until we can come up with a better solution to this).

//   this.document.forms[0].packageOverride.value = this.model.rei.packageOverride;
//   if(this.document.forms[0].packageOverride.value=='null')
//   {
//      this.document.forms[0].packageOverride.value = '';
//   }
   this.overrideDefaultOutputs();
   this.initKeyHandler();
};

ReiOutputsUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReiKeyHandler(this);
};

ReiOutputsUiController.prototype.getStageName = function()
{
   return "outputs";
}

        
/**
 * hook for derived classes to do something (e.g. client side validation)
 * before submitting.  If the method returns false, the submit will be
 * cancelled.
 **/
ReiOutputsUiController.prototype.beforeSubmit = function()
{
   if((this.document.forms[0].maxExecutionTime.value.length==0) || this.document.forms[0].maxExecutionTime.value == "null")
   {
      this.document.forms[0].maxExecutionTime.value = "null";
      return true;
   }
   else if((!JsUtil.isInteger(this.document.forms[0].maxExecutionTime.value)))
   {
      alert("Please enter a correct formated number for Max Execution Time"
                 +"\nIf you want to have no Max Execution Time enter 0")
      return false;
   }
   else
   {
      return true;
   }

}

/**
 * hook for derived classes to do something when form submission is
 * imminent...
 **/
ReiOutputsUiController.prototype.willSubmit = function()
{
   var overrideDefaults = document.getElementById("overrideDefaultOutputs").checked;
   if (!overrideDefaults)
   {
      this.document.forms[0].pdfEnabled.checked = false;
      this.document.forms[0].htmlEnabled.checked = false;
      this.document.forms[0].xlsEnabled.checked = false;
      this.document.forms[0].xls2007Enabled.checked = false;
      this.document.forms[0].csvEnabled.checked = false;
      this.document.forms[0].xmlEnabled.checked = false;
   }

   this.model.rei.outputPreferenceSet.getPdfPref().isEnabled = this.document.forms[0].pdfEnabled.checked;
   this.model.rei.outputPreferenceSet.getHtmlPref().isEnabled = this.document.forms[0].htmlEnabled.checked;
   this.model.rei.outputPreferenceSet.getXlsPref().isEnabled = this.document.forms[0].xlsEnabled.checked;
   this.model.rei.outputPreferenceSet.getXls2007Pref().isEnabled = this.document.forms[0].xls2007Enabled.checked;
   this.model.rei.outputPreferenceSet.getCsvPref().isEnabled = this.document.forms[0].csvEnabled.checked;
   this.model.rei.outputPreferenceSet.getXmlPref().isEnabled = this.document.forms[0].xmlEnabled.checked;

   if (ServerEnvironment.betaFeaturesEnabled)
   {
      if (this.document.getElementById("rerPublicFolder").checked == true)
      {
         this.model.rei.rerFolderPath = "public";
      }
      else
      {
         this.model.rei.rerFolderPath = "private";
      }
   }

   this.model.rei.outputExpirationDays = this.document.forms[0].numberOfDaysUntilOuputExpiration.value;
   this.model.rei.launchPreference = this.document.forms[0].launchPreference.value;
   this.model.rei.maxExecutionTime = this.document.forms[0].maxExecutionTime.value;


   var canBurst = this.document.forms[0].canBurst.value;
   if(canBurst == "true")
   {
      var isBurst = this.document.forms[0].isBurst;
      this.model.rei.isBurst = isBurst.checked;
   }
   
// LWH: commenting out due to #1433 and #1455 (until we can come up with a better solution to this).

//   this.model.rei.packageOverride = (this.document.forms[0].packageOverride.value != null && this.document.forms[0].packageOverride.value != '' ? this.document.forms[0].packageOverride.value : null);
//   if (this.document.forms[0].signonSearchPath.value != null && this.document.forms[0].signonSearchPath.value != '' && this.document.forms[0].signonSearchPath.value != "Default")
//   {
//      var dsQualifier = new DataSourceQualifier(JsUtil.escapeQuotations(this.document.forms[0].signonSearchPath.value));
//      this.model.rei.dataSourceSet.clear();
//      this.model.rei.dataSourceSet.addDataSourceQualifier(dsQualifier);
//   }


   this.document.forms[0].reiXml.value = this.model.rei.toXml();
}

ReiOutputsUiController.prototype.populateDefaultOutputsSpan = function()
{
   var defaultOutputsSpan = document.getElementById("defaultOutputsSpan");
   var defaultOutputsString = "";

   if (this.model.rei.defaultOutputPreferenceSet.getPdfPref().isEnabled)
   {
      defaultOutputsString += applicationResources.getProperty("profileWizard.outputs.pdf") + " ";
   }
   if (this.model.rei.defaultOutputPreferenceSet.getHtmlPref().isEnabled)
   {
      defaultOutputsString += applicationResources.getProperty("profileWizard.outputs.html") + " ";
   }
   if (this.model.rei.defaultOutputPreferenceSet.getXlsPref().isEnabled)
   {
      defaultOutputsString += applicationResources.getProperty("profileWizard.outputs.xls") + " ";
   }
   if (this.model.rei.defaultOutputPreferenceSet.getXls2007Pref().isEnabled)
   {
      defaultOutputsString += applicationResources.getProperty("profileWizard.outputs.xls.2007") + " ";
   }
   if (this.model.rei.defaultOutputPreferenceSet.getCsvPref().isEnabled)
   {
      defaultOutputsString += applicationResources.getProperty("profileWizard.outputs.csv") + " ";
   }
   if (this.model.rei.defaultOutputPreferenceSet.getXmlPref().isEnabled)
   {
      defaultOutputsString += applicationResources.getProperty("profileWizard.outputs.xml") + " ";
   }

   defaultOutputsSpan.innerHTML = defaultOutputsString;
}

ReiOutputsUiController.prototype.overrideDefaultOutputs = function()
{
   var overrideDefaults = document.getElementById("overrideDefaultOutputs").checked;
   this.document.forms[0].pdfEnabled.disabled = !overrideDefaults;
   this.document.forms[0].htmlEnabled.disabled = !overrideDefaults;
   this.document.forms[0].xlsEnabled.disabled = !overrideDefaults;
   this.document.forms[0].xls2007Enabled.disabled = !overrideDefaults;
   this.document.forms[0].csvEnabled.disabled = !overrideDefaults;
   this.document.forms[0].xmlEnabled.disabled = !overrideDefaults;
}

ReiOutputsUiController.prototype.previousButton = function()
{
   this.jumpTo('params');
};

ReiOutputsUiController.prototype.nextButton = function()
{
   this.jumpTo('destinations');
};
