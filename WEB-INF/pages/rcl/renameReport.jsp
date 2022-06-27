<%@ page import="com.focus.rcl.RclEnvironment" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   @author : Jeremy Siler

   $Id: renameReport.jsp 7664 2011-09-27 15:16:03Z lhankins $

--%>


<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>

<html>
<head>

   <%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   
   <%@ include file="/scripts/rcl/dialogs/RclDialogIncludes.jsp"%>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/TabSet.js"></script>

   <link rel="StyleSheet" href="<%=request.getContextPath()%>/styles/rcl/tabSet.css" type="text/css"/>

   <style type="text/css">
      div.pageBanner {
      background-color: #4A7DAD;

      border: 1px solid #333333;

      padding: 5px;
      width: 100%;
      height: 35px;
      margin-bottom: 0px;

      font-family: Arial, Helvetica, sans-serif;
      font-size: 16pt;
      font-weight: bold;
      color: white;
      }

      div.pageBody {
      border: 1px solid #333333;

      padding: 5px;
      width: 100%;
      margin-bottom: 10px;

      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      }

      .testButton {
      width: 100%;
      text-align: center;
      clear: both;
      display: block;
      left: 0px;
      }

      .bottomButtons {
      width: 100%;
      text-align: center;
      clear: both;
      display: block;
      left: 0px;
      }

      .bottomButtons input {
         width: 100px;
      }
   </style>

   <title>
      <fmt:message key="renameReport.title"/>
   </title>
</head>

<body class="rclBody" onload="checkPath(); convertPath(); disableUserList();">

<html:form action="/secure/actions/executeRename.do">
   <script type="text/javascript">
      var currentSelection = '<c:out value="${form.currentFolderPath}"/>';
      var userSelectPermission;

      <logic:notPresent role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
        userSelectPermission = "false";
      </logic:notPresent>
      <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
        userSelectPermission = "true";
      </logic:present>

      function pickRclPath()
      {
         var rclDialog = new RclDialog();

         var dialogListener = {
            thisDoc : document,
            dialogFinished : function (aPicker) {
               if (aPicker.wasCancelled == false)
               {
                  currentSelection = aPicker.selectedValues[0].id;
                  document.forms[0].currentFolderPath.value = currentSelection;

                  if (document.forms[0].currentFolderPath.value.indexOf("My Folders") != -1)
                  {
                     document.getElementById("permissionRow").style.display = "none";
                     document.getElementById("permissionDescRow").style.display = "none";
                     document.getElementById("userRow").style.display = "none";
                  }
                  else
                  {
                     document.getElementById("permissionRow").style.display = "";
                     document.getElementById("permissionDescRow").style.display = "";
                     document.getElementById("userRow").style.display = "";
                  }

                  if (document.forms[0].currentFolderPath.value.indexOf("<c:out value="${rclUser.user.rootPrivateContentFolderPath}"/>/") != -1)
                  {
                     var array = document.forms[0].currentFolderPath.value.split("<c:out value="${rclUser.user.rootPrivateContentFolderPath}"/>/");
                     document.getElementById("displayFolderPath").value = array[1];
                  }
                  else
                  {
                     var array = document.forms[0].currentFolderPath.value.split("<c:out value="${rclUser.user.rootPublicContentFolderPath}"/>");
                     document.getElementById("displayFolderPath").value = array[1];
                  }
               }
            }
         };

         rclDialog.setDialogListener (dialogListener);

         rclDialog.showFolderChooserDialog(applicationResources.getProperty("renameReport.selectFolder"),
                                           "",
                                           document.forms[0].currentFolderPath.value,
                                           false, "folderChooser");


     }

     function checkPath()
     {
         if (document.forms[0].currentFolderPath.value.indexOf("My Folders") != -1)
         {
            document.getElementById("permissionRow").style.display = "none";
            document.getElementById("permissionDescRow").style.display = "none";
            document.getElementById("userRow").style.display = "none";
         }

         if (userSelectPermission != "true")
         {
            document.getElementById("userRow").style.display = "none";
         }
     }

     function convertPath()
     {
         if (document.forms[0].currentFolderPath.value.indexOf("<c:out value="${rclUser.user.rootPrivateContentFolderPath}"/>/") != -1)
         {
            var array = document.forms[0].currentFolderPath.value.split("<c:out value="${rclUser.user.rootPrivateContentFolderPath}"/>/");
            document.getElementById("displayFolderPath").value = array[1];
         }
         else if (document.forms[0].currentFolderPath.value.indexOf("<c:out value="${rclUser.user.rootPublicContentFolderPath}"/>/") != -1)
         {
            var array = document.forms[0].currentFolderPath.value.split("<c:out value="${rclUser.user.rootPublicContentFolderPath}"/>");
            document.getElementById("displayFolderPath").value = array[1];
         }
         else
         {
            var array = document.forms[0].currentFolderPath.value.split("root/system/templates/default/public/content");
            document.getElementById("displayFolderPath").value = array[1];
         }
     }

     function disableUserList()
     {
          if (document.getElementById("privatePermission").checked == true)
          {
             document.getElementById("userList").disabled = '';
          }
          else
          {
             document.getElementById("userList").disabled = 'disabled';
          }
     }

      function validateContentNodeName (aName)
      {
         if (!(aName) || aName.length == 0)
         {
             // TODO: this is not I18N'd, but I can live with that for now (this UI is going away, and we need to send this file as a patch to an existing customer).
             return {result:false, message: 'Name was empty or null'};
         }

         var disallowedChars = ['\\', '/', '!', '*', ';', '?', '"', '>', '<', '|'];

         for (var i = 0; i < disallowedChars.length; ++i)
         {
            if (aName.indexOf (disallowedChars[i]) != -1)
            {
              // TODO: this is not I18N'd, but I can live with that for now (this UI is going away, and we need to send this file as a patch to an existing customer).
               return {result:false, message: 'the name [' + aName + '] contains a disallowed character [' + disallowedChars[i] + ']'};
            }
         }

         return {result:true, message: ''};

      }

      function checkInputs()
      {
        var validNameResult = validateContentNodeName(document.getElementById("newName").value);
        if (validNameResult.result == false)
        {
           alert(validNameResult.message);
           return;
        }

        if (document.getElementById("privatePermission").checked == true && userSelectPermission == "true" && document.getElementById("userList").selectedIndex == -1)
        {
           alert(applicationResources.getProperty("renameReport.selectUser"))
        }
        else
        {
           document.forms[0].submit();
        }
      }

     function changeSubmitText()
     {
        if(document.getElementById("copyAction").checked)
        {
           document.getElementById("renameSubmitButton").value = applicationResources.getProperty("renameReport.button.copy");
        }
        else
        {
           document.getElementById("renameSubmitButton").value = applicationResources.getProperty("renameReport.button.rename");
        }
     }

   </script>

   <html:hidden property="nodeId"/>
   <html:hidden property="nodeType"/>

   <div class="pageBanner">
      <fmt:message key="renameReport.pageBanner"/>
   </div>

   <div class="pageBody">
      <br/>

      <c:if test="${form.validRenameMove == false}">
         <div style="color:red;">
            <%--todo i18n - issues with using fmt:param with fmt:message when the property contains an apostrophe--%>
            <%--<fmt:message key="renameReport.invalidNameOrNameAlreadyExists">--%>
               <%--<fmt:param value="${form.permission}"/>--%>
            <%--</fmt:message>--%>
            <bean:message bundle="rcl" key="renameReport.invalidNameOrNameAlreadyExists" arg0="${form.displayPermission}"/>

            <!--<script type="text/javascript">-->
               <%--applicationResources.getPropertyWithParameters("renameReport.invalidNameOrNameAlreadyExists", new Array('<%=request.getAttribute()%>'));--%>
            <!--</script>-->
         </div>
      </c:if>

      <table border="0">
         <tr>
            <td style="width:100px;"></td>
            <td style="width:15px;"></td>
            <td style="width:100px;"></td>
         </tr>
         <tr>
            <td style="width:100px;" class="labelText">
               <fmt:message key="renameReport.originalName"/>
            </td>
            <td colspan="2" style="font-weight:normal;">
               <c:out value="${form.reportName}"/>
            </td>
         </tr>

         <tr><td colspan="3"></td></tr>
         <tr><td colspan="3"></td></tr>

         <tr>
            <td style="width:100px;" class="labelText">
               <fmt:message key="renameReport.renameTo"/>
            </td>
            <td colspan="2">
               <html:text styleId="newName" property="reportName" style="width:400px;"/>
            </td>

         </tr>

         <tr><td colspan="3"></td></tr>

         <tr>
            <td style="width:100px; vertical-align:text-top;" class="labelText">
               <fmt:message key="renameReport.location"/>
            </td>
            <td colspan="2">
               <html:hidden property="currentFolderPath"/>
               <input type="text" name="displayFolderPath" id="displayFolderPath" style="width:405px; background-color:gainsboro;" readonly="true"/>
               <html:button property="" onclick="pickRclPath();" altKey="renameReport.button.browse.alt" titleKey="renameReport.button.browse.title" bundle="rcl">
                  <fmt:message key="renameReport.button.browse"/>
               </html:button>
            </td>
         </tr>

         <tr id="permissionRow">
            <td style="width:100px; vertical-align:text-top;" class="labelText">
            </td>
            <td colspan="2">
               <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
                  <html:radio property="permission" value="public" onclick="disableUserList();"/> <fmt:message key="renameReport.public"/>
               </logic:present>
               <html:radio styleId="privatePermission" property="permission" value="private" onclick="disableUserList();"/> <fmt:message key="renameReport.private"/>*
               <input type="text" style="display:none;" name="userSelectPermission" id="userSelectPermission"/>
            </td>
         </tr>

         <tr id="userRow">
            <td style="width:100px; vertical-align:text-top;" class="labelText">
            </td>
            <td style="vertical-align:text-top; text-align:right;" class="labelText">
               <fmt:message key="renameReport.forUser"/> &nbsp;&nbsp;
            </td>
            <td>
              <html:select multiple="true" styleId="userList" style="text-align:right; font-size:x-small;" property="selectedUser">
                 <html:optionsCollection  style="font-size:x-small;" property="allUsers"/>
               </html:select>
            </td>
         </tr>

         <tr>
            <td style="width:100px; vertical-align:text-top;" class="labelText">
            </td>
            <td colspan="2">
               <html:radio property="moveAction" value="move" onclick="changeSubmitText()" onchange="changeSubmitText()"/>  <fmt:message key="renameReport.radioInput.renameMove"/>
               <html:radio styleId="copyAction" property="moveAction" value="copy" onchange="changeSubmitText()" onclick="changeSubmitText()"/>  <fmt:message key="renameReport.radioInput.copy"/>
            </td>
         </tr>



         <tr id="permissionDescRow">
            <td style="width:100px; vertical-align:text-top;" class="labelText"/>
            <td colspan="2">
               <fmt:message key="renameReport.createPrivateCopy"/>
            </td>
         </tr>

         <tr><td colspan="3"></td></tr>

         <tr>
            <td colspan="3" class="bottomButtons">
               <html:button styleId="renameSubmitButton" property="" onclick="checkInputs();"
                            altKey="renameReport.button.rename.alt"
                            titleKey="renameReport.button.rename.title"
                            bundle="rcl">
                  <fmt:message key="renameReport.button.rename"/>
               </html:button>
               <html:button property="" onclick="window.close();"
                            altKey="renameReport.button.cancel.alt"
                            titleKey="renameReport.button.cancel.title"
                            bundle="rcl">
                  <fmt:message key="renameReport.button.cancel"/>
               </html:button>
            </td>
         </tr>
      </table>
   </div>
</html:form>
<script type="text/javascript">
   changeSubmitText();
</script>
</body>
</html>

