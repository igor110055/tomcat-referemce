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
