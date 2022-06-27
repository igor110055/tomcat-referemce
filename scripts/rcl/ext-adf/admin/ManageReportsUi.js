/**
 * Ext grid definition and form def for ManageReports action
 *
 * @author sallman@motio.com
 * @since 2/24/11
 */


Adf.manageReportsUi = function()
{
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
            items : [this.adminUtil.createToolbarButton(Ext.id(), "report_add.png", this.onAddButtonClicked, applicationResources.getProperty("button.add")), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-',
               this.adminUtil.createToolbarButton(Ext.id(), "report_magnify.png", this.onReportMetadataButtonClicked, applicationResources.getProperty("navMenu.links.reportMetadata")), '-'
            ]
         });


         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)

         this.mainGridDataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchReports.do',
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
               id: 'reportId'
            }, [
               {name: 'reportId', mapping: 'reportId', type: 'int'},
               {name: 'reportName', mapping: 'reportName'},
               {name: 'customPromptName', mapping: 'customPromptName'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'reportName',
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

            { id: 'reportId',
               header: 'ID',
               dataIndex: 'reportId',
               sortable: true,
               width: 50,
               css: 'white-space:normal;text-align:right;' },


            { id: 'reportName',
               header: 'Report Name',
               dataIndex: 'reportName',
               sortable: true,
               width: 200,
               css: 'white-space:normal;',
               sortable:'true'},

            { id: 'customPromptName',
               header: 'Custom Prompt',
               dataIndex: 'customPromptName',
               sortable: true,
               width: 300,
               css: 'white-space:normal;',
               sortable:'true'}
         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            id: this.gridId,
            title: "Reports",
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
            autoExpandColumn: 'reportName',
            bbar: new Ext.PagingToolbar({
               store: this.mainGridDataStore,
               displayInfo: true,
               pageSize: UserPreference.itemsPerPage
            })
         });

         this.adminUtil.init(this, this.contentsGrid);


         this.contentsGrid.on('rowdblclick', this.onContentsGridDoubleClicked, this);
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
         Adf.manageReportsUi.adminUtil.refreshContentsGrid(this.getFetchParams());
      },

      /**
       * the refresh button was clicked
       */
      onRefreshButtonClicked: function (aButton)
      {
         this.refreshContentsGrid();
      },


      /**
       * This method handles the Report Metadata button click event. It displays the Report Metadata screen for
       * the selected report.
       *
       * @param aButton (Ext.Button) Report Metadata button.
       * @param aEventObject (Ext.EventObject) A button click event.
       */
      onReportMetadataButtonClicked: function(aButton, aEventObject)
      {
         var selected = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1);
         if (selected != null && selected.length == 1)
         {
            var url = ServerEnvironment.baseUrl + "/secure/actions/admin/reportMd/edit.do?reportId=" + selected[0].id;

            var windowName = ServerEnvironment.windowNamePrefix + "_EditMetadata_" + selected[0].id;

            var geom = new BrowserGeometry();
            var win = window.open(url,
               windowName,
               "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

            win.focus();
         }
      },


      /**
       * the delete button was clicked
       */
      onDeleteButtonClicked: function (aButton)
      {
         this.adminUtil.deleteContentNodes.call(this.adminUtil,
               this.contentsGrid,
               ServerEnvironment.baseUrl + "/secure/actions/admin/ext/deleteReports.do",
               "targetReportId");
      },

      onAddButtonClicked: function(aButton)
      {
         this.showEditWindow('Add New Report', false);
      },

      onEditButtonClicked: function(aButton)
      {
         this.showEditWindow('Edit Report', true);
      },


      /**
       * This method handles the row double click event on the Contents grid. It displays the Edit Report screen when
       * a row in Contents grid is double clicked on.
       *
       * @param aGrid (Ext.grid.GridPanel) Contents grid.
       * @param aRowIndex (Number) Index of the row doubled clicked on.
       * @param aEventObject (Ext.EventObject) Row double click event.
       */
      onContentsGridDoubleClicked: function(aGrid, aRowIndex, aEventObject)
      {
         this.showEditWindow('Edit Report', true);
      },

      showEditWindow: function(aTitle, loadData)
      {
         var operation = "edit";
         if (!loadData)
         {
            operation = "add";
         }
         this.loadFormData(this.editItemForm, loadData);
         this.editItemForm.getForm().findField('operation').setValue(operation);
         this.adminPanel.layout.setActiveItem('editReportForm');
      },

      getEditForm: function()
      {
         var fragmentToolbar = new Ext.Toolbar({
            items : [
               this.adminUtil.createToolbarButton("MoveUpReportFragment", "arrow_up.png", this.onMoveUpButtonClicked, 'Move Up'), '-',
               this.adminUtil.createToolbarButton("MoveDownReportFragment", "arrow_down.png", this.onMoveDownButtonClicked, 'Move Down'), '-'
            ]
         });

         this.sourceFragmentStore = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
               root: 'sourceFragments',
               id: 'fragmentId'
            }, [
               {name: 'fragmentId', mapping: 'fragmentId', type: 'int'},
               {name: 'fragmentName', mapping: 'fragmentName'}
            ]),
            remoteSort: false
         });

         this.destFragmentStore = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
               root: 'destFragments',
               id: 'fragmentId'
            }, [
               {name: 'fragmentId', mapping: 'fragmentId', type: 'int'},
               {name: 'fragmentName', mapping: 'fragmentName', sortable: false}
            ]),
            remoteSort: false
         });

         var srcFragmentCm = new Ext.grid.ColumnModel([
            { id: 'fragmentName',
               header: 'Fragment Name',
               dataIndex: 'fragmentName',
               width: 200,
               css: 'white-space:normal;',
               sortable:'true'}
         ]);

         var destFragmentCm = new Ext.grid.ColumnModel([
            { id: 'fragmentName',
               header: 'Fragment Name',
               dataIndex: 'fragmentName',
               width: 200,
               css: 'white-space:normal;',
               sortable:'true'}
         ]);

         this.sourceFragmentsGrid = new Ext.grid.GridPanel({
            // A workaround to put a border around the grid which disappears when the grid is contained within a
            // container that has the frame property set to true.
            bodyStyle: 'border: 1px solid; border-color: #99bbe8; border-top: 0 none;',
            border:true,
            title: 'Available Fragments',
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.sourceFragmentStore,
            cm: srcFragmentCm,
            stripeRows: true,
            height:300,
            flex: 1
         });

         this.destFragmentsGrid = new Ext.grid.GridPanel({
            // A workaround to put a border around the grid which disappears when the grid is contained within a
            // container that has the frame property set to true.
            bodyStyle: 'border: 1px solid; border-color: #99bbe8; border-top: 0 none;',
            border:true,
            title:'Selected Fragments',
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.destFragmentStore,
            cm: destFragmentCm,
            stripeRows: true,
            tbar: fragmentToolbar,
            height:300,
            flex: 1
         });

         var fragTree = new Ext.Panel(
         {
            layout:'table',
            border:true,
            id: 'fragComposite',
            layoutConfig:
            {
               columns: '3'
            },
            items: [
               this.sourceFragmentsGrid,
               new Ext.Panel(
               {
                  padding:'2px',
                  width:55,
                  items:[
                     {
                        xtype:'button',
                        width:50,
                        text:'&gt;&gt;',
                        scope: this,
                        handler: this.moveFragRightButton
                     },
                     {
                         xtype:'button',
                        width:50,
                        text:'&lt;&lt;',
                        scope: this,
                        handler: this.moveFragLeftButton
                     }
                  ]

               }),
               this.destFragmentsGrid
            ]
         });

         this.customPromptCombo = new Ext.form.ComboBox({
            allowBlank: false,
            editable:false,
            fieldLabel: 'Custom Prompt Screen',
            name:'customPromptList',
            hiddenName:'customPromptId',
            hiddenId: 'hiddenCustomPromptId',
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: new Ext.data.JsonStore({
               root:'customPromptList'
               ,fields:[
                  {name:'customPromptId', type:'string'},
                  {name:'customPromptName', type:'string'}
               ]
            }),
            valueField: 'customPromptId',
            displayField: 'customPromptName'
         });

         this.preProcessorCombo = new Ext.form.ComboBox({
            allowBlank: true,
            editable:false,
            fieldLabel: 'Pre Processor Chain',
            name:'preProcessorChainId',
            hiddenName:'preProcessorChainId',
            hiddenId: 'hiddenPreProcessorChainId',
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: new Ext.data.JsonStore({
               root:'preProcessorChainList'
               ,fields:[
                  {name:'preProcessorChainId', type:'string'},
                  {name:'processorName', type:'string'}
               ]
            }),
            valueField: 'preProcessorChainId',
            displayField: 'processorName'
         });

         this.outputProcessorCombo = new Ext.form.ComboBox({
            allowBlank: true,
            editable:false,
            fieldLabel: 'Output Processor Chain',
            name:'outputProcessorChainId',
            hiddenName:'outputProcessorChainId',
            hiddenId: 'hiddenOutputProcessorChainId',
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: new Ext.data.JsonStore({
               root:'outputProcessorChainList'
               ,fields:[
                  {name:'outputProcessorChainId', type:'string'},
                  {name:'processorName', type:'string'}
               ]
            }),
            valueField: 'outputProcessorChainId',
            displayField: 'processorName'
         });

         this.postProcessorCombo = new Ext.form.ComboBox({
            allowBlank: true,
            editable:false,
            fieldLabel: 'Post Processor Chain',
            name:'postProcessorCombo',
            hiddenName:'postProcessorChainId',
            hiddenId: 'hiddenPostProcessorChainId',
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: new Ext.data.JsonStore({
               root:'postProcessorChainList'
               ,fields:[
                  {name:'postProcessorChainId', type:'string'},
                  {name:'processorName', type:'string'}
               ]
            }),
            valueField: 'postProcessorChainId',
            displayField: 'processorName'
         });


         var parentFolderField = new Ext.form.TextField({
            name: 'parentFolderId',
            flex: 1
         });

         var searchPathField = new Ext.form.TextField({
            name: 'reportXpath',
            flex: 1
         });

         this.INHERITED_PANEL_ID = Ext.id();
         this.SELECTED_PANEL_ID = Ext.id();

         this.inheritedPermissions = new Ext.form.Checkbox({
            boxLabel: 'Inherit Permissions From Parent',
            width: 450,
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
            width: 450,

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
            width: 450,
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
            width: 450,
            fieldLabel: 'Permissions',

            items: [{
               xtype: 'button',
               width: 450,
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
                        Adf.manageReportsUi.editItemForm.getForm().findField('permissionsForm.inheritPermissions').setValue(aIsInherit);
                        Adf.manageReportsUi.editItemForm.getForm().findField('permissionsForm.permittedListString').setValue(aPermissionsString);
                        Adf.manageReportsUi.updatePermissions();
                     });

               }
            }, this.permissionsDetails]

         });

         this.editItemForm = new Adf.AdfFormPanel({
            labelWidth: 120, // label settings here cascade unless overridden
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveReport.do",
            frame:true,
            title: "Edit Report",
            bodyStyle:'padding:5px 5px 0',
            width: 670,
            defaults: {anchor:'100%'},
            defaultType: 'textfield',
            items: [
               {
                  xtype:'hidden',
                  name:'operation'
               },
               {
                  xtype:'hidden',
                  name:'isShowColDefsInAppendix'
               },
               {
                  xtype:'hidden',
                  name:'fragmentCount'
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
                  name:'reportId'
               },

               {
                  xtype:'tabpanel',
                  activeTab: 0,
                  width:600,
                  height: 450,

                  // Removed deferredRender: false, because it caused the search fields and buttons to be drawn incorrectly
                  // when the tab panel is first displayed.

                  defaults:{bodyStyle:'padding:10px'},
                  items:[
                     {
                        title:'Report Details',
                        xtype: 'panel',
                        layout:'form',
                        defaults: {width: 450},
                        defaultType: 'textfield',

                        items: [
                           {
                              fieldLabel: 'Report Name',
                              name: 'reportName',
                              allowBlank:false
                           },
                           {
                              xtype: 'compositefield',
                              id: 'searchPathComposite',
                              fieldLabel: 'Content Store Path',
                              items: [
                                 searchPathField,
                                 {
                                    scope: this,
                                    xtype: 'button',
                                    text: '...',
                                    name: 'searchPathButton',
                                    handler:function()
                                    {
                                       var crnDialog = new CrnDialog();

                                       crnDialog.showExtChooserDialog("/content", ["folder", "package", "query", "report", "reportView"],
                                             function(aSearchPath)
                                             {
                                                searchPathField.setValue(aSearchPath);
                                             });
                                    }
                                 }
                              ]
                           },
                           {
                              xtype: 'compositefield',
                              id: 'adfFolderComposite',
                              fieldLabel: 'ADF Parent Folder',
                              items: [
                                 parentFolderField,
                                 {
                                    scope: this,
                                    xtype: 'button',
                                    name: 'adfFolderButton',
                                    text: '...',
                                    handler:function()
                                    {
                                       Adf.adfFolderPickerDialog.showFolderPickerWindow(
                                             function(aFolderPath)
                                             {
                                                parentFolderField.setValue(aFolderPath);
                                             });
                                    }
                                 }
                              ]
                           },
                           {
                              xtype: 'compositefield',
                              fieldLabel: 'Max Execution Time',
                              name: 'maxExComposite',
                              items:
                                    [
                                       {
                                          xtype: 'textfield',
                                          name:'maxExecutionTime',
                                          width:'150'
                                       },
                                       {
                                          xtype: 'label',
                                          name:'exTimeLabel',
                                          text: 'seconds (set to 0 for no limit)'
                                       }
                                    ]
                           },
                           {
                              // Use the default, automatic layout to distribute the controls evenly
                              // across a single row
                              xtype: 'checkboxgroup',
                              fieldLabel: 'Report Options',
                              items: [
                                 {boxLabel: 'Hide Report', name: 'hidden'},
                                 {boxLabel: 'Offline Report', name: 'offline'},
                                 {boxLabel: 'Open drill links in same window', name: 'drillInFrame'}
                              ]
                           },
                           {
                              xtype: 'displayfield',
                              fieldLabel: applicationResources.getProperty('admin.reports.columnDefinitions'),
                              value: applicationResources.getProperty('admin.reports.showColumnDefsInReport')
                           },
                           {
                              xtype: 'radiogroup',
                              id: 'doAppendixDefinitions_group',
                              items:[{
                                 boxLabel: applicationResources.getProperty('admin.reports.showColumnDefsInReport.yes'),
                                 id: 'doAppendixDefinitions_yes',
                                 name: 'doAppendixDefinitions',
                                 inputValue: 'yes'
                              }, {
                                 boxLabel: applicationResources.getProperty('admin.reports.showColumnDefsInReport.no'),
                                 id: 'doAppendixDefinitions_no',
                                 name: 'doAppendixDefinitions',
                                 inputValue: 'no'
                              }]
                           },

                           this.currentPermissionsPanel

                        ]
                     },
                     {
                        title:'Prompts and Processors',
                        layout:'form',
                        defaults: {width: 450},
                        defaultType: 'textfield',

                        items: [
                           this.customPromptCombo,
                           {
                              fieldLabel: 'Extra Prompt Params',
                              name: 'extraPromptParams'
                           },
                           {
                              fieldLabel: 'Re-Use Algorithm Class',
                              name: 'reUseAlgorithm'
                           },
                           {
                              fieldLabel: 'Re-Use Algorithm Parameters',
                              name: 'reUseAlgorithmParameters'
                           },
                           this.preProcessorCombo,
                           this.outputProcessorCombo,
                           this.postProcessorCombo
                        ]
                     },
                     {
                        title:'Fragments',
//                        layout:'fit',
                        border:'true',
                        items: [
                           fragTree
                        ]
                     }
                  ]
               }
            ],

            buttons: [
               {
                  scope:this,
                  text: 'Save',
                  handler:function()
                  {
                     //serialize the report fragments and set them to the hidden field
                     var ds = this.destFragmentStore;
                     var fragEntries = [];
                     var fragCount = ds.data.length;

                     for (var count = 0; count < fragCount; count++)
                     {
                        fragEntries.push("reportFragmentId=" + ds.data.items[count].id + "&");
                     }

                     var fragmentIds = "";
                     if(fragCount > 0)
                     {
                        fragmentIds = "?" + fragEntries.join("");
                     }

                     this.editItemForm.getForm().findField('fragmentCount').setValue(fragCount);
                     this.editItemForm.getForm().submit({
                        scope:this,
                        url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveReport.do" + fragmentIds,
                        waitMsg:'Saving...',
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
                  text: 'Cancel',
                  handler:function()
                  {
                     this.adminPanel.layout.setActiveItem(this.gridId);
                  }
               }
            ]
         });

         return new Ext.Panel({
            id: 'editReportForm',
            hideLabels: true,
            hideBorders: true,
            items:[this.editItemForm]
         });
      },


      loadFormData: function(aFormPanel, aEditData)
      {
         if (!aEditData)
         {
            aFormPanel.getForm().load({
               scope:this,
               url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/addReport.do",
               failure: function(form, action)
               {
                  Ext.Msg.alert("Load failed", action.result['errorMessage']);
               },
               success: this.initLists
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
                  url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editReport.do",
                  params: {
                     reportId: aNodeId
                  },
                  failure: function(form, action)
                  {
                     Ext.Msg.alert("Load failed", action.result['errorMessage']);
                  },
                  success: this.initLists
               });
            }
         }
      },

      onMoveUpButtonClicked: function(aButton)
      {
         var grid = this.destFragmentsGrid;
         var selected = grid.getSelectionModel().getSelected();
         var linkIndex = grid.store.indexOf(selected);

         if (linkIndex != -1 && linkIndex != 0)
         {
            var ds = grid.store;
            ds.remove(selected);
            ds.insert(linkIndex - 1, selected);
         }
      },

      onMoveDownButtonClicked: function(aButton)
      {
         var grid = this.destFragmentsGrid;
         var selected = grid.getSelectionModel().getSelected();
         var linkIndex = grid.store.indexOf(selected);
         var ds = grid.store;

         if (linkIndex != -1 && (ds.data.length - 1) > linkIndex)
         {
            ds.remove(selected);
            ds.insert(linkIndex + 1, selected);
         }
      },

      initLists: function(aForm, aAction)
      {
         this.customPromptCombo.store.loadData(aAction.result.data);
         this.customPromptCombo.setValue(aAction.result.data['customPromptId']);
         this.preProcessorCombo.store.loadData(aAction.result.data);
         this.outputProcessorCombo.store.loadData(aAction.result.data);
         this.postProcessorCombo.store.loadData(aAction.result.data);
         this.sourceFragmentStore.loadData(aAction.result.data);
         this.destFragmentStore.loadData(aAction.result.data);
         this.editItemForm.getForm().findField('doAppendixDefinitions_group').setValue(aAction.result.data.doAppendixDefinitions);
         this.editItemForm.doLayout(false, true);
         this.updatePermissions();
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
      },


      moveFragRightButton: function()
      {
         var ids = this.sourceFragmentsGrid.getSelectionModel().getSelections();
         for(var count = 0; count < ids.length; count++)
         {
            var curRecord = ids[count];
            this.sourceFragmentStore.remove(curRecord);
            this.destFragmentStore.add(curRecord);
         }
      },

      moveFragLeftButton: function()
      {
         var ids = this.destFragmentsGrid.getSelectionModel().getSelections();
         for(var count = 0; count < ids.length; count++)
         {
            var curRecord = ids[count];
            this.destFragmentStore.remove(curRecord);
            this.sourceFragmentStore.add(curRecord);
         }
      }
   };
}();

var workspaceUi = Adf.manageReportsUi;
