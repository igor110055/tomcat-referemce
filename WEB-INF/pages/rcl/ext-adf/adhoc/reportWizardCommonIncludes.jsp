<%@ page import="com.focus.rcl.core.adhoc.PageOrientationEnum"%>
<%@ page import="com.focus.rcl.crn.AggregateFunctionEnum"%>
<%@ page import="com.focus.rcl.crn.FilterUsageEnum"%>
<%@ page import="com.focus.rcl.core.adhoc.WizardReportTypeEnum"%>
<%@ page import="com.focus.rcl.crn.ReportColumnTypeEnum"%>

<script type="text/javascript">

   <%= AggregateFunctionEnum.toJsObject() %>
   <%= FilterUsageEnum.toJsObject() %>
   <%= PageOrientationEnum.toJsObject() %>
   <%= WizardReportTypeEnum.toJsObject() %>
   <%= ReportColumnTypeEnum.toJsObject() %>

</script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportSpec.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/WizardReport.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ReportValidator.js"></script>
<%@ include file="/scripts/rcl/dialogs/DialogIncludes.jsp"%>