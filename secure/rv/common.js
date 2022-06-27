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

cvLoadDialog = function(oCognosViewerObject, aFormFields, width, height, sIframeTitle)
{
	var formWarpRequest = document.getElementById("formWarpRequest" + oCognosViewerObject.getId());

	if(formWarpRequest && oCognosViewerObject)
	{
		oCognosViewerObject.getWorkingDialog().hide();

		var target = "";
		var sPath = "";
		var modalDialog = null;

		if (oCognosViewerObject.isAccessibleMode())
		{
			target = "winNAT_" + ( new Date() ).getTime();
			sPath = oCognosViewerObject.getWebContentRoot() + "/" + "rv/blankNewWin.html?cv.id=" + this.getCVId();
		}
		else
		{
			var parent = document.body;

			modalDialog = new CModal("", "", parent, null, null, height, width, true, true, false, true, oCognosViewerObject.getWebContentRoot());

			if (typeof sIframeTitle == "string")
			{
				document.getElementById(CMODAL_CONTENT_ID).setAttribute("title", sIframeTitle);
			}
			document.getElementById(CMODAL_BACK_IFRAME_ID).setAttribute("title", RV_RES.IDS_JS_MODAL_BACK_IFRAME);

			target = CMODAL_CONTENT_ID;
		}

		var dialogForm = document.createElement("FORM");
		dialogForm.method = "POST";
		dialogForm.action = oCognosViewerObject.getGateway();
		dialogForm.target = target;
		dialogForm.style.margin = "0px";

		document.body.appendChild(dialogForm);

		for(var formFieldName in aFormFields)
		{
			dialogForm.appendChild(createHiddenFormField(formFieldName, aFormFields[formFieldName]));
		}

		dialogForm.appendChild(createHiddenFormField("cv.id", oCognosViewerObject.getId()));
		dialogForm.appendChild(createHiddenFormField("b_action", "xts.run"));

		dialogForm.appendChild(createHiddenFormField("ui.action", formWarpRequest["ui.action"].value));
		dialogForm.appendChild(createHiddenFormField("ui.object", formWarpRequest["ui.object"].value));

		if(typeof oCognosViewerObject.rvMainWnd != "undefined")
		{
			dialogForm.appendChild(createHiddenFormField("run.outputFormat", oCognosViewerObject.rvMainWnd.getCurrentFormat()));
		}

		if(typeof formWarpRequest["run.outputLocale"] != "undefined")
		{
			dialogForm.appendChild(createHiddenFormField("run.outputLocale", formWarpRequest["run.outputLocale"].value));
		}

		if(typeof dialogForm["backURL"] == "undefined" && typeof dialogForm["ui.backURL"] == "undefined" && typeof formWarpRequest["ui.backURL"] != "undefined")
		{
			dialogForm.appendChild(createHiddenFormField("ui.backURL", formWarpRequest["ui.backURL"].value));
		}

		if(typeof oCognosViewerObject != "undefined" && typeof oCognosViewerObject.getConversation != "undefined" && typeof oCognosViewerObject.getTracking != "undefined")
		{
			dialogForm.appendChild(createHiddenFormField("ui.conversation", oCognosViewerObject.getConversation()));
			dialogForm.appendChild(createHiddenFormField("m_tracking", oCognosViewerObject.getTracking()));

			if(oCognosViewerObject.envParams["ui.name"] != "undefined")
			{
				dialogForm.appendChild(createHiddenFormField("ui.name", oCognosViewerObject.envParams["ui.name"]));
			}
		}

		// Remove onBeforeUnLoad for this submission but set it back after.
		var oldUnload = window.onbeforeunload;
		window.onbeforeunload = null;

		if (oCognosViewerObject.isAccessibleMode())
		{
			window.open(sPath, target, "rv");
			dialogForm.submit();
		}
		else
		{
			// Submit the form
			dialogForm.submit();
			modalDialog.show();
		}

		window.onbeforeunload = oldUnload;

		document.body.removeChild(dialogForm);

		oCognosViewerObject.modalShown = true;
	}
};

function createHiddenFormField(name, value)
{
	var formField = document.createElement("input");
	formField.setAttribute("type", "hidden");
	formField.setAttribute("name", name);
	formField.setAttribute("id", name);
	formField.setAttribute("value", value);
	return(formField);
}

function isAuthenticationFault(soapFaultDocument)
{
	if(soapFaultDocument != null) {
		var camElement = XMLHelper_FindChildByTagName(soapFaultDocument, "CAM", true);
		return (camElement != null && XMLHelper_FindChildByTagName(camElement, "promptInfo", true) != null);
	}
}

/*
 * Checks the response for an authentication fault. If it finds one it will launch the log on dialog
 * Returns true if an authentication fault was detected
 */
function processAuthenticationFault(soapFaultDocument, cognosViewerID)
{
	if (isAuthenticationFault( soapFaultDocument) )
	{
		launchLogOnDialog(cognosViewerID, soapFaultDocument );
		return true;
	}


	return false;
}

function isObjectEmpty(object) {
    for(var property in object) {
        if(object.hasOwnProperty(property))
            return false;
    }

    return true;	
}

/*
 * Calls close.xts which end up showing the log on dialog
 */
function launchLogOnDialog(cvID, response)
{
	try
	{
		var oCV = getCognosViewerObjectRef(cvID);
		var params = {
			"b_action":"xts.run",
			"m":"portal/close.xts",
			"h_CAM_action" : "logonAs"};

		if (response != null)
		{
			var namespaceNodes = XMLHelper_FindChildrenByTagName(response, "namespace", true);
			if (namespaceNodes != null)
			{
				for(var index = 0; index < namespaceNodes.length; ++index)
				{
					var namespaceNode = namespaceNodes[index];
					if (namespaceNode != null)
					{
						var namespaceNameNode = XMLHelper_FindChildByTagName(namespaceNode, "name", false);
						var namespaceValueNode = XMLHelper_FindChildByTagName(namespaceNode, "value", false);
						if (namespaceNameNode != null && namespaceValueNode != null)
						{
							var namespaceName = XMLHelper_GetText(namespaceNameNode);
							var namespaceValue = XMLHelper_GetText(namespaceValueNode);
							if (namespaceName != null && namespaceName.length > 0)
							{
								params[namespaceName] = namespaceValue;
							}
						}
					}
				}
			}
		}

		cvLoadDialog(oCV, params, 540, 460);
	}
	catch(exception)
	{
	}
}

/*
 * Goes through the array of cognos viewer objects to find the one that's waiting on a fault
 */
function getCVWaitingOnFault()
{
	// need to find our oCV object
	var oCV = null;
	for (var iIndex=0; iIndex < window.gaRV_INSTANCES.length; iIndex++)
	{
		// if the oCV object has a retryRequest then it must be the one that triggered the log on
		if (window.gaRV_INSTANCES[iIndex].getRetryDispatcherEntry() != null)
		{
			oCV = window.gaRV_INSTANCES[iIndex];
			break;
		}
	}

	return oCV;
}


/*
 * Callback used from the logon dialog
 */
function ccModalCallBack(command, data)
{
	var oCV = getCVWaitingOnFault();
	destroyCModal();
	if (typeof HiddenIframeDispatcherEntry == "function" && HiddenIframeDispatcherEntry.hideIframe) {
		var oCV = window.gaRV_INSTANCES[0];
		if (oCV) {
			HiddenIframeDispatcherEntry.hideIframe(oCV.getId())
		}
	}

	if (oCV != null)
	{
		if (typeof command != "undefined" && command == "ok")
		{
			var retryEntry = oCV.getRetryDispatcherEntry();

			if (retryEntry) {
				retryEntry.retryRequest();
			}

			if (oCV.getRV() != null) {
				oCV.getRV().updateUserName();
			}
		}
		else
		{
			oCV.rvMainWnd.hideOpenMenus();
		}
	}
}

/*
 * Callback when the user hits the cancel button in a fault dialog
 */
function closeErrorPage()
{
	var oCV = getCVWaitingOnFault();
	destroyCModal();
	if (oCV != null) {
		oCV.setRetryDispatcherEntry(null);
		oCV.rvMainWnd.hideOpenMenus();
	}
}

function getCrossBrowserNode(evt, checkExplicitOriginalTarget) {
	var node = null;
	if (checkExplicitOriginalTarget && evt.explicitOriginalTarget) {
		node = evt.explicitOriginalTarget;
	}
	else if (evt.originalTarget) {
		node = evt.originalTarget;
	}
	else if (evt.target) {
		node = evt.target;
	}
	else if (evt.srcElement) {
		node = evt.srcElement;
	}

	try {
		if ( node && node.nodeType == 3) {	// needed for safari
			node = node.parentNode;
		}
	}
	catch (ex) {
		// sometimes node may not be an HTML element (like a XUL element) and accessing nodeType will generate an error.
	}

	return node;
}

function getNodeFromEvent(evt, bReturnImageNode)
{
	var node = getCrossBrowserNode(evt, true);

	if (node && node.getAttribute && node.getAttribute("name") == "primarySelectionDiv") {
		node = node.parentNode.firstChild;
	}

	if (node && node.getAttribute && node.getAttribute("flashChartContainer") == "true") {
		node = node.firstChild;
	}

	// if the event was from the chart container, go find the image tag within the span.
	if (node && node.getAttribute && node.getAttribute("chartContainer") == "true" && node.childNodes) {
		for (var i=0; i < node.childNodes.length; i ++) {
			if (node.childNodes[i].nodeName.toLowerCase() == "img") {
				node = node.childNodes[i];
				break;
			}
		}
	}
	// if the event was from an image which isn't a chart, get the parent
	else if (!bReturnImageNode && node && node.nodeName && node.nodeName.toLowerCase() == "img" && node.getAttribute("rsvpChart") != "true")
	{
		node = node.parentNode;
	}

	return node;
}

function getCtxNodeFromEvent(evt)
{
	try
	{
		var node = getCrossBrowserNode(evt);

		var sNAME = node.nodeName.toUpperCase();
		if((sNAME == "SPAN" || sNAME == 'AREA' || sNAME == 'IMG') && node.getAttribute("ctx") != null)
		{
			return node;
		}
		else if (sNAME == "SPAN" && (node.parentNode.getAttribute("ctx") != null))
		{
			return node.parentNode;
		}
	}
	catch(exception){}

	return null;
}

function getDocumentFromEvent(evt)
{
	var node = getCrossBrowserNode(evt, true);
	var nodeDocument = node.document ? node.document : node.ownerDocument;

	return nodeDocument;
}

function stopEventBubble(evt)
{
	evt.returnValue = false;
	evt.cancelBubble = true;
	if(typeof evt.stopPropagation != "undefined")
	{
		evt.stopPropagation();
	}
	if(typeof evt.preventDefault != "undefined")
	{
		evt.preventDefault();
	}

	return false;
}

function setNodeFocus(evt)
{
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	// set the focus to child span
	var srcNode = getNodeFromEvent(evt);
	if (srcNode && srcNode.nodeName) {
		var nodeName = srcNode.nodeName.toLowerCase();

		// We only want to set focus to a textItem that's inside a list or crosstab
		if ((nodeName == "td" || nodeName == "span") && srcNode.childNodes && srcNode.childNodes.length > 0 && srcNode.childNodes[0].className == "textItem")
		{
			try {
				srcNode.childNodes[0].focus();
			}
			catch(e) {
				if (typeof console !== "undefined" && console.log) {
					console.log("CCognosViewer: Could not set focus to node. setNodeFocus method common.js");
				}
			}
		}
	}
}

function html_encode(str)
{
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function replaceNewLine(myString) {
	var regX = /\r\n|\r|\n/g;
	var replaceString = '<br/>';
	return myString.replace(regX, replaceString);
}

//take an input string and convert it into
//xml friendly entity references
function xml_encode(sInputString)
{
	var sOutputString = "" + sInputString;

	if ((sOutputString == '0') || ((sInputString != null) && (sInputString != false)))
	{
		//&amp;
		sOutputString = sOutputString.replace(/&/g, "&amp;");
		//&lt;
		sOutputString = sOutputString.replace(/</g, "&lt;");
		//&gt;
		sOutputString = sOutputString.replace(/>/g, "&gt;");
		//&quot;
		sOutputString = sOutputString.replace(/"/g, "&quot;");
		//&apos;
		sOutputString = sOutputString.replace(/'/g, "&apos;");
	}

	else if (sInputString == null)
	{
		//return empty string if the value is null or false
		sOutputString = "";
	}

	return sOutputString;
}


//take an xml friendly string and convert it into
//a js friendly string
function xml_decodeParser(sAll, sGroup1)
{
	var sRetval = sAll;
	switch(sGroup1)
	{
		case 'amp': sRetval = '&'; break;
		case 'lt': sRetval = '<'; break;
		case 'gt': sRetval = '>'; break;
		case 'quot': sRetval = '"'; break;
		case 'apos': sRetval = "'"; break;
	}
	return sRetval;
}

function xml_decode(sInputString)
{
	var sOutputString = "" + sInputString;

	if ((sOutputString == '0') || ((sInputString != null) && (sInputString != false)))
	{
		sOutputString = sOutputString.replace(/&(amp|lt|gt|quot|apos);/g, xml_decodeParser);
	}
	else if (sInputString == null)
	{
		//return empty string if the value is null or false
		sOutputString = "";
	}

	return sOutputString;
}

//Take a string and convert it into a string that is good to use as attribute value in an xpath.
//E.g to construct a xpath to get child elements that have name attribute:
//var xpath = "//[@name=" + xpath_attr_encode(nameValue) + "]";
function xpath_attr_encode(sInputString)
{
	var sQuotedString = null;
	if (sInputString.indexOf("'") >= 0 && sInputString.indexOf('"') >= 0) {
		var aInputs = sInputString.split('"');
		sQuotedString = "concat(";
		for (var i = 0; i < aInputs.length; ++i) {
			if (i > 0) {
				sQuotedString += ",";
			}
			if (aInputs[i].length > 0) {
				sQuotedString += ('"' + aInputs[i] + '"');
			} else {
				sQuotedString += '\'"\'';
			}
		}

		sQuotedString += ")";
	} else if (sInputString.indexOf("'") >= 0) {
		sQuotedString = '"' + sInputString + '"';
	} else {
		sQuotedString = "'" + sInputString + "'";
	}
	return sQuotedString;

}

function getCognosViewerObjectString(sId)
{
	return "oCV" + sId;
}

function getCognosViewerObjectRefAsString(sId)
{
	return "window." + getCognosViewerObjectString(sId);
}

function getCognosViewerObjectRef(sId)
{
	return window[getCognosViewerObjectString(sId)];
}

function getCognosViewerSCObjectString(sId)
{
	return "oCVSC" + sId;
}

function getCognosViewerSCObjectRefAsString(sId)
{
	return "window." + getCognosViewerSCObjectString(sId);
}

function getCognosViewerSCObjectRef(sId)
{
	return window[getCognosViewerSCObjectString(sId)];
}


function cleanupGlobalObjects(sId) {
	cleanupVariable( getCognosViewerObjectString(sId) );
	cleanupVariable( getCognosViewerSCObjectString(sId) );
}

function cleanupVariable( sVariableName ) {
	if( typeof window[sVariableName] != "undefined" && window[sVariableName] ) {
		if (isIE()){
			//It seems like IE does not like "delete window[sVariableName];"
			//it throws an exception and complains that
			//	"Object doesn't support this action"
			//However, using eval seems to work
			eval( "delete " + sVariableName );
		} else {
			delete window[sVariableName];
		}
	}
}

function loadClass(sClass)
{
	try
	{
		var object = eval("new " + sClass + "();");
		return object;
	}
	catch(e)
	{
		return null;
	}
}

function getElementsByClassName(oElm, strTagName, strClassName)
{
	var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements = [];
	var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
	var eleLen = arrElements.length;
	for(var i=0; i<eleLen; i++)
	{
		var oElement = arrElements[i];
		if(oRegExp.test(oElement.className))
		{
			arrReturnElements.push(oElement);
		}
	}
	return arrReturnElements;
}


function getImmediateLayoutContainerId(node)
{
	var currentNode = node;
	while (currentNode != null)
	{
		if (currentNode.getAttribute && currentNode.getAttribute("lid") != null)
		{
			return currentNode.getAttribute("lid");
		}
		currentNode = currentNode.parentNode;
	}
	return null;
}

function getChildElementsByAttribute(oElm, aTagNames, strAttributeName, strAttributeValue)
{
	return getDescendantElementsByAttribute(oElm, aTagNames, strAttributeName, strAttributeValue, true);
}

function getElementsByAttribute(oElm, aTagNames, strAttributeName, strAttributeValue, maxSize, expAttributeValue) {

	return getDescendantElementsByAttribute(oElm, aTagNames, strAttributeName, strAttributeValue, false, maxSize, expAttributeValue);
}


function getDescendantElementsByAttribute(oElm, aTagNames, strAttributeName, strAttributeValue, childOnly, maxSize, expAttributeValue) {
	var arrReturnElements = [];
	var oAttributeValue = null;
	if( typeof expAttributeValue === "undefined")
	{
		oAttributeValue = (typeof strAttributeValue != "undefined") ? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)", "i"): null;
	}
	else
	{
		oAttributeValue = expAttributeValue;
	}

	if (typeof aTagNames == "string")
	{
		aTagNames = [aTagNames];
	}

	var tagLen = (oElm ? aTagNames.length : 0);
	for (var tagName=0; tagName < tagLen; tagName++)
	{
		var arrElements = null;
		if (childOnly)
		{
			if (aTagNames[tagName] == "*" && oElm.all)
			{
				arrElements = oElm.childNodes;
			}
			else
			{
				arrElements = [];
				var childNodes = oElm.childNodes;
				for (var i = 0; i < childNodes.length; ++i)
				{
					if (childNodes[i].nodeName.toLowerCase() == aTagNames[tagName].toLowerCase())
					{
						arrElements.push(childNodes[i]);
					}
				}
			}
		}
		else
		{
			arrElements = (aTagNames[tagName] == "*" && oElm.all) ? oElm.all : oElm.getElementsByTagName(aTagNames[tagName]);
		}
		var eleLen = arrElements.length;

		for (var idx = 0; idx < eleLen; idx++) {
			var oCurrent = arrElements[idx];
			var oAttribute = oCurrent.getAttribute && oCurrent.getAttribute(strAttributeName);

			if (oAttribute !== null) {
				var oAttributeString = null;
				if (typeof oAttribute === "number") {
					oAttributeString = String(oAttribute);
				} else if (typeof oAttribute === "string" && oAttribute.length > 0) {
					oAttributeString = oAttribute;
				}

				if(oAttributeString !== null) {
					if (typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttributeString))) {
						arrReturnElements.push(oCurrent);
						if (maxSize != -1 && arrReturnElements.length > maxSize) {
							return [];
						}
						else if (maxSize == 1 && arrReturnElements.length == 1) {
							return arrReturnElements;
						}
					}
				}
			}
		}
	}

	return arrReturnElements;
}

function savedOutputDoneLoading(cvId, count) {

	var oCV = window["oCV" + cvId];
	var oWidget = (oCV && oCV.getViewerWidget ? oCV.getViewerWidget() : null);
	var savedOutput = (oWidget ? oWidget.getSavedOutput() : null);

	if ( savedOutput ) {
		savedOutput.outputDoneLoading();
	} else if (count < 5) {
		// if we can't find the viewer object after a few tries, give up so we don't go into an endless loop.
		// Something bad must of happened since the iframe is done loading and we can't find the
		// correct viewer object to show the saved output
		count++;
		var _tryAgain = function() {
			savedOutputDoneLoading(cvId, count);
		};
		setTimeout(_tryAgain, 100);
	}
}

/*
 * Copied from V5HTML.xsl, so any fixes here must also be done there.
 */
function getNavVer()
{
	var temp;
	if (isIE()){
		return getIEVersion();
	} else {

		temp = navigator.userAgent.split('\/');
		return parseFloat(temp[temp.length - 1]);
	}
}

function isSafari()
{
	return (navigator.userAgent.toLowerCase().indexOf('safari') != -1);
}

/*
 * Copied from V5HTML.xsl, so any fixes here must also be done there.
 */
function isIE()
{
	return (navigator.userAgent.indexOf('MSIE') != -1 || navigator.userAgent.indexOf('Trident') != -1);
}

function getIEVersion()
{
	var regExMatch = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
	return regExMatch ? parseFloat(regExMatch[1]) : null;	
}

/**
 * Return true iff Firefox is the current browser.
 * Note that this works only for released versions of Firefox.
 */
/*
 * There is no analogous function in V5HTML.xsl, this is based on
 * information from:
 * http://www.quirksmode.org/js/detect.html
 */
function isFF()
{
	return (navigator.userAgent.indexOf('Firefox') != -1);
}

function isIOS()
{
	return navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1;
}

/*
 * Copied from V5HTML.xsl, so any fixes here must also be done there.
 */
function displayChart(imageName, imgSrc, useScale, isImage)
{
	if (imgSrc.length > 1){
		document.images[imageName].src = imgSrc;
	}
}

function isFlashChartNode(evt)
{
	var node = getNodeFromEvent(evt);
	if(node != null && typeof node.getAttribute == "function")
	{
		return node.getAttribute("flashChart") != null;
	}

	return false;
}

//TODO - this isn't really a common method, so it should be moved to a BUX specific area
function onFlashChartRightClick(evt)
{
	if (evt && evt.button && evt.button != 0 && isFlashChartNode(evt))
	{
		return onViewerChartFocus(evt);
	}
}

function onViewerChartFocus(evt)
{
	if (evt.stopPropagation) {evt.stopPropagation();}
	if (evt.preventDefault) {evt.preventDefault();}
	if (evt.preventCapture) {evt.preventCapture();}
	if (evt.preventBubble) {evt.preventBubble();}

	var node = getNodeFromEvent(evt);
	var viewerId = node.getAttribute("viewerId");

	// possible that the viewer is on the parent, try there
	if (!viewerId) {
		viewerId = node.parentNode.getAttribute("viewerId");
	}

	if (!viewerId) {
		return;
	}

	var oCV = window["oCV" + viewerId];
	var selectionAction = oCV.getAction("Selection");
	selectionAction.pageClicked(evt);
	return stopEventBubble(evt);
}

function clientToScreenCoords(domObject, offsetParent)
{
	var current = domObject;

	var coords = { topCoord:0, leftCoord:0 };

	while(current != null && current != offsetParent)
	{
		coords.topCoord += current.offsetTop; coords.leftCoord += current.offsetLeft;
		current = current.offsetParent;
	}

	return coords;
}

function getCurrentPosistionString(oCV, current, count)
{
	var positionString = RV_RES.IDS_JS_INFOBAR_ITEM_COUNT;
	var reParam0 = /\{0\}/;
	var reParam1 = /\{1\}/;
	positionString = positionString.replace(reParam0, current);
	positionString = " " + positionString.replace(reParam1, count) + " ";
	return positionString;
}

function applyJSONProperties(obj, properties) {
	for(property in properties) {
		if(typeof properties[property] == "object" && !(properties[property] instanceof Array)) {
			if(typeof obj[property] == "undefined") {
				obj[property] = {};
			}
			applyJSONProperties(obj[property], properties[property]);

		} else {
			obj[property] = properties[property];
		}
	}
};

/*
 * Class for containing common static functions
 */

 function CViewerCommon()
 {
 }

CViewerCommon.openNewWindowOrTab = function( sURL, sWindowName )
{
	//Leave the third parameter unspecified so that the browser's settings to open in tab/window will take effect.
	return window.open( sURL, sWindowName );
};

CViewerCommon.toJSON = function(obj) {
	var type = typeof (obj);
	if (type != "object" || type === null) {
		if (type === "string") {
			obj = '"'+obj+'"';
		}
		return String(obj);
	}
	else {
		var prototype;
		var prop;
		var json = [];
		var isArray = (obj && obj.constructor == Array);
		for (prototype in obj) {
			prop = obj[prototype];
			type = typeof(prop);
			if (type === "string") {
				prop = '"'+prop+'"';
			}
			else if (type == "object" && prop !== null) {
				prop = CViewerCommon.toJSON(prop);
			}
			json.push((isArray ? "" : '"' + prototype + '":') + String(prop));
		}
		return (isArray ? "[" : "{") + String(json) + (isArray ? "]" : "}");
	}
};

/*
 * Will resize all the pinned containers in the stand alone Viewer. 
 */
function resizePinnedContainers() {
	var oCV = window.gaRV_INSTANCES[0];

	if (oCV && !oCV.m_viewerFragment) {
		var oPinFreezeManager = oCV.getPinFreezeManager();
		if (oPinFreezeManager && oPinFreezeManager.hasFrozenContainers()) {

			var oRVContent = document.getElementById("RVContent" + oCV.getId());
			var mainViewerTable = document.getElementById("mainViewerTable" + oCV.getId());
			var pageWidth = oRVContent.clientWidth;
			var pageHeight = mainViewerTable.clientHeight;
				
			oPinFreezeManager.resize(pageWidth, pageHeight);
			
			// force IE to repaint the div or the the RVContent div won't resize
			if (isIE()) {
				oCV.repaintDiv(oRVContent);
			}
		}
	}
}

function setWindowHref(url) {
	var oldUnload=window.onbeforeunload;
	window.onbeforeunload=null;
	window.location.href = url;
	window.onbeforeunload=oldUnload;
}

/**
 *	Replaces parameter place holders in the specified msg with the specified args.
 *	args can be a string or any array, otherwise, it is treated as string.
 *	for example, getMessage("param0 {0}", 'zero") will return "param0 zero".
 */
CViewerCommon.getMessage = function(msg, args)
{
	if (typeof args == "undefined")
	{
		return msg;
	}
	else if (typeof args == "string")
	{
		msg = msg.replace("{0}", args);
	}
	else if (args.length)
	{
		for (var i = 0; i < args.length; ++i)
		{
			msg = msg.replace("{" + i + "}", args[i]);
		}
	}
	else
	{
		msg = msg.replace("{0}", args);
	}

	return msg;
};

function getViewerDirection() {
	if(window.gaRV_INSTANCES && window.gaRV_INSTANCES.length) {
		return gaRV_INSTANCES[0].getDirection();
	}
	return "ltr";
}

function isViewerBidiEnabled() {
	if(window.gaRV_INSTANCES && window.gaRV_INSTANCES.length) {
		var bidiEnabled = gaRV_INSTANCES[0].isBidiEnabled();
		if(bidiEnabled){
			return true;
		}
	}
	return false;
}

function getViewerBaseTextDirection() {
	if(window.gaRV_INSTANCES && window.gaRV_INSTANCES.length) {
		return gaRV_INSTANCES[0].getBaseTextDirection();
	}
	return "";
}
/**
 * Enforces current BTD on input string, by inserting unicode Bidi directional
 * marks before (LRE/RLE) and after (PDF).
 *
 * @param {string} sText, input string
 * @return {string} input string forced to current BTD
 */
function enforceTextDir(sText) {
	if(isViewerBidiEnabled() && sText){
		var sDir = getViewerBaseTextDirection();
		var bidiUtils = BidiUtils.getInstance();
		if(sDir == 'auto') {
			sDir = bidiUtils.resolveStrBtd(sText);
		}

		var strongSeparator = (!dojo._isBodyLtr()) ? bidiUtils.RLM : bidiUtils.LRM;
		return strongSeparator + ((sDir==="rtl") ? bidiUtils.RLE : bidiUtils.LRE) + sText + bidiUtils.PDF + strongSeparator;
	}
	return sText;
};
/**
 * returns the direction in use on the given element (ltr or rtl)
 */
function getElementDirection(element) {
	var dir = null;
	if(element.currentStyle) {	//IE
		dir = element.currentStyle.direction;
	} else if(window.getComputedStyle) { //FF
		var style = window.getComputedStyle(element,null);
		if(style) {
			dir = style.getPropertyValue("direction");
		}
	}
	if(dir) {
		dir = dir.toLowerCase();
	}
	return dir;
}

/**
 * Returns the amount an element have been scrolled to the left.
 * This function is necessary due to a Firefox behaviour, where in
 * RTL mode, the scrollLeft actually returns the amount scrolled
 * to the right, and the value is negative. In some places, this
 * is documented as an feature, in others, as a bug. See:
 * 	https://bugzilla.mozilla.org/show_bug.cgi?id=383026
 * 	https://developer.mozilla.org/en/DOM/element.scrollLeft
 * IE on the other hand always returns the distance scrolled from
 * the left, with a positive value, regardless of direction.
 */
function getScrollLeft(element) {
	if(getElementDirection(element) === "rtl" && isFF()) {
		// scrollLeft + offsetWidth + scrollRight = scrollWidth,
		// where scrollRight = -element.scrollLeft
		return element.scrollWidth - element.offsetWidth + element.scrollLeft;
	}
	return element.scrollLeft;
}

/**
 * Modifies the scroll position of the element such that it is
 * scrollLeft pixels from the left, regardless of the browser or
 * direction. (See comment on getScrollLeft for more details)
 */
function setScrollLeft(element, scrollLeft) {
	if(getElementDirection(element) === "rtl" && isFF()) {
		// scrollLeft + offsetWidth + scrollRight = scrollWidth,
		// where scrollRight = -element.scrollLeft
		element.scrollLeft = element.offsetWidth + scrollLeft - element.scrollWidth;
	} else {
		element.scrollLeft = scrollLeft;
	}
}

/**
 * Modifies the scroll position of the element such that it is
 * scrollRight pixels from the right, regardless of the browser
 * or direction. (See comment on getScrollLeft for more details)
 */
function setScrollRight(element, scrollRight) {
	if(getElementDirection(element) === "rtl" && isFF()) {
		//Take advantage of Firefox behaviour - less arithmetic
		element.scrollLeft = -scrollRight;
	} else {
		element.scrollLeft = element.scrollWidth - element.offsetWidth - scrollRight;
	}
}

/**
 * return the inherited padding and border rectangle properties in an
 * object (marginLeft/Right/Top/Bottom, borderLeftWidth/Right/Top/Bottom,
 * paddingLeft/Right/Top/Bottom).
 * Set the parameter toInt to true to strip out the "px" unit and make into
 * an int.
 */
function getBoxInfo(el, toInt) {
	//Set all styles as a static member of the function
	if(!getBoxInfo.aStyles) {
		getBoxInfo.aStyles = [
			{name: "marginLeft",	ie: "marginLeft",	ff: "margin-left"},
			{name: "marginRight",	ie: "marginRight",	ff: "margin-right"},
			{name: "marginTop", 	ie: "marginTop", 	ff: "margin-top"},
			{name: "marginBottom",	ie: "marginBottom",	ff: "margin-bottom"},
			{name: "borderLeftWidth",	ie: "borderLeftWidth",	ff: "border-left-width"},
			{name: "borderRightWidth",	ie: "borderRightWidth",	ff: "border-right-width"},
			{name: "borderTopWidth", 	ie: "borderTopWidth", 	ff: "border-top-width"},
			{name: "borderBottomWidth",	ie: "borderBottomWidth",	ff: "border-bottom-width"},
			{name: "paddingLeft",	ie: "paddingLeft",	ff: "padding-left"},
			{name: "paddingRight",	ie: "paddingRight",	ff: "padding-right"},
			{name: "paddingTop", 	ie: "paddingTop", 	ff: "padding-top"},
			{name: "paddingBottom",	ie: "paddingBottom",	ff: "padding-bottom"}
		];
	}

	var oSizing = {};
	var oStyle = null;

	if (el.currentStyle) { //IE
		oStyle = el.currentStyle;
	} else if (window.getComputedStyle) { //Firefox
		oStyle = window.getComputedStyle(el,null);
	}

	if(!oStyle) {
		return null;
	}

	for (i in getBoxInfo.aStyles) {
		var style = getBoxInfo.aStyles[i];
		var size = null;
		if(oStyle.getPropertyValue) {
			size = oStyle.getPropertyValue(style.ff);
		} else {
			size = oStyle[style.ie];
		}
		if(size && toInt) {
			size = Number(size.replace('px',''));
		}
		oSizing[style.name] = size;
	}

	return oSizing;
}
