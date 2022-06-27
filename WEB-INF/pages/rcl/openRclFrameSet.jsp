<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   This page simply opens the RCL FrameSet window (with no chrome), then redirects
   this page back to the login window...

   ---------------------------
   @author : Lance Hankins
   
   $Id: openRclFrameSet.jsp 3736 2006-12-12 16:43:27Z rmoore $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>TITLE</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   </head>
   <body class="rclBody">


      <script type="text/javascript" xml:space="preserve">
         var hideChrome = <%=RclEnvironment.getShouldHideBrowserChrome()%>;

         var frameSetUrl = ServerEnvironment.baseUrl + "/secure/actions/rclFrameSet.do";

         if (hideChrome)
         {
            win =  JsUtil.openNewWindow(frameSetUrl,
                    ServerEnvironment.windowNamePrefix + "_RclFrameSet",
                    "width=1024,height=750,top=0,left=0,menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

            win.focus();

            JsUtil.openNewWindow('','_parent','');
            window.close();
         }
         else
         {
            window.location = frameSetUrl;
         }
      </script>
   </body>
</html>
