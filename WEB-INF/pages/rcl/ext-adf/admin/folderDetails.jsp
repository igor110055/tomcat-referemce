<%@ page import="com.focus.rcl.RclEnvironment" %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


   <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/admin/ManageFoldersUi.js"></script>

  <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp"%>

   <script type="text/javascript" xml:space="preserve">
      Ext.EventManager.onDocumentReady(rcl.manageFoldersUi.init, rcl.manageFoldersUi, true);
   </script>


   <!-- property panel styles... -->
   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
      @import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";
      @import "<%=request.getContextPath() %>/styles/rcl/ext-adf/ext-adf.css";
      @import "<%=request.getContextPath()%>/styles/rcl/ext-adf/MultiSelect.css";
      @import "<%=request.getContextPath()%>/styles/rcl/ext-adf/examples.css";

      @import "<%=request.getContextPath() %>/styles/rcl/reportDetails.css";
      @import "<%=request.getContextPath()%>/styles/rcl/reportProfileDetails.css";

      /* x-grid-row-selected td{
            background: #DFE8F6 !important;
            color: white;
         }*/

      .x-grid-row-selected td, .x-grid-locked .x-grid-row-selected td{
         background-color: lightsteelblue !important;
         /*color: darkgray;*/
      }

            .x-grid-cell-selected{
         background-color: lightsteelblue !important;
         /*color: darkgray;*/
      }

            .x-props-grid .x-grid-cell-selected .x-grid-cell-text{
          background-color: lightsteelblue !important;
      }
   </style></head>

<body>
</body>

</html>
