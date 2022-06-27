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
function DeleteAction()
{
	this.m_sAction = "Delete";
}
DeleteAction.prototype = new ModifyReportAction();
DeleteAction.baseclass = ModifyReportAction.prototype;

DeleteAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_DELETE;
};

DeleteAction.prototype.canDelete = function()
{
	if(!this.m_oCV.isLimitedInteractiveMode()) {
		var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
		if (selectedObjects.length>0) {
			for (var i=0; i<selectedObjects.length; ++i) {
				var selObj=selectedObjects[i];
				var cellRef=selObj.getCellRef();
	
				if( !selObj.hasContextInformation() || selObj.isHomeCell() ||
					(selObj.getLayoutType() != 'columnTitle' && selObj.getDataContainerType() != 'list' ) ||
					cellRef.getAttribute("cc") == "true") {
					return false;
				}
			}
			return true;
		}
	}
	return false;
};

DeleteAction.prototype.execute = function() {
	DeleteAction.baseclass.execute.call(this);
	//While the server is working, clear the selection and rebuild the
	//context menu so that users won't be able to see commands from
	//the deleted selection. (COGCQ00252407).
	this.m_oCV.getSelectionController().clearSelectionData();
	this.m_oCV.getViewerWidget().onContextMenu(null);
};

DeleteAction.prototype.keepRAPCache = function()
{
	return false;
};

DeleteAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	jsonSpec.disabled = !this.canDelete();
	return jsonSpec;
};

DeleteAction.prototype.addActionContextAdditionalParms = function()
{
	return this.getSelectedCellTags();
};
