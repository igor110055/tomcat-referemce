/**
 * This is the key handler for JsGrid.  It should be used in conjunction with
 * the UI controller containing the JsGrid for full keyboard support.
 *
 * @author Cory Williamson
 */


//-----------------------------------------------------------------------

function TreeKeyHandler(aUiHandler, aTree)
{
   this.uiHandler = aUiHandler;
   this.tree = aTree;
   this.selectionController = new TreeSelectionController(aTree);
   this.loadKeyCodes();
}

TreeKeyHandler.prototype.loadKeyCodes = function(aDocument)
{
   this.keyDown = applicationResources.getProperty("keycode.tree.down");
   this.keyUp = applicationResources.getProperty("keycode.tree.up");
   this.keyLeft = applicationResources.getProperty("keycode.tree.left");
   this.keyRight = applicationResources.getProperty("keycode.tree.right");
   this.keyToggle = applicationResources.getProperty("keycode.tree.toggle");
   this.keyHome = applicationResources.getProperty("keycode.tree.home");
   this.keyEnd = applicationResources.getProperty("keycode.tree.end");
   this.keyDeselect = applicationResources.getProperty("keycode.tree.deselect");

   this.treeNavigationKeys = new Array();
   this.treeNavigationKeys.push(this.keyDown);
   this.treeNavigationKeys.push(this.keyUp);
   this.treeNavigationKeys.push(this.keyToggle);
   this.treeNavigationKeys.push(this.keyHome);
   this.treeNavigationKeys.push(this.keyEnd);
   this.treeNavigationKeys.push(this.keyDeselect);
}

TreeKeyHandler.prototype.init = function(aDocument)
{
   this.handleKeyEventBind = this.handleKeyEvent.bind(this);
   this.handleKeyReleaseBind = this.handleKeyRelease.bind(this);

   if (aDocument != null)
   {
      Event.observe(aDocument, 'keydown', this.handleKeyEventBind, true);
      Event.observe(aDocument, 'keyup', this.handleKeyReleaseBind, true);
   }
   else
   {
      Event.observe(document, 'keydown', this.handleKeyEventBind, true);
      Event.observe(document, 'keyup', this.handleKeyReleaseBind, true);
   }
};

TreeKeyHandler.prototype.destroy = function(aDocument)
{
   if (JsUtil.isGood(this.handleKeyEventBind) && JsUtil.isGood(this.handleKeyReleaseBind))
   {
      if (aDocument != null)
      {
         Event.stopObserving(aDocument, 'keydown', this.handleKeyEventBind, true);
         Event.stopObserving(aDocument, 'keyup', this.handleKeyReleaseBind, true);
      }
      else
      {
         Event.stopObserving(document, 'keydown', this.handleKeyEventBind, true);
         Event.stopObserving(document, 'keyup', this.handleKeyReleaseBind, true);
      }
   }
}

TreeKeyHandler.prototype.handleKeyRelease = function(anEvent)
{
   //---Restrict the reloading to navigational keys, since it's annoying to have it reload for any keyup
   if (this.treeNavigationKeys.indexOf(anEvent.keyCode) >= 0)
   {
      this.tree.shouldFireSelectionChanged = true;
      this.tree.fireSelectionChanged();
   }
};


TreeKeyHandler.prototype.handleKeyEvent = function(anEvent)
{
   this.tree.shouldFireSelectionChanged = false;

   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;
   var altKey = anEvent.altKey;
   var keyCode = anEvent.keyCode;

   //---down arrow
   if (this.keyDown == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.handleDownSelection(shiftKey);
   }

   //---up arrow
   else if (this.keyUp == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.handleUpSelection(shiftKey);
   }

   //---left arrow
   else if (this.keyLeft == keyCode && !(ctrlKey || altKey || shiftKey))
   {
      this.selectionController.collapseCurrentNode();
   }

   //---right arrow
   else if (this.keyRight == keyCode && !(ctrlKey || altKey || shiftKey))
   {
      this.selectionController.expandCurrentNode();
   }

   //---shift+space
   else if (this.keyToggle == keyCode && shiftKey && !(ctrlKey || altKey))
   {
      this.selectionController.switchCurrentSelection();
   }

   //---home
   else if (this.keyHome == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.selectFirstItem(shiftKey);
   }

   //---end
   else if (this.keyEnd == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.selectLastItem(shiftKey);
   }

   //---escape
   else if (this.keyDeselect == keyCode && !(ctrlKey || altKey))
   {
      this.selectionController.deselectItems();
   }

   //---delegate to uiHandler
   else
   {
      if (this.uiHandler.handleKeyEvent)
      {
         this.uiHandler.handleKeyEvent(anEvent);
      }
   }
};





function TreeSelectionController(aTree)
{
   this.focalNodeOrder = 0;
   this.lastSelectedNode;

   this.tree = aTree
   //---Must set to be notified of selection changes from mouse events
   this.tree.setKeyHandler(this);
}

TreeSelectionController.UP = new Enum(0, 0);
TreeSelectionController.DOWN = new Enum(1, 1);

TreeSelectionController.prototype.handleDownSelection = function(aShiftKey)
{
   var rootNodes = this.tree.rootNodes;
   var allSelected;
   if (!aShiftKey)
   {
      allSelected = [];
   }
   else
   {
      allSelected = this.tree.getSelectedNodes();
   }

   this.tree.deSelectAll();

   //---Handle case where no items have been selected
   if (!JsUtil.isGood(this.lastSelectedNode))
   {
      allSelected.push(rootNodes[0]);
      this.lastSelectedNode = rootNodes[0];
   }
   else
   {
      if (this.focalNodeOrder > this.lastSelectedNode.traversalOrder && aShiftKey)
      {
         if (allSelected[0].traversalOrder < allSelected[allSelected.length - 1].traversalOrder)
         {
            allSelected.shift();
         }
         else
         {
            allSelected.pop();
         }
      }


      var nextNode = this.getNextValidNode(rootNodes, this.lastSelectedNode.traversalOrder);
      if (JsUtil.isGood(nextNode))
      {
         this.lastSelectedNode = nextNode;
      }
      this.addUnique(this.lastSelectedNode, allSelected);

   }

   if (!aShiftKey)
   {
      this.focalNodeOrder = this.lastSelectedNode.traversalOrder;
   }

   this.tree.selectNodes(allSelected);

   this.scrollContainer(TreeSelectionController.DOWN, this.lastSelectedNode.traversalOrder == 0 ? true : false);


   if (!is_ie)
   {
      window.getSelection().removeAllRanges();
   }

};


TreeSelectionController.prototype.handleUpSelection = function(aShiftKey)
{
   var rootNodes = this.tree.rootNodes;
   var allSelected;
   if (!aShiftKey)
   {
      allSelected = [];
   }
   else
   {
      allSelected = this.tree.getSelectedNodes();
   }

   this.tree.deSelectAll();

   //---Handle case where no items have been selected
   if (!JsUtil.isGood(this.lastSelectedNode))
   {
      allSelected.push(rootNodes[0]);
      this.lastSelectedNode = rootNodes[0];
   }
   else
   {

      if (this.focalNodeOrder < this.lastSelectedNode.traversalOrder && aShiftKey)
      {
         allSelected.pop();
      }

      var previousNode = this.getPreviousValidNode(rootNodes, this.lastSelectedNode.traversalOrder);
      if (JsUtil.isGood(previousNode))
      {
         this.lastSelectedNode = previousNode;
      }
      this.addUnique(this.lastSelectedNode, allSelected);

   }

   if (!aShiftKey)
   {
      this.focalNodeOrder = this.lastSelectedNode.traversalOrder;
   }

   this.tree.selectNodes(allSelected);


   this.scrollContainer(TreeSelectionController.UP, this.lastSelectedNode.travsersalOrder == 0 ? true : false);


   if (!is_ie)
   {
      window.getSelection().removeAllRanges();
   }
};


TreeSelectionController.prototype.collapseCurrentNode = function()
{
   if (JsUtil.isGood(this.lastSelectedNode))
   {
      this.tree.deSelectAll();
      this.tree.selectNodes(new Array(this.lastSelectedNode));
      if (this.lastSelectedNode.isExpanded)
      {
         this.lastSelectedNode.collapse();
      }
   }
};


TreeSelectionController.prototype.expandCurrentNode = function()
{
   if (JsUtil.isGood(this.lastSelectedNode))
   {
      this.tree.deSelectAll();
      this.tree.selectNodes(new Array(this.lastSelectedNode));
      if (!this.lastSelectedNode.isExpanded && this.lastSelectedNode.hasChildren())
      {
         this.lastSelectedNode.expand();
      }
   }
};

TreeSelectionController.prototype.getSelectedItemDistance = function(aDirection)
{
   //---The 2 represents the border-width (more specifically, border-top-width + border-bottom-width) value
   //---of the div.colHeader style.
//   var distanceFromTop = this.getElementHeight(document.getElementById("gridHeader")) + 2;
   this.selectedNodeDistance = 0;

   var rootNodes = this.tree.rootNodes;

   for (var i = 0; i < rootNodes.length; i++)
   {
      if (this.calculateNodeSize(rootNodes[i], this.lastSelectedNode.traversalOrder, aDirection))
      {
         i = rootNodes.length;
      }
   }
   return this.selectedNodeDistance;
};

TreeSelectionController.prototype.calculateNodeSize = function(aNode, aTraversalOrder, aDirection)
{
   var element;
   if (aNode.hasChildren() && aNode.isExpanded)
   {
      element = document.getElementById("node_content_" + aNode.traversalOrder);
   }
   else
   {
      element = document.getElementById("node_" + aNode.traversalOrder);
   }

   var elementHeight = this.getElementHeight(element);
   this.selectedNodeDistance += elementHeight;


   if (aNode.traversalOrder == aTraversalOrder)
   {
      if (aDirection == TreeSelectionController.UP)
      {
         this.selectedNodeDistance -= elementHeight;
      }
      return true;
   }
   else
   {
      if (aNode.isExpanded && aNode.hasChildren())
      {
         for (var i = 0; i < aNode.children.length; i++)
         {
            if(this.calculateNodeSize(aNode.children[i], aTraversalOrder, aDirection))
            {
               return true;
            }
         }
      }
      else
      {
         return false;
      }
   }
};

TreeSelectionController.prototype.isItemInView = function(aItemDistance, aContainerHeight, aScrollPosition)
{
   //aScrollPosition is the minRange, aScrollPosition + containerHeight is the max
   if (this.isBetween(aItemDistance, aScrollPosition, aScrollPosition + aContainerHeight))
   {
      return true;
   }
   else
   {
      return false;
   }
};

TreeSelectionController.prototype.isBetween = function(aNumber, aLowerBound, aUpperBound)
{
   if (aNumber < aLowerBound || aNumber > aUpperBound)
   {
      return false;
   }
   else
   {
      return true;
   }
};

TreeSelectionController.prototype.scrollContainer = function(aDirection, aAtBeginning)
{
   var container = document.getElementById("workspaceBody");
   var containerHeight = this.getElementHeight(container);
   var scrollPosition = container.scrollTop;
   var itemDistance = this.getSelectedItemDistance(aDirection);

//   alert("itemDistance[" + itemDistance + "]");

   if (!this.isItemInView(itemDistance, containerHeight, scrollPosition) || aAtBeginning)
   {
      var upperBound = scrollPosition + containerHeight;

      //---Determine if we add in the category
      var itemHeight = this.getElementHeight(document.getElementById("node_" + this.lastSelectedNode.traversalOrder));

/*
      if (aAtBeginning)
      {
         itemHeight += this.getElementHeight(document.getElementById("gridHeader"));
      }
*/


      //---Scroll to item at top
      if (itemDistance < scrollPosition)
      {
         container.scrollTop = itemDistance;
      }
      //---Scroll to item at bottom
      else
      {
         container.scrollTop = scrollPosition + (itemDistance - upperBound);
      }
   }
};


TreeSelectionController.prototype.switchCurrentSelection = function()
{
   if (JsUtil.isGood(this.lastSelectedNode))
   {
      this.lastSelectedNode.toggleSelection();
   }
};


TreeSelectionController.prototype.selectFirstItem = function(aShiftKey)
{
   this.tree.deSelectAll();

   if (aShiftKey)
   {
      var startOrder;
      if (!JsUtil.isGood(this.lastSelectedNode))
      {
         startOrder = 0;
      }
      else
      {
         startOrder = this.lastSelectedNode.traversalOrder;
      }

      var viz = {
         startOrder : startOrder,
         visitNode : function (aNode) {
            if (aNode.traversalOrder <= this.startOrder)
               aNode.select();
         }
      }

      this.tree.applyVisitor (viz);
   }
   else
   {
      this.tree.rootNodes[0].select();
   }

   this.lastSelectedNode = this.tree.rootNodes[0];
   this.focalNodeOrder = this.lastSelectedNode.traversalOrder;
//   this.scrollContainer();
};


TreeSelectionController.prototype.selectLastItem = function(aShiftKey)
{
   this.tree.deSelectAll();

   var lastNode = this.retrieveLastElement(this.tree.rootNodes[this.tree.rootNodes.length - 1]);
   if (aShiftKey)
   {
      var startOrder;
      if (!JsUtil.isGood(this.lastSelectedNode))
      {
         startOrder = 0;
      }
      else
      {
         startOrder = this.lastSelectedNode.traversalOrder;
      }

      var viz = {
         startOrder : startOrder,
         visitNode : function (aNode) {
            if (aNode.traversalOrder >= this.startOrder)
               aNode.select();
         }
      }

      this.tree.applyVisitor (viz);

      this.lastSelectedNode = lastNode;
   }
   else
   {
      this.lastSelectedNode = lastNode;
      this.lastSelectedNode.select();
   }

   this.focalNodeOrder = this.lastSelectedNode.traversalOrder;
//   this.scrollContainer();
};


TreeSelectionController.prototype.deselectItems = function()
{
   this.tree.deSelectAll();
   this.lastSelectedIndex = null;
   this.focalItemIndex = 0;
};


TreeSelectionController.prototype.addUnique = function(anItem, anArray, aFront)
{
   if (!this.contains(anItem, anArray))
   {
      if (JsUtil.isGood(aFront) && aFront == true)
      {
         anArray.unshift(anItem);
      }
      else
      {
         anArray.push(anItem);
      }
   }
}

/**
 * Returns the next none hidden node in the tree, based on the traversal order
 **/
TreeSelectionController.prototype.getNextValidNode = function(aNodeArray, aTraversalOrder)
{
   var nextNode;

   for (var i = 0; i < aNodeArray.length; i++)
   {
      if (aNodeArray[i].traversalOrder > aTraversalOrder)
      {
         return aNodeArray[i];
      }
      else
      {
         if (aNodeArray[i].isExpanded && aNodeArray[i].hasChildren())
         {
            nextNode = this.getNextValidNode(aNodeArray[i].children, aTraversalOrder);
            if (JsUtil.isGood(nextNode))
            {
               i = aNodeArray.length;
               return nextNode;
            }
         }
      }
   }
};

/**
 *  Returns the previous none hidden node in the tree, based on the traversal order
 **/
TreeSelectionController.prototype.getPreviousValidNode = function(aNodeArray, aTraversalOrder)
{
   var previousNode;

   for (var i = aNodeArray.length - 1; i >= 0; i--)
   {
      if (aNodeArray[i].isExpanded && aNodeArray[i].hasChildren())
      {
         previousNode = this.getPreviousValidNode(aNodeArray[i].children,  aTraversalOrder);
         if (JsUtil.isGood(previousNode))
         {
            i = aNodeArray.length;
            return previousNode;
         }
      }
      if (aNodeArray[i].traversalOrder < aTraversalOrder)
      {
         return aNodeArray[i];
      }
   }
};


TreeSelectionController.prototype.contains = function(anItem, anArray)
{
   for (var i = 0; i < anArray.length; i++)
   {
      if (anItem == anArray[i])
      {
         return true;
      }
   }

   return false;
};

TreeSelectionController.prototype.getElementHeight = function(anElement)
{
      return Element.getHeight(anElement);
};

TreeSelectionController.prototype.selectionChanged = function(aSelectedIndex, aFocalIndex)
{
   this.lastSelectedIndex = aSelectedIndex;
   this.focalItemIndex = aFocalIndex;
};

/**
 * Retrieves the last element in the nodes tree
 **/
TreeSelectionController.prototype.retrieveLastElement = function(aNode)
{
   if (!aNode.isExpanded || !aNode.hasChildren())
   {
      return aNode;
   }
   else
   {
      return this.retrieveLastElement(aNode.children[aNode.children.length - 1]);
   }
};