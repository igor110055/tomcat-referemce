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


dojo.provide("WorkingDialog");

dojo.declare("WorkingDialog", IRequestIndicator, {

	constructor: function(oCV) {
		this.m_oCV = oCV;
		this.m_sNamespace = oCV.getId();
		this.m_sGateway = oCV.getGateway();

		try {
			var buttons = [];
			if (oCV.getAdvancedServerProperty("VIEWER_JS_HIDE_CANCEL_BUTTON") != "true") {				
				buttons.push({"class":"icdDialogButton", label: RV_RES.CANCEL, onClick: dojo.hitch(this, this.doCancel)});
			}

			this.m_waitPageDialog = new ViewerIWidgetInlineDialog(this.getCognosViewer(), this.getWaitPageHTML(), buttons, "waitButtonContainer_" + this.getCognosViewer().getId());

			// uncomment to help debug the wait dialog
			// this.m_waitPageDialog.setDebugHelper(getCognosViewerObjectRefAsString(this.getCognosViewer().getId()) + ".m_waitPage");
		}
		catch (e) {
			if (console && console.log) {
				console.log(e);
			}
		}
	},

	setSimpleWorkingDialogFlag: function( flag ){},

	getCognosViewer: function() {
		return this.m_oCV;
	},

	show: function() {
		this.m_waitPageDialog.show();
	},

	getWaitPageHTML: function() {
		var id = this.getCognosViewer().getId();

		return '<table cellspacing="4" cellpadding="0" border="0" wairole="presentation" role="presentation" style="width:100%;height:100%">' +
					'<tbody><tr><td align="center">' +
						'<div class="dijitInline widget_load_background" role="presentation" tabindex="0">' +
							'<div id="working' + id +'" class="widget_load" aria-labelledby="working' + id + '">' +
								RV_RES.IDS_JS_WAIT_PAGE_LOADING +
							'</div>' +
							'<div id="waitButtonContainer_' + id + '" class="icdDialogButtonBar" style="text-align:center;padding-left:12px;padding-right:12px;"></div>' +
						'</div>' +
					'</td></tr></tbody>' +
				'</table>';
	},

	hide: function() {
		this.m_waitPageDialog.hide();
		this.m_cancelCallback = null;
	},

	setCancelCallback: function(callback) {
		this.m_cancelCallback = callback;
	},

	doCancel: function() {
		var oCV = this.getCognosViewer();

		if(this.m_cancelCallback) {
			this.m_cancelCallback();
			this.m_cancelCallback = null;
		}
		else {
			var bCancelCalled = oCV.cancel();

			// is we actually sent a cancel request, fix up the undo/redo stack
			if (bCancelCalled) {
				var undoRedoQueue = oCV.getViewerWidget().getUndoRedoQueue();
				if (undoRedoQueue) {
					undoRedoQueue.handleCancel();
				}
			}
		}

		if (oCV.isReportRenderingDone()) {
			this.hide();
		}
		else {
			var payload = { action: 'deleteWidget' };
			oCV.getViewerWidget().iContext.iEvents.fireEvent("com.ibm.bux.widget.action", null, payload);
		}
	}
});