<%@ page import="java.util.Locale"%>
<%@ page import="org.apache.struts.Globals"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Dynamic Generated Prompt

   ---------------------------
   @author : Lance Hankins

   $Id: dynamicGeneratedPrompt.jsp 8386 2013-05-24 15:45:32Z jsiler $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title><fmt:message key="prompt.dynamicGenerated.title"/></title>



   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DateParameterWidget.js"></script>
   
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


   <%-- Calendar Includes... --%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

   <style type="text/css" xml:space="preserve">
      @import "<%= request.getContextPath() %>/styles/rcl/DateParameterWidget.css";
      @import "<%= request.getContextPath() %>/styles/rcl/prompts/generatedPrompts.css";
      @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";

      #debugDiv {
         display: none;
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

   <html:form action="/secure/actions/dynamicGeneratedPrompt">


      <script type="text/javascript" xml:space="preserve">

         <c:out value="${form.jsPromptScreen}" escapeXml="false"/>

         var uiController = new DynamicGeneratedPromptUiController(document, "dpInsertionPoint", genPromptScreen);

         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


      <c:if test="${form.zeroParameterReport}">
         <h4><fmt:message key="prompt.dynamicGenerated.reportHasZeroParameters"/></h4>
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
         <table border="1">
            <thead style="background-color:#AAAAAA;">
               <tr>
                  <td>Name</td>
                  <td>QueryItem.reference</td>
                  <td>DataType</td>
                  <td>Optional?</td>
                  <td>MultiValued?</td>
                  <td>BoundedRange?</td>
                  <td>UnboundedRange?</td>
                  <td>ModelFilterItem</td>
                  <td>ModelUseItem</td>
                  <td>ModelDisplayItem</td>
               </tr>
            </thead>
            <tbody>
               <c:forEach var="eachPrompt" items="${form.promptScreen.promptPageItems}">
                  <tr>
                     <td><c:out value="${eachPrompt.paramInfo.name}"/> </td>
                     <td>
                        <c:if test="${!empty eachPrompt.queryItem}">
                           <c:out value="${eachPrompt.queryItem.reference}"/>
                        </c:if>
                     </td>
                     <td><c:out value="${eachPrompt.paramInfo.dataType}"/> </td>
                     <td><c:out value="${eachPrompt.paramInfo.optional}"/> </td>
                     <td><c:out value="${eachPrompt.paramInfo.multiValue}"/> </td>
                     <td><c:out value="${eachPrompt.paramInfo.boundedRange}"/> </td>
                     <td><c:out value="${eachPrompt.paramInfo.unboundedRange}"/> </td>
                     <td><c:out value="${eachPrompt.paramInfo.modelFilterItem}"/> </td>
                     <td><c:out value="${eachPrompt.paramInfo.modelUseItem}"/> </td>
                     <td><c:out value="${eachPrompt.paramInfo.modelDisplayItem}"/> </td>
                  </tr>
               </c:forEach>
            </tbody>
         </table>
      </div>

</html:form>


</body>
</html>

