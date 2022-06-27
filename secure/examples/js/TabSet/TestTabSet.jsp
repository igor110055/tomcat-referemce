<html>
<head>
<title>TabSet Test</title>
<style type="text/css">
   @import "../common/JsExamples.css";
   @import "<%=request.getContextPath()%>/styles/rcl/tabSet.css";


   /* <![CDATA[ */
   body {
       font: 12px / 1.6 "Lucida Grande", LucidaGrande, Verdana, sans-serif;
       margin: 0 40px;
   }

   h1 {
       height: 168px;
       background: white url( /taglibs/images/title.png ) center center no-repeat;
   }

   h1 span {
       display: none;
   }

   var {
       font: 12px Monaco, monospace;
       color: black;
   }

   code {
       display: block;
       white-space: pre;
       font: 12px Monaco, monospace;
       line-height: 20px;
       border: 1px solid gray;
       padding: 8px;
       margin: 15px 20px;
       color: black;
       background-color: #eee;
       overflow-x: scroll;
       overflow:-moz-scrollbars-horizontal;
   }

   #valid-wrap {
       position: absolute;
       right: 40px;
       top: 20px;
   }

   #valid-wrap a:link img,
   #valid-wrap a:visited img {
       width: 88px;
       height: 31px;
       border: 0;
   }

   /* ]]> */
</style>



<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserSniffer.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/TabSet.js"></script>

<script type="text/javascript">
    function initialize() {
        var tabSet = new TabSet();
        tabSet.createAndAddTab("novell", "Novell.com", "http://www.novell.com");
        tabSet.createAndAddTab("netflix", "NetFlix.com", "http://www.netflix.com");
        tabSet.createAndAddTab("microsoft", "Microsoft.com", "http://www.microsoft.com");

        var insertionPoint = document.getElementById("tabPaneInsertionPoint");
        tabSet.insertIntoDocument(document, insertionPoint);

        tabSet.selectFirstTab();

        tabSet.createAndAddTab("apple", "Apple.com", "http://www.apple.com");
    }
</script>
</head>

<body onload="initialize()">

   <table>
      <tr>
         <td><img src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">TabSet Example</span></td>
      </tr>
   </table>


   <p>Description: This example demonstrates how to use the TabSet component.</p>
   <hr/>
   <br/>

   <div id="tabPaneInsertionPoint">
   </div> <!-- tabPaneInsertionPoint -->


   <hr/>

   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>


</body>
</html>