<html>
<head>
   <title>Testing ButtonBar</title>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";
      @import "<%=request.getContextPath()%>/styles/rcl/buttonBar.css";

      #buttonBarInsertionPoint a, #buttonBarInsertionPoint a:visited, #buttonBarInsertionPoint a:active
      {
         color:black;
         text-decoration:none;
      }

      #buttonBarInsertionPoint a:hover {
         text-decoration:none;
         background-color:yellow;
         font-weight:normal;
      }

      .testDriverDiv {
         font-family: arial;
         border: 1px solid #aaa;
         width: 800px;
         margin-top: 33px;
         height: 200px;
      }

      head:first-child+body .testDriverDiv {
         margin-top: 3px;
      }


   </style>

   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ButtonBar.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/IdeaMenus.js"></script>
   <script type="text/javascript">

      function ServerEnvironment() { }
      ServerEnvironment.baseUrl = location.protocol + '//' + window.location.host + '<%=request.getContextPath()%>';
      

      function initialize ()
      {
         var bbar = new ButtonBar("testBar");

         bbar.createAndAdd(IdeaMenus.fileMenu);
         bbar.createAndAdd(IdeaMenus.editMenu);
         bbar.createAndAdd(IdeaMenus.searchMenu);
         bbar.createAndAdd(IdeaMenus.viewMenu);
         bbar.createAndAdd(IdeaMenus.gotoMenu);
         bbar.createAndAdd(IdeaMenus.codeMenu);
         bbar.createAndAdd(IdeaMenus.analyzeMenu);
         bbar.createAndAdd(IdeaMenus.refactorMenu);
         bbar.createAndAdd(IdeaMenus.buildMenu);
         bbar.createAndAdd(IdeaMenus.helpMenu);

         var insertionPoint = document.getElementById("buttonBarInsertionPoint");
         bbar.insertIntoDocument(document, insertionPoint);

         var listener = {
            buttonClicked : function (anItem) {
               $('debugOutput').innerHTML += 'button clicked [' + anItem.id + ']<br/>';
            },
            itemClicked : function (anItem) {
               $('debugOutput').innerHTML += 'menu item clicked [' + anItem.name + ']<br/>';
            }
         };

         bbar.addButtonListener(listener);
         bbar.addMenuListener(listener);
      }


      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
         initialize();
      });

   </script>
</head>

<body onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">


   <table>
      <tr>
         <td><img alt="logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">Button Bar Example</span></td>
      </tr>
   </table>
   <br/>

   <p>
   Description: This example demonstrates usage of the ButtonBar Widget.</p>
   <hr/>



   <div id="buttonBarInsertionPoint">
      <!-- buttonBarInsertionPoint -->
   </div>


   <div class="testDriverDiv">
      <p>Example ButtonBar, shown above, mocking up the menu structure from Intellij Idea.</p>
      <div id="debugOutput">
      </div>
   </div>


   <hr/>
   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>


</body>

</html>