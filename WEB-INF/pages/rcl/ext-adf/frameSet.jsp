<%@ page import="com.focus.rcl.RclEnvironment" %>
<%@ page import="com.focus.rcl.reportservice.ReportExecutionStatusEnum" %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>

   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <!-- ext-js includes -->
   <%@ include file="/WEB-INF/pages/common/commonExtIncludes.jsp"%>
   <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp" %>

   <title>ADF</title>

   <style type="text/css">
      @import "<%= request.getContextPath() %>/styles/rcl/ext-adf/filters.css";
      @import "<%= request.getContextPath() %>/styles/rcl/ext-adf/browseRers.css";
      @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
      @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
      @import "<%=request.getContextPath() %>/styles/rcl/ext-adf/ext-adf.css";
      @import "<%=request.getContextPath()%>/styles/rcl/ext-adf/MultiSelect.css";

      @import "<%=request.getContextPath() %>/styles/rcl/reportDetails.css";
      @import "<%=request.getContextPath()%>/styles/rcl/reportProfileDetails.css";
      @import "<%= request.getContextPath() %>/styles/rcl/rerDetails.css";
   </style>
   <style type="text/css">
      html,body{
         width:100%;
         height:100%;
         margin:0px;
         padding:0px;
      }
      #navMenu ul {
         margin:0;
         padding:0;
      }
      #navMenu li {
         margin:0;
         padding:0;
         list-style-type:none;
      }

      /* Content Node Details Properties - Parameter's grid name column. */
      .x-grid3-td-prop-param-name {
         font: 11px Verdana, Helvetica, sans-serif !important;
      }

      /* Content Node Details Properties - Parameter's grid values column. */
      .x-grid3-td-prop-param-values {
         font: 11px Verdana, Helvetica, sans-serif !important;
      }

   </style>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfExtUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/FrameSetUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ReportProfileRowEditor.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/FolderContentsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/EmailViewerUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageOrganizationsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageDestinationsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageReportsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageCapabilitiesUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/picker/AdfFolderPickerTree.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/picker/AdfFolderPickerDialog.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageFoldersUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageFragmentsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageCustomPromptsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManagePermissionsDialog.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageUsersUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageUserContentUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageProcessorChainsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageAnnouncementsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageSystemJobsUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageIncidentReportsUi.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/reportViewer/LaunchReportViewer.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/filter/rerFilter.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/BrowseRersUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/filter/scheduleFilter.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ScheduleContentUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ScheduleWizard.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/AdminScreenUi.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/UserPreferencesUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/RenameReportDialog.js"></script>

   <script type="text/javascript" xml:space="preserve">
      <%= ReportExecutionStatusEnum.getJsReportStatusEnums() %>

      <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
         Adf.frameSetUi.setAdminFlag(true);
         Adf.folderContentsUi.setAdminFlag(true);
      </logic:present>

      <rcl:checkCapability hasAll="REPORT_WIZARD">
            Adf.folderContentsUi.setReportWizardFlag(true);
      </rcl:checkCapability>

      var extOpts = {
         single: true
      };

      Ext.BLANK_IMAGE_URL = '<%=request.getContextPath()%>/scripts/lib/ext/resources/images/default/s.gif';

      Ext.EventManager.onDocumentReady(Adf.manageCapabilitiesUi.init, Adf.manageCapabilitiesUi, true);
      Ext.EventManager.onDocumentReady(Adf.frameSetUi.init, Adf.frameSetUi, extOpts);
      Ext.EventManager.onDocumentReady(Adf.folderContentsUi.init, Adf.folderContentsUi, true);
//      Ext.EventManager.onDocumentReady(Adf.editReportProfileUi.init, Adf.editReportProfileUi, true);
      Ext.EventManager.onDocumentReady(Adf.browseRersUi.init, Adf.browseRersUi, true);
      Ext.EventManager.onDocumentReady(Adf.scheduleContentsUi.init, Adf.scheduleContentsUi, true);
      Ext.EventManager.onDocumentReady(Adf.manageUsersUi.init, Adf.manageUsersUi, true);
      Ext.EventManager.onDocumentReady(Adf.manageUserContentUi.init, Adf.manageUserContentUi, true);
      Ext.EventManager.onDocumentReady(Adf.manageCustomPromptsUi.init, Adf.manageCustomPromptsUi, true);
      Ext.EventManager.onDocumentReady(Adf.ManageAnnouncementsUi.init, Adf.ManageAnnouncementsUi, true);
      Ext.EventManager.onDocumentReady(Adf.manageIncidentsUi.init, Adf.manageIncidentsUi, true);

         var canDeletePublicItems=false;
         <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
            canDeletePublicItems=true;
         </logic:present>
       Adf.folderContentsUi.setCanDeletePublicItems(canDeletePublicItems);
   </script>

   <%-- Flexpoint for Customer Projects to Inject their own stuff here --%>
   <%@ include file="/WEB-INF/pages/common/customer-includes/frameSet-fragment.jsp" %>
</head>

<body>
</body>
</html>