<%--
   Spinning cube screen...

   ---------------------------
   @author : Lance Hankins

   $Id: waitOnPendingRer.jsp 7746 2012-04-18 22:49:18Z lhankins $

--%>


<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>


<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title><fmt:message key="reportViewer.executing"/></title>


   <script type="text/javascript">
      function init() {
         var recheckFrequency = parseInt(document.forms[0].recheckFrequency.value);

         if (!recheckFrequency || recheckFrequency == 0) {
            recheckFrequency = 3000;
         }
         setTimeout("doSubmit()", recheckFrequency);
      }

      function doSubmit()
      {
         var newLocation = "<%= request.getContextPath() %>/secure/actions/waitOnPendingRer.do?rerId=" +
                           document.forms[0].rerId.value +
               "&redirect=" + document.forms[0].redirect.value +
               "&actionWhenDone=" + document.forms[0].actionWhenDone.value;
         window.location = newLocation;
      }

      function cancelPendingRer (aRerId)
      {
         parent.uiController.pendingRerWasCancelled(aRerId, document.forms[0].tabId.value);
         var newLocation = "<%= request.getContextPath() %>/secure/actions/cancelPendingRer.do?rerId=" +
                           document.forms[0].rerId.value;
         window.location = newLocation;
      }
   </script>

</head>

<body class="rclBody" onload="init();">

   <html:form action="/secure/actions/waitOnPendingRer.do" method="GET">
      <div style="margin:23px">
         <table>
            <tr>
               <td>
                  <img src="<%= request.getContextPath() %>/images/spinningCube.gif" alt="please wait">
               </td>
               <td width="22px">&nbsp;<td>
               <td>
                  <fmt:message key="reportViewer.executing"/>
                  <br/>
                  <br/>
                  <fmt:message key="reportViewer.pleaseWait"/>
                  <br/>
                  <br/>
                  <a href="javascript:cancelPendingRer(<c:out value="${form.rerId}"/>);"> <fmt:message key="reportViewer.cancelPendingRer"/></a>
               </td>
            </tr>
         </table>
      </div>

      <html:hidden property="rerId"/>
      <html:hidden property="redirect"/>
      <html:hidden property="tabId"/>
      <html:hidden property="actionWhenDone"/>
      <html:hidden property="recheckFrequency"/>
   </html:form>
</body>
</html>