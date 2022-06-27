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
// This JavaScript file is used for conducting drill through
// It delegates drill functionality to the parent (normaly the RV)
// Otherwise it does nothing.


function sXmlEncode(sInputString)
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

function createFormField(name, value)
{
	var formField = document.createElement("input");
	formField.setAttribute("type", "hidden");
	formField.setAttribute("name", name);
	formField.setAttribute("value", value);
	return(formField);
}

function setBackURLToCloseWindow(oForm)
{
	var aInputNodes = oForm.childNodes;
	if(aInputNodes)
	{
		for(var iChildIdx = 0; iChildIdx < aInputNodes.length; ++iChildIdx)
		{
			var oInput = aInputNodes[iChildIdx];
			var sName = oInput.getAttribute("name");
			if(sName && sName == "ui.backURL")
			{
				oForm.removeChild(oInput);
			}
		}
	}

	oForm.appendChild(createFormField("ui.backURL", "javascript:window.close();"));
}

//
// There are multiple drill targets, the XTS page will take care of it
//
function doMultipleDrills(drillTargets,cvId)
{
	//------------------------------------------
	// BEGIN MOTIO MODS
	//------------------------------------------

	parent.parent.uiController.doMultipleDrills (drillTargets, cvId);

	//------------------------------------------
	// END MOTIO MODS
	//------------------------------------------

	/*
	if (parent != this && parent.doMultipleDrills)
	{
		if (getCVId() != "" && getCVId() != cvId) {
			cvId = getCVId();
		}
		return parent.doMultipleDrills(drillTargets, cvId);
	}
	else
	{
		if (window.gViewerLogger)
		{
			window.gViewerLogger.log('Drill Targets', drillTargets, "text");
		}

		var oCV = null;
		try
		{
			oCV = getCognosViewerObjectRef(cvId);
		}
		catch(exception){}

		var drillForm = buildDrillForm(oCV);
		addDrillEnvironmentFormFields(drillForm, oCV);

		if(typeof oCV != "undefined" && oCV != null)
		{
			var modelPath = oCV.getModelPath();

			drillForm.appendChild(createFormField("modelPath", modelPath));

			var selectionController = oCV.getSelectionController();
			var sSelectionContext = "";
			if(typeof getViewerSelectionContext != "undefined" && typeof CSelectionContext != "undefined")
			{
				sSelectionContext = getViewerSelectionContext(selectionController, new CSelectionContext(modelPath));
			}
			drillForm.appendChild(createFormField("drillContext", sSelectionContext));
			drillForm.appendChild(createFormField("modelDrillEnabled", selectionController.getModelDrillThroughEnabled()));

			if(typeof document.forms["formWarpRequest" + oCV.getId()]["ui.object"] != "undefined" && document.forms["formWarpRequest" + oCV.getId()]["ui.object"].value != "")
			{
				drillForm.appendChild(createFormField("drillSource", document.forms["formWarpRequest" + oCV.getId()]["ui.object"].value));
			}
			else if(typeof oCV.envParams["ui.spec"] != "undefined")
			{
				drillForm.appendChild(createFormField("sourceSpecification", oCV.envParams["ui.spec"]));
			}
		}

		drillForm.setAttribute("launchGotoPage", "true");
		drillForm.appendChild(createFormField("drillTargets", drillTargets));
		drillForm.appendChild(createFormField("invokeGotoPage", "true"));
		drillForm.appendChild(createFormField("m", "portal/drillthrough.xts"));
		drillForm.appendChild(createFormField("b_action", "xts.run"));

		var target = "winNAT_" + ( new Date() ).getTime();
		var sWebContentRoot = "..";

		if (oCV != null)
		{
			sWebContentRoot = oCV.getWebContentRoot();
			var sExecutionParameters = oCV.getExecutionParameters();
			if(sExecutionParameters != "")
			{
				drillForm.appendChild(createFormField("encExecutionParameters", sExecutionParameters));
			}
		}

		// Used to override the default behavior when we're in mobile so that we
		// call their proxy
		if (!oCV || !oCV.launchGotoPageForIWidgetMobile(drillForm)) {
			if (oCV && typeof oCV.launchGotoPage === "function") {
				oCV.launchGotoPage(drillForm);
			}
			else {
				var sPath = sWebContentRoot + "/rv/blankDrillWin.html";
				drillForm.target = target;        
				window.open( sPath, target );
			}			
		}
	}

	 */
}

function buildDrillForm(oCV)
{
	var drillForm = document.getElementById("drillForm");
	if(drillForm)
	{
		document.body.removeChild(drillForm);
	}

	drillForm = document.createElement("form");

	if(typeof oCV != "undefined" && oCV != null)
	{
		var mainForm = document.getElementById("formWarpRequest" + oCV.getId());
		drillForm.setAttribute("target", mainForm.getAttribute("target"));
		drillForm.setAttribute("action", mainForm.getAttribute("action"));
	}
	else
	{
		drillForm.setAttribute("action", location.pathname);
	}

	drillForm.setAttribute("id", "drillForm");
	drillForm.setAttribute("name", "drillForm");
	drillForm.setAttribute("method", "post");
	drillForm.style.display = "none";

	document.body.appendChild(drillForm);

	return drillForm;
}

function addDrillEnvironmentFormFields(drillForm, oCV)
{
	if (window.g_dfEmail) {
		drillForm.appendChild(createFormField("dfemail", window.g_dfEmail));
	}

	if(oCV != null)
	{

		drillForm.appendChild(createFormField("cv.id", oCV.getId()));


		if(typeof oCV.envParams["ui.sh"] != "undefined")
		{
			drillForm.appendChild(createFormField("ui.sh", oCV.envParams["ui.sh"]));
		}

		if(oCV.getViewerWidget() == null)
		{
			if(typeof oCV.envParams["cv.header"] != "undefined")
			{
				drillForm.appendChild(createFormField("cv.header", oCV.envParams["cv.header"]));
			}

			if(typeof oCV.envParams["cv.toolbar"] != "undefined")
			{
				drillForm.appendChild(createFormField("cv.toolbar", oCV.envParams["cv.toolbar"]));
			} else { 
				var passPortletToolbarStateOnDrillThrough = oCV.getAdvancedServerProperty("VIEWER_PASS_PORTLET_TOOLBAR_STATE_ON_DRILLTHROUGH");
				if(oCV.m_viewerFragment && passPortletToolbarStateOnDrillThrough != null && passPortletToolbarStateOnDrillThrough === true ) {
					var showToolbar = oCV.m_viewerFragment.canShowToolbar() ? "true" : "false";
					drillForm.appendChild(createFormField("cv.toolbar", showToolbar));
				}				
			}
		}

		if(typeof oCV.envParams["ui.backURL"] != "undefined")
		{
			drillForm.appendChild(createFormField("ui.backURL", oCV.envParams["ui.backURL"]));
		}

		if(typeof oCV.envParams["ui.postBack"] != "undefined")
		{
			drillForm.appendChild(createFormField("ui.postBack", oCV.envParams["ui.postBack"]));
		}

		if(typeof oCV.envParams["savedEnv"] != "undefined")
		{
			drillForm.appendChild(createFormField("savedEnv", oCV.envParams["savedEnv"]));
		}

		if(typeof oCV.envParams["ui.navlinks"] != "undefined")
		{
			drillForm.appendChild(createFormField("ui.navlinks", oCV.envParams["ui.navlinks"]));
		}

		if(typeof oCV.envParams["lang"] != "undefined")
		{
			drillForm.appendChild(createFormField("lang", oCV.envParams["lang"]));
		}

		if(typeof oCV.envParams["ui.errURL"] != "undefined")
		{
			drillForm.appendChild(createFormField("ui.errURL", oCV.envParams["ui.errURL"]));
		}

		var routingServerGroup = "";
		if(oCV.envParams["ui.routingServerGroup"])
		{
			routingServerGroup = oCV.envParams["ui.routingServerGroup"];
		}
		drillForm.appendChild(createHiddenFormField("ui.routingServerGroup", routingServerGroup));
	}
	else
	{
		drillForm.appendChild(createFormField("cv.header", "false"));
		drillForm.appendChild(createFormField("cv.toolbar", "false"));
	}
}

function appendReportHistoryObjects(oCV,drillForm)
{
	if(oCV != null && typeof oCV.rvMainWnd != "undefined" && drillForm != null)
	{
		oCV.rvMainWnd.addCurrentReportToReportHistory();
		var reportHistorySpecification = oCV.rvMainWnd.saveReportHistoryAsXML();
		drillForm.appendChild(createFormField("cv.previousReports", reportHistorySpecification));
	}
}

function doSingleDrill(target,args,method,format,locale,bookmark,sourceContext,objectPaths,cvId,sPrompt,dynamicDrill)
{

	//------------------------------------------
	// BEGIN MOTIO MODS
	//------------------------------------------

	var targetPath;
	try {
		//paths with % in them will throw a MalformedURIException.  Just take it verbatim
		targetPath = decodeURIComponent(args[0][1]);
	}
	catch (e) {
		targetPath = args[0][1];
	}
	var paramNames = [];
	var paramValues = [];

	for (var i = 1; i < args.length; i++) {
		paramNames.push(args[i][0].substr(2));

		//Decoding in drillthroughaction...
		//paramValues.push(decodeURIComponent(args[i][1]));
		paramValues.push(args[i][1]);
	}

	parent.parent.uiController.addDrillTab (targetPath, paramNames, paramValues);

	/*
	var sCVId = "";
	if (typeof cvId == "string") {
		sCVId = cvId;
	}

	var oCV = null;
	try
	{
		oCV = getCognosViewerObjectRef(cvId);
	}
	catch(exception){}

	if (!oCV && parent != this && parent.doSingleDrill)
	{
		// if we're currently in an iframe, try and get the correct cvId from the iframe
		if (getCVId() != "" && getCVId() != cvId) {
			cvId = getCVId();
		}
		// Call the method in the parent which is most likely the RV
		return parent.doSingleDrill(target, args, method, format, locale, bookmark, sourceContext, objectPaths,cvId,sPrompt,dynamicDrill);
	}
	else
	{
		if(typeof method == "undefined")
		{
			method = "default";
		}
		else if(method == "execute")
		{
			method = "run";
		}

		// always open a new window if the drill through is set to edit and we're in a portlet
		if (method == "edit" && oCV != null && typeof oCV.m_viewerFragment) {
			target = "_blank";
		}
		
		var drillForm = buildDrillForm(oCV);

		var sDrillSpecification = "<authoredDrillRequest>";

		sDrillSpecification += "<param name=\"action\">" + sXmlEncode(method) + "</param>";
		sDrillSpecification += "<param name=\"target\">" + sXmlEncode(args[0][1]) + "</param>";
		sDrillSpecification += "<param name=\"format\">" + sXmlEncode(format) + "</param>";
		sDrillSpecification += "<param name=\"locale\">" + sXmlEncode(locale) + "</param>";
		sDrillSpecification += "<param name=\"prompt\">" + sXmlEncode(sPrompt) + "</param>";
		sDrillSpecification += "<param name=\"dynamicDrill\">" + sXmlEncode(dynamicDrill) + "</param>";

		if(typeof oCV != "undefined" && oCV != null)
		{
			sDrillSpecification += "<param name=\"sourceTracking\">" + oCV.getTracking() + "</param>";

			if(typeof document.forms["formWarpRequest" + oCV.getId()]["ui.object"] != "undefined")
			{
				sDrillSpecification += "<param name=\"source\">" + sXmlEncode(document.forms["formWarpRequest" + oCV.getId()]["ui.object"].value) + "</param>";
			}

			var modelPath = oCV.getModelPath();

			sDrillSpecification += "<param name=\"metadataModel\">" + sXmlEncode(modelPath) + "</param>";
			sDrillSpecification += "<param name=\"selectionContext\">" + sXmlEncode(getViewerSelectionContext(oCV.getSelectionController(), new CSelectionContext(modelPath))) + "</param>";

			if(typeof document.forms["formWarpRequest" + oCV.getId()]["ui.object"] != "undefined" && document.forms["formWarpRequest" + oCV.getId()]["ui.object"].value != "")
			{
				sDrillSpecification += "<param name=\"source\">" + sXmlEncode(document.forms["formWarpRequest" + oCV.getId()]["ui.object"].value) + "</param>";
			}
			else if(typeof oCV.envParams["ui.spec"] != "undefined")
			{
				sDrillSpecification += "<param name=\"sourceSpecification\">" + sXmlEncode(oCV.envParams["ui.spec"]) + "</param>";
			}
		}

		if (bookmark != "")
		{
			sDrillSpecification += "<param name=\"bookmark\">" + bookmark + "</param>";
		}

		if(method != "view")
		{
			if(typeof sourceContext != "undefined")
			{
				sDrillSpecification += "<param name=\"sourceContext\">" + sXmlEncode(sourceContext) + "</param>";
			}

			if(typeof objectPaths != "undefined")
			{
				sDrillSpecification += "<param name=\"objectPaths\">" + sXmlEncode(objectPaths) + "</param>";
			}
		}

		var idxArg = 0;
		sDrillSpecification += "<drillParameters>";
		var aDrillSpecParams = [];
		
		for (idxArg = 1; idxArg < args.length; idxArg++)
		{
			// HS 622739 : RSVP currently inconsistent about substituting MUN for useValue. This code can be
			// reverted once a clear contract is designed between RSVP and Viewer.
			var sSel = args[idxArg][1];
			if ( format == 'HTML' && (sSel.indexOf("<selectChoices") == 0) )
			{
				var selectionChoicesSpecification = XMLHelper_GetFirstChildElement( XMLHelper_GetFirstChildElement( XMLBuilderLoadXMLFromString (args[idxArg][1]) ));
				if (selectionChoicesSpecification)
				{
					var sMun = selectionChoicesSpecification.getAttribute("mun");
					if(sMun != null && sMun != "")
					{
						selectionChoicesSpecification.setAttribute("useValue", sMun);
						sSel = "<selectChoices>" + XMLBuilderSerializeNode(selectionChoicesSpecification) + "</selectChoices>";
					}
				}
			}
			// End HS 622739.
			
			var paramName = args[idxArg][0];
			
			var bFound = false;
			for (var i = 0; i < aDrillSpecParams.length; i++) {
				var param = aDrillSpecParams[i];
				if (param.name === paramName && param.value === sSel) {
					bFound = true;
					break;
				}
			}
			
			if (!bFound) {
				aDrillSpecParams.push({"name" : paramName, "value" : sSel});
				sDrillSpecification += "<param name=\"" + sXmlEncode(paramName) + "\">" + sXmlEncode(sSel) + "</param>";
			}
		}
		sDrillSpecification += "</drillParameters>";

		sDrillSpecification += getExecutionParamNode(oCV);

		sDrillSpecification += "</authoredDrillRequest>";

		drillForm.appendChild(createFormField("authoredDrill.request", sDrillSpecification));

		drillForm.appendChild(createFormField("ui.action", "authoredDrillThrough2"));

		drillForm.appendChild(createFormField("b_action", "cognosViewer"));

		addDrillEnvironmentFormFields(drillForm, oCV);

		// executeDrillThroughForIWidgetMobile will return true if it executed the drill through
		if (!oCV || !oCV.executeDrillThroughForIWidgetMobile(drillForm)) {
			// Used to override the default drill of submitting a form
			if (oCV && typeof oCV.sendDrillThroughRequest === "function") {
				oCV.sendDrillThroughRequest(drillForm);
			}
			// <!-- if drill through format isXLS or CSV or we're in a fragment then ALWAYS open a new window -->
			else if(target == "" && oCV != null && typeof oCV.m_viewerFragment != "undefined")
			{
				 oCV.m_viewerFragment.raiseAuthoredDrillEvent(sDrillSpecification);
			}
			else if( (oCV != null && oCV.getViewerWidget() != null) || target != "" || format == 'XLS' || format == 'CSV' || format == 'XLWA' || format == 'singleXLS')
			{
				setBackURLToCloseWindow(drillForm);
	
				var sTarget = "winNAT_" + ( new Date() ).getTime();
	
				var sWebContentRoot = "..";
	
				if (oCV != null)
				{
					sWebContentRoot = oCV.getWebContentRoot();
				}
	
				var sPath = sWebContentRoot + "/rv/blankDrillWin.html";
				if (sCVId)
				{
					sPath += "?cv.id=" + sCVId;
				}
	
				if (window.gViewerLogger)
				{
					window.gViewerLogger.log('Drill Specification', sDrillSpecification, "xml");
				}
	
				drillForm.target = sTarget;            
				newWindow = window.open( sPath, sTarget );
			}
			else
			{
				appendReportHistoryObjects(oCV, drillForm);
	
				if (window.gViewerLogger)
				{
					window.gViewerLogger.log('Drill Specification', sDrillSpecification, "xml");
				}
	
				drillForm.target = "_self";
				drillForm.submit();
				if (oCV != null)
				{
					setTimeout(getCognosViewerObjectRefAsString(oCV.getId())+".getRequestIndicator().show()",10);
				}
			}
		}
	}

	 */
}

function getExecutionParamNode(oCV)
{
	var sExecutionParamNode = "";
	if(typeof oCV != "undefined" && oCV != null)
	{
		var sExecutionParameters = oCV.getExecutionParameters();
		if(sExecutionParameters != "")
		{
			sExecutionParamNode += "<param name=\"executionParameters\">";
			sExecutionParamNode += sXmlEncode(sExecutionParameters);
			sExecutionParamNode += "</param>";
		}
	}

	return sExecutionParamNode;
}

function doSingleDrillThrough(drillThroughContext, bookmarkRef, cvId)
{
	// handle a single drill
	var drillTargetRefIdx = drillThroughContext[0][0];
	if(typeof drillTargetRefIdx == "undefined" || drillTargetRefIdx == null) {
		return;
	}

	var drillTargetRef = cvId && window[cvId + "drillTargets"] ? window[cvId + "drillTargets"][drillTargetRefIdx] : drillTargets[drillTargetRefIdx];
	if(typeof drillTargetRef == "undefined") {
		return;
	}

	// check for the case of a local bookmark
	if(bookmarkRef != '' && drillTargetRef.getPath() == '') {
		document.location = "#" + bookmarkRef;
	} else {

		var args = [];
		args[args.length] = ["ui.object", drillTargetRef.getPath()];
		for(var drillParmIdx = 1; drillParmIdx < drillThroughContext.length; ++drillParmIdx) {
			args[args.length] = drillThroughContext[drillParmIdx];
		}

		var target="";
		if(drillTargetRef.getShowInNewWindow()=='true') {
			target = "_blank";
		}

		var parametersString = drillTargetRef.getParameters();
		var objectPaths = drillTargetRef.getObjectPaths();

		var oCVId = cvId;

		if (!cvId)
		{
			oCVId = getCVId();
		}

		doSingleDrill(target, args, drillTargetRef.getMethod(), drillTargetRef.getOutputFormat(), drillTargetRef.getOutputLocale(), bookmarkRef, parametersString, objectPaths, oCVId, drillTargetRef.getPrompt(), false);
	}
}

function getCVId()
{
	var sCVId = "";
	try
	{
		sCVId = this.frameElement.id.substring("CVIFrame".length);
	}
	catch(exception){}

	return sCVId;
}

function doMultipleDrillThrough(drillThroughContext, cvId)
{
	// handle multiple drills
	var drillThroughTargetStr = '<rvDrillTargets>';

	for(var drillTargetIdx = 0; drillTargetIdx < drillThroughContext.length; ++drillTargetIdx) {

		var currentDrillThroughContext = drillThroughContext[drillTargetIdx];

		if(currentDrillThroughContext.length < 3) {
			// there must be three or more parameters (drill idx, drill label and the drill parameters)
			continue;
		}

		var drillTargetRefIdx = currentDrillThroughContext[0];
		if(typeof drillTargetRefIdx == "undefined" || drillTargetRefIdx == null) {
			continue;
		}

		var drillTargetLabel = currentDrillThroughContext[1];
		if (typeof drillTargetLabel == "undefined" || drillTargetLabel == null) {
			continue;
		}

		var drillTargetRef = cvId && window[cvId + "drillTargets"] ? window[cvId + "drillTargets"][drillTargetRefIdx] : drillTargets[drillTargetRefIdx];
		if(typeof drillTargetRef == "undefined" || drillTargetRef == null) {
			continue;
		}

		if(drillTargetLabel === null || drillTargetLabel === "")
		{
			drillTargetLabel = drillTargetRef.getLabel();
		}

		drillThroughTargetStr += '<drillTarget ';

		drillThroughTargetStr += 'outputFormat="'; drillThroughTargetStr += drillTargetRef.getOutputFormat(); drillThroughTargetStr += '" ';
		drillThroughTargetStr += 'outputLocale="'; drillThroughTargetStr += drillTargetRef.getOutputLocale(); drillThroughTargetStr += '" ';
		drillThroughTargetStr += 'label="'; drillThroughTargetStr += sXmlEncode(drillTargetLabel); drillThroughTargetStr += '" ';
		drillThroughTargetStr += 'path="'; drillThroughTargetStr += sXmlEncode(drillTargetRef.getPath()); drillThroughTargetStr += '" ';
		drillThroughTargetStr += 'showInNewWindow="'; drillThroughTargetStr += drillTargetRef.getShowInNewWindow(); drillThroughTargetStr += '" ';
		drillThroughTargetStr += 'method="'; drillThroughTargetStr += drillTargetRef.getMethod(); drillThroughTargetStr += '" ';
		drillThroughTargetStr += 'prompt="'; drillThroughTargetStr += drillTargetRef.getPrompt(); drillThroughTargetStr += '" ';
		drillThroughTargetStr += 'dynamicDrill="'; drillThroughTargetStr += drillTargetRef.isDynamicDrillThrough(); drillThroughTargetStr += '">';

		for(var drillParmIdx = 2; drillParmIdx < currentDrillThroughContext.length; ++drillParmIdx) {
			drillThroughTargetStr += currentDrillThroughContext[drillParmIdx];
		}

		drillThroughTargetStr += drillTargetRef.getParameters();
		drillThroughTargetStr += drillTargetRef.getObjectPaths();

		drillThroughTargetStr += '</drillTarget>';
	}

	drillThroughTargetStr += '</rvDrillTargets>';

	if (!cvId) {
		cvId = getCVId();
	}
	
	doMultipleDrills(drillThroughTargetStr, cvId);
}
