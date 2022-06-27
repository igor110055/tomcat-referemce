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
