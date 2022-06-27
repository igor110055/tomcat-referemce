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

 function ChangePaletteAction()
{
	this.m_sAction = "ChangePalette";
	this.m_palette = "";
	this.m_runReport = true;

	this.m_aPaletteNames =  ["Flow", "Classic", "Contemporary",
					 "Contrast", "Corporate", "Dynamic",
					 "Excel", "Excel 2007", "Gradients",
					 "Grey Scale", "Jazz", "Legacy",
					 "Metro", "Mixed", "Modern",
					 "Patterns"];
	this.m_aPaletteIcons =  ["changePaletteFlow", "changePaletteClassic", "changePaletteContemporary",
					 "changePaletteContrast", "changePaletteCorporate", "changePaletteDynamic",
					 "changePaletteExcel", "changePaletteExcel2007", "changePaletteGradients",
					 "changePaletteGreyScale", "changePaletteJazz", "changePaletteLegacy",
					 "changePaletteMetro", "changePaletteMixed", "changePaletteModern",
					 "changePalettePatterns"];
}

ChangePaletteAction.prototype = new ModifyReportAction();
ChangePaletteAction.baseclass = ModifyReportAction.prototype;
ChangePaletteAction.prototype.reuseQuery = function() { return true; };

ChangePaletteAction.prototype.preProcess = function()
{
	// check to see if the report only contains flash charts, if so, we don't need to hit the report service, we can change the palette locally
	this.updateRunReport();
	if (this.m_runReport==false) {
		var flashCharts = this.getLayoutComponents();
		for(var index = 0; index < flashCharts.length; ++index)
		{
			var flashChart = flashCharts[index];
			if(flashChart.getAttribute("flashChart") != null)
			{
				if(this.m_palette == "")
				{
					flashChart.setPalette("Flow");
				}
				else
				{
					flashChart.setPalette(this.m_palette);
				}
			}
		}
	}
};

ChangePaletteAction.prototype.updateRunReport = function()
{
	this.m_runReport=true;
	var reportTable = document.getElementById("rt" + this.m_oCV.getId());
	if(reportTable != null)	{
		var serverSideCharts = getElementsByAttribute(reportTable, "*", "chartcontainer", "true");
		if(serverSideCharts.length == 0) {
			this.m_runReport=false;
		}
	}
};

ChangePaletteAction.prototype.runReport = function()
{
	return this.m_runReport;
};

ChangePaletteAction.prototype.updateInfoBar = function()
{
	return false;
};

ChangePaletteAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_CHANGE_PALETTE;
};

ChangePaletteAction.prototype.setRequestParms = function(palette)
{
	if(typeof palette == "string")
	{
		this.m_palette = palette;
		// Preserve the information on the selected palette in CCognosViewer object for latter retrieval
		// and use in ChangePaletteAction.prototype.updateMenu().
		if (this.m_oCV != null && typeof this.m_oCV != "undefined")
		{
			this.m_oCV.m_sPalette = palette;
		}
	}
};

ChangePaletteAction.prototype.addActionContextAdditionalParms = function()
{
	if(this.m_palette != "")
	{
		return "<name>" + this.m_palette + "</name>";
	}

	return "";
};


ChangePaletteAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	var reportInfo = this.getSelectedReportInfo();

	if (reportInfo != null && reportInfo.displayTypeId.indexOf("Chart") >= 0)
	{
		jsonSpec.disabled = false;
		return jsonSpec;
	}

	jsonSpec.disabled = true;
	return jsonSpec;
};

ChangePaletteAction.reset = function( oCV )
{
	delete (oCV.m_sPalette);
};
