var rcl;
Ext.namespace('rcl');

rcl.editReportProfileUi = function()
{
    return {

        init : function(aEditReportExecutionInputsForm){

             this.win = null;

            this.editReportExecutionInputsForm = aEditReportExecutionInputsForm;
            this.queriesInReport = aEditReportExecutionInputsForm.report.reportMetaData.reportQueryMetaDataItems;
            this.filtersInReport = aEditReportExecutionInputsForm.reportExecutionInputs.runtimeFilters.filters;

            this.currentFilter = null;
            this.currentQuery = null;
            this.currentColumn = null;
            this.currentRelation = null;
            this.currentValues = {
                values: null,
                multiValues: false
            };

             this.createRelationSets();

             this.reiMaxExecutionTime = (aEditReportExecutionInputsForm.reportExecutionInputs.maxExecutionTime) ? (aEditReportExecutionInputsForm.reportExecutionInputs.maxExecutionTime) : "";
             this.reiLaunchPreference = this.formatLaunchPref(aEditReportExecutionInputsForm.reportExecutionInputs.launchPreference);
             this.reiOutputExpirationDays = this.formatRetentionPolicy(aEditReportExecutionInputsForm.reportExecutionInputs.outputExpirationDays);

             this.Bbar = new Ext.Toolbar({
                items : [this.createToolbarButton("cancelRei", "cancel.png", this.onCancelButtonClicked, applicationResources.getProperty("button.Cancel")), '-',
                         this.createToolbarButton("runRei", "report_go.png", this.onRefreshButtonClicked, applicationResources.getProperty("button.Run")), '-',
                         this.createToolbarButton("getSqlRei", "application_get.png", rcl.editReportProfileUi.onRefreshButtonClicked, applicationResources.getProperty("button.getSql")), '-',
                         this.createToolbarButton("saveRei", "report_disk.png", rcl.editReportProfileUi.onSaveButtonClicked, applicationResources.getProperty("button.Save")), '-',
                         this.createToolbarButton("saveAsRei", "report_disk.png", rcl.folderContentsUi.onSaveAsButtonClicked, applicationResources.getProperty("button.SaveAs")), '-'

                ]
             });

             var labelWidthStyle = 'width:300px';

            //******************************************************************************************************************************************************
            // Creating output Tab and all its inner components

            this.overrideCheckBox = this.createCheckbox('overrideCheckBox',
                                                        labelWidthStyle,
                                                        'Override Default Output Types? ' + this.outputPrefString(aEditReportExecutionInputsForm.reportExecutionInputs.outputPreferences));

            this.outputPreferenceFieldSet = this.createFieldset("outputPreferenceFieldSet","Output Preferences (for report viewing)",true,10,true,this.overrideCheckBox);

            this.retentionPolicyCombobox = this.createComboBox("retentionPolicyCombobox",
                                                                [ 'Use System Default', '7 Days', '30 Days', '90 Days', '1 Year', '1.5 Years', 'Never'],
                                                                "Report Outputs expire in",
                                                                false,
                                                                175,
                                                                labelWidthStyle,
                                                                this.reiOutputExpirationDays,
                                                                this.reiOutputExpirationDays,
                                                                null,
                                                                null);

            this.retentionPolicyFieldSet = this.createFieldset("retentionPolicyFieldSet","Retention Policy",true,10,true,this.retentionPolicyCombobox);

            this.launchPreferenceCombobox = this.createComboBox("launchPreferenceCombobox",
                                                                ['Background', 'Foreground'],
                                                                "Execute reports in",
                                                                false,
                                                                120,
                                                                labelWidthStyle,
                                                                this.reiLaunchPreference,
                                                                this.reiLaunchPreference,
                                                                null,
                                                                null);

            this.launchPreferenceFieldSet = this.createFieldset("launchPreferenceFieldSet","Launch Preference",true,10,true,this.launchPreferenceCombobox);

            this.maxExecutionTimeField = this.createTextField('maxExecutionTimeField',labelWidthStyle,'Max Execution Time (seconds)<br/>(For no set max execution time please enter 0)',this.reiMaxExecutionTime);

            this.maxExecutionTimeFieldSet = this.createFieldset("maxExecutionTimeFieldSet","Max Execution Time",true,10,true,this.maxExecutionTimeField);

             var outputTab = {
                                title : 'Outputs',
                                items: [
                                         this.outputPreferenceFieldSet,
                                         this.retentionPolicyFieldSet,
                                         this.launchPreferenceFieldSet,
                                         this.maxExecutionTimeFieldSet                                     
                                       ]
                             };

            //******************************************************************************************************************************************************

            //******************************************************************************************************************************************************
            // Creating Destination Tab and all its inner components

            this.destinationsFieldSet = this.createFieldset("destinations","Add destinations to the profile\'s destinations list then select from there to edit appropriate options.",true,10,true,null);

            this.deliveryOptionsFieldSet = this.createFieldset("deliveryOptions","Delivery Options",true,10,true,null);


//            this.activeDeliveryPrefs = this.editReportExecutionInputsForm.reportExecutionInputs.activeDeliveryPreferences

            this.availableDestinationsDataStore = new Ext.data.Store({
                fields: ['value','text'],
                reader			: new Ext.data.JsonReader({
                                    root 			: 'availableDestinations'
                                    },['value', 'text'])

                });

            this.availableDestinationsDataStore.loadData(this.editReportExecutionInputsForm, true);

    /*
     * Ext.ux.form.ItemSelector Example Code
     */
    this.isForm = new Ext.form.FormPanel({
        title: 'ItemSelector Test',
        width:700,
        bodyStyle: 'padding:10px;',
        renderTo: 'itemselector',
        items:[{
            xtype: 'itemselector',
            name: 'itemselector',
            fieldLabel: 'ItemSelector',
	        imagePath: ServerEnvironment.baseUrl + "/images",
            multiselects: [{
                width: 250,
                height: 200,
                store: this.availableDestinationsDataStore,
                displayField: 'text',
                valueField: 'value'
            },{
                width: 250,
                height: 200,
                store: [['2','Email Server']]
//                tbar:[{
//                    text: 'clear',
//                    scope      : this,
//                    handler:function(){
//	                    this.isForm.getForm().findField('itemselector').reset();
//	                }
//                }]
            }]
        }],

        buttons: [{
            text: 'Save',
            scope      : this,
            handler: function(){
                if(this.isForm.getForm().isValid()){
                    Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />'+
                        this.isForm.getForm().getValues(true));
                }
            }
        }]
    });


            var destinationsTab = {
                                    title : 'Destinations',
                                    items: [
                                                this.isForm
                                           ]
                             };

            //******************************************************************************************************************************************************

            //******************************************************************************************************************************************************
            // Creating Filter Tab and all its inner componenets

            this.valuePickerButton = this.createButton("valuePickerButton","wand.png", rcl.editReportProfileUi.onvaluePickerButtonClicked, "Value Picker");
            this.valuePickerButton.disable();

         this.filterTbar = new Ext.Toolbar({
            items : [this.createToolbarButton("filterAdd","filter_add.PNG", rcl.editReportProfileUi.onAddFilterButtonClicked, "Add"), '-',
                     this.createToolbarButton("filterDelete","filter_delete.PNG", rcl.editReportProfileUi.onDeleteFilterButtonClicked, "Delete"), '-'

            ]
         });

            this.queryData = this.editReportExecutionInputsForm.report.reportMetaData;


            this.queryDataStore = new Ext.data.Store({
                autoDestroy: true,
                reader			: new Ext.data.JsonReader({
                                    root 			: 'reportQueryMetaDataItems'
                                    },['name'])

                });

            this.queryDataStore.loadData(this.queryData, true);

            this.queryCombobox = new Ext.form.ComboBox({
                                   store: this.queryDataStore,
                                   name: 'queryCombobox',
                                   displayField:'name',
                                   valueField: 'name',
                                   id: 'queryCombobox',
                                   width: 50,
                                   editable: false,
                                    scope      : this,
                                    selectOnFocus: true,
                                    mode: 'local',
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    allowBlank: false,
                                    listeners:

                                                {
                                                    select: { fn:function()
                                                                {
                                                                    rcl.editReportProfileUi.onQueryComboboxSelected();
                                                                }
                                                            }
                                                }
                                            }
                                );

            this.columnData = this.editReportExecutionInputsForm.report.reportMetaData.reportQueryMetaDataItems[0];


            this.columnDataStore = new Ext.data.Store({
                autoDestroy: true,
                reader			: new Ext.data.JsonReader({
                                    root 			: 'reportDataItemMetaDataItems'
                                    },['dataType','expression','name','supportsValuePicker'])

                });

            this.columnDataStore.loadData(this.columnData, true);

            this.columnCombobox = new Ext.form.ComboBox({
                                   store: this.columnDataStore,
                                   name: 'columnCombobox',
                                   displayField:'name',
                                   valueField: 'name',
                                   id: 'columnCombobox',
                                   width: 50,
                                   editable: false,
                                    scope      : this,
                                    selectOnFocus: true,
                                    mode: 'local',
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    allowBlank: false,
                                   listeners:{focus: { fn:function()
                                                            {
                                                                rcl.editReportProfileUi.onColumnComboboxSelected();
                                                            }
                                   }}}
                                );

            this.relationDataStore = new Ext.data.ArrayStore({
                fields: ['relation']
            });

            this.relationCombobox = new Ext.form.ComboBox({
                                   store: this.relationDataStore,
                                   name: 'relationCombobox',
                                   displayField:'relation',
                                   valueField: 'relation',
                                   id: 'relationCombobox',
                                   width: 50,
                                   editable: false,
                                    scope      : this,
                                    selectOnFocus: true,
                                    mode: 'local',
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    allowBlank: false,
                                   listeners:{focus: { fn:function()
                                                            {
//                                                                rcl.editReportProfileUi.onColumnComboboxSelected();
                                                            }
                                   }}}
                                );

            this.valuesTextField = this.createTextField('valuesTextField',labelWidthStyle,'','');

            this.filterData = this.editReportExecutionInputsForm.reportExecutionInputs.runtimeFilters;

            this.originalNumOfFilters = this.filterData.filters.size();

            this.filterDataStore = new Ext.data.Store({
                autoDestroy: true,
                reader			: new Ext.data.JsonReader({
                                    root 			: 'filters'
                                    },['filterName','queryName','columnName', 'relation', 'values', 'multiValues', 'expression'])

                });

            this.filterDataStore.loadData(this.filterData, true);

        var cm = new Ext.grid.ColumnModel({
            // specify any defaults for each column
            defaults: {
                sortable: true // columns are not sortable by default
            },
            columns: [
                {
                    id: 'filterName',
                    header: 'Filter',
                    dataIndex: 'filterName',
                    width: 100,
                    editor: {
                        xtype: 'textfield',
                        disabled: true
                    }
                },
                {
                    id: 'queryName',
                    header: 'Query',
                    dataIndex: 'queryName',
                    width: 100,
                    editor: this.queryCombobox

                },
                {
                    id: 'columnName',
                    header: 'Column',
                    dataIndex: 'columnName',
                    width: 150,
                    editor: this.columnCombobox
                },
                {
                    id: 'relation',
                    header: 'Relationship',
                    dataIndex: 'relation',
                    width: 75,
                    editor: this.relationCombobox
                },{
                    id: 'values',
                    name: 'values',
                    header: 'Values',
                    dataIndex: 'values',
                    width: 300,
                    sortable: true,
                    editor: this.valuesTextField
       
                }
            ]
        });
            this.editor = new rcl.ReportProfileRowEditor({
                saveText: 'Update',
                scope: this,
                listeners:      {
                                    beforeedit: function ()
                                    {
                                        rcl.editReportProfileUi.configureComboBoxesForSelectedRow();
                                    }
                                }
            });


        this.filterGrid = new Ext.grid.GridPanel({
            store:  this.filterDataStore ,
            cm: cm,
            height: 600,
            width: 950,
            plugins: [this.editor],
            title: 'Runtime Filters',
            // config options for stateful behavior
            autoExpandColumn: 'values',
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            stateful: true,
            stateId: 'grid',
            clicksToEdit: 1,
            tbar: this.filterTbar,
            layout : 'fit'
        });


            var filtersTab = {
                                    title : 'Filters',
                                    bodyStyle: 'padding:0 10px 0;',
                                    items: [
                                                this.filterGrid
                                           ]
                             };

            //******************************************************************************************************************************************************

            this.tabPanel = new Ext.TabPanel({
                activeTab         : 0,
                id                : 'editProfileTPanel',
                enableTabScroll   : true,
                deferredRender: false,
                items             : [   outputTab,
                                        destinationsTab,
                                        filtersTab
                                    ]
            });

        },

        configureComboBoxesForSelectedRow : function ()
        {
            var selected = this.filterGrid.getSelectionModel().getSelections();

            this.currentFilter = selected[0].data;


            this.currentQuery = this.getQueryByName(this.currentFilter.queryName);
            this.currentColumn = this.getColumnByNameAndQuery(this.currentQuery, this.currentFilter.columnName);
            this.currentRelation = this.currentFilter.relation;
            this.currentValues.values = this.currentFilter.values;
            this.currentValues.multiValues = this.currentFilter.multiValues;


            this.columnDataStore.removeAll();
            this.columnCombobox.clearValue();
            this.loadColumnDataStore(this.currentQuery.name);
            this.columnCombobox.setValue(this.currentColumn.name);

            this.relationDataStore.removeAll();
            this.relationCombobox.clearValue();
            this.loadRelationDataStore(this.currentQuery.name,this.currentColumn.name);
            this.relationCombobox.enable();

            if(this.currentColumn.supportsValuePicker)
            {
                this.valuePickerButton.enable();
            }
            else
            {
                this.valuePickerButton.disable();    
            }


        },

        onQueryComboboxSelected : function()
        {
            var queryName = this.queryCombobox.getValue();
            this.columnDataStore.removeAll();
            this.columnCombobox.clearValue();
            this.loadColumnDataStore(queryName);

            this.relationDataStore.removeAll();
            this.relationCombobox.clearValue();

            this.currentQuery = this.getQueryByName(queryName);

        },

        onColumnComboboxSelected : function()
        {
            var columnName = this.columnCombobox.getValue();
            var queryName = this.queryCombobox.getValue();

            this.currentColumn = this.getColumnByNameAndQuery(this.currentQuery, columnName);

            this.relationDataStore.removeAll();
            this.relationCombobox.clearValue();
            this.loadRelationDataStore(queryName,columnName);
            this.relationCombobox.enable();

            if(this.currentColumn.supportsValuePicker)
            {
                this.valuePickerButton.enable();
            }
            else
            {
                this.valuePickerButton.disable();
            }

        },

        onAddFilterButtonClicked : function(aButton)
        {

            // access the Record constructor through the grid's store
            var Filter = this.filterGrid.getStore().recordType;
            this.originalNumOfFilters += 1;
            var p = new Filter({
                filterName: 'Runtime Filter' + this.originalNumOfFilters,
                queryName: this.queriesInReport[0].name,
                columnName: this.queriesInReport[0].reportDataItemMetaDataItems[0].name,
                relation: '',
                values: ''
            });
            this.editor.stopEditing();
            this.filterDataStore.insert(0, p);
            this.filterGrid.getView().refresh();
            this.filterGrid.getSelectionModel().selectRow(0);
            this.editor.startEditing(0);



        },

        onDeleteFilterButtonClicked : function(aButton)
        {

            var selected = this.filterGrid.getSelectionModel().getSelections();
            if(selected == null || selected.size() <1)
            {
                Ext.Msg.alert("Delete", "No filter was selected");
                return;
            }

            var items = this.filterDataStore.data.items;

            for(var s = 0; s < selected.size(); s++)
            {
                var filterName = selected[s].data.filterName;

                for(var i = 0; i<items.size(); i++)
                {
                    var dataValue = items[i].get('filterName');

                    if(dataValue == filterName)
                    {
                        this.filterDataStore.removeAt(i);
                    }
                }

            }

            this.valuePickerButton.disable();

        },

        onManualFilterValueChange : function (aValue)
        {
            this.currentValues.values = aValue;

           if (this.currentRelation != null && (this.currentRelation == 'is not null' || this.currentRelation == 'is null'))
           {
              this.currentValues.values = "";
               this.editor.values.valuesTextField = this.currentValues.values;
               this.valuesTextField.setValue(this.currentValues.values);

           }
           else
           {
              if (this.currentColumn.dataType != 'NUMBER')
              {
                 this.currentValues.values = this.createStringLiteral(this.currentValues.values);
                  this.editor.values.valuesTextField = this.currentValues.values;
                  this.valuesTextField.setValue(this.currentValues.values);
              }
           }

            var selected = this.filterGrid.getSelectionModel().getSelections();

            selected[0].data.values = this.currentValues.values;

            this.currentFilter = selected[0].data;

            return this.currentValues;

        },

        onCancelButtonClicked: function(aButton)
        {
            this.win.close();
        },

        beforeSubmit : function()
        {
           return uiController.beforeSubmit();
//            var maxExecutionTimeField = this.maxExecutionTimeField.getValue();
//            if(maxExecutionTimeField.length == 0 || maxExecutionTimeField == 'null')
//            {
//                this.maxExecutionTimeField.setValue('null');
//            }
//            else if((!JsUtil.isInteger(maxExecutionTimeField)))
//            {
//                Ext.Msg.alert("Max Execution Time", "Please enter a correct formated number for Max Execution Time"
//                 +"<br/>If you want to have no Max Execution Time enter 0");
//                return false;
//            }
//
//            var filters = this.filterGrid.store.data.items;
//
//            for(var i=0; i<filters.size(); i++)
//            {
//                var data = filters[i].data;
//                if(data.values == null)
//                {
//                    data.values = "";
//                }
//                if(data.queryName == "")
//                {
//                    Ext.Msg.alert("Filter Expression", "Please select a Query for " + data.filterName);
//                    return false;
//                }
//                if(data.columnName == "")
//                {
//                    Ext.Msg.alert("Filter Expression", "Please select a Column for " + data.filterName);
//                    return false;
//                }
//                if(data.relation == "")
//                {
//                    Ext.Msg.alert("Filter Expression", "Please select a Relationship for " + data.filterName);
//                    return false;
//                }
//                else
//                {
//                    if(data.relation == "is null" || data.relation == "is not null")
//                    {
//                        data.values = "";
//                    }
//                }
//
//            }
//
//            return true;
        },

        loadFilterArrayStore: function(aArrayStore)
        {
            var data = [];

            if(this.editReportExecutionInputsForm.reportExecutionInputs.runtimeFilters == null)
            {

                return new Ext.data.ArrayStore({
                        fields: ['id','filterName', 'queryName','dataItemName','expression','fullyQualifiedQueryItemExpression', 'relation', 'values', 'multiValues'],
                        data: data
                        });
            }
            else
            {
                var filtersArray = this.editReportExecutionInputsForm.reportExecutionInputs.runtimeFilters.filters;

                if(aArrayStore == null)
                {
                    aArrayStore = new Ext.data.ArrayStore({
                                    fields: ['id','filterName', 'queryName','dataItemName','expression','fullyQualifiedQueryItemExpression', 'relation', 'values', 'multiValues'],
                                    data: data
                                    });
                }

                for(var i=0; i<filtersArray.size(); i++)
                {
                    data = [
                                [i+1,filtersArray[i].filterName,
                                    filtersArray[i].query,
                                    filtersArray[i].runtimeFilterExpression.dataItemName,
                                    '['+filtersArray[i].runtimeFilterExpression.dataItemName+'] ' + filtersArray[i].runtimeFilterExpression.relation + ' ' + filtersArray[i].runtimeFilterExpression.values, 
                                    filtersArray[i].runtimeFilterExpression.fullyQualifiedQueryItemExpression,
                                    filtersArray[i].runtimeFilterExpression.relation,
                                    filtersArray[i].runtimeFilterExpression.values,
                                    filtersArray[i].runtimeFilterExpression.multiValues]
                                ];

                    aArrayStore.loadData(data, true);
                }

                return aArrayStore;

            }
        },

        loadContainersArrayStore: function(aArrayStore)
        {
            var data = [];

            if(this.editReportExecutionInputsForm.crnReport.crnLists == null)
            {

                return new Ext.data.ArrayStore({
                        fields: ['id','name', 'queryName','xpath'],
                        data: data
                        });
            }
            else
            {
                var containersArray = this.editReportExecutionInputsForm.crnReport.crnLists;

                if(aArrayStore == null)
                {
                    aArrayStore = new Ext.data.ArrayStore({
                                    fields: ['id','name', 'queryName','xpath'],
                                    data: data
                                    });
                }

                for(var i=0; i<containersArray.size(); i++)
                {
                    data = [
                                [   i+1,
                                    containersArray[i].name,
                                    containersArray[i].queryName,
                                    containersArray[i].xpath]
                                ];

                    aArrayStore.loadData(data, true);
                }

                return aArrayStore;

            }
        },

        onvaluePickerButtonClicked : function()
        {

            var crnDialog = new CrnDialog();

            var reportDataItemMetaDataItem = this.getColumnByNameAndQuery(this.getQueryByName(this.currentQuery.name), this.currentColumn.name);

            var dialogListener = {
             thisDoc : document,
             editProfile : this,
             dialogFinished : function (aPicker) {
                if (aPicker.wasCancelled == false)
                {

                       this.editProfile.onValuePickerDialogFinished(aPicker.selectedValues);
                }
             }
            };

            crnDialog.setDialogListener (dialogListener);

            crnDialog.showValuePickerDialog("Select Values",
                                          reportDataItemMetaDataItem.expression,
                                          "",
                                          true,
                                          null,
                                          this.editReportExecutionInputsForm.crnPackage,
                                          100,
                                          "displayValue", null, null, null, 1000);

        },

        onValuePickerDialogFinished: function(aSelectedValues)
        {
            var selectedValues = aSelectedValues;

            var expressionValues = '(';


            for (var i = 0; i < selectedValues.length; ++i)
            {
                if (selectedValues.length == 1 && this.currentColumn.dataType == "DATETIME")
                {
                    expressionValues += selectedValues[i].value;
                    expressionValues = expressionValues.replace(/T([0-9]{2}:?){3}/, "");
                }
                else if (this.currentColumn.dataType == 'NUMBER')
                {
                    expressionValues += selectedValues[i].value;
                }
                else
                {
                    expressionValues += this.createStringLiteral(selectedValues[i].value);
                }

                if (i != selectedValues.length - 1)
                {
                    expressionValues += ", ";
                }
            }
            expressionValues += ")";

            this.currentValues.values = expressionValues;

            if(selectedValues.length >1)
            {
                this.currentValues.multiValues = true;              
                if(this.currentRelation== '<>')
                {
                    this.currentRelation = 'not in';
                }
                else
                {
                    this.currentRelation = 'in';
                }
            }

            this.relationCombobox.setValue(this.currentRelation);

            this.valuesTextField.setValue(this.currentValues.values);

        },

        createStringLiteral: function (aRawValue)
        {
           var doubleQuotes = aRawValue.replace(/\'/g, "''"); //replace all single quotes with two single quotes as cognos expects

           //var escapedValue =  JsUtil.escapeXml(doubleQuotes);  //we don't want to do this because it is not what Cognos expects; only replace single quotes with two

           return "'" + doubleQuotes + "'";
        },

        loadQueryArrayStore: function()
        {
            var data = [];

            var arrayStore = new Ext.data.ArrayStore({
                                fields: ['id','queryName'],
                                data: data
                                });

            var reportQueryMetaDataItems = this.editReportExecutionInputsForm.report.reportMetaData.reportQueryMetaDataItems;

            for(var i=0; i<reportQueryMetaDataItems.size(); i++)
            {
                data = [
                            [i, reportQueryMetaDataItems[i].name]
                            ];

                arrayStore.loadData(data, true);
            }

            return arrayStore;

        },        

        onSaveButtonClicked: function(aButton)
        {
            if(this.beforeSubmit())
            {
                var jsonFromString = Ext.util.JSON.encode(this.setEditReportExecutionInputsFormValues());
                RequestUtil.request({
                    url: ServerEnvironment.baseUrl + "/secure/actions/ext/saveReportProfile.do",
                    params: {"jsonFromString": jsonFromString},
                    method: "POST",
                    callback: function (aOptions, aSuccess, aResponse)
                    {
                       //todo - Struts action needs to be updated to return JS for the Ext
//                       Ext.Msg.alert("Save", 'Report Profile Saved.');
                       this.win.close();
                    },
                    scope: this
                 });
            }

        },

        onSaveAsButtonClicked: function(aButton)
        {
            if(this.beforeSubmit())
            {
               Ext.Msg.prompt("Profile Name", "Enter a new name for the profile:",
                  function(btn, text)
                  {
                      var jsonFromString = Ext.util.JSON.encode(this.setEditReportExecutionInputsFormValues());
                      RequestUtil.request({
                          url: ServerEnvironment.baseUrl + "/secure/actions/ext/saveReportProfile.do",
                          params: {"jsonFromString": jsonFromString},
                          method: "POST",
                          callback: function (aOptions, aSuccess, aResponse)
                          {
                             //todo - Struts action needs to be updated to return JS for the Ext
      //                       Ext.Msg.alert("Save", 'Report Profile Saved.');
                             this.win.close();
                          },
                          scope: this
                        });
                   },
                   this, false, this.formPanel.getForm().findField('').value);
            }

        },

        getFilterDataByName : function(aFilterName)
        {
            var filterDataItems = this.filterDataStore.data.items;

            for(var i=0; i<filterDataItems.size(); i++)
            {
                var currentData = filterDataItems[i].data;

                if(currentData.filterName == aFilterName)
                {
                    return currentData
                }

            }

            return null;
        },

        getQueryItemRefsByQueryName : function(aQueryName)
        {
            var crnReportLists = this.editReportExecutionInputsForm.crnReport.crnLists;
            if(crnReportLists != null)
            {
                for(var i=0; i<crnReportLists.size(); i++)
                {
                    if(crnReportLists[i].queryName = aQueryName)
                    {
                        return crnReportLists[i];
                    }
                }
            }

        },

        getDataFromDataStore: function(aDataField, aValue, aDataStore)
        {
            var items = aDataStore.data.items;

            for(var i = 0; i<items.size(); i++)
            {
                var dataValue = items[i].get(aDataField.toString());

                if(dataValue == aValue)
                {
                    return items[i].data;
                }
            }

            return null;

        },

        getFilterByQueryName: function(aQueryName)
        {

            var filters = this.editReportExecutionInputsForm.reportExecutionInputs.runtimeFilters.filters;

            if(filters == null)
            {
                return null;
            }
            else
            {
                for(var i=0; i<filters.size(); i++)
                {
                    if(filters[i].query == aQueryName)
                    {
                        return filters[i];
                    }
                }
                return null;
            }

        },

        loadColumnDataStore: function(aQueryName)
        {
            var reportQueryMetaDataItems = this.editReportExecutionInputsForm.report.reportMetaData.reportQueryMetaDataItems;

            for(var i=0; i<reportQueryMetaDataItems.size(); i++)
            {
                if(reportQueryMetaDataItems[i].name == aQueryName)
                {
                    this.columnDataStore.loadData(reportQueryMetaDataItems[i], true);

                }
            }
        },

        loadRelationDataStore : function(aQueryName, aColumnName)
        {

           var reportQueryMetaDataItems = this.editReportExecutionInputsForm.report.reportMetaData.reportQueryMetaDataItems;

            for(var i=0; i<reportQueryMetaDataItems.size(); i++)
            {
                if(reportQueryMetaDataItems[i].name == aQueryName)
                {
                    var reportDataItemMetaDataItems = reportQueryMetaDataItems[i].reportDataItemMetaDataItems;

                    for(var m=0; m<reportDataItemMetaDataItems.size(); m++)
                    {

                        if(reportDataItemMetaDataItems[m].name == aColumnName)
                        {

                            if(reportDataItemMetaDataItems[m].dataType == "STRING")
                            {
                                this.relationDataStore.loadData(this.StringRelationData, true);
                            }
                            else if(reportDataItemMetaDataItems[m].dataType == "NUMBER")
                            {
                                this.relationDataStore.loadData(this.NumberRelationData, true);
                            }
                            else if(reportDataItemMetaDataItems[m].dataType == "DATETIME" )
                            {
                                this.relationDataStore.loadData(this.dateTimeRelationData, true);
                            }

                        }

                    }

                }
            }

            return [];            

        },

        onRelationComboboxSelected : function()
        {
            var selectedRelationship = this.relationCombobox.getValue();
            if(selectedRelationship == 'is not null' || selectedRelationship == 'is null')
            {
                this.currentRelation = selectedRelationship;
                this.valueField.setValue('');
            }
            else if(this.currentValues.multiValues)
            {

                if(selectedRelationship == '<>')
                {
                    this.currentRelation = 'not in';
                }
                else
                {
                    this.currentRelation = 'in';
                }
            }
            else
            {
                this.currentRelation = this.relationCombobox.getValue();                
            }
            this.valueField.enable();
        },

        getQueryByName : function(aQueryName)
        {

            var reportQueryMetaDataItems = this.editReportExecutionInputsForm.report.reportMetaData.reportQueryMetaDataItems;

            for(var i = 0; i<reportQueryMetaDataItems.size(); i++)
            {
                if(reportQueryMetaDataItems[i].name == aQueryName)
                {
                    return reportQueryMetaDataItems[i];
                }
            }

            return null;

        },

        getColumnByNameAndQuery : function(aReportQueryMetaDataItem, aName)
        {

            var reportDataItemMetaDataItems = aReportQueryMetaDataItem.reportDataItemMetaDataItems;

            for(var i = 0; i< reportDataItemMetaDataItems.size(); i++)
            {
                if(reportDataItemMetaDataItems[i].name == aName)
                {
                    return reportDataItemMetaDataItems[i];
                }
            }

            return null;

        },

        setEditReportExecutionInputsFormValues: function()
        {
           //todo grab rei from legacy controller
           this.formPanel.getForm.findField('reiXml').value = uiController.getRei();
//            var retentionPolicyComboboxValue = this.retentionPolicyCombobox.getValue();
//
//            if(retentionPolicyComboboxValue == '7 Days')
//            {
//                this.editReportExecutionInputsForm.reportExecutionInputs.outputExpirationDays = '7';
//            }
//            else if(retentionPolicyComboboxValue == '30 Days')
//            {
//                this.editReportExecutionInputsForm.reportExecutionInputs.outputExpirationDays = '30';
//            }
//            else if(retentionPolicyComboboxValue == '90 Days')
//            {
//                this.editReportExecutionInputsForm.reportExecutionInputs.outputExpirationDays = '90';
//            }
//            else if(retentionPolicyComboboxValue == '1.5 Years')
//            {
//                this.editReportExecutionInputsForm.reportExecutionInputs.outputExpirationDays = '548';
//            }
//            else if(retentionPolicyComboboxValue == '1 Year')
//            {
//                this.editReportExecutionInputsForm.reportExecutionInputs.outputExpirationDays = '365';
//            }
//            else if(retentionPolicyComboboxValue == 'Never')
//            {
//                this.editReportExecutionInputsForm.reportExecutionInputs.outputExpirationDays = '-1';
//            }
//            else
//            {
//                this.editReportExecutionInputsForm.reportExecutionInputs.outputExpirationDays = "null";
//            }
//
//            this.editReportExecutionInputsForm.reportExecutionInputs.maxExecutionTime = this.maxExecutionTimeField.getValue();
//            this.editReportExecutionInputsForm.reportExecutionInputs.launchPreference  = this.launchPreferenceCombobox.getValue();
//
//            var numOfFilters = this.filterDataStore.data.items.size();
//            var filtersArray = new Array(numOfFilters);
//
//            for(var i=0; i<numOfFilters; i++)
//            {
//                filtersArray[i] = this.filterDataStore.data.items[i].data;
//            }
//
//            this.editReportExecutionInputsForm.reportExecutionInputs.runtimeFilters.filters = filtersArray;
//
//            return this.editReportExecutionInputsForm;

        },

        getPanel: function(){
            return this.tabPanel;
        },

        setWindow: function(aWindow){
            this.win = aWindow;
        },

        getBbar: function(){
            return this.Bbar;
        },

        outputPrefString : function(aOutputPreferences)
        {
            var prefString = '( ';

            if(aOutputPreferences.CSV)
            {
                prefString += 'CSV ';
            }
            if(aOutputPreferences.HTML)
            {
                prefString += 'HTML ';
            }
            if(aOutputPreferences.XML)
            {
                prefString += 'XML ';
            }
            if(aOutputPreferences.PDF)
            {
                prefString += 'PDF ';
            }
            if(aOutputPreferences.singleXLS)
            {
                prefString += 'singleXLS ';
            }
            if(aOutputPreferences.spreadsheetML)
            {
                prefString += 'spreadsheetML ';
            }

            prefString += ')';

            return prefString;

        },

        formatRetentionPolicy : function(aOutputExpirationDays)
        {
            if(aOutputExpirationDays == '7')
            {
                return '7 Days';
            }
            if(aOutputExpirationDays == '30')
            {
                return '30 Days';
            }
            if(aOutputExpirationDays == '90')
            {
                return '90 Days';
            }
            if(aOutputExpirationDays == '548')
            {
                return '1.5 Years';
            }
            if(aOutputExpirationDays == '365')
            {
                return '1 Year';
            }
            if(aOutputExpirationDays == '-1')
            {
                return 'Never';
            }
            else
            {
                return 'Use System Default';
            }
        },

        formatLaunchPref : function(aLaunchPref)
        {
            if(aLaunchPref == "BACKGROUND")
            {
                return 'Background';
            }
            else
            {
                return 'Foreground';
            }
        },

       createTab: function(aId, aTitle, aItems)
       {

       },

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

      createButton: function (aButtonId, aButtonIcon, aHandler, aButtonName)
      {
            return new Ext.Button({
                                    id      : aButtonId,
                                    text    : aButtonName,
                                    icon    : ServerEnvironment.baseUrl + "/images/silkIcons/" + aButtonIcon,
                                    scope: this,
                                    handler : aHandler
                                 });

      },

    createComboBox: function(aId, aStore, aLabel, aDisabledToggle, aWidth, aLabelStyle, aEmptyText, aValue, aListener, aDisplayField)
    {

        return new Ext.form.ComboBox({
                                  id         : aId,
                                  disabled   : aDisabledToggle,
                                  fieldLabel : aLabel,
                                  width      : aWidth,
                                  labelStyle : aLabelStyle,
                                  store      : aStore,
                                  emptyText  : aEmptyText,
                                  value      : aValue,
//                                  editable   : false,
                                  scope      : this,
                                  listeners  : aListener,
                                    lazyRender: true,
                                    listClass: 'x-combo-list-small',
                                    displayField: aDisplayField,
                                    selectOnFocus: true,
                                    mode: 'local',
                                    typeAhead: true,
                                    triggerAction: 'all'

                                });

    },

        createTextField: function(aId,aLabelStyle, aFieldLabel, aValue)
        {
            return new Ext.form.TextField({
                                          id          : aId,
                                          labelStyle  : aLabelStyle,
                                          fieldLabel  : aFieldLabel,
                                          value       : aValue,
                                          scope       : this
            });
        },

        createFieldset: function(aId, aTitle, aBorder, aPadding, aAutoHeight, aItems)
        {
            return new Ext.form.FieldSet({
                                            id           : aId,
                                            title       : aTitle,
                                            border       : aBorder,
                                            padding      : aPadding,
                                            autoHeight   : aAutoHeight,
                                            items        : aItems
                                        });
        },

        createTextArea: function(aId, aDisabled, aWidth, aLabelStyle, aFieldLabel)
        {
            return new Ext.form.TextArea({
                                              id         : aId,
                                              disabled   : aDisabled,
                                              width      : aWidth,
                                              labelStyle : aLabelStyle,
                                              fieldLabel : aFieldLabel
                                        });
        },

        createCheckbox: function(aId,aLabelStyle, aFieldLabel)
        {

            return new Ext.form.Checkbox({
                                            id: aId,
                                            labelStyle: aLabelStyle,
                                            fieldLabel : aFieldLabel
                                        });

        },

        createRelationSets : function()
        {
            this.NumberRelationData =  [
                                                ["<"],
                                                ["<="],
                                                [">"],
                                                [">="],
                                                ["="],
                                                ["<>"],
                                                ["is null"],
                                                ["is not null"]
                                              ];

            this.StringRelationData =  [
                                                ["="],
                                                ["<>"],
                                                ["contains"],
                                                ["is null"],
                                                ["is not null"],
                                                ["starts with"],
                                                ["ends with"]
                                              ];

            this.dateTimeRelationData =  [
                                                ["<"],
                                                ["<="],
                                                [">"],
                                                [">="],
                                                ["="],
                                                ["<>"],
                                                ["between"],
                                                ["is null"],
                                                ["is not null"]
                                              ];

        }

    };

}();

/*
{
                            xtype: 'checkbox',
                            fieldLabel: 'Output Preferences (for report viewing)',
                            boxLabel: 'Override Default Output Types? ( PDF HTML  )',
                            name: 'includeEmpty'
                        },{
                            xtype: 'textfield',
                            fieldLabel: 'CSV Delimiter',
                            name: 'csvDelimiter',
                            allowBlank: false,
                            maxLength: 1
                        }
 */

/*

            this.filterAddButton = this.createButton("filterAdd","filter_add.PNG", rcl.editReportProfileUi.onAddFilterButtonClicked, "Add");
            this.filterEditButton = this.createButton("filterEdit","filter_add.PNG", rcl.editReportProfileUi.onEditFilterButtonClicked, "Edit");
            this.filterEditButton.disable();
            this.filterDeleteButton = this.createButton("filterDelete","filter_delete.PNG", rcl.editReportProfileUi.onDeleteFilterButtonClicked, "Delete");
            this.filterDeleteButton.disable();

            this.filterDataStore = this.loadFilterArrayStore(null);

            this.currentFiltersCombobox = this.createComboBox("currentFiltersCombobox",
                    this.filterDataStore,
                    "Current Filters",
                    false,
                    300,
                    '',
                    '',
                    '',
                    {select: { fn:function()
                        {
                            rcl.editReportProfileUi.onCurrentFiltersComboboxSelected();
                        }
                    }
                    },
                    'filterName');

            this.currentFiltersFieldSet = this.createFieldset("currentFiltersFieldSet","",true,10,true,[this.currentFiltersCombobox,this.filterAddButton,this.filterEditButton,this.filterDeleteButton]);

            this.filterSaveButton = this.createButton("filterSave","filter_save.PNG", rcl.editReportProfileUi.onSaveFilterButtonClicked, "Save");
            this.filterCancelButton = this.createButton("filterCancel","filter_cancel.PNG", rcl.editReportProfileUi.onCancelFilterButtonClicked, "Cancel");
            this.filterSaveButton.hide();
            this.filterCancelButton.hide();

            this.runtimeFilterExpressionTextArea = this.createTextArea("runtimeFilterExpressionTextArea", true, 400, labelWidthStyle,"Runtime Filter Expression" );

            this.runtimeFilterExpressionFieldSet = this.createFieldset("runtimeFilterExpressionFieldSet","",true,10,true,[this.runtimeFilterExpressionTextArea,this.filterSaveButton,this.filterCancelButton]);

            this.queryDataStore = this.loadQueryArrayStore();

            this.queryCombobox = this.createComboBox("queryComboBox",
                                                        this.queryDataStore,
                                                        "Query",
                                                        false,
                                                        250,
                                                        '',
                                                        '',
                                                        '',
                                                        {select: { fn:function()
                                                            {
                                                                rcl.editReportProfileUi.onQueryComboboxSelected();
                                                            }
                                                        }
                                                        },
                                                        'queryName');

            this.queryCombobox.expand();
            // simple array store
            this.columnDataStore = new Ext.data.ArrayStore({
                fields: ["dataType","name"]
            });

            this.columnCombobox = this.createComboBox("columnComboBox",
                                                        this.columnDataStore,
                                                        "Column",
                                                        true,
                                                        250,
                                                        '',
                                                        '',
                                                        '',
                                                        {select: { fn:function()
                                                            {
                                                                rcl.editReportProfileUi.onColumnComboboxSelected();
                                                            }
                                                        }
                                                        },
                                                        'name');

            // simple array store
            this.relationDataStore = new Ext.data.ArrayStore({
                fields: ['relation']
            });

            this.relationCombobox = this.createComboBox("relationComboBox",
                                                        this.relationDataStore,
                                                        "Relation",
                                                        true,
                                                        250,
                                                        '',
                                                        '',
                                                        '',
                                                        {select: { fn:function()
                                                            {
                                                                rcl.editReportProfileUi.onRelationComboboxSelected();
                                                            }
                                                        }
                                                        },
                                                        'relation');

            this.valueField = this.createTextField('valueField',labelWidthStyle,'Value','');
            this.valueField.on('change', function(){
                    this.scope.onManualFilterValueChange();
                });
            this.valueField.disable();

            this.valuePickerButton = this.createButton("valuePickerButton","", rcl.editReportProfileUi.onvaluePickerButtonClicked, "Value Picker");
            this.valuePickerButton.disable();

            this.expressionCreatorFieldSet = this.createFieldset("expressionCreatorFieldSet","",true,10,true,[this.queryCombobox,this.columnCombobox,this.relationCombobox,this.valueField, this.valuePickerButton]);

            this.expressionCreatorFieldSet.hide();

*/