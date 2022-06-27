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
dojo.provide("viewer.dialogs.ClipboardDialog");

dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.Button");

dojo.declare("viewer.dialogs.ClipboardDialog", bux.dialogs.BaseCustomContentDialog, {
	sTitle: null,
	okHandler: null, /*Function?*/
	cancelHandler:null, /*Function?*/

	startup: function() {
		this.updateTitle(this.sTitle);
		this.inherited(arguments);
		var tableContainer = new bux.layout.TableContainer({
			// TODO remove this class
			classname: "bux-InformationDialog"
		},this.contentContainer);

		var cell = null, row = null;


		this._textField = new dijit.form.SimpleTextarea({
			required:true,
			rows: 10,
			cols: 50,
			style: 'width:auto'});


		row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});

		cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-field",
			parentContainer: row
		});
		cell.addContent(this._textField.domNode);
	},
	onOK : function()
	{
		if (this._textField.state != "Error")
		{
			this.inherited(arguments);
			this.okHandler(this._textField.get("value"));
			this.hide();
		}
	}
});
