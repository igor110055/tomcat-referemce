<%@ page import="java.util.Locale"%>
<%@ page import="org.apache.struts.Globals"%>
<%--
  ~ Copyright (c) 2001-2013. Motio, Inc.
  ~ All Rights reserved
  --%>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   RER Prompt Screen...


   ---------------------------
   @author : Lance Hankins

   $Id: rerPrompt.jsp 9255 2015-07-07 23:34:09Z sallman $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title>Report Execution Request Prompt</title>

   <%@ include file="/WEB-INF/pages/common/commonPromptIncludes.jsp"%>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/gosl/prompts/RerPromptUi.js"></script>



   <style type="text/css" xml:space="preserve">
      td select {
         width:100%;
      }

      *.hide{
         display:none;
      }
      #sizeContainer {
         float:left;
         width: 280px;
         margin-right:20px;
      }
      #dateWidgets {
         float:left;
         width: 250px;
      }
   </style>
</head>
<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <script type="text/javascript" xml:space="preserve">

      var uiController = new RerPromptUiController(document);

      // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
      window.uiController = uiController;

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
         uiController.initUi();
      });
   </script>

</body>
</html>

