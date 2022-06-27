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

 dojo.provide("GlobalPromptFaultDialog");
 dojo.require("FaultDialog");

 dojo.declare("GlobalPromptFaultDialog", FaultDialog, {
	m_sendRequestOnOK: false,
	setSendRequestOnOK: function( bSendRequestOnOK )
	{
		this.m_sendRequestOnOK = bSendRequestOnOK;
	},


	ok: function() {
		this.hide();
		this.m_oCV.getViewerWidget().disableListenToForGlobalPrompt();

		// for certain errors, we need to submit a request on OK see bug 2711145
		if( this.m_sendRequestOnOK )
		{
			var retryEntry = this.m_oCV.getRetryDispatcherEntry();
			var formFields = null;
			if (retryEntry) {
				formFields = retryEntry.getOriginalFormFields();
			}
			else {
				formFields = this.m_oCV.getViewerWidget().getOriginalFormFields();
			}
			
			if (formFields && formFields.exists( "widget.globalPromptInfo")) {
				formFields.remove("widget.globalPromptInfo");
			}
			
			this.retry();
		}
	}
 });