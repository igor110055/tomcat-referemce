/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2012, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
dojo.provide("MissingMemberFaultDialog");

dojo.declare("MissingMemberFaultDialog", FaultDialog, {
	m_oCV: null,
	m_errorMessage: null,
	m_bHasBUACapability: false,
	m_bHasParameters: false,

	constructor: function(oCV, errorMessage, bHasBUACapability, bHasParameters) {
		this.m_errorMessage = errorMessage;
		this.m_bHasBUACapability = bHasBUACapability;
		this.m_bHasParameters = bHasParameters;
	},

	/*
	 * Override
	 */
	getErrorMessage: function() {
		return this.m_errorMessage;
	},

	/*
	 * Override
	 */
	canRetryRequest: function() {
		return false;
	},

	/*
	 * Override
	 */
	getButtons: function() {
		var buttons = [];

		if (this.m_bHasBUACapability) {
			buttons.push({
				label: RV_RES.IDS_JS_EDIT,
				action: dojo.hitch( this, this.invokeEditContentAction )
			});
		}

		buttons.push({
			label: RV_RES.IDS_JS_CLOSE,
			action: dojo.hitch( this, this.ok )
		});

		return buttons;
	},

	invokeEditContentAction: function() {
		var oParam = {};
		oParam.oFaultDialog = this;
		oParam.bHasParameters = this.m_bHasParameters;

		this.m_oCV.executeAction( "EditContent" , { "MissingMemberRecoveryMode": oParam});
	}

});