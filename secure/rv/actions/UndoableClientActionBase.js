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

function UndoableClientActionBase() {}
UndoableClientActionBase.prototype = new CognosViewerAction();

UndoableClientActionBase.prototype.setContainerId = function(containerId)
{
	this.m_sContainerId = containerId;
};

UndoableClientActionBase.prototype.doRedo = function(containerId)
{
	this.setContainerId(containerId)
	this.execute();
};

UndoableClientActionBase.prototype.doUndo = function(containerId)
{
	factory = this.getCognosViewer().getActionFactory();
	var unfreezeAction = factory.load(this.getUndoClass());
	unfreezeAction.setContainerId(containerId);
	unfreezeAction.execute();
};

/**
 * return the container id of the selected container (without namespace)
 */
UndoableClientActionBase.prototype.getSelectedContainerId = function()
{
	var selectedObjects = this.m_oCV.getSelectionController().getAllSelectedObjects();
	if (selectedObjects && selectedObjects.length) {
		var lid=selectedObjects[0].getLayoutElementId();
		if (lid) {
			return this.removeNamespace(lid);
		}
	}
	return null;
};
