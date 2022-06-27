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

dojo.require("bux.reportViewer.Properties");
dojo.provide("ActiveReportIWidgetProperties");

dojo.declare("ActiveReportIWidgetProperties", [bux.reportViewer.Properties], {
	
	
	/*
	 * @override
	 */
	initializeDialogDisplayValues: function() {
		this.dialogDisplayValues = {	activeReportState: { value: null, canUndo: false, runReport: false }
								 };
	},
	
	getActiveReportState: function()
	{
		return this.getProperty("activeReportState");
	},

	setActiveReportState: function(oState)
	{
		this.setProperty("activeReportState", oState);
	},

	/*
	 * @override
	 */
	initialize: function( envParams )
	{
		if( this.isInitialized )
		{
			return;
		}
		this.isInitialized = true;
		this.initializeDialogSpec();
	},

	/*
	 * @override
	 */
	initializeDialogSpec: function()
	{
		var masterDialogSpecArray = 
				[
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
					  },
					  {
						columns:
						[
							{
								propertyName: 'ActiveReportOutputVersion',
								uiElementType: 'text',
								label: this._getAcitveReportOutputVersion(this.iWidget),
								allowWrapping: true
							}
						]
					  }
				];
		
		if (this.iWidget.isDebugMode()) {
			//Show public variables only in DEBUG mode
			masterDialogSpecArray.push(
					  {
						columns:
						[
							{
								propertyName: 'PublicVariables',
								uiElementType: 'text',
								label: this._getPublicVariableNames(this.iWidget),
								allowWrapping: true
							}
						]
					  }
			);					
		}
		
		this.masterDialogSpec = { rows: masterDialogSpecArray };
	},

	/*
	 * returns string output version in the form to show on properties dialog
	 */
	_getAcitveReportOutputVersion: function(widget)
	{
		var sVersion = widget.getActiveReportOutputVersion();
		if (sVersion == null) {
			sVersion = RV_RES.IDS_JS_PROPERTY_ACTIVEREPORT_OUTPUT_VERSION_UNAVAILABLE;
		}
		return (RV_RES.IDS_JS_PROPERTY_ACTIVEREPORT_OUTPUT_VERSION + " " + sVersion);
	},

	/*
	 * returns concatenated public vairable names with type in the form to show on properties dialog
	 */
	_getPublicVariableNames: function(widget)
	{
		var oNames = widget.getPublicVariableNames();
		var sNamesToDisplay = "";
		for (var name in oNames) {
			var sType = oNames[name];
			if (sNamesToDisplay.length>0) {
				sNamesToDisplay += ", ";	
			}
			sNamesToDisplay += name;
			sNamesToDisplay += (sType === 'D')? ' (Discrete)' : '(Range)';
			
		}
		
		if (sNamesToDisplay.length>0) {
			sNamesToDisplay = "Public Variables: " + sNamesToDisplay;
		}
		return sNamesToDisplay;
	},
	
	/*
	 * @override
	 */
	_getReportWidgetTabTitle: function() {
		var reportWidgetTabTitle;
		if( this.iWidget && this.iWidget.getViewerObject() )
		{
			reportWidgetTabTitle = RV_RES.IDS_ACTIVE_REPORT_WIDGET_PROPERTY_TAB_TITLE;
		}
		return reportWidgetTabTitle;
	}
	
});