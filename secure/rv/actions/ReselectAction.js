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

function ReselectAction(oCV, aSelectionFilterObjects) {
	this.m_aSelectionFilterObjects = aSelectionFilterObjects;
	this.m_oCV = oCV;
	
	this.m_oSC = oCV.getSelectionController();
	this.m_cd = this.m_oSC.getCCDManager().m_cd;
	this.m_md = this.m_oSC.getCCDManager().m_md;
	
	this.m_nReportDiv = oCV.getReportDiv();
	this.m_oRAPReportContainers = oCV.getRAPReportInfo().getContainers();
}

ReselectAction.prototype.executeAction = function()
{
	this.mapCdMd();
	if (this.show()) {
		//Send selection payload to Canvas to cache so that filtering onDrop 
		var oVW = this.m_oCV.getViewerWidget();
		if (oVW) {
			var selectionJson = oVW.m_oWidgetContextManager.genSelectionPayload(this.m_oCV, oVW.getWidgetId());
			oVW.setSelectionFilterSent(true);
			oVW.fireEvent("com.ibm.bux.data.filterCache.init", null, selectionJson);
			
			if (oVW.isPastedWidget() && !oVW.pastedSelectedBroadcasted) {
				oVW.pastedSelectedBroadcasted = true;
				oVW.onSelectionChange();
			}
		}
	}
};

ReselectAction.prototype.mapCdMd = function() {
	
	var aSerialzedSelections = this.m_aSelectionFilterObjects;
	
	for(var i in aSerialzedSelections) {
		var oSerializedJson = aSerialzedSelections[i];
		var oItem = oSerializedJson.selectedItem;
		var aCtx = [];
		
		var newCtx = null;
		var queryId = this._findMdIndex('q', oSerializedJson.query);

		newCtx = this._setNewCtx(oItem, queryId);
		if (newCtx) {
			aCtx.push(newCtx);
		} else {
			//stop process context of current item if first ctx is not found.
			continue;
		}

		for( var j in oSerializedJson.context) {
			var oContextItem = oSerializedJson.context[j];
			newCtx = this._setNewCtx(oContextItem, queryId);
			if (newCtx) {
				aCtx.push(newCtx);
			}
		}

		oSerializedJson.ctxArray = aCtx;
	}
};

ReselectAction.prototype._setNewCtx = function(oItem, queryId)
{
	var mdIndex = null;
	var ctxId = null;
	if(oItem.isMeasure === 'true') {
		mdIndex = this._findMdIndex(oItem.mdProperty, oItem.mdValue, queryId);
		
		if (mdIndex) {
			oItem.ctxRef = {'property':  oItem.mdProperty, 'mdIndex': mdIndex};
			return oItem.ctxRef;
		}
	} else {
		if(oItem.mun) {
			mdIndex = this._findMdIndex('m', oItem.mun, queryId);
			ctxId = this._getContextIdForCdProperty(queryId, 'm', mdIndex);
		} else {
			mdIndex = this._findMdIndex(oItem.mdProperty, oItem.mdValue, queryId);
			ctxId = this._getContextIdForCdPropertyAndMdProperty(queryId, 'u', oItem.use, oItem.mdProperty, mdIndex);
		}
		if (ctxId) {
			oItem.ctxId = ctxId;
			return oItem.ctxId;
		}
	}
	return null;
};

ReselectAction.prototype._getContextIdForCdProperty = function(queryId, cdProperty, cdValue) {
	var ctxid = null;
	for (var j in this.m_cd) {
		if (this.m_cd[j].q == queryId && this.m_cd[j][cdProperty] == cdValue) {
			ctxid = j;
			break;
		}
	}
	return ctxid;
};

ReselectAction.prototype._getContextIdForCdPropertyAndMdProperty = function(queryId, cdProperty, cdValue, mdProperty, mdIndex) {
	var ctxid = null;
	for (var j in this.m_cd) {
		if (this.m_cd[j].q == queryId && 
			this.m_cd[j][mdProperty] == mdIndex && this.m_cd[j][cdProperty] == cdValue) {
			ctxid = j;
			break;
		}
	}
	return ctxid;
};

/*
 * queryId optional
 */
ReselectAction.prototype._findMdIndex = function(mdProperty, value, queryId)
{
	var mdIndex = null;
	for(var j in this.m_md) {
		if(this.m_md[j][mdProperty] === value) {
			if (this.m_md[j]['q'] && queryId) { //if q exists and queryId is given
				if (this.m_md[j]['q'] == queryId) { //must be matching queryId
					mdIndex = j;
					break;
				}
			} else {
				mdIndex = j;
				break
			} 
		}
	}
	return mdIndex;
};
/**
 * If the selection filter object is a measure, it does not get reselected.
 */
ReselectAction.prototype.show = function()
{
	var foundMatch = false;
	var oCV = this.m_oCV;
	var oVW = oCV.getViewerWidget();
	var nReportDiv = oCV.getReportDiv();	
	var anContainers = null;
	var anCandidateCells = null; /* cell or chart element */
	var nContainerSearchRoot = null;
	
	oVW.preprocessPageClicked( false /*bInvokeContextMenu*/);
	
	if (oVW && nReportDiv) {
		
		for(var iSelectedObjectIdx in this.m_aSelectionFilterObjects) {
			var oSerializedJson = this.m_aSelectionFilterObjects[iSelectedObjectIdx];
			var selectedItemIsMeasure = (oSerializedJson.selectedItem.isMeasure === 'true') ;
			var bContainsOnlyMeasure = true;
			if( selectedItemIsMeasure ){
				var context = oSerializedJson.context;
				for( var idx in context ){
					if( context[idx].isMeasure !== 'true' ){
						bContainsOnlyMeasure = false;
						break;
					}
				}
				if( bContainsOnlyMeasure ){
					continue;
				}
			}

			var aCtx = oSerializedJson.ctxArray;

			if (aCtx && aCtx.length>0) {
				//get Layout node
				anContainers = this._getLayoutContainers(oSerializedJson.lid);
				var foundInContainer = false;
				for (var iContainerIdx = 0; !foundInContainer && iContainerIdx<anContainers.length ; iContainerIdx++) {
					
					if ( /img|IMG/.test(anContainers[iContainerIdx].tagName)) {
						//find map element
						var tmpElement = anContainers[iContainerIdx];
						for (nContainerSearchRoot = null; !nContainerSearchRoot && tmpElement.parentNode;) {
							tmpElement = tmpElement.parentNode;
							var childElements = tmpElement.getElementsByTagName('map');
							if (childElements && childElements.length>0) {
								nContainerSearchRoot = childElements[0];
							}
						}
					} else {
						nContainerSearchRoot = anContainers[iContainerIdx].parentNode; 
					}
					
					if (nContainerSearchRoot) {
						var queryRegEx = this._buildCtxQueryRegExp(aCtx);
						anCandidateCells = getElementsByAttribute( nContainerSearchRoot, "*", "ctx", null, -1, queryRegEx);
						var selectedItem = oSerializedJson.selectedItem;
						//Go through candiate cells and compare ctx
						for(var idx in anCandidateCells) {
							if (anCandidateCells[idx].getAttribute) {
								
								if( selectedItemIsMeasure && selectedItem.isDataValueOrChartElement === 'false' &&  
										(anCandidateCells[idx].getAttribute( 'type') === 'datavalue' ||
										 anCandidateCells[idx].getAttribute( 'type') === 'chartElement') ){
									continue;
								}
								
								if (this.isMatchingCell(aCtx, anCandidateCells[idx])) {
									var foundCell = anCandidateCells[idx];
									
									if (foundCell.tagName === 'SPAN' || foundCell.tagName === 'span') {
										var parentTag = foundCell.parentNode.tagName;
										if (parentTag == 'td' || parentTag == 'TD' || parentTag == 'TH'|| parentTag == 'th') {
											if (foundCell.parentNode.getAttribute('ctx') == foundCell.getAttribute('ctx')) {
												continue;
											}
										}
									}
									
									var evt = {'target': foundCell, 'button': 1, 'ctrlKey': true};
									this.m_oSC.pageClicked(evt);
									foundInContainer = true; //continue process candidate cells in same container
									foundMatch = true;
								}
							}
						}//candidate cells loop
					}
				}//containers loop
			}
			
		}
	}
	return foundMatch;
};

ReselectAction.prototype.isMatchingCell = function(aCtx, nCandidateCell)
{
	var cellCtx = nCandidateCell.getAttribute('ctx');
	if (!cellCtx || cellCtx.length == 0) {
		return false;
	}
	var aCandidateCellCtxIds = cellCtx.replace(/::/g, ":").split(":");
	var candidateCellCtxIdx = 0;
	var candidateCellCtxId = null;

	var sourceCtxIdx = 0;
	var sourceCtx = null;	

	var iCandiateCtxMatchingCount = 0;
	var bMatched = false;


	//Get first ctx of Candidate cell	
	for(; candidateCellCtxIdx < aCandidateCellCtxIds.length; candidateCellCtxIdx++) { //found non empty string
		if (aCandidateCellCtxIds[candidateCellCtxIdx].length >0) {
			candidateCellCtxId = aCandidateCellCtxIds[candidateCellCtxIdx++];
			break;
		}
	}		
	
	//First ctx is selected item itselt. It must match or be a same kind
	sourceCtx = aCtx[sourceCtxIdx];
	if (typeof sourceCtx == 'string') {
		if (sourceCtx == candidateCellCtxId) {
			iCandiateCtxMatchingCount++;
		}
	} else {
		if (this.m_cd[candidateCellCtxId][sourceCtx.property] == sourceCtx.mdIndex) {
			iCandiateCtxMatchingCount++;
		}
	}
	
	if (iCandiateCtxMatchingCount != 1) {  //First ctx must be found
		return false;
	} 
	
	if (aCtx.length == 1) {
		bMatched = true;
	}
	
	
	//Match context
	for (sourceCtxIdx = 1; !bMatched && sourceCtxIdx< aCtx.length; sourceCtxIdx++) {
				
		sourceCtx = aCtx[sourceCtxIdx];
		if (typeof sourceCtx == 'string') {
			
			//Go through candidate ctx and find match	
			for(candidateCellCtxIdx=1; candidateCellCtxIdx < aCandidateCellCtxIds.length; candidateCellCtxIdx++) { //found non empty string
				if (aCandidateCellCtxIds[candidateCellCtxIdx].length >0 && aCandidateCellCtxIds[candidateCellCtxIdx] != '0') {
					candidateCellCtxId = aCandidateCellCtxIds[candidateCellCtxIdx];
					
					if (sourceCtx == candidateCellCtxId) {
						iCandiateCtxMatchingCount++;
						aCandidateCellCtxIds[candidateCellCtxIdx] = '0'; //set '0' to matched ctx
						break;
					}
				}
			}
		} else {
			
			//Go through candidate ctx and find match	
			for(candidateCellCtxIdx=1; candidateCellCtxIdx < aCandidateCellCtxIds.length; candidateCellCtxIdx++) { //found non empty string
				if (aCandidateCellCtxIds[candidateCellCtxIdx].length >0 && aCandidateCellCtxIds[candidateCellCtxIdx ] != '0') {
					candidateCellCtxId = aCandidateCellCtxIds[candidateCellCtxIdx];
					
					if (this.m_cd[candidateCellCtxId][sourceCtx.property] == sourceCtx.mdIndex) {
						iCandiateCtxMatchingCount++;
						aCandidateCellCtxIds[candidateCellCtxIdx] = '0'; //set '0' to matched ctx
						break;
					}
				}
			}
		}
				
		if (aCtx.length == iCandiateCtxMatchingCount) {
				bMatched = true;
		}
	}
	
	return bMatched;
};

ReselectAction.prototype._buildCtxQueryRegExp = function(aCtx)
{
	var queryString = "";
	var bFoundStringContext = false;
	
	var i = 0; // First ctx is about itself
	if (typeof aCtx[i] == 'string') {
		queryString += '^' + aCtx[i]; //Start with: ^ctxId
	} else {
		queryString += '^[\\d:]+'; //Start with valid character 
	}

	//Find first String context
	i++;
	var contextPart = "";
	for ( ; !bFoundStringContext && i < aCtx.length; i++) {
		if (typeof aCtx[i] == 'string') {
			if (contextPart.length>0) {
				contextPart += '+';
			} 
			contextPart += aCtx[i] ; 
			bFoundStringContext = true;
		} else {
			if (i < aCtx.length-1) {
				if (contextPart.length>0) {
					contextPart += '+';
				} 
				contextPart += '[\\d:]';
			}
		}
	}
	
	if (contextPart.length>0) {
		queryString += ':{1,}' + contextPart ;
	}
	
	return new RegExp(queryString);
};

ReselectAction.prototype._getLayoutContainers = function(sLid)
{
	var queryString = "";
	if (this.m_oRAPReportContainers && this.m_oRAPReportContainers[sLid]) {
		queryString = sLid + '.+';
	} else {
		for (var name in this.m_oRAPReportContainers) {
			if (queryString.length>0) {
				queryString += '|';
			}
			queryString += name + '.+';
		}
	}
	return getElementsByAttribute(this.m_nReportDiv, "*", "lid", null, -1, new RegExp(queryString) );
};