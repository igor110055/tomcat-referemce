<%--
  Created by IntelliJ IDEA.
  User: thopkins
  Date: Oct 15, 2007
  Time: 12:55:05 PM
  To change this template use File | Settings | File Templates.
--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/adhoc/commonReportWizardIncludes.jsp" %>
   <title><fmt:message key="reportWizard.title"/> - <fmt:message key="reportWizard.filters.title"/></title>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/ParametersWizardUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/AbstractReiUiController.js"></script>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
      @import "<%=request.getContextPath()%>/styles/rcl/tabBar.css";
      @import "<%=request.getContextPath()%>/styles/rcl/adhoc/reportWizard.css";
      @import "<%=request.getContextPath()%>/styles/rcl/pleaseWaitDiv.css";
   </style>

   <script type="text/javascript">
         var pleaseWaitDiv = new PleaseWaitDiv("rclBody", applicationResources.getProperty("reportWizard.loadingData"), document);

         <c:out value="${form.jsWizardReport}" escapeXml="false"/>

         <c:out value="${form.jsRei}" escapeXml="false"/>
         <c:out value="${form.jsReportParameterInfo}" escapeXml="false"/>
         var hasCustomPrompt = true;

         var uiModel = new ParametersWizardUiModel(rei, reportParameterInfo, hasCustomPrompt);
         var uiController = new ParametersWizardUiController(document, uiModel,wizardReport,pleaseWaitDiv);
         window.uiController = uiController;
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

   <html:form action="/secure/actions/reportWizard.do">

         <%-- standard wizard fields --%>
      <html:hidden property="wizardStep" value="prompt"/>
      <html:hidden styleId="jumpTo" property="jumpTo" value=""/>
      <html:hidden styleId="viewGesture" property="viewGesture" value=""/>
      <html:hidden styleId="wizardXml" property="wizardXml" value=""/>
      <html:hidden styleId="responseFormat" property="responseFormat" value=""/>
      <html:hidden property="hascustomPrompt" value="true"/>
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
                        <iframe name="promptIframe" id="promptIframe" src="<%=request.getContextPath()%><c:out value="${form.customPromptPath}"/>?reportId=<c:out value="${form.reportId}"/>">
                        </iframe>

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

</body>

</html>