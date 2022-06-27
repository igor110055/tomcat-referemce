var ScheduleWizard =
{
   launch: function(aProperties)
   {
      var foldersFieldSet = new Ext.tree.TreePanel({
               flex: .85,
               title: applicationResources.getProperty("scheduleWizard.folders.title"),
               autoScroll: true,
               loader: new Ext.tree.TreeLoader({
                  dataUrl: ServerEnvironment.baseUrl + "/secure/actions/ext/navMenu.do"
               }),
               rootVisible: false,
               root: new Ext.tree.AsyncTreeNode({
                  text: applicationResources.getProperty("scheduleWizard.rootTargetTreeNode"),
                  expanded: true,
                  id: "-99"
               }),
               selModel: new Ext.tree.DefaultSelectionModel({
                  listeners: {
                     selectionchange: function(thisSelectionModel, aNode)
                     {
                        if(aNode)
                        {
                           pagingToolbar.folderId = aNode.id;
                           availableReportsStore.load({
                              params: {
                                 folderId: aNode.id,
                                 start: 0,
                                 limit: ServerEnvironment.extPageSize
                              }
                           });
                        }
                     }
                  }
               })
            });

      var availableReportsStore = new Ext.data.JsonStore({
         url: ServerEnvironment.baseUrl + '/secure/actions/ext/fetchFolderContents.do',
         fields: ['id', 'name', 'category', 'type', 'parentId', 'isPublic', 'prompt', 'isOffline'],
         root: "folderContents",
         sortInfo: {field: "name", direction: "ASC"},
         totalProperty: "totalCount"
      });

      var pagingToolbar = new Ext.PagingToolbar({
         pageSize: ServerEnvironment.extPageSize,
         store: availableReportsStore,
         listeners: {
            beforechange: function(thisPagingToolbar, aParams)
            {
               aParams.folderId = thisPagingToolbar.folderId;
            }
         }
      });

      pagingToolbar.refresh.hide();
      pagingToolbar.refresh.hide();

      var availableReportsNameColumnId = Ext.id();

      var availableReportsGrid = new Ext.grid.GridPanel({
         title: applicationResources.getProperty("scheduleWizard.availableTargets.title"),
         flex: 1,
         store: availableReportsStore,
         columns: [{id: availableReportsNameColumnId, dataIndex: "name"}],
         autoExpandColumn: availableReportsNameColumnId,
         hideHeaders: true,
         bbar: pagingToolbar
      });

      var buttonsPanel = new Ext.Panel({
         width: 25,
         layout: "vbox",
         layoutConfig: {
            pack: "center"
         },
         border: false,
         items: [{
            xtype: "button",
            text: ">>",
            margins: "3px",
            handler: function()
            {
               var addRecords = availableReportsGrid.getSelectionModel().getSelections();
               var addData = [];
               for(var i=0;i<addRecords.length;i++)
               {
                  if(!selectedReportsStore.getById(addRecords[i].id))
                  {
                     addData.push(addRecords[i].data);
                  }
               }
               selectedReportsStore.loadData(addData, true);
            }
         },{
            xtype: "button",
            text: "<<",
            margins: "3px",
            handler: function()
            {
               selectedReportsStore.remove(selectedReportsGrid.getSelectionModel().getSelections());
            }
         }]
      });

      var selectedReportsStore = new Ext.data.JsonStore({
         fields: ['id', 'name', 'category', 'type', 'parentId', 'isPublic', 'prompt', 'isOffline'],
         sortInfo: {field: "name", direction: "ASC"}
      });

      selectedReportsStore.loadData(aProperties.targets);

      var selectedReportsNameColumnId = Ext.id();

      var selectedReportsGrid = new Ext.grid.GridPanel({
         title: applicationResources.getProperty("scheduleWizard.selectedTargets.title"),
         flex: 1,
         store: selectedReportsStore,
         columns: [{id: selectedReportsNameColumnId, dataIndex: "name"}],
         autoExpandColumn: selectedReportsNameColumnId,
         hideHeaders: true
      });

      var nameField = new Ext.form.TextField({
         xtype: "textfield",
         fieldLabel: "<b>" + applicationResources.getProperty("folderContents.name") + "</b>",
         style: {marginTop: "2px", marginBottom: "2px"},
         width: 500,
         maxLength: 128,
         allowBlank: false,
         autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: 128},
         value: aProperties.scheduleName ? aProperties.scheduleName : this.createScheduleName(aProperties.targets[0].name)
      });

      var reportsPanel = new Ext.Panel({
         title: applicationResources.getProperty("scheduleWizard.rootTargetTreeNode"),
         layout: "vbox",
         layoutConfig: {
            align: "stretch"
         },
         items: [{
            xtype: "form",
            height: 35,
            border: false,
            labelWidth: 50,
            items: [nameField]
         },{
            border: false,
            layout: "hbox",
            flex: 1,
            layoutConfig: {
               align: "stretch"
            },
            items: [
               foldersFieldSet,
               availableReportsGrid,
               buttonsPanel,
               selectedReportsGrid
            ]
         }],
         listeners: {
            activate: function()
            {
               previousButton.disable();
               nextButton.enable();
            }
         }
      });

      var onceRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleTypeEnum.once"),
         name: "timingSettingsType",
         inputValue: "0"
      });

      var dailyRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleTypeEnum.daily"),
         name: "timingSettingsType",
         inputValue: "2"
      });

      var weeklyRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleTypeEnum.weekly"),
         name: "timingSettingsType",
         inputValue: "3"
      });

      var monthlyRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleTypeEnum.monthly"),
         name: "timingSettingsType",
         inputValue: "4"
      });

      var yearlyRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleTypeEnum.yearly"),
         name: "timingSettingsType",
         inputValue: "5"
      });

      var typeRadioGroup = new Ext.form.RadioGroup({
         xtype: "radiogroup",
         columns: 1,
         hideLabel: true,
         items: [
            onceRadio,
            dailyRadio,
            weeklyRadio,
            monthlyRadio,
            yearlyRadio
         ],
         value: aProperties.scheduleType ? aProperties.scheduleType : "0",
         listeners: {
            change: function(thisRadioGroup, aRadio)
            {
               if(aRadio == onceRadio)
               {
                  timingSettingsFieldSet.getLayout().setActiveItem(onceCard);
               }
               if(aRadio == dailyRadio)
               {
                  timingSettingsFieldSet.getLayout().setActiveItem(dailyCard);
               }
               if(aRadio == weeklyRadio)
               {
                  timingSettingsFieldSet.getLayout().setActiveItem(weeklyCard);
               }
               if(aRadio == monthlyRadio)
               {
                  timingSettingsFieldSet.getLayout().setActiveItem(monthlyCard);
               }
               if(aRadio == yearlyRadio)
               {
                  timingSettingsFieldSet.getLayout().setActiveItem(yearlyCard);
               }
            }
         }
      });

      var typeFieldSet = {
         xtype: "fieldset",
         layout: "form",
         region: "west",
         width: 100,
         title: applicationResources.getProperty("scheduleWizard.wizardBar.type"),
         items: [typeRadioGroup]
      };

      var onceStartDate = new Ext.form.DateField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startDate.title"),
         allowBlank: false,
         minValue: new Date().clearTime(),
         value: aProperties.startDate ? aProperties.startDate : new Date().clearTime()
      });

      var onceStartTime = new Ext.form.TimeField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startTime.title"),
         value: aProperties.startTime ? aProperties.startTime : new Date().add(Date.HOUR, 1),
         allowBlank: false
      });

      var onceCard = new Ext.FormPanel({
         items: [onceStartDate, onceStartTime],
         validateCard: function()
         {
            if(!onceStartDate.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartDateExt"));
               return false;
            }

            if(!onceStartTime.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartTimeExt"));
               return false;
            }

            if(Date.parseDate(onceStartDate.getValue().format("Y-m-d") + " " + onceStartTime.getValue(), "Y-m-d g:i A") <= new Date())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.startInPast"));
               return false;
            }

            return true;
         }
      });

      var dailyFrequencyValueField = new Ext.form.NumberField({
         allowBlank: false,
         allowDecimals: false,
         allowNegative: false,
         minValue: 1,
         value: aProperties.dailyInterval ? aProperties.dailyInterval : 1,
         width: 30
      });

      var dailyFrequencyTypeCombo = new Ext.form.ComboBox({
         triggerAction: "all",
         mode: "local",
         lazyRender: true,
         editable: false,
         width: 80,
         store: new Ext.data.ArrayStore({
            id: 0,
            fields: ["dailyRate", "frequencyType"],
            data: [["minutes", applicationResources.getProperty("scheduler.minutes")], ["hours", applicationResources.getProperty("scheduler.hours")], ["days", applicationResources.getProperty("scheduler.days")]]
         }),
         valueField: "dailyRate",
         displayField: "frequencyType",
         value: aProperties.dailyRate ? aProperties.dailyRate : "minutes"
      });

      var dailyFrequencyField = new Ext.form.CompositeField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.interval"),
         items: [{
            xtype: "displayfield",
            value: applicationResources.getProperty("scheduler.Every"),
            style: {paddingTop:"4px", paddingBottom: "4px"}
         }, dailyFrequencyValueField,
            dailyFrequencyTypeCombo
         ]
      });

      var dailyStartDate = new Ext.form.DateField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startDate.title"),
         allowBlank: false,
         minValue: new Date().clearTime(),
         value: aProperties.startDate ? aProperties.startDate : new Date().clearTime()
      });

      var dailyStartTime = new Ext.form.TimeField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startTime.title"),
         value: aProperties.startTime ? aProperties.startTime : new Date().add(Date.HOUR, 1),
         allowBlank: false
      });

      var dailyRunUntilDeletedRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleWizard.runIndefinitely"),
         fieldLabel: applicationResources.getProperty("scheduleWizard.endCondition"),
         name: "dailyEndCondition",
         checked: (!aProperties.numberOfExecutions || aProperties.numberOfExecutions < 0) && !aProperties.endDate
      });

      var dailyNumberOfExecutionsRadio = new Ext.form.Radio({
         name: "dailyEndCondition",
         boxLabel: applicationResources.getProperty("scheduleWizard.numberOfExecutions"),
         checked: aProperties.numberOfExecutions > 0
      });

      var dailyNumberOfExecutionsField = new Ext.form.NumberField({
         allowBlank: false,
         allowDecimals: false,
         allowNegative: false,
         minValue: 1,
         value: aProperties.numberOfExecutions > 0 ? aProperties.numberOfExecutions : 1,
         width: 30
      });

      var dailyNumberOfExecutionsComposite = new Ext.form.CompositeField({
         items: [dailyNumberOfExecutionsRadio, dailyNumberOfExecutionsField],
         labelSeparator: "",
         buildLabel: function()
         {
            return "";
         }
      });

      var dailyEndDateRadio = new Ext.form.Radio({
         name: "dailyEndCondition",
         boxLabel: applicationResources.getProperty("scheduleWizard.endDate.label"),
         checked: aProperties.endDate
      });

      var dailyEndDateField = new Ext.form.DateField({
         allowBlank: false,
         minValue: new Date().add(Date.DAY, 1).clearTime(),
         value: aProperties.endDate ? aProperties.endDate : new Date().add(Date.DAY, 1).clearTime()
      });

      var dailyEndDateComposite = new Ext.form.CompositeField({
         items: [dailyEndDateRadio, dailyEndDateField],
         labelSeparator: "",
         buildLabel: function()
         {
            return "";
         }
      });

      var dailyCard = new Ext.FormPanel({
         items: [
            dailyFrequencyField,
            dailyStartDate,
            dailyStartTime,
            dailyRunUntilDeletedRadio,
            dailyNumberOfExecutionsComposite,
            dailyEndDateComposite
         ],
         validateCard: function()
         {
            if(!dailyFrequencyField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.dailyInterval.lessThanEqualZero"));
               return false;
            }

            if(!dailyStartDate.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartDateExt"));
               return false;
            }

            if(!dailyStartTime.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartTimeExt"));
               return false;
            }

            if(Date.parseDate(dailyStartDate.getValue().format("Y-m-d") + " " + dailyStartTime.getValue(), "Y-m-d g:i A") <= new Date())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.startInPast"));
               return false;
            }

            if(dailyNumberOfExecutionsRadio.getValue() && !dailyNumberOfExecutionsField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.numberOfExecutions.lessThanEqualZero"));
               return false;
            }

            if(dailyEndDateRadio.getValue() && !dailyEndDateField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidEndDateExt"));
               return false;
            }

            if(dailyEndDateRadio.getValue() && dailyEndDateField.getValue() <= Date.parseDate(dailyStartDate.getValue().format("Y-m-d") + " " + dailyStartTime.getValue(), "Y-m-d g:i A"))
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduleWizrd.startAfterEnd"));
               return false;
            }

            return true;
         }
      });

      var weeklyFrequencyField = new Ext.form.NumberField({
         allowBlank: false,
         allowDecimals: false,
         allowNegative: false,
         minValue: 1,
         value: aProperties.weeklyInterval ? aProperties.weeklyInterval : 1,
         width: 30
      });

      var weeklyFrequencyComposite = new Ext.form.CompositeField({
         items: [{
            xtype: "displayfield",
            style: {paddingTop:"4px", paddingBottom: "4px"},
            value: applicationResources.getProperty("scheduler.Every")
         },
            weeklyFrequencyField, {
               xtype: "displayfield",
               style: {paddingTop:"4px", paddingBottom: "4px"},
               value: applicationResources.getProperty("scheduler.weeks")
            }],
         buildLabel: function()
         {
            return applicationResources.getProperty("scheduleWizard.interval");
         }
      });

      var daySelections = {};
      if(aProperties.weeklyDays)
      {
         for(var i=0;i<aProperties.weeklyDays.length;i++)
         {
            if(aProperties.weeklyDays[i] == "SUN")
               daySelections[0] = true;
            if(aProperties.weeklyDays[i] == "MON")
               daySelections[1] = true;
            if(aProperties.weeklyDays[i] == "TUE")
               daySelections[2] = true;
            if(aProperties.weeklyDays[i] == "WED")
               daySelections[3] = true;
            if(aProperties.weeklyDays[i] == "THU")
               daySelections[4] = true;
            if(aProperties.weeklyDays[i] == "FRI")
               daySelections[5] = true;
            if(aProperties.weeklyDays[i] == "SAT")
               daySelections[6] = true;
         }
      }
      else
      {
         daySelections[(new Date()).getDay()] = true;
      }

      var weeklyDaysOfWeekGroup = new Ext.form.CheckboxGroup({
         fieldLabel: "Days",
         columns: 4,
         items: [
            {boxLabel: applicationResources.getProperty("jsCalendar.sunday"), name: "weeklySundayCheckbox", checked: daySelections[0], inputValue: "SUN"},
            {boxLabel: applicationResources.getProperty("jsCalendar.monday"), name: "weeklyMondayCheckbox", checked: daySelections[1], inputValue: "MON"},
            {boxLabel: applicationResources.getProperty("jsCalendar.tuesday"), name: "weeklyTuesdayCheckbox", checked: daySelections[2], inputValue: "TUE"},
            {boxLabel: applicationResources.getProperty("jsCalendar.wednesday"), name: "weeklyWednesdayCheckbox", checked: daySelections[3], inputValue: "WED"},
            {boxLabel: applicationResources.getProperty("jsCalendar.thursday"), name: "weeklyThursdayCheckbox", checked: daySelections[4], inputValue: "THU"},
            {boxLabel: applicationResources.getProperty("jsCalendar.friday"), name: "weeklyFridayCheckbox", checked: daySelections[5], inputValue: "FRI"},
            {boxLabel: applicationResources.getProperty("jsCalendar.saturday"), name: "weeklySaturdayCheckbox", checked: daySelections[6], inputValue: "SAT"}
         ]
      });

      var weeklyStartDate = new Ext.form.DateField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startDate.title"),
         allowBlank: false,
         minValue: new Date().clearTime(),
         value: aProperties.startDate ? aProperties.startDate : new Date().clearTime()
      });

      var weeklyStartTime = new Ext.form.TimeField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startTime.title"),
         value: aProperties.startTime ? aProperties.startTime : new Date().add(Date.HOUR, 1),
         allowBlank: false
      });

      var weeklyRunUntilDeletedRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleWizard.runIndefinitely"),
         fieldLabel: applicationResources.getProperty("scheduleWizard.endCondition"),
         name: "weeklyEndCondition",
         checked: !aProperties.endDate
      });

      var weeklyEndDateRadio = new Ext.form.Radio({
         name: "weeklyEndCondition",
         boxLabel: applicationResources.getProperty("scheduleWizard.endDate.label"),
         checked: aProperties.endDate
      });

      var weeklyEndDateField = new Ext.form.DateField({
         allowBlank: false,
         minValue: new Date().add(Date.DAY, 1).clearTime(),
         value: aProperties.endDate ? aProperties.endDate : new Date().add(Date.DAY, 1).clearTime()
      });

      var weeklyEndDateComposite = new Ext.form.CompositeField({
         items: [weeklyEndDateRadio, weeklyEndDateField],
         labelSeparator: "",
         buildLabel: function()
         {
            return "";
         }
      });

      var weeklyCard = new Ext.form.FormPanel({
         items: [
            weeklyFrequencyComposite,
            weeklyDaysOfWeekGroup,
            weeklyStartDate,
            weeklyStartTime,
            weeklyRunUntilDeletedRadio,
            weeklyEndDateComposite
         ],
         validateCard: function()
         {
            if(!weeklyFrequencyField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.weeklyInterval.lessThanEqualZero"));
               return false;
            }

            if(!weeklyDaysOfWeekGroup.getValue() || weeklyDaysOfWeekGroup.getValue().length == 0)
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.weeklyDays.noDaysSelected"));
               return false;
            }

            if(!weeklyStartDate.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartDateExt"));
               return false;
            }

            if(!weeklyStartTime.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartTimeExt"));
               return false;
            }

            if(Date.parseDate(weeklyStartDate.getValue().format("Y-m-d") + " " + weeklyStartTime.getValue(), "Y-m-d g:i A") <= new Date())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.startInPast"));
               return false;
            }

            if(weeklyEndDateRadio.getValue() && !weeklyEndDateField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidEndDateExt"));
               return false;
            }

            if(weeklyEndDateRadio.getValue() && weeklyEndDateField.getValue() <= Date.parseDate(weeklyStartDate.getValue().format("Y-m-d") + " " + weeklyStartTime.getValue(), "Y-m-d g:i A"))
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduleWizrd.startAfterEnd"));
               return false;
            }

            return true;
         }
      });

      var monthlyByDayOfWeekRadio = new Ext.form.Radio({
         name: "monthlyScheduleType",
         boxLabel: applicationResources.getProperty("scheduler.The"),
         checked: !aProperties.monthlyType || (aProperties.monthlyType == "relative")
      });

      var monthlyOrdinalCombo = new Ext.form.ComboBox({
         triggerAction: "all",
         mode: "local",
         lazyRender: true,
         editable: false,
         width: 80,
         store: new Ext.data.ArrayStore({
            id: 0,
            fields: ["value", "ordinalValue"],
            data: [[1, applicationResources.getProperty("scheduler.first")], [2, applicationResources.getProperty("scheduler.second")], [3, applicationResources.getProperty("scheduler.third")], [4, applicationResources.getProperty("scheduler.fourth")]]
         }),
         valueField: "value",
         displayField: "ordinalValue",
         value: aProperties.monthlyWeek ? aProperties.monthlyWeek : Math.min(Math.floor((new Date().getDate() + 6) / 7), 4)
      });

      var getDayOfWeekFromString = function(aString)
      {
         if(aString == "SUN")
            return 0;
         if(aString == "MON")
            return 1;
         if(aString == "TUE")
            return 2;
         if(aString == "WED")
            return 3;
         if(aString == "THU")
            return 4;
         if(aString == "FRI")
            return 5;
         if(aString == "SAT")
            return 6;
      };

      var monthlyDayOfWeekCombo = new Ext.form.ComboBox({
         triggerAction: "all",
         mode: "local",
         lazyRender: true,
         editable: false,
         width: 90,
         store: new Ext.data.ArrayStore({
            id: 0,
            fields: ["value", "displayValue", "stringValue"],
            data: [[0, applicationResources.getProperty("jsCalendar.sunday"), "SUN"], [1, applicationResources.getProperty("jsCalendar.monday"), "MON"], [2, applicationResources.getProperty("jsCalendar.tuesday"), "TUE"], [3, applicationResources.getProperty("jsCalendar.wednesday"), "WED"], [4, applicationResources.getProperty("jsCalendar.thursday"), "THU"], [5, applicationResources.getProperty("jsCalendar.friday"), "FRI"], [6, applicationResources.getProperty("jsCalendar.saturday"), "SAT"]]
         }),
         valueField: "value",
         displayField: "displayValue",
         value: aProperties.monthlyWeekDay ? getDayOfWeekFromString(aProperties.monthlyWeekDay) : new Date().getDay()
      });

      var monthlyByDayOfWeekFrequencyField = new Ext.form.NumberField({
         allowBlank: false,
         allowDecimals: false,
         allowNegative: false,
         minValue: 1,
         value: aProperties.monthlyInterval ? aProperties.monthlyInterval : 1,
         width: 30
      });

      var monthlyByDayOfWeekComposite = new Ext.form.CompositeField({
         items: [
            monthlyByDayOfWeekRadio,
            monthlyOrdinalCombo,
            monthlyDayOfWeekCombo,
            {
               xtype: "displayfield",
               value: applicationResources.getProperty("scheduler.ofEvery"),
               style: {paddingTop:"4px", paddingBottom: "4px"}
            },
            monthlyByDayOfWeekFrequencyField,
            {
               xtype: "displayfield",
               value: applicationResources.getProperty("scheduler.months"),
               style: {paddingTop:"4px", paddingBottom: "4px"}
            }],
         buildLabel: function()
         {
            return applicationResources.getProperty("scheduleWizard.interval");
         }
      });

      var monthlyByDayOfMonthRadio = new Ext.form.Radio({
         name: "monthlyScheduleType",
         boxLabel: applicationResources.getProperty("scheduler.Day"),
         checked: aProperties.monthlyType == "absolute"
      });

      var monthlyDayOfMonthField = new Ext.form.NumberField({
         allowBlank: false,
         allowDecimals: false,
         allowNegative: false,
         minValue: 1,
         maxValue: 31,
         value: aProperties.monthlyDay ? aProperties.monthlyDay : new Date().getDate(),
         width: 30
      });

      var monthlyByDayOfMonthFrequencyField = new Ext.form.NumberField({
         allowBlank: false,
         allowDecimals: false,
         allowNegative: false,
         minValue: 1,
         value: aProperties.monthlyInterval ? aProperties.monthlyInterval : 1,
         width: 30
      });

      var monthlyByDayOfMonthComposite = new Ext.form.CompositeField({
         items: [
            monthlyByDayOfMonthRadio,
            monthlyDayOfMonthField,
            {
               xtype: "displayfield",
               value: applicationResources.getProperty("scheduler.Every"),
               style: {paddingTop:"4px", paddingBottom: "4px"}
            },
            monthlyByDayOfMonthFrequencyField,
            {
               xtype: "displayfield",
               value: applicationResources.getProperty("scheduler.months"),
               style: {paddingTop:"4px", paddingBottom: "4px"}
            }],
         buildLabel: function()
         {
            return "";
         },
         labelSeparator: ""
      });

      var monthlyStartDate = new Ext.form.DateField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startDate.title"),
         allowBlank: false,
         minValue: new Date().clearTime(),
         value: aProperties.startDate ? aProperties.startDate : new Date().clearTime()
      });

      var monthlyStartTime = new Ext.form.TimeField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startTime.title"),
         value: aProperties.startTime ? aProperties.startTime : new Date().add(Date.HOUR, 1),
         allowBlank: false
      });

      var monthlyRunUntilDeletedRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleWizard.runIndefinitely"),
         fieldLabel: applicationResources.getProperty("scheduleWizard.endCondition"),
         name: "weeklyEndCondition",
         checked: !aProperties.endDate
      });

      var monthlyEndDateRadio = new Ext.form.Radio({
         name: "weeklyEndCondition",
         boxLabel: applicationResources.getProperty("scheduleWizard.endDate.label"),
         checked: aProperties.endDate
      });

      var monthlyEndDateField = new Ext.form.DateField({
         allowBlank: false,
         minValue: new Date().add(Date.DAY, 1).clearTime(),
         value: aProperties.endDate ? aProperties.endDate : new Date().add(Date.DAY, 1).clearTime()
      });

      var monthlyEndDateComposite = new Ext.form.CompositeField({
         items: [monthlyEndDateRadio, monthlyEndDateField],
         labelSeparator: "",
         buildLabel: function()
         {
            return "";
         }
      });

      var monthlyCard = new Ext.form.FormPanel({
         items: [
            monthlyByDayOfWeekComposite,
            monthlyByDayOfMonthComposite,
            monthlyStartDate,
            monthlyStartTime,
            monthlyRunUntilDeletedRadio,
            monthlyEndDateComposite
         ],
         validateCard: function()
         {
            if(monthlyByDayOfWeekRadio.getValue() && !monthlyByDayOfWeekFrequencyField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.monthlyInterval.lessThanEqualZero"));
               return false;
            }

            if(monthlyByDayOfMonthRadio.getValue() && !monthlyDayOfMonthField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.monthlyInterval.lessThanEqualZero"));
               return false;
            }

            if(monthlyByDayOfMonthRadio.getValue() && !monthlyByDayOfMonthFrequencyField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.monthlyInterval.lessThanEqualZero"));
               return false;
            }

            if(!monthlyStartDate.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartDateExt"));
               return false;
            }

            if(!monthlyStartTime.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartTimeExt"));
               return false;
            }

            if(Date.parseDate(monthlyStartDate.getValue().format("Y-m-d") + " " + monthlyStartTime.getValue(), "Y-m-d g:i A") <= new Date())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.startInPast"));
               return false;
            }

            if(monthlyEndDateRadio.getValue() && !monthlyEndDateField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidEndDateExt"));
               return false;
            }

            if(monthlyEndDateRadio.getValue() && monthlyEndDateField.getValue() <= Date.parseDate(monthlyStartDate.getValue().format("Y-m-d") + " " + monthlyStartTime.getValue(), "Y-m-d g:i A"))
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduleWizrd.startAfterEnd"));
               return false;
            }

            return true;
         }
      });

      var yearlyByDayOfWeekRadio = new Ext.form.Radio({
         name: "yearlyScheduleType",
         boxLabel:  applicationResources.getProperty("scheduler.The"),
         checked: !aProperties.yearlyType || (aProperties.yearlyType == "relative")
      });

      var yearlyOrdinalCombo = new Ext.form.ComboBox({
         triggerAction: "all",
         mode: "local",
         lazyRender: true,
         editable: false,
         width: 80,
         store: new Ext.data.ArrayStore({
            id: 0,
            fields: ["value", "ordinalValue"],
            data: [[1, applicationResources.getProperty("scheduler.first")], [2, applicationResources.getProperty("scheduler.second")], [3, applicationResources.getProperty("scheduler.third")], [4, applicationResources.getProperty("scheduler.fourth")]]
         }),
         valueField: "value",
         displayField: "ordinalValue",
         value: aProperties.yearlyWeek ? aProperties.yearlyWeek : Math.min(Math.floor((new Date().getDate() + 6) / 7), 4)
      });

      var yearlyDayOfWeekCombo = new Ext.form.ComboBox({
         triggerAction: "all",
         mode: "local",
         lazyRender: true,
         editable: false,
         width: 90,
         store: new Ext.data.ArrayStore({
            id: 0,
            fields: ["value", "displayValue", "stringValue"],
            data: [[0, applicationResources.getProperty("jsCalendar.sunday"), "SUN"], [1, applicationResources.getProperty("jsCalendar.monday"), "MON"], [2, applicationResources.getProperty("jsCalendar.tuesday"), "TUE"], [3, applicationResources.getProperty("jsCalendar.wednesday"), "WED"], [4, applicationResources.getProperty("jsCalendar.thursday"), "THU"], [5, applicationResources.getProperty("jsCalendar.friday"), "FRI"], [6, applicationResources.getProperty("jsCalendar.saturday"), "SAT"]]
         }),
         valueField: "value",
         displayField: "displayValue",
         value: aProperties.yearlyWeekDay ? getDayOfWeekFromString(aProperties.yearlyWeekDay) : new Date().getDay()
      });

      var yearlyByDayOfWeekMonthCombo = new Ext.form.ComboBox({
         triggerAction: "all",
         mode: "local",
         lazyRender: true,
         editable: false,
         width: 90,
         store: new Ext.data.ArrayStore({
            id: 0,
            fields: ["value", "month"],
            data: [[1, applicationResources.getProperty("january")],[2, applicationResources.getProperty("february")],[3, applicationResources.getProperty("march")],[4, applicationResources.getProperty("april")],[5, applicationResources.getProperty("may")],[6, applicationResources.getProperty("june")],[7, applicationResources.getProperty("july")],[8, applicationResources.getProperty("august")],[9, applicationResources.getProperty("september")],[10, applicationResources.getProperty("october")],[11, applicationResources.getProperty("november")],[12, applicationResources.getProperty("december")]]
         }),
         valueField: "value",
         displayField: "month",
         value: aProperties.yearlyMonth ? aProperties.yearlyMonth : new Date().getMonth() + 1
      });

      var yearlyByDayOfWeekComposite = new Ext.form.CompositeField({
         items: [
            yearlyByDayOfWeekRadio,
            yearlyOrdinalCombo,
            yearlyDayOfWeekCombo,
            {
               xtype: "displayfield",
               value: " of every ",
               style: {paddingTop:"4px", paddingBottom: "4px"}
            },
            yearlyByDayOfWeekMonthCombo],
         buildLabel: function()
         {
            return applicationResources.getProperty("scheduleWizard.interval");
         }
      });

      var yearlyByDayOfMonthRadio = new Ext.form.Radio({
         name: "yearlyScheduleType",
         boxLabel: applicationResources.getProperty("scheduler.Day"),
         checked: aProperties.yearlyType == "absolute"
      });

      var yearlyDayOfMonthField = new Ext.form.NumberField({
         allowBlank: false,
         allowDecimals: false,
         allowNegative: false,
         minValue: 1,
         maxValue: 31,
         value: aProperties.yearlyDay ? aProperties.yearlyDay : new Date().getDate(),
         width: 30
      });

      var yearlyByDayOfMonthCombo = new Ext.form.ComboBox({
         triggerAction: "all",
         mode: "local",
         lazyRender: true,
         editable: false,
         width: 90,
         store: new Ext.data.ArrayStore({
            id: 0,
            fields: ["value", "month"],
            data: [[1, applicationResources.getProperty("january")],[2, applicationResources.getProperty("february")],[3, applicationResources.getProperty("march")],[4, applicationResources.getProperty("april")],[5, applicationResources.getProperty("may")],[6, applicationResources.getProperty("june")],[7, applicationResources.getProperty("july")],[8, applicationResources.getProperty("august")],[9, applicationResources.getProperty("september")],[10, applicationResources.getProperty("october")],[11, applicationResources.getProperty("november")],[12, applicationResources.getProperty("december")]]
         }),
         valueField: "value",
         displayField: "month",
         value: aProperties.yearlyMonth ? aProperties.yearlyMonth : new Date().getMonth() + 1
      });

      var yearlyByDayOfMonthComposite = new Ext.form.CompositeField({
         items: [
            yearlyByDayOfMonthRadio,
            yearlyDayOfMonthField,
            {
               xtype: "displayfield",
               value: applicationResources.getProperty("scheduler.ofEvery"),
               style: {paddingTop:"4px", paddingBottom: "4px"}
            },
            yearlyByDayOfMonthCombo],
         buildLabel: function()
         {
            return "";
         },
         labelSeparator: ""
      });

      var yearlyStartDate = new Ext.form.DateField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startDate.title"),
         allowBlank: false,
         minValue: new Date().clearTime(),
         value: aProperties.startDate ? aProperties.startDate : new Date().clearTime()
      });

      var yearlyStartTime = new Ext.form.TimeField({
         fieldLabel: applicationResources.getProperty("scheduleWizard.startTime.title"),
         value: aProperties.startTime ? aProperties.startTime : new Date().add(Date.HOUR, 1),
         allowBlank: false
      });

      var yearlyRunUntilDeletedRadio = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("scheduleWizard.runIndefinitely"),
         fieldLabel: applicationResources.getProperty("scheduleWizard.endCondition"),
         name: "weeklyEndCondition",
         checked: !aProperties.endDate
      });

      var yearlyEndDateRadio = new Ext.form.Radio({
         name: "weeklyEndCondition",
         boxLabel: applicationResources.getProperty("scheduleWizard.endDate.label"),
         checked: aProperties.endDate
      });

      var yearlyEndDateField = new Ext.form.DateField({
         allowBlank: false,
         minValue: new Date().add(Date.DAY, 1).clearTime(),
         value: aProperties.endDate ? aProperties.endDate : new Date().add(Date.DAY, 1).clearTime()
      });

      var yearlyEndDateComposite = new Ext.form.CompositeField({
         items: [yearlyEndDateRadio, yearlyEndDateField],
         labelSeparator: "",
         buildLabel: function()
         {
            return "";
         }
      });

      var yearlyCard = new Ext.form.FormPanel({
         items: [
            yearlyByDayOfWeekComposite,
            yearlyByDayOfMonthComposite,
            yearlyStartDate,
            yearlyStartTime,
            yearlyRunUntilDeletedRadio,
            yearlyEndDateComposite
         ],
         validateCard: function()
         {
            if(yearlyByDayOfMonthRadio.getValue() && !yearlyDayOfMonthField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.monthlyInterval.lessThanEqualZero"));
               return false;
            }

            if(!yearlyStartDate.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartDateExt"));
               return false;
            }

            if(!yearlyStartTime.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidStartTimeExt"));
               return false;
            }

            if(Date.parseDate(yearlyStartDate.getValue().format("Y-m-d") + " " + yearlyStartTime.getValue(), "Y-m-d g:i A") <= new Date())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.startInPast"));
               return false;
            }

            if(yearlyEndDateRadio.getValue() && !yearlyEndDateField.isValid())
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduler.errors.invalidEndDateExt"));
               return false;
            }

            if(yearlyEndDateRadio.getValue() && yearlyEndDateField.getValue() <= Date.parseDate(yearlyStartDate.getValue().format("Y-m-d") + " " + yearlyStartTime.getValue(), "Y-m-d g:i A"))
            {
               Ext.Msg.alert("Validation", applicationResources.getProperty("scheduleWizrd.startAfterEnd"));
               return false;
            }

            return true;
         }
      });

      var timingSettingsFieldSet = new Ext.form.FieldSet({
         xtype: "fieldset",
         title: "Settings",
         region: "center",
         layout: "card",
         items: [onceCard, dailyCard, weeklyCard, monthlyCard, yearlyCard],
         activeItem: aProperties.scheduleType && aProperties.scheduleType > 0 ? aProperties.scheduleType - 1: 0
      });

      var timingPanel = new Ext.Panel({
         title: applicationResources.getProperty("scheduleWizard.wizardBar.timing"),
         items: [typeFieldSet, timingSettingsFieldSet],
         layout: "border",
         listeners: {
            activate: function()
            {
               previousButton.enable();
               nextButton.disable();
               saveButton.enable();
            }
         }
      });

      var previousButton = new Ext.Button({
         text: applicationResources.getProperty("button.Previous"),
         handler: function()
         {
            newScheduleTabPanel.activate(reportsPanel);
         }
      });

      var nextButton = new Ext.Button({
         text: applicationResources.getProperty("button.Next"),
         handler: function()
         {
            newScheduleTabPanel.activate(timingPanel);
         }
      });

      var saveButton = new Ext.Button({
         text: applicationResources.getProperty("button.Save"),
         disabled: true,
         handler: function()
         {
            if(!nameField.validate())
            {
               Ext.Msg.alert("Validation", "Please enter a valid name.");
               return;
            }

            if(selectedReportsStore.getCount() == 0)
            {
               Ext.Msg.alert("Validation", "Please select at least one Report.");
               return;
            }

            var targetIds = [];
            selectedReportsStore.each(function(aRecord)
            {
               targetIds.push(aRecord.id);
            });

            if(typeRadioGroup.getValue().inputValue == 0 && onceCard.validateCard()) // Once
            {
               RequestUtil.request({
                  url: ServerEnvironment.baseUrl + "/secure/actions/scheduleWizardGesture.do",
                  params: {
                     viewGesture: "save",
                     scheduleId: aProperties.scheduleId,
                     scheduleName: nameField.getValue(),
                     targetIds: targetIds,
                     scheduleType: typeRadioGroup.getValue().inputValue,
                     startDate: onceStartDate.getValue().format("Y-m-d"),
                     startTime: onceStartTime.getValue()
                  },
                  success: function()
                  {
                     newScheduleWindow.close();
                  }
               });
            }

            if(typeRadioGroup.getValue().inputValue == 2 && dailyCard.validateCard()) // Daily
            {
               RequestUtil.request({
                  url: ServerEnvironment.baseUrl + "/secure/actions/scheduleWizardGesture.do",
                  params: {
                     viewGesture: "save",
                     scheduleId: aProperties.scheduleId,
                     scheduleName: nameField.getValue(),
                     targetIds: targetIds,
                     scheduleType: typeRadioGroup.getValue().inputValue,
                     dailyRate: dailyFrequencyTypeCombo.getValue(),
                     startDate: dailyStartDate.getValue().format("Y-m-d"),
                     startTime: dailyStartTime.getValue(),
                     dailyInterval: dailyFrequencyValueField.getValue(),
                     endDate: dailyEndDateRadio.getValue() ? dailyEndDateField.getValue().format("Y-m-d") : null,
                     numberOfExecutions: dailyNumberOfExecutionsRadio.getValue() ? dailyNumberOfExecutionsField.getValue() :
                                         (dailyRunUntilDeletedRadio.getValue() ? -1 : null)
                  },
                  success: function()
                  {
                     newScheduleWindow.close();
                  }
               });
            }

            if(typeRadioGroup.getValue().inputValue == 3 && weeklyCard.validateCard()) // Weekly
            {
               var selectedDays = weeklyDaysOfWeekGroup.getValue();
               var weeklyDays = [];
               for(var i=0;i<selectedDays.length;i++)
               {
                  weeklyDays.push(selectedDays[i].inputValue);
               }

               RequestUtil.request({
                  url: ServerEnvironment.baseUrl + "/secure/actions/scheduleWizardGesture.do",
                  params: {
                     viewGesture: "save",
                     scheduleId: aProperties.scheduleId,
                     scheduleName: nameField.getValue(),
                     targetIds: targetIds,
                     scheduleType: typeRadioGroup.getValue().inputValue,
                     startDate: weeklyStartDate.getValue().format("Y-m-d"),
                     startTime: weeklyStartTime.getValue(),
                     weeklyInterval: weeklyFrequencyField.getValue(),
                     endDate: weeklyEndDateRadio.getValue() ? weeklyEndDateField.getValue().format("Y-m-d") : null,
                     weeklyDays: weeklyDays
                  },
                  success: function()
                  {
                     newScheduleWindow.close();
                  }
               });
            }

            if(typeRadioGroup.getValue().inputValue == 4 && monthlyCard.validateCard()) // Monthly
            {
               RequestUtil.request({
                  url: ServerEnvironment.baseUrl + "/secure/actions/scheduleWizardGesture.do",
                  params: {
                     viewGesture: "save",
                     scheduleId: aProperties.scheduleId,
                     scheduleName: nameField.getValue(),
                     targetIds: targetIds,
                     scheduleType: typeRadioGroup.getValue().inputValue,
                     monthlyType: monthlyByDayOfWeekRadio.getValue() ? "relative" : "absolute",
                     startDate: monthlyStartDate.getValue().format("Y-m-d"),
                     startTime: monthlyStartTime.getValue(),
                     monthlyInterval: monthlyByDayOfWeekRadio.getValue() ? monthlyByDayOfWeekFrequencyField.getValue() : monthlyByDayOfMonthFrequencyField.getValue(),
                     endDate: monthlyEndDateRadio.getValue() ? monthlyEndDateField.getValue().format("Y-m-d") : null,
                     monthlyWeek: monthlyOrdinalCombo.getValue(),
                     monthlyWeekDay: monthlyDayOfWeekCombo.getStore().query("value", monthlyDayOfWeekCombo.getValue()).first().data.stringValue,
                     monthlyDay: monthlyDayOfMonthField.getValue()
                  },
                  success: function()
                  {
                     newScheduleWindow.close();
                  }
               });
            }

            if(typeRadioGroup.getValue().inputValue == 5 && yearlyCard.validateCard()) // Yearly
            {
               RequestUtil.request({
                  url: ServerEnvironment.baseUrl + "/secure/actions/scheduleWizardGesture.do",
                  params: {
                     viewGesture: "save",
                     scheduleId: aProperties.scheduleId,
                     scheduleName: nameField.getValue(),
                     targetIds: targetIds,
                     scheduleType: typeRadioGroup.getValue().inputValue,
                     yearlyType: yearlyByDayOfWeekRadio.getValue() ? "relative" : "absolute",
                     startDate: yearlyStartDate.getValue().format("Y-m-d"),
                     startTime: yearlyStartTime.getValue(),
                     endDate: yearlyEndDateRadio.getValue() ? yearlyEndDateField.getValue().format("Y-m-d") : null,
                     yearlyWeek: yearlyOrdinalCombo.getValue(),
                     yearlyWeekDay: yearlyDayOfWeekCombo.getStore().query("value", yearlyDayOfWeekCombo.getValue()).first().data.stringValue,
                     yearlyMonth: yearlyByDayOfWeekRadio.getValue() ? yearlyByDayOfWeekMonthCombo.getValue() : yearlyByDayOfMonthCombo.getValue(),
                     yearlyDay: yearlyDayOfMonthField.getValue()
                  },
                  success: function()
                  {
                     newScheduleWindow.close();
                  }
               });
            }

            Adf.frameSetUi.eventChannel.publish({type: "scheduleReport"});
         }
      });

      var wizardToolbar = new Ext.Toolbar({
         items: [previousButton, nextButton, saveButton]
      });

      var newScheduleTabPanel = new Ext.TabPanel({
         border: false,
         defaults : {padding:"5px"},
         items: [reportsPanel, timingPanel],
         activeItem: 0
      });

      var newScheduleWindow = new Ext.Window({
         title: applicationResources.getProperty("scheduleWizard.title"),
         layout: "fit",
         items: [newScheduleTabPanel],
         fbar: wizardToolbar,
         height: Ext.getBody().getViewSize().height * .85, //Just using "85%" doesn't work properly here. It causes strange resizing behavior
         width: Ext.getBody().getViewSize().width * .85,   //Just using "85%" doesn't work properly here. It causes strange resizing behavior
         modal: true
      });

      newScheduleWindow.show();
   }

   ,
   createScheduleName: function(aReportName)
   {
      var scheduleName = "";
      var creationTimestamp = ' ' + (new Date()).format(UserPreference.getExtDateFormat() + " " + UserPreference.getExtTimeFormat());
      if (aReportName.length + creationTimestamp.length > 128)
      {
         scheduleName = aReportName.substr(0, (128 - creationTimestamp.length)) + creationTimestamp;
      }
      else
      {
         scheduleName = aReportName + creationTimestamp;
      }
      return scheduleName;
   }
};