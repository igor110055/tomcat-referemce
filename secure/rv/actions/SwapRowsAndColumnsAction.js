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
function SwapRowsAndColumnsAction()
{
	this.m_sAction = "SwapRowsAndColumns";

}
SwapRowsAndColumnsAction.prototype = new ModifyReportAction();

SwapRowsAndColumnsAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_SWAP_ROWS_AND_COLUMNS;
};

/**
 * List of display types that do not support SwapRowsAndColumns
 */
SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported = {
	winLossChart : true,
	progressiveChart : true,
	list : true
};

SwapRowsAndColumnsAction.prototype.canSwap = function()
{

	if( this.reportHasOneObjectOnly())
	{
		return this.isCurrentObject_singlePart_SupportedChartOrCrosstab();
	}
	else
	{
		return this.isSelectedObject_SupportedChartOrCrosstab();
	}

};

SwapRowsAndColumnsAction.prototype.reportHasOneObjectOnly = function()
{
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
	if (oRAPReportInfo) {
		return ( oRAPReportInfo.getContainerCount() == 1 );
	}
	
	return false;
};

SwapRowsAndColumnsAction.prototype.isSelectedObject_SupportedChartOrCrosstab = function()
{

	var reportInfo = this.getSelectedReportInfo();
	return (reportInfo && !SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported[reportInfo.displayTypeId]);

};

SwapRowsAndColumnsAction.prototype.isCurrentObject_singlePart_SupportedChartOrCrosstab = function()
{
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
	if (oRAPReportInfo) {
		if (oRAPReportInfo.getContainerCount() === 1) {
			var displayTypeId = oRAPReportInfo.getContainerFromPos(0).displayTypeId;
			if (displayTypeId && !SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported[ displayTypeId ] ) {
				return true;
			}
		}
	}
	return false;
};

SwapRowsAndColumnsAction.prototype.keepRAPCache = function()
{
	return false;
};

SwapRowsAndColumnsAction.prototype.updateMenu = function(jsonSpec)
{
	jsonSpec.visible = this.ifContainsInteractiveDataContainer();
	if (! jsonSpec.visible)
	{
		return jsonSpec;
	}

	jsonSpec.disabled = !this.canSwap();
	jsonSpec.iconClass = jsonSpec.disabled ? 'disabledSwap' : 'swap';
	return jsonSpec;
};

