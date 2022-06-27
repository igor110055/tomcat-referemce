<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">

<head>
   <title>JavaScript Examples</title>
   <meta name="GOOGLEBOT" content="noindex,nofollow">
   <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>

   <script src="TestJsListBoxUiController.js" type="text/javascript"></script>

   <link rel="StyleSheet" href="<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css" type="text/css"/>

   <script type="text/javascript">


      function Person(anEmail,aName)
      {
         this.email = anEmail;
         this.name = aName;
      }

      var users = new Object();

      function addNewUser(aPerson)
      {
         users[aPerson.email] = aPerson;
      }

      addNewUser(new Person("lhankins", "Lance Hankins"));
      addNewUser(new Person("dbequeaith", "Dan Bequeaith"));

      addNewUser(new Person("mthibeau", "Matt Thibeau"));
      addNewUser(new Person("nithy", "Nithyanand Palanivelu"));
      addNewUser(new Person("jjames", "Jonathan James"));
      addNewUser(new Person("mpatel", "Mehul Patel"));
      addNewUser(new Person("aowen", "Ann Owen"));
      addNewUser(new Person("lmoore", "Lynn Moore"));
      addNewUser(new Person("swallace", "Shawn Wallace"));
      addNewUser(new Person("hpatel", "Hemal Patel"));
      addNewUser(new Person("thilaga", "Thilaga Palanivelu"));
      addNewUser(new Person("mgupta", "Meenakshi Gupta"));


      //--- This JS Class is defined in the TestJsListBoxUiController.js file
      var uiController = new TestUiController(users);

      function initUi()
      {
         uiController.refreshAll();
      }
   </script>




</head>


<body onload="javascript:initUi()">


<table>
   <tr>
      <td><img src="../focus-logo.png"/></td>
      <td><span class="exampleTitle">JsListBox Example</span></td>
   </tr>
</table>
<br/>

<p>
Description: This example demonstrates usage of the JsListBox class.</p>
<p>
A JsListBox (DLB) is visually represented by an html &lt;select&gt; element.   Behind the scenes, the DLB is passed
a collection of objects, the dom id of some skeleton html &lt;select&gt; element, and a "field extractor" object, which
knows how to extract text and value properties from each item in the supplied collection (html &lt;select&gt; boxes expect
items with a text attribute for display, and a value attribute for submission).
</p>

<p>Here is a <a href="UMLClassDiagram.png">UML Diagram</a> of the JsListBox JavaScript Classes</p>

<p>
In this example, we have two DLB's which model "available" and "selected" concepts.   You can press the buttons below to
move items between the two lists (as well as shift items up, down, etc).   Take a look at the TestJsListBoxUiController.js
file, to see how the DLB's in this example are initialized.
</p>



<hr/>
<br/>

<table>
   <tr>
      <td class="label">Available Users</td>
      <td></td>
      <td class="label">Selected Users</td>
   </tr>
   <tr>
      <td>Filter:&nbsp;<input id="filterInput" type="text" onkeyup="uiController.changeLeftFilter();"></input></td>
      <td></td>
      <td></td>
   </tr>
   <tr>
      <td>
         <!-- This HTML Select Element will be Populated by the First JsListBox -->
         <select style="width:200px" multiple="true" size="12" id="leftHandList">
         </select>
      </td>
      <td align="center">
         <input type="button" value="up" onclick="uiController.shiftSelectedUp();"/><br/>
         <input type="button" value="down" onclick="uiController.shiftSelectedDown();"/><br/>
         <input type="button" value=">>" onclick="uiController.moveLeftToRight();"/><br/>
         <input type="button" value="<<" onclick="uiController.moveRightToLeft();"/><br/>

         <input type="button" value="refresh all" onclick="uiController.refreshAll();"/><br/>
         <input type="button" value="de-select all" onclick="uiController.deselectAll();"/><br/>
      </td>
      <td>
         <!-- This HTML Select Element will be Populated by the Second JsListBox -->
         <select style="width:200px" multiple="true" size="12" id="rightHandList">
         </select>
      </td>
   </tr>
</table>


<input type="button" value="List Left Selected" onclick="uiController.listLeftSelected();"/><br/>



<br/>


<!-- standard footer -->
<jsp:include page="../common/standardExampleFooter.jsp"/>

</body>



</html>