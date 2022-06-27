<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
<%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>


<style type="text/css">
   @import "<%=request.getContextPath()%>/styles/rcl/DivList.css";
   @import "../common/JsExamples.css";

   #divList1 div.divList {
      width: 300px;
   }

   #productLineDivList div.divList {
      width: 300px;
   }

   #productTypeDivList div.divList {
      width: 300px;
   }

   #productDivList div.divList {
      width: 300px;
   }

   *.floatLeft {
      float:left;
      margin: 4px;
   }
</style>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>

<%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp" %>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DivList.js"></script>

<script type="text/javascript">

   //--- simple tree, which supports multi-select...


   function Person(aId, aName)
   {
      this.id = aId;
      this.name = aName;
   }


   function createBigUsers(aUsers)
   {
      var multiplier = 100;
      var bigUsers = [];
      //new Array(aUsers.length * multiplier);

      for (var i = 0; i < multiplier; ++i)
      {
         for (var j = 0; j < aUsers.length; ++j)
         {
            bigUsers.push(new Person(aUsers[j].id + " #" + i, aUsers[j].name + " #" + i));
         }
      }

      return bigUsers;
   }

   // 21...
   var users = [
           new Person("lhankins", "Lance Hankins"),
           new Person("dbequeaith", "Dan Bequeaith"),
           new Person("mthibeau", "Matt Thibeau"),
           new Person("rmoore", "Roger Moore"),
           new Person("nithy", "Nithyanand Palanivelu"),
           new Person("jjames", "Jonathan James"),
           new Person("lmoore", "Lynn Moore"),
           new Person("thilaga", "Thilaga Palanivelu"),
           new Person("mgupta", "Meenakshi Gupta"),
           new Person("jsiler", "Jeremy Siler"),
           new Person("cwilliamson", "Cory Williamson"),
           new Person("wbalderamos", "William Balderamos"),
           new Person("thopkins", "Tony Hopkins"),
           new Person("jwieck", "Jerry Wieck"),
           new Person("amotamed", "Artie Motamed"),
           new Person("sallman", "Scott Allman"),
           new Person("mcleve", "Matt Cleve"),
           new Person("jrod", "Jackie Rodriguez"),
           new Person("gstener", "Gavin Stener"),
           new Person("cbowen", "Charles Bowen"),
           new Person("scockrell", "Sean Cockrell")
           ];


   var bigUsers = createBigUsers(users);


   var divList = new DivList(document, "divList1", "150px", 1000, bigUsers, new DivList.SimpleFieldExtractor("id", "name"), null);


   var productLineValueProvider = new CrnDialogValueProvider("/content/package[@name='GO Sales and Retailers']", "[gosales_goretailers].[Products].[Product line code]", "[gosales_goretailers].[Products].[Product line]", true, null, 23, null);
   var productLineDivList = new DivList(document, "productLineDivList", "150px", 1000, null, new DivList.SimpleFieldExtractor("value", "text"), productLineValueProvider);
   productLineDivList.emptyMessage = '(All Products)';

   var productTypeValueProvider = new CrnDialogValueProvider("/content/package[@name='GO Sales and Retailers']", "[gosales_goretailers].[Products].[Product type code]", "[gosales_goretailers].[Products].[Product type]", true, null, 23, null);
   productTypeValueProvider.addCascade(productLineDivList);
   var productTypeDivList = new DivList(document, "productTypeDivList", "150px", 1000, null, new DivList.SimpleFieldExtractor("value", "text"), productTypeValueProvider);
   productTypeDivList.emptyMessage = '(All Product Types)';

   var productValueProvider = new CrnDialogValueProvider("/content/package[@name='GO Sales and Retailers']", "[gosales_goretailers].[Products].[Product number]", "[gosales_goretailers].[Products].[Product name]", true, null, 23, null);
   productValueProvider.addCascade(productTypeDivList);
   var productDivList = new DivList(document, "productDivList", "150px", 1000, null, new DivList.SimpleFieldExtractor("value", "text"), productValueProvider);
   productDivList.emptyMessage = '(All Products)';


   function initUi()
   {
      divList.refreshView();
      productLineDivList.refreshView();
      productTypeDivList.refreshView();
      productDivList.refreshView();
   }

   DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
   {
      initUi();
      $("numItems").innerHTML = "Number of items : " + bigUsers.length;
   });

</script>

</head>


<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">


<table>
   <tr>
      <td><img src="../focus-logo.png"/></td>
      <td><span class="exampleTitle">DivList Example</span></td>
   </tr>
</table>
<br/>


<p>
   Description: This example demonstrates usage of the DivList class.</p>

<div id="exampleDiv">

   <div id="numItems"></div>
   <div>Load Test</div>
   <div id="divList1">
      <!-- list  inserted here... -->
   </div>


   <div id="productHierarchy">

      <div class="floatLeft">
         <div>Product Line</div>
         <div id="productLineDivList">
            <!-- list  inserted here... -->
         </div>
      </div>

      <div class="floatLeft">
         <div>Product Type</div>
         <div id="productTypeDivList">
            <!-- list inserted here... -->
         </div>
      </div>

      <div class="floatLeft">

         <div>Product Name</div>
         <div id="productDivList">
            <!-- list inserted here... -->
         </div>
      </div>

      <div style="clear:both"></div>
   </div>
</div>


<!-- standard footer -->

<jsp:include page="../common/standardExampleFooter.jsp"/>
</body>

</html>