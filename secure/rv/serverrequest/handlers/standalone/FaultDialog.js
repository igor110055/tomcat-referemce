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

function FaultDialog(oCV) {
	this.m_oCV = oCV;
}
FaultDialog.prototype = new IFaultDialog();

FaultDialog.prototype.show = function(soapFault) {
	// we should never get here since stand alone Viewer doesn't handle SOAP faults. The fault
	// should have been returned as an HTML page
	if(typeof console != "undefined") { 
		console.log("FaultDialog - an unhandled soap fault was returned: %o", soapFault);
	}
};

FaultDialog.prototype.handleUnknownHTMLResponse = function(responseText) {
	// make sure we clear the tracking and conversation before we unload the viewer
	// or we'll trigger a cancel request which will more then likely cause another fault.
	this.m_oCV.setTracking("");
	this.m_oCV.setConversation("");

	if (responseText) {
		// this is an HTML response, most likely a fault page.
		// Bug #: 650188 -- IE is blank page, FF and Chrome appear to be continually loading... The below code fixes both.  Must be enabled using a
		// switch in viewerconfig.properties or advanced server properties.
		if(this.m_oCV.envParams["useAlternateErrorCodeRendering"]){
			var headNode = document.getElementsByTagName("head")[0];
			var bodySrc = responseText.match(/<body[^>]*>([\s\S]*)<\/body>/im)[1];

			// Loop through and add any scripts to our head
			var scriptRegEx = /<script[^>]*>([\s\S]*?)<\/script>/igm;
			var scriptNode = scriptRegEx.exec(responseText);

			while (scriptNode != null) {
				var aScript = document.createElement("script");
				aScript.type= 'text/javascript';
				var scriptSrc = scriptNode[0].match(/src="([\s\S]*?)"/i);
				if (scriptSrc == null){
					aScript.text= scriptNode[1];  // script is inline
				} else {
					aScript.src = scriptSrc[1];  // script is linked 
				}
				headNode.appendChild(aScript);

				scriptNode = scriptRegEx.exec(responseText);
			}

			document.body.innerHTML = bodySrc;
		} else {
			document.write(responseText);
		}
	}
};
