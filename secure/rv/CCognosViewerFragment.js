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
function CCognosViewerFragment(cognosViewer)
{
	this.m_cognosViewer = cognosViewer;

	this.m_bUseFrameworkEvents = false;

	this.m_bSharePromptValues = false;
	this.m_bMatchOnParameterNameOnly = false;
	this.m_reportParameters = {};
	this.m_burstItems = {};
	this.m_promptChannel = "";

	this.m_bShareDrillEvents = false;
	this.m_drillChannel = "";

	this.m_bShareAuthoredDrillEvents = false;
	this.m_authoredDrillChannel = "";

	this.m_fragmentUpdateList = [];

	this.m_toolbarProperties = "hidden";
	this.m_fragmentWindowState = "";

	this.m_bTransientUpdateCalled = false;

	this.m_saveReportInProgress = false;

	if(cognosViewer && typeof cognosViewer.envParams["fragment.toolbarProperties"] != "undefined")
	{
		this.m_toolbarProperties = cognosViewer.envParams["fragment.toolbarProperties"];
	}
}

CCognosViewerFragment.prototype.fireEventWhenComplete = function() {
	var envParams = this.m_cognosViewer.envParams;
	if (envParams["fragment.fireEventWhenComplete"] && envParams["fragment.fireEventWhenComplete"].length > 0) {
		var fragmentImpl = this.getFragmentObject();
		fragmentImpl.raiseEvent(envParams["fragment.fireEventWhenComplete"], "", "");
		
		envParams["fragment.fireEventWhenComplete"] = "";
	}	
}

CCognosViewerFragment.prototype.isBUX = function()
{
	if (this.m_bBux == true)
	{
		return true;
	}

	return false;
};

CCognosViewerFragment.prototype.getCognosViewer = function()
{
	return this.m_cognosViewer;
};

CCognosViewerFragment.prototype.raiseEvent = function(sEvent, sPayLoad, sScope)
{
	if(this.m_bUseFrameworkEvents === false && typeof window.gaRV_INSTANCES != "undefined")
	{
		for(var viewerInstance = 0; viewerInstance < window.gaRV_INSTANCES.length; ++viewerInstance)
		{
			var cognosViewer = window.gaRV_INSTANCES[viewerInstance];
			if(typeof cognosViewer != "undefined" && this.m_cognosViewer.getId() != cognosViewer.getId() && typeof cognosViewer.m_viewerFragment != "undefined")
			{
				cognosViewer.m_viewerFragment.viewerEvent(sPayLoad);
			}
		}
	}
	else
	{
		var fragmentImpl = this.getFragmentObject();
		fragmentImpl.raiseEvent(sEvent, sPayLoad, sScope);
	}

};

CCognosViewerFragment.prototype.addToUpdateList = function(viewerFragment)
{
	this.m_fragmentUpdateList.push(viewerFragment);
};

CCognosViewerFragment.prototype.sharePromptValues = function()
{
	return this.m_bSharePromptValues;
};

CCognosViewerFragment.prototype.matchOnParameterNameOnly = function()
{
	return this.m_bMatchOnParameterNameOnly;
};

CCognosViewerFragment.prototype.hasPromptChannel = function()
{
	return (this.m_promptChannel != "");
};

CCognosViewerFragment.prototype.getPromptChannel = function()
{
	return this.m_promptChannel;
};

CCognosViewerFragment.prototype.getParameterMap = function()
{
	var specMap = this.m_cognosViewer.envParams["fragment.transientSpecMap"];
	if(specMap == "burst")
	{
		return this.m_burstItems;
	}
	else if (specMap == "parameter")
	{
		return this.m_reportParameters;
	}

	// fall back on the ui.action
	var sAction = this.m_cognosViewer.envParams["ui.action"];
	if(sAction == "view")
	{
		return this.m_burstItems;
	}
	else
	{
		return this.m_reportParameters;
	}
};

CCognosViewerFragment.prototype.getPromptValue = function(sParameterName, sModelItem, sPromptChannel)
{
	var sValue = null;

	if(this.getPromptChannel() == sPromptChannel)
	{
		var parameterMap = this.getParameterMap();

		if(sModelItem != "" && !this.matchOnParameterNameOnly()){
			// first try to match on the model item
			for(var key in parameterMap)
			{
				if(parameterMap[key] == sModelItem)
				{
					if(this.hasPromptChannel() && sParameterName.indexOf("PROMPTCHANNEL_" + this.getPromptChannel()) == -1)
					{
						continue;
					}

					sValue = key;
					break;

				}
			}
		}
		//When modelItem is empty or could not match on the model item, return the parameter name.
		if(sValue == null && sParameterName in parameterMap)
		{
			sValue = sParameterName;
		}
	}

	return sValue;
};

CCognosViewerFragment.prototype.shareDrillEvents = function()
{
	return this.m_bShareDrillEvents;
};

CCognosViewerFragment.prototype.hasDrillChannel = function()
{
	return (this.m_drillChannel != "");
};

CCognosViewerFragment.prototype.getDrillChannel = function()
{
	return this.m_drillChannel;
};

CCognosViewerFragment.prototype.shareAuthoredDrillEvents = function()
{
	return this.m_bShareAuthoredDrillEvents;
};

CCognosViewerFragment.prototype.hasAuthoredDrillChannel = function()
{
	return (this.m_authoredDrillChannel != "");
};

CCognosViewerFragment.prototype.getAuthoredDrillChannel = function()
{
	return this.m_authoredDrillChannel;
};

CCognosViewerFragment.prototype.getFragmentObject = function()
{
	var fragmentObject = null;
	try
	{
		fragmentObject = window[this.m_cognosViewer.getId()];
	}
	catch(exception){}

	return fragmentObject;
};

CCognosViewerFragment.prototype.isWaitPage = function()
{
	if (this.m_cognosViewer != null && this.m_cognosViewer.isWorking())
	{
		return true;
	}

	return false;
};

CCognosViewerFragment.prototype.canShowToolbar = function()
{
	if (this.isWaitPage())
	{
		return false;
	}

	var fragmentObject = this.getFragmentObject();
	if(fragmentObject)
	{
		switch(this.m_toolbarProperties)
		{
			case "show":
				return true;
			case "showMaximized":
				return (fragmentObject.windowState == "maximized");
			case "showNormal":
				return (fragmentObject.windowState == "normal");
			default:
				return false;
		}
	}

	return false;
};

CCognosViewerFragment.prototype.showToolbar = function(bShow)
{
	if(typeof this.m_cognosViewer.rvMainWnd != "undefined")
	{
		var toolbar = this.m_cognosViewer.rvMainWnd.getToolbar();

		if(toolbar)
		{
			if(bShow)
			{
				toolbar.showBar();
			}
			else
			{
				toolbar.hideBar();
			}

			return true;
		}
	}

	return false;
};


CCognosViewerFragment.prototype.onloadEvent = function(evt, state)
{
	var sourcePayload = (evt && evt.payload) ? evt.payload.source : "";

	if (sourcePayload === "cache")
	{
		if (state) {
			var requestHandler = new RequestHandler(this.m_cognosViewer);
			requestHandler.updateViewerState(state);
		}

		// if the payload source flag is set to cache, that means the user did a browser back or forward.
		// the best we can do in this situation is to rerun the report from scratch
		var frag = this.getFragmentObject();
		if (frag != null && typeof frag != "undefined")
		{
			frag.retrieve("cv.ignoreState=true");
		}
	}
	else
	{
		this.fireEventWhenComplete();
		if (state != null)
		{
			var requestHandler = new RequestHandler(this.m_cognosViewer);
			requestHandler.processInitialResponse(state);
		}

		if(typeof this.m_cognosViewer.rvMainWnd != "undefined")
		{
			if (!this.isWaitPage())
			{
				this.m_cognosViewer.rvMainWnd.draw();
				this.showToolbar(this.canShowToolbar());
			}
		}
	}
};

CCognosViewerFragment.prototype.unloadEvent = function(evt)
{
	var frag = this.getFragmentObject();

	if (frag != null && typeof frag != "undefined")
	{
		frag.removeEventListener("fragment.load", this.m_cognosViewer.getId() + "handleFragmentLoadEvent", false);
	}

	this.m_cognosViewer.closeContextMenuAndToolbarMenus();
	
	var selectionController = this.m_cognosViewer.getSelectionController();

	selectionController.updateUI(document, selectionController.getSelections(), true, false);
};

CCognosViewerFragment.prototype.refreshEvent = function(evt)
{

	this.m_cognosViewer.setKeepSessionAlive(true);

	if(typeof this.m_cognosViewer.rvMainWnd != "undefined")
	{
		this.m_cognosViewer.rvMainWnd.hideOpenMenus();
	}

	var selectionController =this.m_cognosViewer.getSelectionController();

	selectionController.updateUI(document, selectionController.getSelections(), true, false);

};

CCognosViewerFragment.prototype.visibilityChangedEvent = function(evt)
{
	if (evt && evt.payload && evt.payload.currentVisibility === "hidden" && evt.payload.newVisibility === "visible")
	{
		/*
		 * This is a bug in firefox (https://bugzilla.mozilla.org/show_bug.cgi?id=180802)
		 * where the pdf plug-in gets destroyed when you set the visibility of the iframe or
		 * its container to none. However, there is a work-around to set the iframes src attribute
		 * which will force the plug-in to load again
		 */
		if (this.m_cognosViewer.sBrowser === "moz" && this.m_cognosViewer.rvMainWnd.getCurrentFormat() === "PDF")
		{
			var oReportIFrame = document.getElementById("CVIFrame" + this.m_cognosViewer.getId());
			if (typeof oReportIFrame != "undefined")
			{
				oReportIFrame.setAttribute("src", oReportIFrame.getAttribute("src"));
			}
		}
	} else if (evt && evt.payload && evt.payload.currentVisibility === "visible") {
		this.m_cognosViewer.closeContextMenuAndToolbarMenus();
	}
};

CCognosViewerFragment.prototype.retrieveBeforeEvent = function(evt)
{
	// if there's no payload then we were called by a transientUpdate
	if (typeof evt.payload === "string" && evt.payload.length == 0)
	{
		if (this.m_cognosViewer.isWorkingOrPrompting() || this.m_bTransientUpdateCalled == true)
		{
			var frag = this.getFragmentObject();
			if (frag != null && typeof frag != "undefined")
			{
				// this stops the fragment fragment from doing a retrive on us since we're taking care of it.
				evt.preventDefault();

				var sParams = "cv.ignoreState=true";

				for(var param in this.m_cognosViewer.envParams)
				{
					if(param.indexOf("frag-") != 0 && param != "cv.fragmentEvent" && param != "cv.transientSpec" && param != "cv.actionState" && param != "globalViewerTransient")
					{
						sParams += "&" + param + encodeURIComponent(this.m_cognosViewer.envParams[param]);
					}
				}
				frag.retrieve(sParams);
			}
		}

		this.m_bTransientUpdateCalled = true;
	}
};

CCognosViewerFragment.prototype.windowStateChangedEvent = function(evt)
{
	var fragmentObject = this.getFragmentObject();
	if(fragmentObject)
	{
		fragmentObject.windowState = evt.payload.newWindowState;
		this.showToolbar(this.canShowToolbar());
	}
};

CCognosViewerFragment.prototype.changePromptValues = function(formFields)
{
	var sEventPayLoad = "<parameters>";

	var bCredentialParameter = false;

	var formFieldNames = formFields.keys();
	for (var index = 0; index < formFieldNames.length; index++)
	{
		var requestParam = formFieldNames[index];
		
		if(requestParam.indexOf("p_") == 0)
		{
			var sParameterValue = formFields.get(requestParam);

			requestParam = requestParam.substring(2, requestParam.length);

			if(requestParam.indexOf("credential:") == 0)
			{
				bCredentialParameter = true;
				sEventPayLoad += "<parameter name=\"" + sXmlEncode(requestParam) + "\">" + sXmlEncode(sParameterValue) + "</parameter>";
			}
			else
			{
				if(this.hasPromptChannel())
				{
					requestParam = "PROMPTCHANNEL_" + this.getPromptChannel() + requestParam;
				}

				if(this.getPromptValue(requestParam, "", this.getPromptChannel()) != null)
				{
					var sModelItem = this.m_reportParameters[requestParam];
					sEventPayLoad += "<parameter name=\"" + sXmlEncode(requestParam) + "\" modelItem=\"" + sXmlEncode(sModelItem) + "\">" + sXmlEncode(sParameterValue) + "</parameter>";
				}
			}
		}
	}

	sEventPayLoad += "</parameters>";

	if(bCredentialParameter)
	{
		sEventPayLoad = "<credentialParameterEntered>" + sEventPayLoad + "</credentialParameterEntered>";
		this.raiseEvent("cognos.viewer.*", sEventPayLoad, "page");
	}
	else if(this.sharePromptValues())
	{
		sEventPayLoad = "<updatePromptValues>" + sEventPayLoad + "</updatePromptValues>";
		return this.viewerEvent(sEventPayLoad);
	}

	return false;
};

CCognosViewerFragment.prototype.viewerEvent = function(sPayload)
{
	var viewerFragmentEvent = new CCognosViewerFragmentEvent(this.m_cognosViewer, sPayload);
	return viewerFragmentEvent.execute();
};

CCognosViewerFragment.prototype.raiseAuthoredDrillEvent = function(sDrillSpecification)
{
	var sPayLoad = "<authoredDrillThrough>";
	sPayLoad += "<authoredDrillChannel>";
	sPayLoad += this.getAuthoredDrillChannel();
	sPayLoad += "</authoredDrillChannel>";
	sPayLoad += sDrillSpecification;
	sPayLoad += "</authoredDrillThrough>";

	if(this.shareAuthoredDrillEvents())
	{
		this.raiseEvent("cognos.viewer.*", "<collectAuthoredDrillThroughListeners><controllerFragment>" + this.m_cognosViewer.getId() + "</controllerFragment><authoredDrillChannel>" + this.getAuthoredDrillChannel() + "</authoredDrillChannel><sharePromptValues>" + this.sharePromptValues() +"</sharePromptValues></collectAuthoredDrillThroughListeners>", "page");
	}
	else
	{
		this.m_fragmentUpdateList.push(this);
	}

	for(var index = 0; index < this.m_fragmentUpdateList.length; ++index)
	{
		var viewerFragmentToUpdate = this.m_fragmentUpdateList[index];
		var authoredDrillEvent = new CCognosViewerFragmentEvent(viewerFragmentToUpdate.m_cognosViewer, sPayLoad);
		authoredDrillEvent.execute();
	}

	this.m_fragmentUpdateList = [];
};

CCognosViewerFragment.prototype.getSelectionContext = function()
{
	var oCV = this.getCognosViewer();
	var modelPath = oCV.getModelPath();
	var sSelectionContext = "";

	if(typeof getViewerSelectionContext != "undefined" && typeof CSelectionContext != "undefined")
	{
		sSelectionContext = getViewerSelectionContext(oCV.getSelectionController(), new CSelectionContext(modelPath));
	}

	return sSelectionContext;
};

CCognosViewerFragment.prototype.raiseAADrillUpEvent = function()
{
	var fragmentImpl = this.getFragmentObject();
	fragmentImpl.raiseEvent("cognos.viewer.AADrillUp", {"selectionContext":this.getSelectionContext()}, "page");
};

CCognosViewerFragment.prototype.raiseAADrillDownEvent = function()
{
	var fragmentImpl = this.getFragmentObject();
	fragmentImpl.raiseEvent("cognos.viewer.AADrillDown", {"selectionContext":this.getSelectionContext()}, "page");
};

CCognosViewerFragment.prototype.raiseAuthoredDrillClickEvent = function()
{
	var fragmentImpl = this.getFragmentObject();
	fragmentImpl.raiseEvent("cognos.viewer.authoredDrillClickEvent", {"selectionContext":this.getSelectionContext()}, "page");
};

CCognosViewerFragment.prototype.raiseGotoContextMenuEvent = function()
{
	var oCV = this.getCognosViewer();

	var contextMenu = oCV.rvMainWnd.getContextMenu();

	var gtContextMenu = null;

	if (typeof contextMenu != "undefined" && contextMenu != null)
	{
		gtContextMenu = contextMenu.getGoToMenuItem().getMenu();
	}

	if (gtContextMenu != "undefined" && gtContextMenu != null && gtContextMenu.getNumItems() == 0)
	{
		var fragmentImpl = this.getFragmentObject();
		fragmentImpl.raiseEvent("cognos.viewer.gotoContextMenu", {"gotoContextMenu":gtContextMenu, "selectionContext":this.getSelectionContext(),"webContentRoot":oCV.getWebContentRoot(),"skin":oCV.getSkin()}, "page");
	}
};

function CCognosViewerFragmentEvent(cognosViewer, sPayload)
{
	this.m_cognosViewer = cognosViewer;
	this.m_viewerEventSpecification = XMLBuilderLoadXMLFromString(sPayload);
}

CCognosViewerFragmentEvent.prototype.getFragmentObject = function()
{
	return this.getViewerFragment().getFragmentObject();
};

CCognosViewerFragmentEvent.prototype.getViewerFragment = function()
{
	return this.m_cognosViewer.m_viewerFragment;
};

CCognosViewerFragmentEvent.prototype.getEventNode = function()
{
	if(this.m_viewerEventSpecification != null)
	{
		var eventNode = this.m_viewerEventSpecification.childNodes;
		if(eventNode && eventNode.length == 1)
		{
			return eventNode[0];
		}
	}

	return null;
};

CCognosViewerFragmentEvent.prototype.execute = function()
{
	var eventNode = this.getEventNode();
	if(eventNode != null)
	{
		var eventName = eventNode.nodeName;
		try
		{
			this.eventMethod = eval("this." + eventName + "Event");
			return this.eventMethod(eventNode);
		}
		catch(e)
		{

		}
	}
};

CCognosViewerFragmentEvent.prototype.addRequestParams = function(eventSpecification, oParams)
{
	for(var index = 0; index < eventSpecification.childNodes.length; ++index)
	{
		var node = eventSpecification.childNodes[index];
		var sName = XMLHelper_GetLocalName(node);
		if(sName.indexOf("p_") != 0 && sName != "parameters")
		{
			var sValue = XMLHelper_GetText(node);
			oParams.add(sName, sValue);
		}
	}
};

CCognosViewerFragmentEvent.prototype.addRequestParameterValues = function(eventSpecification, viewRequestObject)
{
	var parameters = XMLHelper_FindChildByTagName(eventSpecification, "parameters", false);
	if(parameters != null)
	{
		var parameterNodes = XMLHelper_FindChildrenByTagName(parameters, "parameter", false);
		for(var index = 0; index < parameterNodes.length; ++index)
		{
			var parameter = parameterNodes[index];
			var parameterName = parameter.getAttribute("name");
			if(parameterName != null && parameterName != "")
			{
				var parameterValue = XMLHelper_GetText(parameter);
				if(parameterValue != null)
				{
					viewRequestObject.addFormField("p_" + parameterName, parameterValue);
				}
			}
		}
	}
};

CCognosViewerFragmentEvent.prototype.getTransientSpecification = function(updateList)
{
	var fragmentImpl = this.getFragmentObject();
	var transientSpec = fragmentImpl.transientState["globalViewerTransient"];
	if(transientSpec == "" || transientSpec == null)
	{
		transientSpec = "<parameters>";
		for(var fragmentIndex = 0; fragmentIndex < updateList.length; ++fragmentIndex)
		{
			var viewerFragment = updateList[fragmentIndex];
			var sPromptChannel = viewerFragment.getPromptChannel();

			var reportParameterList = viewerFragment.m_reportParameters;
			for(var reportParameter in reportParameterList)
			{
				transientSpec += "<parameter name=\"" + sXmlEncode(reportParameter) + "\" modelItem=\"" + sXmlEncode(reportParameterList[reportParameter]) + "\" channel=\"" + sXmlEncode(sPromptChannel) + "\"/>";
			}

			var burstItemList = updateList[fragmentIndex].m_burstItems;
			for(var burstItem in burstItemList)
			{
				transientSpec += "<parameter name=\"" + sXmlEncode(burstItem) + "\" modelItem=\"" + sXmlEncode(burstItemList[burstItem]) + "\" channel=\"" + sXmlEncode(sPromptChannel) + "\"/>";
			}
		}
		transientSpec += "</parameters>";
	}

	return transientSpec;
};

CCognosViewerFragmentEvent.prototype.updateGlobalTransientSpec = function(updateList, rootNode, sParameterNodeName)
{
	var viewerFragment = this.getViewerFragment();
	var viewerFragmentTransient = new CViewerFragmentTransient(this.getTransientSpecification(updateList), viewerFragment);

	var parameterList = XMLHelper_FindChildrenByTagName(rootNode, sParameterNodeName, false);
	var sPromptChannel = viewerFragment.getPromptChannel();
	for(var paramIndex = 0; paramIndex < parameterList.length; ++paramIndex)
	{
		var parameter = parameterList[paramIndex];
		var sParamName = parameter.getAttribute("name");
		var sModelItem = parameter.getAttribute("modelItem");
		var sParamValue = XMLHelper_GetText(parameter);

		if(sParamValue == "")
		{
			continue;
		}

		if(sParamValue == "<selectChoices></selectChoices>")
		{
			if(sParamName in viewerFragmentTransient.m_transientItems)
			{
				var transientToUpdate = viewerFragmentTransient.m_transientItems[sParamName][sModelItem];
				if (typeof transientToUpdate != "undefined")
				{
					if (transientToUpdate.m_value == "" || transientToUpdate.m_value == sParamValue)
					{
						continue;
					}
				}
			}
		}

		for(var fragmentIndex = 0; fragmentIndex < updateList.length; ++fragmentIndex)
		{
			var fragmentToUpdate = updateList[fragmentIndex];

			var sPromptToUpdate = fragmentToUpdate.getPromptValue(sParamName, sModelItem, sPromptChannel);
			if(sPromptToUpdate != null)
			{
				if(sParamName in viewerFragmentTransient.m_transientItems)
				{
					viewerFragmentTransient.changePromptValue(sPromptToUpdate, sParamValue, sPromptChannel);
				}
				else
				{
					viewerFragmentTransient.addTransientItem(sPromptToUpdate, sModelItem, sParamValue, sPromptChannel);
				}
			}
		}
	}

	var fragmentImpl = this.getFragmentObject();

	fragmentImpl.transientUpdate("globalViewerTransient", viewerFragmentTransient.saveTransientSpec(), "application", null, []);

	return viewerFragmentTransient;
};

CCognosViewerFragmentEvent.prototype.credentialParameterEnteredEvent = function(credentialParameterEnteredEventSpecification)
{
	if(this.m_cognosViewer.getStatus() == "prompting")
	{
		return this.promptEvent(credentialParameterEnteredEventSpecification, "forward");
	}

	return false;
};

CCognosViewerFragmentEvent.prototype.updatePromptValuesEvent = function(updatePromptValuesSpecification)
{
	var viewerFragment = this.getViewerFragment();

	viewerFragment.raiseEvent("cognos.viewer.*", "<collectParameters><controllerFragment>" + this.m_cognosViewer.getId() + "</controllerFragment></collectParameters>", "page");
	viewerFragment.m_fragmentUpdateList.push(viewerFragment);

	var parameters = XMLHelper_FindChildByTagName(updatePromptValuesSpecification, "parameters", false);
	var globalViewerTransient = null;
	if(parameters != null)
	{
		globalViewerTransient = this.updateGlobalTransientSpec(viewerFragment.m_fragmentUpdateList, parameters, "parameter");
	}

	var transientsToUpdate = [];
	for(var fragmentIndex = 0; fragmentIndex < viewerFragment.m_fragmentUpdateList.length; ++fragmentIndex)
	{
		var fragmentToUpdate = viewerFragment.m_fragmentUpdateList[fragmentIndex];

		var parameterMap = fragmentToUpdate.getParameterMap();
		for(var parameter in parameterMap)
		{
			if(globalViewerTransient.hasChanged(parameter, parameterMap[parameter]))
			{
				var newValue = globalViewerTransient.getTransientValue(parameter, parameterMap[parameter]);
				var iUpdateLength = transientsToUpdate.length;
				transientsToUpdate[iUpdateLength] = {};
				transientsToUpdate[iUpdateLength]["name"] = "p_" + parameter;
				transientsToUpdate[iUpdateLength]["scope"] = "application";
				transientsToUpdate[iUpdateLength]["value"] = newValue;
			}
		}
	}

	if(transientsToUpdate.length > 0)
	{
		this.getFragmentObject().transientUpdateList(transientsToUpdate, true);
	}

	viewerFragment.m_fragmentUpdateList = [];

	return (transientsToUpdate.length > 0);
};

CCognosViewerFragmentEvent.prototype.collectAuthoredDrillThroughListenersEvent = function(collectAuthoredDrillThroughListenersSpecification)
{
	var viewerFragment = this.getViewerFragment();

	var controllerFragment = XMLHelper_FindChildByTagName(collectAuthoredDrillThroughListenersSpecification, "controllerFragment", false);
	var authoredDrillChannel = XMLHelper_FindChildByTagName(collectAuthoredDrillThroughListenersSpecification, "authoredDrillChannel", false);

	var sControllerFragmentId = XMLHelper_GetText(controllerFragment);
	var viewerFragmentController = getCognosViewerObjectRef(sControllerFragmentId).m_viewerFragment;

	if(viewerFragment.shareAuthoredDrillEvents() && XMLHelper_GetText(authoredDrillChannel) == viewerFragment.getAuthoredDrillChannel())
	{
		viewerFragmentController.addToUpdateList(viewerFragment);
	}

	return true;
};

CCognosViewerFragmentEvent.prototype.collectParametersEvent = function(collectParametersSpecification)
{
	var viewerFragment = this.getViewerFragment();
	if(viewerFragment.sharePromptValues())
	{
		var controllerFragment = XMLHelper_FindChildByTagName(collectParametersSpecification, "controllerFragment", false);
		if(controllerFragment != null)
		{
			var sControllerFragmentId = XMLHelper_GetText(controllerFragment);
			var viewerFragmentController = getCognosViewerObjectRef(sControllerFragmentId).m_viewerFragment;
			viewerFragmentController.addToUpdateList(viewerFragment);
		}
	}

	return true;
};

CCognosViewerFragmentEvent.prototype.promptEvent = function(promptEventSpecification, promptEventName)
{
	if(this.m_cognosViewer.getConversation() != "")
	{
		var oReq = new ViewerDispatcherEntry(this.m_cognosViewer);
		oReq.addFormField("ui.action", promptEventName);
		oReq.addFormField("cv.fragmentEvent", "true");

		this.addRequestParameterValues(promptEventSpecification, oReq);
		this.m_cognosViewer.dispatchRequest(oReq);
	}

	return true;
};

CCognosViewerFragmentEvent.prototype.forwardEvent = function(forwardEventSpecification)
{
	return this.promptEvent(forwardEventSpecification, "forward");
};

CCognosViewerFragmentEvent.prototype.backEvent = function(backEventSpecification)
{
	return this.promptEvent(backEventSpecification, "back");
};

CCognosViewerFragmentEvent.prototype.repromptEvent = function(repromptEventSpecification)
{
	// todo find out what needs to be added to the bus header for reprompt and add it in
	return this.promptEvent(repromptEventSpecification, "forward");
};

CCognosViewerFragmentEvent.prototype.authoredDrillThroughEvent = function(authoredDrillEventSpecification)
{
	var authoredDrillRequest = XMLHelper_FindChildByTagName(authoredDrillEventSpecification, "authoredDrillRequest", false);
	var viewerFragment = this.getViewerFragment();
	var viewerFragmentImpl = viewerFragment.getFragmentObject();
	if(viewerFragment.sharePromptValues() === true)
	{
		var drillParameters = XMLHelper_FindChildByTagName(authoredDrillRequest, "drillParameters", false);

		for(var index = 0; index < drillParameters.childNodes.length; ++index)
		{
			var drillParameter = drillParameters.childNodes[index];
			var sParameterName = drillParameter.getAttribute("name");
			if(sParameterName in viewerFragmentImpl.transientState)
			{
				viewerFragmentImpl.transientNotify(sParameterName, "");
			}
		}
	}

	var oReq = new ViewerDispatcherEntry(this.m_cognosViewer);
	oReq.addFormField("ui.action", "authoredDrillThrough2");
	oReq.addFormField("ui.primaryAction", "");
	oReq.addFormField("cv.fragmentEvent", "true");
	oReq.addFormField("fragment.fireEventWhenComplete", "cognos.viewer.authoredDrillEvent");

	var oCV = viewerFragment.getCognosViewer();
	var drillForm = document.getElementById("drillForm");
	appendReportHistoryObjects(oCV,drillForm);

	for(var i = 0; i < drillForm.childNodes.length; ++i)
	{
		if(drillForm.childNodes[i].name == "cv.previousReports")
		{
			oReq.addFormField("cv.previousReports", drillForm.childNodes[i].value);
			break;
		}
	}

	oReq.addFormField("authoredDrill.request", XMLBuilderSerializeNode(authoredDrillRequest));

	// clean up our current session
	this.m_cognosViewer.setKeepSessionAlive(false);
	this.m_cognosViewer.release();

	if ( viewerFragmentImpl.parent && viewerFragmentImpl.parent.parent ) 
	{ 
		var viewerFragmentGP = viewerFragmentImpl.parent.parent;  
		if ( viewerFragmentGP.transientState ) 
		{
			if ( viewerFragmentGP.transientState.display_id ) 
			{
				viewerFragmentGP.transientState.display_id = null; 
			}
		}
	}	
	
	this.m_cognosViewer.dispatchRequest(oReq);

	return true;
};

CCognosViewerFragmentEvent.prototype.renderEvent = function(renderEventSpecification)
{
	if(this.m_cognosViewer.getStatus() == "complete" && this.m_cognosViewer.getConversation() != "")
	{
		var oReq = new ViewerDispatcherEntry(this.m_cognosViewer);
		oReq.addFormField("ui.action", "render");
		oReq.addFormField("cv.fragmentEvent", "true");

		var specificationParams = new CDictionary();
		this.addRequestParams(renderEventSpecification, specificationParams);

		if(specificationParams.exists("run.outputFormat"))
		{
			var formFieldNames = specificationParams.keys();
			for (var index = 0; index < formFieldNames.length; index++) {
				oReq.addFormField(formFieldNames[index], specificationParams.get(formFieldNames[index]));
			}

			this.m_cognosViewer.dispatchRequest(oReq);
		}
	}

	return true;
};

CCognosViewerFragmentEvent.prototype.viewEvent = function(viewEventSpecification)
{
	var oReq = new ViewerDispatcherEntry(this.m_cognosViewer);
	oReq.addFormField("ui.action", "view");
	oReq.addFormField("cv.fragmentEvent", "true");

	var specificationParams = new CDictionary();
	this.addRequestParams(viewEventSpecification, specificationParams);

	if(!specificationParams.exists("ui.object"))
	{
		var searchPath = this.m_cognosViewer.envParams["ui.object"];

		var sAction = this.m_cognosViewer.envParams["ui.action"];
		if(sAction != "view")
		{
			searchPath = "defaultOutput(" + searchPath + ")";
		}

		oReq.addFormField("ui.object", searchPath);
	}

	var formFieldNames = specificationParams.keys();
	for (var index = 0; index < formFieldNames.length; index++) {
		oReq.addFormField(formFieldNames[index], specificationParams.get(formFieldNames[index]));
	}	

	// clean up our current session
	this.m_cognosViewer.setKeepSessionAlive(false);
	this.m_cognosViewer.release();

	this.m_cognosViewer.dispatchRequest(oReq);

	return true;

};

CCognosViewerFragmentEvent.prototype.runSpecificationEvent = function(runSpecificationEventSpecification)
{
	var oReq = new ViewerDispatcherEntry(this.m_cognosViewer);
	oReq.addFormField("ui.action", "runSpecification");
	oReq.addFormField("cv.fragmentEvent", "true");

	var specificationParams = new CDictionary();
	this.addRequestParams(runSpecificationEventSpecification, specificationParams);

	this.addRequestParameterValues(runSpecificationEventSpecification, oReq);
	
	if(specificationParams.exists("ui.spec"))
	{
		// clean up our current session
		this.m_cognosViewer.setKeepSessionAlive(false);
		this.m_cognosViewer.release();
		// clear the tracking to avoid asynch issues when re-running
		this.m_cognosViewer.setTracking("");
		
		var formFieldNames = specificationParams.keys();
		for (var index = 0; index < formFieldNames.length; index++) {
			oReq.addFormField(formFieldNames[index], specificationParams.get(formFieldNames[index]));
		}	
			
		this.m_cognosViewer.dispatchRequest(oReq);

		return true;
	}
	else
	{
		return false;
	}
};

CCognosViewerFragmentEvent.prototype.runEvent = function(runEventSpecification)
{
	var oReq = new ViewerDispatcherEntry(this.m_cognosViewer);
	oReq.addFormField("ui.action", "run");
	oReq.addFormField("cv.fragmentEvent", "true");
	oReq.addFormField("cv.reUseConversationParameterValues", "false");
	
	var specificationParams = new CDictionary();
	this.addRequestParams(runEventSpecification, specificationParams);
	this.addRequestParameterValues(runEventSpecification, oReq);

	if(!specificationParams.exists("ui.object"))
	{
		var sAction = this.m_cognosViewer.envParams["ui.action"];
		if(sAction == "view")
		{
			var formWarpRequest = document.getElementById("formWarpRequest" + this.m_cognosViewer.getId());
			oReq.addFormField("ui.object", formWarpRequest["reRunObj"].value);
		}
		else
		{
			oReq.addFormField("ui.object", this.m_cognosViewer.envParams["ui.object"]);
		}
	}

	var formFieldNames = specificationParams.keys();
	for (var index = 0; index < formFieldNames.length; index++) {
		oReq.addFormField(formFieldNames[index], specificationParams.get(formFieldNames[index]));
	}	
	
	// clean up our current session
	this.m_cognosViewer.setKeepSessionAlive(false);
	this.m_cognosViewer.release();

	this.m_cognosViewer.dispatchRequest(oReq);

	return true;
};

CCognosViewerFragmentEvent.prototype.drillEvent = function(drillEventSpecification)
{
	var viewerFragment = this.getViewerFragment();

	if(viewerFragment.shareDrillEvents() && this.m_cognosViewer.getStatus() == "complete" && this.m_cognosViewer.getConversation() != "")
	{
		var drillChannelNode = XMLHelper_FindChildByTagName(drillEventSpecification, "drillChannel", false);
		var sDrillChannel = "";
		if(drillChannelNode != null)
		{
			sDrillChannel = XMLHelper_GetText(drillChannelNode);
		}

		if(sDrillChannel == viewerFragment.getDrillChannel())
		{
			var drillParams = XMLHelper_FindChildByTagName(drillEventSpecification, "DrillParameters", false);
			if(drillParams != null)
			{
				var selectionController = getCognosViewerSCObjectRef(this.m_cognosViewer.getId());
				var drillParamsArray = [];
				var sRefQuery = "";

				var drillOptionNode = XMLHelper_FindChildByTagName(drillEventSpecification, "DrillOption", false);
				if(drillOptionNode == null) {
					return;
				}

				var sDrillOption = XMLHelper_GetText(drillOptionNode);

				var aDrillGroups = XMLHelper_FindChildrenByTagName(drillParams, "DrillGroup", false);
				for(var iDrillGroupIndex = 0; iDrillGroupIndex < aDrillGroups.length; ++iDrillGroupIndex)
				{
					var munNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "MUN", false);

					var sMun = XMLHelper_GetText(munNode);
					var sCtxId = selectionController.getCtxIdFromMun(sMun);
					var sLun = ""; var sHun = "";
					var lunNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "LUN", false);
					if(lunNode != null)
					{
						sLun = XMLHelper_GetText(lunNode);
					}

					var hunNode = XMLHelper_FindChildByTagName(aDrillGroups[iDrillGroupIndex], "HUN", false);
					if(hunNode != null)
					{
						sHun = XMLHelper_GetText(hunNode);
					}

					if(sCtxId == "")
					{
						sCtxId = selectionController.getCtxIdFromMetaData(sLun, sHun);
					}

					if((sDrillOption == "down" && selectionController.canDrillDown(sCtxId)) || (sDrillOption == "up" && selectionController.canDrillUp(sCtxId)))
					{
						if(sRefQuery == "")
						{
							sRefQuery = selectionController.getRefQuery(sCtxId);
						}

						var sDataItem = selectionController.getRefDataItem(sCtxId);

						drillParamsArray[drillParamsArray.length] = sDataItem;
						drillParamsArray[drillParamsArray.length] = sMun;
						drillParamsArray[drillParamsArray.length] = sLun;
						drillParamsArray[drillParamsArray.length] = sHun;


					}
				}

				if(drillParamsArray.length > 0)
				{
					var drillManager = this.m_cognosViewer.getDrillMgr();
					var drillParamsSpecification = drillManager.buildDrillParametersSpecification(drillParamsArray);

					var oReq = new ViewerDispatcherEntry(this.m_cognosViewer);
					oReq.addFormField("ui.action", "drill");					
					oReq.addFormField("rv_drillOption", sDrillOption);
					oReq.addFormField("rv_drillparams", drillParamsSpecification);
					oReq.addFormField("rv_drillRefQuery", sRefQuery);
					oReq.addFormField("cv.fragmentEvent", "true");
					this.m_cognosViewer.dispatchRequest(oReq);

					return true;
				}
			}
		}
	}

	return false;
};

function CViewerFragmentTransient(sSpec, viewerFragment)
{
	this.m_viewerFragment = viewerFragment;
	this.m_transientItems = {};

	var rootNode = XMLBuilderLoadXMLFromString(sSpec);
	if(rootNode != null)
	{
		var parameters = XMLHelper_FindChildByTagName(rootNode, "parameters", false);
		if(parameters != null)
		{
			var parameterNodes = XMLHelper_FindChildrenByTagName(parameters, "parameter", false);

			for(var index = 0; index < parameterNodes.length; ++index)
			{
				var parameter = parameterNodes[index];
				var sName = parameter.getAttribute("name");
				var sModelItem = parameter.getAttribute("modelItem");
				if(sModelItem == null)
				{
					sModelItem = "";
				}

				var sPromptChannel = parameter.getAttribute("channel");
				if(sPromptChannel == null)
				{
					sPromptChannel = "";
				}

				var sValue = XMLHelper_GetText(parameter);

				if(typeof this.m_transientItems[sName] == "undefined")
				{
					this.m_transientItems[sName] = {};
				}

				this.m_transientItems[sName][sModelItem] = {};
				this.m_transientItems[sName][sModelItem].m_value = sValue;
				this.m_transientItems[sName][sModelItem].m_promptChannel = sPromptChannel;

			}
		}
	}
}

CViewerFragmentTransient.prototype.getViewerFragment = function()
{
	return this.m_viewerFragment;
};

CViewerFragmentTransient.prototype.addTransientItem = function(sParamName, sModelItem, sValue, sPromptChannel)
{
	if(typeof this.m_transientItems[sParamName] == "undefined")
	{
		this.m_transientItems[sParamName] = {};
	}

	this.m_transientItems[sParamName][sModelItem] = {};
	this.m_transientItems[sParamName][sModelItem].m_value = sValue;
	this.m_transientItems[sParamName][sModelItem].m_promptChannel = sPromptChannel;
	this.m_transientItems[sParamName][sModelItem].m_bNew = true;
};

CViewerFragmentTransient.prototype.changePromptValue = function(sParamName, sValue, sChannel)
{
	// determine the items that need to be changed
	var affectedModelItems = {};

	if(sParamName in this.m_transientItems)
	{
		for(var modelItem in this.m_transientItems[sParamName])
		{
			if(modelItem != "")
			{
				affectedModelItems[modelItem] = true;
			}
		}
	}
	this.updateAffectedItems(sParamName, affectedModelItems, sValue, sChannel);
};

CViewerFragmentTransient.prototype.updateAffectedItems = function(sParamName, affectedModelItems, sValue, sChannel)
{

	//update the affected items
	for(var paramName in this.m_transientItems)
	{
		var bParameterAffected = false;
		var modelItem = null;

		if (this.getViewerFragment().matchOnParameterNameOnly())
		{
			if (paramName == sParamName)
			{
				for(modelItem in this.m_transientItems[paramName])
				{
					if (this.m_transientItems[paramName][modelItem].m_promptChannel == sChannel)
					{
						bParameterAffected = true;
						break;
					}
				}
			}
		}
		else
		{
			for(var affectedModelItem in affectedModelItems)
			{
				if(affectedModelItem in this.m_transientItems[paramName] && this.m_transientItems[paramName][affectedModelItem].m_promptChannel == sChannel)
				{
					bParameterAffected = true;
				}
			}

			// special handling if the modelItem is empty, need to match on parameter name only
			if (paramName == sParamName && typeof this.m_transientItems[paramName][""] == "object")
			{
				if (this.m_transientItems[paramName][""].m_value != sValue && this.m_transientItems[paramName][""].m_promptChannel == sChannel)
				{
					bParameterAffected = true;
				}
			}
		}


		if(bParameterAffected == true)
		{
			for(modelItem in this.m_transientItems[paramName])
			{
				this.m_transientItems[paramName][modelItem].m_value = sValue;
				this.m_transientItems[paramName][modelItem].m_bNew = true;
				if(modelItem != "" && !(modelItem in affectedModelItems) && !this.getViewerFragment().matchOnParameterNameOnly())
				{
					affectedModelItems[modelItem] = true;
					return this.updateAffectedItems(sParamName, affectedModelItems, sValue, sChannel);
				}
			}
		}
	}
};

CViewerFragmentTransient.prototype.getTransientItem = function(sParameterName, sModelItem)
{
	if(sParameterName in this.m_transientItems)
	{
		if(sModelItem in this.m_transientItems[sParameterName])
		{
			return this.m_transientItems[sParameterName][sModelItem];
		}
	}

	return null;
};

CViewerFragmentTransient.prototype.hasChanged = function(sParameterName, sModelItem)
{
	var transientItem = this.getTransientItem(sParameterName, sModelItem);
	if(transientItem != null && typeof transientItem.m_bNew != "undefined" &&  transientItem.m_bNew === true)
	{
		return true;
	}
	else
	{
		return false;
	}

};

CViewerFragmentTransient.prototype.getTransientValue = function(sParameterName, sModelItem)
{
	var sValue = "";
	var transientItem = this.getTransientItem(sParameterName, sModelItem);
	if(transientItem != null && typeof transientItem.m_value != "undefined")
	{
		sValue = transientItem.m_value;
	}

	return sValue;
};


CViewerFragmentTransient.prototype.saveTransientSpec = function()
{
	var sTransientSpec = "<parameters>";
	for(var paramName in this.m_transientItems)
	{
		for(var modelItem in this.m_transientItems[paramName])
		{
			sTransientSpec += "<parameter name=\"" + sXmlEncode(paramName) + "\" modelItem=\"" + sXmlEncode(modelItem) + "\" channel=\"" + sXmlEncode(this.m_transientItems[paramName][modelItem].m_promptChannel) + "\">" + sXmlEncode(this.m_transientItems[paramName][modelItem].m_value) + "</parameter>";
		}
	}

	sTransientSpec += "</parameters>";

	return sTransientSpec;
};

CCognosViewerFragment.prototype.createCDictionary = function(oParams)
{
	var changedParams = new CDictionary();
	
	for (var key in oParams) {
		changedParams.add(key, oParams[key]);
	}
	
	return changedParams;
};
