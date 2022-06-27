<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Edit the details about a destination

   ---------------------------
   @author : Jeremy Siler

   $Id: destinationDetails.jsp 7058 2009-12-02 17:58:09Z mmeza $

--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>TITLE</title>

      <%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>
      <%@ include file="/WEB-INF/pages/common/extIncludes.jsp" %>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageDestinationsUi.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageDestinationDetailsUi.js"></script>

      <script type="text/javascript">

         var uiController = new ManageDestinationDetailsUiController(document);

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


      <script type="text/javascript">
         <c:if test="${form.operation == 'edit'}">
            <c:out value="${form.destinations}" escapeXml="false" />
         </c:if>


     </script>
      <style type="text/css">
         td.label {
            text-align: right;
            font-weight: bold;
            padding-right: 2px;
            width:75px;
         }
         #bodyDiv {
            height: 761px;
         }
      </style>
   </head>

   <body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:xhtml/>

      <html:form action="/secure/actions/admin/saveDeliveryDestination" styleId="destinationForm">
         <html:hidden property="organizationId"/>
         <html:hidden property="destinationId" styleId="destinationId"/>
         <html:hidden property="operation"/>
         <html:hidden property="pageTitle"/>
      <div id="bodyDiv">
         <div id="contentShell">
         <div>
            <div class="pageBanner">
            <c:out value="${form.pageTitle}"/>
            </div>
            <c:if test="${form.operation == 'edit'}">
             <div class="pageTraverseButtons">
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.destinations.nav.title" altKey="admin.destinations.nav.title"
                             onclick="getAdjacentObject(-1, destinations, document.forms[0].destinationId.value, '/secure/actions/admin/saveDeliveryDestination.do?destinationId=');">
                   <fmt:message key="admin.destinations.button.nav.next"/>
                </html:button>
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.destinations.nav.title" altKey="admin.destinations.nav.title"
                             onclick="getAdjacentObject(1, destinations, document.forms[0].destinationId.value, '/secure/actions/admin/saveDeliveryDestination.do?destinationId=');">
                   <fmt:message key="admin.destinations.button.nav.previous"/>
                </html:button>
             </div>
            </c:if>
         </div>
         <div class="pageBody">
                     <table>
                        <tr>
                           <td class="label">
                              <span class="labelText"><fmt:message key="admin.destinations.type"/> </span>
                           </td>
                           <td>
                              <c:choose>
                                 <c:when test="${form.operation == 'edit'}">
                                    <html:text disabled="true" property="destinationType" size="50"/>
                                    <html:hidden property="destinationType"/>
                                    <html:hidden property="deliveryMethod"/>
                                 </c:when>
                                 <c:otherwise>
                                    <html:select property="deliveryMethod" size="5" onclick="uiController.displayByDeliveryMethod(document.forms[0].deliveryMethod.value);">
                                       <option selected="true" value="email"><fmt:message key="admin.destinations.email"/></option>
                                       <option value="ftp"><fmt:message key="admin.destinations.ftp"/></option>
                                       <option value="local"><fmt:message key="admin.destinations.local"/></option>
                                    </html:select>
                                    <html:hidden property="destinationType"/>
                                 </c:otherwise>
                              </c:choose>
                           </td>
                        </tr>

                        <tr>
                           <td class="label">
                              <span class="labelText"><fmt:message key="admin.destinations.name"/> </span>
                           </td>
                           <td>
                              <html:text property="destinationName" size="90"/>
                           </td>
                        </tr>

                        <tr>
                           <td class="label">
                              <span class="labelText"><fmt:message key="admin.destinations.description"/> </span>
                           </td>
                           <td>
                              <html:text property="destinationDescription" size="90"/>
                           </td>
                        </tr>
                     </table>

                     <table id="email">
                          <%@ include file="/WEB-INF/pages/rcl/admin/emailDestinationDetails.jsp"%>
                     </table>

                     <table style="display:none" id="ftp">
                          <%@ include file="/WEB-INF/pages/rcl/admin/ftpDestinationDetails.jsp"%>
                     </table>

                     <table style="display:none" id="local" >
                          <%@ include file="/WEB-INF/pages/rcl/admin/localFileSystemDestinationDetails.jsp"%>
                     </table>

                     <table>
                        <tr>
                           <td colspan="2">
                              <%@ include file="/WEB-INF/pages/rcl/admin/managePermissions.jsp"%>
                           </td>
                        </tr>
                     </table>
                     <table>
                        <tr>
                           <td colspan="2">
                              <html:hidden property="viewGesture"/>
                              <html:submit property="" onclick="uiController.setViewGesture('OK');uiController.willSubmit();permissionsUiController.selectAll();" bundle="rcl" titleKey="admin.button.ok" altKey="admin.button.ok">
                                 <fmt:message key="admin.button.ok"/>
                              </html:submit>

                              <html:submit property="" onclick="uiController.setViewGesture('Cancel')" bundle="rcl" titleKey="admin.button.cancel" altKey="admin.button.cancel">
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