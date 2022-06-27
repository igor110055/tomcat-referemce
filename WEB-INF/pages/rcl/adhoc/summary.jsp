<%@ page import="com.focus.rcl.web.adhoc.ReportWizardForm"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/adhoc/commonReportWizardIncludes.jsp" %>
   <title><fmt:message key="reportWizard.title"/> - <fmt:message key="reportWizard.summary.title"/></title>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/SummaryUi.js"></script>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
      @import "<%=request.getContextPath()%>/styles/rcl/tabBar.css";
      @import "<%=request.getContextPath()%>/styles/rcl/adhoc/reportWizard.css";
      @import "<%=request.getContextPath()%>/styles/rcl/adhoc/summary.css";
      @import "<%=request.getContextPath()%>/styles/rcl/pleaseWaitDiv.css";
   </style>


</head>

<body class="rclBody" style="margin:0px;"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/reportWizard.do">

         <%-- standard wizard fields --%>
      <html:hidden property="wizardStep" value="summary"/>
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

                  <span class="label"><fmt:message key="reportWizard.summary.name"/></span> : <c:out value="${form.wizardReport.name}"/>
                  <br/>
                  <span class="label"><fmt:message key="reportWizard.summary.saveToFolder"/></span> : <%=((ReportWizardForm)request.getAttribute("form")).getSaveToFolder().getPath(((ReportWizardForm)request.getAttribute("form")).getUserLocale())%>
                  <br/>


                  <div class="label"><fmt:message key="reportWizard.summary.reportColumns"/></div>

                  <ul style="margin-top:0px; padding-top:0px;">
                     <c:forEach items="${form.wizardReport.reportColumns}" var="eachColumn">
                        <li>
                           <c:out value="${eachColumn.name}"/> <c:out value="${eachColumn.attributeSummary}"/>
                        </li>
                     </c:forEach>
                  </ul>

                  <div class="label"><fmt:message key="reportWizard.summary.filters"/></div>
                     <ul style="margin-top:0px; padding-top:0px;">
                     <c:choose>
                        <c:when test="${not empty form.wizardReport.filters}">
                           <c:forEach var="eachFilter" items="${form.wizardReport.filters}">
                              <li>
                                 <div class="filterExpression">
                                    <c:out value="${eachFilter.filterExpression}" escapeXml="true"/>
                                 </div>

                              </li>
                           </c:forEach>
                        </c:when>
                        <c:otherwise>
                           <li><fmt:message key="reportWizard.summary.none"/></li>
                        </c:otherwise>
                     </c:choose>


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
         uiController = new SummaryUiController(document, wizardReport, null, pleaseWaitDiv);
         uiController.initializeUi();
      });
   </script>

</body>

</html>