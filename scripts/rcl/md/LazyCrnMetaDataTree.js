

/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: LazyCrnMetaDataTree.js 7619 2011-07-13 19:31:57Z dk $



//-----------------------------------------------------------------------------
/**
 * @class - a visitor which creates Tree content from the CrnMetaData Tree
 * @constructor
 * @author Lance Hankins
 **/
function TreeNodeCreationVisitor (aMdTree, aStartAt)
{
   this.mdTreeWidget = aMdTree;
   this.startAt = aStartAt;
}

TreeNodeCreationVisitor.prototype.visit = function(aNode)
{
   if (aNode.isMetaDataFolder())
   {
      if (aNode != this.mdTreeWidget.rootMdNode && aNode != this.startAt)
      {
         var nodeType = aNode.isNameSpace ? this.mdTreeWidget.nameSpaceNodeType : this.mdTreeWidget.folderNodeType;
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, nodeType, aNode, true));
      }
   }
   else if (aNode.isQueryItem())
   {
      //--- usage can be one of { "fact", "attribute", "identifier" }
      var nodeType = aNode.usage == "fact" ? this.mdTreeWidget.queryItemMeasure : this.mdTreeWidget.queryItemAttribute;
      aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, nodeType, aNode, false));
   }
   else if (aNode.isMeasure())
   {
      //--- usage can be one of { "fact", "attribute", "identifier" }
      //var nodeType = aNode.usage == "fact" ? this.mdTreeWidget.queryItemMeasure : this.mdTreeWidget.queryItemAttribute;
      var nodeType = this.mdTreeWidget.measureNodeType;
      aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, nodeType, aNode, false));
   }
   else if (aNode.isCalculation())
   {
      aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.calculationNodeType, aNode, false));
   }
   else if (aNode.isQuerySubject())
   {
      if (aNode != this.startAt)
      {
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.querySubjectNodeType, aNode, true));
      }
   }
   else if (aNode.isDimension())
   {
      if (aNode != this.startAt)
      {
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.dimensionNodeType, aNode, true));
      }
   }
   else if (aNode.isHierarchy())
   {
      if (aNode != this.startAt)
      {
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.hierarchyNodeType, aNode, true));
      }
   }
   else if (aNode.isLevel())
   {
      if (aNode != this.startAt)
      {
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.levelNodeType, aNode, true));
      }
   }
   else if (aNode.isMeasureFolder())
   {
      if (aNode != this.startAt)
      {
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.measureFolderNodeType, aNode, true));
      }
   }
   else if (aNode.isQueryItemFolder())
   {
      if (aNode != this.startAt)
      {
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.folderNodeType, aNode, true));
      }
   }
   else if (aNode.isMemberFolder())
   {
      if (aNode != this.startAt)
      {
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.memberFolderNodeType, aNode, true));
      }
   }
   else if (aNode.isMember())
   {
      if (aNode != this.startAt)
      {
         //alert('adding member [' + aNode.path + "]");
         aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.memberNodeType, aNode, true));
      }
   }
   else if (aNode.isFilter())
   {
      aNode.uiTreeNode = aNode.parent.uiTreeNode.addChild(this.mdTreeWidget.tree.createNode(aNode.traversalOrder, aNode.name, this.mdTreeWidget.filterNodeType, aNode, false));
   }
   else
   {
      debugger;
      alert("don't know how to handle node of type [" + aNode + "]");
   }
}



//-----------------------------------------------------------------------------
/**
 * @class - Tree which displays CrnMetaData
 * @constructor
 * @author Lance Hankins
 **/
function CrnMetaDataTree (aPackagePath, aPackageRoot, aInsertionPoint)
{
   this.instanceId = CrnMetaDataTree.registerNewInstance(this);

   this.packagePath = aPackagePath;
   this.packageRoot = aPackageRoot;

   this.tree = new Tree(aInsertionPoint);
   this.tree.isMultiSelect = true;

   //--- lazy load handler
   this.tree.lazyLoadHandler = this;

   var mdImageDir = ServerEnvironment.baseUrl + "/images/md/";

   //--- node types
   this.nameSpaceNodeType = new TreeNodeType("namespace", "", "", mdImageDir + "namespace.gif", mdImageDir + "namespace.gif", false);
   this.folderNodeType = new TreeNodeType("folder", "", "", mdImageDir + "folderOpen.gif", mdImageDir + "folder.gif", false);
   this.querySubjectNodeType = new TreeNodeType("querySubject", "", "", mdImageDir + "querySubject.gif", mdImageDir + "querySubject.gif", false);
   this.queryItemAttribute = new TreeNodeType("queryItemAttribute", "", "", mdImageDir + "queryItemAttribute.gif", mdImageDir + "queryItemAttribute.gif", true);
   this.queryItemMeasure = new TreeNodeType("queryItemMeasure", "", "", mdImageDir + "queryItemMeasure.gif", mdImageDir + "queryItemMeasure.gif", true);
   this.calculationNodeType = new TreeNodeType("calculation", "", "", mdImageDir + "calculation.gif", mdImageDir + "calculation.gif", true);
   this.filterNodeType = new TreeNodeType("filter", "", "", mdImageDir + "filter.gif", mdImageDir + "filter.gif", true);

   this.dimensionNodeType = new TreeNodeType("dimension", "", "", mdImageDir + "dimension.gif", mdImageDir + "dimension.gif", false);
   this.hierarchyNodeType = new TreeNodeType("hierarchy", "", "", mdImageDir + "hierarchy.gif", mdImageDir + "hierarchy.gif", true);
   this.levelNodeType = new TreeNodeType("level", "", "", mdImageDir + "level.gif", mdImageDir + "level.gif", true);
   this.measureFolderNodeType = new TreeNodeType("measureFolder", "", "", mdImageDir + "folderOpen.gif", mdImageDir + "folder.gif", false);

   this.measureNodeType = new TreeNodeType("measure", "", "", mdImageDir + "queryItemMeasure.gif", mdImageDir + "queryItemMeasure.gif", true);

   this.memberFolderNodeType = new TreeNodeType("memberFolder", "", "", mdImageDir + "folderOpen.gif", mdImageDir + "folder.gif", false);
   this.memberNodeType = new TreeNodeType("member", "", "", mdImageDir + "member.gif", mdImageDir + "member.gif", true);



   this.rootMdNode = null;

   //--- loads in root MD node and its immediate children, sets this.rootMdNode
   this.getRootNode();


   this.rootTreeNode = this.tree.createNode(this.rootMdNode.path, this.rootMdNode.name, this.nameSpaceNodeType, this.rootMdNode, false);
   this.tree.addRootNode(this.rootTreeNode);
   this.rootMdNode.uiTreeNode = this.rootTreeNode;

   this.rootMdNode.accept(new TreeNodeCreationVisitor(this, this.rootMdNode));
}


CrnMetaDataTree.instances = [];
CrnMetaDataTree.registerNewInstance = function (aNewInstance)
{
   CrnMetaDataTree.instances.push(aNewInstance);
   return CrnMetaDataTree.instances.length-1;
};

CrnMetaDataTree.findByInstanceId = function (anId)
{
   return CrnMetaDataTree.instances[anId];
};


/**
 * suck in the root folder node and its immediate children (from the server)...
 **/
CrnMetaDataTree.prototype.getRootNode = function ()
{
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.contextPath + "/secure/actions/getPartialMetaData.do";

   var parameters = "packagePath=" + this.packagePath;
   if (this.packageRoot!=null)
   {
      parameters = parameters + "&rootPath=" + this.packageRoot;
   }

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      try
      {
         eval(anXmlHttpRequest.responseText);
         this.mdTree.rootMdNode = rootNode;  // <- defined in eval above...
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

   xmlHttpRequest.send(parameters);
   if( !is_ie )
   {
      // firefox doesn't do synchronous calls with callback
      handler.callBackFn( xmlHttpRequest );
   }
};

/**
 * load in the supplied node's immediate children...
 **/
CrnMetaDataTree.prototype.loadLazyChildren = function (aNode)
{
   var isMemberFetch = aNode.srcObject.isMemberFolder() || aNode.srcObject.isMember();

   //debugger;
   var fromPath = aNode.srcObject.isMemberFolder() ? aNode.srcObject.parent.path : aNode.srcObject.path;

   //--- do async HTTP call to pull down nodes for this path (then add them
   //    to the tree at the current node).

   var xmlHttpRequest = JsUtil.createXmlHttpRequest();
   fromPath = encodeURIComponent(fromPath);
   var url = ServerEnvironment.contextPath + "/secure/actions/getPartialMetaData.do" +
             "?packagePath=" + this.packagePath +
             "&startAt=" + fromPath +
             "&fetchType=" + (isMemberFetch ? "member" : "normal");
//   url = encodeURI(url);
   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      //alert("eval'ing : \n\n" + anXmlHttpRequest.responseText);
      try
      {
         var parentNode = this.parentMdNode;
         eval(anXmlHttpRequest.responseText);
         parentNode.accept(new TreeNodeCreationVisitor(this.mdTreeWidget, this.parentMdNode));
      }
      catch (e)
      {
         alert("there was an error evaluating the following response:\n\n" + anXmlHttpRequest.responseText);
      }
      finally
      {
         //this.mdTreeWidget.tree.endPleaseWaitDiv();
      }
   });

   handler.parentTreeNode = aNode;
   handler.parentMdNode = aNode.srcObject;
   handler.mdTreeWidget = this;

   //this.tree.showPleaseWaitDiv();

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



CrnMetaDataTree.prototype.refreshView = function()
{
   this.tree.refreshView();
   this.tree.collapseAllNonRoot();
};

