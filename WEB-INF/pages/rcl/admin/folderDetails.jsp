<%--
  Created by IntelliJ IDEA.
  User: jSiler
  Date: Apr 26, 2006
  Time: 10:19:13 AM

  $Id: folderDetails.jsp 3606 2006-11-16 17:03:13Z crainey $
--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>
      <title>TITLE</title>

      <script type="text/javascript">
         <c:if test="${form.operation == 'edit'}">
            <c:out value="${form.jsFolderSummaries}" escapeXml="false" />
         </c:if>


         var currentSelection = '<c:out value="${form.parentFolderPath}"/>';

         // pick an RCL folder...
         function pickRclFolder()
         {
            var rclDialog = new RclDialog();

            var dialogListener = {
               thisDoc : document,
               dialogFinished : function (aPicker)
               {
                  if (aPicker.wasCancelled == false)
                  {
                     currentSelection = aPicker.selectedValues[0].id;
                     document.forms[0].parentFolderPath.value = currentSelection;

                     document.getElementById("displayFolderPath").value = convertToFriendlyPath(currentSelection);
                  }
               }
            };

            rclDialog.setDialogListener(dialogListener);

            rclDialog.showFolderChooserDialog(applicationResources.getProperty("admin.folders.selectFolder.title"),
                    "",
                    document.forms[0].parentFolderPath.value,
                    false, "folderChooser", "", "public");
         }

         //--- chop off leading portion of a path (since we don't generally  show that to a user)...
         function convertToFriendlyPath(aFolderPath)
         {
            //--- private folder, we'll chop off the leading : root/customers/focus/users/lhankins portion...
            if (aFolderPath.indexOf("<c:out value="${rclUser.user.rootPrivateContentFolderPath}"/>/") != -1)
            {
               return aFolderPath.split("<c:out value="${rclUser.user.rootPrivateContentFolderPath}"/>")[1];
            }
            //--- public folder, we'll chop off the leading : root/customers/focus/public/content portion...
            else
            {
               return aFolderPath.split("<c:out value="${rclUser.user.rootPublicContentFolderPath}"/>")[1];
            }
         }

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
         {
            document.getElementById("displayFolderPath").value = convertToFriendlyPath(currentSelection);
         });

      </script>
   </head>

   <body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:xhtml/>

      <nested:form action="/secure/actions/admin/saveFolder">
         <html:hidden property="folderId" styleId="folderId"/>
         <html:hidden property="operation"/>
         <html:hidden property="pageTitle"/>

         <div>
            <div class="pageBanner">
            <c:out value="${form.pageTitle}"/>
            </div>
            <c:if test="${form.operation == 'edit'}">
             <div class="pageTraverseButtons">
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.folders.button.nav.next.title" altKey="admin.folders.button.nav.next.alt"
                             onclick="checkNameAndGetAdjacentObject(document.forms[0].parentFolderPath.value, document.forms[0].folderName.value, -1, folderSummaries, document.forms[0].folderId.value, '/secure/actions/admin/saveFolder.do?folderId=');">
                   <fmt:message key="admin.folders.button.nav.next"/>
                </html:button>
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.folders.button.nav.previous.title" altKey="admin.folders.button.nav.previous.alt"
                             onclick="checkNameAndGetAdjacentObject(document.forms[0].parentFolderPath.value, document.forms[0].folderName.value, 1, folderSummaries, document.forms[0].folderId.value, '/secure/actions/admin/saveFolder.do?folderId=');">
                   <fmt:message key="admin.folders.button.nav.previous"/>
                </html:button>
             </div>
            </c:if>
         </div>
         <div class="pageBody">
            <table>
               <c:if test="${form.invalidMessage != null}">
               <tr>
                  <td colspan="2" style="font-weight:bold; color:red;">
                     <c:out value="${form.invalidMessage}"/>
                  </td>
               </tr>
               </c:if>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.folders.folderName"/> </span>
                  </td>
                  <td>
                     <html:text property="folderName" size="90"/>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.folders.rclParentFolder"/></span>
                  </td>
                  <td>
                     <html:hidden property="parentFolderPath"/>
                     <input type="text" name="displayFolderPath" id="displayFolderPath" style="width:405px; background-color:gainsboro;" readonly="true"/>
                     <html:button property="" onclick="pickRclFolder();"  altKey="admin.folders.button.browse.alt" titleKey="admin.folders.button.browse.title" bundle="rcl">
                        <fmt:message key="admin.folders.button.browse"/>
                     </html:button>
                  </td>
               </tr>
               <%@ include file="/WEB-INF/pages/rcl/admin/managePermissions.jsp"%>
               <tr>
                  <td colspan="2">
                     <html:hidden property="viewGesture"/>

                     <html:button property="" onclick="setViewGesture('OK'); checkNameAndSubmit(document.forms[0].parentFolderPath.value, document.forms[0].folderName.value, document.forms[0].folderId.value);"
                                  altKey="admin.button.ok.alt" titleKey="admin.button.ok.title" bundle="rcl">
                        <fmt:message key="admin.button.ok"/>
                     </html:button>

                     <html:submit property="" onclick="setViewGesture('Cancel');" altKey="admin.button.cancel.alt"
                                  titleKey="admin.button.cancel.title" bundle="rcl">
                        <fmt:message key="admin.button.cancel"/>
                     </html:submit>

                     <script type="text/javascript">
                        function setViewGesture(gesture)
                        {
                           document.forms[0].viewGesture.value = gesture;
                        }
                     </script>
                  </td>
               </tr>
            </table>
          </div>

      </nested:form>
   </body>
</html>
