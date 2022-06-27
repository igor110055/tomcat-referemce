/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * GlossaryAction - implements IBM business glossary in cognos viewer
 */
function GlossaryAction(){}
GlossaryAction.prototype = new CognosViewerAction();

/**
 * Execute the IBM business glossary request
 */
GlossaryAction.prototype.execute = function()
{
	var cognosViewer = this.getCognosViewer();
	cognosViewer.loadExtra();
	var selectionController = cognosViewer.getSelectionController();
	var selectionList = selectionController.getAllSelectedObjects();

	if(selectionList.length > 0)
	{
		var config = null;
		if(typeof MDSRV_CognosConfiguration != "undefined")
		{
			config = new MDSRV_CognosConfiguration();

			var glossaryURI = "";
			if(cognosViewer.envParams["glossaryURI"])
			{
				glossaryURI = cognosViewer.envParams["glossaryURI"];
			}

			config.addProperty("glossaryURI", glossaryURI);
			config.addProperty("gatewayURI", cognosViewer.getGateway());
		}

		var searchPath = cognosViewer.envParams["ui.object"];
		var sSelectionContext = getViewerSelectionContext(selectionController, new CSelectionContext(searchPath));

		var glossaryHelper = new MDSRV_BusinessGlossary(config, sSelectionContext);
		glossaryHelper.open();
	}
};

GlossaryAction.prototype.updateMenu = function(jsonSpec)
{
	if (!this.getCognosViewer().bCanUseGlossary) {
		return "";
	}

	var bContext = this.selectionHasContext();

	if (!bContext || this.getCognosViewer().envParams["glossaryURI"] == null || this.getCognosViewer().envParams["glossaryURI"] == "")
	{
		jsonSpec.disabled = true;
	}
	else
	{
		jsonSpec.disabled = false;
	}
	return jsonSpec;
};
