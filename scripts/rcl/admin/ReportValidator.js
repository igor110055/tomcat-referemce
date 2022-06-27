/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: $




//-----------------------------------------------------------------------------
/**
 * This class represents a single validation result
 *
 * @constructor
 * @class
 * @author Scott Allman (sallman@seekfocus.com)
 * @author Lance Hankins (lhankins@seekfocus.com)
 **/

function ReportValidationResult(aIsValid, aRawErrorXml, aLayoutErrors, aQuerySelectionErrors, aFilterErrors, aOtherErrors)
{
   this.isValid = aIsValid;
   this.rawErrorXml = aRawErrorXml;
   this.layoutErrors = aLayoutErrors;
   this.querySelectionErrors = aQuerySelectionErrors;
   this.filterErrors = aFilterErrors;
   this.otherErrors = aOtherErrors;
}



//-----------------------------------------------------------------------------
/**
 * This class supports ajax based validation of a report.
 *
 * @constructor
 * @class
 * @author Scott Allman (sallman@seekfocus.com)
 **/

function ReportValidator( )
{
   this.checkSucceeded = false;
   this.errMsg = applicationResources.getProperty("management.validation.defaultError");
}






ReportValidator.prototype.isReportValidated = function()
{
   return this.checkSucceeded;
};

ReportValidator.prototype.getErrMsg = function()
{
   return this.errMsg;
};

ReportValidator.prototype.isReportValid = function( actionPath, folderId, newNodeName, nodeId, reportXPath )
{
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   xmlHttpRequest.open( "POST", actionPath, false );

   xmlHttpRequest.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded; charset=UTF-8'
          );

   xmlHttpRequest.send(
           "reportXPath=" + escape(reportXPath) + "&folderId=" + escape(folderId) + "&newNodeName=" + newNodeName + "&nodeId=" + nodeId );

   try
   {
      var isValid = true;
      var reportErrorMsg = '';

      eval(xmlHttpRequest.responseText);

      this.checkSucceeded = isValid;
      this.errMsg = reportErrorMsg;

      return isValid;
   }
   catch (e)
   {
      var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
      var writeString = xmlHttpRequest.responseText;
      writeString = serverEnv + writeString;

      if (writeString.indexOf("<html>") == -1)
      {
         alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, xmlHttpRequest.responseText)));
      }
      else
      {
         window.document.write(writeString);
      }
   }
};