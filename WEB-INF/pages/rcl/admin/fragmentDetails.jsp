<%--
  Created by IntelliJ IDEA.
  User: sallman
  Date: Apr 26, 2006
  Time: 10:19:13 AM

  $Id: $
--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>
      <title>TITLE</title>

      <script type="text/javascript">
         <c:if test="${form.operation == 'edit'}">
            <c:out value="${form.jsFragmentSummaries}" escapeXml="false" />
         </c:if>

         function createAJAXArgString( )
         {
            return "newNodeName=" + document.forms[0].fragmentName.value + "&nodeId="
                    + document.forms[0].fragmentId.value + "&fragmentInjectorName=" +
                   escape(document.forms[0].injectorName.value) + "&fragmentXml=" + escape(document.forms[0].fragmentXml.value);
         }

         function checkFragmentNameAndGetAdjacentObject( anIndexModifier, anArray, aFragmentId, anActionPath )
         {
            var nameChecker = new NameChecker();
            var actionPath = ServerEnvironment.baseUrl + '/secure/actions/admin/checkFragmentNameExists.do';
            var nameExists = nameChecker.checkNameExists( actionPath, createAJAXArgString());

            if( !nameExists )
            {
               getAdjacentObject( anIndexModifier, anArray, aFragmentId, anActionPath );
            }
            else
            {
              DialogUtil.rclAlert( nameChecker.getErrMsg(), applicationResources.getProperty("management.validation.defaultError") );
            }
         }

         function checkFragmentNameAndSubmit()
         {
            var nameChecker = new NameChecker();
            var actionPath = ServerEnvironment.baseUrl + '/secure/actions/admin/checkFragmentNameExists.do';
            var nameExists = nameChecker.checkNameExists( actionPath, createAJAXArgString() );

            if( nameExists )
            {
               DialogUtil.rclAlert( nameChecker.getErrMsg(), applicationResources.getProperty("management.validation.defaultError") );
            }
            else
            {
               document.forms[0].submit();
            }
         }

         function uploadFragmentFile()
         {
            document.forms[0].action='<%=request.getContextPath()%>/secure/actions/admin/uploadFragment.do';
            document.forms[0].submit();
         }
      </script>
   </head>

   <body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:xhtml/>

      <nested:form action="/secure/actions/admin/saveFragment" method="post" enctype="multipart/form-data">
         <html:hidden property="fragmentId" styleId="fragmentId"/>
         <html:hidden property="operation"/>
         <html:hidden property="pageTitle"/>
         <!--todo make global a checkbox-->
         <html:hidden property="global"/>
         <html:hidden property="viewGesture"/>
      <div id="bodyDiv">
         <div id="contentShell">

         <div>
            <div class="pageBanner">
            <c:out value="${form.pageTitle}"/>
            </div>
            <c:if test="${form.operation == 'edit'}">
             <div class="pageTraverseButtons">
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.fragments.button.nav.next.title" altKey="admin.fragments.button.nav.next.alt"
                             onclick="checkFragmentNameAndGetAdjacentObject(-1, fragmentSummaries, document.forms[0].fragmentId.value,  '/secure/actions/admin/saveFragment.do?fragmentId=');">
                   <fmt:message key="admin.fragments.button.nav.next"/>
                </html:button>
                <html:button style="float:right;" property="" bundle="rcl" titleKey="admin.fragments.button.nav.previous.title" altKey="admin.fragments.button.nav.previous.alt"
                             onclick="checkFragmentNameAndGetAdjacentObject(1, fragmentSummaries, document.forms[0].fragmentId.value, '/secure/actions/admin/saveFragment.do?fragmentId=');">
                   <fmt:message key="admin.fragments.button.nav.previous"/>
                </html:button>
             </div>
            </c:if>
         </div>
         <div class="pageBody">
            <table>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.fragments.fragmentName"/> </span>
                  </td>
                  <td>
                     <html:text property="fragmentName" styleId="fragmentName" size="90"/>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.fragments.fragmentInsertionPoint"/> </span>
                  </td>
                  <td>
                     <html:select property="injectorName" styleId="injectorName" size="5">
                        <c:forEach var='currentInjector' items='${form.injectorList}'>
                           <option value="<c:out value='${currentInjector.value}'/>"
                                   <c:if test="${currentInjector.key == form.injectorName}">
                                      <c:out value=' selected="true"'/>
                                   </c:if>
                                   >
                              <c:out value='${currentInjector.key}'/>
                           </option>
                        </c:forEach>
                     </html:select>
                  </td>
               </tr>

               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.fragments.fragmentXml"/></span>
                  </td>
                  <td>
                     <html:textarea property="fragmentXml" styleId="fragmentXml" rows="17" cols="90"/>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     <span class="labelText"><fmt:message key="admin.fragments.uploadFile"/></span>
                  </td>
                  <td>
                     <html:file property="xmlFile" />
                     <html:button property="" onclick="uploadFragmentFile();" >
                        <fmt:message key="admin.button.upload"/>
                     </html:button>
                  </td>
               </tr>
               <tr>
                  <td colspan="2">

                     <html:button property=""
                                  onclick="setViewGesture('OK'); checkFragmentNameAndSubmit();"
                                  altKey="admin.button.ok.alt" titleKey="admin.button.ok.title" bundle="rcl">
                        <fmt:message key="admin.button.ok"/>
                     </html:button>

                     <html:submit property="" onclick="setViewGesture('Cancel');" altKey="admin.button.cancel.alt"
                                  titleKey="admin.button.cancel.title" bundle="rcl">
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
         </div>
         </div>
      </nested:form>
   </body>
</html>
