//-----------------------------------------------------------------------------
/**
 *  UI Controller for showing/hiding list columns
 *
 * @constructor
 * @author - Chad Rainey (crainey@seekfocus.com)
 **/
function ShowHideColumnsUi()
{
   this.columns = new Array()
}

//--- This class extends AbstractUiController
ShowHideColumnsUi.prototype = new AbstractUiController();
ShowHideColumnsUi.prototype.constructor = ShowHideColumnsUi;
ShowHideColumnsUi.superclass = AbstractUiController.prototype;

ShowHideColumnsUi.prototype.initUi = function()
{
   this.initColumns();
};

ShowHideColumnsUi.prototype.initColumns = function()
{
   var htmlTableElements = Ext.query("table[class='ls']");

   if (!JsUtil.isGood(htmlTableElements) || htmlTableElements.length < 1)
   {
      alert('could not find table nodes')
      return;
   }
   var htmlTableCells = Ext.select("td[class='lt']", false, htmlTableElements[0]); //get the colum label cells in the first table
   if (!JsUtil.isGood(htmlTableCells) || !JsUtil.isGood(htmlTableCells.elements) || htmlTableCells.elements < 1)
   {
      alert('ERROR: could not find column labels');
      return;
   }

   for (var i = 0; i < htmlTableCells.elements.length; i++)
   {
      this.columns[i] = new Column(
              htmlTableCells.elements[i].firstChild.innerHTML,
              this.initColumnCells(htmlTableElements, i)
              );
   }
};

/**
 * returns an array of HTMLTableCellElement elements
 * @param aColumnIndex
 */
ShowHideColumnsUi.prototype.initColumnCells = function(anHTMLTableElement, aColumnIndex)
{
   var htmlTableRowElements = Ext.select("tr", false, anHTMLTableElement);
//   JsUtil.debugObject('element', htmlTableRowElements.elements[0].cells);

   if(!JsUtil.isGood(htmlTableRowElements) || !JsUtil.isGood(htmlTableRowElements.elements) || htmlTableRowElements.elements.length < 1)
   {
      alert('ERROR: could not find table rows');
      return;
   }

   var cells = new Array();

   for(var i = 0; i < htmlTableRowElements.elements.length; i++)
   {
      cells[cells.length] = htmlTableRowElements.elements[i].cells[aColumnIndex];
   }

   return cells;
}

ShowHideColumnsUi.prototype.hideColumn = function(aColumnId)
{
   var column = this.getColumn(aColumnId);

   if(column != null)
   {
      column.hideColumn();
   }
   else
   {
      alert('could not find column [' + aColumnId + ']');
   }
};

ShowHideColumnsUi.prototype.showColumn = function(aColumnId)
{
   var column = this.getColumn(aColumnId);

   if(column != null)
   {
      column.showColumn();
   }
   else
   {
      alert('could not find column [' + aColumnId + ']');
   }
};

ShowHideColumnsUi.prototype.getColumn = function(aColumnId)
{
   var column = null;
   for(var i = 0; i < this.columns.length; i++)
   {
      if(this.columns[i].id == aColumnId)
      {
         column = this.columns[i];
      }
   }

   return column;
}



//--------------------------------------------------------------------------------

/**
 * Column
 */
function Column(anId, aCellsArray)
{
   this.id = anId;
   this.cells = aCellsArray;
};

Column.prototype.hideColumn = function()
{
      if(JsUtil.isGood(this.cells))
      {
         for(var i = 0; i < this.cells.length; i++)
         {
            this.cells[i].style.display = 'none';
         }
      }
};

Column.prototype.showColumn = function()
{
      if(JsUtil.isGood(this.cells))
      {
         for(var i = 0; i < this.cells.length; i++)
         {
            this.cells[i].style.display = '';
         }
      }
};

Column.prototype.addTableCell = function(aHTMLTableCellElement)
{
   if(!JsUtil.isGood(this.cells))
   {
      this.cells = new Array();
   }

   this.cells[this.cells.length] = aHTMLTableCellElement;
};

Column.prototype.toString = function()
{
   return 'id: [' + this.id + '] ' +
          'isHidden: [' + this.isHidden() + '] ' +
          'number cells: [' + this.cells.length + ']';
};

/**
 * a column is hidden if all of its cells have a style display of 'none'
 */
Column.prototype.isHidden = function()
{
   for(var i = 0; i < this.cells.length; i++)
   {
      var cssDisplay = this.cells[i].style.display;
      if(cssDisplay.toLowerCase() != 'none')
      {
         return false;
      }
   }

   return true;
}