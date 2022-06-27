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

function ViewerFindState() {
	//PUBLIC API - Do not change. Start
	this.keyword = null;
	this.caseSensitive = false;
	this.wrapAroundSearch = true;
	//PUBLIC API - Do not change. End

	this.matches = null;
	this.focus_index = -1;

	this.matchesFoundInReport = false;
	this.matchesFoundOnServer = false;
	this.pageFirstMatchFound = -1; //used to detect repeating/looping pages
	this.matchesUpdateCount = 0;

	this.currentPageNo = -1;
	this.currentPageHasNext = false;
	this.currentPageHasPrev = false;
	
	this.findingOnServerInProgress = false;
	this.searchedOnServer = false;
}

ViewerFindState.prototype.setState = function(state) {
	applyJSONProperties(this, state);
	
};

/**
 * return page number to search from on server
 */
ViewerFindState.prototype.getPageNoForFindNext = function() {	
	if (!this.isSinglePageReport()) {
		this.currentPageNo++;
	}
	return this.currentPageNo;
}

/**
 * returns true if more pages to search exist
 */
ViewerFindState.prototype.checkServerForNextMatch = function() {
	if (this.isSinglePageReport() ) {
		return false;
	}
	
	if (this.searchedOnServer && (!this.matches || this.matches.length ==0) ) {
		return false; //No matches in entire report
	}
	
	if (this.currentPageHasNext) {
		return true;
	}
	
	if (this.currentPageHasPrev && this.wrapAroundSearch) {
		return true;
	}

	return false;
}

ViewerFindState.prototype.isSinglePageReport = function() {
	return (this.currentPageNo == 1 && !this.currentPageHasNext && !this.currentPageHasPrev);
}

/**
 * called by CV response handler
 */
ViewerFindState.prototype.findOnServerInProgress = function() {
	return this.findingOnServerInProgress;
}
/**
 * Sets a flag for CV response handler to key off server response for FindNext on server 
 */
ViewerFindState.prototype.findOnServerStarted = function() {
	this.findingOnServerInProgress = true;
	this.matchesFoundOnServer = false;
	this.searchedOnServer = true;
}
/**
 * Rests a flag for CV response handler to key off server response for FindNext on server 
 */
ViewerFindState.prototype.findOnServerDone = function() {
	this.findingOnServerInProgress = false
}

ViewerFindState.prototype.foundMatchesInReport = function() {
	return this.matchesFoundInReport;
}



/**
 * update current page info: matches, page no, has next page and has previous page
 */
ViewerFindState.prototype.updatePageInfo = function(matches, currentPage, hasNextPage, hasPrevPage) {
	this.currentPageNo = currentPage;
	this.currentPageHasPrev = hasPrevPage;
	this.currentPageHasNext = hasNextPage;
	this.matches = matches;
	this.focus_index = -1;
	
	
	if (matches && matches.length>0) {
		this.matchesFoundInReport = true;
		this.matchesUpdateCount++;
		if (this.pageFirstMatchFound ==-1) {
			this.pageFirstMatchFound = currentPage;
		}
	}
}

ViewerFindState.prototype.resetPageInfo = function() {
	this.updatePageInfo(null, -1, false, false);
}


/**
 * returns matches
 */
ViewerFindState.prototype.getMatches = function() {
	return this.matches;
}
/**
 * returns first element in matches
 */
ViewerFindState.prototype.firstMatch = function() {
	if (this.matches && this.matches.length > 0 ) {
		this.focus_index = 0;
		return this.matches[this.focus_index];	
	}
	return null;
}
/**
 * returns next item in matches
 */ViewerFindState.prototype.nextMatch = function() {
	if (this.matches && this.matches.length > (this.focus_index+1) ) {
		return this.matches[++this.focus_index];	
	}
	return null;
}
/**
 * returns true if currently focused item is not the last item in matches
 */
ViewerFindState.prototype.hasNext = function() {
	return (this.matches && this.matches.length > (this.focus_index+1) );
}
/**
 * returns item to be focused
 */
ViewerFindState.prototype.getFocusedMatch = function() {
	if (this.matches && this.matches.length>0 && this.focus_index >=0) {
		return this.matches[this.focus_index]; 
	}
	return null;	
}
/**
 * returns keyword input
 */
ViewerFindState.prototype.getKeyword = function() {
	return this.keyword;
}
/**
 * returns caseSensitive input
 */
ViewerFindState.prototype.isCaseSensitive = function() {
	return this.caseSensitive;
}
/**
 * returns wrapAroundSearch input
 */
ViewerFindState.prototype.isWrapAroundSearch = function() {
	return this.wrapAroundSearch;
}
/**
 * returns true if current page is same as the page first match was found
 */
ViewerFindState.prototype.isRepeating = function() {
	
	if (this.isSinglePageReport()) {
		return this.pageFirstMatchFound == this.currentPageNo;
	} else {
		return (this.pageFirstMatchFound == this.currentPageNo && this.matchesUpdateCount>1);
	}
};
