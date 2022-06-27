/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2016
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

 /**
 * Implements authored drill through
 */
function AuthoredDrillAction()
{
	this.m_drillTargetSpecification = "";
}

AuthoredDrillAction.prototype = new CognosViewerAction();

AuthoredDrillAction.prototype.setRequestParms = function(drillTargetSpecification)
{
	this.m_drillTargetSpecification = drillTargetSpecification;
};


AuthoredDrillAction.prototype.executeDrillTarget = function(drillTargetSpecification)
{
	var drillTargetNode = XMLHelper_GetFirstChildElement( XMLBuilderLoadXMLFromString (drillTargetSpecification) );

	var sBookmarkRef = encodeURIComponent(drillTargetNode.getAttribute("bookmarkRef"));
	var sTargetPath = drillTargetNode.getAttribute("path");
	var bShowInNewWindow = this._shouldShowInNewWindow(drillTargetNode);
	var oCV = this.getCognosViewer();
	
	if((sBookmarkRef !== null && sBookmarkRef !== "") && (sTargetPath === null || sTargetPath === ""))
	{
		var sBookmarkPage = drillTargetNode.getAttribute("bookmarkPage");
		if (sBookmarkPage && sBookmarkPage !== "") {
			oCV.executeAction("GotoPage",{ "pageNumber": sBookmarkPage,"anchorName": sBookmarkRef} );
		} else {
			document.location = "#" + sBookmarkRef;
		}
	}
	else
	{
		var sTarget = "";
		if(bShowInNewWindow)
		{
			sTarget = "_blank";
		}

		var aArguments = [];

		var objPathArguments = [];
		objPathArguments.push("obj");
		objPathArguments.push(sTargetPath);

		aArguments[aArguments.length] = objPathArguments;
		
		var bHasPropertyToPass = false;

		var drillParameterArguments, drillParameterNode, sValue, sName, sNil;
		var drillParameterNodes = XMLHelper_FindChildrenByTagName(drillTargetNode, "drillParameter", false);
		for(var index = 0; index < drillParameterNodes.length; ++index)
		{
			drillParameterArguments = [];
			drillParameterNode = drillParameterNodes[index];
			sValue = drillParameterNode.getAttribute("value");
			sName = drillParameterNode.getAttribute("name");

			if(sValue !== null && sValue !== "")
			{
				drillParameterArguments.push("p_" + sName);
				drillParameterArguments.push(this.buildSelectionChoicesSpecification(drillParameterNode));
			}

			sNil = drillParameterNode.getAttribute("nil");
			if(sNil !== null && sNil !== "")
			{
				drillParameterArguments.push("p_" + sName);
				drillParameterArguments.push(this.buildSelectionChoicesNilSpecification());
			}

			if(drillParameterArguments.length > 0)
			{
				aArguments[aArguments.length] = drillParameterArguments;
			}
			
			if( !bHasPropertyToPass){
				var sPropertyToPass = drillParameterNode.getAttribute( "propertyToPass");
				bHasPropertyToPass = ( sPropertyToPass && sPropertyToPass.length > 0 ) ? true : false;
			}
		}

		var sMethod = drillTargetNode.getAttribute("method");

		var sOutputFormat = drillTargetNode.getAttribute("outputFormat");

		var sOutputLocale = drillTargetNode.getAttribute("outputLocale");

		var sPrompt = drillTargetNode.getAttribute("prompt");
		var dynamicDrill = drillTargetNode.getAttribute("dynamicDrill");

		var sSourceContext = this.getXMLNodeAsString(drillTargetNode, "parameters");
		var sObjectPaths = this.getXMLNodeAsString(drillTargetNode, "objectPaths");

		var oCVId = oCV.getId();
		// if the source and target are the same report, and the prompt attribute in drill definition is not set to true, and we're not opening a new window, then do a forward instead of a drillThrough action
		var formWarpRequest = document.forms["formWarpRequest" + oCVId];
		var callForward = oCV.getAdvancedServerProperty("VIEWER_JS_CALL_FORWARD_DRILLTHROUGH_TO_SELF");
		if ( (!callForward || callForward.toLowerCase() !== "false")  && sPrompt != "true" && this.isSameReport(formWarpRequest, sTargetPath) && this.isSameReportFormat(sOutputFormat) && !bShowInNewWindow && !bHasPropertyToPass  )
		{
			var cognosViewerRequest = new ViewerDispatcherEntry(oCV);
			cognosViewerRequest.addFormField("ui.action", "forward");

			if(oCV !== null && typeof oCV.rvMainWnd != "undefined")
			{
				oCV.rvMainWnd.addCurrentReportToReportHistory();
				var reportHistorySpecification = oCV.rvMainWnd.saveReportHistoryAsXML();
				cognosViewerRequest.addFormField("cv.previousReports", reportHistorySpecification);
			}

			// if we're drilling through to ourself we need to send empty parameters for
			// the parameters that are setup to no send any parameter values
			for(index = 0; index < drillParameterNodes.length; ++index)
			{
				drillParameterArguments = [];
				drillParameterNode = drillParameterNodes[index];
				sValue = drillParameterNode.getAttribute("value");
				sName = drillParameterNode.getAttribute("name");
				sNil = drillParameterNode.getAttribute("nil");

				if((sNil === null || sNil === "") && (sValue === null || sValue === ""))
				{
					drillParameterArguments.push("p_" + sName);
					drillParameterArguments.push(this.buildSelectionChoicesNilSpecification());
				}

				if(drillParameterArguments.length > 0)
				{
					aArguments[aArguments.length] = drillParameterArguments;
				}
			}

			for (index=1; index < aArguments.length; index++)
			{
				cognosViewerRequest.addFormField(aArguments[index][0], aArguments[index][1]);
			}

			cognosViewerRequest.addFormField("_drillThroughToSelf", "true");

			// If we're dealing with a tabbed report and drilling to ourselves, then make sure we show the first tab when the report refreshes
			if (oCV.m_tabsPayload && oCV.m_tabsPayload.tabs) {
				cognosViewerRequest.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup", oCV.m_tabsPayload.tabs[0].id)
			}
			
			oCV.setUsePageRequest(true);
			oCV.dispatchRequest(cognosViewerRequest);

			if (typeof oCV.m_viewerFragment == "undefined") {
				var objectRef = getCognosViewerObjectRefAsString(oCVId);
				setTimeout(objectRef+".getRequestIndicator().show()",10);
			}
		}
		else
		{
			doSingleDrill(sTarget, aArguments, sMethod, sOutputFormat, sOutputLocale, sBookmarkRef, sSourceContext, sObjectPaths, this.getCognosViewer().getId(), sPrompt, dynamicDrill);
		}
	}
};

AuthoredDrillAction.prototype._shouldShowInNewWindow = function(drillTargetNode) {
	return drillTargetNode.getAttribute("showInNewWindow") == "true";
};

AuthoredDrillAction.prototype.isSameReport = function( formWarpRequest, sTargetPath )
{
	if( formWarpRequest["ui.object"] && sTargetPath == formWarpRequest["ui.object"].value )
	{
		return true;
	}

	return false;

};

AuthoredDrillAction.prototype.isSameReportFormat = function( drillTargetFormat )
{
	var drillSourceFormat =  this.getCognosViewer().envParams["run.outputFormat"];
	if( drillSourceFormat )
	{
		if (drillTargetFormat == drillSourceFormat )
		{
			return true;
		}
		//the following case occurs when the target drill-thru definition is set to default format
		// and the source format is HTML.
		else if( drillSourceFormat == "HTML" && drillTargetFormat == "HTMLFragment")
		{
			return true;
		}
	}
	return false;
};

AuthoredDrillAction.prototype.getXMLNodeAsString = function(drillTargetNode, sNodeName)
{
	var sXML = "";
	if(drillTargetNode != null)
	{
		var node = XMLHelper_FindChildByTagName(drillTargetNode, sNodeName, false);
		if(node != null)
		{
			sXML = XMLBuilderSerializeNode(node);
		}
	}

	return sXML;
};

AuthoredDrillAction.prototype.execute = function(rvDrillTargetsSpecification)
{
	if(this.m_drillTargetSpecification != "")
	{
		this.executeDrillTarget(this.m_drillTargetSpecification);
	}
	else if(typeof rvDrillTargetsSpecification != "undefined")
	{
		var drillTargetSpecifications = this.getCognosViewer().getDrillTargets();
		var rvDrillTargetsNode = this.getAuthoredDrillThroughContext(rvDrillTargetsSpecification, drillTargetSpecifications);

		var drillTargets = rvDrillTargetsNode.childNodes;
		if(drillTargets.length == 1)
		{
			this.executeDrillTarget(XMLBuilderSerializeNode(drillTargets[0]));
		}
		else
		{
			doMultipleDrills(XMLBuilderSerializeNode(rvDrillTargetsNode), this.getCognosViewer().getId());
			//Need support from goto page
			//this.showDrillTargets(drillTargets);
		}
	}
};

AuthoredDrillAction.prototype.showDrillTargets = function(drillTargets)
{
	var sAuthoredDrillThroughContext = "<context>";

	for(var index = 0; index < drillTargets.length; ++index)
	{
		var drillTarget = drillTargets[index];

		sAuthoredDrillThroughContext += "<member>";

		var sName = drillTarget.getAttribute("label");
		sAuthoredDrillThroughContext += "<name>";
		sAuthoredDrillThroughContext += sXmlEncode(sName);
		sAuthoredDrillThroughContext += "</name>";

		var sDrillThroughSearchPath = drillTarget.getAttribute("path");
		sAuthoredDrillThroughContext += "<drillThroughSearchPath>";
		sAuthoredDrillThroughContext += sXmlEncode(sDrillThroughSearchPath);
		sAuthoredDrillThroughContext += "</drillThroughSearchPath>";

		var sDrillThroughAction = drillTarget.getAttribute("method");
		sAuthoredDrillThroughContext += "<drillThroughAction>";
		sAuthoredDrillThroughContext += sXmlEncode(sDrillThroughAction);
		sAuthoredDrillThroughContext += "</drillThroughAction>";

		var sDrillThroughFormat = drillTarget.getAttribute("outputFormat");
		sAuthoredDrillThroughContext += "<drillThroughFormat>";
		sAuthoredDrillThroughContext += sXmlEncode(sDrillThroughFormat);
		sAuthoredDrillThroughContext += "</drillThroughFormat>";

		var sData = "parent." + this.getTargetReportRequestString(drillTarget);
		sAuthoredDrillThroughContext += "<data>";
		sAuthoredDrillThroughContext += sXmlEncode(sData);
		sAuthoredDrillThroughContext += "</data>";

		sAuthoredDrillThroughContext += "</member>";
	}

	sAuthoredDrillThroughContext += "</context>";

	// need to fix the ui.backURL and errURL since they'll be getting rejected by caf. TODO post BSEINS
	//cvLoadDialog(this.getCognosViewer(), {"m":"portal/goto.xts","ui.backURL":"javascript:parent.destroyCModal();", "errURL":"javascript:parent.destroyCModal();","authoredDrillthru":sAuthoredDrillThroughContext}, 600, 425);
};

AuthoredDrillAction.prototype.populateContextMenu = function(rvDrillTargetsSpecification)
{
	var viewer = this.getCognosViewer();
	var toolbarCtrl = viewer.rvMainWnd.getToolbarControl();
	var authoredDrillDropDownMenu = null;
	if (typeof toolbarCtrl != "undefined" && toolbarCtrl != null)
	{
		var toolbarButton = toolbarCtrl.getItem("goto");
		if (toolbarButton)
		{
			authoredDrillDropDownMenu = toolbarButton.getMenu();
		}
	}

	var cognosViewerContextMenu = viewer.rvMainWnd.getContextMenu();
	var authoredDrillContextMenu = null;
	if (typeof cognosViewerContextMenu != "undefined" && cognosViewerContextMenu != null)
	{
		authoredDrillContextMenu = cognosViewerContextMenu.getGoToMenuItem().getMenu();
	}

	if(authoredDrillDropDownMenu != null || authoredDrillContextMenu != null)
	{
		var drillTargetSpecifications = this.getCognosViewer().getDrillTargets();
		var rvDrillTargetsNode = this.getAuthoredDrillThroughContext(rvDrillTargetsSpecification, drillTargetSpecifications);

		var drillTargets = rvDrillTargetsNode.childNodes;
		if(drillTargets.length > 0)
		{
			for(var index = 0; index < drillTargets.length; ++index)
			{
				var drillTarget = drillTargets[index];

				var sRequestString = getCognosViewerObjectRefAsString(this.getCognosViewer().getId()) + ".m_oDrillMgr.executeAuthoredDrill(\"" + encodeURIComponent(XMLBuilderSerializeNode(drillTarget)) + "\");";
				var sIconPath = this.getTargetReportIconPath(drillTarget);

				var sLabel = drillTarget.getAttribute("label");
				if(isViewerBidiEnabled()){
					var bidi = BidiUtils.getInstance();
					sLabel = bidi.btdInjectUCCIntoStr(sLabel, getViewerBaseTextDirection());
				}

				if (authoredDrillDropDownMenu != null)
				{
					new CMenuItem(authoredDrillDropDownMenu, sLabel, sRequestString, sIconPath, gMenuItemStyle, viewer.getWebContentRoot(), viewer.getSkin());
				}

				if (authoredDrillContextMenu != null)
				{
					new CMenuItem(authoredDrillContextMenu, sLabel, sRequestString, sIconPath, gMenuItemStyle, viewer.getWebContentRoot(), viewer.getSkin());
				}
			}
		}
	}

};

AuthoredDrillAction.prototype.buildSelectionChoicesNilSpecification = function()
{
	return "<selectChoices/>";
};

AuthoredDrillAction.prototype.buildSelectionChoicesSpecification = function(drillParameterNode)
{
	var sSelectionChoicesSpecification = "";

	var sValue = drillParameterNode.getAttribute("value");

	if(sValue != null)
	{
		var propToPass = drillParameterNode.getAttribute("propertyToPass");
		sSelectionChoicesSpecification += "<selectChoices";
		if (propToPass != null && propToPass != "")
		{
			sSelectionChoicesSpecification += " propertyToPass=\"";
			sSelectionChoicesSpecification += sXmlEncode(propToPass);
			sSelectionChoicesSpecification += "\"";
		}
		sSelectionChoicesSpecification += ">";
		
		// if RSVP already generated the selectChoices, grab everything AFTER the <selectChoices>
		if(sValue.indexOf("<selectChoices>") != -1)
		{
			sSelectionChoicesSpecification += sValue.substring(sValue.indexOf("<selectChoices>") + 15);
		}
		else if(sValue != "")
		{
			sSelectionChoicesSpecification += "<selectOption ";
			var sMun = drillParameterNode.getAttribute("mun");
			if(sMun != null && sMun != "")
			{
				var encodedMun = sXmlEncode(sMun);
				sSelectionChoicesSpecification += "useValue=\"";
				sSelectionChoicesSpecification += encodedMun;
				sSelectionChoicesSpecification += "\" ";

				sSelectionChoicesSpecification += "mun=\"";
				sSelectionChoicesSpecification += encodedMun;
				sSelectionChoicesSpecification += "\" ";

				sSelectionChoicesSpecification += "displayValue=\"";
				sSelectionChoicesSpecification += sXmlEncode(sValue);
				sSelectionChoicesSpecification += "\"";

			}
			else
			{
				sSelectionChoicesSpecification += "useValue=\"";
				sSelectionChoicesSpecification += sXmlEncode(sValue);
				sSelectionChoicesSpecification += "\" ";

				var sDisplayValue = drillParameterNode.getAttribute("displayValue");
				if(sDisplayValue == null || sDisplayValue == "")
				{
					sDisplayValue = sValue;
				}

				sSelectionChoicesSpecification += "displayValue=\"";
				sSelectionChoicesSpecification += sXmlEncode(sDisplayValue);
				sSelectionChoicesSpecification += "\"";
			}

			sSelectionChoicesSpecification += "/>";
			sSelectionChoicesSpecification += "</selectChoices>";
		}
	}

	return sSelectionChoicesSpecification;
};

AuthoredDrillAction.prototype.getPropertyToPass = function(parameterName, parameterProperties)
{
	if (parameterName != null && parameterName != "" && parameterProperties != null)
	{
		var parameterNodes = parameterProperties.childNodes;
		if (parameterNodes != null)
		{
			for(var index = 0; index < parameterNodes.length; ++index)
			{
				var parameterNode = parameterNodes[index];

				var sName = "";
				if (parameterNode.getAttribute("name") != null)
				{
					sName = parameterNode.getAttribute("name");
				}

				if (sName == parameterName)
				{
					return parameterNode.getAttribute("propertyToPass");
				}
			}
		}
	}

	return "";
};

AuthoredDrillAction.prototype.getTargetReportRequestString = function(drillTargetNode)
{
	var sRequestString = "";

	var sBookmarkRef = drillTargetNode.getAttribute("bookmarkRef");
	var sTargetPath = drillTargetNode.getAttribute("path");
	var sShowInNewWindow = drillTargetNode.getAttribute("showInNewWindow");

	if((sBookmarkRef != null && sBookmarkRef != "") && (sTargetPath == null || sTargetPath == ""))
	{
		sRequestString += "document.location=\"#";
		sRequestString += sBookmarkRef;
		sRequestString += "\";";
	}
	else
	{
		sRequestString += "doSingleDrill(";

		if(sShowInNewWindow == "true")
		{
			sRequestString += "\"_blank\",";
		}
		else
		{
			sRequestString += "\"\",";
		}

		sRequestString += "[[\"obj\",\"";
		sRequestString += encodeURIComponent(sTargetPath);
		sRequestString += "\"]";

		var drillParameterNodes = XMLHelper_FindChildrenByTagName(drillTargetNode, "drillParameter", false);
		for(var index = 0; index < drillParameterNodes.length; ++index)
		{
			var drillParameterNode = drillParameterNodes[index];
			var sValue = drillParameterNode.getAttribute("value");
			var sName = drillParameterNode.getAttribute("name");

			if(sValue != null && sValue != "")
			{
				sRequestString += ", [\"p_" + sName + "\",\"" + encodeURIComponent(this.buildSelectionChoicesSpecification(drillParameterNode)) + "\"]";
			}

			var sNil = drillParameterNode.getAttribute("nil");
			if(sNil != null && sNil != "")
			{
				sRequestString += "\", [\"p_" + sName + "\",\"" + encodeURIComponent(this.buildSelectionChoicesNilSpecification()) + "\"]";
			}
		}

		sRequestString += "],";

		var sMethod = drillTargetNode.getAttribute("method");
		sRequestString += "\"" + encodeURIComponent(sMethod) + "\",";

		var sOutputFormat = drillTargetNode.getAttribute("outputFormat");
		sRequestString += "\"" + encodeURIComponent(sOutputFormat) + "\",";

		var sOutputLocale = drillTargetNode.getAttribute("outputLocale");
		sRequestString += "\"" + encodeURIComponent(sOutputLocale) + "\",";

		sRequestString += "\"" + encodeURIComponent(sBookmarkRef) + "\",";

		var sSourceContext = XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(drillTargetNode, "parameters", false));
		sRequestString += "\"" + encodeURIComponent(sSourceContext) + "\",";

		var sObjectPaths = XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(drillTargetNode, "objectPaths", false));
		sRequestString += "\"" + encodeURIComponent(sObjectPaths) + "\",";

		sRequestString += "\"" + encodeURIComponent(this.getCognosViewer().getId()) + "\",";

		var sPrompt = drillTargetNode.getAttribute("prompt");
		sRequestString += "\"" + encodeURIComponent(sPrompt) + "\",";

		var dynamicDrill = drillTargetNode.getAttribute("dynamicDrill");
		sRequestString += " " + encodeURIComponent(dynamicDrill);

		sRequestString += ");";
	}

	return sRequestString;
};

AuthoredDrillAction.prototype.getTargetReportIconPath = function(drillTarget)
{
	var sIconPath = "";
	var sBookmarkRef = drillTarget.getAttribute("bookmarkRef");
	var drillParameterNode = XMLHelper_FindChildByTagName(drillTarget, "drillParameter", false);
	if((sBookmarkRef != null && sBookmarkRef != "") && drillParameterNode == null)
	{
		sIconPath = "/common/images/spacer.gif";
	}
	else
	{
		var sMethod = drillTarget.getAttribute("method");
		switch(sMethod)
		{
			case "editAnalysis":
				sIconPath = "/ps/portal/images/icon_ps_analysis.gif";
				break;
			case "editQuery":
				sIconPath = "/ps/portal/images/icon_qs_query.gif";
				break;
			case "execute":
				sIconPath = "/ps/portal/images/action_run.gif";
				break;
			case "view":
				var sOutputFormat = drillTarget.getAttribute("outputFormat");

				switch(sOutputFormat)
				{
					case "HTML":
					case "XHTML":
					case "HTMLFragment":
						sIconPath = "/ps/portal/images/icon_result_html.gif";
						break;
					case "PDF":
						sIconPath = "/ps/portal/images/icon_result_pdf.gif";
						break;
					case "XML":
						sIconPath = "/ps/portal/images/icon_result_xml.gif";
						break;
					case "CSV":
						sIconPath = "/ps/portal/images/icon_result_csv.gif";
						break;
					case "XLS":
						sIconPath = "/ps/portal/images/icon_result_excel.gif";
						break;
					case "SingleXLS":
						sIconPath = "/ps/portal/images/icon_result_excel_single.gif";
						break;
					case "XLWA":
						sIconPath = "/ps/portal/images/icon_result_excel_web_arch.gif";
						break;
					default:
						sIconPath = "/common/images/spacer.gif";
				}
				break;
			default:
				sIconPath = "/common/images/spacer.gif";
		}
	}

	return this.getCognosViewer().getWebContentRoot() + sIconPath;
};


AuthoredDrillAction.prototype.getAuthoredDrillThroughContext = function(sAuthoredDrillThroughTargets, drillTargetSpecifications)
{
	// validate the incoming arguments
	if(typeof sAuthoredDrillThroughTargets != "string" || typeof drillTargetSpecifications != "object")
	{
		return null;
	}

	// parse the xml string and validate it
	var xmlParsedDrillTargets = XMLBuilderLoadXMLFromString(sAuthoredDrillThroughTargets);
	if(xmlParsedDrillTargets == null || xmlParsedDrillTargets.firstChild == null)
	{
		return null;
	}

	// validate the root node
	var rootNode = XMLHelper_GetFirstChildElement( xmlParsedDrillTargets );
	if(XMLHelper_GetLocalName(rootNode) != "AuthoredDrillTargets")
	{
		return null;
	}

	// validate the rvDrillTargets node
	var rvDrillTargetNodes = XMLHelper_GetFirstChildElement( rootNode );
	if(XMLHelper_GetLocalName(rvDrillTargetNodes) != "rvDrillTargets")
	{
		return null;
	}

	// validate the drillTargets node
	var drillTargets = rvDrillTargetNodes.childNodes;
	if(drillTargets === null || drillTargets.length === 0)
	{
		return null;
	}

	var rvDrillTargetsElement = self.XMLBuilderCreateXMLDocument("rvDrillTargets");

	for(var drillTargetIdx = 0; drillTargetIdx < drillTargets.length; ++drillTargetIdx)
	{
		if(typeof drillTargets[drillTargetIdx].getAttribute == "undefined")
		{
			continue;
		}

		var drillTargetElement = rvDrillTargetsElement.createElement("drillTarget");
		rvDrillTargetsElement.documentElement.appendChild(drillTargetElement);

		var bookmarkRef = drillTargets[drillTargetIdx].getAttribute("bookmarkRef");
		if(bookmarkRef === null)
		{
			drillTargetElement.setAttribute("bookmarkRef", "");
		}
		else
		{
			drillTargetElement.setAttribute("bookmarkRef", bookmarkRef);
		}
		
		var bookmarkPage = drillTargets[drillTargetIdx].getAttribute("bookmarkPage");
		if(bookmarkPage === null)
		{
			drillTargetElement.setAttribute("bookmarkPage", "");
		}
		else
		{
			drillTargetElement.setAttribute("bookmarkPage", bookmarkPage);
		}

		var drillTargetRefIdx = drillTargets[drillTargetIdx].getAttribute("drillIdx");
		if(drillTargetRefIdx == null)
		{
			continue;
		}

		if(drillTargetRefIdx >= drillTargetSpecifications.length)
		{
			continue;
		}

		var drillTargetRef = drillTargetSpecifications[drillTargetRefIdx];
		if(typeof drillTargetRef != "object")
		{
			continue;
		}

		drillTargetElement.setAttribute("outputFormat", drillTargetRef.getOutputFormat());
		drillTargetElement.setAttribute("outputLocale", drillTargetRef.getOutputLocale());
		drillTargetElement.setAttribute("prompt", drillTargetRef.getPrompt());
		drillTargetElement.setAttribute("dynamicDrill", drillTargetRef.isDynamicDrillThrough() ? "true" : "false");

		var useLabel = drillTargets[drillTargetIdx].getAttribute("label");
		if(useLabel === null || useLabel === "")
		{
			useLabel = drillTargetRef.getLabel();
		}

		drillTargetElement.setAttribute("label", useLabel);
		drillTargetElement.setAttribute("path", drillTargetRef.getPath());
		drillTargetElement.setAttribute("showInNewWindow", drillTargetRef.getShowInNewWindow());

		drillTargetElement.setAttribute("method", drillTargetRef.getMethod());

		var currentRvDrillTargetNode = rvDrillTargetNodes;

		var oParameterProperties = "";
		var drillTargetParamProps = drillTargetRef.getParameterProperties();
		if (typeof drillTargetParamProps != "undefined" && drillTargetParamProps != null && drillTargetParamProps != "")
		{
			oParameterProperties = XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(drillTargetRef.getParameterProperties()));
		}

		while(currentRvDrillTargetNode)
		{
			var drillParameters = currentRvDrillTargetNode.childNodes[drillTargetIdx].childNodes;
			for(var drillParamIdx = 0; drillParamIdx < drillParameters.length; ++drillParamIdx)
			{
				var drillParameterElement = drillParameters[drillParamIdx].cloneNode(true);
				if (oParameterProperties)
				{
					var propertyToPass = this.getPropertyToPass(drillParameterElement.getAttribute("name"), oParameterProperties);
					if (propertyToPass != null && propertyToPass != "")
					{
						drillParameterElement.setAttribute("propertyToPass", propertyToPass);
					}
				}
				drillTargetElement.appendChild(drillParameterElement);
			}

			currentRvDrillTargetNode = currentRvDrillTargetNode.nextSibling;
		}

		var rootOpenTag = '<root xmlns:bus="http://developer.cognos.com/schemas/bibus/3/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
		var rootCloseTag = '</root>';

		var drillTargetParametersString = rootOpenTag + drillTargetRef.getParameters() + rootCloseTag;
		var drillTargetParametersXML = XMLBuilderLoadXMLFromString(drillTargetParametersString);

		var oChild = XMLHelper_GetFirstChildElement( XMLHelper_GetFirstChildElement( drillTargetParametersXML ) );
		if (oChild)
		{
			drillTargetElement.appendChild(oChild.cloneNode(true));
		}

		var drillTargetObjectPathsString = rootOpenTag + drillTargetRef.getObjectPaths() + rootCloseTag;
		var drillTargetObjectPathsXML = XMLBuilderLoadXMLFromString(drillTargetObjectPathsString);

		oChild = XMLHelper_GetFirstChildElement( XMLHelper_GetFirstChildElement( drillTargetObjectPathsXML ) );
		if (oChild)
		{
			drillTargetElement.appendChild(oChild.cloneNode(true));
		}

	}

	return XMLHelper_GetFirstChildElement(rvDrillTargetsElement);

};
