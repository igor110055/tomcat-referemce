/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function ViewerA11YHelper(oCV) {
	this.m_oCV = oCV;
}

ViewerA11YHelper.prototype.onFocus = function(evt) {
	var targetNode = getCrossBrowserNode(evt);
	targetNode = ViewerA11YHelper.findChildOfTableCell(targetNode);
	this.updateCellAccessibility(targetNode, false);
};

ViewerA11YHelper.prototype.onKeyDown = function(evt) {
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	var srcNode = getCrossBrowserNode(evt);

	// In IE, if the user clicked on the white space instead of the text in a cell, the srcNode
	// will point to the TD or TH. Get the span within the TD or TH
	if (ViewerA11YHelper.isTableCell(srcNode)) {
		for (var i=0; i < srcNode.childNodes.length; i++) {
			if (srcNode.childNodes[i].nodeName.toLowerCase() == "span") {
				srcNode = srcNode.childNodes[i];
				break;
			}
		}
	}

	// if the event didn't come from an element we'd select then let it bubble up
	if (!this.isValidNodeToSelect(srcNode)) {
		return true;
	}

	srcNode = ViewerA11YHelper.findChildOfTableCell(srcNode);

	if (srcNode) {
		if (evt.keyCode == "39") {	// right arrow
			if (this.m_oCV.getState() && this.m_oCV.getState().getFindState() && evt.ctrlKey && evt.shiftKey ) { // Ctrl+Shilf+ right arrow
				this.m_oCV.executeAction("FindNext");
			} else {
				this.moveRight(srcNode);
			}
			return stopEventBubble(evt);
		}
		else if (evt.keyCode == "37") {	// left arrow
			this.moveLeft(srcNode);
			return stopEventBubble(evt);
		}
		else if (evt.keyCode == "38") { // up arrow
			this.moveUp(srcNode);
			return stopEventBubble(evt);
		}
		else if (evt.keyCode == "40") { // down arrow
			this.moveDown(srcNode);
			return stopEventBubble(evt);
		}
		else if (evt.keyCode == "13") { // enter
			if (this.m_oCV.isBux) {
				 
				if( this.m_oCV.getViewerWidget().isSelectionFilterEnabled() ){
					this.m_oCV.getViewerWidget().preprocessPageClicked( false /*invokingContextMenu*/, evt);
					if( this.m_oCV.getSelectionController().pageClicked(evt) !== false ){
						this.m_oCV.JAWSTalk( RV_RES.IDS_JS_SELECTION_FILTER_INFO_JAWS );
						this.m_oCV.getViewerWidget().updateToolbar();	
					}
				} else {
					this.m_oCV.getSelectionController().pageClicked(evt);				
					var selectionAction = this.m_oCV.getActionFactory().load("Selection");
					selectionAction.onKeyDown(evt);
				}

				this.m_oCV.getViewerWidget().onSelectionChange();
			} else {
				this.m_oCV.de(evt);
			}
		}
		else if (evt.keyCode == "32") { // space
			if( this.m_oCV.isBux )
			{	
				this.m_oCV.getViewerWidget().preprocessPageClicked( false /*invokingContextMenu*/);	
				if( this.m_oCV.getSelectionController().pageClicked(evt) !== false &&  this.m_oCV.getViewerWidget().isSelectionFilterEnabled() )
				{
						this.m_oCV.JAWSTalk( RV_RES.IDS_JS_SELECTION_FILTER_INFO_JAWS );
				}
				this.m_oCV.getViewerWidget().updateToolbar();
				this.m_oCV.getViewerWidget().onSelectionChange();
			
			} else {
				this.m_oCV.getSelectionController().pageClicked(evt);
			}
			return stopEventBubble(evt);
		}
		else if(evt.keyCode == "46" && this.m_oCV.isBux) { // delete key
			if (typeof this.m_oCV.envParams != "undefined" &&
				typeof this.m_oCV.envParams["ui.action"] != "undefined" &&
				this.m_oCV.envParams["ui.action"] != "view" &&
				!this.m_oCV.isLimitedInteractiveMode())
			{
				var deleteAction = this.m_oCV.getActionFactory().load("Delete");
				if(!this.m_oCV.isBlacklisted("Delete") && deleteAction.canDelete())
				{
					deleteAction.execute();
					return stopEventBubble(evt);
				}
			}
		}
		else if (this.m_oCV.isBux && evt.ctrlKey == true && evt.shiftKey == true && evt.keyCode == "49") { // Ctrl + shift + !
			var lid = this.m_oCV.getSelectionController().getSelectionObjectFactory().getLayoutElementId(srcNode);

			if (lid != "") {
				// get the lid without the Viewer id appended to it.
				lid = lid.split(this.m_oCV.getId())[0];
				var containerIdx = -1;
				var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
				
				if (oRAPReportInfo) {
					var container = oRAPReportInfo.getContainer(lid);
					if (typeof container.layoutIndex != "undefined") {
						containerIdx = container.layoutIndex;
					}
				}

				var infoBarHeaderButton = document.getElementById("infoBarHeaderButton" + containerIdx + this.m_oCV.getId());
				if (infoBarHeaderButton !== null) {
					this.m_oCV.setCurrentNodeFocus(getCrossBrowserNode(evt));
					infoBarHeaderButton.focus();
				}
			}

			return stopEventBubble(evt);
		}
		else if (!this.m_oCV.isBux && evt.shiftKey == true && evt.keyCode == "121") {	// Shift - F10 (context menu) -- standalone viewer
			//Only cover Shift + F10. Menu button is already covered by the body's onContextMenu callback.
			var ocv = this.m_oCV;
			var openContextMenu = function() {
				//Some browsers don't populate the evt.clientX/Y fields on keyboard
				//events, which the display content menu function requires.
				if (typeof evt.clientX == "undefined" || typeof evt.clientY == "undefined") { 
					var coords = clientToScreenCoords(evt.target, document.body);
					evt.clientX = coords.leftCoord;
					evt.clientY = coords.topCoord;
				}
				ocv.dcm(evt, true);
			};
			
			if(isFF()) {
				//In FF, need to invoke this code after this thread's execution is done.
				setTimeout(openContextMenu, 0);
			} else {
				//Other browsers, should invoke right away
				//(Espcially IE, where evt's state is cleared after)
				openContextMenu.call();
			}
			
			//Swallow event so browser's context menu is not shown
			return stopEventBubble(evt);
		}
		else if (this.m_oCV.isBux && (evt.keyCode == "93" || (evt.shiftKey == true && evt.keyCode == "121"))) {  // Shift - F10 / menu button (context menu) -- BUX
			
			var viewerWidget = this.m_oCV.getViewerWidget();
			var selectionController = this.m_oCV.getSelectionController();
			viewerWidget.preprocessPageClicked( true /*invokingContextMenu*/);
			selectionController.pageClicked(evt);
			viewerWidget.updateToolbar();
			viewerWidget.onContextMenu(evt);
		}
	}	
};

ViewerA11YHelper.prototype.isValidNodeToSelect = function(node) {
	return this.getValidNodeToSelect(node) ? true : false;
};

ViewerA11YHelper.prototype.getValidNodeToSelect = function(node) {
	if (node && node.style && node.style.visibility != "hidden" && node.style.display != "none") {
		var sNodeName = node.nodeName.toLowerCase();
		if (
			(sNodeName == "span" && (!node.getAttribute("class") || node.getAttribute("class").indexOf("expandButton") === -1)) ||
			(sNodeName == "div" && node.getAttribute("flashchartcontainer") == "true") ||
			(sNodeName == "div" && node.getAttribute("chartcontainer") == "true") ||
			(sNodeName == "img" && (!node.id || node.id.indexOf("sortimg") !== 0 ))
		) {
			return node;
		}
		if (ViewerA11YHelper.isSemanticNode(node)) {
			var child = node.childNodes && node.childNodes.length ? node.childNodes[0] : null;
			if(child) {
				return this.getValidNodeToSelect(child);
			}
		}
	}
	return null;
};

ViewerA11YHelper.isSemanticNode = function(node) {
	if(!ViewerA11YHelper.isSemanticNode._semanticNodeNames) {
		ViewerA11YHelper.isSemanticNode._semanticNodeNames = [
			"strong", "em", "h1", "h2", "h3", "h4", "h5", "h6"
		];
	}
	
	var sNodeName = node.nodeName.toLowerCase();
	
	for(var i = 0; i < ViewerA11YHelper.isSemanticNode._semanticNodeNames.length; i++) {
		if(sNodeName === ViewerA11YHelper.isSemanticNode._semanticNodeNames[i]) {
			return true;
		}
	}
	
	return false;
};

ViewerA11YHelper.isTableCell = function(node) {
	var sNodeName = node.nodeName.toLowerCase();
	return sNodeName === "td" || sNodeName === "th";
};

ViewerA11YHelper.findChildOfTableCell = function(startNode) {
	var srcNode = startNode;

	while(srcNode && srcNode.parentNode) {
		if (ViewerA11YHelper.getTableCell(srcNode)) {
			break;
		}
		srcNode = srcNode.parentNode;
	}

	return srcNode;
};

ViewerA11YHelper.getTableCell = function(node) {
	var parent = node.parentNode;
	if(ViewerA11YHelper.isTableCell(parent)) {
		return parent;
	}
	//Treat a semantic node under the <td> as parent of the <td>
	if (ViewerA11YHelper.isSemanticNode(parent) && ViewerA11YHelper.isTableCell(parent.parentNode)) {
		return parent.parentNode;
	}
	return null;
};

ViewerA11YHelper.prototype.moveRight = function(srcNode) {
	var nextNode = this.getNextNonTextSibling(srcNode);
	nextNode = this.getValidNodeToSelect(nextNode);
	// case where we have multiple spans inside a td
	if (nextNode) {
		this.setFocusToNode(nextNode);
		return true;
	}

	var tdNode = ViewerA11YHelper.getTableCell(srcNode);
	tdNode = this.getPfMainOutputCell(tdNode);
	
	while (tdNode.nextSibling) {
		if (this.moveToTD(tdNode.nextSibling)) {
			return true;
		}
		tdNode = tdNode.nextSibling;
	}

	var trNode = tdNode.parentNode;
	while (trNode.nextSibling) {
		var nextTR = trNode.nextSibling;
		if (this.moveToTD(nextTR.childNodes[0])) {
			return true;
		}
		trNode = trNode.nextSibling;
	}

	return false;
};

ViewerA11YHelper.prototype.moveLeft = function(srcNode) {
	var previousNode = this.getPreviousNonTextSibling(srcNode);
	previousNode = this.getValidNodeToSelect(previousNode);
	// case where we have multiple spans inside a td
	if (previousNode) {
		this.setFocusToNode(previousNode);
		return true;
	}

	var tdNode = ViewerA11YHelper.getTableCell(srcNode);
	tdNode = this.getPfMainOutputCell(tdNode);

	while (tdNode.previousSibling) {
		if (this.moveToTDFromTheRight(tdNode.previousSibling)) {
			return true;
		}
		tdNode = tdNode.previousSibling;
	}

	var trNode = tdNode.parentNode;
	while (trNode.previousSibling) {
		var previousTR = trNode.previousSibling;
		if (this.moveToTDFromTheRight(previousTR.lastChild)) {
			return true;
		}
		trNode = trNode.previousSibling;
	}

	return false;
};

ViewerA11YHelper.prototype.moveDown = function(srcNode) {
	var tdNode = ViewerA11YHelper.getTableCell(srcNode);
	tdNode = this.getPfMainOutputCell(tdNode);
	
	var srcColSpan = this.getColumnIndex(tdNode);
	srcColSpan += this.getColSpanFromRowSpans(tdNode);

	// if the current node has a rowSpan, we need to jump over a bunch of TR's
	var trNode = tdNode.parentNode;
	if (tdNode.rowSpan && tdNode.rowSpan > 1) {
		var nodeRowSpan = tdNode.rowSpan;
		for (var rowSpanIndex=1; rowSpanIndex < nodeRowSpan; rowSpanIndex++) {
			trNode = trNode.nextSibling;
		}
	}
	var bTriedNextColumn = false;

	while(trNode) {
		if (trNode.nextSibling) {	// get the next TR
			trNode = trNode.nextSibling;
		} else if (tdNode.nextSibling && !bTriedNextColumn) {	// move to the next column
			trNode = trNode.parentNode.firstChild;
			bTriedNextColumn = true;
			srcColSpan++;
		} else {  // last span is selected
			return false;
		}

		if (this.doMoveUpDown(trNode, srcColSpan)) {
			return true;
		}
	}

	return false;
};

ViewerA11YHelper.prototype.moveUp = function(srcNode) {
	var tdNode = ViewerA11YHelper.getTableCell(srcNode);
	tdNode = this.getPfMainOutputCell(tdNode);
	
	var trNode = tdNode.parentNode;
	var srcColSpan = this.getColumnIndex(tdNode);
	srcColSpan += this.getColSpanFromRowSpans(tdNode);

	var bTriedPreviousColumn = false;

	while(trNode) {
		if (trNode.previousSibling) {	// get the next TR
			trNode = trNode.previousSibling;
		} else if (tdNode.previousSibling && !bTriedPreviousColumn) {	// move to the next column
			trNode = trNode.parentNode.lastChild;
			bTriedPreviousColumn = true;
			srcColSpan--;
		} else {  // last span is selected
			return false;
		}

		if (this.doMoveUpDown(trNode, srcColSpan)) {
			return true;
		}
	}

	return false;
};

ViewerA11YHelper.prototype.getNextNonTextSibling = function(node) {
	while (node.nextSibling) {
		node = node.nextSibling;
		if (node.nodeName.toLowerCase() != '#text') {
			return node;
		}
	}
	
	if (ViewerA11YHelper.isSemanticNode(node.parentNode)) {
		return this.getNextNonTextSibling(node.parentNode);
	}

	return null;
};

ViewerA11YHelper.prototype.doMoveUpDown = function(trNode, srcColSpan) {
	if (trNode != null) {
		var currentColumn = trNode.firstChild;

		var pos = this.getColSpanFromRowSpans(currentColumn);

		while (currentColumn) {
			if (pos == srcColSpan) {
				return this.moveToTDFromTheRight(currentColumn);
			} else if (pos > srcColSpan) {
				break;
			}

			var nodeColSpan = 0;
			if (currentColumn.colSpan) {
				nodeColSpan = currentColumn.colSpan;
			} else {
				nodeColSpan++;
			}

			pos += nodeColSpan;

			currentColumn = currentColumn.nextSibling;
		}
	}
};

ViewerA11YHelper.prototype.moveToTDFromTheRight = function(td) {

	td = this.getPfVisibleCell(td);

	var childNodes = td.childNodes;
	for (var iChildIndex=childNodes.length-1; iChildIndex >= 0; iChildIndex--) {
		var node = this.getValidNodeToSelect(childNodes[iChildIndex]);
		if (node) {
			// sometimes have a span inside a span
			if (node.childNodes && node.childNodes[0] && node.childNodes[0].nodeName.toLowerCase() == "span") {
				node = node.childNodes[0];
			}

			if (node.tabIndex != -1 && node.tabIndex != 0) {
				node.tabIndex = -1;
			}

			this.setFocusToNode(node);
			return true;
		}
	}

	return false;
};

ViewerA11YHelper.prototype.moveToTD = function(td) {
	td = this.getPfVisibleCell(td);

	var childNodes = td.childNodes;
	for (var iChildIndex=0; iChildIndex < childNodes.length; iChildIndex++) {
		var node = this.getValidNodeToSelect(childNodes[iChildIndex]);
		if (node) {
			// sometimes have a span inside a span
			if (node.childNodes && node.childNodes[0] && node.childNodes[0].nodeName.toLowerCase() == "span") {
				node = node.childNodes[0];
			}

			if (node.tabIndex != -1 && node.tabIndex != 0) {
				node.tabIndex = -1;
			}

			this.setFocusToNode(node);
			return true;
		}
	}

	return false;
};

ViewerA11YHelper.prototype.setFocusToNode = function(node) {
	this.m_oCV.setCurrentNodeFocus(node);
	this.updateCellAccessibility(node, false);
	node.focus();

	if(this.m_oCV.m_pinFreezeManager) {
		var container = this.m_oCV.m_pinFreezeManager.nodeToContainer(node);
		if(container) {
			container.updateScroll(node);
		}
	}
};

/**
 * Given an element, return the main it is based on. This may be itself.
 */
ViewerA11YHelper.prototype.getPfMainOutputCell = function(element) {
	var main = null

	var slid = element.getAttribute("pfslid");
	if(slid) {
		var lid = PinFreezeContainer.getLidFromSlid(slid);
		if(lid && this.m_oCV.m_pinFreezeManager) {
			lid = this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
			var container = this.m_oCV.m_pinFreezeManager.getContainer(lid);
			if(container) {
				main = container.getMain(element);
			}
		}
	}

	return main ? main : element;
};

ViewerA11YHelper.prototype.getPreviousNonTextSibling = function(node) {
	while (node.previousSibling) {
		node = node.previousSibling;
		if (node.nodeName.toLowerCase() != '#text') {
			return node;
		}
	}

	if (ViewerA11YHelper.isSemanticNode(node.parentNode)) {
		return this.getPreviousNonTextSibling(node.parentNode);
	}

	return null;
};

/**
 * Returns the column index of the node with all the colspans.
 * This function excludes any td's that have a rowspan
 */
ViewerA11YHelper.prototype.getColumnIndex = function(node) {
	var colIndex = 0;

	while (node.previousSibling) {
		node = node.previousSibling;

		if (node.rowSpan == 1) {
			if (node.colSpan) {
				colIndex += node.colSpan;
			} else {
				colIndex++;
			}
		}
	}

	return colIndex;
};

/**
 * Given an element, return the visible copy of it. This may be itself.
 */
ViewerA11YHelper.prototype.getPfVisibleCell = function(element) {
	var copy = null;

	var slid = element.getAttribute("pfslid");
	if(slid) {
		var lid = PinFreezeContainer.getLidFromSlid(slid);

		if(lid && this.m_oCV.m_pinFreezeManager) {
			lid = this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
			var container = this.m_oCV.m_pinFreezeManager.getContainer(lid);
			if(container) {
				copy = container.getCopy(element);
			}
		}
	}

	return copy ? copy : element;
};

ViewerA11YHelper.prototype.updateCellAccessibility = function(srcNode, force) {
	if (!srcNode) {
		return false;
	}
	var canDrillDown = false;
	var canDrillUp = false;
	var canDrillThrough = false;
	var ctxNode = srcNode.getAttribute("ctx") != null ? srcNode : srcNode.parentNode;

	if (srcNode.getAttribute("flashChartContainer") != "true") {
		if (ctxNode.getAttribute("ctx") != null) {
			if (this.m_oCV.isBux) {
				var action = this.m_oCV.getAction("DrillUpDown");
				action.updateDrillability(this.m_oCV, ctxNode);
				canDrillDown = action.canDrillDown();
				canDrillUp = action.canDrillUp();
			} else {
				var ctxAttribute = ctxNode.getAttribute("ctx");
				var ctxID = ctxAttribute.indexOf(':') == -1 ? ctxAttribute : ctxAttribute.substring(0, ctxAttribute.indexOf(":"));
				var selCon = this.m_oCV.getSelectionController();
				canDrillDown = selCon.canDrillDown(ctxID);
				canDrillUp = selCon.canDrillUp(ctxID);
			}
		}

		canDrillThrough = srcNode.parentNode.getAttribute("dtTargets") ? true : false;
	}

	var isImage = srcNode.nodeName.toLowerCase() == "img";
	var isColumnTitle = srcNode.parentNode.getAttribute("type") == "columnTitle";
	if ( !isImage && (force || ((srcNode.getAttribute("aria-labelledby") != null || isColumnTitle || this.m_oCV.isAccessibleMode())))) {

		var innerHTML = "";

		// crosstab corner
		if (srcNode.parentNode.getAttribute("cc") == "true") {
			innerHTML += " " + RV_RES.IDS_JS_CROSSTAB_CORNER;
		}

		if (srcNode.innerHTML.length === 0) {
			innerHTML += " " + RV_RES.IDS_JS_EMPTY_CELL;
		}

		if (canDrillDown && canDrillUp) {
			innerHTML += " " + RV_RES.IDS_JS_DRILL_DOWN_UP_JAWS;
		} else if (canDrillDown) {
			innerHTML += " " + RV_RES.IDS_JS_DRILL_DOWN_JAWS;
		} else if (canDrillUp) {
			innerHTML += " " + RV_RES.IDS_JS_DRILL_UP_JAWS;
		}

		if (canDrillThrough) {
			innerHTML += " " + RV_RES.IDS_JS_DRILL_THROUGH_JAWS;
		}

		if (srcNode.altText && srcNode.altText.length > 0) {
			innerHTML = srcNode.altText;
		} else if (srcNode.getAttribute("flashChartContainer") == "true") {
			innerHTML = RV_RES.IDS_JS_CHART_IMAGE;
		}


		if( this.m_oCV.isBux ) {
			var sibling = srcNode.previousSibling;
			if (sibling) {
				var wid = sibling.getAttribute("widgetid");
				if (wid && wid.indexOf("comment")) {
					innerHTML += " " + RV_RES.IDS_JS_ANNOTATION_JAWS;
				}
			}

			if (srcNode.getAttribute("rp_name") || srcNode.parentNode.getAttribute("rp_name")) {
				innerHTML += " " + RV_RES.IDS_JS_LABEL_HAS_BEEN_RENAMED;
			}

			if (srcNode.nextSibling && srcNode.nextSibling.getAttribute("class") == "sortIconVisible") {
				innerHTML += " " + srcNode.nextSibling.getAttribute("alt");
			}
		}

		// is there any extra information that JAWS needs to speak out
		if (innerHTML.length > 0) {
			this.addAriaLabelledByOnCell(srcNode, innerHTML);
		}
	}

	if (canDrillUp || canDrillDown || canDrillThrough) {
		this.addDrillAccessibilityAttributes(srcNode, canDrillThrough);
	}

	if(srcNode.attachEvent) {
		srcNode.attachEvent("onblur", this.onBlur);
	} else {
		srcNode.addEventListener("blur", this.onBlur, false);
	}

	if ((isIE() && srcNode.getAttribute("tabIndex") != 0) || isImage) {
		srcNode.setAttribute("modifiedTabIndex", "true");
		srcNode.setAttribute("oldTabIndex", srcNode.getAttribute("tabIndex"));
		srcNode.setAttribute("tabIndex", 0);
	}

};

ViewerA11YHelper.prototype.addAriaLabelledByOnCell = function(srcNode, labelledBy) {
	// can have multiple spans inside a td, get the position to help make the id unique
	var srcNodePos = 0;
	var tempNode = srcNode;
	while (tempNode.previousSibling) {
		srcNodePos++;
		tempNode = tempNode.previousSibling;
	}

	var hiddenSpanId = srcNode.getAttribute("ariaHiddenSpanId");

	// if we already have a hidden span, use it
	if (hiddenSpanId && document.getElementById(hiddenSpanId)) {
		document.getElementById(hiddenSpanId).innerHTML = labelledBy;
	}
	else {
		if (!srcNode.parentNode.id && !srcNode.id) {
			srcNode.parentNode.id = Math.random();
		}
		
		var newSpan = document.createElement("span");
		newSpan.style.visibility = "hidden";
		newSpan.style.display = "none";
		newSpan.id = (srcNode.id == "" ? srcNode.parentNode.id : srcNode.id) + "_" + srcNodePos;
		newSpan.innerHTML = labelledBy;
		srcNode.parentNode.appendChild(newSpan);

		var ariaLabelledBy = "";
		if (srcNode.getAttribute("aria-labelledby") != null) {
			ariaLabelledBy += srcNode.getAttribute("aria-labelledby");
		} else {
			if (srcNode.id == "") {
				srcNode.id = srcNode.parentNode.id + "_main_" + srcNodePos;
			}
			ariaLabelledBy += srcNode.id;
		}

		ariaLabelledBy += " " + newSpan.id;

		srcNode.setAttribute("aria-labelledby", ariaLabelledBy);
		srcNode.setAttribute("ariaHiddenSpanId", newSpan.id);
	}
};

ViewerA11YHelper.prototype.addDrillAccessibilityAttributes = function(srcNode, canDrillThrough) {
	if (!srcNode.getAttribute("oldClassName")) {
		// drill throughs already have a link
		if (!canDrillThrough) {
			srcNode.setAttribute("oldClassName", srcNode.className);
			srcNode.className = "dl " + srcNode.className;
		}
		
		if (!srcNode.getAttribute("role")) {
			srcNode.setAttribute("role", "link");			
		}
	}
};

ViewerA11YHelper.prototype.onBlur = function(evt) {
	var srcNode = null;
	if(isIE()) {
		srcNode = getNodeFromEvent(evt, true);
	} else {
		srcNode = this;
	}

	srcNode = ViewerA11YHelper.findChildOfTableCell(srcNode);

	if (srcNode) {
		if (srcNode.getAttribute("oldClassName")) {
			srcNode.className = srcNode.getAttribute("oldClassName");
			srcNode.removeAttribute("oldClassName");
		}

		if (srcNode.getAttribute("modifiedTabIndex") == "true") {
			srcNode.removeAttribute("modifiedTabIndex");
			srcNode.removeAttribute("tabIndex");
			if (srcNode.getAttribute("oldTabIndex")) {
				srcNode.setAttribute("tabIndex", srcNode.getAttribute("oldTabIndex"));
			}
			srcNode.removeAttribute("oldTabIndex");
		}

		// blank out any extra info for JAWS when we leave the cell.
		var ariaSpanId = srcNode.getAttribute("ariaHiddenSpanId");
		if (ariaSpanId)
		{
			var ariaSpanEle = document.getElementById(ariaSpanId);
			if (ariaSpanEle)
			{
				ariaSpanEle.innerHTML = "";
			}
		}
	}
};

/**
 * Method that walks the tree from the given TD and calculates
 * the colspans that are from TD's with rowspan's on them
 */
ViewerA11YHelper.prototype.getColSpanFromRowSpans = function(tdNode) {
	var nodeColSpan = 0;
	var trNode = tdNode.parentNode;
	var trChildCount = 0;

	while (trNode) {
		var rowChildNode = trNode.firstChild;
		// if there's a diff in the #of columns, we must of found a new TD with a rowspan
		var colCountDiff = this.getColumnCount(trNode) - trChildCount;
		while (rowChildNode && rowChildNode.rowSpan > 1 && colCountDiff > 0 && rowChildNode != tdNode) {
			nodeColSpan += rowChildNode.colSpan;
			rowChildNode = rowChildNode.nextSibling;
			colCountDiff--;
		}

		// never decrease the column count, only increase it
		if (trNode.childNodes.length > trChildCount) {
			trChildCount = this.getColumnCount(trNode);
		}

		// get the previous TR.. keep walking the DOM
		trNode = trNode.previousSibling;
	}

	return nodeColSpan;
};

/**
 * Gets the column count for the given TR which includes all the colspans
 */
ViewerA11YHelper.prototype.getColumnCount = function(trNode) {
	var columnCount = 0;
	var node = trNode.firstChild;
	while (node) {
		columnCount += node.colSpan;
		node = node.nextSibling;
	}

	return columnCount;
};

/**
 * Sets up the aria labelledBy for cells outside of a data container (list/crosstab)
 */
ViewerA11YHelper.prototype.addLabelledByForItemsOutsideOfContainers = function() {
	// Only needs to be done when accesibility preference is set
	if (!this.m_oCV.isAccessibleMode()) {
		return;
	} 
	
	var content = document.getElementById("RVContent" + this.m_oCV.getId());
	if (!content) {
		return;
	}
	
	// Get all the spans that have a tabinex of 0. This should be a small list
	var focusableSpans = getElementsByAttribute(content, "span", "tabindex", "0");
	if (!focusableSpans) {
		return;
	}
	
	for (var i=0; i < focusableSpans.length; i++) {
		var span = focusableSpans[i];
		this.updateCellAccessibility(span, false);
	}
	
	
};