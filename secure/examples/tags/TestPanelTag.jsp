<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title>Test Panel Tag</title>
   
   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/panel/panel-common.css";
      <%--@import "<%=request.getContextPath()%>/styles/rcl/panel/default/panel-skin.css";--%>
      @import "<%=request.getContextPath()%>/styles/rcl/panel/red/panel-skin.css";
      
      body {
         font-family:Verdana, Helvetica, sans-serif;
         font-size:10pt;
         margin: 15px;
      }

      #panel1 {
         width: 500px;
         float: left;
      }

      #panel1 .propertyLabel {
         width: 120px;
      }

      
      #panel2 {
         width: 300px;
         float:left;
      }

      #parameterPanel {
         width: 300px;
         /*height: 100px;*/
      }
   </style>



   <script type="text/javascript" xml:space="preserve">
   </script>

</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <table>
      <tr>
         <td><img alt="focus logo" src="<%=request.getContextPath()%>/secure/examples/js/focus-logo.png"/></td>
         <td><span class="exampleTitle">RCL Panel Tag Test</span></td>
      </tr>
   </table>



   <p>
   Description: Test the panel tags.</p>


   <hr/>


   <rcl:panel styleId="panel1" title="General Properties">

      <div class="property">
         <div class="propertyLabel">Report Profile Name:</div>
         <div class="propertyValue">Product Catalog - Lots</div>
      </div>
      
      <div class="property">
         <div class="propertyLabel">Target Report Path:</div>
         <div class="propertyValue">/public/content/RCL Gosl Examples/Product Catalog</div>
      </div>

      <div class="property">
         <div class="propertyLabel">Custom Prompt:</div>
         <div class="propertyValue">Product Hierarchy Prompt</div>
      </div>

   </rcl:panel>

   <rcl:panel styleId="panel2" title="Sample Panel #2">
      this is the body of panel nubmer two <br/>
      Item #1<br/>
      Item #2<br/>
      Item #3<br/>
      Item #4<br/>
   </rcl:panel>

   <div style="clear:both"></div>

   <rcl:panel styleId="parameterPanel" title="Parameters">

     <div class="scrollDiv" style="height:120px;">
        <table>
          <thead>
            <tr>
              <th style="width:100px">Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Product</td>
              <td>
                Bear Survival Edge<br/>
                Bear Survival Edge<br/>
                Bear Survival Edge<br/>
                Bear Survival Edge<br/>
                BugShield ExtremeExtreme<br/>
                BugShield Extreme<br/>
                BugShield Extreme<br/>
                BugShield Extreme<br/>
                BugShield Lotion<br/>
                BugShield Lotion<br/>
                BugShield Lotion<br/>
                BugShield Lotion Lite<br/>
                BugShield Lotion Lite<br/>
                BugShield Lotion Lite<br/>
                BugShield Lotion Lite<br/>
                BugShield Lotion Lite<br/>
                Calamine Relief<br/>
                Bear Survival Edge<br/>
                Bear Survival Edge<br/>
                Bear Survival Edge<br/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


   </rcl:panel>



   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>