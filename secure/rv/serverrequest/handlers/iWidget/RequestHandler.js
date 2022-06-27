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

function RequestHandler( oCV ) {
	if (oCV) {
		RequestHandler.baseConstructor.call(this, oCV);
		this.m_originalFormFields = null;
		this.m_forceRaiseSharePrompt = false;
	}
}
RequestHandler.prototype = new BaseRequestHandler();
RequestHandler.baseConstructor = BaseRequestHandler;
RequestHandler.prototype.parent = BaseRequestHandler.prototype;

RequestHandler.prototype.postHttpRequest = function(response) {
	var oCV = this.getViewer();
	this.parent.postHttpRequest.call(this, response);
};


RequestHandler.prototype.setForceRaiseSharePrompt = function( bFlag ) {
	this.m_forceRaiseSharePrompt = bFlag;
};

RequestHandler.prototype.preHttpRequest = function(request) {
	var oCV = this.getViewer();
	var cvWidget = oCV.getViewerWidget();
	oCV.setCurrentNodeFocus(null);

	if( this.doRaiseSharePromptEvent(request) ) {
		if (oCV.widgetHasPromptParameters()) {
			// use the default request executed indicator which is a opaque background so user can't interact with
			// report content in the case where the prompt is on the report and not on a prompt page.
			this.setRequestIndicator(new BaseRequestExecutedIndicator(oCV));
			var cascadeParameterList  = this.getListOfCascadingPromptParametersToReset(oCV, request );			
			oCV.raisePromptEvent(oCV.envParams["reportPrompts"], request.getFormFields(), cascadeParameterList);
			
		} else {
			if (!(cvWidget && cvWidget.promptParametersRetrieved == true)) {
				//run getTransients to get the prompt parameters for this widget
				var getParametersAction = oCV.getAction("GetParameters");
				getParametersAction.isPrimaryPromptWidget = true;
				getParametersAction.execute();
			}
		}
	}

	oCV.resetRaiseSharePromptEventFlag();

	this.parent.preHttpRequest.call(this, request);
};

/**
 * Returns a list of parameter names of parameters which values have been changed.
 */
RequestHandler.prototype.getListOfChangedPromptParameters = function(oCV, request) {

	var oldParams = oCV.getOldParameters();

	if (!oldParams) { return null; }
	var changedPromptParamsList = [];	
	for ( var oldParam in oldParams) {
		oldParmValueItems = oldParams[oldParam].m_parmValueItems;
		var newParmValueItems = request.getFormFields().get('p_' + oldParam);
		if( !newParmValueItems ){ continue; }
		for ( var j = 0; j < oldParmValueItems.length; ++j) {
			var oldXmlEncodeParmValueItems = sXmlEncode(oldParmValueItems[j].m_useValue);
			if (newParmValueItems.indexOf(oldXmlEncodeParmValueItems) < 0) {
				//prefixing params name with
				changedPromptParamsList.push('p_' + oldParam);
			}
		}
	}

	return changedPromptParamsList;
};

/*
 *  For cascading prompts, if a parent prompt value is changed, then all its descendants need to be cleared. 
 *  Returns a list of parameters that needs to be cleared for cascading prompts.
 */
RequestHandler.prototype.getListOfCascadingPromptParametersToReset = function( oCV, request ) {
	if (!oCV.preProcessControlArray ) { return null; }
	
	var listOfChangedPrompts = this.getListOfChangedPromptParameters(oCV, request);
	
	if( !listOfChangedPrompts || !listOfChangedPrompts.length){ return null; }
	
	var promptParamsToBeReset = [];
	var kCount = oCV.preProcessControlArray.length;
	var tempList = listOfChangedPrompts.slice(); //keeps track of all the changed prompts and their dependent cascading prompts.
	for (var k = 0; k < kCount; k++) {
		var oPromptElement = (oCV.preProcessControlArray[k]);
		if( !oPromptElement.getCascadeOnParameter ){ return; }
		var oCascadedOnParentPrompt = oPromptElement.getCascadeOnParameter();
		if (!oCascadedOnParentPrompt) { continue; }
		
		var sParamName = oPromptElement.getParameterName();
		var sCascadedOnParentPromptName=oCascadedOnParentPrompt.getName();
		
		//if parent prompt had changed, then need to reset the child prompt value
		if (this.contains(tempList, sCascadedOnParentPromptName) && !this.contains(tempList, sParamName)) {
			//add this child prompt to the tempList so that if it has any child prompt, we know to reset it as well
			tempList.push(sParamName); 
			promptParamsToBeReset.push(sParamName);
		
		}
	}

	return promptParamsToBeReset;
};

RequestHandler.prototype.contains = function(a, obj) {
	var i = a.length;
	while (i--) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
};

RequestHandler.prototype.doRaiseSharePromptEvent = function(response) {
	var oCV = this.getViewer();
	var result = false;
	var action = response.getFormField("ui.action");
	
	if (( (typeof action !== "undefined" && ( action === "forward" ||   action === "back" ) ) && oCV.m_raiseSharePromptEvent )	|| 
			this.m_forceRaiseSharePrompt ){
		result = true;
		var requestParam = null;
		var credentialParamExists = false;
		var promptParamsCount = 0;
		var params = response.getFormFields();
		var keys = params.keys();
		for(requestParam in keys) {
			requestParam = keys[requestParam];
			// don't share credential parameters or search request
			if( requestParam == "_promptControl" && params.get(requestParam) == "search") {
				result = false;
				break;
			} else if (requestParam.indexOf("p_") === 0) {
				if (requestParam.indexOf("p_credential:") === 0) {
					credentialParamExists = true;
				} else {
					promptParamsCount += 1;
				}
			}
		}
		if (result && credentialParamExists && promptParamsCount === 0) {
			result = false;
		}
	}
	return result;
};

RequestHandler.prototype.onComplete = function(asynchDataResponse) {
	var oCV = this.getViewer();
	if (oCV && !oCV.m_destroyed) {
		this.parent.onComplete.call(this, asynchDataResponse);
		this.processDATAReportResponse(asynchDataResponse);
		this.postComplete();
	}
	else if (console) {
		console.warn("Tried to complete a request on an invalid CCognosViewer", oCV);
	}
};

RequestHandler.prototype.onPrompting = function(asynchDataResponse) {
	var oCV = this.getViewer();
	if (oCV && !oCV.m_destroyed) {
		var oWidget = oCV.getViewerWidget();
		oWidget.hideToolbarAndContextMenu();
		this.onComplete(asynchDataResponse);
	}
	else if (console) {
		console.warn("Tried to prompt on an invalid CCognosViewer", oCV);
	}
};

/**
 * Fire an event to CW so they can show the http error in a modal dialog
 */
RequestHandler.prototype.onError = function(response) {
	var oCV = this.getViewer();
	if (response && oCV) {
		var oWidget = oCV.getViewerWidget();

		if (typeof console != "undefined" && console && console.log) {
			console.log("Viewer http error: " + response.getResponseText() + " " + response.getStatus());
		}

		oWidget.fireEvent("com.ibm.bux.widget.action", null, { action : "httpError", responseText : response.getResponseText(), status : response.getStatus() });
	}
};

RequestHandler.prototype.onFault = function(response) {
	var oCV = this.getViewer();
	var viewerIWidget = oCV.getViewerWidget();

	var dispatcherEntry = oCV.getRetryDispatcherEntry();
	if (dispatcherEntry && dispatcherEntry.getOriginalFormFields()) {
		this.m_originalFormFields = dispatcherEntry.getOriginalFormFields();
	}
	else {
		// if we don't ahve a retryDispatcherEntry, then the fault must of happened right away (on drop).
		// get the retry form fields from the widget
		this.m_originalFormFields = viewerIWidget.getOriginalFormFields();
	}

	if(window['gReportWidgetLoadQueue']) {
		window['gReportWidgetLoadQueue'].widgetDoneLoading(viewerIWidget);		
	}

	if( this.isGlobalPromptException() ) {
		this.handleGlobalPromptException();
	}

	if( this.isMissingMemberException(oCV, response) ) {
		this.handleMissingMemberException(oCV);
	}

	if( oCV.envParams && oCV.envParams["updateToolbar"] === "true") {
		viewerIWidget.savedOutputMenuUpdated = false;
		viewerIWidget.updateToolbar();
	}

	if( oCV.envParams && oCV.envParams["ui.action"] === "buxView" ) {
		viewerIWidget.setSavedOutputsCMResponse( null );
	}

	if(typeof viewerIWidget.postOnFault == "function") {
		viewerIWidget.postOnFault();
	}

	this.parent.onFault.call(this, response);
	
	if (dispatcherEntry && response && response.getResponseState){ 
		// as we don't reset cv statuses when  onFault called from processInitialResponse 
		// since it's done inside processInitialResponse
		// then we do it when it comes from dispatcherEntry 
		// when called from processInitialResponse then dispatcherEntry and response are null
		var responseState = response.getResponseState();
		if (responseState) {
			this.updateViewerState(responseState);
		}
		this.onPostEntryComplete();
	}

	

};

RequestHandler.prototype.handleGlobalPromptException = function(){
	var oCV = this.getViewer();

	var faultDialog = new GlobalPromptFaultDialog(oCV);

	oCV.disableRaiseSharePromptEvent();
	if(this.m_originalFormFields && !this.m_originalFormFields.exists("sharedPromptRequest")) {
		//for report that failed immediately on drop, the request needs to be resent on OK, otherwise,
		//user will get a blank widget.
		faultDialog.setSendRequestOnOK( true );
	}

	faultDialog.setErrorMessage(RV_RES.IDS_JS_GLOBAL_PROMPTS_NOT_RESPONDING_WARNING);

	this.setFaultDialog(faultDialog);
};

RequestHandler.prototype.isGlobalPromptException = function( ) {
	var oCV = this.getViewer();
	if (this.m_originalFormFields) {
		if( this.m_originalFormFields.exists("sharedPromptRequest") ||
			( this.m_originalFormFields.get("ui.reportDrop") === "true" && this.m_originalFormFields.exists("widget.globalPromptInfo") ) ){
			return true;
		}
	}
	return false;
};

RequestHandler.prototype.postComplete = function() {
	var oCV = this.getViewer();

	// Wait until all the inline scripts are done executing.
	if (oCV.getStatus() == "complete" && !oCV.inlineScriptsDoneExecuting) {
		var objRef = this;
		setTimeout(function() { objRef.postComplete(); }, 10);
		return;
	}
	
	this.parent.postComplete.call(this);
	if (oCV && oCV.m_destroyed) {
		if (console) {
			console.warn("Tried to postComplete on an invalid CCognosViewer", oCV);
		}
		return;
	}
	var viewerIWidget = oCV.getViewerWidget();

	if(window['gReportWidgetLoadQueue']) {
		window['gReportWidgetLoadQueue'].widgetDoneLoading(viewerIWidget);		
	}

	this.showReport();

	// make sure all our selections are cleared.
	oCV.getSelectionController().clearSelectionData();
	oCV.addPageAdornments();
	viewerIWidget.savedOutputMenuUpdated = false;
	if (oCV.getStatus() != "prompting") {
		viewerIWidget.fetchAnnotationData();
		viewerIWidget.getUndoRedoQueue().add({"reportUpdated": true});
	}
	viewerIWidget.updateToolbar();

	oCV.m_stateSet = true;
	oCV.doneLoading();
	if(typeof viewerIWidget.postComplete == "function") {
		viewerIWidget.postComplete();
	}
};

RequestHandler.prototype.updateViewerState = function(oState) {
	var oCV = this.getViewer();
	if (oCV && oCV.m_destroyed) {
		if (console) {
			console.warn("Tried to update state on an invalid CCognosViewer", oCV);
		}
		return;
	}
	this.parent.updateViewerState.call(this, oState);

	var status = oCV.getStatus();

	if(status != "fault") {
		if (oCV.envParams["buxToolbarPayload"]) {
			oCV.setToolbar(eval(oCV.envParams["buxToolbarPayload"]));
			delete oCV.envParams["buxToolbarPayload"];
		}

		if (oCV.envParams["buxContextMenuPayload"]) {
			oCV.setContextMenu(eval(oCV.envParams["buxContextMenuPayload"]));
			delete oCV.envParams["buxContextMenuPayload"];
		}

		if(oCV.envParams.reportPrompts) {
			oCV.getViewerWidget().setPromptParametersRetrieved(true);
		}

		if(oCV.envParams.reRunObject) {
			var formWarpRequest = document.getElementById("formWarpRequest" + oCV.getId());
			if (formWarpRequest["reRunObj"]) {
				formWarpRequest["reRunObj"].value = oCV.envParams.reRunObject;
			}
			else {
				formWarpRequest.appendChild(createHiddenFormField('reRunObj', oCV.envParams.reRunObject));
			}
		}
	}
};

/**
 * Should only be called once when the Viewer first loads. This is because
 * the initial response from the server didn't go through the dispatcher entries,
 * so we need logic to handle complete, working, fault, ...
 */
RequestHandler.prototype.processInitialResponse = function(oState) {
	var oCV = this.getViewer();
	var viewerIWidget = oCV.getViewerWidget();
	

	if(viewerIWidget != null) {
		if (viewerIWidget.shouldUseSavedReportInfo()) {
			oCV.envParams["rapReportInfo"] = viewerIWidget.getAttributeValue("rapReportInfo");
		}

		this.parent.processInitialResponse.call(this, oState);

		// we need to call the render.done event so that pinFreeze size calculations are done correctly
		// this even can be fixed for all the Viewer's status, since as soon as we get a response from the
		// server we want to show our UI instead of chromes.
		viewerIWidget.fireEvent("com.ibm.bux.widget.render.done", null, {noAutoResize:true});

		this.getViewer().renderTabs();

		oCV.getPinFreezeManager().fromJSONString(viewerIWidget.getAttributeValue("PinFreezeInfo"));

		// we only need the outputKey for a working response since we're
		// not done getting the report output
		var status = oCV.getStatus();
		if (status != "working" && status != "stillWorking") {
			delete oCV.envParams["cv.outputKey"];
			viewerIWidget.setXNodeId(null);
		}

		switch(status) {
			case "complete":
				viewerIWidget.setOriginalFormFields(null);
				this.postComplete();
				break;
			case "working":
			case "stillWorking":
				oCV.getWorkingDialog().show();
				// add a delay for this callback to allow the server request to clean up, and not block any futher server requests
				setTimeout(getCognosViewerObjectRefAsString(oCV.getId())+".executeCallback(\"wait\");",10);
				break;
			case "prompting":
				viewerIWidget.hideToolbarAndContextMenu();
				break;
			case "fault":
				if (this.isAuthenticationFault()) {
					this.onPassportTimeout();
				}
				else {
					this.onFault();
				}
		}

		this.showReport();
		this.onPostEntryComplete();

		oCV.m_stateSet = true;
		
		this.onAsynchStatusUpdate(status);
	}
	else {
		var objRef = this;
		setTimeout(function() { objRef.processInitialResponse(oState); }, 100);
	}
};

RequestHandler.prototype.onPostEntryComplete = function()
{
	var oCV = this.getViewer();
	if (oCV && oCV.getViewerWidget()) {
		var cvWidget = oCV.getViewerWidget();
		cvWidget.getLoadManager().processQueue();
	}
};

RequestHandler.prototype.isMissingMemberException = function(oCV, response){
	
	if (oCV.bMissingMemberException) {
		return true;
	}
	
	if (response && response.getResponseState) {
		var oState = response.getResponseState();
		if (oState && oState.envParams && oState.envParams.bMissingMemberException) {

			this._populateMissingMemberDetails(oCV, oState);
			return true;
		}		
	}
	return false;
};

RequestHandler.prototype._populateMissingMemberDetails = function(oCV, oState){

	if (!oCV || !oState || !oState.envParams) {
		return;
	}	
	
	oCV.bCanEditContent = oState.envParams.bCanEditContent;
	oCV.bHasParameters = oState.envParams.bHasParameters;
	
	if (oState.envParams["ui.spec"]) {
		if (oCV.envParams) {
			if (!oCV.envParams["ui.spec"]) {
				oCV.envParams["ui.spec"] = xml_decode(oState.envParams["ui.spec"]);
			}
		}
	}
};

RequestHandler.prototype.handleMissingMemberException = function(oCV){

	var sErrorMsg = null;
	
	sErrorMsg =(oCV.bCanEditContent) ? RV_RES.IDS_JS_MISSING_MEMBER_ERROR_MSG_FOR_SPEC_PARAM : RV_RES.IDS_JS_MISSING_MEMBER_ERROR_MSG_WITH_NO_BUA;
	
	var faultDialog = new MissingMemberFaultDialog(oCV, sErrorMsg, oCV.bCanEditContent, oCV.bHasParameters);
	this.setFaultDialog(faultDialog);
};

RequestHandler.prototype.massageHtmlBeforeDisplayed = function() {
	var oCV = this.getViewer();
	if (!oCV) {
		return;
	}

	var oWidget = oCV.getViewerWidget();
	if (!oWidget) {
		return;
	}	
	
	oWidget.updateDrillThroughLinks();
};