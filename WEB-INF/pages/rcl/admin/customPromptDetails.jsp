<%--
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
--%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>TITLE</title>

      <%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>
      <script type="text/javascript">
         <c:if test="${form.operation == 'edit'}">
            <c:out value="${form.jsCustomPromptSummaries}" escapeXml="false" />
         </c:if>

         function displayAppropriateUiForXmlSpec()
         {
            var useSpec = document.forms[0].useXmlSpec.checked;

            setVisibleByClassName( "fileUploadSection", useSpec );
            setVisibleByClassName( "actionPathSection", !useSpec );
         }

         function setVisibleByClassName( aClassName, isVisible )
         {
            var sections = document.getElementsByClassName(aClassName);
            for( var index = 0; index < sections.length; index++ )
            {
               var eachElement = sections[index];
               eachElement.style.display = ( isVisible ? "" : "none" );
            }
         }


     </script>

   </head>

   <body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:xhtml/>

      <html:form action="/secure/actions/admin/saveCustomPrompt" enctype="multipart/form-data">
         <html:hidden property="customPromptId" styleId="customPromptId"/>
         <html:hidden property="operation"/>
         <html:hidden property="pageTitle"/>

         <div>
            <div class="pageBanner">
            <c:out value="${form.pageTitle}"/>
            </div>
            <c:if test="${form.operation == 'edit'}">
             <div class="pageTraverseButtons">
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.customPrompt.nav.next.title" altKey="admin.customPrompt.nav.next.alt"
                             onclick="getAdjacentObject(-1, customPromptSummaries, document.forms[0].customPromptId.value, '/secure/actions/admin/saveCustomPrompt.do?customPromptId=');">
                   <fmt:message key="admin.customPrompt.nav.next"/>
                </html:button>
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.customPrompt.nav.previous.title" altKey="admin.customPrompt.nav.previous.alt"
                             onclick="getAdjacentObject(1, customPromptSummaries, document.forms[0].customPromptId.value, '/secure/actions/admin/saveCustomPrompt.do?customPromptId=');">
                   <fmt:message key="admin.customPrompt.nav.previous"/>
                </html:button>
             </div>
            </c:if>
         </div>
         <div class="pageBody">
            <table>
               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.customPrompt.name"/> </span>
                  </td>
                  <td>
                     <html:text property="customPromptName" size="90"/>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.customPrompt.description"/> </span>
                  </td>
                  <td>
                     <html:text property="customPromptDesc" size="90"/>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.customPrompt.useXmlSpec"/></span>
                  </td>
                  <td>
                     <html:checkbox property="useXmlSpec" onclick="displayAppropriateUiForXmlSpec()"/>
                  </td>
               </tr>
               <tr class="actionPathSection">
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.customPrompt.actionPath"/></span>
                  </td>
                  <td>
                     <html:text property="customPromptActionPath" size="90"/>
                  </td>
               </tr>
               <tr class="fileUploadSection"">
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.customPrompt.specFile"/></span>
                  </td>
                  <td>
                     <html:file property="xmlSpec"/>
                  </td>
               </tr>
            </table>
            <table>
               <tr>
                  <td colspan="2">
                     <html:hidden property="viewGesture"/>
                     <html:submit property="" onclick="setViewGesture('OK')" bundle="rcl" titleKey="admin.button.ok.title" altKey="admin.button.ok.alt">
                        <fmt:message key="admin.button.ok"/>
                     </html:submit>

                     <html:submit property="" onclick="setViewGesture('Cancel')" bundle="rcl" titleKey="admin.button.cancel.title" altKey="admin.button.cancel.alt">
                        <fmt:message key="admin.button.cancel"/>
                     </html:submit>

                     <script type="text/javascript">
                        function setViewGesture(gesture)
                        {
                           document.forms[0].viewGesture.value = gesture;
                        }
                     </script>
                  </td>
               </tr>
            </table>
         </div>


      </html:form>
   </body>
   <script type="text/javascript">
      displayAppropriateUiForXmlSpec();
   </script>
</html>