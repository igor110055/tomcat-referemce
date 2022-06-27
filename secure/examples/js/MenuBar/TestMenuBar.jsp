<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">

<head>

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/MenuBar.css";
      @import "<%=request.getContextPath()%>/styles/rcl/DropShadow.css";
      @import "../common/JsExamples.css";


      div.floatLeft {
         float: left;
      }


         /* hack : IE Dropshadow Hack - the first menu group gets the same bg color as the
            container for some reason, for now we just set the bg of the container to the same
            as the menu group */

      div.mgMenuGroupContainer {
         background-color:#4A7DAD !important;
      }

      #menuContainerDiv {
         float: left;
         width: 200px;
         border: 1px solid black;
      }
   </style>



<style type="text/css">




/* local example specific styles... */

#menuContainerDiv {
   width:190px;

   border-style:solid;
   border-width:1px;
   border-color: black;

   display:block;
}


#exampleDiv {
   width:100%;
   display:block;
   float:none;
}

#statusDisplayDiv {

   border-style:none;
   border-width:1px;
   border-color: black;

   position:relative;
   display:block;
}

#currentlySelectedItemSpan {
   padding-left:20px;
   padding-top:20px;
   color:red;
   font-size:11pt;
   font-weight:bold;
}


</style>


<%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
<%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/MenuBar.js"></script>


</head>



<body onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">



   <table>
      <tr>
         <td><img src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">MenuBar Example</span></td>
      </tr>
   </table>
   <br/>



   <p>
   Description: This example demonstrates usage of the the MenuBar.</p>
   <p>
   This menubar is similar the collapsible menus seen in Windows XP (e.g. left hand side of the control panel or search applet).
   </p>

   <p>Here is a <a href="UMLClassDiagram.png">UML Diagram</a> of the MenuBar JavaScript Classes</p>

   <p>
   Each MenuItem can support an Icon for selected and non-selected.  You can also have MenuItems with no icon.
   </p>

   <hr/>
   <br/>






   <!------------------------------------------------------------------------------->
   <!-- BEGIN EXAMPLE                                                             -->
   <!------------------------------------------------------------------------------->
   <div id="exampleDiv">
      <div id="menuContainerDiv">
         <!-- menubar will be inserted here -->
      </div>

      <div id="statusDisplayDiv">
         <br/>
         <span id="currentlySelectedItemSpan">No menu item currently selected.</span>
         <br/>

      </div>
   </div>


   <script type="text/javascript">

   //--- Here we're just constructing the menu programmatically, via javascript...

   var menuBar = new MenuBar ("menuContainerDiv", "<%=request.getContextPath()%>");


   //-------------------------------------------------------------------------
   //--- First Menu Group
   //-------------------------------------------------------------------------
   var group = menuBar.createGroup ("Regions", "REGIONS", true, "miSelectedItem", "miNonSelectedItem");

   group.css.itemSelectedIcon = "<%=request.getContextPath()%>/images/folder_open.gif";
   group.css.itemNonSelectedIcon = "<%=request.getContextPath()%>/images/folder_closed.gif";



   // All Regions has a special icon...
   var menuItem = group.addItem(new MenuItem("All Regions", "All Regions", "menuItemSelected('All Regions');"));
   menuItem.css.selectedIcon = "<%=request.getContextPath()%>/images/folder_open.gif";
   menuItem.css.nonSelectedIcon = "<%=request.getContextPath()%>/images/folder_closed.gif";



   group.addItem(new MenuItem("Asia", "Asia", "menuItemSelected('Asia');"));
   group.addItem(new MenuItem("Australia", "Australia", "menuItemSelected('Australia');"));
   group.addItem(new MenuItem("Europe", "Europe", "menuItemSelected('Europe');"));
   group.addItem(new MenuItem("North America", "North America", "menuItemSelected('North America');"));

   group.addItem(new MenuItem("South America", "South America", "menuItemSelected('South America');"));



   //-------------------------------------------------------------------------
   //--- Foods Menu Group...
   //-------------------------------------------------------------------------
   group = menuBar.createGroup("Foods", "FOODS", false, "miSelectedItem", "miNonSelectedItem");

   group.css.itemSelectedIcon = "<%=request.getContextPath()%>/images/folder_open.gif";
   group.css.itemNonSelectedIcon = "<%=request.getContextPath()%>/images/folder_closed.gif";


   menuItem = new MenuItem("Vegetables", "Vegetables", "menuItemSelected('Vegetables');");

   group.addItem(menuItem);

   menuItem.addChild(new MenuItem("Corn", "Corn", "menuItemSelected('Corn');"));
   menuItem.addChild(new MenuItem("Squash", "Squash", "menuItemSelected('Squash');"));

   var potato = menuItem.addChild(new MenuItem("Potato", "Potato", "menuItemSelected('Potato');"));


   potato.addChild(new MenuItem("Russet", "Russet", "menuItemSelected('Russet');"));
   potato.addChild(new MenuItem("Sweet", "Sweet", "menuItemSelected('Sweet');"));


   menuItem = group.addItem(new MenuItem("Meats", "Meats", "menuItemSelected('Meets');"));

   menuItem.addChild(new MenuItem("Poultry", "Poultry", "menuItemSelected('Poultry');"));
   menuItem.addChild(new MenuItem("Beef", "Beef", "menuItemSelected('Beef');"));



   //-------------------------------------------------------------------------
   //--- Admin Menu Group...
   //-------------------------------------------------------------------------
   group = menuBar.createGroup("Admin", "ADMIN", false, "miSelectedItem", "miNonSelectedItem");

   group.css.itemSelectedIcon = "<%=request.getContextPath()%>/images/tag-small.png";
   group.css.itemNonSelectedIcon = "<%=request.getContextPath()%>/images/tag-small.png";

   group.addItem(new MenuItem("North America", "North America", "menuItemSelected('North America');"));
   group.addItem(new MenuItem("Europe", "Europe", "menuItemSelected('Europe');"));
   group.addItem(new MenuItem("Asia", "Asia", "menuItemSelected('Asia');"));
   group.addItem(new MenuItem("Australia", "Australia", "menuItemSelected('Australia');"));
   group.addItem(new MenuItem("South America", "South America", "menuItemSelected('South America');"));




   function initUi()
   {
      menuBar.insertIntoDocument();
   }

   function menuItemSelected (aName)
   {
      document.getElementById("currentlySelectedItemSpan").innerHTML = aName + " is currently selected";
   }


   DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
      initUi();
   });
      
   </script>


   <!------------------------------------------------------------------------------->
   <!-- END EXAMPLE                                                               -->
   <!------------------------------------------------------------------------------->

   <jsp:include page="../common/standardExampleFooter.jsp"/>







</body>

</html>
