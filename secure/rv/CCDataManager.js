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
CCDManager -- Report Viewer class which manages Context Data supplied by RSVP in JSON format
*/

// Constructor
function CCDManager(cv) {
	this.m_cd = null;
	this.m_md = null;
	this.m_oCV = null;
	this.m_dataItemInfo = null;
}


// Set functions
CCDManager.prototype.SetContextData = function(CD) {
	if (this.m_cd)
	{
		this.m_cd = null;
	}

	this.m_cd = CD;
};

CCDManager.prototype.SetMetadata = function(MD) {
	if (this.m_md)
	{
		this.m_md = null;
	}

	this.m_md = MD;
};

CCDManager.prototype.AddContextData = function(CD) {
	if (!this.m_cd) {
		this.m_cd = CD;
	} else {
		// Add additional context data
		for (var i in CD) {
			this.m_cd[i] = CD[i];
		}
	}
};

CCDManager.prototype.AddMetadata = function(MD) {
	if (!this.m_md) {
		this.m_md = MD;
	} else {
		// Add additional metadata
		for (var j in MD) {
			this.m_md[j] = MD[j];
		}
	}
};

/**
 * Returns a cloned copy of the metadata array
 */
CCDManager.prototype.getClonedMetadataArray = function() {
	var clone = {};
	applyJSONProperties(clone, this.m_md);
	return clone;
};

/**
 * Returns a clones copy of the context data array
 */
CCDManager.prototype.getClonedContextdataArray = function() {
	var clone = {};
	applyJSONProperties(clone, this.m_cd);
	return clone;
};

CCDManager.prototype.SetCognosViewer = function(viewer) {
	if (viewer) {
		this.m_oCV = viewer;
	}
};


CCDManager.prototype.onComplete_GetCDRequest = function(asynchDataResponse, callback) {
	if (asynchDataResponse) {
		var dataResponse = asynchDataResponse.getResult();
		var xmlResponse = XMLBuilderLoadXMLFromString(dataResponse);
		if (xmlResponse) {
			var allBlocks = xmlResponse.getElementsByTagName("Block");
			for (var i = 0; i < allBlocks.length; i++)	{
				var sContext = "";
				var blockNode = allBlocks[i].firstChild;
				while(blockNode)
				{
					sContext += blockNode.nodeValue;
					blockNode = blockNode.nextSibling;
				}

				var cd = eval('('+ sContext +')');
				this.AddContextData(cd);
			}
		}
	}

	if (callback && typeof callback == "function") {
		callback();
	}
};

CCDManager.prototype.FetchContextData = function(ctxids, callback) {
	var missingCtxids = [];
	var c = null, ctxLen = ctxids.length;
	for (var i = 0; i < ctxLen; ++i ) {
		c = ctxids[i];
		if (c != "" && !this.ContextIdExists(c)) {
			missingCtxids.push(c);
		}
	}
	if (missingCtxids.length) {
		if (this.m_oCV) {
			this.getContextData(missingCtxids, callback);
		}
	}

	//Note that this is not the number fetched (they come back in blocks controlled by the
	//ContextBlockSize option), but rather the number of ctxids which did not have context info
	return missingCtxids.length;
};

CCDManager.prototype.getContextData = function(ctxids, callback)
{
	var oCV = this.m_oCV;

	var asynchRequest = new AsynchDataDispatcherEntry(oCV);
	asynchRequest.setCanBeQueued(false);

	if (!oCV.isBux) {
		asynchRequest.forceSynchronous();
	}

	var form = document["formWarpRequest" + oCV.getId()];
	var conversation = oCV.getConversation();

	var tracking = oCV.getTracking();
	if (!tracking && form && form["m_tracking"] && form["m_tracking"].value) {
		tracking = form["m_tracking"].value;
	}
	
	// In fragments we don't put a 'blocker' over the report after doing a request,
	// so it's possible we trying to do a getContext after a report type request (forward, next page, ...)
	// has been sent. That causes an error since you can't have two requests on the same conversation ID. 
	// Fix for 11732: Prompts report throws DPR-ERR-2022 error when executed in a multipage portlet
	if (oCV.m_viewerFragment) {
		var activeRequest = oCV.getActiveRequest();
		if (activeRequest && activeRequest.getFormField("m_tracking") == tracking) {
			return;
		}
	}
	
	var oCallbacks = {customArguments: [callback],
			"complete" : {"object" : this, "method" : this.onComplete_GetCDRequest}
	};
	//Override the prompting callback if the current staus is "prompting"
	if(oCV.getStatus() == 'prompting'){
		oCallbacks["prompting"] = {"object" : this, "method" : this.onComplete_GetCDRequest};
	}	
	asynchRequest.setCallbacks(oCallbacks);	
	if (conversation && oCV.envParams["ui.action"] != 'view') {
		asynchRequest.addFormField("ui.action", "getContext");
		asynchRequest.addFormField("ui.conversation", conversation);
	} else {		
		var uiObject = form["ui.object"];
		if (typeof uiObject.length != 'undefined' && uiObject.length >1) {
			asynchRequest.addFormField("ui.object", form["ui.object"][0].value);
		} else {
			asynchRequest.addFormField("ui.object", form["ui.object"].value);
		}
		asynchRequest.addFormField("ui.action", "getObjectContext");
	}

	asynchRequest.addFormField("cv.responseFormat", "asynchDetailContext");
	asynchRequest.addFormField("context.format", "initializer");
	asynchRequest.addFormField("context.type", "reportService");
	asynchRequest.addFormField("context.selection", ctxids.join(','));
	asynchRequest.addNonEmptyStringFormField("m_tracking", tracking);

	oCV.dispatchRequest(asynchRequest);
};


// Existential Tests
CCDManager.prototype.ContextIdExists = function(ctxid) {
	return (this.m_cd && this.m_cd[ctxid]?true:false);
};

CCDManager.prototype.HasContextData = function() {
	return (this.m_cd ? true:false);
};

CCDManager.prototype.HasMetadata = function() {
	return (this.m_md ? true:false);
};


// Access Functions
CCDManager.prototype._getMDPropertyFromCD = function(ctxid, sCdProp, sMdProp) {
	var p = null;
	this.FetchContextData([ctxid]);
	var cd = this.m_cd && this.m_cd[ctxid];
	if (cd) {
		var md = this.m_md[ cd[sCdProp] ];
		if (md) {
			p = md[sMdProp];
		}
	}
	return p;
};

// Properties Derived from Reference Data Item
CCDManager.prototype.GetDrillFlag = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'r', 'drill');
};

CCDManager.prototype.getModelPathFromBookletItem = function(bookletId) {
	var mp = null;
	var md = this.m_md[bookletId];
	if (md) {
		mp = md.mp;
		if (mp && this.m_md[mp]) {
			mp = this.m_md[mp].mp;
		}
	}
	
	return mp ? mp : null;
};

CCDManager.prototype.GetBookletModelBasedDrillThru = function(bookletId) {
	var p = null;
	var md = this.m_md[bookletId];
	if (md) {
		p = md.modelBasedDrillThru;
	}
	
	return p ? p : 0;
};

CCDManager.prototype.GetDrillFlagForMember = function(ctxid) {
	// Return the correct drill flag for members only
	var drillFlag = null;
	var d = this._getMDPropertyFromCD(ctxid, 'r', 'drill');
	if (d !== null && this.m_cd[ctxid].m) {
		drillFlag = d;
	}
	return drillFlag;
};

CCDManager.prototype.GetDataType = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'r', 'dtype');
};

CCDManager.prototype.GetUsage = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'r', 'usage');
};

CCDManager.prototype.GetHUN = function(ctxid) {
	var hun = this._getMDPropertyFromCD(ctxid, 'h', 'h');
	if (!hun) {
		var h = this._getMDPropertyFromCD(ctxid, 'r', 'h');
		if (h) {
			hun = this.m_md[h].h;
		}

	}
	if (hun!=null && hun.indexOf("[__ns_")==0 ) {
		/* Query Framework will occasionally  return a HUN from a temporary namespace it uses for internal processing.
		 * To avoid downstream problems with this, any HUN that begins with  the [__ns_ prefix is removed here.
		 * QFW has been notified and should attempt to eliminate this situation.
		 */
		hun = null;
	}
	return hun;
};

CCDManager.prototype.GetQuery = function(ctxid) {
	var qry = null;
	var q = this._getMDPropertyFromCD(ctxid, 'r', 'q');
	if (q) {
		qry = this.m_md[q].q;
	}
	return qry;
};

CCDManager.prototype.GetDepth = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'r', 'level');
};


//Properties Derived from Context Data
CCDManager.prototype.GetDisplayValue = function(ctxid) {
	var useVal = null;
	this.FetchContextData([ctxid]);
	if (this.ContextIdExists(ctxid) && this.m_cd[ctxid]) {
		useVal = this.m_cd[ctxid].u;
	}
	return useVal;
};

CCDManager.prototype.GetPUN = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'p', 'p');
};

CCDManager.prototype.GetLUN = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'l', 'l');
};

CCDManager.prototype.GetMUN = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'm', 'm');
};

CCDManager.prototype.GetDUN = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'd', 'd');
};

CCDManager.prototype.GetQMID = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'i', 'i');
};

CCDManager.prototype.GetRDIValue = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'r', 'r');
};

/**
 * Get Booklet Item value
 */
CCDManager.prototype.GetBIValue = function(ctxid) {
	return this._getMDPropertyFromCD(ctxid, 'r', 'bi');
};



CCDManager.prototype.getContextIdForMetaData = function(lun, hun, bIgnoreDrillFlag )
{
	var metaArray = [ {"expression": lun, "type":"l"},{"expression": hun, "type" :"h"} ];

	for(var index = 0; index < metaArray.length; ++index)
	{
		var sMetaItem = metaArray[index].expression;
		var sType = metaArray[index].type;

		if(sMetaItem == "")
		{
			continue;
		}

		for(var metaDataItem in this.m_md)
		{
			if(this.m_md[metaDataItem][sType] == sMetaItem)
			{
				for(var refDataItem in this.m_md)
				{
					if(this.m_md[refDataItem].r && this.m_md[refDataItem][sType] == metaDataItem)
					{
						if(this.m_md[refDataItem].drill != 0 || bIgnoreDrillFlag == true)
						{
							for(var ctx in this.m_cd)
							{
								if(this.m_cd[ctx].r == refDataItem && this.m_cd[ctx].m)
								{
									return ctx;
								}
							}
						}
					}
				}
			}
		}
	}

	return "";
};


// Get Context id given a MUN - these methods assume that the context ids are available.
CCDManager.prototype.GetContextIdForMUN = function(mun) {
	var mdIndex = null;
	var ctxid = null;
	// Find the mun in the metadata
	for (var i in this.m_md) {
		if (this.m_md[i].m == mun) {
			mdIndex = i;
			break;
		}
	}
	if (mdIndex != null) {
		for (var j in this.m_cd) {
			if (this.m_cd[j].m == mdIndex) {
				ctxid = j;
				break;
			}
		}
	}
	return ctxid;
};

// Get Context ids with a given RDI (may be more than 1) - these methods assume that the context ids are available.
CCDManager.prototype.GetContextIdsForRDI = function(rdi) {
	var ctxids = [];
	// Find the mun in the metadata
	for (var i in this.m_md) {
		if (this.m_md[i].r == rdi) {
			ctxids.push(i);
		}
	}
	return ctxids;
};

CCDManager.prototype.getMUNForRDIAndUseValue = function(rdi, useValue) {
	var ctxids = this.GetContextIdsForRDI(rdi);
	
	for (var i in this.m_cd) {
		for (var j in ctxids) {
			if (this.m_cd[i].r == ctxids[j] && this.m_cd[i].u == useValue) {
				var munId = this.m_cd[i].m;
				if (munId) {
					return this.m_md[munId].m;
				}
			}
		}
	}
	
	return null;
};


// Return, if applicable, the min/max values CURRENTLY IN THE CONTEXT TABLE for this rdi
CCDManager.prototype.GetPageMinMaxForRDI = function(rdi) {
	var pageMin=null;
	var pageMax=null;
	var ctxids = this.GetContextIdsForRDI(rdi);

	//TODO: Until we know all context data has been fetched previously, we need
	//		to fetch it here to guarantee that we have the full page of data.
	this.FetchContextData([0]);

	for (var i in this.m_cd) {
		for (var j in ctxids) {
			if (this.m_cd[i].r == ctxids[j]) {
				var currentFloatValue = parseFloat(this.m_cd[i].u);
				if (currentFloatValue == this.m_cd[i].u) {
					if ( pageMin == null || currentFloatValue < pageMin) {
						pageMin = currentFloatValue;
					}
					if ( pageMax == null || currentFloatValue > pageMax) {
						pageMax = currentFloatValue;
					}
				}
			}
		}
	}

	if (pageMin != null && pageMax != null) {
		return eval('({ pageMin: ' + pageMin +', pageMax: ' + pageMax + '})');
	}
};

// Get Context id given a display value
CCDManager.prototype.GetContextIdForDisplayValue = function(value) {
	var ctxid = null;
	for (var i in this.m_cd) {
		if (this.m_cd[i].u == value) {
			ctxid = i;
			break;
		}
	}
	return ctxid;
};

// Get Context id given a use value
CCDManager.prototype.GetContextIdForUseValue = function(value) {
	var mdIndex = null;
	var mdValueType = null;
	var ctxid = null;
	// Find the value in the metadata
	for (var i in this.m_md) {
		var md = this.m_md[i];
		for (var j in md) {
			if (md[j] == value) {
				mdIndex = i;
				mdValueType = j;
				break;
			}
		}
	}

	if (mdIndex != null) {
		for (var k in this.m_cd) {
			if (this.m_cd[k][mdValueType] == mdIndex) {
				ctxid = k;
				break;
			}
		}
	}
	return ctxid;
};

CCDManager.prototype.getDataItemInfo = function() {
	if (this.m_cd) {
		var rdiCount = {};
		this.m_dataItemInfo = {};

		for (var i in this.m_cd) {
			var rdiKey=this.m_cd[i].r;
			if (typeof rdiKey != "undefined") {
				var diName = this.m_md[rdiKey].r;
				if (this.m_dataItemInfo[diName]==null) {
					this.m_dataItemInfo[diName] = 1;
				} else {
					this.m_dataItemInfo[diName]++;
				}
			}
		}
		return CViewerCommon.toJSON(this.m_dataItemInfo);
	}
	return "";
};

//Dump the contents of the metadata table as a JSON string.
CCDManager.prototype.DataItemInfoToJSON = function() {
	return this.getDataItemInfo();
};

// Dump the contents of the metadata table as a JSON string.
CCDManager.prototype.MetadataToJSON = function() {
	if (this.m_md) {
		return CViewerCommon.toJSON(this.m_md);
	}
	return "";
};

// Dump the contents of the context data table as a JSON string.
CCDManager.prototype.ContextDataToJSON = function() {
	if (this.m_cd) {
		return CViewerCommon.toJSON(this.m_cd);
	}
	return "";
};

// Dump the contents of A SUBSET of the context data table as a JSON string.
CCDManager.prototype.ContextDataSubsetToJSON = function(maxValuesPerRDI) {
	if (maxValuesPerRDI<=0) {
		return this.ContextDataToJSON();
	}
	if (this.m_cd) {
		var rdiCount = {};
		var cdSubset = {};

		for (var i in this.m_cd) {
			var rdiKey=this.m_cd[i].r;
			if (typeof rdiKey != "undefined") {
				if (rdiCount[rdiKey]==null) {
					rdiCount[rdiKey]=0;
				} else {
					rdiCount[rdiKey]++;
				}
				if (rdiCount[rdiKey] < maxValuesPerRDI) {
					cdSubset[i]=this.m_cd[i];
				}
			}
		}
		return CViewerCommon.toJSON(cdSubset);
	}
	return "";
};

// Get HUN with a given RDI and queryName
CCDManager.prototype.GetHUNForRDI = function(rdi, queryNameId) {

	// Find the mun in the metadata
	for (var i in this.m_md) {
		if (this.m_md[i].r == rdi && this.m_md[i].q == queryNameId) {
			var hunId = this.m_md[i].h;
			if( hunId )
			{
				return this.m_md[hunId].h;
			}
		}
	}
	return null;
};

// Get Context ids with a given queryname
CCDManager.prototype.GetMetadataIdForQueryName = function(queryName) {

	for (var i in this.m_md) {
		if (this.m_md[i].q === queryName) {
			return i;
		}
	}
	return null;
};

CCDManager.prototype._isEmptyObject = function(obj) {

	for (var property in obj) {
		return false;
	}
	return true;
};

CCDManager.prototype.isMetadataEmpty = function() {
	if (this.m_md) {
		return this._isEmptyObject(this.m_md);
	}
	return true;
};

CCDManager.prototype.GetBestPossibleItemName = function(ctxId) {
	var item = this.m_cd[ctxId];

	if (!item) {
		return null;
	}

	if (item.l && this.m_md[item.l].l) {
		//Level Unique Name
		return this._getStringInLastBracket( this.m_md[item.l].l );
	}
	if (item.r && this.m_md[item.r].r) {
		//Reference to Data Item
		return this._getStringInLastBracket( this.m_md[item.r].r );
	}
	if (item.h && this.m_md[item.h].h) {
		//Hierarchy Unique Name
		return this._getStringInLastBracket( this.m_md[item.h].h );
	}
	if (item.i && this.m_md[item.i].i) {
		//Query Model ID
		return this._getStringInLastBracket( this.m_md[item.i].i );
	}
	return null;
};

CCDManager.prototype.GetBestPossibleDimensionMeasureName = function(ctxId) {
	var item = this.m_cd[ctxId];

	if (item && item.m && this.m_md[item.m] && this.m_md[item.m].m) {
		//Member Unique Name
		return this._getStringInLastBracket( this.m_md[item.m].m );
	}
	return null;
};

CCDManager.prototype._getStringInLastBracket = function(str) {

	if (str && str.indexOf('].[') >0) {
		var splitedStr = str.split('].[');
		var lastString = splitedStr[splitedStr.length-1];
		return lastString.substring(0, lastString.length-1); //remove ']' at the end
	}
	return str;
};

/**
 * update member unique name with the current namespace (cube name)that is from the same shared TM1 dimension
 * */
CCDManager.prototype._replaceNamespaceForSharedTM1DimensionOnly = function(memberUniqueName){
	var oNSAndDIMToLookup = this._getNamespaceAndDimensionFromUniqueName(memberUniqueName);
	if(oNSAndDIMToLookup && this.m_md){
		for(var mdEntry in this.m_md){
			var sMun = this.m_md[mdEntry].m;
			if(sMun && sMun.length >0){
			if(sMun.indexOf("->:[TM].") > 0){
					var oObj = this._getNamespaceAndDimensionFromUniqueName(sMun);
					if(oObj.dimension && oObj.dimension === oNSAndDIMToLookup.dimension && oObj.namespace !== oNSAndDIMToLookup.namespace){
						var iFirstDotPos = memberUniqueName.indexOf(".");
						return oObj.namespace + memberUniqueName.substr(iFirstDotPos, memberUniqueName.length);
					}
				}else{
					var iArrowSymbolPos = sMun.indexOf("->:[");
					if(iArrowSymbolPos >0 ){
						if(sMun.substr(iArrowSymbolPos + 4, 4) !== "TM]."){
							return memberUniqueName;
						}
					}
				}
			}
		}
	}
 return memberUniqueName;
};

CCDManager.prototype._getNamespaceAndDimensionFromUniqueName = function(uniqueName){
		if(uniqueName && uniqueName.length > 0  && uniqueName.indexOf("].[") > 0){
				var aElements = uniqueName.split("].[");
				if(aElements.length > 1){
					return {"namespace" : aElements[0]+"]" , "dimension": "["+ aElements[1]+"]"};
				}
			}
	return null;
};

CCDManager.prototype.destroy = function(){
	delete this.m_cd;
	delete this.m_md;
	delete this.m_oCV;
	delete this.m_dataItemInfo;
};