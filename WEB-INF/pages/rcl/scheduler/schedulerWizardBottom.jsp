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


   <html:button property="" styleId="saveButton" onclick="uiController.save();"
                altKey="button.Save" titleKey="button.Save" bundle="rcl" disabled="false">
      <fmt:message key="button.Save"/>
   </html:button>


</div>
