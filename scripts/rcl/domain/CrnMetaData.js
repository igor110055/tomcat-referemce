/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: CrnMetaData.js 6042 2008-11-06 21:30:03Z dpaul $

//-----------------------------------------------------------------------------
/**
 * @class - Abstract base for metadata nodes
 * @constructor
 * @author Lance Hankins
 **/
function AbstractCrnMetaDataNode (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      this.name = aName;
      this.path = aPath;
      this.ref = aRef;
      this.description = aDescr;
      this.screenTip = aScreenTip;

      this.traversalOrder = aTraversalOrder;

      this.parent = null;
   }
}

AbstractCrnMetaDataNode.prototype.accept = function (aVisitor)
{
   aVisitor.visit(this);
};

AbstractCrnMetaDataNode.prototype.isQueryItem = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isCalculation = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isQuerySubject = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isMetaDataFolder = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isQueryItemFolder = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isFilter = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isDimension = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isHierarchy = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isLevel = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isMeasure = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isMeasureFolder = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isMemberFolder = function ()
{
   return false;
};

AbstractCrnMetaDataNode.prototype.isMember = function ()
{
   return false;
};


//-----------------------------------------------------------------------------

/**
 * @class - Abstract base for composite metadata nodes
 * @constructor
 * @author Lance Hankins
 **/
function CompositeCrnMetaDataNode (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      CompositeCrnMetaDataNode.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
      this.children = [];
   }
}

CompositeCrnMetaDataNode.prototype = new AbstractCrnMetaDataNode();
CompositeCrnMetaDataNode.prototype.constructor = CompositeCrnMetaDataNode;
CompositeCrnMetaDataNode.superclass = AbstractCrnMetaDataNode.prototype;

/**
 * adds a new child to this composite...
 **/
CompositeCrnMetaDataNode.prototype.addChild = function (aNode)
{
   this.children.push(aNode);
   aNode.parent = this;
};

CompositeCrnMetaDataNode.prototype.accept = function (aVisitor)
{
   aVisitor.visit(this);

   for (var i = 0; i < this.children.length; ++i)
   {
      this.children[i].accept(aVisitor);
   }
}



//-----------------------------------------------------------------------------
/**
* @class - models a QueryItem
* @constructor
* @author Lance Hankins
*
**/
function QueryItem (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder, aUsage, aDataType, aDataTypeModifier, aRegularAggregate)
{
   if (arguments.length > 0)
   {
      QueryItem.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
      this.usage = aUsage;
      this.dataType = aDataType;
      this.dataTypeModifier = aDataTypeModifier;
      this.regularAggregate = aRegularAggregate;
   }
}


QueryItem.prototype = new AbstractCrnMetaDataNode();
QueryItem.prototype.constructor = QueryItem;
QueryItem.superclass = AbstractCrnMetaDataNode.prototype;

QueryItem.prototype.isQueryItem = function ()
{
   return true;
};


//-----------------------------------------------------------------------------
/**
* @class - models a Measure
* @constructor
* @author Lance Hankins
*
**/
function Measure (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder, aUsage, aDataType, aDataTypeModifier, aRegularAggregate)
{
   if (arguments.length > 0)
   {
      Measure.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
      this.usage = aUsage;
      this.dataType = aDataType;
      this.dataTypeModifier = aDataTypeModifier;
      this.regularAggregate = aRegularAggregate;
   }
}


Measure.prototype = new AbstractCrnMetaDataNode();
Measure.prototype.constructor = Measure;
Measure.superclass = AbstractCrnMetaDataNode.prototype;

Measure.prototype.isMeasure = function ()
{
   return true;
};

//-----------------------------------------------------------------------------
/**
* @class - models a framework model Calculation
* @constructor
* @author Ryan Baula
*
**/
function Calculation (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder, aUsage, aDataType, aDataTypeModifier, aRegularAggregate)
{
   if (arguments.length > 0)
   {
      Calculation.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
      this.usage = aUsage;
      this.dataType = aDataType;
      this.dataTypeModifier = aDataTypeModifier
      this.regularAggregate = aRegularAggregate;
   }
}


Calculation.prototype = new AbstractCrnMetaDataNode();
Calculation.prototype.constructor = Calculation;
Calculation.superclass = AbstractCrnMetaDataNode.prototype;

Calculation.prototype.isCalculation = function ()
{
   return true;
};

//-----------------------------------------------------------------------------
/**
* @class - models a Standard Framework Model Filter
* @constructor
* @author Lance Hankins
*
**/
function Filter (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder, aExpression)
{
   if (arguments.length > 0)
   {
      Filter.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
      this.expression = aExpression;
   }
}


Filter.prototype = new AbstractCrnMetaDataNode();
Filter.prototype.constructor = Filter;
Filter.superclass = AbstractCrnMetaDataNode.prototype;

Filter.prototype.isFilter = function ()
{
   return true;
};




//-----------------------------------------------------------------------------
/**
* @class - models a QuerySubject in the Cognos metadata hierarchy
*
* @constructor
* @author Lance Hankins
*
**/
function QuerySubject (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      QuerySubject.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
   }
}

QuerySubject.prototype = new CompositeCrnMetaDataNode();
QuerySubject.prototype.constructor = QuerySubject;
QuerySubject.superclass = CompositeCrnMetaDataNode.prototype;

QuerySubject.prototype.isQuerySubject = function ()
{
   return true;
};


//-----------------------------------------------------------------------------
/**
* @class - models a Folder in the Cognos metadata hierarchy
*
* @constructor
* @author Lance Hankins
*
**/
function MetaDataFolder (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder, aIsNameSpace)
{
   if (arguments.length > 0)
   {
      MetaDataFolder.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
      this.isNameSpace = aIsNameSpace;
   }
}

MetaDataFolder.prototype = new CompositeCrnMetaDataNode();
MetaDataFolder.prototype.constructor = MetaDataFolder;
MetaDataFolder.superclass = CompositeCrnMetaDataNode.prototype;

MetaDataFolder.prototype.isMetaDataFolder = function ()
{
   return true;
};


//-----------------------------------------------------------------------------
/**
* @class - models a QueryItemFolder in the Cognos metadata hierarchy
*
* @constructor
* @author Lance Hankins
*
**/
function QueryItemFolder (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      QueryItemFolder.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
   }
}

QueryItemFolder.prototype = new CompositeCrnMetaDataNode();
QueryItemFolder.prototype.constructor = QueryItemFolder;
QueryItemFolder.superclass = CompositeCrnMetaDataNode.prototype;

QueryItemFolder.prototype.isQueryItemFolder = function ()
{
   return true;
};


//-----------------------------------------------------------------------------
/**
* @class - models a Dimension in the Cognos metadata hierarchy
*
* @constructor
* @author Lance Hankins
*
**/
function Dimension(aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder, aDimensionType)
{
   if (arguments.length > 0)
   {
      Dimension.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
      this.dimensionType = aDimensionType;
   }
}

Dimension.prototype = new CompositeCrnMetaDataNode();
Dimension.prototype.constructor = Dimension;
Dimension.superclass = CompositeCrnMetaDataNode.prototype;

Dimension.prototype.isDimension = function ()
{
   return true;
};


//-----------------------------------------------------------------------------
/**
* @class - models a Hierarchy in the Cognos metadata hierarchy
*
* @constructor
* @author Lance Hankins
*
**/
function Hierarchy (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      Hierarchy.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
   }
}

Hierarchy.prototype = new CompositeCrnMetaDataNode();
Hierarchy.prototype.constructor = Hierarchy;
Hierarchy.superclass = CompositeCrnMetaDataNode.prototype;

Hierarchy.prototype.isHierarchy = function ()
{
   return true;
};




//-----------------------------------------------------------------------------
/**
* @class - models a Level in the CRN metadata level
*
* @constructor
* @author Lance Hankins
*
**/
function Level (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      Level.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
   }
}

Level.prototype = new CompositeCrnMetaDataNode();
Level.prototype.constructor = Level;
Level.superclass = CompositeCrnMetaDataNode.prototype;

Level.prototype.isLevel = function ()
{
   return true;
};

//-----------------------------------------------------------------------------
/**
* @class - models a MemberFolder - this is a quasi element that is shown under
* each Hierarchy or Level node (e.g. "Members" folder in RS)
*
* @constructor
* @author Lance Hankins
*
**/
function MemberFolder (aName, aPath, aRef, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      MemberFolder.superclass.constructor.call(this, aName, aPath, aRef, null, null, aTraversalOrder);
   }
}

MemberFolder.prototype = new CompositeCrnMetaDataNode();
MemberFolder.prototype.constructor = MemberFolder;
MemberFolder.superclass = CompositeCrnMetaDataNode.prototype;

MemberFolder.prototype.isMemberFolder = function ()
{
   return true;
};


//-----------------------------------------------------------------------------
/**
 * @class - models a Member
 *
 * @constructor
 * @author Lance Hankins
 *
 **/
function Member (aMemberCaption, aPath, aRef, aDescr, aScreenTip, aTraversalOrder, aLevelUniqueName, aMemberUniqueName, aParentUniqueName, aLevelNumber)
{
   if (arguments.length > 0)
   {
      // passing "memberCaption" as name here, as these are really equiv. for members
      Member.superclass.constructor.call(this, aMemberCaption, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);

      this.levelUniqueName = aLevelUniqueName;
      this.memberUniqueName = aMemberUniqueName;
      this.parentUniqueName = aParentUniqueName;
      this.levelNumber = aLevelNumber;
   }
}

Member.prototype = new CompositeCrnMetaDataNode();
Member.prototype.constructor = Member;
Member.superclass = CompositeCrnMetaDataNode.prototype;

Member.prototype.isMember = function ()
{
   return true;
};



//-----------------------------------------------------------------------------
/**
* @class - models a MeasureFolder in the CRN metadata measurefolder
*
* @constructor
* @author Lance Hankins
*
**/
function MeasureFolder (aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      MeasureFolder.superclass.constructor.call(this, aName, aPath, aRef, aDescr, aScreenTip, aTraversalOrder);
   }
}

MeasureFolder.prototype = new CompositeCrnMetaDataNode();
MeasureFolder.prototype.constructor = MeasureFolder;
MeasureFolder.superclass = CompositeCrnMetaDataNode.prototype;

MeasureFolder.prototype.isMeasureFolder = function ()
{
   return true;
};




//-----------------------------------------------------------------------------
/**
* @class - represents a CRN metadata model
*
* @constructor
* @author Lance Hankins
*
**/
function CrnModel (aPackagePath, aFolder)
{
   this.packagePath = aPackagePath;
   this.rootFolder = aFolder;

   this.nodesByRef = new Object();
   this.nodesByPath = new Object();
}

CrnModel.prototype.addNode = function(aNode)
{
   this.nodesByRef[aNode.ref] = aNode;
   this.nodesByPath[aNode.path] = aNode;
};



//-----------------------------------------------------------------------------
/**
* @class - Query Item MetaData
*
* @constructor
* @author Lance Hankins
*
**/
function QueryItemMetaData (aDbColumnName, aCustomerDataType, aCustomerDataTypeModifier, aHasRowLevelSecurity, aParamValueHint, aDisplayValueRef)
{
   this.dbColumnName = aDbColumnName;
   this.customerDataType = aCustomerDataType;
   this.customerDataTypeModifier = aCustomerDataTypeModifier;
   this.hasRowLevelSecurity = aHasRowLevelSecurity;
   this.paramValueHint = aParamValueHint;
   this.displayValueRef = aDisplayValueRef;
}
