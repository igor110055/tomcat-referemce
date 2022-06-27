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
 * FindAction - finds visible matching node and returns
 */
function FindNextAction() {
	this.m_requestParams = null;
	this.m_sAction = 'findNext';
}

FindNextAction.prototype = new FindAction();
FindNextAction.baseclass = FindAction.prototype;

FindNextAction.prototype.setRequestParms = function(params)
{
	this.setConfigAndState();
}

FindNextAction.prototype.execute = function() {
	
	if (this.findState) {
				
		var currentFocus = this.findState.getFocusedMatch();
		
		if (this.findState.hasNext() ) {
			var newFocus = this.findState.nextMatch();
			this.restoreMatchStyle(currentFocus);
			this.applyFocusStyle(newFocus);
		} else {
			this.restoreMatchStyle(currentFocus);
			
			if (this.findState.checkServerForNextMatch()) {
				var cv = this.getCognosViewer();
				return cv.executeAction('FindNextOnServer');
			} else {
				
				if (this.findState.isWrapAroundSearch()) { //wrap on current page
					currentFocus = this.findState.firstMatch();
					this.applyFocusStyle(currentFocus);
					
					if (this.findState.isRepeating()) {
						var callback = this.findConfig.getFindActionCompleteCallback();
						callback();
					}
				} else {
					//no more matches found callback 
					var callback = this.findConfig.getFindActionCompleteCallback();
					callback();
				}
			}
		}
	}
	return true;
}

