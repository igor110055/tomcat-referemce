/**
* jt_utils.js - Misc. JavaScript utility functions
*
* @version 16 Feb 2006
* @author  Joseph Oster, wingo.com, Copyright (c) 2005-2006
*/

/* GENERIC FUNCTIONS */
String.prototype.trim = function () {
  return this.replace(/^\s+/g, '').replace(/\s+$/g, '');
  }

function jt_ShowHideElm(elm, showIt) {
  if (elm) elm.style.visibility = (showIt) ? "visible" : "hidden";
  }

function jt_ShowNoneElm(elm, showIt, showStyle) {
  if (!showStyle) showStyle = "";
  if (elm) elm.style.display = (showIt) ? showStyle : "none";
  }

function jt_ShowHide(divName, showIt) {
  jt_ShowHideElm(document.getElementById(divName), showIt);
  }

function jt_ShowNone(divName, showIt, showStyle) {
  jt_ShowNoneElm(document.getElementById(divName), showIt, showStyle);
  }


/********** BEGIN: Event handling **********/
function jt_AddListener(obj, evType, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evType, fn, false);
    return true;
    }
  else if (obj.attachEvent) return obj.attachEvent('on' + evType, fn);
  else return false;
  }

function jt_fixE(ev) {
  var e = ev ? ev : window.event;
  return e;
  }
/********** END: Event handling **********/


/********** BEGIN: screen handling **********/
function jt_Point(x, y) {
  // returns a "Point" object with '.x' and '.y' properties
  this.x = x;
  this.y = y;
  }

function jt_getOffsetXY(obj, findID) {
  // returns an object with both '.x' and '.y' offsets of 'obj' relative to 'findID' (or page if 'findID' doesn't exist)
  // usage: "var point = jt_getOffsetXY(obj); var left=point.x; var top=point.y;"
  var xPos = obj.offsetLeft;
  var yPos = obj.offsetTop;
  var parent = obj.offsetParent;
  if (typeof findID == 'undefined') findID = '!@#$%^&*()';
  while ((parent != null) && (parent.id != findID)) {
    xPos += parent.offsetLeft;
    yPos += parent.offsetTop;
    parent = parent.offsetParent;
    }
  return new jt_Point(xPos, yPos);
  }

function jt_moveTo(obj, x, y) {
  // moves 'obj' to x/y coordinates
  obj.style.left = x + "px";
  obj.style.top = y + "px";
  }

function jt_getOffsetX(obj) {
  // returns 'x' coordinate of 'obj'
  var xPos = obj.offsetLeft;
  var parent = obj.offsetParent;
  while (parent != null) {
    xPos += parent.offsetLeft;
    parent = parent.offsetParent;
    }
  return xPos;
  }

function jt_getOffsetY(obj) {
  // returns 'y' coordinate of 'obj'
  var yPos = obj.offsetTop;
  var parent = obj.offsetParent;
  while (parent != null) {
    yPos += parent.offsetTop;
    parent = parent.offsetParent;
    }
  return yPos;
  }

function jt_windowOffsetX() {
  // returns X-offset of window (for positioning popups)
  if (window.screenX) return window.screenX + (window.outerWidth-window.innerWidth) - window.pageXOffset;
  else return document.body.scrollLeft + window.screenLeft;
  }

function jt_windowOffsetY() {
  // returns Y-offset of window (for positioning popups)
  if (window.screenY) return window.screenY + (window.outerHeight-24-window.innerHeight) - window.pageYOffset;
  else return document.body.scrollTop + window.screenTop;
  }

function jt_getChromeY() {
  // return height of browser "chrome" ('screenTop' offset)
  return window.screenTop ? window.screenTop : (window.outerHeight - window.innerHeight - 24);
  }

/********** END: screen handling **********/
// also see: http://www.mattkruse.com/javascript/anchorposition/source.html


/********** BEGIN: FORM handling **********/
function jt_setRadio(radioFld, val) {
  // set 'radioFld' button with value == val and return 'true' (if not disabled!)
  for (var i=0; i<radioFld.length; i++)
    if (radioFld[i].value == val)
      if (!radioFld[i].disabled) {
        radioFld[i].checked = true;
        return true;
        }
  return false;
  }

function jt_getRadio(radioFld) {
  // return value of selected 'radioFld' button
  var st = "";
  for (var i=0; i<radioFld.length; i++)
    if (radioFld[i].checked) {
      st = radioFld[i].value;
      break;
      }
  return st;
  }

function foSelected(pulldown) {
  // return value of selected item
  var st = "";
  for (var i=0; i<pulldown.options.length; i++)
  if (pulldown.options[i].selected) {
    if (pulldown.options[i].value) st = pulldown.options[i].value
    else st = pulldown.options[i].text;
    break;
    }
  return st;
  }

function foPosInList(pulldown, val) {
  // return position of 'val' in pulldown menu, -1 if not found
  if (val != "")
    for (var i=0; i<pulldown.options.length; i++) {
      var opVal = pulldown.options[i].value;
      if (opVal == "") opVal = pulldown.options[i].text;
      if (opVal == val) {
        return i;
        break;
        }
      }
  return -1;
  }

function foSetSelectVal(pulldown, val) {
  // set "SELECTED" for item in pulldown menu with 'value==val'
  var p = foPosInList(pulldown,val);
  if (p != -1) pulldown.options.selectedIndex = p;
  }
/********** END: FORM handling **********/


function jt_parseQuery(queryString) {
  // converts name/value pairs in 'queryString' to JS object
  var qObj = new Object();
  var stQuery = (queryString) ? queryString : location.search; // use 'location.search' if 'queryString' is null
  if (stQuery.indexOf("?") == 0) stQuery = stQuery.substring(1);
  if (stQuery) {
    var nvPairs = stQuery.split("&");
    for (var i=0; i < nvPairs.length; i++) {
      var posEq = nvPairs[i].indexOf("=");
      if (posEq != -1) eval( "qObj." + nvPairs[i].substring(0,posEq) + "='" + nvPairs[i].substring(posEq+1) + "'");
      }
    }
  return qObj;
  }

function jt_safeHTML(st) {
  // encode - same as 'u:htmlencode' tag
  if (st.length == 0) return "";
  st = st.replace(/</gi,"&lt;");
  st = st.replace(/>/gi,"&gt;");
  st = st.replace(/\"/gi,'&quot;');
  st = st.replace(/\'/gi,"&#39;");
  st = st.replace(/\\/gi,"&#92;");
  return st;
  }

function jt_unsafeHTML(st) {
  // decode - opposite of 'u:htmlencode' tag
  if (st.length == 0) return "";
  st = st.replace(/&lt;/gi,"<");
  st = st.replace(/&gt;/gi,">");
  st = st.replace(/&quot;/gi,'"');
  st = st.replace(/&#39;/gi,"'");
  st = st.replace(/&#92;/gi,"\\");
  return st;
  }

function jt_plural(qty, lbl) {
  // returns plural suffix or optional extended format if 'lbl' is present; example: qty=12, lbl="server", return value="12 servers"
  var stPlural = (qty == 1) ? "" : "s";
  if (lbl) stPlural = qty + " " + lbl + stPlural;
  return stPlural;
  }

function objToString(anObj, sep) {
  // convert any JS object to string of name:value pairs separated by optional 'sep'
  // NOTE: pass '<br />' for 'sep' to display as HTML
  if (!sep) sep = ' ][ '; // good for 'alert()' msgs
  var st = "";
  for(var prop in anObj) {
    if ((prop.charAt(0) == '$') || ((typeof anObj[prop]) == 'function')) continue;
    if (st != "") st += sep;
    st += prop + ':' + anObj[prop];
    }
  return st;
  }

function jt_alignCorner(elmToMove, elmAnchor, TlTrBlBr, xOffset, yOffset) {
  // aligns 'elmToMove' with 'elmAnchor' based on 2-character 'TlTrBlBr' indicating corner: 'TL' | 'TR' | 'BL' | 'BR'
  xOffset = xOffset ? xOffset : 0; // optional param
  yOffset = yOffset ? yOffset : 0; // optional param
  var anchorXY = jt_getOffsetXY(elmAnchor);
  var xxOffset = (TlTrBlBr.indexOf('R') != -1) ? elmToMove.offsetWidth - elmAnchor.offsetWidth : 0;
  var yyOffset = (TlTrBlBr.indexOf('B') != -1) ? elmToMove.offsetHeight : 0;
  jt_moveTo(elmToMove, anchorXY.x - xxOffset + xOffset, anchorXY.y - yyOffset + yOffset);
  }

function jt_boxOverlap(objectA, objectB, mode) {
  // box collision detector; returns area of overlap (if any) in pixels between DOM elements 'objectA' and 'objectB'
  // adapted from http://www.gamedev.net/reference/articles/article754.asp
  // 'mode' is optional - two special modes are offered:
  //   mode='X' - test for overlap of X-coordinates only; ignore Y
  //   mode='Y' - test for overlap of Y-coordinates only; ignore X

  var xyA = jt_getOffsetXY(objectA);
  var xyB = jt_getOffsetXY(objectB);

  var objAxTL = xyA.x; // AX1 - xTopLeft
  var objAyTL = xyA.y; // AY1 - yTopLeft
  var objAxBR = xyA.x + objectA.offsetWidth; // AX2 - xBottomRight
  var objAyBR = xyA.y + objectA.offsetHeight; // AY2 - yBottomRight

  var objBxTL = xyB.x; // BX1
  var objByTL = xyB.y; // BY1
  var objBxBR = xyB.x + objectB.offsetWidth; // BX2
  var objByBR = xyB.y + objectB.offsetHeight; // BY2

/*
alert("objAxTL=" + objAxTL + " - objAyTL=" + objAyTL + " - objAxBR=" + objAxBR + " - objAyBR=" + objAyBR + "\n" +
      "objBxTL=" + objBxTL + " - objByTL=" + objByTL + " - objBxBR=" + objBxBR + " - objByBR=" + objByBR);
*/


/*
reject the following conditions:
AX2<BX1
AY2<BY1
BX2<AX1
BY2<AY1
*/
  if (mode != 'Y') {
    if (objAxBR < objBxTL) return -1;
    if (objBxBR < objAxTL) return -1;
    }
  if (mode != 'X') {
    if (objAyBR < objByTL) return -1;
    if (objByBR < objAyTL) return -1;
    }


  var objCxTL;
  var objCyTL;
  var objCxBR;
  var objCyBR;

/*
If AX1<BX1 then CX1=BX1 and CX2=AX2, otherwise, CX1=AX1 and CX2=BX2
If AY1<BY1 then CY1=BY1 and CY2=AY2, otherwise, CY1=AY1 and CY2=BY2
*/

  if (objAxTL < objBxTL) {
    objCxTL = objBxTL;
    objCxBR = objAxBR;
    }
  else {
    objCxTL = objAxTL;
    objCxBR = objBxBR;
    }

  if (objAyTL < objByTL) {
    objCyTL = objByTL;
    objCyBR = objAyBR;
    }
  else {
    objCyTL = objAyTL;
    objCyBR = objByBR;
    }

  var olX = objCxBR - objCxTL;
  var olY = objCyBR - objCyTL;
  if (mode == 'X') return olX;
  else if (mode == 'Y') return olY;
  else return olX * olY;
  }


function jt_currStyle(divToRead) {
  // return current (derived) CSS style object
  var cs = divToRead.style;
  if (window.getComputedStyle) cs = window.getComputedStyle(divToRead,null);
  else if (divToRead.currentStyle) cs = divToRead.currentStyle;
  return cs;
  }

function jt_divOnScrn(divOnScrn) {
  var divPos = jt_getOffsetXY(divOnScrn);
  var newX = divPos.x;
  var newY = divPos.y;
  if (divPos.x + divOnScrn.offsetWidth - document.body.scrollLeft > document.body.clientWidth) newX = document.body.scrollLeft + document.body.clientWidth - divOnScrn.offsetWidth;
  if (divPos.x < document.body.scrollLeft) newX = document.body.scrollLeft;
  if (divPos.y + divOnScrn.offsetHeight - document.body.scrollTop > document.body.clientHeight) newY = document.body.scrollTop + document.body.clientHeight - divOnScrn.offsetHeight;
  if (divPos.y < document.body.scrollTop) newY = document.body.scrollTop;
  if ((newX != divPos.x) || (newY != divPos.y)) jt_moveTo(divOnScrn, newX, newY);
  }
