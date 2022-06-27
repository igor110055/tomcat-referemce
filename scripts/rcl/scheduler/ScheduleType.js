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
   return this.children.length > 0;
};





//-----------------------------------------------------------------------------
/**
 * Schedule Type UI Model
 *
 * @constructor
 * @author Roger Moore
 **/

function ScheduleTypeUiModel(aRootRclFolder, aSelectedTargets)
{
   this.rootRclFolder = aRootRclFolder;
   this.selectedTargets = aSelectedTargets;
}

ScheduleTypeUiModel.prototype = new AbstractSchedulerUiModel();
ScheduleTypeUiModel.prototype.constructor = ScheduleTypeUiModel;
ScheduleTypeUiModel.superclass = AbstractSchedulerUiModel.prototype;

//-----------------------------------------------------------------------------
/**
 * Schedule Type UI Controller
 *
 * @constructor
 * @author Roger Moore
 **/
function ScheduleTypeUiController(aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractSchedulerUiController.prototype.constructor.call(this, aDocument, aModel);

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

      //these lists are hidden, but used to populate the id and names set back to the server
      this.selectedTargetIds    = new JsListBox ("targetIds",   "targetIds", new Array() , new SimpleFieldExtractor('id','name') );
      this.selectedTargetNames  = new JsListBox ("targetNames", "targetNames", new Array() , new SimpleFieldExtractor('name','name') );

   }
}

ScheduleTypeUiController.prototype = new AbstractSchedulerUiController();
ScheduleTypeUiController.prototype.constructor = ScheduleTypeUiController;
ScheduleTypeUiController.superclass = AbstractSchedulerUiController.prototype;

/**
 * initialize the ui...
 **/
ScheduleTypeUiController.prototype.initUi = function()
{
   ScheduleTypeUiController.superclass.initUi.call(this);

   this.setStageTitle(applicationResources.getProperty("scheduleWizard.stageTitle.type"));
   this.disablePrevious();

   var complete =$F('complete');
   if (complete == 'false')
   {
      this.disableSave();
   }

   Field.select('scheduleName');  //select the schedule name to ease input
   
   this.initFolderTree();
   this.folderTree.refreshView();
   this.folderTree.collapseAllNonRoot();

   var previousSelection =$F('selectedFolderId');
   if (JsUtil.isGood(previousSelection) && JsUtil.trim(previousSelection).length>0)
   {
      this.folderTree.selectSingleNodeById(previousSelection);
      this.folderTree.expandToShowSelected();

   }
   //this.folderTree.refreshView();
   this.resetAvailableReports();
   this.selectedReports.refreshView();



};

ScheduleTypeUiController.prototype.typeChanged = function()
{
   $('complete').value='false';
   this.disableSave();
};

ScheduleTypeUiController.prototype.initFolderTree = function()
{
   var rootRclFolder = this.model.rootRclFolder;

   var root = this.createRootTreeNode(rootRclFolder);
   this.folderTree.addRootNode(root);

   this.addChildren(root, rootRclFolder);

};

ScheduleTypeUiController.prototype.createFolderTreeNode = function(aRclFolder)
{
   return this.folderTree.createNode(aRclFolder.id, aRclFolder.name, this.folderNodeType, aRclFolder, false);
};

ScheduleTypeUiController.prototype.createRootTreeNode = function(aRclFolder)
{
   return this.folderTree.createNode(aRclFolder.id, aRclFolder.name, this.rootNodeType, aRclFolder, false);
};


ScheduleTypeUiController.prototype.addChildren = function(aCurTreeRoot, aCurRclFolder)
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

ScheduleTypeUiController.prototype.openSelectReportsDialog = function()
{
   var rclDialog = new RclDialog();




            rclDialog.showFolderChooserDialog(applicationResources.getProperty("admin.folders.selectFolder.title"),
                    "",
                    null,
                    false, "folderChooser", "", "public");

};

/**
 * hook for derived classes to do something (e.g. client side validation)
 * before submitting.  If the method returns false, the submit will be
 * cancelled.
 **/
ScheduleTypeUiController.prototype.beforeSubmit = function()
{
   var scheduleName =$F('scheduleName');
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
} ;

/**
 * hook for derived classes to do something when form submission is
 * imminent...
 **/
ScheduleTypeUiController.prototype.willSubmit = function()
{
   this.selectedTargetIds.resetAvailableItems(this.selectedReports.getSelectedSrcObjects());
   this.selectedTargetNames.resetAvailableItems(this.selectedReports.getSelectedSrcObjects());

   var selectedFolders = this.folderTree.getSelectedSrcObjects();
   $('selectedFolderId').value = (selectedFolders.length==0) ? '' : selectedFolders[0].id;
   this.selectedTargetIds.selectAll();
   this.selectedTargetNames.selectAll();
};

ScheduleTypeUiController.prototype.getStageName = function()
{
   return "type";
}

ScheduleTypeUiController.prototype.previousButton = function()
{
   this.jumpTo('type');
};

ScheduleTypeUiController.prototype.nextButton = function()
{
   this.jumpTo('timing');
};


ScheduleTypeUiController.prototype.getReportsForFolder = function (aRclFolder)
{
    var reports = this.folderIdToReportsMap[aRclFolder.id];

    if (reports==null)
    {
       //make AJAX call to get reports for folder
       var url = ServerEnvironment.contextPath + "/secure/actions/getRclFolderContents.do?filterByRequiredParms=true&";
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


ScheduleTypeUiController.prototype.insertSelectedTargets = function (aRclFolder)
{
   this.availableReports.copySelectedToOtherList(this.selectedReports, false);
   this.selectedReports.refreshView();

};

ScheduleTypeUiController.prototype.removeSelectedTargets = function (aRclFolder)
{
   this.selectedReports.removeSelected();
   this.selectedReports.refreshView();
};

ScheduleTypeUiController.prototype.resetAvailableReports = function ()
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
ScheduleTypeUiController.prototype.updateAvailableReports = function (aRclFolder)
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
ScheduleTypeUiController.prototype.processEvent = function (anEvent)
{
   if (anEvent.type == ObservableEventType.TREE_NODE_SELECTED)
   {
      var srcObject = anEvent.payload.srcObject;
      this.updateAvailableReports(srcObject);
   }

};


