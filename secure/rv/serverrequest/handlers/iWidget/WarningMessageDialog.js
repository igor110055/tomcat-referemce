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
dojo.provide("WarningMessageDialog");

dojo.declare("WarningMessageDialog", FaultMessageDialog, {
	constructor: function(oCV, errorMessage) {
	},
	isWarningMessage: function() {
		return true;
	}
});