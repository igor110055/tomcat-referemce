/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: TabSet.js 8334 2013-05-10 13:30:21Z lhankins $



/**
 * @fileoverview
 * This file defines a tabbed viewing area.   Each tab has an associated
 * Iframe, which is brought to the front when the tab is selected.
 *
 *
 **/


/**
 * the TabListener interface
 * @constructor
 */
function TabSetListener() {
}

TabSetListener.prototype.tabWasSelected = function(aTabSetIt) {
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
 * a TabSet "it", where TabSet exposes a list-like interface for tabs, a list composed of "it"
 * @constructor
 */
function TabSetIt(anId, aName, aUrl) {
    this.id = anId;
    this.name = aName;
    this.url = aUrl;
    this.selected = false;
    this.dom = new Object();
    this.tabSet = null;
}

/**
 * sets the parent TabSet for this TabSetIt
 */
TabSetIt.prototype.setParent = function(aTabSet) {
    this.tabSet = aTabSet;
}

/**
 * change the URL associated with this TabSetIt
 */
TabSetIt.prototype.changeUrl = function(aUrl) {
   this.url = aUrl;
   this.tabSet.document.getElementById(this.getIframeId()).setAttribute("src", this.url);
}

/**
 * change the name of  this TabSetIt
 */
TabSetIt.prototype.changeName = function(aName) {
   this.name= aName;
   this.tabSet.document.getElementById(this.id + "-tabA").innerHTML = '<nobr>' + aName + '</nobr>';
}

/**
 * change the title of this TabSetIt
 */
TabSetIt.prototype.changeTitle = function(aTitle) {
   this.tabSet.document.getElementById(this.id + "-tabA").title = aTitle + "\n\n" + applicationResources.getProperty("hotkey.tooltip.gotoNextTab") + "\n" + applicationResources.getProperty("hotkey.tooltip.gotoPrevTab");
}

/**
 * @private
 */
TabSetIt.prototype.getQualifiedName = function() {
   return this.tabSet.name + "_" + this.id + "_"; // + this.name;
}

/**
 * @private
 */
TabSetIt.prototype.getIframeId = function() {
   return this.getQualifiedName() + "_Iframe";
}


/**
 * @private
 */
TabSetIt.prototype.getIframe = function () {
   return document.getElementById(this.getIframeId());
};


/**
 * @private
 */
TabSetIt.prototype.evalInIframe = function (aExpr) {
   var iFrame = this.getIframe();

   try {

      if (!iFrame.eval && iFrame.execScript) {
         return iFrame.execScript(aExpr);
      }
      else if (iFrame.contentWindow) {
         return iFrame.contentWindow.eval(aExpr);
      }
      else {
         return iFrame.eval(aExpr);
      }
   }
   catch (e) {
      alert("error [" + e.message + "] for supplied expr [" + aExpr + "]");
   }
};

/**
 * TabSet - the top-level widget that hold TabSetIts
 * @constructor
 */
function TabSet(aName) {
    this.init(aName);
}

/**
 * @private
 */
TabSet.prototype.init = function(aName) {
    this.name = aName;

    // indexed by order in the list
    this.itsByOrder = new Array();
    // indexed by the it's id field
    this.its = new Object();

    this.inserted = false;

    this.listeners = new Array();
}

/**
 * inserts the TabSet into the enclosing document's DOM tree
 */
TabSet.prototype.insertIntoDocument = function(aDocument, anInsertionPoint) {
    this.document = aDocument;
    this.insertionPoint = anInsertionPoint;
    if (JsUtil.isGood(this.insertionPoint)) {
        JsUtil.clearChildNodes(this.insertionPoint);
    } else {
        alert("Problem with insertionPoint.");
    }

    this.tabContainer = this.document.createElement("div");
    this.tabContainer.id = "tabs-main-container";
    this.tabContainer.className = "settab-container";
    if (is_ie5up) {
        this.tabContainer.setAttribute("oncontextmenu", new Function("return false;"));
        this.tabContainer.setAttribute("onselectstart", new Function("return false;"));
    } else {
        this.tabContainer.setAttribute("oncontextmenu", "return false;");
        this.tabContainer.setAttribute("onselectstart", "return false;");
        this.tabContainer.setAttribute("onmouseup", "return false;");
    }
    this.insertionPoint.appendChild(this.tabContainer);

    this.tabWrap = this.document.createElement("div");
    this.tabWrap.className = "settab-wrap";
    this.tabContainer.appendChild(this.tabWrap);

    this.tabClear = this.document.createElement("br");
    this.tabClear.className = "settab-clear";
    this.tabWrap.appendChild(this.tabClear);

    this.tabPaneWrap = this.document.createElement("div");
    this.tabPaneWrap.className = "settab-pane-wrap";
    this.tabContainer.appendChild(this.tabPaneWrap);

    for (var idx = 0; idx < this.itsByOrder.length;++idx) {
        // get the it
        var it = this.itsByOrder[idx];
        this.renderNewTab(it);
    }

    this.inserted = true;
}

/**
 * add a TabListener for this TabSet
 */
TabSet.prototype.addTabListener = function(aTabListener) {
   if (!JsUtil.arrayContains(this.listeners, aTabListener)) {
      this.listeners[this.listeners.length] = aTabListener;
   }
}

/**
 * remove a TabListener from this TabSet
 */
TabSet.prototype.removeTabListener = function(aTabListener) {
    this.listeners = JsUtil.removeElementFromArrayByValue(this.listeners, aTabListener);
}

/**
 * add a TabSetIt to this TabSet
 */
TabSet.prototype.addTab = function(anIt) {
    if (JsUtil.isGood(this.its[anIt.id])) {
        // it already exists in this TabSet
        return;
    }

    this.its[anIt.id] = anIt;
    this.itsByOrder[this.itsByOrder.length] = anIt;
    anIt.setParent(this);

    if (this.inserted) {
        this.renderNewTab(anIt);
    }

   return anIt;
}

/**
 * instantiates a TabSetIt and adds it to this TabSet
 */
TabSet.prototype.createAndAddTab = function(anId, aName, aUrl) {
    var it = new TabSetIt(anId, aName, aUrl);
    return this.addTab(it);
}

/**
 * selects a TabSetIt by id
 */
TabSet.prototype.select = function(anId) {
    var it = this.its[anId];
    it.selected = true;
    it.dom.tabDiv.className = "settab settab-focused";
    it.dom.tabPaneDiv.style.display = "block";
    if (is_ie && !is_ie5up) {
      it.dom.tabPaneIframe.src = it.dom.tabPaneIframe.src;
    }

    if (JsUtil.isGood(this.currentTab) && this.currentTab != it) {
        this.currentTab.selected = false;
        this.currentTab.dom.tabDiv.className = "settab settab-unfocused";
        this.currentTab.dom.tabPaneDiv.style.display = "none";
    }

    this.currentTab = it;
}

/**
 * get a TabSetIt by id
 */
TabSet.prototype.getTab = function(anId) {
    return this.its[anId];
}

/**
 * selects the first TabSetIt in this TabSet
 */
TabSet.prototype.selectFirstTab = function(notifyListeners) {
   if (notifyListeners) {
      this.tabWasSelected(this.itsByOrder[0].id);
   } else {
      this.select(this.itsByOrder[0].id);
   }
}

/**
 * selects the last TabSetIt in this TabSet
 */
TabSet.prototype.selectLastTab = function(notifyListeners) {
   if (notifyListeners) {
      this.tabWasSelected(this.itsByOrder[this.itsByOrder.length-1].id);
   } else {
      this.select(this.itsByOrder[this.itsByOrder.length-1].id);
   }
}

/**
 * @private
 */
TabSet.prototype.renderNewTab = function(anIt) {
    var fnBody = "TabSet.tabWasSelected(event)";

    // create the top-level div for the tab
    var tabDiv = this.document.createElement("div");
    tabDiv.origId = anIt.id;
    tabDiv.id = anIt.id + "-tab";
    tabDiv.className = "settab settab-unfocused";
    tabDiv.tabSet = anIt.tabSet;
    if (is_ie5up) {
        tabDiv.setAttribute("onclick", new Function(fnBody));
    } else {
        tabDiv.setAttribute("onclick", fnBody);
    }
    this.tabWrap.insertBefore(tabDiv, this.tabClear);
    anIt.dom.tabDiv = tabDiv;  // assign the element to its place in the dom subtree
    // create the left sliding-curtain span
    var tabSpan = this.document.createElement("span");
    tabSpan.className = "settab-bg-left";
    tabDiv.appendChild(tabSpan);
    anIt.dom.tabSpan = tabSpan;  // assign the element to its place in the dom subtree
    // create the a tag for the right sliding-curtain
    var tabA = this.document.createElement("a");
    tabA.id = anIt.id + "-tabA";
    tabA.href = anIt.url;
    tabA.title = anIt.name + "\n\n" + applicationResources.getProperty("hotkey.tooltip.gotoNextTab") + "\n" + applicationResources.getProperty("hotkey.tooltip.gotoPrevTab");
    if (is_ie5up) {
        tabA.setAttribute("onclick", new Function("return false;"));
    } else {
        tabA.setAttribute("onclick", "return false");
    }

    tabA.innerHTML = '<nobr>' + anIt.name + '</nobr>';
    tabDiv.appendChild(tabA);
    anIt.dom.tabA = tabA;  // assign the element to its place in the dom subtree

    // create the pane section for this tab
    var tabPaneDiv = this.document.createElement("div");
    tabPaneDiv.id = anIt.id;
    tabPaneDiv.className = "settab-pane";
    tabPaneDiv.style.display = "none";
    tabPaneDiv.style.height = "100%";
    this.tabPaneWrap.appendChild(tabPaneDiv);
    anIt.dom.tabPaneDiv = tabPaneDiv;  // assign the element to its place in the dom subtree
    // create the inner frame
    var tabPaneIframe = this.document.createElement("iframe");
    tabPaneIframe.id = anIt.getIframeId();
    tabPaneIframe.name = anIt.getIframeId();
    tabPaneIframe.style.height = "100%";
    tabPaneIframe.style.width = "100%";
    tabPaneIframe.src = anIt.url;

    tabPaneIframe.tab = anIt; // reference from iframe -> tab...
    tabPaneDiv.appendChild(tabPaneIframe);

    tabPaneDiv.appendChild(tabPaneIframe);
    anIt.dom.tabPaneIframe = tabPaneIframe;  // assign the element to its place in the dom subtree
    if(self.frames[tabPaneIframe.id].name != tabPaneIframe.id) { /* *** IMPORTANT: This is a BUG FIX for Internet Explorer *** */ self.frames[tabPaneIframe.id].name = tabPaneIframe.id; }
}

/**
 * removes the currently-selected TabSet from this TabSetIt
 */
TabSet.prototype.removeCurrentTab = function() {
   var it = this.currentTab;
   this.tabWrap.removeChild(it.dom.tabDiv);
   this.tabPaneWrap.removeChild(it.dom.tabPaneDiv);

   var position = TabSet.arrayIndexOf(this.itsByOrder, it);
   this.itsByOrder = JsUtil.removeElementFromArrayByValue(this.itsByOrder, it);
   delete this.its[it.id];

   if (position >= this.itsByOrder.length) {
      position = this.itsByOrder.length - 1;
   }
   if (position >= 0) {
      this.tabWasSelected(this.itsByOrder[position].id);
   }
}

/**
 * returns a count of the number of TabSetIts in this TabSet
 * @return the number of TabSetIts
 */
TabSet.prototype.getNumberOfTabs = function() {
   return this.itsByOrder.length;
}

/**
 * responsible for firing events to listeners
 */
TabSet.prototype.tabWasSelected = function(anId) {
   this.select(anId);
    var it = this.its[anId];
    for (var idx = 0; idx < this.listeners.length; ++idx) {
        this.listeners[idx].tabWasSelected(it);
    }
}

/**
 * static method that dispatches to appropriate non-static method by same name
 */
TabSet.tabWasSelected = function(event) {
    var wrap = new Object();
    var evt = event ? event : window.event;
    var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
    source = TabSet.getFirstAncestorOrSelfByClassName(source, new String("settab"));
    // get the TabSet responsible for the clicked tab
    source.tabSet.tabWasSelected(source.origId);
    try {
        evt.consume();
    } catch (e) { // swaller this
    }                            
}

/**
 * @private
 */
TabSet.getFirstAncestorOrSelfByClassName = function (target, className) {
    var parent = target;

    do {
        if (target.nodeType == Node.ELEMENT_NODE && TabSet.hasClassName(parent,className)) {
            return parent;
        }
    } while (parent = parent.parentNode);

	return null;
}

/**
 * @private
 */
TabSet.hasClassName = function (target,className) {
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

/**
 * @private
 */
TabSet.arrayIndexOf = function(anArray, aVal) {
   for(var i = 0; i < anArray.length ; i++){
      if (anArray[i] == aVal)
         return i;
   }
   return -1;
}