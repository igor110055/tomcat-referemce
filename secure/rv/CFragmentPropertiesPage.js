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
function CViewerFragmentPropertiesPage_attachOnClickEvents(sFragId)
{

	var promptOptionDropDown = document.getElementById(sFragId + "promptOption");
	if(promptOptionDropDown != null)
	{
		promptOptionDropDown.fragId = sFragId;
		promptOptionDropDown.onchange = CViewerFragmentPropertiesPage_onchangePromptOption;
	}

	var sharePromptValuesCheckBox = document.getElementById(sFragId + "sharePromptValues");
	if(sharePromptValuesCheckBox != null)
	{
		sharePromptValuesCheckBox.fragId = sFragId;
		sharePromptValuesCheckBox.onclick = CViewerFragmentPropertiesPage_onclickSharePromptValues;
	}

	CViewerFragmentPropertiesPage_addOnClickChannelRadioButtonEvent(sFragId + "sharePromptAllChannels", sFragId + "sharePromptValues", CViewerFragmentPropertiesPage_onclickSharePromptRadioButton);
	CViewerFragmentPropertiesPage_addOnClickChannelRadioButtonEvent(sFragId + "sharePromptOnSpecifiedChannel", sFragId + "sharePromptValues", CViewerFragmentPropertiesPage_onclickSharePromptRadioButton);
	CViewerFragmentPropertiesPage_addOnClickSpecifyChannelEditBox(sFragId + "promptEventChannel", sFragId + "sharePromptOnSpecifiedChannel", sFragId + "sharePromptValues", CViewerFragmentPropertiesPage_onclickPromptChannelEditBox);

	var shareDrillEventsCheckBox = document.getElementById(sFragId + "shareDrillEvents");
	if(shareDrillEventsCheckBox != null)
	{
		shareDrillEventsCheckBox.fragId = sFragId;
		shareDrillEventsCheckBox.onclick = CViewerFragmentPropertiesPage_onclickShareDrillEvents;

	}

	CViewerFragmentPropertiesPage_addOnClickChannelRadioButtonEvent(sFragId + "shareDrillEventOnAllChannels", sFragId + "shareDrillEvents", CViewerFragmentPropertiesPage_onclickChannelRadioButton);
	CViewerFragmentPropertiesPage_addOnClickChannelRadioButtonEvent(sFragId + "shareDrillEventOnSpecifiedChannel", sFragId + "shareDrillEvents", CViewerFragmentPropertiesPage_onclickChannelRadioButton);
	CViewerFragmentPropertiesPage_addOnClickSpecifyChannelEditBox(sFragId + "drillChannel", sFragId + "shareDrillEventOnSpecifiedChannel", sFragId + "shareDrillEvents", CViewerFragmentPropertiesPage_onclickSpecifyChannelEditBox);

	var shareAuthoredDrillEvents = document.getElementById(sFragId + "shareAuthoredDrillEvents");
	if(shareAuthoredDrillEvents != null)
	{
		shareAuthoredDrillEvents.fragId = sFragId;
		shareAuthoredDrillEvents.onclick = CViewerFragmentPropertiesPage_onclickShareAuthoredDrillEvents;

	}

	CViewerFragmentPropertiesPage_addOnClickSpecifyChannelEditBox(sFragId + "authoredDrillChannel", "", sFragId + "shareAuthoredDrillEvents", CViewerFragmentPropertiesPage_onclickSpecifyChannelEditBox);

}

function CViewerFragmentPropertiesPage_getFragIdFromEvent(evt)
{
	try
	{
		evt = (evt) ? evt : ((event) ? event : null);
		var node = getNodeFromEvent(evt);
		return node.fragId;
	}
	catch(e)
	{
		return "";
	}
}

function CViewerFragmentPropertiesPage_handleChangeSharePromptValues(evt)
{
	var node = getNodeFromEvent(evt);
	var sharePromptValuesCheckBox = document.getElementById(node.parentCheckBoxId);
	if(sharePromptValuesCheckBox != null && sharePromptValuesCheckBox.checked === true)
	{
		CViewerFragmentPropertiesPage_fetchTransientValues(sharePromptValuesCheckBox.fragId);
	}
}

function CViewerFragmentPropertiesPage_onclickSharePromptRadioButton(evt)
{
	evt = (evt) ? evt : ((event) ? event : null);
	CViewerFragmentPropertiesPage_onclickChannelRadioButton(evt);
	CViewerFragmentPropertiesPage_handleChangeSharePromptValues(evt);
}

function CViewerFragmentPropertiesPage_onclickPromptChannelEditBox(evt)
{
	evt = (evt) ? evt : ((event) ? event : null);
	CViewerFragmentPropertiesPage_onclickSpecifyChannelEditBox(evt);
	CViewerFragmentPropertiesPage_handleChangeSharePromptValues(evt);
}

function CViewerFragmentPropertiesPage_onchangePromptOption(evt)
{
	evt = (evt) ? evt : ((event) ? event : null);
	var node = getNodeFromEvent(evt);
	var sFragId = node.fragId;

	var sharePromptValuesCheckBox = document.getElementById(sFragId + "sharePromptValues");

	if(sharePromptValuesCheckBox)
	{
		if(node.value == "hide")
		{
			sharePromptValuesCheckBox.disabled = true;

			if(sharePromptValuesCheckBox.checked === false)
			{
				sharePromptValuesCheckBox.checked = true;

				var sharePromptAllChannels = document.getElementById(sFragId + "sharePromptAllChannels");
				if(sharePromptAllChannels != null)
				{
					sharePromptAllChannels.checked = true;
				}

				CViewerFragmentPropertiesPage_fetchTransientValues(sFragId);
			}
		}
		else
		{
			sharePromptValuesCheckBox.disabled = false;
		}
	}

}

function CViewerFragmentPropertiesPage_onclickShareAuthoredDrillEvents(evt)
{
	evt = (evt) ? evt : ((event) ? event : null);
	var node = getNodeFromEvent(evt);

	if(node.checked === false)
	{
		var sFragId = node.fragId;
		var channelEditBoxId = document.getElementById(sFragId + "authoredDrillChannel");
		if(channelEditBoxId != null)
		{
			channelEditBoxId.value = "";
		}
	}
}

function CViewerFragmentPropertiesPage_onclickShareDrillEvents(evt)
{
	evt = (evt) ? evt : ((event) ? event : null);
	var node = getNodeFromEvent(evt);

	var sFragId = node.fragId;

	if(node.checked === false)
	{
		CViewerFragmentPropertiesPage_clearChanneledSection(sFragId + "shareDrillEventOnAllChannels", sFragId + "shareDrillEventOnSpecifiedChannel", sFragId + "drillChannel",  sFragId + "matchOnParameterNameOnly");
	}
	else
	{
		var sharedDrillOnAllChannelsRadio = document.getElementById(sFragId + "shareDrillEventOnAllChannels");
		if(sharedDrillOnAllChannelsRadio != null)
		{
			sharedDrillOnAllChannelsRadio.checked = true;
		}
	}
}

function CViewerFragmentPropertiesPage_clearChanneledSection(shareOnAllChannelsId, shareOnSpecifiedChannelId, channelEditBoxId, matchOnParameterNameOnlyId)
{
	//reset the radio buttons and edit box
	var shareOnAllChannels = document.getElementById(shareOnAllChannelsId);
	if(shareOnAllChannels != null)
	{
		shareOnAllChannels.checked = false;
	}

	var shareOnSpecifiedChannel = document.getElementById(shareOnSpecifiedChannelId);
	if(shareOnSpecifiedChannel != null)
	{
		shareOnSpecifiedChannel.checked = false;
	}

	var channelEditBox = document.getElementById(channelEditBoxId);
	if(channelEditBox != null)
	{
		channelEditBox.value = "";
	}

	var matchOnParameterNameOnly = document.getElementById(matchOnParameterNameOnlyId);
	if(matchOnParameterNameOnly != null)
	{
		matchOnParameterNameOnly.disabled = true;
	}
}

function CViewerFragmentPropertiesPage_addOnClickSpecifyChannelEditBox(id, parentRadioId, parentCheckBoxId, onclickMethod)
{
	var editBox = document.getElementById(id);
	if(editBox != null)
	{
		if(parentCheckBoxId != null && parentCheckBoxId != "")
		{
			editBox.parentCheckBoxId = parentCheckBoxId;
		}

		if(parentRadioId != null && parentRadioId != "")
		{
			editBox.parentRadioId = parentRadioId;
		}

		editBox.onclick = onclickMethod;
	}
}

function CViewerFragmentPropertiesPage_onclickSpecifyChannelEditBox(evt)
{
	evt = (evt) ? evt : ((event) ? event : null);
	var node = getNodeFromEvent(evt);

	if(typeof node.parentRadioId != "undefined")
	{
		var parentRadioButton = document.getElementById(node.parentRadioId);
		if(parentRadioButton != null)
		{
			parentRadioButton.checked = true;
		}
	}

	if(typeof node.parentCheckBoxId != "undefined")
	{
		var parentCheckBox = document.getElementById(node.parentCheckBoxId);
		if(parentCheckBox != null)
		{
			parentCheckBox.checked = true;
		}
	}
}

function CViewerFragmentPropertiesPage_addOnClickChannelRadioButtonEvent(id, parentCheckBoxId, onclickMethod)
{
	var radioButton = document.getElementById(id);
	if(radioButton != null)
	{
		radioButton.parentCheckBoxId = parentCheckBoxId;
		radioButton.onclick = onclickMethod;
	}
}

function CViewerFragmentPropertiesPage_onclickChannelRadioButton(evt)
{
	evt = (evt) ? evt : ((event) ? event : null);
	var node = getNodeFromEvent(evt);

	var parentCheckBox = document.getElementById(node.parentCheckBoxId);
	if(parentCheckBox != null)
	{
		parentCheckBox.checked = true;
	}
}

function CViewerFragmentPropertiesPage_highlightErrors(sFragId, sValidationString)
{
	var properties = sValidationString.split(":");
	for(var index = 0; index < properties.length; ++index)
	{
		var property = properties[index];
		var propertyNameValue = property.split("=");
		var sName = propertyNameValue[0];
		var sValue = propertyNameValue[1];
		var node = null;

		if(sName == "prompt")
		{
			node = document.getElementById(sFragId + "promptEventChannel");
		}
		else if(sName == "drillUpDown")
		{
			node = document.getElementById(sFragId + "drillChannel");
		}
		else if(sName == "authoredDrillThrough")
		{
			node = document.getElementById(sFragId + "authoredDrillChannel");
		}

		if(node != null)
		{
			if(sValue == "false")
			{
				if(node.parentNode.className.indexOf("clsTextWidgetParseError") == -1)
				{
					node.parentNode.setAttribute("oldClassName", node.parentNode.className);
					node.parentNode.className +=  " clsTextWidgetParseError";
				}
			}
			else
			{
				var resetClassName = node.parentNode.getAttribute("oldClassName");
				if(resetClassName != null)
				{
					node.parentNode.className = resetClassName;
					node.parentNode.removeAttribute("oldClassName");
				}
			}
		}
	}

}


function CViewerFragmentPropertiesPage_processGetTransientsResponse()
{
	var iframeElement = document.getElementById("getTransientsIframe");

	var sFragId = iframeElement.getAttribute("fragId");
	var oCV = iframeElement.contentWindow[getCognosViewerObjectString(sFragId)];

	if(typeof oCV == "undefined" || oCV.getStatus() == "prompting")
	{
		//set the iframe element to cover the page
		iframeElement.style.position="absolute";
		iframeElement.style.left="0px";
		iframeElement.style.top="0px";

		var pageWidth = 0;
		if (typeof window.innerWidth != "undefined") {
			pageWidth = window.innerWidth;
		} else {
			pageWidth = document.body.clientWidth;
		}

		iframeElement.style.width = pageWidth;

		// calculate the page height
		var pageHeight = 0;
		if (typeof window.innerHeight != "undefined") {
			pageHeight = window.innerHeight;
		} else {
			pageHeight = document.body.clientHeight;
		}

		iframeElement.style.height = pageHeight;
		iframeElement.style.zIndex = "1000";
		iframeElement.style.display = "";
	}
	else if(oCV.isWorking())
	{
		oCV.wait();
	}
	else if(oCV.getStatus() == "conversationComplete")
	{
		var okButton = document.getElementById("advPropsbtnok");
		if (okButton)
		{
			okButton.disabled = "";
			if (!isIE())
			{
				okButton.style.backgroundColor = okButton.getAttribute("originalBackgoundColor");
			}
		}

		var sTransientSpec = oCV.envParams["cv.transientSpec"];
		document.getElementById(sFragId + "transientSpecification").setAttribute("value", sTransientSpec);
		document.body.removeChild(iframeElement);
		eval(sFragId + "TransientsFetched=true;");
	}

	return true;
}

function CViewerFragmentPropertiesPage_fetchTransientValues(sFragId)
{
	var transientsFetched = eval(sFragId + "TransientsFetched");

	if(transientsFetched === false && document.getElementById("getTransientsIframe") == null)
	{
		var urlParams = eval(sFragId + "GetTransientsURLParams");

		if (typeof CAFXSSEncode == "function")
		{
			urlParams = CAFXSSEncode(urlParams);
		}

		var url = eval(sFragId + "Action") + "?" + urlParams;

		var iframeElem = document.createElement("iframe");

		if(iframeElem.attachEvent)
		{
			iframeElem.attachEvent("onload", CViewerFragmentPropertiesPage_processGetTransientsResponse);
		}
		else
		{
			iframeElem.addEventListener("load", CViewerFragmentPropertiesPage_processGetTransientsResponse, true);
		}

		iframeElem.setAttribute("id","getTransientsIframe");
		iframeElem.setAttribute("fragId", sFragId);
		iframeElem.setAttribute("src",url);
		iframeElem.setAttribute("name", "getTransientsIframe");
		iframeElem.setAttribute("frameborder",'0');
		iframeElem.style.display="none";

		document.body.appendChild(iframeElem);

		var okButton = document.getElementById("advPropsbtnok");
		if (okButton)
		{
			okButton.disabled = "disabled";
			if (!isIE())
			{
				okButton.setAttribute("originalBackgoundColor", okButton.style.backgroundColor);
				okButton.style.backgroundColor = "#dddddd";
			}
		}
	}

}

function CViewerFragmentPropertiesPage_onclickSharePromptValues(evt)
{
	var sFragId = CViewerFragmentPropertiesPage_getFragIdFromEvent(evt);

	var sharePromptValuesCheckBox = document.getElementById(sFragId + "sharePromptValues");
	if(sharePromptValuesCheckBox.checked)
	{
		var sharePromptAllChannels = document.getElementById(sFragId + "sharePromptAllChannels");
		if(sharePromptAllChannels != null)
		{
			sharePromptAllChannels.checked = true;
		}

		var matchOnParameterNameOnly = document.getElementById(sFragId + "matchOnParameterNameOnly");
		if(matchOnParameterNameOnly != null)
		{
			matchOnParameterNameOnly.disabled = false;
		}

		CViewerFragmentPropertiesPage_fetchTransientValues(sFragId);
	}
	else
	{
		//reset the radio buttons and edit box
		CViewerFragmentPropertiesPage_clearChanneledSection(sFragId + "sharePromptAllChannels", sFragId + "sharePromptOnSpecifiedChannel", sFragId + "promptEventChannel",  sFragId + "matchOnParameterNameOnly");
	}
}

function CViewerFragmentPropertiesPage_validateFormFields(sFragId)
{
	// if we're sharing prompts, drill events, or authored drills are directed
	// at a portlet, and it's specified to use a channel, ensure a channel name
	// was set, otherwise fail validation

	var sValidationString = "";

	// check prompts
	sValidationString += "prompt=" + CViewerFragmentPropertiesPage_validateChanneledProperty(sFragId, "sharePromptValues", "sharePromptOnSpecifiedChannel", "promptEventChannel") + ":";

	// check drill up/down
	sValidationString += "drillUpDown=" + CViewerFragmentPropertiesPage_validateChanneledProperty(sFragId, "shareDrillEvents", "shareDrillEventOnSpecifiedChannel", "drillChannel") + ":";

	// check authored drill through
	sValidationString += "authoredDrillThrough=" + CViewerFragmentPropertyPage_validateAuthoredDrillToPortlet(sFragId, "shareAuthoredDrillEvents", "useAuthoredDrillChannel", "authoredDrillChannel");

	return sValidationString;
}

function CViewerFragmentPropertyPage_isChannelFieldValid(sFragId, sChannelFieldId)
{
	var channelValueNode = document.getElementById(sFragId + sChannelFieldId);
	if(channelValueNode == null || typeof channelValueNode.value == "undefined" || channelValueNode.value == "")
	{
		return false;
	}

	return true;
}

function CViewerFragmentPropertyPage_validateAuthoredDrillToPortlet(sFragId)
{
	var shareAuthoredDrillEvents = document.getElementById(sFragId + "shareAuthoredDrillEvents");
	if(shareAuthoredDrillEvents == null)
	{
		return false;
	}

	if(typeof shareAuthoredDrillEvents.checked != "undefined" && shareAuthoredDrillEvents.checked == true)
	{
		if(!CViewerFragmentPropertyPage_isChannelFieldValid(sFragId, "authoredDrillChannel"))
		{
			return false;
		}
	}

	return true;
}

function CViewerFragmentPropertiesPage_validateChanneledProperty(sFragId, shareCheckBox, useChannelRadio, channelField)
{
	var sharingValues = document.getElementById(sFragId + shareCheckBox);
	if(sharingValues == null)
	{
		return false;
	}

	if(typeof sharingValues.checked != "undefined" && sharingValues.checked == true)
	{
		var channelProperty = document.getElementById(sFragId + useChannelRadio);
		if(channelProperty == null)
		{
			return false;
		}

		var form = document.getElementById(sFragId + "form");
		var formElements = form.elements;
		for(var index = 0; index < formElements.length; ++index)
		{
			var formElement = formElements[index];
			if(formElement.getAttribute("id") != null && formElement.getAttribute("id") == (sFragId + useChannelRadio))
			{
				if(typeof formElement.checked != "undefined" && formElement.checked == true && formElement.getAttribute("value") != null && formElement.getAttribute("value") == "true")
				{
					if(!CViewerFragmentPropertyPage_isChannelFieldValid(sFragId, channelField))
					{
						return false;
					}
					break;
				}
			}
		}
	}

	return true;
}

function CViewerFragmentPropertiesPage_processDialogEvents(evt)
{
	if (evt.eventPhase == evt.AT_TARGET)
	{
		switch(evt.name)
		{
			case "cognos.ui.dialog.ok":
				evt.preventDefault();
				CViewerFragmentPropertiesPage_getData(evt.source.id);
				break;
			case "cognos.ui.dialog.cancel":
				var fragment = eval(evt.source.id);
				fragment.raiseEvent("cognos.viewer.plugin.preferences.close", null, null);
				break;
		}
	}
}

function CViewerFragmentPropertiesPage_buildURL(obj)
{
	var urlString = "";
	if (obj)
	{
		for (var key in obj)
		{
			urlString += key + '=' + obj[key] + '&';
		}
	}

	return urlString;
}

function CViewerFragmentPropertiesPage_setData(sFragId, propsObj)
{
	var form = document.getElementById(sFragId + "form");
	if(form != null)
	{
		var formElements = form.elements;
		for (var i=0; i < formElements.length; i++)
		{
			var elem = formElements[i];
			var elemName = elem.name;
			var elemVal = elem.value;
			var propsVal = propsObj[elemName];
			if (elem.type == "radio")
			{
				if (elemVal == propsVal)
				{
					elem.checked = true;
				}
				else
				{
					elem.checked = false;
				}
			}
			else if (elem.type == "checkbox")
			{
				propsVal = propsObj[elemName];
				if (elemVal == propsVal)
				{
					elem.checked = true;
				}
				else
				{
					elem.checked = false;
				}
			}
			else if (elem.type == 'select-one')
			{
				var optionElems = elem.options;
				for (var j=0; j < optionElems.length; j++)
				{
					if (propsVal == optionElems[j].value)
					{
						optionElems[j].selected = true;
					}
				}
			}
			else if ((elem.type != "checkbox") && (elem.type != "radio"))
			{
				elem.setAttribute("value", propsVal);
			}
		}
	}
}

function CViewerFragmentPropertiesPage_getSelectedProperties(sFragId)
{
	var propsObj = {};

	var form = document.getElementById(sFragId + "form");

	if(form != null)
	{
		var formElements = form.elements;
		for (var i=0; i < formElements.length; i++)
		{
			var elem = formElements[i];
			var elemName = elem.name;

			if ((elem.type == "radio") && (elem.checked))
			{
				propsObj[elemName] = elem.value;
			}
			else if ((elem.type == "checkbox") && (elem.checked))
			{
				propsObj[elemName] = elem.value;
			}
			else if ((elem.type != "checkbox") && (elem.type != "radio"))
			{
				propsObj[elemName] = CViewerFragmentPropertiesPage_encodeParam(elem.value);
			}
			else if(elemName == "p_viewerToolbarNormalMode" || elemName == "p_viewerToolbarMaximizeMode")
			{
				propsObj[elemName] = "";
			}
		}
	}

	return propsObj;
}

function CViewerFragmentPropertiesPage_getData(sFragId)
{
	var sValidationString = CViewerFragmentPropertiesPage_validateFormFields(sFragId);
	if (sValidationString.indexOf("false") == -1)
	{
		var propsObj = CViewerFragmentPropertiesPage_getSelectedProperties(sFragId);
		var propsURL = CViewerFragmentPropertiesPage_buildURL(propsObj);

		var fragment = window[sFragId];
		fragment.retrieve(propsURL + "dialogSubmit=true&propsURL=" + encodeURIComponent(propsURL));
	}
	else
	{
		CViewerFragmentPropertiesPage_highlightErrors(sFragId, sValidationString);
		alert(eval(sFragId + "NO_CHANNEL_SPECIFIED_ERROR"));
	}
}

function CViewerFragmentPropertiesPage_encodeParam(param)
{
	var encodedUrl = "";
	var paramsArray = param.split("=");

	if (paramsArray.length > 1)
	{
		var encodedVal = encodeURIComponent(paramsArray[1]);
		encodedUrl += paramsArray[0] + "=" + encodedVal;
	}
	else
	{
		encodedUrl = encodeURIComponent(param);
	}

	return encodedUrl;
}