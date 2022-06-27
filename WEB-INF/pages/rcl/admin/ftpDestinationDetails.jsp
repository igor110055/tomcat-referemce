<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<%-- Note... this isn't a valid jsp on it's own. it's included in destinationDetails.jsp --%>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.hostName"/></span>
   </td>
   <td>
      <html:text style="margin-right:5px; padding-right:5px;" property="ftpDestinationForm.ftpHost" size="50"/>
      <span class="labelText"><fmt:message key="admin.destinations.port"/></span>
      <html:text property="ftpDestinationForm.ftpPort" size="10"/>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.userName"/></span>
   </td>
   <td>
      <html:text property="ftpDestinationForm.ftpUserId" size="90"/>
   </td>
</tr>
<tr>
   <td colspan="2">
      <span style="color:red;">
         <html:errors bundle="rcl" property="ftpDestinationForm.ftpPassword"/>
      </span>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.password"/></span>
   </td>
   <td>
      <html:password bundle="rcl" property="ftpDestinationForm.ftpPassword" size="90"/>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.verify.password"/></span>
   </td>
   <td>
      <html:password bundle="rcl" property="ftpDestinationForm.validateFtpPassword" size="90"/>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.directoryPath"/></span>
   </td>
   <td>
      <html:text property="ftpDestinationForm.ftpPath" size="90"/>
   </td>
</tr>