
Adf.FilterEditorBlankPanel = Ext.extend(Ext.Panel,{
   constructor: function(aConfig)
   {
      aConfig = Ext.apply({
         title: applicationResources.getProperty('profileWizard.filters.blankValue')
      }, aConfig);
      Adf.FilterEditorNumberValuePanel.superclass.constructor.call(this, aConfig);
   },

   resetValues: function()
   {
   },

   getValue: function()
   {
      return '';
   },

   setEventHandler: function(aEventHandler, aScope)
   {
   },

   setFilterValue: function(aValue)
   {
   }
});

Adf.FilterEditorNumberValuePanel = Ext.extend(Ext.Panel, {
   constructor: function(aConfig)
   {
      this.filterValue = new Ext.form.NumberField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.enterNumber')
      });

      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         title: applicationResources.getProperty('profileWizard.filters.singleNumber'),
         items: [
            this.filterValue
         ]
      }, aConfig);

      Adf.FilterEditorNumberValuePanel.superclass.constructor.call(this, aConfig);

   },

   resetValues: function()
   {
      this.filterValue.setValue('');
   },

   getValue: function()
   {
      return this.filterValue.getValue();
   },

   setEventHandler: function(aEventHandler, aScope)
   {
      this.filterValue.on('keyup', aEventHandler, aScope);
   },

   setFilterValue: function(aValue)
   {
      this.filterValue.setValue(aValue);
   }
});

Adf.FilterEditor2NumberValuesPanel = Ext.extend(Ext.Panel, {
   constructor: function(aConfig)
   {
      this.filterValue1 = new Ext.form.NumberField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.between')
      });

      this.filterValue2 = new Ext.form.NumberField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.and')
      });

      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         title: applicationResources.getProperty('profileWizard.filters.multiNumber'),
         items: [
            this.filterValue1,
            this.filterValue2
         ]
      }, aConfig);

      Adf.FilterEditor2NumberValuesPanel.superclass.constructor.call(this, aConfig);

   },

   resetValues: function()
   {
      this.filterValue1.setValue('');
      this.filterValue2.setValue('');
   },

   getValue: function()
   {
      return this.filterValue1.getValue() + ' AND ' + this.filterValue2.getValue();
   },

   setEventHandler: function(aEventHandler, aScope)
   {
      this.filterValue1.on('keyup', aEventHandler, aScope);
      this.filterValue2.on('keyup', aEventHandler, aScope);
   },

   setFilterValue: function(aValue)
   {
      var splitResult = aValue.split(" AND ");

      this.filterValue1.setValue(splitResult[0]);
      this.filterValue2.setValue(splitResult[1]);
   }
});

Adf.FilterEditorDateValuePanel = Ext.extend(Ext.Panel, {
   constructor: function(aConfig)
   {
      this.filterValue = new Ext.form.DateField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.enterDate'),
         width: 98
      });

      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         title: applicationResources.getProperty('profileWizard.filters.singleDate'),
         items: [
            this.filterValue
         ]
      }, aConfig);

      Adf.FilterEditorDateValuePanel.superclass.constructor.call(this, aConfig);

   },

   resetValues: function()
   {
      this.filterValue.setValue('');
   },

   getValue: function()
   {
      return this.filterValue.getValue();
   },

   setEventHandler: function(aEventHandler, aScope)
   {
      this.filterValue.on('keyup', aEventHandler, aScope);
   },

   setFilterValue: function(aValue)
   {
      this.filterValue.setValue(aValue);
   }
});

Adf.FilterEditor2DateValuesPanel = Ext.extend(Ext.Panel, {
   constructor: function(aConfig)
   {
      this.filterValue1 = new Ext.form.DateField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.between'),
         width: 98
      });

      this.filterValue2 = new Ext.form.DateField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.and'),
         width: 98
      });

      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         title:  applicationResources.getProperty('profileWizard.filters.multiDate'),
         items: [
            this.filterValue1,
            this.filterValue2
         ]
      }, aConfig);

      Adf.FilterEditor2DateValuesPanel.superclass.constructor.call(this, aConfig);

   },

   resetValues: function()
   {
      this.filterValue1.setValue('');
      this.filterValue2.setValue('');
   },

   getValue: function()
   {
      return this.filterValue1.getValue() + ' AND ' + this.filterValue2.getValue();
   },

   setEventHandler: function(aEventHandler, aScope)
   {
      this.filterValue1.on('keyup', aEventHandler, aScope);
      this.filterValue2.on('keyup', aEventHandler, aScope);
   },

   setFilterValue: function(aValue)
   {
      var splitResult = aValue.split(" AND ");

      this.filterValue1.setValue(splitResult[0]);
      this.filterValue2.setValue(splitResult[1]);
   }
});


Adf.FilterEditorStringValuePanel = Ext.extend(Ext.Panel, {
   singleSelect : false,

   constructor: function(aConfig)
   {
      this.containerRef = aConfig.containerRef;
      this.filterValue = new Ext.form.TextField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.enterString')
      });

      this.valuePickerButton = new Ext.Button({
         text : applicationResources.getProperty('profileWizard.button.launchValuePicker'),
         disabled : true,
         listeners:{
            scope : this,
            'click' : this.valuePickerButtonClicked
         }
      });
      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         title: applicationResources.getProperty('profileWizard.filters.singleString'),
         items: [
            this.filterValue,
            this.valuePickerButton
         ]
      }, aConfig);

      Adf.FilterEditorStringValuePanel.superclass.constructor.call(this, aConfig);
   },

   valuePickerButtonClicked : function(aButton, aEvent)
   {
      var dialog = new Adf.QueryItemValuePickerDialog({
         queryItemPath : this.queryItemPath,
         packagePath : this.packagePath,
         callBackScope : this,
         callBack : this.valuePickerCallBack,
         singleSelect : this.singleSelect
      });
      dialog.show();

   },

   valuePickerCallBack: function(aSelectedValues)
   {
      this.setRawFilterValue(aSelectedValues);
      this.containerRef.updateExpression();
   },

   toggleValuePicker : function(aEnable)
   {
      this.valuePickerButton.setDisabled(!aEnable);
   },

   setValuePickerParams : function(aQueryItemPath, aPackagePath)
   {
      this.queryItemPath = aQueryItemPath;
      this.packagePath = aPackagePath;
   },

   resetValues: function()
   {
      this.filterValue.setValue('');
   },

   getValue: function()
   {
      if("(" != this.filterValue.getValue().substring(0, 1))
      {
         return '\'' + this.filterValue.getValue() + '\'';
      }
      else
      {
         return this.filterValue.getValue();
      }
   },

   setEventHandler: function(aEventHandler, aScope)
   {
      this.filterValue.on('keyup', aEventHandler, aScope);
   },

   setFilterValue: function(aValue)
   {
      if("(" != aValue.substring(0, 1))
      {
         this.filterValue.setValue(aValue.substring(1, aValue.length - 1));
      }
      else
      {
         this.setRawFilterValue(aValue);
      }
   },

   setRawFilterValue: function(aValue)
   {
      this.filterValue.setValue(aValue);
   }
});

Adf.FilterEditor2StringValuesPanel = Ext.extend(Ext.Panel, {
   constructor: function(aConfig)
   {
      this.filterValue1 = new Ext.form.TextField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.between')
      });

      this.filterValue2 = new Ext.form.TextField({
         enableKeyEvents : true,
         fieldLabel: applicationResources.getProperty('profileWizard.filters.and')
      });

      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         title: applicationResources.getProperty('profileWizard.filters.multiString'),
         items: [
            this.filterValue1,
            this.filterValue2
         ]
      }, aConfig);

      Adf.FilterEditor2StringValuesPanel.superclass.constructor.call(this, aConfig);
   },

   resetValues: function()
   {
      this.filterValue1.setValue('');
      this.filterValue2.setValue('');
   },

   getValue: function()
   {
      return '\'' + this.filterValue1.getValue() + '\' AND \'' + this.filterValue2.getValue() + '\'';
   },

   setEventHandler: function(aEventHandler, aScope)
   {
      this.filterValue1.on('keyup', aEventHandler, aScope);
      this.filterValue2.on('keyup', aEventHandler, aScope);
   },

   setFilterValue: function(aValue)
   {
      var splitResult = aValue.split("' AND '");

      this.filterValue1.setValue(splitResult[0].substring(1));
      this.filterValue2.setValue(splitResult[1].substring(0, splitResult[1].length - 1));
   }
});

Adf.FilterEditorValuesPanel = Ext.extend(Ext.Panel, {
   constructor: function(aConfig)
   {

      this.numberValuePanel = new Adf.FilterEditorNumberValuePanel({});
      this.numberValuePanel2 = new Adf.FilterEditor2NumberValuesPanel({});
      this.dateValuePanel = new Adf.FilterEditorDateValuePanel({});
      this.dateValuePanel2 = new Adf.FilterEditor2DateValuesPanel({});
      this.stringValuePanel = new Adf.FilterEditorStringValuePanel({
         containerRef: aConfig.containerRef
      });
      this.stringValuePanel2 = new Adf.FilterEditor2StringValuesPanel({});
      this.blankPanel = new Adf.FilterEditorBlankPanel({});

      this.numberValuePanel.setEventHandler(aConfig.keyPressHandler, aConfig.keyPressScope);
      this.numberValuePanel2.setEventHandler(aConfig.keyPressHandler, aConfig.keyPressScope);
      this.dateValuePanel.setEventHandler(aConfig.keyPressHandler, aConfig.keyPressScope);
      this.dateValuePanel2.setEventHandler(aConfig.keyPressHandler, aConfig.keyPressScope);
      this.stringValuePanel.setEventHandler(aConfig.keyPressHandler, aConfig.keyPressScope);
      this.stringValuePanel2.setEventHandler(aConfig.keyPressHandler, aConfig.keyPressScope);

      aConfig = Ext.apply({
         layout: 'card',
         flex : 2,
         layoutConfig: {
             titleCollapse: false,
             animate: true,
             activeOnTop: true
         },

         items: [
            this.blankPanel,
            this.numberValuePanel,
            this.numberValuePanel2,
            this.dateValuePanel,
            this.dateValuePanel2,
            this.stringValuePanel,
            this.stringValuePanel2
         ]
      }, aConfig);

      Adf.FilterEditorValuesPanel.superclass.constructor.call(this, aConfig);
   },

   setValuePickerEnabled: function(aEnabled, aQueryItemPath, aPackagePath)
   {
      this.stringValuePanel.toggleValuePicker(aEnabled);
      this.stringValuePanel.setValuePickerParams(aQueryItemPath, aPackagePath);
   },

   setActivePanel: function(aPanel){
      this.getLayout().setActiveItem(aPanel);
   },

   resetValuePanel: function()
   {
      this.getLayout().activeItem.resetValues();
   },

   getValue: function()
   {
      return this.getLayout().activeItem.getValue();
   },

   setFilterValue: function(aValue)
   {
      this.getLayout().activeItem.setFilterValue(aValue);
   },

   setSingleSelect: function(aValue)
   {
      this.getLayout().activeItem.singleSelect = aValue;
   }
});


Adf.SimpleFilterEditorPanel = Ext.extend(Ext.Panel,
{
   constructor: function(aConfig)
   {
      this.biQuerySet = aConfig.biQuerySet;
      this.filterOperations = aConfig.filterOperations;
      this.filter = aConfig.filter;
      this.packagePath = aConfig.packagePath;

      this.filterValue = new Ext.form.Label({
         region: 'north',
         style: 'font-weight: bold;text-align:center',
         margins: {
            top: 20
         },
         height:40,
         width:'100%'
      });

      var queryArray = [];

      for (var count = 0; count < this.biQuerySet.length; count++)
      {
         var eachQuery = this.biQuerySet[count];
         queryArray.push([eachQuery.name, eachQuery]);
      }

      this.queryArrayStore = new Ext.data.ArrayStore({
            autoDestroy: true,
            idIndex: 0,
            data: queryArray,
            fields: ['name', 'reportDataItemMetaDataItems']
         });

      this.filterQueriesGrid = new Ext.grid.GridPanel({
         flex : 2,
         sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
         autoExpandColumn: 'queryName',
         store: this.queryArrayStore,
         colModel:  new Ext.grid.ColumnModel({
            columns: [{
               id: 'queryName',
               header: applicationResources.getProperty('profileWizard.filters.query'),
               sortable: true,
               dataIndex: 'name'
            }]
         }),
         listeners: {
            scope: this,
            viewready : function()
            {
               try
               {
                  if(this.filter)
                  {
                     var rowIndex = this.queryArrayStore.indexOfId(this.filter.query);
                     this.filterQueriesGrid.getSelectionModel().selectRow(rowIndex);
                     this.filterQueriesGrid.getView().focusRow(rowIndex);
                  }
               }
               catch(err)
               {
                  Ext.Msg.alert("Error occurred", "Erorr occurred during initialization [" + err.message + "]")
               }
            }
         }
      });

      this.filterQueriesGrid.getSelectionModel().on({
         'rowselect': {
            fn: this.onQuerySelectionChanged,
            scope:this
         }
      });
      // Note: this event handles situations when the row click event is fired instead of the row selection event.
      this.filterQueriesGrid.on('rowclick', this.onQuerySelectionChanged, this);


      this.columnArrayStore = new Ext.data.ArrayStore({
               autoDestroy: true,
               fields: ['expression', 'dataType', 'name', 'supportsValuePicker', 'queryItem'],
               idIndex: 2
            });

      this.filterColumnsGrid = new Ext.grid.GridPanel({
         flex : 3,
         sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
         autoExpandColumn: 'columnName',
         store: this.columnArrayStore,
         colModel:  new Ext.grid.ColumnModel({
            columns: [{
               id: 'columnName',
               header: applicationResources.getProperty('profileWizard.filters.column'),
               sortable: true,
               dataIndex: 'name'
            }]
         }),
         listeners: {
            scope: this,
            viewready : function()
            {
               try
               {
                  if(this.filter)
                  {
                     var rowIndex = this.columnArrayStore.indexOfId(this.filter.dataItemName);
                     this.filterColumnsGrid.getSelectionModel().selectRow(rowIndex);
                     this.filterColumnsGrid.getView().focusRow(rowIndex);
                  }
               }
               catch(err)
               {
                  Ext.Msg.alert("Error occurred", "Erorr occurred during initialization [" + err.message + "]")
               }
            }
         }

      });

      this.filterColumnsGrid.getSelectionModel().on({
         'rowselect': {
            fn: this.onColumnSelectionChanged,
            scope:this
         }
      });
      // Note: this event handles situations when the row click event is fired instead of the row selection event.
      this.filterColumnsGrid.on('rowclick', this.onColumnSelectionChanged, this);

      this.operatorArrayStore = new Ext.data.ArrayStore({
               autoDestroy: true,
               fields: ['value', 'displayValue', 'hasRValue'],
               idIndex: 0
            });

      this.filterOperatorsGrid = new Ext.grid.GridPanel({
         flex : 1,
         autoExpandColumn: 'operatorName',
         store: this.operatorArrayStore,
         colModel:  new Ext.grid.ColumnModel({
            columns: [{
               id: 'operatorName',
               header: applicationResources.getProperty('profileWizard.filters.relation'),
               sortable: true,
               dataIndex: 'displayValue'
            }]
         }),
         listeners: {
            scope: this,
            viewready : function()
            {
               try
               {
                  if(this.filter)
                  {
                     var rowIndex = this.operatorArrayStore.indexOfId(this.filter.relation);
                     this.filterOperatorsGrid.getSelectionModel().selectRow(rowIndex);
                     this.filterOperatorsGrid.getView().focusRow(rowIndex);
                  }
               }
               catch(err)
               {
                  Ext.Msg.alert("Error occurred", "Erorr occurred during initialization [" + err.message + "]")
               }
            }
         }
      });

      this.filterOperatorsGrid.getSelectionModel().on({
         'rowselect': {
            fn: this.onRelationSelectionChanged,
            scope:this
         }
      });
      // Note: this event handles situations when the row click event is fired instead of the row selection event.
      this.filterOperatorsGrid.on('rowclick', this.onRelationSelectionChanged, this);

      this.filterValuePanel = new Adf.FilterEditorValuesPanel({
               keyPressHandler: this.onValueKeyPress,
               keyPressScope: this,
               containerRef : this
            });

      this.simpleFilterPanel = new Ext.Panel({
         height: '100%',
         region:'center',
         layout:'hbox',
         layoutConfig: {
             align: 'stretch'
         },
         items:[
            this.filterQueriesGrid
            ,this.filterColumnsGrid
            ,this.filterOperatorsGrid
            ,this.filterValuePanel
         ]
      });

      aConfig = Ext.apply(
         {
            layout: 'border',
            items: [
               this.filterValue
               ,this.simpleFilterPanel
            ]
         },
         aConfig
      );

      ReiFiltersUiModel.prototype.operatorsThatDontRequireRValue = {};
      this.relationSets = ReiFiltersUiModel.prototype.getRelationSets();

      Adf.SimpleFilterEditorPanel.superclass.constructor.call(this, aConfig);
   },

   onQuerySelectionChanged : function(aGrid, aRowIndex, aEvent)
   {
      if(aEvent.data)
      {
         var biQuery = aEvent.data['reportDataItemMetaDataItems'];

         var columnValues = [];
         //todo - I don't understand why reportDataItemMetaDataItems is in this biQuery. It should be that object
         for(var i = 0; i < biQuery.reportDataItemMetaDataItems.length; i++)
         {
            var dataItem = biQuery.reportDataItemMetaDataItems[i];
//            fields: ['expression', 'dataType', 'name', 'supportsValuePicker', 'queryItem'],
            columnValues.push([dataItem.expression, dataItem.dataType, dataItem.name, false, dataItem]);
         }
         this.columnArrayStore.loadData(columnValues);
         this.filterColumnsGrid.getSelectionModel().clearSelections();
      }
   },

   onColumnSelectionChanged : function(aGrid, aRowIndex, aEvent)
   {
      if(aEvent.data)
      {
         var queryItem = aEvent.data['queryItem'];

         var relationType = queryItem.dataType;

         if(relationType)
         {
            var relationList = this.relationSets[relationType];
            var operatorList = [];
            //value, displayValue, hasRValue
            for(var eachOperator in relationList.operatorList)
            {
               var operatorId = relationList.operatorList[eachOperator].id;

               if(ReiFiltersUiModel.prototype.operatorsThatDontRequireRValue[operatorId])
               {
                  operatorList.push([operatorId, relationList.operatorList[eachOperator].operator, true]);
               }
               else
               {
                  operatorList.push([operatorId, relationList.operatorList[eachOperator].operator, false]);
               }
            }

            this.operatorArrayStore.loadData(operatorList);
         }
         //reset the value panel to the blank panel
         this.filterValuePanel.layout.setActiveItem(0);
         this.filterOperatorsGrid.getSelectionModel().clearSelections();

         this.updateExpression();
      }
   },

   onRelationSelectionChanged : function(aGrid, aRowIndex, aEvent)
   {
      if(aEvent.data)
      {
         var operator = aEvent.data['value'];
         var filterColumnSelection = this.filterColumnsGrid.getSelectionModel().getSelections();

         if(filterColumnSelection && filterColumnSelection.length == 1)
         {
            var dataType = filterColumnSelection[0].data['dataType'];
            var hasRValue = aEvent.data['hasRValue'];

            var activeItemIndex = 0;
            if(hasRValue)
            {
               activeItemIndex = 0;
            }
            else if("STRING" === dataType)
            {
               if("between" === operator)
               {
                  activeItemIndex = 6;
               }
               else
               {
                  activeItemIndex = 5;
               }
            }
            else if("DATETIME" === dataType)
            {
               if("between" === operator)
               {
                  activeItemIndex = 4;
               }
               else
               {
                  activeItemIndex = 3;
               }
            }
            else if("NUMBER" == dataType)
            {
               if("between" === operator)
               {
                  activeItemIndex = 2;
               }
               else
               {
                  activeItemIndex = 1;
               }
            }

            this.filterValuePanel.layout.setActiveItem(activeItemIndex);
            this.filterValuePanel.resetValuePanel();
            //(activeItemIndex === 5) && filterColumnSelection[0].data.supportsValuePicker
            this.filterValuePanel.setSingleSelect('in' != operator);
            this.filterValuePanel.setValuePickerEnabled((filterColumnSelection[0].data.queryItem.supportsValuePicker),
                  filterColumnSelection[0].data.queryItem.expression, this.packagePath);
         }

         if(this.filter)
         {
            this.filterValuePanel.setFilterValue(this.filter.values);
         }

         this.updateExpression();
      }
   },

   onValueKeyPress : function(aTextField, aEvent)
   {
      this.updateExpression();
   },

   updateExpression : function()
   {
      var columnSelections = this.filterColumnsGrid.getSelectionModel().getSelections();
      var operatorSelections = this.filterOperatorsGrid.getSelectionModel().getSelections();

      var result = '';

      if(columnSelections && columnSelections.length == 1)
      {
         result += '[' + columnSelections[0].data['name'] + ']';

         if(operatorSelections && operatorSelections.length == 1)
         {
            result += ' ' + operatorSelections[0].data['displayValue'] + ' ' + this.filterValuePanel.getValue();
         }

      }

      this.filterValue.setText(result);
   },

   getRuntimeFilter : function()
   {
      this.updateExpression();

      var querySelections = this.filterQueriesGrid.getSelectionModel().getSelections();
      var columnSelections = this.filterColumnsGrid.getSelectionModel().getSelections();
      var operatorSelections = this.filterOperatorsGrid.getSelectionModel().getSelections();

      var query;
      var column;
      var operator;

      if(querySelections && querySelections.length == 1)
      {
         query = querySelections[0].data['name']
      }

      if(columnSelections && columnSelections.length == 1)
      {
         column = columnSelections[0].data['name'];
      }

      if(operatorSelections && operatorSelections.length == 1)
      {
         operator = operatorSelections[0].data['value'];
      }

      var values = this.filterValuePanel.getValue();
      var expression = this.filterValue.text;

      if(column && operator && values && query)
      {
         return new ReiRuntimeFilter(column, operator, values, query, expression);
      }
      else
      {
         return null;
      }
   }
});

Adf.FilterValuePickerDialog = Ext.extend(Ext.Window, {

   constructor: function(aConfig)
   {
      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      this.simpleFilterEditor = new Adf.SimpleFilterEditorPanel(
         {
            biQuerySet: aConfig.biQuerySet,
            filter : aConfig.filter,
            packagePath : aConfig.packagePath
         });

      aConfig = Ext.apply({
         height: 500,
         width: 770,
         title: applicationResources.getProperty("profileWizard.directive.newFilter"),
         items: this.simpleFilterEditor,
         layout: 'fit',
         buttons: [{
            text : applicationResources.getProperty('button.Save'),
            scope: this,
            handler: this.okButtonClicked
         },
         {
            text: applicationResources.getProperty('button.Cancel'),
            scope: this,
            handler: function(){this.hide();}
         }]
      }, aConfig);

      Adf.FilterValuePickerDialog.superclass.constructor.call(this, aConfig);

      this.addEvents({
          "onOkButtonClicked" : true
      });

   },

   okButtonClicked : function(aButton, aEvent)
   {
      var filter = this.simpleFilterEditor.getRuntimeFilter();
      if(filter == null)
      {
         Ext.Msg.alert(applicationResources.getProperty('reportWizard.validation.title'), applicationResources.getProperty('profileWizard.filters.failedValidationMessage'));
      }
      else
      {
         this.fireEvent('onOkButtonClicked', filter);
         this.close();
      }
   }
});