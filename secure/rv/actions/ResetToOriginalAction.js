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

function ResetToOriginalAction() {}

ResetToOriginalAction.prototype = new CognosViewerAction();

ResetToOriginalAction.prototype.updateMenu = function(jsonSpec) {
	var bBaseReportIsAvailable = this.getCognosViewer().envParams.baseReportAvailable;
	jsonSpec.disabled = ( bBaseReportIsAvailable === "false" ) ? true : jsonSpec.disabled;
	return jsonSpec;
};

ResetToOriginalAction.prototype.execute = function()
{
	var confirmationDialog  = viewer.dialogs.ConfirmationDialog(
		RV_RES.IDS_JS_RESET_TO_ORIGINAL,	/* title */
		RV_RES.IDS_JS_RESET_TO_ORIGINAL_WARNING, /* main message */
		RV_RES.IDS_JS_RESET_TO_ORIGINAL_WARNING_DESC, /* description */
		null, /* icon class */
		this, /* caller object */
		this.executeAction /* yes Handler function of caller object.  */
		);

	confirmationDialog.startup();
	confirmationDialog.show();
};

ResetToOriginalAction.prototype.executeAction = function(actionObject)
{
	this.gatherFilterInfoBeforeAction("ResetToOriginal");
	ChangePaletteAction.reset(this.getCognosViewer());
};

ResetToOriginalAction.prototype.dispatchRequest = function(filters)
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();

	widget.reset();

	var sOriginalItem = widget.getAttributeValue("originalReport");
	
	if (!sOriginalItem) {
		//We can't reset to an original report....reset to the last saved report.
		var sSavedItem = widget.getSavedItem();
		if (widget.isSavedReport(sOriginalItem, sSavedItem)) {
			sOriginalItem=sSavedItem;
		}
	}
	
	var sOriginalReportPart = widget.getAttributeValue("originalReportPart");
	var sCVobjectPermissions = viewer.envParams["cv.objectPermissions"];
	
	//save the configuration info that shouldn't be deleted
	var sBpmRestURI = viewer.envParams['bpmRestURI'];
	var sGlossaryURI = viewer.envParams['glossaryURI'];
	var sMetadataInformationURI = viewer.envParams['metadataInformationURI'];
	var sRoutingServerGroup = viewer.envParams["ui.routingServerGroup"];

	delete viewer.envParams;
	viewer.envParams = {};
	viewer.envParams["ui.object"] = sOriginalItem;
	viewer.envParams["originalReport"] = sOriginalItem;
	viewer.envParams["bux"] = "true";
	viewer.envParams["cv.objectPermissions"] = sCVobjectPermissions;
	viewer.envParams["ui.routingServerGroup"] = sRoutingServerGroup;
	if( sBpmRestURI ){
		viewer.envParams['bpmRestURI'] = sBpmRestURI;
	}
	
	if( sGlossaryURI ) {
		viewer.envParams['glossaryURI'] = sGlossaryURI;
	}
	
	if( sMetadataInformationURI ) {
		viewer.envParams['metadataInformationURI'] = sMetadataInformationURI ;
	}

	var cognosViewerRequest = this.createCognosViewerDispatcherEntry( "resetToOriginal" );
	cognosViewerRequest.addFormField("run.outputFormat", "HTML");
	cognosViewerRequest.addFormField( "widget.reloadToolbar", "true");
	cognosViewerRequest.addFormField( "ui.reportDrop", "true");
	
	// fix for COGCQ00897194
	viewer.resetbHasPromptFlag();
	cognosViewerRequest.addFormField("widget.forceGetParameters", "true");

	if (filters != "") {
		cognosViewerRequest.addFormField("cv.updateDataFilters", filters);
	}

	cognosViewerRequest.addFormField("run.prompt", "false");
	
	var bIsReportPart = (sOriginalReportPart && sOriginalReportPart.length > 0);
	if ( bIsReportPart ) {
		cognosViewerRequest.addFormField( "reportpart_id", sOriginalReportPart );
	}

	viewer.hideReportInfo();

	viewer.dispatchRequest( cognosViewerRequest );

	//fire the modified event
	this.fireModifiedReportEvent();
};

ResetToOriginalAction.prototype.doAddActionContext = function()
{
	return false;
};

/*
 * We want to show reset in Global area
 * @override
 */
ResetToOriginalAction.prototype.canShowMenuInGlobalArea = function()
{
	return true;
};

/*
 * This action is 
 *  - valid on prompt part in gloabl area
 *  - valid on regular report in regular tab
 *  - not valid on prompt part in regular tab
 * 
 * @override
 */
ResetToOriginalAction.prototype.isValidMenuItem = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();
	
	if (widget.m_isInGlobalArea) {
		return (this.isPromptWidget()? true : false); 
	} else {
		return (this.isPromptWidget()? false : true); 
	}
};


