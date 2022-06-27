/**
    Copyright 2001-2005, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: RclDialog.js 7053 2009-11-30 06:48:57Z lhankins $


function RclDialog ()
{
   this.dialogDiv = null;
   this.jtDialogBox = null;

   this.dialogListener = null;
   this.selectedValues = null;
   this.wasCancelled = false;
   this.inputValue = null;
   this.saveAsType = 'public';
   this.hasInputs = false;
   this.dialogType = null;

   this.positionX = -1;
   this.positionY = 0;
}

RclDialog.prototype.showChangeOwnerDialog = function(aTitle, aCurrentFilterSet, aType)
{
   this.dialogType = aType;
   this._launchChangeOwnerDialog(aTitle, aCurrentFilterSet);
};

RclDialog.prototype._launchChangeOwnerDialog = function (aTitle, aCurrentFilterSet)
{
   var src;

   this.dialogDiv = document.createElement("div");

   //--- note, appending the "rcl_" to address ticket #469
   this.dialogDiv.className = "rclDialogDiv " + "rcl_" + "folderWithInputChooser";

   document.rclDialog = this;

   var onload = "document.rclDialog.installDialogListener();";

   src = ServerEnvironment.baseUrl + '/secure/actions/changeOwner.do?' + aCurrentFilterSet;
   this.dialogDiv.innerHTML =
      '<iframe src="' + src + '" onload="' + onload + '"></iframe>'

   this.showDialog(aTitle, this.dialogDiv);
};

RclDialog.prototype.showFilterDialog = function(aTitle, aCurrentFilterSet, aType)
{
   this.dialogType = aType;
   this._launchFilterDialog(aTitle, aCurrentFilterSet);
};

RclDialog.prototype._launchFilterDialog = function (aTitle, aCurrentFilterSet)
{
   var src;
   var val;

   this.dialogDiv = document.createElement("div");

   //--- note, appending the "rcl_" to address ticket #469
   this.dialogDiv.className = "rclDialogDiv " + "rcl_" + "folderWithInputChooser";

   document.rclDialog = this;
           
   var onload = "document.rclDialog.installDialogListener();";


   // TODO: this should probably be removed (as the original Report Output filter dialog
   // that David Paul added has been removed - see ticket #1418).  I'm unclear on where
   // (if anywhere) this JS method is called from, so I'm leaving it for now.
   if (this.dialogType == 'filterReportInstances')
   {
      src = ServerEnvironment.baseUrl + '/secure/actions/filterReportInstances.do';
      for (val in aCurrentFilterSet)
      {
      }
   }
   else
   {
      src = ServerEnvironment.baseUrl + '/secure/actions/admin/filterIncidents.do';
      for (val in aCurrentFilterSet)
      {
      }
   }
   this.dialogDiv.innerHTML =
      '<iframe src="' + src + '" onload="' + onload + '"></iframe>'

   this.showDialog(aTitle, this.dialogDiv);
};

/**
 * launch a folder chooser dialog (folders only, no files)
 **/
RclDialog.prototype.showFolderChooserDialog = function (aTitle, aStartFromFolder, aPreSelectedPath, aIsMultiSelect, aFolderChooserType, aInputValue, aFolderSet)
{
   this.dialogType = aFolderChooserType;
   if (this.dialogType == "folderWithInputChooser")
   {
      this.positionY = -1;
   }
   this._launchPathPickerDialog(aTitle, aStartFromFolder, aPreSelectedPath,  aIsMultiSelect, aInputValue, aFolderSet);
};

/**
 * launch a permissions chooser dialog
 **/
RclDialog.prototype.showPermissionsChooserDialog = function (aTitle, anId, aNamespace, aNodeType, aCanInherit, aIsInherit, aDocument)
{
   this.dialogType = "permissionsChooser";
   this.visibleDocument = aDocument;
   this._launchPermissionsPickerDialog(aTitle, anId, aNamespace, aNodeType, aCanInherit, aIsInherit);
};

/**
 * @private
 **/
RclDialog.prototype._launchPathPickerDialog = function (aTitle, aStartFromFolder, aPreSelectedPath, aIsMultiSelect, aInputValue, aFolderSet)
{
   this.dialogDiv = document.createElement("div");

   //--- note, appending the "rcl_" to address ticket #469
   this.dialogDiv.className = "rclDialogDiv " + "rcl_" + this.dialogType;

   document.rclDialog = this;

   var onload = "document.rclDialog.installDialogListener();";

   var preSelect = (JsUtil.isGood(aPreSelectedPath)) ? "&currentSelection=" + aPreSelectedPath : '';


   var src = ServerEnvironment.baseUrl + '/secure/actions/rclDialog.do' +
             '?dialogType=' + this.dialogType +
             '&startFromPath=' + aStartFromFolder +
             "&multiSelect=" + aIsMultiSelect +
             "&saveAsNewProfileName=" + aInputValue +
             preSelect;

   if (aFolderSet != null && aFolderSet == "public")
   {
      src = ServerEnvironment.baseUrl + '/secure/actions/rclDialogPublicFolders.do' +
             '?dialogType=' + this.dialogType +
             '&startFromPath=' + aStartFromFolder +
             "&multiSelect=" + aIsMultiSelect +
             "&saveAsNewProfileName=" + aInputValue +
             preSelect;
   }

   this.dialogDiv.innerHTML =
      '<iframe src="' + src + '" onload="' + onload + '"></iframe>'

   this.showDialog(aTitle, this.dialogDiv);
};

/**
 * @private
 **/
RclDialog.prototype._launchPermissionsPickerDialog = function (aTitle, anItemId, aNamespace, aNodeType, aCanInherit, aIsInherit)
{
   this.dialogDiv = document.createElement("div");

   //--- note, appending the "rcl_" to address ticket #469
   this.dialogDiv.className = "rclDialogDiv " + "rcl_" + this.dialogType;

   document.rclDialog = this;

   var onload = "document.rclDialog.installDialogListener();";

   var itemId = '&contentNodeId=' + anItemId;
   if(aNodeType == "destination")
   {
      itemId = '&destinationId=' + anItemId;
   }
   else if(aNodeType == "capability")
   {
      itemId = '&capabilityId=' + anItemId;
   }

   var src = ServerEnvironment.baseUrl + '/secure/actions/admin/managePermissions.do' +
           '?namespace=' + aNamespace +
           '&canInheritPermissions=' + aCanInherit +
           '&inheritPermissions=' + aIsInherit +
           itemId;

   this.dialogDiv.innerHTML =
      '<iframe src="' + src + '" onload="' + onload + '"></iframe>'

   this.showDialog(aTitle, this.dialogDiv);
};

/**
 * private method
 */
RclDialog.prototype.showDialog = function (aTitle, aDialogDiv)
{
   if (this.visibleDocument)
      JsUtil.hideAllSelects(this.visibleDocument);

   var dialogDivWrapper = document.createElement("div");

   dialogDivWrapper.appendChild(aDialogDiv);
   this.jtDialogBox = new jt_DialogBox(true);
   this.jtDialogBox.setCallOK(document.rclDialog.disposeDialog);
   this.jtDialogBox.setCallCancel(document.rclDialog.disposeDialog);
   this.jtDialogBox.setTitle(aTitle);
   this.jtDialogBox.setContent(dialogDivWrapper.innerHTML);
   this.jtDialogBox.show();
   this.jtDialogBox.moveTo(this.positionX, this.positionY);
};






RclDialog.prototype.installDialogListener = function()
{
   this.iframe = this.jtDialogBox.container.getElementsByTagName("iframe")[0];
   this.iframe.contentWindow.dialogUiController.setDialogListener(this);
};



/**
 * someone's listening to this picker...
 **/
RclDialog.prototype.setDialogListener = function(aListener)
{
   this.dialogListener = aListener;
};

/**
 * This method is global and installed with jtDialogBox to listen for close
 * Since this method will be called from jtDialogBox.hide(), there are 2 entry points
 * 1. RclDialog.prototype.dialogFinished
 * 2. when the user clicks the close button from the title bar, jtDialogBox internally calls jtDialogBox.hide()
 * For the second case RclDialog.prototype.dialogFinished is called from for proper notification of dialg listeners
 **/
RclDialog.prototype.disposeDialog = function()
{
   //--- safe guard to avoid recursive calls
   if (JsUtil.isGood(document.rclDialog))
   {
      if (JsUtil.isGood(document.rclDialog.jtDialogBox))
      {
         document.rclDialog.dialogFinished("Cancel", null);
      }
   }
};

/**
* child dialog is calling us back...
**/
RclDialog.prototype.dialogFinished = function(aGesture, aDialogUiController)
{
   if (this.visibleDocument)
   {
      //alert('restoring selects');
      JsUtil.restoreHiddenSelects(this.visibleDocument);
   }

   document.rclDialog = null;

   //alert("dialog finished, [" + aGesture + "]");

   this.wasCancelled = (aGesture == "Cancel");

   if (this.wasCancelled == false)
   {
      this.selectedValues = aDialogUiController.getDialogResults();

      if (this.dialogType == "folderWithInputChooser")
      {
         this.inputValue = aDialogUiController.getInputResults();
         this.saveAsType = aDialogUiController.getPermissionsResults();

         //alert("saveAsType = [" + this.saveAsType + "]");
      }
      else if (this.dialogType == "filterIncidents" || this.dialogType == "filterReportInstances" || this.dialogType == "changeOwnerDialog")
      {       
         this.inputValue = aDialogUiController.inputValue;
         this.hasInputs = aDialogUiController.hasInputs;
      }
      //alert("dialog results were \n\n" + this.selectedValues.join("\n"));
   }

   //--- remove the dialog div...
   //--- use temp variable and reset this.jtDialogBox to avoid recursive call between jtDialogBox.hide() and RclDialog.prototype.disposeDialog
   var temp = this.jtDialogBox;
   this.jtDialogBox = null;
   temp.hide();
   document.body.removeChild(temp.container);

   this.dialogListener.dialogFinished(this);
};

