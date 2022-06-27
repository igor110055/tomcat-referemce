<%--
   Pending RER cancelled

   ---------------------------
   @author : Lance Hankins
   
   $Id: pendingRerCancelled.jsp 5143 2008-04-08 22:25:15Z lhankins $

--%>


<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>


<html>
<head>
   <title><bean:message bundle="rcl" key="reportViewer.pendingRerCancelled.title"/></title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   

</head>

<body class="rclBody">


      <div style="margin:23px">
         <table>
            <tr>
               <td>

               </td>
               <td width="22px">&nbsp;<td>
               <td>
                  <bean:message bundle="rcl" key="reportViewer.pendingRerCancelled.message"/>
               </td>
            </tr>
         </table>
      </div>
      



</body>
</html>