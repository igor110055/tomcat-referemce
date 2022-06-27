<%--
   Copyright 2001-2012, Motio.
   All rights reserved.
--%>
<%@ page import="com.focus.rcl.RclEnvironment" %>
<%@ page import="com.focus.rcl.reportservice.ReportExecutionStatusEnum" %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>
      <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp" %>
      <%@ include file="/WEB-INF/pages/rcl/rei/commonReiIncludes.jsp"%>
      <html:xhtml/>

      <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/ext-adf/browseRers.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
         @import "<%=request.getContextPath() %>/styles/rcl/ext-adf/ext-adf.css";
         @import "<%=request.getContextPath()%>/styles/rcl/ext-adf/MultiSelect.css";

         @import "<%=request.getContextPath() %>/styles/rcl/reportDetails.css";
         @import "<%=request.getContextPath()%>/styles/rcl/reportProfileDetails.css";
         @import "<%= request.getContextPath() %>/styles/rcl/rerDetails.css";
      </style>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfExtUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ux-all-debug.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfCheckColumn.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/DisplaySqlUiController.js"></script>


      <script type="text/javascript">

      </script>

      <title><c:out value="${form.targetName}"/> - <fmt:message key="rei.getsql.generatedSql"/></title>
   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"
         style="margin:0px;">

      <html:form action="/secure/actions/editRei" method="post">
         <html:hidden styleId="targetId" property="targetId"/>
         <html:hidden styleId="launchNodeType" property="launchNodeType"/>
         <html:hidden styleId="rerId" property="rerId"/>

         <html:hidden property="targetName"/>
         <html:hidden property="reiXml"/>
      </html:form>

      <script type="text/javascript">
         var uiController = new DisplaySqlUiController();
         uiController.initUi();
         uiController.refreshGrid();
      </script>

   </body>
</html>
