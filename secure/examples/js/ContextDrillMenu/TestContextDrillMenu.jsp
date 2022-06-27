<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   <%@ include file="/WEB-INF/pages/common/extIncludes.jsp"%>
   <!--<style type="text/css">-->
   <%--@import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";--%>
   <!--</style>-->
   <script type="text/javascript" src="<%=request.getContextPath()%>/secure/examples/js/ContextDrillMenu/ContextDrillMenu.js"></script>
   <script type="text/javascript">

      var itemHandler = function(item){alert('do drill to item: ' + item.text + ' (useValue=' + item.useValue + ")")};

      var myMenuFactory = new MenuFactory();


      /*
       * drill event handler
       */
      var drillEvent_hardCoded = function(event)
      {
//         alert('drill event');
         var drillContext = {
            contextId: event.target.id,
            showAt: event.getXY(),
            rerId: 3411
         }

         myMenuFactory.createMenu_hardCoded(drillContext);
         event.stopEvent();
      };

      /*
       * drill event handler
       */
      var drillEvent_ajax = function(event)
      {
//         alert('drill event');
         var drillContext = {
            contextId: event.target.id,
            itemHandler: itemHandler,
            showAt: event.getXY(),
            rerId: 3411,
            url: "<%=request.getContextPath()%>/secure/actions/drillContextMenu.do"
         }

         myMenuFactory.createMenu_ajax(drillContext);
         event.stopEvent();
      };

   Ext.onReady(function() {
         //menu-enable each drillable item
         var drillItems = Ext.select('p.drillItem_hardCoded');
         drillItems.each(function(){this.on('click', drillEvent_hardCoded);});

         var drillItems = Ext.select('p.drillItem_ajax');
         drillItems.each(function(){this.on('click', drillEvent_ajax);});
      });
   </script>

   <style type="text/css">
      p.drillItem_ajax,p.drillItem_hardCoded {
         color:blue;
         text-decoration:underline
      }
   </style>

   <title>Context Drill Menu</title>
</head>
<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

<table>
   <tr>
      <td><img src="../focus-logo.png"/></td>
      <td><span class="exampleTitle">Context Drill Menu Example</span></td>
   </tr>
</table>
<br/>


<p>
   Description: Context Drill Menu examples...</p>


<hr/>

<br/><br/>
<table border=1>
   <b>hard-coded context drill menu</b>
   <tr><td></td><td>col 1</td><td>col 2</td></tr>
   <tr><td><p class='drillItem_hardCoded' id='cat1'>Category 1</p></td><td>5</td><td>3.5</td></tr>
   <tr><td><p class='drillItem_hardCoded' id='cat2'>Category 2</p></td><td>7</td><td>9.2</td></tr>
</table>
<br/><br/>
<table border=1>
   <b>psuedo-ajax context drill menu</b>
   <tr><td></td><td>col 1</td><td>col 2</td></tr>
   <tr><td><p class='drillItem_ajax' id='cat3'>Category 3</p></td><td>5</td><td>3.5</td></tr>
   <tr><td><p class='drillItem_ajax' id='cat4'>Category 4</p></td><td>7</td><td>9.2</td></tr>
</table>




<!-- standard footer -->
<jsp:include page="../common/standardExampleFooter.jsp"/>

</body>
</html>