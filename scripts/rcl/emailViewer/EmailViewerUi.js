function EmailViewerUiController(aDocument)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);
   }
}

EmailViewerUiController.prototype = new AbstractUiController();
EmailViewerUiController.prototype.constructor = EmailViewerUiController;
EmailViewerUiController.superclass = AbstractUiController.prototype;


/**
 * initialize the ui...
 **/
EmailViewerUiController.prototype.initUi = function()
{
   var emailPdf = document.getElementById('emailPdf');
   var emailXls = document.getElementById('emailXls');
   var emailXls2007 = document.getElementById('emailXls2007');
   var emailXml = document.getElementById('emailXml');
   var emailCsv = document.getElementById('emailCsv');

   emailPdf.disabled = !this.document.forms[0].pdfEnabled.checked;
   emailXls.disabled = !this.document.forms[0].xlsEnabled.checked;
   emailXls2007.disabled = !this.document.forms[0].xls2007Enabled.checked;
   emailXml.disabled = !this.document.forms[0].xmlEnabled.checked;
   emailCsv.disabled = !this.document.forms[0].csvEnabled.checked;

   this.document.forms[0].pdfEnabled.checked = false;
   this.document.forms[0].xlsEnabled.checked = false;
   this.document.forms[0].xls2007Enabled.checked = false;
   this.document.forms[0].xmlEnabled.checked = false;
   this.document.forms[0].csvEnabled.checked = false;

   if (this.document.forms[0].rerIds == null || this.document.forms[0].rerIds.length == 0)
   {
      document.getElementById('reportName').style.color = 'red';
      document.getElementById('emailTo').disabled = true;
      document.getElementById('emailCc').disabled = true;
      document.getElementById('emailBcc').disabled = true;
      document.getElementById('emailSubject').disabled = true;
      document.getElementById('emailBody').disabled = true;
      document.getElementById('emailButton').disabled = true;
   }
};

EmailViewerUiController.prototype.emailButton = function()
{
   var submit = this.checkFields();

   if (submit == true)
   {
      document.forms[0].submit();
   }
}

EmailViewerUiController.prototype.cancelButton = function()
{
   window.close();
}

EmailViewerUiController.prototype.checkFields = function()
{
   var errorMessage = "";
   document.getElementById('validationMessage').innerHTML = "";

   if (this.document.forms[0].pdfEnabled.checked == false &&
         this.document.forms[0].xlsEnabled.checked == false &&
         this.document.forms[0].xls2007Enabled.checked == false &&
         this.document.forms[0].xmlEnabled.checked == false &&
         this.document.forms[0].csvEnabled.checked == false)
   {
      errorMessage += applicationResources.getProperty("emailViewer.error.chooseOutputFormat")+"<br/>"
   }

   if (this.document.forms[0].toList.value == "" &&
         this.document.forms[0].ccList.value == "" &&
         this.document.forms[0].bccList.value == "")
   {
      errorMessage += applicationResources.getProperty("emailViewer.error.chooseRecipient")+"<br/>"
   }

   if (errorMessage != "")
   {
      errorMessage = errorMessage;
      document.getElementById('validationMessage').innerHTML += errorMessage;
      return false;
   }

   return true;
}