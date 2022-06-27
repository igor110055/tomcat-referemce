<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>

<style type="text/css">
   @import "<%=request.getContextPath()%>/styles/rcl/DropShadow.css";
   @import "<%=request.getContextPath()%>/styles/rcl/FadeMessage.css";
   @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";

   body {
      font-family:Verdana, Helvetica, sans-serif;
      font-size:10pt;
      margin: 15px;
   }

</style>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserSniffer.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/FadeMessage.js"></script>

<script type="text/javascript">

var opNumber = 1;
function someSampleOperation()
{
   FadeMessageController.getInstance().showFadeMessage("The following reports have been submitted:" +
   "<ul>" +
   "<li>Active Head Count by Manager #" + (opNumber++) + "</li>" +
   "<li>Global Sales #" + (opNumber++) + "</li>" +
   "<li>Cost of Goods #" + (opNumber++) + "</li>" +
   "</ul>", 3000);

//   FadeMessageController.getInstance().showFadeMessage('The Selected Report Profiles have been Deleted.<ul><li>Top 30 Products, by Margin</li></ul>', 4000);
}

</script>


</head>

<body class="rclBody">

   <table>
      <tr>
         <td><img src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">FadeMessage Example</span></td>
      </tr>
   </table>
   <br/>


   <p>
   Description: This example demonstrates usage of the FadeMessage class.</p>


   <hr/>


   <div>
      <a href="javascript:someSampleOperation()">Show a Fade Message</a>
   </div>
   <div>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
   </div>


   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>
</body>

</html>