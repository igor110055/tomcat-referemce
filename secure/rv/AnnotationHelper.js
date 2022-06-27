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

dojo.provide("viewer.AnnotationHelper");

dojo.declare("viewer.AnnotationHelper", null, {
	m_loadAnnotationsDfd : null,

	//This records if any annotation is returned on the first getAnnotation call. if none is returned, we want to skip getAnnotation call.
	//default value is true. responseHandler of getAnnotations update this flag accordingly.
	//If a user select 'reset' action, this flag reset to 'true' so that we issue getAnnotation call.
	m_bCallGetAnnotations : true,

	m_bAnnotationsEnabled : null,

	constructor : function(iWidget) {
		this.m_viewerIWidget = iWidget;
		this.m_bCallGetAnnotations = true;
		this.m_bAnnotationsEnabled = null;
	},

	getAnnotationStore : function() {
		return this.m_viewerIWidget.getAnnotationStore();
	},

	setCallGetAnnotations : function(flag) {
		this.m_bCallGetAnnotations = flag;
	},

	isEnabled : function() {
		if(this.m_bAnnotationsEnabled === null) {
			this.m_bAnnotationsEnabled = this.m_viewerIWidget.getViewerObject().bBuxAnnotationsAvailable;
		}
		return this.m_bAnnotationsEnabled;
	},

	refreshAnnotationData : function() {
		if(this.m_loadAnnotationsDfd) {
			return null;
		}
		this.m_loadAnnotationsDfd = new dojo.Deferred();
		this.fetchAnnotationData();
		return this.m_loadAnnotationsDfd;
	},

	/**
	 * Sends a request to the server for the latest annotation data
	 */
	fetchAnnotationData : function() {
		var viewerIWidget = this.m_viewerIWidget;

		if (!this.m_bCallGetAnnotations || !this.isEnabled()) { //stop proceede if the flag is false
			return;
		}

		dojo.when(viewerIWidget.getWidgetStoreID(),
			dojo.hitch(this, function(widgetStoreID) {
				if(!widgetStoreID) {
					return;
				}

				this.m_viewerIWidget.getLoadManager().runWhenHasViewer(
					dojo.hitch(this, this._fetchAnnotationData, widgetStoreID)
				);
			})
		);
	},

	_fetchAnnotationData: function(widgetStoreID) {
		var cognosViewer = this.m_viewerIWidget.getViewerObject();
		var selCon = cognosViewer.getSelectionController();

		var metadata = selCon.getCCDManager().m_md;
		if(!metadata) {
			metadata = {};
		}
		metadata = dojo.toJson(metadata);

		var contextData = selCon.getCCDManager().m_cd;
		if(!contextData) {
			contextData = {};
		}
		contextData = dojo.toJson(contextData);

		var callbacks = {"complete":{}, "fault": {}};
		callbacks.complete["object"] = this;
		callbacks.complete["method"] = this.fetchAnnotationDataResponse;
		callbacks.fault["object"] = this;
		callbacks.fault["method"] =  this.fetchAnnotationDataResponseFault;

		var asynchRequest = new AsynchJSONDispatcherEntry(cognosViewer);
		asynchRequest.setCallbacks(callbacks);

		asynchRequest.addFormField("widgetStoreID", widgetStoreID);
		asynchRequest.addFormField("ui.action", "getAnnotations");
		asynchRequest.addFormField("cv.metatdata", metadata);
		asynchRequest.addFormField("cv.context", contextData);

		// Need to bypass the queue for this request since it's a background request and
		// we don't want other requests (actions) to get dropped from the queue
		asynchRequest.sendRequest();
	},

	fetchAnnotationDataResponseFault: function(oAsynchResponse) {
		this.m_bCallGetAnnotations = false;

		var oFaultDialog = new FaultDialog(this.m_viewerIWidget.getViewerObject());

		var oSoapFault = oAsynchResponse.getSoapFault();
		var sErrorCode = null;

		var nException = XMLHelper_FindChildByTagName(oSoapFault, "exception", true);
		if(nException) {
			var nErrorCode = XMLHelper_FindChildByTagName(nException, "errorCode", false);
			if(nErrorCode) {
				sErrorCode = XMLHelper_GetText(nErrorCode);
			}
		}

		if(sErrorCode === "0") {
			var sMessage = null;

			var nMessage = XMLHelper_FindChildByTagName(nException, "message", false);
			if(nMessage) {
				var nMessageString = XMLHelper_FindChildByTagName(nMessage, "messageString", true);
				if(nMessageString) {
					sMessage = XMLHelper_GetText(nMessageString, false);
				}
			}

			if(sMessage) {
				var rErrorCode = /ANS-GEN-(\d{2,4})/;
				var aMatches = rErrorCode.exec(sMessage);
				if(aMatches && aMatches.length && aMatches.length > 1) {
					var sAnsErrorCode = aMatches[1];
					if(sAnsErrorCode === "0075") {
						//Parent deleted - i.e. widget has been deleted.
						oFaultDialog.setErrorMessage(RV_RES.IDS_ANNOTATION_WIDGET_DELETED_ERROR);
					}
				}
			}

		}

		//Delete all annotations (they're no longer valid).
		this._cleanupPreviousAnnotations();
		this.getAnnotationStore().clear();

		oFaultDialog.show(oSoapFault);
		if(this.m_loadAnnotationsDfd) {
			this.m_loadAnnotationsDfd.errback();
			this.m_loadAnnotationsDfd = null;
		}
	},

	fetchAnnotationDataResponse : function(asynchJSONResponse) {
		var editContentAction = window["CVEditContentActionInstance"];
		var jsonResult = asynchJSONResponse.getResult();

		//Prevent subsequent queries for annotations only if the report
		//has no annotations at all (i.e. jsonResult is null, not empty).
		this.m_bCallGetAnnotations = this.m_bCallGetAnnotations && jsonResult !== null;

		if (jsonResult===null) {
			jsonResult = [];
		}

		var viewerObject = this.m_viewerIWidget.getViewerObject();
		viewerObject.envParams["cv.annotationData"] = jsonResult;

		this._cleanupPreviousAnnotations();

		if (jsonResult.length > 0) {
			if (this.getAnnotationStore()) {
				var annotationArray = this._generateMatchedAnnotationsFromViewerObject();
				this.getAnnotationStore().load(annotationArray);
				this.displayCommentIndicators();
			}
		}

		if(this.m_loadAnnotationsDfd) {
			this.m_loadAnnotationsDfd.callback();
			this.m_loadAnnotationsDfd = null;
		}
	},

	/*
	 * destroy all commentViewer widget for previous annotations
	 */
	_cleanupPreviousAnnotations : function () {
		var store = this.getAnnotationStore();
		if (store) {
			var annotations = store.getAll();
			//clean up all annotations
			for (var contextId in annotations) {
				var commentId = this.m_viewerIWidget.getWidgetId() + "_" + contextId + "_comment";

				var commentViewer = dijit.byId(commentId);
				if (typeof commentViewer != "undefined" && commentViewer != null) {
					commentViewer.destroy();
					delete commentViewer;
				}
				store.clear(contextId);
			}
		}
	},

	/*
	 * Returns array of annotations. Ctx of an annotation is updated with the explicit ctx value of the report cell the annotation is on.
	 * In order to update ctx value, it does the following.
	 *
	 * - remove any OR (|) operator in ctxValue
	 * - find a matching report cell and take ctx value of it
	 *
	 */
	_generateMatchedAnnotationsFromViewerObject : function () {
		var viewerObject = this.m_viewerIWidget.getViewerObject();
		var annotationData = [];
		if (viewerObject && viewerObject.envParams && viewerObject.envParams["cv.annotationData"]) {
			annotationData = eval(viewerObject.envParams["cv.annotationData"]);
		}

		var annotationListWithUniqueCTX = this._generateAnnotationListWithoutORoperator(annotationData);
		return this._updateAnnotationCtxWithMatchedCellCtx(annotationListWithUniqueCTX, viewerObject);
	},

	/*
	 * ctx of an annotation may have 'OR' operator.
	 * for example, 9:3|4:*
	 * It means that annotated cell's ctx could be either 9:3:* or 9:4:*
	 *
	 * This function removes 'OR' operator and make two annotations with one of each possible ctx value.
	 *
	 */
	_generateAnnotationListWithoutORoperator : function(annotationData) {
		var annotationListWithUniqueCTX = [];
		for (var i=0, len=annotationData.length; i<len; i++ ) {
			var anno = annotationData[i];
			if(anno.ctx) { //cell level annotation
				var oneOrMoreAnno = bux.AnnotationHelper.generateCTXList(anno.ctx);

				for(var j=0, jLen=oneOrMoreAnno.length; j<jLen; j++) {
					var newAnno = {
						ann:anno.ann,	// serviceId
						lmt:anno.lmt,	// modified date/time
						lmtf:anno.lmtf,	// modified date/time (formatted)
						ctx:anno.ctx,
						desc:anno.desc,	// text
						fd:anno.fd,	//filter data
						layoutElementId:anno.layoutElementId,
						owner:anno.owner,	//owner name string
						ownerSearchPath:anno.ownerSearchPath,
						pv:anno.pv,	//prompt param values
						rdi:anno.rdi,
						sd:anno.sd,	//sliders data
						version:anno.version || 1
					};
					newAnno.ctx = oneOrMoreAnno[j];
					annotationListWithUniqueCTX.splice(0,0, newAnno);
				}
			} else {//widget level annotation
				annotationListWithUniqueCTX.splice(0,0, anno);
			}
		}
		return annotationListWithUniqueCTX;
	},

	/*
	 * Finds the report cell of an annotations, and update ctx of annotation with the cell's ctx
	 * Returns array of annotations which all has explicit ctx value
	 *
	 * In order to that, it does the following
	 *
	 * first, creates AnnotationCTXLookup object, and
	 * calls populateCtxDetailsForAllAnnotations to load ctx details for all Ids in annotation ctx
	 *
	 * then, for each annotation
	 *
	 * - queries dom nodes with ctx attirbute, report cells, if hasn't
	 * - if ctx of an annotation is not present, it is a widget level. put it in the return array
	 * - calls isAnnotatedCell function of AnnotationCTXLookup with annotation and each cell's ctx value.
	 * - only if the function return true,
	 *   updates ctx of annotation with the ctx value of the cell. and put it in the return array
	 *
	 */
	_updateAnnotationCtxWithMatchedCellCtx : function (newAnnotationListWithUniqueCTX, viewerObject) {
		var processedAnnotationList = [];

		var ctxLookup = new AnnotationCTXLookup(this.m_viewerIWidget.getViewerObject().getSelectionController().getCCDManager());
		ctxLookup.populateCtxDetailsForAllAnnotations(newAnnotationListWithUniqueCTX);

		var nodes = [];
		for(var i=0, len=newAnnotationListWithUniqueCTX.length; i<len; i++) {
			var anno = newAnnotationListWithUniqueCTX[i];
			if (anno.ctx) {
				if (nodes.length === 0) {
					//query now. we need it for cell level handling
					nodes = dojo.query('[ctx]', this.m_viewerIWidget.iContext.getRootElement());
				}

				for (var j = 0, jLen = nodes.length; j < jLen; j++) {
					var cellCtxValue = nodes[j].getAttribute('ctx'); // get ctx attributes from node
					if (ctxLookup.isAnnotatedCell(anno, cellCtxValue)) {
						anno.ctx = cellCtxValue;
						processedAnnotationList.splice(0,0, anno);
						break;
					}
				}
			} else {
				processedAnnotationList.splice(0,0, anno);
			}
		}

		return processedAnnotationList;
	},

	displayCommentIndicators : function () {
		var store = this.getAnnotationStore();
		var commentedCells = store.getAll();

		for (var cell in commentedCells)
		{
			var indicator = new bux.AnnotationIndicator({annotationStore: store, context: cell, iWidgetContainer: this.m_viewerIWidget, dir: this.m_viewerIWidget.getViewerObject().getDirection()});
			indicator.addExistingCommentToCell();
		}
	},

	/**
	 * Runs the placement logic on each annotation indicator again,
	 * incase the positions where they should be have changed.
	 */
	repositionCommentIndicators : function() {
		var store = this.getAnnotationStore();
		var annotations = store.getAll();

		for (var id in annotations) {
			var annotation = annotations[id];
			var ctx = annotation[0].getContext();
			var indicatorId = store.getIndicatorWidgetId(ctx);
			if (indicatorId!==null) {
				var indicator = dijit.byId(indicatorId);
				indicator.addToPage();
			}
		}
	},

	promptForSave : function(yesOkFunc) {
		dojo["require"]("bux.dialogs.InformationDialog"); //@lazyload
		var saveConfirmationDialog = new bux.dialogs.InformationDialog({
			title: RV_RES.IDS_JS_COMMENT_DLG_TITLE,
			sMainMessage: RV_RES.IDS_JS_COMMENT_DLG_MESSAGE,
			sDescription: RV_RES.IDS_JS_COMMENT_DLG_DETAILS,
			sInfoIconClass: 'bux-informationDialog-warning-icon',
			buttons : ['YES','NO'],
			yesOKHandler : yesOkFunc
		});
		saveConfirmationDialog.startup();
		saveConfirmationDialog.show();
	},

	addComment : function (ctxId, cellValue) {
		if (this.m_viewerIWidget.isSaveNecessary()) {
			this.promptForSave( dojo.hitch(this, this.onCommentSaveAcknowledge, ctxId, cellValue) );
		} else {
			this.addNewComment(ctxId, cellValue);
		}
	},

	editComment : function (ctxId) {
		var comment = bux.getComment(this.m_viewerIWidget.iContext, this.getAnnotationStore().getEffectiveIds(ctxId));
		if (comment && comment.edit)
		{
			comment.edit();
		}
	},

	deleteComment : function (ctxId) {
		this.getAnnotationStore().deleteOneComment(ctxId);

		/* THE following function should be added as a callback function of the deleteOneComment above.
		 * The deleteOneComment function must be modified to return the deferred object.
		 * Commenting this logic for now because BUX streamlining work is in progress.
		 *
		this.m_bCallGetAnnotations = this.annotationStore.hasAnnotation();
		*/
	},

	addNewComment : function(ctxId, cellValue) {
		//If cellValue is undefined or null, don't prepopulate flyout
		this.addAsNewComment(ctxId, (cellValue == null) ? "" : (cellValue + ' - '));
	},

	addAsNewComment : function(ctxId, text) {
		var indicator = null;

		var contextId = (ctxId===null)? this.getAnnotationStore().WIDGET_CONTEXT: ctxId;
		var indicatorId = this.getAnnotationStore().getIndicatorWidgetId(contextId);

		if (indicatorId!=null) {
			indicator = dijit.byId(indicatorId);
		}

		if (indicator==null) {
			dojo["require"]("bux.AnnotationIndicator"); //@lazyload
			indicator = new bux.AnnotationIndicator({
				annotationStore: this.getAnnotationStore(),
				context: contextId,
				iWidgetContainer: this.m_viewerIWidget,
				dir: this.m_viewerIWidget.getViewerObject().getDirection()
			});
			window.setTimeout(function () { indicator.addNewCommentToCell(text); },0);
		} else {
			window.setTimeout(function () { indicator.comment.editNewComment(contextId, text); },0);
		}
	},

	onCommentSaveAcknowledge : function(ctxId, cellValue) {
		this.m_viewerIWidget._pendingContextId = ctxId;
		this.m_viewerIWidget._pendingCellValue = cellValue;
		this.m_viewerIWidget.fireEvent('com.ibm.bux.widget.action', null, {action: 'canvas.save'});
	},

	addWidgetComment : function () {
		if (this.m_viewerIWidget.isSaveNecessary()) {
			this.promptForSave( dojo.hitch(this, this.onCommentSaveAcknowledge, null, this.m_viewerIWidget.getDisplayName()) );
		} else {
			this.addNewComment(null, this.m_viewerIWidget.getDisplayName());
		}
	},

	editWidgetComment : function () {
		var comment = bux.getComment(this.m_viewerIWidget.iContext, [this.getAnnotationStore().WIDGET_CONTEXT]);
		if (comment && comment.edit)
		{
			comment.edit();
		}
	},

	deleteWidgetComment : function () {
		this.deleteComment(this.getAnnotationStore().WIDGET_CONTEXT);
	},

	commitComment : function(annotation) {
		//If it has never been loaded, it's a brand new comment
		if (annotation.getContext() !== this.getAnnotationStore().WIDGET_CONTEXT) {
			return this.commitCellComment(annotation);
		}
		else {
			return this.commitWidgetComment(annotation, this.getAnnotationStore());
		}
	},

	/**
	 * @return a deferred which will be resolved when the request to the server
	 * to commit a cell comment returns.
	 */
	commitCellComment : function(annotation) {
		//Fire off a request to Viewer to commit the annotation
		//Note: Edit requests go directly to the annotation service and not through Viewer,
		//so they are not dealt with here

		var deferred = new dojo.Deferred();
		var cognosViewer = this.m_viewerIWidget.getViewerObject();
		var callbacks = {
			customArguments:[annotation, deferred],
			"complete": {"object": this, "method": this.handleCellCommentSaveResponse},
			"fault": {"object": this, "method": this.handleCellCommentSaveErrorResponse},
			"error": {"object": this, "method": this.handleCellCommentSaveServerErrorResponse}
		};

		var asynchRequest = new AsynchJSONDispatcherEntry(cognosViewer);
		asynchRequest.setCallbacks( callbacks );

		this.preparePostForCommitCellComment( asynchRequest, annotation ).then(
			function() {
				cognosViewer.dispatchRequest(asynchRequest);
			}
		);
		return deferred;
	},

	/**
	 * @return a deferred which will be resolved when all form fields are added to the request
	 */
	preparePostForCommitCellComment : function(asynchRequest, annotation) {
		var dfd = new dojo.Deferred();
		dojo.when(this.m_viewerIWidget.getWidgetStoreID(),
			dojo.hitch(this, function(widgetStoreID) {
				var viewerObject = this.m_viewerIWidget.getViewerObject();
				var selCon = viewerObject.getSelectionController();

				asynchRequest.addFormField("widgetStoreID", widgetStoreID);
				asynchRequest.addFormField("ui.action", "commentSave");
				asynchRequest.addFormField("cv.metatdata", dojo.toJson(selCon.getCCDManager().m_md));
				asynchRequest.addFormField("cv.context", dojo.toJson(selCon.getCCDManager().m_cd));
				asynchRequest.addFormField("cv.commentId", annotation.getContext());
				asynchRequest.addFormField("cv.commentDesc", xml_encode(annotation.getDescription()));

				var lid = selCon.getAllSelectedObjects()[0].getLayoutElementId();
				if (lid) {
					//The "lid" attribute is composed of layout ID + namespacePrefix + widget identifier.
					//We only want the layout ID, so remove the rest.
					lid = lid.replace(this.m_viewerIWidget.getViewerId(), "");
					annotation.setParentId(lid);
					asynchRequest.addFormField("cv.commentLayoutId", annotation.getParentId());

					var annInfoBar = new AnnotationInfoBar(viewerObject, lid);
					var filterContext = annInfoBar.createFilterContext();
					if (filterContext!=null) {
						annotation.setFilterContext(filterContext);
						if (filterContext.getPromptsJSON()) {
							asynchRequest.addFormField("cv.filterContext_prompts", dojo.toJson(filterContext.getPromptsJSON()));
						}
						if (filterContext.getFilterJSON()) {
							asynchRequest.addFormField("cv.filterContext_filter", dojo.toJson(filterContext.getFilterJSON()));
						}
						if (filterContext.getSlidersJSON()) {
							asynchRequest.addFormField("cv.filterContext_sliders", dojo.toJson(filterContext.getSlidersJSON()));
						}
					}
				}
				dfd.callback();
			})
		);
		return dfd;
	},

	/**
	 * @return a deferred that resolves when the server responds to new annotation request
	 */
	commitWidgetComment : function(annotation) {
		dojo["require"]("bux.Services"); //@lazyload
		var	serviceURL = bux.Services.getGateway() + "/annotationService/creation";
		var contentObj = {};

		contentObj["annotationName"] = annotation.getName();
		if (contentObj["annotationName"] == null) {
			//This parameter is necessary to the API -- the call will fail without it
			contentObj["annotationName"] = "";
		}

		contentObj["annotationDescription"] = annotation.getDescription();

		var dfd = new dojo.Deferred();

		dojo.when(this.m_viewerIWidget.getWidgetStoreID(),
			dojo.hitch(this, function(widgetStoreID) {
				contentObj["annotationParentID"] = widgetStoreID;

				bux.xhrPost({
					url: serviceURL,
					sync: true,
					content: contentObj
				}).then(
					/*callback*/ dojo.hitch( this, function (response) {
						this.handleCommentSaveDone(response, annotation, this.getAnnotationStore(), this.m_viewerIWidget);
						annotation.loadDetails();
						dfd.callback();
					})
				);
			})
		);

		return dfd;
	},

	handleCellCommentSaveResponse : function(asynchJSONResponse, annotation, deferred)
	{
		var responseObject = asynchJSONResponse.getJSONResponseObject();
		if (responseObject) {
			var jsonResult = responseObject.json;
			if (jsonResult) {
				var result = this.handleCommentSaveDone(jsonResult, annotation, this.getAnnotationStore(), this.m_viewerIWidget);
				if (typeof result != 'Error') {
					annotation.loadDetails();
				}
			}
		}

		deferred.callback(asynchJSONResponse);
	},

	handleCellCommentSaveErrorResponse: function(asynchJSONError, annotation, deferred) {
		deferred.errback(new Error(asynchJSONError.getSoapFaultDetailMessageString()));
	},

	handleCellCommentSaveServerErrorResponse: function(error, annotation, deferred) {
		var errorObject = new Error(error.xmlHttp.statusText);
		//Include the server error response code so the user can diagnose his web server
		errorObject.xhr = error.xmlHttp;
		deferred.errback(errorObject);
	},

	//TODO: we shouldn't need to pass viewerWidget to this function, we could simply use this.m_viewerIWidget to get the widget
	handleCommentSaveDone : function(response, annotation, store, viewerWidget) {

		var xmlDom = XMLBuilderLoadXMLFromString(response);
		if (xmlDom) {
			var responseNode = xmlDom.firstChild;
			var annotationNode = XMLHelper_FindChildByTagName(responseNode, "annotation", false);
			if (annotationNode) {
				var annotationIdNode = XMLHelper_FindChildByTagName(annotationNode, "id", false);
				if (annotationIdNode) {
					var annotationId = XMLHelper_GetText(annotationIdNode);
					annotation.setServiceId(annotationId);
					annotation.setIWidgetContainer(viewerWidget);
					store.setWidgetContainer(viewerWidget);

					this.setCallGetAnnotations(true);
					return response;
				}
			}
		}
		return new Error(response.toString());
	}
});