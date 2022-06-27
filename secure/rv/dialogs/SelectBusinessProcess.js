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

dojo.provide("viewer.dialogs.SelectBusinessProcess");

dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");

dojo.declare( 'viewer.dialogs.SelectBusinessProcess', bux.dialogs.BaseCustomContentDialog, {

	sTitle : null,
	sLabel : null,
	okHandler : null, /* function */
	cancelHanlder : null, /* function */
	buildRendering : function() {
		this.aButtonsSpec = [
								{label: RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_START_BUTTON_LABEL, action: dojo.hitch(this, this.onOK), type: "button"},
								{label: RV_RES.CANCEL, action: dojo.hitch(this, this.onCancel), type: "button"}
							];
		this.inherited( arguments );
		if( !this.BPMProcessesInfo || this.BPMProcessesInfo.length === 0 ){
			//Disable the start button
			this._buxBaseDialog._aButtonObjects[0].set( 'disabled',true );
		}
	},

	startup : function() {
		this.updateTitle( this.sTitle );
		this.inherited( arguments );
		this.set( 'role', 'group');

		var tableContainer = new bux.layout.TableContainer({
			classname: "bux-InformationDialog buxFilterConfigDiscreteValuesTable"},
			this.contentContainer );

		var row = new bux.layout.TableContainerRow({
			classname : "bux-dialog-label",
			parentContainer : tableContainer
		});

		var cell = new bux.layout.TableContainerCell({
			parentContainer : row
		});

		this.generateSelectProcessSection( cell );
		cell.addContent( document.createElement( 'br' ) );

		this.generateViewInputValuesSection( cell );
		cell.addContent( document.createElement( 'br' ) );
	},

	addDivContainer : function( oParentContainer, sID, sRole ) {
		var div = document.createElement( 'div');
		dojo.attr( div, { 'class' : 'buxFilterConfigFilterValue',
						'aria-labelledby' : sID,
						role : sRole
			});
		oParentContainer.addContent( div );
		return div;
	},

	generateSelectProcessSection : function( oParentContainer ) {

		var sA11yId = this.id + '_selectProcess_a11ylabel';
		this.addTableDescription(oParentContainer, this.sLabel, sA11yId);
		var div = this.addDivContainer( oParentContainer, sA11yId, 'radiogroup' );

		var tableContainer = new bux.layout.TableContainer({
			classname: 'buxFilterConfigFilterValueTable'
		} );
		dojo.style( tableContainer.domNode, 'width', '325px' );

		this.addSelectProcessTableHeader( tableContainer );
		if( !this.BPMProcessesInfo || this.BPMProcessesInfo.length === 0) {
			this.addEmptySelectProcessTableContent( tableContainer );
		}else{
			this.addSelectProcessTableContent(tableContainer);
		}

		div.appendChild( tableContainer.domNode );
	},

	addSelectProcessTableHeader : function( tableContainer ) {

		var table_header_row = new bux.layout.TableContainerRow({
			classname : "buxFilterConfigFilterValueTableHeaderRow",
			parentContainer : tableContainer
		});

		var table_header_cell_1 = new bux.layout.TableContainerCell({
			classname : "buxListHeader buxFilterConfigFilterValueTableHeaderLeft",
			width : '25px',
			parentContainer : table_header_row
		});

		var table_header_cell_2 = new bux.layout.TableContainerCell({
			classname : "buxListHeader buxFilterConfigFilterValueTableHeader",
			width : '300px',
			parentContainer : table_header_row
		});
		table_header_cell_2.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_TABLE_HEADER));
	},

	/**
	 * Displays "None" in the table when no process is available to user
	 */
	addEmptySelectProcessTableContent: function( tableContainer ) {
		var sA11yLabelId = this.id + '_processItemsRow_label_none';
		var row_process = new bux.layout.TableContainerRow({
			parentContainer : tableContainer
		});
		dojo.attr( row_process.domNode, { id : this.id + '_processItemsRow_none',
								'aria-labelledby' : sA11yLabelId,
								tabindex : 0
		});

		var a11yLabel = this.createA11yLabel(RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_NO_PROCESS_A11Y, sA11yLabelId, true /*hidden*/);
		row_process.domNode.appendChild( a11yLabel );

		var cell = new bux.layout.TableContainerCell({
			parentContainer : row_process
		});
		cell.set( 'colspan', 2 );
		cell.addContent( this.createLabelElement( RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_NO_PROCESS) );
	},

	addSelectProcessTableContent : function( tableContainer ) {
		for( var i=0 ; i < this.BPMProcessesInfo.length; i++) {

			var radioButtonObj = new dijit.form.RadioButton({
				checked: (( i === 0 ) ? true : false),// check the first item by default
				name : this.id + '_processItem',
				disabled: false
			});

			var sCaption = html_encode( this.BPMProcessesInfo[i].sCaption );

			var sBPD_ID = this.BPMProcessesInfo[i].sBPD_ID;
			var sProcessAppID = this.BPMProcessesInfo[i].sProcessAppID;
			radioButtonObj.onChange = dojo.hitch( this, 'getProcessItemRadioChangeFunction', sBPD_ID, sProcessAppID, sCaption, radioButtonObj );

			var row_process = new bux.layout.TableContainerRow({
				parentContainer : tableContainer,
				classname : ((i === 0 ) ? 'buxFilterConfigFilterValueRowSelected' : '')
			});
			row_process.set( 'id', this.id + '_processItemsRow' + radioButtonObj.id );

			var cell_radio = new bux.layout.TableContainerCell({
				align : 'center',
				parentContainer : row_process
			});
			cell_radio.addContent( radioButtonObj.domNode );
			cell_radio.set( 'id', this.id + '_processItemsCell' + i );

			var cell_process = new bux.layout.TableContainerCell({
				classname : 'buxFilterConfigFilterItemName text_overflow_ellipsis_ie',
				width : '300px',
				valign : 'top',
				parentContainer : row_process
			});

			var _label = document.createElement("label");
			_label.appendChild(document.createTextNode( sCaption ));
			_label.setAttribute("for", radioButtonObj.id);

			cell_process.addContent(_label);

		}

		this.setDefaultProcessSelectedInfo();

	},

	setDefaultProcessSelectedInfo : function(){
		this._selectedBPD_ID = this.BPMProcessesInfo[0].sBPD_ID;
		this._selectedProcessAppId = this.BPMProcessesInfo[0].sProcessAppID;
		this._selectedProcessName = html_encode( this.BPMProcessesInfo[0].sCaption );
	},

	getProcessItemRadioChangeFunction : function( sBPD_ID, sProcessAppId, sProcessName, radio) {
		if( radio.get( 'value') === 'on') {
			dojo.byId(this.id + '_processItemsRow' + radio.id).className = 'buxFilterConfigFilterValueRowSelected';
			this._selectedBPD_ID = sBPD_ID;
			this._selectedProcessAppId = sProcessAppId;
			this._selectedProcessName = sProcessName;
		} else {
			dojo.byId(this.id + '_processItemsRow' + radio.id).className = '';
		}
	},

	generateViewInputValuesSection : function( oParentContainer ) {
		var sContainerAllyId = this.id + '_viewInputValues_a11ylabel';
		this.addTableDescription( oParentContainer, RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_DESCRIPTION, sContainerAllyId);
		this.addViewInputValuesTable( oParentContainer, sContainerAllyId );
	},

	addViewInputValuesTable : function( oParentContainer, sContainerAllyId ) {
		oParentContainer.addContent( this.generateViewInputValuesTable( sContainerAllyId) );
	},

	addTableDescription : function( oParentContainer, sDescription, sID ) {
		var div = document.createElement( 'div');
		dojo.attr( div, { 'class' : 'bux-label',
						id : sID
			});
		div.appendChild( document.createTextNode(html_encode( sDescription ) ) );
		oParentContainer.addContent( div );
	},

	/**
	 * Returns div that contains the table
	 */
	generateViewInputValuesTable : function(sContainerAllyId) {
		var oInputParameters = this.bpAction.getInputParameter();

		var div = document.createElement( 'div');
		dojo.attr(div, { 'class' : 'buxFilterConfigFilterValue',
						style : 'height:80px',
						role  : 'group',
						'aria-labelledby': sContainerAllyId
		});

		var tableContainer = new bux.layout.TableContainer({
			classname: 'buxFilterConfigFilterValueTable'
		} );
		dojo.style( tableContainer.domNode, 'width', '335px' );
		tableContainer.set( 'role', 'list');

		div.appendChild( tableContainer.domNode );

		var table_header_row = new bux.layout.TableContainerRow({
			classname : "buxFilterConfigFilterValueTableHeaderRow",
			parentContainer : tableContainer
		});

		var table_header_cell_1 = new bux.layout.TableContainerCell({
			classname : "buxListHeader buxFilterConfigFilterValueTableHeaderLeft",
			width : '40%',
			parentContainer : table_header_row
		});
		table_header_cell_1.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DATA_ITEM));

		var table_header_cell_2 = new bux.layout.TableContainerCell({
			classname : "buxListHeader buxFilterConfigFilterValueTableHeader",
			width : '60%',
			parentContainer : table_header_row
		});
		table_header_cell_2.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DISPLAY_VALUE_HEADER));

		var cognosParm = oInputParameters.cognosParameter;
		var bAlreadySetDefaultFocus = false;
		for( var i=0 ; i < cognosParm.length; i++) {

			var rowIndex = 0;
			var widgetContextValues = this.getWidgetContextValues(cognosParm[i]);
			for( var dataItem in widgetContextValues ) {

				var row = new bux.layout.TableContainerRow({
					parentContainer : tableContainer
				});

				var rowAttributes = { id : this.id + '_inputValueRow_' + rowIndex,
									role : 'listitem' };

				//set focus on first row only
				if( !bAlreadySetDefaultFocus ){
					rowAttributes.tabindex = 0;
					bAlreadySetDefaultFocus = true;
				}

				dojo.attr( row.domNode, rowAttributes);

				this.addRowAccessibility(row, rowIndex, dataItem, widgetContextValues[dataItem]);

				//data item
				var dataItemCell = new bux.layout.TableContainerCell({
					classname : 'buxFilterConfigFilterItemName text_overflow_ellipsis_ie',
					width : '40%',
					valign : 'top',
					parentContainer : row
				});

				dataItemCell.set( 'id', this.id + '_dataItem_' + i );

				dataItemCell.addContent( this.createLabelElement( dataItem ) );

				//display value
				var displayValueCell = new bux.layout.TableContainerCell({
					classname : 'buxFilterConfigFilterItemName text_overflow_ellipsis_ie',
					width : '60%',
					valign : 'top',
					parentContainer : row
				});
				displayValueCell.set( 'id', this.id + '_displayValue_' + i );
				displayValueCell.addContent( this.createLabelElement( widgetContextValues[dataItem][0] ) );

				rowIndex++;
			}
		}
		return div;
	},

	getWidgetContextValues : function( widgetContext ){
		return values = widgetContext['com.ibm.widget.context'].values;
	},

	addRowAccessibility : function( row, rowIndex, sDataItem, sDataValue ) {
		// add aria-labelledby label
		var sA11yLabelId = this.id + '_inputValueRow_label_' + rowIndex;
		dojo.attr( row.domNode, { 'aria-labelledby' : sA11yLabelId } );

		var sA11yLabel = RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DATA_ITEM + ' ' + sDataItem + ' ' +
						RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_A11Y_DESC_VALUE + ' ' + sDataValue;
		row.domNode.appendChild( this.createA11yLabel( sA11yLabel, sA11yLabelId, true /*hidden*/ ) );

		//add keyboard navigation
		dojo.connect( row.domNode, "onkeypress", dojo.hitch( this, this._rowOnKeyPress));
	},

	_rowOnKeyPress : function( evt ) {
		switch( evt.keyCode ) {
			case dojo.keys.DOWN_ARROW :
				this.changeNodeFocus( evt, evt.target, evt.target.nextSibling );
				break;
			case dojo.keys.UP_ARROW :
				this.changeNodeFocus( evt, evt.target, evt.target.previousSibling );
				break;
		}
	},

	changeNodeFocus : function( evt, currentNode, targetNode) {
		if( !targetNode || ( targetNode && targetNode.id && targetNode.id.indexOf( '_inputValueRow_' ) === -1 ) ){
			return;
		}

		dojo.attr( currentNode, {tabindex : -1 } );
		dojo.attr( targetNode, { tabindex : 0 } );
		dijit.focus( targetNode );

		if (dojo.isIE || dojo.isTrident) {
			evt.keyCode = 0;
		}
		dojo.stopEvent(evt);
	},

	createA11yLabel : function( sLabelText, sLabelId, hidden ) {
		var _eSpan = this.createLabelElement( sLabelText );
		var attribs = { id :sLabelId };
		if( hidden ){attribs.style = 'visibility:hidden;display:none';}
		dojo.attr( _eSpan, attribs);
		return _eSpan;
	},

	createLabelElement : function( sLabelText ) {
		var _eSpan = document.createElement("span");
		_eSpan.appendChild(document.createTextNode( html_encode( sLabelText ) ));
		return _eSpan;
	},

	onOK : function() {
		this.hide();
		this.bpAction.startProcess( this._selectedBPD_ID, this._selectedProcessAppId, this._selectedProcessName );
	}

});