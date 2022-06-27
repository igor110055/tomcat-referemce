<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>

<div id="rwBottomButtons">
  <html:button property="" styleId="cancelButton"  onclick="uiController.cancelButton();"
               altKey="reportWizard.bottomButtons.cancel" titleKey="reportWizard.bottomButtons.cancel" bundle="rcl">
      <fmt:message key="reportWizard.bottomButtons.cancel"/>
  </html:button>
  <html:button property="" styleId="previousButton" onclick="uiController.previousButton();"
               altKey="reportWizard.bottomButtons.previous" titleKey="reportWizard.bottomButtons.previous"  bundle="rcl">
     <fmt:message key="reportWizard.bottomButtons.previous"/>
  </html:button>
  <html:button property="" styleId="nextButton" onclick="uiController.nextButton();"
               altKey="reportWizard.bottomButtons.next" titleKey="reportWizard.bottomButtons.next"  bundle="rcl">
     <fmt:message key="reportWizard.bottomButtons.next"/>
  </html:button>
  <html:button property="" styleId="runButton" onclick="uiController.runButton();"
               altKey="reportWizard.bottomButtons.run" titleKey="reportWizard.bottomButtons.run"  bundle="rcl">
     <fmt:message key="reportWizard.bottomButtons.run"/>
  </html:button>
  <html:button property="" styleId="previewButton" onclick="uiController.previewButton();"
               altKey="reportWizard.bottomButtons.preview" titleKey="reportWizard.bottomButtons.preview"  bundle="rcl">
      <fmt:message key="reportWizard.bottomButtons.preview"/>
  </html:button>
   <html:button property="" styleId="validateButton" onclick="uiController.validateButton();"
                altKey="reportWizard.bottomButtons.validate" titleKey="reportWizard.bottomButtons.validate" bundle="rcl">
      <fmt:message key="reportWizard.bottomButtons.validate"/>
   </html:button>
  <html:button property="" styleId="finishButton" onclick="uiController.finishButton();"
               altKey="reportWizard.bottomButtons.finish" titleKey="reportWizard.bottomButtons.finish" bundle="rcl">
     <fmt:message key="reportWizard.bottomButtons.finish"/>
  </html:button>
</div>
