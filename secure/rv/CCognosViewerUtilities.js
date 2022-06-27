/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2015
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
/**
	Loads dynamically CSS and JavaScript files and execute inline scripts found in HTML code in the response outputs.
	@constructor
*/
function CScriptLoader(sWebContentRoot)
{
	/**
		Array of files to load.
		@type array
		@private
	*/
	this.m_oFiles = {};
	/**
		Array of inline script to execute.
		@type array
		@private
	*/
	this.m_aScripts = [];

	/**
		Array of document.writes/document.writeln to execute.
		@type array
		@private
	*/
	this.m_aDocumentWriters = [];

	this.m_ajaxWarnings = [];

	this.m_bIgnoreAjaxWarnings = false;
	
	this.m_bHandleStylesheetLimit = false;
	
	/**
		Length of the interval (in Milliseconds) to check if files are done loading and that we can execute the inline scripts.
		@type integer
		@private
	*/
	this.m_iInterval = 20;

	/**
		Regular expression to retrieve CSS file paths.
		@type RegularExpression
		@private
	*/
	this.m_reFindCssPath = new RegExp('<link[^>]*href="([^"]*)"', "i");

	/**
		Regular expression to retrieve CSS inline code.
		@type RegularExpression
		@private
	*/
	this.m_reFindInlineStyle = /<style\b(\s|.)*?<\/style>/gi;

	/**
		Regular expression to test if a CSS (&lt;link&gt; tag) is present.
		@type RegularExpression
		@private
	*/
	this.m_reHasCss = /<link .*?>/gi;

	/**
		Regular expression to test if a file name has a CSS extension.
		@type RegularExpression
		@private
	*/
	this.m_reIsCss = /\.css$/i;
	/**
		Regular expression to test if a file name has a JS extension.
		@type RegularExpression
		@private
	*/
	this.m_reIsJavascript = /\.js$/i;
	/**
		Regular expression to test if a file name is a Prompting Toolkit Locale JS file.
		If there are changes to Prmt localization file names this may have to be revisited.
		@type RegularExpression
		@private
	*/
	this.m_reIsPromptingLocaleJavascript = /prompting.res.[promptingStrings|promptLocale].*\.js$/i;			
	/**
		Regular expression to match closing &lt;script&gt; tags.
		@type RegularExpression
		@private
	*/
	this.m_reScriptTagClose = /\s*<\/script>.*?$/i;
	/**
		Regular expression to match opening &lt;script&gt; tags.
		@type RegularExpression
		@private
	*/
	this.m_reScriptTagOpen = /^.*?<script[^>]*>\s*/i;

	/**
		Regular expression to match closing &lt;style&gt; tags.
		@type RegularExpression
		@private
	*/
	this.m_reStyleTagClose = /(-|>|\s)*<\/style>\s*$/gi;
	/**
		Regular expression to match opening &lt;style&gt; tags.
		@type RegularExpression
		@private
	*/
	this.m_reStyleTagOpen = /^\s*<style[^>]*>(\s|<|!|-)*/gi;

	/**
		Regular expression to match any escaped backslashes,
		quotes or double quotes.
		@type RegularExpression
		@private
	*/
	this.m_reEscapedCharacters = /\\[\\"']/g;

	/**
		Regular expression to match any strings, assuming no
		escaped characters.
		@type RegularExpression
		@private
	*/
	this.m_reStringLiterals = /("|')[\s\S]*?\1/g;

	/**
		String that represents the web content root
		@type String
		@private
	*/
	this.m_sWebContentRoot = sWebContentRoot;

	/**
		Flag to signal that loaded scripts have completed execution
		@type Boolean
		@private
	*/
	this.m_bHasCompletedExecution = false;

	/**
		Array of scripts to be loaded (in order) by inserting them into the DOM
		@type Array
		@private
	*/

	this.m_aScriptLoadQueue = [];

	/**
		Flag to signal that a script is currently being downloaded and executed. When set
		to true, other scripts will be placed in the queue until the script has been loaded.
		@type Boolean
		@private
	*/
	this.m_bBlockScriptLoading = false;

	/**
		Flag to signal that script load order should be enforced. This is currently only necessary
		with Internet Exlporer. See: http://www.stevesouders.com/blog/2009/04/27/loading-scripts-without-blocking/.
		@type Boolean
		@private
	*/
	// this flag is set to false to fix bugs: COGCQ00247831 and COGCQ00249348
	this.m_bUseScriptBlocking = false;
	
	/**
		Flag to signal that a Prompting Locale script is currently being downloaded and executed. When set
		to true, other Prompting Locale scripts will be placed in the queue.
		@type Boolean
		@private
	*/
	this.m_bBlockPromptingLocaleScripts = false;
	
	/**
		Array of scripts to be loaded (in order - synchronously) by inserting them into the DOM
		@type Array
		@private
	*/
	this.m_aBlockedPromptingLocaleFileQueue  = [];	
}


/**
	Return whether or not the loaded scripts have completed execution
	@public
*/
CScriptLoader.prototype.hasCompletedExecution = function()
{
	return this.m_bHasCompletedExecution;
};

CScriptLoader.prototype.setHandlerStylesheetLimit = function(handleLimit) {
	this.m_bHandleStylesheetLimit = handleLimit;
};

/**
	Helper function to execute all inline javascript from a page, after all javascript files were loading and processed.
	@private
*/
CScriptLoader.prototype.executeScripts = function(callback, sNamespaceId)
{
	if (this.isReadyToExecute())
	{
		for (var idxScript = 0; idxScript < this.m_aScripts.length; idxScript++)
		{
			if (this.m_aScripts[idxScript])
			{
				var oScript = document.createElement('script');
				oScript.setAttribute("language", "javascript");
				oScript.setAttribute("type", "text/javascript");
				this.addNamespaceAttribute(oScript, sNamespaceId);
				oScript.text = this.m_aScripts[idxScript];
				document.getElementsByTagName("head").item(0).appendChild(oScript);
			}
		}

		this.m_aScripts = [];

		for(var idx = 0; idx < this.m_aDocumentWriters.length; ++idx)
		{
			var documentWriter = this.m_aDocumentWriters[idx];
			documentWriter.execute();
		}

		this.m_aDocumentWriters = [];

		if (!this.m_aScripts.length && !this.m_aDocumentWriters.length)
		{
			if (typeof callback == "function") {
				callback();
			}
			this.m_bHasCompletedExecution = true;
		}
		else
		{
			setTimeout(function(){window.gScriptLoader.executeScripts(callback, sNamespaceId);}, this.m_iInterval);
		}
	}
	else
	{
		setTimeout(function(){window.gScriptLoader.executeScripts(callback, sNamespaceId);}, this.m_iInterval);
	}
};

/**
	Helper function.
	@type bool
	@private
	@return true if all files in {m_oFiles} are set to 'complete'. false otherwise.
*/
CScriptLoader.prototype.isReadyToExecute = function()
{
	for (var idxFile in this.m_oFiles)
	{
		if (this.m_oFiles[idxFile] != "complete")
		{
			return false;
		}
	}

	if (this.m_aScriptLoadQueue.length > 0) {
		return false;
	}

	return true;
};

/**
	Load and process a CSS file from HTML code [received from an ajax response].
	@private
	@param {string} sHTML HTML code with a &lt;link&gt; tag.
	@param {object} oReportDiv The report div.
*/
CScriptLoader.prototype.loadCSS = function(sHTML, oReportDiv, bUseNamespacedGRS, sNamespaceId)
{
	var aM = sHTML.match(this.m_reHasCss);
	if (aM)
	{
		for (var i = 0; i < aM.length; i++)
		{
			if (aM[i].match(this.m_reFindCssPath))
			{
				var linkRef = RegExp.$1;
				if(linkRef.indexOf("GlobalReportStyles") != -1)
				{
					this.validateGlobalReportStyles(linkRef);
					if (bUseNamespacedGRS)
					{
						// only time we're using the namespaced stylesheet is when we're in BUX,
						// so make sure we bring in the new styles
						if (linkRef.indexOf("GlobalReportStyles.css") != -1) {
							linkRef = linkRef.replace("GlobalReportStyles.css", "GlobalReportStyles_10.css");
						}
						var sClassPrefix = this.getGlobalReportStylesClassPrefix(linkRef);
						linkRef = linkRef.replace(".css", "_NS.css");
						if (oReportDiv) {
							oReportDiv.className = "buxReport " + sClassPrefix;
						}
					}
				}

				this.loadObject(linkRef, sNamespaceId);
			}

			// remove the link tag from the html block
			sHTML = sHTML.replace(aM[i], "");
		}
	}

	return sHTML;
};

/**
 * @private
 * @param (String)
 */
CScriptLoader.prototype.getGlobalReportStylesClassPrefix = function(globalReportStyleLinkRef)
{
	var sClassPrefix = null;
	if (globalReportStyleLinkRef.indexOf("GlobalReportStyles_10.css") != -1)
	{
		sClassPrefix = "v10";
	}
	else if (globalReportStyleLinkRef.indexOf("GlobalReportStyles_1.css") != -1)
	{
		sClassPrefix = "v1";
	}
	else if (globalReportStyleLinkRef.indexOf("GlobalReportStyles_none.css") != -1)
	{
		sClassPrefix = "vnone";
	}
	else if (globalReportStyleLinkRef.indexOf("GlobalReportStyles.css") != -1)
	{
		sClassPrefix = "v8";
	}
	return sClassPrefix;
};

/**
 * @private
 * @param (String)
 */
CScriptLoader.prototype.validateGlobalReportStyles = function(globalReportStyleLinkRef)
{
	var linkNodes = document.getElementsByTagName("link");
	for(var i = 0; i < linkNodes.length; ++i)
	{
		var linkNode = linkNodes[i];
		if(linkNode.getAttribute("href").indexOf("GlobalReportStyles") != -1)
		{
			if(linkNode.getAttribute("href").toLowerCase() != globalReportStyleLinkRef.toLowerCase())
			{
				//COGCQ00654064: only compares the file names
				var existingGRSRef = globalReportStyleLinkRef.split("/");
				var newGRSRef = linkNode.getAttribute("href").split("/");
				if(existingGRSRef[existingGRSRef.length -1] != newGRSRef[newGRSRef.length-1])
				{
					this.m_ajaxWarnings.push("Ajax response contains different versions of the GlobalReportStyles.css.");
				}
			}

			break;
		}
	}
};

/**
	Load a file synchronously and return the content.
	@param {string} sURL URL to fetch
	@param {string} sParams parameter string to add to the file
	@param {string} sType POST or GET
	@type string
	@return The content of the file
	@private
*/
CScriptLoader.prototype.loadFile = function(sURL_param, sContent_param, sType_param)
{
	var sURL = "";
	if (sURL_param) {
		sURL = sURL_param;
	}
	var sContent = null;
	if (typeof sContent_param == "string") {
		sContent = sContent_param;
	}
	var sType = "POST";
	if (sType_param == "GET") {
		sType = "GET";
	}

	var oHTTPRequest = null;
	if (typeof ActiveXObject != "undefined")
	{
		oHTTPRequest = new ActiveXObject("Msxml2.XMLHTTP");
	}
	else
	{
		oHTTPRequest = new XMLHttpRequest();
	}

	oHTTPRequest.open(sType, sURL, false);
	oHTTPRequest.send(sContent);

	return oHTTPRequest.responseText;
};

/**
	Helper Function. Event called when a file status is changed (ie. when it's done loading).
	@private
*/
function CScriptLoader_onReadyStateChange() {
	if (typeof this.readyState == "undefined") {
		// Mozilla-based browser are using onload event, so we are here when the file is done loading.
		this.readyState = "complete";
	}
	if (this.readyState == "loaded" || this.readyState == "complete") {
		var path = this.sFilePath;
		// if we don't have path check for the href attribute - this is for CSS files.
		if (!path && this.getAttribute) {
			path = this.getAttribute("href");
		}

		window.gScriptLoader.setFileState(path, "complete");
		window.gScriptLoader.m_bBlockScriptLoading = false;
		
		// If we were loading a prompting locale file and the one that just finished is a prompting locale file, check to 
		// see if we were blocking another one from loading and load it if we were.
		if (this.sFilePath && window.gScriptLoader.m_bBlockPromptingLocaleScripts && 
			this.sFilePath.match(window.gScriptLoader.m_reIsPromptingLocaleJavascript)) {
			window.gScriptLoader.m_bBlockPromptingLocaleScripts = false;
			if (window.gScriptLoader.m_aBlockedPromptingLocaleFileQueue.length > 0) {
				var sQueueObject = window.gScriptLoader.m_aBlockedPromptingLocaleFileQueue.shift();
				window.gScriptLoader.loadObject(sQueueObject.sName, sQueueObject.sNamespaceId);
			}
		}
		
		if (window.gScriptLoader.m_aScriptLoadQueue.length > 0) {
			window.gScriptLoader.loadObject();
		}
	}
}

/**
 * Used to move links from the body to the head
 */
CScriptLoader.prototype.moveLinks = function(node) {
	if (!node) {
		return;
	}
	
	var sName = node.getAttribute("href");
	
	if (!sName || this.m_oFiles[sName]) {
		return;
	}
	
	this.m_oFiles[sName] = "complete";
	
	document.getElementsByTagName("head").item(0).appendChild(node);
};

/**
	Helper function to load and process file (CSS or Javascript) from HTML code received from an ajax response.
	@private
	@param {string} sName
*/
CScriptLoader.prototype.loadObject = function(sName, sNamespaceId) {
	var oFile = null;

	if (typeof sName === "undefined") {
		if (this.m_aScriptLoadQueue.length > 0) {
			var sQueueObject = this.m_aScriptLoadQueue.shift();
			sName = sQueueObject.name;
			sNamespaceId = sQueueObject.namespaceId;
		} else {
			return;
		}
	}

	if (this.m_oFiles[sName]) {
		return;
	}

	if (this.m_bBlockScriptLoading) {
		this.m_aScriptLoadQueue.push({
			"name": sName,
			"namespaceId": sNamespaceId
		});
	} else {
		if (sName.match(this.m_reIsCss))
		{
			// Add a <link> tag in the document. This let the browser deals with the cache.
			oFile = document.createElement('link');
			oFile.setAttribute("rel", "stylesheet");
			oFile.setAttribute("type", "text/css");
			oFile.setAttribute("href", sName);

			// In IE the css files aren't always loaded before we insert the HTML. Wait for
			// the onreadystatechange event that lets us know the css file has been loaded.
			if (window.isIE && window.isIE()) {
				oFile.onreadystatechange = CScriptLoader_onReadyStateChange;
				oFile.onload = CScriptLoader_onReadyStateChange;
				oFile.onerror = CScriptLoader_onReadyStateChange;
				this.m_oFiles[sName] = "new";
			}
			else {
				this.m_oFiles[sName] = "complete";
			}
		}
		else if (sName.match(this.m_reIsJavascript))
		{
			// Need to handle prompt locale files differently. We need to make sure we're only loading one at a time.
			if (sName.match(this.m_reIsPromptingLocaleJavascript)) {

				// If we're already loading a prompt locale file, block this one for now.
				if (this.m_bBlockPromptingLocaleScripts) {
					this.m_aBlockedPromptingLocaleFileQueue.push ({
						'sName' : sName,
						'sNamespaceId' : sNamespaceId
					});
					return;
				}
				this.m_bBlockPromptingLocaleScripts = true;
			}		
		
			this.m_bBlockScriptLoading = this.m_bUseScriptBlocking;
			oFile = document.createElement('script');
			oFile.setAttribute("language", "javascript");
			oFile.setAttribute("type", "text/javascript");
			oFile.setAttribute("src", sName);
			oFile.sFilePath = sName;
			oFile.onreadystatechange = CScriptLoader_onReadyStateChange;
			oFile.onload = CScriptLoader_onReadyStateChange;
			oFile.onerror = CScriptLoader_onReadyStateChange;
			this.addNamespaceAttribute(oFile, sNamespaceId);
			this.m_oFiles[sName] = "new";
		}

		if (oFile)
		{
			document.getElementsByTagName("head").item(0).appendChild(oFile);
		}

	}

};


/**
 *	Finds script tags under a provided element, examines the scripts, makes any
 *	necessary substitutions (e.g. _THIS_ is replaced with the namespace), sets
 *	the scripts up for later execution, and removes the script tags from the
 *	actual document body.
 */
CScriptLoader.prototype.loadScriptsFromDOM = function(domElement, sNamespaceId, bProcessDocumentWrite)
{
	if (!domElement)
	{
		return;
	}

	var scriptElements = domElement.parentNode.getElementsByTagName("script");
	while(scriptElements.length > 0)
	{
		var scriptElement = scriptElements[0];
		if (scriptElement.getAttribute("src") != null && scriptElement.getAttribute("src").length > 0)
		{
			this.loadObject(scriptElement.getAttribute("src"), sNamespaceId);
		}
		else
		{
			var sScript = scriptElement.innerHTML;

			var hasDocumentWrite = false;

			if(sScript.indexOf("document.write")!= -1) {
				//document.write may be included in a string, not in the script itself,
				//particularly in the report description. The report description is
				//included in the same script tag as initialization code which must be
				//executed through m_aScripts, not m_aDocumentWriters, as the order
				//of code execution is relevant (the script node which contains the report
				//description is also the node which contains viewer initialization code,
				//and so this node must be loaded before all others). For this reason,
				//check that the document.write is indeed in the script by deleting
				//strings enclosed in quotes and checking for it after:

				//Remove \\s, \"s and 's, then "..."s and '...'s
				var stripQuotes = sScript.replace(this.m_reEscapedCharacters, "").replace(this.m_reStringLiterals, "");

				hasDocumentWrite = (stripQuotes.indexOf("document.write") != -1);
			}

			if(hasDocumentWrite) {
				if (bProcessDocumentWrite) {
					var sId = "CVScriptFromDOMPlaceHolder" + scriptElements.length + sNamespaceId;
					var spanElement = scriptElement.ownerDocument.createElement("span");
					spanElement.setAttribute("id", sId);
					scriptElement.parentNode.insertBefore(spanElement, scriptElement);
					this.m_aDocumentWriters.push(new CDocumentWriter(sId, sScript));
				}
			} else if (sScript.length > 0) {
				this.m_aScripts.push(sScript);
			}
		}

		scriptElement.parentNode.removeChild(scriptElement);
	}
};

/**
	Move the style elemnts from the HTML body to the head so they'll get evaluated
	@private
	@param {string} sHTML HTML code with a &lt;style&gt; tag.
*/
CScriptLoader.prototype.loadStyles = function(domElement, sNamespaceId)
{
	if (!domElement || !domElement.parentNode)
	{
		return;
	}

	var styleElements = domElement.parentNode.getElementsByTagName("style");
	while(styleElements.length > 0) {
		var styleElement = styleElements[0];

		if (sNamespaceId) {
			this.addNamespaceAttribute(styleElement, sNamespaceId);
		}
			
		if (window.isIE && window.isIE() && window.getNavVer() < 10) {
			// IE has a limit of 31 stylesheets. If ever we reach the limit, then re-submit the request in "page" mode.
			// fix for trakker 564899 and 615224
			if ((document.getElementsByTagName("style").length + document.getElementsByTagName("link").length) >= 30) {
				if (this.m_bHandleStylesheetLimit) {
					
					// Loops through all the Viewers and ask any that are currently hidden to remove their styles from the head
					if( typeof window.gaRV_INSTANCES != "undefined") {
						for (var i=0; i < window.gaRV_INSTANCES.length; i++) {
							window.gaRV_INSTANCES[i].cleanupStyles();
						}
					}
				}
				
				// Last try to see if there's now room for the style
				if ((document.getElementsByTagName("style").length + document.getElementsByTagName("link").length) >= 30) {
					if (typeof console != "undefined" && console && console.log) {
						console.log("Stylesheet limit reached.");
					}
					
					this.m_ajaxWarnings.push("Stylesheet limit reached.");
					return;
				}
			}
		}

		document.getElementsByTagName("head").item(0).appendChild(styleElement);
	}
};

CScriptLoader.prototype.loadAll = function(oReportDiv, callback, sNamespaceId, bProcessDocumentWrite)
{
	this.m_bScriptLoaderCalled = true;
	
	this.m_bHasCompletedExecution = false;
	this.loadScriptsFromDOM(oReportDiv, sNamespaceId, bProcessDocumentWrite);

	if(this.containsAjaxWarnings())
	{
		return false;
	}

	// need to load the css and styles after we've replaced the innerHTML of the div
	// since IE would end up removing the styles from the head when the html in the div got replaces
	// bug 573581
	this.loadStyles(oReportDiv, sNamespaceId);

	if(this.containsAjaxWarnings())
	{
		return false;
	}

	this.executeScripts(callback, sNamespaceId);
	return true;
};


/**
	Setter for the loading state of a file.
	@private
	@param {string} sFile Path of the file to load.
	@param {string} sState State of the current file. Can be 'new' or 'complete'.
*/
CScriptLoader.prototype.setFileState = function(sFile, sState)
{
	this.m_oFiles[sFile] = sState;
};

CScriptLoader.prototype.containsAjaxWarnings = function(){
	if (this.m_bIgnoreAjaxWarnings) {
		return false;
	}
	else {
		return (this.m_ajaxWarnings.length > 0);
	}
};

CScriptLoader.prototype.addNamespaceAttribute = function(oItem, sNamespaceId)
{
	if (typeof sNamespaceId === "string") {
		oItem.setAttribute("namespaceId", sNamespaceId);
	}
};

// Declare a global instance of CScriptLoader if none exists. We just need one instance per page.
if (typeof window.gScriptLoader == "undefined")
{
	window.gScriptLoader = new CScriptLoader();
}
