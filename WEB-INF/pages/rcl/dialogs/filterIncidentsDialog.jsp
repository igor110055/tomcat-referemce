<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Filter Dialog...

   ---------------------------
   @author : David Paul (dpaul@inmotio.com)

   $Id: filterIncidentsDialog.jsp 6945 2009-10-19 14:40:14Z dbequeaith $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>
   <title>Filter Selection</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FolderHierarchy.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FilterIncidentsDialogUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

   <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/TimeZone.js" language="JavaScript"></script>



   <style type="text/css">
      @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";
      @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";

      @import "<%= request.getContextPath() %>/styles/rcl/FadeMessage.css";
      @import "<%= request.getContextPath() %>/styles/rcl/DropShadow.css";
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";

      #topPane {
         width: 100%;
         display:block;
      }

      #navTree {
         float: left;
         height: 300px;
         min-height: 300px;
         width: 100%;

         border-width: 1px 0px 1px 1px;
         border-style: solid;
         border-color: #DDDDDD;
         overflow:scroll;
      }

      #bottomPane {
         width: 100%;
         display: block;
         clear:both;

      }


      #bottomButtons {
         width: 100%;

         padding-top: 5px;

         text-align:center;
         border-width: 1px 0px 1px 1px;
         border-style: solid;
         border-color: #DDDDDD;
         overflow:auto;
      }


      *.dialogButton  {
         width: 100px;
      }


   </style>

</head>
<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded(); setup(); window.dialogUiController = uiController;"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

<input type="hidden" id="sTime" value="<c:out value="${form.startTime}"/>" />
<input type="hidden" id="eTime" value="<c:out value="${form.endTime}"/>" />


   <div id="topPane">
      <div id="navTree">
         <div id="contentShell">
            <div id="workspace">
               <div>
                  <fieldset>
                     <legend><fmt:message key="dialogs.filter.logon"/></legend>
                     <input type="text" id="logon" name="logon" value=""/>
                  </fieldset>
               </div>

               <fieldset>
                     <legend><fmt:message key="dialogs.filter.dates"/></legend>
                     <div id="startDateDiv" class="nvPair"  style="float:left;margin-right:5px;" >
                        <div ><fmt:message key="scheduleWizard.startDate.label"/></div>
                        <input type="text" id="startDate" size="10"  name="startDate" value="" onchange="setStartTime();"/>
                        <input type="button" value="Calendar" id="startDateBnt" name="startDateBnt" onclick="setStartTime();"/>
                      </div>
                      <div id="startTimeDiv" class="nvPair" >
                        <div ><fmt:message key="scheduleWizard.startTime.label"/> </div>
                        <input type="text" id="startTime" size="4"  name="startTime" style="text-align:right;" value=""/>
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
                        <input type="text" id="endDate" size="10"  name="endDate" value="" onchange="setEndTime();"/>
                        <input type="button" value="Calendar" id="endDateBnt" name="endDateBnt" onclick="setEndTime();"/>
                      </div>
                      <div id="endTimeDiv" class="nvPair" >
                        <div ><fmt:message key="scheduleWizard.endTime.label"/> </div>
                        <input type="text" id="endTime" size="4"  name="endTime" style="text-align:right;" value=""/>
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
               <div>
                  <fieldset>
                     <legend><fmt:message key="dialogs.filter.errorMessage"/></legend>
                     <input type="text" id="errorMessage" name="errorMessage" value=""/>
                  </fieldset>
               </div>

                  <div>
                     <fieldset>
                        <legend><fmt:message key="dialogs.filter.rer"/></legend>
                        <input type="text" id="rerId" name="rerId" value=""/>
                     </fieldset>
                  </div>
               <p id="startDateCheck"></p>
               <p id="endDateCheck"></p>
            </div>
         </div>
      </div>
   </div>

         <div id="bottomPane">
            <div id="bottomButtons">
               <input class="dialogButton" id="FilterSubmitButton" type="button" value="OK" onclick="uiController.onOkButtonPress();" />
               <input class="dialogButton" type="button" value="Cancel" onclick="uiController.onCancelButtonPress();"/>
            </div>
         </div>


   <script type="text/javascript" xml:space="preserve">

      var uiModel = new FilterIncidentsDialogUiModel(null, null);
      var uiController = new FilterIncidentsDialogUiController(document, uiModel, false);

      //--- easier access for someone who wants to access us as an iframe...
      window.dialogUiController = uiController;

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {  
         uiController.initUi();
      });

      DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
         //--- clean up dialog reference...
         window.dialogUiController = null;
      });

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

      function setStartTime()
      {
         var start = document.getElementById("startTime");
         var sTime = document.getElementById("sTime");

         if (sTime != null && sTime.value != '' && sTime.value != null)
         {
            start.value = sTime.value;
         }
      }

      function setEndTime()
      {
         var end = document.getElementById("endTime");
         var eTime = document.getElementById("eTime");

         if (eTime != null && eTime.value != '' && eTime.value != null)
         {
            end.value = eTime.value;
         }
      }      

   </script>
</body>
</html>

