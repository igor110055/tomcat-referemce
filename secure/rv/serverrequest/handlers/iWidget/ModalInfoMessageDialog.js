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
 
dojo.provide("ModalInfoMessageDialog");

dojo.declare("ModalInfoMessageDialog", null, {
	
	sMessage: "",
	sDescription: "",
	sTitle : "",
	
	constructor : function( args){
		dojo.safeMixin( this, args );
	},
	
	getMessage: function() {
		return this.sMessage;
	},
	
	getDescription: function() {
		return this.sDescription;
	},
	
	getTitle: function() {
		return this.sTitle;
	},

	show : function() {
		dojo["require"]("bux.dialogs.InformationDialog"); //@lazyload
		var infoDialog = new bux.dialogs.InformationDialog({
			title: this.getTitle(),
			sMainMessage : this.getMessage(),
			sDescription : this.getDescription(),
			sInfoIconClass : 'bux-informationDialog-info-icon'
		});
		infoDialog.show();
	}

});