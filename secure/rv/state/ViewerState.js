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

function ViewerState() {
	this.findState = null;
	this.pageState = null;
}

ViewerState.prototype.setFindState = function(state) {
	if (typeof ViewerFindState != "function") {
		return;
	}
	
	if (!this.findState) {
		this.findState = new ViewerFindState();
	}
	
	this.findState.setState(state);
};

ViewerState.prototype.clearFindState = function() {
	this.findState = null;
};

ViewerState.prototype.getFindState = function() {
	return this.findState;
};

ViewerState.prototype.setPageState = function(state) {
	if (typeof ViewerPageState != "function") {
		return;
	}
	if (!this.pageState) {
		this.pageState = new ViewerPageState();
	}
	
	this.pageState.setState(state);
};

ViewerState.prototype.clearPageState = function() {
	this.pageState = null;
};

ViewerState.prototype.getPageState = function() {
	return this.pageState;
};


 
 
