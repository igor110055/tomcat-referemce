<%@ page import="com.focus.rcl.RclEnvironment" %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   this page has links to various admin related functions

   ---------------------------
   @author : Lance Hankins (lhankins@focus-technologies.com)
   @author : Dan Bequeaith (dbequeaith@focus-technologies.com)

   $Id: adminConsole.jsp 7181 2010-05-12 19:04:25Z dsellari $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>
      <title>RCL Navigation Menu</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/scripts/rcl/dialogs/DialogIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/MenuBar.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/NavMenuUi.js"></script>

      <link rel="StyleSheet" href="<%= request.getContextPath() %>/styles/rcl/MenuBar.css" type="text/css"/>

      <style type="text/css">
         @import "<%=request.getContextPath()%>/styles/rcl/MenuBar.css";
         @import "<%=request.getContextPath()%>/styles/rcl/DropShadow.css";


         div.floatLeft {
            float: left;
         }


            /* hack : IE Dropshadow Hack - the first menu group gets the same bg color as the
               container for some reason, for now we just set the bg of the container to the same
               as the menu group */

         div.mgMenuGroupContainer {
            background-image: url(<%=request.getContextPath()%>/images/menuBarBackground.gif);
            background-repeat: no-repeat;
            background-position: 0px -1px;
            background-color:#0184ff !important;
         }

         #menuContainerDiv {
            float: left;
            width: 200px;
            border: 1px solid black;
            margin-top:0px;
         }

      </style>

   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:xhtml/>

      <div class="ydsf floatLeft">
         <div class="ydsfInner" id="menuContainerDiv" onselectstart="return false;">
            <!-- menubar will be inserted here -->
         </div>
      </div>

      <script type="text/javascript">

         var menuBar = new MenuBar ("menuContainerDiv", ServerEnvironment.baseUrl);

         var group = null;
         var menuItem = null;


         //--- Execute Reports...
         group = menuBar.createGroup ("Admin", applicationResources.getProperty("navMenu.header.adminConsole"), false, "miSelectedItem", "miNonSelectedItem");

         group.css.itemSelectedIcon = ServerEnvironment.baseUrl + "/images/menuGroupItem.gif";
         group.css.itemNonSelectedIcon = ServerEnvironment.baseUrl + "/images/menuGroupItem.gif";
         group.css.openIcon    = group.menuBar.baseContext + "/images/menuDown.gif";
         group.css.closedIcon  = group.menuBar.baseContext + "/images/menuRight.gif";

         group.addItem(new MenuItem('AdminConsole',applicationResources.getProperty("adminConsole.flushCaches"),'uiController.flushCaches();'));
         var uiModel = new NavMenuUiModel();
         var uiController = new NavMenuUiController(document, uiModel, menuBar);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function () {
            uiController.initUi();
         });

      </script>

   <div style="clear:both">
      <!-- this is just here so that the popup dialog will draw properly in firefox -->
   </div>

   </body>
</html>


   <%--<head>--%>
      <%--<title>ADF Admin Console</title>--%>


      <%--<%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>--%>
      <%--<%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>--%>

      <%--<style type="text/css">--%>

         <%--#adminActions {--%>
            <%--margin:10px;--%>
            <%--border: 1px solid black;--%>
            <%--border-collapse:collapse;--%>
         <%--}--%>

         <%--#adminActions thead {--%>
            <%--background-color: #A0A0A0;--%>
            <%--font-weight:bold;--%>
         <%--}--%>

         <%--#adminActions tr, #adminActions td {--%>
            <%--border: 1px solid #A0A0A0;--%>
            <%--padding: 8px 3px 8px 3px;--%>
            <%--vertical-align:top;--%>
         <%--}--%>
      <%--</style>--%>


   <%--</head>--%>

<%--<body class="rclBody"--%>
      <%--onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"--%>
      <%--onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">--%>

   <%--<div style="padding:0px 0px 20px 0px;">--%>
      <%--<div class="screenTitle">ADF Admin Functions</div>--%>
   <%--</div>--%>

   <%--<div>--%>
      <%--<table id="adminActions">--%>
         <%--<thead>--%>
            <%--<tr>--%>
               <%--<th>Action</th>--%>
               <%--<th>Description</th>--%>
            <%--</tr>--%>
         <%--</thead>--%>
         <%--<tbody>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/flushCaches.do"/>">Flush Caches (ParamValue and ReferenceData)</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Flush the ParamValue and ReferenceData caches.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/viewCrnProxyCache.do"/>">View Crn Proxy Cache</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--View individual entries in the Cognos SDK proxy cache.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/debugClassLoader.do"/>">Debug Class Loader</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Debug utility which allows you to determine which jar a given class is being loaded from.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/scanReports.do"/>">Scan Cognos for Changes to Registered Reports</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--For all registered reports in the ADF, scan Cognos to see if the report has changed (rebuilds the stored--%>
                  <%--metadata + cached report spec XML for these reports)--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/downloadServerLogs.do"/>">Download Server Log Files</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Download a zip file containing the server logs - for clustered environments, this only downloads the logs--%>
                  <%--from a single node.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/manageConfigProperties.do"/>">Manage Configuration Properties</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Manage the application configuration properties stored in the ADF database (RCL_CONFIG_PROPERTY).--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/manageReportService.do"/>">Manage Report Service</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Manage / Tune the ADF Report Service.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/adminService/manage.do"/>">Manage Admin Service</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Setup automatic monitoring of your application (nightly emails regarding interesting events, statistics, etc).--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/metaDataMenu.do"/>">Manage Package Metadata</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Manage / browse metadata that is stored in ADF about Cognos packages.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/reportMd/menu.do"/>">Manage Report Metadata</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Manage / browse metadata that is stored in ADF about registered Cognos Reports.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/manageSampleParameterValues.do"/>">Manage Sample Parameter Values</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--During operations like report validation or SQL retrieval, the ADF may need to supply parameter values--%>
                  <%--to Cognos for a report (even though the report isn't being "executed").  This screen gives admins a--%>
                  <%--place to setup "sample" parameter values (by parameter name, package, data type, etc).--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/sessionStats.do"/>">Show Session Stats for This Session</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--This screen lets you look at all things stored in the current user's HttpSession.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/showActiveUserSessions.do"/>">Show Active User Sessions</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--This screen lets you see all users who are currently logged into the system.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/incidentLookup.do"/>">Lookup Incident Report</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Browse / lookup incident reports.--%>
               <%--</td>--%>
            <%--</tr>--%>
            <%--<tr>--%>
               <%--<td>--%>
                  <%--<a target="adfAdminAction" href="<c:url value="/secure/actions/admin/cleanupOldRers.do"/>">Clean up Expired RERs</a>--%>
               <%--</td>--%>
               <%--<td>--%>
                  <%--Cleanup all ReportExecutionRequests (RERs) immediately.  This job normally gets run once per night (by quartz),--%>
                  <%--but if you want to run it immediately, use this link.--%>
               <%--</td>--%>
            <%--</tr>--%>
         <%--</tbody>--%>
      <%--</table>--%>


   <%--</div>--%>
<%--</body>--%>
