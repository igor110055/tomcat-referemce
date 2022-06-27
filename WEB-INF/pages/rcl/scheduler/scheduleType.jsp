<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing Schedule Type and Name

   ---------------------------
   @author : Roger Moore

   $Id: scheduleType.jsp 4683 2007-09-28 14:46:04Z rmoore $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/scheduler/commonSchedulerIncludes.jsp"%>

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

      #selectedTargetList
      {
         float: left;
         width: 325px;
         height: 175px;
         overflow: auto;

         border: 1px black solid;
      }


   </style>

   <title><fmt:message key="scheduleWizard.title"/></title>
   <html:xhtml/>



   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/scheduler/ScheduleType.js"></script>

   <script type="text/javascript">

      <c:out escapeXml="false" value="${form.jsReportFolders} "/>
      <c:out escapeXml="false" value="${form.jsSelectedTargets} "/>
      var uiModel = new ScheduleTypeUiModel(rootRclFolder, selectedTargets);
      var uiController = new ScheduleTypeUiController(document, uiModel);



      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
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


   <div id="schedulerTop" class="layoutSection">
      <jsp:include page="schedulerWizardTop.jsp"/>
   </div>

   <div id="schedulerCenterContent" >

      <%-----------------------------------------------%>
      <%-- BEGIN CUSTOM CONTENT FOR THIS WIZARD STEP --%>
      <%-----------------------------------------------%>
      <html:hidden property="currentStage" styleId="currentStage" value="type"/>



      <table border="0" cellpadding="10px"align="center" id="filterTable">
         <tr>
            <td colspan="2">

               <div class="nvPair">
                  <div class="label"><fmt:message key="scheduler.name" /></div>
                  <html:text styleId="scheduleName" property="scheduleName" size="40"/>
               </div>
             </td>
         </tr>
         <tr>
            <td colspan="2">

               <div class="nvPair">
                  <fieldset><legend><fmt:message key="scheduler.type"/></legend>

                   <nested:iterate property="scheduleTypes" id="aScheduleType">
                      <html:radio bundle="rcl" styleId="scheduleType"  property="scheduleType" value="${aScheduleType.value}" onclick="uiController.typeChanged()" /> <fmt:message key="${aScheduleType.displayName}"/>   <br/>

                   </nested:iterate>
                  </fieldset>

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
               <select id="availableReports" name="availableReports"  multiple="multiple" >
                              <%-- current calculated columns inserted here --%>
               </select>
            </td>
            <td colspan="1">

                     <input id="insertValueButton" style="display:block;" name="insertValueButton" class="vbutton"  type="button" value=">>"
                            onclick="javascript:uiController.insertSelectedTargets();" />
                     <input id="removeValueButton" name="removeValueButton" class="vbutton" type="button" value="<<"
                            onclick="javascript:uiController.removeSelectedTargets();" />

            </td>
            <td colspan="1">

               <div class="label"><fmt:message key="scheduleWizard.selectedTargets.label"/></div>

               <select  id="selectedTargetList" name="selectedTargetList" multiple="multiple">

               </select>

            </td>



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

     <div style="visibility:hidden;">
        <html:hidden property="jumpTo" styleId="jumpTo" value=""/>
        <html:hidden property="viewGesture" styleId="viewGesture" value=""/>
        <html:hidden property="complete" styleId="complete" />

        <html:hidden property="dailyRate" styleId="dailyRate" />
        <html:hidden property="dailyInterval" styleId="dailyInterval" />
        <html:hidden property="weeklyInterval" styleId="weeklyInterval" />

        <html:hidden property="monthlyWeek" styleId="monthlyWeek" />
        <html:hidden property="monthlyWeekDay" styleId="monthlyWeekDay"/>
        <html:hidden property="monthlyInterval" styleId="monthlyInterval" />
        <html:hidden property="monthlyDay" styleId="monthlyDay" />
        <html:hidden property="monthlyType" styleId="monthlyType" />

        <html:hidden property="yearlyType" styleId="yearlyType" />
        <html:hidden property="yearlyWeek" styleId="yearlyWeek" />
        <html:hidden property="yearlyWeekDay" styleId="yearlyWeekDay" />
        <html:hidden property="yearlyDay" styleId="yearlyDay" />
        <html:hidden property="yearlyMonth" styleId="yearlyMonth" />


        <html:hidden property="startDate" styleId="startDate" />
        <html:hidden property="startTime" styleId="startTime" />
        <html:hidden property="startTimeAmPm" styleId="startTimeAmPm" />
        <html:hidden property="endDate" styleId="endDate" />
        <html:hidden property="numberOfExecutions" styleId="numberOfExecutions" />

        <html:hidden property="scheduleId" styleId="scheduleId" />
        <html:hidden property="selectedFolderId" styleId="selectedFolderId" />


        <c:forEach var="day" items="${form.weeklyDays}">
           <input type="hidden" name="weeklyDays" id="weeklyDays" value="<c:out value="${day}"/>"/>
        </c:forEach>


       <select  id="targetNames" name="targetNames" multiple="multiple"> </select>
       <select  id="targetIds" name="targetIds" multiple="multiple"> </select>


       <%-- <c:forEach var="id" items="${form.targetIds}">
           <input type="hidden" name="nodeId" value="<c:out value="${id}"/>"/>
        </c:forEach>

        <c:forEach var="name" items="${form.targetNames}">
         <input type="hidden" name="nodeName" value="<c:out value="${name}"/>"/>
      </c:forEach>--%>
     </div>

</html:form>

  

</body>
</html>
