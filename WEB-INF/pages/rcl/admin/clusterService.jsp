<%--
  ~ Copyright (c) 2001-2014. Motio, Inc.
  ~ All Rights reserved
  --%>

<%--
   Simple test page for poking / prodding the cluster service.  You can easily do everything
   this page does with simple URLs

   ---------------------------
   @author : Lance Hankins

   $Id: clusterService.jsp 8795 2014-04-24 21:57:13Z lhankins $

--%>


<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
   <head>
      <title>Cluster Service Test Page</title>
   </head>


   <body class="rclBody" oncontextmenu="return false;">
      <p>The links below can be used to test the cluster service</p>
      <ul>
         <li>
            <a href="<%=request.getContextPath()%>/secure/actions/admin/clusterService.do?type=all&numCommands=10">Send 10 Test Commands to ALL Nodes</a>
         </li>
         <li>
            <a href="<%=request.getContextPath()%>/secure/actions/admin/clusterService.do?type=single&numCommands=10">Send 10 Test Commands to Single Node</a>
         </li>
      </ul>
   </body>
</html>
