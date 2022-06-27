<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/adhoc/commonReportWizardIncludes.jsp" %>
   <title><fmt:message key="reportWizard.title"/> - <fmt:message key="reportWizard.filters.title"/></title>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/FilterUi.js"></script>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
      @import "<%=request.getContextPath()%>/styles/rcl/tabBar.css";
      @import "<%=request.getContextPath()%>/styles/rcl/adhoc/reportWizard.css";
      @import "<%=request.getContextPath()%>/styles/rcl/adhoc/filter.css";
      @import "<%=request.getContextPath()%>/styles/rcl/pleaseWaitDiv.css";
   </style>


</head>

<body class="rclBody" style="margin:0px;"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/reportWizard.do">

         <%-- standard wizard fields --%>
      <html:hidden property="wizardStep" value="filter"/>
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

                  <div style="padding:10px 0px 0px 10px;">
                     <div id="lhsDiv">

                        <div id="tabBarContainer">
                        </div>
                        <div id="mdModelContainer" class="lhsTreeContainer">
                           <div id="mdTreeContainer">
                              <div style="margin: 150px 10px 0px 20px;"><fmt:message key="reportWizard.loadingModel"/></div>
                              <%-- crn model tree will be inserted here --%>
                           </div>
                        </div>
                        <div id="currentColumnsContainer" class="lhsTreeContainer">
                           <div id="currentColumnsTreeContainer">
                           <%-- current columns tree will be inserted here --%>
                           </div>
                        </div>

                        <div id="functionMdContainer" class="lhsTreeContainer">
                           <div id="functionMdTreeContainer">
                           <%-- function MD tree will be inserted here --%>
                           </div>
                        </div>

                        <div id="currentSelectionInfoContainer">
                           <div class="label"><fmt:message key="reportWizard.information"/></div>
                           <div id="currentSelectionInfo"></div>
                        </div>
                        
                     </div>


                     <div id="rhsDiv">
                        <div id="centerButtons">
                           <input id="insertValueButton" class="vbutton" type="button" value=">>" onclick="javascript:uiController.insertSelected();" disabled="disabled"/>
                        </div>


                        <div id="availableFiltersContainer">
                           <div class="label"><fmt:message key="reportWizard.filters.currentFilters"/></div>
                           <select id="availableFilters" size="4" multiple="multiple" onchange="uiController.onAvailableFiltersChange();">
                              <%-- current filters inserted here --%>
                           </select>
                           <div>
                              <html:button property="" onclick="uiController.addNewFilter();"
                                           altKey="reportWizard.add" titleKey="reportWizard.add" bundle="rcl">
                                 <fmt:message key="reportWizard.add"/>
                              </html:button>
                              <html:button property="" disabled="disabled" styleId="deleteButton" onclick="uiController.deleteSelectedFilters();"
                                           altKey="reportWizard.delete" titleKey="reportWizard.delete" bundle="rcl">
                                 <fmt:message key="reportWizard.delete"/>
                              </html:button>
                           </div>
                        </div>

                        <div id="activeFilterContainer">
                           <div class="label"><fmt:message key="reportWizard.filters.filterName"/></div>
                           <input type="text" name="filterName" size="40"/>

                           <div class="label"><fmt:message key="reportWizard.filters.filterExpression"/></div>
                           <textarea cols="40" rows="5" name="filterExpression" id="filterExpression"></textarea>

                           <div>
                              <html:button property="" styleId="saveButton" onclick="uiController.saveActiveFilter();" disabled="disabled"
                                           altKey="reportWizard.save" titleKey="reportWizard.save" bundle="rcl">
                                 <fmt:message key="reportWizard.save"/>
                              </html:button>
                              <html:button property="" styleId="cancelButton" onclick="uiController.cancelActiveFilter();" disabled="disabled"
                                           altKey="reportWizard.cancel" titleKey="reportWizard.cancel" bundle="rcl">
                                 <fmt:message key="reportWizard.cancel"/>
                              </html:button>
                           </div>
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
      var pleaseWaitDiv = new PleaseWaitDiv("rclBody", applicationResources.getProperty("reportWizard.loadingData"), document);

      var uiController;
      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         uiController = new FilterUiController(document, wizardReport, null, pleaseWaitDiv);
         uiController.initializeUi();
      });

   </script>

</body>

</html>