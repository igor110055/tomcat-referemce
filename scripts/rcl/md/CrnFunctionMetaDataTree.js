/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: CrnFunctionMetaDataTree.js 4533 2007-07-26 19:34:05Z lhankins $




//-----------------------------------------------------------------------------
/**
 * @class - Tree which displays CRN Function Metadata Hierarchy...
 * @constructor
 * @author Lance Hankins
 **/


//-----------------------------------------------------------------------------
/**
 * @class - Tree which displays CRN Function Metadata Hierarchy...
 * @constructor
 * @author Lance Hankins
 **/
function CrnFunctionMetaDataTree (aPackagePath, aInsertionPoint)
{
   this.instanceId = CrnFunctionMetaDataTree.registerNewInstance(this);

   this.packagePath = aPackagePath;

   this.tree = new Tree(aInsertionPoint);
   this.tree.isMultiSelect = false;

   var mdImageDir = ServerEnvironment.baseUrl + "/images/md/";

   //--- node types
   this.functionGroupType = new TreeNodeType("functionGroup", "", "", mdImageDir + "folderOpen.gif", mdImageDir + "folder.gif", false);

   this.operatorType = new TreeNodeType("function", "", "", mdImageDir + "operator.gif", mdImageDir + "operator.gif", true);
   this.summaryType = new TreeNodeType("function", "", "", mdImageDir + "summary.gif", mdImageDir + "summary.gif", true);
   this.literalType = new TreeNodeType("function", "", "", mdImageDir + "literal.gif", mdImageDir + "literal.gif", true);
   this.functionType = new TreeNodeType("function", "", "", mdImageDir + "function.gif", mdImageDir + "function.gif", true);

   this.nodeTypeByFunctionType = new Object();
   this.nodeTypeByFunctionType["operator"] = this.operatorType;
   this.nodeTypeByFunctionType["summary"] = this.summaryType;
   this.nodeTypeByFunctionType["literal"] = this.literalType;
   this.nodeTypeByFunctionType["function"] = this.functionType;


   this.creationVisitor =  {
      mdTreeWidget : this,
      rootFunctionGroup : null,
      visit : function(aNode)
      {
         if (aNode.isFunctionGroup())
         {
            var nodeType = this.mdTreeWidget.functionGroupType;

            aNode.uiTreeNode = this.mdTreeWidget.tree.createNode(aNode.id, aNode.name, nodeType, aNode, false);

            if (aNode.parent)
            {
               aNode.parent.uiTreeNode.addChild(aNode.uiTreeNode);
            }
            else
            {
               this.rootFunctionGroup = aNode;
               aNode.uiTreeNode.text = "Available Functions"
            }
         }
         else if (aNode.isFunction())
         {
            var nodeType = this.mdTreeWidget.nodeTypeByFunctionType[aNode.type];
            aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.id, aNode.name, nodeType, aNode, false));
         }
         else
         {
            alert("don't know how to handle node of type [" + aNode + "]");
         }
      }
   };

   this.functionMetaData = null;

   this.grabFunctionMetaDataForTree();
   this.buildTree();
}


CrnFunctionMetaDataTree.instances = [];
CrnFunctionMetaDataTree.registerNewInstance = function (aNewInstance)
{
   CrnFunctionMetaDataTree.instances.push(aNewInstance);
   return CrnFunctionMetaDataTree.instances.length-1;
};

CrnFunctionMetaDataTree.findByInstanceId = function (anId)
{
   return CrnFunctionMetaDataTree.instances[anId];
};



/**
 * repaint the tree
 **/
CrnFunctionMetaDataTree.prototype.refreshView = function()
{
   this.tree.refreshView();
   this.tree.collapseAllNonRoot();
};


/**
 * pull down backing js model, from server...
 **/
CrnFunctionMetaDataTree.prototype.grabFunctionMetaDataForTree = function()
{
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.contextPath + "/secure/actions/getFunctionMetaData.do?packagePath=" + this.packagePath;

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      try
      {
         eval(anXmlHttpRequest.responseText);
         this.mdTree.functionMetaData = crnFunctionMetaData;  // <- defined in eval above...
      }
      catch (e)
      {
         JsUtil.debugString("there was an error evaluating the following response:\n\n" + anXmlHttpRequest.responseText);
      }
   });

   handler.mdTree = this;


   xmlHttpRequest.open("POST", url, false);

   xmlHttpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
   );

   xmlHttpRequest.send("");
   if( !is_ie )
   {
      // firefox doesn't do synchronous calls with callback
      handler.callBackFn( xmlHttpRequest );
   }

};

/**
 * pull down backing js model, from server...
 **/
CrnFunctionMetaDataTree.prototype.buildTree = function()
{
   this.functionMetaData.accept(this.creationVisitor);
   this.tree.addRootNode(this.creationVisitor.rootFunctionGroup.uiTreeNode);
};
