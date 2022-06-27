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

