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
/*
 * Report Viewer Drill Through Support
 * Any change to this file needs to also be made to drill-from-pdf.xts
 */

function CDrillThroughTarget(label, outputFormat, outputLocale, showInNewWindow, method, path, bookmark, parameters, objectPaths, sPrompt, dynamicDrillThrough, parameterProperties)
{
	this.m_label = label;
	this.m_outputFormat = outputFormat;
	this.m_outputLocale = outputLocale;
	this.m_showInNewWindow = showInNewWindow;
	this.m_method = method;
	this.m_path = path;
	this.m_bookmark = bookmark;
	this.m_parameters = parameters;
	this.m_objectPaths = objectPaths;
	this.m_prompt = "false";
	this.m_dynamicDrillThrough = false;
	this.m_parameterProperties = parameterProperties;

	if (typeof sPrompt != "undefined" && sPrompt != null)
	{
		if (sPrompt == 'yes')
		{
			this.m_prompt = "true";
		}
		else if (sPrompt == "target")
		{
			this.m_prompt = "";
		}
	}

	if(typeof dynamicDrillThrough != "undefined" && dynamicDrillThrough != null)
	{
		if(typeof dynamicDrillThrough == "string")
		{
			dynamicDrillThrough = dynamicDrillThrough == "true" ? true : false;
		}

		this.m_dynamicDrillThrough = dynamicDrillThrough;
	}
}

function CDrillThroughTarget_getParameterProperties()
{
	return this.m_parameterProperties;
}

function CDrillThroughTarget_getLabel()
{
	return this.m_label;
}

function CDrillThroughTarget_getOutputFormat()
{
	return this.m_outputFormat;
}

function CDrillThroughTarget_getOutputLocale()
{
	return this.m_outputLocale;
}

function CDrillThroughTarget_getShowInNewWindow()
{
	return this.m_showInNewWindow;
}

function CDrillThroughTarget_getMethod()
{
	return this.m_method;
}

function CDrillThroughTarget_getPath()
{
	return this.m_path;
}

function CDrillThroughTarget_getBookmark()
{
	return this.m_bookmark;
}

function CDrillThroughTarget_getParameters()
{
	return this.m_parameters;
}

function CDrillThroughTarget_getObjectPaths()
{
	return this.m_objectPaths;
}

function CDrillThroughTarget_getPrompt()
{
	return this.m_prompt;
}

function CDrillThroughTarget_isDynamicDrillThrough()
{
	return this.m_dynamicDrillThrough;
}

CDrillThroughTarget.prototype.getLabel = CDrillThroughTarget_getLabel;
CDrillThroughTarget.prototype.getOutputFormat = CDrillThroughTarget_getOutputFormat;
CDrillThroughTarget.prototype.getOutputLocale = CDrillThroughTarget_getOutputLocale;
CDrillThroughTarget.prototype.getShowInNewWindow = CDrillThroughTarget_getShowInNewWindow;
CDrillThroughTarget.prototype.getMethod = CDrillThroughTarget_getMethod;
CDrillThroughTarget.prototype.getPath = CDrillThroughTarget_getPath;
CDrillThroughTarget.prototype.getBookmark = CDrillThroughTarget_getBookmark;
CDrillThroughTarget.prototype.getParameters = CDrillThroughTarget_getParameters;
CDrillThroughTarget.prototype.getObjectPaths = CDrillThroughTarget_getObjectPaths;
CDrillThroughTarget.prototype.getPrompt = CDrillThroughTarget_getPrompt;
CDrillThroughTarget.prototype.isDynamicDrillThrough = CDrillThroughTarget_isDynamicDrillThrough;
CDrillThroughTarget.prototype.getParameterProperties = CDrillThroughTarget_getParameterProperties;

