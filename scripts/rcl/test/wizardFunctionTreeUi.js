var Wizard = {};


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
         dataUrl: ServerEnvironment.contextPath+"/secure/actions/getFunctionMetaDataExt.do",

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

//               if (aNode.attributes.srcObject && aNode.attributes.srcObject.path)
//               {
//                  this.baseParams.startAt = aNode.attributes.srcObject.path;
//               }
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