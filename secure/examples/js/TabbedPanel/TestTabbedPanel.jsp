<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   

   <script src="<%=request.getContextPath()%>/scripts/rcl/common/TabbedPanel.js" type="text/javascript"></script>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/tabbedPanel.css";
      @import "../common/JsExamples.css";


      #exampleAreaDiv
      {
         width:100%;
         height:50%;
         border-style:solid;
         border-width:1px;
         border-color:black;
         margin-top:10px;
      }

   </style>



</head>


<body onload="javascript:setupTabbedPanel();">


   <span class="exampleTitle">Tabbed Panel Example</span><br/>
   <p>
   Description: This example demonstrates usage of the TabbedPanel JavaScript class.</p>
   <p>
   The TabbedPanel class supports provides a simple tabbed interface, where each tab hosts
   a separate URL (via an IFrame).
   </p>

   <p>Here is a <a href="UMLClassDiagram.png">UML Diagram</a> of the TabbedPanel JavaScript Classes</p>

   <p>
   In the example below, we simply declare a TabbedPanel and then add 5 tabs to it, each of which
   hosts a different site.   Take a look at the source for this page - its VERY simple to use the
   TabbedPanel.
   </p>


   <hr/>
   <br/>



   <!------------------------------------------------------------------------------->
   <!-- BEGIN EXAMPLE                                                             -->
   <!------------------------------------------------------------------------------->


   <div id="exampleAreaDiv">
      <div id="tabbedPanelDiv" class="tabbedPanelOuterDiv">
         <!--  Tabs are inserted here... -->
      </div>



      <script type="text/javascript">

         var tabbedPanel;

         function setupTabbedPanel()
         {
            TabbedPanel.SHOW_LOADING_ICONS = true;
            TabbedPanel.IMAGE_DIR = ".";


            tabbedPanel = new TabbedPanel("tabbedPanel", "tabbedPanelDiv", null);

            tabbedPanel.addTab("Sun-Java", "http://java.sun.com/");
            tabbedPanel.addTab("W3C", "http://www.w3c.org");
            tabbedPanel.addTab("Cognos", "http://www.cognos.com");
            tabbedPanel.addTab("JGuru", "http://www.jguru.com");
            tabbedPanel.addTab("Experts Exchange", "http://www.experts-exchange.com/Web/Web_Languages/JavaScript/");
         }
      </script>
   </div>

   <!------------------------------------------------------------------------------->
   <!-- END EXAMPLE                                                               -->
   <!------------------------------------------------------------------------------->



   <!-- standard footer -->
   <hr/>
   <br/>
   <a href=".">List of Files Used in this Example</a><br/>
   <a href="../index.html">Back To Example Index</a>

   <div class="copyright">
   Copyright 2003-2006, Focus Technologies, LLC<br/>
   All Rights Reserved
   </div>


</body>



</html>

