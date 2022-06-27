<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Dynamic Generated Prompt

   ---------------------------
   @author : Lance Hankins

   $Id: xmlGeneratedPrompt.jsp 8386 2013-05-24 15:45:32Z jsiler $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <title>Product HierarchyPrompt</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp" %>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/prompts/GeneratedPrompts.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/prompts/dynamicGeneratedPromptUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/AjaxValidator.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SearchAndSelectWidget.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DateParameterWidget.js"></script>


   <%-- Calendar Includes... --%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-en.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

   <style type="text/css" xml:space="preserve">
      @import "<%= request.getContextPath() %>/styles/rcl/prompts/generatedPrompts.css";
      @import "<%= request.getContextPath() %>/styles/rcl/searchAndSelectWidget.css";
      @import "<%= request.getContextPath() %>/styles/rcl/DateParameterWidget.css";
      @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";

      /* override this style from searchAndSelect.css because we provide our own labels*/
      div.searchAndSelectWidget td.labelArea {
         width:0px;
         display:none;
      }

      #debugDiv {
         display: none;
      }


      .title {
         font-weight: bold;
         padding: 4px;
         font-size: large;
      }

      *.areaHide {
         display: none;
      }

      .header {
         font-weight: bold;
         background-color: gainsboro;
         padding: 4px;
         border-bottom: 1px solid #A3A8A9;
      }

      .collapseButton {
         font-weight: bold;
         float: right;
         margin-left: 60px;
         margin-bottom: 0px;
         margin-top: 0px;
         margin-right: 5px;
         cursor: pointer;
      }

      .section {
         clear: both;
         background-color: white;
         margin-left: 4px;
         margin-top: 4px;
         margin-right: 4px;
         margin-bottom: 4px;
         border: 1px solid #A3A8A9;
      }

      .sectionContent {
         padding: 4px;
      }

      .sectionTitle {
         text-align: left;
         border-bottom: 1px solid #A3A8A9;
      }


   </style>

   <script type="text/javascript">
      function toggleDebugDiv()
      {
         var div = document.getElementById("debugDiv");

         div.style.display = (div.style.display == "none") ? "block" : "none";
      }
   </script>


</head>
<body class="rclBody customPromptIframeBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"
      >

   <html:form action="/secure/actions/xmlGeneratedPrompt">


      <script type="text/javascript" xml:space="preserve">

         <c:out value="${form.jsPromptScreen}" escapeXml="false"/>

         var uiController = new DynamicGeneratedPromptUiController(document, "dpInsertionPoint", genPromptScreen, <c:out value="${form.reportId}"/>);

         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


      <c:if test="${form.zeroParameterReport}">
         <h4>This Report has 0 Parameters.</h4>
      </c:if>

      <div id="dpInsertionPoint">
         <%-- prompts inserted here --%>
      </div>

<%--
      <div style="clear:both;">
         <a href="javascript:toggleDebugDiv();">debug</a>
      </div>
--%>
      <div id="debugDiv">
      </div>

</html:form>


</body>
</html>

