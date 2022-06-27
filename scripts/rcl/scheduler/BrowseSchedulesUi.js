/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: BrowseSchedulesUi.js 8212 2013-04-12 20:15:16Z dk $

//-----------------------------------------------------------------------------
/**
 * I am the JavaScript representation of a Schedule
 * ScheduleSummary( Long aId, String aScheduleName, Date aPreviousRunTime, Date aNextRunTime, ScheduleStatusEnum aStatus)
 * @constructor
 **/
function ScheduleSummary (aId, aScheduleName, aPreviousRunTime, aNextRunTime, aStatus, aUser)
{
   this.id = aId;
   this.scheduleName = aScheduleName;
   this.previousRunTime = aPreviousRunTime;
   this.nextRunTime = aNextRunTime;
   this.status = aStatus;
   this.user = aUser;
}


ScheduleSummary.prototype.getStatusHtml = function()
{
   var rerStatusCssClass;

   if (this.status < 0)
   {
      rerStatusCssClass = "rerFailed";
   }
   else if (this.status == ScheduleStatusEnum.NORMAL.value)
   {
      rerStatusCssClass = "rerFinished";
   }
   else
   {
      rerStatusCssClass = "rerInProgress";
   }

   var statusString = uiModel.scheduleStatusStrings['' + this.status];

   return '<span class="' + rerStatusCssClass + '">' + statusString + '</span>';
}

ScheduleSummary.prototype.toString = function()
{
   return '(' + this.id + ') ' + this.scheduleName + ' :: ' + uiModel.scheduleStatusStrings['' + this.status] + ' :: ' + this.startTime
}


//-----------------------------------------------------------------------------
/**
 * I am the UI model for the BrowseSchedules screen...
 *
 * @constructor
 * @author Ryan Baula (rbaula@seekfocus.com)
 **/
function BrowseSchedulesUiModel (aScheduleSummaries, aScheduleStatusStrings)
{
   this.scheduleSummaries = aScheduleSummaries;
   this.scheduleStatusStrings = aScheduleStatusStrings;
}




//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the BrowseSchedules screen...
 *
 * @constructor
 * @author Ryan Baula (rbaula@seekfocus.com)
 **/
function BrowseSchedulesUiController (aDocument, aModel)
{
   AbstractWorkspaceUiController.prototype.constructor.call(this, aDocument);
   this.uiModel = aModel;

   var gridDataProvider = {
      getSourceObjects : function () {
         return uiModel.scheduleSummaries;
      },

      populateRow : function (aSchedule, aRow)
      {
         aRow.addCell (new Cell(aSchedule.id));
         aRow.addCell (new Cell(aSchedule.scheduleName));

         var cell = new Cell(aSchedule.status);
         cell.valueWithMarkup = aSchedule.getStatusHtml();
         aRow.addCell (cell);

         aRow.addCell (new Cell(aSchedule.previousRunTime));
         aRow.addCell (new Cell(aSchedule.nextRunTime));
         aRow.addCell (new Cell(aSchedule.user));
      }
   }

   var columnDescriptors = [
      new ColumnDescriptor(applicationResources.getProperty("browseSchedules.header.id"), true, DataType.NUMERIC),
      new ColumnDescriptor(applicationResources.getProperty("browseSchedules.header.scheduleName"), true, DataType.STRING),
      new ColumnDescriptor(applicationResources.getProperty("browseSchedules.header.status"), true, DataType.NUMERIC),
      new ColumnDescriptor(applicationResources.getProperty("browseSchedules.header.previousRun"), true, DataType.STRING_DATE),
      new ColumnDescriptor(applicationResources.getProperty("browseSchedules.header.nextRun"), true, DataType.STRING_DATE),
      new ColumnDescriptor(applicationResources.getProperty("browseSchedules.header.user"), true, DataType.STRING)
   ];


   this.grid = new JsGrid(aDocument, "scheduleGrid", true, columnDescriptors, gridDataProvider);
   this.grid.imageDir = ServerEnvironment.baseUrl + "/images";
   this.grid.addObserver(this);
   //this.grid.maxRowsForDisplay = 100;

   this.autoRefreshFrequency = 30;
}


//--- This class extends AbstractUiController
BrowseSchedulesUiController.prototype = new AbstractWorkspaceUiController();
BrowseSchedulesUiController.prototype.constructor = BrowseSchedulesUiController;
BrowseSchedulesUiController.superclass = AbstractWorkspaceUiController.prototype;


/**
* called once (after document is fully loaded) to initialize the user interface
**/
BrowseSchedulesUiController.prototype.initUi = function()
{
   //--create button bar
//   Ext.QuickTips.init();

   var tb = new Ext.Toolbar();
   tb.render('toolbar');

   this.REFRESH_BUTTON_ID = Ext.id();
   this.RUN_BUTTON_ID = Ext.id();
   this.PAUSE_BUTTON_ID = Ext.id();
   this.RESUME_BUTTON_ID = Ext.id();
   this.EDIT_BUTTON_ID = Ext.id();
   this.DELETE_BUTTON_ID = Ext.id();


   // They can also be referenced by id in or components
   tb.add({
      cls: 'x-btn-icon',
      id: this.REFRESH_BUTTON_ID,
      handler: function (btn)
      {
         this.buttonClicked(btn);
      },
      scope: this,
//         tooltip: {text:'Refresh Folder Contents', autoHide:true},
      icon: ServerEnvironment.baseUrl + "/images/bbar_icons/" + 'actionRefresh.gif'
   }, '-');

   tb.add(
      this.createButton(this.RUN_BUTTON_ID, "actionExecute.gif", this.buttonClicked, applicationResources.getProperty("browseSchedules.buttonBar.run")), '-',
      this.createButton(this.PAUSE_BUTTON_ID, "actionPause.gif", this.buttonClicked, applicationResources.getProperty("browseSchedules.buttonBar.pause")), '-',
      this.createButton(this.RESUME_BUTTON_ID, "actionResume.gif", this.buttonClicked, applicationResources.getProperty("browseSchedules.buttonBar.resume")), '-',
      this.createButton(this.EDIT_BUTTON_ID, "actionEdit.gif", this.buttonClicked, applicationResources.getProperty("browseSchedules.buttonBar.edit")), '-',
      this.createButton(this.DELETE_BUTTON_ID, "actionDelete.gif", this.buttonClicked, applicationResources.getProperty("browseSchedules.buttonBar.delete"))
   );

   //--- sortBy automatically refreshes the view when its done...
   this.grid.sortBy(this.grid.columnDescriptors[0], -1);

   this.installCallBack();

   this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/blankProperties.do?userLocale=" + ServerEnvironment.userLocale); // todo

   this.addDoubleClick();
   tb.doLayout();
};

/**
 * this is an override of the baseclass method, we want the scrollbar to be on the
 * folder
 **/
BrowseSchedulesUiController.prototype.onFrameResize = function()
{
   var newBodyHeight;
   var contentShellOffSet;

   if (is_ie)
   {
      var geom = new BrowserGeometry();
      newBodyHeight = geom.height - 14;
      contentShellOffSet = 6;
   }
   else
   {
      newBodyHeight = top.frames["workSpace"].innerHeight - 14;
      contentShellOffSet = 14;
   }

   var toolbarHeight = 92;

   if (newBodyHeight < toolbarHeight)
      newBodyHeight = toolbarHeight;


   document.getElementById("bodyDiv").style.height = newBodyHeight + "px";
   document.getElementById("contentShell").style.height = (newBodyHeight - contentShellOffSet ) + "px";


   document.getElementById("workspaceBody").style.height = (newBodyHeight -toolbarHeight)+ "px";
};



BrowseSchedulesUiController.prototype.installCallBack = function()
{
   for (var i = 0; i < this.uiModel.scheduleSummaries.length; ++i)
   {
      //--- install callback...
      window.setTimeout("uiController.refreshInProgressSchedules();", this.autoRefreshFrequency*1000);
      return;
   }
};

/**
 * for the RER's which are still in progress, make a single async call to get their
 * upated status values...
 **/
BrowseSchedulesUiController.prototype.refreshInProgressSchedules = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/getScheduleSummaries.do?";
   var httpParams = '';

   this.refreshingScheduleIndexesByScheduleId = new Object();

   for (var i = 0; i < this.uiModel.scheduleSummaries.length; ++i)
   {
      this.refreshingScheduleIndexesByScheduleId[this.uiModel.scheduleSummaries[i].id] = i;
      httpParams += "scheduleId=" + this.uiModel.scheduleSummaries[i].id + "&";
   }

   //--- async request setup...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      try
      {

         // response is :
         //
         //    var rerSummaries = [...];
         //
         eval(anXmlHttpRequest.responseText);

         uiController.updateScheduleSummaries (scheduleSummaries);
         uiController.installCallBack();
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
};


/**
 * new versions of certain (in progress) rerSummaries have been downloaded, we need
 * to update the ui...
 **/
BrowseSchedulesUiController.prototype.updateScheduleSummaries = function(aScheduleSummaries)
{
   var oldSchedule = null;
   var targetIndex;

   for (var i = 0; i < aScheduleSummaries.length; ++i)
   {
      targetIndex = this.refreshingScheduleIndexesByScheduleId[aScheduleSummaries[i].id];
      oldSchedule = this.uiModel.scheduleSummaries[targetIndex];

      this.uiModel.scheduleSummaries[targetIndex] = aScheduleSummaries[i];
      this.updateIndividualScheduleSummary(oldSchedule, aScheduleSummaries[i])
   }
   //this.grid.refreshView();
};

BrowseSchedulesUiController.prototype.updateIndividualScheduleSummary = function(anOldSchedule, aScheduleSummary)
{
   anOldSchedule.jsgRow.updateUserObjectAndRedraw(aScheduleSummary);
   this.addDoubleClick();
};


BrowseSchedulesUiController.prototype.buttonClicked = function(anIt)
{
   switch(anIt.id)
   {
      case this.REFRESH_BUTTON_ID:
         this.refreshPage();
         break;
      case this.DELETE_BUTTON_ID:
         this.deleteSelectedSchedules();
         break;
      case this.RESUME_BUTTON_ID:
         this.resumeSelectedSchedules();
         break;
      case this.PAUSE_BUTTON_ID:
         this.pauseSelectedSchedules();
         break;
      case this.RUN_BUTTON_ID:
         this.runSelectedSchedules();
         break;
      case this.EDIT_BUTTON_ID:
         this.editSelectedSchedules();
         break;
      default:
         alert("warning - don't know how to handle button click with id [" + anIt.id + "]");
         break;
   }
};

/**
 * delete the currently selected RERs...
 **/
BrowseSchedulesUiController.prototype.deleteSelectedSchedules = function()
{
   var selected = this.grid.getSelectedUserObjects();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("scheduler.errors.selectSchedules"));
   }
   else
   {
      //--- do async request to launch reports...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();

      var url = ServerEnvironment.baseUrl + "/secure/actions/deleteSchedule.do";

      this.startPleaseWaitDiv(null, applicationResources.getProperty("pleaseWaitDiv.scheduler.deleting"));

      var httpParams = '';
      for (var i = 0; i < selected.length; ++i)
      {
         httpParams += "scheduleIds=" + selected[i].id + "&";
      }

      var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
         try
         {
            uiController.endPleaseWaitDiv();
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
};

/**
 * edit the currently selected RERs...
 **/
BrowseSchedulesUiController.prototype.editSelectedSchedules = function()
{
   var selected = this.grid.getSelectedUserObjects();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("scheduler.errors.selectSchedules"));
   }
   else
   {

      var url = ServerEnvironment.baseUrl + "/secure/actions/editSchedule.do?scheduleId=" + selected[0].id;

      var windowName = ServerEnvironment.windowNamePrefix + "_NewSchedule";

      var geom = new BrowserGeometry();
      win = window.open(url,
              windowName,
              "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
      //                          "width=900,height=700,top=" + geom.top + ",left=" + geom.left + ",menubar=yes,toolbar=yes,scrollbars=no,resizable=yes,status=yes");

      win.focus();
    }
};


/**
 * pause the currently selected schedules...
 **/
BrowseSchedulesUiController.prototype.pauseSelectedSchedules = function()
{
   var selected = this.grid.getSelectedUserObjects();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("scheduler.errors.selectSchedules"));
   }
   else
   {
      //--- do async request to launch reports...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();

      var url = ServerEnvironment.baseUrl + "/secure/actions/pauseSchedule.do";

      this.startPleaseWaitDiv(null, applicationResources.getProperty("pleaseWaitDiv.scheduler.pausing"));

      var httpParams = '';
      for (var i = 0; i < selected.length; ++i)
      {
         httpParams += "scheduleIds=" + selected[i].id + "&";
      }

      var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
         try
         {
            uiController.endPleaseWaitDiv();
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
};

/**
 * run the currently selected schedules...
 **/
BrowseSchedulesUiController.prototype.runSelectedSchedules = function()
{
   var selected = this.grid.getSelectedUserObjects();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("scheduler.errors.selectSchedules"));
   }
   else
   {
      //--- do async request to launch reports...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();

      var url = ServerEnvironment.baseUrl + "/secure/actions/runSchedule.do";

      this.startPleaseWaitDiv(null, applicationResources.getProperty("msg.scheduler.running"));

      var httpParams = '';
      for (var i = 0; i < selected.length; ++i)
      {
         httpParams += "scheduleIds=" + selected[i].id + "&";
      }

      var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
         try
         {
            uiController.endPleaseWaitDiv();
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
};

/**
 * resume the currently selected schedules...
 **/
BrowseSchedulesUiController.prototype.resumeSelectedSchedules = function()
{
   var selected = this.grid.getSelectedUserObjects();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("scheduler.errors.selectSchedules"));
   }
   else
   {
      //--- do async request to launch reports...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();

      var url = ServerEnvironment.baseUrl + "/secure/actions/resumeSchedule.do";

      this.startPleaseWaitDiv(null, applicationResources.getProperty("pleaseWaitDiv.scheduler.resuming"));

      var httpParams = '';
      for (var i = 0; i < selected.length; ++i)
      {
         httpParams += "scheduleIds=" + selected[i].id + "&";
      }

      var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
         try
         {
            uiController.endPleaseWaitDiv();
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
};

BrowseSchedulesUiController.prototype.nextPage = function ()
{
   this.doSkipToPage(parseInt(this.document.forms[0].currentPageNumber.value) + 1);
};

BrowseSchedulesUiController.prototype.previousPage = function ()
{
   this.doSkipToPage(parseInt(this.document.forms[0].currentPageNumber.value) - 1);
};

BrowseSchedulesUiController.prototype.firstPage = function ()
{
   this.doSkipToPage(0);
};

BrowseSchedulesUiController.prototype.lastPage = function ()
{
   this.doSkipToPage(this.document.forms[0].totalPages.value - 1);
};

BrowseSchedulesUiController.prototype.modifyUserInputSkipToPage = function (anEvent)
{
   var evt = JsUtil.normalizeEvent(anEvent);
   if (evt.keyCode == 13)
   {
      this.doSkipToPage(this.document.forms[0].displayCurrentPageNumber.value - 1);
      return false;
   }
};

BrowseSchedulesUiController.prototype.doSkipToPage = function (aValue)
{
   this.document.forms[0].skipToPage.value = aValue;

   if ($F('adminViewAll') == 'true')
   {
      this.document.forms[0].action = ServerEnvironment.contextPath + "/secure/actions/admin/browseSchedules.do";
   }

   this.startPleaseWaitDiv(null, applicationResources.getProperty("general.submittingRequest"));
   this.document.forms[0].submit();
};


BrowseSchedulesUiController.prototype.processEvent = function(anEvent)
{
//   alert('got an event (' + anEvent.type.family + ') [' + anEvent + "]");
   this.gridSelectionChanged();
};

/**
 * called when the grid selection changes
 **/
BrowseSchedulesUiController.prototype.gridSelectionChanged = function ()
{
   var selected = this.grid.getSelectedUserObjects();
   if (selected.length == 0 || selected.length > 1)
   {
      this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/blankProperties.do?userLocale=" + ServerEnvironment.userLocale);
   }
   else
   {
      this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/getScheduleDetails.do?scheduleId=" + selected[0].id);
   }
};


BrowseSchedulesUiController.prototype.addDoubleClick = function()
{
   for (var i = 0; i < this.grid.rows.length; i++)
   {
      this.grid.rows[i].domElement.ondblclick = new Function("uiController.editSelectedSchedules();");
   }
};

BrowseSchedulesUiController.prototype.pauseOrResumeSelectedSchedule = function()
{
  var selected = this.grid.getSelectedUserObjects();
  if(selected[0].status == ScheduleStatusEnum.PAUSED.value)
  {
     this.resumeSelectedSchedules();
  } else if(selected[0].status == ScheduleStatusEnum.NORMAL.value)
  {
     this.pauseSelectedSchedules();
  }
};