<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   Displays Incident Information

   ---------------------------
   @author : David Paul (dpaul@inmotio.com)

   $Id: incidentDetails.jsp 6945 2009-10-19 14:40:14Z dbequeaith $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>

      <title>Incident Details Screen</title>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
         @import "<%= request.getContextPath() %>/styles/rcl/rerDetails.css";

         fieldset {
            padding:10px;
         }

         div.xml {
            margin: 10px 3px 10px 3px;
         }

      </style>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>


      <script type="text/javascript">
         /* <![CDATA[ */
         var uiController = new DefaultPropertiesUiController(document);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
         {
            if (!is_ie)
               window.onresize = function (anEvent) { uiController.onFrameResize(); };

            uiController.onFrameResize();
         });

      </script>

   </head>

   <body class="rclBody" style="margin:0px"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">
   <div id="bodyDiv">
      <div id="contentShell" class="propertiesPanel">
         <div style="overflow:auto">
            <c:if test="${form.incidentId != null}">
               <h4>Incident Info for Incident #<c:out value="${form.incidentId}"/> </h4>

               <fieldset>
                  <legend>XML Related to this Incident</legend>

                  <div class="xml">
                     <div class="label">Incident Report Xml</div>
                     <textarea rows="10" cols="100"><c:out value="${form.incident.incidentReportXml}"/></textarea>
                  </div>
               </fieldset>
            </c:if>
            <c:if test="${form.rerErrorId != null}">
               <h4>Incident Info for Report Execution Request Error #<c:out value="${form.rerErrorId}"/> </h4>

               <fieldset>
                  <legend>XML Related to this Incident</legend>

                  <div class="xml">
                     <div class="label">Exception Xml</div>
                     <textarea rows="10" cols="100"><c:out value="${form.rerError.exceptionXml}"/></textarea>
                  </div>
               </fieldset>
            </c:if>
         </div>
      </div>
   </div>
   </body>
</html>
