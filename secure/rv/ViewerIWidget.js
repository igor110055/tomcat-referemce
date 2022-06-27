/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2016
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
dojo.provide("bux.reportViewer");

dojo.require("dojo.buxViewer"); // This is an optimized layer, it should have the required dojo/dijit dependencies in it.

dojo.require("bux.AnnotationHelper");
dojo.require("bux.AnnotationIndicator");
dojo.require("viewer.AnnotationHelper");
dojo.require("bux.data.AnnotationStore");
dojo.require("bux.iwidget.common.MultilingualWidgetBase");
dojo.require("InfoBarBase");
dojo.require("WidgetContextManager");

var globalViewerIdentifier = 1;

dojo.declare("bux.reportViewer", bux.iwidget.common.MultilingualWidgetBase, {


	annotationStore: null,
	annotationHelper: null,
	savedOutput: null,
	undoRedoQueue: null,
	dojoConnections : null,	//An array to manage all connections to be disconnected.
	properties: null,
	promptParametersRetrieved: false,
	viewerId: null,
	xNodeId: null,
	

	//This value is included in the cv.id parameter in order to ensure that
	//the value begins with a letter. This is to guard against javascript
	//variable naming errors (a js var starting with a number is illegal).
	namespacePrefix: "x",

	//Timer for global callback necessary to make sure all scripts are loaded
	//and executed before continuing
	timer: null,

	//Interval (in milliseconds) for global script loader callback
	timerInterval: 20,

	//This constant must match the version value in ViewerIWidget.xml
	GODASHBOARD_REPORT_VERSION: "1.0.0.0",
	BUX_REPORT_VERSION: "4.0.0.0.0", //Colorado RP1 version was "1.0.0.0.0", Caspian GA version was "2.0.0.0"
	BUX_REPORT_CASPIAN_RP1_VERSION: "3.0.0.0.0", 
	RAP_REPORT_INFO_VERSION: "1.0.0.0", //Caspian was "1.0.0.0.0"

	//This object is to hold last action and parameters at of IWidget level.
	//If response is unexpected and Viewer object does not exist, this Widget level last action may be used for resubmit.
	viewerWidgetLastAction: null,

	//An object that holds the state of all sliders on the canvas affecting this widget.
	sliderState: null,// moved this.sliderState = {}; to constructor to make it instance variable

	sViewerIWidgetId: null,

	bToolbarInitialized: false,

	m_oWidgetContextManager: null,

	//An object that holds states of whether infoBar is collasped or expanded. A widget can have many infoBars.
	m_oInfoBarRenderedState: {},
	m_bRunReportOption : null,
	m_oLoadManager: null,
	m_visible: null,
	//BEGIN DEBUG CODE
	// When delayed viewer loading implementation is complete, this variable and parts of the code which
	// reference it can be removed. It has three values:
	// 0 - use all new code (development mode)
	// 1 - run reports and load viewers on workspace load, but do not run reports when they are not visible
	// 2 - always run reports (existing behaviour)
	m_debugDelayedViewerLoadingMode: 0,
	//END DEBUG CODE

	m_delayedLoadingContext : null,
	m_doGetParametersOnLoad : null,

	widgetSize : null,
	//widget resource from widget copy/paste action
	copyPasteResource : null,
	_pastedWidget : false,
	//in CI published dashboard , report widget doesn't have originalReport instead we have to use savedReportPath
	// when we do copy/paste to set this variable for setting ui.object ,
	//ui.object will be used to query environment variables such as object permissions
	ciPublishedReportPath : null,
	
	touchStartX : -1,	//For touch handling, need to track the startX
	touchPaging : false, //True when this widget is paging as a result of a touch.
	
	_BUXDBInfoArray: null, //bux run time state information saved inside widget rsstate itemsets
	
	m_bSelectionFilterSwitch: false,
	
	savedToolbarButtons: null,

	constructor: function() {
		this.onUnloadInProgress = false;
		this.annotationHelper = new viewer.AnnotationHelper(this);
		this.savedOutput = new CIWidgetSavedOutput(this);
		this.undoRedoQueue = new UndoRedoQueue(this);
		this.viewerIdentifier = (globalViewerIdentifier++).toString();
		this.m_oCV = null;
		this.m_oLoadManager = new ViewerLoadManager(this);
		this.m_doGetParametersOnLoad = false;
		this._isMobile = false;
		this.m_bSelectionFilterSwitch = false;

		this.m_oWidgetContextManager = new WidgetContextManager(this);

		this.addWindowEventListeners();
		this.m_bReportDropped = false;
		this.sliderState = {};
		this.savedToolbarButtons = {};
	},

	getWidgetId: function() {
		return this.sViewerIWidgetId;
	},

	getAnnotationHelper: function() {
		return this.annotationHelper;
	},

	getUndoRedoQueue: function() {
		return this.undoRedoQueue;
	},

	getDisplayName: function() {		
		var buxrtstate = this.iContext.getItemSet("buxrtstate", false);
		if( buxrtstate ){
			var result = buxrtstate.getItemValue("displayTitle");
			return result? result : "";
		}
		return "";	
	},

	getSavedOutput: function() {
		return this.savedOutput;
	},

	getAttributeValue: function(name) {
		return this.iContext.getiWidgetAttributes().getItemValue(name);
	},

	setAttributeValue: function(name, value) {
		this.iContext.getiWidgetAttributes().setItemValue(name, value);
	},

	removeAttributeValue: function(name) {
		this.iContext.getiWidgetAttributes().removeItem(name);
	},

	getViewerObject: function() {
		if(!this.m_oCV) {
			try {
				this.m_oCV = window["oCV" + this.getViewerId()];
			}
			catch (ex) {
				//In Internet Explorer, if the variable has been previously deleted, an exception is
				//thrown when trying to reference it.
				//Since you can't even check for the existence of the variable without referencing it,
				//ignore the exception and return null.
				return null;
			}

			if(!this.m_oCV) {
				var widgetId = this.getWidgetId();
				for (var iIndex=0; iIndex < window.gaRV_INSTANCES.length; iIndex++) {
					// a final try to find the correct CCognosViewer object. Loop through all the Viewer's to
					// if any have the correct widgetId
					if (window.gaRV_INSTANCES[iIndex].widgetId == widgetId) {
						this.m_oCV = window.gaRV_INSTANCES[iIndex];
						
						var oldId = this.getViewerId();
						var newId = this.m_oCV.getId();
						
						this.setViewerId(newId);

						// We're switching the Viewer ID, we should update the namespaceId attribute of the elements in the head
						// so that they get correctly cleaned up when the widget is deleted

						var headChildNodes = document.getElementsByTagName("head").item(0).childNodes;
						
						// Loops through all the nodes in the head
						for (var i=0; i < headChildNodes.length; i++) {
							var node = headChildNodes[i];
							if (node.getAttribute && node.getAttribute("namespaceId") == oldId) {
								node.setAttribute("namespaceId", newId);
							}
						}
						
						break;
					}
				}
			}
		}
		return this.m_oCV;
	},

	setViewerId: function(id) {
		this.viewerId = id;
	},

	getViewerId: function() {
		if (!this.viewerId) {
			this.viewerId = this.namespacePrefix + this.viewerIdentifier;
		}
		return this.viewerId;
	},

	getLoadManager: function() {
		return this.m_oLoadManager;
	},
	
	/**
	 * Report blocker is a div that blocks any event when a request is being processed.
	 */
	getReportBlocker: function()
	{
		if( !this.m_reportBlocker )
		{ 
			this.m_reportBlocker = new Blocker( this.m_oCV.getId());
		}
		return this.m_reportBlocker;
	},
	
	placeTabControlInView: function() {
		var oCV = this.getViewerObject();
		if (oCV && oCV.getTabController()) {
			if (oCV.getTabController().getSelectedTab() && oCV.getTabController().getSelectedTab().getFocusableDiv()) {
				oCV.setKeepFocus(oCV.getTabController().getSelectedTab().getFocusableDiv());				
			}
			dojo.window.scrollIntoView(oCV.getTabController().getWrapperDiv());
		}
	},
	
	setReportBlocker: function( reportBlocker ){
		this.m_reportBlocker = reportBlocker;
	},

	isSavedOutput: function() {
		var viewerObject = this.getViewerObject();
		if(typeof viewerObject !== "undefined" && viewerObject !== null) {
			var action = (viewerObject.envParams["ui.action"]);
			return ( action === 'view' || action === 'buxView');
		}
		return false;
	},
	
	isMobile: function() {
		return this._isMobile;
	},
	
	getEmbeddedMobileItem: function() {
		var isMobile = false;
		var buxrtstate = this.iContext.getItemSet("buxrtstate", false);
		if( buxrtstate ){
			isMobile = buxrtstate.getItemValue("embeddedMobile") == "true" ? true : false;
		}
		return isMobile;
	},
	
	/**
	 *Concat the cached info with dynamic info 
	 **/
	getBUXRTStateInfoMap: function(extraInfo/*a String of XML content*/){
		if(!window.icdConfig || !window.icdConfig.ZIPIMode || window.icdConfig.ZIPIMode === "0"){ //0:off 1:concise 2:verbose
			return "";
		}						
		var aResult=["<RTStateInfo>"];	
		if(extraInfo && extraInfo.length>0){
			aResult.push(extraInfo);//Add passed in extra info
		}
		
		var sWidgetTitle = this.getDisplayName();
		if(sWidgetTitle && sWidgetTitle.length>0){
			aResult.push("<widgetTitle>",xml_encode(sWidgetTitle),"</widgetTitle>");//Add widget Title
		}
		if(this._BUXDBInfoArray && this._BUXDBInfoArray.length >0){
			aResult = aResult.concat(this._BUXDBInfoArray);//Add cached dashboard info
		}
		aResult.push("</RTStateInfo>")
		return aResult.length>2 ? aResult.join("") : "";
	},
	
	/**
	 * Cache the dashboard object information within the lifecycle of one viewer widget	 
	 **/	
	getBUXDBInfoArray: function(updateInfo){
		var sDBTitle = null;
		var sDBSearchPath = null;
		if(updateInfo){
			sDBTitle = updateInfo.dbTitle;
			sDBSearchPath = updateInfo.dbSearchPath;
		}else{
			var buxrtstate = this.iContext.getItemSet("buxrtstate", false);
			if( buxrtstate ){
				sDBTitle = buxrtstate.getItemValue("dbTitle");
				sDBSearchPath = buxrtstate.getItemValue("dbSearchPath");
			}
		}
		var aResult = [];
		if(sDBTitle && sDBSearchPath && sDBSearchPath.length >0){
			aResult.push("<dbTitle>", xml_encode(sDBTitle),"</dbTitle><dbSearchPath>",xml_encode(sDBSearchPath),"</dbSearchPath>");
		}		
		return aResult;
	},
			
	loadExtraJavascriptFiles: function(webContent) {
		if (typeof CSelectionContext == "undefined") {
			this._loadFile("/drill/CSelectionContextBuilder.js", webContent);
		}
		this._loadFile("/mdsrv/lineage.js", webContent);
		
		if (window.cognosViewerDebug) {
			this._loadFile("/rv/viewer.extra.debug.js", webContent);
		}
		else {
			this._loadFile("/rv/viewer.extra.js", webContent);
		}
	},
	

	_loadFile: function(sPath, webContent) {
		/**
		 * There's an issue with how dojo loads scripts and how IE handles eval.
		 * Here's a reference to the issue http://trac.dojotoolkit.org/ticket/744
		 * To fix this, we'd have to change all our global to have window., so instead of foo = "a" it would need to be window.foo = "a"
		 * If webContentRoot starts with .. dojo with use the dojo path to try and load the file
		 */	
		if (dojo.isIE || dojo.isTrident || webContent.indexOf("..") == 0) {
			var responseText = window.gScriptLoader.loadFile(webContent + sPath, "", "GET");
			var scriptElement = document.createElement('script');
			scriptElement.type = "text/javascript";
			scriptElement.text = responseText;
			document.getElementsByTagName('head')[0].appendChild(scriptElement);			
		}
		else {
			dojo._loadPath(webContent + sPath, null);
		}
	},
	
	_getCWALaunchInformation: function() {
		var args = {
			url: this.buildPostUrl(),
			sync: false,
			handleAs: "json",
			preventCache: true,
			content: {
				"b_action" : "cognosViewer",
				"ui.action" : "noOp",
				"cv.responseFormat" : "getCWALaunchParameters"
			},
			error: dojo.hitch(this, function(response) {
				this.fireEvent("com.ibm.bux.widget.render.done", null, {noAutoResize:true});
				this.fireEvent("com.ibm.bux.widget.notification", null, {type: "error", message: response.message, description: response.description});
				}),
			load: dojo.hitch(this, function(response, ioArgs) {
				var responseContentType = ioArgs.xhr.getResponseHeader("Content-Type");
				if (responseContentType && responseContentType.indexOf("text/html") != -1 && response && response.match(/<ERROR_CODE>CAM_PASSPORT_ERROR<\/ERROR_CODE>/)) {
					this.handlePassportErrorFromDispatcher();
				} else {
					this._launchCWA(response);
				}
			})
		};
		
		dojo.xhrPost(args);
	},
	
	_launchCWA: function(response) {
		if (response) {
			if (typeof NewReportAction == "undefined") {
				this.loadExtraJavascriptFiles(response.webContentRoot);
				if (response.productLocale != "en") {
					this._loadFile("rv/res/viewer_" + response.productLocale + ".js", response.webContentRoot);
				}
			}
			
			var action = new NewReportAction();
			action.setRequestParms({
				"packageSearchPath" : this.getAttributeValue("packageSearchPath"),
				"viewerIWidget" : this,
				"webContentRoot" : response.webContentRoot,
				"gateway" : response.gateway,
				"capabilitiesXml" : response.capabilitiesXML,
				"cafContextId" : response.cafContextId
			});
			
			this.removeAttributeValue("packageSearchPath");
			
			action.execute();
		}
	},
	
	/**
	 * When we get the response from CWA for a new report, we need to set the information here
	 * so that our buildPostContent method can pick it up.
	 */
	setNewReportInfo: function(info) {
		this._newReportInfo = info;
	},
	
	/**
	 * User hit cancel on the select a package dialog, remove the widget
	 */
	_handleFileDialogCancel : function() {
		this.fireEvent("com.ibm.bux.widget.action", null, { action: 'deleteWidget' });
	},
	
	/**
	 * User selected a package and hit Ok. Set the searchPath to the package
	 * as the 'packageSearchPath' itemSet and recall the onLoad function so that we
	 * can piggy pack of the functionality of creating a new report from the content tree
	 */
	_handleFileDialogOk : function(storeId) {
		this.removeAttributeValue("newReport");
		this.setAttributeValue("packageSearchPath", "storeID(\"" + storeId + "\")");
		this.onLoad();
	},
	
	onLoad: function() {
		this.sViewerIWidgetId = this.iContext.getRootElement().id;

		// If we're creating a new report we don't need to run anything else in ViewerIWidget until we get
		// the report spec back from CWA
		if (this.getAttributeValue("packageSearchPath")) {
			this._getCWALaunchInformation();
			return;
		}
		else if (this.getAttributeValue("newReport") === "true") {
			dojo["require"]("bux.dialogs.FileDialog"); //@lazyload
			var oDlg = new bux.dialogs.PackageDialog({
				onCancelHandler: dojo.hitch(this, this._handleFileDialogCancel),
				selectPackageHandler: dojo.hitch(this, this._handleFileDialogOk)
			});
			oDlg.startup();
			oDlg.show();
			
			return;
		}
		
		var viewerConcurrentRequestLimit = this.getAttributeValue("ViewerConcurrentRequestLimit");
		if (viewerConcurrentRequestLimit) {
			this.removeAttributeValue("ViewerConcurrentRequestLimit");
			if(!window['gReportWidgetLoadQueue']) {
				window['gReportWidgetLoadQueue'] = new ReportWidgetLoadQueue(viewerConcurrentRequestLimit);
			}
		}

		this._isMobile = this.getEmbeddedMobileItem();
		
		this._BUXDBInfoArray = this.getBUXDBInfoArray();//HashMap			

		var properties = this.getAttributeValue( "viewerProperties");
		var promptParametersRetrieved = this.getAttributeValue( "promptParametersRetrieved");
		if ( promptParametersRetrieved !== null && promptParametersRetrieved == "true") {
			this.promptParametersRetrieved = true;
		}
		this.properties = this.createProperties(properties);
		this.savedOutput.setPagedOutput( !this.properties.getRetrieveAll());

		this.setWidgetCopyPasteParameters();

		this.m_bSelectionFilterSwitch = this.getAttributeValue("selectionFilterEnabled") == "true" ? true : false;

		if (this.isOpeningSavedDashboard() && this.copyPasteResource == null) {
			//Opening a dashboard
			
			this.disableListenToIfFullReportUpgraded();
			this.enableFlashChartsToIfReportPartUpgraded();
			this.disableListenToIfReportPartUpgraded();
						
			if(this.isVisible()) {
				if(window['gReportWidgetLoadQueue']) {
					window['gReportWidgetLoadQueue'].add(this);
				} else {
					this.postReport(null);
				}
			}
		} else {
			//Dropping a report on the canvas or copy/paste as we need to collect filters before posting report
			var payload = { action: 'canvas.filters' };
			this.fireEvent("com.ibm.bux.widget.action", null, payload );
			this.getLoadManager().viewerLoadInitiated();
			this.m_visible = true;
		}

		this.addWidgetEventListeners();

		// need to register a new wire directly to the Canvas for the context event. Canvas doesn't support dynamic set up of events yet.
		this.iContext.iEvents.svc.addWire(this.iContext.widgetId, "com.ibm.widget.contextChanged", "widgetBuxCanvasTabs", "com.ibm.widget.contextChanged");
		this.iContext.iEvents.svc.addWire(this.iContext.widgetId, "com.ibm.bux.data.filterCache.init", "widgetBuxCanvasTabs", "com.ibm.bux.data.filterCache.init");
		
		/*
		 * This event is necessary because storeId in viewerProperty itemSet might be incorrect if workspace is imported through deployment.
		 * Canvas will return back right storeId in dashboard spec which is taken care by deployment.
		 */
		this.fireEvent("com.ibm.bux.widget.updateStoreID", null, {});
	},
	
	addWindowEventListeners : function()
	{
		if (!this.dojoConnections) {
			this.dojoConnections=[];
		}
		this.dojoConnections.push(dojo.connect(window, "onresize", this, this.onBrowserResize));
		this.dojoConnections.push(dojo.connect(window, "onbeforeunload", this, this.possibleUnloadEvent));
	},

	addWidgetEventListeners : function()
	{
		//Touch paging events must be attached to the widget not the window.
		if (this.isMobile()) {
			this.dojoConnections.push(dojo.connect(this.iContext.getRootElement(), "touchstart", this, this.onTouchStart));
			this.dojoConnections.push(dojo.connect(this.iContext.getRootElement(), "touchmove", this, this.onTouchMove));
		}
	},

	addChromeWhitespaceHandler: function(sCVid) {
		if (isIE()) { //IE only
			var nViewer = document.getElementById('mainViewerTR' + sCVid);
			if (nViewer) {
				//The event on Chrome whitespace clears current selections.
				this.dojoConnections.push(dojo.connect(nViewer, "onmousedown", this, this.onMouseDownOnChromeDiv));
			}
		}
	},
	
	/*
	 * Calls clear selection if evt is from on beyond report area 
	 */
	onMouseDownOnChromeDiv: function (evt) {
		
		var oCV = this.getViewerObject();
		if (oCV) {
			var nReportDiv = oCV.getReportDiv();
			if (nReportDiv) {
				var oBoundingClientRect = nReportDiv.getBoundingClientRect();
				var iClientYOfBottomOfReport = oBoundingClientRect.top + nReportDiv.offsetHeight;
				 
				if (evt.clientY > iClientYOfBottomOfReport && evt.button !== 2) { //ignore right click
					//the evt is from Chrome whitespace
					if (oCV.getSelectionController()) {
						oCV.getSelectionController().clearSelectedObjects();
						this.onSelectionChange();
						stopEventBubble(evt);
					}
				}
			}
		}
	},
	
	removeWindowEventListeners : function()
	{
		if (this.dojoConnections) {
			for (var i=0; i<this.dojoConnections.length; ++i) {
				dojo.disconnect(this.dojoConnections[i]);
			}
			delete this.dojoConnections;
		}
	},

	onBrowserResize: function()
	{
		var oCV=this.getViewerObject();
		if (oCV && oCV.getPinFreezeManager()) {
			oCV.getPinFreezeManager().onResizeCanvas(this.isVisible());
		}
	},

	onTouchStart: function(e)
	{
		//To support page swipe next page/previous page, capture the startX
		this.touchPaging=false;	//Set to true only when a nextPage or previousPage has been called after the touch started
		if (this.m_oCV && e && e.changedTouches && e.touches && e.touches.length == 1) {
			var touchobj = e.changedTouches[0]; // reference first touch point for this event
			if (touchobj && touchobj.clientX) {
				this.touchStartX=parseInt(touchobj.clientX);
			}
		}
		
	},
	
	onTouchMove: function(e)
	{
		//Assume page swipe if the distance between the firstX of the swipe and the currentX is large enough AND there are more pages in the given direction.
		if (!this.touchPaging && this.touchStartX!=-1  && this.m_oCV && e && e.changedTouches && e.touches && e.touches.length == 1) {
			var touchobj = e.changedTouches[0]; // reference first touch point for this event
			if (touchobj && touchobj.clientX) {
				var touchCurrentX=parseInt(touchobj.clientX);
				if (this.m_oCV.hasNextPage() && this.touchStartX - touchCurrentX > 10) {
					this.touchPaging=true;
					this.m_oCV.pageAction("nextPage");
					this.m_oCV.setKeepFocus(false);
				} else if (this.m_oCV.hasPrevPage() && touchCurrentX - this.touchStartX > 10) {
					this.touchPaging=true;
					this.m_oCV.pageAction("previousPage");
					this.m_oCV.setKeepFocus(false);
				} else {
					this.touchPaging=false;
					this.touchStartX=-1;	//Its not fast enough....
				}
			}
		}
		if (this.touchStartX > 0) {
			stopEventBubble(e);
		}
	},
	
	isLiveReport: function()
	{
		return this.isSavedOutput() === false && !this.isLimitedInteractiveMode();
	},

	createProperties: function(properties) {
		return new bux.reportViewer.Properties( this, properties );
	},
	
	disableListenToIfFullReportUpgraded: function() {
		if (this.isGoDashboardReportUpgrade()) {
			if (this.getAttributeValue( "flexParam_properties" )==null) {
				var payload = {};
				payload[ '*' ] = { blockedEvents:
					['com.ibm.bux.data.filter', 'com.ibm.bux.filter.values.get', 'com.ibm.bux.filter.items.get']
				};
				this.fireEvent("com.ibm.bux.widget.updateEventFilter", null, payload);
			}
		}
	},
	
	enableFlashChartsToIfReportPartUpgraded: function() {
		if (this.isGoDashboardReportUpgrade()) {
			var sOriginalReportPart = this.getAttributeValue("originalReportPart");
			if (typeof sOriginalReportPart !== "undefined" && sOriginalReportPart!==null) {
				this.properties.setProperty('flashCharts',"true");
			}
		}
	},

	disableListenToIfReportPartUpgraded: function() {
		if (this.isGoDashboardReportUpgrade()) {
			var sOriginalReportPart = this.getAttributeValue("originalReportPart");
			if (typeof sOriginalReportPart !== "undefined" && sOriginalReportPart!==null) {
				var payload = {};
				payload[ '*' ] = { blockedEvents:
					['com.ibm.bux.viewer.drill', 'com.ibm.bux.viewer.prompt']
				};
				this.fireEvent("com.ibm.bux.widget.updateEventFilter", null, payload);
			}
		}
	},

	/**
	 * We registered a onBeforeCallback but it will get called before the warning to the user
	 * issued from CW to allow them to stay on the current page. So this is simply a hint that a possible
	 * unload could be happening which is enough to allow us to swallow any http faults that could happen on
	 * any active http requests
	 */
	possibleUnloadEvent: function() {
		var oCV = this.getViewerObject();
		if (oCV) {
			oCV.getViewerDispatcher().possibleUnloadEvent();
		}
	},

	onUnload: function() {
		this.onUnloadInProgress = true;
		this.destroy();
		this.iContext = null;
	},

	onGetFiltersDone: function(evt) {
		// filterRequiredAction : Undo | Redo | ResetToOriginal
		if (typeof this.filterRequiredAction != "undefined" && this.filterRequiredAction != null) {
			var dataFiltersParam = this.buildDataFiltersParam(evt.payload.filters);
			var actionFactory = new ActionFactory(this.getViewerObject());
			var action = actionFactory.load(this.filterRequiredAction);
			action.dispatchRequest(dataFiltersParam, this.filterRequiredAction);
			this.filterRequiredAction = null;
		} else {
			this.postReport(evt.payload.filters);
			this.postSetWidgetCopyPasteParameters();
		}
	},

	getOriginalFormFields: function() {
		return this.m_originalFormFields;
	},

	setOriginalFormFields: function(formFields) {
		this.m_originalFormFields = formFields;
	},

	getXNodeId: function() {
		return this.xNodeId;
	},

	setXNodeId: function(nodeId) {
		this.xNodeId = nodeId;
	},

	postReport: function(filters) {
		this.getLoadManager().viewerLoadInitiated();
		this.viewerWidgetLastAction = {"functionName": "postReport", "param": [filters]};

		if(this.getRunReportOption() !== false) {
			//Record that the report is being run
			this.m_oLoadManager.runningReport();
		}

		var content = this.buildPostContent(filters);

		if( content["ui.reportDrop"] == "true" ) {
			//save this state flag
			this.m_bReportDropped = true;
		}

		// need to save the initial form fields in case the request fails so we can do a 'retry'
		this.m_originalFormFields = new CDictionary();
		for (var formField in content) {
			if (formField != "cv.outputKey") {
				this.m_originalFormFields.add(formField, content[formField]);
			}
		}

		var header = {};
		if (this.getAttributeValue("X-Node-ID")) {
			this.setXNodeId(this.getAttributeValue("X-Node-ID"));
			header["X-Node-ID"] = this.getAttributeValue("X-Node-ID");
			this.removeAttributeValue("X-Node-ID");
		}

		var args = {
			url: this.buildPostUrl(),
			sync: false,
			preventCache: true,
			content: content,
			headers: header,
			error: dojo.hitch(this, function(response){
					this.fireEvent("com.ibm.bux.widget.render.done", null, {noAutoResize:true});
					this.fireEvent("com.ibm.bux.widget.notification", null, {type: "error", message: response.message, description: response.description});
				})
		};

		if (typeof xhrMultiPart !== "undefined" && xhrMultiPart.active) {
			args.load = dojo.hitch(this, function(response){
				this.loadContent(response.responseText);
			});

			xhrMultiPart.Post(args);
		} else {
			args.load = dojo.hitch(this, function(response, ioArgs){
				var responseContentType = ioArgs.xhr.getResponseHeader("Content-Type");
				if (responseContentType && responseContentType.indexOf("text/html") != -1 && response && response.match(/<ERROR_CODE>CAM_PASSPORT_ERROR<\/ERROR_CODE>/)) {
					this.handlePassportErrorFromDispatcher();
				} else {
					this.loadContent(response);
				}
			});

			dojo.xhrPost(args);
		}
	},

	isDropped : function(){
		return this.m_bReportDropped;
	},

	/**
	 * Remove any styles that we added to the head if we're currently hidden
	 */
	cleanupStyles : function() {
		this._cssLimitReached = true;
		
		// If we're hidden
		if(!this.isVisible()) {
			if (!this._styles) {
				this._styles = [];
			}
			
			var id = this.getViewerId();
			var styleNodes = document.getElementsByTagName("head").item(0).getElementsByTagName("style");
			
			// Loops through all the style elements to find those with the correct namespaceId
			for (var i=0; i < styleNodes.length; i++) {
				var style = styleNodes[i];
				if (style.getAttribute && style.getAttribute("namespaceId") == id) {
					style.parentNode.removeChild(style);
					this._styles.push(style);
					i--;
				}
			}
		}
	},
	
	/**
	 * Add back any styles that we had previously removed from the head
	 */
	reloadStyles : function() {
		if (this._styles) {
			while (this._styles.length > 0) {
				var style = this._styles.pop();
				document.getElementsByTagName("head").item(0).appendChild(style);
			}
		}
	},
	
	loadStylesAndScripts: function(sHTML, oReportDiv, bProcessDocumentWrite) {
		window.gScriptLoader.m_bIgnoreAjaxWarnings = true;
		window.gScriptLoader.setHandlerStylesheetLimit(true);

		var domElement = this.iContext.getRootElement();
		if (!domElement)
		{
			return;
		}

		sHTML = window.gScriptLoader.loadCSS(sHTML, oReportDiv, true, this.getViewerId());

		if (dojo.isIE || dojo.isTrident)
		{
			// IE specific 'fix' where if sHTML has script tags at the beginning they won't be loaded into the DOM.
			// Adding a valid tag first causes all subsequent scripts to be loaded into the DOM.
			sHTML = "<span style='display:none'>&nbsp;</span>" + sHTML;
		}
		oReportDiv.innerHTML = sHTML;
			
		if (this.isSelectionFilterEnabled()) {
			this.updateDrillThroughLinks();
		}

		var callback = GUtil.generateCallback(this.fireResizeEvent, [], this);
		this.m_sScriptLoaderNamespace = this.getViewerId(); // Keep a reference to this ID, ViewerId may be different when it gets into destroy.
		window.gScriptLoader.loadAll(oReportDiv, callback, this.m_sScriptLoaderNamespace, bProcessDocumentWrite);
	},

	/**
	* A function to be used as a call back to fire a resize event
	*/
	fireResizeEvent: function ()
	{
		var viewerObject = this.getViewerObject();
		if (viewerObject == null) {
			this.fireEvent("com.ibm.bux.widget.render.done", null, {});
		}
		else {
			var iWidget = viewerObject.getViewerWidget();
			if (iWidget) {
				viewerObject.m_resizeReady = true;
				viewerObject.doneLoading();
			}
			else {
				var objRef = this;
				setTimeout(function() { objRef.fireResizeEvent(); }, 100);
			}
		}
	},
	/*
	 * We need to reconstruct the saved report search path.  If we don't we could be referencing the wrong
	 * report as in the case when the dashboard is copied in CC.
	 */
	getSavedReportSearchPath: function(sSavedReportName) {
		var sSavedReportPath = this.getAttributeValue( 'savedReportPath' );
		if( sSavedReportPath )
		{
			return sSavedReportPath;
		}

		var sDashboardId = this.getAttributeValue("dashboardID");
		sDashboardId = sDashboardId.substr("$$dbid$$".length );
		var savedReportSearchPath = "storeID(\"" + sDashboardId + "\")/*[@name=" + xpath_attr_encode(sSavedReportName) +"]";
		return savedReportSearchPath;
	},

	isSavedReport: function( sOriginalItem, sSavedItem ) {
		return (	typeof sSavedItem !== "undefined" &&
					sSavedItem !== null &&
					sSavedItem.length > 0 &&
					sOriginalItem !== sSavedItem );
	},

	getGlobalPromptsInfo : function() {
		var result = null;
		var oCV = null;
		var promptsInfo = [];
		var cvPromptInfo = null;

		if (window.gaRV_INSTANCES) {
			for (var iIndex=0; iIndex < window.gaRV_INSTANCES.length; iIndex++)	{
				oCV = window.gaRV_INSTANCES[iIndex];
				cvPromptInfo = oCV.getPromptParametersInfo();
				if (cvPromptInfo != null) {
					promptsInfo.push(cvPromptInfo);
				}
			}
		}
		if (promptsInfo.length > 0) {
			result = "<globalPromptInfo>" + promptsInfo.join("")+ "</globalPromptInfo>";
		}
		return result;
	},

	buildPostUrl: function () {
		return this.getAttributeValue("gateway");
	},

	getSavedItem: function() {
		var sSavedItem = this.getAttributeValue("savedReportPath");
		if( !sSavedItem )
		{
			//for backwards compatibility
			sSavedItem = this.getAttributeValue("savedReportName");
		}
		return sSavedItem;
	},

	setRunReportOption: function( option ) {
		this.m_bRunReportOption = option;
	},

	getRunReportOption: function() {
		return this.m_bRunReportOption;
	},

	resetRunReportOption: function() {
		this.m_bRunReportOption  = null;
	},

	buildPostContent: function (filters) {
		var sOriginalItem = this.getAttributeValue("originalReport");
		var sSavedItem = this.getSavedItem();

		var sOriginalReportPart = this.getAttributeValue("originalReportPart");
		var sFlexParamProperties = this.getAttributeValue("flexParam_properties");
		var sFlexPromptData = this.getAttributeValue("flexParam_promptData");

		var bIsSavedReport = this.isSavedReport( sOriginalItem, sSavedItem);
		var bPromptUser = this.getPromptRunOption(sFlexPromptData, bIsSavedReport);
		var bAction = this.getAttributeValue("cv.outputKey") ? "cvx.high" : "cognosViewer";
		var content = {
			"b_action" : bAction,
			"run.outputFormat" : "HTML",
			"bux" : "true",
			"cv.responseFormat" : "iWidget",
			"cv.id" : this.getViewerId()
		};

		if (this.isMobile()) {
			content["container"] = "mobile";
		}

		if (this.getAttributeValue("cv.outputKey")) {
			content["cv.outputKey"] = this.getAttributeValue("cv.outputKey");
			this.removeAttributeValue("cv.outputKey");
			// if we're calling cvx handler, send along the widgetId
			content["widget.id"] = this.getWidgetId();
		}

		if (this.getAttributeValue("gateway")) {
			content["cv.gateway"] = this.getAttributeValue("gateway");
		}

		if (this.getAttributeValue("webcontent")) {
			content["cv.webcontent"] = this.getAttributeValue("webcontent");
		}

		this.sInitialSpec = this.getAttributeValue("specification");

		if(  bIsSavedReport ){
			this.addUserParamsToContent( content );
		}

		/*
		 * If there is no saved report, the saved report name  is the same as the original report
		 */
		if (!this.sInitialSpec || this.copyPasteResource) {
			if ( bIsSavedReport ) {

				content["ui.object"] = this.getSavedReportSearchPath( sSavedItem );

				//for backwards compatibility
				if( !this.getAttributeValue('savedReportPath' ) && this.getAttributeValue('savedReportName' ) )
				{
					content["savedReportName"] = sSavedItem;
				}

				content["widget.isSavedReport"] = 'true';
				content["ui.reRunObj"] = this.getSavedReportSearchPath( sSavedItem );
			} else {
				content["ui.object"] = sOriginalItem;

				//check for G!D properties to upgrade
				if( sFlexParamProperties && sFlexParamProperties.length > 0)
				{
					content["flexParamProperties"] = sFlexParamProperties;
				}

				if( sFlexPromptData && sFlexPromptData.length > 0)
				{
					content["gdPromptAnswers"] = sFlexPromptData;
				}//end of G!D properties check
			}

			content["originalReport"] = sOriginalItem;
		}

		// widget saved to specific output
		if (this.getAttributeValue("savedOutputSearchPath") != null) {
			this.setSavedOutputSearchPath(this.getAttributeValue("savedOutputSearchPath"));
			content["ui.savedOutputSearchPath"] = this.getAttributeValue("savedOutputSearchPath");
			content["ui.action"] = "buxView";
		}
		// widget saved to view most recent output
		else if (this.getAttributeValue("mostRecentSavedOutput") == "true") {
			content["ui.action"] = "buxView";
		}
		// we have a copied report under the dashboard
		else if (bIsSavedReport) {
			if( this.getAttributeValue( "limitedInteractiveMode" ) === "true" ) {
				content["limitedInteractiveMode"] = "true";
				content["ui.action"] = "run";
				content["run.xslURL"] = "bux.xsl";
			}
			else
			{
				content["ui.action"] = "bux";
			}

			if( this.getRunReportOption() !== null )
			{
				content['widget.runReport'] = ( this.getRunReportOption() ) ? 'true' : 'false' ;

				/**
				 * This triggers getParameters in the case of delayed viewer loading and widget needs to handle
				 * share prompt event and there is not parameters saved.
				 */
				if( this.getDoGetParametersOnLoad() ){
					content['widget.globalPromptInfo'] = '<globalPromptInfo></globalPromptInfo>';
				}
				this.resetRunReportOption();
			}
		}
		// user dragged a report part to the canvas
		else if (sOriginalReportPart && sOriginalReportPart.length > 0 && this.copyPasteResource == null) {
			content["ui.reportDrop"] = "true";
			content["ui.action"] = "bux";
			content["reportpart_id"] = sOriginalReportPart;
		}
		// specification passed in from bux copy/paste
		else if (this.copyPasteResource) {
			if (this.ciPublishedReportPath != null) {
				//used to query envionment variables such as object permissions
				content["ui.object"] = this.ciPublishedReportPath;
			}
			var resource = dojo.fromJson(this.copyPasteResource);
			if (resource[0] && resource[0].body) {
				var conversation = this.getAttributeValue("copy.conversation");
				if (conversation) {
					content["ui.conversation"] = conversation;
				}
				if (resource[0].body.specification ) {
					content["ui.spec"] = resource[0].body.specification;
					content["ui.action"] = "buxCopyPaste";
					if (this.getAttributeValue("reportCreatedInCW") === "true") {
						content["cv.objectPermissions"] = "read write execute setPolicy traverse";
					}
				} else {
					//in case as with "LimitedInteractiveMode" when there is no report spec in resource
					content["ui.reportDrop"] = "true";
					content["ui.action"] = "buxDropReportOnCanvas";
				}
			}

		}
		// specification passed in from container
		else if (this.sInitialSpec) {
			content["ui.spec"] = this.sInitialSpec;
			content["ui.action"] = "buxRunSpecification";
			content["cv.objectPermissions"] = "read write execute setPolicy traverse";
		}
		else if (this._newReportInfo) {
			for (prop in this._newReportInfo) {
				content[prop] = this._newReportInfo[prop];
			} 
			content["ui.reportDrop"] = "true";
			content["ui.action"] = "bux";
			content["cv.objectPermissions"] = "read write execute setPolicy traverse";
			content["ui.objectClass"] = "report";
			content["openReportFromClipboard"] = "true";
		}
		// user dragged a report to the canvas
		else {
			content["ui.reportDrop"] = "true";
			content["ui.action"] = "buxDropReportOnCanvas";
		}

		if( bPromptUser !== null )
		{
			content["run.prompt"] = (bPromptUser ? "true" : "false");
		}


		if (this.getAttributeValue("lastLocaleSaved") != null) {
			content["lastLocaleSaved"] = this.getAttributeValue("lastLocaleSaved");
		}
		var dataFiltersParam = "";
		if (this.copyPasteResource){
			dataFiltersParam = this.updateCopyPasteFilters(filters);
		}else {
			dataFiltersParam = this.buildDataFiltersParam(filters);
			if (typeof filters=="undefined" || filters==null) {
				dataFiltersParam = this.buildFiltersParamFromLoadedSliderState();
			}
		}

		if(dataFiltersParam != "")
		{
			content["cv.updateDataFilters"] = dataFiltersParam;
		}

		if (this.properties && this.properties.getFlashCharts() !== null) {
			content["savedFlashChartOption"] = (this.properties.getFlashCharts() ? "true" : "false");
			var isAVS = this.getAttributeValue("hasAVSChart");
			if (isAVS == "true") {
				content["hasAVSChart"] = "true";
			}
			else {
				content["hasAVSChart"] = "false";
			}
		}

		if (this.properties.getRowsPerPage() != null)
		{
			content["run.verticalElements"] = this.properties.getRowsPerPage();
		}

		var enablePromptAndDrillEventsByDefault = this.getAttributeValue("syncNewWidgets");
		if(enablePromptAndDrillEventsByDefault === null || enablePromptAndDrillEventsByDefault === "true") {
			enablePromptAndDrillEventsByDefault = true;
		} else {
			enablePromptAndDrillEventsByDefault = false;
		}

		if ( !bIsSavedReport  && enablePromptAndDrillEventsByDefault) {
			var globalPrompts = this.getGlobalPromptsInfo();
			if (globalPrompts !== null ) {
				content["widget.globalPromptInfo"] = globalPrompts;
			}
		}
		if (this.isOpeningSavedDashboard()) {
			content["ui.preserveRapTags"] = "true";
		}
		if( bIsSavedReport === true && this.getAttributeValue( "limitedInteractiveMode" ) !== "true" )
		{
			this.getUserId();
		}

		if( window.cognosViewerDebug )
		{
			content.debug = true;
		}

		content["cv.buxCurrentUserRole"] = this.getUserRole();

		if (this.shouldUseSavedReportInfo()) {
			content["rap.getReportInfo"] = "false";
		}
		//Add dashboard information, such as title, searchPath and widget information, such as title to content
		if(window.icdConfig && window.icdConfig.ZIPIMode != "0"){
			this.addBUXRTStateInfoToContent(content);
		}
		
		this.addBUXWidgetTitleToContent(content);
		
		return content;
	},
	
	addBUXRTStateInfoToContent: function(content/*HashMap of form fields*/){
		if(content != null){
			var sStateInfo = this.getBUXRTStateInfoMap();/*XML String*/
			if(sStateInfo && sStateInfo.length >0){
				content["cv.buxRTStateInfo"] = sStateInfo;
			}
		}
	},
	
	addBUXWidgetTitleToContent: function(content/*HashMap of form fields*/){
		if(content != null){
			var sWidgetTitle = this.getAttributeValue("widgetTitle");
			if(sWidgetTitle && sWidgetTitle.length >0){
				content["widgetTitle"] = sWidgetTitle;//Default Widget Title, Same String as original report name
			}
			var sDisplayTitle = this.getDisplayName();
			if(sDisplayTitle && sDisplayTitle.length >0){
				content["displayTitle"] = sDisplayTitle;//Custom Widget title for the given content locale
			}
		}
	},

	addUserParamsToContent: function( content) {
		var userParams = this.getAttributeValue("userParams");
		if( !userParams) { return; }
		var doc = XMLBuilderLoadXMLFromString( userParams );
		if( !doc ){ return; }
		var eItems = XMLHelper_FindChildrenByTagName( doc.documentElement, 'item', false );
		var count = eItems.length;
		for( var i = 0; i < count; i++ ){
			if( !eItems[i] ){ continue; }
			var paramNameElem = XMLHelper_FindChildByTagName( eItems[i], 'name', false );
			if( !paramNameElem ){ continue; }
			var paramValueElem = XMLHelper_FindChildByTagName( eItems[i], 'value', false );
			content[ XMLHelper_GetText( paramNameElem ) ] = ( !paramValueElem ? '' : XMLHelper_GetText( paramValueElem ) );
		}

		if (count > 0) {
			content["widget.userParameters"] = "true";
			if (this.getAttributeValue( "viewerReportPrompts")) {
				content["viewerReportPrompts"] = this.getAttributeValue( "viewerReportPrompts");
			}
		}

		this.removeAttributeValue("userParams");
	},

	shouldUseSavedReportInfo: function() {
		return this.getAttributeValue("rapReportInfoVersion") === this.RAP_REPORT_INFO_VERSION && this.getAttributeValue("rapReportInfo") != null;
	},

	isConsumeUser: function() {
		return this.getUserRole() === 'consume';
	},

	getUserRole: function() {
		var userRole = null;
		var userProfileItemSet = this.iContext.getItemSet("buxuserprofile", false);
		if( userProfileItemSet ){
			userRole = userProfileItemSet.getItemValue("currentUserRole");
		}
		return userRole == null ? "assemble" : userRole;
	},

	getUserId : function()
	{
		dojo["require"]("bux.UserAccount"); //@lazyload
		// get user account info
		return bux.UserAccount.getUserAccount().then(
			/*callback*/ dojo.hitch( this, function(userAccount){
				this.m_sUserId = userAccount.cm$searchPath;
				return this.m_sUserId; }
		));
	},

	_genMobileFormFieldPayload : function(form) {
		var formFieldsPayload = {};

		var inputNodes = form.getElementsByTagName("input");
		if (inputNodes) {
			for (var i=0; i < inputNodes.length; i++) {
				var name = inputNodes[i].getAttribute("name");
				var value = inputNodes[i].getAttribute("value");
				if (name && value) {
					formFieldsPayload[name] = value;
				}
			}
		}

		return formFieldsPayload;
	},

	launchGotoPageForIWidgetMobile : function(form) {
		var payload = {
				"action" : "goto",
				"payload" : this._genMobileFormFieldPayload(form)
		};

		if (typeof console != "undefined" && console && console.log) {
			console.log(payload);
		}
		this.fireEvent("com.ibm.bux.widget.openView", null, payload);
	},

	executeDrillThroughForIWidgetMobile : function(form) {
		var aCells = getChildElementsByAttribute(form, "input", "name", "ui.action");
		if (aCells && aCells.length > 0) {
			aCells[0].setAttribute("value", "authoredDrillThroughMobile");
		}

		var payload = {
				"action" : "drillThrough",
				"payload" : this._genMobileFormFieldPayload(form)
		};

		if (typeof console != "undefined" && console && console.log) {
			console.log(payload);
		}
		this.fireEvent("com.ibm.bux.widget.openView", null, payload);
	},

	isBuxAvailable: function()
	{
		return (this.bux && this.bux._base ? true : false);
	},

	/**
	 * return one or more drill optionsas a JSON object
	 */
	getDrillOptions: function(){
		return this.properties.getDrillOptions();
	},

	getPromptRunOption: function( sFlexPromptData, bIsSavedReport )
	{
		if( !bIsSavedReport && sFlexPromptData && sFlexPromptData.length > 0)
		{
			//don't prompt if upgrading G!D with saved prompt answers
			return false;
		}
		else if( bIsSavedReport )
		{
			//this is a saved report, use the saved property values
			return this.properties.getPromptUserOnLoad();
		}
		else
		{
			return null;
		}
	},
	buildDataFiltersParam: function(filters) {
		var updateDataFilters = "";
		if(filters && filters.length > 0)
		{
			this.sliderState={};
			updateDataFilters = "<UpdateDataFilters>";
			for(var filter = 0; filter < filters.length; ++filter) {
				var filterDetails =filters[filter];
				var filterObj = dojo.fromJson(filterDetails);
				
				// If the fileter came from this widget (selection filter) then ignore it
				if (filterObj.clientId == this.getWidgetId()) {
					continue;
				}
				
				if (!(filterObj["com.ibm.widget.context.bux.selectValueControl"])) {
					this.m_oWidgetContextManager.convertSelectionToSelectValueControlPayload(filterObj);
					this.m_oWidgetContextManager.convertGenericToSelectValueControlPayload(filterObj);
					filterDetails = dojo.toJson(filterObj);
				}
				updateDataFilters += "<filter>" + xml_encode(filterDetails) + "</filter>";
				this.sliderState[filterObj.clientId] =filterDetails;
			}

			updateDataFilters += "</UpdateDataFilters>";
		}
		return updateDataFilters;
	},

	updateCopyPasteFilters: function (filters) {
		this.loadSliderState();
		if(this.sliderState) {
			//update sliderState to set block that will remove filter form report
			for(var sliderID in this.sliderState) {
				this.sliderState[sliderID] = "{'clientId':'" +sliderID + "',	'com.ibm.widget.context':{},'com.ibm.widget.context.bux.selectValueControl':" +
				"{'selectValueControl':{'id':'" + sliderID + "','controlType':'slider','type':'discrete','valueType':'string'}}}";
			}
		}

		if (filters && filters.length > 0) {
			//apply filter values to the matching slider id
			for (var filter = 0; filter < filters.length; ++filter)	{
				var filterDetails = filters[filter];
				var filterObj = dojo.fromJson(filterDetails);
				if (filterObj["com.ibm.widget.context.bux.selection"]) {
					this.m_oWidgetContextManager.convertSelectionToSelectValueControlPayload(filterObj);
					this.m_oWidgetContextManager.convertGenericToSelectValueControlPayload(filterObj);
					filterDetails = dojo.toJson(filterObj);
				}
				
				this.sliderState[filterObj.clientId] = filterDetails;
			}
		}

		return this.buildDataFiltersParam_fromState();
	},

	buildFiltersParamFromLoadedSliderState: function() {
		var dataFiltersParam = "";
		this.loadSliderState();
		dataFiltersParam = this.buildDataFiltersParam_fromState();
		return dataFiltersParam;
	},

	loadSliderState: function() {
		this.sliderState={}; //Clear any previous slider state.
		var sliderIDs   = dojo.fromJson(this.getAttributeValue("sliderIDs"));
		if (sliderIDs) {
			for (var i=0; i<sliderIDs.length; ++i) {
				var sliderID = sliderIDs[i];
				var savedState = this.getItemValue("sliderState_" + sliderID);
				if (savedState!=null && savedState!="") {
					this.sliderState[sliderID] = savedState;
				}
			}
		}
	},
	buildDataFiltersParam_fromState: function() {
		var updateDataFilters = "";
		if(this.sliderState) {
			for(var sliderID in this.sliderState)	{
				updateDataFilters += "<filter>" + xml_encode(this.sliderState[sliderID]) + "</filter>";
			}
			if (updateDataFilters!=="") {
				return ("<UpdateDataFilters>" + updateDataFilters + "</UpdateDataFilters>");
			}
		}
		return updateDataFilters;
	},
	loadContent: function(response) {
		var oReportDiv = dojo.byId("_" + this.iContext.widgetId + "_cv");
		this.loadStylesAndScripts(response, oReportDiv, true);
		if (!window.gScriptLoader.hasCompletedExecution()) {
			var obj = this;
			this.timer = setInterval(function(){
				window.gInitializeViewer(obj);
			}, this.timerInterval);
		}
		else {
			window.gInitializeViewer(this);
		}
		this.viewerWidgetLastAction = null;
	},
	executeAction: function(evt, action) {
		var viewerObject = this.getViewerObject();
		if( evt && viewerObject ) {
			var sAction = action ? action : evt.payload.name;
			var payload = evt.payload;
			// payload = '' seems valid ???
			if(sAction && typeof payload != "undefined" && payload != null) {
				if(evt.payload.payload) {
					payload = evt.payload.payload;
				}
				viewerObject.executeAction(sAction, payload);
			}
		}
	},

	onContextMenuAction: function(evt) {
		this.executeAction(evt);
	},
	onToolbarAction: function(evt) {
		this.executeAction(evt);
	},

	updateToolbar: function() {
		var viewerObject = this.getViewerObject();
		if (!viewerObject || (!this.bToolbarInitialized && typeof CognosViewerAction != "function")) {
			return;
		}

		if(viewerObject.getStatus() === 'prompting')
		{
			return;
		}

		var toolbarPayload = viewerObject.getToolbar();
		CCognosViewerToolbarHelper.updateToolbarForCurrentSelection(viewerObject, toolbarPayload);

		this.fireEvent("com.ibm.bux.widgetchrome.toolbar.init", null, viewerObject.getToolbar());
	},

	/**
	 * Called when the widget gets focus
	 */
	onSelect: function() {
		// The first time we get focus we need to update the toolbar
		if (!this.bToolbarInitialized) {
			this.bToolbarInitialized = true;
			var viewerObject = this.getViewerObject();
			if (viewerObject) {
				var status = viewerObject.getStatus();
				if (status !== "prompting" && status !== "working" && status != "stillWorking") {
					this.updateToolbar();
				}
			}
		}

		this.fireEvent("com.ibm.bux.widget.select.done", null, {});
	},

	hideToolbarAndContextMenu: function()
	{
		this.fireEvent("com.ibm.bux.widget.contextMenu.update");
		this.fireEvent("com.ibm.bux.widgetchrome.toolbar.init");
	},

	updateSavedAttributes: function( attribType )
	{
		this.setAttributeValue( "version", this.BUX_REPORT_VERSION );
		this.setAttributeValue( "viewerProperties", this.properties.toString() );
		
		//selection objects
		if (this.m_oWidgetContextManager.getSelectionFilterObjects()) {
			this.setAttributeValue( "selectionObjects", this.m_oWidgetContextManager.toStringSelectionFilterObjects() );
		}
		
		//saving attributes specific to live report
		if( attribType === 'live' )
		{
			var oCV = this.getViewerObject();
			var reportPrompts = this.getEnvParam("reportPrompts");
			if ( this.promptParametersRetrieved == true && reportPrompts && reportPrompts.length > 0 ) {
				this.setAttributeValue( "viewerReportPrompts", this.getEnvParam("reportPrompts"));
			}
			this.setAttributeValue( "promptParametersRetrieved", (this.promptParametersRetrieved ? "true" : "false") );
			
			this.setAttributeValue("selectionFilterEnabled", this.m_bSelectionFilterSwitch ? "true" : "false");

			// flag needed to disable the snapshots menu on a dashboard open
			if (this.getEnvParam("reportpart_id") && this.getEnvParam("reportpart_id").length > 0)
			{
				this.setAttributeValue("fromReportPart", "true");
			}

			if( this.isLimitedInteractiveMode() )
			{
				this.setAttributeValue( "limitedInteractiveMode", "true" );
			}
			else
			{
				//need to set this only if report is not report view
				this.setAttributeValue( "baseReportModificationTime", oCV.envParams["baseReportModificationTime"]);
			}

			var contentLocale = oCV.envParams["contentLocale"];
			if (contentLocale != null) {
				this.saveSliderState();
				this.setAttributeValue( "lastLocaleSaved", contentLocale );
			}

			this.setAttributeValue( "originalReportLocation", oCV.envParams["originalReportLocation"]);


			this.setAttributeValue("hasAVSChart", oCV.hasAVSChart() ? "true" : "false");

			// the displayTypes property is used for thumbnails
			this.setAttributeValue("displayTypes", this.getDisplayTypes());

			// clear the cached available outputs
			this.setSavedOutputsCMResponse(null);

			if (oCV.getPinFreezeManager()) {
				var sPinFreezeInfo = oCV.getPinFreezeManager().toJSONString();
				this.setAttributeValue("PinFreezeInfo", sPinFreezeInfo);
			}

			if (oCV.envParams["rapReportInfo"]) {
				this.setAttributeValue("rapReportInfoVersion", this.RAP_REPORT_INFO_VERSION);
				this.setAttributeValue("rapReportInfo", oCV.envParams["rapReportInfo"]);
			}
		}

		//saving attributes sepecific to saved output
		if( attribType === 'savedOutput')
		{
			if (this.getSavedOutputSearchPath() == null) {
				this.setAttributeValue("mostRecentSavedOutput", "true");
			}
			else {
				this.setAttributeValue( "savedOutputSearchPath", this.getSavedOutputSearchPath());
			}
			
			this.setAttributeValue("selectionFilterEnabled", this.m_bSelectionFilterSwitch ? "true" : "false");
		}
	},

	onItemSetChanged: function(event)
	{
		//Only update item set if we have a viewer.
		if(this.getViewerObject()) {
			var aChangedItemSets = event.payload.changes;
			for( var i in aChangedItemSets)
			{
				if( aChangedItemSets[i].id === 'savedReportPath' && aChangedItemSets[i].newVal ){
					this.updateCVEnvParam();
				}
			}
		}
	},

	/**
	 * This function is called only after a successful save.
	 */
	updateCVEnvParam: function() {
		var oCV = this.getViewerObject();
		oCV.envParams["ui.objectClass"] = this.isSavedOutput() ? 'reportView' : 'report' ;
		oCV.envParams["widget.isSavedReport"] = 'true';

		// for backwards compatibility
		var savedReportName = this.getAttributeValue('savedReportName' );
		if( savedReportName )
		{
			oCV.envParams["ui.object"] = savedReportName;
			oCV.envParams["savedReportName"] = savedReportName;
		}
		else
		{
			oCV.envParams["ui.object"] = this.getAttributeValue( 'savedReportPath');
		}

	},

	onWidgetSave: function(evt) {
		var viewerObject = this.getViewerObject();
		var saveDonePayload = {'status':false};
		//adding copy.conversation parameter for the bux copy/paste action
		if (evt && evt.payload && evt.payload.isCopy === true ) {
			this.setAttributeValue("copy.conversation", viewerObject.getConversation());
		} else {
			//we remove parameters after saving widget
			this.removeItem("copy.conversation");
			this.removeItem("copy.ciPublishedReportPath");
		}
		
		var isSaveAs = evt && evt.payload && evt.payload.operation == "saveAs" ? true : false;

		// If we're doing a save and the Viewer isn't loaded there's no need to do anything
		if( !viewerObject && !isSaveAs) {
			this.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload);
			return;
		}

		this.getLoadManager().runWhenHasViewer(dojo.hitch(this, function() {
			var viewerObject = this.getViewerObject();

			viewerObject.loadExtra();

			if( this.isSavedOutput() )
			{
				this.cleanSavedAttributes();
				this.updateSavedAttributes( "savedOutput" );
				saveDonePayload.status = true;
				this.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload);
			}
			else if(this.sInitialSpec)
			{
				// just update the attribute with the latest spec
				saveDonePayload.status = true;
				this.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload);
			}
			else
			{
				var permissions = this.getEnvParam("cv.objectPermissions");
				var widgetSave = new ViewerIWidgetSave( this, evt.payload );
				
				if( !widgetSave.canSave( permissions ) )
				{
					this.showErrorMessage( RV_RES.IDS_CANNOT_SAVE_CONTENT_ERROR );
					this.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload);
					return;
				}

				/**
				 * Make sure we have a report spec or that we're in limited mode before trying to create a report/reportView under
				 * the dashboard in CM. We won't have a report spec if a report is still running when the user tries to save the dashboard
				 * bug COGCQ00277254
				 */
				if (this.isLimitedInteractiveMode() || (viewerObject.envParams["ui.spec"] && viewerObject.envParams["ui.spec"].length > 0)) {
					this.cleanSavedAttributes();
					this.updateSavedAttributes( "live" );

					if(widgetSave.doGetSavePropertiesFromServer()) {
						widgetSave.getSavePropertiesFromServer();
					} 
					else {
						this.doWidgetSaveDone(widgetSave);
					}
				} 
				else if (!viewerObject.envParams["ui.spec"]) {
					// We don't have a ui.spec and we're not in limited interactive mode, ask CW to do a copy for us
					widgetSave.setDoCWCopy(true);
					this.doWidgetSaveDone(widgetSave);
				}
				else {
					this.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload);
				}
			}			
		}), evt);
	},

	doWidgetSaveDone : function( widgetSave )
	{
		var saveDonePayload = widgetSave.getPayload();
		saveDonePayload.status = true;
		if(window.icdConfig && window.icdConfig.ZIPIMode != "0"){
			var oDashboard = widgetSave.m_payload.dashboard;
			if(oDashboard){
				this._BUXDBInfoArray = this.getBUXDBInfoArray({dbTitle: oDashboard.title._text, dbSearchPath: oDashboard.cm$searchPath});
			}
		}
		
		this.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload);
	},

	handleGetSavePropertiesFromServerResponse : function( serverResponse, savePayload )
	{
		var widgetSave = new ViewerIWidgetSave( this, savePayload );
		if( serverResponse && serverResponse.getJSONResponseObject() ){
			applyJSONProperties( this.getViewerObject(), serverResponse.getJSONResponseObject() );
		}

		this.doWidgetSaveDone( widgetSave );
	},

	/**
	 * check if the saved BUX report was built from pre Caspian RP1 release.
	 */
	isPreCaspianRP1BUXReport: function(){
		var sContentVersion =  this.getAttributeValue( "version" );
		if(!sContentVersion || sContentVersion < this.BUX_REPORT_CASPIAN_RP1_VERSION ){
			return true;
		}
		return false;
	},


	/*
	 * Return true if we are opening/upgrading a go dashboard version report.
	 */
	isGoDashboardReportUpgrade: function() {
		var contentVersion = this.getAttributeValue( "version" );
		if (contentVersion==this.GODASHBOARD_REPORT_VERSION) {
			//This is a G!D report being upgraded
			return true;
		}
		return false;
	},

	/*
	 * Return true if we are opening/upgrading a saved dashboard.
	 */
	isOpeningSavedDashboard: function() {
		var viewerProperties = this.getAttributeValue( "viewerProperties");
		//Once saved, viewer properties will be set as a JSON object.
		//Prior to that, they will be <empty> or not defined.
		if ((viewerProperties && viewerProperties.indexOf("{")===0) || this.isGoDashboardReportUpgrade()) {
			return true;
		}
		return false;
	},

	/*
	 * Reset all the attributes we save so there's no issue when switching from
	 * a live report and a saved output
	 */
	cleanSavedAttributes: function() {
		this.removeAttributeValue("savedOutputSearchPath");
		this.removeAttributeValue("mostRecentSavedOutput");
		this.removeAttributeValue("savedReportName");
		this.removeAttributeValue("dashboardID");
		this.removeAttributeValue("savedReportId");
		this.removeAttributeValue("baseReportModificationTime");
		this.removeAttributeValue("viewerReportPrompts");
		this.removeAttributeValue("promptParametersRetrieved");
		this.removeAttributeValue("selectionFilterEnabled");
		this.removeAttributeValue("PinFreezeInfo");
		this.removeAttributeValue("rapReportInfoVersion");
		this.removeAttributeValue("rapReportInfo");
		this.removeAttributeValue("selectionObjects");

		if( this.isSavedOutput())
		{
			//this is set by chrome and shouldn't be remove unless switching from live to saved output.
			this.removeAttributeValue("savedReportPath");
		}
	},


	handleWidgetSaveDone: function( asynchJSONResponse ) {
		var oCV = this.getViewerObject();
		var jsonResult = asynchJSONResponse.getResult();
		if (jsonResult===null) {
			jsonResult = {};
		}

		this.cleanSavedAttributes();
		this.updateSavedAttributes( "live" );

		var reportName = jsonResult.reportName;
		var dashboardID = jsonResult.dashboard_id;
		this.setAttributeValue( "savedReportName", reportName );
		this.setAttributeValue("dashboardID", '$$dbid$$' + dashboardID );

		if (jsonResult.permissions) {
			oCV.envParams["cv.objectPermissions"] = jsonResult.permissions;
		}

		if (jsonResult.objectClass) {
			oCV.envParams["ui.objectClass"] = jsonResult.objectClass;
		}

		// flag needed to disable the snapshots menu on a dashboard open
		if (this.getEnvParam("reportpart_id") && this.getEnvParam("reportpart_id").length > 0)
		{
			this.setAttributeValue("fromReportPart", "true");
		}

		if( this.isLimitedInteractiveMode() )
		{
			this.setAttributeValue( "limitedInteractiveMode", "true" );
		}
		else
		{
			this.setAttributeValue( "baseReportModificationTime", oCV.envParams["baseReportModificationTime"]);
		}

		var contentLocale = oCV.envParams["contentLocale"];
		if (contentLocale != null) {
			this.saveSliderState();
			this.setAttributeValue( "lastLocaleSaved", contentLocale );
		}

		this.setAttributeValue( "originalReportLocation", oCV.envParams["originalReportLocation"]);

		oCV.envParams["ui.object"] = this.getSavedReportSearchPath( reportName );
		oCV.envParams["savedReportName"] = reportName;

		this.setAttributeValue("hasAVSChart", oCV.hasAVSChart() ? "true" : "false");

		// the displayTypes property is used for thumbnails
		this.setAttributeValue("displayTypes", this.getDisplayTypes());

		// clear the cached available outputs
		this.setSavedOutputsCMResponse(null);

		var saveDonePayload = {'status':true};
		this.fireEvent( "com.ibm.bux.widget.save.done", null, saveDonePayload );

	},

	getDisplayTypes: function() {
		var oCV = this.getViewerObject();
		if (oCV.getRAPReportInfo()) {
			return oCV.getRAPReportInfo().getDisplayTypes();
		}
	},

	saveSliderState: function () {
		//Save slider events that correspond to reportInfo....remove the rest.
		var viewerObject = this.getViewerObject();
		var oRAPReportInfo = viewerObject.getRAPReportInfo();
		var reportInfoSliders = {};
		if (oRAPReportInfo) {
			reportInfoSliders = oRAPReportInfo.collectSliderSetFromReportInfo();
		}
		var i=0;
		var sliderIDsToSave = [];
		for(var sliderIDFromState in this.sliderState) {
			if (typeof reportInfoSliders[sliderIDFromState] != "undefined") {
				this.setItemValue("sliderState_" + sliderIDFromState, this.sliderState[sliderIDFromState]);
				sliderIDsToSave[i++]=sliderIDFromState;
			} else {
				this.removeItem("sliderState_" + sliderIDFromState);
			}
		}
		this.setAttributeValue("sliderIDs", dojo.toJson(sliderIDsToSave));
	},

	onWidgetRefresh: function ( evt ){
		//TODO: Payload.status and Payload.message for widget.refresh.done
		//      It is not necessary for now
		var refreshDonePayload = {};
		var viewerObject = this.getViewerObject();
		if( evt && viewerObject){
			if (viewerObject.envParams["ui.action"] == "view" || viewerObject.envParams["ui.action"] == "buxView") {
				viewerObject.executeAction( "RefreshViewEvent" );
			} else {
				/* TODO: Cleaning up, the following first IF condition branch is not being exercised in any case
				 * Currently, BUX Chrome will reload the whole dashboard after preferences settings change is detected.
				 */
				if (evt.payload && evt.payload.refreshType == "preferencesChanged") {
					this.clearRAPCache();
					viewerObject.executeAction( "EditContent", {"preferencesChanged" : true} );
					viewerObject.executeAction( "Reprompt", {"preferencesChanged" : true} );
				} else {
					//Delay Refresh ('Run') this viewer object on hidden tabs
					if(!this.isVisible()) {
						this.getDelayedLoadingContext().setForceRunReport(true);
					}else{
						viewerObject.executeAction( "Refresh" );
					}
				}
			}
			this.fireEvent( "com.ibm.bux.widget.refresh.done", null, refreshDonePayload);
		}
	},


	invokeDisplayTypeDialog: function( targetTypes, suggestedDisplayTypes )
	{
		if( !this.m_chart )
		{
			this.m_chart = new bux.reportViewer.chart( );
		}

		var dialogDefinition = this.m_chart.getDisplayTypeDialogDefinition( targetTypes );

		var payload= { 'supportedChartTypes' : dialogDefinition, 'suggestedDisplayTypes' : suggestedDisplayTypes };
		this.fireEvent("com.ibm.bux.widget.invokeDisplayTypeDialog", null, payload );
	},

	onChangeDisplayType: function(evt) {
		var viewerObject = this.getViewerObject();
		if(evt && viewerObject) {
			viewerObject.executeAction( "ChangeDisplayType", evt.payload );
		}
	},

	onDisplayTypeDialogVariations: function(evt) {
		var viewerObject = this.getViewerObject();
		if(evt && viewerObject) {
			viewerObject.executeAction( "ChangeDisplayVariations", evt.payload );
		}
	},

	updateDisplayTypeDialogVariations: function(targetTypes, variationGroups )
	{
		if( !this.m_chart )
		{
			this.m_chart = new bux.reportViewer.chart( );
		}

		var dialogDefinition = this.m_chart.getDisplayTypeDialogDefinition( targetTypes );

		var payload= { 'supportedChartTypes' : dialogDefinition, 'variationGroups' : variationGroups };
		this.fireEvent("com.ibm.bux.widget.updateDisplayTypeDialogVariations", null, payload );
	},

	onGetDisplayTitleDone: function(evt) {
		if(evt && evt.payload && evt.payload.callback) {
			evt.payload.callback(evt.payload.title);
		}		 
	},

	/**
	 * @return a value which can be parsed by dojo.when(), which resolves to
	 * the storeid
	 */
	getWidgetStoreID: function()
	{
		if(typeof this.widgetStoreId === "undefined") {
			if(!this.widgetStoreIdDfd) {
				this.widgetStoreIdDfd = new dojo.Deferred();
			}
			return this.widgetStoreIdDfd;
		}
		return this.widgetStoreId;
	},

	setWidgetStoreID: function(storeId) {
		this.widgetStoreId = storeId;
		if(this.widgetStoreIdDfd) {
			this.widgetStoreIdDfd.callback(this.widgetStoreId);
			this.widgetStoreIdDfd = null;
		}
	},

	onUpdateWidgetStoreIDDone: function(evt) {
		var widgetStoreID = evt.payload.storeID;

		var storeIDStr = 'storeID("';
		if( widgetStoreID && (widgetStoreID.indexOf( storeIDStr ) > -1) )
		{
			//If there's a storeID(...), strip it out.
			widgetStoreID = widgetStoreID.substr(storeIDStr.length, widgetStoreID.length - storeIDStr.length - 1);
		}

		dojo.when(this.getWidgetStoreID(),
			/*callback*/dojo.hitch(this, function(widgetOldStoreID) {
				if(widgetOldStoreID && widgetOldStoreID != widgetStoreID) {
					this._copyComments(widgetOldStoreID, widgetStoreID);
				}
			})
		);

		this.setWidgetStoreID(widgetStoreID);
	},

	//TODO: Move this to AnnotationHelper
	_copyComments: function(widgetOldStoreID, widgetStoreID) {
		var postUrl = this.buildPostUrl();
		if(postUrl) {
			//clone the annotations
			var httpRequest = new XmlHttpObject();

			httpRequest.addFormField("b_action", "cognosViewer");
			httpRequest.addFormField("widgetOldStoreID", widgetOldStoreID);
			httpRequest.addFormField("widgetStoreID", widgetStoreID);
			httpRequest.addFormField("ui.action", "cloneAnnotations");
			httpRequest.addFormField("cv.responseFormat", "json");

			//send asynchronous request
			httpRequest.sendHtmlRequest("POST", postUrl, "", true);
		}
	},

	onRemoveDone: function(evt) {
		this.destroy();
	},
	onGetProperties : function (evt)
	{
		this.initializeProperties();
		this.fireEvent("com.ibm.bux.widget.properties.get.done", null, this.properties.onGet() );
	},

	onSetProperties : function (evt)
	{
		if( evt && evt.payload && evt.payload.properties )
		{
			this.properties.onSet( evt.payload );
		}

		this.fireEvent("com.ibm.bux.widget.properties.set.done");
		var modifiedEventPayload = {'modified':true};
		this.fireEvent("com.ibm.bux.widget.modified", null, modifiedEventPayload);
	},

	getProperties : function ()
	{
		return this.properties;
	},

	clearPropertiesDialog : function() {
		if (this.properties) {
			this.properties.clearDialogSpec();
		}
	},

	onGenericSelectValueControl: function(evt, bResetFirst) {
		// clone the event so we can filter out values which have
		if(evt) {
			this.getLoadManager().runWhenHasViewer(dojo.hitch(this, function() {
				//we process event only when viewer is loaded
				var bRequestSentToServer = false;
				var filterPayload = this._getFilterPayload( evt );
				var selectValueControlType = (this.m_oWidgetContextManager) ? this.m_oWidgetContextManager.getSelectValueControlTypeFromPayload(filterPayload) : null;
				if(selectValueControlType && selectValueControlType!=="facet") {
					var clonedEvent = dojo.clone(evt);
					this.preProcessFilterValues(clonedEvent);
					this.m_oWidgetContextManager.updateFilterContext(clonedEvent.payload);
					bRequestSentToServer = this.onFilter(clonedEvent, bResetFirst);
				} else {
					this.m_oWidgetContextManager.updateFilterContext(filterPayload);
					bRequestSentToServer =  this.onFilter(evt, bResetFirst);
				}
				//return value used by ViewerLoadManager.prototype.processQueue function
				return bRequestSentToServer;
			}), evt.source);
		}
	},
	
	onFilter: function(evt, bResetFirst) {
		if(evt) {
			this.getLoadManager().runWhenHasViewer(dojo.hitch(this, function() {
				var bRequestSentToServer = false;

				if( this.isLiveReport() === false ){
					return bRequestSentToServer;
				}

				var filterPayload = this._getFilterPayload( evt );
				var selectValueControlType = (this.m_oWidgetContextManager) ? this.m_oWidgetContextManager.getSelectValueControlTypeFromPayload(filterPayload) : null;
				
				var filterPayloadItemName = null;
				var names = this.m_oWidgetContextManager.getItemNames(filterPayload);
				var bCanFilter = false;
				for(var i=0; !bCanFilter && i<names.length; i++) {
					filterPayloadItemName = names[i];
					bCanFilter = this.canFilter(filterPayload, filterPayloadItemName, selectValueControlType, evt )
				}
				
				if (filterPayloadItemName==null && !bCanFilter) {
					//reset request
					bCanFilter = this.canFilter(filterPayload, filterPayloadItemName, selectValueControlType, evt )
				}

				if(bCanFilter) {
					var actionRequestParms = {};
					var aDrillResetHUN = this._getDrillResetHUNForFacet( filterPayloadItemName, selectValueControlType);
					if( aDrillResetHUN && aDrillResetHUN.length > 0 ){
						actionRequestParms.drillResetHUN = aDrillResetHUN;
					}

					var filterPayloadStr = (evt.type=="string") ? evt.payload : dojo.toJson( evt.payload );
					this.sliderState[evt.source] = filterPayloadStr;
					actionRequestParms.filterPayload = filterPayloadStr;
					actionRequestParms.isFacet = ("facet"===selectValueControlType);	//only set for generic context (ie: not <filter> form)
					
					if (bResetFirst) {
						actionRequestParms.forceCleanup = this.m_oWidgetContextManager.genRemoveDiscreteFilterPayload(this.getWidgetId());
					}
					this.getViewerObject().executeAction("UpdateDataFilter", actionRequestParms);

					if(!this.shouldReportBeRunOnAction()) {
						this.getLoadManager().getDelayedLoadingContext().setForceRunReport(true);
					}

					bRequestSentToServer = true;
				}
				return bRequestSentToServer;
			}), evt.source);
		}
	},

	clearSelectionFilter: function() {
		if (this.m_oWidgetContextManager) {			
			var selectionJson = this.m_oWidgetContextManager.genEmptySelectionPayload(this.getViewerObject(), this.getWidgetId());
			this._fireContextChangedEvent(selectionJson, false);
		}
	},
	
	broadcastSelectionFilter: function() {
		this.onSelectionChange();
	},
	
	/*
	 * Selection as Filter:
	 * Called by CV when report selection is changed
	 */
	onSelectionChange: function()
	{
		if (this.isSelectionFilterEnabled()) {
			var bExcludeContext = ( this.getContainerTypeForSelection() === 'list' );
			var selectionJson = this.m_oWidgetContextManager.genSelectionPayload(this.getViewerObject(), this.getWidgetId(), bExcludeContext);
			//update the flag to true if payload is not for reset
			this._fireContextChangedEvent(selectionJson, !this.m_oWidgetContextManager.isSelectionPayloadForReset(selectionJson));
		}
	},

	/**
	 * @param selectionJson: selection json payload
	 * @param isFilter: true when payload is not for reset
	 */
	_fireContextChangedEvent: function(selectionJson, isFilter) 
	{
		this.setSelectionFilterSent(isFilter);
		this.fireEvent("com.ibm.widget.contextChanged", null, selectionJson);
	},
	
	/*
	 * Ideally this function should be in CognosViewer object
	 * But for ActiveReprot widget to override, it is at Widget level
	 */
	somethingSelected: function()
	{
		var oCV = this.getViewerObject();
		return (oCV && oCV.getSelectionController() && oCV.getSelectionController().getAllSelectedObjects().length>0); 
	},

	selectionFilterSent: function()
	{
		return this.m_bSelectionFilterSent; 
	},
	
	setSelectionFilterSent: function(flag)
	{
		this.m_bSelectionFilterSent = flag; 
	},
	
	reselectSelectionFilterObjects: function() {
		if (this.isSelectionFilterEnabled()) {
			var oCV = this.getViewerObject();
			var selectionController = oCV.getSelectionController();

			var aSelectionFilterObjects = this.m_oWidgetContextManager.getSelectionFilterObjects();
			if (!aSelectionFilterObjects) {
				//Opening dashboard case: 
				//Check if widget item set has it. if exists, use it then remove from attribute
				var str = this.getAttributeValue( "selectionObjects" );
				if (str && str.length>0) {
					aSelectionFilterObjects = eval(str);
					this.m_oWidgetContextManager.setSelectionFilterObjects(aSelectionFilterObjects);
					this.removeAttributeValue("selectionObjects");
				}
			}
			
			if (aSelectionFilterObjects && aSelectionFilterObjects.length>0) {
				
				
				var reselectAction = new ReselectAction(oCV, aSelectionFilterObjects);
				reselectAction.executeAction();
			}
		}
	},
	
	_getFilterPayload : function( evt ){
		return (evt.type=="string" ? dojo.fromJson(evt.payload) : evt.payload);
	},

	_getFilterPayloadItemName : function( filterPayload ){
		var filterPayloadItemName = filterPayload.name;
		if (!filterPayload.name) {
			filterPayloadItemName = this.m_oWidgetContextManager.getFilterFirstItemName();
		}
		return filterPayloadItemName;
	},

	canFilter: function(filterPayload, filterPayloadItemName, selectValueControlType, evt) {
		var index;
		var filterableItems = this.getRAPCachedItem("filterableItems");
		if(selectValueControlType!=="facet" && typeof filterPayloadItemName != "undefined" && filterPayloadItemName != null && filterableItems != null) {
			for(var type in filterableItems) { // visible/invisible
				for(index = 0; index < filterableItems[type].length; ++index) {
					if(filterableItems[type][index].name == filterPayloadItemName ||
						filterableItems[type][index].label == filterPayloadItemName) {
						return true;
					}
				}
			}
		}
		else
		{
			var viewerObject = this.getViewerObject();
			var oRAPReportInfo = viewerObject.getRAPReportInfo();
			if (oRAPReportInfo) {
				var selectValueDimensionName = (this.m_oWidgetContextManager) ? this.m_oWidgetContextManager.getSelectValuePropertyFromPayload(filterPayload, "dimension") : null;
				var containers = oRAPReportInfo.getContainers();
				for(var lid in containers) {
					var container = containers[lid];
					var sliders = container.sliders;
					if(sliders && sliders.length) {
						for(var sliderIndex = 0; sliderIndex < sliders.length; ++sliderIndex) {
							var oSlider = sliders[sliderIndex];
							if(oSlider.clientId == filterPayload.clientId ||
							(oSlider.clientId == evt.source) ||
							(oSlider.clientId==oSlider.name && oSlider.name==filterPayloadItemName)) {
								return true;
							}
						}
					}
					var itemInfo = container.itemInfo;
					if (itemInfo && itemInfo.length) {
						for(var itemInfoIndex = 0; itemInfoIndex < itemInfo.length; ++itemInfoIndex) {
							if(itemInfo[itemInfoIndex].item == filterPayloadItemName) {
								return true;
							}
							//Measure facets will be in the item list and will match the dimension.
							if(selectValueControlType==="facet" && itemInfo[itemInfoIndex].dimensionName == filterPayloadItemName) {
								return true;
							}

							//Attribute facets (new payload) will have dimension name specified.
							if(selectValueControlType==="facet" && itemInfo[itemInfoIndex].dimensionName === selectValueDimensionName) {
								return true;
							}
						}
					}

					if (selectValueControlType==="facet") {
						//Defer to server to check validity of attribute facets (could be improved with some type of caching).
						var filterType = (this.m_oWidgetContextManager) ? this.m_oWidgetContextManager.getSelectValuePropertyFromPayload(filterPayload, "filterType") : null;
						if (selectValueControlType==="facet" && filterType==="attribute") {
							return true;
						}

						//For facets, match the hierarchy name.
						var filterInfo = container.filter;
						if (filterInfo && filterInfo.length) {
							for (var filterInfoIndex = 0; filterInfoIndex < filterInfo.length; ++filterInfoIndex) {
								if (filterInfo[filterInfoIndex].hierarchyName === filterPayloadItemName) {
									return true;
								}
							}
						}
					} else {
						if (oRAPReportInfo.getFilterObjectFromContainer(lid, filterPayloadItemName, false)) {
							return true;
						} 
					}
				}

				if(oRAPReportInfo.isReportLevel_nonVisibleFilterItem(filterPayloadItemName) ) {
					return true;
				}
			}
		}

		return false;
	},

	_getDrillResetHUNForFacet: function( filterItemName, selectValueControlType ) {

		if( selectValueControlType !== 'facet'){
			return null;
		}

		var drilledOnHUNs = null;
		var viewerObject = this.getViewerObject();
		if (viewerObject.getRAPReportInfo()) {
			drilledOnHUNs = viewerObject.getRAPReportInfo().getDrilledOnHUNs();
		}

		if( !drilledOnHUNs ){ return null; }

		/**
		 * DrillReset action takes an array as parameter
		 */
		var aDrillResetHUNs = [];
		for( var i = 0; i < drilledOnHUNs.length; i++ ){
			if( drilledOnHUNs[i].indexOf( filterItemName ) !== -1 ) {
				aDrillResetHUNs.push( drilledOnHUNs[i] );
				break;
			}
		}

		return aDrillResetHUNs;
	},

	preProcessFilterValues: function(evt) {
		var contextObject = evt.payload["com.ibm.widget.context"]["values"];
		contextObject = (contextObject) ? contextObject : evt.payload["com.ibm.widget.context"]["ranges"];

		var itemsInItemSpecObject = this.m_oWidgetContextManager.getItemsInItemSpecification(evt.payload);
		var isDeleteSliderEvent=(contextObject) ? false : true;
		if (isDeleteSliderEvent) {
			//Sliders should always be deleted by ID not by name.
			contextObject = evt.payload["com.ibm.widget.context"];
		}

		var viewerObject = this.getViewerObject();
		if (viewerObject) {
			var oRAPReportInfo = viewerObject.getRAPReportInfo();
			for(var dataItem in contextObject) {
				if (!oRAPReportInfo.isReferenced(dataItem) || isDeleteSliderEvent) {
					delete contextObject[dataItem];
					if (itemsInItemSpecObject && itemsInItemSpecObject[dataItem]) {
						delete itemsInItemSpecObject[dataItem];
					}
				}
			}
		}
		
		// If we're left we no dataItems that we care about, blank out the context information so any previous filter
		// applied by the same 'sender' will get removed.
		if (isObjectEmpty(contextObject)) {
			evt.payload["com.ibm.widget.context"] = {};
		}
	},

	isLimitedInteractiveMode: function() {
		var viewerObject = this.getViewerObject();
		if(viewerObject) {
			return viewerObject.isLimitedInteractiveMode();
		}
		return false;
	},
	onMouseOver: function(evt) {
		if(DragDropAction_isDragging(evt) == false && this.getViewerObject().getStatus() == "complete")
		{
			var action = ActionFactory_loadActionHandler(evt, this.getViewerObject());
			if(action) {
				return action.onMouseOver(evt);
			}
		}
		return true;
	},
	onMouseOut: function(evt) {
		var action = ActionFactory_loadActionHandler(evt, this.getViewerObject());
		if(action && this.getViewerObject().getStatus() == "complete") {
			return action.onMouseOut(evt);
		}
		return true;
	},
	onMouseOverRenamedItem: function(evt) {
		var node = getNodeFromEvent(evt);

		if (node.getAttribute)
		{
			var originalLabel = node.getAttribute("rp_name");
			if(originalLabel != null) {
				var label = this.getViewerObject().getSelectionController().getTextValue(node.childNodes);
				if(originalLabel != label) {
					var id = node.getAttribute("id");
					node.m_tooltip = new bux.reportViewer.ReportInfo(
					{
						connectId: [id],
						position: ["above","below"],
						title: RV_RES.IDS_JS_RENAMED_ITEM,
						text: RV_RES.IDS_JS_RENAMED_ITEM_ORIGINAL_LABEL + " " + node.getAttribute("rp_name")
					});
					node.m_tooltip.open();
				}
			}
		}
	},
	onMouseOutRenamedItem: function(evt) {
		var node = getNodeFromEvent(evt);
		node.m_tooltip = null;
	},
	onDoubleClick: function(evt) {
		// Double click event is used mostly to perform the default drill.
		var action = ActionFactory_loadActionHandler(evt, this.getViewerObject());
		if(action && this.getViewerObject().getStatus() == "complete") {
			return action.onDoubleClick(evt);
		}
		return true;
	},
	onMouseDown: function(evt) {
		var oCV = this.getViewerObject();
		var factory = oCV.getActionFactory();

		// Need to keep the selection action around so it can be used for mouse up as well.
		this._selectionAction = factory.load("Selection");
		
		if (this.isMobile()) {
			var selectionController = oCV.getSelectionController();
			var nodeSelected = selectionController.pageClickedForMobile(evt);
			
			// Only get Mobile to show the pop-over if we've selected something in the report and
			// the widget isn't sending contextChanged events
			if (this.isSelectionFilterEnabled()) {
				this.onSelectionChange();
			}
			else if (nodeSelected) {
				this.onContextMenu(evt);
			}
		}
		else if (oCV.envParams["ui.action"] == 'view') {
			this._selectionAction.onMouseDown(evt);
		}
		else if(oCV.getStatus() == "complete") {
			if((evt.button == 1 || evt.button == 0)) {
				// if the onMouseDown returns true, then we executed a drillThrough and shouldn't be doing a drag/drop action
				// if the onMouseDown for rename returns true then the user clicked in the rename edit box so don't start a drag/drop
				if (!this._selectionAction.onMouseDown(evt) && !factory.load("RenameDataItem").onMouseDown(evt)) {
					this.initDragAndDrop();
					factory.load("DragDrop").onMouseDown(evt);
				}
			} else {
				this._selectionAction.onMouseDown(evt);
			}
		}
	},
	onMouseUp: function(evt) {
		if (this.isMobile()) {
			return;
		}

		var srcNode = getCrossBrowserNode(evt);

		// if the event did come from an INPUT or TEXTAREA element cancel the bubble,
		// to prevent lost of focus in IE
		try {
			var nodeName = srcNode.nodeName.toLowerCase();
			if (nodeName == "input" || nodeName == "textarea") {
					evt.cancelBubble = true;
					return false;
			}
		}
		catch(ex) {
			// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType/nodeName/className will generate an error.
		}
		var eventConsumed = false;
		if (this.getViewerObject().envParams["ui.action"] == 'view') {
			setNodeFocus(evt);
		}
		else if (this.getViewerObject().getStatus() == "complete") {
			eventConsumed |= DragDropAction_isDragging(evt);
			DragDropAction_onmouseup(evt);
			this.removeDragAndDrop();
			setNodeFocus(evt);
		}
		
		if (!this._selectionAction) {
			var oCV = this.getViewerObject();
			var factory = oCV.getActionFactory();			
			this._selectionAction = factory.load("Selection");
		}
		this._selectionAction.onMouseUp(evt, eventConsumed);
		clearTextSelection();
	},
	getContainerTypeForSelection : function()
	{
		var viewerObject = this.getViewerObject();
		if( viewerObject )
		{
			var selectionController = viewerObject.getSelectionController();
			return selectionController.getDataContainerType();
		}
		return null;
		
	},
	onContextMenu: function(evt) {
		var viewerObject = this.getViewerObject();
		if( viewerObject.getStatus() == "complete" || this.isSavedOutput() ) {
			var contextMenu = viewerObject.getContextMenu();
			var tempContextMenu = CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection(viewerObject, contextMenu);

			if (this.isMobile()) {
				var selectionController = viewerObject.getSelectionController();
				var containerType = selectionController.getContainerType();

				// if we're dealing with a chart then get the tooltip
				var chartTooltip = containerType === "chart" ? selectionController.getChartTooltip() : null;

				//if annotation exists
				if (this.getAnnotationStore() && this.getAnnotationStore().hasAnnotation()) {
					var cellComments = this._genMobileCommentMenuItem(selectionController);
					if (cellComments) {
							tempContextMenu.push(cellComments);
					}
					var widgetComments = this._genMobileCommentMenuItem();
					if (widgetComments) {
						var widgetActionsItems = viewerObject.findBlueDotMenu(tempContextMenu);
						if (widgetActionsItems) {
							widgetActionsItems.push(widgetComments);
						}
					}
				}

				var mobileContextMenu = {
						"context" : {
							"event" : evt,
							"viewerContext" : {
								"displayValues" : selectionController.getDisplayValues(),
								"chartTooltip" : chartTooltip,
								"containerType" : containerType
							}
						},
						"menuItems" : tempContextMenu
				};
				if (typeof console != "undefined" && console && console.log) {
					console.log(mobileContextMenu);
				}
				this.fireEvent("com.ibm.bux.widget.contextMenu.update", null, mobileContextMenu);
			}
			else {
				this.fireEvent("com.ibm.bux.widget.contextMenu.update", null, tempContextMenu);
			}
		}
	},

	_genMobileCommentMenuItem: function(selectionController) {

		var ctx = null;

		if (selectionController) {
			if (selectionController.getSelections().length==1) {
				ctx = selectionController.getSelections()[0].getCtxAttributeString();
			}
			if (!ctx) {
				return null;
			}
		}
		var comments = this.getAnnotationStore().getAsJSON(ctx);

			if (comments.length>0) {
				return {
					"name": RV_RES.IDS_JS_ANNOTATIONS,
					"label": RV_RES.IDS_JS_ANNOTATIONS,
					"flatten": false,
					"comments": comments};
			}
			return null;
	},

	initDragAndDrop: function() {
		if (window.attachEvent)
		{
			document.attachEvent("onmouseup", DragDropAction_onmouseup);
			document.attachEvent("onmousemove", DragDropAction_onmousemove);
		}
		else if (document.addEventListener)
		{
			document.addEventListener("mouseup", DragDropAction_onmouseup, false);
			document.addEventListener("mousemove", DragDropAction_onmousemove, false);
		}
	},

	removeDragAndDrop: function() {
		if (window.detachEvent)
		{
			document.detachEvent("onmouseup", DragDropAction_onmouseup);
			document.detachEvent("onmousemove", DragDropAction_onmousemove);
		}
		else if (document.removeEventListener)
		{
			document.removeEventListener("mouseup", DragDropAction_onmouseup, false);
			document.removeEventListener("mousemove", DragDropAction_onmousemove, false);
		}
	},

	onWidgetResize: function(evt) {
		var resize = evt.payload.resize;
		if (resize) {
			/**
			 * We get multiple resize events from BUX on dashboard open. These are meant mostly for other widgets
			 * like text widgets. We can safely ignore these events if we're hidden or if it's the first resize event
			 * we get while visible. After, we'll only process the event if the height or width has changed.
			 */
			if (!this.m_visible || (this.widgetSize && this.widgetSize.h === resize.h && this.widgetSize.w === resize.w)) {
				return;
			}

			var bInitialResizeEvent = !this.widgetSize;
			this.widgetSize = { h : resize.h, w : resize.w };

			if (bInitialResizeEvent) {
				return;
			}

			if (!resize.autoResize) {
				//Don't resize charts when the autoResize flag is set (resize to fit content).
				this.executeAction(evt, "ResizeChart");
			}

			var oCV = this.getViewerObject();
			if (oCV && oCV.getPinFreezeManager()) {
				if (resize.autoResize) {
					//Update the last size processed by an autoresize to properly detect
					//that size has changed on the next resize.
					oCV.getPinFreezeManager().processAutoResize(resize.w, resize.h);
				}

				//HACK: See Task 236446 for an explanation:
				setTimeout(
					function() {
						oCV.getPinFreezeManager().refresh();
					}, 100
				);
			}
			
			if (oCV.getTabController()) {
				oCV.getTabController().onResize(evt);
			}
		}
	},

	getWidgetSize: function() {
		return this.widgetSize;
	},

	refreshAnnotationData: function() {
		return this.getAnnotationHelper().refreshAnnotationData();
	},


	fetchAnnotationData: function() {
		this.getAnnotationHelper().fetchAnnotationData();
	},

	/**
	 * Return true iff the report contains any dijits.
	 */
	reportContainsDijits: function() {
		var store = this.getAnnotationStore();
		var annotations = store.getAll();
		for(var key in annotations) {
			if(typeof annotations[key] !== "function") {
				return true;
			}
		}
		return false;
	},

	isSaveNecessary: function () {
		var isNecessary = false;

		if (this.isSavedOutput()) {
			var sHasAlreadySaved = this.getAttributeValue("mostRecentSavedOutput");
			//Item set should always return "true" or "false", but a BUX bug
			//sometimes converts these strings to actual booleans. This should
			//be fixed by BUX, see tasks 299654 and 299650, and then the
			//boolean check here can be removed.
			var bHasAlreadySaved = sHasAlreadySaved === "true" || sHasAlreadySaved === true;
			var sSavedOutputSearchPath = this.getAttributeValue("savedOutputSearchPath");
			isNecessary = !bHasAlreadySaved && sSavedOutputSearchPath == null;
		} else {
			var sOriginalItem = this.getAttributeValue("originalReport");
			var sSavedItem = this.getAttributeValue("savedReportName") || this.getAttributeValue( "savedReportPath" );
			if (!this.isSavedReport(sOriginalItem, sSavedItem)) {
				isNecessary = true;
			}
		}
		return isNecessary;
	},

	addAsNewComment: function(ctxId, text) {
		this.getAnnotationHelper().addAsNewComment(ctxId, text);
	},

	onWidgetActionDone: function (iEvent) {
		if (iEvent && iEvent.payload && iEvent.payload.status === true) {
			this.getAnnotationHelper().addNewComment(this._pendingContextId, this._pendingCellValue);
		}

		this._pendingContextId = null;
		this._pendingCellValue = null;
	},

	commitComment: function(annotation) {
		if (!annotation.isNew) {
			return null;
		}

		if (!annotation.isLoaded) {
			return this.getAnnotationHelper().commitComment(annotation);
		}

		return null;
	},

	getAnnotationStore: function() {
		if(!this.annotationStore) {
			dojo["require"]("bux.data.AnnotationStore");
			this.annotationStore = new bux.data.AnnotationStore(this, this.commitComment, this);
		}
		return this.annotationStore;
	},

	fireEvent: function(eventName, arg, payload) {
		if (window.gViewerLogger) {
			var id = this.getViewerObject() ? this.getViewerObject().getId() + " " : "";
			window.gViewerLogger.log(id + eventName, payload, "json");
		}
		
		this.iContext.iEvents.fireEvent( eventName, arg, payload );
	},

	onGetFilterableItems: function( evt )
	{
		this.getLoadManager().runWhenHasViewer(dojo.hitch(this, function() {

			var bRequestSentToServer = false;
			var oCachedFilterableItems = this.getRAPCachedItem("filterableItems");
			if( oCachedFilterableItems == null && this.isLiveReport() &&  (this.getViewerObject().getStatus() == "complete" || this.isFaultStatusWithSpec())) {
				this.executeAction( evt, "GetFilterableItems" );
				bRequestSentToServer = true;
			} else {
				if(!oCachedFilterableItems) {
					oCachedFilterableItems = {
						visible: [],
						hidden: []
					};
				}
				if(this.isLiveReport()) {
					this.fireEvent("com.ibm.bux.filter.items.get.done", null, oCachedFilterableItems);
				} else {
					this.savedOutputResponseHandler("com.ibm.bux.filter.items.get.done", oCachedFilterableItems);
				}
			}
			return bRequestSentToServer;
		}));
	},

	/*Private function to check if the view has a "fault" status while the view ui.spec exits still
	 * for situations like dynamic slider missing members*/
	isFaultStatusWithSpec: function(){
		var oVO = this.getViewerObject();
		if(oVO.getStatus() === "fault"){
			if(oVO.envParams["ui.spec"]){
				return true;
			}
		}
		return false;
	},

	onGetFilterValues: function(oEvt) {
		this.getLoadManager().runWhenHasViewer(dojo.hitch(this, function() {
			//If the source is defined in the evt but not in the payload, transfer it....
			var oPayload = oEvt.payload;
			if (typeof oEvt.source != "undefined" && typeof oPayload != "undefined") {
				if (typeof oPayload.payload != "undefined") {
					oPayload = oPayload.payload;
				}
				if (typeof oPayload.source == "undefined") {
					oPayload.source = oEvt.source;
				}
			}

			var bRequestSentToServer = false;

			var bIsLiveReport = this.isLiveReport();
			var sViewerStatus  = this.getViewerObject().getStatus();
			var bIsFaultWithSpec = this.isFaultStatusWithSpec();
			if (bIsLiveReport && (sViewerStatus === "complete" || bIsFaultWithSpec) ) {
				var oCachedFilterValuesForItem=null;
				if (!oPayload.forceRefresh && oPayload.name) {
					oCachedFilterValuesForItem = this.getRAPCachedItem("filterValues." + oPayload.name);
				}
				if (oCachedFilterValuesForItem) {
					this.fireEvent("com.ibm.bux.filter.values.get.done", null, oCachedFilterValuesForItem);
				} else {
					this.executeAction( oEvt, "GetFilterValues" );
					bRequestSentToServer = true;
				}
			} else if (this.getViewerObject().isWorking(sViewerStatus)) {
				//Still working. Retry after a delay.
				var self = this;
				var fnRetry = function() {
					self.onGetFilterValues(oEvt);
				};
				setTimeout(fnRetry, 10);
			} else {
				var oResponsePayload = {};
				if(oPayload.name) {
					oResponsePayload.name = oPayload.name;
				}
				this.fireEvent("com.ibm.bux.filter.values.get.done", null, oResponsePayload);
			}

			return bRequestSentToServer;
		}));
	},

	/**
	 * Called when the users hit cancel in the filter options dialog
	 */
	onGetFilterValuesCancel: function(evt) {
		if (evt && evt.payload) {
			var oCV = this.getViewerObject();

			// create a GetFilterValueAction object so that we can get rebuild the correct key used for
			// the original request
			var action = oCV.getAction("GetFilterValues");
			action.setRequestParms( evt );
			var requestKey = action.getActionKey();

			if (requestKey) {
				oCV.getViewerDispatcher().cancelRequest(requestKey);
			}
		}
	},

	savedOutputResponseHandler: function(sEventName, oPayload) {
		var oCV = this.getViewerObject();
		var sPayload = dojo.toJson(oPayload);
		var sSavedOutputResponse = "window[\"oCV" + oCV.getId() + "\"].getViewerWidget().fireEvent(\"" + sEventName + "\", null, " + sPayload + ");";
		if (oCV) {
			var window_oCV = window["oCV" + oCV.getId()];
			if (typeof window_oCV == "object") {
				setTimeout(sSavedOutputResponse,1);
			}
		}
		return sSavedOutputResponse;
	},

	handleGetFilterableItemsResponse: function( oResponse )
	{
		var payload = {};
		var json = this.getJsonFromResponse(oResponse);
		if (json) {
			payload = json.filterableItems;
			if(!payload){
				payload = {"visible":[],"invisible":[]};
			}
			// cache the filterable items, so we can re-use later for filter actions or in case the slider dialog is re-launched
			this.addToRAPCache("filterableItems", payload);
		}
		this.fireEvent("com.ibm.bux.filter.items.get.done", null, payload);
	},

	handleGetFilterValuesResponse: function(oResponse, oParams) {
		var oPayload = {};
		var json = this.getJsonFromResponse(oResponse);
		if (json && json.filterValues ) {
			oPayload = json.filterValues;
			if (oPayload && oPayload.name) {
				this.addToRAPCache("filterValues." + oPayload.name, oPayload);
			}
		}

		if(oParams && oParams.name && !oPayload.name) {
			oPayload.name = oParams.name;
		}

		//In order to ensure the internal value of payload stored in the cache
		//isn't modified, send a copy of this data in the event.
		oPayload = dojo.clone(oPayload);

		this.fireEvent("com.ibm.bux.filter.values.get.done", null, oPayload);
	},

	getJsonFromResponse: function (oResponse) {
		var json = null;
		if (oResponse && oResponse.m_jsonResponse && oResponse.m_jsonResponse.json) {
			json = dojo.eval("(" + oResponse.m_jsonResponse.json + ")");
		} else if (oResponse && oResponse.responseText) {
			json = dojo.eval("[" + oResponse.responseText + "]");
			if (json && json[0]) {
				json = json[0];
			}
		}

		return json;

	},

	/**
	 * Generic contextChange event
	 */
	onContextChanged: function(evt) {
		// clone the event so we can filter out values which have
		if(evt) {
			this.getLoadManager().runWhenHasViewer(dojo.hitch(this, function() {
				//we process event only when viewer is loaded
				var bRequestSentToServer = false;
				
				var clonedEvent = dojo.clone(evt);
				//convert payload to seletValue
				var payload = this._getFilterPayload( clonedEvent );
				this.m_oWidgetContextManager.convertSelectionToSelectValueControlPayload(payload);
				this.m_oWidgetContextManager.convertGenericToSelectValueControlPayload(payload);
				
				//Process context filter by root member
				var viewerObject = this.getViewerObject();
				var oRAPReportInfo = viewerObject.getRAPReportInfo();
				if (oRAPReportInfo && (oRAPReportInfo.containsFilters() || oRAPReportInfo.hasSlider())) {
					
					var oCommonPartValues = payload["com.ibm.widget.context"].values;
					var oPackage = this.m_oWidgetContextManager.getItemsInItemSpecification(payload);
					var oOriginalPackage = dojo.clone(oPackage);
					for(var itemName in oOriginalPackage) {
						if (!oRAPReportInfo.isReferenced(itemName) && oPackage[itemName].values) {
							var mun = oPackage[itemName].values[0].mun;
							var newName = oRAPReportInfo.hunHasFilterOrSlider(mun);
							
							//Rename 
							if (newName && !oPackage[newName]) {
								oPackage[newName] = oPackage[itemName];
								delete oPackage[itemName];
								
								oCommonPartValues[newName] = oCommonPartValues[itemName];
								delete oCommonPartValues[itemName];
							}
						}
					}
				}
				clonedEvent.payload = payload;
				
				/*
				 * We need to reset filterable items from source widget first because
				 * previous payload might have more items than current payload. 
				 */
				bRequestSentToServer = this.onGenericSelectValueControl(clonedEvent, /*bResetFirst*/ true);
				
				//return value used by ViewerLoadManager.prototype.processQueue function
				return bRequestSentToServer;
			}), evt.source);
		}
	},
	
	
	/**
	 * Public API to send a generic contextChanged event
	 */
	broadcastParameterChange: function(payload) {
		var eventPayload = {
				"clientId" : this.getWidgetId(),
				"com.ibm.widget.context" : payload
		}
		this.fireEvent( "com.ibm.widget.contextChanged.prompt", null, eventPayload);
	},
	
	/**
	 * Public API to send a generic contextChanged event
	 */
	broadcastContextChange: function(payload) {
		if (this.isSelectionFilterEnabled()) {
			// Build up an event object so that we can re-use our regular filter code
			var eventPayload = {
				"clientId" : this.getWidgetId(),
				"com.ibm.widget.context" : payload,
				"com.ibm.widget.context.bux.selection": {"selection":{
						"id":this.getWidgetId(),
						"valueType":"string"
					}}
			}
			
			this.m_oWidgetContextManager.updateFilterContext(eventPayload);
			this.m_oWidgetContextManager.setSelectionFilterObjects(null);
			this._fireContextChangedEvent(eventPayload, true);
		}
	},
			
	onGenericDrill: function(evt)
	{

		this.m_handleDrill = false; //used for unit test only

		this.getLoadManager().runWhenHasViewer(dojo.hitch(this, function() {
			var bRequestSentToServer = false;
			if( !(evt && evt.payload)  || this.isLimitedInteractiveMode() )
			{
				return bRequestSentToServer;
			}

			//process event only if fired by different widget
			if( evt.payload.cv_id === this.iContext.widgetId )
			{
				return bRequestSentToServer;
			}

			var sDrillAction = this.m_oWidgetContextManager.getDrillActionType(evt.payload);
			var aDrillSpecObjects = this.m_oWidgetContextManager.genDrillSpecObjects(evt.payload);
			var oDrillAction = null;
			if( sDrillAction === "DrillDown")
			{
				oDrillAction = this.getViewerObject().getAction("DrillDown");
			}
			else if( sDrillAction === "DrillUp")
			{
				oDrillAction = this.getViewerObject().getAction("DrillUp");
			}
			else
			{
				return bRequestSentToServer;
			}

			oDrillAction.setKeepFocusOnWidget(false);

			if (this.getViewerObject().isMetadataEmpty() || !this.shouldReportBeRunOnAction()) {
				oDrillAction.setUseReportInfoSelection(true); //Must set before parsing the spec
			}

			if( oDrillAction.parseDrillSpecObjects(aDrillSpecObjects) ){
				if (!this.shouldReportBeRunOnAction()) {
					this.getLoadManager().getDelayedLoadingContext().setForceRunReport(true);
				}

				oDrillAction.execute();
				bRequestSentToServer = true;
			}

			this.m_handleDrill = true;// for unit test only

			return bRequestSentToServer;
		}));
	},

	setDoGetParametersOnLoad : function( bFlag )
	{
		this.m_doGetParametersOnLoad = bFlag;
	},

	getDoGetParametersOnLoad : function()
	{
		return this.m_doGetParametersOnLoad;
	},

	/*
	 * Handles share prompt event.
	 * Returns true if sucessful, false otherwise, null if unknown.
	 * Note that the return value should only be used in testing.
	 */
	onPromptLegacyPayload: function(evt) {
		try {
			//process event only if fired by different widget and we're not looking at saved output
			if( evt.payload.cv_id === this.iContext.widgetId) {
				return false;
			}

			var bRequestSentToServer = null;
			this.getLoadManager().runWhenHasViewer(dojo.hitch(this, function(bIsSynchronous) {
				bRequestSentToServer = false;
				if (this.isSavedOutput()) {
					return bRequestSentToServer;
				}
				if (this.promptParametersRetrieved === false) {
					//run getParameters to get the prompt parameters for the current widget
					var getParametersAction = this.getViewerObject().getAction("GetParameters");
					getParametersAction.setRequestParms(evt.payload);
					getParametersAction.execute();
					bRequestSentToServer = true;
				} else {
					bRequestSentToServer = this.sharePrompts(evt.payload);
				}
				return bRequestSentToServer;
			}));

			return bRequestSentToServer;
		} catch(e) {
			return false;
		}
	},

	sharePrompts: function(payload) {
		var sharePromptAction = this.getViewerObject().getAction("SharePrompt");
		sharePromptAction.setRequestParms(payload);
		if( this.shouldReportBeRunOnAction() ) {
			var aDrillResetHUNs = this.getViewerObject().getDrillResetHUNs( payload );
			if( !aDrillResetHUNs || aDrillResetHUNs.length === 0 ){
				return sharePromptAction.executePrompt();
			}else{
				var parms = { 'drilledResetHUNs' :  aDrillResetHUNs,
							'promptValues' :  sharePromptAction.getPromptValues() };
				this.getViewerObject().executeAction( "DrillReset", parms );
			}
			return true;
		}
		var delayedLoadingContext = this.getLoadManager().getDelayedLoadingContext();
		delayedLoadingContext.setPromptValues( sharePromptAction.getPromptValues() );
		delayedLoadingContext.setCascadingPromptParamsToClear( payload.clearCascadePromptParams );
		return false;
	},




	onGenericPrompt: function(evt) {
		this.clearRAPCacheFilterValues();
		this.m_oWidgetContextManager.handleIncomingPromptEvent(evt);
	},

	setPromptParametersRetrieved: function(promptParametersRetrieved)
	{
		this.promptParametersRetrieved = promptParametersRetrieved;
	},

	getEnvParam: function( paramName )
	{
		return this.getViewerObject().envParams[ paramName ];
	},

	destroy: function() {
		var viewer = this.getViewerObject();
		if (viewer) {
			// Clear the selection and fire our contextChanged event
			if (this.isSelectionFilterEnabled() ) {
				if (this.selectionFilterSent()) {
					this.clearSelectionFilter();
				}
			}
			
			if( this.onUnloadInProgress ) {
				//The viewer code specifies that if no callback is provided, the destroy function is synchronous
				//when we are in window unload processing, we want the http requests sent for
				//releasing conversations to be completed before window closes. Using async
				//requests during such a situation results in http requests
				//to be sent only for some before browser window closes.
				viewer.destroy(false);
			} else {
				//The viewer code specifies that if no callback is provided, the destroy function is synchronous
				//We don't want that, so just provide a dummy callback
				viewer.destroy(true);
			}

			var rmItem = function(element) {
				if (element && element.parentNode && element.parentNode.removeChild) {
					element.parentNode.removeChild(element);
				}
			};

			// Cleanup the markup that was added by this widget -- the nodes are identified by an attribute named namespaceId, first in the <head>, then the body children
			var items = dojo.query("[namespaceId='" + this.getViewerId() + "'],[namespaceId='" + this.m_sScriptLoaderNamespace + "']", document.getElementsByTagName("head").item(0));
			if (items && items.length > 0) {
				items.forEach( rmItem );
			}

			items = dojo.query('> [namespaceId="' + this.getViewerId() + '"]', document.getElementsByTagName("body").item(0));
			if (typeof items != "undefined" && items && items.length > 0) {
				items.forEach( rmItem );
			}

			if (this.getAnnotationHelper()) {
				this.getAnnotationHelper()._cleanupPreviousAnnotations();
			}
		}

		if (this.annotationHelper) { this.annotationHelper.m_viewerIWidget = null; }
		this.annotationHelper = null;
		if (this.savedOutput) { this.savedOutput.iWidget = null; }
		this.savedOutput = null;
		if (this.m_oLoadManager) { this.m_oLoadManager.m_oWidget = null; }
		this.m_oLoadManager = null;
		if (this.m_oWidgetContextManager) { this.m_oWidgetContextManager.m_widget = null; }
		this.m_oWidgetContextManager = null;
		
		this.removeWindowEventListeners();
		
		if (this.undoRedoQueue) {
			GUtil.destroyProperties(this.undoRedoQueue);
			delete this.undoRedoQueue;
		}

		GUtil.destroyProperties(this.getAnnotationStore());
		delete this.getAnnotationStore();

		GUtil.destroyProperties(this.savedOutput);
		delete this.savedOutput;

		delete this.m_oCV;
		viewer = null;
	},

	setSavedOutputsCMResponse: function(cmResponse)
	{
		this.savedOutputsCMResponse = cmResponse;

		if (cmResponse == null) {
			var actionFactory = this.getViewerObject().getActionFactory();
			var action = actionFactory.load("Snapshots");
			action.resetMenu();
		}
	},

	getSavedOutputsCMResponse: function()
	{
		if (typeof this.savedOutputsCMResponse == "undefined" || this.savedOutputsCMResponse == null)
		{
			return null;
		}

		return this.savedOutputsCMResponse;
	},

	setSavedOutputSearchPath: function(searchPath)
	{
		this.m_savedOutputSearchPath = searchPath;
	},

	getSavedOutputSearchPath: function()
	{
		if (typeof this.m_savedOutputSearchPath == "undefined")
		{
			return null;
		}

		return this.m_savedOutputSearchPath;
	},
	initializeProperties: function()
	{
		if( this.properties  )
		{
			var viewerObject = this.getViewerObject();
			this.properties.initialize( viewerObject.envParams );
		}
	},
	addToRAPCache: function(name, value) {
		if(!this.m_RAPCache) {
			this.m_RAPCache = {};
		}
		this.m_RAPCache[name] = value;
	},
	getRAPCachedItem: function(name) {
		if(this.m_RAPCache && typeof this.m_RAPCache[name] != "undefined") {
			return this.m_RAPCache[name];
		}

		return null;
	},

	clearRAPCacheFilterValues: function() {
		for (var key in this.m_RAPCache) {
			if (key.indexOf("filterValues.") === 0) {
				delete this.m_RAPCache[key];
			}
		}
	},

	clearRAPCache: function() {
		this.m_RAPCache = null;
	},
	// called by ResetToOriginalAction to reset parameters, cache, queues, etc
	reset: function() {
		this.m_bCallGetAnnotations = true;//reset to 'true' so that we issue getAnnotation call

		this.promptParametersRetrieved = false;
		this.getViewerObject().envParams["reportPrompts"] = "";

		// clear the cached CM response for available outputs since we're reseting to the original
		this.setSavedOutputsCMResponse(null);

		// clear the undo queue
		this.getUndoRedoQueue().clearQueue();
		
		if (this.isSelectionFilterEnabled) {
			this.clearSelectionFilter();
		}
		this.m_bSelectionFilterSwitch = false;		
	},

	handleFault: function() {
		if (typeof console != "undefined" && console && console.log) {
			console.log("ViewrIWidget:handle fault is deprecated and should not be used anymore.");
		}

		var viewerObject = this.getViewerObject();

		var requestHandler = new RequestHandler(viewerObject);
		requestHandler.onFault();
	},

	disableListenToForGlobalPrompt: function()
	{
		// TODO This method is obsolete, and should be removed and callers should use the disableListenToForEvent function
		this.fireEvent("com.ibm.bux.widget.updateEventFilter", null, { "*": { blockedEvents: ['com.ibm.widget.contextChanged.prompt']} });
		var viewerObject = this.getViewerObject();
		if (window.gaRV_INSTANCES) {
			var payload = {};
			payload[ this.iContext.widgetId ] = { blockedEvents: ['com.ibm.widget.contextChanged.prompt']};
			for (var iIndex=0; iIndex < window.gaRV_INSTANCES.length; iIndex++)	{
				if(window.gaRV_INSTANCES[iIndex].getId() != viewerObject.getId()) {
					var viewerIWidget = window.gaRV_INSTANCES[iIndex].getViewerWidget();
					if(viewerIWidget) {
						viewerIWidget.iContext.iEvents.fireEvent("com.ibm.bux.widget.updateEventFilter", null, payload);
					}
				}
			}
		}
	},

	disableListenToForEvent: function(events)
	{
		this.fireEvent("com.ibm.bux.widget.updateEventFilter", null, { "*": { blockedEvents: events} });
		var viewerObject = this.getViewerObject();
		if (window.gaRV_INSTANCES) {
			var payload = {};
			payload[ this.iContext.widgetId ] = { blockedEvents: events};
			for (var iIndex=0; iIndex < window.gaRV_INSTANCES.length; iIndex++)	{
				if(window.gaRV_INSTANCES[iIndex].getId() != viewerObject.getId()) {
					var viewerIWidget = window.gaRV_INSTANCES[iIndex].getViewerWidget();
					if(viewerIWidget) {
						viewerIWidget.iContext.iEvents.fireEvent("com.ibm.bux.widget.updateEventFilter", null, payload);
					}
				}
			}
		}
	},

	handlePassportErrorFromDispatcher: function() {//Bug: COGCQ00261642

		if (this.viewerWidgetLastAction) {
			var okCallbackFunction = GUtil.generateCallback(this[this.viewerWidgetLastAction.functionName], this.viewerWidgetLastAction.param, this);
			dojo["require"]("bux.dialogs.IFrameDialog"); //@lazyload
			var dialog = new bux.dialogs.LogonDialog({
				okHandler: okCallbackFunction,
				cancelHandler: dojo.hitch(this, function() {this.fireEvent("com.ibm.bux.widget.action", null,  { action: 'deleteWidget' } );})
				});
			dialog.startup();
			dialog.show();
		}
	},

	showErrorMessage: function(errorMessage) {
		var viewerObject = this.getViewerObject();
		if(viewerObject) {
			this.m_widgetErrorDlg = new FaultMessageDialog(viewerObject, errorMessage);
			this.m_widgetErrorDlg.renderInlineDialog();
		}
	},
	getErrorDlg: function() {
		if (this.m_widgetErrorDlg) {
			return this.m_widgetErrorDlg;
		}

		return null;
	},
	setErrorDlg: function(dlg) {
		this.m_widgetErrorDlg = dlg;
	},
	clearErrorDlg: function(dlg) {
		if( this.getErrorDlg() !== null)
		{
			this.m_widgetErrorDlg.ok();
		}
	},

	onOpen: function( evt )
	{
		if( evt && evt.payload && evt.payload.author )
		{
			this.m_sDashboardOwnerId = evt.payload.author.cm$searchPath;
		}
	},

	onNotifyPreviousEventsAreDone: function(evt)
	{
		this.m_resizeReady = true;
	},

	isDashboardOwner: function()
	{
		if( typeof this.m_sDashboardOwnerId !== "undefined" && typeof this.m_sUserId !== "undefined")
		{
			return this.m_sDashboardOwnerId === this.m_sUserId;
		}
	},

	/**
	 * Returns true iff the provided user search path matches
	 * that of the current user.
	 */
	isCurrentUser: function(user)
	{
		return this.m_sUserId === user;
	},

	findContainerDiv : function()
	{
		var rvContentDiV = dojo.byId("RVContent" + this.getViewerObject().getId());
		// we need to find the correct container div. It'll be the one with a height set in pixels
		var containerDiv = rvContentDiV;
		while (containerDiv) {
			if (containerDiv.style && containerDiv.style.height && containerDiv.style.height.indexOf("px") != -1) {
				return containerDiv;
			}
			containerDiv = containerDiv.parentNode;
		}

		if (typeof console != "undefined" && console && console.log)
		{
			console.log("ViewrIWidget: Could not find the container div.");
		}

		return rvContentDiV;
	},

	getPaneOnRight: function () {
		//Preference coming from BUX. This is passed to BUA. Value is string "true" or "false"
		return this.getAttributeValue( "paneOnRight");
	},

	getWidgetContextManager: function() {
		return this.m_oWidgetContextManager;
	},

	getInfoBarRenderedState: function() {
		return this.m_oInfoBarRenderedState;
	},

	/*
	 * m_oInfoBarRenderedState should keep only what is rendered.
	 */
	refreshInfoBarRenderedState: function(aValidInfoBarIDs) {

		var len = aValidInfoBarIDs.length;
		var oNewState = {};
		for(var idx = 0; idx < len; idx++) {
			var sId = aValidInfoBarIDs[idx];

			if (this.m_oInfoBarRenderedState[sId]) {
				oNewState[sId] = this.m_oInfoBarRenderedState[sId];
			}
		}
		this.m_oInfoBarRenderedState = oNewState;
	},

	/*
	 * Handler of 'com.ibm.widget.context.get' event
	 */
	onGetWidgetContext: function(iEvent) {

		var payload = this.getWidgetContextManager().getWidgetContextObject();
		if (!payload) {
			payload = {};
		}

		this.fireEvent( 'com.ibm.widget.context.get.done', null , payload);
	},

	/*
	 * Handler of com.ibm.bux.canvas.context.get.done event
	 */
	onGetCanvasContextDone: function(evt) {
		//do nothing for now.
	},

	onSetVisible: function(evt) {
		//BEGIN DEBUG CODE (remove after delayed viewer loading complete)
		if(this.m_debugDelayedViewerLoadingMode === 2) {
			return;
		}
		//END DEBUG CODE


		if(evt && evt.payload) {
			this.m_visible = evt.payload.isVisible ? true : false;
			if( !this.m_visible){
				// If we're being hidden and we've reached the css limit already then cleanup any style that
				// we've added
				if (this._cssLimitReached) {
					this.cleanupStyles();
				}
				return;
			}

			if(!this.getLoadManager().isViewerLoadInitiated()) {
				//There is no Viewer object and this widget is visible,  so post report as normal
				this.postReport(null);
			} else {
				this._updateOnVisible();
			}

		}
	},

	_updateOnVisible: function() {
		var oLoadManager = this.getLoadManager();
		if(oLoadManager.isViewerReady()) {
			var oCV = this.getViewerObject();
			
			// If we've reached the css limit and we're being made visible
			// then add back any styles that might have been removed
			if (this._cssLimitReached) {
				this.reloadStyles();
			}
			
			if (this.isSavedOutput()){
				//fix for COGCQ0068371, we don't run pending updates for saved report
				oLoadManager.getDelayedLoadingContext().setForceRunReport(false);
				return;
			}
			if( !oLoadManager.getDelayedLoadingContext().isEmpty() ) {
				//There are pending updates to the report: it needs to be run,
				//based on the state of the DelayedLoadingContext.
				oLoadManager.runWhenHasViewer(function() {
					oLoadManager.runningReport();
					var factory = oCV.getActionFactory();
					var buxRunReportAction = factory.load( 'BuxRunReport');
					var delayedLoadingContext = oLoadManager.getDelayedLoadingContext();
					var requestParams = {
						promptValues: delayedLoadingContext.getPromptValues(),
						clearCascadeParamsList:  delayedLoadingContext.getCascadingPromptParamsToClear()
					};
					buxRunReportAction.setRequestParams( requestParams );
					// if it's the first time we run the report make sure we send all the parameter values (prompts) we got from CM
					// when we queries for the report specification.
					if (!oCV.getConversation()) {
						buxRunReportAction.setSendParameterValues(true);
					}
					var bServerPending = buxRunReportAction.execute();
					oLoadManager.getDelayedLoadingContext().reset();
					return bServerPending;
				});
			} else {
				//Refresh any frozen widgets. Webkit interferes with scroll position
				//when DOM objects have display:none.
				if (oCV.getPinFreezeManager()) {
					oCV.getPinFreezeManager().onSetVisible();
				}
			}
		} else {
			//Once Viewer has  been loaded and all delayed requests
			//in the queue have been serviced, try again
			oLoadManager.setOnEmptyCallback(dojo.hitch(this, function() {
				if(this.isVisible()) {
					this._updateOnVisible();
				} //else, onSetVisible will be called the next time the widget is visible
			}));
		}
	},

	/**
	 * To be used only for event handlers to determine if report should be run when the action is executed.
	 * @return true iff the event handler should invoke a run on the report,
	 *	i.e. it is possible to run the report at the moment (viewer loaded, etc.),
	 *	and it is worth the cost of a run (the widget is visible).
	 */
	shouldReportBeRunOnAction : function() {
		return ( this.isVisible() && this.getLoadManager().isViewerLoaded() && this.getLoadManager().canRunReports() );
	},

	isVisible: function() {
		//BEGIN DEBUG CODE (remove after delayed viewer loading complete)
		if(this.m_debugDelayedViewerLoadingMode === 2) {
			return true;
		}
		//END DEBUG CODE


		if(this.m_visible === null) {
			//Read from item set
			var delayedLoad = this.iContext.getItemSet("buxdelayedload", false);
			if(delayedLoad){
				this.m_visible = (delayedLoad.getItemValue("widgetVisible") === "true");
			} else {
				//If no item set, default to visible
				this.m_visible = true;
			}
		}

		return this.m_visible;
	},

	isPastedWidget: function() {
		return this._pastedWidget;
	},
	
	setWidgetCopyPasteParameters: function() {
		//sets widget parametes from widget Copy/Paste action
		this.copyPasteResource = this.getAttributeValue("resource");
		if (this.copyPasteResource) {
			this._pastedWidget = true;
			if (this.getAttributeValue("copy.ciPublishedReportPath") && this.getAttributeValue("originalReport") == null && this.getSavedItem() == null) {
				//copy/paste from not saved yet widget ci published widget copy
				this.ciPublishedReportPath = this.getAttributeValue("copy.ciPublishedReportPath");
			} else if (this.getAttributeValue("originalReport") == null) {
				//ci published dashboard widget doesn't have originalReport value instead savedReportPath used
				this.ciPublishedReportPath = this.getSavedItem();
				//we set to in case if user copy/paste from copied and not yes saved widget
				this.setAttributeValue("copy.ciPublishedReportPath", this.ciPublishedReportPath);
			}
			this.removeAttributeValue("savedReportPath");
			this.removeAttributeValue("savedReportPath.resource");
			this.removeAttributeValue("resource");
		}
	},

	postSetWidgetCopyPasteParameters: function() {
		//post sets widget copy/paste parameters
		if (this.copyPasteResource) {
			this.removeAttributeValue("copy.conversation");
			this.copyPasteResource = null;
		}
	},
	
	isSelectionFilterEnabled: function() {
		return this.m_bSelectionFilterSwitch;
	},
	
	toggleSelectionFilterSwitch: function() {
		this.m_bSelectionFilterSwitch = !this.isSelectionFilterEnabled();
		
		var selectionController = this.getViewerObject().getSelectionController();
		if( selectionController )
		{
			if( this.isSelectionFilterEnabled() )
			{ 
				selectionController.setSelectionStyles( selectionController.FILTER_SELECTION_STYLE );
				selectionController.repaintSelections();
			}else{
				//clear the selections
				selectionController.resetAll();
			}
		}
	},
	
	/**
	 * This function sets up selection controller to do master filter selection
	 */
	preprocessPageClicked : function( bInvokingContextMenu, evt ) {
		if( !this.isSelectionFilterEnabled() ){
			return;
		}
		var selectionController = this.getViewerObject().getSelectionController();
		selectionController.setAllowHorizontalDataValueSelection(true);
		if( bInvokingContextMenu )
		{
			if( !selectionController.hasSavedSelections() ){
				selectionController.saveSelections();
			}
			selectionController.setSelectionStyles( selectionController.FILTER_SELECTION_CONTEXT_MENU_STYLE );
		} else {
			
			selectionController.setSelectionStyles( selectionController.FILTER_SELECTION_STYLE );
			selectionController.clearSavedSelections();

		}
	},
	
	ignoreEvent : function(evt) {
		stopEventBubble(evt);
	},
	
	/**
	 * When selection filter is turned on we need to hide the drill through links, and when
	 * it's turned off we need to put the drill through links back
	 */
	updateDrillThroughLinks : function() {
		var oCV = this.getViewerObject();
		if (!oCV) {
			return;
		}
		
		var selectionFilterEnabled = this.isSelectionFilterEnabled();
		var isSavedOutput = oCV.envParams["ui.action"] == "view" || oCV.envParams["ui.action"] == "buxView";
		
		var currentSuffix = selectionFilterEnabled ? "" : "_temp";
		var newSuffix = selectionFilterEnabled ? "_temp" : "";
		var attributesToRename = ["onclick", "onkeypress", "style"];
		
		// Saved outputs their drill through links embeded in the report, so we need
		// to find all the correct 'onclick' attributes.
		var attributeToSearchFor = isSavedOutput ? "onclick" + currentSuffix : "dttargets";
		
		var contentDiv = document.getElementById("RVContent" + oCV.getId());
		var drillThroughNodes = getElementsByAttribute(contentDiv, "*", attributeToSearchFor);
		
		if (!drillThroughNodes) {
			return;
		}
				
		for (var i=0; i < drillThroughNodes.length; i++) {
			var node = drillThroughNodes[i];
			
			// Don't need to worry about drill through on charts since there's no special style
			if (node.nodeName.toLowerCase() !== "area") {
				if (isSavedOutput) {
					// For saved output make sure this is a drill through link by looking at the onclick value
					var onclickValue = node.getAttribute("onclick" + currentSuffix);
					if (!onclickValue || (onclickValue.indexOf("doSingleDrillThrough") == -1 && onclickValue.indexOf("doMultipleDrillThrough"))) {
						continue;
					}
					
					// Need to rename the onclick, style and onkeypress attributes
					for (var ii=0; ii < attributesToRename.length; ii++) {
						var attributeName = attributesToRename[ii];
						if (node.getAttribute(attributeName + currentSuffix)) {
							this._renameAttribute(node, attributeName + currentSuffix, attributeName + newSuffix);
						}
					}
				}
				
				this._updateCellStyle(node, selectionFilterEnabled);
			}
		}
	},

	/**
	 * Removes/adds the 'hy' (hyperlink) style which is used for dirll through links
	 */
	_updateCellStyle : function(node, selectionFilterEnabled) {
		// Don't bother with text nodes
		if (node.nodeType == 3) {
			return;
		}
		
		if (selectionFilterEnabled && node.className === "hy") {
			this._renameAttribute(node, "class", "class_temp");
		}
		else if (!selectionFilterEnabled && node.getAttribute("class_temp")) {
			this._renameAttribute(node, "class_temp", "class");
		}
		
		// Loop through all the child elements
		if (node.childNodes) {
			for (i=0; i < node.childNodes.length; i++) {
				this._updateCellStyle(node.childNodes[i], selectionFilterEnabled);
			}
		}
	},

	_renameAttribute : function(node, originalName, newName) {
		node.setAttribute(newName, node.getAttribute(originalName));
		node.removeAttribute(originalName);
	},
	
	addButtonToSavedToolbarButtons: function(name, button, position) {
		if (typeof name != "undefined" && name != null) {
			this.savedToolbarButtons[name] = {};
			this.savedToolbarButtons[name]["button"] = button;
			this.savedToolbarButtons[name]["position"] = position;
		}
	},
	
	getButtonFromSavedToolbarButtons: function(name) {
		return this.savedToolbarButtons[name];
	},
	
	removeFromSavedToolbarButtons: function(name){
		if(typeof this.savedToolbarButtons[name] != "undefined" && this.savedToolbarButtons[name] != null) {
			delete this.savedToolbarButtons[name];
		}
	}
});

/**
 * Helper class for the undo/redo queue
 */
function UndoRedoQueue(oWidget)
{
	this.m_queue = [];
	this.m_queueLimit = 20;
	this.m_iCurrentPos = 0;
	this.m_widget = oWidget;
	this.m_bUndoRedoCalled = false;
	this.m_lastAction = null;
	this.currentUndoObj = null;
	this.beenUsed = false;
	this.m_originalSpec = null;
}

UndoRedoQueue.prototype.setOriginalSpec = function(spec)
{
	// only time we need an original spec if the queue is still empty.
	if (this.m_queue.length == 0) {
		this.m_originalSpec = spec;
	}
};

UndoRedoQueue.prototype.clearQueue = function()
{
	while (this.m_queue.length > 0)
	{
		this.m_queue.pop();
	}

	this.m_iCurrentPos = 0;
};

UndoRedoQueue.prototype.getPosition = function()
{
	return this.m_iCurrentPos;
};

UndoRedoQueue.prototype.hasBeenUsed = function()
{
	return this.beenUsed;
};

UndoRedoQueue.prototype.getLength = function()
{
	return this.m_queue.length;
};

UndoRedoQueue.prototype.initUndoObj = function(obj)
{
	// first time we add to the stack for an action, add the current specification/parameters to have the initial report
	if (this.m_queue.length == 0)
	{
		var oCV = this.m_widget.getViewerObject();
		var spec = this.m_originalSpec == null ? oCV.envParams["ui.spec"] : this.m_originalSpec;
		this.m_originalSpec = null;
		this.m_queue.push({"spec": spec,
			"parameters": oCV.getExecutionParameters(),
			"tooltip": obj.tooltip,
			"infoBar": oCV.envParams["rapReportInfo"],
			"widgetProperties" : this.m_widget.getProperties().getOldProperties(),
			"hasAVSChart" : oCV.hasAVSChart(),
			"undoType" : "server"
		});
		this.m_iCurrentPos = this.m_queue.length-1;
		this.beenUsed = true;
	}


	this.currentUndoObj = obj;
};

UndoRedoQueue.prototype.add = function(obj)
{
	// Make sure we don't add to the undo stack if the Viewer is getting refreshed
	// because of an undo or redo
	if (this.m_bUndoRedoCalled)
	{
		this.m_bUndoRedoCalled = false;
		return;
	}
	else if (this.currentUndoObj == null)
	{
		return;
	}
	else if (obj.reportUpdated == true)
	{
		while (this.m_queue.length > this.m_queueLimit)
		{
			this.m_queue.shift();
		}

		this.clearEnd();

		var viewer = this.m_widget.getViewerObject();
		if (this.currentUndoObj.saveSpec == true || viewer.envParams["ui.doNotUseConversationForUndo"] === "true")
		{
			this.currentUndoObj.spec = viewer.envParams["ui.spec"];
			this.currentUndoObj.parameters = viewer.getExecutionParameters();
		}
		else
		{
			this.currentUndoObj.conversation = viewer.getConversation();
		}

		if (viewer.envParams["rapReportInfo"])
		{
			this.currentUndoObj.infoBar = viewer.envParams["rapReportInfo"];
		}

		this.currentUndoObj.widgetProperties = this.m_widget.getProperties().getUndoInfo();
		this.currentUndoObj.palette = viewer.m_sPalette;

		if (this.m_widget.getProperties().getFlashCharts())
		{
			this.currentUndoObj.hasAVSChart = viewer.hasAVSChart();
		}

		this.currentUndoObj.undoType = "server";

		this.finalizeAdd();
	}

};

UndoRedoQueue.prototype.addClientSideUndo = function(obj) {
	// Make sure we don't add to the undo stack if the Viewer is getting refreshed
	// because of an undo or redo
	if (this.m_bUndoRedoCalled) {
		this.m_bUndoRedoCalled = false;
		return;
	}

	if (obj.undoCallback && obj.redoCallback) {
		this.initUndoObj(obj);
		this.currentUndoObj.undoType = "client";
		this.finalizeAdd();
	}
};

UndoRedoQueue.prototype.finalizeAdd = function() {
	this.m_queue.push(this.currentUndoObj);
	this.m_iCurrentPos = this.m_queue.length-1;
	this.m_bUndoRedoCalled = false;
	this.m_lastAction = "";
	this.currentUndoObj = null;
	this.beenUsed = true;
};

UndoRedoQueue.prototype.moveBack = function()
{
	if (this.m_iCurrentPos <= 0)
	{
		return null;
	}

	var sUndoType = this.m_queue[this.m_iCurrentPos].undoType;

	this.m_bUndoRedoCalled = true;
	this.m_lastAction = "undo";
	this.m_iCurrentPos--;
	this.m_viewerState = {"parameters" : this.m_widget.getViewerObject().getExecutionParameters(), "spec" : this.m_widget.getViewerObject().envParams["ui.spec"]};
	if (typeof this.m_queue[this.m_iCurrentPos] != "undefined")
	{
		this.m_widget.getViewerObject().m_sPalette = this.m_queue[this.m_iCurrentPos].palette;
		if (sUndoType == "client") {
			return this.m_queue[this.m_iCurrentPos+1];
		}
		// if we're undoing a server type request, keep going back into the queue
		// until we hit another server type request
		var iIndex = this.m_iCurrentPos;
		while (iIndex > 0 && this.m_queue[iIndex] && this.m_queue[iIndex].undoType != "server") {
			iIndex--;
		}
		return this.m_queue[iIndex];
	}
	return null;
};

UndoRedoQueue.prototype.moveForward = function()
{
	if (this.m_iCurrentPos >= this.m_queue.length)
	{
		return null;
	}

	this.m_bUndoRedoCalled = true;
	this.m_iCurrentPos++;
	this.m_lastAction = "redo";
	this.m_viewerState = {"parameters" : this.m_widget.getViewerObject().getExecutionParameters(), "spec" : this.m_widget.getViewerObject().envParams["ui.spec"]};
	if (typeof this.m_queue[this.m_iCurrentPos] != "undefined")
	{
		this.m_widget.getViewerObject().m_sPalette = this.m_queue[this.m_iCurrentPos].palette;
		return this.m_queue[this.m_iCurrentPos];
	}
	return null;
};

UndoRedoQueue.prototype.clearEnd = function()
{
	while (this.m_queue.length-1 > this.m_iCurrentPos)
	{
		this.m_queue.pop();
	}
};

UndoRedoQueue.prototype.handleCancel = function()
{
	if (this.m_lastAction == "undo")
	{
		this.m_iCurrentPos++;
	}
	else if (this.m_lastAction == "redo")
	{
		this.m_iCurrentPos--;
	}

	if (this.m_lastAction == "redo" || this.m_lastAction == "undo")
	{
		var widgetProperties = this.m_widget.getProperties();
		var undoObj = this.m_queue[this.m_iCurrentPos];
		if (widgetProperties && undoObj && undoObj.widgetProperties) {
			widgetProperties.doUndo(undoObj.widgetProperties);
		}
	}

	this.m_lastAction = "";
	this.m_bUndoRedoCalled = false;
	this.currentUndoObj = null;
};

UndoRedoQueue.prototype.handleFault = function()
{
	this.currentUndoObj = null;
	this.m_bUndoRedoCalled = false;
};

UndoRedoQueue.prototype.getUndoTooltip = function()
{
	if (this.m_iCurrentPos > 0)
	{
		return RV_RES.IDS_JS_UNDO + " " + this.m_queue[this.m_iCurrentPos].tooltip;
	}
	return RV_RES.IDS_JS_UNDO;
};

UndoRedoQueue.prototype.getRedoTooltip = function()
{
	if (this.m_iCurrentPos < (this.m_queue.length-1))
	{
		return RV_RES.IDS_JS_REDO + " " + this.m_queue[this.m_iCurrentPos+1].tooltip;
	}
	return RV_RES.IDS_JS_REDO;
};

/*
 * Class to handle showing saved output in an iWidget
 */
function CIWidgetSavedOutput(iWidget) {
	this.iWidget = iWidget;
	this.bContainsChart = false;
	this.bContainsDrillThrough = false;
	this.bPagedOutput = true;
}

CIWidgetSavedOutput.prototype.getIWidget = function() {
	return this.iWidget;
};

CIWidgetSavedOutput.prototype.isPagedOutput = function() {
	return this.bPagedOutput;
};

CIWidgetSavedOutput.prototype.setPagedOutput = function(pagedOutput) {
	this.bPagedOutput = pagedOutput;
};

CIWidgetSavedOutput.prototype.getCognosViewer = function() {
	return this.getIWidget().getViewerObject();
};

CIWidgetSavedOutput.prototype.getIframeWindow = function() {
	return this.savedOutputWindow;
};

CIWidgetSavedOutput.prototype.getSavedOutputDiv = function() {
	return this.savedOutputDiv;
};

CIWidgetSavedOutput.prototype.render = function() {
	if (this.isPagedOutput() && this.getFirstPage()) {
		this.currentPageIndex = 0;
		this._showPages( [this.getFirstPage()] );
	} 
	else {
		// If the output has tabs show all the pages of the current tab
		if (this.tabbedSavedOutput && this.currentPageIndex && this.pageNodes) {		
			var tabid = this.pageNodes[this.currentPageIndex].getAttribute("tabid");
			this.switchSavedOutputTab(tabid);
		}
		else if (this.getCognosViewer() && this.getCognosViewer().getCurrentlySelectedTab()) {
			this.switchSavedOutputTab(this.getCognosViewer().getCurrentlySelectedTab());
		}
		else {
			this.showHTMLFragment(this.getIframeWindow().document.body.innerHTML);
		}
	}
};

CIWidgetSavedOutput.prototype.outputDoneLoading = function() {
	if(window['gReportWidgetLoadQueue']) {
		window['gReportWidgetLoadQueue'].widgetDoneLoading(this.getIWidget());
	}
	
	this.getIWidget().setOriginalFormFields(null);

	var cognosViewerObject = this.getCognosViewer();
	var sCVID = cognosViewerObject.getId();

	this.savedOutputWindow = dojo.byId("CVHiddenIFrame" + sCVID).contentWindow;
	this.savedOutputDiv = dojo.byId("CVSavedOutputDiv" + sCVID);

	var sc = cognosViewerObject.getSelectionController();
	if ( !sc.hasContextData() && this.savedOutputWindow.onLoadEvent ) {
		this.savedOutputWindow.onLoadEvent();
	}

	// Create an array of all the page nodes in the saved output
	this._populatePageNode();

	// load all the style tags from the iframe
	var oReportDiv = dojo.byId("_" + this.iWidget.iContext.widgetId + "_cv");

	this.loadStyleInfoFromIframe(oReportDiv);

	this.bContainsChart = typeof this.savedOutputWindow.displayChart == "function" ? true : false;
	this.bContainsDrillThrough = typeof this.savedOutputWindow.drillThroughTarget != "undefined" ? true : false;

	this.render();
	this.getMetaDataFromIFrame();

	if (this.bContainsDrillThrough) {
		// get the drillTargets array from the iframe
		window[sCVID + "drillTargets"] = this.getIframeWindow().drillTargets;
	}

	cognosViewerObject.fillInContextData();
	cognosViewerObject.updateBorderCollapse();
	this.getIWidget().updateToolbar();
	cognosViewerObject.setReportRenderingDone(true);

	var callback = GUtil.generateCallback(this.getIWidget().fetchAnnotationData, [], this.getIWidget());
	var numMissing = this.getPageContextData(callback);

	// if there isn't any missing context information then the callback won't be triggered
	if (numMissing == 0) {
		this.getIWidget().fetchAnnotationData();
	}

	this.fixDuplicateFormFields();

	this.getIWidget().getLoadManager().processQueue();

	// clear out the cv.outputKey and XNodeId
	delete cognosViewerObject.envParams["cv.outputKey"];
	this.getIWidget().setXNodeId(null);

	
	var widget = this.getIWidget();
	var callbackFunc = function() {
		widget.iContext.iEvents.fireEvent("com.ibm.bux.widget.render.done", null, {});

		// Need to call render tabs AFTER CW makes the Viewer visible or our size calculations will be wrong
		cognosViewerObject.renderTabs();
		
		// If we are showing tabs, switch to the first tab
		if (cognosViewerObject.getCurrentlySelectedTab() != null) {
			widget.getSavedOutput().tabbedSavedOutput = true;
			widget.getSavedOutput().switchSavedOutputTab(cognosViewerObject.getCurrentlySelectedTab());
		}
	};
	
	setTimeout(callbackFunc, 100);
};

/**
 * Create an array of all the page nodes in the saved output
 */
CIWidgetSavedOutput.prototype._populatePageNode = function() {
	// Create an array of all the page nodes in the saved output
	this.pageNodes = [];
	var node = this.getIframeWindow().document.body.firstChild;
	while (node) {
		if (node.nodeName.toLowerCase() == "table") {
			this.pageNodes.push(node);
		}
		
		node = node.nextSibling;
	}	
};

CIWidgetSavedOutput.prototype.switchSavedOutputTab = function(tabId, userInvoked) {
	if (!this.pageNodes) {
		return;
	}
	
	if (userInvoked) {
		// lastVisitiedPage is used so that when you switch to a previously visited tab
		// you'll be back to the same page on that tab
		if (!this.lastVisitedPage) {
			this.lastVisitedPage = {};
		}
		
		if (this.isPagedOutput()) {
			// Save the page of the tab we're switching from
			var oldTabId = this.pageNodes[this.currentPageIndex].getAttribute("tabid");
			this.lastVisitedPage[oldTabId] = this.currentPageIndex;
			
			// If we've already visited the tab we're switching to, use the stored page number
			if (this.lastVisitedPage[tabId]) {
				this.currentPageIndex = this.lastVisitedPage[tabId];
				this._showPages([this.pageNodes[this.currentPageIndex]]);
				return;
			}
		}
	}
	
	var pagesToDisplay = [];
	
	// Loop through all the pages and find any that match the tab we're switching to
	for (var i=0; i < this.pageNodes.length; i++) {
		var node = this.pageNodes[i];
		if (node && node.getAttribute && node.getAttribute("tabid") == tabId) {
			pagesToDisplay.push(node);
			this.currentPageIndex = i;
			
			// We're paging the saved output, so only show the first page in the tab
			if (this.isPagedOutput()) {
				break;
			}
		}
	}
	
	this._showPages(pagesToDisplay);
};

/*
	This is not pretty, but necessary. When rendering a saved output in BUX, we need
	the response to contain a bunch of hidden form fields since there's saved output code that
	relies on those form fields. Problem is, that we'll end up with duplicate hidden form fields.
	This code loops through all the form fields and will remove any duplicates using the value from
	the last one as the value of the form field.
*/
CIWidgetSavedOutput.prototype.fixDuplicateFormFields = function() {
	var formWarpRequest = document.getElementById("formWarpRequest" + this.getCognosViewer().getId());
	if (formWarpRequest) {
		for (var formFieldIndex=0; formFieldIndex < formWarpRequest.elements.length; formFieldIndex++) {
			var name = formWarpRequest.elements[formFieldIndex].name;
			if (name && name.length > 0) {
				// if there's multiple form fields with the same name
				if (formWarpRequest[name].length > 1) {
					// get the value of the last form field with the name. It's the one we want
					var value = formWarpRequest[name][formWarpRequest[name].length-1].value;

					// delete all the duplicate form fields
					while (formWarpRequest[name].length > 1) {
						formWarpRequest[name][1].parentNode.removeChild(formWarpRequest[name][1]);
					}

					// some weird behavior with IE, if there's still an array of form fields set the value correctly.
					if (formWarpRequest[name][0]) {
						formWarpRequest[name][0].value = value;
					}

					formWarpRequest[name].value = value;
				}
			}
		}
	}
};

CIWidgetSavedOutput.prototype.getPageContextData = function(callback){
	var items = {};

	dojo.query('[ctx]', this.getSavedOutputDiv()).forEach(function(item){
		var ctx = item.getAttribute("ctx");
		var ctxIds = ctx.split(':');
		for (var i = 0; i < ctxIds.length; i++) {
			var value = ctxIds[i];
			if (value && value.length > 0) {
				items[value] = true;
			}
		}
	});

	var arrItems = [];
	for (var item in items) {
		arrItems.push(item);
	}

	return this.getCognosViewer().getSelectionController().fetchContextData(arrItems, callback);
};

CIWidgetSavedOutput.prototype.loadStyleInfoFromIframe = function(oReportDiv){

	var htmlNode = null;
	// For XHTML the first node is the doctype. Loop through the children of the document
	// to find the first child that has children
	var savedOutputDoc = this.savedOutputWindow.document;
	for (var index=0; index < savedOutputDoc.childNodes.length; index++) {
		if (savedOutputDoc.childNodes[index].childNodes && savedOutputDoc.childNodes[index].childNodes.length > 0) {
			htmlNode = savedOutputDoc.childNodes[index];
			break;
		}
	}

	window.gScriptLoader.loadStyles(htmlNode.firstChild, this.iWidget.getViewerId());

	var links = dojo.query("link", htmlNode);
	var linkHTML = "";
	for (i = 0; i < links.length; i++) {
		var href = links[i].getAttribute("href");
		if (href) {
			linkHTML += '<link href="' + href + '" />';
		}
	}
	window.gScriptLoader.loadCSS(linkHTML, oReportDiv, true, this.iWidget.getViewerId());

};

CIWidgetSavedOutput.prototype.getFirstPage = function() {
	return this.pageNodes[0];
};

CIWidgetSavedOutput.prototype.getLastPage = function() {
	return this.pageNodes ? this.pageNodes[this.pageNodes.length - 1] : null;
};

CIWidgetSavedOutput.prototype.writeNavLinks = function() {
	var availablePageLinks = "";
	if (this.isPagedOutput()) {
		if (this.tabbedSavedOutput && !isNaN(this.currentPageIndex)) {
			var tabId = this.pageNodes[this.currentPageIndex].getAttribute("tabid")
			
			if (this.currentPageIndex > 0 && this.pageNodes[this.currentPageIndex - 1].getAttribute("tabid") == tabId) {
				availablePageLinks += " firstPage previousPage ";
			}
			
			if (this.currentPageIndex < (this.pageNodes.length - 1) && this.pageNodes[this.currentPageIndex + 1].getAttribute("tabid") == tabId) {
				availablePageLinks += " nextPage lastPage ";
			}			
		}
		else {
			if (this.currentPageIndex > 0) {
				availablePageLinks += " firstPage previousPage ";
			}
			
			if (this.currentPageIndex < (this.pageNodes.length - 1)) {
				availablePageLinks += " nextPage lastPage ";
			}
		}
	}

	this.getCognosViewer().writeNavLinks(availablePageLinks, true);
};

CIWidgetSavedOutput.prototype.pageAction = function(action) {
	switch(action) {
		case "firstPage":
			if (this.tabbedSavedOutput) {
				var tabId = this.pageNodes[this.currentPageIndex].getAttribute("tabid")
				
				// Find the first page for the tab
				for (var i=0; i < this.pageNodes.length; i++) {
					var node = this.pageNodes[i];
					if (node && node.getAttribute && node.getAttribute("tabid") == tabId) {
						this.currentPageIndex = i;
						break;
					}
				}				
			}
			else {
				this.currentPageIndex = 0;
			}
			break;
		case "previousPage":
			this.currentPageIndex = this.currentPageIndex - 1;
			break;
		case "nextPage":
			this.currentPageIndex = this.currentPageIndex + 1;
			break;
		case "lastPage":
			if (this.tabbedSavedOutput) {
				var tabId = this.pageNodes[this.currentPageIndex].getAttribute("tabid")
				var foundTabSection = false;
				
				// Find the last page for the tab
				for (var i=0; i < this.pageNodes.length; i++) {
					var node = this.pageNodes[i];
					if (node && node.getAttribute && node.getAttribute("tabid") == tabId) {
						foundTabSection = true;
					}
					else if (foundTabSection) {
						this.currentPageIndex = i -1;
						break;
					}
					
				}				
			}
			else {
				this.currentPageIndex = this.pageNodes.length - 1;
			}
			break;
	}

	this._showPages([this.pageNodes[this.currentPageIndex]]);
};

CIWidgetSavedOutput.prototype._showPages = function(aPages) {
	var oCV = this.getCognosViewer();
	oCV.getSelectionController().clearSelectedObjects();
	if (aPages.length == 1) {
		this.showHTMLFragment(aPages[0].innerHTML);
	}
	else {
		// We're showing multiple pages, get all their HTML and send it all at once
		var sHtml = "";
		for (var i=0; i < aPages.length; i++) {
			sHtml += aPages[i].innerHTML;
		}
		this.showHTMLFragment(sHtml);
	}
	this.writeNavLinks();


	// If we're dealing with tabbed saved output and the user switched  tabs then keep
	// the tab control in focus
	if (this.tabbedSavedOutput && this.lastVisitedPage) {
		this.getIWidget().placeTabControlInView();
	}
	else {
		oCV.setKeepFocus(true);		
	}
	
	oCV.doneLoadingUpdateA11Y("complete");

	var callback = GUtil.generateCallback(this.getIWidget().fetchAnnotationData, [], this.getIWidget());
	var numMissing = this.getPageContextData(callback);
	// if there isn't any missing context information then the callback won't be triggered
	if (numMissing == 0) {
		this.getIWidget().fetchAnnotationData();
	}
};

CIWidgetSavedOutput.prototype.getMetaDataFromIFrame = function() {
	if (typeof this.getIframeWindow().getSelectionController == "function") {
		var iframeSelectionController = this.getIframeWindow().getSelectionController();
		if (iframeSelectionController) {
			var selectionController = this.getCognosViewer().getSelectionController();
			selectionController.addMetaData(iframeSelectionController.getCCDManager().m_md);
			selectionController.addContextData(iframeSelectionController.getCCDManager().m_cd);
			selectionController.setSelectionBasedFeaturesEnabled(true);
		}
	}
};

CIWidgetSavedOutput.prototype.processDrillThrough = function(sHTML) {
	if (this.bContainsDrillThrough && (typeof this.bOldOutput == "undefined" || this.bOldOutput == true)) {
		var drillThroughRegEx = new RegExp('onclick=\"doSingleDrillThrough[^\"]*\"|onclick=\'doMultipleDrillThrough[^\']*\'', "gim");
		var aM = sHTML.match(drillThroughRegEx);
		if (aM)
		{
			if (typeof this.bOldOutput == "undefined" && aM.length > 0 && aM[0].indexOf("'_THIS_'") > 0) {
				this.bOldOutput = false;
			} else {
				this.bOldOutput = true;

				// singledrill and multipledrill use different quots (', ") for the onclick. So figure
				// which one we're suppose to use
				var endingQuot = "";
				var quot = "'";
				if (aM.length > 0) {
					endingQuot = aM[0].charAt(aM[0].length - 1);
				}
				if (endingQuot == "'"){
					quot = "\"";
				}

				for (var i = 0; i < aM.length; i++)
				{
					sHTML = sHTML.replace(aM[i], aM[i].substring(0, aM[i].length-3) + "," + quot + this.getCognosViewer().getId() + quot + ");" + endingQuot);
				}
			}
		}
	}

	return sHTML;
};

CIWidgetSavedOutput.prototype.processChart = function(sHTML){
	// The preSelectNode call is only for IE. Fix it so calls .pcc since we don't have a preSelectNode function,
	// it's only available in saved output
	if (isIE()) {
		sHTML = sHTML.replace(/preSelectNode\(event\);/g, getCognosViewerObjectRefAsString(this.getCognosViewer().getId()) + ".pcc(event);");
	} else {
		sHTML = sHTML.replace(/preSelectNode\(event\);/g, "");
	}

	var cognosViewerID = this.getCognosViewer().getId();
	var iframe = document.getElementById('CVHiddenIFrame' + cognosViewerID);
	var iframeSrc = iframe.src;
	if (iframeSrc.indexOf("repository") >= 0) {
		//viewer uses CM's rest API
		var indOfContent = iframeSrc.indexOf("content");
		var gerURI = iframeSrc.substring(0, indOfContent);
		sHTML = sHTML.replace(/src\=\"images\//g, "src=\"" + gerURI + "images/");
	}



	sHTML = this.fixupChartUseMapValue(sHTML);

	// get rid of some chart js that's no longer needed.
	return sHTML.replace(/displayChart[^;].*;|var graphicSrc[^;].*;|var graphicName[^;].*;/g, "");
};

/**
 * Add namespace to map name and corresponding usemap value
 */
CIWidgetSavedOutput.prototype.fixupChartUseMapValue = function( sHTML ){
	var re = /usemap\s*=\s*"*#(\w+)"*/gi;
	var match,	params = [];
	while( (match = re.exec( sHTML )) ){
		params.push( match[1] );
	}

	for( var i = 0; i < params.length; i++){
		//had to create RegExp obj because IE does not recognize the 'global'modifier when passed as a separate parameter into replace()
		var strToMatch = new RegExp( params[i], 'g' );
		sHTML = sHTML.replace( strToMatch, params[i] + this.getCognosViewer().getId());
	}
	return sHTML;
};

CIWidgetSavedOutput.prototype.showHTMLFragment = function(sHTML) {

	if (this.bContainsChart) {
		sHTML = this.processChart(sHTML);
	}

	sHTML = this.processDrillThrough(sHTML);

	sHTML = sHTML.replace(/_THIS_/g,this.getCognosViewer().getId());

	// we want to ignore all the document.writes when taking the HTML out of the iframe
	// since it was already executed inside the iframe
	this.getIWidget().loadStylesAndScripts(sHTML, this.getSavedOutputDiv(), false);
	
	this.getIWidget().reselectSelectionFilterObjects();
	this.getIWidget().addChromeWhitespaceHandler(this.getCognosViewer().getId());
};

/*
 * Because of the way CScriptLoader loads and processes scripts (asynchronously with setInterval),
 * this function is necessary. We don't want to have the toolbar initialize until all scripts
 * have been loaded and executed. Otherwise, we may end up referencing variables that are not initialized.
 */
function gInitializeViewer(obj)
{
	if (window.gScriptLoader.hasCompletedExecution()) {
		var viewerObject = obj.getViewerObject();

		if(viewerObject && viewerObject.inlineScriptsDoneExecuting == true) {
			clearInterval(obj.timer);
			if(typeof viewerObject.errorOccured != "undefined") {
				obj.fireEvent("com.ibm.bux.widget.render.done", null, {});
			}
			else if(typeof viewerObject.getToolbar() != "undefined") {
				// associate the widget ref with the viewer object
				viewerObject.setViewerWidget(obj);

				if (obj.isSelectionFilterEnabled()) {
					obj.updateDrillThroughLinks();
				}

				if( obj.isDashboardOwner() )
				{
					viewerObject.addReportInfo();
				}
				if (obj.promptParametersRetrieved == true) {
					var reportPrompts = obj.getAttributeValue( "viewerReportPrompts");
					viewerObject.envParams["reportPrompts"] = reportPrompts;
				} else if (viewerObject.envParams && viewerObject.envParams["widget.promptParametersRetrievedOnDrop"] == "true") {
					obj.promptParametersRetrieved =  true;
				}

				var enablePromptAndDrillEventsByDefault = obj.getAttributeValue("syncNewWidgets");
				if(enablePromptAndDrillEventsByDefault === null || enablePromptAndDrillEventsByDefault === "true") {
					enablePromptAndDrillEventsByDefault = true;
				} else {
					enablePromptAndDrillEventsByDefault = false;
				}

				if(!enablePromptAndDrillEventsByDefault && (obj.isPastedWidget() || obj.isOpeningSavedDashboard() == false)) {
					obj.disableListenToForEvent(['com.ibm.widget.contextChanged.drill', 'com.ibm.widget.contextChanged.prompt', 'com.ibm.widget.contextChanged']);
				}

				//Fire this now that we have the IWidget set.
				obj.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive", null, (viewerObject.m_flashChartsObjectIds.length !== 0));
			}
		}
	}
}

function gVWEvent(sId, evt, sEvent) {
	var oCV = window['oCV' + sId];
	if (oCV) {
		oCV.loadExtra();
		var iWidget = oCV.getViewerWidget();
		if (iWidget) {
			iWidget[sEvent](evt);
		}
	}
}

function ReportWidgetLoadQueue(concurrentLoadSetting) {
	this._concurrentLoadSetting = concurrentLoadSetting;
	this._widgetsRunning = [];
	this._queue = [];
}

ReportWidgetLoadQueue.prototype.add = function(reportWidget) {
	this._queue.push(reportWidget);
	this.loadNextWidget();
};

ReportWidgetLoadQueue.prototype.widgetDoneLoading = function(widget) {
	for(var i = 0; i < this._widgetsRunning.length; ++i) {
		var widgetToRemove = this._widgetsRunning[i];
		if(widgetToRemove == widget) {
			this._widgetsRunning.splice(i, 1);
			break;
		}
	}

	this.loadNextWidget();
};

ReportWidgetLoadQueue.prototype.loadNextWidget = function() {
	if(this._widgetsRunning.length < this._concurrentLoadSetting) {
		var widgetToLoad = this._queue.shift();
		if(typeof widgetToLoad != "undefined") {
			this._widgetsRunning.push(widgetToLoad);
			widgetToLoad.postReport(null);
		}
	}
};
