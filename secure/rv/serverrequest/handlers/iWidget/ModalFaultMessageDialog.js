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
 
dojo.provide("ModalFaultMessageDialog");
dojo.declare("ModalFaultMessageDialog", IFaultDialog, {
	m_errorMessage: "",
	m_errorDetails: "",
	constructor: function(sErrorMsg, sErrorDetails) {
		this.m_errorMessage = sErrorMsg;
		this.m_errorDetails = sErrorDetails;
	},
	getErrorMessage: function() {
		return this.m_errorMessage;
	},
	getDetails: function() {
		return this.m_errorDetails;
	},

	show : function() {
		bux.messageBox(bux.MB_ERROR, this.getErrorMessage(), "",  this.getDetails() );	
	}

});