<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   Displays Debug Information on an RER (useful for debugging)

   ---------------------------
   @author : David Paul (dpaul@inmotio.com)

   $Id: debugRer.jsp 7364 2011-03-10 21:23:27Z lhankins $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>

      <title>Debug RER Screen</title>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <style type="text/css">
         <%--@import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";--%>
         @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
         @import "<%= request.getContextPath() %>/styles/rcl/rerDetails.css";

         fieldset {
            padding:10px;
         }

         div.xml {
            float: left;
            margin: 10px 3px 10px 3px;
         }

         #transitionTimesPanel {
            width: 400px;
         }
         #transitionTimesPanel div.scrollDiv {
            height: 240px;
         }
         #parametersPanel .scrollDiv {
            height: 400px;
         }

         #runtimeFiltersPanel div.scrollDiv {
            height: auto;
         }

         #runtimeFiltersPanel, #postProcessorPanel, #outputProcessorPanel, #preProcessorPanel {
            width: 900px;
         }

         #runtimeFiltersPanel div.scrollDiv, #postProcessorPanel div.scrollDiv, #outputProcessorPanel div.scrollDiv, #preProcessorPanel div.scrollDiv {
            width: 840px;
         }


      </style>

      <script type="text/javascript">
         /* <![CDATA[ */
      
         function downloadIncidentReport ()
         {
            // we'll set the target for people who use IE as their native XML viewer (that way it
            // doesn't overwrite the main RCL window)
            document.forms[0].target = ServerEnvironment.windowNamePrefix + "_IncidentReport_" + document.forms[0].rerId.value;
            document.forms[0].submit();
         }

         function openInStudio(type, rerId)
         {
            var url = ServerEnvironment.baseUrl + "/secure/actions/saveAndOpenInReportStudio.do?rerId=" + rerId + "&specType=" + type;

            var windowName = ServerEnvironment.windowNamePrefix + "_ReportStudioFor_" + rerId + "_" + type;
            var win = JsUtil.openNewWindow(url,
                    windowName,
                    "width=1010,height=693,top=0,left=0,menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
            win.focus();
         }
         /* ]]> */
      </script>


   </head>

   <body class="rclBody" style="overflow:auto"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">



      <div style="overflow:auto">
         <h4>Debug Info for Rer <c:out value="${form.rerId}"/> (<c:out value="${form.reportName}"/>)</h4>

         <fieldset>
            <legend>XML Related to this RER</legend>

               <table>
                  <tr>
                     <td>
                        <div class="xml">
                           <div class="label">Modified Report Spec Xml</div>
                           <textarea rows="10" cols="100"><c:out value="${form.modifiedReportSpecXml}"/></textarea>
                        </div>
                     </td>
                     <td>
                        <div>
                           <a href="#" onclick="openInStudio('modified', <c:out value="${form.rerId}"/>)">Open Modified Spec In Report Studio</a>
                        </div>
                     </td>
                  </tr>
                  <tr>
                     <td>
                        <div class="xml">
                           <div class="label">Original Report Spec Xml</div>
                           <textarea rows="10" cols="100"><c:out value="${form.originalReportSpecXml}"/></textarea>
                        </div>
                     </td>
                     <td>
                        <div>
                           <a href="#" onclick="openInStudio('original', <c:out value="${form.rerId}"/>)">Open Copy Of Original Spec In Report Studio</a>
                        </div>
                     </td>
                  </tr>
               </table>


            <div class="xml">
               <div class="label">REI Xml</div>
               <textarea rows="10" cols="100"><c:out value="${form.reiXml}"/></textarea>
            </div>

         </fieldset>


         <fieldset>
            <legend>General RER Info</legend>

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
                              <c:out value="${form.reportName}"/>
                           </td>
                        </tr>

                        <c:if test="${form.targetProfile}">
                           <tr>
                              <td class="propertyLabel">
                                 <fmt:message key="propertiesPanel.label.reportProfileName"/>
                              </td>
                              <td class="propertyValue">
                                 <c:out value="${form.profileName}"/>
                              </td>
                           </tr>

                        </c:if>

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
               Actions
               ######################################################################
               --%>

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


            </div>


            <div id="rightColumn">


               <%--
               ######################################################################
               Transistion Times Panel
               ######################################################################
               --%>
               <rcl:panel styleId="transitionTimesPanel" titleKey="propertiesPanel.title.transitionTimes">


                  <div class="scrollDiv">
                     <table class="properties">
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.createdTime"/>
                           </td>
                           <td class="propertyValue">
                              <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.createdTime}"/>
                           </td>
                        </tr>

                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.enquedTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.enquedTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.enquedTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>



                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.preExecutionStartTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.preExecutionStartTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.preExecutionStartTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.preExecutionEndTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.preExecutionEndTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.preExecutionEndTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>

                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.executionStartTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.executionStartTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.executionStartTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.executionEndTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.executionEndTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.executionEndTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>

                         <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.downloadStartTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.downloadStartTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.downloadStartTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.downloadEndTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.downloadEndTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.downloadEndTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>


                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.postExecutionStartTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.postExecutionStartTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.postExecutionStartTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>
                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.postExecutionEndTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.postExecutionEndTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.postExecutionEndTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>

                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.finishedTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.finishedTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.finishedTime}"/>
                                 </c:when>
                                 <c:otherwise>--</c:otherwise>
                              </c:choose>
                           </td>
                        </tr>


                        <tr>
                           <td class="propertyLabel">
                              <fmt:message key="propertiesPanel.label.finalStateTime"/>
                           </td>
                           <td class="propertyValue">
                              <c:choose>
                                 <c:when test="${rerDetails.rerSummary.transitionTimes.finalStateTime!=null}">
                                    <rcl:fmtDateAndTime value="${rerDetails.rerSummary.transitionTimes.finalStateTime}"/>
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
                                       <a target="debugRerReportOutput_<c:out value="${form.rerId}"/>" href="<%=request.getContextPath()%>/secure/reportOutputs/<c:out value="${form.rerId}"/>.<c:out value="${eachOutputSummary.outputFormat.name}"/>">
                                          <c:out value="${eachOutputSummary.outputFormat.displayValue}"/>
                                       </a>
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
                        </tbody>
                     </table>
                  </div>

               </rcl:panel>


               <%--
               ######################################################################
               Stats Panel
               ######################################################################
               --%>
               <rcl:panel styleId="statsPanel" title="Execution Statistics">

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

         </fieldset>
      

         <fieldset>
            <legend>Processors, Runtime Content Adjustments, Etc.</legend>


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




            <%--
            ######################################################################
            Pre Execution Processors Chain Panel
            ######################################################################
            --%>

            <rcl:panel styleId="preProcessorPanel" titleKey="propertiesPanel.title.preProcessorChain">
               <c:choose>
                  <c:when test="${rerTarget.rerPreExecutionProcessorsChain.rerProcessorChainLinks != null}">
                     <div class="scrollDiv">

                        <table class="properties">
                           <thead>
                              <tr>
                                 <td>
                                    Pre-Execution Chain Name:
                                 </td>
                                 <td class="propertyValue">
                                    <c:out value="${rerTarget.rerPreExecutionProcessorsChain.name}"/>
                                 </td>
                              </tr>
                              <tr>
                                 <td colspan="2">&nbsp;</td>
                              </tr>
                              <tr class="summaryRow">
                                 <th>
                                    Class Name
                                 </th>
                                 <th>
                                    Extra Args
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                           <c:forEach var="eachParam" items="${rerTarget.rerPreExecutionProcessorsChain.calculatedLinks}">
                              <tr>
                                 <td class="propertyName"><c:out value="${eachParam.processorClassName}"/></td>
                                 <td class="paramValue">
                                       <c:out value="${eachParam.extraArgs}"/>
                                 </td>
                              </tr>
                           </c:forEach>
                           </tbody>
                        </table>

                     </div>
                  </c:when>
                  <c:when test="${form.preSize > 0 && rerTarget.rerPreExecutionProcessorsChain.rerProcessorChainLinks == null}">
                     <div class="scrollDiv">
                        <c:out value="${form.defaultPre.name}"/> <br/>
                           <table class="properties">
                               <thead>
                                  <tr>
                                     <th style="width:100px;">
                                        Class Name
                                     </th>
                                     <th>
                                        Extra Args
                                     </th>
                                  </tr>
                               </thead>
                               <tbody>
                               <c:forEach var="eachParam" items="${form.defaultPre.rerProcessorChainLinks}">
                                  <tr>
                                     <td class="propertyName"><c:out value="${eachParam.processorClassName}"/></td>
                                     <td class="paramValue">
                                           <c:out value="${eachParam.extraArgs}"/>
                                     </td>
                                  </tr>
                               </c:forEach>
                                </tbody>
                            </table>
                         </div>
                  </c:when>
                  <c:otherwise>
                     <div class="scrollDiv">
                        <c:out value="${form.defaultPre.name}"/> <br/>
                      <fmt:message key="propertiesPanel.noProcessorChainLinks"/>
                    </div>
                  </c:otherwise>
               </c:choose>

            </rcl:panel>

            <%--
            ######################################################################
            Output Execution Processors Chain Panel
            ######################################################################
            --%>

            <rcl:panel styleId="outputProcessorPanel" titleKey="propertiesPanel.title.outputProcessorChain">
               <c:choose>
                  <c:when test="${rerTarget.rerOutputExecutionProcessorsChain.rerProcessorChainLinks != null}">
                     <div class="scrollDiv">

                        <table class="properties">
                           <thead>
                              <tr>
                                 <td class="propertyName">
                                    Chain Name
                                 </td>
                                 <td class="paramValue">
                                    <c:out value="${rerTarget.rerOutputExecutionProcessorsChain.name}"/>
                                 </td>
                              </tr>


                              <tr class="summaryRow">
                                 <th style="width:100px;">
                                    Class Name
                                 </th>
                                 <th>
                                    Extra Args
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                           <c:forEach var="eachParam" items="${rerTarget.rerOutputExecutionProcessorsChain.calculatedLinks}">
                              <tr>
                                 <td class="propertyName"><c:out value="${eachParam.processorClassName}"/></td>
                                 <td class="paramValue">
                                       <c:out value="${eachParam.extraArgs}"/>
                                 </td>
                              </tr>
                           </c:forEach>
                           </tbody>
                        </table>

                     </div>
                  </c:when>
                  <c:when test="${form.outputSize > 0 && rerTarget.rerOutputExecutionProcessorsChain.rerProcessorChainLinks == null}">
                     <div class="scrollDiv">
                        <c:out value="${form.defaultOutput.name}"/> <br/>
                           <table class="properties">
                               <thead>
                                  <tr>
                                     <th style="width:100px;">
                                        Class Name
                                     </th>
                                     <th>
                                        Extra Args
                                     </th>
                                  </tr>
                               </thead>
                               <tbody>
                               <c:forEach var="eachParam" items="${form.defaultOutput.rerProcessorChainLinks}">
                                  <tr>
                                     <td class="propertyName"><c:out value="${eachParam.processorClassName}"/></td>
                                     <td class="paramValue">
                                           <c:out value="${eachParam.extraArgs}"/>
                                     </td>
                                  </tr>
                               </c:forEach>
                                </tbody>
                            </table>
                         </div>
                  </c:when>
                  <c:otherwise>
                     <div class="scrollDiv">
                        <c:out value="${form.defaultOutput.name}"/> <br/>
                      <fmt:message key="propertiesPanel.noProcessorChainLinks"/>
                    </div>
                  </c:otherwise>
               </c:choose>

            </rcl:panel>

            <%--
            ######################################################################
            Post Execution Processors Chain Panel
            ######################################################################
            --%>

            <rcl:panel styleId="postProcessorPanel" titleKey="propertiesPanel.title.postProcessorChain">
               <c:choose>
                  <c:when test="${rerTarget.rerPostExecutionProcessorsChain.rerProcessorChainLinks != null}">
                     <div class="scrollDiv">
                        <c:out value="${rerTarget.rerPostExecutionProcessorsChain.name}"/> <br/>
                        <table class="properties">
                           <thead>
                              <tr>
                                 <th style="width:100px;">
                                    Class Name
                                 </th>
                                 <th>
                                    Extra Args
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                           <c:forEach var="eachParam" items="${rerTarget.rerPostExecutionProcessorsChain.calculatedLinks}">
                              <tr>
                                 <td class="propertyName"><c:out value="${eachParam.processorClassName}"/></td>
                                 <td class="paramValue">
                                       <c:out value="${eachParam.extraArgs}"/>
                                 </td>
                              </tr>
                           </c:forEach>
                           </tbody>
                        </table>

                     </div>
                  </c:when>
                  <c:when test="${form.postSize > 0 && rerTarget.rerPostExecutionProcessorsChain.rerProcessorChainLinks == null}">
                     <div class="scrollDiv">
                        <c:out value="${form.defaultPost.name}"/> <br/>
                           <table class="properties">
                               <thead>
                                  <tr>
                                     <th style="width:100px;">
                                        Class Name
                                     </th>
                                     <th>
                                        Extra Args
                                     </th>
                                  </tr>
                               </thead>
                               <tbody>
                               <c:forEach var="eachParam" items="${form.defaultPost.rerProcessorChainLinks}">
                                  <tr>
                                     <td class="propertyName"><c:out value="${eachParam.processorClassName}"/></td>
                                     <td class="paramValue">
                                           <c:out value="${eachParam.extraArgs}"/>
                                     </td>
                                  </tr>
                               </c:forEach>
                                </tbody>
                            </table>
                         </div>
                  </c:when>
                  <c:otherwise>
                     <div class="scrollDiv">
                        <c:out value="${form.defaultPost.name}"/> <br/>
                      <fmt:message key="propertiesPanel.noProcessorChainLinks"/>
                    </div>
                  </c:otherwise>
               </c:choose>

            </rcl:panel>


         </fieldset>
      </div>









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


   </body>
</html>