<%@ page import="com.focus.rcl.core.ContentFolder"%>
<%@ page import="com.focus.rcl.web.adhoc.ReportWizardForm"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/adhoc/commonReportWizardIncludes.jsp" %>
   <title><fmt:message key="reportWizard.title"/> - <fmt:message key="reportWizard.selectType.title"/></title>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/SelectTypeUi.js"></script>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
      @import "<%=request.getContextPath()%>/styles/rcl/tabBar.css";
      @import "<%=request.getContextPath()%>/styles/rcl/adhoc/reportWizard.css";
      @import "<%=request.getContextPath()%>/styles/rcl/adhoc/selectType.css";
      @import "<%=request.getContextPath()%>/styles/rcl/pleaseWaitDiv.css";
   </style>


</head>

<body class="rclBody" style="margin:0px;"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/reportWizard.do">

         <%-- standard wizard fields --%>
      <html:hidden property="wizardStep" value="selectReportType"/>
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

                  <div style="padding:30px 5px 5px 5px">
                     <div style="float:left; width:300px">
                     </div>

                     <div style="float:left;">
                        <div class="nvPair">
                           <div class="label"><fmt:message key="reportWizard.selectType.reportName"/></div>
                           <html:text property="reportName" size="40"/>
                        </div>

                        <div class="nvPair">
                           <div class="label"><fmt:message key="reportWizard.selectType.model"/></div>
                           <html:select property="packagePath">
                              <html:optionsCollection property="availableFrameworkModels" label="name" value="value"/>
                           </html:select>
                        </div>

                        <div class="nvPair">
                           <div class="label"><fmt:message key="reportWizard.selectType.saveToFolder"/></div>
                           <html:select property="saveToFolderId">
                              <nested:iterate property="availableSaveToFolders" id="anAvailableSaveToFolder">
                                 <html:option value="${anAvailableSaveToFolder.id}"><%=((ContentFolder)anAvailableSaveToFolder).getPrettyPath(((ReportWizardForm)request.getAttribute("form")).getUserLocale())%></html:option>
                              </nested:iterate>
                           </html:select>
                        </div>

                        <div class="nvPair">
                           <div class="label"><fmt:message key="reportWizard.selectType.reportType"/></div>

                           <html:radio property="reportType" value="LIST"/><fmt:message key="reportWizard.selectType.list"/><br/>
                           <html:radio property="reportType" value="CROSSTAB"/><fmt:message key="reportWizard.selectType.crosstab"/><br/>
                        </div>

                        <div class="nvPair">
                           <div class="label"><fmt:message key="reportWizard.selectType.pageSetup"/></div>

                           <html:radio property="pageOrientation" value="PORTRAIT"/><fmt:message key="reportWizard.selectType.portrait"/><br/>
                           <html:radio property="pageOrientation" value="LANDSCAPE"/><fmt:message key="reportWizard.selectType.landscape"/><br/>
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
         uiController = new SelectTypeUiController(document, wizardReport, null, pleaseWaitDiv);
         uiController.initializeUi();
      });
   </script>

</body>

</html>