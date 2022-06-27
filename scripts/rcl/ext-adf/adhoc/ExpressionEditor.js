
Adf.ExpressionEditor = Ext.extend(Ext.Window, {
   constructor: function(config) {

      this.dialogCallback = config.callback;

      this.addEvents({
          "onOkButtonClicked" : true,
          "onCancelButtonClicked" : true
      });

      this.expression = new Ext.form.TextArea({
         fieldLabel: applicationResources.getProperty('reportWizard.expressionEditor.expression'),
         width: 400,
         height: 150
      });

      this.okButton = new Ext.Button({
         text: applicationResources.getProperty('reportWizard.expressionEditor.ok')
      });

      this.cancelButton = new Ext.Button({
         text: applicationResources.getProperty('reportWizard.expressionEditor.cancel')
      });

      this.frameworkModelTree = new Adf.FrameworkModelTreePanel({
         title: applicationResources.getProperty('reportWizard.calculatedFields.model'),
         width: 250,
         packagePath : config.packagePath
      });

      this.frameworkModelTree.initTree();

      this.selectedColumns = new Adf.AvailableColumnsTreePanel({
         title: applicationResources.getProperty('reportWizard.calculatedFields.currentColumns'),
         width: 250
      });

      this.functionTree = new Adf.FunctionTreePanel({
         title: applicationResources.getProperty('reportWizard.calculatedFields.functions'),
         width: 250,
         packagePath : config.packagePath
      });

      this.informationArea = new Ext.form.TextArea({
         cls: 'wizardSummaryText',
         readOnly: true,
         flex: 0,
         height: 100,
         width: 250
      });

      this.ps = config.propertySet;
      this.packagePath = config.packagePath;
      if(Ext.isDefined(config.container))
      {
         this.containerXPath = config.container.xpath;
      }

      var propertyContentSource = {};
      var propertyDataStores = {};
      var propertyCustomEditors = {};
      var propertyCustomRenderers = {};

      for(var propIndex = 0; propIndex < this.ps.properties.length; propIndex++)
      {
         var eachProperty = this.ps.properties[propIndex];

         propertyContentSource[eachProperty.name] = eachProperty.value;

         if(!("string" === eachProperty.type.name))
         {
            var comboValues = [];
            var allowedValues = eachProperty.type.getAllowedValues();
            for (var i = 0; i < allowedValues.length; ++i)
            {
               comboValues.push([allowedValues[i].label, allowedValues[i].value]);
            }

            propertyDataStores[eachProperty.name] = new Ext.data.ArrayStore({
               autoDestroy: true,
               storeId: '' + eachProperty.name + 'Store',
               fields:['label', 'value'],
               data: comboValues
            });


            propertyCustomEditors[eachProperty.name] = new Ext.grid.GridEditor(new Ext.form.ComboBox({
               fieldLabel : eachProperty.name,
               name : eachProperty.name,
               displayField:'label',
               valueField: 'value',
               allowBlank : false,
               typeAhead : false,
               mode : 'local',
               selectOnFocus : true,
               disableKeyFilter : true,
               editable : false,
               triggerAction : 'all',
               store : propertyDataStores[eachProperty.name]
            }));

            propertyCustomRenderers[eachProperty.name] = function(value)
            {
               propertyDataStores[arguments.callee.propName].findBy(function(record) {
                  if (record.get('value') === value)
                  {
                      value = record.get('label');
                      return true; // findby
                  }
               });
               return value;
            };

            propertyCustomRenderers[eachProperty.name].propName = eachProperty.name;
         }
      }


      this.propertyPanel = new Ext.grid.PropertyGrid({
         title: applicationResources.getProperty('reportWizard.propertyPanel.name'),
         autoHeight : true,

         width : 400,
         viewConfig : {
            forceFit : true,
            scrollOffset : 2   // the grid will never have scrollbars
         },
         source : propertyContentSource,
         customEditors : propertyCustomEditors,
         customRenderers : propertyCustomRenderers
      });

      this.selectionTab = new Ext.TabPanel({
         region: 'west',
         width: 250,
         tabPosition: 'bottom',
         activeTab: 0,
         resizeTabs: true,
         flex: 1,
         items: [
            {
               title:'&nbsp;',
               xtype: 'panel',
               layout: 'fit',
               iconCls: 'wizard-icon-model-tab',
               tabTip: applicationResources.getProperty('reportWizard.calculatedFields.model'),
               items: this.frameworkModelTree
            },
            {
               title:'&nbsp;',
               xtype: 'panel',
               layout: 'fit',
               iconCls: 'wizard-icon-columns-tab',
               tabTip: applicationResources.getProperty('reportWizard.calculatedFields.currentColumns'),
               items: this.selectedColumns
            },
            {
                title:'&nbsp;',
               xtype: 'panel',
               layout: 'fit',
               iconCls: 'wizard-icon-functions-tab',
               tabTip: applicationResources.getProperty('reportWizard.calculatedFields.functions'),
               items: this.functionTree
            }
         ]

      });

      var windowTitle = applicationResources.getProperty('reportWizard.expressionEditor.title');
      if(Ext.isDefined(config.container))
      {
         windowTitle = windowTitle + " [" + config.container.name + "]";
         this.containerName = config.container.name;
      }


//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
      config = Ext.apply({
         title: windowTitle,
         layout: 'border',
         modal: true,
         height: Ext.getBody().getViewSize().height * .80,
         width: '80%',
         autoScroll:true,
         items: [
         {
            region: 'west',
            split: true,
            layout: 'vbox',
            width: 250,
            items: [this.selectionTab, this.informationArea]
         },
         {
            layout: 'form',
            region: 'center',
            labelAlign: 'top',
            bodyStyle: 'padding:10px',
            autoScroll:true,
            items: [
//               this.expressionName,
               this.expression,
               this.propertyPanel
            ]
         }],

         buttons: [
            this.okButton,
            this.cancelButton
         ],

         listeners: {
            show: function(aThis){
               var name = aThis.expression;
               var el = aThis.expression.getEl();
               var dom = aThis.expression.getEl().dom;
               aThis.expressionDropTarget = new Ext.dd.DropTarget(dom, {
                  ddGroup    : 'expressionDDGroup',
                  notifyDrop : aThis.onSelectedColumnNotifyDrop.createDelegate(aThis)
               });

            }
         }

      }, config);


      var me = this;
      Ext.EventManager.onWindowResize(function () {
         me.setSize(Ext.getBody().getViewSize().width * .80, Ext.getBody().getViewSize().height * .80);
         me.center();
      });

      Adf.ExpressionEditor.superclass.constructor.call(this, config);

//      Your postprocessing here
      this.okButton.on('click', this.okButtonClick, this);
      this.cancelButton.on('click', this.cancelButtonClick, this);

      this.functionTree.on('addButtonClicked', this.onFunctionTreeAddButtonClicked, this);
      this.frameworkModelTree.on('addButtonClicked', this.onFrameworkModelTreeAddButtonClicked, this);
      this.selectedColumns.on('addButtonClicked', this.onSelectedColumnsAddButtonClicked, this);

      this.functionTree.on('click', this.onFunctionTreeNodeClicked, this);
      this.frameworkModelTree.on('click', this.onFrameworkNodeSelected, this);

      this.selectionTab.on('tabchange', this.onTabChanged, this);

      this.selectedColumns.loadData(config.columns);
      this.existingColumns = config.columns;
   },


   onTabChanged: function(aTabPanel, aTab)
   {
      this.informationArea.setValue("");
   },

   onFrameworkNodeSelected : function(aNode, anEventObject)
   {
      if(!Ext.isEmpty(aNode) && !Ext.isEmpty(aNode.attributes.srcObject.description))
      {
         this.informationArea.setValue(aNode.attributes.srcObject.description);
      }
      else
      {
         this.informationArea.setValue('');
      }
   },

   onFunctionTreeNodeClicked: function(aNode, anEventObject)
   {
      var f = aNode.attributes.srcObject;
      var information = '';

      if (f.adfType != 'FunctionGroup')
      {
         information = f.syntax + '\n\n' + f.tip + '\n\n';
         for (var i = 0; i < f.examples.length; i++)
         {
            if (f.examples[i].example.length > 0)
            {
               information += f.examples[i].example + '\n';
               information += f.examples[i].result + '\n';
               information += f.examples[i].resultData + '\n';
            }
            else
            {
               break;
            }
         }
      }
      this.informationArea.setValue(information);

   },

   onFrameworkModelTreeAddButtonClicked: function(aSelected)
   {
      if (aSelected.length > 0)
      {
         this.appendExpressionField(aSelected[0].ref);
      }
   },

   onSelectedColumnsAddButtonClicked: function(aSelected)
   {
      if (aSelected.length > 0)
      {
          this.appendExpressionField("[" + aSelected[0].queryItemName + "]");
      }
   },

   onFunctionTreeAddButtonClicked: function(aSelected)
   {
      if (aSelected.length > 0)
      {
         var dropText = aSelected[0].dropText.length > 0 ? aSelected[0].dropText : aSelected[0].name + "(";
         this.appendExpressionField(dropText);
      }
   },

   appendExpressionField: function(aValue) {
      var exp = this.expression.getValue();
      this.expression.focus();
      this.expression.setValue(exp+aValue);
   },

   setExpression: function(aExpression) {
      this.expression.setValue(aExpression);
   },

   validate : function(aProperties)
   {
      for (var count = 0; count < this.existingColumns.length; count++)
      {
         var eachColumn = this.existingColumns[count];
         if(eachColumn.name === aProperties[applicationResources.getProperty("profileWizard.content.name")])
         {
            Ext.Msg.alert(applicationResources.getProperty('profileWizard.error.contentModError'), applicationResources.getProperty('profileWizard.error.columnNameExists'));
            return false;
         }
      }

      return true;
   },

   okButtonClick: function(aButton, aEventObject) {
      var data = {
         expression: this.expression.getValue()
      };

      var items = this.propertyPanel.propStore.store.data.items;
      for(var propIndex = 0; propIndex < items.length; propIndex++)
      {
         this.ps.getProperty(items[propIndex].id).value = items[propIndex].data.value;
         data[items[propIndex].id] = items[propIndex].data.value;
      }

      data['containerXPath'] = this.containerXPath;
      data['containerName'] = this.containerName;
      data["propertySet"] = this.ps;
      data["packagePath"] = this.packagePath;

      if(this.validate(data))
      {
         this.fireEvent('onOkButtonClicked', data);
         this.close();
      }
   },

   cancelButtonClick: function(aButton, aEventObject)
   {
      this.fireEvent('onCancelButtonClicked');
      this.close();
   },

   onSelectedColumnNotifyDrop : function(ddSource, e, data){

//                   var records =  ddSource.dragData.selections;
//                   Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
//                   secondGrid.store.add(records);
//                   secondGrid.store.sort('name', 'ASC');
      var exp = this.expression.getValue();
      this.expression.setValue(exp+'[blahblah]');
      alert('Dropped');
      return true;
   }
});
