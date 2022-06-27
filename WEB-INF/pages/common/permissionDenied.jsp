<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 <%--
   Generic Permission Denied Page...

   ---------------------------
   @author : Lance Hankins

   $Id: permissionDenied.jsp 4539 2007-07-26 22:14:44Z lhankins $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
   <head>
      <title>Display message...</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   </head>

   <body class="rclBody">

      <div class="pageBanner">
         <fmt:message key="general.permissionDenied"/>
      </div>

   </body>
</html>


