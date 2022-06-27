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
dojo.provide("FaultMessageDialog");

dojo.declare("FaultMessageDialog", FaultDialog, {
	m_oCV: null,
	m_errorMessage: "",
	constructor: function(oCV, errorMessage) {
		this.m_errorMessage = errorMessage;
	},
	getErrorMessage: function() {
		return this.m_errorMessage;
	},
	getDetails: function() {
		return "";
	},
	canRetryRequest: function() {
		return false;
	}
});