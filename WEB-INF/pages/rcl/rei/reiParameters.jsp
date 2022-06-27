<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing REI parameters...

   ---------------------------
   @author : Lance Hankins
   
   $Id: reiParameters.jsp 4787 2007-10-31 20:58:07Z thopkins $

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
         /** Override this to make it lower in prompt screens **/
         .centeredMessage {
            position:absolute !important;
            left:35%;
            top: 55%;
         }
      </style>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiParametersUi.js"></script>

      <script type="text/javascript">
         // generates the JS definition of the current REI
         <c:out value="${reiForm.jsRei}" escapeXml="false"/>
         <c:out value="${reiForm.jsReportParameterInfo}" escapeXml="false"/>

         <c:choose>
            <c:when test="${reiForm.hasCustomPrompt}">
                var hasCustomPrompt = true;
            </c:when>
            <c:otherwise>
                var hasCustomPrompt = false;
            </c:otherwise>
         </c:choose>

         var uiModel = new ReiParametersUiModel(rei, reportParameterInfo, hasCustomPrompt);
         var uiController = new ReiParametersUiController(document, uiModel);

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

         <c:if test="${reiForm.hasCustomPrompt == true}">
            <iframe name="promptIframe" id="promptIframe" src="<%=request.getContextPath()%><c:out value="${reiForm.customPromptUrl}"/>">
            </iframe>
         </c:if>

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
         <html:hidden property="currentStage" value="params"/>
         <html:hidden property="jumpTo" value=""/>
         <html:hidden property="viewGesture" value=""/>
         <html:hidden property="reiXml" value=""/>
         <html:hidden property="defaultReiXml"/>



      </html:form>     

   </body>
</html>
