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

function ModalFaultDialog(){}
ModalFaultDialog.prototype = new FaultDialog();

ModalFaultDialog.prototype.show = function(soapFaultDocument) {

	var detailsString = "";
	var messageString = "", messageStringNode = "";
	var errorMessages = XMLHelper_FindChildrenByTagName(soapFaultDocument, "message", true);

	if(errorMessages.length > 0)
	{
		for(var messageIndex = 1; messageIndex < errorMessages.length; ++messageIndex)
		{
			messageStringNode = XMLHelper_FindChildByTagName(errorMessages[messageIndex], "messageString", false);
			detailsString += XMLHelper_GetText(messageStringNode, false) + "\n";
		}

		messageStringNode = XMLHelper_FindChildByTagName(errorMessages[0], "messageString", false);
		messageString = XMLHelper_GetText(messageStringNode, false);
	}

	bux.messageBox(bux.MB_ERROR, messageString, "",  detailsString);
};
