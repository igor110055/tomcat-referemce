<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


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

   


</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <table>
      <tr>
         <td><img src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">JS Tooltips Example</span></td>
      </tr>
   </table>
   <br/>


   <p>
   Description: This example demonstrates the use of JS tooltips. Hover over one of
   the bullets below in order to see them work.</p>


   <hr/>
      <div onmouseover="return escape('this is a sample tooltip for item #1')">This is item #1</div>
      <div onmouseover="return escape('this is a sample tooltip for item #2')">This is item #2</div>
      <div onmouseover="return escape('this is a sample tooltip for item #3')">This is item #3</div>
      <div onmouseover="this.T_WIDTH=200;this.T_FONTCOLOR='#003399'; return escape('this is a sample tooltip for item #4')">Example with explicit formatting</div>

   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

<script type="text/javascript" xml:space="preserve" src="<%=request.getContextPath()%>/scripts/rcl/common/wz_tooltip.js"></script> 
</body>

</html>