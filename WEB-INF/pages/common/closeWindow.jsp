<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Describe Page Here...

   ---------------------------
   @author : Lance Hankins
   
   $Id: closeWindow.jsp 3435 2006-10-20 20:53:42Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Finished, closing window</title>

      <script type="text/javascript" xml:space="preserve">
         window.close();
      </script>
   </head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/24Hours.jsp"%>

   <body class="rclBody">
      <span>Finished, closing window...</span>
   </body>
</html>
