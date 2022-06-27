<?xml version="1.0" encoding="UTF-8"?>
<%--
   Folder Hierarchy Selection...

   ---------------------------
   @author : Lance Hankins

   $Id: fileChooserDialog.jsp 6394 2008-12-29 17:31:25Z dpaul $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>
   <title>Folder Hierarchy Selection</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsGrid.js"></script>



   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FolderHierarchy.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FileChooserDialogUi.js"></script>


   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";

      #topPane {
         width: 100%;
         display:block;
      }

      #bottomPane {
         width: 100%;
         display: block;
         clear:both;
      }

      #navTree {
         float: left;
         height: 300px;
         min-height: 300px;
         width: 35%;

         border-width: 1px 0px 1px 1px;
         border-style: solid;
         border-color: #DDDDDD;
         overflow:scroll;
      }

      #folderContents {
         float: left;
         height: 300px;
         width: 64%;
         border: 1px solid #DDDDDD;
      }

      #bottomButtons {
         width: 100%;

         padding-top: 5px;

         text-align:center;
         border-width: 1px 0px 1px 1px;
         border-style: solid;
         border-color: #DDDDDD;
         overflow:auto;
      }


      *.dialogButton  {
         width: 100px;
      }


      div.grid *.column-0 {width: 24px; text-align:right;}
      div.grid *.column-1 {width: 350px;}


      /* GRID OVERRIDES, Specific to this screen... */
      #gridContainer div.gridBody {
         height:273px;
         overflow:auto;
      }

      #gridContainer div.cell {
         border-top: 0px;
         border-left: 0px;
         border-color: white;
         vertical-align:middle;
      }

      #gridContainer div.gridBody div.selected div.cell {
         border-color: Highlight !important;
      }

      #gridContainer div.cell img {
         vertical-align:middle;
         padding: 0px;
      }

   </style>

   <%-- include browser specific stylesheet for the grid... --%>
   <script type="text/javascript">
      if (is_ie)
         document.write('<link rel="stylesheet" href="<%=request.getContextPath()%>/styles/rcl/ie/JsGrid.css" type="text/css"/>\n');
      else
         document.write('<link rel="stylesheet" href="<%=request.getContextPath()%>/styles/rcl/moz/JsGrid.css" type="text/css"/>\n');
   </script>

</head>
<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <div id="topPane">
      <div id="navTree">
         <%-- tree inserted here --%>
      </div>
      <div id="folderContents">
         <div id="gridContainer" onselectstart="return false;">
            <%-- grid inserted here --%>
         </div>
      </div>
   </div>

   <div id="bottomPane">
      <div id="bottomButtons">
         <%--<input class="dialogButton" type="button" value="OK" styleId="fileChooserSubmitButton" onclick="uiController.onOkButtonPress();"/>--%>
         <input class="dialogButton" type="button" value="OK" id="fileChooserSubmitButton" onclick="uiController.onOkButtonPress();" disabled="disabled"/>
         <input class="dialogButton" type="button" value="Cancel" onclick="uiController.onCancelButtonPress();"/>
      </div>
   </div>


   <script type="text/javascript" xml:space="preserve">

      <c:out value="${form.jsFolderHierarchy}" escapeXml="false"/>
      var uiModel = new FileChooserDialogUiModel(rootFolder, ServerEnvironment.baseUrl + "<c:out value="${form.fetchNodeDetailsAction}" escapeXml="false"/>", <c:out value="${form.jsObjectTypes}" escapeXml="false"/>, currentSelectionParentFolder, currentSelection );
      var uiController = new FileChooserDialogUiController(document, uiModel, <c:out value="${form.multiSelect}"/>);

      //--- easier access for someone who wants to access us as an iframe...
      window.dialogUiController = uiController;

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
         uiController.initUi();
      });

      DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
         //--- clean up dialog reference...
         window.dialogUiController = null;
      });
   </script>
</body>
</html>

