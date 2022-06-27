<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>

<div id="rwBottomButtons">
   <html:button property="" styleId="cancelButton" onclick="uiController.cancel();"
           altKey="scheduler.button.cancel.alt" titleKey="scheduler.button.cancel.title" bundle="rcl">
      <fmt:message key="scheduler.button.cancel"/>
      </html:button>
   <html:button property="" styleId="saveButton" onclick="uiController.save();"
           altKey="scheduler.button.save.alt" titleKey="scheduler.button.save.title" bundle="rcl">
      <fmt:message key="scheduler.button.save"/>
      </html:button>
  <%--<input id="saveAsButton" type="button" value="Save As" onclick="uiController.saveAs();"/>--%>
</div>
