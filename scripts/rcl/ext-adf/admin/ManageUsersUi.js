/**
 * Ext grid definition for ManageUsers action
 *
 * @author sallman@motio.com
 * @since 1/27/11
 */

Adf.manageUsersUi = function()
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

      getAdminGrid: function(aGridId)
      {
         this.DELETE_BUTTON_ID = Ext.id();
         this.ADD_BUTTON_ID = Ext.id();
         this.EDIT_BUTTON_ID = Ext.id();

         this.workspaceToolbar = new Ext.Toolbar({
            //manage users only currently supports delete
            items : [
               // todo: implement add/edit user features.
//               this.adminUtil.createToolbarButton(this.ADD_BUTTON_ID, "report_add.png", this.onAddButtonClicked, applicationResources.getProperty("button.add")), '-',
//               this.adminUtil.createToolbarButton(this.EDIT_BUTTON_ID, "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton(this.DELETE_BUTTON_ID, "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-'
            ]
         });

         var dataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchUsers.do',
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
               root: 'userContents',
               totalProperty: 'totalCount',
               id: 'id'
            }, [
               {name: 'id', mapping: 'id', type: 'int'},
               {name: 'logon', mapping: 'logon'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'logon',
               dir: 'ASC'
            }
         });


         //--- custom render function for type field...
         var renderIconFn = function (aValue, aCellMetaData, aRecord)
         {
            var html = '<img alt="icon" src="' + ServerEnvironment.baseUrl + '/images/silkIcons/user_green.png"/>';
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

            { id: 'userId',
               header: 'ID',
               dataIndex: 'id',
               width: 60,
               sortable: true,
               css: 'white-space:normal;text-align:right;' },


            { id: 'logon', // id assigned so we can apply custom css (e.g. .x-grid-col-profileName b { color:#333 })
               header: applicationResources.getProperty("manageUserContent.users"),
               dataIndex: 'logon',
               width: 300,
               sortable: true,
               css: 'white-space:normal;'}

         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            title: applicationResources.getProperty('navMenu.manage.users'),
            id: aGridId,
            region:'center',
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: dataStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            autoExpandColumn: 'logon',
            bbar: new Ext.PagingToolbar({
               store: dataStore,
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
         Adf.manageUsersUi.adminUtil.refreshContentsGrid(this.getFetchParams());
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
               ServerEnvironment.baseUrl + "/secure/actions/admin/ext/deleteUsers.do",
               "userId");
      },


      /**
       * This method handles the Add button click event.
       *
       * @param aButton (Ext.Button) Add button.
       * @param aEventObject (Ext.EventObject) A button click event.
       */
      onAddButtonClicked: function(aButton, aEventObject)
      {

      },


      /**
       * This method handles the Edit button click event.
       *
       * @param aButton (Ext.Button) Edit button.
       * @param aEventObject (Ext.EventObject) A button click event.
       */
      onEditButtonClicked: function(aButton, aEventObject)
      {

      }

   };
}();


var workspaceUi = Adf.manageUsersUi;
