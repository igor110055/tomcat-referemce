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
dojo.provide("FaultDialog");

dojo.declare("FaultDialog", IFaultDialog, {

	m_soapFault: null,
	m_errorMessage : null,
	m_oCV: null,

	constructor: function(oCV) {
		this.m_oCV = oCV;
	},

	show: function(soapFault) {
		this.m_soapFault = soapFault;
		this.m_oCV.m_resizeReady = true;
		this.renderInlineDialog();
		this.m_oCV.getViewerWidget().setErrorDlg( this );
	},

	handleUnknownHTMLResponse: function(responseText) {
		if (responseText) {
			var htmlWindow = window.open("","",'height=400,width=500');
			if(htmlWindow != null) {
				htmlWindow.document.write(responseText);
			}
		}
	},

	canRetryRequest: function() {
		var canRetry = true;
		var canRetryNode = XMLHelper_FindChildrenByTagName(this.m_soapFault, "allowRetry", true);
		if(canRetryNode.length > 0) {
			canRetry = ( XMLHelper_GetText(canRetryNode[0], false) === "true" );
		}

		return canRetry;
	},

	isWarningMessage: function() {
		return false;
	},

	getButtons: function() {
		var buttons = [{
			label: RV_RES.IDS_JS_OK,
			action: dojo.hitch( this, this.ok )
		}];

		if( this.canRetryRequest() ) {
			buttons.push({
				label: RV_RES.IDS_JS_RETRY,
				action: dojo.hitch( this, this.retry )
			});
		}

		return buttons;
	},

	renderInlineDialog: function() {
		var oPayload = {
			"type": this.isWarningMessage() ? "warning" : "error",
			"message": this.getErrorMessage(),
			"buttons": this.getButtons()
		};

		var details = this.getDetails();
		if (details && details.length>0) {
			oPayload.details = details;
		}

		this.m_oCV.getViewerWidget().fireEvent("com.ibm.bux.widget.notification", null, oPayload);
	},

	setErrorMessage: function(errorMessage) {
		this.m_errorMessage = errorMessage;
	},

	getErrorMessage: function() {
		if(this.m_errorMessage == null) {
			var errorMessageNodes = XMLHelper_FindChildrenByTagName(this.m_soapFault, "message", true);
			if(errorMessageNodes.length > 0) {
				var messageStringNode = XMLHelper_FindChildByTagName(errorMessageNodes[0], "messageString", false);

				this.checkAndSetErrorMessage( XMLHelper_GetText(messageStringNode, false) );
			}
		}

		return this.m_errorMessage;
	},
	checkAndSetErrorMessage: function( errMsg ) {

		this.m_detailMessageStartIndex = 1;

		if( errMsg.indexOf('RSV-BBP-0038') == 0 ) {
			errMsg = RV_RES.IDS_CONV_CANCELED_ERROR;
			this.m_detailMessageStartIndex = 0;
		}
		this.m_errorMessage = errMsg;
	},
	getDetails: function() {
		var detailsString = "";
		var errorMessageNodes = XMLHelper_FindChildrenByTagName(this.m_soapFault, "message", true);
		if(errorMessageNodes.length > 0)
		{
			if (typeof this.m_detailMessageStartIndex === "undefined" || this.m_detailMessageStartIndex===null) {
				this.m_detailMessageStartIndex = 1;
			}
			for(var messageIndex = this.m_detailMessageStartIndex; messageIndex < errorMessageNodes.length; ++messageIndex) {
				var messageStringNode = XMLHelper_FindChildByTagName(errorMessageNodes[messageIndex], "messageString", false);
				detailsString += XMLHelper_GetText(messageStringNode, false) + "\n";
			}
		}
		return detailsString;
	},
	retry: function() {
		var retryEntry = this.m_oCV.getRetryDispatcherEntry();
		this.hide();
		if (retryEntry) {
			retryEntry.retryRequest();
		}
		else {
			// if we don't have a dipstherEntry, the fault must of happened right away.
			// build and send a new request using the original form fields from the widget
			var originalFormFields = this.m_oCV.getViewerWidget().getOriginalFormFields();
			if (originalFormFields && (originalFormFields.get("b_action") == "cvx" || originalFormFields.get("b_action") == "cvx.high")) {
				originalFormFields.add("b_action", "cognosViewer");
			}
			this.m_oCV.executeAction("RetryRequest", originalFormFields);
		}
	},
	ok: function() {
		var retryEntry = this.m_oCV.getRetryDispatcherEntry();
		this.hide();
		if (retryEntry) {
			retryEntry.onCloseErrorDlg();
		}
	},
	hide: function() {
		this.m_oCV.getViewerWidget().fireEvent("com.ibm.bux.widget.notification", null, {remove:1});
		this.m_oCV.getViewerWidget().setErrorDlg(null);
		this.m_oCV.setRetryDispatcherEntry(null);
	}
});

function buxErrorPage_toggleErrorDetails(event, cvId, htmlNode) {
	// left mouse, enter or space bar
	if ((event.button == 0 && (event.keyCode == "0" || typeof event.keyCode == "undefined")) || event.keyCode == "32" || event.keyCode == "13") {
		var buxErrorPageDetailContentOuter = document.getElementById("buxErrorPageDetailContentOuter" + cvId);
		var buxErrorPageDetailsDiv = document.getElementById("buxErrorPageDetails" + cvId);
		var buxTitlePaneTitleDiv = document.getElementById("titlePaneTitle" + cvId);

		var bShowDetails = (buxErrorPageDetailsDiv.style.display == "none");
		dojo.removeClass(buxErrorPageDetailContentOuter, bShowDetails ? 'dijitTitlePaneContentOuterClosed' : 'dijitTitlePaneContentOuterOpen');
		dojo.addClass(buxErrorPageDetailContentOuter, bShowDetails ? 'dijitTitlePaneContentOuterOpen' : 'dijitTitlePaneContentOuterClosed');
		dojo.removeClass(buxTitlePaneTitleDiv, bShowDetails ? "dijitClose" : "dijitOpen");
		dojo.addClass(buxTitlePaneTitleDiv, bShowDetails ? "dijitOpen" : "dijitClose");
		buxErrorPageDetailsDiv.style.display = bShowDetails ? "" : "none";
	}
}
