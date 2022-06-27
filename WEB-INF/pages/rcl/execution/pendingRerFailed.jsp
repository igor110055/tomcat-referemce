<%--
   Spinning cube screen...

   ---------------------------
   @author : Lance Hankins
   
   $Id: pendingRerFailed.jsp 6167 2008-11-18 07:19:46Z lhankins $

--%>


<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>


<html>
<head>
   <title><bean:message bundle="rcl" key="incident.pendingRerFailed.title"/></title>

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
                  <bean:message bundle="rcl" key="incident.pendingRerFailed.message"/>
                  <br/>

                  <br/>
                   <html:form action="/secure/actions/downloadRerIncident.do" method="post">
                      <html:button property="submitButton"
                                   onclick="document.forms[0].submit();"
                                   altKey="incident.displayException.button.download.alt"
                                   titleKey="incident.displayException.button.download.title"
                                    bundle="rcl">
                         <bean:message bundle="rcl" key="incident.displayException.button.download.value"/>
                         </html:button>
                      <input type="hidden" name="rerId" value="<c:out value="${rerId}"/>"/>

                   </html:form>
               </td>
            </tr>
         </table>
      </div>
      



</body>
</html>