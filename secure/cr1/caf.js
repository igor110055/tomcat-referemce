/****************************************************************
** Licensed Materials - Property of IBM
**
** IBM Cognos Products: CAFJ
** 
** © Copyright IBM Corp. 2005, 2015
** US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp. 
*****************************************************************/

// Copyright (C) 2008 Cognos ULC, an IBM Company. All rights reserved.
// Cognos (R) is a trademark of Cognos ULC, (formerly Cognos Incorporated).

var CAF_HEX_CHARS = "0123456789abcdef";

// Encodes the passed getData string so that it can be used safely with third party tools
// that check for specific characters in GET requets.
// Requires global variables caf_tpXSSCheckingUsed, and caf_tpXSSChars
// to be set externally by CAF getJavascriptConfig (usually using XTS)
function CAFXSSEncode(getData) {
	if (typeof caf_tpXSSCheckingUsed == "undefined" || typeof caf_tpXSSChars == "undefined" || 
			!caf_tpXSSCheckingUsed) {
		return getData;
	}
	var res = "";
	res += "XSSSTART";
	var c = '';
	var isXSSChar = false;
	var j = 0;
	var h1 = 0;
	var h2 = 0;
	var str = "" + getData; // ensure param is string
	for (var i = 0; i < str.length; i++) {
		c = str.charAt(i);
		if (c == '%') {
			res += '*';
		} else if (c == '*') {
			res += "_2a";
		} else if (c == '_') {
			res += "_5f";
		} else {
			isXSSChar = false;
			for (j = 0; j < caf_tpXSSChars.length; ++j) {
				if (c == caf_tpXSSChars.charAt(j)) {
					isXSSChar = true;
					break;
				}
			}
			if (isXSSChar) {
				res += '_';
				h1 = Math.floor(c.charCodeAt(0) / 16);
				h2 = c.charCodeAt(0) - h1 * 16;
				res += CAF_HEX_CHARS.charAt(h1);
				res += CAF_HEX_CHARS.charAt(h2);
			} else {
				res += c;
			}
		}
	}
	res += "XSSEND";
	return res;
}

// CAFXSSEncode utility function that accepts full URLs.
// Extracts get data from the passed url, gets it encoded value, and returns the modified URL
function CAFXSSEncodeURL(url) {
	var str = "" + url; // ensure param is string
	var array = str.split("?");
	if (array.length == 2) {
		var hostPath = array[0];
		var getData = array[1];
		getData = CAFXSSEncode(getData);
		str = hostPath + "?" + getData;
	}
	return str;
}

// Series 7 XSS encode for URLs.
// Requires global variables caf_tpXSSCheckingUsed, and caf_tpXSSChars to be set
function CAFS7XSSEncodeURL(url) {
	if (typeof caf_tpXSSCheckingUsed == "undefined" || typeof caf_tpXSSChars == "undefined" || 
			!caf_tpXSSCheckingUsed) {
		return url;
	}
	var str = "" + url; // ensure param is string
	var array = str.split("?");
	if (array.length == 2) {
		var hostPath = array[0];
		var getData  = array[1];			
		var qs = "AFDATA";
		var isXSSChar = false;
		for (var i = 0; i < getData.length; i++) {
			c = getData.charAt(i);
			if (c == '%') {
				qs += '_25';
			} else  if (c == '_') {
				qs += "_5f";
			} else {
				isXSSChar = false;
				for (j = 0; j < caf_tpXSSChars.length; ++j) {
					if (c == caf_tpXSSChars.charAt(j)) {
						isXSSChar = true;
						break;
					}
				}
				if (isXSSChar) {
					qs += '_';
					h1 = Math.floor(c.charCodeAt(0) / 16);
					h2 = c.charCodeAt(0) - h1 * 16;
					qs += CAF_HEX_CHARS.charAt(h1);
					qs += CAF_HEX_CHARS.charAt(h2);
				} else {
					qs += c;
				}
			}
		}
		str = hostPath + "?" + qs;
	}
	return str;
}

function CAFContainsInvalidString(str) {
	var res = null;
	var re = new RegExp("(</?form\\b|</?script\\b|<embed\\b|</?object\\b|<applet\\b|<meta\\b|\\bonevent\\b|\\bonsubmit\\b|\\bonload\\b|\\bonmouse\\b|<iframe\\b|<frameset\\b|\\bjavascript\\b|\\bexpression\\()", "i");
	var ar = re.exec(str);
	if (ar != null) {
		res = ar[1];
	}
	
	return res;
}

// CAFIsUrlSafe
// Takes the given URL and determines if it is well formed
// syntactically and does not contain any forbidden elements.
// param: url - A string containing the url to check. Null returns
//              false.
// return: boolean indicating safe/not safe.
function CAFIsUrlSafe( url ) {
	
	if ( url == null || url.length == 0 ) {
		return false;
	}


// NOTE:
// The period inside a set class, the square brackets, do not need escaping.  They will mean a literal period character.
// Outside of the set class, unescaped will result in the regular expression period meaning.  If escaped with two
// backslashes, it will mean the literal period character.

//NOTE:
// The relative URL portion in the regular expression does NOT match the java regular expression.  Javascript
// has not possesive quantifier, namely ?>.  Howe


	// Check if URL well formed.		 
	var reUrl = 
             "^(\/|\\.\/|\\.\\.\/|#.+|[^.]([^:]+\/?))(([^\/]+|([^\/]+\/)+[^\/]+))$" +	// relative path
	     "|" +
             "^http(s)?:\/\/" +                           // protocol
   			 "([\\w-]+)([\\w.-]+)([\\w-]+)"    +                   // domain
   			 "(:(\\d|[1-9]\\d|[1-9]\\d\\d|[1-9]" +        // valid ports
   			 "\\d\\d\\d|[1-5]\\d\\d\\d\\d|6[0-4]\\d" +    // 1-65535
   			 "\\d\\d|65[0-4]\\d\\d|655[0-2]\\d|6553[0-5]))?" +
   			 "((\/?)|" +                                  // "/" optional if no path
   			 "((\/[0-9a-z_!~*'().;?<>:@&=+$,%#-]+)+\/?))$"; // path


   	
	var re = new RegExp( reUrl, "i" );
   	var match = re.test( url );
	if ( match == false ) {
		return false;
	}

	// Look for evilness within the string.	
	var reBad = new RegExp("(<\/?form|<\/?script|<embed|<\/?object|<applet|<meta|onevent|onsubmit|onload|onmouse|<iframe|<frameset|javascript|expression\\()", "i");
	var bad = reBad.test( url );
	if ( bad == true ) {
		return false;
	}
	
	return true;
}

// defect 45617 - validate email address using a simplified pattern for the address specification of RFC 5322 section-3.4.1
// CAF server will also do this validation therefore changes here need to be reflected on the server as well 

function CAFIsValidEmailAddress(emailAddr) {
	var regExp = new RegExp("^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-z0A-Z-9])?$");
	return regExp.test(emailAddr);
}

