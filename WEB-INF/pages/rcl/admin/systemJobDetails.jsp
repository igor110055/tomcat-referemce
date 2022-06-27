<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Edit the details about a CronExpression for a CronTrigger

   ---------------------------
   @author : David Paul (dpaul@inmotio.com)

   $Id: systemJobDetails.jsp 6945 2009-10-19 14:40:14Z dbequeaith $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>
<title>Manage CronTrigger Details</title>
   <%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/CronExpressionValidator.js"></script>
   
   <script type="text/javascript">
      function validateCronExpressionAndSubmit(aTriggerName, aMin, aHour, aDay, aMonth, aWeekday, aDaysOld)
      {
         var myValidator = new CronExpressionValidator();

         var expressionValid = myValidator.isCronExpressionValid(aTriggerName, aMin, aHour, aDay, aMonth, aWeekday, aDaysOld);

         if(expressionValid )
         {
            document.forms[0].submit();
         }
      }
   </script>
   <style type="text/css">
      td.heading
      {
         text-decoration: underline;
         text-align: center;
         font-weight:bold;
      }
   </style>
</head>

<body class="rclBody"
   onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
   onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:xhtml/>

   <nested:form action="/secure/actions/admin/saveSystemJob">
      <html:hidden property="triggerName" styleId="triggerName"/>
      <html:hidden property="operation"/>
      <html:hidden property="pageTitle"/>

      <div>
         <div class="pageBanner">
         <c:out value="${form.pageTitle}"/>
         </div>
      </div>
      <div class="pageBody">
         <table>
            <tr>
               <td class="label">
                  <span class="labelText"><fmt:message key="admin.manage.header.triggerName"/> </span>
               </td>
               <td>
                  <c:out value="${form.trigger.name}"/>
               </td>
            </tr>

            <tr>
               <td class="label">
                  <span class="labelText"><fmt:message key="admin.systemJobs.edit.minute"/></span>
               </td>
               <td>
                  <html:text property="minute" size="90"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <span class="labelText"><fmt:message key="admin.systemJobs.edit.hour"/></span>
               </td>
               <td>
                  <html:text property="hour" size="90"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <span class="labelText"><fmt:message key="admin.systemJobs.edit.day"/></span>
               </td>
               <td>
                  <html:text property="day" size="90"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <span class="labelText"><fmt:message key="admin.systemJobs.edit.month"/></span>
               </td>
               <td>
                  <html:text property="month" size="90"/>
               </td>
            </tr>
            <tr>
               <td class="label">
                  <span class="labelText"><fmt:message key="admin.systemJobs.edit.weekday"/></span>
               </td>
               <td>
                  <html:text property="weekday" size="90"/>
               </td>
            </tr>
            <c:if test="${form.trigger.name =='triggerForCleanupOldIncidentsJob'}">
               <tr>
               <td class="label">
                  <span class="labelText"><fmt:message key="admin.systemJobs.edit.daysOld"/></span>
               </td>
               <td>
                  <html:text property="daysOld" size="90"/>
               </td>
               </tr>
            </c:if>
            <tr>
               <td colspan="2">
                  <html:hidden property="viewGesture"/>
                  <c:choose>
                     <c:when test="${form.trigger.name =='triggerForCleanupOldIncidentsJob'}">
                        <html:button property="" onclick="setViewGesture('OK'); validateCronExpressionAndSubmit(document.forms[0].triggerName.value, document.forms[0].minute.value, document.forms[0].hour.value, document.forms[0].day.value, document.forms[0].month.value, document.forms[0].weekday.value, document.forms[0].daysOld.value); "
                                     altKey="admin.button.ok.alt" titleKey="admin.button.ok.title" bundle="rcl">
                           <fmt:message key="admin.button.ok"/>
                        </html:button>
                     </c:when>
                     <c:otherwise>
                        <html:button property="" onclick="setViewGesture('OK'); validateCronExpressionAndSubmit(document.forms[0].triggerName.value,document.forms[0].minute.value, document.forms[0].hour.value, document.forms[0].day.value, document.forms[0].month.value, document.forms[0].weekday.value, null); "
                                     altKey="admin.button.ok.alt" titleKey="admin.button.ok.title" bundle="rcl">
                           <fmt:message key="admin.button.ok"/>
                        </html:button>
                     </c:otherwise>
                  </c:choose>


                  <html:submit property="" onclick="setViewGesture('Cancel'); document.forms[0].submit();" altKey="admin.button.cancel.alt"
                               titleKey="admin.button.cancel.title" bundle="rcl">
                     <fmt:message key="admin.button.cancel"/>
                  </html:submit>

                  <script type="text/javascript">
                     function setViewGesture(gesture)
                     {
                        document.forms[0].viewGesture.value = gesture;
                     }
                  </script>
               </td>
            </tr>
         </table>
       </div>
      <div>
         <h3>
            <p id="nullCheck" style="display:none"></p>
            <p id="minuteCheck" style="display:none"></p>
            <p id="hourCheck" style="display:none"></p>
            <p id="dayCheck" style="display:none"></p>
            <p id="monthCheck" style="display:none"></p>
            <p id="weekdayCheck" style="display:none"></p>
            <p id="daysOldCheck" style="display:none"></p>
            <p id="markCheck" style="display:none"></p>            
         </h3>
      </div>
      <div>
         CRON values allow numbers and number ranges (eg.1-5), including comma separated values (eg. 5, 10, 20-25). <br/>
         The wildcard character, * means any value and intervals are represented as */5, which means every five (minutes/hours etc).<br/>
      </div>
       <div>
          <table class="legend" border="1">
             <tr>
                <td class="heading">
                   Field Name
                </td>
                <td class="heading">
                   Allowed Values
                </td>
                <td class="heading">
                   Allowed Special Characters
                </td>
             </tr>
             <tr>
                <td>
                   Minutes
                </td>
                <td>
                   0-59
                </td>
                <td>
                   , - * /
                </td>
             </tr>
             <tr>
                <td>
                   Hours
                </td>
                <td>
                   0-23
                </td>
                <td>
                   , - * /
                </td>
             </tr>
             <tr>
                <td>
                   Day of the Month
                </td>
                <td>
                   1-31
                </td>
                <td>
                   , - * ? / L W C
                </td>
             </tr>
             <tr>
                <td>
                   Months
                </td>
                <td>
                   1-12 or JAN-DEC
                </td>
                <td>
                   , - * /
                </td>
             </tr>
             <tr>
                <td>
                   Day of the Week
                </td>
                <td>
                   1-7 or SUN-SAT
                </td>
                <td>
                   , - * ? / L C #
                </td>
             </tr>
          </table>
       </div>
   </nested:form>
</body>
</html>
