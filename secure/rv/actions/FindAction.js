/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
 * FindAction - finds visible matching node and returns
 */
function FindAction() {
	this.m_requestParams = null;
	this.m_sAction = 'find';
	this.findState = null;
	this.pageState = null;
	this.findConfig = null;
}

FindAction.prototype = new CognosViewerAction();
FindAction.baseclass = CognosViewerAction.prototype;


FindAction.prototype.setConfigAndState = function(params)
{
	var cv = this.getCognosViewer();
	var cvState = cv.getState();
	this.findConfig = cv.getConfig().getFindActionConfig();
	this.pageState = cvState.getPageState();
	this.findState = cvState.getFindState();
}

FindAction.prototype.setRequestParms = function(params)
{
	this.setConfigAndState();
	
	var cv = this.getCognosViewer();
	var cvState = cv.getState();

	if (cvState.getFindState()) {
		this.clearPreviousResult();
	}
	cvState.clearFindState();
	
	if (params) {
		if (this.pageState == null) {
			cvState.setPageState({});
			this.pageState = cvState.getPageState();
		}	
		
		cvState.setFindState(params);
		this.findState = cvState.getFindState();
	}
};

FindAction.prototype.execute = function() {

	if (!this.findState) {
		return;
	}
		
	return this.findAndShow();
}

FindAction.prototype.findAndShow = function() {
	
	var cv = this.getCognosViewer();
	var hasNextPage = cv.hasNextPage();
	var hasPrevPage = cv.hasPrevPage();	
	var currentPage = this.pageState.getCurrentPage();

	var matches = this.findOnClient();
	this.findState.updatePageInfo(matches, currentPage, hasNextPage, hasPrevPage);
		
	if (matches.length == 0) {
		if (this.findState.checkServerForNextMatch()) {
			return cv.executeAction('FindNextOnServer');
		} else {
			var callback = this.findConfig.getNoMatchFoundCallback();
			callback();
			return false;
		}
	} else {
		var currentFocus = this.findState.firstMatch();
		this.applyFocusStyle(currentFocus);
	}
	return true;
}

FindAction.prototype.clearPreviousResult = function(removeHighlights) {
	if (removeHighlights !== false) {
		this.removeHighlights();
	} 
		
	this.findState.resetPageInfo();	
}

FindAction.prototype.findOnClient = function() {
	
	var keyword = this.findState.getKeyword();
	
	//remove previous highlights
	this.removeHighlights();
	
	var matchingElements = new Array();	
	var cv = this.getCognosViewer();
	var reportDiv = document.getElementById("CVReport" + cv.getId());
	
	this.findMatches(reportDiv, keyword, this.findState.isCaseSensitive(), matchingElements, 0, new FindPartialMatchHelper(), -1);
	this.applyMatchStyle(matchingElements);

	return matchingElements;
};

FindAction.prototype.applyMatchStyle = function(matchingElements) {

	var matchCount = matchingElements.length;
	for (var idx = matchCount-1 ; idx>= 0; idx-- ) {
		var matchObjArray = matchingElements[idx];
		for (var i = matchObjArray.length -1; i >=0 ;i--) {
			var matchObj = matchObjArray[i];			
			var element = matchObj.element; //Element contains matching string
			
			var textNode = element.childNodes[0];
			var text = textNode.data;
			var textLength = text.length;
			
			var start = matchObj.start;
			var size = matchObj.matchedStr.length;
			
			var strBeforeMatch = (start>0) ? text.substring(0,start) : "";
			var strAfterMatch = (start+size < textLength) ? text.substring(start+size, textLength) : "";
			
			
			var matchSpan = document.createElement('span');
			matchSpan.setAttribute('tabIndex', 0);
			matchSpan.setAttribute('style', this.findConfig.getMatchUIStyle());
			matchSpan.style.background = this.findConfig.getMatchColor();//IE
			matchSpan.appendChild(document.createTextNode(matchObj.matchedStr));
			
			//build children backward: afterMatch - match span - beforeMatch
			textNode.data = strAfterMatch; 
			element.insertBefore(matchSpan, textNode);

			if (strBeforeMatch.length >0) {
				var textNodeBeforeMatch = document.createTextNode(strBeforeMatch);
				element.insertBefore(textNodeBeforeMatch, matchSpan);
			}
			if (strAfterMatch.length == 0) {
				element.removeChild(textNode);
			}
			matchObj.element = matchSpan;//update element with the matchSpan just created
		}
	}
};

FindAction.prototype.removeHighlights = function() {

	var matches = this.findState.getMatches();
	
	var currentFocus = this.findState.getFocusedMatch();
	if (currentFocus) {
		this.restoreMatchStyle(currentFocus);	
	}
	
	if (matches && matches.length>0) {
		var matchCount = matches.length;
		for(var i = 0; i< matchCount; i++) {
			var matchObjArray = matches[i];
			for (var j=0; j<matchObjArray.length; j++) {
				var matchObj = matchObjArray[j];
				var element = matchObj.element; //Span with match background color
				if (element) {
					var parentNode = element.parentNode;
					
					//Find a textNode sibling
					var textNode = null;
					var isTestNodeBeforeMatch = false;
					if (element.previousSibling && element.previousSibling.nodeType == 3) {
						textNode = element.previousSibling;
						isTestNodeBeforeMatch = true;
					} else if (element.nextSibling && element.nextSibling.nodeType == 3) {
						textNode =  element.nextSibling;
					}
					
					if (textNode) {
						textNode.data = isTestNodeBeforeMatch ? (textNode.data + matchObj.matchedStr) : (matchObj.matchedStr + textNode.data);
						
						parentNode.removeChild(element);
						if (textNode.nextSibling && textNode.nextSibling.nodeType == 3) { // merge next textNode
							textNode.data = textNode.data + textNode.nextSibling.data;
							parentNode.removeChild(textNode.nextSibling);
						}						
					} else {
						//Parent has only match span, replace with TextNode
						var textNodeMatch = document.createTextNode(matchObj.matchedStr);
						parentNode.insertBefore(textNodeMatch, element);
						parentNode.removeChild(element);
					}
					
				}
			}
		}
	}
};

FindAction.prototype.manageFocusStyle = function(matchObjArray, operation) {

	if (!matchObjArray) {
		return;
	}
	
	for (var i = matchObjArray.length -1; i >=0 ;i--) {
		var matchObj = matchObjArray[i];

		var element = matchObj.element;
		
		if ('restoreMatchStyle' === operation) {
			element.setAttribute('style', this.findConfig.getMatchUIStyle());
			element.style.background = this.findConfig.getMatchColor();//IE
		} else {
			element.setAttribute('style', this.findConfig.getFocusUIStyle());
			element.style.background = this.findConfig.getFocusColor();//IE
			element.focus();
			if (element.blur) {
				element.blur();
			}
		}
	}
}


FindAction.prototype.applyFocusStyle = function(matchObjArray) {
	this.manageFocusStyle(matchObjArray);
}
FindAction.prototype.restoreMatchStyle = function(matchObjArray) {
	this.manageFocusStyle(matchObjArray, 'restoreMatchStyle');	
}

FindAction.prototype.isVisible = function ( node ) {
	var styleCheck =  this.checkDisplayStyle(node);
	return ( !styleCheck.isVisibilityHidden && !styleCheck.isDisplayNone);
}

FindAction.prototype.checkDisplayStyle = function ( node ) {
	
	var visibility = null;
	var display = null;
	if (window.getComputedStyle) { //FF
		var style = window.getComputedStyle( node, "visibility" );
		if (!style) {
			style = window.getComputedStyle( node, "display" );	
		}
		if (style) {
			visibility = style['visibility'];
			display = style['display'];
		}
	} else if ( node.currentStyle ) { //IE
		visibility = node.currentStyle.visibility;
		display = node.currentStyle.display;
	}
	
	var isDisplayInline = (display && display.indexOf('block') == -1 && display.indexOf('inline') >=0);
	
	var obj = {
			'isVisibilityHidden': ('hidden' == visibility),
			'isDisplayNone': ('none' == display),
			'isDisplayInline': isDisplayInline,
			'display' : display
	};	
	return obj;
}

FindAction.prototype.findMatches = function(node, keyword,  isCaseSensitive, resultArray, elementIndex, partialMatchHelper, blockDisplayParentIndex) {

	if (node.nodeType === 3) { // Text Node
		var text = node.data;
		if (text) {
			var parentTagName = node.parentNode.tagName.toUpperCase();				
			if (parentTagName !== 'SCRIPT' && parentTagName !== 'STYLE') {
				var finalKeyword = isCaseSensitive? keyword : keyword.toUpperCase();
				var finalText = isCaseSensitive? text : text.toUpperCase();
				
				for(var startPosition = 0; startPosition< text.length; ) {
					startPosition = this.match(startPosition, node, finalText, finalKeyword, resultArray, elementIndex, partialMatchHelper, blockDisplayParentIndex);
				}
			}
		}
	} else if (node.nodeType === 1 ) {  //Element Node
		var styleCheck =  this.checkDisplayStyle(node);
		
		if (!styleCheck.isDisplayInline) {
			blockDisplayParentIndex = elementIndex;
			partialMatchHelper.reset();
		}
		
		if (styleCheck.isVisibilityHidden) {
			partialMatchHelper.reset();
			return; //skip the text
		}
		if (styleCheck.isDisplayNone) {
			return;//skip the text
		}
			
		for (var child = node.firstChild; child != null ; child = child.nextSibling) {
			this.findMatches(child, keyword, isCaseSensitive, resultArray, ++elementIndex, partialMatchHelper, blockDisplayParentIndex);
		}
	}
};

FindAction.prototype.match = function(startPosition, node, text, keyword, resultArray, elementIndex, partialMatchHelper, blockDisplayParentIndex) {
	
	if(!text || startPosition>=text.length) {
		return (startPosition +1); //End of string
	}	
		
	var originalText = node.data;
	var startIndexOfKeyword =  partialMatchHelper.startIndexOfKeyword;

	var matchObj = this.matchByLetter(text, keyword, originalText, startPosition, startIndexOfKeyword);
	if (!matchObj) {
		return startPosition+1;//no match
	}
	
	var matchedString = matchObj.matchedStr;
	if (matchedString.length == keyword.length) { //full match
		matchObj.update('full', elementIndex, node.parentNode, blockDisplayParentIndex)
			
		resultArray.push( [matchObj] );
		partialMatchHelper.reset();
		return (startPosition + matchedString.length); //Continue next letters
	}
	
	//Partial Match - head
	if (startIndexOfKeyword == 0) {
		matchObj.update('head', elementIndex, node.parentNode, blockDisplayParentIndex)
		partialMatchHelper.add(matchObj);
		return (startPosition + matchedString.length); //Continue next letters
	}
	
	var prevMatchObj = partialMatchHelper.partialMatches[partialMatchHelper.partialMatches.length-1];
	if (prevMatchObj.blockDisplayParentIndex != blockDisplayParentIndex) { //block display
		partialMatchHelper.reset();
		return (text.lenght+1); //Partial match is broken. Move on to next text
	}

	//Partial Match - middle
	if ( (startIndexOfKeyword + matchedString.length) < keyword.length){
		matchObj.update('middle', elementIndex, node.parentNode, blockDisplayParentIndex)
		partialMatchHelper.add(matchObj);
		return (startPosition + matchedString.length); //Continue next letters
	}
			
	//Partial Match - tail, partial matches 
	if ( (startIndexOfKeyword + matchedString.length) == keyword.length){
		matchObj.update('tail', elementIndex, node.parentNode, blockDisplayParentIndex)
		partialMatchHelper.add(matchObj);
		
		resultArray.push( partialMatchHelper.partialMatches.slice(0) ); //Copy into resultArray
		partialMatchHelper.reset();
	}
	return (startPosition + matchedString.length); //Continue next letters
}

FindAction.prototype.matchByLetter = function(text, keyword, originalText, indexOfText, indexOfKeyword) {

	var startPosition = indexOfText;
	var compareNextLetter = true;
	var matchCount=0;
	for (; indexOfText<text.length && compareNextLetter ; indexOfText++, indexOfKeyword++) {
		if ( this.safeLetter(text.charCodeAt(indexOfText)) == this.safeLetter(keyword.charCodeAt(indexOfKeyword))) {
			compareNextLetter = true;
			if ( ++matchCount == keyword.length) {
				break; //full match
			}
		} else {
			compareNextLetter = false;
		}
	}
	
	if (!compareNextLetter) {
		return null;
	}
		
	return new FindMatch(startPosition, originalText.substr(startPosition, matchCount));
}

FindAction.prototype.safeLetter = function(c) {
	if(c == 160) {//non-breaking space &nbsp;
		return 32; //space
	} else {
		return c;
	}
}



//=========================
/**
 * FindMatch class is used to keep a matched string and related information. A match can be full or partial match. 
 */
function FindMatch(start, matchedStr) {
	this.start = start; //Starting position of match
	this.matchedStr = matchedStr; //Matched string. it can be full string or partial of searching.
	this.index = null; //Unique id of element. An element can have many matches.
	this.element = null; //parent element of current match
	this.type = null; //full, head, middle, or tail
	this.blockDisplayParentIndex = null; //Partial matches must belong to same block display parent element
	this.orgStyle = null;
}
FindMatch.prototype = {};

FindMatch.prototype.update = function(type, index, element, blockDisplayParentIndex) {
	this.index = index;
	this.element = element
	this.type = type;
	this.blockDisplayParentIndex = blockDisplayParentIndex;
	
	this.orgStyle = this.element.getAttribute('style');
}

/**
 * FindPartialMatchHelper class   
 */
function FindPartialMatchHelper() {
	this.startIndexOfKeyword = 0;
	this.partialMatches = null; //Array of matches
}
FindPartialMatchHelper.prototype = {};

FindPartialMatchHelper.prototype.reset = function() {
	this.startIndexOfKeyword = 0;
	this.partialMatches = null;
}

FindPartialMatchHelper.prototype.add = function(matchObj) {
	if (!this.partialMatches) {
		this.partialMatches = [];
	}
	this.partialMatches.push(matchObj);
	this.startIndexOfKeyword  += matchObj.matchedStr.length;	
}

