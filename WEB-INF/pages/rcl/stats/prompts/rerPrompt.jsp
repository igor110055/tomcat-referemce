<%@ page import="java.util.Locale"%>
<%@ page import="org.apache.struts.Globals"%>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   RER Prompt Screen...


   ---------------------------
   @author : Lance Hankins

   $Id: rerPrompt.jsp 3724 2006-12-08 17:09:08Z crainey $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title>Report Execution Request Prompt</title>


   <%-- Calendar Includes... --%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

   <style type="text/css" xml:space="preserve">
      @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";
      @import "<%= request.getContextPath() %>/styles/rcl/DateParameterWidget.css";
   </style>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DateParameterWidget.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/stats/RerPromptUi.js"></script>



   <style type="text/css" xml:space="preserve">
      td select {
         width:100%;
      }

      *.hide{
         display:none;
      }
      #sizeContainer {
         float:left;
         width: 280px;
         margin-right:20px;
      }
      #dateWidgets {
         float:left;
         width: 250px;
      }
   </style>
</head>
<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/stats/rerPrompt">


      <script type="text/javascript" xml:space="preserve">

         var uiController = new RerPromptUiController(document);

         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>



      <table>
         <tr>
            <td class="label" id="Report_label">Report</td>
            <td class="label" id="UserLogon_label">User Logon</td>
         </tr>
         <tr>
            <td style="width:450px;">
               <html:select property="reports" styleId="reports" multiple="true" size="20">
                  <html:optionsCollection property="availableReports" value="id" label="defaultName"/>
               </html:select>
            </td>
            <td style="width:250px;">
               <html:select property="userLogons" styleId="userLogons" multiple="true" size="20">
                  <c:forEach var="eachLogon" items="${form.availableUserLogons}">
                     <option value="<c:out value="${eachLogon}"/>"><c:out value="${eachLogon}"/></option>
                  </c:forEach>
               </html:select>
            </td>
         </tr>
         <tr>
            <td>
               <html:button property="" onclick="uiController.selectAllReports();"
                            altKey="prompt.button.selectAll" titleKey="prompt.button.selectAll" bundle="rcl">
                  <fmt:message key="prompt.button.selectAll"/>
               </html:button>
               <html:button property="" onclick="uiController.deSelectAllReports();"
                            altKey="prompt.button.unselectAll" titleKey="prompt.button.unselectAll" bundle="rcl">
                  <fmt:message key="prompt.button.unselectAll"/>
               </html:button>
            </td>
            <td></td>
         </tr>
      </table>

      <br/>

      <div id="sizeContainer">
         <fieldset title="output sizes">
            <table>
               <tr>
                  <td class="rightAlignedLabel">
                     Minimum PDF Size
                  </td>
                  <td>
                     <input type="text" name="minPdfSize" id="minPdfSize"></input>
                  </td>
               </tr>
               <tr>
                  <td class="rightAlignedLabel">
                     Minimum HTML Size
                  </td>
                  <td>
                     <input type="text" name="minHtmlSize" id="minHtmlSize"></input>
                  </td>
               </tr>
            </table>
         </fieldset>

      </div>

      <div id="dateWidgets">
         <%-- date widgets inserted here --%>
      </div>

      <div style="clear:both">&nbsp;</div>

   </html:form>

</body>
</html>

