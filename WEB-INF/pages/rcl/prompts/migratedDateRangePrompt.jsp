<%@ page import="org.apache.struts.Globals"%>
<%@ page import="java.util.Locale"%>
<%--
  ~ Copyright (c) 2001-2013. Motio, Inc.
  ~ All Rights reserved
  --%>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Date Range Prompt


   ---------------------------
   @author : Lance Hankins
   
   $Id: migratedDateRangePrompt.jsp 9255 2015-07-07 23:34:09Z sallman $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title><fmt:message key="prompt.geographicHierarchy.title"/></title>

   <%-- Migration: Include Widget library. --%>
   <%@ include file="/WEB-INF/pages/common/commonPromptIncludes.jsp"%>


   <%-- Migration: Remove the old date parameter widget. --%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>--%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>--%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>--%>

   <%--<style type="text/css" xml:space="preserve">--%>
      <%--@import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";--%>
      <%--@import "<%= request.getContextPath() %>/styles/rcl/DateParameterWidget.css";--%>
   <%--</style>--%>

   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DateParameterWidget.js"></script>--%>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/prompts/MigratedDateRangePromptUi.js"></script>

</head>
<body class="rclBody customPromptIframeBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/dateRangePrompt">


      <script type="text/javascript" xml:space="preserve">

         var uiController = new DateRangePromptUiController(document);

         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


      <div id="dateWidgets">
         <%-- date widgets inserted here --%>
      </div>

   </html:form>

</body>
</html>