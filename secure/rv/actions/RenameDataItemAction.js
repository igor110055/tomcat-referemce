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
