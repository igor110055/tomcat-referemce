/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: ReportViewerUi.js 9143 2014-12-10 01:17:38Z lhankins $


//-----------------------------------------------------------------------------
/**
 * This file defines JavaScript classes pertain to the ReportViewer UI
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 *
 **/


//---------------------------------------------------------------------------//
// ReportViewerUiController
//---------------------------------------------------------------------------//
function ReportViewerUiController(aDocument, aTabbedPanel)
{
   this.tabbedPanel = aTabbedPanel;
   this.tabbedPanel.addTabListener(this);

   this.inProgressPagedRers = {};
   this.isPagedRerProgressCheckPending = false;
   this.inModalState = false;
   this.drillCount = 1;
   this.nextTabId = 0;

   this.document = aDocument;

   this.firstTabLoaded = false;

   this.initKeyHandler();
   this.isFinishedLoading = true;
}
    
ReportViewerUiController.prototype = new AbstractUiController();
ReportViewerUiController.prototype.constructor = ReportViewerUiController;
ReportViewerUiController.superclass = AbstractUiController.prototype;

ReportViewerUiController.prototype.initKeyHandler = function()
{
   var reportViewerKeyHandler = new ReportViewerKeyHandler(this.tabbedPanel);
   this.keyHandler = new ViewerKeyHandler(reportViewerKeyHandler, this);

   this.keyHandler.init(this.document);
};


ReportViewerUiController.prototype.getNextTabId = function()
{
   return this.nextTabId++;
};

//todo, move to better location and determine better resize conditions
//this is done so the tabs do not exceed one row (maximized)
ReportViewerUiController.prototype.resizeTabNames = function()
{
   var index;

   if (this.tabbedPanel.getNumberOfTabs() >= 2)
   {
      (this.tabbedPanel.getNumberOfTabs() < 11) ? index = 7 : index = 3;
      (this.tabbedPanel.getNumberOfTabs() > 20) ? index = 1 : '';

      for (var i = 0; i < this.tabbedPanel.itsByOrder.length; i++)
      {
         if (this.tabbedPanel.itsByOrder[i].reportInstance)
         {
            var tabName = this.tabbedPanel.itsByOrder[i].name.substring(0,index) + "...";
            this.tabbedPanel.itsByOrder[i].changeName(tabName);
         }
      }
   }
}

ReportViewerUiController.prototype.installInProgressRerCheck = function()
{
   if (!this.isPagedRerProgressCheckPending)
   {
      this.isPagedRerProgressCheckPending = true;
      setTimeout("uiController.refreshInProgressRers()", 2000);
   }
};

ReportViewerUiController.prototype.addReportInstance = function(aReportInstance)
{
   var tabName = aReportInstance.name + "(" + aReportInstance.rerId + ")";
   aReportInstance.getDefaultOutput();

   var url = ServerEnvironment.baseUrl + "/secure/actions/blank.do";
   var tabId = this.getNextTabId();

   var tab = this.tabbedPanel.createAndAddTab(tabId, tabName, url);
   tab.reportInstance = aReportInstance;
   tab.rerId = aReportInstance.rerId;

   //alert('checking to see if paged [' + aReportInstance.isPaged() + '] [' + aReportInstance.isStillLoading() + ']');
   if (aReportInstance.isPaged() && aReportInstance.isStillLoading())
   {
      this.inProgressPagedRers[aReportInstance.id] = aReportInstance;
      this.installInProgressRerCheck();
   }
   this.resizeTabNames();
};

ReportViewerUiController.prototype.addInProgressRer = function(aRerId, aName, aIsPaged)
{
   var tabName = aName + "(" + aRerId + ")";
   var url = ServerEnvironment.baseUrl;
   var tabId = this.getNextTabId();


   var actionWhenDone = aIsPaged ?
            "/secure/actions/pagedRerOutputAvailable.do" :
            "/secure/actions/drillThroughFinished.do";

   actionWhenDone +=
              "?rerId=" + aRerId +
              "&tabId=" + tabId;

   var forwardTo = "/secure/actions/waitOnPendingRer.do?rerId=" + aRerId +
              "&actionWhenDone=" + JsUtil.base64Encode(actionWhenDone);

   url += forwardTo;

   var tab = this.tabbedPanel.createAndAddTab(tabId, tabName, url);
   tab.rerId = aRerId;

   this.document.getElementById(tab.id + "-tabA").innerHTML = '<img style="border:0px;padding:0px;margin:px;" title="Loading..." src="' + ServerEnvironment.imageDir + '/loading.gif"/>' +
           '<nobr>Loading...</nobr>';

   this.resizeTabNames();
};

ReportViewerUiController.prototype.addDrillTab = function(aTargetXPath, aParamNameArray, aParamValueArray)
{
   this.addDrillTab(aTargetXPath,aParamNameArray,aParamValueArray,false);
}

ReportViewerUiController.prototype.addDrillTab = function(aTargetXPath, aParamNameArray, aParamValueArray, aIsMultiDrill)
{
   var tab = this.tabbedPanel.currentTab;
 	var srcRerId = tab.reportInstance.rerId; 

   var tabName = "Drill #" + (this.drillCount++);

   var tabId = tab.id; 
 	if( aIsMultiDrill || !tab.reportInstance.isDrillInFrame )
 	{
 	   tabId = this.getNextTabId();
 	}

   var url = ServerEnvironment.baseUrl + "/secure/actions/drillThrough.do" + "?sourceRerId=" + srcRerId +
               "&targetXpath=" + aTargetXPath + "&tabId=" + tabId;

   for (var i = 0; i < aParamNameArray.length; i++)
   {
       url += "&drillParamName" + i + "=" + encodeURIComponent(aParamNameArray[i]) +
               "&drillParamValue" + i + "=" + encodeURIComponent(aParamValueArray[i]);
   }

   url += "&drillParamNumber=" + aParamNameArray.length;

   if( !aIsMultiDrill && tab.reportInstance.isDrillInFrame )
 	{
 	   tab.name = tabName;
 	   tab.changeUrl(url);
 	}
 	else
 	{
 	   tab = this.tabbedPanel.createAndAddTab(tabId, tabName, url);
 	}
   this.document.getElementById(tab.id + "-tabA").innerHTML = '<img style="border:0px;padding:0px;margin:px;" title="Loading..." src="' + ServerEnvironment.imageDir + '/loading.gif"/>' +
           '<nobr>Loading...</nobr>';

   this.resizeTabNames();

   tab.isDrillThrough = true;
};




ReportViewerUiController.prototype.parseDrillXmlParameters = function (aDrillTargetXml)
{

   /*
   Sample:

      <drillTarget drillIdx=\"1\" label=\"Drill-Through Definition1\"><drillParameter name=\"RetailerName\" value=\"Ultra Sports\"/><drillParameter name=\"OrderDate\" value=\"2004-09-09T06:15:31.000000000\"/><\/drillTarget>
   */

   var xmlWithNs = '<test xmlns:bus="http://developer.cognos.com/schemas/bibus/3/" ' +
              'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
              '>' + aDrillTargetXml + '</test>';

   var domDoc;

   if (is_ie)
   {
      domDoc =  new ActiveXObject("Microsoft.XMLDOM");
      domDoc.loadXML(xmlWithNs);
      domDoc.setProperty("SelectionLanguage", "XPath");
   }
   else
   {
      domDoc = (new DOMParser()).parseFromString(aDrillTargetXml,"text/xml");
   }

   var results = [];

   var drillTargets = domDoc.selectNodes("//drillTarget");

   for (var i = 0; i < drillTargets.length; ++i)
   {
      var eachDt = { drillTargetIndex: 0, paramNames: [], paramValues: [] };

      results.push(eachDt);

      eachDt.drillTargetIndex = drillTargets[i].getAttribute("drillIdx");

      var drillParams = drillTargets[i].selectNodes("drillParameter");

      for (var j = 0; j < drillParams.length; ++j)
      {
         eachDt.paramNames.push(drillParams[j].getAttribute("name"));
         eachDt.paramValues.push(drillParams[j].getAttribute("value") )
      }
   }

   return results;
};

ReportViewerUiController.prototype.doMultipleDrills = function (aDrillTargetsXml)
{
   //alert("multi-drill xml :\n\n" + aDrillTargetsXml);
   var xmlWithNs = '<test xmlns:bus="http://developer.cognos.com/schemas/bibus/3/" ' +
              'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
              '>' +
              aDrillTargetsXml + '</test>';

   var domDoc;

   if (is_ie)
   {
      domDoc =  new ActiveXObject("Microsoft.XMLDOM");
      domDoc.loadXML(xmlWithNs);
      domDoc.setProperty("SelectionLanguage", "XPath");
   }
   else
   {
      domDoc = (new DOMParser()).parseFromString(xmlWithNs,"text/xml");
   }
   var drillTargets = domDoc.selectNodes("//drillTarget");

   var paramNameArray = [];
   var paramValueArray = [];
   var targetXpath;

   for (var i = 0; i < drillTargets.length; ++i)
   {
      targetXpath = drillTargets[i].getAttribute("path") ;

      var drillParams = drillTargets[i].selectNodes("drillParameter");

      for (var j = 0; j < drillParams.length; ++j)
      {
         paramNameArray.push(drillParams[j].getAttribute("name"));
         paramValueArray.push(drillParams[j].getAttribute("value") )
      }

      this.addDrillTab(targetXpath, paramNameArray, paramValueArray, true);
   }

};

ReportViewerUiController.prototype.raiseButton = function(anEvent)
{
   JsUtil.getEventTarget(anEvent).className = "tbButtonRaised";

};

ReportViewerUiController.prototype.lowerButton = function(anEvent)
{
   JsUtil.getEventTarget(anEvent).className = "tbButton";
};


ReportViewerUiController.prototype.removeCurrentTab = function()
{
   if (this.inModalState)
      return;

   this.tabbedPanel.removeCurrentTab();

   if (this.tabbedPanel.getNumberOfTabs() == 0)
   {
      window.close();
   }

};

ReportViewerUiController.prototype.detachCurrentTab = function()
{
   if (this.inModalState)
      return;

   if (this.tabbedPanel.getNumberOfTabs() > 1)
   {
      var tab = this.tabbedPanel.currentTab;
      var reportInstance = tab.reportInstance;

      if(!JsUtil.isGood(reportInstance)) return;

      this.tabbedPanel.removeCurrentTab();

      var url = ServerEnvironment.baseUrl + "/secure/actions/launchReportViewer.do?rerIds=" + reportInstance.rerId + "&defaultFormat=" + reportInstance.currentOutput.format;

      var geom = new BrowserGeometry();

      reportViewer = JsUtil.openNewWindow("", ServerEnvironment.windowNamePrefix + "_blank",
              "width=1010,height=693,top=geom.top,left=geom.left,menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

      reportViewer.location = url;
   }
};

ReportViewerUiController.prototype.emailOutput = function()
{
   var reportInstanceId = this.tabbedPanel.currentTab.reportInstance.id;

   var emailRerOutputDialog = new Adf.EmailPreferencesDialog();
   emailRerOutputDialog.show({
      reportInstanceId: this.tabbedPanel.currentTab.reportInstance.id
   });
};

ReportViewerUiController.prototype.editReportOutput = function()
{
   var httpParams = "reiId=" + this.tabbedPanel.currentTab.reportInstance.id;

   var windowUrl = ServerEnvironment.contextPath + "/secure/actions/ext/editReiWindow.do?" + httpParams;
   var windowName = ServerEnvironment.windowNamePrefix + "_EditRei_" + this.tabbedPanel.currentTab.reportInstance.id;

   var geom = new BrowserGeometry();
   var win = window.open(windowUrl,
         windowName,
         "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

   win.focus();
};

ReportViewerUiController.prototype.saveAs = function()
{
   Adf.profileSaveAsDialog.showSaveAsDialog(
        this,
        function(aProfileName, aPrivateFlag, aSaveToFolderPath, aSaveToFolderId)
        {
            uiController.doSaveAs(aSaveToFolderPath, aProfileName, aPrivateFlag);
        },
        this.tabbedPanel.currentTab.reportInstance.name,
        true,
        document.forms[0].saveToFolderPath.value);
};

ReportViewerUiController.prototype.addToContentStore = function()
{
   var url = ServerEnvironment.contextPath + "/secure/actions/saveToContentStore.do";

   var path = ServerEnvironment.contextPath + '/scripts/rcl/reportViewer/saveToContentStoreDialog.js';
   JsUtil.include(path);
   var httpParams = "reiId=" + this.tabbedPanel.currentTab.reportInstance.id;

   var xmlHttpRequest = JsUtil.createXmlHttpRequest();
    var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
      try
      {


         eval(anXmlHttpRequest.responseText);
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

ReportViewerUiController.prototype.doSaveAs = function(aFolderPath, aProfileName, aPermission)
{
   var url = ServerEnvironment.contextPath + "/secure/actions/saveAsNewProfile.do";

   var httpParams = "reiId=" + this.tabbedPanel.currentTab.reportInstance.id +
           "&saveToFolderPath=" + aFolderPath +
           "&saveAsNewProfileName=" + aProfileName +
           "&privateProfile=" + aPermission;


   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
      try
      {
         eval(anXmlHttpRequest.responseText);
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

   xmlHttpRequest.open("POST", url, false);

   xmlHttpRequest.setRequestHeader(
           'Content-Type',
           'application/x-www-form-urlencoded; charset=UTF-8'
           );

   xmlHttpRequest.send(httpParams);
}

ReportViewerUiController.prototype.getReportFormatElement = function()
{
   return document.getElementById("reportFormatComboBox");
};

/**
 * change the format currently displayed...
 **/
ReportViewerUiController.prototype.changeReportFormat = function()
{
   if (this.inModalState)
      return;

   if(!JsUtil.isNull(this.tabbedPanel.currentTab))
   {
      var newFormat = this.getReportFormatElement().value;
      var reportInstance = this.tabbedPanel.currentTab.reportInstance;
      var reportOutput = this.tabbedPanel.currentTab.reportInstance.getOutput(newFormat)[0];

      reportInstance.currentOutput = reportOutput;

      this.tabbedPanel.currentTab.changeUrl(reportOutput.getUrl());
   }
   this.getReportFormatElement().blur();
};

ReportViewerUiController.prototype.navigateReportFormats = function()
{
   var formats = document.getElementById("reportFormatComboBox");
   formats.focus();
};

ReportViewerUiController.prototype.refreshPagingControls = function(aUpdateCurrentPageNum)
{
   var pagingControls = document.getElementById("rvPagingControls");
   var tab = this.tabbedPanel.currentTab;

   if (tab.reportInstance && tab.reportInstance.isPaged())
   {
      pagingControls.style.display = 'block';

      var currentPageInput = document.getElementById('paging_currentPageInput');
      if (aUpdateCurrentPageNum)
      {
         currentPageInput.value = tab.reportInstance.currentPageNum + 1;
         currentPageInput.select();
         //currentPageInput.focus();
      }

      var pageDescr = applicationResources.getProperty("reportviewer.paging.of")  + " " + tab.reportInstance.getTotalNumberOfPages() + (tab.reportInstance.isReachedMaxPages() ? "+" : "");
      document.getElementById('paging_pageDescr').innerHTML = pageDescr;


      document.getElementById('paging_nextButton').disabled = !tab.reportInstance.isNextPageAllowed();
      document.getElementById('paging_previousButton').disabled = !tab.reportInstance.isPreviousPageAllowed();


      document.getElementById('paging_stillLoading').style.display = (tab.reportInstance.isStillLoading() ? 'inline' : 'none');
   }
   else
   {
      pagingControls.style.display = 'none';

   }
};

ReportViewerUiController.prototype.tabWasSelected = function(aTab)
{
   //--- reset the combo box selection based on the current report's available formats..
   var comboBoxContainer = document.getElementById("reportFormatComboBoxContainer");

   var html = '<select onchange="uiController.changeReportFormat();" id="reportFormatComboBox" >\n';

   var outputValue = null;
   var outputDisplayName = null;

   if (aTab.reportInstance)
   {
      if (this.reportViewerIframeKeyHandler == null)
      {
         this.reportViewerIframeKeyHandler = new ReportViewerIframeKeyHandler(this.tabbedPanel);
      }
      if (this.iFrameKeyHandler == null)
      {
         this.iFrameKeyHandler = new ViewerKeyHandler(this.reportViewerIframeKeyHandler, this);
      }

      //This will enable keyhandling for the output's iframe only when HTML is selected (The document is not available in other outputformats)
      this.tabDocument = aTab.reportInstance.currentOutput.format == "HTML" ? frames[this.reportViewerIframeKeyHandler.getSelectedTabPosition()].document : null;
      this.reportViewerDocumentHolder = new ReportViewerDocumentHolder(this.tabDocument, aTab, this.tabbedPanel);

      this.wasOutputLoaded = true;
      if (!this.isOutputLoaded(aTab.url))
      {
         this.wasOutputLoaded = false;
         aTab.changeUrl(aTab.reportInstance.currentOutput.getUrl());
      }
//      for (outputValue in aTab.reportInstance.outputs)
//      {
//         outputDisplayName = (outputValue == "singleXLS" ? "Excel" : outputValue);
//
//         html += '<option value="' + outputValue + '">' + outputDisplayName + '</option>\n';
//      }

      // display format options in order of precedence
      var eachFormat;
      for (var i = 0; i < ReportInstance.formatsInPrecedence.length; ++i)
      {
         eachFormat = ReportInstance.formatsInPrecedence[i];

         var output = aTab.reportInstance.getOutput(eachFormat);
         if (output )
         {
            outputValue = output[0].format;
            outputDisplayName = ReportInstance.formatsDisplayValue[outputValue];

            html += '<option value="' + outputValue + '">' + outputDisplayName + '</option>\n';
         }
      }

      html += '</select>';

      comboBoxContainer.innerHTML = html;

      this.getReportFormatElement().value = aTab.reportInstance.currentOutput.format;

      if (! aTab.reportInstance.isPaged())
      {
         //---Need to check if a document changed every time a new iframe is shown
         if (this.periodicalExecuter == null)
         {
            this.periodicalExecuter = new PeriodicalExecuter(ReportViewerUiController.handleIframeListenerAttachment.bind(this), 0.5);
         }
         else
         {
            this.periodicalExecuter.registerCallback();
         }
      }


      this.refreshPagingControls(true);
   }
   else
   {
      comboBoxContainer.innerHTML = '';
   }
};



ReportViewerUiController.handleIframeListenerAttachment = function()
{
   if (!this.reportViewerDocumentHolder.canAttachIframeDocListener())
   {
      //---We can't attach the iframe listener to output formats other than HTML
      this.periodicalExecuter.stop();
      this.reportViewerDocumentHolder.getIFrame().focus();
   }
   else if (this.reportViewerDocumentHolder.hasDocumentChanged())
   {
      //---Attach event listener to changed document
      var changedDocument = this.reportViewerDocumentHolder.getChangedDocument();
      this.iFrameKeyHandler.init(changedDocument);

      this.periodicalExecuter.stop();
      this.reportViewerDocumentHolder.getIFrame().focus();
   }
   /*else
   {
      alert("attempting to attach ifram listener attachment, but document hasn't changed");
   }*/

   //---IE hack because IE doesn't request a new document when the iframe is reshown
//   if (is_ie && this.wasOutputLoaded)
   if (this.wasOutputLoaded)
   {
      this.periodicalExecuter.stop();
      this.reportViewerDocumentHolder.getIFrame().focus();
   }
};


ReportViewerUiController.prototype.isOutputLoaded = function(aUrl)
{
   return (aUrl != ServerEnvironment.baseUrl + "/secure/actions/blank.do"); //(aUrl.indexOf("blank.do") != -1);
};

ReportViewerUiController.prototype.hideToolbar = function()
{
   document.getElementById("toolbarDiv").style.display = "none";
};

ReportViewerUiController.prototype.showToolbar = function()
{
   document.getElementById("toolbarDiv").style.display = "block";
};

ReportViewerUiController.prototype.editReportSortOrder = function()
{
   alert("temporarily disabled");
};

ReportViewerUiController.prototype.editReportFilter = function()
{
   alert("temporarily disabled");
};

ReportViewerUiController.prototype.editReport = function()
{
   alert("temporarily disabled");
};

ReportViewerUiController.prototype.windowResized = function()
{
   // HACK FOR IE - make div containing IFrame size appropriately, need to
   // account for mozilla in stylesheets
   if( is_ie )
   {
      var geom = new BrowserGeometry();
      var newHeight = geom.height - 60;
      document.getElementById("rvTabbedPanelContainer").style.height = newHeight;

      //window.status = newHeight;
   }
};

/**
 * called when a drill through RER has completed, causes the tabl to load in the finished
 * dirll output
 * @param aRerId - the rerID of the drill target RER
 * @param aReportInstance
 * @param aTabId - the tab where the output is destined (there could be multiple simultaneous
 * drill operations ongoing)
 */
ReportViewerUiController.prototype.onDrillThroughFinished = function(aRerId, aReportInstance, aTabId)
{
   var tab = this.tabbedPanel.getTab(aTabId);
   tab.reportInstance = aReportInstance;
   tab.changeName(aReportInstance.name + "(" + aReportInstance.id + ")");
   tab.changeTitle(aReportInstance.name +"(" + aReportInstance.id + ")");
   tab.changeUrl(aReportInstance.getDefaultOutput().getUrl());
   this.resizeTabNames();
   if(tab.selected)
   {
      this.tabWasSelected(tab);
   }
};

/**
 * called when a paged RER reaches a state where at least the first page is available. Causes the tab to
 * load in the first page of output
 * @param aRerId - the rerID of the drill target RER
 * @param aReportInstance
 * @param aTabId - the tab where the output is destined (there could be multiple simultaneous
 * drill operations ongoing)
 */
ReportViewerUiController.prototype.onPagedRerOutputAvailable = function(aRerId, aReportInstance, aTabId)
{
   var tab = this.tabbedPanel.getTab(aTabId);
   tab.reportInstance = aReportInstance;
   tab.changeName(aReportInstance.name + "(" + aReportInstance.id + ")");
   tab.changeTitle(aReportInstance.name +"(" + aReportInstance.id + ")");
   tab.changeUrl(aReportInstance.getDefaultOutput().getUrl());
   this.resizeTabNames();
   if(tab.selected)
   {
      this.tabWasSelected(tab);
   }

   if (tab.reportInstance.isStillLoading())
   {
      this.inProgressPagedRers[tab.reportInstance.id] = tab.reportInstance;
      this.installInProgressRerCheck();
   }
};

ReportViewerUiController.prototype.pendingRerWasCancelled = function(aRerId, aTabId)
{
   var tab;

   //--- if there's a tabId parameter, lookup the tab that way
   if (aTabId) {
      tab = this.tabbedPanel.getTab(aTabId);
   }
   //--- otherwise, search the tabs by rerId
   else {

      for (var i = 0; i < this.tabbedPanel.itsByOrder.length; ++i) {
         if (this.tabbedPanel.itsByOrder[i].rerId == aRerId) {
            tab = this.tabbedPanel.itsByOrder[i];
            break;
         }
      }
   }

   if (tab) {
      tab.changeName("Cancelled (" + aRerId + ")");
      tab.changeTitle("Cancelled (" + aRerId + ")");
   }
   else {
      alert ('failed to find tab by rerId [' + aRerId + '] or tabId [' + aTabId + "]");
   }
};


ReportViewerUiController.prototype.firstPage = function()
{
   var reportInstance = this.tabbedPanel.currentTab.reportInstance;
   reportInstance.firstPage();
   this.tabbedPanel.currentTab.changeUrl(reportInstance.currentOutput.getUrl());
   this.refreshPagingControls(true);
};

ReportViewerUiController.prototype.nextPage = function()
{
   var reportInstance = this.tabbedPanel.currentTab.reportInstance;
   reportInstance.nextPage();
   this.tabbedPanel.currentTab.changeUrl(reportInstance.currentOutput.getUrl());
   this.refreshPagingControls(true);
};

ReportViewerUiController.prototype.previousPage = function()
{
   var reportInstance = this.tabbedPanel.currentTab.reportInstance;
   reportInstance.previousPage();
   this.tabbedPanel.currentTab.changeUrl(reportInstance.currentOutput.getUrl());
   this.refreshPagingControls(true);
};

ReportViewerUiController.prototype.lastPage = function()
{
   var reportInstance = this.tabbedPanel.currentTab.reportInstance;
   reportInstance.lastPage();
   this.tabbedPanel.currentTab.changeUrl(reportInstance.currentOutput.getUrl());
   this.refreshPagingControls(true);
};

ReportViewerUiController.prototype.jumpToPage = function(aPage)
{
   var reportInstance = this.tabbedPanel.currentTab.reportInstance;
   reportInstance.jumpToPage(aPage);
   this.tabbedPanel.currentTab.changeUrl(reportInstance.currentOutput.getUrl());
   this.refreshPagingControls(true);
};

var rvKeyCodes = {
   rightArrow: 39,
   leftArrow: 37,
   pageDown : 34,
   pageUp: 33,
   enter: 13,
   home: 36,
   end: 35
};

ReportViewerUiController.prototype.onCurrentPageKeyPress = function (anEvent)
{
   var e = anEvent || window.event;

   if ((e.ctrlKey && e.keyCode === rvKeyCodes.rightArrow) || e.keyCode === rvKeyCodes.pageDown )
   {
      this.nextPage();
   }
   else if ((e.ctrlKey && e.keyCode === rvKeyCodes.leftArrow) || e.keyCode === rvKeyCodes.pageUp)
   {
      this.previousPage();
   }
   else if (e.keyCode === rvKeyCodes.home)
   {
      this.firstPage();
   }
   else if (e.keyCode === rvKeyCodes.end)
   {
      this.lastPage();
   }

   else if (e.keyCode === rvKeyCodes.enter)
   {
      var currentPageInput = document.getElementById("paging_currentPageInput");

      try {
         var newPageNumber = parseInt(currentPageInput.value);
         this.jumpToPage(newPageNumber - 1);
      }
      catch (e) {
      }

      currentPageInput.select();
      return false;
   }
//   else
//   {
//      alert("keyCode = [" + e.keyCode + "]");
//   }
   return true;
}





ReportViewerUiController.prototype.cbUpdatePagedRerStatus = function (aStatus)
{
   for (var i = 0; i < aStatus.length; ++i)
   {
      try
      {
         var reportInstance = this.inProgressPagedRers[aStatus[i].reportInstanceId];
         reportInstance.updatePagingStatus(aStatus[i].pagingStatus, aStatus[i].totalPages);

         if (!reportInstance.isStillLoading())
         {
            //alert('[' + reportInstance.id + '] appears to be finished, pagingStatus = [' + reportInstance.pagingStatus + ']');
            delete this.inProgressPagedRers[reportInstance.id];
         }
      }
      catch (e)
      {
         var errMsg = 'Failure during cbUpdatePagedRerStatus, for [' + aStatus[i].reportInstanceId + "], [" + aStatus[i].pagingStatus + "]";
         alert(errMsg, new Array(e.name, e.message));
      }
   }
   //--- if we have one or more inProgress, re-install the check
   for (var eachInProgress in this.inProgressPagedRers)
   {
      this.installInProgressRerCheck();
      break;
   }

   this.refreshPagingControls(false);

};


/**
* TODO: this should be replaced with RequestUtil calls (once this page is converted to ext-js)
**/
ReportViewerUiController.prototype.refreshInProgressRers = function()
{
   this.isPagedRerProgressCheckPending = false;

   var url = ServerEnvironment.baseUrl + "/secure/actions/getPagedRerStatus.do?";
   var httpParams = '';


   for (var eachPagedId in this.inProgressPagedRers)
   {
      var pagedReportInstance = this.inProgressPagedRers[eachPagedId];
      httpParams +=  "&reportInstanceId=" + eachPagedId;
   }


   //--- async request setup...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      try {
         // response will be in this form :
         //
         //    var pagedRerStatusUpdate = [
         //             {reportInstanceId:25, totalPages:455, pagingStatus: 'IN_PROGRESS'},
         //             {reportInstanceId:26, totalPages:442, pagingStatus: 'IN_PROGRESS'},
         //             {reportInstanceId:27, totalPages:442, pagingStatus: 'IN_PROGRESS'},
         //             {reportInstanceId:28, totalPages:413, pagingStatus: 'FINISHED'},
         //             {reportInstanceId:30, totalPages:21, pagingStatus: 'IN_PROGRESS'}
         //    ];
         //
         eval(anXmlHttpRequest.responseText);

         uiController.cbUpdatePagedRerStatus(pagedRerStatusUpdate);
      }
      catch (e) {
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

   //alert('issuing ajax call [' + url + ']');

   xmlHttpRequest.open("POST", url, true);

   xmlHttpRequest.setRequestHeader(
           'Content-Type',
           'application/x-www-form-urlencoded; charset=UTF-8'
           );

   xmlHttpRequest.send(httpParams);
};





/**
 * Report Viewer key handler
 */
//-----------------------------------------------------
function ReportViewerKeyHandler(aTabSet)
{
   this.tabSet = aTabSet;
   this.browseOutputsWindow = window.opener;
}


ReportViewerKeyHandler.prototype = new AbstractViewerKeyHandler();
ReportViewerKeyHandler.prototype.constructor = ReportViewerKeyHandler;
ReportViewerKeyHandler.superclass = AbstractViewerKeyHandler.prototype;


ReportViewerKeyHandler.prototype.changeNextTab = function()
{
   var tabSize = this.tabSet.getNumberOfTabs();
   var selectedTab = this.tabSet.currentTab;

   if (selectedTab != null)
   {
      var selectedTabPos = TabSet.arrayIndexOf(this.tabSet.itsByOrder, selectedTab);
      //---If we are at the end of the tabs, wrap to the beginning
      if (selectedTabPos >= tabSize - 1)
      {
         this.tabSet.selectFirstTab(true);
      }
      else
      {
         this.tabSet.tabWasSelected(this.tabSet.itsByOrder[selectedTabPos + 1].id);
      }
   }
};

ReportViewerKeyHandler.prototype.changePreviousTab = function()
{
   var tabSize = this.tabSet.getNumberOfTabs();
   var selectedTab = this.tabSet.currentTab;

   if (selectedTab != null)
   {
      var selectedTabPos = TabSet.arrayIndexOf(this.tabSet.itsByOrder, selectedTab);
      //---If we are are the beginning, wrap to the end
      if (selectedTabPos <= 0)
      {
         this.tabSet.selectLastTab(true);
      }
      else
      {
         this.tabSet.tabWasSelected(this.tabSet.itsByOrder[selectedTabPos - 1].id);
      }
   }
};

ReportViewerKeyHandler.prototype.getBrowseOutputWindow = function()
{
   return this.browseOutputsWindow;
};


/**
 * Report Viewer Iframe key handler
 */
//-----------------------------------------------------
function ReportViewerIframeKeyHandler(aTabSet)
{
   this.tabSet = aTabSet;
}


ReportViewerIframeKeyHandler.prototype = new AbstractViewerKeyHandler();
ReportViewerIframeKeyHandler.prototype.constructor = ReportViewerIframeKeyHandler;
ReportViewerIframeKeyHandler.superclass = AbstractViewerKeyHandler.prototype;


ReportViewerIframeKeyHandler.prototype.changeNextTab = function()
{
   var tabSize = this.tabSet.getNumberOfTabs();
   var selectedTab = this.tabSet.currentTab;

   if (selectedTab != null)
   {
      var selectedTabPos = this.getSelectedTabPosition();
      //---If we are at the end of the tabs, wrap to the realbeginning
      if (selectedTabPos >= tabSize - 1)
      {
         this.tabSet.selectFirstTab(true);
      }
      else
      {
         this.tabSet.tabWasSelected(this.tabSet.itsByOrder[selectedTabPos + 1].id);
      }
   }
};

ReportViewerIframeKeyHandler.prototype.changePreviousTab = function()
{
   var tabSize = this.tabSet.getNumberOfTabs();
   var selectedTab = this.tabSet.currentTab;

   if (selectedTab != null)
   {
      var selectedTabPos = this.getSelectedTabPosition();
      //---If we are at the beginning, wrap to the end
      if (selectedTabPos <= 0)
      {
         this.tabSet.selectLastTab(true);
      }
      else
      {
         this.tabSet.tabWasSelected(this.tabSet.itsByOrder[selectedTabPos - 1].id);
      }
   }
};

ReportViewerIframeKeyHandler.prototype.getSelectedTabPosition = function()
{
   return TabSet.arrayIndexOf(this.tabSet.itsByOrder, this.tabSet.currentTab);
};

ReportViewerIframeKeyHandler.prototype.getBrowseOutputWindow = function()
{
   return frames[this.getSelectedTabPosition()].parent.opener;
};


function ReportViewerDocumentHolder(anOldDocument, aTab, aTabSet)
{
   this.oldDocument = anOldDocument;
   this.tab = aTab;
   this.tabSet = aTabSet;
   this.changedDocument;
}
;

ReportViewerDocumentHolder.prototype.canAttachIframeDocListener = function()
{
   return (this.oldDocument != null)
}

ReportViewerDocumentHolder.prototype.hasDocumentChanged = function()
{
   if (this.oldDocument == null || this.oldDocument == this.getIFrame().document)
   {
      return false;
   }
   else
   {
      this.changedDocument = this.getIFrame().document;
      this.oldDocument = this.changedDocument;
      return true;
   }
};

ReportViewerDocumentHolder.prototype.getChangedDocument = function()
{
   return this.changedDocument;
};

ReportViewerDocumentHolder.prototype.getIFrame = function()
{
   var selectedTabPos = TabSet.arrayIndexOf(this.tabSet.itsByOrder, this.tabSet.currentTab);
   return frames[selectedTabPos];
};



////////////////////////////////////////////////////////
// Glue for Drills in Paged Output HTML
////////////////////////////////////////////////////////

var oCV_THIS_ = {
   selectionController : {
      addMetaData : function (aObj) {
      },
      addContextData : function (aObj) {
      },
      setSelectionBasedFeaturesEnabled : function (aIsEnabled) {
      },
      pageHover : function () {
      }
   },
   getSelectionController : function() {
      return this.selectionController;
   },
   rvMainWnd : {
      pageClicked : function (anEvent) {
         var target = anEvent.target ? anEvent.target : anEvent.srcElement;

         var parent = target ? target.parentElement : null;
         var dt = parent ? parent.getAttribute("dttargets") : null;

         if (dt) {
            try  {
               /*
                  Sample:

                     <drillTarget drillIdx=\"1\" label=\"Drill-Through Definition1\"><drillParameter name=\"RetailerName\" value=\"Ultra Sports\"/><drillParameter name=\"OrderDate\" value=\"2004-09-09T06:15:31.000000000\"/><\/drillTarget>
               */
               var dtEsc = dt.replace(/(\\")/g, '"').replace(/(\\\/)/g, '/');
               var drills = uiController.parseDrillXmlParameters(dtEsc);

               for (var i = 0; i < drills.length; ++i) {
                  var drillTargetPath = uiController.tabbedPanel.currentTab.evalInIframe( "drillTargets[" + drills[i].drillTargetIndex + "].m_path");
                  uiController.addDrillTab(drillTargetPath, drills[i].paramNames, drills[i].paramValues );
               }
            }
            catch (e) {
               alert ("Error parsing dt : " + dt);
            }
         }
      }
   }
};
