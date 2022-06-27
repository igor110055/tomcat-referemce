<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   displays Schedule details...

   ---------------------------
   @author : Lance Hankins (lhankins@focus-technologies.com)
   @author : David Paul (dpaul@inmotio.com)

   $Id: scheduleDetails.jsp 7075 2009-12-09 22:24:59Z mmeza $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>

   <title>Schedule Details</title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


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



      <style type="text/css">
         @import "<%=request.getContextPath()%>/styles/rcl/workspaceWithProperties.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
      </style>
   </head>

   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

         <div id="bodyDiv">
            <div id="contentShell" class="propertiesPanel">


               <div style="overflow:hidden">
                  <rcl:panel styleId="actionsPanel" titleKey="propertiesPanel.title.scheduleDetails">

                     <div class="scrollDiv">
                        <table class="properties">

                           <tr>
                              <td class="propertyLabel">
                                 <fmt:message key="propertiesPanel.label.scheduleName"/>
                              </td>
                              <td class="propertyValue">
                                 <c:out value="${form.schedule.scheduleName}"/>
                              </td>
                           </tr>
                           <tr>
                              <td class="propertyLabel">
                                 <fmt:message key="propertiesPanel.label.createdBy"/>
                              </td>
                              <td class="propertyValue">
                                 <c:out value="${form.schedule.createdBy}"/>
                              </td>
                           </tr>
                           <tr>
                              <td class="propertyLabel">
                                 <fmt:message key="propertiesPanel.label.createdTime"/>
                              </td>
                              <td class="propertyValue">
                                 <c:out value="${form.schedule.createdOn}"/>
                              </td>
                           </tr>
                           <tr>
                              <td class="propertyLabel">
                                 <fmt:message key="propertiesPanel.label.detailClassName"/>
                              </td>
                              <td class="propertyValue">
                                 <c:out value="${form.schedule.scheduleDetails.class.name}"/>
                              </td>
                           </tr>

                           <c:if test="${form.schedule.deletedOn != null}">
                              <tr>
                                 <td class="propertyLabel">
                                    <fmt:message key="propertiesPanel.label.deletedOn"/>
                                 </td>
                                 <td class="propertyValue">
                                    <c:out value="${form.schedule.deletedOn}"/>
                                 </td>
                              </tr>
                              <tr>
                                 <td class="propertyLabel">
                                    <fmt:message key="propertiesPanel.label.deletedBy"/>
                                 </td>
                                 <td class="propertyValue">
                                    <c:out value="${form.schedule.deletedBy}"/>
                                 </td>
                              </tr>
                           </c:if>

                        </table>
                     </div>
                  </rcl:panel>
                  <rcl:panel styleId="actionsPanel" titleKey="propertiesPanel.title.scheduleAssoc">

                     <div class="scrollDiv">
                        <c:out value="${form.schedule.scheduleName}"/>
                        <table class="properties">
                           <!--todo here -->
                           <c:forEach var="eachParam" items="${form.contentNodes}">

                           <tr>
                              <td class="propertyLabel">
                                 <fmt:message key="propertiesPanel.label.reportName"/>
                              </td>
                              <td class="propertyValue">
                                 <c:out value="${eachParam.prettyPath}"/>
                              </td>
                           </tr>

                           </c:forEach>
                        </table>
                     </div>



                  </rcl:panel>
                  <rcl:panel styleId="actionsPanel" titleKey="propertiesPanel.title.scheduleAdvDetails">
                     <div>
                        <table class="properties">
                           <c:out value="${form.propertyPanelHtml}" escapeXml="false"/>
                        </table>
                     </div>
                  </rcl:panel>
               </div>


            </div> <%-- end content shell --%>
         </div>



   </body>
</html>
