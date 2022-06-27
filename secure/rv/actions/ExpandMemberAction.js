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
function ExpandMemberAction()
{
	this.m_sAction = "ExpandCollapseMember";
	this.m_sExpandCollapseType="ExpandMember";
}

ExpandMemberAction.prototype = new ExpandCollapseMemberAction();
ExpandMemberAction.baseclass = ExpandCollapseMemberAction.prototype;

ExpandMemberAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_EXPAND_MEMBER;
};

ExpandMemberAction.prototype._canEnableMenu = function(oSectionController)
{
	if (!this._isSingleSelection(oSectionController)) {
		return false;
	}
	
	var selObj = this._getFirstSelectedObject(oSectionController);
	if (this._alwaysCanExpandCollapse(selObj)) {
		//Always enable both expand/collapse for hierarchy sets.
		return true;  
	}	
	
	var ctxId = this._getCtxId(selObj);	
	
	var bCanDrillDown = true;
	/**
	 *Use drillabiliy in metadata to safe guard the parent of nested single dimension
	 */
	if( oSectionController.getDrillUpDownEnabled() === true){
		bCanDrillDown = oSectionController.canDrillDown(ctxId);
	}
	
	
	return (bCanDrillDown && this._getCanExpand( selObj ) && !this._isExpanded(selObj) ); 
};
