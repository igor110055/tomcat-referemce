<?xml version="1.0"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>

<%--This is used to open Cognos Connection via a hidden iframe and from there forward to the appropriate Cognos
    studio. Workaround for Cognos 10 issue described in ticket #5345--%>
<html>
<head>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rclci/common/ExtOverrides.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/JsUtil.js"></script>
<script type="text/javascript">

   //After the Cognos Connection screen is loaded, the appropriate studio will loaded
   function frontDoorLoaded(aTargetActionUri)
   {
      window.location.href = aTargetActionUri;
   }
   
</script>
</head>
<body>
   <iframe style="display:none" src="<%=request.getAttribute("cognosConnectionUrl")%>" onload="frontDoorLoaded('<%=request.getAttribute("url")%>');">
   </iframe>
</body>
</html>