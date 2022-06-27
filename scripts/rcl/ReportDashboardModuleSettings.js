//-----------------------------------------------------------------------------
/**
 * RCL folder
 *
 * @constructor
 * @author Roger Moore
 **/

function RclFolder(aId, aName)
{
   this.id = aId;
   this.name = aName;
   this.children = new Array();
}

RclFolder.prototype.addChild = function(aRclFolder)
{
   this.children.push(aRclFolder);
};

RclFolder.prototype.hasChildren = function()
{
   if (this.children.length>0)
   {
      return true;
   }
   else
   {
      return false;
   }
};

function ReportDashboardModuleSettingsUiModel(aRootRclFolder, aSelectedTargets)
{
   this.rootRclFolder = aRootRclFolder;
   this.selectedTargets = aSelectedTargets;
}

function ReportDashboardModuleSettingsUiController(aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);
      this.model = aModel;
      this.folderTree = new Tree("treeContainer");
      this.folderTree.addObserver(this);
      this.folderTree.isMultiSelect = false;

      var imageDir = ServerEnvironment.imageDir + "/";
      Tree.imageDir = ServerEnvironment.imageDir;

      //--- two node types, Folder and Document, Document nodes allow node selection,
      //    Folders nodes do not

      this.rootNodeType = new TreeNodeType("folder", "selectedDoc", "unSelectedDoc", imageDir + "folderYellowOpen.gif", imageDir + "folderYellowClosed.gif", true);
      this.folderNodeType = new TreeNodeType("folder", "selectedDoc", "unSelectedDoc", imageDir + "folderYellowOpen.gif", imageDir + "folderYellowClosed.gif", true);

      this.folderIdToReportsMap = new Object(); //mapping of folder id's to the targets (report or profiles) contained in that folder

      this.availableReports = new JsListBox ("availableReports", "availableReports", new Array() , new SimpleFieldExtractor('id','name') );
      this.selectedReports  = new JsListBox ("selectedTargetList", "selectedTargetList", this.model.selectedTargets , new SimpleFieldExtractor('id','name') );

      this.availableReports.isMultiSelect = false;

      //these lists are hidden, but used to populate the id and names set back to the server
      this.selectedTargetIds    = new JsListBox ("targetIds",   "targetIds", new Array() , new SimpleFieldExtractor('id','name') );
      this.selectedTargetNames  = new JsListBox ("targetNames", "targetNames", new Array() , new SimpleFieldExtractor('name','name') );

   }
}

ReportDashboardModuleSettingsUiController.prototype = new AbstractUiController();
ReportDashboardModuleSettingsUiController.prototype.constructor = ReportDashboardModuleSettingsUiController;
ReportDashboardModuleSettingsUiController.superclass = AbstractUiController.prototype;

/**
 * initialize the ui...
 **/
ReportDashboardModuleSettingsUiController.prototype.initUi = function()
{
   this.setEndCondition();


   //--- now wire in the calendar...
   Calendar.setup( {
         inputField : 'startDate', // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button :  'startDateBnt' // ID of the button
      }
   );

   if ($('endDateTxt')!=null)
   {
      Calendar.setup({
         inputField : 'endDateTxt', // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button :  'endDateBnt' // ID of the button
      }
     );
   }

   this.initFolderTree();
   this.folderTree.refreshView();
   this.folderTree.collapseAllNonRoot();

   this.hideShowTimingSections();

   var previousSelection =$F('selectedFolderId');
   if (JsUtil.isGood(previousSelection) && JsUtil.trim(previousSelection).length>0)
   {
      this.folderTree.selectSingleNodeById(previousSelection);
      this.folderTree.expandToShowSelected();

   }
   this.folderTree.refreshView();
   this.resetAvailableReports();
   this.selectedReports.refreshView();

   this.refreshView();
}

ReportDashboardModuleSettingsUiController.prototype.setEndCondition = function()
{
   if ($('endDateTxt')==null) return; //no end date showing

   var endDate = document.forms[0].endDate.value
   var numberOfExecutions = document.forms[0].numberOfExecutions.value;

   if( JsUtil.isGood(endDate) && JsUtil.trim(endDate).length>0)
   {
      $('endDateTxt').value = endDate;
      this.setRadioValue('endType', 'date');
      return;
   }
   else if( numberOfExecutions>0 && $('numExecutionsTxt')!=null /*not visible on some weekly, monthly, or yearly*/)
   {
      $('numExecutionsTxt').value = numberOfExecutions;
      this.setRadioValue('endType', 'numberOfExecutions');
      return;
   }
   else
   {
      this.setRadioValue('endType', 'indefinite') ;
      return;
   }
};

ReportDashboardModuleSettingsUiController.prototype.harvestEndCondition = function()
{
   if ($('endDateTxt')==null) return; //no end date showing

   $('endDate').value = '';
   $('numberOfExecutions').value = '-1'; //minus one is indefinite

   var endType =  this.getRadioValue('endType') ;

   if ('date'==endType)
   {
      $('endDate').value = $F('endDateTxt');
   }
   else if ('numberOfExecutions'==endType)
   {
      $('numberOfExecutions').value = $F('numExecutionsTxt');
   }

};

ReportDashboardModuleSettingsUiController.prototype.validateEndCondition = function()
{
   if ($('endDateTxt')==null) return true; //no end date showing

   var endType =  this.getRadioValue('endType') ;

   if ('date' == endType)
   {
      if (!this.validateDate($F('endDateTxt'), "%Y-%m-%d"))
      {
         alert(applicationResources.getProperty('scheduler.errors.invalidEndDate'));
         return false;
      }
   }
   else if ('numberOfExecutions' == endType)
   {
      return this.validateInterval('numExecutionsTxt', 'scheduler.errors.numberOfExecutions.lessThanEqualZero')
   }

   return true;

}



/**
 * hook for derived classes to do something (e.g. client side validation)
 * before submitting.  If the method returns false, the submit will be
 * cancelled.
 **/
ReportDashboardModuleSettingsUiController.prototype.beforeSubmit = function()
{
   if( !this.availableReports.getSelectedItems().length > 0 )
   {
      alert(applicationResources.getProperty('scheduleWizard.noTargetSelected'));
      return false;
   }
   this.selectedReports.clearList();
   this.availableReports.copySelectedToOtherList(this.selectedReports, false);

   var scheduleType = $F('scheduleType');

   if (scheduleType == ReportDashboardModuleSettingsEnum.DAILY.value)
   {
      if (!this.validateInterval('dailyMinuteInterval', 'scheduler.errors.dailyInterval.lessThanEqualZero') ||
          !this.validateInterval('dailyHourInterval', 'scheduler.errors.dailyInterval.lessThanEqualZero') ||
          !this.validateInterval('dailyDayInterval', 'scheduler.errors.dailyInterval.lessThanEqualZero') )
      {
         return false;
      }
   }
   else if (scheduleType == ReportDashboardModuleSettingsEnum.WEEKLY.value )
   {
      if (!this.validateInterval('weeklyInterval', 'scheduler.errors.weeklyInterval.lessThanEqualZero') )
      {
         return false;
      }

      var firstSelected = this.getRadioValue('weeklyDays'); //will return the first selected value
      if (firstSelected==null)
      {
         alert(applicationResources.getProperty('scheduler.errors.weeklyDays.noDaysSelected'));
         return false;
      }
   }
   else if (scheduleType == ReportDashboardModuleSettingsEnum.MONTHLY.value )
   {
      var monthlyValue = this.getRadioValue('monthlyType');

      if (monthlyValue == 'relative')
      {
         if (!this.validateInterval('monthlyRelativeInterval', 'scheduler.errors.monthlyInterval.lessThanEqualZero') )
         {
            return false;
         }
      }
      else
      {
         if (!this.validateInterval('monthlyAbsoluteInterval', 'scheduler.errors.monthlyInterval.lessThanEqualZero'))
         {
            return false;
         }
      }


   }

   if (!this.validateDate($F('startDate'), "%Y-%m-%d"))
   {
      alert(applicationResources.getProperty('scheduler.errors.invalidStartDate'));
      return false;
   }

   //for the time we just stick a random date on it and pass to validateDate; interestingly you can not just pass the time and adjust the format (times like 4:56 mess up)
   if (!this.validateDate('2006-12-29 ' + $F('startTime') + ' ' + $F('startTimeAmPm')  , "%Y-%m-%d %l:%M %p"))
   {
      alert(applicationResources.getProperty('scheduler.errors.invalidStartTime'));
      return false;
   }

   if (!this.validateEndCondition())
   {
      return false;
   }
   var scheduleName =$F('nameElem');
   if ( !JsUtil.isGood(scheduleName) || JsUtil.trim(scheduleName).length==0)
   {
      alert(applicationResources.getProperty("scheduleWizard.nameMissing"));
      return false;
   }

   this.selectedReports.selectAll();

   if ( this.selectedReports.getSelectedItems().length == 0)
   {
      alert(applicationResources.getProperty("scheduleWizard.noTargetSelected"));
      return false;
   }

   return true;
};


/**
 * hook for derived classes to do something when form submission is
 * imminent...
 **/
ReportDashboardModuleSettingsUiController.prototype.willSubmit = function()
{
   this.harvestEndCondition();
   this.selectedTargetIds.resetAvailableItems(this.selectedReports.getSelectedSrcObjects());
   this.selectedTargetNames.resetAvailableItems(this.selectedReports.getSelectedSrcObjects());

   var selectedFolders = this.folderTree.getSelectedSrcObjects();
   $('selectedFolderId').value = (selectedFolders.length==0) ? '' : selectedFolders[0].id;
   this.selectedTargetIds.selectAll();
   this.selectedTargetNames.selectAll();
};

ReportDashboardModuleSettingsUiController.prototype.getSelectedType = function()
{
   for( var index = 0; index < document.forms[0].scheduleType.length; index++ )
   {
      var eachRadio = document.forms[0].scheduleType[index];
      if( eachRadio.checked )
      {
         return eachRadio.value;
      }
   }
}
ReportDashboardModuleSettingsUiController.prototype.hideShowTimingSections = function()
{

   var scheduleType = this.getSelectedType();

   if (scheduleType == ScheduleTypeEnum.DAILY.value)
   {
      document.getElementById("dailyTrigger").style.display = "";
      document.getElementById("dailyEndDiv").style.display = "";
      document.getElementById("weeklyTrigger").style.display = "none";
      document.getElementById("monthlyTrigger").style.display = "none";
      document.getElementById("yearlyTrigger").style.display = "none";
   }
   else if (scheduleType == ScheduleTypeEnum.WEEKLY.value )
   {
      document.getElementById("dailyTrigger").style.display = "none";
      document.getElementById("dailyEndDiv").style.display = "none";
      document.getElementById("weeklyTrigger").style.display = "";
      document.getElementById("monthlyTrigger").style.display = "none";
      document.getElementById("yearlyTrigger").style.display = "none";
   }
   else if (scheduleType == ScheduleTypeEnum.MONTHLY.value )
   {
      document.getElementById("dailyTrigger").style.display = "none";
      document.getElementById("dailyEndDiv").style.display = "none";
      document.getElementById("weeklyTrigger").style.display = "none";
      document.getElementById("monthlyTrigger").style.display = "";
      document.getElementById("yearlyTrigger").style.display = "none";
   }
   else if (scheduleType == ScheduleTypeEnum.YEARLY.value )
   {
      document.getElementById("dailyTrigger").style.display = "none";
      document.getElementById("dailyEndDiv").style.display = "none";
      document.getElementById("weeklyTrigger").style.display = "none";
      document.getElementById("monthlyTrigger").style.display = "none";
      document.getElementById("yearlyTrigger").style.display = "";
   }
}

ReportDashboardModuleSettingsUiController.prototype.validateDate = function(aDate, aFormat)
{
   return Date.validateDateStr(aDate, aFormat, false);
};

ReportDashboardModuleSettingsUiController.prototype.validateInterval = function(aIntervalName, aErrorProperty)
{
   var element = $(aIntervalName);

   if (element==null) return true; //element does not exist must be different type

   var value = element.value;

   var number = parseInt(value, 10);  //use base 10 to prevent leading zero from being considered octal

   if (isNaN(number) || number<=0)
   {
      alert(applicationResources.getProperty(aErrorProperty));
      return false;
   }

   return true;
};

ReportDashboardModuleSettingsUiController.prototype.refreshView = function()
{
   this.refreshDailySelections();
   this.refreshMonthlySelections();
   this.refreshYearlySelections();
   this.refreshEndSelections();
};

ReportDashboardModuleSettingsUiController.prototype.refreshEndSelections = function()
{

}

ReportDashboardModuleSettingsUiController.prototype.refreshDailySelections = function()
{
   var radioOptions = this.document.getElementsByName('dailyRate');

   if (radioOptions==null) return; //this would happen if daily was not the given schedule type


   for (var i = 0; i < radioOptions.length; i++)
   {
      var eachValue = radioOptions[i];

      if ("days" == eachValue.value )
      {
         var textBox = $('dailyDayInterval')
         textBox.disabled = !eachValue.checked;

         if (textBox.disabled) textBox.value=1;
      }
      else if ("hours" == eachValue.value )
      {
         var textBox = $('dailyHourInterval')
         textBox.disabled = !eachValue.checked;

         if (textBox.disabled) textBox.value=1;
      }
      else if ("minutes" == eachValue.value )
      {
         var textBox = $('dailyMinuteInterval')
         textBox.disabled = !eachValue.checked;

         if (textBox.disabled) textBox.value=1;
      }

   }
};

ReportDashboardModuleSettingsUiController.prototype.refreshMonthlySelections = function()
{

   var monthlyValue = this.getRadioValue('monthlyType');

   if (monthlyValue==null) return null; //not a monthly schedule

   if (monthlyValue == "relative")
   {
      this.document.getElementById('monthlyWeek').disabled = false;
      this.document.getElementById('monthlyWeekDay').disabled = false;
      this.document.getElementById('monthlyRelativeInterval').disabled = false;

      this.document.getElementById('monthlyDay').disabled = true;
      this.document.getElementById('monthlyAbsoluteInterval').disabled = true;
   }
   else
   {
      this.document.getElementById('monthlyWeek').disabled = true;
      this.document.getElementById('monthlyWeekDay').disabled = true;
      this.document.getElementById('monthlyRelativeInterval').disabled = true;

      this.document.getElementById('monthlyDay').disabled = false;
      this.document.getElementById('monthlyAbsoluteInterval').disabled = false;

   }
};

ReportDashboardModuleSettingsUiController.prototype.refreshYearlySelections = function()
{

   var yearlyValue = this.getRadioValue('yearlyType');

   if (yearlyValue==null) return; //not a yearly schedule

   if (yearlyValue == "relative")
   {
      this.document.getElementById('yearlyWeek').disabled = false;
      this.document.getElementById('yearlyWeekDay').disabled = false;
      this.document.getElementById('yearlyRelativeMonth').disabled = false;

      this.document.getElementById('yearlyDay').disabled = true;
      this.document.getElementById('yearlyAbsoluteMonth').disabled = true;
   }
   else
   {
      this.document.getElementById('yearlyWeek').disabled = true;
      this.document.getElementById('yearlyWeekDay').disabled = true;
      this.document.getElementById('yearlyRelativeMonth').disabled = true;

      this.document.getElementById('yearlyDay').disabled = false;
      this.document.getElementById('yearlyAbsoluteMonth').disabled = false;
   }
};


/**
 *  returns "days" "minutes" or "hours" depending on what is selected
 **/
ReportDashboardModuleSettingsUiController.prototype.getDailyRateType = function ()
{
   return getRadioValue('dailyRate');
};

ReportDashboardModuleSettingsUiController.prototype.setRadioValue = function (aElementId, aValue)
{

   var radioOptions = this.document.getElementsByName(aElementId);


   for (var i = 0; i < radioOptions.length; i++)
   {
      var eachValue = radioOptions[i];
      //alert (eachValue.name);
      //alert (eachValue.checked);
      //alert (eachValue.value);
      if (eachValue.value == aValue)
      {
         //alert ('checking ' + eachValue.value);
         eachValue.checked = true
      }
      else
      {
        eachValue.checked = false;
      }

   }

   return null;
};

ReportDashboardModuleSettingsUiController.prototype.getRadioValue = function (aElementId)
{

   var radioOptions = this.document.getElementsByName(aElementId);

   if (radioOptions==null)   //note we do depend on this behavior in the refresh monthly and yearly methods above
       return null;

   for (var i = 0; i < radioOptions.length; i++)
   {
      var eachValue = radioOptions[i];
      //alert (eachValue.name);
      //alert (eachValue.checked);
      if (eachValue.checked == true)
      {
         return eachValue.value;
      }
   }

   return null;
};

ReportDashboardModuleSettingsUiController.prototype.initFolderTree = function()
{
   var rootRclFolder = this.model.rootRclFolder;

   var root = this.createRootTreeNode(rootRclFolder);
   this.folderTree.addRootNode(root);

   this.addChildren(root, rootRclFolder);

};

ReportDashboardModuleSettingsUiController.prototype.createFolderTreeNode = function(aRclFolder)
{
   return this.folderTree.createNode(aRclFolder.id, aRclFolder.name, this.folderNodeType, aRclFolder, false);
};

ReportDashboardModuleSettingsUiController.prototype.createRootTreeNode = function(aRclFolder)
{
   return this.folderTree.createNode(aRclFolder.id, aRclFolder.name, this.rootNodeType, aRclFolder, false);
};


ReportDashboardModuleSettingsUiController.prototype.addChildren = function(aCurTreeRoot, aCurRclFolder)
{
    for (var i=0; i<aCurRclFolder.children.length; i++)
    {
       var childFolder = aCurRclFolder.children[i];

       var newTreeNode = this.createFolderTreeNode(childFolder);
       aCurTreeRoot.addChild(newTreeNode);
       if (childFolder.hasChildren())
       {
          this.addChildren(newTreeNode, childFolder);
       }
   }
};

ReportDashboardModuleSettingsUiController.prototype.openSelectReportsDialog = function()
{
   var rclDialog = new RclDialog();
            rclDialog.showFolderChooserDialog(applicationResources.getProperty("admin.folders.selectFolder.title"),
                    "",
                    null,
                    false, "folderChooser", "", "public");
};


ReportDashboardModuleSettingsUiController.prototype.getReportsForFolder = function (aRclFolder)
{
    var reports = this.folderIdToReportsMap[aRclFolder.id];

    if (reports==null)
    {
       //make AJAX call to get reports for folder
       var url = ServerEnvironment.contextPath + "/secure/actions/getRclFolderContents.do?";
       var httpParams = Form.serialize(document.forms[0]);

       var myAjax = new Ajax.Request(
               url,
       {

          method: 'get',
          asynchronous:false,
          parameters:'folderId=' + aRclFolder.id,


          onFailure : function(resp)
          {
             alert(applicationResources.getProperty("userPrefs.serverError"));
          },

          onException : function(resp)
          {
             alert(applicationResources.getProperty("userPrefs.serverError"));
          }
       });

       eval(myAjax.transport.responseText)

       reports = folderContents;  //folderContents set in javascript written by AJAX call


       this.folderIdToReportsMap[aRclFolder.id] = reports;
    }



   return reports;

};


ReportDashboardModuleSettingsUiController.prototype.insertSelectedTargets = function (aRclFolder)
{
   this.availableReports.copySelectedToOtherList(this.selectedReports, false);
   this.selectedReports.refreshView();

};

ReportDashboardModuleSettingsUiController.prototype.removeSelectedTargets = function (aRclFolder)
{
   this.selectedReports.removeSelected();
   this.selectedReports.refreshView();
};

ReportDashboardModuleSettingsUiController.prototype.resetAvailableReports = function ()
{
   var selectedObjects =this.folderTree.getSelectedSrcObjects();

   if (selectedObjects.length > 0)
   {
      this.updateAvailableReports(selectedObjects[0]);
   }
   else
   {
      this.availableReports.refreshView();
   }
}
ReportDashboardModuleSettingsUiController.prototype.updateAvailableReports = function (aRclFolder)
{
   var reports = this.getReportsForFolder(aRclFolder);

   this.availableReports.resetAvailableItems(reports);
   this.availableReports.refreshView();

   /*
   for (var i=0; i<reports.length; i++)
   {
      var report = reports[i];
      alert ("report [" + report.id + "] [" + report.name +"]");
   }
   */
};
/**
 * implementation of observer interface, wired to the folder tree
 **/
ReportDashboardModuleSettingsUiController.prototype.processEvent = function (anEvent)
{
   if (anEvent.type == ObservableEventType.TREE_NODE_SELECTED)
   {
      var srcObject = anEvent.payload.srcObject;
      this.updateAvailableReports(srcObject);
   }

};

ReportDashboardModuleSettingsUiController.prototype.save = function()
{
   if (this.beforeSubmit())
   {
      this.beginPleaseWaitDiv(applicationResources.getProperty("profileWizard.saving"));
//      this.setViewGesture("save");
      this.doSubmit();
   }
};

