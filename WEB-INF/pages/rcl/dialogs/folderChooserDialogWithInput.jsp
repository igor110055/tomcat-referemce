<%@ page import="com.focus.rcl.RclEnvironment" %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   File Chooser Dialog...

   ---------------------------
   @author : Lance Hankins

   $Id: folderChooserDialogWithInput.jsp 6595 2009-02-23 21:36:09Z dpaul $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <title>Folder Hierarchy Selection</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FolderHierarchy.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/FolderChooserDialogUi.js"></script>


   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";

      #topPane {
         width: 100%;
         display:block;
      }

      #bottomPane {
         width: 100%;
         display: block;
         clear:both;

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
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded(); window.dialogUiController = uiController; document.getElementById('saveToProfileName').focus();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <div id="topPane">
      <div id="navTree">
         <%-- tree inserted here --%>
      </div>
   </div>

   <div id="bottomPane">
      <div style="font-weight:bold;">
         Profile Name<span style="color:red;">*</span> : <input style=" width:300px;" type="text" name="profileName" id="saveToProfileName"/>
      </div>
      <div style="font-weight:bold; width:100%;" id="permissionDiv">

         <c:choose>
            <c:when test="${form.useOnlyPublicFolders}">
               <input type="hidden" id="savePublic" name="saveAsPublicOrPrivate" value="public"/>
            </c:when>
            <c:otherwise>
               <logic:notPresent role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
                  <input id="savePublic" type='radio' name='saveAsPublicOrPrivate' value='public' disabled="disabled"> Public
               </logic:notPresent>
               <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
                  <input id="savePublic" type='radio' name='saveAsPublicOrPrivate' value='public'> Public
               </logic:present>

               <input id="savePrivate" type='radio' name='saveAsPublicOrPrivate' value='private' checked="checked"> Private
            </c:otherwise>
         </c:choose>
      </div>
      <div id="bottomButtons">
         <input class="dialogButton" type="button" value="OK" onclick="uiController.onOkButtonPress();"/>
         <input class="dialogButton" type="button" value="Cancel" onclick="uiController.onCancelButtonPress();"/>
      </div>
   </div>


   <script type="text/javascript" xml:space="preserve">

      <c:out value="${form.jsFolderHierarchy}" escapeXml="false"/>

      var uiModel = new FolderChooserDialogUiModel(rootFolder, currentSelection);
      var uiController = new FolderChooserWithInputDialogUiController(document, uiModel, <c:out value="${form.multiSelect}"/>);

      //--- easier access for someone who wants to access us as an iframe...
      window.dialogUiController = uiController;

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
         uiController.initUi();
      });

      DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
         //--- clean up dialog reference...
         window.dialogUiController = null;
      });

      if (currentSelection.indexOf("My Folders") != -1)
      {
         document.getElementById("permissionDiv").style.display = "none";
      }

      document.getElementById("saveToProfileName").value = '<c:out value="${form.saveAsNewProfileName}" escapeXml="false"/>'

   </script>
</body>
</html>

