<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>
      <title>Folder Contents</title>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


      <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/debug/jsClientDebug.css";
      </style>

   </head>

   <body class="rclBody" onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();" style="margin:0;padding:0;">

      <div class="jsClientDebug">
         <textarea id="debugTextarea" ></textarea>
      </div>

      <script type="text/javascript">

         var uiController = new JsClientDebugUiController(document, window, new SimpleDebugMessageFormatter());
         uiController.jsClientDebug = jsClientDebug;
         jsClientDebug.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
         DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
            uiController.windowClosing();
         })
      </script>

   </body>
</html>