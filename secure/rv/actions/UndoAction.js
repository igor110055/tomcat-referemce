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

function UndoAction()
{
	this.m_sAction = "Undo";
}
UndoAction.prototype = new UndoRedoAction();

UndoAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.getCognosViewer().isLimitedInteractiveMode() ? true : this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	if (this.getUndoRedoQueue().getPosition() > 0)
	{
		jsonSpec.iconClass = "undo";
		jsonSpec.disabled = false;
	}
	else
	{
		jsonSpec.iconClass = "undoDisabled";
		jsonSpec.disabled = true;
	}

	jsonSpec.label = this.getUndoRedoQueue().getUndoTooltip();

	return jsonSpec;
};
