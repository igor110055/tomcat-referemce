/**
 * Ext grid definition and form def for manageFolders action
 *
 * @author sallman@motio.com
 * @since 1/27/11
 */


Adf.manageCapabilitiesUi = function()
{
   ////////////////////////////////////////////////////////////////////////////
   // Private
   ////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////
   // Public
   ////////////////////////////////////////////////////////////////////////////
   return {
      init : function()
      {
         this.adminUtil = new Adf.AdminScreenUtils();
         this.adminUtil.setScope(this);
      },

      setAdminPanel: function(aPanel)
      {
         this.adminPanel = aPanel;
      },

      getAdminGrid: function(aGridId)
      {
         this.gridId = aGridId;

         this.workspaceToolbar = new Ext.Toolbar({
            scope: this,
            //manage users only currently supports delete
            items : [this.adminUtil.createToolbarButton("AddCapability", "user_add.png", this.onAddButtonClicked, applicationResources.getProperty("button.add")), '-',
               this.adminUtil.createToolbarButton("EditCapability", "user_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton("DeleteCapability", "user_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-'
            ]
         });


         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)

         this.dataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchCapabilities.do',
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
            // create reader that reads the RER records
            reader: new Ext.data.JsonReader({
               root: 'data',
               totalProperty: 'totalCount',
               id: 'capabilityId'
            }, [
               {name: 'capabilityId', mapping: 'capabilityId', type: 'int'},
               {name: 'capabilityName', mapping: 'capabilityName'},
               {name: 'parentCapabilityPath', mapping: 'parentCapabilityPath'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'capabilityName',
               dir: 'ASC'
            }
         });


         //--- custom render function for type field...
         var renderIconFn = function (aValue, aCellMetaData, aRecord)
         {
            var html = '<img alt="icon" src="' + ServerEnvironment.baseUrl + '/images/silkIcons/user.png"/>';
            return html;
         };


         //--- custom render function for type field...
         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store
         var cm = new Ext.grid.ColumnModel([
            { id: 'type',
               header: '',
               width: 30,
               renderer: renderIconFn },

            { id: 'capabilityId',
               header: 'ID',
               dataIndex: 'capabilityId',
               width: 50,
               sortable:true,
               css: 'white-space:normal;text-align:right;' },


            { id: 'capabilityName',
               header: 'Capability Name',
               dataIndex: 'capabilityName',
               width: 200,
               sortable:true,
               css: 'white-space:normal;'},

            { id: 'parentCapabilityPath',
               header: 'Parent Capability Path',
               dataIndex: 'parentCapabilityPath',
               width: 300,
               sortable:true,
               css: 'white-space:normal;'}
         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            id: aGridId,
            region:'center',
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.dataStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            autoExpandColumn: 'capabilityName',
            bbar: new Ext.PagingToolbar({
               store: this.dataStore,
               displayInfo: true,
               pageSize: UserPreference.itemsPerPage
            })
         });

         this.adminUtil.init(this, this.contentsGrid);


         return this.contentsGrid;
      },

      getEditForm: function()
      {
         this.INHERITED_PANEL_ID = Ext.id();
         this.SELECTED_PANEL_ID = Ext.id();

         this.inheritedPermissions = new Ext.form.Checkbox({
            boxLabel: 'Inherit Permissions From Parent',
            width: 410,
            checked: true,

            /**
             * This method prevents the user from removing the check mark.
             * @param aCheckbox (Ext.form.Checkbox) This check box.
             * @param aChecked (Boolean) Current value of the check box.
             */
            handler: function(aCheckbox, aChecked)
            {
               if (!aChecked)
               {
                  // Suspending events to prevent endless looping.
                  aCheckbox.suspendEvents(false);
                  aCheckbox.setValue(true);
                  aCheckbox.resumeEvents();
               }
            }
         });


         this.selectedPermissions = new Ext.grid.GridPanel({
            id: this.SELECTED_PANEL_ID,
            height: 100,
            width: 383,

            // A workaround to put a border around the grid which disappears when the grid is contained within a
            // container that has the frame property set to true.
            bodyStyle: 'border: 1px solid; border-color: #99bbe8;',

            border: true,

            margins: {
               top: 10,
               right: 0,
               bottom: 0,
               left: 0
            },

            store: new Ext.data.JsonStore({
               root: 'roles',
               fields: ['name']
            }),

            colModel: new Ext.grid.ColumnModel({
               columns: [{
                  header: 'Selected Permissions',
                  dataIndex: 'name'
               }]
            }),

            viewConfig: {
               forceFit: true
            }
         });

         this.permissionsDetails = new Ext.Panel({
            layout: 'card',
            padding: '10px 0px 0px 0px',
            width: 383,
            activeItem: 0,
            items: [{
               id: this.INHERITED_PANEL_ID,
               xtype: 'panel',
               layout: 'form',
               hideLabels: true,
               items: [this.inheritedPermissions]
            },
               this.selectedPermissions
            ]
         });


         this.currentPermissionsPanel = new Ext.Panel({
            height: 140,
            width: 383,
            fieldLabel: 'Permissions',

            items: [{
               xtype: 'button',
               width: 383,
               text: 'Choose Roles with Permissions for this Object',
               scope: this,
               handler:function()
               {
                  var vals = this.editItemForm.getForm().getValues();
                  var itemId = vals['permissionsForm.itemId'];
                  var namespace = vals['permissionsForm.namespace'];
                  var nodeType = vals['permissionsForm.itemType'];
                  var canInherit = vals['permissionsForm.canInheritPermissions'];
                  var isInherit = vals['permissionsForm.inheritPermissions'];
                  var permittedListStr = vals['permissionsForm.permittedListString'];

                  Adf.permissionsDialog.init(
                     'Edit Report Permissions',
                     itemId,
                     namespace,
                     nodeType,
                     canInherit,
                     isInherit
                  );

                  Adf.permissionsDialog.showEditWindow(this, isInherit, canInherit, permittedListStr,
                     function(aIsInherit, aPermissionsString)
                     {
                        this.editItemForm.getForm().findField('permissionsForm.inheritPermissions').setValue(aIsInherit);
                        this.editItemForm.getForm().findField('permissionsForm.permittedListString').setValue(aPermissionsString);
//                        Adf.manageReportsUi.editItemForm.getForm().findField('permissionsForm.inheritPermissions').setValue(aIsInherit);
//                        Adf.manageReportsUi.editItemForm.getForm().findField('permissionsForm.permittedListString').setValue(aPermissionsString);
                        Adf.manageCapabilitiesUi.updatePermissions();
                     });

               }
            }, this.permissionsDetails]

         });

         this.editItemForm = new Adf.AdfFormPanel({
            labelWidth: 120, // label settings here cascade unless overridden
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveCapability.do",
            frame:true,
            title: "Capabilities",
            bodyStyle:'padding:5px 5px 0',
            width: 530,
            defaults: {anchor: '100%'},
            defaultType: 'textfield',
            items: [
               {
                  xtype: 'hidden',
                  name: 'operation'
               },
               {
                  xtype:'hidden',
                  name:'capabilityId'
               },
               {
                  xtype:'hidden',
                  name:'permissionsForm.itemId'
               },
               {
                  xtype:'hidden',
                  name:'permissionsForm.itemType'
               },
               {
                  xtype:'hidden',
                  name:'permissionsForm.namespace'
               },
               {
                  xtype:'hidden',
                  name:'permissionsForm.canInheritPermissions'
               },
               {
                  xtype:'hidden',
                  name:'permissionsForm.inheritPermissions'
               },
               {
                  xtype:'hidden',
                  name:'permissionsForm.permittedListString'
               },
               {
                  fieldLabel: 'Capability Name',
                  name: 'capabilityName',
                  allowBlank:false
               },
               {
                  fieldLabel: 'Parent Capability Path',
                  name: 'parentCapabilityPath',
                  allowBlank:false,
                  value: 'root'
               },
               this.currentPermissionsPanel

            ],

            buttons: [
               {
                  scope: this,
                  text: 'Save',
                  handler:function()
                  {
                     this.editItemForm.getForm().submit({
                        scope: this,
                        url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveCapability.do",
                        waitMsg:'Saving...',
                        success: function()
                        {
                           Adf.manageCapabilitiesUi.refreshContentsGrid();
                           this.adminPanel.layout.setActiveItem(this.gridId);
                        }
                     });
                  }
               },
               {
                  scope:this,
                  text: 'Cancel',
                  handler:function()
                  {
                     this.adminPanel.layout.setActiveItem(this.gridId);
                  }
               }
            ]
         });

         return new Ext.Panel({
            id: 'editCapabilityForm',
            hideLabels: true,
            hideBorders: true,
            items:[this.editItemForm]
         });
      },

      /**
       * returns the params used by the ajax call (based on URL params)
       */
      getFetchParams: function()
      {
         return {};
      },


      /**
       * refreshes the RER grid
       */
      refreshContentsGrid: function()
      {
         Adf.manageCapabilitiesUi.adminUtil.refreshContentsGrid(this.getFetchParams());
      },


      /**
       * the refresh button was clicked
       */
      onRefreshButtonClicked: function (aButton)
      {
         this.refreshContentsGrid();
      },


      /**
       * the delete button was clicked
       */
      onDeleteButtonClicked: function (aButton)
      {
         this.adminUtil.deleteContentNodes.call( this.adminUtil,
               this.contentsGrid,
               ServerEnvironment.baseUrl + "/secure/actions/admin/ext/deleteCapability.do",
               "targetCapabilityId");
      },

      onAddButtonClicked: function(aButton)
      {
         this.showEditWindow('Add New Capability', false);
      },

      onEditButtonClicked: function(aButton)
      {
         this.showEditWindow('Edit Capability', true);
      },

      showEditWindow: function(aTitle, loadData)
      {
         var operation = "edit";
         if(!loadData)
         {
            operation = "add";
         }

         this.loadFormData(this.editItemForm, loadData);
         this.editItemForm.getForm().findField('operation').setValue(operation);
         this.adminPanel.layout.setActiveItem('editCapabilityForm');
      },

      loadFormData: function(aFormPanel, aEditData)
      {
         if(!aEditData)
         {
            aFormPanel.getForm().load({
               url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/addCapability.do",
               failure: function(form, action)
               {
                  Ext.Msg.alert("Load failed", action.result['errorMessage']);
               },
               scope: this,
               success: this.updatePermissions
            });
         }
         else
         {
            var selected = this.adminUtil.getNodesForSelectedRows(this.adminUtil.contentGrid, 1, 1, null);

            if (selected.length != 1)
            {
               alert(applicationResources.getProperty("folderContents.errMsg.selectItem"));
               return;
            }
            else
            {
               var aNodeId = selected[0].id;

               aFormPanel.getForm().load({
                  url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editCapability.do",
                  params: {
                     capabilityId: aNodeId
                  },
                  scope: this,
                  success: this.updatePermissions
               });
            }
         }
      },

      /**
       * This function configures the permissions sections depending on the current permission values.
       */
      updatePermissions: function()
      {

         var vals = this.editItemForm.getForm().getValues();

         var itemId = vals['permissionsForm.itemId'];
         var namespace = vals['permissionsForm.namespace'];
         var nodeType = vals['permissionsForm.itemType'];
         var canInherit = vals['permissionsForm.canInheritPermissions'];
         var isInherit = vals['permissionsForm.inheritPermissions'];
         var permittedListStr = vals['permissionsForm.permittedListString'];

         if (isInherit == 'true')
         {
            // Clear the selected permission list and display the inherited permissions message.
            this.selectedPermissions.getStore().removeAll();
            this.permissionsDetails.getLayout().setActiveItem(0);
         }
         else
         {
            // Display the list of selected permissions.
            var permittedList = permittedListStr.split(',,');
            var data = {
               roles: [],
               fn: function(aItem, aIndex, aAllItems)
               {
                  this.roles.push({name: aItem});
               }
            };
            Ext.each(permittedList, data.fn, data);
            this.selectedPermissions.getStore().loadData(data);
            this.permissionsDetails.getLayout().setActiveItem(1);
         }
      }

   };
}();

var workspaceUi = Adf.manageCapabilitiesUi;
