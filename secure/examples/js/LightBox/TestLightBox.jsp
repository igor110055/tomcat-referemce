<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/lightbox.css";
      @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";

      body {
         font-family:Verdana, Helvetica, sans-serif;
         font-size:10pt;
         margin: 15px;
      }

   </style>

   <script type="text/javascript" xml:space="preserve" src="<%=request.getContextPath()%>/scripts/rcl/common/lightbox.js"></script> 

</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <table>
      <tr>
         <td><img src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">LightBox Example</span></td>
      </tr>
   </table>
   <br/>


   <p>
   Description: This example demonstrates the lightbox modal dialog technique.</p>


   <hr/>
   <ul>
      <li><a href="dialog1.jsp" class="lbOn">launch dialog</a></li>
   </ul>

   
   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>