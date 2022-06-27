/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 function FindAction(){
this.m_requestParams=null;
this.m_sAction="find";
this.findState=null;
this.pageState=null;
this.findConfig=null;
};
FindAction.prototype=new CognosViewerAction();
FindAction.baseclass=CognosViewerAction.prototype;
FindAction.prototype.setConfigAndState=function(_1){
var cv=this.getCognosViewer();
var _3=cv.getState();
this.findConfig=cv.getConfig().getFindActionConfig();
this.pageState=_3.getPageState();
this.findState=_3.getFindState();
};
FindAction.prototype.setRequestParms=function(_4){
this.setConfigAndState();
var cv=this.getCognosViewer();
var _6=cv.getState();
if(_6.getFindState()){
this.clearPreviousResult();
}
_6.clearFindState();
if(_4){
if(this.pageState==null){
_6.setPageState({});
this.pageState=_6.getPageState();
}
_6.setFindState(_4);
this.findState=_6.getFindState();
}
};
FindAction.prototype.execute=function(){
if(!this.findState){
return;
}
return this.findAndShow();
};
FindAction.prototype.findAndShow=function(){
var cv=this.getCognosViewer();
var _8=cv.hasNextPage();
var _9=cv.hasPrevPage();
var _a=this.pageState.getCurrentPage();
var _b=this.findOnClient();
this.findState.updatePageInfo(_b,_a,_8,_9);
if(_b.length==0){
if(this.findState.checkServerForNextMatch()){
return cv.executeAction("FindNextOnServer");
}else{
var _c=this.findConfig.getNoMatchFoundCallback();
_c();
return false;
}
}else{
var _d=this.findState.firstMatch();
this.applyFocusStyle(_d);
}
return true;
};
FindAction.prototype.clearPreviousResult=function(_e){
if(_e!==false){
this.removeHighlights();
}
this.findState.resetPageInfo();
};
FindAction.prototype.findOnClient=function(){
var _f=this.findState.getKeyword();
this.removeHighlights();
var _10=new Array();
var cv=this.getCognosViewer();
var _12=document.getElementById("CVReport"+cv.getId());
this.findMatches(_12,_f,this.findState.isCaseSensitive(),_10,0,new FindPartialMatchHelper(),-1);
this.applyMatchStyle(_10);
return _10;
};
FindAction.prototype.applyMatchStyle=function(_13){
var _14=_13.length;
for(var idx=_14-1;idx>=0;idx--){
var _16=_13[idx];
for(var i=_16.length-1;i>=0;i--){
var _18=_16[i];
var _19=_18.element;
var _1a=_19.childNodes[0];
var _1b=_1a.data;
var _1c=_1b.length;
var _1d=_18.start;
var _1e=_18.matchedStr.length;
var _1f=(_1d>0)?_1b.substring(0,_1d):"";
var _20=(_1d+_1e<_1c)?_1b.substring(_1d+_1e,_1c):"";
var _21=document.createElement("span");
_21.setAttribute("tabIndex",0);
_21.setAttribute("style",this.findConfig.getMatchUIStyle());
_21.style.background=this.findConfig.getMatchColor();
_21.appendChild(document.createTextNode(_18.matchedStr));
_1a.data=_20;
_19.insertBefore(_21,_1a);
if(_1f.length>0){
var _22=document.createTextNode(_1f);
_19.insertBefore(_22,_21);
}
if(_20.length==0){
_19.removeChild(_1a);
}
_18.element=_21;
}
}
};
FindAction.prototype.removeHighlights=function(){
var _23=this.findState.getMatches();
var _24=this.findState.getFocusedMatch();
if(_24){
this.restoreMatchStyle(_24);
}
if(_23&&_23.length>0){
var _25=_23.length;
for(var i=0;i<_25;i++){
var _27=_23[i];
for(var j=0;j<_27.length;j++){
var _29=_27[j];
var _2a=_29.element;
if(_2a){
var _2b=_2a.parentNode;
var _2c=null;
var _2d=false;
if(_2a.previousSibling&&_2a.previousSibling.nodeType==3){
_2c=_2a.previousSibling;
_2d=true;
}else{
if(_2a.nextSibling&&_2a.nextSibling.nodeType==3){
_2c=_2a.nextSibling;
}
}
if(_2c){
_2c.data=_2d?(_2c.data+_29.matchedStr):(_29.matchedStr+_2c.data);
_2b.removeChild(_2a);
if(_2c.nextSibling&&_2c.nextSibling.nodeType==3){
_2c.data=_2c.data+_2c.nextSibling.data;
_2b.removeChild(_2c.nextSibling);
}
}else{
var _2e=document.createTextNode(_29.matchedStr);
_2b.insertBefore(_2e,_2a);
_2b.removeChild(_2a);
}
}
}
}
}
};
FindAction.prototype.manageFocusStyle=function(_2f,_30){
if(!_2f){
return;
}
for(var i=_2f.length-1;i>=0;i--){
var _32=_2f[i];
var _33=_32.element;
if("restoreMatchStyle"===_30){
_33.setAttribute("style",this.findConfig.getMatchUIStyle());
_33.style.background=this.findConfig.getMatchColor();
}else{
_33.setAttribute("style",this.findConfig.getFocusUIStyle());
_33.style.background=this.findConfig.getFocusColor();
_33.focus();
if(_33.blur){
_33.blur();
}
}
}
};
FindAction.prototype.applyFocusStyle=function(_34){
this.manageFocusStyle(_34);
};
FindAction.prototype.restoreMatchStyle=function(_35){
this.manageFocusStyle(_35,"restoreMatchStyle");
};
FindAction.prototype.isVisible=function(_36){
var _37=this.checkDisplayStyle(_36);
return (!_37.isVisibilityHidden&&!_37.isDisplayNone);
};
FindAction.prototype.checkDisplayStyle=function(_38){
var _39=null;
var _3a=null;
if(window.getComputedStyle){
var _3b=window.getComputedStyle(_38,"visibility");
if(!_3b){
_3b=window.getComputedStyle(_38,"display");
}
if(_3b){
_39=_3b["visibility"];
_3a=_3b["display"];
}
}else{
if(_38.currentStyle){
_39=_38.currentStyle.visibility;
_3a=_38.currentStyle.display;
}
}
var _3c=(_3a&&_3a.indexOf("block")==-1&&_3a.indexOf("inline")>=0);
var obj={"isVisibilityHidden":("hidden"==_39),"isDisplayNone":("none"==_3a),"isDisplayInline":_3c,"display":_3a};
return obj;
};
FindAction.prototype.findMatches=function(_3e,_3f,_40,_41,_42,_43,_44){
if(_3e.nodeType===3){
var _45=_3e.data;
if(_45){
var _46=_3e.parentNode.tagName.toUpperCase();
if(_46!=="SCRIPT"&&_46!=="STYLE"){
var _47=_40?_3f:_3f.toUpperCase();
var _48=_40?_45:_45.toUpperCase();
for(var _49=0;_49<_45.length;){
_49=this.match(_49,_3e,_48,_47,_41,_42,_43,_44);
}
}
}
}else{
if(_3e.nodeType===1){
var _4a=this.checkDisplayStyle(_3e);
if(!_4a.isDisplayInline){
_44=_42;
_43.reset();
}
if(_4a.isVisibilityHidden){
_43.reset();
return;
}
if(_4a.isDisplayNone){
return;
}
for(var _4b=_3e.firstChild;_4b!=null;_4b=_4b.nextSibling){
this.findMatches(_4b,_3f,_40,_41,++_42,_43,_44);
}
}
}
};
FindAction.prototype.match=function(_4c,_4d,_4e,_4f,_50,_51,_52,_53){
if(!_4e||_4c>=_4e.length){
return (_4c+1);
}
var _54=_4d.data;
var _55=_52.startIndexOfKeyword;
var _56=this.matchByLetter(_4e,_4f,_54,_4c,_55);
if(!_56){
return _4c+1;
}
var _57=_56.matchedStr;
if(_57.length==_4f.length){
_56.update("full",_51,_4d.parentNode,_53);
_50.push([_56]);
_52.reset();
return (_4c+_57.length);
}
if(_55==0){
_56.update("head",_51,_4d.parentNode,_53);
_52.add(_56);
return (_4c+_57.length);
}
var _58=_52.partialMatches[_52.partialMatches.length-1];
if(_58.blockDisplayParentIndex!=_53){
_52.reset();
return (_4e.lenght+1);
}
if((_55+_57.length)<_4f.length){
_56.update("middle",_51,_4d.parentNode,_53);
_52.add(_56);
return (_4c+_57.length);
}
if((_55+_57.length)==_4f.length){
_56.update("tail",_51,_4d.parentNode,_53);
_52.add(_56);
_50.push(_52.partialMatches.slice(0));
_52.reset();
}
return (_4c+_57.length);
};
FindAction.prototype.matchByLetter=function(_59,_5a,_5b,_5c,_5d){
var _5e=_5c;
var _5f=true;
var _60=0;
for(;_5c<_59.length&&_5f;_5c++,_5d++){
if(this.safeLetter(_59.charCodeAt(_5c))==this.safeLetter(_5a.charCodeAt(_5d))){
_5f=true;
if(++_60==_5a.length){
break;
}
}else{
_5f=false;
}
}
if(!_5f){
return null;
}
return new FindMatch(_5e,_5b.substr(_5e,_60));
};
FindAction.prototype.safeLetter=function(c){
if(c==160){
return 32;
}else{
return c;
}
};
function FindMatch(_62,_63){
this.start=_62;
this.matchedStr=_63;
this.index=null;
this.element=null;
this.type=null;
this.blockDisplayParentIndex=null;
this.orgStyle=null;
};
FindMatch.prototype={};
FindMatch.prototype.update=function(_64,_65,_66,_67){
this.index=_65;
this.element=_66;
this.type=_64;
this.blockDisplayParentIndex=_67;
this.orgStyle=this.element.getAttribute("style");
};
function FindPartialMatchHelper(){
this.startIndexOfKeyword=0;
this.partialMatches=null;
};
FindPartialMatchHelper.prototype={};
FindPartialMatchHelper.prototype.reset=function(){
this.startIndexOfKeyword=0;
this.partialMatches=null;
};
FindPartialMatchHelper.prototype.add=function(_68){
if(!this.partialMatches){
this.partialMatches=[];
}
this.partialMatches.push(_68);
this.startIndexOfKeyword+=_68.matchedStr.length;
};
function FindNextAction(){
this.m_requestParams=null;
this.m_sAction="findNext";
};
FindNextAction.prototype=new FindAction();
FindNextAction.baseclass=FindAction.prototype;
FindNextAction.prototype.setRequestParms=function(_69){
this.setConfigAndState();
};
FindNextAction.prototype.execute=function(){
if(this.findState){
var _6a=this.findState.getFocusedMatch();
if(this.findState.hasNext()){
var _6b=this.findState.nextMatch();
this.restoreMatchStyle(_6a);
this.applyFocusStyle(_6b);
}else{
this.restoreMatchStyle(_6a);
if(this.findState.checkServerForNextMatch()){
var cv=this.getCognosViewer();
return cv.executeAction("FindNextOnServer");
}else{
if(this.findState.isWrapAroundSearch()){
_6a=this.findState.firstMatch();
this.applyFocusStyle(_6a);
if(this.findState.isRepeating()){
var _6d=this.findConfig.getFindActionCompleteCallback();
_6d();
}
}else{
var _6d=this.findConfig.getFindActionCompleteCallback();
_6d();
}
}
}
}
return true;
};
function FindNextOnServerAction(){
this.m_requestParams=null;
this.m_sAction="findNextOnServer";
};
FindNextOnServerAction.prototype=new FindAction();
FindNextOnServerAction.baseclass=FindAction.prototype;
FindNextOnServerAction.prototype.setRequestParms=function(_6e){
this.setConfigAndState();
};
FindNextOnServerAction.prototype.execute=function(){
return this.sendRequest();
};
FindNextOnServerAction.prototype.sendRequest=function(){
if(!this.findState){
return -1;
}
var cv=this.getCognosViewer();
var _70=new ViewerDispatcherEntry(cv);
this.originalCompleteCallback=_70.getCallbacks()["complete"];
_70.setCallbacks({"complete":{"object":this,"method":this.onRequestComplete}});
_70.addFormField("ui.action","reportAction");
_70.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageNumber",this.findState.getPageNoForFindNext());
_70.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#search",this.findState.getKeyword());
_70.addFormField("generic.boolean.http://developer.cognos.com/ceba/constants/runOptionEnum#caseSensitiveSearch",this.findState.isCaseSensitive());
_70.addFormField("generic.boolean.http://developer.cognos.com/ceba/constants/runOptionEnum#wrapAroundSearch",this.findState.isWrapAroundSearch());
this.findState.findOnServerStarted();
return cv.dispatchRequest(_70);
};
FindNextOnServerAction.prototype.onRequestComplete=function(_71){
var _72=_71.getAsynchStatus();
var _73=GUtil.generateCallback(this.originalCompleteCallback.method,[_71],this.originalCompleteCallback.object);
if(_72==="complete"){
var _74=_71.getResult();
if(_74&&_74.length>0){
_73();
setTimeout(GUtil.generateCallback(this.processResponse,[true],this),100);
}else{
setTimeout(GUtil.generateCallback(this.processResponse,[false],this),100);
}
}else{
_73();
}
};
FindNextOnServerAction.prototype.processResponse=function(_75){
this.setConfigAndState();
if(!this.findState){
return false;
}
this.findState.findOnServerDone();
if(_75){
this.clearPreviousResult(false);
if(this.findAndShow()){
if(this.findState.isRepeating()){
var _76=this.findConfig.getFindActionCompleteCallback();
_76();
}
}
}else{
var _76=this.findState.foundMatchesInReport()?this.findConfig.getFindActionCompleteCallback():this.findConfig.getNoMatchFoundCallback();
_76();
}
return true;
};
function GotoPageAction(){
this.pageNumber=null;
};
GotoPageAction.prototype=new CognosViewerAction();
GotoPageAction.ERROR_CODE_INVALID_INT="Goto-001";
GotoPageAction.ERROR_CODE_REPORT_NOT_COMPLETE="Goto-002";
GotoPageAction.ERROR_CODE_INVALID_PAGE_RANGE="Goto-003";
GotoPageAction.prototype.setRequestParms=function(_77){
if(_77){
this.pageNumber=_77.pageNumber;
this.anchorName=_77.anchorName;
}
};
GotoPageAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _79=oCV.getPageInfo();
if(!this.isPositiveInt(this.pageNumber)){
return this.buildActionResponseObject("error",GotoPageAction.ERROR_CODE_INVALID_INT,RV_RES.IDS_JS_ERROR_INVALID_INT);
}else{
if(oCV.getStatus()!="complete"){
return this.buildActionResponseObject("error",GotoPageAction.ERROR_CODE_REPORT_NOT_COMPLETE,RV_RES.IDS_JS_ERROR_REPORT_NOT_COMPLETE);
}else{
if(_79&&_79.pageCount&&this.pageNumber>_79.pageCount){
return this.buildActionResponseObject("error",GotoPageAction.ERROR_CODE_INVALID_PAGE_RANGE,RV_RES.IDS_JS_ERROR_INVALID_PAGE_RANGE);
}
}
}
if(_79.currentPage==this.pageNumber){
this.scrollTo();
return true;
}
var _7a=new ViewerDispatcherEntry(oCV);
_7a.addFormField("ui.action","reportAction");
_7a.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageNumber",this.pageNumber);
if(this.anchorName){
_7a.setCallbacks({"postComplete":{"object":this,"method":this.scrollTo}});
}
oCV.dispatchRequest(_7a);
};
GotoPageAction.prototype.scrollTo=function(){
if(this.anchorName){
var _7b=document.getElementsByName(this.anchorName);
if(_7b&&_7b.length>0&&_7b[0].scrollIntoView){
_7b[0].scrollIntoView();
}else{
document.location="#"+this.anchorName;
}
}
};
HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX="viewerHiddenRequest";
HiddenIframeDispatcherEntry.FORM_NAME="viewerHiddenFormRequest";
function HiddenIframeDispatcherEntry(oCV){
HiddenIframeDispatcherEntry.baseConstructor.call(this,oCV);
if(oCV){
HiddenIframeDispatcherEntry.prototype.setDefaultFormFields.call(this);
this.setRequestHandler(new RequestHandler(oCV));
this.setWorkingDialog(oCV.getWorkingDialog());
this.setRequestIndicator(oCV.getRequestIndicator());
this.m_httpRequestConfig=oCV.getConfig()&&oCV.getConfig().getHttpRequestConfig()?oCV.getConfig().getHttpRequestConfig():null;
this.setIframeId(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX+oCV.getId());
this.originalGetViewerConfiguration=null;
}
};
HiddenIframeDispatcherEntry.prototype=new DispatcherEntry();
HiddenIframeDispatcherEntry.baseConstructor=DispatcherEntry;
HiddenIframeDispatcherEntry.prototype.setDefaultFormFields=function(){
var oCV=this.getViewer();
var _7e=oCV.getCAFContext();
this.addDefinedNonNullFormField("ui.cafcontextid",_7e);
};
HiddenIframeDispatcherEntry.prototype.sendRequest=function(){
this._createHiddenIframe();
var _7f=this._createForm();
this._setupCallbacks();
this.onPreHttpRequest(this.getRequest());
_7f.submit();
};
HiddenIframeDispatcherEntry.prototype._iframeRequestComplete=function(){
window.getViewerConfiguration=this.originalGetViewerConfiguration;
this.onPostHttpRequest();
this.onEntryComplete();
};
HiddenIframeDispatcherEntry.prototype._setupCallbacks=function(){
this.originalGetViewerConfiguration=window.getViewerConfiguration;
if(this.getFormField("cv.useAjax")!="false"){
var _80=this;
var _81=this.getRequestHandler().getRequestIndicator();
var _82=this.getRequestHandler().getWorkingDialog();
window.getViewerConfiguration=function(){
var _83={"httpRequestCallbacks":{"reportStatus":{"complete":function(){
_80.onComplete();
},"working":function(){
_80.onWorking();
},"prompting":function(){
_80.onPrompting();
}}}};
return _83;
};
}
};
HiddenIframeDispatcherEntry.prototype.setIframeId=function(id){
this._iframeId=id;
};
HiddenIframeDispatcherEntry.prototype.getIframeId=function(){
return this._iframeId;
};
HiddenIframeDispatcherEntry.prototype._createForm=function(_85){
var oCV=this.getViewer();
var _87=HiddenIframeDispatcherEntry.FORM_NAME+oCV.getId();
var _88=document.getElementById(_87);
if(_88){
_88.parentNode.removeChild(_88);
_88=null;
}
var _89=location.protocol+"//"+location.host+oCV.m_sGateway;
_88=document.createElement("form");
_88.setAttribute("method","post");
_88.setAttribute("action",_89);
_88.setAttribute("target",this.getIframeId());
_88.setAttribute("id",_87);
_88.style.display="none";
var _8a=this.getRequest().getFormFields();
var _8b=_8a.keys();
for(var _8c=0;_8c<_8b.length;_8c++){
_88.appendChild(createHiddenFormField(_8b[_8c],_8a.get(_8b[_8c])));
}
document.body.appendChild(_88);
return _88;
};
HiddenIframeDispatcherEntry.prototype._createHiddenIframe=function(){
var oCV=this.getViewer();
var _8e=this.getIframeId();
var _8f=document.getElementById(_8e);
if(_8f){
_8f.parentNode.parentNode.removeChild(_8f.parentNode);
}
var div=document.createElement("div");
div.style.position="absolute";
div.style.left="0px";
div.style.top="0px";
div.style.display="none";
document.body.appendChild(div);
div.innerHTML="<iframe frameborder=\"0\" id=\""+_8e+"\" name=\""+_8e+"\"></iframe>";
_8f=document.getElementById(_8e);
var _91=this;
var _92=function(){
HiddenIframeDispatcherEntry.handleIframeLoad(_91);
};
if(_8f.attachEvent){
_8f.attachEvent("onload",_92);
}else{
_8f.addEventListener("load",_92,true);
}
};
HiddenIframeDispatcherEntry.hideIframe=function(_93){
var _94=document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX+_93);
if(_94){
_94.parentNode.style.display="none";
}
};
HiddenIframeDispatcherEntry.showIframeContentsInWindow=function(_95){
var _96=document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX+_95);
if(!_96){
return;
}
var _97=_96.contentWindow.document.getElementsByTagName("html")[0].innerHTML;
var _98=window.open("","","height=400,width=500");
if(_98){
_98.document.write("<html>"+_97+"</html>");
}
};
HiddenIframeDispatcherEntry.handleIframeLoad=function(_99){
if(!_99){
return;
}
var _9a=document.getElementById(_99.getIframeId());
if(!_9a){
return;
}
var oCV=_9a.contentWindow.window.gaRV_INSTANCES?_9a.contentWindow.window.gaRV_INSTANCES[0]:null;
var _9c=oCV?oCV.getStatus():null;
if(_9c=="complete"){
_99.onComplete();
}
if(_9c=="working"){
_99.onWorking();
}
if(_9c=="prompting"){
_99.onPrompting();
}
if(!oCV||_9c=="fault"||_9c==""){
_99.onFault();
}
};
HiddenIframeDispatcherEntry.prototype.onFault=function(){
this._iframeRequestComplete();
HiddenIframeDispatcherEntry.showIframeContentsInWindow(this.getViewer().getId());
};
HiddenIframeDispatcherEntry.prototype.onPrompting=function(){
this._iframeRequestComplete();
if(this.m_httpRequestConfig){
var _9d=this.m_httpRequestConfig.getReportStatusCallback("prompting");
if(typeof _9d=="function"){
_9d();
}
}
HiddenIframeDispatcherEntry.showIframeContentsInWindow(this.getViewer().getId());
};
HiddenIframeDispatcherEntry.prototype.onComplete=function(){
this._iframeRequestComplete();
if(this.m_httpRequestConfig){
var _9e=this.m_httpRequestConfig.getReportStatusCallback("complete");
if(typeof _9e=="function"){
_9e();
}
}
var _9f=document.getElementById(this.getIframeId());
if(typeof _9f.contentWindow.detachLeavingRV=="function"){
_9f.contentWindow.detachLeavingRV();
}
var _a0=_9f.parentNode;
_a0.style.display="none";
if(this.getCallbacks()&&this.getCallbacks()["complete"]){
HiddenIframeDispatcherEntry.executeCallback(this.getCallbacks()["complete"]);
}
};
HiddenIframeDispatcherEntry.prototype.cancelRequest=function(_a1){
this._iframeRequestComplete();
if(!this.m_bCancelCalled){
this.m_bCancelCalled=true;
var _a2=document.getElementById(this.getIframeId());
if(!_a2){
return;
}
var oCV=_a2.contentWindow[getCognosViewerObjectString(this.getViewer().getId())];
if(oCV){
oCV.cancel();
}
}
};
HiddenIframeDispatcherEntry.executeCallback=function(_a4){
if(_a4){
var _a5=GUtil.generateCallback(_a4.method,_a4.params,_a4.object);
_a5();
}
};
HiddenIframeDispatcherEntry.getIframe=function(_a6){
var _a7=document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX+_a6);
return _a7;
};
function PrintAction(){
this._pageNumber=null;
this._pageCount=null;
};
PrintAction.prototype=new CognosViewerAction();
PrintAction.ERROR_CODE_INVALID_INT="Print-001";
PrintAction.ERROR_CODE_REPORT_NOT_COMPLETE="Print-002";
PrintAction.ERROR_CODE_INVALID_PAGE_RANGE="Print-003";
PrintAction.prototype.setRequestParms=function(_a8){
if(_a8){
if(_a8.pageNumber){
this._pageNumber=_a8.pageNumber;
}
if(_a8.pageCount){
this._pageCount=_a8.pageCount;
}
}
};
PrintAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _aa=this.getCognosViewer().getPageInfo();
if(this._pageNumber&&!this.isPositiveInt(this._pageNumber)){
return this.buildActionResponseObject("error",PrintAction.ERROR_CODE_INVALID_INT,RV_RES.IDS_JS_ERROR_INVALID_INT);
}else{
if(this._pageCount&&!this.isPositiveInt(this._pageCount)){
return this.buildActionResponseObject("error",PrintAction.ERROR_CODE_INVALID_INT,RV_RES.IDS_JS_ERROR_INVALID_INT);
}else{
if(oCV.getStatus()!="complete"){
return this.buildActionResponseObject("error",PrintAction.ERROR_CODE_REPORT_NOT_COMPLETE,RV_RES.IDS_JS_ERROR_REPORT_NOT_COMPLETE);
}else{
if(_aa&&_aa.pageCount&&this._pageNumber>_aa.pageCount){
return this.buildActionResponseObject("error",PrintAction.ERROR_CODE_INVALID_PAGE_RANGE,RV_RES.IDS_JS_ERROR_INVALID_PAGE_RANGE);
}
}
}
}
var _ab=oCV.envParams;
var _ac=this._pageNumber>0?this._pageNumber:"1";
var _ad=this._pageCount?this._pageCount:"0";
var _ae=new HiddenIframeDispatcherEntry(oCV);
_ae.addFormField("ui.action","reportAction");
_ae.addFormField("cv.responseFormat","print");
_ae.addFormField("ui.conversation",oCV.getConversation());
_ae.addFormField("m_tracking",oCV.getTracking());
_ae.addFormField("cv.header","false");
_ae.addFormField("cv.toolbar","false");
_ae.addFormField("cv.id",oCV.getId());
_ae.addFormField("cv.useAjax","false");
_ae.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageNumber",_ac);
_ae.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageCount",_ad);
_ae.setCallbacks({"complete":{"object":this,"params":[],"method":this.printIframe}});
oCV.dispatchRequest(_ae);
};
PrintAction.prototype.printIframe=function(){
var _af=HiddenIframeDispatcherEntry.getIframe(this.getCognosViewer().getId());
if(_af){
if(isIE()){
_af.contentWindow.document.execCommand("print",true,null);
}else{
_af.focus();
_af.contentWindow.print();
}
}
};
function DownloadReportAction(){
this._reportFormat=null;
};
DownloadReportAction.prototype=new CognosViewerAction();
DownloadReportAction.prototype.setRequestParms=function(_b0){
if(_b0){
this._reportFormat=_b0.format;
}
};
DownloadReportAction.prototype.execute=function(){
if(!this._reportFormat){
return false;
}
var oCV=this.getCognosViewer();
var _b2=oCV.envParams;
var _b3=new HiddenIframeDispatcherEntry(oCV);
_b3.addFormField("ui.action","render");
_b3.addFormField("cv.toolbar","false");
_b3.addFormField("cv.header","false");
_b3.addFormField("run.outputFormat",this._reportFormat);
_b3.addFormField("ui.name",this.getObjectDisplayName());
_b3.addFormField("cv.responseFormat","downloadObject");
_b3.addFormField("ui.conversation",oCV.getConversation());
_b3.addFormField("run.prompt","false");
_b3.addFormField("asynch.attachmentEncoding","base64");
_b3.addFormField("run.outputEncapsulation","URLQueryString");
_b3.addFormField("cv.detachRelease","true");
oCV.dispatchRequest(_b3);
return true;
};
function ViewerFindActionConfig(){
this.noMatchFoundCallback=null;
this.findActionCompleteCallback=null;
this.matchBackgroundColor="yellow";
this.focusBackgroundColor="red";
this.updateStyle();
};
ViewerFindActionConfig.BACKGROUND="background: ";
ViewerFindActionConfig.prototype.configure=function(_b4){
applyJSONProperties(this,_b4);
this.updateStyle();
};
ViewerFindActionConfig.prototype.updateStyle=function(){
this.matchBackgroundColor=this.matchBackgroundColor.toUpperCase();
this.focusBackgroundColor=this.focusBackgroundColor.toUpperCase();
this.matchUIStyle=ViewerFindActionConfig.BACKGROUND+this.matchBackgroundColor;
this.focusUIStyle=ViewerFindActionConfig.BACKGROUND+this.focusBackgroundColor;
};
ViewerFindActionConfig.prototype.getNoMatchFoundCallback=function(){
return typeof this.noMatchFoundCallback=="function"?this.noMatchFoundCallback:this._defaultNoMatchFoundCallback;
};
ViewerFindActionConfig.prototype._defaultNoMatchFoundCallback=function(){
if(console&&console.log){
console.log("invoked _defaultNoMatchFoundCallback!");
}
};
ViewerFindActionConfig.prototype.getFindActionCompleteCallback=function(){
return typeof this.findActionCompleteCallback=="function"?this.findActionCompleteCallback:this._defaultFindActionCompleteCallback;
};
ViewerFindActionConfig.prototype._defaultFindActionCompleteCallback=function(){
if(console&&console.log){
console.log("invoked _defaultFindActionCompleteCallback!");
}
};
ViewerFindActionConfig.prototype.getMatchUIStyle=function(){
return this.matchUIStyle;
};
ViewerFindActionConfig.prototype.getFocusUIStyle=function(){
return this.focusUIStyle;
};
ViewerFindActionConfig.prototype.getMatchColor=function(){
return this.matchBackgroundColor;
};
ViewerFindActionConfig.prototype.getFocusColor=function(){
return this.focusBackgroundColor;
};
ViewerFindActionConfig.prototype.isFocusColorSameAsMatch=function(){
return (this.focusBackgroundColor===this.matchBackgroundColor);
};
function ViewerFindState(){
this.keyword=null;
this.caseSensitive=false;
this.wrapAroundSearch=true;
this.matches=null;
this.focus_index=-1;
this.matchesFoundInReport=false;
this.matchesFoundOnServer=false;
this.pageFirstMatchFound=-1;
this.matchesUpdateCount=0;
this.currentPageNo=-1;
this.currentPageHasNext=false;
this.currentPageHasPrev=false;
this.findingOnServerInProgress=false;
this.searchedOnServer=false;
};
ViewerFindState.prototype.setState=function(_b5){
applyJSONProperties(this,_b5);
};
ViewerFindState.prototype.getPageNoForFindNext=function(){
if(!this.isSinglePageReport()){
this.currentPageNo++;
}
return this.currentPageNo;
};
ViewerFindState.prototype.checkServerForNextMatch=function(){
if(this.isSinglePageReport()){
return false;
}
if(this.searchedOnServer&&(!this.matches||this.matches.length==0)){
return false;
}
if(this.currentPageHasNext){
return true;
}
if(this.currentPageHasPrev&&this.wrapAroundSearch){
return true;
}
return false;
};
ViewerFindState.prototype.isSinglePageReport=function(){
return (this.currentPageNo==1&&!this.currentPageHasNext&&!this.currentPageHasPrev);
};
ViewerFindState.prototype.findOnServerInProgress=function(){
return this.findingOnServerInProgress;
};
ViewerFindState.prototype.findOnServerStarted=function(){
this.findingOnServerInProgress=true;
this.matchesFoundOnServer=false;
this.searchedOnServer=true;
};
ViewerFindState.prototype.findOnServerDone=function(){
this.findingOnServerInProgress=false;
};
ViewerFindState.prototype.foundMatchesInReport=function(){
return this.matchesFoundInReport;
};
ViewerFindState.prototype.updatePageInfo=function(_b6,_b7,_b8,_b9){
this.currentPageNo=_b7;
this.currentPageHasPrev=_b9;
this.currentPageHasNext=_b8;
this.matches=_b6;
this.focus_index=-1;
if(_b6&&_b6.length>0){
this.matchesFoundInReport=true;
this.matchesUpdateCount++;
if(this.pageFirstMatchFound==-1){
this.pageFirstMatchFound=_b7;
}
}
};
ViewerFindState.prototype.resetPageInfo=function(){
this.updatePageInfo(null,-1,false,false);
};
ViewerFindState.prototype.getMatches=function(){
return this.matches;
};
ViewerFindState.prototype.firstMatch=function(){
if(this.matches&&this.matches.length>0){
this.focus_index=0;
return this.matches[this.focus_index];
}
return null;
};
ViewerFindState.prototype.nextMatch=function(){
if(this.matches&&this.matches.length>(this.focus_index+1)){
return this.matches[++this.focus_index];
}
return null;
};
ViewerFindState.prototype.hasNext=function(){
return (this.matches&&this.matches.length>(this.focus_index+1));
};
ViewerFindState.prototype.getFocusedMatch=function(){
if(this.matches&&this.matches.length>0&&this.focus_index>=0){
return this.matches[this.focus_index];
}
return null;
};
ViewerFindState.prototype.getKeyword=function(){
return this.keyword;
};
ViewerFindState.prototype.isCaseSensitive=function(){
return this.caseSensitive;
};
ViewerFindState.prototype.isWrapAroundSearch=function(){
return this.wrapAroundSearch;
};
ViewerFindState.prototype.isRepeating=function(){
if(this.isSinglePageReport()){
return this.pageFirstMatchFound==this.currentPageNo;
}else{
return (this.pageFirstMatchFound==this.currentPageNo&&this.matchesUpdateCount>1);
}
};
function ViewerPageState(){
this.currentPage=1;
this.pageCount=1;
};
ViewerPageState.prototype.setState=function(_ba){
applyJSONProperties(this,_ba);
};
ViewerPageState.prototype.getCurrentPage=function(){
return this.currentPage;
};
ViewerPageState.prototype.getPageCount=function(){
return this.pageCount;
};

