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

function BusinessProcessAction() {};

BusinessProcessAction.prototype = new CognosViewerAction();


BusinessProcessAction.prototype.updateMenu = function( jsonSpec ) {
	var sBpmRestURI = this.getCognosViewer().envParams['bpmRestURI'];
	jsonSpec.visible = ( sBpmRestURI  ? true : false );
	
	if(jsonSpec.visible) {
		jsonSpec.disabled = !this._hasAnyContextInSelectedObjects();
	}
	return jsonSpec;
};

BusinessProcessAction.prototype._initBPMGateway = function() {
	var cognosViewer = this.getCognosViewer();
	this.m_BPMGateway = cognosViewer.envParams['bpmRestURI'];
	
	var length = this.m_BPMGateway.length;
	if( this.m_BPMGateway[length-1] !== '/') {
		this.m_BPMGateway += '/';
	}
};

BusinessProcessAction.prototype.execute = function() {
	this._initBPMGateway();
	var oProcesses = this._getBPMProcesses();

};

BusinessProcessAction.prototype._getBPMProcesses = function() {	
	var callbacks = {
			complete : { object : this, method : this.handleGetBPMProcessSuccess },
			fault : { object : this, method : this.handleGetBPMProcessFail } 
	};
	
	var url = this.m_BPMGateway  + 'exposed/process';
	var request = this._createBPMServerRequest( 'GET', callbacks, url );
	request.sendRequest();
	
};

BusinessProcessAction.prototype._createBPMServerRequest = function( action, callbacks, url, aFormFields ) {

	var xmlHttpObj = new XmlHttpObject();
	xmlHttpObj.init( action, this._rewriteURL(url) );
	xmlHttpObj.setCallbacks( callbacks );
	xmlHttpObj.setHeaders({ Accept : "application/json"} );

	if( aFormFields ) {
		for( var i in aFormFields ){
			xmlHttpObj.addFormField(aFormFields[i].name, aFormFields[i].value);
		}
	}
	

	return xmlHttpObj;
};

BusinessProcessAction.prototype._rewriteURL = function( url ) {

	if( bux && bux.iwidget && bux.iwidget.canvas && bux.iwidget.canvas.Helper && bux.iwidget.canvas.Helper.rewriteUrl )
	{
		return bux.iwidget.canvas.Helper.rewriteUrl( url );
	}
	
	return url;
};

 
BusinessProcessAction.prototype.handleGetBPMProcessFail = function( serverResponse ) {
	var sErrorMsg = RV_RES.IDS_JS_BUSINESS_PROCESS_GET_PROCESSES_FAIL_MSG;
	var sErrorDetails = serverResponse.getResponseText();
	this._showErrorMessage( sErrorMsg, sErrorDetails );
};


BusinessProcessAction.prototype.handleGetBPMProcessSuccess = function( serverResponse ) {
	var response = serverResponse.getResponseText();
	if( !response )
	{
		return;
	}
	var jsonResponse = dojo.fromJson( response );
	
	var oBusinessProcessesInfo = this._getBusinessProcessesInfo( jsonResponse.data.exposedItemsList );
	this._showDialog( oBusinessProcessesInfo );
};

BusinessProcessAction.prototype._getBusinessProcessesInfo = function( exposedItemsList ) {
	if( !exposedItemsList ){
		return;
	}
	
	var noOfItems = exposedItemsList.length;
	var bpmProcessInfo = new Array();
	var bmpProcessUniqueNamesMap = {};
	for( var i = 0; i < noOfItems; i++ ) {
		var sProcessDisplayName = exposedItemsList[i].display;
		var sProcessItemID = exposedItemsList[i].itemID;
		var sProcessAppID  =  exposedItemsList[i].processAppID;
		
		if( sProcessDisplayName && !bmpProcessUniqueNamesMap[sProcessDisplayName] && sProcessItemID && sProcessAppID ) {			
			bmpProcessUniqueNamesMap[sProcessDisplayName] = true;
			bpmProcessInfo.push( {	sCaption : sProcessDisplayName,
									sBPD_ID : sProcessItemID,
									sProcessAppID : sProcessAppID } );
		}
	};
	
	return bpmProcessInfo;
};

BusinessProcessAction.prototype._showDialog = function( oBPMProcessInfo ) {
	
	var oBPAction = this;
	var oSelectBusinessProcessDialog = new viewer.dialogs.SelectBusinessProcess( {
			sTitle : RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_TITLE,
			sLabel : RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_DESC,
			okHandler : function() {},
			cancelHandler : function() {},
			BPMProcessesInfo : oBPMProcessInfo,
			bpAction : oBPAction
	});
	oSelectBusinessProcessDialog.startup();
	oSelectBusinessProcessDialog.show();
};

/**
 * This function gets the selection context and generates the process input parameter
 * (much like the drill thru parameters)
 * 
 * Should be in the format:
 * { CognosParameter : { ... } }
 */
BusinessProcessAction.prototype.getInputParameter = function( bValueAsString ) {
	var obj = null;
	var cognosViewer = this.getCognosViewer();
	var oSectionController = cognosViewer.getSelectionController();
	
	var aJsonContexts = oSectionController.getSelectedObjectsJsonContext(); 
	if (aJsonContexts) {
		
		var value = aJsonContexts;
		if( bValueAsString )
		{
			value = dojo.toJson( value );
		}
		obj = {"cognosParameter": value};
	}
	return obj;
	
}


BusinessProcessAction.prototype.startProcess = function( sBPD_Id, sProcessAppId, sProcessName ) {
	
	var callbacks = {
			customArguments: [ sProcessName ],
			complete : { object : this, method : this.handleGetStartProcessSuccessResponse },
			fault : { object : this, method : this.handleGetStartProcessFailResponse } 
	};
	
	var url = this.m_BPMGateway + 'process';
	
	var oFormFields = new Array();
	oFormFields.push( {name : 'action', value : 'start'} );
	oFormFields.push( {name : 'parts', value : 'data'} );
	
	if( sBPD_Id ) {
		oFormFields.push( {name : 'bpdId', value : sBPD_Id});
	}
	
	if( sProcessAppId ) {
		oFormFields.push( {name : 'processAppId', value : sProcessAppId} );
	}
	
	var oParam = this.getInputParameter(true /*value as string */);
	if( oParam ) {
		oFormFields.push( {name : 'params', value : dojo.toJson(oParam) } );
	}
				
	var request = this._createBPMServerRequest( 'POST', callbacks, url, oFormFields );
	request.sendRequest();
};

BusinessProcessAction.prototype.handleGetStartProcessSuccessResponse = function( serverResponse, sProcessName ) {
	var response = serverResponse.getResponseText();
	if( response ) {
		var jsonResponse = dojo.fromJson( response );
		if( jsonResponse.status === "200" ) {
			
			var sMsg = CViewerCommon.getMessage(RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG, sProcessName );
			var oInfoMsgDialog = new ModalInfoMessageDialog({
				sTitle : RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG_TITLE,
				sMessage : sMsg,
				sDescription : RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG_DETAIL
			});
			oInfoMsgDialog.show();
		}
	}
};

BusinessProcessAction.prototype.handleGetStartProcessFailResponse = function( serverResponse, sProcessName ) {
	var response = serverResponse.getResponseXml();
	if( response && response.documentElement )
	{
		this._handleXMLErrorResponse( response, sProcessName );
		return;
	}
	
	var sErrorMsg = CViewerCommon.getMessage( RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_FAILED_MSG, sProcessName );
	
	var sErrorDetails = serverResponse.getResponseText();
	try{
		var jsonResponse = dojo.fromJson( sErrorDetails );
		sErrorDetails = jsonResponse.Data.errorMessage;
	} catch(err) {/*swallow exception*/}
	
	this._showErrorMessage( sErrorMsg, sErrorDetails );
};


BusinessProcessAction.prototype._handleXMLErrorResponse = function( xmlError, sProcessName ) {
	
	var eError = XMLHelper_FindChildrenByTagName( xmlError, "error" );
	var sErrorMessage = "";
	var sErrorDetails = "";
	
	if( eError ) {
		sErrorMessage = XMLHelper_FindChildrenByTagName( eError, "message" ).childNodes[0].nodeValue;
		sErrorDetails = XMLHelper_FindChildrenByTagName( eError, "detail" ).childNodes[0].nodeValue;
	}
	else
	{
		sErrorMessage = CViewerCommon.getMessage( RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_FAILED_MSG, sProcessName);
	}

	this._showErrorMessage( sErrorMessage, sErrorDetails );
};

BusinessProcessAction.prototype._showErrorMessage = function( sErrorMsg, sErrorDetails ) {
	var errorDialog = new ModalFaultMessageDialog( sErrorMsg, sErrorDetails );
	errorDialog.show();
};

BusinessProcessAction.prototype._hasAnyContextInSelectedObjects = function() {
	
	var foundCtx = false;
	var oSectionController = this.m_oCV.getSelectionController();
	
	var aSelectedObjects = oSectionController.getAllSelectedObjects();
	for( var i=0; i<aSelectedObjects.length; i++) {
		var aCtxIds = aSelectedObjects[i].getSelectedContextIds();
		if (aCtxIds && aCtxIds.length>0) {
			foundCtx= true;
			break;
		}
	}

	return foundCtx;
};