/**
 * ReportOutputDestination in JS
 *
 * @constructor
 */
function ReportOutputDestination(anId, aName, aDeliveryAgent, aDeliveryTypeEnum)
{
   this.id = anId;
   this.name = aName;
   this.deliveryAgent = aDeliveryAgent;
   this.deliveryTypeEnum = aDeliveryTypeEnum;

   //These properties represent UI selections, after Destinations have been added to the profile's list
   this.outputsZipped = false;
   this.outputPreferences = [];
   this.deliveryPropertyMap = new Object();
}


//-----------------------------------------------------------------------------
/**
 * Parameters UI Model
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiDestinationsUiModel(aRei, anEmailDestinationId, aHasCustomPrompt, anAvailableDestinationsList)
{
   if (arguments.length > 0)
   {
      AbstractReiUiModel.prototype.constructor.call(this, aRei, aHasCustomPrompt);
      this.emailDestinationId = anEmailDestinationId;
      this.availableDestinations = anAvailableDestinationsList;
   }
}

ReiDestinationsUiModel.prototype = new AbstractReiUiModel();
ReiDestinationsUiModel.prototype.constructor = ReiDestinationsUiModel;
ReiDestinationsUiModel.superclass = AbstractReiUiModel.prototype;


//-----------------------------------------------------------------------------
/**
 * Parameters UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReiDestinationsUiController(aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractReiUiController.prototype.constructor.call(this, aDocument, aModel);
   }
}

ReiDestinationsUiController.prototype = new AbstractReiUiController();
ReiDestinationsUiController.prototype.constructor = ReiDestinationsUiController;
ReiDestinationsUiController.superclass = AbstractReiUiController.prototype;


/**
 * initialize the ui...
 **/
ReiDestinationsUiController.prototype.initUi = function()
{
   ReiDestinationsUiController.superclass.initUi.call(this);

   this.setStageTitle(applicationResources.getProperty("profileWizard.stageTitle.deliveryPreferences"));

   this.availableDestinationList = new JsListBox("availableDestinationsSelect", "availableDestinationsSelect",
           this.model.availableDestinations, new ExtraPropertyFieldExtractor("id", "name", "deliveryAgent"));

   this.addedDestinationList = new JsListBox("addedDestinationsSelect",
           "addedDestinationsSelect", new Object(), new ExtraPropertyFieldExtractor("id", "name", "deliveryAgent"));

   this.availableDestinationList.refreshView();
   this.addedDestinationList.refreshView();

   this.initializeSavedDeliveryPreferences();
//   if (this.model.rei.deliveryPreferenceSet.getEmailPref() != null)
//   {
//      this.document.forms[0].emailEnabled.checked = this.model.rei.deliveryPreferenceSet.getEmailPref().isEnabled;

  /*    this.document.forms[0].emailSendTo.value = this.model.rei.deliveryPreferenceSet.getEmailPref().toList;
      this.document.forms[0].emailCcTo.value = this.model.rei.deliveryPreferenceSet.getEmailPref().ccList;
      this.document.forms[0].emailBccTo.value = this.model.rei.deliveryPreferenceSet.getEmailPref().bccList;
      this.document.forms[0].emailSubject.value = this.model.rei.deliveryPreferenceSet.getEmailPref().subject;
      this.document.forms[0].emailBody.value = this.model.rei.deliveryPreferenceSet.getEmailPref().body;

      this.document.forms[0].emailPdfEnabled.checked = this.model.rei.deliveryPreferenceSet.getEmailPref().isOutputReferenceEnabled(OutputFormatEnum.PDF);
      this.document.forms[0].emailXlsEnabled.checked = this.model.rei.deliveryPreferenceSet.getEmailPref().isOutputReferenceEnabled(OutputFormatEnum.singleXLS);
      this.document.forms[0].emailXmlEnabled.checked = this.model.rei.deliveryPreferenceSet.getEmailPref().isOutputReferenceEnabled(OutputFormatEnum.XML);
      this.document.forms[0].emailCsvEnabled.checked = this.model.rei.deliveryPreferenceSet.getEmailPref().isOutputReferenceEnabled(OutputFormatEnum.CSV);

      this.document.forms[0].zipEnabled.checked = this.model.rei.deliveryPreferenceSet.getEmailPref().zip;*/
//   }

   this.emailEnableSwitch();
   this.initKeyHandler();
};

ReiDestinationsUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReiKeyHandler(this);
};

ReiDestinationsUiController.prototype.initializeSavedDeliveryPreferences = function()
{
   var deliveryPrefs = this.model.rei.deliveryPreferenceSet.prefs;
   var destinationIds = [];

   for (var i = 0; i < deliveryPrefs.length; i++)
   {
      var destArr = [];
      destArr.push(deliveryPrefs[i].destinationId);
      this.availableDestinationList.selectItemsFromValues(destArr);
      var selected = this.availableDestinationList.getSelectedItems();

      if (selected.length > 0)
      {
         var destination = selected[0].srcObject;

         destination.outputPreferences = deliveryPrefs[i].outputReferences;

         if (destination.deliveryTypeEnum == DeliveryTypeEnum.EMAIL)
         {
            this.initializeFromSavedEmailProperties(destination, deliveryPrefs[i]);

            destination.outputsZipped = deliveryPrefs[i].zip;
         }
         if (destination.deliveryTypeEnum == DeliveryTypeEnum.FILE_TRANSFER)
         {
            destination.outputsZipped = deliveryPrefs[i].zip;
         }

         this.availableDestinationList.deselectAll();
      }

      destinationIds.push(deliveryPrefs[i].destinationId);
   }

   this.availableDestinationList.selectItemsFromValues(destinationIds);
   this.addDestination();
};

ReiDestinationsUiController.prototype.initializeFromSavedEmailProperties = function(aDestination, aDeliveryPreference)
{
   aDestination.deliveryPropertyMap['isEnabled'] = true;
   aDestination.deliveryPropertyMap['toList'] = aDeliveryPreference.toList;
   aDestination.deliveryPropertyMap['ccList'] = aDeliveryPreference.ccList;
   aDestination.deliveryPropertyMap['bccList'] = aDeliveryPreference.bccList;
   aDestination.deliveryPropertyMap['subject'] = aDeliveryPreference.subject;
   aDestination.deliveryPropertyMap['body'] = aDeliveryPreference.body;
};

ReiDestinationsUiController.prototype.removeDestination = function()
{
   this.addedDestinationList.moveSelectedToOtherList(this.availableDestinationList);
   this.addedDestinationList.refreshView();
   this.availableDestinationList.refreshView();

   this.hideDestinationOptions();
};

ReiDestinationsUiController.prototype.addDestination = function()
{
   this.availableDestinationList.moveSelectedToOtherList(this.addedDestinationList);
   this.addedDestinationList.refreshView();
   this.availableDestinationList.refreshView();
};

ReiDestinationsUiController.prototype.toggleDestinationOptions = function()
{
   var selectedDestinationItems = this.addedDestinationList.getSelectedItems();

   if (selectedDestinationItems.length == 1)
   {
      var selectedDest = selectedDestinationItems[0].srcObject;

      if (selectedDest.deliveryTypeEnum == DeliveryTypeEnum.EMAIL)
      {
         $("emailDeliveryOptions").style.display = "";
         //todo reselect email options
         this.reselectEmailOptions(selectedDest);
      }
      else
      {
         $("emailDeliveryOptions").style.display = "none";
      }

      $("outputOptionsDiv").style.display = "";
      $("saveButtonField").style.display = "";
//      $("errorField").style.display = "none";

      this.reselectOutputs(selectedDest);

      $("saveButton").disabled = false;
   }
};
ReiDestinationsUiController.prototype.reselectEmailOptions = function(aSelectedDest)
{
   this.document.forms[0].emailSendTo.value = "";

   var toList = aSelectedDest.deliveryPropertyMap['toList'];
   var ccList = aSelectedDest.deliveryPropertyMap['ccList'];
   var bccList = aSelectedDest.deliveryPropertyMap['bccList'];

   if (toList != null)
   {
      for (var i = 0; i < toList.length; ++i)
      {
         this.document.forms[0].emailSendTo.value += toList[i];

         if (i != (toList.length - 1))
         {
            this.document.forms[0].emailSendTo.value += ', ';
         }
      }
   }

   if (ccList != null)
   {
      for (var i = 0; i < ccList.length; ++i)
      {
         this.document.forms[0].emailCcTo.value += ccList[i];

         if (i != (ccList.length - 1))
         {
            this.document.forms[0].emailCcTo.value += ', ';
         }
      }
   }

   if (bccList != null)
   {
      for (var i = 0; i < bccList.length; ++i)
      {
         this.document.forms[0].emailBccTo.value += bccList[i];

         if (i != (bccList.length - 1))
         {
            this.document.forms[0].emailBccTo.value += ', ';
         }
      }
   }

   if (aSelectedDest.deliveryPropertyMap['subject'] != null)
   {
      this.document.forms[0].emailSubject.value = aSelectedDest.deliveryPropertyMap['subject'];
   }
   if (aSelectedDest.deliveryPropertyMap['body'] != null)
   {
      this.document.forms[0].emailBody.value = aSelectedDest.deliveryPropertyMap['body'];
   }

};

ReiDestinationsUiController.prototype.reselectOutputs = function(aSelectedDest)
{
   this.refreshOutputSelections();

   for (var i = 0; i < aSelectedDest.outputPreferences.length; i++)
   {
      var type = aSelectedDest.outputPreferences[i];

      if (type == OutputFormatEnum.PDF)
      {
         this.document.forms[0].emailPdfEnabled.checked = true;
      }
      else if (type == OutputFormatEnum.singleXLS)
      {
         this.document.forms[0].emailXlsEnabled.checked = true;
      }
      else if (type == OutputFormatEnum.spreadsheetML)
      {
         this.document.forms[0].emailXls2007Enabled.checked = true;
      }
      else if (type == OutputFormatEnum.XML)
      {
         this.document.forms[0].emailXmlEnabled.checked = true;
      }
      else if (type == OutputFormatEnum.CSV)
      {
         this.document.forms[0].emailCsvEnabled.checked = true;
      }
   }

   this.document.forms[0].zipEnabled.checked = aSelectedDest.outputsZipped;
};

ReiDestinationsUiController.prototype.saveCurrentDestinationOptions = function()
{
   var selectedDestinationItems = this.addedDestinationList.getSelectedItems();
   var selectedDestination = selectedDestinationItems[0].srcObject;

   this.saveDestinationOptions(selectedDestination);
   this.saveOutputReferences(selectedDestination);

   if (this.validateDestination(selectedDestination))
   {
      this.refreshOutputSelections();
      this.hideDestinationOptions();
   }
};

ReiDestinationsUiController.prototype.saveDestinationOptions = function(aSelectedDest)
{
   if(aSelectedDest.deliveryTypeEnum == DeliveryTypeEnum.EMAIL)
   {
      var isEnabled = true;
      var toList = this.document.forms[0].emailSendTo.value.split(",");
      var ccList = this.document.forms[0].emailCcTo.value.split(",");
      var bccList = this.document.forms[0].emailBccTo.value.split(",");
      var subject = this.document.forms[0].emailSubject.value;
      var body = this.document.forms[0].emailBody.value;

      aSelectedDest.deliveryPropertyMap['isEnabled'] = isEnabled;
      aSelectedDest.deliveryPropertyMap['toList'] = toList;
      aSelectedDest.deliveryPropertyMap['ccList'] = ccList;
      aSelectedDest.deliveryPropertyMap['bccList'] = bccList;
      aSelectedDest.deliveryPropertyMap['subject'] = subject;
      aSelectedDest.deliveryPropertyMap['body'] = body;

      //TODO refresh email optoins
   }
};

ReiDestinationsUiController.prototype.saveOutputReferences = function(aSelectedDest)
{
    aSelectedDest.outputPreferences.clear();

    if (this.document.forms[0].emailPdfEnabled.checked)
    {
        aSelectedDest.outputPreferences.push(OutputFormatEnum.PDF);
    }
    if (this.document.forms[0].emailXlsEnabled.checked)
    {
        aSelectedDest.outputPreferences.push(OutputFormatEnum.singleXLS);
    }
    if (this.document.forms[0].emailXls2007Enabled.checked)
    {
        aSelectedDest.outputPreferences.push(OutputFormatEnum.spreadsheetML);
    }
    if (this.document.forms[0].emailXmlEnabled.checked)
    {
        aSelectedDest.outputPreferences.push(OutputFormatEnum.XML);
    }
    if (this.document.forms[0].emailCsvEnabled.checked)
    {
        aSelectedDest.outputPreferences.push(OutputFormatEnum.CSV);
    }

    if (this.document.forms[0].zipEnabled.checked)
    {
        aSelectedDest.outputsZipped = true;
    }
};

ReiDestinationsUiController.prototype.refreshOutputSelections = function()
{
    this.document.forms[0].emailPdfEnabled.checked = false;
    this.document.forms[0].emailXlsEnabled.checked = false;
    this.document.forms[0].emailXls2007Enabled.checked = false;
    this.document.forms[0].emailXmlEnabled.checked = false;
    this.document.forms[0].emailCsvEnabled.checked = false;

    this.document.forms[0].zipEnabled.checked = false;
};

ReiDestinationsUiController.prototype.displayCurrentDestinationOptions = function()
{
   var selectedDestinationItems = this.addedDestinationList.getSelectedItems();
   var selectedDestination = selectedDestinationItems[0].srcObject;

   var text = "Id:" + selectedDestination.id  +  "\n" +
//           "Name:" + selectedDestination.id  +  "\n" +
//           "agent:" + selectedDestination.id  +  "\n" +
//           "enum:" + selectedDestination.id  +  "\n" +
           "output:" + selectedDestination.outputPreferences.length  +  "\n" +
           "prop:" + selectedDestination.id  +  "\n";

   alert(text);
};

ReiDestinationsUiController.prototype.hideDestinationOptions = function()
{
    $("emailDeliveryOptions").style.display = "none";
    $("outputOptionsDiv").style.display = "none";
    $("saveButtonField").style.display = "none";
//    $("errorField").style.display = "none";

};

ReiDestinationsUiController.prototype.validateDestination = function(aDestination)
{
   var reportDestination = aDestination;
   var validation = true;

   if(reportDestination.deliveryTypeEnum == DeliveryTypeEnum.EMAIL)
   {
      var properties = reportDestination.deliveryPropertyMap;

      if(properties['toList'] == null || properties['toList'].length == 0 || (properties['toList'].length == 1 && properties['toList'][0] == ""))
      {
         document.getElementById("emailToError").style.display = "";
         validation = false;
      }
      else
      {
         document.getElementById("emailToError").style.display = "none";
      }
   }

   if(reportDestination.outputPreferences.length == 0)
   {
      document.getElementById("emailOutputError").style.display = "";
      validation = false;
   }
   else
   {
      document.getElementById("emailOutputError").style.display = "none";
   }

   return validation;
};

/*ReiDestinationsUiController.prototype.displayValues = function()
{
   var selectedDestinationItems = this.availableDestinationList.getSelectedItems();

   if (selectedDestinationItems.length == 1)
   {
      var selectedDest = selectedDestinationItems[0];
       alert(selectedDest.value);

   }
}*/

/**
 * hook for derived classes to do something (e.g. client side validation)
 * before submitting.  If the method returns false, the submit will be
 * cancelled.
 **/
ReiDestinationsUiController.prototype.beforeSubmit = function()
{
   var validation = true;
   var validationText = "";
   var addedDestinations = this.addedDestinationList.getAllItems();

   for (var i = 0; i < addedDestinations.length; i++)
   {
      var reportDestination = addedDestinations[i].srcObject;


      if(reportDestination.deliveryTypeEnum == DeliveryTypeEnum.EMAIL)
      {
         var properties = reportDestination.deliveryPropertyMap;

           if(properties['toList'] == null || properties['toList'].length == 0 || (properties['toList'].length == 1 && properties['toList'][0] == ""))
          {
//            alert('email to list for ' + reportDestination.name);
            validationText += "<div style='color:red;'> No 'TO' field addresses for destination:  " + reportDestination.name + ".</div>\n";
            validation = false;
          }
      }

      if(reportDestination.outputPreferences.length == 0)
      {
         validationText += "<div style='color:red;'> No output options chosen for destination:  " + reportDestination.name + ".</div>\n";
         validation = false;
      }

   }

   if (!validation)
   {
      validationText = "<div>There was one or more problems with the selected destinations.  Please correct the following:  </div>" + validationText;
      $("errorField").style.display = "";
      $("errorDiv").innerHTML = validationText;
   }
   else
   {
      $("errorField").style.display = "none";
   }

   return validation;
};

/**
 * hook for derived classes to do something when form submission is
 * imminent...
 **/
ReiDestinationsUiController.prototype.willSubmit = function()
{
   this.model.rei.deliveryPreferenceSet.prefs.clear();

   var addedDestinations = this.addedDestinationList.getAllItems();

   for (var i = 0; i < addedDestinations.length; i++)
   {
      var aSelectedDest = addedDestinations[i].srcObject;
      var deliveryPref = null;

      if(aSelectedDest.deliveryTypeEnum == DeliveryTypeEnum.EMAIL)
      {
         var emailPref = new EmailDeliveryPreference(true);

         emailPref.destinationId = aSelectedDest.id;
         emailPref.isEnabled = aSelectedDest.deliveryPropertyMap['isEnabled'];
         emailPref.toList = aSelectedDest.deliveryPropertyMap['toList'];
         emailPref.ccList = aSelectedDest.deliveryPropertyMap['ccList'];
         emailPref.bccList = aSelectedDest.deliveryPropertyMap['bccList'];
         emailPref.subject = aSelectedDest.deliveryPropertyMap['subject'];
         emailPref.body = aSelectedDest.deliveryPropertyMap['body'];
         emailPref.zip = aSelectedDest.outputsZipped;

         this.model.rei.deliveryPreferenceSet.addDeliveryPreference(emailPref);

         deliveryPref = emailPref;
      }
      else if (aSelectedDest.deliveryTypeEnum == DeliveryTypeEnum.FILE_TRANSFER)
      {
         var fileTransferPref = new FileTransferDeliveryPreference(true, aSelectedDest.outputsZipped, aSelectedDest.id);
         deliveryPref = fileTransferPref;

         this.model.rei.deliveryPreferenceSet.addDeliveryPreference(fileTransferPref);
      }

      if (deliveryPref != null)
      {
         for (var j = 0; j < aSelectedDest.outputPreferences.length; j++)
         {
            var outputPreference = aSelectedDest.outputPreferences[j];
            deliveryPref.addOutputReference(outputPreference);
         }
      }
   }

   this.document.forms[0].reiXml.value = this.model.rei.toXml();

//   alert(this.model.rei.deliveryPreferenceSet.toXml())
};

ReiDestinationsUiController.prototype.emailEnableSwitch = function()
{
   var emailTo = document.getElementById('emailTo');
   var emailCc = document.getElementById('emailCc');
   var emailBcc = document.getElementById('emailBcc');
   var emailSubject = document.getElementById('emailSubject');
   var emailBody = document.getElementById('emailBody');
   var emailPdf = document.getElementById('emailPdf');
   var emailXls = document.getElementById('emailXls');
   var emailXls2007 = document.getElementById('emailXls2007');
   var emailXml = document.getElementById('emailXml');
   var emailCsv = document.getElementById('emailCsv');
   var emailZip = document.getElementById('emailZip');

   /*if (!this.document.forms[0].emailEnabled.checked)
   {
      emailTo.style.backgroundColor = 'gainsboro';
      emailCc.style.backgroundColor = 'gainsboro';
      emailBcc.style.backgroundColor = 'gainsboro';
      emailSubject.style.backgroundColor = 'gainsboro';
      emailBody.style.backgroundColor = 'gainsboro';
      emailTo.readOnly = true;
      emailCc.readOnly = true;
      emailBcc.readOnly = true;
      emailSubject.readOnly = true;
      emailBody.readOnly = true;

      emailPdf.disabled = true;
      emailXls.disabled = true;
      emailXml.disabled = true;
      emailCsv.disabled = true;
      emailZip.disabled = true;
   }
   else*/
//   {
      emailTo.style.backgroundColor = '';
      emailCc.style.backgroundColor = '';
      emailBcc.style.backgroundColor = '';
      emailSubject.style.backgroundColor = '';
      emailBody.style.backgroundColor = '';
      emailTo.readOnly = false;
      emailCc.readOnly = false;
      emailBcc.readOnly = false;
      emailSubject.readOnly = false;
      emailBody.readOnly = false;

      var defaultOutputPrefs = this.isDefaultOutputPreferences();
      if (defaultOutputPrefs)
      {
         emailPdf.disabled = !this.model.rei.defaultOutputPreferenceSet.getPdfPref().isEnabled;
         emailXls.disabled = !this.model.rei.defaultOutputPreferenceSet.getXlsPref().isEnabled;
         emailXls2007.disabled = !this.model.rei.defaultOutputPreferenceSet.getXls2007Pref().isEnabled;
         emailXml.disabled = !this.model.rei.defaultOutputPreferenceSet.getXmlPref().isEnabled;
         emailCsv.disabled = !this.model.rei.defaultOutputPreferenceSet.getCsvPref().isEnabled;
      }
      else
      {
         emailPdf.disabled = !this.model.rei.outputPreferenceSet.getPdfPref().isEnabled;
         emailXls.disabled = !this.model.rei.outputPreferenceSet.getXlsPref().isEnabled;
         emailXls2007.disabled = !this.model.rei.outputPreferenceSet.getXls2007Pref().isEnabled;
         emailXml.disabled = !this.model.rei.outputPreferenceSet.getXmlPref().isEnabled;
         emailCsv.disabled = !this.model.rei.outputPreferenceSet.getCsvPref().isEnabled;
      }

      if (emailPdf.disabled && emailXls.disabled && emailXls2007.disabled && emailXml.disabled && emailCsv.disabled)
      {
         emailZip.disabled = true;
      }
      else
      {
         emailZip.disabled = false;
      }

      if (emailPdf.disabled == true)
      {
         emailPdf.checked = false;
      }
      if (emailXls.disabled == true)
      {
         emailXls.checked = false;
      }
      if (emailXls2007.disabled == true)
      {
         emailXls2007.checked = false;
      }
      if (emailXml.disabled == true)
      {
         emailXml.checked = false;
      }
      if (emailCsv.disabled == true)
      {
         emailCsv.checked = false;
      }
//   }
};

ReiDestinationsUiController.prototype.isDefaultOutputPreferences = function ()
{
   return (!this.model.rei.outputPreferenceSet.getPdfPref().isEnabled &&
      !this.model.rei.outputPreferenceSet.getHtmlPref().isEnabled &&
      !this.model.rei.outputPreferenceSet.getXlsPref().isEnabled &&
      !this.model.rei.outputPreferenceSet.getXls2007Pref().isEnabled &&
      !this.model.rei.outputPreferenceSet.getCsvPref().isEnabled &&
      !this.model.rei.outputPreferenceSet.getXmlPref().isEnabled );
};


ReiDestinationsUiController.prototype.getStageName = function()
{
   return "destinations";
};

ReiDestinationsUiController.prototype.previousButton = function()
{
   this.jumpTo('outputs');
};

ReiDestinationsUiController.prototype.nextButton = function()
{
   this.jumpTo('filters');
};
