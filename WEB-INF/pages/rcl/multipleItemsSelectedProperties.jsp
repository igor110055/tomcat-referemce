<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   blank properties panel (no item is currently selected)

   ---------------------------
   @author : Chad Rainey

   $Id:multipleItemsSelectedProperties.jsp 4457 2007-07-12 20:49:21Z lhankins $

--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
  <head>
     <title></title>

     <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
     <%@ include file="/WEB-INF/pages/common/cache/24Hours.jsp" %>
     <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
      </style>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>


      <script type="text/javascript">
         var uiController = new DefaultPropertiesUiController(document);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
         {
            if (!is_ie)
               window.onresize = function (anEvent) { uiController.onFrameResize(); };

            uiController.onFrameResize();
         });

      </script>

  </head>
  <body class="rclBody" style="margin:0px;"
        onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
        onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

     <div id="bodyDiv" style="overflow-y:hidden;">
        <div id="contentShell"  class="propertiesPanel" >
           <fmt:message key="propertiesPanel.multipleItemsSelected"/>
        </div>
     </div>

  </body>
</html>