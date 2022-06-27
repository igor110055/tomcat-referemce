<?xml version="1.0"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<%@ page language="java" %>

<%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ExceptionReportWindow.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/JsUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/EncodingUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/RequestUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/DownloadLogsWindow.js"></script>

<html>
<head>
   <title>MotioADF</title>
</head>
<body>
<script type="text/javascript">
   var contextPath = "<%=request.getContextPath()%>";
   Ext.onReady(function()
   {
      Ext.Ajax.timeout = 120000;  //set the timeout to 2 minutes

      var errorType = "<%=request.getAttribute("errorType")%>";
      var errorMessage = "<%=request.getAttribute("errorMessage")%>";
      if(errorType != "null" && errorMessage != "null")
      {
         Ext.Msg.alert(errorType, errorMessage);
      }
      else
      {
         ExceptionReportWindow.launch(Ext.decode(EncodingUtil.base64Decode("<%=request.getAttribute("exceptionReport")%>")));
      }
   });
</script>
</body>
</html>
