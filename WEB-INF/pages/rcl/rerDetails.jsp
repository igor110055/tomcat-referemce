<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   displays RER details...

   ---------------------------
   @author : Lance Hankins (lhankins@focus-technologies.com)

   $Id: rerDetails.jsp 6578 2009-02-20 05:10:40Z lhankins $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>

   <title>Folder Contents</title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


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


         function downloadIncidentReport ()
         {
            // we'll set the target for people who use IE as their native XML viewer (that way it
            // doesn't overwrite the main RCL window)
            document.forms[0].target = ServerEnvironment.windowNamePrefix + "_IncidentReport_" + document.forms[0].rerId.value;
            document.forms[0].submit();
         }
         /* ]]> */
      </script>



      <style type="text/css">

         @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
         @import "<%= request.getContextPath() %>/styles/rcl/rerDetails.css";
      </style>
   </head>

   <body class="rclBody" style="margin:0px"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

         <div id="bodyDiv" style="overflow-y:hidden;">
            <div id="contentShell" class="propertiesPanel">


               <div>
                  <div id="leftColumn">

                     <%--
                     ######################################################################
                     General Panel
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
                                    <c:out value="${getRerDetailsForm.reportName}"/>
                                 </td>
                              </tr>

                              <c:if test="${getRerDetailsForm.targetProfile}">
                                 <tr>
                                    <td class="propertyLabel">
                                       <fmt:message key="propertiesPanel.label.reportProfileName"/>
                                    </td>
                                    <td class="propertyValue">
                                       <c:out value="${getRerDetailsForm.profileName}"/>
                                    </td>
                                 </tr>
                                 
                              </c:if>

                           </table>
                        </div>



                     </rcl:panel>



                     <%--
                     ######################################################################
                     Parameters Panel
                     ######################################################################
                     --%>

                     <rcl:panel styleId="parametersPanel" titleKey="propertiesPanel.title.parameters">
                        <c:choose>
                           <c:when test="${rerDetails.rer.reportExecutionInputs.parameterSet.size == 0}">
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
                                    <c:forEach var="eachParam" items="${rerDetails.rer.reportExecutionInputs.parameterSet.parameters}">
                                       <tr>
                                          <td class="propertyName"><c:out value="${eachParam.name}"/></td>
                                          <td class="paramValue">
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



                     <%--
                     ######################################################################
                     Runtime Filter (if any)
                     ######################################################################
                     --%>
                     <rcl:checkCapability hasAll="INCIDENT">
                     <rcl:panel styleId="actionsPanel" titleKey="propertiesPanel.title.actions">
                        <div class="scrollDiv">

                           <table class="properties">
                              <thead>
                                 <tr>
                                    <th>
                                       <fmt:message key="propertiesPanel.description"/>
                                    </th>
                                    <th>
                                       <fmt:message key="propertiesPanel.action"/>
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <c:if test="${rerDetails.rer.status.finished}">
                                    <tr>
                                       <td class="propertyName">
                                          <fmt:message key="propertiesPanel.text.createIncidentReport"/>
                                       </td>
                                       <td class="propertyValue">
                                          <a href="javascript:downloadIncidentReport();">
                                             <fmt:message key="propertiesPanel.button.createIncidentReport"/>
                                          </a>
                                       </td>
                                    </tr>
                                 </c:if>

                                 <c:if test="${rerDetails.rer.status.value < 0}">
                                    <tr>
                                       <td class="propertyName">
                                          <fmt:message key="propertiesPanel.text.downloadIncidentReport"/>
                                       </td>
                                       <td class="propertyValue">
                                          <a href="javascript:downloadIncidentReport();">
                                             <fmt:message key="propertiesPanel.button.downloadIncidentReport"/>
                                          </a>
                                       </td>
                                    </tr>
                                 </c:if>
                              </tbody>
                           </table>
                        </div>
                     </rcl:panel>
                     </rcl:checkCapability>
                     <rcl:checkCapability hasNone="INCIDENT">
                        <c:if test="${rerDetails.rer.status.value < 0}">
                           <rcl:panel styleId="actionsPanel" titleKey="propertiesPanel.title.actions">
                              <div class="scrollDiv">
                                 <table class="properties">
                                    <thead>
                                       <tr>
                                          <th>
                                             <fmt:message key="propertiesPanel.description"/>
                                          </th>
                                          <th>
                                             <fmt:message key="propertiesPanel.action"/>
                                          </th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr>
                                          <td class="propertyName">
                                             <fmt:message key="incident.occured"/>
                                          </td>
                                          <td class="propertyValue">
                                             Reference #: Report Execution Request #<c:out value="${rerDetails.rer.id}"/>
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>                              
                           </rcl:panel>
                        </c:if>
                     </rcl:checkCapability>
                  
                  </div>




                  <div id="rightColumn">

                     <%--
                     ######################################################################
                     Status Panel
                     ######################################################################
                     --%>
                     <rcl:panel styleId="statusPanel" titleKey="propertiesPanel.title.status">


                        <div class="scrollDiv">
                           <table class="properties">
                              <tr>
                                 <td class="propertyLabel">
                                    <fmt:message key="propertiesPanel.label.status"/>
                                 </td>
                                 <td class="propertyValue">
                                    <fmt:message key="${rerDetails.rer.status.displayProperty}"/>
                                 </td>
                              </tr>
                              <tr>
                                 <td class="propertyLabel">
                                    <fmt:message key="propertiesPanel.label.startTime"/>
                                 </td>
                                 <td class="propertyValue">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.startTime}"/>
                                 </td>
                              </tr>
                              <tr>
                                 <td class="propertyLabel">
                                    <fmt:message key="propertiesPanel.label.endTime"/>
                                 </td>
                                 <td class="propertyValue">
                                    <c:choose>
                                       <c:when test="${rerDetails.rerSummary.endTime!=null}">
                                          <rcl:fmtDateAndTime value="${rerDetails.rerSummary.endTime}"/>
                                       </c:when>
                                       <c:otherwise>--</c:otherwise>
                                    </c:choose>
                                 </td>
                              </tr>
                           </table>
                        </div>

                     </rcl:panel>



                     <%--
                     ######################################################################
                     Output Formats and Delivery Panel
                     ######################################################################
                     --%>
                     <rcl:panel styleId="formatAndDeliveryPanel" titleKey="propertiesPanel.title.formatAndDelivery">


                        <div class="scrollDiv">
                           <table class="properties">
                              <thead>
                                 <th style="width:60px">
                                    <fmt:message key="propertiesPanel.th.format"/>
                                 </th>
                                 <th style="width:60px; text-align:right;">
                                    <fmt:message key="propertiesPanel.th.compressed"/>
                                 </th>
                                 <th style="width:60px; text-align:right;">
                                    <fmt:message key="propertiesPanel.th.raw"/>
                                 </th>
                              </thead>

                              <tbody>
                                 <c:forEach items="${rerDetails.rerSummary.outputSummaries}" var="eachOutputSummary">
                                    <c:if test="${eachOutputSummary.available}">
                                       <tr>
                                          <td>
                                             <c:out value="${eachOutputSummary.outputFormat.displayValue}"/>
                                          </td>
                                          <td class="number">
                                             <fmt:formatNumber>
                                                <c:out value="${eachOutputSummary.compressedSizeInKb}"/>
                                             </fmt:formatNumber> <fmt:message key="propertiesPanel.kiloBytes"/>
                                          </td>
                                          <td class="number">
                                             <fmt:formatNumber>
                                                <c:out value="${eachOutputSummary.uncompressedSizeInKb}"/>
                                             </fmt:formatNumber> <fmt:message key="propertiesPanel.kiloBytes"/>
                                          </td>
                                       </tr>
                                    </c:if>
                                 </c:forEach>
 
                                 <tr>
                                    <td colspan="3">&nbsp;</td>
                                 </tr>
                                 <tr>
                                    <td class="propertyLabel">
                                       <fmt:message key="profileWizard.outputs.deliveries"/>
                                    </td>
                                    <td class="propertyValue" style="" colspan="2">

                                       <c:choose>
                                          <c:when test="${empty rerDetails.rer.reportExecutionInputs.deliveryPreferences.activeDeliveryPreferences}">
                                             <fmt:message key="propertiesPanel.none"/>
                                          </c:when>
                                          <c:otherwise>
                                             <c:forEach var="eachDeliveryPref" items="${rerDetails.rer.reportExecutionInputs.deliveryPreferences.activeDeliveryPreferences}">
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
                                          <c:when test="${empty rerDetails.rer.reportExecutionInputs.maxExecutionTime}">
                                             <fmt:message key="propertiesPanel.default"/>
                                          </c:when>
                                          <c:otherwise>
                                             <c:out value="${rerDetails.rer.reportExecutionInputs.maxExecutionTime}"/>
                                          </c:otherwise>
                                       </c:choose>
                                 </tr>
                              </tbody>
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
                              <thead>
                                 <tr>
                                    <th>
                                       <fmt:message key="propertiesPanel.rerStats.state"/>
                                    </th>
                                    <th>
                                       <fmt:message key="propertiesPanel.rerStats.seconds"/>
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.pendingPreExecution"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.preExecutionBlockedTime}"/>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.preExecution"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.totalPreExecutionTime}"/>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.pendingExecution"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.executionBlockedTime}"/>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.execution"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.totalExecutionTime}"/>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.pendingDownload"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.downloadBlockedTime}"/>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.download"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.totalDownloadTime}"/>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.pendingPostExecution"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.postExecutionBlockedTime}"/>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.postExecution"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.totalPostExecutionTime}"/>
                                    </td>
                                 </tr>
                                 <tr class="summaryRow">
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.total"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.totalTime}"/>
                                    </td>
                                 </tr>
                                 <tr class="summaryRow">
                                    <td class="propertyName">
                                       <fmt:message key="propertiesPanel.rerStats.failedAttempts"/>
                                    </td>
                                    <td class="propertyValue number">
                                       <c:out value="${form.numberOfFailedAttempts}"/>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>


                        </div>
                     </rcl:panel>

                  </div>

                  <div class="clear"></div>
               </div>


               <%--
               ######################################################################
               Runtime Filter (if any)
               ######################################################################
               --%>
               <rcl:panel styleId="runtimeFiltersPanel" titleKey="propertiesPanel.title.runtimeFilters">
                  <div class="scrollDiv">
                     <table class="properties">
                        <c:choose>
                           <c:when test="${rerDetails.rer.reportExecutionInputs.runtimeFilters.size == 0}">
                              <tr>
                                 <td colspan="2">
                                    <fmt:message key="propertiesPanel.noRuntimeFilters"/>
                                 </td>
                              </tr>
                           </c:when>

                           <c:otherwise>

                              <tbody>
                              <c:forEach varStatus="status" var="eachFilter" items="${rerDetails.rer.reportExecutionInputs.runtimeFilters.filters}">

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






                <%-- hidden forms that only get inserted to download incident reports... --%>

                <c:if test="${rerDetails.rer.status.value < 0}">

                  <%-- this is only used for downloading incident report for failed rer's--%>
                  <div style="display:none">
                     <form action="<%=request.getContextPath()%>/secure/actions/downloadRerIncident.do" method="post">
                        <input type="hidden" name="rerId" value="<c:out value="${rerDetails.rer.id}"/>"/>
                     </form>
                  </div>
               </c:if>
               <c:if test="${rerDetails.rer.status.finished}">
                  <%-- this is only used for downloading incident report for successful rer's--%>
                  <div style="display:none">
                     <form action="<%=request.getContextPath()%>/secure/actions/createIncidentReportForSuccessfulReport.do" method="post">
                        <input type="hidden" name="rerId" value="<c:out value="${rerDetails.rer.id}"/>"/>
                     </form>
                  </div>
               </c:if>


            </div> <%-- end content shell --%>
         </div>



   </body>
</html>
