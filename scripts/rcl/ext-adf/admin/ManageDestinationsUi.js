/**
 * Ext grid definition and form def for manageDestinations action
 *
 * @author sallman@motio.com
 * @since 3/8/11
 */


Adf.manageDestinationsUi = function()
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
         this.init();
         this.gridId = aGridId;

         this.workspaceToolbar = new Ext.Toolbar({
            items : [this.adminUtil.createToolbarButton(Ext.id(), "report_add.png", this.onAddEmailButtonClicked, applicationResources.getProperty('admin.destinations.add.email')), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "report_add.png", this.onAddFtpButtonClicked, applicationResources.getProperty('admin.destinations.add.ftp')), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "report_add.png", this.onAddFsButtonClicked, applicationResources.getProperty('admin.destinations.add.file.system')), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "cancel.png", this.onCloseButtonClicked, applicationResources.getProperty('button.close')), '-'
            ]
         });


         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)

         this.dataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchDeliveryDestinations.do',
               listeners: {
                  scope: this,
                  beforeload: function(aDataProxy, aParams)
                  {
                     Ext.apply(aParams, this.getFetchParams());
                  }
               }
            }),
            // create reader that reads the RER records
            reader: new Ext.data.JsonReader({
               root: 'data',
               totalProperty: 'totalCount',
               id: 'destinationId'
            }, [
               {name: 'destinationId', mapping: 'destinationId', type: 'int'},
               {name: 'destinationName', mapping: 'destinationName'},
               {name: 'destinationType', mapping: 'destinationType'},
               {name: 'deliveryMethod', mapping: 'deliveryMethod'}
            ]),
            remoteSort: false
         });

         this.dataStore.setDefaultSort('destinationName', 'ASC');

         //--- custom render function for type field...
         var renderIconFn = function (aValue, aCellMetaData, aRecord)
         {
            var html = '<img alt="icon" src="' + ServerEnvironment.baseUrl + '/images/silkIcons/report.png"/>';
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

            { id: 'destinationId',
               header: applicationResources.getProperty('admin.manage.header.id'),
               dataIndex: 'destinationId',
               width: 50,
               sortable:true,
               css: 'white-space:normal;text-align:right;' },
            { id: 'destinationName',
               header: applicationResources.getProperty('admin.manage.header.destinationName'),
               dataIndex: 'destinationName',
               width: 250,
               sortable:true
            },
            { id: 'destinationType',
               header: applicationResources.getProperty('admin.manage.header.destinationType'),
               dataIndex: 'destinationType',
               width: 200,
               sortable:true
            }
         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            id: this.gridId,
            region:'center',
            title: applicationResources.getProperty('button.admin.manage.editDestinations'),
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.dataStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            autoExpandColumn: 'destinationName'
         });

         this.adminUtil.init(this, this.contentsGrid);
//         this.adminUtil.refreshContentsGrid = this.refreshContentsGrid.createDelegate(this);
         return this.contentsGrid;
      },

      setOrganizationId: function(aOrgId)
      {
         this.organizationId = aOrgId;
         this.dataStore.load({
            params: this.getFetchParams(),
            scope: this});
      },

      /**
       * returns the params used by the ajax call (based on URL params)
       */
      getFetchParams: function()
      {
         return {
            organizationId: this.organizationId
         };
      },


      /**
       * refreshes the RER grid
       */
      refreshContentsGrid: function()
      {
         Adf.manageDestinationsUi.adminUtil.refreshContentsGrid(this.getFetchParams());
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
         this.adminUtil.deleteContentNodes.call(this.adminUtil,
               this.contentsGrid,
               ServerEnvironment.baseUrl + "/secure/actions/admin/ext/deleteDeliveryDestination.do",
               "targetDestinationIds",
               "organizationId=" + this.organizationId);
      },

      onAddEmailButtonClicked: function(aButton)
      {
         this.isEmailForm = true;
         this.adminPanel.layout.setActiveItem("editEmailForm");
         this.loadFormData(this.editEmailForm, false, ServerEnvironment.baseUrl + "/secure/actions/admin/ext/addEmailDeliveryDestination.do");
         this.editEmailForm.getForm().findField('operation').setValue("add");
      },

      onAddFtpButtonClicked: function(aButton)
      {
         this.isEmailForm = false;
         this.adminPanel.layout.setActiveItem("editFtpForm");
         this.loadFormData(this.editFtpForm, false, ServerEnvironment.baseUrl + "/secure/actions/admin/ext/addFtpDeliveryDestination.do");
         this.editFtpForm.getForm().findField('operation').setValue("add");
      },

      onAddFsButtonClicked: function(aButton)
      {
         this.isEmailForm = false;
         this.adminPanel.layout.setActiveItem("editFsForm");
         this.loadFormData(this.editFsForm, false, ServerEnvironment.baseUrl + "/secure/actions/admin/ext/addFsDeliveryDestination.do");
         this.editFsForm.getForm().findField('operation').setValue("add");
      },

      onEditButtonClicked: function(aButton)
      {
         var selected = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1, null);

         if("email" == selected[0].data['deliveryMethod'])
         {
            this.isEmailForm = true;
            this.adminPanel.layout.setActiveItem("editEmailForm");
            this.loadFormData(this.editEmailForm, true, ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editEmailDeliveryDestination.do");
            this.editEmailForm.getForm().findField('operation').setValue("edit");
         }
         else if("ftp" == selected[0].data['deliveryMethod'])
         {
            this.isEmailForm = false;
            this.adminPanel.layout.setActiveItem("editFtpForm");
            this.loadFormData(this.editFtpForm, true, ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editFtpDeliveryDestination.do");
            this.editFtpForm.getForm().findField('operation').setValue("edit");
         }
         else
         {
            this.isEmailForm = false;
            this.adminPanel.layout.setActiveItem("editFsForm");
            this.loadFormData(this.editFsForm, true, ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editFsDeliveryDestination.do");
            this.editFsForm.getForm().findField('operation').setValue("edit");
         }
      },

      loadFormData: function(aFormPanel, aEditData, aUrl)
      {
         if (!aEditData)
         {
            aFormPanel.getForm().load({
               url: aUrl,
               scope: this,
               params: this.getFetchParams(),
               success: this.loadDomains
            });
         }
         else
         {
            var selected = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1, null);

            if (selected.length != 1)
            {
               alert(applicationResources.getProperty("folderContents.errMsg.selectItem"));
               return;
            }
            else
            {
               var aNodeId = selected[0].id;

               aFormPanel.getForm().load({
                  url: aUrl,
                  scope: this,
                  params: {
                     destinationId: aNodeId,
                     organizationId: this.organizationId
                  },
                  success: this.loadDomains
               });
            }
         }
      },

      loadDomains: function(aForm, aAction)
      {
         if(this.isEmailForm)
         {
            this.domainStore.loadData(aAction.result.data);
         }
      },

      onAddEmailDomainButton: function(aButton)
      {
         var newRecord = new this.domainStore.recordType({
             domainName: ''
         });
         this.domainEditor.stopEditing();
         this.domainStore.insert(0, newRecord);
         this.domainEditor.startEditing(0);
      },

      onRemoveEmailDomainButton: function(aButton)
      {
         var rec = this.domainGrid.getSelectionModel().getSelected();
         if (!rec)
         {
            return false;
         }
         this.domainStore.remove(rec);
      },

      /**
       * email destination form
       * @param aTitle window title
       * @param loadData boolean (edit or add)
       */
      getEditEmailForm: function()
      {
         var domainToolbar = new Ext.Toolbar({
            items : [
               this.adminUtil.createToolbarButton(Ext.id(), "report_add.png", this.onAddEmailDomainButton, applicationResources.getProperty('button.add')), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "report_delete.png", this.onRemoveEmailDomainButton, applicationResources.getProperty('button.remove')), '-'
            ]
         });

         this.domainEditor = new Ext.ux.grid.RowEditor({
            saveText: applicationResources.getProperty('button.add'),
            cancelText: applicationResources.getProperty('button.Cancel')
         });
         this.domainStore = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
               root: 'validDomains',
               id: 'domainName'
            }, [
               {name: 'domainName', mapping: 'domainName'}
            ]),
            remoteSort: false
         });

         var domainCm = new Ext.grid.ColumnModel([
            { id: 'domainName',
               header: applicationResources.getProperty('admin.manage.header.domainName'),
               dataIndex: 'domainName',
               width: 200,
               sortable:'true',
               editor: new Ext.form.TextField()}
         ]);

         this.domainGrid = new Ext.grid.GridPanel({
            fieldLabel: applicationResources.getProperty('admin.destinations.email.domains'),
            border:true,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.domainStore,
            cm: domainCm,
            stripeRows: true,
            height:130,
            plugins:[this.domainEditor],
            tbar: domainToolbar,
            autoExpandColumn: 'domainName'
         });

         var formItems = this.getCommonFields();
         formItems.push({
            xtype: 'compositefield',
            fieldLabel: applicationResources.getProperty('admin.destinations.hostName'),
            items:[
               {
                  xtype:'textfield',
                  name:'emailHost'
               },
               {
                  xtype:'label',
                  id:'portLabel',
                  text: applicationResources.getProperty('admin.destinations.port')
               },
               {
                  xtype:'textfield',
                  name: 'port',
                  width: 70
               }
            ]
         });
         formItems.push({
            xtype: 'checkbox',
            name: 'ssl',
            fieldLabel: applicationResources.getProperty('admin.destinations.ssl')
         });
         formItems.push({
            name: 'emailUserId',
            fieldLabel: applicationResources.getProperty('admin.destinations.userName')
         });
         formItems.push({
            name: 'emailPassword',
            inputType: 'password',
            fieldLabel: applicationResources.getProperty('admin.destinations.password')
         });
         formItems.push({
            name: 'validateEmailPassword',
            fieldLabel: applicationResources.getProperty('admin.destinations.verify.password'),
            inputType: 'password'
         });
         formItems.push({
            name: 'emailFrom',
            fieldLabel: applicationResources.getProperty('admin.destinations.emailFrom')
         });
         formItems.push(this.domainGrid);
         formItems.push(this.getPermissionsButton("email"));
         this.editEmailForm = new Adf.AdfFormPanel({
            labelWidth: 120, // label settings here cascade unless overridden
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveEmailDeliveryDestination.do",
            frame:true,
            title: applicationResources.getProperty('admin.destinations.edit.email'),
            bodyStyle:'padding:5px 5px 0',
            width: 550,
            defaults: {anchor: '100%'},
            defaultType: 'textfield',
            items: formItems,
            buttons: [
               {
                  scope:this,
                  text: applicationResources.getProperty('button.Save'),
                  handler:function()
                  {
                     var domains = [];

                     //serialize email domains
                     this.domainStore.each(function(aRec){
                        domains.push("selectedValidDomains=" + escape(aRec.data['domainName']) + "&");
                     }, this);
                     var url = ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveEmailDeliveryDestination.do";
                     if(domains.length > 0)
                     {
                        url += "?" + domains.join("");
                     }

                     this.editEmailForm.getForm().submit({
                        scope:this,
                        url: url,
                        waitMsg: applicationResources.getProperty('profileWizard.saving'),
                        success: function()
                        {
                           this.contentsGrid.store.reload({scope:this});
                           this.adminPanel.layout.setActiveItem(this.gridId);
                        }
                     });
                  }
               },
               {
                  scope:this,
                  text: applicationResources.getProperty('button.Cancel'),
                  handler:function()
                  {
                     this.adminPanel.layout.setActiveItem(this.gridId);
                  }
               }
            ]
         });

         return new Ext.Panel({
            id: 'editEmailForm',
            hideLabels: true,
            hideBorders: true,
            items:[this.editEmailForm]
         });

      },

      getPermissionsButton: function(aType)
      {
         return {
            xtype:'button',
            title: 'Permissions',
            text:'Choose Roles with Permissions for this Object',
            fieldLabel: 'Permissions',
            scope: this,
            handler:function()
            {
               var form = this.editFsForm;
               if(aType == "email")
               {
                  form = this.editEmailForm;
               }
               else if(aType = "ftp")
               {
                  form = this.editFtpForm;
               }

               var vals = form.getForm().getValues();
               var itemId = vals['permissionsForm.itemId'];
               var namespace = vals['permissionsForm.namespace'];
               var nodeType = vals['permissionsForm.itemType'];
               var canInherit = vals['permissionsForm.canInheritPermissions'];
               var isInherit = vals['permissionsForm.inheritPermissions'];
               var permittedListStr = vals['permissionsForm.permittedListString'];

               Adf.permissionsDialog.init(
                     'Edit Destination Permissions',
                     itemId,
                     namespace,
                     nodeType,
                     canInherit,
                     isInherit
                     );

               Adf.permissionsDialog.showEditWindow(this, isInherit, canInherit, permittedListStr,
                     function(aIsInherit, aPermissionsString)
                     {
                        form.getForm().findField('permissionsForm.inheritPermissions').setValue(aIsInherit);
                        form.getForm().findField('permissionsForm.permittedListString').setValue(aPermissionsString);
                     });
            }
         };
      },

      getEditFtpForm: function()
      {

         var formItems = this.getCommonFields();
         formItems.push({
            xtype: 'compositefield',
            fieldLabel: applicationResources.getProperty('admin.destinations.hostName'),
            items:[
               {
                  xtype:'textfield',
                  name:'ftpHost'
               },
               {
                  xtype:'label',
                  id:'portLabel',
                  text: applicationResources.getProperty('admin.destinations.port')
               },
               {
                  xtype:'textfield',
                  name: 'ftpPort',
                  width: 70
               }
            ]
         });
         formItems.push({
            name: 'ftpUserId',
            fieldLabel: applicationResources.getProperty('admin.destinations.userName')
         });
         formItems.push({
            name: 'ftpPassword',
            inputType: 'password',
            fieldLabel: applicationResources.getProperty('admin.destinations.password')
         });
         formItems.push({
            name: 'validateFtpPassword',
            fieldLabel: applicationResources.getProperty('admin.destinations.verify.password'),
            inputType: 'password'
         });
         formItems.push({
            name: 'ftpPath',
            fieldLabel: applicationResources.getProperty('admin.destinations.directoryPath')
         });
         formItems.push(this.getPermissionsButton("ftp"));

         this.editFtpForm = new Adf.AdfFormPanel({
            labelWidth: 120, // label settings here cascade unless overridden
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveFtpDeliveryDestination.do",
            frame:true,
            title: applicationResources.getProperty('admin.destinations.edit.ftp'),
            bodyStyle:'padding:5px 5px 0',
            width: 550,
            defaults: {anchor: '100%'},
            defaultType: 'textfield',
            items: formItems,
            buttons: [
               {
                  scope:this,
                  text: applicationResources.getProperty('button.Save'),
                  handler:function()
                  {
                     this.editFtpForm.getForm().submit({
                        scope:this,
                        url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveFtpDeliveryDestination.do",
                        waitMsg: applicationResources.getProperty('profileWizard.saving'),
                        success: function()
                        {
                           this.contentsGrid.store.reload({scope:this});
                           this.adminPanel.layout.setActiveItem(this.gridId);
                        }
                     });
                  }
               },
               {
                  scope: this,
                  text: applicationResources.getProperty('button.Cancel'),
                  handler:function()
                  {
                     this.adminPanel.layout.setActiveItem(this.gridId);
                  }
               }
            ]
         });

         return new Ext.Panel({
            id: 'editFtpForm',
            hideLabels: true,
            hideBorders: true,
            items:[this.editFtpForm]
         });
      },


      getEditFsForm: function()
      {

         var formItems = this.getCommonFields();
         formItems.push({
            name: 'localPath',
            fieldLabel: applicationResources.getProperty('admin.destinations.directoryPath')
         });
         formItems.push(this.getPermissionsButton("fs"));
         this.editFsForm = new Adf.AdfFormPanel({
            labelWidth: 120, // label settings here cascade unless overridden
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveFsDeliveryDestination.do",
            frame:true,
            title: applicationResources.getProperty('admin.destinations.edit.file.system'),
            bodyStyle:'padding:5px 5px 0',
            width: 550,
            defaults: {anchor: '100%'},
            defaultType: 'textfield',
            items: formItems,
            buttons: [
               {
                  scope:this,
                  text: applicationResources.getProperty('button.Save'),
                  handler:function()
                  {
                     this.editFsForm.getForm().submit({
                        scope:this,
                        url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveFsDeliveryDestination.do",
                        waitMsg: applicationResources.getProperty('profileWizard.saving'),
                        success: function()
                        {
                           this.contentsGrid.store.reload({scope:this});
                           this.adminPanel.layout.setActiveItem(this.gridId);
                        }
                     });
                  }
               },
               {
                  scope: this,
                  text: applicationResources.getProperty('button.Cancel'),
                  handler:function()
                  {
                     this.adminPanel.layout.setActiveItem(this.gridId);
                  }
               }
            ]
         });

         return new Ext.Panel({
            id: 'editFsForm',
            hideLabels: true,
            hideBorders: true,
            items:[this.editFsForm]
         });
      },


      getCommonFields: function()
      {
         return [
               {
                  xtype:'hidden',
                  name:'operation'
               },
               {
                  xtype:'hidden',
                  name:'organizationId',
                  value: this.organizationId
               },
               {
                  xtype:'hidden',
                  name:'organizationName',
                  value: this.organizationName
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
                  xtype:'hidden',
                  name:'destinationId'
               },
               {
                  xtype: 'hidden',
                  name: 'destinationType'
               },
               {
                  xtype: 'hidden',
                  name: 'deliveryMethod'
               },
               {
                  xtype: 'textfield',
                  name: 'destinationName',
                  fieldLabel: applicationResources.getProperty('admin.destinations.name')
               },
               {
                  xtype: 'textfield',
                  name: 'destinationDescription',
                  fieldLabel: applicationResources.getProperty('admin.destinations.description')
               }
            ];
      },

      onCloseButtonClicked: function(aButton, aEventObject)
      {
         this.adminPanel.layout.setActiveItem(Adf.manageOrganizationsUi.gridId);
      }
   };
}();

var workspaceUi = Adf.manageDestinationsUi;
