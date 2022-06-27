

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/NameChecker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ReportValidator.js"></script>
<script type="text/javascript">
  function getAdjacentObject(anIndexModifier, anArray, aCurrentId, anActionPath)
   {
      var adjacentId;

      for (var i = 0; i < anArray.length; i++)
      {
         if (anArray[i].id == aCurrentId)
         {
            if (i == anArray.length - 1 && anIndexModifier == 1)
            {
              adjacentId = anArray[0].id;
            }
            else if (i == 0 && anIndexModifier == -1)
            {
              adjacentId = anArray[anArray.length - 1].id;
            }
            else
            {
              adjacentId = anArray[i + anIndexModifier].id;
            }
         }
      }

      document.forms[0].action = ServerEnvironment.baseUrl + anActionPath + aCurrentId + "&adjacentId=" + adjacentId + "&viewGesture=traverseButton";
      document.forms[0].submit();
   }

   function checkNameAndGetAdjacentObject( folderId, newNodeName, anIndexModifier, anArray, aCurrentId, anActionPath )
   {
      var nameChecker = new NameChecker();
      var actionPath = ServerEnvironment.baseUrl + '/secure/actions/admin/checkNameExists.do';
      var nameExists = nameChecker.checkNameExists( actionPath, "folderId=" + folderId + "&newNodeName=" + newNodeName + "&nodeId=" + aCurrentId );

      if( !nameExists )
      {
         getAdjacentObject( anIndexModifier, anArray, aCurrentId, anActionPath );
      }
      else
      {
        DialogUtil.rclAlert( nameChecker.getErrMsg(), applicationResources.getProperty("management.duplicateName") );
      }
   }

   function checkNameAndSubmit( folderId, newNodeName, currentId )
   {
      var nameChecker = new NameChecker();
      var actionPath = ServerEnvironment.baseUrl + '/secure/actions/admin/checkNameExists.do';
      var nameExists = nameChecker.checkNameExists( actionPath, "folderId=" + folderId + "&newNodeName=" + newNodeName + "&nodeId=" + currentId );

      if( nameExists )
      {
         DialogUtil.rclAlert( nameChecker.getErrMsg(), applicationResources.getProperty("management.validation.defaultError") );
      }
      else
      {
//         permissionsUiController.selectAll();
         document.forms[0].submit();
      }
   }

   function checkMaxExecutionTime(maxExecutionTime)
   {
      for (var i = 0; i != maxExecutionTime.length; i++)
      {
         var aChar = maxExecutionTime.charAt(i);
         if (aChar < "0" || aChar > "9")
         {
            return false
         }
      }
      return true;
   }

  /**
   *  Validates the Name and report submitted
   *  Also, validates the maxExecutionTime input to ensure it is an acceptible input
   * @param folderId
   * @param newNodeName
   * @param currentId
   * @param reportXPath
   * @param maxExecutionTime
   */
  function checkNameAndSubmitReport( folderId, newNodeName, currentId, reportXPath, maxExecutionTime )
  {
     var aNameChecker = new NameChecker();
     var actionPath = ServerEnvironment.baseUrl + '/secure/actions/admin/checkNameExists.do';
     var nameExists = aNameChecker.checkNameExists( actionPath, "folderId=" + folderId + "&newNodeName=" + newNodeName + "&nodeId=" + currentId );

     if( nameExists )
     {
        DialogUtil.rclAlert( aNameChecker.getErrMsg(), applicationResources.getProperty("admin.manage.objectNameAlreadyExists") );
     }
     else if( checkReportValidity( folderId, newNodeName, currentId, reportXPath) )
     {
//        permissionsUiController.selectAll();
//        will check that the maxExecution time is a correct integer or null was entered
        if(maxExecutionTime != "null" && !checkMaxExecutionTime(maxExecutionTime))
        {
            DialogUtil.rclAlert("Please enter a correct formated number for Max Execution Time"
                                 +"\nIf you want to have no Max Execution Time enter 0")
        }
        else
        {
            document.forms[0].submit();
        }
     }
  }

   function checkReportValidity( folderId, newNodeName, currentId, reportXPath )
   {
      var myReportValidator = new ReportValidator();
      var actionPath = ServerEnvironment.baseUrl + '/secure/actions/admin/validateReport.do';

      var reportValid = myReportValidator.isReportValid( actionPath, folderId, newNodeName, currentId, reportXPath );

      if( !reportValid )
      {
         DialogUtil.rclAlert( myReportValidator.getErrMsg(), applicationResources.getProperty("management.validation.defaultError") );
      }

      return reportValid;
   }

</script>

<%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageReportsUi.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageFoldersUi.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageCustomPromptsUi.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageFragmentsUi.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageCapabilitiesUi.js"></script>

<%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp" %>
<%@ include file="/scripts/rcl/dialogs/RclDialogIncludes.jsp" %>

<style type="text/css">
   @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
   @import "<%= request.getContextPath() %>/styles/rcl/adminDetailPages.css";
   
</style>

<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>
