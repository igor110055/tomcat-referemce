/**
 * <p>this is just a collection of utility functions.</p>
 *
 */

function JsUtil()
{
}

JsUtil.isUndefined = function (aValue)
{
   return typeof(aValue) == "undefined";
}

JsUtil.isFunction = function (aValue)
{
   return typeof(aValue) == "function";
}

JsUtil.isObject = function (aValue)
{
   return aValue && typeof(aValue) == "object" || JsUtil.isFunction(aValue);
}

JsUtil.isArray = function (aValue)
{
   return JsUtil.isObject(aValue) && aValue.constructor == Array;
}

JsUtil.isNull = function (aValue)
{
   return typeof(aValue) == "object" && !aValue;
}


JsUtil.arrayContains = function (anArray, aValue)
{
   if (!JsUtil.isArray(anArray)) { return false; }
   for (var idx in anArray) {
      if (anArray[idx] == aValue) {
         return true;
      }
   }
   return false;
}

JsUtil.removeElementFromArrayByValue = function (anArray, aValue)
{
   var newArray = new Array();
   for (var i = 0; i < anArray.length; ++i)
   {
      if (anArray[i] != aValue)
      {
         newArray[newArray.length] = anArray[i];
      }
   }

   return newArray;
}

/**
 * remove all supplied elements from the source array
 **/
JsUtil.removeElementsFromArrayByValues = function (aSourceArray, anArrayOfValues)
{
   var newArray = new Array();
   for (var i = 0; i < aSourceArray.length; ++i)
   {
      if (!JsUtil.arrayContains(anArrayOfValues, aSourceArray[i]))
      {
         newArray.push(aSourceArray[i]);
      }
   }

   return newArray;
}

/**
 * returns true if the supplied value is not null and is not undefined
 **/
JsUtil.isGood = function (aValue)
{
   return JsUtil.isUndefined(aValue) == false && JsUtil.isNull(aValue) == false;
}



/**
 * IE and Moz handle events differently, this will normalize the event
 */
JsUtil.normalizeEvent = function (anEvent)
{
   return (anEvent) ? anEvent : ((window.event) ? window.event : null);
}

JsUtil.getEventTarget = function (anEvent)
{
   return is_ie ? anEvent.srcElement : anEvent.target;
}

JsUtil.removeElementFromArrayByIndex = function (anArray, anIndex)
{
   var newArray = new Array();
   for (var i = 0; i < anArray.length; ++i)
   {
      if (i != anIndex)
      {
         newArray[newArray.length] = anArray[i];
      }
   }

   return newArray;
}



JsUtil.cloneObject = function(aSrc)
{
   var clonedObject = new Object();

   for(p in aSrc)
   {
      clonedObject[p] = aSrc[p];
   }
   return clonedObject;
}





function debugSortFunction(a,b)
{
   if (a == undefined)
      return -1;

   if (b == undefined)
      return 1;

   var isLessThan = a.name.toLowerCase() < b.name.toLowerCase();
   return (isLessThan ? -1 : 1);
}


JsUtil.debugObject = function(aTitle, anObject)
{
   var debugWindow = JsUtil.openNewWindow("",
                        "_blank",
                        "width=1000,height=600,top=100,left=100,menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=no");


   var msg = '<html><head></head><body onload="self.focus();"><h1>' + aTitle + '</h1><hr/>' +
             '<table border="1">\n' +
             '<tr style="background-color:#AAAAAA"><td>Name</td><td >Value</td><td>Type</td></tr>\n';

   var allProps = new Array();

   var nvPair = null;
   for(p in anObject)
   {
      nvPair = new Object();
      nvPair.name = p;
      nvPair.value = anObject[p];

      allProps[allProps.length] = nvPair;
   }

   allProps.sort(debugSortFunction);


   for (var i = 0; i < allProps.length; ++i)
   {
      nvPair = allProps[i];
      msg += "<tr><td>" + nvPair.name + "</td><td>" + nvPair.value + "</td><td>" + typeof(nvPair.value) + "</td></tr>\n";
   }

   msg += "</table>";
   msg += "</body></html>";


   //--- jumping through a few hoops for timing reasons - open window, wait a bit, then write...
   JsUtil.debugObject.window = debugWindow;
   JsUtil.debugObject.msg = msg;

   try
   {
      var fn = function()
      {
         try
         {
            JsUtil.debugObject.window.document.write(JsUtil.debugObject.msg);
         }
         catch (e)
         {
         }
      }

      setTimeout(fn, 1000);
   }
   catch (e)
   {
   }
}


JsUtil.debugString = function(aTitle, aString)
{
   var debugWindow = JsUtil.openNewWindow("",
                        "_blank",
                        "width=1000,height=600,top=100,left=100,menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=no");


   var msg = '<html><head></head><body onload="self.focus();"><h1>' + aTitle + '</h1><hr/>' +
             '<pre>\n' +
             JsUtil.putCData(aString) +
             '</pre>\n';

   msg += "</body></html>";


   //--- jumping through a few hoops for timing reasons - open window, wait a bit, then write...
   JsUtil.debugObject.window = debugWindow;
   JsUtil.debugObject.msg = msg;

   var fn = function()
   {
      JsUtil.debugObject.window.document.write(JsUtil.debugObject.msg);
   }

   setTimeout(fn, 1000);
}







/**
 * removes all rows from the supplied table section
 *
 **/
JsUtil.clearTableRows = function (aTableSection)
{
   while (aTableSection.rows.length > 0)
   {
      aTableSection.deleteRow(0);
   }
}

/**
 * removes all child nodes from the supplied node
 *
 **/
JsUtil.clearChildNodes = function (aNode)
{
   while (aNode.childNodes.length > 0)
   {
      aNode.removeChild(aNode.firstChild);
   }
}



/**
 * makes all normally occurring spaces in a string -> &nbsp;
 *
 **/
JsUtil.makeAllSpacesNonBreaking = function (aString)
{
   return aString.replace(/\ /g, "&nbsp;");
}




/**
 * returns a string where each object in the array becomes a url parameter value.
 *
 * JsUtil.arrayToUrlParams ( [5, 10], "param1" )  -> param1=5&param1=10
 *
 **/
JsUtil.arrayToUrlParams = function(anArray, aParamName)
{
   var asParams = '';
   for (var i = 0; i < anArray.length; ++i)
   {

      asParams += (i != 0 ? '&' : '') + aParamName + "=" + anArray[i];
   }
   return asParams;
};



/**
 * return substring after the last occurrence of the search string
 **/
JsUtil.substringAfterLast = function(aSourceString, aSearchString)
{
   if (!(aSourceString))
      return null;

   if (!(aSearchString))
      return aSourceString;

   if (aSourceString.length == 0)
      return '';

   var index = aSourceString.lastIndexOf(aSearchString);

   if (index == -1 || index == (aSourceString.length - aSearchString.length))
      return '';

   return aSourceString.substr(index + aSearchString.length);
};

/**
 * return substring after the first occurrence of the search string
 **/
JsUtil.substringAfterFirst = function(aSourceString, aSearchString)
{
   if (!(aSourceString))
      return null;

   if (!(aSearchString))
      return aSourceString;

   if (aSourceString.length == 0)
      return '';

   var index = aSourceString.indexOf(aSearchString);

   if (index == -1 || index == (aSourceString.length - aSearchString.length))
      return '';

   return aSourceString.substr(index + aSearchString.length);
};


/**
 * return substring before the first occurrence of the search string
 **/
JsUtil.substringBeforeFirst = function(aSourceString, aSearchString)
{
   if (!(aSourceString))
      return null;

   if (!(aSearchString))
      return aSourceString;

   if (aSourceString.length == 0)
      return '';

   var index = aSourceString.indexOf(aSearchString);

   //--- not found, return whole search string...
   if (index === -1)
      return aSourceString;

   return aSourceString.substr(0, index);
};




/**
 * Remove leading blanks from our string.
 **/
JsUtil.leftTrim = function(str)
{
   var whitespace = new String(" \t\n\r");

   var s = new String(str);

   if (whitespace.indexOf(s.charAt(0)) != -1) {
      // We have a string with leading blank(s)...

      var j=0, i = s.length;

      // Iterate from the far left of string until we
      // don't have any more whitespace...
      while (j < i && whitespace.indexOf(s.charAt(j)) != -1)
         j++;

      // Get the substring from the first non-whitespace
      // character to the end of the string...
      s = s.substring(j, i);
   }
   return s;
}



/**
* Returns a copy of a string without trailing spaces.
**/
JsUtil.rightTrim = function(str)
{
   // We don't want to trip JUST spaces, but also tabs,
   // line feeds, etc.  Add anything else you want to
   // "trim" here in Whitespace
   var whitespace = new String(" \t\n\r");

   var s = new String(str);

   if (whitespace.indexOf(s.charAt(s.length-1)) != -1) {
      // We have a string with trailing blank(s)...

      var i = s.length - 1;       // Get length of string

      // Iterate from the far right of string until we
      // don't have any more whitespace...
      while (i >= 0 && whitespace.indexOf(s.charAt(i)) != -1)
         i--;


      // Get the substring from the front of the string to
      // where the last non-whitespace character is...
      s = s.substring(0, i+1);
   }

   return s;
}


/*
=============================================================
Trim(string) : Returns a copy of a string without leading or trailing spaces
=============================================================
*/
JsUtil.trim = function(str)
/*
   PURPOSE: Remove trailing and leading blanks from our string.
   IN: str - the string we want to Trim

   RETVAL: A Trimmed string!
*/
{
   return JsUtil.rightTrim(JsUtil.leftTrim(str));
}

/*
=============================================================
Numeric Check
=============================================================
*/

JsUtil.isInteger = function(str)
{;
   for (var i = 0; i != str.length; i++)
   {
		var aChar = str.charAt(i);
		if (aChar < "0" || aChar > "9")
      {
			return false;
		}
	}
	return true;
}

/**
 * returns true if the supplied string is empty or null...
 **/
JsUtil.isEmptyString = function(aString)
{
   if (aString)
   {
      var trimmed = JsUtil.trim(aString);

      return trimmed.length == 0;
   }
   return true;
};

JsUtil.NumbersOnly = function(strValue)
{
	var sNumberValues = "0123456789.";
	var intFirst = 0;
	var strCheckValue = "";
	var intSecond = 0;
	var blnNumber = false;

	for (intFirst=0; intFirst<strValue.length; intFirst++) {
		strCheckValue = strValue.charAt(intFirst);
		blnNumber = false;
		for (intSecond=0; intSecond<sNumberValues.length ; intSecond++) {
			if (strCheckValue == sNumberValues.charAt(intSecond)) {
				blnNumber = true;
				break;
			}
		}
		if (!blnNumber)
			break;
	}
	return (blnNumber);
}

JsUtil.EncodeAmpersandForCrn = function(aStr)
{
   var returnString = "";

   for (var i=0; i < aStr.length; i++)
   {
      strValue = aStr.charAt(i);
      if (strValue == "&")
      {
        strValue = "&amp;";
      }

      returnString += strValue;
   }

   return returnString;
}



JsUtil.putCData = function(aStr)
{

   if (aStr.indexOf("&") != -1 ||
       aStr.indexOf("<") != -1 ||
       aStr.indexOf(">") != -1 ||
       aStr.indexOf("'") != -1 ||
       aStr.indexOf('"') != -1)
   {
      aStr = "<![CDATA[" + aStr + "]]>";
   }

   return aStr;
}


JsUtil.createXmlHttpRequest = function ()
{
   if(Ext.isIE)
   {
      return new ActiveXObject("Microsoft.XMLHTTP");
   }
   else
   {
      return new XMLHttpRequest();
   }
}


/**
 *
 * @constructor
 **/
function XmlHttpRequestCallBackHandler (aRequest, aOnFinishFn)
{
   this.request = aRequest;
   this.onFinishFn = aOnFinishFn;

   this.callBackFn = function() {

      //--- arguments.callee refers to the function object itself ("this" by default
      //    refers to the window during the call)...
      var thisPointer = arguments.callee.realObject;

      //alert("callBackFn called [" + thisPointer.request.readyState + "]");
      if (thisPointer.request.readyState == 4)
      {
         thisPointer.onFinishFn(thisPointer.request);
      }
   };

   //--- some vodoo so that we can get back the real this pointer during
   //    the context of a supposedly "free function"
   this.callBackFn.realObject = this;

   aRequest.onreadystatechange = this.callBackFn;
}

JsUtil.escapeQuotations = function(aStr)
{
   var QUOTE_ESCAPE_TRANSLATIONS = new Object();
   QUOTE_ESCAPE_TRANSLATIONS['"'] = '&quot;';
   var QUOTE_ESCAPE_CHARS = '"';

   aStr = "" + aStr; //---- if a number is passed....
   var returnString = "";

   for (var i=0; i < aStr.length; i++)
   {
      var strValue = aStr.charAt(i);

      if(QUOTE_ESCAPE_CHARS.indexOf(strValue) != -1)
      {
         strValue = QUOTE_ESCAPE_TRANSLATIONS[strValue];
      }

      returnString += strValue;
   }

   return returnString;
};



//--- static members...
JsUtil.XML_ESCAPE_TRANSLATIONS = new Object();
JsUtil.XML_ESCAPE_TRANSLATIONS['&'] = '&amp;';
JsUtil.XML_ESCAPE_TRANSLATIONS['>'] = '&gt;';
JsUtil.XML_ESCAPE_TRANSLATIONS['<'] = '&lt;';
JsUtil.XML_ESCAPE_TRANSLATIONS['"'] = '&quot;';
JsUtil.XML_ESCAPE_TRANSLATIONS['\''] = '&apos;';
JsUtil.XML_ESCAPE_CHARS = '&><"\'';

JsUtil.escapeXml = function(aStr)
{
   aStr = "" + aStr; //---- if a number is passed....
   var returnString = "";

   for (var i=0; i < aStr.length; i++)
   {
      var strValue = aStr.charAt(i);

      if(JsUtil.XML_ESCAPE_CHARS.indexOf(strValue) != -1)
      {
         strValue = JsUtil.XML_ESCAPE_TRANSLATIONS[strValue];
      }

      returnString += strValue;
   }

   return returnString;
}

/**
 * esacape any characters in the string that should be replaced in HTML, e.g.
 * an '&' character will be replaced by '&amp;'
 **/
JsUtil.escapeHtml = function(aStr)
{
   //--- for now, this is pretty much the same as escapeXml...
   return JsUtil.escapeXml(aStr);
}

/**
 * escape any apostrophe
 **/
JsUtil.escapeApostrophe = function(aStr)
{
   aStr = "" + aStr; //---- if a number is passed....
   var returnString = "";
   for (var i=0; i < aStr.length; i++)
   {
      var strValue = aStr.charAt(i);

      if("\'" == strValue)
      {
         strValue = '\\\'';
      }
      returnString += strValue;
   }

   return returnString;
}


/**
 * add all properties from one object to another
 *
 * @param aSrc - the source object
 * @param aDest - the destination object
 *
 **/
JsUtil.copyObjectProperties = function(aSrc, aDest)
{
   var key;
   
   for (key in aSrc)
   {
      aDest[key] = aSrc[key];
   }
}

// relies upon BrowserSniffer variable 'is_ie5up'
JsUtil.attachDOMCallback = function(anElement, aHandler, aFunctionBody) {
   if (is_ie5up) {
      anElement.setAttribute(aHandler, new Function(aFunctionBody));
   } else {
      anElement.setAttribute(aHandler, aFunctionBody);
   }
}

JsUtil.openNewWindow = function(aUri, aName, aFeatureStr) {

   var win = window.open(aUri, aName, aFeatureStr);
   if (!JsUtil.isGood(win))
   {
      alert(applicationResources.getProperty("jsUtil.unableToOpenWindow"));
   }
   return win;
}


/**
 * copy object properties to an array...
 **/
JsUtil.objectToArray = function(anObject)
{
   var array = new Array();
   var key;
   for (key in anObject)
   {
      array.push(anObject[key]);
   }
   
   return array;
}




/**
 * hide all visible selects (returns an array of these that can be passed to
 **/
JsUtil.hideAllSelects = function(aDocument)
{
   var sels = aDocument.getElementsByTagName("select");
   for (var i = 0; i < sels.length; ++i)
   {
      if (sels[i].style.display != "none")
      {
         sels[i].oldDisplay = sels[i].style.display;
         sels[i].style.display = "none";
      }
   }
};

JsUtil.restoreHiddenSelects= function(aDocument)
{
   var sels = aDocument.getElementsByTagName("select");
   for (var i = 0; i < sels.length; ++i)
   {
      if (JsUtil.isGood(sels[i].oldDisplay))
      {
         sels[i].style.display = sels[i].oldDisplay;
         sels[i].oldDisplay = null;
      }
   }
};


/**
 * finds the first input type="text" element in the document and focuses it
 * @param aDocument
 */
JsUtil.focusFirstTextInput = function(aDocument)
{
   var allInputs = aDocument.getElementsByTagName("input");
   var eachInput;
   for (var i = 0; i < allInputs.length; ++i)
   {
      eachInput = allInputs[i];

      if (eachInput.getAttribute("type") == "text")
      {
         window.status = "focusing on [" + eachInput.getAttribute("name") + "]";
         eachInput.focus();
         break;
      }
   }
};

/**
 * These 3 utility cookie methods are from http://www.quirksmode.org/js/cookies.html
 */
JsUtil.createCookie = function(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

JsUtil.readCookie = function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

JsUtil.consumeCookiesStartingWith = function(name) {
   var ca = document.cookie.split(';');
   var allValues = new Array();
   for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(name) == 0)
      {
         var eqIndex = c.indexOf( "=" );
         allValues.push(c.substring(eqIndex+1,c.length));
         this.eraseCookie(c.substring(0, eqIndex));
      }
	}
	return allValues;
}

JsUtil.eraseCookie = function(name) {
	this.createCookie(name,"",-1);
}
/**
 * gets the frame elements "document"
 **/
JsUtil.getFrameDocument = function(aFrameElement)
{
   var frameDoc = aFrameElement.contentDocument ? aFrameElement.contentDocument  :
      (aFrameElement.contentWindow ? aFrameElement.contentWindow.document : null);

   return frameDoc;
};


// Base64 encoder/decoder culled from http://www.java2s.com/Code/JavaScript/Language-Basics/Stringencodeanddecode.htm

// Global lookup arrays for base64 conversions
var enc64List, dec64List;
// Load the lookup arrays once
JsUtil.initBase64 = function() {
    enc64List = new Array();
    dec64List = new Array();
    var i;
    for (i = 0; i < 26; i++) {
        enc64List[enc64List.length] = String.fromCharCode(65 + i);
    }
    for (i = 0; i < 26; i++) {
        enc64List[enc64List.length] = String.fromCharCode(97 + i);
    }
    for (i = 0; i < 10; i++) {
        enc64List[enc64List.length] = String.fromCharCode(48 + i);
    }
    enc64List[enc64List.length] = "+";
    enc64List[enc64List.length] = "/";
    for (i = 0; i < 128; i++) {
        dec64List[dec64List.length] = -1;
    }
    for (i = 0; i < 64; i++) {
        dec64List[enc64List[i].charCodeAt(0)] = i;
    }
}

JsUtil.base64Encode = function(str) {
    if(!JsUtil.isGood(enc64List) || !JsUtil.isGood(enc64List))
    {
       JsUtil.initBase64();
    }

    var c, d, e, end = 0;
    var u, v, w, x;
    var ptr = -1;
    var input = str.split("");
    var output = "";
    while(end == 0) {
        c = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
            ((end = 1) ? 0 : 0);
        d = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
            ((end += 1) ? 0 : 0);
        e = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
            ((end += 1) ? 0 : 0);
        u = enc64List[c >> 2];
        v = enc64List[(0x00000003 & c) << 4 | d >> 4];
        w = enc64List[(0x0000000F & d) << 2 | e >> 6];
        x = enc64List[e & 0x0000003F];

        // handle padding to even out unevenly divisible string lengths
        if (end >= 1) {x = "=";}
        if (end == 2) {w = "=";}

        if (end < 3) {output += u + v + w + x;}
    }
    // format for 76-character line lengths per RFC
    var formattedOutput = "";
    var lineLength = 76;
    while (output.length > lineLength) {
      formattedOutput += output.substring(0, lineLength) + "\n";
      output = output.substring(lineLength);
    }
    formattedOutput += output;
    return formattedOutput;
}

JsUtil.base64Decode = function(str) {
    if(!JsUtil.isGood(enc64List) || !JsUtil.isGood(enc64List))
    {
       JsUtil.initBase64();
    }

    var c=0, d=0, e=0, f=0, i=0, n=0;
    var input = str.split("");
    var output = "";
    var ptr = 0;
    do {
        f = input[ptr++].charCodeAt(0);
        i = dec64List[f];
        if ( f >= 0 && f < 128 && i != -1 ) {
            if ( n % 4 == 0 ) {
                c = i << 2;
            } else if ( n % 4 == 1 ) {
                c = c | ( i >> 4 );
                d = ( i & 0x0000000F ) << 4;
            } else if ( n % 4 == 2 ) {
                d = d | ( i >> 2 );
                e = ( i & 0x00000003 ) << 6;
            } else {
                e = e | i;
            }
            n++;
            if ( n % 4 == 0 ) {
                output += String.fromCharCode(c) +
                          String.fromCharCode(d) +
                          String.fromCharCode(e);
            }
        }
    }
    while (typeof input[ptr] != "undefined");
    output += (n % 4 == 3) ? String.fromCharCode(c) + String.fromCharCode(d) :
              ((n % 4 == 2) ? String.fromCharCode(c) : "");
    return output;
}



// TODO: For Firefox, we should update this to support ignoring textNodes.

/**
 * retrieves the N'th sibling of the current element.  If aDistance = 1, this is
 * equivalent to returning anElement.nextSibling.  If aDistance = 2, this is equivalent
 * to anElement.nextSibling.nextSibling, etc.
 *
 * @param anElement - the element from which we'll traverse
 * @param aDistance - the distance (in the sibling direction) which we'll traverse
 */
JsUtil.getNthSibling = function (anElement, aDistance)
{
   var element = anElement;
   for (var i = 0; i < aDistance; ++i)
   {
      element = element.nextSibling;
   }
   return element;
};

// TODO: For Firefox, we should update this to support ignoring textNodes.

/**
 * retrieves the N'th child of the current element.  If aDistance = 1, this is
 * equivalent to returning anElement.firstChild.  If aDistance = 2, this is equivalent
 * to anElement.firstChild.firstChild, etc.
 *
 * @param anElement - the element from which we'll traverse
 * @param aDistance - the distance (in the child direction) which we'll traverse
 */
JsUtil.getNthChild = function (anElement, aDistance)
{
   var element = anElement;
   for (var i = 0; i < aDistance; ++i)
   {
      element = element.nextSibling;
   }
   return element;
};


// TODO: For Firefox, we should update this to support ignoring textNodes.

/**
 * returns the number of sibling nodes that the supplied element has
 * @param anElement
 */
JsUtil.getNumberOfPreceedingSiblings = function (anElement)
{
   var element = anElement;
   var numberOfSiblings = 0;
   while(element.previousSibling)
   {
      element = element.previousSibling;
      numberOfSiblings++;
   }
   return numberOfSiblings;
};

JsUtil.outerHTML = function (anElement)
{
   var parent = anElement.parentNode;
   var el = anElement.ownerDocument.createElement(parent.tagName);
   el.appendChild(anElement);
   var shtml = el.innerHTML;
   parent.appendChild(anElement);
   return shtml;
}

/**
 * returns the minimum value of the arguments passed to it (you can pass more than
 * just two if you need to)...
 */
JsUtil.min = function(aX, aY)
{
   var minValue = arguments[0];

   for (var i = 0; i < arguments.length; ++i)
   {
      if (arguments[i] < minValue)
         minValue = arguments[i];
   }
   return minValue;
}


/**
 * JS implementation of StringBuffer (more efficient string concat)
 *
 * Based on example given here : http://www.softwaresecretweapons.com/jspwiki/javascriptstringconcatenation
 *
 **/
JsUtil.StringBuffer = function() {
  this.buffer = [];
}

JsUtil.StringBuffer.prototype.append = function append(string) {
  this.buffer.push(string);
  return this;
};

JsUtil.StringBuffer.prototype.toString = function toString() {
  return this.buffer.join("");
};

var included = new Array();
JsUtil.include = function (script_filename)
{
   var script = included[script_filename];
   if(JsUtil.isUndefined(script))
   {
    var html_doc = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', script_filename);
    html_doc.appendChild(js);
      included[script_filename] = script_filename;
   }


    return false;


}

