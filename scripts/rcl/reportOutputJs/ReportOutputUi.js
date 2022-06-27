
// $Id: ReportOutputUi.js 6847 2009-06-06 00:15:40Z lhankins $


//-----------------------------------------------------------------------------
/**
 *  Models a ReportSpecMarker
 *
 * @constructor
 * @author - Lance Hankins (lhankins@seekfocus.com)
 * @author - Chad Rainey (crainey@seekfocus.com)
 **/
function ReportSpecMarker(aRefItemName, aCssMarkerClass)
{
   this.refItemName = aRefItemName;
   this.cssMarkerClass = aCssMarkerClass;
   this.container = null;
   this.isHidden = false;
   this.isHighlighted = false;
}

ReportSpecMarker.prototype.hide = function()
{
   this.addClassOnElements("dataItemHide");
   this.isHidden = true;
};

ReportSpecMarker.prototype.unHide = function()
{
   this.removeClassFromElements("dataItemHide");
   this.isHidden = false;
};

ReportSpecMarker.prototype.highlight = function()
{
   this.addClassOnElements("dataItemHighlight");
   this.isHighlighted = true;
};

ReportSpecMarker.prototype.unHighlight = function()
{
   this.removeClassFromElements("dataItemHighlight");
   this.isHighlighted = false;
};

ReportSpecMarker.prototype.toggleVisibility = function()
{
   if (this.isHidden)
      this.hide();
   else
      this.unHide();
};

ReportSpecMarker.prototype.toggleHighlight = function()
{
   this.unHide();

   if (this.isHighlighted)
      this.unHighlight();
   else
      this.highlight();
};

ReportSpecMarker.prototype.addClassOnElements = function (aClass)
{
   var elements = this.getDomElements();

   for (var i = 0; i < elements.length; ++i)
   {
      elements[i].addClass(aClass);
   }
};

ReportSpecMarker.prototype.removeClassFromElements = function (aClass)
{
   var elements = this.getDomElements();

   for (var i = 0; i < elements.length; ++i)
   {
      elements[i].removeClass(aClass);
   }
};

ReportSpecMarker.prototype.getDomElements = function ()
{
   // TODO: this may need to switch on container type eventually
   var elements = Ext.DomQuery.select("div[class=" + this.cssMarkerClass + "]");
   var results = [];

   for (var i = 0; i < elements.length; ++i)
   {
      var valueCellQuery = "td[class^=mv],td[class^=cv],td[class^=ov]";
      var valueCells = Ext.DomQuery.select(valueCellQuery, elements[i].parentNode.parentNode);

      for (var j = 0; j < valueCells.length; ++j)
      {
         results.push(Ext.get(valueCells[j]));
      }

      results.push(Ext.get(elements[i].parentNode));
   }

   return results;
};



//-----------------------------------------------------------------------------
/**
 *  Models a ReportSpecContainer
 *
 * @constructor
 * @author - Lance Hankins (lhankins@seekfocus.com)
 * @author - Chad Rainey (crainey@seekfocus.com)
 **/
function ReportSpecContainer(aName, aSpecName, aType)
{
   this.markers = {};
   this.name = aName;
   this.specName = aSpecName;
   this.type = aType;
   this.itemsToUnwire = [];
   this.config = JsUtil.cloneObject(ReportSpecContainer.config);


   this.config.maxRows = (this.type == "crosstab" ? this.config.crosstab.defaultMaxRows :
                          this.config.list.defaultMaxRows);
}

ReportSpecContainer.prototype.addMarker = function (aMarker)
{
   this.markers[aMarker.refItemName] = aMarker;
   aMarker.container = this;
   return aMarker;
};

/**
 * hook called when the document is loaded...
 */
ReportSpecContainer.prototype.onDocumentLoad = function ()
{

   /*
      //--- We support report spec snippets like this, to override base config of each container...
      <script type="text/javascript">
      var adfReportConfig= {
         List1: {
            freezeRows:2,
            freezeColumns: 2,
            disableFreeze:true,
            maxRows: 9999
         }
       };
      </script>

    */


   if (typeof(adfReportConfig) != "undefined" && JsUtil.isGood(adfReportConfig[this.specName]))
   {
      var p;
      var specConfig = adfReportConfig[this.specName];
      for (var p in specConfig)
      {
         this.config[p] = specConfig[p];
      }
   }


};

/**
 * hook called when the document is unloaded...
 */
ReportSpecContainer.prototype.onDocumentUnload = function ()
{
   for (var i = 0; i < this.itemsToUnwire.length; ++i)
   {
      this.itemsToUnwire[i].unwire();
   }
};


ReportSpecContainer.prototype.hideAllReferencesTo = function (aRefItemName)
{
   var marker = this.markers[aRefItemName];

   if (marker)
   {
      marker.hide();
   }
};

ReportSpecContainer.prototype.unHideAllReferencesTo = function (aRefItemName)
{
   var marker = this.markers[aRefItemName];

   if (marker)
   {
      marker.unHide();
   }
};

ReportSpecContainer.prototype.highlightAllReferencesTo = function (aRefItemName)
{
   var marker = this.markers[aRefItemName];

   if (marker)
   {
      marker.highlight();
   }
};

ReportSpecContainer.prototype.unHighlightAllReferencesTo = function (aRefItemName)
{
   var marker = this.markers[aRefItemName];
   if (marker)
   {
      marker.unHighlight();
   }
};

ReportSpecContainer.prototype.hide = function ()
{
   this.addCssClassToContainer("dataItemHide");
};

ReportSpecContainer.prototype.unHide = function ()
{
   this.removeCssClassFromContainer("dataItemHide");
};


ReportSpecContainer.prototype.highlight = function ()
{
   this.addCssClassToContainer("dataItemHighlight");
};

ReportSpecContainer.prototype.unHighlight = function ()
{
   this.removeCssClassFromContainer("dataItemHighlight");
};


ReportSpecContainer.prototype.addCssClassToContainer = function (aClass)
{
   var containerElements = this.getContainerDomElements();
   for (var i = 0; i < containerElements.length; ++i)
   {
      containerElements[i].addClass(aClass);
   }
};

ReportSpecContainer.prototype.removeCssClassFromContainer = function (aClass)
{
   var containerElements = this.getContainerDomElements();
   for (var i = 0; i < containerElements.length; ++i)
   {
      containerElements[i].removeClass(aClass);
   }
};

ReportSpecContainer.prototype.getContainerDomElements = function ()
{
   var containerMarkers = Ext.DomQuery.select("div[class=adfMarker_" + this.name + "]");

   var containerElements = [];
   for (var i = 0; i < containerMarkers.length; ++i)
   {
      if (this.type == "block")
      {
         containerElements.push(Ext.get(containerMarkers[i].parentNode));
      }
      else
      {
         containerElements.push(Ext.get(containerMarkers[i].nextSibling));
      }
   }
   return containerElements;
};



ReportSpecContainer.freezeHeadersHtmlShell =
"     <table class=\"xt freezeHeaders\" id=\"fh_outer_table_${container_name}\" style=\"display:none\">\n" +
"         <tr>\n" +
"            <td align=\"left\" valign=\"top\" style=\"padding:0px\">\n" +
"               <div class=\"fhCorner\">\n" +
"                  <table class=\"xt\" id=\"corner_${container_name}\">\n" +
//" (CORNER)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"            <td align=\"left\" valign=\"top\" style=\"padding:0px\">\n" +
"               <div class=\"fhColumnEdges\">\n" +
"                  <table class=\"xt fhColumnEdges\" style=\"border-collapse:collapse\" cellpadding=\"0\" id=\"columnEdges_${container_name}\">\n" +
//" (COLUMN EDGES)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"         </tr>\n" +
"         <tr>\n" +
"            <td align=\"left\" valign=\"top\" style=\"padding:0px\">\n" +
"               <div class=\"fhRowEdges\">\n" +
"                  <table class=\"xt\" id=\"rowEdges_${container_name}\">\n" +
//" (ROW EDGES)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"            <td colspan=\"2\" valign=\"top\" rowspan=\"2\" style=\"padding:0px\">\n" +
"               <div class=\"fhCrosstabBody\">\n" +
"                  <table class=\"xt\" id=\"crosstabBody_${container_name}\">\n" +
//" (BODY HERE)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"         </tr>\n" +
"      </table>";



/**
 * this config object controls how the ReportSpecContainer does a few things...
 */
ReportSpecContainer.config = {
   crosstab : {
      assumedMaxRowEdges : 30,   /* used in greedy algorithm (maximum assumed number of row edges) */
      verticalSpacer : 90,      /* extra vertical space left during resize */
      horizontalSpacer: 42,      /* extra horizontal space left during resize */
      onResizeDelay : 300,       /* delay in milliseconds for reacting to resize */
      defaultMaxRows : 900      /* by default freeze headers will be disabled for crosstabs which have > this many rows */
   },
   list : {
      verticalSpacer : 100,      /* extra vertical space left during resize */
      horizontalSpacer: 30,      /* extra horizontal space left during resize */
      onResizeDelay : 300,       /* delay in milliseconds for reacting to resize */
      defaultMaxRows : 9000      /* by default freeze headers will be disabled for lists which have > this many rows */
   }
};



/**
 * freeze the headers on this container...
 */
ReportSpecContainer.prototype.freezeHeaders = function ()
{
   if (this.config.disableFreeze)
   {
      window.status = 'freeze headers disabled for [' + this.specName + ']';
      return;
   }


   if (this.type == "crosstab")
   {
      if (Ext.isIE)
      {
         this.freezeCrosstabHeaders();
      }
      else
      {
         alert("Freeze Crosstab Headers is not implemented for this browser");
      }
   }
   else if (this.type == "list")
   {
      if (Ext.isIE)
      {
         this.freezeListHeaders();
      }
      else
      {
         alert("Freeze List Headers is not implemented for this browser");
      }
   }
};


/**
 * freezes the headers on a crosstab (NOTE: this method is not meant to be called directly,
 * call the freezeHeaders instead, it will delegate to this method if the container is a
 * crosstab).
 *
 * @private
 */
ReportSpecContainer.prototype.freezeCrosstabHeaders = function()
{
   var startTime = new Date().getTime();
   window.status = "starting freeze headers...";

   /*
      Algorithm Steps :
      ---------------
      1. find the crosstab table, and collect a bit of information about it.
      2. calculate the widths + heights of the edge/measure border cells
      3. insert our replacement shell (just before the current crosstab table)
      4. move the crosstab "corner" to the shell replacement area (div1)
      5. move the crosstab "column edges" to the shell replacement area (div2)
      6. move the crosstab "row edges" to the shell replacement area (div3)
      7. move the crosstab body to the shell replacement area (div4)
      8. wire in the appropriate event handlers (scroll, resize)

   */


   ////////////////////////////////////////////////////////////////////////////
   // Step 1 : find the crosstab table, and collect a bit of information
   // about it.
   ////////////////////////////////////////////////////////////////////////////

   var marker = Ext.DomQuery.selectNode("div[class=adfMarker_" + this.name + "]");


   // NOTE: for reports with conditional formatting you may have an entire container that
   // is omitted due to the conditional style, in which case the HTML for this container
   // will be completely omitted (but the marker may still be present)

   if (!marker)
   {
      window.status = "no marker for [" + this.name + "]";
      return;
   }

   var originalXtTable = Ext.get(Ext.DomQuery.selectNode("table[class=xt]", marker.parentNode));

   if (!originalXtTable)
   {
      window.status = "no 'xt' table for [" + this.name + "]";
      return;
   }

   var originalXtTbody = originalXtTable.first("tbody");

   var totalNumberOfRows = originalXtTbody.dom.childNodes.length;
   //alert(this.name + ", num rows = [" + totalNumberOfRows  + "]");

   if (totalNumberOfRows > this.config.maxRows)
   {
      window.status = "freeze headers disabled for [" + this.specName + "] as it has [" + totalNumberOfRows + "] rows (max is set to " + this.config.maxRows + ")";
      return;
   }



   //--- determine the number of ColumnEdges and RowEdges, we do this by finding the first
   //    value cell, then measuring the distance backwards to the top (for the colEdges) or
   //    left (for the rowEdges)

   var firstValueCell = this.findFirstCrosstabValueCell(originalXtTbody.dom);

   //--- usually occurs when there's no data in the crosstab... see ticket #1214
   if (!firstValueCell)
   {
      window.status = "no value cells for [" + this.name + "]...";
      return;
   }

   var columnEdgeInfo = this.getColumnEdgeInfo(firstValueCell);
   var numColEdges = columnEdgeInfo.numberOfEdges;

   var rowEdgeInfo = this.getRowEdgeInfo(firstValueCell);
   var numRowEdges = rowEdgeInfo.numberOfEdges;

   //--- abort...
   if (numColEdges == 0 && numRowEdges == 0)
   {
      window.status = "can't determine edge info for [" + this.name + "]...";
      return;
   }

   originalXtTable.setDisplayed("none");


   ////////////////////////////////////////////////////////////////////////////
   // Step 2 : calculate the widths + heights of the edge/measure border cells
   ////////////////////////////////////////////////////////////////////////////


   var cellWidths = [];
   var firstValueRow = JsUtil.getNthSibling(originalXtTbody.dom.firstChild, numColEdges);

   var thisCell;
   var eachCell = firstValueRow.firstChild;
   var eachWidth;
   columnEdgeInfo.cumulativeWidth = 0;

   while (eachCell)
   {
      thisCell = Ext.fly(eachCell);
      if ('td' == thisCell.dom.tagName.toLowerCase() && !(eachCell.className == "ml" || eachCell.className == 'il' || eachCell.className == 'ol' || eachCell.className == 'xs') )
      {
         eachWidth = thisCell.getComputedWidth();
         cellWidths.push(eachWidth);
         columnEdgeInfo.cumulativeWidth += eachWidth;
      }
      eachCell = eachCell.nextSibling;
   }

   //--- capture the heights of each row in the first non-edge column...
   var rowHeights = [];

   var allRows = Ext.DomQuery.select("tr", originalXtTbody.dom);
   var height;
   var eachRow;

   var desiredXtBodyHeight = 0;

   for (var i = 0; i < allRows.length; ++i)
   {
      if (i < numColEdges)
         continue;

      eachRow = Ext.fly(allRows[i]);
      height = eachRow.getComputedHeight();
      rowHeights.push(height);

      //--- explicitly set the height to its current height...
      eachRow.setHeight(height);

      desiredXtBodyHeight += height;
   }

   var perfStatus = "[" + this.specName +"] (" + totalNumberOfRows + ") rows: s2 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;


   //--- lastly, capture the widths of the edge columns
   var rowEdgeColumnWidths = this.calculateTableColumnWidths(firstValueRow, numRowEdges);


   ////////////////////////////////////////////////////////////////////////////
   // Step 3 : insert our replacement shell (just before the current crosstab
   // table)
   ////////////////////////////////////////////////////////////////////////////

   var shell = ReportSpecContainer.freezeHeadersHtmlShell.replace(/\${container_name}/g, this.name);

   originalXtTable.insertHtml("beforeBegin", shell, true);


   ////////////////////////////////////////////////////////////////////////////
   // Step 4 : move the crosstab "corner" to the shell replacement area (div1)
   ////////////////////////////////////////////////////////////////////////////
   var xmCell = Ext.get(Ext.DomQuery.selectNode("tr/td[class=xm]", originalXtTbody.dom));

   if (!(xmCell))
   {
      xmCell = Ext.get(Ext.DomQuery.selectNode("tr/td[class=crosstabCorner]", originalXtTbody.dom));
   }

   var crosstabCornerWidth;

   if (xmCell)
   {
      crosstabCornerWidth = xmCell.getComputedWidth();

      var cornerIp = Ext.get("corner_" + this.name);
      cornerIp.setWidth(crosstabCornerWidth+2);
      cornerIp.setHeight(xmCell.getComputedHeight()+1);

      var cornerColGroup = {tag:'colgroup', children: []};
      for (var ci = 0; ci < rowEdgeColumnWidths.length; ++ci)
      {
         cornerColGroup.children.push( {tag:'col', span:'1', width:rowEdgeColumnWidths[ci]} )
      }

      var nestedTableBody = Ext.get(Ext.DomQuery.selectNode("table[class=tb]/tbody", xmCell.dom))
      if( nestedTableBody )
      {
         Ext.DomHelper.insertFirst(Ext.get(nestedTableBody.dom.parentNode), cornerColGroup);
      }

      var cornerHtml = "<tr>" + JsUtil.outerHTML(xmCell.dom) + "</tr>";
      xmCell.dom.parentNode.removeChild(xmCell.dom);

      var cornerTBody = {tag:'tbody', children:[]};
      JsUtil.clearChildNodes(cornerIp.dom);

      var cornerTBodyObj = Ext.DomHelper.append(cornerIp, cornerTBody, true);

      cornerTBodyObj.insertHtml("beforeEnd", cornerHtml);
   }
   else
   {
      crosstabCornerWidth = rowEdgeInfo.cumulativeWidth;
   }



   //--- Hang on to these, as we'll be using them quite a bit below...
   var columnEdgesTable = Ext.get("columnEdges_" + this.name, originalXtTable.parentNode);
   var columnEdgesDiv = Ext.get(columnEdgesTable.dom.parentNode);

   var rowEdgesTable = Ext.get("rowEdges_" + this.name);
   var rowEdgesDiv = Ext.get(rowEdgesTable.dom.parentNode);



   ////////////////////////////////////////////////////////////////////////////
   // Step 5 : move the crosstab "column edges" to the shell replacement area
   // (div2)
   ////////////////////////////////////////////////////////////////////////////
   var newRow;
   var newCell;

   //--- setup <thead> and <col> area...
   var colgroup = {tag:'colgroup', children:[]};

   //--- this adjustment is for ticket #1223
   var hackClientWidthAdjust = 1;
   for (var i = 0; i < cellWidths.length; ++i)
   {
      colgroup.children.push( {tag:'col', span:'1', width:cellWidths[i] + hackClientWidthAdjust} );
   }

   //--- hack to workaround ticket #1259.  The last column in the crosstab can sometimes have a
   //    a clientWidth that is 1 pixel too small.   I think this happens when the column labels
   //    are much larger than the column data (and this only happens on the last column).   Temporary
   //    workaround is to add 1 additional pixel width to the last <col> element
   if (colgroup.children.length > 0)
   {
      colgroup.children[colgroup.children.length - 1].width++;
   }

   var tbody = {tag:'tbody', children:[]};

   JsUtil.clearChildNodes(columnEdgesTable.dom);

   Ext.DomHelper.append(columnEdgesTable, colgroup);
   var newTbody = Ext.DomHelper.append(columnEdgesTable, tbody);


   for (var i = 0; i < numColEdges; ++i)
   {
      eachRow = originalXtTbody.dom.firstChild;
      var rowExtObj = Ext.get(eachRow);
      rowExtObj.setHeight(rowExtObj.getComputedHeight());
      eachRow.parentNode.removeChild(eachRow);
      newTbody.appendChild(eachRow);
   }

   perfStatus += ", s5 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;


   ////////////////////////////////////////////////////////////////////////////
   // Step 6 : move the crosstab "row edges" to the shell replacement area
   // (div3)
   ////////////////////////////////////////////////////////////////////////////
   var rowEdgeTbody = {tag:'tbody', children:[]};
   var newTr;

   var allExistingRows = Ext.DomQuery.select("tr", originalXtTbody.dom);

//   var nodesToRemove = [];

   JsUtil.clearChildNodes(rowEdgesTable.dom);

   // + 2 for 1px border on each side
   rowEdgesDiv.setWidth(crosstabCornerWidth+2);

   var rowEdgeColGroup = {tag:'colgroup', children: []};
   for (var i = 0; i < rowEdgeColumnWidths.length; ++i)
   {
      rowEdgeColGroup.children.push( {tag:'col', span:'1', width:rowEdgeColumnWidths[i]+2} )
   }

   Ext.DomHelper.append(rowEdgesTable, rowEdgeColGroup);
   var rowEdgeTboodyObj = Ext.DomHelper.append(rowEdgesTable, rowEdgeTbody, true);

   for (var i = 0; i < allExistingRows.length; ++i)
   {
      eachCell = allExistingRows[i].firstChild;

      if (!JsUtil.isGood(rowHeights[i]))
      {
         debugger;
      }

      newTr = { tag:'tr', style:{ height:rowHeights[i]}, children:[] };
      var newTrObj = Ext.DomHelper.append(rowEdgeTboodyObj, newTr, true);

      var lastCell = null;
      //--- normal edges = ml, summary edges = il or ol, spacer = xs
      while (eachCell && (eachCell.className == "ml" || eachCell.className == 'il' || eachCell.className == 'ol' || eachCell.className == 'xs'))
      {
         var nextCell = eachCell.nextSibling;
         eachCell.parentNode.removeChild(eachCell);
         newTrObj.dom.appendChild(eachCell);

         lastCell = eachCell;
         eachCell = nextCell;
      }
      // check to see if there was a marker in that last cell, if so copy it to the next one since they will no longer
      // be siblings.
      if( eachCell )
      {
         var markerDiv = Ext.DomQuery.selectNode("div[class^=adfRdiMarker]",lastCell);
         if( markerDiv )
         {
            Ext.DomHelper.insertHtml("afterBegin", eachCell, JsUtil.outerHTML(markerDiv));
         }
      }
   }


   perfStatus += ", s6 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;




   ////////////////////////////////////////////////////////////////////////////
   // Step 7 : move the crosstab body to the shell replacement area (div4)
   ////////////////////////////////////////////////////////////////////////////

   var xtBodyIp = Ext.get("crosstabBody_" + this.name);
   var xtBodyDiv = Ext.get(xtBodyIp.dom.parentNode);

   Ext.DomHelper.append(xtBodyIp, colgroup);

   originalXtTbody.dom.parentNode.removeChild(originalXtTbody.dom);
   xtBodyIp.dom.appendChild(allExistingRows[0].parentNode);


   perfStatus += ", s7 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;


//   debugger;

   ////////////////////////////////////////////////////////////////////////////
   // Step 8 : wire in the appropriate event handlers (scroll, resize)
   ////////////////////////////////////////////////////////////////////////////

   var shellElement = Ext.get("fh_outer_table_" + this.name);

   //--- using closure here so we don't have to retrieve the elements for each
   //    scroll event...
   var onScrollHandler = {
      config : this.config,
      columnEdgesDiv : columnEdgesDiv,
      rowEdgesDiv : rowEdgesDiv,
      xtBodyDiv : xtBodyDiv,
      shellElement : shellElement,
      desiredRowEdgeWidth: crosstabCornerWidth+4,
      desiredBodyWidth: columnEdgeInfo.cumulativeWidth+4,
      desiredBodyHeight: desiredXtBodyHeight,
      onScroll : function (anEvent, anElement, aOptions) {

         var left = this.xtBodyDiv.getScroll().left;
         var top = this.xtBodyDiv.getScroll().top;

         columnEdgesDiv.scrollTo("left", left, false);
         rowEdgesDiv.scrollTo("top", top, false);
      },
      onWindowResize : function (anEvent, anElement, aOptions) {

         var scrollBarWidth = 17;

         var body = Ext.getBody();

         var maxWidth = body.getComputedWidth() - (rowEdgesDiv.getComputedWidth() + this.config.crosstab.horizontalSpacer);
         var width = JsUtil.min(this.desiredBodyWidth + scrollBarWidth, maxWidth);

         var maxHeight = body.getComputedHeight() - (columnEdgesDiv.getComputedHeight() + this.config.crosstab.verticalSpacer);
         var height = JsUtil.min(this.desiredBodyHeight + scrollBarWidth, maxHeight);



         var extraWidthDueToScrollbar = 10;
         this.xtBodyDiv.setSize(width + extraWidthDueToScrollbar, height);

         var scrollBarWidthAllowance = 0;
         var scrollBarHeightAllowance = 0;
         if( this.xtBodyDiv.dom.clientHeight < this.xtBodyDiv.dom.scrollHeight )
         {
            scrollBarWidthAllowance = scrollBarWidth;
         }
         if( this.xtBodyDiv.dom.clientWidth < this.xtBodyDiv.dom.scrollWidth)
         {
            scrollBarHeightAllowance = scrollBarWidth;
         }



         this.rowEdgesDiv.setHeight(height - scrollBarHeightAllowance);
         this.columnEdgesDiv.setWidth(width + extraWidthDueToScrollbar - scrollBarWidthAllowance);
      },
      unwire : function() {
         this.columnEdgesDiv = null;
         this.rowEdgesDiv = null;
         this.xtBodyDiv = null;
      }
   };

   this.itemsToUnwire.push(onScrollHandler);

   xtBodyDiv.on('scroll', onScrollHandler.onScroll, onScrollHandler);
   Ext.EventManager.addListener(window, "resize", onScrollHandler.onWindowResize, onScrollHandler, {delay:this.config.crosstab.onResizeDelay});


   //--- set the display on the new shell to be visible...
   Ext.fly("fh_outer_table_" + this.name).setDisplayed(true);

   perfStatus += ", s8 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;


   //--- TODO: see if we can avoid this...
   onScrollHandler.onWindowResize(null, null, null);

   perfStatus += " --> total [" + (new Date().getTime() - startTime) + "] ms";
   window.status = perfStatus;
};


/**
 * find the first value cell in the desiganted crosstab
 * @param anXtBodyElement
 */
ReportSpecContainer.prototype.findFirstCrosstabValueCell = function (anXtBodyElement)
{
   /**
       Algorithm : Start with the first row and scan up to N cells looking for a TD
       that has a class we know is not an edge class.

       NOTE: "N" is a performance optimization (we could scan all cells, in the
       row, but that seems like waste for large crosstabs).

    */

   var eachRow = anXtBodyElement.firstChild;
   var eachCell;

   while (true)
   {
      //--- this can happen if you have a crosstab with no data (see ticket #1214)
      if (!eachRow)
      {
         return null;
      }
      eachCell = eachRow.firstChild;

      var i = 0;

      for (var i = 0; i < this.config.crosstab.assumedMaxRowEdges; ++i)
      {
         // xm and crosstab corner are just from corner
         if (!(eachCell.className == "ml" || eachCell.className == 'il' || eachCell.className == 'ol' || eachCell.className == 'xs' || eachCell.className == 'xm' || eachCell.className == 'crosstabCorner'))
         {
            // found it, we're done here...
            return eachCell;
         }

         eachCell = eachCell.nextSibling;

         if (!(eachCell))
            break;
      }


       eachRow = eachRow.nextSibling;
   }
};


/**
 * calculates some info on the row edges
 * @param aFirstValueCell
 */
ReportSpecContainer.prototype.getRowEdgeInfo = function (aFirstValueCell)
{
   var cumulativeWidth = 0;
   var edgeCount = 0;
   var eachCell = aFirstValueCell.previousSibling;

   var colspan;

   while(eachCell)
   {
      colspan = eachCell.colSpan;

      edgeCount += (colspan) ? parseInt(colspan) : 1;
      cumulativeWidth += Ext.fly(eachCell).getComputedWidth();

      eachCell = eachCell.previousSibling;
   }

   return {numberOfEdges: edgeCount, cumulativeWidth: cumulativeWidth };
};

/**
 * calculates some info on the column edges
 * @param aFirstValueCell
 */
ReportSpecContainer.prototype.getColumnEdgeInfo = function (aFirstValueCell)
{
   var cumulativeHeight = 0;
   var edgeCount = 0;


   var eachRow = aFirstValueCell.parentNode;

   var rowspan;

   while(eachRow.previousSibling)
   {
      edgeCount++;
      cumulativeHeight += Ext.fly(eachRow).getComputedHeight();

      eachRow = eachRow.previousSibling;
   }

   return {numberOfEdges: edgeCount, cumulativeHeight: cumulativeHeight };
};


/**
 * this method calculates the widths of individual columns in a table, accounting for
 * colspan and rowspan obstacles.   It does assume that any rowspans are on the far left
 * of the table (e.g. typical "group by's").
 *
 * @param aTableRow - a row in the table
 * @param aNumColumns - the number of columns you wish to calc (doesn't have to be the whole
 * width of the table)....
 * @return an array of column width values
 */
ReportSpecContainer.prototype.calculateTableColumnWidths = function (aTableRow, aNumColumns)
{
   var rowSpanDebt = [];
   var widths = [];
   var numMatches = 0;

   for (var i = 0; i < aNumColumns; ++i)
   {
      rowSpanDebt[i] = 0;
      widths[i] = 0;
   }


   //--- find a 1 colspan cell for each slot.

   var eachRow = aTableRow;
   var eachCell;
   var currentSpan;
   var eachCellColSpan;

   while (numMatches < aNumColumns && eachRow)
   {
      currentSpan = 0;

      //--- accumulate any rowSpanDebt onto currentSpan
      // NOTE: assuming rowspan debt, always to left (never gaps)
      for (var i = 0; i < aNumColumns; ++i)
      {
         if (rowSpanDebt[i] > 0)
         {
            currentSpan++;
            rowSpanDebt[i]--;
         }
      }

      eachCell = eachRow.firstChild;

      while (currentSpan < aNumColumns && eachCell)
      {
         eachCellColSpan = (eachCell.colSpan) ? parseInt(eachCell.colSpan) : 1;

         //--- found one, record the width of the current slot...
         if (eachCellColSpan == 1 && widths[currentSpan] == 0)
         {
            widths[currentSpan] = Ext.fly(eachCell).getComputedWidth();
            numMatches++;
         }

         //--- record any rowspan debt...
         if (eachCell.rowSpan)
         {
            var rowSpan = parseInt(eachCell.rowSpan);

            if (rowSpan > 1)
            {
               for (var i = 0; i < eachCellColSpan; ++i)
               {
                  rowSpanDebt[currentSpan + i] = rowSpan -1;
               }

            }
         }

         currentSpan += eachCellColSpan;
         eachCell = eachCell.nextSibling;
      }

      eachRow = eachRow.nextSibling;
   }

   return widths;
};


/**
 * somewhere in the middle of the freezeHeaders method, we decide we can't figured out something about
 * this crosstab.  This method just echos a message to the user and sets the display back.
 *
 * @param aXtTable
 * @param aMsg
 */
ReportSpecContainer.prototype.abortFreezeHeaders = function (aXtTable, aMsg)
{
   alert("Freeze Headers can't determine the structure of the crosstab [" + this.name + "], aborting, specific issue was : \n\n   " + aMsg );
   if (aXtTable)
   {
      aXtTable.applyStyles({display:'block'});
   }
};




//-----------------------------------------------------------------------------
/**
 *  UI Controller for showing/hiding list columns
 *
 * @constructor
 * @author - Lance Hankins (lhankins@seekfocus.com)
 * @author - Chad Rainey (crainey@seekfocus.com)
 **/
function ReportOutputUiController(aRerId)
{
   this.containers = [];
   this.rerId = aRerId;
}

ReportOutputUiController.prototype.addContainer = function (aContainer)
{
   this.containers.push(aContainer);
   return aContainer;
};

ReportOutputUiController.prototype.hideAllReferencesTo = function (aRefItemName)
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      this.containers[i].hideAllReferencesTo(aRefItemName);
   }
};

ReportOutputUiController.prototype.unHideAllReferencesTo = function (aRefItemName)
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      this.containers[i].unHideAllReferencesTo(aRefItemName);
   }
};

ReportOutputUiController.prototype.highlightAllReferencesTo = function (aRefItemName)
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      this.containers[i].highlightAllReferencesTo(aRefItemName);
   }
};

ReportOutputUiController.prototype.unHighlightAllReferencesTo = function (aRefItemName)
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      this.containers[i].unHighlightAllReferencesTo(aRefItemName);
   }
};

ReportOutputUiController.prototype.getContainerBySpecName = function (aSpecName)
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      if (this.containers[i].specName == aSpecName)
         return this.containers[i];
   }
   return null;
};

ReportOutputUiController.prototype.getContainerByAssignedName = function (aAssignedName)
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      if (this.containers[i].name == aAssignedName)
         return this.containers[i];
   }
   return null;
};

ReportOutputUiController.prototype.freezeAllHeaders = function ()
{
   //--- disable this if someone passes freezeHeaders=false as part of the URL...
   if (document.location.href.indexOf("freezeHeaders=false") != -1)
   {
      window.status = 'Freeze headers disabled';
      return;
   }


   for (var i = 0; i < this.containers.length; ++i)
   {
      this.containers[i].freezeHeaders();
   }
};





/**
 * renders a very simple UI for testing the hide / show capabilities
 */
ReportOutputUiController.prototype.renderTestUi = function ()
{
   if (this.isTestUiRendered)
      return;

   this.isTestUiRendered = true;

   var html = '<div id="hideShowControllerDiv">' +
              '<div id="hideShowControllerDivHandle">' +
              '<a href="javascript:reportOutputUiController.toggleTestUi();">+expand</a>' +
              '&nbsp;&nbsp;&nbsp;<a href="javascript:reportOutputUiController.destroyTestUi();">destroy</a>' +
              '</div>' +
              '<div id="hideShowControllerDivBody" style="display:none">';

   var eachContainer;
   var eachMarker;

   for (var i = 0; i < this.containers.length; ++i)
   {
      eachContainer = this.containers[i];
      html += '<table class="testUi">' +
              '<tr><td><h3>' + eachContainer.name + " (" + eachContainer.specName + ")</h3></td>" +
              '<td><a href="javascript:reportOutputUiController.containers[' + i + '].freezeHeaders()");">freeze headers</a></td>' +
              '<td><a href="javascript:reportOutputUiController.containers[' + i + '].hide()");">hide</a></td>' +
              '<td><a href="javascript:reportOutputUiController.containers[' + i + '].unHide()");">show</a></td>' +
              '<td><a href="javascript:reportOutputUiController.containers[' + i + '].highlight()");">HL</a></td>' +
              '<td><a href="javascript:reportOutputUiController.containers[' + i + '].unHighlight()");">UHL</a></td>' +
              '</tr>';


      for (var key in eachContainer.markers)
      {
         eachMarker = eachContainer.markers[key];

         html += "<tr><td>" + eachMarker.refItemName + "</td>" +
                 '<td><a href="javascript:reportOutputUiController.containers[' + i + '].hideAllReferencesTo(\'' + eachMarker.refItemName + '\');">hide</a></td>' +
                 '<td><a href="javascript:reportOutputUiController.containers[' + i + '].unHideAllReferencesTo(\'' + eachMarker.refItemName + '\');">show</a></td>' +
                 '<td><a href="javascript:reportOutputUiController.containers[' + i + '].highlightAllReferencesTo(\'' + eachMarker.refItemName + '\');">HL</a></td>' +
                 '<td><a href="javascript:reportOutputUiController.containers[' + i + '].unHighlightAllReferencesTo(\'' + eachMarker.refItemName + '\');">UHL</a></td>' +
                 '</tr>';
      }
      html += "</table><hr/>";
   }

   html += "</div></div>";

   var testUiDiv = document.createElement("div");
   testUiDiv.innerHTML = html;

   document.body.appendChild(testUiDiv);
   this.testUiExpanded = false;
};


/**
 * expand / collapse the test ui
 */
ReportOutputUiController.prototype.toggleTestUi = function ()
{
   var toggleAnchor = Ext.DomQuery.selectNode("div[id=hideShowControllerDivHandle] a");

   if (this.testUiExpanded)
   {
      toggleAnchor.innerHTML = "+expand";
      Ext.DomQuery.selectNode("div[id=hideShowControllerDivBody]").style.display = "none";
   }
   else
   {
      toggleAnchor.innerHTML = "-collapse";
      Ext.DomQuery.selectNode("div[id=hideShowControllerDivBody]").style.display = "block";
   }

   this.testUiExpanded = !this.testUiExpanded;
};


/**
 * wack the test ui div...
 */
ReportOutputUiController.prototype.destroyTestUi = function ()
{
   var testUiDiv = Ext.get("hideShowControllerDiv");
   testUiDiv.dom.parentNode.removeChild(testUiDiv.dom);

   this.isTestUiRendered = false;
};


/**
 * hook which is called when the report output document is ready...
 */
ReportOutputUiController.prototype.onDocumentReady = function ()
{
   this.defaultInit();
};

/**
 * hook which is called when the document is unloaded...
 */
ReportOutputUiController.prototype.onDocumentUnload = function ()
{
   for (var i = 0; i < this.containers.length; ++i)
   {
      this.containers[i].onDocumentUnload();
   }
};

ReportOutputUiController.prototype.showDebugRerScreen = function (aEvent, aElement, aOptions)
{
   // path will be something like : /rcl/secure/reportOutputs/5.HTML
   var path = document.location.pathname;
   var secondSlash = path.indexOf("/", 1);
   var contextName = path.substr(0, secondSlash);

   var debugRerUrl = document.location.protocol + '//' + document.location.host + contextName + "/secure/actions/debugRer.do?rerId=" + this.rerId;
   var debugRerWin = JsUtil.openNewWindow(debugRerUrl, "DebugRer_" + this.rerId, "width=1024,height=800,top=100,left=100,menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");
   debugRerWin.focus();
};


/**
 * show the same report output in a new window, but disable freezeHeaders...
 * @param aEvent
 * @param aElement
 * @param aOptions
 */
ReportOutputUiController.prototype.showOutputWithoutFreezeHeaders = function (aEvent, aElement, aOptions)
{
   // path will be something like : /rcl/secure/reportOutputs/5.HTML
   var path = document.location.pathname;
   var secondSlash = path.indexOf("/", 1);
   var contextName = path.substr(0, secondSlash);

   var newUrl = document.location.protocol + '//' + document.location.host + contextName + "/secure/reportOutputs/" + this.rerId + ".HTML?freezeHeaders=false";
   var newWindow = JsUtil.openNewWindow(newUrl, "RenderWithoutFreezeHeaders_" + this.rerId, "width=1024,height=800,top=100,left=100,menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");
   newWindow.focus();
};

/**
 * show hotkey help
 * @param aEvent
 * @param aElement
 * @param aOptions
 */
ReportOutputUiController.prototype.showHotKeyHelp = function (aEvent, aElement, aOptions)
{
   alert("ADF Report Output Hotkeys: \n\n" +
         "   <CTRL-ALT-SHIT-D> - Show RER Debug Screen\n" +
         "   <CTRL-ALT-SHIT-I> - Create an Incident Report Archive for this RER\n" +
         "   <CTRL-ALT-SHIT-S> - Show this Report Output without Static Headers\n" +
         "   <CTRL-ALT-SHIT-H> - Show this help message\n" +
         "\n\n");
};

/**
 * create an incident report archive for this RER
 * @param aEvent
 * @param aElement
 * @param aOptions
 */
ReportOutputUiController.prototype.createIncidentArchive = function (aEvent, aElement, aOptions)
{
   // path will be something like : /rcl/secure/reportOutputs/5.HTML
   var path = document.location.pathname;
   var secondSlash = path.indexOf("/", 1);
   var contextName = path.substr(0, secondSlash);

   var newUrl = document.location.protocol + '//' + document.location.host + contextName + "/secure/actions/createIncidentReportForSuccessfulReport.do?rerId=" + this.rerId;
   var newWindow = JsUtil.openNewWindow(newUrl, "CreateIncidentReportForSuccessfulRer_" + this.rerId, "width=256,height=256,top=100,left=100,menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");
   newWindow.focus();
};

/**
 * initialize
 */
ReportOutputUiController.prototype.defaultInit = function ()
{
   Ext.getDoc().on("unload", this.onDocumentUnload, this);

   for (var i = 0; i < this.containers.length; ++i)
   {
      this.containers[i].onDocumentLoad();
   }

   //--- install hotkeys (only an option if ext-all.js is included)...
   if (Ext.KeyMap)
   {
      var hotkeys = new Ext.KeyMap(document, [
         { key: 'd',
           ctrl: true,
           shift:true,
           alt:true,
           fn: this.showDebugRerScreen,
           scope: this },
         { key: 't',
           ctrl: true,
           shift:true,
           alt:true,
           fn: this.renderTestUi,
           scope: this },
         { key: 's',
           ctrl: true,
           shift:true,
           alt:true,
           fn: this.showOutputWithoutFreezeHeaders,
           scope: this },
         { key: 'i',
           ctrl: true,
           shift:true,
           alt:true,
           fn: this.createIncidentArchive,
           scope: this },
         { key: 'h',
           ctrl: true,
           shift:true,
           alt:true,
           fn: this.showHotKeyHelp,
           scope: this }
      ]);
   }

   // hide the footer page if it was added
   var footerPage = Ext.query("table[@LID='adfHtmlItemFooterPage']", document);
   if( JsUtil.isGood(footerPage) && footerPage.length > 0 )
   {
      footerPage[0].style.display = 'none';
   }
};

ReportSpecContainer.freezeListHeadersHtmlShell =
"     <table class=\"ls freezeHeaders\" id=\"fh_outer_table_${container_name}\" style=\"display:none\" border=\"0\">\n" +
"         <tr>\n" +
"            <td align=\"left\" valign=\"top\" colspan=\"2\" style=\"padding:0px\">\n" +
"               <div class=\"fhCorner\" >\n" +
"                  <table class=\"ls\" id=\"head_${container_name}\">\n" +
//" (HEADER)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"         </tr>\n" +
"         <tr>\n" +
"            <td align=\"left\" valign=\"top\" style=\"padding:0px\">\n" +
"               <div class=\"fhCorner\">\n" +
"                  <table class=\"ls\" id=\"corner_${container_name}\">\n" +
//" (CORNER)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"            <td align=\"left\" valign=\"top\" style=\"padding:0px\">\n" +
"               <div class=\"fhColumnEdges\">\n" +
"                  <table class=\"ls fhColumnEdges\" style=\"border-collapse:collapse\" cellpadding=\"0\" id=\"columnEdges_${container_name}\">\n" +
//" (COLUMN EDGES)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"         </tr>\n" +
"         <tr>\n" +
"            <td align=\"left\" valign=\"top\" style=\"padding:0px\">\n" +
"               <div class=\"fhRowEdges\">\n" +
"                  <table class=\"ls\" id=\"rowEdges_${container_name}\">\n" +
//" (ROW EDGES)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"            <td colspan=\"2\" valign=\"top\" rowspan=\"2\" style=\"padding:0px\">\n" +
"               <div class=\"fhCrosstabBody\">\n" +
"                  <table class=\"ls\" id=\"crosstabBody_${container_name}\">\n" +
//" (BODY HERE)" +
"                  </table>\n" +
"               </div>\n" +
"            </td>\n" +
"         </tr>\n" +
"      </table>";

/**
 * freezes the headers on a list (NOTE: this method is not meant to be called directly,
 * call the freezeHeaders instead, it will delegate to this method if the container is a
 * crosstab).
 *
 * @private
 */
ReportSpecContainer.prototype.freezeListHeaders = function()
{
   var startTime = new Date().getTime();
   window.status = "starting freeze headers...";

   /*
      Algorithm Steps :
      ---------------
      1. find the list table, and a bit of information about it.
      2. insert our replacement shell (just before the current list table)
      3. calculate the widths + heights of the border cells
      4. explicitly set the width of the border cells (based on what we found in 3)
      5. explicitly set the heights of each row (based on what we found in 3)
      6. move the column headers for locked columns to the corner
      7. move the column headers to the shell replacement area (div2)
      8. move the row headers to the shell replacement area (div3)
      9. move the body to the shell replacement area (div4)
     10. wire the scroll events together (scrolling body causes column and row headers to scroll)

   */

   //--- 1. find the list table, and a bit of information about it.

   var marker = Ext.DomQuery.selectNode("div[class=adfMarker_" + this.name + "]");

   if( !JsUtil.isGood(marker) )
   {
      return;
   }


   var lsTable = Ext.get(marker.nextSibling);

   if (!JsUtil.isGood(lsTable))
   {
      return;
   }

   var lsTableBody = lsTable.first("tbody");

   var totalNumberOfRows = lsTableBody.dom.childNodes.length;
   //alert(this.specName + ", num rows = [" + totalNumberOfRows  + "]");

   if (totalNumberOfRows > this.config.maxRows)
   {
      window.status = "freeze headers disabled for [" + this.specName + "] as it has [" + totalNumberOfRows + "] rows (max is set to " + this.config.maxRows + ")";
      return;
   }



   // see ticket #1402
   if (!JsUtil.isGood(lsTableBody))
   {
      return;
   }

   var styleDisplayNone = {display:'none'};
   var styleDisplayBlock = {display:'block'};

   lsTable.applyStyles(styleDisplayNone);



   window.status = perfStatus;

   //--- 2. insert our replacement shell (just before the current crosstab table)

   var shell = ReportSpecContainer.freezeListHeadersHtmlShell.replace(/\${container_name}/g, this.name);

   var insertedShell = lsTable.insertHtml("beforeBegin", shell, true);

   //--- there might be table header rows that need to go before the actual column headers
   var headerTable = null;
   if( this.config.freezeColumns && this.config.freezeColumns > 0 )
   {
      var headerTable = Ext.get("head_" + this.name);

      var hTbody = headerTable.dom.firstChild;

      var foundNonHeaderContent = false;
      var foundHeaderContent = false;
      eachTr = lsTableBody.first("tr");
      while(eachTr && !foundNonHeaderContent)
      {
         var nextTr = Ext.get(eachTr.dom.nextSibling);

         var firstCell = eachTr.dom.firstChild;

         if( firstCell.className == 'ih' )
         {
            eachTr.dom.parentNode.removeChild(eachTr.dom);
            hTbody.appendChild(eachTr.dom);
            foundHeaderContent = true;
         }
         else
         {
            foundNonHeaderContent = true;
         }

         eachTr = nextTr;
      }

      if( !foundHeaderContent )
      {
         headerTable = null;
      }

   }


   var numColEdges = this.getNumberOfListColumnHeaders(lsTableBody);

   //--- 3. calculate the widths + heights of the border cells

   var cornerCellWidths = [];
   var firstNonEdgeRow = JsUtil.getNthSibling(lsTableBody.dom.firstChild, numColEdges);

   if (!firstNonEdgeRow)
   {
      window.status = "couldn't find firstNonEdgeRow... [" + this.name + "]";
      return;
   }

   var thisCornerCell;
   var eachCornerCell = firstNonEdgeRow.firstChild;
   var cornerWidth = 0;
   var index = 0;

   if( this.config.freezeColumns  && this.config.freezeColumns  > 0 )
   {
      while (eachCornerCell.nextSibling)
      {
         thisCornerCell = Ext.fly(eachCornerCell);
         if ('td' == thisCornerCell.dom.tagName.toLowerCase() && index++ < this.config.freezeColumns )
         {
            var computedWidth = thisCornerCell.getComputedWidth();
            cornerCellWidths.push(computedWidth);
            cornerWidth += computedWidth;
         }
         eachCornerCell = eachCornerCell.nextSibling;
      }
   }

   var cellWidths = [];
   var eachWidth = 0;
   var cumulativeBodyWidth = 0;

   var thisCell;
   var eachCell = firstNonEdgeRow.firstChild;

   index=0;
   while (eachCell)
   {
      thisCell = Ext.fly(eachCell);
      // skip lock headers
      if ('td' == thisCell.dom.tagName.toLowerCase() && ( !JsUtil.isGood(this.config.freezeColumns) ||  index++ >= this.config.freezeColumns ) )
      {
         eachWidth = thisCell.getComputedWidth();
         cellWidths.push(eachWidth);
         cumulativeBodyWidth += eachWidth;
      }
      eachCell = eachCell.nextSibling;
   }

   //--- abort, see ticket #1312 for why...
   if (cumulativeBodyWidth == 0)
   {
      window.status = "aborting freeze headers, calculated cumulative width was 0";
      insertedShell.dom.parentNode.removeChild(insertedShell.dom);
      lsTable.applyStyles(styleDisplayBlock);
      return;
   }
   //alert("cum = [" + cumulativeBodyWidth + "]");

   var perfStatus = "[" + this.specName +"] (" + totalNumberOfRows + ") rows: s3 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;



   //--- capture the heights of each row
   var desiredListBodyHeight = 0;

   var cellHeights = [];

   var allRows = Ext.DomQuery.select("tr", lsTableBody.dom);
   var eachRowHeight;

   for (var i = 0; i < allRows.length; ++i)
   {
      var eachRow = Ext.fly(allRows[i]);
      eachRowHeight = eachRow.getComputedHeight();
      cellHeights.push(eachRowHeight);

            // TODO: since we're deterimining the list BODY height, we should ignore the first row with the
      // labels (otherwise the desired height will be off by that much extra).   I'm leaving this as an
      // exercise for later (this is going to cause the desiredHeight to be a little off, but its still
      // an improvement on what we have now - see ticket).
      desiredListBodyHeight += eachRowHeight;
   }



   //--- 4. explicitly set the width of the edge/measure border cells (based on what we found in 3)




   //--- 5. explicitly set the heights of each row (based on what we found in 3).  We do this
   //       by bonding the heights of the border cells together...
   var eachTr;

   for (var i = 0; i < allRows.length; ++i)
   {
      eachTr = allRows[i];

      Ext.fly(eachTr).applyStyles("height:" + cellHeights[i]);
   }

   //--- 6. move the defined freeze columns to the corner

   if( this.config.freezeColumns && this.config.freezeColumns  > 0 )
   {
      //--- setup <thead> and <col> area...
      var cornerColGroup = {tag:'colGroup', children:[]};

      for (var i = 0; i < cornerCellWidths.length; ++i)
      {
         cornerColGroup.children.push( {tag:'col', span:'1', width:cornerCellWidths[i] + ( i == 0 ? 1 : 0 ) } );
      }

      var cornerTbody = {tag:'tbody', children:[]};

      var cornerTable = Ext.get("corner_" + this.name);
      JsUtil.clearChildNodes(cornerTable.dom);

      var cornerDiv = Ext.get(cornerTable.dom.parentNode);
      cornerDiv.setWidth(cornerWidth+cornerCellWidths.length);
      Ext.DomHelper.append(cornerTable, cornerColGroup);

      var cornerTbodyObj = Ext.DomHelper.append(cornerTable, cornerTbody, true);


      for (var i = 0; i < numColEdges; ++i)
      {
         eachCell = allRows[i].firstChild;

         if (!JsUtil.isGood(cellHeights[i]))
         {
            debugger;
         }

         newTr = { tag:'tr', style:{ height:cellHeights[i]}, children:[] };
         var newTrObj = Ext.DomHelper.append(cornerTbodyObj, newTr, true);

         var lastCell = null;

         index = 0;
         while (eachCell && index++ < this.config.freezeColumns )
         {
            var nextCell = eachCell.nextSibling;
            if( eachCell.colSpan && eachCell.colSpan > 1 )
            {
               index += eachCell.colSpan - 1;
            }
            eachCell.parentNode.removeChild(eachCell);
            newTrObj.dom.appendChild(eachCell);

            lastCell = eachCell;
            eachCell = nextCell;
         }
      }

   }

   //--- 7. move the "column headers" to the shell replacement area (div2)

   var newRow;
   var newCell;

   //--- setup <thead> and <col> area...
   var colgroup = {tag:'colgroup', children:[]};

   //--- this adjustment is for ticket #1223
   var hackClientWidthAdjust = 1;
   for (var i = 0; i < cellWidths.length; ++i)
   {
      colgroup.children.push( {tag:'col', span:'1', width:cellWidths[i] + hackClientWidthAdjust} );
   }

   //--- hack to workaround ticket #1259.  The last column in the List can sometimes have a
   //    a clientWidth that is 1 pixel too small.   I think this happens when the column labels
   //    are much larger than the column data (and this only happens on the last column).   Temporary
   //    workaround is to add 1 additional pixel width to the last <col> element
   if (colgroup.children.length > 0)
   {
      colgroup.children[colgroup.children.length - 1].width++;
   }

   var columnEdgesTable = Ext.get("columnEdges_" + this.name);
   // if there are explicit border styles, copy them over
   if( lsTable.dom.style && lsTable.dom.style.border )
   {
      columnEdgesTable.setStyle('border', lsTable.dom.style.border);
   }
   var tbody = columnEdgesTable.dom.firstChild;

   for (var i = 0; i < numColEdges; ++i)
   {
      eachTr = lsTableBody.first("tr");

      eachTr.dom.parentNode.removeChild(eachTr.dom);
      tbody.appendChild(eachTr.dom);
   }

//   JsUtil.clearChildNodes(columnEdgesTable.dom);

   Ext.DomHelper.append(columnEdgesTable, colgroup);
   Ext.DomHelper.append(columnEdgesTable, tbody);

   perfStatus += ", step 6 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;


   //--- 8. move the crosstab "row headers" to the shell replacement area (div3)


   var newRowEdges = [];
   var newTr;

   var rowEdgesTable = Ext.get("rowEdges_" + this.name);
   var rowEdgesDiv = null;
   if(this.config.freezeColumns && this.config.freezeColumns  > 0)
   {
      rowEdgesDiv = Ext.get(rowEdgesTable.dom.parentNode);

      var allRows = Ext.DomQuery.select("tr", lsTableBody.dom);

      if( lsTable.dom.style && lsTable.dom.style.border )
      {
         rowEdgesTable.setStyle('border', lsTable.dom.style.border);
      }

      JsUtil.clearChildNodes(rowEdgesTable.dom);
      rowEdgesDiv.setWidth( cornerWidth + cornerCellWidths.length + 1);

      var rowEdgeColGroup = {tag:'colGroup', children:[]};

      for (var i = 0; i < cornerCellWidths.length; ++i)
      {
         rowEdgeColGroup.children.push( {tag:'col', span:'1', width:cornerCellWidths[i] + ( i == 0 ? 1 : 0 ) } );
      }
      Ext.DomHelper.append(rowEdgesTable, rowEdgeColGroup);

      var rowEdgeTbody = {tag:'tbody', children:[]};
      var rowEdgeTbodyObj = Ext.DomHelper.append(rowEdgesTable, rowEdgeTbody, true);

      for (var i = 0; i < allRows.length; ++i)
      {
         eachCell = allRows[i].firstChild;

         if (!JsUtil.isGood(cellHeights[i+numColEdges]))
         {
            debugger;
         }

         newTr = { tag:'tr', style:{ height:cellHeights[i+numColEdges]}, children:[] };
         var newTrObj = Ext.DomHelper.append(rowEdgeTbodyObj, newTr, true);

         var lastCell = null;

         index=0;
         while (eachCell && index++ < this.config.freezeColumns )
         {
            var nextCell = eachCell.nextSibling;
            eachCell.parentNode.removeChild(eachCell);
            newTrObj.dom.appendChild(eachCell);

            lastCell = eachCell;
            eachCell = nextCell;
         }

      }
   }


   perfStatus += ", s8 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;



   // 20 grrr.

   //--- 9. move the crosstab body to the shell replacement area (div4)


//   var xtBodyIp = Ext.get("crosstabBody_" + this.name);
//   var xtBodyDiv = Ext.get(xtBodyIp.dom.parentNode);
//
//
//   xtBodyDiv.dom.replaceChild(xtTableBody.dom, xtBodyIp.dom);
///*
   var xtBodyIp = Ext.get("crosstabBody_" + this.name);
   var xtBodyDiv = Ext.get(xtBodyIp.dom.parentNode);

   Ext.DomHelper.append(xtBodyIp, colgroup);

   lsTableBody.dom.parentNode.removeChild(lsTableBody.dom);
   xtBodyIp.dom.appendChild(lsTableBody.dom);



   perfStatus += ", s9 [" + (new Date().getTime() - startTime) + "]";
   window.status = perfStatus;


   //--- 10. wire the scrolls together...

   var columnEdgesDiv = Ext.get(columnEdgesTable.dom.parentNode);

   //--- using closure here so we don't have to retrieve the elements for each
   //    scroll event...

   var shellElement = Ext.get("fh_outer_table_" + this.name);

   var onScrollHandler = {
      config : this.config,
      columnEdgesDiv : columnEdgesDiv,
      rowEdgesDiv : rowEdgesDiv,
      xtBodyDiv : xtBodyDiv,
      shellElement : shellElement,
      desiredBodyWidth : cumulativeBodyWidth + (hackClientWidthAdjust*colgroup.children.length + 1) ,
      desiredBodyHeight : desiredListBodyHeight,
      onScroll : function (anEvent, anElement, aOptions) {

         var left = this.xtBodyDiv.getScroll().left;
         var top = this.xtBodyDiv.getScroll().top;

         columnEdgesDiv.scrollTo("left", left, false);
         if( JsUtil.isGood(rowEdgesDiv))
         {
            rowEdgesDiv.scrollTo("top", top, false);
         }
      },
      onWindowResize : function (anEvent, anElement, aOptions) {
         var scrollBarWidth = 17;

         var body = Ext.getBody();

         var maxWidth = body.getComputedWidth() - ( (JsUtil.isGood(rowEdgesDiv) ? rowEdgesDiv.getComputedWidth() : 0 ) + this.config.crosstab.horizontalSpacer);
         var width = JsUtil.min(this.desiredBodyWidth + scrollBarWidth, maxWidth);


         var maxHeight = body.getComputedHeight() - (columnEdgesDiv.getComputedHeight() + this.config.list.verticalSpacer);
         var height = JsUtil.min(this.desiredBodyHeight + scrollBarWidth, maxHeight);


         xtBodyDiv.setSize(width, height);

         var scrollBarWidthAllowance = 0;
         var scrollBarHeightAllowance = 0;
         if( this.xtBodyDiv.dom.clientHeight < this.xtBodyDiv.dom.scrollHeight )
         {
            scrollBarWidthAllowance = scrollBarWidth;
         }
         if( this.xtBodyDiv.dom.clientWidth < this.xtBodyDiv.dom.scrollWidth )
         {
            scrollBarHeightAllowance = scrollBarWidth;
         }

         if( JsUtil.isGood(rowEdgesDiv))
         {
            this.rowEdgesDiv.setHeight(height - scrollBarHeightAllowance);
         }

         this.columnEdgesDiv.setWidth(width - scrollBarWidthAllowance);

         if( JsUtil.isGood(headerTable) )
         {
            var headerWidth = lsTable.getComputedWidth();
            if( headerWidth + this.config.list.horizontalSpacer > body.getComputedWidth())
            {
               headerWidth = body.getComputedWidth() - this.config.list.horizontalSpacer;
            }
            headerTable.setWidth(headerWidth);
         }
      },
      unwire : function() {
         this.columnEdgesDiv = null;
         this.rowEdgesDiv = null;
         this.xtBodyDiv = null;
      }
   };

   this.itemsToUnwire.push(onScrollHandler);

   xtBodyDiv.on('scroll', onScrollHandler.onScroll, onScrollHandler );
   Ext.EventManager.addListener(window, "resize", onScrollHandler.onWindowResize, onScrollHandler, {delay:this.config.list.onResizeDelay});

   //--- set the display on the new shell to be visible...
   Ext.fly("fh_outer_table_" + this.name).applyStyles(styleDisplayBlock);
   //xtTable.applyStyles(styleDisplayBlock);

   //--- TODO: see if we can avoid this...
   onScrollHandler.onWindowResize(null, null, null);

   perfStatus += " --> total [" + (new Date().getTime() - startTime) + "] ms";
   window.status = perfStatus;
};

ReportSpecContainer.prototype.getNumberOfListColumnHeaders = function (tableBody)
{
   if (this.config.freezeRows)
      return this.config.freezeRows;

   var edgeCount = 0;

   var eachRow = tableBody.first("tr");
   while(eachRow)
   {
      var element = eachRow.first("td");
      if( element.dom.className == 'lc' || element.dom.className == 'lm' )
      {
         return edgeCount;
      }
      edgeCount++;
      eachRow = Ext.fly(eachRow.dom.nextSibling);
   }


   return edgeCount;
};
