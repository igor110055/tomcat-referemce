/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

if (!window.gViewerLogger) {
	window.gViewerLogger = {};
}
window.gViewerLogger.clientLogs = [];
window.gViewerLogger.logTimerStarted = false;

window.gViewerLogger.getCookie = function(name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg) {
			return window.gViewerLogger.getCookieVal(j);
		}
		i = document.cookie.indexOf(" ", i) + 1;
		if (i === 0) {
			break; 
		}
	}
	return null;	
};


window.gViewerLogger.getCookieVal = function(offset) {
	var endstr = document.cookie.indexOf(";", offset);
	if (endstr == -1) {
		endstr = document.cookie.length;
	}
	return document.cookie.substring(offset, endstr);
};

window.gViewerLogger.isLoggingEnabled = function() {
	return window.gViewerLogger.getCookie("captureViewerClientLogs") === "true";
};

window.gViewerLogger.log = function(hint, content, type) {
	if (!window.gViewerLogger.isLoggingEnabled()) {
		return;
	}
	
	var contentText = typeof content == "string" ? content : CViewerCommon.toJSON(content);
	
	var logs = {
		"label" : hint.replace(/\"/g,"\\\""),
		"content" : contentText.replace(/\"/g,"\\\""),
		"type" : type
	};
	
	window.gViewerLogger.clientLogs.push(logs);
	
	if (!window.gViewerLogger.logTimerStarted) {
		window.gViewerLogger.logTimerStarted = true;
		setTimeout(window.gViewerLogger.uploadLogs, 5000);
	}
};

window.gViewerLogger.uploadLogs = function() {
	var logs = {"clientLog" : true, "logs" : window.gViewerLogger.clientLogs};	
	var jsonLogs = CViewerCommon.toJSON(logs);
	
	var httpRequest = new XmlHttpObject();
	httpRequest.addFormField("b_action", "cognosViewer");
	httpRequest.addFormField("ui.action", "saveJSONLogs");
	httpRequest.addFormField("cv.responseFormat", "successfulRequest");
	httpRequest.addFormField("cv.jsonLogs", jsonLogs);

	//send asynchronous request
	httpRequest.sendHtmlRequest("POST", window.gaRV_INSTANCES[0].getGateway(), "", true);

	window.gViewerLogger.clientLogs = [];
	window.gViewerLogger.logTimerStarted = false;
};

window.gViewerLogger.addSubscriptionSpec = function(sc) {
	if (!window.gViewerLogger.isLoggingEnabled()) {
		return;
	}

	if (sc && sc.m_oCognosViewer !== null && typeof sc.m_oCognosViewer != "undefined") {
		var oCV = sc.m_oCognosViewer;
		if (oCV.getSubscriptionManager() !== null) {
			try {
				var fWR = document.getElementById("formWarpRequest" + oCV.getId());

				var selectionXml = new CSelectionXml(	fWR["ui.burstID"].value,
														fWR["ui.contentLocale"].value,
														fWR["ui.outputLocale"].value
													);

				selectionXml.BuildSelectionFromController(sc);

				window.gViewerLogger.log("Subscription Spec", selectionXml.toXml(), "xml");
			}
			catch (e) {}
		}
	}
};


window.gViewerLogger.addContextInfo = function(sc) {
	if (!window.gViewerLogger.isLoggingEnabled()) {
		return;
	}

	if (sc) {
		var sText = "";
		var selectedObjects = sc.getAllSelectedObjects();

		if (selectedObjects.length <= 0) {
			return;
		}

		this.addSubscriptionSpec(sc);

		for(var s = 0; s < selectedObjects.length; ++s) {
			var selection = selectedObjects[s];

			var sCTX = "";
			var aContextIds = selection.getSelectedContextIds();
			var i,j;
			for(i = 0; i < aContextIds.length; ++i) {
				if (i > 0) {
					sCTX += "::";
				}

				for(j = 0; j < aContextIds[i].length; ++j) {
					if (j > 0)
					{
						sCTX += ":";
					}

					sCTX += aContextIds[i][j];
				}
			}

			if (sText !== "") {
				sText += "\\n\\n\\n";
			}
			sText += "selection ctx: " + sCTX;

			var bookletItem = sc.getBookletItemForCurrentSelection();
			if (bookletItem) {
				var md = sc.m_oCDManager.m_md;
				var rr = md[bookletItem];
				sText += "\\n\\nBooklet Item: " + bookletItem;
				sText += "\\n\tReport Reference: " + rr.b;
				sText += "\\n\tSource Report: " + md[rr.sp].sp;
				sText += "\\n\tModel Path: " + md[rr.mp].mp;
				sText += "\\n\tExpression Locale: " + rr.expressionLocale;
				sText += "\\n\tDrill Flag: " + rr.drillUpDown;
				sText += "\\n\tPackage Drill Through: " + rr.modelBasedDrillThru;
			}
			
			var oCell = selection.getCellRef();
			var dttargets = "";
			if (oCell && oCell.firstChild) {
				dttargets = oCell.firstChild.getAttribute("dttargets");
				if (typeof oCell.firstChild.getAttribute("dttargets") != "undefined" && oCell.firstChild.getAttribute("dttargets") !== null) {
					dttargets = oCell.firstChild.getAttribute("dttargets");
				}
			}


			var selectionCtx = selection.getSelectedContextIds();
			var muns = selection.getMuns();
			var munCount = muns.length;

			for(i = 0; i < munCount; ++i) {
				for(j = 0; j < muns[i].length; ++j) {
					var ctxId = selectionCtx[i][j];

					sText += "\\n\\nctx: " + ctxId;
					sText += "\\n\tabc: " + sc.getDisplayValue(ctxId);
					sText += "\\n\tuse value: " + sc.getUseValue(ctxId);
					sText += "\\n\tref data item: " + sc.getRefDataItem(ctxId);
					sText += "\\n\tmun: " + sc.getMun(ctxId);
					sText += "\\n\tlun: " + sc.getLun(ctxId);
					sText += "\\n\thun: " + sc.getHun(ctxId);
					sText += "\\n\tusage: " + sc.getCCDManager().GetUsage(ctxId);
					sText += "\\n\tdrill: " + sc.getCCDManager().GetDrillFlag(ctxId);


					if (i === 0 && j === 0 && dttargets) {
						sText += "\\n\tdttargets: " + dttargets.replace(/\\\"/g,"\"");
					}
				}
			}
		}

		window.gViewerLogger.log("Context Info", sText, "text");
	}	
};