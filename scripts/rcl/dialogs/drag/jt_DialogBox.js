/**
* jt_DialogBox.js - DHTML modal dialog box
*
* @version 9 Apr 2005
* @author  Joseph Oster, wingo.com, Copyright (c) 2005-2006
*/

jt_DialogBox = function(isModal) {
  // CONSTRUCTOR for 'jt_DialogBox' object
  if (arguments.length==0) return;
  this.isModal = isModal;

  if (jt_DialogBox.veilOverlay == null) { // once per page
    jt_DialogBox.veilOverlay = document.createElement('div');
    jt_DialogBox.veilOverlay.className = "jtDialogBoxVeil"; // CSS className
    jt_DialogBox.veilOverlay.style.zIndex = jt_DialogBox.veilZ;
    jt_DialogBox.veilOverlay.innerHTML = "&nbsp;";
    jt_DialogBox.setVeilWidth();
    jt_DialogBox.addListener(window, "resize", jt_DialogBox.setVeilWidth);
    document.body.appendChild(jt_DialogBox.veilOverlay);

    jt_DialogBox.closeIcon = new Image();
    jt_DialogBox.closeIcon.src = jt_DialogBox.imagePath + "window_close.gif";
    }

  this.container = document.createElement('div');
  this.container.className = jt_DialogBox.className;
  this.container.dialogBox = this;

  var mainTable = document.createElement('table');
  mainTable.setAttribute('cellSpacing', '0');
  mainTable.setAttribute('cellPadding', '0');
  mainTable.setAttribute('border', '0');

  var tBodyM = document.createElement('tbody');
  var rowM = document.createElement('tr');
  var cellM = document.createElement('td');

  //*********** BEGIN Title TABLE ***********
  var titleTable = document.createElement('table');
  titleTable.setAttribute('cellSpacing', '0');
  titleTable.setAttribute('cellPadding', '0');
  titleTable.setAttribute('border', '0');
  titleTable.setAttribute('width', '100%');

  var tBodyT = document.createElement('tbody');
  var rowT = document.createElement('tr');
  var cellT = document.createElement('td');
  cellT.className = "tbLeft";
  rowT.appendChild(cellT);

  this.titleCell = document.createElement('td');
  this.titleCell.className = "Title";
  rowT.appendChild(this.titleCell);

  cellT = document.createElement('td');
  cellT.className = "tbRight";

  var closeIcon = document.createElement('img');
  closeIcon.src = jt_DialogBox.closeIcon.src;
  closeIcon.setAttribute('border','0');
  closeIcon.dialogBox = this;

  var aLink = document.createElement('A');
  aLink.setAttribute('href','#');
  aLink.appendChild(closeIcon);
  aLink.onclick = jt_DialogBox.closeBox;

  cellT.appendChild(aLink);
  rowT.appendChild(cellT);

  tBodyT.appendChild(rowT);
  titleTable.appendChild(tBodyT);
  //*********** END Title TABLE ***********

  cellM.appendChild(titleTable);
  rowM.appendChild(cellM);
  tBodyM.appendChild(rowM);

  rowM = document.createElement('tr');
  cellM = document.createElement('td');
  cellM.className = "MainPanel";

  this.contentArea = document.createElement('div');
  this.contentArea.className = "ContentArea";
  cellM.appendChild(this.contentArea);

  rowM.appendChild(cellM);
  tBodyM.appendChild(rowM);
  mainTable.appendChild(tBodyM);
  this.container.appendChild(mainTable);
  document.body.appendChild(this.container);

  Drag.init(this.titleCell, this.container, 0, null, 0);
  }




/////////////////////////////////////////////////////////////////////////////////////////
//---- BEGIN LWH CHANGE
/////////////////////////////////////////////////////////////////////////////////////////
jt_DialogBox.prototype.destroy = function() {
   this.hide();
   this.container.dialogBox = null;
   this.container.parentNode.removeChild(this.container);
};

/////////////////////////////////////////////////////////////////////////////////////////
//---- END LWH CHANGE
/////////////////////////////////////////////////////////////////////////////////////////

/************ BEGIN: Public Methods ************/
jt_DialogBox.imagePath = "../images/"; // set by application; directory path to 'window_close.gif' in titleBar

jt_DialogBox.prototype.show = function() {
  this.container.style.display = "block";
  this.topZ();
  jt_divOnScrn(this.container);
  if (this.isModal) jt_DialogBox.veilOverlay.style.display = "block";
  }

jt_DialogBox.prototype.hide = function(ok) {
  this.container.style.display = "none";
  if (this.isModal) jt_DialogBox.veilOverlay.style.display = "none";
  var posInList = this.listPos();
  if (posInList != -1) {
    jt_DialogBox.openList[posInList] = jt_DialogBox.openList[jt_DialogBox.openList.length-1];
    jt_DialogBox.openList.pop();
    }
  if (ok) {
    if (this.callOK)
      if (this.returnData) this.callOK(this.returnData);
      else this.callOK();
    }
  else if (this.callCancel) this.callCancel();
  }

jt_DialogBox.prototype.moveTo = function(x, y) {
  if (x == -1) x = Math.round((document.body.clientWidth - this.container.offsetWidth) / 2);
  if (y == -1) y = Math.round((document.body.clientHeight - this.container.offsetHeight) / 2) + document.body.scrollTop;
  this.container.style.left = x + "px";
  this.container.style.top = y + "px";
  }

jt_DialogBox.prototype.setTitle = function(title) {
  this.titleCell.innerHTML = title;
  }

jt_DialogBox.prototype.setContent = function(htmlContent) {
  this.contentArea.innerHTML = htmlContent;
  }

jt_DialogBox.prototype.setWidth = function(width) {
  this.contentArea.style.width = width + "px";
  }

jt_DialogBox.prototype.setCallOK = function(callOK) {
  // set by application as needed
  this.callOK = callOK;
  }

jt_DialogBox.prototype.setCallCancel = function(callCancel) {
  // set by application as needed
  this.callCancel = callCancel;
  }
/************ END: Public Methods ************/


/************ BEGIN: Private Methods ************/
jt_DialogBox.className = "jtDialogBox"; // CSS className
jt_DialogBox.closeIcon = null;
jt_DialogBox.veilOverlay = null;
jt_DialogBox.veilZ = 10000;
jt_DialogBox.openList = new Array();
jt_DialogBox.maxDepth = 5; // optimize search of parent nodes

jt_DialogBox.closeBox = function(e) {
  if (!e) e = window.event;
  var node = e.target ? e.target : e.srcElement;
  var count = 0;
  while ((node != null) && (count < jt_DialogBox.maxDepth)) {
    if (node.dialogBox) {
      node.dialogBox.hide();
      return false;
      }
    node = node.parentNode;
    count++;
    }
  return false;
  }

jt_DialogBox.prototype.listPos = function() {
  var posInList = -1;
  for (var i=0; i<jt_DialogBox.openList.length; i++)
    if (jt_DialogBox.openList[i] == this) {
      posInList = i;
      break;
      }
  return posInList;
  }

jt_DialogBox.prototype.topZ = function() {
  var posInList = this.listPos();
  if (posInList == -1) jt_DialogBox.openList[jt_DialogBox.openList.length] = this; // add to list
  else if (posInList < jt_DialogBox.openList.length-1) {
    for (var i=posInList; i<jt_DialogBox.openList.length-1; i++) jt_DialogBox.openList[i] = jt_DialogBox.openList[i+1];
    jt_DialogBox.openList[jt_DialogBox.openList.length-1] = this; // move to end
    var newZ = jt_DialogBox.veilZ;
    for (var i=jt_DialogBox.openList.length-1; i>0; i--) {
      newZ--;
      jt_DialogBox.openList[i].style.zIndex = newZ;
      }
    }
  this.container.style.zIndex = jt_DialogBox.veilZ+1;
  }

jt_DialogBox.setVeilWidth = function() {
  jt_DialogBox.veilOverlay.style.width = document.body.scrollWidth;
  jt_DialogBox.veilOverlay.style.height = document.body.scrollHeight;
  }

jt_DialogBox.addListener = function(obj, evType, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evType, fn, false);
    return true;
    }
  else if (obj.attachEvent) return obj.attachEvent('on' + evType, fn);
  else return false;
  }
