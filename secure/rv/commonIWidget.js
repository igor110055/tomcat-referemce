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

if (!CViewerCommon) {
	var CViewerCommon = {};
}

CViewerCommon.buildParameterValuesSpec = function(oCV) {
	var documentNode = XMLBuilderLoadXMLFromString(oCV.getExecutionParameters());
	var parameterValues = new CParameterValues();
	if(documentNode.childNodes.length == 1)
	{
		parameterValues.loadWithOptions(documentNode.childNodes[0], /*credentials*/false);
	}

	var numberOfParameters = parameterValues.length();
	var parameterValuesSpec = "<pvs>";

	if(numberOfParameters > 0)
	{
		var parameterStringOperators = new CParameterValueStringOperators(RV_RES.IDS_JS_FILTER_BETWEEN,
																		  RV_RES.IDS_JS_FILTER_NOT_BETWEEN,
																		  RV_RES.IDS_JS_FILTER_LESS_THAN,
																		  RV_RES.IDS_JS_FILTER_GREATER_THAN);
		for(var index = 0; index < numberOfParameters; ++index)
		{
			var parameter = parameterValues.getAt(index);
			if(parameter != null)
			{
				parameterValuesSpec += "<pv>";
				parameterValuesSpec += "<name>";
				parameterValuesSpec += xml_encode(parameter.name());
				parameterValuesSpec += "</name>";
				parameterValuesSpec += "<value>";
				parameterValuesSpec += xml_encode(parameter.toString(parameterStringOperators));
				parameterValuesSpec += "</value>";
				parameterValuesSpec += "</pv>";
			}
		}
	}

	parameterValuesSpec += "</pvs>";

	return parameterValuesSpec;	
};