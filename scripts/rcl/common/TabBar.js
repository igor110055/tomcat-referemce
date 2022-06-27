/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: TabBar.js 4533 2007-07-26 19:34:05Z lhankins $

/**
 * @fileoverview
 * This file defines a bar of tabs that can help control the UI.  Unlike
 * TabSet, each tab here has no corresponding content area.
 *
 *
 **/

/**
 * the TabListener interface
 * @constructor
 */
function TabBarListener() {
}

TabBarListener.prototype.tabWasSelected = function(aTabBarIt) {
    // do nothing
}


/** @type undefined */
var undefined;

/** @type Object */
var Node = Node ? Node : {};
/** @type number */
Node.ELEMENT_NODE 					= 1;
/** @type number */
Node.ATTRIBUTE_NODE 				= 2;
/** @type number */
Node.TEXT_NODE 						= 3;
/** @type number */
Node.CDATA_SECTION_NODE 			= 4;
/** @type number */
Node.ENTITY_REFERENCE_NODE 			= 5;
/** @type number */
Node.ENTITY_NODE 					= 6;
/** @type number */
Node.PROCESSING_INSTRUCTION_NODE 	= 7;
/** @type number */
Node.COMMENT_NODE 					= 8;
/** @type number */
Node.DOCUMENT_NODE 					= 9;
/** @type number */
Node.DOCUMENT_TYPE_NODE 			= 10;
/** @type number */
Node.DOCUMENT_FRAGMENT_NODE 		= 11;
/** @type number */
Node.NOTATION_NODE 					= 12;

/**
 * a TabBar "it", where TabBar exposes a list-like interface for tabs, a list composed of "it"
 * @constructor
 */
function TabBarIt(anId, aName) {
    this.id = anId;
    this.name = aName;
    this.selected = false;
    this.dom = new Object();
    this.tabBar = null;
}

/**
 * sets the parent TabBar for this TabBarIt
 */
TabBarIt.prototype.setParent = function(aTabBar) {
    this.tabBar = aTabBar;
}


/**
 * remove all references between this JS object and the Dom
 **/
TabBarIt.prototype._onUnLoad = function() {
   this.dom = null;
}



/**
 * TabBar - the top-level bar of tabs
 * @constructor
 */
function TabBar() {
    this.init();
}

/**
 * @private
 */
TabBar.prototype.init = function() {
    // indexed by order in the list
    this.itsByOrder = new Array();
    // indexed by the it's id field
    this.its = new Object();

    this.inserted = false;

    this.listeners = new Array();
    TabBar.instances.push(this);
}

/**
 * insert the TabBar into the enclosing document's DOM tree
 */
TabBar.prototype.insertIntoDocument = function(aDocument, anInsertionPoint) {
    this.document = aDocument;
    this.insertionPoint = anInsertionPoint;
    if (JsUtil.isGood(this.insertionPoint)) {
        JsUtil.clearChildNodes(this.insertionPoint);
    } else {
        alert("Problem with insertionPoint.");
    }

    this.tabContainer = this.document.createElement("div");
    this.tabContainer.id = "tabs-main-container";
    this.tabContainer.className = "bartab-container";
    if (is_ie5up) {
        this.tabContainer.setAttribute("oncontextmenu", new Function("return false;"));
        this.tabContainer.setAttribute("onselectstart", new Function("return false;"));
    } else {
        this.tabContainer.setAttribute("oncontextmenu", "return false;");
        this.tabContainer.setAttribute("onmousedown", "return false;");
        this.tabContainer.setAttribute("onmouseup", "return false;");
    }
    this.insertionPoint.appendChild(this.tabContainer);

    this.tabWrap = this.document.createElement("div");
    this.tabWrap.className = "bartab-wrap";
    this.tabContainer.appendChild(this.tabWrap);

    this.tabClear = this.document.createElement("br");
    this.tabClear.className = "bartab-clear";
    this.tabWrap.appendChild(this.tabClear);

    for (var idx = 0; idx < this.itsByOrder.length;idx++) {
        // get the it
        var it = this.itsByOrder[idx];
        this.renderNewTab(it);
    }

    this.inserted = true;
}

//--- statics...
TabBar.instances = [];
TabBar.onDocumentUnload = function () {
   for (var i = 0; i < TabBar.instances.length; ++i)
   {
      TabBar.instances[i]._onUnLoad();
   }
};


/**
 * remove all references between this JS object and the Dom
 **/
TabBar.prototype._onUnLoad = function() {
   for (var i = 0; i < this.itsByOrder.length; ++i) {
      this.itsByOrder[i]._onUnLoad();
   }

   this.insertionPoint = null;
   this.tabContainer = null;
   this.tabWrap = null;
   this.tabClear = null;
   this.document = null;
}



/**
 * add a TabListener to this TabBar
 */
TabBar.prototype.addTabListener = function(aTabListener) {
   if (!JsUtil.arrayContains(this.listeners, aTabListener)) {
      this.listeners[this.listeners.length] = aTabListener;
   }
}

/**
 * remove a TabListener from this TabBar
 */
TabBar.prototype.removeTabListener = function(aTabListener) {
    this.listeners = JsUtil.removeElementFromArrayByValue(this.listeners, aTabListener);
}

/**
 * add a TabBarIt to this bar
 */
TabBar.prototype.add = function(anIt) {
    if (JsUtil.isGood(this.its[anIt.id])) {
        // it already exists in this TabBar
        return;
    }

    this.its[anIt.id] = anIt;
    this.itsByOrder.push(anIt);
    anIt.tabBar = this;

    if (this.inserted) {
        this.renderNewTab(anIt);
    }
}

/**
 * create a TabBarIt and add it to this bar
 */
TabBar.prototype.createAndAdd = function(anId, aName) {
    var it = new TabBarIt(anId, aName);
    this.add(it);
}

/**
 * selects a TabBarIt from this TabBar
 */
TabBar.prototype.select = function(anId) {
    var it = this.its[anId];
    it.selected = true;
    it.dom.tabDiv.className = "bartab bartab-focused";

    if (JsUtil.isGood(this.currentTab) && this.currentTab != it) {
        this.currentTab.selected = false;
        this.currentTab.dom.tabDiv.className = "bartab bartab-unfocused";
    }

    this.currentTab = it;
}

/**
 * selects the first TabBarIt in this TabBar
 */
TabBar.prototype.selectFirstTab = function(notifyListeners) {
   if (notifyListeners) {
      this.tabWasSelected(this.itsByOrder[0].id);
   } else {
      this.select(this.itsByOrder[0].id);
   }
}

/**
 * @private
 */
TabBar.prototype.renderNewTab = function(anIt) {
    var fnBody = "TabBar.tabWasSelected(event)";

    // create the top-level div for the tab
    var tabDiv = this.document.createElement("div");
    tabDiv.origId = anIt.id;
    tabDiv.id = anIt.id + "-tab";
    tabDiv.className = "bartab bartab-unfocused";
    tabDiv.tabBar = anIt.tabBar;
    if (is_ie5up) {
        tabDiv.setAttribute("onclick", new Function(fnBody));
    } else {
        tabDiv.setAttribute("onclick", fnBody);
    }
    this.tabWrap.insertBefore(tabDiv, this.tabClear);
    anIt.dom.tabDiv = tabDiv;  // assign the element to its place in the dom subtree
    // create the left sliding-curtain span
    var tabSpan = this.document.createElement("span");
    tabSpan.className = "bartab-bg-left";
    tabDiv.appendChild(tabSpan);
    anIt.dom.tabSpan = tabSpan;  // assign the element to its place in the dom subtree
    // create the a tag for the right sliding-curtain
    var tabA = this.document.createElement("a");
    tabA.className = "bartablink";
    if (is_ie5up) {
        tabA.setAttribute("onclick", new Function("return false;"));
    } else {
        tabA.setAttribute("onclick", "return false");
    }
    tabA.innerHTML = anIt.name;
    tabDiv.appendChild(tabA);
    anIt.dom.tabA = tabA;  // assign the element to its place in the dom subtree
}

/**
 * responsible for firing events to listeners
 */
TabBar.prototype.tabWasSelected = function(anId) {
    this.select(anId);
    var it = this.its[anId];
    for (var idx = 0; idx < this.listeners.length;++idx) {
        this.listeners[idx].tabWasSelected(it);
    }
}

/**
 * static method that dispatches to appropriate non-static method by same name
 */
TabBar.tabWasSelected = function(event) {
    var wrap = new Object();
    var evt = event ? event : window.event;
    var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
    source = TabBar.getFirstAncestorOrSelfByClassName(source, new String("bartab"));
    // get the TabBar responsible for the clicked tab
    source.tabBar.tabWasSelected(source.origId);
    try {
        evt.consume();
    } catch (e) { // swaller this
    }
}

/**
 * @private
 */
TabBar.getFirstAncestorOrSelfByClassName = function (target, className) {
    var parent = target;

    do {
        if (target.nodeType == Node.ELEMENT_NODE && TabBar.hasClassName(parent,className)) {
            return parent;
        }
    } while (parent = parent.parentNode);

	return null;
}

/**
 * @private
 */
TabBar.hasClassName = function (target,className) {
	function _isLastOfMultipleClassNames(all,className) {
		var spaceBefore = all.lastIndexOf(className)-1;
		return all.endsWith(className) &&
			all.substring(spaceBefore,spaceBefore+1) == " ";
	}

//	className = className.trim();
	var cn = target.className;
	if (!cn) {
		return false;
	}
//	cn = cn.trim();
	if (cn == className) {
		return true;
	}
	if (cn.indexOf(className + " ") > -1) {
		return true;
	}
//	if (_isLastOfMultipleClassNames(cn,className)) {
//		return true;
//	}
	return false;
}