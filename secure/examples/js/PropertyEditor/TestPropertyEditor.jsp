<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>

   <title>RCL Js Example - PropertyEditor</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>
   

   <style type="text/css">
      @import "<%=request.getContextPath()%>/styles/rcl/propertyEditor.css";
      @import "../common/JsExamples.css";
   </style>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/PropertyEditor.js"></script>


   <script type="text/javascript">

      //--- Three different types of properties...
      var propertyTypeString = new PropertyType("string", new FreeTextValueProvider());
      var propertyTypeDelimiter = new PropertyType("delimiter", new ConstantValueProvider([new LabelValuePair("Yes / Commas", "commas"), new LabelValuePair("Yes / Decimal", "decimal"), new LabelValuePair("None", "none")]));
      var propertyTypeAlign = new PropertyType("align", new ConstantValueProvider([new LabelValuePair("Left", "left"), new LabelValuePair("Right", "right"), new LabelValuePair("Center", "center")]));


      //--- Declare and populate a property set
      var propertySet = new PropertySet();
      propertySet.addProperty(new Property("Field" , "Margin" ,propertyTypeString));
      propertySet.addProperty(new Property("Category" , "Product Sales" ,propertyTypeString));

      propertySet.addProperty(new Property("Decimal Places" , "2" ,propertyTypeString));
      propertySet.addProperty(new Property("Delimiter" , "Yes / Commas" ,propertyTypeDelimiter));

      propertySet.addProperty(new Property("Rounding" , "Truncate" ,propertyTypeString));
      propertySet.addProperty(new Property("Label Text" , "Product Margin" ,propertyTypeString));
      propertySet.addProperty(new Property("Width" , "1.6&quot;" ,propertyTypeString));
      propertySet.addProperty(new Property("Left Indent" , "0.9583&quot;" ,propertyTypeString));
      propertySet.addProperty(new Property("Line Number" , "2" ,propertyTypeString));
      propertySet.addProperty(new Property("Justify" , "Left" ,propertyTypeAlign));

      propertySet.getProperty("Category").isReadOnly = true;

      //--- Create the editor...
      var propertyEditor = new PropertySetEditor('psEditorIp', 'ps1', 'Report Properties', propertySet);


      var uiController = {
         initUi : function() {
            propertyEditor.insertIntoDocument();
         }
      };


      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
         uiController.initUi();
      });



      function getPropertySetToString()
      {
         var buf = "";

         var properties = propertySet.properties;

         var property;
         for(var i = 0; i < properties.length; ++i)
         {
            property = properties[i];
            buf += property.toString() + "\n"
         }

         return buf;
      }

      function showPropertyContent()
      {
         document.getElementById("debugLog").value = getPropertySetToString() + "\n\n" + document.getElementById("debugLog").value;
      }
   </script>



</head>

<body onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <table>
      <tr>
         <td><img alt="focus logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">PropertyEditor Example</span></td>
      </tr>
   </table>
   <br/>


   <p>Description: This example demonstrates the PropertyEditor widget.</p>


   <div id="psEditorIp">
   </div>

   <br><br>
   <div>
      <button onclick="showPropertyContent()">List ProperySet</button>
   </div>

   <div> Log: <br>
      <textarea id="debugLog" rows="17" cols="100"></textarea> <br>
      <button onclick='document.getElementById("debugLog").value = "";'>Clear Log</button>
   </div>


   <!-- standard footer -->

   <jsp:include page="../common/standardExampleFooter.jsp"/>
</body>

</html>