<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing Schedule Type and Name

   ---------------------------
   @author : Roger Moore

   $Id: scheduleTiming.jsp 7008 2009-11-12 21:38:59Z mmeza $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%-- Calendar Includes... --%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

   <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/TimeZone.js" language="JavaScript"></script>

   <style type="text/css" xml:space="preserve">
      @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";
   </style>

   <%@ include file="/WEB-INF/pages/rcl/scheduler/commonSchedulerIncludes.jsp"%>

   <title><fmt:message key="scheduleWizard.title"/></title>
   <html:xhtml/>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/scheduler/ScheduleTiming.js"></script>

   <script type="text/javascript">

      var uiModel;
      var uiController;

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         uiModel = new ScheduleTimingUiModel(currentTimeZone);  //currentTimeZone defined via call to form.currentTimeZonesJs below
         uiController = new ScheduleTimingUiController(document, uiModel);

         uiController.initUi();
         uiController.onSchedulerDialogResize();


      });

   </script>

</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"
      onresize="uiController.onSchedulerDialogResize();"
      style="margin:0px;">

<html:form action="/secure/actions/scheduleWizardGesture" method="post">

   <script type="text/javascript">
         <c:out value="${form.currentTimeZonesJs}" escapeXml="false"/>
   </script>

   <div id="schedulerTop" class="layoutSection">
      <jsp:include page="schedulerWizardTop.jsp"/>
   </div>

   <div id="schedulerCenterContent" >

      <%-----------------------------------------------%>
      <%-- BEGIN CUSTOM CONTENT FOR THIS WIZARD STEP --%>
      <%-----------------------------------------------%>
      <html:hidden property="currentStage" styleId="currentStage"  value="timing"/>



         <table style="margin-top:10px" align="center">

         <c:if test="${form.scheduleType!=form.scheduleTypeMap.ONCE.value}" >
         <tr>
         <td colspan="4">
         <fieldset>
           <%--<legend><fmt:message key="scheduleWizard.recurrenceFieldSet"/></legend>--%>

         <c:choose>

            <c:when test="${form.scheduleType==form.scheduleTypeMap.DAILY.value}" >

               <div id="dailyTrigger">
                  <html:radio property="dailyRate"  value="minutes" onclick="uiController.refreshDailySelections()" styleId="dailyRate"/>
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
            </c:when>
            <c:when test="${form.scheduleType==form.scheduleTypeMap.WEEKLY.value}" >

                <div id="weeklyTrigger">
                     <fmt:message key="scheduler.Every"/>
                     <html:text property="weeklyInterval" styleId="weeklyInterval" size="3"/>
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
            </c:when>

            <c:when test="${form.scheduleType==form.scheduleTypeMap.MONTHLY.value}" >
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
            </c:when>

            <c:when test="${form.scheduleType==form.scheduleTypeMap.YEARLY.value}" >
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
            </c:when>
        </c:choose></fieldset></td>
         </tr></c:if>
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
                     <html:select property="startTimeAmPm" styleId="startTimeAmPm" >
                        <html:option value="AM">AM</html:option>
	                     <html:option value="PM">PM</html:option>
                     </html:select>
                    </div>



               </fieldset>
            </td>
         </tr>
         <c:if test="${form.scheduleType!=form.scheduleTypeMap.ONCE.value}" >
         <tr>
            <td colspan="4">
               <fieldset>
                  <input type="radio" name="endType" value="indefinite" onclick="uiController.refreshEndSelections()" id="endType" />
                     <fmt:message key="scheduleWizard.runIndefinitely"/><br/>
                  <c:if test="${form.scheduleType==form.scheduleTypeMap.DAILY.value}" >
                  <input type="radio" name="endType" value="numberOfExecutions" onclick="uiController.refreshEndSelections()" id="endType" />
                     <fmt:message key="scheduleWizard.numberOfExecutions"/>
                     <input type="text" value="1" name="numExecutionsTxt" id="numExecutionsTxt" size="3" style="text-align:right;" onfocus="uiController.setRadioValue('endType', 'numberOfExecutions')" />  <br/>
                  </c:if>

                  <input type="radio" name="endType" value="date" onclick="uiController.refreshEndSelections()" id="endType" />
                     <fmt:message key="scheduleWizard.endDate.label"/>
                     <input type="text" name="endDateTxt" size="10"  id="endDateTxt" onfocus="uiController.setRadioValue('endType', 'date')" />
                     <input type="button" value="..." id="endDateBnt" name="endDateBnt"/> <br/>



               </fieldset>
            </td>
         </tr>
         </c:if>


        </table>
      <%-----------------------------------------------%>
      <%--  END CUSTOM CONTENT FOR THIS WIZARD STEP  --%>
      <%-----------------------------------------------%>


   </div>


   <div id="scheduleBottom" class="layoutSection">
      <jsp:include page="schedulerWizardBottom.jsp"/>
   </div>


      <!-- Standard Fields in each of the tabs... -->
     <%-- <html:hidden property="saveAsNewProfileName"/>--%>
      

      <html:hidden property="jumpTo" styleId="jumpTo" value=""/>
      <html:hidden property="viewGesture" styleId="viewGesture" value=""/>
      <html:hidden property="complete" styleId="complete" />

      <html:hidden property="scheduleType" styleId="scheduleType"  />
      <html:hidden property="scheduleName" styleId="scheduleName" />

      <html:hidden property="endDate" styleId="endDate"  />
      <html:hidden property="numberOfExecutions" styleId="numberOfExecutions" />
      <html:hidden property="scheduleId" styleId="scheduleId" />
      <html:hidden property="selectedFolderId" styleId="selectedFolderId" />

      <c:forEach var="id" items="${form.targetIds}">
           <input type="hidden" name="targetIds" id="targetIds" value="<c:out value="${id}"/>"/>
      </c:forEach>

      <c:forEach var="name" items="${form.targetNames}">
         <input type="hidden" name="targetNames" id="targetNames" value="<c:out value="${name}"/>"/>
      </c:forEach>

</html:form>

  

</body>
</html>
