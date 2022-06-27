<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Displays SQL

   ---------------------------
   @author : Lance Hankins
   
   $Id: reiDisplaySql.jsp 3701 2006-12-04 21:36:43Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <%@ include file="/WEB-INF/pages/rcl/rei/commonReiIncludes.jsp"%>
      <title><c:out value="${form.targetName}"/> - <fmt:message key="rei.getsql.generatedSql"/></title>
      <html:xhtml/>

      <style type="text/css" xml:space="preserve">
         table {
            border:1px solid black;
            margin: 0px 5px 0px 5px;
         }
         thead {
            background-color:#EEEEEE;
            border: 1px solid #333333;
            font-weight:bold;
         }
         td {
            vertical-align:top;
         }
         tbody {
            overflow:auto;
         }
      </style>
   </head>
   <body class="rclBody" style="overflow:auto;"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"
         style="margin:0px;">


      <div class="pageBanner">
         <fmt:message key="profileWizard.banner"/> - <fmt:message key="rei.getsql.generatedSql"/>
      </div>

      <html:form action="/secure/actions/editRei" method="post">

         <c:choose>
            <c:when test="${not empty form.generatedSql}">
               <div>
                  <table border="1px" >
                     <thead>
                        <tr>
                           <td>
                              <fmt:message key="rei.getsql.queryName"/>
                           </td>
                           <td>
                              <fmt:message key="rei.getsql.generatedSql"/>
                           </td>
                        </tr>
                     </thead>
                     <tbody>
                        <c:forEach items="${form.generatedSql}" var="eachQuery">
                        <tr>
                           <td>
                              <c:out value="${eachQuery[0]}"/>
                           </td>
                           <td>
                              <c:out value="${eachQuery[1]}"/>
                           </td>
                        </tr>
                        </c:forEach>
                     </tbody>
                  </table>
               </div>
            </c:when>
            <c:otherwise>
               <div style="margin: 5px;">
                  <fmt:message key="rei.getsql.problem"/>
               </div>
            </c:otherwise>
         </c:choose>



      </html:form>
   </body>
</html>



