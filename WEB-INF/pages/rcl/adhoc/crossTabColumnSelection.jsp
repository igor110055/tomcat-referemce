<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/adhoc/commonReportWizardIncludes.jsp" %>
   <title><fmt:message key="reportWizard.title"/> - <fmt:message key="reportWizard.columnSelection.title"/></title>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/CrossTabColumnSelectionUi.js"></script>

<style type="text/css">
   @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
   @import "<%=request.getContextPath()%>/styles/rcl/adhoc/reportWizard.css";
   @import "<%=request.getContextPath()%>/styles/rcl/adhoc/crossTabColumnSelection.css";
   @import "<%=request.getContextPath()%>/styles/rcl/pleaseWaitDiv.css";
</style>


</head>

<body class="rclBody" style="margin:0px;"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">



   <html:form action="/secure/actions/reportWizard.do">

      <%-- standard wizard fields --%>
      <html:hidden property="wizardStep" value="columnSelection"/>
      <html:hidden styleId="jumpTo" property="jumpTo" value=""/>
      <html:hidden styleId="viewGesture" property="viewGesture" value=""/>
      <html:hidden styleId="wizardXml" property="wizardXml" value=""/>
      <html:hidden styleId="responseFormat" property="responseFormat" value=""/>
      <html:hidden styleId="reiXml" property="reiXml" value=""/>


      <table id="rwOuterLayout" cellspacing="0" cellpadding="1">
         <tr>
            <td id="header" colspan="2">
               <div class="layoutSection">
                  <jsp:include page="reportWizardTop.jsp"/>

               </div>
            </td>
         </tr>
         <tr>
            <td id="content" colspan="2">
               <div id="centerContentDiv">

                  <%-----------------------------------------------%>
                  <%-- BEGIN CUSTOM CONTENT FOR THIS WIZARD STEP --%>
                  <%-----------------------------------------------%>

                  <div id="lhsDiv">
                     <div class="label"><fmt:message key="reportWizard.columnSelection.availableColumns"/></div>

                     <div id="mdTreeContainer">
                        <div style="margin: 150px 10px 0px 20px;"><fmt:message key="reportWizard.loadingModel"/></div>
                     </div>

                     <div id="currentSelectionInfoContainer">
                        <div class="label"><fmt:message key="reportWizard.information"/></div>
                        <div id="currentSelectionInfo"></div>
                     </div>

                  </div>

                  <div id="rhsDiv">
                     <div id="centerButtons">
                        <html:button property="" styleClass="vbutton" onclick="javascript:uiController.addRow();"
                                     altKey="reportWizard.columnSelection.addRow" titleKey="reportWizard.columnSelection.addRow" bundle="rcl">
                           <fmt:message key="reportWizard.columnSelection.addRow"/>
                        </html:button>

                        <html:button property="" styleClass="vbutton" onclick="javascript:uiController.addColumn();"
                                     altKey="reportWizard.columnSelection.addColumn" titleKey="reportWizard.columnSelection.addColumn" bundle="rcl">
                           <fmt:message key="reportWizard.columnSelection.addColumn"/>
                        </html:button>
                        <html:button property="" styleClass="vbutton" onclick="javascript:uiController.addMeasure();"
                                     altKey="reportWizard.columnSelection.addMeasure" titleKey="reportWizard.columnSelection.addMeasure" bundle="rcl">
                           <fmt:message key="reportWizard.columnSelection.addMeasure"/>
                        </html:button>
                        <html:button property="" styleClass="vbutton" onclick="javascript:uiController.removeSelectedColumns();"
                                     altKey="reportWizard.columnSelection.remove" titleKey="reportWizard.columnSelection.remove" bundle="rcl">
                           <fmt:message key="reportWizard.columnSelection.remove"/>
                        </html:button>
                     </div>


                     <div id="selectedColumnsContainer">
                        <div id="crosstabColumnsContainer">
                           <div class="label"><fmt:message key="reportWizard.columnSelection.columns"/></div>
                           <select size="4" id="crosstabColumnsList" multiple="multiple" onclick="uiController.onColumnsListClick();">
                           </select>

                        </div>

                        <div id="crosstabRowsContainer">
                           <div class="label"><fmt:message key="reportWizard.columnSelection.rows"/></div>
                           <select size="11" id="crosstabRowsList" multiple="multiple" onclick="uiController.onRowsListClick();">
                           </select>
                        </div>

                        <div id="crosstabMeasuresContainer">
                           <div class="label"><fmt:message key="reportWizard.columnSelection.measures"/></div>

                           <select size="11" id="crosstabMeasuresList" multiple="multiple" onclick="uiController.onMeasuresListClick();">
                           </select>
                        </div>
                     </div>



                     <div id="currentSelectionActions">

<%--
                        <div id="propertyEditor">
                           Property editor goes here
                        </div>
--%>

                        <div id="columnActions">
                           <div class="label"><fmt:message key="reportWizard.columnSelection.columnActions"/></div>
                           <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedUp();"
                                        altKey="reportWizard.button.moveUp" titleKey="reportWizard.button.moveUp" bundle="rcl">
                              <fmt:message key="reportWizard.button.moveUp"/>
                           </html:button>
                           <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedDown();"
                                        altKey="reportWizard.button.moveDown" titleKey="reportWizard.button.moveDown" bundle="rcl">
                              <fmt:message key="reportWizard.button.moveDown"/>
                           </html:button>
                           <br/>
                           <html:button property="" styleClass="vbutton" onclick="uiController.sortSelected();"
                                        altKey="reportWizard.columnSelection.sort" titleKey="reportWizard.columnSelection.sort" bundle="rcl">
                              <fmt:message key="reportWizard.columnSelection.sort"/>
                           </html:button>
                           <br/>
                        </div>

                        <div id="rowActions">
                           <div class="label"><fmt:message key="reportWizard.columnSelection.rowActions"/></div>
                           <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedUp();"
                                        altKey="reportWizard.button.moveUp" titleKey="reportWizard.button.moveUp" bundle="rcl">
                              <fmt:message key="reportWizard.button.moveUp"/>
                           </html:button>

                           <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedDown();"
                                        altKey="reportWizard.button.moveDown" titleKey="reportWizard.button.moveDown" bundle="rcl">
                              <fmt:message key="reportWizard.button.moveDown"/>
                           </html:button>

                           <br/>
                           <html:button property="" styleClass="vbutton" onclick="uiController.sortSelected();"
                                        altKey="reportWizard.columnSelection.sort" titleKey="reportWizard.columnSelection.sort" bundle="rcl">
                              <fmt:message key="reportWizard.columnSelection.sort"/>
                           </html:button>

                           <br/>
                        </div>

                        <div id="measureActions">
                           <div class="label"><fmt:message key="reportWizard.columnSelection.measureActions"/></div>
                           <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedUp();"
                                        altKey="reportWizard.button.moveUp" titleKey="reportWizard.button.moveUp" bundle="rcl">
                              <fmt:message key="reportWizard.button.moveUp"/>
                           </html:button>
                           <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedDown();"
                                        altKey="reportWizard.button.moveDown" titleKey="reportWizard.button.moveDown" bundle="rcl">
                              <fmt:message key="reportWizard.button.moveDown"/>
                           </html:button>

                           <br/>
                           <html:button property="" styleClass="vbutton" onclick="uiController.applyAggregateFunction(AggregateFunctionEnum.COUNT);"
                                        altKey="reportWizard.columnSelection.count" titleKey="reportWizard.columnSelection.count" bundle="rcl">
                              <fmt:message key="reportWizard.columnSelection.count"/>
                           </html:button>
                           <html:button property="" styleClass="vbutton" onclick="uiController.applyAggregateFunction(AggregateFunctionEnum.TOTAL);"
                                        altKey="reportWizard.columnSelection.total" titleKey="reportWizard.columnSelection.total" bundle="rcl">
                              <fmt:message key="reportWizard.columnSelection.total"/>
                           </html:button>
                           <html:button property="" styleClass="vbutton" onclick="uiController.applyAggregateFunction(AggregateFunctionEnum.AVERAGE);"
                                        altKey="reportWizard.columnSelection.average" titleKey="reportWizard.columnSelection.average" bundle="rcl">
                              <fmt:message key="reportWizard.columnSelection.average"/>
                           </html:button>

                        </div>
                     </div>


                  </div>


               <%-----------------------------------------------%>
               <%-- END CUSTOM CONTENT FOR THIS WIZARD STEP   --%>
               <%-----------------------------------------------%>
               </div>

            </td>
         </tr>
         <tr>
            <td id="footer" colspan="2">
               <div class="layoutSection">
                  <jsp:include page="reportWizardBottom.jsp"/>
               </div>
            </td>
         </tr>
      </table>

   </html:form>
   <script type="text/javascript">
      <c:out value="${form.jsWizardReport}" escapeXml="false"/>
      var pleaseWaitDiv = new PleaseWaitDiv("rclBody", applicationResources.getProperty("reportWizard.loadingModel"));

      var uiController;
      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         beginPleaseWaitDiv();
      });

       function beginPleaseWaitDiv()
       {
          SelectFieldDisplayController.getInstance().hideAllSelects();
          pleaseWaitDiv.begin();
          setTimeout("uiController = new CrossTabColumnSelectionUiController(document, wizardReport, null, pleaseWaitDiv);uiController.initializeUi();SelectFieldDisplayController.getInstance().restoreHiddenSelects();", 1 );
       }
   </script>
</body>

</html>