<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>

   <title>RCL Js Example = CrnMetaData</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
      @import "../common/JsExamples.css";

      /* overrides */
      div.tree img
      {
         margin: 0px 3px 0px 1px;
      }

   </style>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/CrnMetaData.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/md/LazyCrnMetaDataTree.js"></script>



<script type="text/javascript">

   var crnMdTree = new CrnMetaDataTree ("/content/package[@name='GO Sales and Retailers']",
                                        "[gosales_goretailers]",
                                        "treeContainer");


   DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
      crnMdTree.refreshView();
   });

</script>

</head>

<body onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <table>
      <tr>
         <td><img alt="focus logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">CrnMetaData Example</span></td>
      </tr>
   </table>
   <br/>


   <p>Description: This example demonstrates usage of the Lazily loaded CrnMetaData JS Browser.</p>


   <div id="exampleDiv">
      <table style="width:100%;">
         <tr>
            <td width="40%">
               <div id="treeContainer">
                  Loading MetaData...
                  <!-- TREE WILL BE INSERTED HERE -->
               </div>
            </td>
            <td style="vertical-align:top;text-align:left;">
               <div id="controls">
                  <ul>
                     <li><a href="javascript:crnMdTree.tree.expandAll();">Expand All</a></li>
                     <li><a href="javascript:crnMdTree.tree.collapseAll();">Collapse All</a></li>
                     <li><a href="javascript:crnMdTree.tree.hideSelected();">Hide Selected Nodes</a></li>
                     <li><a href="javascript:crnMdTree.tree.unHideAll();">Unhide All</a></li>
                  </ul>
               </div>
            </td>
         </tr>
      </table>


   </div>



   <!-- standard footer -->

   <jsp:include page="../common/standardExampleFooter.jsp"/>
</body>

</html>