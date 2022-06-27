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
 * FindNextOnServerAction 
 */
function FindNextOnServerAction() {
	this.m_requestParams = null;
	this.m_sAction = 'findNextOnServer';
}


FindNextOnServerAction.prototype = new FindAction();
FindNextOnServerAction.baseclass = FindAction.prototype;

FindNextOnServerAction.prototype.setRequestParms = function(params)
{
	this.setConfigAndState();
}


FindNextOnServerAction.prototype.execute = function() {
	return this.sendRequest();
}

FindNextOnServerAction.prototype.sendRequest = function() {
	
	if (!this.findState) {
		return -1;
	}
		
	var cv = this.getCognosViewer();

	var request = new ViewerDispatcherEntry(cv);
	
	// Save the original complete callback
	this.originalCompleteCallback = request.getCallbacks()["complete"];
	
	request.setCallbacks( {
		"complete" : {"object" : this, "method" : this.onRequestComplete}
	});

	request.addFormField("ui.action", "reportAction");
	request.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageNumber", this.findState.getPageNoForFindNext());
	request.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#search", this.findState.getKeyword());
	request.addFormField("generic.boolean.http://developer.cognos.com/ceba/constants/runOptionEnum#caseSensitiveSearch", this.findState.isCaseSensitive());
	request.addFormField("generic.boolean.http://developer.cognos.com/ceba/constants/runOptionEnum#wrapAroundSearch", this.findState.isWrapAroundSearch());
	
	this.findState.findOnServerStarted();
	return cv.dispatchRequest(request);
}

FindNextOnServerAction.prototype.onRequestComplete = function(response) {
	var status = response.getAsynchStatus();
	var callbackFunc = GUtil.generateCallback(this.originalCompleteCallback.method, [response], this.originalCompleteCallback.object);
	if (status === "complete") {
		var sHTML = response.getResult();
		
		if (sHTML && sHTML.length > 0) {
			// Status is complete and we have HTML which means a match was found. 
			// Call the original callback function so the report HTML and state get updated.
			callbackFunc();
			
			setTimeout(GUtil.generateCallback(this.processResponse,[true], this),100);
		}
		else {
			// No HTML returned so a match wasn't found on the server, don't call the original 'complete'
			// callback since we don't want to get rid of the report page that's currently being displayed
			setTimeout(GUtil.generateCallback(this.processResponse,[false], this),100);
		}
	}
	else {
		callbackFunc();
	}
};

/**
 * Server returns a page where matches are found or empty page if no matches are found. 
 * CognosViewer processResponse* functions already have taken care about the returned page.
 *  
 * In this action, two things are to be done.
 * 1) update local state
 * 2) perform local search to highlight 
 * 
 */
FindNextOnServerAction.prototype.processResponse = function(found) {
	this.setConfigAndState();
	
	if (!this.findState) {
		return false;
	}	
	this.findState.findOnServerDone();
	
	if (found) {
		this.clearPreviousResult(false);	
		if ( this.findAndShow()) {
			if (this.findState.isRepeating()) {
				var callback= this.findConfig.getFindActionCompleteCallback();
				callback();
			}
		}
	} else {
		var callback = this.findState.foundMatchesInReport() ?
				this.findConfig.getFindActionCompleteCallback() :
				this.findConfig.getNoMatchFoundCallback() ; 
		callback();
	};
	return true;
}
