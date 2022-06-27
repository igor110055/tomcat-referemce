function DialogUtil()
{

}

DialogUtil.rclAlertDialog = null;
DialogUtil.appName = "RCL"; //--- this can be customized for rcl-customer apps


/**
 * private
 */
DialogUtil.rclAlertInit =  function (title, icon)
{
   // 'title' and 'icon' are optional; both may be changed using 'RclAlert()'
   var locTitle = DialogUtil.appName;
   if (title) locTitle += " - " + title;
   if (DialogUtil.rclAlertDialog == null)
   {
      DialogUtil.rclAlertDialog = new jt_AppAlert(icon ? icon : jt_AppAlert.Error, "OK");
      DialogUtil.rclAlertDialog.setTitle(locTitle);
   }
   else
   {
      DialogUtil.rclAlertDialog.setTitle(locTitle);
      if (icon) DialogUtil.rclAlertDialog.setIcon(icon);
   }
}

/**
 * alert simple string
 * aMsg is required, all other params are optional
 * aIcon defaults to error
 * aX and aY defaults to center
 */
DialogUtil.rclAlert  =  function (aMsg, aTitle, aIcon, aX, aY)
{
   var html = "<div><div class=\"rclAlert\">" +  aMsg + "</div></div>";
   DialogUtil.rclAlertEx(html, aTitle, aIcon, aX, aY);
}

/**
* alert html content
*/
DialogUtil.rclAlertEx  =  function (aHtmlContent, aTitle, aIcon, aX, aY)
{
   // 'title' and 'icon' are optional
   var title = (JsUtil.isGood(aTitle)) ? aTitle : null;
   var icon = (JsUtil.isGood(aIcon)) ? aIcon : "error_icon.gif";
   DialogUtil.rclAlertInit(title, icon);
   DialogUtil.rclAlertDialog.setContent(aHtmlContent);
   DialogUtil.rclAlertDialog.show();
   var x = (JsUtil.isGood(aX)) ? aX : -1;
   var y = (JsUtil.isGood(aY)) ? aY : -1;
   DialogUtil.rclAlertDialog.moveTo(x, y);
}

/**
* alert simple string as a warning
* aMsg is required, all other params are optional
*/
DialogUtil.rclAlertWarning =  function  (aMsg, aTitle,aX, aY)
{
   DialogUtil.rclAlert(aMsg, aTitle, "warning_icon.gif" , aX, aY);
}


/**
 * aHtmlContent           content to display in the comfirm dialog
 * aCallOK                call back function for ok button
 * aCallCancel            call back function for cacnel button (optional)
 * aTitle                 title fof the dialog (optional)
 * aOKButtonLabel         label of the ok button (optional)
 * aCancelButtonLabel     label of the ok button (optional)
 * aIcon                  icon for the dialog (optional)
 * aX                     position of the dialog (optional)
 * aY                     position of the dialog (optional)
*/
DialogUtil.rclConfirm =  function (aHtmlContent, aCallOK , aCallCancel, aTitle, aOKButtonLabel, aCancelButtonLabel, aIcon, aX, aY)
{
   // 'title' and 'icon' are optional;
   var locTitle = DialogUtil.appName;
   if (aTitle) locTitle += " - " + aTitle;
   var okLabel =  (JsUtil.isGood(aOKButtonLabel)) ? aOKButtonLabel : "OK";
   var cancelLabel =  (JsUtil.isGood(aCancelButtonLabel)) ? aCancelButtonLabel : "Cancel";
   var rclConfirmDialog = new jt_AppConfirm(aIcon, aCallOK, aCallCancel, okLabel, cancelLabel);
   rclConfirmDialog.setTitle(locTitle);
   var x = (JsUtil.isGood(aX)) ? aX : -1;
   var y = (JsUtil.isGood(aY)) ? aY : -1;
   rclConfirmDialog.moveTo(x, y);
   rclConfirmDialog.askUser(aHtmlContent);
}

/**
 * aHtmlContent           content to display in the comfirm dialog
 * aCallOK                call back function for ok button
 * aCallCancel            call back function for cacnel button (optional)
 * aTitle                 title fof the dialog (optional)
 * aYesButtonLabel        label of the yes button (optional)
 * aNoButtonLabel         label of the no button (optional)
 * aCancelButtonLabel     label of the ok button (optional)
 * aIcon                  icon for the dialog (optional)
 * aX                     position of the dialog (optional)
 * aY                     position of the dialog (optional)
*/
DialogUtil.rclYesNoCancel =  function (aHtmlContent, aCallOK , aCallCancel, aTitle, aYesButtonLabel, aNoButtonLabel, aCancelButtonLabel, aIcon, aX, aY)
{
   // 'title' and 'icon' are optional;
   var locTitle = DialogUtil.appName;
   if (aTitle) locTitle += " - " + aTitle;
   var yesLabel = (JsUtil.isGood(aYesButtonLabel)) ? aYesButtonLabel : "Yes";
   var noLabel = (JsUtil.isGood(aNoButtonLabel)) ? aNoButtonLabel : "No";
   var cancelLabel =  (JsUtil.isGood(aCancelButtonLabel)) ? aCancelButtonLabel : "Cancel";
   var rclYesNoCancelDialog = new jt_AppYesNoCancel(aIcon, aCallOK, aCallCancel, yesLabel, noLabel, cancelLabel);
   rclYesNoCancelDialog.setTitle(locTitle);
   var x = (JsUtil.isGood(aX)) ? aX : -1;
   var y = (JsUtil.isGood(aY)) ? aY : -1;
   rclYesNoCancelDialog.moveTo(x, y);
   rclYesNoCancelDialog.askUser(aHtmlContent);
}

/**
 * aHtmlContent           content to display in the comfirm dialog
 * aDefaultValue          default value to display
 * aCallOK                call back function for ok button
 * aCallCancel            call back function for cacnel button (optional)
 * aTitle                 title fof the dialog (optional)
 * aIcon                  icon for the dialog (optional)
 * aX                     position of the dialog (optional)
 * aY                     position of the dialog (optional)
*/
DialogUtil.rclPrompt =  function (aHtmlContent, aDefaultValue, aCallOK, aCallCancel, aTitle, aIcon, aX, aY)
{
   // 'title' and 'icon' are optional;
   var locTitle = DialogUtil.appName;
   if (aTitle) locTitle += " - " + aTitle;
   var rclPromptDialog = new jt_AppPrompt(aIcon, aCallOK, aCallCancel);
   rclPromptDialog.setTitle(locTitle);
   var x = (JsUtil.isGood(aX)) ? aX : -1;
   var y = (JsUtil.isGood(aY)) ? aY : -1;
   rclPromptDialog.moveTo(x, y);
   var defaultValue = (JsUtil.isGood(aDefaultValue)) ? aDefaultValue : "";
   rclPromptDialog.askUser(aHtmlContent, aDefaultValue);
}

/**
 * aHtmlContent           content to display in the comfirm dialog
 * aValueList             list of values for the dropdown
 * aDisplayList           list of display text for the dropdown
 * aDefaultValue          default value to display
 * aCallOK                call back function for ok button
 * aCallCancel            call back function for cacnel button (optional)
 * aTitle                 title fof the dialog (optional)
 * aIcon                  icon for the dialog (optional)
 * aX                     position of the dialog (optional)
 * aY                     position of the dialog (optional)
*/
DialogUtil.rclSelect =  function (aHtmlContent, aValueList, aDisplayList, aDefaultValue, aCallOK, aCallCancel, aTitle, aIcon, aX, aY)
{
   // 'title' and 'icon' are optional;
   var locTitle = DialogUtil.appName;
   if (aTitle) locTitle += " - " + aTitle;
   var rclSelectDialog = new jt_AppSelect(aIcon, aCallOK, aCallCancel);
   rclSelectDialog.setTitle(locTitle);
   var x = (JsUtil.isGood(aX)) ? aX : -1;
   var y = (JsUtil.isGood(aY)) ? aY : -1;
   rclSelectDialog.moveTo(x, y);
   var defaultValue = (JsUtil.isGood(aDefaultValue)) ? aDefaultValue : "";
   rclSelectDialog.askUser(aHtmlContent, aValueList, aDisplayList, aDefaultValue);
}

DialogUtil.openPackageDialog = function(crnPackagePaths, crnPackageNames, acceptCallback, cancelCallback)
{
   DialogUtil.rclSelect("<b>Select a package</b> <br/>", crnPackagePaths, crnPackageNames, "", acceptCallback, this.cancelCallback, "Package", null, 10, 300);
}

