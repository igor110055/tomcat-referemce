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

function UndoRedoAction(){}
UndoRedoAction.prototype = new CognosViewerAction();

UndoRedoAction.prototype.dispatchRequest = function(filters, action)
{
	var cognosViewerRequest = null;
	var undoObj = null;
	var undoRedoQueue = this.getUndoRedoQueue();

	if (action == "Undo")
	{
		undoObj = undoRedoQueue.moveBack();
	}
	else
	{
		undoObj = undoRedoQueue.moveForward();
	}

	if (action == "Undo" && undoObj && undoObj.undoCallback) {
		undoObj.undoCallback();
		this.getCognosViewer().getViewerWidget().updateToolbar();	
	} 
	else if (action == "Redo" && undoObj && undoObj.redoCallback) {
		undoObj.redoCallback();	
		this.getCognosViewer().getViewerWidget().updateToolbar();
	}
	else 
	{
		var widgetProperties = this.getCognosViewer().getViewerWidget().getProperties();
	
		if (widgetProperties && undoObj.widgetProperties)
		{
			widgetProperties.doUndo(undoObj.widgetProperties);
		}
	
		var cognosViewerRequest = new ViewerDispatcherEntry(this.getCognosViewer());
		
		if (typeof undoObj.spec != "undefined")
		{
			cognosViewerRequest.addFormField("ui.action", "undoRedo");
			cognosViewerRequest.addFormField("ui.spec", undoObj.spec);
			cognosViewerRequest.addFormField("executionParameters", undoObj.parameters);
		}
		else
		{
			cognosViewerRequest.addFormField("ui.action", "undoRedo");
			cognosViewerRequest.addFormField("ui.conversation", undoObj.conversation);
		}
	
		if (typeof undoObj.hasAVSChart != "undefined")
		{
			cognosViewerRequest.addFormField("hasAVSChart", undoObj.hasAVSChart);
		}
	
		if (widgetProperties && widgetProperties.getRowsPerPage() != null) {
			cognosViewerRequest.addFormField( "run.verticalElements", widgetProperties.getRowsPerPage() );
		}
	
		if(filters != "")
		{
			cognosViewerRequest.addFormField("cv.updateDataFilters", filters);
		}
	
		if (typeof undoObj.infoBar == "string")
		{
			cognosViewerRequest.addFormField("rap.reportInfo", undoObj.infoBar);
		}
		else
		{
			cognosViewerRequest.addFormField("rap.reportInfo", "{}");
		}
	
		cognosViewerRequest.addFormField("run.prompt", "false");
	
		cognosViewerRequest.setCallbacks( {
			"closeErrorDlg" : {"object" : undoRedoQueue, "method" : undoRedoQueue.handleCancel}
		});	
		
		this.getCognosViewer().dispatchRequest(cognosViewerRequest);
	}
	
	this.fireModifiedReportEvent();
};

UndoRedoAction.prototype.execute = function()
{
	this.gatherFilterInfoBeforeAction(this.m_sAction);
};
