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

function GotoAction(){}
GotoAction.prototype = new CognosViewerAction();

GotoAction.prototype.execute = function()
{
	var drillManager = this.m_oCV.getDrillMgr();
	drillManager.launchGoToPage();
};

GotoAction.prototype.updateMenu = function(jsonSpec)
{
	var items = [];

	var drillTargetSpecifications = this.m_oCV.getDrillTargets();
	var drillManager = this.m_oCV.getDrillMgr();
	var aAuthoredDrillThroughTargets = drillManager.getAuthoredDrillThroughTargets();

	if(aAuthoredDrillThroughTargets.length > 0)
	{
		var sAuthoredDrillThroughTargets = "<AuthoredDrillTargets>";

		for(var iIndex = 0; iIndex < aAuthoredDrillThroughTargets.length; ++iIndex)
		{
			sAuthoredDrillThroughTargets +=  eval('"' + aAuthoredDrillThroughTargets[iIndex] + '"');
		}

		sAuthoredDrillThroughTargets += "</AuthoredDrillTargets>";

		var authoredDrillAction = this.m_oCV.getAction("AuthoredDrill");

		var rvDrillTargetsNode = authoredDrillAction.getAuthoredDrillThroughContext(sAuthoredDrillThroughTargets, drillTargetSpecifications);

		var drillTargets = rvDrillTargetsNode.childNodes;
		if(drillTargets.length > 0)
		{
			for(var index = 0; index < drillTargets.length; ++index)
			{
				var drillTarget = drillTargets[index];

				var sIconClass = this.getTargetReportIconClass(drillTarget);

				var sLabel = drillTarget.getAttribute("label");
				items.push({ name: "AuthoredDrill", label: sLabel, iconClass: sIconClass, action: { name: "AuthoredDrill", payload: XMLBuilderSerializeNode(drillTarget) }, items: null });
			}
		}
	}

	if(items.length > 0)
	{
		items.push({separator: true});
	}

	// related links
	var relatedDisabled = false;
	if(this.m_oCV.getSelectionController() == null || this.m_oCV.getSelectionController().getModelDrillThroughEnabled() == false)
	{
		relatedDisabled = true;
	}

	items.push({ name: "Goto", disabled: relatedDisabled, label: RV_RES.RV_MORE, iconClass: "", action: { name: "Goto", payload: "" }, items: null });

	if (this.m_oCV.isIWidgetMobile()) {
		jsonSpec.flatten = "true";
	}
	
	jsonSpec.items = items;
	return jsonSpec;
};

GotoAction.prototype.getTargetReportIconClass = function(drillTarget)
{
	var sIconClass = "";

	var sMethod = drillTarget.getAttribute("method");
	switch(sMethod)
	{
		case "edit":
			sIconClass = "editContent";
			break;
		case "execute":
			sIconClass = "runReport"; //"/ps/portal/images/action_run.gif";
			break;
		case "view":
			var sOutputFormat = drillTarget.getAttribute("outputFormat");

			switch(sOutputFormat)
			{
				case "HTML":
				case "XHTML":
				case "HTMLFragment":
					sIconClass = "html";
					break;
				case "PDF":
					sIconClass = "pdf";
					break;
				case "XML":
					sIconClass = "xml";
					break;
				case "CSV":
					sIconClass = "csv";
					break;
				case "XLS":
					sIconClass = "excel2000";
					break;
				case "SingleXLS":
					sIconClass = "excelSingleSheet";
					break;
				case "XLWA":
					sIconClass = "excel2002";
					break;
				case "spreadsheetML":
					sIconClass = "excel2007";
					break;
				case "xlsxData":
					sIconClass = "excel2007";
					break;
			}
			break;
	}

	return sIconClass;
};