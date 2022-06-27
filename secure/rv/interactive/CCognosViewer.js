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
 * Checks to see if the user clicked on a sort icon and if so executes the sort action.
 * 
 * Returns true is the sort was done, false otherwise 
 */
CCognosViewer.prototype.sortColumn = function(evt) {
	var leftMouseButton = evt.which ? evt.which == 1 : evt.button == 0;
	var cvSort = new CognosViewerSort(evt, this);

	if(leftMouseButton && cvSort.isSort(evt)) {
		cvSort.execute();
		return true;
	}	
	
	return false;
};

/**
 * Overrides the base isInteractiveViewer function
 */
CCognosViewer.prototype.isInteractiveViewer = function() {
	return true;
};

CCognosViewer.prototype.canExpand = function() {
	var expandMemberAction = new ExpandMemberAction();
	expandMemberAction.setCognosViewer(this);

	return expandMemberAction._canShowMenu(this.getSelectionController()) && expandMemberAction._canEnableMenu(this.getSelectionController());
}; 

CCognosViewer.prototype.canCollapse = function() {
	var expandCollapseMemberAction = new CollapseMemberAction();
	expandCollapseMemberAction.setCognosViewer(this);
	return expandCollapseMemberAction._canEnableMenu(this.getSelectionController());
};

CCognosViewer.prototype.expand = function() {
	var expandMemberAction = new ExpandMemberAction();
	expandMemberAction.setCognosViewer(this);
	expandMemberAction.execute();
};

CCognosViewer.prototype.collapse = function() {
	var collapseMemberAction = new CollapseMemberAction();
	collapseMemberAction.setCognosViewer(this);
	collapseMemberAction.execute();	
};

