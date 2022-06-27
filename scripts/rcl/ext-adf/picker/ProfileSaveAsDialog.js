/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

Adf.profileSaveAsDialog = function()
{
   return{
      showSaveAsDialog: function(aCallbackContext, aCallback, aProfileName, aPrivateFlag, aCurrentFolder)
      {
         this.tree = new Adf.AdfFolderPickerTree({
            height: 300,
            region: 'center',
            width: "100%",
            bodyStyle:{
               "background-color":"white",
               "padding":'5px 5px 0'
            },
            border : true,
            containerScroll: true,
            selectedNodeId : aCurrentFolder
         });

         var publicRadio = new Ext.form.Radio({
            boxLabel: applicationResources.getProperty("saveAsProfileDialog.publicRadio"),
            name: "profileView",
            inputValue: "0",
            disabled : !ServerEnvironment.isAdminUser
         });

         var privateRadio = new Ext.form.Radio({
            boxLabel: applicationResources.getProperty("saveAsProfileDialog.privateRadio"),
            name: "profileView",
            inputValue: "1"
         });

         var viewRadioGroup = new Ext.form.RadioGroup({
            xtype: "radiogroup",
            columns: 2,
            vertical: false,
            hideLabel: true,
            items: [
               publicRadio,
               privateRadio
            ],
            value: (aPrivateFlag?"1":"0")
         });
         this.profileNameField = new Ext.form.TextField({
                  fieldLabel: applicationResources.getProperty('saveAsProfileDialog.profileName'),
                  name: 'profileName',
                  allowBlank:false,
                  width: "95%",
                  value: aProfileName + " - "
               });
         var bottomPanel = new Ext.Panel({
            layout: 'form',
            region: 'south',
            height: 75,
            width: "100%",
            bodyStyle:{
               "padding":'5px 5px 5px 5px'
            },
            items: [
               this.profileNameField,
               viewRadioGroup]
         });

         var adfFolderPickerWindow = new Ext.Window({
            labelWidth: 90, // label settings here cascade unless overridden
            autoScroll: true,
            modal: true,
            title: applicationResources.getProperty('saveAsProfileDialog.windowTitle'),
            closable: true,
            layout      : 'border',
            width       : 400,
            height      : 500,
            closeAction : 'close',
            plain       : true,
            items       :[this.tree,
               bottomPanel],
            buttons     : [
               {
                  text     : applicationResources.getProperty('button.Save'),
                  handler  : function()
                  {
                     if(this.validate())
                     {
                        aCallback.call(aCallbackContext, this.profileNameField.getValue(), privateRadio.getValue(), this.tree.getSelectedNodePath(), this.tree.getSelectedNodeID());
                        adfFolderPickerWindow.close();
                     }
                     else
                     {
                        Ext.Msg.alert(applicationResources.getProperty('saveAsProfileDialog.validationAlertTitle'), applicationResources.getProperty('saveAsProfileDialog.validationAlertMessage'));
                     }
                  },
                  scope: this
               },
               {
                  text    : applicationResources.getProperty('button.Cancel'),
                  handler : function()
                  {
                     adfFolderPickerWindow.close();
                  },
                  scope: this
               }
            ]

         });
         adfFolderPickerWindow.show();
      },

      validate : function()
      {
         return (!Ext.isEmpty(this.tree.getSelectedNodePath()) && !Ext.isEmpty(this.profileNameField.getValue()));
      }
   };
}();
