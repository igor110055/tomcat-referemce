/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function ExpandCollapseMemberAction()
{
	this.m_sAction = "ExpandCollapseMember";
	this.m_sExpandCollapseType=null;
	this.m_RAPReportInfo = null;
	this.m_itemInfo = null;
	this.m_sPreviousDataItem = null;

}
ExpandCollapseMemberAction.prototype = new ModifyReportAction();
ExpandCollapseMemberAction.baseclass = ModifyReportAction.prototype;


ExpandCollapseMemberAction.prototype._getCanExpand = function(oSelectionObject)
{
	var itemInfo = this._getItemInfo( oSelectionObject );
	return ( itemInfo && itemInfo.canExpand );
};

ExpandCollapseMemberAction.prototype._isExpanded = function(oSelectionObject)
{	
	var sMUN = this._getSelectedMUN(oSelectionObject);
	if( !sMUN )
	{
		return false;
	}
	var itemInfo = this._getItemInfo( oSelectionObject );
	return ( itemInfo && itemInfo.expandedMembers && itemInfo.expandedMembers[sMUN] === true );	
};

ExpandCollapseMemberAction.prototype._getSelectedMUN = function( oSelectionObject )
{
	var sMun = null;

	var aMuns = oSelectionObject.getMuns();
	if (aMuns && aMuns.length>0 && aMuns[0].length>0) {
		sMun = aMuns[0][0];
	}

	return sMun;
};

ExpandCollapseMemberAction.prototype._getDataItem = function( oSelectionObject )
{
	if (!oSelectionObject) {
		return null;
	}
	
	var sDataItemName = null;
	var aDataItems = oSelectionObject.getDataItems();
	if (aDataItems && aDataItems.length>0 && aDataItems[0].length>0) {
		sDataItemName = aDataItems[0][0]; 
	}
		
	return sDataItemName;
};

ExpandCollapseMemberAction.prototype._getItemInfo = function(selObj)
{
	var sDataItem= this._getDataItem(selObj);
	if (!sDataItem ) {
		return null;
	}
	
	var sContainerLID = this.removeNamespace( selObj.getLayoutElementId() );
	this.m_RAPReportInfo = this.m_oCV.getRAPReportInfo();
	this.m_itemInfo = this.m_RAPReportInfo.getItemInfo( sContainerLID, sDataItem );
	this.m_sPreviousDataItem = sDataItem;
	
	return this.m_itemInfo;
};

ExpandCollapseMemberAction.prototype._alwaysCanExpandCollapse = function(selObj)
{
	var itemInfo = this._getItemInfo(selObj);
	return ( itemInfo && itemInfo.alwaysCanExpandCollapse );
};

ExpandCollapseMemberAction.prototype._canShowMenu = function(oSectionController)
{
	var selObj = this._getFirstSelectedObject(oSectionController);
	
	return (selObj  && this._hasMUN(selObj) && this._isCrosstab(selObj) && this._isOnEdge(selObj) && !oSectionController.areSelectionsMeasureOrCalculation());
};

ExpandCollapseMemberAction.prototype._getCtxId = function(selObj)
{
	var cellRef = selObj.getCellRef();
	if (cellRef && cellRef.getAttribute) {
		var ctxValue = cellRef.getAttribute("ctx");
		if (ctxValue) {
			ctxValue = ctxValue.split("::")[0].split(":")[0];
			return ctxValue;
		}
	}	
	return "";
};

ExpandCollapseMemberAction.prototype._hasMUN = function(selObj)
{
	var aMuns = selObj.getMuns();
	return aMuns.length>0 ? true : false; 
};

ExpandCollapseMemberAction.prototype._isCrosstab = function(selObj)
{
	return selObj.getDataContainerType() === 'crosstab' ? true : false;
};

ExpandCollapseMemberAction.prototype._isOnEdge = function(selObj)
{
	return selObj.getLayoutType() === 'columnTitle' ? true : false;
};

ExpandCollapseMemberAction.prototype.keepRAPCache = function()
{
	return false;
};

ExpandCollapseMemberAction.prototype.updateMenu = function(jsonSpec)
{
	var oSectionController = this.m_oCV.getSelectionController();
	
	jsonSpec.visible = this._canShowMenu(oSectionController);
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}
	
	jsonSpec.disabled = !this._canEnableMenu(oSectionController);
	return jsonSpec;
};

ExpandCollapseMemberAction.prototype._canEnableMenu = function(oSectionController) {return true;};

ExpandCollapseMemberAction.prototype._getFirstSelectedObject = function(oSectionController)
{
	var selectedObjects = oSectionController.getAllSelectedObjects();
	if (selectedObjects.length>0) { 
		return selectedObjects[0]; //use the first object
	}
	return null;
};

ExpandCollapseMemberAction.prototype._isSingleSelection = function(oSectionController)
{
	var selectedObjects = oSectionController.getAllSelectedObjects();
	return (selectedObjects.length === 1); 
};

ExpandCollapseMemberAction.prototype.addActionContextAdditionalParms = function()
{
	var oSelectionController = this.getCognosViewer().getSelectionController();
	var selObj = this._getFirstSelectedObject(oSelectionController);
	var sPUN = oSelectionController.getPun(this._getCtxId(selObj))
	if( sPUN )
	{
		sPUN = "<PUN>" + sXmlEncode(sPUN) + "</PUN>";
	}
	var sType="";
	if (this.m_sExpandCollapseType) {
		//For now, ExpandMember or CollapseMember
		sType = "<ExpandCollapseType>" + this.m_sExpandCollapseType + "</ExpandCollapseType>";
	}
	
	return this.getSelectedCellTags() + sPUN + sType;
};
