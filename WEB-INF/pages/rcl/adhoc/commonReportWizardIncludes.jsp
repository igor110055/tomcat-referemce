<%@ page import="com.focus.rcl.core.adhoc.PageOrientationEnum"%>
<%@ page import="com.focus.rcl.crn.AggregateFunctionEnum"%>
<%@ page import="com.focus.rcl.crn.FilterUsageEnum"%>
<%@ page import="com.focus.rcl.crn.ReportColumnTypeEnum"%>
<%@ page import="com.focus.rcl.core.adhoc.WizardReportTypeEnum"%>
<%@ page import="com.focus.rcl.crn.ReportColumnTypeEnum"%>

<script type="text/javascript">

   <%= AggregateFunctionEnum.toJsObject() %>
   <%= FilterUsageEnum.toJsObject() %>
   <%= PageOrientationEnum.toJsObject() %>
   <%= WizardReportTypeEnum.toJsObject() %>
   <%= ReportColumnTypeEnum.toJsObject() %>
</script>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/TabBar.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/CrnMetaData.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/md/LazyCrnMetaDataTree.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/CrnFunctionMetaData.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/md/CrnFunctionMetaDataTree.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>



<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportSpec.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/WizardReport.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/AbstractReportWizardUi.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ReportValidator.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/AbstractKeyHandler.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/ReportWizardKeyHandler.js"></script>


<%@ include file="/scripts/rcl/dialogs/DialogIncludes.jsp"%>
