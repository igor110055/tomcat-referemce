<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Page for editing REI destinations..

   ---------------------------
   @author : Jeremy Siler

   $Id: reiDestinationPrefs.jsp 7109 2010-01-29 15:27:35Z lhankins $

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

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/rei/ReiDestinationsUi.js"></script>

   <script type="text/javascript">
      // generates the JS definition of the current REI
      <c:out value="${reiForm.jsRei}" escapeXml="false"/>
      <c:out value="${reiForm.jsDestinations}" escapeXml="false"/>

      <c:choose>
      <c:when test="${reiForm.hasCustomPrompt}">
      var hasCustomPrompt = true;
      </c:when>
      <c:otherwise>
      var hasCustomPrompt = false;
      </c:otherwise>
      </c:choose>

      var uiModel = new ReiDestinationsUiModel(rei, <c:out value="${reiForm.emailServerDestinationId}"/>, hasCustomPrompt, availableDestinations);
      var uiController = new ReiDestinationsUiController(document, uiModel);

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         uiController.initUi();
         uiController.onReiDialogResize();
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
      <html:hidden property="currentStage" value="destinations"/>
      Add destinations to the profile's destinations list then select from there to edit appropriate options.
      <br/>
      <br/>
     <fieldset>
         <table>
            <tr>
               <td>
                 <fmt:message key="profileWizard.destinations.availableDestinations"/>
               </td>
               <td>

               </td>
               <td>
                 <fmt:message key="profileWizard.destinations.selectedDestinations"/>
               </td>
            </tr>
            <tr>
               <td>
                  <select style="width:250px" multiple="multiple" size="10" id="availableDestinationsSelect">
                  </select>
               </td>
               <td id="permissionsButtonCell">
                  <input type="button" value=">>" onclick="uiController.addDestination();"/>
                  <br/>
                  <input type="button" value="<<" onclick="uiController.removeDestination();"/>
               </td>
               <td id="destinationSelection">
                  <select style="width:250px" size="10" id="addedDestinationsSelect" onclick="uiController.toggleDestinationOptions()"/>
               </td>
               <td style="padding-left:10px;">

                   <fieldset id="errorField" style="display:none;">
                     <legend><fmt:message key="profileWizard.destinations.deliveryOptionsErrors"/></legend>
                     <div id="errorDiv">

                     </div>

                  </fieldset>
               </td>
            </tr>
         </table>
      </fieldset>
      <fieldset id="emailDeliveryPref">
         <legend><fmt:message key="profileWizard.destinations.deliveryOptions"/></legend>

      <table border="0" id="emailDeliveryOptions" style="display:none;">
         <tr>
            <td class="deliveryPrefDiv">
               &nbsp;&nbsp;&nbsp;<fmt:message key="profileWizard.destinations.emailTo"/>
            </td>
            <td>
               <input id="emailTo" type="text" name="emailSendTo" readonly="readonly"
                      style="background:gainsboro; width:400px;"/>&nbsp;<span style="color:red;display:none;" id="emailToError"><fmt:message key="profileWizard.destinations.emailError"/></span>
            </td>
         </tr>
         <tr>
            <td class="deliveryPrefDiv">
               &nbsp;&nbsp;&nbsp;<fmt:message key="profileWizard.destinations.emailCc"/>
            </td>
            <td>
               <input id="emailCc" type="text" name="emailCcTo" readonly="readonly"
                      style="background:gainsboro; width:400px;"/>
            </td>
         </tr>
         <tr>
            <td class="deliveryPrefDiv">
               &nbsp;&nbsp;&nbsp;<fmt:message key="profileWizard.destinations.emailBcc"/>
            </td>
            <td>
               <input id="emailBcc" type="text" name="emailBccTo" readonly="readonly"
                      style="background:gainsboro; width:400px;"/>
            </td>
         </tr>
         <tr>
            <td class="deliveryPrefDiv">
               &nbsp;&nbsp;&nbsp;<fmt:message key="profileWizard.destinations.emailSubject"/>
            </td>
            <td>
               <input id="emailSubject" type="text" name="emailSubject" readonly="readonly"
                      style="background:gainsboro; width:400px;"/>
            </td>
         </tr>
         <tr>
            <td class="deliveryPrefDiv" style="vertical-align:text-top;">
               &nbsp;&nbsp;&nbsp;<fmt:message key="profileWizard.destinations.emailBody"/>
            </td>
            <td>
               <textarea rows="10" cols="50" id="emailBody" name="emailBody" readonly="readonly"
                      style="background:gainsboro; width:400px; height:100px"></textarea>
            </td>
         </tr>
      </table>


      <div class="deliveryPrefDiv" id ="outputOptionsDiv" style="display:none;">
         &nbsp;&nbsp;&nbsp;<fmt:message key="profileWizard.destinations.deliverAttach"/>
         <br/>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="emailPdf" type="checkbox" name="emailPdfEnabled"
                                                                disabled="disabled"><span><fmt:message key="profileWizard.outputs.pdf"/></span>
         <input id="emailXls" type="checkbox" name="emailXlsEnabled" disabled="disabled"><span><fmt:message key="profileWizard.outputs.xls"/></span>
         <input id="emailXls2007" type="checkbox" name="emailXls2007Enabled" disabled="disabled"><span><fmt:message key="profileWizard.outputs.xls.2007"/></span>
         <input id="emailXml" type="checkbox" name="emailXmlEnabled" disabled="disabled"><span><fmt:message key="profileWizard.outputs.xml"/></span>
         <input id="emailCsv" type="checkbox" name="emailCsvEnabled" disabled="disabled"><span><fmt:message key="profileWizard.outputs.csv"/></span>
         <span style="color: red;display:none;" id="emailOutputError"><fmt:message key="profileWizard.destinations.emailOutputError"/></span>
         <br/>
         <input id="emailZip" type="checkbox" name="zipEnabled"
                                  disabled="disabled"><span><fmt:message key="profileWizard.destinations.deliverAttachmentsAsZip"/></span>



       </div>
      </fieldset>

      <fieldset id="saveButtonField" style="display:none;">
         <div class="saveButtonDiv">
          <html:button property="" styleId="saveButton" onclick="uiController.saveCurrentDestinationOptions();" disabled="disabled"
                 altKey="profileWizard.button.save.alt" titleKey="profileWizard.button.save.title" bundle="rcl">
            <fmt:message key="profileWizard.button.save"/>
         </html:button>
         </div>

      </fieldset>

     <%-- <fieldset id="errorField" style="display:none;">
         <legend><fmt:message key="profileWizard.destinations.deliveryOptionsErrors"/></legend>
         <div id="errorDiv">

         </div>

      </fieldset>--%>

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
