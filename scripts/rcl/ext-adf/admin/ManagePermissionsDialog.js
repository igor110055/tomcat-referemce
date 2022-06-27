Ext.ns('Adf');

/**
 * Permissions dialog used in several admin screens
 *
 * @author sallman@motio.com
 * @since 1/27/11
 */


Adf.permissionsDialog = function()
{
   return {
      init : function(aTitle, anItemId, aNamespace, aNodeType, aCanInherit, aIsInherit)
      {
         this.title = aTitle;
         this.itemId = anItemId;
         this.namespace = aNamespace;
         this.nodeType = aNodeType;
         this.canInherit = aCanInherit;
         this.isInherit = aIsInherit;
         this.adminUtil = Adf.AdminScreenUtils();
         this.adminUtil.setScope(this);
      },

      /**
       * returns the params used by the ajax call (based on URL params)
       */
      getFetchParams: function()
      {
         return {
            'start' : 0,
            'limit' : ServerEnvironment.extPageSize,
            'itemType':this.nodeType,
            'itemId': this.itemId,
            'namespace': this.namespace,
            'canInheritPermissions': this.canInherit,
            'inheritPermissions': this.isInherit
         };
      },


      /**
       * refreshes the RER grid
       */
      refreshContentsGrid: function()
      {
         Adf.permissionsDialog.adminUtil.refreshContentsGrid(this.getFetchParams());
      },

      /**
       * the refresh button was clicked
       */
      onRefreshButtonClicked: function (aButton)
      {
         this.refreshContentsGrid();
      },


      showEditWindow: function(aCallerScope, isInherit, aCanInherit, aPermittedListStr, aCallback)
      {
         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)

         this.permissionsStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchPermissions.do'
            }),
            // create reader that reads the RER records
            reader: new Ext.data.JsonReader({
               root: 'roles',
               totalProperty: 'totalCount',
               id:'roleName'
            }, [
               {name: 'roleName', mapping: 'roleName'}
            ]),
            remoteSort: true
         });

         //--- custom render function for type field...
         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store
         var cm = new Ext.grid.ColumnModel([
            { id: 'roleName',
               header: 'Role Name',
               dataIndex: 'roleName',
               width: 250,
               css: 'white-space:normal;' }
         ]);

         cm.defaultSortable = true;


         this.pagingToolbar = new Ext.PagingToolbar({
           pageSize: ServerEnvironment.extPageSize,
           store: this.permissionsStore,
           displayInfo: true,
           displayMsg: 'Roles {0} - {1} of {2}',
           emptyMsg: "No Roles Found."
         });

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
//            region:'center',
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.permissionsStore,
            cm: cm,
            stripeRows: true,
            bbar:this.pagingToolbar,
            autoExpandColumn: 'roleName',
            height:380,
            width: 310
         });

         this.adminUtil.init(this, this.contentsGrid);

         //Needed to get the Pagination toolbar to use the required inputs
         this.permissionsStore.proxy.on('beforeload', function(proxy, params)
         {
            params.itemType = Adf.permissionsDialog.nodeType;
            params.itemId = Adf.permissionsDialog.itemId;
            params.namespace = Adf.permissionsDialog.namespace;
            params.canInheritPermissions = Adf.permissionsDialog.canInherit;
            params.inheritPermissions = Adf.permissionsDialog.isInherit;
         });

         this.permissionsStore.load({
            params: this.getFetchParams(),
            scope:this
         });

         var resultStore = new Ext.data.ArrayStore(
         {
            autoDestroy:true,
            fields:[
               {name:'roleName', type: 'string'}],
            data:[]
         });

         this.resultList = new Ext.ux.form.MultiSelect(
         {
            xtype: 'multiselect',
//            fieldLabel: 'Selected Roles',
            name: 'resultList',
            height: 380,
            width: 220,
            ddReorder: true,
            store:resultStore,
            displayField:'roleName',
            valueFiled: 'roleName',
            delimiter: ',,'
         });


         this.mainPanel = new Ext.Panel(
         {
            border:false,
            layout:'table',
            width: 620,
            layoutConfig:
            {
               columns: '3'
            },
            items:[
               this.contentsGrid,
               new Ext.Panel(
               {
                  padding:'2px',
                  width:55,
                  items:[
                     {
                        xtype:'label',
                        text:' ',
                        height:'180'
                     },
                     {
                        xtype:'button',
                        width:50,
                        text:'&gt;&gt;',
                        scope: this,
                        handler: this.moveRightButton
                     },
                     {
                         xtype:'button',
                        width:50,
                        text:'&lt;&lt;',
                        scope: this,
                        handler: this.moveLeftButton
                     }
                  ]

               }),
               this.resultList
            ]
         });

         var inheritCheck = new Ext.form.Checkbox({
            name:'inheritPermissions',
            boxLabel:'Inherit Permissions from Parent',
            scope: this,
            hidden: (aCanInherit == 'false'),
            listeners:
               {
                  scope: this,
                  check: this.inheritClicked
               }
         });

         var editPermissionsForm = new Adf.AdfFormPanel({
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/savePermissions.do",
            frame:true,
            title: this.title,
            bodyStyle:'padding:5px 5px 0',
            hideLabels:true,
            width: 640,
            defaultType: 'textfield',
            items: [
               inheritCheck,
               this.mainPanel
            ],

            buttons: [
               {
                  text: 'Save',
                  scope: this,
                  handler:function()
                  {
//                     var results = Adf.permissionsDialog.resultList.view.store.data;
                     var stringArr = [];
                     this.resultList.view.store.data.each(
                        function(aItem, aIndex, aLength)
                        {
                           stringArr.push(aItem.data['roleName']);
                        });

                     aCallback.call(aCallerScope, editPermissionsForm.getForm().findField('inheritPermissions').getValue(), stringArr.join(',,'));
                     editPermissionsWin.close();
                  }
               },
               {
                  text: 'Cancel',
                  handler:function()
                  {
                     editPermissionsWin.close();
                  }
               }
            ]
         });

         var RoleRecord = Ext.data.Record.create([{name: 'roleName', mapping: 'roleName', allowBlank: false}]);

         if(isInherit != 'true' && aPermittedListStr != '')
         {
            var permittedRoles = aPermittedListStr.split(this.resultList.delimiter);
            for(var count = 0; count < permittedRoles.length; count++)
            {
               var roleRecord = new RoleRecord({'roleName':permittedRoles[count]});
               resultStore.add(roleRecord);
            }
         }

         editPermissionsForm.getForm().findField('inheritPermissions').setValue(isInherit);

         // create and show window
         var editPermissionsWin = new Ext.Window({
            id:'editPermissionsAdf'
            ,title:'Edit Permissions'
            ,layout:'fit'
            ,width:630
            ,height:520
            ,closable:true
            ,modal:true
            ,border:false
            ,items:editPermissionsForm
            ,closeAction:'close'
         });


         editPermissionsWin.show();
      },

      moveRightButton: function()
      {
         var ids = this.contentsGrid.getSelectionModel().getSelections();
         for(var count = 0; count < ids.length; count++)
         {
            var curRecord = ids[count];
            if(this.resultList.store.indexOf(curRecord) == -1)
            {
               this.resultList.store.add(curRecord.copy());
            }
         }

         this.resultList.view.refresh();
      },

      moveLeftButton: function()
      {
         var selectionsArray = this.resultList.view.getSelectedIndexes();
         var records = [];
         if (selectionsArray.length > 0)
         {
             for (var i=0; i<selectionsArray.length; i++)
             {
                 var record = this.resultList.view.store.getAt(selectionsArray[i]);
                 records.push(record);
             }
             for (var i=0; i<records.length; i++)
             {
                 var record = records[i];

                 this.resultList.view.store.remove(record);
             }
         }
         this.resultList.view.refresh();
         var si = this.resultList.store.sortInfo;
         if(si){
             this.resultList.store.sort(si.field, si.direction);
         }
      },

      inheritClicked: function(aCheckBox, aChecked)
      {
         if(aChecked)
         {
            this.mainPanel.disable();
         }
         else
         {
            this.resultList.view.store.removeAll();
            this.mainPanel.enable();
         }
      }
   };
}();
