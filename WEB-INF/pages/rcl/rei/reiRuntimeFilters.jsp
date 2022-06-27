<%@ page import="java.util.Locale"%>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing REI parameters...

   ---------------------------
   @author : Lance Hankins

   $Id: reiRuntimeFilters.jsp 7775 2012-05-24 18:34:03Z dbequeaith $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title><c:out value="${form.targetName}"/></title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <%@ include file="/WEB-INF/pages/rcl/rei/commonReiIncludes.jsp"%>

      <html:xhtml/>

      <%-- Calendar Includes... --%>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

      <style type="text/css" xml:space="preserve">
         @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";
      </style>

      <style type="text/css" xml:space="preserve">
         select {
            width: 100%;
         }

         <c:choose>
            <c:when test="${reiForm.targetReport.reportMetaData != null && reiForm.targetReport.reportMetaData.supportsRuntimeFilters == false}">

                 #featureNotSupported {
                     display:block;
                 }

                 #featureUi {
                     display:none;
                 }

            </c:when>
            <c:otherwise>

                 #featureNotSupported {
                     display:none;
                 }

                 #featureUi {
                     display:block;
                 }


            </c:otherwise>
         </c:choose>

      </style>
      <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp"%>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiFiltersUi.js"></script>

      <script type="text/javascript">
         // generates the JS definition of the current REI
         <c:out value="${reiForm.jsRei}" escapeXml="false"/>

         <c:if test="${reiForm.filterMessage != null && reiForm.filterMessage != ''}">
            var querySet = null;
         </c:if>

         <c:if test="${reiForm.filterMessage == null || reiForm.filterMessage == ''}">
            <c:out value="${reiForm.jsQuerySet}" escapeXml="false"/>
         </c:if>

         <c:choose>
            <c:when test="${reiForm.hasCustomPrompt}">
                var hasCustomPrompt = true;
            </c:when>
            <c:otherwise>
                var hasCustomPrompt = false;
            </c:otherwise>
         </c:choose>

         var uiModel = new ReiFiltersUiModel(rei, hasCustomPrompt, querySet);
         var uiController = new ReiFiltersUiController(document, uiModel);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
            uiController.onReiDialogResize();
         });
      </script>

   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"
         onresize="uiController.onReiDialogResize();"
         style="margin:0px;">

      <html:form action="/secure/actions/editRei" method="post">


      <div id="reiTop" class="layoutSection">
         <jsp:include page="reiWizardTop.jsp"/>
      </div>

      <div id="reiCenterContent">



      <%-----------------------------------------------%>
      <%-- BEGIN CUSTOM CONTENT FOR THIS WIZARD STEP --%>
      <%-----------------------------------------------%>

      <html:hidden property="currentStage" value="filters"/>
      <html:hidden property="queryItemRef"/>
      <html:hidden property="displayItemRef"/>
      <html:hidden property="crnPackage"/>


      <div id="featureNotSupported">
          <fmt:message key="profileWizard.filters.notSupported"/>
      </div>

      <div id="featureUi">



          <div style="display:none;" id="filterMessage">
             <c:out value="${reiForm.filterMessage}"/>
          </div>


          <table border="0" cellpadding="10px" id="filterTable" width="650px">
             <tr>
                <td colspan="3">
                   <span class="label"><fmt:message key="profileWizard.filters.currentFilters"/></span><br/>

                   <select style="width:700px" id="currentFilters" name="currentFilters" size="7" onclick="uiController.onCurrentFilterSelectionChange();">
                   </select>
                </td>
                <td>
                   <html:button property="" styleId="addButton" onclick="uiController.addNewFilter();"
                                altKey="profileWizard.button.add.alt" titleKey="profileWizard.button.add.title" bundle="rcl">
                      <fmt:message key="profileWizard.button.add"/>
                   </html:button>
                   <br/>
                   <html:button property="" styleId="editButton" disabled="true" onclick="uiController.editExistingFilter();"
                                altKey="profileWizard.button.edit" titleKey="profileWizard.button.edit" bundle="rcl">
                      <fmt:message key="profileWizard.button.edit"/>
                   </html:button>
                   <br/>
                   <html:button property="" styleId="deleteButton" disabled="true" onclick="uiController.deleteSelectedFilters();"
                                altKey="profileWizard.button.delete.alt" titleKey="profileWizard.button.delete.title" bundle="rcl">
                      <fmt:message key="profileWizard.button.delete"/>
                   </html:button>

                </td>
             </tr>
             <tr id="newFilterRow">
                <td colspan="3">
                   <span class="label"><fmt:message key="profileWizard.filters.newRuntimeFilters"/></span><br/>

                   <textarea rows="5" id="filterExpr" name="filterExpr" cols="15" style="width:700px" disabled="disabled">
                   </textarea>
                </td>
                <td id="saveCancelButtons"  style="display:none">
                   <html:button property="" styleId="saveButton" onclick="uiController.saveActiveFilter();" disabled="disabled"
                           altKey="profileWizard.button.save.alt" titleKey="profileWizard.button.save.title" bundle="rcl">
                      <fmt:message key="profileWizard.button.save"/>
                   </html:button>
                   <br/>
                   <br/>
                   <html:button property="" styleId="cancelButton" onclick="uiController.cancelActiveFilter();" disabled="disabled"
                                altKey="profileWizard.button.cancel.alt" titleKey="profileWizard.button.cancel.title" bundle="rcl">
                      <fmt:message key="profileWizard.button.cancel"/>
                   </html:button>
                </td>
             </tr>
             <tr id="newFilterDefRow" style="display:none" valign="top">
                <td width="150px">
                   <span class="label"><fmt:message key="profileWizard.filters.query"/></span><br/>

                   <select id="queryList"
                     size="10"
                     onchange="uiController.onQuerySelectionChanged();">
                   </select>

                </td>

                <td width="350px">
                   <span class="label"><fmt:message key="profileWizard.filters.column"/></span><br/>

                   <select id="queryItemList"
                     size="10"
                     onchange="uiController.onQueryItemSelectionChanged(true);">
                   </select>


                </td>
                <td width="150px">
                   <span class="label"><fmt:message key="profileWizard.filters.relation"/></span><br/>

                   <select id="relationList"
                     size="10"
                     onchange="uiController.onRelationChange();">
                   </select>

                </td>

                <td width="150px" id="valueColumn">
                   <span class="label">Value</span><br/>

                   <input id="manualFilterValue" type="text" onchange="uiController.onManualFilterValueChange();"/>
                   <html:button  property="" styleId="launchValuePickerButton" onclick="uiController.showValuePicker();"
                                altKey="profileWizard.button.launchValuePicker.alt" titleKey="profileWizard.button.launchValuePicker.title" bundle="rcl">
                      <fmt:message key="profileWizard.button.launchValuePicker"/>
                   </html:button>
                   <div id="datePicker" style="display:none;">
                      <input type="text" id="filterDate" size="15" onchange="uiController.onDateValueChange();" />
                      <input type="button" value="..." id="pickFilterDateButton">
                   </div>
                </td>

                <td width="150px" id="dateRangeColumn" style="display:none">
                   <span class="label"><fmt:message key="profileWizard.filters.value"/></span><br/>
                   <br/>
                   <fmt:message key="profileWizard.filters.between"/>
                   <div>
                      <input type="text" id="startDate" size="15" onchange="uiController.onDateRangeValueChange();" disabled="disabled"/>
                      <input type="button" value="..." id="pickStartDateButton">
                      <fmt:message key="profileWizard.filters.and"/>
                      <br/>
                      <input type="text" id="endDate" size="15" onchange="uiController.onDateRangeValueChange();" disabled="disabled"/>
                      <input type="button" value="..." id="pickEndDateButton">
                   </div>
                </td>

             </tr>
          </table>



      </div>




      



      <%-----------------------------------------------%>
      <%--  END CUSTOM CONTENT FOR THIS WIZARD STEP  --%>
      <%-----------------------------------------------%>



      </div>

      <div id="reiBottom" class="layoutSection">
         <jsp:include page="reiWizardBottom.jsp"/>
      </div>


         <!-- Standard Fields in each of the eidt rei forms... -->
         <html:hidden property="saveAsNewProfileName"/>

         <html:hidden property="targetId"/>
         <html:hidden property="targetName"/>
         <html:hidden property="targetType"/>
         <html:hidden property="privateProfile"/>
         <html:hidden property="saveToFolderPath"/>
         <html:hidden property="emailServerDestinationId"/>      

         <html:hidden property="hasCustomPrompt"/>
         <html:hidden property="customPromptUrl"/>
         <html:hidden property="saveToFolderId"/>
         <html:hidden property="initialEntryPoint"/>
         <html:hidden property="jumpTo" value=""/>
         <html:hidden property="viewGesture" value=""/>
         <html:hidden property="reiXml" value=""/>
         <html:hidden property="defaultReiXml"/>



      </html:form>
      

   </body>
</html>



