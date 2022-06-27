<%@ page import="com.focus.rcl.RclEnvironment" %>
<%@ page import="com.focus.rcl.reportservice.ReportExecutionStatusEnum" %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title><c:out value="${form.targetName}"/></title>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
      <%@ include file="adhoc/reportWizardCommonIncludes.jsp" %>
      <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>
      <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp" %>
      <%@ include file="/WEB-INF/pages/rcl/rei/commonReiIncludes.jsp"%>
      <html:xhtml/>

      <style type="text/css">
         @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
         @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
         @import "<%=request.getContextPath() %>/styles/rcl/ext-adf/ext-adf.css";
         @import "<%=request.getContextPath()%>/styles/rcl/ext-adf/MultiSelect.css";
         @import "<%= request.getContextPath() %>/styles/rcl/ext-adf/reportWizard.css";
      </style>
      <style type="text/css">
         html,body{
            width:100%;
            height:100%;
            margin:0px;
            padding:0px;
         }
         #navMenu ul {
            margin:0;
            padding:0;
         }
         #navMenu li {
            margin:0;
            padding:0;
            list-style-type:none;
         }
      </style>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/PropertyEditor.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiContentUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiParametersUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiFiltersUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfExtUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ux-all-debug.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/adhoc/EditorComponents.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/adhoc/ExpressionEditor.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/common/FadeMessage.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfCheckColumn.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/EditReiDialog.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/EditReiSortsUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/EditReiFiltersUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ExtReiParametersUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/picker/AdfFolderPickerTree.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/picker/ProfileSaveAsDialog.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/picker/PagedListValuePicker.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/adhoc/ContainerPicker.js"></script>

      <script type="text/javascript">
         <%= ReportExecutionStatusEnum.getJsReportStatusEnums() %>
         Ext.BLANK_IMAGE_URL = '<%=request.getContextPath()%>/scripts/lib/ext/resources/images/default/s.gif';
         Ext.EventManager.onDocumentReady(Adf.editReportProfileUi.init, Adf.editReportProfileUi, true);

         // generates the JS definition of the current REI
         <c:out value="${reiForm.jsRei}" escapeXml="false"/>
         <c:out value="${reiForm.jsReportParameterInfo}" escapeXml="false"/>

         <c:choose>
            <c:when test="${reiForm.hasCustomPrompt}">
                var hasCustomPrompt = true;
                <c:out value="${reiForm.jsCustomPromptUrl}" escapeXml="false"/>;
            </c:when>
            <c:otherwise>
                var hasCustomPrompt = false;
                var customPromptUrl = '';
         </c:otherwise>
         </c:choose>

         var uiModel = new ReiParametersUiModel(rei, reportParameterInfo, hasCustomPrompt);
         var uiController = new ExtReiParametersUiController(document, uiModel);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
            uiController.onReiDialogResize();
         });
      </script>

   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"
         style="margin:0px;">

      <html:form action="/secure/actions/editRei" method="post">

         <html:hidden styleId="targetId" property="targetId"/>
         <html:hidden styleId="launchNodeType" property="launchNodeType"/>
         <html:hidden styleId="rerId" property="rerId"/>

         <html:hidden property="targetName"/>
         <html:hidden property="reiXml" value=""/>
      </html:form>

   </body>
</html>