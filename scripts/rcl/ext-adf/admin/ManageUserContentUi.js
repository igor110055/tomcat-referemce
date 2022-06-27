/**
 * Ext grid definition for ManageUserContent action
 *
 * @author sallman@motio.com
 * @since 1/27/11
 */

Adf.manageUserContentUi = function()
{
   ////////////////////////////////////////////////////////////////////////////
   // Private
   ////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////
   // Public
   ////////////////////////////////////////////////////////////////////////////
   return {
      SHOW_ALL_ID: -2,

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
         var comboUserStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchUsers.do?allUsersOption=true'
               ,
               listeners: {
                  scope: this,
                  beforeload : function(aDataProxy, aParams){
                     Ext.applyIf (aParams, {
                        start: 0,
                        limit: 2,
                        allUsersOption: true
                     });
                  }
               }
            }),
            reader: new Ext.data.JsonReader({
               root: 'userContents',
               totalProperty: 'totalCount'
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


         this.EXECUTE_BUTTON_ID = Ext.id();
         this.EDIT_BUTTON_ID = Ext.id();
         this.DELETE_BUTTON_ID = Ext.id();

         this.userFilter = new Ext.form.ComboBox({
            editable: false,
            triggerAction: 'all',
            valueField: 'id',
            displayField: 'logon',
            store: comboUserStore,
            listeners: {
               scope : this,
               'select': this.filterGrid
            },
            pageSize: 2,
            mode: 'remote'
         });

         this.workspaceToolbar = new Ext.Toolbar({
            items : [
               this.adminUtil.createToolbarButton(this.EXECUTE_BUTTON_ID, "report_go.png", this.onExecuteButtonClicked, applicationResources.getProperty("button.execute")), '-',
               this.adminUtil.createToolbarButton(this.EDIT_BUTTON_ID, "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton(this.DELETE_BUTTON_ID, "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-',
               applicationResources.getProperty('admin.userContent.userNameFilter'),
               this.userFilter, '-'
            ]
         });

         comboUserStore.load({scope:this});

         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)

         this.userContentsStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchUserContent.do',
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
               id: 'id',
               fields: [
               {name: 'id', mapping: 'id', type: 'int'},
               {name: 'profileName', mapping: 'profileName'},
               {name: 'createdBy', mapping: 'createdBy'},
               {name: 'createdOn', mapping: 'createdOn'},
               {name: 'lastUpdatedOn', mapping: 'lastUpdatedOn'}
//               {name: 'createdOn', mapping: 'createdOn', type: 'date'},
//               {name: 'lastUpdatedOn', mapping: 'lastUpdatedOn', type: 'date'}
            ]}),
            remoteSort: true,
            sortInfo: {
               field: 'profileName',
               dir: 'ASC'
            }
         });


         //--- custom render function for type field...
         var renderIconFn = function (aValue, aCellMetaData, aRecord)
         {
            var html = '<img alt="icon" src="' + ServerEnvironment.baseUrl + '/images/silkIcons/report_user.png"/>';
            return html;
         };


          //--- custom render function for type field...
         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store
         var cm = new Ext.grid.ColumnModel([
            { id: 'type',
               header: '',
               width: 14,
               renderer: renderIconFn },

            { id: 'id',
               header: 'ID',
               dataIndex: 'id',
               sortable: true,
               width: 20,
               css: 'white-space:normal;text-align:right;' },


            { id: 'profileName',
               header: 'Profile Name',
               dataIndex: 'profileName',
               sortable: true,
               width: 200,
               css: 'white-space:normal;'},

            { id: 'createdBy',
               header: 'Created By',
               dataIndex: 'createdBy',
               sortable: true,
               width: 75,
               css: 'white-space:normal;'},

            {
               id: 'createdOn',
               header: 'Created On',
               dataIndex: 'createdOn',
               sortable: true,
               width: 100,
               renderer: function(aValue, aMetaData, aRecord, aRowIndex, aColIndex, aStore){
                  return aValue;
               }
            },

            { id: 'lastUpdatedOn',
               header: 'Last Updated On',
               dataIndex: 'lastUpdatedOn',
               sortable: true,
               width: 100}

         ]);

         cm.defaultSortable = true;

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            title: applicationResources.getProperty('navMenu.manage.userContent'),
            id: aGridId,
            region:'center',
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.userContentsStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            view: new Ext.grid.GridView({
                  forceFit:true
            }),
            bbar: new Ext.PagingToolbar({
               store: this.userContentsStore,
               displayInfo: true,
               pageSize: UserPreference.itemsPerPage
            })
         });

         this.adminUtil.init(this, this.contentsGrid);

         this.userFilter.setValue(this.SHOW_ALL_ID);

         return this.contentsGrid;
      },

      filterGrid : function(comboBox, record, index)
      {
         var userName = record.data['logon'];
         var userId = record.data.id;
         Adf.manageUserContentUi.userContentsStore.load({
            params: {
               id: userId
            },
            scope:this
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
         Adf.manageUserContentUi.adminUtil.refreshContentsGrid(this.getFetchParams());
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
               ServerEnvironment.baseUrl + "/secure/actions/deleteContentNode.do",
               "profileId");
      },


      /**
       * This method handles the Execute button click. It executes the selected report profiles.
       *
       * @param aButton (Ext.Button) Execute button.
       * @param aEventObject (Ext.EventObject) A button click event.
       */
      onExecuteButtonClicked: function(aButton, aEventObject)
      {
         var nodes = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 30, null);
         if (nodes != null && nodes.length > 0)
         {
            Ext.Msg.wait(applicationResources.getProperty("general.submittingRequest"));

            var nodeIds = [];
            for (var i = 0; i < nodes.length; i++)
            {
               nodeIds.push(nodes[i].data.id);
            }

            RequestUtil.request({
               url: ServerEnvironment.baseUrl + "/secure/actions/ext/executeReports.do",
               params: JsUtil.arrayToUrlParams(nodeIds, "nodeId"),
               method: "POST",
               callback: function (aOptions, aSuccess, aResponse) {

                  Ext.Msg.hide();

                  // Extracting the execution results from response.
                  var response = Ext.decode(aResponse.responseText);

                  // Display failures and error messages.
                  if (!Ext.isEmpty(response.errorMessage))
                  {
                     // If there is 1 report failure and the failure was caused by missing parameters then
                     // the error message will include a prompt to allow the user to edit the parameters. So
                     // the error message needs to be displayed in a confirmation alert.
                     if (!Ext.isEmpty(response.failedReports) &&
                        response.failedReports.length == 1 &&
                        response.failedReports[0].failureReasonCode == response.FailureReasonCodes.MISSING_REQUIRED_PARAMETER)
                     {
                        if (confirm(response.errorMessage))
                        {
                           var windowUrl = ServerEnvironment.contextPath + "/secure/actions/ext/editReiWindow.do?launchNodeId=" + response.failedReports[0].id + "&launchNodeType=" + response.failedReports[0].type;
                           var windowName = ServerEnvironment.windowNamePrefix + "_EditRei_" + response.failedReports[0].id;

                           var geom = new BrowserGeometry();
                           var win = window.open(windowUrl,
                              windowName,
                              "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

                           win.focus();
                        }
                     }
                     else
                     {
                        alert(response.errorMessage);
                     }
                  }


                  // Display any RER messages.
                  if (!Ext.isEmpty(response.displayMessage))
                  {
                     FadeMessageController.getInstance().showFadeMessage(response.displayMessage, 3000);
                  }


                  // Notify the RER Status screen that reports are executing.
                  var executionMessage = Ext.applyIf({type: "reportExecution"}, response);
                  Adf.frameSetUi.eventChannel.publish(executionMessage);


                  // Launch the report into the report viewer if the RER Inputs specify to run the report in the
                  // foreground.
                  if (!Ext.isEmpty(response.rerIdsToLaunchInForeground))
                  {
                     launchReportViewer(response.rerIdsToLaunchInForeground);
                  }


                  // Launch reports in new browser windows.
                  if (!Ext.isEmpty(response.windowsToOpen))
                  {
                     var geom = new BrowserGeometry();
                     for (var i = 0; i < response.windowsToOpen.size(); i++)
                     {
                        var win = window.open(response.windowsToOpen[i],
                           "",
                           "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

                        win.focus();
                     }
                  }
               },

               scope: this
            });
         }
      },


      /**
       * This method handles the Edit button click event. It launches the report profile editor for the selected
       * report profile.
       *
       * @param aButton (Ext.Button) Edit button.
       * @param aEventObject (Ext.EventObject) A button click event.
       */
      onEditButtonClicked: function(aButton, aEventObject)
      {
         var selected = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1, null);
         if (selected != null)
         {
            var aNodeId = selected[0].id;

            var url = ServerEnvironment.contextPath + "/secure/actions/ext/editReiWindow.do?launchNodeId=" + aNodeId + "&launchNodeType=5";

            var windowName = ServerEnvironment.windowNamePrefix + "_EditRei_" + aNodeId;

            var geom = new BrowserGeometry();
            win = window.open(url,
                    windowName,
                    "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
            //                          "width=900,height=700,top=" + geom.top + ",left=" + geom.left + ",menubar=yes,toolbar=yes,scrollbars=no,resizable=yes,status=yes");

            win.focus();
         }

      }

   };
}();


var workspaceUi = Adf.manageUserContentUi;
