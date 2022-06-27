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

dojo.provide("bux.reportViewer.Properties");

dojo.declare("bux.reportViewer.Properties", null, {
	iWidget : null,
	masterDialogSpec : null,
	masterDialogSpecProperties : null,
	flashChartSpec : null,
	isFlashChartOptionEnabled: true,
	oldProperties: null, // will contain the last set of properties. Used to compare to see what's changed
	dialogDisplayValues : null, // will contain the current set of properties

	constructor: function( iWidget, properties )
	{
		this.isInitialized = false;
		this.initializeDialogDisplayValues();
		this.oldProperties = {};

		this.iWidget = iWidget;
		if( properties === "<empty>")
		{
			return;
		}

		var json = dojo.eval("[" + properties + "]");
		if( json && json[0] )
		{
			this.initializeWithSavedPropertyValues(json[0]);
		}
	},

	initializeDialogDisplayValues: function() {
		/**
		 *	canUndo: if set to true, changing this property will cause the action to be put into the undo stack
		 *	runReport: if true, changing this property will cause the report to rerun
		 *	refreshSavedOutput: if true, changing this property will cause the saved output to get redrawn
		 */
		this.dialogDisplayValues = {	flashCharts: { value: null, canUndo: true, runReport: true },
										rowsPerPage: { value: null, canUndo: true, runReport: true },
										promptUserOnLoad: { value: false },
										retrieveAll: { value: false, refreshSavedOutput: true },
										showExpandCollapseIcon: { value: null  }
									};
	},

	clearDialogSpec: function() {
		this.masterDialogSpec = null;
		this.masterDialogSpecProperties = null;
	},

	/**
	 * Initialize the property values with the values that were saved with the dashboard
	 * @param {Object} properties
	 */
	initializeWithSavedPropertyValues: function(properties)
	{
		// The structure that we're saving the properties in is a little different then
		// what's needed by the dialog
		for (var prop in properties) {
			if (typeof prop != "undefined" && prop != null) {
				if (this.dialogDisplayValues[prop]) {
					this.dialogDisplayValues[prop].value = properties[prop];
				} else {
					this.dialogDisplayValues[prop] = { value: properties[prop], canUndo: false };
				}
			}
		}
	},

	/**
	 * Helper function to set a property value without knowing the structure needed by the parent class
	 * @param {String} property
	 * @param {String} value
	 */
	setProperty: function(property, value)
	{
		this.dialogDisplayValues[property].value = value;
	},

	/**
	 * Helper function to get a property without having to know the structure of the properties are saved in
	 * @param {String} property
	 * @return null if the property isn't found
	 */
	getProperty: function(property)
	{
		if (this.dialogDisplayValues[property])
		{
			return this.dialogDisplayValues[property].value;
		}

		return null;
	},

	/**
	 * Helper function to get a an old property without having to know the structure the properties are saved in
	 * @param {String} property
	 * @return null if the property isn't found
	 */
	getOldProperty: function(property)
	{
		if (this.oldProperties && this.oldProperties[property])
		{
			return this.oldProperties[property].value;
		}

		return null;
	},

	/**
	 * Returns the last set of properties
	 */
	getOldProperties: function()
	{
		/**
		 * Need to make a new copy of the oldProperties. If we simply returned this.oldProperties,
		 * it would return it as a reference. So any time this.oldProperties got updated it would
		 * also change the values in the undoRedo queue (not good).
		 */
		var oldProps = {};

		for (var prop in this.oldProperties) {
			if (this.dialogDisplayValues[prop].canUndo === true) {
				oldProps[prop] = {};
				oldProps[prop].value = this.oldProperties[prop].value;
			}
		}

		return oldProps;
	},

	/**
	 * Called right before the properties dialog is opened.
	 */
	onGet: function()
	{
		// Keep track of the old properties. Will be used if the user hits Ok to know if something has changed
		this.copyPropertyValues(this.dialogDisplayValues, this.oldProperties);

		if (!this.masterDialogSpec) {
			this.initializeDialogSpec();
		} else {
			this.updateDialogSpec();
		}

		var _payload = {
			tabTitle: this._getReportWidgetTabTitle(),
			properties: this.dialogDisplayValues,
			propertiesDialogSpec: this.masterDialogSpec
		};

		return _payload;
	},

	_getReportWidgetTabTitle: function() {
		var reportWidgetTabTitle;
		if( this.iWidget && this.iWidget.getViewerObject() )
		{
			reportWidgetTabTitle = RV_RES.IDS_REPORT_WIDGET_PROPERTY_TAB_TITLE;
		}
		return reportWidgetTabTitle;
	},

	/**
	 * Called the the user hits the Ok button
	 * @param {Object} payload
	 */
	onSet: function( payload )
	{
		if( this.isSavedOutput() )
		{
			this.updateSavedOutput();
		}
		else
		{
			if( !this.runReportWithNewOptions() ){
				this._updateReport();
			}
		}
	},
	
	/*
	 * For some properties,like Show expand/collapse icon, there is no need to rerun the report in order for the property to be
	 * applied.  This function updates report without re-running it and should only be called in the case that the report had not ran.
	 * If the report had ran, there is no need to call it.
	 */
	_updateReport : function(){
		//update report without having to run it again
		var newShowExpandCollapseIconFlag = this.getProperty('showExpandCollapseIcon');
		if( this.getOldProperty('showExpandCollapseIcon') != newShowExpandCollapseIconFlag ){
			var oCV = this.iWidget.getViewerObject();
			if( newShowExpandCollapseIconFlag === true  ){	
				oCV.insertExpandIconsForAllCrosstabs();
			} else {
				oCV.removeExpandIconsForAllCrosstabs();
			}
		}
			
	},

	/**
	 * Copies the properties from an object to another
	 * @param {Object} from
	 * @param {Object} to
	 */
	copyPropertyValues: function(from, to) {
		for (var prop in from) {
			if (!to[prop]) {
				to[prop] = {};
			}

			to[prop].value = from[prop].value;
		}
	},

	/**
	 * Update the properties with the values from the undo stack. Only the properties that are
	 * undoable will be updated
	 * @param {Object} properties
	 */
	doUndo: function( properties )
	{
		this.copyPropertyValues(properties, this.dialogDisplayValues);
	},

	/**
	 * Returns only the properties that can be undone
	 */
	getUndoInfo : function()
	{
		// we need to make sure initialized was called before adding anything to the undo stack
		if (!this.isInitialized) {
			var oCV = this.iWidget.getViewerObject();
			this.initialize(oCV.envParams);
		}

		var undoInfo = {};

		for (var prop in this.dialogDisplayValues) {
			if (this.dialogDisplayValues[prop].canUndo === true) {
				undoInfo[prop] = { value: this.getProperty(prop) };
			}
		}

		return undoInfo;
	},

	/**
	 * Checked to see if any of the properties that would cause the
	 * report to get run have changed
	 * @param {String} propertyToCheck: liveReport or savedOutput
	 */
	shouldUpdateReport: function(propertyToCheck)
	{
		for (var prop in this.dialogDisplayValues) {
			if (this.dialogDisplayValues[prop][propertyToCheck] == true && this.getOldProperty(prop) != this.getProperty(prop)) {
				return true;
			}
		}

		return false;
	},

	runReportWithNewOptions: function()
	{
		// only rerun the report if needed
		if (this.shouldUpdateReport('runReport'))
		{
			var oCV = this.iWidget.getViewerObject();
			var runReport = oCV.getAction("RunReport");
			runReport.setReuseQuery(true);
			runReport.execute();

			this.iWidget.getUndoRedoQueue().initUndoObj({"tooltip" : this.getUndoHint(), "saveSpec" : this.saveSpecForUndo()});
			return true;
		}
		return false;
	},

	updateSavedOutput: function()
	{
		if (this.shouldUpdateReport('refreshSavedOutput'))	{
			var savedOutput = this.iWidget.getSavedOutput();
			savedOutput.setPagedOutput( !this.getRetrieveAll() );
			savedOutput.render();
		}
	},

	/**
	 * Builds a string representing the properties to use when we do a save
	 */
	toString: function()
	{
		var str = "{";
		for (var prop in this.dialogDisplayValues) {
			var propertyData = this.getProperty(prop);
			if (propertyData != null && typeof propertyData !== "undefined") {
				if (str != "{") {
					str += ", ";
				}

				str += "\"" + prop + "\": ";
				str += (typeof(propertyData)=='string') ? propertyData.toString() : dojo.toJson(propertyData);
			}
		}
		str += "}";

		return str;
	},

	isSavedOutput: function()
	{
		return this.iWidget.getViewerObject().envParams["ui.action"] === 'view';
	},

	getUndoHint: function()
	{
		return RV_RES.IDS_JS_WIDGET_PROPERTIES;
	},

	saveSpecForUndo: function()
	{
		return false;
	},

	getRetrieveAll: function()
	{
		return this.getProperty("retrieveAll");
	},

	getPromptUserOnLoad: function()
	{
		return this.getProperty("promptUserOnLoad");
	},

	getFlashCharts: function()
	{
		return this.getProperty("flashCharts");
	},

	getRowsPerPage: function()
	{
		return this.getProperty("rowsPerPage");
	},

	getOriginalReportLocation: function(widget)
	{		
		if(widget.getAttributeValue && !widget.getAttributeValue("originalReport")){
			return RV_RES.IDS_JS_PROPERTY_ORIGINAL_REPORT_LOCATION + " " + RV_RES.IDS_JS_PROPERTY_ORIGINAL_REPORT_LOCATION_UNAVAILABLE;
		}

		var sReportLocation = widget.getViewerObject().envParams["originalReportLocation"];

		if(typeof sReportLocation == "undefined" || sReportLocation == null || sReportLocation == "Unavailable")
		{
			return RV_RES.IDS_JS_PROPERTY_ORIGINAL_REPORT_LOCATION + " " + RV_RES.IDS_JS_PROPERTY_ORIGINAL_REPORT_LOCATION_UNAVAILABLE;
		}

		return (RV_RES.IDS_JS_PROPERTY_ORIGINAL_REPORT_LOCATION + " " + sReportLocation);
	},

	getShowExpandCollapseIconFlag : function()
	{
		return this.getProperty('showExpandCollapseIcon');
	},
	
	/**
	 * This returns the Advanced Server settings in Cognos Admin for the specified property
	 */
	getAdvancedServerProperty : function( property )
	{
		if( !this.iWidget && !this.iWidget.getViewerObject() ){ return null;}
		
		return this.iWidget.getViewerObject().getAdvancedServerProperty( property );
	},
	
	/**
	 * If server setting is undefined - do not show the option, therefore, do not update the property value.
	 * If server setting is defined, set the widget property value only there is no saved value.
	 */
	initializeShowExpandCollapseIconFlag : function(){
		var sAdvancedServerPropertyValue = this.getAdvancedServerProperty( 'VIEWER_JS_EXPAND_COLLAPSE_CONTROLS_DEFAULT' );
		this.bHideExpandCollapseOption = (!sAdvancedServerPropertyValue );
		if( this.bHideExpandCollapseOption ){
			return;
		}
		
		if( this.getShowExpandCollapseIconFlag() === null ){
			this.setProperty( 'showExpandCollapseIcon', sAdvancedServerPropertyValue.toLowerCase() === 'on' );
		}
	},
	
	/**
	 *  The settings are updated based on server configuration.
	 */
	initialize: function( envParams )
	{
		if( this.isInitialized )
		{
			return;
		}
		this.isInitialized = true;
		this.initializeFlashChartSettings( envParams.flashChartOption );
		this.initializeShowExpandCollapseIconFlag();
		
		if (this.getRowsPerPage() == null)
		{
			if (envParams["run.verticalElements"] != null)
			{
				this.setProperty("rowsPerPage", envParams["run.verticalElements"]);
			}
			else
			{
				// 20 is the default used in rsvp, so if we didn't find the vertical element in CM,
				// set it to the default of 20 so the UI matches the report
				this.setProperty("rowsPerPage", 20);
			}
		}
		this.initializeDialogSpec();
	},

	createViewReportSpecLink: function()
	{
		var oCV = this.iWidget.getViewerObject();
		var reportSpec = oCV.envParams["ui.spec"];

		// only show the link to get the report spec if the user is a report author
		// and he's not viewing saved output
		if (oCV.bCanUseReportStudio && reportSpec && reportSpec.length > 0 && oCV.envParams["ui.action"] != "view") {
			return {columns:
						[
							{
								propertyName: 'viewReportSpecification',
								uiElementType: 'link',
								label: RV_RES.IDS_JS_SHOW_REPORT_SPEC,
								eventHandler: this,
								onClickAction: dojo.hitch( this, this.onClickViewReportSpecification)

							}
						]
					};
		}
		else {
			return {};
		}
	},
	
	isBlackListedOption : function( optionName ){
		return this.iWidget.getViewerObject().isBlacklisted( optionName );
	},

	createFlashChartOption: function()
	{
		var flashChartOptionSpec =
			[
				{
					columns:
						[
							{
								propertyName: 'flashCharts',
								uiElementType: "checkBox",
								label: RV_RES.IDS_JS_PROPERTY_FLASHCHARTS
							}
						]
				},

				{
					columns:
						[
							{
								uiElementType: "hSpacer"
							}
						]
				}
			];

		return flashChartOptionSpec;
	},
	
	getShowExpandCollapseIconOptionSpec : function()
	{
		var spec =  [
						 {
							columns:
							[
								{
									propertyName: 'showExpandCollapseIcon',
									uiElementType: 'checkBox',
									label: RV_RES.IDS_JS_PROPERTY_SHOW_EXPAND_COLLAPSE_ICON
								}
							]
						  },
						  {
							columns:
							[
								{
									uiElementType: 'hspacer'
								}
							]
				
						  }
					  ];
		
		return spec;
	},

	generateDialogSpec : function(role)
	{
		var masterDialogSpecArray;
		if(role=='consume')
		{
			masterDialogSpecArray =
					[
						  {
							columns:
							[
								{
									propertyName: 'rowsPerPage',
									uiElementType: 'textBox',
									type: 'number',
									label: RV_RES.IDS_JS_PROPERTY_ROWS_PER_PAGE
								}
							]
						  }
					];
			this.masterDialogSpec = { rows: masterDialogSpecArray };
		}
		else
		{
			var viewReportSpecification = this.createViewReportSpecLink();
			masterDialogSpecArray =
					[
						  {
							columns:
							[
								{
									propertyName: 'rowsPerPage',
									uiElementType: 'textBox',
									type: 'number',
									label: RV_RES.IDS_JS_PROPERTY_ROWS_PER_PAGE,
								    constraints:{min:1,max:1000},
								    required:true,
								    invalidMessage: RV_RES.IDS_JS_PROPERTY_ROWS_PER_PAGE_ERROR
								}
							]
						  },
						  {
							columns:
							[
								{
									uiElementType: 'hspacer'
								}
							]

						  },
						  {
							columns:
							[
								{
									propertyName: 'promptUserOnLoad',
									uiElementType: 'checkBox',
									label: RV_RES.IDS_JS_PROPERTY_PROMPT_ON_LOAD
								}
							 ]
						  },
						  {
							columns:
							[
								{
									propertyName: 'retrieveAll',
									uiElementType: 'checkBox',
									label: RV_RES.IDS_JS_PROPERTY_RETRIEVE_ENTIRE_REPORT
								}
							]
						  },
						  viewReportSpecification,
						  {
							columns:
							[
								{
									propertyName: 'originalReportLocation',
									uiElementType: 'text',
									label: this.getOriginalReportLocation(this.iWidget),
									allowWrapping: true
								}
							]
						  }
					];

			if( this.isFlashChartOptionEnabled && !this.hasAVSChart() && role!== 'consume' )
			{
				var flashChartOption = this.createFlashChartOption();
				masterDialogSpecArray = flashChartOption.concat( masterDialogSpecArray );
			    
			}
			
			if( !this.bHideExpandCollapseOption  && !this.isBlackListedOption( 'ExpandMember' ) )
			{
				masterDialogSpecArray = this.getShowExpandCollapseIconOptionSpec().concat( masterDialogSpecArray );
			}
			
			this.masterDialogSpec = { rows: masterDialogSpecArray };

		}

		if(this.masterDialogSpec && this.masterDialogSpec.rows) {
			this.masterDialogSpecProperties = {};
			for(var r in this.masterDialogSpec.rows) {
				var row = this.masterDialogSpec.rows[r];
				if(row.columns) {
					for(var c in row.columns) {
						var col = row.columns[c];
						if(col.propertyName) {
							this.masterDialogSpecProperties[col.propertyName] = col;
						}
					}
				}
			}
		}
	},

	updateDialogSpec: function()
	{
		if(this.masterDialogSpecProperties) {
			if(this.masterDialogSpecProperties.originalReportLocation) {
				this.masterDialogSpecProperties.originalReportLocation.label = this.getOriginalReportLocation(this.iWidget);
			}
		}
	},

	initializeDialogSpec: function()
	{
		var userRole = this.iWidget.getUserRole();
		this.generateDialogSpec(userRole);
	},


	hasAVSChart: function()
	{
		if (this.iWidget == null || typeof this.iWidget.getViewerObject() == "undefined")
		{
			return false;
		}

		var oCV = this.iWidget.getViewerObject();
		if (typeof oCV == "undefined")
		{
			return false;
		}
		return oCV.hasAVSChart();
	},

	initializeFlashChartSettings: function( value )
	{
		if( !value )
		{
			return;
		}
		var json = ( typeof value === "string") ? (eval( value) ) : value ;
		var flashChartOptions = json[0];
		this.setProperty("flashCharts", flashChartOptions.defaultValue);
		this.isFlashChartOptionEnabled= !flashChartOptions.isOptionDisabled;
	},

	onClickViewReportSpecification: function()
	{
		var sUiSpec = this.iWidget.getViewerObject().envParams["ui.spec"];
		this._viewSpecInWindow(sUiSpec);
	},

	_getWindowOptions: function( w, h )
	{
		var sOptions = 'resizable=yes,scrollbars=yes,menubar=no,directories=no,location=no,status=no,toolbar=no,titlebar=no';

		var left   = (screen.width  - w)/2;
		var top    = (screen.height - h)/2;

		sOptions += ',top=' + top;
		sOptions += ',left=' + left;
		sOptions += ',width=' + w;
		sOptions += ',height=' + h;
		return sOptions;
	},
	_viewSpecInWindow: function(sUiSpec)
	{
		var viewport = dijit.getViewport();

		var sWindowId = 'debugWindow' + this.iWidget.getViewerObject().getId();
		var sOptions = this._getWindowOptions(viewport.w, viewport.h);
		var oWindow = window.open("", sWindowId, sOptions);

		var head = '<html><body><table width="100%" cellspacing="0" cellpadding="0" border="0">' +
			  '<tbody><tr><td>' +
			  '<textarea wrap="off" style="font-family:arial; font-size: 10px; overflow: auto; width:100%; height:';
		head += viewport.h*0.95;
		head += 'px;">';

		var tail = '</textarea></td></tr></tbody></table></body></html>';
		oWindow.document.write( head + html_encode(sUiSpec) + tail );
	}
});

