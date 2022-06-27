<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<html>
<head>

   <title>Dialog Examples</title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   

   <!-- include commons for alert dialogs -->
   <%@ include file="/scripts/rcl/dialogs/DialogIncludes.jsp"%>



   <style type="text/css">
      @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";
   </style>

   <style type="text/css" xml:space="preserve">
      /*div.AlertContentArea div button*/
      /*{*/
        /*background-color: white;*/
        /*color: white;*/
        /*background-repeat: no-repeat;*/
        /*background-position: 0px 1px;*/
        /*border: none;*/
        /*background-image: url('/rcl/images/buttonBack84b.gif');*/
        /*height: 25px;*/
        /*width:84px !important;*/
         /*/*border : 1px solid red;*/*/
      /*}*/


   </style>

   <script type="text/javascript">

   function initUi()
   {
   }

   function alertWarningDialog()
   {
      DialogUtil.rclAlertWarning("Sample message for rclAlertWarning() test");
   };

   function alertDialog()
   {
      DialogUtil.rclAlert("Sample message for rclAlert() test, defaults to error icon");
   };

   function confirmOk()
   {
      alert("you clicked Ok");
   }

   function cancel()
   {
      alert("you clicked Cancel");
   }

   function confirmDialog()
   {
      DialogUtil.rclConfirm("<b>Sample rclConfirm()</b> <br> <br> Do you see this dialog?", confirmOk, cancel, "Confirm", "Yes", "No");
   }

   function promptOk(aReturn)
   {
//      debugger;
      alert("you clicked Ok with value [" + aReturn.value + "]");
   }

   function promptDialog()
   {
      DialogUtil.rclPrompt("<b>Sample rclPrompt()</b> <br> <br> What is your favorite color?", "blue", promptOk, cancel, "Prompt");
   }

   function selectDialog()
   {
      DialogUtil.rclSelect("<b>Sample rclSelect()</b> <br> <br> What is your favorite color?", ["1","2"], ["blue","red"],"2", promptOk, cancel, "Prompt", null, 10, 200);
   }

   </script>
</head>

<body onload="initUi();">
   <table>
      <tr>
         <td><img alt="focus logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">Dialog Example - rcl alert dialogs</span></td>
      </tr>
   </table>
   <p>
   Description: This example demonstrates example usage of rcl alert dialogs.
   </p>


   <%-- BEGIN EXAMPLE CODE --%>
   <hr/>
   <div>
      <a href="javascript:alertDialog()">Alert Dialog</a> ------> uses function DialogUtil.rclAlert (aMsg, aTitle, aIcon, aX, aY)
      <br>
      <a href="javascript:alertWarningDialog()">Alert Warning Dialog</a> ------> uses function DialogUtil.rclAlertWarning (aMsg, aTitle,aX, aY)
      <br>
      <a href="javascript:confirmDialog()">Confirm Dialog</a> ------> uses function DialogUtil.rclConfirm (aHtmlContent, aCallOK , aCallCancel, aTitle, aOKButtonLabel, aCancelButtonLabel, aIcon, aX, aY)
      <br>
      <a href="javascript:promptDialog()">Prompt Dialog</a> ------> uses function DialogUtil.rclPrompt (aHtmlContent, aDefaultValue, aCallOK, aCallCancel, aTitle, aIcon, aX, aY)
      <br>
      <a href="javascript:selectDialog()">Select Dialog</a> ------> uses function DialogUtil.rclSelect (aHtmlContent, aValueList, aDisplayList, aDefaultValue, aCallOK, aCallCancel, aTitle, aIcon, aX, aY)
      <br>
      <br>

      <pre xml:space="preserve">
   /**
    * alert simple string
    * aMsg is required, all other params are optional
    * aIcon defaults to error
    * aX and aY defaults to center
    */
   function DialogUtil.rclAlert (aMsg, aTitle, aIcon, aX, aY)

   /**
   * alert simple string as a warning
   * aMsg is required, all other params are optional
   */
   function DialogUtil.rclAlertWarning (aMsg, aTitle,aX, aY)

   /**
    * aHtmlContent           content to display in the comfirm dialog
    * aCallOK                call back function for ok button
    * aCallCancel            call back function for cacnel button (optional)
    * aTitle                 title fof the dialog (optional)
    * aOKButtonLabel         label of the ok button (optional)
    * aCancelButtonLabel     label of the ok button (optional)
    * aIcon                  icon for the dialog (optional)
    * aX                     position of the dialog (optional)
    * aY                     position of the dialog (optional)
   */
   DialogUtil.rclConfirm =  function (aHtmlContent, aCallOK , aCallCancel, aTitle, aOKButtonLabel, aCancelButtonLabel, aIcon, aX, aY)

   /**
    * aHtmlContent           content to display in the comfirm dialog
    * aDefaultValue          default value to display
    * aCallOK                call back function for ok button
    * aCallCancel            call back function for cacnel button (optional)
    * aTitle                 title fof the dialog (optional)
    * aIcon                  icon for the dialog (optional)
    * aX                     position of the dialog (optional)
    * aY                     position of the dialog (optional)
   */
   DialogUtil.rclPrompt =  function (aHtmlContent, aDefaultValue, aCallOK, aCallCancel, aTitle, aIcon, aX, aY)

   /**
    * aHtmlContent           content to display in the comfirm dialog
    * aValueList             list of values for the dropdown
    * aDisplayList           list of display text for the dropdown
    * aDefaultValue          default value to display
    * aCallOK                call back function for ok button
    * aCallCancel            call back function for cacnel button (optional)
    * aTitle                 title fof the dialog (optional)
    * aIcon                  icon for the dialog (optional)
    * aX                     position of the dialog (optional)
    * aY                     position of the dialog (optional)
   */
   DialogUtil.rclSelect =  function (aHtmlContent, aValueList, aDisplayList, aDefaultValue, aCallOK, aCallCancel, aTitle, aIcon, aX, aY)
   </pre>

   <textarea id="rclAlertTextArea" rows="15" cols="100">DialogUtil.rclAlert ("Sample message for testing alerts", "TestTitle", null, 50, 50);</textarea>
   <br>
   <button onclick="eval(document.getElementById('rclAlertTextArea').value)">Execute</button>


   </div>




   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>
