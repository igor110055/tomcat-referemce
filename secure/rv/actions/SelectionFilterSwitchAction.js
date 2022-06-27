/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function SelectionFilterSwitchAction()
{
	this.m_sAction = "SelectionFilterSwitch";
}

SelectionFilterSwitchAction.prototype = new CognosViewerAction();

SelectionFilterSwitchAction.prototype.updateMenu = function(jsonSpec)
{	
	//jsonSpec.visible = true;
	if (this.getCognosViewer().getViewerWidget().isSelectionFilterEnabled())
	{
		jsonSpec.disabled = false;
		jsonSpec.checked = true;
		jsonSpec.iconClass = 'selectionFilterEnabled';
		jsonSpec.label = RV_RES.IDS_JS_SELECTION_FILTER_SWITCH_DISABLE;
	}
	else
	{
		jsonSpec.disabled = false;
		jsonSpec.checked = false;
		jsonSpec.iconClass = 'selectionFilter';
		jsonSpec.label = RV_RES.IDS_JS_SELECTION_FILTER_SWITCH;
	}

	return jsonSpec;
};

SelectionFilterSwitchAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();
	var oVWidget = oCV.getViewerWidget();
	
	var oldSwitch = oVWidget.isSelectionFilterEnabled();
	
	// Turning off, so we need to clear the filters before we actually flip the switch in our code
	// since our code checks the boolean before sending the event
	if (oldSwitch) {
		if (oVWidget.selectionFilterSent()) {
			oVWidget.clearSelectionFilter();
		}
	} 
	
	oVWidget.toggleSelectionFilterSwitch();
	oVWidget.updateToolbar();
	oVWidget.onContextMenu({}); //Populates context menu payload with correct state. 

	// Turning on
	if (!oldSwitch) {
		if (oVWidget.somethingSelected()) {
			oVWidget.broadcastSelectionFilter();
		}
	}
	
	oVWidget.updateDrillThroughLinks();
	oVWidget.fireEvent("com.ibm.bux.widget.modified", null, {'modified':true});
};