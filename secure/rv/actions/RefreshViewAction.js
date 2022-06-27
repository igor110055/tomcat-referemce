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

/**
 * This is the base class for refreshing the report. It'll get the latest
 * saved output or rerun the report if there's no saved output
 */
function RefreshViewAction()
{
	this.m_bCanvasRefreshEvent = false;
}
RefreshViewAction.prototype = new CognosViewerAction();

RefreshViewAction.prototype.addCommonOptions = function(oRequest)
{
	// removed the cache CM response about the saved outputs. This will
	// force the Snapshots menu to get updated
	var widget = this.getCognosViewer().getViewerWidget();

	if (this.m_bCanvasRefreshEvent && widget.getSavedOutputSearchPath() != null)
	{
		oRequest.addFormField("ui.savedOutputSearchPath", encodeURIComponent(widget.getSavedOutputSearchPath()));
	}
	else
	{
		widget.setSavedOutputsCMResponse(null);
		widget.setSavedOutputSearchPath(null);
	}

	oRequest.addFormField("run.outputFormat", "HTML");

	// need since we might be going from saved output to live if the saved output is no longer available
	oRequest.addFormField("widget.reloadToolbar", "true");

	// Clear the properties dialog to it'll get rebuilt. This is needed for the 'View report specification' link in
	// case we go from saved output to live during the refresh operation
	widget.clearPropertiesDialog();

	var formWarpRequest = document.getElementById("formWarpRequest" + this.getCognosViewer().getId());
	oRequest.addFormField("ui.object", formWarpRequest["reRunObj"].value);
};

RefreshViewAction.prototype.execute = function()
{
	var oRequest = this.createCognosViewerDispatcherEntry( "buxDropReportOnCanvas" );

	this.addCommonOptions(oRequest);

	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	
	if (oCV.getCurrentlySelectedTab() && widget.getSavedOutput()) {
		oCV.setKeepTabSelected(oCV.getCurrentlySelectedTab());
	}
	
	this.getCognosViewer().dispatchRequest(oRequest);
};

RefreshViewAction.prototype.doAddActionContext = function()
{
	return false;
};

RefreshViewAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.disabled = false;
	var oCV = this.getCognosViewer();
	if( oCV )
	{
		var widget = oCV.getViewerWidget();
		if( widget && widget.getSavedOutputSearchPath() != null)
		{
			jsonSpec.disabled = true;
		}

	}
	return jsonSpec;
};
