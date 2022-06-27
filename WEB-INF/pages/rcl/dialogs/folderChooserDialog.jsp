<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   File Chooser Dialog...

   ---------------------------
   @author : Lance Hankins

   $Id: folderChooserDialog.jsp 6394 2008-12-29 17:31:25Z dpaul $

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


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FolderHierarchy.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FolderChooserDialogUi.js"></script>


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
         width: 100%;

         border-width: 1px 0px 1px 1px;
         border-style: solid;
         border-color: #DDDDDD;
         overflow:scroll;
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


   </style>

</head>
<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <div id="topPane">
      <div id="navTree">
         <%-- tree inserted here --%>
      </div>
   </div>

   <div id="bottomPane">
      <div id="bottomButtons">
         <input class="dialogButton" id="folderChooserSubmitButton" type="button" value="OK" onclick="uiController.onOkButtonPress();" disabled="disabled"/>
         <input class="dialogButton" type="button" value="Cancel" onclick="uiController.onCancelButtonPress();"/>
      </div>
   </div>


   <script type="text/javascript" xml:space="preserve">

      <c:out value="${form.jsFolderHierarchy}" escapeXml="false"/>

      var uiModel = new FolderChooserDialogUiModel(rootFolder, currentSelection);
      var uiController = new FolderChooserDialogUiController(document, uiModel, <c:out value="${form.multiSelect}"/>);

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

