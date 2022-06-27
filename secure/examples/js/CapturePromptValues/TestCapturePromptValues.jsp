<%@ page import="com.focus.rcl.crn.config.CognosRoutingDecision" %>
<%@ page import="com.focus.rcl.customer.IRclCustomerEnvironment" %>
<%@ page import="com.focus.rcl.AbstractRclAppContext" %>
<%@ page import="com.focus.rcl.crn.config.ICognosRoutingDecision" %>
<%@ page import="com.focus.rcl.crn.CrnSettings" %>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>


<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>

   <title>CrnDialog Example - File Chooser</title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   
   <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp"%>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";

      #connectionOptionsDiv {
         margin: 30px 0px 0px 30px;
         padding: 0px 5px 0px 5px;
         border: 1px solid #AAAAAA;
         overflow: auto;
         font-size:11px;
      }

      #alternateConfigDiv {
         margin: 0px 0px 0px 30px;
         padding: 5px;
         border: 0px solid #AAAAAA;
         overflow: auto;
         font-size:11px;
      }
      #currentFileSelection {
         width:700px;
      }
      #promptIframe {
         width:1024px;
         height:768px;
      }

      #promptArea {
         margin: 30px 0px 0px 30px;
         padding: 0px 5px 0px 5px;
         border: 1px solid #AAAAAA;
         overflow: auto;
         font-size:11px;
         
      }
   </style>


   <script type="text/javascript">

   var crnDialog = new CrnDialog();
   var useDefaultCredentials = true;

   function initUi()
   {
   }

   function verifyCredentials()
   {
      var result = crnDialog.login(document.forms[0].crnEndPoint.value,
                                   document.forms[0].crnNameSpace.value,
                                   document.forms[0].crnUserId.value,
                                   document.forms[0].crnPassword.value);
      if (result == true)
         alert("credentials are VALID")
      else
         alert("credentials are NOT VALID")
   }

   var currentSelection = null;

   function pickCrnPath()
   {
      if (useDefaultCredentials)
      {
         crnDialog.credentials = null;
      }
      else
      {
         var result = crnDialog.login(document.forms[0].crnEndPoint.value,
                                      document.forms[0].crnNameSpace.value,
                                      document.forms[0].crnUserId.value,
                                      document.forms[0].crnPassword.value);

         if (result == false)
            return;
      }

      var dialogListener = {
         thisDoc : document,
         dialogFinished : function (aPicker) {
            if (aPicker.wasCancelled == false)
            {
               currentSelection = aPicker.selectedValues[0].id;
               document.forms[0].currentFileSelection.value = currentSelection;
            }
         }
      };

      crnDialog.setDialogListener (dialogListener);

      crnDialog.showFileChooserDialog("Please Select a Report",
                                          "/content",
                                          document.forms[0].currentFileSelection.value,
                                          true,
                                          ["report", "query", "folder"]);
   }


   function connectionMethodChanged()
   {

      var radio1  = document.forms[0].connectionMethod;

      if (radio1[0].checked == true)
      {
         useDefaultCredentials = true;
      }
      else
      {
         useDefaultCredentials = false;
      }

      var disabledAttr = useDefaultCredentials ? 'disabled' : '';

      document.forms[0].crnEndPoint.disabled = disabledAttr;
      document.forms[0].crnNameSpace.disabled = disabledAttr;
      document.forms[0].crnUserId.disabled = disabledAttr;
      document.forms[0].crnPassword.disabled = disabledAttr;
      document.forms[0].verifyButton.disabled = disabledAttr;
   }



   function renderPromptToIframe()
   {
      var settingsParams = (!useDefaultCredentials ?
                              "&crnEndPoint=" + document.forms[0].crnEndPoint.value +
                              "&crnNameSpace=" + document.forms[0].crnNameSpace.value +
                              "&crnUserId=" + document.forms[0].crnUserId.value +
                              "&crnPassword=" + document.forms[0].crnPassword.value : "");
      $("promptIframe").src = ServerEnvironment.baseUrl + "/secure/actions/capturePromptValues/promptViewer.do?reportSearchPath=" + $F("currentFileSelection") + settingsParams + "&actionWhenDone=/secure/actions/capturePromptValues/echoParameterSet.do&actionWhenCancelled=/secure/actions/capturePromptValues/cancel.do&crnBrowserEndPoint=<%=RclEnvironment.getCrnBrowserEndPoint()%>";
   }

   function renderPromptToNewWindow()
   {
      var settingsParams = (!useDefaultCredentials ?
                              "&crnEndPoint=" + document.forms[0].crnEndPoint.value +
                              "&crnNameSpace=" + document.forms[0].crnNameSpace.value +
                              "&crnUserId=" + document.forms[0].crnUserId.value +
                              "&crnPassword=" + document.forms[0].crnPassword.value : "");

      window.open(
              ServerEnvironment.baseUrl + "/secure/actions/capturePromptValues/promptViewer.do?reportSearchPath=" + $F("currentFileSelection") + settingsParams + "&actionWhenDone=/secure/actions/capturePromptValues/echoParameterSet.do&actionWhenCancelled=/secure/actions/capturePromptValues/cancel.do&crnBrowserEndPoint=<%=RclEnvironment.getCrnBrowserEndPoint()%>");
//              "/secure/actions/capturePromptValues/prompt.do?reportSearchPath=" + $F("currentFileSelection") + settingsParams,
//              'aWindowName');

   }
   </script>
</head>

<body onload="initUi();">
   <table>
      <tr>
         <td><img alt="focus logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">Harvest Prompt Values Via Normal Cognos Prompt Pages</span></td>
      </tr>
   </table>
   <p>
   Description: This example demonstrates example usage of using Cognos generated prompt pages to capture parameter values
   </p>


   <%-- BEGIN EXAMPLE CODE --%>
   <hr/>
   <div>
       <form action="#">

          <div>
             <span class="labelText">Select a Report (or paste in xpath):</span>
             <input type="text" id="currentFileSelection" name="currentFileSelection" maxlength="256"/>
             <input type="button" value="..." onclick="javascript:pickCrnPath();"/>
          </div>


          <div id="connectionOptionsDiv">

             <div>
                <h4>CRN Connection Details</h4>
                <input type="radio" name="connectionMethod" value="useDefault" checked="checked" onclick="javascript:connectionMethodChanged();">Connect as the currently logged in user, to the default CRN Instance.</input><br/>
                <input type="radio" name="connectionMethod" value="useNonDefault" onclick="javascript:connectionMethodChanged();">Connect as the following user to the specified CRN Instance.</input><br/>

<%--
                <%
                   CrnSettingsAndCredentials crnSettingsAndCredentials = RclAuthentication.getCurrentThreadIdentity().getCrnSettingsAndCredentials();
                %>
--%>
             </div>
             <div id="alternateConfigDiv">
                <table>
                   <tr>
                      <td>
                         <span class="labelText">Crn Endpoint</span>
                      </td>
                      <td>
                         <input disabled="disabled" type="text" name="crnEndPoint" size="80" value="<%=crnSettingsAndCredentials.getCrnSettings().getDispatcherUrlAsString()%>"/>
                      </td>
                   </tr>
                   <tr>
                      <td>
                         <span class="labelText">Crn NameSpace</span>
                      </td>
                      <td>
                         <input disabled="disabled" type="text" name="crnNameSpace" size="80" value="<%=crnSettingsAndCredentials.getCrnCredentials().getNamespace()%>"/>
                      </td>
                   </tr>
                   <tr>
                      <td>
                         <span class="labelText">UserID</span>
                      </td>
                      <td>
                         <input disabled="disabled" type="text" name="crnUserId" size="80" value="<%=crnSettingsAndCredentials.getCrnCredentials().getUsername()%>"/>
                      </td>
                   </tr>
                   <tr>
                      <td>
                         <span class="labelText">Password</span>
                      </td>
                      <td>
                         <input disabled="disabled" type="text" name="crnPassword" size="80"/>
                      </td>
                   </tr>
                   <tr>
                      <td colspan="2">
                         <input disabled="disabled" name="verifyButton" type="button" value="verify" onclick="javascript:verifyCredentials();"/>
                      </td>
                   </tr>
                </table>
             </div>
          </div>

       </form>
   </div>



   <div id="promptArea">
      <input type="button" name="renderPromptButton" value="render prompt" onclick="javascript:renderPromptToIframe()"/>
      <input type="button" name="renderPromptButton" value="render prompt in new window" onclick="javascript:renderPromptToNewWindow()"/>
      <br/>

      <iframe id="promptIframe" src="about:blank"></iframe>
   </div>



   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>
