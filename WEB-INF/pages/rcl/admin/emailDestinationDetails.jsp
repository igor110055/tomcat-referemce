<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<%-- Note... this isn't a valid jsp on it's own. it's included in destinationDetails.jsp --%>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.hostName"/></span>
   </td>
   <td>
      <html:text property="emailDestinationForm.emailHost" size="50"/>
      <span class="labelText"><fmt:message key="admin.destinations.port"/></span>
      <html:text property="emailDestinationForm.port" size="10"/>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.ssl"/></span>
   </td>
   <td>
      <html:checkbox property="emailDestinationForm.ssl"/>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.userName"/></span>
   </td>
   <td>
      <html:text property="emailDestinationForm.emailUserId" size="90"/>
   </td>
</tr>
<tr>
   <td colspan="2">
      <span style="color:red;">
         <html:errors bundle="rcl" property="emailDestinationForm.emailPassword"/>
      </span>
   </td>
</tr>
<tr>
   <td class="label">

      <span class="labelText"><fmt:message key="admin.destinations.password"/></span>
   </td>
   <td>
      <html:password property="emailDestinationForm.emailPassword" size="90"/>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.verify.password"/></span>
   </td>
   <td>
      <html:password property="emailDestinationForm.validateEmailPassword" size="90"/>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.emailFrom"/></span>
   </td>
   <td>
      <html:text property="emailDestinationForm.emailFrom" size="90"/>
   </td>
</tr>
<tr>
   <td class="label">
      <span class="labelText"><fmt:message key="admin.destinations.emailDomains"/></span>
   </td>
   <td>
      <div>
         <span>
            <html:select property="emailDestinationForm.selectedValidDomains"
                         styleId="selectedValidDomains" multiple="true">
               <html:optionsCollection property="emailDestinationForm.validDomains" label="domain" value="domain"/>
            </html:select>
         </span>
         <span>
            <span>
               <input type="button" value="<fmt:message key="button.add"/>" onclick="uiController.addItemWithPrompt('selectedValidDomains', '', '<fmt:message key="admin.destinations.addEmailDomain"/>', '<fmt:message key="admin.destinations.invalidValue"/>')"/>
            </span>
            <span>
               <input type="button" value="<fmt:message key="button.remove"/>" onclick="uiController.removeSelectedItems('selectedValidDomains');"/>
            </span>
         </span>
      </div>
   </td>
</tr>

<script type="text/javascript">
   uiController.addSelectForSubmit('selectedValidDomains');
</script>

<tr>
    <td class="label">
        Test TO Email:
    </td>
    <td>
        <input type="text" name="toEmail">
    </td>
</tr>
<tr>
    <td class="label">

    </td>
    <td>
        <input type="button" value="Send Test Email" onclick="uiController.sendTestEmail()">
    </td>
</tr>
<tr>
    <td class="label">
        Test Output:
    </td>
    <td>
        <iframe style="width:800px; height: 200px; border: none;" name="outputIframe" id="outputIframe">
        </iframe>
    </td>
</tr>
