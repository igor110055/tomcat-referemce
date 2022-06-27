Adf.editReportProfileUi = function()
{
   return {

      init : function(aEditReportExecutionInputsForm)
      {
          this.screenUtil = new Adf.AdminScreenUtils();
          this.screenUtil.setScope(this);

          this.showReiDialog(document.getElementById('targetId').value,
                             document.getElementById('launchNodeType').value,
                             document.getElementById('rerId').value);

          window.isADFDialog = true;

      },

      createTabbedFormPanel: function(aShowParametersTab)
      {
         var tabs = [];

         // If this profile has a prompt page then added it so it shows up when the other tabs are displayed.
         // Note: hasCustomPrompt and customPromptUrl come from the JSP.
         if (hasCustomPrompt)
         {
            tabs.push(this.createParametersTab(customPromptUrl));
         }
         tabs.push(this.createOutputsTab());
         tabs.push(this.createContentModTab());

         this.sortPanel = new Adf.ProfileSortPanel({});
         this.sortPanel.on('sortoverrideadded', this.onSortOverrideAdded, this);
         this.sortPanel.on('sortoverrideremoved', this.onSortOverrideRemoved, this);
         this.sortPanel.on('sortoverrideupdated', this.onSortOverrideUpdated, this);
         tabs.push(this.sortPanel);

         return new Ext.TabPanel({
            activeItem: 0,
            border: true,
            align: 'stretch',
            anchor: '100% 100%',
            deferredRender: false,
            defaults:{
               labelWidth: 120,
               defaultType: 'textfield',
               bodyStyle: 'padding:5px'
            },
            items: tabs,
            listeners: {
               tabchange: {fn: this.lazyLoadContentAdjustmentsJson, scope: this}
            }
         });
      },

      lazyLoadContentAdjustmentsJson : function (scope, tab)
      {
         if ((tab.id == 'contentModTab' || tab.id == 'sortOverridePanel') && !this.editReiDialogContext.crnReport)
         {
            this.loadContentAdjustmentsJson(tab, document.getElementById('targetId').value,
                                         document.getElementById('launchNodeType').value,
                                         document.getElementById('rerId').value);
         }
      },

      /**
       * This method is called after the IFrame, on the Parameters tab, loads a custom prompt page. It hooks up the
       * handler for the hot keys. It monitors the keydown event of the frame's document and calls the rei's key
       * map handler.
       *
       * Note: This is sort of a work around. Since the document in the IFrame is not accessible directly by the EXT
       * code, we have to manually monitor the keydown event and then massage the keydown event before passing it
       * directly to the Ext.KeyMap's private handler.
       */
      onReiParametersTabLoad: function()
      {

         // Get the document of the IFrame.
         var frame = document.getElementsByName('promptIframe')[0];
         var frameDocument = frame.contentDocument || frame.contentWindow.document;

         Event.observe(frameDocument, 'keydown', function(e){
            // Convert the HTML event to an EXT event object before calling the EXT key map handler for the rei screen.
            var extEvent = Ext.EventObject.setEvent(e);
            Adf.editReportProfileUi.reiKeyMappings.handleKeyDown.call(Adf.editReportProfileUi.reiKeyMappings, extEvent);
         }, true);
      },

      createParametersTab: function(aPromptPageUrl)
      {
         return {
            id: 'reiParamTab',
            title: 'Parameters',
            flex: 1,
            autoScroll:false,
            html: '<iframe width="99%" height="98%" name="promptIframe" src="' + ServerEnvironment.contextPath + aPromptPageUrl + '" onload="Adf.editReportProfileUi.onReiParametersTabLoad();"></iframe>'
         };
      },

      showContainerPicker : function(aData, aResultCallback)
      {
         var containerPicker = new Adf.ContainerPicker({
            crnPackage: this.getCrnPackage(),
            containers: this.visualContainers,
            directiveData: aData,
            callBack: aResultCallback
         });

         containerPicker.on('valueSelected', this.showExpressionEditorDialog, this);
         containerPicker.show();
      },

      getVisualContainerByXpath: function(aXPath)
      {
         for (var count = 0; count < this.visualContainers.length; count++)
         {
            var eachContainer = this.visualContainers[count];
            if(eachContainer.xpath == aXPath)
            {
               return eachContainer;
            }
         }
         return null;
      },

      /**
       * Show the expression editor during insert operations
       * @param aData
       * @param aResultCallback
       */
      showExpressionEditorDialog: function(aContainer, aData, aPropertySet, aResultCallback)
      {
         var insertContentDirectives = [];

         this.contentModGrid.getStore().data.each(
               function(aItem, aIndex, aLength){
                  var rawContentAdjustment = aItem.data.rawContentAdjustment;
                  if('insert' == aItem.data['modificationType'] && aItem.data.rawContentAdjustment.containerXpath === aContainer.xpath)
                  {
                     insertContentDirectives.push(new ReportColumn(rawContentAdjustment.directive.newColumnName, null, rawContentAdjustment.directive.regularAggregate, ReportColumnTypeEnum.GENERIC, rawContentAdjustment.directive.newColumnExpression, AggregateFunctionEnum.NONE, false, null, null, false, false));
                  }
                  return true;
               }, this);


         var editor = new Adf.ExpressionEditor(
               {
                  container: aContainer,
                  columns: insertContentDirectives.concat(ReportColumn.createFromQueryItemRefs(aContainer.queryItemRefs)),
                  packagePath: this.getCrnPackage(),
                  propertySet : aPropertySet
               });

         editor.setExpression(aData.expression);

         editor.on('onOkButtonClicked', aResultCallback, this);
         editor.show();
      },

      /**
       * This method handles the event that occurs when the Override Default Output check box status changes. When
       * the Override Default Output check box is checked, the output section of check boxes is enabled. Otherwise
       * the output section of check boxes is disabled.
       *
       * @param aCheckbox (Ext.form.Checkbox) The Override Default Output check box.
       * @param aSelected (Boolean) true if checked, otherwise false.
       */
      outputsCheckboxHandler: function(aCheckbox, aSelected)
      {
         this.enableOutputFormats(aSelected);
      },


      /**
       * This method enables or disables the output section of check boxes.
       *
       * @param aEnabled (Boolean) true to enable the output section of check boxes. Otherwise false to
       * clear out the values and disable the output section section of check boxes.
       */
      enableOutputFormats: function(aEnabled)
      {
         if(aEnabled)
         {
            this.outputsCheckBoxGroup.enable();
            for (var count = 0; count < this.outputsCheckBoxGroup.items.items.length; count++)
            {
               var eachCheckBox = this.outputsCheckBoxGroup.items.items[count];
               if(!eachCheckBox.metaDataSupported)
               {
                  eachCheckBox.disable();
               }
            }
         }
         else
         {
            //clear the output checkboxes
            this.outputsCheckBoxGroup.setValue([false, false, false, false, false, false, false, false, false, false, false, false]);
            this.outputsCheckBoxGroup.disable();
         }
      },

      onPagedHtmlCheck: function(aCheckBox, isChecked)
      {
         for (var count = 0; count < this.outputsCheckBoxGroup.items.items.length; count++)
         {
            var eachCheckBox = this.outputsCheckBoxGroup.items.items[count];
            if(eachCheckBox.metaDataSupported && (!isChecked || eachCheckBox.getName() === "pagedHtmlCheck"))
            {
               eachCheckBox.enable();
            }
            else
            {
               eachCheckBox.disable();
               eachCheckBox.setValue(false);
            }
         }
      },

      createOutputsTab: function()
      {
         this.retentionCombo = new Ext.form.ComboBox({
            fieldLabel: 'Outputs expire in',
            name: 'retentionDaysCombo',
            hiddenName: 'retentionDays',
            hiddenId: 'hiddenRetentionComboId',
            width: 150,
            mode: 'local',
            valueField: 'retentionValue',
            displayField: 'retentionName',
            editable: false,
            triggerAction: 'all',
            store: new Ext.data.JsonStore({
               root:'retentionList',
               fields:[
                  {name: 'retentionValue', type: 'string'},
                  {name: 'retentionName', type: 'string'}]
            })
         });
         //todo return a record that matches this and parse it for saves
         //todo build the actual destination xml to return
         var destDataStore = new Ext.data.Store({
            reader:new Ext.data.JsonReader({
               root: 'destinations',
               totalProperty: 'totalCount',
               id: 'destinationId'
            },
            [
               {name: 'destinationId', mapping: 'id', type: 'int'},
               {name: 'destinationSelected', mapping: 'destinationSelected'},
               {name: 'destinationDescription', mapping: 'destinationDescription'},
               {name: 'destinationFileTypes', mapping: 'outputDescription'},
               {name: 'destinationType', mapping: 'destinationType'},
               {name: 'enabled', mapping: 'enabled'},
               {name: 'toList', mapping: 'toList'},
               {name: 'ccList', mapping: 'ccList'},
               {name: 'bccList', mapping: 'bccList'},
               {name: 'subject', mapping: 'subject'},
               {name: 'body', mapping: 'body'},
               {name: 'zip', mapping: 'zip'}
            ])
         });
         destDataStore.setDefaultSort('destinationDescription', 'ASC');

         // the check column is created using a custom plugin
         var checkColumn = new Ext.grid.CheckColumn({
            id: 'selectedDestination',
            header: 'Send Output',
            dataIndex: 'destinationSelected',
            width: 120
         });

         checkColumn.on('click', this.handleCheckColumn, this);

         var destCm = new Ext.grid.ColumnModel([
            checkColumn,
            {
               id: 'destinationDescription',
               header: 'Destination Description',
               dataIndex: 'destinationDescription',
               width: 250,
               sortable:true
            },
            { id: 'destinationFileTypes',
               header: 'File Types',
               dataIndex: 'destinationFileTypes',
               width: 200,
               sortable:true
            }
         ]);
         destCm.defaultSortable = true;

         var destToolbar = new Ext.Toolbar({
            items :[
               this.screenUtil.createToolbarButton("EditReiOutput", "report_edit.png", this.onEditDestinationButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), "-"
            ]
         });


         this.destinationGrid = new Ext.grid.GridPanel({
            loadMask: true,
            tbar: destToolbar,
            autoExpandColumn: 'destinationDescription',
            cm: destCm,
            stripeRows: true,
            store: destDataStore,
            height: 180,
            plugins: checkColumn
         });

         this.outputCheckBoxes = [
            {boxLabel: 'HTML', name: 'htmlCheck', outputFormatEnum: OutputFormatEnum.HTML, metaDataSupported : false },
            {boxLabel: 'PDF', name: 'pdfCheck', outputFormatEnum: OutputFormatEnum.PDF, metaDataSupported : false },
            new Ext.form.Checkbox({
                     boxLabel: 'Paged HTML',
                     name: 'pagedHtmlCheck',
                     outputFormatEnum: OutputFormatEnum.PAGED_HTML,
                     metaDataSupported : false,
                     listeners:{
                        'check':this.onPagedHtmlCheck,
                        scope: this
                     }
                  }),
            {boxLabel: 'XLS', name: 'xlsCheck', outputFormatEnum: OutputFormatEnum.singleXLS,  metaDataSupported : false },
            {boxLabel: 'XLS (2007)', name: 'xls2007Check', outputFormatEnum: OutputFormatEnum.spreadsheetML,  metaDataSupported : false },
            {boxLabel: 'XML', name: 'xmlCheck', outputFormatEnum: OutputFormatEnum.XML, metaDataSupported : false },
            {boxLabel: 'CSV', name: 'csvCheck', outputFormatEnum: OutputFormatEnum.CSV,  metaDataSupported : false },
            {boxLabel: 'XHTML', name: 'xhtmlCheck', outputFormatEnum: OutputFormatEnum.XHTML,  metaDataSupported : false },
            {boxLabel: 'HTMLFragment', name: 'htmlFragmentCheck', outputFormatEnum: OutputFormatEnum.HTMLFragment,  metaDataSupported : false },
            {boxLabel: 'XLWA', name: 'xlwaCheck', outputFormatEnum: OutputFormatEnum.XLWA,  metaDataSupported : false },
            {boxLabel: 'MHTML', name: 'mhtmlCheck', outputFormatEnum: OutputFormatEnum.MHT,  metaDataSupported : false },
            {boxLabel: 'XLSX_DATA', name: 'xlsxDataCheck', outputFormatEnum: OutputFormatEnum.xlsxData,  metaDataSupported : false },
            {boxLabel: 'LayoutDataXML', name: 'layoutDataXmlCheck', outputFormatEnum: OutputFormatEnum.layoutDataXML,  metaDataSupported : false }
         ];

         this.outputsCheckBoxGroup = new Ext.form.CheckboxGroup({
               id: 'outputsCheckBoxGroup',
               xtype: 'checkboxgroup',
               fieldLabel:'Output Formats',
               anchor: "100%",
               name: 'outputGroup',
               vertical: true,
               width: 600,
               columns: [120, 120, 120, 120],
               items: this.outputCheckBoxes
            });

         return {
            title: 'Outputs/Destinations',
            items:[
               {
                  xtype: 'fieldset',
                  flex: 1,
                  title: 'Outputs',
                  items:[
                     {
                        xtype:'checkbox',
                        name:'outputOverride',
                        boxLabel: 'Override default output formats',
                        scope: this,
                        handler: this.outputsCheckboxHandler
                     },
                     this.outputsCheckBoxGroup,
                     {
                        xtype: 'compositefield',
                        fieldLabel: 'Rows Per Page',
                        items:
                              [
                                 {
                                    xtype: 'textfield',
                                    name:'rowsPerPage',
                                    width:'150'
                                 }
                              ]
                     },
                     {
                        xtype: 'compositefield',
                        fieldLabel: 'Max Pages (Paged HTML Only)',
                        items:
                              [
                                 {
                                    xtype: 'textfield',
                                    name:'maxPages',
                                    width:'150'
                                 }
                              ]
                     },
                     this.retentionCombo,
                     {
                        id: 'launchPreferenceGroup',
                        xtype: 'radiogroup',
                        fieldLabel: 'Launch Preferences',
                        columns: 1,
                        items:[
                           {
                              boxLabel: 'Background',
                              id: 'launchPref_BACKGROUND',
                              name: 'launchPref',
                              inputValue: 'BACKGROUND',
                              checked: true
                           },
                           {
                              boxLabel: 'Foreground',
                              id: 'launchPref_FOREGROUND',
                              name: 'launchPref',
                              inputValue: 'FOREGROUND'
                           },
                           {
                              boxLabel: 'Launch in Cognos Viewer',
                              id:'launchPref_COGNOS_VIEWER',
                              name:'launchPref',
                              inputValue: 'COGNOS_VIEWER'
                           }
                        ]

                     },
                     {
                        xtype: 'compositefield',
                        fieldLabel: 'Max Execution Time',
                        items:
                              [
                                 {
                                    xtype: 'textfield',
                                    name:'maxExecutionTime',
                                    width:'150'
                                 },
                                 {
                                    xtype: 'label',
                                    name:'exTimeLabel2',
                                    text: 'seconds (set to 0 for no limit)'
                                 }
                              ]
                     }
                  ]
               },
               {
                  xtype:'fieldset',
                  flex: 1,
                  title: 'Destinations',
                  items:[this.destinationGrid]
               }
            ]
         };
      },

      onEditDestinationButtonClicked: function()
      {
         var record = this.destinationGrid.getSelectionModel().getSelected();

         if(record)
         {
            if(record.data['destinationType'] == "EMAIL")
            {
               this.showEditEmailWindow.call(this, record);
            }
            else
            {
               this.showEditFileTransferWindow.call(this, record);
            }
         }
      },

      handleCheckColumn: function(aControl, aEvent, aRecord)
      {
         if(aRecord.data['destinationSelected'])
         {
            if(aRecord.data['destinationType'] == "EMAIL")
            {
               this.showEditEmailWindow.call(this, aRecord);
            }
            else
            {
               this.showEditFileTransferWindow.call(this, aRecord);
            }
         }
      },

      createContentModTab: function()
      {
         var contentDataStore = new Ext.data.Store({
            reader:new Ext.data.JsonReader({
               root: 'contentAdjustments',
               totalProperty: 'totalCount',
               id: 'contentModId'
            },
            [
               {name: 'contentModId', mapping: 'contentModId', type: 'int'},
               {name: 'modColumnName', mapping: 'modColumnName'},
               {name: 'modContainer', mapping: 'modContainer'},
               {name: 'modificationExpression', mapping: 'modificationExpression'},
               {name: 'modificationType', mapping: 'modificationType'},
               {name: 'rawContentAdjustment', mapping: 'rawContentAdjustment'}
            ])

         });
         contentDataStore.setDefaultSort('modificationType', 'ASC');

         function renderModTypeFn (aValue) {
             if (aValue === "insert") {
                 return applicationResources.getProperty('profileWizard.content.grid.type.insert');
             }
             else if (aValue === "suppress") {
                 return applicationResources.getProperty('profileWizard.content.grid.type.suppress');
             }
             else if(aValue === "filter"){
                return applicationResources.getProperty('profileWizard.content.grid.type.filter');
             }
             else {
                 return applicationResources.getProperty('profileWizard.content.grid.type.chart');
             }
         }

         var contentCm = new Ext.grid.ColumnModel([
            { id: 'modificationType',
               header: applicationResources.getProperty('profileWizard.content.grid.type'),
               dataIndex: 'modificationType',
               width: 150,
               sortable:true,
               renderer: renderModTypeFn
            },
            { id: 'modContainer',
               header: applicationResources.getProperty('profileWizard.content.grid.container'),
               dataIndex: 'modContainer',
               width: 150,
               sortable:true
            },
            { id: 'modColumnName',
               header: applicationResources.getProperty('profileWizard.content.grid.column'),
               dataIndex: 'modColumnName',
               width: 200,
               sortable:true
            },
            { id: 'modificationExpression',
               header: applicationResources.getProperty('profileWizard.content.grid.expression'),
               dataIndex: 'modificationExpression',
               width: 250,
               sortable:true
            }
         ]);
         contentCm.defaultSortable = true;

         var contentToolbar = new Ext.Toolbar({
            items : [this.screenUtil.createToolbarButton("SuppressColumn", "report_delete.png", this.onSuppressColumnButtonClicked, "Suppress Column"), '-',
               this.screenUtil.createToolbarButton("AddNewColumn", "report_add.png", this.onAddColumnClicked, applicationResources.getProperty("profileWizard.directive.addInsertContent")), '-',
               this.screenUtil.createToolbarButton("AddNewFilter", "report_add.png", this.onAddFilterClicked, applicationResources.getProperty("profileWizard.directive.addFilterContent")), '-',
               this.screenUtil.createToolbarButton("Edit", "report_edit.png", this.onEditButtonClicked, applicationResources.getProperty("profileWizard.button.edit")), '-',
               this.screenUtil.createToolbarButton("Delete", "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-'
            ]
         });

         //this record type can be used to add new records to contentModGrid
         this.ContentModRecord = Ext.data.Record.create([
            {name: 'modContainer', mapping: 'modContainer', type: 'string'},
            {name: 'modColumnName', mapping: 'modColumnName', type: 'string'},
            {name: 'modificationExpression', mapping: 'modificationExpression', type: 'string'},
            {name: 'modificationType', mapping: 'modificationType', type: 'string'},
            {name: 'rawContentAdjustment', mapping: 'rawContentAdjustment'}
         ]);

         this.contentModGrid = new Ext.grid.GridPanel({
            loadMask: true,
            tbar: contentToolbar,
            autoExpandColumn: 'modificationExpression',
            cm: contentCm,
            stripeRows: true,
            store: contentDataStore,
            region: 'center'
         });

         return {
            title: 'Content Modifications',
            id: 'contentModTab',
            layout: 'fit',
            items:[this.contentModGrid]
         };
      },

      onEditButtonClicked: function(aButton)
      {
         var selections = this.contentModGrid.getSelectionModel().getSelections();

         if(selections == null || selections.length != 1)
         {
            Ext.Msg.alert(applicationResources.getProperty('prompt.reiContent.msgTitle'), applicationResources.getProperty('general.oneItem'));
         }
         else if('insert' === selections[0].data.modificationType)
         {
            this.selectedRecord = selections[0];
            var expressionData = {};
            var directive = this.selectedRecord.data.rawContentAdjustment.directive;
            expressionData['expression'] = directive.newColumnExpression;
            var container = this.getVisualContainerByXpath(directive.containerXpath);
            this.showExpressionEditorDialog(container, expressionData,
                    directive.toPropertySet(container), this.onExpressionCreated.createDelegate(this));
         }
         else if('filter' === selections[0].data.modificationType)
         {
            this.selectedRecord = selections[0];
            this.showEditFilterDialog(this.addOrUpdateFilter, this.selectedRecord.data.rawContentAdjustment.directive);
         }
      },

      onAddColumnClicked: function(aButton)
      {
         var expressionData = {};
         expressionData['expression'] = "";

         this.selectedRecord = null;

         this.showContainerPicker(expressionData, this.onExpressionCreated.createDelegate(this));
      },

      createNewInsertContentDirective : function()
      {
         return new InsertContentDirective (
           this.getCrnPackage(),
           "",
           RelationalInsertionPointEnum.CROSSTAB_ADD_TO_CHILDREN,
           applicationResources.getProperty("profileWizard.content.newColumn"),
           "",
           RegularAggregateEnum.AUTOMATIC,
           AggregateFunctionEnum.NONE,
           SortEnum.DONT_SORT,
           "",
           null);
      },

      onExpressionCreated: function(aData)
      {
         //create new directive
         var insertContentDirective;
         insertContentDirective = this.createNewInsertContentDirective();
         insertContentDirective.fromPropertySet(aData["propertySet"]);
         insertContentDirective.containerXpath = aData.containerXPath;
         insertContentDirective.newColumnExpression = aData["expression"];

         if (insertContentDirective.containerXpath.indexOf("cross") != -1) {
            insertContentDirective.contentType = ModifiableContentTypeEnum.CROSSTAB;
         }

         if(!this.selectedRecord)
         {
            var record = new this.ContentModRecord({
               modContainer: aData.containerName,
               modColumnName: insertContentDirective.newColumnName,
               modificationExpression: insertContentDirective.newColumnExpression,
               modificationType: 'insert',
               rawContentAdjustment:
               {
                   directive : insertContentDirective
               }
            });
            this.contentModGrid.getStore().add(record);
            this.contentModGrid.getStore().commitChanges();
         }
         else
         {
            //update existing directive
            this.selectedRecord.set("modColumnName", insertContentDirective.newColumnName);
            this.selectedRecord.set("modificationExpression", insertContentDirective.newColumnExpression);
            this.selectedRecord.set("rawContentAdjustment", {directive : insertContentDirective});
         }
      },

      /**
       * This method handles the add filter click event.
       *
       * @param aButton (Ext.Button) - Add new filter button.
       * @param aEventObject (Ext.EventObject) - Click event.
       */
      onAddFilterClicked: function(aButton, aEventObject)
      {
         this.showEditFilterDialog(this.addOrUpdateFilter, null);
      },

      addOrUpdateFilter: function(aNewFilter)
      {
         if(!this.selectedRecord)
         {
            var record = new this.ContentModRecord({
               modContainer: aNewFilter.query,
               modColumnName: aNewFilter.dataItemName,
               modificationExpression: aNewFilter.fullQueryExpression,
               modificationType: 'filter',
               rawContentAdjustment:
               {
                   directive : aNewFilter
               }
            });
            this.contentModGrid.getStore().add(record);
            this.contentModGrid.getStore().commitChanges();
         }
         else
         {
            //update existing directive
            this.selectedRecord.set("modColumnName", aNewFilter.dataItemName);
            this.selectedRecord.set("modificationExpression", aNewFilter.fullQueryExpression);
            this.selectedRecord.set("rawContentAdjustment", {directive : aNewFilter});
         }
      },

      /**
       *
       * @param aValue (Object) - The data value for the cell.
       * @param aMetadata (Object) - An object in which you may set the following attributes:
       *    css (String) - A CSS class name to add to the cell's TD element.
       *    attr (String) - An HTML attribute definition string to apply to the data container element within
       *       the table cell (e.g. 'style="color:red;"').
       * @param aRecord (Ext.data.record) - The Ext.data.Record from which the data was extracted.
       * @param aRowIndex (Number) - Current row index.
       * @param aColIndex (Number) - Current column index.
       * @param aStore (Ext.data.Store) The data store object from which the record was extracted.
       *
       * @return (String)
       */
      filterExpressionRender: function(aValue, aMetadata, aRecord, aRowIndex, aColIndex, aStore)
      {
         return aValue;
      },


      showEditFilterDialog: function(aResultCallback, aFilter)
      {
         var editor = new Adf.FilterValuePickerDialog(
         {
            // querySet is pulled from the generated javascript via the struts action and STL tag
            biQuerySet: this.editReiDialogContext.report.reportMetaData.reportQueryMetaDataItems, //todo - should we just pass the entire context?
            filter : aFilter,
            packagePath : this.getCrnPackage()
         });

         editor.on('onOkButtonClicked', aResultCallback, this);

         editor.show();
      },

      createDisabledToolbarButton: function(aButtonId, aButtonIcon, aHandler, aButtonName, anEnableToggle, aEnabled)
      {
         return new Ext.Button({ id: aButtonId,
            text: aButtonName == null ? "" : aButtonName,
            handler: aHandler,
            scope: this,
            enableToggle:anEnableToggle,
            cls: 'x-btn-text-icon',
            icon:  ServerEnvironment.baseUrl + "/images/silkIcons/" + aButtonIcon,
            disabled: !aEnabled
         });
      },


      /**
       * This method handles the Previous hot key event. It switches the display to the previous REI tab. If it's the
       * first tab then this handler does nothing.
       */
      onPreviousKey: function()
      {
         var activeTab = this.tabPanel.getActiveTab();
         var previousTab = activeTab.previousSibling();
         if (previousTab)
         {
            this.tabPanel.setActiveTab(previousTab);
         }
      },


      /**
       * This method handles the Next hot key event. It switches the display to the next REI tab. If it's the
       * last tab then this handler does nothing.
       */
      onNextKey: function()
      {
         var activeTab = this.tabPanel.getActiveTab();
         var nextTab = activeTab.nextSibling();
         if (nextTab)
         {
            this.tabPanel.setActiveTab(nextTab);
         }
      },


      /**
       * This method creates an key binding config object.
       *
       * @param aKeyMappingResourceString (String) The resource string name of the user defined key binding.
       * @param aDefaultKeyMapping (Object) Default key binding values. Used for the legacy implementation.
       * @param aHandler (Function) The handler for this key binding.
       * @param aScope (Object) The scope for the handler.
       *
       * @returns {Object} Key binding config object.
       * key binding format:
       * key         String/Array     A single keycode or an array of keycodes to handle
       * shift       Boolean          True to handle key only when shift is pressed, False to handle the key only when shift is not pressed (defaults to undefined)
       * ctrl        Boolean          True to handle key only when ctrl is pressed, False to handle the key only when ctrl is not pressed (defaults to undefined)
       * alt         Boolean          True to handle key only when alt is pressed, False to handle the key only when alt is not pressed (defaults to undefined)
       * handler     Function         The function to call when KeyMap finds the expected key combination
       * scope       Object           The scope of the callback function
       *
       */
      createKeyMapping: function(aKeyMappingResourceString, aDefaultKeyMapping, aHandler, aScope)
      {
         // Get the key mapping.
         var keyMapping = applicationResources.getProperty(aKeyMappingResourceString);
         if (keyMapping.indexOf("{") > -1)
         {
            // Ext key map config object.
            keyMapping = Ext.decode(keyMapping);
            keyMapping.handler = aHandler;
            keyMapping.scope = aScope;
         }
         else
         {
            // Legacy key mapping. Only the key code is defined.
            keyMapping = Ext.apply({}, {key: 1*keyMapping}, aDefaultKeyMapping);
            keyMapping.handler = aHandler;
            keyMapping.scope = aScope;
         }

         return keyMapping;
      },


      /**
       * This method creates and returns an array of key bindings to pass to the Ext.KeyMap object.
       *
       * key binding format:
       * key         String/Array     A single keycode or an array of keycodes to handle
       * shift       Boolean          True to handle key only when shift is pressed, False to handle the key only when shift is not pressed (defaults to undefined)
       * ctrl        Boolean          True to handle key only when ctrl is pressed, False to handle the key only when ctrl is not pressed (defaults to undefined)
       * alt         Boolean          True to handle key only when alt is pressed, False to handle the key only when alt is not pressed (defaults to undefined)
       * handler     Function         The function to call when KeyMap finds the expected key combination
       * fn          Function         Alias of handler (for backwards-compatibility)
       * scope       Object           The scope of the callback function
       * stopEvent   Boolean          True to stop the event from bubbling and prevent the default browser action if the key was handled by the KeyMap (defaults to false)
       *
       * @returns {Array} An array key binding config objects.
       */
      createReiDialogKeyMappings: function()
      {
         // Default key mappings definitions. Used for the legacy implementation when only the key code is defined.
         var defaultSaveAsKeyMapping = {key: 65, shift: false, ctrl: true, alt: true};    // Save As: ctrl-alt-a
         var defaultSaveKeyMapping = {key: 83, shift: false, ctrl: true, alt: true};      // Save: ctrl-alt-s
         var defaultEnterKeyMapping = {key: 13, shift: false, ctrl: true, alt: true};
         var defaultRunKeyMapping = {key: 82, shift: false, ctrl: true, alt: true};       // Run: ctrl-alt-r
         var defaultCancelKeyMapping = {key: 67, shift: false, ctrl: false, alt: true};
         var defaultCloseKeyMapping = {key: 27, shift: false, ctrl: false, alt: false};
         var defaultPreviousKeyMapping = {key: 80, shift: false, ctrl: true, alt: true};  // Previous: ctrl-alt-p
         var defaultGetSqlKeyMapping = {key: 71, shift: false, ctrl: true, alt: true};    // Get SQL: ctrl-alt-g
         var defaultNextKeyMapping = {key: 78, shift: false, ctrl: true, alt: true};      // Next: ctrl-alt-n
         var defaultBackKeyMapping = {key: 37, shift: false, ctrl: true, alt: true};
         var defaultForwardKeyMapping = {key: 39, shift: false, ctrl: true, alt: true};
         var defaultJumpKeyMapping = {key: 9, shift: false, ctrl: true, alt: true};


         // Create the array of key bindings to pass Ext.KeyMap object.
         var keyMappings = [];
         keyMappings.push(this.createKeyMapping("keycode.rei.save", defaultSaveKeyMapping, function(){
            if (!this.saveButton.disabled)
            {
               this.onSaveButtonClicked();
            }
         }, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.save.as", defaultSaveAsKeyMapping, this.onSaveAsButtonClicked, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.run", defaultRunKeyMapping, this.onRunButtonClicked, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.cancel", defaultCancelKeyMapping, this.onCancelButtonClicked, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.close", defaultCloseKeyMapping, this.onCancelButtonClicked, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.get.sql", defaultGetSqlKeyMapping, function() {
            if (!Ext.getCmp('getSqlRei').disabled)
            {
               this.onGetSqlButtonClicked();
            }
         }, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.previous", defaultPreviousKeyMapping, this.onPreviousKey, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.next", defaultNextKeyMapping, this.onNextKey, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.back", defaultBackKeyMapping, this.onPreviousKey, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.forward", defaultForwardKeyMapping, this.onNextKey, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.jump", defaultJumpKeyMapping, this.onNextKey, this));
         keyMappings.push(this.createKeyMapping("keycode.rei.enter", defaultEnterKeyMapping, this.onSaveButtonClicked, this));

         return keyMappings;
      },

      loadContentAdjustmentsJson: function(aTab, aNodeId, aNodeType, aRerId)
      {
         Ext.Msg.wait("Loading...");

         var loadUrl;
         var loadParams;
         if (aRerId && aRerId.length > 0)
         {
            loadUrl = ServerEnvironment.baseUrl + "/secure/actions/ext/getContentAdjustmentJsonForRer.do";
            loadParams = {
               rerId: aRerId
            };
         }
         else
         {
            loadUrl = ServerEnvironment.baseUrl + "/secure/actions/ext/getContentAdjustmentJson.do";
            loadParams = {
               launchNodeId: aNodeId,
               launchNodeType: aNodeType
            };
         }

         this.formPanel.getForm().load({
            scope: this,
            loadMask : {msg:"Loading..."},
            url: loadUrl,
            params: loadParams,
            failure : function () {
               //Disable all the buttons for Sorts/Content mods
               Ext.getCmp('SuppressColumn').disable();
               Ext.getCmp('AddNewColumn').disable();
               Ext.getCmp('AddNewFilter').disable();
               Ext.getCmp('Edit').disable();
               Ext.getCmp('Delete').disable();
               Ext.getCmp('removeSortOverride').disable();
               Ext.getCmp('editSortOverride').disable();

               //setting this state so that the load isn't called again.
               this.editReiDialogContext.crnReport = {};

               Ext.Msg.hide();
               Ext.Msg.alert("Error", "An error has occurred, please contact your Administrator.  Content Modifications and Sort Modifications will be disabled.");

            },
            success: function(aForm, aAction)
            {
               try
               {
                  //Todo - Exception handling (disable features if getting the CrnReport failed somehow
                  this.editReiDialogContext.crnReport = aAction.result.data.crnReport;
                  var jsonReportMetaData = this.editReiDialogContext.report.reportMetaData;

                  //todo - this is a temporary measure to do this conversion
                  this.visualContainers = this.convertJsonToDomain(this.editReiDialogContext.crnReport);

                  if (jsonReportMetaData.supportsModifySorts)
                  {
                     var sortPageData = {
                        containers: []
                     };

                     for (var i = 0; i < this.editReiDialogContext.crnReport.crnLists.length; i++)
                     {
                        var crnList = this.editReiDialogContext.crnReport.crnLists[i];

                        var container = {
                           name: crnList.name,
                           id: crnList.xpath,
                           columns: [],
                           defaultSorts: [],
                           sortOverrides: []
                        };

                        // Columns
                        for (var j = 0; j < crnList.queryItemRefs.length; j++)
                        {
                           container.columns.push({
                              name: crnList.queryItemRefs[j].refItem,
                              groupDirective: crnList.queryItemRefs[j].groupDirective,
                              sortDirective: crnList.queryItemRefs[j].sortDirective
                           });
                        }

                        // Sort Overrides.
                        for (var k = 0; k < this.editReiDialogContext.sortOverrides.length; k++)
                        {
                           if (crnList.xpath == this.editReiDialogContext.sortOverrides[k].xpath)
                           {
                              container.sortOverrides = this.editReiDialogContext.sortOverrides[k].columnOverrides;
                              break;
                           }
                        }

                        sortPageData.containers.push(container);
                     }

                     Adf.editReportProfileUi.sortPanel.loadPageData(sortPageData);
                  }
                  else
                  {
                     Ext.getCmp('removeSortOverride').disable();
                     Ext.getCmp('editSortOverride').disable();
                  }


                  //sets the display value for the mod container. todo - could probably just parse the xpath
                  this.contentModGrid.getStore().data.each(
                       function(aItem, aIndex, aLength)
                       {
                          var visualContainerByXpath;
                          var rawContentAdjustment = aItem.data.rawContentAdjustment;

                          if (rawContentAdjustment.containerXpath &&
                                (visualContainerByXpath = this.getVisualContainerByXpath(rawContentAdjustment.containerXpath)))
                          {
                             aItem.set('modContainer', visualContainerByXpath.name);
                          }

                          return true;
                       }, this);

                  Ext.Msg.hide();
               }
               catch (e)
               {
                  Ext.Msg.hide();
                  Ext.Msg.alert(applicationResources.getProperty("profileWizard.load.failure"));
                  //window.close();
               }
            }
         });
      },

      showReiDialog: function(aNodeId, aNodeType, aRerId)
      {
         Ext.Msg.wait("Loading...");

         this.saveButton = this.createDisabledToolbarButton("saveRei", "report_disk.png", this.onSaveButtonClicked, applicationResources.getProperty("button.Save"), false, ServerEnvironment.isAdminUser);

         this.Bbar = new Ext.Toolbar({
            buttonAlign: 'center',
            items : [this.screenUtil.createToolbarButton("cancelRei", "cancel.png", this.onCancelButtonClicked, applicationResources.getProperty("button.Cancel")), '-',
               this.screenUtil.createToolbarButton("runRei", "report_go.png", this.onRunButtonClicked, applicationResources.getProperty("button.Run")), '-',
               this.createDisabledToolbarButton("getSqlRei", "application_get.png", this.onGetSqlButtonClicked, applicationResources.getProperty("button.getSql"), false, ServerEnvironment.isAdminUser), '-',
               this.saveButton, '-',
               this.screenUtil.createToolbarButton("saveAsRei", "report_disk.png", this.onSaveAsButtonClicked, applicationResources.getProperty("button.SaveAs")), '-'
            ]
         });

         this.tabPanel = this.createTabbedFormPanel(true);
         this.formPanel = new Adf.AdfFormPanel(
         {
            xtype: 'formpanel',
            id: 'adfReiForm',
            border: true,
            items:[
               {
                  xtype: 'hidden',
                  name: 'hasCustomPrompt'
               },
               {
                  xtype: 'hidden',
                  name: 'customPromptUrl'
               },
               {
                  xtype: 'hidden',
                  name: 'targetId'
               },
               {
                  xtype: 'hidden',
                  name: 'targetName'
               },
               {
                  xtype: 'hidden',
                  name: 'targetType'
               },
               {
                  xtype: 'hidden',
                  name: 'reiXml'
               },
               {
                  xtype: 'hidden',
                  name: 'launchNodeId'
               },
               {
                  xtype: 'hidden',
                  name: 'saveToFolderId'
               },
               {
                  xtype: 'hidden',
                  name: 'saveToFolderPath'
               },
               {
                  xtype: 'hidden',
                  name: 'privateProfile'
               },
               {
                  xtype: 'hidden',
                  name: 'emailServerDestinationId'
               },
               {
                  xtype: 'hidden',
                  name: 'saveAsNewProfileName'
               },
               {
                  xtype: 'hidden',
                  name: 'crnPackage'
               },
               this.tabPanel
            ],
            bbar: this.Bbar
         });

         this.reiViewPort = new Ext.Viewport({
            layout: 'fit',
            renderTo: Ext.getBody(),
            items: [this.formPanel]
         });

         // Binding the REI key mappings.
         // Note: The key bindings for the prompt page are bound separately, after the prompt page is loaded.
         // @see onReiParametersTabLoad
         this.reiKeyMappings = new Ext.KeyMap(Ext.getDoc(), this.createReiDialogKeyMappings());

         var loadUrl;
         var loadParams;
         if (aRerId && aRerId.length > 0)
         {
            loadUrl = ServerEnvironment.baseUrl + "/secure/actions/ext/editReportProfileForRer.do";
            loadParams = {
               rerId: aRerId
            };
         }
         else
         {
            loadUrl = ServerEnvironment.baseUrl + "/secure/actions/ext/editReportProfile.do";
            loadParams = {
               launchNodeId: aNodeId,
               launchNodeType: aNodeType
            };
         }

         this.formPanel.getForm().load({
            scope: this,
            loadMask : {msg:"Loading..."},
            url: loadUrl,
            params: loadParams,
            success: function(aForm, aAction)
            {
               try
               {
                  this.editReiDialogContext = aAction.result.data;

                  Ext.Msg.alert('returned from call');

                  var jsonReportMetaData = this.editReiDialogContext.report.reportMetaData;
                  this.outputsCheckBoxGroup.items.filter('name', "htmlCheck").items[0].metaDataSupported = jsonReportMetaData.supportsHtmlOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "pdfCheck").items[0].metaDataSupported = jsonReportMetaData.supportsPdfOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "pagedHtmlCheck").items[0].metaDataSupported = jsonReportMetaData.supportsPagedHtmlOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "xlsCheck").items[0].metaDataSupported = jsonReportMetaData.supportsXlsOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "xls2007Check").items[0].metaDataSupported = jsonReportMetaData.supportsSpreadsheetMLOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "xmlCheck").items[0].metaDataSupported = jsonReportMetaData.supportsXmlOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "csvCheck").items[0].metaDataSupported = jsonReportMetaData.supportsCsvOutput;

                  this.outputsCheckBoxGroup.items.filter('name', "xhtmlCheck").items[0].metaDataSupported = jsonReportMetaData.supportsXhtmlOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "htmlFragmentCheck").items[0].metaDataSupported = jsonReportMetaData.supportsHtmlFragmentOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "xlwaCheck").items[0].metaDataSupported = jsonReportMetaData.supportsXlwaOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "mhtmlCheck").items[0].metaDataSupported = jsonReportMetaData.supportsMhtmlOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "xlsxDataCheck").items[0].metaDataSupported = jsonReportMetaData.supportsXlsxDataOutput;
                  this.outputsCheckBoxGroup.items.filter('name', "layoutDataXmlCheck").items[0].metaDataSupported = jsonReportMetaData.supportsLayoutDataXmlOutput;

                   if(ServerEnvironment.isAdminUser || (ContentNodeTypeEnum.REPORT_PROFILE.name === this.editReiDialogContext.targetType))
                   {
                      this.saveButton.enable();
                   }

                   var outputOverrideCheckbox = this.formPanel.getForm().findField('outputOverride');
                   this.enableOutputFormats(outputOverrideCheckbox.getValue());

                   this.retentionCombo.store.loadData(this.editReiDialogContext);
                   this.retentionCombo.setValue(this.editReiDialogContext['retentionName']);

                   var rei = uiController.getRei();

                   this.outputsCheckBoxGroup.setValue([
                      rei.outputPreferenceSet.getHtmlPref().isEnabled,
                      rei.outputPreferenceSet.getPdfPref().isEnabled,
                      rei.outputPreferenceSet.getPagedHtmlPref().isEnabled,
                      rei.outputPreferenceSet.getXlsPref().isEnabled,
                      rei.outputPreferenceSet.getXls2007Pref().isEnabled,
                      rei.outputPreferenceSet.getXmlPref().isEnabled,
                      rei.outputPreferenceSet.getCsvPref().isEnabled,

                      rei.outputPreferenceSet.getXhtmlPref().isEnabled,
                      rei.outputPreferenceSet.getHtmlFragmentPref().isEnabled,
                      rei.outputPreferenceSet.getXlwaPref().isEnabled,
                      rei.outputPreferenceSet.getMhtPref().isEnabled,
                      rei.outputPreferenceSet.getXlsxDataPref().isEnabled,
                      rei.outputPreferenceSet.getLayoutDataXmlPref().isEnabled
                   ]);

                   var launchPref = this.editReiDialogContext['launchPref'];
                   if(launchPref)
                   {
                      this.formPanel.getForm().findField('launchPreferenceGroup').setValue('launchPref_' + launchPref, true);
                   }

                   if(this.editReiDialogContext['hasCustomPrompt'])
                   {
                      this.hasCustomPrompt = true;
                   }
                   else
                   {
                      this.hasCustomPrompt = false;
                   }

                   this.formPanel.getForm().findField('rowsPerPage').setValue(uiController.getRei().rowsPerPage);
                   this.formPanel.getForm().findField('maxPages').setValue(uiController.getRei().maxPages);


                   this.destinationGrid.store.loadData(this.editReiDialogContext);

                   //need to add the directive to the result data so expression editor can load insert mods
                   var contentAdjustments = this.editReiDialogContext.contentAdjustments;
                   if(contentAdjustments && contentAdjustments.length > 0)
                   {
                      for (var contentAdjustmentIndex = 0; contentAdjustmentIndex < contentAdjustments.length; contentAdjustmentIndex++)
                      {
                         var eachContentAdjustment = contentAdjustments[contentAdjustmentIndex];
                         if("insert" === eachContentAdjustment.modificationType)
                         {
                            eachContentAdjustment.rawContentAdjustment.directive = new InsertContentDirective(
                                  eachContentAdjustment.rawContentAdjustment.containerXpath,
                                  eachContentAdjustment.rawContentAdjustment.insertRelativeToRef,
                                  Enum.parseEnumFromName(RelationalInsertionPointEnum, eachContentAdjustment.rawContentAdjustment.relationalInsertionPointEnum),
                                  eachContentAdjustment.rawContentAdjustment.newColumnName,
                                  eachContentAdjustment.rawContentAdjustment.newColumnExpression,
                                  Enum.parseEnumFromName(RegularAggregateEnum, eachContentAdjustment.rawContentAdjustment.regularAggregateEnum),
                                  Enum.parseEnumFromName(AggregateFunctionEnum, eachContentAdjustment.rawContentAdjustment.aggregateFunctionEnum),
                                  Enum.parseEnumFromName(SortEnum, eachContentAdjustment.rawContentAdjustment.sortEnum),
                                  eachContentAdjustment.rawContentAdjustment.css,
                                  null
                            );
                            //eachContentAdjustment.modContainer = this.getVisualContainerByXpath(eachContentAdjustment.rawContentAdjustment.containerXpath).name;
                         }
                         else if("suppress" === eachContentAdjustment.modificationType)
                         {
                            //eachContentAdjustment.modContainer = this.getVisualContainerByXpath(eachContentAdjustment.rawContentAdjustment.containerXpath).name;
                         }
                      }
                   }
                   var runtimeFilters = this.editReiDialogContext['runtimeFilters'];

                   if(runtimeFilters && runtimeFilters.length > 0)
                   {
                      for (var count = 0; count < runtimeFilters.length; count++)
                      {
                         var eachFilter = runtimeFilters[count];
                         var newContentAdjustment = {};

                         newContentAdjustment['modContainer'] = eachFilter.query;
                         newContentAdjustment['modColumnName'] = eachFilter.dataItemName;
                         newContentAdjustment['modificationExpression'] = eachFilter.expression;
                         newContentAdjustment['modificationType'] = 'filter';
                         newContentAdjustment['rawContentAdjustment'] = {};
                         newContentAdjustment['rawContentAdjustment']['directive'] = new ReiRuntimeFilter(
                               eachFilter.dataItemName,
                               eachFilter.relation,
                               eachFilter.values,
                               eachFilter.query,
                               eachFilter.expression
                         );
                         newContentAdjustment['contentModId'] = 1000 + count;
                         contentAdjustments.push(newContentAdjustment);
                      }
                   }

                   this.contentModGrid.store.loadData(this.editReiDialogContext);

                   this.hideForbiddenOperations(jsonReportMetaData);
                   this.formPanel.doLayout(false, true);
                   Ext.Msg.hide();
               }
               catch (e)
               {
                   Ext.Msg.hide();
                   Ext.Msg.alert(applicationResources.getProperty("profileWizard.load.failure.title"), applicationResources.getProperty("profileWizard.load.failure") + e);
                   //window.close();
               }
            }
         });
      },

      //todo - eventually convert the consumers of this data to use json
      convertJsonToDomain : function (aCrnReportJson)
      {
         var containers = [];

         var lists = aCrnReportJson.crnLists;
         var queries = aCrnReportJson.querySet.queries;

         var biQuerySet = new BiQuerySet();
         var biQuery;

         for (var i = 0; i < queries.length; i++)
         {
            var query = queries[i];
            biQuery = new BiQuery(query.name);

            for (var j = 0; j < query.dataItems.length; j++)
            {
               var dataItem = query.dataItems[j];
               biQuery.addDataItem(new QueryDataItem(dataItem.name, dataItem.expression, null, null, null))
            }

            biQuerySet.addQuery(biQuery);
         }

         for (var i = 0; i < lists.length; i++)
         {
            var list = lists[i];

            var crnList = new CrnList(list.name, list.xpath, biQuerySet.biQueriesByName[list.queryName]);

            for (var j = 0; j < list.queryItemRefs.length; j++)
            {
               var queryItemRef = list.queryItemRefs[j];
               crnList.addQueryItemRef(new QueryItemRef(queryItemRef.refItem,
                       queryItemRef.groupDirective == null ? null : new GroupDirective(queryItemRef.groupDirective.order),
                       queryItemRef.sortDirective == null ? null : new SortDirective(queryItemRef.sortDirective.direction, queryItemRef.sortDirective.order)));
            }

            containers.push(crnList);
         }

         for (var i = 0; i < aCrnReportJson.crnCrosstabs.length; i++)
         {
            var crosstab = aCrnReportJson.crnCrosstabs[i];

            var crnCrosstab = new CrnCrosstab(crosstab.name, crosstab.xpath, biQuerySet.biQueriesByName[crosstab.queryName]);

            for (var j = 0; j < crosstab.queryItemRefs.length; j++)
            {
               var queryItemRef = crosstab.queryItemRefs[j];
               crnCrosstab.addQueryItemRef(new QueryItemRef(queryItemRef.refItem,
                       queryItemRef.groupDirective == null ? null : new GroupDirective(queryItemRef.groupDirective.order),
                       queryItemRef.sortDirective == null ? null : new SortDirective(queryItemRef.sortDirective.direction, queryItemRef.sortDirective.order)));
            }

            containers.push(crnCrosstab);
         }

         return containers;
      },

      hideForbiddenOperations: function(aMetaData)
      {
         if(aMetaData)
         {
            if(!aMetaData.supportsContentInsertion)
            {
               this.hideButtonAndSeparator(this.contentModGrid, "AddNewColumn");
            }

            if(!aMetaData.supportsContentSuppression)
            {
               this.hideButtonAndSeparator(this.contentModGrid, "SuppressColumn");
            }

            if(!aMetaData.supportsRuntimeFilters)
            {
               this.hideButtonAndSeparator(this.contentModGrid, "AddNewFilter");
            }
         }
      },

      hideButtonAndSeparator: function(aGrid, aButtonName)
      {
         //iterating through the buttons instead of using get() so we can also hide the separator after the button
         for (var count = 0; count < aGrid.topToolbar.items.items.length; count++)
         {
            var eachItem = aGrid.topToolbar.items.items[count];
            if(eachItem.id === aButtonName)
            {
               eachItem.hide();
               aGrid.topToolbar.items.items[count].hide();
               if(aGrid.topToolbar.items.items.length > (count + 1))
               {
                  aGrid.topToolbar.items.items[count + 1].hide();
               }
            }
         }
      },

      onDeleteButtonClicked : function ()
      {
        Ext.MessageBox.confirm(
               applicationResources.getProperty("general.dialog.confirmTitle"),
               applicationResources.getProperty("general.confirmDeletions"),
               function (aButton)
               {
                  if ('yes' == aButton)
                  {
                    this.processDeletion();
                  }
               }.createDelegate(this)
            );
      },

      processDeletion : function ()
      {
         var selections = this.contentModGrid.getSelectionModel().getSelections();
         this.contentModGrid.getStore().remove(selections);
      },

      onRunButtonClicked: function(aButton)
      {
         RequestUtil.pingUserSession(function()
         {
            Ext.Msg.wait(applicationResources.getProperty("general.submittingRequest"));

            if(this.beforeSubmit())
            {
               this.setReiFormValues();

               this.formPanel.getForm().submit({
                  url: ServerEnvironment.baseUrl + "/secure/actions/ext/runReportProfile.do",
                  waitMsg: 'Running...',
                  failure: function (aForm, anAction)
                  {
                     var aResponse = anAction.response;

                     // Extracting the execution results from response.
                     var response = Ext.decode(aResponse.responseText);
                     Ext.Msg.alert('Warning', response.msg);
                  },
                  success: function (aForm, anAction)
                  {
                     var aResponse = anAction.response;
                     Ext.Msg.hide();
                     this.refreshRerScreen();

                     // Extracting the execution results from response.
                     var response = Ext.decode(aResponse.responseText);

                     // Launch the report into the report viewer if the RER Inputs specify to run the report in the
                     // foreground.
                     if (!Ext.isEmpty(response.rerIdsToLaunchInForeground))
                     {
                        launchReportViewer(response.rerIdsToLaunchInForeground);
                     }

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

                     // Notify the RER Status screen that reports are executing.
                     // Monitor the reports that will be displayed in the report viewer once they are completed.
                     if (!Ext.isEmpty(response.rerIdsToAutoView) && response.rerIdsToAutoView.length)
                     {
                        for (var i = 0; i < response.rerIdsToAutoView.length; i++)
                        {
                           JsUtil.createCookie("newRerWatchId" + response.rerIdsToAutoView[i], response.rerIdsToAutoView[i]);
                        }
                     }

                     // Launch reports in the Cognos Viewer.
                     if (Ext.isArray(response.cognosRerIdsToView))
                     {
                        for (var cv = 0; cv < response.cognosRerIdsToView.length; cv++)
                        {
                           // Open a blank browser window.
                           var windowName = Ext.id().replace(/-/g, "_");
                           var geom = new BrowserGeometry();
                           var win = window.open(ServerEnvironment.contextPath + '/secure/actions/ext/launchCognosViewer.do?rerId=' + response.cognosRerIdsToView[cv],
                              windowName,
                              "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

                           win.focus();

                        }
                     }

                     FadeMessageController.getInstance().showFadeMessage(applicationResources.getProperty("profileWizard.runnow.message"), 4000);
                  },
                  scope: this
               });
            }
            else
            {
               Ext.Msg.hide();
            }
         }, this);
      },

      onCancelButtonClicked: function(aButton)
      {
         window.close();
      },

      beforeSubmit : function()
      {
         if(this.hasCustomPrompt)
         {
            return uiController.beforeSubmit();
         }
         else
         {
            return true;
         }
      },

      setReiFormValues: function()
      {
         //--- populate the JS REI based on the form state
         var rei = uiController.getRei();

         var runtimeFilters = this.getRuntimeFilterSet();
         uiController.getRei().runtimeFilterSet = runtimeFilters;

         var rowsPerPage = this.formPanel.getForm().findField('rowsPerPage').getValue();
         uiController.getRei().rowsPerPage = rowsPerPage ? rowsPerPage : 20;

         var maxPages = this.formPanel.getForm().findField('maxPages').getValue();
         uiController.getRei().maxPages = maxPages ? maxPages : 10;

         rei.outputPreferenceSet.clear();
         var eachCheckBox;

         var selectedOutputCheckBoxes = this.outputsCheckBoxGroup.getValue();

         for (var i = 0; i < selectedOutputCheckBoxes.length; ++i)
         {
            eachCheckBox = selectedOutputCheckBoxes[i];
            rei.outputPreferenceSet.getOutputPreference(eachCheckBox.outputFormatEnum).isEnabled = true;
         }

         var maxExecutionTime = this.formPanel.getForm().findField('maxExecutionTime').getValue();
         rei.maxExecutionTime = ((maxExecutionTime == "") ? null : maxExecutionTime);

         var launchPreference = this.formPanel.getForm().findField('launchPreferenceGroup').getValue().inputValue;
         rei.launchPreference = launchPreference;

         var outputExpirationDays = this.retentionCombo.getValue();
         //This if fixes an issue where if the combobox selection was never changed, the text display value is used rather than the actual value
         rei.outputExpirationDays = ((outputExpirationDays == "Use System Default") ? 0 : outputExpirationDays);

         rei.contentAdjustments.clear();
         rei.contentAdjustments = this.getContentAdjustments();

         rei.deliveryPreferenceSet.prefs = [];
         rei.deliveryPreferenceSet = this.getDeliveryPreferences();

         this.formPanel.getForm().findField('reiXml').setValue(rei.toXml());
      },

      getRuntimeFilterSet : function()
      {
         var filterSet = new RuntimeFilterSet();

         this.contentModGrid.getStore().data.each(
               function(aItem, aIndex, aLength){
                  var rawContentAdjustment = aItem.data.rawContentAdjustment;
                  if('filter' == aItem.data['modificationType'])
                  {
                     //we're doing this because the RuntimeFilterExpression domain object isn't smart enough
                     //to handle both a data item and expression string being set
                     rawContentAdjustment.directive.fullQueryExpression = '';
                     filterSet.addFilter(rawContentAdjustment.directive);
                  }
                  return true;
               }, this);

         return filterSet;
      },

      addDestinationFormats: function(aInputString, aDeliveryPreference)
      {
         var isOverrideDefaultsChecked = this.formPanel.getForm().findField('outputOverride').getValue();

         if(aInputString.indexOf('PDF') != -1 && (this.isCheckboxCheckedByName('pdfCheck') ) )
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.PDF);
         }
         if(aInputString.indexOf('XML') != -1 && this.isCheckboxCheckedByName('xmlCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.XML);
         }
         if(aInputString.indexOf('CSV') != -1 && this.isCheckboxCheckedByName('csvCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.CSV);
         }
         if(aInputString.indexOf('HTML') != -1 && (this.isCheckboxCheckedByName('htmlCheck') || !isOverrideDefaultsChecked))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.HTML);
         }
         if(aInputString.indexOf('Paged HTML') != -1 && (this.isCheckboxCheckedByName('pagedHtmlCheck') || !isOverrideDefaultsChecked))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.PAGED_HTML);
         }
         if(aInputString.indexOf('XLS') != -1 && this.isCheckboxCheckedByName('xlsCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.singleXLS);
         }
         if(aInputString.indexOf('XLS (2007)') != -1 && this.isCheckboxCheckedByName('xls2007Check'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.spreadsheetML);
         }

         if(aInputString.indexOf('XHTML') != -1 && this.isCheckboxCheckedByName('xhtmlCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.XHTML);
         }
         if(aInputString.indexOf('HTMLFragment') != -1 && this.isCheckboxCheckedByName('htmlFragmentCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.HTMLFragment);
         }
         if(aInputString.indexOf('XLWA') != -1 && this.isCheckboxCheckedByName('xlwaCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.XLWA);
         }
         if(aInputString.indexOf('MHTML') != -1 && this.isCheckboxCheckedByName('mhtmlCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.MHT);
         }
         if(aInputString.indexOf('XLSX_DATA') != -1 && this.isCheckboxCheckedByName('xlsxDataCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.xlsxData);
         }
         if(aInputString.indexOf('layoutDataXML') != -1 && this.isCheckboxCheckedByName('layoutDataXmlCheck'))
         {
            aDeliveryPreference.addOutputReference(OutputFormatEnum.layoutDataXML);
         }
      },

      getDeliveryPreferences: function()
      {
         var result = new DeliveryPreferenceSet();
         this.destinationGrid.getStore().data.each(
               function(aItem, aIndex, aLength){
                  if (aItem.data['destinationSelected'])
                  {
                     var deliveryPreference;

                     if('EMAIL' == aItem.data['destinationType'])
                     {
                        //create email entry
                        deliveryPreference = new EmailDeliveryPreference(true, aItem.data['destinationId']);
                        deliveryPreference.zip = aItem.data['zip'];
                        deliveryPreference.subject = aItem.data['subject'];
                        deliveryPreference.body = aItem.data['body'];
                        deliveryPreference.toList = aItem.data['toList'];
                        deliveryPreference.ccList = aItem.data['ccList'];
                        deliveryPreference.bccList = aItem.data['bccList'];
                     }
                     else
                     {
                        deliveryPreference = new FileTransferDeliveryPreference(true, aItem.data['zip'], aItem.data['destinationId']);
                     }

                     this.addDestinationFormats(aItem.data['destinationFileTypes'], deliveryPreference);

                     result.addDeliveryPreference(deliveryPreference);
                  }

                  return true;
               }, this);

         return result;
      },

      getContentAdjustments: function()
      {
         var result = new RuntimeContentAdjustments();
         this.contentModGrid.getStore().data.each(
               function(aItem, aIndex, aLength){
                  var contentDirective = null;
                  var rawContentAdjustment = aItem.data.rawContentAdjustment;
                  if('suppress' == aItem.data['modificationType'])
                  {
                     contentDirective = new SuppressContentDirective(rawContentAdjustment.containerXpath,
                             rawContentAdjustment.refItemName, rawContentAdjustment['delete'], null);
                  }
                  else if ('insert' == aItem.data['modificationType'])
                  {
                      contentDirective = rawContentAdjustment.directive;
                  }

                  if (contentDirective)
                  {
                     result.addAdjustment(contentDirective);
                  }

                  return true;
               }, this);

         return result;
      },

      refreshOpener: function()
      {
          var adfInstance = this.getParentAdfInstance();

         if(!Ext.isEmpty(adfInstance) && !Ext.isEmpty(adfInstance.folderContentsUi))
         {
             adfInstance.folderContentsUi.refreshContentsGrid();
         }
      },

      refreshRerScreen : function()
      {
         var adfInstance = this.getParentAdfInstance();

         if(!Ext.isEmpty(adfInstance) && !Ext.isEmpty(adfInstance.browseRersUi))
         {
             adfInstance.browseRersUi.refreshRerGrid();
         }
      },

      getParentAdfInstance: function()
      {
          if(!Ext.isEmpty(window.opener) && !Ext.isEmpty(window.opener.Adf))
         {
            return window.opener.Adf;
         }
         //these null checks suck
         else if( !Ext.isEmpty(window.opener)
             && !Ext.isEmpty(window.opener.window)
             && !Ext.isEmpty(window.opener.window.opener)
             && !Ext.isEmpty(window.opener.window.opener.Adf))
         {
            //called from output viewer (or some other secondary window)
            return window.opener.window.opener.Adf;
         }
         else
         {
            return null;
         }
      },

      onSaveButtonClicked: function(aButton)
      {
          if(this.beforeSubmit())
          {
             this.setReiFormValues();

             this.formPanel.getForm().submit({
                url: ServerEnvironment.baseUrl + "/secure/actions/ext/saveReportProfile.do",
                waitMsg: 'Saving...',
                success: function ()
                {
                   this.refreshOpener();
                   window.close();
                },
                scope: this
             });
          }

      },

      onSaveAsButtonClicked: function(aButton)
      {
          if(this.beforeSubmit())
          {
             Adf.profileSaveAsDialog.showSaveAsDialog(
                  this,
                  function(aProfileName, aPrivateFlag, aSaveToFolderPath, aSaveToFolderId)
                  {
                     this.formPanel.getForm().findField('saveAsNewProfileName').setValue(aProfileName);
                     this.formPanel.getForm().findField('saveToFolderId').setValue(aSaveToFolderId);
                     this.formPanel.getForm().findField('saveToFolderPath').setValue(aSaveToFolderPath);
                     this.formPanel.getForm().findField('privateProfile').setValue(aPrivateFlag);

                     this.setReiFormValues();

                     this.formPanel.getForm().submit({
                         url: ServerEnvironment.baseUrl + "/secure/actions/ext/saveNewReportProfile.do",
                         waitMsg: 'Saving...',
                         success: function ()
                         {
                            this.refreshOpener();
                            window.close();
                         },
                         scope: this
                      });
                  },
                   this.formPanel.getForm().findField('targetName').getValue(),
                   this.formPanel.getForm().findField('privateProfile').getValue(),
                   this.formPanel.getForm().findField('saveToFolderPath').getValue());
          }

      },

      setReiXml: function(aXml)
      {
         this.formPanel.getForm.findField('reiXml').value = aXml;
      },

      getCrnPackage: function()
      {
         return this.formPanel.getForm().findField('crnPackage').value;
      },

      createRelationSets : function()
      {
         this.NumberRelationData = [
            ["<"],
            ["<="],
            [">"],
            [">="],
            ["="],
            ["<>"],
            ["is null"],
            ["is not null"]
         ];

         this.StringRelationData = [
            ["="],
            ["<>"],
            ["contains"],
            ["is null"],
            ["is not null"],
            ["starts with"],
            ["ends with"]
         ];

         this.dateTimeRelationData = [
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

      },

      onSuppressColumnButtonClicked: function(aControl, aEvent, aRecord)
      {
          this.showSuppressColumnWindow.call(this, aRecord);
      },

      showSuppressColumnWindow: function(aRecord)
      {
         this.selectedRecord = aRecord;

         var contentDataStore = new Ext.data.ArrayStore({
            fields:
            [
               {name: 'refItem', mapping: 'refItem'},
               {name: 'groupDirective', mapping: 'groupDirective'},
               {name: 'containerName', mapping: 'containerName'},
               {name: 'containerXpath', mapping: 'containerXpath'}
            ]
         });

          function renderGrouped (aValue) {
             if (aValue == null) {
                 return "--";
             }
             else {
                return "Grouped";
             }
          }

         var contentCm = new Ext.grid.ColumnModel([
            { id: 'containerName',
               header: 'Report Container',
               dataIndex: 'containerName',
               width: 200,
               sortable:true
            },
            { id: 'refItem',
               header: 'Column Name',
               dataIndex: 'refItem',
               width: 200,
               sortable:true
            },
            { id: 'groupDirective',
               header: 'Grouped?',
               dataIndex: 'groupDirective',
               width: 250,
               renderer: renderGrouped
            }
         ]);
         contentCm.defaultSortable = true;

         function suppressSelectedColumns()
         {
            var selections = this.columnSuppressionGrid.getSelectionModel().getSelections();
            var contentAdjustments = [];
            var ignoredSuppressionSelections = [];
            for (var i = 0; i < selections.length; i++)
            {
                var selection = selections[i].json;
                if (!selection.isDimension())
                {
                    //Do not re-add any existing suppression mods
                    var found = this.contentModGrid.getStore().findBy( function (aRecord, anId) {
                      return (aRecord.data.modColumnName == selection.refItem && aRecord.data.modificationType == 'suppress' &&
                              aRecord.data.rawContentAdjustment.rawXpath == selection.rawXpath && aRecord.data.rawContentAdjustment.containerXpath == selection.containerXpath);
                    });

                    if (found < 0)
                    {
                        contentAdjustments.push(
                        {
                            modContainer: this.getVisualContainerByXpath(selection.containerXpath).name,
                            modColumnName: selection.refItem,
                            modificationExpression: "",
                            modificationType: 'suppress',
                            rawContentAdjustment:
                            {
                                rawXpath: selection.rawXpath,
                                containerXpath: selection.containerXpath,
                                refItemName: selection.refItem,
                                'delete': false
                        }});
                    }
                }
                else
                {
                    ignoredSuppressionSelections.push(selection.refItem);
                }

            }

            if (contentAdjustments.length > 0)
            {
                this.contentModGrid.getStore().loadData({ contentAdjustments: contentAdjustments}, true);
            }
            if (ignoredSuppressionSelections.length > 0)
            {
                var message = applicationResources.getProperty("profileWizard.error.cantSuppressGroupedColumns") +
                    "<ul style='list-style: disc; margin: 5px 30px;'><li style='list-style: disc'>" +
                    ignoredSuppressionSelections.join("</li><li style='list-style: disc'>") + "</li></ul>"

                Ext.MessageBox.show({
                    title: applicationResources.getProperty("profileWizard.message.warning"),
                    msg: message,
                    buttons: Ext.Msg.OK,
                    minWidth: 300
                });
            }

            columnSupressionSelectionWindow.close();
         }

         var contentToolbar = new Ext.Toolbar({
            items : ['->', this.screenUtil.createToolbarButton("SuppressSelectedColumn", "report_delete.png", suppressSelectedColumns, "Suppress Column")
            ]
         });

         this.columnSuppressionGrid = new Ext.grid.GridPanel({
            loadMask: true,
            bbar: contentToolbar,
            autoExpandColumn: 'groupDirective',
            cm: contentCm,
            stripeRows: true,
            store: contentDataStore,
            region: 'center'
         });

         // create and show window
         var columnSupressionSelectionWindow = new Ext.Window({
            id:'columnSuppressionWindow'
            ,title:'Suppress Columns'
            ,layout:'fit'
            ,width:500
            ,height:300
            ,closable:true
            ,modal:true
            ,border:false
            ,items:[this.columnSuppressionGrid]
            ,closeAction:'close'
         });

         //todo - hack until I can figure out how to get the store to do this for me (i'm 90% that's possible)
          var suppressionColumns = [];

          for (var i = 0; i < this.visualContainers.length; i++)
          {
              var container = this.visualContainers[i];

              for (var j = 0; j < container.queryItemRefs.length; j++)
              {
                  var ref = container.queryItemRefs[j];
                  ref.containerXpath = container.xpath;
                  ref.containerName = container.name;
                  ref.containerQuery = container.query;
                  suppressionColumns.push(ref);
              }
          }

         contentDataStore.loadData(suppressionColumns);

         columnSupressionSelectionWindow.show();
      },

      showEditFileTransferWindow: function(aRecord)
      {
         this.selectedRecord = aRecord;

         var selectedFileTypes = aRecord.data['destinationFileTypes'];

         if(!selectedFileTypes)
         {
            selectedFileTypes = '';
         }

         var fsDestCheckboxGroup = this.createDestinationCheckboxGroup(selectedFileTypes);

         var editFsForm = new Adf.AdfFormPanel({
            labelWidth: 120,
            id: 'FileSystemDestForm',
            width: 360,
            bodyStyle:'padding:5px 5px 0',
            defaults: {anchor: '100%'},
            defaultType: 'checkbox',

            isFormValid: function()
            {

               if(this.getForm().isValid())
               {
                  var typeStrings = fsDestCheckboxGroup.getValue();
                  if(typeStrings.length === 0)
                  {
                     Ext.Msg.alert(applicationResources.getProperty('profileWizard.outputs.types.validation.title'), applicationResources.getProperty('profileWizard.outputs.types.validation'));
                     return false;
                  }
                  else
                  {
                     return true;
                  }
               }
            },

            items:[
               fsDestCheckboxGroup,
               {
                  name: 'zipCheck',
                  boxLabel: 'Deliver report outputs in zip file',
                  checked: aRecord.data['zip']
               }
            ],
            buttons:[
               {
                  scope: this,
                  text: 'Save',
                  handler: function()
                  {
                     if(editFsForm.isFormValid.call(editFsForm))
                     {
                        //save values back to source record
                        var typeStrings = fsDestCheckboxGroup.getValue();
                        var destTypes = '';
                        for(var count = 0; count < typeStrings.length; count++)
                        {
                           destTypes += typeStrings[count].boxLabel + ' ';
                        }
                        this.selectedRecord.set('destinationSelected', true);
                        this.selectedRecord.set('destinationFileTypes', destTypes);
                        this.selectedRecord.set('zip', editFsForm.getForm().findField('zipCheck').getValue());
                        this.selectedRecord.commit();
                        editFsWin.close();
                     }
                  }
               },
               {
                  scope: this,
                  text: 'Cancel',
                  handler: function()
                  {
                     if(Ext.isEmpty(this.selectedRecord.data['destinationFileTypes']))
                     {
                        this.selectedRecord.set('destinationSelected', false);
                     }

                     editFsWin.close();
                  }
               }
            ]
         });

         // create and show window
         var editFsWin = new Ext.Window({
            id:'editFsDestinationWindow'
            ,title:'Edit [' + aRecord.data['destinationDescription'] + ']'
            ,layout:'fit'
            ,width:460
            ,height:200
            ,closable:true
            ,modal:true
            ,border:false
            ,items:editFsForm
            ,closeAction:'close'
         });

         editFsWin.show();
      },

      createDestinationCheckboxGroup : function (selectedFileTypes)
      {
         var jsonReportMetaData = this.editReiDialogContext.report.reportMetaData;

         return new Ext.form.CheckboxGroup({
            fieldLabel:'Output Formats',
            name: 'destOutputGroup',
            columns:3,
            width: 350,
            items:[
               {
                  boxLabel: 'PDF',
                  name: 'destPdfCheck',
                  checked: (jsonReportMetaData.supportsPdfOutput && selectedFileTypes.indexOf('PDF') != -1 && (this.isCheckboxCheckedByName('pdfCheck') || !this.formPanel.getForm().findField('outputOverride').getValue())),
                  disabled : (!jsonReportMetaData.supportsPdfOutput || (!this.isCheckboxCheckedByName('pdfCheck') ))
               },
               {
                  boxLabel: 'HTML',
                  name: 'destHtmlCheck',
                  checked: (jsonReportMetaData.supportsHtmlOutput && selectedFileTypes.indexOf('HTML') != -1 && (this.isCheckboxCheckedByName('htmlCheck') || !this.formPanel.getForm().findField('outputOverride').getValue())),
                  disabled : (!jsonReportMetaData.supportsHtmlOutput || (!this.isCheckboxCheckedByName('htmlCheck') && this.formPanel.getForm().findField('outputOverride').getValue()))
               },
               {
                  boxLabel: 'Paged HTML',
                  name: 'destPagedHtmlCheck',
                  checked: (jsonReportMetaData.supportsPagedHtmlOutput && selectedFileTypes.indexOf('Paged HTML') != -1 && (this.isCheckboxCheckedByName('pagedHtmlCheck') || !this.formPanel.getForm().findField('outputOverride').getValue())),
                  disabled : (!jsonReportMetaData.supportsPagedHtmlOutput || (!this.isCheckboxCheckedByName('pagedHtmlCheck') && this.formPanel.getForm().findField('outputOverride').getValue()))
               },
               {
                  boxLabel: 'XLS',
                  name: 'destXlsCheck',
                  checked: (jsonReportMetaData.supportsXlsOutput && selectedFileTypes.indexOf('XLS') != -1 && this.isCheckboxCheckedByName('xlsCheck')),
                  disabled : (!jsonReportMetaData.supportsXlsOutput || !this.isCheckboxCheckedByName('xlsCheck'))
               },
               {
                  boxLabel: 'XLS (2007)',
                  name: 'destXls2007Check',
                  checked: (jsonReportMetaData.supportsSpreadsheetMLOutput && selectedFileTypes.indexOf('XLS (2007)') != -1 && this.isCheckboxCheckedByName('xls2007Check')),
                  disabled : (!jsonReportMetaData.supportsSpreadsheetMLOutput || !this.isCheckboxCheckedByName('xls2007Check'))
               },
               {
                  boxLabel: 'XML',
                  name: 'destXmlCheck',
                  checked: (jsonReportMetaData.supportsXmlOutput && selectedFileTypes.indexOf('XML') != -1 && this.isCheckboxCheckedByName('xmlCheck')),
                  disabled : (!jsonReportMetaData.supportsXmlOutput || !this.isCheckboxCheckedByName('xmlCheck'))
               },
               {
                  boxLabel: 'CSV',
                  name: 'destCsvCheck',
                  checked: (jsonReportMetaData.supportsCsvOutput && selectedFileTypes.indexOf('CSV') != -1 && this.isCheckboxCheckedByName('csvCheck')),
                  disabled : (!jsonReportMetaData.supportsCsvOutput || !this.isCheckboxCheckedByName('csvCheck'))
               },

               {
                  boxLabel: 'XHTML',
                  name: 'destXhtmlCheck',
                  checked: (jsonReportMetaData.supportsXhtmlOutput && selectedFileTypes.indexOf('XHTML') != -1 && this.isCheckboxCheckedByName('xhtmlCheck')),
                  disabled : (!jsonReportMetaData.supportsXhtmlOutput || !this.isCheckboxCheckedByName('xhtmlCheck'))
               },
               {
                  boxLabel: 'HTMLFragment',
                  name: 'destHtmlFragmentCheck',
                  checked: (jsonReportMetaData.supportsHtmlFragmentOutput && selectedFileTypes.indexOf('HTMLFragment') != -1 && this.isCheckboxCheckedByName('htmlFragmentCheck')),
                  disabled : (!jsonReportMetaData.supportsHtmlFragmentOutput || !this.isCheckboxCheckedByName('htmlFragmentCheck'))
               },
               {
                  boxLabel: 'XLWA',
                  name: 'destXlwaCheck',
                  checked: (jsonReportMetaData.supportsXlwaOutput && selectedFileTypes.indexOf('XLWA') != -1 && this.isCheckboxCheckedByName('xlwaCheck')),
                  disabled : (!jsonReportMetaData.supportsXlwaOutput || !this.isCheckboxCheckedByName('xlwaCheck'))
               },
               {
                  boxLabel: 'MHTML',
                  name: 'destMhtmlCheck',
                  checked: (jsonReportMetaData.supportsMhtmlOutput && selectedFileTypes.indexOf('MHTML') != -1 && this.isCheckboxCheckedByName('mhtmlCheck')),
                  disabled : (!jsonReportMetaData.supportsMhtmlOutput || !this.isCheckboxCheckedByName('mhtmlCheck'))
               },
               {
                  boxLabel: 'XLSX_DATA',
                  name: 'destXlsxDataCheck',
                  checked: (jsonReportMetaData.supportsXlsxDataOutput && selectedFileTypes.indexOf('XLSX_DATA') != -1 && this.isCheckboxCheckedByName('xlsxDataCheck')),
                  disabled : (!jsonReportMetaData.supportsXlsxDataOutput || !this.isCheckboxCheckedByName('xlsxDataCheck'))
               },
               {
                  boxLabel: 'layoutDataXml',
                  name: 'destLayoutDataXmlCheck',
                  checked: (jsonReportMetaData.supportsLayoutDataXmlOutput && selectedFileTypes.indexOf('layoutDataXML') != -1 && this.isCheckboxCheckedByName('layoutDataXmlCheck')),
                  disabled : (!jsonReportMetaData.supportsLayoutDataXmlOutput || !this.isCheckboxCheckedByName('layoutDataXmlCheck'))
               }
            ]
         });
      },

      //Returns false if the checkbox is not found by the given name
      isCheckboxCheckedByName : function (aCheckBoxname)
      {
         var checked = false;
         var foundCheckboxes = this.outputsCheckBoxGroup.items.filter('name', aCheckBoxname);

         if (foundCheckboxes.length == 1)
         {
            checked = foundCheckboxes.get(0).getValue();
         }

         return checked;
      },

      showEditEmailWindow: function(aRecord)
      {
         this.selectedRecord = aRecord;

         var selectedFileTypes = aRecord.data['destinationFileTypes'];

         if(!selectedFileTypes)
         {
            selectedFileTypes = '';
         }

         var emailDestCheckboxGroup = this.createDestinationCheckboxGroup(selectedFileTypes);

         var editEmailForm = new Adf.AdfFormPanel({
            labelWidth: 120,
            id: 'FileSystemDestForm',
            width: 400,
            bodyStyle:'padding:5px 5px 0',
            defaults: {anchor: '95%'},
            defaultType: 'checkbox',

            isFormValid: function()
            {

               if(this.getForm().isValid())
               {
                  var typeStrings = emailDestCheckboxGroup.getValue();
                  if(typeStrings.length === 0)
                  {
                     Ext.Msg.alert(applicationResources.getProperty('profileWizard.outputs.types.validation.title'), applicationResources.getProperty('profileWizard.outputs.types.validation'));
                     return false;
                  }
                  else
                  {
                     return true;
                  }
               }
            },

            items:[
               new Ext.form.TextField({
                  fieldLabel: 'To',
                  xtype:'textfield',
                  name:'toField',
                  allowBlank:false,
                  vtype:'multipleEmail',
                  value: aRecord.data['toList']
               }),
               new Ext.form.TextField({
                  fieldLabel: 'CC',
                  xtype:'textfield',
                  name:'ccField',
                  vtype:'multipleEmail',
                  value: aRecord.data['ccList']
               }),
               new Ext.form.TextField({
                  fieldLabel: 'BCC',
                  xtype:'textfield',
                  name:'bccField',
                  vtype:'multipleEmail',
                  value: aRecord.data['bccList']
               }),
               {
                  fieldLabel: 'Subject',
                  xtype:'textfield',
                  name:'subjectField',
                  value: aRecord.data['subject']
               },
               {
                  fieldLabel: 'Body',
                  xtype:'textarea',
                  name:'bodyField',
                  growMax: 300,
                  value: aRecord.data['body']
               },
               emailDestCheckboxGroup,
               {
                  name: 'zipCheck',
                  boxLabel: 'Deliver report outputs in zip file',
                  checked: aRecord.data['zip']
               }
            ],
            buttons:[
               {
                  scope: this,
                  text: 'Save',
                  handler: function()
                  {
                     if(editEmailForm.isFormValid.call(editEmailForm))
                     {
                        //save values back to source record
                        var typeStrings = emailDestCheckboxGroup.getValue();
                        var destTypes = '';
                        for(var count = 0; count < typeStrings.length; count++)
                        {
                           destTypes += typeStrings[count].boxLabel + ' ';
                        }
                        this.selectedRecord.set('destinationSelected', true);
                        this.selectedRecord.set('destinationFileTypes', destTypes);
                        this.selectedRecord.set('zip', editEmailForm.getForm().findField('zipCheck').getValue());
                        this.selectedRecord.set('toList', editEmailForm.getForm().findField('toField').getValue().split(/[,;|:]/));
                        this.selectedRecord.set('ccList', editEmailForm.getForm().findField('ccField').getValue().split(/[,;|:]/));
                        this.selectedRecord.set('bccList', editEmailForm.getForm().findField('bccField').getValue().split(/[,;|:]/));
                        this.selectedRecord.set('subject', editEmailForm.getForm().findField('subjectField').getValue());
                        this.selectedRecord.set('body', editEmailForm.getForm().findField('bodyField').getValue());
                        this.selectedRecord.commit();
                        editEmailWin.close();
                     }
                  }
               },
               {
                  scope: this,
                  text: 'Cancel',
                  handler: function()
                  {
                     if(Ext.isEmpty(this.selectedRecord.data['destinationFileTypes']))
                     {
                        this.selectedRecord.set('destinationSelected', false);
                     }

                     editEmailWin.close();
                  }
               }
            ]
         });


         // create and show window
         var editEmailWin = new Ext.Window({
            id:'editEmailDestinationWindow'
            ,title:'Edit [' + aRecord.data['destinationDescription'] + ']'
            ,layout:'fit'
            ,width:500
            ,height:400
            ,closable:true
            ,modal:true
            ,border:false
            ,items:editEmailForm
            ,closeAction:'close'
         });

         editEmailWin.show();
      },


      /**
       * This method is the handler for the Get SQL button clicked event. When the Get SQL button, the SQL statements
       * will be retrieved and displayed in a list.
       *
       * @param aButton (Ext.Button) - A reference to the Get SQL button.
       * @param aEventObject (Ext.EventObject) - Button click event object.
       */
      onGetSqlButtonClicked: function(aButton, aEventObject)
      {
         if (!uiModel.allowGetSql)
         {
            window.alert(applicationResources.getProperty("profileWizard.notAllowed"));
            return;
         }
         if (!this.beforeSubmit()){
            return;
         }


         //--- set all the form variables, then submit them using async request
         this.formPanel.getForm().findField('reiXml').setValue(uiController.getRei().toXml());
         document.forms[1].reiXml.value = uiModel.rei.toXml();


         var geom = new BrowserGeometry();
         var windowName = window.name + "_getSql";
         win = JsUtil.openNewWindow("about:blank",
                           windowName,
                           "width=1000,height=600,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=no");

         win.focus();

         // A little trick to redirect the submit to the new window.
         // todo: figure out a why there are 2 forms and good way to get a reference to the correct one.
         var originalTarget = document.forms[1].target;
         var originalAction = document.forms[1].action;
         var windowUrl = ServerEnvironment.contextPath + "/secure/actions/ext/launchReiSqlWindow.do";
         document.forms[1].target = windowName;
         document.forms[1].action = windowUrl;
         document.forms[1].submit();

         document.forms[1].target = originalTarget;
         document.forms[1].action = originalAction;
      },


      /**
       * This method handles the Sort Added event from the sort panel when a default sort is overridden for a
       * report container. It adds the sort override to the UI model sort overrides so the REI will be up to date when
       * passed back to the server for processing.
       *
       * containerSortOverride: {
       *    id: '',                 // (String) Container xpath.
       *    name: '',               // (String) Container name.
       *    sortOverrides: [{       // (Array<Object>) A list of column sort overrides.
       *       columnName: '',      // (String) Overridden column name.
       *       isDimension: false,  // (Boolean) An indicator that indicates if this column is a dimension.
       *       sortDirection: 1,    // (Integer) 1 if sorting in ascending order or 2 if sorting in descending order.
       *       sortOrder: 0         // (Integer) A unique number that indicates the order in which the column sort
       *                            //    override is applied.
       *    }]
       * }
       *
       * @param aContainerSortOverrides (Object) An object that contains the report container and an array of overridden
       * columns.
       */
      onSortOverrideAdded: function(aContainerSortOverrides)
      {
         var containerSortOverrides = new ContainerSortOverrides(aContainerSortOverrides.id);
         for (var i = 0; i < aContainerSortOverrides.sortOverrides.length; i++)
         {
            var eachSortOverride = aContainerSortOverrides.sortOverrides[i];

            // NOTE: The REI XML Parser uses 0 for ascending and 1 for descending values so the UI values must be
            // converted those values. - DK
            var sortOverride = new SortOverride(eachSortOverride.columnName,
                                                (eachSortOverride.sortDirection == 2) ? 1 : 0,
                                                eachSortOverride.sortOrder,
                                                eachSortOverride.isDimension);
            containerSortOverrides.addOverride(sortOverride);
         }
         uiController.getRei().sortOverrides.add(containerSortOverrides);
      },


      /**
       * This method handles the Sort Removed event from the sort panel when sort overrides for a report container
       * are removed. It removes the sort overrides from the UI model sort overrides so the REI will be up to date when
       * passed back to the server for processing.
       *
       * containerSortOverride: {
       *    id: '',                 // (String) Container xpath.
       *    name: '',               // (String) Container name.
       *    sortOverrides: []       // (Array<Object>) A list of column sort overrides.
       * }
       *
       * @param aContainerSortOverrides (Object) An object that contains the report container for which the sort
       * overrides have been removed.
       */
      onSortOverrideRemoved: function(aContainerSortOverrides)
      {
         uiController.getRei().sortOverrides.removeOverridesFor(aContainerSortOverrides.id);
      },


      /**
       * This method handles the Sort Updated event from the sort panel when sort overrides for a report container are
       * updated. It adds the sort override to the UI model sort overrides so the REI will be up to date when
       * passed back to the server for processing.
       *
       * containerSortOverride: {
       *    id: '',                 // (String) Container xpath.
       *    name: '',               // (String) Container name.
       *    sortOverrides: [{       // (Array<Object>) A list of column sort overrides.
       *       columnName: '',      // (String) Overridden column name.
       *       isDimension: false,  // (Boolean) An indicator that indicates if this column is a dimension.
       *       sortDirection: 1,    // (Integer) 1 if sorting in ascending order or 2 if sorting in descending order.
       *       sortOrder: 0         // (Integer) A unique number that indicates the order in which the column sort
       *                            //    override is applied.
       *    }]
       * }
       *
       * @param aContainerSortOverrides (Object) An object that contains the report container and an array of overridden
       * columns that have been updated.
       */
      onSortOverrideUpdated: function(aContainerSortOverrides)
      {
         var containerSortOverrides = uiController.getRei().sortOverrides.getOverridesFor(aContainerSortOverrides.id);
         containerSortOverrides.clear();
         for (var i = 0; i < aContainerSortOverrides.sortOverrides.length; i++)
         {
            var eachSortOverride = aContainerSortOverrides.sortOverrides[i];

            // NOTE: The REI XML Parser uses 0 for ascending and 1 for descending values so the UI values must be
            // converted those values. - DK
            var sortOverride = new SortOverride(eachSortOverride.columnName,
                                                (eachSortOverride.sortDirection == 2) ? 1 : 0,
                                                eachSortOverride.sortOrder,
                                                eachSortOverride.isDimension);
            containerSortOverrides.addOverride(sortOverride);
         }
      }

   };

}();

Adf.GenericDefaultPanel = Ext.extend(Ext.form.FormPanel, {
   constructor: function(aConfig)
   {

      // Create configuration for this Grid.
      var store = new Ext.data.Store({});
      var colModel = new Ext.grid.ColumnModel({});

      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         store: store,
         colModel: colModel
      }, aConfig);

      Adf.GenericDefaultPanel.superclass.constructor.call(this, aConfig);
   }
});