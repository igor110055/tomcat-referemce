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
 * Control all pin and freeze headings in a report.
 */
function PinFreezeManager(oCV) {
	this.m_oCV=oCV;
	this.m_viewerId=oCV.getId();
	
	this.m_frozenInfo = null;
	
	this.m_lastWidthProcessed=0;
	this.m_lastHeightProcessed=0;
	this.c_resizeTweekLimit=5;		//Resizes smaller than this threshold will not be processed.
	this.m_repaintOnVisible=false;	//If a canvas resize (or zoom) event happens, repaint the widget if it becomes visible.
}

/**
 * Add a new container object to the frozen container list.
 * If the list does not exist (no frozen containers), create the list.
 */
PinFreezeManager.prototype.addContainerObject = function(lid, freezeTop, freezeSide, containerNode, index) {
	if (freezeTop || freezeSide) {
		if (!this.m_frozenInfo) {
			this.m_frozenInfo = {};
		}

		// Each lid can have multiple containers associated to it (report with sections for example)
		if (!this.m_frozenInfo[lid]) {
			this._createDefaultFrozenInfo(lid);
		}
		
		this.m_frozenInfo[lid].freezeTop = freezeTop;
		this.m_frozenInfo[lid].freezeSide = freezeSide;
		
		
		var oNewPinFreezeContainer = this.newContainer(lid, freezeTop, freezeSide, containerNode, index);
		this.m_frozenInfo[lid].pinFreezeContainers.push(oNewPinFreezeContainer);
		return oNewPinFreezeContainer;
	}
	return null;
};

/**
 * Wrapper function used to jsunit tests
 */
PinFreezeManager.prototype.newContainer = function(lid, freezeTop, freezeSide, containerNode, index) {
	return new PinFreezeContainer(this, lid, this.m_viewerId, freezeTop, freezeSide, containerNode, index);
};

PinFreezeManager.prototype.clearPinInfo = function(lid) {
	if (!this.m_frozenInfo) {
		return;
	}
	
	if (lid) {
		if (this.m_frozenInfo[lid]) {
			delete this.m_frozenInfo[lid];
		}
	}
	else {
		delete this.m_frozenInfo;
		this.m_frozenInfo = null;
	}
};

PinFreezeManager.prototype._createDefaultFrozenInfo = function(lid) {
	this.m_frozenInfo[lid] = {
		"lid" : lid,
		"freezeTop" : false,
		"freezeSide" : false,
		"pinFreezeContainers" : [],
		"childContainers" : {}
	};	
};

PinFreezeManager.prototype._resetFrozenInfo = function(lid) {
	var frozenInfo = this.m_frozenInfo[lid];
	if (frozenInfo) {
		delete frozenInfo.pinFreezeContainers;
		frozenInfo.pinFreezeContainers = [];
		frozenInfo.freezeTop = false;
		frozenInfo.freezeSide = false;
	}
};

/**
 * Find all the LIDs on the current page and add their information to the frozenInfo object. Also
 * keep track of a list of child LIDs in the case that we have nested containers
 */
PinFreezeManager.prototype.prepopulateFrozenInfo = function(oReportDiv) {
	var containerNodes = getDescendantElementsByAttribute(oReportDiv, "table", "lid", "", false, -1, new RegExp("[\\s\\S]*"));
	if (containerNodes) {
		if (!this.m_frozenInfo) {
			this.m_frozenInfo = {};
		}
		
		for (var i=0; i < containerNodes.length; i++) {
			var containerNode = containerNodes[i];
			
			// The top parent table can't be frozen, so skip it
			if (containerNode.getAttribute("id") == "rt" + this.m_viewerId) {
				continue;
			}
			
			var lid = this.removeNamespace(containerNode.getAttribute("lid"));
			
			if (this.m_frozenInfo[lid] && this.m_frozenInfo[lid].childContainers) {
				continue;
			}
			
			if (!this.m_frozenInfo[lid]) {
				this._createDefaultFrozenInfo(lid);
			}
			
			if (!this.m_frozenInfo[lid].childContainers) {
				this.m_frozenInfo[lid].childContainers = {};
			}

			// We need to know the ID's of child containers to we can refreeze them when the parent is unfrozen/frozen
			var nestedChildContainers = getDescendantElementsByAttribute(containerNode, "table", "lid", "", false, -1, new RegExp("[\\s\\S]*"));
			if (nestedChildContainers) {
				for (var childIndex=0; childIndex < nestedChildContainers.length; childIndex++) {
					var childNode = nestedChildContainers[childIndex];
					var childLID =  this.removeNamespace(childNode.getAttribute("lid"));
					
					if (!this.m_frozenInfo[lid].childContainers[childLID]) {
						// We only want direct descendant containers in this list.
						var parentNode = childNode.parentNode;
						while (parentNode && !parentNode.getAttribute("lid")) {
							parentNode = parentNode.parentNode;
						}
						
						if (parentNode && this.removeNamespace(parentNode.getAttribute("lid")) == lid) {
							this.m_frozenInfo[lid].childContainers[childLID] = true;
						}
					}
				}
			}
		}

		this._updateParentContainerInfo();
	}
};

/**
 * Now that we have the child containers, update the containers with parent info
 */
PinFreezeManager.prototype._updateParentContainerInfo = function() {
	
	// update the parentInfo
	for (var containerLID in this.m_frozenInfo) {
		var childContainers = this.m_frozenInfo[containerLID].childContainers;
		if (childContainers) {
			for (var childLID in childContainers) {
				if (this.m_frozenInfo[childLID]) {					
					this.m_frozenInfo[childLID].parentContainer = containerLID;
					break;
				}
			}
		}
	}	
};

PinFreezeManager.prototype.getTopLevelContainerLID = function(lid) {
	if (this.m_frozenInfo[lid]) {
		while (this.m_frozenInfo[lid].parentContainer) {
			lid = this.m_frozenInfo[lid].parentContainer;
		}
	}
	
	return lid;
};

/**
 * Freeze the container having layoutID lid as specified by the booleans to freeze top/side or both.
 */
PinFreezeManager.prototype.freezeContainer=function(lid, freezeTop, freezeSide) {
	var oReportDiv = document.getElementById("CVReport" + this.m_viewerId);
	
	this.prepopulateFrozenInfo(oReportDiv);
	
	var topLevelLID = this.getTopLevelContainerLID(lid);
	
	this.unfreezeAllNestedContainers(topLevelLID, oReportDiv);
	
	this.m_frozenInfo[lid].freezeTop = freezeTop;
	this.m_frozenInfo[lid].freezeSide = freezeSide;
	
	var oNewPinFreezeContainer = this._createPinAndFreezeObject(oReportDiv, topLevelLID);
	
	this.m_lastWidthProcessed=0;
	this.m_lastHeightProcessed=0;

	this._resizePinFreezeObjects(oNewPinFreezeContainer);

	this.sectionStructureChange();

	// force IE to repaint the div or the the RVContent div won't resize
	if (isIE()) {
		
		// When in IE we sometimes have 'left over' crosstabs. Call refresh in a setTimeout
		// so that we resynch our scrollbars correctly once the Pin & Freeze is done.
		var obj = this;
		setTimeout(function() {obj.refresh(); }, 1);
		
		var oRVContent = document.getElementById("RVContent" + this.m_viewerId);
		this.m_oCV.repaintDiv(oRVContent);
	}
	
	return oNewPinFreezeContainer;
};

/**
 * When not frozen (or freeze is changed), a widget may be extremely wide or tall because when the widget is rendered, it is fit to data contents.
 * To handle this case, when a user freezes the container (or changes how its frozen), we pick a "threshold" size for the content so that resize to
 * fit content will easily resize into the bounds of the document window. Afterward, a user may resize larger.
 */
PinFreezeManager.prototype.getInitialWidthThreshold=function() {
	return document.body.clientWidth * 3 / 4;
};

PinFreezeManager.prototype.getInitialHeightThreshold=function() {
	return document.body.clientWidth * 9 / 10;
};

/**
 * Return true if there are any frozen containers.
 */
PinFreezeManager.prototype.hasFrozenContainers = function() {
	return ((this.m_frozenInfo) ? true : false );
};

/**
 * return true if row headings are frozen in the passed lid
 */
PinFreezeManager.prototype.hasFrozenRowHeadings = function(lid) {
	if (this.m_frozenInfo && this.m_frozenInfo[lid]) {
	 	return this.m_frozenInfo[lid].freezeSide ? this.m_frozenInfo[lid].freezeSide : false;
	}
	return false;
};

/**
 * return true if row headings are frozen in the passed lid
 */
PinFreezeManager.prototype.hasFrozenColumnHeadings = function(lid) {
	if (this.m_frozenInfo && this.m_frozenInfo[lid]) {
	 	return this.m_frozenInfo[lid].freezeTop ? this.m_frozenInfo[lid].freezeTop : false;
	}
	return false;
};

/**
 * If this string is marked with a namespace, remove it.
 * If not, return the string.
 */
PinFreezeManager.prototype.removeNamespace = function(idNS) {
	if (idNS.length > this.m_viewerId.length) {
		if (idNS.indexOf(this.m_viewerId) > 0) {
			return idNS.substring(0, idNS.indexOf(this.m_viewerId));
		}
	}
	return idNS;	//The string does not have a namespace.
};

/**
 * Return the PinFreezeContainer JS Object with the specified lid.
 */
PinFreezeManager.prototype.getContainer = function(lid, index) {
	if (this.m_frozenInfo && this.m_frozenInfo[lid] && this.m_frozenInfo[lid].pinFreezeContainers[0]) {
		index = index ? index : 0;
		return this.m_frozenInfo[lid].pinFreezeContainers[index];
	}
	return null;
};

/**
 * Return the PinFreezeContainer which contains the given node.
 */
PinFreezeManager.prototype.nodeToContainer = function(node) {
	var slid = PinFreezeContainer.nodeToSlid(node);
	var container = null;
	if(slid) {
		var lid = this.removeNamespace(PinFreezeContainer.getLidFromSlid(slid));
		container = this.getContainer(lid);
	}
	return container;
};

/**
 * get the container element associated with the lid of the passed in layoutElement.
 * ie: The container that contains this layout element as its base container.
 */
PinFreezeManager.prototype.getContainerElement = function(layoutElement) {
	var lid=this.removeNamespace(layoutElement.getAttribute("lid"));
	if (lid) {
		var container = this.getContainer(lid);
		if(container) {
			return container.getContainer();
		}
	}
	return null;	//The container isn't frozen.
};

/**
 * Given an lid, will create pin and freeze objects for it and any child containers
 */
PinFreezeManager.prototype._createPinAndFreezeObject = function(oReportDiv, lid) {
	var oNewPinFreezeContainer = null;
	if (this.m_frozenInfo) {
		var frozenInfo = this.m_frozenInfo[lid];
		
		// The only time we need to keep the old sizes is on the first load when we open a saved workspace.
		var initialLoad = frozenInfo.initialLoad;
		if (initialLoad) {
			delete frozenInfo.initialLoad;
		}
		
		var freezeTop = frozenInfo.freezeTop;
		var freezeSide = frozenInfo.freezeSide;
		
		var oldContainers = null;
		if (initialLoad && frozenInfo.pinFreezeContainers && (freezeTop || freezeSide)) {
			// Need to keep track of the frozen info
			oldContainers = frozenInfo.pinFreezeContainers.slice(0);
		}		
		
		
		var mainParentNode = oReportDiv;
		// If we have nested containers, make sure we don't search through the 'cloned' parent nodes if the 
		// parent is also frozen
		if (frozenInfo && frozenInfo.parentContainer) {
			var parentNodes = getElementsByAttribute(oReportDiv, "table", "lid", frozenInfo.parentContainer + this.m_viewerId);
			if (parentNodes) {
				for (parentIndex=0; parentIndex < parentNodes.length; parentIndex++) {
					if (!parentNodes[parentIndex].getAttribute("clonednode")) {
						mainParentNode = parentNodes[parentIndex];
						break;
					}
				}
			}
		}		
		
		if (frozenInfo.childContainers) {
			for (var childLID in frozenInfo.childContainers) {
				var pinFreezeObject = this._createPinAndFreezeObject(mainParentNode, childLID);
				oNewPinFreezeContainer = oNewPinFreezeContainer ? oNewPinFreezeContainer : pinFreezeObject;
			}
		}
		
		var containerNodes = getElementsByAttribute(mainParentNode, "table", "lid", lid + this.m_viewerId);
		if (containerNodes && containerNodes.length > 0) {
			delete frozenInfo.pinFreezeContainers;
			frozenInfo.pinFreezeContainers = [];			
		}
		else {
			// The container isn't on the current page
			return null;
		}
		
		if (containerNodes && (freezeTop || freezeSide)) {
			var frozenChild = (oNewPinFreezeContainer !== null);

			for (var i=0; i < containerNodes.length; i++) {
				var containerNode = containerNodes[i];
				
				if (containerNode.getAttribute("clonednode") == "true") {
					continue;
				}				
							
				oNewPinFreezeContainer = this.addContainerObject(lid, freezeTop, freezeSide, containerNode, i);
				
				if (oNewPinFreezeContainer) {
					oNewPinFreezeContainer.createPFContainer(mainParentNode, frozenChild);
	
					if (initialLoad) {
						oNewPinFreezeContainer.copyProperties(oldContainers[0]);
					}

					oNewPinFreezeContainer.freezeContainerInReport(oReportDiv);
				}			
			}
		}
	}
	
	return oNewPinFreezeContainer;
};

/**
 * Given a report dom, render the report with the containers frozen
 * as specified by the pinFreezeContainers list.
 */
PinFreezeManager.prototype.renderReportWithFrozenContainers = function(oReportDiv) {
	if (this.m_frozenInfo) {
		var initialLoad = false;
		var oNewPinFreezeContainer = null;
		for (var pinFreezeContainerID in this.m_frozenInfo) {
			var frozenInfo = this.m_frozenInfo[pinFreezeContainerID];
			
			if (!initialLoad) {
				initialLoad = frozenInfo.initialLoad;
			}
			
			if (!frozenInfo.parentContainer) {
				var temp = this._createPinAndFreezeObject(oReportDiv, frozenInfo.lid);
				oNewPinFreezeContainer = oNewPinFreezeContainer ? oNewPinFreezeContainer : temp;
			}
		}
		
		if (!initialLoad && oNewPinFreezeContainer) {	
			this._resizePinFreezeObjects(oNewPinFreezeContainer);
		}
		
		// With nested containers, we'd sometimes get our of synch with our scrollbars after loading a workspace. Do a quick refresh
		// to make sure our scrollbars are correct
		this.refresh();
	}
};


PinFreezeManager.prototype._resizePinFreezeObjects = function(oNewPinFreezeContainer) {
	var height, width;
	var widget = this.m_oCV.getViewerWidget();
	if (widget) {
		//Set an initial freeze size that's close to the widget client size unless it exceeds the "initial width/height threshold".
		var size = widget.getWidgetSize();
		width = (size && size.w && (size.w < this.getInitialWidthThreshold())) ? size.w : oNewPinFreezeContainer.getClientWidth();
		height= (size && size.h && (size.h < this.getInitialHeightThreshold())) ? size.h : oNewPinFreezeContainer.getClientHeight();
	}			
	else {
		var oRVContent = document.getElementById("RVContent" + this.m_viewerId);
		var mainViewerTable = document.getElementById("mainViewerTable" + this.m_viewerId);
		width = oRVContent.clientWidth;
		height = mainViewerTable.clientHeight;
	}
	
	this.m_lastWidthProcessed=0;
	this.m_lastHeightProcessed=0;	

	this.resize(width, height);
};

/**
 * Adjust the size of all frozen containers based on the passed in width and height according to these defaulting rules.
 * 1) Normally, containers are sized such that the "frozen dimension(s)" of any container fits the visible width/height of the widget.
 * 2) Small size changes (< "resizeTweekLimit" pixels in either dimension) will not result in a resize of the containers.
 * 3) Size changes in one axis only keeps the opposite axis "as is" (minimizes effect on layout for multi-container reports)
 * 4) Resize events related to "resize to fit content" do not change the size of containers.
 */
PinFreezeManager.prototype.resize  = function(width, height) {
	var widthDimensionTweeked=(Math.abs(width-this.m_lastWidthProcessed) < this.c_resizeTweekLimit);
	var heightDimensionTweeked=(Math.abs(height-this.m_lastHeightProcessed) < this.c_resizeTweekLimit);

	if (widthDimensionTweeked && heightDimensionTweeked) {
		//Don't process size changes when they're just small "tweeks"...the user is likely adjusting for scrollbars.
		return;
	}
	//Only process changes to the dimension that changed size.
	//If the height changed, dont change the width and vice versa.
	var newWidth=(Math.abs(width-this.m_lastWidthProcessed) > 2) ? width : 0;
	var newHeight=(Math.abs(height-this.m_lastHeightProcessed) > 2) ? height : 0;


	for (var lid in this.m_frozenInfo) {
		if (!this.m_frozenInfo[lid].parentContainer) {
			this.resizeContainer(lid, newWidth, newHeight);
		}
	}
	
	this.m_lastWidthProcessed=width;
	this.m_lastHeightProcessed=height;	
};

PinFreezeManager.prototype.resizeContainer = function(lid, width, height) {
	var frozenInfo = this.m_frozenInfo[lid];
	if (frozenInfo) {
		var childContainerInfo = null;
		
		if (frozenInfo.childContainers) {
			var childWidth = width > 10 ? width - 10 : width;
			var childHeight = height > 10 ? height - 10 : height;
			for (var childLID in frozenInfo.childContainers) {
				childContainerInfo = this.resizeContainer(childLID, childWidth, childHeight);
			}
		}
		
		var oPinFreezeContainers = frozenInfo.pinFreezeContainers;
		var pinAndFreezeContainer = null;
		var widestContainerInfo = null;
		if (oPinFreezeContainers) {
			for (var i=0; i < oPinFreezeContainers.length; i++) {
				pinAndFreezeContainer = oPinFreezeContainers[i];
				
				pinAndFreezeContainer.resize(width, height, frozenInfo.parentContainer, childContainerInfo);
				
				var container = pinAndFreezeContainer.getContainer();
				
				if (container && (!widestContainerInfo || (widestContainerInfo.width < container.clientWidth))) {
					widestContainerInfo = {
						"width" : container.clientWidth,
						"lid" : pinAndFreezeContainer.m_lidNS
					};
				}
			}
		}
		
		return widestContainerInfo;
	}
};

/**
 * When an autoResize occurs, we don't resize anything but we do need to track the size
 * for subsequent resizes to work properly (ie: detect height or width hasn't changed).
 */
PinFreezeManager.prototype.processAutoResize = function(width, height) {
	this.m_lastWidthProcessed = width;
	this.m_lastHeightProcessed = height;
};

/**
 * When the widget becomes visible, do a lightweight refresh.
 * If the canvas was resized, repaintOnVisible is set to true...repaint.
 */
PinFreezeManager.prototype.onSetVisible = function() {
	this.refresh();
	if (this.m_repaintOnVisible) {
		this.rePaint();
		this.m_repaintOnVisible=false;
	}
};

PinFreezeManager.prototype.onResizeCanvas = function(isVisible) {
	if (isVisible) {
		this.rePaint();
	} else {
		this.m_repaintOnVisible=true;
	}
};

PinFreezeManager.prototype.rePaint  = function() {
	for (var lid in this.m_frozenInfo) {
		if (!this.m_frozenInfo[lid].parentContainer) {
			this.resizeContainer(lid, this.m_lastWidthProcessed, this.m_lastHeightProcessed);
		}
	}	
};

/**
 * Lightweight refresh - check properties which may have been corrupted
 */
PinFreezeManager.prototype.refresh = function() {
	for (var pinFreezeContainerID in this.m_frozenInfo) {
		var oPinFreezeContainers = this.m_frozenInfo[pinFreezeContainerID].pinFreezeContainers;
		if (oPinFreezeContainers) {
			for (var i=0; i < oPinFreezeContainers.length; i++) {
				var oPinFreezeContainer = oPinFreezeContainers[i];
				oPinFreezeContainer.synchScroll();
				oPinFreezeContainer.synchVScroll();
			}
		}
	}
};

/**
 * Freeze the row headings for the specified container. The state of the column
 * headings is unchanged (ie: if it was frozen before, it is still frozen)
 */
PinFreezeManager.prototype.freezeContainerRowHeadings = function(lid) {
	return this.freezeContainer(lid, /*top*/this.hasFrozenColumnHeadings(lid), /*side*/true);
};

/**
 * Freeze the row headings that are selected.
 * headings is unchanged (ie: if it was frozen before, it is still frozen)
 */
PinFreezeManager.prototype.freezeSelectedRowHeadings = function() {
	var lid=this.getValidSelectedContainerId(/*freezeTop*/false);
	if (lid) {
		this.m_oCV.getSelectionController().resetSelections();
		return this.freezeContainerRowHeadings(lid);
	}
	return null;
};

PinFreezeManager.prototype.canFreezeSelectedRowHeadings = function() {
	var lid=this.getValidSelectedContainerId(/*freezeTop*/false);
	if (lid) {
		return (!this.hasFrozenRowHeadings(lid));
	}
	return false;
};

/**
 * Unfreeze the row headings for the specified container. The state of the column
 * headings is unchanged (ie: if it was frozen before, it is still frozen,
 * if not, the container is now totally unfrozen)
 */
PinFreezeManager.prototype.unfreezeContainerRowHeadings = function(lid) {
	this.freezeContainer(lid, /*top*/this.hasFrozenColumnHeadings(lid), /*side*/false);
};

/**
 * Freeze the row headings that are selected.
 * headings is unchanged (ie: if it was frozen before, it is still frozen)
 */
PinFreezeManager.prototype.unfreezeSelectedRowHeadings = function() {
	var lid=this.getValidSelectedContainerId(/*freezeTop*/false);
	if (lid) {
		this.m_oCV.getSelectionController().resetSelections();
		this.unfreezeContainerRowHeadings(lid);
	}
};

PinFreezeManager.prototype.canUnfreezeSelectedRowHeadings = function() {
	var lid=this.getValidSelectedContainerId(/*freezeTop*/false);
	if (lid) {
		return (this.hasFrozenRowHeadings(lid));
	}
	return false;
};

/**
 * Freeze the column headings for the specified container. The state of the row
 * headings is unchanged (ie: if it was frozen before, it is still frozen)
 */
PinFreezeManager.prototype.freezeContainerColumnHeadings = function(lid) {
	return this.freezeContainer(lid, /*top*/true, /*side*/this.hasFrozenRowHeadings(lid));
};

/**
 * Freeze the selected headings that are selected.
 * headings is unchanged (ie: if it was frozen before, it is still frozen)
 */
PinFreezeManager.prototype.freezeSelectedColumnHeadings = function() {
	var lid=this.getValidSelectedContainerId(/*freezeTop*/true);
	if (lid) {
		this.m_oCV.getSelectionController().resetSelections();
		return this.freezeContainerColumnHeadings(lid);
	}
	return null;
};

PinFreezeManager.prototype.canFreezeSelectedColumnHeadings = function() {
	var lid=this.getValidSelectedContainerId(/*freezeTop*/true);
	if (lid) {
		return (!this.hasFrozenColumnHeadings(lid));
	}
	return false;
};

/**
 * Unfreeze the column headings for the specified container. The state of the row
 * headings is unchanged (ie: if it was frozen before, it is still frozen,
 * if not, the container is now totally unfrozen)
 */
PinFreezeManager.prototype.unfreezeContainerColumnHeadings = function(lid) {
	this.freezeContainer(lid, /*top*/false, /*side*/this.hasFrozenRowHeadings(lid));
};

/**
 * Freeze the selected headings that are selected.
 * headings is unchanged (ie: if it was frozen before, it is still frozen)
 */
PinFreezeManager.prototype.unfreezeSelectedColumnHeadings = function() {
	var lid=this.getValidSelectedContainerId(/*freezeTop*/true);
	if (lid) {
		this.m_oCV.getSelectionController().resetSelections();
		this.unfreezeContainerColumnHeadings(lid);
	}
};

PinFreezeManager.prototype.canUnfreezeSelectedColumnHeadings = function() {
	var lid=this.getValidSelectedContainerId(/*freezeTop*/true);
	if (lid) {
		return (this.hasFrozenColumnHeadings(lid));
	}
	return false;
};

/**
 * Given a cognos viewer object, return the id of the selected container
 * if it meets the rules for freezing containers
 * (ie: crosstabs only for side headings, crosstabs or lists for top headings).
 */
PinFreezeManager.prototype.getValidSelectedContainerId = function(freezeTopRule)
{
	var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
	if (selectedObjects && selectedObjects.length &&
			(selectedObjects[0].getDataContainerType() === "crosstab" ||
			 (freezeTopRule && selectedObjects[0].getDataContainerType() === "list"))) {
		var lid=(selectedObjects[0].getLayoutElementId());
		if (lid) {
			if(!this.hasPromptControlsInFreezableCells(lid)) {
				return this.removeNamespace(lid);
			}
		}
	}
	return null;
};


PinFreezeManager.prototype.hasPromptControlsInFreezableCells = function(lid) {
	var layoutElement = this.m_oCV.getLayoutElementFromLid(lid);
	var potentiallyFrozen = getElementsByAttribute(layoutElement, ["td","th"], "type", "columnTitle");
	//This regex finds class attributes which contain the property 'clsPromptComponent',
	var promptClass = new RegExp("(^|[\W])clsPromptComponent($|[\W])");
	var attributeName = isIE() ? "className" : "class";
	for(var j in potentiallyFrozen) {
		if (potentiallyFrozen.hasOwnProperty(j)){
			var prompts = getElementsByAttribute(potentiallyFrozen[j], "*", attributeName, null, 1, promptClass);
			if(prompts.length > 0) {
				return true;
			}
		}
	}
	return false;
};

/**
 * Given the html for a report, completely unfreeze the container with the matching lid
 */
PinFreezeManager.prototype.unfreeze = function(lid, oReportDiv, reset) {
	if (this.m_frozenInfo && this.m_frozenInfo[lid]) {
		var oPinFreezeContainers = this.m_frozenInfo[lid].pinFreezeContainers;
		if (oPinFreezeContainers) {
			for (var i=0; i < oPinFreezeContainers.length; i++) {
				var oPinFreezeContainer = oPinFreezeContainers[i];
				oPinFreezeContainer.unfreeze(oReportDiv);
			}
			
			if (reset) {
				this._resetFrozenInfo(lid);
			}
		}
	}
};

/**
 * Given an LID, unfreeze every child container
 */
PinFreezeManager.prototype.unfreezeAllNestedContainers = function(lid, oReportDiv) {
	var frozenInfo = this.m_frozenInfo[lid]; 
	if (frozenInfo) {
		if (frozenInfo.freezeTop || frozenInfo.freezeSide) {
			this.unfreeze(lid, oReportDiv, false);
		}

		if (frozenInfo.childContainers) {
			for (var childLID in frozenInfo.childContainers) {
				this.unfreezeAllNestedContainers(childLID, oReportDiv);
			}
		}
	}
};

/**
 * Returns true if the HTML Node is currently seen by the user.
 * This accounts for hidden pieces of the DOM, or nodes which will always
 * be scrolled out of view of the user.
 */
PinFreezeManager.prototype.isNodeVisible = function(node) {
	var slid = PinFreezeContainer.nodeToSlid(node);
	if(!slid) {
		return true;
	}

	var lid = this.removeNamespace(PinFreezeContainer.getLidFromSlid(slid))	;
	var container = this.getContainer(lid);
	if(!container) {
		return true;
	}

	var sectionName = PinFreezeContainer.getSectionNameFromSlid(slid);
	var section = container.getSection(sectionName);

	var refToMain = null, refToCopy = null;

	var nodeI = node;
	var refSrc = null;

	//Search for main/copy pointers.
	while(nodeI && nodeI !== section && !refToMain && !refToCopy) {
		refToMain = container.getMain(nodeI);
		refToCopy = container.getCopy(nodeI);
		refSrc = nodeI;
		nodeI = nodeI.parentNode;
	}

	var isCopy = refToMain ? true : false;
	var isMainAndHasCopy = refToCopy ? true : false;

	if(isCopy) {
		//The node is visible iff the container computes
		//its visible version to be the node.
		return container.getCopy(refToMain) === refSrc;
	} else if(isMainAndHasCopy) {
		//The node is visible iff the section its copy is in is not visible.
		//(Note: this node may indeed be considered by the browser to be
		//visible, but if its copy is currently visible, our code will
		//always keep it scrolled out of sight).
		return container.getCopy(refSrc) ? false : true;

	} else {	//i.e. is in main and has no copy
		//Since there is no copy of this node, it should be visible.
		return true;
	}
};

/**
 * Invoke this method when there is a change in the structure of
 * the pin and freeze sections to handle necessary changes in the
 * Viewer.
 */
PinFreezeManager.prototype.sectionStructureChange = function() {
	var widget = this.m_oCV.getViewerWidget();
	if(widget && widget.getAnnotationHelper()) {
		widget.getAnnotationHelper().repositionCommentIndicators();
	}
};

/**
 * Perform a deep clone, but exclude any dojo dijits - they
 * are not meant to be cloned, and need to special handling.
 */
PinFreezeManager.prototype.deepCloneNode = function(original) {
	var copy = original.cloneNode(true);

	var widget = this.m_oCV.getViewerWidget();
	if(widget) {
		if(widget.reportContainsDijits()) {
			var dijits = getElementsByAttribute(copy, "*", "widgetid", "*");
			if(dijits && dijits.length) {
				for(var i = 0; i < dijits.length; i++) {
					dijits[i].parentNode.removeChild(dijits[i]);
				}
			}
		}
	}

	return copy;
};


/**
 * Called when saving the dashboard. This function will serialize all the information
 * needed to correctly reload the dashboard with frozen containers
 */
PinFreezeManager.prototype.toJSONString = function() {
	var sContainers = '';
	var sResponse = '';

	for (var pinFreezeContainerID in this.m_frozenInfo) {
		if (sContainers.length > 0) {
			sContainers += ',';
		}
		
		var frozenInfo = this.m_frozenInfo[pinFreezeContainerID];
		
		sContainers += '{';
		sContainers += '"lid":"' + frozenInfo.lid.replace('"', '\\"') + '",';
		sContainers += '"freezeTop":' + frozenInfo.freezeTop + ',';
		sContainers += '"freezeSide":' + frozenInfo.freezeSide + ',';
		if (frozenInfo.parentContainer) {
			sContainers += '"parentContainer":"' + frozenInfo.parentContainer + '",';
		}
		
		if (frozenInfo.pinFreezeContainers && frozenInfo.pinFreezeContainers.length > 0) {
			sContainers += '"properties":' + frozenInfo.pinFreezeContainers[0].toJSONString() + ',';
		}

		sContainers += '"childContainers": {';
		if (frozenInfo.childContainers) {
			var first = true;
			for (var childLID in frozenInfo.childContainers) {
				if (!first) {
					sContainers += ',';
				}
				sContainers += '"' + childLID + '":true';
				first = false;
			}
		}
		sContainers += '}}';
	}

	if (sContainers.length > 0) {
		// VERSION INFO
		// * no version info is initial implementation
		// * 1 is when we added nested container support. 
		sResponse = '{"version":1, "containers":[' + sContainers + ']}';
	}

	return sResponse;
};

/**
 * Called on dashboard open
 */
PinFreezeManager.prototype.fromJSONString = function(sJSON) {
	
	if (!sJSON || sJSON.length === 0) {
		return;
	}

	var oJSON = null;

	try {
		oJSON = eval("(" + sJSON + ")");
	}
	catch (e) {
		if(typeof console != "undefined") {
			console.log("PinFreezeManager.prototype.fromJSON could not parse JSON - " + sJSON);
			console.log(e);
		}
	}

	if (!oJSON) {
		return;
	}

	var aContainers = oJSON.containers;
	var version = oJSON.version;

	if (aContainers.length > 0) {
		this.m_frozenInfo = {};
	}

	for (var iIndex=0; iIndex < aContainers.length; iIndex++) {
		var frozenInfo = aContainers[iIndex];	
		
		var lid = frozenInfo.lid;
		var freezeTop = frozenInfo.freezeTop;
		var freezeSide = frozenInfo.freezeSide;
		
		var oReportDiv = document.getElementById("CVReport" + this.m_viewerId);
		var containerNodes = getElementsByAttribute(oReportDiv, "table", "lid", lid + this.m_viewerId);
		
		var pinFreezeContainers = [];
		
		if (containerNodes && (freezeTop || freezeSide)) {
			for (var i=0; i < containerNodes.length; i++) {
				var containerNode = containerNodes[i];
				var oNewPinFreezeContainer = new PinFreezeContainer(this, lid, this.m_viewerId, frozenInfo.freezeTop, frozenInfo.freezeSide, containerNode, i);
				if (frozenInfo.properties) {
					applyJSONProperties(oNewPinFreezeContainer, frozenInfo.properties);
				}
				
				pinFreezeContainers.push(oNewPinFreezeContainer);
			}
		}
		
		this.m_frozenInfo[lid] = {
			"lid" : lid,
			"freezeTop" : freezeTop,
			"freezeSide" : freezeSide,
			"pinFreezeContainers" : pinFreezeContainers,
			"initialLoad" : true
		};

		if (version >= 1) {
			if (frozenInfo.childContainers) {
				this.m_frozenInfo[lid].childContainers = frozenInfo.childContainers;
			}
			
			if (frozenInfo.parentContainer) {
				this.m_frozenInfo[lid].parentContainer = frozenInfo.parentContainer;
			}
		}
	}
};

/**
 * Remove id attributes on the element passes and its children
 */
PinFreezeManager.prototype.removeIdAttribute = function(element) {

	// IE8 or eailer versions do not support 'hasAttribute' function. So use this logic.
	var idValue = element.getAttribute("id");
	if (idValue !== null && idValue !== "") {
		element.removeAttribute("id");
	}

	var elements = getElementsByAttribute(element, "*", "id", "*");
	if(elements && elements.length) {
		for(var i = 0; i < elements.length; i++) {
			elements[i].removeAttribute("id");
		}
	}

	return element;
};

PinFreezeManager.prototype.isElementInMainOutput = function(element) {
	return PinFreezeContainer.isElementInMainOutput(element);
};

PinFreezeManager.prototype.isIWidgetMobile = function() {
	return (this.m_oCV && this.m_oCV.isIWidgetMobile());
};

PinFreezeManager.prototype.destroy = function() {
	GUtil.destroyProperties(this);
};
