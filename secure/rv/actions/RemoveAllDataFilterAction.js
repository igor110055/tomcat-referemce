/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 
 
/**
 * Removes all the dynamic filters (slider) from the report spec.  This is for use with 
 * save new report in Cognos Connection.  No state information should be updated with this
 * call.
 * @returns
 */
function RemoveAllDataFilterAction()
{
	this.m_sAction = "UpdateDataFilter";
};

RemoveAllDataFilterAction.prototype.setCognosViewer = function( oCV ){
	this.m_oCV = oCV;
};

RemoveAllDataFilterAction.prototype.getCognosViewer = function( oCV ){
	return this.m_oCV;
};

/**
 *  requestParms = { callback : { method : xxxx},
 *  							{ object : yyyy}
 *  		       }
 */
RemoveAllDataFilterAction.prototype.setRequestParms= function( requestParms ){
	if( !requestParms || !requestParms.callback){ return;}
	this.m_callbackMethod = requestParms.callback.method;
	this.m_callbackObject = requestParms.callback.object;
};

RemoveAllDataFilterAction.prototype.createJSONDispatcherEntry = function( requestType )
{
	var oReq = new JSONDispatcherEntry(this.getCognosViewer());
	oReq.addFormField("ui.action", requestType);

	//add action context
	var actionContext = this.addActionContext();
	oReq.addFormField("cv.actionContext", actionContext);
	if (window.gViewerLogger)
	{
		window.gViewerLogger.log('Action context', actionContext, "xml");
	}


	if(typeof this.m_oCV.envParams["ui.spec"] != "undefined")
	{
		oReq.addFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
	}
	
	oReq.addFormField("bux", 'true');

	return oReq;
};

RemoveAllDataFilterAction.prototype.addActionContext = function(){
	var actionContext = "<reportActions";
	var inlineValues = "";

	actionContext += " run=\"false\"";

	actionContext += ">";
		
	actionContext += "<reportAction name=\"" + this.m_sAction + "\">";
	
	var actionParms = "{ \"removeAll\" :\"true\"}";

	actionContext += xml_encode(actionParms);

	actionContext += "</reportAction>";

	
	actionContext += "</reportActions>";

	return actionContext;
};

RemoveAllDataFilterAction.prototype.executeCallback = function(reportSpec) {
	
	var callbackFunc = GUtil.generateCallback(this.m_callbackMethod, [reportSpec], this.m_callbackObject);
	callbackFunc();
};

RemoveAllDataFilterAction.prototype.handleServerResponse = function( serverResponse ) {
	if( serverResponse && serverResponse.getJSONResponseObject() ){
		this.executeCallback( serverResponse.getJSONResponseObject().reportSpec);
	}
};

RemoveAllDataFilterAction.prototype.execute = function() {
	var oCV = this.getCognosViewer();
	
	if( !oCV.getRAPReportInfo().hasSlider() ){
		this.executeCallback(oCV.envParams["ui.spec"]);
	} else {	
		var cognosViewerRequest = this.createJSONDispatcherEntry( "modifyReport" );	
		cognosViewerRequest.setCallbacks({"complete":{"object":this, "method":this.handleServerResponse}});
		oCV.dispatchRequest(cognosViewerRequest);	
	}
};