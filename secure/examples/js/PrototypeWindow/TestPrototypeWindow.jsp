<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


   <style type="text/css">
      @import "<%=request.getContextPath()%>/scripts/rcl/windows_js/themes/default.css";
      @import "<%=request.getContextPath()%>/scripts/rcl/windows_js/themes/spread.css";
      @import "<%=request.getContextPath()%>/scripts/rcl/windows_js/themes/alert.css";
      @import "<%=request.getContextPath()%>/scripts/rcl/windows_js/themes/alert_lite.css";
      @import "<%=request.getContextPath()%>/scripts/rcl/windows_js/themes/alphacube.css";


      @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";

      body {
         font-family:Verdana, Helvetica, sans-serif;
         font-size:10pt;
         margin: 15px;
      }

   </style>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Base.js"></script>
   
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/windows_js/javascripts/effects.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/windows_js/javascripts/window.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/windows_js/javascripts/window_effects.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/windows_js/javascripts/debug.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dashboard/Dashboard.js"></script>



   <script type="text/javascript" xml:space="preserve">


      function initUi()
      {
      }

      function windowWithUrl()
      {
         var win = new Window({className: "alphacube", title: "Simple Window Test", top:70, left:100, width:300, height:200, url: "http://www.cognos.com", showEffectOptions: {duration:2.5}})
         win.show();
      }

      function dashBoardWidget(aTitle, aUrl)
      {
         var win = new DashboardWidget({className: "alphacube", title: aTitle, top:70, left:100, width:300, height:200, url: aUrl, showEffectOptions: {duration:2.5}})
         win.show();
      }

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
         initUi();
      });


   </script>

</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <table>
      <tr>
         <td><img src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">Prototype Window Example</span></td>
      </tr>
   </table>
   <br/>


   <p>
   Description: test prototype window.</p>


   <hr/>

   <ul>
      <li><a href="javascript:windowWithUrl();">Default Prototype Window</a></li>
      <li><a href="javascript:dashBoardWidget('cognos', 'http://www.cognos.com');">Dashboard Widget - Cognos</a></li>
      <li><a href="javascript:dashBoardWidget('google', 'http://www.google.com');">Dashboard Widget - Google</a></li>
      <li><a href="javascript:dashBoardWidget('rcl layers', 'http://scm.seekfocus.com/projects/rcl2/attachment/wiki/WikiStart/RCL-Stack.png?format=raw');">Dashboard Widget - SCM</a></li>
   </ul>



   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>