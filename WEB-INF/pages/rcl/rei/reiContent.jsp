<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for suppressing columns from standard report......

   ---------------------------
   @author : Lance Hankins
   
   $Id: reiContent.jsp 6992 2009-11-09 04:36:26Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <%@ include file="/WEB-INF/pages/rcl/rei/commonReiIncludes.jsp"%>
      <title><c:out value="${form.targetName}"/></title>
      <html:xhtml/>

      <style type="text/css" xml:space="preserve">
         @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
         @import "<%=request.getContextPath()%>/styles/rcl/reiContent.css";
         @import "<%=request.getContextPath()%>/styles/rcl/propertyEditor.css";

         <c:choose>
            <c:when test="${reiForm.targetReport.reportMetaData != null && reiForm.targetReport.reportMetaData.supportsContentSuppression == false}">

                 #suppressFeatureNotSupported {
                     float: left;
                     width: 200px;
                     padding:60px 20px 0 20px;
                     text-align:center;
                 }

                 #suppressFeatureUi {
                     display:none;
                 }

            </c:when>
            <c:otherwise>

                 #suppressFeatureNotSupported {
                     display:none;
                 }

                 #suppressFeatureUi {
                     display:block;
                 }


            </c:otherwise>
         </c:choose>

         <c:choose>
            <c:when test="${reiForm.targetReport.reportMetaData != null && reiForm.targetReport.reportMetaData.supportsContentInsertion == false}">

                 #insertFeatureNotSupported {
                     float: left;
                     width: 200px;
                     padding:60px 20px 0 20px;
                     text-align:center;
                 }

                 #insertFeatureUi {
                     display:none;
                 }

            </c:when>
            <c:otherwise>

                 #insertFeatureNotSupported {
                     display:none;
                 }

                 #insertFeatureUi {
                     display:block;
                 }

            </c:otherwise>
         </c:choose>

      </style>
      
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/PropertyEditor.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/CrnMetaData.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/md/LazyCrnMetaDataTree.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/CrnFunctionMetaData.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/md/CrnFunctionMetaDataTree.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiContentUi.js"></script>

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

         var uiModel = new ReiContentUiModel(rei, hasCustomPrompt, biQuerySet, visualContainers, '<c:out value="${reiForm.jsPackagePath}" escapeXml="false"/>', null);
         var uiController = new ReiContentUiController(document, uiModel);

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

            <html:hidden property="currentStage" value="content"/>


            <div id="defaultsContainerDiv">
               <div id="containersDiv" >
                  <div class="label"><fmt:message key="profileWizard.content.containers"/></div>
                  <select id="containers" size="10" onchange="uiController.containerSelectionChanged();">
                  </select>
               </div>


                <div id="suppressFeatureNotSupported">
                    <fmt:message key="profileWizard.content.suppress.notSupported"/>
                </div>
                <div id="suppressFeatureUi">
                   <div id="defaultColumnsDiv">
                      <div class="label"><fmt:message key="profileWizard.content.standardColumns"/></div>
                      <select id="defaultColumns"  multiple="multiple" size="10" onchange="uiController.defaultColumnSelectionChanged();">
                      </select>

                          <html:button property="" styleId="suppressButton" onclick="uiController.suppressSelected();" disabled="disabled"
                                       altKey="profileWizard.content.button.suppress.alt"
                                       titleKey="profileWizard.content.button.suppress.title" bundle="rcl">
                             <fmt:message key="profileWizard.content.button.suppress"/>
                          </html:button>
                   </div>
                </div>


                <div id="insertFeatureNotSupported">
                    <fmt:message key="profileWizard.content.insert.notSupported"/>
                </div>
                <div id="insertFeatureUi">

                    <div id="additionalColumnsDiv">
                       <div class="label"><fmt:message key="profileWizard.content.additionalColumns"/></div>
                       <select id="additionalColumns"  multiple="multiple" size="10" onchange="uiController.additionalColumnSelectionChanged();">
                       </select>
                    </div>

                    <div id="additionalColumnsOperations">
                       <html:button property="" styleId="addNewColumnButton" onclick="uiController.addNewColumn();" style="display:none;"
                                    altKey="profileWizard.button.add.alt" titleKey="profileWizard.button.add.title" bundle="rcl">
                          <fmt:message key="profileWizard.button.add"/>
                       </html:button>
                       <html:button property="" styleId="editColumnButton" onclick="uiController.editColumn();" style="display:none;"
                                    altKey="profileWizard.button.edit.alt" titleKey="profileWizard.button.edit.title" bundle="rcl">
                          <fmt:message key="profileWizard.button.edit"/>
                       </html:button>
                       <html:button property="" styleId="deleteColumnButton" onclick="uiController.deleteColumn();" style="display:none;"
                                    altKey="profileWizard.button.delete.alt" titleKey="profileWizard.button.delete.title" bundle="rcl">
                          <fmt:message key="profileWizard.button.delete"/>
                       </html:button>
                    </div>

                </div>


               <div style="clear:both">
                  <%-- addresses firefox issue with floating divs inside a container div --%>
               </div>
            </div>

            <div id="customizationsContainerDiv">
               <div class="label" style="margin-bottom:5px;">
                  <span id="currentContainerName"></span>
               </div>

               <div id="allTreesContainerDiv">

                  <div id="customizeTabsContainer">
                  </div>

                  <div id="mdModelContainer" class="lhsTreeContainer">
                     <div id="mdTreeContainer">
                        <div style="margin: 150px 10px 0px 20px;"><fmt:message key="profileWizard.content.loadingModel"/>
                           <%-- crn model tree will be inserted here --%>
                        </div>

                     </div>
                  </div>

                  <div id="functionMdContainer" class="lhsTreeContainer">
                     <div id="functionMdTreeContainer">
                           <%-- function MD tree will be inserted here --%>
                     </div>
                  </div>

                  <div id="currentSelectionInfoContainer">
                     <div class="label"><fmt:message key="profileWizard.content.information"/></div>
                     <div id="currentSelectionInfo"></div>
                  </div>
                  <div style="clear:both">
                     <%-- addresses firefox issue with floating divs inside a container div --%>
                  </div>
               </div>

               <div id="operations2Div">
                  <input type="button" value=">>" onclick="uiController.addToNewColumnExpression();"/>
               </div>

               <div id="newColumnDetailsDiv">
                  <div id="newColumnProperties">
                     <%-- property editor inserted here --%>
                  </div>

                  <div style="margin-top:10px;" class="label"><fmt:message key="profileWizard.content.additionalColumnExpression"/></div>
                  <textarea cols="55" rows="5" name="newColumnExpression" id="newColumnExpression"></textarea>

               </div>

               <div id="operations3Div">
                  <html:button property="" onclick="uiController.saveNewColumn();"
                          altKey="profileWizard.button.save.alt" titleKey="profileWizard.button.save.title" bundle="rcl">
                     <fmt:message key="profileWizard.button.save"/>
                  </html:button>
                  <html:button property="" onclick="uiController.cancelNewColumn();"
                          altKey="profileWizard.button.cancel.alt" titleKey="profileWizard.button.cancel.title" bundle="rcl">
                      <fmt:message key="profileWizard.button.cancel"/>
                  </html:button>

               </div>
               <div style="clear:both">
                  <%-- addresses firefox issue with floating divs inside a container div --%>
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



