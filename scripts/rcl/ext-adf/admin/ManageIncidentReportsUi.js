/**
 * Ext grid definition and form def for ManageIncidentsAction action
 *
 * @author sallman@motio.com
 * @since 3/8/11
 */


Adf.manageIncidentsUi = function()
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

         this.activeFilter = {
//            logon:'',
//            startDate : '',
//            startTime: '',
//            startTimeAmPm: '',
//            endDate: '',
//            endTime: '',
//            endTimeAmPm: '',
//            errorMessage: '',
//            rerId: ''
         };
         this.VIEW_BUTTON_ID = Ext.id();
         this.DOWNLOAD_BUTTON_ID = Ext.id();
         this.DELETE_BUTTON_ID = Ext.id();
         this.CREATE_INCIDENT_BUTTON_ID = Ext.id();
         this.FILTER_BUTTON_ID = Ext.id();

         this.workspaceToolbar = new Ext.Toolbar({
            //manage users only currently supports delete
            items : [
               this.adminUtil.createToolbarButton(this.VIEW_BUTTON_ID, "page_white_edit.png", this.onViewButtonClicked, applicationResources.getProperty('button.reportOutput.view')), '-',
               this.adminUtil.createToolbarButton(this.DOWNLOAD_BUTTON_ID, "page_save.png", this.onDownloadButtonClicked, applicationResources.getProperty('button.admin.manage.download')), '-',
               this.adminUtil.createToolbarButton(this.DELETE_BUTTON_ID, "page_white_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty('button.admin.manage.delete')), '-',
               this.adminUtil.createToolbarButton(this.CREATE_INCIDENT_BUTTON_ID, "page_white_add.png", this.onCreateButtonClicked, applicationResources.getProperty('button.admin.manage.createNewIncident')), '-',
               Ext.apply(this.adminUtil.createToolbarButton(this.FILTER_BUTTON_ID, "actionFilter.gif", this.onFilterButtonClicked, applicationResources.getProperty('button.admin.manage.filterIncidents')), {icon:  ServerEnvironment.baseUrl + "/images/btnFilter.gif"}), '-'
//               , {
//                  text: 'debug',
//                  handler: function(){
//                     RequestUtil.request({
//                        url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/debugIncidents.do',
//                        success: function()
//                        {
//                           'done'
//                        }
//                     });
//                  }
//               }
            ]
         });

         this.mainGridDataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchIncidents.do',
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
               root: 'incidents',
               totalProperty: 'totalCount',
               id: 'incidentId'
            }, [
               {name: 'incidentId', mapping: 'incidentId', type: 'int'},
               {name: 'rerId', mapping: 'rerId', type: 'int'},
               {name: 'logon', mapping: 'logon'},
               {name: 'incidentDate', mapping: 'incidentDate', type: 'date'},
               {name: 'incidentType', mapping: 'incidentType'},
               {name: 'errorMessage', mapping: 'errorMessage'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'incidentId',
               dir: 'ASC'
            }
         });

         //--- custom render function for type field...
         var renderIconFn = function (aValue, aCellMetaData, aRecord)
         {
            var html = '<img alt="icon" src="' + ServerEnvironment.baseUrl + '/images/silkIcons/page_white.png"/>';
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

            { id: 'incidentId',
               header: applicationResources.getProperty('admin.manage.header.id'),
               dataIndex: 'incidentId',
               sortable: true,
               width: 50,
               css: 'white-space:normal;text-align:right;'
            },
            { id: 'logon',
               header: applicationResources.getProperty('admin.manage.header.logon'),
               dataIndex: 'logon',
               sortable: true,
               width: 170
            },
            { id: 'incidentDate',
               header: applicationResources.getProperty('admin.manage.header.date'),
               dataIndex: 'incidentDate',
               sortable: true,
               width: 80,
               renderer: function(aValue, aMetaData, aRecord, aRowIndex, aColIndex, aStore){
                  return aValue.format('m/d/Y');
               }
            },
            { id: 'incidentTime',
               header: applicationResources.getProperty('admin.manage.header.time'),
               dataIndex: 'incidentDate',
               sortable: true,
               width: 70,
               renderer: function(aValue, aMetaData, aRecord, aRowIndex, aColIndex, aStore){
                  return aValue.format('H:i:s');
               }
            },
            { id: 'errorMessage',
               header: applicationResources.getProperty('admin.manage.header.errorMessage'),
               dataIndex: 'errorMessage',
               sortable: true,
               width: 300
            },
            { id: 'rerId',
               header: applicationResources.getProperty('admin.manage.header.rerId'),
               dataIndex: 'rerId',
               sortable: true,
               width: 180
            }
         ]);

         this.pagingToolbar = new Ext.PagingToolbar({
            pageSize: UserPreference.itemsPerPage,
            store: this.mainGridDataStore,
            displayInfo: true,
            displayMsg: applicationResources.getProperty('admin.incident.toolbar.display.message'),
            emptyMsg: applicationResources.getProperty('admin.incident.toolbar.empty.message')
         });

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
            bbar: this.pagingToolbar,
            autoExpandColumn: 'errorMessage'
         });


         //todo may need this for filtering
//         //Needed to get the Pagination toolbar to use the required inputs
//         this.mainGridDataStore.proxy.on('beforeload', function(proxy, params)
//         {
//            params.itemType = Adf.permissionsDialog.nodeType;
//            params.itemId = Adf.permissionsDialog.itemId;
//            params.namespace = Adf.permissionsDialog.namespace;
//            params.canInheritPermissions = Adf.permissionsDialog.canInherit;
//            params.inheritPermissions = Adf.permissionsDialog.isInherit;
//         });

         this.adminUtil.init(this, this.contentsGrid);


         return this.contentsGrid;
      },

      /**
       * returns the params used by the ajax call (based on URL params)
       */
      getFetchParams: function()
      {
         var params = {
            start: 0,
            limit: UserPreference.itemsPerPage
         };
         params = Ext.apply(params, this.activeFilter);
         return params;
      },


      /**
       * refreshes the RER grid
       */
      refreshContentsGrid: function()
      {
         Adf.manageIncidentsUi.adminUtil.refreshContentsGrid(this.getFetchParams());
      },

      onCreateButtonClicked: function(aButton)
      {
         var rerId = '';
         //create incident report on rer id
         Ext.Msg.prompt(applicationResources.getProperty('admin.incident.rerId.input.message.title'),
                        applicationResources.getProperty('admin.incident.rerId.input.message'),
                        function(btn, text)
         {
            if (btn == 'ok')
            {
               rerId = text;
               if (rerId == null || rerId == '')
               {
                  Ext.Msg.alert(applicationResources.getProperty('admin.incident.rerId.message.title'),
                                applicationResources.getProperty('admin.incident.rerId.message'));
                  return;
               }

               location.href = ServerEnvironment.contextPath + "/secure/actions/downloadRerIncident.do?rerId=" + rerId;
            }
         });
      },

      onDownloadButtonClicked: function(aButton)
      {
         var selected = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1, null);

         if (selected)
         {
            if ("incident" == selected[0].data['incidentType'])
            {
               location.href = ServerEnvironment.contextPath + "/secure/actions/downloadIncident.do?incidentId=" + selected[0].id;
            }
            else
            {
               location.href = ServerEnvironment.contextPath + "/secure/actions/downloadRerIncident.do?rerId=" + selected[0].data['rerId'];
            }
         }
      },

      onViewButtonClicked: function(aButton)
      {
         //display big dialog with full error in it
         var selected = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1, null);
         var title;
         var url;

         if(selected)
         {
            if('incident' == selected[0].data['incidentType'])
            {
               var id = selected[0].data['incidentId'];
               title = "Incident Details for ID [" + id + "]";
               url = ServerEnvironment.baseUrl + "/secure/actions/ext/getIncidentDetails.do?incidentId=" + id;
            }
            else
            {
               var id = selected[0].data['incidentId'];
               title = "Incident Details for ID [" + id + "]";
               url = ServerEnvironment.baseUrl + "/secure/actions/ext/getIncidentDetails.do?rerErrorId=" + id;
            }

            this.createIncidentDetailsWindow(title, url);
         }

      },

      onDeleteButtonClicked: function(aButton)
      {
         var selectedForDelete = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1, null);
         var itemIds = '';

         if(selectedForDelete)
         {
            if('incident' == selectedForDelete[0].data['incidentType'])
            {
               itemIds += "incidentId=" + selectedForDelete[0].data['incidentId'];
            }
            else
            {
               itemIds += "rerErrorId=" + selectedForDelete[0].data['incidentId']
            }
         }

         Ext.MessageBox.confirm(applicationResources.getProperty("general.dialog.confirmTitle"),
               applicationResources.getProperty("general.confirmDeletions"),
               function (aButton)
               {
                  if ('yes' == aButton)
                  {
                     Adf.manageIncidentsUi.deleteContentNodes(itemIds);
                  }
               });
      },

      deleteContentNodes: function (aItemIds)
      {
         var url = ServerEnvironment.baseUrl + "/secure/actions/admin/ext/deleteIncident.do?" + aItemIds;

         RequestUtil.request({
            url: url,
            method: "POST",
            callback: function (aOptions, aSuccess, aResponse)
            {
               this.refreshContentsGrid();
               if (aItemIds != '')
               {
                  Ext.Msg.alert(applicationResources.getProperty('admin.incident.delete.message.title'),
                                applicationResources.getProperty('admin.incident.delete.message'));
               }
            },
            scope: this
         }, false);
      },

      createIncidentDetailsWindow: function(aTitle, aUrl)
      {
         this.editItemForm = new Adf.AdfFormPanel({
            frame:true,
            title: aTitle,
            bodyStyle:'padding:5px 5px 0',
            width: 510,
            layout: 'fit',
            hideLabels: true,
            items: [
               {
                  name: 'incidentXml',
                  xtype:'textarea',
                  height: 'auto',
                  width:'auto'
               }
            ],
            buttons: [
               {
                  text: applicationResources.getProperty('button.close'),
                  handler:function()
                  {
                     editDestinationWin.close();
                  }
               }
            ]
         });

         // create and show window
         var editDestinationWin = new Ext.Window({
            id:'showIncidentWindow'
            ,title: applicationResources.getProperty('admin.incident.details.title')
            ,layout:'fit'
            ,width:540
            ,height: 500
            ,closable:true
            ,modal:true
            ,border:false
            ,items:this.editItemForm
            ,closeAction:'close'
         });

         this.loadFormData(this.editItemForm, aUrl);

         editDestinationWin.show();
      },

      loadFormData: function(aFormPanel, aUrl)
      {
         aFormPanel.getForm().load({
            scope:this,
            url: aUrl
         });
      },


      /**
       * This method handles the Filter button click event. It will load and show the Incident Filter dialog.
       *
       * @param aButton (Ext.Button) Filter button.
       * @param aEventObject (Ext.EventObject) A button click event.
       */
      onFilterButtonClicked: function(aButton, aEventObject)
      {

         this.filterDialog = new Adf.ManageIncidentFilterDialog({});
         this.filterDialog.on('save', this.onFilterSaved, this);
         this.filterDialog.show();
      },


      /**
       * This method handles the save event from the Incident Filter dialog. It sets the current filter and reloads
       * the incidents grid when filtered incident rows.
       *
       * @param aFilter A filter object used to filter the rows in the Incidents grid.
       */
      onFilterSaved: function(aFilter)
      {
         this.activeFilter = aFilter;

         // Refresh the grid to display a new list of incidents based on the filter.
         this.mainGridDataStore.load({
            params: this.getFetchParams(),
            scope:this
         });
      }
   };
}();


/**
 * This dialog provides functionality to filter the rows in the incidents grid.
 */
Adf.ManageIncidentFilterDialog = Ext.extend(Ext.Window, {

   /**
    * Constructor.
    *
    * @param aConfig A Ext.Window config object.
    */
   constructor: function(aConfig)
   {
      this.addEvents({
         /**
          * This event is fired when the OK button is pressed. A filter object is passed along with the event.
          * The values are all conditional, the properties in the filter object will only be defined if the
          * user added a value.
          *
          * event_callback: function(aFilter) {
          *
          * }
          *
          * aFilter: {
          *    logon:'',
          *    startDate: '',
          *    startTime: '',
          *    startTimeAmPm: '',
          *    endDate: '',
          *    endTime: '',
          *    endTimeAmPm: '',
          *    errorMessage: '',
          *    rerId: ''
          * };
          *
          */
         save: true,

         /**
          * This event is fired when the Cancel button is pressed.
          *
          * event_callback: function(){
          *
          * }
          */
         cancel: true
      });

      this.logonField = new Ext.form.TextField({
         fieldLabel: applicationResources.getProperty('dialogs.filter.logon'),
         name: 'logon'
      });

      this.startDateField = new Ext.form.DateField({
         fieldLabel: applicationResources.getProperty('dialogs.filter.startDate'),
         name: 'startDate'
      });

      this.startTimeField = new Ext.form.TimeField({
         fieldLabel: applicationResources.getProperty('dialogs.filter.startTime'),
         name: 'startTime'
      });

      this.endDateField = new Ext.form.DateField({
         fieldLabel: applicationResources.getProperty('dialogs.filter.endDate'),
         name: 'endDate'

      });

      this.endTimeField = new Ext.form.TimeField({
         fieldLabel: applicationResources.getProperty('dialogs.filter.endTime'),
         name: 'endTime'
      });

      this.errorMessageField = new Ext.form.TextField({
         fieldLabel: applicationResources.getProperty('dialogs.filter.errorMessage'),
         name: 'errorMessage'
      });

      this.rerIdField = new Ext.form.NumberField({
         fieldLabel: applicationResources.getProperty('dialogs.filter.rer'),
         name: 'rerId',
         allowDecimals: false,
         allowNegative: false
      });

      this.okButton = new Ext.Button({
         text: applicationResources.getProperty('button.Ok')
      });

      aConfig = Ext.apply({
         title: applicationResources.getProperty('admin.incident.filter.title'),
         modal: true,
         height: 400,
         width: 550,
         layout: 'border',
         items: [{
            xtype: 'form',
            region: 'center',
            labelWidth: 260,
            bodyStyle: {
               padding: '10px'
            },
//               labelAlign: 'top',
            items: [
               this.logonField,
               {
                  xtype: 'fieldset',
                  title: applicationResources.getProperty('dialogs.filter.dates'),
                  labelWidth: 100,
                  items: [
                     this.startDateField,
                     this.startTimeField,
                     this.endDateField,
                     this.endTimeField
                  ]
               },
               this.errorMessageField,
               this.rerIdField
            ]
         }],
         buttons: [{
            text: applicationResources.getProperty('button.Ok'),
            scope: this,
            handler: this.onOkButtonClicked
         }, {
            text: applicationResources.getProperty('button.Cancel'),
            scope: this,
            handler: this.onCancelButtonClicked
         }]
      }, aConfig);

      Adf.ManageIncidentFilterDialog.superclass.constructor.call(this, aConfig);
   },


   /**
    * This method handles the OK button click event. It will validate the filter data and pass the data back to the
    * calling UI object and then close the Incident Filter dialog.
    *
    * @param aButton (Ext.Button) OK button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onOkButtonClicked: function(aButton, aEventObject)
   {
      var isValid = true;

      // todo: add validation.

      if (isValid)
      {
         var filter = {
//            logon:'',
//            startDate : '',
//            startTime: '',
//            startTimeAmPm: '',
//            endDate: '',
//            endTime: '',
//            endTimeAmPm: '',
//            errorMessage: '',
//            rerId: ''
         };


         if (!Ext.isEmpty(this.logonField.getValue()))
         {
            filter.logon = this.logonField.getValue();
         }

         if (!Ext.isEmpty(this.startDateField.getValue()))
         {
            filter.startDate = this.startDateField.getValue().format('Y-m-d');
         }

         if (!Ext.isEmpty(this.startTimeField.getValue()))
         {
            var startTime = Date.parseDate(this.startTimeField.getValue(), 'g:i A');
            filter.startTime = startTime.format('g:i');
            filter.startTimeAmPm = startTime.format('A');
         }

         if (!Ext.isEmpty(this.endDateField.getValue()))
         {
            filter.endDate = this.endDateField.getValue().format('Y-m-d');
         }

         if (!Ext.isEmpty(this.endTimeField.getValue()))
         {
            var endTime = Date.parseDate(this.endTimeField.getValue(), 'g:i A');
            filter.endTime = endTime.format('g:i');
            filter.endTimeAmPm = endTime.format('A');
         }

         if (!Ext.isEmpty(this.errorMessageField.getValue()))
         {
            filter.errorMessage = this.errorMessageField.getValue();
         }

         if (!Ext.isEmpty(this.rerIdField.getValue()))
         {
            filter.rerId = this.rerIdField.getValue();
         }

         // Pass the data back to the calling UI object.
         this.fireEvent('save', filter);

         // Close the dialog.
         this.close();
      }
   },


   /**
    * This method handles the Cancel button click event. It closes the Incident Filters Dialog.
    *
    * @param aButton (Ext.Button) Cancel button.
    * @param aEventObject (Ext.EventObject) A button click event.
    */
   onCancelButtonClicked: function(aButton,aEventObject)
   {
      this.fireEvent('cancel');
      this.close();
   }
});

var workspaceUi = Adf.manageIncidentsUi;
