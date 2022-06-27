<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 <%--
   Generic Message Display Page...

   ---------------------------
   @author : Lance Hankins

   $Id: displayMessage.jsp 9177 2015-04-30 22:30:00Z lhankins $

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

      <span class="pageBanner">ADF Message</span><br/>
      <hr/>

      <span>Message:</span> <span class="adfMessage">${param.rclMessage}</span>

   </body>
</html>


