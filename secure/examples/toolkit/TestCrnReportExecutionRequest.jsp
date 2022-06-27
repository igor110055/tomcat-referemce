<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

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
   </style>


   <script type="text/javascript">

   var crnDialog = new CrnDialog();
   var useDefaultCredentials = true;

   function initUi()
   {
   }

   var currentSelection = null;

   function pickCrnPath()
   {
         crnDialog.credentials = null;

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



   function runSelectedReport()
   {
      var xpath = document.forms[0].currentFileSelection.value;
      var productLineParam = document.getElementById("productLine").value;
      document.getElementById("runFrame").src = ServerEnvironment.baseUrl +
         "/secure/examples/toolkit/RunReport.jsp?xpath=" + encodeURIComponent(xpath) + "&productLine=" + productLineParam;
   }
   </script>
</head>

<body onload="initUi();">
   <table>
      <tr>
         <td><img alt="focus logo" src="<%=request.getContextPath()%>/secure/examples/js/focus-logo.png"/></td>
         <td><span class="exampleTitle">Toolkit Example - Execute a Report...</span></td>
      </tr>
   </table>
   <p>
   Description: This example demonstrates example usage of the File Chooser CrnDialog.
   </p>


   <%-- BEGIN EXAMPLE CODE --%>
   <hr/>
   <div>
       <form action="#">

          <div>
             <span class="labelText">Selected File :</span>
             <input type="text" id="currentFileSelection" name="currentFileSelection" maxlength="256"/>
             <input type="button" value="..." onclick="javascript:pickCrnPath();"/>
          </div>

       </form>
   </div>


   <div>
      <span>Product Line Param </span><input type="text" id="productLine" name="productLine"/>
      <br/>
      <input type="button" value="Run the selected report" onclick="javascript:runSelectedReport();"/>

      <iframe style="width:100%; height:400px;"id="runFrame" src="<%=request.getContextPath()%>/secure/actions/blank.do">

      </iframe>

   </div>



   <!-- standard footer -->
   <jsp:include page="../js/common/standardExampleFooter.jsp"/>

</body>

</html>
