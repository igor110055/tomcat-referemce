<%--
  ~ Copyright (c) 2001-2013. Motio, Inc.
  ~ All Rights reserved
  --%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Lab Prompt

   ---------------------------
   @author : Lance Hankins

   $Id: salesRepPrompt.jsp 9255 2015-07-07 23:34:09Z sallman $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<html>
<head>
   <%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   <%@ include file="/WEB-INF/pages/common/commonPromptIncludes.jsp"%>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/gosl/prompts/SalesRepPromptUi.js"></script>

   <title><fmt:message key="prompt.salesRep.title"/></title>
</head>
<body class="rclBody customPromptIframeBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/salesRepPrompt">


      <script type="text/javascript" xml:space="preserve">

         var uiController = new SalesRepPromptUiController(document);

         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


      <%--<div class="screenTitle"><fmt:message key="prompt.salesRep.subTitle"/>v1</div>--%>
      <%--<br/>--%>
      <%--<div>--%>

         <%--<div style="float:left">--%>
            <%--<div class="label" id="SalesRep_label"><fmt:message key="prompt.salesRep.salesReps"/></div>--%>
            <%--<html:select style="width:250px;" property="salesReps" styleId="salesReps" multiple="multiple" size="15">--%>
               <%--<html:optionsCollection value="fullName" label="fullName" property="availableSalesReps"/>--%>
            <%--</html:select>--%>
         <%--</div>--%>

      <%--</div>--%>
   </html:form>

</body>
</html>

