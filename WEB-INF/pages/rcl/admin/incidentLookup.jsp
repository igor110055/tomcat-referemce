<%--
  Created by IntelliJ IDEA.
  User: jerry
  Date: Jul 11, 2008
  Time: 10:09:57 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
   <head>
      <title>Incident Lookup</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <script type="text/javascript">
         function displayIncident()
         {
            var incidentIframe = document.getElementById("incidentIframe");
            var incidentId = document.getElementById("incidentId").value;

            incidentIframe.src = ServerEnvironment.baseUrl + "/secure/actions/admin/viewIncident.do?incidentId=" + incidentId;
         }
      </script>
   </head>

   <body>
         <span class="labelText">Incident Lookup</span><br/>
         <table>
            <tr>
               <td class="label"><span class="labelText">Incident Id:</span></td>
               <td><input type="text" id="incidentId" size="5"/></td>
               <td>
                  <button style="margin:0px 10px 0px 20px;"
                               property="submiteButton"
                               altKey="incident.displayException.button.download.alt"
                               titleKey="incident.displayException.button.download.title"
                               onclick="displayIncident();"
                               bundle="rcl">
                     Lookup
                  </button>
               </td>
            </tr>
         </table>
         <br/>
   <iframe id="incidentIframe" width="= 100%" height="90%"/>
   </body>
</html>