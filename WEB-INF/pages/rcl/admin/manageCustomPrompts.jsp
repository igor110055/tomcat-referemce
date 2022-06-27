<?xml version="1.0" encoding="UTF-8"?>
<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: Jun 1, 2006
  Time: 4:53:37 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>
      <title>Manage Custom Prompts</title>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


      <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";

         @import "<%= request.getContextPath() %>/styles/rcl/FadeMessage.css";
         @import "<%= request.getContextPath() %>/styles/rcl/DropShadow.css";

         div.grid *.column-0 {width: 40px; text-align: right;}
         div.grid *.column-1 {width: 220px; background-color: ThreeDLightShadow;}
         div.grid *.column-2 {width: 420px; text-align: left;}
         /*div.grid *.column-3 {width: 100px; text-align: right;}*/


         /* override - we want scroll bar on the grid (so toolbar stays constant) */
         #bodyDiv {
            overflow:hidden;
         }
         
      </style>

      <%-- include browser specific stylesheet for the grid... --%>
      <script type="text/javascript">
         if (is_ie)
            document.write('<link rel="stylesheet" href="<%=request.getContextPath()%>/styles/rcl/ie/JsGrid.css" type="text/css"/>\n');
         else
            document.write('<link rel="stylesheet" href="<%=request.getContextPath()%>/styles/rcl/moz/JsGrid.css" type="text/css"/>\n');
      </script>

      <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>


      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ImageHelper.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>


      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsGrid.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageCustomPromptsUi.js"></script>

      <script type="text/javascript">

         <%-- this getter defines and populates a JS array of Custom Prompt Summary called jsCustomPromptSummaries --%>
         <c:out value="${form.jsCustomPromptSummaries}" escapeXml="false" />

         var uiModel = new ManageCustomPromptsUiModel (customPromptSummaries);
         var uiController = new ManageCustomPromptsUiController(document, uiModel);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


   </head>

   <body class="rclBody workspace"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:form action="/secure/actions/admin/manageCustomPrompts" method="post">
         <div id="bodyDiv">
            <div id="contentShell">

               <div id="workspace">

                  <%--  workspace toolbar --%>
                  <div class="workspaceToolbar" style="height:26px;">
                     <div id="toolbar">
                     </div>
                  </div>

                  <div id="workspaceBody" class="workspaceBodyNormal">
                     <div id="reportGrid" onselectstart="return false;">
                     </div>
                  </div>

               </div>
            </div>
         </div>

      </html:form>
   </body>
</html>
