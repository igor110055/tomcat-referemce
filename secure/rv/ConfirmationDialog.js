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
dojo.provide("bux.dialogs.ConfirmationDialog");

viewer.dialogs.ConfirmationDialog = function (_title,_sMainMessage, _sDescription, sInfoIconClass, callerObject, _yesHandlerOfCallerObject) {

	dojo["require"]("bux.dialogs.InformationDialog"); //@lazyload
	var ConfirmDialog = new bux.dialogs.Confirm(
			_title,
			_sMainMessage,
			_sDescription,
			dojo.hitch(callerObject, _yesHandlerOfCallerObject, callerObject ),
			sInfoIconClass
			);
	return ConfirmDialog;
};

