<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<html>
<head>

   <title>CrnDialog Example - Value Picker Dialog</title>

   <%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
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
         width:80%;
      }

      #alternateConfigDiv {
         margin: 0px 0px 0px 30px;
         padding: 5px;
         border: 0px solid #AAAAAA;
         overflow: auto;
         font-size:11px;
      }

      #selectedValues {
         width:700px;

         font-family:Verdana, Helvetica, sans-serif;
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

   var currentSelections = null;

   function showValuePicker()
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
               var selectedValues = aPicker.selectedValues;
               currentSelections = [];
               var debugText = '';
               for (var i = 0; i < selectedValues.length; ++i)
               {
                  currentSelections.push(selectedValues[i]);
                  debugText += "[" + selectedValues[i].text + "] -> [" + selectedValues[i].value + "]\n";
               }
               document.forms[0].selectedValues.value = debugText;;

            }
         }
      };

      crnDialog.setDialogListener (dialogListener);

      crnDialog.showValuePickerDialog("Select Values",
                                      document.forms[0].queryItemRef.value,
                                      document.forms[0].displayValueRef.value,
                                      true,
                                      null, 
                                      document.forms[0].packagePath.value,
                                      document.forms[0].itemsPerPage.value,
                                      "displayValue",
                                      null,
                                      currentSelections,
                                      null,
                                      1000);
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
   </script>
</head>

<body onload="initUi();">
   <table>
      <tr>
         <td><img alt="focus logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">CrnDialog Example - Value Picker Dialog</span></td>
      </tr>
   </table>
   <p>
   Description: This example demonstrates example usage of the Value Picker CrnDialog.
   </p>


   <%-- BEGIN EXAMPLE CODE --%>
   <hr/>
   <div>
       <form action="#">

          <div>
             <table>
                <tr>
                   <td>
                      <span class="labelText">Query Item Value Ref:</span>
                   </td>
                   <td>
                      <input type="text" id="queryItemRef" name="queryItemRef" size="80" maxlength="256" value="[gosales_goretailers].[Products].[Product number]"/>
                   </td>
                </tr>
                <tr>
                   <td>
                      <span class="labelText">Display Value Ref:</span>
                   </td>
                   <td>
                      <input type="text" id="displayValueRef" name="displayValueRef" size="80" maxlength="256" value="[gosales_goretailers].[Products].[Product name]"/>
                   </td>
                </tr>
                <tr>
                   <td>
                      <span class="labelText">Package Path:</span>
                   </td>
                   <td>
                      <input type="text" id="packagePath" name="packagePath" size="80" maxlength="256" value="/content/package[@name='GO Sales and Retailers']"/>
                   </td>
                </tr>
                <tr>
                   <td>
                      <span class="labelText">Max Items Per Page:</span>
                   </td>
                   <td>
                      <input type="text" id="itemsPerPage" name="itemsPerPage" size="5" maxlength="10" value="100"/>
                   </td>
                </tr>
             </table>

             <input type="button" value="Pick Values" onclick="javascript:showValuePicker();"/>
             <br/>
             <br/>

             <span class="labelText">Result of dialog (shown below) :</span><br/>
             <textarea rows="10" cols="50" id="selectedValues">

             </textarea>
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



   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>
