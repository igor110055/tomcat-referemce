<%@ page import="com.focus.rcl.core.ReportMetaData" %>
<%@ page import="com.focus.rcl.web.workspace.EditReportExecutionInputsForm" %>
<%@ page import="com.focus.rcl.core.Report" %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing REI output prefs...

   ---------------------------
   @author : Lance Hankins

   $Id: reiOutputPrefs.jsp 7194 2010-06-23 15:06:30Z dbequeaith $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>


   <title><c:out value="${form.targetName}"/></title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/WEB-INF/pages/rcl/rei/commonReiIncludes.jsp"%>

   <html:xhtml/>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiOutputsUi.js"></script>

   <script type="text/javascript">
      var xmlHttpRequest;

      function showSignon(aObj)
      {
         //--- do async request to launch reports...
         xmlHttpRequest = JsUtil.createXmlHttpRequest();
         var url = ServerEnvironment.baseUrl + "/secure/actions/updateSignon.do";
         var httpParams = "connectionSearchPath=" + aObj.value;

         xmlHttpRequest.open("POST", url, true);

         xmlHttpRequest.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded; charset=UTF-8'
         );
         xmlHttpRequest.onreadystatechange = handleChange;
         xmlHttpRequest.send(httpParams);
      }

      function handleChange()
      {
         if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200)
         {
            var div = document.getElementById("signon");
            div.innerHTML = xmlHttpRequest.responseText;
         }
      }

      function togglePackageSelect(anObj)
      {
         if (anObj.checked)
         {
            document.getElementById('packageDiv').style.display = "";
         }
         else
         {
            document.forms[0].packageOverride.value = null;
            document.getElementById('packageDiv').style.display = "none";
         }
      }
      // generates the JS definition of the current REI
      <c:out value="${reiForm.jsRei}" escapeXml="false"/>


      <c:choose>
      <c:when test="${reiForm.hasCustomPrompt}">
      var hasCustomPrompt = true;
      </c:when>
      <c:otherwise>
      var hasCustomPrompt = false;
      </c:otherwise>
      </c:choose>

      var uiModel = new ReiOutputsUiModel(rei, <c:out value="${reiForm.emailServerDestinationId}"/>, hasCustomPrompt);
      var uiController = new ReiOutputsUiController(document, uiModel);

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         uiController.initUi();
         uiController.onReiDialogResize();

          if(ServerEnvironment.betaFeaturesEnabled)
          {
             document.getElementById('betaRerFolderSelection').style.display = "";
          }
          else
          {
             document.getElementById('betaRerFolderSelection').style.display = "none";
          }
      });
      

   </script>

</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();"
      onresize="uiController.onReiDialogResize();"
      style="margin:0px;">

<html:form action="/secure/actions/editRei" method="post">


   <div id="reiTop" class="layoutSection">
      <jsp:include page="reiWizardTop.jsp"/>
   </div>

   <div id="reiCenterContent">

      <%-----------------------------------------------%>
      <%-- BEGIN CUSTOM CONTENT FOR THIS WIZARD STEP --%>
      <%-----------------------------------------------%>
      <html:hidden property="currentStage" value="outputs"/>

      <fieldset>
      <legend><fmt:message key="profileWizard.outputs.outputPreferences"/></legend>

      <div class="outputPrefDiv">
         <input type="checkbox" name="overrideDefaultOutputs" id="overrideDefaultOutputs" onclick="uiController.overrideDefaultOutputs();"/>
         <fmt:message key="profileWizard.outputs.overrideDefaultTypes"/> ( <span id="defaultOutputsSpan">&nbsp;</span> )
      </div>
      <div class="outputPrefDiv">
         <%
            ReportMetaData reportMd = ((EditReportExecutionInputsForm)request.getAttribute("reiForm")).getTargetReport().getReportMetaData();
         %>

         <span style="<%=reportMd != null && reportMd.isSupportsPdfFormat() ? "" : "display:none"%>">
            <input type="checkbox" name="pdfEnabled">
            <span><fmt:message key="profileWizard.outputs.pdf"/></span>
         </span>

         <span style="<%=reportMd != null && reportMd.isSupportsHtmlFormat() ? "" : "display:none"%>">
            <input type="checkbox" name="htmlEnabled">
            <span><fmt:message key="profileWizard.outputs.html"/></span>
         </span>

         <span style="<%=reportMd != null && reportMd.isSupportsSingleXlsFormat() ? "" : "display:none"%>">
            <input type="checkbox" name="xlsEnabled">
            <span><fmt:message key="profileWizard.outputs.xls"/></span>
         </span>

         <span style="<%=reportMd != null && reportMd.isSupportsSpreadsheetMLFormat() ? "" : "display:none"%>">
            <input type="checkbox" name="xls2007Enabled">
            <span><fmt:message key="profileWizard.outputs.xls.2007"/></span>
         </span>

         <span style="<%=reportMd != null && reportMd.isSupportsXmlFormat() ? "" : "display:none"%>">
            <input type="checkbox" name="xmlEnabled">
            <span><fmt:message key="profileWizard.outputs.xml"/></span>
         </span>

         <span style="<%=reportMd != null && reportMd.isSupportsCsvFormat() ? "" : "display:none"%>">
            <input type="checkbox" name="csvEnabled">
            <span><fmt:message key="profileWizard.outputs.csv"/></span>
         </span>
      </div>
      </fieldset>


      <fieldset><legend><fmt:message key="profileWizard.outputs.retentionPolicy"/></legend>
       <div id="expirationOptions">
         <fmt:message key="profileWizard.outputs.outputsExpireIn"/>&nbsp;<select style="width:175px;" name="numberOfDaysUntilOuputExpiration">

            <option value=""><fmt:message key="profileWizard.outputs.useSystemDefault"/></option>

             <%--todo i18n - issues with using fmt:param with fmt:message when the property contains an apostrophe--%>

            <%--<option value="7"><fmt:message key="profileWizard.outputs.Days"><fmt:param value="7"/> </fmt:message></option>--%>
            <option value="7"><bean:message bundle="rcl" key="profileWizard.outputs.Days" arg0="7"/> </option>

            <%--<option value="30"><fmt:message key="profileWizard.outputs.Days"><fmt:param value="30"/> </fmt:message></option>--%>
            <option value="30"><bean:message bundle="rcl" key="profileWizard.outputs.Days" arg0="30"/> </option>

            <%--<option value="90"><fmt:message key="profileWizard.outputs.Days"><fmt:param value="90"/> </fmt:message></option>--%>
            <option value="90"><bean:message bundle="rcl" key="profileWizard.outputs.Days" arg0="90"/> </option>

            <%--<option value="365"><fmt:message key="profileWizard.outputs.Year"/></option>--%>
            <option value="365"><bean:message bundle="rcl" key="profileWizard.outputs.Year"/></option>

            <%--<option value="548"><fmt:message key="profileWizard.outputs.Years"><fmt:param value="1.5"/> </fmt:message></option>--%>
            <option value="548"><bean:message bundle="rcl" key="profileWizard.outputs.Years" arg0="1.5"/></option>

            <%--<option value="-1"><fmt:message key="profileWizard.outputs.Never"/></option>--%>
            <option value="-1"><bean:message bundle="rcl" key="profileWizard.outputs.Never"/></option>
         </select>
      </div>
      </fieldset>

      <fieldset><legend><fmt:message key="profileWizard.outputs.launchPreferences"/></legend>
         <fmt:message key="profileWizard.outputs.executeReportsIn"/>
         <select id="launchPreference" name="launchPreference">
            <option value="BACKGROUND"><fmt:message key="profileWizard.outputs.executeReportsInBackground"/></option>
            <option value="FOREGROUND"><fmt:message key="profileWizard.outputs.executeReportsInForeground"/></option>
         </select>
      </fieldset>

      <fieldset><legend><fmt:message key="profileWizard.outputs.maxExecutionTime"/></legend>
         <fmt:message key="profileWizard.outputs.maxExecutionTime"/> <input id="maxExecutionTime" type="text"  size="10" > secs
         <br>  (For no set max execution time please enter 0)
      </fieldset>

      <c:if test="${reiForm.canBurst}">
        <fieldset><legend><fmt:message key="profileWizard.outputs.burst"/></legend>
         <fmt:message key="profileWizard.outputs.burst"/> <input id="isBurst" type="checkbox" name="isBurst">
        </fieldset>
      </c:if>

      <div id="betaRerFolderSelection">
          <fieldset><legend><fmt:message key="profileWizard.outputs.rerFolder"/></legend>
             <fmt:message key="profileWizard.outputs.saveFolderIn"/>
             <input type="radio" name="rerFolderPath" id="rerPublicFolder" value="public"/><span><fmt:message key="profileWizard.outputs.rerFolderPublic"/></span>
             <input type="radio" name="rerFolderPath" id="rerPrivateFolder" value="private"/><span><fmt:message key="profileWizard.outputs.rerFolderPrivate"/></span>
          </fieldset>
      </div>

<%--LWH: commenting out due to #1433 and #1455 (until we can come up with a better solution to this).--%>

<%--

      <fieldset>
         <legend><fmt:message key="profileWizard.outputs.packageOverride"/></legend>
         <input type="checkbox" id="package" onclick="togglePackageSelect(this);"  <c:if test="${form.reportExecutioninputs.packageOverride != null}"> checked=checked </c:if> /> <fmt:message key="profileWizard.outputs.packageOverrideCheckbox"/> <br/>
         <div id="packageDiv" <c:if test="${form.reportExecutioninputs.packageOverride == null}"> style="display: none;" </c:if> >
            <select id="packageOverride" name="packageOverride">
               <option value="">Default</option>
               <c:forEach var="package" items="${form.packages}">
                  <option value="${package}" <c:if test="${form.reportExecutioninputs.packageOverride == package}"> selected=selected </c:if> >${package}</option>
               </c:forEach>
            </select>
         </div>
      </fieldset>

--%>

<%--LWH: commenting out due to #1433 and #1455 (until we can come up with a better solution to this).--%>
          
<%--


         <div id="betaConnectionSigonSelection">
            <fieldset><legend><fmt:message key="profileWizard.outputs.dataSource"/></legend>
               <c:choose>
                  <c:when test="${reiForm.crnDataSourceConnectionsSize > 1}">
                     <div id="connection">
                        <fmt:message key="profileWizard.outputs.connections"/>
                        <select id="connectionSearchPath" name="connectionSearchPath" onchange="showSignon(this);">
                           <option value="null">Default</option>
                           <c:forEach var="connection" items="${form.crnDataSourceConnections}">
                              <c:set var="found" value="false"/>
                              <c:forEach var="each" items="${form.reportExecutioninputs.dataSourceQualifiers.qualifiers}">
                                 <c:if test="${connection.searchPath == each.connectionSearchPath}">
                                    <c:set var="found" value="true"/>
                                    <c:set var="dataSourceConnection" value="${connection}" />                                    
                                 </c:if>
                              </c:forEach>
                              <option value="${connection.name}" <c:if test="${found == 'true'}" >selected="selected"</c:if> >${connection.name}</option>
                           </c:forEach>
                        </select>
                     </div>
                  </c:when>
                  <c:otherwise>
                     <div id="connection">
                        <fmt:message key="profileWizard.outputs.connections"/>
                        <select id="connectionSearchPath" name="connectionSearchPath" onchange="showSignon(this);" disabled>
                           <option value="null">Default</option>
                           <c:forEach var="connection" items="${form.crnDataSourceConnections}">
                              <c:set var="found" value="false"/>
                              <c:forEach var="each" items="${form.reportExecutioninputs.dataSourceQualifiers.qualifiers}">
                                 <c:if test="${connection.searchPath == each.connectionSearchPath}">
                                    <c:set var="found" value="true"/>
                                    <c:set var="dataSourceConnection" value="${connection}" />
                                 </c:if>
                              </c:forEach>
                              <option value="${connection.name}" <c:if test="${found == 'true'}" >selected="selected"</c:if> >${connection.name}</option>
                           </c:forEach>
                        </select>
                     </div>
                  </c:otherwise>
               </c:choose>
               <c:choose>
                  <c:when test="${dataSourceConnection != null}">
                     <div id="signon">
                        <fmt:message key="profileWizard.outputs.signons"/>
                        <select id="signonSearchPath" name="signonSearchPath">
                           <c:forEach var="signon" items="${dataSourceConnection.signons}">
                              <c:choose>
                                 <c:when test="${signon.name == null}" >
                                    <option value="${signon.escapedXmlSearchPath}"></option>                                  
                                 </c:when>
                                 <c:otherwise>
                                    <option value="${signon.escapedXmlSearchPath}">${signon.name}</option>
                                 </c:otherwise>
                              </c:choose>
                           </c:forEach>
                        </select>
                     </div>
                  </c:when>
                  <c:otherwise>
                     <div id="signon">
                        <fmt:message key="profileWizard.outputs.signons"/>
                        <select id="signonSearchPath" name="signonSearchPath" disabled>
                           <option>Default</option>
                        </select>
                     </div>
                  </c:otherwise>
               </c:choose>
            </fieldset>
         </div>
--%>


      <%-----------------------------------------------%>
      <%--  END CUSTOM CONTENT FOR THIS WIZARD STEP  --%>
      <%-----------------------------------------------%>


   </div>


   <div id="reiBottom" class="layoutSection">
      <jsp:include page="reiWizardBottom.jsp"/>
   </div>


      <!-- Standard Fields in each of the eidt rei forms... -->
      <html:hidden property="saveAsNewProfileName"/>

      <html:hidden property="targetId"/>
      <html:hidden property="targetName"/>
      <html:hidden property="targetType"/>
      <html:hidden property="privateProfile"/>
      <html:hidden property="saveToFolderPath"/>
      <html:hidden property="emailServerDestinationId"/>

      <html:hidden property="hasCustomPrompt"/>
      <html:hidden property="canBurst"/>
      <html:hidden property="customPromptUrl"/>
      <html:hidden property="saveToFolderId"/>
      <html:hidden property="initialEntryPoint"/>
      <html:hidden property="jumpTo" value=""/>
      <html:hidden property="viewGesture" value=""/>
      <html:hidden property="reiXml" value=""/>
      <html:hidden property="defaultReiXml"/>



   </html:form>

  

</body>
</html>
