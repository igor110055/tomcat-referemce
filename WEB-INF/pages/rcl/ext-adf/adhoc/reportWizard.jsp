<!-- Do NOT put any DOCTYPE here unless you want problems in IEs. -->
<%@ page import="com.focus.rcl.core.ContentFolder"%>
<%@ page import="com.focus.rcl.web.adhoc.ReportWizardForm"%>

<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>

<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

   <!-- Ext relies on its default css so include it here. -->
   <!-- This must come BEFORE javascript includes! -->
   <%@ include file="/WEB-INF/pages/common/commonExtIncludes.jsp"%>
    <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/DocumentLifeCycleMonitor.js"></script>

   <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/reportWizard.css" />

   <!-- ...then you need the Ext itself, either debug or production version. -->
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ux-all-debug.js"></script>

   <!-- Include here your extended classes if you have some. -->
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="reportWizardCommonIncludes.jsp" %>

   <!-- Include here you application javascript file if you have it. -->
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/PropertyEditor.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/adhoc/EditorComponents.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/adhoc/ExpressionEditor.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/adhoc/reportWizardUiController.js"></script>

   <title id="page-title"><fmt:message key="reportWizard.title"/></title>

   <script type="text/javascript">
      // Path to the blank image must point to a valid location on your server
      Ext.BLANK_IMAGE_URL = '<%=request.getContextPath()%>/scripts/lib/ext/resources/images/default/s.gif';
   </script>

    <style type="text/css">
        ul.x-tab-strip-top {
            background-color: white;
            background-image: none;
            border-bottom-color: white;
        }

        .x-tab-panel-header-plain .x-tab-strip-spacer,
        .x-tab-panel-footer-plain .x-tab-strip-spacer {
            border-color: #d0d0d0;
            background-color: #eaeaea;
        }

        .x-tab-strip span.x-tab-strip-text {
            font: normal 11px tahoma, arial, helvetica;
            color: black;
            text-align:center;
            vertical-align:bottom;
            font-weight: bold;
        }

        .x-tab-strip-over span.x-tab-strip-text {
            color: white;
            font-weight: bold;
            text-align:center;
            vertical-align:bottom;
        }

        .x-tab-strip-active span.x-tab-strip-text {
            color: white;
            font-weight: bold;
            text-align:center;
            vertical-align:bottom;
        }

        .wizardStepTabs ul.x-tab-strip li {
            margin-left: 0px;
            width:155px;
            height:25px;
            vertical-align:bottom;
        }

        .x-tab-strip-top .x-tab-right {
            border-right: 1px solid white;
        }

        .x-tab-strip-top .x-tab-left {
            border-right: 1px solid white;
        }

        .x-tab-strip-top .x-tab-right, .x-tab-strip-top .x-tab-left, .x-tab-strip-top .x-tab-strip-inner {
            background: repeat url(<%=request.getContextPath()%>/images/wizardBar_off.png);
            height:25px;
        }

        .x-tab-strip-top .x-tab-strip-over .x-tab-right, .x-tab-strip-top .x-tab-strip-over .x-tab-left, .x-tab-strip-top .x-tab-strip-over .x-tab-strip-inner {
            background: repeat url(<%=request.getContextPath()%>/images/wizardBar_on.png);
        }

        .x-tab-strip-top .x-tab-strip-active .x-tab-right, .x-tab-strip-top .x-tab-strip-active .x-tab-left, .x-tab-strip-top .x-tab-strip-active .x-tab-strip-inner {
            background: repeat url(<%=request.getContextPath()%>/images/wizardBar_on.png);
        }
   </style>
</head>

<body>

<%-- Form used for submitting validate, preview, run, finish and cancel to the action. --%>
<html:form action="/secure/actions/reportWizard.do">

   <%-- standard wizard fields --%>
   <html:hidden property="wizardStep" value="columnSelection"/>
   <%--<html:hidden styleId="jumpTo" property="jumpTo" value=""/>--%>
   <html:hidden styleId="viewGesture" property="viewGesture" value=""/>
   <html:hidden styleId="wizardXml" property="wizardXml" value=""/>
   <html:hidden styleId="responseFormat" property="responseFormat" value=""/>
   <html:hidden styleId="reiXml" property="reiXml" value=""/>
</html:form>

<script type="text/javascript">

   <c:out value="${form.jsWizardReport}" escapeXml="false"/>
   <c:out value="${form.jsAvailableSaveToFolders}" escapeXml="false"/>
   <c:out value="${form.jsAvailableFrameworkModels}" escapeXml="false"/>

//   var fmtMessage = '<fmt:message key="reportWizard.selectType.reportName"/>';
//   var fmtMessage = applicationResources.getProperty("reportWizard.selectType.reportName");
//   alert(fmtMessage+'001');
//   alert('wizardReport.reportType=('+wizardReport.reportType+')'+wizardReport.reportType.name);
//   alert('wizardReport.pageOrientation=('+wizardReport.pageOrientation+')'+wizardReport.pageOrientation.name);

</script>


</body>

<!-- Close html tag at last -->
</html>
