<%@ page import="org.apache.commons.lang.StringEscapeUtils"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>

   <title>View Status</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>




   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/TabBar.js"></script>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/adhoc/ActionConstants.js"></script>


   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
      @import "<%=request.getContextPath()%>/styles/rcl/tabBar.css";
      @import "<%=request.getContextPath()%>/styles/rcl/adhoc/reportWizard.css";


   </style>


</head>

<body class="rclBody" style="margin:0px;"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">



   <html:form action="/actions/test/viewRerStatus.do">

     <html:hidden styleId="rerId" property="rerId"/>

     Simple Test status for RER <c:out value="${form.rerId}"/> <br>

     Status = <c:out value="${form.reportExecutionRequest.status}"/> <br>

      <html:submit property="Refresh" title="Refresh" />
   </html:form>
</body>

</html>