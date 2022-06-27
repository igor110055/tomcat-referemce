/**
 * Ext grid definition and form def for ManageRerProcessorChainsAction action
 *
 * @author sallman@motio.com
 * @since 1/27/11
 */



Adf.manageProcessorChainsUi = function()
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
            //manage users only currently supports delete
            items : [this.adminUtil.createToolbarButton('AddProcessorChains', "report_add.png", this.onAddButtonClicked, applicationResources.getProperty("button.add")), '-',
               this.adminUtil.createToolbarButton('EditProcessorChains', "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton('DeleteProcessorChains', "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-'
            ]
         });


         this.mainGridDataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchProcessorChains.do',
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
               id: 'chainId'
            }, [
               {name: 'chainId', mapping: 'chainId', type: 'int'},
               {name: 'chainName', mapping: 'chainName'},
               {name: 'chainType', mapping: 'chainType'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'chainName',
               dir: 'ASC'
            }
         });

//         this.mainGridDataStore.setDefaultSort('chainName', 'ASC');

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

            { id: 'chainId',
               header: applicationResources.getProperty('admin.manage.header.id'),
               dataIndex: 'chainId',
               sortable: true,
               width: 50,
               css: 'white-space:normal;text-align:right;' },


            { id: 'chainName',
               header: applicationResources.getProperty('admin.manage.header.processorChainName'),
               dataIndex: 'chainName',
               sortable: true,
               width: 200,
               css: 'white-space:normal;',
               sortable:'true'},

            { id: 'chainType',
               header: applicationResources.getProperty('admin.manage.header.processorChainType'),
               dataIndex: 'chainType',
               sortable: true,
               width: 300,
               css: 'white-space:normal;',
               sortable:'true'}
         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            id: this.gridId,
            region:'center',
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.mainGridDataStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            autoExpandColumn: 'chainType',
            bbar: new Ext.PagingToolbar({
               store: this.mainGridDataStore,
               displayInfo: true,
               pageSize: UserPreference.itemsPerPage
            })
         });

         this.adminUtil.init(this, this.contentsGrid);


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
         Adf.manageProcessorChainsUi.adminUtil.refreshContentsGrid(this.getFetchParams());
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
         this.adminUtil.deleteContentNodes.call(
               this.adminUtil,
               this.contentsGrid,
               ServerEnvironment.baseUrl + "/secure/actions/admin/ext/deleteRerProcessorChains.do",
               "selectedChains"
         );
      },

      onAddButtonClicked: function(aButton)
      {
         this.showEditWindow(applicationResources.getProperty('admin.rerProcessorChain.add.title'), false);
      },

      onEditButtonClicked: function(aButton)
      {
         this.showEditWindow(applicationResources.getProperty('admin.rerProcessorChain.edit.title'), true);
      },

      showEditWindow: function(aTitle, loadData)
      {
         var operation = "edit";
         if (!loadData)
         {
            operation = "add";
         }

         this.typeCombo = new Ext.form.ComboBox({
            allowBlank: false,
            editable:false,
            fieldLabel: applicationResources.getProperty('admin.rerProcessorChain.chainType'),
            name:'chainType',
            hiddenName:'chainType',
            hiddenId: 'hiddenChainType',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
               id: 0,
               fields: [
                  'id',
                  'text'
               ],
               data: [
                  [0, applicationResources.getProperty('admin.rerProcessorChain.type.pre')],
                  [1, applicationResources.getProperty('admin.rerProcessorChain.type.output')],
                  [2, applicationResources.getProperty('admin.rerProcessorChain.type.post')]
               ]
            }),
            valueField: 'id',
            displayField: 'text'
         });

         //chain link grid
         this.chainLinkToolbar = new Ext.Toolbar({
            //manage users only currently supports delete
            items : [this.adminUtil.createToolbarButton("EditProcessorChainsAdd", "report_add.png", this.onAddLinkButtonClicked, applicationResources.getProperty('admin.rerProcessorChain.add')), '-',
               this.adminUtil.createToolbarButton("EditProcessorChainsEdit", "report_edit.png", this.onEditLinkButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton("EditProcessorChainsDelete", "report_delete.png", this.onDeleteLinkButtonClicked, applicationResources.getProperty('admin.rerProcessorChain.delete')), '-',
               this.adminUtil.createToolbarButton("EditProcessorChainsMoveUp", "arrow_up.png", this.onMoveUpButtonClicked, applicationResources.getProperty('admin.rerProcessorChain.moveUp')), '-',
               this.adminUtil.createToolbarButton("EditProcessorChainsMoveDown", "arrow_down.png", this.onMoveDownButtonClicked, applicationResources.getProperty('admin.rerProcessorChain.moveDown')), '-'
            ]
         });


         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)
         this.linkDataStore = new Ext.data.Store({
            // create reader that reads the RER records
            reader: new Ext.data.JsonReader({
               root: 'chainLinks',
               id: 'chainLinkId'
            }, [
               {name: 'chainLinkId', mapping: 'chainLinkId', type: 'int'},
               {name: 'chainLinkProcessorClassName', mapping: 'chainLinkProcessorClassName'},
               {name: 'chainLinkExtraArgs', mapping: 'chainLinkExtraArgs'}
            ]),
            remoteSort: false
         });

         this.linkEditor = new Ext.ux.grid.RowEditor({
            saveText: applicationResources.getProperty('button.update')
         });

         //--- custom render function for type field...
         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store
         var linkCm = new Ext.grid.ColumnModel([
            { id: 'chainLinkProcessorClassName',
               header: applicationResources.getProperty('admin.rerProcessorChain.linkClassName'),
               dataIndex: 'chainLinkProcessorClassName',
               width: 200,
               css: 'white-space:normal;',
               sortable:'false',
               editor: new Ext.form.TextField()},

            { id: 'chainLinkExtraArgs',
               header: applicationResources.getProperty('admin.rerProcessorChain.linkExtraArguments'),
               dataIndex: 'chainLinkExtraArgs',
               width: 300,
               css: 'white-space:normal;',
               sortable:'false',
               editor: new Ext.form.TextField()}
         ]);
         linkCm.defaultSortable = false;

         // create the Layout (including the data grid)
         this.chainLinkGrid = new Ext.grid.GridPanel({
            fieldLabel: applicationResources.getProperty('admin.rerProcessorChain.links'),
            border:true,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.linkDataStore,
            cm: linkCm,
            stripeRows: true,
            tbar:this.chainLinkToolbar,
            autoExpandColumn: 'chainLinkExtraArgs',
            plugins:[this.linkEditor],
            height:300
         });

         this.editItemForm = new Adf.AdfFormPanel({
            labelWidth: 120, // label settings here cascade unless overridden
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveRerProcessorChain.do",
            frame:true,
            title: aTitle,
            bodyStyle:'padding:5px 5px 0',
            width: 500,
            defaults: {width: 450},
            defaultType: 'textfield',
            items: [
               {
                  xtype:'hidden',
                  name:'operation',
                  value: operation
               },
               {
                  xtype:'hidden',
                  name:'chainLinksString'
               },
               {
                  xtype:'hidden',
                  name:'chainId'
               },
               {
                  fieldLabel: applicationResources.getProperty('admin.manage.header.processorChainName'),
                  id: 'admin.rerProcessorChain.edit.chainName',
                  name: 'chainName',
                  allowBlank:false
               },
               this.typeCombo,
               this.chainLinkGrid
            ],

            buttons: [
               {
                  scope:this,
                  text: applicationResources.getProperty('button.Save'),
                  handler:function()
                  {
                     // Data validation.
                     var isDataValid = true;
                     if (!this.editItemForm.getForm().findField('admin.rerProcessorChain.edit.chainName').isValid())
                     {
                        this.editItemForm.getForm().findField('admin.rerProcessorChain.edit.chainName').markInvalid(applicationResources.getProperty('admin.rerProcessorChain.blankChainName'));
                        Ext.Msg.alert(applicationResources.getProperty('admin.message.validationError'), applicationResources.getProperty('admin.rerProcessorChain.blankChainName'));
                        isDataValid = false;
                     }

                     if (isDataValid)
                     {
                        //serialize the chain links and set them to the hidden field
                        var ds = this.chainLinkGrid.store;
                        var linkEntries = [];

                        for(var count = 0; count < ds.data.length; count++)
                        {
                           if (!Ext.isEmpty(ds.data.items[count].data['chainLinkProcessorClassName']))
                           {
                               if (ds.data.items[count].data['chainLinkExtraArgs'])
                               {
                                   linkEntries.push(ds.data.items[count].id + ":"
                                       + ds.data.items[count].data['chainLinkProcessorClassName'] + ":"
                                       + ds.data.items[count].data['chainLinkExtraArgs']);
                               }
                               else
                               {
                                   linkEntries.push(ds.data.items[count].id + ":"
                                       + ds.data.items[count].data['chainLinkProcessorClassName']);
                               }
                           }
                           else
                           {
                              Ext.Msg.alert(applicationResources.getProperty('admin.message.validationError'), applicationResources.getProperty('admin.rerProcessorChain.blankLinkClassName'));
                              isDataValid = false;
                              break;
                           }
                        }

                        if (isDataValid)
                        {
                           this.editItemForm.getForm().findField("chainLinksString").setValue(linkEntries.join("|"));
                        }
                     }

                     if (isDataValid)
                     {
                        this.editItemForm.getForm().submit({
                           scope:this,
                           url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveRerProcessorChain.do",
                           waitMsg: applicationResources.getProperty('profileWizard.saving'),
                           success: function()
                           {
                              this.contentsGrid.store.reload({scope:this});
                              editFolderWin.close();
                           }
                        });

                     }
                  }
               },
               {
                  text: applicationResources.getProperty('button.Cancel'),
                  handler:function()
                  {
                     editFolderWin.close();
                  }
               }
            ]
         });

         // create and show window
         var editFolderWin = new Ext.Window({
            id:'editProcessorChainWindow'
            ,title: applicationResources.getProperty('admin.rerProcessorChain.chainDetails')
            ,layout:'fit'
            ,width:650
            ,height:500
            ,closable:true
            ,modal:true
            ,border:false
            ,items:this.editItemForm
            ,closeAction:'close'
         });

         this.loadFormData(this.editItemForm, loadData);

         editFolderWin.show();
      },


      loadFormData: function(aFormPanel, aEditData)
      {
         if (!aEditData)
         {
            aFormPanel.getForm().load({
               scope:this,
               url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/addRerProcessorChain.do"
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
                  scope:this,
                  url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editRerProcessorChain.do",
                  params: {
                     chainId: aNodeId
                  },
                  success: function(aForm, aAction)
                  {
                     this.linkDataStore.loadData(aAction.result.data);
                  }
               });
            }
         }
      },


      onDeleteLinkButtonClicked: function (aButton)
      {
         var rec = this.chainLinkGrid.getSelectionModel().getSelected();
         if (!rec)
         {
            return false;
         }
         this.chainLinkGrid.store.remove(rec);
      },

      onAddLinkButtonClicked: function(aButton)
      {
         var newRecord = new this.chainLinkGrid.store.recordType({
            chainLinkProcessorClassName: '',
            chainLinkExtraArgs: ''
         });
         this.linkEditor.stopEditing();
         this.chainLinkGrid.store.add(newRecord);
         this.linkEditor.startEditing(this.chainLinkGrid.store.getCount() - 1);
      },

      onEditLinkButtonClicked: function(aButton)
      {
         var linkIndex = this.chainLinkGrid.store.indexOf(this.chainLinkGrid.getSelectionModel().getSelected());

         if(linkIndex != -1)
         {
            this.linkEditor.stopEditing();
            this.linkEditor.startEditing(linkIndex);
         }
      },

      onMoveUpButtonClicked: function(aButton)
      {
         var selected = this.chainLinkGrid.getSelectionModel().getSelected();
         var linkIndex = this.chainLinkGrid.store.indexOf(selected);

         if(linkIndex != -1 && linkIndex != 0)
         {
            var ds = this.chainLinkGrid.store;
            ds.remove(selected);
            ds.insert(linkIndex - 1, selected);
         }
      },

      onMoveDownButtonClicked: function(aButton)
      {
         var selected = this.chainLinkGrid.getSelectionModel().getSelected();
         var linkIndex = this.chainLinkGrid.store.indexOf(selected);
         var ds = this.chainLinkGrid.store;

         if(linkIndex != -1 && (ds.data.length - 1) > linkIndex)
         {
            ds.remove(selected);
            ds.insert(linkIndex + 1, selected);
         }
      }
   };
}();

var workspaceUi = Adf.manageProcessorChainsUi;
