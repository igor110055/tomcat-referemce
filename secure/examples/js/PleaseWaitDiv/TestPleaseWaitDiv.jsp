<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>

<style type="text/css">
   @import "../common/JsExamples.css";
   @import "<%=request.getContextPath()%>/styles/rcl/pleaseWaitDiv.css";

   body {
      font-family:Verdana, Helvetica, sans-serif;
      font-size:10pt;
      margin: 15px;
   }

</style>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserSniffer.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/PleaseWaitDiv.js"></script>

<script type="text/javascript">

var pleaseWaitDiv;

function someSampleOperation()
{
   pleaseWaitDiv = new PleaseWaitDiv("mainContentDiv", "Please Wait, I'm Doing Something...");
   pleaseWaitDiv.begin();

   // this setTimeout is only present to simulate a long operation (not required)
   setTimeout("finishedOperation();", 3000);
}

function finishedOperation()
{
   pleaseWaitDiv.end();
}

</script>


</head>

<body class="rclBody">

   <table>
      <tr>
         <td><img src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">PleaseWaitDiv Example</span></td>
      </tr>
   </table>
   <br/>


   <p>
   Description: This example demonstrates usage of the PleaseWaitDiv class.</p>


   <hr/>


   <div>
      <a href="javascript:someSampleOperation()">Do Some Operation</a>
   </div>
   <div id="mainContentDiv">
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
      <p>content, blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah,  blah blah blah, blah blah blah, </p>
   </div>


   <hr/>

   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>