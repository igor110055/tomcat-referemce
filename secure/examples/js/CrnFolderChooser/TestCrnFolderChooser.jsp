<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<html>
<head>

   <title>CrnDialog Example - Folder Chooser</title>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   


   <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp"%>


   <style type="text/css">
      @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";

      #outputDiv {
         margin: 10px 30px 10px 30px;
         padding: 5px;
         border: 1px solid red;
         overflow: auto;
         font-size:11px;
      }

      #outputText {
         padding: 0px;
         border: 1px solid red;
         width:  900px;
         font-size:11px;
      }

   </style>


   <script type="text/javascript">

   function initUi()
   {
   }


   var currentSelection = null;

   function pickCrnPath()
   {
      var crnDialog = new CrnDialog();

      var dialogListener = {
         thisDoc : document,
         dialogFinished : function (aPicker) {
            if (aPicker.wasCancelled == false)
            {
               currentSelection = aPicker.selectedValues[0].id;
               document.forms[0].outputText.value = currentSelection;
            }


         }
      };

      crnDialog.setDialogListener (dialogListener);

      crnDialog.showFolderChooserDialog("Please Select a Folder",
                                        "/content",
                                        document.forms[0].outputText.value,
                                        false);
   }
   </script>
</head>

<body onload="initUi();">
   <table>
      <tr>
         <td><img alt="focus logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">CrnDialog Example - Folder Chooser</span></td>
      </tr>
   </table>
   <p>
   Description: This example demonstrates example usage of the Folder Chooser CrnDialog.
   </p>


   <%-- BEGIN EXAMPLE CODE --%>
   <hr/>
   <div>
      <a href="javascript:pickCrnPath()">Launch Folder Chooser Dialog</a>
   </div>
   <div>
      <h3>Currently Selected Items are:</h3>
      <%--<div id="outputDiv">none</div>--%>
       <form action="#">
          <input type="text" id="outputText" name="outputText" maxlength="256" />
       </form>

   </div>



   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>
