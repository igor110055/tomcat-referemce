/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: FolderHierarchy.js 4533 2007-07-26 19:34:05Z lhankins $



//-----------------------------------------------------------------------------
/**
 * I represent a single node int he FolderHierarchy for this selection
 * dialog...
 *
 * @param aParent - the parent node (null if this is the root)
 * @param aName - the name of the node
 * @param anId - the id of the node
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FolderHierarchyNode (aParent, anId, aName )
{
   this.parent = aParent;

   this.id = anId;
   this.name = aName;
   this.children = new Array();
   this.selectable = true;


   FolderHierarchyNode.allNodesById[this.id] = this;

   //--- set later, points at corresponding treeNode..
   this.treeNode = null;
}

//--- tracks all instances by id...
FolderHierarchyNode.allNodesById = new Object();

FolderHierarchyNode.prototype.addChild = function (anId, aName)
{
   var child = new FolderHierarchyNode(this, anId, aName);
   this.children.push(child);
   return child;
}

FolderHierarchyNode.prototype.acceptVisitor = function (aVisitor)
{
   aVisitor.visit(this);

   for (var i = 0; i < this.children.length; ++i)
   {
      this.children[i].acceptVisitor(aVisitor);
   }
}

FolderHierarchyNode.prototype.toString = function()
{
   return "name = [" + this.name + "], id = [" + this.id + "]";
}



//-----------------------------------------------------------------------------
/**
 * I represent a single node int he FolderHierarchy for this selection
 * dialog...
 *
 * @param anId - some id which uniquely identifies this item
 * @param aName - the name of the item (used for display)
 * @param anId - the type of the item...
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FolderContentsItem (anId, aName, aType)
{
   this.id = anId;
   this.name = aName;
   this.type = aType;
}

FolderContentsItem.ICONS = new Object();
FolderContentsItem.ICONS["folder"] = "folderYellowClosed.gif"
FolderContentsItem.ICONS["report"] = "crnReportIcon.gif"
FolderContentsItem.ICONS["query"]  = "qs_report_icon.gif"
FolderContentsItem.ICONS["analysis"]  = "as_report_icon.gif"
FolderContentsItem.ICONS["model"]  = "crnModelIcon.gif"
FolderContentsItem.prototype.toString = function()
{
   return "(fci): " + this.name + " -> " + this.id;
}

FolderContentsItem.prototype.getIconSrc = function()
{
   var iconSrc = FolderContentsItem.ICONS[this.type];

   return iconSrc ? iconSrc : this.type + ".gif";
}

