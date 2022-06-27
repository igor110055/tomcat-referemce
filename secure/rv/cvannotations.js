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
/**
 * CognosViewerAnnotation constructor (base class for all annotation rules)
 * @constructor
 */
function CognosViewerAnnotation() {
	this.m_oCV = null;
}

/**
 * Sets the cognos viewer object (called by the action factory)
 * @param CCognosViewer object
 * @private
 */
CognosViewerAnnotation.prototype.setCognosViewer = function(oCV) {
	this.m_oCV = oCV;
};

/**
 * Returns an instance to the cognos viewer object
 * @return CCognosViewer object
 */
CognosViewerAnnotation.prototype.getCognosViewer = function() {
	return this.m_oCV;
};

/**
 * Override this function to determine whether or not the specific annotation
 * object is enabled.
 * @return boolean
 */
CognosViewerAnnotation.prototype.isEnabled = function(placeType) {};


CognosViewerAnnotation.prototype.areAnnotationsEnabled = function() {
	var widget = this.m_oCV.getViewerWidget();
	return widget.getAnnotationHelper().isEnabled();
};

/**
 * Override this function to get the base string name for the menu item
 * @return String
 */
CognosViewerAnnotation.prototype.getMenuItemBaseString = function(){
};

/**
 * Override this function to get the icon class name for the menu item
 * @return String
 */
CognosViewerAnnotation.prototype.getMenuItemIconClass = function(){
};


/**
 * Gets the current selections
 */
CognosViewerAnnotation.prototype.getSelections = function(){
	var selections = [];

	var viewer = this.getCognosViewer();
	if (viewer) {
		var selCon = viewer.getSelectionController();
		if (selCon) {
			selections = selCon.getSelections();
		}
	}

	return selections;
};

/**
 * Check if the widget has any annotation
 * @return boolean
 */
CognosViewerAnnotation.prototype.hasAnnotation = function(){
	var has = false;

	var viewer = this.getCognosViewer();
	if (viewer) {
		var widget = viewer.getViewerWidget();
		if (widget) {
			var store = widget.getAnnotationStore();
			if (store) {
				has = store.hasAnnotation();
			}
		}
	}

	return has;
};
function CognosViewerCellAnnotation(){}
CognosViewerCellAnnotation.prototype = new CognosViewerAnnotation();


/**
 * Concatenates the defult menu string with the selected object representation
 * @param defaultText - the default value when nothing is selected
 * @return String
 */
CognosViewerCellAnnotation.prototype.getMenuItemString = function(defaultText){
	var selText = defaultText;
	var selections = this.getSelections();
	if (selections && selections.length == 1) {
		var sel = selections[0];
		selText = sel.getDisplayValues()[0];
	}

	var text = this.getMenuItemBaseString();
	if (selText && selText.length > 0) {
		text += " - " + enforceTextDir(selText);
	}

	return text;
};



/**
 * Return true if selected cell has any annotations
 * @return boolean
 */
CognosViewerCellAnnotation.prototype.hasAnnotaionsOnSelectedCell = function(){

	var selections = this.getSelections();
	if (selections && selections.length == 1) {
		var cellRef = selections[0].getCellRef();
		var ctxId = this.getCognosViewer().findCtx(cellRef);
		var viewerWidget = this.getCognosViewer().getViewerWidget();
		if (viewerWidget) {
			var annotationStore = viewerWidget.getAnnotationStore();
			if (annotationStore) {
				var annotations = annotationStore.get(ctxId);
				if (annotations && annotations.length > 0) {
					return true;
				}
			}
		}
	}

	return false;
};

/**
 * Returns the changeable annotation for the current selection, or
 * null if there is no changeable annotation for the current selection.
 */
CognosViewerCellAnnotation.prototype.getChangeableAnnotation = function(){
	var selections = this.getSelections();
	if (selections && selections.length == 1) {
		var cellRef = selections[0].getCellRef();
		var ctxId = this.getCognosViewer().findCtx(cellRef);
		var viewerWidget = this.getCognosViewer().getViewerWidget();
		if (viewerWidget) {
			var annotationStore = viewerWidget.getAnnotationStore();
			if (annotationStore) {
				return annotationStore.getChangeableAnnotation(ctxId);
			}
		}
	}
	return null;
};

CognosViewerCellAnnotation.prototype.hasValidContextOnSelectedCell = function() {
	var selections = this.getSelections();
	if (selections && selections.length == 1) {
		var cellRef = selections[0].getCellRef();
		var ctxId = this.getCognosViewer().findCtx(cellRef);
		if (ctxId) {
			var ids = AnnotationCTXLookup.generateIDArrayFromCellCtxValue(ctxId);
			for (var i = 0; i < ids.length; i++) {
				var id = ids[i];
				if(id !== "*" && !(/^\d+$/).test(id)) {
					return false;
				}
			}
			return true;
		}
	}
	return false;
};

/*
 * New Annotation - Adds a new annotation where none previously exists
 */
function NewAnnotation() {}
NewAnnotation.prototype = new CognosViewerCellAnnotation();

/**
 * Return true if a cell is selected and the cell does not have new annotation already
 * @return boolean
 */
NewAnnotation.prototype.isEnabled = function(placeType) {
	return this.areAnnotationsEnabled() && (placeType!=='widgetActions') && this.hasValidContextOnSelectedCell();
};


/**
 * Return 'Add comment'
 * @return String
 */
NewAnnotation.prototype.getMenuItemBaseString = function(){
	return RV_RES.IDS_JS_ANNOTATION_NEW;
};

/**
 * Return 'NewAnnotation'
 * @return String
 */
NewAnnotation.prototype.getMenuItemIconClass = function(){
	return 'NewAnnotation';
};

/*
 * Edit Annotation - Change the value of an annotation which previously existed
 */
function EditAnnotation() {}
EditAnnotation.prototype = new CognosViewerCellAnnotation();

/**
 * Return true if selected cell has new annotation already
 * @return boolean
 */
EditAnnotation.prototype.isEnabled = function(placeType) {
	return this.areAnnotationsEnabled() && (placeType!=='widgetActions') && this.getChangeableAnnotation() !== null;
};

/**
 * Return 'Edit comment*'
 * @return String
 */
EditAnnotation.prototype.getMenuItemBaseString = function(){
	return RV_RES.IDS_JS_ANNOTATION_EDIT;
};

/**
 * Return 'EditAnnotation'
 * @return String
 */
EditAnnotation.prototype.getMenuItemIconClass = function(){
	return 'EditAnnotation';
};



/*
 * Delete Annotation - Remove a previously existing annotation
 */
function DeleteAnnotation() {}
DeleteAnnotation.prototype = new CognosViewerCellAnnotation();

DeleteAnnotation.prototype.isEnabled = function(placeType) {
	return this.areAnnotationsEnabled() && (placeType!=='widgetActions') && this.getChangeableAnnotation() !== null;
};

DeleteAnnotation.prototype.getMenuItemString = function(defaultText){
	return this.getMenuItemBaseString();
};

DeleteAnnotation.prototype.getMenuItemBaseString = function(){
	return RV_RES.IDS_JS_ANNOTATION_DELETE;
};

DeleteAnnotation.prototype.getMenuItemIconClass = function(){
	return 'DeleteAnnotation';
};

function CognosViewerWidgetAnnotation(){}
CognosViewerWidgetAnnotation.prototype = new CognosViewerAnnotation();

CognosViewerWidgetAnnotation.prototype.getMenuItemString = function(){
	var widgetText = this.getCognosViewer().getViewerWidget().getDisplayName();

	var text = this.getMenuItemBaseString();

	if (widgetText && widgetText.length > 0) {
		widgetText = enforceTextDir(widgetText);
		text += " - " + widgetText;
	}

	return text;
};

CognosViewerWidgetAnnotation.prototype.hasWidgetLevelAnnotations = function(){
	var hasAnnotations = false;
	var viewerWidget = this.getCognosViewer().getViewerWidget();

	if (viewerWidget) {
		var annotationStore = viewerWidget.getAnnotationStore();
		var widgetAnnotations = annotationStore.get(annotationStore.WIDGET_CONTEXT);
		if (widgetAnnotations && widgetAnnotations.length > 0) {
			hasAnnotations = true;
		}
	}

	return hasAnnotations;
};

CognosViewerWidgetAnnotation.prototype.getWidgetLevelChangeableAnnotation = function(){
	var viewerWidget = this.getCognosViewer().getViewerWidget();
	if (viewerWidget) {
		var annotationStore = viewerWidget.getAnnotationStore();
		if (annotationStore) {
			return annotationStore.getChangeableAnnotation(annotationStore.WIDGET_CONTEXT);
		}
	}
	return null;
};

/*
 * Currently we allow widget annotations of the selection count is not 1
 */
CognosViewerWidgetAnnotation.prototype.hasValidSelection = function(placeType) {
	var selectionController = this.m_oCV.getSelectionController();
	var selections = selectionController.getSelections();
	var chartItemSelected = false;
	if(selectionController.hasSelectedChartNodes()) {
		chartItemSelected = (selectionController.getSelectedChartNodes()[0].m_contextIds.length > 0);
	}

	return (placeType==='widgetActions') || (selections.length != 1 && !chartItemSelected);

};

/*
 * New Widget Annotation - Adds a new annotation to the widget where none previously existed
 */
function NewWidgetAnnotation() {}
NewWidgetAnnotation.prototype = new CognosViewerWidgetAnnotation();

/**
 * Return true if there is no new annotation on widget level and cell is not selected
 * @return boolean
 */
NewWidgetAnnotation.prototype.isEnabled = function(placeType) {
	return this.areAnnotationsEnabled() && (placeType!=='contextMenu') && this.hasValidSelection(placeType);
};


/**
 * Return'Add comment'
 * @return String
 */
NewWidgetAnnotation.prototype.getMenuItemBaseString = function(){
	return RV_RES.IDS_JS_WIDGET_ANNOTATION_NEW;
};

/**
 * Return 'NewWidgetAnnotation'
 * @return String
 */
NewWidgetAnnotation.prototype.getMenuItemIconClass = function(){
	return 'NewWidgetAnnotation';
};

/*
 * Edit Widget Annotation - Change the value of an annotation which previously existed on the widget
 */
function EditWidgetAnnotation() {}
EditWidgetAnnotation.prototype = new CognosViewerWidgetAnnotation();

/**
 * Return true if there is new annotation on widget level and cell is not selected
 * @return boolean
 */
EditWidgetAnnotation.prototype.isEnabled = function(placeType) {
	return (this.areAnnotationsEnabled() &&(placeType!=='contextMenu') && this.hasValidSelection(placeType) && this.getWidgetLevelChangeableAnnotation()) ? true : false;
};

/**
 * Return 'Edit comment*'
 * @return String
 */
EditWidgetAnnotation.prototype.getMenuItemBaseString = function(){
	return RV_RES.IDS_JS_WIDGET_ANNOTATION_EDIT;
};

EditWidgetAnnotation.prototype.getMenuItemIconClass = function(){
	return 'EditWidgetAnnotation';
};


/*
 * Delete Widget Annotation - Remove previously existing annotations from the widget
 */
function DeleteWidgetAnnotation() {}
DeleteWidgetAnnotation.prototype = new CognosViewerWidgetAnnotation();

DeleteWidgetAnnotation.prototype.isEnabled = function(placeType) {
	return (this.areAnnotationsEnabled() &&(placeType!=='contextMenu') && this.hasValidSelection(placeType) && this.getWidgetLevelChangeableAnnotation()) ? true : false;
}

DeleteWidgetAnnotation.prototype.getMenuItemBaseString = function(){
	return RV_RES.IDS_JS_WIDGET_ANNOTATION_DELETE;
};

DeleteWidgetAnnotation.prototype.getMenuItemIconClass = function(){
	return 'DeleteWidgetAnnotation';
};

/**
 * AnnotationCTXLookup
 * @constructor
 */
function AnnotationCTXLookup(ccdManager) {
	this.m_ccdManager = ccdManager;
	this.m_md = this.m_ccdManager.m_md;
	this.m_cd = this.m_ccdManager.m_cd;

	this.m_RDIVALUE_KEY = 'annotationHook';
	this.m_oContextDetailsMap = {};
}

/**
 * Populate a map which relates each individual context ID referenced in the annotation array to their backing details (like rdi, modelItem, usage)
 * @param annotationArray array
 * @public
 */
AnnotationCTXLookup.prototype.populateCtxDetailsForAllAnnotations = function(annotationArray) {

	for (var i = 0, len = annotationArray.length; i < len; i++) {
		var anno = annotationArray[i];
		var ctx = anno.ctx;

		if (ctx) {
			this._populateCtxDetailsForOneCtxValue(ctx);
		}
	}
};

/**
 * Extracts Ids from ctxValue string, go through each id, and populate ctx detail
 * @param ctxValue string Examples: 1, *, 1:2:3, 4::5::6, *::2:3::5:8, and so on
 * @private
 */
AnnotationCTXLookup.prototype._populateCtxDetailsForOneCtxValue = function(ctxValue) {
	if(ctxValue) {
		var ctxIDs = this.generateIDArrayFromCellCtxValue(ctxValue);
		for (var i = 0, len = ctxIDs.length; i < len; i++) {
			var id = ctxIDs[i];
			this._populateCtxDetailsForOneId(id);
		}
	}
};

/**
 * Generates string array of ctx Ids which appears in ctxValue string.
 * @param ctxValue string Examples: 1, *, 1:2:3, 4::5::6, *::2:3::5:8, and so on
 * @private
 */
AnnotationCTXLookup.generateIDArrayFromCellCtxValue = function(ctxValue) {
	if (ctxValue) {
		return ctxValue.replace(/::/g, ':').split(':');
	}
	return null;
};

AnnotationCTXLookup.prototype.generateIDArrayFromCellCtxValue = AnnotationCTXLookup.generateIDArrayFromCellCtxValue;

/**
 * Populates ctx detail of id passed if it is numeric value
 * @param id string - numeric value or '*'
 * @private
 */
AnnotationCTXLookup.prototype._populateCtxDetailsForOneId = function(id) {
	if (id.match(/\*/)) {
		return;
	}

	//check if exists
	var detail = this.m_oContextDetailsMap[id];
	if(detail) {
		return; //already populated, just return.
	} else {
		detail = {};
		var contextData = this.m_cd[id];

		if(contextData) {
			if (contextData.u) { detail['u'] = contextData.u; }
			if (contextData.r) {
				detail['r'] = contextData.r;

				var metadata = this.m_md[contextData.r];
				if(metadata) {
					if (metadata.usage!== 'undefined') {
						detail['usage'] = metadata.usage;
					}
				
					if (metadata.dtype) {
						detail.dtype = metadata.dtype;						
					}
				}
			}
			this._populateRdiValueInDetail(detail, id);

			this.m_oContextDetailsMap[id] = detail;
		}
	}
};

/*
 * Utility function to index into the metadata. Return null if key(s) do not exist.
 * key1 indexes into the provided context data to find the metadata entries,
 * and key2 indexes to pull out one of those entries.
 * key1 and key2 are often the same value, so if key2 is omitted, it is assumed to
 * be key1.
 * For examples of keys, see the context data and metadata in Viewer.
 */
AnnotationCTXLookup.prototype._getMDValue = function(item, key1, key2) {
	if(typeof key2 == 'undefined') {
		//It is a common operation to use the same key twice
		key2 = key1;
	}
	if (typeof item[key1] != 'undefined' && typeof this.m_md[item[key1]][key2] != 'undefined') {
		return this.m_md[item[key1]][key2];
	}
	return null;
};

/*
 * Given a set of keys, where each key may provide a meaningful value in the
 * metadata, iterate through them until one does indeed provide a meaningful
 * value.
 */
AnnotationCTXLookup.prototype._findMDValue = function(item, aKeys) {
	//Iterate over keys in order of descending precedence.
	for(var i = 0; i < aKeys.length; i++) {
		var value = this._getMDValue(item, aKeys[i]);
		if(value !== null) {
			return value;
		}
	}
	return null;
};

/**
 * Populates RdiValue value which annotation service would select for ctx id to detail object
 * @param id string - numeric value or '*'
 * @private
 */
AnnotationCTXLookup.prototype._populateRdiValueInDetail = function(detail, id) {
	var item = this.m_cd[id];
	var aKeys = [];

	var oRdi = {};

	//Version 1 annotations don't differentiate between measures and non-measures
	oRdi[1] = this._findMDValue(item, ["l", "h", "i", "r"]);


	//Version 2 annotation differentiate depending on whether the value is a measure or not
	if (this._getMDValue(item, "r", "usage") == 2) {
		//Measure
		oRdi[2] = this._findMDValue(item, ["i", "m", "r"]);
	}

	detail[this.m_RDIVALUE_KEY] = oRdi;
};

/**
 * Returns ctx detail by id
 * @param id string
 * @private
 */
AnnotationCTXLookup.prototype.getDetail = function(id) {
	if (!id) {
		return null;
	}
	return this.m_oContextDetailsMap[id];
};

/**
 * Returns true if id and annoFirstId is same numeric value.
 * Returns true if rdi-value of id's ctx detail is same as annoRDI when annoFirstId is '*'.
 * @param annoFirstId string - numeric value or '*'
 * @param annoRDI string
 * @param id string
 * @private
 */
AnnotationCTXLookup.prototype.isAnnotatedId = function(annoFirstId, annotation, id) {
	if (!annoFirstId || !id) {
		return false;
	}

	if (annoFirstId.match(/\*/)) {
		var detail = this.getDetail(id);
		if (detail && detail[this.m_RDIVALUE_KEY]) {
			var rdi = detail[this.m_RDIVALUE_KEY][1];
			if(annotation.version >= 2 && detail[this.m_RDIVALUE_KEY][2]) {
				//Look for version 2 RDI value only if this annotation is
				//version 2 (as specified by CCS) AND the version 2 RDI value
				//is different than the version 1 RDI value.
				rdi = detail[this.m_RDIVALUE_KEY][2];
			}
			return this._compareWithoutNS(annotation.rdi, rdi);

		} else {
			return false;
		}
	} else {
		return annoFirstId === id;
	}
};

AnnotationCTXLookup.prototype._compareWithoutNS = function(rdi1, rdi2){
	if(!rdi1 || !rdi2){
		return false;
	}
	if(rdi1 !== rdi2){
		var iDotPos = rdi2.indexOf("].[");
		if(iDotPos > 0){
			return rdi1.lastIndexOf(rdi2.substr(iDotPos))>0;
		}
		
		return false;
	}
	return true;
};

/**
 * Checks if cellCtxValue matches with annoatation's ctx and rdi.
 * The following is detail logic of the decision
 * - extracts Ids from cellCtxValue and annotation.ctx
 * - calls isAnnotatedId with first id of ctx and first id of cellCtxValue
 * - if not, cellCtxValue is not for this annotation. returns false
 * - next, compares data (i.e: usage is 0 or 1) item Ids
 * - if annotation ctx has more data item than cellCtxValue's,
 *   it means the cellCtxValue does not have enough data items.
 *   returns false.
 * - Finally, checks all of annotation ctx's data item Ids is present as cellCtxValue's data item.
 *   then returns true.
 * - or, returns false.
 *
 *
 * @param annotation object
 * @param cellCtxValue string
 * @private
 */
AnnotationCTXLookup.prototype.isAnnotatedCell = function(annotation, cellCtxValue) {
	if (!annotation || !annotation.ctx || !cellCtxValue) {
		return false;
	}

	this._populateCtxDetailsForOneCtxValue(cellCtxValue);

	var annoIDArray = this.generateIDArrayFromCellCtxValue(annotation.ctx);
	var cellIDArray = this.generateIDArrayFromCellCtxValue(cellCtxValue);

	//Compare first IDs
	if( !this.isAnnotatedId(annoIDArray[0], annotation, cellIDArray[0]) ) {
		return false;
	}

	//Compare data (i.e: usage is 0 or 2. means not a measure/calculation) item IDs
	var annoDataItemIdArray = this._generateDataItemIDArrayFromAnnotationIDs(annoIDArray);
	var cellDataItemIdArray = this._generateDataItemIDArrayFromCellIDs(cellIDArray);

	if ( annoDataItemIdArray.length > cellDataItemIdArray.length) {
		return false;
	}

	for (var i=0, len=annoDataItemIdArray.length; i<len; i++) {
		for(var j=0, jLen=cellDataItemIdArray.length; j<jLen; j++) {
			if (annoDataItemIdArray[i] === cellDataItemIdArray[j] ) {
				annoDataItemIdArray[i] = true;
				cellDataItemIdArray[j] = true;
				break;
			}
		}
	}

	for (i = 0, len = annoDataItemIdArray.length; i < len; i++) {
		if (annoDataItemIdArray[i] !== true) {
			return false;
		}
	}
	for (i = 0, len = cellDataItemIdArray.length; i < len; i++) {
		if (cellDataItemIdArray[i] !== true) {
			return false;
		}
	}
	return true;
};


/**
 * Generates array of Ids where id is a data item (not a measure/calculation).
 * To be a data item, 'usage' in ctx detail of id must be 0 or 1
 *
 * @param cellIDArray Array
 * @private
 */
AnnotationCTXLookup.prototype._generateDataItemIDArrayFromCellIDs = function(cellIDArray) {
	var dataItemIDs = [];

	for(var i=1, len=cellIDArray.length; i<len; i++){
		var id = cellIDArray[i];
		var detail = this.getDetail(id);

		if( this._isDataItem(detail) ) {
			dataItemIDs.splice(0,0, id);
		}
	}

	return dataItemIDs;
};

// The list of these dtypes came from CMS. Added for defect 12126
AnnotationCTXLookup.dtypeLookup = {"1" : true,"25" : true,"26" : true,"27" : true,"28" : true,"29" : true,"30" : true,"31" : true,"32" : true,"34" : true,"35" : true,"36" : true,"43" : true,"45" : true,"55" : true,"56" : true};

AnnotationCTXLookup.prototype._isDataItem = function(detail) {

	if (detail) {
		var usage = detail.usage;
		var dtype = detail.dtype;
		if (usage === 0 || usage === 1 || (usage === 3 && AnnotationCTXLookup.dtypeLookup[dtype] === true)) {
			return true;
		}
	}

	return false;
};


/**
 * Generates array of Ids where id is not '*'
 *
 * @param annoIDArray Array
 * @private
 */
AnnotationCTXLookup.prototype._generateDataItemIDArrayFromAnnotationIDs = function(annoIDArray) {
	var dataItemIDs = [];

	for(var i=1, len=annoIDArray.length; i<len; i++){
		var id = annoIDArray[i];
		if (id.match(/\*/) === null) {
			dataItemIDs.splice(0,0, id);
		}
	}

	return dataItemIDs;
};