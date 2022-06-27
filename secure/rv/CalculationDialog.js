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
dojo.provide("bux.dialogs.CalculationDialog");

dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");

dojo.declare("viewer.dialogs.CalculationDialog", bux.dialogs.BaseCustomContentDialog, {
	sTitle: null,
	sLabel: null, /*String the lablel of the calculation  dialog*/
	sDescription: null,
	sContentLocale: null,
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
		if (this.sDescription) {
			row = new bux.layout.TableContainerRow({
				parentContainer: tableContainer
			});
			cell = new bux.layout.TableContainerCell({
				classname: "bux-dialog-info",
				parentContainer: row
			});
			cell.addContent(document.createTextNode(this.sDescription));

			dijit.setWaiState(this._buxBaseDialog.domNode, "describedBy", cell.id);
		}

		row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});
		cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-label",
			parentContainer: row
		});

		this._calculationField = new dijit.form.NumberTextBox({
			required:true,
			onBlur:function() {
								if(!this._cancelled && !this.isValid() ) {
									this.focus();
								}
			},
			_setOKBtnDisabled : function(oButtons, bDisabled) {
				//note: localized label compare (product locale)
				if(oButtons && oButtons[0] && oButtons[0].label === RV_RES.IDS_JS_OK) {
					oButtons[0].set("disabled", bDisabled);
				}
			},

			isValid: function(){
				//the constraints will apply locale information when doing validation
				var bIsValid = this.validator(this.get("displayedValue"), this.get("constraints"));
				this._setOKBtnDisabled(this.oDlgBtns, !bIsValid);
				return bIsValid;
			}
		});

		if (this.sContentLocale != null) {
			dojo.requireLocalization("dojo.cldr", "number", this.sContentLocale);
			this._calculationField.constraints = {
				locale: this.sContentLocale
			};
		}
		var _label = document.createElement("label");
		_label.appendChild(document.createTextNode(this.sLabel));
		_label.setAttribute("for", this._calculationField.id);
		cell.addContent(_label);

		row = new bux.layout.TableContainerRow({
			parentContainer: tableContainer
		});

		cell = new bux.layout.TableContainerCell({
			classname: "bux-dialog-field",
			parentContainer: row
		});
		cell.addContent(this._calculationField.domNode);

		this._calculationField.oDlgBtns = this._buxBaseDialog._aButtonObjects;
	},


	onOK : function()
	{
		if (this._calculationField.state != "Error")
		{
			this.inherited(arguments);
			this.okHandler(this._calculationField.get("value"));
			this.hide();
		}
	},


	onCancel : function() {
		//this flag is used to make sure that the tooltip for the numberTextBox is not set to the wrong node when
		//cancelled is called
		this._calculationField._cancelled = true;
		this.inherited( arguments );
	}
});
