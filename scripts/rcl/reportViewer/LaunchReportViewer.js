var rvWindowName = ServerEnvironment.windowNamePrefix + "_RCL_RV";
var reportViewer;

function launchReportViewer(aRerIds, aDefaultFormat, aWindowName, aIsAutoLaunch, aBurstDiscriminator)
{
   var geom = new BrowserGeometry();
   reportViewer = JsUtil.openNewWindow("", ServerEnvironment.launchViewerInSeparateWindows ? "_blank" : rvWindowName,
           "width=1010,height=693,top=geom.top,left=geom.left,menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

   if (!reportViewer.alreadyOpen && reportViewer.location.href.indexOf(ServerEnvironment.baseUrl) < 0)
   {
      var url = ServerEnvironment.baseUrl + "/secure/actions/launchReportViewer.do?" +
                getRequestParams(aRerIds, aDefaultFormat) +
                burstDiscriminatorToURLParams(aBurstDiscriminator);

      reportViewer.alreadyOpen = true;

      reportViewer.location = url;
      reportViewer.focus();
   }
   else
   {
      addReportInstancesToViewer(reportViewer, aRerIds, aDefaultFormat, aWindowName, aIsAutoLaunch, aBurstDiscriminator);
   }
}


function ReportViewerLaunchTimeout(aRerIds, aDefaultFormat, aWindowName, aIsAutoLaunch, aBurstDiscriminator)
{
   this.rerIds = aRerIds;
   this.defaultFormat = aDefaultFormat;
   this.windowName = aWindowName;
   this.isAutoLaunch = aIsAutoLaunch;
   this.burstDiscriminator = aBurstDiscriminator;
}

ReportViewerLaunchTimeout.prototype.runLaunch = function()
{
   launchReportViewer(this.rerIds, this.defaultFormat, this.windowName, this.isAutoLaunch, this.burstDiscriminator);
}

function validateReportViewer(aReportViewerWindow)
{
   if (!JsUtil.isGood(aReportViewerWindow.uiController))
      return false;
   return aReportViewerWindow.uiController.isFinishedLoading;
}

function addReportInstancesToViewer(aReportViewerWindow, aRerIds, aDefaultFormat, aWindowName, aIsAutoLaunch, aBurstDiscriminator)
{

   if (!validateReportViewer(aReportViewerWindow))
   {
      var launchFunction = new ReportViewerLaunchTimeout(aRerIds, aDefaultFormat, aWindowName,null, aBurstDiscriminator);
      window.setTimeout(launchFunction.runLaunch.bind(launchFunction), 50);
      return;
   }

   var url = ServerEnvironment.baseUrl + "/secure/actions/addReportInstancesToReportViewer.do?";

   //--- async request setup...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
      try
      {
         aReportViewerWindow.eval(anXmlHttpRequest.responseText); // have to evaluate this in the reportViewer's dom
         // (as opposed to the "this" dom) in order to avoid getting that
         // "can't execute from freed script" error in the reportViewer.
         if (!aIsAutoLaunch)
         {
            aReportViewerWindow.tabbedPanel.selectLastTab(true);
         }
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

   handler.uiController = aReportViewerWindow.uiController;
   xmlHttpRequest.open("POST", url, true);

   xmlHttpRequest.setRequestHeader(
           'Content-Type',
           'application/x-www-form-urlencoded; charset=UTF-8'
           );

   xmlHttpRequest.send(getRequestParams(aRerIds, aDefaultFormat) + burstDiscriminatorToURLParams(aBurstDiscriminator));
   reportViewer.focus();
}

function getRequestParams(aRerIds, aDefaultFormat)
{
   var requestParams = "";

   for (var i = 0; i < aRerIds.length; ++i)
   {
      requestParams += "rerIds=" + aRerIds[i] + "&";
   }

   if (JsUtil.isGood(aDefaultFormat))
   {
      requestParams += "defaultFormat=" + aDefaultFormat;
   }

   return requestParams;
}

/*transforms the burst group id in to an escaped set of URL parameters.  &aBurstDiscriminator=1*/
function burstDiscriminatorToURLParams(aBurstDiscriminator)
{
   var params = '';
   if (JsUtil.isGood(aBurstDiscriminator))
   {
      params += "burstDiscriminator=" + aBurstDiscriminator;
   }
   return params;
}

