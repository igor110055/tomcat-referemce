<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

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


      #dashboardPage1 {
         width:100%;
         height:500px;
      }
   </style>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Base.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/windows_js/javascripts/effects.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/windows_js/javascripts/window.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/windows_js/javascripts/window_effects.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/windows_js/javascripts/debug.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dashboard/Dashboard.js"></script>



   <script type="text/javascript" xml:space="preserve">

      var saved = [];
      var widgets = [];

      function initUi()
      {
         var widget1 = new DashboardWidget({className: "alphacube", title: "Quarterly Projections, By Division", top:155, left:13, width:500, height:300, url: "http://www.google.com", showEffectOptions: {duration:2.5}})
         widgets.push(widget1);
         widget1.show();

         var widget2 = new DashboardWidget({className: "alphacube", title: "2007 Capital Expenditures", top:155, left:538, width:500, height:300, url: "http://www.google.com", showEffectOptions: {duration:2.5}})
         widgets.push(widget2);
         widget2.show();
      }

      function reportGeometry()
      {
         var geom = '';

         for (var i = 0; i < widgets.length; ++i)
         {
            geom += "widget #" + i + " : " + widgets[i].getGeometry() + 
                    "<br/>";
         }

         $("report").innerHTML = geom;
      }

      function savePositions()
      {
         saved = [];
         var savedText = '';

         for (var i = 0; i < widgets.length; ++i)
         {
            saved.push(widgets[i].getGeometry());
            savedText += "widget #" + i + " : " + saved[i] + 
                         "<br/>";
         }

         $("saved").innerHTML = savedText;
      }

      function restorePositions()
      {
         for (var i = 0; i < widgets.length; ++i)
         {
            widgets[i].setGeometry(saved[i]);
         }
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
         <td><span class="exampleTitle">Dashboard Widget Example</span></td>
      </tr>
   </table>
   <br/>


   <p>
   Description: Test the dashboard widgets.</p>


   <hr/>

   <div id="dashboardPage1">

   </div>
   <div id="buttons">
      <input type="button" value="list current geometry" onclick="javascript:reportGeometry();"/>
      <input type="button" value="save current geometry" onclick="javascript:savePositions();"/>
      <input type="button" value="restore widgets to saved geometry" onclick="javascript:restorePositions();"/>
   </div>

   <div style="border:1px solid gray; padding:10px; margin:5px;">
      current geometry :
      <div id="report">
      </div>
   </div>

   <div style="border:1px solid gray; padding:10px;margin:5px;">
      saved geometry :
      <div id="saved">
      </div>
   </div>



   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>