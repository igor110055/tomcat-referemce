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
dojo.provide("bux.dialogs.SelectSnapshot");

dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");

dojo.declare("viewer.dialogs.SelectSnapshot", bux.dialogs.BaseCustomContentDialog, {
	sTitle: null,
	sLabel: null, /*String the lablel of the calculation  dialog*/
	okHandler: null, /*Function?*/
	cancelHandler:null, /*Function?*/

	startup: function() {
		this.updateTitle(this.sTitle);
		this.inherited(arguments);
		var tableContainer = new bux.layout.TableContainer({
			// TODO remove this class
			classname: "bux-InformationDialog"
		},this.contentContainer);

		var row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});
		var cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-label",
			parentContainer: row
		});

		this.createSnapshotsControl();

		var _label = document.createElement("label");
		_label.appendChild(document.createTextNode(this.sLabel));
		_label.setAttribute("for", this._snapshots.id);
		cell.addContent(_label);

		row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});
		cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-field",
			parentContainer: row
		});
		cell.addContent(this._snapshots);
	},
	onOK : function()
	{
		this.inherited(arguments);
		var selectedIndex = this._snapshots.selectedIndex;
		var selectionOption = this._snapshots.options[selectedIndex];
		this.okHandler(selectionOption.getAttribute("storeID"), selectionOption.value);
		this.hide();
	},
	createSnapshotsControl : function()
	{
		this._snapshots = document.createElement("select");
		this._snapshots.id = this.dialogId + "snapshots";
		this._snapshots.setAttribute("size", "8");
		this._snapshots.setAttribute("name", this.dialogId + "snapshots");

		var queryResult = XMLHelper_FindChildByTagName(this.cmResponse, "result", true);
		var queryItems = XMLHelper_FindChildrenByTagName(queryResult, "item", false);

		for (var iIndex=0; iIndex < queryItems.length; iIndex++) {
			var queryItem = queryItems[iIndex];
			var sItemLabel = XMLHelper_GetText(XMLHelper_FindChildByTagName(queryItem, "creationTime_localized", true));

			var storeIDNode = XMLHelper_FindChildByTagName(queryItem, "storeID", true);
			var sStoreID = XMLHelper_GetText(XMLHelper_FindChildByTagName(storeIDNode, "value", true));

			var creationTimeNode = XMLHelper_FindChildByTagName(queryItem, "creationTime", true);
			var sCreationTime = XMLHelper_GetText(XMLHelper_FindChildByTagName(creationTimeNode, "value", true));

			this._snapshots.options[iIndex] = new Option(sItemLabel, sCreationTime);
			this._snapshots.options[iIndex].setAttribute("storeID", sStoreID);
			if (this.currentSnapshotCreationTime == sCreationTime) {
				this._snapshots.options[iIndex].selected = true;
			}
		}
	}
});
