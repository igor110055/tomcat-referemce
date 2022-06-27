/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2015
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

dojo.require("dojo.string");
dojo.require("dojo._base.array");
dojo.require("bux.dialogs.WidgetPropertiesFromJSON");
dojo.require("ActiveReportIWidgetProperties");
dojo.require("bux.IWidgetUtils");

dojo.provide("ActiveReportIWidget");

var globalActiveViewerIdentifier = 1;

dojo.declare("ActiveReportIWidget", bux.reportViewer, {
	namespacePrefix: "a",
	iframe: null,
	ACTIVEREPORT_VERSION: "2", //Caspian verion = '2'
	EVENT_NAME_FILTER_ITEMS_GET:		'com.ibm.bux.filter.items.get',
	EVENT_NAME_FILTER_ITEMS_GET_DONE:	'com.ibm.bux.filter.items.get.done',
	EVENT_NAME_FILTER_VALUES_GET:		'com.ibm.bux.filter.values.get',
	EVENT_NAME_FILTER_VALUES_GET_DONE:	'com.ibm.bux.filter.values.get.done',

	m_isActiveReportOutputPreCaspianVersion: false,
	m_sActiveReportOutputVersion: null,
	m_oPublicVariableNames: null,
	m_oCanvasContext: null,
	m_oCanvasContextCollection: null,
	m_oSelectionFilterBasePayload: null,

	m_bApplicationLoaded: false,
	m_aWaitUntilLoadedQueue: null,

	m_sDivHeight: null,
	m_sDivWidth: null,
	
	m_oWidgetContextManager: null,

	constructor: function() {
		this.viewerIdentifier = (globalActiveViewerIdentifier++).toString();
		this.m_aWaitUntilLoadedQueue = [];
		this.m_oPublicVariableNames = null;
		this.m_oSelectionFilterBasePayload = null;
		this.m_oCanvasContextCollection = {};
		this.m_oWidgetContextManager = new WidgetContextManager(this);
	},

	getViewerId: function() {
		return this.namespacePrefix + this.viewerIdentifier;
	},

	getIFrameId: function() {
		return "CVIFrame"  + this.getViewerId();
	},

	getContentId: function() {
		return "RVContent" + this.getViewerId();
	},

	getLoadingId: function() {
		return "loading" + this.getViewerId();
	},

	getDisplayName: function() {
		return this.getAttributeValue("widgetTitle");
	},

	getAttributeValue: function(name) {
		return this.iContext.getiWidgetAttributes().getItemValue(name);
	},

	getApplication: function () {
		if (this.iframe && this.iframe.contentWindow && this.iframe.contentWindow.Application) {
			return this.iframe.contentWindow.Application;
		}
		return null;
	},

	getIFrameDocument: function() {
		if (this.iframe.contentDocument) {
			//Firefox
			return this.iframe.contentDocument;
		}
		if (this.iframe.contentWindow) {
			//IE 8
			return this.iframe.contentWindow.document;
		}
		return null;	//fail
	},

	onLoad: function() {
		this.inherited(arguments);
		var reportStoreID = this.getAttributeValue("originalReport");
		var properties = this.getAttributeValue( "viewerProperties");
		this.properties = this.createProperties(properties);
		
		var oContent = {
			"b_action": "cognosViewer",
			"ui.action": "buxDropActiveReportOnCanvas",
			"ui.object": reportStoreID,
			"cv.responseFormat": "activeReport",
			"cv.id": this.getViewerId(),
			"bux": "true",
			"cv.buxCurrentUserRole": this.getUserRole()
		};

		if (this.getAttributeValue("savedOutputSearchPath") != null) {
			this.setSavedOutputSearchPath(this.getAttributeValue("savedOutputSearchPath"));
			oContent["ui.savedOutputSearchPath"] = this.getAttributeValue("savedOutputSearchPath");
		}

		if(this.isOpeningSavedDashboard()) {
			oContent["widget.openingSavedWidget"] = "true";

			var selectionFilterEnabled = this.getAttributeValue("selectionFilterEnabled");

			// For older workspaces default the value to true
			if (typeof selectionFilterEnabled == "undefined" || selectionFilterEnabled === null) {
				this.m_bSelectionFilterSwitch = true;
			}
			else {
				this.m_bSelectionFilterSwitch = selectionFilterEnabled == "true" ? true : false;
			}
		}

		this.iContext.iEvents.svc.addWire(this.iContext.widgetId, "com.ibm.bux.data.filterCache.init", "widgetBuxCanvasTabs", "com.ibm.bux.data.filterCache.init");
		
		this.postReport(oContent);
	},

	/*
	 * Send server request to fetch active report saved ouput
	 */
	postReport: function(content) {
		this.m_viewerLoadInitiated = true;

		if(content) {
			var args = {
				url: this.buildPostUrl(),
				sync: false,
				preventCache: true,
				content: content,
				error: dojo.hitch(this, function(response){
						this.fireEvent("com.ibm.bux.widget.render.done", null, {noAutoResize:true});
						this.fireEvent("com.ibm.bux.widget.notification", null, {type: "error", message: response.message, description: response.description});
					})
			};

			if (typeof xhrMultiPart !== "undefined" && xhrMultiPart.active) {
				args.load = dojo.hitch(this, function(response){
					this.loadContent(response.responseText);
					this.postLoadContent();
				});

				xhrMultiPart.Post(args);
			} else {
				args.load = dojo.hitch(this, function(response, ioArgs){
					var responseContentType = ioArgs.xhr.getResponseHeader("Content-Type");
					if (responseContentType!=null && responseContentType.indexOf("text/html") != -1 && response!=null&& response.match(/<ERROR_CODE>CAM_PASSPORT_ERROR<\/ERROR_CODE>/)!=null) {
						this.handlePassportErrorFromDispatcher();
					} else {
						this.loadContent(response);
						this.postLoadContent();
					}
				});
				dojo.xhrPost(args);
			}
		}
	},

	/*
	 * A part of the postReport response handler:
	 *
	 * Sets callback functions on ActiveReport application
	 * Disables extra generic event wirings for upgrade scenario
	 */
	postLoadContent: function(){

		var bIsOpeningSavedDashboard = this.isOpeningSavedDashboard();
		this.iframe = dojo.byId(this.getIFrameId());
		if(this.iframe) {
			this.iframe.Application_OnLoad = dojo.hitch(this, "onActiveReportLoaded", bIsOpeningSavedDashboard);
			this.iframe.Application_OnBeforeLoad = dojo.hitch(this, "onActiveReportBeforeLoad");
		}

		if (bIsOpeningSavedDashboard && this._isWidgetPreCaspianVersion() ) {
			//Upgrade scenario - ensure not listening to new generic events (drill, slider, prompt)
			this._disableListenToNewlySupportedEvents();
		}
		this.hideLoading();
		
		if(dojo.isIos){
			//apply touch style for mobile
			//parent div of iframe
			var chromeDiv = this._getChromeObject()._pane; 
			chromeDiv.setAttribute( "style",  "overflow:auto; -webkit-overflow-scrolling:touch;" );
			//iframe
			this.iframe.setAttribute( "style",  "-webkit-transform: translateZ(0px);" );
		}
	},

	/*
	 * ACTIVE REPORT INTEGRATION POINT
	 * onBeforeLoad handler that Active Report application calls before loading starts.
	 */
	onActiveReportBeforeLoad: function()
	{
		this.hideLoading();
	},

	/*
	 * ACTIVE REPORT INTEGRATION POINT
	 * onLoaded handler that Active Report application calls once loading is completed.
	 */
	onActiveReportLoaded: function(bOpeningSavedWidget)
	{
		var v_oFrameApp = this.getApplication();
		v_oFrameApp.SetChangeStateHandler(dojo.hitch(this, "onActiveReportStateChange"));

		this.m_isActiveReportOutputPreCaspianVersion = this._isActiveReportOutputPreCaspianVersion();
		this._getFilterableItems(); //populate Filterable items names

		if (bOpeningSavedWidget) {
			this._restoreSavedState(v_oFrameApp);
		} else {
			if (this.m_oCanvasContext) { //for onDrop behaviour
				if (this._hasFunctionProperty(v_oFrameApp, 'SetWidgetContext')) {
					v_oFrameApp.SetWidgetContext(this.m_oCanvasContext);
				}
			}
		}

		this.setupKeys();

		this._adjustWidgetDimension(v_oFrameApp, bOpeningSavedWidget);

		this._applicationLoaded();

		this.fireEvent("com.ibm.bux.widget.render.done", null, {hasIframe: true});
		this.hideLoading();

	},

	/*
	 * Will invoke the callback:
	 * (a) immediately if the underlying active report object is already loaded
	 * (b) in the future, once the active report object has been loaded
	 */
	_invokeWhenLoaded: function(fCallback) {
		if(!this.m_bApplicationLoaded && this.m_aWaitUntilLoadedQueue) {
			this.m_aWaitUntilLoadedQueue.push(fCallback);
		} else {
			fCallback.call();
		}
	},

	/*
	 * Only call once, when the active report object is first loaded.
	 * This will service the queue of functions and then clear it.
	 */
	_applicationLoaded: function() {
		while(!this.m_bApplicationLoaded && this.m_aWaitUntilLoadedQueue.length) {
			var fCallback = this.m_aWaitUntilLoadedQueue.shift();
			if(fCallback) {
				fCallback.call();
			}
		}
		this.m_bApplicationLoaded = true;
	},

	/*
	 * A part of ActiveReport post-load process
	 * Adjust IFrame dimension once Active report is rendered
	 */
	_adjustWidgetDimension: function (theApp, bOpeningSavedWidget) {

		// set the iframe dimensions
		var iframe = dojo.byId( this.getIFrameId());
		var appDimensions = null;
		if ( theApp && iframe ) {

			if (!bOpeningSavedWidget) {
				//make iframe size small
				iframe.style.width = "20px";
				iframe.style.height = "20px";
			}
			iframe.setAttribute("loadState","complete");

			//set iframe size to Active report size
			appDimensions = theApp.GetApplicationDimensions();
			iframe.style.width = appDimensions.width + "px";
			iframe.style.height = appDimensions.height + "px";

			//set chrome pane size to Active report size
			var v_oPane = this._getChromeObject()._pane;
			v_oPane.defaultH = appDimensions.height;
			v_oPane.defaultW = appDimensions.width;
		}

		if (appDimensions) {
			this.setReportContentDimensions(appDimensions.width, appDimensions.height);
		}
	},

	/**
	 * A part of ActiveReport post-load process
	 * Get saved state from property and apply to Active Report
	 */
	_restoreSavedState: function (theApp) {

		//RESTORE SAVED STATE.
		var oSavedState = this.properties.getActiveReportState();
		if(oSavedState) {
			if (this._hasFunctionProperty(theApp, 'SetFullState')) {//if the api exists
				theApp.SetFullState(oSavedState);
			}
		}
	},

	setReportContentDimensions: function(width, height) {
		var nContent = dojo.byId(this.getContentId());
		if (nContent) {
			nContent.style.width = width + 'px';
			nContent.style.height = height + 'px'; 
		}
	},

	showLoading: function() {
		dojo.byId(this.getLoadingId()).style.display = "";
		//There is a bug in FF: When an iFrame is not displayed
		//(display: none), getComputedStyle() returns null. IROT
		//needs this API, so use visibility: hidden instead. See:
		//https://bugzilla.mozilla.org/show_bug.cgi?id=548397
		var nContent = dojo.byId(this.getContentId());
		nContent.style.position = "absolute";
		nContent.style.visibility = "hidden";
		//Set to minimum size to prevent scrollbars if the
		//content is larger than the container.
		this.m_sDivWidth = nContent.style.width;
		this.m_sDivHeight = nContent.style.height;
		nContent.style.width = "0px";
		nContent.style.height = "0px";
	},

	hideLoading: function() {
		var nContent = dojo.byId(this.getContentId());
		if (nContent) {
			nContent.style.position = "static";
			nContent.style.visibility = "visible"; //default
			if (this.m_sDivHeight && this.m_sDivWidth) {
				nContent.style.width = this.m_sDivWidth;
				nContent.style.height = this.m_sDivHeight;
			}
		}
		dojo.byId(this.getLoadingId()).style.display = "none";
	},

	/*
	 * This function is called from RequestHandler.onFault method
	 *
	 * hideLoading method should be called to remove 'loading...'
	 */
	postOnFault: function() {
		this.hideLoading();
	},

	/*
	 * ACTIVE REPORT INTEGRATION POINT
	 * onStateChange handler that Active Report application calls when public context is changed.
	 */
	onActiveReportStateChange: function()
	{
		if (!this.m_bSelectionFilterSwitch) {
			return;
		}
		
		var oFrameApp = this.getApplication();
		if (!oFrameApp) {
			return;
		}

		var oStatePayload = null;

		if (this.m_isActiveReportOutputPreCaspianVersion) {
			if (this._hasFunctionProperty(oFrameApp, 'GetState')) { //Old API
				oStatePayload = oFrameApp.GetState();
			}
		} else {
			if (this._hasFunctionProperty(oFrameApp, 'GetWidgetContext')) {
				oStatePayload = oFrameApp.GetWidgetContext();
				this._convertRangeContext(oStatePayload, /*bFromActiveReportForGeneric*/ true);
			}
		}

		if (oStatePayload) {
			if (!oStatePayload.clientId) {
				oStatePayload.clientId = this.getWidgetId();
			}
			//append the secion below if discrete value exists  
			if (this.m_oSelectionFilterBasePayload) {
				oStatePayload["com.ibm.widget.context.bux.selection"] = this.m_oSelectionFilterBasePayload;
			}
			
			this.fireEvent( "com.ibm.widget.contextChanged", null, oStatePayload);
			//Save the fact that this widget sent context changed event with something
			this.setSelectionFilterSent(true);
		}
	},
	
	broadcastSelectionFilter: function() {
		this.onActiveReportStateChange();
	},

	/*
	 * When discrete public variable exist, m_oSelectionFilterBasePayload is an object with variable names.
	 * return true if the field is not null
	 */
	somethingSelected: function()
	{
		return (this.m_oSelectionFilterBasePayload)? true: false;
	},
	

	/*
	 * Save widget
	 */
	onWidgetSave: function(evt) {
		this.cleanSavedAttributes();

		//SAVE STATE
		var oFrameApp = this.getApplication();
		if (!oFrameApp) {
			this.fireEvent( "com.ibm.bux.widget.save.done", null, {'status':false});
			return;
		}

		if (this._hasFunctionProperty(oFrameApp, 'GetFullState')) {
			var oState = oFrameApp.GetFullState();
			if (oState) {
				this.properties.setActiveReportState(oState);
			}
		}

		this.updateSavedAttributes( "savedOutput" );
		this.fireEvent( "com.ibm.bux.widget.save.done", null, {'status':true});
	},

	/*
	 * ACTIVE REPORT INTEGRATION POINT
	 * handler of com.ibm.widget.contextChanged event
	 */
	onOtherWidgetsContextChanged: function(evt) {
		var payload = evt.payload;
		var oFrameApp = this.getApplication();
		if (!oFrameApp) {
			return;
		}
		if (this.m_isActiveReportOutputPreCaspianVersion) {
			//Safe Guard for pre-Caspian active report output:
			//We check here if active report is pre-Caspian, then pass Array only if it is custom Array.
			if (this._isPayloadSupportedByPreCaspianActiveReport(payload)) {
				if (this._hasFunctionProperty(oFrameApp, 'SetState')) {
					oFrameApp.SetState(payload);
				}
			}
		} else {
			this.processSetWidgetContext(oFrameApp, payload);
		}
	},
	
	processSetWidgetContext: function(oApplication, genericPayload) {
		if (this.hasPublicVariables() && this._hasFunctionProperty(oApplication, 'SetWidgetContext')) {
			this.m_oWidgetContextManager.updateContextCollection(genericPayload);
			this.m_oCanvasContext = this.m_oWidgetContextManager.genMergedWidgetContextObject(this.m_oCanvasContextCollection);
			
			oApplication.SetWidgetContext(this.m_oCanvasContext);
		}
	},

	onUnload: function(evt) {
		var iframe = dojo.byId(this.getIFrameId());
		if (iframe) {
			dojo.destroy(iframe);
		}
		this.inherited(arguments);
	},

	onWidgetRefresh: function ( evt ){

		var refreshDonePayload = {};
		if (this.iframe) {
			var viewerObject = this.getViewerObject();
			if( evt  && viewerObject){
				viewerObject.executeAction( "RefreshActiveReport" );
			}
		}
		this.fireEvent( "com.ibm.bux.widget.refresh.done", null, refreshDonePayload);
	},

	onWidgetResize: function(evt) {
		var iframe = dojo.byId(this.getIFrameId());
		if ( iframe ) {
			this.setReportContentDimensions(evt.payload.resize.w, evt.payload.resize.h);

			iframe.width = evt.payload.resize.w;
			iframe.height = evt.payload.resize.h;
			if ( iframe.style ) {
				iframe.style.width = evt.payload.resize.w + "px";
				iframe.style.height = evt.payload.resize.h + "px";
			}
		}
	},

	buildPostUrl: function () {
		return this.getAttributeValue("gateway");
	},

	isSavedOutput: function(){
		return false;
	},

	isSaveNecessary: function() {
		var sHasAlreadySaved = this.getAttributeValue("mostRecentSavedOutput");
		var sSavedOutputSearchPath = this.getAttributeValue("savedOutputSearchPath");
		return (sHasAlreadySaved === "true" || sSavedOutputSearchPath) ? false : true;
	},

	handleFault: function() {
		this.inherited(arguments);
		this.hideLoading();
	},

	setupKeys: function() {
		//Setup F10 and F12
		var doc = this.getIFrameDocument();
		if(doc) {
			dojo.connect(doc.body, "onkeypress", dojo.hitch(this, function(evt) {
				switch(evt.charOrCode) {
				case dojo.keys.F10:
					this.focusOnToolbar(evt);
					break;
				case dojo.keys.F12:
					if (evt.shiftKey) {
						this.focusOnPane(evt);
					}
					break;
				}
			}));
		}

		//Divs to redirect focus so it cycles forward and
		//backward through the active report
		this._makeInvisibleFocusDiv("before", "first");	//On F12, focus will be set to this node
		this._makeInvisibleFocusDiv("before", "last");	//On Shift+Tab, focus will be set to this node
		this._makeInvisibleFocusDiv("after", "first");	//On Tab, focus will be set to this node
	},

	_makeInvisibleFocusDiv: function(placePosition, focusPosition) {
		//Make an invisible, focusable div
		var div = dojo.create(
			"div",
			{
				tabIndex: 0,
				visibility: "hidden",
				position: "absolute"
			},
			this.iframe,
			placePosition
		);
		//When focus received, move it elsewhere.
		dojo.connect(div, "onfocus", dojo.hitch(this, function(){
			this.cycleFocus(focusPosition);
		}));
	},

	cycleFocus: function(position) {
		//Refocus to first or last element in iframe
		var tabElems = dijit._getTabNavigable(this.getIFrameDocument().body);

		var toFocus;
		if (position === "first") {
			toFocus = tabElems.lowest || tabElems.first;
		} else {
			toFocus = tabElems.highest || tabElems.last;
		}

		if (toFocus) {
			dijit.focus(toFocus);
		}
	},

	_getChromeObject: function() {
		var chromeObjectId = bux.IWidgetUtils.widgetIdToChromeId(this.iContext.widgetId);
		return bux.IWidgetUtils.getChromeById(chromeObjectId);
	},

	focusOnToolbar: function(evt) {
		var chromeObject = this._getChromeObject();
		if (chromeObject) {
			chromeObject._pane.focusToolbar(this.iframe);
		}
		if (dojo.isIE || dojo.isTrident) {
			evt.keyCode = 0;
		}
		dojo.stopEvent(evt);
	},

	focusOnPane: function(evt) {
		var chromeObject = this._getChromeObject();
		if (chromeObject) {
			chromeObject._pane._focusBorder();
		}
		dojo.stopEvent(evt);
	},

	/*
	 * process incoming generic event
	 * take values part from widget context and pass to the application as state
	 */
	onGenericEvent: function(evt) {
		var oFrameApp = this.getApplication();
		if (!oFrameApp) {
			return;
		}

		if ( !this.m_isActiveReportOutputPreCaspianVersion ) {
			this.processSetWidgetContext(oFrameApp, evt.payload);
		}
	},

	/*
	 * @override
	 */
	createProperties: function(properties) {
		return new ActiveReportIWidgetProperties( this, properties );
	},

	temporaryStateCleanup: function(oState) {
		var oCleanState = {};
		if (oState && oState.variables) {
			var oVariables = oState.variables;
			for(var sName in oVariables) {
				var oValues = oVariables[sName];
				var aValues = [];
				for(var sValue in oValues) {
					if (typeof(oValues[sValue]) == 'string') {
						aValues.push(oValues[sValue]);
					}
				}

				if (aValues.length>0) {
					oCleanState[sName] = aValues;
				}
			}

			return {'variables': oCleanState};
		}
		return oState;
	},

	/*
	 * returns true if saved version information is older than Caspian
	 */
	_isWidgetPreCaspianVersion: function() {
		var sSavedVersion = this.getAttributeValue("version");

		return this._isOlderVersion(this.BUX_REPORT_VERSION, sSavedVersion);
	},

	_isOlderVersion: function(sBaseVersion, sTest) {
		if (!sBaseVersion || !sTest) {
			return true;
		}

		return (sBaseVersion > sTest);
	},

	/*
	 * In Casipan, generic form of prompt/drill/selectValueControl events are implemented
	 * We want these events to be disabled when pre-Caspian workspace is open so that
	 * it does not react to them. This is to provide same behaivour.
	 *
	 * Also, turn off getItems/getValues filter events so that
	 * slider configuration dialogs do not show items from it.
	 */
	_disableListenToNewlySupportedEvents: function() {
		var payload = {};
		payload[ '*' ] = { blockedEvents:[
			this.m_oWidgetContextManager.EVENT_NAME_PROMPT,
			this.m_oWidgetContextManager.EVENT_NAME_DRILL,
			this.m_oWidgetContextManager.EVENT_NAME_SELECTVALUECONTROL,
			this.EVENT_NAME_FILTER_ITEMS_GET,
			this.EVENT_NAME_FILTER_VALUES_GET
			]
		};
		this.fireEvent("com.ibm.bux.widget.updateEventFilter", null, payload);
	},

	/*
	 * returns true if the active report version is smaller than current ACTIVEREPORT_VERSION
	 */
	_isActiveReportOutputPreCaspianVersion: function() {
		var oFrameApp = this.getApplication();
		if (!oFrameApp) {
			return null;
		}

		var sVersion = '0';

		if ( this._hasFunctionProperty(oFrameApp, 'GetOutputVersion')) {
			sVersion = oFrameApp.GetOutputVersion();
			this.m_sActiveReportOutputVersion = sVersion;
		}

		return this._isOlderVersion(/* base */ this.ACTIVEREPORT_VERSION, /* toCompare */ sVersion);
	},

	/*
	 * returns m_sActiveReportOutputVersion
	 */
	getActiveReportOutputVersion: function() {
		return this.m_sActiveReportOutputVersion;
	},

	/*
	 * returns m_sActiveReportOutputVersion
	 */
	getPublicVariableNames: function() {
		return this.m_oPublicVariableNames || {};
	},

	/*
	 * pre-Caspian active report in SetState and GetState functions use custom Array object whose custome functions.
	 * When regular Array object is passed to it, it errors out and becomes static.
	 * This function determins if payload can be supported by pre-Caspian active report
	 *
	 * return true if Array object has any custom function
	 */
	_isPayloadSupportedByPreCaspianActiveReport: function(oPayload) {
		for (var sPropertyName in oPayload) {
			var oNameValuePairObject = oPayload[sPropertyName];
			for (var sName in oNameValuePairObject) {
				var oValue = oNameValuePairObject[sName];
				if (typeof(oValue) == 'object') {
					for (var sArrayPropertyName in oValue) {
						if (typeof(oValue[sArrayPropertyName]) == 'function') {
							return true;
						}
					}
				}
			}
		}
		return false;
	},

	/*
	 * Returns true if passed object has a function with name of passed functionName
	 */
	_hasFunctionProperty:function(obj, functionName) {

		if (obj && functionName) {
			if (obj[functionName] && typeof obj[functionName] == 'function') {
				return true;
			}
		}

		return false;
	},

	/*
	 * Generic event uses Arrays for range values. One range can have many min/max values in generic event.
	 * However, Active report range variables have one min/max value as an object.
	 *
	 * This function masages range value type to make them compatible.
	 *
	 * if bFromActiveReportForGeneric is true, puts range value into an array
	 * else, takes first item from array and set as value
	 */
	_convertRangeContext:function(oActiveReportContext, bFromActiveReportForGeneric) {

		var oWidgetContext = oActiveReportContext[this.m_oWidgetContextManager.PP_WIDGET_CONTEXT];

		if (oWidgetContext) {
			var oRanges = oWidgetContext[this.m_oWidgetContextManager.PP_RANGES];
			if (oRanges) {
				var newRanges = {};
				for (var sName in oRanges) {
					var value = oRanges[sName];

					if (bFromActiveReportForGeneric) {
						//PUT INTO an Array
						newRanges[sName] = [value];
					} else {
						//Pass first item as Active report takes only one range input.
						if (value && value.length>0) {
							newRanges[sName] = value[0];
						}
					}
				}

				oWidgetContext[this.m_oWidgetContextManager.PP_RANGES] = newRanges;
			}
		}
	},

	/*
	 * onGetFilterableItems
	 */
	onGetFilterableItems: function(evt) {
		var oFrameApp = this.getApplication();
		if (!oFrameApp) {
			this.fireEvent('com.ibm.bux.filter.items.get.done', null, {});
			return;
		}

		var aItems = this._getFilterableItems();
		var payload = {
			'invisible' : [],
			'visible'	: aItems
		};

		this.fireEvent('com.ibm.bux.filter.items.get.done', null, payload);
	},

	_getFilterableItems: function() {
		var aItems = [];
		var oFrameApp = this.getApplication();
		if (!oFrameApp) {
			return aItems;//Shouldn't be here
		}

		this.m_oPublicVariableNames = this.m_oPublicVariableNames || {};
		
		var hasDiscriteValues = false;
		if (this._hasFunctionProperty(oFrameApp, 'GetDiscreteVariables')) {//if the api exists
			var aDiscreteVariables = [].concat(oFrameApp.GetDiscreteVariables()); //convert returned object to standard array
			
			for (var idx in aDiscreteVariables) {
				aItems.push( this._genFilterableItemObject( aDiscreteVariables[idx], /*isRange*/false) );

				this.m_oPublicVariableNames[aDiscreteVariables[idx]] = 'D';//DISCRETE
				hasDiscriteValues = true;
			}
		}

		if (this._hasFunctionProperty(oFrameApp, 'GetRanges')) {//if the api exists
			var aRanges = [].concat(oFrameApp.GetRanges()); //convert returned object to standard array
			for (var idx in aRanges) {
				aItems.push( this._genFilterableItemObject( aRanges[idx], /*isRange*/true) );
				this.m_oPublicVariableNames[aRanges[idx]] = 'R'; //range
			}
		}
		
		if (hasDiscriteValues) {
			this.m_oSelectionFilterBasePayload = {
					"selection":{
						"id":this.getWidgetId(),
						"valueType":"string"
					}
			};
		}

		return aItems;
	},
	
	/*
	 * returns true if m_oPublicVariableNames field is not an empty object
	 */
	hasPublicVariables: function() {
		var found = false;
		for(var name in this.m_oPublicVariableNames) {
			found = true;
			break;
		}
		return found;
	},

	/*
	 * returns an object whoes label, name and optional range properties.
	 */
	_genFilterableItemObject: function (sItemName, /*isRange*/ isRange) {
		var object = {
			'label' : sItemName,
			'name'	: sItemName
		};

		if (isRange) {
			object['range'] = true;
		}
		return object;
	},

	onGetFilterValues: function(evt) {
		var oItem = evt.payload.payload;
		var sName = oItem.name;
		var oPayload = {name: sName};

		if (!evt.payload || !evt.payload.payload) {
			this.fireEvent(this.EVENT_NAME_FILTER_VALUES_GET_DONE, null, oPayload);
			return;
		}

		//The remainder of this logic requires the active report object be loaded.
		this._invokeWhenLoaded(dojo.hitch(this, function() {

			//Ensure filterable items have been loaded
			if(!this.m_oPublicVariableNames) {
				this._getFilterableItems();
			}

			if (!this.m_oPublicVariableNames[sName]) {
				this.fireEvent(this.EVENT_NAME_FILTER_VALUES_GET_DONE, null, oPayload);
				return;
			}

			var oFrameApp = this.getApplication();
			var aNewValues = [];

			try {
				if (this.m_oPublicVariableNames[sName] === 'R') {
					//i.e. a range
					if (this._hasFunctionProperty(oFrameApp, 'GetRangeValues')) {//if the api exists
						var oRange = oFrameApp.GetRangeValues(sName);

						var newObj = {'max': null, 'min': null};
						if (typeof oRange.min != 'undefined' && typeof oRange.max != 'undefined') {
							newObj.min = parseFloat(oRange.min);
							newObj.max = parseFloat(oRange.max);
						}
						oPayload.range = newObj;
					}
				} else if (this.m_oPublicVariableNames[sName] === 'D') {
					//i.e. discrete values
					if (this._hasFunctionProperty(oFrameApp, 'GetValuesForDiscreteVariable')) {//if the api exists
						var aValues = [].concat(oFrameApp.GetValuesForDiscreteVariable(sName)); //convert returned object to standard array

						if (aValues && aValues.length>0) {
							for (var idx in aValues) {
								aNewValues.push(
									{'mun': 'unknown', //TODO - remove mun
									'caption': aValues[idx]}
								);
							}
						}
						oPayload.values = aNewValues;
					}
				}
			} catch (e) {
				throw e; //Throw for AR until root cause is fixed in AR side
			} finally {
				oPayload.modelInfo = { 'path': 'unknow_' + this.getWidgetId() };
				this.fireEvent(this.EVENT_NAME_FILTER_VALUES_GET_DONE, null, oPayload);
			}
		}));
	},

	onWidgetShow: function(evt) {
		/**
		 * Issue with Active Reports displaying a visualization in IE8. We need to force the Active Report to redraw the first time it's made visible
		 */
		if(this.getViewerObject().getAdvancedServerProperty("VIEWER_JS_RELOAD_AR_IE8")  === "true"  && evt.payload.isVisible && !this.m_bActiveReportRedrawn && dojo.isIE == 8) {
			this.m_bActiveReportRedrawn = true;
			var sBackupSrc = this.iframe.src;
			this.iframe.src=""; //Testing shows this is necessary;
			this.iframe.src = sBackupSrc;	
		}
	},
	
	/**
	 * @override
	 */
	reselectSelectionFilterObjects: function() {
		var value = this.getAttributeValue( "selectionFilterSent" );
		this.setSelectionFilterSent(value === "true");
		this.removeAttributeValue("selectionFilterSent");
	},
	
	/*
	 * Override
	 */
	updateSavedAttributes: function(attribType) {
		this.inherited(arguments);
		
		if (this.selectionFilterSent()) {
			this.setAttributeValue( "selectionFilterSent", "true" );
		}
	},
	/*
	 * Override
	 */
	cleanSavedAttributes: function() {
		this.inherited(arguments);
		this.removeAttributeValue("selectionFilterSent");
	},
	
	/*
	 * This event handler populates canvas the filter data. 
	 * 
	 * Open workspace scenario, viewer widgets and slider widgets send their filter context to Canvas.
	 * Active report must listen to the event and populate contextCollection with it.
	 * 
	 * This is neccessary to support deleting/resetting filter request from other widget.
	 * Before delete filter, it searches source widgetId in contextCollection to determine whether the request is relevant or not.
	 */
	 
	updateFilterCache: function(iEvent){
		this.m_oWidgetContextManager.updateContextCollection(iEvent.payload);
	},
	
	/*
	 * Handler of 'com.ibm.widget.context.get' event
	 */
	onGetWidgetContext: function(iEvent) {
		var payload = {};

		if (this.iframe && this.isSelectionFilterEnabled()) {
			var oFrameApp = this.getApplication();
			if (this._hasFunctionProperty(oFrameApp, 'GetWidgetContext')) {
				payload = oFrameApp.GetWidgetContext();
				payload.clientId = this.getWidgetId();
			}
		}

		this.fireEvent( 'com.ibm.widget.context.get.done', null , payload);
	},
	
	/*
	 * Handler of com.ibm.bux.canvas.context.get.done event
	 *
	 * Saves canvas context into its property(m_oCanvasContext).
	 * Then once ActiveReport content is loaded,
	 * onActiveReportLoaded function calls Active report SetWidgetContext api the context.
	 */
	onGetCanvasContextDone: function(evt) {
		var aPayload = evt.payload;
		for(var i=0; i<aPayload.length; i++ ) {
			this.m_oWidgetContextManager.updateContextCollection(aPayload[i]);
		}
		this.m_oCanvasContext = this.m_oWidgetContextManager.genMergedWidgetContextObject();
	},

	/*
	 * Temporary debug logging for integration test with IROT dev team
	 * This will be removed after integration testing is complete.
	 */
	DEBUG_LOG: function(msg, obj) {
		if (this.isDebugMode()) {
			if (console) {
				if (msg && obj) {
					console.log("%s %o", msg, obj);
				} else if (msg){
					console.log(msg);
				} else if (obj) {
					console.log(obj);
				}
			}
		}
	},

	/*
	 * This function name with typo was release in RP1.
	 * This function must stay for the case of RP1 deployment on Caspian release.
	 */
	DEUBG_LOG: function(msg, obj) {
		this.DEBUG_LOG(msg,obj);
	},

	isDebugMode: function() {
		return (dojo && dojo['config'] && dojo['config']['isDebug']);
	}

});
