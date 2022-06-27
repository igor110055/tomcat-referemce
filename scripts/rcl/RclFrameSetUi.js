/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: RclFrameSetUi.js 4533 2007-07-26 19:34:05Z lhankins $


//-----------------------------------------------------------------------------
/**
 * I am the UI model for the RclFrameSet...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function RclFrameSetUiModel ()
{
}



//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the RclFrameSet screen...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function RclFrameSetUiController (aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);
      this.model = aModel;

      this.propertyPanelVisible = true;
      this.workspaceFrameSetRowsValue = null;

      if (ServerEnvironment.jsClientDebug == true) {
         this.jsClientDebug = new JsClientDebug(this);
      }
   }
}

//--- This class extends AbstractUiController
RclFrameSetUiController.prototype = new AbstractUiController();


/**
 * called once (after document is fully loaded) to initialize the user interface
 **/
RclFrameSetUiController.prototype.initUi = function()
{
   this.installRerProgressCallBack();
};


RclFrameSetUiController.prototype.getJsClientDebug = function()
{
   return this.jsClientDebug;
}

/**
* change the URL displayed in the workspace...
**/
RclFrameSetUiController.prototype.changeWorkSpaceUrl = function(aUrl)
{
   var workspaceFrame = this.document.getElementById('workSpace');
   var frameDoc = JsUtil.getFrameDocument(workspaceFrame);

   if (frameDoc && frameDoc.uiController)
   {
      frameDoc.uiController.changeUrl(aUrl);
   }
   else
   {
      workspaceFrame.src = aUrl;
   }

   this.document.getElementById('workspaceProperties').src = ServerEnvironment.baseUrl + "/secure/actions/blank.do";

};

/**
* change the URL displayed in the workspace properties panel...
**/
RclFrameSetUiController.prototype.changeWorkSpacePropertiesUrl = function(aUrl)
{
   var propertiesFrame = this.document.getElementById('workspaceProperties');
   var frameDoc = JsUtil.getFrameDocument(propertiesFrame);

   if (frameDoc && frameDoc.uiController)
   {
      frameDoc.uiController.changeUrl(aUrl);
   }
   else
   {
      propertiesFrame.src = aUrl;
   }
};

RclFrameSetUiController.prototype.collapseWorkSpacePropertiesUrl = function()
{
//      alert('2: ' + parent.workSpaceFrameSet.rows);
//      parent.workSpaceFrameSet.rows = "*,6px";
};

/**
* frameset has been resized.  NOTE: this method is ONLY called for IE.  Mozilla
* resizes are handled by onresize handlers installed in the two corresponding
* documents.
**/
RclFrameSetUiController.prototype.onWorkSpaceFrameResize = function()
{
   //--- we do the checking only for the times when nothing has
   //    yet been loaded into the workspace or properties frames (rare)

   var workSpaceUiController = document.frames["workSpace"].uiController;

   if (JsUtil.isGood(workSpaceUiController))
   {
      workSpaceUiController.onFrameResize();
   }

   var propertiesUiController = document.frames["workspaceProperties"].uiController;

   if (JsUtil.isGood(propertiesUiController))
   {
      propertiesUiController.onFrameResize();
   }
};

/**
* hides the frame which showns the property panel
**/
RclFrameSetUiController.prototype.hidePropertiesPanel = function()
{
   if (this.propertyPanelVisible)
   {
      this.propertyPanelVisible = false;
      var fs = document.getElementById("workSpaceFrameSet");
      this.workspaceFrameSetRowsValue = fs.rows;
      fs.rows = "*,0";
      
   }
};

/**
 * shows the frame which 
 **/
RclFrameSetUiController.prototype.showPropertiesPanel = function()
{
   if (this.propertyPanelVisible == false)
   {
      this.propertyPanelVisible = true;
      var fs = document.getElementById("workSpaceFrameSet");
      fs.rows = this.workspaceFrameSetRowsValue;
   }
};



RclFrameSetUiController.prototype.installRerProgressCallBack = function()
{
   window.setTimeout("uiController.refreshInProgressRers();", 5000);
}

/**
 * for the RER's which are still in progress, make a single async call to get their
 * upated status values...
 **/
RclFrameSetUiController.prototype.refreshInProgressRers = function()
{
   var rerWatchList = this.getWatchListFromCookie();
   if( JsUtil.isGood(rerWatchList) && rerWatchList.length > 0 )
   {
      var url = ServerEnvironment.baseUrl + "/secure/actions/getRerSummaries.do?";
      var httpParams = '';

      for (var i = 0; i < rerWatchList.length; ++i)
      {
         httpParams += "rerId=" + rerWatchList[i] + "&";
      }

      //--- async request setup...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();

      var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
      {
         try
         {

            // response is :
            //
            //    var rerSummaries = [...];
            //
            eval(anXmlHttpRequest.responseText);

            uiController.getFrameSetUiController().updateRerSummaries (rerSummaries);
            uiController.getFrameSetUiController().installRerProgressCallBack();
         }
         catch (e)
         {
            var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
            var writeString = anXmlHttpRequest.responseText;
            writeString = serverEnv + writeString;

            if (writeString.indexOf("<html>") == -1)
            {
               alert("A " + e.name + " occured evaluting the javascript.\n\nError message:  " + e.message + "\n\nStatement:  " + anXmlHttpRequest.responseText);
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

      xmlHttpRequest.send(httpParams);
   }
   else
   {
      this.installRerProgressCallBack();
   }
}

RclFrameSetUiController.prototype.getWatchListFromCookie = function()
{
   var existingWatchList = JsUtil.readCookie( "framesetRerWatchList" );
   var newRers = JsUtil.consumeCookiesStartingWith("newRerWatchId");
   var fullWatchList = existingWatchList;
   if( JsUtil.isGood(newRers) && newRers.length > 0 )
   {
      for( var index = 0; index < newRers.length; index++ )
      {
         var eachNewRer = newRers[index];
         if( JsUtil.isGood(fullWatchList) && fullWatchList.length > 0 )
         {
            fullWatchList += "|" + eachNewRer;
         }
         else
         {
            fullWatchList = eachNewRer;
         }
      }
      JsUtil.createCookie("framesetRerWatchList", fullWatchList);
   }
   if( JsUtil.isGood(fullWatchList) && fullWatchList.length > 0 )
   {
      var listAsArray = fullWatchList.split("|");
      return listAsArray;
   }
   return null;
}


RclFrameSetUiController.prototype.updateRerSummaries = function(aRerSummaries)
{
   for (var i = 0; i < aRerSummaries.length; ++i)
   {
      var eachRerSummary = aRerSummaries[i];
      if( eachRerSummary.status == ReportExecutionStatusEnum.FINISHED.value )
      {
         var rerArray = new Array();
         rerArray.push( eachRerSummary.rerId )
         launchReportViewer( rerArray, null, null, true );
         this.removeRerFromWatchList( eachRerSummary.rerId );
      }
      else if( eachRerSummary.status < 0 )
      {
         alert("A report you are waiting on finished with an error status of "
                 + Enum.parseEnumFromValue(ReportExecutionStatusEnum, eachRerSummary.status ).name
                 + ". For more info, view the report from the Report Outputs screen." );
         this.removeRerFromWatchList( eachRerSummary.rerId );
      }
   }
}

RclFrameSetUiController.prototype.removeRerFromWatchList = function( anRerId )
{
   var fullWatchList = JsUtil.readCookie( "framesetRerWatchList" );
   if( JsUtil.isGood(fullWatchList) && fullWatchList.length > 0 && JsUtil.isGood(anRerId) )
   {
      var stringRerId = '' + anRerId;

      var indexOf = fullWatchList.indexOf( stringRerId );
      if( indexOf >= 0 )
      {
        if( fullWatchList.length == stringRerId.length )
        {
           JsUtil.eraseCookie("framesetRerWatchList");
        }
        else
        {
           var replaceTxt = "";
           if( indexOf > 0 )
           {
              replaceTxt = "|" + anRerId;
           }
           else
           {
              replaceTxt = '' + anRerId + "|";
           }

           fullWatchList = fullWatchList.replace(replaceTxt, "");
           JsUtil.createCookie("framesetRerWatchList", fullWatchList);
        }
      }
   }
}

RclFrameSetUiController.prototype.addRerToWatchlist = function(aRerId)
{
   JsUtil.createCookie( "newRerWatchId" + aRerId, aRerId );
}

