var Wizard = {};

Wizard.MetaNodeTypes = {
   MEMBER: 'Member',
   META_DATA_FOLDER: 'MetaDataFolder',
   QUERY_ITEM: 'QueryItem',
   MEASURE: 'Measure',
   CALCULATION: 'Calculation',
   QUERY_ITEM_FOLDER: 'QueryItemFolder',
   DIMENSION: 'Dimension',
   HIERARCHY: 'Hierarchy',
   LEVEL: 'Level',
   MEASURE_FOLDER: 'MeasureFolder',
   QUERY_SUBJECT: 'QuerySubject',
   FILTER: 'Filter',
   MEMBER_FOLDER: 'MemberFolder'
};
Wizard.NodeIcons = {

};

Wizard.MetaNodes = {};
Wizard.AbstractNode = function(){
   this.name;
   this.path;
   this.reference;
   this.description;
   this.screenTip;
   this.traversalOrder;
};

//Wizard.AbstractMetaNode = Ext.extend(Wizard.AbstractNode, {
//   adfType: '',
//
//   isQueryItem: function (){
//      return false;
//   },
//
//   isCalculation: function ()
//   {
//      return false;
//   },
//
//   isQuerySubject: function ()
//   {
//      return false;
//   },
//
//   isMetaDataFolder: function ()
//   {
//      return false;
//   },
//
//   isQueryItemFolder: function ()
//   {
//      return false;
//   },
//
//   isFilter: function ()
//   {
//      return false;
//   },
//
//   isDimension: function ()
//   {
//      return false;
//   },
//
//   isHierarchy: function ()
//   {
//      return false;
//   },
//
//   isLevel: function ()
//   {
//      return false;
//   },
//
//   isMeasure: function ()
//   {
//      return false;
//   },
//
//   isMeasureFolder: function ()
//   {
//      return false;
//   },
//
//   isMemberFolder: function ()
//   {
//      return false;
//   },
//
//   isMember: function ()
//   {
//      return false;
//   }
//
//});
////
////Wizard.MetaNodes.MemberNode = Ext.extend(Wizard.MetaNodes.AbstractNode,{
////   adfType: Wizard.MetaNodeTypes.MEMBER,
////   levelUniqueName: '',
////   memberUniqueName: '',
////   parentUniqueName: '',
////   levelNumber: ''
////});
//Wizard.MetaNodes.MetaDataFolder = Ext.extend(Wizard.MetaNodes.AbstractNode,{
//   adfType: Wizard.MetaNodeTypes.MEMBER,
//   isNameSpace: false
//});

if (!Ext.QuickTips.isEnabled()){
   Ext.QuickTips.init();
}

Ext.onReady(function(){
//   alert(ServerEnvironment.contextPath);
   alert("0006");
   var cognosTree = new Ext.tree.TreePanel({
      renderTo: Ext.getBody(),
      height: 400,
      width: 400,
      useArrows: true,
      autoScroll: true,
      animate: true,
      enableDD: true,
      containerScroll: true,
      border: true,
      rootVisible: false,
      mypackagePath: "/content/package[@name='GO Sales and Retailers']",
      testObj: {
         myTest: 'blah2'
      },

      loader: Ext.apply(new Ext.tree.TreeLoader({
         dataUrl: ServerEnvironment.contextPath+"/secure/actions/getPartialMetaDataExt.do",

         packagePath: "/content/package[@name='GO Sales and Retailers']",

         listeners: {

            beforeload : function (aTreeLoader, aNode, aCallback ){
//               alert('beforeload: '+aNode.text);
//               alert('beforeload: '+aNode.attributes.path);
//               this.baseParams.packagePath = aNode.attributes.packagePath;
//               alert('packagePathTest='+aNode.attributes.packagePath);
//               alert('packagePathTest='+this.packagePath);
               alert('packagePathTest='+this.myTest);
//               alert('packagePathTest='+aNode.mypackagePath);
//               this.baseParams.packagePath = "/content/package[@name='GO Sales and Retailers']";
               this.baseParams.packagePath = this.packagePath;

               if (aNode.attributes.srcObject && aNode.attributes.srcObject.path)
               {
                  this.baseParams.startAt = aNode.attributes.srcObject.path;
               }
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
//            if (this.baseAttrs.isNamespace)
//            {
////               alert('createNode: isNamespace');
//            }
//            if (attr.myValue) {
////               alert('createNode: myValue='+attr.myValue);
//            }
//            var mdImageDir = ServerEnvironment.baseUrl + "/images/md/";

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
//            aAttributes.qtipTitle = aAttributes.srcObject.name;

            return Ext.tree.TreeLoader.prototype.createNode.call(this, aAttributes);
         }
//         ,
//
//         baseAttrs : {
//            myValue: '',
////            isNamespace: true,
////            packagePath: "/content/package[@name='GO Sales and Retailers']"
//            packagePath: this.mypackagePath
//         }

      }), this.testObj),

      root: new Ext.tree.AsyncTreeNode({
         text:'Root Node',
         expanded: true
//         ,
//         packagePath: this.mypackagePath

      })

   });
});