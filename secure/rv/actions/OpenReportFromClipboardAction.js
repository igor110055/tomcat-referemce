/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 /**
 * This is the base class for generating request to re-run the report.
 * Classes derived from this will add to it their specific options.
 */
function OpenReportFromClipboardAction()
{
	this.m_action = 'bux';
	this.m_cv = this.getCognosViewer();
}

OpenReportFromClipboardAction.prototype = new CognosViewerAction();
OpenReportFromClipboardAction.prototype.reuseQuery =function() { return false; };
OpenReportFromClipboardAction.prototype.reuseGetParameter =function() { return false; };
OpenReportFromClipboardAction.prototype.keepRAPCache = function() {return false; };
OpenReportFromClipboardAction.prototype.reuseConversation = function() {return false; };
OpenReportFromClipboardAction.prototype.runReport = function() {return true;};
OpenReportFromClipboardAction.prototype.isUndoable = function() {return true; };


OpenReportFromClipboardAction.prototype.execute = function()
{
	if( window.clipboardData )
	{
		this.openReportForIE();
	}
	else
	{
		this.openReportForNonIE();
	}	
};

OpenReportFromClipboardAction.prototype.openReportForNonIE = function()
{
	var openReportFromClipboardActionObj = this;
	var clipboardDialog = new viewer.dialogs.ClipboardDialog({
		sTitle: RV_RES.IDS_JS_CLIPBOARD,
		okHandler: function(reportSpec)
		{
			openReportFromClipboardActionObj.executeAction(reportSpec);
		},
		cancelHandler: function() {}
	});
	clipboardDialog.startup();
	window.setTimeout(function () { clipboardDialog.show(); },0);
};

OpenReportFromClipboardAction.prototype.openReportForIE = function()
{
	var reportSpec = window.clipboardData.getData( 'Text' );
	this.executeAction( reportSpec );
};


OpenReportFromClipboardAction.prototype.getDeleteEnvParamsList = function()
{
	var deleteEnvParamsList = [
		'modelPath',
		'packageBase',
		'rapReportInfo',
		'rap.state'
	];
	
	return deleteEnvParamsList;	
};

OpenReportFromClipboardAction.prototype.deleteEnvParams = function()
{
	var envParams = this.m_cv.envParams;
	var envParamsToBeDeleted = this.getDeleteEnvParamsList();
	
	for( var index in envParamsToBeDeleted )
	{
		if( envParams[ envParamsToBeDeleted[index] ] )
		{
			delete envParams[ envParamsToBeDeleted[index] ];
		}
	}
	
};

/**
 * Need to clean up CCognosViewer
 */
OpenReportFromClipboardAction.prototype.cleanUpCognosViewer = function()
{
	this.m_cv.setExecutionParameters( "" );
	this.m_cv.setConversation( "" );
	this.deleteEnvParams();
};

OpenReportFromClipboardAction.prototype.getRequestParams = function()
{

	var requestParams = {
		'run.outputFormat' : 'HTML' ,
		'cv.id' : this.m_cv.getId(),
		'widget.reloadToolbar' : 'true',
		'openReportFromClipboard' : 'true',
		'ui.reportDrop' : 'true'
	};
	
	var globalPrompts = this.m_cv.getViewerWidget().getGlobalPromptsInfo();
	if (globalPrompts != null ) {
		requestParams[ 'widget.globalPromptInfo' ] = globalPrompts;
	}
	
	if( this.m_filters != "" )
	{
		requestParams["cv.updateDataFilters"] = this.m_filters;
	}

	
	var envParamsNames = [
		'cv.objectPermissions',
		'limitedInteractiveMode'
	];
	
	for( var index in envParamsNames )
	{
		var envParamName = envParamsNames[index];
		var envParamValue = this.m_cv.envParams[envParamName];
		if( envParamValue )
		{
			requestParams[ envParamName ] = envParamValue;
		}
	}

	return requestParams;
};

/**
 * Overrides the base class function
 */
OpenReportFromClipboardAction.prototype.addAdditionalOptions = function( cognosViewerRequest )
{
	var options = this.getRequestParams();

	for( var index in options )	{
		cognosViewerRequest.addFormField( index, options[index] );
	}
};

OpenReportFromClipboardAction.prototype.executeAction = function( reportSpec )
{
	this.m_cv = this.getCognosViewer();
	this.m_cv.envParams["ui.spec"] = reportSpec;
	this.gatherFilterInfoBeforeAction("OpenReportFromClipboard");
	ChangePaletteAction.reset(this.getCognosViewer());
}

OpenReportFromClipboardAction.prototype.dispatchRequest = function( filters )
{

	this.m_cv = this.getCognosViewer();
	var widget = this.m_cv.getViewerWidget();
	widget.reset();
	
	this.m_filters = filters;
	
	this.cleanUpCognosViewer();

	var cognosViewerRequest = this.createCognosViewerDispatcherEntry( this.m_action );
	
	this.m_cv.hideReportInfo();

	this.m_cv.dispatchRequest( cognosViewerRequest );

	//fire the modified event
	this.fireModifiedReportEvent();
};

OpenReportFromClipboardAction.prototype.doAddActionContext = function()
{
	return false;
};

OpenReportFromClipboardAction.prototype.updateMenu = function(json)
{
	json.visible = ( window.cognosViewerDebug === true );
	return json;
};
