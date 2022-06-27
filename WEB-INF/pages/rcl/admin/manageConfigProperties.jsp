<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   This page displays the "manage config properties" screen

   ---------------------------
   @author : Jerry Wieck (gwieck@focus-technologies.com)
   $Id: manageConfigProperties.jsp 8830 2014-06-04 19:06:24Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
      <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>

      <title>Manage Configuration Properties</title>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/ManageConfigPropertiesUi.js"></script>

      <script type="text/javascript">
         // currently all externalized to ManageConfiguPropertiesUi.js
      </script>
   </head>

   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:form styleId="saveForm" action="/secure/actions/admin/saveConfigProperties" method="post">
         <h3>ADF System Configuration Properties</h3>


         <table border="0" cellpadding="4px" cellspacing='0' id="propertyTable">
            <thead style="background-color:navy;color:white;">
               <th width="50px" align="center">Delete</th>

               <th width="320px" align="left">&nbsp;Name</th>
               <th width="320px" align="left">&nbsp;Value</th>
               <th width="140px" align="left">&nbsp;Family</th>
               <th width="50px" align="center">Encrypt</th>
            </thead>
            <tbody>
               <c:forEach var="eachProperty" items="${form.propertyList}">
                  <tr>
                     <td>
                        <input type="checkbox" name="deleteCb" value="<c:out value="${eachProperty.id}"/>"/>
                     </td>
                                          <td>
                        <input type="hidden" name="propertyId" value="<c:out value="${eachProperty.id}"/>">
                        <input type="text" size="50" name="propertyName" value="<c:out value="${eachProperty.name}"/>">
                     </td>
                     <td>
                        <input type="text" size="50" name="propertyValue" value="<c:out value="${eachProperty.value}"/>">
                     </td>
                     <td>
                        <input type="text" size="20" name="propertyFamily" value="<c:out value="${eachProperty.family}"/>">
                     </td>
                     <td>
                        <input type="checkbox" name="propertyEncryptions" value="${eachProperty.id}" <c:if test="${eachProperty.encrypted == true}">checked="checked"</c:if> />
                     </td>
                     <!--<td>-->
                        <!--<input type="checkbox"-->
                     <!--</td>-->
                  </tr>
               </c:forEach>
            </tbody>
         </table>
         <br/>

         <a href="#" onclick="saveProperties();">Save Changes</a>
         <br/>
         <a href="#" onclick="addNewProperty();">Add New Property</a>
         <br/>
         <a href="#" onclick="deleteProperties();">Delete Selected Properties</a>
      </html:form>


      <%-- this form is only used when we're properties... --%>
      <html:form styleId="deleteForm" action="/secure/actions/admin/deleteConfigProperties" method="post">
      </html:form>
   </body>
</html>
