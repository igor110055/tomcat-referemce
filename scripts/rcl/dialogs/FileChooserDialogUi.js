/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: FileChooserDialogUi.js 5950 2008-10-27 20:28:17Z sallman $


/**
 * I am the UI model for the FileChooserDialog screen...
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FileChooserDialogUiModel (aRootFolder, aGetFolderContentsUrl, aObjectTypes, aPreSelectedFolderId, aPreSelectedFileId)
{
   this.rootFolder = aRootFolder;
   this.getFolderContentsUrl = aGetFolderContentsUrl;
   this.objectTypes = aObjectTypes;

   this.preSelectedFolderId = aPreSelectedFolderId;
   this.preSelectedFileId = aPreSelectedFileId;

   this.currentFolderContents = [];
}


//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the FileChooserDialog screen...
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FileChooserDialogUiController (aDocument, aModel, aIsMultiSelect)
{
   if (arguments.length > 0)
   {
      FileChooserDialogUiController.superclass.constructor.call(this, aDocument, aIsMultiSelect);
      this.init(aDocument, aModel, aIsMultiSelect);
   }
}

//--- This class extends AbstractUiController
FileChooserDialogUiController.prototype = new AbstractUiController();
FileChooserDialogUiController.prototype.constructor = FileChooserDialogUiController;
FileChooserDialogUiController.superclass = AbstractUiController.prototype;


/**
 * @private
 **/
FileChooserDialogUiController.prototype.init = function(aDocument, aModel, aIsMultiSelect)
{
   this.okButton = aDocument.getElementById("fileChooserSubmitButton");
   this.model = aModel;
   this.isMultiSelect = aIsMultiSelect;

   this.dialogListener = null;

   this.navTree = new Tree("navTree");

   var imageDir = ServerEnvironment.baseUrl + "/images";
   Tree.imageDir = imageDir;

   this.id = "uiController"; // observer usually has an id...
   this.navTree.addObserver(this);

   this.folderNodeType = new TreeNodeType("folder", "", "", imageDir + "/folderYellowOpen.gif", imageDir + "/folderYellowClosed.gif");

   //--- build tree structure from model...
   var root = this.navTree.createNode(this.model.rootFolder.id, this.model.rootFolder.name, this.folderNodeType, this.model.rootFolder);
   this.navTree.addRootNode(root);

   this.model.rootFolder.treeNode = root;

   var viz = {
      uiController : this,
      tree : this.navTree,
      visit : function (aFolder) {
         if (JsUtil.isGood(aFolder.parent))
         {
            aFolder.treeNode = this.tree.createNode(aFolder.id, aFolder.name, this.uiController.folderNodeType, aFolder);
            aFolder.parent.treeNode.addChild(aFolder.treeNode);
         }
      }
   }

   this.model.rootFolder.acceptVisitor(viz);


   //--- setup the details grid...
   var gridDataProvider = {
      getSourceObjects : function () {
         return uiModel.currentFolderContents;
      },

      populateRow : function (aItem, aRow)
      {
         var cell = new Cell(aItem.type);
         cell.valueWithMarkup = '<img src="' + aRow.grid.imageDir + '/' + aItem.getIconSrc() + '" alt="type icon"/>';

         aRow.addCell (cell);
         aRow.addCell (new Cell(aItem.name));
      }
   }

   var columnDescriptors = [
      new ColumnDescriptor("", true, DataType.STRING),
      new ColumnDescriptor("Name", true, DataType.STRING)
   ];


   this.detailsGrid = new JsGrid(aDocument, "gridContainer", this.isMultiSelect, columnDescriptors, gridDataProvider );

   this.detailsGrid.addObserver(this);
   this.detailsGrid.imageDir = imageDir;
}

/**
 * initializes the UI...
 **/
FileChooserDialogUiController.prototype.initUi = function()
{
   this.navTree.refreshView();
   this.navTree.collapseAllNonRoot();

   if (JsUtil.isGood(this.model.preSelectedFolderId))
   {
      this.navTree.selectSingleNodeById(this.model.preSelectedFolderId);
   }

   this.navTree.collapseAllNonRoot();
   this.navTree.expandToShowSelected();

   this.detailsGrid.sortBy(this.detailsGrid.columnDescriptors[1], 1);


   if (JsUtil.isGood(this.model.preSelectedFileId))
   {
      // TODO: pre-select the file in the grid...
   }

}


FileChooserDialogUiController.prototype.processEvent = function (anEvent)
{
   if(anEvent.type == ObservableEventType.GRID_ROW_SELECTED || anEvent.type == ObservableEventType.GRID_ROW_DESELECTED)
   {
      //if there is a file selected, enable the OK button
      if(this.detailsGrid.getSelectedRows().length > 0)
      {
         this.enableSubmit(true);
      }
      else
      {
         this.enableSubmit(false);
      }
   }
   else if (anEvent.type == ObservableEventType.COMPOUND_EVENT)
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

FileChooserDialogUiController.prototype.handleSingleEvent = function (anEvent)
{
   if(anEvent.type.family == "JsGrid" )
   {
      if(anEvent.type == ObservableEventType.GRID_ROW_SELECTED || anEvent.type == ObservableEventType.GRID_ROW_DESELECTED)
      {
         //if there is a file selected, enable the OK button
         if(this.detailsGrid.getSelectedRows().length > 0)
         {
            this.enableSubmit(true);
         }
         else
         {
            this.enableSubmit(false);
         }
      }
   }
   else if (anEvent.type.family == "tree")
   {
      if (anEvent.type == ObservableEventType.TREE_NODE_SELECTED)
      {
         this.folderWasSelected(anEvent.payload.srcObject);
      }

   }
   else
   {
      alert("Don't know how to handle event [" + anEvent + "]");
   }
}

FileChooserDialogUiController.prototype.enableSubmit = function(isEnabled)
{
   this.okButton.disabled = !isEnabled;
}

/**
 * a new folder was selected...
 **/
FileChooserDialogUiController.prototype.folderWasSelected = function (aFolder)
{
   //--- do async request to launch reports...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var params =  "folderId=" + encodeURIComponent(aFolder.id);


   for (var i = 0; i < this.model.objectTypes.length; ++i)
   {
      params += "&objectType=" + this.model.objectTypes[i];
   }

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      try
      {
         // should declare an array called "folderContents"
         eval(anXmlHttpRequest.responseText);
         uiController.model.currentFolderContents = folderContents;
         uiController.currentFolderContentsChanged();
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

   xmlHttpRequest.open("POST", this.model.getFolderContentsUrl, true);

   xmlHttpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
   );

   try
   {
      xmlHttpRequest.send(params);
   }
   catch (e)
   {
      alert("exception sending XmlHttpRequest : [" + e + "]");
   }
}


FileChooserDialogUiController.prototype.currentFolderContentsChanged = function ()
{
   this.detailsGrid.extractRows();
   this.detailsGrid.reSort();
}

FileChooserDialogUiController.prototype.setDialogListener = function (aDialogListener)
{
   this.dialogListener = aDialogListener;
}

FileChooserDialogUiController.prototype.onOkButtonPress = function ()
{
   this.dialogFinished("OK");
}

FileChooserDialogUiController.prototype.onCancelButtonPress = function ()
{
   this.dialogFinished("Cancel");
}

FileChooserDialogUiController.prototype.dialogFinished = function (aGesture)
{
   if (this.dialogListener)
   {
      this.dialogListener.dialogFinished(aGesture, this);
   }
}

FileChooserDialogUiController.prototype.getDialogResults = function ()
{
   return this.detailsGrid.getSelectedUserObjects();
}


/**
 * called to setup the previous selections (usually just after initializing the UI)
 * @param aPreviousSelections
 */
FileChooserDialogUiController.prototype.setInitialSelections = function (aInitialSelections, aValuePropertyName, aDisplayTextPropertyName)
{
    // no-op here...
};
