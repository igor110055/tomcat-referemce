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

function ViewerPageState() {
	this.currentPage = 1;
	this.pageCount = 1;
}

ViewerPageState.prototype.setState = function(state) {
	applyJSONProperties(this, state);
};

ViewerPageState.prototype.getCurrentPage = function() {
	return this.currentPage;
};

ViewerPageState.prototype.getPageCount = function() {
	return this.pageCount;
};