<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing Schedule Type and Name

   ---------------------------
   @author : Roger Moore

   $Id: reportDashboardModuleSettings.jsp 3966 2007-02-12 17:17:52Z jjames $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";

      #treeContainer
      {
         float: left;
         width: 225px;
         height: 175px;
         overflow: auto;

         border: 1px black solid;
      }

      #availableReports
      {
         float: left;
         width: 325px;
         height: 175px;
         overflow: auto;

         border: 1px black solid;
      }

   </style>

   <title><fmt:message key="dashboard.report.module.title"/></title>
   <html:xhtml/>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

   <style type="text/css" xml:space="preserve">
      @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";
   </style>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>


   <%@ include file="/WEB-INF/pages/rcl/scheduler/commonSchedulerIncludes.jsp"%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ReportDashboardModuleSettings.js"></script>

</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"
      style="margin:0px;">

<html:form action="/secure/actions/saveReportDashboardModule" method="post">

<script type="text/javascript">

   <c:out escapeXml="false" value="${reportDashboardModuleForm.height} "/>

   <c:out escapeXml="false" value="${reportDashboardModuleForm.jsReportFolders} "/>
   <c:out escapeXml="false" value="${reportDashboardModuleForm.jsSelectedTargets} "/>
   var uiModel = new ReportDashboardModuleSettingsUiModel(rootRclFolder, selectedTargets);
   var uiController = new ReportDashboardModuleSettingsUiController(document, uiModel);



   DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
   {
      uiController.initUi();
   });

</script>

      <table border="0" cellpadding="10px"align="center" id="filterTable">
         <tr>
            <td colspan="2">

               <div class="nvPair">
                  <div class="label"><fmt:message key="scheduler.name" /></div>
                  <html:text styleId="nameElem" property="scheduleName" size="40"/>
               </div>
             </td>
         </tr>
         <tr>
            <td colspan="2">

               <div class="nvPair">
                  <div class="label"><fmt:message key="dashboard.module.height.label" /></div>
                  <html:text styleId="heightElem" property="height" size="40"/>
               </div>
             </td>
         </tr>
         <tr>
            <td colspan="1">
                <div class="label"><fmt:message key="scheduleWizard.folders.label"/></div>
               <div id="treeContainer">

                  <!-- TREE WILL BE INSERTED HERE -->
               </div>
            </td>
            <td colspan="1">
               <div class="label"><fmt:message key="scheduleWizard.availableTargets.label"/></div>
               <select id="availableReports" name="availableReports"  size="10" >
                              <%-- current calculated columns inserted here --%>
               </select>
            </td>

         </tr>
         <tr>
            <td colspan="2">

               <div class="nvPair">
                  <fieldset><legend><fmt:message key="scheduler.type"/></legend>

                   <nested:iterate property="scheduleTypes" id="aScheduleType">
                      <html:radio bundle="rcl" property="scheduleType" value="${aScheduleType.value}" onchange="uiController.hideShowTimingSections()"/> <fmt:message key="${aScheduleType.displayName}" />   <br/>

                   </nested:iterate>
                  </fieldset>

               </div>
          </td>
         </tr>

         <tr>
         <td colspan="4">
         <fieldset>
           <%--<legend><fmt:message key="scheduleWizard.recurrenceFieldSet"/></legend>--%>

               <div id="dailyTrigger">
                  <html:radio property="dailyRate" value="minutes" onclick="uiController.refreshDailySelections()" styleId="dailyRate"/>
                     <fmt:message key="scheduler.Every"/>
                     <html:text  property="dailyInterval"  styleId="dailyMinuteInterval"  size="3" disabled="true"/>
                     <fmt:message key="scheduler.minutes"/><br/>
                  <html:radio property="dailyRate" value="hours" onclick="uiController.refreshDailySelections()" styleId="dailyRate"/>
                     <fmt:message key="scheduler.Every"/>
                     <html:text property="dailyInterval"   styleId="dailyHourInterval"  size="3" disabled="true"/>
                     <fmt:message key="scheduler.hours"/><br/>
                  <html:radio property="dailyRate" value="days" onclick="uiController.refreshDailySelections()" styleId="dailyRate"/>
                     <fmt:message key="scheduler.Every"/>
                     <html:text property="dailyInterval" styleId="dailyDayInterval"  size="3"  disabled="true"/>
                     <fmt:message key="scheduler.days"/>
                  <br/>

               </div>
                <div id="weeklyTrigger">
                     <fmt:message key="scheduler.Every"/>
                     <html:text property="weeklyInterval" size="3"/>
                     <fmt:message key="scheduler.weeks"/> <fmt:message key="scheduler.on"/> <br/>

                     <table border="0">
                        <tr>
                           <td><html:multibox property="weeklyDays" styleId="sunday" value="SUN"/><label for="sunday"><fmt:message key="sunday"/> </label> </td>
                           <td><html:multibox property="weeklyDays" styleId="monday" value="MON"/><label for="monday"><fmt:message key="monday"/></label> </td>
                           <td><html:multibox property="weeklyDays" styleId="tuesday" value="TUE"/><label for="tuesday"><fmt:message key="tuesday"/></label> </td>
                           <td><html:multibox property="weeklyDays" styleId="wednesday" value="WED"/><label for="wednesday"><fmt:message key="wednesday"/></label><br/> </td>
                        </tr><tr>
                        <td><html:multibox property="weeklyDays" styleId="thursday" value="THU"/><label for="thursday"><fmt:message key="thursday"/></label> </td>
                        <td><html:multibox property="weeklyDays" styleId="friday" value="FRI"/><label for="friday"><fmt:message key="friday"/></label> </td>
                        <td><html:multibox property="weeklyDays" styleId="saturday" value="SAT"/><label for="saturday"><fmt:message key="saturday"/></label> </td>
                     </table>
                  </div>

                <div id="monthlyTrigger">

                     <html:radio property="monthlyType" value="relative" onclick="uiController.refreshMonthlySelections()" styleId="monthlyType"/>
      <!--todo i18n : This sentance does not follow i18n guidelines.  We should not have input fields in the middle of a sentance. -->
                           <fmt:message key="scheduler.The"/>
                     <html:select property="monthlyWeek" styleId="monthlyWeek" disabled="true">
                              <html:option value="1" bundle="rcl" key="scheduler.first"/>
                              <html:option value="2" bundle="rcl" key="scheduler.second"/>
                              <html:option value="3" bundle="rcl" key="scheduler.third"/>
                              <html:option value="4" bundle="rcl" key="scheduler.fourth"/>
                           </html:select>
                           <html:select property="monthlyWeekDay" styleId="monthlyWeekDay" disabled="true">
                              <html:option value="SUN" bundle="rcl" key="sunday"/>
                              <html:option value="MON" bundle="rcl" key="monday"/>
                              <html:option value="TUE" bundle="rcl" key="tuesday"/>
                              <html:option value="WED" bundle="rcl" key="wednesday"/>
                              <html:option value="THU" bundle="rcl" key="thursday"/>
                              <html:option value="FRI" bundle="rcl" key="friday"/>
                              <html:option value="SAT" bundle="rcl" key="saturday"/>
                           </html:select>
                           <!--of every month<br/>-->
                           <fmt:message key="scheduler.ofEvery"/> <html:text property="monthlyInterval" size="3" styleId="monthlyRelativeInterval" disabled="true"/> <fmt:message key="scheduler.months"/><br/>
                        <html:radio property="monthlyType" value="absolute" onclick="uiController.refreshMonthlySelections()" styleId="monthlyType"/>
                           <fmt:message key="scheduler.Day"/>
                           <html:select property="monthlyDay" styleId="monthlyDay" disabled="true">
                           <%
                              for(int i = 1; i <= 31; i++)
                              {
                                 pageContext.setAttribute("day", "" + i);
                           %>
                              <html:option value="${day}"><c:out value="${day}"/></html:option>
                           <%
                              }
                           %>
                           </html:select>
                           <!--of every month-->
                           <fmt:message key="scheduler.ofEvery"/> <html:text property="monthlyInterval" size="3" styleId="monthlyAbsoluteInterval" disabled="true"/> <fmt:message key="scheduler.months"/> <br/>

                     </div>

                   <div id="yearlyTrigger">
                        <html:radio property="yearlyType" value="relative" onclick="uiController.refreshYearlySelections()" styleId="yearlyType"/>
         <!--todo i18n : This sentance does not follow i18n guidelines.  We should not have input fields in the middle of a sentance. -->
                           <fmt:message key="scheduler.The"/>
                           <html:select property="yearlyWeek" styleId="yearlyWeek" disabled="true">
                              <html:option value="1" bundle="rcl" key="scheduler.first"/>
                              <html:option value="2" bundle="rcl" key="scheduler.second"/>
                              <html:option value="3" bundle="rcl" key="scheduler.third"/>
                              <html:option value="4" bundle="rcl" key="scheduler.fourth"/>
                           </html:select>
                           <html:select property="yearlyWeekDay" styleId="yearlyWeekDay" disabled="true">
                              <html:option value="SUN" bundle="rcl" key="sunday"/>
                              <html:option value="MON" bundle="rcl" key="monday"/>
                              <html:option value="TUE" bundle="rcl" key="tuesday"/>
                              <html:option value="WED" bundle="rcl" key="wednesday"/>
                              <html:option value="THU" bundle="rcl" key="thursday"/>
                              <html:option value="FRI" bundle="rcl" key="friday"/>
                              <html:option value="SAT" bundle="rcl" key="saturday"/>
                           </html:select>
                           <fmt:message key="scheduler.ofEvery"/>
                           <html:select property="yearlyMonth" styleId="yearlyRelativeMonth" disabled="true">
                              <html:option value="1" bundle="rcl" key="january"/>
                              <html:option value="2" bundle="rcl" key="february"/>
                              <html:option value="3" bundle="rcl" key="march"/>
                              <html:option value="4" bundle="rcl" key="april"/>
                              <html:option value="5" bundle="rcl" key="may"/>
                              <html:option value="6" bundle="rcl" key="june"/>
                              <html:option value="7" bundle="rcl" key="july"/>
                              <html:option value="8" bundle="rcl" key="august"/>
                              <html:option value="9" bundle="rcl" key="september"/>
                              <html:option value="10" bundle="rcl" key="october"/>
                              <html:option value="11" bundle="rcl" key="november"/>
                              <html:option value="12" bundle="rcl" key="december"/>
                           </html:select>
                        <br/>

                        <html:radio property="yearlyType" value="absolute" onclick="uiController.refreshYearlySelections()" styleId="yearlyType"/>
                           <fmt:message key="scheduler.Day"/>
                           <html:select property="yearlyDay" styleId="yearlyDay" disabled="true">
                           <%
                              for(int i = 1; i <= 31; i++)
                              {
                                 pageContext.setAttribute("day", "" + i);
                           %>
                              <html:option value="${day}"><c:out value="${day}"/></html:option>
                           <%
                              }
                           %>
                           </html:select>
                           <fmt:message key="scheduler.ofEvery"/>
                        <html:select property="yearlyMonth" styleId="yearlyAbsoluteMonth" disabled="true">
                              <html:option value="1" bundle="rcl" key="january"/>
                              <html:option value="2" bundle="rcl" key="february"/>
                              <html:option value="3" bundle="rcl" key="march"/>
                              <html:option value="4" bundle="rcl" key="april"/>
                              <html:option value="5" bundle="rcl" key="may"/>
                              <html:option value="6" bundle="rcl" key="june"/>
                              <html:option value="7" bundle="rcl" key="july"/>
                              <html:option value="8" bundle="rcl" key="august"/>
                              <html:option value="9" bundle="rcl" key="september"/>
                              <html:option value="10" bundle="rcl" key="october"/>
                              <html:option value="11" bundle="rcl" key="november"/>
                              <html:option value="12" bundle="rcl" key="december"/>
                           </html:select><br/>
                     </div>
</fieldset></td>
         </tr>
         <tr>
            <td colspan="4">
               <fieldset>

                  <div id="startDateDiv" class="nvPair"  style="float:left;margin-right:5px;" >
                     <div ><fmt:message key="scheduleWizard.startDate.label"/></div>
                     <html:text property="startDate" size="10"  styleId="startDate" />
                     <input type="button" value="..." id="startDateBnt" name="startDateBnt"/>
                   </div>
                   <div id="startTimeDiv" class="nvPair" >
                     <div ><fmt:message key="scheduleWizard.startTime.label"/> </div>
                     <html:text property="startTime" size="4"  styleId="startTime" style="text-align:right;" />
                     <html:select property="startTimeAmPm" >
                        <html:option value="AM">AM</html:option>
	                     <html:option value="PM">PM</html:option>
                     </html:select>
                    </div>



               </fieldset>
            </td>
         </tr>

         <tr>
            <td colspan="4">
               <fieldset>
                  <input type="radio" name="endType" value="indefinite" onclick="uiController.refreshEndSelections()" id="endType" />
                     <fmt:message key="scheduleWizard.runIndefinitely"/><br/>
                  <div id="dailyEndDiv">
                  <input type="radio" name="endType" value="numberOfExecutions" onclick="uiController.refreshEndSelections()" id="endType" />
                     <fmt:message key="scheduleWizard.numberOfExecutions"/>
                     <input type="text" value="1" name="numExecutionsTxt" id="numExecutionsTxt" size="3" style="text-align:right;"/>  <br/>
                  </div>

                  <input type="radio" name="endType" value="date" onclick="uiController.refreshEndSelections()" id="endType" />
                     <fmt:message key="scheduleWizard.endDate.label"/>
                     <input type="text" name="endDateTxt" size="10"  id="endDateTxt" />
                     <input type="button" value="..." id="endDateBnt" name="endDateBnt"/> <br/>



               </fieldset>
            </td>
         </tr>


      <tr>
         <td colspan="4">
            <html:button property="" styleId="saveButton" onclick="uiController.save();"
                    altKey="scheduler.button.save.alt" titleKey="scheduler.button.save.title" bundle="rcl">
               <fmt:message key="scheduler.button.save"/>
               </html:button>
         </td>
      </tr>

      </table>


   <div style="visibility:hidden;">
   <html:hidden property="selectedFolderId"/>
   <html:hidden property="parentDashboardPageId"/>
   <html:hidden property="reportDashboardModuleId"/>
   <html:hidden property="scheduleId"/>
   <html:hidden property="endDate"/>
   <html:hidden property="numberOfExecutions"/>
      <c:forEach var="day" items="${form.weeklyDays}">
         <input type="hidden" name="weeklyDays" value="<c:out value="${day}"/>"/>
      </c:forEach>


     <select  id="targetNames" name="targetNames" multiple="multiple"> </select>
     <select  id="targetIds" name="targetIds" multiple="multiple"> </select>
     <select  id="selectedTargetList" name="selectedTargetList" multiple="multiple"></select>
   </div>

</html:form>



</body>
</html>



