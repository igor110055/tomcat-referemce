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
