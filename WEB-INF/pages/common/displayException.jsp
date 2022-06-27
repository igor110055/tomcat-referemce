 <%--
   Display Exception Page - allows download of incident report for authorized users

   ---------------------------
   @author : Lance Hankins

   $Id: displayException.jsp 6758 2009-04-03 20:00:06Z dpaul $

--%>

<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title><bean:message key="incident.displayException.title" bundle="rcl"/></title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <script type="text/javascript">
         function downloadRerIncident()
         {
            document.forms[0].action =  "<%=request.getContextPath()%>/secure/actions/downloadRerIncident.do";
            document.forms[0].submit();
         }

         function viewReportSpecifications()
         {
            var rerId = document.getElementsByName("rerId")[0].value;
            var url = ServerEnvironment.baseUrl + "/secure/actions/debugRer.do?rerId=" + rerId;

            var windowName = ServerEnvironment.windowNamePrefix + "_debugRer_" + rerId;

            var geom = new BrowserGeometry();
            var win = window.open(url,
                    windowName,
                    "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

            win.focus();
         }
      </script>
      <style type="text/css">
         *.errorMessage {
            color:red;
            font-weight:bold;            
         }
      </style>
   </head>
   <body>

   <html:form action="/secure/actions/downloadIncident">
      <html:hidden property="incidentId"/>
      <html:hidden property="rerId"/>

      <span class="pageBanner"><bean:message bundle="rcl" key="incident.displayException.bannar"/></span><br/>
      <bean:message bundle="rcl" key="incident.displayException.errorOccured"/><br/>
      <hr/>

      <table>
         <tr>
            <td colspan="2"><bean:message bundle="rcl" key="incident.displayException.message"/></td>
         </tr>
         <tr>
            <td class="label"><span class="labelText"><bean:message bundle="rcl" key="incident.displayException.label.date"/></span></td>
            <td><c:out value="${incidentForm.date}"/></td>
         </tr>
         <tr>
            <td class="label"><span class="labelText"><bean:message bundle="rcl" key="incident.displayException.label.user"/></span></td>
            <td><c:out value="${incidentForm.userLogon}"/></td>
         </tr>
         <tr>
            <td class="label"><span class="labelText"><bean:message bundle="rcl" key="incident.displayException.label.message"/></span></td>
            <td><span class="errorMessage"><c:out value="${incidentForm.errorMessage}"/></span></td>
         </tr>
         <tr>
            <logic:empty name="incidentForm" property="rerId">
               <td class="label"><span class="labelText"><bean:message bundle="rcl" key="incident.displayException.label.id"/></span></td>
               <td><c:out value="${incidentForm.incidentId}"/></td>
            </logic:empty>
            <logic:notEmpty name="incidentForm" property="rerId">
               <td class="label"><span class="labelText"><bean:message bundle="rcl" key="incident.displayException.label.rerId"/></span></td>
               <td><c:out value="${incidentForm.rerId}"/></td>
            </logic:notEmpty>
         </tr>

         <rcl:checkCapability hasAll="INCIDENT">
            <tr>
               <td colspan="2">
                  <logic:empty name="incidentForm" property="rerId">
                     <html:submit style="margin:0px 10px 0px 20px;"
                               property="submitButton"
                               altKey="incident.displayException.button.download.alt"
                               titleKey="incident.displayException.button.download.title"
                               bundle="rcl">
                        <bean:message bundle="rcl" key="incident.displayException.button.download.value"/>
                     </html:submit>
                  </logic:empty>

                  <logic:notEmpty name="incidentForm" property="rerId">
                     <html:button style="margin:0px 10px 0px 20px;"
                               property="submitButton"
                               altKey="incident.displayException.button.download.alt"
                               titleKey="incident.displayException.button.download.title"
                               onclick="javascript:downloadRerIncident();"
                               bundle="rcl">
                        <bean:message bundle="rcl" key="incident.displayException.button.download.value"/>
                     </html:button>
                  </logic:notEmpty>
               </td>
            </tr>
            <logic:notEmpty name="incidentForm" property="rerId">
               <tr>
                  <td>
                     <html:button style="margin:0px 10px 0px 20px;"
                               property="submitButton"
                               altKey="incident.displayException.button.viewSpecs.alt"
                               titleKey="incident.displayException.button.viewSpecs.title"
                               onclick="javascript:viewReportSpecifications();"
                               bundle="rcl">
                        <bean:message bundle="rcl" key="incident.displayException.button.viewSpecs.value"/>
                     </html:button>
                  </td>
               </tr>
            </logic:notEmpty>
         </rcl:checkCapability>
         <rcl:checkCapability hasNone="INCIDENT">
            <tr>
               <td colspan="2">
                  <fmt:message key="incident.occured"/>
               </td>
            </tr>
            <tr>
               <logic:empty name="incidentForm" property="rerId">
                  <td>
                     Reference #: Incident #<c:out value="${incidentForm.incidentId}"/>
                  </td>
               </logic:empty>
               <logic:notEmpty name="incidentForm" property="rerId">
                  <td>
                     Reference #: Report Execution Request #<c:out value="${incidentForm.rerId}"/>
                  </td>
               </logic:notEmpty>               
            </tr>
            <logic:notEmpty name="incidentForm" property="rerId">
               <tr>
                  <td>
                     <html:button style="margin:0px 10px 0px 20px;"
                               property="submitButton"
                               altKey="incident.displayException.button.viewSpecs.alt"
                               titleKey="incident.displayException.button.viewSpecs.title"
                               onclick="javascript:viewReportSpecifications();"
                               bundle="rcl">
                        <bean:message bundle="rcl" key="incident.displayException.button.viewSpecs.value"/>
                     </html:button>
                  </td>
               </tr>
            </logic:notEmpty>            
         </rcl:checkCapability>
      </table>

   </html:form>

   </body>
</html>


