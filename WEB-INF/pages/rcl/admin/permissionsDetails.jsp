<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
   <head>
      <%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>

      <title>TITLE</title>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManagePermissions.js"></script>

      <script type="text/javascript">

         var dialogUiController = new ManagePermissionsUiController(document, ${form.inheritPermissions},
                                                    ${form.canInheritPermissions},
                                                    JsUtil.escapeApostrophe("${form.namespace}"));

         populateAvailabeRoles = function()
         {
            var allRoles = new Object();
            var permittedRoles = new Object();

            var role;
<c:forEach items="${form.availableRoles}" var="eachRole">
            role = new Object();
            role.label = "${eachRole.label}";
            role.value = "${eachRole.value}";
            allRoles[role.label] = role;
</c:forEach>
<c:forEach items="${form.permittedRoles}" var="permitRole">
            role = new Object();
            role.label = "${permitRole.label}";
            role.value = "${permitRole.value}";
            permittedRoles[role.label] = role;
            <%--permittedRoles["${permitRole}"] = allRoles["${permitRole}"];--%>
</c:forEach>

            dialogUiController.populateAvailabeRoles(allRoles, permittedRoles);
         }

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
         {
            populateAvailabeRoles();
         });

      </script>

   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">
      <html:form action="/secure/actions/admin/managePermissions">
         <html:hidden property="namespace"/>
         <table>
<c:if test="${form.canInheritPermissions}">
            <tr>
               <td class="label" style="text-align:left;">
                  <html:checkbox property="inheritPermissions" onclick="dialogUiController.checkInherit();" styleId="inheritCheckbox"/>
                  <span class="labelText"><fmt:message key="admin.managePermissions.inheritPermissions"/></span>
               </td>
            </tr>
</c:if>
            <tr>
               <td colspan="2">
                  <table>
                     <tr>
                        <td width="180">
                              <fmt:message key="admin.managePermissions.availableRoles"/>
                              (<span id="numberSpan"><c:out value="${form.firstRoleCount}"/> - <c:out value="${form.lastRoleCount}"/></span>)
                        </td>
                        <td width="80">
                              <c:set var="contextPath" value="<%=request.getContextPath()%>"/>
                              <html:img bundle="rcl" styleClass="nextPrevButtons" styleId="firstPageButton" src="${contextPath}/images/firstPage.gif"
                                      altKey="reportOutputs.firstPageButton.alt" titleKey="reportOutputs.firstPageButton.title" onclick="javascript:dialogUiController.firstPage();"/>

                              <html:img bundle="rcl" styleClass="nextPrevButtons" styleId="prevPageButton" src="${contextPath}/images/previousPage.gif"
                                 altKey="reportOutputs.previousPageButton.alt" titleKey="reportOutputs.previousPageButton.title" onclick="javascript:dialogUiController.previousPage();"/>

                              <html:img bundle="rcl" styleClass="nextPrevButtons" styleId="nextPageButton" src="${contextPath}/images/nextPage.gif"
                                 altKey="reportOutputs.nextPageButton.alt" titleKey="reportOutputs.nextPageButton.title" onclick="javascript:dialogUiController.nextPage();"/>

                              <html:img bundle="rcl" styleClass="nextPrevButtons" styleId="lastPageButton" src="${contextPath}/images/lastPage.gif"
                                 altKey="reportOutputs.lastPageButton.alt" titleKey="reportOutputs.lastPageButton.title" onclick="javascript:dialogUiController.lastPage();"/>
                           </td>
                        <td/>
                        <td>
                           <fmt:message key="admin.managePermissions.selectedRoles"/><br/>
                        </td>
                     </tr>
                     <tr>
                        <td colspan="2">
                           <select style="width:260px" multiple="true" size="10" id="availableRolesSelect"/>
                        </td>
                        <td>
                           <input type="button" value=">>" onclick="dialogUiController.addPermittedRole();"/><br/>
                           <input type="button" value="<<" onclick="dialogUiController.removePermittedRole();"/>
                        </td>
                        <td valign="top">
                           <select style="width:260px" multiple="true" size="10" id="permittedRolesSelect"/>
                        </td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>

      <div id="bottomPane">
         <div id="bottomButtons">
            <html:button property="" styleClass="dialogButton" onclick="dialogUiController.onOkButtonPress();">
               <fmt:message key="admin.button.ok"/>
            </html:button>
            <html:button property="" styleClass="dialogButton" onclick="dialogUiController.onCancelButtonPress();">
               <fmt:message key="admin.button.cancel"/>
            </html:button>
         </div>
      </div>
      </html:form>
   </body>
</html>

