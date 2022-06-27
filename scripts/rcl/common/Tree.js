/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: Tree.js 4533 2007-07-26 19:34:05Z lhankins $


/**
 * @fileoverview
 * This file defines all classes utilized for a DHTML Tree implementation.
 *
 * @author Lance Hankins, lhankins@focus-technologies.com
 * @author Mehul Patel, mpatel@focus-technologies.com
 *
 **/

/**
 * TreeNodeVisitor - interface you can implement if you want to visit
 * tree nodes...
 * @constructor
 */
function TreeNodeVisitor ()
{
}

TreeNodeVisitor.prototype.visitNode = function (aNode)
{
};


/**
 * CssAttribute
 * @constructor
 */
function CssAttribute (aName, aValue)
{
   this.name = aName;
   this.value = aValue;
}

/**
 * TreeNodeEvent - events which can occur with respect to a TreeNode.
 * @constructor
 * @class
 */
function TreeNodeEvent(aType, aNode)
{
   if (arguments.length > 0)
   {
      TreeNodeEvent.superclass.constructor.call(this,aType, aNode);
   }
}

//--- This class extends ObservableEvent
TreeNodeEvent.prototype = new ObservableEvent();
TreeNodeEvent.prototype.constructor = TreeNodeEvent;
TreeNodeEvent.superclass = ObservableEvent.prototype;



TreeNodeEvent.prototype.toString = function()
{
   return this.type.name + " [" + this.payload.getPath() + "]";
};


/**
 * Types of TreeNode Events...
 */
ObservableEventType.TREE_NODE_CLICKED   = new ObservableEventType("tree", "TREE_NODE_CLICKED");
ObservableEventType.TREE_NODE_DOUBLE_CLICKED  = new ObservableEventType("tree", "TREE_NODE_DOUBLE_CLICKED");
ObservableEventType.TREE_NODE_SELECTED   = new ObservableEventType("tree", "TREE_NODE_SELECTED");
ObservableEventType.TREE_NODE_DESELECTED = new ObservableEventType("tree", "TREE_NODE_DESELECTED");


/**
 * TreeNodeType
 * @constructor
 */
function TreeNodeType (aName, aSelectedClass, aDeSelectedClass, aExpandedImage, aCollapsedImage, aAllowNodeSelection)
{
   this.name = aName;
   this.selectedClass = aSelectedClass;
   this.deSelectedClass = aDeSelectedClass;

   this.expandedImage = aExpandedImage;
   this.collapsedImage = aCollapsedImage;

   this.defaultSelected = false;
   this.defaultExpanded = true;

   this.allowNodeSelection = JsUtil.isUndefined(aAllowNodeSelection) ? true : aAllowNodeSelection;


   // these two attributes control the "hover" effect for nodes of this type.
   // note that the attribute names have their DOM Variant, not straight CSS
   // (e.g. textDecoration instead of text-decoration).

   this.onMouseOverAttributes = [new CssAttribute("textDecoration", "underline")];
   this.onMouseOutAttributes = [new CssAttribute("textDecoration", "none") ];

   TreeNodeType.registerType(this);
}

TreeNodeType.knownTypes = new Object();
TreeNodeType.registerType = function (aNewType)
{
   TreeNodeType.knownTypes[aNewType.name] = aNewType;
};

/**
 * this method inserts a hidden div into the current document which references
 * all known node type images (to force them to be pre-loaded)...
 **/
TreeNodeType.preLoadImages = function()
{
   var id = 'treeNodeType_PreLoadImages';

   if (!document.getElementById(id))
   {
      var div = document.createElement("div");
      div.id = 'treeNodeType_PreLoadImages';
      div.style.display = 'none';

      var html = 'begin hidden images to force preload - ';

      var key;
      var type;

      for (key in TreeNodeType.knownTypes)
      {
         type = TreeNodeType.knownTypes[key];
         html += '<img alt="preload" src="' + type.expandedImage + '"/>' +
                 '<img alt="preload" src="' + type.collapsedImage + '"/>';
      }

      div.innerHTML = html;

      document.body.appendChild(div);
   }
};




TreeNodeType.prototype.renderNodeContent = function (aNode, aNodeContentElement)
{
   //--- default behavior just renders text to the content span, feel
   //    free to extend this in your own TreeNodeTypes...

   var textNode = aNode.getDocument().createTextNode(aNode.text);
   aNodeContentElement.appendChild(textNode);
};


/**
 * TreeNode
 *
 * IMPORTANT - do not create tree nodes directly, use Tree.createNode()
 * instead...
 * @constructor
 **/
function TreeNode (anId, aText, aType, aTree, aSrcObject, aHasLazyChildren)
{
   this.id = anId;
   this.text = aText;

   this.type = aType;
   this.tree = aTree;

   this.srcObject = aSrcObject;

   this.isSelected = this.type.defaultSelected;
   this.isExpanded = this.type.defaultExpanded;
   this.isHidden = false;

   this.hasLazyChildren = (JsUtil.isUndefined(aHasLazyChildren) ? false : aHasLazyChildren);

   if (this.hasLazyChildren)
   {
      this.isExpanded = false;
   }


   this.traversalOrder = null;
   this.children = new Array();


   this.window = this.tree.window;

   //--- set during toDomElement
   this.domElement = null;

   //--- set by parent node...
   this.parent = null;
}

TreeNode.prototype.getDocument = function()
{
   return this.tree.getDocument();
};

TreeNode.prototype.toString = function()
{
   return this.getPath();
};

TreeNode.prototype.addChild = function (aNode)
{
   aNode.parent = this;
   this.tree.isDirty = true;
   this.children.push(aNode);

   return aNode;
};

TreeNode.prototype.remove = function ()
{
   if (this.parent)
      this.parent.removeChild(this);
};

TreeNode.prototype.removeChild = function (aChild)
{
   for (var i = 0; i < this.children.length; ++i)
   {
      if (this.children[i] == aChild)
      {
         this.children.splice(i,1);
         aChild.parent = null;
         break;
      }
   }
};

/**
 * applies the visitor to all nodes under this node...
 **/
TreeNode.prototype.applyVisitor = function(aVisitor)
{
   for (var i = 0; i < this.children.length; ++i)
   {
      this.children[i].acceptVisitor(aVisitor);
   }
};

TreeNode.prototype.acceptVisitor = function (aVisitor)
{
   aVisitor.visitNode(this);
   this.applyVisitor(aVisitor);

};

TreeNode.prototype.getPath = function ()
{
   return this.parent != null ? this.parent.getPath() + "/" + this.id : this.id;
};


/**
 * toggles this nodes expansion (expanded or collapsed).
 *
 **/
TreeNode.prototype.toggleExpansion = function ()
{
   if (this.isExpanded == true)
   {
      this.collapse();
   }
   else
   {
      this.expand();
   }
};

TreeNode.prototype.collapse = function ()
{
   this.setExpanded(false);
};

TreeNode.prototype.expand = function ()
{
   if (this.hasLazyChildren)
   {
      this.tree.loadLazyChildren(this);

      var childUl = this.getChildrenUlElement();
      for (var i = 0; i < this.children.length; ++i)
      {
         childUl.appendChild(this.children[i].toDomElement());
      }

      this.hasLazyChildren = false;
   }
   this.setExpanded(true);
};

TreeNode.prototype.setExpanded = function (aValue)
{
   if (this.isExpanded != aValue)
   {
      this.isExpanded = aValue;

      if (this.hasChildren())
      {
         this.domElement.className = this.getNodeClass();
         this.getPlusMinusIcon().src = this.getPlusMinusIconSrc();
         this.getNodeIcon().src = this.getNodeIconSrc();
      }
   }
};

/**
 * expands all ancestors of this node
 **/
TreeNode.prototype.expandAllAncestors = function()
{
   if (this.parent)
   {
      this.parent.expand();
      this.parent.expandAllAncestors();
   }
};

TreeNode.prototype.hasChildren = function()
{
   return this.children.length > 0 || this.hasLazyChildren;
};


/**
 * toggles this nodes selection (whether it is selected or not).
 *
 **/
TreeNode.prototype.toggleSelection = function ()
{
   if (this.isSelected == true)
   {
      this.deSelect();
   }
   else
   {
      this.select();
   }
};

TreeNode.prototype.select = function ()
{
   if (this.type.allowNodeSelection )
   {
      //--- if this node is already selected, just fire a click...
      if (this.isSelected)
      {
         this.tree.nodeClicked(this);
      }
      //--- else select and fire a node selection event...
      else
      {
         this.setSelected(true);
         this.tree.nodeSelected(this);
      }
   }
};

TreeNode.prototype.deSelect = function ()
{

   if (this.isSelected)
   {
      this.setSelected(false);
      this.tree.nodeDeSelected(this);
   }
};

TreeNode.prototype.setSelected = function (aValue)
{
   this.isSelected = aValue;
   this.getNodeContentSpan().className = this.getNodeContentClass();
};

/**
 * toggles this node's hidden flag (whether it is hidden or not).
 *
 **/
TreeNode.prototype.toggleHidden = function ()
{
   if (this.isHidden == true)
   {
      this.unHide();
   }
   else
   {
      this.hide();
   }
};

TreeNode.prototype.hide = function ()
{
   if (this.isHidden == false)
   {
     this.tree.hidden++;

      if(this.hasChildren())
      {
         //--- hide all children
         var viz = {
            visitNode : function (aNode) {
               aNode.hide();
            }
         }

         this.applyVisitor(viz);
      }

      this.isHidden = true;
      this.domElement.className = this.getNodeClass();
      this.deSelect();
   }
};


TreeNode.prototype.unHide = function ()
{
   if (this.isHidden)
   {
       this.tree.hidden--;

      if(this.parent != null)
      {
         this.parent.unHide();
      }
      this.isHidden = false;
      this.domElement.className = this.getNodeClass();
   }
};


/**
 * call expand() on this node and all children of this node...
 */
TreeNode.prototype.expandAllChildren = function ()
{
   var viz = {
      visitNode : function (aNode) {
         aNode.expand();
      }
   }

   this.acceptVisitor(viz);
};

/**
 * call collapse() on this node and all children of this node...
 */
TreeNode.prototype.collapseAllChildren = function ()
{
   var viz = {
      visitNode : function (aNode) {
         aNode.collapse();
      }
   }

   this.acceptVisitor(viz);
};



TreeNode.prototype.onMouseOver = function ()
{
   this.setCssAttributes(this.type.onMouseOverAttributes);
};

TreeNode.prototype.onMouseOut = function ()
{
   this.setCssAttributes(this.type.onMouseOutAttributes);
};

/**
 * called internally during onMouseOver / onMouseOut...
 **/
TreeNode.prototype.setCssAttributes = function (aCssAttributes)
{
   var contentNode = this.getNodeContentSpan();
   for (var i = 0; i < aCssAttributes.length; ++i)
   {
      contentNode.style[aCssAttributes[i].name] = aCssAttributes[i].value;
   }
};



/**
 * returns the dom element for the plus/minus icon...
 */
TreeNode.prototype.getPlusMinusIcon = function()
{
   return this.domElement.firstChild.firstChild;
};

/**
 * returns the dom element for the node's icon...
 */
TreeNode.prototype.getNodeIcon = function()
{
   return this.domElement.firstChild.childNodes[1];
};

/**
 * returns the node's content span dom element...
 */
TreeNode.prototype.getNodeContentSpan = function()
{
   return this.domElement.childNodes[1];
};




TreeNode.prototype.getNodeClass = function()
{
   return this.isHidden == false ? (this.isExpanded ? "expandedNode" : "collapsedNode") : "hidden";
};

TreeNode.prototype.getNodeHandleClass = function()
{
   return this.hasChildren() ? "compositeNodeHandle" : "leafNodeHandle";
};

TreeNode.prototype.getNodeContentClass = function ()
{
   return this.isSelected ? "selectedNodeContent" : "nodeContent";
};

TreeNode.prototype.getPlusMinusIconSrc = function()
{
   return Tree.imageDir + "/" + (this.hasChildren() ? (this.isExpanded ? "minus.gif" : "plus.gif") : "noPlusOrMinus.gif");
};

TreeNode.prototype.getNodeIconSrc = function()
{
   return this.isExpanded ? this.type.expandedImage : this.type.collapsedImage;
};

TreeNode.prototype.getHandleElement = function()
{
   return this.domElement.firstChild;
};

TreeNode.prototype.getContentElement = function()
{
   return this.domElement.firstChild.nextSibling;
};

TreeNode.prototype.getChildrenElement = function()
{

   return this.getContentElement().nextSibling;
};

TreeNode.prototype.getChildrenUlElement = function()
{

   return this.getChildrenElement().firstChild;
};



/**
 * create a dom element which represents this treenode...
 **/
TreeNode.prototype.toDomElement = function()
{
/*
   creates the following type structure :
   ------------------------------------------

      <li class="expandedNode">

         <span class="nodeHandle">
            <img class="plusMinus" src="minus.gif"/><img class="nodeIcon" src="folderYellow.gif"/>
         </span>

         <span class="nodeContent">Root</span>

         <div class="nodeChildrenDiv">
            <ul class=nodes"tree">
               // children go here...

   ------------------------------------------
*/
   var liNode = this.getDocument().createElement("li");
   liNode.className = this.getNodeClass();

   //--- bi-directional association between DomElement LI and JS Node...
   liNode.treeNode = this;
   this.domElement = liNode;
   this.domElement.id = "node_" + this.traversalOrder;

   var nodeHandle = this.getDocument().createElement("span");
   nodeHandle.className = this.getNodeHandleClass();
   liNode.appendChild(nodeHandle);

   var plusMinus = this.getDocument().createElement("img");
   plusMinus.className = "plusMinus";
   plusMinus.src = this.getPlusMinusIconSrc();
   nodeHandle.appendChild(plusMinus);

   var nodeIcon = this.getDocument().createElement("img");
   nodeIcon.className = "nodeIcon";
   nodeIcon.src = this.getNodeIconSrc();
   nodeHandle.appendChild(nodeIcon);

   var nodeContent = this.getDocument().createElement("span");
   nodeContent.className = this.getNodeContentClass();
   nodeContent.id = "node_content_" + this.traversalOrder;
   liNode.appendChild(nodeContent);

   //--- the NodeType will render node content into the nodeContent span...
   this.type.renderNodeContent(this, nodeContent);


   var childrenDiv = this.getDocument().createElement("div");
   childrenDiv.className = "children";
   liNode.appendChild(childrenDiv);


   var childUl = this.getDocument().createElement("ul");
   childUl.className = "nodes";
   childrenDiv.appendChild(childUl);


   //--- install handler functions...
   nodeHandle.window = this.window;
   nodeHandle.onclick = function (anEvent) {
      if (this.parentNode.treeNode.hasChildren())
      {
         this.parentNode.treeNode.toggleExpansion();
      }
      else
      {
         this.parentNode.treeNode.handleMouseEvent(JsUtil.normalizeEvent(event));
      }
   };

   nodeContent.window = this.window;
   nodeContent.onclick = function (anEvent) {
      this.parentNode.treeNode.handleMouseEvent(JsUtil.normalizeEvent(anEvent));
   };

   nodeContent.onmouseover = new Function("this.parentNode.treeNode.onMouseOver();");

   nodeContent.onmouseout = new Function("this.parentNode.treeNode.onMouseOut();");

   //--- recurse to children...
   for (var i = 0; i < this.children.length; ++i)
   {
      childUl.appendChild(this.children[i].toDomElement());
   }

   return liNode;
};

/**
 * cleanup - remove dom references to this object and vice versa (prevent memory
 * leaks in IE).
 **/
TreeNode.prototype._onUnload = function()
{
   if (this.domElement)
   {
      var handle = this.getHandleElement();
      var content = this.getContentElement();
      var chidrenDiv = this.getChildrenElement();

      if (!handle || !content || !chidrenDiv)
      {
         alert("node is already unwired (?)  [" + handle + "], [" + content + "], [" + chidrenDiv + "]");
      }
      else
      {
         handle.window = null;
         handle.onclick = null;

         content.window = null;
         content.onclick = null;
         content.onmouseover = null;
         content.onmouseout = null;
      }

      this.domElement.treeNode = null;
      this.domElement.className = null;
      this.domElement = null;
      this.window = null;
   }
};


/**
 * TreeNode's mouse event handler method...
 **/
TreeNode.prototype.handleMouseEvent = function(aMouseEvent)
{
   this.tree.ensureNotDirty();

   if (aMouseEvent.type == "click")
   {
      //--- Multi-Select Mode...
      if (this.tree.isMultiSelect)
      {
         var ctrlKey = aMouseEvent.ctrlKey;
         var shiftKey = aMouseEvent.shiftKey;


         //--- user is ctrl-clicking...
         if (ctrlKey)
         {
            this.toggleSelection();
         }

         //--- user is shift-clicking, select a range of nodes...
         else if (shiftKey)
         {
            if (this.tree.selectedNode)
            {
               var start = this.tree.selectedNode.traversalOrder;
               var finish = this.traversalOrder;

               this.tree.notifySelectionChanged(this, start);

               if (start == finish)
               {
                  this.toggleSelection();
               }
               else
               {
                  //--- make sure start is the lower of the two...
                  if (start > finish)
                  {
                     var swap = start;
                     start = finish;
                     finish = swap;
                  }

                  //--- traverse the nodes, selecting any which have a traversal
                  //    order btween start and finish...
                  this.tree.beginBatchOperation();
                  this.tree.applyVisitor( {
                        start: start,
                        finish : finish,
                        visitNode : function (aNode) {
                           if (aNode.traversalOrder >= this.start && aNode.traversalOrder <= this.finish)
                           {
                              aNode.select();
                           }
                           else
                           {
                              aNode.deSelect();
                           }
                        }
                     }
                  );
                  this.tree.endBatchOperation();
               }
            }
            else
            {
               this.toggleSelection();
            }
         }

         //--- single select mode...
         else
         {
            this.tree.notifySelectionChanged(this, this.traversalOrder);
            this.tree._selectSingleNode(this);
         }


      }
      //--- Single Select Mode...
      else
      {
         if (this.tree.selectedNode && this.tree.selectedNode != this)
         {

            this.tree.selectedNode.deSelect();
         }

         this.select();
      }

      this.tree.selectedNode = this;
   }
};







/**
 * TreeNodeHandlerFunctions - references to these functions are installed on
 * the dom elements which make up the tree (the nodeHandle, the nodeContent,
 * etc.)
 *
 * NOTE: In the context of these methods, the "this" pointer actually points
 * at the Dom Element (not an instance of TreeNodeHandlerFunctions).
 * @constructor
 */
function TreeNodeHandlerFunctions()
{
}

TreeNodeHandlerFunctions.nodeHandleOnClick = function (anEvent)
{
  if (this.parentNode.treeNode.hasChildren())
    this.parentNode.treeNode.toggleExpansion();
  else
    this.parentNode.treeNode.handleMouseEvent(JsUtil.normalizeEvent(anEvent));

};

TreeNodeHandlerFunctions.nodeContentOnClick = function (anEvent)
{
  this.parentNode.treeNode.handleMouseEvent(JsUtil.normalizeEvent(anEvent));
};

TreeNodeHandlerFunctions.nodeContentOnMouseOver = function (anEvent)
{
  this.parentNode.treeNode.onMouseOver();
};

TreeNodeHandlerFunctions.nodeContentOnMouseOut = function (anEvent)
{
  this.parentNode.treeNode.onMouseOut();
};


/**
 * Tree
 * @constructor
 */
function Tree (aContainerId)
{
   if (arguments.length > 0)
   {
      Tree.superclass.constructor.call(this);

      this.containerId = aContainerId;
      this.isMultiSelect = false;

      this.rootNodes = new Array();
      this.isDirty = false;

      //--- only used during single selection mode...
      this.selectedNode = null;

      this.document = document;
      this.window = window;

      this.size = 0;
      this.hidden = 0;

      this.lazyLoadHandler = null;

      Tree.instances.push(this);
   }
}


//--- inheritance chain...
Tree.prototype = new Observable();
Tree.prototype.constructor = Tree;
Tree.superclass = Observable.prototype;


//--- statics...
Tree.instances = [];
Tree.onDocumentUnload = function ()
{
   //alert("Tree.onDocumentUnload ");
   for (var i = 0; i < Tree.instances.length; ++i)
   {
      Tree.instances[i]._onUnload();
   }
};

//--- make sure all tree's properly shutdown during document unload
DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
   Tree.onDocumentUnload();
});

//--- pre-load NodeType images at document load time...
DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
   TreeNodeType.preLoadImages();
});





//--- members...
Tree.prototype.getDocument = function()
{
   return this.document;
};

Tree.prototype.setDocument = function(aDocument)
{
   this.document = aDocument;
};

Tree.prototype.getWindow = function()
{
   return this.window;
};

Tree.prototype.setWindow = function(aWindow)
{
   this.window = aWindow;
};

Tree.prototype.getSize = function()
{
  return this.size;
};

Tree.prototype.getHidden = function()
{
  return this.hidden;
};

Tree.prototype.createNode = function (anId, aText, aType, aSrcObject, aHasLazyChildren)
{
   this.size++;
   return new TreeNode(anId, aText, aType, this, aSrcObject, aHasLazyChildren);
};


Tree.prototype.addRootNode = function(aRootNode)
{
   this.rootNodes.push(aRootNode);
   this.isDirty = true;
};

/**
 * applies the visitor to all nodes in this tree...
 **/
Tree.prototype.applyVisitor = function(aVisitor)
{
   for (var i = 0; i < this.rootNodes.length; ++i)
   {
      this.rootNodes[i].acceptVisitor(aVisitor);
   }
};

Tree.prototype.refreshView = function()
{
   this.ensureNotDirty();

   var treeDiv = this.getDocument().createElement("div");
   treeDiv.className = "tree";

   // TODO: this is not working for moz...
   treeDiv.onselectstart = function () { return false; };


   var ul = this.getDocument().createElement("ul");
   ul.className = "rootNodes";
   treeDiv.appendChild(ul);

   for (var i = 0; i < this.rootNodes.length; ++i)
   {
      ul.appendChild(this.rootNodes[i].toDomElement());
   }

   var target = this.getDocument().getElementById(this.containerId);

   if (target.firstChild)
   {
     //      window.status = "using replaceChild";
      target.replaceChild(treeDiv, target.firstChild);
   }
   else
   {
      target.appendChild(treeDiv);
   }

};


Tree.prototype.ensureNotDirty = function()
{
   if (this.isDirty)
   {
      this.isDirty = false;

      //--- set the traversal order for all nodes, make sure they all have the
      //    correct tree reference, etc.
      this.applyVisitor(
         {
            theTree: this,
            traversalOrder : 0,
            visitNode : function (aNode) {
               aNode.tree = this.theTree;
               aNode.traversalOrder = this.traversalOrder++;
            }
         }
      );
   }
};



/**
 * called by node selection logic in multi-select mode, when a single node is
 * clicked on (and we need to de-select all others)...
 * @private
 **/
Tree.prototype._selectSingleNode = function (aNodeToSelect)
{
   try
   {
      this.beginBatchOperation();
      this.applyVisitor (
         {
            targetNode : aNodeToSelect,
            visitNode : function (aNode)
            {
               if (aNode == this.targetNode)
                  aNode.select();
               else
                  aNode.deSelect();
            }
         }
      );
   }
   finally
   {
      this.endBatchOperation();
   }
};

/**
 * user is selecting a single node by id...
 **/
Tree.prototype.selectSingleNodeById = function (aNodeId)
{
   var target = this.getNodeById(aNodeId);

   if (JsUtil.isGood(target))
   {
      this._selectSingleNode(target);
   }
};

/**
 * retrieve the node identified by the supplied id
 **/
Tree.prototype.getNodeById = function (aNodeId)
{
   var viz = {
      targetId : aNodeId,
      node : null,
      visitNode : function (aNode) {
         if (aNode.id == this.targetId)
            this.node = aNode;
      }
   }

   this.applyVisitor (viz);
   return viz.node;
};

/**
 *  select all nodes in the supplied array
 **/
Tree.prototype.selectNodes = function (aNodes)
{
   try
   {
      this.beginBatchOperation();
      for (var i = 0; i < aNodes.length; i++)
      {
         aNodes[i].select();
         this.selectedNode = aNodes[i];
      }
   }
   finally
   {
      this.endBatchOperation();
   }
};


/**
 * clear all selections...
 **/
Tree.prototype.deSelectAll = function ()
{
   try
   {
      this.beginBatchOperation();
      this.applyVisitor (
         {
            visitNode : function (aNode)
            {
               aNode.deSelect();
            }
         }
      );
   }
   finally
   {
      this.endBatchOperation();
   }
};

/**
 * Returns an array with all nodes in the tree that are currently selected (skips
 * nodes that are hidden).
 **/
Tree.prototype.getSelectedNodes = function ()
{
   var viz = {
      selectedNodes : new Array(),
      visitNode : function (aNode)
      {
         if (aNode.isSelected == true && aNode.isHidden == false)
            this.selectedNodes.push(aNode);
      }
   }

   this.applyVisitor(viz);

   return viz.selectedNodes;
};


/**
 * Returns an array with the srcObject's from all nodes in the tree that are currently selected (skips
 * nodes that are hidden).
 **/
Tree.prototype.getSelectedSrcObjects = function ()
{
   var viz = {
      selectedSrcObjects : new Array(),
      visitNode : function (aNode)
      {
         if (aNode.isSelected == true && aNode.isHidden == false)
            this.selectedSrcObjects.push(aNode.srcObject);
      }
   }

   this.applyVisitor(viz);

   return viz.selectedSrcObjects;
};



/**
 * expands all nodes in the tree
 **/
Tree.prototype.expandAll = function ()
{
   var viz = {
      visitNode : function (aNode)
      {
         aNode.expand();
      }
   }

   this.applyVisitor(viz);
};

/**
 * expand to show parents of current selections
 **/
Tree.prototype.expandToShowSelected = function ()
{
   var selected = this.getSelectedNodes();

   for (var i = 0; i < selected.length;++i)
   {
      selected[i].expandAllAncestors();
   }
};

/**
 * collapses all nodes in the tree
 **/
Tree.prototype.collapseAll = function ()
{
   var viz = {
      visitNode : function (aNode) {
         aNode.collapse();
      }
   }

   this.applyVisitor(viz);
};

/**
 * collapses all nodes in the tree except for the roots
 **/
Tree.prototype.collapseAllNonRoot = function ()
{
   //alert("collapseAllNonRoot");
   var viz = {
      visitNode : function (aNode) {
         if (aNode.parent != null)
            aNode.collapse();
      }
   }

   this.applyVisitor(viz);
};

/**
 * hides all selected nodes
 **/
Tree.prototype.hideSelected = function ()
{
   var viz = {
      visitNode : function (aNode) {
         if (aNode.isSelected)
         {
            aNode.hide();
         }
      }
   }

   this.applyVisitor(viz);
};


/**
 * un-hides all nodes which care currently hidden
 **/
Tree.prototype.unHideAll = function ()
{
   var viz = {
      visitNode : function (aNode) {
         aNode.unHide();
      }
   }

   this.applyVisitor(viz);
};


/**
 * hides all nodes
 **/
Tree.prototype.hideAll = function ()
{

   for (var i = 0; i < this.rootNodes.length; ++i)
   {
      this.rootNodes[i].hide();
   }

   //alert("doing hideAll on tree [" + this.containerId + "]");
   //var viz = {
      //visitNode : function (aNode) {
         //aNode.hide();
      //}
   //}
//
   //this.applyVisitor(viz);
};




/**
 * internal method (called by node when node is selected).
 *
 **/
Tree.prototype.nodeSelected = function (aNode)
{
   if (this.isMultiSelect == false)
   {
      this.selectedNode = aNode;
   }


   if (this.hasObservers() && !JsUtil.isGood(this.shouldFireSelectionChanged) || this.shouldFireSelectionChanged == true)
   {
      this.publishEvent(new TreeNodeEvent(ObservableEventType.TREE_NODE_SELECTED, aNode));
   }
};

Tree.prototype.fireSelectionChanged = function()
{
   if (this.hasObservers())
   {
      this.publishEvent(new TreeNodeEvent(ObservableEventType.TREE_NODE_SELECTED, this.selectedNode));
   }
};

/**
 * internal method (called by node when node is clicked).
 *
 **/
Tree.prototype.nodeClicked = function (aNode)
{
   if (this.hasObservers())
   {
      this.publishEvent(new TreeNodeEvent(ObservableEventType.TREE_NODE_CLICKED, aNode));
   }
};

/**
 * internal method (called by node when node is de-selected).
 *
 **/
Tree.prototype.nodeDeSelected = function (aNode)
{
   if (this.isMultiSelect == false && aNode == this.selectedNode)
   {
      this.selectedNode = null;
   }

   if (this.hasObservers())
   {
      this.publishEvent(new TreeNodeEvent(ObservableEventType.TREE_NODE_DESELECTED, aNode));
   }
};


/**
 * cleanup before document unloads (prevent memory leaks in IE)
 *
 **/
Tree.prototype._onUnload = function ()
{
//   alert("unloading tree...");
   var viz = {
      visitNode : function (aNode) {
         aNode._onUnload();
      }
   }

   this.applyVisitor(viz);

   this.document = null;
   this.window = null;
};

Tree.prototype.loadLazyChildren = function (aNode)
{
   if (this.lazyLoadHandler)
   {
      this.lazyLoadHandler.loadLazyChildren(aNode);
   }
   else
   {
      alert("WARNING - No lazyLoadHandler is installed (yet I was asked to load lazy children)).");
   }
};

Tree.prototype.setKeyHandler = function(aKeyHandler)
{
   this.keyHandler = aKeyHandler;
};

Tree.prototype.notifySelectionChanged = function(aSelectedNode, aFocalNodeOrder)
{
   if (JsUtil.isGood(this.keyHandler))
   {      
      this.keyHandler.lastSelectedNode = aSelectedNode;
      this.keyHandler.focalNodeOrder = aFocalNodeOrder;
   }
};


Tree.prototype.showPleaseWaitDiv = function()
{
   this.pleaseWaitDiv = new PleaseWaitDiv(this.containerId, "Loading...");
   this.pleaseWaitDiv.begin();
};

Tree.prototype.endPleaseWaitDiv = function()
{
   if (this.pleaseWaitDiv)
   {
      this.pleaseWaitDiv.end();
   }
};



/**
 * Tree - Visitor classes
 * @constructor
 */
ListTreePathsVisitor = function()
{
   this.paths = '';
};

ListTreePathsVisitor.prototype.visitNode = function (aNode)
{
   this.paths += aNode.getPath() + "\n";
};


//--- static members...
Tree.imageDir = ServerEnvironment.baseUrl + "/images";



