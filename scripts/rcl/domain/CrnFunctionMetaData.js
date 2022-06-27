/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: CrnFunctionMetaData.js 4533 2007-07-26 19:34:05Z lhankins $




//-----------------------------------------------------------------------------
/**
 * @class - Abstract base for function metadata nodes
 * @constructor
 * @author Lance Hankins
 **/
function AbstractCrnFunctionMetaDataNode (aName, aTraversalOrder)
{
   this.name = aName;
   this.traversalOrder = aTraversalOrder;
   this.parent = null;
}

AbstractCrnFunctionMetaDataNode.prototype.isFunctionGroup = function ()
{
   return false;
};

AbstractCrnFunctionMetaDataNode.prototype.isFunction = function ()
{
   return false;
};



//-----------------------------------------------------------------------------
/**
* @class - models a Function in the CRN Function Metadata Hierarchy
* @constructor
* @author Lance Hankins
*
**/
function CrnFunction (aName, aTraversalOrder, aType, aSyntax, aDropText, aTip)
{
   if (arguments.length > 0)
   {
      CrnFunction.superclass.constructor.call(this, aName, aTraversalOrder);

      this.type = aType;
      this.syntax = aSyntax;
      this.dropText = aDropText;
      this.tip = aType;
   }
}


CrnFunction.prototype = new AbstractCrnFunctionMetaDataNode();
CrnFunction.prototype.constructor = CrnFunction;
CrnFunction.superclass = AbstractCrnFunctionMetaDataNode.prototype;

CrnFunction.prototype.isFunction = function ()
{
   return true;
};

CrnFunction.prototype.accept = function (aVisitor)
{
   aVisitor.visit(this);
};



//-----------------------------------------------------------------------------
/**
* @class - models a Function in the CRN Function Metadata Hierarchy
* @constructor
* @author Lance Hankins
*
**/
function CrnFunctionGroup (aName, aTraversalOrder)
{
   if (arguments.length > 0)
   {
      CrnFunction.superclass.constructor.call(this, aName, aTraversalOrder);

      this.children = [];
   }
}


CrnFunctionGroup .prototype = new AbstractCrnFunctionMetaDataNode();
CrnFunctionGroup .prototype.constructor = CrnFunction;
CrnFunctionGroup .superclass = AbstractCrnFunctionMetaDataNode.prototype;

CrnFunctionGroup.prototype.isFunctionGroup = function ()
{
   return true;
};

CrnFunctionGroup.prototype.addChild = function (aChild)
{
   this.children.push(aChild);
   aChild.parent = this;
};

CrnFunctionGroup.prototype.accept = function (aVisitor)
{
   aVisitor.visit(this);
   for (var i = 0; i < this.children.length; ++i)
   {
      this.children[i].accept(aVisitor);
   }
};


//-----------------------------------------------------------------------------
/**
* @class - models the entire Crn Function MetaData hierarchy
* @constructor
* @author Lance Hankins
*
**/
function CrnFunctionMetaData (aPackagePath)
{
   if (arguments.length > 0)
   {
      this.packagePath = aPackagePath;
      this.rootFunctionGroup = null;;
   }
}



CrnFunctionMetaData.prototype.accept = function (aFunctionMetaDataVisitor)
{
   return this.rootFunctionGroup.accept(aFunctionMetaDataVisitor);
};



