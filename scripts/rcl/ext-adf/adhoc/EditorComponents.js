/**=====================================================================================================================
 * Framework Model Tree Panel
 *
 *
 *======================================================================================================================
 */
Adf.FrameworkModelTreePanel = Ext.extend(Ext.tree.TreePanel, {
   constructor: function(config) {

      this.addEvents({
         'addButtonClicked': true,
         'addColumnButtonClicked': true,
         'addRowButtonClicked': true,
         'addMeasureButtonClicked': true,
         'itemsAdded': true,
         'columnsAdded': true,
         'rowsAdded': true
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
         fbar: [this.addItemButton],
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

               beforeload : function (aTreeLoader, aNode, aCallback ){
                  me.mask(aNode.isRoot);
                  this.baseParams.packagePath = config.packagePath;

                  if (aNode.attributes.srcObject && aNode.attributes.srcObject.path)
                  {
                     if (aNode.attributes.srcObject.adfType == "MemberFolder")
                     {
                        this.baseParams.startAt = aNode.attributes.srcObject.parentPath;
                     }
                     else
                     {
                        this.baseParams.startAt = aNode.attributes.srcObject.path;
                     }

                     if (aNode.attributes.srcObject.adfType == "MemberFolder" || //aNode.attributes.srcObject.adfType == "Hierarchy" ||  aNode.attributes.srcObject.adfType == "Level" ||
                            aNode.attributes.srcObject.adfType == "Member" )
                     {
                        this.baseParams.fetchType = "member";
                     }
                     else
                     {
                        this.baseParams.fetchType = "normal";
                     }

                  }
                  else
                  {
                     var defaultStartAtNode = (config.defaultStartAtNode ? config.defaultStartAtNode : null);

                     this.baseParams.startAt = defaultStartAtNode;
                     this.baseParams.secondaryStartAtNode = config.secondaryStartAtNode;
                     this.baseParams.fetchType = (config.secondaryStartAtNode ? "member" : "normal");
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
            createNode: function(aAttributes) {
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

      Adf.FrameworkModelTreePanel.superclass.constructor.call(this, config);

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
      this.getLoader().dataUrl = ServerEnvironment.contextPath+"/secure/actions/getPartialMetaDataExt.do";
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
         this.fireEvent('addButtonClicked', selectedItems);
      }
   },

   onAddButtonClicked: function(aButton, aEventObject)
   {
      var selectedItems = [];

      var selectedNodes = this.getSelectionModel().getSelectedNodes();
      for (var i = 0; i < selectedNodes.length; i++)
      {
//         if (selectedNodes[i].isLeaf())
//         {
            selectedItems.push(selectedNodes[i].attributes.srcObject);
//         }
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
 * Available Columns Tree Panel
 *
 *
 *======================================================================================================================
 */
Adf.AvailableColumnsTreePanel = Ext.extend(Ext.tree.TreePanel, {
   constructor: function(config) {

      this.addEvents({
         'addButtonClicked': true
      });

      this.addItemButton = new Ext.Button({
         text: applicationResources.getProperty('reportWizard.add')
      });


//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
      config = Ext.apply({

         useArrows: true,
         autoScroll: true,
         animate: true,
         enableDD: true,
         containerScroll: true,
         selModel: new Ext.tree.MultiSelectionModel(),
         border: true,
         rootVisible: false,
         fbar: [this.addItemButton],
         testObj: {
         },

         loader: Ext.apply(new Ext.tree.TreeLoader({

            /**
             * This method overrides the base method to add custom attributes before the node is created.
             *
             * @param aAttributes - The attributes from which to create the new node.
             */
            createNode: function(aAttributes) {
               switch (aAttributes.srcObject.adfType)
               {
                  case 'operator':
                     aAttributes.iconCls = 'wizard-icon-operator';
                  break;

                  case 'summary':
                     aAttributes.iconCls = 'wizard-icon-summary';
                  break;

                  case 'literal':
                     aAttributes.iconCls = 'wizard-icon-literal';
                  break;

                  case 'function':
                     aAttributes.iconCls = 'wizard-icon-function';
                  break;

                  case 'FunctionGroup':
//                  alert('aAttributes.srcObject.isFunctionsRootNode='+aAttributes.srcObject.isFunctionsRootNode);
                     if (aAttributes.srcObject.isFunctionsRootNode)
                     {

                        aAttributes.text = 'Available Functions';
                     }
                  break;
               }

               // Setup the tooltip.
               if (aAttributes.srcObject.tip)
               {
                  aAttributes.qtip = aAttributes.srcObject.tip;
               }
//            aAttributes.qtipTitle = aAttributes.srcObject.name;

               return Ext.tree.TreeLoader.prototype.createNode.call(this, aAttributes);
            }

         }), this.testObj),

         root: new Ext.tree.TreeNode({
            text:'Root Node',
            expanded: true
//         ,
//         packagePath: this.mypackagePath

         })

      }, config);

      Adf.AvailableColumnsTreePanel.superclass.constructor.call(this, config);

//      Your postprocessing here
      this.addItemButton.on('click', this.onAddButtonClicked.createDelegate(this));
      this.on('dblclick', this.onDblClicked, this);
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
         this.fireEvent('addButtonClicked', selectedItems);
      }
   },

   onAddButtonClicked: function(aButton, aEventObject)
   {
      var selectedItems = [];

      var selectedNodes = this.getSelectionModel().getSelectedNodes();
      for (var i = 0; i < selectedNodes.length; i++)
      {
//         if (selectedNodes[i].isLeaf())
//         {
//            selectedItems.push(selectedNodes[i].attributes.srcObject);
//         }
      }

      if (selectedItems.length > 0)
      {
         this.fireEvent('addButtonClicked', selectedItems);
      }
   },


   loadData: function(aColumns){
      if (this.root.hasChildNodes)
      {
         this.root.removeAll();
      }

      if (aColumns.length > 0)
      {
         var treeNodes = [];
         for (var i = 0; i < aColumns.length; i++)
         {
            var eachColumn = aColumns[i];

            var curNode = new Ext.tree.TreeNode({
               text: eachColumn.name,
               srcObject: eachColumn,
               leaf: true,
               iconCls : 'wizard-icon-dataItemAttribute'
            });

            if(eachColumn.isCalculated)
            {
               curNode.iconCls = 'wizard-icon-dataItemCalculated';
            }
            else if(!Ext.isEmpty(eachColumn.regularAggregate))
            {
               curNode.iconCls = 'wizard-icon-dataItemAggregate';
            }

            treeNodes.push(curNode);
         }

         this.root.appendChild(treeNodes);
      }
   }
});

/**=====================================================================================================================
 * Function Tree Panel
 *
 *
 *======================================================================================================================
 */
Adf.FunctionTreePanel = Ext.extend(Ext.tree.TreePanel, {
   constructor: function(config) {

      this.addEvents({
         'addButtonClicked': true
      });

      this.addItemButton = new Ext.Button({
         text: applicationResources.getProperty('reportWizard.add')
      });


//      Create a new config object containing our computed properties
//      *plus* whatever was in the config parameter.
      config = Ext.apply({

         useArrows: true,
         autoScroll: true,
         animate: true,
         enableDD: true,
         containerScroll: true,
         border: true,
         rootVisible: false,
         fbar: [this.addItemButton],
//         mypackagePath: "/content/package[@name='GO Sales and Retailers']",
         testObj: {
//            myTest: 'blah2'
         },

         loader: Ext.apply(new Ext.tree.TreeLoader({
            dataUrl: ServerEnvironment.contextPath+"/secure/actions/getFunctionMetaDataExt.do",

//            packagePath: "/content/package[@name='GO Sales and Retailers']",

            listeners: {

               beforeload : function (aTreeLoader, aNode, aCallback ){
                  this.baseParams.packagePath = config.packagePath;
               },


               load : function (aTreeLoader, aNode, aResponse){
//               alert('load: '+aResponse.responseText);
               }
            },


            /**
             * This method overrides the base method to add custom attributes before the node is created.
             *
             * @param aAttributes - The attributes from which to create the new node.
             */
            createNode: function(aAttributes) {

               switch (aAttributes.srcObject.adfType)
               {
                  case 'operator':
                     aAttributes.iconCls = 'wizard-icon-operator';
                  break;

                  case 'summary':
                     aAttributes.iconCls = 'wizard-icon-summary';
                  break;

                  case 'literal':
                     aAttributes.iconCls = 'wizard-icon-literal';
                  break;

                  case 'function':
                     aAttributes.iconCls = 'wizard-icon-function';
                  break;

                  case 'FunctionGroup':
//                  alert('aAttributes.srcObject.isFunctionsRootNode='+aAttributes.srcObject.isFunctionsRootNode);
                     if (aAttributes.srcObject.isFunctionsRootNode)
                     {

                        aAttributes.text = 'Available Functions';
                     }
                  break;
               }

               // Setup the tooltip.
               if (aAttributes.srcObject.tip)
               {
                  aAttributes.qtip = aAttributes.srcObject.tip;
               }
//            aAttributes.qtipTitle = aAttributes.srcObject.name;

               return Ext.tree.TreeLoader.prototype.createNode.call(this, aAttributes);
            }

         }), this.testObj),

         root: new Ext.tree.AsyncTreeNode({
            text:'Root Node',
            expanded: true
//         ,
//         packagePath: this.mypackagePath

         })

      }, config);

      Adf.FunctionTreePanel.superclass.constructor.call(this, config);

//      Your postprocessing here
      this.addItemButton.on('click', this.onAddButtonClicked.createDelegate(this));
      this.on('dblclick', this.onDblClicked, this);
   },


   onDblClicked: function(aNode, aEventObject)
   {
      var selectedItems = [];

      var selectedItem = aNode;
      if (selectedItem)
      {
         selectedItems.push(selectedItem.attributes.srcObject);
      }

      this.fireEvent('addButtonClicked', selectedItems);
   },

   onAddButtonClicked: function(aButton, aEventObject)
   {
      var selectedItems = [];

      var selectedItem = this.getSelectionModel().getSelectedNode();
      if (selectedItem)
      {
         selectedItems.push(selectedItem.attributes.srcObject);
      }

      this.fireEvent('addButtonClicked', selectedItems);
   }

});
