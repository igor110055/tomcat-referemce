// Initialize tooltips.
Ext.QuickTips.init();

if (!applicationResources)
{
    var applicationResources = {};
}
if (!wizardReport)
{
    var wizardReport = {};
}

/**=====================================================================================================================
 * UI Controller
 *
 *
 *
 * =====================================================================================================================
 */
var uiController = {
    navHandler: function(direction)
    {
        var wizardPanel = Ext.getCmp('wizardCardPanel');
        var activeItemIdx = wizardPanel.items.indexOf(wizardPanel.getActiveTab());
        var next = parseInt(activeItemIdx) + direction;
        wizardPanel.setActiveTab(next);

        this.toggleWizardNavigationButtons(next);
    },

    tabChanged : function ()
    {
        var wizardPanel = Ext.getCmp('wizardCardPanel');
        var activeItemIdx = wizardPanel.items.indexOf(wizardPanel.getActiveTab());

        this.toggleWizardNavigationButtons(activeItemIdx);
    },

    toggleWizardNavigationButtons: function(anActiveIndex)
    {
        if (anActiveIndex == 0)
        {
            Ext.getCmp('move-prev').setDisabled(true);
        }
        else
        {
            Ext.getCmp('move-prev').setDisabled(false);
        }

        if (anActiveIndex == 4)
        {
            Ext.getCmp('move-next').setDisabled(true);
        }
        else
        {
            Ext.getCmp('move-next').setDisabled(false);
        }
    },

    initializeUi: function()
    {

        // Select Type Tab.
        this.reportTypePanel = new wizard.ReportTypePanel({
            id: 'card-0',
            title: applicationResources.getProperty('reportWizard.selectReportType.title')
        });

        // Column Selection Tab.
        this.columnSelectionPanel = new wizard.ColumnSelectionPanel({
            id: 'card-1',
            border: false,
            title: applicationResources.getProperty('reportWizard.columnSelection.title')
        });

        // Add Calculations Tab
        this.reportCalculationsPanel = new wizard.CalculationGrid({
            id: 'card-2',
            title: applicationResources.getProperty('reportWizard.calculatedFields.title')
        });

        // Add Filters Tab.
        this.reportFiltersPanel = new wizard.FiltersGrid({
            id: 'card-3',
            title: applicationResources.getProperty('reportWizard.filters.title')
        });

        // Summary Tab.
        this.reportSummaryPanel = new wizard.ReportSummaryPanel({
            id: 'card-4',
            title: applicationResources.getProperty('reportWizard.summary.title')
        });


        this.cancelButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.bottomButtons.cancel')
        });

        this.validateButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.bottomButtons.validate')
        });

        this.previewButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.bottomButtons.preview')
        });

        this.runButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.bottomButtons.run'),
            disabled: true
        });

        this.finishButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.bottomButtons.finish'),
            disabled: true
        });

        this.reportWizardPanel = new Ext.Viewport({
            title: applicationResources.getProperty('reportWizard.title'),
            layout: 'fit',
            items: [
                {
                    enableTabScroll:true,
                    cls: 'wizardStepTabs',
                    xtype: 'tabpanel',
                    deferredRender : false,
                    id: 'wizardCardPanel',
                    activeTab: 0,
                    defaults: {
                        border: false
                    },
                    buttonAlign: 'center',
                    fbar: [
                        {
                            id: 'move-prev',
                            text: applicationResources.getProperty('reportWizard.bottomButtons.previous'),
                            iconCls: 'wizard-icon-previous',
                            handler: uiController.navHandler.createDelegate(uiController, [-1]),
                            disabled: true
                        },
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        this.validateButton,
                        this.previewButton,
                        ' ',
                        ' ',
                        ' ',
                        this.cancelButton,
                        this.runButton,
                        this.finishButton,
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        ' ',
                        {
                            id: 'move-next',
                            text: applicationResources.getProperty('reportWizard.bottomButtons.next'),
                            iconCls: 'wizard-icon-next',
                            iconAlign: 'right',
                            handler: uiController.navHandler.createDelegate(uiController, [1])
                        }
                    ],
                    items: [
                        this.reportTypePanel,
                        this.columnSelectionPanel,
                        this.reportCalculationsPanel,
                        this.reportFiltersPanel,
                        this.reportSummaryPanel
                    ]
                }
            ]
        });

        Ext.getCmp('wizardCardPanel').on('tabchange', this.tabChanged.createDelegate(this));

        this.reportTypePanel.on('listReportSelected', this.onListReportSelected.createDelegate(this));
        this.reportTypePanel.on('crosstabReportSelected', this.onCrosstabReportSelected.createDelegate(this));

        this.columnSelectionPanel.on('columnsAdded', this.onColumnsAdded.createDelegate(this));
        this.columnSelectionPanel.on('columnsDeleted', this.onColumnsDeleted.createDelegate(this));

        this.validateButton.on('click', this.onValidateButtonClicked.createDelegate(this));
        this.previewButton.on('click', this.onPreviewButtonClicked.createDelegate(this));
        this.runButton.on('click', this.onRunButtonClicked.createDelegate(this));
        this.cancelButton.on('click', this.onCancelButtonClicked, this);
        this.finishButton.on('click', this.onFinishButtonClicked, this);

        this.reportSummaryPanel.on('activate', this.onReportSummaryPanelActivate.createDelegate(this));

        this.columnSelectionPanel.on('beforeshow', this.onColumnSelectionPanelBeforeShow.createDelegate(this));
        this.reportCalculationsPanel.on('beforeshow', this.onReportCalculationPanelBeforeShow.createDelegate(this));
        this.reportFiltersPanel.on('beforeshow', this.onFiltersPanelBeforeShow.createDelegate(this));
        this.reportSummaryPanel.on('beforeshow', this.onReportSummaryPanelBeforeShow.createDelegate(this));

        this.reportTypePanel.initFrameworkModelList({frameworkModels:availableFrameworkModels});
        this.reportTypePanel.initSaveToFoldersList({saveToFolders:availableSaveToFolders});

    },

    onColumnSelectionPanelBeforeShow: function()
    {
        if (wizardReport.reportType == 'LIST')
        {
            this.columnSelectionPanel.getLayout().setActiveItem(0);
        }
        else
        {
            this.columnSelectionPanel.getLayout().setActiveItem(1);
        }

        this.columnSelectionPanel.loadData(wizardReport);
    },

    onReportCalculationPanelBeforeShow: function()
    {
        this.reportCalculationsPanel.loadData(wizardReport);
    },

    onFiltersPanelBeforeShow: function()
    {
        this.reportFiltersPanel.loadData(wizardReport);
    },

    onReportSummaryPanelActivate: function()
    {
//      alert('summary panel activated');
    },

    onReportSummaryPanelBeforeShow: function()
    {
        this.reportSummaryPanel.setSummaryData(wizardReport);
    },

    onColumnsAdded: function(aColumnsAdded)
    {
        if (wizardReport.columns.length > 0)
        {
            this.runButton.enable();
            this.finishButton.enable();
        }
    },

    onColumnsDeleted: function(aColumnsAdded)
    {
        if (wizardReport.columns.length == 0)
        {
            this.runButton.disable();
            this.finishButton.disable();
        }
    },

    onGetReportWizardFrameworkModels: function(aResponse, aOption)
    {
        var response = Ext.decode(aResponse.responseText);
        this.reportTypePanel.initFrameworkModelList(response);
    },

    onValidateButtonClicked: function(aButton, aEventObject)
    {
        var geom = new BrowserGeometry();
        var windowName = window.name + "_validate";

        var win = JsUtil.openNewWindow("",
                windowName,
                "width=830,height=380,top=" + (geom.top + 95) + ",left=" + (geom.left + 100) + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

        document.forms[0].target = windowName;

        document.getElementById("viewGesture").value = "validate";
        document.forms[0].wizardXml.value = wizardReport.toXml();
        document.getElementById("responseFormat").value = "HTML";
        document.forms[0].submit();
        document.forms[0].target = '';
    },

    beforeSubmit: function()
    {
        return true;
    },

    verifyWizardReportIsExecutable: function()
    {
        //--- forces wizardReport to be updated based on current ui state...
        this.beforeSubmit();
        if (wizardReport.columns.length == 0)
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.validation.title'),
                msg: applicationResources.getProperty("reportWizard.errMsg.cantRunReportWithNoColumns"),
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }

        var validationResult = this.validateReport();

        if (!validationResult.isValid)
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.validation.title'),
                msg: applicationResources.getProperty('reportWizard.validation.cannotRunOrSaveInvalidReport'),
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }
        else
        {
            return true;
        }

    },

    validationResult: {isValid: false},
    validateReport: function()
    {
        document.forms[0].responseFormat.value = "JS";
        document.forms[0].wizardXml.value = wizardReport.toXml();
        document.forms[0].viewGesture.value = 'validate';


        try
        {
            this.validationResult.isValid = false;
            var ajaxRequest = new Ajax.Request(ServerEnvironment.contextPath + "/secure/actions/reportWizard.do", {
                method : 'post',
                asynchronous : false,
                parameters : Form.serialize(document.forms[0]),
                onSuccess : function (aTransport)
                {
                    //debugger;

                    //alert("ajax request succeeded \n\n" + aTransport.responseText);
                    eval(aTransport.responseText);

                    this.validationResult = validationResult;
                }.bind(this),
                onFailure: function ()
                {
                    alert("ajax request failed");
                }
            }
                    );
        }
        finally
        {
//         window.status = "";
        }

        return this.validationResult;
    },

    onPreviewButtonClicked: function(aButton, aEventObject)
    {
        var geom = new BrowserGeometry();
        win = JsUtil.openNewWindow("",
                ServerEnvironment.windowNamePrefix + "_reportPreviewWindow",
                "width=1000,height=680,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");
        document.forms[0].target = ServerEnvironment.windowNamePrefix + '_reportPreviewWindow';

        document.getElementById("viewGesture").value = "preview";
        document.forms[0].wizardXml.value = wizardReport.toXml();
        document.forms[0].submit();
        document.forms[0].target = '';
    },

    onCancelButtonClicked: function(aButton, aEventObject)
    {
        if (this.beforeSubmit())
        {
            RequestUtil.request({
                url: ServerEnvironment.contextPath + "/secure/actions/reportWizard.do",
                success: this.onCancelButtonSuccess.createDelegate(this),
                failure: this.onCancelButtonFailure.createDelegate(this),
                params: {
                    wizardXml: wizardReport.toXml(),
                    viewGesture: 'cancel',
                    wizardStep: 'columnSelection'
                }
            });
        }
    },

    onCancelButtonSuccess: function(aResponse, aOption)
    {
        window.close();
    },

    onCancelButtonFailure: function(aResponse, aOption)
    {
        alert("failed");
    },

    onFinishButtonClicked: function(aButton, aEventObject)
    {
        if (this.verifyWizardReportIsExecutable())
        {
            if (this.beforeSubmit())
            {
                RequestUtil.request({
                    url: ServerEnvironment.contextPath + "/secure/actions/reportWizard.do",
                    success: this.onFinishButtonSuccess.createDelegate(this),
                    failure: this.onFinishButtonFailure.createDelegate(this),
                    params: {
                        wizardXml: wizardReport.toXml(),
                        viewGesture: 'finish',
                        wizardStep: 'columnSelection'
                    }
                });
            }
        }
    },

    onFinishButtonSuccess: function(aResponse, aOption)
    {
        window.close();
    },

    onFinishButtonFailure: function(aResponse, aOption)
    {
        alert("failed");
    },

    setServerInfoMessage: function(aMessage)
    {
        FadeMessageController.getInstance().showFadeMessage(aMessage, 3000);
    },

    onRunSuccess: function(aResponse, aOption)
    {
        eval(aResponse.responseText);
    },

    onRunFailure: function(aResponse, aOption)
    {
        Ext.Msg.show({
            title: applicationResources.getProperty('reportWizard.validation.title'),
            msg: applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", aResponse.responseText),
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
        });
    },

    onRunButtonClicked: function(aButton, aEventObject)
    {
        if (this.beforeSubmit())
        {

            if (this.verifyWizardReportIsExecutable())
            {
                RequestUtil.request({
                    url: ServerEnvironment.contextPath + "/secure/actions/reportWizard.do",
                    success: this.onRunSuccess.createDelegate(this),
                    failure: this.onRunFailure.createDelegate(this),
                    params: {
                        wizardXml: wizardReport.toXml(),
                        viewGesture: 'run',
                        wizardStep: 'columnSelection'
                    }
                });

            }
        }
    },

    onListReportSelected: function()
    {
        this.updateColumnTypesBasedOnReportType();
    },

    onCrosstabReportSelected: function()
    {
        this.updateColumnTypesBasedOnReportType();
    },

    /**
     * there are times when we need to reset column types based on the report type (e.g.
     * converting from a list report -> crosstab report resets GENERIC column types as
     * MEASURE column types).
     */
    updateColumnTypesBasedOnReportType: function()
    {
        var fromType = wizardReport.reportType == 'CROSSTAB' ? ReportColumnTypeEnum.GENERIC : ReportColumnTypeEnum.MEASURE;
        var toType = wizardReport.reportType == 'CROSSTAB' ? ReportColumnTypeEnum.MEASURE : ReportColumnTypeEnum.GENERIC;

        for (var i = 0; i < wizardReport.columns.length; i++)
        {
            if (wizardReport.columns[i].columnType == fromType)
            {
                wizardReport.columns[i].columnType = toType;
            }
        }
    },

    onGetReportWizardFrameworkModels: function(aResponse, aOption)
    {
        var response = Ext.decode(aResponse.responseText);
        this.reportTypePanel.initFrameworkModelList(response);
    },

    onGetReportWizardSaveToFolders: function(aResponse, aOption)
    {
        var response = Ext.decode(aResponse.responseText);
        this.reportTypePanel.initSaveToFoldersList(response);
    }
};

var wizard = {};

/**=====================================================================================================================
 * List Report Column Editor
 *
 *
 *
 * =====================================================================================================================
 */
wizard.ListReportColumnEditor = Ext.extend(Ext.Window, {
    constructor: function(config, aColumn)
    {
        this.addEvents({
            "onOkButtonClicked" : true,
            "onCancelButtonClicked" : true
        });

        this.columnName = new Ext.form.TextField({
            xtype: 'textfield',
            fieldLabel: applicationResources.getProperty('reportWizard.columnSelection.columnSource'),
            disabled:true
        });

        this.displayName = new Ext.form.TextField({
            xtype: 'textfield',
            fieldLabel: applicationResources.getProperty('reportWizard.columnSelection.columnLabel')
        });

        // todo: make a sort directive for the wizard.
        this.columnSort = new Ext.form.ComboBox({
            xtype: 'combo',
            fieldLabel: applicationResources.getProperty('reportWizard.columnSelection.sort'),
            mode: 'local',
            store: [
                [SortDirective.Ascending, applicationResources.getProperty("reportWizard.columnSelection.ascending")],
                [SortDirective.Descending, applicationResources.getProperty("reportWizard.columnSelection.descending")],
                [applicationResources.getProperty('aggregateFunctionEnum.none'), applicationResources.getProperty('aggregateFunctionEnum.none')]
            ],
            triggerAction: 'all'
        });

        this.groupColumn = new Ext.form.Checkbox({
            xtype: 'checkbox',
            fieldLabel: applicationResources.getProperty('reportWizard.columnSelection.group'),
            boxLabel: 'Yes'
        });

        this.suppressColumn = new Ext.form.Checkbox({
            xtype: 'checkbox',
            fieldLabel: applicationResources.getProperty('reportWizard.columnSelection.suppress'),
            boxLabel: 'Yes'
        });

        this.columnAggregate = new Ext.form.ComboBox({
            xtype: 'combo',
            fieldLabel: applicationResources.getProperty('reportWizard.columnSelection.summaryFunction'),
            mode: 'local',
            store: this.getAvailableAggregates(aColumn),
            triggerAction: 'all'
        });

        this.okButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.columnSelection.editor.ok')
        });

        this.cancelButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.columnSelection.editor.cancel')
        });

        config = Ext.apply({
            layout: 'form',
            title: applicationResources.getProperty('reportWizard.columnSelection.editor.title'),
            modal: true,
            height: 250,
            width: 360,
            bodyStyle: 'padding:10px',
            items: [
                this.columnName,
                this.displayName,
                this.columnSort,
                this.groupColumn,
                this.suppressColumn,
                this.columnAggregate
            ],

            buttons: [
                this.okButton,
                this.cancelButton
            ]
        }, config);

        wizard.ListReportColumnEditor.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.okButton.on('click', this.okButtonClick, this);
        this.cancelButton.on('click', this.cancelButtonClick, this);
    },

    setColumnName: function(aName)
    {
        this.columnName.setValue(aName);
    },

    setDisplayName: function(aName)
    {
        this.displayName.setValue(aName);
    },

    setColumnSort: function(aSort)
    {
        this.columnSort.setValue(aSort);
    },

    setGroupColumn: function(aIndicator)
    {
        this.groupColumn.setValue(aIndicator);
    },

    setSuppressColumn: function(aIndicator)
    {
        this.suppressColumn.setValue(aIndicator)
    },

   getAvailableAggregates : function (aColumn)
   {
      var aggregates = [
         AggregateFunctionEnum.COUNT,
         AggregateFunctionEnum.TOTAL,
         AggregateFunctionEnum.AVERAGE,
         AggregateFunctionEnum.NONE
      ];

      var validAggregates = [];

      for (var j = 0; j < aggregates.length; j++)
      {
         var aggregateFunction = aggregates[j];
         if (aggregateFunction.isAllowedOn(aColumn))
         {
            validAggregates.push([aggregateFunction.value, aggregateFunction == AggregateFunctionEnum.NONE ? applicationResources.getProperty('aggregateFunctionEnum.none') : aggregateFunction.getDisplayText()]);
         }
      }

      return validAggregates;
   },

   resetAvailableAggregates : function (aColumn)
   {
      var validAggregates = this.getAvailableAggregates(aColumn);
      this.columnAggregate.store.loadData(validAggregates);
   },

    setColumnAggregate: function(aAggregate)
    {
        this.columnAggregate.setValue(aAggregate);
    },

    okButtonClick: function(aButton, aEventObject)
    {
        var data = {
            name: this.columnName.getValue(),
            displayName: this.displayName.getValue(),
            sort: (this.columnSort.getValue() != 'none') ? this.columnSort.getValue() : null,
            group: this.groupColumn.getValue(),
            suppress: this.suppressColumn.getValue(),
            aggregateFunction: this.columnAggregate.getValue()
        };
        this.fireEvent('onOkButtonClicked', data);
        this.close();
    },

    cancelButtonClick: function(aButton, aEventObject)
    {
        this.fireEvent('onCancelButtonClicked');
        this.close();
    }
});


/**
 *
 * @param aCol
 * @param aResultCallback
 */
function showEditColumnDialog(aCol, aResultCallback)
{
    var myWindow = new wizard.ListReportColumnEditor({}, aCol.rawColumnData);
    myWindow.setColumnName(aCol.name);
    myWindow.setDisplayName(aCol.displayName);
    myWindow.setColumnSort(aCol.sort);
    myWindow.setGroupColumn(aCol.group);
    myWindow.setSuppressColumn(aCol.suppress);
    myWindow.resetAvailableAggregates(aCol.rawColumnData);
    myWindow.setColumnAggregate(aCol.aggregateFunction);
    myWindow.on('onOkButtonClicked', aResultCallback);
    myWindow.show();
}

function editColumnTestFunction(aData)
{
    var msg = 'name=[' + aData.name + ']\n' +
            'displayName=[' + aData.displayName + ']\n' +
            'sort=[' + aData.sort + ']\n' +
            'group=[' + aData.group + ']\n' +
            'suppress=[' + aData.suppress + ']\n' +
            'aggregateFunction=[' + aData.aggregateFunction + ']';
    alert(msg);
}

/**
 *
 * @param aData
 * @param aResultCallback
 */
function showExpressionEditorDialog(aData, aResultCallback, aPropertySet)
{
    var editor = new Adf.ExpressionEditor(
    {
        columns: wizardReport.columns,
        packagePath: wizardReport.packagePath,
        propertySet : aPropertySet
    });

    editor.setExpression(aData.expression);

    editor.on('onOkButtonClicked', aResultCallback);
    editor.show();
}

function editExpressionTestCallback(aData)
{
    var msg = 'expressionName=[' + aData.expressionName + ']\n' +
            'expression=[' + aData.expression + ']';
    alert(msg);
}


/**=====================================================================================================================
 * Calculation/Filter Expression Grid
 *
 *
 *
 * =====================================================================================================================
 */
wizard.ExpressionGrid = Ext.extend(Ext.grid.GridPanel, {

    constructor: function(config)
    {

        this.addEvents({
            'expressionCreated': true,
            'expressionChanged': true,
            'expressionDeleted': true
        });


        this.createButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.add')
        });

        this.editButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.edit')
        });

        this.deleteButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.delete')
        });

        this.customData = [];
        this.nameField = 'expressionName';
        this.expressionField = 'expression';

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            title: 'Expressions',

            tbar: [
                this.createButton,
                this.editButton,
                this.deleteButton
            ],

            store: new Ext.data.JsonStore({
                autoDestroy: true,
                root: 'expressions',
                idProperty: 'id',
                fields: [
                    {
                        name: 'expressionName'
                    },
                    {
                        name: 'expression'
                    }
                ]
            }),

            colModel: new Ext.grid.ColumnModel({
                columns: [
                    { dataIndex: 'expressionName', header: applicationResources.getProperty('reportWizard.expressionGrid.name'), width: 160 },
                    { dataIndex: 'expression', header: applicationResources.getProperty('reportWizard.expressionGrid.expression'), width: 160 }
                ]
            }),

            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            })

        }, config);

//      wizard.ColumnSelectionGrid.superclass.initComponent.call(this, config);
        wizard.ExpressionGrid.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.createButton.on('click', this.onCreateButtonClicked, this);
        this.editButton.on('click', this.onEditButtonClicked, this);
        this.deleteButton.on('click', this.onDeleteButtonClicked, this);
    },

    onCreateButtonClicked: function(aButton, aEventObject)
    {
        var data = {
            expression: ''
        };
        var ps = new PropertySet();
        ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.name"), '', PropertyTypes.string));

        showExpressionEditorDialog(data, this.onExpressionCreated.createDelegate(this), ps);
    },

    onEditButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRow = this.getSelectionModel().getSelected();

            var data = {
                expressionName: selectedRow.get('expressionName'),
                expression: selectedRow.get('expression')
            };

            alert('data.expressionName=' + data.expressionName);
            var ps = new PropertySet();
            ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.name"), selectedRow.get('expressionName'), PropertyTypes.string));

            showExpressionEditorDialog(data, this.onExpressionChanged.createDelegate(this), ps);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    onDeleteButtonClicked: function(aButton, aEventObject)
    {
//      var grid = Ext.getCmp('grdCurrentColumnSelections');
        if (this.getSelectionModel().hasSelection())
        {
            Ext.Msg.confirm(applicationResources.getProperty('reportWizard.msg.deletionConfirmation.title'),
                    applicationResources.getProperty('reportWizard.msg.deletionConfirmation'),
                    function(aButtonId)
                    {
                        if (aButtonId == 'yes')
                        {
//               var grid = Ext.getCmp('grdCurrentColumnSelections');
                            var selectedRow = this.getSelectionModel().getSelected();
                            var idx = this.getStore().indexOf(selectedRow);
                            var count = this.getStore().getCount();

                            this.getStore().remove(selectedRow);
                            count--;
                            if (count > 0)
                            {
                                this.getSelectionModel().selectRow((idx < count) ? idx : idx - 1)
                            }
                        }
                    }, this);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },


    createCustomDataObject: function(aExpressionData)
    {
        return aExpressionData;
    },

    updateCustomDataObject: function(aCustomData, aExpressionData)
    {
        Ext.apply(aCustomData, aExpressionData);
    },

    onExpressionCreated: function(aData)
    {
        var gridStore = this.getStore();
        var modifiedData = {};
        var propSet = aData.propertySet;

        modifiedData['expressionName'] = propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value;
        modifiedData['expression'] = aData.expression;

        var record = new gridStore.recordType(modifiedData);
        this.getStore().add(record);
        if (!this.getSelectionModel().hasSelection())
        {
            this.getSelectionModel().selectFirstRow();
        }
        this.fireEvent('expressionCreated', aData);
    },

    onExpressionChanged: function(aData)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRow = this.getSelectionModel().getSelected();
            var idx = this.getStore().indexOf(selectedRow);
            this.updateCustomDataObject(this.customData[idx], aData);
            var propSet = aData.propertySet;

            selectedRow.set('expressionName', propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value);
            selectedRow.set('expression', aData.expression);
        }
    }
});


/**=====================================================================================================================
 * Calculation Grid
 *
 *
 *
 * =====================================================================================================================
 */
wizard.CalculationGrid = Ext.extend(Ext.grid.GridPanel, {

    constructor: function(config)
    {

        this.addEvents({
            'expressionCreated': true,
            'expressionChanged': true,
            'expressionDeleted': true
        });


        this.createButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.add')
        });

        this.editButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.edit')
        });

        this.deleteButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.delete')
        });

        this.newCalcFieldCount = 0;

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            title: applicationResources.getProperty('reportWizard.calculatedFields.stageTitle'),
            autoExpandColumn: 'name',
            tbar: [
                this.createButton, '-',
                this.editButton, '-',
                this.deleteButton
            ],

            store: new Ext.data.JsonStore({
                autoDestroy: true,
                root: 'columns',
                fields: [
                    {
                        name: 'name'
                    },
                    {
                        name: 'expression'
                    }
                ]
            }),

            colModel: new Ext.grid.ColumnModel({
                columns: [
                    {
                        id: 'name',
                        dataIndex: 'name',
                        header: applicationResources.getProperty('reportWizard.calculatedFields.columnName'),
                        width: 160
                    },
                    {
                        id       : 'expression',
                        dataIndex: 'expression',
                        header: applicationResources.getProperty('reportWizard.calculatedFields.columnExpression'),
                        width: 160
                    }
                ]
            }),

            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            }),
            autoExpandColumn : 'expression'


        }, config);

        wizard.CalculationGrid.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.createButton.on('click', this.onCreateButtonClicked, this);
        this.editButton.on('click', this.onEditButtonClicked, this);
        this.deleteButton.on('click', this.onDeleteButtonClicked, this);
    },

    onCreateButtonClicked: function(aButton, aEventObject)
    {
        this.newCalcFieldCount++;
        var defaultName = this.newCalcFieldCount == 1 ? applicationResources.getProperty("reportWizard.calculatedFields.defaultCalculationName") : applicationResources.getProperty("reportWizard.calculatedFields.defaultCalculationName") + " " + this.newCalcFieldCount;

        var data = {
            expression: ''
        };

        var ps = new PropertySet();
        ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.name"), defaultName, PropertyTypes.string));

        showExpressionEditorDialog(data, this.onExpressionCreated.createDelegate(this), ps);
    },


    onExpressionCreated: function(aData)
    {
        // Add the calculation column to the data model.
        var dataType = "decimal"; // TODO: ok...??? Not sure still works if dataType = "varchar"
        var columnType = wizardReport.reportType == 'CROSSTAB' ? ReportColumnTypeEnum.MEASURE : ReportColumnTypeEnum.GENERIC;
        var propSet = aData.propertySet;

        var calculationColumn = new ReportColumn(
                propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value,
                dataType,
                RegularAggregateEnum.AUTOMATIC.reportSpecValue,
                columnType,
                "",
                AggregateFunctionEnum.NONE,
                true,
                null,
                null,
                false,
                false);
        calculationColumn.expression = aData.expression;
        wizardReport.columns.push(calculationColumn);

        // Add the calculated column to the grid.
        this.getStore().loadData({columns: [calculationColumn]}, true);
        if (!this.getSelectionModel().hasSelection())
        {
            this.getSelectionModel().selectFirstRow();
        }
    },


    onEditButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRow = this.getSelectionModel().getSelected();

            var data = {
                expression: selectedRow.get('expression')
            };

            var ps = new PropertySet();
            ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.name"), selectedRow.get('name'), PropertyTypes.string));

            showExpressionEditorDialog(data, this.onExpressionChanged.createDelegate(this), ps);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    onExpressionChanged: function(aData)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRow = this.getSelectionModel().getSelected();
            var propSet = aData.propertySet;

            // Update the wizard report data model.
            var calculatedColumn = selectedRow.json;
            calculatedColumn.name = propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value;
            calculatedColumn.expression = aData.expression;

            // Update the calculation grid.
            selectedRow.beginEdit();
            selectedRow.set('name', propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value);
            selectedRow.set('expression', aData.expression);
            selectedRow.endEdit();
            selectedRow.commit();
        }
    },

    onDeleteButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            Ext.Msg.confirm(applicationResources.getProperty('reportWizard.msg.deletionConfirmation.title'),
                    applicationResources.getProperty('reportWizard.msg.deletionConfirmation'),
                    function(aButtonId)
                    {
                        if (aButtonId == 'yes')
                        {
                            var selectedRow = this.getSelectionModel().getSelected();

                            var calculatedColumn = selectedRow.json;
                            wizardReport.columns.remove(calculatedColumn);

                            var idx = this.getStore().indexOf(selectedRow);
                            var count = this.getStore().getCount();
                            this.getStore().remove(selectedRow);
                            count--;
                            if (count > 0)
                            {
                                this.getSelectionModel().selectRow((idx < count) ? idx : idx - 1)
                            }
                        }
                    }, this);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },


    addNewCalculatedColumn: function()
    {
        this.newCalcFieldCount++;
        var defaultName = this.newCalcFieldCount == 1 ? applicationResources.getProperty("reportWizard.calculatedFields.defaultCalculationName") : applicationResources.getProperty("reportWizard.calculatedFields.defaultCalculationName") + " " + this.newCalcFieldCount;

        var dataType = "decimal"; // TODO: ok...??? Not sure still works if dataType = "varchar"
        var columnType = wizardReport.reportType == 'CROSSTAB' ? ReportColumnTypeEnum.MEASURE : ReportColumnTypeEnum.GENERIC;
        var calculationColumn = new ReportColumn(defaultName, dataType, RegularAggregateEnum.AUTOMATIC.reportSpecValue, columnType, "", AggregateFunctionEnum.NONE, true, null, null, false, false);
//      alert(calculationColumn.columnType);
        wizardReport.columns.push(calculationColumn);
    },

    validateInput: function(aName, aExpression)
    {
//      if (aName == null || JsUtil.trim(aName).length == 0)
//      {
//         alert(applicationResources.getProperty("reportWizard.errMsg.fieldMustBeNonZeroLength"));
//         return false;
//      }
//
//      if (aExpression == null || JsUtil.trim(aExpression).length == 0)
//      {
//         alert(applicationResources.getProperty("reportWizard.errMsg.fieldMustBeNonZeroLength"));
//         return false;
//      }
//
//      if (aName != this.activeCalculation.name && (wizardReport.getColumnByName(aName) != null || this.getCalculatedColumnByName(aName) != null))
//      {
//         var params = new Array(1);
//         params[0]=aName;
//         alert(applicationResources.getPropertyWithParameters('reportWizard.errMsg.columnNameAlreadyExists',params));
//
//         return false;
//      }
        return true;
    },


    loadData: function(aWizardReport)
    {
        this.getStore().loadData(aWizardReport);

        // Show only custom calculation columns.
        this.getStore().filterBy(function(aRecord, aId)
        {
            var column = aRecord.json;
//         alert(column.name + column.isCalculated);
            return column.isCalculated;
        });

    }
});


/**=====================================================================================================================
 * Filter Grid
 *
 *
 *
 * =====================================================================================================================
 */
wizard.FiltersGrid = Ext.extend(Ext.grid.GridPanel, {

    constructor: function(config)
    {

        this.addEvents({
            'expressionCreated': true,
            'expressionChanged': true,
            'expressionDeleted': true
        });


        this.createButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.add')
        });

        this.editButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.edit')
        });

        this.deleteButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.delete')
        });

        this.newFilterCount = 0;

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            title: applicationResources.getProperty("reportWizard.filters.stageTitle"),

            tbar: [
                this.createButton, '-',
                this.editButton, '-',
                this.deleteButton
            ],
            autoExpandColumn : 'filterExpression',
            store: new Ext.data.JsonStore({
                autoDestroy: true,
                root: 'filters',
                fields: [
                    {
                        name: 'name'
                    },
                    {
                        name: 'expression'
                    }
                ]
            }),
            colModel: new Ext.grid.ColumnModel({
                columns: [
                    {
                        dataIndex: 'name',
                        header: applicationResources.getProperty('reportWizard.filters.filterName'),
                        width: 160
                    },
                    {
                        id : 'filterExpression',
                        dataIndex: 'expression',
                        header: applicationResources.getProperty('reportWizard.filters.filterExpression'),
                        width: 160
                    }
                ]
            }),

            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            })

        }, config);

        wizard.FiltersGrid.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.createButton.on('click', this.onCreateButtonClicked, this);
        this.editButton.on('click', this.onEditButtonClicked, this);
        this.deleteButton.on('click', this.onDeleteButtonClicked, this);
    },

    onCreateButtonClicked: function(aButton, aEventObject)
    {
        this.newFilterCount++;
        var defaultName = this.newFilterCount == 1 ? applicationResources.getProperty("reportWizard.filters.newFilter") : applicationResources.getProperty("reportWizard.filters.newFilter") + " " + this.newFilterCount;

        var data = {
            expression: ''
        };

        var ps = new PropertySet();
        ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.name"), defaultName, PropertyTypes.string));

        showExpressionEditorDialog(data, this.onExpressionCreated.createDelegate(this), ps);
    },


    onExpressionCreated: function(aData)
    {

        /* TODO determine which kind of filter should be used.
         detailed (required) are applied before query
         summary (optional) are applied after query

         within Cognos Report Studio
         detailed - can be from the source ,data items, or the query
         summary  - can be from the data items or the query not the source
         */

        // Add the filter to the data model.
        var propSet = aData.propertySet;

        var filter;
        if (wizardReport.reportType == "CROSSTAB")
        {
            filter = new ReportFilter(propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value, aData.expression, FilterUsageEnum.REQUIRED, "REQUIRED");
        }
        else if (wizardReport.reportType == "LIST")
        {
            filter = new ReportFilter(propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value, aData.expression, FilterUsageEnum.REQUIRED, "OPTIONAL");
        }
        wizardReport.filters.push(filter);


        // Add the calculated column to the grid.
        this.getStore().loadData({filters: [filter]}, true);
        if (!this.getSelectionModel().hasSelection())
        {
            this.getSelectionModel().selectFirstRow();
        }

//      this.fireEvent('expressionCreated', aData);
    },


    onEditButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRow = this.getSelectionModel().getSelected();

            var data = {
                expression: selectedRow.get('expression')
            };

            var ps = new PropertySet();
            ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.name"), selectedRow.get('name'), PropertyTypes.string));
            showExpressionEditorDialog(data, this.onExpressionChanged.createDelegate(this), ps);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    onExpressionChanged: function(aData)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRow = this.getSelectionModel().getSelected();
            var propSet = aData.propertySet;

            // Update the wizard report data model.
            var filter = selectedRow.json;
            filter.name = propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value;
            filter.expression = aData.expression;

            // Update the calculation grid.
            selectedRow.beginEdit();
            selectedRow.set('name', propSet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value);
            selectedRow.set('expression', aData.expression);
            selectedRow.endEdit();
            selectedRow.commit();
        }
    },

    onDeleteButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            Ext.Msg.confirm(applicationResources.getProperty('reportWizard.msg.deletionConfirmation.title'),
                    applicationResources.getProperty('reportWizard.msg.deletionConfirmation'),
                    function(aButtonId)
                    {
                        if (aButtonId == 'yes')
                        {
                            var selectedRow = this.getSelectionModel().getSelected();

                            var filter = selectedRow.json;
                            wizardReport.filters.remove(filter);

                            var idx = this.getStore().indexOf(selectedRow);
                            var count = this.getStore().getCount();
                            this.getStore().remove(selectedRow);
                            count--;
                            if (count > 0)
                            {
                                this.getSelectionModel().selectRow((idx < count) ? idx : idx - 1)
                            }
                        }
                    }, this);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    validateInput: function(aName, aExpression)
    {
//      if (aName == null || JsUtil.trim(aName).length == 0)
//      {
//         alert(applicationResources.getProperty("reportWizard.errMsg.nameFieldMustBeNonZeroLength"));
//         return false;
//      }
//
//      if (aExpression == null || JsUtil.trim(aExpression).length == 0)
//      {
//         alert(applicationResources.getProperty("reportWizard.errMsg.nameFieldMustBeNonZeroLength"));
//         return false;
//      }
//
//      if (aName != this.activeFilter.name && wizardReport.getFilterByName(aName) != null)
//      {
//         alert(applicationResources.getPropertyWithParameters("reportWizard.errMsg.filterNameAlreadyExists", new Array(aName)));
//         return false;
//      }
        return true;
    },


    loadData: function(aWizardReport)
    {
        this.getStore().loadData(aWizardReport);
    }
});


/**=====================================================================================================================
 * List Report Column Grid
 *
 *
 *
 * =====================================================================================================================
 */
wizard.ListReportGrid = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(config)
    {

        this.addEvents({
            'columnCreated': true,
            'columnChanged': true,
            'columnsDeleted': true
        });

        this.editButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.edit')
        });

        this.deleteButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.delete')
        });


        this.ascendingSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.ascending')
        });

        this.descendingSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.descending')
        });

        this.removeSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.none')
        });


        this.groupButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.columnSelection.group')
        });

        this.suppressButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.columnSelection.suppress')
        });


        this.countButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.columnSelection.count')
        });

        this.totalButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.columnSelection.total')
        });

        this.averageButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.columnSelection.average')
        });

        this.removeAggregationButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.none')
        });

        this.moveUpButton = new Ext.Button({
            text:  applicationResources.getProperty('reportWizard.button.moveUp')
        });

        this.moveDownButton = new Ext.Button({
            text:  applicationResources.getProperty('reportWizard.button.moveDown')
        });

        this.moveTopButton = new Ext.Button({
            text:  applicationResources.getProperty('reportWizard.button.moveTop')
        });

        this.moveBottomButton = new Ext.Button({
            text:  applicationResources.getProperty('reportWizard.button.moveBottom')
        });

        this.groupColumn = new Ext.ux.grid.CheckColumn({
            dataIndex: 'groupDirective',
            header: applicationResources.getProperty('reportWizard.columnSelection.group'),
            width: 80,
            onMouseDown : function(e, t)
            {
                if (Ext.fly(t).hasClass(this.createId()))
                {
                    e.stopEvent();

                    var idx = this.grid.getView().findRowIndex(t);
                    var selectedRecord = this.grid.store.getAt(idx);

                    var column = wizardReport.columns[idx];

                    if (column.groupDirective)
                    {
                        column.groupDirective = null;
                    }
                    else
                    {
                        column.groupDirective = new GroupDirective(0);
                    }

                    selectedRecord.beginEdit();
                    selectedRecord.set('groupDirective', column.groupDirective);
                    selectedRecord.endEdit();
                    selectedRecord.commit();
                }
            },
            renderer: function(value, metaData, record, rowIndex, colIndex, store)
            {
                if (value)
                {
                    return Ext.ux.grid.CheckColumn.prototype.renderer.createDelegate(this)(true, metaData, record);
                }
                else
                {
                    return Ext.ux.grid.CheckColumn.prototype.renderer.createDelegate(this)(false, metaData, record);
                }
            }
        });

        this.suppressColumn = new Ext.ux.grid.CheckColumn({
            dataIndex: 'isSuppressed',
            header: applicationResources.getProperty('reportWizard.columnSelection.suppress'),
            width: 80,
            onMouseDown : function(e, t)
            {
                if (Ext.fly(t).hasClass(this.createId()))
                {
                    e.stopEvent();
                    var index = this.grid.getView().findRowIndex(t);
                    var selectedRecord = this.grid.store.getAt(index);

                    var column = wizardReport.columns[index];

                    if (column.isSuppressed)
                    {
                        column.isSuppressed = false;
                        column.isHidden = false;
                    }
                    else
                    {
                        column.isSuppressed = true;
                        column.isHidden = true;
                    }

                    selectedRecord.beginEdit();
                    selectedRecord.set('isSuppressed', column.isSuppressed);
                    selectedRecord.endEdit();
                    selectedRecord.commit();

                }
            },
            renderer: function(value, metaData, record, rowIndex, colIndex, store)
            {
                if (value)
                {
                    return Ext.ux.grid.CheckColumn.prototype.renderer.createDelegate(this)(true, metaData, record);
                }
                else
                {
                    return Ext.ux.grid.CheckColumn.prototype.renderer.createDelegate(this)(false, metaData, record);
                }
            }
        });

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            title: applicationResources.getProperty('reportWizard.columnSelection.currentSelection'),
            autoExpandColumn: 'name',
            store: new Ext.data.JsonStore({
                autoDestroy: true,
                root: 'columns',
//            idProperty: 'id',
                fields: [
                    {
                        name: 'queryItemName'
                    },
                    {
                        name: 'name'
                    },
                    {
                        name: 'sortDirective'
                    },
                    {
                        name: 'groupDirective'
                    },
                    {
                        name: 'isSuppressed'
                    },
                    {
                        name: 'summaryFunction'
                    }
                ]
            }),

            colModel: new Ext.grid.ColumnModel({
                columns: [
                    { dataIndex: 'queryItemName', header: applicationResources.getProperty('reportWizard.columnSelection.columnSource'), width: 160 },
                    { id: 'name', dataIndex: 'name', header: applicationResources.getProperty('reportWizard.columnSelection.columnLabel'), width: 160 },
                    {
                        dataIndex: 'sortDirective',
                        header: applicationResources.getProperty('reportWizard.columnSelection.sort'),
                        width: 80,
                        renderer: function(value, metaData, record, rowIndex, colIndex, store)
                        {
                            if (value)
                            {
                                return value.getDisplayText();
                            }
                            else
                            {
                                return '';
                            }
                        }
                    },
                    this.groupColumn,
                    this.suppressColumn,
                    {
                        dataIndex: 'summaryFunction',
                        header: applicationResources.getProperty('reportWizard.columnSelection.summaryFunction'),
                        width: 100,
                        renderer: function(value, metaData, record, rowIndex, colIndex, store)
                        {
                            if (value)
                            {
                                return value.getDisplayText();
                            }
                            else
                            {
                                return '';
                            }
                        }
                    }
                ]
            }),

            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            }),

            tbar: [
                this.editButton, '-',
                this.deleteButton, '-',
                {
                    text: applicationResources.getProperty('reportWizard.columnSelection.sort'),
                    menu: {
                        items: [
                            this.ascendingSortButton,
                            this.descendingSortButton,
                            this.removeSortButton
                        ]
                    }
                }, '-',
                this.groupButton, '-',
                this.suppressButton, '-',
                {
                    text: applicationResources.getProperty('reportWizard.columnSelection.summaryFunction'),
                    menu: {
                        items: [
                            this.countButton,
                            this.totalButton,
                            this.averageButton,
                            this.removeAggregationButton
                        ]
                    }
                },
                '-',
                this.moveUpButton, '-',
                this.moveDownButton,
                '-',
                this.moveTopButton, '-',
                this.moveBottomButton
            ]
        }, config);

        wizard.ListReportGrid.superclass.constructor.call(this, config);

        // Initialize the mouse click processing on grid check boxes.
        this.groupColumn.init(this);
        this.suppressColumn.init(this);

        this.editButton.on('click', this.onEditButtonClicked, this);
        this.deleteButton.on('click', this.onDeleteButtonClicked, this);

        this.moveUpButton.on('click', this.onMoveUpButtonClicked, this);
        this.moveDownButton.on('click', this.onMoveDownButtonClicked, this);
        this.moveTopButton.on('click', this.onMoveTopButtonClicked, this);
        this.moveBottomButton.on('click', this.onMoveBottomButtonClicked, this);

        this.suppressButton.on('click', this.onSuppressButtonClicked, this);
        this.groupButton.on('click', this.onGroupButtonClicked, this);
        this.ascendingSortButton.on('click', this.onAscendingSortButtonClicked, this);
        this.descendingSortButton.on('click', this.onDescendingSortButtonClicked, this);
        this.removeSortButton.on('click', this.onRemoveSortButtonClicked, this);
        this.countButton.on('click', this.onCountButtonClicked, this);
        this.totalButton.on('click', this.onTotalButtonClicked, this);
        this.averageButton.on('click', this.onAverageButtonClicked, this);
        this.removeAggregationButton.on('click', this.onRemoveAggregationButtonClicked, this);
    },

    setColumnAggregateFunction: function(aAggregateFunction)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = wizardReport.columns[idx];

                if (aAggregateFunction.isAllowedOn(column))
                {
                    column.summaryFunction = aAggregateFunction;
                }
                else
                {
                    alert(applicationResources.getPropertyWithParameters("reportWizard.errMsg.cantBeAppliedToType", new Array(aAggregateFunction.name, column.dataType)))
                }

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('summaryFunction', column.summaryFunction);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();

            }
        }
    },

    onCountButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnAggregateFunction(AggregateFunctionEnum.COUNT);
    },

    onTotalButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnAggregateFunction(AggregateFunctionEnum.TOTAL);
    },

    onAverageButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnAggregateFunction(AggregateFunctionEnum.AVERAGE);
    },

    onRemoveAggregationButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnAggregateFunction(AggregateFunctionEnum.NONE);
    },

    setColumnSort: function(aSortDirection)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = wizardReport.columns[idx];


                if (column.sortDirective == null)
                {
                    column.sortDirective = new SortDirective(null, 0);
                }
                column.sortDirective.direction = aSortDirection;

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('sortDirective', column.sortDirective);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();
            }
        }
    },

    onAscendingSortButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnSort(SortDirective.Ascending);
    },

    onDescendingSortButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnSort(SortDirective.Descending);
    },

    onRemoveSortButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = wizardReport.columns[idx];


                column.sortDirective = null;

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('sortDirective', column.sortDirective);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();
            }
        }
    },

    setSelectedColumnsGrouped: function()
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = wizardReport.columns[idx];

                column.groupDirective = new GroupDirective(0);

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('groupDirective', column.groupDirective);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();

            }
        }
    },

    removeGroupDirectiveFromSelectedColumns: function()
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = wizardReport.columns[idx];

                column.groupDirective = null;

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('groupDirective', column.groupDirective);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();

            }
        }
    },

    onGroupButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();
            if (selectedRecords.length > 0)
            {
                // Get the group directive of the first selected record. Based on the group directive of the first record
                // set all of the selected columns with the same value.
                var idx = this.getStore().indexOf(selectedRecords[0]);
                var column = wizardReport.columns[idx];
                if (column.groupDirective)
                {
                    this.removeGroupDirectiveFromSelectedColumns();
                }
                else
                {
                    this.setSelectedColumnsGrouped();
                }
            }
        }
    },


    onSuppressButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = wizardReport.columns[idx];

                if (column.isSuppressed)
                {
                    column.isSuppressed = false;
                    column.isHidden = false;
                }
                else
                {
                    column.isSuppressed = true;
                    column.isHidden = true;
                }

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('isSuppressed', column.isSuppressed);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();

            }
        }
    },

    // Test method to add a row to the grid.
    onCreateButtonClicked: function()
    {
        var now = new Date();
        var defaultName = 'Crn name' + now;
        var data = {
            name: defaultName,
            displayName: defaultName,
            sort: 'None',
            group: false,
            suppress: false,
            aggregateFunction: 'None'
        };

        showEditColumnDialog(data, this.onColumnCreated.createDelegate(this));
    },

    // This method displays an edit dialog containing the selected row in the grid.
    onEditButtonClicked: function()
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRow = this.getSelectionModel().getSelected();
            var column = selectedRow.json;
            var data = {
                name: column.queryItemName,
                displayName: column.name,
                sort: column.sortDirective ? column.sortDirective.direction : applicationResources.getProperty('aggregateFunctionEnum.none'),
                group: column.groupDirective ? true : false,
                suppress: column.isSuppressed,
                aggregateFunction: column.summaryFunction.value,
                //todo - Ideally we wouldn't go through this extra json conversion and just use the 'column' as the data. Leaving the implementation as is for now
                rawColumnData: column
            };

            showEditColumnDialog(data, this.onColumnChanged.createDelegate(this));
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    // This method removes the selected row from the grid.
    onDeleteButtonClicked: function()
    {
        if (this.getSelectionModel().hasSelection())
        {
            Ext.Msg.confirm(applicationResources.getProperty('reportWizard.msg.deletionConfirmation.title'),
                    applicationResources.getProperty('reportWizard.msg.deletionConfirmation'),
                    function(aButtonId)
                    {
                        if (aButtonId == 'yes')
                        {
                            var selectedRows = this.getSelectionModel().getSelections();
                            var idx = this.getStore().indexOf(selectedRows[0]);

                            var deletedColumns = wizardReport.columns.splice(idx, selectedRows.length);
                            this.getStore().remove(selectedRows);

                            var count = this.getStore().getCount();
                            if (count > 0)
                            {
                                this.getSelectionModel().selectRow((idx < count) ? idx : idx - 1)
                            }
                            this.fireEvent('columnsDeleted', deletedColumns);
                        }
                    }, this);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    // This method moves the selected row up.
    onMoveUpButtonClicked : function()
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRows = this.getSelectionModel().getSelections();
            var idx = this.getStore().indexOf(selectedRows[0]);

            // Validate the first selected row is not the first row in the grid.
            if (idx > 0)
            {
                var previousIdx = idx - 1;

                for (var i = 0; i < selectedRows.length; i++)
                {
                    var j = previousIdx + i;
                    var temp = wizardReport.columns[j];
                    wizardReport.columns[j] = wizardReport.columns[j + 1];
                    wizardReport.columns[j + 1] = temp;
                }

                this.getStore().remove(selectedRows);
                this.getStore().insert(previousIdx, selectedRows);
                this.getSelectionModel().selectRange(previousIdx, previousIdx + (selectedRows.length - 1));

            }
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    // This method moves a row down.
    onMoveDownButtonClicked: function()
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRows = this.getSelectionModel().getSelections();
            var idx = this.getStore().indexOf(selectedRows[0]);
            var lastIdx = idx + (selectedRows.length - 1);
            var count = this.getStore().getCount();

            // Validate the selected rows can be moved down in the grid.
            if (lastIdx < (count - 1))
            {
                var previousIdx = idx - 1;

                for (var i = (lastIdx + 1); i > idx; i--)
                {
                    var temp = wizardReport.columns[i];
                    wizardReport.columns[i] = wizardReport.columns[i - 1];
                    wizardReport.columns[i - 1] = temp;
                }

                this.getStore().remove(selectedRows);
                count = this.getStore().getCount();
                var nextIdx = idx + 1;
                if (nextIdx <= (count - 1))
                {
                    this.getStore().insert(nextIdx, selectedRows);
                }
                else
                {
                    this.getStore().add(selectedRows);
                }
                this.getSelectionModel().selectRange(nextIdx, nextIdx + (selectedRows.length - 1));

            }
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    // This method moves the selected row to the top of the grid.
    onMoveTopButtonClicked: function()
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRows = this.getSelectionModel().getSelections();
            var idx = this.getStore().indexOf(selectedRows[0]);

            if (idx > 0)
            {
                var deletedRecords = wizardReport.columns.splice(idx, (selectedRows.length - 1));
                wizardReport.columns = deletedRecords.concat(wizardReport.columns);

                this.getStore().remove(selectedRows);
                this.getStore().insert(0, selectedRows);
                this.getSelectionModel().selectRange(0, (selectedRows.length - 1));
            }
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    onMoveBottomButtonClicked : function()
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRows = this.getSelectionModel().getSelections();
            var idx = this.getStore().indexOf(selectedRows[0]);
            var lastIdx = idx + (selectedRows.length - 1);
            var count = this.getStore().getCount();

            if (lastIdx < (count - 1))
            {
                var deletedRecords = wizardReport.columns.splice(idx, (selectedRows.length - 1));
                wizardReport.columns.push(deletedRecords);

                this.getStore().remove(selectedRows);
                this.getStore().add(selectedRows);
                this.getSelectionModel().selectRange((count - selectedRows.length), (count - 1));
            }
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    onColumnCreated: function(aData)
    {
        var gridStore = this.getStore();
        var record = new gridStore.recordType(aData);
        this.getStore().add(record);
        if (!this.getSelectionModel().hasSelection())
        {
            this.getSelectionModel().selectFirstRow();
        }
        this.fireEvent('columnCreated', aData);
    },

    onColumnChanged: function(aData)
    {
        var selectedRow = this.getSelectionModel().getSelected();

        var column = selectedRow.json;
//      column.queryItemName = data.name;
        column.name = aData.displayName;
        column.sortDirective = (aData.sort != null) ? new SortDirective(aData.sort, 0) : null;
        column.groupDirective = aData.group ? new GroupDirective(0) : null;
        column.isSuppressed = aData.suppress;
        switch (aData.aggregateFunction)
        {
            case AggregateFunctionEnum.NONE.value:
                column.summaryFunction = AggregateFunctionEnum.NONE;
                break;

            case AggregateFunctionEnum.COUNT.value:
                column.summaryFunction = AggregateFunctionEnum.COUNT;
                break;

            case AggregateFunctionEnum.TOTAL.value:
                column.summaryFunction = AggregateFunctionEnum.TOTAL;
                break;

            case AggregateFunctionEnum.AVERAGE.value:
                column.summaryFunction = AggregateFunctionEnum.AVERAGE;
                break;
        }

        selectedRow.beginEdit();
//      selectedRow.set('queryItemName', column.queryItemName);
        selectedRow.set('name', column.name);
        selectedRow.set('sortDirective', column.sortDirective);
        selectedRow.set('groupDirective', column.groupDirective);
        selectedRow.set('isSuppressed', column.isSuppressed);
        selectedRow.set('summaryFunction', column.summaryFunction);
        selectedRow.endEdit();
        selectedRow.commit();

        this.fireEvent('columnChanged', column);
    },

    loadData: function(aData)
    {
        this.getStore().loadData(aData);
    }

});


/**=====================================================================================================================
 * Report Type Panel.
 *
 *
 *
 * =====================================================================================================================
 */
wizard.ReportTypePanel = Ext.extend(Ext.Panel, {
    constructor: function(config)
    {

        this.addEvents({
            'listReportSelected': true,
            'crosstabReportSelected': true
        });

        this.reportName = new Ext.form.TextField({
            fieldLabel: applicationResources.getProperty('reportWizard.selectType.reportName'),
            width: 300
        });

        this.package = new Ext.form.ComboBox({
            fieldLabel: applicationResources.getProperty('reportWizard.selectType.model'),
            mode: 'local',
            store: new Ext.data.JsonStore({
                autoDestroy: true,
                root: 'frameworkModels',
                fields: [
                    {
                        name: 'value'
                    },
                    {
                        name: 'name'
                    }
                ]
            }),

            valueField: 'value',
            displayField: 'name',
            emptyText: 'Please select a model...',
            triggerAction: 'all',
            width: 300
        });

        this.saveFolder = new Ext.form.ComboBox({
            fieldLabel: applicationResources.getProperty('reportWizard.selectType.saveToFolder'),
            mode: 'local',

            store: new Ext.data.JsonStore({
                autoDestroy: true,
                root: 'saveToFolders',
//            idProperty: 'id',
                fields: [
                    {
                        name: 'id'
                    },
                    {
                        name: 'path'
                    }
                ]
            }),

            valueField: 'id',
            displayField: 'path',

            emptyText: 'Please select a folder...',
            triggerAction: 'all',
            width: 300
        });

        this.listReportType = new Ext.form.Radio({
            boxLabel: applicationResources.getProperty('reportWizard.selectType.list'),
            name: 'reportType',
            value: 'LIST'
        });

        this.crosstabReportType = new Ext.form.Radio({
            boxLabel: applicationResources.getProperty('reportWizard.selectType.crosstab'),
            value: 'CROSSTAB',
            name: 'reportType'
        });

        this.portraitPageSetup = new Ext.form.Radio({
            boxLabel: applicationResources.getProperty('reportWizard.selectType.portrait'),
            name: 'pageSetup',
            value: 'PORTRAIT'
        });

        this.landscapePageSetup = new Ext.form.Radio({
            boxLabel: applicationResources.getProperty('reportWizard.selectType.landscape'),
            value: 'LANDSCAPE',
            name: 'pageSetup'
        });

        config = Ext.apply({
            title: applicationResources.getProperty('reportWizard.selectType.title'),
            layout: 'form',
            bodyStyle: 'padding:10px',
            items: [
                this.reportName,
                this.package,
                this.saveFolder,
                {
                    xtype: 'radiogroup',
                    fieldLabel: applicationResources.getProperty('reportWizard.selectType.reportType'),
                    width: 180,
                    vertical: false,
                    items: [
                        this.listReportType,
                        this.crosstabReportType
                    ]
                },{
                    xtype: 'radiogroup',
                    fieldLabel: applicationResources.getProperty('reportWizard.selectType.pageSetup'),
                    vertical: true,
                    width: 180,
                    items: [
                        this.portraitPageSetup,
                        this.landscapePageSetup
                    ]
                }]
        }, config);

        wizard.ReportTypePanel.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.reportName.on('blur', this.onReportNameBlur, this);
        this.package.on('select', this.onPackageSelected, this);
        this.saveFolder.on('select', this.onSaveFolderSelected, this);
        this.listReportType.on('check', this.onListReportTypeChecked.createDelegate(this));
        this.crosstabReportType.on('check', this.onCrosstabReportTypeChecked.createDelegate(this));
        this.portraitPageSetup.on('check', this.onPortraitPageSetupChecked, this);
        this.landscapePageSetup.on('check', this.onLandscapePageSetupChecked, this);
    },

    onReportNameBlur: function(aField)
    {
        var value = aField.getValue();
        wizardReport.name = value;
    },

    onPackageSelected: function(aComboBox, aRecord, aIndex)
    {
        var value = aComboBox.getValue();
        wizardReport.packagePath = value;
    },

    onSaveFolderSelected: function(aComboBox, aRecord, aIndex)
    {
        var value = aComboBox.getValue();
        wizardReport.saveToFolderId = value;
    },

    onListReportTypeChecked: function(aCheckbox, aChecked)
    {
        if (aChecked)
        {
            wizardReport.reportType = 'LIST';
            this.fireEvent('listReportSelected');
        }
    },

    onCrosstabReportTypeChecked: function(aCheckbox, aChecked)
    {
        if (aChecked)
        {
            wizardReport.reportType = 'CROSSTAB';
            this.fireEvent('crosstabReportSelected');
        }
    },

    onPortraitPageSetupChecked: function(aCheckbox, aChecked)
    {
        if (aChecked)
        {
            wizardReport.pageOrientation = 'PORTRAIT';
        }
    },

    onLandscapePageSetupChecked: function(aCheckbox, aChecked)
    {
        if (aChecked)
        {
            wizardReport.pageOrientation = 'LANDSCAPE';
        }
    },

    /**
     * This method sets the value of the report name field.
     *
     * @param aValue - Report name.
     */
    setReportName: function(aValue)
    {
        this.reportName.setValue(aValue);
    },

    /**
     * This method returns the value of the report name field.
     */
    getReportName: function()
    {
        return this.reportName.getValue();
    },

    /**
     * This method sets the value of the framework model combo box.
     *
     * @param aValue - Framework model value.
     */
    setFrameworkModel: function(aValue)
    {
        this.package.setValue(aValue);
    },

    /**
     * This method gets the value of the framework model combo box.
     */
    getFrameworkModel: function()
    {
        return this.package.getValue(aValue);
    },


    /**
     * This method sets the value of the save to folder combo box.
     *
     * @param aValue - Save to folder value.
     */
    setSaveToFolder: function(aValue)
    {
//      alert('');
        this.saveFolder.setValue(aValue, true);
    },

    /**
     * This method returns the value of the save to folder combo box.
     */
    getSaveToFolder: function()
    {
        return this.saveFolder.getValue();
    },

    /**
     * This method populates the framework model combo box with values.
     *
     * @param aData - A list of framework models.
     */
    initFrameworkModelList: function(aData)
    {
        this.package.getStore().loadData(aData);
    },


    /**
     * This method populates the save to folders combo box with values.
     *
     * @param aData - A list of save to folders.
     */
    initSaveToFoldersList: function(aData)
    {
        this.saveFolder.getStore().loadData(aData);
    },


    /**
     * This method checks the appropriate report type option.
     *
     * @param aValue - A report type, 'LIST' or 'CROSSTAB'.
     */
    setReportType: function(aValue)
    {
        if (WizardReportTypeEnum.CROSSTAB.name == aValue)
        {
            this.crosstabReportType.setValue(true);
        }
        else
        {
            this.listReportType.setValue(true);
        }
    },

    getReportType: function()
    {
        if (this.crosstabReportType.getValue())
        {
            return WizardReportTypeEnum.CROSSTAB.name;
        }
        else if (this.listReportType.getValue())
        {
            return WizardReportTypeEnum.LIST.name;
        }
        else
        {
            alert('Report type not selected');
            return '';
        }
    },

    /**
     * This method checks the appropriate page orientation option.
     *
     * @param aValue - Page orientation, 'PORTRAIT' or 'LANDSCAPE'.
     */
    setPageOrientation: function(aValue)
    {
        if (PageOrientationEnum.LANDSCAPE.name == aValue)
        {
            this.landscapePageSetup.setValue(true);
        }
        else
        {
            this.portraitPageSetup.setValue(true);
        }
    },

    getPageOrientation: function()
    {
        if (this.portraitPageSetup.getValue())
        {
            return PageOrientationEnum.PORTRAIT.name;
        }
        else if (this.landscapePageSetup.getValue())
        {
            return PageOrientationEnum.LANDSCAPE.name;
        }
        else
        {
            alert('Page orientation not selected');
            return '';
        }
    }

});


/**=====================================================================================================================
 * Crosstab Framework Model Tree Panel
 *
 *
 *======================================================================================================================
 */
wizard.CrosstabFrameworkModelTreePanel = Ext.extend(Ext.tree.TreePanel, {
    constructor: function(config)
    {

        this.addEvents({
            'addButtonClicked': true,
            'addColumnButtonClicked': true,
            'addRowButtonClicked': true,
            'addMeasureButtonClicked': true
        });

        this.addItemButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.add')
        });

        this.addColumnButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.columnSelection.addColumn')
        });

        this.addRowButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.columnSelection.addRow')
        });

        this.addMeasureButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.columnSelection.addMeasure')
        });

        var me = this;

        config = Ext.apply({
            useArrows: true,
            autoScroll: true,
            animate: true,
            enableDD: false,
            containerScroll: true,
            selModel: new Ext.tree.MultiSelectionModel(),
            border: true,
            rootVisible: false,
            fbar: [this.addColumnButton, this.addRowButton, this.addMeasureButton],
            testObj: {
            },

            loader: Ext.apply(new Ext.tree.TreeLoader({
                directFn: function(poNode, pfCallback)
                {
                    if (pfCallback)
                    {
                        pfCallback([], {status: true, scope: this, argument: { callback: pfCallback, node: poNode }});
                    }
                },
                listeners: {

                    beforeload : function (aTreeLoader, aNode, aCallback)
                    {
                       me.mask(aNode.isRoot);
                        this.baseParams.packagePath = wizardReport.packagePath;

                        if (aNode.attributes.srcObject && aNode.attributes.srcObject.path)
                        {
                            this.baseParams.startAt = aNode.attributes.srcObject.path;
                        }
                        else
                        {
                            this.baseParams.startAt = null;
                        }
                    },

                     load : function (aTreeLoader, aNode, aResponse) {
                        me.unMask();
                     }
                },


                /**
                 * This method overrides the base method to add custom attributes before the node is created.
                 *
                 * @param aAttributes - The attributes from which to create the new node.
                 */
                createNode: function(aAttributes)
                {
                    switch (aAttributes.srcObject.adfType)
                    {
                        case 'MetaDataFolder':
                            if (aAttributes.srcObject.isNameSpace)
                            {
                                aAttributes.iconCls = 'wizard-icon-namespace';
                            }
                            break;

                        case 'QuerySubject':
                            aAttributes.iconCls = 'wizard-icon-querySubject';
                            break;

                        case 'QueryItem':
                            if (aAttributes.srcObject.usage == 'fact')
                            {
                                aAttributes.iconCls = 'wizard-icon-queryItemMeasure';
                            }
                            else
                            {
                                aAttributes.iconCls = 'wizard-icon-queryItemAttribute';
                            }
                            break;

                        case 'Calculation':
                            aAttributes.iconCls = 'wizard-icon-calculation';
                            break;

                        case 'Filter':
                            aAttributes.iconCls = 'wizard-icon-filter';
                            break;

                        case 'Dimension':
                            aAttributes.iconCls = 'wizard-icon-dimension';
                            break;

                        case 'Hierarchy':
                            aAttributes.iconCls = 'wizard-icon-hierarchy';
                            break;

                        case 'Level':
                            aAttributes.iconCls = 'wizard-icon-level';
                            break;

                        case 'Measure':
                            aAttributes.iconCls = 'wizard-icon-queryItemMeasure';
                            break;

                        case 'Member':
                            aAttributes.iconCls = 'wizard-icon-member';
                            break;

                    }

                    // Setup the tooltip.
                    aAttributes.qtip = aAttributes.srcObject.description;
                    return Ext.tree.TreeLoader.prototype.createNode.call(this, aAttributes);
                }

            }), this.testObj),

            root: new Ext.tree.AsyncTreeNode({
                text:'Root Node',
                expanded: true
            })

        }, config);

        wizard.CrosstabFrameworkModelTreePanel.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.addItemButton.on('click', this.onAddButtonClicked.createDelegate(this));
        this.addColumnButton.on('click', this.onAddButtonClicked.createDelegate(this));
        this.addRowButton.on('click', this.onAddButtonClicked.createDelegate(this));
        this.addMeasureButton.on('click', this.onAddButtonClicked.createDelegate(this));
        this.on('dblclick', this.onDblClicked, this);
        this.on('render', this.mask, this, [true]);
    },

    initTree : function ()
    {
        this.enable();
        this.getLoader().directFn = null;
        this.getLoader().dataUrl = ServerEnvironment.contextPath + "/secure/actions/getPartialMetaDataExt.do";
        this.root.reload();
    },

   mask : function (isRoot)
   {
      if (this.getEl() && isRoot)
      {
         this.getEl().mask();
      }
   },

   unMask : function ()
   {
      if (this.getEl())
      {
         this.getEl().unmask();
      }
   },

   onDblClicked: function(aNode, aEventObject)
    {
        var selectedItems = [];

        var selectedNodes = this.getSelectionModel().getSelectedNodes();
        for (var i = 0; i < selectedNodes.length; i++)
        {
            if (selectedNodes[i].isLeaf())
            {
                selectedItems.push(selectedNodes[i].attributes.srcObject);
            }
        }
        if (selectedItems.length > 0)
        {
            this.fireEvent('addMeasureButtonClicked', selectedItems);
        }
    },

    onAddButtonClicked: function(aButton, aEventObject)
    {
        var selectedItems = [];

        var selectedNodes = this.getSelectionModel().getSelectedNodes();
        for (var i = 0; i < selectedNodes.length; i++)
        {
            if (selectedNodes[i].isLeaf())
            {
                selectedItems.push(selectedNodes[i].attributes.srcObject);
            }
        }

        if (selectedItems.length > 0)
        {
            if (this.addItemButton === aButton)
            {
                this.fireEvent('addButtonClicked', selectedItems);
            }
            else if (this.addColumnButton === aButton)
            {
                this.fireEvent('addColumnButtonClicked', selectedItems);
            }
            else if (this.addRowButton === aButton)
            {
                this.fireEvent('addRowButtonClicked', selectedItems);
            }
            else if (this.addMeasureButton === aButton)
            {
                this.fireEvent('addMeasureButtonClicked', selectedItems);
            }
        }
    },

    setCrosstabButtonBar: function()
    {
//      alert('setCrosstabButtonBar');
//      this.getFooterToolbar().removeAll(false);
//      this.getFooterToolbar().addButton([this.addColumnButton, this.addRowButton, this.addMeasureButton]);
    },

    setDefaultButtonBar: function()
    {
//      alert('setDefaultButtonBar');
//      this.getFooterToolbar().removeAll(false);
//      this.getFooterToolbar().addButton([this.addItemButton]);
    }


});

/**=====================================================================================================================
 * Column Selection Panel
 *
 *
 *======================================================================================================================
 */
wizard.ColumnSelectionPanel = Ext.extend(Ext.Panel, {
    constructor: function(config)
    {

        this.addEvents({
            'columnsAdded': true,
            'columnsDeleted': true,
            'listReportSelected': true,
            'crosstabReportSelected': true
        });


        this.listReport = new wizard.ListReportGrid({
            title: applicationResources.getProperty('reportWizard.columnSelection.title'),
            region: 'center'
        });

        this.crosstabReport = new wizard.CrosstabReportPanel({
            title: applicationResources.getProperty('reportWizard.columnSelection.title'),
            region: 'center'
        });

        this.frameworkModelTree = new Adf.FrameworkModelTreePanel({
            title: applicationResources.getProperty('reportWizard.columnSelection.availableColumns'),
            region: 'west',
            border: false,
            width: 300,
            packagePath : wizardReport.packagePath
        });

        this.crosstabFrameworkModelTree = new wizard.CrosstabFrameworkModelTreePanel({
            title: applicationResources.getProperty('reportWizard.columnSelection.availableColumns'),
            region: 'west',
            border: false,
            width: 300
        });

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            title: applicationResources.getProperty('reportWizard.columnSelection.title'),
            layout: 'card',
            activeItem: 0,
            border: false,
            items: [
                {
                    xtype: 'panel',
                    border: false,
                    layout: 'border',
                    items: [
                        this.frameworkModelTree,
                        this.listReport
                    ]
                },
                {
                    xtype: 'panel',
                    border: false,
                    layout: 'border',
                    items: [
                        this.crosstabFrameworkModelTree,
                        this.crosstabReport
                    ]
                }
            ]
        }, config);

        wizard.ColumnSelectionPanel.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.frameworkModelTree.on('addButtonClicked', this.onFrameworkModelAddButtonClicked.createDelegate(this));
        this.crosstabFrameworkModelTree.on('addColumnButtonClicked', this.onFrameworkModelAddColumnButtonClicked.createDelegate(this));
        this.crosstabFrameworkModelTree.on('addRowButtonClicked', this.onFrameworkModelAddRowButtonClicked.createDelegate(this));
        this.crosstabFrameworkModelTree.on('addMeasureButtonClicked', this.onFrameworkModelAddMeasureButtonClicked.createDelegate(this));
        this.listReport.on('columnsDeleted', this.onListReportColumnsDeleted.createDelegate(this));
    },


    onListReportColumnsDeleted: function(aDeletedColumns)
    {
        this.fireEvent('columnsDeleted', aDeletedColumns);
    },

    onFrameworkModelAddButtonClicked: function(aSelected)
    {
        this.addListReportColumns(aSelected);
    },

    addListReportColumns: function(aSelectedQueryItems)
    {
        if (aSelectedQueryItems.length > 0)
        {
            var newColumns = ReportColumn.createFromQueryItems(aSelectedQueryItems);

            // Make sure the column name is unique.
            for (var i = 0; i < newColumns.length; ++i)
            {
                var suffix = 2;
                var originalName = newColumns[i].name;

                while (wizardReport.getColumnByName(newColumns[i].name))
                {
                    newColumns[i].name = originalName + " " + suffix;
                    suffix++;
                }
                wizardReport.addColumn(newColumns[i]);
            }

            this.listReport.getStore().loadData({
                columns: newColumns
            }, true);


            if (!this.listReport.getSelectionModel().hasSelection())
            {
                this.listReport.getSelectionModel().selectFirstRow();
            }

            this.fireEvent('columnsAdded', newColumns);
        }
    },

    onFrameworkModelAddColumnButtonClicked: function(aSelected)
    {
        this.addCrosstabReportColumns(aSelected, ReportColumnTypeEnum.COLUMN_EDGE);
    },

    onFrameworkModelAddRowButtonClicked: function(aSelected)
    {
        this.addCrosstabReportColumns(aSelected, ReportColumnTypeEnum.ROW_EDGE);
    },

    onFrameworkModelAddMeasureButtonClicked: function(aSelected)
    {
        this.addCrosstabReportColumns(aSelected, ReportColumnTypeEnum.MEASURE);
    },

    addCrosstabReportColumns: function(aSelectedQueryItems, aReportColumnType)
    {
        if (aSelectedQueryItems.length > 0)
        {
            var newColumns = ReportColumn.createFromQueryItems(aSelectedQueryItems);

            // Make sure the column name is unique.
            for (var i = 0; i < newColumns.length; ++i)
            {
                var suffix = 2;
                var originalName = newColumns[i].name;

                while (wizardReport.getColumnByName(newColumns[i].name))
                {
                    newColumns[i].name = originalName + " " + suffix;
                    suffix++;
                }
                newColumns[i].columnType = aReportColumnType;
                if ((aReportColumnType == ReportColumnTypeEnum.COLUMN_EDGE) || (aReportColumnType == ReportColumnTypeEnum.ROW_EDGE))
                {
                    newColumns[i].groupDirective = new GroupDirective(0);
                }
                wizardReport.addColumn(newColumns[i]);
            }


            switch (aReportColumnType)
            {
                case ReportColumnTypeEnum.COLUMN_EDGE:
                    this.crosstabReport.selectedColumns.getStore().loadData({
                        columns: newColumns
                    }, true);

                    if (!this.crosstabReport.selectedColumns.getSelectionModel().hasSelection())
                    {
                        this.crosstabReport.selectedColumns.getSelectionModel().selectFirstRow();
                    }
                    break;

                case  ReportColumnTypeEnum.ROW_EDGE:
                    this.crosstabReport.selectedRows.getStore().loadData({
                        columns: newColumns
                    }, true);

                    if (!this.crosstabReport.selectedRows.getSelectionModel().hasSelection())
                    {
                        this.crosstabReport.selectedRows.getSelectionModel().selectFirstRow();
                    }
                    break;

                case  ReportColumnTypeEnum.MEASURE:
                    this.crosstabReport.selectedMeasures.getStore().loadData({
                        columns: newColumns
                    }, true);

                    if (!this.crosstabReport.selectedMeasures.getSelectionModel().hasSelection())
                    {
                        this.crosstabReport.selectedMeasures.getSelectionModel().selectFirstRow();
                    }
                    break;
            }


            this.fireEvent('columnsAdded', newColumns);
        }
    },



    showListReportPanel: function()
    {
//      this.reportSelection.getLayout().setActiveItem(0);
//      this.frameworkModelTree.setDefaultButtonBar();
    },

    showCrosstabReportPanel: function()
    {
//      this.reportSelection.getLayout().setActiveItem(1);
//      this.frameworkModelTree.setCrosstabButtonBar();
    },

    loadData: function(aWizardReportData)
    {
        if (aWizardReportData.reportType == 'LIST')
        {
//         this.reportSelection.getLayout().activeItem.loadData(aWizardReportData);
            this.frameworkModelTree.initTree();
            this.listReport.loadData(aWizardReportData);
        }
        else
        {
            this.crosstabFrameworkModelTree.initTree();
            var columnsData = {columns: aWizardReportData.getCrossTabColumnEdges()};
            var rowsData = {columns: aWizardReportData.getCrossTabRowEdges()};
            var measuresData = {columns: aWizardReportData.getCrossTabMeasures()};

//         this.reportSelection.getLayout().activeItem.loadData(columnsData, rowsData, measuresData);
            this.crosstabReport.loadData(columnsData, rowsData, measuresData);
        }
    }

});


/**=====================================================================================================================
 * Report Summary Panel
 *
 *
 *======================================================================================================================
 */
wizard.ReportSummaryPanel = Ext.extend(Ext.Panel, {
    constructor: function(config)
    {
        this.summaryTemplate = new Ext.XTemplate(
                '<p><span style="font-weight:bold;">' + applicationResources.getProperty('reportWizard.summary.name') + ': </span>{name}</p>',
                '<p><span style="font-weight:bold;">' + applicationResources.getProperty('reportWizard.summary.saveToFolder') + ': </span>{[this.getSaveToFolderPath(values.saveToFolderId)]}</p>',
                '<p><span style="font-weight:bold;">' + applicationResources.getProperty('reportWizard.summary.reportColumns') + ':</span></p>',
                '<tpl for="columns">',
                '<tpl if="xindex == 1"><ul class="wizardSummaryList"></tpl>',
                '<li class="wizardSummaryListItem">{name}',
                '{[this.getAttributeSummary(values)]}',
                '</li>',
                '<tpl if="xindex == xcount"></ul></tpl>',
                '</tpl>',

                '<p><span style="font-weight:bold;">' + applicationResources.getProperty('reportWizard.summary.filters') + ':</span></p>',

                '<tpl for="filters">',
                '<tpl if="xindex == 1"><ul class="wizardSummaryList"></tpl>',
                '<li class="wizardSummaryListItem">{expression}</li>',
                '<tpl if="xindex == xcount"></ul></tpl>',
                '</tpl>', {
            getAttributeSummary: function(aColumn)
            {
                var columnAttributes = '';

                columnAttributes += (aColumn.groupDirective ? applicationResources.getProperty('reportWizard.columnSelection.grouped') : '');
                columnAttributes += (aColumn.sortDirective ? ((columnAttributes.length > 0) ? ', ' : '') +
                        aColumn.sortDirective.getDisplayText() : '');

                columnAttributes += ((aColumn.summaryFunction && aColumn.summaryFunction != AggregateFunctionEnum.NONE) ?
                        (columnAttributes.length > 0 ? ', ' : '') + aColumn.summaryFunction.getDisplayText() : '');

                columnAttributes += (aColumn.isCalculated ? (columnAttributes.length > 0 ? ', ' : '') + applicationResources.getProperty('reportWizard.summary.calculated') : '');


                return columnAttributes.length > 0 ? ' (' + columnAttributes + ')' : '';
            },
            getSaveToFolderPath: function(aId)
            {
                var path = "";

                for (var i = 0; i < availableSaveToFolders.length; i++)
                {
                    if (availableSaveToFolders[i].id == aId)
                    {
                        path = availableSaveToFolders[i].path;
                        break;
                    }
                }
                return path;
            }
        }
                );

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            title: applicationResources.getProperty('reportWizard.summary.stageTitle'),
            bodyStyle: 'padding:10px',
            bodyCssClass: 'wizardSummaryText',
            layout: 'fit'
        }, config);

        wizard.ReportSummaryPanel.superclass.constructor.call(this, config);

//      Your postprocessing here
//      this.listReportType.on('check', this.onListReportTypeChecked.createDelegate(this));
//      this.crosstabReportType.on('check', this.onCrosstabReportTypeChecked.createDelegate(this));
    },

    setSummaryData: function(aData)
    {
        this.summaryTemplate.overwrite(this.body, aData);
    }

});

var testSummaryData = {
    name: 'Test Report',
    saveToFolderId: '/wizard reports/',
    columns: [
        {ref: '[column1]', name: 'Column1', sortDirective: null, groupDirective: new GroupDirective(0), isCalculated: true, isSuppressed: false, summaryFunction: AggregateFunctionEnum.NONE},
        {ref: '[column2]', name: 'Column2', sortDirective: new SortDirective(0, 0), groupDirective: null, isCalculated: false, isSuppressed: false, summaryFunction: AggregateFunctionEnum.NONE},
        {ref: '[column3]', name: 'Column3', sortDirective: new SortDirective(1, 0), groupDirective: null, isCalculated: false, isSuppressed: false, summaryFunction: AggregateFunctionEnum.NONE},
        {ref: '[column4]', name: 'Column4', sortDirective: null, groupDirective: null, isCalculated: false, isSuppressed: false, summaryFunction: AggregateFunctionEnum.NONE},
        {ref: '[column5]', name: 'Column5', sortDirective: null, groupDirective: null, isCalculated: false, isSuppressed: true, summaryFunction: AggregateFunctionEnum.TOTAL}
    ],
    filters: [
        {name: 'filter1', expression: 'Blah Blah Blah1'},
        {name: 'filter2', expression: 'Blah Blah Blah2'},
        {name: 'filter3', expression: 'Blah Blah Blah3'},
        {name: 'filter4', expression: 'Blah Blah Blah4'}
    ]
};


/**=====================================================================================================================
 * Crosstab Column Grid Panel
 *
 *
 *======================================================================================================================
 */
wizard.CrosstabColumnGridPanel = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(config)
    {

        this.addEvents({
            'rowsColumnsDeleted': true
        });

        this.moveUpButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.button.moveUp')
        });

        this.moveDownButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.button.moveDown')
        });

        this.ascendingSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.ascending')
        });

        this.descendingSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.descending')
        });

        this.removeSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.none')
        });

        this.deleteButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.delete')
        });


//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            title: 'CrosstabColumnGridPanel',
            autoExpandColumn: 'name',
            store: new Ext.data.JsonStore({
                autoDestroy: true,
                root: 'columns',
                fields: [
                    {
                        name: 'name'
                    },
                    {
                        name: 'sortDirective'
                    }
                ]
            }),

            colModel: new Ext.grid.ColumnModel({
                columns: [
                    { id: 'name', dataIndex: 'name', header: applicationResources.getProperty('reportWizard.columnSelection.columnLabel'), width: 160 },
                    {
                        dataIndex: 'sortDirective',
                        header: applicationResources.getProperty('reportWizard.columnSelection.sort'),
                        width: 80,
                        renderer: function(value, metaData, record, rowIndex, colIndex, store)
                        {
                            if (value)
                            {
                                return value.getDisplayText();
                            }
                            else
                            {
                                return '';
                            }
                        }
                    }
                ]
            }),

            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            })
            ,

            tbar: [
                this.moveUpButton, '-',
                this.moveDownButton, '-',
                {
                    text: applicationResources.getProperty('reportWizard.columnSelection.sort'),
                    menu: {
                        items: [
                            this.ascendingSortButton,
                            this.descendingSortButton
                            ,
                            '-',
                            this.removeSortButton
                        ]
                    }
                }, '-',
                this.deleteButton
            ]
        },
                config, {
            reportColumnType: ReportColumnTypeEnum.COLUMN_EDGE
        });

        wizard.CrosstabColumnGridPanel.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.moveUpButton.on('click', this.onMoveUpButtonClicked, this);
        this.moveDownButton.on('click', this.onMoveDownButtonClicked, this);
        this.ascendingSortButton.on('click', this.onAscendingSortButtonClicked, this);
        this.descendingSortButton.on('click', this.onDescendingSortButtonClicked, this);
        this.removeSortButton.on('click', this.onRemoveSortButtonClicked, this);
        this.deleteButton.on('click', this.onDeleteButtonClicked, this);
    },

    onMoveUpButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRows = this.getSelectionModel().getSelections();
            var firstSelectedRowIdx = this.getStore().indexOf(selectedRows[0]);

            // Validate the first selected row is not the first row in the grid.
            if (firstSelectedRowIdx > 0)
            {
                // Update the wizard report data model. The rows, columns and measures are combined into a single
                // array so the array content must be filtered by report column type before the row is moved up.
                var filteredColumns = wizardReport.getColumnByType(this.reportColumnType);

                var firstSelectedColumn = selectedRows[0].json;
                var firstSelectedColumnIdx = filteredColumns.indexOf(firstSelectedColumn);

                var previousIdx = firstSelectedColumnIdx - 1;

                for (var i = 0; i < selectedRows.length; i++)
                {
                    var j = previousIdx + i;

                    var actualIdx1 = wizardReport.columns.indexOf(filteredColumns[j]);
                    var actualIdx2 = wizardReport.columns.indexOf(filteredColumns[j + 1]);

                    var temp = wizardReport.columns[actualIdx1];
                    wizardReport.columns[actualIdx1] = wizardReport.columns[actualIdx2];
                    wizardReport.columns[actualIdx2] = temp;
                }

                this.getStore().remove(selectedRows);
                this.getStore().insert(previousIdx, selectedRows);
                this.getSelectionModel().selectRange(previousIdx, previousIdx + (selectedRows.length - 1));

            }
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }

    },

    onMoveDownButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRows = this.getSelectionModel().getSelections();
            var idx = this.getStore().indexOf(selectedRows[0]);
            var lastIdx = idx + (selectedRows.length - 1);
            var count = this.getStore().getCount();

            // Validate the selected rows can be moved down in the grid.
            if (lastIdx < (count - 1))
            {
                var filteredColumns = wizardReport.getColumnByType(this.reportColumnType);


                var previousIdx = idx - 1;

                for (var i = (lastIdx + 1); i > idx; i--)
                {
                    var actualIdx1 = wizardReport.columns.indexOf(filteredColumns[i])
                    var actualIdx2 = wizardReport.columns.indexOf(filteredColumns[i - 1])

                    var temp = wizardReport.columns[actualIdx1];
                    wizardReport.columns[actualIdx1] = wizardReport.columns[actualIdx2];
                    wizardReport.columns[actualIdx2] = temp;
                }

                this.getStore().remove(selectedRows);
                count = this.getStore().getCount();
                var nextIdx = idx + 1;
                if (nextIdx <= (count - 1))
                {
                    this.getStore().insert(nextIdx, selectedRows);
                }
                else
                {
                    this.getStore().add(selectedRows);
                }
                this.getSelectionModel().selectRange(nextIdx, nextIdx + (selectedRows.length - 1));
            }
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }

    },

    setColumnSort: function(aSortDirection)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = selectedRecords[i].json;

                if (aSortDirection != null)
                {
                    if (column.sortDirective == null)
                    {
                        column.sortDirective = new SortDirective(null, 0);
                    }
                    column.sortDirective.direction = aSortDirection;
                }
                else
                {
                    column.sortDirective = null;
                }

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('sortDirective', column.sortDirective);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();

            }
        }
    },

    onAscendingSortButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnSort(SortDirective.Ascending);
    },

    onDescendingSortButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnSort(SortDirective.Descending);
    },

    onRemoveSortButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnSort(null);
    },

    onDeleteButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            Ext.Msg.confirm(applicationResources.getProperty('reportWizard.msg.deletionConfirmation.title'),
                    applicationResources.getProperty('reportWizard.msg.deletionConfirmation'),
                    function(aButtonId)
                    {
                        if (aButtonId == 'yes')
                        {
                            var deletedColumns = [];

                            var selectedRecords = this.getSelectionModel().getSelections();
                            var idx = this.getStore().indexOf(selectedRecords[0]);

                            for (var i = 0; i < selectedRecords.length; i++)
                            {
                                var column = selectedRecords[i].json;

                                wizardReport.columns.remove(column);
                                deletedColumns.push(column);
                                this.getStore().remove(selectedRecords[i]);
                            }

                            var count = this.getStore().getCount();
                            if (count > 0)
                            {
                                this.getSelectionModel().selectRow((idx < count) ? idx : idx - 1)
                            }

                            this.fireEvent('rowsColumnsDeleted', deletedColumns);
                        }
                    }, this);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }

    }
});


/**=====================================================================================================================
 * Crosstab Measure Grid Panel
 *
 *
 *======================================================================================================================
 */
wizard.CrosstabMeasureGridPanel = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(config)
    {

        this.addEvents({
            'rowsColumnsDeleted': true
        });

        this.moveUpButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.button.moveUp')
        });

        this.moveDownButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.button.moveDown')
        });

        this.ascendingSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.ascending')
        });

        this.descendingSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.descending')
        });

        this.removeSortButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.none')
        });

        this.deleteButton = new Ext.Button({
            text: applicationResources.getProperty('reportWizard.delete')
        });

        this.countButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.columnSelection.count')
        });

        this.totalButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.columnSelection.total')
        });

        this.averageButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.columnSelection.average')
        });

        this.removeFunctionButton = new Ext.menu.Item({
            text: applicationResources.getProperty('reportWizard.button.none')
        });

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            title: 'CrosstabColumnGridPanel',
            autoExpandColumn: 'name',
            store: new Ext.data.JsonStore({
                autoDestroy: true,
                root: 'columns',
                fields: [
                    {
                        name: 'name'
                    },
                    {
                        name: 'sortDirective'
                    },
                    {
                        name: 'summaryFunction'
                    }
                ]
            }),

            colModel: new Ext.grid.ColumnModel({
                columns: [
                    { id: 'name', dataIndex: 'name', header: applicationResources.getProperty('reportWizard.columnSelection.columnLabel'), width: 160 },
                    {
                        dataIndex: 'summaryFunction',
                        header: applicationResources.getProperty('reportWizard.columnSelection.summaryFunction'),
                        width: 160,
                        renderer: function(value, metaData, record, rowIndex, colIndex, store)
                        {
                            if (value)
                            {
                                return value.getDisplayText();
                            }
                            else
                            {
                                return '';
                            }
                        }
                    }
                ]
            }),

            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            }),

            tbar: [
                this.moveUpButton, '-',
                this.moveDownButton, '-',
                {
                    text: applicationResources.getProperty('reportWizard.columnSelection.summaryFunction'),
                    menu: {
                        items: [
                            this.countButton,
                            this.totalButton,
                            this.averageButton
                            ,
                            '-',
                            this.removeFunctionButton
                        ]
                    }
                }, '-',
                this.deleteButton
            ]
        },
                config, {
            reportColumnType: ReportColumnTypeEnum.COLUMN_EDGE
        });

        wizard.CrosstabMeasureGridPanel.superclass.constructor.call(this, config);

//      Your postprocessing here
        this.moveUpButton.on('click', this.onMoveUpButtonClicked, this);
        this.moveDownButton.on('click', this.onMoveDownButtonClicked, this);
        this.deleteButton.on('click', this.onDeleteButtonClicked, this);
        this.countButton.on('click', this.onCountButtonClicked, this);
        this.totalButton.on('click', this.onTotalButtonClicked, this);
        this.averageButton.on('click', this.onAverageButtonClicked, this);
        this.removeFunctionButton.on('click', this.onRemoveFunctionButtonClicked, this);
    },

    onMoveUpButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRows = this.getSelectionModel().getSelections();
            var firstSelectedRowIdx = this.getStore().indexOf(selectedRows[0]);

            // Validate the first selected row is not the first row in the grid.
            if (firstSelectedRowIdx > 0)
            {
                // Update the wizard report data model. The rows, columns and measures are combined into a single
                // array so the array content must be filtered by report column type before the row is moved up.
                var filteredColumns = wizardReport.getColumnByType(this.reportColumnType);

                var firstSelectedColumn = selectedRows[0].json;
                var firstSelectedColumnIdx = filteredColumns.indexOf(firstSelectedColumn);

                var previousIdx = firstSelectedColumnIdx - 1;

                for (var i = 0; i < selectedRows.length; i++)
                {
                    var j = previousIdx + i;

                    var actualIdx1 = wizardReport.columns.indexOf(filteredColumns[j]);
                    var actualIdx2 = wizardReport.columns.indexOf(filteredColumns[j + 1]);

                    var temp = wizardReport.columns[actualIdx1];
                    wizardReport.columns[actualIdx1] = wizardReport.columns[actualIdx2];
                    wizardReport.columns[actualIdx2] = temp;
                }

                this.getStore().remove(selectedRows);
                this.getStore().insert(previousIdx, selectedRows);
                this.getSelectionModel().selectRange(previousIdx, previousIdx + (selectedRows.length - 1));
            }
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    onMoveDownButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRows = this.getSelectionModel().getSelections();
            var idx = this.getStore().indexOf(selectedRows[0]);
            var lastIdx = idx + (selectedRows.length - 1);
            var count = this.getStore().getCount();

            // Validate the selected rows can be moved down in the grid.
            if (lastIdx < (count - 1))
            {
                var filteredColumns = wizardReport.getColumnByType(this.reportColumnType);


                var previousIdx = idx - 1;

                for (var i = (lastIdx + 1); i > idx; i--)
                {
                    var actualIdx1 = wizardReport.columns.indexOf(filteredColumns[i])
                    var actualIdx2 = wizardReport.columns.indexOf(filteredColumns[i - 1])

                    var temp = wizardReport.columns[actualIdx1];
                    wizardReport.columns[actualIdx1] = wizardReport.columns[actualIdx2];
                    wizardReport.columns[actualIdx2] = temp;
                }

                this.getStore().remove(selectedRows);
                count = this.getStore().getCount();
                var nextIdx = idx + 1;
                if (nextIdx <= (count - 1))
                {
                    this.getStore().insert(nextIdx, selectedRows);
                }
                else
                {
                    this.getStore().add(selectedRows);
                }
                this.getSelectionModel().selectRange(nextIdx, nextIdx + (selectedRows.length - 1));
            }
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }
    },

    setColumnSort: function(aSortDirection)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = selectedRecords[i].json;

                if (aSortDirection != null)
                {
                    if (column.sortDirective == null)
                    {
                        column.sortDirective = new SortDirective(null, 0);
                    }
                    column.sortDirective.direction = aSortDirection;
                }
                else
                {
                    column.sortDirective = null;
                }

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('sortDirective', column.sortDirective);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();
            }
        }
    },

    onAscendingSortButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnSort(SortDirective.Ascending);
    },

    onDescendingSortButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnSort(SortDirective.Descending);
    },

    onRemoveSortButtonClicked: function(aButton, aEventObject)
    {
        this.setColumnSort(null);
    },

    setSummaryFunction: function(aAggregateFunction)
    {
        if (this.getSelectionModel().hasSelection())
        {
            var selectedRecords = this.getSelectionModel().getSelections();

            for (var i = 0; i < selectedRecords.length; i++)
            {
                var idx = this.getStore().indexOf(selectedRecords[i]);
                var column = wizardReport.columns[idx];

                if (aAggregateFunction.isAllowedOn(column))
                {
                    column.summaryFunction = aAggregateFunction;
                }
                else
                {
                    Ext.Msg.alert(applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                            applicationResources.getPropertyWithParameters("reportWizard.errMsg.cantBeAppliedToType", new Array(aAggregateFunction.name, column.dataType)))
                }

                selectedRecords[i].beginEdit();
                selectedRecords[i].set('summaryFunction', column.summaryFunction);
                selectedRecords[i].endEdit();
                selectedRecords[i].commit();

            }
        }
    },

    onCountButtonClicked: function(aButton, aEventObject)
    {
        this.setSummaryFunction(AggregateFunctionEnum.COUNT);
    },

    onTotalButtonClicked: function(aButton, aEventObject)
    {
        this.setSummaryFunction(AggregateFunctionEnum.TOTAL);
    },

    onAverageButtonClicked: function(aButton, aEventObject)
    {
        this.setSummaryFunction(AggregateFunctionEnum.AVERAGE);
    },

    onRemoveFunctionButtonClicked: function(aButton, aEventObject)
    {
        this.setSummaryFunction(AggregateFunctionEnum.NONE);
    },

    onDeleteButtonClicked: function(aButton, aEventObject)
    {
        if (this.getSelectionModel().hasSelection())
        {
            Ext.Msg.confirm(applicationResources.getProperty('reportWizard.msg.deletionConfirmation.title'),
                    applicationResources.getProperty('reportWizard.msg.deletionConfirmation'),
                    function(aButtonId)
                    {
                        if (aButtonId == 'yes')
                        {
                            var deletedColumns = [];

                            var selectedRecords = this.getSelectionModel().getSelections();
                            var idx = this.getStore().indexOf(selectedRecords[0]);

                            for (var i = 0; i < selectedRecords.length; i++)
                            {
                                var column = selectedRecords[i].json;

                                wizardReport.columns.remove(column);
                                deletedColumns.push(column);
                                this.getStore().remove(selectedRecords[i]);
                            }

                            var count = this.getStore().getCount();
                            if (count > 0)
                            {
                                this.getSelectionModel().selectRow((idx < count) ? idx : idx - 1)
                            }

                            this.fireEvent('rowsColumnsDeleted', deletedColumns);
                        }
                    }, this);
        }
        else
        {
            Ext.Msg.show({
                title: applicationResources.getProperty('reportWizard.msg.invalidSelection.title'),
                msg: applicationResources.getProperty('reportWizard.msg.invalidSelection'),
                icon: Ext.MessageBox.WARNING
            });
        }

    }
});


/**=====================================================================================================================
 * Crosstab Report Panel
 *
 *
 *======================================================================================================================
 */
wizard.CrosstabReportPanel = Ext.extend(Ext.Panel, {
    constructor: function(config)
    {

        this.addEvents({
            'addButtonClicked': true
        });

        // Selected Columns.
        this.selectedColumns = new wizard.CrosstabColumnGridPanel({
            title: applicationResources.getProperty('reportWizard.columnSelection.columns'),
            reportColumnType: ReportColumnTypeEnum.COLUMN_EDGE,
            margins: '5',
            flex: 1
        });


        // Selected Rows
        this.selectedRows = new wizard.CrosstabColumnGridPanel({
            title: applicationResources.getProperty('reportWizard.columnSelection.rows'),
            reportColumnType: ReportColumnTypeEnum.ROW_EDGE,
            margins: '5',
            flex: 1
        });

        // Selected Measures.
        this.selectedMeasures = new wizard.CrosstabMeasureGridPanel({
            title: applicationResources.getProperty('reportWizard.columnSelection.measures'),
            reportColumnType: ReportColumnTypeEnum.ROW_EDGE,
            margins: '5',
            flex: 1
        });

//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
        config = Ext.apply({
            layout: 'hbox',
            title: 'hbox',
            layoutConfig: {
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    layout: 'vbox',
                    border: false,
                    layoutConfig: {
                        align: 'stretch'
                    },
                    flex: 1,
                    items: [
                        {
                            xtype: 'panel',
                            border: false,
                            margins: '5',
                            flex: 1
                        },
                        this.selectedRows
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'vbox',
                    border: false,
                    layoutConfig: {
                        align: 'stretch'
                    },
                    flex: 1,
                    items: [
                        this.selectedColumns,
                        this.selectedMeasures
                    ]
                }
            ]

        }, config);

        wizard.CrosstabReportPanel.superclass.constructor.call(this, config);
    },

    loadData: function(aColumnData, aRowData, aMeasureData)
    {
        this.selectedColumns.getStore().loadData(aColumnData);
        this.selectedRows.getStore().loadData(aRowData);
        this.selectedMeasures.getStore().loadData(aMeasureData);
    },

    onAddButtonClicked: function(aButton, aEventObject)
    {
//      var selectedItems = [];
//
//      var selectedItem = this.getSelectionModel().getSelectedNode();
//      if (selectedItem)
//      {
//         selectedItems.push(selectedItem.attributes.srcObject);
//      }
//
//      this.fireEvent('addButtonClicked', selectedItems);
    }

});


Ext.onReady(function()
{
    uiController.initializeUi();
//   uiController.reportSummaryPanel.setSummaryData(testSummaryData);

//   //
//   // Initialize wizard.
//   //
//   // Fill the framework models.
//   RequestUtil.request({
//      url: ServerEnvironment.contextPath+"/secure/actions/getReportWizardFrameworkModels.do",
//      success: uiController.onGetReportWizardFrameworkModels.createDelegate(uiController)
////      failure: otherFn,
////      headers: {
////          'my-header': 'foo'
////      },
////      params: { foo: 'bar' }
//   });
//
//   // Fill the save to folders.
//   RequestUtil.request({
//      url: ServerEnvironment.contextPath+"/secure/actions/getReportWizardSaveToFolders.do",
//      success: uiController.onGetReportWizardSaveToFolders.createDelegate(uiController)
////      failure: otherFn,
////      headers: {
////          'my-header': 'foo'
////      },
////      params: { foo: 'bar' }
//   });


    // Populate the Select Type panel.
    uiController.reportTypePanel.setReportName(wizardReport.name);
//   alert(wizardReport.packagePath);
//   uiController.reportTypePanel.setFrameworkModel.defer(2000, uiController.reportTypePanel, [wizardReport.packagePath]);
    uiController.reportTypePanel.setFrameworkModel(wizardReport.packagePath);
//   alert(wizardReport.saveToFolderId);
    uiController.reportTypePanel.setSaveToFolder(wizardReport.saveToFolderId);
//   uiController.reportTypePanel.setSaveToFolder.defer(2000, uiController.reportTypePanel, [wizardReport.saveToFolderId]);

    uiController.reportTypePanel.setReportType(wizardReport.reportType);
    uiController.reportTypePanel.setPageOrientation(wizardReport.pageOrientation);

    if (wizardReport.columns.length > 0)
    {
        uiController.runButton.enable();
        uiController.finishButton.enable();
    }

});