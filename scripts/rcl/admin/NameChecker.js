/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: NameChecker.js 2911 2006-07-30 22:12:15Z lhankins $

//-----------------------------------------------------------------------------
/**
 * This object performs/holds the results of a name check on a report, report profile, or content folder
 *
 *
 * @constructor
 * @class
 * @author Scott Allman (sallman@seekfocus.com)
 **/

function NameChecker( )
{
   this.checkSucceeded = false;
   this.errMsg = applicationResources.getProperty("admin.nameChecker.errMsg");
}


NameChecker.prototype.isNameUnique = function()
{
   return this.checkSucceeded;
};

NameChecker.prototype.getErrMsg = function()
{
   return this.errMsg;
};

NameChecker.prototype.checkNameExists = function( actionPath, args )
{
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   xmlHttpRequest.open( "POST", actionPath, false );

   xmlHttpRequest.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded; charset=UTF-8'
          );

   xmlHttpRequest.send( args );

   try
   {
      eval(xmlHttpRequest.responseText);

      this.checkSucceeded = !nameExists;
      this.errMsg = errMsg;
      
      return nameExists;
   }
   catch (e)
   {
      var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
      var writeString = xmlHttpRequest.responseText;
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
};