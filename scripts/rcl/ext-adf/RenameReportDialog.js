/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */


Adf.RenameReportDialog = Ext.extend(Ext.Window, {
   constructor: function(aConfig)
   {
      this.uiModel = {
//         // User root folder paths. Used to parse the destination folder path.
//         privateRootUserPath: '',
//         publicRootUserPath: '',


         // An indicator to show whether or not the user should be allowed to select permissions.
         userSelectPermission: false,


         // Language dependent text that will be used in an error message.
         displayPublicPermission: '',
         displayPrivatePermission: '',


         // Information about the report that is renamed, moved or copied.
         nodeId: '',
         nodeType: '',

         // A list of all available users when copying/moving a report to a private folder.
         allUsers: [],

         // The currently selected permission: private or public.
         permission: '',

         // The currently selected action to perform: rename/move or copy.
         moveAction: '',

         // The currently selected destination folder.
         currentFolderPath: '',

         reportName: '',

         // The currently selected users when copying/moving a report to a private folder.
         selectedUser: [],

         getDisplayPermission: function()
         {
            if (this.permission == 'private')
            {
               return this.displayPrivatePermission;
            }
            else
            {
               return this.displayPublicPermission;
            }
         }
      };

      if (Ext.isObject(aConfig))
      {
         this.uiModel.nodeId = aConfig.nodeId;
         this.uiModel.nodeType = aConfig.nodeType;
      }


      this.originalName = new Ext.form.DisplayField({
         fieldLabel: applicationResources.getProperty('renameReport.originalName'),
         labelSeparator: '',
         width: 350
      });

      this.newName = new Ext.form.TextField({
         fieldLabel: applicationResources.getProperty('renameReport.renameTo'),
         labelSeparator: '',
         width: 350
      });

      this.location = new Ext.form.TextField({
         width: 350
      });

      this.browseButton = new Ext.Button({
         text: applicationResources.getProperty('renameReport.button.browse'),
         scope: this,
         handler: this.onBrowseButtonClicked
      });

      this.locationArea = new Ext.form.CompositeField({
         fieldLabel: applicationResources.getProperty('renameReport.location'),
         labelSeparator: '',
         items: [
            this.location,
            this.browseButton
         ]
      });

      this.publicPermission = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty('renameReport.public'),
         name: 'permission',
         value: 'public',
         scope: this,
         handler: this.onPublicPermissionChecked
      });

      this.privatePermission = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty('renameReport.private') + '*',
         name: 'permission',
         value: 'private',
         scope: this,
         handler: this.onPrivatePermissionChecked
      });

      // Public permissions are only available to users belonging to admin groups.
      var permissionGroupItems = [];
      permissionGroupItems.push(this.publicPermission);
      permissionGroupItems.push(this.privatePermission);

      this.permissionGroup = new Ext.form.RadioGroup({
         fieldLabel: '',
         width: 300,
         items: permissionGroupItems
      });

//      this.userList = new Ext.grid.GridPanel({
      this.userList = new Ext.list.ListView({
         multiSelect: true,
         mode: 'local',
         height: 100,
         width: 300,
         hideHeaders: true,

//         isFormField: true, //NOTE: need to add this to a Ext.form.CompositeField component

         store: new Ext.data.JsonStore({
            autoDestroy: true,
            root: 'allUsers',
            fields: ['label']
         }),

         columns: [{
            header: 'Users',
            dataIndex: 'label'
         }]

      });


      // Note: need to add (isFormField: true) on components that are normally not form components and that component is
      // the first component added to Ext.form.CompositeField component.  Adding Ext.form.Hidden component as the first
      // component will also solve the problem.
      this.userControlGroup = new Ext.form.CompositeField({
         fieldLabel: applicationResources.getProperty('renameReport.forUser'),
         labelSeparator: '',
         items: [
            new Ext.Panel({
               isFormField: true, //NOTE: need to add this to a Ext.form.CompositeField component
               width: 300,
               items: [this.userList]
            })
         ]
      });

      this.renameMoveAction = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty('renameReport.radioInput.renameMove'),
         name: 'submitAction',
         value: 'move',
         scope: this,
         handler: this.onRenameMoveActionChecked
      });

      this.copyAction = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty('renameReport.radioInput.copy'),
         name: 'submitAction',
         value: 'copy',
         scope: this,
         handler: this.onCopyActionChecked
      });

      this.actionGroup = new Ext.form.RadioGroup({
         fieldLabel: '',
         width: 300,
         items: [
            this.renameMoveAction,
            this.copyAction
         ]
      });

      this.copyNote = new Ext.form.DisplayField({
         fieldLabel: '',
         value: applicationResources.getProperty('renameReport.createPrivateCopy'),
         width: 450
      });

      this.submitButton = new Ext.Button({
         text: applicationResources.getProperty('renameReport.button.rename'),
         scope: this,
         handler: this.onSubmitButtonClicked
      });

      this.cancelButton = new Ext.Button({
         text: applicationResources.getProperty('renameReport.button.cancel'),
         scope: this,
         handler: this.onCancelButtonClicked
      });

      aConfig = Ext.apply({
         title: applicationResources.getProperty('renameReport.pageBanner'),
         layout: 'border',
         width: 600,
         height: 380, // Height when all controls are visible.
         modal: true,
         bodyBorder: false,
         listeners: {
            render: this.onWindowRendered
         },

         items: [{
            xtype: 'panel',
            layout: 'form',
            region: 'center',
            frame: false,
            border: false,
            bodyStyle: {
               padding: '10px'
            },
            items: [
               this.originalName,
               this.newName,
               this.locationArea,
               this.permissionGroup,
               this.userControlGroup,
               this.actionGroup,
               this.copyNote
            ]
         }],

         fbar: [
            this.submitButton,
            this.cancelButton
         ]

      }, aConfig);

      Adf.RenameReportDialog.superclass.constructor.call(this, aConfig);

   },

   onWindowRendered: function(aWindow)
   {
      Ext.Msg.wait(applicationResources.getProperty('general.loading'));
      RequestUtil.request({
         url: ServerEnvironment.baseUrl + '/secure/actions/ext/getRenameReportInfo.do',
         params: {
            nodeId: this.uiModel.nodeId,
            nodeType: this.uiModel.nodeType
         },
         scope: this,
         callback: function(aOptions, aSuccess, aResponse)
         {
            Ext.Msg.hide();
         },
         success: function(aResponse, aOption)
         {
            var data = Ext.decode(aResponse.responseText);
            this.uiModel = Ext.apply(this.uiModel, data);
            this.loadData();
         }
      });
   },

   /**
    * This method handles the public permission radio button check event. It configures the screen when the
    * public permission radio button is checked.
    *
    * @param aRadio - The public permission radio button.
    * @param isChecked - A checked indicator.
    */
   onPublicPermissionChecked: function(aRadio, isChecked)
   {

      this.disableUserList();
   },


   /**
    * This method handles the private permission radio button check event. It configures the screen when the
    * private permission radio button is checked.
    *
    * @param aRadio - The private permission radio button.
    * @param isChecked - A checked indicator.
    */
   onPrivatePermissionChecked: function(aRadio, isChecked)
   {
      this.disableUserList();
   },


   /**
    * This method handles the rename/move action radio button check event. It configures the screen when the
    *    rename/move action is checked.
    *
    * @param aRadio - The rename/move action radio button.
    * @param isChecked - A checked indicator.
    */
   onRenameMoveActionChecked: function(aRadio, isChecked)
   {
      this.toggleSubmitButtonText();
   },


   /**
    * This method handles the copy action radio button check event. It configures the screen when the copy action
    *    is checked.
    *
    * @param aRadio - The copy action radio button.
    * @param isChecked - A checked indicator.
    */
   onCopyActionChecked: function(aRadio, isChecked)
   {
      this.toggleSubmitButtonText();
   },


   /**
    * This method handles the browse button click event. It displays the ADF folder picker dialog.
    *
    * @param aButton - The Browse button.
    * @param aEventObject - The click event object.
    */
   onBrowseButtonClicked: function(aButton, aEventObject)
   {
      Adf.adfFolderPickerDialog.showFolderPickerWindow(this.folderPickerCallback.createDelegate(this));
   },


   /**
    * This method handles the folder picker callback. It configures the screen based on the folder picked and
    *    populates the destination folder field.
    *
    * @param aFolderId - Folder path.
    */
   folderPickerCallback: function(aFolderId)
   {
      this.uiModel.currentFolderPath = aFolderId;

      if (this.uiModel.currentFolderPath.indexOf("My Folders") != -1)
      {
         this.permissionGroup.el.parent().parent().setDisplayed('none');
         this.copyNote.el.parent().parent().setDisplayed('none');
         this.userControlGroup.el.parent().parent().setDisplayed('none');
      }
      else
      {
         this.permissionGroup.el.parent().parent().setDisplayed('');
         this.copyNote.el.parent().parent().setDisplayed('');
         if (!this.uiModel.userSelectPermission)
         {
            this.userControlGroup.el.parent().parent().setDisplayed('none');
         }
         else
         {
            this.userControlGroup.el.parent().parent().setDisplayed('');
         }

      }

      this.convertFolderPathToDisplayValue();

      this.doLayout();
   },


   /**
    * This method performs some validation and fills the model with screen data before submitting it.
    */
   beforeSubmit: function()
   {
      var isValid = this.validateInput();

      if (isValid)
      {
         this.uiModel.reportName = this.newName.getValue();
//      this.uiModel.nodeId = ''; Filled by action.
//      this.uiModel.nodeType = ''; Filled by action.
         this.uiModel.permission = (this.publicPermission.getValue()) ? 'public' : 'private';
         this.uiModel.moveAction = (this.copyAction.getValue()) ? 'copy' : 'move';
//      this.uiModel.currentFolderPath = ''; Set by action or folder picker.


         this.uiModel.selectedUser = [];
         var selectedUsers = this.userList.getSelectedRecords();
         for (var i = 0; i < selectedUsers.length; i++)
         {
            this.uiModel.selectedUser.push(selectedUsers[i].json.value);
         }

//         this.debugObj(this.uiModel);
      }

      return isValid;
   },



   /**
    * This method handles the submit button click event.
    *
    * @param aButton - The submit button.
    * @param aEventObject - An event object.
    */
   onSubmitButtonClicked: function(aButton, aEventObject)
   {
      if (this.beforeSubmit())
      {
         Ext.Msg.wait(applicationResources.getProperty('renameReport.message.wait'), 'Submitting Information');

         RequestUtil.request({
            url: ServerEnvironment.contextPath+"/secure/actions/extExecuteRename.do",
            success: this.onSubmitSuccess.createDelegate(this),
            failure: this.onSubmitFailure.createDelegate(this),
            params: {
               reportName: this.uiModel.reportName,
               nodeId: this.uiModel.nodeId,
               nodeType: this.uiModel.nodeType,
               permission: this.uiModel.permission,
               moveAction: this.uiModel.moveAction,
               currentFolderPath: this.uiModel.currentFolderPath,
               selectedUser: this.uiModel.selectedUser
            }
         });

      }
   },


   /**
    * This method handles the submit callback when the ajax call succeeds.
    *
    * @param aResponse - The XMLHttpRequest object containing the response data.
    * @param aOption - The parameter to the request call.
    */
   onSubmitSuccess: function(aResponse, aOption)
   {
      var response = Ext.decode(aResponse.responseText);
      if (response.success)
      {
         Ext.Msg.hide();
         Adf.folderContentsUi.refreshContentsGrid();
         this.close();
      }
      else
      {
         // Invalid or duplicate report name.
         var message = String.format(applicationResources.getProperty('renameReport.invalidNameOrNameAlreadyExists'),
            this.uiModel.getDisplayPermission());
         Ext.Msg.show({
            title: applicationResources.getProperty('renameReport.pageBanner'),
            msg: message,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
         });
      }
   },


   /**
    * This method handles the callback when the ajax call fails.
    *
    * @param aResponse - The XMLHttpRequest object containing the response data.
    * @param aOption - The parameter to the request call.
    */
   onSubmitFailure: function(aResponse, aOption)
   {
      Ext.Msg.show({
         title: applicationResources.getProperty('renameReport.pageBanner'),
         msg: applicationResources.getProperty('renameReport.message.ajax.error'),
         buttons: Ext.MessageBox.OK,
         icon: Ext.MessageBox.ERROR
      });
   },


   /**
    * This method handles the cancel button click event.
    *
    * @param aButton - The cancel button.
    * @param aEventObject - The button click event object.
    */
   onCancelButtonClicked: function(aButton, aEventObject)
   {
      this.close();
   },


   /**
    * This method changes the submit button text when the action radio buttons are clicked.
    */
   toggleSubmitButtonText: function()
   {
      if (this.renameMoveAction.getValue())
      {
         this.submitButton.setText(applicationResources.getProperty('renameReport.button.rename'));
      }
      else
      {
         this.submitButton.setText(applicationResources.getProperty('renameReport.button.copy'));
      }
   },


   /**
    * This method displays the rename/move report data.
    */
   loadData: function()
   {
      this.originalName.setValue(this.uiModel.reportName);
      this.newName.setValue(this.uiModel.reportName);
      if (this.uiModel.permission == 'private')
      {
         this.privatePermission.setValue(true);
      }
      else
      {
         this.publicPermission.setValue(true);
      }
      this.userList.getStore().loadData(this.uiModel);

      if (this.uiModel.moveAction == 'copy')
      {
         this.copyAction.setValue(true);
      }
      else
      {
         this.renameMoveAction.setValue(true);
      }

      this.checkPath();
      this.convertFolderPathToDisplayValue();

      var selectedUserRecordIndexes = [];
      for (var i = 0; i < this.uiModel.selectedUser.length; i++)
      {
         var recordIndex = this.userList.getStore().findExact('label', this.uiModel.selectedUser[i]);
         if (recordIndex > -1)
         {
            selectedUserRecordIndexes.push(recordIndex);
         }
      }
      if (selectedUserRecordIndexes.length > 0)
      {
         this.userList.select(selectedUserRecordIndexes);
      }

      this.disableUserList();

      this.doLayout();
   },


   /*
    * This method configures the rename/move screen based on data.
    */
   checkPath: function()
   {
      if (this.uiModel.currentFolderPath.indexOf("My Folders") != -1)
      {
         this.permissionGroup.el.parent().parent().setDisplayed('none');
         this.copyNote.el.parent().parent().setDisplayed('none');
         this.userControlGroup.el.parent().parent().setDisplayed('none');
      }

      if (!this.uiModel.userSelectPermission)
      {
         this.userControlGroup.el.parent().parent().setDisplayed('none');
      }
   },


   /**
    * This method fills the destination folder field.
    */
   convertFolderPathToDisplayValue: function()
   {
      var array = this.uiModel.currentFolderPath.split("/");
      this.location.setValue(array[array.length - 1]);
   },


   /**
    * This method enables/disables the user list based on the permission radio buttons.
    */
   disableUserList: function()
   {
      if (this.privatePermission.getValue())
      {
         this.userList.enable();
      }
      else
      {
         this.userList.disable();
      }
   },


   /**
    * This method validates that at least one user is selected when private permission is selected.
    */
   validateInput: function()
   {
      if (this.privatePermission.getValue() && this.uiModel.userSelectPermission && this.userList.getSelectionCount() == 0)
      {
         Ext.Msg.show({
            title: applicationResources.getProperty('renameReport.pageBanner'),
            msg: applicationResources.getProperty("renameReport.selectUser"),
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
         });
         return false;
      }
      else
      {
         return true;
      }
   }
});

