<%@ page import="com.focus.rcl.RclEnvironment" %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   This page displays the contents of a folder...

   ---------------------------
   @author : Lance Hankins (lhankins@focus-technologies.com)

   $Id: folderContents.jsp 6506 2009-01-30 17:53:04Z dpaul $

--%>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>
      <title>Folder Contents</title>

      <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
       <%@ include file="/scripts/rcl/dialogs/RclDialogIncludes.jsp"%>

      <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
         @import "<%= request.getContextPath() %>/styles/rcl/folderContents.css";
         @import "<%= request.getContextPath() %>/styles/rcl/FadeMessage.css";
      </style>


      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ImageHelper.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/FolderContentsKeyListener.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/FolderContentsUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/reportViewer/LaunchReportViewer.js"></script>
      <script type="text/javascript">

         //todo find a better way to do this
         var canDeletePublicItems=false;
         <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
            canDeletePublicItems=true;
         </logic:present>

         <%-- called from the property frame to show the report description --%>
         function showDialog(message, title, icon, x, y)
         {
            DialogUtil.rclAlertEx(message, title, icon, x, y);
         }

         <c:out value="${folderContentsForm.jsCategories}" escapeXml="false" />
         var uiModel = new FolderContentsUiModel(categories);
         var uiController = new FolderContentsUiController(document, uiModel);

         function onItemClick(item){
             uiController.categoryItemClicked(item.value);
          }

         <c:out value="${folderContentsForm.categorizeByOptionsJs}" escapeXml="false"/>

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();

            if (!is_ie)
               window.onresize = function (anEvent) { uiController.onFrameResize(); };

            <!-- TODO: replace this with acegi tag...-->
            <logic:notPresent role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
              document.getElementById("renameReportPermission").value = "false";
            </logic:notPresent>
            <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
              document.getElementById("renameReportPermission").value = "true";
            </logic:present>
         });

         <c:out value="${folderContentsForm.jsUserPreferences}" escapeXml="false"/>


      </script>


   </head>

   <body class="rclBody workspace"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">



         <div id="bodyDiv">
            <div id="contentShell">

               <html:form action="/secure/actions/folderContents.do" method="get">

                  <div id="workspace">
                     <%--  workspace toolbar --%>
                     <div class="workspaceToolbar" style="height:26px;">
                        <div id="toolbar">
                        </div>
                        <!--<br/>-->
                        <html:hidden styleId="categorizeBy" property="categorizeBy" />
                        <html:hidden styleId="workSpaceSize" property="workSpaceSize" />
                        <html:hidden property="folderId" styleId="folderId" />
                        <html:hidden property="displayFilterOptions" styleId="displayFilterOptions" />
                        <html:hidden property="filterType" styleId="filterType" />

                        <input type="text" style="display:none;" name="renameReportPermission" id="renameReportPermission"/>
                     </div>
                     <div id="workspaceBody" class="workspaceBodyNormal" onselectstart="return false;">
                        <!--onselectstart="return false;">-->
                        <%-- content is inserted here... --%>
                     </div>

                  </div>



                 <script type="text/javascript">
                     <logic:notPresent role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
                       this.document.getElementById("renameReportPermission").value = "false";
                     </logic:notPresent>
                     <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
                       this.document.getElementById("renameReportPermission").value = "true";
                     </logic:present>
                  </script>

               </html:form>
           </div>
        </div>
   </body>
</html>
