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


function SharePromptAction()
{
	this.m_bAbortAction = true;
}

SharePromptAction.prototype = new RunReportAction();

SharePromptAction.prototype.preProcess = function()
{
	var cv = this.getCognosViewer();
	cv.disableRaiseSharePromptEvent();
};

SharePromptAction.prototype.setRequestParms = function(payload)
{
	this.m_sharePromptParameters = payload.parameters;
	this.m_action = "forward";
};

/**
 * Parse the prompt parameters, and try to match them by parameter name first then model item,
 * if a potential match is found save in an instance member to add later to the request.
 *
 * @param {Object} promptParameters
 * @return (Boolean) True if a potential match is found
 * @author Osmani Gomez
 */
SharePromptAction.prototype.parsePromptParameters = function()
{
 	var result = false;
	var reportParameterNodes = this.getReportParameterNodes();

	if (reportParameterNodes) {
		var promptParameters = this.m_sharePromptParameters;
		var requestParams = {};
		var usedModelItems = [];
	
		for (var i in promptParameters) {
			var promptParameterName = promptParameters[i].parmName;
			var promptModelItem = promptParameters[i].modelItem;
			var sName = null;
			var sValue = null;
			var matchedByModelItem = false;
			var modelItemMatchedParams = {};
		
			for (var j in reportParameterNodes) {
				var targetParameterName = reportParameterNodes[j].getAttribute("parameterName");
				var targetModelItem = reportParameterNodes[j].getAttribute("modelItem");
			
				if ((typeof targetParameterName !== "undefined" && targetParameterName === promptParameterName) ||
					(typeof targetModelItem !== "undefined" && promptModelItem !== "undefined" && promptModelItem !== "" && 
					targetModelItem === promptModelItem && !this.arrayContains(usedModelItems, targetModelItem)))
				{
					result = true;
					sName = 'p_' + targetParameterName;
					sValue = this.getSharedPromptValue(promptParameters[i], reportParameterNodes[j]);
				
					if (targetParameterName === promptParameterName) {
						requestParams[sName] = sValue;
						usedModelItems.push(targetModelItem);
						matchedByModelItem = false;
						break;				
					} else {
						modelItemMatchedParams[sName] = sValue;
						matchedByModelItem = true;
					}
				}
			}
		
			if (matchedByModelItem) {
				for (var x in modelItemMatchedParams) {
					requestParams[x] = modelItemMatchedParams[x];
				}
			}
		}

		if (result) {
			this.m_bAbortAction = false;
			this.m_promptValues = requestParams;
		}
	}
	
	return result;
};
 
SharePromptAction.prototype.getSharedPromptValue = function(promptParameter, reportParameterNode)
{
	var sValue = null;
	var promptValue = promptParameter.parmValue;
	var multivaluedPrompt = this._isPromptParamMultiValued(promptParameter.multivalued, promptValue);
	var hasSelectOption = new RegExp(/^<selectChoices><selectOption/);
	
	// if shared prompt param -> many, report param -> one, only one option can be used
	if ( multivaluedPrompt && reportParameterNode.getAttribute( "multivalued" ) == null && promptValue.match(hasSelectOption)) {
		// make sure only one option is used, extract the the first one
		var reOneOption = new RegExp(/^(<selectChoices><selectOption.*?><)/);
		var extractedMatch = reOneOption.exec(promptValue);
		sValue = extractedMatch[1] + '/selectChoices>';
	} else {
		sValue = promptValue;
	}
	
	return sValue;
};

SharePromptAction.prototype.arrayContains = function(array, value)
{
	var found = false;
	
	for (var i = 0; i < array.length; i++) {
		if (array[i] === value) {
			found = true;
			break;
		}
	}
	
	return found;
};

SharePromptAction.prototype.getPromptValues = function()
{
	if( !this.m_promptValues )
	{
		this.parsePromptParameters();
	}
	
	return this.m_promptValues;
};

/*
 * Safer check for multivalue, in certain cases GetParameters won't return multivalued when it should,
 *
*/
SharePromptAction.prototype._isPromptParamMultiValued = function(multiValuedParamInfo, promptValue)
{
	var result = false;
	if ( multiValuedParamInfo != "undefined" && multiValuedParamInfo) {
		result = true;
	} else {
		var reIsMulti = new RegExp(/^<selectChoices><selectOption.*?>\s*<selectOption/);
		if (promptValue.match(reIsMulti)) {
			result = true;
		}
	}
	return result;
};

SharePromptAction.prototype.getReportParameterNodes = function()
{
	var cv = this.getCognosViewer();
	var reportParameterNodes = null;
	try {
		if (cv.envParams && cv.envParams.reportPrompts) {
			var reportParameters = cv.envParams.reportPrompts;
			var xmlDom = XMLBuilderLoadXMLFromString(reportParameters);
			if (!(xmlDom && xmlDom.childNodes && xmlDom.childNodes.length > 0 && xmlDom.childNodes[0].nodeName === "parsererror")) {
				var cvTransientSpec = xmlDom.firstChild;
				var reportParametersNode = XMLHelper_FindChildByTagName(cvTransientSpec, "reportParameters", true);
				reportParameterNodes = XMLHelper_FindChildrenByTagName(reportParametersNode, "reportParameter", false);
			}
		}
	}
	catch ( e ) {}
	return reportParameterNodes;
};



SharePromptAction.prototype.executePrompt = function ()
{
	if (this.getPromptValues() !== null )
	{
		this.execute();
		return true;
	}
	return false;
};
