<%@ page import="org.apache.commons.lang.StringUtils" %>
<%
   //--- for Firefox, we render this page in standards compliant mode, for IE, fall back to
   //    quirks mode...
   String userAgentHeader = request.getHeader("user-agent");
   if (StringUtils.contains(userAgentHeader, "Firefox"))
   {
      out.println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
      out.println("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
   }
%>
<%--
   This page displays reportInstances

   ---------------------------
   @author : Lance Hankins (lhankins@focus-technologies.com)

   $Id: browseReportInstances.jsp 7194 2010-06-23 15:06:30Z dbequeaith $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>
      <title>Report Output</title>



      <%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


      <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>
      <%@ include file="/scripts/rcl/dialogs/RclDialogIncludes.jsp"%>



      <%-- include browser specific stylesheet for the grid... --%>
      <script type="text/javascript">
         if (is_ie)
            document.write('<link rel="stylesheet" href="<%=request.getContextPath()%>/styles/rcl/ie/JsGrid.css" type="text/css"/>\n');
         else
            document.write('<link rel="stylesheet" href="<%=request.getContextPath()%>/styles/rcl/moz/JsGrid.css" type="text/css"/>\n');
      </script>

      <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
         @import "<%= request.getContextPath() %>/styles/rcl/DropShadow.css";
         @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
         @import "<%= request.getContextPath() %>/styles/rcl/browseReportInstances.css";

         /*
         IMPORTANT : if you modify the width of these, update #rerGrid definition in
         browseReportInstances.css (firefox) & browserHacks.css for IE6/IE7
         */
         div.grid *.column-0 {width: 50px; text-align: right;}
         div.grid *.column-1 {width: 340px; background-color: ThreeDLightShadow;}
         div.grid *.column-2 {width: 110px; text-align: left;}
         div.grid *.column-3 {width: 138px; text-align: right;}
         div.grid *.column-4 {width: 87px; text-align: right;}

         div.tree ul.nodes
         {
            border-top: 1px solid #DDDDDD;
            list-style-type: none;
            padding: 1px 0px 0px 8px;
            margin: 0px;
            white-space: nowrap;		/* force one-line text */

         }

      </style>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ImageHelper.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DateUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsGrid.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/reportViewer/LaunchReportViewer.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportInstance.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/AbstractKeyHandler.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/GridKeyHandler.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/TreeKeyHandler.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/BrowseReportInstancesUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/BurstSelectorUi.js"></script>

      <script type="text/javascript">

         <c:out value="${browseReportInstancesForm.jsUserPreferences}" escapeXml="false"/>

         <%-- called from the property frame to show the report description --%>
         function showDialog(message, title, icon, x, y)
         {
            DialogUtil.rclAlertEx(message, title, icon, x, y);
         }

         <%-- defines object which maps status enum ints -> appropriate lang specific description --%>
         <c:out value="${browseReportInstancesForm.jsReportStatusEnums}" escapeXml="false" />

         <%-- this getter defines and populates a JS array of Rer Summaries called rerSummaries--%>
         <c:out value="${browseReportInstancesForm.jsRerSummaries}" escapeXml="false" />


         var uiModel = new BrowseReportInstancesUiModel (rerSummaries, rerStatusStrings);
         var uiController = new BrowseReportInstancesUiController(document, uiModel);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();

            if (!is_ie)
               window.onresize = function (anEvent) { uiController.onFrameResize(); };

            uiController.onFrameResize();
         });


      </script>


   </head>

   <body class="rclBody workspace" 
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <div id="bodyDiv" onselectstart="return false;">
         <div id="contentShell">

            <html:form action="/secure/actions/browseReportInstances.do" method="post">
               <html:hidden property="numberOfPastDays" styleId="numberOfPastDays" />
               <html:hidden property="adminViewAll" styleId="adminViewAll" />
               <html:hidden property="displayOption" styleId="displayOption" />
               <html:hidden property="drillDisplay" styleId="drillDisplay" />
               <html:hidden property="currentPageNumber" styleId="currentPageNumber" />
               <html:hidden property="totalPages" styleId="totalPages" />
               <html:hidden property="skipToPage" styleId="skipToPage" value="0"/>
               <html:hidden property="filterType" styleId="filterType"/>
               <html:hidden property="sortBy" styleId="sortBy" />
               <html:hidden property="sortOrder" styleId="sortOrder"/>
               <html:hidden property="filterParams" styleId="filterParams" />

               <div id="workspace">

                  <%--  workspace toolbar --%>
                  <div class="workspaceToolbar" style="height:26px;">
                     <div id="toolbar">
                     </div>
                  </div>
                  <div id="nextPrevButtons">


                     <html:text style="text-align:right" size="3" property="displayCurrentPageNumber"
                                onkeypress="return uiController.modifyUserInputSkipToPage(event);"/>

                     <label for="displayCurrentPageNumber">
                     / <c:out value="${form.pagedRerSummaries.pagingInfo.totalPages}"/>
                     </label>

                     <c:set var="contextPath" value="<%=request.getContextPath()%>"/>
                     <html:img bundle="rcl" styleClass="nextPrevButtons" styleId="firstPageButton" src="${contextPath}/images/firstPage.gif"
                             altKey="reportOutputs.firstPageButton.alt" titleKey="reportOutputs.firstPageButton.title" onclick="javascript:uiController.firstPage();"/>

                     <html:img bundle="rcl" styleClass="nextPrevButtons" styleId="prevPageButton" src="${contextPath}/images/previousPage.gif"
                        altKey="reportOutputs.previousPageButton.alt" titleKey="reportOutputs.previousPageButton.title" onclick="javascript:uiController.previousPage();"/>

                     <html:img bundle="rcl" styleClass="nextPrevButtons" styleId="nextPageButton" src="${contextPath}/images/nextPage.gif"
                        altKey="reportOutputs.nextPageButton.alt" titleKey="reportOutputs.nextPageButton.title" onclick="javascript:uiController.nextPage();"/>

                     <html:img bundle="rcl" styleClass="nextPrevButtons" styleId="lastPageButton" src="${contextPath}/images/lastPage.gif"
                        altKey="reportOutputs.lastPageButton.alt" titleKey="reportOutputs.lastPageButton.title" onclick="javascript:uiController.lastPage();"/>


               </div>
                  <div id="workspaceBody" class="workspaceBodyNormal">
                     <div id="rerGrid" onselectstart="return false;" >
                     </div>

                      <div id="rerList" onselectstart="return false;" >
                     </div>
                  </div>
               </div>
            </html:form>

         </div>
      </div>
   </body>


</html>
