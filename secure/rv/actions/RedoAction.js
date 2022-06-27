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

function RedoAction()
{
	this.m_sAction = "Redo";
}
RedoAction.prototype = new UndoRedoAction();

RedoAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.getCognosViewer().isLimitedInteractiveMode() ? true : this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	if (this.getUndoRedoQueue().getPosition() < (this.getUndoRedoQueue().getLength()-1))
	{
		jsonSpec.iconClass = "redo";
		jsonSpec.disabled = false;
	}
	else
	{
		jsonSpec.iconClass = "redoDisabled";
		jsonSpec.disabled = true;
	}

	jsonSpec.label = this.getUndoRedoQueue().getRedoTooltip();

	return jsonSpec;
};
