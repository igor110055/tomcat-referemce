
/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: FolderChooserDialogUi.js 6595 2009-02-23 21:36:09Z dpaul $



/**
 * I am the UI model for the FolderChooserDialog screen...
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FolderChooserDialogUiModel (aRootFolder, aSelectedNodeId)
{
   this.rootFolder = aRootFolder;
   this.preSelectedNodeId = aSelectedNodeId;
   this.currentFolderContents = [];
}


//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the FolderChooserDialog screen...
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FolderChooserDialogUiController (aDocument, aModel, aIsMultiSelect)
{
   if (arguments.length > 0)
   {
      FolderChooserDialogUiController.superclass.constructor.call(this, aDocument, aIsMultiSelect);
      this.init(aDocument, aModel, aIsMultiSelect);
   }
}

//--- This class extends AbstractUiController
FolderChooserDialogUiController.prototype = new AbstractUiController();
FolderChooserDialogUiController.prototype.constructor = FolderChooserDialogUiController;
FolderChooserDialogUiController.superclass = AbstractUiController.prototype;


/**
 * @private
 **/
FolderChooserDialogUiController.prototype.init = function(aDocument, aModel, aIsMultiSelect)
{
   this.okButton = aDocument.getElementById("folderChooserSubmitButton");
   this.model = aModel;
   this.isMultiSelect = aIsMultiSelect;

   this.dialogListener = null;

   this.navTree = new Tree("navTree");

   var imageDir = ServerEnvironment.baseUrl + "/images";
   Tree.imageDir = imageDir;

   this.id = "uiController"; // observer usually has an id...
   this.navTree.addObserver(this);

   this.folderNodeType = new TreeNodeType("folder", "", "", imageDir + "/folderYellowOpen.gif", imageDir + "/folderYellowClosed.gif");
   this.unSelectableFolderNodeType = new TreeNodeType("folder", "", "", imageDir + "/folderYellowOpen.gif", imageDir + "/folderYellowClosed.gif", false);
   //--- build tree structure from model...
   var root = this.navTree.createNode(this.model.rootFolder.id, this.model.rootFolder.name, this.model.rootFolder.selectable ? this.folderNodeType : this.unSelectableFolderNodeType, this.model.rootFolder);
   this.navTree.addRootNode(root);

   this.model.rootFolder.treeNode = root;

   var viz = {
      uiController : this,
      tree : this.navTree,
      visit : function (aFolder) {
         if (JsUtil.isGood(aFolder.parent))
         {
            aFolder.treeNode = this.tree.createNode(aFolder.id, aFolder.name, aFolder.selectable ? this.uiController.folderNodeType : this.uiController.unSelectableFolderNodeType, aFolder);
            aFolder.parent.treeNode.addChild(aFolder.treeNode);
         }
      }
   }

   this.model.rootFolder.acceptVisitor(viz);
}

/**
 * initializes the UI...
 **/
FolderChooserDialogUiController.prototype.initUi = function()
{
   this.navTree.refreshView();

   if (JsUtil.isGood(this.model.preSelectedNodeId))
   {
      this.navTree.selectSingleNodeById(this.model.preSelectedNodeId);
   }

   this.navTree.collapseAllNonRoot();
   this.navTree.expandToShowSelected();

}

FolderChooserDialogUiController.prototype.processEvent = function (anEvent)
{
   if (anEvent.type == ObservableEventType.COMPOUND_EVENT)
   {
      for (var i = 0; i < anEvent.payload.length; ++i)
      {
         this.handleSingleEvent(anEvent.payload[i]);
      }
   }
   else
   {
      this.handleSingleEvent (anEvent);
   }
}

FolderChooserDialogUiController.prototype.handleSingleEvent = function (anEvent)
{
   if (anEvent.type.family == "tree")
   {
      if (anEvent.type == ObservableEventType.TREE_NODE_SELECTED)
      {
         this.folderWasSelected(anEvent.payload.srcObject);
      }
      var selectedValues = this.navTree.getSelectedSrcObjects();
      //disable submit if nothing is selected
      if (selectedValues[0] == null)
      {
         this.enableSubmit(false);
      }
      else
      {
         this.enableSubmit(true);
      }
   }
   else
   {
      alert("Don't know how to handle event [" + anEvent + "]");
   }
}

FolderChooserDialogUiController.prototype.enableSubmit = function(isEnabled)
{
   if (this.okButton != null)
   {
      this.okButton.disabled = !isEnabled;      
   }
}

/**
 * a new folder was selected...
 **/
FolderChooserDialogUiController.prototype.folderWasSelected = function (aFolder)
{
   // not much to do for this dialog...
}


FolderChooserDialogUiController.prototype.setDialogListener = function (aDialogListener)
{
   this.dialogListener = aDialogListener;
}

FolderChooserDialogUiController.prototype.onOkButtonPress = function ()
{
   var selectedValues = this.navTree.getSelectedSrcObjects();
   if (selectedValues[0] == null)
   {
     alert("Please select a folder.")
   }
   else
   {
      this.dialogFinished("OK");
   }
}

FolderChooserDialogUiController.prototype.onCancelButtonPress = function ()
{
   this.dialogFinished("Cancel");
}

FolderChooserDialogUiController.prototype.dialogFinished = function (aGesture)
{
   if (this.dialogListener)
   {
      this.dialogListener.dialogFinished(aGesture, this);
   }
}

FolderChooserDialogUiController.prototype.getDialogResults = function ()
{
   return this.navTree.getSelectedSrcObjects();
}


/**
 * called to setup the previous selections (usually just after initializing the UI)
 * @param aPreviousSelections
 */
FolderChooserDialogUiController.prototype.setInitialSelections = function (aInitialSelections, aValuePropertyName, aDisplayTextPropertyName)
{
    // no-op here...
};


//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the FolderChooserDialogWithInput screen...
 *
 * @constructor
 * @class
 * @author Jeremy Siler
 **/
function FolderChooserWithInputDialogUiController (aDocument, aModel, aIsMultiSelect)
{
   if (arguments.length > 0)
   {
      FolderChooserDialogUiController.superclass.constructor.call(this, aDocument, aIsMultiSelect);
      this.init(aDocument, aModel, aIsMultiSelect);
   }
}

//--- This class extends FolderChooserDialogUiController
FolderChooserWithInputDialogUiController.prototype = new FolderChooserDialogUiController();
FolderChooserWithInputDialogUiController.prototype.constructor = FolderChooserWithInputDialogUiController;
FolderChooserWithInputDialogUiController.superclass = FolderChooserDialogUiController.prototype;

FolderChooserWithInputDialogUiController.prototype.onOkButtonPress = function ()
{
   var selectedValues = this.navTree.getSelectedSrcObjects();
   if (selectedValues[0] == null)
   {
     alert("Please select a folder.")
   }
   else if (this.document.getElementById("saveToProfileName").value == null || this.document.getElementById("saveToProfileName").value == "")
   {
      alert("Please specify a name for this profile.");
   }
   else
   {
      this.dialogFinished("OK");
   }
}

FolderChooserWithInputDialogUiController.prototype.getInputResults = function ()
{
  return this.document.getElementById("saveToProfileName").value;
}

FolderChooserWithInputDialogUiController.prototype.getPermissionsResults = function ()
{
   var saveOptions = this.document.getElementsByName("saveAsPublicOrPrivate");

   //--- may be forced to public (via rcl.cms.useOnlyPublicFolders
   if (saveOptions.length == 1 && "public" == saveOptions[0].value)
      return saveOptions[0].value;

   //--- else we have a radio button, find the selected value...
   for (var i = 0; i < saveOptions.length; i++)
   {
      var eachValue = saveOptions[i];
      if (eachValue.checked == true)
      {
         return eachValue.value;
      }
   }
}

/**
 * a new folder was selected...
 **/
FolderChooserWithInputDialogUiController.prototype.folderWasSelected = function (aFolder)
{
   var selectedValues = this.navTree.getSelectedSrcObjects();

   if (selectedValues[0].id.indexOf("My Folders") != -1)
   {
      document.getElementById("permissionDiv").style.display = "none";
   }
   else
   {
      document.getElementById("permissionDiv").style.display = "";
   }
}