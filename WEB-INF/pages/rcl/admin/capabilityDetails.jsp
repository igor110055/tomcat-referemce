<%--
  Created by IntelliJ IDEA.
  User: jSiler
  Date: Apr 26, 2006
  Time: 10:19:13 AM

  $Id: capabilityDetails.jsp 4674 2007-09-26 15:56:17Z rmoore $
--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>
      <title>TITLE</title>

      <script type="text/javascript">
         <%--<c:if test="${form.operation == 'edit'}">
            <c:out value="${form.jsCapabilitySummaries}" escapeXml="false" />
         </c:if>--%>


         var currentSelection = '<c:out value="${form.parentCapabilityPath}"/>';



         //--- chop off leading portion of a path (since we don't generally  show that to a user)...
         function convertToFriendlyPath(aCapabilityPath)
         {
            return aCapabilityPath; //for capabilities we are currently displaying the entire path; i just copied this from folders where we do chop off part of the path; we might decide to that here
         }

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
         {
            //document.getElementById("displayCapabilityPath").value = convertToFriendlyPath(currentSelection);
         });

      </script>
   </head>

   <body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:xhtml/>

      <nested:form action="/secure/actions/admin/saveCapability">
         <html:hidden property="capabilityId" styleId="capabilityId"/>
         <html:hidden property="operation"    styleId="operation" />
         <html:hidden property="pageTitle"    styleId="pageTitle"/>

         <div>
            <div class="pageBanner">
            <c:out value="${form.pageTitle}"/>
            </div>
            <%--<c:if test="${form.operation == 'edit'}">
             <div class="pageTraverseButtons">
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.capabilities.button.nav.next.title" altKey="admin.capabilities.button.nav.next.alt"
                             onclick="checkNameAndGetAdjacentObject(document.forms[0].parentCapabilityPath.value, document.forms[0].capabilityName.value, -1, capabilitySummaries, document.forms[0].capabilityId.value, '/secure/actions/admin/saveCapability.do?capabilityId=');">
                   <fmt:message key="admin.capabilities.button.nav.next"/>
                </html:button>
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.capabilities.button.nav.previous.title" altKey="admin.capabilities.button.nav.previous.alt"
                             onclick="checkNameAndGetAdjacentObject(document.forms[0].parentCapabilityPath.value, document.forms[0].capabilityName.value, 1, capabilitySummaries, document.forms[0].capabilityId.value, '/secure/actions/admin/saveCapability.do?capabilityId=');">
                   <fmt:message key="admin.capabilities.button.nav.previous"/>
                </html:button>
             </div>
            </c:if>--%>
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
                     <span class="labelText"><fmt:message key="admin.capabilities.capabilityName"/> </span>
                  </td>
                  <td>
                     <html:text property="capabilityName" size="90"/>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.capabilities.rclParentCapability"/></span>
                  </td>
                  <td>
                     <html:text property="parentCapabilityPath" styleId="parentCapabilityPath" style="width:405px;"/>
                     <%--<html:hidden property="parentCapabilityPath"/>
                     <input type="text" name="displayCapabilityPath" id="displayCapabilityPath" style="width:405px; background-color:gainsboro;" readonly="true"/>
                     <html:button property="" onclick="pickRclCapability();"  altKey="admin.capabilities.button.browse.alt" titleKey="admin.capabilities.button.browse.title" bundle="rcl">
                        <fmt:message key="admin.capabilities.button.browse"/>
                     </html:button>--%>
                  </td>
               </tr>
               <%@ include file="/WEB-INF/pages/rcl/admin/managePermissions.jsp"%>
               <tr>
                  <td colspan="2">
                     <html:hidden property="viewGesture"/>

                     <html:button property="" onclick="setViewGesture('OK'); checkNameAndSubmit(document.forms[0].parentCapabilityPath.value, document.forms[0].capabilityName.value, document.forms[0].capabilityId.value);"
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
