
/**
 * Ext grid definition and form def for ManageCustomPrompts action
 *
 * @author sallman@motio.com
 * @since 1/27/11
 */


Adf.manageCustomPromptsUi = function()
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
         this.editCount = 0;
      },

      setAdminPanel: function(aPanel)
      {
         this.adminPanel = aPanel;
      },

      getAdminGrid: function(aGridId)
      {
         this.gridId = aGridId;

         this.workspaceToolbar = new Ext.Toolbar({
            //manage users only currently supports delete
            items : [this.adminUtil.createToolbarButton("AddCustomPrompt", "report_add.png", this.onAddButtonClicked, applicationResources.getProperty("button.add")), '-',
               this.adminUtil.createToolbarButton("EditCustomPrompt", "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton("DeleteCustomPrompt", "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-'
            ]
         });


         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)

         this.customPromptsStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchCustomPrompts.do',
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
               id: 'promptId'
            }, [
               {name: 'promptId', mapping: 'promptId', type: 'int'},
               {name: 'promptName', mapping: 'promptName'},
               {name: 'description', mapping: 'description'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'promptName',
               dir: 'ASC'
            }
         });


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

            { id: 'promptId',
               header: 'ID',
               dataIndex: 'promptId',
               sortable: true,
               width: 50,
               css: 'white-space:normal;text-align:right;' },


            { id: 'promptName',
               header: 'Prompt Name',
               dataIndex: 'promptName',
               sortable: true,
               width: 200,
               css: 'white-space:normal;',
               sortable:'true'},

            { id: 'description',
               header: 'Description',
               dataIndex: 'description',
               sortable: true,
               width: 300,
               css: 'white-space:normal;',
               sortable:'true'}
         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            title: 'Custom Report Prompts',
            id: this.gridId,
            region:'center',
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.customPromptsStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            autoExpandColumn: 'description',
            bbar: new Ext.PagingToolbar({
               store: this.customPromptsStore,
               displayInfo: true,
               pageSize: UserPreference.itemsPerPage
            })
         });

         this.adminUtil.init(this, this.contentsGrid);

         this.customPromptsStore.load({
            params: this.getFetchParams(),
            scope:this
         });

         return this.contentsGrid;
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
         Adf.manageCustomPromptsUi.adminUtil.refreshContentsGrid(this.getFetchParams());
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
               ServerEnvironment.baseUrl + "/secure/actions/admin/ext/deleteCustomPrompts.do",
               "targetCustomPromptIds");
      },

      onAddButtonClicked: function(aButton)
      {
         this.showEditWindow('Add New Custom Prompt', false);
      },

      onEditButtonClicked: function(aButton)
      {
         this.showEditWindow('Edit Custom Prompt', true);
      },

      getEditForm: function()
      {
         this.editItemForm = new Adf.AdfFormPanel({
             labelWidth: 120, // label settings here cascade unless overridden
             url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveCustomPrompt.do",
             frame:true,
             title: "Edit Report Prompt",
             bodyStyle:'padding:5px 5px 0',
             width: 530,
             defaults: {anchor: '100%'},
             defaultType: 'textfield',
             fileUpload: true,
             items: [
                {
                   xtype:'hidden',
                   name:'customPromptId'
                },
                {
                   xtype:'hidden',
                   name:'operation'
                },
                {
                   fieldLabel: 'Prompt Name',
                   name: 'customPromptName',
                   allowBlank:false
                },
                {
                   fieldLabel: 'Prompt Description',
                   name: 'customPromptDesc',
                   allowBlank:false
                },
                {
                   fieldLabel: 'Specify Prompt Details with XML',
                   xtype:'checkbox',
                   name: 'useXmlSpec',
                   scope: this,
                   handler:this.checkboxHandler
                },
                {
                   fieldLabel: 'XML Specification File',
                   xtype:'fileuploadfield',
                   id:'xmlSpec',
                   buttonText:'Browse...',
                   name: 'xmlSpec',
                   disabled:true
                },
                {
                   fieldLabel: 'Action Path',
                   name: 'customPromptActionPath',
                   allowBlank:true
                }
             ],

             buttons: [
                {
                   text: 'Save',
                   handler:function()
                   {
                      Adf.manageCustomPromptsUi.editItemForm.getForm().submit({
                         scope: Adf.manageCustomPromptsUi,
                         url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveCustomPrompt.do",
                         waitMsg:'Saving...',
                         success: function()
                         {
                            this.refreshContentsGrid();
                            this.adminPanel.layout.setActiveItem(this.gridId);
                         },
                         failure: function(form, action)
                         {
                            Ext.Msg.alert("Save failed", action.result['errorMessage']);
                         }
                      });
                   }
                },
                {
                   scope: this,
                   text: 'Cancel',
                   handler:function()
                   {
                      this.adminPanel.layout.setActiveItem(this.gridId);
                   }
                }
             ]
          });

         return new Ext.Panel({
            id: 'customPromptForm',
            hideLabels: true,
            hideBorders: true,
            items:[this.editItemForm]
         });
      },

      showEditWindow: function(aTitle, loadData)
      {
         var operation = "edit";
         if(!loadData)
         {
            operation = "add";
         }
         this.editCount++;
         if(this.editCount > 1)
         {
            this.editItemForm.getForm().reset();
         }

         if (loadData)
         {
            this.loadFormData(this.editItemForm);
         }

         this.editItemForm.getForm().findField('operation').setValue(operation);
         this.adminPanel.layout.setActiveItem('customPromptForm');
      },

      loadFormData: function(aFormPanel)
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
               url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editCustomPrompt.do",
               params: {
                  customPromptId: aNodeId
               },
               failure: function(form, action)
               {
                  Ext.Msg.alert("Load failed", action.result['errorMessage']);
               }
            });
         }
      },

      checkboxHandler: function(aCheckbox, aSelected)
      {
         if(aSelected)
         {
            this.editItemForm.getForm().findField('xmlSpec').enable();
            this.editItemForm.getForm().findField('customPromptActionPath').disable();
         }
         else
         {
            this.editItemForm.getForm().findField('xmlSpec').disable();
            this.editItemForm.getForm().findField('customPromptActionPath').enable();
         }
      }
   };
}();

var workspaceUi = Adf.manageCustomPromptsUi;
