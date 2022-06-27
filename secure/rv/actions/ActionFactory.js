/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ActionFactory(cognosViewer)
{
	this.m_cognosViewer = cognosViewer;
}

ActionFactory.prototype.load = function(sAction)
{
	this.m_cognosViewer.loadExtra();
	var action = null;
	try
	{
		var sClass = sAction + "Action";
		action = eval("(typeof "+ sClass + "=='function'? new " + sClass + "():null);");
		if (action) {
			action.setCognosViewer(this.m_cognosViewer);
		}
	}
	catch(exception)
	{
		action = null;
	}

	return action;
};

function ActionFactory_loadActionHandler(evt, cognosViewer)
{
	var ctxNode = getCtxNodeFromEvent(evt);
	var selectionController = cognosViewer.getSelectionController();

	var action = null;

	if(ctxNode !== null)
	{
		var ctxValue = ctxNode.getAttribute("ctx");
		ctxValue = ctxValue.split("::")[0].split(":")[0];

		var descriptionNode = ctxNode.getAttribute("type") != null ? ctxNode : ctxNode.parentNode;
		var type = descriptionNode.getAttribute("type");

		switch(type)
		{
			case "columnTitle":
				var hasAuthoredDrillTargets = (ctxNode.getAttribute("dttargets")!=null);
				//List titles and Measure/calculation-on-edge crosstabs/charts (no muns) aren't drillable.
				var canDrillUpDown = (descriptionNode.getAttribute("CTNM") != null && selectionController.getMun(ctxValue) != ""
										&& selectionController.getUsageInfo(ctxValue)!='2');
				if (hasAuthoredDrillTargets || canDrillUpDown) {
					action = cognosViewer.getAction("DrillUpDownOrThrough");
					action.init(hasAuthoredDrillTargets, canDrillUpDown);
					action.updateDrillabilityInfo(cognosViewer, ctxNode);
				}
				else
				{
					action = cognosViewer.getAction("RenameDataItem");
				}
				break;
			case "datavalue":
			case "chartElement":
			case "ordinalAxisLabel":
			case "legendLabel":
			case "legendTitle":
			case "ordinalAxisTitle":
				var hasAuthoredDrillTargets = (ctxNode.getAttribute("dttargets")!=null);
				//All dimensional data value selections (even measures/calcs) should be considered for drillability since they 
				//are proxies to the inner edges (other entities aren't renamable or drillable)
				var canDrillUpDown = (selectionController.getHun(ctxValue) != "");
				if (hasAuthoredDrillTargets || canDrillUpDown) {
					action = cognosViewer.getAction("DrillUpDownOrThrough");
					action.init(hasAuthoredDrillTargets, canDrillUpDown);					
					action.updateDrillabilityInfo(cognosViewer, ctxNode);
				}
				break;
		}
	}

	if(action === null)
	{
		action = cognosViewer.getAction("Selection");
	}

	action.setCognosViewer(cognosViewer);

	return action;
}

ActionFactory.prototype.destroy = function()
{
	delete this.m_cognosViewer;
}