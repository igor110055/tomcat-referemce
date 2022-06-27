<%@ page import="com.focus.rcl.crn.CrnSettingsAndCredentials"%>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   view contents of crn proxy cache...

   ---------------------------
   @author : Lance Hankins

   $Id: viewCrnProxyCache.jsp 3435 2006-10-20 20:53:42Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Crn Proxy Cache</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <html:xhtml/>

      <style type="text/css" xml:space="preserve">

      </style>

   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:form action="/secure/actions/admin/viewCrnProxyCache" method="post">
         <h3>Crn Proxy Cache Contents</h3>
         <table border="1px" cellpadding="4px">
            <thead>
               <tr style="background-color:navy;color:white;">
                  <td>CRN Endpoint</td>
                  <td>Namespace</td>
                  <td>UserName</td>
                  <td>Credentials Classname</td>
                  <td>Address</td>
                  <td>ClassLoader Address</td>
                  <td>Actions</td>
               </tr>
            </thead>
            <tbody>
               <c:forEach var="eachProxy" items="${form.cachedItems}">
                  <tr>
                     <td><c:out value="${eachProxy.crnSettings.serverUrl}"/></td>
                     <td><c:out value="${eachProxy.crnCredentials.namespace}"/></td>
                     <td><c:out value="${eachProxy.crnCredentials.username}"/></td>
                     <td><%=((CrnSettingsAndCredentials)pageContext.getAttribute("eachProxy")).getCrnCredentials().getClass().getName()%></td>
                     <td><%=System.identityHashCode(pageContext.getAttribute("eachProxy"))%></td>
                     <td><%=System.identityHashCode(pageContext.getAttribute("eachProxy").getClass().getClassLoader())%></td>
                     <td><a href="<%=request.getContextPath()%>/secure/actions/admin/flushCrnProxy.do?endpoint=<c:out value="${eachProxy.crnSettings.serverUrl}"/>&namespace=<c:out value="${eachProxy.crnCredentials.namespace}"/>&username=<c:out value="${eachProxy.crnCredentials.username}"/>">flush</a></td>
                  </tr>
               </c:forEach>
            </tbody>
         </table>

         <br/>
         <a href="<%=request.getContextPath()%>/secure/actions/admin/flushCrnProxyCache.do">Flush All</a>

      </html:form>
   </body>
</html>
