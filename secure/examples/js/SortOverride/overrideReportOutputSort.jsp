

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing REI destinations..

   ---------------------------
   @author : Jeremy Siler

   $Id: overrideReportOutputSort.jsp 6945 2009-10-19 14:40:14Z dbequeaith $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>
   <title><c:out value="${form.targetName}"/></title>

   <script type="text/javascript">
      var winTest = window.open("", "RCL Report Viewer");
      alert(winTest.name);
      var aWindow = windows["RCL Report Viewer"];
      alert(aWindow.name);
      var aFrame = aWindow.frames[0];
      var uiController = windows["RCL Report Viewer"].frames[""].reportOutputUiController;
   </script>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/rei/commonReiIncludes.jsp"%>

   <html:xhtml/>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiDestinationsUi.js"></script>--%>

   <script type="text/javascript">
      // generates the JS definition of the current REI
      <%--<c:out value="${reiForm.jsRei}" escapeXml="false"/>--%>
      <%--<c:out value="${reiForm.jsDestinations}" escapeXml="false"/>--%>

      <%--<c:choose>--%>
      <%--<c:when test="${reiForm.hasCustomPrompt}">--%>
//      var hasCustomPrompt = true;
      <%--</c:when>--%>
      <%--<c:otherwise>--%>
//      var hasCustomPrompt = false;
      <%--</c:otherwise>--%>
      <%--</c:choose>--%>

//      var uiModel = new ReiDestinationsUiModel(rei, <c:out value="${reiForm.emailServerDestinationId}"/>, hasCustomPrompt, availableDestinations);
//      var uiController = new ReiDestinationsUiController(document, uiModel);

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
//         uiController.initUi();
//         uiController.onReiDialogResize();
      });

   </script>

</head>

<body class="rclBody"
      <%--onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"--%>
      <%--onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"--%>
      <%--onresize="uiController.onReiDialogResize();"--%>
      style="margin:0px;">

Override Report Output Sort
<%--<html:form action="/secure/actions/sortOverrideReportExecute" method="post">--%>
<form>
   <input type="hidden" name="reiXml" id="reiXml" value=""/>
   <input type="hidden" name="targetId" id="targetId" value=""/>

</form>
<%--</html:form>--%>

<br/>
bleh
</body>
</html>