
/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: FilterIncidentsDialogUi.js 6945 2009-10-19 14:40:14Z dbequeaith $



/**
 * I am the UI model for the FilterIncidentsDialog screen...
 *
 * @constructor
 * @class
 * @author David Paul (dpaul@inmotio.com)
 **/
function FilterIncidentsDialogUiModel (aRootFolder, aSelectedNodeId)
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
 * @author David Paul (dpaul@inmotio.com)
 **/
function FilterIncidentsDialogUiController (aDocument, aModel, aIsMultiSelect)
{
   if (arguments.length > 0)
   {
      FilterIncidentsDialogUiController.superclass.constructor.call(this, aDocument, aIsMultiSelect);
      this.init(aDocument, aModel, aIsMultiSelect);
   }
}

//--- This class extends AbstractUiController
FilterIncidentsDialogUiController.prototype = new AbstractUiController();
FilterIncidentsDialogUiController.prototype.constructor = FilterIncidentsDialogUiController;
FilterIncidentsDialogUiController.superclass = AbstractUiController.prototype;


/**
 * @private
 **/
FilterIncidentsDialogUiController.prototype.init = function(aDocument, aModel, aIsMultiSelect)
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
FilterIncidentsDialogUiController.prototype.initUi = function()
{

}

FilterIncidentsDialogUiController.prototype.processEvent = function (anEvent)
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

FilterIncidentsDialogUiController.prototype.handleSingleEvent = function (anEvent)
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

FilterIncidentsDialogUiController.prototype.enableSubmit = function(isEnabled)
{
   this.okButton.disabled = !isEnabled;
}

/**
 * a new folder was selected...
 **/
FilterIncidentsDialogUiController.prototype.folderWasSelected = function (aFolder)
{
   // not much to do for this dialog...
}


FilterIncidentsDialogUiController.prototype.setDialogListener = function (aDialogListener)
{
   this.dialogListener = aDialogListener;
}

FilterIncidentsDialogUiController.prototype.onOkButtonPress = function ()
{  
   var sDate = document.getElementById("startDate");
   var eDate = document.getElementById("endDate");
   var sDateCheck = document.getElementById("startDateCheck");
   var eDateCheck = document.getElementById("endDateCheck");

   var isValid = true;

   if (!Date.validateDateStr(sDate.value,  "%Y-%m-%d", true))
   {
      sDateCheck.innerHTML = "Error in start date - YYYY-MM-dd";
      sDateCheck.style.color = "red";
      sDateCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      sDateCheck.style.display = "none";
   }

   if (!Date.validateDateStr(eDate.value,  "%Y-%m-%d", true))
   {
      eDateCheck.innerHTML = "Error in end date - YYYY-MM-dd";
      eDateCheck.style.color = "red";
      eDateCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      eDateCheck.style.display = "none";
   }

   if (isValid)
   {
      var inputs = document.getElementsByTagName("input");
      this.inputValue = "";

      for (i=0; i< inputs.length; i++)
      {
         if (inputs[i].value != '' && inputs[i].value != null && inputs[i].type == "text")
         {
            if (this.hasInputs)
            {
               this.inputValue += "&" + inputs[i].name + "=" + inputs[i].value;
            }
            else
            {
               this.hasInputs = true;
               this.inputValue += "?" + inputs[i].name + "=" + inputs[i].value;
            }
         }
      }
      var startTimeAmPm = document.getElementById("startTimeAmPm");
      var endTimeAmPm = document.getElementById("endTimeAmPm");
      this.inputValue += "&startTimeAmPm=" + startTimeAmPm.value + "&endTimeAmPm=" + endTimeAmPm.value;      

      this.dialogFinished("OK");
   }

}

FilterIncidentsDialogUiController.prototype.onCancelButtonPress = function ()
{
   this.dialogFinished("Cancel");
}

FilterIncidentsDialogUiController.prototype.dialogFinished = function (aGesture)
{
   if (this.dialogListener)
   {
      this.dialogListener.dialogFinished(aGesture, this);
   }
}

FilterIncidentsDialogUiController.prototype.getDialogResults = function ()
{
   return this;
}


/**
 * called to setup the previous selections (usually just after initializing the UI)
 * @param aPreviousSelections
 */
FilterIncidentsDialogUiController.prototype.setInitialSelections = function (aInitialSelections, aValuePropertyName, aDisplayTextPropertyName)
{
    // no-op here...
};
