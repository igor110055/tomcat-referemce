<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   view active user sessions

   ---------------------------
   @author : Lance Hankins

   $Id: listUserSessions.jsp 4639 2007-09-11 16:41:47Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>User Sessions</title>

      <%-- auto refresh this page every 180 seconds (so admins can keep an eye on things without timeouts) --%>
      <meta http-equiv="refresh" content="180"/>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <html:xhtml/>

      <style type="text/css" xml:space="preserve">

      </style>

   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:form action="/secure/actions/admin/showActiveUserSessions" method="post">
         <h3>Active User Sessions</h3>
         <table border="1px" cellpadding="4px">
            <thead>
               <tr style="background-color:navy;color:white;">
                  <td>SessionID</td>
                  <td>User</td>
                  <td>Auth Time</td>
                  <td>Browser</td>
                  <td>IP Addr</td>
                  <td>Auth Server</td>
                  <td>Locale</td>
               </tr>
            </thead>
            <tbody>
               <c:forEach var="eachStat" items="${form.activeSessions}">
                  <tr>
                     <td><c:out value="${eachStat.sessionId}"/></td>
                     <td><c:out value="${eachStat.rclUserLogon}"/></td>
                     <td><c:out value="${eachStat.authenticationTime}"/></td>
                     <td><c:out value="${eachStat.browserType.name}"/></td>
                     <td><c:out value="${eachStat.clientIpAddress}"/></td>
                     <td><c:out value="${eachStat.server}"/></td>
                     <td><c:out value="${eachStat.locale}"/></td>
                  </tr>
               </c:forEach>
            </tbody>
         </table>


      </html:form>
   </body>
</html>
