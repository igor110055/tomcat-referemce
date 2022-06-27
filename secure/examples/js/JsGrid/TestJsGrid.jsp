<?xml version="1.0" encoding="UTF-8"?>


<html>
<head>

<title>JsGrid Example</title>
<%--

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/prototype.js"></script>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserSniffer.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsUtil.js"></script>

<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/DocumentLifeCycleMonitor.js" language="JavaScript"></script>


<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsGrid.js"></script>


--%>
<%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
<%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsGrid.js"></script>




<style type="text/css">
   @import "<%=request.getContextPath()%>/secure/examples/js/common/JsExamples.css";
</style>

<%-- include browser specific stylesheet for the grid... --%>
<script type="text/javascript">
   if (is_ie)
      document.write('<link rel="stylesheet" href="<%=request.getContextPath()%>/styles/rcl/ie/JsGrid.css" type="text/css"/>\n');
   else
      document.write('<link rel="stylesheet" href="<%=request.getContextPath()%>/styles/rcl/moz/JsGrid.css" type="text/css"/>\n');
</script>



<script type="text/javascript">

   //--- Sample class, a StockQuote
   function StockQuote (aSymbol, aName, aChange, aDailyRange, aShares, aSharePrice, aValue, aPaid, aGain)
   {
      this.symbol = aSymbol;
      this.name = aName;
      this.change = aChange;
      this.dailyRange = aDailyRange;
      this.shares = aShares;

      this.sharePrice = aSharePrice;
      this.value = aValue;
      this.paid = aPaid;
      this.gain = aGain;
   }

   StockQuote.prototype.toString = function()
   {
      return this.symbol;
   }



   var sampleQuotes = [
           new StockQuote("^DJI", "DOW JONES INDUSTR", "82.63", "10,593.94 - 10,695.92", "0", "10,678.56", "$0.00 ", "0", "$0.00"),
           new StockQuote("^IXIC", "NASDAQ COMPOSITE", "9.48", "2,164.41 - 2,177.23", "0", "2,175.51", "$0.00 ", "0", "$0.00 "),
           new StockQuote("AAGBX", "AIM AGGRESIVE GRO", "0.06", "N/A - N/A", "-", "10.23", "-", "-", "-"),
           new StockQuote("AAPL", "APPLE COMPUTER", "1.53", "49.79 - 51.35", "-", "51.31", "-", "-", "-"),
           new StockQuote("AGAAX", "AIM GLOBAL AGGRES", "0.21", "N/A - N/A", "-", "21.43", "-", "-", "-"),
           new StockQuote("AGTHX", "AMERICAN FDS GROW", "0.26", "N/A - N/A", "119.9", "29.96", "$3,592.20 ", "24.25", "$684.63 "),
           new StockQuote("AIVSX", "AMERICAN FDS INVE", "0.2", "N/A - N/A", "172.1759", "31.92", "$5,495.85 ", "29.04", "$495.87 "),
           new StockQuote("AKAM", "AKAMAI TECH INC", "0.09", "13.26 - 13.72", "0", "13.65", "$0.00 ", "2.9333", "$0.00 "),
           new StockQuote("AMD", "ADV MICRO DEVICES", "0.77", "23.10 - 24.03", "-", "23.85", "-", "-", "-"),
           new StockQuote("AMZN", "AMAZON.COM INC", "-0.01", "42.81 - 43.20", "0", "42.95", "$0.00 ", "15.23", "$0.00 "),
           new StockQuote("ANWPX", "AMERICAN FDS NEW ", "0.24", "N/A - N/A", "91.9499", "29.65", "$2,726.31 ", "21.75", "$726.40 "),
           new StockQuote("AV", "AVAYA INC", "-0.02", "9.89 - 10.05", "13", "10.01", "$130.13 ", "0", "$130.13 "),
           new StockQuote("AXP", "AMER EXPRESS INC", "0.83", "57.316 - 58.65", "0", "58.19", "$0.00 ", "0", "$0.00 "),
           new StockQuote("BRA.AS", "BAYER", "-1.55", "27.60 - 27.60", "0", "27.6", "$0.00 ", "0", "$0.00 "),
           new StockQuote("BEAS", "BEA SYSTEMS INC", "0.03", "8.92 - 9.19", "0", "9.12", "$0.00 ", "50.2999", "$0.00 "),
           new StockQuote("BLDP", "BALLARD POWER SYS", "0.68", "6.22 - 6.85", "-", "6.44", "-", "-", "-"),
           new StockQuote("C", "CITIGROUP INC", "0.17", "44.36 - 47.70", "0", "44.61", "$0.00 ", "0", "$0.00 "),
           new StockQuote("CAT", "CATERPILLAR INC", "0.53", "58.41 - 58.95", "0", "58.86", "$0.00 ", "35.125", "$0.00 "),
           new StockQuote("COGN", "COGNOS INC", "1.42", "40.44 - 42.00", "100", "41.92", "$4,192.00 ", "34.72", "$720.00 "),
           new StockQuote("COKE", "COCA COLA BOT CON", "0.57", "49.40 - 50.81", "0", "50.5", "$0.00 ", "0", "$0.00 "),
           new StockQuote("CSC", "COMPUTER SCIENCES", "0.13", "44.75 - 45.06", "0", "45", "$0.00 ", "0", "$0.00 "),
           new StockQuote("CSCO", "CISCO SYS INC", "0.21", "18.37 - 18.661", "60", "18.58", "$1,114.80 ", "67.4375", "($2,931.45)"),
           new StockQuote("CSITX", "AIM CONSTELLATION", "0.29", "N/A - N/A", "-", "26.04", "-", "-", "-"),
           new StockQuote("CTSH", "COGNIZANT TECH SO", "1.66", "46.31 - 48.38", "-", "48.35", "-", "-", "-"),
           new StockQuote("CTXS", "CITRIX SYSTEMS", "0.21", "24.57 - 24.97", "100", "24.97", "$2,497.00 ", "22.19", "$278.00 "),
           new StockQuote("DCX", "DAIMLERCHRYSLER A", "0.34", "51.66 - 52.25", "0", "52.1", "$0.00 ", "0", "$0.00 "),
           new StockQuote("DELL", "DELL INC", "0.08", "34.50 - 34.93", "0", "34.65", "$0.00 ", "19.8125", "$0.00 "),
           new StockQuote("EK", "EASTMAN KODAK CO", "0.73", "25.41 - 26.32", "0", "26.23", "$0.00 ", "57.5", "$0.00 "),
           new StockQuote("EXC", "EXELON CORPORATIO", "0.7", "54.87 - 55.73", "-", "55.66", "-", "-", "-"),
           new StockQuote("FILE", "FILENET CP", "0.27", "27.49 - 28.00", "0", "27.9", "$0.00 ", "17.98", "$0.00 "),
           new StockQuote("GM", "GEN MOTORS", "0.04", "32.40 - 32.69", "0", "32.44", "$0.00 ", "74.75", "$0.00 "),
           new StockQuote("GOOG", "GOOGLE", "3.7", "296.56 - 299.10", "-", "299.09", "-", "-", "-"),
           new StockQuote("HPQ", "HEWLETT PACKARD C", "-0.04", "27.68 - 27.98", "100", "27.81", "$2,781.00 ", "33.5625", "($575.25)"),
           new StockQuote("IBM", "INTL BUSINESS MAC", "0.64", "80.52 - 81.49", "0", "81.44", "$0.00 ", "0", "$0.00 "),
           new StockQuote("INTC", "INTEL CP", "-0.84", "25.189 - 25.87", "-", "25.25", "-", "-", "-"),
           new StockQuote("ITWO", "I2 TECHNOLOGIES", "0.17", "23.423 - 24.32", "0", "24.07", "$0.00 ", "0", "$0.00 "),
           new StockQuote("JPM", "JP MORGAN CHASE C", "0.18", "34.61 - 34.90", "0", "34.82", "$0.00 ", "110.875", "$0.00 "),
           new StockQuote("LMT", "LOCKHEED MARTIN C", "0", "62.64 - 63.00", "0", "62.75", "$0.00 ", "0", "$0.00 "),
           new StockQuote("LU", "LUCENT TECH INC", "0.04", "3.13 - 3.19", "260", "3.17", "$824.20 ", "29.87", "($6,942.00)"),
           new StockQuote("MSFT", "MICROSOFT CP", "-0.03", "26.53 - 26.82", "0", "26.58", "$0.00 ", "0", "$0.00 "),
           new StockQuote("NOK", "NOKIA CP ADS", "0.28", "16.10 - 16.27", "0", "16.21", "$0.00 ", "42.8125", "$0.00 "),
           new StockQuote("NT", "NORTEL NTWKS CP H", "0.05", "3.16 - 3.26", "0", "3.22", "$0.00 ", "0", "$0.00 "),
           new StockQuote("ORCL", "ORACLE CORP", "-0.09", "13.00 - 13.48", "760", "13.28", "$10,092.80 ", "19.83", "($4,978.00)"),
           new StockQuote("PG", "PROCTER GAMBLE ", "0.75", "56.08 - 57.21", "0", "56.9", "$0.00 ", "63.375", "$0.00 "),
           new StockQuote("QCOM", "QUALCOMM INC", "1.07", "41.36 - 42.96", "0", "42.81", "$0.00 ", "0", "$0.00 "),
           new StockQuote("QQQQ", "NASDAQ 100 TR SER", "0.219", "39.31 - 39.69", "180", "39.619", "$7,131.42 ", "-", "-"),
           new StockQuote("RTN", "RAYTHEON CO (NEW)", "-0.12", "39.00 - 39.29", "0", "39.08", "$0.00 ", "0", "$0.00 "),
           new StockQuote("RVSN", "RADVISION LTD", "0.1299", "11.8499 - 12.10", "-", "12.0599", "-", "-", "-"),
           new StockQuote("SBUX", "STARBUCKS CP", "0.18", "48.12 - 48.55", "0", "48.39", "$0.00 ", "0", "$0.00 "),
           new StockQuote("SCON", "SUPERCONDUCTOR TE", "0.01", "0.673 - 0.71", "30", "0.71", "$21.30 ", "51.5", "($1,523.70)"),
           new StockQuote("SUNW", "SUN MICROSYS INC", "0.02", "3.977 - 4.07", "0", "4", "$0.00 ", "0", "$0.00 "),
           new StockQuote("SYMC", "SYMANTEC CP", "0.3", "22.06 - 22.61", "-", "22.55", "-", "-", "-"),
           new StockQuote("TERN", "TERAYON COMMUN SY", "0.08", "3.41 - 3.67", "0", "3.62", "$0.00 ", "0", "$0.00 "),
           new StockQuote("TXN", "TEXAS INSTRUMENTS", "-0.01", "33.74 - 34.50", "0", "33.74", "$0.00 ", "24.95", "$0.00 "),
           new StockQuote("UIS", "UNISYS CP", "0.07", "6.95 - 7.10", "0", "7.04", "$0.00 ", "11.125", "$0.00 "),
           new StockQuote("LTE.PA", "VALTECH", "-0.05", "0.76 - 0.83", "-", "0.78", "-", "-", "-"),
           new StockQuote("VFINX", "VANGUARD INDEX TR", "0.9", "N/A - N/A", "101", "114.81", "$11,595.81 ", "101.6803", "$1,326.10 "),
           new StockQuote("VZ", "VERIZON COMMUN", "0.25", "32.42 - 32.80", "0", "32.73", "$0.00 ", "0", "$0.00 "),
           new StockQuote("WFC", "WELLS FARGO & CO ", "0.02", "59.74 - 59.99", "0", "59.82", "$0.00 ", "0", "$0.00 "),
           new StockQuote("WMT", "WAL MART STORES", "0.03", "44.90 - 46.12", "150", "45.89", "$6,883.50 ", "53.833", "($1,191.45)"),
           new StockQuote("WWWFX BLAH BLAH BLAH", "KINETICS FUND, TH", "-0.05", "N/A - N/A", "0", "24.3", "$0.00 ", "61.54", "$0.00 "),
           new StockQuote("YHOO", "YAHOO INC", "0.12", "33.0199 - 33.60", "-", "33.46", "-", "-", "-"),
           new StockQuote("ZIXI", "ZIX CORP", "-0.095", "2.35 - 2.55", "0", "2.445", "$0.00 ", "0", "$0.00")

   ];

   var gridDataProvider = {
      getSourceObjects : function () {
         return sampleQuotes;
      },

      populateRow : function (aQuote, aRow)
      {
         aRow.addCell (new Cell(aQuote.symbol));
         aRow.addCell (new Cell(aQuote.name));
         aRow.addCell (new Cell(aQuote.change));
         aRow.addCell (new Cell(aQuote.dailyRange));
         aRow.addCell (new Cell(aQuote.shares));
         aRow.addCell (new Cell(aQuote.sharePrice));
         aRow.addCell (new Cell(aQuote.value));
         aRow.addCell (new Cell(aQuote.paid));
         aRow.addCell (new Cell(aQuote.gain));
      }
   }



   var columnDescriptors = [
      new ColumnDescriptor("Symbol", true, DataType.STRING),
      new ColumnDescriptor("Stock", true, DataType.STRING),
      new ColumnDescriptor("Change", true, DataType.STRING),
      new ColumnDescriptor("Daily Range", false, DataType.STRING),
      new ColumnDescriptor("Shares", true, DataType.STRING),
      new ColumnDescriptor("Share Price", true, DataType.STRING),
      new ColumnDescriptor("Value", true, DataType.STRING),
      new ColumnDescriptor("Paid", true, DataType.STRING),
      new ColumnDescriptor("Gain", true, DataType.STRING)
   ];

   var grid = new JsGrid(document, "grid1", true, columnDescriptors, gridDataProvider);
   grid.imageDir = '<%=request.getContextPath()%>/images';

   function initUi()
   {
      grid.refreshView();
   }

   DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
      initUi();
   });


</script>



<style type="text/css">
   body {
      font-family:Verdana, Helvetica, sans-serif;
      font-size:11px;
      margin: 15px;
   }

   #grid1 {
      height: 325px;
      width: 1025px;
      border: 0px solid green;
   }

   /* IE Hack, overflow doesn't work correclty unless we have an absolute height on gridbody div*/
   #grid1 div.gridBody {
      height: 300px;
   }


   *.column-0 {
      width:75px;
   }

   *.column-1 {
      width:180px;
      background-color: threedlightshadow;
   }

   *.column-2 {
      width:85px;
      text-align:right !important;
   }

   *.column-3 {
      width:180px;
      text-align:center;
   }

   *.column-4 {
      width:85px;
      text-align:right;
   }

   *.column-5 {
      width:85px;
      text-align:right;
   }

   *.column-6 {
      width:85px;
      text-align:right;
   }

   *.column-7 {
      width:95px;
      text-align:right;
   }

   *.column-8 {
      width:95px;
      text-align:right;
   }
</style>

</head>

<body onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <table>
      <tr>
         <td><img alt="focus logo" src="../focus-logo.png"/></td>
         <td><span class="exampleTitle">JsGrid Example</span></td>
      </tr>
   </table>
   <p>
   Description: This example demonstrates example usage of the JsGrid class.  Key concepts you need
   to understand here :
   </p>
   <ul>
      <li>JsGrid</li>
      <li>ColumnDescriptor</li>
      <li>DataProvider</li>
   </ul>

   <p>Here is a <a href="UMLClassDiagram.png">UML Diagram</a> of the JsGrid related JavaScript Classes</p>


   <%-- BEGIN EXAMPLE CODE --%>
   <hr/>
   <div id="grid1" onselectstart="return false;">
      <!-- grid will be inserted here -->
   </div>

   <div style="margin-top:20px;">
      <input type="button" onclick="grid.refreshView();" value="refreshView"/>
      <input type="button" onclick="alert(grid.getSelectedRows().join('\n'));" value="getSelectedRows"/>
      <input type="button" onclick="alert(grid.getSelectedUserObjects().join('\n'));" value="getSelectedUserObjects"/>
   </div>
   <%-- END EXAMPLE CODE --%>



   <!-- standard footer -->
   <jsp:include page="../common/standardExampleFooter.jsp"/>

</body>

</html>
