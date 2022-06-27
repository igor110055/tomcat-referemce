<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Describe Page Here...

   ---------------------------
   @author : Jeremy Siler
--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>
   <title>TITLE</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/FadeMessage.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ImageHelper.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ButtonBar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/UserPreferenceUi.js"></script>

   <script type="text/javascript">
      function refreshNavMenu()
      {
         parent.window.refresh();
      }
   </script>

   <style type="text/css">
      @import "<%= request.getContextPath() %>/styles/rcl/workspaceWithProperties.css";
      @import "<%= request.getContextPath() %>/styles/rcl/userPreferences.css";


   </style>

</head>

<body class="rclBody workspace"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

<html:form action="/secure/actions/saveUserPreference.do" method="post">


   <div id="bodyDiv">
      <div id="contentShell">

         <div class="pageBanner">
            <fmt:message key="userPrefs.heading"/>
         </div>

         <div id="userPreferences">
            <table>
               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.categorizeFolders"/>
                  </td>
                  <td>
                     <html:select property="savedCategory">
                        <c:forEach var="eachCategory" items="${form.categorizeByOptions}">
                           <c:choose>
                              <c:when test="${eachCategory.value == form.savedCategory}">
                                    <option selected="selected" value="<c:out value="${eachCategory.value}"/>">
                                    <fmt:message key="${eachCategory.displayValue}"/>
                                 </option>
                              </c:when>
                              <c:otherwise>
                                   <option value="<c:out value="${eachCategory.value}"/>">
                                    <fmt:message key="${eachCategory.displayValue}"/>
                                 </option>
                              </c:otherwise>
                            </c:choose>
                        </c:forEach>
                     </html:select>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.expire"/>
                  </td>
                  <td>
                     <html:select property="numberOfDaysUntilOuputExpiration">

                        <%--todo i18n - issues with using fmt:param with fmt:message when the property contains an apostrophe--%>

                        <%--<html:option styleId="expirationOption1" value='7'> <fmt:message key="profileWizard.outputs.Days"><fmt:param value="7"/></fmt:message></html:option>--%>
                        <html:option styleId="expirationOption1" value='7'> <bean:message bundle="rcl" key="profileWizard.outputs.Days" arg0="7"/> </html:option>

                        <%--<html:option styleId="expirationOption2" value='30'><fmt:message key="profileWizard.outputs.Days"><fmt:param value="30"/></fmt:message></html:option>--%>
                        <html:option styleId="expirationOption2" value='30'><bean:message bundle="rcl" key="profileWizard.outputs.Days" arg0="30"/> </html:option>

                        <%--<html:option styleId="expirationOption3" value='90'><fmt:message key="profileWizard.outputs.Days"><fmt:param value="90"/></fmt:message></html:option>--%>
                        <html:option styleId="expirationOption3" value='90'><bean:message bundle="rcl" key="profileWizard.outputs.Days" arg0="90"/></html:option>

                        <%--<html:option styleId="expirationOption4" value='365'><fmt:message key="profileWizard.outputs.Year"/></html:option>--%>
                        <html:option styleId="expirationOption4" value='365'><bean:message bundle="rcl" key="profileWizard.outputs.Year"/> </html:option>

                        <%--<html:option styleId="expirationOption5" value='548'><fmt:message key="profileWizard.outputs.Years"><fmt:param value="1.5"/> </fmt:message></html:option>--%>
                        <html:option styleId="expirationOption5" value='548'><bean:message bundle="rcl" key="profileWizard.outputs.Years" arg0="1.5"/> </html:option>

                        <%--<html:option styleId="expirationOption6" value='-1'>  <fmt:message key="profileWizard.outputs.Never"/></html:option>--%>
                        <html:option styleId="expirationOption6" value='-1'>  <bean:message bundle="rcl" key="profileWizard.outputs.Never"/> </html:option>
                     </html:select>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.dateFormat"/>
                  </td>
                  <td>
                     <html:select property="dateFormat">
                        <html:option value='DEFAULT' >
                               <fmt:message key="userPrefs.default"/>
                        </html:option>
                        <html:options property="allowedDateFormats"/>                        
                     </html:select>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.timeFormat"/>
                  </td>
                  <td>
                     <html:select property="timeFormat">
                        <html:option value='DEFAULT' >
                               <fmt:message key="userPrefs.default"/>
                        </html:option>
                        <html:options property="allowedTimeFormats"/>

                     </html:select>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.theme"/>
                  </td>
                  <td>
                     <html:select property="theme">
                        <html:option value="aero">aero</html:option>
                        <html:option value="vista">vista</html:option>
                        <html:option value="galdaka">galdaka</html:option>
                        <html:option value="gray">gray</html:option>
                     </html:select>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.delete"/>
                  </td>
                  <td>
                     <html:checkbox property="confirmDeletes" styleId="confirmDeletes"></html:checkbox>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.itemsPerPage"/>
                  </td>
                  <td>
                     <html:text property="itemsPerPage" size="10" onkeydown="return uiController.onInputKeyPress(event);" />
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.autoLaunchReports"/>
                  </td>
                  <td>
                     <html:checkbox styleId="automaticallyLaunchReportViewer" property='automaticallyLaunchReportViewer'/>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <fmt:message key="userPrefs.label.launchOutputInNewViewer"/>
                  </td>
                  <td>
                     <html:checkbox styleId="launchViewerInSeparateWindows" property='launchViewerInSeparateWindows'/>
                  </td>
               </tr>
            </table>
         </div>


         <div class="bottomButtons">
               <html:button property="Submit" onclick="uiController.saveUserPreferences()" altKey="userPrefs.button.saveUserPreference.alt" titleKey="userPrefs.button.saveUserPreference.title" bundle="rcl">
                  <bean:message key="userPrefs.button.saveUserPreference" bundle="rcl"/>
               </html:button>
         </div>
      </div>
   </div>

   <script type="text/javascript">

      var uiController = new UserPreferenceUiController(document);

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         uiController.initUi();
      });

   </script>
</html:form>

</body>
</html>
