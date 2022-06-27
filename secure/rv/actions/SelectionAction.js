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
};