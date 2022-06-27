/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: ReportSpec.js 8968 2014-07-23 14:19:44Z jsiler $


//-----------------------------------------------------------------------------
/**
 * QueryDataItem
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function QueryDataItem (aName, aExpression, aAggregate, aRollupAggregate, aPreSort)
{
   this.name = aName;
   this.expression = aExpression;
   this.aggregate = aAggregate;
   this.rollupAggregate = aRollupAggregate;
   this.preSort = aPreSort;
}

QueryDataItem.prototype.getName = function()
{
   return this.name;
};

QueryDataItem.prototype.getExpression = function()
{
   return this.expression;
};




//-----------------------------------------------------------------------------
/**
 * I am the JS version of a BiQuery...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function BiQuery (aName, aCube, aTabularModel)
{
   this.name = aName;
   this.dataItems = [];
}

BiQuery.prototype.addDataItem = function (anItem)
{
   this.dataItems.push(anItem);
};

BiQuery.prototype.getDataItemByName = function (aRefItem)
{
   for (var i = 0; i < this.dataItems.length; ++i)
   {
      if (this.dataItems[i].name == aRefItem)
         return this.dataItems[i];
   }

   return null;
};



//-----------------------------------------------------------------------------
/**
 * I am the JS version of a BiQuerySet...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function BiQuerySet ()
{
   this.biQueriesByName = new Object();
}

BiQuerySet.prototype.addQuery = function (aQuery)
{
   this.biQueriesByName[aQuery.name] = aQuery;
};





//-----------------------------------------------------------------------------
/**
 * QueryItemRef
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function QueryItemRef(aRefItem, aGroupDirective, aSortDirective)
{
   this.refItem = aRefItem;
   this.groupDirective = aGroupDirective;
   this.sortDirective = aSortDirective;

   this.container = null;
};

QueryItemRef.prototype.isDimension = function()
{
   return JsUtil.isGood(this.groupDirective);
};

QueryItemRef.prototype.isSorted = function()
{
   return JsUtil.isGood(this.sortDirective);
};

QueryItemRef.prototype.getQueryDataItem = function()
{
   return this.container.query.getDataItemByName(this.refItem);
};

QueryItemRef.prototype.getName = function()
{
   return this.refItem;
};






//-----------------------------------------------------------------------------
/**
 * SortDirective
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 * @author Roger Moore (rmoore@focus-technologies.com)
 * @author Ryan Baula (rbaula@focus-technologies.com)
 **/
function SortDirective (aDirection, aOrder)
{
   this.direction = aDirection;
   this.order = aOrder;
}

SortDirective.prototype.toXml = function ()
{
   return '<sort direction="' + this.direction + '" order="' + this.order + '"/>';
};

SortDirective.Ascending = 0;
SortDirective.Descending = 1;
SortDirective.prototype.ShortDesc = new Array( "ASC", "DESC" );
SortDirective.prototype.toAbbreviateString = function()
{
   var text = "";

   switch ( this.direction )
   {
      case SortDirective.Ascending:
         text = this.ShortDesc[SortDirective.Ascending];
      break;

      case SortDirective.Descending:
         text = this.ShortDesc[SortDirective.Descending];
      break;

      default:
         text = applicationResources.getProperty("reportWizard.columnSelection.unknown");
      break;
   }
   return text;
};

//returns text to be displayed in the list box
SortDirective.prototype.getDisplayText =  function()
{
   var text = "";

   switch ( this.direction )
   {
      case SortDirective.Ascending:
         text = applicationResources.getProperty("reportWizard.columnSelection.ascending");

      break;

      case SortDirective.Descending:
         text = applicationResources.getProperty("reportWizard.columnSelection.descending");
      break;

      default:
         text = applicationResources.getProperty("reportWizard.columnSelection.unknown");
      break;
   }
   return text;
};

//-----------------------------------------------------------------------------
/**
 * GroupDirective
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 * @author Roger Moore (rmoore@focus-technologies.com)
 * @author Ryan Baula (rbaula@focus-technologies.com)
 **/
function GroupDirective (aOrder)
{
   this.order = aOrder;
}

GroupDirective.prototype.toXml = function ()
{
   return '<group order="' + this.order + '"/>';
};

//returns text to be displayed in the list box
GroupDirective.prototype.getDisplayText = function()
{
   return applicationResources.getProperty("reportWizard.columnSelection.grouped");
};




//-----------------------------------------------------------------------------
/**
 * CrnList
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function CrnList (aName, anXpath, aBiQuery)
{
   this.name = aName;
   this.xpath = anXpath;
   this.query = aBiQuery;
   this.queryItemRefs = [];
}

CrnList.prototype.addQueryItemRef = function (aRef)
{
   this.queryItemRefs.push(aRef);
   aRef.container = this;
};

CrnList.prototype.getSortBys = function ()
{
   var sortBys = [];
   for (var i = 0; i < this.queryItemRefs.length; ++i)
   {
      if (this.queryItemRefs[i].isSorted())
      {
         sortBys.push(this.queryItemRefs[i]);
      }
   }
   return sortBys;
};

CrnList.prototype.getGroupBys = function ()
{
   var groupBys = [];
   for (var i = 0; i < this.queryItemRefs.length; ++i)
   {
      if (this.queryItemRefs[i].isDimension())
      {
         groupBys.push(this.queryItemRefs[i]);
      }
   }
   return groupBys;
};

//-----------------------------------------------------------------------------
/**
 * CrnCrosstab
 *
 * @constructor
 * @author Jeremy Siler
 **/
function CrnCrosstab (aName, anXpath, aBiQuery)
{
   this.name = aName;
   this.xpath = anXpath;
   this.query = aBiQuery;
   this.queryItemRefs = [];
}

CrnCrosstab.prototype.addQueryItemRef = function (aRef)
{
   this.queryItemRefs.push(aRef);
   aRef.container = this;
};

CrnCrosstab.prototype.getSortBys = function ()
{
   var sortBys = [];
   for (var i = 0; i < this.queryItemRefs.length; ++i)
   {
      if (this.queryItemRefs[i].isSorted())
      {
         sortBys.push(this.queryItemRefs[i]);
      }
   }
   return sortBys;
};

CrnCrosstab.prototype.getGroupBys = function ()
{
   var groupBys = [];
   for (var i = 0; i < this.queryItemRefs.length; ++i)
   {
      if (this.queryItemRefs[i].isDimension())
      {
         groupBys.push(this.queryItemRefs[i]);
      }
   }
   return groupBys;
};

