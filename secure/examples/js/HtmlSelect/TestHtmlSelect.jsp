<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>

<style type="text/css">
   @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
   @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";
</style>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserSniffer.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>

<script type="text/javascript">

function initUi()
{

}

function listSelectedItems()
{
   var sel = new HtmlSelect(document.getElementById("mySelect"));
   alert(sel.getSelectedItems().join("\n"));
}

function resetSelectedItems()
{
   var sel = new HtmlSelect(document.getElementById("mySelect"));
   sel.resetSelectedItems (["1", "3", "5"]);
}


</script>

</head>

<body onload="initUi()">

   <table>
      <tr>
         <td><img src="../focus-logo.png" alt="logo"/></td>
         <td><span class="exampleTitle">HtmlSelect Example</span></td>
      </tr>
   </table>
   <br/>


   <p>
   Description: Testdriver for HtmlSelect.</p>


   <div id="exampleDiv">
      <table style="width:100%;">
         <tr>
            <td width="40%">
               <div>
                  <select id="mySelect" multiple="multiple" size="10">
                     <option value="1">One</option>
                     <option value="2">Two</option>
                     <option value="3">Three</option>
                     <option value="4">Four</option>
                     <option value="5">Five</option>
                     <option value="6">Six</option>
                     <option value="7">Seven</option>
                     <option value="8">Eight</option>
                     <option value="9">Nine</option>
                     <option value="10">Ten</option>
                  </select>
               </div>
            </td>
            <td style="vertical-align:top;align:left;">
               <div id="controls">
                  <ul>
                     <li><a href="javascript:listSelectedItems();">List Selected</a></li>
                     <li><a href="javascript:resetSelectedItems();">Reset Selected to 1,3,5</a></li>
                  </ul>
               </div>
            </td>
         </tr>
      </table>
   </div>



   <!-- standard footer -->

   <jsp:include page="../common/standardExampleFooter.jsp"/>
</body>

</html>