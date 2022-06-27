
/**
 * This is the UI controller for the "Browse RERs" screen.
 */
Adf.browseRersUi = function(){
   ////////////////////////////////////////////////////////////////////////////
   // Private
   ////////////////////////////////////////////////////////////////////////////


   ////////////////////////////////////////////////////////////////////////////
   // Public
   ////////////////////////////////////////////////////////////////////////////
   return {
      autoRefreshFrequency : 7,
      refreshInProgress : false,

      /**
       * initialize the UI
       */
      init : function(){

         this.eventSubscription = Adf.frameSetUi.eventChannel.subscribe("BrowseRersUi", function(aEvent)
         {
            if(aEvent.type == "reportExecution")
            {
               Adf.browseRersUi.shouldReload = true;

               // Monitor the reports that will be displayed in the report viewer once they are completed.
               if (!Ext.isEmpty(aEvent.rerIdsToAutoView) && aEvent.rerIdsToAutoView.length)
               {
                  for (var i = 0; i < aEvent.rerIdsToAutoView.length; i++)
                  {
//                     alert('adding to watch list - '+ aEvent.rerIdsToAutoView[i]);
                     Adf.browseRersUi.addRerToWatchlist(aEvent.rerIdsToAutoView[i]);
                  }
               }
            }
            else if (aEvent.type == 'userPreferenceChanged')
            {
               if (aEvent.itemsPerPageChanged || aEvent.dateFormatChanged || aEvent.timeFormatChanged)
               {
                  Adf.browseRersUi.shouldReload = true;
               }
            }
         });
         Adf.browseRersUi.installRerWatchListMonitor();

         this.screenUtil = new Adf.AdminScreenUtils();
         this.screenUtil.setScope(this);
         ///////////////////////////
         //--- Toolbar...
         ///////////////////////////

         this.currentParams = JsUtil.substringAfterFirst(document.location.href, "?");

         this.VIEW_BUTTON_ID = Ext.id();
         this.EMAIL_BUTTON_ID = Ext.id();
         this.DELETE_BUTTON_ID = Ext.id();
         this.CANCEL_BUTTON_ID = Ext.id();
         this.RE_EXECUTE_BUTTON_ID = Ext.id();
         this.RE_PROMPT_BUTTON_ID = Ext.id();
         this.FILTER_PROMPT_BUTTON_ID = Ext.id();
         this.DEBUG_BUTTON_ID = Ext.id();

         var toolbarItems = [
            this.screenUtil.createToolbarButton(this.VIEW_BUTTON_ID, "report_magnify.png", this.validateLaunchInfo(this.onViewButtonClicked), applicationResources.getProperty("button.reportOutput.view")), '-',
            this.screenUtil.createToolbarButton(this.EMAIL_BUTTON_ID, "email_go.png", this.validateLaunchInfo(this.onEmailButtonClicked, this), applicationResources.getProperty("button.reportOutput.email")), '-',
            this.screenUtil.createToolbarButton(this.DELETE_BUTTON_ID, "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.reportOutput.delete")), '-',
            this.screenUtil.createToolbarButton(this.CANCEL_BUTTON_ID, "stop.png", this.onCancelButtonClicked, applicationResources.getProperty("button.reportOutput.cancel")),'-',
            this.screenUtil.createToolbarButton(this.RE_EXECUTE_BUTTON_ID, "report_go.png", this.validateLaunchInfo(this.onReExecuteButtonClicked), applicationResources.getProperty("button.reExecute")), '-',
            this.screenUtil.createToolbarButton(this.RE_PROMPT_BUTTON_ID, "report_edit.png", this.onRePromptButtonClicked, applicationResources.getProperty("button.rePrompt")),'-',
            this.screenUtil.createToolbarButton(this.FILTER_PROMPT_BUTTON_ID, "magnifier.png", this.onFilterButtonClicked, applicationResources.getProperty("button.admin.manage.filterReportInstances"))
         ];
         if (ServerEnvironment.isAllowedDebugRers)
         {
            toolbarItems.push('-');
            toolbarItems.push(this.screenUtil.createToolbarButton(this.DEBUG_BUTTON_ID, "bug.png", this.onDebugButtonClicked, applicationResources.getProperty('button.debug')));
         }

         this.workspaceToolbar = new Ext.Toolbar({
            items: toolbarItems
         });
         //--- refresh button is only an icon...
         //         this.workspaceToolbar.add({cls: 'x-btn-icon',id: "refresh", handler:  function (aButton){ Adf.browseRersUi.onRefreshButtonClicked(aButton); },scope: this, icon:  ServerEnvironment.baseUrl + "/images/bbar_icons/" + 'actionRefresh.gif'}, '-');

         var store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/ext/fetchRers.do'
            }),

            // create reader that reads the RER records
            reader: new Ext.data.JsonReader({
               root: 'rerSummaries',
               totalProperty: 'totalCount',
               id: 'rerId'
            }, [
               {name: 'rerId', mapping: 'rerId', type: 'int'},
               {name: 'profileName', mapping: 'profileName'},
               {name: 'userName', mapping: 'userName'},
               {name: 'status', mapping: 'status'},
               {name: 'formatStartTime', mapping: 'formatStartTime'}
            ]),
            // turn on remote sorting
            remoteSort: true
         });
         store.setDefaultSort('rerId', 'DESC');

         //--- custom render function for type field...
         // pluggable renders
         function renderStatusFn (aValue) {
            var statusCode = aValue;
            var rerStatusCssClass;

            if (statusCode == -2)
               rerStatusCssClass = "rerCancelled";
            else if (statusCode < 0)
               rerStatusCssClass = "rerFailed";
            else if (statusCode == ReportExecutionStatusEnum.FINISHED.value)
                  rerStatusCssClass = "rerFinished";
               else
                  rerStatusCssClass = "rerInProgress";

            var statusString = rerStatusStrings['' + statusCode];

            return '<span class="' + rerStatusCssClass + '">' + statusString + '</span>';
         }


         //--- custom render function for type field...
         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store
         var cm = new Ext.grid.ColumnModel([
            {
               header: applicationResources.getProperty("reportOutputs.header.id"),
               dataIndex: 'rerId',
               width: 50,
               css: 'white-space:normal;',
               sortable:true
            },
            {
               id: 'profileName', // id assigned so we can apply custom css (e.g. .x-grid-col-profileName b { color:#333 })
               header: applicationResources.getProperty("reportOutputs.header.reportProfileName"),
               dataIndex: 'profileName',
               css: 'white-space:normal;',
               sortable:true
            },{
               id: 'status',
               header: applicationResources.getProperty("reportOutputs.header.status"),
               dataIndex: 'status',
               width: 110,
               renderer: renderStatusFn,
               sortable:true
            },{
               id: 'last',
               header: applicationResources.getProperty("reportOutputs.header.executionTime"),
               dataIndex: 'formatStartTime',
               width: 138,
               sortable:true
            },
            {
               header: applicationResources.getProperty("reportOutputs.header.user"),
               dataIndex: 'userName',
               width: 87,
               sortable:true
            }]);

         cm.defaultSortable = true;

         var gridPageSize = UserPreference.getItemsPerPage();

         //todo - The PagingToolbar refresh button doesn't apply the 'Last X hours' time limit param
         this.paging = new Ext.PagingToolbar({
            pageSize: gridPageSize,
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying Report Execution Requests {0} - {1} of {2}',
            emptyMsg: "Report Execution Requests to display"
         });


         this.rerFilterDisplay = new Ext.Panel({
            height: 25,
            width: '100%',
            hidden: true
         });

         // create the Layout (including the data grid)
         this.rerGrid = new Ext.grid.GridPanel({
            flex: 1,
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: store,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            bbar:this.paging,
            autoExpandColumn: 'profileName'
         });

         this.rerGridPanel = new Ext.Panel({
            region: 'center',
            layout: {type:'vbox', align: 'stretch'},
            border: false,
            items: [this.rerFilterDisplay, this.rerGrid]
         });

         this.rerGrid.on('rowdblclick', this.validateLaunchInfo(this.viewDoubleClickedRer), this);

         this.propertiesPanel = new Ext.Panel({
            title: applicationResources.getProperty("propertiesPanel.title.properties"),
            region : 'south',
            layout: 'card',
            items: [{html: applicationResources.getProperty("propertiesPanel.blankProperties"), border: false}],
            activeItem: 0,
            split: true,
            height:200,
            autoScroll : true,
            collapsible :true
         });

         this.uiObjects = [this.rerGridPanel, this.propertiesPanel];

         this.listeners = {
            activate: function()
            {
               if(Adf.browseRersUi.shouldReload)
               {
                  Adf.browseRersUi.rerGrid.store.load({
                     // Parameters were moved to the store's beforeload event.
                     callback:Adf.browseRersUi.installCallBackIfRersAreStillInProgress,
                     scope:Adf.browseRersUi
                  });
                  Adf.browseRersUi.shouldReload = false;
               }
            }
         };

         //Needed to get the Pagination toolbar to use the appropriate number of days filter
         store.proxy.on('beforeload', function(proxy, params) {
            // Adding parameters.
            Ext.applyIf(params, Adf.browseRersUi.getFetchParams());
         });

         store.load({
            // Parameters were moved to the store's beforeload event.
            callback:this.installCallBackIfRersAreStillInProgress,
            scope:this
         });

         // render it
         this.rerGrid.on({
            'rowclick': {
               fn: this.onRerGridSelectionChange,
               scope:this
            }
         });

         this.screenUtil.init(this, this.rerGrid);

         UserPreference.on('itemsperpagechanged', this.onItemsPerPageChanged, this);
      },

      /**
       * callback for when a grid row is selcted
       */
      onRerGridSelectionChange: function() {
         var selected = this.rerGrid.getSelectionModel().getSelections();

         if (!selected || selected.length == 0)
         {
            this.updatePropertiesCard(new Ext.Panel({html: applicationResources.getProperty("propertiesPanel.blankProperties"), border: false}));
         }

         if (selected.length == 1)
         {
            RequestUtil.request({
               url: ServerEnvironment.baseUrl + "/secure/actions/ext/getRerDetails.do",
               params: {
                  rerId: selected[0].data.rerId
               },
               scope: this,
               success: function(aResponse)
               {
                  var rerDetails = Ext.decode(aResponse.responseText);

                  var generalItems = [{
                     xtype: "displayfield",
                     labelSeparator: "",
                     fieldLabel: applicationResources.getProperty("propertiesPanel.label.reportName"),
                     value: "<b>" + rerDetails.reportName + "<b>"
                  }];

                  if(rerDetails.profileName)
                  {
                     generalItems.push({
                        xtype: "displayfield",
                        labelSeparator: "",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.label.reportProfileName"),
                        value: "<b>" + rerDetails.profileName + "<b>"
                     });
                  }

                  var generalFieldSet = {
                     xtype: "fieldset",
                     title: applicationResources.getProperty("propertiesPanel.title.general"),
                     columnWidth: 0.5,
                     height: 90,
                     style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
                     defaults: {
                        style: "font-size:11px;padding:0px;",
                        labelStyle: "font-size:11px;padding:0px;"
                     },
                     items: generalItems
                  };

                  var statusFieldSet = {
                     xtype: "fieldset",
                     title: applicationResources.getProperty("propertiesPanel.title.status"),
                     columnWidth: 0.5,
                     height: 90,
                     style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
                     defaults: {
                        style: "font-size:11px;padding:0px;",
                        labelStyle: "font-size:11px;padding:0px;"
                     },
                     items: [{
                        xtype: "displayfield",
                        labelSeparator: "",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.label.status"),
                        value: "<b>" + applicationResources.getProperty(rerDetails.status.displayProperty) + "<b>"
                     },{
                        xtype: "displayfield",
                        labelSeparator: "",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.label.startTime"),
                        value: "<b>" + rerDetails.startTime + "<b>"
                     },{
                        xtype: "displayfield",
                        labelSeparator: "",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.label.endTime"),
                        value: (rerDetails.endTime ? "<b>" + rerDetails.endTime + "<b>" : "--")
                     }]
                  };

                  var parametersStore = new Ext.data.GroupingStore({
                     groupField: "name",
                     reader: new Ext.data.JsonReader({fields: ["name", "displayText"]}),
                     data: rerDetails.parameterSet
                  });

                  var parametersFieldSet = {
                     xtype: "fieldset",
                     title: applicationResources.getProperty("propertiesPanel.title.parameters"),
                     columnWidth: 0.5,
                     height: 478,
                     style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
                     defaults: {
                        style: "font-size:11px;"
                     },
                     items: [new Ext.grid.GridPanel({
                        height: 423,
                        autoScroll: true,
                        store: parametersStore,
                        columns: [
                           {header: applicationResources.getProperty("propertiesPanel.th.parameterName"), dataIndex: "name", width: 150},
                           {header: applicationResources.getProperty("propertiesPanel.th.parameterValues"), width: 300, dataIndex: "displayText"}
                        ],
                        view: new Ext.grid.GroupingView({
                           groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "' + applicationResources.getProperty("propertiesPanel.th.parameterValues") + '" :"' + applicationResources.getProperty("profileWizard.filters.value") + '"]})'
                        })
                     })]
                  };

                  var outputsStore = new Ext.data.JsonStore({
                     fields: ["outputFormat", "compressedSizeInKb", "uncompressedSizeInKb"]
                  });
                  outputsStore.loadData(rerDetails.outputSummaries);

                  var sizeRenderer = function(aSize)
                  {
                     return Ext.util.Format.number(aSize, '0,000') + " KB";
                  };

                  var renderViewLink = function(aOutputFormat)
                  {
                     return "<a href='#' onclick='launchReportViewer([" + selected[0].data.rerId + "], \"" + aOutputFormat + "\");'>View</a>";
                  };

                  var outputsFieldSet = {
                     xtype: "fieldset",
                     title: applicationResources.getProperty("profileWizard.wizardBar.outputs"),
                     columnWidth: 0.5,
                     height: 150,
                     style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
                     defaults: {
                        style: "font-size:11px;"
                     },
                     items: [new Ext.grid.GridPanel({
                        height: 105,
                        autoScroll: true,
                        store: outputsStore,
                        columns: [
                           {header: applicationResources.getProperty("propertiesPanel.th.format"), dataIndex: "outputFormat", width: 150},
                           {header: applicationResources.getProperty("propertiesPanel.th.compressed"), width: 150, dataIndex: "compressedSizeInKb", renderer: sizeRenderer, align: "right"},
                           {header: applicationResources.getProperty("propertiesPanel.th.raw"), width: 150, dataIndex: "uncompressedSizeInKb", renderer: sizeRenderer, align: "right"},
                           {dataIndex: "outputFormat", renderer: renderViewLink, width: 50, align: "right"}
                        ]
                     })]
                  };

                  var deliveriesItems = [];
                  for(var i=0;i<rerDetails.deliveryPreferences.length;i++)
                  {
                     var outputFormatsString = "";
                     for(var j=0;j<rerDetails.deliveryPreferences[i].outputReferences.length;j++)
                     {
                        if(j>0)
                        {
                           outputFormatsString += ", ";
                        }
                        outputFormatsString += rerDetails.deliveryPreferences[i].outputReferences[j];
                     }
                     outputFormatsString += "";
                     deliveriesItems.push({
                        xtype: "displayfield",
                        fieldLabel: rerDetails.deliveryPreferences[i].deliveryType,
                        value: "<b>" + outputFormatsString + "</b>"
                     });
                  }

                  var deliveriesFieldSet = {
                     xtype: "fieldset",
                     title: applicationResources.getProperty("profileWizard.outputs.deliveries"),
                     style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
                     defaults: {
                        style: "font-size:11px;",
                        labelStyle: "font-size:11px;"
                     },
                     columnWidth: 0.5,
                     height: 110,
                     items: [deliveriesItems]
                  };

                  var actionsFieldValue = "";
                  if(rerDetails.status.finished && rerDetails.incidentReportCapability)
                  {
                     actionsFieldValue = applicationResources.getProperty("propertiesPanel.text.createIncidentReport")
                           + "<br/><br/><a href='#' onclick='javascript:JsUtil.openNewWindow(\"" + ServerEnvironment.baseUrl + "/secure/actions/createIncidentReportForSuccessfulReport.do?rerId=" + selected[0].data.rerId + "\",\"_blank\");'>"
                           + applicationResources.getProperty("propertiesPanel.button.createIncidentReport")
                           + "</a>";
                  }
                  else if(rerDetails.status.value < 0 && rerDetails.incidentReportCapability)
                  {
                     actionsFieldValue = applicationResources.getProperty("propertiesPanel.text.downloadIncidentReport")
                           + "<br/><br/><a href='#' onclick='javascript:JsUtil.openNewWindow(\"" + ServerEnvironment.baseUrl + "/secure/actions/downloadRerIncident.do?rerId=" + selected[0].data.rerId + "\",\"_blank\");'>"
                           + applicationResources.getProperty("propertiesPanel.button.downloadIncidentReport")
                           + "</a>";
                  }

                  var actionsFieldSet = {
                     xtype: "fieldset",
                     title: applicationResources.getProperty("propertiesPanel.title.actions"),
                     style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
                     defaults: {
                        style: "font-size:11px;"
                     },
                     columnWidth: 0.5,
                     height: 140,
                     items: [{
                        xtype: "displayfield",
                        hideLabel: true,
                        value: actionsFieldValue
                     }]
                  };

                  var statisticsFieldSet = {
                     xtype: "fieldset",
                     title: applicationResources.getProperty("propertiesPanel.title.stats"),
                     style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
                     defaults: {
                        labelStyle: "font-size:11px;padding:0px;"
                     },
                     columnWidth: 0.5,
                     height: 240,
                     labelWidth: 300,
                     items: [{
                        xtype: "displayfield",
                        fieldLabel: "<b>" + applicationResources.getProperty("propertiesPanel.rerStats.state") + "</b>",
                        value: "<b>" + applicationResources.getProperty("propertiesPanel.rerStats.seconds") + "</b>",
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.rerStats.pendingPreExecution"),
                        value: rerDetails.preExecutionBlockedTime,
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.rerStats.preExecution"),
                        value: rerDetails.totalPreExecutionTime,
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.rerStats.pendingExecution"),
                        value: rerDetails.executionBlockedTime,
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.rerStats.execution"),
                        value: rerDetails.totalExecutionTime,
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.rerStats.pendingDownload"),
                        value: rerDetails.downloadBlockedTime,
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.rerStats.download"),
                        value: rerDetails.totalDownloadTime,
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.rerStats.pendingPostExecution"),
                        value: rerDetails.postExecutionBlockedTime,
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: applicationResources.getProperty("propertiesPanel.rerStats.postExecution"),
                        value: rerDetails.totalPostExecutionTime,
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: "<b>" + applicationResources.getProperty("propertiesPanel.rerStats.total") + "</b>",
                        value: "<b>" + rerDetails.totalTime + "</b>",
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: "<b>" + applicationResources.getProperty("propertiesPanel.label.maxExecutionTime") + "</b>",
                        labelSeparator: "",
                        value: rerDetails.maxExecutionTime ? "<b>" + rerDetails.maxExecutionTime + "</b>": "<b>N/A</b>",
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     },{
                        xtype: "displayfield",
                        fieldLabel: "<b>" + applicationResources.getProperty("propertiesPanel.rerStats.failedAttempts") + "</b>",
                        value: "<b>" + rerDetails.numberOfFailedAttempts + "</b>",
                        style: {textAlign: "right", fontSize: "11px", padding: "0px"},
                        width: 100
                     }]
                  };

                  var runtimeFiltersItems = [];
                  for(i=0;i<rerDetails.runtimeFilters.length;i++)
                  {
                     runtimeFiltersItems.push({
                        xtype: "displayfield",
                        hideLabel: true,
                        value: (i+1) + ". " + rerDetails.runtimeFilters[i]
                     });
                  }

                  var runtimeFiltersFieldSet = {
                     xtype: "fieldset",
                     title: applicationResources.getProperty("propertiesPanel.label.runtimeFilters"),
                     style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
                     defaults: {
                        style: "font-size:11px;"
                     },
                     columnWidth: 0.5,
                     height: 140,
                     items: [runtimeFiltersItems],
                     autoScroll: true
                  };

                  this.updatePropertiesCard(new Ext.FormPanel({
                     autoScroll: true,
                     border: false,
                     layout: "column",
                     bodyStyle: "padding:5px 5px 5px 5px",
                     defaults: {
                        layout: "form",
                        bodyStyle: "padding:5px 5px 5px 5px"
                     },
                     defaultType: "displayfield",
                     items: [
                        generalFieldSet,
                        statusFieldSet,
                        parametersFieldSet,
                        outputsFieldSet,
                        deliveriesFieldSet,
                        statisticsFieldSet,
                        actionsFieldSet,
                        runtimeFiltersFieldSet
                     ]
                  }));
               }
            });
         }

         if (selected.length > 1)
         {
            this.updatePropertiesCard(new Ext.Panel({html: applicationResources.getProperty("propertiesPanel.multipleItemsSelected"), border: false}));
         }
      },

      updatePropertiesCard: function(aNewCard)
      {
         var oldCard = this.propertiesPanel.activeItem;
         this.propertiesPanel.add(aNewCard);
         this.propertiesPanel.getLayout().setActiveItem(aNewCard);
         this.propertiesPanel.remove(oldCard);
      },

      /**
       * checks to see if there are any in-progress RER's currently in the grid that we'll
       * want to update the status on in a bit...
       */
      installCallBackIfRersAreStillInProgress: function () {
         //         Ext.dump(this.refreshInProgress)
         if (this.refreshInProgress)
         {
            return;
         }

         var rows = this.rerGrid.getStore().data.items;

         for (var i = 0; i < rows.length; ++i)
         {
            if (!this.isFinalRerStatus(rows[i].data.status))
            {
               window.setTimeout('Adf.browseRersUi.refreshInProgressRers();', this.autoRefreshFrequency * 1000);
               return;
            }
         }
      },

      /**
       * refresh the status for pending RER's...
       */
      refreshInProgressRers: function () {
         if (this.refreshInProgress)
            return;

         this.refreshInProgress = true;


         var rerIdParam = '';
         var rows = this.rerGrid.getStore().data.items;


         for (var i = 0; i < rows.length; ++i)
         {
            if (!this.isFinalRerStatus(rows[i].data.status))
            {
               rerIdParam += "rerIds=" + rows[i].data.rerId + "&";
            }
         }

         if (rerIdParam.length == 0)
         {
            this.refreshInProgress = false;
            return;
         }

         RequestUtil.request ({
            url: ServerEnvironment.baseUrl + "/secure/actions/ext/getRerStatus.do",
            params: rerIdParam,
            method: "POST",
            callback: this.onAjaxRerStatusRequestFinish,
            scope: this
         });
      },


      /**
       * callback from Ajax call sent in refreshInProgressRers
       */
      onAjaxRerStatusRequestFinish: function (aOptions, aSuccess, aResponse) {

         try
         {
            var queryStatusResults = eval(aResponse.responseText);
            var currentRow;

            for (var i = 0; i < queryStatusResults.length; ++i)
            {
               currentRow = this.rerGrid.getStore().getById('' + queryStatusResults[i].rerId);

               if (currentRow.get("status") != queryStatusResults[i].status)
                  currentRow.set("status", queryStatusResults[i].status);
            }
         }
         finally
         {
            this.refreshInProgress = false;
            this.installCallBackIfRersAreStillInProgress();
         }
      },

      /**
       * returns true if this is a final status code
       */
      isFinalRerStatus: function (aStatus) {
         return aStatus < 0 || aStatus >= 1000;
      },



      installRerWatchListMonitor: function()
      {
         this.refreshRerWatchList.defer(5000, this);
      },


      refreshRerWatchList: function()
      {
         // Get list of executing RERs in the report execution watch list.
         var rerWatchList = this.getRerWatchListFromCookie();
         if (!Ext.isEmpty(rerWatchList) && rerWatchList.length > 0)
         {
            // Get the status of the executing reports.
            RequestUtil.request({
               url: ServerEnvironment.baseUrl + '/secure/actions/ext/getRerSummaries.do',
               params: {
                  rerId: rerWatchList
               },
               scope: this,
               success: function(aResponse, aOptions)
               {
                  var rerSummaries = null;
                  try
                  {
                     var responseObject = Ext.decode(aResponse.responseText);
                     rerSummaries = responseObject.rerSummaries;
                  }
                  catch (e)
                  {
                     var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
                     var writeString = aResponse.responseText;
                     writeString = serverEnv + writeString;

                     if (writeString.indexOf("<html>") == -1)
                     {
                        alert("A " + e.name + " occured evaluting the javascript.\n\nError message:  " + e.message + "\n\nStatement:  " + aResponse.responseText);
                     }
                     else
                     {
                        window.document.write(writeString);
                     }
                  }

                  if (rerSummaries != null)
                  {
                     this.updateRerWatchList(rerSummaries);
                  }
                  this.installRerWatchListMonitor();
               }
            });
         }
         else
         {
            this.installRerWatchListMonitor();
         }
      },


      /**
       * This method examines the status of each RER and launches any completed report executions in the report viewer
       * and removes the completed RERs from the watch list.
       *
       * @param aRerSummaries An array of RER Summaries.
       */
      updateRerWatchList: function(aRerSummaries)
      {
         for (var i = 0; i < aRerSummaries.length; i++)
         {
            var eachRerSummary = aRerSummaries[i];
            if(eachRerSummary.status == ReportExecutionStatusEnum.FINISHED.value)
            {
               var rerArray = new Array();
               rerArray.push(eachRerSummary.rerId)
               launchReportViewer(rerArray, null, null, true);
               this.removeRerFromWatchList(eachRerSummary.rerId);
            }
            else if(eachRerSummary.status < 0)
            {
               alert("A report you are waiting on finished with an error status of "
                       + Enum.parseEnumFromValue(ReportExecutionStatusEnum, eachRerSummary.status ).name
                       + ". For more info, view the report from the Report Outputs screen." );
               this.removeRerFromWatchList(eachRerSummary.rerId);
            }
         }
      },


      /**
       * This method returns the list of report execution IDs that are being monitored in the report execution
       * watch list.
       *
       * @return A list of RER IDs in the report execution watch list. Otherwise null is return.
       */
      getRerWatchListFromCookie: function()
      {
         var existingWatchList = JsUtil.readCookie("framesetRerWatchList");
         var fullWatchList = existingWatchList;

         // Add any new report executions to the watch list and update the report execution watch list cookie.
         var newRers = JsUtil.consumeCookiesStartingWith("newRerWatchId");
         if (JsUtil.isGood(newRers) && newRers.length > 0)
         {
            for (var index = 0; index < newRers.length; index++)
            {
               var eachNewRer = newRers[index];
               if (JsUtil.isGood(fullWatchList) && fullWatchList.length > 0)
               {
                  fullWatchList += "|" + eachNewRer;
               }
               else
               {
                  fullWatchList = eachNewRer;
               }
            }
            JsUtil.createCookie("framesetRerWatchList", fullWatchList);
         }


         // Create a list of report execution IDs in the report execution watch list.
         var listAsArray = null;
         if (JsUtil.isGood(fullWatchList) && fullWatchList.length > 0)
         {
            listAsArray = fullWatchList.split("|");
         }

         return listAsArray;
      },


      /**
       * The method stops monitoring the execution of a report by removing it's report execution ID from the execution
       * watch list.
       *
       * @param anRerId - (Integer) Report execution ID.
       */
      removeRerFromWatchList: function(anRerId)
      {
         var fullWatchList = JsUtil.readCookie("framesetRerWatchList");
         if (JsUtil.isGood(fullWatchList) && fullWatchList.length > 0 && JsUtil.isGood(anRerId))
         {
            var stringRerId = '' + anRerId;

            // Validate the RER ID specified exists in the watch list before attempting to remove it.
            var indexOf = fullWatchList.indexOf(stringRerId);
            if (indexOf >= 0)
            {
               // If there is only 1 RER ID in the list then delete the entire watch list cookie. Otherwise
               // parse the list of RER IDs in the watch list and remove the RER ID specified.
               if (fullWatchList.length == stringRerId.length)
               {
                  JsUtil.eraseCookie("framesetRerWatchList");
               }
               else
               {
                  var replaceTxt = "";
                  if (indexOf > 0)
                  {
                     replaceTxt = "|" + anRerId;
                  }
                  else
                  {
                     replaceTxt = '' + anRerId + "|";
                  }

                  fullWatchList = fullWatchList.replace(replaceTxt, "");
                  JsUtil.createCookie("framesetRerWatchList", fullWatchList);
               }
            }
         }
      },

      /**
       * This method creates a cookie for an executing report. The cookie allows the report to be monitored during the
       * execution process.
       *
       * @param aRerId - (Integer) Report execution ID.
       */
      addRerToWatchlist: function(aRerId)
      {
         JsUtil.createCookie( "newRerWatchId" + aRerId, aRerId );
      },


      /**
       * This method validates the launch type of the selected report output before calling the callback function. It
       * creates a new function by combining the validation code and the callback function. The validation code
       * verifies that launch type is not "launch in Cognos Viewer". Cognos Viewer content is not supported within
       * the ADF. The validation code is too prevent Cognos content from being scheduled, view or any other ADF actions.
       *
       * @param aSuccessfulCallbackFn The function to call if none of the selected content has a Cognos Viewer launch type.
       * @param aScope The scope to use for the callback function.
       * @returns {Function} A new function that validates the launch type before calling the function passed in.
       */
      validateLaunchInfo: function(aSuccessfulCallbackFn, aScope)
      {
         var callerScope = this;

         return function()
         {
            // Define runtime information that will be used to process the selected report output.
            var info = {
               callerScope: callerScope,
               callbackFn: aSuccessfulCallbackFn,
               scope: aScope || this
            };
            info.arguments = arguments;
            info.rerIds = info.callerScope.getRerIdsForSelectedRows(1, 10);

            // Validate the launch types.
            if (Ext.isArray(info.rerIds) && info.rerIds.length > 0)
            {
               info.callerScope.getLaunchInfo(info);
            }
         }
      },


      /**
       * This method validates a single RER ID. It checks the launch type of the RER. If the launch is COGNOS_VIEWER
       * then alert the user that their requested action cannot be processed. If this RER is valid and there are
       * no more RERs to be processed then call the callback function. Otherwise, recursively call this method again.
       *
       * NOTE: This method is called recursively to process the array of RER IDs. The way it traverses the array is
       * it pops the last RER ID off the array and passes it as a parameter to the service call.
       *
       * @param aInfo Runtime validation information that is used to validate the list of RERs.
       */
      getLaunchInfo: function(aInfo)
      {
         RequestUtil.request({
            method: 'GET',
            url: ServerEnvironment.baseUrl + "/rs/report/biLaunchInfo",
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json"
            },
            params: {
               rerId: aInfo.rerIds.pop()
            },
            scope: aInfo,
            success: function(aResponse, aOptions)
            {
               var results = Ext.decode(aResponse.responseText);
//               alert(aResponse.responseText);


               if (results.cognosLaunchInfo[0].launchPreference == 'COGNOS_VIEWER')
               {
                  // Alert the user that this is Cognos Viewer output and none of the ADF action apply.
                  Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
                                String.format(applicationResources.getProperty('reportOutputs.cognosViewerLaunchType'),results.cognosLaunchInfo[0].rerId));
               }
               else if (aInfo.rerIds.length > 0)
               {
                  // The current RER ID being processed is valid but there are more RER IDs to be validated.
                  aInfo.callerScope.getLaunchInfo(aInfo);
               }
               else
               {
                  // All of the RER IDs are valid so call the callback function.
                  aInfo.callbackFn.apply(aInfo.scope, aInfo.arguments);
               }
            }
         });
      },


      /**
       * get selected items from grid
       */
      getSelectedRows: function () {
         return this.rerGrid.getSelectionModel().getSelections();
      },

      /**
       * accumulate the rerIds in an array for the selected rows that match the
       * optional predicate
       */
      getRerIdsForSelectedRows: function(aMinRows, aMaxRows, aPredicate) {
         var selected = this.getSelectedRows();

         if (selected.length < aMinRows)
         {
            alert(applicationResources.getPropertyWithParameters("general.tooFewItemsSelected", [aMinRows] ));
            return null;
         }
         else if (selected.length > aMaxRows)
         {
            // TODO: 
            alert(applicationResources.getPropertyWithParameters("general.tooManyRowsSelected", [aMaxRows] ));
            return null;
         }
         else
         {
            var rerIds = new Array();
            for (var i = 0; i < selected.length; ++i)
            {
               //if (selected[i].data.status > 0)
               if ((!aPredicate) || aPredicate.matches(selected[i]))
               {
                  rerIds.push(selected[i].data.rerId);
               }
            }
            return rerIds;
         }
      },

      /**
       * callback for when a toolbar button is selected
       */
      onRefreshButtonClicked: function (aButton) {
         this.refreshRerGrid();
      },

      /**
       * refreshes the RER grid
       */
      refreshRerGrid: function()
      {
         this.rerGrid.getStore().reload( {
            params: this.getFetchParams(),
            callback:this.installCallBackIfRersAreStillInProgress,
            scope:this
         });
      },

      viewDoubleClickedRer : function () {
         this.onViewButtonClicked();
      },

      onViewButtonClicked: function (aButton) {

         var unviewableReports = [];

         var rerIds = this.getRerIdsForSelectedRows(1, 8, {
            matches: function (aRow) {
               var rowStatus = Number(aRow.data.status);
               if(Number(aRow.data.status) <= 0)
               {
                  unviewableReports.push(aRow.data.profileName);
                  return false;
               }
               else
               {
                  return true;
               }
            }
         });


         if(unviewableReports && unviewableReports.length > 0)
         {
            var unviewableList = "<p><ul style=\"padding:10px;list-style-type:disc;list-style-position:inside;\"><li>" + unviewableReports.join("</li><li>") + "</li></ul></p>";
            Ext.Msg.show({
                title: applicationResources.getProperty("reportViewer.wrongStatus.title"),
                msg: applicationResources.getProperty("reportViewer.wrongStatus") + unviewableList,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING,
                bodyCls: Ext.Msg.styleHtmlCls,
                width: 350,
                //required grossness since ext dialogs are not synchronous
                fn : function()
                {
                   if (rerIds && (rerIds.length > 0))
                  {
                     launchReportViewer(rerIds);
                  }
                }
            });
         }
         else if (rerIds && (rerIds.length > 0))
         {
            launchReportViewer(rerIds);
         }
      },

      onDeleteButtonClicked: function (aButton) {
         var rerIds = this.getRerIdsForSelectedRows(1, 900, {
            matches: function (aRow) {
               return true;
            }
         });

         if (rerIds != null)
         {
            if (UserPreference.getConfirmDeletes())
            {
               Ext.MessageBox.confirm
               (
                  applicationResources.getProperty("general.dialog.confirmTitle"),
                  applicationResources.getProperty("general.confirmDeletions"),
                  function (aButton)
                  {
                     if ('yes' == aButton)
                     {
                        this.deleteRers(rerIds);
                     }
                  }.createDelegate(this)
               );
            }
            else
            {
               this.deleteRers(rerIds);
            }
         }
      },

      /**
       * delete the targeted RER's
       */
      deleteRers: function (aRerIds) {
         RequestUtil.request ({
            url: ServerEnvironment.baseUrl + "/secure/actions/deleteRer.do",
            params: JsUtil.arrayToUrlParams(aRerIds, "rerIds"),
            method: "POST",
            callback: function (aOptions, aSuccess, aResponse) {
               FadeMessageController.getInstance().showFadeMessage(applicationResources.getProperty('reportOutput.delete.message'), 3000);
               this.refreshRerGrid();
            },
            scope: this
         });
      },

      /**
       * callback for when cancel toolbar button is selected
       */
      onCancelButtonClicked: function (aButton) {
         var rerIds = this.getRerIdsForSelectedRows(1, 900, {
            matches: function (aRow) {
               return !(Adf.browseRersUi.isFinalRerStatus(aRow.data.status))
            }
         });

         if (rerIds != null)
            this.cancelRers(rerIds);
      },

      /**
       * cancel the designated RERs
       */
      cancelRers: function (aRerIds) {
         RequestUtil.request ({
            url: ServerEnvironment.baseUrl + "/secure/actions/cancelRer.do",
            params: JsUtil.arrayToUrlParams(aRerIds, "rerIds"),
            method: "POST",
            callback: function (aOptions, aSuccess, aResponse) {
               FadeMessageController.getInstance().showFadeMessage(applicationResources.getProperty('reportOutput.cancel.message'), 3000);
               this.refreshRerGrid();
            },
            scope: this
         });
      },

      /**
       * callback for when a re-execute toolbar button is selected
       */
      onReExecuteButtonClicked: function (aButton) {
         var rerIds = this.getRerIdsForSelectedRows(1, 900, null);

         if (rerIds != null)
            this.reExecuteRers(rerIds);
      },

      /**
       * re-execute the designated RERs
       */
      reExecuteRers: function (aRerIds) {
         //todo - implment Ext.Msg.updateProgress
         Ext.Msg.wait(applicationResources.getProperty("general.submittingRequest"));

         RequestUtil.request ({
            url: ServerEnvironment.baseUrl + "/secure/actions/ext/reExecute.do",
            params: JsUtil.arrayToUrlParams(aRerIds, "rerId"),
            method: "POST",
            callback: function (aOptions, aSuccess, aResponse) {

               // Hiding the submitting request message.
               Ext.Msg.hide();

               // Extracting the execution results from response.
//               alert(aResponse.responseText);
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


               // Monitor the reports that will be displayed in the report viewer once they are completed.
               if (!Ext.isEmpty(response.rerIdsToAutoView) && response.rerIdsToAutoView.length)
               {
                  for (var i = 0; i < response.rerIdsToAutoView.length; i++)
                  {
                     Adf.browseRersUi.addRerToWatchlist(response.rerIdsToAutoView[i]);
                  }
//                  Adf.browseRersUi.installRerWatchListMonitor();
               }


               // Updated the RER Status grid with submitted reports.
               this.refreshRerGrid();


               // Launch reports in the report viewer that had the "launch in the foreground" execution setting set.
               // This execution setting is one of the runtime settings on a report profile.
               if (!Ext.isEmpty(response.rerIdsToLaunchInForeground))
               {
                  launchReportViewer(response.rerIdsToLaunchInForeground);
               }


               // Note: There is no support for analysis studio and query studio reports because these reports
               // never appear in the RER status grid so they will never get re-executed.

            },
            scope: this
         });
      },

      /**
       * callback for when a toolbar button is selected
       */
      onRePromptButtonClicked: function (aButton) {
         var targetIds = this.getRerIdsForSelectedRows(1, 1, null);

         if (!Ext.isEmpty(targetIds) && targetIds.length == 1)
         {

            var selectedRow = this.getSelectedRows()[0];

//            var windowUrl = ServerEnvironment.contextPath + "/secure/actions/ext/editReiWindow.do?launchNodeId=" + selectedRow.data['rerId'] + "&launchNodeType=" + selectedRow.data['type'];
            var windowUrl = ServerEnvironment.contextPath + "/secure/actions/ext/editReiWindowForRer.do?rerId=" + selectedRow.data['rerId'];
            var windowName = ServerEnvironment.windowNamePrefix + "_EditRei_" + selectedRow.data['rerId'];

            var geom = new BrowserGeometry();
            var win = window.open(windowUrl,
                  windowName,
                  "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

            win.focus();
         }


      },

      onFilterButtonClicked: function()
      {
         if (!this.filterWindow)
         {
            this.filterWindow = new Adf.RerFilterWindow({
                     filterCallBack : this.filterCallBack,
                     filterCallBackScope : this,
                     filterCommandContext : "Adf.browseRersUi"
                  });
         }

         this.filterWindow.show();
      },

      removeFilter: function(aFilterName)
      {
         Ext.get(aFilterName).remove();
         delete this.currentFilterParams[aFilterName];

         if("startDate" === aFilterName)
         {
            delete this.currentFilterParams["startTime"];
            delete this.currentFilterParams["endDate"];
            delete this.currentFilterParams["endTime"];
         }

         this.currentFilterParams['filterCount']--;

         if(this.currentFilterParams['filterCount'] <= 0)
         {
            this.rerFilterDisplay.hide();
            this.rerGridPanel.doLayout();
         }

         Adf.browseRersUi.rerGrid.store.load({
            // Parameters were moved to the store's beforeload event.
            callback:this.installCallBackIfRersAreStillInProgress,
            scope:this
         });
      },

      filterCallBack : function(aFilterParams)
      {
         if(!Ext.isEmpty(aFilterParams.filterHtml))
         {
            this.rerFilterDisplay.show();
            this.rerFilterDisplay.update(aFilterParams.filterHtml);
            this.rerGridPanel.doLayout();
         }
         else
         {
            this.rerFilterDisplay.hide();
            this.rerGridPanel.doLayout();
         }
         // Save the filter parameters so it will be used with all subsequent refresh RERs calls.
         Adf.browseRersUi.setFilterParams(aFilterParams);

         Adf.browseRersUi.rerGrid.store.load({
            // Parameters were moved to the store's beforeload event.
            callback:this.installCallBackIfRersAreStillInProgress,
            scope:this
         });
      },


      /**
       * This method handles the Debug RER button click event. It will display the RER Debug screen for the selected
       * RER.
       *
       * @param aButton (Ext.Button) Debug RER button.
       * @param aEventObject (Ext.EventObject) Button click event object.
       */
      onDebugButtonClicked: function(aButton, aEventObject)
      {

         var targetIds = this.getRerIdsForSelectedRows(1, 1, null);

         if (!Ext.isEmpty(targetIds) && targetIds.length == 1)
         {
            var rerId = targetIds[0];

            var url = ServerEnvironment.baseUrl + "/secure/actions/debugRer.do?rerId=" + rerId;

            var windowName = ServerEnvironment.windowNamePrefix + "_debugRer_" + rerId;

            var geom = new BrowserGeometry();
            var win = window.open(url,
               windowName,
               "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

            win.focus();
         }
      },

      /**
       * re-prompt for a specific RER.
       */
      rePrompt: function (aRerId) {

         var url = ServerEnvironment.baseUrl + "/secure/actions/editReiForRer.do?rerId=" + aRerId;

         var windowName = ServerEnvironment.windowNamePrefix + "_editReiForRer_" + aRerId;

         var geom = new BrowserGeometry();
         var win = window.open(url,
               windowName,
               "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

         win.focus();
      },

      /**
       * callback for when a toolbar button is selected
       */
      onDrillButtonClicked: function (aButton) {
         alert('todo');
      },

      /**
       * callback for when a toolbar button is selected
       */
      onEmailButtonClicked: function (aButton) {

         var predicate = {
            notMatched: [],
            matches:function (aRow) {
               if (aRow.data.status != 1000)
               {
                  this.notMatched.push(aRow.data)
                  return false;
               }
               return true;
            }
         };

         var rerIds = this.getRerIdsForSelectedRows(1, 1, null);

         if (rerIds != null)
         {
//            this.emailRerOutput(rerIds);
            var emailRerOutputDialog = new Adf.EmailPreferencesDialog();
            emailRerOutputDialog.show({
               rerIds: rerIds
            });
         }
      },


      //Sets the intial paging parameters.  Must be forced to int values for the Pagination toolbar
      getFetchParams: function() {
         var filter = this.getFilterParams();

         return Ext.applyIf({
            start : 0,
            limit : UserPreference.getItemsPerPage(),
            //todo replace with actual parameter
            numberOfPastDays: 7
         },
         filter);
      },

      /**
       * This method sets the current filter parameters that will be applied when the RERs are retrieved.
       *
       * @param aParams - A filter parameters object.
       */
      setFilterParams: function(aParams)
      {
         this.currentFilterParams = aParams;
      },

      getFilterParams: function()
      {
         return this.currentFilterParams ? this.currentFilterParams : {};
      },

      /**
       * update the params passed to this screen
       */
      updateParameters: function (aParams) {

         if (this.currentParams != aParams)
         {
            this.currentParams = aParams;

            var nvPairs = this.currentParams.split("&");

            var name;
            for (var i = 0; i < nvPairs.length; ++i)
            {
               name = JsUtil.substringBeforeFirst(nvPairs[i], "=");

               //todo get actual parameter (name)
               var formElement = 'timmy';
               if (formElement)
               {
                  var value = JsUtil.substringAfterFirst(nvPairs[i], "=");
                  //formElement.value = value;
                  (document.forms[0])[name].value = value;
               }
            }

            this.refreshRerGrid();
         }
      },

      onItemsPerPageChanged: function(aUserPreferences)
      {
         this.paging.pageSize = UserPreference.getItemsPerPage();
      }
   };
}();

var workspaceUi = Adf.browseRersUi;

