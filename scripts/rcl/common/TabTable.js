/**
 * the TabListener interface
 */

function TabTableListener() {
}

TabTableListener.prototype.tabWasSelected = function(aTabTableIt) {
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
* a TabTable "it", where TabTable exposes a list-like interface for tabs, a list composed of "it"
*/

function TabTableIt(anId, aName, aUrl) {
    this.id = anId;
    this.name = aName;
    this.url = aUrl;
    this.selected = false;
    this.dom = new Object();
    this.tabSet = null;
}

TabTableIt.prototype.setParent = function(aTabTable) {
    this.tabSet = aTabTable;
}

TabTableIt.prototype.changeUrl = function(aUrl) {
   this.url = aUrl;
   this.tabSet.document.getElementById(this.getIframeId()).setAttribute("src", this.url);
}

TabTableIt.prototype.getQualifiedName = function() {
   return this.tabSet.name + "_" + this.name;
}

TabTableIt.prototype.getIframeId = function() {
   return this.getQualifiedName() + "_Iframe";
}

function TabTable(aName) {
    this.init(aName);
}

TabTable.prototype.init = function(aName) {
    this.name = aName;

    // indexed by order in the list
    this.itsByOrder = new Array();
    // indexed by the it's id field
    this.its = new Object();

    this.inserted = false;

    this.listeners = new Array();
}

TabTable.prototype.insertIntoDocument = function(aDocument, anInsertionPoint) {
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

    for (var idx in this.itsByOrder) {
        // get the it
        var it = this.itsByOrder[idx];
        this.renderNewTab(it);
    }

    this.inserted = true;
}

TabTable.prototype.addTabListener = function(aTabListener) {
   if (!JsUtil.arrayContains(this.listeners, aTabListener)) {
      this.listeners[this.listeners.length] = aTabListener;
   }
}

TabTable.prototype.removeTabListener = function(aTabListener) {
    this.listeners = JsUtil.removeElementFromArrayByValue(this.listeners, aTabListener);
}

TabTable.prototype.addTab = function(anIt) {
    if (JsUtil.isGood(this.its[anIt.id])) {
        // it already exists in this TabTable
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

TabTable.prototype.createAndAddTab = function(anId, aName, aUrl) {
    var it = new TabTableIt(anId, aName, aUrl);
    return this.addTab(it);
}

TabTable.prototype.select = function(anId) {
    var it = this.its[anId];
    it.selected = true;
    it.dom.tabDiv.className = "settab settab-focused";
    it.dom.tabPaneDiv.style.display = "block";
    if (!is_ie5up) {
      it.dom.tabPaneIframe.src = it.dom.tabPaneIframe.src;
    }

    if (JsUtil.isGood(this.currentTab) && this.currentTab != it) {
        this.currentTab.selected = false;
        this.currentTab.dom.tabDiv.className = "settab settab-unfocused";
        this.currentTab.dom.tabPaneDiv.style.display = "none";
    }

    this.currentTab = it;
}

TabTable.prototype.selectFirstTab = function(notifyListeners) {
   if (notifyListeners) {
      this.tabWasSelected(this.itsByOrder[0].id);
   } else {
      this.select(this.itsByOrder[0].id);
   }
}

TabTable.prototype.renderNewTab = function(anIt) {
    var fnBody = "TabTable.tabWasSelected(event)";

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
    tabA.href = anIt.url;
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
    tabPaneDiv.style.height = "600px";
    this.tabPaneWrap.appendChild(tabPaneDiv);
    anIt.dom.tabPaneDiv = tabPaneDiv;  // assign the element to its place in the dom subtree
    // create the inner frame
    var tabPaneIframe = this.document.createElement("iframe");
    tabPaneIframe.id = anIt.getIframeId();
    tabPaneIframe.style.height = "100%";
    tabPaneIframe.style.width = "100%";
    tabPaneIframe.src = anIt.url;
    tabPaneDiv.appendChild(tabPaneIframe);
    anIt.dom.tabPaneIframe = tabPaneIframe;  // assign the element to its place in the dom subtree
}

TabTable.prototype.removeCurrentTab = function() {
   var it = this.currentTab;
   this.tabWrap.removeChild(it.dom.tabDiv);
   this.tabPaneWrap.removeChild(it.dom.tabPaneDiv);

   var position = TabTable.arrayIndexOf(this.itsByOrder, it);
   this.itsByOrder = JsUtil.removeElementFromArrayByValue(this.itsByOrder, it);
   delete this.its[it.id];

   if (position >= this.itsByOrder.length) {
      position = this.itsByOrder.length - 1;
   }
   if (position >= 0) {
      this.tabWasSelected(this.itsByOrder[position].id);
   }
}

TabTable.prototype.getNumberOfTabs = function() {
   return this.itsByOrder.length;
}

TabTable.prototype.tabWasSelected = function(anId) {
   this.select(anId);
    var it = this.its[anId];
    for (var idx in this.listeners) {
        this.listeners[idx].tabWasSelected(it);
    }
}

TabTable.tabWasSelected = function(event) {
    var wrap = new Object();
    var evt = event ? event : window.event;
    var source = evt.currentTarget ? evt.currentTarget : evt.srcElement;
    source = TabTable.getFirstAncestorOrSelfByClassName(source, new String("settab"));
    // get the TabTable responsible for the clicked tab
    source.tabSet.tabWasSelected(source.origId);
    try {
        evt.consume();
    } catch (e) { // swaller this
    }
}

TabTable.getFirstAncestorOrSelfByClassName = function (target, className) {
    var parent = target;

    do {
        if (target.nodeType == Node.ELEMENT_NODE && TabTable.hasClassName(parent,className)) {
            return parent;
        }
    } while (parent = parent.parentNode);

	return null;
}

TabTable.hasClassName = function (target,className) {
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

TabTable.arrayIndexOf = function(anArray, aVal) {
   for(var i = 0; i < anArray.length ; i++){
      if (anArray[i] == aVal)
         return i;
   }
   return -1;
}