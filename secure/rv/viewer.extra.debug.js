/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
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
	
	
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
/**
CDrillManager -- shared class between Query Studio and Report Viewer, which handles drill up/down and drill through
*/

function CtxArrayPlaceHolder(){}

var self = window;
// CDrillManager constructor
function CDrillManager(oCV)
{
	this.m_drawDrillTargets = false;

	this.setCV(oCV);
}

CDrillManager.prototype = new CViewerHelper();

CDrillManager.prototype.getSelectionController = function()
{
	var selectionController;
	try
	{
		selectionController = getCognosViewerSCObjectRef(this.getCV().getId());
	}
	catch(e)
	{
		selectionController = null;
	}

	return selectionController;
};

CDrillManager.prototype.getSelectedObject = function()
{
	var selectionController = this.getSelectionController();
	if(selectionController == null)
	{
		return null;
	}

	var SelObj = null;
	var selectionList = null;

	if (selectionController.hasSelectedChartNodes()) {
		selectionList = selectionController.getSelectedChartNodes();
	} else {
		selectionList = selectionController.getSelections();
	}
	if(selectionList && selectionList.length == 1) {
		SelObj = selectionList[0];
	}
	return SelObj;
};


/***************************************************************************************************

COMMON METHODS BETWEEN REPORT VIEWER AND QUERY STUDIO

****************************************************************************************************/

CDrillManager.prototype.canDrillUp = function()
{
	if(this.getDrillOption('drillUp') == true && this.hasMuns()) {
		return true;
	}

	return false;
};

CDrillManager.prototype.canDrillDown = function()
{
	if(this.getDrillOption('drillDown') == true)
	{
		return true;
	}

	return false;
};

CDrillManager.prototype.hasMuns = function(selectionObj)
{

	// if no selection object is passed in, get the current selected object from the selection controller
	if(typeof selectionObj == "undefined") {
		selectionObj = this.getSelectedObject();
	}

	if(selectionObj == null) {
		return false;
	}

	var munArray = selectionObj.getMuns();

	var muns="";
	for(var munIdx = 0; munIdx < munArray.length && muns == ""; ++munIdx)
	{
		if(typeof munArray[munIdx][0] != "undefined") {
			muns += munArray[munIdx][0];
		}
	}

	return (muns != "");
};

CDrillManager.prototype.getRefQuery = function()
{
	var refQuery = "";

	var selectionObj = this.getSelectedObject();
	if(selectionObj == null) {
		return "";
	}

	var refQueries = selectionObj.getRefQueries();
	// for area charts, having a ctx of ::1:: is valid, so look for the first non empty refQuery
	for (var i=0; i < refQueries.length; i++) {
		if (refQueries[i] != null) {
			for (var j=0; j < refQueries[i].length; j++) {
				if (refQueries[i][j] != null && refQueries[i][j] != "") {
					return refQueries[i][j];
				}
			}
		}
	}

	return refQuery;
};

CDrillManager.prototype.isIsolated = function()
{
	var selectionController = this.getSelectionController();
	if(selectionController == null || selectionController.getDrillUpDownEnabled() == false)
	{
		return false;
	}

	var selectionObj = this.getSelectedObject();
	if(selectionObj == null)
	{
		return false;
	}

	if(selectionObj instanceof CSelectionChartObject && selectionController != null)
	{
		var chartArea = selectionObj.getArea();
		if(chartArea != null)
		{
			var isolated = chartArea.getAttribute("isolated");
			if(typeof isolated != "undefined" && isolated != null && isolated == "true")
			{
				return true;
			}
		}
	}
	else
	{
		var cellRef = selectionObj.getCellRef();
		if(typeof cellRef == "object" && cellRef != null)
		{
			var spanElement = cellRef.getElementsByTagName("span");
			if(spanElement != null && typeof spanElement != "undefined" && spanElement.length > 0)
			{
				var sIsolated = spanElement[0].getAttribute("isolated");
				if(sIsolated != null && sIsolated != "undefined" && sIsolated == "true")
				{
					return true;
				}
			}
		}
	}

	return false;
};

CDrillManager.prototype.getDrillOption = function(drillOption)
{
	var selectionController = this.getSelectionController();
	if(selectionController == null || selectionController.getDrillUpDownEnabled() == false || typeof drillOption == "undefined")
	{
		return false;
	}

	var selectionObj = this.getSelectedObject();
	if(selectionObj == null)
	{
		return false;
	}

	if (this.isIsolated())
	{
		if (drillOption == "drillDown")
		{
			return false;
		}
		else if (drillOption == "drillUp")
		{
			return true;
		}
	}

	if(drillOption == "drillDown")
	{
		if(selectionObj instanceof CSelectionChartObject && selectionController != null)
		{
			var chartArea = selectionObj.getArea();
			if(chartArea != null)
			{
				var bIsChartTitle = chartArea.getAttribute("isChartTitle");
				if (typeof bIsChartTitle != "undefined" && bIsChartTitle != null && bIsChartTitle == "true")
				{
					return false;
				}
			}
		}
	}

	var drillOptions = selectionObj.getDrillOptions();
	
	//Normally, look at the level closest to the data to determine if you can drill up or down on a particular node or cell.
	//But...when the drill submenu is enabled, return true if you can drill up/down on upper levels as well...because all items are in the menu.
	var processAllLevels = (typeof DrillContextMenuHelper !== "undefined" && DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV));

	for(var idx = 0; idx < drillOptions.length; ++idx)
	{
		var maxLevel=(processAllLevels) ? drillOptions[idx].length : 1;
		for (var level = 0; level < maxLevel; ++level) {
			var currentDrillOption = drillOptions[idx][level];
			if(currentDrillOption == "3" /*drill up and down*/)
			{
				return true;
			}
			else if(drillOption == "drillUp" && currentDrillOption == "1")
			{
				return true;
			}
			else if(drillOption == "drillDown" && currentDrillOption == "2")
			{
				return true;
			}
		}
	}

	// if the drill option flag is not present, the user cannot drill on this cell
	return false;
};

CDrillManager.prototype.canDrillThrough = function()
{
	var selectionController = this.getSelectionController();
	if(selectionController == null || selectionController.getModelDrillThroughEnabled() == false)
	{
		return false;
	}

	return true;
};

/**
 * Returns true if we did a drill up/down action
 */
CDrillManager.prototype.singleClickDrillEvent = function(evt, app)
{
	var selectionController = this.getSelectionController();

	if (selectionController != null)
	{
		if(this.getCV().bCanUseCognosViewerSelection == true)
		{
			selectionController.pageClicked(evt);
		}
	}

	var node = getCrossBrowserNode(evt);;

	try
	{
		if(node.className && node.className.indexOf("dl") == 0)
		{
			if(this.canDrillDown())
			{
				this.singleClickDrillDown(evt, app);
				return true;
			}
			else if(this.canDrillUp())
			{
				this.singleClickDrillUp(evt, app);
				return true;
			}
		}
	}
	catch (e)
	{
	}

	if(app == 'RV')
	{
		return this.getDrillThroughParameters('execute', evt);
	}

	return false;
};

CDrillManager.prototype.singleClickDrillDown = function(evt, app /*either 'qs' or 'rv'*/)
{
	if(app == 'QS') {
		this.qsDrillDown();
	}
	else {
		this.rvDrillDown();
	}
};

CDrillManager.prototype.singleClickDrillUp = function(evt, app /*either 'QS' or 'RV'*/)
{
	if(app == 'QS') {
		this.qsDrillUp();
	}
	else {
		this.rvDrillUp();
	}
};

CDrillManager.prototype.getDrillParameters = function(drillType, includeMetadata, bIsSyncDrill, userSelectedDrillItem)
{
	var drillParamsArray = [];

	var selectionObj = this.getSelectedObject();
	if(selectionObj == null) {
		return drillParamsArray; // return an empty array
	}

	if(typeof includeMetadata == "undefined")
	{
		includeMetadata = true;
	}

	var dataItemsArray = selectionObj.getDataItems();
	var munArray = selectionObj.getMuns();
	var lunArray = selectionObj.getDimensionalItems("lun");
	var hunArray = selectionObj.getDimensionalItems("hun");
	var drillOptions = selectionObj.getDrillOptions();

	if(typeof dataItemsArray == "undefined" || typeof munArray == "undefined" || typeof drillOptions == "undefined" || munArray == null || dataItemsArray == null || drillOptions == null) {
		return drillParamsArray; // return an empty array
	}

	if(munArray.length != dataItemsArray.length) {
		return drillParamsArray; // return an empty array
	}

	var num_of_items = munArray.length;
	for(var item_idx = 0; item_idx < num_of_items; ++item_idx) {
		if(dataItemsArray[item_idx].length != 0) {
			var iLevel=(userSelectedDrillItem) ? this.findUserSelectedDrillItem(userSelectedDrillItem, dataItemsArray[item_idx]) 
											   : 0;
			if (iLevel<0) {
				continue;
			}
			
			if( (bIsSyncDrill === true) || this.getDrillOption(drillType))
			{
				if(munArray[item_idx][iLevel] == "" || drillParamsArray.toString().indexOf(munArray[item_idx][iLevel],0) == -1) {
					drillParamsArray[drillParamsArray.length] = dataItemsArray[item_idx][iLevel];
					drillParamsArray[drillParamsArray.length] = munArray[item_idx][iLevel];

					if(includeMetadata === true)
					{
						drillParamsArray[drillParamsArray.length] = lunArray[item_idx][iLevel];
						drillParamsArray[drillParamsArray.length] = hunArray[item_idx][iLevel];
					}
				}
			}
		}
	}

	return drillParamsArray;
};

/**
 * return the level within a list of data items where an item matching the userSelectedDrillItem was found.
 * return -1 if not found.
 */
CDrillManager.prototype.findUserSelectedDrillItem = function(userSelectedDrillItem, dimDataItems) {
	for (var iLevel=0; iLevel<dimDataItems.length; ++iLevel) {
		if (userSelectedDrillItem==dimDataItems[iLevel]) {
			return iLevel;
		}
	}
	return -1;	//Not found...
};

CDrillManager.prototype.getModelDrillThroughContext = function(XMLBuilderLocation)
{
	var modelDrillContext="";

	if(this.canDrillThrough() === true)
	{
		if(typeof gUseNewSelectionContext == "undefined")
		{
			var modelPath = "";
			if(typeof getConfigFrame != "undefined")
			{
				modelPath = decodeURIComponent(getConfigFrame().cfgGet("PackageBase"));
			}
			else if(this.getCV().getModelPath() !== "")
			{
				modelPath = this.getCV().getModelPath();
			}

			modelDrillContext = getViewerSelectionContext(this.getSelectionController(), new CSelectionContext(modelPath));
		}
		else
		{
			var parameterValues = new CParameterValues();

			var selectionController = this.getSelectionController();

			if(selectionController) {

				var selectionList = selectionController.getAllSelectedObjects();

				for(var sel_idx = 0; sel_idx < selectionList.length; ++ sel_idx) {
					var selectionObj = selectionList[sel_idx];

					var munArray = selectionObj.getMuns();
					var metaDataItems = selectionObj.getMetadataItems();
					var useValues = selectionObj.getUseValues();
					for(var context_idx = 0; context_idx < metaDataItems.length; ++context_idx) {
						for(var idx = 0; idx < metaDataItems[context_idx].length; ++idx) {

							if(metaDataItems[context_idx][idx] == null || metaDataItems[context_idx][idx] == "") {
								continue;
							}

							var name = metaDataItems[context_idx][idx];
							var useValue;

							// if we have a mun, set it as the use value, otherwise use the useValue we have stored
							if(munArray[context_idx][idx] != null && munArray[context_idx][idx] != "") {
								useValue = munArray[context_idx][idx];
							}
							else {
								useValue = useValues[context_idx][idx];
							}

							// set the display value to what we have stored as the use value
							var displayValue = useValues[context_idx][idx];
							parameterValues.addSimpleParmValueItem(name, useValue, displayValue, "true");
						}
					}
				}
			}

			var contextElement = XMLBuilderLocation.XMLBuilderCreateXMLDocument("context");
			modelDrillContext = parameterValues.generateXML(XMLBuilderLocation, contextElement);
		}

	}

	return modelDrillContext;
};

/***************************************************************************************************

REPORT VIEWER SPECIFIC METHODS

****************************************************************************************************/

CDrillManager.prototype.rvDrillUp = function(payload)
{
	this.getCV().executeAction("DrillUp", payload);
};

CDrillManager.prototype.rvDrillDown = function(payload)
{
	this.getCV().executeAction("DrillDown", payload);
};

CDrillManager.prototype.rvBuildXMLDrillParameters = function(drillType, userSelectedDrillItem)
{
	var drillParamsArray = this.getDrillParameters(drillType, true, false /*bIsSyncDrill*/, userSelectedDrillItem);
	if(drillParamsArray.length == 0)
	{
		// handle the error
		return drillParams;   // TODO: drillParams ?? It does not exists here.
	}

	return this.buildDrillParametersSpecification(drillParamsArray);
};

CDrillManager.prototype.buildDrillParametersSpecification = function(drillParamsArray)
{
	var drillParams = '<DrillParameters>';

	var idx = 0;
	while(idx < drillParamsArray.length) {
		drillParams += '<DrillGroup>';
		drillParams += '<DataItem>';
		drillParams += sXmlEncode(drillParamsArray[idx++]);
		drillParams += '</DataItem>';
		drillParams += '<MUN>';
		drillParams += sXmlEncode(drillParamsArray[idx++]);
		drillParams += '</MUN>';
		drillParams += '<LUN>';
		drillParams += sXmlEncode(drillParamsArray[idx++]);
		drillParams += '</LUN>';
		drillParams += '<HUN>';
		drillParams += sXmlEncode(drillParamsArray[idx++]);
		drillParams += '</HUN>';
		drillParams += '</DrillGroup>';
	}

	drillParams += '</DrillParameters>';

	return drillParams;

};

CDrillManager.prototype.getAuthoredDrillsForCurrentSelection = function() 
{
	var sResult = null;
	// get the report authored drills
	var aReportAuthoredDrills = this.getAuthoredDrillThroughTargets();
	if(aReportAuthoredDrills.length > 0)
	{

		var sAuthoredDrillThroughTargets = "<AuthoredDrillTargets>";

		for(var iIndex = 0; iIndex < aReportAuthoredDrills.length; ++iIndex)
		{
			sAuthoredDrillThroughTargets +=  eval('"' + aReportAuthoredDrills[iIndex] + '"');
		}

		sAuthoredDrillThroughTargets += "</AuthoredDrillTargets>";

		var cv = this.getCV();
		var authoredDrillAction = cv.getAction("AuthoredDrill");

		var drillTargetSpecifications = cv.getDrillTargets();
		if(drillTargetSpecifications.length > 0)
		{
			sResult = authoredDrillAction.getAuthoredDrillThroughContext(sAuthoredDrillThroughTargets, drillTargetSpecifications);
		}
	}	
	
	return sResult;
};

CDrillManager.prototype.getAuthoredDrillsForGotoPage = function()
{
	var sResult = "";
	var rvDrillTargetsNode = this.getAuthoredDrillsForCurrentSelection();
	if (rvDrillTargetsNode) {
		sResult = XMLBuilderSerializeNode(rvDrillTargetsNode);
	}
	
	return sResult;
};

CDrillManager.prototype.launchGoToPage = function(drillTargets, bDirectLaunch)
{
	var selectionController = this.getSelectionController();
	if((selectionController != null && selectionController.getModelDrillThroughEnabled() == true) || (typeof drillTargets != "undefined" && drillTargets != null && drillTargets != ""))
	{
		// get the authored drills
		var sAuthoredDrills = this.getAuthoredDrillsForGotoPage();

		// build up the model drill context
		var modelDrillContext = this.getModelDrillThroughContext(self);

		var form = document.getElementById("drillForm");
		if(form != null) {
			document.body.removeChild(form);
		}

		form = document.createElement("form");

		var cvid = this.getCVId();
		var warpForm = document.forms["formWarpRequest" + cvid];


		form.setAttribute("id", "drillForm");
		form.setAttribute("name", "drillForm");
		form.setAttribute("target", warpForm.getAttribute("target"));
		form.setAttribute("method", "post");
		form.setAttribute("action", warpForm.getAttribute("action"));
		form.style.display = "none";

		document.body.appendChild(form);

		if(this.getCV().getModelPath() !== "")
		{
			form.appendChild(createHiddenFormField("modelPath", this.getCV().getModelPath()));
		}

		if(typeof warpForm["ui.object"] != "undefined" && warpForm["ui.object"].value != "")
		{
			form.appendChild(createFormField("drillSource", warpForm["ui.object"].value));
		}
		else if(typeof this.getCV().envParams["ui.spec"] != "undefined")
		{
			form.appendChild(createFormField("sourceSpecification", this.getCV().envParams["ui.spec"]));
		}

		if(sAuthoredDrills != "")
		{
			form.appendChild(createHiddenFormField("m", "portal/drillthrough.xts"));
			form.appendChild(createFormField("invokeGotoPage", "true"));
			form.appendChild(createFormField("m", "portal/drillthrough.xts"));
			form.appendChild(createFormField("modelDrillEnabled", selectionController.getModelDrillThroughEnabled()));

			if(typeof gUseNewSelectionContext == "undefined")
			{
				form.appendChild(createFormField("newSelectionContext", "true"));
			}
		}
		else
		{
			if(typeof gUseNewSelectionContext == "undefined")
			{
				form.appendChild(createHiddenFormField("m", "portal/goto2.xts"));
			}
			else
			{
				form.appendChild(createHiddenFormField("m", "portal/goto.xts"));
			}
		}

		form.appendChild(createHiddenFormField("b_action", "xts.run"));
		form.appendChild(createHiddenFormField("drillTargets", sAuthoredDrills));

		if(typeof gUseNewSelectionContext == "undefined")
		{
			form.appendChild(createHiddenFormField("drillContext", modelDrillContext));
		}
		else
		{
			form.appendChild(createHiddenFormField("modeledDrillthru", modelDrillContext));
		}

		form.appendChild(createHiddenFormField("errURL", "javascript:window.close();"));


		if(typeof bDirectLaunch != "undefined" && bDirectLaunch == true)
		{
			form.appendChild(this.createFormField("directLaunch", "true"));
		}

		var routingServerGroup = "";
		if(this.getCV().envParams["ui.routingServerGroup"])
		{
			routingServerGroup = this.getCV().envParams["ui.routingServerGroup"];
		}
		form.appendChild(createHiddenFormField("ui.routingServerGroup", routingServerGroup));


		if(this.getCV().getExecutionParameters() != "") {
			form.appendChild(createHiddenFormField("encExecutionParameters", this.getCV().getExecutionParameters()));
		}

		if(warpForm.lang && warpForm.lang.value != "")
		{
			form.appendChild(createHiddenFormField("lang", warpForm.lang.value));
		}

		if (!this.getCV() || !this.getCV().launchGotoPageForIWidgetMobile(drillForm)) {
			if (typeof this.getCV().launchGotoPage === "function") {
				this.getCV().launchGotoPage(form);
			}
			else {
				var target = "winNAT_" + ( new Date() ).getTime();
				var sPath = this.getCV().getWebContentRoot() + "/rv/blankDrillWin.html?cv.id=" + cvid;
				
				window.open(sPath, target, "toolbar,location,status,menubar,resizable,scrollbars=1");
				form.target = target;
			}
		}
	}
};

CDrillManager.prototype.buildSearchPageXML = function(XMLBuilderLocation, pkg, model, ctxArr, defMeasArr, dataSpecification, filtArr)
{
	var cognosSearchElement = null;
	if (typeof XMLBuilderLocation.XMLElement == "function")
	{
		cognosSearchElement = XMLBuilderLocation.XMLBuilderCreateXMLDocument("cognosSearch");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(cognosSearchElement.documentElement, "xmlns:cs", "http://developer.cognos.com/schemas/cs/1/");
		var packageElement = cognosSearchElement.createElement("package");
		if (typeof pkg == "string" && pkg !== "")
		{
			packageElement.appendChild(cognosSearchElement.createTextNode(pkg));
		}
		cognosSearchElement.documentElement.appendChild(packageElement);
		var modelElement = cognosSearchElement.createElement("model");
		if (typeof model == "string" && model !== "")
		{
			modelElement.appendChild(cognosSearchElement.createTextNode(model));
		}
		cognosSearchElement.documentElement.appendChild(modelElement);
		var selectedContextElement = cognosSearchElement.createElement("selectedContext");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "xmlns:xs", "http://www.w3.org/2001/XMLSchema");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "xmlns:bus", "http://developer.cognos.com/schemas/bibus/3/");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "SOAP-ENC:arrayType", "bus:parameterValue[]", "http://schemas.xmlsoap.org/soap/encoding/");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
		XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(selectedContextElement, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
		cognosSearchElement.documentElement.appendChild(selectedContextElement);
		for (var idxCtx in ctxArr)
		{
			var itemElement = cognosSearchElement.createElement("item");
			XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(itemElement, "xsi:type", "bus:parameterValue", "http://www.w3.org/2001/XMLSchema-instance");
			var busNameElement = XMLBuilderLocation.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:name", cognosSearchElement);
			XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busNameElement, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
			busNameElement.appendChild(cognosSearchElement.createTextNode(ctxArr[idxCtx].name));
			var busValueElement = XMLBuilderLocation.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:value", cognosSearchElement);
			XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busValueElement, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
			XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busValueElement, "SOAP-ENC:arrayType", "bus:parmValueItem[]", "http://schemas.xmlsoap.org/soap/encoding/");
			for (var j = 0; j < ctxArr[idxCtx].values.length; j++)
			{
				var itemChildElement = cognosSearchElement.createElement("item");
				XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(itemChildElement, "xsi:type", "bus:simpleParmValueItem", "http://www.w3.org/2001/XMLSchema-instance");
				var busUseElement = XMLBuilderLocation.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:use", cognosSearchElement);
				XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busUseElement, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
				busUseElement.appendChild(cognosSearchElement.createTextNode(ctxArr[idxCtx].values[j][0]));
				var busDisplayElement = XMLBuilderLocation.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:display", cognosSearchElement);
				XMLBuilderLocation.XMLBuilderSetAttributeNodeNS(busDisplayElement, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
				var nodeValue = ctxArr[idxCtx].values[j][1] == null ? "" : ctxArr[idxCtx].values[j][1];
				busDisplayElement.appendChild(cognosSearchElement.createTextNode(nodeValue));
				itemChildElement.appendChild(busUseElement);
				itemChildElement.appendChild(busDisplayElement);
				busValueElement.appendChild(itemChildElement);
			}
			itemElement.appendChild(busNameElement);
			itemElement.appendChild(busValueElement);
			selectedContextElement.appendChild(itemElement);
		}

		var defaultMeasureElement = cognosSearchElement.createElement("defaultMeasure");
		cognosSearchElement.documentElement.appendChild(defaultMeasureElement);

		dataSpecification.buildXML(XMLBuilderLocation, cognosSearchElement, "data");

		var filterElement = cognosSearchElement.createElement("filter");
		cognosSearchElement.documentElement.appendChild(filterElement);
	}

	return cognosSearchElement;
};

CDrillManager.prototype.openSearchPage = function(objPath, sourceContext)
{
	// build up the model drill context
	this.getModelDrillThroughContext(self);

	var searchForm = document.getElementById("searchPage");
	if(searchForm != null) {
		document.body.removeChild(searchForm);
	}

	searchForm = document.createElement("form");

	searchForm.setAttribute("id", "searchPage");
	searchForm.setAttribute("name", "searchPage");
	searchForm.setAttribute("method", "post");
	searchForm.setAttribute("target", searchForm.name);
	searchForm.setAttribute("action", this.getCV().getGateway() + "/gosearch");
	searchForm.style.display = "none";

	document.body.appendChild(searchForm);

	searchForm.appendChild(createHiddenFormField("csn.action", "search"));
	searchForm.appendChild(createHiddenFormField("csn.drill", sourceContext));

	var __search_win = window.open("", searchForm.name, "directories=no,location=no,status=no,toolbar=no,resizable=yes,scrollbars=yes,top=100,left=100,height=480,width=640" );
	__search_win.focus();
	searchForm.submit();
};

CDrillManager.prototype.launchSearchPage = function()
{
	var selCon = this.getSelectionController();
	var warpForm = document.forms["formWarpRequest" + this.getCVId()];
	var ctxArr = this.determineSelectionsForSearchPage(selCon);
	var dataSpecification = this.getSearchContextDataSpecfication(selCon);
	var spXML = this.buildSearchPageXML(self, warpForm.packageBase.value, this.getCV().getModelPath(), ctxArr, [], dataSpecification, []);
	this.openSearchPage(warpForm.packageBase.value, XMLBuilderSerializeNode(spXML));
};

/***************************************************************************************************

QUERY STUDIO SPECIFIC METHODS

****************************************************************************************************/

CDrillManager.prototype.qsDrillDown = function()
{
	if(!this.canDrillDown()) {
		// throw up a a generic error page (for now)
		getConfigFrame().dlgGenericSelectionMessage(false);
		return;
	}

	// build the drill down command
	var drillCommand = 'DD:';
	this.qsSendDrillCommand(drillCommand);
};

CDrillManager.prototype.qsDrillUp = function()
{
	if(!this.canDrillUp()) {
		// throw up a a generic error page (for now)
		getConfigFrame().dlgGenericSelectionMessage(false);
		return;
	}

	// build the drill up command
	var drillCommand = 'DU:';
	this.qsSendDrillCommand(drillCommand);
};

CDrillManager.prototype.qsSendDrillCommand = function(drillCommand)
{
	var drillType;
	if(drillCommand == "DU:") {
		drillType = "drillUp";
	}
	else {
		drillType = "drillDown";
	}

	var drillParamsArray = this.getDrillParameters(drillType, false, false /*bIsSyncDrill*/);
	if(drillParamsArray.length == 0){
		// throw up a a generic error page (for now)
		getConfigFrame().dlgGenericSelectionMessage(false);
		return;
	}
	for(var idx = 0; idx < drillParamsArray.length; ++idx) {
		drillCommand += getConfigFrame().escapeParam(drillParamsArray[idx]);
		if(idx+1 < drillParamsArray.length) {
			drillCommand += ',';
		}
	}

	getConfigFrame().sendCmd(drillCommand, "", true);
};

CDrillManager.prototype.qsLaunchGoToPage = function(bDirectLaunch)
{
	var selectionController = this.getSelectionController();
	if(selectionController != null && selectionController.getModelDrillThroughEnabled() == true)
	{
		// build up the model drill context
		var modelDrillContext = this.getModelDrillThroughContext(cf);

		if(modelDrillContext=="") {
			// throw up a a generic error page (for now)
			getConfigFrame().dlgGenericSelectionMessage(false);
			return;
		}

		var gotoForm = document.getElementById("gotoPage");
		if(gotoForm != null) {
			document.body.removeChild(gotoForm);
		}

		gotoForm = document.createElement("form");

		gotoForm.setAttribute("id", "gotoPage");
		gotoForm.setAttribute("name", "gotoPage");
		gotoForm.setAttribute("method", "post");
		gotoForm.style.display = "none";

		document.body.appendChild(gotoForm);

		var configFrame = getConfigFrame();
		gotoForm.appendChild(this.createFormField("objpath", decodeURIComponent(configFrame.cfgGet("PackageBase"))));

		if(typeof gUseNewSelectionContext == "undefined")
		{
			gotoForm.appendChild(this.createFormField("m", "portal/goto2.xts"));
		}
		else
		{
			gotoForm.appendChild(this.createFormField("m", "portal/goto.xts"));
		}

		gotoForm.appendChild(this.createFormField("b_action", "xts.run"));

		if(typeof gUseNewSelectionContext == "undefined")
		{
			gotoForm.appendChild(this.createFormField("drillContext", modelDrillContext));
		}
		else
		{
			gotoForm.appendChild(this.createFormField("modeledDrillthru", modelDrillContext));
		}

		if (typeof getConfigFrame().routingServerGroup != "undefined")
		{
			gotoForm.appendChild(this.createFormField("ui.routingServerGroup", getConfigFrame().routingServerGroup));
		}

		if(typeof bDirectLaunch != "undefined" && bDirectLaunch == true)
		{
			gotoForm.appendChild(this.createFormField("directLaunch", "true"));
		}

		var executionParameters = configFrame.goApplicationManager.getReportManager().getParameterManager().getExecutionParameters();
		if (executionParameters)
		{
			gotoForm.appendChild(this.createFormField("encExecutionParameters", executionParameters));
		}

		var target = "winNAT_" + ( new Date() ).getTime();
		var sPath = this.getCV().getWebContentRoot() + "/rv/blankDrillWin.html?cv.id=" + this.getCVId();

		window.open(sPath, target, "toolbar,location,status,menubar,resizable,scrollbars=1");
		gotoForm.target = target;
	}
};

CDrillManager.prototype.qsLaunchSearchPage = function()
{
	var cf = getConfigFrame();
	var selCon = goWindowManager.getSelectionController();
	var ctxArr = this.determineSelectionsForSearchPage(selCon);
	var dataSpecification = this.getSearchContextDataSpecfication(selCon);
	var pkgBase = decodeURIComponent(cf.cfgGet("PackageBase"));
	var spXML = this.buildSearchPageXML(cf, pkgBase, decodeURIComponent(cf.cfgGet("cmLastModel")), ctxArr, [], dataSpecification, []);
	this.openSearchPage(pkgBase, cf.XMLBuilderSerializeNode(spXML));
};

CDrillManager.prototype.determineSelectionsForSearchPage = function(selectionController)
{
	var ctxArr = new CtxArrayPlaceHolder();
	var allSelections = selectionController.getAllSelectedObjects();
	for (var i = 0; i < allSelections.length; i++)
	{
		var colName = allSelections[i].getColumnName();
		if (!this.containsByIndiceInArray(ctxArr, colName))
		{
			ctxArr[colName] = {};
			ctxArr[colName].name = colName;
			ctxArr[colName].values = [];
		}
		var idx0 = "";

		var muns = allSelections[i].getMuns();
		if (muns != null && muns.length > 0)
		{
			idx0 = muns[0][0];
		}
		var idx1 = allSelections[i].getDisplayValues()[0];
		if (!(this.containsInArray(ctxArr[colName].values, 0, idx0) && this.containsInArray(ctxArr[colName].values, 1, idx1))) {
			ctxArr[colName].values[ctxArr[colName].values.length] = [idx0, idx1];
		}
	}
	return ctxArr;
};

CDrillManager.prototype.getSearchContextDataSpecfication = function(selectionController)
{
	var parameterValues = new CParameterValues();
	var dataManager = selectionController.getCCDManager();
	var contextData = dataManager.m_cd;

	for(var ctxId in contextData)
	{
		var sUsage = dataManager.GetUsage(ctxId);
		if(sUsage != "2" /*2==MEASURE*/)
		{
			var sRefDataItem = dataManager.GetRDIValue(ctxId);
			var sUseValue = dataManager.GetDisplayValue(ctxId);
			parameterValues.addSimpleParmValueItem(sRefDataItem, sRefDataItem, sUseValue, "true");
		}
	}

	return parameterValues;
};

CDrillManager.prototype.containsByIndiceInArray = function(a, v)
{
	for (var i in a)
	{
		if (i == v) {
			return true;
		}
	}
	return false;
};

CDrillManager.prototype.containsInArray = function(a, idx, v)
{
	for (var i in a)
	{
		if (a[i][idx] == v) {
			return true;
		}
	}
	return false;
};

// temp function for now
CDrillManager.prototype.createFormField = function(name, value)
{
	var formField = document.createElement("input");
	formField.setAttribute("type", "hidden");
	formField.setAttribute("name", name);
	formField.setAttribute("value", value);
	return(formField);
};

/***************************************************************************************************

DRILL THROUGH METHODS

****************************************************************************************************/


CDrillManager.prototype.getAuthoredDrillThroughTargets = function()
{
	var aAuthoredDrillItems = [];
	var selectionController = this.getSelectionController();
	var oHtmlItem = null;

	if(selectionController != null)
	{
		if(selectionController.getSelectedColumnIds().length == 1)
		{
			var selections = selectionController.getSelections();
			for(var selectionIndex = 0; selectionIndex < selections.length; ++selectionIndex)
			{
				var selectionObject = selections[selectionIndex];

				oHtmlItem = selectionObject.getCellRef();
				while( oHtmlItem )
				{
					if(oHtmlItem.getAttribute("dtTargets") != null)
					{
						aAuthoredDrillItems.push("<rvDrillTargets>" + oHtmlItem.getAttribute("dtTargets") + "</rvDrillTargets>");
						break;
					}

					oHtmlItem = XMLHelper_GetFirstChildElement( oHtmlItem );
				}
			}
		}
		else if(selectionController.hasSelectedChartNodes())
		{
			var chartNodes = selectionController.getSelectedChartNodes();
			var selectedChartNode = chartNodes[0];
			oHtmlItem = selectedChartNode.getArea();
			if(oHtmlItem.getAttribute("dtTargets") != null)
			{
				aAuthoredDrillItems.push("<rvDrillTargets>" + oHtmlItem.getAttribute("dtTargets") + "</rvDrillTargets>");
			}
		}
		else if (selectionController.getSelectedDrillThroughImage() !=  null) {
			var imageNode = selectionController.getSelectedDrillThroughImage();
			if(imageNode && imageNode.getAttribute("dtTargets") != null) {
				aAuthoredDrillItems.push("<rvDrillTargets>" + imageNode.getAttribute("dtTargets") + "</rvDrillTargets>");
			}
			
		} else if( selectionController.getSelectDrillThroughSingleton() != null) {
			var singletonNode = selectionController.getSelectDrillThroughSingleton();
			if(singletonNode && singletonNode.getAttribute("dtTargets") != null) {
				aAuthoredDrillItems.push("<rvDrillTargets>" + singletonNode.getAttribute("dtTargets") + "</rvDrillTargets>");
			}
		}
	}

	return aAuthoredDrillItems;
};


CDrillManager.prototype.getDrillThroughParameters = function(method, evt)
{
	if(typeof method == "undefined")
	{
		method = 'query';
	}

	var aAuthoredDrillThroughTargets = [];

	if(typeof evt != "undefined")
	{
		var cellRef = getCrossBrowserNode(evt, true);

		try
		{
			while(cellRef)
			{
				if(typeof cellRef.getAttribute != "undefined" && cellRef.getAttribute("dtTargets"))
				{
					aAuthoredDrillThroughTargets.push("<rvDrillTargets>" + cellRef.getAttribute("dtTargets") + "</rvDrillTargets>");
					break;
				}

				cellRef = cellRef.parentNode;
			}
		}
		catch(e)
		{
			return false;
			// if an exception occurs, just eat it
		}
	}
	else
	{

		var oCV = this.getCV();
		var oDrillMgr = oCV.getDrillMgr();
		var selectionController = oDrillMgr.getSelectionController();

		if(selectionController != null)
		{
			var chartArea = null;
			if(selectionController.hasSelectedChartNodes())
			{
				var chartNodes = selectionController.getSelectedChartNodes();
				var selectedChartNode = chartNodes[0];
				chartArea = selectedChartNode.getArea();
			}
			if(chartArea != null)
			{
				aAuthoredDrillThroughTargets.push("<rvDrillTargets>" + chartArea.getAttribute("dtTargets") + "</rvDrillTargets>");
			}
			else
			{
				aAuthoredDrillThroughTargets = this.getAuthoredDrillThroughTargets();
			}
		}
	}

	if(aAuthoredDrillThroughTargets.length > 0)
	{
		var sAuthoredDrillThroughTargets = "<AuthoredDrillTargets>";

		for(var iIndex = 0; iIndex < aAuthoredDrillThroughTargets.length; ++iIndex)
		{
			sAuthoredDrillThroughTargets +=  eval('"' + aAuthoredDrillThroughTargets[iIndex] + '"');
		}

		sAuthoredDrillThroughTargets += "</AuthoredDrillTargets>";

		var authoredDrillAction = this.getCV().getAction("AuthoredDrill");

		if(method == "query")
		{
			authoredDrillAction.populateContextMenu(sAuthoredDrillThroughTargets);
			this.showOtherMenuItems();
		}
		else
		{
			if (this.getCV().envParams["cv.id"] == "AA")
			{
				this.getCV().m_viewerFragment.raiseAuthoredDrillClickEvent();
			}
			else
			{
				authoredDrillAction.execute(sAuthoredDrillThroughTargets);
			}
		}

		return true;
	}
	else if (method == 'query')
	{
		this.showOtherMenuItems();
		return true;
	}
	else
	{
		return false;
	}
};

CDrillManager.prototype.executeAuthoredDrill = function(drillTargetsSpecification)
{
	var unEncodedDrillTargetsSpecification = decodeURIComponent(drillTargetsSpecification);
	var authoredDrillAction = this.getCV().getAction("AuthoredDrill");
	authoredDrillAction.executeDrillTarget(unEncodedDrillTargetsSpecification);
};

CDrillManager.prototype.doesMoreExist = function(menuObj)
{
	for(var i = 0; i < menuObj.getNumItems(); i++)
	{
		var menuItem = menuObj.get(i);
		if(menuItem != null)
		{
			if((menuItem instanceof CMenuItem) && (menuItem.getLabel() == RV_RES.RV_MORE) && (menuItem.getAction() == this.getCVObjectRef() + '.getDrillMgr().launchGoToPage();')) {
				return true;
			}
		}
	}
	return false;
};

CDrillManager.prototype.showOtherMenuItems = function()
{
	// just add the more menu item
	var cv = this.getCV();
	var mainWnd = cv.rvMainWnd;
	var toolbarCtrl = mainWnd.getToolbarControl();

	var gtButton = null;
	var gtDropDownMenu = null;
	if (typeof toolbarCtrl != "undefined" && toolbarCtrl != null) {
		gtButton = toolbarCtrl.getItem("goto");
		if (gtButton)
		{
			gtDropDownMenu = gtButton.getMenu();
		}
	}

	var contextMenu = mainWnd.getContextMenu();
	var sBlackList = mainWnd.getUIHide();
	var gtContextMenu = null;
	if (typeof contextMenu != "undefined" && contextMenu != null && contextMenu.getGoToMenuItem()) {
		gtContextMenu = contextMenu.getGoToMenuItem().getMenu();
	}

	var searchMenuItem = null;
	var selectionController = this.getSelectionController();

	// there's no report authored drills, just add the more menu item
	if (gtDropDownMenu != null) {
		//Do not add another more menu item if the dropdown menu already has one
		if(this.doesMoreExist(gtDropDownMenu) == false)
		{
			if(typeof gMenuSeperator != "undefined" && gtDropDownMenu.getNumItems() > 0 && (cv.bCanUseCognosViewerIndexSearch || sBlackList.indexOf(' RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ') == -1))
			{
				gtDropDownMenu.add(gMenuSeperator);
			}

			var moreDropDownItem = new CMenuItem(gtDropDownMenu, RV_RES.RV_MORE, this.getCVObjectRef() + '.getDrillMgr().launchGoToPage();', "", gMenuItemStyle, cv.getWebContentRoot(), cv.getSkin());
//			if (cv.bCanUseCognosViewerIndexSearch) {
//				searchMenuItem = new CMenuItem(gtDropDownMenu, RV_RES.RV_SEARCH, this.getCVObjectRef() + '.getDrillMgr().launchSearchPage();', "", gMenuItemStyle, cv.getWebContentRoot(), cv.getSkin());
//			}

			if(sBlackList.indexOf(' RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ') != -1)
			{
				moreDropDownItem.hide();
			}
			else if(selectionController == null || selectionController.getModelDrillThroughEnabled() == false)
			{
				moreDropDownItem.disable();
			}
		}
	}

	if (gtContextMenu != null) {

		if(typeof gMenuSeperator != "undefined" && gtContextMenu.getNumItems() > 0 && (cv.bCanUseCognosViewerIndexSearch || sBlackList.indexOf(' RV_CONTEXT_MENU_GOTO_RELATED_LINKS ') == -1))
		{
			gtContextMenu.add(gMenuSeperator);
		}

		var moreContextMenuItem = new CMenuItem(gtContextMenu, RV_RES.RV_MORE, this.getCVObjectRef() + '.getDrillMgr().launchGoToPage();', "", gMenuItemStyle, cv.getWebContentRoot(), cv.getSkin());
//		if (cv.bCanUseCognosViewerIndexSearch) {
//			searchMenuItem = new CMenuItem(gtContextMenu, RV_RES.RV_SEARCH, this.getCVObjectRef() + '.getDrillMgr().launchSearchPage();', "", gMenuItemStyle, cv.getWebContentRoot(), cv.getSkin());
//		}

		if(sBlackList.indexOf(' RV_CONTEXT_MENU_GOTO_RELATED_LINKS ') != -1)
		{
			moreContextMenuItem.hide();
		}
		else if(selectionController == null || selectionController.getModelDrillThroughEnabled() == false)
		{
			moreContextMenuItem.disable();
		}
	}

	if (searchMenuItem != null && selectionController != null)
	{
		var allSelections = selectionController.getAllSelectedObjects();
		if (allSelections == null || allSelections.length === 0)
		{
			searchMenuItem.disable();
		}
	}

	if (gtDropDownMenu != null) {
		gtDropDownMenu.draw();
		if (gtDropDownMenu.isVisible()) {
			gtDropDownMenu.show();
		}
	}
	if (gtContextMenu != null) {
		gtContextMenu.draw();
		if (gtContextMenu.isVisible()) {
			gtContextMenu.show();
		}
	}
};

CDrillManager.prototype.ddc = function(evt) {
	var node = getNodeFromEvent(evt);
	if(node != null && node.getAttribute("ddc")!=="1") {
		// adding a 'ddc' attribute to prevent processing the same node more than once.
		node.setAttribute("ddc", "1");
		if(node.getAttribute("dtTargets")) {
			node.className = "dl " + node.className;
			node.setAttribute("href", "#");
			return;
		}
		var selectionController = this.getSelectionController();
		if(selectionController != null) {
			var selectedChartArea = selectionController.getSelectionObjectFactory().getSelectionChartObject(node);
			if(selectedChartArea != null) {
				var drillOptions = selectedChartArea.getDrillOptions();
				for(var idx = 0; idx < drillOptions.length; ++idx) {
					var currentDrillOption = drillOptions[idx][0];
					if ((node.getAttribute("isChartTitle") === "true" && currentDrillOption == "1") || currentDrillOption == "3" || currentDrillOption == "2") {
						node.className = "dl " + node.className;
						node.setAttribute("href", "#");
						break;
					}
				}
			}
		}
	}
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2011, 2015
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
* Class responsibility: Add or remove Highlight image map areas
*/


function CImageMapHighlight(map, webContentRoot)
{
	this.m_webContentRoot = webContentRoot;
	this.createHighlight = CImageMapHighlight.prototype.createHighlightElement;
	this.initialize(map);
}

CImageMapHighlight.prototype.initialize = function(map) {
	this.m_map = map;
	this.m_areas = {};
	this.m_areaNodes = {};
	this.m_visibleAreas = [];
	this.initImageBlank();
	this.m_divCanvas = null;
	this.m_creationNode = null;
	this._setMapAreasId();
	this.m_sDefaultFillColour = "#F7E1BC";
	this.m_sDefaultStrokeColour = "#F0A630";
	this.m_sFillColour = this.m_sDefaultFillColour;
	this.m_sStrokeColour = this.m_sDefaultStrokeColour;
};

CImageMapHighlight.prototype.setFillColour = function( sFillColour ){

	this.m_sFillColour = ( !sFillColour ) ? this.m_sDefaultFillColour : sFillColour;
};

CImageMapHighlight.prototype.getFillColour = function(){
	return this.m_sFillColour;
};

CImageMapHighlight.prototype.setStrokeColour = function( sStrokeColour ){
	
	this.m_sStrokeColour = (!sStrokeColour ) ? this.m_sDefaultStrokeColour : sStrokeColour ;
};

CImageMapHighlight.prototype.getStrokeColour = function(){
	return this.m_sStrokeColour;
};

CImageMapHighlight.prototype.resetColours = function(){
	this.m_sStrokeColour = this.m_sDefaultStrokeColour;
	this.m_sFillColour = this.m_sDefaultFillColour;
};

CImageMapHighlight.prototype.initImageBlank = function() {
	var img = this._getChartImageFromMap();
	// this test is to avoid a javascript error, but it won't work
	if (img === null) {
		return;
	}
	this.m_img = img;
	this.m_sImageHeight = img.offsetHeight + "px";
	this.m_sImageWidth = img.offsetWidth + "px";
	
	this.m_sUseMap = img.getAttribute( "usemap" );
	this.m_imgLid = img.getAttribute( "lid" );

	this.m_imgBlank = img.ownerDocument.createElement( "IMG" );
	this.m_imgBlank.src = this.m_webContentRoot + "/rv/images/blank.gif";
	this.m_imgBlank.style.height = this.m_sImageHeight;
	this.m_imgBlank.style.width = this.m_sImageWidth;
	this.m_imgBlank.style.position = "absolute";
	this.m_imgBlank.border = "0";
	this.m_imgBlank.useMap = this.m_sUseMap;
	this.m_imgBlank.setAttribute("lid", this.m_imgLid);
	this.m_imgBlank.setAttribute("rsvpchart", img.getAttribute( "rsvpchart"));
	this.m_imgBlank.alt = img.alt;
	if ( this.m_bShowPointer )
	{
		this.m_imgBlank.style.cursor = "auto";
	}
	this.m_imgBlank.v_bIsBlankImageMapImg = true;
	img.parentNode.insertBefore( this.m_imgBlank, img );
	
	this.f_copyStyle( img, this.m_imgBlank );
	this.m_imgBlank.style.borderColor = "transparent";
};

/**
 * Look in the DOM for the chart container image
 * <map/> [<div/>] <div><span></div> [<svg|div/> <img-blank/>] <img-rsvpchart=true>
 */
CImageMapHighlight.prototype._getChartImageFromMap = function() {
	var map = this.m_map;
	var result = null;
	
	// 1. find the span which is the chart container (it should be in the next
	var chartContainerSpan = null;
	var mapNextSibling = map.nextSibling;
	while (mapNextSibling) {
		if(mapNextSibling.tagName == "DIV") {
			var nDivChild = mapNextSibling.firstChild;
			while (nDivChild) {
			 
				if ((nDivChild.tagName == "SPAN" || nDivChild.tagName == "DIV") && nDivChild.getAttribute("chartcontainer") == "true") {
					chartContainerSpan = nDivChild;
					break;
				}
				nDivChild = nDivChild.nextSibling;
			}	
		}
		if(chartContainerSpan) {
			break;
		}
		mapNextSibling = mapNextSibling.nextSibling;
	}
	
	// 2. Find the image within the chart container Span
	if (chartContainerSpan) {
		var chartContainerChildren = chartContainerSpan.children;
		var chartContainerChildrenCount = chartContainerChildren.length;
		for (var i=0; i<chartContainerChildrenCount; i++) {
			var el = chartContainerChildren[i];
			if (el.tagName == "IMG" && el.getAttribute("rsvpchart") == "true" && el.getAttribute("usemap") == "#" + map.name) {
				result = el;
				break;
			}
		}
	}
	return result;
};

CImageMapHighlight.prototype._AREA_ID = "aid";

CImageMapHighlight.prototype._setMapAreasId = function() {
	var mapLid_ = this.m_map.getAttribute( "lid" ) + "_";
	var areas = this.m_map.childNodes;
	var areaCount = areas.length;
	for (var i=0; i<areaCount; i++ ) {
		var a = areas[i];
		var id = mapLid_ + i;
		a.setAttribute(this._AREA_ID,id);
		this.m_areaNodes[id]=a;
	}
};

CImageMapHighlight.prototype.isAreaInitialized = function(area) {
	return (area.getAttribute(this._AREA_ID) === null? false : true);
};

CImageMapHighlight.prototype.getAreaId = function(area) {
	var areaId = area.getAttribute(this._AREA_ID);
	if (areaId === null) {
		// re-initialize
		this.initialize(area.parentNode);
		areaId = area.getAttribute(this._AREA_ID);
	}
	return areaId + this.getFillColour();
};

CImageMapHighlight.prototype.getAreaFromId = function(areaid) {
	return this.m_areaNodes[areaid];
};

CImageMapHighlight.prototype.highlightArea = function(area, append) {
	var areaId = this.getAreaId(area); //

	// hide all but the one to highlight if not append
	if (!append) {
		var visibleAreas = this.m_visibleAreas;
		var visiblesAreaCount =  visibleAreas.length;
		for (var i = 0; i < visiblesAreaCount; i++) {
			if (areaId != visibleAreas[i]) {
				this.hideAreaById(visibleAreas[i]);
			}
		}
		this.m_visibleAreas = [];
	}
	this._highlightArea(area);
};

CImageMapHighlight.prototype.highlightAreas = function(areas, append) {
	if (!append) {
		this.hideAllAreas();
	}
	this._highlightAreas(areas);
};

/**
 * highlight multiple areas
 */
CImageMapHighlight.prototype._highlightAreas = function(areas) {
	var areasCount =  areas.length;
	for (var i = 0; i < areasCount; i++) {
		this._highlightArea(areas[i]);
	}
};

CImageMapHighlight.prototype._highlightArea = function(area) {
	var areaId = this.getAreaId(area);
	if (!this.highlightAreaExists(areaId)) {
		var highLight = this.createHighlight(area);
		if (highLight) {
			this.m_areas[areaId] = highLight;
			highLight.style.visibility = "visible";
			area.setAttribute("highlighted", "true");
		}
	} else {
		// if not visible make it so
		if (this.m_areas[areaId].style.visibility == "hidden") {
			this.m_areas[areaId].style.visibility = "visible";
			area.setAttribute("highlighted", "true");
		}
	}
	this.m_visibleAreas.push(areaId);
};

CImageMapHighlight.prototype.highlightAreaExists = function(areaId){
	return this.m_areas[areaId] ? true : false;
};

CImageMapHighlight.prototype.hideAreaById = function(areaId) {
	if ( this.m_areas[areaId] && this.m_areas[areaId].style.visibility ) {
		this.m_areas[areaId].style.visibility = "hidden";
	}
};

CImageMapHighlight.prototype.hideAreas = function(areas) {
	var areasCount =  areas.length;
	for (var i = 0; i < areasCount; i++) {
		this.hideArea(areas[i]);
	}
};

CImageMapHighlight.prototype.hideArea = function(area) {
	this.hideAreaById(this.getAreaId(area));
	area.setAttribute("highlighted", "false");
};

CImageMapHighlight.prototype.hideAllAreas = function() {
	var visibleAreas = this.m_visibleAreas;
	var visiblesAreaCount =  visibleAreas.length;
	for (var i = 0; i < visiblesAreaCount; i++) {
		this.hideAreaById(visibleAreas[i]);
		var areaNode = this.getAreaFromId(visibleAreas[i]);
		if(areaNode) {
			areaNode.setAttribute("highlighted", "false");
		}
	}
	this.m_visibleAreas = [];
};

CImageMapHighlight.prototype.isAreaHighlighted = function(area) {
	var areaId = this.getAreaId(area);
	return this.m_areas[areaId] && this.m_areas[areaId].style.visibility == "visible";
};

CImageMapHighlight.prototype.removeAreaHighlights = function(areas) {
	
};

CImageMapHighlight.prototype.removeAllAreaHighlights = function() {
	
};

CImageMapHighlight.prototype.destroy = function(area) {
	this.removeAllAreaHighlights();
};

CImageMapHighlight.prototype.createHighlightElement = function( v_elArea, v_bIsHover )
{
	var doc = v_elArea.ownerDocument;
	if ( !this.m_divCanvas )
	{
		for ( var v_elAncestor = this.m_img.parentNode; v_elAncestor; v_elAncestor = v_elAncestor.parentNode )
		{
			if ( ( v_elAncestor.nodeName == "DIV" ) && ( v_elAncestor.getAttribute( "sSpecName" ) == "block" ) )
			{
				var v_oStyle = doc.defaultView.getComputedStyle( v_elAncestor , null );
				var v_sOverflow = v_oStyle.overflow;
				if ( ( v_sOverflow == "auto" ) || ( v_sOverflow == "scroll" ) && ( v_oStyle.position != "relative" ) )
				{
					v_elAncestor.style.position = "relative";
				}
			}
		} 

		this.m_divCanvas = doc.createElementNS( "http://www.w3.org/2000/svg", "svg" );
		this.m_divCanvas.style.height = this.m_sImageHeight;
		this.m_divCanvas.style.width = this.m_sImageWidth;
		this.m_divCanvas.style.position = "absolute";
		//this.m_divCanvas.style.border = "1px solid green";
		//this.m_divCanvas.style.backgroundColor = "red";
		this.m_img.parentNode.insertBefore( this.m_divCanvas, this.m_imgBlank );
		this.f_copyStyle( this.m_imgBlank, this.m_divCanvas );
		this.m_divCanvas.style.display = this.m_bHiddenCanvas ? "none" : "block";
	}

	var v_elPolyline = doc.createElementNS( "http://www.w3.org/2000/svg", "polyline" );
	var v_sCoords = v_elArea.getAttribute( "coords" );
	v_elPolyline.setAttribute( "points", v_elArea.getAttribute( "coords" ) + " " + v_sCoords.substr( 0, v_sCoords.indexOf( ",", v_sCoords.indexOf( "," ) + 1 ) ) );
	v_elPolyline.style.position = "absolute";
	v_elPolyline.style.top = "0px";
	v_elPolyline.style.left = "0px";
	v_elPolyline.style.visibility = "hidden";
	v_elPolyline.setAttribute( "stroke", v_bIsHover ? "#F7CB83"  : this.getStrokeColour() );
	v_elPolyline.setAttribute( "stroke-width", ( v_elArea.getAttribute( "type" ) == "legendLabel" ) ? "1pt" : "1.75pt" );
	v_elPolyline.setAttribute( "fill", v_bIsHover ? "#F7E1BC" : this.getFillColour() );
	v_elPolyline.setAttribute( "fill-opacity", "0.4" );
	this.m_divCanvas.appendChild( v_elPolyline );

	return v_elPolyline;
};


CImageMapHighlight.prototype.f_copyStyle = function( v_elFrom, v_elTo )
{
	var a = ["margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "border", "borderTop", "borderRight", "borderBottom", "borderLeft"];
	var v_iLength = a.length;
	for ( var i = 0; i < v_iLength; i++ )
	{
		var v_sName = a[i];
		var v_sValue = v_elFrom.style[v_sName];
		if ( v_sValue )
		{
			v_elTo.style[v_sName] = v_sValue;
		}
	}
};

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 /*------------------------------------------------------------------------------------------
				Object model for the selection context information

	CSelectionXml = {
		queries: {
			<query_name>: {	<!! SC_SingleQuery !!>
				selections: [
					{	<!! SC_SingleSelection !!>
						rows:		[{},...],
						cols:		[{},...],
						measures:	[{},...],
						sections:	[{},...],
						layoutElementId: <string>
					},
					...
				],
				slicers: [	{	<!! SC_SingleSlicer !!>	},... ],
				filters: {
					detailFilters:	[	{	<!! SC_SingleDetailFilter !!>	},... ],
					summaryFilters: [	{	<!! SC_SingleSummaryFilter !!>	},... ]
				}
			},
			...
		},
		burstContext: {
			//TODO
		}
	}
------------------------------------------------------------------------------------------*/

function CSelectionXml(burstID, contentLocale, expressionLocale) {
	this.queries = {};

	this.burstContext = burstID || "";
	this.expressionLocale = contentLocale || "";
	this.contentLocale = expressionLocale || "";
}

///////////////////////////////////////////////////////////////
// NOTE: shallow functions for defining structure. They'll be
// treated as Objects within CSelectionXml.
//  i.e., they're not expected to do self-serialization
///////////////////////////////////////////////////////////////
function SC_SingleSelection() {
	this.rows = [];
	this.cols = [];
	this.sections = [];
	this.measures = [];
	this.layoutElementId = "";
}
function SC_SingleQuery() {
	this.selections = [];
	this.slicers = [];
	this.filters = [];
}
function SC_SingleSlicer() {}
function SC_SingleDetailFilter() {}
function SC_SingleSummaryFilter() {}


////////////////////////////////////////////////////////////

CSelectionXml.prototype.BuildSelectionFromController = function(sc) {
	if (sc) {
		var selectedObjects = sc.getAllSelectedObjects();
		for(var s = 0; s < selectedObjects.length; ++s) {
			var selection = selectedObjects[s];
			var selectionCtx = selection.getSelectedContextIds();
			var muns = selection.getMuns();
			var munCount = muns.length;

			var singleSelection = new SC_SingleSelection();
			singleSelection.layoutElementId = selection.getLayoutElementId();
			var sQuery = null;

			/********
			To make this more generic in the future, all measure-oriented checks will need to be removed.
			We should need to support member-only context, and other permutations.
			********/
			for(var i = 0; i < munCount; ++i) {
				var j, ctxId, displayValue;
				if (i === 0 && munCount === 1) {
					for(j = 0; j < muns[i].length; ++j) {
						ctxId = selectionCtx[i][j];

						if (ctxId != 0)
						{
							// place the selceted cell in the measure section. The wizard will take
							// care of verifying that it's really a measure
							if(j===0) {
								//get the measure's query ref. This should be unique within a selection, except for sections.
								sQuery = sc.getRefQuery(ctxId);
								displayValue = selection.getDisplayValues()[j];
								this._buildMeasureSelection(sc, ctxId, singleSelection.measures, displayValue, j, selection.getLayoutType());
							} else {
								//ignore other measures on the list report
								if (sc.getUsageInfo(ctxId) != 2) {
									this._buildEdgeSelection(sc, ctxId, singleSelection.cols, j);
								}
							}
						}
					}
				} else {
					for(j = 0; j < muns[i].length; ++j) {
						ctxId = selectionCtx[i][j];
						if (ctxId != 0)
						{
							if (i === 0) {
								displayValue = selection.getDisplayValues()[j];
								sQuery = sc.getRefQuery(ctxId);

								this._buildMeasureSelection(sc, ctxId, singleSelection.measures, displayValue, j, selection.getLayoutType());
								//get the measure's query ref. This should be unique within a selection, except for sections.
							} else if (i === 1 ) {
								this._buildEdgeSelection(sc, ctxId, singleSelection.rows, j);
							} else if (i === 2) {
								this._buildEdgeSelection(sc, ctxId, singleSelection.cols, j);
							} else {
								this._buildSectionSelection(sc, ctxId, singleSelection.sections, j);
							}
						}
					}
				}
			}

			this.AddSelection(sQuery, singleSelection);
		}
	}
};


CSelectionXml.prototype.AddSelection = function(queryName, context) {
	if (!this.queries[queryName]) {
		this.queries[queryName] = new SC_SingleQuery();
	}

	this.queries[queryName].selections.push(context);
};


CSelectionXml.prototype._buildMeasureSelection = function(sc, ctxId, measures, displayValue, idx, dataType) {
	if (dataType == "" || dataType == null)
	{
		dataType = "datavalue";
	}

	if (ctxId) {
			measures.push( {
			name:		sc.getRefDataItem(ctxId),
			values:		[ {	use:		sc.getUseValue(ctxId),
							display:	displayValue				}],
			order:		idx,
			hun:		sc.getHun(ctxId),
			dataType:	dataType,
			usage:		sc.getUsageInfo(ctxId),
			dtype:		sc.getDataType(ctxId),
			selection:	"true"					//TODO: is this supposed to be anything else?
		});
	}
};

CSelectionXml.prototype._buildEdgeSelection = function(sc, ctxId, edges, idx) {
	if (ctxId) {
		edges.push( {
			name:		sc.getRefDataItem(ctxId),
			values:		[ {	use:		this.getUseValue(sc, ctxId),
							display:	sc.getDisplayValue(ctxId)	}],
			order:		idx,
			lun:		sc.getLun(ctxId),
			hun:		sc.getHun(ctxId),
			dataType:	"columnTitle",
			usage:		sc.getUsageInfo(ctxId),
			dtype:		sc.getDataType(ctxId)
		});
	}
};

CSelectionXml.prototype._buildSectionSelection = function(sc, ctxId, sections, idx) {
	if (ctxId) {
		sections.push( {
			name:		sc.getRefDataItem(ctxId),
			values:		[ {	use:		this.getUseValue(sc, ctxId),
							display:	sc.getDisplayValue(ctxId)	}],
			order:		idx,
			lun:		sc.getLun(ctxId),
			hun:		sc.getHun(ctxId),
			dataType:	"section",
			usage:		sc.getUsageInfo(ctxId),
			dtype:		sc.getDataType(ctxId),
			queryRef:	sc.getRefQuery(ctxId)
		});
	}
};

/**
 * If we have a MUN then use it, otherwise use the useValue
 * @private
 */
CSelectionXml.prototype.getUseValue = function(sc, ctxId)
{
	var useValue = sc.getMun(ctxId);
	if (useValue == "")
	{
		useValue = sc.getUseValue(ctxId);
	}

	return useValue;
};


/*===================================================
			Serialization of the selection
			Context
====================================================*/
CSelectionXml.prototype.toXml = function() {
	var xmlSelectionsDocument = XMLBuilderCreateXMLDocument("selections");
	var xmlSelections = xmlSelectionsDocument.documentElement;
	XMLBuilderSetAttributeNodeNS(xmlSelections, "xmlns:xs", "http://www.w3.org/2001/XMLSchema");
	XMLBuilderSetAttributeNodeNS(xmlSelections, "xmlns:bus", "http://developer.cognos.com/schemas/bibus/3/");
	XMLBuilderSetAttributeNodeNS(xmlSelections, "SOAP-ENC:arrayType", "bus:parameterValue[]", "http://schemas.xmlsoap.org/soap/encoding/");
	XMLBuilderSetAttributeNodeNS(xmlSelections, "xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
	XMLBuilderSetAttributeNodeNS(xmlSelections, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
	xmlSelections.setAttribute("contentLocale", this.contentLocale);
	xmlSelections.setAttribute("expressionLocale", this.expressionLocale);

	for(var q in this.queries) {
		this._queryToXml(xmlSelections, q, this.queries[q]);
	}
	this._burstToXml(xmlSelections);

	return XMLBuilderSerializeNode(xmlSelectionsDocument);
};


CSelectionXml.prototype._queryToXml = function(parent, name, obj) {
	var xmlQuery = parent.ownerDocument.createElement("query");
	xmlQuery.setAttribute("name", name);

	for(var selection = 0; selection < obj.selections.length; ++selection) {
		this._selectionToXml(xmlQuery, obj.selections[selection]);
	}

	for(var slicer = 0; slicer < obj.slicers.length; ++slicer) {
		this._slicersToXml(xmlQuery, obj.slicers[slicer]);
	}

	for(var filter = 0; filter < obj.selections.length; ++filter) {
		this._filtersToXml(xmlQuery, obj.selections[filter]);
	}

	parent.appendChild(xmlQuery);
};

CSelectionXml.prototype._selectionToXml = function(parent, selection) {
	var doc = parent.ownerDocument;
	var xmlSelection = doc.createElement("selection");
	parent.appendChild(xmlSelection);

	this._edgeToXml(xmlSelection, "row", selection.rows);
	this._edgeToXml(xmlSelection, "column", selection.cols);
	this._edgeToXml(xmlSelection, "measure", selection.measures);
	this._edgeToXml(xmlSelection, "section", selection.sections);

	var layoutElementId = doc.createElement("layoutElementId");
	layoutElementId.appendChild(doc.createTextNode(selection.layoutElementId));

	xmlSelection.appendChild(layoutElementId);

};


CSelectionXml.prototype._edgeToXml = function(parent, sEdge, aContext) {
	var doc = parent.ownerDocument;

	//row edge name: "row" + "s"
	var xmlEdgeContainer = doc.createElement(sEdge+'s');
	parent.appendChild(xmlEdgeContainer);

	for(var i = 0; i < aContext.length; ++i) {
		var xmlEdge = doc.createElement(sEdge);
		xmlEdgeContainer.appendChild(xmlEdge);

		var edge = aContext[i];
		for(var j in edge) {
			if (j !== "name" && j !== "values") {
				//add all the properties of the object as attributes, except "name" and "values" which
				//are added later. Check for null only. Nothing should be undefined, and we want to maintain
				//0 as a number.
				xmlEdge.setAttribute(j,  edge[j] !== null ? edge[j] : "");
			}
		}

		this._itemToXml(xmlEdge, edge.name, edge.values);
	}

};


CSelectionXml.prototype._itemToXml = function(parent, name, values) {
	var doc = parent.ownerDocument;
	var xmlItem = doc.createElement("item");

	XMLBuilderSetAttributeNodeNS(xmlItem, "xsi:type", "bus:parameterValue", "http://www.w3.org/2001/XMLSchema-instance");

	var xmlBusName = XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:name", doc);
	XMLBuilderSetAttributeNodeNS(xmlBusName, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
	xmlBusName.appendChild(doc.createTextNode(name));
	xmlItem.appendChild(xmlBusName);

	var xmlBusValue = XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:value", doc);
	XMLBuilderSetAttributeNodeNS(xmlBusValue, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
	XMLBuilderSetAttributeNodeNS(xmlBusValue, "SOAP-ENC:arrayType", "bus:parmValueItem[]", "http://schemas.xmlsoap.org/soap/encoding/");
	xmlItem.appendChild(xmlBusValue);

	///NOTE: We only expect one value currently, but we support a list
	for (var j = 0; j < values.length; j++)
	{
		var xmlValueItem = doc.createElement("item");
		XMLBuilderSetAttributeNodeNS(xmlValueItem, "xsi:type", "bus:simpleParmValueItem", "http://www.w3.org/2001/XMLSchema-instance");
		var xmlValueUse = XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:use", doc);
		XMLBuilderSetAttributeNodeNS(xmlValueUse, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");

		if(values[j].use)
		{
			xmlValueUse.appendChild(doc.createTextNode(values[j].use));
		}
		else if (values[j].display)
		{
			xmlValueUse.appendChild(doc.createTextNode(values[j].display));
		}
		else
		{
			xmlValueUse.appendChild(doc.createTextNode(""));
		}


		var xmlValueDisplay = XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:display", doc);
		XMLBuilderSetAttributeNodeNS(xmlValueDisplay, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
		if (values[j].display)
		{
			xmlValueDisplay.appendChild(doc.createTextNode(values[j].display));
		}
		else
		{
			xmlValueDisplay.appendChild(doc.createTextNode(""));
		}
		xmlValueItem.appendChild(xmlValueUse);
		xmlValueItem.appendChild(xmlValueDisplay);
		xmlBusValue.appendChild(xmlValueItem);
	}

	parent.appendChild(xmlItem);
};


CSelectionXml.prototype._burstToXml = function(parent) {
	var doc = parent.ownerDocument;

	var burstContext = doc.createElement("burst-context");
	burstContext.appendChild(doc.createTextNode(this.burstContext));
	parent.appendChild(burstContext);
};


CSelectionXml.prototype._slicersToXml = function(parent, slicers) {
	//TODO: add later
};


CSelectionXml.prototype._filtersToXml = function(parent, filter) {
	//TODO: add later
};


/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
// constants
CSubscriptionManager.k_SubscriptionWizardName = "subscriptionWizard";

function CSubscriptionManager(cv)
{
	this.m_cv = cv;

	/**
		@type boolean
		@private
	*/
	this.m_bInitialized = false;

	/**
		@type array
		@private
	*/
	this.m_aWatchRules = null;

	/**
		@type string
		@private
	*/
	this.m_sEmail = "";

	/**
		@type string
		@private
	*/
	this.m_sAlertNewVersionConfirm = "";

	/**
		@type boolean
		@private
	*/
	this.m_sQueryNotificationResponse = "";

	/**
		@type boolean
		@private
	*/
	this.m_bAllowNotification = false;

	/**
		@type boolean
		@private
	*/
	this.m_bAllowSubscription = false;

	/**
		@type boolean
		@private
	*/
	this.m_bCanCreateNewWatchRule = false;

	/**
		@type boolean
		@private
	*/
	this.m_bCanGetNotified = false;

	/**
		@type boolean
		@private
	*/
	this.m_bAllowAnnotations = false;

	/**
		@type boolean
		@private
	*/
	this.m_bCanCreateAnnotations = false;

	/**
		@type string
		@private
	*/
	this.m_windowOptions = "width=450,height=350,toolbar=0,location=0,status=0,menubar=0,resizable,scrollbars=1";
				//"width=500,height=350,toolbar=0,location=0,status=0,menubar=0,resizable,scrollbars=1";

}

CSubscriptionManager.prototype.getViewer = function() {
	return this.m_cv;
};

/**
	Initialize the subscription member variables with the server response
 */
CSubscriptionManager.prototype.Initialize = function(response)
{
	try
	{
		var oJSONResponse = response.getJSONResponseObject();
		var formWarpRequest = document.forms['formWarpRequest' + this.m_cv.getId()];

		if (oJSONResponse["annotationInfo"]) {
			var oAnnotationInfo = oJSONResponse["annotationInfo"];
			this.m_AnnotationsCount = oAnnotationInfo.annotations.length;
			// Push the whole annotations in current session
			this.m_annotations = oAnnotationInfo.annotations;
			this.m_bAllowAnnotations = oAnnotationInfo.allowAnnotations;
			this.m_bCanCreateAnnotations = oAnnotationInfo.traverse == "true";

			return true;
		}

		if (oJSONResponse["subscriptionInfo"])
		{
			var oSubscriptionInfo = oJSONResponse["subscriptionInfo"];
			if (!this.m_bInitialized)
			{
				this.m_sEmail = oSubscriptionInfo.sEmail;
				this.m_bAllowNotification = oSubscriptionInfo.bAllowNotification;
				this.m_bAllowSubscription = oSubscriptionInfo.bAllowSubscription;
				this.m_sAlertNewVersionConfirm = oSubscriptionInfo.sAlertNewVersionConfirm;

				if (formWarpRequest["ui.action"] && formWarpRequest["ui.action"].value == 'view')
				{
					/*
						Can the user create new watch rules
						- Report output is in HTML with interactive information
						- User has the 'Create and Run Watch Rules' capability
						- Alerts using watch rules are allowed for the report
					*/
					if (formWarpRequest["ui.format"])
					{
						this.m_bCanCreateNewWatchRule = (formWarpRequest["ui.format"].value == 'HTML') && this.m_cv.bCanUseCognosViewerConditionalSubscriptions && this.m_bAllowSubscription;
					}

					/*
					Can the user subscribe to notifications
						- the report must not be bursted
						- user cannot have scheduled the report
						- report must allow notifications
					 */
					this.m_bCanGetNotified = (!formWarpRequest["ui.burstKey"] || (formWarpRequest["ui.burstKey"] && formWarpRequest["ui.burstKey"].value == "")) && this.m_bAllowNotification;
				}
			}

			if (oSubscriptionInfo.sQueryNotificationResponse)
			{
				this.m_sQueryNotificationResponse = oSubscriptionInfo.sQueryNotificationResponse;
			}

			if (oSubscriptionInfo.aWatchRules)
			{
				var aWatchRules = oSubscriptionInfo.aWatchRules;

				this.m_aWatchRules = [];

				for (var i=0; i < aWatchRules.length; i++)
				{
					this.m_aWatchRules.push( aWatchRules[i] );
				}
			}

			this.m_bInitialized = true;

			return true;
		}
	}
	catch(exception)
	{
		return false;
	}

	return false;
};

/**
	Checks the current selection to see if it's valid for creating a new Watch Rule
 */
CSubscriptionManager.prototype.IsValidSelectionForNewRule = function()
{
	var selectionController = this.m_cv.getSelectionController();
	if (selectionController && !selectionController.hasSelectedChartNodes())
	{
		var selectedObjects = selectionController.getAllSelectedObjects();
		if (selectedObjects.length === 1)
		{
			if (selectedObjects[0] != null && selectedObjects[0].getLayoutType() != 'columnTitle')
			{
				return true;
			}
		}
	}

	return false;
};

/**
	Can the user create new watch rules
*/
CSubscriptionManager.prototype.CanCreateNewWatchRule = function()
{
	if (typeof this.m_cv.UIBlacklist != "undefined" && this.m_cv.UIBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_ALERT_USING_NEW_WATCH_RULE ') != -1)
	{
		return false;
	}

	// if we haven't been initialized yet and we're looking at saved output
	if (!this.m_bInitialized && this.getViewer().envParams["ui.action"] == 'view')
	{
		var oCV = this.getViewer();
		var request = new JSONDispatcherEntry(oCV);
		request.setKey("subscriptionManager");
		request.forceSynchronous();
		request.addFormField("ui.action", "getSubscriptionInfo");
		request.addFormField("cv.responseFormat", "subscriptionManager");
		request.addFormField("contextMenu", "true");
		this.addCommonFormFields(request);

		request.setCallbacks({"complete":{"object":this, "method":this.Initialize}});

		oCV.dispatchRequest(request);
	}

	return this.m_bCanCreateNewWatchRule;
};

/**
	Has the logic to determine if the current user can modify the Watch Rules
*/
CSubscriptionManager.prototype.CanModifyWatchRule = function()
{
	return this.m_cv.bCanUseCognosViewerConditionalSubscriptions && this.m_bAllowSubscription;
};

/**
	Has the logic to determine if the current user can subscribe to notifications
*/
CSubscriptionManager.prototype.CanGetNotified = function()
{
	if (typeof this.m_cv.UIBlacklist != "undefined" && this.m_cv.UIBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_ALERT_ABOUT_NEW_VERSIONS ') != -1)
	{
		return false;
	}

	return this.m_bCanGetNotified;
};

/**
	Updates the subscription dropdown menu
*/
CSubscriptionManager.prototype.UpdateSubscribeMenu = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	var subscribeButton = toolbar? toolbar.getItem("watchNewVersions") : null;
	var sWebContentRoot = this.m_cv.getWebContentRoot();
	var sSkin = this.m_cv.getSkin();

	if (subscribeButton)
	{
		var subscribeDropDownMenu = subscribeButton.getMenu();

		// Clear the menu
		this.ClearSubscriptionMenu();

		var bAddSeperator = false;

		if ( this.CanGetNotified() )
		{
			if (this.m_sQueryNotificationResponse == 'on')
			{
				new CMenuItem(subscribeDropDownMenu, RV_RES.RV_DO_NOT_ALERT_NEW_VERSION, "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().DeleteNotification();", sWebContentRoot + '/rv/images/action_remove_from_list.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				bAddSeperator = true;
			}
			else if (this.m_sQueryNotificationResponse == 'off' && this.m_sEmail != "")
			{
				new CMenuItem(subscribeDropDownMenu, RV_RES.RV_ALERT_NEW_VERSION, "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().AddNotification();", sWebContentRoot + '/rv/images/action_add_to_list.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				bAddSeperator = true;
			}
		}

		if (this.CanCreateNewWatchRule())
		{
			if (bAddSeperator)
			{
				subscribeDropDownMenu.add(gMenuSeperator);
			}

			var newSubscription = new CMenuItem(subscribeDropDownMenu, RV_RES.RV_NEW_WATCH_RULE, "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().NewSubscription();", sWebContentRoot + '/rv/images/action_new_subscription.gif', gMenuItemStyle, sWebContentRoot, sSkin);

			if (!this.IsValidSelectionForNewRule())
			{
				newSubscription.disable();
			}

			bAddSeperator = true;
		}

		var sBlacklist = "";
		if (typeof this.m_cv.UIBlacklist != "undefined")
		{
			sBlacklist = this.m_cv.UIBlacklist;
		}

		var noWatchRules;
		//iterate through existing subscriptions
		if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES ') == -1)
		{
			if (bAddSeperator)
			{
				subscribeDropDownMenu.add(gMenuSeperator);
			}

			if ( this.m_aWatchRules && this.m_aWatchRules.length > 0)
			{
				var bCanModifyWatchRules = this.CanModifyWatchRule();

				for(var sub = 0; sub < this.m_aWatchRules.length; ++sub)
				{
					var menu = new CMenuItem(subscribeDropDownMenu, this.m_aWatchRules[sub].name, "", sWebContentRoot + "/rv/images/icon_subscription.gif", gMenuItemStyle, sWebContentRoot, sSkin);
					var subMenu = menu.createCascadedMenu(gMenuStyle);
					subMenu.m_oCV = this.m_cv;

					if (bCanModifyWatchRules && sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES_MODIFY ') == -1) {
						new CMenuItem(subMenu, RV_RES.RV_MODIFY_WATCH_RULE, this.m_cv.getObjectId() + ".getSubscriptionManager().ModifySubscription("+sub+");", sWebContentRoot + '/rv/images/action_edit.gif', gMenuItemStyle, sWebContentRoot, sSkin);
					}
					if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES_DELETE ') == -1)
					{
						new CMenuItem(subMenu, RV_RES.RV_DELETE_WATCH_RULE, this.m_cv.getObjectId() + ".getSubscriptionManager().DeleteSubscription("+sub+");", sWebContentRoot + '/rv/images/action_delete.gif', gMenuItemStyle, sWebContentRoot, sSkin);
					}
				}
			}
			else
			{
				noWatchRules = new CMenuItem(subscribeDropDownMenu, RV_RES.RV_NO_WATCH_RULES, "", '', gMenuItemStyle, sWebContentRoot, sSkin);
				noWatchRules.disable();
			}
		}

		if (subscribeDropDownMenu.getNumItems() == 0)
		{
			noWatchRules = new CMenuItem(subscribeDropDownMenu, RV_RES.RV_NO_WATCH_RULES, "", '', gMenuItemStyle, sWebContentRoot, sSkin);
			noWatchRules.disable();
		}

		// make sure we don't use the callback when drawing the menu
		subscribeDropDownMenu.setForceCallback(false);
		subscribeDropDownMenu.draw();
		if (subscribeDropDownMenu.isVisible()) {
			subscribeDropDownMenu.show();
		}
		// make sure our callback is used when the menu gets opened again
		subscribeDropDownMenu.setForceCallback(true);
	}
};
/**
	Updates the subscription dropdown menu
*/
CSubscriptionManager.prototype.UpdateAnnotationMenu = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	var annotationButton = toolbar? toolbar.getItem("addAnnotations") : null;
	var sWebContentRoot = this.m_cv.getWebContentRoot();
	var sSkin = this.m_cv.getSkin();

	var annotDropDownMenu = annotationButton.getMenu();

	// Clear the menu
	this.ClearAnnotationMenu();

	// add the create menu item
	var menu = new CMenuItem(annotDropDownMenu, RV_RES.RV_NEW_COMMENT, "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().NewAnnotation();", sWebContentRoot + "/rv/images/action_comment_add.gif", gMenuItemStyle, sWebContentRoot, sSkin);

	var annotationsCount = this.m_annotations.length;
	if (annotationsCount > 0) {
		annotDropDownMenu.add(gMenuSeperator);
	}

	// disable the item if allowAnnotations is false.
	if (!this.m_bAllowAnnotations || !this.m_bCanCreateAnnotations)
	{
		menu.disable();
	}


	//iterate through existing annotations
	var menuName;
	var bidi = isViewerBidiEnabled() ? BidiUtils.getInstance() : null;
	for(var i=0; i<annotationsCount; i++){

		var defName = this.m_annotations[i].defaultName ;
		menuName = defName.length>60 ? defName.substring(0, 60)+'...' : defName;
		if(isViewerBidiEnabled()){
			menuName = bidi.btdInjectUCCIntoStr(menuName, getViewerBaseTextDirection());
		}

		// check all the permissions
		var readPermission = Boolean(this.m_annotations[i].permissions.read);
		var modifyPermission = Boolean(this.m_annotations[i].permissions.write);
		var deletePermission = Boolean(this.m_annotations[i].permissions.traverse) && Boolean(this.m_annotations[i].permissions.write);

		var dispCmd = "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().ViewAnnotation("+i+");";
		var alertMsg = "javascript:alert('Permission denied')" ;
		dispCmd = readPermission ? dispCmd : alertMsg;

		// decide if we want to add a separator - which we do if the layoutElementId has changed
		if (i > 0 && this.m_annotations[i].layoutElementId != this.m_annotations[i-1].layoutElementId) {
			annotDropDownMenu.add(gMenuSeperator);
		}

		var menuItemImage = "/rv/images/action_comment.gif";
		if (this.m_annotations[i].layoutElementId != "") {
			menuItemImage = "/rv/images/action_subscribe.gif";
		}

		menu = new CMenuItem(annotDropDownMenu, menuName, dispCmd, sWebContentRoot + menuItemImage, gMenuItemStyle, sWebContentRoot, sSkin);

		// we only create the cascaded menu if can alter things
		var subMenu = menu.createCascadedMenu(gMenuStyle);
		

		// add an info pane to the top of the menu
		var infoPanel = new CInfoPanel("300px", sWebContentRoot, subMenu.getId() + "_comments");
		infoPanel.setParent(subMenu);

		// add all the properties that we want
		defName = this.m_annotations[i].defaultName ;
		var menuName1 = defName.length>60 ? defName.substring(0, 60)+'...' : defName;
		if(isViewerBidiEnabled()){
			menuName1 = bidi.btdInjectUCCIntoStr(menuName1, getViewerBaseTextDirection());
		}
		infoPanel.addProperty(RV_RES.RV_VIEW_COMMENT_NAME,html_encode(menuName1));
		infoPanel.addSpacer(4);
		

		var cmnt = this.m_annotations[i].description ;
		var shortComment = cmnt.length>590 ? cmnt.substring(0, 590)+'...' : cmnt;
		if(isViewerBidiEnabled()){
			shortComment = bidi.btdInjectUCCIntoStr(shortComment, getViewerBaseTextDirection());
		}
		infoPanel.addProperty(RV_RES.RV_VIEW_COMMENT_CONTENTS, replaceNewLine(html_encode(shortComment)));
		infoPanel.addSpacer(4);
		
		var modifyTime = this.m_annotations[i].modificationTime ;
		
		if(isViewerBidiEnabled()){
			modifyTime = bidi.btdInjectUCCIntoStr(modifyTime, getViewerBaseTextDirection());
		}

		infoPanel.addProperty(RV_RES.RV_VIEW_COMMENT_MODTIME,modifyTime);
		
		var ownerName = this.m_annotations[i].owner.defaultName ;
		
		if(isViewerBidiEnabled()){
			ownerName = bidi.btdInjectUCCIntoStr(ownerName, getViewerBaseTextDirection());
		}
		
		infoPanel.addProperty(RV_RES.RV_VIEW_COMMENT_OWNER, ownerName);

		// add the pane to the menu
		subMenu.add(infoPanel);

		// add a separator if we have actions
		if (modifyPermission || deletePermission) {
			subMenu.add(gMenuSeperator);
		}
		new CMenuItem(subMenu, RV_RES.RV_VIEW_COMMENT, this.m_cv.getObjectId() + ".getSubscriptionManager().ViewAnnotation("+i+");", sWebContentRoot + '/rv/images/action_comment_view.gif', gMenuItemStyle, sWebContentRoot, sSkin);
		if (modifyPermission) {
			new CMenuItem(subMenu, RV_RES.RV_MODIFY_WATCH_RULE, this.m_cv.getObjectId() + ".getSubscriptionManager().ModifyAnnotation("+i+");", sWebContentRoot + '/rv/images/action_comment_modify.gif', gMenuItemStyle, sWebContentRoot, sSkin);
		}
		if (deletePermission)
		{
			new CMenuItem(subMenu, RV_RES.RV_DELETE_WATCH_RULE, this.m_cv.getObjectId() + ".getSubscriptionManager().DeleteAnnotation("+i+");", sWebContentRoot + '/rv/images/action_comment_delete.gif', gMenuItemStyle, sWebContentRoot, sSkin);
		}
	}

	// make sure we don't use the callback when drawing the menu
	annotDropDownMenu.setForceCallback(false);
	annotDropDownMenu.draw();
	if (annotDropDownMenu.isVisible()) {
		annotDropDownMenu.show();
	}

	// make sure our callback is used when the menu gets opened again
	annotDropDownMenu.setForceCallback(true);
};


/**
	Called when the user clicked on the 'Alert Me About New Versions' link
*/
CSubscriptionManager.prototype.AddNotification = function()
{
	alert(this.m_sAlertNewVersionConfirm);
	var oCV = this.getViewer();
	var request = new DataDispatcherEntry(oCV);
	request.setKey("subscriptionManager");
	request.addFormField("ui.action", "addNotification");
	request.addFormField("cv.responseFormat", "data");
	this.addCommonFormFields(request);

	oCV.dispatchRequest(request);
};

/**
	Called when the user clicked on the 'Do Not Alert Me About New Versions' link
*/
CSubscriptionManager.prototype.DeleteNotification = function()
{
	alert(RV_RES.RV_DO_NOT_ALERT_NEW_VERSION_CONFIRM);
	var oCV = this.getViewer();
	var request = new DataDispatcherEntry(oCV);
	request.setKey("subscriptionManager");
	request.addFormField("ui.action", "deleteNotification");
	request.addFormField("cv.responseFormat", "data");
	this.addCommonFormFields(request);

	oCV.dispatchRequest(request);
};

/**
	Called when the user clicked on the 'Add annotation' link
*/
CSubscriptionManager.prototype.NewAnnotation = function()
{
	var oFWR = document.forms["formWarpRequest" + this.m_cv.getId()];
	var searchPath = oFWR["ui.object"].value;

	var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(), CSubscriptionManager.k_SubscriptionWizardName);

	GUtil.createFormField(form, "ui.object", searchPath);
	GUtil.createFormField(form, "b_action", "xts.run");
	GUtil.createFormField(form, "m", "rv/annotation1.xts");
	GUtil.createFormField(form, "backURL", "javascript:window.close();");
	GUtil.createFormField(form, "action_hint", "create");

	var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
	window.open(sPath, form.target, this.m_windowOptions);
};

/**
	Called when the user clicked on an annotation' link
*/

CSubscriptionManager.prototype.ViewAnnotation = function(idx)
{
	var sub = this.m_annotations[idx];
	var searchPath = sub.searchPath;
	var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(), CSubscriptionManager.k_SubscriptionWizardName);

	GUtil.createFormField(form, "ui.object", searchPath);
	GUtil.createFormField(form, "b_action", "xts.run");
	GUtil.createFormField(form, "m", "rv/annotation1.xts");
	GUtil.createFormField(form, "backURL", "javascript:window.close();");

	var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
	window.open(sPath, form.target, this.m_windowOptions);
};

/**
	User clicked the 'Modify...' link for a Watch Rule
	@param idx - index of the rule that was clicked on
*/
CSubscriptionManager.prototype.ModifyAnnotation = function(idx)
{
	var sub = this.m_annotations[idx];
	var searchPath = this.m_annotations[idx].searchPath;
	// we need report version here
	if (sub && searchPath)
	{
		var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(),
										CSubscriptionManager.k_SubscriptionWizardName);


		GUtil.createFormField(form, "ui.object", searchPath);
		GUtil.createFormField(form, "b_action", "xts.run");
		GUtil.createFormField(form, "m", "rv/annotation1.xts");
		GUtil.createFormField(form, "backURL", "javascript:window.close();");
		GUtil.createFormField(form, "action_hint", "save");

		var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
		window.open(sPath, form.target, this.m_windowOptions);
	}
};

/**
	Deletes an Annotation
	@param idx - index of the rule that was clicked on
*/
CSubscriptionManager.prototype.DeleteAnnotation = function(idx)
{
	var sub = this.m_annotations[idx];
	if (sub && sub.searchPath && confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE))
	{
		var oCV = this.getViewer();
		var request = new DataDispatcherEntry(oCV);
		request.setKey("subscriptionManager");
		request.addFormField("ui.action", "deleteAnnotation");
		request.addFormField("cv.responseFormat", "data");
		this.addCommonFormFields(request, sub.searchPath);

		oCV.dispatchRequest(request);
	}
};

/**
	Called when the user clicked on the 'Alert Using New Watch Rule' link
*/
CSubscriptionManager.prototype.NewSubscription = function()
{
	var sc = this.m_cv.getSelectionController();

	var oFWR = document.forms["formWarpRequest" + this.m_cv.getId()];
	var searchPath = oFWR.reRunObj.value;

	if (searchPath && sc && sc.getAllSelectedObjects().length === 1 )
	{
		var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(), CSubscriptionManager.k_SubscriptionWizardName);

		var fWR = document.getElementById("formWarpRequest" + this.m_cv.getId());

		var selectionXml = new CSelectionXml(	fWR["ui.burstID"].value,
												fWR["ui.contentLocale"].value,
												fWR["ui.outputLocale"].value
											);

		selectionXml.BuildSelectionFromController(sc);

		//display a selectable-prompt containing the xml output -- TESTING ONLY
		//prompt("SelectionXML: ", selectionXml.toXml());

		GUtil.createFormField(form, "rv.selectionSpecXML", selectionXml.toXml());
		GUtil.createFormField(form, "rv.periodicalProducer", searchPath);
		GUtil.createFormField(form, "b_action", "xts.run");
		GUtil.createFormField(form, "m", "subscribe/conditional_subscribe1.xts");
		GUtil.createFormField(form, "backURL", "javascript:window.close();");

		var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
		window.open(sPath, form.target, "toolbar,location,status,menubar,resizable,scrollbars=1");
	}
	else
	{
		// for debugging
		// alert("Invalid Context: sc: " + sc + "\n searchPath: " + searchPath);
	}
};

/**
	Deletes a watch rule
	@param idx - index of the rule that was clicked on
*/
CSubscriptionManager.prototype.DeleteSubscription = function(idx)
{
	var sub = this.m_aWatchRules[idx];
	if (sub && sub.searchPath && confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE))
	{
		var oCV = this.getViewer();
		var request = new DataDispatcherEntry(oCV);
		request.setKey("subscriptionManager");
		request.addFormField("ui.action", "deleteSubscription");
		request.addFormField("cv.responseFormat", "data");
		this.addCommonFormFields(request, sub.searchPath);

		oCV.dispatchRequest(request);
	}
};

/**
	User clicked the 'Modify...' link for a Watch Rule
	@param idx - index of the rule that was clicked on
*/
CSubscriptionManager.prototype.ModifySubscription = function(idx)
{
	var sub = this.m_aWatchRules[idx];
	if (sub && sub.searchPath)
	{
		var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(),
										CSubscriptionManager.k_SubscriptionWizardName);

		GUtil.createFormField(form, "m_obj", sub.searchPath);
		GUtil.createFormField(form, "m_name", sub.name);
		GUtil.createFormField(form, "b_action", "xts.run");
		GUtil.createFormField(form, "m_class", "reportDataServiceAgentDefinition");
		GUtil.createFormField(form, "m", "portal/properties_subscription.xts");
		GUtil.createFormField(form, "backURL", "javascript:window.close();");

		var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
		window.open(sPath, form.target, "toolbar,location,status,menubar,resizable,scrollbars=1");
	}
};

/**
	Does an AJAX call to get the needed information, and then updated the
	drop down menu
*/
CSubscriptionManager.prototype.OpenSubscriptionMenu = function()
{
	var oCV = this.getViewer();
	var request = new JSONDispatcherEntry(oCV);
	request.setKey("subscriptionManager");
	request.addFormField("ui.action", "getSubscriptionInfo");
	request.addFormField("cv.responseFormat", "subscriptionManager");
	this.addCommonFormFields(request);

	request.setCallbacks({"complete":{"object":this, "method":this.OpenSubscriptionMenuResponse}});

	oCV.dispatchRequest(request);
};

/**
	Does an AJAX call to get the needed information, and then updated the
	drop down menu
*/
CSubscriptionManager.prototype.OpenAnnotationMenu = function()
{
	var oCV = this.getViewer();
	var request = new JSONDispatcherEntry(oCV);
	request.setKey("subscriptionManager");
	request.addFormField("ui.action", "getAnnotationInfo");
	request.addFormField("cv.responseFormat", "getAnnotations");
	var uiObject = oCV.envParams["ui.object"];
	this.addCommonFormFields(request, uiObject ? uiObject : "");

	request.setCallbacks({"complete":{"object":this, "method":this.OpenAnnotationMenuResponse}});

	oCV.dispatchRequest(request);
};

/**
	OpenSubscriptionMenuCallback will initialzie the CSubscriptionManager object and open the menu
	@param {httpRequest} the XML response from the viewer
*/
CSubscriptionManager.prototype.OpenAnnotationMenuResponse = function(response)
{
	if (this.Initialize(response)) {
		this.UpdateAnnotationMenu();
	}
	else {
		// something bad happened, just clear the menu
		this.ClearAnnotationMenu();
	}
};



/**
	OpenSubscriptionMenuCallback will initialzie the CSubscriptionManager object and open the menu
	@param {httpRequest} the XML response from the viewer
*/
CSubscriptionManager.prototype.OpenSubscriptionMenuResponse = function(response)
{
	if (this.Initialize(response))
	{
		this.UpdateSubscribeMenu();
	}
	else
	{
		// something bad happened, just clear the menu
		this.AddEmptySubscriptionMenuItem();
	}
};

CSubscriptionManager.prototype.addCommonFormFields = function(request, searchPath) {
	if (searchPath && searchPath != "") {
		request.addFormField("ui.object", searchPath);
	}
	else {
		var formWarpRequest = document["formWarpRequest" + this.getViewer().getId()];
		if (formWarpRequest && formWarpRequest["reRunObj"]) {
			request.addFormField("ui.object", formWarpRequest["reRunObj"].value);
		}
	}

	// if we're already initialized it'll cut down on the number of CM queries we need to do
	if (request.getFormField("ui.action") == "getSubscriptionInfo") {
		request.addFormField("initialized", this.m_bInitialized ? "true" : "false");
	}

	request.addFormField("cv.id", this.getViewer().getId());
};

/**
 * When there's nothing else to show in the Subscription menu, show
 * a disabled menu item
 */
CSubscriptionManager.prototype.AddEmptySubscriptionMenuItem = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	if (toolbar)
	{
		var subscribeButton = toolbar.getItem("watchNewVersions");
		if (subscribeButton)
		{
			subscribeButton.getMenu().clear();
		}

		var sWebContentRoot = this.m_cv.getWebContentRoot();
		var sSkin = this.m_cv.getSkin();
		var subscribeDropDownMenu = subscribeButton.getMenu();
		var noWatchRules = new CMenuItem(subscribeDropDownMenu, RV_RES.RV_NO_WATCH_RULES, "", '', gMenuItemStyle, sWebContentRoot, sSkin);
		noWatchRules.disable();

		// make sure we don't use the callback when drawing the menu
		subscribeDropDownMenu.setForceCallback(false);
		subscribeDropDownMenu.draw();
		if (subscribeDropDownMenu.isVisible()) {
			subscribeDropDownMenu.show();
		}

		// make sure our callback is used when the menu gets opened again
		subscribeDropDownMenu.setForceCallback(true);
	}
};

/**
	Removes all the menu items from the 'Watch New Versions' menu
*/
CSubscriptionManager.prototype.ClearSubscriptionMenu = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	if (toolbar)
	{
		var subscribeButton = toolbar.getItem("watchNewVersions");
		if (subscribeButton)
		{
			subscribeButton.getMenu().clear();
		}
	}
};

/**
	Removes all the menu items from the 'add Annotations' menu
*/
CSubscriptionManager.prototype.ClearAnnotationMenu = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	if (toolbar)
	{
		var annotationButton = toolbar.getItem("addAnnotations");
		if (annotationButton)
		{
			annotationButton.getMenu().clear();
		}
	}
};

/**
	Removes all the menu items from the 'add Annotations' menu
*/
CSubscriptionManager.prototype.ClearContextAnnotationMenu = function()
{
	var contextMenu = this.getStandaloneViewerContextMenu();
	if (contextMenu)
	{
		var commentFindAnnotationsMenu = contextMenu.getFindCommentMenuItem();
		if (commentFindAnnotationsMenu)
		{
			commentFindAnnotationsMenu.getMenu().clear();
		}
	}
};

CSubscriptionManager.prototype.getStandaloneViewerToolbarControl = function()
{
	if(typeof this.m_cv.rvMainWnd != "undefined" && this.m_cv.rvMainWnd != null && typeof this.m_cv.rvMainWnd.getToolbarControl == "function")
	{
		return this.m_cv.rvMainWnd.getToolbarControl();
	}
	else
	{
		return null;
	}
};

CSubscriptionManager.prototype.getStandaloneViewerContextMenu = function()
{
	if(typeof this.m_cv.rvMainWnd != "undefined" && this.m_cv.rvMainWnd != null && typeof this.m_cv.rvMainWnd.getContextMenu == "function")
	{
		return this.m_cv.rvMainWnd.getContextMenu();
	}
	else
	{
		return null;
	}
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function CSelectionMetadata()
{
	this.m_sContextId = "";
	this.m_sDataItem = "";
	this.m_sMetadataModelItem = "";
	this.m_sUseValue = "";
	this.m_sUseValueType = "";
	this.m_sType = null;
	this.m_sDisplayValue = "";
	this.m_sUsage = null;
	this.m_refQuery = null;
	this.m_sHun = null;
	this.m_sDun = null;
}

CSelectionMetadata.prototype.setContextId = function(sContextId)
{
	this.m_sContextId = sContextId;
};

CSelectionMetadata.prototype.getContextId = function()
{
	return this.m_sContextId;
};

CSelectionMetadata.prototype.setRefQuery = function(sRefQuery)
{
	this.m_refQuery = sRefQuery;
};

CSelectionMetadata.prototype.getRefQuery = function()
{
	return this.m_refQuery;
};

CSelectionMetadata.prototype.setDataItem = function(sDataItem)
{
	this.m_sDataItem = sDataItem;
};

CSelectionMetadata.prototype.getDataItem = function()
{
	return this.m_sDataItem;
};

CSelectionMetadata.prototype.setMetadataModelItem = function(sMetadataModelItem)
{
	this.m_sMetadataModelItem = sMetadataModelItem;
};

CSelectionMetadata.prototype.getMetadataModelItem = function()
{
	return this.m_sMetadataModelItem;
};

CSelectionMetadata.prototype.setUseValue = function(sUseValue)
{
	this.m_sUseValue = sUseValue;
};

CSelectionMetadata.prototype.getUseValue = function()
{
	return this.m_sUseValue;
};

CSelectionMetadata.prototype.setUseValueType = function(sUseValueType)
{
	this.m_sUseValueType = sUseValueType;
};

CSelectionMetadata.prototype.setType = function(sType)
{
	this.m_sType = sType;
};

CSelectionMetadata.prototype.getType = function()
{
	var sType = null;
	switch(this.m_sUseValueType)
	{
		case 25: // MemberUniqueName
		case 27: // DimensionUniqueName
		case 30: // HierarchyUniqueName
		case 32: // LevelUniqueName
			sType = "memberUniqueName";
			break;
		case 26: //MemberCaption
			sType = "memberCaption";
			break;
		case 1: // String
		case 55: //I18NExternalBuffer
		case 56: //I18NExternalBuffer
			sType = "string";
			break;
		case 2: //Int8
		case 3: //UInt8
		case 4: //Int16
		case 5: //UInt16
		case 6: //Int32
		case 7: //UInt32
		case 8: //Int64
		case 9: //UInt64
		case 10: //float
		case 11: //double
		case 12: //decimal
		case 16: //dt interval
		case 17: //ym interval
		case 18: //blob
		case 19: //RowIterator
		case 20: //DimInterator
		case 22: //Variant
		case 21: //MasterDataset
		case 23: //Binary
		case 24: //VarBinary
		case 54: //numeric
			sType = parseInt(this.m_sUseValueType,10);
			break;
	}
	return sType;
};

CSelectionMetadata.prototype.getUseValueType = function()
{
	if(this.m_sType == null)
	{
		this.m_sType = this.getType();
	}

	return this.m_sType;
};

CSelectionMetadata.prototype.setDisplayValue = function(sDisplayValue)
{
	this.m_sDisplayValue = sDisplayValue;
};

CSelectionMetadata.prototype.getDisplayValue = function()
{
	return this.m_sDisplayValue;
};

CSelectionMetadata.prototype.setUsage = function(sUsage)
{
	this.m_sUsage = sUsage;
};

CSelectionMetadata.prototype.getUsage = function()
{
	if(this.m_sUsage == "2")
	{
		return "measure";
	}
	else
	{
		return "nonMeasure";
	}
};

CSelectionMetadata.prototype.setHun = function(sHun)
{
	this.m_sHun = sHun;
};

CSelectionMetadata.prototype.getHun = function()
{
	return this.m_sHun;
};

CSelectionMetadata.prototype.setDun = function(sDun)
{
	this.m_sDun = sDun;
};

CSelectionMetadata.prototype.getDun = function()
{
	return this.m_sDun;
};


function CSelectionMetadataIterator(selectionObject, axisIndex)
{
	this.m_axisIndex = axisIndex;
	this.m_index = 0;
	this.m_selectionObject = selectionObject;
}

CSelectionMetadataIterator.prototype.getSelectionAxis = function()
{
	var selectionAxis = null;

	if(typeof this.m_selectionObject == "object" && this.m_axisIndex < this.m_selectionObject.getSelectedContextIds().length)
	{
		selectionAxis = this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex];
	}

	return selectionAxis;
};

CSelectionMetadataIterator.prototype.hasNext = function()
{
	var selectionAxis = this.getSelectionAxis();
	if(selectionAxis != null)
	{
		return (this.m_index < selectionAxis.length);
	}
	else
	{
		return false;
	}
};

CSelectionMetadataIterator.prototype.next = function()
{
	var selectionMetadata = null;
	if(this.hasNext())
	{
		selectionMetadata = new CSelectionMetadata();
		selectionMetadata.setContextId(this.m_selectionObject.m_contextIds[this.m_axisIndex][this.m_index]);
		selectionMetadata.setDataItem(this.m_selectionObject.getDataItems()[this.m_axisIndex][this.m_index]);
		selectionMetadata.setMetadataModelItem(this.m_selectionObject.getMetadataItems()[this.m_axisIndex][this.m_index]);

		if(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index] != null && this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index] != "")
		{
			selectionMetadata.setUseValue(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]);
			selectionMetadata.setType("memberUniqueName");
		}
		else
		{
			selectionMetadata.setUseValue(this.m_selectionObject.getUseValues()[this.m_axisIndex][this.m_index]);
		}

		if(typeof this.m_selectionObject.m_selectionController == "object")
		{
			var ctxId = this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex][this.m_index];

			if (this.m_selectionObject.useDisplayValueFromObject) //display value can be set by DrillAction.parseDrillSpec()
			{
				selectionMetadata.setDisplayValue(this.m_selectionObject.getDisplayValues()[this.m_axisIndex]);
			}
			else
			{
			    var tableRow = null;
			    var displayValue = null;
			    //CQ: COGCQ00655050 - if we know we're getting the display values for a row, 
			    //then instead of searching the entire report we search the Table Row for it 
			    //and if it exists return the display value - if not search the entire report.
			    if (this.m_axisIndex === 0) {
			        var cellRef = this.m_selectionObject.getCellRef();
			        if (cellRef && cellRef.nodeName && cellRef.nodeName.toLowerCase() === "td") {
			            displayValue = this.m_selectionObject.m_selectionController.getDisplayValueFromDOM(ctxId, cellRef.parentNode);
			        }
			    }
				
			    if (displayValue == null) {
				    displayValue = this.m_selectionObject.m_selectionController.getDisplayValue(ctxId);
			    }
			    if (displayValue === "") {
				    displayValue = this.m_selectionObject.m_selectionController.getUseValue(ctxId);
				}
				selectionMetadata.setDisplayValue(displayValue);
			}
			selectionMetadata.setUseValueType(this.m_selectionObject.m_selectionController.getDataType(ctxId));
			selectionMetadata.setUsage(this.m_selectionObject.m_selectionController.getUsageInfo(ctxId));
			selectionMetadata.setRefQuery(this.m_selectionObject.m_selectionController.getRefQuery(ctxId));
			selectionMetadata.setHun(this.m_selectionObject.m_selectionController.getHun(ctxId));
			selectionMetadata.setDun(this.m_selectionObject.m_selectionController.getDun(ctxId));
		}

		++this.m_index;
	}

	return selectionMetadata;
};

function CAxisSelectionIterator(selectionObject)
{
	this.m_index = 0;
	this.m_selectionObject = selectionObject;
}

CAxisSelectionIterator.prototype.hasNext = function()
{
	return ((typeof this.m_selectionObject == "object") && (this.m_index < this.m_selectionObject.getSelectedContextIds().length));
};

CAxisSelectionIterator.prototype.next = function()
{
	var selectionMetadataIterator = null;

	if(this.hasNext())
	{
		selectionMetadataIterator = new CSelectionMetadataIterator(this.m_selectionObject, this.m_index);
		++this.m_index;
	}

	return selectionMetadataIterator;
};

function getSelectionContextIds(selectionController)
{
	var contextIds = [];

	var selectedObjects = selectionController.getAllSelectedObjects();

	if(selectedObjects != null && selectedObjects.length > 0)
	{
		for(var index = 0; index < selectedObjects.length; ++index)
		{
			var selectedObject = selectedObjects[index];
			var selectedContextIds = selectedObject.getSelectedContextIds();

			var itemArray = [];
			for(var item = 0; item < selectedContextIds.length; ++item)
			{
				var itemIdList = selectedContextIds[item].join(":");
				itemArray.push(itemIdList);
			}

			contextIds.push(itemArray.join("::"));
		}
	}

	return contextIds;
}

function getViewerSelectionContext(selectionController, selectionContext, uniqueCTXIDs)
{
	var selectedObjects = uniqueCTXIDs == true ? selectionController.getAllSelectedObjectsWithUniqueCTXIDs() : selectionController.getAllSelectedObjects();

	if(selectedObjects != null && selectedObjects.length > 0)
	{
		for(var index = 0; index < selectedObjects.length; ++index)
		{
			var usedIds = {};
			var axisSelectionIterator = new CAxisSelectionIterator(selectedObjects[index]);

			if(axisSelectionIterator.hasNext())
			{
				var selectionMetadataIterator = axisSelectionIterator.next();
				if(selectionMetadataIterator.hasNext())
				{
					var selectionMetadata = selectionMetadataIterator.next();
					var contextId = selectionMetadata.getContextId();

					usedIds[contextId] = true;
					var selectedCell = selectionContext.addSelectedCell(selectionMetadata.getDataItem(), selectionMetadata.getMetadataModelItem(), selectionMetadata.getUseValue(), selectionMetadata.getUseValueType(), selectionMetadata.getDisplayValue(), selectionMetadata.getUsage(), {"queryName":selectionMetadata.getRefQuery()});
					if (selectionMetadata.getHun() != null)
					{
						selectedCell.addProperty("HierarchyUniqueName", selectionMetadata.getHun());
					}
					if (selectionMetadata.getDun() != null)
					{
						selectedCell.addProperty("DimensionUniqueName", selectionMetadata.getDun());
					}


					while(selectionMetadataIterator.hasNext())
					{
						selectionMetadata = selectionMetadataIterator.next();

						contextId = selectionMetadata.getContextId();
						if(typeof usedIds[contextId] == "undefined" || contextId === "")
						{
							usedIds[contextId] = true;
							var definingCell = selectedCell.addDefiningCell(selectionMetadata.getDataItem(), selectionMetadata.getMetadataModelItem(), selectionMetadata.getUseValue(), selectionMetadata.getUseValueType(),  selectionMetadata.getDisplayValue(), selectionMetadata.getUsage(), {"queryName":selectionMetadata.getRefQuery()});
							if (selectionMetadata.getHun() != null)
							{
								definingCell.addProperty("HierarchyUniqueName", selectionMetadata.getHun());
							}
							if (selectionMetadata.getDun() != null)
							{
								definingCell.addProperty("DimensionUniqueName", selectionMetadata.getDun());
							}
						}
					}

					while(axisSelectionIterator.hasNext())
					{
						selectionMetadataIterator = axisSelectionIterator.next();
						var starterCell = selectedCell;
						while(selectionMetadataIterator.hasNext())
						{
							selectionMetadata = selectionMetadataIterator.next();
							contextId = selectionMetadata.getContextId();
							if(typeof usedIds[contextId] == "undefined" || contextId === "")
							{
								usedIds[contextId] = true;
								starterCell = starterCell.addDefiningCell(selectionMetadata.getDataItem(), selectionMetadata.getMetadataModelItem(), selectionMetadata.getUseValue(), selectionMetadata.getUseValueType(),  selectionMetadata.getDisplayValue(), selectionMetadata.getUsage(), {"queryName":selectionMetadata.getRefQuery()});
								if (selectionMetadata.getHun() != null)
								{
									starterCell.addProperty("HierarchyUniqueName", selectionMetadata.getHun());
								}
								if (selectionMetadata.getDun() != null)
								{
									starterCell.addProperty("DimensionUniqueName", selectionMetadata.getDun());
								}
							}
						}
					}
				}
			}
		}
	}

	var sSelectionContext = selectionContext.toString();

	if (window.gViewerLogger)
	{
		window.gViewerLogger.log('Selection context', sSelectionContext, "xml");
	}

	return sSelectionContext;
}

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
dojo.provide("bux.dialogs.CalculationDialog");

dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");

dojo.declare("viewer.dialogs.CalculationDialog", bux.dialogs.BaseCustomContentDialog, {
	sTitle: null,
	sLabel: null, /*String the lablel of the calculation  dialog*/
	sDescription: null,
	sContentLocale: null,
	okHandler: null, /*Function?*/
	cancelHandler:null, /*Function?*/

	startup: function() {
		this.updateTitle(this.sTitle);
		this.inherited(arguments);
		var tableContainer = new bux.layout.TableContainer({
			// TODO remove this class
			classname: "bux-InformationDialog"
		},this.contentContainer);

		var cell = null, row = null;
		if (this.sDescription) {
			row = new bux.layout.TableContainerRow({
				parentContainer: tableContainer
			});
			cell = new bux.layout.TableContainerCell({
				classname: "bux-dialog-info",
				parentContainer: row
			});
			cell.addContent(document.createTextNode(this.sDescription));

			dijit.setWaiState(this._buxBaseDialog.domNode, "describedBy", cell.id);
		}

		row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});
		cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-label",
			parentContainer: row
		});

		this._calculationField = new dijit.form.NumberTextBox({
			required:true,
			onBlur:function() {
								if(!this._cancelled && !this.isValid() ) {
									this.focus();
								}
			},
			_setOKBtnDisabled : function(oButtons, bDisabled) {
				//note: localized label compare (product locale)
				if(oButtons && oButtons[0] && oButtons[0].label === RV_RES.IDS_JS_OK) {
					oButtons[0].set("disabled", bDisabled);
				}
			},

			isValid: function(){
				//the constraints will apply locale information when doing validation
				var bIsValid = this.validator(this.get("displayedValue"), this.get("constraints"));
				this._setOKBtnDisabled(this.oDlgBtns, !bIsValid);
				return bIsValid;
			}
		});

		if (this.sContentLocale != null) {
			dojo.requireLocalization("dojo.cldr", "number", this.sContentLocale);
			this._calculationField.constraints = {
				locale: this.sContentLocale
			};
		}
		var _label = document.createElement("label");
		_label.appendChild(document.createTextNode(this.sLabel));
		_label.setAttribute("for", this._calculationField.id);
		cell.addContent(_label);

		row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});

		cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-field",
			parentContainer: row
		});
		cell.addContent(this._calculationField.domNode);

		this._calculationField.oDlgBtns = this._buxBaseDialog._aButtonObjects;
	},


	onOK : function()
	{
		if (this._calculationField.state != "Error")
		{
			this.inherited(arguments);
			this.okHandler(this._calculationField.get("value"));
			this.hide();
		}
	},


	onCancel : function() {
		//this flag is used to make sure that the tooltip for the numberTextBox is not set to the wrong node when
		//cancelled is called
		this._calculationField._cancelled = true;
		this.inherited( arguments );
	}
});
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
dojo.provide("bux.dialogs.ConfirmationDialog");

viewer.dialogs.ConfirmationDialog = function (_title,_sMainMessage, _sDescription, sInfoIconClass, callerObject, _yesHandlerOfCallerObject) {

	dojo["require"]("bux.dialogs.InformationDialog"); //@lazyload
	var ConfirmDialog = new bux.dialogs.Confirm(
			_title,
			_sMainMessage,
			_sDescription,
			dojo.hitch(callerObject, _yesHandlerOfCallerObject, callerObject ),
			sInfoIconClass
			);
	return ConfirmDialog;
};

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
dojo.provide("bux.dialogs.SelectSnapshot");

dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");

dojo.declare("viewer.dialogs.SelectSnapshot", bux.dialogs.BaseCustomContentDialog, {
	sTitle: null,
	sLabel: null, /*String the lablel of the calculation  dialog*/
	okHandler: null, /*Function?*/
	cancelHandler:null, /*Function?*/

	startup: function() {
		this.updateTitle(this.sTitle);
		this.inherited(arguments);
		var tableContainer = new bux.layout.TableContainer({
			// TODO remove this class
			classname: "bux-InformationDialog"
		},this.contentContainer);

		var row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});
		var cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-label",
			parentContainer: row
		});

		this.createSnapshotsControl();

		var _label = document.createElement("label");
		_label.appendChild(document.createTextNode(this.sLabel));
		_label.setAttribute("for", this._snapshots.id);
		cell.addContent(_label);

		row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});
		cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-field",
			parentContainer: row
		});
		cell.addContent(this._snapshots);
	},
	onOK : function()
	{
		this.inherited(arguments);
		var selectedIndex = this._snapshots.selectedIndex;
		var selectionOption = this._snapshots.options[selectedIndex];
		this.okHandler(selectionOption.getAttribute("storeID"), selectionOption.value);
		this.hide();
	},
	createSnapshotsControl : function()
	{
		this._snapshots = document.createElement("select");
		this._snapshots.id = this.dialogId + "snapshots";
		this._snapshots.setAttribute("size", "8");
		this._snapshots.setAttribute("name", this.dialogId + "snapshots");

		var queryResult = XMLHelper_FindChildByTagName(this.cmResponse, "result", true);
		var queryItems = XMLHelper_FindChildrenByTagName(queryResult, "item", false);

		for (var iIndex=0; iIndex < queryItems.length; iIndex++) {
			var queryItem = queryItems[iIndex];
			var sItemLabel = XMLHelper_GetText(XMLHelper_FindChildByTagName(queryItem, "creationTime_localized", true));

			var storeIDNode = XMLHelper_FindChildByTagName(queryItem, "storeID", true);
			var sStoreID = XMLHelper_GetText(XMLHelper_FindChildByTagName(storeIDNode, "value", true));

			var creationTimeNode = XMLHelper_FindChildByTagName(queryItem, "creationTime", true);
			var sCreationTime = XMLHelper_GetText(XMLHelper_FindChildByTagName(creationTimeNode, "value", true));

			this._snapshots.options[iIndex] = new Option(sItemLabel, sCreationTime);
			this._snapshots.options[iIndex].setAttribute("storeID", sStoreID);
			if (this.currentSnapshotCreationTime == sCreationTime) {
				this._snapshots.options[iIndex].selected = true;
			}
		}
	}
});
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * CognosViewerAction constructor (base class for all cognos viewer action
 * @constructor
 */
function CognosViewerAction()
{
	this.m_oCV = null;
}

CognosViewerAction.prototype.setRequestParms = function( parms ){};
CognosViewerAction.prototype.onMouseOver = function(evt) { return false; };
CognosViewerAction.prototype.onMouseOut = function(evt) { return false; };
CognosViewerAction.prototype.onMouseDown = function(evt) { return false; };
CognosViewerAction.prototype.onClick = function(evt) { return false; };
CognosViewerAction.prototype.onDoubleClick = function(evt) { return false; };
CognosViewerAction.prototype.updateMenu = function(jsonSpec) { return jsonSpec; };
CognosViewerAction.prototype.addAdditionalOptions = function(request) {};
CognosViewerAction.prototype.genSelectionContextWithUniqueCTXIDs = function() { return false; };
CognosViewerAction.prototype.doUndo = function() {if(typeof console != "undefined") { console.log("Required method doUndo not implemented.");}};
CognosViewerAction.prototype.doRedo = function() {if(typeof console != "undefined") { console.log("Required method doRedo not implemented.");}};
CognosViewerAction.prototype.forceRunSpecRequest = function() {return false;};

/**
 * Method that gets called before the action context gets built. If
 * there's anything special that the action needs to do, they should
 * override this method.
 */
CognosViewerAction.prototype.preProcess = function() {};

/**
 * Sets the cognos viewer object (called by the action factory
 * @param CCognosViewer object
 * @private
 */
CognosViewerAction.prototype.setCognosViewer = function(oCV)
{
	this.m_oCV = oCV;
};

/**
 * Returns an instance to the cognos viewer object
 * @return CCognosViewer object
 */
CognosViewerAction.prototype.getCognosViewer = function()
{
	return this.m_oCV;
};

CognosViewerAction.prototype.getUndoRedoQueue = function()
{
	if (this.getCognosViewer().getViewerWidget()) {
		return this.getCognosViewer().getViewerWidget().getUndoRedoQueue();
	}

	return null;
};

CognosViewerAction.prototype.getViewerWidget = function()
{
	return this.m_oCV.getViewerWidget();
};

/**
 * Returns the object display name (custom name/report name/report part name)
 */
CognosViewerAction.prototype.getObjectDisplayName = function()
{
	var displayName = "";

	if(this.m_oCV != null)
	{
		if(typeof this.m_oCV.envParams["reportpart_id"] != "undefined")
		{
			displayName = this.m_oCV.envParams["reportpart_id"];
		}
		else if(typeof this.m_oCV.envParams["ui.name"] != "undefined")
		{
			displayName = this.m_oCV.envParams["ui.name"];
		}
	}

	return displayName;
};

/**
 * Gets the container Id
 */
CognosViewerAction.prototype.getContainerId = function(selectionController) {
	var container = "";
	if (selectionController && selectionController.getAllSelectedObjects) {
		var allSel = selectionController.getAllSelectedObjects();
		if (allSel) {
			var selection = allSel[0];
			if (selection && selection.getLayoutElementId) {
				container = this.removeNamespace(selection.getLayoutElementId());
			}
		}
	}

	return container;
};

CognosViewerAction.prototype.removeNamespace = function(value)
{
	var originalValue = value;

	try
	{
		if(value != "")
		{
			var idIndex = value.indexOf(this.m_oCV.getId());
			if(idIndex != -1)
			{
				value = value.replace(this.m_oCV.getId(), "");
			}
		}

		return value;
	}
	catch(e)
	{
		return originalValue;
	}
};

CognosViewerAction.prototype.doAddActionContext = function()
{
	return true;
};

CognosViewerAction.prototype.getSelectionContext = function()
{
	return getViewerSelectionContext(this.m_oCV.getSelectionController(), new CSelectionContext(this.m_oCV.envParams["ui.object"]), this.genSelectionContextWithUniqueCTXIDs());
};

CognosViewerAction.prototype.getNumberOfSelections = function()
{
	var numberOfSelections = -1;
	if(this.m_oCV != null && this.m_oCV.getSelectionController() != null)
	{
		numberOfSelections = this.m_oCV.getSelectionController().getSelections().length;
	}

	return numberOfSelections;
};

CognosViewerAction.prototype.buildDynamicMenuItem = function(jsonSpec, actionClass)
{
	jsonSpec.action =  {name: "LoadMenu", payload: {action:actionClass}};
	jsonSpec.items = [{ "name": "loading",
	 "label" : RV_RES.GOTO_LOADING,
	 iconClass: "loading"}];
	return jsonSpec;
};

/**
 * TODO - dispatcherEntry cleanup
 * @param {Object} requestType
 */
CognosViewerAction.prototype.createCognosViewerDispatcherEntry = function( requestType )
{
	var oReq = new ViewerDispatcherEntry(this.getCognosViewer());
	oReq.addFormField("ui.action", requestType);

	this.preProcess();

	if( this.doAddActionContext() === true )
	{
		var actionContext = this.addActionContext();
		oReq.addFormField("cv.actionContext", actionContext);
		if (window.gViewerLogger)
		{
			window.gViewerLogger.log('Action context', actionContext, "xml");
		}
	}

	oReq.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);

	if(typeof this.m_oCV.envParams["ui.spec"] != "undefined")
	{
		oReq.addFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
	}

	if(this.m_oCV.getModelPath() !== "")
	{
		oReq.addFormField("modelPath", this.m_oCV.getModelPath());
	}

	if(typeof this.m_oCV.envParams["packageBase"] != "undefined")
	{
		oReq.addFormField("packageBase", this.m_oCV.envParams["packageBase"]);
	}

	if (typeof this.m_oCV.envParams["rap.state"] != "undefined")
	{
		oReq.addFormField("rap.state", this.m_oCV.envParams["rap.state"]);
	}

	if (typeof this.m_oCV.envParams["rapReportInfo"] != "undefined")
	{
		oReq.addFormField("rap.reportInfo", this.m_oCV.envParams["rapReportInfo"]);
	}

	this.addAdditionalOptions(oReq);

	return oReq;
};


CognosViewerAction.prototype.fireModifiedReportEvent = function()
{
	try
	{
		var viewerWidget = this.getCognosViewer().getViewerWidget();
		if (viewerWidget) {
			var payload = {'modified':true};
			viewerWidget.fireEvent("com.ibm.bux.widget.modified", null, payload);
		}
	} catch(e) {}
};

CognosViewerAction.prototype.showCustomCursor = function(evt, id, imageRef)
{
	var customCursor = document.getElementById(id);
	if(customCursor == null)
	{
		customCursor = document.createElement("span");
		customCursor.className = "customCursor";
		customCursor.setAttribute("id", id);
		document.body.appendChild(customCursor);
	}

	var imageSrcHtml = "<img src=\"" + this.getCognosViewer().getWebContentRoot() + imageRef + "\"/>";

	customCursor.innerHTML = imageSrcHtml;
	customCursor.style.position = "absolute";
	customCursor.style.left = (evt.clientX + 15) + "px";
	customCursor.style.top = (evt.clientY + 15) + "px";
	customCursor.style.display = "inline";
};

CognosViewerAction.prototype.hideCustomCursor = function(id)
{
	var customCursor = document.getElementById(id);
	if(customCursor != null)
	{
		customCursor.style.display = "none";
	}
};

CognosViewerAction.prototype.selectionHasContext = function()
{
	var selections = this.getCognosViewer().getSelectionController().getAllSelectedObjects();
	var bContext = false;
	if(selections != null && selections.length > 0)
	{
		for (var i=0; i < selections.length; i++)
		{
			if (selections[i].hasContextInformation())
			{
				bContext = true;
				break;
			}
		}
	}

	return bContext;
};

CognosViewerAction.prototype.isInteractiveDataContainer = function(displayTypeId)
{
	var result = false;
	if (typeof displayTypeId != "undefined" && displayTypeId != null) {
		var id = displayTypeId.toLowerCase();
		result = id == 'crosstab' || id == 'list' || this.getCognosViewer().getRAPReportInfo().isChart(id);
	}
	return result;
};


CognosViewerAction.prototype.getSelectedContainerId = function() {
	var viewer = this.getCognosViewer();

	var selectionController = viewer.getSelectionController();
	var containerId = null;
	if( selectionController != null && typeof selectionController != "undefined") {
		containerId = this.getContainerId( selectionController );
	}

	return containerId;
};

CognosViewerAction.prototype.getSelectedReportInfo = function() {
	var viewer = this.getCognosViewer();

	var containerId = this.getSelectedContainerId();

	var selectedObject = this.getReportInfo(containerId);
	if( selectedObject == null )
	{
		//if there is more than one object, we'll return null
		var oRAPReportInfo = viewer.getRAPReportInfo();
		if(oRAPReportInfo.getContainerCount() == 1)
		{
			selectedObject = oRAPReportInfo.getContainerFromPos(0);
		}
	}

	return selectedObject;
};

CognosViewerAction.prototype.getReportInfo = function(containerId) {
	var selectedObject = null;
	if( containerId != null && containerId.length > 0 )
	{
		var viewer = this.getCognosViewer();
		var oRAPReportInfo = viewer.getRAPReportInfo();
		selectedObject = oRAPReportInfo.getContainer(containerId);
	}
	return selectedObject;
};

CognosViewerAction.prototype.isSelectionOnChart = function() {

	var viewer = this.getCognosViewer();

	if (viewer.getSelectionController().hasSelectedChartNodes())
	{
		return true;
	}

	var containerId = this.getContainerId( viewer.getSelectionController());

	if (typeof containerId != "undefined")
	{
		var reportInfo = this.getReportInfo(containerId);
		if (reportInfo != null && reportInfo.displayTypeId)
		{
			var displayTypeId = reportInfo.displayTypeId.toLowerCase();
			return viewer.getRAPReportInfo().isChart(displayTypeId);
		}
	}
	return false;
};

CognosViewerAction.prototype.ifContainsInteractiveDataContainer = function()
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	if (oRAPReportInfo) {
		return oRAPReportInfo.containsInteractiveDataContainer();
	}

	return false;
};


/**
*	Detect from report Info if the widget is a prompt control or a prompt page and  only one container (the global one)
*
*/
CognosViewerAction.prototype.isPromptWidget = function()
{
	var oCV = this.getCognosViewer();
	if (oCV.getRAPReportInfo() && oCV.getRAPReportInfo().isPromptPart()) {
		return true;
	}
	return false;
};


CognosViewerAction.prototype.getLayoutComponents = function()
{
	var layoutComponents = [];
	var reportTable = document.getElementById("rt" + this.m_oCV.getId());
	if(reportTable != null)
	{
		layoutComponents = getElementsByAttribute(reportTable, "*", "lid");
	}

	return layoutComponents;
};


//For applicable RAP actions, add a subset of the context/metadata table as action arguments....
CognosViewerAction.prototype.addClientContextData = function(maxValuesPerRDI)
{
	var selectionController = this.m_oCV.getSelectionController();
	if (typeof selectionController!="undefined" && selectionController!=null &&
		typeof selectionController.getCCDManager!="undefined" && selectionController.getCCDManager()!=null) {
		var oCCDManager = selectionController.getCCDManager();
		return ("<md>" + xml_encode(oCCDManager.MetadataToJSON()) +	"</md>" +
				"<cd>" + xml_encode(oCCDManager.ContextDataSubsetToJSON(maxValuesPerRDI)) +	"</cd>");
	}
	return "";
};

//For applicable RAP actions, add a Map of dataItem names and a count of
CognosViewerAction.prototype.getDataItemInfoMap = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	if (typeof selectionController!="undefined" && selectionController!=null &&
		typeof selectionController.getCCDManager!="undefined" && selectionController.getCCDManager()!=null) {
		var oCCDManager = selectionController.getCCDManager();
		return ("<di>" + xml_encode(oCCDManager.DataItemInfoToJSON()) +	"</di>" );
	}
	return "";
};

CognosViewerAction.prototype.getRAPLayoutTag = function(cellRef)
{
	var tagValue = null;
	if (typeof cellRef == "object" && cellRef != null ) {
		tagValue = cellRef.getAttribute("rap_layout_tag");
	}
	return tagValue;
};

/**
 * Helper method to add the correct properties to a menuItem so it shows up 'checked'
 * @param {Object} bChecked - boolean if the menuItem should be checked
 * @param {Object} oMenuItem - the menuItem object
 * @param {Object} sUncheckedIconClass - optional css class to use if the menuItem is unchecked
*/
CognosViewerAction.prototype.addMenuItemChecked = function(bChecked, oMenuItem, sUncheckedIconClass) {
	if (bChecked) {
		if (this.getCognosViewer().isHighContrast()) {
			oMenuItem["class"] = "menuItemSelected";
		}

		oMenuItem.iconClass = "menuItemChecked";
	}
	else if (sUncheckedIconClass && sUncheckedIconClass.length > 0) {
		oMenuItem.iconClass = sUncheckedIconClass;
	}
};

CognosViewerAction.prototype.gatherFilterInfoBeforeAction = function(action) {
	var widget = this.getCognosViewer().getViewerWidget();
	widget.filterRequiredAction = action;
	widget.clearRAPCache();
	widget.fireEvent("com.ibm.bux.widget.action", null, { action: 'canvas.filters' } );
};

CognosViewerAction.prototype.addClientSideUndo = function(action, aParams) {
	var undoCallback = GUtil.generateCallback(action.doUndo, aParams, action);
	var redoCallback = GUtil.generateCallback(action.doRedo, aParams, action);
	this.getUndoRedoQueue().addClientSideUndo({"tooltip" : action.getUndoHint(), "undoCallback" : undoCallback, "redoCallback" : redoCallback});
	this.getCognosViewer().getViewerWidget().updateToolbar();
};

/*
 * It is client side menu item checking depending upon two things
 *  - area: global area or regular tab
 *  - report type: whether it is prompt part or not
 *
 * Default:
 *  - not valid in gloabl area
 *  - not valid on prompt part in regular tab
 *  - valid on regular report in regular tab
 *
 * @override
 */
CognosViewerAction.prototype.isValidMenuItem = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();

	if (this.isPromptWidget()) {
		return false; //not valid on prompt part
	}
	return true;
};

CognosViewerAction.prototype.isPositiveInt = function(value) {
	if (typeof value === "undefined" || value === null) {
		return false;
	}

	var paresedValue = parseInt(value, 10);
	return value && paresedValue === +value && paresedValue > 0 && value.indexOf('.') == -1;
};


/**
 * Builds a PUBLIC object to return error information from an action.
 * DO NOT CHANGE THIS API
 */
CognosViewerAction.prototype.buildActionResponseObject = function(status, code, msg) {
	return {
		"status" : status,
		"message" : msg ? msg : null,
		"code" : code ? code : null,
		getStatus : function() { return this.status; },
		getMessage : function() { return this.message; },
		getCode : function() { return this.code; }
	};
};

/**
 * LineageAction - implements lineage in cognos viewer
 */
function LineageAction(){}
LineageAction.prototype = new CognosViewerAction();

LineageAction.prototype.getCommonOptions = function(request)
{
	request.addFormField("cv.responseFormat", "asynchDetailMIMEAttachment");
	request.addFormField("bux", this.m_oCV.getViewerWidget() ? "true" : "false");
	request.addFormField("cv.id", this.m_oCV.envParams["cv.id"]);
};

LineageAction.prototype.getSelectionOptions = function(request)
{
	var selectionController = this.m_oCV.getSelectionController();
	var contextIds = getSelectionContextIds(selectionController);

	request.addFormField("context.format", "initializer");
	request.addFormField("context.type", "reportService");
	request.addFormField("context.selection", "metadata," + contextIds.toString());
};

LineageAction.prototype.getPrimaryRequestOptions = function(request)
{
	request.addFormField("specificationType", "metadataServiceLineageSpecification");
	request.addFormField("ui.action", "runLineageSpecification");
	request.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);
};

LineageAction.prototype.getSecondaryRequestOptions = function(request)
{
	request.addFormField("ui.conversation", this.m_oCV.getConversation());
	request.addFormField("m_tracking", this.m_oCV.getTracking());
	request.addFormField("ui.action", "lineage");
};

LineageAction.prototype.updateMenu = function(jsonSpec)
{
	if (!this.getCognosViewer().bCanUseLineage) {
		return "";
	}

	jsonSpec.disabled = !this.selectionHasContext();

	return jsonSpec;
};

/**
 * Execute the lineage request
 */
LineageAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();

	var request = new AsynchDataDispatcherEntry(oCV);

	this.getCommonOptions(request);
	this.getSelectionOptions(request);

	if(oCV.getConversation() == "")
	{
		this.getPrimaryRequestOptions(request);
	}
	else
	{
		this.getSecondaryRequestOptions(request);
	}

	request.setCallbacks({"complete":{"object":this, "method":this.handleLineageResponse}});

	if (!oCV.m_viewerFragment) {
		request.setRequestIndicator(oCV.getRequestIndicator());
		var workingDialog = new WorkingDialog(oCV);
		workingDialog.setSimpleWorkingDialogFlag(true);
		request.setWorkingDialog(workingDialog);
	}

	oCV.dispatchRequest(request);
};

LineageAction.prototype.handleLineageResponse = function(oResponse) {
	var oCV = this.getCognosViewer();
	oCV.loadExtra();

	// Need to up the asynch info in the Viewer object
	oCV.setStatus(oResponse.getAsynchStatus());
	oCV.setConversation(oResponse.getConversation());
	oCV.setTracking(oResponse.getTracking());

	var config = null;
	if(typeof MDSRV_CognosConfiguration != "undefined")
	{
		config = new MDSRV_CognosConfiguration();

		var lineageURI = "";
		if(this.m_oCV.envParams["metadataInformationURI"])
		{
			lineageURI = this.m_oCV.envParams["metadataInformationURI"];
		}

		config.addProperty("lineageURI", lineageURI);
		config.addProperty("gatewayURI", this.m_oCV.getGateway());
	}

	var searchPath = this.m_oCV.envParams["ui.object"];
	var sSelectionContext = getViewerSelectionContext(this.m_oCV.getSelectionController(), new CSelectionContext(searchPath));
	var lineageHelper = new MDSRV_LineageFragmentContext(config, sSelectionContext);
	lineageHelper.setExecutionParameters(this.m_oCV.getExecutionParameters());
	if (typeof searchPath == "string")
	{
		lineageHelper.setReportPath( searchPath );
	}
	lineageHelper.setReportLineage(oResponse.getResult());

	lineageHelper.open();
};
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


/**
 * Base class for interactive report actions
 */
function ModifyReportAction() {
	this.m_reuseConversation = true;
}
ModifyReportAction.prototype = new CognosViewerAction();

ModifyReportAction.prototype.addActionContextAdditionalParms = function() {};
ModifyReportAction.prototype.runReport = function() { return true; };
ModifyReportAction.prototype.updateRunReport = function() {};
ModifyReportAction.prototype.reuseQuery = function() { return false; };
ModifyReportAction.prototype.reuseGetParameter = function() {return true; };
ModifyReportAction.prototype.reuseConversation = function(reuseConversation) {
	if (typeof reuseConversation != "undefined") {
		this.m_reuseConversation = reuseConversation;
	}
	return this.m_reuseConversation;
};
ModifyReportAction.prototype.updateInfoBar = function() { return true; };
ModifyReportAction.prototype.getUndoHint = function() { return ""; };
ModifyReportAction.prototype.isUndoable = function() { return true; };
ModifyReportAction.prototype.saveSpecForUndo = function() { return false; };
ModifyReportAction.prototype.keepFocusOnWidget = function() { return true; };
ModifyReportAction.prototype.keepRAPCache = function() { return true; };
ModifyReportAction.prototype.getActionKey = function() { return null; };
ModifyReportAction.prototype.canBeQueued = function() { return false; };
ModifyReportAction.prototype.getPromptOption = function() { return "false"; };

ModifyReportAction.prototype.createActionDispatcherEntry = function()
{
	var actionDispatcherEntry = new ModifyReportDispatcherEntry(this.m_oCV);
	actionDispatcherEntry.initializeAction(this);
	return actionDispatcherEntry;
};

ModifyReportAction.prototype.isSelectSingleMember = function(selectedObject)
{
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
	var dataItems = selectedObject.getDataItems();
	if (oRAPReportInfo && dataItems.length > 0) {
		var containerId = this.getContainerId(this.m_oCV.getSelectionController());
		var itemInfo = oRAPReportInfo.getItemInfo(containerId, dataItems[0][0]);
		if (itemInfo.single =="true") {
			return true;
		}		
	}

	return false;
};


ModifyReportAction.prototype.execute = function() {
	var oCV = this.getCognosViewer();
	oCV.setKeepFocus(this.keepFocusOnWidget());
	this.updateRunReport();	
	if (this.runReport() == true) {
		var actionDispatcherEntry = this.createActionDispatcherEntry();
		this.addAdditionalOptions(actionDispatcherEntry);
		oCV.dispatchRequest(actionDispatcherEntry);
	}
	else {
		var cognosViewerRequest = this.createCognosViewerDispatcherEntry( "modifyReport" );	
		cognosViewerRequest.setCallbacks({"complete":{"object":this, "method":this.updateReportSpecCallback}});
		oCV.dispatchRequest(cognosViewerRequest);
	}	

	this.fireModifiedReportEvent();
};

ModifyReportAction.prototype.updateReportSpecCallback = function(oAsynchDataResposne) {
	var state = oAsynchDataResposne.getResponseState();
	var requestHanlder = new RequestHandler(this.m_oCV);
	requestHanlder.updateViewerState(state);

	// we'd sometimes add 2 items into the undo stack. One from the onclick and one from
	// the onblur. Make sure we only add one item to the undo stack
	if (!this.m_bUndoAdded)
	{
		this.m_bUndoAdded = true;
		var oUndoRedoQueue = this.getUndoRedoQueue();
		if(oUndoRedoQueue) {
			oUndoRedoQueue.initUndoObj({"tooltip" : this.getUndoHint(), "saveSpec" : true});
			oUndoRedoQueue.add({"reportUpdated": true});
		}
		var oWidget = this.getCognosViewer().getViewerWidget();
		if(oWidget) {
			oWidget.updateToolbar();
		}
	}
};

/**
 * Builds the action context needed for the modifyReport action
 */
ModifyReportAction.prototype.addActionContext = function() {

	var actionContext = "<reportActions";

	if(this.runReport() == false)
	{
		actionContext += " run=\"false\"";
	}

	actionContext += ">";

	actionContext += this.getReportActionContext();

	actionContext += "</reportActions>";

	return actionContext;
};


ModifyReportAction.prototype.getReportActionContext = function()
{
	var cognosViewer = this.getCognosViewer();
	var selectionController = cognosViewer.getSelectionController();
	
	var actionContext = "<" + this.m_sAction + ">";
	var containerId = this.getContainerId(selectionController);
	if(containerId != "")
	{
		actionContext += "<id>" + xml_encode(containerId) + "</id>";
	}
	
	actionContext += this.getRTStateInfo();

	actionContext += this.getSelectionContext();

	var sAdditionalParms = this.addActionContextAdditionalParms();
	if( sAdditionalParms != null && sAdditionalParms != "undefined")
	{
		actionContext += sAdditionalParms;
	}


	actionContext += "</" + this.m_sAction + ">";

	if(this.updateInfoBar())
	{
		actionContext += this.getGetInfoActionContext();
	}
	
	return actionContext;
};

ModifyReportAction.prototype.getGetInfoActionContext = function()
{
	return "<GetInfo/>";
};

/*Get widget run time information, such as dashboard object title, search path, etc*/
ModifyReportAction.prototype.getRTStateInfo = function()
{
	var oWidget = this.getCognosViewer().getViewerWidget();	
	if(oWidget && oWidget.getBUXRTStateInfoMap){		
		var oInfoMap = oWidget.getBUXRTStateInfoMap();
		return oInfoMap ? oInfoMap : "";
	}
	return "";
};

ModifyReportAction.prototype.createEmptyMenuItem = function()
{
	// Temporary UI String
	return { name: "None", label: "(empty)", iconClass: "", action: null, items: null };
};

ModifyReportAction.prototype.getStateFromResponse = function(oResponse)
{
	var oResponseState = null;
	if( oResponse && typeof oResponse != "undefined" && oResponse.responseText && typeof oResponse.responseText != "undefined" && oResponse.responseText.length > 0 )
	{
		var responseXML = XMLBuilderLoadXMLFromString(oResponse.responseText);
		var stateData = responseXML.getElementsByTagName("state");
		if (stateData != null && stateData.length > 0)
		{
			try {
				if (typeof stateData[0].text != "undefined")
				{
					oResponseState = eval("(" + stateData[0].text + ")");
				}
				else
				{
					oResponseState = eval("(" + stateData[0].textContent + ")");
				}
			}
			catch(e) {
				if (typeof console != "undefined" && console && console.log) {
					console.log(e);
				}
			}
		}
	}
	return oResponseState;
};


ModifyReportAction.prototype.getSelectedCellTags = function()
{
	var params = "";
	var selectionObjects = this.getCognosViewer().getSelectionController().getSelections();
	for (var i = 0; i < selectionObjects.length; ++i)
	{
		var cellRef = selectionObjects[i].getCellRef();
		var sDataItem = selectionObjects[i].getDataItems()[0];
		if (typeof sDataItem == "undefined" || sDataItem == null)
		{
			sDataItem = "";
		}
		var tag = this.getRAPLayoutTag(cellRef);
		if (tag != null)
		{
				params += "<tag><tagValue>" + xml_encode(tag)  + "</tagValue><dataItem>" + xml_encode(sDataItem) + "</dataItem></tag>";
		}
		else
		{
			params += "<tag><tagValue/><dataItem>" + xml_encode(sDataItem) + "</dataItem></tag>";
		}
	}
	if (params != "") {
		params = "<selectedCellTags>" + params + "</selectedCellTags>";
	}
	return params;

};

ModifyReportAction.prototype.getIsNumericFromReportInfo = function(refDataItem)
{
	var containerInfo = this.getSelectedReportInfo();
	if (containerInfo != null && typeof containerInfo.itemInfo!="undefined")
	{
		//This container has filters....does it filter this item?
		for (var item = 0; item < containerInfo.itemInfo.length; ++item)
		{
			if (refDataItem == containerInfo.itemInfo[item].item &&
				typeof containerInfo.itemInfo[item].numeric != "undefined") {
				return (containerInfo.itemInfo[item].numeric == "true");
			}
		}
	}
	return false;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
/**
 * CognosViewerCalculation constructor (base class for all calculation rules)
 * @constructor
 */
function CognosViewerCalculation() {
	this.m_oCV = null;
}

/**
 * Sets the cognos viewer object (called by the action factory
 * @param CCognosViewer object
 * @private
 */
CognosViewerCalculation.prototype.setCognosViewer = function(oCV) {
	this.m_oCV = oCV;
};

/**
 * Returns an instance to the cognos viewer object
 * @return CCognosViewer object
 */
CognosViewerCalculation.prototype.getCognosViewer = function() {
	return this.m_oCV;
};


/**
 * Most calculations require only 2 selected cells
 */
CognosViewerCalculation.prototype.validSelectionLength = function(selectionController) {
	try	{
		return selectionController.getAllSelectedObjects().length > 0;
	} catch (e) {
		return false;
	}
};

/**
 * Gets the display value to show in the calculation string. If the current selection is a column title, then
 * simply use the display from the selection, if not then find the defining cells display value
 */
CognosViewerCalculation.prototype.getDisplayValueFromSelection = function(selection) {
	var displayValue = "";
	if (!selection) {
		return displayValue;
	}

	if (selection.getLayoutType() == "columnTitle") {
		displayValue = selection.getDisplayValues()[0];
	} else if (selection.getLayoutType() == "datavalue") {
		// only time we'd be doing a calculation and wouldn't have columnTitles selected
		// is in a list, so get the column header
		var viewerAction = this.m_oCV.getAction("CognosViewer");
		var selectionController = this.m_oCV.getSelectionController();
		var containerId = viewerAction.getContainerId(selectionController);
		displayValue = selection.getDataItemDisplayValue(viewerAction.getReportInfo(containerId));
	}

	if (displayValue.indexOf("+") != -1 || displayValue.indexOf("-") != -1 || displayValue.indexOf("*") != -1 || displayValue.indexOf("/") != -1) {
		displayValue = "(" + displayValue + ")";
	}

	return displayValue;
};

/**
 * Need to override this method if your class uses the CognosViewerCalculation getMenuItemString method
 * +, -, *, /
 */
CognosViewerCalculation.prototype.getCalcSymbol = function() {};

/**
 * Generates the menu item string to be displayed in the context menu. Used for simply calculations like
 * +, -, *, /
 */
CognosViewerCalculation.prototype.getMenuItemString = function(menuEnabled) {
	var cognosViewer = this.getCognosViewer();
	var selectionController = cognosViewer.getSelectionController();
	var sMenuItemString = "";
	var selection, index;

	if (menuEnabled) {
		try {
			var selectionLength = selectionController.getAllSelectedObjects().length;
			if (selectionLength == 1) {
				selection = selectionController.getAllSelectedObjects()[0];
				if(this.m_bFlipSelection) {
					sMenuItemString = RV_RES.IDS_JS_CALCULATE_NUMBER + " " + this.getCalcSymbol() + " " + this.getDisplayValueFromSelection(selection);
				} else {
					sMenuItemString = this.getDisplayValueFromSelection(selection) + " " + this.getCalcSymbol() + " " + RV_RES.IDS_JS_CALCULATE_NUMBER;
				}
			} else {
				if (this.m_bFlipSelection) {
					selectionLength--;
					for (index=selectionLength; index >= 0; index--) {
						selection = selectionController.getAllSelectedObjects()[index];
						if (index != selectionLength) {
							sMenuItemString += " " + this.getCalcSymbol() + " ";
						}
						sMenuItemString += this.getDisplayValueFromSelection(selection);
					}
				}
				else {
					for (index=0; index < selectionLength; index++) {
						selection = selectionController.getAllSelectedObjects()[index];
						if (index > 0) {
							sMenuItemString += " " + this.getCalcSymbol() + " ";
						}
						sMenuItemString += this.getDisplayValueFromSelection(selection);
					}
				}
			}
		} catch (e) {
			sMenuItemString = this.getCalcSymbol();
		}
	} else {
		sMenuItemString = this.getCalcSymbol();
	}

	return sMenuItemString;
};



/**
 * Percent Difference Calculation
 */
function PercentDifferenceCalculation() {}
PercentDifferenceCalculation.prototype = new CognosViewerCalculation();

PercentDifferenceCalculation.prototype.validSelectionLength = function(selectionController) {
	try	{
		return selectionController.getAllSelectedObjects().length == 2;
	} catch (e) {
		return false;
	}
};



/**
 * Generates the menu item string to be displayed in the context menu
 */
PercentDifferenceCalculation.prototype.getMenuItemString = function(menuEnabled) {
	var selectionController = this.getCognosViewer().getSelectionController();
	var sMenuItemString = RV_RES.IDS_JS_CALCULATE_PERCENT_DIFFERENCE;

	if (menuEnabled) {
		try {
			var selectionLength = selectionController.getAllSelectedObjects().length;
			sMenuItemString += " (";
			for (var index=0; index < selectionLength; index++) {
				var selection = selectionController.getAllSelectedObjects()[index];
				if (index > 0) {
					sMenuItemString += ", ";
				}
				sMenuItemString += this.getDisplayValueFromSelection(selection);
			}
			sMenuItemString += ")";
		} catch (e) {}
	}

	return sMenuItemString;
};

/**
 * Percent Difference Calculation
 */
function PercentDifferenceCalculationSwapOrder()
{
	this.m_bFlipSelection = true;
}
PercentDifferenceCalculationSwapOrder.prototype = new PercentDifferenceCalculation();

/**
 * Generates the menu item string to be displayed in the context menu
 */
PercentDifferenceCalculationSwapOrder.prototype.getMenuItemString = function(menuEnabled) {
	var selectionController = this.getCognosViewer().getSelectionController();
	var sMenuItemString = RV_RES.IDS_JS_CALCULATE_PERCENT_DIFFERENCE;

	if (menuEnabled) {
		try {
			var selectionLength = selectionController.getAllSelectedObjects().length;
			sMenuItemString += " (";
			selectionLength--;
			for (var index=selectionLength; index >= 0; index--) {
				var selection = selectionController.getAllSelectedObjects()[index];
				if (index < selectionLength) {
					sMenuItemString += ", ";
				}
				sMenuItemString += this.getDisplayValueFromSelection(selection);
			}
			sMenuItemString += ")";
		} catch (e) {}
	}

	return sMenuItemString;
};

/**
 * Addition calculation
 */
function AdditionCalculation() {}
AdditionCalculation.prototype = new CognosViewerCalculation();

AdditionCalculation.prototype.getCalcSymbol = function() {
	return "+";
};

/**
 * Subtraction calculation
 */
function SubtractionCalculation() {}
SubtractionCalculation.prototype = new CognosViewerCalculation();

SubtractionCalculation.prototype.getCalcSymbol = function() {
	return "-";
};

/**
 * Override the validSelectionLength method since additions allows from 1 to 2 selections
 */
SubtractionCalculation.prototype.validSelectionLength = function(selectionController) {
	try	{
		var selLength = selectionController.getAllSelectedObjects().length;
		return selLength > 0 && selLength < 3;
	} catch (e) {
		return false;
	}
};

/**
 * Subtraction calculation when we flip the selection order
 */
function SubtractionCalculationSwapOrder()
{
	this.m_bFlipSelection = true;
}
SubtractionCalculationSwapOrder.prototype = new SubtractionCalculation();

/**
 * Multiplication calculation
 */
function MultiplicationCalculation() {}
MultiplicationCalculation.prototype = new CognosViewerCalculation();

MultiplicationCalculation.prototype.getCalcSymbol = function() {
	return "*";
};

/**
 * Division Calculation
 */
function DivisionCalculation() {}
DivisionCalculation.prototype = new CognosViewerCalculation();

DivisionCalculation.prototype.getCalcSymbol = function() {
	return "/";
};

DivisionCalculation.prototype.validSelectionLength = function(selectionController) {
	try	{
		var selectionLength = selectionController.getAllSelectedObjects().length;
		return  (selectionLength > 0 && selectionLength < 3);
	} catch (e) {
		return false;
	}
};


/**
 * Division Calculation when we swap the order of selection
 */
function DivisionCalculationSwapOrder()
{
	this.m_bFlipSelection = true;
}
DivisionCalculationSwapOrder.prototype = new DivisionCalculation();


/**
 * Calculation Actions (Addition, Subtraction, Multiplication, Division, PercentDifference etc.)
 */
function CalculationAction()
{
	this.m_payload = "";
	this.m_menuBuilderClass = null;
	this.m_defaultName = "";
	this.m_constant = null;
}

CalculationAction.prototype = new ModifyReportAction();

CalculationAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_CALCULATION;
};

CalculationAction.prototype.keepRAPCache = function()
{
	return false;
};


/**
 * Specific rules for lists:
 * 1. No two selections can be on the same column.
 * 2. Selections have calculation Metadata
 * @return true if the current selections are valid for calculations
 */
CalculationAction.prototype.listRules = function() {

	var selectionController = this.getCognosViewer().getSelectionController();
	var aSelectionObjects = selectionController.getSelections();
	if (aSelectionObjects.length > 1)
	{
		var tmp = {};
		for (var i = 0; i < aSelectionObjects.length; ++i)
		{
			var columnRef = aSelectionObjects[i].getColumnRef();
			if (typeof tmp[columnRef] == "undefined")
			{
				tmp[columnRef] = 1;
			}
			else
			{
				return false; //duplicate found
			}
		}
	}
	return selectionController.selectionsHaveCalculationMetadata();
};

/**
 * Specific rules for crosstabs
 * @return true if the current selections are valid for calculations
 */
CalculationAction.prototype.crosstabRules = function() {
	var selectionController = this.getCognosViewer().getSelectionController();

	if (!selectionController.areSelectionsColumnRowTitles()) {
		return false;
	}

	if (selectionController.isRelational()) {
		if (!this.relationalCrosstabRules(selectionController)) {
			return false;
		}
	} else {
		if (!this.olapCrosstabRules(selectionController)) {
			return false;
		}
	}

	return true;
};

/**
 * Specific rules for relational data
 * @return true is the selections meet all the relational crosstab specific rules for allowing calculations
 */
CalculationAction.prototype.relationalCrosstabRules = function(selectionController) {
	return selectionController.selectionsHaveCalculationMetadata();
};

/**
 * Specific rules for OLAP data
 * @return true if the selections meet all the olap specific crosstab rules for allowing calculations
 */

CalculationAction.prototype.olapCrosstabRules = function(selectionController) {

	if (! selectionController.selectionsHaveCalculationMetadata())
	{
		return false;
	}
	if (!this.sameDimension(selectionController))
	{
		// Allow calculations between measures of different measure dimensions
		// Only allow members calcs if all measures
		return (typeof this.m_oCV.aQoSFunctions != "undefined") && this.m_oCV.aQoSFunctions.toString().indexOf('MULTIPLE_MEASURE_DIMENSION_CALCULATIONS') != -1 && selectionController.selectionsAreMeasures();
	}
	else
	{
	   if (this.sameHierarchy(selectionController))
	   {
		   return true;
	   }
	   else
	   {
		   return (typeof this.m_oCV.aQoSFunctions != "undefined") && this.m_oCV.aQoSFunctions.toString().indexOf('VALUE_EXPRESSIONS_REF_MULTIPLE_HIERARCHIES_OF_SAME_DIMENSION') != -1;
	   }
	}
};
/**
 * Checks to see if the selected cells are from the same hierarchy
 * @return true if the selections are from the same hierarchy, false otherwise
 */

CalculationAction.prototype.sameDimension = function(selectionController) {
	try {
		var dim = "";
		var selLength = selectionController.getAllSelectedObjects().length;
		for (var selIndex = 0; selIndex < selLength; selIndex++) {
			if (dim.length == 0) {
				dim = selectionController.getAllSelectedObjects()[selIndex].getDimensionalItems('dun')[0][0];
			} else if (dim != selectionController.getAllSelectedObjects()[selIndex].getDimensionalItems('dun')[0][0]){
				return false;
			}
		}
		return true;
	}catch (e) {
		return false;
	}
};

CalculationAction.prototype.sameHierarchy = function(selectionController) {
	try {
		var dim = "";
		var selLength = selectionController.getAllSelectedObjects().length;
		for (var selIndex = 0; selIndex < selLength; selIndex++) {
			if (dim.length == 0) {
				dim = selectionController.getAllSelectedObjects()[selIndex].getDimensionalItems('hun')[0][0];
			} else if (dim != selectionController.getAllSelectedObjects()[selIndex].getDimensionalItems('hun')[0][0]){
				return false;
			}
		}
		return true;
	}catch (e) {
		return false;
	}
};

/**
 * For calculations, pass the calculation string to the RAP for generating calculation column name.
 */
CalculationAction.prototype.addActionContextAdditionalParms = function()
{
	var additionalContextParms = "";

	if(this.m_constant != null)
	{
		additionalContextParms += "<constant>" + xml_encode(this.m_constant) + "</constant>";

		if(this.m_swapSelectionOrder)
		{
			additionalContextParms += "<constantFirst/>";
		}
	}

	if(this.m_defaultName != "")
	{
		additionalContextParms += "<columnName>" + xml_encode(this.m_defaultName) + "</columnName>";
	}

	return additionalContextParms;
};

CalculationAction.prototype.setRequestParms = function(parms)
{
	if(parms != null)
	{
		if(typeof parms.constant != null)
		{
			this.m_constant = parms.constant;
		}
	}
};

CalculationAction.prototype.buildDefaultName = function()
{
	try {
		var calc = this.getCognosViewer().getCalculation(this.m_menuBuilderClass);
		this.m_defaultName = calc.getMenuItemString(true);

		if(this.m_constant != null)
		{
			var numberLabel = "" + this.m_constant;
			var separator = this.getCognosViewer().envParams['contentDecimalSeparator'];
			if (typeof separator != "undefined" && separator != null && separator != ".")
			{
				numberLabel = numberLabel.replace(".", separator);
			}
			this.m_defaultName = this.m_defaultName.replace(RV_RES.IDS_JS_CALCULATE_NUMBER, numberLabel);
		}
	} catch (e) {
		this.m_defaultName = "";
	}
};

CalculationAction.prototype.preProcess = function()
{
	var selectionCount = this.getNumberOfSelections();

	this.buildDefaultName();

	if(this.m_swapSelectionOrder && selectionCount == 2)
	{
		var selectionController = this.getCognosViewer().getSelectionController();

		var sel1 = selectionController.getAllSelectedObjects()[0];
		var sel2 = selectionController.getAllSelectedObjects()[1];

		selectionController.m_aSelectedObjects = [sel2, sel1];
	}
};

CalculationAction.prototype.isFactCellOnCrosstabOrEmpty = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if (selectedObjects != null && typeof selectedObjects != "undefined")	{
		if (selectedObjects.length == 0) {
			return true;
		} else {
			var selectedObject = selectedObjects[0];
			//If the select object should be disabled when the user selects a fact cell(s).
			if (selectionController.getDataContainerType() == "crosstab" && selectedObject.getLayoutType() == 'datavalue')
			{
				return true;
			}
		}
	}
	return false;
};

CalculationAction.prototype.isSummaryOrAggregateCell = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();
	if (selectedObjects != null && typeof selectedObjects != "undefined")	{
		var cellRef;
		var reCrosstabLevel = /\b(ol|il)\b/;
		for (var i = 0; i < selectedObjects.length; i++)
		{
			cellRef = selectedObjects[i].getCellRef();
			if (cellRef != null && typeof cellRef != "undefined")	{
				if (selectedObjects[i].getLayoutType() == "summary" || (cellRef != null && reCrosstabLevel.test(cellRef.className)))
				{
					return true;
				}
			}
			cellRef =null;
		}
	}
	return false;
};

CalculationAction.prototype.isLastSelectionSingleDimensionNested = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();
	if (selectedObjects != null && typeof selectedObjects != "undefined" && selectedObjects.length)	{
		var lastSelection = selectedObjects[selectedObjects.length - 1];
		var dimItemsAxis0 = lastSelection.getDimensionalItems('dun')[0];
		//If dimension of this item is same as any of its parents, its SD nested.
		if (dimItemsAxis0 && dimItemsAxis0.length && dimItemsAxis0[0]) {
			for(var parent=1; parent<dimItemsAxis0.length; ++parent) {
				if (dimItemsAxis0[parent]===dimItemsAxis0[0]) {
					return true;
				}
			}
		}
	}
	return false;
};

/**
 * Checks to see if all types of calculation are possible. This function
 * checks general conditions of selections that apply to all types of calculation.
 */
CalculationAction.prototype.areCalculationsPossible = function()
{
	var selectionController = this.getCognosViewer().getSelectionController();

	if(this.isFactCellOnCrosstabOrEmpty())
	{
		return false;
	}

	if(this.isSelectionOnChart())
	{
		return false;
	}

	if(this.isSummaryOrAggregateCell())
	{
		return false;
	}

	if (!selectionController.selectionsInSameDataContainer())
	{
		return false;
	}

	// different rules for lists and crosstabs
	if (selectionController.getDataContainerType() == "list")
	{
		return this.listRules(selectionController);
	}
	else if (selectionController.getDataContainerType() == "crosstab" && ! this.isLastSelectionSingleDimensionNested())
	{
		return this.crosstabRules(selectionController);
	}

	return false;
};

CalculationAction.prototype.updateMenu = function(toolbarItem,updateMenucallback)
{
	toolbarItem.visible = this.ifContainsInteractiveDataContainer();
	if (! toolbarItem.visible)
	{
		return toolbarItem;
	}

	if (! this.areCalculationsPossible())
	{
		return this.toggleMenu(toolbarItem, false);
	}

	this.toggleMenu(toolbarItem, true);

	if(this.m_oCV.aQoSFunctions) {
		toolbarItem = this.buildCalculationMenuItemsAgainstSelection(toolbarItem);
	} else {
		toolbarItem = this.buildDynamicMenuItem(toolbarItem, "Calculation");
	}

	return toolbarItem;
};

CalculationAction.prototype.toggleMenu = function(toolbarItem, enabled)
{
	if (enabled)
	{
		toolbarItem.iconClass = "calculate";
		toolbarItem.disabled = false;
	}
	else
	{
		toolbarItem.iconClass = "calculateDisabled";
		toolbarItem.disabled = true;
	}
	return toolbarItem;
};

CalculationAction.prototype.buildMenu = function(toolbarItem, buildMenuCallback)
{
	toolbarItem.visible = this.ifContainsInteractiveDataContainer();
	if (! toolbarItem.visible)
	{
		return toolbarItem;
	}

	if (! this.areCalculationsPossible())
	{
		return this.toggleMenu(toolbarItem, false);
	}

	this.toggleMenu(toolbarItem, true);

	// check to see if we have the QoS properies, if not, go fetch them
	var viewerObject = this.getCognosViewer();

	if(typeof viewerObject.aQoSFunctions == "undefined")
	{
		// bux context menu's don't support asynch callback yet, once the fix is in to support it, we have to do this request synchrounously.
		this.fetchQoS(toolbarItem, buildMenuCallback, (typeof buildMenuCallback == "undefined") ? false : true);
	}

	if (typeof viewerObject.aQoSFunctions != "undefined")
	{
		return this.buildCalculationMenuItemsAgainstSelection(toolbarItem);
	}
};

CalculationAction.prototype.fetchQoS = function(toolbarItem, buildMenuCallback, asynch) {
	var callbacks = {
		customArguments: [toolbarItem, buildMenuCallback],
		"complete": {"object": this, "method": this.handleQoSResponse}
	};

	var asynchRequest = new AsynchJSONDispatcherEntry(this.m_oCV);
	asynchRequest.setCallbacks(callbacks);

	asynchRequest.addFormField("ui.action", "getQualityOfService");
	asynchRequest.addFormField("parameterValues", this.m_oCV.getExecutionParameters());
	asynchRequest.addFormField("bux", "true");

	asynchRequest.addNonEmptyStringFormField("modelPath", this.m_oCV.getModelPath());
	asynchRequest.addDefinedFormField("metaDataModelModificationTime", this.m_oCV.envParams["metaDataModelModificationTime"]);

	if (!asynch) {
		asynchRequest.forceSynchronous();
	}

	this.m_oCV.dispatchRequest(asynchRequest);
};

CalculationAction.prototype.handleQoSResponse = function(asynchJSONResponse, toolbarItem, buildMenuCallback)
{
	this.m_oCV.aQoSFunctions = asynchJSONResponse.getResult();
	this.buildCalculationMenuItemsAgainstSelection(toolbarItem, buildMenuCallback);
	if (typeof buildMenuCallback == "function") {
		buildMenuCallback();
	}
};

CalculationAction.prototype.buildCalculationMenuItemsAgainstSelection = function(toolbarItem, buildMenuCallback)
{
	var aCalculations = this.m_oCV.aBuxCalculations;
	var calcItems = [];

	for (var calcIndex=0; calcIndex < aCalculations.length; calcIndex++)
	{
		var calc = this.m_oCV.getCalculation(aCalculations[calcIndex]);

		// There might be some cases (GetQualityOfServer request is generated and async is forced) where this.m_oCV.aQoSFunctions is null because asynchJSONResponse.getResult() returns null (see COGCQ00261753).
		// This is a highly unlikly situation and the below condition is a safty net, just in case something goes really bad.
		// So, if this is the case we do not alow any calculations.
		if (this.m_oCV.aQoSFunctions == null || typeof this.m_oCV.aQoSFunctions == "undefined")
		{
			toolbarItem.disabled = true;
			toolbarItem.iconClass = "calculate";
			toolbarItem.items = null;
			return toolbarItem;
		}

		if (calc && calc.validSelectionLength(this.getCognosViewer().getSelectionController()) && this.m_oCV.aQoSFunctions.toString().indexOf(aCalculations[calcIndex]) != -1)
		{
			var newCalcItem = {};
			newCalcItem.name = aCalculations[calcIndex];
			newCalcItem.label = calc.getMenuItemString(true);
			newCalcItem.action = {};

			var sIconClass = "";
			if (aCalculations[calcIndex].indexOf("SwapOrder") != -1)
			{
				sIconClass = aCalculations[calcIndex].substring(0, aCalculations[calcIndex].indexOf("SwapOrder"));
			}
			else
			{
				sIconClass = aCalculations[calcIndex];
			}
			newCalcItem.iconClass = sIconClass;

			if(this.getNumberOfSelections() == 1)
			{
				newCalcItem.action.name = "ConstantOperandCalculation";
				newCalcItem.action.payload = aCalculations[calcIndex];

			}
			else
			{
				newCalcItem.action.name = aCalculations[calcIndex];
				newCalcItem.action.payload = "";
			}

			if(newCalcItem.action.name == "PercentDifferenceCalculation")
			{
				calcItems.push({separator: true});
			}

			newCalcItem.items = null;
			calcItems.push(newCalcItem);
		}
	}

	if(calcItems.length == 0)
	{
		this.toggleMenu(toolbarItem, false);
		calcItems.push({name: "None", label: RV_RES.IDS_JS_CALCULATION_SELECT_DATA, iconClass: "", action: null, items: null });
	} else {
		this.toggleMenu(toolbarItem, true);
	}
	toolbarItem.items = calcItems;

	return toolbarItem;
};


/**
 * Percent Difference calculation
 */
function PercentDifferenceCalculationAction(){
	this.m_sAction = "PercentDifference";
	this.m_menuBuilderClass = "PercentDifferenceCalculation";
}
PercentDifferenceCalculationAction.prototype = new CalculationAction();

/**
 * Percent Different with reversed order of selection
 */
function PercentDifferenceCalculationSwapOrderAction() {
	this.m_sAction = "PercentDifference";
	this.m_menuBuilderClass = "PercentDifferenceCalculationSwapOrder";
	this.m_swapSelectionOrder = true;
}
PercentDifferenceCalculationSwapOrderAction.prototype = new CalculationAction();

/**
 * Addition calculation
 */
function AdditionCalculationAction(){
	this.m_sAction = "Addition";
	this.m_menuBuilderClass = "AdditionCalculation";
}
AdditionCalculationAction.prototype = new CalculationAction();

/**
 * Subtraction calculation
 */
function SubtractionCalculationAction(){
	this.m_sAction = "Subtraction";
	this.m_menuBuilderClass = "SubtractionCalculation";
}
SubtractionCalculationAction.prototype = new CalculationAction();


/**
 * Subtraction calculation with reversed selection (i.e. A-B vs B-A)
 */
function SubtractionCalculationSwapOrderAction() {
	this.m_sAction = "Subtraction";
	this.m_menuBuilderClass = "SubtractionCalculationSwapOrder";

	this.m_swapSelectionOrder = true;
}
SubtractionCalculationSwapOrderAction.prototype = new CalculationAction();

/**
 * Multiplication calculation
 */
function MultiplicationCalculationAction(){
	this.m_sAction = "Multiplication";
	this.m_menuBuilderClass = "MultiplicationCalculation";
}
MultiplicationCalculationAction.prototype = new CalculationAction();

/**
 * Division calculation
 */
function DivisionCalculationAction(){
	this.m_sAction = "Division";
	this.m_menuBuilderClass = "DivisionCalculation";
}
DivisionCalculationAction.prototype = new CalculationAction();

/**
 * Division calculation with reversed selection (i.e. A / B vs. B / A)
 * @return
 */
function DivisionCalculationSwapOrderAction() {
	this.m_sAction = "Division";
	this.m_menuBuilderClass = "DivisionCalculationSwapOrder";
	this.m_swapSelectionOrder = true;
}
DivisionCalculationSwapOrderAction.prototype = new CalculationAction();

function ConstantOperandCalculationAction()
{
	this.m_action = null;
}

ConstantOperandCalculationAction.prototype = new CognosViewerAction();

ConstantOperandCalculationAction.prototype.setRequestParms = function(payload)
{
	this.m_action = payload;
};

ConstantOperandCalculationAction.prototype.execute = function()
{
	var cognosViewerObjectString = getCognosViewerObjectString(this.m_oCV.getId());
	var action = this.m_action;
	var calculation = this.m_oCV.getCalculation(action);
	var menuItemString = calculation.getMenuItemString(true);
	var dialogTitle = RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER_TITLE;
	var dialogDescription = RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER_DESCRIPTION;
	dialogDescription = dialogDescription.substring(0, dialogDescription.indexOf("{0}")) + menuItemString + dialogDescription.substring(dialogDescription.indexOf("{0}") + 3);
	var enterNumberLabel = RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER;
    var contentLocale = this.m_oCV.envParams["contentLocale"];
	
	var calculationDialog = new viewer.dialogs.CalculationDialog({
		sTitle:dialogTitle,
		sLabel:enterNumberLabel,
		sDescription:dialogDescription,
		sContentLocale : contentLocale,
		okHandler: function(value)
		{
			window[cognosViewerObjectString].executeAction(action, {constant:value});
		},
		cancelHandler: function() {}
	});
	calculationDialog.startup();
	window.setTimeout(function () { calculationDialog.show(); },0);
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function FilterAction() {
	this.m_sAction = "Filter";
	this.m_sType = "";
	this.m_sItem = "";
	this.m_sFormattedNumber= "";
	this.m_sFormattedEndNumber= "";
	this.m_jsonDetails = "";
}


FilterAction.prototype = new ModifyReportAction();

FilterAction.prototype.execute = function()
{
	ModifyReportAction.prototype.execute.apply(this, arguments)
	if (this.m_sType.indexOf("remove") != -1) {
		this.getCognosViewer().getViewerWidget().clearRAPCache();
	}
};

FilterAction.prototype.genSelectionContextWithUniqueCTXIDs = function() { return true; };

FilterAction.prototype.getUndoHint = function()
{
	if (this.m_sType.indexOf("remove") != -1) {
		return RV_RES.IDS_JS_REMOVE_FILTER;
	} else {
		return RV_RES.IDS_JS_FILTER;
	}
};

FilterAction.prototype.setRequestParms = function( parms )
{
	if (parms.type!=null && typeof parms.type != "undefined") {
		this.m_sType = parms.type;
		if (parms.id!=null && typeof parms.id != "undefined") {
			this.m_sId   = parms.id;
		}
		if (parms.item!=null && typeof parms.item != "undefined") {
			this.m_sItem = parms.item;
		}
		if (parms.details) {
			this.m_jsonDetails = parms.details;
		}
		if (parms.formattedNumber!=null && typeof parms.formattedNumber != "undefined") {
			this.m_sFormattedNumber = parms.formattedNumber;
		}
		if (parms.formattedEndNumber!=null && typeof parms.formattedEndNumber != "undefined") {
			this.m_sFormattedEndNumber = parms.formattedEndNumber;
		}
	} else {
		this.m_sType = parms;
	}
};

FilterAction.prototype.addActionContextAdditionalParms = function()
{
	var parms = "<type>" + this.m_sType + "</type>";
	if (this.m_sId != null && typeof this.m_sId != "undefined") {
		parms+= ("<id>" + xml_encode(this.m_sId) + "</id>");
	}
	if (this.m_sItem != null && typeof this.m_sItem != "undefined" && this.m_sItem!="") {
		parms+= ("<item>" + xml_encode(this.m_sItem) + "</item>");
	}
	if (this.m_jsonDetails && this.m_jsonDetails!="")
	{
		parms+= "<details>" + xml_encode(this.m_jsonDetails) + "</details>";
	}
	if (this.m_sFormattedNumber != null && typeof this.m_sFormattedNumber != "undefined" && this.m_sFormattedNumber!="") {
		parms+= ("<formattedNumber>" + this.m_sFormattedNumber + "</formattedNumber>");
	}
	if (this.m_sFormattedEndNumber != null && typeof this.m_sFormattedEndNumber != "undefined" && this.m_sFormattedEndNumber!="") {
		parms+= ("<formattedEndNumber>" + this.m_sFormattedEndNumber + "</formattedEndNumber>");
	}
	return parms;
};

FilterAction.prototype.buildSelectedItemsString = function(selectedObjects)
{
	var itemsLabel = "";
	var numberOfSelectedItems = selectedObjects.length;
	var numberOfItemsToAdd = numberOfSelectedItems > 5 ? 5 : numberOfSelectedItems;

	for(var index = 0; index < numberOfSelectedItems; ++index)
	{
		var value = this.getItemLabel(selectedObjects[index]);

		if (typeof value == "undefined" || value == "")
		{
			 //a selectedObject has neither displayValue nor useValue.
			return "";
		}
		if((index) < numberOfItemsToAdd)
		{
			itemsLabel += value;
		}
		if((index+1) < numberOfItemsToAdd)
		{
			itemsLabel += ", ";
		}
	}

	if(numberOfSelectedItems > 5)
	{
		itemsLabel += ", ++";
	}

	return itemsLabel;
};

FilterAction.prototype.getItemLabel = function (selectedObject)
{
	var value = selectedObject.getDisplayValues()[0];
	if (typeof value == "undefined")
	{
		value = selectedObject.getUseValues()[0][0];
	}
	return value;
};

FilterAction.prototype.toggleMenu = function(jsonSpec, enabled)
{
	if (enabled)
	{
		jsonSpec.iconClass = "filter";
		jsonSpec.disabled = false;
	}
	else
	{	jsonSpec.iconClass = "filterDisabled";
		jsonSpec.disabled = true;
	}
	return jsonSpec;
};

FilterAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = (this.ifContainsInteractiveDataContainer() && !this.detailFilteringIsDisabled());
	var result = jsonSpec;
	if (jsonSpec.visible) {
		var canAddOrRemoveFilters=(this.m_oCV.getSelectionController().getAllSelectedObjects().length > 0 
									|| this.isSelectionFilterable() || this.isRemoveAllValid()); 
		if (!canAddOrRemoveFilters) {
			result = this.toggleMenu(jsonSpec, false);
		}
		else {
			this.buildMenu(jsonSpec);
			if (jsonSpec.disabled == true) {
				result = this.toggleMenu(jsonSpec, false);
			}
			else {
				result = this.buildDynamicMenuItem(jsonSpec, "Filter");
			}
		}
	}
	return result;
};

FilterAction.prototype.detailFilteringIsDisabled = function()
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	if (oRAPReportInfo) {
		return oRAPReportInfo.isDetailFilteringDisabled();
	}

	return false;
};

FilterAction.prototype.buildMenu = function(jsonSpec)
{

	jsonSpec.visible = (this.ifContainsInteractiveDataContainer() &&
						!this.detailFilteringIsDisabled());
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	var selectionIsFilterable=this.isSelectionFilterable();
	this.toggleMenu(jsonSpec, selectionIsFilterable);

	var filterItems = [];
	var filterValueActionsAdded = false;
	var renderedRemoveSeparator = false;

	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if(selectedObjects.length > 0 && selectionController.selectionsInSameDataContainer() && selectionController.selectionsFromSameDataItem())
	{
		var refDataItem = selectedObjects[0].getDataItems()[0][0];
		if (selectionIsFilterable) {
			filterValueActionsAdded = this.addFilterValueActionsToMenu(selectionController, filterItems, refDataItem);
		}

		if (this.isRemoveItemFilterValid(refDataItem)) {
			if (filterValueActionsAdded == true) {
				filterItems.push({separator: true});
				renderedRemoveSeparator=true;
			}

			var label = this.getRefDataItemLabel(refDataItem);
			filterItems.push({ name: "RemoveFilterFor", label: RV_RES.IDS_JS_REMOVE_FILTER_FOR + " " + enforceTextDir(label), iconClass: "", action: { name: "Filter", payload: "remove" }, items: null });
		}
	}

	if (this.isRemoveAllValid()==true) {
		if (filterValueActionsAdded && !renderedRemoveSeparator) {
			filterItems.push({separator: true});
		}
		filterItems.push({ name: "RemoveAllFiltersForWidget", label: RV_RES.IDS_JS_REMOVE_ALL_FILTERS_FOR_WIDGET, iconClass: "", action: { name: "Filter", payload: "removeAllForWidget" }, items: null });
	}

	if(filterItems.length == 0)
	{
		return this.toggleMenu(jsonSpec, false);

	} else	{
		jsonSpec.items = filterItems;
		this.toggleMenu(jsonSpec, true);
		return jsonSpec;
	}

};

FilterAction.prototype.getRefDataItemLabel = function(refDataItem)
{
	var label = refDataItem;
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
	if (oRAPReportInfo) {
		var oFilter = oRAPReportInfo.getFilterObject(refDataItem, true);
		if (oFilter) {
			label = oFilter.itemLabel;
		}
	}

	return label;
};

FilterAction.prototype.addFilterValueActionsToMenu = function(selectionController, filterItems, refDataItem)
{
	var selectedObjects = selectionController.getAllSelectedObjectsWithUniqueCTXIDs();


	// Don't add the filter actions if the data container is a list and the list
	// column header is selected
	var numberOfSelectedValues = selectedObjects.length;
	var sel = 0;
	if (selectedObjects[0].m_dataContainerType=='list') {
		for (sel=0; sel<selectedObjects.length; ++sel) {
			if (selectedObjects[sel].m_sLayoutType == 'columnTitle') {
				numberOfSelectedValues=0;
				break;
			}
		}
	}

	if (numberOfSelectedValues == 0)
	{
		return false;
	}
	var itemsLabel = this.buildSelectedItemsString(selectedObjects);
	if (itemsLabel == "")
	{
		if (numberOfSelectedValues == 1 && selectedObjects[0].getLayoutType() == "datavalue")
		{
			itemsLabel = RV_RES.IDS_JS_NULL;
			filterItems.push({ name: "InFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_INCLUDE, itemsLabel), iconClass: "", action: { name: "Filter", payload: "in" }, items: null });
			filterItems.push({ name: "NotInFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_EXCLUDE, itemsLabel), iconClass: "", action: { name: "Filter", payload: "not" }, items: null });
		}
	}
	else {
		if (selectionController.selectionsAreDateTime() || 
			(selectionController.selectionsHaveCalculationMetadata() && !selectionController.selectionsNonMeasureWithMUN() )) {
			// Don't present numeric filtering options if column titles are
			// selected
			for (sel=0; sel<numberOfSelectedValues; ++sel) {
				if (selectedObjects[sel].m_sLayoutType == 'columnTitle') {
					return false;
				}
			}
			if(numberOfSelectedValues == 1)
			{
				if (selectedObjects[0].getUseValues()[0][0]) {
					filterItems.push({ name: "LessFilter", label: RV_RES.IDS_JS_FILTER_LESS_THAN + " " + itemsLabel, iconClass: "", action: { name: "Filter", payload: { type:"lessThan", formattedNumber: itemsLabel }}, items: null });
					filterItems.push({ name: "LessEqualFilter", label: RV_RES.IDS_JS_FILTER_LESS_THAN_EQUAL + " " + itemsLabel, iconClass: "", action: { name: "Filter", payload: { type:"lessThanEqual", formattedNumber: itemsLabel }}, items: null });
					filterItems.push({ name: "GreaterEqualFilter", label: RV_RES.IDS_JS_FILTER_GREATER_THAN_EQUAL + " " + itemsLabel, iconClass: "", action: { name: "Filter", payload: { type:"greaterThanEqual", formattedNumber: itemsLabel }}, items: null });
					filterItems.push({ name: "GreaterFilter", label: RV_RES.IDS_JS_FILTER_GREATER_THAN + " " + itemsLabel, iconClass: "", action: { name: "Filter", payload: { type:"greaterThan", formattedNumber: itemsLabel }}, items: null });
				}
			}
			else if(numberOfSelectedValues == 2)
			{
				if (selectedObjects[0].getUseValues()[0][0] && selectedObjects[1].getUseValues()[0][0]) {
					var formattedNumber = this.getItemLabel(selectedObjects[0]);
					var formattedEndNumber = this.getItemLabel(selectedObjects[1]);
					filterItems.push({ name: "BetweenFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_BETWEEN, [formattedNumber, formattedEndNumber]), iconClass: "", action: { name: "Filter", payload: {type: "between", formattedNumber: formattedNumber, formattedEndNumber: formattedEndNumber}}, items: null });
					filterItems.push({ name: "NotBetweenFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_NOT_BETWEEN, [formattedNumber, formattedEndNumber]), iconClass: "", action: { name: "Filter", payload: {type: "notBetween", formattedNumber: formattedNumber, formattedEndNumber: formattedEndNumber }}, items: null });
				}
			}
			else
			{
				return false;
			}
		}
		else
		{
			var containerType = selectionController.getDataContainerType();
			if (containerType == "crosstab" && selectedObjects[0].getLayoutType() == 'columnTitle')	{
				if (this.isSelectSingleMember(selectedObjects[0])==true)	{
					return false;
				}
			}
			filterItems.push({ name: "InFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_INCLUDE, enforceTextDir(itemsLabel)), iconClass: "", action: { name: "Filter", payload: "in" }, items: null });
			filterItems.push({ name: "NotInFilter", label: CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_EXCLUDE, enforceTextDir(itemsLabel)), iconClass: "", action: { name: "Filter", payload: "not" }, items: null });
		}
	}

	return true;
};

FilterAction.prototype.isRemoveAllValid = function()
{
	// If the reportInfo has any filters for any container, remove all is valid.
	var reportInfo = this.m_oCV.getRAPReportInfo();
	if(reportInfo) {
		return reportInfo.containsFilters();
	}
	return false;
};

FilterAction.prototype.isRemoveItemFilterValid = function(refDataItem)
{
	var containerId = this.getContainerId(this.m_oCV.getSelectionController());
	var reportInfo = this.m_oCV.getRAPReportInfo();
	if(containerId != null && reportInfo)
	{
		var oFilter = reportInfo.getFilterObjectFromContainer(containerId, refDataItem, false);
		return oFilter ? true : false;
	}
	return false;
};

FilterAction.prototype.isSelectionFilterable = function() {
	var selectionController = this.m_oCV.getSelectionController();

	var selectedObjects = selectionController.getAllSelectedObjects();
	if (selectedObjects.length > 0) {
		var cellRef = selectedObjects[0].getCellRef();
		if (cellRef && cellRef.getAttribute && cellRef.getAttribute("no_data_item_column") === "true") {
			return false;
		}
		
		if (selectionController.hasSelectedChartNodes()) {
			//CHARTS: Selections are not filterable if:
			//		1) Any title is selected (eg legendTitle, numericAxisTitle, ordinalAxisTitle)
			//		2) A calc/measure that is on an edge is selected (eg. legendLabel, ordinalAxisLabel)
			var measureOrCalculationType=false;
			if (selectionController.selectionsAreDateTime() || 
				(selectionController.selectionsHaveCalculationMetadata() && !selectionController.selectionsNonMeasureWithMUN() )) {
				measureOrCalculationType=true;
			}
			for (var sel=0; sel<selectedObjects.length; ++sel) {
				if (selectedObjects[sel].getLayoutType()) {
					if (selectedObjects[sel].getLayoutType().match('Title$')=='Title') {
						return false;
					}
					if (measureOrCalculationType && selectedObjects[sel].getLayoutType().match('Label$')=='Label') {
						return false;
					}
				}
			}
		}
	}
	return true;
};


function GetFilterInfoAction()
{
	this.m_requestParms = null;
}

GetFilterInfoAction.prototype = new ModifyReportAction();

GetFilterInfoAction.prototype.isUndoable = function()
{
	return false;
};

GetFilterInfoAction.prototype.canBeQueued = function() 
{
	return true;
};

GetFilterInfoAction.prototype.setRequestParms = function( parms )
{
	this.m_requestParms = parms;
};

GetFilterInfoAction.prototype.runReport = function()
{
	return false;
};

GetFilterInfoAction.prototype.updateInfoBar = function()
{
	return false;
};

GetFilterInfoAction.prototype.fireModifiedReportEvent = function()
{
	// do nothing
};

GetFilterInfoAction.prototype.buildActionContextAdditionalParmsXML = function()
{
	var itemDoc = XMLBuilderCreateXMLDocument("item");
	var itemElement = itemDoc.documentElement;
	for( var parm in this.m_requestParms )
	{
		if( this.m_requestParms.hasOwnProperty( parm ) )
		{
			var parameterElement = itemDoc.createElement( parm );
			parameterElement.appendChild( itemDoc.createTextNode( this.m_requestParms[parm]));
			itemElement.appendChild( parameterElement );
		}
	}

	return itemDoc;
};

GetFilterInfoAction.prototype.addActionContextAdditionalParms = function()
{
	if( this.m_requestParms === null )
	{
		return "";
	}
	return XMLBuilderSerializeNode( this.buildActionContextAdditionalParmsXML() );
};

GetFilterInfoAction.prototype.createFilterInfoDispatcherEntry = function()
{
	var filterInfoDispatcherEntry = new ReportInfoDispatcherEntry(this.m_oCV);
	filterInfoDispatcherEntry.initializeAction(this);
	return filterInfoDispatcherEntry;
};

GetFilterInfoAction.prototype.execute = function() {
	this.getCognosViewer().setKeepFocus(this.keepFocusOnWidget());
	var filterInfoDispatcherEntry = this.createFilterInfoDispatcherEntry();
	this.m_oCV.dispatchRequest(filterInfoDispatcherEntry);
	this.fireModifiedReportEvent();
};

GetFilterInfoAction.prototype.getOnPromptingCallback = function(){
	return this.getOnCompleteCallback();
};

function GetFilterValuesAction()
{
	this.m_sAction = 'CollectFilterValues';
	this.m_sRetryClass = 'GetFilterValues';
}

GetFilterValuesAction.prototype = new GetFilterInfoAction();

GetFilterValuesAction.prototype.addActionContextAdditionalParms = function()
{
	if( this.m_requestParms === null )
	{
		return "";
	}
	var itemDoc = this.buildActionContextAdditionalParmsXML();
	var itemElement = itemDoc.documentElement;
	for( var parm in this.m_requestParms ) {
		if (parm == "name") {
			// If we can find a min and max, send it....
			var selectionController = this.m_oCV.getSelectionController();
			if (typeof selectionController != "undefined" &&
				typeof selectionController.getCCDManager() != "undefined") {
				var minMax = selectionController.getCCDManager().GetPageMinMaxForRDI(this.m_requestParms[parm]);
				if (typeof minMax != "undefined") {
					var pageMinElement = itemDoc.createElement( "pageMin" );
					pageMinElement.appendChild( itemDoc.createTextNode( minMax.pageMin ) );
					var pageMaxElement = itemDoc.createElement( "pageMax" );
					pageMaxElement.appendChild( itemDoc.createTextNode( minMax.pageMax ) );
					itemElement.appendChild(pageMinElement);
					itemElement.appendChild(pageMaxElement);
				}
				if (this.m_oCV.isSinglePageReport() == true) {
					var singlePage = itemDoc.createElement("singlePageReport");
					itemElement.appendChild(singlePage);
				}
			}
			break;
		}
	}

	var additionalParms = XMLBuilderSerializeNode( itemDoc );
	return (additionalParms + this.addClientContextData(/*maxValuesPerRDI*/3));
};

GetFilterValuesAction.prototype.getOnCompleteCallback = function()
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();
	var params = this.m_requestParms;

	var callback = function(response) {
		viewerWidget.handleGetFilterValuesResponse(response, params);
	};

	return callback;
};

GetFilterValuesAction.prototype.canBeQueued = function() { return true; };
GetFilterValuesAction.prototype.getActionKey = function()
{
	if (typeof this.m_requestParms != "undefined" &&
		typeof this.m_requestParms.source != "undefined") {
			return this.m_sAction+this.m_requestParms.source;
	}
	return null;
};

function GetFilterableItemsAction()
{
	this.m_sAction = 'CollectFilterableItems';		
}

GetFilterableItemsAction.prototype = new GetFilterInfoAction();

GetFilterableItemsAction.prototype.addActionContextAdditionalParms = function()
{
	return this.addClientContextData(/*maxValuesPerRDI*/3);
};

GetFilterableItemsAction.prototype.getOnCompleteCallback = function()
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();
	var callback = function(response) {
		viewerWidget.handleGetFilterableItemsResponse(response);
	};

	return callback;
};


function UpdateDataFilterAction()
{
	this.m_sAction = "UpdateDataFilter";
	this.m_bForceRunSpec = false;
}

UpdateDataFilterAction.prototype = new ModifyReportAction();

UpdateDataFilterAction.prototype.runReport = function() {
	return this.getViewerWidget().shouldReportBeRunOnAction();
};

UpdateDataFilterAction.prototype.getActionKey = function()
{
	if (typeof this.m_requestParams != "undefined") {
		try
		{
			var parms = eval("(" + this.m_requestParams + ")");
			if (parms.clientId !== null) {
				return this.m_sAction + parms.clientId;
			}
		}
		catch (e)
		{
			// If eval fails for any reason, return a null actionKey.
		}
	}
	return null;
};

UpdateDataFilterAction.prototype.canBeQueued = function()
{
	return true;
};

UpdateDataFilterAction.prototype.keepFocusOnWidget = function()
{
	return false;
};

UpdateDataFilterAction.prototype.isUndoable = function()
{
	return false;
};

UpdateDataFilterAction.prototype.setRequestParms = function( parms )
{
	this.m_requestParams = parms.filterPayload;
	this.m_drillResetHUN = parms.drillResetHUN;
	this.m_isFacet = parms.isFacet;
	if (parms.forceCleanup) {
		this.m_sForceCleanup = parms.forceCleanup;
	}
};

UpdateDataFilterAction.prototype.forceRunSpecRequest = function() {
	return this.m_bForceRunSpec;
};

UpdateDataFilterAction.prototype.preProcessContextValues = function() {

	var resultingProcessedRequestParamsValues = [];

	var requestParamsObject = dojo.fromJson(this.m_requestParams);
			
	if(requestParamsObject && requestParamsObject["com.ibm.widget.context"] && (requestParamsObject["com.ibm.widget.context"]["values"] || requestParamsObject["com.ibm.widget.context"]["ranges"]) ) {	
		var oRAPReportInfo = this.m_oCV.m_RAPReportInfo;
		var reportContainers = oRAPReportInfo.getContainers();
		if(!reportContainers) {
			resultingProcessedRequestParamsValues;
		}
		
		// strip out data items which we don't care about (aren't part report info)
		var key = "";
		var contextObject = "";
		if(requestParamsObject["com.ibm.widget.context"]["values"]) {
			key = "values";
			contextObject = requestParamsObject["com.ibm.widget.context"]["values"];
		} else {
			key = "ranges";
			contextObject = requestParamsObject["com.ibm.widget.context"]["ranges"];
		}

		var existingSliderInfo = oRAPReportInfo.collectSliderSetFromReportInfo();
		
		for(dataItem in contextObject) {
			if (oRAPReportInfo && oRAPReportInfo.isReferenced(dataItem)) {
				var clonedRequestParam = dojo.clone(requestParamsObject);
				var newValues = {};
				newValues[dataItem] = requestParamsObject["com.ibm.widget.context"][key][dataItem];
				clonedRequestParam["com.ibm.widget.context"][key] = newValues;
				
				if(requestParamsObject["com.ibm.widget.context.bux.selectValueControl"] && requestParamsObject["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"] && requestParamsObject["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"]) {
					var newSpecification = {};
					clonedRequestParam["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"] = {};
					
					var packageBase = document.forms["formWarpRequest" + this.m_oCV.getId()].packageBase.value;
					
					for(modelItem in requestParamsObject["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"]) {
						if(modelItem.indexOf(packageBase) != -1) {
							newSpecification[dataItem] = requestParamsObject["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"][modelItem][dataItem];
							if (newSpecification[dataItem]) {
								clonedRequestParam["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"][modelItem] = newSpecification;
								break;
							}
						}
					}					
				}
				
				var itemCount = contextObject[dataItem] && key !== "ranges" ? contextObject[dataItem].length : 0;
				if (this.checkIfFilterExpressionChanged(dataItem, requestParamsObject.clientId, itemCount, existingSliderInfo)) {
					this.m_bForceRunSpec = true;
				}

				resultingProcessedRequestParamsValues.push(dojo.toJson(clonedRequestParam));
			}
		}
	} else {
		resultingProcessedRequestParamsValues.push(dojo.toJson(requestParamsObject));
	}
	
	return resultingProcessedRequestParamsValues;
};

/**
 * Returns true if this is a new filter or if the filterExpression in the reportSpec will
 * change because of this updateDataFilter action. It'll change if the slider/select value
 * was re-configured on a different data item or if we're going from one item to multiple items
 */
UpdateDataFilterAction.prototype.checkIfFilterExpressionChanged = function(dataItem, sliderId, itemCount, existingSliderInfo) {
	if (!existingSliderInfo || !existingSliderInfo[sliderId] || existingSliderInfo[sliderId].name != dataItem) {
		return true;
	}

	var existingItemCount = existingSliderInfo[sliderId].values ? existingSliderInfo[sliderId].values.length : 0;
	
	if (itemCount == existingItemCount) {
		return false;
	}
	
	// If we've gone from 1 value to multiple or from multiple to 1 then we need to do a runSpec
	return (itemCount === 1) !== (existingItemCount === 1);
};

UpdateDataFilterAction.prototype.addActionContext = function()
{	
	var actionContext = "<reportActions";
	var inlineValues = "";

	if(!this.runReport()) {
		actionContext += " run=\"false\"";
		inlineValues = "<inlineValues/>";
	}

	actionContext += ">";
	
	
	if( this.m_drillResetHUN  && this.m_drillResetHUN.length > 0 ) {
		actionContext += this._getDrillResetActionContext();
	}

	if(this.m_sForceCleanup) {
		actionContext += "<reportAction name=\"" + this.m_sAction + "\">" + dojo.toJson(this.m_sForceCleanup) + "</reportAction>";
	}
	
	var processedRequestParamValues;
	var isXMLFilterPayload = (this.m_requestParams.charAt(0)==="<"); 
	if ( this.m_isFacet || isXMLFilterPayload) {
		processedRequestParamValues = [ this.m_requestParams ];
	} else {
		processedRequestParamValues =  this.preProcessContextValues();	
	}
	
	for(var idx = 0; idx < processedRequestParamValues.length; ++idx) {
	
		var actionParams = processedRequestParamValues[idx];
		
		actionContext += "<reportAction name=\"" + this.m_sAction + "\">" + inlineValues;
	
		actionContext += (isXMLFilterPayload) ? actionParams : xml_encode(actionParams);
		
		if(idx > 0) {
			actionContext += "<augment>true</augment>";
		}		
	
		if (!this.m_isFacet) {
			actionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
		}
		
		actionContext += "</reportAction>";
		
		actionContext += "<reportAction name=\"GetInfo\"><include><sliders/></include>";
				
		actionContext += "</reportAction>";		
	}
	
	actionContext += "</reportActions>";

	return actionContext;
};

UpdateDataFilterAction.prototype._getDrillResetActionContext = function()
{
	var drillResetAction = new DrillResetAction();
	drillResetAction.setCognosViewer( this.getCognosViewer() );
	var params = { drilledResetHUNs : this.m_drillResetHUN };
	drillResetAction.setRequestParms( params );
	drillResetAction.setUpdateInfoBar( false );
	var drillResetActionContext = drillResetAction.getReportActionContext();
	return drillResetActionContext;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function CognosViewerSort( event, oCV ) {
	this.m_oCV = oCV;
	if( event )
	{
		this.m_oEvent = event;

		this.m_oNode = getCrossBrowserNode(event, true);
	}
}

CognosViewerSort.prototype.setNode = function( node )
{
	this.m_oNode = node;
};

CognosViewerSort.prototype.getNode = function()
{
	return this.m_oNode;
};

/*
 * Checks to see if this is a sort action
 */
CognosViewerSort.prototype.isSort = function() {

	if(this.m_oNode && this.m_oNode.nodeName == 'IMG' && (this.m_oNode.id).indexOf('sortimg') >= 0 )
	{
		return true;
	}
	else
	{
		return false;
	}
};

CognosViewerSort.prototype.execute = function() {
	var selectionController = getCognosViewerSCObjectRef(this.m_oCV.getId());
	selectionController.selectSingleDomNode(this.m_oNode.parentNode);

	var sortAction = this.getSortAction();
	sortAction.setCognosViewer(this.m_oCV);
	sortAction.execute();

	if (window.gViewerLogger) {
		window.gViewerLogger.addContextInfo(selectionController);
	}
};

/*
 * The order of sort is ascending, descending and none.
 * Figure out what the current sort should be based on previous sort order.
 * Eg. if previous sort order is ascending, then next sort order should be descending.
 */
CognosViewerSort.prototype.getSortAction = function() {

	var sortAction = this.m_oCV.getAction("Sort");

	var sortOrder = this.m_oNode.getAttribute( 'sortOrder' );
	if( sortOrder.indexOf('nosort') != -1 )
	{
		sortAction.setRequestParms({order:"ascending", type:"value"});
	}
	else if ( sortOrder.indexOf('ascending') != -1 )
	{
		sortAction.setRequestParms({order:"descending", type:"value"});
	}
	else if( sortOrder.indexOf('descending') != -1)
	{
		sortAction.setRequestParms({order:"none", type:"value"});
	}

	return sortAction;
};

function SortAction()
{
	this.m_sAction = "Sort";
	this.m_sortOrder = "none";
	this.m_sortType = "";
	this.m_sItem = "";
	this.m_sId="";
}

SortAction.prototype = new ModifyReportAction();

SortAction.prototype.doExecute = function() {
	//Abort execute iff existing sort is none and new sort is none
	if (this.m_sortOrder === "none") {
		//Allow the execute if there is no container - i.e. no field is selected.
		//This occurs when the user cancels a sort from the infobar.
		if (this.getContainerId(this.m_oCV.getSelectionController())) {
			var currentSort = this.getCurrentSortFromSelection();
			if (this.m_sortType === "value" && currentSort.indexOf("sortByValue") === -1) {
				return false;
			} else if (this.m_sortType === "label" && currentSort.indexOf("sortByLabel") === -1) {
				return false;
			}
		}
	}
	return true;
};

SortAction.prototype.execute = function() {
	if(this.doExecute()) {
		ModifyReportAction.prototype.execute.call(this);
	}
};

SortAction.prototype.getUndoHint = function()
{
	if (this.m_sortOrder == "none")	{
		return RV_RES.IDS_JS_DONT_SORT;
	}
	else {
		return RV_RES.IDS_JS_SORT;
	}
};

SortAction.prototype.setRequestParms = function(payload)
{
	this.m_sortOrder = payload.order;
	this.m_sortType = payload.type;
	if (payload.id!=null && typeof payload.id != "undefined") {
		this.m_sId   = payload.id;
	}
	if (payload.item!=null && typeof payload.item != "undefined") {
		this.m_sItem = payload.item;
	}
};

SortAction.prototype.addActionContextAdditionalParms = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var parms = "<order>" + this.m_sortOrder + "</order>";
	if(this.m_sortType == "label")
	{
		parms += "<byLabel/>";
	}
	if (this.getContainerId(selectionController)=="" && this.m_sId != null && typeof this.m_sId != "undefined" && this.m_sId != "") {
		parms+= ("<id>" + xml_encode(this.m_sId) + "</id>");
	}
	if (this.m_sItem != null && typeof this.m_sItem != "undefined" && this.m_sItem!="") {
		parms+= ("<item>" + xml_encode(this.m_sItem) + "</item>");
	}

	parms += this.addClientContextData(/*maxValuesPerRDI*/3);
	
	parms += this.getSelectedCellTags();

	return parms;
};

SortAction.prototype.toggleMenu = function(jsonSpec, enabled)
{
	if (enabled)
	{
		jsonSpec.iconClass = "sort";
		jsonSpec.disabled = false;
	}
	else
	{
		jsonSpec.iconClass = "sortDisabled";
		jsonSpec.disabled = true;
	}
	return jsonSpec;
};

SortAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	this.buildMenu(jsonSpec);
	if (jsonSpec.disabled == true)	{
		return this.toggleMenu(jsonSpec, false);
	}

	return this.buildDynamicMenuItem(this.toggleMenu(jsonSpec, true), "Sort");
};

SortAction.prototype.buildSelectedItemsString = function(selectedObjects, isSortByValue/*isSortByValue=false means sortByLabel*/, containerReportInfo)
{
	try {
		var selObj = selectedObjects[selectedObjects.length -1];
		if (isSortByValue) {
			var itemsLabel = selObj.getDisplayValues()[0];
			if (typeof itemsLabel == "undefined") {
				itemsLabel = selObj.getUseValues()[0][0];
			}
			return itemsLabel;
		} else {
			return selObj.getDataItemDisplayValue(containerReportInfo);
		}
	}
	catch (e) {
		if (console && console.log) {
			console.log(e);
		}
	}
};

SortAction.prototype.buildMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	if(!this.isSelectionSortable())
	{
		return this.toggleMenu(jsonSpec, false);
	}
	jsonSpec = this.toggleMenu(jsonSpec, true);

	var sortItems = [];

	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if(selectedObjects.length == 1 && selectedObjects[0].isHomeCell() == false)
	{
		var containerType = selectionController.getDataContainerType();
		var containerId = this.getContainerId( selectionController );
		var selectedReportInfo = this.getReportInfo(containerId);

		//if the selection is on the section of the sectioned list, the containerType is "".
		if (containerType == "" && !this.isSelectionOnChart() && selectedObjects[0].getLayoutType() == "section") {
			if (selectedReportInfo != null) {
				containerType = selectedReportInfo.displayTypeId;
			}
		}
		var reportInfo, sItemLabel, sSelectionInfo;
		var currentSortFromSelection = this.getCurrentSortFromSelection();

		var bSelectionOnChart = this.isSelectionOnChart();
		var bSortByValue = currentSortFromSelection.indexOf("sortByValue") != -1;
		var bSortByValueAscending = currentSortFromSelection.indexOf("sortByValueAscending") != -1;
		var bSortByValueDescending = currentSortFromSelection.indexOf("sortByValueDescending") != -1;
		var bIsIWidgetMobile = this.m_oCV.isIWidgetMobile();
		
		if(containerType == "list" )
		{
			var oSortByValueAscendingMenuItem = { name: "SortAscending", label: RV_RES.IDS_JS_SORT_ASCENDING, action: { name: "Sort", payload: {order:"ascending", type:"value"} }, items: null };
			this.addMenuItemChecked(bSortByValueAscending, oSortByValueAscendingMenuItem, "sortAscending");
			sortItems.push(oSortByValueAscendingMenuItem);

			var oSortByValueDescendingMenuItem = { name: "SortDescending", label: RV_RES.IDS_JS_SORT_DESCENDING, action: { name: "Sort", payload: { order:"descending", type:"value"} }, items: null };
			this.addMenuItemChecked(bSortByValueDescending, oSortByValueDescendingMenuItem, "sortDescending");
			sortItems.push(oSortByValueDescendingMenuItem);

			var oSortMenuItem = { name: "DontSort", label: RV_RES.IDS_JS_DONT_SORT, action: { name: "Sort", payload: {order:"none",type:"value"} }, items: null };
			this.addMenuItemChecked(!bSortByValue, oSortMenuItem, "sortNone");
			sortItems.push(oSortMenuItem);
		}
		else if (containerType == "crosstab" || bSelectionOnChart)
		{
			if  (selectedObjects[0].getLayoutType() == 'columnTitle' || bSelectionOnChart)
			{
				reportInfo = this.m_oCV.getRAPReportInfo();
				if(this.canSortByValueOnCrosstab(selectedObjects[0], reportInfo))
				{
					sItemLabel = RV_RES.IDS_JS_SORT_BY_VALUE;
					// need to show what item will get sorted if we're dealing with charts since
					// charts don't show selection
					if (bSelectionOnChart) {
						sSelectionInfo = this.buildSelectedItemsString(selectedObjects, true /*sortByValue*/, selectedReportInfo);
						if (typeof sSelectionInfo !== "undefined") {
							sItemLabel += ":" + sSelectionInfo;
						}
					}
					var oSortByValueMenuItem = { name: "SortByValue", label: sItemLabel, action: null, items: [{ name: "Ascending", label: RV_RES.IDS_JS_SORT_BY_ASCENDING, action: { name: "Sort", payload: {order:"ascending",type:"value"} }, items: null }, { name: "Descending", label: RV_RES.IDS_JS_SORT_BY_DESCENDING, action: { name: "Sort", payload: {order:"descending",type:"value"} }, items: null }, { name: "SortNone", label: RV_RES.IDS_JS_DONT_SORT, action: { name: "Sort", payload: {order:"none",type:"value"} }, items: null } ] };

					this.addMenuItemChecked(bSortByValue, oSortByValueMenuItem);
					this.addMenuItemChecked(bSortByValueAscending, oSortByValueMenuItem.items[0], "sortAscending");
					this.addMenuItemChecked(bSortByValueDescending, oSortByValueMenuItem.items[1], "sortDescending");
					this.addMenuItemChecked(!bSortByValue, oSortByValueMenuItem.items[2], "sortNone");

					if (bIsIWidgetMobile) {
						oSortByValueMenuItem.flatten = true;
					}
					
					sortItems.push(oSortByValueMenuItem);
				}

				if(this.canSortByLabelOnCrosstab(selectedObjects[0]))
				{
					sItemLabel = RV_RES.IDS_JS_SORT_BY_LABEL;
					// need to show what item will get sorted if we're dealing with charts since
					// charts don't show selection
					if (bSelectionOnChart) {
						sSelectionInfo = this.buildSelectedItemsString(selectedObjects, false /*sortByLabel*/, selectedReportInfo);
						if (typeof sSelectionInfo !== "undefined") {
							sItemLabel += ":" + sSelectionInfo;
						}
					}

					var oSortByLabelMenuItem = { name: "SortByLabel", label: sItemLabel, action: null, items: [{ name: "Ascending", label: RV_RES.IDS_JS_SORT_BY_ASCENDING, action: { name: "Sort", payload: {order:"ascending",type:"label"} }, items: null }, { name: "Descending", label: RV_RES.IDS_JS_SORT_BY_DESCENDING, action: { name: "Sort", payload: {order:"descending",type:"label"} }, items: null }, { name: "SortNone", label: RV_RES.IDS_JS_DONT_SORT, action: { name: "Sort", payload: {order:"none",type:"label"} }, items: null } ] };

					var bSortByLabel = currentSortFromSelection.indexOf("sortByLabel") != -1;
					this.addMenuItemChecked(bSortByLabel, oSortByLabelMenuItem);
					this.addMenuItemChecked(currentSortFromSelection.indexOf("sortByLabelAscending") != -1, oSortByLabelMenuItem.items[0], "sortAscending");
					this.addMenuItemChecked(currentSortFromSelection.indexOf("sortByLabelDescending") != -1, oSortByLabelMenuItem.items[1], "sortDescending");
					this.addMenuItemChecked(!bSortByLabel, oSortByLabelMenuItem.items[2], "sortNone");

					if (bIsIWidgetMobile) {
						oSortByLabelMenuItem.flatten = true;
					}

					sortItems.push(oSortByLabelMenuItem);
				}
			}
		}
	}

	if(sortItems.length == 0)
	{
		this.toggleMenu(jsonSpec, false);
	}
	else
	{
		if (bIsIWidgetMobile) {
			if (containerType == "crosstab" || bSelectionOnChart) {
				jsonSpec.useChildrenItems = true;
			}
			else {
				jsonSpec.flatten = true;
			}
		}
		
		jsonSpec.items = sortItems;
		this.toggleMenu(jsonSpec, true);
	}
	return jsonSpec;
};

SortAction.prototype.isSelectionSortable = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if (selectedObjects.length == 1) {
		var selectedObject = selectedObjects[0];
		//If the select object should be disabled when the user selects a measured cell(s).
		if (selectionController.getDataContainerType() == "crosstab" && selectedObject.getLayoutType() == 'datavalue')
		{
			return false;
		}

		if (selectionController.hasSelectedChartNodes())
		{
			var node = selectedObject.getArea();
			if (node.nodeName == 'AREA' || node.nodeName == 'IMG')
			{
				return selectedObjects[0].getLayoutType() == 'ordinalAxisLabel' || selectedObjects[0].getLayoutType() == 'legendLabel';
			}
		}
		else
		{
			var data = selectedObject.getDataItems();
			if(selectedObject.getCellRef().getAttribute("type") == "datavalue" && !(data && data.length)) {
				//Not sortable if there is no logical data in the selection
				return false;
			}
			var oCell = selectedObject.getCellRef();
			if (oCell.getAttribute("no_data_item_column") === "true") {
				return false;
			}
			if (oCell.getAttribute("canSort") != "false") {
				return true;
			}
		}


	}

	return false;
};


SortAction.prototype.getCurrentSortFromSelection = function()
{
	var containerId = this.getContainerId(this.m_oCV.getSelectionController());
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();

	var currentSortFromSelection = "";

	if(containerId != "" && oRAPReportInfo) {
		var container = oRAPReportInfo.getContainer(containerId);
		if(typeof container.sort != "undefined") {
			var selectionController = this.m_oCV.getSelectionController();
			var selectedObjects = selectionController.getAllSelectedObjects();

			if(selectedObjects.length == 1) {
				var dataItems = selectedObjects[0].getDataItems();
				if(dataItems.length < 1) {
					return currentSortFromSelection;
				}
				var dataItem = dataItems[0][0];

				for(var index = 0; index < container.sort.length; ++index) {
					var sortInfo = container.sort[index];

					if(typeof sortInfo.labels == "string" && sortInfo.labels == dataItem) {
						currentSortFromSelection += sortInfo.order == "descending" ? "sortByLabelDescending" : "sortByLabelAscending";
					}

					if(typeof sortInfo.valuesOf == "string" && (sortInfo.valuesOf == dataItem || this.isSortedValueOnRenamedColumn(selectedObjects[0], sortInfo))) {
						currentSortFromSelection += sortInfo.order == "descending" ? "sortByValueDescending" : "sortByValueAscending";
					}
					else if(sortInfo.valuesOf instanceof Array) {
						var match = true;
						for(var valueSortIdx = 0; valueSortIdx < sortInfo.valuesOf.length; ++valueSortIdx) {
							if(valueSortIdx < selectedObjects[0].m_contextIds[0].length) {
								var ctx = selectedObjects[0].m_contextIds[0][valueSortIdx];
								var selectionDisplayValue = selectionController.getDisplayValue(ctx);
								var sortDisplayValue = this.findItemLabel(container, sortInfo.valuesOf[valueSortIdx].item);

								if(sortDisplayValue != selectionDisplayValue) {
									match = false;
									break;
								}
							}
						}
						if(match) {
							currentSortFromSelection += sortInfo.valuesOf[0].order == "descending" ? "sortByValueDescending" : "sortByValueAscending";
						}
					}
				}
			}
		}
	}

	return currentSortFromSelection;
};

SortAction.prototype.isSortedValueOnRenamedColumn =function(selectedObject, sortInfo){
 if(sortInfo && selectedObject){
 	return (sortInfo.valuesOf === selectedObject.getColumnRP_Name() && selectedObject.getLayoutType() === "columnTitle");
 }	
};

SortAction.prototype.findItemLabel = function(container, item) {
	var itemInfo = container.itemInfo;
	if (itemInfo) {
		for (var i = 0; i < itemInfo.length; i++) {
			if (itemInfo[i].item === item) {
				if (itemInfo[i].itemLabel) {
					return itemInfo[i].itemLabel;
				}
				break;
			}
		}
	}
	return item;
};

SortAction.prototype.canSortByValueOnCrosstab = function(selectedObject, reportInfo)
{
	var selectionController = this.m_oCV.getSelectionController();
	var containerId = this.getContainerId(this.m_oCV.getSelectionController());

	if (selectionController.isRelational() == true) {
		return false;
	}

	if (selectionController.selectionsHaveCalculationMetadata() && this.selectedObjectIsLeaf(containerId, selectedObject, reportInfo)) {
		//The DAM layer allows "tagging" of calculation values which are part of sets with uuid designators.
		//These uuid's are simply passed through and returned as if they were mun's (but are not muns and can't be used in expressions)
		//We don't support these as discrete values.
		var aMuns = selectedObject.getMuns()[0];
		for (var index = 0; index < aMuns.length; ++index)
		{
			if (aMuns[index] != null && aMuns[index].indexOf("uuid:") >= 0)
			{
				return false;
			}
		}

		return true;
	}

	return false;
};

SortAction.prototype.selectedObjectIsLeaf = function (containerId, selectedObject, reportInfo)
{
	if (reportInfo) {
		var dataItems = selectedObject.getDataItems();
		if (dataItems != null && typeof dataItems != "undefined" && dataItems.length > 0) {
			var oDrillability = reportInfo.getDrillability(containerId, dataItems[0][0]);
			if (oDrillability) {
				return oDrillability.leaf == true;
			}
		}
	}
	return false;
};

SortAction.prototype.canSortByLabelOnCrosstab = function(selectedObject)
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if(selectedObjects.length == 1) {
		// FIXME: This variable (selectedObject) is masking the first parameter. Remove variable or the parameter.
		var selectedObject = selectedObjects[0];
		if (this.isSelectSingleMember(selectedObject)==false)
		{
			if (selectionController.selectionsNonMeasureWithMUN() || !selectionController.selectionsHaveCalculationMetadata()) {
					return true;
			}
		}
	}
	return false;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

// This action is used to rerender the html output, using the same query
function RedrawAction() {
	this.m_specUpdated = false;
}
RedrawAction.prototype = new ModifyReportAction();
RedrawAction.prototype.reuseQuery = function() { return true; };
RedrawAction.prototype.keepRAPCache = function() { return false; };

RedrawAction.prototype.setSpecUpdated = function(flag)
{
	this.m_specUpdated = flag;
};

RedrawAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_ADVANCED_EDITING;
};

RedrawAction.prototype.addActionContext = function()
{
	if (this.m_specUpdated) {
		return "<reportActions><GetInfo><specUpdatedInBUA/></GetInfo></reportActions>";
	}
	return "<reportActions><GetInfo/></reportActions>";
};



/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function EditContentAction()
{
	this._oMissingMemberRecoveryMode = null;
}
EditContentAction.prototype = new CognosViewerAction();
EditContentAction.superclass = CognosViewerAction.prototype;

EditContentAction.prototype.execute = function() {
	if (typeof this.preferencesChanged != "undefined" && this.preferencesChanged !== null && this.preferencesChanged === true )	{
		this.deleteCWAContainer();
		return;
	}

	window.CVEditContentActionInstance = this;

	var buaAlreadyLoaded = window.viewerCWAContainer ? true : false;
	
	if (!window.viewerCWAContainer) {
		this.createCWAContainer();
	}
	
	this.addWindowEventListeners();
	this.buildBUAObjects();
	
	window.viewerCWAContainer.show();
	
	if (buaAlreadyLoaded) {
		window.BUAEvent("appReady");
	}
};

EditContentAction.prototype.createCWAContainer = function() {
	this.deleteCWAContainer();
	
	var containerDiv = this.createCWAIFrame();
	var blocker = this.createBlocker();
	window.viewerCWAContainer = {
		"type" : "iframe",
		"containerDiv" : containerDiv,
		"blocker" : blocker,
		"iframePadding" : "18",
		"show" : function() { 
			this.resize();
			this.containerDiv.style.display = "block";
			this.blocker.style.display = "block";			
		},
		"hide" : function() {
			this.blocker.style.display = "none";
			this.containerDiv.style.display = "none";
		},
		"resize" : function() {
			var windowBox = dojo.window.getBox();
			this.containerDiv.style.height = windowBox.h - this.iframePadding + "px";
			this.containerDiv.style.width = windowBox.w - this.iframePadding + "px";				
		}
	};
};

EditContentAction.prototype.deleteCWAContainer = function() {
	var containerObj = window.viewerCWAContainer;
	if (containerObj) {
		containerObj.hide();
		document.body.removeChild(containerObj.containerDiv);
		document.body.removeChild(containerObj.blocker);
	
		delete window.viewerCWAContainer;
		window.viewerCWAContainer = null;
	}
};

EditContentAction.prototype.hideCWAContainer = function() {
	this.removeWindowEventListeners();
	if (window.viewerCWAContainer) {
		window.viewerCWAContainer.hide();
	}

	window.CVEditContentActionInstance = null;
};

EditContentAction.prototype.createCWAIFrame = function() {
	var containerDiv = document.createElement("div");
	containerDiv.className = "buaContainer";
	document.body.appendChild(containerDiv);
	
	var iframeElement = document.createElement("iframe");
	iframeElement.setAttribute("id","buaIframe");
	iframeElement.setAttribute("src", this.getWebContent() + "/pat/rsapp.htm");
	iframeElement.setAttribute("name", "buaIframe");
	iframeElement.setAttribute("frameborder",'0');
	iframeElement.className = "buaIframe";
	
	containerDiv.appendChild(iframeElement);
	
	return containerDiv;
};

EditContentAction.prototype.createBlocker = function() {
	var blocker = document.createElement("div");
	blocker.setAttribute("id","reportBlocker");
	blocker.setAttribute("name", "reportBlocker");
	blocker.setAttribute("tabIndex", "1");
	blocker.className = "reportBlocker";
	
	document.body.appendChild(blocker);
	
	return blocker;
};

EditContentAction.prototype.buildBUAObjects = function() {
	window.RSParameters = {
		"rs_UIProfile" : "BUA",
		"ui.action" : "edit",
		"gateway" : location.protocol + "//" + location.host + this.getGateway(),
		"theme" : "corporate",//make look&feel consistent between CW and CWA
		"capabilitiesXML" : this.getCapabilitiesXml(),
		"cafcontextid" : this.getCafContextId(),
		"paneOnRight" : this.getViewerIWidget().getPaneOnRight()
	};

	var viewerWidget = this.getViewerIWidget();
	if(viewerWidget !== null) {
		var cvGateway = viewerWidget.getAttributeValue("gateway");
		if(cvGateway) {
			window.RSParameters["cv.gateway"] = cvGateway;
		}
		var cvWebcontent = viewerWidget.getAttributeValue("webcontent");
		if(cvWebcontent) {
			window.RSParameters["cv.webcontent"] = cvWebcontent;
		}
	}

	this.addExtraLaunchParameters(window.RSParameters);
};

EditContentAction.prototype.getBUAIframe = function() {
	return document.getElementById("buaIframe");
};

EditContentAction.prototype.getBUAWindow = function() {
	var buaWindow = null;
	var buaIframe = this.getBUAIframe();
	if(buaIframe !== null) {
		buaWindow = buaIframe.contentWindow;
	}

	return buaWindow;
};

EditContentAction.prototype.setReportSettings = function() {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();

	//Fire an IWidget event to get the title
	widget.fireEvent("com.ibm.bux.widget.getDisplayTitle", null, { callback: function(sTitle) { window.CVEditContentActionInstance.openReportWithBUA(sTitle); } });
};

EditContentAction.prototype.openReportWithBUA = function(sTitle) {
	var subStringIndex = this.m_oCV.envParams["ui.spec"].indexOf("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
	if (subStringIndex == -1) { subStringIndex = 0; } else { subStringIndex = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>".length; }
	var sReportXML = this.m_oCV.envParams["ui.spec"].substr(subStringIndex, this.m_oCV.envParams["ui.spec"].length);

	var oContext = {
		"displayName" : xml_decode(sTitle), //Chrome HTML encoded this sTtitle
		"parameterValues" : this.m_oCV.getExecutionParameters(),
		"reportXML" : sReportXML,
		"showOpenTransition" : false
	};
	
	if (this.ifPassTrackingtoBUA()) {
		oContext.tracking = this.m_oCV.getTracking();
	}
	
	var buaWindow = this.getBUAWindow();
	buaWindow.Application.SetBUAContext(oContext);
};

EditContentAction.prototype.getViewerIWidget = function() {
	return this.m_oCV.getViewerWidget();
};

EditContentAction.prototype.getGateway = function() {
	return this.m_oCV.getGateway();
};

EditContentAction.prototype.getCapabilitiesXml = function() {
	return this.m_oCV.capabilitiesXML;
};

EditContentAction.prototype.getCafContextId = function() {
	return typeof this.m_oCV.cafContextId != "undefined" ? this.m_oCV.cafContextId : "";
};

EditContentAction.prototype.getWebContent = function() {
	return this.getCognosViewer().getWebContentRoot();
};

EditContentAction.prototype.addExtraLaunchParameters = function(RSParameters) {};

EditContentAction.prototype.runUpdatedReportFromBUA = function() {
	var buaWindow = this.getBUAWindow();
	var originalSpec = this.m_oCV.envParams["ui.spec"];

	var oContext = buaWindow.Application.GetBUAContext();
	if (oContext.isSpecModified) {
		this.m_oCV.envParams["ui.spec"] = oContext.reportXML;
		this.m_oCV.setTracking(oContext.tracking);
		this.m_oCV.setExecutionParameters(oContext.parameterValues);

		this._invokeRedrawAction(originalSpec);
	}
};

EditContentAction.prototype._invokeRedrawAction = function(originalSpec)
{
		this.getUndoRedoQueue().setOriginalSpec(originalSpec);
		var redrawAction = this.m_oCV.getAction("Redraw");
		redrawAction.setSpecUpdated(true);
		this.m_oCV.getViewerWidget().setPromptParametersRetrieved(false);
		redrawAction.execute();
};


EditContentAction.prototype.ifPassTrackingtoBUA = function()
{
	if (this.m_oCV.getRAPReportInfo()) {
		return this.m_oCV.getRAPReportInfo().getPassTrackingtoBUA();
	}

	return true;
};

EditContentAction.prototype.setRequestParms = function(params) {
	EditContentAction.superclass.setRequestParms(params);
	if (params) {
		if (params.preferencesChanged) {
			this.preferencesChanged = params.preferencesChanged;
		}
		
		if (params.MissingMemberRecoveryMode) {
			this._oMissingMemberRecoveryMode = params.MissingMemberRecoveryMode;
		}		
	}
};

EditContentAction.prototype.runUpdatedReportFromBUA_MissingMemberRecoveryMode = function() {
	var buaWindow = this.getBUAWindow();
	var originalSpec = this.m_oCV.envParams["ui.spec"];

	var oContext = buaWindow.Application.GetBUAContext();
	
	this.m_oCV.setTracking(oContext.tracking);
	
	this.m_oCV.envParams["ui.spec"] = oContext.reportXML;
	this.m_oCV.setExecutionParameters(oContext.parameterValues);
	
	if (this._oMissingMemberRecoveryMode && this._oMissingMemberRecoveryMode.oFaultDialog) {
		this._oMissingMemberRecoveryMode.oFaultDialog.hide();
	}
	
	this._invokeRedrawAction(originalSpec);
};

EditContentAction.prototype.cancelPressed = function() {};

EditContentAction.prototype.addWindowEventListeners = function() {
	if (window.attachEvent)	{
		window.attachEvent("onresize", window.CVEditContentActionInstance.onWindowResize);
	}
	else {
		window.addEventListener("resize", window.CVEditContentActionInstance.onWindowResize, false);
	}
};

EditContentAction.prototype.removeWindowEventListeners = function() {
	if (window.detachEvent)	{
		window.detachEvent("onresize", window.CVEditContentActionInstance.onWindowResize);
	}
	else {
		window.removeEventListener("resize", window.CVEditContentActionInstance.onWindowResize, false);
	}
};

EditContentAction.prototype.onWindowResize = function() {
	var containerObj = window.viewerCWAContainer;
	if (containerObj) {
		containerObj.resize();
	}
};

/**
 * Interface that CWA will call
 * @param eventType
 */
function BUAEvent(eventType)
{
	var editContentObj = window.CVEditContentActionInstance;
	switch (eventType)
	{
		case "appReady":
			editContentObj.setReportSettings();
			break;
		case "donePressed":
			editContentObj.hideCWAContainer();
			if (editContentObj._oMissingMemberRecoveryMode) {
				editContentObj.runUpdatedReportFromBUA_MissingMemberRecoveryMode();
			} else {
				editContentObj.runUpdatedReportFromBUA();
			}
			break;
		case "cancelPressed":
			editContentObj.cancelPressed();
			editContentObj.hideCWAContainer();
			break;
	}
}
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function NewReportAction() {
	this._viewerIWidget = null;
	this._packageSearchPath = null;
	this._webContentRoot = null;
	this._gateway = null;
	this._capabilitiesXml =  null;
	this._cafContextId = null;
}
NewReportAction.prototype = new EditContentAction();
NewReportAction.prototype.parent = EditContentAction.prototype;

NewReportAction.prototype.clearSelections = function() {};

NewReportAction.prototype.getCognosViewer = function() {
	return this.getViewerIWidget().getViewerObject();
};

NewReportAction.prototype.setRequestParms = function(params) {
	this.parent.setRequestParms.call(this, params);
	
	this._packageSearchPath = params.packageSearchPath;
	this._viewerIWidget = params.viewerIWidget;	
	this._webContentRoot = params.webContentRoot;
	this._gateway = params.gateway;
	this._capabilitiesXml =  params.capabilitiesXml;
	this._cafContextId = params.cafContextId;
};

NewReportAction.prototype.getViewerIWidget = function() {
	return this._viewerIWidget;
};

NewReportAction.prototype.getGateway = function() {
	return this._gateway;
};

NewReportAction.prototype.getCapabilitiesXml = function() {
	return this._capabilitiesXml;
};

NewReportAction.prototype.getCafContextId = function() {
	return this._cafContextId ? this._cafContextId : "";
};

NewReportAction.prototype.getWebContent = function() {
	return this._webContentRoot;
};

NewReportAction.prototype.setReportSettings = function() {
	var oContext = {
		"showOpenTransition" : false,
		"model" : this._packageSearchPath
	};

	var buaWindow = this.getBUAWindow();
	buaWindow.Application.SetBUAContext(oContext);
};

/**
 * Adds any extra parameters needed when creating a new report
 */
NewReportAction.prototype.addExtraLaunchParameters = function(RSParameters) {
	RSParameters.model = this._packageSearchPath;
};


NewReportAction.prototype.cancelPressed = function() {
	this.getViewerIWidget().iContext.iEvents.fireEvent("com.ibm.bux.widget.action", null, { action: 'deleteWidget' });
};

/**
 * Get the information from CWA and recall the onLoad of the Viewer iWidget
 */
NewReportAction.prototype.runUpdatedReportFromBUA = function() {
	var iWidget = this.getViewerIWidget();
	
	iWidget.setAttributeValue("reportCreatedInCW", "true");
	
	var oContext = this.getBUAWindow().Application.GetBUAContext();
	iWidget.setNewReportInfo({
		"ui.spec" : oContext.reportXML,
		"m_tracking" : oContext.tracking ? oContext.tracking : "",
		"parameterValues" : oContext.parameterValues ? oContext.parameterValues : ""
	});
	
	iWidget.onLoad();
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2016
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 /**
 * Implements authored drill through
 */
function AuthoredDrillAction()
{
	this.m_drillTargetSpecification = "";
}

AuthoredDrillAction.prototype = new CognosViewerAction();

AuthoredDrillAction.prototype.setRequestParms = function(drillTargetSpecification)
{
	this.m_drillTargetSpecification = drillTargetSpecification;
};


AuthoredDrillAction.prototype.executeDrillTarget = function(drillTargetSpecification)
{
	var drillTargetNode = XMLHelper_GetFirstChildElement( XMLBuilderLoadXMLFromString (drillTargetSpecification) );

	var sBookmarkRef = encodeURIComponent(drillTargetNode.getAttribute("bookmarkRef"));
	var sTargetPath = drillTargetNode.getAttribute("path");
	var bShowInNewWindow = this._shouldShowInNewWindow(drillTargetNode);
	var oCV = this.getCognosViewer();
	
	if((sBookmarkRef !== null && sBookmarkRef !== "") && (sTargetPath === null || sTargetPath === ""))
	{
		var sBookmarkPage = drillTargetNode.getAttribute("bookmarkPage");
		if (sBookmarkPage && sBookmarkPage !== "") {
			oCV.executeAction("GotoPage",{ "pageNumber": sBookmarkPage,"anchorName": sBookmarkRef} );
		} else {
			document.location = "#" + sBookmarkRef;
		}
	}
	else
	{
		var sTarget = "";
		if(bShowInNewWindow)
		{
			sTarget = "_blank";
		}

		var aArguments = [];

		var objPathArguments = [];
		objPathArguments.push("obj");
		objPathArguments.push(sTargetPath);

		aArguments[aArguments.length] = objPathArguments;
		
		var bHasPropertyToPass = false;

		var drillParameterArguments, drillParameterNode, sValue, sName, sNil;
		var drillParameterNodes = XMLHelper_FindChildrenByTagName(drillTargetNode, "drillParameter", false);
		for(var index = 0; index < drillParameterNodes.length; ++index)
		{
			drillParameterArguments = [];
			drillParameterNode = drillParameterNodes[index];
			sValue = drillParameterNode.getAttribute("value");
			sName = drillParameterNode.getAttribute("name");

			if(sValue !== null && sValue !== "")
			{
				drillParameterArguments.push("p_" + sName);
				drillParameterArguments.push(this.buildSelectionChoicesSpecification(drillParameterNode));
			}

			sNil = drillParameterNode.getAttribute("nil");
			if(sNil !== null && sNil !== "")
			{
				drillParameterArguments.push("p_" + sName);
				drillParameterArguments.push(this.buildSelectionChoicesNilSpecification());
			}

			if(drillParameterArguments.length > 0)
			{
				aArguments[aArguments.length] = drillParameterArguments;
			}
			
			if( !bHasPropertyToPass){
				var sPropertyToPass = drillParameterNode.getAttribute( "propertyToPass");
				bHasPropertyToPass = ( sPropertyToPass && sPropertyToPass.length > 0 ) ? true : false;
			}
		}

		var sMethod = drillTargetNode.getAttribute("method");

		var sOutputFormat = drillTargetNode.getAttribute("outputFormat");

		var sOutputLocale = drillTargetNode.getAttribute("outputLocale");

		var sPrompt = drillTargetNode.getAttribute("prompt");
		var dynamicDrill = drillTargetNode.getAttribute("dynamicDrill");

		var sSourceContext = this.getXMLNodeAsString(drillTargetNode, "parameters");
		var sObjectPaths = this.getXMLNodeAsString(drillTargetNode, "objectPaths");

		var oCVId = oCV.getId();
		// if the source and target are the same report, and the prompt attribute in drill definition is not set to true, and we're not opening a new window, then do a forward instead of a drillThrough action
		var formWarpRequest = document.forms["formWarpRequest" + oCVId];
		var callForward = oCV.getAdvancedServerProperty("VIEWER_JS_CALL_FORWARD_DRILLTHROUGH_TO_SELF");
		if ( (!callForward || callForward.toLowerCase() !== "false")  && sPrompt != "true" && this.isSameReport(formWarpRequest, sTargetPath) && this.isSameReportFormat(sOutputFormat) && !bShowInNewWindow && !bHasPropertyToPass  )
		{
			var cognosViewerRequest = new ViewerDispatcherEntry(oCV);
			cognosViewerRequest.addFormField("ui.action", "forward");

			if(oCV !== null && typeof oCV.rvMainWnd != "undefined")
			{
				oCV.rvMainWnd.addCurrentReportToReportHistory();
				var reportHistorySpecification = oCV.rvMainWnd.saveReportHistoryAsXML();
				cognosViewerRequest.addFormField("cv.previousReports", reportHistorySpecification);
			}

			// if we're drilling through to ourself we need to send empty parameters for
			// the parameters that are setup to no send any parameter values
			for(index = 0; index < drillParameterNodes.length; ++index)
			{
				drillParameterArguments = [];
				drillParameterNode = drillParameterNodes[index];
				sValue = drillParameterNode.getAttribute("value");
				sName = drillParameterNode.getAttribute("name");
				sNil = drillParameterNode.getAttribute("nil");

				if((sNil === null || sNil === "") && (sValue === null || sValue === ""))
				{
					drillParameterArguments.push("p_" + sName);
					drillParameterArguments.push(this.buildSelectionChoicesNilSpecification());
				}

				if(drillParameterArguments.length > 0)
				{
					aArguments[aArguments.length] = drillParameterArguments;
				}
			}

			for (index=1; index < aArguments.length; index++)
			{
				cognosViewerRequest.addFormField(aArguments[index][0], aArguments[index][1]);
			}

			cognosViewerRequest.addFormField("_drillThroughToSelf", "true");

			// If we're dealing with a tabbed report and drilling to ourselves, then make sure we show the first tab when the report refreshes
			if (oCV.m_tabsPayload && oCV.m_tabsPayload.tabs) {
				cognosViewerRequest.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup", oCV.m_tabsPayload.tabs[0].id)
			}
			
			oCV.setUsePageRequest(true);
			oCV.dispatchRequest(cognosViewerRequest);

			if (typeof oCV.m_viewerFragment == "undefined") {
				var objectRef = getCognosViewerObjectRefAsString(oCVId);
				setTimeout(objectRef+".getRequestIndicator().show()",10);
			}
		}
		else
		{
			doSingleDrill(sTarget, aArguments, sMethod, sOutputFormat, sOutputLocale, sBookmarkRef, sSourceContext, sObjectPaths, this.getCognosViewer().getId(), sPrompt, dynamicDrill);
		}
	}
};

AuthoredDrillAction.prototype._shouldShowInNewWindow = function(drillTargetNode) {
	return drillTargetNode.getAttribute("showInNewWindow") == "true";
};

AuthoredDrillAction.prototype.isSameReport = function( formWarpRequest, sTargetPath )
{
	if( formWarpRequest["ui.object"] && sTargetPath == formWarpRequest["ui.object"].value )
	{
		return true;
	}

	return false;

};

AuthoredDrillAction.prototype.isSameReportFormat = function( drillTargetFormat )
{
	var drillSourceFormat =  this.getCognosViewer().envParams["run.outputFormat"];
	if( drillSourceFormat )
	{
		if (drillTargetFormat == drillSourceFormat )
		{
			return true;
		}
		//the following case occurs when the target drill-thru definition is set to default format
		// and the source format is HTML.
		else if( drillSourceFormat == "HTML" && drillTargetFormat == "HTMLFragment")
		{
			return true;
		}
	}
	return false;
};

AuthoredDrillAction.prototype.getXMLNodeAsString = function(drillTargetNode, sNodeName)
{
	var sXML = "";
	if(drillTargetNode != null)
	{
		var node = XMLHelper_FindChildByTagName(drillTargetNode, sNodeName, false);
		if(node != null)
		{
			sXML = XMLBuilderSerializeNode(node);
		}
	}

	return sXML;
};

AuthoredDrillAction.prototype.execute = function(rvDrillTargetsSpecification)
{
	if(this.m_drillTargetSpecification != "")
	{
		this.executeDrillTarget(this.m_drillTargetSpecification);
	}
	else if(typeof rvDrillTargetsSpecification != "undefined")
	{
		var drillTargetSpecifications = this.getCognosViewer().getDrillTargets();
		var rvDrillTargetsNode = this.getAuthoredDrillThroughContext(rvDrillTargetsSpecification, drillTargetSpecifications);

		var drillTargets = rvDrillTargetsNode.childNodes;
		if(drillTargets.length == 1)
		{
			this.executeDrillTarget(XMLBuilderSerializeNode(drillTargets[0]));
		}
		else
		{
			doMultipleDrills(XMLBuilderSerializeNode(rvDrillTargetsNode), this.getCognosViewer().getId());
			//Need support from goto page
			//this.showDrillTargets(drillTargets);
		}
	}
};

AuthoredDrillAction.prototype.showDrillTargets = function(drillTargets)
{
	var sAuthoredDrillThroughContext = "<context>";

	for(var index = 0; index < drillTargets.length; ++index)
	{
		var drillTarget = drillTargets[index];

		sAuthoredDrillThroughContext += "<member>";

		var sName = drillTarget.getAttribute("label");
		sAuthoredDrillThroughContext += "<name>";
		sAuthoredDrillThroughContext += sXmlEncode(sName);
		sAuthoredDrillThroughContext += "</name>";

		var sDrillThroughSearchPath = drillTarget.getAttribute("path");
		sAuthoredDrillThroughContext += "<drillThroughSearchPath>";
		sAuthoredDrillThroughContext += sXmlEncode(sDrillThroughSearchPath);
		sAuthoredDrillThroughContext += "</drillThroughSearchPath>";

		var sDrillThroughAction = drillTarget.getAttribute("method");
		sAuthoredDrillThroughContext += "<drillThroughAction>";
		sAuthoredDrillThroughContext += sXmlEncode(sDrillThroughAction);
		sAuthoredDrillThroughContext += "</drillThroughAction>";

		var sDrillThroughFormat = drillTarget.getAttribute("outputFormat");
		sAuthoredDrillThroughContext += "<drillThroughFormat>";
		sAuthoredDrillThroughContext += sXmlEncode(sDrillThroughFormat);
		sAuthoredDrillThroughContext += "</drillThroughFormat>";

		var sData = "parent." + this.getTargetReportRequestString(drillTarget);
		sAuthoredDrillThroughContext += "<data>";
		sAuthoredDrillThroughContext += sXmlEncode(sData);
		sAuthoredDrillThroughContext += "</data>";

		sAuthoredDrillThroughContext += "</member>";
	}

	sAuthoredDrillThroughContext += "</context>";

	// need to fix the ui.backURL and errURL since they'll be getting rejected by caf. TODO post BSEINS
	//cvLoadDialog(this.getCognosViewer(), {"m":"portal/goto.xts","ui.backURL":"javascript:parent.destroyCModal();", "errURL":"javascript:parent.destroyCModal();","authoredDrillthru":sAuthoredDrillThroughContext}, 600, 425);
};

AuthoredDrillAction.prototype.populateContextMenu = function(rvDrillTargetsSpecification)
{
	var viewer = this.getCognosViewer();
	var toolbarCtrl = viewer.rvMainWnd.getToolbarControl();
	var authoredDrillDropDownMenu = null;
	if (typeof toolbarCtrl != "undefined" && toolbarCtrl != null)
	{
		var toolbarButton = toolbarCtrl.getItem("goto");
		if (toolbarButton)
		{
			authoredDrillDropDownMenu = toolbarButton.getMenu();
		}
	}

	var cognosViewerContextMenu = viewer.rvMainWnd.getContextMenu();
	var authoredDrillContextMenu = null;
	if (typeof cognosViewerContextMenu != "undefined" && cognosViewerContextMenu != null)
	{
		authoredDrillContextMenu = cognosViewerContextMenu.getGoToMenuItem().getMenu();
	}

	if(authoredDrillDropDownMenu != null || authoredDrillContextMenu != null)
	{
		var drillTargetSpecifications = this.getCognosViewer().getDrillTargets();
		var rvDrillTargetsNode = this.getAuthoredDrillThroughContext(rvDrillTargetsSpecification, drillTargetSpecifications);

		var drillTargets = rvDrillTargetsNode.childNodes;
		if(drillTargets.length > 0)
		{
			for(var index = 0; index < drillTargets.length; ++index)
			{
				var drillTarget = drillTargets[index];

				var sRequestString = getCognosViewerObjectRefAsString(this.getCognosViewer().getId()) + ".m_oDrillMgr.executeAuthoredDrill(\"" + encodeURIComponent(XMLBuilderSerializeNode(drillTarget)) + "\");";
				var sIconPath = this.getTargetReportIconPath(drillTarget);

				var sLabel = drillTarget.getAttribute("label");
				if(isViewerBidiEnabled()){
					var bidi = BidiUtils.getInstance();
					sLabel = bidi.btdInjectUCCIntoStr(sLabel, getViewerBaseTextDirection());
				}

				if (authoredDrillDropDownMenu != null)
				{
					new CMenuItem(authoredDrillDropDownMenu, sLabel, sRequestString, sIconPath, gMenuItemStyle, viewer.getWebContentRoot(), viewer.getSkin());
				}

				if (authoredDrillContextMenu != null)
				{
					new CMenuItem(authoredDrillContextMenu, sLabel, sRequestString, sIconPath, gMenuItemStyle, viewer.getWebContentRoot(), viewer.getSkin());
				}
			}
		}
	}

};

AuthoredDrillAction.prototype.buildSelectionChoicesNilSpecification = function()
{
	return "<selectChoices/>";
};

AuthoredDrillAction.prototype.buildSelectionChoicesSpecification = function(drillParameterNode)
{
	var sSelectionChoicesSpecification = "";

	var sValue = drillParameterNode.getAttribute("value");

	if(sValue != null)
	{
		var propToPass = drillParameterNode.getAttribute("propertyToPass");
		sSelectionChoicesSpecification += "<selectChoices";
		if (propToPass != null && propToPass != "")
		{
			sSelectionChoicesSpecification += " propertyToPass=\"";
			sSelectionChoicesSpecification += sXmlEncode(propToPass);
			sSelectionChoicesSpecification += "\"";
		}
		sSelectionChoicesSpecification += ">";
		
		// if RSVP already generated the selectChoices, grab everything AFTER the <selectChoices>
		if(sValue.indexOf("<selectChoices>") != -1)
		{
			sSelectionChoicesSpecification += sValue.substring(sValue.indexOf("<selectChoices>") + 15);
		}
		else if(sValue != "")
		{
			sSelectionChoicesSpecification += "<selectOption ";
			var sMun = drillParameterNode.getAttribute("mun");
			if(sMun != null && sMun != "")
			{
				var encodedMun = sXmlEncode(sMun);
				sSelectionChoicesSpecification += "useValue=\"";
				sSelectionChoicesSpecification += encodedMun;
				sSelectionChoicesSpecification += "\" ";

				sSelectionChoicesSpecification += "mun=\"";
				sSelectionChoicesSpecification += encodedMun;
				sSelectionChoicesSpecification += "\" ";

				sSelectionChoicesSpecification += "displayValue=\"";
				sSelectionChoicesSpecification += sXmlEncode(sValue);
				sSelectionChoicesSpecification += "\"";

			}
			else
			{
				sSelectionChoicesSpecification += "useValue=\"";
				sSelectionChoicesSpecification += sXmlEncode(sValue);
				sSelectionChoicesSpecification += "\" ";

				var sDisplayValue = drillParameterNode.getAttribute("displayValue");
				if(sDisplayValue == null || sDisplayValue == "")
				{
					sDisplayValue = sValue;
				}

				sSelectionChoicesSpecification += "displayValue=\"";
				sSelectionChoicesSpecification += sXmlEncode(sDisplayValue);
				sSelectionChoicesSpecification += "\"";
			}

			sSelectionChoicesSpecification += "/>";
			sSelectionChoicesSpecification += "</selectChoices>";
		}
	}

	return sSelectionChoicesSpecification;
};

AuthoredDrillAction.prototype.getPropertyToPass = function(parameterName, parameterProperties)
{
	if (parameterName != null && parameterName != "" && parameterProperties != null)
	{
		var parameterNodes = parameterProperties.childNodes;
		if (parameterNodes != null)
		{
			for(var index = 0; index < parameterNodes.length; ++index)
			{
				var parameterNode = parameterNodes[index];

				var sName = "";
				if (parameterNode.getAttribute("name") != null)
				{
					sName = parameterNode.getAttribute("name");
				}

				if (sName == parameterName)
				{
					return parameterNode.getAttribute("propertyToPass");
				}
			}
		}
	}

	return "";
};

AuthoredDrillAction.prototype.getTargetReportRequestString = function(drillTargetNode)
{
	var sRequestString = "";

	var sBookmarkRef = drillTargetNode.getAttribute("bookmarkRef");
	var sTargetPath = drillTargetNode.getAttribute("path");
	var sShowInNewWindow = drillTargetNode.getAttribute("showInNewWindow");

	if((sBookmarkRef != null && sBookmarkRef != "") && (sTargetPath == null || sTargetPath == ""))
	{
		sRequestString += "document.location=\"#";
		sRequestString += sBookmarkRef;
		sRequestString += "\";";
	}
	else
	{
		sRequestString += "doSingleDrill(";

		if(sShowInNewWindow == "true")
		{
			sRequestString += "\"_blank\",";
		}
		else
		{
			sRequestString += "\"\",";
		}

		sRequestString += "[[\"obj\",\"";
		sRequestString += encodeURIComponent(sTargetPath);
		sRequestString += "\"]";

		var drillParameterNodes = XMLHelper_FindChildrenByTagName(drillTargetNode, "drillParameter", false);
		for(var index = 0; index < drillParameterNodes.length; ++index)
		{
			var drillParameterNode = drillParameterNodes[index];
			var sValue = drillParameterNode.getAttribute("value");
			var sName = drillParameterNode.getAttribute("name");

			if(sValue != null && sValue != "")
			{
				sRequestString += ", [\"p_" + sName + "\",\"" + encodeURIComponent(this.buildSelectionChoicesSpecification(drillParameterNode)) + "\"]";
			}

			var sNil = drillParameterNode.getAttribute("nil");
			if(sNil != null && sNil != "")
			{
				sRequestString += "\", [\"p_" + sName + "\",\"" + encodeURIComponent(this.buildSelectionChoicesNilSpecification()) + "\"]";
			}
		}

		sRequestString += "],";

		var sMethod = drillTargetNode.getAttribute("method");
		sRequestString += "\"" + encodeURIComponent(sMethod) + "\",";

		var sOutputFormat = drillTargetNode.getAttribute("outputFormat");
		sRequestString += "\"" + encodeURIComponent(sOutputFormat) + "\",";

		var sOutputLocale = drillTargetNode.getAttribute("outputLocale");
		sRequestString += "\"" + encodeURIComponent(sOutputLocale) + "\",";

		sRequestString += "\"" + encodeURIComponent(sBookmarkRef) + "\",";

		var sSourceContext = XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(drillTargetNode, "parameters", false));
		sRequestString += "\"" + encodeURIComponent(sSourceContext) + "\",";

		var sObjectPaths = XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(drillTargetNode, "objectPaths", false));
		sRequestString += "\"" + encodeURIComponent(sObjectPaths) + "\",";

		sRequestString += "\"" + encodeURIComponent(this.getCognosViewer().getId()) + "\",";

		var sPrompt = drillTargetNode.getAttribute("prompt");
		sRequestString += "\"" + encodeURIComponent(sPrompt) + "\",";

		var dynamicDrill = drillTargetNode.getAttribute("dynamicDrill");
		sRequestString += " " + encodeURIComponent(dynamicDrill);

		sRequestString += ");";
	}

	return sRequestString;
};

AuthoredDrillAction.prototype.getTargetReportIconPath = function(drillTarget)
{
	var sIconPath = "";
	var sBookmarkRef = drillTarget.getAttribute("bookmarkRef");
	var drillParameterNode = XMLHelper_FindChildByTagName(drillTarget, "drillParameter", false);
	if((sBookmarkRef != null && sBookmarkRef != "") && drillParameterNode == null)
	{
		sIconPath = "/common/images/spacer.gif";
	}
	else
	{
		var sMethod = drillTarget.getAttribute("method");
		switch(sMethod)
		{
			case "editAnalysis":
				sIconPath = "/ps/portal/images/icon_ps_analysis.gif";
				break;
			case "editQuery":
				sIconPath = "/ps/portal/images/icon_qs_query.gif";
				break;
			case "execute":
				sIconPath = "/ps/portal/images/action_run.gif";
				break;
			case "view":
				var sOutputFormat = drillTarget.getAttribute("outputFormat");

				switch(sOutputFormat)
				{
					case "HTML":
					case "XHTML":
					case "HTMLFragment":
						sIconPath = "/ps/portal/images/icon_result_html.gif";
						break;
					case "PDF":
						sIconPath = "/ps/portal/images/icon_result_pdf.gif";
						break;
					case "XML":
						sIconPath = "/ps/portal/images/icon_result_xml.gif";
						break;
					case "CSV":
						sIconPath = "/ps/portal/images/icon_result_csv.gif";
						break;
					case "XLS":
						sIconPath = "/ps/portal/images/icon_result_excel.gif";
						break;
					case "SingleXLS":
						sIconPath = "/ps/portal/images/icon_result_excel_single.gif";
						break;
					case "XLWA":
						sIconPath = "/ps/portal/images/icon_result_excel_web_arch.gif";
						break;
					default:
						sIconPath = "/common/images/spacer.gif";
				}
				break;
			default:
				sIconPath = "/common/images/spacer.gif";
		}
	}

	return this.getCognosViewer().getWebContentRoot() + sIconPath;
};


AuthoredDrillAction.prototype.getAuthoredDrillThroughContext = function(sAuthoredDrillThroughTargets, drillTargetSpecifications)
{
	// validate the incoming arguments
	if(typeof sAuthoredDrillThroughTargets != "string" || typeof drillTargetSpecifications != "object")
	{
		return null;
	}

	// parse the xml string and validate it
	var xmlParsedDrillTargets = XMLBuilderLoadXMLFromString(sAuthoredDrillThroughTargets);
	if(xmlParsedDrillTargets == null || xmlParsedDrillTargets.firstChild == null)
	{
		return null;
	}

	// validate the root node
	var rootNode = XMLHelper_GetFirstChildElement( xmlParsedDrillTargets );
	if(XMLHelper_GetLocalName(rootNode) != "AuthoredDrillTargets")
	{
		return null;
	}

	// validate the rvDrillTargets node
	var rvDrillTargetNodes = XMLHelper_GetFirstChildElement( rootNode );
	if(XMLHelper_GetLocalName(rvDrillTargetNodes) != "rvDrillTargets")
	{
		return null;
	}

	// validate the drillTargets node
	var drillTargets = rvDrillTargetNodes.childNodes;
	if(drillTargets === null || drillTargets.length === 0)
	{
		return null;
	}

	var rvDrillTargetsElement = self.XMLBuilderCreateXMLDocument("rvDrillTargets");

	for(var drillTargetIdx = 0; drillTargetIdx < drillTargets.length; ++drillTargetIdx)
	{
		if(typeof drillTargets[drillTargetIdx].getAttribute == "undefined")
		{
			continue;
		}

		var drillTargetElement = rvDrillTargetsElement.createElement("drillTarget");
		rvDrillTargetsElement.documentElement.appendChild(drillTargetElement);

		var bookmarkRef = drillTargets[drillTargetIdx].getAttribute("bookmarkRef");
		if(bookmarkRef === null)
		{
			drillTargetElement.setAttribute("bookmarkRef", "");
		}
		else
		{
			drillTargetElement.setAttribute("bookmarkRef", bookmarkRef);
		}
		
		var bookmarkPage = drillTargets[drillTargetIdx].getAttribute("bookmarkPage");
		if(bookmarkPage === null)
		{
			drillTargetElement.setAttribute("bookmarkPage", "");
		}
		else
		{
			drillTargetElement.setAttribute("bookmarkPage", bookmarkPage);
		}

		var drillTargetRefIdx = drillTargets[drillTargetIdx].getAttribute("drillIdx");
		if(drillTargetRefIdx == null)
		{
			continue;
		}

		if(drillTargetRefIdx >= drillTargetSpecifications.length)
		{
			continue;
		}

		var drillTargetRef = drillTargetSpecifications[drillTargetRefIdx];
		if(typeof drillTargetRef != "object")
		{
			continue;
		}

		drillTargetElement.setAttribute("outputFormat", drillTargetRef.getOutputFormat());
		drillTargetElement.setAttribute("outputLocale", drillTargetRef.getOutputLocale());
		drillTargetElement.setAttribute("prompt", drillTargetRef.getPrompt());
		drillTargetElement.setAttribute("dynamicDrill", drillTargetRef.isDynamicDrillThrough() ? "true" : "false");

		var useLabel = drillTargets[drillTargetIdx].getAttribute("label");
		if(useLabel === null || useLabel === "")
		{
			useLabel = drillTargetRef.getLabel();
		}

		drillTargetElement.setAttribute("label", useLabel);
		drillTargetElement.setAttribute("path", drillTargetRef.getPath());
		drillTargetElement.setAttribute("showInNewWindow", drillTargetRef.getShowInNewWindow());

		drillTargetElement.setAttribute("method", drillTargetRef.getMethod());

		var currentRvDrillTargetNode = rvDrillTargetNodes;

		var oParameterProperties = "";
		var drillTargetParamProps = drillTargetRef.getParameterProperties();
		if (typeof drillTargetParamProps != "undefined" && drillTargetParamProps != null && drillTargetParamProps != "")
		{
			oParameterProperties = XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(drillTargetRef.getParameterProperties()));
		}

		while(currentRvDrillTargetNode)
		{
			var drillParameters = currentRvDrillTargetNode.childNodes[drillTargetIdx].childNodes;
			for(var drillParamIdx = 0; drillParamIdx < drillParameters.length; ++drillParamIdx)
			{
				var drillParameterElement = drillParameters[drillParamIdx].cloneNode(true);
				if (oParameterProperties)
				{
					var propertyToPass = this.getPropertyToPass(drillParameterElement.getAttribute("name"), oParameterProperties);
					if (propertyToPass != null && propertyToPass != "")
					{
						drillParameterElement.setAttribute("propertyToPass", propertyToPass);
					}
				}
				drillTargetElement.appendChild(drillParameterElement);
			}

			currentRvDrillTargetNode = currentRvDrillTargetNode.nextSibling;
		}

		var rootOpenTag = '<root xmlns:bus="http://developer.cognos.com/schemas/bibus/3/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
		var rootCloseTag = '</root>';

		var drillTargetParametersString = rootOpenTag + drillTargetRef.getParameters() + rootCloseTag;
		var drillTargetParametersXML = XMLBuilderLoadXMLFromString(drillTargetParametersString);

		var oChild = XMLHelper_GetFirstChildElement( XMLHelper_GetFirstChildElement( drillTargetParametersXML ) );
		if (oChild)
		{
			drillTargetElement.appendChild(oChild.cloneNode(true));
		}

		var drillTargetObjectPathsString = rootOpenTag + drillTargetRef.getObjectPaths() + rootCloseTag;
		var drillTargetObjectPathsXML = XMLBuilderLoadXMLFromString(drillTargetObjectPathsString);

		oChild = XMLHelper_GetFirstChildElement( XMLHelper_GetFirstChildElement( drillTargetObjectPathsXML ) );
		if (oChild)
		{
			drillTargetElement.appendChild(oChild.cloneNode(true));
		}

	}

	return XMLHelper_GetFirstChildElement(rvDrillTargetsElement);

};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ChangeDisplayTypeAction()
{
	this.m_requestParams = null;
	this.m_sAction = 'ChangeDataContainerType';
	this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES = 5;
}

//base class for change display type action
ChangeDisplayTypeAction.prototype = new ModifyReportAction();

ChangeDisplayTypeAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_CHANGE_DISPLAY;
};

ChangeDisplayTypeAction.prototype.setRequestParms = function(parms)
{
	this.m_requestParams = parms;
};

ChangeDisplayTypeAction.prototype.addActionContextAdditionalParms = function()
{
	this._cleaerPinAndFreeze();
	
	var bestVisualization = false;
	if (this.m_requestParams.bestVisualization) {
		bestVisualization = true;
	} else if (((this.m_requestParams.targetType.targetType == undefined) || 
			(this.m_requestParams.targetType.targetType == "undefined")) &&
			(this.m_requestParams.targetType.templateId == undefined))
	{
		var paramObject = eval("(" + this.m_requestParams.targetType + ")"); //from dialog.
	} else {
		var paramObject = this.m_requestParams.targetType; //from dialog.
	}	
	var canvas = this.m_oCV.getViewerWidget().findContainerDiv();
	var sWidgetSize = "";
	if (canvas) {
		sWidgetSize = "<widgetWidth>" + (parseInt(canvas.style.width, 10) -ResizeChartAction.PADDING.getWidth()) + "px</widgetWidth>" +
			"<widgetHeight>" + (parseInt(canvas.style.height, 10) - ResizeChartAction.PADDING.getHeight()) + "px</widgetHeight>";
	}

	var sActionContext = "";
	
	if (bestVisualization) {
		sActionContext += "<bestVisualization>true</bestVisualization>"
		sActionContext += this.getDataItemInfoMap();
	} else {
		sActionContext += "<target>"; 
		sActionContext += paramObject.targetType;
		sActionContext += "</target>";
		if (paramObject.templateId) {
			sActionContext += "<templateId>";
			sActionContext += ((paramObject.templateId)? paramObject.templateId : "");
			sActionContext += "</templateId>";
			sActionContext += "<variationId>"; 
			sActionContext += ((paramObject.variationId)? paramObject.variationId : "");
			sActionContext += "</variationId>";
			sActionContext += this.getDataItemInfoMap();
		}
		sActionContext += "<label>";
		sActionContext += paramObject.label;
		sActionContext += "</label>";
	}

	sActionContext += sWidgetSize;
	sActionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
	return (sActionContext);
};

ChangeDisplayTypeAction.prototype._cleaerPinAndFreeze = function() {
	var pinFreezeManager = this.m_oCV.getPinFreezeManager();
	if (pinFreezeManager) {
		var containerId = this.getContainerId(this.m_oCV.getSelectionController());
		pinFreezeManager.clearPinInfo(containerId);
	}	
};

ChangeDisplayTypeAction.prototype.updateMenu = function(jsonSpec)
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	jsonSpec.visible = (oRAPReportInfo) ? oRAPReportInfo.containsInteractiveDataContainer() : jsonSpec.visible; 
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	var reportInfo = this.getSelectedReportInfo();	
	jsonSpec.disabled = (reportInfo == null || reportInfo.displayTypeId == null || !this.isInteractiveDataContainer(reportInfo.displayTypeId));

	if (jsonSpec.disabled)
	{
		jsonSpec.iconClass = "chartTypesDisabled";
		return jsonSpec;
	}
	jsonSpec.iconClass = "chartTypes";	
	
	return this.buildDynamicMenuItem(jsonSpec, "ChangeDisplayType");

};

ChangeDisplayTypeAction.prototype.createEmptyMenuItem = function()
{
	return {name: "None", label: RV_RES.IDS_JS_CHANGE_DISPLAY_SELECT_DATA, iconClass: "", action: null, items: null };
};

ChangeDisplayTypeAction.prototype.getActionContextString = function(groupId)
{
	var actionContext = "<getInfoActions>";
	actionContext += "<getInfoAction name=\"GetInfo\">";
	actionContext += "<include><suggestedDisplayTypes/></include>";
	actionContext += this.getDataItemInfoMap();
	actionContext += "<groupId>";
	actionContext += groupId;
	actionContext += "</groupId>";
	actionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
	actionContext += "</getInfoAction>";
	actionContext += "</getInfoActions>";
	return actionContext;
};

ChangeDisplayTypeAction.prototype.fetchSuggestedDisplayTypes = function(groupId) 
{
	var oCV = this.getCognosViewer();
	var asynchRequest = new AsynchJSONDispatcherEntry(oCV);
	asynchRequest.addFormField("ui.action", "getInfoFromReportSpec");
	asynchRequest.addFormField("bux", "true");
	asynchRequest.addFormField("ui.object", oCV.envParams["ui.object"]);
	asynchRequest.addFormField("cv.actionContext", this.getActionContextString(groupId));
	asynchRequest.addDefinedFormField("ui.spec", oCV.envParams["ui.spec"]);
	asynchRequest.addNonEmptyStringFormField("modelPath", oCV.getModelPath());
	if (groupId == "undefined") {
		asynchRequest.setCallbacks({"complete" : {"object" : this, "method" : this.handleSuggestedDisplayTypesResponse}});
	} else {
		asynchRequest.setCallbacks({"complete" : {"object" : this, "method" : this.handleSuggestedDisplayVariationsResponse}});
	}
	oCV.dispatchRequest(asynchRequest);	

};

ChangeDisplayTypeAction.prototype.handleSuggestedDisplayTypesResponse = function(asynchJSONResponse)
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();

	this.addSuggestedDisplayTypesMenuItems(asynchJSONResponse.getResult());
};

ChangeDisplayTypeAction.prototype.addSuggestedDisplayTypesMenuItems = function (reportInfos)
{
	var buttonSpec = this.getCognosViewer().findToolbarItem("ChangeDisplayType");
	if (buttonSpec) {
		buttonSpec.open = false;
	}
	
	var menuItems = [];
	var reportInfo = this.getSelectedReportInfo();
	var container = undefined;
	for (var x=0; x < reportInfos.containers.length; x++)
	{
		if (reportInfo.container == reportInfos.containers[x].container)
		{
			container = reportInfos.containers[x];
			break;
		}
	}
	if (container == undefined)
	{
		return;
	}
	var nbrToDisplay = container.suggestedDisplayTypes.length <= this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES ? container.suggestedDisplayTypes.length : this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES;
	menuItems.push({title: RV_RES.IDS_JS_CHANGE_DISPLAY_RECOMMENDED});
	menuItems.push({separator: true});
	for (var i=0; i < nbrToDisplay; i++)
	{
		menuItems.push({ name: container.suggestedDisplayTypes[i].name, label: container.suggestedDisplayTypes[i].title, description: container.suggestedDisplayTypes[i].description, iconClass: container.suggestedDisplayTypes[i].iconClass, action: { name: "ChangeDisplayType", payload: {targetType: {templateId: container.suggestedDisplayTypes[i].templateId }, label: container.suggestedDisplayTypes[i].title}}, items: null });
	}
	menuItems.push({separator: true});
	menuItems.push({ name: "ChangeDisplayMore", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE, iconClass: "ChartTypeOther", action: { name: "InvokeChangeDisplayTypeDialog", payload: {}}, items: null });

	buttonSpec.open = true;
	buttonSpec.items = menuItems;

	var updateItems = [];
	updateItems.push(buttonSpec);
	this.getCognosViewer().getViewerWidget().fireEvent("com.ibm.bux.widgetchrome.toolbar.update", null, updateItems);

	return menuItems;
};

ChangeDisplayTypeAction.prototype.buildMenu = function(jsonSpec)
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	jsonSpec.visible = (oRAPReportInfo) ? oRAPReportInfo.containsInteractiveDataContainer() : jsonSpec.visible; 
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	var reportInfo = this.getSelectedReportInfo();	
	jsonSpec.disabled = (reportInfo == null || reportInfo.displayTypeId == null || !this.isInteractiveDataContainer(reportInfo.displayTypeId));
		
	if (jsonSpec.disabled)
	{
		jsonSpec.iconClass = "chartTypesDisabled";
	}
	else
	{
		jsonSpec.iconClass = "chartTypes";
		
		var enableVisCoach = this.getCognosViewer().getAdvancedServerProperty("VIEWER_JS_enableVisCoach");
		if (enableVisCoach !== 'false' && (typeof reportInfo.suggestedDisplayTypesEnabled != "undefined") && (reportInfo.suggestedDisplayTypesEnabled != null) && (reportInfo.suggestedDisplayTypesEnabled == "true"))
		{
			//toolbar menu, so generate the dynamic menu
			this.fetchSuggestedDisplayTypes("undefined");
			return this.buildDynamicMenuItem(jsonSpec, "ChangeDisplayType");
		}
		else
		{
			jsonSpec.items = [];
			var isV2 = (reportInfo.displayTypeId.match("v2_") != null || reportInfo.displayTypeId == "crosstab" || reportInfo.displayTypeId == "list");
			if(isV2)
			{
				jsonSpec.items.push({ name: "ChangeDisplayBar", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_BAR, iconClass: "ChartTypeBar", action: { name: "ChangeDisplayType", payload: {targetType: "v2_bar_rectangle_clustered" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayColumn", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_COLUMN, iconClass: "ChartTypeColumn", action: { name: "ChangeDisplayType", payload: {targetType: "v2_column_rectangle_clustered" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayLine", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LINE, iconClass: "ChartTypeLine", action: { name: "ChangeDisplayType", payload: {targetType: "v2_line_clustered_markers" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayPie", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_PIE, iconClass: "ChartTypePie", action: { name: "ChangeDisplayType", payload: {targetType: "v2_pie" }}, items: null });

				jsonSpec.items.push({ name: "ChangeDisplayCrosstab", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_CROSSTAB, iconClass: "ChartTypeCrosstab", action: { name: "ChangeDisplayType", payload: {targetType: "Crosstab" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayList", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LIST, iconClass: "ChartTypeList", action: { name: "ChangeDisplayType", payload: {targetType: "List" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayMore", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE, iconClass: "ChartTypeOther", action: { name: "InvokeChangeDisplayTypeDialog", payload: "" }, items: null });
			}
			else
			{
				jsonSpec.items.push({ name: "ChangeDisplayBar", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_BAR, iconClass: "ChartTypeBar", action: { name: "ChangeDisplayType", payload: {targetType: "bar_clustered_flat" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayColumn", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_COLUMN, iconClass: "ChartTypeColumn", action: { name: "ChangeDisplayType", payload: {targetType: "column_clustered_flat" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayLine", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LINE, iconClass: "ChartTypeLine", action: { name: "ChangeDisplayType", payload: {targetType: "line_clustered_flat_markers" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayPie", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_PIE, iconClass: "ChartTypePie", action: { name: "ChangeDisplayType", payload: {targetType: "pie_flat" }}, items: null });

				jsonSpec.items.push({ name: "ChangeDisplayCrosstab", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_CROSSTAB, iconClass: "ChartTypeCrosstab", action: { name: "ChangeDisplayType", payload: {targetType: "Crosstab" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayList", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LIST, iconClass: "ChartTypeList", action: { name: "ChangeDisplayType", payload: {targetType: "List" }}, items: null });
				jsonSpec.items.push({ name: "ChangeDisplayMore", label: RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE, iconClass: "ChartTypeOther", action: { name: "InvokeChangeDisplayTypeDialog", payload: "" }, items: null });
			}
		}
		for (var i in jsonSpec.items)
		{
			jsonSpec.items[i].action.payload = { targetType: jsonSpec.items[i].action.payload };
			jsonSpec.items[i].action.payload.targetType.label = jsonSpec.items[i].label;
		}
	}

	return jsonSpec;
};

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ChangeDisplayVariationsAction(){}

ChangeDisplayVariationsAction.prototype = new CognosViewerAction();

function ChangeDisplayVariationsAction()
{
	this.m_requestParams = null;
}

ChangeDisplayVariationsAction.prototype.setRequestParms = function(parms)
{
	this.m_requestParams = parms;
};


ChangeDisplayVariationsAction.prototype.execute = function() {
	var groupId = this.m_requestParams.groupId; //from dialog.
	var viewer = this.getCognosViewer();
	var selectedObject = this.getSelectedReportInfo();
	if(selectedObject)
	{
		var viewerWidget = viewer.getViewerWidget();
		if (typeof selectedObject.suggestedDisplayVariations == "undefined")
		{
			var asynchRequest = new AsynchJSONDispatcherEntry(this.m_oCV);
			asynchRequest.setCallbacks({
				"complete": {"object": this, "method": this.handleResponse}
				});
			asynchRequest.setRequestIndicator(viewer.getRequestIndicator());
			
			asynchRequest.addFormField("ui.action", "getInfoFromReportSpec");
			asynchRequest.addFormField("bux", "true");
			
			asynchRequest.addNonEmptyStringFormField("modelPath", this.m_oCV.getModelPath());
			asynchRequest.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);
			asynchRequest.addDefinedFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
			asynchRequest.addFormField("cv.actionContext", this.addActionContext(groupId));

			viewer.dispatchRequest(asynchRequest);
		}
		else
		{
			viewerWidget.updateDisplayTypeDialogVariations(selectedObject.possibleDisplayTypes,selectedObject.suggestedDisplayVariations );
		}
	}

};

ChangeDisplayVariationsAction.prototype.handleResponse = function(asynchJSONResponse)
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();

	var reportInfos = asynchJSONResponse.getResult();
	for ( var i in reportInfos.containers)
	{
		var selectedReportInfo = this.getReportInfo(reportInfos.containers[i].container);
		selectedReportInfo.possibleDisplayTypes = reportInfos.containers[i].possibleDisplayTypes;
		selectedReportInfo.variationGroups = reportInfos.containers[i].variationGroups;
	}
	var selectedObject = this.getSelectedReportInfo();
	viewerWidget.updateDisplayTypeDialogVariations(selectedObject.possibleDisplayTypes,selectedObject.variationGroups);
};

ChangeDisplayVariationsAction.prototype.addActionContext = function(groupId)
{
	var actionContext = "<getInfoActions>";
	actionContext += "<getInfoAction name=\"GetInfo\">";
	actionContext += "<include><suggestedDisplayVariations/></include>";
	actionContext += this.getDataItemInfoMap();;
	actionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
	actionContext += "<groupId>";
	actionContext += groupId;
	actionContext += "</groupId>";
	actionContext += "</getInfoAction>";
	actionContext += "</getInfoActions>";
	return actionContext;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 function ChangePaletteAction()
{
	this.m_sAction = "ChangePalette";
	this.m_palette = "";
	this.m_runReport = true;

	this.m_aPaletteNames =  ["Flow", "Classic", "Contemporary",
					 "Contrast", "Corporate", "Dynamic",
					 "Excel", "Excel 2007", "Gradients",
					 "Grey Scale", "Jazz", "Legacy",
					 "Metro", "Mixed", "Modern",
					 "Patterns"];
	this.m_aPaletteIcons =  ["changePaletteFlow", "changePaletteClassic", "changePaletteContemporary",
					 "changePaletteContrast", "changePaletteCorporate", "changePaletteDynamic",
					 "changePaletteExcel", "changePaletteExcel2007", "changePaletteGradients",
					 "changePaletteGreyScale", "changePaletteJazz", "changePaletteLegacy",
					 "changePaletteMetro", "changePaletteMixed", "changePaletteModern",
					 "changePalettePatterns"];
}

ChangePaletteAction.prototype = new ModifyReportAction();
ChangePaletteAction.baseclass = ModifyReportAction.prototype;
ChangePaletteAction.prototype.reuseQuery = function() { return true; };

ChangePaletteAction.prototype.preProcess = function()
{
	// check to see if the report only contains flash charts, if so, we don't need to hit the report service, we can change the palette locally
	this.updateRunReport();
	if (this.m_runReport==false) {
		var flashCharts = this.getLayoutComponents();
		for(var index = 0; index < flashCharts.length; ++index)
		{
			var flashChart = flashCharts[index];
			if(flashChart.getAttribute("flashChart") != null)
			{
				if(this.m_palette == "")
				{
					flashChart.setPalette("Flow");
				}
				else
				{
					flashChart.setPalette(this.m_palette);
				}
			}
		}
	}
};

ChangePaletteAction.prototype.updateRunReport = function()
{
	this.m_runReport=true;
	var reportTable = document.getElementById("rt" + this.m_oCV.getId());
	if(reportTable != null)	{
		var serverSideCharts = getElementsByAttribute(reportTable, "*", "chartcontainer", "true");
		if(serverSideCharts.length == 0) {
			this.m_runReport=false;
		}
	}
};

ChangePaletteAction.prototype.runReport = function()
{
	return this.m_runReport;
};

ChangePaletteAction.prototype.updateInfoBar = function()
{
	return false;
};

ChangePaletteAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_CHANGE_PALETTE;
};

ChangePaletteAction.prototype.setRequestParms = function(palette)
{
	if(typeof palette == "string")
	{
		this.m_palette = palette;
		// Preserve the information on the selected palette in CCognosViewer object for latter retrieval
		// and use in ChangePaletteAction.prototype.updateMenu().
		if (this.m_oCV != null && typeof this.m_oCV != "undefined")
		{
			this.m_oCV.m_sPalette = palette;
		}
	}
};

ChangePaletteAction.prototype.addActionContextAdditionalParms = function()
{
	if(this.m_palette != "")
	{
		return "<name>" + this.m_palette + "</name>";
	}

	return "";
};


ChangePaletteAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	var reportInfo = this.getSelectedReportInfo();

	if (reportInfo != null && reportInfo.displayTypeId.indexOf("Chart") >= 0)
	{
		jsonSpec.disabled = false;
		return jsonSpec;
	}

	jsonSpec.disabled = true;
	return jsonSpec;
};

ChangePaletteAction.reset = function( oCV )
{
	delete (oCV.m_sPalette);
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function DragDropAction()
{
	this.m_source = null;
	this.m_target = null;
	this.m_insertBefore = false;
	this.m_sAction = "Reorder";
}

DragDropAction.prototype = new ModifyReportAction();

DragDropAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_MOVE;
};

DragDropAction.prototype.getOffsetCoords = function(startAt)
{
	var rtTable = document.getElementById("rt" + this.getCognosViewer().getId());
	var offsetParent = startAt;
	var topCoord = 0;
	var leftCoord = 0;
	while(offsetParent != rtTable)
	{
		topCoord += offsetParent.offsetTop;
		leftCoord += offsetParent.offsetLeft;
		offsetParent = offsetParent.offsetParent;
	}

	return { left: leftCoord, top: topCoord };
};

DragDropAction.prototype.showDragDropCaret = function(evt, cell, parentTable)
{
	var dragDropCaret = document.getElementById("VDDC" + this.getCognosViewer().getId());
	if(dragDropCaret == null)
	{
		dragDropCaret = document.createElement("span");
		dragDropCaret.setAttribute("id", "VDDC" + this.getCognosViewer().getId());
		dragDropCaret.className = "dropCaret";

		if(dragDropCaret.attachEvent)
		{
			dragDropCaret.attachEvent("onmousemove", stopEventBubble);
		}
		else
		{
			dragDropCaret.addEventListener("mousemove", stopEventBubble, false);
		}

		dragDropCaret.style.width = "8px";

		dragDropCaret.innerHTML = "<img style=\"margin:1px;width:2px;height:100%;\" src=\"" + this.getCognosViewer().getWebContentRoot() + "/rv/images/drop_caret.gif\"/>";

		parentTable.appendChild(dragDropCaret);
	}

	var offsetCoords = this.getOffsetCoords(parentTable);
	dragDropCaret.style.top = (offsetCoords.top - 1) + "px";

	var eventXCoord;
	if(typeof evt.offsetX == "undefined") {
		eventXCoord = evt.layerX;
	} else {
		offsetCoords = this.getOffsetCoords(evt.srcElement);
		eventXCoord = evt.offsetX + offsetCoords.left;
	}

	offsetCoords = this.getOffsetCoords(cell);
	var halfWayPoint = offsetCoords.left + (cell.clientWidth / 2);
	this.m_insertBefore = (eventXCoord < halfWayPoint);

	dragDropCaret.style.height = parentTable.clientHeight + "px";


	if(this.m_insertBefore == false)
	{
		dragDropCaret.style.left = (offsetCoords.left + cell.clientWidth + 1) + "px";
	}
	else
	{
		dragDropCaret.style.left = offsetCoords.left + "px";
	}

	dragDropCaret.style.display = "inline";
};

DragDropAction.prototype.showDragDropIndicators = function(evt)
{
	if(this.m_target != null)
	{
		var cell = this.m_target.getCellRef();
		var parentTable = cell;
		while(parentTable.getAttribute("lid") == null)
		{
			parentTable = parentTable.parentNode;
		}

		this.showDragDropCaret(evt, cell, parentTable);
	}
};

DragDropAction.prototype.showDragDropToolTip = function(evt)
{
	var imageRef = "";
	if(this.canDrop() == true)
	{
		imageRef = "/rv/images/cursor_move.gif";
	}
	else
	{
		imageRef = "/rv/images/cursor_nodrop.gif";
	}

	this.showCustomCursor(evt, "viewerTooltipSpan", imageRef);
};

DragDropAction.prototype.canMove = function()
{
	if (this.m_oCV.isBlacklisted("Move")) {
		return false;
	}
	
	var selectionController = this.getCognosViewer().getSelectionController();
	this.m_source = selectionController.getAllSelectedObjects();

	if(this.m_source != null && this.m_source.length > 0)
	{
		if(typeof this.m_source[0].m_dataContainerType != "undefined" && this.m_source[0].m_dataContainerType == "list" && this.m_source[0].getLayoutType() != "summary")
		{
			return true;
		}
	}

	return false;
};

DragDropAction.prototype.onDrag = function(evt)
{
	clearTextSelection();

	var sourceNode = getNodeFromEvent(evt);
	var selectionController = this.getCognosViewer().getSelectionController();
	this.m_target = selectionController.buildSelectionObject(sourceNode, evt);

	this.showDragDropToolTip(evt);

	if(this.canDrop())
	{
		this.showDragDropIndicators(evt);
	}
	else
	{
		this.hideDropIndicators();
	}
};

DragDropAction.prototype.hideDropIndicators = function()
{
	var dragDropIndicator = document.getElementById("VDDC" + this.getCognosViewer().getId());
	if(dragDropIndicator != null)
	{
		dragDropIndicator.style.display = "none";
	}
};

DragDropAction.prototype.onMouseDown = function(evt)
{
	if(this.canMove())
	{
		window.oCVDragDropObject = { action:this, x:evt.clientX, y:evt.clientY, dragging:false };
	}
};

DragDropAction.prototype.canDrop = function()
{
	return this.m_target != null && this.m_source != null && this.m_target.getLayoutType() != "summary" && (this.m_target.getLayoutElementId() == this.m_source[0].getLayoutElementId());
};

DragDropAction.prototype.onDrop = function(evt)
{
	this.hideCustomCursor("viewerTooltipSpan");
	this.hideDropIndicators();

	if(this.canDrop(evt)) {
		//Determine if the user's drop results in a change in column
		//order. A user can change column order in one or more of
		//three ways:
		//1.	Drag one or more columns to a new destination.
		//2.	Select multiple columns which are not next to each
		//		other - so wherever they are dropped, at least one
		//		will change position.
		//3.	Select multiple columns in a new order - so wherever
		//		they are dropped, the selected columns will be in a
		//		new configuration relative to each other.
		//A reorder occurs iff one or more of these conditions are
		//met. If no reorder occurs, don't make a server request.

		var executeDrop = true;

		//Determine if the selected columns are all next to each
		//other and in the original order.
		var column;
		var first = parseInt(this.m_source[0].getColumnRef(), 10);
		var last = first;
		var consecutiveColumns = true;

		for(var index = 0; index < this.m_source.length; ++index) {
			column = parseInt(this.m_source[index].getColumnRef(), 10);
			if(index > 0 && column !== last + 1) {
				consecutiveColumns = false;
				break;
			}
			last = column;
		}

		if(consecutiveColumns) {
			//Determine if the columns are being moved to a new location
			var destination = parseInt(this.m_target.getColumnRef(), 10);
			destination += this.m_insertBefore ? 0 : 1;
			if (destination >= first && destination <= last + 1) {
				//None of the three ways to move a column is satisfied -
				//don't execute the drop action.
				executeDrop = false;
			}
		}

		if(executeDrop) {
			this.execute();
		}
	}
};

DragDropAction.prototype.addActionContextAdditionalParms = function()
{
	var tag = this.m_insertBefore == true ? "before" : "after";


	//always use layout tag when it is available.
	var cellRef = this.m_target.getCellRef();
	var tagValue = this.getRAPLayoutTag(cellRef);
	tagValue = (tagValue != null ) ? tagValue : this.m_target.getColumnName();

	return this.getSelectedCellTags() + "<" + tag + ">" + xml_encode(tagValue)  + "</" + tag + ">";
};

function DragDropAction_isDragging(evt)
{
	var oCVDDO = window.oCVDragDropObject;
	if(oCVDDO)
	{
		var currentX = evt.clientX;
		var currentY = evt.clientY;
		var originalX = oCVDDO.x;
		var originalY = oCVDDO.y;

		if((currentX >= (originalX+2)) || (currentX <= (originalX-2)) || (currentY >= (originalY+2)) || (currentY <= (originalY-2)))
		{
			oCVDDO.dragging = true;
		}

		return oCVDDO.dragging;
	}

	return false;
}

function DragDropAction_onmouseup(evt)
{
	if(DragDropAction_isDragging(evt))
	{
		window.oCVDragDropObject.action.onDrop(evt);
	}

	window.oCVDragDropObject = null;
}

function DragDropAction_onmousemove(evt)
{
	if(DragDropAction_isDragging(evt))
	{
		window.oCVDragDropObject.action.onDrag(evt);
	}
}
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function DrillAction() {
	this.m_bUseReportInfoSelection = false; //default is false
	this.m_aDrillSelectedObjects = []; //local array to store selected objects
	this.m_useMARequest = false; //flag to enable action arguments block for use ma instead V5 request for getting child/parent information
	this.m_userSelectedDrillItem = null;	
}
DrillAction.prototype = new ModifyReportAction();

DrillAction.prototype.getHoverClassName = function() { return ""; };

/**
 * Only set when the user has picked a specific entry off of the drill down or up subMenu
 */
DrillAction.prototype.setRequestParms = function(parms) {
	if (parms) {
		this.m_userSelectedDrillItem = parms.userSelectedDrillItem;
	}
};


DrillAction.prototype.setKeepFocusOnWidget = function(keepFocus)
{
	this.m_bKeepFocusOnWidget = keepFocus;
};

DrillAction.prototype.keepFocusOnWidget = function()
{
	if (typeof this.m_bKeepFocusOnWidget != "undefined")
	{
		return this.m_bKeepFocusOnWidget;
	}

	return true;
};

DrillAction.prototype.getDrillabilityForItemFromReportInfo = function(itemName)
{
	if( !this.m_oCV )
	{
		return null;
	}

	var reportInfo = this.m_oCV.getRAPReportInfo();
	if(!reportInfo)
	{
		return null;
	}

	var containers = reportInfo.getContainers();
	for( var container in containers )
	{
		var drillability = reportInfo.getDrillability(container);
		if( drillability[itemName])
		{
			return drillability[itemName];
		}
	}
	return null;

};

DrillAction.prototype.onDoubleClick = function(evt)
{
	this.execute();
};

DrillAction.prototype.preProcess = function()
{
	//should only have drill spec if handling a synchronize drill event - in which
	//case we don't want to fire drill event again
	if( typeof this.m_drillSpec === "undefined" || this.m_drillSpec === null )
	{
		var aDrillSpecObjects = this.generateDrillSpecObjects();
		if (!aDrillSpecObjects) {
			return null;
		}

		var oCognosViewer = this.getCognosViewer();
		var oViewerWidget = oCognosViewer.getViewerWidget();

		if (oViewerWidget) {
			var sModelPath =  oCognosViewer.getModelPath();
			oViewerWidget.getWidgetContextManager().raiseDrillEvent(aDrillSpecObjects, this.m_sAction, sModelPath);
		}
	}
};


/*
 * returns array of Drill spec object
 *
 * drill spec object has following properties
 *
		oDrillSpecObject = {
				"dataItem": "",
				"mun":  "",
				"lun":  "",
				"hun": "",
				"displayValue": "",
				"summary": "" //optional
		};
 */
DrillAction.prototype.generateDrillSpecObjects = function()
{
	try
	{
		var aDrillSpecObjects = [];
		var oCV = this.getCognosViewer();
		var drillMgr = oCV.getDrillMgr();
		var selectionController = oCV.getSelectionController();

		var bIsSyncDrill = true;
		var aDrillParams = drillMgr.getDrillParameters(this.m_drillOption, true, bIsSyncDrill, this.m_userSelectedDrillItem );
		if (aDrillParams.length === 0) {
			return null;
		}
		var oSelectedObject = drillMgr.getSelectedObject();

		if (aDrillParams.length > 3*4 && (oSelectedObject.getDataContainerType() == "crosstab" || oSelectedObject.getLayoutType() == "chartElement" )) {
			//In drillParams, which is a flat array, each context id corresponds to 4 entries (value, mun, lun, hun).
			//For crosstab and chart, the fourth ctx id and beyond are from master-detail links,
			//need to remove them to avoid synced-drilling on them.
			aDrillParams.length = 3 * 4;
		}

		var aContextIds = drillMgr.getSelectedObject().getSelectedContextIds();
		for (var i=0, drillGroupIndex = 0; drillGroupIndex < aContextIds.length && i <aDrillParams.length; ++drillGroupIndex) {
			
			var ctxValue = aContextIds[drillGroupIndex][0];
			
			var sDataItem = selectionController.getRefDataItem(ctxValue);
			var sMUN = selectionController.getMun(ctxValue);
			var sDisplayValue = selectionController.getDisplayValue(ctxValue);
			
			//Exclude the member that cannot be drilled on from the drill spec. 
			if( selectionController.getDrillFlagForMember( ctxValue ) === 0 ){
				i = i + 4; //skip over the entries for the excluded member
				continue; 
			}
			
			var oDrillSpecObject = {
					"dataItem": aDrillParams[i++],
					"mun": aDrillParams[i++],
					"lun": aDrillParams[i++],
					"hun": aDrillParams[i++]
			};


			//insert the display values.
			if (sDataItem != "" && sDisplayValue != "") {
				if (oDrillSpecObject.dataItem === sDataItem) {
					oDrillSpecObject.displayValue = sDisplayValue;
				}
			}

			var sUsageValue = selectionController.getUsageInfo(ctxValue);
			oDrillSpecObject.isMeasure = (sUsageValue === '2')? "true" : "false";

			//insert if drilling on summary
			var drillSummary = false;
			if (sMUN != "" && sUsageValue != '2') {
				var drillabilityObj = this.getDrillabilityForItemFromReportInfo(sDataItem);
				if ((drillabilityObj != null && drillabilityObj.disableDown == true) || this.m_oCV.getSelectionController().getDrillFlagForMember(ctxValue) == 1) {
					drillSummary = true;
				}
			}
			if (drillSummary) {
				if (oDrillSpecObject.dataItem === sDataItem) {
					oDrillSpecObject.summary = "true";
				}
			}

			aDrillSpecObjects.push(oDrillSpecObject);
		}

		return (aDrillSpecObjects.length>0)? aDrillSpecObjects : null;
	} catch( e )
	{
		return null;
	}
};

/*
 * This function parses the drill spec and creates a selected object
 * based on the spec.
 * Returns false if an exception occurs, true otherwise
 */
DrillAction.prototype.parseDrillSpec = function( evt )
{
	try
	{
		var oCV = this.getCognosViewer();
		if( oCV.getStatus() !== 'complete' || oCV.getConversation() === "")
		{
			return false;
		}

		this.m_drillSpec = evt.payload.drillSpec;
		var xmlDom = XMLBuilderLoadXMLFromString(this.m_drillSpec);
		var drillParametersNode = xmlDom.firstChild;
		var selectionController = getCognosViewerSCObjectRef(oCV.getId());
		selectionController.m_aSelectedObjects = []; //do we need to do this?

		// For some testcases (please see COGCQ00245956), especially for charts, the selected chart area is not cleaned-up properly
		// and the object of the old selection is hanging around creating strange behaviour.
		// So, clear the selection chart area if an old one is hanging around. Here is the only place to do this.
		if (selectionController.hasSelectedChartNodes())
		{
			selectionController.clearSelectionData();
		}

		var aDrillGroups = XMLHelper_FindChildrenByTagName(drillParametersNode, "DrillGroup", false);
		for(var iDrillGroupIndex = 0; iDrillGroupIndex < aDrillGroups.length; ++iDrillGroupIndex)
		{
			var munNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "MUN", false);

			var sMun = XMLHelper_GetText(munNode);
			var sLun = "";
			var sHun = "";
			var sDisplayValue = "";
			var sSummary = "";

			var displayValueNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "DisplayValue", false);
			if(displayValueNode != null)
			{
				sDisplayValue = XMLHelper_GetText(displayValueNode);
			}
			var lunNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "LUN", false);
			if(lunNode != null)
			{
				sLun = XMLHelper_GetText(lunNode);
			}

			var hunNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "HUN", false);
			if(hunNode != null)
			{
				sHun = XMLHelper_GetText(hunNode);
			}

			var summaryNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "Summary", false);
			if(summaryNode != null)
			{
				sSummary = XMLHelper_GetText(summaryNode);
			}

			this.selectObject(sMun, sLun, sHun, sDisplayValue, sSummary, selectionController );
		}
	}
	catch( e )
	{
		return false;
	}

	return( selectionController.m_aSelectedObjects.length > 0 );
};

DrillAction.prototype.parseDrillSpecObjects = function( aDrillSpecObjects )
{

	if (this.useReportInfoSelection()) {
		return this.parseDrillSpecObjectsWithReportInfo(aDrillSpecObjects);
	}

	try
	{
		var oCV = this.getCognosViewer();
		if( oCV.getStatus() !== 'complete' || oCV.getConversation() === "")
		{
			return false;
		}

		this.m_drillSpec = "";

		var selectionController = getCognosViewerSCObjectRef(oCV.getId());
		selectionController.m_aSelectedObjects = []; //do we need to do this?

		// For some testcases (please see COGCQ00245956), especially for charts, the selected chart area is not cleaned-up properly
		// and the object of the old selection is hanging around creating strange behaviour.
		// So, clear the selection chart area if an old one is hanging around. Here is the only place to do this.
		if (selectionController.hasSelectedChartNodes())
		{
			selectionController.clearSelectionData();
		}

		for(var i in aDrillSpecObjects)
		{
			var oSpec = aDrillSpecObjects[i];
			var sSummary = (oSpec.summary)? oSpec.summary :"";
			//For sync drill, drill flags are ignored so that we can sychronized dataItemDimensionalEdgeSummary
			var bIsSyncDrill = true;
			this.selectObject(oSpec.mun, oSpec.lun, oSpec.hun, oSpec.displayValue, sSummary, selectionController, bIsSyncDrill );
		}
	}
	catch( e )
	{
		return false;
	}

	return( selectionController.m_aSelectedObjects.length > 0 );
};

DrillAction.prototype.getDrillabilityForCtxValue = function(sCtxId){
	if (console && console.log) {
		console.log("Required method, getDrillabilityForCtxValue, not implemented.");
	}
};

DrillAction.prototype.setDrillabilityForSelectObject = function(sCtxId){

	this.drillability = this.getDrillabilityForCtxValue( sCtxId );
};

DrillAction.prototype.canDrillDown = function(){
	if (console && console.log) {
		console.log("Required method, canDrillDown, not implemented.");
	}
};

DrillAction.prototype.canDrilUp = function(){
	if (console && console.log) {
		console.log("Required method, canDrilUp, not implemented.");
	}
};

DrillAction.prototype.selectObject = function(sMun, sLun, sHun, sDisplayValue, sOnSummary, selectionController, bIsSyncDrill )
{
	var sActualHun = sHun;
	var sActualLun = sLun;
	var sActualMun = sMun;

	var bIgnoreDrillFlag = false;
	
	var sCtxId = selectionController.getCtxIdFromMun(sMun);
	var sCtxIdByMun = sCtxId;
	if(sCtxId === "")
	{
		var oActualLunAndHun = selectionController.replaceNamespaceForSharedTM1DimensionOnly(sLun, sHun, sMun);
		sActualLun = oActualLunAndHun.lun;
		sActualHun = oActualLunAndHun.hun;
		if(sActualHun !== sHun){//The HUN has been udpated with the new namespace for TM1 shared dimension
			sActualMun = this._replaceNamespace(sMun, sActualHun);//Replace MUN with the new namespace for TM1 shared dimension
		}
		//set bIgnoreDrillFlag to true if this is sync drill and you're getting ctxId from metadata.  This is to allow for sync of dataItemDimensionalEdgeSummary.
		bIgnoreDrillFlag = ( bIsSyncDrill == true ); 
		sCtxId = selectionController.getCtxIdFromMetaData(sActualLun, sActualHun, bIgnoreDrillFlag);
		if( sCtxId === "" )
		{
			return false;
		}
	}
	
	this.setDrillabilityForSelectObject(sCtxId);
	
	if((bIgnoreDrillFlag == true) || (this.m_sAction == "DrillDown" && this.canDrillDown()) || (this.m_sAction == "DrillUp" && this.canDrillUp() ) )
	{
		var beforeNumber = selectionController.getSelections().length;
		selectionController.selectObject( sActualMun, sActualLun, sActualHun, bIgnoreDrillFlag );
		var selectionObjects = selectionController.getSelections();

		if (sCtxIdByMun === "" && selectionObjects.length > beforeNumber) {
			var aMuns = selectionObjects[selectionObjects.length -1].m_aMuns;
			aMuns[aMuns.length] = [];
			aMuns[aMuns.length-1].push(sActualMun);
			var aDisplayValues = selectionObjects[selectionObjects.length -1].m_aDisplayValues;
			aDisplayValues.push(sDisplayValue);
			selectionObjects[selectionObjects.length -1].useDisplayValueFromObject = true;
		}
		if (sOnSummary == "true") {
			selectionObjects = selectionController.getSelections();
			selectionObjects[selectionObjects.length-1].onSummary = true;
		}
	}
};


DrillAction.prototype._replaceNamespace = function(mun, sActualHun) {
	var sResult = null;
	if(sActualHun){
		var sNamespace = sActualHun.substr(0, sActualHun.indexOf("].[") + 1);
		if(mun && sNamespace && !(mun.match("^" + sNamespace))){
			var iFirstDotPos = mun.indexOf("].[");
			sResult = sNamespace + mun.substr(iFirstDotPos + 1, mun.length);
		}
	}

	return sResult || mun;
};


DrillAction.prototype.addActionContextAdditionalParms = function()
{
	var params = "";

	var selectionObjects = (this.useReportInfoSelection())? this.m_aDrillSelectedObjects : this.getCognosViewer().getSelectionController().getSelections();
	var sItem = null;
	for (var i = 0; i < selectionObjects.length; ++i)
	{
		if (selectionObjects[i].onSummary)
		{
			sItem = (this.useReportInfoSelection())? selectionObjects[i].item :
						selectionObjects[i].getDataItems()[0][0]; //expect only one because this is passed down from drill event.

			params += "<dataItem>" + xml_encode(sItem) + "</dataItem>";
		}
	}

	if (params != "") {
		params = "<onSummary>" + params + "</onSummary>";
	}

	if (this.m_userSelectedDrillItem) {
		params += ("<userSelectedDrillItem>" + this.m_userSelectedDrillItem + "</userSelectedDrillItem>");
	}
	//following flags to make drill performance optimisation with switching V5 to MA for some requests
	if (this.m_useMARequest === true) {
		params = params + "<useMAGetChildRequest>false</useMAGetChildRequest>";
		params = params + "<useMAGetParentRequest>false</useMAGetParentRequest>";
	}
	
	params += this.addClientContextData(/*maxValuesPerRDI*/3);
	return params;
};

DrillAction.prototype.getDrillOptionsAsString =  function(){
	var oViewerWidget = this.getViewerWidget();
	var result = "";
	if(oViewerWidget){
		result = "<addSummaryMembers>" + oViewerWidget.getDrillOptions().addSummaryMembers + "</addSummaryMembers>";
		result = result + "<backwardsCompatible>" + oViewerWidget.getDrillOptions().backwardsCompatible + "</backwardsCompatible>";
	}
	return result;
};

DrillAction.prototype.getItemInfo = function( cognosViewer, itemName )
{
	var rapReportInfo = cognosViewer.getRAPReportInfo()
	if( !rapReportInfo )
	{
		return null;
	}

	var containers = rapReportInfo.getContainers();
	for( var container in containers )
	{
		var itemInfo = rapReportInfo.getItemInfo( container );
		if( itemInfo[itemName])
		{
			return itemInfo[itemName];
		}
	}
	return null;
};

DrillAction.prototype.isSelectionFilterEnabled = function() {
	var oWidget = this.getViewerWidget();
	
	if (!oWidget) {
		return false;
	}
	
	return oWidget.isSelectionFilterEnabled();
};


DrillAction.prototype.getHierarchyHasExpandedSet = function( cognosViewer, itemName )
{
	var itemInfo = this.getItemInfo( cognosViewer, itemName );
	return ( itemInfo && itemInfo.hierarchyHasExpandedMembers );
};

DrillAction.prototype.getIsRSDrillParent = function( cognosViewer, itemName )
{
	var itemInfo = this.getItemInfo( cognosViewer, itemName );
	return ( itemInfo && itemInfo.isRSDrillParent );
};

/*
 * Sets m_bUseReportInfoSelection flag
 */
DrillAction.prototype.setUseReportInfoSelection = function( bFlag )
{
	this.m_bUseReportInfoSelection = bFlag;
}

/*
 * returns m_bUseReportInfoSelection flag
 */
DrillAction.prototype.useReportInfoSelection = function()
{
	return this.m_bUseReportInfoSelection;
}

/*
 * parses input object and populates m_aDrillSelectedObjects array.
 */
DrillAction.prototype.parseDrillSpecObjectsWithReportInfo = function( aDrillSpecObjects )
{
	try
	{
		var oReportInfo = this.m_oCV.getRAPReportInfo();
		if(!oReportInfo){
			return null;
		}

		this.m_drillSpec = "";
		this.m_aDrillSelectedObjects = [];

		for(var i in aDrillSpecObjects) {
			this.populateSelectObjectWithReportInfo(aDrillSpecObjects[i], oReportInfo );
		}
	}
	catch( e )
	{
		return false;
	}

	return( this.m_aDrillSelectedObjects.length > 0 );
};

/*
 * Creates an object with enough infomation to create Lean-selection and
 * adds the object to m_aDrillSelectedObjects array.
 *
 * The object has all the fields from returned object of getItemDetails and the drill-spec object
 * obj = {
 * 	item,
 * 	hun,
 *	lid,
 * 	queryName,
 * 	mun,
 * 	lun,
 *  displayValue,
 * 	isMeasure,
 * 	onSummary
 * }

 */
DrillAction.prototype.populateSelectObjectWithReportInfo = function(oSpec, oReportInfo)
{

	var oItemDetails = oReportInfo.getItemDetails(oSpec.dataItem, oSpec.hun);
	if (!oItemDetails) {
		oItemDetails = oReportInfo.getItemDetailsByHun(oSpec.hun);
		if (!oItemDetails) {
			return null;
		}
	}

	if (oSpec.mun) {
		oItemDetails.mun = oSpec.mun;
	}

	if (oSpec.lun) {
		oItemDetails.lun = oSpec.lun;
	}
	if (oSpec.displayValue) {
		oItemDetails.displayValue = oSpec.displayValue;
	}

	if (oSpec.isMeasure === "true") {
		oItemDetails.isMeasure = true;
	}

	if (oSpec.summary === "true") {
		oItemDetails.onSummary = true;
	}

	this.m_aDrillSelectedObjects.push(oItemDetails);
};

/*
 * Override
 */
DrillAction.prototype.getSelectionContext = function()
{
	if (this.useReportInfoSelection() ) {
		return this.genLeanSelection();
	} else {
		return CognosViewerAction.prototype.getSelectionContext.call(this);
	}

};

/*
 * Returns string representing selectedCell elements.
 * m_aDrillSelectedObjects array is used as source of selected cells.
 */
DrillAction.prototype.genLeanSelection = function()
{

	if (this.m_aDrillSelectedObjects.length ==0) {
		return "";
	}

	var sSelection = "";
	for (var idx in this.m_aDrillSelectedObjects) {
		var obj = this.m_aDrillSelectedObjects[idx];
		/*
		 * Fields of obj: queryName, hun, lun, mun, displayValue, lid, and onSummary
		 */
		sSelection += "<selectedCell>";
		sSelection += (
			"<name>" + obj.item + "</name>" +
			"<display>" + obj.displayValue + "</display>" +
			"<rapLayoutTag>" + obj.lid + "</rapLayoutTag>" +
			"<queryName>" + obj.queryName + "</queryName>"
			);

		if (obj.mun) {
			sSelection += ("<nodeUse>" + obj.mun + "</nodeUse>");
			sSelection += ("<nodeType>memberUniqueName</nodeType>");
		}
		if (obj.hun) {
			sSelection += ("<nodeHierarchyUniqueName>" + obj.hun + "</nodeHierarchyUniqueName>");
		}

		var sUsage = (obj.isMeasure)? "measure" : "nonMeasure";
		sSelection += ("<nodeUsage>" + sUsage + "</nodeUsage>");
		sSelection += "</selectedCell>";
	}

	return ("<selection>" + sSelection + "</selection>");
};

/*
 * Overrride
 * This function is used in AddActionContexts, i.e <reportActions>
 *
 * If widget is not visible, we want <reportActions runReport=false>
 */
DrillAction.prototype.runReport = function()
{
	if (this.getViewerWidget()) {
		return this.getViewerWidget().shouldReportBeRunOnAction()
	}
	else {
		return true;
	}
};

/*
 * Override
 *
 * Enables Queuing if widget is not visible
 */
DrillAction.prototype.canBeQueued = function()
{
	if (this.getViewerWidget()) {
		return !(this.getViewerWidget().isVisible());
	}
	else {
		return false;
	}
};

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * DrillUpDownAction - implements drill-related actions including drillability
 * and returning/performing drilling in the "default drill direction" in cognos viewer
 */
function DrillUpDownAction()
{
	this.m_sAction = "DrillDown";
	this.m_drillOption = "drillDown";
	this.undoTooltip = "";
}

DrillUpDownAction.prototype = new DrillAction();
DrillUpDownAction.prototype.getHoverClassName = function() { return "dl"; };

DrillUpDownAction.prototype.getUndoHint = function()
{
	return this.undoTooltip;
};

DrillUpDownAction.prototype.keepRAPCache = function()
{
	return false;
};



DrillUpDownAction.prototype.updateDrillability = function(cognosViewer, ctxNode)
{
	this.m_oCV = cognosViewer;

	var ctxValueString = ctxNode.getAttribute("ctx");
	this.drillability = 0;
	if (ctxValueString) {
		var ctxValues = ctxValueString.split("::");

		if (ctxValues && ctxValues.length > 0) {
			if (ctxValues.length > 2) {
				this.drillability = this.getDrillabilityForIntersection(ctxValues[1].split(":")[0],
						 												ctxValues[2].split(":")[0]);
			} else if( ctxValues.length === 2 ) {
				/**
				 * Handles the case for measure::categories ctx, which vizCharts like treemap generates.
				 */
				this.drillability = this.getDrillabilityForCtxValue(ctxValues[1].split(":")[0]);
			} else {
				this.drillability = this.getDrillabilityForCtxValue(ctxValues[0].split(":")[0]);
			}
		}
	}

	//set the default action to match the default drill
	if (this.isDefaultDrillUp(ctxNode)) {
		this.m_sAction = "DrillUp";
		this.m_drillOption = "drillUp";
		this.undoTooltip = RV_RES.RV_DRILL_UP;
	} else {
		this.m_sAction = "DrillDown";
		this.m_drillOption = "drillDown";
		this.undoTooltip = RV_RES.RV_DRILL_DOWN;
	}
	return this.drillability;
};

DrillUpDownAction.prototype.updateDrillabilityFromSelections = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();
	this.drillability=0;
	if (selectedObjects != null && typeof selectedObjects != "undefined"
		&& selectedObjects.length == 1 && selectedObjects[0].m_contextIds!=null)
	{
		if (selectedObjects[0].getLayoutType() == "section") {
			this.drillability = 0; //no drilling on section header in a sectioned list.
		} else if (selectedObjects[0].m_contextIds.length == 0) {
			this.drillability = 0;
		} else if (typeof DrillContextMenuHelper !== "undefined" && DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV)) {
			//Normally, look at the level closest to the data to determine if you can drill up or down on a particular node or cell.
			//But...when the drill submenu is enabled, return true if you can drill up/down on upper levels as well...because all items are in the menu.
			this.drillability = this.getDrillabilityForAll(selectedObjects[0].m_contextIds);
		} else {
			if (selectedObjects[0].m_contextIds.length > 2) {
				this.drillability = this.getDrillabilityForIntersection(selectedObjects[0].m_contextIds[1][0],
										selectedObjects[0].m_contextIds[2][0]);
			} else {
				this.drillability = this.getDrillabilityForCtxValue(selectedObjects[0].m_contextIds[0][0]);

			}
		}
	}
	return this.drillability;
};


DrillUpDownAction.prototype.getDrillabilityForCtxValue = function(ctxValue)
{
	var drillability = 0;
	var selectionController = this.m_oCV.getSelectionController();
	var refDataItem = selectionController.getRefDataItem( ctxValue )
	if( this.getHierarchyHasExpandedSet( this.m_oCV, refDataItem) && this.getIsRSDrillParent( this.m_oCV, refDataItem ) )
	{
		//we want to make sure that user can still drill up on the parent member when there is expanded set in the hierarchy
		drillability = 1; //up
		return drillability;
	}

	if (selectionController.getMun(ctxValue) !== "" && selectionController.getUsageInfo(ctxValue) !== '2')
	{
		//Start with the drill flags, then augment with reportInfo....
		drillability = (+selectionController.getDrillFlagForMember(ctxValue));
		var drillabilityObj = this.getDrillabilityForItemFromReportInfo(selectionController.getRefDataItem(ctxValue));

		if (drillabilityObj != null) {
			if (drillabilityObj.disableDown == true || drillabilityObj.isolated == true) {
				if (drillability == 1 || drillability >= 3 || drillabilityObj.isolated == true) {	//up or both
					drillability = 1;	//up
				} else {
					drillability = 0;	//none
				}
			}

			if (drillabilityObj.disableUp == true) {
				if (drillability >= 2) {	//down or both
					drillability = 2;	//down
				} else {
					drillability = 0;	//none
				}
			}
		}
	}

	return drillability;
};

DrillUpDownAction.prototype.getDrillabilityForIntersection = function(ctxValue1, ctxValue2)
{
	var drillability1 = this.getDrillabilityForCtxValue(ctxValue1);
	return this.mergeDrillability(drillability1, ctxValue2);
};

/**
 * This function merges the drillability for all components of a selection (including nested parents)
 * It is used for visualizations to determine whether we need to show drill up/drill down and a submenu
 * (ie: it may not be possible to drill on the innermost but it may be possible to drill on one of the nested parents).
 */
DrillUpDownAction.prototype.getDrillabilityForAll = function(contextArray)
{
	//Process all levels...when 1 dimension, its an edge so process the first dimension
	//                     when 2 dimensions, its an intersection so process dimensions 1 and 2 for all levels.
	var iStartDim=(contextArray.length >= 2) ? 1 : 0; 
	var iEndDim;
	if(contextArray.length == 2){
		iEndDim = 1;
	} else if (contextArray.length > 2) {
		iEndDim = 2; 
	} else {
		iEndDim = 0;
	}

	var netDrillability=0;
	for (var iDim=iStartDim; iDim<=iEndDim; ++iDim) {
		for (var iLevel=0; iLevel<contextArray[iDim].length; ++iLevel) {
			netDrillability=this.mergeDrillability(netDrillability, contextArray[iDim][iLevel]);
		}
	}
	return netDrillability;
};

DrillUpDownAction.prototype.mergeDrillability = function(drillability1, ctxValue2)
{
	var drillability2 = this.getDrillabilityForCtxValue(ctxValue2);

	if (drillability1 == drillability2) {
		return drillability1;
	}

	//swap so that d2 > d1
	if (drillability1 > drillability2) {
		var temp = drillability1;
		drillability1 = drillability2;
		drillability2 = temp;
	}

	if (drillability1 == 1 && drillability2 == 2) {
		return 3;	//down or up
	}

	return drillability2;
};


DrillUpDownAction.prototype.hasPermission = function()
{
	if( this.m_oCV)
	{
		if (this.m_oCV.isDrillBlackListed()) {
			return false;
		}
		
		var envParams = this.m_oCV.envParams;
		if( envParams )
		{
			return !( this.m_oCV.isLimitedInteractiveMode() || ( envParams['cv.objectPermissions'].indexOf( 'read' ) === -1 ));
		}
	}
	return false;
};



DrillUpDownAction.prototype.canDrillUp = function()
{
	//0=none, 1=up, 2=down, 3=downorup, 4=upordown
	return ((this.drillability == 1 || this.drillability == 3 || this.drillability == 4) && this.hasPermission() );
};

DrillUpDownAction.prototype.canDrillDown = function()
{
	//0=none, 1=up, 2=down, 3=downorup, 4=upordown
	return ( (this.drillability == 2 || this.drillability == 3 || this.drillability == 4) && this.hasPermission() );
};

DrillUpDownAction.prototype.isDefaultDrillUp = function(ctxNode)
{
	if (this.drillability == 1 || this.drillability == 4 || (ctxNode && ctxNode.getAttribute("ischarttitle") === "true")) {
		return true;
	} else {
		return false;
	}
};

DrillUpDownAction.prototype.doOnMouseOver = function(evt)
{
	if (this.drillability > 0 && !this.getCognosViewer().isLimitedInteractiveMode()) {
		var ctxNode = getCtxNodeFromEvent(evt);
		this.addDrillableClass(ctxNode);
		if (evt.toElement && evt.toElement.nodeName && evt.toElement.nodeName.toLowerCase() == "img") {
			this.addDrillableClass(evt.toElement);
		}
	}
};


DrillUpDownAction.prototype.doOnMouseOut = function(evt)
{
	var ctxNode = getCtxNodeFromEvent(evt);
	if (ctxNode) {
		this.removeDrillableClass(ctxNode);
		if (evt.toElement && evt.toElement.nodeName && evt.toElement.nodeName.toLowerCase() == "img") {
			this.removeDrillableClass(evt.toElement);
		}
	}

};

DrillUpDownAction.prototype.onMouseOver = function(evt)
{
	this.doOnMouseOver(evt);
};
DrillUpDownAction.prototype.onMouseOut = function(evt)
{
	this.doOnMouseOut(evt);
};

DrillUpDownAction.prototype.onDoubleClick = function(evt)
{
	if (this.drillability > 0 && this.hasPermission() && !this.isSelectionFilterEnabled()) {
		this.execute();
		var ctxNode = getCtxNodeFromEvent(evt);
		if (ctxNode!=null) {
			this.removeDrillableClass(ctxNode);
		}
	}
};

DrillUpDownAction.prototype.addDrillableClass = function(node) {
	if (! node.className.match(new RegExp('(\\s|^)' + this.getHoverClassName() + '(\\s|$)'))) {
		node.className += " " + this.getHoverClassName();
	}
};

DrillUpDownAction.prototype.removeDrillableClass = function(node) {
	var className = node.className;
	className = className.replace(new RegExp('(\\s|^)' + this.getHoverClassName() + '(\\s|$)'), ' ');
	node.className = className.replace(/^\s*/, "").replace(/\s*$/, "");
};


/**
 * DrillUpDownOrThroughAction - Manage drill cursors for authored drill/drillability and double-click "default drill" (charts only)
 */
function DrillUpDownOrThroughAction()
{
	this.m_hasAuthoredDrillTargets=false;
	this.m_canDrillUpDown=false;
}

DrillUpDownOrThroughAction.prototype = new DrillUpDownAction();

DrillUpDownOrThroughAction.prototype.init = function(hasAuthoredDrillTargets, canDrillUpDown) {
	if (this.getCognosViewer()) {
		var oWidget = this.getCognosViewer().getViewerWidget();
		if (oWidget && oWidget.isSelectionFilterEnabled()) {
			return;
		}
		else if (this.m_oCV.isDrillBlackListed()) {
			return;
		}
	}
	this.m_hasAuthoredDrillTargets=hasAuthoredDrillTargets;
	this.m_canDrillUpDown=canDrillUpDown;
};

DrillUpDownOrThroughAction.prototype.updateDrillabilityInfo = function(cognosViewer, ctxNode)
{
	if (this.m_canDrillUpDown) {
		return this.updateDrillability(cognosViewer, ctxNode);
	}
	return null;
};

DrillUpDownOrThroughAction.prototype.onMouseOver = function(evt)
{
	if (this.m_hasAuthoredDrillTargets) {
		var ctxNode = getCtxNodeFromEvent(evt);
		if (ctxNode) {
			this.addDrillableClass(ctxNode);
			this._set_chartImage_drillThroughCursor_IE("pointer", evt);
		}
	}
	if (this.m_canDrillUpDown && !this.isSelectionFilterEnabled() && !this.m_oCV.isDrillBlackListed()) {
		this.doOnMouseOver(evt);
	}
};

DrillUpDownOrThroughAction.prototype.onMouseOut = function(evt)
{
	if (this.m_hasAuthoredDrillTargets) {
		var ctxNode = getCtxNodeFromEvent(evt);
		if (ctxNode) {
			this.removeDrillableClass(ctxNode);
			this._set_chartImage_drillThroughCursor_IE("default", evt);
		}
	}
	if (this.m_canDrillUpDown && !this.isSelectionFilterEnabled() && !this.m_oCV.isDrillBlackListed()) {
		this.doOnMouseOut(evt);
	}
};

	/**
	* IE8 and IE9 has limitations to dynamically change an "AREA" element's cursor type
	* by fliping pedefined CSS styles when there is cursor type css style defined in the
	* "IMG" element's parent element, the function below is to get the IMG object from the
	* onMouseOver event on the "AREA" and programatically change the img's cursor to show
	* hand icon when it's drill through able.
	* */
	DrillUpDownOrThroughAction.prototype._getDrillThroughChartImage_from_chartArea = function(evt){
		var oSrcElement = getCrossBrowserNode(evt);
		if(oSrcElement){
			var selectionController = this.m_oCV.getSelectionController();
			return selectionController.getSelectedChartImageFromChartArea(oSrcElement);
		}
	};

	DrillUpDownOrThroughAction.prototype._set_chartImage_drillThroughCursor_IE = function(sCursor, evt){
		if(dojo.isIE || dojo.isTrident){//We only do this for IE
			var oImg = this._getDrillThroughChartImage_from_chartArea( evt);
			if(oImg){
				oImg.style.cursor = sCursor;
			}
		}
	};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * DrillDownAction - implements drill down in cognos viewer
 */
function DrillDownAction()
{
	this.m_sAction = "DrillDown";
	//TODO make it so that we can use m_sAction instead of a separate parameter
	this.m_drillOption = "drillDown";
}

DrillDownAction.prototype = new DrillUpDownAction();

DrillDownAction.prototype.getUndoHint = function()
{
	return RV_RES.RV_DRILL_DOWN;
};

DrillDownAction.prototype.getHoverClassName = function() { return "dl"; };

DrillDownAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	this.updateDrillabilityFromSelections();

	if (!this.canDrillDown()) {
		jsonSpec.disabled = true;
	} else {
		jsonSpec.disabled = false;
		DrillContextMenuHelper.updateDrillMenuItems(jsonSpec, this.m_oCV, this.m_sAction);
	}
	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * DrillUpAction - implements drill up in cognos viewer
 */
function DrillUpAction()
{
	this.m_sAction = "DrillUp";
	this.m_drillOption = "drillUp";
}

DrillUpAction.prototype = new DrillUpDownAction();
DrillUpAction.prototype.getHoverClassName = function() { return "dl"; };

DrillUpAction.prototype.getUndoHint = function()
{
	return RV_RES.RV_DRILL_UP;
};

DrillUpAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	this.updateDrillabilityFromSelections();

	if (!this.canDrillUp()) {
		jsonSpec.disabled = true;
	} else {
		jsonSpec.disabled = false;
		DrillContextMenuHelper.updateDrillMenuItems(jsonSpec, this.m_oCV, this.m_sAction);
	}
	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function DeleteAction()
{
	this.m_sAction = "Delete";
}
DeleteAction.prototype = new ModifyReportAction();
DeleteAction.baseclass = ModifyReportAction.prototype;

DeleteAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_DELETE;
};

DeleteAction.prototype.canDelete = function()
{
	if(!this.m_oCV.isLimitedInteractiveMode()) {
		var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
		if (selectedObjects.length>0) {
			for (var i=0; i<selectedObjects.length; ++i) {
				var selObj=selectedObjects[i];
				var cellRef=selObj.getCellRef();
	
				if( !selObj.hasContextInformation() || selObj.isHomeCell() ||
					(selObj.getLayoutType() != 'columnTitle' && selObj.getDataContainerType() != 'list' ) ||
					cellRef.getAttribute("cc") == "true") {
					return false;
				}
			}
			return true;
		}
	}
	return false;
};

DeleteAction.prototype.execute = function() {
	DeleteAction.baseclass.execute.call(this);
	//While the server is working, clear the selection and rebuild the
	//context menu so that users won't be able to see commands from
	//the deleted selection. (COGCQ00252407).
	this.m_oCV.getSelectionController().clearSelectionData();
	this.m_oCV.getViewerWidget().onContextMenu(null);
};

DeleteAction.prototype.keepRAPCache = function()
{
	return false;
};

DeleteAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	jsonSpec.disabled = !this.canDelete();
	return jsonSpec;
};

DeleteAction.prototype.addActionContextAdditionalParms = function()
{
	return this.getSelectedCellTags();
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function UndoableClientActionBase() {}
UndoableClientActionBase.prototype = new CognosViewerAction();

UndoableClientActionBase.prototype.setContainerId = function(containerId)
{
	this.m_sContainerId = containerId;
};

UndoableClientActionBase.prototype.doRedo = function(containerId)
{
	this.setContainerId(containerId)
	this.execute();
};

UndoableClientActionBase.prototype.doUndo = function(containerId)
{
	factory = this.getCognosViewer().getActionFactory();
	var unfreezeAction = factory.load(this.getUndoClass());
	unfreezeAction.setContainerId(containerId);
	unfreezeAction.execute();
};

/**
 * return the container id of the selected container (without namespace)
 */
UndoableClientActionBase.prototype.getSelectedContainerId = function()
{
	var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
	if (selectedObjects && selectedObjects.length) {
		var lid=selectedObjects[0].getLayoutElementId();
		if (lid) {
			return this.removeNamespace(lid);
		}
	}
	return null;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function FreezeRowHeadingsAction()
{
}
 
FreezeRowHeadingsAction.prototype = new UndoableClientActionBase();
FreezeRowHeadingsAction.superclass = UndoableClientActionBase.prototype;

FreezeRowHeadingsAction.prototype.execute = function()
{
	var lidToFreeze = this.m_sContainerId? this.m_sContainerId : this.getSelectedCrosstabContainerId();
	if (lidToFreeze) {
		//Selection borders in high contrast mode aren't cleaned up properly when cloned, 
		//so remove all selections before performing freeze
		this.m_oCV.getSelectionController().resetSelections();
		
		this.m_oCV.getPinFreezeManager().freezeContainerRowHeadings(lidToFreeze);
		this.addClientSideUndo(this, [lidToFreeze]);
	}
};

FreezeRowHeadingsAction.prototype.getUndoHint = function() 
{
	return RV_RES.IDS_JS_FREEZEROWHEADINGS;	
};

FreezeRowHeadingsAction.prototype.getUndoClass = function()
{
	return "UnfreezeRowHeadings";
};

FreezeRowHeadingsAction.prototype.getSelectedCrosstabContainerLid = function()
{
	var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
	if (selectedObjects && selectedObjects.length && selectedObjects[0].getDataContainerType() == "crosstab") {
		var lid=(selectedObjects[0].getLayoutElementId());
		if (lid) {
			return lid;
		}
	}
	return null;
};

/**
 * return the selected container id (without namespace) if it is valid for pin freeze rows (ie: its a crosstab)
 */
FreezeRowHeadingsAction.prototype.getSelectedCrosstabContainerId = function()
{
	var lid = this.getSelectedCrosstabContainerLid();
	if (lid) {
		return this.removeNamespace(lid);
	}
	return null;
};

/**
 * row headings can be frozen if the layout type is right and the row headings aren't already frozen.
 */
FreezeRowHeadingsAction.prototype.canFreezeRowHeadings = function()
{
	var pfManager = this.m_oCV.getPinFreezeManager();
	if (pfManager) {
		var containerId=this.getSelectedCrosstabContainerId();
		if (containerId) {
			if(!pfManager.hasFrozenRowHeadings(containerId) && pfManager.getValidSelectedContainerId(false)) {
				return true;
			}
		}
	}
	return false;
};

FreezeRowHeadingsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.canFreezeRowHeadings();
	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function UnfreezeRowHeadingsAction()
{
}
 
UnfreezeRowHeadingsAction.prototype = new UndoableClientActionBase();
UnfreezeRowHeadingsAction.superclass = UndoableClientActionBase.prototype;

UnfreezeRowHeadingsAction.prototype.execute = function()
{
	if (this.m_oCV.getPinFreezeManager()) {
		var oReportDiv = document.getElementById("CVReport" + this.m_oCV.getId());
		var containerId = this.m_sContainerId ? this.m_sContainerId : this.getSelectedContainerId();

		//Selection borders in high contrast mode aren't cleaned up properly when cloned, 
		//so remove all selections before performing unfreeze
		this.m_oCV.getSelectionController().resetSelections();
		
		this.m_oCV.getPinFreezeManager().unfreezeContainerRowHeadings(containerId, oReportDiv);
		
		this.addClientSideUndo(this, [containerId]);		
	}
};

UnfreezeRowHeadingsAction.prototype.getUndoHint = function() 
{
	return RV_RES.IDS_JS_UNFREEZEROWHEADINGS;	
};

UnfreezeRowHeadingsAction.prototype.getUndoClass = function()
{
	return "FreezeRowHeadings";
};

/**
 * return true if the row headings for the selected container are frozen
 */
UnfreezeRowHeadingsAction.prototype.areRowHeadingsFrozen = function()
{
	if (this.m_oCV.getPinFreezeManager() &&	this.m_oCV.getPinFreezeManager().hasFrozenRowHeadings(this.getSelectedContainerId())) {
		return true;
	}
	return false;
};

UnfreezeRowHeadingsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.areRowHeadingsFrozen();
	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function FreezeColumnHeadingsAction()
{
}
 
FreezeColumnHeadingsAction.prototype = new UndoableClientActionBase();
FreezeColumnHeadingsAction.superclass = UndoableClientActionBase.prototype;

FreezeColumnHeadingsAction.prototype.execute = function()
{
	var lidToFreeze = this.m_sContainerId ? this.m_sContainerId : this.getSelectedCrosstabOrListContainerId();
	if (lidToFreeze) {
		//Selection borders in high contrast mode aren't cleaned up properly when cloned, 
		//so remove all selections before performing freeze
		this.m_oCV.getSelectionController().resetSelections();
		
		this.m_oCV.getPinFreezeManager().freezeContainerColumnHeadings(lidToFreeze);
		this.addClientSideUndo(this, [lidToFreeze]);
	}
};

FreezeColumnHeadingsAction.prototype.getUndoHint = function() 
{
	return RV_RES.IDS_JS_FREEZECOLUMNHEADINGS;	
};

FreezeColumnHeadingsAction.prototype.getUndoClass = function()
{
	return "UnfreezeColumnHeadings";
};

FreezeColumnHeadingsAction.prototype.getSelectedCrosstabOrListContainerLid = function()
{
	var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
	if (selectedObjects && selectedObjects.length && 
			(selectedObjects[0].getDataContainerType() == "crosstab" ||
			 selectedObjects[0].getDataContainerType() == "list")) {
		var lid=(selectedObjects[0].getLayoutElementId());
		if (lid) {
			return lid;
		}
	}
	return null;
};

/**
 * return the selected container id (without namespace) if it is valid for pin freeze Columns (ie: its a crosstab)
 */
FreezeColumnHeadingsAction.prototype.getSelectedCrosstabOrListContainerId = function()
{
	var lid = this.getSelectedCrosstabOrListContainerLid();
	if (lid) {
		return this.removeNamespace(lid);
	}
	return null;
};

/**
 * Column headings can be frozen if the layout type is right and the Column headings aren't already frozen.
 */
FreezeColumnHeadingsAction.prototype.canFreezeColumnHeadings = function()
{
	var pfManager = this.m_oCV.getPinFreezeManager();
	if (pfManager) {
		var containerId=this.getSelectedCrosstabOrListContainerId();
		if (containerId) {
			if(!pfManager.hasFrozenColumnHeadings(containerId) && pfManager.getValidSelectedContainerId(true)) {
				return true;
			}
		}
		return false;
	}
};


FreezeColumnHeadingsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.canFreezeColumnHeadings();
	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function UnfreezeColumnHeadingsAction()
{
}
 
UnfreezeColumnHeadingsAction.prototype = new UndoableClientActionBase();
UnfreezeColumnHeadingsAction.superclass = UndoableClientActionBase.prototype;

UnfreezeColumnHeadingsAction.prototype.execute = function()
{
	if (this.m_oCV.getPinFreezeManager()) {
		var oReportDiv = document.getElementById("CVReport" + this.m_oCV.getId());
		var containerId = this.m_sContainerId ? this.m_sContainerId : this.getSelectedContainerId();
		
		//Selection borders in high contrast mode aren't cleaned up properly when cloned, 
		//so remove all selections before performing unfreeze
		this.m_oCV.getSelectionController().resetSelections();
		
		this.m_oCV.getPinFreezeManager().unfreezeContainerColumnHeadings(containerId, oReportDiv);
		
		this.addClientSideUndo(this, [containerId]);
	}
};

UnfreezeColumnHeadingsAction.prototype.getUndoHint = function() 
{
	return RV_RES.IDS_JS_UNFREEZECOLUMNHEADINGS;	
};

UnfreezeColumnHeadingsAction.prototype.getUndoClass = function()
{
	return "FreezeColumnHeadings";
};

/**
 * return true if the Column headings for the selected container are frozen
 */
UnfreezeColumnHeadingsAction.prototype.areColumnHeadingsFrozen = function()
{
	if (this.m_oCV.getPinFreezeManager() &&	this.m_oCV.getPinFreezeManager().hasFrozenColumnHeadings(this.getSelectedContainerId())) {
		return true;
	}
	return false;
};

UnfreezeColumnHeadingsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.areColumnHeadingsFrozen();
	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * GlossaryAction - implements IBM business glossary in cognos viewer
 */
function GlossaryAction(){}
GlossaryAction.prototype = new CognosViewerAction();

/**
 * Execute the IBM business glossary request
 */
GlossaryAction.prototype.execute = function()
{
	var cognosViewer = this.getCognosViewer();
	cognosViewer.loadExtra();
	var selectionController = cognosViewer.getSelectionController();
	var selectionList = selectionController.getAllSelectedObjects();

	if(selectionList.length > 0)
	{
		var config = null;
		if(typeof MDSRV_CognosConfiguration != "undefined")
		{
			config = new MDSRV_CognosConfiguration();

			var glossaryURI = "";
			if(cognosViewer.envParams["glossaryURI"])
			{
				glossaryURI = cognosViewer.envParams["glossaryURI"];
			}

			config.addProperty("glossaryURI", glossaryURI);
			config.addProperty("gatewayURI", cognosViewer.getGateway());
		}

		var searchPath = cognosViewer.envParams["ui.object"];
		var sSelectionContext = getViewerSelectionContext(selectionController, new CSelectionContext(searchPath));

		var glossaryHelper = new MDSRV_BusinessGlossary(config, sSelectionContext);
		glossaryHelper.open();
	}
};

GlossaryAction.prototype.updateMenu = function(jsonSpec)
{
	if (!this.getCognosViewer().bCanUseGlossary) {
		return "";
	}

	var bContext = this.selectionHasContext();

	if (!bContext || this.getCognosViewer().envParams["glossaryURI"] == null || this.getCognosViewer().envParams["glossaryURI"] == "")
	{
		jsonSpec.disabled = true;
	}
	else
	{
		jsonSpec.disabled = false;
	}
	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function GroupAction()
{
	this.m_sAction = "GroupColumn";
}
GroupAction.prototype = new ModifyReportAction();

GroupAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_GROUP_UNGROUP;
};

GroupAction.prototype.updateMenu = function(jsonSpec) {
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	var selectionController = this.m_oCV.getSelectionController();
	var aSelectedObjects = selectionController.getAllSelectedObjects();
	if (aSelectedObjects.length === 0 || selectionController.getDataContainerType() != 'list')
	{
		return this.disableMenuItem(jsonSpec);
	}

	if (aSelectedObjects[0].getCellRef().getAttribute("no_data_item_column") === "true")
	{
		return this.disableMenuItem(jsonSpec);
	}
	
	
	var bDimensionalDataSource = !selectionController.isRelational();
	for (var index = 0; index < aSelectedObjects.length; ++index)
	{
		/* disable if a selected object is a measure and
		 * data source is dimentional or its layout type is 'summary
		 */
		if (selectionController.getUsageInfo(aSelectedObjects[index].getSelectedContextIds()[0][0]) == selectionController.c_usageMeasure &&
			(bDimensionalDataSource || aSelectedObjects[index].getLayoutType() === "summary")) {
			return this.disableMenuItem(jsonSpec);
		}
	}

	jsonSpec.disabled = false;
	jsonSpec.iconClass = "group";

	return jsonSpec;
};

GroupAction.prototype.disableMenuItem = function(jsonSpec)
{
	jsonSpec.disabled = true;
	jsonSpec.iconClass = "groupDisabled";
	return jsonSpec;
};

GroupAction.prototype.addActionContextAdditionalParms = function()
{
	return this.addClientContextData(/*maxValuesPerRDI*/3);
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

// Helper class which takes of of dynamic loading of menus
function LoadMenuAction()
{
	this.m_action = null;
}

LoadMenuAction.prototype = new CognosViewerAction();

LoadMenuAction.prototype.FROM_TOOLBAR = 'toolbar';
LoadMenuAction.prototype.FROM_TOOLBAR_BLUEDOTMENU = 'toolbarBlueDotMenu';
LoadMenuAction.prototype.FROM_CONTEXTMENU = 'contextMenu';
LoadMenuAction.prototype.FROM_CONTEXTMENU_MOREACTIONS = 'contextMenuMoreActions';

LoadMenuAction.prototype.TOOLBAR_UPDATE_EVENT ="com.ibm.bux.widgetchrome.toolbar.update";
LoadMenuAction.prototype.CONTEXTMENU_UPDATE_EVENT ="com.ibm.bux.widget.contextMenu.update";


LoadMenuAction.prototype.setRequestParms = function(payload)
{
	this.m_action = payload.action;
	this.m_sFrom = (payload.from) ? payload.from : this.FROM_TOOLBAR;
};

LoadMenuAction.prototype.execute = function()
{
	var actionFactory = this.m_oCV.getActionFactory();
	var action = actionFactory.load(this.m_action);

	var toolbarItem = this.getMenuSpec();
	var buildMenuCallback = GUtil.generateCallback(this.buildMenuCallback, [toolbarItem], this);
	toolbarItem = action.buildMenu(toolbarItem, buildMenuCallback);
	if(toolbarItem != null)
	{
		this.buildMenuCallback(toolbarItem);
	}
};

LoadMenuAction.prototype.buildMenuCallback = function(toolbarItem)
{
	toolbarItem.open = true;
	toolbarItem.action = null;	
	this.fireEvent(toolbarItem);
};


LoadMenuAction.prototype.getMenuSpec = function() {
	var oCV = this.m_oCV;
	var sFrom = this.m_sFrom;
	
	if (!sFrom || !oCV) {
		return null;
	}
	
	var parentNode = null;
	var menuSpec = null;
		
	switch (sFrom) {
		case this.FROM_TOOLBAR: 
			parentNode = oCV.getToolbar();
			break;
		case this.FROM_TOOLBAR_BLUEDOTMENU:
			parentNode = oCV.findBlueDotMenu();
			break;
		case this.FROM_CONTEXTMENU_MOREACTIONS:
			parentNode = oCV.findToolbarItem("MoreActions", oCV.getContextMenu());
			break;
	}
	if (parentNode) {
		menuSpec = oCV.findToolbarItem(this.m_action, parentNode);
	}

	if (menuSpec) {
		//attach 'from' to menuSpec
		menuSpec.from = sFrom;
	}

	return menuSpec;
};

LoadMenuAction.prototype.fireEvent = function(buttonSpec) {

	var updateItems = [];
	if (buttonSpec) {
		updateItems.push(buttonSpec);
	}
	
	var widget = this.m_oCV.getViewerWidget();
	var sFrom = buttonSpec.from;
	
	switch (sFrom) {
		case this.FROM_TOOLBAR: 
		case this.FROM_TOOLBAR_BLUEDOTMENU:
			widget.fireEvent( this.TOOLBAR_UPDATE_EVENT, null, updateItems);
			break;
		case this.FROM_CONTEXTMENU_MOREACTIONS:
			widget.fireEvent( this.CONTEXTMENU_UPDATE_EVENT, null, updateItems);
			break;
	};
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 function MoveAction()
{
	this.m_sAction = "Reorder";
}
MoveAction.prototype = new DragDropAction();

MoveAction.prototype.setRequestParms = function(payload)
{
	this.m_order = payload.order;
};

MoveAction.prototype.canMoveLeftRight = function(sDirection)
{
	var selectionController = this.m_oCV.getSelectionController();
	if (selectionController && selectionController.getAllSelectedObjects().length == 1)
	{
		var cellRef = selectionController.getAllSelectedObjects()[0].getCellRef();
		if (sDirection == "right" && cellRef.nextSibling)
		{
			return true;
		}
		else if (sDirection == "left" && cellRef.previousSibling)
		{
			return true;
		}
	}

	return false;
};

MoveAction.prototype.updateMenu = function(jsonSpec)
{
	if (!this.canMove())
	{
		jsonSpec = "";
	}
	else
	{
		var selectionController = this.m_oCV.getSelectionController();
		if (selectionController && selectionController.getAllSelectedObjects().length > 1)
		{
			jsonSpec.disabled = true;
			jsonSpec.items = null;
		}
		else
		{
			jsonSpec.disabled = false;
			jsonSpec.items = [];
			jsonSpec.items.push({ disabled: !this.canMoveLeftRight("left"), name: "Move", label: RV_RES.IDS_JS_LEFT, iconClass: "moveLeft", action: { name: "Move", payload: {order:"left"} }, items: null });
			jsonSpec.items.push({ disabled: !this.canMoveLeftRight("right"), name: "Move", label: RV_RES.IDS_JS_RIGHT, iconClass: "moveRight", action: { name: "Move", payload: {order:"right"} }, items: null });
		}
	}

	return jsonSpec;
};

MoveAction.prototype.addActionContextAdditionalParms = function()
{
	var selectionController = this.getCognosViewer().getSelectionController();
	var targetRef = null;
	if (this.m_order == "right")
	{
		targetRef = selectionController.getAllSelectedObjects()[0].getCellRef().nextSibling;
	}
	else
	{
		targetRef = selectionController.getAllSelectedObjects()[0].getCellRef().previousSibling;
	}

	var target = selectionController.buildSelectionObject(targetRef, null);

	var tag = this.m_order == "right" ? "after" : "before";

	//always use layout tag when it is available.
	var tagValue = this.getRAPLayoutTag(targetRef);
	tagValue = (tagValue != null ) ? tagValue : target.getColumnName();
	return  this.getSelectedCellTags() + "<" + tag + ">" + xml_encode(tagValue)  + "</" + tag + ">";
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * This is the base class for refreshing the report. It'll get the latest
 * saved output or rerun the report if there's no saved output
 */
function RefreshViewAction()
{
	this.m_bCanvasRefreshEvent = false;
}
RefreshViewAction.prototype = new CognosViewerAction();

RefreshViewAction.prototype.addCommonOptions = function(oRequest)
{
	// removed the cache CM response about the saved outputs. This will
	// force the Snapshots menu to get updated
	var widget = this.getCognosViewer().getViewerWidget();

	if (this.m_bCanvasRefreshEvent && widget.getSavedOutputSearchPath() != null)
	{
		oRequest.addFormField("ui.savedOutputSearchPath", encodeURIComponent(widget.getSavedOutputSearchPath()));
	}
	else
	{
		widget.setSavedOutputsCMResponse(null);
		widget.setSavedOutputSearchPath(null);
	}

	oRequest.addFormField("run.outputFormat", "HTML");

	// need since we might be going from saved output to live if the saved output is no longer available
	oRequest.addFormField("widget.reloadToolbar", "true");

	// Clear the properties dialog to it'll get rebuilt. This is needed for the 'View report specification' link in
	// case we go from saved output to live during the refresh operation
	widget.clearPropertiesDialog();

	var formWarpRequest = document.getElementById("formWarpRequest" + this.getCognosViewer().getId());
	oRequest.addFormField("ui.object", formWarpRequest["reRunObj"].value);
};

RefreshViewAction.prototype.execute = function()
{
	var oRequest = this.createCognosViewerDispatcherEntry( "buxDropReportOnCanvas" );

	this.addCommonOptions(oRequest);

	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	
	if (oCV.getCurrentlySelectedTab() && widget.getSavedOutput()) {
		oCV.setKeepTabSelected(oCV.getCurrentlySelectedTab());
	}
	
	this.getCognosViewer().dispatchRequest(oRequest);
};

RefreshViewAction.prototype.doAddActionContext = function()
{
	return false;
};

RefreshViewAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.disabled = false;
	var oCV = this.getCognosViewer();
	if( oCV )
	{
		var widget = oCV.getViewerWidget();
		if( widget && widget.getSavedOutputSearchPath() != null)
		{
			jsonSpec.disabled = true;
		}

	}
	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */


/**
 * This action is used when we get an event to refresh a view from the canvas
 */
function RefreshViewEventAction()
{
	this.m_bCanvasRefreshEvent = true;
}
RefreshViewEventAction.prototype = new RefreshViewAction();
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 function RenameDataItemAction()
{
	this.m_sAction = "Rename";
	this.m_newLabel = "";
	this.m_prevLabel= "";
	this.m_containerId = "";
	this.m_bUndoAdded = false;
}

RenameDataItemAction.prototype = new ModifyReportAction();

RenameDataItemAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_RENAME;
};

RenameDataItemAction.prototype.saveSpecForUndo = function()
{
	return true;
};

RenameDataItemAction.prototype.getContainerId = function()
{
	return this.m_containerId;
};

RenameDataItemAction.prototype.addActionContextAdditionalParms = function()
{
	var tagParams = this.getSelectedCellTags();
	return (tagParams +
			"<prevName>" + xml_encode(this.m_prevLabel) + "</prevName>" +
			"<toName>" + xml_encode(this.m_newLabel) + "</toName>");
};

RenameDataItemAction.prototype.onMouseOver = function(evt)
{
	var ctxNode = getCtxNodeFromEvent(evt);
	ctxNode.style.cursor = this.canRename() ? "text" : "default";
};

RenameDataItemAction.prototype.onMouseOut = function(evt)
{
	var ctxNode = getCtxNodeFromEvent(evt);
	ctxNode.style.cursor = "default";
};

RenameDataItemAction.prototype.onDoubleClick = function(evt)
{
	if (this.canRename()) {
		var ctxNode = getCtxNodeFromEvent(evt);
		this.insertTextArea(ctxNode);
	}
};

RenameDataItemAction.prototype.canRename = function()
{
	if (this.m_oCV.isBlacklisted("RenameFromContextMenu")) {
		return false;
	}

	var selectionController = this.m_oCV.getSelectionController();
	var selLength = selectionController.getAllSelectedObjects().length;

	if (selLength==1 && !this.m_oCV.isLimitedInteractiveMode()) {
		var selObj = selectionController.getAllSelectedObjects()[0];
		if (selObj.hasContextInformation()) {
			var ctxValue = selObj.getSelectedContextIds()[0][0];
			var cellRef = selObj.getCellRef();

			return this.checkRenamableConditions(selObj, cellRef, ctxValue, selectionController);
		}
	}
	return false;
};

RenameDataItemAction.prototype.checkRenamableConditions = function(selObj, cellRef, ctxValue, selectionController)
{
	if(selObj.isHomeCell()) {
		return false;
	}
	if (selObj.getLayoutType() == 'columnTitle' && selectionController.selectionsHaveCalculationMetadata()) {
		if (selObj.getDataContainerType() == 'crosstab' && !selectionController.areSelectionsMeasureOrCalculation())	{
			return false;
		}
		return true;
	}
	if (selObj.getLayoutType() == 'columnTitle' && selObj.getDataContainerType() == 'crosstab' ) {
		return false;
	}
	if (selObj.getLayoutType() != 'columnTitle') {
		return false;
	}
	if (cellRef.getAttribute("cc") == "true") {
		return false;
	}
	if (cellRef.getAttribute("CTNM") != null && selectionController.getMun(ctxValue) != "") {
		return false;
	}

	return true;
};

RenameDataItemAction.prototype.insertTextArea = function(ctxNode)
{
	var label = document.createElement("label");
	label.style.height = "1px";
	label.style.width = "1px";
	label.style.overflow = "hidden";
	label.style.position = "absolute";
	label.style.left = "0px";
	label.style.top = "-500px";
	label.setAttribute("for", "rename" + this.m_oCV.getId());
	label.id = "renameLabel" + this.m_oCV.getId();
	label.innerHTML = RV_RES.IDS_JS_RENAME_LABEL;

	var input = document.createElement("input");
	input.id = "rename" + this.m_oCV.getId();
	input.name = "rename" + this.m_oCV.getId();
	input.type = "text";
	input.value = ctxNode.childNodes[0].nodeValue;
	input.style.backgroundColor = "transparent";
	input.style.borderWidth = "0px";
	input.style.padding = "0px";
	input.style.margin = "0px";
	input.setAttribute("role", "textbox");
	input.setAttribute("aria-labelledby", "renameLabel" + this.m_oCV.getId());

	// calculated the width of the textbox. Get the width of the TD and subtract the width of
	// any none inside the TD that's not the currently selection
	var width = ctxNode.parentNode.scrollWidth - 10;
	var nextSibling = ctxNode.parentNode.firstChild;
	while (nextSibling) {
		if (nextSibling != ctxNode) {
			width -= nextSibling.scrollWidth;
		}
		nextSibling = nextSibling.nextSibling;
	}

	input.style.width = width + "px";
	input.ctxNode = ctxNode;
	input.action = this;
	input.originalLabel = ctxNode.childNodes[0].nodeValue;

	if(isIE())
	{
		input.style.fontFamily = ctxNode.currentStyle.fontFamily;
		input.style.fontSize = ctxNode.currentStyle.fontSize;
		input.style.fontStyle = ctxNode.currentStyle.fontStyle;
		input.style.fontVariant = ctxNode.currentStyle.fontVariant;
		input.style.fontWeight = ctxNode.currentStyle.fontWeight;

		input.attachEvent("onblur", this.onBlur);
		input.attachEvent("onkeydown", this.onKeyDown);
		input.style.overflow = "hidden";
	}
	else
	{
		input.style.font = "inherit";
		input.addEventListener("blur", this.onBlur, false);
		input.addEventListener("keydown", this.onKeyDown, false);
		input.style.overflow = "visible";
	}

	ctxNode.innerHTML = "";
	ctxNode.appendChild(label);
	ctxNode.appendChild(input);
	input.focus();
	input.select();
};

/**
 * Returns true if the mouse down event is on the rename input field
 * @param {Object} evt
 */
RenameDataItemAction.prototype.onMouseDown = function(evt) {
	if (evt) {
		try {
			var node = evt.originalTarget ? evt.originalTarget : evt.srcElement;
			if (node && node.getAttribute("id") === "rename" + this.m_oCV.getId()) {
				return true;
			}
		}
		catch(ex) {
			// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
		}
	}

	return false;
};

RenameDataItemAction.prototype.onBlur = function(evt)
{
	var node;
	if(isIE())
	{
		node = getNodeFromEvent(evt);
	}
	else
	{
		node = this;
	}

	var ctxNode = node.ctxNode;
	var renameAction = node.action;
	var newLabel = node.value != "" ? node.value : node.innerHTML;
	renameAction.updateLabel(ctxNode, newLabel, node.originalLabel);
};

RenameDataItemAction.prototype.onKeyDown = function(evt)
{
	var newLabel = "";
	var node = getNodeFromEvent(evt);

	if(evt.keyCode == "13")
	{
		newLabel = node.value != "" ? node.value : node.originalLabel;
	}
	else if(evt.keyCode == "27")
	{
		newLabel = node.originalLabel;
	}

	if(newLabel != "")
	{
		var ctxNode = node.ctxNode;
		var renameAction = node.action;

		renameAction.updateLabel(ctxNode, newLabel, node.originalLabel);

		return stopEventBubble(evt);
	}
	else
	{
		return true;
	}
};

RenameDataItemAction.prototype.updateLabel = function(ctxNode, newLabel, originalLabel)
{
	this.m_newLabel = newLabel;
	this.m_prevLabel= originalLabel;
	ctxNode.innerHTML = "";
	ctxNode.appendChild(document.createTextNode(newLabel));

	var selectionController = this.m_oCV.getSelectionController();

	if(selectionController != null && newLabel != originalLabel)
	{
		var selectionFactory = new CSelectionObjectFactory(selectionController);
		this.m_containerId = this.removeNamespace(selectionFactory.getLayoutElementId(ctxNode));
		var SelObj = selectionFactory.getSelectionObject(ctxNode.parentNode);
		selectionController.m_aSelectedObjects[0] = SelObj;

		// reset the focus to the span we just renamed.
		var allChildren = SelObj.getCellRef().getElementsByTagName("span");
		var span = null;
		if (allChildren) {
			for (var i = 0; i < allChildren.length; i++) {
				span = allChildren[i];
				if (span.getAttribute("ctx") != null && span.style.visibility != "hidden") {
					span.focus();
					break;
				}
			}
		}

		this.execute();
	}
};

RenameDataItemAction.prototype.buildUrl = function()
{
	var urlRequest = "b_action=cognosViewer&ui.action=modifyReport&cv.responseFormat=xml";
	var actionContext = this.addActionContext();
	urlRequest += "&cv.actionContext=" + encodeURIComponent(actionContext);
	if (window.gViewerLogger)
	{
		window.gViewerLogger.log('Action context', actionContext, "xml");
	}
	urlRequest += "&ui.object=" + encodeURIComponent(this.m_oCV.envParams["ui.object"]);

	if(typeof this.m_oCV.envParams["ui.spec"] != "undefined")
	{
		urlRequest += "&ui.spec=" + encodeURIComponent(this.m_oCV.envParams["ui.spec"]);
	}

	if(typeof this.m_oCV.getModelPath() != "")
	{
		urlRequest += "&modelPath=" + encodeURIComponent(this.m_oCV.getModelPath());
	}

	return urlRequest;
};

RenameDataItemAction.prototype.keepRAPCache = function()
{
	return false;
};

RenameDataItemAction.prototype.reuseQuery = function() { return true; };
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 function RenameFromContextMenuAction() {}
RenameFromContextMenuAction.prototype = new RenameDataItemAction();

RenameFromContextMenuAction.prototype.canRename = function(selObj)
{
	if (!selObj || selObj.hasContextInformation() == false)
	{
		return false;
	}

	var selectionController = this.m_oCV.getSelectionController();
	var ctxValue = selObj.getSelectedContextIds()[0][0];
	var cellRef = selObj.getCellRef();

	return this.checkRenamableConditions(selObj, cellRef, ctxValue, selectionController);
};

RenameFromContextMenuAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	var selectionController = this.m_oCV.getSelectionController();

	var selLength = selectionController.getAllSelectedObjects().length;
	if (selLength != 1)
	{
		for (var selIndex=0; selIndex < selLength; selIndex++)
		{
			if (!this.canRename(selectionController.getAllSelectedObjects()[selIndex]))
			{
				return "";
			}
		}

		jsonSpec.disabled = true;
	}
	else
	{
		if (!this.canRename(selectionController.getAllSelectedObjects()[0]))
		{
			jsonSpec = "";
		}
		else
		{
			jsonSpec.disabled = false;
		}
	}

	return jsonSpec;
};
RenameFromContextMenuAction.prototype.getSpanFromCellRef = function(cellRef)
{
	var allChildren = cellRef.getElementsByTagName("span");
	var span = null;
	if (allChildren) {
		for (var i = 0; i < allChildren.length; i++) {
			span = allChildren[i];
			if (span.getAttribute("ctx") != null && span.style.visibility != "hidden") {
				break;
			}
		}
	}

	return span;
};

RenameFromContextMenuAction.prototype.execute = function()
{
	var cellRef = this.m_oCV.getSelectionController().getAllSelectedObjects()[0].getCellRef();
	if (cellRef)
	{
		var span = this.getSpanFromCellRef(cellRef);

		var renameDataItemAction = this.m_oCV.getAction("RenameDataItem");
		renameDataItemAction.insertTextArea(span);
	}
};

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

function ResetToOriginalAction() {}

ResetToOriginalAction.prototype = new CognosViewerAction();

ResetToOriginalAction.prototype.updateMenu = function(jsonSpec) {
	var bBaseReportIsAvailable = this.getCognosViewer().envParams.baseReportAvailable;
	jsonSpec.disabled = ( bBaseReportIsAvailable === "false" ) ? true : jsonSpec.disabled;
	return jsonSpec;
};

ResetToOriginalAction.prototype.execute = function()
{
	var confirmationDialog  = viewer.dialogs.ConfirmationDialog(
		RV_RES.IDS_JS_RESET_TO_ORIGINAL,	/* title */
		RV_RES.IDS_JS_RESET_TO_ORIGINAL_WARNING, /* main message */
		RV_RES.IDS_JS_RESET_TO_ORIGINAL_WARNING_DESC, /* description */
		null, /* icon class */
		this, /* caller object */
		this.executeAction /* yes Handler function of caller object.  */
		);

	confirmationDialog.startup();
	confirmationDialog.show();
};

ResetToOriginalAction.prototype.executeAction = function(actionObject)
{
	this.gatherFilterInfoBeforeAction("ResetToOriginal");
	ChangePaletteAction.reset(this.getCognosViewer());
};

ResetToOriginalAction.prototype.dispatchRequest = function(filters)
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();

	widget.reset();

	var sOriginalItem = widget.getAttributeValue("originalReport");
	
	if (!sOriginalItem) {
		//We can't reset to an original report....reset to the last saved report.
		var sSavedItem = widget.getSavedItem();
		if (widget.isSavedReport(sOriginalItem, sSavedItem)) {
			sOriginalItem=sSavedItem;
		}
	}
	
	var sOriginalReportPart = widget.getAttributeValue("originalReportPart");
	var sCVobjectPermissions = viewer.envParams["cv.objectPermissions"];
	
	//save the configuration info that shouldn't be deleted
	var sBpmRestURI = viewer.envParams['bpmRestURI'];
	var sGlossaryURI = viewer.envParams['glossaryURI'];
	var sMetadataInformationURI = viewer.envParams['metadataInformationURI'];
	var sRoutingServerGroup = viewer.envParams["ui.routingServerGroup"];

	delete viewer.envParams;
	viewer.envParams = {};
	viewer.envParams["ui.object"] = sOriginalItem;
	viewer.envParams["originalReport"] = sOriginalItem;
	viewer.envParams["bux"] = "true";
	viewer.envParams["cv.objectPermissions"] = sCVobjectPermissions;
	viewer.envParams["ui.routingServerGroup"] = sRoutingServerGroup;
	if( sBpmRestURI ){
		viewer.envParams['bpmRestURI'] = sBpmRestURI;
	}
	
	if( sGlossaryURI ) {
		viewer.envParams['glossaryURI'] = sGlossaryURI;
	}
	
	if( sMetadataInformationURI ) {
		viewer.envParams['metadataInformationURI'] = sMetadataInformationURI ;
	}

	var cognosViewerRequest = this.createCognosViewerDispatcherEntry( "resetToOriginal" );
	cognosViewerRequest.addFormField("run.outputFormat", "HTML");
	cognosViewerRequest.addFormField( "widget.reloadToolbar", "true");
	cognosViewerRequest.addFormField( "ui.reportDrop", "true");
	
	// fix for COGCQ00897194
	viewer.resetbHasPromptFlag();
	cognosViewerRequest.addFormField("widget.forceGetParameters", "true");

	if (filters != "") {
		cognosViewerRequest.addFormField("cv.updateDataFilters", filters);
	}

	cognosViewerRequest.addFormField("run.prompt", "false");
	
	var bIsReportPart = (sOriginalReportPart && sOriginalReportPart.length > 0);
	if ( bIsReportPart ) {
		cognosViewerRequest.addFormField( "reportpart_id", sOriginalReportPart );
	}

	viewer.hideReportInfo();

	viewer.dispatchRequest( cognosViewerRequest );

	//fire the modified event
	this.fireModifiedReportEvent();
};

ResetToOriginalAction.prototype.doAddActionContext = function()
{
	return false;
};

/*
 * We want to show reset in Global area
 * @override
 */
ResetToOriginalAction.prototype.canShowMenuInGlobalArea = function()
{
	return true;
};

/*
 * This action is 
 *  - valid on prompt part in gloabl area
 *  - valid on regular report in regular tab
 *  - not valid on prompt part in regular tab
 * 
 * @override
 */
ResetToOriginalAction.prototype.isValidMenuItem = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();
	
	if (widget.m_isInGlobalArea) {
		return (this.isPromptWidget()? true : false); 
	} else {
		return (this.isPromptWidget()? false : true); 
	}
};


/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2016
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ResizeChartAction()
{
	this.m_width = 0;
	this.m_height = 0;
	this.m_sAction = "ChangeDataContainerSize";
	this.m_bRunReport = true;
	this.m_oChart = null;
}

ResizeChartAction.prototype = new ModifyReportAction();
ResizeChartAction.prototype.isUndoable = function() { return false; };
ResizeChartAction.superclass = ModifyReportAction.prototype;
ResizeChartAction.prototype.runReport = function() { return this.m_bRunReport; };
ResizeChartAction.prototype.canBeQueued = function() { return true; };
ResizeChartAction.prototype.reuseQuery = function() { return true; };
ResizeChartAction.PADDING = {
	getWidth: function() { return 2;},
	getHeight: function() {return 2;}
};

ResizeChartAction.prototype.getActionKey = function() {
	return "ResizeChartAction";
};

ResizeChartAction.prototype.setRequestParms = function(requestParms)
{
	if(requestParms && requestParms.resize)	{
		this.m_width = parseInt(requestParms.resize.w, 10) - ResizeChartAction.PADDING.getWidth();
		this.m_height = parseInt(requestParms.resize.h, 10) - ResizeChartAction.PADDING.getHeight();
	}
};

ResizeChartAction.prototype.execute = function() {

	if (this.m_oCV.m_readyToRespondToResizeEvent !== true) {
		return; //not resize on initial loading.
	}

	if (this.m_oCV.getPinFreezeManager()) {
		//Resize a container with frozen headings.
		this.m_oCV.getPinFreezeManager().resize(this.m_width, this.m_height);
	}
	
	if (this.isActionApplicable()) {
		var charts = this.getLayoutComponents();

		if(charts && charts.length > 0) {
			//chart is displayed.
			for (var i = 0; i < charts.length; ++i) {
				if (charts[i].nodeName === "IMG" || charts[0].getAttribute("flashChart") !== null) {
					this.m_oChart = charts[i];
					break;
				}
			}

			if (this.m_oChart && this.isNewSizeDifferent()) {
				if (charts[0].getAttribute("flashChart") !== null) {
					this.m_bRunReport = false;
					this.resizeFlashChart();
				} else {
					this.m_bRunReport = true;
					this.resizeChart();
				}
			}
		}
	}
};

ResizeChartAction.prototype.isActionApplicable = function() {
	var rapReportInfo = this.m_oCV.getRAPReportInfo();
	if (rapReportInfo && rapReportInfo.isSingleContainer()) {
		return true;
	}
	return false;
};

ResizeChartAction.prototype.resizeFlashChart = function() {
	var size = this.getNewChartSize();
	this.m_oChart.setAttribute("width", size.w + "px");
	this.m_oChart.setAttribute("height", size.h + "px");
	this.resizeChart(); //update report spec.
};

ResizeChartAction.prototype.resizeChart = function()
{
	ResizeChartAction.superclass.execute.call(this);
};


ResizeChartAction.prototype.addActionContextAdditionalParms = function() {
	var returnValue = "";
	var size = this.getNewChartSize();
	returnValue += "<height>" + size.h + "px</height>";
	returnValue += "<width>" + size.w + "px</width>";

	return returnValue;
};

ResizeChartAction.prototype.isNewSizeDifferent = function() {
	var bFlashChart = (this.m_oChart.getAttribute("flashChart") !== null);
	var chartWidth = bFlashChart ? this.m_oChart.getAttribute("width") :  this.m_oChart.style.width;
	var chartHeight = bFlashChart ? this.m_oChart.getAttribute("height") :  this.m_oChart.style.height;
	if (!chartWidth || chartWidth == "") {
		chartWidth = this.m_oChart.width;
		chartHeight = this.m_oChart.height; 
	}
	return  parseInt(chartWidth, 10) != this.m_width || parseInt(chartHeight, 10) != this.m_height; 
};

ResizeChartAction.prototype.getNewChartSize = function () {

    var myChart = this.m_oChart

    var marginLeft = 0;
    var marginRight = 0;
    var marginTop = 0;
    var marginBottom = 0;

    var borderLeft = 0;
    var borderRight = 0;
    var borderTop = 0;
    var borderBottom = 0;

    var paddingLeft = 0;
    var paddingRight = 0;
    var paddingTop = 0;
    var paddingBottom = 0;

    require(["dojo/dom-style"], function (domStyle) {

        marginLeft = domStyle.get(myChart, "marginLeft");
        marginRight = domStyle.get(myChart, "marginRight");
        marginTop = domStyle.get(myChart, "marginTop");
        marginBottom = domStyle.get(myChart, "marginBottom");

        borderLeft = domStyle.get(myChart, "borderLeftWidth");
        borderRight = domStyle.get(myChart, "borderRightWidth");
        borderTop = domStyle.get(myChart, "borderTopWidth");
        borderBottom = domStyle.get(myChart, "borderBottomWidth");

        paddingLeft = domStyle.get(myChart, "paddingLeft");
        paddingRight = domStyle.get(myChart, "paddingRight");
        paddingTop = domStyle.get(myChart, "paddingTop");
        paddingBottom = domStyle.get(myChart, "paddingBottom");
    });

    this.m_width -= borderLeft + borderRight + marginLeft + marginRight + paddingLeft + paddingRight;
    this.m_height -= borderTop + borderBottom + marginTop + marginBottom + paddingTop + paddingBottom;
	if (this.m_keepRatio) {
		var ratio = parseInt(this.m_oChart.style.width, 10)/parseInt(this.m_oChart.style.height, 10);
		var newWidth = ratio * this.m_height;
		if (newWidth > this.m_width) {
			this.m_height = this.m_width / ratio;
		}
		var newHeight = this.m_width /ratio;
		if (newHeight > this.m_height) {
			this.m_width = this.m_height * ratio;
		}
	}

	return {w:this.m_width, h:this.m_height};
};

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function RetryRequestAction()
{
	this.m_lastActionParams = null;
}

RetryRequestAction.prototype = new CognosViewerAction();

RetryRequestAction.prototype.setRequestParms = function(parms)
{
	this.m_lastActionParams = parms;
};

RetryRequestAction.prototype.execute = function()
{
	if (this.m_lastActionParams) {
		var request = new ViewerDispatcherEntry(this.m_oCV);

		var formFieldNames = this.m_lastActionParams.keys();
		for (var index = 0; index < formFieldNames.length; index++) {
			request.addFormField(formFieldNames[index], this.m_lastActionParams.get(formFieldNames[index]));
		}
		
		request.addFormField("cv.responseFormat", "data");
		request.addFormField("widget.reloadToolbar", "true");
		request.addNonEmptyStringFormField("limitedInteractiveMode", this.m_oCV.envParams["limitedInteractiveMode"]);
		
		this.m_oCV.dispatchRequest(request);
		
		this.m_oCV.getViewerWidget().setOriginalFormFields(null);
	}
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 /**
 * This is the base class for generating request to re-run the report.
 * Classes derived from this will add to it their specific options.
 */
function RunReportAction()
{
	this.m_reuseQuery = false;
	this.m_promptValues = null;
	this.m_sendParameterValues = false;
	this.m_clearCascadeParamsList = null;
	
}

RunReportAction.prototype = new CognosViewerAction();

RunReportAction.prototype.setRequestParams = function( params ) {
	if( !params ){ return; }
	
	this.m_promptValues = params.promptValues;
	this.m_clearCascadeParamsList = params.clearCascadeParamsList;
};


RunReportAction.prototype.setSendParameterValues = function(sendParameterValues) {
	this.m_sendParameterValues = sendParameterValues;
};

RunReportAction.prototype.reuseQuery =function() { return this.m_reuseQuery; };
RunReportAction.prototype.setReuseQuery = function( value ) { this.m_reuseQuery = value; };
RunReportAction.prototype.getPromptOption = function() { return "false";};
RunReportAction.prototype.canBeQueued = function() { return false; };

RunReportAction.prototype.getAction = function( limitedInteractiveMode ) {
	return limitedInteractiveMode ? 'run' : 'runSpecification';
}

/**
 * Overrides base method in CognosViewerAction
 */
RunReportAction.prototype.addAdditionalOptions = function(cognosViewerRequest)
{
	this._addCommonOptions(cognosViewerRequest);
	this._addRunOptionsFromProperties(cognosViewerRequest);
	this._addClearCascadeParams( cognosViewerRequest );
	this._addPromptValuesToRequest( cognosViewerRequest );


};

RunReportAction.prototype._addClearCascadeParams = function( oReq )
{
	if( !this.m_clearCascadeParamsList || this.m_clearCascadeParamsList.length == 0){
		return;
	}

	var iCount = this.m_clearCascadeParamsList.length;
	for( var i=0; i <iCount; i++){
		oReq.addFormField('c' + this.m_clearCascadeParamsList[i], '1');//adding bogus value so viewer won't reject the parameter.
	}
};
RunReportAction.prototype._addPromptValuesToRequest = function( cognosViewerRequest )
{
	if ( !this.m_promptValues ){ return; }
	
	cognosViewerRequest.addFormField("sharedPromptRequest", "true");
	for (var promptValue in this.m_promptValues)
	{
		cognosViewerRequest.addFormField( promptValue, this.m_promptValues[promptValue] );
	}
	
};


RunReportAction.prototype._addCommonOptions = function(oReq)
{
	var limitedInteractiveMode = this.getCognosViewer().isLimitedInteractiveMode();
	if( typeof this.m_action === "undefined" )
	{
		this.m_action = this.getAction( limitedInteractiveMode );
	}

	oReq.addFormField("run.prompt", this.getPromptOption());
	oReq.addFormField("ui.action", this.m_action);

	if( limitedInteractiveMode )
	{
		oReq.addFormField("run.xslURL", "bux.xsl");
	}

	oReq.addFormField("run.outputFormat", "HTML");

	if( this.reuseQuery() === true )
	{
		oReq.addFormField("reuseResults", "true");
	}
};


RunReportAction.prototype._addRunOptionsFromProperties = function(oReq)
{
	var properties = this.getCognosViewer().getViewerWidget().getProperties();
	if (properties.getRowsPerPage() != null)
	{
		oReq.addFormField("run.verticalElements", properties.getRowsPerPage());
	}
};

/**
 * Overrides base method in CognosViewerAction
 */
RunReportAction.prototype.execute = function()
{
	var oReq = this.createCognosViewerDispatcherEntry(this.m_action);
	oReq.setCanBeQueued( this.canBeQueued() );

	if( (this.m_action === "forward" || this.m_action === "back") && ( typeof this.m_bAbortAction === "undefined" || this.m_bAbortAction === true ) )
	{
		return false;
	}
	
	var oCV = this.getCognosViewer();
	if (this.m_sendParameterValues && oCV.envParams["delayedLoadingExecutionParams"]) {
		oReq.addFormField("delayedLoadingExecutionParams", oCV.envParams["delayedLoadingExecutionParams"]);
		delete oCV.envParams["delayedLoadingExecutionParams"];
	}

	this.getCognosViewer().dispatchRequest(oReq);
	return true;
};

RunReportAction.prototype.doAddActionContext = function()
{
	return false;
};

RunReportAction.prototype.updateMenu = function(json)
{
	json.visible = !this.isPromptWidget();
	return json;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 


/**
 * This class should only be used in the case where there is delayed loading
 * of report.
 */
 function BuxRunReportAction()
 {
	 BuxRunReportAction.baseConstructor.call();
 }
 
 BuxRunReportAction.prototype = new RunReportAction();
 BuxRunReportAction.baseConstructor = RunReportAction;
 BuxRunReportAction.prototype.canBeQueued = function() { return true; };
 
 BuxRunReportAction.prototype.getAction = function( limitedInteractiveMode ) {
		return limitedInteractiveMode ? 'runBux' : 'buxRunSpec';
};
 

 
 

 
 /*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function RefreshAction()
{
	this.m_sAction = "Refresh";
}

RefreshAction.prototype = new RunReportAction();
RefreshAction.superclass = RunReportAction.prototype;

RefreshAction.prototype.execute = function()
{
	RefreshAction.superclass.execute.call(this);
};/*
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

function GetParametersAction()
{
	this.m_payload = "";
	this.isPrimaryPromptWidget = false;
	this.m_requestParamsCopy = null;
}

GetParametersAction.prototype = new RunReportAction();

GetParametersAction.prototype.setRequestParms = function(payload)
{
	this.m_payload = payload;
};


/*
 * Adds the options to the request that is sent to the server
 */
GetParametersAction.prototype.addRequestOptions = function(asynchRequest)
{
	asynchRequest.addFormField("asynch.alwaysIncludePrimaryRequest", "false" );
	asynchRequest.addFormField("ui.action", "getParameters" );
	asynchRequest.addFormField("ui.spec", this.m_oCV.envParams["ui.spec"] );
	asynchRequest.addFormField("ui.object", this.m_oCV.envParams["ui.object"] );
	asynchRequest.addFormField("isPrimaryPromptWidget", this.isPrimaryPromptWidget? "true" : "false" );
	asynchRequest.addFormField("parameterValues", this.m_oCV.getExecutionParameters());
	if (this.m_oCV.envParams["bux"] == "true") {
		asynchRequest.addFormField("bux", "true");
	}
};

GetParametersAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();
	
	var asynchRequest = new AsynchJSONDispatcherEntry(oCV);
	asynchRequest.setCallbacks({
		"complete": {"object": this, "method": this.handleGetParametersResponse}
		});

	this.addRequestOptions( asynchRequest );
	// save prompt params
	if (oCV.getActiveRequest()) {
		this.m_requestFormFieldsCopy = oCV.getActiveRequest().getFormFields();
	}

	// special case where we don't want to go through the ViewerDispatcher
	// since we don't want this request to get queue. We need to get the parameter information
	// asap so the other reports on the canvas can start executing with the new prompt information
	asynchRequest.sendRequest();
};


GetParametersAction.prototype.handleGetParametersResponse = function (asynchResponse)
{
	try
	{
		var jsonResponse = asynchResponse.getResult();
		var response = jsonResponse.xml;
		var cognosViewer = this.getCognosViewer();
		var viewerWidget = cognosViewer.getViewerWidget();
		
		if (typeof response != "undefined" && response != null) {
			var sReportPrompts = xml_decode(response);
			this.m_oCV.envParams["reportPrompts"] = sReportPrompts;
			if (this.isPrimaryPromptWidget) {
				this.m_oCV.raisePromptEvent(sReportPrompts, this.m_requestFormFieldsCopy);
			}
			else {
				viewerWidget.sharePrompts(this.m_payload);
			}
		}

		if (typeof viewerWidget != "undefined") {
			viewerWidget.promptParametersRetrieved = true;
			// do we need to re-add the Reprompt button to the toolbar ?
			var savedRepromptButton = viewerWidget.getButtonFromSavedToolbarButtons("Reprompt");
			if (typeof savedRepromptButton != "undefined" && savedRepromptButton != null) {
				var blueDotMenu = cognosViewer.findBlueDotMenu();
				if (cognosViewer.addedButtonToToolbar(blueDotMenu, savedRepromptButton.button, "Refresh", savedRepromptButton.position)) {
					cognosViewer.resetbHasPromptFlag();
					viewerWidget.updateToolbar();
				}
				viewerWidget.removeFromSavedToolbarButtons("Reprompt");
			}
		}
	}
	catch(e) {	}
};
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

function RepromptAction()
{
	this.m_repromptAction = null;
}

RepromptAction.prototype = new CognosViewerAction();
RepromptAction.superclass = CognosViewerAction.prototype;

RepromptAction.prototype.updateMenu = function( jsonSpec )
{
	var oCV = this.getCognosViewer();
	jsonSpec.visible =  (!this.isPromptWidget() && oCV.hasPrompt() );
	if (!jsonSpec.visible) {
		jsonSpec.save = true;
	} else {
		delete jsonSpec.save;
	}
	return jsonSpec;
};

RepromptAction.prototype.setRequestParms = function(params) {
	RepromptAction.superclass.setRequestParms(params);
	if (params && params["preferencesChanged"]) {
		this["preferencesChanged"] = params["preferencesChanged"];
	}
};

RepromptAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();
	if( oCV.isLimitedInteractiveMode())
	{
		this.m_repromptAction = new RepromptRunAction();
	}
	else
	{
		this.m_repromptAction = new RepromptRAPAction();
	}

	this.m_repromptAction.setCognosViewer( oCV );
	if (this["preferencesChanged"]) {
		this.m_repromptAction.reuseConversation(false);
	}
	this.m_repromptAction.execute();
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function RepromptRAPAction()
{
	this.m_sAction = "Reprompt";
}

RepromptRAPAction.prototype = new ModifyReportAction();

RepromptRAPAction.prototype.getPromptOption = function() { return "true"; };

RepromptRAPAction.prototype.isUndoable = function() { return false; };

RepromptRAPAction.prototype.reuseQuery =function() { return false; };

RepromptRAPAction.prototype.reuseGetParameter =function() { return false; };

RepromptRAPAction.prototype.keepFocusOnWidget = function() { return false; };

RepromptRAPAction.prototype.preProcess =function()
{
	var cv = this.getCognosViewer();
	cv.m_raiseSharePromptEvent = true;
};

RepromptRAPAction.prototype.addAdditionalOptions = function(cognosViewerRequest)
{
	cognosViewerRequest.addFormField("run.outputFormat", "HTML");
	cognosViewerRequest.addFormField("bux", "true");		
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function RepromptRunAction(){}

RepromptRunAction.prototype = new RunReportAction();

RepromptRunAction.prototype.reuseQuery =function() { return false; };

RepromptRunAction.prototype.reuseGetParameter =function() { return false; };

RepromptRunAction.prototype.preProcess =function()
{
	var cv = this.getCognosViewer();
	cv.m_raiseSharePromptEvent = true;
};

RepromptRunAction.prototype.getPromptOption = function() { return "true"; };

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 function SelectionAction() {}
SelectionAction.prototype = new CognosViewerAction();

SelectionAction.prototype.onMouseOver = function(evt)
{
	if(DragDropAction_isDragging(evt) == false)
	{
		var selectionController = this.getCognosViewer().getSelectionController();
		selectionController.pageHover(evt);
	}
};

SelectionAction.prototype.onMouseOut = function(evt)
{
	if(DragDropAction_isDragging(evt) == false)
	{
		var selectionController = this.getCognosViewer().getSelectionController();
		selectionController.pageHover(evt);
	}
};

SelectionAction.prototype.hasPermission = function()
{
	var oCV = this.getCognosViewer();

	return !( oCV.isLimitedInteractiveMode() || oCV.envParams['cv.objectPermissions'].indexOf( 'read' ) === -1 );
};

SelectionAction.prototype.executeDrillUpDown = function(evt)
{
	var oCV = this.getCognosViewer();
	var oWidget = oCV.getViewerWidget();
	if (oCV.isDrillBlackListed() || (oWidget && oWidget.isSelectionFilterEnabled())) {
		return false;
	}
	

	if(evt.button == 0 || evt.button == 1 || evt.keyCode == "13")
	{
		// check to see if we're hovering over a drillable item and the cell is selected. If so, invoke the drill action
		var ctxNode = getCtxNodeFromEvent(evt);
		if(ctxNode != null)
		{
			var selectionController = this.m_oCV.getSelectionController();

			var descriptionNode = ctxNode.getAttribute("type") != null ? ctxNode : ctxNode.parentNode;
			var type = descriptionNode.getAttribute("type");

			var ctxValue = ctxNode.getAttribute("ctx");
			ctxValue = ctxValue.split("::")[0].split(":")[0];

			if((descriptionNode.getAttribute("CTNM") != null || type == "datavalue") && selectionController.getMun(ctxValue) != "")
			{
				var selectedObjects = selectionController.getAllSelectedObjects();
				for(var index = 0; index < selectedObjects.length; ++index)
				{
					var selectedObject = selectedObjects[index];
					if(selectedObject.getCellRef() == ctxNode.parentNode)
					{
						if (selectedObjects.length>1) {
							selectionController.clearSelectedObjects();
							selectionController.addSelectionObject(selectedObject);
						}
						var factory = this.m_oCV.getActionFactory();
						var drillAction = factory.load("DrillUpDown");
						drillAction.updateDrillability(this.m_oCV, ctxNode);
						if (drillAction.drillability > 0 && this.hasPermission()) {
							drillAction.execute();
							return true;
						}
					}
				}
			}
		}
	}

	return false;
};

SelectionAction.prototype.executeDrillThrough = function(evt)
{
	var oWidget = this.getCognosViewer().getViewerWidget();
	if (oWidget && oWidget.isSelectionFilterEnabled()) {
		return;
	}
	
	// try and see if there's a drill through
	var oDrillMgr = this.getCognosViewer().getDrillMgr();
	return oDrillMgr.getDrillThroughParameters('execute', evt);
};


SelectionAction.prototype.pageClicked = function(evt) {
	var bDrillThroughExecuted = false;
	var leftMouseButton = evt.which ? evt.which == 1 : evt.button == 1;
	var cvSort = new CognosViewerSort(evt, this.m_oCV);
	var sClass, crossBrowserNode = getCrossBrowserNode(evt);

try {
	sClass = (crossBrowserNode && crossBrowserNode.className) || "";
}
catch (ex) {
	sClass = "";
	// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
}
	var oCV = this.getCognosViewer();
	var selectionController = null;

	if(leftMouseButton && cvSort.isSort(evt) && !oCV.isLimitedInteractiveMode() && !oCV.isBlacklisted("Sort") )
	{
		cvSort.execute();
	}
	else if(leftMouseButton && sClass.indexOf("expandButton") > -1 ) {

		var nNode = crossBrowserNode;

		if(sClass.indexOf("expandButtonCaption") > -1) {
			nNode = nNode.parentNode;
			sClass = nNode.className;
		}

		selectionController = getCognosViewerSCObjectRef(this.m_oCV.getId());
		selectionController.selectSingleDomNode(nNode.parentNode);

		var oAction;
		if(sClass.indexOf("collapse") === -1 ) {
			oAction = new ExpandMemberAction();
		} else {
			oAction = new CollapseMemberAction();
		}

		oAction.setCognosViewer(oCV);
		oAction.execute();
	}
	else
	{
		selectionController = this.m_oCV.getSelectionController();
		if(this.executeDrillUpDown(evt) === false)
		{
			var oCVWidget = this.m_oCV.getViewerWidget();
			if( oCVWidget.isSelectionFilterEnabled() ){
				if( leftMouseButton || evt.keyCode === 13 ){
					oCVWidget.preprocessPageClicked( false /*invokingContextMenu*/, evt);
				} else {
					//if we get here, it means that context menu is invoked and previous selections should be saved if it hasn't been yet.
					oCVWidget.preprocessPageClicked( true /*invokingContextMenu*/);
				}
			}			

			if (selectionController.pageClicked(evt) != false) {
				this.m_oCV.getViewerWidget().updateToolbar();
				selectionController.resetAllowHorizontalDataValueSelection();
			} 
			

			setNodeFocus(evt);
		}
		if (leftMouseButton || evt.keyCode === 13)
		{
			bDrillThroughExecuted = this.executeDrillThrough(evt);
		}
		
		if(leftMouseButton && this.m_oCV.getViewerWidget() && this.m_oCV.getViewerWidget().onSelectionChange) {
			this.m_oCV.getViewerWidget().onSelectionChange();
		}
	}

	return bDrillThroughExecuted;
};

SelectionAction.prototype.mouseActionInvolvesSelection = function(evt) {
	var leftMouseButton = evt.which ? evt.which == 1 : evt.button == 1;
	var cvSort = new CognosViewerSort(evt, this.m_oCV);

	if (leftMouseButton && cvSort.isSort(evt)) {
		return false;
	}

	if (this.executeDrillUpDown(evt) !== false) {
		return false;
	}

	return true;
};

SelectionAction.prototype.onMouseDown = function(evt)
{
	this.delegateClickToMouseUp = false;
	if (this.mouseActionInvolvesSelection(evt) && !this.m_oCV.getSelectionController().shouldExecutePageClickedOnMouseDown(evt)) {
		this.delegateClickToMouseUp = true;
		return false;
	}
	return this.pageClicked(evt);
};

SelectionAction.prototype.onMouseUp = function(evt, consumed)
{
	var ret = false;
	if(!consumed && this.mouseActionInvolvesSelection(evt) && this.delegateClickToMouseUp) {
		ret = this.pageClicked(evt);
	}
	this.delegateClickToMouseUp = false;
	return ret;
};

SelectionAction.prototype.onKeyDown = function(evt)
{
	this.pageClicked(evt);
};

SelectionAction.prototype.onDoubleClick = function(evt)
{
	// This is called by onDoubleClick from ViewerIWidget.js,
	// because the action we get from ActionFactory_loadActionHandler will be the SelectionAction.
	// Try to determine the drillability and run the drill action if available.
	// This is mostly the case for a chart type.
	// This approach is consistent with what happens when we use the context menu for drill up and down.
	var viewerObject = this.m_oCV;
	
	var oWidget = viewerObject.getViewerWidget();
	if (viewerObject.isDrillBlackListed() || (oWidget && oWidget.isSelectionFilterEnabled())) {
		return;
	}
	
	if(viewerObject.getStatus() == "complete")
	{
		var drillManager = viewerObject.getDrillMgr();
		var sDrillAction = "DrillDown";
		var sPayload = "DrillDown";
		var canDrillDown = false;
		var canDrillUp = false;

		if(drillManager != null)
		{
			if( !this.hasPermission() )
			{
				return true;
			}

			var selObj = drillManager.getSelectedObject();
			if (selObj == null ||
				(selObj.m_dataContainerType=="list" && selObj.m_sLayoutType=="columnTitle"))
			{
				//Can't drill up or down with no selections OR on a list column title.
				return true;
			}

			var drillOptions = selObj.getDrillOptions();
			if (typeof drillOptions == "undefined" || drillOptions == null || !drillOptions.length)
			{
				return true;
			}

			canDrillDown = drillManager.canDrillDown();
			if (!canDrillDown)
			{
				// We might be at the leaf level.
				// See if we can drill up and execute the action if this is the case.
				canDrillUp = drillManager.canDrillUp();
				if (canDrillUp)
				{
					sDrillAction = "DrillUp";
					sPayload = "DrillUp";
				}
			}

			// If we can drill down or up execute the action, otherwise do nothing (do not reload).
			if (canDrillDown || canDrillUp)
			{
				viewerObject.executeAction(sDrillAction, sPayload);
			}
		}
		else
		{
			return true;
		}
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function SelectionFilterSwitchAction()
{
	this.m_sAction = "SelectionFilterSwitch";
}

SelectionFilterSwitchAction.prototype = new CognosViewerAction();

SelectionFilterSwitchAction.prototype.updateMenu = function(jsonSpec)
{	
	//jsonSpec.visible = true;
	if (this.getCognosViewer().getViewerWidget().isSelectionFilterEnabled())
	{
		jsonSpec.disabled = false;
		jsonSpec.checked = true;
		jsonSpec.iconClass = 'selectionFilterEnabled';
		jsonSpec.label = RV_RES.IDS_JS_SELECTION_FILTER_SWITCH_DISABLE;
	}
	else
	{
		jsonSpec.disabled = false;
		jsonSpec.checked = false;
		jsonSpec.iconClass = 'selectionFilter';
		jsonSpec.label = RV_RES.IDS_JS_SELECTION_FILTER_SWITCH;
	}

	return jsonSpec;
};

SelectionFilterSwitchAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();
	var oVWidget = oCV.getViewerWidget();
	
	var oldSwitch = oVWidget.isSelectionFilterEnabled();
	
	// Turning off, so we need to clear the filters before we actually flip the switch in our code
	// since our code checks the boolean before sending the event
	if (oldSwitch) {
		if (oVWidget.selectionFilterSent()) {
			oVWidget.clearSelectionFilter();
		}
	} 
	
	oVWidget.toggleSelectionFilterSwitch();
	oVWidget.updateToolbar();
	oVWidget.onContextMenu({}); //Populates context menu payload with correct state. 

	// Turning on
	if (!oldSwitch) {
		if (oVWidget.somethingSelected()) {
			oVWidget.broadcastSelectionFilter();
		}
	}
	
	oVWidget.updateDrillThroughLinks();
	oVWidget.fireEvent("com.ibm.bux.widget.modified", null, {'modified':true});
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */


function SharePromptAction()
{
	this.m_bAbortAction = true;
}

SharePromptAction.prototype = new RunReportAction();

SharePromptAction.prototype.preProcess = function()
{
	var cv = this.getCognosViewer();
	cv.disableRaiseSharePromptEvent();
};

SharePromptAction.prototype.setRequestParms = function(payload)
{
	this.m_sharePromptParameters = payload.parameters;
	this.m_action = "forward";
};

/**
 * Parse the prompt parameters, and try to match them by parameter name first then model item,
 * if a potential match is found save in an instance member to add later to the request.
 *
 * @param {Object} promptParameters
 * @return (Boolean) True if a potential match is found
 * @author Osmani Gomez
 */
SharePromptAction.prototype.parsePromptParameters = function()
{
 	var result = false;
	var reportParameterNodes = this.getReportParameterNodes();

	if (reportParameterNodes) {
		var promptParameters = this.m_sharePromptParameters;
		var requestParams = {};
		var usedModelItems = [];
	
		for (var i in promptParameters) {
			var promptParameterName = promptParameters[i].parmName;
			var promptModelItem = promptParameters[i].modelItem;
			var sName = null;
			var sValue = null;
			var matchedByModelItem = false;
			var modelItemMatchedParams = {};
		
			for (var j in reportParameterNodes) {
				var targetParameterName = reportParameterNodes[j].getAttribute("parameterName");
				var targetModelItem = reportParameterNodes[j].getAttribute("modelItem");
			
				if ((typeof targetParameterName !== "undefined" && targetParameterName === promptParameterName) ||
					(typeof targetModelItem !== "undefined" && promptModelItem !== "undefined" && promptModelItem !== "" && 
					targetModelItem === promptModelItem && !this.arrayContains(usedModelItems, targetModelItem)))
				{
					result = true;
					sName = 'p_' + targetParameterName;
					sValue = this.getSharedPromptValue(promptParameters[i], reportParameterNodes[j]);
				
					if (targetParameterName === promptParameterName) {
						requestParams[sName] = sValue;
						usedModelItems.push(targetModelItem);
						matchedByModelItem = false;
						break;				
					} else {
						modelItemMatchedParams[sName] = sValue;
						matchedByModelItem = true;
					}
				}
			}
		
			if (matchedByModelItem) {
				for (var x in modelItemMatchedParams) {
					requestParams[x] = modelItemMatchedParams[x];
				}
			}
		}

		if (result) {
			this.m_bAbortAction = false;
			this.m_promptValues = requestParams;
		}
	}
	
	return result;
};
 
SharePromptAction.prototype.getSharedPromptValue = function(promptParameter, reportParameterNode)
{
	var sValue = null;
	var promptValue = promptParameter.parmValue;
	var multivaluedPrompt = this._isPromptParamMultiValued(promptParameter.multivalued, promptValue);
	var hasSelectOption = new RegExp(/^<selectChoices><selectOption/);
	
	// if shared prompt param -> many, report param -> one, only one option can be used
	if ( multivaluedPrompt && reportParameterNode.getAttribute( "multivalued" ) == null && promptValue.match(hasSelectOption)) {
		// make sure only one option is used, extract the the first one
		var reOneOption = new RegExp(/^(<selectChoices><selectOption.*?><)/);
		var extractedMatch = reOneOption.exec(promptValue);
		sValue = extractedMatch[1] + '/selectChoices>';
	} else {
		sValue = promptValue;
	}
	
	return sValue;
};

SharePromptAction.prototype.arrayContains = function(array, value)
{
	var found = false;
	
	for (var i = 0; i < array.length; i++) {
		if (array[i] === value) {
			found = true;
			break;
		}
	}
	
	return found;
};

SharePromptAction.prototype.getPromptValues = function()
{
	if( !this.m_promptValues )
	{
		this.parsePromptParameters();
	}
	
	return this.m_promptValues;
};

/*
 * Safer check for multivalue, in certain cases GetParameters won't return multivalued when it should,
 *
*/
SharePromptAction.prototype._isPromptParamMultiValued = function(multiValuedParamInfo, promptValue)
{
	var result = false;
	if ( multiValuedParamInfo != "undefined" && multiValuedParamInfo) {
		result = true;
	} else {
		var reIsMulti = new RegExp(/^<selectChoices><selectOption.*?>\s*<selectOption/);
		if (promptValue.match(reIsMulti)) {
			result = true;
		}
	}
	return result;
};

SharePromptAction.prototype.getReportParameterNodes = function()
{
	var cv = this.getCognosViewer();
	var reportParameterNodes = null;
	try {
		if (cv.envParams && cv.envParams.reportPrompts) {
			var reportParameters = cv.envParams.reportPrompts;
			var xmlDom = XMLBuilderLoadXMLFromString(reportParameters);
			if (!(xmlDom && xmlDom.childNodes && xmlDom.childNodes.length > 0 && xmlDom.childNodes[0].nodeName === "parsererror")) {
				var cvTransientSpec = xmlDom.firstChild;
				var reportParametersNode = XMLHelper_FindChildByTagName(cvTransientSpec, "reportParameters", true);
				reportParameterNodes = XMLHelper_FindChildrenByTagName(reportParametersNode, "reportParameter", false);
			}
		}
	}
	catch ( e ) {}
	return reportParameterNodes;
};



SharePromptAction.prototype.executePrompt = function ()
{
	if (this.getPromptValues() !== null )
	{
		this.execute();
		return true;
	}
	return false;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function SnapshotsAction() {}
SnapshotsAction.prototype = new CognosViewerAction();

SnapshotsAction.prototype.updateMenu = function(jsonSpec) {
	var widget = this.m_oCV.getViewerWidget();
	jsonSpec.disabled = (widget.getAttributeValue("reportCreatedInCW") == "true") || (widget.getAttributeValue("fromReportPart") == "true") || (this.m_oCV.envParams["reportpart_id"] && this.m_oCV.envParams["reportpart_id"].length) > 0 ? true : false;
	jsonSpec.visible = !this.isPromptWidget();
	return jsonSpec;
};

SnapshotsAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	if (widget.getSavedOutputsCMResponse() == null)	{
		this.queryCMForSavedOutputs({"complete" : {"object" : this, "method" : this.handleQueryResponse}});
	} 
	else if (typeof widget.savedOutputMenuUpdated != "undefined" && widget.savedOutputMenuUpdated == false) {
		this.populateMenu(true);
		widget.savedOutputMenuUpdated = true;
	}
};

SnapshotsAction.prototype.queryCMForSavedOutputs = function(callback) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();

	var searchPath = "";
	var formWarpRequest = document.getElementById("formWarpRequest" + oCV.getId());
	if (oCV.envParams["originalReport"])
	{
		searchPath = oCV.envParams["originalReport"];
	}
	else if (formWarpRequest && formWarpRequest["reRunObj"] != null && formWarpRequest["reRunObj"].value.length > 0)
	{
		searchPath = formWarpRequest["reRunObj"].value;
	}
	else
	{
		searchPath = oCV.envParams["ui.object"];
	}
	searchPath += "/reportVersion/*[@format='HTML' or @format='XHTML']/..";

	var cmRequest =
		"<CMRequest>" +
			"<searchPath>" + xml_encode(searchPath) + "</searchPath>" +
			"<properties>" +
				"<property>searchPath</property>" +
				"<property>creationTime</property>" +
				"<property>storeID</property>" +
			"</properties>" +
			"<sortBy>" +
				"<sortItem>" +
					"<property>creationTime</property>" +
					"<order>descending</order>" +
				"</sortItem>" +
			"</sortBy>" +
		"</CMRequest>";

	var request = new DataDispatcherEntry(oCV);
	request.addFormField("ui.action", "CMRequest");
	request.addFormField("cv.responseFormat", "CMRequest");
	request.addFormField("ui.object", searchPath);
	request.addFormField("CMRequest", cmRequest);
	request.setCallbacks(callback);
	oCV.dispatchRequest(request);	
};

SnapshotsAction.prototype.setSavedOutputsCMResponse = function(response) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	
	var xmlParsedCMresponse = XMLBuilderLoadXMLFromString(response.getResult());
	widget.setSavedOutputsCMResponse(xmlParsedCMresponse);	
};

SnapshotsAction.prototype.handleQueryResponse = function(response) {
	this.setSavedOutputsCMResponse(response);
	this.populateMenu(true);
};

SnapshotsAction.prototype.canShowLiveMenuItem = function() {
	var oCV = this.getCognosViewer();
	return ( oCV.envParams["cv.responseFormat"] !== "activeReport" && (oCV.isLimitedInteractiveMode() || (oCV.envParams["cv.objectPermissions"] && oCV.envParams["cv.objectPermissions"].indexOf("execute") != -1)) );
};

SnapshotsAction.prototype.getMenuItemActionClassHandler = function() {
	var oCV = this.getCognosViewer();
	return oCV.envParams["cv.responseFormat"] === "activeReport" ? "ViewActiveReport" : "ViewSavedOutput";	
};

SnapshotsAction.prototype.populateMenu = function(bOpen) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	var sAction = oCV.envParams["ui.action"];

	var cmResponse = widget.savedOutputsCMResponse;

	var root = oCV.findBlueDotMenu();
	root.open = bOpen;
	var buttonSpec = oCV.findToolbarItem("Snapshots", root);

	var queryResult = XMLHelper_FindChildByTagName(cmResponse, "result", true);
	var queryItems = XMLHelper_FindChildrenByTagName(queryResult, "item", false);

	var menuItems = [];
	var mostRecentCreationTime = null;
	var mostRecentStoreID = null;
	var oMenuItem = null;
	var bSameAsCurrent;

	if ( this.canShowLiveMenuItem() ) {
		bSameAsCurrent = (sAction != "view" && sAction != "buxView" && oCV.getStatus() !== "fault");

		oMenuItem = { name: "live", label: RV_RES.IDS_JS_SNAPSHOTS_LIVE, action: bSameAsCurrent ? {} : { name: "RunSavedOutputReport", payload: {} }, items: null };
		this.addMenuItemChecked(bSameAsCurrent, oMenuItem);
		menuItems.push(oMenuItem);
		if (queryItems.length > 0) {
			menuItems.push({separator: true});
		}
	}

	if (queryItems.length > 0) {
		var actionClassHanlder = this.getMenuItemActionClassHandler();		
		var versions = [];
		for (var iIndex=0; iIndex < queryItems.length; iIndex++) {
			if (iIndex < 5) {
				var queryItem = queryItems[iIndex];
				var sItemLabel = XMLHelper_GetText(XMLHelper_FindChildByTagName(queryItem, "creationTime_localized", true));
				sItemLabel = enforceTextDir(sItemLabel);
				var storeIDNode = XMLHelper_FindChildByTagName(queryItem, "storeID", true);
				var sStoreID = XMLHelper_GetText(XMLHelper_FindChildByTagName(storeIDNode, "value", true));

				var creationTimeNode = XMLHelper_FindChildByTagName(queryItem, "creationTime", true);
				var sCreationTime = XMLHelper_GetText(XMLHelper_FindChildByTagName(creationTimeNode, "value", true));

				if (mostRecentCreationTime == null) {
					mostRecentCreationTime = sCreationTime;
					mostRecentStoreID = sStoreID;
				}
				
				bSameAsCurrent = (sAction == "view" || sAction == "buxView") && oCV.envParams["creationTime"] == sCreationTime && widget.getSavedOutputSearchPath() != null;
				oMenuItem = { name: "savedOutput", label: sItemLabel, action: bSameAsCurrent ? {} : { name: actionClassHanlder, payload: {obj:sStoreID, creationTime:sCreationTime, mostRecent:false} }, items: null };
				this.addMenuItemChecked(bSameAsCurrent, oMenuItem);
				versions.push(oMenuItem);
			}
			else {
				versions.push({ name: "viewAllSnapshots", label: RV_RES.IDS_JS_VIEW_ALL_SNAPSHOTS, action: { name: "ViewAllSnapshots", payload: {} }, items: null });
				break;
			}
		}

		bSameAsCurrent = false;
		if (widget.getSavedOutputSearchPath() == null && (sAction == "view" || sAction == "buxView")) {
			bSameAsCurrent = true;
		}

		oMenuItem = { name: "savedOutput", label: RV_RES.IDS_JS_MOST_RECENT_SNAPSHOT, action: bSameAsCurrent ? {} : { name: actionClassHanlder, payload: {obj:mostRecentStoreID, creationTime:mostRecentCreationTime, mostRecent:true} }, items: null };
		this.addMenuItemChecked(bSameAsCurrent, oMenuItem);
		menuItems.push(oMenuItem);
		menuItems.push({separator: true});
		menuItems = menuItems.concat(versions);
	}

	buttonSpec.open = bOpen;
	buttonSpec.items = menuItems;

	var updateItems = [];
	updateItems.push(buttonSpec);
	widget.fireEvent("com.ibm.bux.widgetchrome.toolbar.update", null, updateItems);
};

SnapshotsAction.prototype.resetMenu = function(bOpen) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();

	var root = oCV.findBlueDotMenu();
	var buttonSpec = oCV.findToolbarItem("Snapshots", root);
	if (buttonSpec) {
		buttonSpec.open = false;

		var menuItems = [{ name: "loadng", label: RV_RES.GOTO_LOADING, iconClass: "loading"}];
		buttonSpec.items = menuItems;

		var updateItems = [buttonSpec];
		widget.fireEvent("com.ibm.bux.widgetchrome.toolbar.update", null, updateItems);
	}
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function SwapRowsAndColumnsAction()
{
	this.m_sAction = "SwapRowsAndColumns";

}
SwapRowsAndColumnsAction.prototype = new ModifyReportAction();

SwapRowsAndColumnsAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_SWAP_ROWS_AND_COLUMNS;
};

/**
 * List of display types that do not support SwapRowsAndColumns
 */
SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported = {
	winLossChart : true,
	progressiveChart : true,
	list : true
};

SwapRowsAndColumnsAction.prototype.canSwap = function()
{

	if( this.reportHasOneObjectOnly())
	{
		return this.isCurrentObject_singlePart_SupportedChartOrCrosstab();
	}
	else
	{
		return this.isSelectedObject_SupportedChartOrCrosstab();
	}

};

SwapRowsAndColumnsAction.prototype.reportHasOneObjectOnly = function()
{
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
	if (oRAPReportInfo) {
		return ( oRAPReportInfo.getContainerCount() == 1 );
	}
	
	return false;
};

SwapRowsAndColumnsAction.prototype.isSelectedObject_SupportedChartOrCrosstab = function()
{

	var reportInfo = this.getSelectedReportInfo();
	return (reportInfo && !SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported[reportInfo.displayTypeId]);

};

SwapRowsAndColumnsAction.prototype.isCurrentObject_singlePart_SupportedChartOrCrosstab = function()
{
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
	if (oRAPReportInfo) {
		if (oRAPReportInfo.getContainerCount() === 1) {
			var displayTypeId = oRAPReportInfo.getContainerFromPos(0).displayTypeId;
			if (displayTypeId && !SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported[ displayTypeId ] ) {
				return true;
			}
		}
	}
	return false;
};

SwapRowsAndColumnsAction.prototype.keepRAPCache = function()
{
	return false;
};

SwapRowsAndColumnsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	jsonSpec.disabled = !this.canSwap();
	jsonSpec.iconClass = jsonSpec.disabled ? 'disabledSwap' : 'swap';
	return jsonSpec;
};

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function UndoRedoAction(){}
UndoRedoAction.prototype = new CognosViewerAction();

UndoRedoAction.prototype.dispatchRequest = function(filters, action)
{
	var cognosViewerRequest = null;
	var undoObj = null;
	var undoRedoQueue = this.getUndoRedoQueue();

	if (action == "Undo")
	{
		undoObj = undoRedoQueue.moveBack();
	}
	else
	{
		undoObj = undoRedoQueue.moveForward();
	}

	if (action == "Undo" && undoObj && undoObj.undoCallback) {
		undoObj.undoCallback();
		this.getCognosViewer().getViewerWidget().updateToolbar();	
	} 
	else if (action == "Redo" && undoObj && undoObj.redoCallback) {
		undoObj.redoCallback();	
		this.getCognosViewer().getViewerWidget().updateToolbar();
	}
	else 
	{
		var widgetProperties = this.getCognosViewer().getViewerWidget().getProperties();
	
		if (widgetProperties && undoObj.widgetProperties)
		{
			widgetProperties.doUndo(undoObj.widgetProperties);
		}
	
		var cognosViewerRequest = new ViewerDispatcherEntry(this.getCognosViewer());
		
		if (typeof undoObj.spec != "undefined")
		{
			cognosViewerRequest.addFormField("ui.action", "undoRedo");
			cognosViewerRequest.addFormField("ui.spec", undoObj.spec);
			cognosViewerRequest.addFormField("executionParameters", undoObj.parameters);
		}
		else
		{
			cognosViewerRequest.addFormField("ui.action", "undoRedo");
			cognosViewerRequest.addFormField("ui.conversation", undoObj.conversation);
		}
	
		if (typeof undoObj.hasAVSChart != "undefined")
		{
			cognosViewerRequest.addFormField("hasAVSChart", undoObj.hasAVSChart);
		}
	
		if (widgetProperties && widgetProperties.getRowsPerPage() != null) {
			cognosViewerRequest.addFormField( "run.verticalElements", widgetProperties.getRowsPerPage() );
		}
	
		if(filters != "")
		{
			cognosViewerRequest.addFormField("cv.updateDataFilters", filters);
		}
	
		if (typeof undoObj.infoBar == "string")
		{
			cognosViewerRequest.addFormField("rap.reportInfo", undoObj.infoBar);
		}
		else
		{
			cognosViewerRequest.addFormField("rap.reportInfo", "{}");
		}
	
		cognosViewerRequest.addFormField("run.prompt", "false");
	
		cognosViewerRequest.setCallbacks( {
			"closeErrorDlg" : {"object" : undoRedoQueue, "method" : undoRedoQueue.handleCancel}
		});	
		
		this.getCognosViewer().dispatchRequest(cognosViewerRequest);
	}
	
	this.fireModifiedReportEvent();
};

UndoRedoAction.prototype.execute = function()
{
	this.gatherFilterInfoBeforeAction(this.m_sAction);
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function UndoAction()
{
	this.m_sAction = "Undo";
}
UndoAction.prototype = new UndoRedoAction();

UndoAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.getCognosViewer().isLimitedInteractiveMode() ? true : this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	if (this.getUndoRedoQueue().getPosition() > 0)
	{
		jsonSpec.iconClass = "undo";
		jsonSpec.disabled = false;
	}
	else
	{
		jsonSpec.iconClass = "undoDisabled";
		jsonSpec.disabled = true;
	}

	jsonSpec.label = this.getUndoRedoQueue().getUndoTooltip();

	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function RedoAction()
{
	this.m_sAction = "Redo";
}
RedoAction.prototype = new UndoRedoAction();

RedoAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.getCognosViewer().isLimitedInteractiveMode() ? true : this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	if (this.getUndoRedoQueue().getPosition() < (this.getUndoRedoQueue().getLength()-1))
	{
		jsonSpec.iconClass = "redo";
		jsonSpec.disabled = false;
	}
	else
	{
		jsonSpec.iconClass = "redoDisabled";
		jsonSpec.disabled = true;
	}

	jsonSpec.label = this.getUndoRedoQueue().getRedoTooltip();

	return jsonSpec;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ViewAllSnapshotsAction(){}
ViewAllSnapshotsAction.prototype = new SnapshotsAction();

ViewAllSnapshotsAction.prototype.updateMenu = function(jsonSpec) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	
	if (widget.m_bNoSavedOutputs == true) {
		jsonSpec.disabled = true;
	}
	return jsonSpec;
};

ViewAllSnapshotsAction.prototype.execute = function() {
	if (!this.getCognosViewer().getViewerWidget().getSavedOutputsCMResponse()) {
		this.queryCMForSavedOutputs({"complete" : {"object" : this, "method" : this.handleQueryResponse}});
	}
	else {
		this.showDialog();
	}
};

ViewAllSnapshotsAction.prototype.handleQueryResponse = function(response) {
	this.setSavedOutputsCMResponse(response);
	this.showDialog();	
};

ViewAllSnapshotsAction.prototype.showDialog = function() {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	var cmResponse = widget.getSavedOutputsCMResponse();
	var queryResult = null;
	var queryItems = null;
	
	if (cmResponse) {
		queryResult = XMLHelper_FindChildByTagName(cmResponse, "result", true);
		if (queryResult) {
			queryItems = XMLHelper_FindChildrenByTagName(queryResult, "item", false);			
		}
	}
	
	if (!cmResponse || !queryItems || queryItems.length == 0) {
		widget.m_bNoSavedOutputs = true;
		var warningDialog = new WarningMessageDialog(oCV, RV_RES.IDS_JS_NO_SAVED_OUTPUTS);
		warningDialog.renderInlineDialog();		
		//widget.showErrorMessage(RV_RES.IDS_JS_NO_SAVED_OUTPUTS);
	}
	else {
		var cognosViewerObjectString = getCognosViewerObjectString(this.m_oCV.getId());
	
		var menuItemString = RV_RES.IDS_JS_SELECT_SNAPSHOT_DIALOG_TITLE;
		var enterNumberLabel = RV_RES.IDS_JS_SELECT_SNAPSHOT_DIALOG_DESC;
		var creationTime = this.getCognosViewer().envParams["creationTime"];
	
		this.selectSnapshotDialog = new viewer.dialogs.SelectSnapshot({
			sTitle:menuItemString,
			sLabel:enterNumberLabel,
			cmResponse:cmResponse,
			currentSnapshotCreationTime: creationTime,
			okHandler: function(sStoreID, sCreationTime)
			{
				window[cognosViewerObjectString].executeAction("ViewSavedOutput", {obj:sStoreID, creationTime: sCreationTime});
			},
			cancelHandler: function() {}
		});
		this.selectSnapshotDialog.startup();
		this.selectSnapshotDialog.show();
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ViewOriginalLabelAction() {}

ViewOriginalLabelAction.prototype = new CognosViewerAction();

ViewOriginalLabelAction.prototype.getCellRef = function() {
	return this.m_oCV.getSelectionController().getSelections()[0].getCellRef();
};

ViewOriginalLabelAction.prototype.updateMenu = function(jsonSpec) {
	if (this.getNumberOfSelections() == 1)
	{
		var selRef = this.getCellRef();
		if (selRef.getAttribute("rp_name"))
		{
			var menuItems = [];
			menuItems.push({ name: "originalLabel", label: selRef.getAttribute("rp_name"), iconClass: "", action: null, items: null });
			jsonSpec.items = menuItems;
			return jsonSpec;
		}
	}

	return "";
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ViewSavedOutputAction()
{
	this.m_obj = "";
	this.creationTime = "";
	this.m_mostRecent = false;
}
ViewSavedOutputAction.prototype = new CognosViewerAction();

ViewSavedOutputAction.prototype.addAdditionalRequestParms = function(cognosViewerRequest) {};

ViewSavedOutputAction.prototype.setRequestParms = function(payload) {
	this.m_obj = payload.obj;
	this.creationTime = payload.creationTime;
	this.m_mostRecent = payload.mostRecent;
};

ViewSavedOutputAction.prototype.updateMenu = function() {
	// update the menu so the saved output that's going to be viewed is shown as selected
	var snapshotsAction = this.getCognosViewer().getAction("Snapshots");
	snapshotsAction.populateMenu(false);
};

ViewSavedOutputAction.prototype.execute = function() {
	var cognosViewer = this.getCognosViewer();
	var widget = cognosViewer.getViewerWidget();
	

	if( cognosViewer.getStatus() === 'fault')
	{
		widget.clearErrorDlg();
	}

	// clear the global prompt information
	cognosViewer.getViewerWidget().setPromptParametersRetrieved(false);
	cognosViewer.envParams["reportPrompts"] = "";

	var sAction = cognosViewer.envParams["ui.action"];
	var formWarpRequest = document.getElementById("formWarpRequest" + cognosViewer.getId());
	if (sAction == "view" && formWarpRequest && formWarpRequest.reRunObj && formWarpRequest.reRunObj.value ) {
		cognosViewer.envParams["ui.reRunObj"] = formWarpRequest["reRunObj"].value;
	} else if (sAction != "view") {
		cognosViewer.envParams["ui.reRunObj"] = cognosViewer.envParams["ui.object"];
	}

	var searchPath = "storeID('" + this.m_obj + "')";
	cognosViewer.envParams["ui.action"] = "buxView";
	cognosViewer.envParams["ui.object"] = cognosViewer.envParams["ui.reRunObj"];
	cognosViewer.envParams["creationTime"] = this.creationTime;

	if (this.m_mostRecent === true) {
		widget.setSavedOutputSearchPath(null);
	}
	else {
		widget.setSavedOutputSearchPath(searchPath);
	}

	// update the menu so the saved output that's going to be viewed is shown as selected
	this.updateMenu();

	// clear the undo queue
	this.getUndoRedoQueue().clearQueue();

	// Clear the properties dialog to it'll get rebuilt. This is needed for the 'View report specification' link
	cognosViewer.getViewerWidget().clearPropertiesDialog();

	if (cognosViewer.getCurrentlySelectedTab() && widget.getSavedOutput()) {
		cognosViewer.setKeepTabSelected(cognosViewer.getCurrentlySelectedTab());
	}
	
	this.dispatchRequest(searchPath);

	this.fireModifiedReportEvent();
};

ViewSavedOutputAction.prototype.dispatchRequest = function(searchPath) {
	this.m_request = new ViewerDispatcherEntry(this.m_oCV);
	this.m_request.addFormField("ui.action", "buxView");
	// we need to include the report name or we'll end up doing 2 CM queries.
	this.m_request.addFormField("ui.name", this.m_oCV.envParams["ui.name"]);
	this.m_request.addFormField("widget.reloadToolbar", "true");
	this.m_request.addFormField("cv.objectPermissions", this.m_oCV.envParams["cv.objectPermissions"]);
	this.m_request.addFormField("ui.savedOutputSearchPath", searchPath);

	this.m_request.setCallbacks( {"complete" : {"object" : this, "method" : this.onComplete}});
			
	this.addAdditionalRequestParms(this.m_request);
	
	this.m_oCV.dispatchRequest(this.m_request);
};

ViewSavedOutputAction.prototype.onComplete = function(asynchDATAResponse, arg1) {
	this.m_oCV.setTracking("");
	this.m_oCV.setConversation("");
	this.m_request.onComplete(asynchDATAResponse, arg1);
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function WatchNewVersionsAction()
{
	this.m_requestParms = {subAction:""};
}
WatchNewVersionsAction.prototype = new CognosViewerAction();

WatchNewVersionsAction.prototype.setRequestParms = function(requestParms)
{
	this.m_requestParms = requestParms;
};

WatchNewVersionsAction.prototype.execute = function()
{
	var subscriptionManager = this.m_oCV.getSubscriptionManager();

	switch(this.m_requestParms.subAction)
	{
		case "loadMenu":
			this.loadMenu(this.m_requestParms.contextMenu);
			break;
		case "close":
			this.closeMenu();
			break;
		case "DeleteNotification":
			subscriptionManager.DeleteNotification();
			break;
		case "AddNotification":
			subscriptionManager.AddNotification();
			break;
		case "NewSubscription":
			subscriptionManager.NewSubscription();
			break;
		case "ModifySubscription":
			subscriptionManager.ModifySubscription(this.m_requestParms.subscriptionId);
			break;
		case "DeleteSubscription":
			subscriptionManager.DeleteSubscription(this.m_requestParms.subscriptionId);
			break;
	}
};

WatchNewVersionsAction.prototype.closeMenu = function() {
	var buttonSpec = this.m_oCV.findToolbarItem("WatchNewVersions");
	this.resetMenu(buttonSpec);

	var viewerString = getCognosViewerObjectRefAsString(this.m_oCV.getId());

	// we need to do a set time to let the original menu destroy itself before we go and create a new one
	setTimeout(viewerString + ".getViewerWidget().fireEvent(\"com.ibm.bux.widgetchrome.toolbar.update\", null, [" + viewerString + ".findToolbarItem(\"WatchNewVersions\")]);", 1);
};

WatchNewVersionsAction.prototype.resetMenu = function(jsonSpec) {
	jsonSpec.open = false;
	jsonSpec.action = {name: "WatchNewVersions", payload: {subAction:"loadMenu", contextMenu:false}};
	jsonSpec.closeAction = null; 

	var menuItems = [];
	menuItems.push({ name: "loadng", label: RV_RES.GOTO_LOADING, iconClass: "loading"});
	jsonSpec.items = menuItems;
};


WatchNewVersionsAction.prototype.updateMenu = function(jsonSpec)
{
	var items = jsonSpec.items;
	var subscriptionManager = this.m_oCV.getSubscriptionManager();

	// context menu won't have any items
	if (!items || items.length === 0){
		jsonSpec.visible = subscriptionManager.CanCreateNewWatchRule();
		jsonSpec.disabled = !(subscriptionManager.IsValidSelectionForNewRule());
	}
	else {
		// we always want to repopulate the toolbar menu, so reset it every time updaetMenu gets called
		this.resetMenu(jsonSpec);
	}

	return jsonSpec;
};

WatchNewVersionsAction.prototype.loadMenu = function(contextMenu)
{
	var subscriptionManager = this.m_oCV.getSubscriptionManager();
	var cvId = this.m_oCV.getId();

	var oCV = this.m_oCV;
	var request = new JSONDispatcherEntry(oCV);
	request.addFormField("ui.action", "getSubscriptionInfo");
	request.addFormField("cv.responseFormat", "subscriptionManager");
	request.addFormField("contextMenu", contextMenu == true ? "true" : "false");
	subscriptionManager.addCommonFormFields(request, "");
	
	request.setCallbacks({"complete":{"object":this, "method":this.openSubscriptionMenuResponse}});
	
	oCV.dispatchRequest(request);		
};

WatchNewVersionsAction.prototype.openSubscriptionMenuResponse = function(response)
{
	var subscriptionManager = this.m_oCV.getSubscriptionManager();
	subscriptionManager.Initialize(response);

	var menuItems = [];

	// Clear the menu
	subscriptionManager.ClearSubscriptionMenu();

	var bAddSeperator = false;

	if ( subscriptionManager.CanGetNotified() )
	{
		if (subscriptionManager.m_sQueryNotificationResponse == 'on')
		{
			menuItems.push({ name: "DeleteNotification", label: RV_RES.RV_DO_NOT_ALERT_NEW_VERSION, iconClass: "deleteNotification", action: { name: "WatchNewVersions", payload: {subAction:"DeleteNotification"} }, items: null });
			bAddSeperator = true;
		}
		else if (subscriptionManager.m_sQueryNotificationResponse == 'off' && subscriptionManager.m_sEmail != "")
		{
			menuItems.push({ name: "AddNotification", label: RV_RES.RV_ALERT_NEW_VERSION, iconClass: "addNotification", action: { name: "WatchNewVersions", payload: {subAction:"AddNotification"} }, items: null });
			bAddSeperator = true;
		}
	}

	if (subscriptionManager.CanCreateNewWatchRule())
	{
		if (bAddSeperator)
		{
			menuItems.push({separator: true});
		}

		var newSubScriptionMenuItem = { name: "NewSubscription", label: RV_RES.RV_NEW_WATCH_RULE, iconClass: "newSubscription", action: { name: "WatchNewVersions", payload: {subAction:"NewSubscription"} }, items: null };
		if (!subscriptionManager.IsValidSelectionForNewRule())
		{
			newSubScriptionMenuItem.disabled = true;
		}

		menuItems.push(newSubScriptionMenuItem);
		bAddSeperator = true;
	}

	var sBlacklist = "";
	if (typeof this.m_oCV.UIBlacklist != "undefined")
	{
		sBlacklist = this.m_oCV.UIBlacklist;
	}

	//iterate through existing subscriptions
	if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES ') == -1)
	{
		if ( subscriptionManager.m_aWatchRules && subscriptionManager.m_aWatchRules.length > 0)
		{
			if (bAddSeperator)
			{
				menuItems.push({separator: true});
			}

			var bCanModifyWatchRules = subscriptionManager.CanModifyWatchRule();

			for(var sub = 0; sub < subscriptionManager.m_aWatchRules.length; ++sub)
			{
				var menu = { name: "WatchRule" + sub, label: subscriptionManager.m_aWatchRules[sub].name, iconClass: "watchRule", action: null, items: [] };
				if (bCanModifyWatchRules && sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES_MODIFY ') == -1)
				{
					menu.items.push({ name: "ModifySubscription" + sub, label: RV_RES.RV_MODIFY_WATCH_RULE, iconClass: "modifySubscription", action: { name: "WatchNewVersions", payload: {subAction:"ModifySubscription", subscriptionId:sub} }, items: null });
				}
				if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES_DELETE ') == -1)
				{
					menu.items.push({ name: "DeleteSubscription" + sub, label: RV_RES.RV_DELETE_WATCH_RULE, iconClass: "deleteSubscription", action: { name: "WatchNewVersions", payload: {subAction:"DeleteSubscription", subscriptionId:sub} }, items: null });
				}

				menuItems.push(menu);
			}
		}
	}

	if (menuItems.length === 0)
	{
		menuItems.push({ name: "NoWatchRules", label: RV_RES.RV_NO_WATCH_RULES, iconClass: "", action: null, items: null, disabled:true });
	}

	var buttonSpec = this.m_oCV.findToolbarItem("WatchNewVersions");
	if (buttonSpec) {
		buttonSpec.items = menuItems;
		buttonSpec.action = null;
		buttonSpec.open = true;
		buttonSpec.closeAction = { name: "WatchNewVersions", payload: {subAction:"close"} };

		var updateItems = [];
		updateItems.push(buttonSpec);
		this.m_oCV.getViewerWidget().fireEvent("com.ibm.bux.widgetchrome.toolbar.update", null, updateItems);
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 /**
 * RunSavedOutputReportAction - implements re-run in cognos viewer
 */
function RunSavedOutputReportAction(){}
RunSavedOutputReportAction.prototype = new CognosViewerAction();

RunSavedOutputReportAction.prototype.updateMenu = function(jsonSpec) {
	var sAction = this.m_oCV.envParams["ui.action"];
	var bLiveReport = (sAction != "view" && sAction != "buxView" && this.m_oCV.getStatus() !== "fault");
	this.addMenuItemChecked(bLiveReport, jsonSpec);
	return jsonSpec;
};

RunSavedOutputReportAction.prototype.dispatchRequest = function(filters) {
	var cognosViewer = this.getCognosViewer();

	// The savedReportName will only be set if the user opened a saved dashboard, switched to saved output
	// and then reran the report. In this situation we need to clear the savedReportName so that when the user
	// saves the dashboard, a new report is created under the dashboard (bug COGCQ00278882)
	if (cognosViewer.envParams["savedReportName"]) {
		delete cognosViewer.envParams["savedReportName"];
	}

	// clear off the error page if this is invoked after a fault
	if( cognosViewer.getStatus() === 'fault')
	{
		var widget = this.getCognosViewer().getViewerWidget();
		widget.clearErrorDlg();
	}

	var sAction = cognosViewer.envParams["ui.action"];
	var formWarpRequest = document.getElementById("formWarpRequest" + cognosViewer.getId());

	if (cognosViewer.envParams["ui.reRunObj"])
	{
		cognosViewer.envParams["ui.object"] = cognosViewer.envParams["ui.reRunObj"];
	}
	else if (sAction == "view" && formWarpRequest && typeof formWarpRequest["reRunObj"] != "undefined" && formWarpRequest["reRunObj"] != null && formWarpRequest["reRunObj"].value.length > 0)
	{
		cognosViewer.envParams["ui.object"] = formWarpRequest["reRunObj"].value;
	}


	var oReq = new ViewerDispatcherEntry(cognosViewer);
	oReq.addFormField("ui.action", "bux");
	oReq.addFormField("widget.runFromSavedOutput", "true");
	oReq.addFormField("ui.object", cognosViewer.envParams["ui.object"]);
	oReq.addFormField("run.outputFormat", "HTML");
	oReq.addFormField("ui.primaryAction","");
	oReq.addFormField("widget.reloadToolbar", "true");
	oReq.addDefinedNonNullFormField("cv.objectPermissions", cognosViewer.envParams["cv.objectPermissions"]);
	oReq.addDefinedNonNullFormField("run.prompt", cognosViewer.envParams["promptOnRerun"]);
	oReq.addDefinedNonNullFormField("limitedInteractiveMode", cognosViewer.envParams["limitedInteractiveMode"]);
	oReq.addDefinedNonNullFormField("widget.globalPromptInfo", cognosViewer.getViewerWidget().getGlobalPromptsInfo());
	oReq.addDefinedNonNullFormField("baseReportSearchPath", cognosViewer.envParams["baseReportSearchPath"]);
	oReq.addNonEmptyStringFormField("cv.updateDataFilters", filters);

	// Clear the properties dialog to it'll get rebuilt. This is needed for the 'View report specification' link
	cognosViewer.getViewerWidget().clearPropertiesDialog();

	cognosViewer.preparePromptValues(oReq);
	
	cognosViewer.dispatchRequest(oReq);

	this.fireModifiedReportEvent();

	cognosViewer.envParams["ui.action"] = "run";
};

RunSavedOutputReportAction.prototype.execute = function() {
	this.gatherFilterInfoBeforeAction("RunSavedOutputReport");
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function InvokeChangeDisplayTypeDialogAction(){}

InvokeChangeDisplayTypeDialogAction.prototype = new CognosViewerAction();

InvokeChangeDisplayTypeDialogAction.prototype.execute = function() {
	var viewer = this.getCognosViewer();
	var selectedObject = this.getSelectedReportInfo();
	if(selectedObject)
	{
		var viewerWidget = viewer.getViewerWidget();
		var bGetInfoOnServer = false;
		if (selectedObject.suggestedDisplayTypesEnabled == true) {
			bGetInfoOnServer = (typeof selectedObject.possibleDisplayTypes == "undefined") || (typeof selectedObject.suggestedDisplayTypes == "undefined")? true : false;
		} else {
			bGetInfoOnServer = (typeof selectedObject.possibleDisplayTypes == "undefined");
		}
		if (bGetInfoOnServer)
		{
			var asynchRequest = new AsynchJSONDispatcherEntry(this.m_oCV);
			asynchRequest.setCallbacks({
				"complete": {"object": this, "method": this.handleResponse}
				});
			asynchRequest.setRequestIndicator(viewer.getRequestIndicator());
			
			asynchRequest.addFormField("ui.action", "getInfoFromReportSpec");
			asynchRequest.addFormField("bux", "true");
			
			asynchRequest.addNonEmptyStringFormField("modelPath", this.m_oCV.getModelPath());
			asynchRequest.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);
			asynchRequest.addDefinedFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
			asynchRequest.addFormField("cv.actionContext", this.addActionContext());
			asynchRequest.addFormField("ui.conversation", encodeURIComponent(this.m_oCV.getConversation()));
			
			viewer.dispatchRequest(asynchRequest);
		}
		else
		{
			viewerWidget.invokeDisplayTypeDialog(selectedObject.possibleDisplayTypes,selectedObject.suggestedDisplayTypes );
		}
	}

};

InvokeChangeDisplayTypeDialogAction.prototype.handleResponse = function(asynchJSONResponse)
{
	var viewer = this.getCognosViewer();
	var viewerWidget = viewer.getViewerWidget();

	var reportInfos = asynchJSONResponse.getResult();
	for ( var i in reportInfos.containers)
	{
		var selectedReportInfo = this.getReportInfo(reportInfos.containers[i].container);
		selectedReportInfo.possibleDisplayTypes = reportInfos.containers[i].possibleDisplayTypes;
		selectedReportInfo.suggestedDisplayTypes = reportInfos.containers[i].suggestedDisplayTypes;
	}
	var selectedObject = this.getSelectedReportInfo();
	viewerWidget.invokeDisplayTypeDialog(selectedObject.possibleDisplayTypes,selectedObject.suggestedDisplayTypes);
};

InvokeChangeDisplayTypeDialogAction.prototype.addActionContext = function()
{
	var actionContext = "<getInfoActions>";
	actionContext += "<getInfoAction name=\"GetInfo\">";
	actionContext += "<include><possibleDisplayTypes/></include>";
	actionContext += "<include><suggestedDisplayTypes/></include>";
	actionContext += this.getDataItemInfoMap();;
	actionContext += this.addClientContextData(/*maxValuesPerRDI*/3);
	actionContext += "</getInfoAction>";
	actionContext += "</getInfoActions>";
	return actionContext;
};

InvokeChangeDisplayTypeDialogAction.prototype.updateMenu = function(jsonSpec)
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	jsonSpec.visible = oRAPReportInfo.containsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	var reportInfo = this.getSelectedReportInfo();	
	jsonSpec.disabled = (reportInfo == null || reportInfo.displayTypeId == null || !this.isInteractiveDataContainer(reportInfo.displayTypeId));
	
	if (jsonSpec.disabled)
	{
		jsonSpec.iconClass = "chartTypesDisabled";
		return jsonSpec;
	}
	jsonSpec.iconClass = "chartTypes";	
	return jsonSpec;

};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function GotoAction(){}
GotoAction.prototype = new CognosViewerAction();

GotoAction.prototype.execute = function()
{
	var drillManager = this.m_oCV.getDrillMgr();
	drillManager.launchGoToPage();
};

GotoAction.prototype.updateMenu = function(jsonSpec)
{
	var items = [];

	var drillTargetSpecifications = this.m_oCV.getDrillTargets();
	var drillManager = this.m_oCV.getDrillMgr();
	var aAuthoredDrillThroughTargets = drillManager.getAuthoredDrillThroughTargets();

	if(aAuthoredDrillThroughTargets.length > 0)
	{
		var sAuthoredDrillThroughTargets = "<AuthoredDrillTargets>";

		for(var iIndex = 0; iIndex < aAuthoredDrillThroughTargets.length; ++iIndex)
		{
			sAuthoredDrillThroughTargets +=  eval('"' + aAuthoredDrillThroughTargets[iIndex] + '"');
		}

		sAuthoredDrillThroughTargets += "</AuthoredDrillTargets>";

		var authoredDrillAction = this.m_oCV.getAction("AuthoredDrill");

		var rvDrillTargetsNode = authoredDrillAction.getAuthoredDrillThroughContext(sAuthoredDrillThroughTargets, drillTargetSpecifications);

		var drillTargets = rvDrillTargetsNode.childNodes;
		if(drillTargets.length > 0)
		{
			for(var index = 0; index < drillTargets.length; ++index)
			{
				var drillTarget = drillTargets[index];

				var sIconClass = this.getTargetReportIconClass(drillTarget);

				var sLabel = drillTarget.getAttribute("label");
				items.push({ name: "AuthoredDrill", label: sLabel, iconClass: sIconClass, action: { name: "AuthoredDrill", payload: XMLBuilderSerializeNode(drillTarget) }, items: null });
			}
		}
	}

	if(items.length > 0)
	{
		items.push({separator: true});
	}

	// related links
	var relatedDisabled = false;
	if(this.m_oCV.getSelectionController() == null || this.m_oCV.getSelectionController().getModelDrillThroughEnabled() == false)
	{
		relatedDisabled = true;
	}

	items.push({ name: "Goto", disabled: relatedDisabled, label: RV_RES.RV_MORE, iconClass: "", action: { name: "Goto", payload: "" }, items: null });

	if (this.m_oCV.isIWidgetMobile()) {
		jsonSpec.flatten = "true";
	}
	
	jsonSpec.items = items;
	return jsonSpec;
};

GotoAction.prototype.getTargetReportIconClass = function(drillTarget)
{
	var sIconClass = "";

	var sMethod = drillTarget.getAttribute("method");
	switch(sMethod)
	{
		case "edit":
			sIconClass = "editContent";
			break;
		case "execute":
			sIconClass = "runReport"; //"/ps/portal/images/action_run.gif";
			break;
		case "view":
			var sOutputFormat = drillTarget.getAttribute("outputFormat");

			switch(sOutputFormat)
			{
				case "HTML":
				case "XHTML":
				case "HTMLFragment":
					sIconClass = "html";
					break;
				case "PDF":
					sIconClass = "pdf";
					break;
				case "XML":
					sIconClass = "xml";
					break;
				case "CSV":
					sIconClass = "csv";
					break;
				case "XLS":
					sIconClass = "excel2000";
					break;
				case "SingleXLS":
					sIconClass = "excelSingleSheet";
					break;
				case "XLWA":
					sIconClass = "excel2002";
					break;
				case "spreadsheetML":
					sIconClass = "excel2007";
					break;
				case "xlsxData":
					sIconClass = "excel2007";
					break;
			}
			break;
	}

	return sIconClass;
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function AnnotationAction() {}
AnnotationAction.prototype = new CognosViewerAction();

AnnotationAction.prototype.updateMenu = function(jsonSpec)
{
	var viewerWidgetRef = this.m_oCV.getViewerWidget();

	var aAnnotations = this.m_oCV.aBuxAnnotations;
	var annItems = [];
	for (var annIndex=0; annIndex < aAnnotations.length; annIndex++)
	{
		var ann = eval("new " + aAnnotations[annIndex] + "()");
		ann.setCognosViewer(this.m_oCV);
		if (ann && ann.isEnabled(jsonSpec.placeType))
		{
			var newAnnItem = {};
			newAnnItem.name = aAnnotations[annIndex];
			newAnnItem.label = ann.getMenuItemString(viewerWidgetRef.getAttributeValue("itemName"));
			newAnnItem.action = {};
			newAnnItem.action.name = aAnnotations[annIndex];
			newAnnItem.action.payload = "";
			newAnnItem.items = null;
			newAnnItem.iconClass = ann.getMenuItemIconClass();// aAnnotations[annIndex];
			annItems.push(newAnnItem);
		}
	}

	jsonSpec.items = annItems;
	jsonSpec.disabled = !(jsonSpec.items && jsonSpec.items.length);
	
	if(jsonSpec.disabled) {
		jsonSpec.iconClass = "disabledAnnotation";
	} else {
		jsonSpec.iconClass = "annotation";
	}

	return jsonSpec;
};

AnnotationAction.prototype.execute = function()
{
	var viewer = this.getCognosViewer();
	var selCon = viewer.getSelectionController();
	var selections = selCon.getSelections();
	if (selections && selections.length == 1) {
		var widget = viewer.getViewerWidget();
		if (widget) {
			this.executeAction(viewer, widget, selections[0]);
		}
	}
};

AnnotationAction.prototype.executeAction = function(viewer, widget, selection)
{
	//Do nothing -- derived classes should override this method to perform the necessary action
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * DeleteWidgetAnnotationAction - implements deleting existing annotations on the cognos viewer widget
 */
function DeleteWidgetAnnotationAction() {}
DeleteWidgetAnnotationAction.prototype = new AnnotationAction();

DeleteWidgetAnnotationAction.prototype.execute = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();
	if (widget) {
		widget.getAnnotationHelper().deleteWidgetComment();
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * EditWidgetAnnotationAction - implements editing an existing annotation to the cognos viewer widget
 */
function EditWidgetAnnotationAction() {}
EditWidgetAnnotationAction.prototype = new AnnotationAction();

EditWidgetAnnotationAction.prototype.execute = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();
	if (widget) {
		window.setTimeout(function () { widget.getAnnotationHelper().editWidgetComment(); },0);
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 /**
 * NewWidgetAnnotationAction - implements adding new annotations to the cognos viewer widget
 */
function NewWidgetAnnotationAction() {}
NewWidgetAnnotationAction.prototype = new AnnotationAction();

NewWidgetAnnotationAction.prototype.execute = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();
	if (widget) {
		widget.getAnnotationHelper().addWidgetComment();
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * DeleteAnnotationAction - implements deleting existing annotations in cognos viewer
 */
function DeleteAnnotationAction() {}
DeleteAnnotationAction.prototype = new AnnotationAction();

DeleteAnnotationAction.prototype.executeAction = function(viewer, widget, selection)
{
	if (viewer && widget &&  selection) {
		var cellRef = selection.getCellRef();
		var ctxId = viewer.findCtx(cellRef);
		widget.getAnnotationHelper().deleteComment(ctxId);
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * EditAnnotationAction - implements editing an existing annotation in cognos viewer
 */
function EditAnnotationAction() {}
EditAnnotationAction.prototype = new AnnotationAction();

EditAnnotationAction.prototype.executeAction = function(viewer, widget, selection)
{
	if (viewer && widget &&  selection) {
		var cellRef = selection.getCellRef();
		var ctxId = viewer.findCtx(cellRef);
		window.setTimeout(function () { widget.getAnnotationHelper().editComment(ctxId); },0);
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * NewAnnotationAction - implements adding new annotations in cognos viewer
 */
function NewAnnotationAction() {}
NewAnnotationAction.prototype = new AnnotationAction();

NewAnnotationAction.prototype.executeAction = function(viewer, widget, selection)
{
	if (viewer && widget && selection) {
		var cellRef = selection.getCellRef();
		var ctxId = viewer.findCtx(cellRef);
		var value = selection.getDisplayValues()[0];
		window.setTimeout(function () { widget.getAnnotationHelper().addComment(ctxId, value); },0);
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 
function ExploreWithAAFAction() {}

ExploreWithAAFAction.prototype = new CognosViewerAction();

ExploreWithAAFAction.prototype.execute = function() {
	window.open(this.m_oCV.getGateway() + this.m_oCV.envParams.aafBaseURL, "_blank");
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ViewActiveReportAction(){};
ViewActiveReportAction.prototype = new ViewSavedOutputAction();

ViewActiveReportAction.prototype.addAdditionalRequestParms = function(request) {
	request.addFormField("cv.responseFormat", "CMRequest");
	request.setCallbacks( {
		"complete" : {"object" : this, "method" : this.handleQueryResponse}
	});
};

ViewActiveReportAction.prototype.handleQueryResponse = function(response){

	var viewerWidget = this.m_oCV.getViewerWidget();
	viewerWidget.showLoading();
	var xmlParsedCMresponse = XMLBuilderLoadXMLFromString(response.getResult());
	var storeIDNode = XMLHelper_FindChildByTagName(xmlParsedCMresponse, "storeID", true);
	var sStoreID = XMLHelper_GetText(XMLHelper_FindChildByTagName(storeIDNode, "value", true));	
	var activeReportIframe = dojo.byId(this.m_oCV.getViewerWidget().getIFrameId());
	activeReportIframe.src = this.m_oCV.getGateway() + "/output/cm/" + sStoreID + "/";
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function RefreshActiveReportAction()
{
	this.m_sAction = "RefreshActiveReport";
}

RefreshActiveReportAction.prototype = new CognosViewerAction();

RefreshActiveReportAction.prototype.execute = function()
{
	var viewerWidget = this.m_oCV.getViewerWidget();
	var activeReportIframe = dojo.byId(viewerWidget.getIFrameId());
	var srcUrl = activeReportIframe.src;
	activeReportIframe.src = srcUrl;
	viewerWidget.showLoading();
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportAction() {
	this.m_format = "";
	this.m_responseFormat = "";
}

ExportAction.prototype = new CognosViewerAction();

ExportAction.prototype.getWindowTitle = function() {
	return "";
};

ExportAction.prototype.execute = function() {
	if (!this.m_format) {
		return false;
	}

	this.initializeForm();
	this.insertGenericFormElements();
	this.insertSpecializedFormElements();

	return this.sendRequest();
};

ExportAction.prototype.addFormField = function(sName, sValue) {
	if(console) { 
		console.log("Required method ExportAction.addFormField not implemented");
	}
};

ExportAction.prototype.initializeForm = function() {
	if(console) {
		console.log("Required method ExportAction.initializeForm not implemented");
	}
};

ExportAction.prototype.sendRequest = function() {
	if(console) {
		console.log("Required method ExportAction.sendRequest not implemented");;
	}
};

ExportAction.prototype.insertGenericFormElements = function() {
	var sRunPrompt = "false";
	var bAction = 'cognosViewer';

	this.addFormField("b_action", bAction);
	this.addFormField("cv.toolbar", "false");
	this.addFormField("cv.header", "false");
	this.addFormField("ui.windowtitleformat", 'chromeless_window_action_format');
	this.addFormField("ui.name", this.getObjectDisplayName());
	this.addFormField("cv.responseFormat", this.m_responseFormat);
	this.addFormField("ui.reuseWindow", "true");

	var sUiSpec = this.m_oCV.envParams["ui.spec"]; // TODO: we may not need this when we move to one Tomcat environment
	var sUiConversation = this.m_oCV.getConversation();

	this.addFormField("ui.action", 'export');
	this.addFormField("ui.conversation", sUiConversation);
	this.addFormField("run.prompt", sRunPrompt);
	this.addFormField('asynch.attachmentEncoding', 'base64');
	this.addFormField("run.outputEncapsulation", 'URLQueryString');
	this.addFormField("ui.spec", sUiSpec);
	this.addFormField("rap.reportInfo", this.m_oCV.envParams["rapReportInfo"]);

	if (this.m_oCV.envParams["ui.routingServerGroup"]) {
		this.addFormField("ui.routingServerGroup", this.m_oCV.envParams["ui.routingServerGroup"]);
	}

	var viewerWidget = this.m_oCV.getViewerWidget();
	if(viewerWidget != null) {
		//Technically, this call could be asynchronous, however we assume that if
		//the user is exporting a report, there's already a storeid.
		dojo.when(viewerWidget.getWidgetStoreID(),
			dojo.hitch(this, function(widgetStoreID) {
				if(typeof widgetStoreID != "undefined" && widgetStoreID != null) {
					this.addFormField('widgetStoreID', widgetStoreID);
				}
			})
		);
		var cvGateway = viewerWidget.getAttributeValue("gateway");
		if(cvGateway) {
			this.addFormField('cv.gateway', cvGateway);
		}
		var cvWebcontent = viewerWidget.getAttributeValue("webcontent");
		if(cvWebcontent) {
			this.addFormField('cv.webcontent', cvWebcontent);
		}
	}
	this.addFormField("rap.parametersInfo", CViewerCommon.buildParameterValuesSpec(this.m_oCV));

};

ExportAction.prototype.insertSpecializedFormElements = function(request) {
	this.addFormField("run.outputFormat", this.m_format);
	this.addFormField("ui.windowtitleaction", this.getWindowTitle());
};

ExportAction.prototype.updateMenu = function(json) {
	json.visible = !this.isPromptWidget();
	if (this.m_oCV.isIWidgetMobile()) {
		json.flatten = true;
	}
	return json;
};

function ExportFromIframeAction() {
	this.m_format = "";
	this.m_responseFormat = "downloadObject";
}

ExportFromIframeAction.prototype = new ExportAction();

ExportFromIframeAction.prototype.initializeForm = function() {
	this.oRequest = new HiddenIframeDispatcherEntry(this.getCognosViewer());
	this.addFormField("cv.detachRelease", "true");
};

ExportFromIframeAction.prototype.addFormField = function(sName, sValue) {
	this.oRequest.addFormField(sName, sValue);
};

ExportFromIframeAction.prototype.sendRequest = function() {
	this.getCognosViewer().dispatchRequest(this.oRequest);
	return true;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToCSVAction()
{
	this.m_format = "CSV";
}

ExportToCSVAction.prototype = new ExportFromIframeAction();

ExportToCSVAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_CSV;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToExcel2000Action()
{
	this.m_format = "XLS";
}

ExportToExcel2000Action.prototype = new ExportFromIframeAction();

ExportToExcel2000Action.prototype.getWindowTitle = function()
{
	return RV_RES.RV_EXCEL_2000;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToExcel2002Action()
{
	this.m_format = "XLWA";
}

ExportToExcel2002Action.prototype = new ExportFromIframeAction();

ExportToExcel2002Action.prototype.getWindowTitle = function()
{
	return RV_RES.RV_EXCEL_2002;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToExcel2007Action()
{
	this.m_format = "spreadsheetML";
}

ExportToExcel2007Action.prototype = new ExportFromIframeAction();

ExportToExcel2007Action.prototype.getWindowTitle = function()
{
	return RV_RES.RV_EXCEL_2007;
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2012, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToExcel2007DataAction()
{
	//this.m_format = "spreadsheetML";
	this.m_format = "xlsxData";
}

ExportToExcel2007DataAction.prototype = new ExportFromIframeAction();

ExportToExcel2007DataAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_EXCEL_2007_DATA; 
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToExcelSingleSheetAction()
{
	this.m_format = "singleXLS";
}

ExportToExcelSingleSheetAction.prototype = new ExportFromIframeAction();

ExportToExcelSingleSheetAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_EXCEL_2000SF;
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToPDFAction()
{
	this.m_format = "PDF";
}

ExportToPDFAction.prototype = new ExportFromIframeAction();

ExportToPDFAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_PDF;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ExportToXMLAction()
{
	this.m_format = "XML";
}

ExportToXMLAction.prototype = new ExportFromIframeAction();

ExportToXMLAction.prototype.getWindowTitle = function()
{
	return RV_RES.RV_XML;
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function PrintAsPDFAction() {
	this.m_format = "PDF";
	this.m_responseFormat = "page";
}

PrintAsPDFAction.prototype = new ExportAction();

PrintAsPDFAction.prototype.getWindowTitle = function() {
	return RV_RES.IDS_PRINT_AS_PDF;
};

PrintAsPDFAction.prototype.initializeForm = function() {
	this.nForm = document.createElement("form");
	this.nForm.setAttribute("method", "post");
	
	var sDispatcherURI = location.protocol +'//'+ location.host + this.m_oCV.m_sGateway;
	this.nForm.setAttribute("action", sDispatcherURI);
};

PrintAsPDFAction.prototype.sendRequest = function() {
	var viewerID = this.m_oCV.getId();
	var sName = 'get' + this.m_format + viewerID;

	this.nForm.setAttribute("id",sName);
	this.nForm.setAttribute("name", sName);
	this.nForm.setAttribute("target", this.m_format + 'Window' + viewerID);
	
	document.body.appendChild(this.nForm);
	
	var sWindowId = this.nForm.getAttribute("target");
	window.open("",sWindowId,'resizable=yes,menubar=no,directories=no,location=no,status=no,toolbar=no,titlebar=no');
	this.nForm.submit();
	document.body.removeChild(this.nForm);
	this.nForm = null;
	
	return true;
};

PrintAsPDFAction.prototype.addFormField = function(sName, sValue) {
	this.nForm.appendChild(createHiddenFormField(sName, sValue));
};/*
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
function ExpandCollapseMemberAction()
{
	this.m_sAction = "ExpandCollapseMember";
	this.m_sExpandCollapseType=null;
	this.m_RAPReportInfo = null;
	this.m_itemInfo = null;
	this.m_sPreviousDataItem = null;

}
ExpandCollapseMemberAction.prototype = new ModifyReportAction();
ExpandCollapseMemberAction.baseclass = ModifyReportAction.prototype;


ExpandCollapseMemberAction.prototype._getCanExpand = function(oSelectionObject)
{
	var itemInfo = this._getItemInfo( oSelectionObject );
	return ( itemInfo && itemInfo.canExpand );
};

ExpandCollapseMemberAction.prototype._isExpanded = function(oSelectionObject)
{	
	var sMUN = this._getSelectedMUN(oSelectionObject);
	if( !sMUN )
	{
		return false;
	}
	var itemInfo = this._getItemInfo( oSelectionObject );
	return ( itemInfo && itemInfo.expandedMembers && itemInfo.expandedMembers[sMUN] === true );	
};

ExpandCollapseMemberAction.prototype._getSelectedMUN = function( oSelectionObject )
{
	var sMun = null;

	var aMuns = oSelectionObject.getMuns();
	if (aMuns && aMuns.length>0 && aMuns[0].length>0) {
		sMun = aMuns[0][0];
	}

	return sMun;
};

ExpandCollapseMemberAction.prototype._getDataItem = function( oSelectionObject )
{
	if (!oSelectionObject) {
		return null;
	}
	
	var sDataItemName = null;
	var aDataItems = oSelectionObject.getDataItems();
	if (aDataItems && aDataItems.length>0 && aDataItems[0].length>0) {
		sDataItemName = aDataItems[0][0]; 
	}
		
	return sDataItemName;
};

ExpandCollapseMemberAction.prototype._getItemInfo = function(selObj)
{
	var sDataItem= this._getDataItem(selObj);
	if (!sDataItem ) {
		return null;
	}
	
	var sContainerLID = this.removeNamespace( selObj.getLayoutElementId() );
	this.m_RAPReportInfo = this.m_oCV.getRAPReportInfo();
	this.m_itemInfo = this.m_RAPReportInfo.getItemInfo( sContainerLID, sDataItem );
	this.m_sPreviousDataItem = sDataItem;
	
	return this.m_itemInfo;
};

ExpandCollapseMemberAction.prototype._alwaysCanExpandCollapse = function(selObj)
{
	var itemInfo = this._getItemInfo(selObj);
	return ( itemInfo && itemInfo.alwaysCanExpandCollapse );
};

ExpandCollapseMemberAction.prototype._canShowMenu = function(oSectionController)
{
	var selObj = this._getFirstSelectedObject(oSectionController);
	
	return (selObj  && this._hasMUN(selObj) && this._isCrosstab(selObj) && this._isOnEdge(selObj) && !oSectionController.areSelectionsMeasureOrCalculation());
};

ExpandCollapseMemberAction.prototype._getCtxId = function(selObj)
{
	var cellRef = selObj.getCellRef();
	if (cellRef && cellRef.getAttribute) {
		var ctxValue = cellRef.getAttribute("ctx");
		if (ctxValue) {
			ctxValue = ctxValue.split("::")[0].split(":")[0];
			return ctxValue;
		}
	}	
	return "";
};

ExpandCollapseMemberAction.prototype._hasMUN = function(selObj)
{
	var aMuns = selObj.getMuns();
	return aMuns.length>0 ? true : false; 
};

ExpandCollapseMemberAction.prototype._isCrosstab = function(selObj)
{
	return selObj.getDataContainerType() === 'crosstab' ? true : false;
};

ExpandCollapseMemberAction.prototype._isOnEdge = function(selObj)
{
	return selObj.getLayoutType() === 'columnTitle' ? true : false;
};

ExpandCollapseMemberAction.prototype.keepRAPCache = function()
{
	return false;
};

ExpandCollapseMemberAction.prototype.updateMenu = function(jsonSpec)
{
	var oSectionController = this.m_oCV.getSelectionController();
	
	jsonSpec.visible = this._canShowMenu(oSectionController);
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	
	jsonSpec.disabled = !this._canEnableMenu(oSectionController);
	return jsonSpec;
};

ExpandCollapseMemberAction.prototype._canEnableMenu = function(oSectionController) {return true;};

ExpandCollapseMemberAction.prototype._getFirstSelectedObject = function(oSectionController)
{
	var selectedObjects = oSectionController.getAllSelectedObjects();
	if (selectedObjects.length>0) { 
		return selectedObjects[0]; //use the first object
	}
	return null;
};

ExpandCollapseMemberAction.prototype._isSingleSelection = function(oSectionController)
{
	var selectedObjects = oSectionController.getAllSelectedObjects();
	return (selectedObjects.length === 1); 
};

ExpandCollapseMemberAction.prototype.addActionContextAdditionalParms = function()
{
	var oSelectionController = this.getCognosViewer().getSelectionController();
	var selObj = this._getFirstSelectedObject(oSelectionController);
	var sPUN = oSelectionController.getPun(this._getCtxId(selObj))
	if( sPUN )
	{
		sPUN = "<PUN>" + sXmlEncode(sPUN) + "</PUN>";
	}
	var sType="";
	if (this.m_sExpandCollapseType) {
		//For now, ExpandMember or CollapseMember
		sType = "<ExpandCollapseType>" + this.m_sExpandCollapseType + "</ExpandCollapseType>";
	}
	
	return this.getSelectedCellTags() + sPUN + sType;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function ExpandMemberAction()
{
	this.m_sAction = "ExpandCollapseMember";
	this.m_sExpandCollapseType="ExpandMember";
}

ExpandMemberAction.prototype = new ExpandCollapseMemberAction();
ExpandMemberAction.baseclass = ExpandCollapseMemberAction.prototype;

ExpandMemberAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_EXPAND_MEMBER;
};

ExpandMemberAction.prototype._canEnableMenu = function(oSectionController)
{
	if (!this._isSingleSelection(oSectionController)) {
		return false;
	}
	
	var selObj = this._getFirstSelectedObject(oSectionController);
	if (this._alwaysCanExpandCollapse(selObj)) {
		//Always enable both expand/collapse for hierarchy sets.
		return true;  
	}	
	
	var ctxId = this._getCtxId(selObj);	
	
	var bCanDrillDown = true;
	/**
	 *Use drillabiliy in metadata to safe guard the parent of nested single dimension
	 */
	if( oSectionController.getDrillUpDownEnabled() === true){
		bCanDrillDown = oSectionController.canDrillDown(ctxId);
	}
	
	
	return (bCanDrillDown && this._getCanExpand( selObj ) && !this._isExpanded(selObj) ); 
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function CollapseMemberAction()
{
	this.m_sAction = "ExpandCollapseMember";
	this.m_sExpandCollapseType="CollapseMember";
	
}
CollapseMemberAction.prototype = new ExpandCollapseMemberAction();
CollapseMemberAction.baseclass = ExpandCollapseMemberAction.prototype;

CollapseMemberAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_COLLAPSE_MEMBER;
};

CollapseMemberAction.prototype._canDisableMenu = function(oSectionController)
{
	if (this._isSingleSelection(oSectionController) && !this._isExpanded() ) {
		return true;
	}
	return false;
};

CollapseMemberAction.prototype._canEnableMenu = function(oSectionController)
{
	var selObj = this._getFirstSelectedObject(oSectionController);
	if (this._alwaysCanExpandCollapse(selObj)) {
		return true;  //Expand/collapse cant be determined for complex sets...enable both items
	}	
	
	return (this._isSingleSelection(oSectionController) && this._isExpanded(selObj)); 
};

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 /**
 * This is the base class for generating request to re-run the report.
 * Classes derived from this will add to it their specific options.
 */
function OpenReportFromClipboardAction()
{
	this.m_action = 'bux';
	this.m_cv = this.getCognosViewer();
}

OpenReportFromClipboardAction.prototype = new CognosViewerAction();
OpenReportFromClipboardAction.prototype.reuseQuery =function() { return false; };
OpenReportFromClipboardAction.prototype.reuseGetParameter =function() { return false; };
OpenReportFromClipboardAction.prototype.keepRAPCache = function() {return false; };
OpenReportFromClipboardAction.prototype.reuseConversation = function() {return false; };
OpenReportFromClipboardAction.prototype.runReport = function() {return true;};
OpenReportFromClipboardAction.prototype.isUndoable = function() {return true; };


OpenReportFromClipboardAction.prototype.execute = function()
{
	if( window.clipboardData )
	{
		this.openReportForIE();
	}
	else
	{
		this.openReportForNonIE();
	}	
};

OpenReportFromClipboardAction.prototype.openReportForNonIE = function()
{
	var openReportFromClipboardActionObj = this;
	var clipboardDialog = new viewer.dialogs.ClipboardDialog({
		sTitle: RV_RES.IDS_JS_CLIPBOARD,
		okHandler: function(reportSpec)
		{
			openReportFromClipboardActionObj.executeAction(reportSpec);
		},
		cancelHandler: function() {}
	});
	clipboardDialog.startup();
	window.setTimeout(function () { clipboardDialog.show(); },0);
};

OpenReportFromClipboardAction.prototype.openReportForIE = function()
{
	var reportSpec = window.clipboardData.getData( 'Text' );
	this.executeAction( reportSpec );
};


OpenReportFromClipboardAction.prototype.getDeleteEnvParamsList = function()
{
	var deleteEnvParamsList = [
		'modelPath',
		'packageBase',
		'rapReportInfo',
		'rap.state'
	];
	
	return deleteEnvParamsList;	
};

OpenReportFromClipboardAction.prototype.deleteEnvParams = function()
{
	var envParams = this.m_cv.envParams;
	var envParamsToBeDeleted = this.getDeleteEnvParamsList();
	
	for( var index in envParamsToBeDeleted )
	{
		if( envParams[ envParamsToBeDeleted[index] ] )
		{
			delete envParams[ envParamsToBeDeleted[index] ];
		}
	}
	
};

/**
 * Need to clean up CCognosViewer
 */
OpenReportFromClipboardAction.prototype.cleanUpCognosViewer = function()
{
	this.m_cv.setExecutionParameters( "" );
	this.m_cv.setConversation( "" );
	this.deleteEnvParams();
};

OpenReportFromClipboardAction.prototype.getRequestParams = function()
{

	var requestParams = {
		'run.outputFormat' : 'HTML' ,
		'cv.id' : this.m_cv.getId(),
		'widget.reloadToolbar' : 'true',
		'openReportFromClipboard' : 'true',
		'ui.reportDrop' : 'true'
	};
	
	var globalPrompts = this.m_cv.getViewerWidget().getGlobalPromptsInfo();
	if (globalPrompts != null ) {
		requestParams[ 'widget.globalPromptInfo' ] = globalPrompts;
	}
	
	if( this.m_filters != "" )
	{
		requestParams["cv.updateDataFilters"] = this.m_filters;
	}

	
	var envParamsNames = [
		'cv.objectPermissions',
		'limitedInteractiveMode'
	];
	
	for( var index in envParamsNames )
	{
		var envParamName = envParamsNames[index];
		var envParamValue = this.m_cv.envParams[envParamName];
		if( envParamValue )
		{
			requestParams[ envParamName ] = envParamValue;
		}
	}

	return requestParams;
};

/**
 * Overrides the base class function
 */
OpenReportFromClipboardAction.prototype.addAdditionalOptions = function( cognosViewerRequest )
{
	var options = this.getRequestParams();

	for( var index in options )	{
		cognosViewerRequest.addFormField( index, options[index] );
	}
};

OpenReportFromClipboardAction.prototype.executeAction = function( reportSpec )
{
	this.m_cv = this.getCognosViewer();
	this.m_cv.envParams["ui.spec"] = reportSpec;
	this.gatherFilterInfoBeforeAction("OpenReportFromClipboard");
	ChangePaletteAction.reset(this.getCognosViewer());
}

OpenReportFromClipboardAction.prototype.dispatchRequest = function( filters )
{

	this.m_cv = this.getCognosViewer();
	var widget = this.m_cv.getViewerWidget();
	widget.reset();
	
	this.m_filters = filters;
	
	this.cleanUpCognosViewer();

	var cognosViewerRequest = this.createCognosViewerDispatcherEntry( this.m_action );
	
	this.m_cv.hideReportInfo();

	this.m_cv.dispatchRequest( cognosViewerRequest );

	//fire the modified event
	this.fireModifiedReportEvent();
};

OpenReportFromClipboardAction.prototype.doAddActionContext = function()
{
	return false;
};

OpenReportFromClipboardAction.prototype.updateMenu = function(json)
{
	json.visible = ( window.cognosViewerDebug === true );
	return json;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
  /**
  * This Action allows end user to save the report inside a report viewer widget
  * to an stand alone Cognos Report Object outside of Cognos workspace
  * */
function SaveAsReportAction(){
	_progressDisplay = null;
};

SaveAsReportAction.prototype = new CognosViewerAction();

SaveAsReportAction.prototype.onSaveCallback = function(){
	if (!this._progressDisplay) {
			dojo["require"]("bux.dialogs.InformationDialog"); //@lazyload
			this._progressDisplay = new bux.dialogs.Working(BUXMSG.CPN.IDS_CPN_SAVING);
			this._progressDisplay.startup();
			this._progressDisplay.show();
		}
};

SaveAsReportAction.prototype.afterSaveCallback = function(){
	if (this._progressDisplay) {
		this._progressDisplay.destroy();
		this._progressDisplay = null;
	}
};

SaveAsReportAction.prototype.execute = function( ){	
	 this.getCognosViewer().executeAction( 'RemoveAllDataFilter', { callback : {method: this.doSaveAs, object: this} } );	
};

SaveAsReportAction.prototype.updateMenu = function(jsonSpec){		
		jsonSpec.visible = this.hasEnvUISpec();
		return jsonSpec;		
};

SaveAsReportAction.prototype.hasEnvUISpec = function(){
	if(this.m_oCV){
		var sSpec = this.m_oCV.envParams["ui.spec"];
		return (sSpec && sSpec.length >0);
	}
	return false;
};

SaveAsReportAction.prototype.doSaveAs = function(strippedReportSpec){
	dojo["require"]("bux.dialogs.FileDialog");
	dojo["require"]("bux.iwidget.canvas.ReportIOHandler");
	this.m_cv = this.getCognosViewer();
	var sReportSpec = strippedReportSpec;
	var sObjectClass = this.m_cv.envParams["ui.objectClass"];
	var onCallback = this.onSaveCallback;
	var afterCallback = this.afterSaveCallback;
	var oSaveAsDlgParams = {
		filter:"content-report", //Only returns report objects in the file dialog
		title: RV_RES.IDS_JS_SAVE_AS_FDG_TITLE,
		sMainActionButtonLabel: RV_RES.IDS_JS_OK,
		"class": "bux-fileDialog"
	};
	var oIOHandler = new bux.iwidget.canvas.ReportIOHandler(sReportSpec, sObjectClass, onCallback, afterCallback, oSaveAsDlgParams);
	oIOHandler._doSaveAs();
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function BusinessProcessAction() {};

BusinessProcessAction.prototype = new CognosViewerAction();


BusinessProcessAction.prototype.updateMenu = function( jsonSpec ) {
	var sBpmRestURI = this.getCognosViewer().envParams['bpmRestURI'];
	jsonSpec.visible = ( sBpmRestURI  ? true : false );
	
	if(jsonSpec.visible) {
		jsonSpec.disabled = !this._hasAnyContextInSelectedObjects();
	}
	return jsonSpec;
};

BusinessProcessAction.prototype._initBPMGateway = function() {
	var cognosViewer = this.getCognosViewer();
	this.m_BPMGateway = cognosViewer.envParams['bpmRestURI'];
	
	var length = this.m_BPMGateway.length;
	if( this.m_BPMGateway[length-1] !== '/') {
		this.m_BPMGateway += '/';
	}
};

BusinessProcessAction.prototype.execute = function() {
	this._initBPMGateway();
	var oProcesses = this._getBPMProcesses();

};

BusinessProcessAction.prototype._getBPMProcesses = function() {	
	var callbacks = {
			complete : { object : this, method : this.handleGetBPMProcessSuccess },
			fault : { object : this, method : this.handleGetBPMProcessFail } 
	};
	
	var url = this.m_BPMGateway  + 'exposed/process';
	var request = this._createBPMServerRequest( 'GET', callbacks, url );
	request.sendRequest();
	
};

BusinessProcessAction.prototype._createBPMServerRequest = function( action, callbacks, url, aFormFields ) {

	var xmlHttpObj = new XmlHttpObject();
	xmlHttpObj.init( action, this._rewriteURL(url) );
	xmlHttpObj.setCallbacks( callbacks );
	xmlHttpObj.setHeaders({ Accept : "application/json"} );

	if( aFormFields ) {
		for( var i in aFormFields ){
			xmlHttpObj.addFormField(aFormFields[i].name, aFormFields[i].value);
		}
	}
	

	return xmlHttpObj;
};

BusinessProcessAction.prototype._rewriteURL = function( url ) {

	if( bux && bux.iwidget && bux.iwidget.canvas && bux.iwidget.canvas.Helper && bux.iwidget.canvas.Helper.rewriteUrl )
	{
		return bux.iwidget.canvas.Helper.rewriteUrl( url );
	}
	
	return url;
};

 
BusinessProcessAction.prototype.handleGetBPMProcessFail = function( serverResponse ) {
	var sErrorMsg = RV_RES.IDS_JS_BUSINESS_PROCESS_GET_PROCESSES_FAIL_MSG;
	var sErrorDetails = serverResponse.getResponseText();
	this._showErrorMessage( sErrorMsg, sErrorDetails );
};


BusinessProcessAction.prototype.handleGetBPMProcessSuccess = function( serverResponse ) {
	var response = serverResponse.getResponseText();
	if( !response )
	{
		return;
	}
	var jsonResponse = dojo.fromJson( response );
	
	var oBusinessProcessesInfo = this._getBusinessProcessesInfo( jsonResponse.data.exposedItemsList );
	this._showDialog( oBusinessProcessesInfo );
};

BusinessProcessAction.prototype._getBusinessProcessesInfo = function( exposedItemsList ) {
	if( !exposedItemsList ){
		return;
	}
	
	var noOfItems = exposedItemsList.length;
	var bpmProcessInfo = new Array();
	var bmpProcessUniqueNamesMap = {};
	for( var i = 0; i < noOfItems; i++ ) {
		var sProcessDisplayName = exposedItemsList[i].display;
		var sProcessItemID = exposedItemsList[i].itemID;
		var sProcessAppID  =  exposedItemsList[i].processAppID;
		
		if( sProcessDisplayName && !bmpProcessUniqueNamesMap[sProcessDisplayName] && sProcessItemID && sProcessAppID ) {			
			bmpProcessUniqueNamesMap[sProcessDisplayName] = true;
			bpmProcessInfo.push( {	sCaption : sProcessDisplayName,
									sBPD_ID : sProcessItemID,
									sProcessAppID : sProcessAppID } );
		}
	};
	
	return bpmProcessInfo;
};

BusinessProcessAction.prototype._showDialog = function( oBPMProcessInfo ) {
	
	var oBPAction = this;
	var oSelectBusinessProcessDialog = new viewer.dialogs.SelectBusinessProcess( {
			sTitle : RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_TITLE,
			sLabel : RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_DESC,
			okHandler : function() {},
			cancelHandler : function() {},
			BPMProcessesInfo : oBPMProcessInfo,
			bpAction : oBPAction
	});
	oSelectBusinessProcessDialog.startup();
	oSelectBusinessProcessDialog.show();
};

/**
 * This function gets the selection context and generates the process input parameter
 * (much like the drill thru parameters)
 * 
 * Should be in the format:
 * { CognosParameter : { ... } }
 */
BusinessProcessAction.prototype.getInputParameter = function( bValueAsString ) {
	var obj = null;
	var cognosViewer = this.getCognosViewer();
	var oSectionController = cognosViewer.getSelectionController();
	
	var aJsonContexts = oSectionController.getSelectedObjectsJsonContext(); 
	if (aJsonContexts) {
		
		var value = aJsonContexts;
		if( bValueAsString )
		{
			value = dojo.toJson( value );
		}
		obj = {"cognosParameter": value};
	}
	return obj;
	
}


BusinessProcessAction.prototype.startProcess = function( sBPD_Id, sProcessAppId, sProcessName ) {
	
	var callbacks = {
			customArguments: [ sProcessName ],
			complete : { object : this, method : this.handleGetStartProcessSuccessResponse },
			fault : { object : this, method : this.handleGetStartProcessFailResponse } 
	};
	
	var url = this.m_BPMGateway + 'process';
	
	var oFormFields = new Array();
	oFormFields.push( {name : 'action', value : 'start'} );
	oFormFields.push( {name : 'parts', value : 'data'} );
	
	if( sBPD_Id ) {
		oFormFields.push( {name : 'bpdId', value : sBPD_Id});
	}
	
	if( sProcessAppId ) {
		oFormFields.push( {name : 'processAppId', value : sProcessAppId} );
	}
	
	var oParam = this.getInputParameter(true /*value as string */);
	if( oParam ) {
		oFormFields.push( {name : 'params', value : dojo.toJson(oParam) } );
	}
				
	var request = this._createBPMServerRequest( 'POST', callbacks, url, oFormFields );
	request.sendRequest();
};

BusinessProcessAction.prototype.handleGetStartProcessSuccessResponse = function( serverResponse, sProcessName ) {
	var response = serverResponse.getResponseText();
	if( response ) {
		var jsonResponse = dojo.fromJson( response );
		if( jsonResponse.status === "200" ) {
			
			var sMsg = CViewerCommon.getMessage(RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG, sProcessName );
			var oInfoMsgDialog = new ModalInfoMessageDialog({
				sTitle : RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG_TITLE,
				sMessage : sMsg,
				sDescription : RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG_DETAIL
			});
			oInfoMsgDialog.show();
		}
	}
};

BusinessProcessAction.prototype.handleGetStartProcessFailResponse = function( serverResponse, sProcessName ) {
	var response = serverResponse.getResponseXml();
	if( response && response.documentElement )
	{
		this._handleXMLErrorResponse( response, sProcessName );
		return;
	}
	
	var sErrorMsg = CViewerCommon.getMessage( RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_FAILED_MSG, sProcessName );
	
	var sErrorDetails = serverResponse.getResponseText();
	try{
		var jsonResponse = dojo.fromJson( sErrorDetails );
		sErrorDetails = jsonResponse.Data.errorMessage;
	} catch(err) {/*swallow exception*/}
	
	this._showErrorMessage( sErrorMsg, sErrorDetails );
};


BusinessProcessAction.prototype._handleXMLErrorResponse = function( xmlError, sProcessName ) {
	
	var eError = XMLHelper_FindChildrenByTagName( xmlError, "error" );
	var sErrorMessage = "";
	var sErrorDetails = "";
	
	if( eError ) {
		sErrorMessage = XMLHelper_FindChildrenByTagName( eError, "message" ).childNodes[0].nodeValue;
		sErrorDetails = XMLHelper_FindChildrenByTagName( eError, "detail" ).childNodes[0].nodeValue;
	}
	else
	{
		sErrorMessage = CViewerCommon.getMessage( RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_FAILED_MSG, sProcessName);
	}

	this._showErrorMessage( sErrorMessage, sErrorDetails );
};

BusinessProcessAction.prototype._showErrorMessage = function( sErrorMsg, sErrorDetails ) {
	var errorDialog = new ModalFaultMessageDialog( sErrorMsg, sErrorDetails );
	errorDialog.show();
};

BusinessProcessAction.prototype._hasAnyContextInSelectedObjects = function() {
	
	var foundCtx = false;
	var oSectionController = this.m_oCV.getSelectionController();
	
	var aSelectedObjects = oSectionController.getAllSelectedObjects();
	for( var i=0; i<aSelectedObjects.length; i++) {
		var aCtxIds = aSelectedObjects[i].getSelectedContextIds();
		if (aCtxIds && aCtxIds.length>0) {
			foundCtx= true;
			break;
		}
	}

	return foundCtx;
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function DrillResetAction(){
	this.m_sAction = "DrillDown";
	this.m_sharePromptValues = null;
	this.m_aDrilledResetHUNs = null;
	this.m_updateInfoBar = true;
};

DrillResetAction.prototype = new ModifyReportAction();

DrillResetAction.prototype.setRequestParms = function(params) { 
	this.m_aDrilledResetHUNs = params.drilledResetHUNs;
	this.m_sharePromptValues = params.promptValues;
};

DrillResetAction.prototype.addAdditionalOptions = function( oReq ) {
	if( !this.m_oCV ) { return; }

	if( !this.m_sharePromptValues ){
		/**
		 * The format of prompt values from prompt control is different from that of the 
		 * share prompt event, therefore, need to prepare it differently 
		 */
		this.m_oCV.preparePromptValues( oReq );
		oReq.getRequestHandler().setForceRaiseSharePrompt(true);
	}else{
		if( !this.m_sharePromptValues ){
			return;
		}
		
		for (var promptValue in this.m_sharePromptValues){
			oReq.addFormField( promptValue, this.m_sharePromptValues[promptValue] );
		}
	}
};


DrillResetAction.prototype.addActionContextAdditionalParms = function(){
	var additionalContext = '<HUNS>';
	for( var i = 0; i < this.m_aDrilledResetHUNs.length ; i++ ){
		additionalContext += '<HUN>' + xml_encode( this.m_aDrilledResetHUNs[i] ) +'</HUN>';
	}
	additionalContext += '</HUNS>';
	additionalContext += '<action>resetDimension</action>';
	return additionalContext;
};

DrillResetAction.prototype.setUpdateInfoBar = function( bUpdate ){
	this.m_updateInfoBar = bUpdate;
}

DrillResetAction.prototype.updateInfoBar = function() {
	this.m_updateInfoBar;
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 
 
/**
 * Removes all the dynamic filters (slider) from the report spec.  This is for use with 
 * save new report in Cognos Connection.  No state information should be updated with this
 * call.
 * @returns
 */
function RemoveAllDataFilterAction()
{
	this.m_sAction = "UpdateDataFilter";
};

RemoveAllDataFilterAction.prototype.setCognosViewer = function( oCV ){
	this.m_oCV = oCV;
};

RemoveAllDataFilterAction.prototype.getCognosViewer = function( oCV ){
	return this.m_oCV;
};

/**
 *  requestParms = { callback : { method : xxxx},
 *  							{ object : yyyy}
 *  		       }
 */
RemoveAllDataFilterAction.prototype.setRequestParms= function( requestParms ){
	if( !requestParms || !requestParms.callback){ return;}
	this.m_callbackMethod = requestParms.callback.method;
	this.m_callbackObject = requestParms.callback.object;
};

RemoveAllDataFilterAction.prototype.createJSONDispatcherEntry = function( requestType )
{
	var oReq = new JSONDispatcherEntry(this.getCognosViewer());
	oReq.addFormField("ui.action", requestType);

	//add action context
	var actionContext = this.addActionContext();
	oReq.addFormField("cv.actionContext", actionContext);
	if (window.gViewerLogger)
	{
		window.gViewerLogger.log('Action context', actionContext, "xml");
	}


	if(typeof this.m_oCV.envParams["ui.spec"] != "undefined")
	{
		oReq.addFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
	}
	
	oReq.addFormField("bux", 'true');

	return oReq;
};

RemoveAllDataFilterAction.prototype.addActionContext = function(){
	var actionContext = "<reportActions";
	var inlineValues = "";

	actionContext += " run=\"false\"";

	actionContext += ">";
		
	actionContext += "<reportAction name=\"" + this.m_sAction + "\">";
	
	var actionParms = "{ \"removeAll\" :\"true\"}";

	actionContext += xml_encode(actionParms);

	actionContext += "</reportAction>";

	
	actionContext += "</reportActions>";

	return actionContext;
};

RemoveAllDataFilterAction.prototype.executeCallback = function(reportSpec) {
	
	var callbackFunc = GUtil.generateCallback(this.m_callbackMethod, [reportSpec], this.m_callbackObject);
	callbackFunc();
};

RemoveAllDataFilterAction.prototype.handleServerResponse = function( serverResponse ) {
	if( serverResponse && serverResponse.getJSONResponseObject() ){
		this.executeCallback( serverResponse.getJSONResponseObject().reportSpec);
	}
};

RemoveAllDataFilterAction.prototype.execute = function() {
	var oCV = this.getCognosViewer();
	
	if( !oCV.getRAPReportInfo().hasSlider() ){
		this.executeCallback(oCV.envParams["ui.spec"]);
	} else {	
		var cognosViewerRequest = this.createJSONDispatcherEntry( "modifyReport" );	
		cognosViewerRequest.setCallbacks({"complete":{"object":this, "method":this.handleServerResponse}});
		oCV.dispatchRequest(cognosViewerRequest);	
	}
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * Stub out the loadExtra method since we've just loaded the exta javacript file
 */
CCognosViewer.prototype.loadExtra = function() {};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function DrillContextMenuHelper() {}

/**
 * Visualization support: (also can be used for charts if VIEWER_JS_ENABLE_DRILL_SUBMENU is set to "charts")
 * This function either populates a drill submenu (see needsDrillSubMenu) or ensures jsonSpec is
 * set properly for a simple Drill Down or Drill Up menu item.  The submenu contains a "default"
 * and a set of one or more individual pieces that a user can decide to drill on.
 */
DrillContextMenuHelper.updateDrillMenuItems = function(jsonSpec, oCV, sAction)
{
	//There will be a submenu only if conditions are met....
	var subMenuItems = [];
	if (DrillContextMenuHelper.needsDrillSubMenu(oCV)) {
		var selectionController = oCV.getSelectionController();
		var selectedObjects = selectionController.getAllSelectedObjects();
		var selObj = selectedObjects[0];
	
		//For intersections, add the "Default menu item"
		if (selObj.getUseValues().length > 1 && typeof RV_RES != "undefined") {
			var oDrillOnMenuItem = { name: sAction, label: RV_RES.RV_DRILL_DEFAULT, action: { name: sAction, payload: {} } };
			subMenuItems.push(oDrillOnMenuItem);
		}

		//Add the innermost item.  For intersections, add the innermost level of dim1 and dim2
		var firstDim=(selObj.getUseValues().length>1) ? 1 : 0;
		var lastDim=selObj.getUseValues().length-1;
		lastDim=(lastDim>2) ? 2 : lastDim;	//Never allow the last dim to process more than rows/columns
		for (var iDim=firstDim; iDim<=lastDim; ++iDim) {
			DrillContextMenuHelper.addSubMenuItem(sAction, subMenuItems, selObj, iDim, 0);
		}
		//Do nested levels (either dim0 for edges or dim1 and dim2 for intersections)
		var bRenderedSeparator=false;
		for (var iDim=firstDim; iDim<=lastDim; ++iDim) {
			for (var iLevel=1; iLevel<selObj.getUseValues()[iDim].length; ++iLevel) {
				if (bRenderedSeparator==false) {
					subMenuItems.push({separator: true});
					bRenderedSeparator=true;	//If upper levels exist, render a separator.
				}
				DrillContextMenuHelper.addSubMenuItem(sAction, subMenuItems, selObj, iDim, iLevel);
			}
		}
	}

	DrillContextMenuHelper.completeDrillMenu(sAction, subMenuItems, jsonSpec);
};

/**
 * Visualization support:
 * Return true if a drill submenu needs to be shown under the Drill Up or Drill Down menu item. 
 * 
 * Rules: Show the submenu:
 * IF the number of dimensions OR the number of levels in the first dimension are > 1
 * AND its a visualization OR its a chart and the VIEWER_JS_ENABLE_DRILL_SUBMENU advanced server property is set to "charts".
 * 
 * NOTE: The Drill Up/Drill Down menu item won't be shown at all if the net drillability is determined to be 0.
 * 
 * @return true if this is the case.
 */
DrillContextMenuHelper.needsDrillSubMenu = function(oCV)
{
	var selectionController = (oCV && oCV.getSelectionController());
	if (selectionController) {
		var selectedObjects = selectionController.getAllSelectedObjects();
		if(selectedObjects.length == 1 && selectedObjects[0].isHomeCell && selectedObjects[0].isHomeCell() == false)	{
			var bDrillSubmenu = selectedObjects[0].isSelectionOnVizChart(); 
			if (!bDrillSubmenu) {
				var drillSubMenuType = oCV.getAdvancedServerProperty("VIEWER_JS_ENABLE_DRILL_SUBMENU");
				bDrillSubmenu = (drillSubMenuType=="charts" && selectionController.hasSelectedChartNodes());
			}
			
			if (bDrillSubmenu) {
				var selObj = selectedObjects[0];
				return (bDrillSubmenu && selObj.getUseValues() && (selObj.getUseValues().length > 1 || selObj.getUseValues()[0].length > 1));
			}
		}
	}
	return false;
};

/**
 * For the selected object at position iDim and iLevel, if that component of the selection is drillable,
 * add an item to the submenu.
 */
DrillContextMenuHelper.addSubMenuItem = function(sAction, subMenuItems, selObj, iDim, iLevel)
{
	var drillOption = selObj.getDrillOptions()[iDim][iLevel];
	if (DrillContextMenuHelper.isOptionDrillable(sAction, drillOption)) {
		var sItemLabel = DrillContextMenuHelper.getItemValue(selObj, iDim, iLevel);
		if (sItemLabel) {
			var sDataItem  = selObj.getDataItems()[iDim][iLevel];
			var oDrillOnMenuItem = { name: sAction, label: sItemLabel, action: { name: sAction, payload: { userSelectedDrillItem: sDataItem } } };
			subMenuItems.push(oDrillOnMenuItem);
		}
	}
};

/**
 * If a submenu is required, add the items, otherwise ensure the basic action is defined.
 */
DrillContextMenuHelper.completeDrillMenu = function(sAction, subMenuItems, jsonSpec)
{
	if (subMenuItems.length > 0) {
		jsonSpec.items = subMenuItems;
	} else {
		jsonSpec.items = null;
		if (jsonSpec.action==null) {
			jsonSpec.action = { name: sAction, action: { name: sAction } };
		}
	}
};


/**
 * Return true if the drillFlag value is drillable for the current action (eg: DrillDown and 2,3,4; DrillUp and 1,3,4) 
*/
DrillContextMenuHelper.isOptionDrillable = function(sAction, drillFlag)
{
	//0=none, 1=up, 2=down, 3=downorup, 4=upordown
	return (drillFlag>=3 || (sAction=="DrillDown" && drillFlag==2) || (sAction=="DrillUp" && drillFlag==1));
};

/**
 * Return the item value for the selected object...(usually the useValue of a label like "Camping Equipment")
 */
DrillContextMenuHelper.getItemValue = function(selObj, iDim, iLevel)
{
	var itemsLabel = (iLevel==0) ? selObj.getDisplayValues()[iDim] : null;
	return ((itemsLabel) ? itemsLabel : selObj.getUseValues()[iDim][iLevel]); 
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
dojo.provide("viewer.dialogs.ClipboardDialog");

dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.Button");

dojo.declare("viewer.dialogs.ClipboardDialog", bux.dialogs.BaseCustomContentDialog, {
	sTitle: null,
	okHandler: null, /*Function?*/
	cancelHandler:null, /*Function?*/

	startup: function() {
		this.updateTitle(this.sTitle);
		this.inherited(arguments);
		var tableContainer = new bux.layout.TableContainer({
			// TODO remove this class
			classname: "bux-InformationDialog"
		},this.contentContainer);

		var cell = null, row = null;


		this._textField = new dijit.form.SimpleTextarea({
			required:true,
			rows: 10,
			cols: 50,
			style: 'width:auto'});


		row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});

		cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-field",
			parentContainer: row
		});
		cell.addContent(this._textField.domNode);
	},
	onOK : function()
	{
		if (this._textField.state != "Error")
		{
			this.inherited(arguments);
			this.okHandler(this._textField.get("value"));
			this.hide();
		}
	}
});
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

dojo.provide( "bux.reportViewer.chart");

dojo.declare( "bux.reportViewer.chart", null,
{
	m_displayTypeDialogDefinition: null,

	constructor: function( )
	{
		this.initialize();
	},

	initialize: function()
	{
		if( this.m_displayTypeDialogDefinition !== null)
		{
			return;
		}
			this.m_displayTypeDialogDefinition = [
								{
									//label: "Table",
									label: RV_RES.IDS_JS_CHART_TABLE,
									image: "images/dialog/displayOptionsDialog/type_icons/table.gif",
									options: [
												{
													label: RV_RES.IDS_JS_CHART_CROSSTAB,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/crosstab_48.gif",
													value: "crosstab"
												},
												{
													label: RV_RES.IDS_JS_CHART_LIST_TABLE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/List_48.gif",
													value: "list"
												}
											]
								},
								{
									label: RV_RES.IDS_JS_CHART_COLUMN,
									image: "images/dialog/displayOptionsDialog/type_icons/column.gif",
									options: [
												{
													label: RV_RES.IDS_JS_CHART_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_clustered_flat.gif",
													value: "column_clustered_flat"
												},
												{
													//label: "Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_clustered.gif",
													value: "column_clustered"
												},
												{
													//label: "Stacked Column",
													label: RV_RES.IDS_JS_CHART_STACKED_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_stacked_flat.gif",
													value: "column_stacked_flat"
												},
												{
													//label: "Stacked Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_stacked.gif",
													value: "column_stacked"
												},
												{
													//label: "100% Stacked Column",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_percent_flat.gif",
													value: "column_percent_flat"
												},
												{
													//label: "100% Stacked Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_percent.gif",
													value: "column_percent"
												},
												{
													//label: "3-D Axis Column",
													label: RV_RES.IDS_JS_CHART_3D_AXIS_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_3daxis.gif",
													value: "column_3daxis"
												},
												{
													label: RV_RES.IDS_JS_CHART_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_clustered.jpg",
													value: "v2_column_rectangle_clustered"
												},
												{
													//label: "Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_clustered_depth.jpg",
													value: "v2_column_box_clustered_depth"
												},
												{
													//label: "Stacked Column",
													label: RV_RES.IDS_JS_CHART_STACKED_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_stacked.jpg",
													value: "v2_column_rectangle_stacked"
												},
												{
													//label: "Stacked Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_stacked_depth.jpg",
													value: "v2_column_box_stacked_depth"
												},
												{
													//label: "100% Stacked Column",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_percent.jpg",
													value: "v2_column_rectangle_percent"
												},
												{
													//label: "100% Stacked Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_percent_depth.jpg",
													value: "v2_column_box_percent_depth"
												}
											]
								},
								{
									//label: "Bar",
									label: RV_RES.IDS_JS_CHART_BAR,
									image: "images/dialog/displayOptionsDialog/type_icons/bar.gif",
									options: [
												{
													label: RV_RES.IDS_JS_CHART_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_clustered_flat.gif",
													value: "bar_clustered_flat"
												},
												{
													//label: "Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_clustered.gif",
													value: "bar_clustered"
												},
												{
													//label: "Stacked Bar",
													label: RV_RES.IDS_JS_CHART_STACKED_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_stacked_flat.gif",
													value: "bar_stacked_flat"
												},
												{
													//label: "Stacked Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_stacked.gif",
													value: "bar_stacked"
												},
												{
													//label: "100% Stacked Bar",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_percent_flat.gif",
													value: "bar_percent_flat"
												},
												{
													//label: "100% Stacked Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_percent.gif",
													value: "bar_percent"
												},
												{
													label: RV_RES.IDS_JS_CHART_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_clustered.jpg",
													value: "v2_bar_rectangle_clustered"
												},
												{
													//label: "Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_clustered_depth.jpg",
													value: "v2_bar_box_clustered_depth"
												},
												{
													//label: "Stacked Bar",
													label: RV_RES.IDS_JS_CHART_STACKED_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_stacked.jpg",
													value: "v2_bar_rectangle_stacked"
												},
												{
													//label: "Stacked Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_stacked_depth.jpg",
													value: "v2_bar_box_stacked_depth"
												},
												{
													//label: "100% Stacked Bar",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_percent.jpg",
													value: "v2_bar_rectangle_percent"
												},
												{
													//label: "100% Stacked Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_percent_depth.jpg",
													value: "v2_bar_box_percent_depth"
												}
											]
								},
								{
									//label: "Line",
									label: RV_RES.IDS_JS_CHART_LINE,
									image: "images/dialog/displayOptionsDialog/type_icons/line.gif",
									options: [
												{
													//label: "Line with Markers",
													label: RV_RES.IDS_JS_CHART_LINE_WITH_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered_flat_markers.gif",
													value: "line_clustered_flat_markers"
												},
												{
													//label: "Line",
													label: RV_RES.IDS_JS_CHART_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered_flat.gif",
													value: "line_clustered_flat"
												},
												{
													//label: "Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_LINE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered.gif",
													value: "line_clustered"
												},
												{
													//label: "Step Line with Markers",
													label: RV_RES.IDS_JS_CHART_STEP_LINE_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stepAtPoint_clustered_flat_markers.gif",
													value: "line_stepAtPoint_clustered_flat_markers"
												},
												{
													//label: "Step Line",
													label: RV_RES.IDS_JS_CHART_STEP_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stepAtPoint_clustered_flat.gif",
													value: "line_stepAtPoint_clustered_flat"
												},
												{
													//label: "Stacked Line with Markers",
													label: RV_RES.IDS_JS_CHART_STACKED_LINE_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked_flat_markers.gif",
													value: "line_stacked_flat_markers"
												},
												{
													//label: "Stacked Line",
													label: RV_RES.IDS_JS_CHART_STACKED_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked_flat.gif",
													value: "line_stacked_flat"
												},
												{
													//label: "Stacked Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_LINE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked.gif",
													value: "line_stacked"
												},
												{
													//label: "100% Stacked Line with Markers",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent_flat_markers.gif",
													value: "line_percent_flat_markers"
												},
												{
													//label: "100% Stacked Line",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent_flat.gif",
													value: "line_percent_flat"
												},
												{
													//label: "100% Stacked Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE__3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent.gif",
													value: "line_percent"
												},
												{
													//label: "3-D Axis Line",
													label: RV_RES.IDS_JS_CHART_3D_AXIS_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_3daxis.gif",
													value: "line_3daxis"
												},
												{
													//label: "Line",
													label: RV_RES.IDS_JS_CHART_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered.jpg",
													value: "v2_line_clustered"
												},
												{
													//label: "Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_LINE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_depth.jpg",
													value: "v2_line_clustered_depth"
												},
												{
													//label: "Line with Markers",
													label: RV_RES.IDS_JS_CHART_LINE_WITH_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_markers.jpg",
													value: "v2_line_clustered_markers"
												},
												{
													//label: "Line with 3-D Visual Effect Markers",
													label: RV_RES.IDS_JS_CHART_LINE_WITH_3D_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_3dmarkers.jpg",
													value: "v2_line_clustered_3dmarkers"
												},
												{
													//label: "Step Line",
													label: RV_RES.IDS_JS_CHART_STEP_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_stepped_line_at_points_clustered.jpg",
													value: "v2_stepped_line_at_points_clustered"
												},
												{
													//label: "Step Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STEP_LINE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_stepped_line_at_points_clustered_depth.jpg",
													value: "v2_stepped_line_at_points_clustered_depth"
												}
											]
								},
								{
									//label: "Pie, Donut",
									label: RV_RES.IDS_JS_CHART_PIE_DONUT,
									image: "images/dialog/displayOptionsDialog/type_icons/pie.gif",
									options: [
												{
													//label: "Pie",
													label: RV_RES.IDS_JS_CHART_PIE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_flat.gif",
													value: "pie_flat"
												},
												{
													//label: "Donut",
													label: RV_RES.IDS_JS_CHART_DONUT,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_flat_hole.gif",
													value: "pie_flat_hole"
												},
												{
													//label: "Pie with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PIE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_pie.gif",
													value: "pie"
												},
												{
													//label: "Donut with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_DONUT_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_hole.gif",
													value: "pie_hole"
												},
												{
													//label: "Pie",
													label: RV_RES.IDS_JS_CHART_PIE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_flat.jpg",
													value: "v2_pie"
												},
												{
													//label: "Pie with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PIE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie.jpg",
													value: "v2_pie_depth_round"
												},
												{
													//label: "Donut",
													label: RV_RES.IDS_JS_CHART_DONUT,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_hole_flat.jpg",
													value: "v2_donut"
												},
												{
													//label: "Donut with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_DONUT_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_hole.jpg",
													value: "v2_donut_depth_round"
												}
											]
								},
								{
									//label: "Area",
									label: RV_RES.IDS_JS_CHART_AREA,
									image: "images/dialog/displayOptionsDialog/type_icons/area.gif",
									options: [
												{
													//label: "Area",
													label: RV_RES.IDS_JS_CHART_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_clustered_flat.gif",
													value: "area_clustered_flat"
												},
												{
													//label: "Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_clustered.gif",
													value: "area_clustered"
												},
												{
													//label: "Stacked Area",
													label: RV_RES.IDS_JS_CHART_STACKED_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_stacked_flat.gif",
													value: "area_stacked_flat"
												},
												{
													//label: "Stacked Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_stacked.gif",
													value: "area_stacked"
												},
												{
													//label: "100% Area",
													label: RV_RES.IDS_JS_CHART_PERCENT_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_percent_flat.gif",
													value: "area_percent_flat"
												},
												{
													//label: "100% Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_percent.gif",
													value: "area_percent"
												},
												{
													//label: "3-D Axis Area",
													label: RV_RES.IDS_JS_CHART_3D_AXIS_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_3daxis.gif",
													value: "area_3daxis"
												},
												{
													//label: "Stacked Area",
													label: RV_RES.IDS_JS_CHART_STACKED_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_flat_point_to_point.gif",
													value: "v2_area_stacked_flat"
												},
												{
													//label: "Stacked Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_depth_point_to_point.gif",
													value: "v2_area_stacked"
												},
												{
													//label: "100% Area",
													label: RV_RES.IDS_JS_CHART_PERCENT_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_flat_percent_point_to_point.gif",
													value: "v2_area_percent_flat"
												},
												{
													//label: "100% Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_depth_percent_point_to_point.gif",
													value: "v2_area_percent"
												}
											]
								},
								{
									//label: "Scatter, Bubble, Point",
									label: RV_RES.IDS_JS_CHART_SCATTER_BUBBLE_POINT,
									image: "images/dialog/displayOptionsDialog/type_icons/scatter.gif",
									options: [
												{
													//label: "Scatter",
													label: RV_RES.IDS_JS_CHART_SCATTER,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_scatter.gif",
													value: "scatter"
												},
												{
													//label: "Bubble",
													label: RV_RES.IDS_JS_CHART_BUBBLE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bubble.gif",
													value: "bubble"
												},
												{
													//label: "Bubble with Excel Bubble Sizing",
													label: RV_RES.IDS_JS_CHART_BUBBLE_WITH_EXCEL_BUBBLE_SIZING,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bubble_excel.gif",
													value: "bubble_zeroBased"
												},
												{
													//label: "Point",
													label: RV_RES.IDS_JS_CHART_POINT,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_point_clustered.gif",
													value: "point_clustered"
												},
												{
													//label: "3-D Scatter",
													label: RV_RES.IDS_JS_CHART_3D_SCATTER,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_scatter_3daxis.gif",
													value: "scatter_3daxis"
												},
												{
													//label: "Scatter",
													label: RV_RES.IDS_JS_CHART_SCATTER,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_scatter.gif",
													value: "v2_scatter"
												},
												{
													//label: "Bubble",
													label: RV_RES.IDS_JS_CHART_BUBBLE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bubble.gif",
													value: "v2_bubble"
												},
												{
													//label: "Bubble with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_BUBBLE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bubble_3dmarkers.gif",
													value: "v2_bubble_3d"
												},
												{
													//label: "Point",
													label: RV_RES.IDS_JS_CHART_POINT,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_point_clustered_markers.jpg",
													value: "v2_point_clustered_markers"
												},
												{
													//label: "Point with 3-D Markers",
													label: RV_RES.IDS_JS_CHART_POINT_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_point_clustered_3dmarkers.jpg",
													value: "v2_point_clustered_3dmarkers"
												}
											]
								},
								{
									//label: "Gauge",
									label: RV_RES.IDS_JS_CHART_GAUGE,
									image: "images/dialog/displayOptionsDialog/type_icons/gauge.gif",
									options: [
												{
													//label: "Dial Gauge",
													label: RV_RES.IDS_JS_CHART_DIAL_GAUGE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_gauge_dial.gif",
													value: "gauge_dial"
												},
												{
													//label: "Dial Gauge",
													label: RV_RES.IDS_JS_CHART_DIAL_GAUGE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_gauge.gif",
													value: "v2_gauge"
												}
											]
								}
							];
	},

	getDisplayTypeDialogDefinition: function( targetTypes )
	{
		var newDialogDefinition = [];

		for ( var j in this.m_displayTypeDialogDefinition )
		{
			var chartGroup = this.m_displayTypeDialogDefinition[j];
			var newChartGroup = {};
			newChartGroup.image = this.m_displayTypeDialogDefinition[j].image;
			newChartGroup.label = this.m_displayTypeDialogDefinition[j].label;
			newChartGroup.options = [];

			var charts = chartGroup.options;
			for( var k in charts)
			{
				var chart = charts[k];
				for( var i in targetTypes)
				{
					var targetType = targetTypes[i];
					if(chart.value === targetType )
					{
						var chartCopy = {
								label : chart.label,
								Description : chart.Description,
								image : chart.image,
								value : "{targetType:'" + chart.value + "', label:'" + chart.label + "'}"
						};
						newChartGroup.options.push( chartCopy );
					}
				}
			}

			if( newChartGroup.options.length > 0)
			{
				newDialogDefinition.push( newChartGroup );
			}
		}

		return newDialogDefinition;
	}
});/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * Class which knows what form fields are needed for the Action classes
 * and info requests
 * @param {Object} DispatcherEntry
 */
function ActionFormFields(dispatcherEntry) {
	this.m_dispatcherEntry = dispatcherEntry;
	this.m_oCV = dispatcherEntry.getViewer();
}

ActionFormFields.prototype.addFormFields = function() {
	var dispatcherEntry = this.m_dispatcherEntry;
	var action = dispatcherEntry.getAction();
	
	action.preProcess();

	dispatcherEntry.addFormField("ui.action", "modifyReport");

	if(this.m_oCV.getModelPath() !== "") {
		dispatcherEntry.addFormField("modelPath", this.m_oCV.getModelPath());
		if(typeof this.m_oCV.envParams["metaDataModelModificationTime"] != "undefined") {
			dispatcherEntry.addFormField("metaDataModelModificationTime", this.m_oCV.envParams["metaDataModelModificationTime"]);
		}
	}

	if( action.doAddActionContext() === true ) {
		var actionContext = action.addActionContext();
		dispatcherEntry.addFormField("cv.actionContext", actionContext);
		if (window.gViewerLogger) {
			window.gViewerLogger.log('Action context', actionContext, "xml");
		}
	}

	var isBux = this.m_oCV.envParams["bux"] == "true";
	
	if (isBux) {
		dispatcherEntry.addFormField("cv.showFaultPage", "false");
	}
	else {
		dispatcherEntry.addFormField("cv.showFaultPage", "true");
	}
	dispatcherEntry.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);
	dispatcherEntry.addDefinedFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
	dispatcherEntry.addDefinedFormField("modelPath", this.m_oCV.envParams["modelPath"]);
	dispatcherEntry.addDefinedFormField("packageBase", this.m_oCV.envParams["packageBase"]);
	dispatcherEntry.addDefinedFormField("rap.state", this.m_oCV.envParams["rap.state"]);
	dispatcherEntry.addDefinedFormField("rap.reportInfo", this.m_oCV.envParams["rapReportInfo"]);
	dispatcherEntry.addDefinedFormField("ui.primaryAction", this.m_oCV.envParams["ui.primaryAction"]);
	dispatcherEntry.addNonNullFormField("cv.debugDirectory", this.m_oCV.envParams["cv.debugDirectory"]);
	dispatcherEntry.addNonNullFormField("ui.objectClass", this.m_oCV.envParams["ui.objectClass"]);
	dispatcherEntry.addNonNullFormField("bux", this.m_oCV.envParams["bux"]);
	dispatcherEntry.addNonNullFormField("baseReportModificationTime", this.m_oCV.envParams["baseReportModificationTime"]);
	dispatcherEntry.addNonNullFormField("originalReport", this.m_oCV.envParams["originalReport"]);

	//Flash chart option
	var flashChartOptionValue = this.m_oCV.getFlashChartOption();
	if( flashChartOptionValue != null)
	{
		dispatcherEntry.addFormField("savedFlashChartOption", flashChartOptionValue);
		if (flashChartOptionValue && action !=null && typeof(action.m_requestParams)!= "undefined" && typeof(action.m_requestParams.targetType)!= "undefined")	{
			var hasAVSChart = false;
			var sTarget = null;
			if (typeof(action.m_requestParams.targetType.targetType)!= "undefined") {
				//fix for Defect:COGCQ00676339 Error generated on conversion of crosstab to chart, with chart animation enabled
				//TargetType may be an Object type
				sTarget = action.m_requestParams.targetType.targetType;
			} else {
				sTarget = action.m_requestParams.targetType;
			}
			
			if (sTarget.match('v2_') != null || sTarget.match('_v2') != null)
			{
				hasAVSChart = true;
			}
			else
			{
				var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
				var selectedReportInfo = action.getSelectedReportInfo();
				if (oRAPReportInfo && selectedReportInfo) {
					// get all the display types except for the currently selected container. We already checked
					// the currently selected container in the about 'if' statement
					var sDisplayTypes = oRAPReportInfo.getDisplayTypes(selectedReportInfo.container);
					
					if (sDisplayTypes.match('v2_') != null || sDisplayTypes.match('_v2') != null) {
						hasAVSChart = true;
					}
				}
			}
			dispatcherEntry.addFormField("hasAVSChart", hasAVSChart);
		}
		else
		{
			dispatcherEntry.addFormField("hasAVSChart", this.m_oCV.hasAVSChart());
		}
	}

	var sEP = this.m_oCV.getExecutionParameters();
	if (sEP) {
		dispatcherEntry.addFormField("executionParameters", encodeURIComponent(sEP));
	}

	dispatcherEntry.addFormField("ui.conversation", encodeURIComponent(this.m_oCV.getConversation())); //MARK: needed? (its a primary request)
	dispatcherEntry.addFormField("m_tracking", encodeURIComponent(this.m_oCV.getTracking())); //MARK: needed? (its a primary request)

	var sCAF = this.m_oCV.getCAFContext();
	if (sCAF) {
		dispatcherEntry.addFormField("ui.cafcontextid", sCAF);
	}
	
	if (action.forceRunSpecRequest()) {
		dispatcherEntry.addFormField("widget.forceRunSpec", "true");
	}
};

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * This class is used to make requests in a hidden iframe
 */

HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX = "viewerHiddenRequest";
HiddenIframeDispatcherEntry.FORM_NAME = "viewerHiddenFormRequest";

function HiddenIframeDispatcherEntry(oCV) {
	HiddenIframeDispatcherEntry.baseConstructor.call(this, oCV);
	
	if (oCV) {
		HiddenIframeDispatcherEntry.prototype.setDefaultFormFields.call(this);
		this.setRequestHandler(new RequestHandler(oCV));
		this.setWorkingDialog(oCV.getWorkingDialog());
		this.setRequestIndicator(oCV.getRequestIndicator());
		this.m_httpRequestConfig = oCV.getConfig() && oCV.getConfig().getHttpRequestConfig() ? oCV.getConfig().getHttpRequestConfig() : null;
		
		this.setIframeId(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX + oCV.getId());
		this.originalGetViewerConfiguration = null;
	}
}
HiddenIframeDispatcherEntry.prototype = new DispatcherEntry();
HiddenIframeDispatcherEntry.baseConstructor = DispatcherEntry;

HiddenIframeDispatcherEntry.prototype.setDefaultFormFields = function() {
	var oCV = this.getViewer();
	var sCAF = oCV.getCAFContext();
	this.addDefinedNonNullFormField("ui.cafcontextid", sCAF);
};

HiddenIframeDispatcherEntry.prototype.sendRequest = function() {
	this._createHiddenIframe();
	var form = this._createForm();
	this._setupCallbacks();
	this.onPreHttpRequest(this.getRequest());
	form.submit();
};

/**
 * Do any cleanup or callbacks once the iframe is finished running the request
 */
HiddenIframeDispatcherEntry.prototype._iframeRequestComplete = function() {
	window.getViewerConfiguration = this.originalGetViewerConfiguration;
	this.onPostHttpRequest();
	this.onEntryComplete();
};

/**
 * Using our public callback mechanism setup callbacks for the hidden iframes
 */
HiddenIframeDispatcherEntry.prototype._setupCallbacks = function() {
	// Save the original getViewerConfiguration method if we have one
	this.originalGetViewerConfiguration = window.getViewerConfiguration;

	// We only need to setup these callbacks if we're using Ajax otherwise
	// the iframes onload callback will be triggered and we'll get the status there
	if (this.getFormField("cv.useAjax") != "false") {	
		var hiddenIframeDispatcherEntry = this;
		var requestIndicator = this.getRequestHandler().getRequestIndicator();
		var workingDialog = this.getRequestHandler().getWorkingDialog();
		
		window.getViewerConfiguration = function() {
			var configObj = {
				"httpRequestCallbacks" : {
					"reportStatus" : {
						"complete" : function() { hiddenIframeDispatcherEntry.onComplete() },
						"working" : function() { hiddenIframeDispatcherEntry.onWorking() },
						"prompting" : function() { hiddenIframeDispatcherEntry.onPrompting() }
					}
				}
			};
			
			return configObj;
		};
	}
};


HiddenIframeDispatcherEntry.prototype.setIframeId = function(id) {
	this._iframeId = id;
};

HiddenIframeDispatcherEntry.prototype.getIframeId = function() {
	return this._iframeId;
};


/**
 * Creates the form that will POST the request to the hidden iframe
 */
HiddenIframeDispatcherEntry.prototype._createForm = function(params) {
	var oCV = this.getViewer();
	var formId = HiddenIframeDispatcherEntry.FORM_NAME + oCV.getId();
	var requestForm = document.getElementById(formId);
	if (requestForm) {
		requestForm.parentNode.removeChild(requestForm);
		requestForm = null;
	}
	
	var sDispatcherURI = location.protocol + '//' + location.host + oCV.m_sGateway;
	
	requestForm = document.createElement("form");
	requestForm.setAttribute("method","post");
	requestForm.setAttribute("action", sDispatcherURI);		
	requestForm.setAttribute("target", this.getIframeId());
	requestForm.setAttribute("id", formId);
	requestForm.style.display = "none";

	var formFields = this.getRequest().getFormFields();
	var formFieldNames = formFields.keys();
	for (var index = 0; index < formFieldNames.length; index++)	{
		requestForm.appendChild(createHiddenFormField(formFieldNames[index], formFields.get(formFieldNames[index])));
	}

	
	document.body.appendChild(requestForm);
	
	return requestForm;
};


/**
 * Creates the hidden iframe that will be used for the request
 */
HiddenIframeDispatcherEntry.prototype._createHiddenIframe = function() {
	var oCV = this.getViewer();
	var iframeId = this.getIframeId();
	var iframeElem = document.getElementById(iframeId);
	if (iframeElem) {
		iframeElem.parentNode.parentNode.removeChild(iframeElem.parentNode);
	}
	
	// There's a bug in IE where you can't post to an iframe if it's created dynamically, 
	// however if you append an iframe into a div using innerHTML then it work.
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.style.left="0px";
	div.style.top="0px";		
	div.style.display = "none";
	document.body.appendChild(div);
	
	div.innerHTML = "<iframe frameborder=\"0\" id=\"" + iframeId + "\" name=\"" + iframeId + "\"></iframe>";
	iframeElem = document.getElementById(iframeId);

	// only set the onload after it's appended to the DOM or it will get triggered right away in certain browsers	
	var thisObj = this;
	var func = function() {HiddenIframeDispatcherEntry.handleIframeLoad(thisObj);};
	if(iframeElem.attachEvent) {
		iframeElem.attachEvent("onload", func);
	}
	else {
		iframeElem.addEventListener("load", func, true);
	}
};

/**
 * Hides the iframe. This gets called when we got a fault that we
 * showed to the user and they hit the Ok button in the fault dialog.
 */
HiddenIframeDispatcherEntry.hideIframe = function(cvId) {
	var iframeElement = document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX + cvId);
	
	if (iframeElement) {
		iframeElement.parentNode.style.display = "none";
	}
};

HiddenIframeDispatcherEntry.showIframeContentsInWindow = function(cvId) {
	var iframeElement = document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX + cvId);
	if (!iframeElement) {
		return;
	}

	var html = iframeElement.contentWindow.document.getElementsByTagName('html')[0].innerHTML;
	var htmlWindow = window.open("","",'height=400,width=500');
	if(htmlWindow) {
		htmlWindow.document.write("<html>" + html + "</html>");
	}
};


/**
 * Gets called when the iframe is loaded. Status can be complete, working, fault, ...
 */
HiddenIframeDispatcherEntry.handleIframeLoad = function(dispatcherEntry) {	
	if (!dispatcherEntry) {
		return;
	}

	var iframeElement = document.getElementById(dispatcherEntry.getIframeId());
	if (!iframeElement) {
		return;
	}
	
	var oCV = iframeElement.contentWindow.window.gaRV_INSTANCES ? iframeElement.contentWindow.window.gaRV_INSTANCES[0] : null;
	var status = oCV ? oCV.getStatus() : null;
	if (status == "complete") {
		dispatcherEntry.onComplete();
	}
	if (status == "working") {
		dispatcherEntry.onWorking();
	}
	if (status == "prompting") {
		dispatcherEntry.onPrompting();
	}
	if (!oCV || status == "fault" || status == "") {
		dispatcherEntry.onFault();
	}
};


HiddenIframeDispatcherEntry.prototype.onFault = function() {
	this._iframeRequestComplete();
	HiddenIframeDispatcherEntry.showIframeContentsInWindow(this.getViewer().getId());
};

HiddenIframeDispatcherEntry.prototype.onPrompting = function() {
	this._iframeRequestComplete();
	
	if (this.m_httpRequestConfig) {
		var callback = this.m_httpRequestConfig.getReportStatusCallback("prompting");
		if (typeof callback == "function") {
			callback();
		}
	}

	HiddenIframeDispatcherEntry.showIframeContentsInWindow(this.getViewer().getId());
};
	

HiddenIframeDispatcherEntry.prototype.onComplete = function() {
	this._iframeRequestComplete();

	if (this.m_httpRequestConfig) {
		var callback = this.m_httpRequestConfig.getReportStatusCallback("complete");
		if (typeof callback == "function") {
			callback();
		}
	}
	
	var iframeElement = document.getElementById(this.getIframeId());
	
	// We don't want the iframe to ever release the conversation, so unhook the leavingRV method.
	if (typeof iframeElement.contentWindow.detachLeavingRV == "function") {
		iframeElement.contentWindow.detachLeavingRV();
	}
	var divContainer = iframeElement.parentNode;
	divContainer.style.display = "none";	
	
	if (this.getCallbacks() && this.getCallbacks()["complete"]) {
		HiddenIframeDispatcherEntry.executeCallback(this.getCallbacks()["complete"]);
	}
};

HiddenIframeDispatcherEntry.prototype.cancelRequest = function(forceSynchronous) {
	this._iframeRequestComplete();
	// guard against sending multiple cancel requests
	if (!this.m_bCancelCalled) {
		this.m_bCancelCalled = true;
		var iframeElement = document.getElementById(this.getIframeId());
		if (!iframeElement) {
			return;
		}
		
		var oCV = iframeElement.contentWindow[getCognosViewerObjectString(this.getViewer().getId())];
		if (oCV) {
			oCV.cancel();
		}		
	}
};

HiddenIframeDispatcherEntry.executeCallback = function(callback) {
	if (callback) {
		var callbackFunc = GUtil.generateCallback(callback.method, callback.params, callback.object);
		callbackFunc();
	}
};

HiddenIframeDispatcherEntry.getIframe = function(cvId) {
	var iframe = document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX + cvId);
	return iframe;
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/*
 *******************************************************************************
 *** View DispatcherEntry.js for information on the dispatcher entry classes ***
 *******************************************************************************
 */
function ReportInfoDispatcherEntry(oCV)
{
	ReportInfoDispatcherEntry.baseConstructor.call(this, oCV);
	
	if (oCV) {
		this.setCallbacks( {
			"complete" : {"object" : this, "method" : this.onComplete },
			"prompting": {"object": this, "method": this.onPrompting}
			});
		
		this.getRequestHandler().setFaultDialog(new ModalFaultDialog(oCV));
	}
}

ReportInfoDispatcherEntry.prototype = new AsynchJSONDispatcherEntry();
ReportInfoDispatcherEntry.baseConstructor = AsynchJSONDispatcherEntry;

ReportInfoDispatcherEntry.prototype.initializeAction = function(action)
{
	this.setKey(action.getActionKey());
	this.setCanBeQueued(action.canBeQueued());
	
	this.m_action = action;
};

ReportInfoDispatcherEntry.prototype.getAction = function() {
	return this.m_action;
};

ReportInfoDispatcherEntry.prototype.prepareRequest = function()
{
	var actionFormFields = new ActionFormFields(this);
	actionFormFields.addFormFields();
};

ReportInfoDispatcherEntry.prototype.onComplete = function(asynchJSONResponse, arg1)
{
	//The request for a single entry has completed...
	if (this.m_oCV.getViewerDispatcher().queueIsEmpty()==true) {
		var callbackFunction = this.m_action.getOnCompleteCallback();
		callbackFunction(asynchJSONResponse);
	}
};


ReportInfoDispatcherEntry.prototype.onPrompting = function(asynchJSONResponse, arg1)
{	
		var callbackFunction = this.m_action.getOnPromptingCallback();		
		 callbackFunction(asynchJSONResponse);			
};

ReportInfoDispatcherEntry.prototype.onPostEntryComplete = function()
{
	var oCV = this.getViewer();
	if (oCV && oCV.getViewerWidget()) {
		var cvWidget = oCV.getViewerWidget();
		cvWidget.getLoadManager().processQueue();
	}
};/*
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

/*
 *******************************************************************************
 *** View DispatcherEntry.js for information on the dispatcher entry classes ***
 *******************************************************************************
 */
function ModifyReportDispatcherEntry(oCV)
{
	ModifyReportDispatcherEntry.baseConstructor.call(this, oCV);
	this.m_action = null;
	if (oCV) {
		this.m_viewerWidget = oCV.getViewerWidget();

		this.setRequestHandler(new RequestHandler(oCV));
		this.setWorkingDialog(oCV.getWorkingDialog());
		this.setRequestIndicator(oCV.getRequestIndicator());

		this.setCallbacks({ 
			"complete" : {"object" : this, "method" : this.onComplete},
			"prompting" : {"object" : this, "method" : this.onPrompting}
		});	
	}
}
ModifyReportDispatcherEntry.prototype = new AsynchDataDispatcherEntry();
ModifyReportDispatcherEntry.baseConstructor = AsynchDataDispatcherEntry;
ModifyReportDispatcherEntry.prototype.parent = AsynchDataDispatcherEntry.prototype;


ModifyReportDispatcherEntry.prototype.initializeAction = function(action)
{
	this.setKey(action.getActionKey());
	this.setCanBeQueued(action.canBeQueued());
	
	this.m_action = action;
};

ModifyReportDispatcherEntry.prototype.getAction = function() {
	return this.m_action;
};

ModifyReportDispatcherEntry.prototype.prepareRequest = function()
{	
	if(this.m_viewerWidget){
		DispatcherEntry.addWidgetInfoToFormFields(this.m_viewerWidget, this);
	}
	
	var actionFormFields = new ActionFormFields(this);
	actionFormFields.addFormFields();

	if (this.m_viewerWidget) {
		this.addFormField("cv.id", this.m_viewerWidget.getViewerId());
	}
	this.addFormField("keepIterators", "true");
	this.addFormField("run.prompt", this.m_action.getPromptOption());

	if(this.m_action.reuseQuery() === true) {
		this.addFormField("reuseResults", "true");
	}
	else if (this.m_action.reuseGetParameter() === true) {
		this.addFormField("reuseResults", "paramInfo");
	}

	if(this.m_action.keepRAPCache() === false && this.m_viewerWidget) {
		// delete the rap cache
		this.m_viewerWidget.clearRAPCache();
	}
	
	if (this.m_action.reuseConversation() === true) {
		this.addFormField("cv.reuseConversation", "true");
	}
	
	if (this.m_action.isUndoable() && this.m_action.getUndoRedoQueue()) {
		this.m_action.getUndoRedoQueue().initUndoObj({"tooltip" : this.m_action.getUndoHint(), "saveSpec" : this.m_action.saveSpecForUndo()});
	}
	
	// So that we'll end up on the same tab
	if (this.getViewer().getCurrentlySelectedTab() && !this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")) {
		this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup", this.getViewer().getCurrentlySelectedTab());
	}
	
	this.getViewer().clearTabs();
};

ModifyReportDispatcherEntry.prototype.onComplete = function(asynchDATAResponse, arg1)
{
	if (this.getRequestHandler()) {
		this.getRequestHandler().onComplete(asynchDATAResponse);
	}
};

ModifyReportDispatcherEntry.prototype.onPrompting = function(response) {
	if (this.getRequestHandler()) {
		this.getRequestHandler().onPrompting(response);
	}
};

/**
 * Need to update the Viewer state with any information we might have gotten in the working response
 * @param {Object} asynchDATAResponse
 * @param {Object} arg1
 */
ModifyReportDispatcherEntry.prototype.onWorking = function(asynchDATAResponse, arg1)
{
	this.parent.onWorking.call(this, asynchDATAResponse, arg1);
	var responseState = asynchDATAResponse.getResponseState();
	if (this.getRequestHandler()) {
		this.getRequestHandler().updateViewerState(responseState);
	}	
};/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 
dojo.provide("ModalInfoMessageDialog");

dojo.declare("ModalInfoMessageDialog", null, {
	
	sMessage: "",
	sDescription: "",
	sTitle : "",
	
	constructor : function( args){
		dojo.safeMixin( this, args );
	},
	
	getMessage: function() {
		return this.sMessage;
	},
	
	getDescription: function() {
		return this.sDescription;
	},
	
	getTitle: function() {
		return this.sTitle;
	},

	show : function() {
		dojo["require"]("bux.dialogs.InformationDialog"); //@lazyload
		var infoDialog = new bux.dialogs.InformationDialog({
			title: this.getTitle(),
			sMainMessage : this.getMessage(),
			sDescription : this.getDescription(),
			sInfoIconClass : 'bux-informationDialog-info-icon'
		});
		infoDialog.show();
	}

});/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function CCognosViewerSaveReport( cognosViewer, payload )
{
	this.m_cognosViewer = cognosViewer;
	this.m_params = null;
	//chrome always send use the storeid of the dashboard to save report in so we know if it is save-as or save operation
	this.dashboardToSaveIn = payload.cm$storeID;
	this.m_doSaveAsOnFault = false;
}

/**
 * Can save if the user has write permission, creating a new dashboard or we're doing a saveAs (also creating a 'new' dashboard)
 * @param {Object} permission
 */
CCognosViewerSaveReport.prototype.canSave = function( permission )
{
	return ( this.doSaveAs() || permission && permission.indexOf( "write" ) !== -1  ) ;
};

CCognosViewerSaveReport.prototype.isSavedOutput = function()
{
	//do not save if report is a saved output
	var sAction = this.m_cognosViewer.envParams["ui.action"];
	return ( typeof sAction !== "undefined" && sAction === "view");
};

/**
 *
 */
CCognosViewerSaveReport.prototype.doSaveAs = function()
{
	//savedReportName is only set when report had been saved in the dashboard
	var result = ( this.m_doSaveAsOnFault || !this.m_cognosViewer.envParams["savedReportName"] || !this.isSameDashboard() ); 
	return result;
};

CCognosViewerSaveReport.prototype.isSameDashboard = function()
{
	var result = ( this.m_cognosViewer.envParams["ui.object"].indexOf( this.dashboardToSaveIn ) !== -1 );
	return result;
};

CCognosViewerSaveReport.prototype.getUIAction = function()
{
	return ( this.doSaveAs() ? "saveInDashboard" : "updateSavedReport");
};

CCognosViewerSaveReport.prototype.populateRequestParams = function(asynchRequest) {

	asynchRequest.addFormField('ui.action', this.getUIAction());
	asynchRequest.addFormField('cv.ignoreState', 'true');
	asynchRequest.addFormField("dashboard-id", this.dashboardToSaveIn);
	asynchRequest.addNonEmptyStringFormField("executionParameters", this.m_cognosViewer.m_sParameters);

	for(var param in this.m_cognosViewer.envParams)
	{
		if( param.indexOf("frag-") == 0 || param == "cv.actionState" ||
			param == "ui.primaryAction" || param == "dashboard" ||
			param == "ui.action" || param == "cv.responseFormat" ||
			param == "b_action") {
			continue;
		}

		asynchRequest.addFormField(param, this.m_cognosViewer.envParams[param]);
	}
};

CCognosViewerSaveReport.prototype.getCognosViewer = function()
{
	return this.m_cognosViewer;
};

CCognosViewerSaveReport.prototype.getViewerWidget = function()
{
	return this.getCognosViewer().getViewerWidget();
};


CCognosViewerSaveReport.prototype.dispatchRequest = function()
{
	var cognosViewer = this.m_cognosViewer;
	var viewerWidget = this.getViewerWidget();
	var callbacks = {
		"complete":{"object":viewerWidget,"method":viewerWidget.handleWidgetSaveDone},
		"fault":{"object":this,"method":this.onFault}
		};

	var asynchRequest = new AsynchJSONDispatcherEntry(cognosViewer);
	asynchRequest.setCallbacks(callbacks);

	this.populateRequestParams(asynchRequest);

	cognosViewer.dispatchRequest(asynchRequest);
};

CCognosViewerSaveReport.prototype.onFault = function(asynchJSONResponse, arg1){

	var cognosViewer = this.m_cognosViewer;
	var viewerWidget = this.getViewerWidget();

	var soapFaultEnvelope = asynchJSONResponse.getSoapFault();
	var soapFaultNode = XMLHelper_FindChildByTagName(soapFaultEnvelope, "Fault", true);
	
	if( this.ifIsEmptySelectionFault( soapFaultNode ) )
	{
		this.handleEmptySelectionFault();
		return;
	}

	// set retry to False - can't retry a save
	var retryNode = soapFaultEnvelope.createElement("allowRetry");
	retryNode.appendChild(soapFaultEnvelope.createTextNode("false"));
	soapFaultNode.appendChild(retryNode);

	var sSoapFault = XMLBuilderSerializeNode(soapFaultNode);

	cognosViewer.setSoapFault(sSoapFault);
	viewerWidget.handleFault();

	var saveDonePayload = {'status':false};
	viewerWidget.iContext.iEvents.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload );
};


/**
 * Returns true if the fault is caused by an attempt to update a non-existing report
 */
CCognosViewerSaveReport.prototype.ifIsEmptySelectionFault = function( soapFault ){
	if(soapFault) {
		var errorCodeElement = XMLHelper_FindChildByTagName(soapFault, 'errorCode', true);
		if( errorCodeElement )
		{
			var errorCode = XMLHelper_GetText(errorCodeElement, false);
			return ( errorCode === 'cmEmptySelection' );
		}
	}

	return false;
};

/**
 * Sends a save-as request
 */
CCognosViewerSaveReport.prototype.handleEmptySelectionFault = function(){
	
	delete (this.m_cognosViewer.envParams["savedReportName"]);
	this.m_doSaveAsOnFault = true;
	this.dispatchRequest();
};
/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */


SAVE_REPORT_TYPE = {
	reportView : 'application/x-ibmcognos_v5reportview+xml',
	report : 'application/x-ibmcognos_v5report+xml'
};


function ViewerIWidgetSave( viewerWidget, payload )
{
	this.m_ViewerWidget = viewerWidget;
	this.m_payload = payload;
	this._setIsSavedDashboard();

}

ViewerIWidgetSave.prototype.setDoCWCopy = function(value) {
	this._doCWCopy = value;
};

ViewerIWidgetSave.prototype._getSavedReport = function(){
	var sSavedReport = this._getWidgetAttributeValue('savedReportPath') ;
	if( !sSavedReport )
	{
		//for backwards compatibility
		sSavedReport = this._getWidgetAttributeValue( 'savedReportName');
	}
	return sSavedReport;
};

/**
 * Check if current dashboard is already saved
 */
ViewerIWidgetSave.prototype._setIsSavedDashboard = function()
{
	var sSavedReport = this._getSavedReport();
	this._bIsSavedDashboard = ( sSavedReport !== null && sSavedReport !== undefined && sSavedReport.length !== 0) ;	
	
};

ViewerIWidgetSave.prototype._isSavedDashboard = function(){
	return this._bIsSavedDashboard;
};

/**
 * Can save if the user has write permission, creating a new dashboard or we're doing a saveAs (also creating a 'new' dashboard)
 * @param {Object} permission
 */
ViewerIWidgetSave.prototype.canSave = function( permission )
{
	//user is allowed to save in dashboard if they are doing a save new or save-as without write permission
	return ( this._doSaveNewOrSaveAs() || permission && permission.indexOf( "write" ) !== -1 || this.m_ViewerWidget.isDropped()  ) ;
};

ViewerIWidgetSave.prototype.isSavedOutput = function()
{
	//do not save if report is a saved output
	var sAction = this.m_cognosViewer.envParams["ui.action"];
	return ( typeof sAction !== "undefined" && sAction === "view");
};

ViewerIWidgetSave.prototype._doSaveNewOrSaveAs = function(){
	var result = ( this.m_payload.operation === 'save' && !this._isSavedDashboard() ) || ( this.m_payload.operation === 'saveAs');
	return result;
};


ViewerIWidgetSave.prototype._getWidgetAttributeValue = function( attribName ){
	return this._getViewerWidget().getAttributeValue( attribName );
};

ViewerIWidgetSave.prototype._getEnvParam = function( paramName ){
	return this._getViewerWidget().getEnvParam( paramName );
};


ViewerIWidgetSave.prototype._getViewerWidget = function(){
	return this.m_ViewerWidget;
};

ViewerIWidgetSave.prototype._isLimitedInteractiveMode = function(){
	return this._getViewerWidget().isLimitedInteractiveMode();
};

ViewerIWidgetSave.prototype._getDefaultReportName = function(){
	return this._getEnvParam( 'ui.name');
};

ViewerIWidgetSave.prototype._getReportSpec = function(){
	return this._getEnvParam( 'ui.spec');
};

ViewerIWidgetSave.prototype._getCurrentReportIsReportView = function(){
	return ( this._getEnvParam( 'ui.objectClass') === 'reportView' );
};

ViewerIWidgetSave.prototype.doGetSavePropertiesFromServer = function(){
	this.delayedLoadingContext = this._getViewerWidget().getLoadManager().getDelayedLoadingContext();

	if (this._getEnvParam( 'delayedLoadingExecutionParams')) {
		return true;
	}
	
	return ( this.delayedLoadingContext && this.delayedLoadingContext.getPromptValues() !== null  );
};

/**
 * This function gets the information that is needed from the server in order to do the save.
 * Currently, it sends the execution parameters to the server to get it in the proper syntax
 * to be saved in CM.
 */
ViewerIWidgetSave.prototype.getSavePropertiesFromServer = function(){
	var oCV = this._getViewerWidget().getViewerObject();
	var serverRequest = new JSONDispatcherEntry( oCV );
	var widget = this._getViewerWidget();
	
	//set the callback function
	serverRequest.setCallbacks({
		customArguments: [ this.m_payload ],
		complete: {"object": widget, "method": widget.handleGetSavePropertiesFromServerResponse }
	});
	
	this._addRequestOptions(serverRequest);
	serverRequest.sendRequest();
};

ViewerIWidgetSave.prototype._addRequestOptions = function(serverRequest)
{
	serverRequest.addFormField("ui.action", "noOp" );
	serverRequest.addFormField("bux", "true");
	serverRequest.addFormField("cv.responseFormat", "IWidgetSavePropertiesJSON");
	
	// delayedLoadingExecutionParams contains the saved prompt values that was obtained on the initial load of viewer widget but 
	// before the report is ran (which means no ui.conversation). This needs to be sent to the server so the saved prompt values can be merged with
	// any new prompt values that is stored in the delayedLoadingContext before being saved.  Otherwise, only global prompt values are save and
	// caused the report to prompt next time, the tab is made visible.
	if( this._getEnvParam( 'delayedLoadingExecutionParams') ){
		serverRequest.addFormField("delayedLoadingExecutionParams", this._getEnvParam('delayedLoadingExecutionParams') );
	} 
	else
	{
		// if there is no delayedLoadingExecutionParams, it means that the report had ran and there is conversation and it
		// should be sent to the server so that the prompt values contained in it will be merged with the ones in delayedLoadingContext.
		serverRequest.addFormField("ui.conversation",  this._getViewerWidget().getViewerObject().getConversation() );
	}

	var promptValues = this.delayedLoadingContext.getPromptValues();
	for( var promptValue in promptValues ){
		serverRequest.addFormField( promptValue, promptValues[promptValue] )
	}
};

ViewerIWidgetSave.prototype._getExecutionParameters = function(){

	return this._getViewerWidget().getViewerObject().getExecutionParameters();
};

ViewerIWidgetSave.prototype._setExecutionParameters = function( body ) 
{
	var sParameters = this._getExecutionParameters();
	var doc = XMLBuilderLoadXMLFromString( sParameters );
	
	if( !doc.documentElement )
	{
		return;
	}
	var root = XMLBuilderCreateXMLDocument ( 'root');
	var eParameters = root.createElement( 'parameters' );
	XMLBuilderSetAttributeNodeNS(eParameters, "xmlns:SOAP-ENC", "http://schemas.xmlsoap.org/soap/encoding/");
	XMLBuilderSetAttributeNodeNS(eParameters, "xsi:type", "bus:parameterValueArrayProp", "http://www.w3.org/2001/XMLSchema-instance" );
	XMLBuilderSetAttributeNodeNS(eParameters, "xmlns:bus", "http://developer.cognos.com/schemas/bibus/3/" );
	XMLBuilderSetAttributeNodeNS(eParameters, "xmlns:xs", "http://www.w3.org/2001/XMLSchema" );
	
	root.documentElement.appendChild(eParameters);
	
	var allItems = XMLHelper_FindChildrenByTagName(doc.documentElement, 'item', false);
	
	var eValue = root.createElement("value");
	XMLBuilderSetAttributeNodeNS(eValue, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
	
	eParameters.appendChild( eValue );

	var iNumberOfParms = allItems.length;
	for (var i = 0; i < allItems.length; i++)	{
		var eName = XMLHelper_FindChildByTagName(allItems[i], 'name', false);
		if( eName && eName.childNodes[0].nodeValue.indexOf( 'credential:') !== -1 ){
			iNumberOfParms--;
			continue;
		}
		eValue.appendChild( allItems[i] );
	}
	
	XMLBuilderSetAttributeNodeNS(eValue, "SOAP-ENC:arrayType", "bus:parameterValue[" + iNumberOfParms + "]", "http://schemas.xmlsoap.org/soap/encoding/");
	body.parameters = XMLBuilderSerializeNode( eParameters );	
};

/**
 * Sets the source report to be copied or base report for the report view
 */
ViewerIWidgetSave.prototype._setSourceObject = function(resource, bUseCurrentReport) {

	var sOriginalReportValue = (bUseCurrentReport === true)  
									? this._getEnvParam('ui.object') 
									: this._getEnvParam('originalReport');	
	
	if (sOriginalReportValue) {
		resource.sourceObject = sOriginalReportValue;
	}
};

ViewerIWidgetSave.prototype._setReportTypeToReportView = function(resource) {
	resource.type = SAVE_REPORT_TYPE.reportView;
};

ViewerIWidgetSave.prototype._setReportTypeToReport = function(resource) {
	resource.type = SAVE_REPORT_TYPE.report;
};

ViewerIWidgetSave.prototype._setReportSpec = function( body ) {
	body.specification = this._getReportSpec();
};

ViewerIWidgetSave.prototype._setResourceForSave = function(resource){

	if( !this._getCurrentReportIsReportView() && !this._isLimitedInteractiveMode() ){
		this._setReportSpec( resource.body );
		this._setReportTypeToReport(resource);
	}
	return resource;
};

ViewerIWidgetSave.prototype._setResourceForCopy = function(resource){
	this._setReportSpec( resource.body );
	this._setReportTypeToReport(resource);
	return resource;
};

ViewerIWidgetSave.prototype._setResourceForSaveNew = function(resource){
	var bUseCurrentReport = false;
	
	if (this._getEnvParam('originalReport') == null) {
		//this is a special case for copy/pasted ci published widget
		// when originalReport is null we use ui.object env. variable to set SourceObject
		bUseCurrentReport = true;
	}

	this._setSourceObject( resource, bUseCurrentReport );
	
	if( this._isLimitedInteractiveMode() )
	{
		this._setReportTypeToReportView( resource );
	}else
	{
		this._setReportTypeToReport( resource );
		this._setReportSpec(resource.body );
		
	}
	return resource;
};

ViewerIWidgetSave.prototype._setResourceForSaveAs = function( resource ){

	if( this._getCurrentReportIsReportView() )
	{
		this._setReportTypeToReportView( resource );
		this._setSourceObject( resource );
	} 
	else if( this._isLimitedInteractiveMode() )
	{
		this._setReportTypeToReportView( resource );
		this._setSourceObject( resource, true /*bUseCurrentReport*/ );
	}
	else
	{
		this._setReportTypeToReport( resource );
		this._setSourceObject( resource, true /*bUseCurrentReport*/ );
		this._setReportSpec( resource.body );
	}
	return resource;
};


ViewerIWidgetSave.prototype._getResource = function(){	
	var resource = {};
	
	if (this._doCWCopy === true) {
		resource.copyOnCreate = true;
	}
	
	resource.body = {};
	
	var bDoSave = (this.m_payload.operation === 'save');
	var bIsCopy = (this.m_payload.operation === 'copy');
	
	if ( bIsCopy )
	{
		this._setResourceForCopy( resource );
	}
	else if( bDoSave)
	{
		this._setResourceForSave( resource );
	}
	else
	{			
		if( this._isSavedDashboard() )
		{
			this._setResourceForSaveAs(resource);
		}
		else
		{
			this._setResourceForSaveNew(resource);
		}
	}


	
	this._setExecutionParameters( resource.body );
	if (!bIsCopy){
		// list of itemSets for chrome to update after a save
		resource.itemSetUpdate = { name: 'savedReportPath',
								   type: 'searchPath' };
	}
	return resource;
};

ViewerIWidgetSave.prototype._getWidgetId = function(){
	return this._getViewerWidget().getWidgetId();
};

/**
 *  payload = {
 *  			widgetId : <widget id>,
 *  			resource : [
 *   					 	{ 
 *   						  type			: <report or report view>
 *   						  sourceObject	: <source report to be cloned or saved as report view>
 *  						  body			: { <list of cm properties to be updated> }
 *  						  itemSetUpdate	: { <list of itemsets to be updated by BUX after a successful save }
 *  					    }
 *  					  ]
 * 			  }
 * 
 *  body = { 
 *  		specification 	: <optional - report spec if saving report>,
 *  		parameters 		: <execution parameters>
 *  	   }
 *  
 *  itemSetUpdate = { 
 *  					name : 'savedReportPath',
 *  					type : 'searchPath'
 *  				}
 */
ViewerIWidgetSave.prototype.getPayload = function(){
	var payload = {};
	payload.resource = new Array();
	payload.widgetId = this._getWidgetId();
	payload.resource.push( this._getResource() );
	return payload;
};




/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

dojo.provide("viewer.dialogs.SelectBusinessProcess");

dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");

dojo.declare( 'viewer.dialogs.SelectBusinessProcess', bux.dialogs.BaseCustomContentDialog, {

	sTitle : null,
	sLabel : null,
	okHandler : null, /* function */
	cancelHanlder : null, /* function */
	buildRendering : function() {
		this.aButtonsSpec = [
								{label: RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_START_BUTTON_LABEL, action: dojo.hitch(this, this.onOK), type: "button"},
								{label: RV_RES.CANCEL, action: dojo.hitch(this, this.onCancel), type: "button"}
							];
		this.inherited( arguments );
		if( !this.BPMProcessesInfo || this.BPMProcessesInfo.length === 0 ){
			//Disable the start button
			this._buxBaseDialog._aButtonObjects[0].set( 'disabled',true );
		}
	},

	startup : function() {
		this.updateTitle( this.sTitle );
		this.inherited( arguments );
		this.set( 'role', 'group');

		var tableContainer = new bux.layout.TableContainer({
			classname: "bux-InformationDialog buxFilterConfigDiscreteValuesTable"},
			this.contentContainer );

		var row = new bux.layout.TableContainerRow({
			classname : "bux-dialog-label",
			parentContainer : tableContainer
		});

		var cell = new bux.layout.TableContainerCell({
			parentContainer : row
		});

		this.generateSelectProcessSection( cell );
		cell.addContent( document.createElement( 'br' ) );

		this.generateViewInputValuesSection( cell );
		cell.addContent( document.createElement( 'br' ) );
	},

	addDivContainer : function( oParentContainer, sID, sRole ) {
		var div = document.createElement( 'div');
		dojo.attr( div, { 'class' : 'buxFilterConfigFilterValue',
						'aria-labelledby' : sID,
						role : sRole
			});
		oParentContainer.addContent( div );
		return div;
	},

	generateSelectProcessSection : function( oParentContainer ) {

		var sA11yId = this.id + '_selectProcess_a11ylabel';
		this.addTableDescription(oParentContainer, this.sLabel, sA11yId);
		var div = this.addDivContainer( oParentContainer, sA11yId, 'radiogroup' );

		var tableContainer = new bux.layout.TableContainer({
			classname: 'buxFilterConfigFilterValueTable'
		} );
		dojo.style( tableContainer.domNode, 'width', '325px' );

		this.addSelectProcessTableHeader( tableContainer );
		if( !this.BPMProcessesInfo || this.BPMProcessesInfo.length === 0) {
			this.addEmptySelectProcessTableContent( tableContainer );
		}else{
			this.addSelectProcessTableContent(tableContainer);
		}

		div.appendChild( tableContainer.domNode );
	},

	addSelectProcessTableHeader : function( tableContainer ) {

		var table_header_row = new bux.layout.TableContainerRow({
			classname : "buxFilterConfigFilterValueTableHeaderRow",
			parentContainer : tableContainer
		});

		var table_header_cell_1 = new bux.layout.TableContainerCell({
			classname : "buxListHeader buxFilterConfigFilterValueTableHeaderLeft",
			width : '25px',
			parentContainer : table_header_row
		});

		var table_header_cell_2 = new bux.layout.TableContainerCell({
			classname : "buxListHeader buxFilterConfigFilterValueTableHeader",
			width : '300px',
			parentContainer : table_header_row
		});
		table_header_cell_2.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_TABLE_HEADER));
	},

	/**
	 * Displays "None" in the table when no process is available to user
	 */
	addEmptySelectProcessTableContent: function( tableContainer ) {
		var sA11yLabelId = this.id + '_processItemsRow_label_none';
		var row_process = new bux.layout.TableContainerRow({
			parentContainer : tableContainer
		});
		dojo.attr( row_process.domNode, { id : this.id + '_processItemsRow_none',
								'aria-labelledby' : sA11yLabelId,
								tabindex : 0
		});

		var a11yLabel = this.createA11yLabel(RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_NO_PROCESS_A11Y, sA11yLabelId, true /*hidden*/);
		row_process.domNode.appendChild( a11yLabel );

		var cell = new bux.layout.TableContainerCell({
			parentContainer : row_process
		});
		cell.set( 'colspan', 2 );
		cell.addContent( this.createLabelElement( RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_NO_PROCESS) );
	},

	addSelectProcessTableContent : function( tableContainer ) {
		for( var i=0 ; i < this.BPMProcessesInfo.length; i++) {

			var radioButtonObj = new dijit.form.RadioButton({
				checked: (( i === 0 ) ? true : false),// check the first item by default
				name : this.id + '_processItem',
				disabled: false
			});

			var sCaption = html_encode( this.BPMProcessesInfo[i].sCaption );

			var sBPD_ID = this.BPMProcessesInfo[i].sBPD_ID;
			var sProcessAppID = this.BPMProcessesInfo[i].sProcessAppID;
			radioButtonObj.onChange = dojo.hitch( this, 'getProcessItemRadioChangeFunction', sBPD_ID, sProcessAppID, sCaption, radioButtonObj );

			var row_process = new bux.layout.TableContainerRow({
				parentContainer : tableContainer,
				classname : ((i === 0 ) ? 'buxFilterConfigFilterValueRowSelected' : '')
			});
			row_process.set( 'id', this.id + '_processItemsRow' + radioButtonObj.id );

			var cell_radio = new bux.layout.TableContainerCell({
				align : 'center',
				parentContainer : row_process
			});
			cell_radio.addContent( radioButtonObj.domNode );
			cell_radio.set( 'id', this.id + '_processItemsCell' + i );

			var cell_process = new bux.layout.TableContainerCell({
				classname : 'buxFilterConfigFilterItemName text_overflow_ellipsis_ie',
				width : '300px',
				valign : 'top',
				parentContainer : row_process
			});

			var _label = document.createElement("label");
			_label.appendChild(document.createTextNode( sCaption ));
			_label.setAttribute("for", radioButtonObj.id);

			cell_process.addContent(_label);

		}

		this.setDefaultProcessSelectedInfo();

	},

	setDefaultProcessSelectedInfo : function(){
		this._selectedBPD_ID = this.BPMProcessesInfo[0].sBPD_ID;
		this._selectedProcessAppId = this.BPMProcessesInfo[0].sProcessAppID;
		this._selectedProcessName = html_encode( this.BPMProcessesInfo[0].sCaption );
	},

	getProcessItemRadioChangeFunction : function( sBPD_ID, sProcessAppId, sProcessName, radio) {
		if( radio.get( 'value') === 'on') {
			dojo.byId(this.id + '_processItemsRow' + radio.id).className = 'buxFilterConfigFilterValueRowSelected';
			this._selectedBPD_ID = sBPD_ID;
			this._selectedProcessAppId = sProcessAppId;
			this._selectedProcessName = sProcessName;
		} else {
			dojo.byId(this.id + '_processItemsRow' + radio.id).className = '';
		}
	},

	generateViewInputValuesSection : function( oParentContainer ) {
		var sContainerAllyId = this.id + '_viewInputValues_a11ylabel';
		this.addTableDescription( oParentContainer, RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_DESCRIPTION, sContainerAllyId);
		this.addViewInputValuesTable( oParentContainer, sContainerAllyId );
	},

	addViewInputValuesTable : function( oParentContainer, sContainerAllyId ) {
		oParentContainer.addContent( this.generateViewInputValuesTable( sContainerAllyId) );
	},

	addTableDescription : function( oParentContainer, sDescription, sID ) {
		var div = document.createElement( 'div');
		dojo.attr( div, { 'class' : 'bux-label',
						id : sID
			});
		div.appendChild( document.createTextNode(html_encode( sDescription ) ) );
		oParentContainer.addContent( div );
	},

	/**
	 * Returns div that contains the table
	 */
	generateViewInputValuesTable : function(sContainerAllyId) {
		var oInputParameters = this.bpAction.getInputParameter();

		var div = document.createElement( 'div');
		dojo.attr(div, { 'class' : 'buxFilterConfigFilterValue',
						style : 'height:80px',
						role  : 'group',
						'aria-labelledby': sContainerAllyId
		});

		var tableContainer = new bux.layout.TableContainer({
			classname: 'buxFilterConfigFilterValueTable'
		} );
		dojo.style( tableContainer.domNode, 'width', '335px' );
		tableContainer.set( 'role', 'list');

		div.appendChild( tableContainer.domNode );

		var table_header_row = new bux.layout.TableContainerRow({
			classname : "buxFilterConfigFilterValueTableHeaderRow",
			parentContainer : tableContainer
		});

		var table_header_cell_1 = new bux.layout.TableContainerCell({
			classname : "buxListHeader buxFilterConfigFilterValueTableHeaderLeft",
			width : '40%',
			parentContainer : table_header_row
		});
		table_header_cell_1.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DATA_ITEM));

		var table_header_cell_2 = new bux.layout.TableContainerCell({
			classname : "buxListHeader buxFilterConfigFilterValueTableHeader",
			width : '60%',
			parentContainer : table_header_row
		});
		table_header_cell_2.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DISPLAY_VALUE_HEADER));

		var cognosParm = oInputParameters.cognosParameter;
		var bAlreadySetDefaultFocus = false;
		for( var i=0 ; i < cognosParm.length; i++) {

			var rowIndex = 0;
			var widgetContextValues = this.getWidgetContextValues(cognosParm[i]);
			for( var dataItem in widgetContextValues ) {

				var row = new bux.layout.TableContainerRow({
					parentContainer : tableContainer
				});

				var rowAttributes = { id : this.id + '_inputValueRow_' + rowIndex,
									role : 'listitem' };

				//set focus on first row only
				if( !bAlreadySetDefaultFocus ){
					rowAttributes.tabindex = 0;
					bAlreadySetDefaultFocus = true;
				}

				dojo.attr( row.domNode, rowAttributes);

				this.addRowAccessibility(row, rowIndex, dataItem, widgetContextValues[dataItem]);

				//data item
				var dataItemCell = new bux.layout.TableContainerCell({
					classname : 'buxFilterConfigFilterItemName text_overflow_ellipsis_ie',
					width : '40%',
					valign : 'top',
					parentContainer : row
				});

				dataItemCell.set( 'id', this.id + '_dataItem_' + i );

				dataItemCell.addContent( this.createLabelElement( dataItem ) );

				//display value
				var displayValueCell = new bux.layout.TableContainerCell({
					classname : 'buxFilterConfigFilterItemName text_overflow_ellipsis_ie',
					width : '60%',
					valign : 'top',
					parentContainer : row
				});
				displayValueCell.set( 'id', this.id + '_displayValue_' + i );
				displayValueCell.addContent( this.createLabelElement( widgetContextValues[dataItem][0] ) );

				rowIndex++;
			}
		}
		return div;
	},

	getWidgetContextValues : function( widgetContext ){
		return values = widgetContext['com.ibm.widget.context'].values;
	},

	addRowAccessibility : function( row, rowIndex, sDataItem, sDataValue ) {
		// add aria-labelledby label
		var sA11yLabelId = this.id + '_inputValueRow_label_' + rowIndex;
		dojo.attr( row.domNode, { 'aria-labelledby' : sA11yLabelId } );

		var sA11yLabel = RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DATA_ITEM + ' ' + sDataItem + ' ' +
						RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_A11Y_DESC_VALUE + ' ' + sDataValue;
		row.domNode.appendChild( this.createA11yLabel( sA11yLabel, sA11yLabelId, true /*hidden*/ ) );

		//add keyboard navigation
		dojo.connect( row.domNode, "onkeypress", dojo.hitch( this, this._rowOnKeyPress));
	},

	_rowOnKeyPress : function( evt ) {
		switch( evt.keyCode ) {
			case dojo.keys.DOWN_ARROW :
				this.changeNodeFocus( evt, evt.target, evt.target.nextSibling );
				break;
			case dojo.keys.UP_ARROW :
				this.changeNodeFocus( evt, evt.target, evt.target.previousSibling );
				break;
		}
	},

	changeNodeFocus : function( evt, currentNode, targetNode) {
		if( !targetNode || ( targetNode && targetNode.id && targetNode.id.indexOf( '_inputValueRow_' ) === -1 ) ){
			return;
		}

		dojo.attr( currentNode, {tabindex : -1 } );
		dojo.attr( targetNode, { tabindex : 0 } );
		dijit.focus( targetNode );

		if (dojo.isIE || dojo.isTrident) {
			evt.keyCode = 0;
		}
		dojo.stopEvent(evt);
	},

	createA11yLabel : function( sLabelText, sLabelId, hidden ) {
		var _eSpan = this.createLabelElement( sLabelText );
		var attribs = { id :sLabelId };
		if( hidden ){attribs.style = 'visibility:hidden;display:none';}
		dojo.attr( _eSpan, attribs);
		return _eSpan;
	},

	createLabelElement : function( sLabelText ) {
		var _eSpan = document.createElement("span");
		_eSpan.appendChild(document.createTextNode( html_encode( sLabelText ) ));
		return _eSpan;
	},

	onOK : function() {
		this.hide();
		this.bpAction.startProcess( this._selectedBPD_ID, this._selectedProcessAppId, this._selectedProcessName );
	}

});