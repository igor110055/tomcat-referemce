/**
 * Ext grid definition and form def for ManageOrganizationsAction action
 *
 * @author sallman@motio.com
 * @since 3/8/11
 */


Adf.manageOrganizationsUi = function()
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


         this.EDIT_ORG_BUTTON_ID = Ext.id();
         this.EDIT_DEST_BUTTON_ID = Ext.id();
         this.workspaceToolbar = new Ext.Toolbar({
            items : [
//               this.adminUtil.createToolbarButton(this.EDIT_ORG_BUTTON_ID, "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton(this.EDIT_DEST_BUTTON_ID, "report_edit.png", this.onEditDestinationsButtonClicked, applicationResources.getProperty('button.admin.manage.editDestinations')), '-'
            ]
         });

//         this.orgEditor = new Ext.ux.grid.RowEditor({
//            saveText: applicationResources.getProperty('button.update'),
//            cancelText: applicationResources.getProperty('button.Cancel')
//         });
//
//         this.orgEditor.on('afteredit', this.afterOrgEdit, this);

         this.mainGridDataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchOrganizations.do',
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
               id: 'orgId'
            }, [
               {name: 'orgId', mapping: 'orgId', type: 'int'},
               {name: 'orgName', mapping: 'orgName'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'orgName',
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

            { id: 'orgId',
               header: applicationResources.getProperty('admin.manage.header.id'),
               dataIndex: 'orgId',
               sortable: true,
               width: 50,
               css: 'white-space:normal;text-align:right;'
            },
            { id: 'orgName',
               header: applicationResources.getProperty('admin.manage.header.organizationName'),
               dataIndex: 'orgName',
               width: 250,
               sortable:'true',
               editor: new Ext.form.TextField()
            }
         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            id: this.gridId,
            region:'center',
            title: applicationResources.getProperty('navMenu.manage.organizations'),
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.mainGridDataStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
//            plugins:[this.orgEditor],
            autoExpandColumn: 'orgName',
            bbar: new Ext.PagingToolbar({
               store: this.mainGridDataStore,
               displayInfo: true,
               pageSize: UserPreference.itemsPerPage
            })
         });

         this.adminUtil.init(this, this.contentsGrid);


         return this.contentsGrid;
      },

      afterOrgEdit: function(aRowEditor, aChanges, aRecord, aRowIndex)
      {
         //ajax the name change to the server
         var orgId = aRecord.id;
         var orgName = aChanges.orgName;

         RequestUtil.request({
            url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveOrganization.do",
            params:
            {
               organizationId: orgId,
               organizationName: orgName
            }
         }, false);
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
         Adf.manageOrganizationsUi.adminUtil.refreshContentsGrid(this.getFetchParams());
      },

      onEditButtonClicked: function(aButton)
      {
         var itemIndex = this.contentsGrid.store.indexOf(this.contentsGrid.getSelectionModel().getSelected());

         if(itemIndex != -1)
         {
            this.orgEditor.stopEditing(true);
            this.orgEditor.startEditing(itemIndex, true);
         }
      },

      onEditDestinationsButtonClicked: function(aButton)
      {
         var selected = this.contentsGrid.getSelectionModel().getSelected();

         if(selected)
         {
            Adf.manageDestinationsUi.setOrganizationId(selected.id);
            this.adminPanel.layout.setActiveItem(Adf.manageDestinationsUi.gridId);
         }
      }
   };
}();

var workspaceUi = Adf.manageOrganizationsUi;
