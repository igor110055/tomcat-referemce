<%@ page import="org.apache.struts.Globals"%>
<%@ page import="java.util.Locale"%>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Product Hierarchy Prompt Screen...

   NOTE: This screen is a little more complex to support hiding/showing various
   members of the product hierarchy and to allow you to switch between multi-select
   and single-select mode for each member of the product hierarchy...

   ---------------------------
   @author : Lance Hankins
   
   $Id: dateAndRevenuePrompt.jsp 8386 2013-05-24 15:45:32Z jsiler $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title><fmt:message key="prompt.dateAndRevenue.title"/></title>





   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/prompts/DateAndRevenuePromptUi.js"></script>

   <%-- Calendar Includes... --%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

   <style type="text/css" xml:space="preserve">
      @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";
   </style>


</head>
<body class="rclBody customPromptIframeBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/dateAndRevenuePrompt">


      <script type="text/javascript" xml:space="preserve">

         var uiController = new DateAndRevenuePromptUiController(document);

         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


      <span><fmt:message key="prompt.dateAndRevenue.beginDateAndRevenuePrompt"/></span>
      <div>
         <div id="beginDateDiv">
            <span class="labelText" id="StartDate_label"><fmt:message key="prompt.startDate"/>: </span>
            <html:text property="startDate" styleId="startDate"></html:text>
            <input type="button" value="..." id="pickStartDateButton">
         </div>
         <div>
            <span class="labelText" id="MinimumRevenue_label"><fmt:message key="prompt.dateAndRevenue.minimumRevenue"/></span>
            <html:text property="minimumRevenue"/>
         </div>
      </div>
   </html:form>


   <script type="text/javascript">
   Calendar.setup(
      {
         inputField : "startDate", // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button : "pickStartDateButton" // ID of the button
      }
   );
   </script>


</body>
</html>

