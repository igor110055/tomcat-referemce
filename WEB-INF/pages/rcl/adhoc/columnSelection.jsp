<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/adhoc/commonReportWizardIncludes.jsp" %>
   <title><fmt:message key="reportWizard.title"/> - <fmt:message key="reportWizard.columnSelection.title"/></title>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/ColumnSelectionUi.js"></script>


<style type="text/css">
   @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
   @import "<%=request.getContextPath()%>/styles/rcl/adhoc/reportWizard.css";
   @import "<%=request.getContextPath()%>/styles/rcl/adhoc/columnSelection.css";
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
               <div id="centerContentDiv" >

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
                        <input class="vbutton" type="button" value=">>"
                               onclick="javascript:uiController.insertSelectedColumns();"/>
                        <input class="vbutton" type="button" value="<<"
                               onclick="javascript:uiController.removeSelectedColumns();"/>
                     </div>


                     <div id="selectedColumnsContainer">
                        <div class="label"><fmt:message key="reportWizard.columnSelection.currentSelection"/></div>

                        <select size="35" id="selectedColumnsList" multiple="multiple"
                                onchange="uiController.showColumnInformation();"
                                ondblclick="uiController.showRenameSelectedColumns();">
                        </select>

                     </div>


                     <div id="rightButtons">
                        <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedUp();"
                                     altKey="reportWizard.button.moveUp" titleKey="reportWizard.button.moveUp" bundle="rcl">
                           <fmt:message key="reportWizard.button.moveUp"/>
                        </html:button>
                        <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedDown();"
                                     altKey="reportWizard.button.moveDown" titleKey="reportWizard.button.moveDown" bundle="rcl">
                           <fmt:message key="reportWizard.button.moveDown"/>
                        </html:button>

                        <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedToTop();"
                                     altKey="reportWizard.button.moveTop" titleKey="reportWizard.button.moveTop" bundle="rcl">
                           <fmt:message key="reportWizard.button.moveTop"/>
                        </html:button>
                        <html:button property="" styleClass="vbutton" onclick="uiController.shiftSelectedToBottom();"
                                     altKey="reportWizard.button.moveBottom" titleKey="reportWizard.button.moveBottom" bundle="rcl">
                           <fmt:message key="reportWizard.button.moveBottom"/>
                        </html:button>

                        <br/>

                        <html:button property="" styleClass="vbutton" onclick="uiController.sortBy();"
                                     altKey="reportWizard.columnSelection.sort" titleKey="reportWizard.columnSelection.sort" bundle="rcl">
                           <fmt:message key="reportWizard.columnSelection.sort"/>
                        </html:button>

                        <html:button property="" styleClass="vbutton" onclick="uiController.groupBy();"
                                     altKey="reportWizard.columnSelection.group" titleKey="reportWizard.columnSelection.group" bundle="rcl">
                           <fmt:message key="reportWizard.columnSelection.group"/>
                        </html:button>

                        <html:button property="" styleClass="vbutton" onclick="uiController.suppress();"
                                    altKey="reportWizard.columnSelection.suppress" titleKey="reportWizard.columnSelection.suppress" bundle="rcl">
                           <fmt:message key="reportWizard.columnSelection.suppress"/>
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

                  <div id="toolsBox">
                     <div class="label"><fmt:message key="reportWizard.columnSelection.toolTips"/></div>

                     <div style="display:'';" id="renameInstruct">
                        <fmt:message key="reportWizard.columnSelection.viewSelectedItem"/>
                        <br/>
                        <fmt:message key="reportWizard.columnSelection.doubleClickToRename"/>
                     </div>

                     <div id="columnInformation" style="display:none;">

                     </div>

                     <div id="renameQueryItem" style="display:none;">
                        <fmt:message key="reportWizard.columnSelection.newColumnLabel"/>: <input id="newQueryItemName" type="text" onkeypress="if (window.event && window.event.keyCode == 13){uiController.renameSelectedColumns();}" />
                        <br/>
                        <html:button property="" styleClass="vButton" onclick="uiController.renameSelectedColumns();"
                                     altKey="reportWizard.columnSelection.rename" titleKey="reportWizard.columnSelection.rename" bundle="rcl">
                           <fmt:message key="reportWizard.columnSelection.rename"/>
                        </html:button>
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
      var pleaseWaitDiv = new PleaseWaitDiv("rclBody", applicationResources.getProperty("reportWizard.loadingData"), document);

      var uiController;
      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         uiController = new ColumnSelectionUiController(document, wizardReport, null, pleaseWaitDiv);
         uiController.initializeUi();
      });

   </script>
</body>

</html>