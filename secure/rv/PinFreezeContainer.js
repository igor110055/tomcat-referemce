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

/**
 * Support pin and freeze for a specific layout container (crosstab or list)
 */
function PinFreezeContainer(pinFreezeManager, lid, viewerID, freezeTop, freezeSide, containerNode, index) {
	this.m_pinFreezeManager=pinFreezeManager;
	this.m_lid=lid;
	this.m_lidNS=lid + viewerID + index;
	this.m_viewerId=viewerID;
	this.m_freezeTop=freezeTop;
	this.m_freezeSide=freezeSide;

	this.m_cachedReportDiv=null;
	this.m_cachedPFContainer=null;
	this.m_cachedBaseContainer=containerNode;	//The crosstab/list within main output.
	this.m_containerMargin = {"top" : 0, "left" : 0};
	if (this.m_cachedBaseContainer && this.m_cachedBaseContainer.style) {
		if (this.m_cachedBaseContainer.style.marginTop) {
			this.m_containerMargin.top = Number(this.m_cachedBaseContainer.style.marginTop.replace('px', ''));
		}
		if (this.m_cachedBaseContainer.style.marginLeft) {
			this.m_containerMargin.left = Number(this.m_cachedBaseContainer.style.marginLeft.replace('px', ''));
		}
	}
	
	this.m_cachedContainerIndex=index;
	this.m_sectionCache=null;
	this.m_homeCellNodes={};

	this.m_fixedWidth=null;			//Resize width will have no effect when container style (width) has been specified by the report author.
	this.m_clientWidth=700;			//The total visible width of the container (in BUX, usually the widget width).
	this.m_scrollableClientWidth=700;	//The visible width of the scrollable region (usu the clientWidth-the homeCell width)

	this.m_fixedHeight=null;		//Resize height will have no effect when container style (height) has been specified by the report author.
	this.m_clientHeight=300;
	this.m_scrollableClientHeight=300;
	this.m_wrapFlag=false;			//For FF
	this.c_pageMargin=(this.m_freezeTop && this.m_freezeSide) ? 50 : 20;	//Default page margin.
	
	this.touchScrollSections=false;	//True when touch scrolling of sections is underway (false if move is delegated)
	this.touchPreviousX=-1;	//represents the "previous touch location" prior to the current touch move event
	this.touchPreviousY=-1;	//set to -1 initially and at "touchEnd".
}

/**
 * Called when saving the dashboard. This function will serialize all the information
 * needed to correctly reload the dashboard with frozen containers
 */
PinFreezeContainer.prototype.toJSONString = function() {
	var sResponse = '{';
	sResponse += '"m_clientWidth":' + this.m_clientWidth + '';
	sResponse += ',"m_scrollableClientWidth":' + this.m_scrollableClientWidth + '';
	sResponse += ',"m_clientHeight":' + this.m_clientHeight + '';
	sResponse += ',"m_scrollableClientHeight":' + this.m_scrollableClientHeight + '';
	sResponse += '}';
	return sResponse;
};

PinFreezeContainer.prototype.copyProperties = function(oldObj) {
	this.m_clientWidth = oldObj.m_clientWidth;
	this.m_scrollableClientWidth = oldObj.m_scrollableClientWidth;
	this.m_clientHeight = oldObj.m_clientHeight;
	this.m_scrollableClientHeight = oldObj.m_scrollableClientHeight;
};

PinFreezeContainer.prototype.setViewerId = function(id) {
	this.m_viewerId = id;
};

PinFreezeContainer.prototype.getLid = function() {
	return this.m_lid;
};

/**
 * Modify the DOM for the report by overlaying a pin freeze template
 * that establishes zones for the container in the report (frozen side headings, top headings, data area).
 * Populate the frozen headings with a minimal subset of the main report
 */
PinFreezeContainer.prototype.createPFContainer = function(oReport, containsChildContainers) {
	var oTemp=document.createElement('temp');
	if (this.m_cachedBaseContainer) {
		this.applyAuthoredFixedSizes(this.m_cachedBaseContainer);
		this.m_cachedReportDiv=oReport;
		var oBaseContainerParent=this.m_cachedBaseContainer.parentNode;
		var templateHTML=this.loadTemplateHTML();
		if (templateHTML) {
			oTemp.innerHTML=templateHTML;
			var pfContainer = this.getContainerByLID(oTemp);
			var pfMainOutput=this.getSectionByLID(oTemp.firstChild, "pfMainOutput");

			if (pfMainOutput) {
				//To avoid clone....mark the initial position oBaseContainer had it in its parent list.
				var i=this.getChildPosition(oBaseContainerParent, this.m_cachedBaseContainer);
				if (i!=-1) {
					//Set White space Style for advance setting "ADVANCED_PROPERTY_FREEZE_DEFAULT_WRAP"
					var m_oCV=this.m_pinFreezeManager.m_oCV;
					if(m_oCV && m_oCV.envParams["freezeDefaultWrap"]) {
						if (this.m_cachedBaseContainer.style.whiteSpace === "" && m_oCV.envParams["freezeDefaultWrap"].toLowerCase() === "true" ) {			
							var spanElements=this.m_cachedBaseContainer.getElementsByTagName("span");
							if(spanElements) {
								for (var k=0; k < spanElements.length; k++) {
									spanElements[k].style.whiteSpace = "nowrap";						
								}
							}
							this.m_wrapFlag=true;
						}
					}
					
					// If we don't have any child containers, then make sure we keep the current
					// width and height of the container so we don't squish the contents.
					if (!containsChildContainers) {
						if (!this._getFixedWidth()) {
							// We have to distinguish between the width set by a report author and the width we set
							this.m_cachedBaseContainer.setAttribute("authoredFixedWidth", "false");
							this.m_addedFixedWidth = this.m_cachedBaseContainer.clientWidth + 1;
							this.m_cachedBaseContainer.style.width = this.m_addedFixedWidth + "px";
						}
						
						if (!this._getFixedHeight()) {
							// We have to distinguish between the height set by a report author and the height we set							
							this.m_cachedBaseContainer.setAttribute("authoredFixedHeight", "false");
							this.m_addedFixedHeight = this.m_cachedBaseContainer.clientHeight;
							this.m_cachedBaseContainer.style.height = this.m_addedFixedHeight + "px";
						}
						
						
						// Needed the +2 here to stop a small movement that would happen when moving the contain to under the div. Now
						// The list/crosstab will not shift, it should stay exactly where it was
						pfMainOutput.style.width = this.m_cachedBaseContainer.clientWidth + 2 + "px";
						pfMainOutput.style.height = this.m_cachedBaseContainer.clientHeight + 2 + "px";
					}

					//move oBaseContainer to the new parent.
					pfMainOutput.appendChild(this.m_cachedBaseContainer);
					//insert pfContainer at the position where oBaseContainer was.
					this.insertAt(oBaseContainerParent, pfContainer, i);
				}
				if (this.m_cachedBaseContainer.style.border!=="") {
					//Transfer borders that are on the layout element to the outer pfContainer
					//since the original layout element is only a section of the output.
					pfContainer.style.border=this.m_cachedBaseContainer.style.border;
					this.m_cachedBaseContainer.style.border="";
				}
			}
		}
	}
};

PinFreezeContainer.prototype._getFixedWidth = function(oBaseContainer) {
	if (oBaseContainer && oBaseContainer.style.width && !oBaseContainer.getAttribute("authoredFixedWidth")) {
		var width = Number(oBaseContainer.style.width.split('px')[0]);
		return isNaN(width) ? null : width;
	}	

	return null;
};

PinFreezeContainer.prototype._getFixedHeight = function(oBaseContainer) {
	if (oBaseContainer && oBaseContainer.style.height && !oBaseContainer.getAttribute("authoredFixedHeight")) {
		var height = Number(oBaseContainer.style.height.split('px')[0]);
		return isNaN(height) ? null : height;
	}	

	return null;
};


/**
 * If the author has specified a width or height in report studio (in px units),
 * the pinFreeze container will be "fixed in size" in that dimension.
 */
PinFreezeContainer.prototype.applyAuthoredFixedSizes = function(oBaseContainer)
{
	var width = this._getFixedWidth(oBaseContainer);
	if (width) {
		this.m_fixedWidth=width;
		this.m_clientWidth=this.m_fixedWidth; //Author-specified width for the container.
		this.m_scrollableClientWidth=this.m_fixedWidth;
	}
	
	var height = this._getFixedHeight(oBaseContainer);
	
	if (height) {
		this.m_fixedHeight = height;
		this.m_clientHeight=this.m_fixedHeight; //Author-specified height for the container.
		this.m_scrollableClientHeight=this.m_fixedHeight;
	}
};

/**
 * Apply a template used when the side headings of a crosstab are frozen.
 * This template includes regions for the side headings, main output and bottom scrollbar
 */
PinFreezeContainer.prototype.loadFreezeBothTemplateHTML = function()
{
	var sPFOutput =
		'<table pflid="' + this.m_lidNS + '" pfclid="pfContainer_' + this.m_lidNS + '" cellpadding="0" style="white-space:nowrap; width:0px; height:0px;" cellspacing="0">' +
			'<tr class="BUXNoPrint" templatePart="freezeTop"><td align="center" templatePart="freezeSide"><div pflid="' + this.m_lidNS + '" pfslid="pfHomeCell_' + this.m_lidNS + '" style="overflow-x:hidden; overflow-y:hidden; width:100%; height:100%"/></td>' +
			'<td valign=top><div pflid="' + this.m_lidNS + '" pfslid="pfTopHeadings_' + this.m_lidNS + '" style="width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;"/></td><td templatePart="freezeTop"></td></tr>' +
			'<tr><td class="BUXNoPrint" valign=top templatePart="freezeSide"><div pflid="' + this.m_lidNS + '" pfslid="pfSideHeadings_' + this.m_lidNS + '" style="width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;"/></td>' +
			'<td valign=top><div pflid="' + this.m_lidNS + '" pfslid="pfMainOutput_' + this.m_lidNS + '" style="width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;">' +
			'</div></td>' +
			'<td class="BUXNoPrint" templatePart="freezeTop">' +
				'<div style="padding-right:1px;overflow-x:hidden; overflow-y:scroll;" pflid="' + this.m_lidNS + '" pfslid="pfVerticalScrollBar_' + this.m_lidNS + '" tabIndex="-1" onmouseup="stopEventBubble(event);" onmousedown="stopEventBubble(event);" onscroll="' + getCognosViewerObjectRefAsString(this.m_viewerId) + '.m_pinFreezeManager.getContainer(\'' + this.m_lid + '\', ' + this.m_cachedContainerIndex + ').synchVScroll()">' +
					'<div style="padding-right:1px;"/>' +
				'</div>' +
			'</td>' +
		'</tr>' +
		'<tr class="BUXNoPrint" templatePart="freezeSide"><td></td><td>' +
			'<div style="overflow-x:scroll; overflow-y:hidden;" pflid="' + this.m_lidNS + '" pfslid="pfHorizontalScrollBar_' + this.m_lidNS + '" tabIndex="-1" onmouseup="stopEventBubble(event);" onmousedown="stopEventBubble(event);" onscroll="' + getCognosViewerObjectRefAsString(this.m_viewerId) + '.m_pinFreezeManager.getContainer(\'' + this.m_lid + '\', ' + this.m_cachedContainerIndex + ').synchScroll()">' +
				'<div style="height:2px;">&nbsp;</div>' +
			'</div>' +
		'</td><td></td></tr></table>';
	return sPFOutput;
};

/**
 * Apply a template used when the side headings of a crosstab are frozen.
 * This template includes regions for the side headings, main output and bottom scrollbar
 */
PinFreezeContainer.prototype.loadFreezeSideTemplateHTML = function()
{
	var sPFOutput = '<table pflid="' + this.m_lidNS + '" pfclid="pfContainer_' + this.m_lidNS + '" cellpadding="0" style="white-space:nowrap; width:0px; height:0px;" cellspacing="0"><tr>' +
			'<td class="BUXNoPrint" valign=top><div pflid="' + this.m_lidNS + '" pfslid="pfSideHeadings_' + this.m_lidNS + '" style="width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;"/></td>' +
			'<td valign=top><div pflid="' + this.m_lidNS + '" pfslid="pfMainOutput_' + this.m_lidNS + '" style="width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;">' +
			'</div></td>' +
		'</tr>' +
		'<tr class="BUXNoPrint"><td></td><td>' +
			'<div style="overflow-x:scroll; overflow-y:hidden;" pflid="' + this.m_lidNS + '" pfslid="pfHorizontalScrollBar_' + this.m_lidNS + '" tabIndex="-1" onmouseup="stopEventBubble(event);" onmousedown="stopEventBubble(event);" onscroll="' + getCognosViewerObjectRefAsString(this.m_viewerId) + '.m_pinFreezeManager.getContainer(\'' + this.m_lid + '\', ' + this.m_cachedContainerIndex + ').synchScroll()">' +
				'<div style="height:2px;">&nbsp;</div>' +
			'</div>' +
		'</td></tr></table>';
	return sPFOutput;
};

/**
 * Apply a template used when the top headings of a crosstab are frozen.
 * This template includes regions for the top headings, main output and side scrollbar
 */
PinFreezeContainer.prototype.loadFreezeTopTemplateHTML = function()
{
	var sPFOutput = '<table pflid="' + this.m_lidNS + '" pfclid="pfContainer_' + this.m_lidNS + '" cellpadding="0" style="white-space:nowrap; width:0px; height:0px;" cellspacing="0">' +
			'<tr class="BUXNoPrint"><td valign=top><div pflid="' + this.m_lidNS + '" pfslid="pfTopHeadings_' + this.m_lidNS + '" style="width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;"/></td><td></td></tr>' +
			'<tr><td valign=top><div pflid="' + this.m_lidNS + '" pfslid="pfMainOutput_' + this.m_lidNS + '" style="width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;"></div></td>' +
				'<td class="BUXNoPrint">' +
					'<div style="padding-right:1px;overflow-x:hidden; overflow-y:scroll;" pflid="' + this.m_lidNS + '" pfslid="pfVerticalScrollBar_' + this.m_lidNS + '" tabIndex="-1" onmouseup="stopEventBubble(event);" onmousedown="stopEventBubble(event);" onscroll="' + getCognosViewerObjectRefAsString(this.m_viewerId) + '.m_pinFreezeManager.getContainer(\'' + this.m_lid + '\', ' + this.m_cachedContainerIndex + ').synchVScroll()">' +
						'<div style="padding-right:1px;"/>' +
					'</div>' +
				'</td>' +
			'</tr></table>';
	return sPFOutput;
};

/**
 * Apply the appropriate template to the supplied html for a container based.
 */
PinFreezeContainer.prototype.loadTemplateHTML = function()
{
	if (this.m_freezeSide && this.m_freezeTop) {
		return this.loadFreezeBothTemplateHTML();
	} else if (this.m_freezeSide) {
		return this.loadFreezeSideTemplateHTML();
	} else if (this.m_freezeTop) {
		return this.loadFreezeTopTemplateHTML();
	}
	return null;
};

/**
 * Clone the main report DOM for a crosstab into the frozen side headings area.
 * The table element, the home cell and, after the labels after the column heading rows are visible.
 */
PinFreezeContainer.prototype.createSideHeadings = function(oxTab)
{
	var pfMainOutput = this.getSection("pfMainOutput");
	var mainSlid = pfMainOutput.getAttribute("pfslid");
	var pfSideHeadings = this.getSection("pfSideHeadings");
	var sideSlid = pfSideHeadings.getAttribute("pfslid");

	var oHomeCell = this.getMainOutputHomeCell();
	if (!oHomeCell) {
		return;
	}

	var oSourceTable=oxTab;

	var oTargetSideHeadings=pfSideHeadings;

	var bRemoveIds = this.isA11yEnabled(oSourceTable);

	//Clone The table element
	var oTargetTable=this.m_pinFreezeManager.deepCloneNode(oSourceTable);
	oTargetSideHeadings.appendChild(oTargetTable);
	var oTargetHomeCell = this.getSectionHomeCell(pfSideHeadings);
	if (!oTargetHomeCell) {
		return;
	}
	
	var oSourceTBodyArray=oSourceTable.getElementsByTagName("tbody");
	var oTargetTBodyArray=oTargetTable.getElementsByTagName("tbody");
	if (oSourceTBodyArray.length > 0 && oTargetTBodyArray.length > 0) {
		var oSourceTBody=oSourceTBodyArray[0];
		var oTargetTBody=oTargetTBodyArray[0];

		//Home cell
		var oSourceHomeCellTR=oSourceTBody.firstChild;
		var oTargetHomeCellTR=oTargetTBody.firstChild;
		var homeCellRowSpan=oHomeCell.rowSpan;

		this.markAsCopy(oHomeCell, oTargetHomeCell, mainSlid, sideSlid);

		for (var r=0; r<homeCellRowSpan; ++r) {
			var oTargetTR=oTargetTBody.rows[r];
			this.removeCTX(oTargetTR);
		}
		
		//clear unnecessary attributes from datavalue cells and mark the label cells as copies.
		for (var r=homeCellRowSpan; r<oTargetTBody.rows.length; ++r) {
			var oSourceTR=oSourceTBody.rows[r];
			var oTargetTR=oTargetTBody.rows[r];
			
			oTargetTR.style.visibility='hidden'; //WARNING: Do not remove this without testing IE and calculations

			for (var c=0; c<oTargetTR.cells.length; ++c) {
				var oTargetTD=oTargetTR.cells[c];
				if (bRemoveIds) {
					oTargetTD=this.m_pinFreezeManager.removeIdAttribute(oTargetTD);
				}
				if (oTargetTD.getAttribute("type") == "datavalue") {
					oTargetTD.removeAttribute("ctx");
					oTargetTD.removeAttribute("uid");
					oTargetTD.removeAttribute("name");
				} else {
					var oSourceTD=oSourceTR.cells[c];
					this.markAsCopy(oSourceTD, oTargetTD, mainSlid, sideSlid);
				}
			}

			oTargetTR.style.visibility='visible'; //WARNING: Do not remove this without testing IE and calculations
		}
	}
};

/**
 * When freezing headings, the right/bottom border around the homecell should be maintained.
 */
PinFreezeContainer.prototype.applyNeighbouringBorderStylesToHomeCell = function(oSourceRows, oTargetHomeCell) {
	if (isFF() || isIE()) {
		if (oSourceRows && oSourceRows.length && oSourceRows[0].cells && oSourceRows[0].cells.length > 1) {
			if (this.m_freezeSide) {
				var nextCellBorder=this.getBorderInfo(oSourceRows[0].cells[1], "right");
				if (nextCellBorder) {
					oTargetHomeCell.style.borderRightWidth=nextCellBorder.borderRightWidth;
					oTargetHomeCell.style.borderRightStyle=nextCellBorder.borderRightStyle;
					oTargetHomeCell.style.borderRightColor=nextCellBorder.borderRightColor;
				}
			}

			if (this.m_freezeTop) {
				var nextCellBorder=this.getBorderInfo(oSourceRows[0].cells[1], "bottom");
				if (nextCellBorder) {
					oTargetHomeCell.style.borderBottomWidth=nextCellBorder.borderBottomWidth;
					oTargetHomeCell.style.borderBottomStyle=nextCellBorder.borderBottomStyle;
					oTargetHomeCell.style.borderBottomColor=nextCellBorder.borderBottomColor;
				}
			}
		}
	}
};

/**
 * Clone the main report DOM for a crosstab into the frozen top headings area.
 * The table element, the home cell and the first few rows above the data cells are visible.
 */
PinFreezeContainer.prototype.createTopHeadings = function(oxTab)
{
	var pfMain = this.getSection("pfMainOutput");
	var mainSlid = pfMain.getAttribute("pfslid");
	var pfTopHeadings = this.getSection("pfTopHeadings");
	var topSlid = pfTopHeadings.getAttribute("pfslid");
	var oHomeCell = this.getMainOutputHomeCell();
	if (!oHomeCell) {
		return;
	}

	var oSourceTable=oxTab;
	var oTargetTopHeadings=pfTopHeadings;
	var bRemoveIds = this.isA11yEnabled(oSourceTable);

	//Clone The table element
	var oTargetTable=this.m_pinFreezeManager.deepCloneNode(oSourceTable);
	oTargetTable.setAttribute("clonednode", "true");
	
	oTargetTopHeadings.appendChild(oTargetTable);

	var oSourceTBodyArray=oSourceTable.getElementsByTagName("tbody");
	var oTargetTBodyArray=oTargetTable.getElementsByTagName("tbody");
	
	if (oSourceTBodyArray.length > 0 && oTargetTBodyArray.length > 0) {
		var oSourceTBody=oSourceTBodyArray[0];
		var oTargetTBody=oTargetTBodyArray[0];

		//clear attributes from datacells and mark heading cells as copies.
		var homeCellRowSpan=oHomeCell.rowSpan;
		for (var r=0; r<oTargetTBody.rows.length; ++r) {
			var oSourceTR=oSourceTBody.rows[r];
			var oTargetTR=oTargetTBody.rows[r];
			if (bRemoveIds) {
				oTargetTR=this.m_pinFreezeManager.removeIdAttribute(oTargetTR);
			}

			oTargetTR.style.visibility='hidden'; //WARNING: Do not remove this without testing IE and calculations
			for (var c=0; c<oTargetTR.cells.length; ++c) {
				var oTargetTD=oTargetTR.cells[c];
				if (r > homeCellRowSpan || oTargetTD.getAttribute("type") == "datavalue") {
					oTargetTD.removeAttribute("ctx");
					oTargetTD.removeAttribute("uid");
					oTargetTD.removeAttribute("name");
				} else {
					var oSourceTD=oSourceTR.cells[c];
					this.markAsCopy(oSourceTD, oTargetTD, mainSlid, topSlid);
					if(oSourceTD === oHomeCell) {
						this.initializeHomeCellTabIndex(oTargetTD);
						this.applyNeighbouringBorderStylesToHomeCell(oSourceTBody.rows, oTargetTD);
					}
				}
			}
			oTargetTR.style.visibility='visible'; //WARNING: Do not remove this without testing IE and calculations
		}
	}
};

PinFreezeContainer.prototype.createHomeCellHeading = function() {
	var pfMainOutput = this.getSection("pfMainOutput");
	var mainSlid = pfMainOutput.getAttribute("pfslid");
	var pfHomeCellDiv = this.getSection("pfHomeCell");
	var oHomeCellWrapperTd = pfHomeCellDiv.parentNode;
	var pfHomeSlid = pfHomeCellDiv.getAttribute("pfslid");
	var oSourceHomeCell = this.getMainOutputHomeCell();
	if (!oSourceHomeCell) {
		return;
	}
	
	// Make sure the new home cell has the same height of the original home cell
	oHomeCellWrapperTd.style.height = "100%";
	var topHeadingSectionHeight=this.getTopHeadingSectionHeight(oSourceHomeCell);
	
	// The div is the one we'll use to put the left and bottom border on. Make sure the width
	// and height set take the margin of the container into account
	pfHomeCellDiv.style.height = topHeadingSectionHeight - this.m_containerMargin.top + "px";
	pfHomeCellDiv.style.width = this.getSideHeadingSectionWidth(oSourceHomeCell) - this.m_containerMargin.left + "px";
	pfHomeCellDiv.style.marginTop = this.m_containerMargin.top + "px";
	pfHomeCellDiv.style.marginLeft = this.m_containerMargin.left + "px";
	
	var oSourceTR = oSourceHomeCell.parentNode;
	var oTargetTR = oSourceTR.cloneNode(false);

	var bestGuessHomeCell = this._findBestGuessHomeCell(oSourceHomeCell);
	var sizeCalculatingDiv = document.createElement("div");
	sizeCalculatingDiv.style.width = "100%";
	sizeCalculatingDiv.style.height = "100%";
	
	/**
	 * The home cell could be made up of a single TD (normal case), or it can be a bunch
	 * of crosstab spacers. Go through all the TDs until the offsetLeft gets beyond the 'home cell' boundary  
	 */
	while (oSourceHomeCell.offsetLeft <= bestGuessHomeCell.offsetLeft) {
		oTargetHomeCell = this.m_pinFreezeManager.deepCloneNode(oSourceHomeCell);
		
		// For Firefox and IE we can't simply take the clientWidth, since that includes the padding. Use a hidden
		// div inside the TD and get it's width. This will tell use the inner width which we need to copy over to our copied TD's
		if (isFF() || isIE()) {
			oSourceHomeCell.appendChild(sizeCalculatingDiv);
			oTargetHomeCell.style.width = sizeCalculatingDiv.clientWidth + "px";
			oSourceHomeCell.removeChild(sizeCalculatingDiv);
		}
		else {		
			oTargetHomeCell.style.width = oSourceHomeCell.clientWidth + 1 + "px";
		}
		
		// Make sure there's no bottom border on the TD. We'll have a bottom border on the wrapper TD
		oTargetHomeCell.style.borderBottomWidth="0px";
		
		oTargetTR.appendChild(oTargetHomeCell);

		this.markAsCopy(oSourceHomeCell, oTargetHomeCell, mainSlid, pfHomeSlid);

		if (oSourceHomeCell.nextSibling) {
			oSourceHomeCell = oSourceHomeCell.nextSibling;
		}
		else {
			break;
		}
	}
	
	// Don't need a right border on the last TD, we'll have that on the wrapper TD
	if (oTargetHomeCell) {
		oTargetHomeCell.style.borderRightWidth="0px";
	}

	var oSourceTBody = oSourceTR.parentNode;
	var oTargetTBody = oSourceTBody.cloneNode(false);
	oTargetTBody.appendChild(oTargetTR);

	var oSourceTable = oSourceTBody.parentNode;
	var oTargetTable = oSourceTable.cloneNode(false);
	oTargetTable.appendChild(oTargetTBody);

	oTargetTable.style.width = "100%";
	oTargetTable.style.height = "100%";
	// Since the margins have been set on the containing div, clear them on the table
	oTargetTable.style.marginLeft = "";
	oTargetTable.style.marginTop = "";
	
	pfHomeCellDiv.appendChild(oTargetTable);

	this.initializeHomeCellTabIndex(oTargetHomeCell);
	this.applyNeighbouringBorderStylesToHomeCell(pfMainOutput.firstChild.rows, pfHomeCellDiv);

};

/**
 * Given an element and its copy, add pointers between them and mark their slid.
 */
PinFreezeContainer.prototype.markAsCopy = function(main, copy, mainSlid, copySlid) {
	if(!main.pfCopy) {
		main.setAttribute("pfslid", mainSlid);
		main.pfCopy = [];
	}
	main.pfCopy.push(copy);
	copy.pfMain = main;
	copy.setAttribute("pfslid", copySlid);
};

/**
 * Given an element, the visible copied version of it, if one exists
 */
PinFreezeContainer.prototype.getCopy = function(element) {
	if(element.pfCopy) {
		var copies = {};
		for(var i in element.pfCopy) {
			var copy = element.pfCopy[i];
			if (copy.getAttribute) {
				var copySlid = copy.getAttribute("pfslid");
				if(copySlid) {
					var sectionName = PinFreezeContainer.getSectionNameFromSlid(copySlid);
					var copySection = this.getSection(sectionName);
					if(copySection && PinFreezeContainer.isSectionVisible(copySection)) {
						copies[sectionName] = copy;
					}
				}
			}
		}
		//Favour the home cell
		if(copies["pfHomeCell"]) {
			return copies["pfHomeCell"];
		}
		//If no home cell, return any copy arbitrarily
		for(i in copies) {
			return copies[i];
		}
	}
	return null;
};

/**
 * Given an element, return the original it is a copy of, if it is a copy
 */
PinFreezeContainer.prototype.getMain = function(element) {
	if(element.pfMain) {
		return element.pfMain;
	}
	return null;
};

/**
 * Return whether the given section is visible to the user
 */
PinFreezeContainer.isSectionVisible = function(section) {
	var node = section;
	if (!node) {
		return false;	//A section that doesn't exist isn't visible.
	}
	//Search for a parent with display: none. Limit the search
	//to within the container.
	//This is necessary for times when the row a section is in
	//is hidden, rather than the section itself.
	while(node.parentNode && !node.getAttribute("pfclid")) {
		if(node.style && node.style.display === "none") {
			return false;
		}
		node = node.parentNode;
	}

	return (!node.style || node.style.display !== "none");
};

/**
 * Returns an object representing whether side and top headings
 * are actually frozen right now.
 */
PinFreezeContainer.prototype.getSectionStructure = function() {
	var result = {
		isSideFrozen: false,
		isTopFrozen: false
	};

	if(this.m_freezeSide) {
		var side = this.getSection("pfSideHeadings");
		if(side) {
			result.isSideFrozen = PinFreezeContainer.isSectionVisible(side);
		}
	}

	if(this.m_freezeTop) {
		var top = this.getSection("pfTopHeadings");
		if(top) {
			result.isTopFrozen = PinFreezeContainer.isSectionVisible(top);
		}
	}

	return result;
};

/**
 * Compares the before and after section structures (returned from getSectionStructure)
 * and if there has been a change, informs the Viewer Widget.
 */
PinFreezeContainer.prototype.checkSectionStructureChange = function(before, after) {
	if(before.isSideFrozen !== after.isSideFrozen || before.isTopFrozen !== after.isTopFrozen) {
		this.m_pinFreezeManager.sectionStructureChange();
	}
};

/**
 * Given an object representing the full report, find the specific container
 * and complete sizing and layout to cause it to freeze.
 */
PinFreezeContainer.prototype.freezeContainerInReport = function(oReport) {
	this.cacheContainerAndSections(this.getContainerByLID(oReport));
	this.m_homeCellNodes = {};
	this.updateContainer();
};

/**
 * return true if frozen sections are actually required...
 * They are required when the width/height of the container is not large enough to present all the data
 */
PinFreezeContainer.prototype.frozenSectionsRequired = function() {
	return (this.frozenSideHeadingsRequired() || this.frozenTopHeadingsRequired());
};

PinFreezeContainer.prototype.frozenSideHeadingsRequired = function() {
	var pfMainOutput=this.getSection("pfMainOutput");
	if (pfMainOutput) {
		if (this.m_freezeSide) {
			var mainScrollWidth=pfMainOutput.scrollWidth;
			return ((this.m_clientWidth < mainScrollWidth) || mainScrollWidth==0);
		}
	}
	return false;
};

PinFreezeContainer.prototype.frozenTopHeadingsRequired = function() {
	var pfMainOutput=this.getSection("pfMainOutput");
	if (pfMainOutput) {
		if (this.m_freezeTop) {
			var mainScrollHeight=pfMainOutput.scrollHeight;
			return ((this.m_clientHeight < mainScrollHeight) || mainScrollHeight==0);
		}
	}
	return false;
};

/**
 * set the display state (true=visible, false=hidden) to the specified template part
 */
PinFreezeContainer.prototype.showTemplatePart = function(templatePartToChange, valueToSet) {
	var oTemplateRows=this.getContainer().rows;
	for (var r=0; r<oTemplateRows.length; ++r) {
		if (oTemplateRows[r].getAttribute("templatePart")===templatePartToChange) {
			oTemplateRows[r].style.display=((valueToSet) ? "" : "none");
		} else {
			var oTemplateCells=oTemplateRows[r].cells;
			for (var c=0; c<oTemplateCells.length; ++c) {
				if (oTemplateCells[c].getAttribute("templatePart")===templatePartToChange) {
					oTemplateCells[c].style.display=((valueToSet) ? "" : "none");
				}
			}
		}
	}
};

/**
 * For freeze both, if the report isn't wide enough to warrant side headings,
 * adjust sizes and scroll positions to reduce the output to a freezeTop.
 */
PinFreezeContainer.prototype.showFreezeTopOnly = function(pfMainOutput) {
	if (!(this.m_freezeTop && this.m_freezeSide)) {
		//This function applies to freeze both only (the freezeBoth template).
		return;
	}
	var newClientWidth=(pfMainOutput.scrollWidth==0) ? pfMainOutput.clientWidth : pfMainOutput.scrollWidth;
	this.updateMainOutputWidth(newClientWidth);
	this.setScrollX(pfMainOutput, 0);
	if (this.getSection("pfTopHeadings")) {
		this.getSection("pfTopHeadings").style.width=newClientWidth + 'px';
		this.setScrollX(this.getSection("pfTopHeadings"), 0);
	}
	//Hide the part of the template for the side headings.
	this.showTemplatePart("freezeSide", false);
};

/**
 * For freeze both, if the report isn't tall enough to warrant top headings,
 * adjust sizes and scroll positions to reduce the output to a freezeSide.
 */
PinFreezeContainer.prototype.showFreezeSideOnly = function(pfMainOutput) {
	if (!(this.m_freezeTop && this.m_freezeSide)) {
		//This function applies to freeze both only (the freezeBoth template).
		return;
	}
	var newClientHeight=(pfMainOutput.scrollHeight==0) ? pfMainOutput.clientHeight : pfMainOutput.scrollHeight;
	this.updateMainOutputHeight(newClientHeight);
	this.setScrollY(pfMainOutput, 0);
	if (this.getSection("pfSideHeadings")) {
		this.getSection("pfSideHeadings").style.height=newClientHeight + 'px';
		this.setScrollY(this.getSection("pfSideHeadings"),0);
	}
	//Hide the part of the template for the top headings.
	this.showTemplatePart("freezeTop", false);
};

/**
 * Show anything hidden by either showFreezeSideOnly or showFreezeTopOnly.
 */
PinFreezeContainer.prototype.showAll = function() {
	if (!(this.m_freezeTop && this.m_freezeSide)) {
		//This function applies to freeze both only (the freezeBoth template)
		return;
	}
	this.showTemplatePart("freezeTop", true);
	this.showTemplatePart("freezeSide", true);
};

/**
 * when its not warranted to show frozen sections, show only the main output
 * at the full client width.
 */
PinFreezeContainer.prototype.showMainOutputOnly = function(pfMainOutput) {
	//Hide sections when the report is not wide enough to need a scrollbar or frozen sections.
	this.updateMainOutputWidth((pfMainOutput.scrollWidth==0) ? pfMainOutput.clientWidth : pfMainOutput.scrollWidth);
	this.updateMainOutputHeight((pfMainOutput.scrollHeight==0) ? pfMainOutput.clientHeight : pfMainOutput.scrollHeight);
	this.setInitialScrollPosition(pfMainOutput, 0, 0);
	if (this.m_freezeSide && this.m_freezeTop) {
		this.getSection("pfHomeCell").style.display='none';
	}
	if (this.m_freezeSide) {
		this.getSection("pfSideHeadings").style.display='none';
		this.getSection("pfHorizontalScrollBar").style.display='none';
	}
	if (this.m_freezeTop) {
		this.getSection("pfTopHeadings").style.display='none';
		this.getSection("pfVerticalScrollBar").style.display='none';
	}
};

/**
 * return the inherited white-space css style of this element
 * to determine if cells are set to nowrap.
 */
PinFreezeContainer.prototype.getWrap = function(el){
	if (el.currentStyle) { //IE
		return el.currentStyle.whiteSpace;
	} else if (window.getComputedStyle) { //Firefox
		return window.getComputedStyle(el, null).getPropertyValue("white-space");
	} else { //try and get inline style
		return el.style.whiteSpace;
	}
};

/**
 * return true if this headings section has been created.
 */
PinFreezeContainer.prototype.headingsCreated = function(headingsDiv) {
	return headingsDiv.firstChild ? true : false;
};

/**
 * Given the containing table object (the "pfContainer"), complete sizing, scrolling and layout tweeks to cause
 * it to produce the freeze effect.
 */
PinFreezeContainer.prototype.updateContainer = function() {
	var pfMainOutput=this.getSection("pfMainOutput");
	var realHomeCell= this.getMainOutputHomeCell();
	if (realHomeCell) {
		//In some situations such as publish...only the client size (ie: size including headings) is known.
		//In this case, the scrollableSize may be set the same as the entire size or not set at all.
		//For this case, initialize a sensible scrollable size so that the result is not taller/wider than expected.
		if (this.m_scrollableClientHeight===this.m_clientHeight || !this.m_scrollableClientHeight) {
			this.m_scrollableClientHeight-=realHomeCell.offsetHeight;
			//to improve rendering in case  when  m_scrollableClientHeight less then calculated
			var minScrollableClientHeight = this.calculateMinCrossTabScrollableClientHeight();
			if (minScrollableClientHeight > this.m_scrollableClientHeight){
				 this.m_scrollableClientHeight = minScrollableClientHeight;
			}
		}
		if (this.m_scrollableClientWidth===this.m_clientWidth || !this.m_scrollableClientWidth) {
			this.m_scrollableClientWidth-=this.getHomeCellOffsetWidth(realHomeCell);
		}
	}

	if (pfMainOutput && realHomeCell) {
		//Set the size of the scroll region for the actual cells.
		this.showAll();

		if (this.frozenSectionsRequired()) {
			this.updateMainOutputSize();
			//Initialize the real home cell so that its
			//tabIndex is removed when it is not visible
			this.initializeHomeCellTabIndex(realHomeCell);
			if (this.m_freezeSide) {
				var pfSideHeadings=this.getSection("pfSideHeadings");
				if (!this.headingsCreated(pfSideHeadings)) {
					this.createSideHeadings(this.m_cachedBaseContainer);
					if (this.m_freezeTop) {
						//When freezing side headings and NOT top headings, the main output
						//needs to scroll left and right but the side headings are totally fixed.
						//When freezing both, the side headings need to scroll (up and down)
						this.initializeTouchScrolling(pfSideHeadings);
					}
				}
				var pfHorizontalScrollBar = this.getSection("pfHorizontalScrollBar");
				pfHorizontalScrollBar.scrollLeft = "0px";
			}
			if (this.m_freezeTop) {
				var pfTopHeadings=this.getSection("pfTopHeadings");
				if (!this.headingsCreated(pfTopHeadings)) {
					this.createTopHeadings(this.m_cachedBaseContainer);
					//When freezing top headings and NOT side headings, the main output
					//needs to scroll up and down but the top headings are totally fixed.
					//When freezing both, the top headings need to scroll (left and right)
					if (this.m_freezeSide) {
						this.initializeTouchScrolling(pfTopHeadings);
					}
				}
				var pfVerticalScrollBar = this.getSection("pfVerticalScrollBar");
				pfVerticalScrollBar.scrollTop = "0px";
			}
			if (this.m_freezeSide && this.m_freezeTop) {
				//When both side and top headings are frozen, populate the home cell.
				var pfHomeCell=this.getSection("pfHomeCell");
				if (!this.headingsCreated(pfHomeCell)) {
					this.createHomeCellHeading();
				}
				pfHomeCell.style.display='';
			}
			var sideHeadingSectionWidth=this.updateSideHeadingSize(realHomeCell);
			var topHeadingSectionHeight=this.updateTopHeadingSize(realHomeCell);
			if (!this.frozenSectionsRequired()) {
				this.showMainOutputOnly(pfMainOutput);
			}
			this.setInitialScrollPosition(pfMainOutput, sideHeadingSectionWidth, topHeadingSectionHeight);
			if (this.m_freezeTop && this.m_freezeSide) {
				this.setInitialScrollPosition(this.getSection("pfSideHeadings"), 0, topHeadingSectionHeight);
				this.setInitialScrollPosition(this.getSection("pfTopHeadings"), sideHeadingSectionWidth, 0);
			}
			this.initializeTouchScrolling(pfMainOutput);
		} else {
			this.showMainOutputOnly(pfMainOutput);
			this.removeTouchScrolling();
		}
		this.updateTabIndexValues();
	}
};

PinFreezeContainer.prototype.calculateMinCrossTabScrollableClientHeight = function() {
//calculate minCrossTabScrollableClientHeight in case if pinFreezeInfo wasn't calculated properly in CI published dashboard
//pfMainOutput is "pfMainOutput"
	var retVal = 0;
	if (this.m_cachedPFContainer) {
		var oSectionTable = this.getElementByLID(this.m_cachedPFContainer, "table", this.m_lid + this.m_viewerId);
		if (oSectionTable) {
			var dataCells = 0;
			for (var r=0; r<oSectionTable.rows.length; r++) {
				var row = oSectionTable.rows[r];
				for (var c=0; c<row.cells.length; c++) {
					var cell =  row.cells[c];
					if (cell.getAttribute("type") == "datavalue") {
						dataCells ++;
						if ( cell.childNodes.length === 1 && cell.childNodes[0].getAttribute && cell.childNodes[0].getAttribute("class") === "textItem"){
							retVal = retVal + cell.offsetHeight;
						} else {
							//may have embeded chart, then min height will be based on fix value
							dataCells ++;
							var pfVerticalScrollBar = this.getSection("pfVerticalScrollBar");
							if (pfVerticalScrollBar) {
								//using scroll bar's  width for fix value rather then hardcoded value
								retVal = pfVerticalScrollBar.offsetWidth*2;
							}
							
						}
						break;
					}
				}
				if (dataCells >= 2){
					break;
				}
			}
		}
	}
	return retVal;
};

/**
 * update sizes of the side headings and horizontal scrollbar.
 * Return the width of the side headings.
 */
PinFreezeContainer.prototype.updateSideHeadingSize = function(realHomeCell) {
	var sideHeadingSectionWidth=0;
	if (this.m_freezeSide) {
		var pfMainOutput=this.getSection("pfMainOutput");
		if (!pfMainOutput) {
			return 0;
		}
		if (!this.frozenSideHeadingsRequired()) {
			this.showFreezeTopOnly(pfMainOutput);
			return 0;
		}

		var pfSideHeadings=this.getSection("pfSideHeadings");
		sideHeadingSectionWidth=this.getSideHeadingSectionWidth(realHomeCell);
		var pfHorizontalScrollBar = this.getSection("pfHorizontalScrollBar");
		var sideHomeCell=this.getSectionHomeCell(pfSideHeadings);
		if (pfSideHeadings.style.display=='none') {
			pfSideHeadings.style.display='';
			pfHorizontalScrollBar.style.display='';
		}
		pfSideHeadings.style.width=sideHeadingSectionWidth + 'px';
		pfSideHeadings.style.height=pfMainOutput.clientHeight + 'px';
	}
	return sideHeadingSectionWidth;
};


/**
 * update sizes of the top headings and vertical scrollbar.
 * Return the height of the top headings.
 */
PinFreezeContainer.prototype.updateTopHeadingSize = function(realHomeCell) {
	var topHeadingSectionHeight=0;
	if (this.m_freezeTop) {
		var pfMainOutput=this.getSection("pfMainOutput");
		if (!pfMainOutput) {
			return 0;
		}
		if (!this.frozenTopHeadingsRequired()) {
			this.showFreezeSideOnly(pfMainOutput);
			return 0;
		}

		var pfTopHeadings=this.getSection("pfTopHeadings");
		topHeadingSectionHeight=this.getTopHeadingSectionHeight(realHomeCell);
		var pfVerticalScrollBar = this.getSection("pfVerticalScrollBar");
		var topHomeCell=this.getSectionHomeCell(pfTopHeadings);
		if (pfTopHeadings.style.display=='none') {
			pfTopHeadings.style.display='';
			pfVerticalScrollBar.style.display='';
		}
		pfTopHeadings.style.height=topHeadingSectionHeight + 'px';
		pfTopHeadings.style.width=pfMainOutput.clientWidth + 'px';
	}
	return topHeadingSectionHeight;
};

//Abstract scrollX...since scrollLeft is scrollRight in Bidi (can also be overridden for testing).
PinFreezeContainer.prototype.setScrollX = function(section, scrollX)
{
	if(getElementDirection(section) === "rtl") {
		setScrollRight(section, scrollX);
	} else {
		setScrollLeft(section, scrollX);
	}
};

PinFreezeContainer.prototype.setScrollY = function(section, scrollY)
{
	section.scrollTop=scrollY;
};

PinFreezeContainer.prototype.setInitialScrollPosition = function(section, scrollX, scrollY)
{
	if(getElementDirection(section) === "rtl") {
		setScrollRight(section, scrollX);
	} else {
		setScrollLeft(section, scrollX);
	}

	section.scrollTop=scrollY;
};

/**
 * Get the visible width of the scroll region
 */
PinFreezeContainer.prototype.getScrollableClientWidth = function() {
	return this.m_scrollableClientWidth;
};


PinFreezeContainer.prototype.setScrollableClientWidth = function(width) {
	this.m_scrollableClientWidth = width;
};

PinFreezeContainer.prototype.getContainerWidth = function() {
	return this.m_addedFixedWidth ? this.m_addedFixedWidth : this.m_clientWidth;
};

PinFreezeContainer.prototype.getClientWidth = function() {
	return this.m_clientWidth;
};

/**
 * Get the visible height of the scroll region
 */
PinFreezeContainer.prototype.getScrollableClientHeight = function() {
	return this.m_scrollableClientHeight;
};

PinFreezeContainer.prototype.setScrollableClientHeight = function(height) {
	this.m_scrollableClientHeight = height;
};

PinFreezeContainer.prototype.getClientHeight = function() {
	return this.m_clientHeight;
};

/**
 * This function returns the clientHeight of a dom element.
 * The function can be used (and overriden) for testing in place of accessing the read-only member.
 */
PinFreezeContainer.prototype.clientHeight = function(domEl) {
	return domEl.clientHeight;
};

/**
 * When freezing top headings, determine an appropriate height for the container
 * that considers other elements on the page (like page navigation links, footers, headers etc.)
 */
PinFreezeContainer.prototype.findBestContainerHeight = function(visibleHeightOfWidget) {
	if (this.m_freezeTop && this.m_cachedReportDiv) {
		var oRVContent = this.m_cachedReportDiv.parentNode;
		if (oRVContent) {
			var restOfPageHeight = this._findRestOfPageHeight(this.getContainer());

			return visibleHeightOfWidget - restOfPageHeight - (this.c_pageMargin / 2) - this.m_containerMargin.top; //Page margin is approximately 2 scrollbars
		}
	}

	return visibleHeightOfWidget - this.c_pageMargin;
};

PinFreezeContainer.prototype.findBestContainerWidth = function(visibleWidth) {
	var node = this.getContainer();

	while (node && node.nodeName.toLowerCase() != 'td' && node.getAttribute("id") != ("mainViewerTable" + this.m_viewerId)) {
		node = node.parentNode;
	}
	
	if (!node) {
		return -1;
	}

	if (node.nodeName.toLowerCase() == 'td') {
		var restOfWidth = 0;
		var childNodes = node.parentNode.childNodes;
		for (var i=0; i < childNodes.length; i++) {
			if (childNodes[i] !== node) {
				restOfWidth += childNodes[i].clientWidth;
			}
		}
		
		return visibleWidth - restOfWidth  - (this.c_pageMargin / 2); //Page margin is approximately 2 scrollbars
	}
	
	
	return visibleWidth;
};

/**
 * Starting from the container walk up the DOM until we reach the main Viewer table. Anytime
 * there are multiple siblings, get the height of the non-container sibligns (nav links, toolbars, titles, ...) so that we know how much room
 * the container actually has left.
 */
PinFreezeContainer.prototype._findRestOfPageHeight = function(node) {
	var restOfPageHeight = 0;
	var parentNode = node.parentNode;
	if (!parentNode) {
		return restOfPageHeight;
	}
	
	if (parentNode.childNodes.length > 1) {
		for (var i=0; i < parentNode.childNodes.length; i++) {
			var childNode = parentNode.childNodes[i];
			if (childNode != node && !isNaN(childNode.clientHeight) && childNode.style.display != "none") {
				restOfPageHeight += this.clientHeight(childNode);
			}
		}
	}
	
	// Keep going until we reach the main Viewer table
	if (node.getAttribute("id") != ("mainViewerTable" + this.m_viewerId)) {
		restOfPageHeight += this._findRestOfPageHeight(parentNode);
	}
	
	return restOfPageHeight;
};


/**
 * resize the rendered container to width/height
 */
PinFreezeContainer.prototype.resize = function(width, height, parentContainer, childContainerInfo) {
	if (this.m_fixedWidth && this.m_fixedHeight) {
		return;
	}
	width=(this.m_fixedWidth) ? this.m_fixedWidth : width;
	height=(this.m_fixedHeight) ? this.m_fixedHeight : height;

	var initialSectionStructure = this.getSectionStructure();

	if (this.m_sectionCache && this.m_cachedPFContainer) {
		var bestContainerHeight = 0;
		if (height !== 0) {
			bestContainerHeight = this.findBestContainerHeight(height);
			
			// If we're a nested container, don't let our height get smaller then 300
			if (parentContainer && bestContainerHeight < 300) {
				bestContainerHeight = 300;
			}
			else if (bestContainerHeight < 100) {
				// Anything under 100px is useless, so make sure we're not freezing to a size smaller then that
				bestContainerHeight = 100;
			}
		} 
		this.m_clientHeight = bestContainerHeight > 0 ? bestContainerHeight : this.m_clientHeight;
		
		var bestContainerWidth = 0;
		if (width !== 0) {
			bestContainerWidth = this.findBestContainerWidth(width);
		}

		// We'd sometimes get the browser scrollbars showing up in IE. Back off the width a little (-5) so that we never get them.
		this.m_clientWidth  = (bestContainerWidth > 0) ? bestContainerWidth - 5 - (this.c_pageMargin / 2) : this.m_clientWidth;

		var pfMainOutput=this.getSection("pfMainOutput");
		var realHomeCell= this.getSectionHomeCell(pfMainOutput);
		if (realHomeCell) {
			this.m_scrollableClientWidth=this.m_clientWidth-this.getSideHeadingSectionWidth(realHomeCell);
			this.m_scrollableClientHeight=this.m_clientHeight-realHomeCell.offsetHeight;
		}

		if (childContainerInfo) {
			// If we have a frozen child, then find the matching div's parent table and set the height. This is needed
			// to make sure the parents containers columns line up correctly
			var childContainerNodes = getElementsByAttribute(this.m_cachedPFContainer, "div", "pflid", childContainerInfo.lid);
			if (childContainerNodes) {
				var node = childContainerNodes[0];
				while (node.nodeName.toLowerCase() != 'table') {
					node = node.parentNode;
				}
				node.style.width = childContainerInfo.width + "px";
			}
		}
		
		this.updateContainer();
	} else {
		this.m_clientWidth=width - this.c_pageMargin;
		this.m_clientHeight=height - this.c_pageMargin;
	}

	var finalSectionStructure = this.getSectionStructure();
	this.checkSectionStructureChange(initialSectionStructure, finalSectionStructure);
};

/**
 * Size the main output section (which is used as the master).
 * Size the scroll bars which are associated with it as well.
 */

PinFreezeContainer.prototype.updateMainOutputSize = function()
{
	if (this.m_freezeSide && this.m_freezeTop) {
		if (this.frozenSideHeadingsRequired()) {
			this.updateMainOutputWidth(this.getScrollableClientWidth());
		}
		if (this.frozenTopHeadingsRequired()) {
			this.updateMainOutputHeight(this.getScrollableClientHeight());
		}
	} else if (this.m_freezeSide) {
		this.updateMainOutputWidth(this.getScrollableClientWidth());
	} else if (this.m_freezeTop) {
		this.updateMainOutputHeight(this.getScrollableClientHeight());
	}
};

/**
 * When side headings are frozen, the scrolling width of the main output and horizontal scrollbar must be set on resize
 */
PinFreezeContainer.prototype.updateMainOutputWidth = function(clientWidth)
{
	var pfMainOutput= this.getSection("pfMainOutput");
	if (!pfMainOutput) {
		return;
	}

	//Set the side scrolling limit of the data
	if (this.m_freezeSide==true) {
		pfMainOutput.style.width=(clientWidth + 'px');
		if (this.m_freezeTop==false || !this.frozenTopHeadingsRequired()) {
			 //If there's no vertical scrollbar, the vertical size should match the entire height of the output.
			pfMainOutput.style.height=pfMainOutput.firstChild.clientHeight + 'px';
		}
		var pfHorizontalScrollBar = this.getSection("pfHorizontalScrollBar");
		if (pfHorizontalScrollBar) {
			pfHorizontalScrollBar.style.width=(clientWidth + 'px');
			var pfHorizontalScrollBarChild = pfHorizontalScrollBar.firstChild;
			if (pfHorizontalScrollBarChild) {
				var realHomeCell = this.getSectionHomeCell(pfMainOutput);
				var width = pfMainOutput.scrollWidth - this.getHomeCellOffsetWidth(realHomeCell);
				pfHorizontalScrollBarChild.style.width = width + 'px';
			}
		}
	}
};

/**
 * When top headings are frozen, the scrolling height of the main output and scrollbar must be set on resize
 */
PinFreezeContainer.prototype.updateMainOutputHeight = function(clientHeight)
{
	var pfMainOutput= this.getSection("pfMainOutput");
	if (!pfMainOutput) {
		return;
	}

	//Set the top scrolling limit of the data
	pfMainOutput.style.height=(clientHeight + 'px');
	if (!this.m_freezeSide || !this.frozenSideHeadingsRequired()) {
		// If there's no horizontal scrollbar, the horizontal size should match the entire width of the output.
		// Give a little extra padding (+2) so that we don't clip the border of the list/crosstab 
		pfMainOutput.style.width=pfMainOutput.firstChild.clientWidth + 2 + 'px';
	}
	var pfVerticalScrollBar = this.getSection("pfVerticalScrollBar");
	if (pfVerticalScrollBar) {
		pfVerticalScrollBar.style.height=(clientHeight + 'px');
		var pfVerticalScrollBarChild = pfVerticalScrollBar.firstChild;
		if (pfVerticalScrollBarChild) {
			var realHomeCell = this.getSectionHomeCell(pfMainOutput);
			var height = pfMainOutput.scrollHeight - realHomeCell.offsetHeight;
			pfVerticalScrollBarChild.style.height = height + 'px';
		}
	}
};

/**
 * Given a node and a layout ID, find the first matching element.
 * Note: lid's should be unique in the base report.
 */
PinFreezeContainer.prototype.getElementByLID = function(oParent, tag, lid) {
	var oLIDArray = getElementsByAttribute(oParent, tag, "lid", lid);
	if (oLIDArray.length > 0) {
		return oLIDArray[0];
	}
	return null;
};

/**
 * use the pfclid to find the container
 */
PinFreezeContainer.prototype.getContainerByLID = function(oParent) {
	var opfLIDArray = getElementsByAttribute(oParent, "table", "pfclid", "pfContainer_" + this.m_lidNS);
	if (opfLIDArray.length > 0) {
		return opfLIDArray[0];
	}
	return null;
};

/**
 * use the pfslid to find the container section
 */
PinFreezeContainer.prototype.getSectionByLID = function(pfContainer, sectionName) {
	var opfLIDArray = getElementsByAttribute(pfContainer, "div", "pfslid", sectionName + "_" + this.m_lidNS);
	if (opfLIDArray.length > 0) {
		return opfLIDArray[0];
	}
	return null;
};

/**
 * Logic for extracting the section name from a slide
 */
PinFreezeContainer.getSectionNameFromSlid = function(slid) {
	return slid ? slid.split("_")[0] : null;
};

/**
 * Logic for extracting the lid from a slid
 */
PinFreezeContainer.getLidFromSlid = function(slid) {
	return slid.split("_")[1];
};

PinFreezeContainer.nodeToSlid = function(element) {
	while(element.parentNode && !element.getAttribute("pfslid")) {
		element = element.parentNode;
	}

	if(element.getAttribute) {
		return element.getAttribute("pfslid");
	}

	return null;
};

/**
 * add section DOM elements into the sectionCache associative array key is "pfMainOutput", "pfSideHeadings" etc... (pfslid up to the _)
 * When initialized, getSection() will cache the section objects for reuse.
 */
PinFreezeContainer.prototype.cacheContainerAndSections = function(pfContainer)
{
	if (!pfContainer) {
		return pfContainer;
	}
	
	this.m_cachedPFContainer=pfContainer;
	var opfLIDArray = getElementsByAttribute(this.m_cachedPFContainer, "div", "pflid", this.m_lidNS);
	this.m_sectionCache = {};
	for (var i=0; i<opfLIDArray.length; ++i) {
		var key=opfLIDArray[i].getAttribute("pfslid");
		key=key.split("_", 1);
		this.m_sectionCache[key]=opfLIDArray[i];
	}
	return pfContainer;
};

/**
 * return the cached DOM element for this container.
 */
PinFreezeContainer.prototype.getContainer = function() {
	return this.m_cachedPFContainer;
};

/**
 * return the section in this container with the matching key.
 */
PinFreezeContainer.prototype.getSection = function(key) {
	if (!this.m_sectionCache) {
		return null;
	}
	if (!this.m_sectionCache[key]) {
		this.m_sectionCache[key]=this.getSectionByLID(this.m_cachedPFContainer, key);
	}
	return this.m_sectionCache[key];
};

/**
 * Finds elements under the home cell with a tab index and records
 * them so that the tab index can be changed when the home cell is
 * hidden. (Necessary so that the user cannot tab to elements of the
 * DOM that we're hiding.)
 */
PinFreezeContainer.prototype.initializeHomeCellTabIndex = function(homeCell) {
	var slid = PinFreezeContainer.nodeToSlid(homeCell);
	if(!this.m_homeCellNodes[slid]) {
		var elements = getElementsByAttribute(homeCell, "*", "tabIndex", "*");
		for(var i in elements) {
			//Skip dijits
			if(!elements[i].getAttribute("widgetid")) {
				this.m_homeCellNodes[slid] = elements[i];
				break;
			}
		}
	}
};

PinFreezeContainer.prototype.updateTabIndexValues = function() {
	if(this.isContainerFrozen()) {
		for(var slid in this.m_homeCellNodes) {
			var tabIndex = this.m_pinFreezeManager.isNodeVisible(this.m_homeCellNodes[slid]) ? "0" : "-1";
			this.m_homeCellNodes[slid].setAttribute("tabIndex", tabIndex);
		}
	} else {
		for(var slid in this.m_homeCellNodes) {
			var tabIndex = (PinFreezeContainer.getSectionNameFromSlid(slid) === "pfMainOutput") ? "0" : "-1";
			this.m_homeCellNodes[slid].setAttribute("tabIndex", tabIndex);
		}
	}
};


/**
 * Find the home cell in the supplied section object (ie: could be the home cell in the side headings, top headings or main output).
 */
PinFreezeContainer.prototype.getSectionHomeCell = function(pfSection) {
	if (pfSection) {
		var oSectionTable=this.getElementByLID(pfSection, "table", this.m_lid + this.m_viewerId);
		if (oSectionTable && oSectionTable.rows.length && oSectionTable.rows[0].cells.length) {
			return oSectionTable.rows[0].cells[0];
		}
	}
	return null;
};

/**
 * Find the home cell in the main output.
 */
PinFreezeContainer.prototype.getMainOutputHomeCell = function() {
	//return the home cell from the main container (the one that scrolls)
	var pfMainOutput = this.getSection("pfMainOutput");
	if (!pfMainOutput) {
		pfMainOutput = this.getSectionByLID(this.m_cachedPFContainer, "pfMainOutput");
	}
	return this.getSectionHomeCell(pfMainOutput);
};

/**
 * find the position of oChild in oParent's element list
 * return -1 if oChild does not exist in the list.
 */
PinFreezeContainer.prototype.getChildPosition = function(oParent, oChild)
{
	for (var i=0; i<oParent.childNodes.length; ++i) {
		if (oParent.childNodes[i]==oChild) {
			return i;
		}
	}
	return -1;
};

/**
 * insert element oChild as a child of oParent at position nPosition in oParent's element list.
 */
PinFreezeContainer.prototype.insertAt = function(oParent, oChild, nPosition)
{
	if (nPosition==oParent.childNodes.length) {
		oParent.appendChild(oChild);
	} else {
		oParent.insertBefore(oChild, oParent.childNodes[nPosition]);
	}
};

/**
 * When a scroll event is received from a scroll bar, synchronize the main section to it.
 */
PinFreezeContainer.prototype.synchScroll = function()
{
	if (!this.m_cachedPFContainer) {
		return;
	}
	
	//keep scrolling between sections in synch....
	var realHomeCell= this.getMainOutputHomeCell();
	var pfMainOutput = this.getSection("pfMainOutput");
	var pfSideHeadings = this.getSection("pfSideHeadings");
	if (pfSideHeadings!=null) {
		var pfHorizontalScroll = this.getSection("pfHorizontalScrollBar");
		if (pfHorizontalScroll) {
			var offset = this.getSideHeadingSectionWidth(realHomeCell);
			if(getElementDirection(pfMainOutput) === "rtl") {
				offset = 0;
			}
			setScrollLeft(pfMainOutput, getScrollLeft(pfHorizontalScroll) + offset);
			if (this.m_freezeTop) {
				setScrollLeft(this.getSection("pfTopHeadings"), getScrollLeft(pfHorizontalScroll) + offset);
			}
		}
	}
};

/**
 * Accessibility: Update the scroll position of the appropriate sections
 * based on the node in focus (a child of a TD).
 * The main output, the corresponding scrollbar and, for freeze both, the corresponding heading
 * have to be scrolled.
 */
PinFreezeContainer.prototype.updateScroll = function(element) {
	var slid = PinFreezeContainer.nodeToSlid(element);
	if(!slid) {
		return;
	}

	var section = PinFreezeContainer.getSectionNameFromSlid(slid);
	if(!section) {
		return;
	}

	var oReportDiv = document.getElementById("CVReport" + this.m_viewerId);
	if (!oReportDiv) {
		return;
	}

	if (!this.m_cachedPFContainer) {
		return;
	}

	var parent = element.parentNode;
	if(parent) {
		var tagName = parent.tagName.toLowerCase();
		if(tagName === "td" || tagName === "th") {
			var realHomeCell= this.getMainOutputHomeCell();
			var pfMainOutput = this.getSection("pfMainOutput");

			if(section === "pfMainOutput" || section === "pfTopHeadings") {
				var pfHorizontalScroll = this.getSection( "pfHorizontalScrollBar");
				if (pfHorizontalScroll) {
					var scrollLeft = PinFreezeContainer.calculateNewPosition(
						parent.offsetLeft,
						parent.offsetWidth,
						getScrollLeft(pfMainOutput),
						pfMainOutput.offsetWidth
					);
					var offset = this.getHomeCellOffsetWidth(realHomeCell);
					if(getElementDirection(pfMainOutput) === "rtl") {
						offset = 0;
					}
					setScrollLeft(pfHorizontalScroll, scrollLeft - offset);
					setScrollLeft(pfMainOutput, scrollLeft);
				}
			}

			if(section === "pfMainOutput" || section === "pfSideHeadings") {
				var pfVerticalScroll = this.getSection("pfVerticalScrollBar");
				if (pfVerticalScroll) {
					var scrollTop = PinFreezeContainer.calculateNewPosition(
						parent.offsetTop,
						parent.offsetHeight,
						pfMainOutput.scrollTop,
						pfMainOutput.offsetHeight
					);

					pfVerticalScroll.scrollTop = scrollTop - realHomeCell.offsetHeight;
					pfMainOutput.scrollTop = scrollTop;
				}
			}
		}
	}
};

/**
 * Figure out the position of the node in focus (used for keyboard navigation to synch scroll bars and
 * sections).
 */
PinFreezeContainer.calculateNewPosition = function(cellPosition, cellSize, viewportPosition, viewportSize) {
	var cellFarPosition = cellPosition + cellSize;
	var viewportFarPosition = viewportPosition + viewportSize;

	if(viewportPosition > cellPosition) {
		//Cell scrolled off to the left/top
		return cellPosition;
	} else if(viewportFarPosition < cellFarPosition) {
		//Cell scrolled off to the right/bottom
		if(cellSize > viewportSize) {
			//Cell is too wide/tall - left/top-align
			return cellPosition;
		}
		return cellFarPosition - viewportSize;
	}

	return viewportPosition;
};

/**
 * When a scroll event is received from a scroll bar, synchronize the main section to it.
 */
PinFreezeContainer.prototype.synchVScroll = function()
{
	if (!this.m_cachedPFContainer) {
		return;
	}
	
	//keep scrolling between sections in synch....
	var realHomeCell= this.getMainOutputHomeCell();
	var pfMainOutput = this.getSection("pfMainOutput");
	var pfTopHeadings = this.getSection("pfTopHeadings");
	if (pfTopHeadings!=null) {
		var pfVerticalScroll = this.getSection("pfVerticalScrollBar");
		if (pfVerticalScroll) {
			pfMainOutput.scrollTop = pfVerticalScroll.scrollTop + this.getTopHeadingSectionHeight(realHomeCell);
			if (this.m_freezeSide) {
				this.getSection("pfSideHeadings").scrollTop=pfVerticalScroll.scrollTop + this.getTopHeadingSectionHeight(realHomeCell);
			}
		}
	}
};

/**
 * The total home cell height is the entire region occupied by the home cell
 * (its height plus its offset from its parent)
 */
PinFreezeContainer.prototype.getTopHeadingSectionHeight = function(oHomeCell)
{
	return oHomeCell.offsetHeight + oHomeCell.offsetTop + this.m_containerMargin.top;
};

/**
 * We can't simply take the first TD in the first row and thing it's the home cell. Some customers
 * hide the home cell and fill that spot with crosstab spacers - see Defect 35525. The only thing we know for sure,
 * is that the rowSpan on the first cell is correct. So if we grab the row after that and cross the TD's until we 
 * find a datavalue, that should give use the width of the 'home cell'.
 */
PinFreezeContainer.prototype._findBestGuessHomeCell = function(oHomeCell) {
	if (this.m_bestGuessHomeCell) {
		return this.m_bestGuessHomeCell;
	}
	
	if (oHomeCell) {
		var parent = oHomeCell.parentNode.parentNode;
		var rowSpan = oHomeCell.rowSpan ? (oHomeCell.rowSpan) : 1;
		
		var tr = parent.childNodes[rowSpan]; // TR where we'll find a datavalue
		
		if (tr) {
			var tdCount = tr.childNodes.length;
			var previousTd = null;
			var td = null;
			for (var i=0; i < tdCount; i++) {
				td = tr.childNodes[i];
				if (td.getAttribute("type") == "datavalue") {
					// We've found a datavalue. The previous TD is our home cell boundary
					break;
				}
				
				previousTd = td;
			}
			
			if (previousTd) {
				this.m_bestGuessHomeCell = previousTd;
				return this.m_bestGuessHomeCell;
			}
		}
		else {
			return oHomeCell;
		}
	}	
	
	return null;
};

/**
 * Offsetwidth of the home cell
 */
PinFreezeContainer.prototype.getHomeCellOffsetWidth = function(oHomeCell) {
	var bestGuessHomeCell = this._findBestGuessHomeCell(oHomeCell);
	
	return bestGuessHomeCell ?  bestGuessHomeCell.offsetWidth : 0;
};

/**
 * The total home cell width is the entire region occupied by the home cell
 * (its width plus its offset from its parent)
 */
PinFreezeContainer.prototype.getSideHeadingSectionWidth = function(oHomeCell)
{
	var bestGuessHomeCell = this._findBestGuessHomeCell(oHomeCell);
	if (bestGuessHomeCell) {
		return bestGuessHomeCell.offsetWidth + bestGuessHomeCell.offsetLeft + this.m_containerMargin.left;
	}
	else {
		return oHomeCell.offsetWidth + oHomeCell.offsetLeft;
	}
};

PinFreezeContainer.prototype.isContainerFrozen = function()
{
	return (this.m_freezeTop || this.m_freezeSide);
};

/**
 * Completely unfreeze the container.
 */
PinFreezeContainer.prototype.unfreeze = function(oReportDiv)
{
	var pfContainer=this.getContainerByLID(oReportDiv);
	this.m_freezeTop=false;
	this.m_freezeSide=false;
	if (pfContainer) {
		var oContainerParent=pfContainer.parentNode;
		pfMainOutput=this.getSectionByLID(pfContainer, "pfMainOutput");
		if (pfMainOutput && oContainerParent) {
			if (pfContainer.style.border!=="") {
				//Any borders that were transferred to the outer pfContainer should be transferred back on unfreeze.
				pfMainOutput.firstChild.style.border=pfContainer.style.border;
				pfContainer.style.border="";
			}
			if(this.m_wrapFlag){
				//undo the whitespace style which was set by advance setting "ADVANCED_PROPERTY_FREEZE_DEFAULT_WRAP"
				var spanElements=pfMainOutput.firstChild.getElementsByTagName("span");
				if(spanElements) {
					for (var k=0; k < spanElements.length; k++) {
						spanElements[k].style.whiteSpace = "";
					}
				}
				this.m_wrapFlag=false;
			}
			this.updateTabIndexValues();
			
			if (this.m_cachedBaseContainer.getAttribute("authoredFixedWidth")) {
				this.m_cachedBaseContainer.removeAttribute("authoredFixedWidth");
				this.m_cachedBaseContainer.style.width = "auto";
				this.m_addedFixedWidth = null;
			}
			
			if (this.m_cachedBaseContainer.getAttribute("authoredFixedHeight")) {
				this.m_cachedBaseContainer.removeAttribute("authoredFixedHeight");
				this.m_cachedBaseContainer.style.height = "auto";
				this.m_addedFixedHeight = null;
			}

			oContainerParent.replaceChild(this.m_pinFreezeManager.deepCloneNode(pfMainOutput.firstChild), pfContainer);
		}
	}
};

/**
 * Get all information about a particular border...one of  "left, right, top, bottom"
 * @param el
 * @param whichBorder
 * @returns
 */
PinFreezeContainer.prototype.getBorderInfo = function(el, whichBorder) {
	var cssBorderStyle = {};

	var baseCSSBorderProp="border-" + whichBorder + "-";
	var baseJsCSSBorderProp="border" + whichBorder.charAt(0).toUpperCase() + whichBorder.substring(1);
	if (el.currentStyle) { //IE
		cssBorderStyle[baseJsCSSBorderProp + "Width"] = el.currentStyle[baseJsCSSBorderProp + "Width"];
		cssBorderStyle[baseJsCSSBorderProp + "Style"] = el.currentStyle[baseJsCSSBorderProp + "Style"];
		cssBorderStyle[baseJsCSSBorderProp + "Color"] = el.currentStyle[baseJsCSSBorderProp + "Color"];
	} else if (window.getComputedStyle) { //Firefox
		cssBorderStyle[baseJsCSSBorderProp + "Width"] = window.getComputedStyle(el,null).getPropertyValue(baseCSSBorderProp + "width");
		cssBorderStyle[baseJsCSSBorderProp + "Style"] = window.getComputedStyle(el,null).getPropertyValue(baseCSSBorderProp + "style");
		cssBorderStyle[baseJsCSSBorderProp + "Color"] = window.getComputedStyle(el,null).getPropertyValue(baseCSSBorderProp + "color");
	} else {
		return null;
	}

	return cssBorderStyle;
};

PinFreezeContainer.prototype.isA11yEnabled = function(oxTab) {
	return (oxTab.getAttribute("role") === "grid");
};

PinFreezeContainer.isElementInMainOutput = function(element) {
	var section=PinFreezeContainer.nodeToSlid(element);
	if (section) {
		return (section.indexOf("pfMainOutput_") === 0);
	}
	return false;
};

/**
 * Remove the ctx attribute from an element and its descendants.
 */
PinFreezeContainer.prototype.removeCTX= function(element) {
	element.removeAttribute("ctx");
	var elements = getElementsByAttribute(element, "*", "ctx", "*");
	if(elements && elements.length) {
		for(var i = 0; i < elements.length; i++) {
			elements[i].removeAttribute("ctx");
		}
	}
};

/**
 * Set up the event handlers to support touch scrolling for Frozen headings.
 */
PinFreezeContainer.prototype.initializeTouchScrolling = function(pfSection) {
	if (!this.m_pinFreezeManager.isIWidgetMobile())
		return;
	
	if (pfSection) {
		pfSection.m_pinFreezeContainer = this;
		if (document.attachEvent)
		{
			pfSection.attachEvent("touchstart", this.touchStart);
			pfSection.attachEvent("touchmove", this.touchMove);
			pfSection.attachEvent("touchend", this.touchEnd);
		} else {
			pfSection.addEventListener('touchstart', this.touchStart, false);
			pfSection.addEventListener('touchmove', this.touchMove, false);
			pfSection.addEventListener('touchend', this.touchEnd, false);
		}
	}
};

PinFreezeContainer.prototype.removeTouchScrolling = function() {
	if (!this.m_pinFreezeManager.isIWidgetMobile())
		return;

	this.removeTouchScrollingEvents(this.getSection("pfMainOutput"));
	this.removeTouchScrollingEvents(this.getSection("pfSideHeadings"));
	this.removeTouchScrollingEvents(this.getSection("pfTopHeadings"));
};

/**
 * Remove event handlers to support touch scrolling for Frozen headings.
 */
PinFreezeContainer.prototype.removeTouchScrollingEvents = function(pfSection) {
	if (!this.m_pinFreezeManager.isIWidgetMobile())
		return;

	if (pfSection) {
		if (document.detachEvent)
		{
			pfSection.detachEvent("touchstart", this.touchStart);
			pfSection.detachEvent("touchmove", this.touchMove);
			pfSection.detachEvent("touchend", this.touchEnd);
		} else {
			pfSection.removeEventListener('touchstart', this.touchStart, false);
			pfSection.removeEventListener('touchmove', this.touchMove, false);
			pfSection.removeEventListener('touchend', this.touchEnd, false);
		}
	}
};

/**
 * Process a touch move event captured by either main output or a heading div
 */
PinFreezeContainer.prototype.touchMove = function(e) {
	  //To support standard pinch/zoom, ignore all but single finger touch moves (e.touches.length==1).
	  if (this.m_pinFreezeContainer && e && e.changedTouches && e.touches && e.touches.length == 1) {
		  var touchobj = e.changedTouches[0]; // reference first touch point for this event
		  if (touchobj && touchobj.clientX && touchobj.clientY) {
			  var touchCurrentX=parseInt(touchobj.clientX);
			  var touchCurrentY=parseInt(touchobj.clientY);
			  if (this.m_pinFreezeContainer.touchMoveHandler(touchCurrentX, touchCurrentY)) {
				  return stopEventBubble(e);
			  }
		  }
	  }
};

/**
 * Process a touch start event to initialize a "start point" for touch move.
 */
PinFreezeContainer.prototype.touchStart = function(e) {
	  if (this.m_pinFreezeContainer && e && e.changedTouches && e.touches && e.touches.length == 1) {
		  var touchobj = e.changedTouches[0]; // reference first touch point for this event
		  if (touchobj && touchobj.clientX && touchobj.clientY) {
			  var touchCurrentX=parseInt(touchobj.clientX);
			  var touchCurrentY=parseInt(touchobj.clientY);
			  this.m_pinFreezeContainer.touchStartHandler(touchCurrentX, touchCurrentY);
		  }
	  }
};

/**
 * Process a touch start event to initialize a "start point" for touch move.
 */
PinFreezeContainer.prototype.touchStartHandler = function(touchCurrentX, touchCurrentY) {
	this.touchScrollSections=false;	//This will be set to true only after the first move has been processed.
	this.touchPreviousX=touchCurrentX;
	this.touchPreviousY=touchCurrentY;
};

/**
 * stop the touchEnd event bubble if this move was handled by the frozen container.
 */
PinFreezeContainer.prototype.touchEnd = function(e) {
	if (this.m_pinFreezeContainer && this.m_pinFreezeContainer.touchEndHandler()) {
		stopEventBubble(e);
	}
};

PinFreezeContainer.prototype.touchEndHandler = function() {
	var wasScrolling=this.touchScrollSections;
	this.touchScrollSections=false;
	this.touchPreviousX=-1;
	this.touchPreviousY=-1;
	return wasScrolling;
};

/**
 * Similar to synchScroll but for touch events.
 * Set the Top and Left scroll positions of corresponding section s
 * based on the delta between this event and the last one processed (saved as touchPreviousX, touchPreviousY).
 * 
 * Don't allow scrolling to go below "width/height" of the home cell.
 */
PinFreezeContainer.prototype.touchMoveHandler = function(touchCurrentX, touchCurrentY) {
	var pfMainOutput=this.getSection("pfMainOutput");
	if (!pfMainOutput)
		return;

	var oHomeCell=this.getSectionHomeCell(pfMainOutput)
	var topHeadingSectionHeight=this.getTopHeadingSectionHeight(oHomeCell);
	var sideHeadingSectionWidth = this.getSideHeadingSectionWidth(oHomeCell);
	var disty =  touchCurrentY - this.touchPreviousY;
	var distx =  touchCurrentX - this.touchPreviousX;
	
	//touchScrollSections will be true when at least one "in bounds" move event has been processed.
	if (this.touchScrollSections) {
		if (disty != 0) {
			//Scroll output/side headings down or up (stop scrolling up at the top of the data cells).
			var newScrollTop=pfMainOutput.scrollTop - disty;
			newScrollTop = (newScrollTop > topHeadingSectionHeight) ? newScrollTop : topHeadingSectionHeight;
			pfMainOutput.scrollTop=newScrollTop;
			var pfSideHeadings = this.getSection("pfSideHeadings");
			if (pfSideHeadings) {
				pfSideHeadings.scrollTop=newScrollTop;
			}
		}
		if (distx != 0) {
			//Scroll output/Left headings left or right (stop scrolling up at the leftmost data cells).
			var newScrollLeft=pfMainOutput.scrollLeft - distx;
			newScrollLeft=(newScrollLeft > sideHeadingSectionWidth) ? newScrollLeft : sideHeadingSectionWidth; 
			pfMainOutput.scrollLeft=newScrollLeft;
			var pfTopHeadings = this.getSection("pfTopHeadings");
			if (pfTopHeadings) {
				pfTopHeadings.scrollLeft=newScrollLeft;
			}
		}
	} else {
		this.firstTouchMove(pfMainOutput, distx, disty, sideHeadingSectionWidth, topHeadingSectionHeight);
	}
	this.touchPreviousX=touchCurrentX;
	this.touchPreviousY=touchCurrentY;
	return this.touchScrollSections;
};

/**
 *  The first move event (after the touch start) should either start touchMove scrolling of the frozen sections
 *  or delegate the move if moving is "out of bounds" (eg: beyond the left/right or top/bottom scroll limits)
 */
PinFreezeContainer.prototype.firstTouchMove = function(pfMainOutput, distx, disty, sideHeadingSectionWidth, topHeadingSectionHeight) {
	var vertical = this.mostlyVerticalTouchMove(distx, disty);	//Determine the general direction of the move.
	var hasTopHeadings=PinFreezeContainer.isSectionVisible(this.getSection("pfTopHeadings"));
	var hasSideHeadings=PinFreezeContainer.isSectionVisible(this.getSection("pfSideHeadings"));
	if (vertical && 
		(!hasTopHeadings || 
		 (disty > 0 && pfMainOutput.scrollTop<=topHeadingSectionHeight) ||
		 (disty < 0 && pfMainOutput.scrollTop+pfMainOutput.clientHeight>=pfMainOutput.scrollHeight))) {
		this.touchScrollSections=false;
	} else if (!vertical && 
		 (!hasSideHeadings || 
		 (distx > 0 && pfMainOutput.scrollLeft<=sideHeadingSectionWidth) ||
		 (distx < 0 && pfMainOutput.scrollLeft+pfMainOutput.clientWidth>=pfMainOutput.scrollWidth))) {
		this.touchScrollSections=false;
	} else {
		this.touchScrollSections=true;
	}
};

/**
 * Return true if this is mostly a vertical touch move.
 * Return false if this is a mostly horizontal touch move.
 */
PinFreezeContainer.prototype.mostlyVerticalTouchMove = function(distX, distY) {
	var totalX = (distX>0) ? distX: 0-distX;
	var totalY = (distY>0) ? distY: 0-distY;
	return (totalY > totalX);
};

PinFreezeContainer.prototype.destroy = function() {
	this.removeTouchScrolling();
	
	GUtil.destroyProperties(this);
};
