<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing REI sorts...

   ---------------------------
   @author : Lance Hankins
   
   $Id: reiSorts.jsp 7015 2009-11-16 02:44:32Z lhankins $

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

      <style type="text/css" xml:space="preserve">
         @import "<%=request.getContextPath()%>/styles/rcl/reiSorts.css";

         /** Override this to make it lower in prompt screens **/
         .centeredMessage {
            position:absolute !important;
            left:35%;
            top: 55%;
         }

         select {
            width:100%;
         }

         <c:choose>
            <c:when test="${reiForm.targetReport.reportMetaData != null && reiForm.targetReport.reportMetaData.supportsModifySorts == false}">

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

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiSortsUi.js"></script>

      <script type="text/javascript">
         // generates the JS definition of the current REI
         <c:out value="${reiForm.jsRei}" escapeXml="false"/>

         <c:choose>
            <c:when test="${reiForm.hasCustomPrompt}">
                var hasCustomPrompt = true;
            </c:when>
            <c:otherwise>
                var hasCustomPrompt = false;
            </c:otherwise>
         </c:choose>

         <c:out value="${reiForm.jsBiQuerySet}" escapeXml="false"/>
         <c:out value="${reiForm.jsVisualContainers}" escapeXml="false"/>


         var uiModel = new ReiSortsUiModel(rei, hasCustomPrompt, biQuerySet, visualContainers);
         var uiController = new ReiSortsUiController(document, uiModel);

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

         <html:hidden property="currentStage" value="sorts"/>

          <div id="featureNotSupported">
              <fmt:message key="profileWizard.sorts.notSupported"/>
          </div>

          <div id="featureUi">


              <div id="defaultsContainerDiv">
                 <div class="label" style="margin-bottom:5px;">Default Sorts for <c:out value="${form.targetName}"/></div>

                 <div id="containersDiv" >
                    <div class="label"><fmt:message key="profileWizard.sorts.containers"/></div>
                    <select id="containers" size="10" onchange="uiController.containerSelectionChanged();">
                    </select>
                 </div>

                 <div id="columnsDiv">
                    <div class="label"><fmt:message key="profileWizard.sorts.columns"/></div>
                    <select id="columns"  multiple="multiple" size="10" disabled="disabled">
                    </select>
                 </div>

                 <div id="defaultSortsDiv">
                    <div class="label"><fmt:message key="profileWizard.sorts.defaultSortOrder"/></div>
                    <select id="defaultSorts" multiple="multiple" size="10" disabled="disabled">
                    </select>
                 </div>

                 <div id="operationsDiv">
                    <html:button property="" styleId="addOverrideButton" style="display:none" onclick="uiController.addSortOverrides();" styleClass="reiSortModButton1_lang"
                                 altKey="profileWizard.button.sorts.addOverride.alt" titleKey="profileWizard.button.sorts.addOverride.title" bundle="rcl">
                       <fmt:message key="profileWizard.button.sorts.addOverride"/>
                    </html:button>
                    <html:button property="" styleId="editOverrideButton" value="Edit Override" style="display:none" onclick="uiController.editSortOverrides();" styleClass="reiSortModButton1_lang"
                                 altKey="profileWizard.button.sorts.editOverride.alt" titleKey="profileWizard.button.sorts.editOverride.title" bundle="rcl">
                       <fmt:message key="profileWizard.button.sorts.editOverride"/>
                    </html:button>
                    <html:button property="" styleId="removeOverrideButton" value="Remove Override" style="display:none" onclick="uiController.removeSortOverrides();" styleClass="reiSortModButton1_lang"
                                 altKey="profileWizard.button.sorts.removeOverride.alt" titleKey="profileWizard.button.sorts.removeOverride.title" bundle="rcl">
                       <fmt:message key="profileWizard.button.sorts.removeOverride"/>
                    </html:button>
                 </div>
                 <div style="clear:both">
                       <%-- addresses firefox issue with floating divs inside a container div --%>
                 </div>
              </div>


              <div id="overrideDisplayDiv">
                 <div class="label" style="margin-bottom:5px;">Current Sort Overrides</div>
                 <div id="currentOverridesDescription">
                 </div>
              </div>

              <div id="overrideContainerDiv">
                 <div class="label" style="margin-bottom:5px;"><fmt:message key="profileWizard.sorts.overridesFor"/><span id="currentQueryName"></span></div>

                 <div id="availColumnsDiv">
                    <div class="label"><fmt:message key="profileWizard.sorts.availableColumns"/></div>
                    <select id="overrideAvailableColumns"  multiple="multiple" size="10">
                    </select>
                 </div>

                 <div id="operations2Div">
                    <input type="button" value=">>" onclick="uiController.addSortColumn();"/>
                    <input type="button" value="<<" onclick="uiController.removeSortColumn();"/>
                 </div>

                 <div id="overrideSortsDiv">
                    <div class="label"><fmt:message key="profileWizard.sorts.newSorts"/></div>
                    <select id="overrideSorts"  multiple="multiple" size="10">
                    </select>

                    <div id="sortPrecedenceNote">
                       <span style="font-weight:bold;">NOTE:</span> Results data will be grouped before it is sorted. For this reason, grouped columns will always have the highest sort precedence.
                    </div>
                 </div>

                 <div id="operations3Div">
                    <html:button property="" onclick="uiController.shiftSelectedSortsUp();"
                                 altKey="reportWizard.button.moveUp" titleKey="reportWizard.button.moveUp" bundle="rcl" styleClass="reiSortModButton2_lang">
                       <fmt:message key="reportWizard.button.moveUp"/>
                    </html:button>
                    <html:button property="" onclick="uiController.shiftSelectedSortsDown();"
                                 altKey="reportWizard.button.moveDown" titleKey="reportWizard.button.moveDown" bundle="rcl" styleClass="reiSortModButton2_lang">
                       <fmt:message key="reportWizard.button.moveDown"/>
                    </html:button>
                    <html:button property="" onclick="uiController.toggleSelectedSortDirections();"
                                 altKey="profileWizard.button.direction.alt" titleKey="profileWizard.button.direction.title" bundle="rcl" styleClass="reiSortModButton2_lang">
                       <fmt:message key="profileWizard.button.direction"/>
                    </html:button>
                    <br/>
                    <html:button property="" onclick="uiController.saveCurrentOverrides();"
                                 altKey="profileWizard.button.save.alt" titleKey="profileWizard.button.save.title" bundle="rcl" styleClass="reiSortModButton2_lang">
                       <fmt:message key="profileWizard.button.save"/>
                    </html:button>
                    <html:button property="" onclick="uiController.cancelCurrentOverrides();"
                                 altKey="profileWizard.button.cancel.alt" titleKey="profileWizard.button.cancel.title" bundle="rcl" styleClass="reiSortModButton2_lang">
                       <fmt:message key="profileWizard.button.cancel"/>
                    </html:button>

                 </div>

                 <div style="clear:both">
                       <%-- addresses firefox issue with floating divs inside a container div --%>
                 </div>
              </div>

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



