<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<%-- Note... this isn't a valid jsp on it's own. it's included in destinationDetails.jsp --%>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.directoryPath"/></span>
   </td>
   <td>
      <html:text property="localFileSystemDestinationForm.localPath" size="90"/>
   </td>
</tr>