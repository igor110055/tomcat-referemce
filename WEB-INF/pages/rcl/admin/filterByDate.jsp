<?xml version="1.0" encoding="UTF-8"?>
<%--
   This page displays the "Filter By Date" screen

   ---------------------------
   @author : David Paul (dpaul@inmotio.com)

   $Id: filterByDate.jsp 6945 2009-10-19 14:40:14Z dbequeaith $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>
      <title>Filter By Date</title>


      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
      <%-- Calendar Includes... --%>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

      <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/TimeZone.js" language="JavaScript"></script>


      <style type="text/css">
         @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";
         @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";

         @import "<%= request.getContextPath() %>/styles/rcl/FadeMessage.css";
         @import "<%= request.getContextPath() %>/styles/rcl/DropShadow.css";
         /* override - we want scroll bar on the grid (so toolbar stays constant) */
         #bodyDiv {
            overflow:hidden;
         }

      </style>
      <script type="text/javascript">
         function setup()
         {
            //--- now wire in the calendar...
            Calendar.setup( {
                 inputField : 'startDate', // ID of the input field
                 ifFormat : "%Y-%m-%d", // the date format
                 button :  'startDateBnt' // ID of the button
              }
            );

            if ($('endDate')!=null)
            {
               Calendar.setup({
                 inputField : 'endDate', // ID of the input field
                 ifFormat : "%Y-%m-%d", // the date format
                 button :  'endDateBnt' // ID of the button
               });
            }
         }

         function cancel()
         {
            document.forms[0].action = "<%=request.getContextPath()%>/secure/actions/admin/manageIncidents.do";
            document.forms[0].submit();
         }

         function checkAndSubmit()
         {
            var sDate = document.getElementById("startDate");
            var eDate = document.getElementById("endDate");
            var sTime = document.getElementById("startTime");
            var eTime = document.getElementById("endTime");
            var sDateCheck = document.getElementById("startDateCheck");
            var eDateCheck = document.getElementById("endDateCheck");

            var isValid = true;

            if (!Date.validateDateStr(sDate.value,  "%Y-%m-%d", true))
            {
               sDateCheck.innerHTML = "Error in start date - YYYY-MM-dd";
               sDateCheck.style.color = "red";
               sDateCheck.style.display = "block";
               isValid = false;
            }
            else
            {
               sDateCheck.style.display = "none";
            }

            if (!Date.validateDateStr(eDate.value,  "%Y-%m-%d", true))
            {
               eDateCheck.innerHTML = "Error in end date - YYYY-MM-dd";
               eDateCheck.style.color = "red";
               eDateCheck.style.display = "block";
               isValid = false;
            }
            else
            {
               eDateCheck.style.display = "none";
            }

            if (isValid)
            {
               document.forms[0].submit();
            }
         }

      </script>
   </head>
   <body onload="setup();">
   <div id="bodyDiv">
      <div id="contentShell">
         <h3>Please select the dates you want to filter on</h3>
         <html:form action="/secure/actions/admin/processDates">
            <div id="workspace">
               <fieldset>

                  <div id="startDateDiv" class="nvPair"  style="float:left;margin-right:5px;" >
                     <div ><fmt:message key="scheduleWizard.startDate.label"/></div>
                     <input type="text" id="startDate" size="10"  name="startDate" value="<c:out value="${form.startDate}"/>"/>
                     <input type="button" value="Calendar" id="startDateBnt" name="startDateBnt"/>
                   </div>
                   <div id="startTimeDiv" class="nvPair" >
                     <div ><fmt:message key="scheduleWizard.startTime.label"/> </div>
                     <input type="text" id="startTime" size="4"  name="startTime" style="text-align:right;" value="<c:out value="${form.startTime}"/>"/>
                     <select id="startTimeAmPm" name="startTimeAmPm" >
                        <c:choose>
                           <c:when test="${form.startTimeAmPm=='AM'}">
                              <option selected="selected" value="AM">AM</option>
                              <option value="PM">PM</option>
                           </c:when>
                           <c:otherwise>
                              <option value="AM">AM</option>
                              <option selected="selected" value="PM">PM</option>
                           </c:otherwise>
                        </c:choose>
                     </select>
                    </div>

                  <div id="endDateDiv" class="nvPair"  style="clear:both;float:left;margin-right:5px;" >
                     <div ><fmt:message key="scheduleWizard.endDate.label"/></div>
                     <input type="text" id="endDate" size="10"  name="endDate" value="<c:out value="${form.endDate}"/>"/>
                     <input type="button" value="Calendar" id="endDateBnt" name="endDateBnt"/>
                   </div>
                   <div id="endTimeDiv" class="nvPair" >
                     <div ><fmt:message key="scheduleWizard.endTime.label"/> </div>
                     <input type="text" id="endTime" size="4"  name="endTime" style="text-align:right;" value="<c:out value="${form.endTime}"/>"/>
                      <select id="endTimeAmPm" name="endTimeAmPm" >
                         <c:choose>
                            <c:when test="${form.endTimeAmPm=='AM'}">
                               <option selected="selected" value="AM">AM</option>
                               <option value="PM">PM</option>
                            </c:when>
                            <c:otherwise>
                               <option value="AM">AM</option>
                               <option selected="selected" value="PM">PM</option>
                            </c:otherwise>
                         </c:choose>
                      </select>
                    </div>

               </fieldset>
               <input type="button" value="Ok" onclick="checkAndSubmit();"/>
               <input type="button" value="Cancel" onclick="cancel();"/>                                        
            </div>

        </html:form>
         <div>
            <p id="startDateCheck" style="display:none"></p>
            <p id="endDateCheck" style="display:none"></p>
         </div>

      </div>
   </div>
   </body>
</html>