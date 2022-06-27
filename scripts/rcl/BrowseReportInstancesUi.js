/**
 Copyright 2001-2008, Focus Technologies LLC.
 All rights reserved.
 **/

// $Id: BrowseReportInstancesUi.js 7209 2010-08-04 20:42:49Z jjames $

//-----------------------------------------------------------------------------
/**
 * I am the JavaScript representation of a ReportExecutionRequest
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function RerSummary(aName,
                    aStatus,
                    aStartTime,
                    aLocaleFormattedStartTime,
                    aFinishTime,
                    aLocaleFormattedFinishTime,
                    aReportInstanceId,
                    aRerId,
                    aSourceRerId,
                    aNumberOfTimesViewed,
                    aUser,
                    aIsBurst)
{
   this.name = aName;
   this.status = aStatus;
   this.startTime = aStartTime;
   this.localeFormattedStartTime = aLocaleFormattedStartTime;
   this.finishTime = aFinishTime;
   this.localeFormattedFinishTime = aLocaleFormattedFinishTime;
   this.reportInstanceId = aReportInstanceId;
   this.rerId = aRerId;
   this.sourceRerId = aSourceRerId;
   this.numberOfTimesViewed = aNumberOfTimesViewed;
   this.user = aUser;
   this.isBurst = aIsBurst;

   this.drillArray = new Array();

   this.isSelected = false;
}


RerSummary.prototype.isFinishedOrFailed = function()
{
   return this.status < 0 || this.status == ReportExecutionStatusEnum.FINISHED.value;
}


RerSummary.prototype.getStatusHtml = function()
{
   var rerStatusCssClass;

   if (this.status == -2)
   {
      rerStatusCssClass = "rerCancelled";
   }
   else if (this.status < 0)
   {
      rerStatusCssClass = "rerFailed";
   }
   else if (this.status == ReportExecutionStatusEnum.FINISHED.value)
   {
      rerStatusCssClass = "rerFinished";
   }
   else
   {
      rerStatusCssClass = "rerInProgress";
   }

   var statusString = uiModel.rerStatusStrings['' + this.status];

   return '<span class="' + rerStatusCssClass + '">' + statusString + '</span>';
}

RerSummary.prototype.getBurstHtml = function(id)
{
   return '<span id="burst-'+ id +'">'+ this.rerId + '<img style="position: absolute; float: right; left:55px; height:14px" src=" ' +  ServerEnvironment.imageDir + '/burst.png" title="Burst Report"/></span>';
}

RerSummary.prototype.getStatusTreeNode = function()
{
   if (this.status < 0)
   {
      return TreeNodeTypes.FAILED;
   }
   else if (this.status == ReportExecutionStatusEnum.FINISHED.value)
   {
      return TreeNodeTypes.FINISHED;
   }
   else
   {
      return TreeNodeTypes.IN_PROGRESS
   }
}

RerSummary.prototype.toString = function()
{
   return '(' + this.rerId + ') ' + this.name + ' :: ' + uiModel.rerStatusStrings['' + this.status] + ' :: ' + this.startTime + " :: " + this.user;
}

function TreeNodeTypes()
{
}

TreeNodeTypes.FINISHED = new TreeNodeType("document", "selectedDoc", "unSelectedDoc", ServerEnvironment.imageDir + "/report-finished.gif", ServerEnvironment.imageDir + "/report-finished.gif", true);
TreeNodeTypes.FAILED = new TreeNodeType("document", "selectedDoc", "unSelectedDoc", ServerEnvironment.imageDir + "/report-failed.gif", ServerEnvironment.imageDir + "/report-failed.gif", true);
TreeNodeTypes.IN_PROGRESS = new TreeNodeType("document", "selectedDoc", "unSelectedDoc", ServerEnvironment.imageDir + "/nextPage.gif", ServerEnvironment.imageDir + "/nextPage.gif", true);


//-----------------------------------------------------------------------------
/**
 * I am the UI model for the BrowseReportInstances screen...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function BrowseReportInstancesUiModel(aRerSummaries, aRerStatusStrings)
{
   this.rerSummaries = aRerSummaries;
   this.rerStatusStrings = aRerStatusStrings;
   this.constructTreeStructure();
}

BrowseReportInstancesUiModel.prototype.constructTreeStructure = function()
{
   var rerSummary = null;

   for (var z = 0; z < this.rerSummaries.length; z++)
   {
      rerSummary = this.rerSummaries[z];

      for (var i = 0; i < this.rerSummaries.length; i++)
      {
         var compareToSummary = this.rerSummaries[i];

         if (rerSummary.sourceRerId == compareToSummary.rerId)
         {
            this.rerSummaries[i].drillArray.push(rerSummary);
         }
      }
   }
}



//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the FolderContents screen...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function BrowseReportInstancesUiController(aDocument, aModel)
{
   AbstractWorkspaceUiController.prototype.constructor.call(this, aDocument);
   this.uiModel = aModel;
   this.tree = new Tree("rerList");
   this.tree.isMultiSelect = true;
   this.filterWindowIsVisible = false;


   var gridDataProvider = {
      getSourceObjects : function ()
      {
         return uiModel.rerSummaries;
      },

      populateRow : function (aRer, aRow)
      {


         var idCell = new Cell(aRer.rerId);
         if(aRer.isBurst)
         {
            idCell.valueWithMarkup = aRer.getBurstHtml(aRer.rerId);
         }
         aRow.addCell(idCell);

         aRow.addCell(new Cell(aRer.name));

         var cell = new Cell(aRer.status);
         cell.valueWithMarkup = aRer.getStatusHtml();
         aRow.addCell(cell);

         aRow.addCell(new Cell(aRer.startTime, aRer.localeFormattedStartTime));

         aRow.addCell(new Cell(aRer.user));
      }
   }

   var columnDescriptors = [
           new ColumnDescriptor(applicationResources.getProperty("reportOutputs.header.id"), true, DataType.NUMERIC),
           new ColumnDescriptor(applicationResources.getProperty("reportOutputs.header.targetName"), true, DataType.STRING),
           new ColumnDescriptor(applicationResources.getProperty("reportOutputs.header.status"), true, DataType.NUMERIC),
           new ColumnDescriptor(applicationResources.getProperty("reportOutputs.header.executionTime"), true, DataType.NUMERIC),
           new ColumnDescriptor(applicationResources.getProperty("reportOutputs.header.user"), true, DataType.STRING)
           ];


   this.grid = new JsGrid(aDocument, "rerGrid", true, columnDescriptors, gridDataProvider);
   this.grid.imageDir = ServerEnvironment.baseUrl + "/images";
   this.grid.addObserver(this);
   //this.grid.maxRowsForDisplay = 100;


   this.autoRefreshFrequency = 7;
   this.refreshInProgress = false;
   this.increaseAutoRefreshFrequency = 0;
   this.shoudIncreaseAutoRefreshFrequency = true;
}


//--- This class extends AbstractUiController
BrowseReportInstancesUiController.prototype = new AbstractWorkspaceUiController();
BrowseReportInstancesUiController.prototype.constructor = BrowseReportInstancesUiController;
BrowseReportInstancesUiController.superclass = AbstractWorkspaceUiController.prototype;


/**
 * called once (after document is fully loaded) to initialize the user interface
 **/
BrowseReportInstancesUiController.prototype.initUi = function()
{
   this.enableProperPagingButtons();

   /*if (ServerEnvironment.betaFeaturesEnabled)
   {
      if ($F('adminViewAll') == 'false')
      {
         var displayByFilterMenu = { id:'filterByOptions',name:applicationResources.getProperty("button.filterBy"), entries:[
         { icon:'toggle:filterType', id:'PUBLIC',name:applicationResources.getProperty("button.filterBy.publicItems"),value:'PUBLIC' },
         { icon:'toggle:filterType', id:'PRIVATE',name:applicationResources.getProperty("button.filterBy.privateItems"),value:'PRIVATE' },
         { icon:'toggle:filterType', id:'COMBINED',name:applicationResources.getProperty("button.filterBy.combinedView"),value:'COMBINED' }] };
         this.buttonBar.createAndAdd(displayByFilterMenu);
      }
   }
*/
   var sortByColumn = this.grid.columnDescriptors[3];

   for (var i = 0; i < this.grid.columnDescriptors.length; i++)
   {
      if (this.grid.columnDescriptors[i].displayText == this.document.forms[0].sortBy.value)
      {
         sortByColumn = this.grid.columnDescriptors[i];
      }
   }

   //--- sortBy automatically refreshes the view when its done...   
   this.grid.sortBy(sortByColumn, this.document.forms[0].sortOrder.value);

   this.constructTree();

   //--- create an observer which listens for events on the tree...
   var observer = new Observer("treeObserver");

   observer.processEvent = function (anEvent)
   {
      if (anEvent.type.family == "tree" || anEvent.type == ObservableEventType.COMPOUND_EVENT)
      {
         uiController.userSelectionChanged();
      }
      else
      {
         alert(applicationResources.getPropertyWithParameters("reportWizard.errMsg.dontKnowHowToHandleEvent", new Array(anEvent)));
      }

   }

   this.tree.addObserver(observer);
   this.tree.refreshView();
   this.tree.collapseAllNonRoot();

   this.installCallBackIfReportsAreStillInProgress();

   this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/blankProperties.do?userLocale=" + ServerEnvironment.userLocale);
   this.displayOption = this.document.forms[0].displayOption.value;

   //    Ext.QuickTips.init();

    var tb = new Ext.Toolbar();
   tb.render('toolbar');

   // They can also be referenced by id in or components
    tb.add({
        cls: 'x-btn-icon',
        id: "refresh",
        handler: function (btn){
                      this.buttonClicked(btn);
                   },
         scope: this,
//         tooltip: {text:'Refresh Folder Contents', autoHide:true},
         icon:  ServerEnvironment.baseUrl + "/images/bbar_icons/" + 'actionRefresh.gif'
    }, '-');

   //determine if drill target display is on or off and use proper icon
   var iconOverlay = this.document.forms[0].drillDisplay.value == "true" ? "overlay-on.gif" : "overlay-off.gif";

   tb.add(
       this.createButton("view", "actionView.gif", this.buttonClicked, applicationResources.getProperty("button.reportOutput.view")), '-',
       this.createButton("email", "actionEmail.gif", this.buttonClicked, applicationResources.getProperty("button.reportOutput.email")), '-',
       this.createButton("delete", "actionDelete.gif", this.buttonClicked, applicationResources.getProperty("button.reportOutput.delete")), '-',
       this.createButton("cancel", "actionDelete.gif", this.buttonClicked, applicationResources.getProperty("button.reportOutput.cancel")),'-',
       this.createButton("reExecute", "actionResume.gif", this.buttonClicked, applicationResources.getProperty("button.reExecute")), '-',
       this.createButton("rePrompt", "actionReportProfile.gif", this.buttonClicked, applicationResources.getProperty("button.rePrompt")),'-');

   if(ServerEnvironment.isAdminUser == true)
   {
        tb.add(
            this.createButton("debug", "actionReportProfile.gif", this.buttonClicked, applicationResources.getProperty("button.debug")),'-');
   }
    
   tb.add(
       this.createButton("drillDisplay", iconOverlay, this.buttonClicked, applicationResources.getProperty("button.reportOutput.drillTargets")), '-',
       this.createButton("filter", "actionFilter.gif", this.buttonClicked, applicationResources.getProperty("button.admin.manage.filterReportInstances")), '-');


     var gridIsChecked = this.document.forms[0].displayOption.value == "gridOption" ? true : false;
     var treeIsChecked = this.document.forms[0].displayOption.value == "treeOption" ? true : false;

     var gridOption = new Ext.menu.CheckItem({checked: gridIsChecked, id: 'gridOption', value:'grid', text: applicationResources.getProperty("button.reportOutput.standard"), group: 'display', scope: this, handler: onItemClick})
     var treeOption  = new Ext.menu.CheckItem({checked: treeIsChecked, id: 'treeOption', value:'tree', text: applicationResources.getProperty("button.reportOutput.tree"), group: 'display', scope: this, handler: onItemClick});

     tb.add(
       new Ext.SplitButton({
            text: applicationResources.getProperty("button.reportOutput.viewOptions"),
//            tooltip: {text:'This is a QuickTip with autoHide set to true and a title', title:'Tip Title', autoHide:true},
            cls: 'x-btn-text-icon',
            // Menus can be built/referenced by using nested menu config objects
            menu :
            {
               items: [
                  gridOption,
                  treeOption

                ]}
        })

      /*new Ext.SplitButton({
            text: 'Categorize By',
//            tooltip: {text:'This is a QuickTip with autoHide set to true and a title', title:'Tip Title', autoHide:true},
            cls: 'x-btn-text-icon',
            // Menus can be built/referenced by using nested menu config objects
            menu : {items: [
                        new Ext.menu.CheckItem({checked: gridIsChecked, id: 'grid', value:'grid', text: applicationResources.getProperty("button.reportOutput.standard"), group: 'display', scope: this, handler: onItemClick}),
                        new Ext.menu.CheckItem({checked: treeIsChecked, id: 'tree', value:'tree', text: applicationResources.getProperty("button.reportOutput.tree"), group: 'display', scope: this, handler: onItemClick})
                ]}
        })*/
    );

   tb.doLayout();
   function onItemClick(item){
       this.displayItemClicked(item.id);
   }

   this.initKeyHandler();
   this.toggleDisplayOption();
   this.addDoubleClickToAll();


};

BrowseReportInstancesUiController.prototype.initKeyHandler = function()
{
   this.keyHandler = new ReportInstancesKeyHandler(this);
   this.gridKeyHandler = new GridKeyHandler(this.keyHandler, this.grid);
   this.treeKeyHandler = new TreeKeyHandler(this.keyHandler, this.tree);
};

BrowseReportInstancesUiController.prototype.addDoubleClickToElement = function(anElement)
{
   if (!JsUtil.isGood(anElement.ondblclick))
   {
      anElement.ondblclick = new Function("uiController.viewSelectedReportInstances();");
   }
};

BrowseReportInstancesUiController.prototype.addDoubleClickToAll = function()
{
   for (var i = 0; i < this.grid.rows.length; i++)
   {
      this.addDoubleClickToElement(this.grid.rows[i].domElement);
   }

   var viz = {
      visitNode : function (aNode)
      {
         uiController.addDoubleClickToElement(aNode.domElement);
      }
   }

   this.tree.applyVisitor(viz);
};


BrowseReportInstancesUiController.prototype.constructTree = function()
{
   Tree.imageDir = ServerEnvironment.imageDir;

   for (var i = 0; i < this.uiModel.rerSummaries.length; i++)
   {
      var summary = this.uiModel.rerSummaries[i];
      var treeNode = this.tree.getNodeById(summary.rerId);

      if (treeNode == null)
      {
         treeNode = this.tree.createNode(summary.rerId, summary.toString(), summary.getStatusTreeNode(), summary);
         this.tree.addRootNode(treeNode);
      }

      for (var j = 0; j < summary.drillArray.length; j++)
      {
         var drillSummary = summary.drillArray[j];

         var drillTreeNode = this.tree.createNode(drillSummary.rerId, drillSummary.toString(), drillSummary.getStatusTreeNode(), drillSummary);

         treeNode.addChild(drillTreeNode);

      }
   }
}


/**
 * this is an override of the baseclass method, we want the scrollbar to be on the
 * folder
 **/
BrowseReportInstancesUiController.prototype.onFrameResize = function()
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


   document.getElementById("workspaceBody").style.height = (newBodyHeight - toolbarHeight) + "px";
};

/**
 * Nov.3 added IF statements for allowing mome time in between refreshes. - Dan S.
 * The Algorithm  is to see if we should still add time to the current wait time.
 * Refresh time will not go higher than 300secs (5mins).
 * The initial autoRefreshFrequency = 7
 * When increaseAutoRefreshFrequency equals 5, then autoRefreshFrequency will increase by 3.
 *
 */
BrowseReportInstancesUiController.prototype.installCallBackIfReportsAreStillInProgress = function()
{
   if (this.refreshInProgress)
      return;

   for (var i = 0; i < this.uiModel.rerSummaries.length; ++i)
   {
      if (this.uiModel.rerSummaries[i].isFinishedOrFailed() == false)
      {
         //--- install callback...
         window.setTimeout("uiController.refreshInProgressRers();", this.autoRefreshFrequency * 1000);

         //
         if(this.shoudIncreaseAutoRefreshFrequency)
         {
            this.increaseAutoRefreshFrequency++;
            if(this.increaseAutoRefreshFrequency>=5)
            {
               this.autoRefreshFrequency+=3;
            } // end if
            if(this.autoRefreshFrequency>=300)
            {
               this.shoudIncreaseAutoRefreshFrequency = false;
            }
         } // end if
         return;
      }
   }
};

/**
 * for the RER's which are still in progress, make a single async call to get their
 * upated status values...
 **/
BrowseReportInstancesUiController.prototype.refreshInProgressRers = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/getRerSummaries.do?";
   var httpParams = '';

   this.refreshingRerIndexesByRerId = new Object();

   for (var i = 0; i < this.uiModel.rerSummaries.length; ++i)
   {
      if (this.uiModel.rerSummaries[i].isFinishedOrFailed() == false)
      {
         this.refreshingRerIndexesByRerId[this.uiModel.rerSummaries[i].rerId] = i;
         httpParams += "rerId=" + this.uiModel.rerSummaries[i].rerId + "&";
      }
   }

   //--- async request setup...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
      try
      {
         uiController.refreshInProgress = false;


         // response is :
         //
         //    var rerSummaries = [...];
         //
         eval(anXmlHttpRequest.responseText);

         uiController.updateRerSummaries(rerSummaries);
         uiController.installCallBackIfReportsAreStillInProgress();
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
BrowseReportInstancesUiController.prototype.updateRerSummaries = function(aRerSummaries)
{
   var startTime = new Date().getTime();

   window.status = "starting refresh...";
   var oldRer = null;
   var targetIndex;

   for (var i = 0; i < aRerSummaries.length; ++i)
   {
      targetIndex = this.refreshingRerIndexesByRerId[aRerSummaries[i].rerId];
      oldRer = this.uiModel.rerSummaries[targetIndex];

      //--- optimization : only redraw if status changed...
      if (oldRer.status != aRerSummaries[i].status)
      {
         this.uiModel.rerSummaries[targetIndex] = aRerSummaries[i];
         this.updateIndividualRerSummary(oldRer, aRerSummaries[i])
      }
   }

   if (this.displayOption != "gridOption" && this.tree.isDirty)
   {
      this.tree.refreshView();
   }

   var elapsed = new Date().getTime() - startTime;
   window.status = "finished refresh... [" + elapsed + " ms]";

   this.addDoubleClickToAll();
};

BrowseReportInstancesUiController.prototype.updateIndividualRerSummary = function(anOldRer, aRerSummary)
{
   //For grid view
   anOldRer.jsgRow.updateUserObjectAndRedraw(aRerSummary);

   //For tree view
   var treeNode = this.tree.getNodeById(aRerSummary.rerId);

   treeNode.srcObject = aRerSummary;
   treeNode.text = aRerSummary.toString();
   treeNode.type = aRerSummary.getStatusTreeNode();
   this.tree.isDirty = true;
};

BrowseReportInstancesUiController.prototype.itemClicked = function(aSubentry)
{
   if (aSubentry.id == "PUBLIC" || aSubentry.id == "PRIVATE" || aSubentry.id == "COMBINED")
   {
      var filterType = this.document.getElementById("filterType");
      filterType.value = aSubentry.value;

      this.document.forms[0].submit();
   }

};

BrowseReportInstancesUiController.prototype.displayItemClicked = function(aSubentry)
{

   this.displayOption = aSubentry;
   this.document.forms[0].displayOption.value = aSubentry;
   this.toggleDisplayOption();
};

BrowseReportInstancesUiController.prototype.toggleDisplayOption = function()
{
   if (this.displayOption == "gridOption")
   {
      this.document.getElementById("rerGrid").style.display = "";
      this.document.getElementById("rerList").style.display = "none";
      this.tree.deSelectAll();
      if (JsUtil.isGood(this.treeKeyHandler))
      {
         this.treeKeyHandler.destroy(this.document);
      }
      if (JsUtil.isGood(this.gridKeyHandler))
      {
         this.gridKeyHandler.init(this.document);
      }

   }
   else
   {
      if (this.tree.isDirty)
         this.tree.refreshView();

      this.document.getElementById("rerGrid").style.display = "none";
      this.document.getElementById("rerList").style.display = "";
      this.grid.clearCurrentSelections();
      if (JsUtil.isGood(this.gridKeyHandler))
      {
         this.gridKeyHandler.destroy(this.document);
      }
      if (JsUtil.isGood(this.treeKeyHandler))
      {
         this.treeKeyHandler.init(this.document);
      }
   }
};

BrowseReportInstancesUiController.prototype.buttonClicked = function(anIt)
{
   switch (anIt.id)
           {
      case "view":
         this.viewSelectedReportInstances();
         break;
      case "email":
         this.emailSelectedReportInstances();
         break;
      case "delete":
         this.deleteSelectedReportInstances();
         break;
      case "cancel":
         this.cancelSelectedReportInstances();
         break;
      case "refresh":
         this.refreshPage();
         break;
      case "drillDisplay":
         this.toggleDrillDisplay();
         break;
      case "displayOptions":
         this.switchViewOption();
         break;
      case "filterByOptions":
         this.switchViewOption();
         break;
      case "reExecute":
         this.reExecute();
         break;
      case "rePrompt":
         this.rePrompt();
         break;
      case "debug":
         this.debug();
         break;
      case "filter":
         this.filter();
         break;
      default:
         alert(applicationResources.getPropertyWithParameters("reportOutputs.unknownButtonClick", new Array(anIt.id)));
         break;
   }
};

BrowseReportInstancesUiController.prototype.filter = function()
{
   if (this.filterWindow == null) {

      // TODO: we should be initializing the state of this filter form to whatever the last
      // filter was (no huge deal, but would be nicer).
      this.filterForm = new Ext.FormPanel({
         frame:true,
         width: 600,
         height:340,
         layout: 'absolute',
              items: [

                    { x:5  , y:8,  xtype: 'label', text: 'User Name:' }
                   ,{ x:128 , y:5,  xtype: 'textfield', name: 'userName', fieldLabel: "User Name", width: 100 }
                   ,{ x:275  , y:8,  xtype: 'label', text: 'Request ID:' }
                   ,{ x:340, y:5, xtype: 'textfield', name: 'rerId', fieldLabel: "Request ID", width: 100 }
                   ,{ x:5  , y:33,  xtype: 'label', text: 'Report / Profile Name:' }
                   ,{ x: 128, y:30, xtype: 'textfield', name: 'targetName', fieldLabel: "Report / Profile Name", width: 312 }

                   ,{ x: 5,   y: 63,  xtype: 'label', text: 'Start Date (MM/DD/YY) :' }
                   ,{ x: 128, y: 60, xtype: 'datefield', name:'startDate', width:100, format:'m/d/y'}
                   ,{ x: 240, y: 60, xtype: 'timefield', name:'startTime', width:80 }

                   ,{ x: 5,   y: 93,  xtype: 'label', text: 'End Date (MM/DD/YY) :' }
                   ,{ x: 128, y: 90, xtype: 'datefield', name:'endDate', width:100, format: 'm/d/y'}
                   ,{ x: 240, y: 90, xtype: 'timefield', name:'endTime', width:80 }

                       ,{ x: 5,   y: 140, xtype: 'checkbox', name :'cbPendingPreExecution', fieldLabel: "Pending Pre-Execution" }
                       ,{ x: 25,   y: 140,  xtype: 'label', text: 'Pending Pre-Execution' }

                       ,{ x: 5,   y: 160, xtype: 'checkbox', name :'cbPreExecution', fieldLabel: "Pre-Execution" }
                       ,{ x: 25,   y: 160,  xtype: 'label', text: 'Pre-Execution' }

                       ,{ x: 5,   y: 180, xtype: 'checkbox', name :'cbPendingExecution', fieldLabel: "Pending Execution" }
                       ,{ x: 25,   y: 180,  xtype: 'label', text: 'Pending Execution' }

                       ,{ x: 5,   y: 200, xtype: 'checkbox', name :'cbExecuting', fieldLabel: "Executing" }
                       ,{ x: 25,   y: 200,  xtype: 'label', text: 'Executing' }

                       ,{ x: 175,   y: 140, xtype: 'checkbox', name :'cbPendingDownload', fieldLabel: "Pending Download" }
                       ,{ x: 195,   y: 140,  xtype: 'label', text: 'Pending Download' }

                       ,{ x: 175,   y: 160, xtype: 'checkbox', name :'cbDownloading', fieldLabel: "Downloading" }
                       ,{ x: 195,   y: 160,  xtype: 'label', text: 'Downloading' }

                       ,{ x: 175,   y: 180, xtype: 'checkbox', name :'cbPendingPostExecution', fieldLabel: "Pending Post Execution" }
                       ,{ x: 195,   y: 180,  xtype: 'label', text: "Pending Post Execution" }

                       ,{ x: 175,   y: 200, xtype: 'checkbox', name :'cbPostExecution', fieldLabel: "Post Execution" }
                       ,{ x: 195,   y: 200,  xtype: 'label', text: 'Post Execution' }

                       ,{ x: 345,   y: 140, xtype: 'checkbox', name :'cbFinished', fieldLabel: "Finished" }
                       ,{ x: 365,   y: 140,  xtype: 'label', text: 'Finished' }

                       ,{ x: 345,   y: 160, xtype: 'checkbox', name :'cbFailed', fieldLabel: "Failed" }
                       ,{ x: 365,   y: 160,  xtype: 'label', text: "Failed" }

                       ,{ x: 345,   y: 180, xtype: 'checkbox', name :'cbCancelled', fieldLabel: "Cancelled" }
                       ,{ x: 365,   y: 180,  xtype: 'label', text: 'Cancelled' }

              ]
           });

      this.filterWindow = new Ext.Window({
               title: 'Filter Report Outputs',
               width: 500,
               height:330,
               resizable:false,
               layout: 'fit',
               plain:true,
               bodyStyle:'padding:5px;',
               buttonAlign:'center',
               closable: false,
               items: this.filterForm,
               buttons: [{
                  text: 'Filter',
                  scope:uiController,
                  handler: function () {
                     this.onFilterDialogFinished();
                  }
               },{
                  text: 'Cancel',
                  scope: uiController,
                  handler: function () {
                     this.filterWindowIsVisible = false;
                     this.filterWindow.hide();
                  }
               }]
         });
      }

   this.filterWindowIsVisible = true;
   this.filterWindow.show();
};

BrowseReportInstancesUiController.prototype.onFilterDialogFinished = function()
{
   var filterForm = this.filterForm.getForm();

   var startDateValue = filterForm.findField("startDate").getValue();
   var endDateValue = filterForm.findField("endDate").getValue();

   var datePattern = "Y-m-d H:i:sO";

   var formState = {
      isCancelled: false,
      userName: filterForm.findField("userName").getValue(),
      rerId: filterForm.findField("rerId").getValue(),
      targetName: filterForm.findField("targetName").getValue(),
      startDate: startDateValue ? startDateValue.format(datePattern) : null,
      startTime: filterForm.findField("startTime").getValue(),
      endDate: endDateValue ? endDateValue.format(datePattern) : null,
      endTime: filterForm.findField("endTime").getValue(),
      isRerPendingPreExecution: filterForm.findField("cbPendingPreExecution").getValue(),
      isRerPreExecution: filterForm.findField("cbPreExecution").getValue(),
      isRerPendingExecution: filterForm.findField("cbPendingExecution").getValue(),
      isRerExecuting: filterForm.findField("cbExecuting").getValue(),
      isRerPendingDownload: filterForm.findField("cbPendingDownload").getValue(),
      isRerDownloading: filterForm.findField("cbDownloading").getValue(),
      isRerPendingPostExecution: filterForm.findField("cbPendingPostExecution").getValue(),
      isRerPostExecution: filterForm.findField("cbPostExecution").getValue(),
      isRerFinished: filterForm.findField("cbFinished").getValue(),
      isRerFailed: filterForm.findField("cbFailed").getValue(),
      isRerCancelled: filterForm.findField("cbCancelled").getValue()

   };


   //--- refresh view, passing in filter selection criteria...

   var adminPortion = ($F('adminViewAll') == 'true') ? 'admin/' : '';

   var url = ServerEnvironment.contextPath + "/secure/actions/" + adminPortion + "browseReportInstances.do?";

   if (formState.userName) {
      url += 'logon=' + formState.userName + '&';
   }

   if (formState.rerId) {
      url += 'rerId=' + formState.rerId + '&';
   }

   if (formState.targetName) {
      url += 'targetName=' + formState.targetName + '&';
   }

   if (formState.startDate) {
      url += 'startDate=' + formState.startDate + '&';
   }

   if (formState.startTime) {
      url += 'startTime=' + formState.startTime + '&';
   }


   if (formState.endDate) {
      url += 'endDate=' + formState.endDate + '&';
   }

   if (formState.endTime) {
      url += 'endTime=' + formState.endTime + '&';
   }

   if (formState.isRerPendingPreExecution) {
      url += 'status=' + ReportExecutionStatusEnum.PENDING_PRE_EXECUTION.value + '&';
   }

   if (formState.isRerPreExecution) {
      url += 'status=' + ReportExecutionStatusEnum.PRE_EXECUTION.value + '&';
   }

   if (formState.isRerPendingExecution) {
      url += 'status=' + ReportExecutionStatusEnum.PENDING_EXECUTION.value + '&';
   }

   if (formState.isRerExecuting) {
      url += 'status=' + ReportExecutionStatusEnum.EXECUTING.value + '&';
   }

   if (formState.isRerPendingDownload) {
      url += 'status=' + ReportExecutionStatusEnum.PENDING_DOWNLOAD.value + '&';
   }

   if (formState.isRerDownloading) {
      url += 'status=' + ReportExecutionStatusEnum.DOWNLOADING_OUTPUTS.value + '&';
   }

   if (formState.isRerPendingPostExecution) {
      url += 'status=' + ReportExecutionStatusEnum.PENDING_POST_EXECUTION.value + '&';
   }


   if (formState.isRerPostExecution) {
      url += 'status=' + ReportExecutionStatusEnum.POST_EXECUTION.value + '&';
   }


   if (formState.isRerFinished) {
      url += 'status=' + ReportExecutionStatusEnum.FINISHED.value + '&';
   }

   if (formState.isRerFailed) {
      url += 'status=' + ReportExecutionStatusEnum.FAILED.value + '&';
   }

   if (formState.isRerCancelled) {
      url += 'status=' + ReportExecutionStatusEnum.CANCELLED.value + '&';
   }


   this.filterWindowIsVisible = false;
   this.filterWindow.hide();

   document.forms[0].action = url;
   document.forms[0].submit();
};



BrowseReportInstancesUiController.prototype.switchViewOption = function()
{
};

BrowseReportInstancesUiController.prototype.processDefaultExecution = function()
{
   this.viewSelectedReportInstances();
}

BrowseReportInstancesUiController.prototype.toggleDrillDisplay = function()
{
   if ($F('adminViewAll') == 'true')
   {
      this.document.forms[0].action = ServerEnvironment.contextPath + "/secure/actions/admin/browseReportInstances.do";
   }

   if (this.document.forms[0].drillDisplay.value == "true")
   {
      this.document.forms[0].drillDisplay.value = "false";
      this.document.forms[0].submit();
   }
   else
   {
      this.document.forms[0].drillDisplay.value = "true";
      this.document.forms[0].submit();
   }

}

BrowseReportInstancesUiController.prototype.getSelectedFromDisplayOption = function()
{
   if (this.displayOption == "gridOption")
      return this.grid.getSelectedUserObjects();
   else
      return this.tree.getSelectedSrcObjects();
}


/**
 * view the currently selected reports...
 **/
BrowseReportInstancesUiController.prototype.viewSelectedReportInstances = function()
{
   var selected = this.getSelectedFromDisplayOption();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("reportOutputs.selectOneInstance"));
   }
   else
   {
      var rerIds = new Array();
      for (var i = 0; i < selected.length; ++i)
      {
         if (selected[i].status != ReportExecutionStatusEnum.FAILED.value &&
             selected[i].status != ReportExecutionStatusEnum.CANCELLED.value &&
             selected[i].status != ReportExecutionStatusEnum.INTERRUPTED.value)
         {
            if(selected[i].isBurst)
            {
               var burstSelector = new BurstSelector(selected[i]);
               burstSelector.show();
               continue;
            }
            rerIds.push(selected[i].rerId);
         }
         else
         {
            DialogUtil.rclAlert(applicationResources.getPropertyWithParameters("reportOutputs.alert.cantOpenFailedReport", new Array(selected[i].name)), applicationResources.getProperty("reportOutputs.alert.cantOpenFailedReport.title"), null, 50, 50);
         }
      }
      if (rerIds.length > 0)
      {
         launchReportViewer(rerIds);
      }
      //      var url = ServerEnvironment.baseUrl + "/secure/actions/launchReportViewer.do?";
      //
      //      for (var i = 0; i < selected.length; ++i)
      //      {
      //         url += "rerIds=" + selected[i].rerId + "&";
      //      }
      //
      //      var geom = new BrowserGeometry();
      //
      //      var rvWindowName = "RCL_RV_" + Math.round(Math.random()*10000);
      //      win = JsUtil.openNewWindow("", rvWindowName,
      //              {width:1010,height:693,top:geom.top,left:geom.left,menubar:"no",toolbar:"no",scrollbars:"no",resizable:"yes",status:"yes"});
      //
      //      win.location = url;
   }
};

/**
 * email the currently selected reports...
 **/
BrowseReportInstancesUiController.prototype.emailSelectedReportInstances = function()
{
   var selected = this.getSelectedFromDisplayOption();

   if (selected.length == 0 )
   {
      alert(applicationResources.getProperty("reportOutputs.email.selectOneInstance"));
   }
   else
   {

      var url = ServerEnvironment.baseUrl + "/secure/actions/displayEmailOptions.do?";

      url += "rerIds=" + selected[0].rerId;
      for(var i = 1; i<selected.length; i++)
      {
         url+="&rerIds="+selected[i].rerId;
      }

      var geom = new BrowserGeometry();

      var rvWindowName = ServerEnvironment.windowNamePrefix + "_RCL_EMAIL_" + Math.round(Math.random() * 10000);
      win = JsUtil.openNewWindow("", rvWindowName,
      "width=710,height=425,top=geom.top,left=geom.left,menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

      win.location = url;
   }
};

var selectedForDelete = null;


/**
 * delete the currently selected RERs...
 **/
BrowseReportInstancesUiController.prototype.deleteSelectedReportInstances = function()
{
   selectedForDelete = this.getSelectedFromDisplayOption();

   if (selectedForDelete.length == 0)
   {
      alert(applicationResources.getProperty("reportOutputs.selectOneInstance"));
      return;
   }

   //alert(userPreferences.confirmDeletes);
   if (userPreferences.confirmDeletes)
   {


      DialogUtil.rclConfirm(applicationResources.getProperty("general.confirmDeletions"), //ask the user "are you sure"?
              deleteSelectedItems, //delete the items
              null, //nothing if cancel
              applicationResources.getProperty("general.dialog.confirmTitle"), //title of the confirm dialog
              applicationResources.getProperty("button.Yes"),
              applicationResources.getProperty("button.No"));


   }
   else
   {
      deleteSelectedItems();
   }

}

function deleteSelectedItems()
{
   //--- do async request to launch reports...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.baseUrl + "/secure/actions/deleteRer.do";


   uiController.startPleaseWaitDiv("contentShell", applicationResources.getProperty("reportOutputs.deletingOutputs"));

   var httpParams = '';
   for (var i = 0; i < selectedForDelete.length; ++i)
   {
      httpParams += "rerIds=" + selectedForDelete[i].rerId + "&";
   }

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
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
            alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, anXmlHttpRequest.responseText)));
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
;


/**
 * cancel the currently selected RERs...
 **/
BrowseReportInstancesUiController.prototype.cancelSelectedReportInstances = function()
{
   var selected = this.getSelectedFromDisplayOption();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("reportOutputs.selectOneInstance"));
      return;
   }
   else
   {
      //--- do async request to launch reports...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();

      var url = ServerEnvironment.baseUrl + "/secure/actions/cancelRer.do";
      uiController.startPleaseWaitDiv("contentShell", applicationResources.getProperty("reportOutputs.cancelingOutputs"));

      var httpParams = '';
      for (var i = 0; i < selected.length; ++i)
      {
         httpParams += "rerIds=" + selected[i].rerId + "&";
      }


      var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
      {
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
               alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, anXmlHttpRequest.responseText)));
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


BrowseReportInstancesUiController.prototype.reExecute = function()
{
   var selected = this.getSelectedFromDisplayOption();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("reportOutputs.selectOneInstance"));
   }
   else
   {
      var rerIds = new Array();
      var rerIdParams = '';

      for (var i = 0; i < selected.length; ++i)
      {
         rerIds.push(selected[i].rerId);
         rerIdParams += "rerId=" + selected[i].rerId + "&";
      }

      if (rerIds.length > 0)
      {
         //--- do async request to launch reports...
         var xmlHttpRequest = JsUtil.createXmlHttpRequest();

         var url = ServerEnvironment.contextPath + "/secure/actions/reExecute.do";

         var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
            try
            {
               uiController.endPleaseWaitDiv();

               eval(anXmlHttpRequest.responseText);
               window.setTimeout("uiController.refreshPage();", 4000);

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

         xmlHttpRequest.open("POST", url, true);

         xmlHttpRequest.setRequestHeader(
                 'Content-Type',
                 'application/x-www-form-urlencoded; charset=UTF-8'
                 );


         this.startPleaseWaitDiv(null, applicationResources.getProperty("general.submittingRequest"));

         xmlHttpRequest.send(rerIdParams);
      }
   }
};



BrowseReportInstancesUiController.prototype.rePrompt = function()
{
   var selected = this.getSelectedFromDisplayOption();

   if (selected.length == 0 || selected.length > 1)
   {
      alert(applicationResources.getProperty("reportOutputs.selectOneInstance"));
   }
   else
   {
      var rerId = selected[0].rerId;

      var url = ServerEnvironment.baseUrl + "/secure/actions/editReiForRer.do?rerId=" + rerId;

      var windowName = ServerEnvironment.windowNamePrefix + "_editReiForRer_" + rerId;

      var geom = new BrowserGeometry();
      var win = window.open(url,
              windowName,
              "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

      win.focus();

   }
};

BrowseReportInstancesUiController.prototype.debug = function()
{
   var selected = this.getSelectedFromDisplayOption();

   if (selected.length == 0 || selected.length > 1)
   {
      alert(applicationResources.getProperty("reportOutputs.selectOneInstance"));
   }
   else
   {
      var rerId = selected[0].rerId;

      var url = ServerEnvironment.baseUrl + "/secure/actions/debugRer.do?rerId=" + rerId;

      var windowName = ServerEnvironment.windowNamePrefix + "_debugRer_" + rerId;

      var geom = new BrowserGeometry();
      var win = window.open(url,
              windowName,
              "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

      win.focus();

   }
};


BrowseReportInstancesUiController.prototype.processEvent = function(anEvent)
{
   //   alert('got an event (' + anEvent.type.family + ') [' + anEvent + "]");
   this.gridSelectionChanged();
}

/**
 * called when the grid selection changes
 **/
BrowseReportInstancesUiController.prototype.gridSelectionChanged = function ()
{
   this.userSelectionChanged();
}

/**
 * called when the grid or tree selection changes
 **/
BrowseReportInstancesUiController.prototype.userSelectionChanged = function ()
{
   this.determinePropertiesPanelDisplay();
}

BrowseReportInstancesUiController.prototype.determinePropertiesPanelDisplay = function()
{
   var selected = this.getSelectedFromDisplayOption();

   if (selected.length == 0)
   {
      this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/blankProperties.do?userLocale=" + ServerEnvironment.userLocale);
   }
   else if (selected.length == 1)
   {
      this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/getRerDetails.do?rerId=" + selected[0].rerId);
   }
   else
   {
      this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/multipleItemsSelectedProperties.do?userLocale=" + ServerEnvironment.userLocale);
   }
}

BrowseReportInstancesUiController.prototype.nextPage = function ()
{
   this.doSkipToPage(parseInt(this.document.forms[0].currentPageNumber.value) + 1);
};

BrowseReportInstancesUiController.prototype.previousPage = function ()
{
   this.doSkipToPage(parseInt(this.document.forms[0].currentPageNumber.value) - 1);
};

BrowseReportInstancesUiController.prototype.firstPage = function ()
{
   this.doSkipToPage(0);
};

BrowseReportInstancesUiController.prototype.lastPage = function ()
{
   this.doSkipToPage(this.document.forms[0].totalPages.value - 1);
};

BrowseReportInstancesUiController.prototype.modifyUserInputSkipToPage = function (anEvent)
{
   var evt = JsUtil.normalizeEvent(anEvent);
   if (evt.keyCode == 13)
   {
      this.doSkipToPage(this.document.forms[0].displayCurrentPageNumber.value - 1);
      return false;
   }
};

BrowseReportInstancesUiController.prototype.doSkipToPage = function (aValue)
{
   this.document.forms[0].skipToPage.value = aValue;
   this.document.forms[0].sortBy.value = this.grid.currentSortColumn.displayText;
   this.document.forms[0].sortOrder.value = this.grid.currentSortColumn.sortDirection;

   var filterParams = document.getElementById("filterParams");

   if ($F('adminViewAll') == 'true')
   {
      this.document.forms[0].action = ServerEnvironment.contextPath + "/secure/actions/admin/browseReportInstances.do";
   }

   if (filterParams != null)
   {
      this.document.forms[0].action = this.document.forms[0].action + "?" + filterParams.value;
   }
   this.startPleaseWaitDiv(null, applicationResources.getProperty("general.submittingRequest"));
   this.document.forms[0].submit();
};

BrowseReportInstancesUiController.prototype.enableProperPagingButtons = function ()
{
   if (this.document.forms[0].currentPageNumber.value == 0)
   {
      // TODO: create enabled / disabled version of each icon
   }

   if (this.document.forms[0].currentPageNumber.value == this.document.forms[0].totalPages.value - 1)
   {
      // TODO: create enabled / disabled version of each icon
   }
};


/**
 * Folder Contents Key Handler
 */
//------------------------------------------------
function ReportInstancesKeyHandler(aFolderContentsUiController)
{
   this.controller = aFolderContentsUiController;
   this.loadKeyCodes();
}



ReportInstancesKeyHandler.prototype = new AbstractKeyHandler();
ReportInstancesKeyHandler.prototype.constructor = ReportInstancesKeyHandler;
ReportInstancesKeyHandler.superclass = AbstractKeyHandler.prototype;

ReportInstancesKeyHandler.prototype.loadKeyCodes = function()
{
   this.keyRefresh = applicationResources.getProperty("keycode.report.instances.refresh");
   this.keyView = applicationResources.getProperty("keycode.report.instances.view");
   this.keyEmail = applicationResources.getProperty("keycode.report.instances.email");
   this.keyDelete = applicationResources.getProperty("keycode.report.instances.delete");
   this.keyCancel = applicationResources.getProperty("keycode.report.instances.cancel");
   this.keyDefaultExecution = applicationResources.getProperty("keycode.report.instances.default.execution");
   this.keyDrillTargets = applicationResources.getProperty("keycode.report.instances.drill.targets");
}

ReportInstancesKeyHandler.prototype.handleKeyEvent = function(anEvent)
{
   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;
   var altKey = anEvent.altKey;
   var keyCode = anEvent.keyCode;

   if (this.keyRefresh == keyCode && altKey && ctrlKey && !shiftKey)
   {
      this.controller.refreshPage();
   }
   else if (this.keyView == keyCode && altKey && ctrlKey && !shiftKey)
   {
      this.controller.viewSelectedReportInstances();
   }
   else if (this.keyEmail == keyCode && altKey && ctrlKey && !shiftKey)
   {
      this.controller.emailSelectedReportInstances();
   }
   else if (this.keyDelete == keyCode && !(altKey || ctrlKey || shiftKey))
   {
      this.controller.deleteSelectedReportInstances();
   }
   else if (this.keyCancel == keyCode && altKey && ctrlKey && !shiftKey)
   {
      this.controller.cancelSelectedReportInstances();
   }
   else if (this.keyDefaultExecution == keyCode && !(altKey || ctrlKey || shiftKey))
   {
      if (this.controller.filterWindowIsVisible)
      {
         this.controller.onFilterDialogFinished();
      }
      else
      {
         var currentPage = this.controller.document.forms[0].currentPageNumber.value; //the page we're on.
         var desiredPage = this.controller.document.forms[0].displayCurrentPageNumber.value - 1; //the number in the page input field.

         //if the page number hasn't changed, assume we want defaultExecution and not a page jump.
         if(currentPage == desiredPage)
         {
            this.controller.processDefaultExecution();
         }
      }
   }
   else if (this.keyDrillTargets == keyCode && altKey && ctrlKey && !shiftKey)
   {
      this.controller.toggleDrillDisplay();
   }
};