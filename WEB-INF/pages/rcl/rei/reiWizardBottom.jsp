<%@ page import="com.focus.rcl.RclEnvironment" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>

<div id="rwBottomButtons">
  <html:button property="" styleId="cancelButton" onclick="uiController.cancel();"
               altKey="button.Cancel" titleKey="button.Cancel" bundle="rcl">
     <fmt:message key="button.Cancel"/>
  </html:button>
  <html:button property="" styleId="previousButton" onclick="uiController.previousButton();"
               altKey="button.Previous" titleKey="button.Previous" bundle="rcl">
     <fmt:message key="button.Previous"/>
  </html:button>
  <html:button property="" styleId="nextButton" onclick="uiController.nextButton();"
               altKey="button.Next" titleKey="button.Next" bundle="rcl">
     <fmt:message key="button.Next"/>
  </html:button>
  <html:button property="" styleId="runButton" onclick="uiController.run();"
               altKey="button.Run" titleKey="button.Run" bundle="rcl">
     <fmt:message key="button.Run"/>
  </html:button>

   <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
      <html:button property="" styleId="getSqlButton" onclick="uiController.getSql();"
                   altKey="button.getSql" titleKey="button.getSql" bundle="rcl">
         <fmt:message key="button.getSql"/>
      </html:button>
   </logic:present>

   <c:if test="${form.saveEnabled==true}">
      <script type="text/javascript">
         uiModel.allowSave = true;
      </script>
      <html:button property="" styleId="saveButton" onclick="uiController.save();"
                   altKey="button.Save" titleKey="button.Save" bundle="rcl" disabled="false" >
      <fmt:message key="button.Save"/>
   </html:button>
   </c:if>
   <c:if test="${form.saveEnabled==false}">
      <script type="text/javascript">
         uiModel.allowSave = false;
      </script>
      <html:button property="" styleId="saveButton" onclick="uiController.save();"
                   altKey="button.Save" titleKey="button.Save" bundle="rcl" disabled="true" >
      <fmt:message key="button.Save"/>
   </html:button>
   </c:if>

  <html:button property="" styleId="saveAsButton" onclick="uiController.saveAs();"
               altKey="button.SaveAs" titleKey="button.SaveAs" bundle="rcl">
     <fmt:message key="button.SaveAs"/>
  </html:button>

</div>
