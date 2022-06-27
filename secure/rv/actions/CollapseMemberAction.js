/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function CollapseMemberAction()
{
	this.m_sAction = "ExpandCollapseMember";
	this.m_sExpandCollapseType="CollapseMember";
	
}
CollapseMemberAction.prototype = new ExpandCollapseMemberAction();
CollapseMemberAction.baseclass = ExpandCollapseMemberAction.prototype;

CollapseMemberAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_COLLAPSE_MEMBER;
};

CollapseMemberAction.prototype._canDisableMenu = function(oSectionController)
{
	if (this._isSingleSelection(oSectionController) && !this._isExpanded() ) {
		return true;
	}
	return false;
};

CollapseMemberAction.prototype._canEnableMenu = function(oSectionController)
{
	var selObj = this._getFirstSelectedObject(oSectionController);
	if (this._alwaysCanExpandCollapse(selObj)) {
		return true;  //Expand/collapse cant be determined for complex sets...enable both items
	}	
	
	return (this._isSingleSelection(oSectionController) && this._isExpanded(selObj)); 
};

