/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

Adf.ScheduleFilterPanel = Ext.extend(Ext.FormPanel, {
   constructor : function(aConfig)
   {
      aConfig = Ext.apply({

         frame:true,
         width: 600,
         height:340,
         layout: 'absolute',
         items: [
            { x:5  , y:8,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.userName') }
            ,{ x:128 , y:5,  xtype: 'textfield', name: 'userName', fieldLabel: applicationResources.getProperty('outputFilterDialog.userName'), width: 100 }

            ,{ x:5  , y:33,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.reportName') }
            ,{ x: 128, y:30, xtype: 'textfield', name: 'targetName', fieldLabel: applicationResources.getProperty('outputFilterDialog.reportName'), width: 312 }

            ,{ x:5  , y:63,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.scheduleName') + ":" }
            ,{ x: 128, y:60, xtype: 'textfield', name: 'scheduleName', fieldLabel: applicationResources.getProperty('outputFilterDialog.scheduleName'), width: 312 }

            ,{ x: 5,   y: 93,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.startDate') }
            ,{ x: 128, y: 90, xtype: 'datefield', name:'startDate', width:100, format:'m/d/y'}
            ,{ x: 240, y: 90, xtype: 'timefield', name:'startTime', width:80 }

            ,{ x: 5,   y: 123,  xtype: 'label', text: applicationResources.getProperty('outputFilterDialog.endDate') }
            ,{ x: 128, y: 120, xtype: 'datefield', name:'endDate', width:100, format: 'm/d/y'}
            ,{ x: 240, y: 120, xtype: 'timefield', name:'endTime', width:80 }

            ,{ x: 5,   y: 170, xtype: 'checkbox', name :'cbNormal', fieldLabel: applicationResources.getProperty('rcl.sse.normal') }
            ,{ x: 25,   y: 174,  xtype: 'label', text: applicationResources.getProperty('rcl.sse.normal') }

            ,{ x: 5,   y: 190, xtype: 'checkbox', name :'cbPaused', fieldLabel: applicationResources.getProperty('rcl.sse.paused') }
            ,{ x: 25,   y: 194,  xtype: 'label', text: applicationResources.getProperty('rcl.sse.paused') }

            ,{ x: 175,   y: 170, xtype: 'checkbox', name :'cbComplete', fieldLabel: applicationResources.getProperty('rcl.sse.complete') }
            ,{ x: 195,   y: 174,  xtype: 'label', text: applicationResources.getProperty('rcl.sse.complete') }

            ,{ x: 175,   y: 190, xtype: 'checkbox', name :'cbError', fieldLabel: applicationResources.getProperty('rcl.sse.error') }
            ,{ x: 195,   y: 194,  xtype: 'label', text: applicationResources.getProperty('rcl.sse.error') }

            ,{ x: 345,   y: 170, xtype: 'checkbox', name :'cbBlocked', fieldLabel: applicationResources.getProperty('rcl.sse.blocked') }
            ,{ x: 365,   y: 174,  xtype: 'label', text: applicationResources.getProperty('rcl.sse.blocked') }

            ,{ x: 345,   y: 190, xtype: 'checkbox', name :'cbNone', fieldLabel: applicationResources.getProperty('rcl.sse.none') }
            ,{ x: 365,   y: 194,  xtype: 'label', text: applicationResources.getProperty('rcl.sse.none') }

            ,{ x: 5,   y: 250, xtype: 'checkbox', name :'cbExecuted', fieldLabel: applicationResources.getProperty('browseSchedules.filter.executed') }
            ,{ x: 25,   y: 255,  xtype: 'label', text: applicationResources.getProperty('browseSchedules.filter.executed') }

            ,{ x: 225,   y: 250, xtype: 'checkbox', name :'cbWillExecute', fieldLabel: applicationResources.getProperty('browseSchedules.filter.willExecute') }
            ,{ x: 245,   y: 255,  xtype: 'label', text: applicationResources.getProperty('browseSchedules.filter.willExecute') }
         ]
      }, aConfig);

      Adf.ScheduleFilterPanel.superclass.constructor.call(this, aConfig);
   }
});

Adf.ScheduleFilterWindow = Ext.extend(Ext.Window, {
   constructor : function(aConfig)
   {
      this.filterCallBack = aConfig.filterCallBack;
      this.filterCallBackScope = aConfig.filterCallBackScope;
      this.filterCommandContext = aConfig.filterCommandContext;

      var filterFormPanel = new Adf.ScheduleFilterPanel();

      aConfig = Ext.apply({
         title: applicationResources.getProperty('outputFilterDialog.title'),
         width: 500,
         height:330,
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

               var statusHtml = '';
               var status = [];
               if (filterForm.findField("cbNormal").getValue())
               {
                  status.push(0);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('rcl.sse.normal'));
               }

               if (filterForm.findField("cbPaused").getValue())
               {
                  status.push(1);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('rcl.sse.paused'));
               }

               if (filterForm.findField("cbComplete").getValue())
               {
                  status.push(2);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('rcl.sse.complete'));
               }

               if (filterForm.findField("cbError").getValue())
               {
                  status.push(3);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('rcl.sse.error'));
               }

               if (filterForm.findField("cbBlocked").getValue())
               {
                  status.push(4);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('rcl.sse.blocked'));
               }

               if (filterForm.findField("cbNone").getValue())
               {
                  status.push(5);
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('rcl.sse.none'));
               }

               if(!Ext.isEmpty(statusHtml))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('status', applicationResources.getProperty('browseSchedules.filter.scheduleStatus'), statusHtml);
               }

               var params = {};

               if (status.length > 0)
               {
                  params['status'] = status;
               }

               statusHtml = '';
               if (filterForm.findField("cbExecuted").getValue())
               {
                  params['showExecuted'] = true;
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('browseSchedules.filter.executed'));
               }

               if (filterForm.findField("cbWillExecute").getValue())
               {
                  params['showWillExecute'] = true;
                  statusHtml += this.formatStatusString(statusHtml, applicationResources.getProperty('browseSchedules.filter.willExecute'));
               }

               if(!Ext.isEmpty(statusHtml))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('showExecuted', applicationResources.getProperty('browseSchedules.filter.scheduleExecution'), statusHtml);
               }

               // Note: This version of the getValue() method returns an empty string if the value is null/undefined.
               var startDateValue = filterForm.findField("startDate").getValue();
               var endDateValue = filterForm.findField("endDate").getValue();

               var datePattern = UserPreference.getExtDateFormat() + " " + UserPreference.getExtTimeFormat();
               // The following parameters are added this way so the value will be null in the form when the
               // parameter is null. Ext.urlEncode for some reason strips explicit null values which the action
               // is specifically looking for so in order to get the null value in the form, the parameter is not
               // added to list of the URL parameters.
               var startDate;
               var endDate;

               if (startDateValue != null && startDateValue != "")
               {
                  startDate = this.getDateValue(filterForm.findField("startDate"), filterForm.findField("startTime"), true);
                  params['startDate'] = startDate.format("U");
               }
               else
               {
                  params['startDate'] = this.getDateValue(null, null, true);
               }

               if (endDateValue != null && endDateValue != "")
               {
                  endDate = this.getDateValue(filterForm.findField("endDate"), filterForm.findField("endTime"), false);
                  params['endDate'] = endDate.format("U");
               }
               else
               {
                  params['endDate'] = this.getDateValue(null, null, false);
               }

               if(!Ext.isEmpty(startDateValue) && Ext.isEmpty(endDateValue))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('startDate', applicationResources.getProperty('outputFilterDialog.dateRange'), "After " + startDate.format(datePattern) );
               }
               else if(Ext.isEmpty(startDateValue) && !Ext.isEmpty(endDateValue))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('startDate', applicationResources.getProperty('outputFilterDialog.dateRange'), "Before " + endDate.format(datePattern) );
               }
               else if(!Ext.isEmpty(startDateValue) && !Ext.isEmpty(endDateValue))
               {
                  filterCount++;
                  filterHtml += this.createFilterHtml('startDate', applicationResources.getProperty('outputFilterDialog.dateRange'), "Between " + startDate.format(datePattern) + " and " + endDate.format(datePattern) );
               }

               var userNameValue = filterForm.findField("userName").getValue();
               if (userNameValue.length > 0)
               {
                  params['logon'] = userNameValue;
                  filterCount++;
                  filterHtml += this.createFilterHtml('logon', applicationResources.getProperty('outputFilterDialog.logon'), userNameValue );
               }

               var targetNameValue = filterForm.findField("targetName").getValue();
               if (targetNameValue.length)
               {
                  params['targetName'] = targetNameValue;
                  filterCount++;
                  filterHtml += this.createFilterHtml('targetName', applicationResources.getProperty('outputFilterDialog.targetName'), targetNameValue );
               }

               var scheduleNameValue = filterForm.findField("scheduleName").getValue();
               if (scheduleNameValue.length)
               {
                  params['scheduleName'] = scheduleNameValue;
                  filterCount++;
                  filterHtml += this.createFilterHtml('scheduleName', applicationResources.getProperty('outputFilterDialog.scheduleName'), scheduleNameValue );
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

      Adf.ScheduleFilterWindow.superclass.constructor.call(this, aConfig);
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

   getDateValue: function(aDatePicker, aTimePicker, aStartDate)
   {
      var result;

      if(aDatePicker)
      {
         result = aDatePicker.getValue();
      }

      if(Ext.isEmpty(result))
      {
         result = (aStartDate?new Date(1970, 0, 1, 0, 0, 0):new Date().add(Date.DAY, 1));
      }

      if(aTimePicker)
      {
         var time = Date.parseDate(aTimePicker.getValue(), aTimePicker.format);

         if(!Ext.isEmpty(time))
         {
            result.setHours(time.getHours());
            result.setMinutes(time.getMinutes());
            result.setSeconds(time.getSeconds());
         }
      }

      return result;
   },

   createFilterHtml: function(aFilterName, aFilterTitle, aFilterLabel)
   {
      return "<div id='" + aFilterName + "' class='filterUiEntry'><span class='filterTitle'>"
            + aFilterTitle + "</span><span class='filterValue'>"
            + aFilterLabel + "</span><span class='closeLink'><a href='javascript:" + this.filterCommandContext + ".removeFilter(\"" + aFilterName + "\");'>(x)</a></span></div>";
   }
});