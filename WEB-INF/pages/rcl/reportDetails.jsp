<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   displays details about a report ...

   ---------------------------
   @author : Lance Hankins (lhankins@focus-technologies.com)

   $Id: reportDetails.jsp 6578 2009-02-20 05:10:40Z lhankins $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
   <title>Report Details</title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/reportViewer/LaunchReportViewer.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportInstance.js"></script>

   <style type="text/css">
      @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
      @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
      @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
      @import "<%= request.getContextPath() %>/styles/rcl/reportDetails.css";
   </style>

   <script type="text/javascript">
      /* <![CDATA[ */

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         if (!is_ie)
            window.onresize = function (anEvent) { uiController.onFrameResize(); };

         uiController.onFrameResize();
      });

      var uiController = new DefaultPropertiesUiController(document);
      /* ]]> */
   </script>
</head>

<body class="rclBody" style="margin:0px;"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <div id="bodyDiv" style="overflow-y:hidden;">

      <div id="contentShell" class="propertiesPanel" >



         <%--
         ######################################################################
         General Properties Panel
         ######################################################################
         --%>
         <rcl:panel styleId="generalPanel" titleKey="propertiesPanel.title.general">

            <div class="scrollDiv">
               <table class="properties">

                  <tr>
                     <td class="propertyLabel">
                        <fmt:message key="propertiesPanel.label.reportName"/>
                     </td>
                     <td class="propertyValue">
                        <c:out value="${contentNodeDetailsForm.contentNodeName}"/>
                     </td>
                  </tr>

                  <tr>
                     <td class="propertyLabel">
                        <fmt:message key="propertiesPanel.label.reportPath"/>
                     </td>
                     <td class="propertyValue">
                        <c:out value="${contentNodeDetailsForm.reportSimplePath}"/>
                     </td>
                  </tr>
                  <tr>
                     <td class="propertyLabel">
                        <fmt:message key="propertiesPanel.label.customPrompt"/>
                     </td>
                     <td class="propertyValue">
                        <c:out value="${contentNodeDetailsForm.targetReportCustomPromptName}"/>
                     </td>
                  </tr>

                  <tr>
                     <td class="propertyLabel">
                        <fmt:message key="propertiesPanel.label.reportDescription"/>
                     </td>
                     <td class="propertyValue">
                        <c:out value="${contentNodeDetailsForm.jsFormattedReportDescription}" escapeXml="false"/>
                     </td>
                  </tr>


               </table>
            </div>



         </rcl:panel>

         <div>
            <div id="leftColumn">


               <%--
               ######################################################################
               Parameters Panel
               ######################################################################
               --%>

               <rcl:panel styleId="parametersPanel" titleKey="propertiesPanel.title.parameters">
                  <c:choose>
                     <c:when test="${contentNodeDetailsForm.reportExecutionInputs.parameterSet.size == 0}">
                        <fmt:message key="propertiesPanel.noParameters"/>
                     </c:when>
                     <c:otherwise>
                        <div class="scrollDiv">
                           <table class="properties">
                              <thead>
                                 <tr>
                                    <th style="width:100px;">
                                       <fmt:message key="propertiesPanel.th.parameterName"/>
                                    </th>
                                    <th>
                                       <fmt:message key="propertiesPanel.th.parameterValues"/>
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                              <c:forEach var="eachParam" items="${contentNodeDetailsForm.reportExecutionInputs.parameterSet.parameters}">
                                 <tr>
                                    <td class="propertyName"><c:out value="${eachParam.name}"/></td>
                                    <td class="propertyValue">
                                       <c:forEach var="eachParamValue" items="${eachParam.values}">
                                          <c:out value="${eachParamValue.displayText}"/>
                                          <c:if test="${eachParamValue.fuzzyParameterValue && (not empty eachParamValue.auxiliaryValue)}">
                                             (<c:out value="${eachParamValue.auxiliaryValue}"/>)
                                          </c:if>
                                          <br/>
                                       </c:forEach>
                                    </td>
                                 </tr>
                              </c:forEach>
                              </tbody>
                           </table>

                        </div>

                     </c:otherwise>
                  </c:choose>

               </rcl:panel>
            </div>
            <div id="rightColumn">

               <%--
               ######################################################################
               Output Formats and Delivery Panel
               ######################################################################
               --%>
               <rcl:panel styleId="formatAndDeliveryPanel" titleKey="propertiesPanel.title.formatAndDelivery">


                  <div class="scrollDiv">
                     <table class="properties">
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.outputFormats"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${empty contentNodeDetailsForm.reportExecutionInputs.outputPreferences.enabledOutputPreferences}">
                                    <fmt:message key="propertiesPanel.default"/>
                                 </c:when>
                                 <c:otherwise>

                                    <c:forEach var="eachFormatPref" items="${contentNodeDetailsForm.reportExecutionInputs.outputPreferences.enabledOutputPreferences}">
                                       <c:out value="${eachFormatPref.outputFormat.displayValue}"/>
                                    </c:forEach>
                                 </c:otherwise>
                              </c:choose>
                           </td>
                        </tr>
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.deliveryPreferences"/>
                           </td>
                           <td class="propertyValue">

                              <c:choose>
                                 <c:when test="${empty contentNodeDetailsForm.reportExecutionInputs.deliveryPreferences.activeDeliveryPreferences}">
                                    <fmt:message key="propertiesPanel.none"/>
                                 </c:when>
                                 <c:otherwise>
                                    <c:forEach var="eachDeliveryPref" items="${contentNodeDetailsForm.reportExecutionInputs.deliveryPreferences.activeDeliveryPreferences}">
                                       <c:out value="${eachDeliveryPref.deliveryType.name}"/>
                                       <c:out value="${eachDeliveryPref.outputReferences}"/>
                                       <br/>
                                    </c:forEach>

                                 </c:otherwise>
                              </c:choose>


                           </td>
                        </tr>
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.maxExecutionTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${empty contentNodeDetailsForm.reportExecutionInputs.maxExecutionTime}">
                                    <fmt:message key="propertiesPanel.default"/>
                                 </c:when>
                                 <c:otherwise>
                                    <c:out value="${contentNodeDetailsForm.reportExecutionInputs.maxExecutionTime}"/>
                                 </c:otherwise>
                              </c:choose>
                        </tr>
                     </table>
                  </div>

               </rcl:panel>



               <%--
               ######################################################################
               Stats Panel
               ######################################################################
               --%>
               <rcl:panel styleId="statsPanel" titleKey="propertiesPanel.title.stats">

                  <div class="scrollDiv">
                     <table class="properties">
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.numTimesRun"/>
                           </td>
                           <td class="propertyValue">
                              <c:out value="${contentNodeDetailsForm.numberOfTimesRun}"/>
                           </td>
                        </tr>
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.lastModifiedBy"/>
                           </td>
                           <td class="propertyValue">
                              <fmt:message key="propertiesPanel.label.lastModifiedTime">
                                   <fmt:param value="${contentNodeDetailsForm.contentNode.lastUpdatedBy}"/>
                                   <fmt:param> <rcl:fmtDateAndTime value="${contentNodeDetailsForm.contentNode.lastUpdatedOn}"/> </fmt:param>
                              </fmt:message>
                           </td>
                        </tr>
                     </table>
                  </div>
               </rcl:panel>

            </div>

            <div style="clear:both"></div>


               <%--
               ######################################################################
               Runtime Filter (if any)
               ######################################################################
               --%>
               <rcl:panel styleId="runtimeFiltersPanel" titleKey="propertiesPanel.title.runtimeFilters">
                  <div class="scrollDiv">
                     <table class="properties">
                        <c:choose>
                           <c:when test="${contentNodeDetailsForm.reportExecutionInputs.runtimeFilters.size == 0}">
                              <tr>
                                 <td colspan="2">
                                    <fmt:message key="propertiesPanel.noRuntimeFilters"/>
                                 </td>
                              </tr>
                           </c:when>

                           <c:otherwise>

                              <tbody>
                              <c:forEach varStatus="status" var="eachFilter" items="${contentNodeDetailsForm.reportExecutionInputs.runtimeFilters.filters}">

                                 <tr>
                                    <td class="propertyLabel">
                                       <fmt:message key="propertiesPanel.label.runtimeFilter"/> <c:out value="${status.index + 1}"/>
                                    </td>
                                    <td class="propertyValue" style="font-weight:normal;">
                                       <c:out value="${eachFilter.runtimeFilterExpression.expression}"/>
                                    </td>
                                 </tr>
                              </c:forEach>
                              </tbody>
                           </c:otherwise>
                        </c:choose>
                     </table>
                  </div>
               </rcl:panel>
         </div>

         <%-- addresses firefox issue with floating divs inside a container div --%>
         <div style="clear:both">
         </div>
         


      </div>
   </div>


</body>
</html>
