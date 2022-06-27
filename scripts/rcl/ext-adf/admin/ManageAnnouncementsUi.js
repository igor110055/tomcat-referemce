

/**
 * This static class contains the current ADF and EXTJS date formats defined for the current user. If the
 * current user is using the default format then the default server environment date format is used.
 *
 * The EXTJS date format will be used to set the date format in EXTJS Date Fields (Ext.form.DateField). On the backend,
 * the same logic should be used to create the format string used to parse the incoming date and formatting the
 * outgoing dates.
 *
 * todo: Set the format on all Ext.form.DateField, will need to add support to handle user preferences date
 * format changes.
 */
Adf.ManageAnnouncementDateFormat = function(){

   var adfValue;


   // Determine the ADF date format.
   if (Ext.isEmpty(ServerEnvironment.userDateFormat) || (ServerEnvironment.userDateFormat=='DEFAULT'))
   {
      adfValue = ServerEnvironment.defaultDateFormat;
   }
   else
   {
      adfValue = ServerEnvironment.userDateFormat;
   }

   var rawAdfValue = adfValue.toLowerCase();
   var isMonthProcessed = false;
   var isDayProcessed = false;
   var isYearProcessed = false;
   var extValue = '';
   for (var i = 0; i < rawAdfValue.length; i++)
   {
      var letter = rawAdfValue.charAt(i);
      if (letter == 'm')
      {
         if (!isMonthProcessed)
         {
            extValue += 'm';
         }
         isMonthProcessed = true;
      }
      else if (letter == 'd')
      {
         if (!isDayProcessed)
         {
            extValue += letter;
         }
         isDayProcessed = 'd';
      }
      else if (letter == 'y')
      {
         if (!isYearProcessed)
         {
            extValue += 'Y';
         }
         isYearProcessed = true;
      }
      else
      {
         // assuming it's a separator.
         extValue += '/'
      }
   }


   return {
      adfValue: adfValue,
      extValue: extValue,
      getAdfValue: function()
      {
         return this.adfValue;
      },
      getExtValue: function()
      {
         return this.extValue;
      }
   };


}();




//======================================================================================================================
/**
 * This component provides functionality to display and edit the details of an announcement in a pop up window.
 * It displays an existing announcement if an announcement ID is passed in or allows a new announcement to be created.
 */
Adf.ManageAnnouncementEditor = Ext.extend(Ext.Window, {


   /**
    * Constructor.
    *
    * @param aConfig A configuration for this Announcement Editor.
    */
   constructor: function (aConfig) {
      this.addEvents({
         /**
          * This event is fired when the Cancel button is pressed.
          */
         "cancelled" : true,

         /**
          * This event is fired when the Save button is pressed.
          */
         "saved" : true
      });



      this.availableOrganizations = new Ext.grid.GridPanel({
         flex: 1,
         height: 200,
         enableHdMenu: false,
         enableColumnMove: false,
         enableDragDrop: false,
         loadMask: true,
         stripeRows: true,
         store: new Ext.data.JsonStore({
            autoDestroy: true,


            root: 'availableOrganizations',

            idProperty: 'organizationId',

            fields: [
               {name: 'organizationId', mapping: 'organizationId', type: 'int'},
               {name: 'name', mapping: 'name'}
            ]
         }),
         colModel: new Ext.grid.ColumnModel({
            defaults: {
               width: 120,
               sortable: true
            },
            columns: [{
               id: 'availableOrganizationName',
               header: applicationResources.getProperty('admin.announcement.availableOrganizations'),
               width: 300,
               sortable: true,
               dataIndex: 'name'
            }]
         })
      });


      this.selectedOrganizations = new Ext.grid.GridPanel({
         flex: 1,
         height: 200,
         enableHdMenu: false,
         enableColumnMove: false,
         enableDragDrop: false,
         loadMask: true,
         stripeRows: true,
         store: new Ext.data.JsonStore({
            autoDestroy: true,

            root: 'selectedOrganizations',

            idProperty: 'organizationId',

            fields: [
               {name: 'organizationId', mapping: 'organizationId', type: 'int'},
               {name: 'name', mapping: 'name'}
            ]
         }),
         colModel: new Ext.grid.ColumnModel({
            defaults: {
               width: 120,
               sortable: true
            },
            columns: [{
               id: 'selectedOrganizationName',
               header: applicationResources.getProperty('admin.announcement.selectedOrganizations'),
               width: 300,
               sortable: true,
               dataIndex: 'name'
            }]
         })
      });



      this.formPanel = new Adf.AdfFormPanel({
         url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchAnnouncementDetails.do',

         bodyStyle: 'padding:10px',

         items:[{
            xtype: 'hidden',
            fieldLabel: 'i8ln-Announcement ID',
            name: 'announcementId'
         }, {
            xtype: 'textfield',
            fieldLabel: applicationResources.getProperty('admin.announcement.subject'),
            width: 500,
            name: 'subject'
         }, {
            xtype: 'textarea',
            fieldLabel: applicationResources.getProperty('admin.announcement.message'),
            width: 500,
            name: 'textMessage'
         }, {
            xtype: 'checkbox',
            fieldLabel: applicationResources.getProperty('admin.announcement.active'),
            name: 'isActive'
         }, {
            xtype: 'datefield',
            format: Adf.ManageAnnouncementDateFormat.getExtValue(),
            fieldLabel: applicationResources.getProperty('admin.announcement.expiration'),
            name: 'expirationDate'
         }, {
            xtype: 'container',
            fieldLabel: applicationResources.getProperty('admin.announcement.distribution'),
            layout: 'hbox',
            width: 500,
            style: {
            },
            items: [
               this.availableOrganizations,

               {
                  xtype: 'container',
                  style: {
                  },
                  width: 60,
                  height: 200,
                  layout: 'vbox',
                  layoutConfig: {
                     align: 'stretch',
                     pack: 'center',
                     defaultMargins: {
                        top: 2,
                        right: 10,
                        bottom: 2,
                        left: 10
                     }
                  },
                  items: [{
                     xtype: 'button',
                     text: '&gt;&gt;',
                     handler: this.onAddOrganizationButtonClicked,
                     scope: this
                  }, {
                     xtype: 'button',
                     text: '&lt;&lt;',
                     handler: this.onRemoveOrganizationButtonClicked,
                     scope: this
                  }]
               }

               ,this.selectedOrganizations
            ]

         }]
      });


      aConfig = Ext.apply({
         modal: true,
         layout: 'fit',
         height: 480,
         width: 660,
         items: [this.formPanel],
         buttons: [{
            text: applicationResources.getProperty('button.Save'),
            handler: this.onSaveButtonClicked,
            scope: this
         }, {
            text: applicationResources.getProperty('button.Cancel'),
            handler: this.onCancelButtonClicked,
            scope: this
         }]
      }, aConfig);

      Adf.ManageAnnouncementEditor.superclass.constructor.call(this, aConfig);


      // Post Processing.
   },


   /**
    * This method shows Announcement Details dialog. It loads and populates the dialog with the announcement details
    * if a valid announcement ID is passed in or displays an empty screen for a new announcement.
    *
    * @param aAnnouncementId An ID of the announcement to edit or null if this is a new announcement.
    */
   show: function(aAnnouncementId)
   {
      this.announcementId = aAnnouncementId;

      if (!Ext.isEmpty(aAnnouncementId))
      {
         this.formPanel.getForm().load({
            url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchAnnouncementDetails.do',
            params: {
               announcementId: aAnnouncementId
            },
            success: this.onLoadSuccess,
            scope: this,
            waitMsg: applicationResources.getProperty('general.loading')
         });
      }
      else
      {
         // New announcement, just load the available list of organizations.
         RequestUtil.request({
            url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchAllOrganizations.do',
            success: function(aResponse, aOptions)
            {
               // If there is only a single organization the pre-select it.
               var result = Ext.decode(aResponse.responseText);
               if (result.organizations.length > 1)
               {
                  this.availableOrganizations.getStore().loadData({
                     availableOrganizations: result.organizations
                  });
               }
               else
               {
                  this.selectedOrganizations.getStore().loadData({
                     selectedOrganizations: result.organizations
                  });
               }
            },
            scope: this
         });
         this.setTitle(applicationResources.getProperty('admin.announcement.title.new'));
      }

      // Display the dialog.
      Adf.ManageAnnouncementEditor.superclass.show.call(this);
   },



   /**
    * This method performs some post processing during the form loading process. It loads the
    * available and selected lists of organizations.
    *
    * @param aForm (Ext.form.FormPanel) A reference to the announcement details form panel.
    * @param aAction (Ext.form.Action.Load) Form load object.
    */
   onLoadSuccess: function(aForm, aAction)
   {
      this.availableOrganizations.getStore().loadData(aAction.result.data);
      this.selectedOrganizations.getStore().loadData(aAction.result.data);
      this.setTitle(aAction.result.data.subject);
   },


   /**
    * This method handles the Add Organization button click event. It moves the highlighted organizations from
    * the Available Organizations list to the Selected Organizations list.
    *
    * @param aButton (Ext.Button) A reference to the Add Organization button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onAddOrganizationButtonClicked: function(aButton, aEventObject)
   {
      if (this.availableOrganizations.getSelectionModel().hasSelection())
      {
         var selectedRecords = this.availableOrganizations.getSelectionModel().getSelections();
         this.availableOrganizations.getStore().remove(selectedRecords);
         this.selectedOrganizations.getStore().add(selectedRecords);
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
            String.format(applicationResources.getProperty('general.tooFewItemsSelected'), 1));
      }
   },


   /**
    * This method handles the Remove Organization button click event. It moves the highlighted organizations from
    * the Selected Organizations list to the Available Organizations list.
    *
    * @param aButton (Ext.Button) A reference to the Remove Organization button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onRemoveOrganizationButtonClicked: function(aButton, aEventObject)
   {
      if (this.selectedOrganizations.getSelectionModel().hasSelection())
      {
         var selectedRecords = this.selectedOrganizations.getSelectionModel().getSelections();
         this.selectedOrganizations.getStore().remove(selectedRecords);
         this.availableOrganizations.getStore().add(selectedRecords);
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
            String.format(applicationResources.getProperty('general.tooFewItemsSelected'), 1));
      }
   },


   /**
    * This method handles the Save button click event. It saves the announcement and closes the editor.
    *
    * @param aButton (Ext.Button) The Save button.
    * @param aEventObject (Ext.EventObject) The button click event.
    */
   onSaveButtonClicked: function(aButton, aEventObject)
   {
      var params = {
      };

      // Add each of the selected organization IDs to the parameters.
      this.selectedOrganizations.getStore().each(function(aRecord){
         if (!Ext.isDefined(this.selectedOrganizationIds))
         {
            this.selectedOrganizationIds = [];
         }
         this.selectedOrganizationIds.push(aRecord.data.organizationId);
      }, params);


      this.formPanel.getForm().submit({
         url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/saveAnnouncement.do',
         params: params,
         success: function(){
            this.fireEvent('saved');
            this.close();
         },
         scope: this
      });
   },


   /**
    * This method handles the Cancel button click event. It closes the Announcement editor.
    *
    * @param aButton (Ext.Button) Cancel button.
    * @param aEventObject (Ext.EventObject) The button click event.
    */
   onCancelButtonClicked: function(aButton, aEventObject)
   {
      this.fireEvent('cancelled');
      this.close();
   }

});


//======================================================================================================================
/**
 * This component provides the functionality to display all announcements in a grid. And it allows announcements to be
 * created, deleted and modified.
 */
Adf.ManageAnnouncementsGridPanel = Ext.extend(Ext.grid.GridPanel, {


   /**
    * Constructor.
    *
    * @param aConfig A component configuration object.
    */
   constructor: function (aConfig) {

      var defaultAdminUtil = new Adf.AdminScreenUtils();
      defaultAdminUtil.init(this, this);


      //      Create configuration for this Grid.
      var store = new Ext.data.JsonStore({
         autoDestroy: true,

         proxy: new Ext.data.HttpProxy({
            url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchAnnouncements.do',
            listeners: {
               scope: this,
               beforeload : function(aDataProxy, aParams){
                  Ext.applyIf (aParams, {
                     start: 0,
                     limit: UserPreference.itemsPerPage
                  });
               }
            }
         }),

         root: 'announcements',
         totalProperty: 'totalCount',

         idProperty: 'announcementId',

         fields: [
            {name: 'announcementId', mapping: 'announcementId', type: 'int'},
            {name: 'isActive', mapping: 'isActive'},
            {name: 'subject', mapping: 'subject'},
            {name: 'textMessage', mapping: 'textMessage'}
         ],

         remoteSort: true,
         sortInfo: {
            field: 'announcementId',
            dir: 'ASC'
         }
      });


      var colModel = new Ext.grid.ColumnModel({
         defaults: {
            width: 120,
            sortable: true
         },
         columns: [{
            id: 'announcementId',
            header: applicationResources.getProperty('admin.manage.header.id'),
            width: 50,
            sortable: true,
            dataIndex: 'announcementId'
         }, {
            id: 'isActive',
            header: applicationResources.getProperty('admin.announcements.active'),
            width: 100,
            sortable: true,
            dataIndex: 'isActive',
            renderer: function(aValue, aMetaData, aRecord, aRowIndex, aColIndex, aStore)
            {
               if (aValue)
               {
                  return applicationResources.getProperty('button.Yes')
               }
               else
               {
                  return applicationResources.getProperty('button.No')
               }
            }
         }, {
            id: 'subject',
            header: applicationResources.getProperty('admin.announcements.subject'),
            width: 200,
            sortable: true,
            dataIndex: 'subject'
         }, {
            id: 'textMessage',
            header: applicationResources.getProperty('admin.announcements.message'),
            width: 300,
            sortable: true,
            dataIndex: 'textMessage'
         }]
      });



      aConfig = Ext.apply({
         store: store,
         colModel: colModel,

         border: false,
         enableHdMenu: false,
         enableColumnMove: false,
         enableDragDrop: false,
         loadMask: true,
         stripeRows: true,
         tbar: new Ext.Toolbar({}),
         autoExpandColumn: 'textMessage',
         bbar: new Ext.PagingToolbar({
            store: store,
            displayInfo: true,
            pageSize: UserPreference.itemsPerPage
         })

      }, aConfig, {
         adminUtil: defaultAdminUtil,
         ADD_BUTTON_ID: Ext.id(),
         EDIT_BUTTON_ID: Ext.id(),
         DELETE_BUTTON_ID: Ext.id(),
         ENABLE_BUTTON_ID: Ext.id(),
         DISABLE_BUTTON_ID: Ext.id()
      });

      Adf.ManageAnnouncementsGridPanel.superclass.constructor.call(this, aConfig);

      // Post-processing.

      // Set the double click on the grid to allow an alternate way to edit an announcement.
      this.on('dblclick', this.onGridDblClick, this);


      // Set up the toolbar. Note: The toolbar is set up here because it uses the AdminUtil utilities to build
      // the toolbar and is only available after the grid panel has been created.
      this.getTopToolbar().addButton([
         this.adminUtil.createToolbarButton(this.ADD_BUTTON_ID, "report_add.png", this.onAddButtonClicked, applicationResources.getProperty("button.add")),
         {xtype: 'tbseparator'},
         this.adminUtil.createToolbarButton(this.EDIT_BUTTON_ID, "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")),
         {xtype: 'tbseparator'},
         this.adminUtil.createToolbarButton(this.DELETE_BUTTON_ID, "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")),
         {xtype: 'tbseparator'},
         this.adminUtil.createToolbarButton(this.ENABLE_BUTTON_ID, "report_delete.png", this.onEnableButtonClicked, applicationResources.getProperty("button.enable")),
         {xtype: 'tbseparator'},
         this.adminUtil.createToolbarButton(this.DISABLE_BUTTON_ID, "report_delete.png", this.onDisableButtonClicked, applicationResources.getProperty("button.disable")),
         {xtype: 'tbseparator'}
      ]);


   },


   /**
    * returns the params used by the ajax call (based on URL params)
    */
   getFetchParams: function()
   {
      return {};
   },


   /**
    * This method handles the Add button click event. It displays the dialog to add a new announcement.
    *
    * @param aButton (Ext.Button) A reference to the Add button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onAddButtonClicked: function(aButton, aEventObject)
   {
      this.showAnnouncementDetailsDialog();
   },


   /**
    * This method handles the double click event from the grid. It will get the first selected announcement
    * and display it in the announcement details dialog for editing.
    *
    * @param aEventObject (Ext.EventObject) Double click event.
    */
   onGridDblClick: function(aEventObject)
   {
      if (this.getSelectionModel().hasSelection())
      {
         var selectedRecords = this.getSelectionModel().getSelections();
         this.showAnnouncementDetailsDialog(selectedRecords[0].data.announcementId);
      }
   },


   /**
    * This method handles the Edit button click event. It will get the first selected announcement
    * and display it in the announcement details dialog for editing.
    *
    * @param aButton (Ext.Button) A reference to the Edit button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onEditButtonClicked: function(aButton, aEventObject)
   {
      if (this.getSelectionModel().hasSelection())
      {
         var selectedRecords = this.getSelectionModel().getSelections();
         this.showAnnouncementDetailsDialog(selectedRecords[0].data.announcementId);
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
                       applicationResources.getProperty("admin.announcements.selectOneAnnouncement"));
      }
   },


   /**
    * This method shows the Announcement Details dialog to a user to add or edit an announcement.
    *
    * @param aAnnouncementId An ID of the announcement to edit or null if a new announcements is being created.
    */
   showAnnouncementDetailsDialog: function(aAnnouncementId)
   {
      var editor = new Adf.ManageAnnouncementEditor({});
      editor.on('saved', this.refreshAnnouncementsGrid, this);
      editor.show(aAnnouncementId);
   },


   /**
    * This method refreshes the announcements grid with the latest data from the server.
    */
   refreshAnnouncementsGrid: function()
   {
      this.getStore().reload({
         params: this.getFetchParams(),
         scope:this
      });
   },


   /**
    * This method handles the Delete button click event. It removes the selected announcements from the
    * list of announcements.
    *
    * @param aButton (Ext.Button) A reference to the Delete button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onDeleteButtonClicked: function(aButton, aEventObject)
   {
      var selectedRecords = this.getSelectionModel().getSelections();
      if (!Ext.isEmpty(selectedRecords))
      {
         // Create a list of the selected announcements ID.
         var selectedIds = [];
         for (var i = 0; i < selectedRecords.length; i++)
         {
            selectedIds.push(selectedRecords[i].data.announcementId);
         }

         // Send a call to the server to deleted the selected announcements.
         RequestUtil.request({
            url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/deleteAnnouncements.do',
            params: {
               targetAnnouncementIds: selectedIds
            },
            success: function()
            {
               // Refresh grid.
               this.getStore().reload();

               Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
                             applicationResources.getProperty('admin.announcements.deleted'));
            },
            scope: this
         });
      }
   },


   /**
    * This method handles the Enable button click event. It enables the selected announcements in the
    * list of announcements.
    *
    * @param aButton (Ext.Button) A reference to the Enable button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onEnableButtonClicked: function(aButton, aEventObject)
   {
      var selectedRecords = this.getSelectionModel().getSelections();
      if (!Ext.isEmpty(selectedRecords))
      {
         // Create a list of the selected announcements ID.
         var selectedIds = [];
         for (var i = 0; i < selectedRecords.length; i++)
         {
            selectedIds.push(selectedRecords[i].data.announcementId);
         }

         RequestUtil.request({
            url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/enableAnnouncements.do',
            params: {
               targetAnnouncementIds: selectedIds
            },
            success: function()
            {
               // Refresh grid.
               this.getStore().reload();

               Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
                             applicationResources.getProperty('admin.announcements.enabled'));
            },
            scope: this
         });
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
                       String.format(applicationResources.getProperty('general.tooFewItemsSelected'), 1));
      }

   },


   /**
    * This method handles the Disable button click event. It disables the selected announcements in the
    * list of announcements.
    *
    * @param aButton (Ext.Button) A reference to the Disables button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onDisableButtonClicked: function(aButton, aEventObject)
   {
      var selectedRecords = this.getSelectionModel().getSelections();
      if (!Ext.isEmpty(selectedRecords))
      {
         // Create a list of the selected announcements ID.
         var selectedIds = [];
         for (var i = 0; i < selectedRecords.length; i++)
         {
            selectedIds.push(selectedRecords[i].data.announcementId);
         }

         RequestUtil.request({
            url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/disableAnnouncements.do',
            params: {
               targetAnnouncementIds: selectedIds
            },
            success: function()
            {
               // Refresh grid.
               this.getStore().reload();

               Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
                             applicationResources.getProperty('admin.announcements.disabled'));
            },
            scope: this
         });
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
                       String.format(applicationResources.getProperty('general.tooFewItemsSelected'), 1));
      }

   }
});




//======================================================================================================================
/**
 * This component is the main Manage Announcement integration point into the ADF Administration screens.
 */
Adf.ManageAnnouncementsUi = {

   /**
    * This method initializes the utilities used by this component.
    */
   init : function()
   {
      this.adminUtil = new Adf.AdminScreenUtils();
      this.adminUtil.setScope(this);
   },


   /**
    * This property sets a reference to the ADF Administration screens.
    *
    * @param aPanel (Ext.Panel) Administration panel.
    */
   setAdminPanel: function(aPanel)
   {
      this.adminPanel = aPanel;
   },


   /**
    * This method creates and returns the grid panel which lists all of the announcements in the ADF.
    *
    * @param aGridConfig (Object) A configuration for the grid which lists all the announcements.
    *
    * @return (Adf.ManageAnnouncementsGridPanel) A grid panel listing all announcements defined in the ADF.
    */
   getAdminGrid: function(aGridConfig)
   {
      aGridConfig = Ext.apply({
         region:'center',
         title: applicationResources.getProperty('navMenu.manage.announcements')
      }, aGridConfig);

      // create the Layout (including the data grid)
      this.contentsGrid = new Adf.ManageAnnouncementsGridPanel(aGridConfig);

      this.gridId = this.contentsGrid.id;
      this.adminUtil.init(this, this.contentsGrid);

      return this.contentsGrid;
   }

};


