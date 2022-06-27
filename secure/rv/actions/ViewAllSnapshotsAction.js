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

function ViewAllSnapshotsAction(){}
ViewAllSnapshotsAction.prototype = new SnapshotsAction();

ViewAllSnapshotsAction.prototype.updateMenu = function(jsonSpec) {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	
	if (widget.m_bNoSavedOutputs == true) {
		jsonSpec.disabled = true;
	}
	return jsonSpec;
};

ViewAllSnapshotsAction.prototype.execute = function() {
	if (!this.getCognosViewer().getViewerWidget().getSavedOutputsCMResponse()) {
		this.queryCMForSavedOutputs({"complete" : {"object" : this, "method" : this.handleQueryResponse}});
	}
	else {
		this.showDialog();
	}
};

ViewAllSnapshotsAction.prototype.handleQueryResponse = function(response) {
	this.setSavedOutputsCMResponse(response);
	this.showDialog();	
};

ViewAllSnapshotsAction.prototype.showDialog = function() {
	var oCV = this.getCognosViewer();
	var widget = oCV.getViewerWidget();
	var cmResponse = widget.getSavedOutputsCMResponse();
	var queryResult = null;
	var queryItems = null;
	
	if (cmResponse) {
		queryResult = XMLHelper_FindChildByTagName(cmResponse, "result", true);
		if (queryResult) {
			queryItems = XMLHelper_FindChildrenByTagName(queryResult, "item", false);			
		}
	}
	
	if (!cmResponse || !queryItems || queryItems.length == 0) {
		widget.m_bNoSavedOutputs = true;
		var warningDialog = new WarningMessageDialog(oCV, RV_RES.IDS_JS_NO_SAVED_OUTPUTS);
		warningDialog.renderInlineDialog();		
		//widget.showErrorMessage(RV_RES.IDS_JS_NO_SAVED_OUTPUTS);
	}
	else {
		var cognosViewerObjectString = getCognosViewerObjectString(this.m_oCV.getId());
	
		var menuItemString = RV_RES.IDS_JS_SELECT_SNAPSHOT_DIALOG_TITLE;
		var enterNumberLabel = RV_RES.IDS_JS_SELECT_SNAPSHOT_DIALOG_DESC;
		var creationTime = this.getCognosViewer().envParams["creationTime"];
	
		this.selectSnapshotDialog = new viewer.dialogs.SelectSnapshot({
			sTitle:menuItemString,
			sLabel:enterNumberLabel,
			cmResponse:cmResponse,
			currentSnapshotCreationTime: creationTime,
			okHandler: function(sStoreID, sCreationTime)
			{
				window[cognosViewerObjectString].executeAction("ViewSavedOutput", {obj:sStoreID, creationTime: sCreationTime});
			},
			cancelHandler: function() {}
		});
		this.selectSnapshotDialog.startup();
		this.selectSnapshotDialog.show();
	}
};