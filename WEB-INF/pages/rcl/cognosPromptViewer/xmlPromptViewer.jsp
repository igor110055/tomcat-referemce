<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<%@ include file="/WEB-INF/pages/common/extIncludes.jsp" %>


<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>
   <title>Prompt Viewer</title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>
   <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp" %>

   <style type="text/css">
   .xmlParam{
      height: 30em;
      width: 60em;
   }
   .xmlParsingError{
      color:red;
   }
   </style>

   <script type="text/javascript">
      function initUi()
      {
      }
   </script>

</head>
<body onload="initUi();">

<html:form action="/secure/actions/capturePromptValues/processXmlParams.do" method="post">

   <c:if test="${not empty capturePromptValuesForm.xmlParserErrorMsg}"><p class="xmlParsingError">&nbsp;&nbsp;<c:out value="${capturePromptValuesForm.xmlParserErrorMsg}"/></p></c:if>
   <html:hidden property="reportSearchPath"/>
   <div>
      <html:textarea property="parametersXml" styleClass="xmlParam"/>
   </div>
   <div>
      <html:submit property="uiAction" value="Submit"/>
   </div>
</html:form>


</body>
</html>