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

/**
 * CognosViewerAction constructor (base class for all cognos viewer action
 * @constructor
 */
function CognosViewerAction()
{
	this.m_oCV = null;
}

CognosViewerAction.prototype.setRequestParms = function( parms ){};
CognosViewerAction.prototype.onMouseOver = function(evt) { return false; };
CognosViewerAction.prototype.onMouseOut = function(evt) { return false; };
CognosViewerAction.prototype.onMouseDown = function(evt) { return false; };
CognosViewerAction.prototype.onClick = function(evt) { return false; };
CognosViewerAction.prototype.onDoubleClick = function(evt) { return false; };
CognosViewerAction.prototype.updateMenu = function(jsonSpec) { return jsonSpec; };
CognosViewerAction.prototype.addAdditionalOptions = function(request) {};
CognosViewerAction.prototype.genSelectionContextWithUniqueCTXIDs = function() { return false; };
CognosViewerAction.prototype.doUndo = function() {if(typeof console != "undefined") { console.log("Required method doUndo not implemented.");}};
CognosViewerAction.prototype.doRedo = function() {if(typeof console != "undefined") { console.log("Required method doRedo not implemented.");}};
CognosViewerAction.prototype.forceRunSpecRequest = function() {return false;};

/**
 * Method that gets called before the action context gets built. If
 * there's anything special that the action needs to do, they should
 * override this method.
 */
CognosViewerAction.prototype.preProcess = function() {};

/**
 * Sets the cognos viewer object (called by the action factory
 * @param CCognosViewer object
 * @private
 */
CognosViewerAction.prototype.setCognosViewer = function(oCV)
{
	this.m_oCV = oCV;
};

/**
 * Returns an instance to the cognos viewer object
 * @return CCognosViewer object
 */
CognosViewerAction.prototype.getCognosViewer = function()
{
	return this.m_oCV;
};

CognosViewerAction.prototype.getUndoRedoQueue = function()
{
	if (this.getCognosViewer().getViewerWidget()) {
		return this.getCognosViewer().getViewerWidget().getUndoRedoQueue();
	}

	return null;
};

CognosViewerAction.prototype.getViewerWidget = function()
{
	return this.m_oCV.getViewerWidget();
};

/**
 * Returns the object display name (custom name/report name/report part name)
 */
CognosViewerAction.prototype.getObjectDisplayName = function()
{
	var displayName = "";

	if(this.m_oCV != null)
	{
		if(typeof this.m_oCV.envParams["reportpart_id"] != "undefined")
		{
			displayName = this.m_oCV.envParams["reportpart_id"];
		}
		else if(typeof this.m_oCV.envParams["ui.name"] != "undefined")
		{
			displayName = this.m_oCV.envParams["ui.name"];
		}
	}

	return displayName;
};

/**
 * Gets the container Id
 */
CognosViewerAction.prototype.getContainerId = function(selectionController) {
	var container = "";
	if (selectionController && selectionController.getAllSelectedObjects) {
		var allSel = selectionController.getAllSelectedObjects();
		if (allSel) {
			var selection = allSel[0];
			if (selection && selection.getLayoutElementId) {
				container = this.removeNamespace(selection.getLayoutElementId());
			}
		}
	}

	return container;
};

CognosViewerAction.prototype.removeNamespace = function(value)
{
	var originalValue = value;

	try
	{
		if(value != "")
		{
			var idIndex = value.indexOf(this.m_oCV.getId());
			if(idIndex != -1)
			{
				value = value.replace(this.m_oCV.getId(), "");
			}
		}

		return value;
	}
	catch(e)
	{
		return originalValue;
	}
};

CognosViewerAction.prototype.doAddActionContext = function()
{
	return true;
};

CognosViewerAction.prototype.getSelectionContext = function()
{
	return getViewerSelectionContext(this.m_oCV.getSelectionController(), new CSelectionContext(this.m_oCV.envParams["ui.object"]), this.genSelectionContextWithUniqueCTXIDs());
};

CognosViewerAction.prototype.getNumberOfSelections = function()
{
	var numberOfSelections = -1;
	if(this.m_oCV != null && this.m_oCV.getSelectionController() != null)
	{
		numberOfSelections = this.m_oCV.getSelectionController().getSelections().length;
	}

	return numberOfSelections;
};

CognosViewerAction.prototype.buildDynamicMenuItem = function(jsonSpec, actionClass)
{
	jsonSpec.action =  {name: "LoadMenu", payload: {action:actionClass}};
	jsonSpec.items = [{ "name": "loading",
	 "label" : RV_RES.GOTO_LOADING,
	 iconClass: "loading"}];
	return jsonSpec;
};

/**
 * TODO - dispatcherEntry cleanup
 * @param {Object} requestType
 */
CognosViewerAction.prototype.createCognosViewerDispatcherEntry = function( requestType )
{
	var oReq = new ViewerDispatcherEntry(this.getCognosViewer());
	oReq.addFormField("ui.action", requestType);

	this.preProcess();

	if( this.doAddActionContext() === true )
	{
		var actionContext = this.addActionContext();
		oReq.addFormField("cv.actionContext", actionContext);
		if (window.gViewerLogger)
		{
			window.gViewerLogger.log('Action context', actionContext, "xml");
		}
	}

	oReq.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);

	if(typeof this.m_oCV.envParams["ui.spec"] != "undefined")
	{
		oReq.addFormField("ui.spec", this.m_oCV.envParams["ui.spec"]);
	}

	if(this.m_oCV.getModelPath() !== "")
	{
		oReq.addFormField("modelPath", this.m_oCV.getModelPath());
	}

	if(typeof this.m_oCV.envParams["packageBase"] != "undefined")
	{
		oReq.addFormField("packageBase", this.m_oCV.envParams["packageBase"]);
	}

	if (typeof this.m_oCV.envParams["rap.state"] != "undefined")
	{
		oReq.addFormField("rap.state", this.m_oCV.envParams["rap.state"]);
	}

	if (typeof this.m_oCV.envParams["rapReportInfo"] != "undefined")
	{
		oReq.addFormField("rap.reportInfo", this.m_oCV.envParams["rapReportInfo"]);
	}

	this.addAdditionalOptions(oReq);

	return oReq;
};


CognosViewerAction.prototype.fireModifiedReportEvent = function()
{
	try
	{
		var viewerWidget = this.getCognosViewer().getViewerWidget();
		if (viewerWidget) {
			var payload = {'modified':true};
			viewerWidget.fireEvent("com.ibm.bux.widget.modified", null, payload);
		}
	} catch(e) {}
};

CognosViewerAction.prototype.showCustomCursor = function(evt, id, imageRef)
{
	var customCursor = document.getElementById(id);
	if(customCursor == null)
	{
		customCursor = document.createElement("span");
		customCursor.className = "customCursor";
		customCursor.setAttribute("id", id);
		document.body.appendChild(customCursor);
	}

	var imageSrcHtml = "<img src=\"" + this.getCognosViewer().getWebContentRoot() + imageRef + "\"/>";

	customCursor.innerHTML = imageSrcHtml;
	customCursor.style.position = "absolute";
	customCursor.style.left = (evt.clientX + 15) + "px";
	customCursor.style.top = (evt.clientY + 15) + "px";
	customCursor.style.display = "inline";
};

CognosViewerAction.prototype.hideCustomCursor = function(id)
{
	var customCursor = document.getElementById(id);
	if(customCursor != null)
	{
		customCursor.style.display = "none";
	}
};

CognosViewerAction.prototype.selectionHasContext = function()
{
	var selections = this.getCognosViewer().getSelectionController().getAllSelectedObjects();
	var bContext = false;
	if(selections != null && selections.length > 0)
	{
		for (var i=0; i < selections.length; i++)
		{
			if (selections[i].hasContextInformation())
			{
				bContext = true;
				break;
			}
		}
	}

	return bContext;
};

CognosViewerAction.prototype.isInteractiveDataContainer = function(displayTypeId)
{
	var result = false;
	if (typeof displayTypeId != "undefined" && displayTypeId != null) {
		var id = displayTypeId.toLowerCase();
		result = id == 'crosstab' || id == 'list' || this.getCognosViewer().getRAPReportInfo().isChart(id);
	}
	return result;
};


CognosViewerAction.prototype.getSelectedContainerId = function() {
	var viewer = this.getCognosViewer();

	var selectionController = viewer.getSelectionController();
	var containerId = null;
	if( selectionController != null && typeof selectionController != "undefined") {
		containerId = this.getContainerId( selectionController );
	}

	return containerId;
};

CognosViewerAction.prototype.getSelectedReportInfo = function() {
	var viewer = this.getCognosViewer();

	var containerId = this.getSelectedContainerId();

	var selectedObject = this.getReportInfo(containerId);
	if( selectedObject == null )
	{
		//if there is more than one object, we'll return null
		var oRAPReportInfo = viewer.getRAPReportInfo();
		if(oRAPReportInfo.getContainerCount() == 1)
		{
			selectedObject = oRAPReportInfo.getContainerFromPos(0);
		}
	}

	return selectedObject;
};

CognosViewerAction.prototype.getReportInfo = function(containerId) {
	var selectedObject = null;
	if( containerId != null && containerId.length > 0 )
	{
		var viewer = this.getCognosViewer();
		var oRAPReportInfo = viewer.getRAPReportInfo();
		selectedObject = oRAPReportInfo.getContainer(containerId);
	}
	return selectedObject;
};

CognosViewerAction.prototype.isSelectionOnChart = function() {

	var viewer = this.getCognosViewer();

	if (viewer.getSelectionController().hasSelectedChartNodes())
	{
		return true;
	}

	var containerId = this.getContainerId( viewer.getSelectionController());

	if (typeof containerId != "undefined")
	{
		var reportInfo = this.getReportInfo(containerId);
		if (reportInfo != null && reportInfo.displayTypeId)
		{
			var displayTypeId = reportInfo.displayTypeId.toLowerCase();
			return viewer.getRAPReportInfo().isChart(displayTypeId);
		}
	}
	return false;
};

CognosViewerAction.prototype.ifContainsInteractiveDataContainer = function()
{
	var oRAPReportInfo = this.getCognosViewer().getRAPReportInfo();
	if (oRAPReportInfo) {
		return oRAPReportInfo.containsInteractiveDataContainer();
	}

	return false;
};


/**
*	Detect from report Info if the widget is a prompt control or a prompt page and  only one container (the global one)
*
*/
CognosViewerAction.prototype.isPromptWidget = function()
{
	var oCV = this.getCognosViewer();
	if (oCV.getRAPReportInfo() && oCV.getRAPReportInfo().isPromptPart()) {
		return true;
	}
	return false;
};


CognosViewerAction.prototype.getLayoutComponents = function()
{
	var layoutComponents = [];
	var reportTable = document.getElementById("rt" + this.m_oCV.getId());
	if(reportTable != null)
	{
		layoutComponents = getElementsByAttribute(reportTable, "*", "lid");
	}

	return layoutComponents;
};


//For applicable RAP actions, add a subset of the context/metadata table as action arguments....
CognosViewerAction.prototype.addClientContextData = function(maxValuesPerRDI)
{
	var selectionController = this.m_oCV.getSelectionController();
	if (typeof selectionController!="undefined" && selectionController!=null &&
		typeof selectionController.getCCDManager!="undefined" && selectionController.getCCDManager()!=null) {
		var oCCDManager = selectionController.getCCDManager();
		return ("<md>" + xml_encode(oCCDManager.MetadataToJSON()) +	"</md>" +
				"<cd>" + xml_encode(oCCDManager.ContextDataSubsetToJSON(maxValuesPerRDI)) +	"</cd>");
	}
	return "";
};

//For applicable RAP actions, add a Map of dataItem names and a count of
CognosViewerAction.prototype.getDataItemInfoMap = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	if (typeof selectionController!="undefined" && selectionController!=null &&
		typeof selectionController.getCCDManager!="undefined" && selectionController.getCCDManager()!=null) {
		var oCCDManager = selectionController.getCCDManager();
		return ("<di>" + xml_encode(oCCDManager.DataItemInfoToJSON()) +	"</di>" );
	}
	return "";
};

CognosViewerAction.prototype.getRAPLayoutTag = function(cellRef)
{
	var tagValue = null;
	if (typeof cellRef == "object" && cellRef != null ) {
		tagValue = cellRef.getAttribute("rap_layout_tag");
	}
	return tagValue;
};

/**
 * Helper method to add the correct properties to a menuItem so it shows up 'checked'
 * @param {Object} bChecked - boolean if the menuItem should be checked
 * @param {Object} oMenuItem - the menuItem object
 * @param {Object} sUncheckedIconClass - optional css class to use if the menuItem is unchecked
*/
CognosViewerAction.prototype.addMenuItemChecked = function(bChecked, oMenuItem, sUncheckedIconClass) {
	if (bChecked) {
		if (this.getCognosViewer().isHighContrast()) {
			oMenuItem["class"] = "menuItemSelected";
		}

		oMenuItem.iconClass = "menuItemChecked";
	}
	else if (sUncheckedIconClass && sUncheckedIconClass.length > 0) {
		oMenuItem.iconClass = sUncheckedIconClass;
	}
};

CognosViewerAction.prototype.gatherFilterInfoBeforeAction = function(action) {
	var widget = this.getCognosViewer().getViewerWidget();
	widget.filterRequiredAction = action;
	widget.clearRAPCache();
	widget.fireEvent("com.ibm.bux.widget.action", null, { action: 'canvas.filters' } );
};

CognosViewerAction.prototype.addClientSideUndo = function(action, aParams) {
	var undoCallback = GUtil.generateCallback(action.doUndo, aParams, action);
	var redoCallback = GUtil.generateCallback(action.doRedo, aParams, action);
	this.getUndoRedoQueue().addClientSideUndo({"tooltip" : action.getUndoHint(), "undoCallback" : undoCallback, "redoCallback" : redoCallback});
	this.getCognosViewer().getViewerWidget().updateToolbar();
};

/*
 * It is client side menu item checking depending upon two things
 *  - area: global area or regular tab
 *  - report type: whether it is prompt part or not
 *
 * Default:
 *  - not valid in gloabl area
 *  - not valid on prompt part in regular tab
 *  - valid on regular report in regular tab
 *
 * @override
 */
CognosViewerAction.prototype.isValidMenuItem = function()
{
	var viewer = this.getCognosViewer();
	var widget = viewer.getViewerWidget();

	if (this.isPromptWidget()) {
		return false; //not valid on prompt part
	}
	return true;
};

CognosViewerAction.prototype.isPositiveInt = function(value) {
	if (typeof value === "undefined" || value === null) {
		return false;
	}

	var paresedValue = parseInt(value, 10);
	return value && paresedValue === +value && paresedValue > 0 && value.indexOf('.') == -1;
};


/**
 * Builds a PUBLIC object to return error information from an action.
 * DO NOT CHANGE THIS API
 */
CognosViewerAction.prototype.buildActionResponseObject = function(status, code, msg) {
	return {
		"status" : status,
		"message" : msg ? msg : null,
		"code" : code ? code : null,
		getStatus : function() { return this.status; },
		getMessage : function() { return this.message; },
		getCode : function() { return this.code; }
	};
};

/**
 * LineageAction - implements lineage in cognos viewer
 */
function LineageAction(){}
LineageAction.prototype = new CognosViewerAction();

LineageAction.prototype.getCommonOptions = function(request)
{
	request.addFormField("cv.responseFormat", "asynchDetailMIMEAttachment");
	request.addFormField("bux", this.m_oCV.getViewerWidget() ? "true" : "false");
	request.addFormField("cv.id", this.m_oCV.envParams["cv.id"]);
};

LineageAction.prototype.getSelectionOptions = function(request)
{
	var selectionController = this.m_oCV.getSelectionController();
	var contextIds = getSelectionContextIds(selectionController);

	request.addFormField("context.format", "initializer");
	request.addFormField("context.type", "reportService");
	request.addFormField("context.selection", "metadata," + contextIds.toString());
};

LineageAction.prototype.getPrimaryRequestOptions = function(request)
{
	request.addFormField("specificationType", "metadataServiceLineageSpecification");
	request.addFormField("ui.action", "runLineageSpecification");
	request.addFormField("ui.object", this.m_oCV.envParams["ui.object"]);
};

LineageAction.prototype.getSecondaryRequestOptions = function(request)
{
	request.addFormField("ui.conversation", this.m_oCV.getConversation());
	request.addFormField("m_tracking", this.m_oCV.getTracking());
	request.addFormField("ui.action", "lineage");
};

LineageAction.prototype.updateMenu = function(jsonSpec)
{
	if (!this.getCognosViewer().bCanUseLineage) {
		return "";
	}

	jsonSpec.disabled = !this.selectionHasContext();

	return jsonSpec;
};

/**
 * Execute the lineage request
 */
LineageAction.prototype.execute = function()
{
	var oCV = this.getCognosViewer();

	var request = new AsynchDataDispatcherEntry(oCV);

	this.getCommonOptions(request);
	this.getSelectionOptions(request);

	if(oCV.getConversation() == "")
	{
		this.getPrimaryRequestOptions(request);
	}
	else
	{
		this.getSecondaryRequestOptions(request);
	}

	request.setCallbacks({"complete":{"object":this, "method":this.handleLineageResponse}});

	if (!oCV.m_viewerFragment) {
		request.setRequestIndicator(oCV.getRequestIndicator());
		var workingDialog = new WorkingDialog(oCV);
		workingDialog.setSimpleWorkingDialogFlag(true);
		request.setWorkingDialog(workingDialog);
	}

	oCV.dispatchRequest(request);
};

LineageAction.prototype.handleLineageResponse = function(oResponse) {
	var oCV = this.getCognosViewer();
	oCV.loadExtra();

	// Need to up the asynch info in the Viewer object
	oCV.setStatus(oResponse.getAsynchStatus());
	oCV.setConversation(oResponse.getConversation());
	oCV.setTracking(oResponse.getTracking());

	var config = null;
	if(typeof MDSRV_CognosConfiguration != "undefined")
	{
		config = new MDSRV_CognosConfiguration();

		var lineageURI = "";
		if(this.m_oCV.envParams["metadataInformationURI"])
		{
			lineageURI = this.m_oCV.envParams["metadataInformationURI"];
		}

		config.addProperty("lineageURI", lineageURI);
		config.addProperty("gatewayURI", this.m_oCV.getGateway());
	}

	var searchPath = this.m_oCV.envParams["ui.object"];
	var sSelectionContext = getViewerSelectionContext(this.m_oCV.getSelectionController(), new CSelectionContext(searchPath));
	var lineageHelper = new MDSRV_LineageFragmentContext(config, sSelectionContext);
	lineageHelper.setExecutionParameters(this.m_oCV.getExecutionParameters());
	if (typeof searchPath == "string")
	{
		lineageHelper.setReportPath( searchPath );
	}
	lineageHelper.setReportLineage(oResponse.getResult());

	lineageHelper.open();
};
