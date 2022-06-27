<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>TITLE</title>

      <%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageAnnouncementsUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageAnnouncementDetailsUi.js"></script>

      <%-- Calendar Includes... --%>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>

      <script type="text/javascript">
         <%-- this getter defines and populates a JS array of Report Summary called jsReportSummaries --%>
         <c:if test="${form.operation == 'edit'}">
            <c:out value="${form.jsAnnouncements}" escapeXml="false" />
         </c:if>

         var uiController = new ManageAnnouncementDetailsUiController(document);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
         {
            setup();
         });

         setup = function()
         {
            Calendar.setup(
               {
                  inputField : "exirationDateText", // ID of the input field
                  ifFormat : "%Y-%m-%d", // the date format
                  button : "exirationDateButton" // ID of the button
               }
            );

            var allOrganizationList = new Object();
            var organizationList = new Object();
            var organization = new Object();

         <c:forEach items="${form.allOrganizationList}" var="eachOrganization">
            organization = new Object();
            organization.label = "${eachOrganization.id}";
            organization.value = "${eachOrganization.name}";
            allOrganizationList[organization.label] = organization;
         </c:forEach>

         <c:forEach items="${form.organizationList}" var="eachOrganization">
            organization = new Object();
            organization.label = "${eachOrganization.id}";
            organization.value = "${eachOrganization.name}";
            organizationList[organization.label] = organization;
         </c:forEach>

            uiController.initUi(organizationList, allOrganizationList);
         }
      </script>

      <style type="text/css">
         @import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";

         td.label {
            text-align: right;
            font-weight: bold;
            padding-right: 2px;
            width:75px;
         }
      </style>
   </head>

   <body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:xhtml/>

      <html:form action="/secure/actions/admin/saveAnnouncement">
         <html:hidden property="announcementId"/>
         <div id="bodyDiv">
            <div id="contentShell">
               <div>
                  <div class="pageBanner">
                  <c:out value="${form.pageTitle}"/>
                  </div>
                  <c:if test="${form.operation == 'edit'}">
                   <div class="pageTraverseButtons">
                      <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.announcements.nav.title" altKey="admin.announcements.nav.title"
                                   onclick="getAdjacentObject(-1, announcements, document.forms[0].announcementId.value, '/secure/actions/admin/saveAnnouncement.do?destinationId=');">
                         <fmt:message key="admin.destinations.button.nav.next"/>
                      </html:button>
                      <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.announcements.nav.title" altKey="admin.announcements.nav.title"
                                   onclick="getAdjacentObject(1, announcements, document.forms[0].announcementId.value, '/secure/actions/admin/saveAnnouncement.do?destinationId=');">
                         <fmt:message key="admin.destinations.button.nav.previous"/>
                      </html:button>
                   </div>
                  </c:if>
               </div>
               <div class="pageBody">
                  <table>
                     <tr>
                        <td class="label">
                           <span class="labelText"><fmt:message key="admin.announcement.subject"/></span>
                        </td>
                        <td colspan="3">
                           <html:text property="subject" size="90"/>
                        </td>
                     </tr>

                     <tr>
                        <td class="label">
                           <span class="labelText"><fmt:message key="admin.announcement.message"/></span>
                        </td>
                        <td colspan="3">
                           <html:textarea property="textMessage" cols="88" rows="10"/>
                        </td>
                     </tr>

                     <tr>
                        <td class="label">
                           <span class="labelText"><fmt:message key="admin.announcement.active"/></span>
                        </td>
                        <td colspan="3">
                           <html:checkbox property="active"/>
                        </td>
                     </tr>

                     <tr>
                        <td class="label">
                           <span class="labelText"><fmt:message key="admin.announcement.expiration"/></span>
                        </td>
                        <td colspan="3">
                           <html:text property="expirationDate" styleId="exirationDateText"size="15"/>
                           <input type="button" value="..." id="exirationDateButton">
                        </td>
                     </tr>

                     <c:if test="${form.allOrganizationList != null}">
                     <tr>
                        <td class="label">
                           <span class="labelText"><fmt:message key="admin.announcement.distribution"/></span>
                        </td>
                        <td>
                           <fmt:message key="admin.announcement.availableOrganizations"/><br/>
                           <select style="width:250px" multiple="true" size="10" id="allOrganizationSelect">
                           </select>
                        </td>
                        <td>
                           <input type="button" value=">>" onclick="uiController.addOrganization();"/><br/>
                           <input type="button" value="<<" onclick="uiController.removeOrganization();"/>
                        </td>
                        <td>
                           <fmt:message key="admin.announcement.selectedOrganizations"/><br/>
                           <html:select property="organizationListArray" style="width:250px" multiple="true" size="10" styleId="origanizationSelect">
                           </html:select>
                        </td>

                     </tr>
                     </c:if>

                  </table>

                  <table>
                     <tr>
                        <td colspan="2">
                           <html:submit property="viewGesture" onclick="uiController.willSubmit();" bundle="rcl" titleKey="admin.button.ok" altKey="admin.button.ok">
                              <fmt:message key="admin.button.ok"/>
                           </html:submit>

                           <html:submit property="viewGesture" bundle="rcl" titleKey="admin.button.cancel" altKey="admin.button.cancel">
                              <fmt:message key="admin.button.cancel"/>
                           </html:submit>
                        </td>
                     </tr>
                  </table>
               </div>
            </div>
         </div>
     </html:form>
   </body>
</html>