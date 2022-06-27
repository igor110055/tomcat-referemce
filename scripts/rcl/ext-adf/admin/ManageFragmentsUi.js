/**
 * Ext grid definition and form def for ManageFragments action
 *
 * @author sallman@motio.com
 * @since 2/23/11
 */


Adf.manageFragmentsUi = function()
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
         this.editFormName = 'editFragmentForm';
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
            items : [this.adminUtil.createToolbarButton("AddFragment", "report_add.png", this.onAddButtonClicked, applicationResources.getProperty("button.add")), '-',
               this.adminUtil.createToolbarButton("EditFragment", "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton("DeleteFragment", "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-'
            ]
         });


         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)

         this.gridItemStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchFragments.do',
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
               id: 'fragmentId'
            }, [
               {name: 'fragmentId', mapping: 'fragmentId', type: 'int'},
               {name: 'fragmentName', mapping: 'fragmentName'},
               {name: 'fragmentGlobal', mapping: 'fragmentGlobal'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'fragmentName',
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

            { id: 'fragmentId',
               header: applicationResources.getProperty('admin.manage.header.id'),
               dataIndex: 'fragmentId',
               sortable: true,
               width: 50,
               css: 'white-space:normal;text-align:right;' },


            { id: 'fragmentName',
               header: applicationResources.getProperty('admin.manage.header.fragmentName'),
               dataIndex: 'fragmentName',
               width: 250,
               css: 'white-space:normal;',
               sortable:'true'},

            { id: 'fragmentGlobal',
               header: applicationResources.getProperty('admin.manage.header.isGlobal'),
               dataIndex: 'fragmentGlobal',
               width: 100,
               css: 'white-space:normal;',
               sortable:'true'}
         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            id: this.gridId,
            title: "Report Fragments",
            region:'center',
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.gridItemStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            autoExpandColumn: 'fragmentName',
            bbar: new Ext.PagingToolbar({
               store: this.gridItemStore,
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
         Adf.manageFragmentsUi.adminUtil.refreshContentsGrid(this.getFetchParams());
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
               ServerEnvironment.baseUrl + "/secure/actions/admin/ext/deleteFragment.do",
               "targetFragmentId");
      },

      onAddButtonClicked: function(aButton)
      {
         this.showEditWindow('Add New Fragment', false);
      },

      onEditButtonClicked: function(aButton)
      {
         this.showEditWindow('Edit Fragment', true);
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
         this.adminPanel.layout.setActiveItem(this.editFormName);
      },

      getEditForm: function()
      {
         this.typeCombo = new Ext.form.ComboBox({
            allowBlank: false,
            editable:false,
            fieldLabel: 'Fragment Type',
            name:'injectorName',
            hiddenName:'injectorName',
            hiddenId: 'hiddenInjectorName',
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            store: new Ext.data.JsonStore({
               root:'injectorList'
               ,fields:[
                  {name:'injectorName', type:'string'},
                  {name:'injectorClass', type:'string'}
               ]
            }),
            valueField: 'injectorClass',
            displayField: 'injectorName'
         });

         this.editItemForm = new Adf.AdfFormPanel({
            labelWidth: 120, // label settings here cascade unless overridden
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveFragment.do",
            frame:true,
            title: "Edit Fragment",
            bodyStyle:'padding:5px 5px 0',
            width: 650,
            defaults: {anchor:'100%'},
            defaultType: 'textfield',
            fileUpload: true,
            items: [
               {
                  xtype:'hidden',
                  name:'fragmentId'
               },
               {
                  xtype:'hidden',
                  name:'operation'
               },
               {
                  fieldLabel: 'Fragment Name',
                  name: 'fragmentName',
                  allowBlank:false
               },
               this.typeCombo,
               {
                  fieldLabel: 'Fragment Global',
                  xtype:'checkbox',
                  name: 'global'
               },
               {
                  fieldLabel: 'Fragment XML',
                  name: 'fragmentXml',
                  xtype:'textarea',
                  grow:true,
                  growMax:300,
                  width:400,
                  allowBlank:false
               },
               {
                  fieldLabel: 'XML Specification File',
                  xtype:'fileuploadfield',
                  id:'xmlFile',
                  buttonText:'Browse...',
                  name: 'xmlFile',
                  listeners:
                  {
                     scope:this,
                     'fileselected':function(aFileUploadField, aFilePath)
                     {
                        this.editItemForm.getForm().submit({
                           scope:this,
                           clientValidation:false,
                           url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/uploadFragment.do",
                           waitMsg: 'Uploading File...',
                           success: function(aForm, aAction)
                           {
                              this.editItemForm.getForm().findField('fragmentXml').setValue(aAction.result.data['fragmentXml']);
                           }
                        })
                     }
                  }
               }
            ],

            buttons: [
               {
                  scope:this,
                  text: 'Save',
                  handler:function()
                  {
                     this.editItemForm.getForm().submit({
                        scope:this,
                        url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveFragment.do",
                        waitMsg:'Saving...',
                        success: function()
                        {
                           this.refreshContentsGrid();
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
            id: this.editFormName,
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
               url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/addFragment.do",
               success: this.initTypeList
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
                  url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editFragment.do",
                  params: {
                     fragmentId: aNodeId
                  },
                  success: this.initTypeList
               });
            }
         }
      },
      initTypeList: function(aForm, aAction)
      {
         this.typeCombo.store.loadData(aAction.result.data);
      }
   };
}();

var workspaceUi = Adf.manageFragmentsUi;
