<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
<%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>



<style type="text/css">
   @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
   @import "../common/JsExamples.css";
   @import "TestTree.css";
</style>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>

<script type="text/javascript">

   //--- simple tree, which supports multi-select...

   var tree = new Tree("treeContainer");
   tree.isMultiSelect = true;

   var dummyDocCount = 1;


   //--- function to create some sample nodes...
   function createSampleFolder (aName)
   {
      var node = tree.createNode(aName, aName, folderNodeType);
      var name = null;

      if (aName != "International")
      {
         for (var i = 0; i < 3; ++i )
         {
            name = "Report" + dummyDocCount++;
            node.addChild(tree.createNode(name, name, documentNodeType, null));
         }
      }


      return node;
   }

   var imageDir = "<%=request.getContextPath()%>/images/";
   Tree.imageDir = "<%=request.getContextPath()%>/images";

   //--- two node types, Folder and Document, Document nodes allow node selection,
   //    Folders nodes do not

   var folderNodeType = new TreeNodeType("folder", "", "", imageDir + "folderYellowOpen.gif", imageDir + "folderYellowClosed.gif", false);
   var documentNodeType = new TreeNodeType("document", "selectedDoc", "unSelectedDoc", imageDir + "doc.gif", imageDir + "doc.gif", true);


   var root = tree.createNode("root", "Root Node", folderNodeType, null);
   tree.addRootNode(root);

   var pub = createSampleFolder("Public Reports");
   root.addChild(pub);

   pub.addChild(createSampleFolder("End of Month"));
   pub.addChild(createSampleFolder("Reconciliation"));
   pub.addChild(createSampleFolder("SOX"));

   var privateDocs = createSampleFolder("Private Reports");
   root.addChild(privateDocs);

   privateDocs.addChild(createSampleFolder("End of Month"));
   privateDocs.addChild(createSampleFolder("Reconciliation"));
   privateDocs.addChild(createSampleFolder("SOX"));
   privateDocs.addChild(createSampleFolder("International"));

   var lazy = tree.createNode("Lazy Test", "Lazy Test", folderNodeType, null, true);
   root.addChild(lazy);



   //--- lazy load handler
   tree.lazyLoadHandler =  {
      sampleNodeCount : 0,
      loadLazyChildren : function (aNode) {
         var name;
         for (var i = 0; i < 5; ++i)
         {
            name = "Sample-" + this.sampleNodeCount;
            aNode.addChild(tree.createNode(name, name, documentNodeType, null));
            this.sampleNodeCount++;
         }

         if (i < 20)
         {
            name = "Sample-" + (this.sampleNodeCount++);
            var lazySubFolder = tree.createNode(name, name, folderNodeType, null, true);
            aNode.addChild(lazySubFolder);
         }

      }
   };




   //--- create an observer which listens for events on the tree...
   var observer = new Observer("testObserver");

   observer.processEvent = function (anEvent) {
      var msgBody = anEvent;

      if (anEvent.type.family == "tree")
      {
         msgBody = anEvent.type.name + " [" + anEvent.payload.getPath() + "]\n";
      }
      else if (anEvent.type == ObservableEventType.COMPOUND_EVENT)
      {
         msgBody = "[compound event] : \n" + anEvent.payload.join("\n") + "\n--------\n";
      }
      else
      {
         alert("Don't know how to handle event [" + anEvent + "]");
      }

      logMessage(msgBody);
   }

   tree.addObserver(observer);

   function initUi()
   {
      tree.refreshView();
      tree.collapseAllNonRoot();
   }



   function listSelected()
   {
      var selected = tree.getSelectedNodes();

      logMessage ("[selected nodes are:]\n\n" + selected.join("\n"));
   }

   function toggleSelectionMode()
   {
      tree.deSelectAll();
      tree.isMultiSelect = !tree.isMultiSelect;

      var anchor = document.getElementById("toggleSelectionModeAnchor");
      anchor.innerHTML = tree.isMultiSelect ? "Switch to Single-Select Mode" : "Switch to Multi-Select Mode";
   }

   function logMessage(aMessage)
   {
      var log = document.getElementById("debugLog");
      log.value += aMessage;

      if (is_ie)
      {
         log.doScroll("pageDown");
         log.doScroll("pageDown");
      }
   }


   DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
      initUi();
   });

</script>

</head>


<body onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <table>
      <tr>
         <td><img src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">Tree Example</span></td>
      </tr>
   </table>
   <br/>


   <p>
   Description: This example demonstrates usage of the Tree class.</p>

   <p>Here is a <a href="UMLClassDiagram.png">UML Diagram</a> of the Tree JavaScript Classes</p>


   <div id="exampleDiv">
      <table style="width:100%;">
         <tr>
            <td width="40%">
               <div id="treeContainer">
                  <!-- TREE WILL BE INSERTED HERE -->
               </div>
            </td>
            <td style="vertical-align:top;align:left;">
               <div id="controls">
                  <ul>
                     <li><a href="javascript:toggleSelectionMode()" id="toggleSelectionModeAnchor">Switch to Single Select Mode</a></li>
                     <li><a href="javascript:listSelected();">List Selected Nodes</a></li>
                     <li><a href="javascript:tree.expandAll();">Expand All</a></li>
                     <li><a href="javascript:tree.collapseAll();">Collapse All</a></li>
                     <li><a href="javascript:tree.hideSelected();">Hide Selected Nodes</a></li>
                     <li><a href="javascript:tree.unHideAll();">Unhide All</a></li>
                     <li><a href="javascript:tree.selectedNode.expandAllChildren();">Expand All Children For Current Node</a></li>
                     <li><a href="javascript:tree.selectedNode.collapseAllChildren();">Collapse All Children For Current Node</a></li>
                  </ul>
               </div>
            </td>
         </tr>
      </table>


      <div id="debugDiv">
         <textarea id="debugLog" rows="17" cols="100"></textarea>
      </div>
   </div>



   <!-- standard footer -->

   <jsp:include page="../common/standardExampleFooter.jsp"/>
</body>

</html>