
/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: ChangeOwnerDialogUi.js 6945 2009-10-19 14:40:14Z dbequeaith $



/**
 * I am the UI model for the FilterDialog screen...
 *
 * @constructor
 * @class
 * @author David Paul (dpaul@inmotio.com)
 **/
function ChangeOwnerDialogUiModel (aRootFolder, aSelectedNodeId)
{
   this.rootFolder = aRootFolder;
   this.preSelectedNodeId = aSelectedNodeId;
   this.currentFolderContents = [];
}


//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the FilterDialog screen...
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ChangeOwnerDialogUiController (aDocument, aModel, aIsMultiSelect)
{
   if (arguments.length > 0)
   {
      ChangeOwnerDialogUiController.superclass.constructor.call(this, aDocument, aIsMultiSelect);
      this.init(aDocument, aModel, aIsMultiSelect);
   }
}

//--- This class extends AbstractUiController
ChangeOwnerDialogUiController.prototype = new AbstractUiController();
ChangeOwnerDialogUiController.prototype.constructor = ChangeOwnerDialogUiController;
ChangeOwnerDialogUiController.superclass = AbstractUiController.prototype;


/**
 * @private
 **/
ChangeOwnerDialogUiController.prototype.init = function(aDocument, aModel, aIsMultiSelect)
{
   this.okButton = aDocument.getElementById("FilterSubmitButton");
   this.model = aModel;
   this.isMultiSelect = aIsMultiSelect;

   this.dialogListener = null;


   this.id = "uiController"; // observer usually has an id...

   //--- build tree structure from model...
}

/**
 * initializes the UI...
 **/
ChangeOwnerDialogUiController.prototype.initUi = function()
{

}

ChangeOwnerDialogUiController.prototype.processEvent = function (anEvent)
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

ChangeOwnerDialogUiController.prototype.handleSingleEvent = function (anEvent)
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

ChangeOwnerDialogUiController.prototype.enableSubmit = function(isEnabled)
{
   this.okButton.disabled = !isEnabled;
}

/**
 * a new folder was selected...
 **/
ChangeOwnerDialogUiController.prototype.folderWasSelected = function (aFolder)
{
   // not much to do for this dialog...
}


ChangeOwnerDialogUiController.prototype.setDialogListener = function (aDialogListener)
{
   this.dialogListener = aDialogListener;
}

ChangeOwnerDialogUiController.prototype.onOkButtonPress = function ()
{
   var owner = document.getElementById("ownerId");
   this.hasInputs = true;
   this.inputValue = "ownerId=" + owner.value;

   this.dialogFinished("OK");
}

ChangeOwnerDialogUiController.prototype.onCancelButtonPress = function ()
{
   this.dialogFinished("Cancel");
}

ChangeOwnerDialogUiController.prototype.dialogFinished = function (aGesture)
{
   if (this.dialogListener)
   {
      this.dialogListener.dialogFinished(aGesture, this);
   }
}

ChangeOwnerDialogUiController.prototype.getDialogResults = function ()
{
   return this;
}


/**
 * called to setup the previous selections (usually just after initializing the UI)
 * @param aPreviousSelections
 */
ChangeOwnerDialogUiController.prototype.setInitialSelections = function (aInitialSelections, aValuePropertyName, aDisplayTextPropertyName)
{
    // no-op here...
};
