/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */


/**
 * Base class for interactive report actions
 */
function ModifyReportAction() {
	this.m_reuseConversation = true;
}
ModifyReportAction.prototype = new CognosViewerAction();

ModifyReportAction.prototype.addActionContextAdditionalParms = function() {};
ModifyReportAction.prototype.runReport = function() { return true; };
ModifyReportAction.prototype.updateRunReport = function() {};
ModifyReportAction.prototype.reuseQuery = function() { return false; };
ModifyReportAction.prototype.reuseGetParameter = function() {return true; };
ModifyReportAction.prototype.reuseConversation = function(reuseConversation) {
	if (typeof reuseConversation != "undefined") {
		this.m_reuseConversation = reuseConversation;
	}
	return this.m_reuseConversation;
};
ModifyReportAction.prototype.updateInfoBar = function() { return true; };
ModifyReportAction.prototype.getUndoHint = function() { return ""; };
ModifyReportAction.prototype.isUndoable = function() { return true; };
ModifyReportAction.prototype.saveSpecForUndo = function() { return false; };
ModifyReportAction.prototype.keepFocusOnWidget = function() { return true; };
ModifyReportAction.prototype.keepRAPCache = function() { return true; };
ModifyReportAction.prototype.getActionKey = function() { return null; };
ModifyReportAction.prototype.canBeQueued = function() { return false; };
ModifyReportAction.prototype.getPromptOption = function() { return "false"; };

ModifyReportAction.prototype.createActionDispatcherEntry = function()
{
	var actionDispatcherEntry = new ModifyReportDispatcherEntry(this.m_oCV);
	actionDispatcherEntry.initializeAction(this);
	return actionDispatcherEntry;
};

ModifyReportAction.prototype.isSelectSingleMember = function(selectedObject)
{
	var oRAPReportInfo = this.m_oCV.getRAPReportInfo();
	var dataItems = selectedObject.getDataItems();
	if (oRAPReportInfo && dataItems.length > 0) {
		var containerId = this.getContainerId(this.m_oCV.getSelectionController());
		var itemInfo = oRAPReportInfo.getItemInfo(containerId, dataItems[0][0]);
		if (itemInfo.single =="true") {
			return true;
		}		
	}

	return false;
};


ModifyReportAction.prototype.execute = function() {
	var oCV = this.getCognosViewer();
	oCV.setKeepFocus(this.keepFocusOnWidget());
	this.updateRunReport();	
	if (this.runReport() == true) {
		var actionDispatcherEntry = this.createActionDispatcherEntry();
		this.addAdditionalOptions(actionDispatcherEntry);
		oCV.dispatchRequest(actionDispatcherEntry);
	}
	else {
		var cognosViewerRequest = this.createCognosViewerDispatcherEntry( "modifyReport" );	
		cognosViewerRequest.setCallbacks({"complete":{"object":this, "method":this.updateReportSpecCallback}});
		oCV.dispatchRequest(cognosViewerRequest);
	}	

	this.fireModifiedReportEvent();
};

ModifyReportAction.prototype.updateReportSpecCallback = function(oAsynchDataResposne) {
	var state = oAsynchDataResposne.getResponseState();
	var requestHanlder = new RequestHandler(this.m_oCV);
	requestHanlder.updateViewerState(state);

	// we'd sometimes add 2 items into the undo stack. One from the onclick and one from
	// the onblur. Make sure we only add one item to the undo stack
	if (!this.m_bUndoAdded)
	{
		this.m_bUndoAdded = true;
		var oUndoRedoQueue = this.getUndoRedoQueue();
		if(oUndoRedoQueue) {
			oUndoRedoQueue.initUndoObj({"tooltip" : this.getUndoHint(), "saveSpec" : true});
			oUndoRedoQueue.add({"reportUpdated": true});
		}
		var oWidget = this.getCognosViewer().getViewerWidget();
		if(oWidget) {
			oWidget.updateToolbar();
		}
	}
};

/**
 * Builds the action context needed for the modifyReport action
 */
ModifyReportAction.prototype.addActionContext = function() {

	var actionContext = "<reportActions";

	if(this.runReport() == false)
	{
		actionContext += " run=\"false\"";
	}

	actionContext += ">";

	actionContext += this.getReportActionContext();

	actionContext += "</reportActions>";

	return actionContext;
};


ModifyReportAction.prototype.getReportActionContext = function()
{
	var cognosViewer = this.getCognosViewer();
	var selectionController = cognosViewer.getSelectionController();
	
	var actionContext = "<" + this.m_sAction + ">";
	var containerId = this.getContainerId(selectionController);
	if(containerId != "")
	{
		actionContext += "<id>" + xml_encode(containerId) + "</id>";
	}
	
	actionContext += this.getRTStateInfo();

	actionContext += this.getSelectionContext();

	var sAdditionalParms = this.addActionContextAdditionalParms();
	if( sAdditionalParms != null && sAdditionalParms != "undefined")
	{
		actionContext += sAdditionalParms;
	}


	actionContext += "</" + this.m_sAction + ">";

	if(this.updateInfoBar())
	{
		actionContext += this.getGetInfoActionContext();
	}
	
	return actionContext;
};

ModifyReportAction.prototype.getGetInfoActionContext = function()
{
	return "<GetInfo/>";
};

/*Get widget run time information, such as dashboard object title, search path, etc*/
ModifyReportAction.prototype.getRTStateInfo = function()
{
	var oWidget = this.getCognosViewer().getViewerWidget();	
	if(oWidget && oWidget.getBUXRTStateInfoMap){		
		var oInfoMap = oWidget.getBUXRTStateInfoMap();
		return oInfoMap ? oInfoMap : "";
	}
	return "";
};

ModifyReportAction.prototype.createEmptyMenuItem = function()
{
	// Temporary UI String
	return { name: "None", label: "(empty)", iconClass: "", action: null, items: null };
};

ModifyReportAction.prototype.getStateFromResponse = function(oResponse)
{
	var oResponseState = null;
	if( oResponse && typeof oResponse != "undefined" && oResponse.responseText && typeof oResponse.responseText != "undefined" && oResponse.responseText.length > 0 )
	{
		var responseXML = XMLBuilderLoadXMLFromString(oResponse.responseText);
		var stateData = responseXML.getElementsByTagName("state");
		if (stateData != null && stateData.length > 0)
		{
			try {
				if (typeof stateData[0].text != "undefined")
				{
					oResponseState = eval("(" + stateData[0].text + ")");
				}
				else
				{
					oResponseState = eval("(" + stateData[0].textContent + ")");
				}
			}
			catch(e) {
				if (typeof console != "undefined" && console && console.log) {
					console.log(e);
				}
			}
		}
	}
	return oResponseState;
};


ModifyReportAction.prototype.getSelectedCellTags = function()
{
	var params = "";
	var selectionObjects = this.getCognosViewer().getSelectionController().getSelections();
	for (var i = 0; i < selectionObjects.length; ++i)
	{
		var cellRef = selectionObjects[i].getCellRef();
		var sDataItem = selectionObjects[i].getDataItems()[0];
		if (typeof sDataItem == "undefined" || sDataItem == null)
		{
			sDataItem = "";
		}
		var tag = this.getRAPLayoutTag(cellRef);
		if (tag != null)
		{
				params += "<tag><tagValue>" + xml_encode(tag)  + "</tagValue><dataItem>" + xml_encode(sDataItem) + "</dataItem></tag>";
		}
		else
		{
			params += "<tag><tagValue/><dataItem>" + xml_encode(sDataItem) + "</dataItem></tag>";
		}
	}
	if (params != "") {
		params = "<selectedCellTags>" + params + "</selectedCellTags>";
	}
	return params;

};

ModifyReportAction.prototype.getIsNumericFromReportInfo = function(refDataItem)
{
	var containerInfo = this.getSelectedReportInfo();
	if (containerInfo != null && typeof containerInfo.itemInfo!="undefined")
	{
		//This container has filters....does it filter this item?
		for (var item = 0; item < containerInfo.itemInfo.length; ++item)
		{
			if (refDataItem == containerInfo.itemInfo[item].item &&
				typeof containerInfo.itemInfo[item].numeric != "undefined") {
				return (containerInfo.itemInfo[item].numeric == "true");
			}
		}
	}
	return false;
};
