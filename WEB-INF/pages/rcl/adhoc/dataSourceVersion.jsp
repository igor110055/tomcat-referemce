<?xml version="1.0" encoding="UTF-8"?>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>
   <title>Data Source Version</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
</head>
<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <c:choose>
      <c:when test="${form.currentVersion != null}">
         Version number for <c:out value="${form.dataSourceName}"/> has been incremented. Current version is: <c:out value="${form.currentVersion}"/>.
      </c:when>
      <c:otherwise>
         Version increment failed.
      </c:otherwise>
   </c:choose>
   
</body>
</html>

