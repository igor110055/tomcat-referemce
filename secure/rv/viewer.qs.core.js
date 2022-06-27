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
 cvLoadDialog=function(_1,_2,_3,_4,_5){
var _6=document.getElementById("formWarpRequest"+_1.getId());
if(_6&&_1){
_1.getWorkingDialog().hide();
var _7="";
var _8="";
var _9=null;
if(_1.isAccessibleMode()){
_7="winNAT_"+(new Date()).getTime();
_8=_1.getWebContentRoot()+"/"+"rv/blankNewWin.html?cv.id="+this.getCVId();
}else{
var _a=document.body;
_9=new CModal("","",_a,null,null,_4,_3,true,true,false,true,_1.getWebContentRoot());
if(typeof _5=="string"){
document.getElementById(CMODAL_CONTENT_ID).setAttribute("title",_5);
}
document.getElementById(CMODAL_BACK_IFRAME_ID).setAttribute("title",RV_RES.IDS_JS_MODAL_BACK_IFRAME);
_7=CMODAL_CONTENT_ID;
}
var _b=document.createElement("FORM");
_b.method="POST";
_b.action=_1.getGateway();
_b.target=_7;
_b.style.margin="0px";
document.body.appendChild(_b);
for(var _c in _2){
_b.appendChild(createHiddenFormField(_c,_2[_c]));
}
_b.appendChild(createHiddenFormField("cv.id",_1.getId()));
_b.appendChild(createHiddenFormField("b_action","xts.run"));
_b.appendChild(createHiddenFormField("ui.action",_6["ui.action"].value));
_b.appendChild(createHiddenFormField("ui.object",_6["ui.object"].value));
if(typeof _1.rvMainWnd!="undefined"){
_b.appendChild(createHiddenFormField("run.outputFormat",_1.rvMainWnd.getCurrentFormat()));
}
if(typeof _6["run.outputLocale"]!="undefined"){
_b.appendChild(createHiddenFormField("run.outputLocale",_6["run.outputLocale"].value));
}
if(typeof _b["backURL"]=="undefined"&&typeof _b["ui.backURL"]=="undefined"&&typeof _6["ui.backURL"]!="undefined"){
_b.appendChild(createHiddenFormField("ui.backURL",_6["ui.backURL"].value));
}
if(typeof _1!="undefined"&&typeof _1.getConversation!="undefined"&&typeof _1.getTracking!="undefined"){
_b.appendChild(createHiddenFormField("ui.conversation",_1.getConversation()));
_b.appendChild(createHiddenFormField("m_tracking",_1.getTracking()));
if(_1.envParams["ui.name"]!="undefined"){
_b.appendChild(createHiddenFormField("ui.name",_1.envParams["ui.name"]));
}
}
var _d=window.onbeforeunload;
window.onbeforeunload=null;
if(_1.isAccessibleMode()){
window.open(_8,_7,"rv");
_b.submit();
}else{
_b.submit();
_9.show();
}
window.onbeforeunload=_d;
document.body.removeChild(_b);
_1.modalShown=true;
}
};
function createHiddenFormField(_e,_f){
var _10=document.createElement("input");
_10.setAttribute("type","hidden");
_10.setAttribute("name",_e);
_10.setAttribute("id",_e);
_10.setAttribute("value",_f);
return (_10);
};
function isAuthenticationFault(_11){
if(_11!=null){
var _12=XMLHelper_FindChildByTagName(_11,"CAM",true);
return (_12!=null&&XMLHelper_FindChildByTagName(_12,"promptInfo",true)!=null);
}
};
function processAuthenticationFault(_13,_14){
if(isAuthenticationFault(_13)){
launchLogOnDialog(_14,_13);
return true;
}
return false;
};
function isObjectEmpty(_15){
for(var _16 in _15){
if(_15.hasOwnProperty(_16)){
return false;
}
}
return true;
};
function launchLogOnDialog(_17,_18){
try{
var oCV=getCognosViewerObjectRef(_17);
var _1a={"b_action":"xts.run","m":"portal/close.xts","h_CAM_action":"logonAs"};
if(_18!=null){
var _1b=XMLHelper_FindChildrenByTagName(_18,"namespace",true);
if(_1b!=null){
for(var _1c=0;_1c<_1b.length;++_1c){
var _1d=_1b[_1c];
if(_1d!=null){
var _1e=XMLHelper_FindChildByTagName(_1d,"name",false);
var _1f=XMLHelper_FindChildByTagName(_1d,"value",false);
if(_1e!=null&&_1f!=null){
var _20=XMLHelper_GetText(_1e);
var _21=XMLHelper_GetText(_1f);
if(_20!=null&&_20.length>0){
_1a[_20]=_21;
}
}
}
}
}
}
cvLoadDialog(oCV,_1a,540,460);
}
catch(exception){
}
};
function getCVWaitingOnFault(){
var oCV=null;
for(var _23=0;_23<window.gaRV_INSTANCES.length;_23++){
if(window.gaRV_INSTANCES[_23].getRetryDispatcherEntry()!=null){
oCV=window.gaRV_INSTANCES[_23];
break;
}
}
return oCV;
};
function ccModalCallBack(_24,_25){
var oCV=getCVWaitingOnFault();
destroyCModal();
if(typeof HiddenIframeDispatcherEntry=="function"&&HiddenIframeDispatcherEntry.hideIframe){
var oCV=window.gaRV_INSTANCES[0];
if(oCV){
HiddenIframeDispatcherEntry.hideIframe(oCV.getId());
}
}
if(oCV!=null){
if(typeof _24!="undefined"&&_24=="ok"){
var _27=oCV.getRetryDispatcherEntry();
if(_27){
_27.retryRequest();
}
if(oCV.getRV()!=null){
oCV.getRV().updateUserName();
}
}else{
oCV.rvMainWnd.hideOpenMenus();
}
}
};
function closeErrorPage(){
var oCV=getCVWaitingOnFault();
destroyCModal();
if(oCV!=null){
oCV.setRetryDispatcherEntry(null);
oCV.rvMainWnd.hideOpenMenus();
}
};
function getCrossBrowserNode(evt,_2a){
var _2b=null;
if(_2a&&evt.explicitOriginalTarget){
_2b=evt.explicitOriginalTarget;
}else{
if(evt.originalTarget){
_2b=evt.originalTarget;
}else{
if(evt.target){
_2b=evt.target;
}else{
if(evt.srcElement){
_2b=evt.srcElement;
}
}
}
}
try{
if(_2b&&_2b.nodeType==3){
_2b=_2b.parentNode;
}
}
catch(ex){
}
return _2b;
};
function getNodeFromEvent(evt,_2d){
var _2e=getCrossBrowserNode(evt,true);
if(_2e&&_2e.getAttribute&&_2e.getAttribute("name")=="primarySelectionDiv"){
_2e=_2e.parentNode.firstChild;
}
if(_2e&&_2e.getAttribute&&_2e.getAttribute("flashChartContainer")=="true"){
_2e=_2e.firstChild;
}
if(_2e&&_2e.getAttribute&&_2e.getAttribute("chartContainer")=="true"&&_2e.childNodes){
for(var i=0;i<_2e.childNodes.length;i++){
if(_2e.childNodes[i].nodeName.toLowerCase()=="img"){
_2e=_2e.childNodes[i];
break;
}
}
}else{
if(!_2d&&_2e&&_2e.nodeName&&_2e.nodeName.toLowerCase()=="img"&&_2e.getAttribute("rsvpChart")!="true"){
_2e=_2e.parentNode;
}
}
return _2e;
};
function getCtxNodeFromEvent(evt){
try{
var _31=getCrossBrowserNode(evt);
var _32=_31.nodeName.toUpperCase();
if((_32=="SPAN"||_32=="AREA"||_32=="IMG")&&_31.getAttribute("ctx")!=null){
return _31;
}else{
if(_32=="SPAN"&&(_31.parentNode.getAttribute("ctx")!=null)){
return _31.parentNode;
}
}
}
catch(exception){
}
return null;
};
function getDocumentFromEvent(evt){
var _34=getCrossBrowserNode(evt,true);
var _35=_34.document?_34.document:_34.ownerDocument;
return _35;
};
function stopEventBubble(evt){
evt.returnValue=false;
evt.cancelBubble=true;
if(typeof evt.stopPropagation!="undefined"){
evt.stopPropagation();
}
if(typeof evt.preventDefault!="undefined"){
evt.preventDefault();
}
return false;
};
function setNodeFocus(evt){
evt=(evt)?evt:((event)?event:null);
var _38=getNodeFromEvent(evt);
if(_38&&_38.nodeName){
var _39=_38.nodeName.toLowerCase();
if((_39=="td"||_39=="span")&&_38.childNodes&&_38.childNodes.length>0&&_38.childNodes[0].className=="textItem"){
try{
_38.childNodes[0].focus();
}
catch(e){
if(typeof console!=="undefined"&&console.log){
console.log("CCognosViewer: Could not set focus to node. setNodeFocus method common.js");
}
}
}
}
};
function html_encode(str){
return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
};
function replaceNewLine(_3b){
var _3c=/\r\n|\r|\n/g;
var _3d="<br/>";
return _3b.replace(_3c,_3d);
};
function xml_encode(_3e){
var _3f=""+_3e;
if((_3f=="0")||((_3e!=null)&&(_3e!=false))){
_3f=_3f.replace(/&/g,"&amp;");
_3f=_3f.replace(/</g,"&lt;");
_3f=_3f.replace(/>/g,"&gt;");
_3f=_3f.replace(/"/g,"&quot;");
_3f=_3f.replace(/'/g,"&apos;");
}else{
if(_3e==null){
_3f="";
}
}
return _3f;
};
function xml_decodeParser(_40,_41){
var _42=_40;
switch(_41){
case "amp":
_42="&";
break;
case "lt":
_42="<";
break;
case "gt":
_42=">";
break;
case "quot":
_42="\"";
break;
case "apos":
_42="'";
break;
}
return _42;
};
function xml_decode(_43){
var _44=""+_43;
if((_44=="0")||((_43!=null)&&(_43!=false))){
_44=_44.replace(/&(amp|lt|gt|quot|apos);/g,xml_decodeParser);
}else{
if(_43==null){
_44="";
}
}
return _44;
};
function xpath_attr_encode(_45){
var _46=null;
if(_45.indexOf("'")>=0&&_45.indexOf("\"")>=0){
var _47=_45.split("\"");
_46="concat(";
for(var i=0;i<_47.length;++i){
if(i>0){
_46+=",";
}
if(_47[i].length>0){
_46+=("\""+_47[i]+"\"");
}else{
_46+="'\"'";
}
}
_46+=")";
}else{
if(_45.indexOf("'")>=0){
_46="\""+_45+"\"";
}else{
_46="'"+_45+"'";
}
}
return _46;
};
function getCognosViewerObjectString(sId){
return "oCV"+sId;
};
function getCognosViewerObjectRefAsString(sId){
return "window."+getCognosViewerObjectString(sId);
};
function getCognosViewerObjectRef(sId){
return window[getCognosViewerObjectString(sId)];
};
function getCognosViewerSCObjectString(sId){
return "oCVSC"+sId;
};
function getCognosViewerSCObjectRefAsString(sId){
return "window."+getCognosViewerSCObjectString(sId);
};
function getCognosViewerSCObjectRef(sId){
return window[getCognosViewerSCObjectString(sId)];
};
function cleanupGlobalObjects(sId){
cleanupVariable(getCognosViewerObjectString(sId));
cleanupVariable(getCognosViewerSCObjectString(sId));
};
function cleanupVariable(_50){
if(typeof window[_50]!="undefined"&&window[_50]){
if(isIE()){
eval("delete "+_50);
}else{
delete window[_50];
}
}
};
function loadClass(_51){
try{
var _52=eval("new "+_51+"();");
return _52;
}
catch(e){
return null;
}
};
function getElementsByClassName(_53,_54,_55){
var _56=(_54=="*"&&_53.all)?_53.all:_53.getElementsByTagName(_54);
var _57=[];
var _58=new RegExp("(^|\\s)"+_55+"(\\s|$)");
var _59=_56.length;
for(var i=0;i<_59;i++){
var _5b=_56[i];
if(_58.test(_5b.className)){
_57.push(_5b);
}
}
return _57;
};
function getImmediateLayoutContainerId(_5c){
var _5d=_5c;
while(_5d!=null){
if(_5d.getAttribute&&_5d.getAttribute("lid")!=null){
return _5d.getAttribute("lid");
}
_5d=_5d.parentNode;
}
return null;
};
function getChildElementsByAttribute(_5e,_5f,_60,_61){
return getDescendantElementsByAttribute(_5e,_5f,_60,_61,true);
};
function getElementsByAttribute(_62,_63,_64,_65,_66,_67){
return getDescendantElementsByAttribute(_62,_63,_64,_65,false,_66,_67);
};
function getDescendantElementsByAttribute(_68,_69,_6a,_6b,_6c,_6d,_6e){
var _6f=[];
var _70=null;
if(typeof _6e==="undefined"){
_70=(typeof _6b!="undefined")?new RegExp("(^|\\s)"+_6b+"(\\s|$)","i"):null;
}else{
_70=_6e;
}
if(typeof _69=="string"){
_69=[_69];
}
var _71=(_68?_69.length:0);
for(var _72=0;_72<_71;_72++){
var _73=null;
if(_6c){
if(_69[_72]=="*"&&_68.all){
_73=_68.childNodes;
}else{
_73=[];
var _74=_68.childNodes;
for(var i=0;i<_74.length;++i){
if(_74[i].nodeName.toLowerCase()==_69[_72].toLowerCase()){
_73.push(_74[i]);
}
}
}
}else{
_73=(_69[_72]=="*"&&_68.all)?_68.all:_68.getElementsByTagName(_69[_72]);
}
var _76=_73.length;
for(var idx=0;idx<_76;idx++){
var _78=_73[idx];
var _79=_78.getAttribute&&_78.getAttribute(_6a);
if(_79!==null){
var _7a=null;
if(typeof _79==="number"){
_7a=String(_79);
}else{
if(typeof _79==="string"&&_79.length>0){
_7a=_79;
}
}
if(_7a!==null){
if(typeof _6b=="undefined"||(_70&&_70.test(_7a))){
_6f.push(_78);
if(_6d!=-1&&_6f.length>_6d){
return [];
}else{
if(_6d==1&&_6f.length==1){
return _6f;
}
}
}
}
}
}
}
return _6f;
};
function savedOutputDoneLoading(_7b,_7c){
var oCV=window["oCV"+_7b];
var _7e=(oCV&&oCV.getViewerWidget?oCV.getViewerWidget():null);
var _7f=(_7e?_7e.getSavedOutput():null);
if(_7f){
_7f.outputDoneLoading();
}else{
if(_7c<5){
_7c++;
var _80=function(){
savedOutputDoneLoading(_7b,_7c);
};
setTimeout(_80,100);
}
}
};
function getNavVer(){
var _81;
if(isIE()){
return getIEVersion();
}else{
_81=navigator.userAgent.split("/");
return parseFloat(_81[_81.length-1]);
}
};
function isSafari(){
return (navigator.userAgent.toLowerCase().indexOf("safari")!=-1);
};
function isIE(){
return (navigator.userAgent.indexOf("MSIE")!=-1||navigator.userAgent.indexOf("Trident")!=-1);
};
function getIEVersion(){
var _82=navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
return _82?parseFloat(_82[1]):null;
};
function isFF(){
return (navigator.userAgent.indexOf("Firefox")!=-1);
};
function isIOS(){
return navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("iPhone")!=-1;
};
function displayChart(_83,_84,_85,_86){
if(_84.length>1){
document.images[_83].src=_84;
}
};
function isFlashChartNode(evt){
var _88=getNodeFromEvent(evt);
if(_88!=null&&typeof _88.getAttribute=="function"){
return _88.getAttribute("flashChart")!=null;
}
return false;
};
function onFlashChartRightClick(evt){
if(evt&&evt.button&&evt.button!=0&&isFlashChartNode(evt)){
return onViewerChartFocus(evt);
}
};
function onViewerChartFocus(evt){
if(evt.stopPropagation){
evt.stopPropagation();
}
if(evt.preventDefault){
evt.preventDefault();
}
if(evt.preventCapture){
evt.preventCapture();
}
if(evt.preventBubble){
evt.preventBubble();
}
var _8b=getNodeFromEvent(evt);
var _8c=_8b.getAttribute("viewerId");
if(!_8c){
_8c=_8b.parentNode.getAttribute("viewerId");
}
if(!_8c){
return;
}
var oCV=window["oCV"+_8c];
var _8e=oCV.getAction("Selection");
_8e.pageClicked(evt);
return stopEventBubble(evt);
};
function clientToScreenCoords(_8f,_90){
var _91=_8f;
var _92={topCoord:0,leftCoord:0};
while(_91!=null&&_91!=_90){
_92.topCoord+=_91.offsetTop;
_92.leftCoord+=_91.offsetLeft;
_91=_91.offsetParent;
}
return _92;
};
function getCurrentPosistionString(oCV,_94,_95){
var _96=RV_RES.IDS_JS_INFOBAR_ITEM_COUNT;
var _97=/\{0\}/;
var _98=/\{1\}/;
_96=_96.replace(_97,_94);
_96=" "+_96.replace(_98,_95)+" ";
return _96;
};
function applyJSONProperties(obj,_9a){
for(property in _9a){
if(typeof _9a[property]=="object"&&!(_9a[property] instanceof Array)){
if(typeof obj[property]=="undefined"){
obj[property]={};
}
applyJSONProperties(obj[property],_9a[property]);
}else{
obj[property]=_9a[property];
}
}
};
function CViewerCommon(){
};
CViewerCommon.openNewWindowOrTab=function(_9b,_9c){
return window.open(_9b,_9c);
};
CViewerCommon.toJSON=function(obj){
var _9e=typeof (obj);
if(_9e!="object"||_9e===null){
if(_9e==="string"){
obj="\""+obj+"\"";
}
return String(obj);
}else{
var _9f;
var _a0;
var _a1=[];
var _a2=(obj&&obj.constructor==Array);
for(_9f in obj){
_a0=obj[_9f];
_9e=typeof (_a0);
if(_9e==="string"){
_a0="\""+_a0+"\"";
}else{
if(_9e=="object"&&_a0!==null){
_a0=CViewerCommon.toJSON(_a0);
}
}
_a1.push((_a2?"":"\""+_9f+"\":")+String(_a0));
}
return (_a2?"[":"{")+String(_a1)+(_a2?"]":"}");
}
};
function resizePinnedContainers(){
var oCV=window.gaRV_INSTANCES[0];
if(oCV&&!oCV.m_viewerFragment){
var _a4=oCV.getPinFreezeManager();
if(_a4&&_a4.hasFrozenContainers()){
var _a5=document.getElementById("RVContent"+oCV.getId());
var _a6=document.getElementById("mainViewerTable"+oCV.getId());
var _a7=_a5.clientWidth;
var _a8=_a6.clientHeight;
_a4.resize(_a7,_a8);
if(isIE()){
oCV.repaintDiv(_a5);
}
}
}
};
function setWindowHref(url){
var _aa=window.onbeforeunload;
window.onbeforeunload=null;
window.location.href=url;
window.onbeforeunload=_aa;
};
CViewerCommon.getMessage=function(msg,_ac){
if(typeof _ac=="undefined"){
return msg;
}else{
if(typeof _ac=="string"){
msg=msg.replace("{0}",_ac);
}else{
if(_ac.length){
for(var i=0;i<_ac.length;++i){
msg=msg.replace("{"+i+"}",_ac[i]);
}
}else{
msg=msg.replace("{0}",_ac);
}
}
}
return msg;
};
function getViewerDirection(){
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
return gaRV_INSTANCES[0].getDirection();
}
return "ltr";
};
function isViewerBidiEnabled(){
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
var _ae=gaRV_INSTANCES[0].isBidiEnabled();
if(_ae){
return true;
}
}
return false;
};
function getViewerBaseTextDirection(){
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
return gaRV_INSTANCES[0].getBaseTextDirection();
}
return "";
};
function enforceTextDir(_af){
if(isViewerBidiEnabled()&&_af){
var _b0=getViewerBaseTextDirection();
var _b1=BidiUtils.getInstance();
if(_b0=="auto"){
_b0=_b1.resolveStrBtd(_af);
}
var _b2=(!dojo._isBodyLtr())?_b1.RLM:_b1.LRM;
return _b2+((_b0==="rtl")?_b1.RLE:_b1.LRE)+_af+_b1.PDF+_b2;
}
return _af;
};
function getElementDirection(_b3){
var dir=null;
if(_b3.currentStyle){
dir=_b3.currentStyle.direction;
}else{
if(window.getComputedStyle){
var _b5=window.getComputedStyle(_b3,null);
if(_b5){
dir=_b5.getPropertyValue("direction");
}
}
}
if(dir){
dir=dir.toLowerCase();
}
return dir;
};
function getScrollLeft(_b6){
if(getElementDirection(_b6)==="rtl"&&isFF()){
return _b6.scrollWidth-_b6.offsetWidth+_b6.scrollLeft;
}
return _b6.scrollLeft;
};
function setScrollLeft(_b7,_b8){
if(getElementDirection(_b7)==="rtl"&&isFF()){
_b7.scrollLeft=_b7.offsetWidth+_b8-_b7.scrollWidth;
}else{
_b7.scrollLeft=_b8;
}
};
function setScrollRight(_b9,_ba){
if(getElementDirection(_b9)==="rtl"&&isFF()){
_b9.scrollLeft=-_ba;
}else{
_b9.scrollLeft=_b9.scrollWidth-_b9.offsetWidth-_ba;
}
};
function getBoxInfo(el,_bc){
if(!getBoxInfo.aStyles){
getBoxInfo.aStyles=[{name:"marginLeft",ie:"marginLeft",ff:"margin-left"},{name:"marginRight",ie:"marginRight",ff:"margin-right"},{name:"marginTop",ie:"marginTop",ff:"margin-top"},{name:"marginBottom",ie:"marginBottom",ff:"margin-bottom"},{name:"borderLeftWidth",ie:"borderLeftWidth",ff:"border-left-width"},{name:"borderRightWidth",ie:"borderRightWidth",ff:"border-right-width"},{name:"borderTopWidth",ie:"borderTopWidth",ff:"border-top-width"},{name:"borderBottomWidth",ie:"borderBottomWidth",ff:"border-bottom-width"},{name:"paddingLeft",ie:"paddingLeft",ff:"padding-left"},{name:"paddingRight",ie:"paddingRight",ff:"padding-right"},{name:"paddingTop",ie:"paddingTop",ff:"padding-top"},{name:"paddingBottom",ie:"paddingBottom",ff:"padding-bottom"}];
}
var _bd={};
var _be=null;
if(el.currentStyle){
_be=el.currentStyle;
}else{
if(window.getComputedStyle){
_be=window.getComputedStyle(el,null);
}
}
if(!_be){
return null;
}
for(i in getBoxInfo.aStyles){
var _bf=getBoxInfo.aStyles[i];
var _c0=null;
if(_be.getPropertyValue){
_c0=_be.getPropertyValue(_bf.ff);
}else{
_c0=_be[_bf.ie];
}
if(_c0&&_bc){
_c0=Number(_c0.replace("px",""));
}
_bd[_bf.name]=_c0;
}
return _bd;
};
var GUtil={};
GUtil.createHiddenForm=function(_c1,_c2,_c3,_c4){
var _c5=document.getElementById(_c1);
if(_c5){
document.body.removeChild(_c5);
}
_c5=document.createElement("form");
_c5.id=_c1;
_c5.name=_c1;
_c5.method=_c2;
_c5.style.display="none";
_c5.action=document.forms["formWarpRequest"+_c3].action;
_c5.target=_c4+(new Date()).getTime();
document.body.appendChild(_c5);
return _c5;
};
GUtil.createFormField=function(el,_c7,_c8){
var _c9=document.createElement("input");
_c9.type="hidden";
_c9.name=_c7;
_c9.value=_c8;
el.appendChild(_c9);
};
GUtil.generateCallback=function(_ca,_cb,_cc){
if(_ca){
var _cd=_cc||this;
_cb=(_cb instanceof Array)?_cb:[];
return (function(_ce){
if(typeof _ce!="undefined"&&_cb.length==0){
_cb.push(_ce);
}
return _ca.apply(_cd,_cb);
});
}else{
return (function(){
});
}
};
GUtil.destroyProperties=function(_cf,_d0){
var _d1;
if(_cf instanceof Array){
for(var i=0;i<_cf.length;i++){
_d1=_cf[i];
if(_d1 instanceof String){
_d1=null;
}else{
if(_d1&&_d1.destroy&&!_d1._beingDestroyed){
_d1.destroy();
}
GUtil.destroyProperties(_d1);
}
}
}else{
if(_cf instanceof Object){
if(_cf._beingDestroyed){
return;
}
var obj=_cf;
obj._beingDestroyed=true;
for(var _d4 in obj){
_d1=obj[_d4];
if(_d4==="_beingDestroyed"||_d4==="m_destroyed"||_d4==="_destroyed"||typeof _d1=="function"){
continue;
}
if(_d1 instanceof Array){
GUtil.destroyProperties(_d1);
}else{
if(_d1 instanceof Object){
if(typeof _d1.destroy=="function"&&!_d1._destroyed&&(_d1!==CCognosViewer||_d0)){
_d1.destroy();
}
}
}
delete obj[_d4];
}
}
}
};
function CCognosViewerRequest(_d5){
this.m_sAction="";
this.m_oOptions=new CDictionary();
this.m_oParams=new CDictionary();
this.m_oFormFields=new CDictionary();
this.m_sRequestType="ajax";
this.m_callback=null;
this.setAction(_d5);
};
CCognosViewerRequest.prototype.setCallback=function(_d6){
this.m_callback=_d6;
};
CCognosViewerRequest.prototype.getCallback=function(){
return this.m_callback;
};
CCognosViewerRequest.prototype.setRequestType=function(_d7){
if(typeof _d7!="undefined"&&typeof _d7=="string"){
if(_d7.match(/\ajax\b|\bpost\b|\bget\b/i)){
this.m_sRequestType=_d7;
}
}
};
CCognosViewerRequest.prototype.getRequestType=function(){
return this.m_sRequestType;
};
CCognosViewerRequest.prototype.addOption=function(_d8,_d9){
this.m_oOptions.add(_d8,_d9);
};
CCognosViewerRequest.prototype.removeOption=function(_da){
this.m_oOptions.remove(_da);
};
CCognosViewerRequest.prototype.addParameter=function(_db,_dc){
this.m_oParams.add(_db,_dc);
};
CCognosViewerRequest.prototype.addFormField=function(_dd,_de){
this.m_oFormFields.add(_dd,_de);
};
CCognosViewerRequest.prototype.getFormFields=function(){
return this.m_oFormFields;
};
CCognosViewerRequest.prototype.getAction=function(){
return this.m_sAction;
};
CCognosViewerRequest.prototype.getOption=function(_df){
return this.m_oOptions.get(_df);
};
CCognosViewerRequest.prototype.getParameter=function(_e0){
return this.m_oParams.get(_e0);
};
CCognosViewerRequest.prototype.hasOption=function(_e1){
return this.m_oOptions.exists(_e1);
};
CCognosViewerRequest.prototype.hasParameter=function(_e2){
return this.m_oParams.exists(_e2);
};
CCognosViewerRequest.prototype.setAction=function(_e3){
this.m_sAction=_e3;
};
function XmlHttpObject(){
this.m_formFields=new CDictionary();
this.xmlHttp=XmlHttpObject.createRequestObject();
this.m_requestIndicator=null;
this.m_httpCallbacks={};
this.m_asynch=true;
this.m_headers=null;
};
XmlHttpObject.prototype.setHeaders=function(_e4){
this.m_headers=_e4;
};
XmlHttpObject.prototype.getHeaders=function(){
return this.m_headers;
};
XmlHttpObject.prototype.newRequest=function(){
var _e5=new XmlHttpObject();
_e5.init(this.m_action,this.m_gateway,this.m_url,this.m_asynch);
this.executeHttpCallback("newRequest");
return _e5;
};
XmlHttpObject.prototype.abortHttpRequest=function(){
if(this.xmlHttp!=null){
this.xmlHttp.abort();
this.xmlHttp=null;
this.executeHttpCallback("cancel");
this.m_httpCallbacks={};
}
};
XmlHttpObject.prototype.cancel=function(){
this.abortHttpRequest();
};
XmlHttpObject.prototype.executeHttpCallback=function(_e6){
if(this.m_httpCallbacks&&this.m_httpCallbacks[_e6]){
var _e7=this.concatResponseArguments(this.m_httpCallbacks.customArguments);
var _e8=GUtil.generateCallback(this.m_httpCallbacks[_e6].method,_e7,this.m_httpCallbacks[_e6].object);
_e8();
return true;
}
return false;
};
XmlHttpObject.prototype.setCallbacks=function(_e9){
if(!this.m_httpCallbacks){
this.m_httpCallbacks={};
}
for(callback in _e9){
this.m_httpCallbacks[callback]=_e9[callback];
}
};
XmlHttpObject.prototype.getCallbacks=function(){
return this.m_httpCallbacks;
};
XmlHttpObject.createRequestObject=function(){
var _ea=null;
if(window.XMLHttpRequest){
_ea=new XMLHttpRequest();
}else{
if(window.ActiveXObject){
_ea=new ActiveXObject("Msxml2.XMLHTTP");
}else{
}
}
return _ea;
};
XmlHttpObject.prototype.waitForXmlHttpResponse=function(){
var _eb=this.xmlHttp;
if(_eb&&_eb.readyState===4){
if(_eb.status===200){
this.httpSuccess();
}else{
this.httpError();
}
}else{
}
};
XmlHttpObject.prototype.init=function(_ec,_ed,url,_ef){
this.m_action=_ec;
this.m_gateway=_ed;
this.m_url=url;
this.m_asynch=_ef;
};
XmlHttpObject.prototype.httpSuccess=function(){
this.executeHttpCallback("postHttpRequest");
this.executeHttpCallback("entryComplete");
this.executeHttpCallback("complete");
this.m_httpCallbacks=null;
};
XmlHttpObject.prototype.httpError=function(){
this.executeHttpCallback("entryFault");
this.executeHttpCallback("fault");
this.m_httpCallbacks=null;
};
XmlHttpObject.prototype.forceSynchronous=function(){
this.m_asynch=false;
};
XmlHttpObject.prototype.sendRequest=function(){
this.sendHtmlRequest(this.m_action,this.m_gateway,this.m_url,this.m_asynch);
};
XmlHttpObject.prototype.sendHtmlRequest=function(_f0,_f1,url,_f3){
var _f4=this.xmlHttp;
if(_f4){
_f4.open(_f0,_f1,_f3);
if(_f3){
_f4.onreadystatechange=GUtil.generateCallback(this.waitForXmlHttpResponse,[],this);
}else{
_f4.onreadystatechange=GUtil.generateCallback(this.waitForXmlHttpResponse,[],this);
if(!isIE()){
_f4.onload=GUtil.generateCallback(this.httpSuccess,[],this);
_f4.onerror=GUtil.generateCallback(this.httpError,[],this);
}
}
_f4.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
if(this.m_headers){
for(header in this.m_headers){
_f4.setRequestHeader(header,this.m_headers[header]);
}
}
this.executeHttpCallback("preHttpRequest");
var _f5=this.convertFormFieldsToUrl();
if(url){
_f5+=url;
}
_f4.send(_f5);
}
};
XmlHttpObject.prototype.getResponseXml=function(){
return (this.xmlHttp)?this.xmlHttp.responseXML:null;
};
XmlHttpObject.prototype.getResponseText=function(){
return (this.xmlHttp)?this.xmlHttp.responseText:"";
};
XmlHttpObject.prototype.getResponseHeader=function(_f6){
return (this.xmlHttp)?this.xmlHttp.getResponseHeader(_f6):null;
};
XmlHttpObject.prototype.getStatus=function(){
return this.xmlHttp.status;
};
XmlHttpObject.prototype.addFormField=function(_f7,_f8){
this.m_formFields.add(_f7,_f8);
};
XmlHttpObject.prototype.getFormFields=function(){
return this.m_formFields;
};
XmlHttpObject.prototype.getFormField=function(_f9){
return this.m_formFields.get(_f9);
};
XmlHttpObject.prototype.clearFormFields=function(){
this.m_formFields=new CDictionary();
};
XmlHttpObject.prototype.convertFormFieldsToUrl=function(){
var url="";
var _fb=this.m_formFields.keys();
for(var _fc=0;_fc<_fb.length;_fc++){
if(_fc>0){
url+="&";
}
url+=encodeURIComponent(_fb[_fc])+"="+encodeURIComponent(this.m_formFields.get(_fb[_fc]));
}
return url;
};
XmlHttpObject.prototype.concatResponseArguments=function(_fd){
var _fe=[this];
if(_fd){
_fe=_fe.concat(_fd);
}
return _fe;
};
function AsynchRequest(_ff,_100){
AsynchRequest.baseConstructor.call(this);
this.m_gateway=_ff;
this.m_webContentRoot=_100;
this.m_callbacks={};
this.m_soapFault=null;
this.m_faultDialog=null;
this.m_promptDialog=null;
this.m_logonDialog=null;
};
AsynchRequest.prototype=new XmlHttpObject();
AsynchRequest.baseConstructor=XmlHttpObject;
AsynchRequest.prototype.parent=XmlHttpObject.prototype;
AsynchRequest.prototype.getTracking=function(){
return "";
};
AsynchRequest.prototype.getConversation=function(){
return "";
};
AsynchRequest.prototype.getPrimaryAction=function(){
return "";
};
AsynchRequest.prototype.getActionState=function(){
return "";
};
AsynchRequest.prototype.getAsynchStatus=function(){
return "";
};
AsynchRequest.prototype.getResult=function(){
return null;
};
AsynchRequest.prototype.getSoapFault=function(){
return this.m_soapFault;
};
AsynchRequest.prototype.constructFaultEnvelope=function(){
return null;
};
AsynchRequest.prototype.getPromptHTMLFragment=function(){
return "";
};
AsynchRequest.prototype.isRAPWaitTrue=function(){
return false;
};
AsynchRequest.prototype.getRAPRequestCache=function(){
return null;
};
AsynchRequest.prototype.getMainConversation=function(){
return null;
};
AsynchRequest.prototype.getMainTracking=function(){
return null;
};
AsynchRequest.prototype.construct=function(){
};
AsynchRequest.prototype.executeCallback=function(_101){
if(this.m_callbacks[_101]){
var _102=this.concatResponseArguments(this.m_callbacks.customArguments);
var _103=GUtil.generateCallback(this.m_callbacks[_101].method,_102,this.m_callbacks[_101].object);
_103();
return true;
}
return false;
};
AsynchRequest.prototype.setCallbacks=function(_104){
if(!this.m_callbacks){
this.m_callbacks={};
}
for(callback in _104){
this.m_callbacks[callback]=_104[callback];
}
};
AsynchRequest.prototype.getCallbacks=function(){
return this.m_callbacks;
};
AsynchRequest.prototype.newRequest=function(){
var _105=this.construct();
_105.setHeaders(this.getHeaders());
if(this.getFormFields().exists("b_action")){
_105.addFormField("b_action",this.getFormField("b_action"));
}
if(this.getFormFields().exists("cv.catchLogOnFault")){
_105.addFormField("cv.catchLogOnFault",this.getFormField("cv.catchLogOnFault"));
}
_105.setPromptDialog(this.m_promptDialog);
_105.setFaultDialog(this.m_faultDialog);
_105.setLogonDialog(this.m_logonDialog);
_105.m_asynch=this.m_asynch;
if(this.m_callbacks.newRequest){
var _106=GUtil.generateCallback(this.m_callbacks.newRequest.method,[_105],this.m_callbacks.newRequest.object);
_106();
}
return _105;
};
AsynchRequest.prototype.success=function(){
var _107=this.getAsynchStatus();
switch(_107){
case "stillWorking":
case "working":
this.working();
break;
case "prompting":
this.prompting();
break;
case "fault":
case "complete":
case "conversationComplete":
this.complete();
break;
default:
this.complete();
break;
}
};
AsynchRequest.prototype.setFaultDialog=function(_108){
if(_108 instanceof IFaultDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setFaultDialog is deprecated");
}
this.m_faultDialog=_108;
}else{
if(_108&&typeof console!="undefined"){
console.log("The parameter faultDialog must be an instance of IFaultDialog");
}
}
};
AsynchRequest.prototype.setPromptDialog=function(_109){
if(_109 instanceof IPromptDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setPromptDialog is deprecated");
}
this.m_promptDialog=_109;
}else{
if(_109&&typeof console!="undefined"){
console.log("The parameter promptDialog must be an instance of IPromptDialog");
}
}
};
AsynchRequest.prototype.setLogonDialog=function(_10a){
if(_10a instanceof ILogOnDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setLogonDialog is deprecated");
}
this.m_logonDialog=_10a;
}else{
if(_10a&&typeof console!="undefined"){
console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
}
}
};
AsynchRequest.prototype.resubmitRequest=function(){
var _10b=this.newRequest();
_10b.m_formFields=this.m_formFields;
_10b.sendRequest();
return _10b;
};
AsynchRequest.prototype.sendRequest=function(){
var _10c=this;
var _10d={"complete":{"object":_10c,"method":_10c.successHandler},"fault":{"object":_10c,"method":_10c.errorHandler}};
this.init("POST",this.m_gateway,"",this.m_asynch);
this.executeCallback("preHttpRequest");
this.parent.setCallbacks.call(this,_10d);
this.parent.sendRequest.call(this);
};
AsynchRequest.prototype.errorHandler=function(){
this.executeCallback("postHttpRequest");
this.executeCallback("entryFault");
this.executeCallback("error");
};
AsynchRequest.prototype.successHandler=function(){
this.executeCallback("postHttpRequest");
if(typeof window["AsynchRequestPromptDialog"]!="undefined"&&window["AsynchRequestPromptDialog"]!=null){
window["AsynchRequestPromptDialog"].hide();
window["AsynchRequestPromptDialog"]=null;
}
if(this.getResponseHeader("Content-type").indexOf("text/html")!=-1){
var _10e=this.getResponseText();
if(_10e.indexOf("<ERROR_CODE>CAM_PASSPORT_ERROR</ERROR_CODE>")!=-1){
this.passportTimeout();
}else{
this.executeCallback("entryFault");
if(!this.executeCallback("fault")){
var _10f=window.open("","","height=400,width=500");
if(_10f!=null){
_10f.document.write(_10e);
}
}
}
}else{
this.m_soapFault=this.constructFaultEnvelope();
if(this.m_soapFault!=null){
var _110=XMLHelper_FindChildByTagName(this.m_soapFault,"CAM",true);
if(_110!=null&&XMLHelper_FindChildByTagName(_110,"promptInfo",true)){
this.passportTimeout();
}else{
this.fault();
}
}else{
this.success();
}
}
};
AsynchRequest.prototype.cancel=function(){
this.parent.cancel.call(this);
var _111=this.getFormField("m_tracking");
if(_111){
var _112=new XmlHttpObject();
_112.init("POST",this.m_gateway,"",false);
if(this.getFormField("cv.outputKey")){
_112.addFormField("b_action","cvx.high");
_112.addFormField("cv.outputKey",this.getFormField("cv.outputKey"));
_112.setHeaders(this.getHeaders());
}else{
_112.addFormField("b_action","cognosViewer");
}
_112.addFormField("cv.responseFormat","successfulRequest");
_112.addFormField("ui.action","cancel");
_112.addFormField("m_tracking",_111);
if(this.getFormField("cv.debugDirectory")){
_112.addFormField("cv.debugDirectory",this.getFormField("cv.debugDirectory"));
}
_112.sendRequest();
this.executeCallback("cancel");
}
};
AsynchRequest.prototype.working=function(){
this.executeCallback("working");
var _113=this.newRequest();
_113.addFormField("m_tracking",this.getTracking());
if(this.getFormField("cv.outputKey")){
_113.addFormField("cv.outputKey",this.getFormField("cv.outputKey"));
_113.addFormField("b_action","cvx.high");
}
if(this.isRAPWaitTrue()){
_113.m_formFields=this.m_formFields;
_113.addFormField("m_tracking",this.getTracking());
_113.addFormField("rapWait","true");
var _114=this.getRAPRequestCache();
if(_114!==null&&typeof _114!="undefined"){
_113.addFormField("rapRequestCache",_114);
}
var _115=this.getMainConversation();
if(_115){
_113.addFormField("mainConversation",_115);
}
var _116=this.getMainTracking();
if(_116){
_113.addFormField("mainTracking",_116);
}
}else{
_113.addFormField("ui.action","wait");
_113.addFormField("ui.primaryAction",this.getPrimaryAction());
_113.addFormField("cv.actionState",this.getActionState());
if(this.getFormField("ui.preserveRapTags")){
_113.addFormField("ui.preserveRapTags",this.getFormField("ui.preserveRapTags"));
}
if(this.getFormField("ui.backURL")){
_113.addFormField("ui.backURL",this.getFormField("ui.backURL"));
}
if(this.getFormField("errURL")){
_113.addFormField("errURL",this.getFormField("errURL"));
}
if(this.getFormField("cv.showFaultPage")){
_113.addFormField("cv.showFaultPage",this.getFormField("cv.showFaultPage"));
}
if(this.getFormField("cv.catchLogOnFault")){
_113.addFormField("cv.catchLogOnFault",this.getFormField("cv.catchLogOnFault"));
}
}
if(this.getFormField("bux")){
_113.addFormField("bux",this.getFormField("bux"));
}
if(this.getFormField("cv.debugDirectory")){
_113.addFormField("cv.debugDirectory",this.getFormField("cv.debugDirectory"));
}
_113.sendRequest();
};
AsynchRequest.prototype.prompting=function(){
this.executeCallback("entryComplete");
if(!this.executeCallback("prompting")){
if(this.m_promptDialog!=null){
this.showPromptPage();
}else{
if(typeof console!="undefined"){
console.log("An unhandled prompt response was returned: %o",this.xmlHttp);
}
}
}
this.executeCallback("postEntryComplete");
};
AsynchRequest.prototype.promptPageOkCallback=function(_117){
var _118=this.newRequest();
_118.addFormField("ui.action","forward");
_118.addFormField("m_tracking",this.getTracking());
_118.addFormField("ui.conversation",this.getConversation());
_118.addFormField("ui.primaryAction",this.getPrimaryAction());
_118.addFormField("cv.actionState",this.getActionState());
for(var _119 in _117){
_118.addFormField(_119,_117[_119]);
}
_118.sendRequest();
window["AsynchRequestObject"]=null;
};
AsynchRequest.prototype.promptPageCancelCallback=function(){
window["AsynchRequestPromptDialog"].hide();
this.complete();
};
AsynchRequest.prototype.showPromptPage=function(){
window["AsynchRequestObject"]=this;
window["AsynchRequestPromptDialog"]=this.m_promptDialog;
var _11a=this.m_promptDialog.getViewerId()==null?"":"?cv.id="+this.m_promptDialog.getViewerId();
window["AsynchRequestPromptDialog"].initialize(this.m_webContentRoot+"/rv/showStandalonePrompts.html"+_11a,400,400);
window["AsynchRequestPromptDialog"].show();
};
AsynchRequest.prototype.passportTimeout=function(){
this.executeCallback("entryFault");
if(!this.executeCallback("passportTimeout")){
if(this.m_logonDialog!=null){
this.m_logonDialog.show(response.getSoapFault());
}else{
if(typeof console!="undefined"){
console.log("An unhandled passport timeout fault was returned: %o",this.getSoapFault());
}
}
}
};
AsynchRequest.prototype.fault=function(){
this.executeCallback("entryFault");
if(!this.executeCallback("fault")){
if(this.m_faultDialog!=null){
this.m_faultDialog.show(this.getSoapFault());
}else{
if(typeof console!="undefined"){
console.log("An unhandled soap fault was returned: %o",this.getSoapFault());
}
}
}
};
AsynchRequest.prototype.complete=function(){
this.executeCallback("entryComplete");
this.executeCallback("complete");
this.executeCallback("postEntryComplete");
};
AsynchRequest.prototype.getSoapFaultCode=function(){
var _11b=this.constructFaultEnvelope();
if(_11b){
var _11c=XMLHelper_FindChildByTagName(_11b,"faultcode",true);
if(_11c!=null){
return XMLHelper_GetText(_11c);
}
}
return null;
};
AsynchRequest.prototype.getSoapFaultDetailMessageString=function(){
var _11d=this.constructFaultEnvelope();
if(_11d){
var _11e=XMLHelper_FindChildByTagName(_11d,"messageString",true);
if(_11e!=null){
return XMLHelper_GetText(_11e);
}
}
return null;
};
function AsynchDATARequest(_11f,_120){
AsynchDATARequest.baseConstructor.call(this,_11f,_120);
this.m_oResponseState=null;
this.m_sResponseState=null;
this.m_endOfStateIdx=-1;
this.cStatePrefix="<xml><state>";
this.cStateSuffix="</state></xml>";
};
AsynchDATARequest.prototype=new AsynchRequest();
AsynchDATARequest.baseConstructor=AsynchRequest;
AsynchDATARequest.prototype.getEndOfStateIdx=function(){
if(this.m_endOfStateIdx==-1){
var _121=this.getResponseText().substring(0,12);
if(_121==this.cStatePrefix){
this.m_endOfStateIdx=this.getResponseText().indexOf(this.cStateSuffix);
if(this.m_endOfStateIdx!=-1){
this.m_endOfStateIdx+=this.cStateSuffix.length;
}
}
}
return this.m_endOfStateIdx;
};
AsynchDATARequest.prototype.getResponseStateText=function(){
if(!this.m_sResponseState){
this.getResponseState();
}
return this.m_sResponseState;
};
AsynchDATARequest.prototype.getResponseState=function(){
if(this.m_oResponseState==null&&this.getEndOfStateIdx()!=-1){
this.m_sResponseState=this.getResponseText().substring(this.cStatePrefix.length,this.getEndOfStateIdx()-this.cStateSuffix.length);
if(this.m_sResponseState!=null){
this.m_sResponseState=xml_decode(this.m_sResponseState);
this.m_oResponseState=eval("("+this.m_sResponseState+")");
}
}
return this.m_oResponseState;
};
AsynchDATARequest.prototype.getAsynchStatus=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().m_sStatus!="undefined"){
return this.getResponseState().m_sStatus;
}
return "unknown";
};
AsynchDATARequest.prototype.getTracking=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().m_sTracking!="undefined"){
return this.getResponseState().m_sTracking;
}
return "";
};
AsynchDATARequest.prototype.getConversation=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().m_sConversation!="undefined"){
return this.getResponseState().m_sConversation;
}
return "";
};
AsynchDATARequest.prototype.getPrimaryAction=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().envParams!="undefined"&&this.getResponseState().envParams["ui.primaryAction"]!="undefined"){
return this.getResponseState().envParams["ui.primaryAction"];
}
return "";
};
AsynchDATARequest.prototype.getActionState=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().m_sActionState!="undefined"){
return this.getResponseState().m_sActionState;
}
return "";
};
AsynchDATARequest.prototype.getResult=function(){
if(this.getEndOfStateIdx()!=-1){
return this.getResponseText().substring(this.getEndOfStateIdx(),this.getResponseText().length);
}
return "";
};
AsynchDATARequest.prototype.getDebugLogs=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().debugLogs!="undefined"){
return this.getResponseState().debugLogs;
}
return "";
};
AsynchDATARequest.prototype.getPromptHTMLFragment=function(){
return this.getResult();
};
AsynchDATARequest.prototype.constructFaultEnvelope=function(){
if(this.m_soapFault==null){
var _122=this.getResponseState();
if(_122!=null){
if(_122.m_sSoapFault){
var _123=_122.m_sSoapFault;
this.m_soapFault=XMLBuilderLoadXMLFromString(_123);
}
}
}
return this.m_soapFault;
};
AsynchDATARequest.prototype.construct=function(){
var _124=new AsynchDATARequest(this.m_gateway,this.m_webContentRoot);
_124.setCallbacks(this.m_callbacks);
if(this.getFormFields().exists("cv.responseFormat")){
_124.addFormField("cv.responseFormat",this.getFormField("cv.responseFormat"));
}else{
_124.addFormField("cv.responseFormat","data");
}
return _124;
};
AsynchDATARequest.prototype.getEnvParam=function(_125){
var _126=this.getResponseState();
if(_126&&typeof _126.envParams!="undefined"&&typeof _126.envParams[_125]!="undefined"){
return _126.envParams[_125];
}
return null;
};
AsynchDATARequest.prototype.isRAPWaitTrue=function(){
var _127=this.getEnvParam("rapWait");
if(_127!=null){
return _127=="true"?true:false;
}
return false;
};
AsynchDATARequest.prototype.getRAPRequestCache=function(){
return this.getEnvParam("rapRequestCache");
};
AsynchDATARequest.prototype.getMainConversation=function(){
return this.getEnvParam("mainConversation");
};
AsynchDATARequest.prototype.getMainTracking=function(){
return this.getEnvParam("mainTracking");
};
function AsynchJSONRequest(_128,_129){
AsynchJSONRequest.baseConstructor.call(this,_128,_129);
this.m_jsonResponse=null;
};
AsynchJSONRequest.prototype=new AsynchRequest();
AsynchJSONRequest.baseConstructor=AsynchRequest;
AsynchJSONRequest.prototype.getJSONResponseObject=function(){
if(this.m_jsonResponse==null){
if(this.getResponseHeader("Content-type").indexOf("application/json")!=-1){
var text=this.getResponseText();
if(text!=null){
var _12b=this.removeInvalidCharacters(text);
this.m_jsonResponse=eval("("+_12b+")");
}
}
}
return this.m_jsonResponse;
};
AsynchJSONRequest.prototype.getTracking=function(){
var _12c=this.getJSONResponseObject();
if(_12c){
return _12c.tracking;
}
return "";
};
AsynchJSONRequest.prototype.getConversation=function(){
var _12d=this.getJSONResponseObject();
if(_12d){
return _12d.conversation;
}
return "";
};
AsynchJSONRequest.prototype.getAsynchStatus=function(){
var _12e=this.getJSONResponseObject();
if(_12e){
return _12e.status;
}
return "unknown";
};
AsynchJSONRequest.prototype.getPrimaryAction=function(){
var _12f=this.getJSONResponseObject();
if(_12f){
return _12f.primaryAction;
}
return "";
};
AsynchJSONRequest.prototype.getActionState=function(){
var _130=this.getJSONResponseObject();
if(_130){
return _130.actionState;
}
return "";
};
AsynchJSONRequest.prototype.getDebugLogs=function(){
var _131=this.getJSONResponseObject();
if(_131){
return _131.debugLogs;
}
return "";
};
AsynchJSONRequest.prototype.isRAPWaitTrue=function(){
var _132=this.getJSONResponseObject();
if(_132){
return (_132.rapWait==="true");
}
return false;
};
AsynchJSONRequest.prototype.getRAPRequestCache=function(){
var _133=this.getJSONResponseObject();
if(_133){
var _134=_133.rapRequestCache;
if(_134!==null&&typeof _134!="undefined"){
return _134;
}
}
return null;
};
AsynchJSONRequest.prototype.getMainConversation=function(){
var _135=this.getJSONResponseObject();
if(_135){
return _135.mainConversation;
}
return null;
};
AsynchJSONRequest.prototype.getMainTracking=function(){
var _136=this.getJSONResponseObject();
if(_136){
return _136.mainTracking;
}
return null;
};
AsynchJSONRequest.prototype.getResult=function(){
var _137=this.getJSONResponseObject();
if(_137&&_137.json){
var _138=this.removeInvalidCharacters(_137.json);
return eval("("+_138+")");
}
return null;
};
AsynchJSONRequest.prototype.removeInvalidCharacters=function(text){
if(text){
text=text.replace(/(\n|\r|\t)+/g,"");
}
return text;
};
AsynchJSONRequest.prototype.getPromptHTMLFragment=function(){
var _13a=this.getJSONResponseObject();
if(_13a&&_13a.promptHTMLFragment){
return _13a.promptHTMLFragment;
}
return "";
};
AsynchJSONRequest.prototype.constructFaultEnvelope=function(){
if(this.m_soapFault==null){
var _13b=this.getJSONResponseObject();
if(_13b.status=="fault"){
this.m_soapFault=XMLBuilderLoadXMLFromString(_13b.fault);
}
}
return this.m_soapFault;
};
AsynchJSONRequest.prototype.construct=function(){
var _13c=new AsynchJSONRequest(this.m_gateway,this.m_webContentRoot);
_13c.setCallbacks(this.m_callbacks);
if(this.getFormFields().exists("cv.responseFormat")){
_13c.addFormField("cv.responseFormat",this.getFormField("cv.responseFormat"));
}else{
_13c.addFormField("cv.responseFormat","asynchJSON");
}
return _13c;
};
function IFaultDialog(){
};
IFaultDialog.prototype.show=function(){
if(typeof console!="undefined"){
console.log("Required method IFaultDialog:show not implemented.");
}
};
IFaultDialog.prototype.handleUnknownHTMLResponse=function(){
if(typeof console!="undefined"){
console.log("Required method IFaultDialog:handlerUnknownHTMLResponse not implemented.");
}
};
function ILogOnDialog(){
};
ILogOnDialog.prototype.show=function(_13d){
if(typeof console!="undefined"){
console.log("Required method ILogOnDialog:show not implemented.");
}
};
ILogOnDialog.prototype.handleUnknownHTMLResponse=function(_13e){
if(typeof console!="undefined"){
console.log("Required method ILogOnDialog:handleUnknownHTMLResponse not implemented.");
}
};
function IPromptDialog(){
};
IPromptDialog.prototype.initialize=function(url,_140,_141){
if(typeof console!="undefined"){
console.log("Required method IModalDialog:initialize not implemented.");
}
};
IPromptDialog.prototype.show=function(){
if(typeof console!="undefined"){
console.log("Required method IModalDialog:show not implemented.");
}
};
IPromptDialog.prototype.hide=function(){
if(typeof console!="undefined"){
console.log("Required method IModalDialog:hide not implemented.");
}
};
function IRequestHandler(){
};
IRequestHandler.prototype.preHttpRequest=function(_142){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:preHttpRequest not implemented.");
}
};
IRequestHandler.prototype.postHttpRequest=function(_143){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:postHttpRequest not implemented.");
}
};
IRequestHandler.prototype.postComplete=function(_144){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:postComplete not implemented.");
}
};
IRequestHandler.prototype.onComplete=function(_145){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onComplete not implemented.");
}
};
IRequestHandler.prototype.onPostEntryComplete=function(_146){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onPostEntryComplete not implemented.");
}
};
IRequestHandler.prototype.onFault=function(_147){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onFault not implemented.");
}
};
IRequestHandler.prototype.onPrompting=function(_148){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onPrompting not implemented.");
}
};
IRequestHandler.prototype.onWorking=function(_149){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onWorking not implemented.");
}
};
IRequestHandler.prototype.setWorkingDialog=function(_14a){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:setWorkingDialog not implemented.");
}
};
IRequestHandler.prototype.setRequestIndicator=function(_14b){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:setExecutionCursor not implemented.");
}
};
function IRequestIndicator(){
};
IRequestIndicator.prototype.show=function(){
if(typeof console!="undefined"){
console.log("Required method IRequestIndicator:show not implemented.");
}
};
IRequestIndicator.prototype.hide=function(){
if(typeof console!="undefined"){
console.log("Required method IRequestIndicator:hide not implemented.");
}
};
function BaseRequestHandler(oCV){
if(oCV){
this.m_oCV=oCV;
this.m_workingDialog=null;
this.m_requestIndicator=null;
this.m_faultDialog=null;
this.m_logOnDialog=null;
this.m_promptDialog=null;
this.m_httpRequestConfig=this.m_oCV.getConfig()&&this.m_oCV.getConfig().getHttpRequestConfig()?this.m_oCV.getConfig().getHttpRequestConfig():null;
}
};
BaseRequestHandler.prototype=new IRequestHandler();
BaseRequestHandler.prototype.onError=function(_14d){
};
BaseRequestHandler.prototype.onComplete=function(){
};
BaseRequestHandler.prototype.onPrompting=function(){
};
BaseRequestHandler.prototype.resubmitInSafeMode=function(){
};
BaseRequestHandler.prototype.massageHtmlBeforeDisplayed=function(){
};
BaseRequestHandler.prototype.onPostEntryComplete=function(){
this._processDelayedLoadingQueue();
};
BaseRequestHandler.prototype.getViewer=function(){
return this.m_oCV;
};
BaseRequestHandler.prototype.setDispatcherEntry=function(_14e){
this.m_oDispatcherEntry=_14e;
};
BaseRequestHandler.prototype.getDispatcherEntry=function(){
return this.m_oDispatcherEntry;
};
BaseRequestHandler.prototype.processInitialResponse=function(_14f){
this.updateViewerState(_14f);
};
BaseRequestHandler.prototype.setLogOnDialog=function(_150){
if(_150==null){
this.m_logOnDialog=null;
}else{
if(_150 instanceof ILogOnDialog){
this.m_logOnDialog=_150;
}else{
if(_150&&typeof console!="undefined"){
console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
}
}
}
};
BaseRequestHandler.prototype.setWorkingDialog=function(_151){
if(_151==null){
this.m_workingDialog=null;
}else{
if(this.m_httpRequestConfig&&this.m_httpRequestConfig.getWorkingDialog()){
this.m_workingDialog=this.m_httpRequestConfig.getWorkingDialog();
}else{
if(_151 instanceof IRequestIndicator){
this.m_workingDialog=_151;
}else{
if(_151&&typeof console!="undefined"){
console.log("The parameter workingDialog must be an instance of IRequestIndicator");
}
}
}
}
};
BaseRequestHandler.prototype.getWorkingDialog=function(){
return this.m_workingDialog;
};
BaseRequestHandler.prototype.setRequestIndicator=function(_152){
if(_152==null){
this.m_requestIndicator=null;
}else{
if(this.m_httpRequestConfig&&this.m_httpRequestConfig.getRequestIndicator()){
this.m_requestIndicator=this.m_httpRequestConfig.getRequestIndicator();
}else{
if(_152 instanceof IRequestIndicator){
this.m_requestIndicator=_152;
}else{
if(_152&&typeof console!="undefined"){
console.log("The parameter requestIndicator must be an instance of IRequestIndicator");
}
}
}
}
};
BaseRequestHandler.prototype.getRequestIndicator=function(){
return this.m_requestIndicator;
};
BaseRequestHandler.prototype.setFaultDialog=function(_153){
if(_153==null){
this.m_faultDialog=null;
}else{
if(_153 instanceof IFaultDialog){
this.m_faultDialog=_153;
}else{
if(_153&&typeof console!="undefined"){
console.log("The parameter faultDialog must be an instance of IFaultDialog");
}
}
}
};
BaseRequestHandler.prototype.setPromptDialog=function(_154){
if(_154==null){
this.m_promptDialog=null;
}else{
if(_154 instanceof IPromptDialog){
this.m_promptDialog=_154;
}else{
if(_154&&typeof console!="undefined"){
console.log("The parameter promptDialog must be an instance of IPromptDialog");
}
}
}
};
BaseRequestHandler.prototype.preHttpRequest=function(_155){
if(_155&&typeof _155.getFormField=="function"){
if(_155.getFormField("ui.action")!="wait"&&_155.getFormField("rapWait")!="true"){
if(this.m_requestIndicator){
this.m_requestIndicator.show();
}
}
}
};
BaseRequestHandler.prototype.postHttpRequest=function(_156){
if(_156&&typeof _156.getAsynchStatus=="function"){
var _157=_156.getAsynchStatus();
if(_157!="working"&&_157!="stillWorking"){
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
}
}else{
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
}
};
BaseRequestHandler.prototype.onFault=function(_158){
var oCV=this.getViewer();
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
if(typeof FaultDialog=="undefined"){
if(typeof console!="undefined"){
console.log("An unhandled fault was returned: %o",_158);
}
return;
}
if(!this.m_faultDialog){
this.m_faultDialog=new FaultDialog(this.getViewer());
}
if(_158&&_158.getResponseHeader&&_158.getResponseHeader("Content-type").indexOf("text/html")!=-1){
this.m_faultDialog.handleUnknownHTMLResponse(_158.getResponseText());
}else{
if(_158&&_158.getSoapFault){
this.m_faultDialog.show(_158.getSoapFault());
}else{
if(oCV.getSoapFault()){
var _15a=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
this.m_faultDialog.show(_15a);
oCV.setSoapFault("");
}else{
if(typeof console!="undefined"){
console.log("An unhandled fault was returned: %o",_158);
}
}
}
}
};
BaseRequestHandler.prototype.isAuthenticationFault=function(_15b){
var oCV=this.getViewer();
var _15d=null;
if(_15b&&_15b.getSoapFault){
_15d=_15b.getSoapFault();
}else{
if(oCV.getSoapFault()){
_15d=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
}
}
if(_15d!=null){
var _15e=XMLHelper_FindChildByTagName(_15d,"CAM",true);
return (_15e!=null&&XMLHelper_FindChildByTagName(_15e,"promptInfo",true)!=null);
}
return false;
};
BaseRequestHandler.prototype.onPassportTimeout=function(_15f){
var oCV=this.getViewer();
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
if(!this.m_logOnDialog){
this.m_logOnDialog=new LogOnDialog(this.getViewer());
}
if(_15f&&_15f.getResponseHeader&&_15f.getResponseHeader("Content-type").indexOf("text/html")!=-1){
this.m_logOnDialog.handleUnknownHTMLResponse(_15f.getResponseText());
}else{
if(_15f&&_15f.getSoapFault){
this.m_logOnDialog.show(_15f.getSoapFault());
}else{
if(oCV.getSoapFault()){
var _161=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
this.m_logOnDialog.show(_161);
oCV.setSoapFault("");
}else{
if(typeof console!="undefined"){
console.log("BaseRequestHandler.prototype.onPassportTimeout: An unhandled authentication fault was returned: %o",_15f);
}
}
}
}
};
BaseRequestHandler.prototype.onWorking=function(_162){
if(this.m_workingDialog){
var _163=_162&&typeof _162.getAsynchStatus=="function"&&_162.getAsynchStatus()=="stillWorking"?true:false;
if(!_163){
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
this.m_workingDialog.show();
}
}
};
BaseRequestHandler.prototype.onCancel=function(){
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
var oCV=this.getViewer();
oCV.gbPromptRequestSubmitted=false;
this._processDelayedLoadingQueue();
};
BaseRequestHandler.prototype._processDelayedLoadingQueue=function(){
var oCV=this.getViewer();
if(oCV&&oCV.getViewerWidget()){
var _166=oCV.getViewerWidget();
if(_166.getLoadManager()){
_166.getLoadManager().processQueue();
}
}
};
BaseRequestHandler.prototype.onPrompting=function(_167){
var oCV=this.getViewer();
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
if(!this.m_promptDialog){
this.m_promptDialog=new PromptDialog(this.getViewer());
}
window["AsynchRequestObject"]=_167;
window["AsynchRequestPromptDialog"]=this.m_promptDialog;
var _169="?cv.id="+oCV.getId();
window["AsynchRequestPromptDialog"].initialize(oCV.getWebContentRoot()+"/rv/showStandalonePrompts.html"+_169,400,400);
window["AsynchRequestPromptDialog"].show();
};
BaseRequestHandler.prototype.processDATAReportResponse=function(_16a){
var oCV=this.getViewer();
if(!oCV||oCV.m_destroyed){
if(console){
console.warn("Tried to process a data response on an invalid CCognosViewer",oCV);
}
return;
}
var _16c=_16a.getResponseState();
if(!_16c){
this.resubmitInSafeMode();
}
if(this.loadReportHTML(_16a.getResult())===false){
this.resubmitInSafeMode();
}
this.updateViewerState(_16c);
};
BaseRequestHandler.prototype.updateViewerState=function(_16d){
var oCV=this.getViewer();
applyJSONProperties(oCV,_16d);
var _16f=oCV.getStatus();
if(typeof oCV.envParams["ui.spec"]!="undefined"&&oCV.envParams["ui.spec"].indexOf("&lt;")===0){
oCV.envParams["ui.spec"]=xml_decode(oCV.envParams["ui.spec"]);
}
if(_16f!="fault"){
if(oCV.envParams["rapReportInfo"]){
this._processRapReportInfo(oCV);
}
if(typeof _16d.clientunencodedexecutionparameters!="undefined"){
var _170=document.getElementById("formWarpRequest"+oCV.getId());
if(_170!=null&&typeof _170["clientunencodedexecutionparameters"]!="undefined"){
_170["clientunencodedexecutionparameters"].value=_16d.clientunencodedexecutionparameters;
}
if(typeof document.forms["formWarpRequest"]!="undefined"&&typeof document.forms["formWarpRequest"]["clientunencodedexecutionparameters"]!="undefined"){
document.forms["formWarpRequest"]["clientunencodedexecutionparameters"].value=_16d.clientunencodedexecutionparameters;
}
}
}else{
oCV.setTracking("");
}
};
BaseRequestHandler.prototype._processRapReportInfo=function(oCV){
if(oCV.envParams["rapReportInfo"]){
var _172=eval("("+oCV.envParams["rapReportInfo"]+")");
if(typeof RAPReportInfo!="undefined"){
var _173=new RAPReportInfo(_172,oCV);
oCV.setRAPReportInfo(_173);
}
}
};
BaseRequestHandler.prototype.loadReportHTML=function(_174){
var oCV=this.getViewer();
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_gotHtml",oCV);
}
if(oCV.m_undoStack.length>0){
oCV.m_undoStack[oCV.m_undoStack.length-1].m_bRefreshPage=true;
}
oCV.pageNavigationObserverArray=[];
oCV.m_flashChartsObjectIds=[];
var _176=_174.replace(/<form[^>]*>/gi,"").replace(/<\/form[^>]*>/gi,"");
oCV.m_sHTML=_176;
oCV.setHasPrompts(false);
var id=oCV.getId();
var _178=document.getElementById("RVContent"+id);
var _179=document.getElementById("CVReport"+id);
if(_176.match(/prompt\/control\.js|PRMTcompiled\.js|prmt_core\.js/gi)){
oCV.setHasPrompts(true);
_179.style.display="none";
}
if(window.gScriptLoader){
var _17a=oCV.getViewerWidget()?true:false;
var _17b=oCV.getViewerWidget()?document.getElementById("_"+oCV.getViewerWidget().iContext.widgetId+"_cv"):_179;
_176=window.gScriptLoader.loadCSS(_176,_17b,_17a,id);
}
if(oCV.sBrowser=="ie"){
_176="<span style='display:none'>&nbsp;</span>"+_176;
}
_179.innerHTML=_176;
this.massageHtmlBeforeDisplayed();
if(window.gScriptLoader){
var _17c=GUtil.generateCallback(oCV.showLoadedContent,[_178],oCV);
oCV.m_resizeReady=false;
if(!window.gScriptLoader.loadAll(_179,_17c,id,true)){
if(window.gScriptLoader.containsAjaxWarnings()){
return false;
}
}
}else{
_178.style.display="block";
}
oCV.updateOutputForA11ySupport();
this._clearFindState();
return true;
};
BaseRequestHandler.prototype._clearFindState=function(){
var oCV=this.getViewer();
var _17e=oCV.getState()&&oCV.getState().getFindState()?oCV.getState().getFindState():null;
if(_17e&&!_17e.findOnServerInProgress()){
oCV.getState().clearFindState();
}
};
BaseRequestHandler.prototype.showReport=function(){
var oCV=this.getViewer();
var _180=document.getElementById("CVReport"+oCV.getId());
if(_180){
_180.style.display="";
}
};
BaseRequestHandler.prototype.postComplete=function(){
var oCV=this.getViewer();
if(oCV.shouldWriteNavLinks()){
oCV.writeNavLinks(oCV.getSecondaryRequests().join(" "));
}
if(oCV.getStatus()==="complete"){
oCV.m_undoStack=[new CognosViewerSession(oCV)];
}
};
BaseRequestHandler.prototype.onAsynchStatusUpdate=function(_182){
if(this.m_httpRequestConfig){
var _183=this.m_httpRequestConfig.getReportStatusCallback(_182);
if(_183){
_183();
}
}
};
BaseRequestHandler.prototype.addCallbackHooks=function(){
if(!this.m_httpRequestConfig){
return;
}
this._addCallback("complete","onComplete");
this._addCallback("working","onWorking");
this._addCallback("prompting","onPrompting");
};
BaseRequestHandler.prototype._addCallback=function(_184,_185){
var _186=_184;
var _187=this[_185];
this[_185]=function(_188){
_187.apply(this,arguments);
var _189=null;
if(_188&&typeof _188.getAsynchStatus=="function"){
_189=_188.getAsynchStatus();
}else{
_189=_186=="complete"?this.getViewer().getStatus():_186;
}
if(_189=="stillWorking"){
return;
}
var _18a=this.m_httpRequestConfig.getReportStatusCallback(_189);
if(typeof _18a=="function"){
setTimeout(_18a,10);
}
};
};
function ViewerBaseWorkingDialog(_18b){
if(!_18b){
return;
}
this.setCognosViewer(_18b);
this.m_oCV=_18b;
this.m_sNamespace=_18b.getId();
this.m_sGateway=_18b.getGateway();
this.m_UIBlacklist=null;
this.m_bUse=true;
this.m_bCancelSubmitted=false;
};
ViewerBaseWorkingDialog.prototype=new IRequestIndicator();
ViewerBaseWorkingDialog.prototype.setCognosViewer=function(oCV){
this.m_oCV=oCV;
};
ViewerBaseWorkingDialog.prototype.getCognosViewer=function(){
return this.m_oCV;
};
ViewerBaseWorkingDialog.prototype.getGateway=function(){
return this.m_sGateway;
};
ViewerBaseWorkingDialog.prototype.getNamespace=function(){
return this.m_sNamespace;
};
ViewerBaseWorkingDialog.prototype.cancelSubmitted=function(){
return this.m_bCancelSubmitted;
};
ViewerBaseWorkingDialog.prototype.setCancelSubmitted=function(_18d){
this.m_bCancelSubmitted=_18d;
};
ViewerBaseWorkingDialog.prototype.show=function(){
var _18e=document.getElementById(this.getContainerId());
if(_18e){
_18e.style.display="block";
this.enableCancelButton();
}else{
this.create();
}
var _18f=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_18f){
_18f.style.display="block";
}
};
ViewerBaseWorkingDialog.prototype.create=function(){
if(typeof document.body!="undefined"){
if(this.isModal()){
this.createModalWaitDialog();
}else{
this.createInlineWaitDialog();
}
}
};
ViewerBaseWorkingDialog.prototype.createContainer=function(_190){
var _191=document.createElement("div");
_191.setAttribute("id",this.getContainerId());
_191.className=_190?"modalWaitPage":"inlineWaitPage";
return _191;
};
ViewerBaseWorkingDialog.prototype.createModalWaitDialog=function(){
this._createBlocker();
var _192=this.createContainer(true);
_192.innerHTML=this.renderHTML();
_192.style.zIndex="7002";
_192.setAttribute("role","region");
_192.setAttribute("aria-label",RV_RES.GOTO_WORKING);
document.body.appendChild(_192);
var _193=this.createModalIframeBackground();
document.body.appendChild(_193);
var _194=0;
var _195=0;
if(typeof window.innerHeight!="undefined"){
_194=Math.round((window.innerHeight/2)-(_192.offsetHeight/2));
_195=Math.round((window.innerWidth/2)-(_192.offsetWidth/2));
}else{
_194=Math.round((document.body.clientHeight/2)-(_192.offsetHeight/2));
_195=Math.round((document.body.clientWidth/2)-(_192.offsetWidth/2));
}
_192.style.bottom=_194+"px";
_192.style.left=_195+"px";
_193.style.left=_195-1+"px";
_193.style.bottom=_194-1+"px";
_193.style.width=_192.offsetWidth+2+"px";
_193.style.height=_192.offsetHeight+2+"px";
};
ViewerBaseWorkingDialog.prototype._createBlocker=function(){
var _196=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_196){
return;
}
var _197=document.getElementById("mainViewerTable"+this.m_oCV.getId());
if(_197){
_196=document.createElement("div");
_197.parentNode.appendChild(_196);
_196.id="reportBlocker"+this.m_oCV.getId();
_196.style.zIndex="6001";
_196.style.position="absolute";
_196.style.top="0px";
_196.style.left="0px";
_196.style.width="100%";
_196.style.height="100%";
_196.style.display="none";
_196.style.opacity="0";
_196.style.backgroundColor="#FFFFFF";
_196.style.filter="alpha(opacity:0)";
}
};
ViewerBaseWorkingDialog.prototype.createInlineWaitDialog=function(){
var _198=this.m_oCV.getId();
var _199=document.getElementById("CVReport"+_198);
if(_199){
var _19a=this.createContainer(false);
_19a.innerHTML="<table width=\"100%\" height=\"100%\"><tr><td valign=\"middle\" align=\"center\" role=\"presentation\">"+this.renderHTML()+"</td></tr></table>";
_199.appendChild(_19a);
}
};
ViewerBaseWorkingDialog.prototype.createModalIframeBackground=function(){
var _19b=document.createElement("iframe");
var _19c="..";
var oCV=this.getCognosViewer();
if(oCV!==null){
_19c=oCV.getWebContentRoot();
}
_19b.setAttribute("id",this.getContainerId()+"Iframe");
_19b.setAttribute("title","Empty iframe");
_19b.setAttribute("src",_19c+"/common/images/spacer.gif");
_19b.setAttribute("scrolling","no");
_19b.setAttribute("frameborder","0");
_19b.style.position="absolute";
_19b.style.zIndex="6002";
_19b.style.display="block";
return _19b;
};
ViewerBaseWorkingDialog.prototype.updateCoords=function(_19e,_19f){
if(this.m_container!==null&&m_iframeBackground!==null){
var _1a0=0;
var _1a1=0;
if(typeof window.innerHeight!="undefined"){
_1a0=Math.round((window.innerHeight/2)-(_19e.offsetHeight/2));
_1a1=Math.round((window.innerWidth/2)-(_19e.offsetWidth/2));
}else{
_1a0=Math.round((document.body.clientHeight/2)-(_19e.offsetHeight/2));
_1a1=Math.round((document.body.clientWidth/2)-(_19e.offsetWidth/2));
}
_19e.style.bottom=_1a0+"px";
_19e.style.left=_1a1+"px";
_19f.style.left=_19e.style.left;
_19f.style.bottom=_19e.style.bottom;
_19f.style.width=_19e.offsetWidth+"px";
_19f.style.height=_19e.offsetHeight+"px";
}
};
ViewerBaseWorkingDialog.prototype.hide=function(){
var _1a2=document.getElementById(this.getContainerId());
if(_1a2){
_1a2.parentNode.removeChild(_1a2);
}
var _1a3=document.getElementById(this.getContainerId()+"Iframe");
if(_1a3){
_1a3.parentNode.removeChild(_1a3);
}
var _1a4=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_1a4){
_1a4.parentNode.removeChild(_1a4);
}
};
ViewerBaseWorkingDialog.prototype.isModal=function(){
var _1a5=this.m_oCV.getId();
var _1a6=document.getElementById("CVReport"+_1a5);
var _1a7=true;
if(_1a6&&_1a6.innerHTML===""){
_1a7=false;
}
return _1a7;
};
ViewerBaseWorkingDialog.prototype.disableCancelButton=function(_1a8){
};
ViewerBaseWorkingDialog.prototype.enableCancelButton=function(){
};
function FaultDialog(oCV){
this.m_oCV=oCV;
};
FaultDialog.prototype=new IFaultDialog();
FaultDialog.prototype.show=function(_1aa){
if(typeof console!="undefined"){
console.log("FaultDialog - an unhandled soap fault was returned: %o",_1aa);
}
};
FaultDialog.prototype.handleUnknownHTMLResponse=function(_1ab){
this.m_oCV.setTracking("");
this.m_oCV.setConversation("");
if(_1ab){
if(this.m_oCV.envParams["useAlternateErrorCodeRendering"]){
var _1ac=document.getElementsByTagName("head")[0];
var _1ad=_1ab.match(/<body[^>]*>([\s\S]*)<\/body>/im)[1];
var _1ae=/<script[^>]*>([\s\S]*?)<\/script>/igm;
var _1af=_1ae.exec(_1ab);
while(_1af!=null){
var _1b0=document.createElement("script");
_1b0.type="text/javascript";
var _1b1=_1af[0].match(/src="([\s\S]*?)"/i);
if(_1b1==null){
_1b0.text=_1af[1];
}else{
_1b0.src=_1b1[1];
}
_1ac.appendChild(_1b0);
_1af=_1ae.exec(_1ab);
}
document.body.innerHTML=_1ad;
}else{
document.write(_1ab);
}
}
};
function LogOnDialog(oCV){
this.m_oCV=oCV;
};
LogOnDialog.prototype=new ILogOnDialog();
LogOnDialog.prototype.handleUnknownHTMLResponse=function(_1b3){
if(_1b3){
document.write(_1b3);
}
};
LogOnDialog.prototype.show=function(_1b4){
launchLogOnDialog(this.m_oCV.getId(),_1b4);
};
LogOnDialog.prototype.hide=function(){
};
function PromptDialog(oCV){
this.m_oCV=oCV;
this.m_dialogImpl=null;
};
PromptDialog.prototype=new IPromptDialog();
PromptDialog.prototype.initialize=function(url,_1b7,_1b8){
this.m_dialogImpl=new CModal("","",document.body,null,null,_1b7,_1b8,true,true,false,true,this.m_oCV.getWebContentRoot());
var _1b9=document.getElementById(CMODAL_CONTENT_ID);
_1b9.src=url;
};
PromptDialog.prototype.show=function(){
this.m_dialogImpl.show();
};
PromptDialog.prototype.hide=function(){
this.m_dialogImpl.hide();
destroyCModal();
};
function WorkingDialog(_1ba){
if(_1ba){
this.m_bSimpleWorkingDialog=false;
this.m_bShowCancelButton=(_1ba.getAdvancedServerProperty("VIEWER_JS_HIDE_CANCEL_BUTTON")=="true")?false:true;
WorkingDialog.baseConstructor.call(this,_1ba);
this.m_secondaryRequests=_1ba.getSecondaryRequests();
}
};
WorkingDialog.prototype=new ViewerBaseWorkingDialog();
WorkingDialog.baseConstructor=ViewerBaseWorkingDialog;
WorkingDialog.prototype.setSecondaryRequests=function(_1bb){
this.m_secondaryRequests=_1bb;
};
WorkingDialog.prototype._getSecondaryRequests=function(){
return this.m_secondaryRequests;
};
WorkingDialog.prototype.getIsSavedReport=function(){
return this.getCognosViewer().bIsSavedReport;
};
WorkingDialog.prototype.setSimpleWorkingDialogFlag=function(flag){
this.m_bSimpleWorkingDialog=flag;
};
WorkingDialog.prototype.getSimpleWorkingDialogFlag=function(){
return this.m_bSimpleWorkingDialog;
};
WorkingDialog.prototype.showDeliveryOptions=function(_1bd){
var _1be=this.getNamespace();
var _1bf=document.getElementById("DeliveryOptionsVisible"+_1be);
if(_1bf){
_1bf.style.display=(_1bd===false?"none":"block");
if(_1bd){
var _1c0=_1bf.getElementsByTagName("a");
for(var i=_1c0.length;i>0;i--){
if(_1c0[i]&&_1c0[i].getAttribute("tabIndex")=="0"){
_1c0[i].focus();
}
}
}
}
_1bf=document.getElementById("OptionsLinkSelected"+_1be);
if(_1bf){
_1bf.style.display=(_1bd===false?"none":"block");
}
_1bf=document.getElementById("OptionsLinkUnselected"+_1be);
if(_1bf){
_1bf.style.display=(_1bd===false?"block":"none");
}
};
WorkingDialog.prototype.renderHTML=function(){
var _1c2=this.getNamespace();
var _1c3=_1c2+"_workingMsg "+_1c2+"_workingMsg2";
var html="<table class=\"viewerWorkingDialog\" id=\"CVWaitTable"+_1c2+"\""+" role=\"presentation\">";
html+=("<tr>"+"<td align=\"center\">"+"<div tabIndex=\"0\" role=\"presentation\" aria-labelledby=\""+_1c3+"\""+" class=\"body_dialog_modal workingDialogDiv\">");
html+=this.renderFirstInnerTable();
html+=this.renderSecondInnerTable();
html+=("</div>"+"</td>"+"</tr>"+"</table>");
return html;
};
WorkingDialog.prototype.renderFirstInnerTable=function(){
var _1c5=this.getSimpleWorkingDialogFlag();
var _1c6=_1c5?RV_RES.GOTO_WORKING:RV_RES.RV_RUNNING;
var _1c7=this.m_sNamespace;
var _1c8="<table class=\"workingDialogInnerTable\" role=\"presentation\">"+"<tr>"+"<td valign=\"middle\">";
var _1c9=this.getCognosViewer().getSkin()+"/branding/";
_1c8+="<img src=\""+_1c9+"progress.gif\"";
if(isIE()){
_1c8+=" width=\"48\" height=\"48\" border=\"0\"";
}
_1c8+=" name=\"progress\"";
if(isIE()){
_1c8+=" align=\"top\"";
}
_1c8+=" alt=\"";
_1c8+=_1c6;
_1c8+="\"/></td>";
_1c8+="<td width=\"20\">&nbsp;</td>";
_1c8+="<td style=\"padding-top: 5px;\" class=\"tableText\">";
_1c8+="<span id=\""+_1c7+"_workingMsg\">";
_1c8+=_1c6;
_1c8+="</span>";
_1c8+="<br/><br/>";
var _1ca=this.getCognosViewer().envParams["cv.responseFormat"];
if(_1c5||this.isUIBlacklisted("RV_TOOLBAR_BUTTONS")||!this.deliverySectionIsNeeded()||(_1ca&&("qs"===_1ca||"fragment"===_1ca))){
_1c8+=RV_RES.RV_PLEASE_WAIT;
}else{
var _1cb=this.canShowDeliveryOptions();
if(_1cb){
_1c8+=this.optionLinkSelectedDiv();
_1c8+=this.optionLinkUnselectedDiv();
}else{
_1c8+=RV_RES.RV_PLEASE_WAIT;
}
}
_1c8+="</td></tr><tr><td colspan=\"3\">&nbsp;</td></tr></table>";
return _1c8;
};
WorkingDialog.prototype.optionLinkSelectedDiv=function(){
var _1cc="";
_1cc+="<div id=\"OptionsLinkSelected"+this.getNamespace()+"\" style=\"display: none\">";
_1cc+=RV_RES.RV_BUSY_OPTIONS_SELECTED;
_1cc+="</div>";
return _1cc;
};
WorkingDialog.prototype.optionLinkUnselectedDiv=function(){
var _1cd="";
var _1ce=this.getNamespace();
var _1cf="window.oCV"+_1ce+".getWorkingDialog()";
_1cd+="<div id=\"OptionsLinkUnselected"+_1ce+"\">";
_1cd+="<span id=\""+_1ce+"_workingMsg2\">";
_1cd+=RV_RES.RV_BUSY_OPTIONS_UNSELECTED;
_1cd+="</span><br/>";
_1cd+="<a href=\"#\" class=\"deliveryOptionLink\" onclick=\"javascript:"+_1cf+".showDeliveryOptions(true)\">";
_1cd+=RV_RES.RV_BUSY_OPTIONS_LINK;
_1cd+="</a></div>";
return _1cd;
};
WorkingDialog.prototype.canShowDeliveryOptions=function(){
var _1d0=this.getCognosViewer().envParams["ui.primaryAction"];
if("saveAs"!==_1d0&&"email"!==_1d0&&this.getIsSavedReport()){
return true;
}
return false;
};
WorkingDialog.prototype.isUIBlacklisted=function(item){
var _1d2=this.getUIBlacklist();
for(var _1d3 in _1d2){
if(_1d2[_1d3]===item){
return true;
}
}
return false;
};
WorkingDialog.prototype.getUIBlacklist=function(){
if(!this.m_UIBlacklist&&this.getCognosViewer().UIBlacklist){
this.m_UIBlacklist=this.getCognosViewer().UIBlacklist.split(" ");
}
return this.m_UIBlacklist;
};
WorkingDialog.prototype.deliverySectionIsNeeded=function(){
return !this._isSaveBlackListed()||!this._isSaveAsBlackListed()||!this._isEmailBlackListed();
};
WorkingDialog.prototype._isSaveBlackListed=function(){
return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SAVE")||this.isUIBlacklisted("RV_WORKING_DIALOG_SAVE")||!this._hasSecondaryRequest("save");
};
WorkingDialog.prototype._isSaveAsBlackListed=function(){
return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SAVEAS")||this.isUIBlacklisted("RV_WORKING_DIALOG_SAVEAS")||!this._hasSecondaryRequest("saveAs");
};
WorkingDialog.prototype._isEmailBlackListed=function(){
return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SEND")||this.isUIBlacklisted("RV_WORKING_DIALOG_SEND")||!this._hasSecondaryRequest("email");
};
WorkingDialog.prototype.showCancelButton=function(){
return this.m_bShowCancelButton;
};
WorkingDialog.prototype._hasSecondaryRequest=function(_1d4){
var _1d5=this._getSecondaryRequests();
if(_1d5){
var _1d6=_1d5.length;
for(var i=0;i<_1d6;i++){
if(_1d5[i]==_1d4){
return true;
}
}
}
return false;
};
WorkingDialog.prototype.renderSecondInnerTable=function(){
var _1d8="";
var _1d9=this.getCognosViewer().getWebContentRoot();
_1d8+="<table width=\"300\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">";
_1d8+="<tr id=\"DeliveryOptionsVisible"+this.getNamespace()+"\" class=\"workingDialogOptions\">";
_1d8+="<td align=\"left\">";
_1d8+="<table class=\"workingDialogInnerTable workingDialogLinks\" role=\"presentation\">";
var _1da=this.canShowDeliveryOptions();
if(_1da&&this.deliverySectionIsNeeded()){
if(!this._isSaveBlackListed()){
_1d8+=this.addDeliverOption("/rv/images/action_save_report_output.gif",RV_RES.RV_SAVE_REPORT,"SaveReport(true);");
}
if("reportView"!==this.getCognosViewer().envParams["ui.objectClass"]&&!this._isSaveAsBlackListed()){
_1d8+=this.addDeliverOption("/rv/images/action_save_report_view.gif",RV_RES.RV_SAVE_AS_REPORT_VIEW,"SaveAsReportView(true);");
}
if(!this.isUIBlacklisted("CC_RUN_OPTIONS_EMAIL_ATTACHMENT")&&!this._isEmailBlackListed()){
_1d8+=this.addDeliverOption("/rv/images/action_send_report.gif",RV_RES.RV_EMAIL_REPORT,"SendReport(true);");
}
}
_1d8+="</table></td></tr> ";
_1d8+="<tr style=\"padding-top: 5px\"> ";
_1d8+="<td align=\"left\" colspan=\"3\" id=\"cancelButtonContainer"+this.getNamespace()+"\"> ";
if(this.showCancelButton()){
_1d8+=this.addCancelButton();
}
_1d8+="</td></tr> ";
_1d8+="</table> ";
return _1d8;
};
WorkingDialog.prototype.addDeliverOption=function(_1db,_1dc,_1dd){
var _1de="";
var _1df=this.getCognosViewer().getWebContentRoot();
var _1e0="javascript: window.oCV"+this.getNamespace()+".getRV().";
var _1e1=_1e0+_1dd;
_1de+="<tr><td> ";
_1de+="<a tabIndex=\"-1\" href=\""+_1dd+"\"> ";
_1de+="<img border=\"0\" src=\""+_1df+_1db+"\" alt=\" "+html_encode(_1dc)+"\"/></a> ";
_1de+="</td><td width=\"100%\" valign=\"middle\" class=\"tableText\"> ";
_1de+="<a tabIndex=\"0\" role=\"link\" href=\"#\" onclick=\""+_1e1+"\" style=\"padding-left: 5px\" class=\"deliveryOptionLink\"> ";
_1de+=(_1dc+"</a></td></tr>");
return _1de;
};
WorkingDialog.prototype.addCancelButton=function(){
var _1e2="";
var _1e3=this.getCognosViewer().getWebContentRoot();
_1e2+="<table role=\"presentation\"><tr><td> ";
_1e2+="<table id=\"cvWorkingDialog"+this.getNamespace()+"\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" onmouseover=\"this.className = 'commandButtonOver'\" onmouseout=\"this.className = 'commandButton'\" onmousedown=\"this.className = 'commandButtonDown'\" class=\"commandButton\"> ";
_1e2+="<tr> ";
_1e2+="<td valign=\"middle\" align=\"center\" nowrap=\"nowrap\" class=\"workingDialogCancelButton\" ";
if(isIE()){
_1e2+="id=\"btnAnchorIE\" ";
}else{
_1e2+="id=\"btnAnchor\" ";
}
_1e2+="> ";
var _1e4="window.oCV"+this.m_sNamespace+".cancel(this)";
_1e2+="<a href=\"#\" onclick=\""+_1e4+"\"> ";
_1e2+=RV_RES.CANCEL;
_1e2+="</a> ";
_1e2+="</td></tr></table></td> ";
_1e2+="<td><img alt=\"\" height=\"1\"  ";
if(isIE()){
_1e2+="width=\"10\"  ";
}
_1e2+="src=\""+_1e3+"/ps/images/space.gif\"/></td> ";
_1e2+="</tr></table> ";
return _1e2;
};
WorkingDialog.prototype.disableCancelButton=function(_1e5){
this.cancelButtonDisabled=true;
var _1e6=document.getElementById("cvWorkingDialog"+this.getNamespace());
if(_1e6){
_1e6.style.cursor="default";
_1e6.className="commandButtonOver";
_1e6.removeAttribute("onmouseover");
_1e6.removeAttribute("onmouseout");
}
if(_1e5){
_1e5.removeAttribute("href");
_1e5.removeAttribute("onclick");
_1e5.style.cursor="default";
}
};
WorkingDialog.prototype.enableCancelButton=function(){
if(this.cancelButtonDisabled){
var _1e7=document.getElementById("cancelButtonContainer"+this.getNamespace());
if(_1e7){
_1e7.innerHTML=this.addCancelButton();
}
this.cancelButtonDisabled=false;
}
};
WorkingDialog.prototype.getContainerId=function(){
return "CVWait"+this.getNamespace();
};
function RequestExecutedIndicator(_1e8){
if(_1e8){
RequestExecutedIndicator.baseConstructor.call(this,_1e8);
}
};
RequestExecutedIndicator.baseConstructor=WorkingDialog;
RequestExecutedIndicator.prototype=new WorkingDialog();
RequestExecutedIndicator.prototype.renderHTML=function(){
var _1e9="<table id=\"CVWaitTable"+this.getNamespace()+"\" requestExecutionIndicator=\"true\" class=\"viewerWorkingDialog\" role=\"presentation\">";
_1e9+="<tr><td align=\"center\">";
_1e9+="<div class=\"body_dialog_modal\">";
_1e9+="<table align=\"center\" cellspacing=\"0\" cellpadding=\"0\" style=\"vertical-align:middle; text-align: left;\" role=\"presentation\">";
_1e9+="<tr><td rowspan=\"2\">";
_1e9+="<img alt=\""+RV_RES.GOTO_WORKING+"\" src=\""+this.getCognosViewer().getSkin()+"/branding/progress.gif\" style=\"margin:5px;\" width=\"48\" height=\"48\" name=\"progress\"/>";
_1e9+="</td><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
_1e9+=RV_RES.GOTO_WORKING;
_1e9+="</span></td></tr><tr><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
_1e9+=RV_RES.RV_PLEASE_WAIT;
_1e9+="</span></td></tr><tr><td style=\"height:7px;\" colspan=\"2\"></td></tr></table></div></td></tr></table>";
return _1e9;
};
RequestExecutedIndicator.prototype.getContainerId=function(){
return "CVWaitindicator"+this.getNamespace();
};
function RequestHandler(oCV){
if(oCV){
RequestHandler.baseConstructor.call(this,oCV);
}
};
RequestHandler.prototype=new BaseRequestHandler();
RequestHandler.baseConstructor=BaseRequestHandler;
RequestHandler.prototype.parent=BaseRequestHandler.prototype;
RequestHandler.prototype.resubmitInSafeMode=function(){
this.getViewer().resubmitInSafeMode(this.getDispatcherEntry());
};
RequestHandler.prototype.onComplete=function(_1eb){
this.parent.onComplete.call(this,_1eb);
this.processDATAReportResponse(_1eb);
this.postComplete();
};
RequestHandler.prototype.processInitialResponse=function(_1ec){
this.parent.processInitialResponse.call(this,_1ec);
var oCV=this.getViewer();
var _1ee=oCV.getStatus();
oCV.setMaxContentSize();
var _1ef=(oCV.isWorking(_1ee)||_1ee=="default");
if(_1ef){
if(oCV.getWorkingDialog()){
oCV.getWorkingDialog().show();
}
setTimeout(getCognosViewerObjectRefAsString(oCV.getId())+".executeCallback(\"wait\");",10);
}else{
if(_1ee=="fault"){
oCV.setSoapFault(_1ec.m_sSoapFault);
oCV.executeCallback("fault");
}else{
if(_1ec.status=="cancel"){
oCV.executeCallback("cancel");
}else{
oCV.updateSkipToReportLink();
if(oCV.envParams&&oCV.envParams["pinFreezeInfo"]){
var _1f0=oCV.getPinFreezeManager();
_1f0.fromJSONString(oCV.envParams["pinFreezeInfo"]);
delete oCV.envParams["pinFreezeInfo"];
}
if(_1ee!="prompting"||!oCV.executeCallback("prompt")){
this.postComplete();
}else{
oCV.updateSkipToNavigationLink(true);
}
}
}
}
this.showReport();
this.getViewer().renderTabs();
this.onAsynchStatusUpdate(_1ee);
};
RequestHandler.prototype.postComplete=function(){
this.parent.postComplete.call(this);
var oCV=this.getViewer();
var _1f2=document.getElementById("RVContent"+oCV.getId());
if(_1f2){
_1f2.scrollTop=0;
}
oCV.updateSkipToReportLink();
if(oCV.rvMainWnd){
oCV.updateLayout(oCV.getStatus());
if(!oCV.getUIConfig()||oCV.getUIConfig().getShowToolbar()){
var _1f3=oCV.rvMainWnd.getToolbar();
if(_1f3){
oCV.rvMainWnd.updateToolbar(oCV.outputFormat);
_1f3.draw();
}
}
if(!oCV.getUIConfig()||oCV.getUIConfig().getShowBanner()){
var _1f4=oCV.rvMainWnd.getBannerToolbar();
if(_1f4){
_1f4.draw();
}
}
}
if(oCV.getBrowser()=="moz"){
if(_1f2){
if(oCV.outputFormat=="XML"&&oCV.getStatus()!="prompting"){
_1f2.style.overflow="hidden";
}else{
_1f2.style.overflow="auto";
}
}
}
oCV.gbPromptRequestSubmitted=false;
this.showReport();
if(oCV.getPinFreezeManager()&&oCV.getPinFreezeManager().hasFrozenContainers()){
var _1f5=document.getElementById("CVReport"+oCV.getId());
if(_1f5){
setTimeout(function(){
oCV.getPinFreezeManager().renderReportWithFrozenContainers(_1f5);
if(isIE()){
oCV.repaintDiv(_1f2);
}
},1);
}
}
oCV.setMaxContentSize();
oCV.executeCallback("done");
oCV.doneLoading();
};
function ActionFormFields(_1f6){
this.m_dispatcherEntry=_1f6;
this.m_oCV=_1f6.getViewer();
};
ActionFormFields.prototype.addFormFields=function(){
var _1f7=this.m_dispatcherEntry;
var _1f8=_1f7.getAction();
_1f8.preProcess();
_1f7.addFormField("ui.action","modifyReport");
if(this.m_oCV.getModelPath()!==""){
_1f7.addFormField("modelPath",this.m_oCV.getModelPath());
if(typeof this.m_oCV.envParams["metaDataModelModificationTime"]!="undefined"){
_1f7.addFormField("metaDataModelModificationTime",this.m_oCV.envParams["metaDataModelModificationTime"]);
}
}
if(_1f8.doAddActionContext()===true){
var _1f9=_1f8.addActionContext();
_1f7.addFormField("cv.actionContext",_1f9);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_1f9,"xml");
}
}
var _1fa=this.m_oCV.envParams["bux"]=="true";
if(_1fa){
_1f7.addFormField("cv.showFaultPage","false");
}else{
_1f7.addFormField("cv.showFaultPage","true");
}
_1f7.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_1f7.addDefinedFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_1f7.addDefinedFormField("modelPath",this.m_oCV.envParams["modelPath"]);
_1f7.addDefinedFormField("packageBase",this.m_oCV.envParams["packageBase"]);
_1f7.addDefinedFormField("rap.state",this.m_oCV.envParams["rap.state"]);
_1f7.addDefinedFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
_1f7.addDefinedFormField("ui.primaryAction",this.m_oCV.envParams["ui.primaryAction"]);
_1f7.addNonNullFormField("cv.debugDirectory",this.m_oCV.envParams["cv.debugDirectory"]);
_1f7.addNonNullFormField("ui.objectClass",this.m_oCV.envParams["ui.objectClass"]);
_1f7.addNonNullFormField("bux",this.m_oCV.envParams["bux"]);
_1f7.addNonNullFormField("baseReportModificationTime",this.m_oCV.envParams["baseReportModificationTime"]);
_1f7.addNonNullFormField("originalReport",this.m_oCV.envParams["originalReport"]);
var _1fb=this.m_oCV.getFlashChartOption();
if(_1fb!=null){
_1f7.addFormField("savedFlashChartOption",_1fb);
if(_1fb&&_1f8!=null&&typeof (_1f8.m_requestParams)!="undefined"&&typeof (_1f8.m_requestParams.targetType)!="undefined"){
var _1fc=false;
var _1fd=null;
if(typeof (_1f8.m_requestParams.targetType.targetType)!="undefined"){
_1fd=_1f8.m_requestParams.targetType.targetType;
}else{
_1fd=_1f8.m_requestParams.targetType;
}
if(_1fd.match("v2_")!=null||_1fd.match("_v2")!=null){
_1fc=true;
}else{
var _1fe=this.m_oCV.getRAPReportInfo();
var _1ff=_1f8.getSelectedReportInfo();
if(_1fe&&_1ff){
var _200=_1fe.getDisplayTypes(_1ff.container);
if(_200.match("v2_")!=null||_200.match("_v2")!=null){
_1fc=true;
}
}
}
_1f7.addFormField("hasAVSChart",_1fc);
}else{
_1f7.addFormField("hasAVSChart",this.m_oCV.hasAVSChart());
}
}
var sEP=this.m_oCV.getExecutionParameters();
if(sEP){
_1f7.addFormField("executionParameters",encodeURIComponent(sEP));
}
_1f7.addFormField("ui.conversation",encodeURIComponent(this.m_oCV.getConversation()));
_1f7.addFormField("m_tracking",encodeURIComponent(this.m_oCV.getTracking()));
var sCAF=this.m_oCV.getCAFContext();
if(sCAF){
_1f7.addFormField("ui.cafcontextid",sCAF);
}
if(_1f8.forceRunSpecRequest()){
_1f7.addFormField("widget.forceRunSpec","true");
}
};
function ViewerDispatcher(){
this.m_activeRequest=null;
this.m_requestQueue=[];
this.m_bUsePageRequest=false;
};
ViewerDispatcher.prototype.getActiveRequest=function(){
return this.m_activeRequest;
};
ViewerDispatcher.prototype.setUsePageRequest=function(_203){
this.m_bUsePageRequest=_203;
};
ViewerDispatcher.prototype.getUsePageRequest=function(){
return this.m_bUsePageRequest;
};
ViewerDispatcher.prototype.dispatchRequest=function(_204){
if(this.m_activeRequest==null){
this.startRequest(_204);
}else{
if(_204.canBeQueued()==true){
this.m_requestQueue.push(_204);
}else{
if(window.cognosViewerDebug&&console&&console.warn){
console.warn("Warning! Dropped a dispatcher entry!");
}
}
}
};
ViewerDispatcher.prototype.startRequest=function(_205){
this.m_activeRequest=_205;
if(_205!=null){
_205.setUsePageRequest(this.m_bUsePageRequest);
_205.sendRequest();
}
};
ViewerDispatcher.prototype.cancelRequest=function(key){
for(var i=0;i<this.m_requestQueue.length;i++){
var _208=this.m_requestQueue[i];
if(_208.getKey()===key){
_208.setCallbacks({"onEntryComplete":null});
_208.cancelRequest(false);
this.m_requestQueue.splice(i,1);
i--;
}
}
if(this.m_activeRequest&&this.m_activeRequest.getKey()===key){
this.m_activeRequest.setCallbacks({"onEntryComplete":null});
this.m_activeRequest.cancelRequest(false);
this.requestComplete();
}
};
ViewerDispatcher.prototype.possibleUnloadEvent=function(){
if(this.m_activeRequest){
this.m_activeRequest.possibleUnloadEvent();
}
};
ViewerDispatcher.prototype.requestComplete=function(_209){
this.startRequest(this.nextRequest());
};
ViewerDispatcher.prototype.nextRequest=function(){
var _20a=null;
if(this.m_requestQueue.length>0){
_20a=this.m_requestQueue.shift();
if(_20a.getKey()!=null){
while(this.m_requestQueue.length>0&&this.m_requestQueue[0].getKey()==_20a.getKey()){
_20a=this.m_requestQueue.shift();
}
}
}
return _20a;
};
ViewerDispatcher.prototype.queueIsEmpty=function(){
return (this.m_requestQueue.length==0);
};
function DispatcherEntry(oCV){
this.m_oCV=oCV;
this.m_requestKey=null;
this.m_canBeQueued=false;
this.m_originalFormFields=null;
this.m_bUsePageRequest=false;
if(oCV){
if(!this.m_request){
this.m_request=new XmlHttpObject();
this.m_request.init("POST",this.m_oCV.getGateway(),"",true);
}
if(!this.m_requestHandler){
this.setRequestHandler(new BaseRequestHandler(oCV));
}
DispatcherEntry.prototype.setDefaultFormFields.call(this);
this.setCallbacks({"entryComplete":{"object":this,"method":this.onEntryComplete},"entryFault":{"object":this,"method":this.onEntryFault},"newRequest":{"object":this,"method":this.onNewRequest},"fault":{"object":this,"method":this.onFault},"error":{"object":this,"method":this.onError},"passportTimeout":{"object":this,"method":this.onPassportTimeout},"working":{"object":this,"method":this.onWorking},"prompting":{"object":this,"method":this.onPrompting},"preHttpRequest":{"object":this,"method":this.onPreHttpRequest},"postHttpRequest":{"object":this,"method":this.onPostHttpRequest},"postEntryComplete":{"object":this,"method":this.onPostEntryComplete}});
}
};
DispatcherEntry.prototype.setHeaders=function(_20c){
this.m_request.setHeaders(_20c);
};
DispatcherEntry.prototype.getHeaders=function(){
return this.m_request.getHeaders();
};
DispatcherEntry.prototype.setOriginalFormFields=function(_20d){
this.m_originalFormFields=_20d;
};
DispatcherEntry.prototype.getOriginalFormFields=function(){
return this.m_originalFormFields;
};
DispatcherEntry.prototype.setRequestHandler=function(_20e){
_20e.addCallbackHooks();
this.m_requestHandler=_20e;
};
DispatcherEntry.prototype.getRequestHandler=function(){
return this.m_requestHandler;
};
DispatcherEntry.prototype.setWorkingDialog=function(_20f){
if(this.getRequestHandler()){
this.m_requestHandler.setWorkingDialog(_20f);
}
};
DispatcherEntry.prototype.setRequestIndicator=function(_210){
if(this.getRequestHandler()){
this.getRequestHandler().setRequestIndicator(_210);
}
};
DispatcherEntry.prototype.forceSynchronous=function(){
this.getRequest().forceSynchronous();
};
DispatcherEntry.prototype.setUsePageRequest=function(_211){
this.m_bUsePageRequest=_211;
};
DispatcherEntry.prototype.getUsePageRequest=function(){
return this.m_bUsePageRequest;
};
DispatcherEntry.prototype.setDefaultFormFields=function(){
var _212=this.getViewer().envParams;
this.addFormField("b_action","cognosViewer");
this.addFormField("cv.catchLogOnFault","true");
this.addDefinedNonNullFormField("protectParameters",_212["protectParameters"]);
this.addDefinedNonNullFormField("ui.routingServerGroup",_212["ui.routingServerGroup"]);
this.addDefinedNonNullFormField("cv.debugDirectory",_212["cv.debugDirectory"]);
this.addDefinedNonNullFormField("cv.showFaultPage",_212["cv.showFaultPage"]);
this.addDefinedNonNullFormField("cv.useRAPDrill",_212["cv.useRAPDrill"]);
this.addDefinedNonNullFormField("container",_212["container"]);
this.addNonEmptyStringFormField("cv.objectPermissions",_212["cv.objectPermissions"]);
};
DispatcherEntry.prototype.getViewer=function(){
return this.m_oCV;
};
DispatcherEntry.prototype.prepareRequest=function(){
};
DispatcherEntry.addWidgetInfoToFormFields=function(_213,_214){
if(_213){
var _215=_213.getBUXRTStateInfoMap();
if(_215){
_214.addFormField("cv.buxRTStateInfo",_215);
}
var _216=_213.getDisplayName();
if(_216&&_216.length>0){
_214.addFormField("displayTitle",_216);
}
}
};
DispatcherEntry.prototype.canBeQueued=function(){
return this.m_canBeQueued;
};
DispatcherEntry.prototype.setCanBeQueued=function(_217){
this.m_canBeQueued=_217;
};
DispatcherEntry.prototype.getKey=function(){
return this.m_requestKey;
};
DispatcherEntry.prototype.setKey=function(key){
this.m_requestKey=key;
};
DispatcherEntry.prototype.setRequest=function(_219){
this.m_request=_219;
};
DispatcherEntry.prototype.getRequest=function(){
return this.m_request;
};
DispatcherEntry.prototype.setCallbacks=function(_21a){
this.getRequest().setCallbacks(_21a);
};
DispatcherEntry.prototype.getCallbacks=function(){
return this.getRequest().getCallbacks();
};
DispatcherEntry.prototype.sendRequest=function(){
this.prepareRequest();
var _21b=this.getRequest().getFormFields();
var _21c=_21b.keys();
if(!this.m_originalFormFields){
this.m_originalFormFields=new CDictionary();
for(var _21d=0;_21d<_21c.length;_21d++){
this.m_originalFormFields.add(_21c[_21d],_21b.get(_21c[_21d]));
}
}
this.getRequest().sendRequest();
};
DispatcherEntry.prototype.onNewRequest=function(_21e){
this.setRequest(_21e);
};
DispatcherEntry.prototype.retryRequest=function(){
var oCV=this.getViewer();
oCV.setRetryDispatcherEntry(null);
var _220=this.getRequest().newRequest();
_220.setHeaders(null);
this.setRequest(_220);
var _221=this.m_originalFormFields.keys();
for(var _222=0;_222<_221.length;_222++){
var _223=_221[_222];
var _224=this.m_originalFormFields.get(_223);
if(_223=="cv.responseFormat"&&_224=="iWidget"){
this.addFormField("cv.responseFormat","data");
}else{
if(_223=="ui.action"&&_224=="wait"){
this.addFormField("ui.action",this.m_originalFormFields.get("ui.primaryAction"));
}else{
if(_223!="m_tracking"&&_223!="cv.outputKey"){
this.addFormField(_223,_224);
}
}
}
}
this.addFormField("widget.reloadToolbar","true");
if(this.m_oCV.getViewerWidget()){
this.addFormField("cv.buxCurrentUserRole",this.m_oCV.getViewerWidget().getUserRole());
}
this.addNonEmptyStringFormField("cv.objectPermissions",oCV.envParams["cv.objectPermissions"]);
this.addNonEmptyStringFormField("limitedInteractiveMode",oCV.envParams["limitedInteractiveMode"]);
this.m_oCV.getViewerDispatcher().dispatchRequest(this);
};
DispatcherEntry.prototype.abortHttpRequest=function(){
if(!this.m_bCancelCalled){
if(this.getRequestHandler()){
this.getRequestHandler().onCancel();
}
this.m_bCancelCalled=true;
this.getRequest().abortHttpRequest();
this.onEntryComplete();
}
};
DispatcherEntry.prototype.cancelRequest=function(_225){
if(!this.m_bCancelCalled){
this.m_bCancelCalled=true;
if(this.getRequestHandler()){
this.getRequestHandler().onCancel();
}
if(_225){
this.getRequest().forceSynchronous();
}
this.getRequest().cancel();
this.onEntryComplete();
}
};
DispatcherEntry.prototype.getFormFields=function(){
return this.m_request.getFormFields();
};
DispatcherEntry.prototype.getFormField=function(name){
if(this.m_request){
return this.m_request.getFormField(name);
}else{
return "";
}
};
DispatcherEntry.prototype.clearFormFields=function(){
this.m_request.clearFormFields();
};
DispatcherEntry.prototype.formFieldExists=function(name){
if(this.m_request){
return this.m_request.getFormFields().exists(name);
}
return false;
};
DispatcherEntry.prototype.removeFormField=function(name){
if(this.formFieldExists(name)){
this.m_request.getFormFields().remove(name);
}
};
DispatcherEntry.prototype.addFormField=function(name,_22a){
this.m_request.addFormField(name,_22a);
};
DispatcherEntry.prototype.addDefinedNonNullFormField=function(name,_22c){
if(typeof _22c!="undefined"&&_22c!=null){
this.addFormField(name,_22c);
}
};
DispatcherEntry.prototype.addDefinedFormField=function(name,_22e){
if(typeof _22e!="undefined"){
this.addFormField(name,_22e);
}
};
DispatcherEntry.prototype.addNonNullFormField=function(name,_230){
if(_230!=null){
this.addFormField(name,_230);
}
};
DispatcherEntry.prototype.addNonEmptyStringFormField=function(name,_232){
if(typeof _232!="undefined"&&_232!=null&&_232!=""){
this.addFormField(name,_232);
}
};
DispatcherEntry.prototype.onWorking=function(_233,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onWorking(_233);
}
};
DispatcherEntry.prototype.onFault=function(_235){
if(this.getRequestHandler()){
this.getRequestHandler().onFault(_235);
}
};
DispatcherEntry.prototype.onError=function(_236){
if(this.m_bCancelCalled){
return;
}
if(this.getRequestHandler()){
this.getRequestHandler().onError(_236);
}
};
DispatcherEntry.prototype.possibleUnloadEvent=function(){
this.setCallbacks({"error":{}});
};
DispatcherEntry.prototype.onPreHttpRequest=function(_237){
if(this.getRequestHandler()){
this.getRequestHandler().preHttpRequest(_237);
}
};
DispatcherEntry.prototype.onPostHttpRequest=function(_238){
if(this.getRequestHandler()){
this.getRequestHandler().postHttpRequest(_238);
}
};
DispatcherEntry.prototype.onPassportTimeout=function(_239){
if(this.getRequestHandler()){
this.getRequestHandler().onPassportTimeout(_239);
}
};
DispatcherEntry.prototype.onPrompting=function(_23a){
if(this.getRequestHandler()){
this.getRequestHandler().onPrompting(_23a);
}
};
DispatcherEntry.prototype.onEntryComplete=function(_23b){
if(!this.m_oCV._beingDestroyed){
this.m_oCV.getViewerDispatcher().requestComplete(this);
}
};
DispatcherEntry.prototype.onEntryFault=function(_23c){
this.m_oCV.setFaultDispatcherEntry(this);
this.m_oCV.resetViewerDispatcher();
if(!this.m_bCancelCalled){
this.m_oCV.setRetryDispatcherEntry(this);
}
};
DispatcherEntry.prototype.onCloseErrorDlg=function(){
var _23d=this.getCallbacks();
if(_23d["closeErrorDlg"]){
var _23e=GUtil.generateCallback(_23d["closeErrorDlg"].method,[],_23d["closeErrorDlg"].object);
_23e();
}
};
DispatcherEntry.prototype.onPostEntryComplete=function(){
if(this.getRequestHandler()){
this.getRequestHandler().onPostEntryComplete();
}
this.executeCallback("postComplete");
};
DispatcherEntry.prototype.executeCallback=function(_23f){
var _240=this.getCallbacks();
if(_240[_23f]){
var _241=(_240.customArguments)?[this,_240.customArguments]:[this];
var _242=GUtil.generateCallback(_240[_23f].method,_241,_240[_23f].object);
_242();
return true;
}
return false;
};
function DataDispatcherEntry(oCV){
if(oCV){
this.setRequest(new AsynchDATARequest(oCV.getGateway(),oCV.getWebContentRoot()));
}
DataDispatcherEntry.baseConstructor.call(this,oCV);
};
DataDispatcherEntry.prototype=new DispatcherEntry();
DataDispatcherEntry.baseConstructor=DispatcherEntry;
function JSONDispatcherEntry(oCV){
if(oCV){
this.setRequest(new AsynchJSONRequest(oCV.getGateway(),oCV.getWebContentRoot()));
}
JSONDispatcherEntry.prototype.setDefaultFormFields.call(this);
JSONDispatcherEntry.baseConstructor.call(this,oCV);
};
JSONDispatcherEntry.prototype=new DispatcherEntry();
JSONDispatcherEntry.baseConstructor=DispatcherEntry;
JSONDispatcherEntry.prototype.setDefaultFormFields=function(){
this.addFormField("cv.responseFormat","JSON");
};
function AsynchDataDispatcherEntry(oCV){
if(oCV){
var _246=new AsynchDATARequest(oCV.getGateway(),oCV.getWebContentRoot());
this.setRequest(_246);
AsynchDataDispatcherEntry.baseConstructor.call(this,oCV);
AsynchDataDispatcherEntry.prototype.setDefaultFormFields.call(this);
}
};
AsynchDataDispatcherEntry.prototype=new DispatcherEntry();
AsynchDataDispatcherEntry.baseConstructor=DispatcherEntry;
AsynchDataDispatcherEntry.prototype.setDefaultFormFields=function(){
this.addFormField("cv.responseFormat","data");
};
function AsynchJSONDispatcherEntry(oCV){
if(oCV){
var _248=new AsynchJSONRequest(oCV.getGateway(),oCV.getWebContentRoot());
this.setRequest(_248);
AsynchJSONDispatcherEntry.baseConstructor.call(this,oCV);
AsynchJSONDispatcherEntry.prototype.setDefaultFormFields.call(this);
}
};
AsynchJSONDispatcherEntry.prototype=new DispatcherEntry();
AsynchJSONDispatcherEntry.baseConstructor=DispatcherEntry;
AsynchJSONDispatcherEntry.prototype.setDefaultFormFields=function(){
this.addFormField("cv.responseFormat","asynchJSON");
};
function ReportDispatcherEntry(oCV){
ReportDispatcherEntry.baseConstructor.call(this,oCV);
if(oCV){
ReportDispatcherEntry.prototype.setDefaultFormFields.call(this);
this.setRequestHandler(new RequestHandler(oCV));
this.setWorkingDialog(oCV.getWorkingDialog());
this.setRequestIndicator(oCV.getRequestIndicator());
this.setCallbacks({"complete":{"object":this,"method":this.onComplete},"prompting":{"object":this,"method":this.onComplete}});
}
};
ReportDispatcherEntry.prototype=new AsynchDataDispatcherEntry();
ReportDispatcherEntry.baseConstructor=AsynchDataDispatcherEntry;
ReportDispatcherEntry.prototype.parent=AsynchDataDispatcherEntry.prototype;
ReportDispatcherEntry.prototype.prepareRequest=function(){
var _24a=this.getFormField("ui.action");
var _24b=this.getViewer().getActionState();
if(_24b!==""&&(_24a=="wait"||_24a=="forward"||_24a=="back")){
this.addFormField("cv.actionState",_24b);
}
var _24c=["nextPage","previousPage","firstPage","lastPage","reportAction","cancel","wait"];
var _24d=true;
for(var i=0;i<_24c.length;i++){
if(_24c[i]==_24a){
_24d=false;
break;
}
}
if(_24d){
this.getViewer().clearTabs();
}
if(this.getViewer().getCurrentlySelectedTab()&&!this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")){
this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",this.getViewer().getCurrentlySelectedTab());
}
};
ReportDispatcherEntry.prototype.setDefaultFormFields=function(){
var oCV=this.getViewer();
var _250=oCV.envParams;
this.addFormField("cv.id",oCV.getId());
if(_250["cv.showFaultPage"]){
this.addFormField("cv.showFaultPage",_250["cv.showFaultPage"]);
}else{
this.addFormField("cv.showFaultPage","false");
}
this.addDefinedNonNullFormField("ui.object",_250["ui.object"]);
this.addDefinedNonNullFormField("ui.primaryAction",_250["ui.primaryAction"]);
this.addDefinedNonNullFormField("ui.objectClass",_250["ui.objectClass"]);
this.addNonEmptyStringFormField("specificationType",_250["specificationType"]);
this.addNonEmptyStringFormField("cv.promptForDownload",_250["cv.promptForDownload"]);
this.addNonEmptyStringFormField("ui.conversation",oCV.getConversation());
this.addNonEmptyStringFormField("m_tracking",oCV.getTracking());
var _251=oCV.getExecutionParameters();
this.addNonEmptyStringFormField("executionParameters",_251);
var sCAF=oCV.getCAFContext();
this.addDefinedNonNullFormField("ui.cafcontextid",sCAF);
};
ReportDispatcherEntry.prototype.onWorking=function(_253,arg1){
var _255=_253.getResponseState();
var _256=this.getRequestHandler();
if(_256){
var _257=_256.getWorkingDialog();
if(_257&&_257.setSecondaryRequests&&_255.m_aSecRequests){
_257.setSecondaryRequests(_255.m_aSecRequests);
}
}
DispatcherEntry.prototype.onWorking.call(this,_253,arg1);
if(_256){
this.getRequestHandler().updateViewerState(_255);
}
};
ReportDispatcherEntry.prototype.onComplete=function(_258,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onComplete(_258);
}
};
function ViewerDispatcherEntry(oCV){
ViewerDispatcherEntry.baseConstructor.call(this,oCV);
if(oCV){
ViewerDispatcherEntry.prototype.setDefaultFormFields.call(this);
this.setCallbacks({"complete":{"object":this,"method":this.onComplete},"prompting":{"object":this,"method":this.onPrompting},"cancel":{"object":this,"method":this.onCancel}});
}
};
ViewerDispatcherEntry.prototype=new ReportDispatcherEntry();
ViewerDispatcherEntry.baseConstructor=ReportDispatcherEntry;
ViewerDispatcherEntry.prototype.parent=ReportDispatcherEntry.prototype;
ViewerDispatcherEntry.prototype.setDefaultFormFields=function(){
var oCV=this.getViewer();
var _25c=oCV.envParams;
this.addFormField("cv.showFaultPage","true");
this.addDefinedNonNullFormField("cv.header",_25c["cv.header"]);
this.addDefinedNonNullFormField("cv.toolbar",_25c["cv.toolbar"]);
this.addDefinedNonNullFormField("ui.backURL",_25c["ui.backURL"]);
this.addDefinedNonNullFormField("errURL",_25c["ui.backURL"]);
this.addDefinedNonNullFormField("errURL",_25c["ui.errURL"]);
this.addDefinedNonNullFormField("cv.catchLogOnFault","true");
this.addDefinedNonNullFormField("m_sessionConv",_25c["m_sessionConv"]);
if(_25c["m_session"]){
this.addFormField("m_session",_25c["m_session"]);
this.addFormField("cv.ignoreState","true");
}
};
ViewerDispatcherEntry.prototype.prepareRequest=function(){
this.parent.prepareRequest.call(this);
if(this.getUsePageRequest()){
this.m_oCV.setKeepSessionAlive(true);
if(typeof this.m_oCV.envParams["cv.responseFormat"]!="undefined"&&this.m_oCV.envParams["cv.responseFormat"]!=null&&this.m_oCV.envParams["cv.responseFormat"]!=""){
this.addFormField("cv.responseFormat",this.m_oCV.envParams["cv.responseFormat"]);
}else{
if(this.getFormField("cv.responseFormat")!="view"){
this.addFormField("cv.responseFormat","page");
}
}
var _25d=this.m_oCV.getPinFreezeManager();
if(_25d&&_25d.hasFrozenContainers()){
this.addFormField("pinFreezeInfo",_25d.toJSONString());
}
}
};
ViewerDispatcherEntry.prototype.sendRequest=function(){
if(this.getUsePageRequest()){
this.prepareRequest();
var _25e=this.buildRequestForm();
if(typeof document.progress!="undefined"){
setTimeout("document.progress.src=\""+this.m_oCV.getSkin()+"/branding/progress.gif"+"\";",1);
}
_25e.submit();
}else{
this.getViewer().closeContextMenuAndToolbarMenus();
this.parent.sendRequest.call(this);
}
};
ViewerDispatcherEntry.prototype.buildRequestForm=function(){
var oCV=this.getViewer();
var _260=document.createElement("form");
_260.setAttribute("id","requestForm");
_260.setAttribute("name","requestForm");
_260.setAttribute("method","post");
_260.setAttribute("target","_self");
_260.setAttribute("action",oCV.getGateway());
_260.style.display="none";
document.body.appendChild(_260);
var _261=this.getRequest().getFormFields();
var _262=_261.keys();
for(var _263=0;_263<_262.length;_263++){
_260.appendChild(this.createHiddenFormField(_262[_263],_261.get(_262[_263])));
}
for(param in oCV.envParams){
if(!_261.exists(param)&&param!="cv.actionState"){
_260.appendChild(this.createHiddenFormField(param,oCV.envParams[param]));
}
}
return _260;
};
ViewerDispatcherEntry.prototype.createHiddenFormField=function(name,_265){
var _266=document.createElement("input");
_266.setAttribute("type","hidden");
_266.setAttribute("name",name);
_266.setAttribute("id",name);
_266.setAttribute("value",_265);
return (_266);
};
ViewerDispatcherEntry.prototype.onCancel=function(){
var oCV=this.getViewer();
oCV.setStatus("complete");
if(this.getUsePageRequest()||!oCV.isReportRenderingDone()){
oCV.executeCallback("cancel");
}
};
ViewerDispatcherEntry.prototype.onFault=function(_268){
if(this.getViewer().callbackExists("fault")){
this.getViewer().setSoapFault(_268.getSoapFault());
this.getViewer().executeCallback("fault");
}else{
this.parent.onFault.call(this,_268);
}
};
ViewerDispatcherEntry.prototype.onComplete=function(_269){
var oCV=this.getViewer();
oCV.saveBackJaxInformation(_269);
if(oCV.isReportRenderingDone()){
this.getViewer().getSelectionController().resetSelections();
}
this.parent.onComplete.call(this,_269);
};
ViewerDispatcherEntry.prototype.onPrompting=function(_26b){
var oCV=this.getViewer();
oCV.updateSkipToNavigationLink(true);
if(!oCV.executeCallback("prompt")){
this.onComplete(_26b);
}
};
ViewerDispatcherEntry.prototype.onEntryComplete=function(_26d){
if(this.getRequestHandler()){
this.getRequestHandler().setDispatcherEntry(this);
}
this.parent.onEntryComplete.call(this,_26d);
};

