<%--
   Edit the details about a organization, also serves as the Manage Destinations screens

   ---------------------------
   @author : Scott Allman

   $Id:$

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>
      <title>TITLE</title>


      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


      <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";

         @import "<%= request.getContextPath() %>/styles/rcl/FadeMessage.css";
         @import "<%= request.getContextPath() %>/styles/rcl/DropShadow.css";

         div.grid *.column-0 {width: 40px; text-align: right;}
         div.grid *.column-1 {width: 250px; background-color: ThreeDLightShadow;}
         div.grid *.column-2 {width: 150px; background-color: ThreeDLightShadow;}

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


      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ImageHelper.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>

      <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsGrid.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageDestinationsUi.js"></script>

      <script type="text/javascript">

         <%-- this getter defines and populates a JS array of Report Summary called jsReportSummaries --%>
         <c:out value="${form.destinations}" escapeXml="false" />

         var uiController = new ManageDestinationsUiController(document, destinations);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


   </head>

   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:form action="/secure/actions/admin/saveOrganization" method="post">

         <div id="bodyDiv">
            <div id="contentShell">
               <html:hidden property="organizationId" styleId="organizationId"/>
               <html:hidden property="viewGesture" styleId="viewGesture"/>
               <html:hidden property="operation"/>
               <html:hidden property="pageTitle"/>

               <table>
                  <tr>
                     <td class="label">
                        <span class="labelText"><fmt:message key="admin.organizations.organizationName"/> </span>
                     </td>
                     <td>
                        <html:text property="organizationName" styleId="organizationName" size="90"/>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">
                        <span class="labelText"><fmt:message key="admin.organizations.customProperties"/> </span>
                     </td>
                     <td>
                        <!--todo add a method to edit custom attributes-->
                     </td>
                  </tr>

                  <tr>
                     <td class="label">
                        <span class="labelText"><fmt:message key="admin.organizations.destinationList"/></span>
                     </td>
                  </tr>
                  <tr>
                     <td colspan="2">
                       <div id="workspace">
                           <%--  workspace toolbar --%>
                           <div class="workspaceToolbar" style="height:26px;">
                              <div id="toolbar">
                              </div>
                           </div>

                           <div id="workspaceBody" class="workspaceBodyNormal">
                              <div id="destinationsGrid" onselectstart="return false;">
                              </div>
                           </div>
                        </div>
                     </td>
                  </tr>
                  <tr>
                     <td colspan="2">

                        <html:button property=""
                                     onclick="setViewGesture('OK'); document.forms[0].submit();"
                                     altKey="admin.button.ok.alt" titleKey="admin.button.ok.title" bundle="rcl">
                           <fmt:message key="admin.button.ok"/>
                        </html:button>

                        <html:submit property="" onclick="setViewGesture('Cancel');" altKey="admin.button.cancel.alt"
                                     titleKey="admin.button.cancel.title" bundle="rcl">
                           <fmt:message key="admin.button.cancel"/>
                        </html:submit>

                        <script type="text/javascript">
                           function setViewGesture(gesture)
                           {
                              document.forms[0].viewGesture.value = gesture;
                           }
                        </script>
                     </td>
                  </tr>

               </table>

            </div>
         </div>

      </html:form>
   </body>
</html>
