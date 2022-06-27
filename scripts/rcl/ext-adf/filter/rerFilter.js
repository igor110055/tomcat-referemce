/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

Adf.RerFilterPanel = Ext.extend(Ext.FormPanel, {
   constructor : function(aConfig)
   {
      aConfig = Ext.apply({

         frame:true,
         width: 600,
         height:400,
         layout: 'absolute',
         items: [
            { x:5  , y:8,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.userName') }
            ,{ x:128 , y:5,  xtype: 'textfield', name: 'userName', fieldLabel: applicationResources.getProperty('outputFilterDialog.userName'), width: 100 }

            ,{ x:275  , y:8,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.requestId') }
            ,{ x:340, y:5, xtype: 'textfield', name: 'rerId', fieldLabel: applicationResources.getProperty('outputFilterDialog.requestId'), width: 100 }

            ,{ x:5  , y:33,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.reportName') }
            ,{ x: 128, y:30, xtype: 'textfield', name: 'targetName', fieldLabel: applicationResources.getProperty('outputFilterDialog.reportName'), width: 312 }

            ,{ x:5  , y:63,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.targetReportName') }
            ,{ x: 128, y:60, xtype: 'textfield', name: 'targetReportName', fieldLabel: applicationResources.getProperty('outputFilterDialog.targetReportName'), width: 312 }

            ,{ x: 5,   y: 93,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.startDate') }
            ,{ x: 128, y: 90, xtype: 'datefield', name:'startDate', width:100, format:'m/d/y'}
            ,{ x: 240, y: 90, xtype: 'timefield', name:'startTime', width:80 }

            ,{ x: 5,   y: 123,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.endDate') }
            ,{ x: 128, y: 120, xtype: 'datefield', name:'endDate', width:100, format: 'm/d/y'}
            ,{ x: 240, y: 120, xtype: 'timefield', name:'endTime', width:80 }

            ,{ x: 5,   y: 170, xtype: 'checkbox', name :'cbPendingPreExecution', fieldLabel: applicationResources.getProperty('outputFilterDialog.pendingPreExecution') }
            ,{ x: 25,   y: 175,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.pendingPreExecution') }

            ,{ x: 5,   y: 190, xtype: 'checkbox', name :'cbPreExecution', fieldLabel: applicationResources.getProperty('outputFilterDialog.preExecution') }
            ,{ x: 25,   y: 195,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.preExecution') }

            ,{ x: 5,   y: 210, xtype: 'checkbox', name :'cbPendingExecution', fieldLabel: applicationResources.getProperty('outputFilterDialog.pendingExecution') }
            ,{ x: 25,   y: 215,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.pendingExecution') }

            ,{ x: 5,   y: 230, xtype: 'checkbox', name :'cbExecuting', fieldLabel: applicationResources.getProperty('outputFilterDialog.executing') }
            ,{ x: 25,   y: 235,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.executing') }

            ,{ x: 175,   y: 170, xtype: 'checkbox', name :'cbPendingDownload', fieldLabel: applicationResources.getProperty('outputFilterDialog.pendingDownload') }
            ,{ x: 195,   y: 175,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.pendingDownload') }

            ,{ x: 175,   y: 190, xtype: 'checkbox', name :'cbDownloading', fieldLabel: applicationResources.getProperty('outputFilterDialog.downloading') }
            ,{ x: 195,   y: 195,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.downloading') }

            ,{ x: 175,   y: 210, xtype: 'checkbox', name :'cbPendingPostExecution', fieldLabel: applicationResources.getProperty('outputFilterDialog.pendingPostExecution') }
            ,{ x: 195,   y: 215,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.pendingPostExecution') }

            ,{ x: 175,   y: 230, xtype: 'checkbox', name :'cbPostExecution', fieldLabel: applicationResources.getProperty('outputFilterDialog.postExecution') }
            ,{ x: 195,   y: 235,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.postExecution') }

            ,{ x: 345,   y: 170, xtype: 'checkbox', name :'cbFinished', fieldLabel: applicationResources.getProperty('outputFilterDialog.finished') }
            ,{ x: 365,   y: 175,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.finished') }

            ,{ x: 345,   y: 190, xtype: 'checkbox', name :'cbFailed', fieldLabel: applicationResources.getProperty('outputFilterDialog.failed') }
            ,{ x: 365,   y: 195,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.failed') }

            ,{ x: 345,   y: 210, xtype: 'checkbox', name :'cbCancelled', fieldLabel: applicationResources.getProperty('outputFilterDialog.cancelled') }
            ,{ x: 365,   y: 215,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.cancelled') }

            ,{ x: 5,     y: 270, xtype: 'checkbox', name: 'cbShowDrills', fieldLabel: applicationResources.getProperty('outputFilterDialog.radio.showDrillThroughs') }
            ,{ x: 25,    y: 275, xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.radio.showDrillThroughs') }
         ]
      }, aConfig);

      Adf.RerFilterPanel.superclass.constructor.call(this, aConfig);
   }
});

Adf.RerFilterWindow = Ext.extend(Ext.Window, {
   constructor : function(aConfig)
   {
      this.filterCallBack = aConfig.filterCallBack;
      this.filterCallBackScope = aConfig.filterCallBackScope;
      this.filterCommandContext = aConfig.filterCommandContext;

      var filterFormPanel = new Adf.RerFilterPanel();

      aConfig = Ext.apply({
         title: applicationResources.getProperty('outputFilterDialog.title'),
         width: 500,
         height:400,
         resizable:false,
         layout: 'fit',
         modal:true,
         bodyStyle:'padding:5px;',
         buttonAlign:'center',
         closable: true,
         closeAction: 'hide',
         items: filterFormPanel,
         buttons: [{
            text: applicationResources.getProperty('outputFilterDialog.button.filter'),
            scope: this,
            handler: function ()
            {
               var filterCount = 0;
               var filterHtml = '';

               var filterForm = filterFormPanel.getForm();

               // Note: This version of the getValue() method returns an empty string if the value is null/undefined.
               var startDateValue = filterForm.findField("startDate").getValue();
               var endDateValue = filterForm.findField("endDate").getValue();

               var datePattern = "Y-m-d H:i:sO";

               var statusHtml = '';
               var status = [];
               if (filterForm.findField("cbPendingPreExecution").getValue())
               {
                  status.push(ReportExecutionStatusEnum.PENDING_PRE_EXECUTION.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.pendingPreExecution'));
               }

               if (filterForm.findField("cbPreExecution").getValue())
               {
                  status.push(ReportExecutionStatusEnum.PRE_EXECUTION.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.preExecution'));
               }

               if (filterForm.findField("cbPendingExecution").getValue())
               {
                  status.push(ReportExecutionStatusEnum.PENDING_EXECUTION.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.pendingExecution'));
               }

               if (filterForm.findField("cbExecuting").getValue())
               {
                  status.push(ReportExecutionStatusEnum.EXECUTING.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.executing'));
               }

               if (filterForm.findField("cbPendingDownload").getValue())
               {
                  status.push(ReportExecutionStatusEnum.PENDING_DOWNLOAD.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.pendingDownload'));
               }

               if (filterForm.findField("cbDownloading").getValue())
               {
                  status.push(ReportExecutionStatusEnum.DOWNLOADING_OUTPUTS.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.downloading'));
               }

               if (filterForm.findField("cbPendingPostExecution").getValue())
               {
                  status.push(ReportExecutionStatusEnum.PENDING_POST_EXECUTION.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.pendingPostExecution'));
               }

               if (filterForm.findField("cbPostExecution").getValue())
               {
                  status.push(ReportExecutionStatusEnum.POST_EXECUTION.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.postExecution'));
               }

               if (filterForm.findField("cbFinished").getValue())
               {
                  status.push(ReportExecutionStatusEnum.FINISHED.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.finished'));
               }

               if (filterForm.findField("cbFailed").getValue())
               {
                  status.push(ReportExecutionStatusEnum.FAILED.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.failed'));
               }

               if (filterForm.findField("cbCancelled").getValue())
               {
                  status.push(ReportExecutionStatusEnum.CANCELLED.value);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('outputFilterDialog.cancelled'));
               }

               if(!Ext.isEmpty(statusHtml))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('status', applicationResources.getProperty('outputFilterDialog.reportStatus'), statusHtml);
               }

               var params = {};

               var rerIdValue = filterForm.findField("rerId").getValue();
               if (rerIdValue.length > 0)
               {
                  var rerIds = new Array();
                  rerIds.push(rerIdValue);
                  params['rerId'] = rerIds;

                  filterCount++;
                  filterHtml += this.createFilterHtml('rerId', applicationResources.getProperty('outputFilterDialog.rerIds'), rerIdValue);
               }

               if (status.length > 0)
               {
                  params['status'] = status;
               }

               // The following parameters are added this way so the value will be null in the form when the
               // parameter is null. Ext.urlEncode for some reason strips explicit null values which the action
               // is specifically looking for so in order to get the null value in the form, the parameter is not
               // added to list of the URL parameters.
               var startDateString = '';
               var endDateString = '';

               if (startDateValue != null && startDateValue != "")
               {
                  params['startDate'] = startDateValue.format(datePattern);
                  startDateString = params['startDate'];
               }
               if (endDateValue != null && endDateValue != "")
               {
                  params['endDate'] = endDateValue.format(datePattern);
                  endDateString = params['endDate'];
               }
               var startTimeValue = filterForm.findField("startTime").getValue();
               if (startTimeValue.length > 0)
               {
                  params['startTime'] = startTimeValue;
                  startDateString += ' ' + params['startTime'];
               }
               var endTimeValue = filterForm.findField("endTime").getValue();
               if (endTimeValue.length > 0)
               {
                  params['endTime'] = endTimeValue;
                  endDateString += ' ' + params['endTime'];
               }
               if(!Ext.isEmpty(startDateString) && Ext.isEmpty(endDateString))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('startDate', applicationResources.getProperty('outputFilterDialog.dateRange'), "After " + startDateString);
               }
               else if(Ext.isEmpty(startDateString) && !Ext.isEmpty(endDateString))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('startDate', applicationResources.getProperty('outputFilterDialog.dateRange'), "Before " + endDateString);
               }
               else if(!Ext.isEmpty(startDateString) && !Ext.isEmpty(endDateString))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('startDate', applicationResources.getProperty('outputFilterDialog.dateRange'), "Between " + startDateString + " and " + endDateString);
               }

               var userNameValue = filterForm.findField("userName").getValue();
               if (userNameValue.length > 0)
               {
                  params['logon'] = userNameValue;
                  filterCount++;
                  filterHtml += this.createFilterHtml('logon', applicationResources.getProperty('outputFilterDialog.logon'), userNameValue);
               }

               var targetNameValue = filterForm.findField("targetName").getValue();
               if (targetNameValue.length)
               {
                  filterHtml += this.createFilterHtml('targetName', applicationResources.getProperty('outputFilterDialog.targetName'), targetNameValue);
                  filterCount++;
                  params['targetName'] = targetNameValue;
               }

               var targetReportNameValue = filterForm.findField("targetReportName").getValue();
               if (targetReportNameValue.length)
               {
                  filterHtml += this.createFilterHtml('targetReportName', applicationResources.getProperty('outputFilterDialog.targetReportName'), targetReportNameValue);
                  filterCount++;
                  params['targetReportName'] = targetReportNameValue;
               }

               var displayDrillValue = filterForm.findField("cbShowDrills").getValue();
               if(displayDrillValue)
               {
                  filterHtml += this.createFilterHtml('drillDisplay', applicationResources.getProperty('outputFilterDialog.displayDrill'), displayDrillValue);
                  filterCount++;
                  params['drillDisplay'] = displayDrillValue;
               }

               if(filterCount > 0)
               {
                  filterHtml = "<div class='filterHeaderDiv'><span class='filterHeader'>" + applicationResources.getProperty('outputFilterDialog.filterHeader') + ":</span></div>" + filterHtml;
               }
               params['filterHtml'] = filterHtml;
               params['filterCount'] = filterCount;

               // Add some extra default filter values if the user has selected some filter values.
               var isEmpty = true;
               for (var name in params)
               {
                  isEmpty = false;
                  break;
               }

               if (!isEmpty)
               {
                  Ext.apply(params, {
                     isCancelled: false,
                     filterRers: true
                  });
               }

               this.filterCallBack.call(this.filterCallBackScope, params);

               this.hide();
            }
         },
         {
            text: applicationResources.getProperty('button.reset'),
            scope: this,
            handler: function ()
            {
               filterFormPanel.getForm().reset();
            }
         },
         {
            text: applicationResources.getProperty('button.Cancel'),
            scope: this,
            handler: function ()
            {
               this.hide();
            }
         }]
      }, aConfig);

      Adf.RerFilterWindow.superclass.constructor.call(this, aConfig);
   },

   formatStatusString : function(aContainingString, aValue)
   {
      if(!Ext.isEmpty(aContainingString))
      {
         return "<span class='separatedList'>" + aValue + "</span>";
      }
      else
      {
         return "<span class='separatedListFirstItem'>" + aValue + "</span>";
      }
   },

   createFilterHtml: function(aFilterName, aFilterTitle, aFilterLabel)
   {
      return "<div id='" + aFilterName + "' class='filterUiEntry'><span class='filterTitle'>"
            + aFilterTitle + "</span><span class='filterValue'>"
            + aFilterLabel + "</span><span class='closeLink'><a href='javascript:" + this.filterCommandContext + ".removeFilter(\"" + aFilterName + "\");'>(x)</a></span></div>";
   }
});