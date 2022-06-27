Adf.scheduleContentsUi = function(){

    return {

        init : function()
        {

           this.eventSubscription = Adf.frameSetUi.eventChannel.subscribe("ScheduleContentUi", function(aEvent)
           {
              if(aEvent.type == "scheduleReport")
              {
                 Adf.scheduleContentsUi.shouldReload = true;
              }
              else if (aEvent.type == 'userPreferenceChanged')
              {
                 if (aEvent.itemsPerPageChanged || aEvent.dateFormatChanged || aEvent.timeFormatChanged)
                 {
                    Adf.scheduleContentsUi.shouldReload = true;
                 }
              }
           });

           this.listeners = {
              activate: function()
              {
                 if(Adf.scheduleContentsUi.shouldReload)
                 {
                    Adf.scheduleContentsUi.refreshContentsGrid();
                    Adf.scheduleContentsUi.shouldReload = false;
                 }
              }
           };

            this.currentParams = JsUtil.substringAfterFirst(document.location.href, "?");

            this.workspaceToolbar = new Ext.Toolbar({
                items : [this.createToolbarButton("reload", "arrow_rotate_clockwise.png", Adf.scheduleContentsUi.onRefreshButtonClicked, applicationResources.getProperty("browseSchedules.buttonBar.refresh")), '-',
                    this.createToolbarButton("run", "clock_go.png", Adf.scheduleContentsUi.onRunButtonClicked, applicationResources.getProperty("browseSchedules.buttonBar.run")), '-',
                    this.createToolbarButton("pause", "clock_pause.png", Adf.scheduleContentsUi.onPauseButtonClicked, applicationResources.getProperty("browseSchedules.buttonBar.pause")), '-',
                    this.createToolbarButton("resume", "clock_play.png", Adf.scheduleContentsUi.onResumeButtonClicked, applicationResources.getProperty("browseSchedules.buttonBar.resume")), '-',
                    this.createToolbarButton("edit", "clock_edit.png", Adf.scheduleContentsUi.onEditButtonClicked, applicationResources.getProperty("browseSchedules.buttonBar.edit")), '-',
                    this.createToolbarButton("delete", "clock_delete.png", Adf.scheduleContentsUi.onDeleteButtonClicked, applicationResources.getProperty("browseSchedules.buttonBar.delete")), '-',
                    this.createToolbarButton("filter", "magnifier.png", this.onFilterButtonClicked, applicationResources.getProperty("browseSchedules.buttonBar.filter"))
            ]
         });

         this.workspaceToolbar2 = new Ext.Toolbar({
            items : []
         });

         this.scheduleContentsStore = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/ext/fetchSchedules.do'
            }),
            baseParams : {limit : UserPreference.getItemsPerPage()},
            reader: new Ext.data.JsonReader({
               root: 'scheduleContents',
               totalProperty: 'totalCount',
               id: 'id'
            }, ["id", "scheduleName", "status", "previousRun", "nextRun", "user", "createdBy", "createdTime", "detailsClass", "deletedBy", "deletedTime", "reportNames", "propertyPanelHtml"]),
            remoteSort: true
         });

         //Needed to get the Pagination toolbar to use the appropriate number of days filter
         this.scheduleContentsStore.proxy.on('beforeload', function(proxy, params) {
            // Adding parameters.
            Ext.applyIf(params, this.getFetchParams());
         }, this);

        this.scheduleContentsStore.setDefaultSort('id', 'DESC');

        this.pagingToolbar = new Ext.PagingToolbar({
           store: this.scheduleContentsStore,
           pageSize: UserPreference.getItemsPerPage(),
           displayInfo: true,
           displayMsg: 'Schedules {0} - {1} of {2}',
           emptyMsg: "No Schedules to display"
        });

         //--- custom render function for type field...
         // pluggable renders
         function renderStatusFn (aValue) {
            var statusCode = aValue;

            var status;
            var statusClass = "rerCancelled";

            if (statusCode == 0)
            {
                status = applicationResources.getProperty('rcl.sse.normal');
                return '<span style="font-weight:normal;color:green;">' + status + '</span>';
            }
            if(statusCode == 1)
            {
                status = applicationResources.getProperty('rcl.sse.paused');
                return '<span style="font-style:italic;color:blue;">' + status + '</span>';
            }
            if(statusCode == 2)
            {
                status = applicationResources.getProperty('rcl.sse.complete');
            }
            if(statusCode == 3)
            {
                status = applicationResources.getProperty('rcl.sse.error');
                return '<span style="font-weight:900;color:red;">' + status + '</span>';
            }
            if(statusCode == 4)
            {
                status = applicationResources.getProperty('rcl.sse.blocked');
            }
            if(statusCode == 5)
            {
                status = applicationResources.getProperty('rcl.sse.none');
            }

            return status;

         };

           this.detailsTpl = new Ext.Template(
                 '<br/><table>' +
                 '<tr style="padding-left: 15px; padding-right: 15px;"><td width=125>Created By:</td><td><b>{createdBy}</b></td></tr>' +
                 '<tr style="padding-left: 15px; padding-right: 15px;"><td width=125>Created Time:</td><td><b>{createdTime}</b></td></tr>' +
                 '{deletedBy:this.renderDeletedBy}' +
                 '{deletedTime:this.renderDeletedTime}' +
                 '</table><br/>' +
                 '{reportNames:this.renderReportNames}' +
                 '<br/>' +
                 '<table class="properties">{propertyPanelHtml}</table>'
                 );

           this.detailsTpl.renderDeletedBy = function(aDeletedBy)
           {
              return aDeletedBy ? '<tr style="padding-left: 15px; padding-right: 15px;"><td width=125>Deleted By:</td><td><b>' + aDeletedBy + '</b></td></tr>' : '';
           };

           this.detailsTpl.renderDeletedTime = function(aDeletedTime)
           {
              return aDeletedTime ? '<tr style="padding-left: 15px; padding-right: 15px;"><td width=125>Deleted Time:</td><td><b>' + aDeletedTime + '</b></td></span>' : '';
           };

           this.detailsTpl.renderReportNames = function(aReportNames)
           {
              var reportNamesHtml = '<table><tr><td width=125>Report Names:</td><td><b>' + aReportNames[0] + '</b></td></tr>';
              for(var i=1;i<aReportNames.length;i++)
              {
                 reportNamesHtml += '<tr><td width=125>&nbsp;</td><td><b>' + aReportNames[i] + '</b></td></tr>';
              }
              reportNamesHtml += '</table>';
              return reportNamesHtml;
           };
           

           //--- custom render function for type field...
         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store
         var cm = new Ext.grid.ColumnModel([
            { id: 'id',
               header: 'Id',
               dataIndex: 'id',
               width: 10,
               css: 'white-space:normal;',
               sortable:true },

            { id: 'scheduleName', // id assigned so we can apply custom css (e.g. .x-grid-col-profileName b { color:#333 })
               header: "Schedule Name",
               dataIndex: 'scheduleName',
               width: 50,
               css: 'white-space:normal;',
               sortable:true},

            { id: 'status',
               header: "Status",
               dataIndex: 'status',
               width: 50,
               renderer: renderStatusFn,
               sortable:true },

            { id: 'previousRun',
               header: "Previous Run",
               dataIndex: 'previousRun',
               width: 50,
               sortable:true },

            { id: 'nextRun',
               header: "Next Run",
               dataIndex: 'nextRun',
               width: 50,
               sortable:true },

            { id: 'user',
               header: "User",
               dataIndex: 'user',
               width: 50,
               sortable:true }


         ]);

        cm.defaultSortable = true;

        this.scheduleFilterDisplay = new Ext.Panel({
           height: 25,
           width: '100%',
           hidden: true
        });

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            flex: 1,
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: this.scheduleContentsStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            bbar:this.pagingToolbar,
            view: new Ext.grid.GroupingView({
                  forceFit:true,
                  groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
              })
         });

        this.scheduleGridPanel = new Ext.Panel({
           region: 'center',
           layout: {type:'vbox', align: 'stretch'},
           border: false,
           items: [this.scheduleFilterDisplay, this.contentsGrid]
        });

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

         this.uiObjects = [this.scheduleGridPanel, this.propertiesPanel];

           this.contentsGrid.on('rowclick', this.onScheduleRowClicked, this);
           this.contentsGrid.on('rowdblclick', this.onEditButtonClicked, this);

         this.scheduleContentsStore.load({
            params: this.getFetchParams(),
            scope:this
         });

          this.refreshContentsGrid();
        },

      /**
       * callback for when a toolbar button is selected
       */
      onRefreshButtonClicked: function (aButton) {
         this.refreshContentsGrid();
      },

      onRunButtonClicked: function(aButton) {
            var targetIds = this.getNodeIdsForSelectedRows(1, 30, null);

            var url = ServerEnvironment.baseUrl + "/secure/actions/runSchedule.do";

            var params = '';
            for(var i=0; i<targetIds.length; i++)
            {
                params += "scheduleIds=" + targetIds[i] + "&";
            }
            url += "?" + params;

             RequestUtil.request({
                url: url,
                method: "POST",
                callback: function (aOptions, aSuccess, aResponse)
                {
                   //todo - Struts action needs to be updated to return JS for the Ext
                   if(aSuccess)
                   {
                      FadeMessageController.getInstance().showFadeMessage(applicationResources.getProperty("pleaseWaitDiv.scheduler.executed"), 4000);
                   }
                   else
                   {
                      Ext.Msg.alert("Error", 'There was an error executing some of the selected schedule(s)..');
                   }
                   this.refreshContentsGrid();
                   Adf.frameSetUi.eventChannel.publish({type: "reportExecution"});
                },
                scope: this
             });

      },

      onPauseButtonClicked: function(aButton) {
            var targetIds = this.getNodeIdsForSelectedRows(1, 30, null);

            var url = ServerEnvironment.baseUrl + "/secure/actions/pauseSchedule.do";

            var params = '';
            for(var i=0; i<targetIds.length; i++)
            {
                params += "scheduleIds=" + targetIds[i] + "&";
            }
            url += "?" + params;

             RequestUtil.request({
                url: url,
                method: "POST",
                callback: function (aOptions, aSuccess, aResponse)
                {
                   //todo - Struts action needs to be updated to return JS for the Ext
                   if(aSuccess)
                   {
                      FadeMessageController.getInstance().showFadeMessage(applicationResources.getProperty("pleaseWaitDiv.scheduler.paused"), 4000);
                   }
                   else
                   {
                      Ext.Msg.alert("Error", 'There was an error executing some of the selected schedule(s).');
                   }
                    this.refreshContentsGrid();
                },
                scope: this
             });

      },

      onResumeButtonClicked: function(aButton) {
            var targetIds = this.getNodeIdsForSelectedRows(1, 30, null);

            var url = ServerEnvironment.baseUrl + "/secure/actions/resumeSchedule.do";

            var params = '';
            for(var i=0; i<targetIds.length; i++)
            {
                params += "scheduleIds=" + targetIds[i] + "&";
            }
            url += "?" + params;

             RequestUtil.request({
                url: url,
                method: "POST",
                callback: function (aOptions, aSuccess, aResponse)
                {
                   //todo - Struts action needs to be updated to return JS for the Ext
                   if(aSuccess)
                   {
                      FadeMessageController.getInstance().showFadeMessage(applicationResources.getProperty("pleaseWaitDiv.scheduler.resumed"), 4000);
                   }
                   else
                   {
                      Ext.Msg.alert("Error", 'There was an error resuming some of the selected schedule(s).');
                   }
                   this.refreshContentsGrid();
                },
                scope: this
             });

      },

      /**
       * callback for when a toolbar button is selected
       */
      onEditButtonClicked: function (aButton) {

         var targetIds = this.getNodeIdsForSelectedRows(1, 1, null);

         if (targetIds.length == 1)
         {
            RequestUtil.request({
               url: ServerEnvironment.baseUrl + "/secure/actions/schedule/getProperties.do",
               params: {
                  scheduleId: targetIds[0]
               },
               success: function(aResponse)
               {
                  ScheduleWizard.launch(Ext.decode(aResponse.responseText));
               }
            });
         }
         else
         {
            Ext.Msg.alert("Please select only one schedule to edit");
         }
      },

       onFilterButtonClicked: function(aButton)
       {
          if (!this.filterWindow)
          {
             this.filterWindow = new Adf.ScheduleFilterWindow({
                      filterCallBack : this.filterCallBack,
                      filterCallBackScope : this,
                      filterCommandContext : "Adf.scheduleContentsUi"
                   });
          }

          this.filterWindow.show();
       },

       filterCallBack : function(aFilterParams)
       {
          if(!Ext.isEmpty(aFilterParams.filterHtml))
          {
             this.scheduleFilterDisplay.show();
             this.scheduleFilterDisplay.update(aFilterParams.filterHtml);
             this.scheduleGridPanel.doLayout();
          }
          else
          {
             this.scheduleFilterDisplay.hide();
             this.scheduleGridPanel.doLayout();
          }
          // Save the filter parameters so it will be used with all subsequent refresh RERs calls.
          this.setFilterParams(aFilterParams);
          this.contentsGrid.store.load({});
       },

       removeFilter: function(aFilterName)
       {
          Ext.get(aFilterName).remove();
          delete this.currentFilterParams[aFilterName];

          if("startDate" === aFilterName)
          {
             delete this.currentFilterParams["endDate"];
          }

          if("showExecuted" === aFilterName)
          {
             delete this.currentFilterParams["showWillExecute"];
          }

          this.currentFilterParams['filterCount']--;

          if(this.currentFilterParams['filterCount'] <= 0)
          {
             this.scheduleFilterDisplay.hide();
             this.scheduleGridPanel.doLayout();
          }

          this.contentsGrid.store.load({});
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

       /**
        * This method processes the delete button click.
        *
        * @param aButton (Ext.Button) The delete button click on.
        */
      onDeleteButtonClicked: function (aButton)
      {
         var targetIds = this.getNodeIdsForSelectedRows(1, 30, null);

         if (targetIds == null || targetIds.length == 0)
         {
            Ext.Msg.alert(applicationResources.getProperty("scheduler.errors.selectSchedules"));
         }
         else
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
                        this.deleteContentNodes(targetIds);
                     }
                  }.createDelegate(this)
               );

            }
            else
            {
               this.deleteContentNodes(targetIds);
            }
         }
      },

       deleteContentNodes: function(aTargetIds)
      {
            var url = ServerEnvironment.baseUrl + "/secure/actions/deleteSchedule.do";

            var params = '';
            for(var i=0; i<aTargetIds.length; i++)
            {
                params += "scheduleIds=" + aTargetIds[i] + "&";
            }
            url += "?" + params;

             RequestUtil.request({
                url: url,
                method: "POST",
                callback: function (aOptions, aSuccess, aResponse)
                {
                    if(aSuccess)
                    {
                        FadeMessageController.getInstance().showFadeMessage(applicationResources.getProperty("pleaseWaitDiv.scheduler.deleted"), 4000);
                    }
                    else
                    {
                        Ext.Msg.alert("Error", 'There was an error deleting some of the selected schedule(s).');
                    }
                    this.refreshContentsGrid();
                },
                scope: this
             });

      },

      getNodeIdsForSelectedRows: function (aMinRows, aMaxRows, aPredicate)
      {
         var selected = this.contentsGrid.getSelectionModel().getSelections();


         if (selected.length < aMinRows)
         {
            alert(applicationResources.getPropertyWithParameters("general.tooFewItemsSelected", [aMinRows]));
            return null;
         }
         else if (selected.length > aMaxRows)
         {
            alert(applicationResources.getPropertyWithParameters("general.tooManyRowsSelected", [aMaxRows]));
            return null;
         }
         else
         {
            var nodeIds = new Array();
            for (var i = 0; i < selected.length; ++i)
            {
               //if (selected[i].data.status > 0)
               if ((!aPredicate) || aPredicate.matches(selected[i]))
               {
                  nodeIds.push(selected[i].data.id);
               }
            }
            return nodeIds;
         }

      },

      /**
      * refreshes the RER grid
      */
      refreshContentsGrid: function()
      {
         this.contentsGrid.getStore().reload( {
            params: this.getFetchParams(),
            scope:this
         });
      },

       getFilterParams: function()
       {
          return this.currentFilterParams ? this.currentFilterParams : {};
       },

      //Sets the intial paging parameters.  Must be forced to int values for the Pagination toolbar
      getFetchParams: function() {
         var filter = this.getFilterParams();

         return Ext.applyIf({
            start : 0,
            limit : UserPreference.getItemsPerPage()
         },
         filter);
      },

      /**
       * update the params passed to this screen
       */
      updateParameters: function (aParams)
      {
         if (this.currentParams != aParams)
         {
            this.currentParams = aParams;

            var nvPairs = this.currentParams.split("&");

            var name;
            for (var i = 0; i < nvPairs.length; ++i)
            {
               name = JsUtil.substringBeforeFirst(nvPairs[i], "=");

               var formElement = Ext.get(name);
               if (formElement)
               {
                  var value = JsUtil.substringAfterFirst(nvPairs[i], "=");
                  //formElement.value = value;
                  (document.forms[0])[name].value = value;
               }
            }

            this.refreshContentsGrid();
         }
      },

      /**
       * utility method to create toolbar button
       */
      createToolbarButton: function  (aButtonId, aButtonIcon, aHandler, aButtonName, anEnableToggle)
      {
         return { id: aButtonId,
            text: aButtonName == null ? "" : aButtonName,
            handler: aHandler,
            scope: this,
            enableToggle:anEnableToggle,
            cls: 'x-btn-text-icon',
            icon:  ServerEnvironment.baseUrl + "/images/silkIcons/" + aButtonIcon
         };
      },

       onScheduleRowClicked: function(aGrid, aRowIndex, aEventObject)
       {
          var selectedRows = this.contentsGrid.getSelectionModel().getSelections();
          if (selectedRows.length == 0)
          {
             this.propertiesPanel.update(applicationResources.getProperty("propertiesPanel.blankProperties"));
          }
          else if (selectedRows.length == 1)
          {
             var details = this.detailsTpl.apply(selectedRows[0].data);
             this.propertiesPanel.update(details);
          }
          else
          {
             this.propertiesPanel.update(applicationResources.getProperty("propertiesPanel.multipleItemsSelected"));
          }
       }

    };

}();

var workspaceUi = Adf.scheduleContentsUi;