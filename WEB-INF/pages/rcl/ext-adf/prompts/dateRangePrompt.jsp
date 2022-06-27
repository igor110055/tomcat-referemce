<%@ page import="org.apache.struts.Globals"%>
<%@ page import="java.util.Locale"%>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Date Range Prompt


   ---------------------------
   @author : Lance Hankins
   
   $Id: dateRangePrompt.jsp 8261 2013-04-22 20:18:43Z dk $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title>Date Range Prompt - V2</title>


   <%-- Calendar Includes...Stil used for date validation. --%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>--%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>--%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>--%>

   <style type="text/css" xml:space="preserve">
      <%--@import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";--%>
      @import "<%= request.getContextPath() %>/styles/rcl/DateParameterWidget.css";
   </style>

   <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/ext-all.css"/>
   <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/xtheme-<%=authentication.getRclUser().getPreferences().getTheme()%>.css" />

   <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/ext-adf.css"/>
   <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/fileuploadfield.css"/>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/adapter/ext/ext-base.js"></script>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ux-all.js"></script>--%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all-debug.js"></script>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all.js"></script>--%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ux-all-debug.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/RequestUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfFacade.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/adapter/ext/ext-base.js"></script>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ux-all.js"></script>--%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all-debug.js"></script>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DateParameterWidget.js"></script>--%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/common/DateParameterWidget.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/gosl/prompts/DateRangePromptUi.js"></script>

</head>
<body class="rclBody"
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