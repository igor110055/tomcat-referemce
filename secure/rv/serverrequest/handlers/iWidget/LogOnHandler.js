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

dojo.provide("LogOnHandler");

dojo.declare("LogOnHandler", null, {
	constructor: function() {
		this.m_cvIdList = [];
	},
	handleLogon: function(cvId, promptInfoNamespace) {
		this.m_cvIdList.push(cvId);
		if(this.m_cvIdList.length == 1) {
			dojo["require"]("bux.dialogs.IFrameDialog"); //@lazyload
			
			var dialog = (promptInfoNamespace==null|| promptInfoNamespace.length==0) ?
				new bux.dialogs.LogonDialog({
					okHandler: GUtil.generateCallback(this.okHandler, [], this),
					cancelHandler: GUtil.generateCallback(this.cancelHandler, [], this)
				}):
				new bux.dialogs.LogonDialog({
					okHandler: GUtil.generateCallback(this.okHandler, [], this),
					cancelHandler: GUtil.generateCallback(this.cancelHandler, [], this),
					params: {"h_CAM_action": "logonAs", "CAMNamespace": promptInfoNamespace}
				});

			dialog.startup();
			dialog.show();
		}
	},
	okHandler: function() {
		for(var index = 0; index < this.m_cvIdList.length; ++index) {
			var cvId = this.m_cvIdList[index];
			var oCV = window["oCV" + cvId];

			// need to let chrome know the user logged on so they can refresh the user name and content tree
			if (index === 0 && oCV.getViewerWidget) {
				oCV.getViewerWidget().fireEvent("com.ibm.bux.widget.action", null, { action: "refreshAfterLogon" });
			}

			if (oCV.getRetryDispatcherEntry()) {
				oCV.getRetryDispatcherEntry().retryRequest();
			}
			else {
				var originalFormFields = oCV.getViewerWidget().getOriginalFormFields();
				if (originalFormFields) {
					oCV.executeAction("RetryRequest", originalFormFields);
				}
			}
		}
		this.m_cvIdList = [];
	},
	cancelHandler: function() {
		for(var index = 0; index < this.m_cvIdList.length; ++index) {
			var cvId = this.m_cvIdList[index];
			var oCV = window["oCV" + cvId];

			if (oCV.getRetryDispatcherEntry()) {
				oCV.getRetryDispatcherEntry().onCloseErrorDlg();
			}
		}

		this.m_cvIdList = [];
	}
});


IWidgetLogonhandler = new LogOnHandler();