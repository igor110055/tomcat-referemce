/**
 * Ext grid definition for ManageSystemJobs action
 *
 * @author sallman@motio.com
 * @since 2/8/11
 */

Adf.manageSystemJobsUi = function()
{
   ////////////////////////////////////////////////////////////////////////////
   // Private
   ////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////
   // Public
   ////////////////////////////////////////////////////////////////////////////
   return {


      init: function()
      {
         this.adminUtil = new Adf.AdminScreenUtils();
         this.adminUtil.setScope(this);
      },

      setAdminPanel: function(aPanel)
      {
         this.adminPanel = aPanel;
      },


      getAdminGrid : function(aGridId)
      {
         this.init();
         this.gridId = aGridId;

         this.workspaceToolbar = new Ext.Toolbar({
            //manage users only currently supports delete
            items : [
               {text: applicationResources.getProperty("browseSchedules.buttonBar.refresh"), handler: this.onRefreshButtonClicked ,scope: this, icon:  ServerEnvironment.baseUrl + "/images/silkIcons/arrow_rotate_clockwise.png"}, '-',


               this.adminUtil.createToolbarButton("manageSystemJobsUiEdit", "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.adminUtil.createToolbarButton("manageSystemJobsUiRun", "report_go.png", this.onRunButtonClicked, applicationResources.getProperty('button.Run')), '-',
               this.adminUtil.createToolbarButton("manageSystemJobsUiRunAll", "report_go.png", this.onRunAllButtonClicked, applicationResources.getProperty('button.RunAll')), '-'
            ]
         });

         this.mainGridDataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/admin/ext/fetchSystemJobs.do',
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
               id: 'name'
            }, [
               {name: 'jobName', mapping: 'jobName'},
               {name: 'name', mapping: 'name'},
               {name: 'nextFireTime', mapping: 'nextFireTime'},
               {name: 'previousFireTime', mapping: 'previousFireTime'},
               {name: 'lastFinishedTime', mapping: 'lastFinishedTime'}
            ]),
            remoteSort: true,
            sortInfo: {
               field: 'jobName',
               dir: 'ASC'
            }
         });



         //--- custom render function for type field...
         var renderIconFn = function (aValue, aCellMetaData, aRecord)
         {
            return '<img alt="icon" src="' + ServerEnvironment.baseUrl + '/images/silkIcons/report.png"/>';
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
            { id: 'jobName',
               header: applicationResources.getProperty('admin.manage.header.jobName'),
               dataIndex: 'jobName',
               width: 250,
               sortable: true
            },
            { id: 'name',
               header: applicationResources.getProperty('admin.manage.header.triggerName'),
               dataIndex: 'name',
               width: 200,
               sortable: true
            },
            { id: 'nextFireTime',
               header: applicationResources.getProperty('admin.manage.header.nextFire'),
               dataIndex: 'nextFireTime',
               width: 200,
               sortable: true
            },
            { id: 'previousFireTime',
               header: applicationResources.getProperty('admin.manage.header.previousFire'),
               dataIndex: 'previousFireTime',
               width: 200,
               sortable: true
            },
            { id: 'lastFinishedTime',
               header: applicationResources.getProperty('admin.manage.header.lastFinishedTime'),
               dataIndex: 'lastFinishedTime',
               width: 200,
               sortable: true
            }
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
            autoExpandColumn: 'jobName',
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
       * refreshes the RER grid
       */
      refreshContentsGrid: function()
      {
         Adf.manageSystemJobsUi.adminUtil.refreshContentsGrid({});
      },

      /**
       * the refresh button was clicked
       */
      onRefreshButtonClicked: function (aButton)
      {
         this.refreshContentsGrid();
      },

      onRunButtonClicked: function(aButton)
      {
         var selected = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1, null);
         var me = this;
         if (!Ext.isEmpty(selected))
         {
            var triggerName = selected[0].id;

            var url = ServerEnvironment.baseUrl + "/secure/actions/admin/ext/runSystemJob.do";

            RequestUtil.request({
               url: url,
               success: function(resp)
               {
                  var jsonResponse = Ext.util.JSON.decode(resp.responseText);

                  if(jsonResponse['success'])
                  {
                     Ext.Msg.alert(applicationResources.getProperty('admin.systemJobs.title.success'),
                                   applicationResources.getProperty('admin.systemJobs.jobStarted') + " [" + triggerName + "]");
                  }
                  else
                  {
                     Ext.Msg.alert(applicationResources.getProperty('admin.systemJobs.title.failed'),
                                   jsonResponse['errorMessage']);
                  }
                  me.refreshContentsGrid();
               },
               params: { triggerName: triggerName }
            });
         }
      },

      onRunAllButtonClicked: function(aButton)
      {
         var url = ServerEnvironment.baseUrl + "/secure/actions/admin/ext/runAllSystemJobs.do";
         var me = this;
         RequestUtil.request({
            url: url,
            success: function(resp)
            {
               var jsonResponse = Ext.util.JSON.decode(resp.responseText);

               if(jsonResponse['success'])
               {
                  Ext.Msg.alert(applicationResources.getProperty('admin.systemJobs.title.success'),
                     applicationResources.getProperty('admin.systemJobs.allJobsStarted'));
               }
               else
               {
                  Ext.Msg.alert(applicationResources.getProperty('admin.systemJobs.title.failed'),
                     jsonResponse['errorMessage']);
               }
               me.refreshContentsGrid();
            }
         });
      },

      onEditButtonClicked: function(aButton)
      {
         this.showEditWindow(applicationResources.getProperty('admin.systemJobs.title.editor'), true);
      },

      showEditWindow: function(aTitle, loadData)
      {
         var operation = "edit";
         if(!loadData)
         {
            operation = "add";
         }

         this.editItemForm = new Adf.AdfFormPanel({
            labelWidth: 120, // label settings here cascade unless overridden
            url:ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveSystemJob.do",
            region: 'center',
            id: 'editItemForm',
            bodyStyle:'padding:5px 5px 0',
            height: 300,
            width: 600,
            region: 'center',
            defaults: {width: 350},
            defaultType: 'textfield',
            items: [
               {
                  xtype: 'hidden',
                  name: 'operation',
                  value: operation
               },
               {
                  xtype: 'hidden',
                  fieldLabel: applicationResources.getProperty('admin.systemJobs.field.triggerName'),
                  name: 'triggerName'
               },
               {
                  id: 'TriggerNameDisplayField',
                  xtype: 'displayfield',
                  fieldLabel: applicationResources.getProperty('admin.systemJobs.field.triggerName')
               },
               {
                  fieldLabel: applicationResources.getProperty('admin.systemJobs.field.minute'),
                  name: 'minute',
                  allowBlank:false
               },
               {
                  fieldLabel: applicationResources.getProperty('admin.systemJobs.field.hour'),
                  name: 'hour',
                  allowBlank:false
               },
               {
                  fieldLabel: applicationResources.getProperty('admin.systemJobs.field.day'),
                  name: 'day',
                  allowBlank:false
               },
               {
                  fieldLabel: applicationResources.getProperty('admin.systemJobs.field.month'),
                  name: 'month',
                  allowBlank:false
               },
               {
                  fieldLabel: applicationResources.getProperty('admin.systemJobs.field.weekday'),
                  name: 'weekday',
                  allowBlank:false
               },
               {
                  xtype: 'compositefield',
                  hidden: true,
                  hideLabel: true,
                  id: 'daysOldComposite',
                  items:[
                     {
                        xtype:'label',
                        text: applicationResources.getProperty('admin.systemJobs.field.expiryDays'),
                        width:120
                     },
                     {
                        xtype:'textfield',
                        name: 'daysOld'
                     }
                  ]
               }


            ],

            buttons: [
               {
                  text: applicationResources.getProperty('button.Save'),
                  scope: this,
                  handler:function()
                  {
                     this.editItemForm.getForm().submit({
                        url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/saveSystemJob.do",
                        waitMsg: applicationResources.getProperty('profileWizard.saving'),
                        scope: this,
                        success: function()
                        {
                           this.refreshContentsGrid();
                           editCapabilityWin.close();
                        }
                     });
                  }
               },
               {
                  text: applicationResources.getProperty('button.Cancel'),
                  handler:function()
                  {
                     editCapabilityWin.close();
                  }
               }
            ]
         });

         // create and show window
         var editCapabilityWin = new Ext.Window({
            id:'editSystemJobAdf'
            ,title: applicationResources.getProperty('admin.systemJobs.title.editor')
            ,layout:'fit'
            ,width:570
            ,height:560
            ,closable:true
            ,modal:true
            ,border:false
            ,layout: 'border'
            ,items:[this.editItemForm, new Adf.ManageSystemCronDetailsPanel({region:'south'})]
            ,closeAction:'close'
         });

         var isLoading = this.loadFormData(this.editItemForm, loadData);

         if (isLoading)
         {
            editCapabilityWin.show();
         }
      },

      loadFormData: function(aFormPanel, aEditData)
      {
         var isLoading = false;

         if(!aEditData)
         {
            Ext.Msg.alert(applicationResources.getProperty('admin.systemJobs.illegal.operation.title'),
               applicationResources.getProperty('admin.systemJobs.illegal.operation.message'));
         }
         else
         {
            var selected = this.adminUtil.getNodesForSelectedRows(this.contentsGrid, 1, 1, null);

            if (!Ext.isEmpty(selected))
            {
               var aNodeId = selected[0].id;

               aFormPanel.getForm().load({
                  url: ServerEnvironment.baseUrl + "/secure/actions/admin/ext/editSystemJob.do",
                  scope: this,
                  params: {
                     triggerName: aNodeId
                  },
                  success: function(form, action)
                  {
                     this.editItemForm.findById('TriggerNameDisplayField').setValue(action.result.data.triggerName);
                     if(action.result.data['triggerName'] == "triggerForCleanupOldIncidentsJob")
                     {
                        var daysOldField = this.editItemForm.getForm().findField("daysOldComposite");
                        daysOldField.show();
                     }
                  }
               });

               isLoading = true;
            }
         }

         return isLoading;
      }
   };
}();


Adf.ManageSystemCronDetailsPanel = Ext.extend(Ext.Panel, {

   desc1: applicationResources.getProperty('admin.systemJobs.cron.syntax1'),
   desc2: applicationResources.getProperty('admin.systemJobs.cron.syntax2'),

   fieldValues: {
      data: [{
         fieldName: applicationResources.getProperty('admin.systemJobs.cron.minutes'),
         values: applicationResources.getProperty('admin.systemJobs.cron.minutes.values'),
         specialValues: applicationResources.getProperty('admin.systemJobs.cron.minutes.specialValues')
      }, {
         fieldName: applicationResources.getProperty('admin.systemJobs.cron.hours'),
         values: applicationResources.getProperty('admin.systemJobs.cron.hours.values'),
         specialValues: applicationResources.getProperty('admin.systemJobs.cron.hours.specialValues')
      }, {
         fieldName: applicationResources.getProperty('admin.systemJobs.cron.days'),
         values: applicationResources.getProperty('admin.systemJobs.cron.days.values'),
         specialValues: applicationResources.getProperty('admin.systemJobs.cron.days.specialValues')
      }, {
         fieldName: applicationResources.getProperty('admin.systemJobs.cron.months'),
         values: applicationResources.getProperty('admin.systemJobs.cron.months.values'),
         specialValues: applicationResources.getProperty('admin.systemJobs.cron.months.specialValues')
      }, {
         fieldName: applicationResources.getProperty('admin.systemJobs.cron.weekDays'),
         values: applicationResources.getProperty('admin.systemJobs.cron.weekDays.values'),
         specialValues: applicationResources.getProperty('admin.systemJobs.cron.weekDays.specialValues')
      }]
   },

   constructor: function(aConfig)
   {
      this.cronValuesGrid = new Ext.grid.GridPanel({
         title: this.desc1 + '<br/>' + this.desc2,
         region: 'center',
         xtype: 'grid',
         height: 260,
         width: 400,
         enableHdMenu: false,
         enableColumnMove: false,
         enableDragDrop: false,
         loadMask: true,
         stripeRows: true,

         store: new Ext.data.JsonStore({
            root: 'data',
            id: 'fieldName',
            fields: [
               {name: 'fieldName', mapping: 'fieldName'},
               {name: 'values', mapping: 'values'},
               {name: 'specialValues', mapping: 'specialValues'}
            ]
         }),


         colModel: new Ext.grid.ColumnModel({
            defaults: {
               width: 120,
               sortable: true
            },
            columns: [{
               id: 'fieldName',
               header: applicationResources.getProperty('admin.systemJobs.cron.header.fieldName'),
               width: 100,
               sortable: true,
               dataIndex: 'fieldName'
            }, {
               id: 'values',
               header: applicationResources.getProperty('admin.systemJobs.cron.header.values'),
               width: 100,
               sortable: true,
               dataIndex: 'values'
            }, {
               id: 'specialValues',
               header: applicationResources.getProperty('admin.systemJobs.cron.header.specialValues'),
               width: 100,
               sortable: true,
               dataIndex: 'specialValues'
            }]
         }),
         autoExpandColumn: 'specialValues'

      });

      aConfig = Ext.apply({
         title: applicationResources.getProperty('admin.systemJobs.cron.title'),
         layout: 'border',
         height: 290,
         width: 500,
         frame: true,
         border: false,

         items: [{
            region: 'north',
            height: 10,
            border: false
         }, {
            region: 'west',
            width: 15,
            border: false
         }, {
            region: 'south',
            height: 10,
            border: false
         }, {
            region: 'east',
            width: 15,
            border: false
         }, this.cronValuesGrid
         ]
      }, aConfig);

      Adf.ManageSystemCronDetailsPanel.superclass.constructor.call(this, aConfig);

      this.cronValuesGrid.getStore().loadData(this.fieldValues);
   }



});

var workspaceUi = Adf.manageSystemJobsUi;
