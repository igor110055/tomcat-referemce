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
 function CViewerHelper(){
this.m_oCV=null;
};
CViewerHelper.prototype.getCVObjectRef=function(){
return this.getCV().getObjectId();
};
CViewerHelper.prototype.getCV=function(){
if(this.m_oCV){
return this.m_oCV;
}
return window;
};
CViewerHelper.prototype.getCVId=function(){
var _1="";
if(this.m_oCV){
_1=this.m_oCV.getId();
}
return _1;
};
CViewerHelper.prototype.setCV=function(_2){
this.m_oCV=_2;
};
function CObserver(_3){
this.m_subject=_3;
this.m_observers=[];
};
function CObserver_attach(_4,_5,_6){
if(_4==null||typeof _4.update!="function"){
alert("Notification Frame Work Error : attach failed");
return false;
}
var _7=new CState(this.m_subject,_4,_5?_5:null,_6?_6:null);
this.m_observers[this.m_observers.length]=_7;
return true;
};
function CObserver_detach(_8){
};
function CObserver_hasObserver(_9){
var _a=false;
for(var _b=0;_b<this.m_observers.length;_b++){
if(this.m_observers[_b].getObserver()==_9){
_a=true;
break;
}
}
return _a;
};
function CObserver_notify(_c){
var i=0;
if(typeof _c!="undefined"&&_c!=null){
for(i=0;i<this.m_observers.length;++i){
if(this.m_observers[i].getEvt()==_c){
var _e=this.m_observers[i].getObserver();
var _f=this.m_observers[i].getCallback();
var _10=_e.update;
_e.update=_f;
_e.update(this.m_observers[i]);
_e.update=_10;
}
}
}else{
for(i=0;i<this.m_observers.length;++i){
this.m_observers[i].getObserver().update(this.m_observers[i].getSubject());
}
}
};
CObserver.prototype.attach=CObserver_attach;
CObserver.prototype.detach=CObserver_detach;
CObserver.prototype.notify=CObserver_notify;
CObserver.prototype.hasObserver=CObserver_hasObserver;
function CState(_11,_12,_13,evt){
this.m_subject=_11;
this.m_observer=_12;
this.m_callback=_13;
this.m_evt=evt;
};
function CState_getObserver(){
return this.m_observer;
};
function CState_getCallback(){
return this.m_callback;
};
function CState_getSubject(){
return this.m_subject;
};
function CState_getEvt(){
return this.m_evt;
};
CState.prototype.getObserver=CState_getObserver;
CState.prototype.getCallback=CState_getCallback;
CState.prototype.getSubject=CState_getSubject;
CState.prototype.getEvt=CState_getEvt;
function CParameterValueStringOperators(_15,_16,_17,_18){
this.m_sBetween=_15;
this.m_sNotBetween=_16;
this.m_sLessThan=_17;
this.m_sGreaterThan=_18;
};
function CParameterValues(){
this.m_parameterValues=new CDictionary();
};
CParameterValues.prototype.length=function(){
var _19=this.m_parameterValues.keys();
if(typeof _19=="undefined"||_19==null){
return 0;
}
return _19.length;
};
CParameterValues.prototype.getParameterValue=function(_1a){
if(typeof _1a!="string"||_1a==""){
return null;
}
if(this.m_parameterValues.exists(_1a)){
return this.m_parameterValues.get(_1a);
}
return null;
};
CParameterValues.prototype.getAt=function(_1b){
if(_1b<this.length()){
var _1c=this.m_parameterValues.keys();
if(this.m_parameterValues.exists(_1c[_1b])){
return this.m_parameterValues.get(_1c[_1b]);
}
}
return null;
};
CParameterValues.prototype.addParameterValue=function(_1d,_1e){
var _1f=this.getParameterValue(_1d);
if(_1f==null){
_1f=new CParameterValue();
_1f.setName(_1d);
}
_1f.addParmValueItem(_1e);
this.m_parameterValues.add(_1d,_1f);
};
CParameterValues.prototype.removeParameterValue=function(_20){
return (this.m_parameterValues.remove(_20)!=null);
};
CParameterValues.prototype.removeSimpleParmValueItem=function(_21,_22){
var _23=this.getParameterValue(_21);
if(_23==null){
return false;
}
return _23.removeSimpleParmValueItem(_22);
};
CParameterValues.prototype.addSimpleParmValueItem=function(_24,_25,_26,_27){
if(typeof _24!="string"||_24==""){
return null;
}
if(typeof _25!="string"||_25==""){
return null;
}
if(typeof _26!="string"){
return null;
}
if(typeof _27!="string"||(_27!="false"&&_27!="true")){
return null;
}
var _28=null;
if(this.m_parameterValues.exists(_24)==false){
_28=new CParameterValue(_24);
this.m_parameterValues.add(_24,_28);
}
_28=this.m_parameterValues.get(_24);
if(typeof _28=="undefined"||_28==null){
return null;
}
var _29=_28.getParmValueItems();
for(var _2a=0;_2a<_29.length;++_2a){
var _2b=_29[_2a];
if(_2b.getDisplayValue()==_26&&_2b.getUseValue()==_25){
return;
}
}
return _28.addSimpleParmValueItem(_25,_26,_27);
};
CParameterValues.prototype.getSimpleParmValueItem=function(_2c,_2d){
var _2e=this.getParameterValue(_2c);
if(_2e!=null){
return _2e.getSimpleParmValueItem(_2d);
}
return null;
};
CParameterValues.prototype.load=function(_2f){
return this.loadWithOptions(_2f,true);
};
CParameterValues.prototype.loadWithOptions=function(_30,_31){
try{
var _32=_30.childNodes;
for(var _33=0;_33<_32.length;++_33){
var _34=_32[_33];
if(_34.nodeType==3){
continue;
}
var _35=new CParameterValue();
if(_35.load(_34)){
var _36=_35.name();
if(_36!=""){
if(_31==true||_36.indexOf("credential:")!=0){
this.m_parameterValues.add(_36,_35);
}
}
}else{
delete _35;
}
}
}
catch(e){
return false;
}
return true;
};
CParameterValues.prototype.buildXML=function(_37,_38,_39){
var _3a=_38.createElement(_39);
_37.XMLBuilderSetAttributeNodeNS(_3a,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
_37.XMLBuilderSetAttributeNodeNS(_3a,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
_37.XMLBuilderSetAttributeNodeNS(_3a,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
_37.XMLBuilderSetAttributeNodeNS(_3a,"xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
_37.XMLBuilderSetAttributeNodeNS(_3a,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
_37.XMLBuilderSetAttributeNodeNS(_3a,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_38.documentElement.appendChild(_3a);
var _3b=this.m_parameterValues.keys();
for(var _3c=0;_3c<_3b.length;++_3c){
if(this.m_parameterValues.exists(_3b[_3c])){
var _3d=this.m_parameterValues.get(_3b[_3c]);
_3d.generateXML(_37,_3a);
}
}
return _3a;
};
CParameterValues.prototype.generateXML=function(_3e,_3f,_40){
var _41="parameterValues";
if(typeof _40!="undefined"&&_40!=null){
_41=_40;
}
XMLBuilderSerializeNode(this.buildXML(_3e,_3f,_41));
return XMLBuilderSerializeNode(_3f);
};
function CParameterValue(_42){
this.m_name=_42;
this.m_parmValueItems=[];
};
CParameterValue.prototype.name=function(){
return this.m_name;
};
CParameterValue.prototype.setName=function(_43){
this.m_name=_43;
};
CParameterValue.prototype.getParmValueItems=function(){
return this.m_parmValueItems;
};
CParameterValue.prototype.length=function(){
return this.m_parmValueItems.length;
};
CParameterValue.prototype.addParmValueItem=function(_44){
this.m_parmValueItems.push(_44);
};
CParameterValue.prototype.addSimpleParmValueItem=function(_45,_46,_47){
if(typeof _45!="string"||_45==""){
return null;
}
if(typeof _46!="string"){
return null;
}
if(typeof _47!="string"||(_47!="false"&&_47!="true")){
return null;
}
var _48=new CSimpleParmValueItem(_45,_46,_47);
this.m_parmValueItems.push(_48);
return _48;
};
CParameterValue.prototype.removeSimpleParmValueItem=function(_49){
if(typeof _49!="string"||_49==""){
return false;
}
var _4a=[];
var _4b=false;
for(var _4c=0;_4c<this.length();++_4c){
var _4d=this.m_parmValueItems[_4c];
if(_4d instanceof CSimpleParmValueItem){
if(_4d.getUseValue()==_49){
_4b=true;
continue;
}
}
_4a.push(_4d);
}
this.m_parmValueItems=_4a;
return _4b;
};
CParameterValue.prototype.getSimpleParmValueItem=function(_4e){
if(typeof _4e!="string"||_4e==""){
return null;
}
for(var _4f=0;_4f<this.length();++_4f){
var _50=this.m_parmValueItems[_4f];
if(_50 instanceof CSimpleParmValueItem){
if(_50.getUseValue()==_4e){
return _50;
}
}
}
return null;
};
CParameterValue.prototype.load=function(_51){
var _52=_51.getAttributeNode("xsi:type");
if(_52==null||_52.nodeValue!="bus:parameterValue"){
return false;
}
var _53=XMLHelper_FindChildByTagName(_51,"name",false);
if(_53==null){
return false;
}
this.m_name=XMLHelper_GetText(_53);
if(this.m_name==""){
return false;
}
var _54=XMLHelper_FindChildByTagName(_51,"value",false);
if(_54==null){
return false;
}
var _55=_54.getAttributeNode("xsi:type");
if(_55==null||_55.nodeValue!="SOAP-ENC:Array"){
return false;
}
var _56=_54.getAttributeNode("SOAP-ENC:arrayType");
if(_56==null||_56.nodeValue.indexOf("bus:parmValueItem[")==-1){
return false;
}
var _57=_54.childNodes;
for(var _58=0;_58<_57.length;++_58){
var _59=_57[_58];
if(_59.nodeType==3){
continue;
}
var _5a=_59.getAttributeNode("xsi:type");
if(_5a!=null){
var _5b;
var _5c;
switch(_5a.nodeValue){
case "bus:simpleParmValueItem":
_5b=new CSimpleParmValueItem("","","");
break;
case "bus:boundRangeParmValueItem":
_5b=new CBoundRangeParmValueItem();
break;
case "bus:unboundedEndRangeParmValueItem":
_5b=new CUnboundedEndRangeParmValueItem();
break;
case "bus:unboundedStartRangeParmValueItem":
_5b=new CUnboundedStartRangeParmValueItem();
break;
case "bus:hierarchicalParmValueItem":
_5b=new CHierarchicalParmValueItem();
break;
default:
return false;
}
_5c=_5b.load(_59);
if(_5c){
this.m_parmValueItems.push(_5b);
}else{
delete _5b;
}
}
}
return true;
};
CParameterValue.prototype.generateXML=function(_5d,_5e){
var _5f=_5e.ownerDocument;
var _60=_5f.createElement("item");
_5d.XMLBuilderSetAttributeNodeNS(_60,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
_5e.appendChild(_60);
var _61=_5d.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",_5f);
_5d.XMLBuilderSetAttributeNodeNS(_61,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_61.appendChild(_5f.createTextNode(this.m_name));
_60.appendChild(_61);
var _62=_5d.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",_5f);
_5d.XMLBuilderSetAttributeNodeNS(_62,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
_5d.XMLBuilderSetAttributeNodeNS(_62,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_60.appendChild(_62);
for(var _63=0;_63<this.m_parmValueItems.length;++_63){
if(typeof this.m_parmValueItems[_63].generateXML!="undefined"){
this.m_parmValueItems[_63].generateXML(_5d,_62);
}
}
};
CParameterValue.prototype.toString=function(_64){
var _65="";
for(var _66=0;_66<this.m_parmValueItems.length;++_66){
if(_65!=""){
_65+=", ";
}
if(typeof this.m_parmValueItems[_66].toString!="undefined"){
_65+=this.m_parmValueItems[_66].toString(_64);
}
}
return _65;
};
function CParmValueItem(){
this.initialize("true");
};
CParmValueItem.prototype.getInclusiveValue=function(){
return this.m_inclusiveValue;
};
CParmValueItem.prototype.setInclusiveValue=function(_67){
this.m_inclusiveValue=_67;
};
CParmValueItem.prototype.initialize=function(_68){
this.m_inclusiveValue=_68;
};
CParmValueItem.prototype.load=function(_69){
this.m_inclusiveValue="true";
var _6a=XMLHelper_FindChildByTagName(_69,"inclusive",false);
if(_6a!=null){
var _6b=XMLHelper_GetText(_6a);
if(_6b=="true"||_6b=="false"){
this.m_inclusiveValue=_6b;
}
}
};
CParmValueItem.prototype.generateXML=function(_6c,_6d){
var _6e=_6d.ownerDocument;
var _6f=_6c.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:inclusive",_6e);
_6c.XMLBuilderSetAttributeNodeNS(_6f,"xsi:type","xs:boolean","http://www.w3.org/2001/XMLSchema-instance");
_6f.appendChild(_6e.createTextNode(this.m_inclusiveValue));
_6d.appendChild(_6f);
};
function CSimpleParmValueItem(_70,_71,_72){
CSimpleParmValueItem.baseclass.initialize.call(this,_72);
this.m_useValue=_70;
this.m_displayValue=_71;
};
CSimpleParmValueItem.prototype=new CParmValueItem();
CSimpleParmValueItem.prototype.constructor=CSimpleParmValueItem;
CSimpleParmValueItem.baseclass=CParmValueItem.prototype;
CSimpleParmValueItem.prototype.getUseValue=function(){
return this.m_useValue;
};
CSimpleParmValueItem.prototype.getDisplayValue=function(){
return this.m_displayValue;
};
CSimpleParmValueItem.prototype.getParmValueItem=function(){
return this.m_parmValueItem;
};
CSimpleParmValueItem.prototype.setDisplayValue=function(_73){
this.m_displayValue=_73;
};
CSimpleParmValueItem.prototype.setUseValue=function(_74){
this.m_useValue=_74;
};
CSimpleParmValueItem.prototype.toString=function(_75){
return this.getDisplayValue();
};
CSimpleParmValueItem.prototype.load=function(_76){
CSimpleParmValueItem.baseclass.load.call(this,_76);
var _77=XMLHelper_FindChildByTagName(_76,"use",false);
if(_77==null){
return false;
}
var _78=XMLHelper_GetText(_77);
if(_78==""){
return false;
}
this.m_useValue=_78;
var _79=XMLHelper_FindChildByTagName(_76,"display",false);
if(_79!=null){
this.m_displayValue=XMLHelper_GetText(_79);
}
return true;
};
CSimpleParmValueItem.prototype.generateXML=function(_7a,_7b){
var _7c=_7b.ownerDocument;
var _7d=_7c.createElement("item");
_7a.XMLBuilderSetAttributeNodeNS(_7d,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_7b.appendChild(_7d);
CSimpleParmValueItem.baseclass.generateXML.call(this,_7a,_7d);
var _7e=_7a.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",_7c);
_7a.XMLBuilderSetAttributeNodeNS(_7e,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_7e.appendChild(_7c.createTextNode(this.m_useValue));
_7d.appendChild(_7e);
var _7f=_7a.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",_7c);
_7a.XMLBuilderSetAttributeNodeNS(_7f,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_7f.appendChild(_7c.createTextNode(this.m_displayValue));
_7d.appendChild(_7f);
};
function CBoundRangeParmValueItem(){
CBoundRangeParmValueItem.baseclass.initialize.call(this,"true");
this.m_start=null;
this.m_end=null;
};
CBoundRangeParmValueItem.prototype=new CParmValueItem();
CBoundRangeParmValueItem.prototype.constructor=CBoundRangeParmValueItem;
CBoundRangeParmValueItem.baseclass=CParmValueItem.prototype;
CBoundRangeParmValueItem.prototype.setStart=function(_80){
this.m_start=_80;
};
CBoundRangeParmValueItem.prototype.getStart=function(){
return this.m_start;
};
CBoundRangeParmValueItem.prototype.setEnd=function(end){
this.m_end=end;
};
CBoundRangeParmValueItem.prototype.getEnd=function(){
return this.m_end;
};
CBoundRangeParmValueItem.prototype.toString=function(_82){
return CViewerCommon.getMessage(_82.m_sBetween,[this.m_start.getDisplayValue(),this.m_end.getDisplayValue()]);
};
CBoundRangeParmValueItem.prototype.load=function(_83){
CBoundRangeParmValueItem.baseclass.load.call(this,_83);
this.m_start=new CSimpleParmValueItem("","","");
this.m_start.load(XMLHelper_FindChildByTagName(_83,"start",false));
this.m_end=new CSimpleParmValueItem("","","");
this.m_end.load(XMLHelper_FindChildByTagName(_83,"end",false));
return true;
};
CBoundRangeParmValueItem.prototype.generateXML=function(_84,_85){
var _86=_85.ownerDocument;
var _87=_86.createElement("item");
_84.XMLBuilderSetAttributeNodeNS(_87,"xsi:type","bus:boundRangeParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_85.appendChild(_87);
CBoundRangeParmValueItem.baseclass.generateXML.call(this,_84,_87);
var _88=_84.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:start",_86);
_87.appendChild(_88);
this.m_start.generateXML(_84,_88);
var _89=_84.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:end",_86);
_87.appendChild(_89);
this.m_end.generateXML(_84,_89);
};
function CUnboundedStartRangeParmValueItem(){
CUnboundedStartRangeParmValueItem.baseclass.initialize.call(this,"true");
this.m_end=null;
};
CUnboundedStartRangeParmValueItem.prototype=new CParmValueItem();
CUnboundedStartRangeParmValueItem.prototype.constructor=CUnboundedStartRangeParmValueItem;
CUnboundedStartRangeParmValueItem.baseclass=CParmValueItem.prototype;
CUnboundedStartRangeParmValueItem.prototype.setEnd=function(end){
this.m_end=end;
};
CUnboundedStartRangeParmValueItem.prototype.getEnd=function(){
return this.m_end;
};
CUnboundedStartRangeParmValueItem.prototype.load=function(_8b){
CUnboundedStartRangeParmValueItem.baseclass.load.call(this,_8b);
this.m_end=new CSimpleParmValueItem("","","");
this.m_end.load(XMLHelper_FindChildByTagName(_8b,"end",false));
return true;
};
CUnboundedStartRangeParmValueItem.prototype.generateXML=function(_8c,_8d){
var _8e=_8d.ownerDocument;
var _8f=_8e.createElement("item");
_8c.XMLBuilderSetAttributeNodeNS(_8f,"xsi:type","bus:unboundedStartRangeParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_8d.appendChild(_8f);
CUnboundedStartRangeParmValueItem.baseclass.generateXML.call(this,_8c,_8f);
var _90=_8c.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:end",_8e);
_8f.appendChild(_90);
this.m_end.generateXML(_8c,_90);
};
CUnboundedStartRangeParmValueItem.prototype.toString=function(_91){
return _91.m_sLessThan+" "+this.m_end.getDisplayValue();
};
function CUnboundedEndRangeParmValueItem(){
CUnboundedEndRangeParmValueItem.baseclass.initialize.call(this,"true");
this.m_start=null;
};
CUnboundedEndRangeParmValueItem.prototype=new CParmValueItem();
CUnboundedEndRangeParmValueItem.prototype.constructor=CUnboundedEndRangeParmValueItem;
CUnboundedEndRangeParmValueItem.baseclass=CParmValueItem.prototype;
CUnboundedEndRangeParmValueItem.prototype.setStart=function(_92){
this.m_start=_92;
};
CUnboundedEndRangeParmValueItem.prototype.getStart=function(){
return this.m_start;
};
CUnboundedEndRangeParmValueItem.prototype.load=function(_93){
CUnboundedEndRangeParmValueItem.baseclass.load.call(this,_93);
this.m_start=new CSimpleParmValueItem("","","");
this.m_start.load(XMLHelper_FindChildByTagName(_93,"start",false));
return true;
};
CUnboundedEndRangeParmValueItem.prototype.generateXML=function(_94,_95){
var _96=_95.ownerDocument;
var _97=_96.createElement("item");
_94.XMLBuilderSetAttributeNodeNS(_97,"xsi:type","bus:unboundedEndRangeParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_95.appendChild(_97);
CUnboundedEndRangeParmValueItem.baseclass.generateXML.call(this,_94,_97);
var _98=_94.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:start",_96);
_97.appendChild(_98);
this.m_start.generateXML(_94,_98);
};
CUnboundedEndRangeParmValueItem.prototype.toString=function(_99){
return _99.m_sGreaterThan+" "+this.m_start.getDisplayValue();
};
function CHierarchicalParmValueItem(){
CHierarchicalParmValueItem.baseclass.initialize.call(this,"true");
this.m_value=null;
this.m_subNodes=[];
};
CHierarchicalParmValueItem.prototype=new CParmValueItem();
CHierarchicalParmValueItem.prototype.constructor=CHierarchicalParmValueItem;
CHierarchicalParmValueItem.baseclass=CParmValueItem.prototype;
CHierarchicalParmValueItem.prototype.getValue=function(){
return this.m_value;
};
CHierarchicalParmValueItem.prototype.getSubNodes=function(){
return this.m_subNodes;
};
CHierarchicalParmValueItem.prototype.setValue=function(_9a){
this.m_value=_9a;
};
CHierarchicalParmValueItem.prototype.setSubNodes=function(_9b){
this.m_subNodes=_9b;
};
CHierarchicalParmValueItem.prototype.load=function(_9c){
CHierarchicalParmValueItem.baseclass.load.call(this,_9c);
this.m_value=new CSimpleParmValueItem("","","");
this.m_value.load(XMLHelper_FindChildByTagName(_9c,"value",false));
var _9d=XMLHelper_FindChildByTagName(_9c,"subNodes",false);
if(_9d==null){
return false;
}
var _9e=_9d.getAttributeNode("xsi:type");
if(_9e==null||_9e.nodeValue!="SOAP-ENC:Array"){
return false;
}
var _9f=_9d.getAttributeNode("SOAP-ENC:arrayType");
if(_9f==null||_9f.nodeValue!="bus:hierarchicalParmValueItem[]"){
return false;
}
var _a0=_9d.childNodes;
for(var _a1=0;_a1<_a0.length;++_a1){
var _a2=new CHierarchicalParmValueItem();
_a2.load(_a0[_a1]);
this.m_subNodes.push(_a2);
}
return true;
};
CHierarchicalParmValueItem.prototype.generateXML=function(_a3,_a4){
var _a5=_a4.ownerDocument;
var _a6=_a5.createElement("item");
_a3.XMLBuilderSetAttributeNodeNS(_a6,"xsi:type","bus:hierarchicalParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_a4.appendChild(_a6);
CHierarchicalParmValueItem.baseclass.generateXML.call(this,_a3,_a6);
var _a7=_a3.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",_a5);
_a6.appendChild(_a7);
this.m_value.generateXML(_a3,_a7);
var _a8=_a3.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:subNodes",_a5);
_a3.XMLBuilderSetAttributeNodeNS(_a8,"SOAP-ENC:arrayType","bus:hierarchicalParmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
_a3.XMLBuilderSetAttributeNodeNS(_a8,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_a6.appendChild(_a8);
for(var _a9=0;_a9<this.m_subNodes.length;++_a9){
this.m_subNodes[_a9].generateXML(_a3,_a8);
}
};
CHierarchicalParmValueItem.prototype.toString=function(){
return "";
};
function XMLParser(s,_ab){
if(s==null){
return null;
}
if(/^\s*</.test(s)){
s=s.replace(/^\s*/,"");
if(s.charAt(1)=="/"){
var _ac=new RegExp("^</"+_ab.getName()+"\\s*>","gi");
if(!_ac.test(s)){
alert("invalid XML "+_ab.getName()+"\n"+s);
return null;
}
return XMLParser(s.replace(RegExp.lastMatch,""),_ab.parentNode);
}else{
var _ad=/^\s*<([\w:\-_\.]+)/;
if(_ad.test(s)){
var _ae=RegExp.$1;
var e=new XMLElement(_ae,_ab);
var _b0=new RegExp("^<"+_ae+"[^>]*>");
s=s.replace(_b0,"");
var _b1=RegExp.lastMatch;
var _b2=/([\w:\-_\.]+)="([^"]*)"/gi;
var _b3=_b1.match(_b2);
if(_b3!=null){
for(var i=0;i<_b3.length;i++){
var _b5=_b3[i];
(/([\w:\-_\.]+)\s*=\s*"(.*)"/).test(_b5);
e.setAttribute(RegExp.$1,RegExp.$2);
}
}
if(!(/\/>$/).test(_b1)){
XMLParser(s,e);
return e;
}else{
XMLParser(s,_ab);
return e;
}
}
}
}else{
if(s&&_ab){
var _b6=new RegExp("([^<]*)</"+_ab.getName()+"\\s*[^>]*>","gi");
_b6.test(s);
var _b7=RegExp.$1;
_ab.setValue(_b7);
return (XMLParser(s.replace(_b7,""),_ab));
}
}
return null;
};
function XMLElement(s,_b9){
this.nodeName=s;
this.nodeValue="";
this.attributes=[];
this.childNodes=[];
this.parentNode=_b9;
if(this.parentNode){
this.parentNode.appendChild(this);
}
};
XMLElement.prototype.appendChild=function(e){
this.childNodes[this.childNodes.length]=e;
};
XMLElement.prototype.hasChildNodes=function(){
if(this.childNodes.length>0){
return true;
}else{
return false;
}
};
XMLElement.prototype.findChildByName=function(n,_bc){
if(this.getName()==n){
return (this);
}
for(var i=0;i<this.childNodes.length;i++){
if(this.childNodes[i].getName()==n){
return this.childNodes[i];
}
}
if(_bc!=false){
for(i=0;i<this.childNodes.length;i++){
var _be=this.childNodes[i].findChildByName(n,_bc);
if(_be){
return _be;
}
}
}
return null;
};
XMLElement.prototype.findChildWithAttribute=function(_bf,val){
for(var i=0;i<this.childNodes.length;i++){
if(this.childNodes[i].getAttribute(_bf)==val){
return this.childNodes[i];
}
}
return null;
};
XMLElement.prototype.getElementsByTagName=function(s,_c3){
var a=[];
for(var i=0;i<this.childNodes.length;i++){
if(this.childNodes[i].getName()==s){
a[a.length]=this.childNodes[i];
}
}
if(_c3!=false){
for(i=0;i<this.childNodes.length;i++){
var _c6=this.childNodes[i].getElementsByTagName(s);
for(var j=0;j<_c6.length;j++){
a[a.length]=_c6[j];
}
}
}
return a;
};
XMLElement.prototype.getName=function(){
return this.nodeName;
};
XMLElement.prototype.getValue=function(){
return this.nodeValue;
};
XMLElement.prototype.setAttribute=function(a,v){
this.attributes["_"+a]=v;
};
XMLElement.prototype.setValue=function(v){
this.nodeValue=v;
};
XMLElement.prototype.getAttribute=function(a){
var _cc="";
if(typeof sXmlDecode=="function"){
_cc=sXmlDecode(this.attributes["_"+a]);
}else{
_cc=this.attributes["_"+a];
}
return (_cc==null?"":_cc);
};
XMLElement.prototype.toString=function(){
var s="<"+this.getName();
for(var i in this.attributes){
s+=" "+i.substring(1)+"=\""+this.attributes[i]+"\"";
}
s+=">"+this.getValue();
for(var j=0;j<this.childNodes.length;j++){
s+=this.childNodes[j].toString();
}
s+="</"+this.getName()+">";
return s;
};
function XMLBuilderLoadXMLFromString(_d0,_d1){
var _d2=null;
if(typeof DOMParser!="undefined"){
_d2=new DOMParser().parseFromString(_d0,"application/xml");
}else{
if(typeof ActiveXObject!="undefined"){
try{
_d2=new ActiveXObject("Microsoft.XMLDOM");
_d2.loadXML(_d0);
}
catch(e){
}
}
}
return _d2;
};
function XMLBuilderCreateXMLDocument(_d3,_d4,_d5){
var _d6=null;
_d4=_d4||"";
_d5=_d5||null;
if(document.implementation&&document.implementation.createDocument){
if(typeof _d4=="undefined"){
_d4="http://www.w3.org/2000/xmlns/";
}
_d6=document.implementation.createDocument(_d4,_d3,_d5);
}else{
if(typeof ActiveXObject!="undefined"){
try{
_d6=new ActiveXObject("Microsoft.XMLDOM");
var _d7=_d6.createNode(1,_d3,_d4);
_d6.appendChild(_d7);
}
catch(e){
}
}
}
return _d6;
};
function XMLBuilderCreateElementNS(_d8,_d9,_da){
var _db=null;
if(typeof _da.createElementNS!="undefined"){
if(typeof _d8=="undefined"){
_d8="http://www.w3.org/2000/xmlns/";
}
_db=_da.createElementNS(_d8,_d9);
}else{
if(typeof _da.createNode!="undefined"){
_db=_da.createNode(1,_d9,_d8);
}
}
return _db;
};
function XMLBuilderSetAttributeNodeNS(_dc,_dd,_de,_df){
if(typeof _dc.setAttributeNS!="undefined"){
if(typeof _df=="undefined"){
_df="http://www.w3.org/2000/xmlns/";
}
_dc.setAttributeNS(_df,_dd,_de);
}else{
if(typeof _dc.ownerDocument!="undefined"&&typeof _dc.ownerDocument.createNode!="undefined"){
var _e0=_dc.ownerDocument.createNode(2,_dd,_df);
_e0.nodeValue=_de;
_dc.setAttributeNode(_e0);
}
}
};
function XMLBuilderSerializeNode(_e1){
var _e2="";
if(typeof XMLSerializer!="undefined"){
try{
_e2=new XMLSerializer().serializeToString(_e1);
}
catch(e){
}
}else{
if(typeof _e1=="object"&&typeof _e1.xml!="undefined"){
_e2=_e1.xml;
}
}
return _e2.replace(/^\s+/g,"").replace(/\s+$/g,"");
};
function XMLHelper_GetText(_e3,_e4){
var _e5="";
var _e6=_e3.childNodes;
for(var i=0;i<_e6.length;++i){
if(_e6[i].nodeType==3){
_e5+=_e6[i].nodeValue;
}else{
if(_e6[i].nodeName=="Value"){
_e5+=_e6[i].getAttribute("display");
}else{
if(_e4){
_e5+=XMLHelper_GetText(_e6[i],true);
}
}
}
}
return _e5;
};
function XMLHelper_GetLocalName(_e8){
if(typeof _e8.baseName!="undefined"){
return _e8.baseName;
}
return _e8.localName;
};
function XMLHelper_FindChildByTagName(_e9,_ea,_eb){
if(typeof _eb=="undefined"||(_eb!=true&&_eb!=false)){
_eb=true;
}
if(XMLHelper_GetLocalName(_e9)==_ea){
return (_e9);
}
var i;
for(i=0;i<_e9.childNodes.length;i++){
if(XMLHelper_GetLocalName(_e9.childNodes[i])==_ea){
return _e9.childNodes[i];
}
}
if(_eb!=false){
for(i=0;i<_e9.childNodes.length;i++){
var _ed=XMLHelper_FindChildByTagName(_e9.childNodes[i],_ea,_eb);
if(_ed){
return _ed;
}
}
}
return null;
};
function XMLHelper_FindChildrenByTagName(_ee,_ef,_f0){
if(typeof _f0=="undefined"||(_f0!=true&&_f0!=false)){
_f0=true;
}
var _f1=[];
var _f2=_ee.childNodes;
for(var _f3=0;_f3<_f2.length;_f3++){
if(XMLHelper_GetLocalName(_f2[_f3])==_ef){
_f1[_f1.length]=_f2[_f3];
}
if(_f0===true){
var _f4=XMLHelper_FindChildrenByTagName(_f2[_f3],_ef,_f0);
if(_f4.length>0){
_f1=_f1.concat(_f4);
}
}
}
return _f1;
};
function XMLHelper_GetFirstChildElement(oEl){
var _f6=null;
if(oEl&&oEl.childNodes&&oEl.childNodes.length){
for(var i=0;i<oEl.childNodes.length;i++){
if(oEl.childNodes[i].nodeType==1){
_f6=oEl.childNodes[i];
break;
}
}
}
return _f6;
};
function XMLHelper_FindChildrenByAttribute(_f8,_f9,_fa,_fb,_fc){
if(typeof _fb=="undefined"||(_fb!=true&&_fb!=false)){
_fb=true;
}
if(typeof _fa!="string"&&typeof _fa!="number"){
_fa=null;
}else{
_fa=_fa.toString();
}
var _fd=[];
var _fe=_f8.childNodes;
for(var _ff=0;_ff<_fe.length;_ff++){
var _100=_fe[_ff];
if(_100.nodeType==1){
var _101=_100.getAttribute(_f9);
if(_101!==null){
if(_fa===null||_101==_fa){
if(_fc){
return [_100];
}else{
_fd[_fd.length]=_100;
}
}
}
if(_fb===true){
var _102=XMLHelper_FindChildrenByAttribute(_100,_f9,_fa,_fb,_fc);
if(_102.length>0){
if(_fc){
if(_102.length==1){
return _102;
}else{
return [_102[0]];
}
}else{
_fd=_fd.concat(_102);
}
}
}
}
}
return _fd;
};
var DICTIONARY_INVALID_KEY=-1;
var DICTIONARY_SUCCESS=1;
function CDictionary(){
this.m_aValues={};
};
function CDictionary_add(sKey,_104){
if(typeof sKey!="string"&&typeof sKey!="number"){
return DICTIONARY_INVALID_KEY;
}
this.m_aValues[sKey]=_104;
return DICTIONARY_SUCCESS;
};
function CDictionary_exists(sKey){
if(typeof sKey!="string"&&typeof sKey!="number"){
return false;
}
return (typeof this.m_aValues[sKey]!="undefined");
};
function CDictionary_get(sKey){
if(typeof sKey!="string"&&typeof sKey!="number"){
return null;
}
if(this.exists(sKey)===true){
return this.m_aValues[sKey];
}else{
return null;
}
};
function CDictionary_keys(){
var _107=[];
for(var _108 in this.m_aValues){
_107.push(_108);
}
return _107.sort();
};
function CDictionary_remove(sKey){
if(typeof sKey!="string"&&typeof sKey!="number"){
return DICTIONARY_INVALID_KEY;
}
var _10a=this.get(sKey);
delete this.m_aValues[sKey];
return _10a;
};
function CDictionary_removeAll(){
this.m_aValues=[];
return DICTIONARY_SUCCESS;
};
function CDictionary_append(_10b){
if(_10b instanceof CDictionary&&_10b.keys().length>0){
var _10c=_10b.keys();
for(var _10d=0;_10d<_10c.length;_10d++){
this.add(_10c[_10d],_10b.get(_10c[_10d]));
}
}
};
CDictionary.prototype.add=CDictionary_add;
CDictionary.prototype.exists=CDictionary_exists;
CDictionary.prototype.get=CDictionary_get;
CDictionary.prototype.keys=CDictionary_keys;
CDictionary.prototype.remove=CDictionary_remove;
CDictionary.prototype.removeAll=CDictionary_removeAll;
CDictionary.prototype.append=CDictionary_append;
function CognosTabControl(_10e,_10f){
this._init();
this._outsideContainer=_10e;
this._callback=_10f;
};
CognosTabControl.prototype._init=function(){
this._tabs=null;
this._tabControlNode=null;
this._scrollButtonsVisible=false;
this._scrollLeftButton=null;
this._scrollRightButton=null;
this._selectedTab=null;
this._wrapperDiv=null;
this._topContainer=null;
this._seperator=null;
this._isSavedOutput=false;
this._isHighContrast=false;
};
CognosTabControl.prototype.destroy=function(){
if(this._wrapperDiv){
this._wrapperDiv.parentNode.removeChild(this._wrapperDiv);
delete this._wrapperDiv;
this._wrapperDiv=null;
}
};
CognosTabControl.prototype.setHighContrast=function(_110){
this._isHighContrast=_110;
};
CognosTabControl.prototype.isHighContrast=function(){
return this._isHighContrast;
};
CognosTabControl.prototype.setSpaceSaverContainer=function(node){
this._spaceSaverContainer=node;
};
CognosTabControl.prototype.useAbsolutePosition=function(_112){
this._useAbsolutePosition=_112;
};
CognosTabControl.prototype.setScrollAttachNode=function(node){
this._scrollAttachNode=node;
};
CognosTabControl.prototype.setIsSavedOutput=function(_114){
this._isSavedOutput=_114;
};
CognosTabControl.prototype.isSavedOutput=function(){
return this._isSavedOutput;
};
CognosTabControl.prototype.getSelectedTabId=function(){
if(this._selectedTab){
return this._selectedTab.getId();
}
return null;
};
CognosTabControl.prototype.getSelectedTab=function(){
return this._selectedTab?this._selectedTab:null;
};
CognosTabControl.prototype.isTopAligned=function(){
return this._isTopAligned;
};
CognosTabControl.prototype.getWrapperDiv=function(){
return this._wrapperDiv;
};
CognosTabControl.prototype.getVisibleWidth=function(){
var _115=this._scrollRightButton?this._scrollRightButton.getWidth()+11:0;
return this._wrapperDiv.clientWidth-_115;
};
CognosTabControl.prototype.getMaxRightScroll=function(){
var _116=this._scrollRightButton?this._scrollRightButton.getWidth()+11:0;
return this._totalWrapperWidth+_116+8-this._wrapperDiv.clientWidth;
};
CognosTabControl.prototype.hide=function(){
this._topContainer.style.display="none";
};
CognosTabControl.prototype.resetPosition=function(){
if(this._useAbsolutePosition===true){
this._outsideContainer.srollLeft="0px";
this._outsideContainer.scrollTop="0px";
this._topContainer.style.top="";
this._topContainer.style.bottom="";
this._topContainer.style.left="0px";
if(this._isTopAligned){
this._topContainer.style.top="0px";
}else{
this._topContainer.style.bottom="0px";
}
}
};
CognosTabControl.prototype.render=function(_117){
this._updateTabInfo(_117);
if(!this._tabControlNode){
var _118=this;
var _119=this._scrollAttachNode?this._scrollAttachNode:this._outsideContainer;
if(window.attachEvent){
window.attachEvent("onresize",function(){
_118.onResize();
});
if(this._useAbsolutePosition===true){
_119.attachEvent("onscroll",function(){
_118.onContainerScroll();
});
}
}else{
window.addEventListener("resize",function(){
_118.onResize();
},false);
if(this._useAbsolutePosition===true){
_119.addEventListener("scroll",function(){
_118.onContainerScroll();
},false);
}
}
this._outsideContainer.originalClassName=this._outsideContainer.className;
this._outsideContainer.className=this._outsideContainer.className+(this._isTopAligned?" ct_controlTop":" ct_controlBottom");
this._topContainer=document.createElement("div");
this._topContainer.className="ct_wrapperDiv";
if(this._useAbsolutePosition===true){
this._topContainer.style.width="100%";
this._topContainer.style.position="absolute";
this._topContainer.style.left="0px";
if(this._isTopAligned){
this._topContainer.style.top="0px";
}else{
this._topContainer.style.bottom="0px";
}
}
if(this._isTopAligned&&this._outsideContainer.firstChild){
this._outsideContainer.insertBefore(this._topContainer,this._outsideContainer.firstChild);
}else{
this._outsideContainer.appendChild(this._topContainer);
}
this._wrapperDiv=document.createElement("div");
this._wrapperDiv.setAttribute("role","presentation");
this._wrapperDiv.className="ct_wrapperDiv";
this._topContainer.appendChild(this._wrapperDiv);
this._tabControlNode=document.createElement("div");
this._tabControlNode.setAttribute("role","tablist");
this._tabControlNode.className="ct_control";
this._wrapperDiv.appendChild(this._tabControlNode);
this._totalWrapperWidth=0;
for(var i=0;i<this._tabs.length;i++){
var tab=this._tabs[i];
tab.render(this._tabControlNode);
this._totalWrapperWidth+=this._tabs[i].getWidth();
}
var _11c=0;
if(this._tabs[0]){
_11c=this._tabs[0].getHeight();
}
this._wrapperDiv.style.height=_11c+5+"px";
if(this._spaceSaverContainer){
this.spaceSaverDiv=document.createElement("div");
this.spaceSaverDiv.style.height=_11c+5+"px";
this.spaceSaverDiv.style.position="relative";
this.spaceSaverDiv.style.display="block";
this._spaceSaverContainer.appendChild(this.spaceSaverDiv);
}
this._createSeperator();
}else{
this.resetPosition();
}
this._topContainer.style.display="";
this.onResize();
this.selectTab(_117.currentTabId,false);
if(this._selectedTab){
this._selectedTab.scrollIntoView();
this.updateScrollButtons();
}
};
CognosTabControl.prototype.onContainerScroll=function(){
var _11d=this._scrollAttachNode?this._scrollAttachNode:this._topContainer;
this._topContainer.style.left=_11d.scrollLeft+"px";
if(this._isTopAligned){
this._topContainer.style.top=_11d.scrollTop+"px";
}else{
this._topContainer.style.bottom=(-_11d.scrollTop)+"px";
}
};
CognosTabControl.prototype._resetTabControl=function(){
if(this._outsideContainer.originalClassName){
this._outsideContainer.className=this._outsideContainer.originalClassName;
}else{
this._outsideContainer.className="";
}
if(this._topContainer){
var node=this._outsideContainer.removeChild(this._topContainer);
node=null;
}
this._init();
};
CognosTabControl.prototype._updateTabInfo=function(_11f){
this._isTopAligned=_11f.position=="topLeft"?true:false;
var tabs=_11f.tabs;
if(this._tabs){
if(this._tabs.length!=tabs.length){
this._resetTabControl();
}else{
for(var i=0;i<this._tabs.length;i++){
if(tabs[i].id!=this._tabs[i].getId()){
this._resetTabControl();
break;
}
}
}
}
if(!this._tabs){
this._tabs=[];
if(!tabs){
return;
}
for(var ii=0;ii<tabs.length;ii++){
var tab=new CognosTab(tabs[ii],this,ii);
this._tabs.push(tab);
}
}
};
CognosTabControl.prototype.getScrollPos=function(){
return this._wrapperDiv.scrollLeft;
};
CognosTabControl.prototype.scrollTo=function(_124){
this._wrapperDiv.scrollLeft=_124;
this.updateScrollButtons();
};
CognosTabControl.prototype.onResize=function(evt){
if(this._wrapperDiv.offsetWidth<this._totalWrapperWidth){
this._showScrollButtons();
this.updateScrollButtons();
if(this._selectedTab){
this._selectedTab.scrollIntoView();
}
if(this._scrollRightButton.isDisabled()){
this.scrollTo(this.getMaxRightScroll());
}
}else{
this._hideScrollButtons();
this.scrollTo(0);
}
};
CognosTabControl.prototype._showScrollButtons=function(){
if(this._scrollButtonsVisible){
return;
}
if(!this._scrollLeftButton){
var _126=0;
if(this._tabs[0]){
_126=this._tabs[0].getHeight();
}
this._scrollLeftButton=new CognosScrollButton("left",_126,this);
this._scrollLeftButton.render(this._topContainer);
this._scrollRightButton=new CognosScrollButton("right",_126,this);
this._scrollRightButton.render(this._topContainer);
}
this._scrollButtonsVisible=true;
this._scrollLeftButton.show();
this._scrollRightButton.show();
this._tabControlNode.style.left=this._scrollLeftButton.getWidth()-2+"px";
};
CognosTabControl.prototype.updateScrollButtons=function(){
if(this._scrollLeftButton){
this._scrollLeftButton.update();
}
if(this._scrollRightButton){
this._scrollRightButton.update();
}
};
CognosTabControl.prototype._hideScrollButtons=function(){
if(!this._scrollButtonsVisible){
return;
}
this._scrollButtonsVisible=false;
this._tabControlNode.style.left="0px";
this._scrollLeftButton.hide();
this._scrollRightButton.hide();
};
CognosTabControl.prototype._createSeperator=function(){
this._seperator=document.createElement("div");
this._seperator.setAttribute("role","presendation");
this._seperator.setAttribute("style","");
this._seperator.className="ct_verticalLine";
this._seperator.setAttribute("role","presentation");
this._tabControlNode.appendChild(this._seperator);
};
CognosTabControl.prototype.selectTab=function(_127,_128,evt){
if(!evt){
evt=window.event;
}
for(var i=0;i<this._tabs.length;i++){
var tab=this._tabs[i];
var _12c=tab.getId()==_127;
tab.select(_12c);
if(_12c){
this._selectedTab=tab;
if(_128&&this._callback){
this._callback(_127);
}
}
if(_128){
tab.focus(_12c);
}
}
if(evt&&window.stopEventBubble){
window.stopEventBubble(evt);
}
return false;
};
CognosTabControl.prototype.handleKeyDown=function(evt,_12e){
if(!evt){
evt=window.event;
}
if(!evt){
return;
}
if(evt.keyCode=="39"||evt.keyCode=="37"){
if(evt.keyCode=="39"){
_12e++;
if(_12e>=this._tabs.length){
_12e=0;
}
}else{
_12e--;
if(_12e<0){
_12e=this._tabs.length-1;
}
}
this._tabs[_12e].focus();
this._tabs[_12e].scrollIntoView();
}else{
if(evt.keyCode=="32"||evt.keyCode=="13"){
var _12f=this._tabs[_12e].getId();
this.selectTab(_12f,true);
}
}
};
function CognosTab(_130,_131,_132){
if(!_130){
return;
}
this._id=_130.id;
this._label=_130.label;
this._position=_132;
this._contentClassName=_130.className;
this._imgURL=_130.img;
this._selected=false;
this._tabControl=_131;
this._outerTabDiv=null;
this._focusDiv=null;
};
CognosTab.prototype.getWidth=function(){
return this._outerTabDiv.offsetWidth+1;
};
CognosTab.prototype.getHeight=function(){
return this._outerTabDiv.clientHeight;
};
CognosTab.prototype.getId=function(){
return this._id;
};
CognosTab.prototype.select=function(_133){
if(_133!=this._selected){
this._selected=_133;
if(_133){
this.scrollIntoView();
}
if(this._outerTabDiv){
this._updateSelectedClass();
this._updateAriaSelected();
}
}
};
CognosTab.prototype.scrollIntoView=function(){
var _134=this._outerTabDiv.offsetLeft+this._outerTabDiv.clientWidth;
var _135=this._tabControl.getVisibleWidth();
var _136=this._tabControl.getScrollPos();
var _137=this._outerTabDiv.offsetLeft;
if(_137===0){
this._tabControl.scrollTo(0);
}else{
if((_137>=_136)&&(_134<=(_136+_135))){
}else{
if(_137<_136){
var _138=_137<3?0:_137-3;
this._tabControl.scrollTo(_138);
}else{
if(_134-_135>0||_134<_136){
this._tabControl.scrollTo(_134-_135+10);
}
}
}
}
};
CognosTab.prototype.render=function(_139){
if(!this._outerTabDiv){
var _13a=this._id;
var _13b=this._tabControl;
var tab=this;
this._outerTabDiv=document.createElement("div");
this._outerTabDiv.onmousedown=function(_13d){
_13b.selectTab(_13a,true,_13d);
};
this._outerTabDiv.onmouseover=function(){
this.className=this.className+" ct_highlight";
};
this._outerTabDiv.onmouseout=function(){
tab._updateSelectedClass();
};
this._outerTabDiv.setAttribute("style","");
this._outerTabDiv.setAttribute("role","presentation");
this._updateSelectedClass();
_139.appendChild(this._outerTabDiv);
var _13e=document.createElement("div");
_13e.className="ct_content";
_13e.setAttribute("role","presentation");
this._outerTabDiv.appendChild(_13e);
this._focusDiv=document.createElement("span");
this._focusDiv.innerHTML=this._label?this._label:"&nbsp;";
this._focusDiv.className="ct_text";
this._focusDiv.setAttribute("tabIndex",this._position===0?"0":"-1");
this._focusDiv.setAttribute("role","tab");
this._focusDiv.onkeydown=function(_13f){
_13b.handleKeyDown(_13f,tab._position);
};
this._updateAriaSelected();
_13e.appendChild(this._focusDiv);
if(this.isIE()&&this.getWidth()<75){
this._outerTabDiv.style.width="75px";
}
}else{
this._updateSelectedClass();
this._updateAriaSelected();
}
};
CognosTab.prototype.isIE=function(){
return (navigator.userAgent.indexOf("MSIE")!=-1||navigator.userAgent.indexOf("Trident")!=-1);
};
CognosTab.prototype.getFocusableDiv=function(){
return this._focusDiv;
};
CognosTab.prototype.focus=function(_140){
if(typeof _140==="undefined"){
_140=true;
}
this._focusDiv.setAttribute("tabIndex",_140?"0":"-1");
if(_140&&this._focusDiv.focus){
this._focusDiv.focus();
}
};
CognosTab.prototype._updateSelectedClass=function(){
this._outerTabDiv.className=this._selected?"ct_outerDiv ct_highlight ct_selected":"ct_outerDiv";
};
CognosTab.prototype._updateAriaSelected=function(){
this._focusDiv.setAttribute("aria-selected",this._selected?"true":"false");
};
function CognosScrollButton(_141,_142,_143){
this._direction=_141;
this._height=_142;
this._tabControl=_143;
this._disabled=true;
this._scrolling=false;
};
CognosScrollButton.prototype.getWidth=function(){
return this._scrollButtonDiv.offsetWidth+1;
};
CognosScrollButton.prototype.show=function(){
this._wrapperDiv.style.display="block";
};
CognosScrollButton.prototype.hide=function(){
this._wrapperDiv.style.display="none";
};
CognosScrollButton.prototype.update=function(){
var _144=this._tabControl.getWrapperDiv();
var _145=false;
if(this._direction=="left"){
if(_144.scrollLeft===0){
_145=true;
}
}else{
if(_144.scrollLeft>=(this._tabControl.getMaxRightScroll()-2)){
_145=true;
}
}
if(_145){
this._disable();
}else{
this._enable();
}
};
CognosScrollButton.prototype.isDisabled=function(){
return this._disabled;
};
CognosScrollButton.prototype._disable=function(){
this._disabled=true;
this._outerDiv.className="ct_outerDiv ct_scrollDisabled";
};
CognosScrollButton.prototype._enable=function(){
this._disabled=false;
this._outerDiv.className="ct_outerDiv ct_scrollEnabled";
};
CognosScrollButton.prototype.scroll=function(){
if(!this._scrolling){
this._scrolling=true;
var _146=this._tabControl.getWrapperDiv().clientWidth;
this._doAnimateScroll(_146,this._tabControl.getMaxRightScroll());
}
};
CognosScrollButton.prototype._doAnimateScroll=function(_147,_148){
if(_147>0){
var _149=10;
var _14a=this._tabControl.getWrapperDiv();
if(this._direction=="left"){
if(_14a.scrollLeft>_149){
this._tabControl.scrollTo(_14a.scrollLeft-_149);
}else{
this._tabControl.scrollTo(0);
this._scrolling=false;
return;
}
}else{
if(_14a.scrollLeft+_149<_148){
this._tabControl.scrollTo(_14a.scrollLeft+_149);
}else{
this._scrolling=false;
this._tabControl.scrollTo(_148);
this._tabControl.updateScrollButtons();
return;
}
}
_147-=_149;
var _14b=this;
setTimeout(function(){
_14b._doAnimateScroll(_147,_148);
},3);
}else{
this._scrolling=false;
this._tabControl.updateScrollButtons();
}
};
CognosScrollButton.prototype.isIE=function(){
return (navigator.userAgent.indexOf("MSIE")!=-1||navigator.userAgent.indexOf("Trident")!=-1);
};
CognosScrollButton.prototype.render=function(_14c){
this._scrollButtonDiv=document.createElement("div");
this._scrollButtonDiv.className="ct_scrollButton";
var _14d=-1;
if(this.isIE()&&document.compatMode!="CSS1Compat"){
_14d=1;
}
this._scrollButtonDiv.style.height=this._height+_14d+"px";
if(this._tabControl.isHighContrast()){
this._scrollButtonDiv.innerHTML=this._direction=="left"?"&laquo;":"&raquo;";
}
this._outerDiv=document.createElement("div");
this._outerDiv.className="ct_scrollDisabled";
this._outerDiv.appendChild(this._scrollButtonDiv);
this._outerDiv.style.height=this._height+"px";
var _14e=this;
this._outerDiv.onclick=function(){
_14e.scroll();
};
this._wrapperDiv=document.createElement("div");
this._wrapperDiv.style.height=this._height+"px";
this._wrapperDiv.className="ct_scroll "+(this._direction=="left"?"ct_left":"ct_right")+(this._tabControl.isHighContrast()?" a11y":"");
this._wrapperDiv.appendChild(this._outerDiv);
if(this._direction=="left"){
_14c.insertBefore(this._wrapperDiv,_14c.firstChild);
this._wrapperDiv.style.left="0px";
}else{
_14c.appendChild(this._wrapperDiv);
this._wrapperDiv.style.right="0px";
}
};
function ActionFactory(_14f){
this.m_cognosViewer=_14f;
};
ActionFactory.prototype.load=function(_150){
this.m_cognosViewer.loadExtra();
var _151=null;
try{
var _152=_150+"Action";
_151=eval("(typeof "+_152+"=='function'? new "+_152+"():null);");
if(_151){
_151.setCognosViewer(this.m_cognosViewer);
}
}
catch(exception){
_151=null;
}
return _151;
};
function ActionFactory_loadActionHandler(evt,_154){
var _155=getCtxNodeFromEvent(evt);
var _156=_154.getSelectionController();
var _157=null;
if(_155!==null){
var _158=_155.getAttribute("ctx");
_158=_158.split("::")[0].split(":")[0];
var _159=_155.getAttribute("type")!=null?_155:_155.parentNode;
var type=_159.getAttribute("type");
switch(type){
case "columnTitle":
var _15b=(_155.getAttribute("dttargets")!=null);
var _15c=(_159.getAttribute("CTNM")!=null&&_156.getMun(_158)!=""&&_156.getUsageInfo(_158)!="2");
if(_15b||_15c){
_157=_154.getAction("DrillUpDownOrThrough");
_157.init(_15b,_15c);
_157.updateDrillabilityInfo(_154,_155);
}else{
_157=_154.getAction("RenameDataItem");
}
break;
case "datavalue":
case "chartElement":
case "ordinalAxisLabel":
case "legendLabel":
case "legendTitle":
case "ordinalAxisTitle":
var _15b=(_155.getAttribute("dttargets")!=null);
var _15c=(_156.getHun(_158)!="");
if(_15b||_15c){
_157=_154.getAction("DrillUpDownOrThrough");
_157.init(_15b,_15c);
_157.updateDrillabilityInfo(_154,_155);
}
break;
}
}
if(_157===null){
_157=_154.getAction("Selection");
}
_157.setCognosViewer(_154);
return _157;
};
ActionFactory.prototype.destroy=function(){
delete this.m_cognosViewer;
};
function CognosViewerAction(){
this.m_oCV=null;
};
CognosViewerAction.prototype.setRequestParms=function(_15d){
};
CognosViewerAction.prototype.onMouseOver=function(evt){
return false;
};
CognosViewerAction.prototype.onMouseOut=function(evt){
return false;
};
CognosViewerAction.prototype.onMouseDown=function(evt){
return false;
};
CognosViewerAction.prototype.onClick=function(evt){
return false;
};
CognosViewerAction.prototype.onDoubleClick=function(evt){
return false;
};
CognosViewerAction.prototype.updateMenu=function(_163){
return _163;
};
CognosViewerAction.prototype.addAdditionalOptions=function(_164){
};
CognosViewerAction.prototype.genSelectionContextWithUniqueCTXIDs=function(){
return false;
};
CognosViewerAction.prototype.doUndo=function(){
if(typeof console!="undefined"){
console.log("Required method doUndo not implemented.");
}
};
CognosViewerAction.prototype.doRedo=function(){
if(typeof console!="undefined"){
console.log("Required method doRedo not implemented.");
}
};
CognosViewerAction.prototype.forceRunSpecRequest=function(){
return false;
};
CognosViewerAction.prototype.preProcess=function(){
};
CognosViewerAction.prototype.setCognosViewer=function(oCV){
this.m_oCV=oCV;
};
CognosViewerAction.prototype.getCognosViewer=function(){
return this.m_oCV;
};
CognosViewerAction.prototype.getUndoRedoQueue=function(){
if(this.getCognosViewer().getViewerWidget()){
return this.getCognosViewer().getViewerWidget().getUndoRedoQueue();
}
return null;
};
CognosViewerAction.prototype.getViewerWidget=function(){
return this.m_oCV.getViewerWidget();
};
CognosViewerAction.prototype.getObjectDisplayName=function(){
var _166="";
if(this.m_oCV!=null){
if(typeof this.m_oCV.envParams["reportpart_id"]!="undefined"){
_166=this.m_oCV.envParams["reportpart_id"];
}else{
if(typeof this.m_oCV.envParams["ui.name"]!="undefined"){
_166=this.m_oCV.envParams["ui.name"];
}
}
}
return _166;
};
CognosViewerAction.prototype.getContainerId=function(_167){
var _168="";
if(_167&&_167.getAllSelectedObjects){
var _169=_167.getAllSelectedObjects();
if(_169){
var _16a=_169[0];
if(_16a&&_16a.getLayoutElementId){
_168=this.removeNamespace(_16a.getLayoutElementId());
}
}
}
return _168;
};
CognosViewerAction.prototype.removeNamespace=function(_16b){
var _16c=_16b;
try{
if(_16b!=""){
var _16d=_16b.indexOf(this.m_oCV.getId());
if(_16d!=-1){
_16b=_16b.replace(this.m_oCV.getId(),"");
}
}
return _16b;
}
catch(e){
return _16c;
}
};
CognosViewerAction.prototype.doAddActionContext=function(){
return true;
};
CognosViewerAction.prototype.getSelectionContext=function(){
return getViewerSelectionContext(this.m_oCV.getSelectionController(),new CSelectionContext(this.m_oCV.envParams["ui.object"]),this.genSelectionContextWithUniqueCTXIDs());
};
CognosViewerAction.prototype.getNumberOfSelections=function(){
var _16e=-1;
if(this.m_oCV!=null&&this.m_oCV.getSelectionController()!=null){
_16e=this.m_oCV.getSelectionController().getSelections().length;
}
return _16e;
};
CognosViewerAction.prototype.buildDynamicMenuItem=function(_16f,_170){
_16f.action={name:"LoadMenu",payload:{action:_170}};
_16f.items=[{"name":"loading","label":RV_RES.GOTO_LOADING,iconClass:"loading"}];
return _16f;
};
CognosViewerAction.prototype.createCognosViewerDispatcherEntry=function(_171){
var oReq=new ViewerDispatcherEntry(this.getCognosViewer());
oReq.addFormField("ui.action",_171);
this.preProcess();
if(this.doAddActionContext()===true){
var _173=this.addActionContext();
oReq.addFormField("cv.actionContext",_173);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_173,"xml");
}
}
oReq.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
if(typeof this.m_oCV.envParams["ui.spec"]!="undefined"){
oReq.addFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
}
if(this.m_oCV.getModelPath()!==""){
oReq.addFormField("modelPath",this.m_oCV.getModelPath());
}
if(typeof this.m_oCV.envParams["packageBase"]!="undefined"){
oReq.addFormField("packageBase",this.m_oCV.envParams["packageBase"]);
}
if(typeof this.m_oCV.envParams["rap.state"]!="undefined"){
oReq.addFormField("rap.state",this.m_oCV.envParams["rap.state"]);
}
if(typeof this.m_oCV.envParams["rapReportInfo"]!="undefined"){
oReq.addFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
}
this.addAdditionalOptions(oReq);
return oReq;
};
CognosViewerAction.prototype.fireModifiedReportEvent=function(){
try{
var _174=this.getCognosViewer().getViewerWidget();
if(_174){
var _175={"modified":true};
_174.fireEvent("com.ibm.bux.widget.modified",null,_175);
}
}
catch(e){
}
};
CognosViewerAction.prototype.showCustomCursor=function(evt,id,_178){
var _179=document.getElementById(id);
if(_179==null){
_179=document.createElement("span");
_179.className="customCursor";
_179.setAttribute("id",id);
document.body.appendChild(_179);
}
var _17a="<img src=\""+this.getCognosViewer().getWebContentRoot()+_178+"\"/>";
_179.innerHTML=_17a;
_179.style.position="absolute";
_179.style.left=(evt.clientX+15)+"px";
_179.style.top=(evt.clientY+15)+"px";
_179.style.display="inline";
};
CognosViewerAction.prototype.hideCustomCursor=function(id){
var _17c=document.getElementById(id);
if(_17c!=null){
_17c.style.display="none";
}
};
CognosViewerAction.prototype.selectionHasContext=function(){
var _17d=this.getCognosViewer().getSelectionController().getAllSelectedObjects();
var _17e=false;
if(_17d!=null&&_17d.length>0){
for(var i=0;i<_17d.length;i++){
if(_17d[i].hasContextInformation()){
_17e=true;
break;
}
}
}
return _17e;
};
CognosViewerAction.prototype.isInteractiveDataContainer=function(_180){
var _181=false;
if(typeof _180!="undefined"&&_180!=null){
var id=_180.toLowerCase();
_181=id=="crosstab"||id=="list"||this.getCognosViewer().getRAPReportInfo().isChart(id);
}
return _181;
};
CognosViewerAction.prototype.getSelectedContainerId=function(){
var _183=this.getCognosViewer();
var _184=_183.getSelectionController();
var _185=null;
if(_184!=null&&typeof _184!="undefined"){
_185=this.getContainerId(_184);
}
return _185;
};
CognosViewerAction.prototype.getSelectedReportInfo=function(){
var _186=this.getCognosViewer();
var _187=this.getSelectedContainerId();
var _188=this.getReportInfo(_187);
if(_188==null){
var _189=_186.getRAPReportInfo();
if(_189.getContainerCount()==1){
_188=_189.getContainerFromPos(0);
}
}
return _188;
};
CognosViewerAction.prototype.getReportInfo=function(_18a){
var _18b=null;
if(_18a!=null&&_18a.length>0){
var _18c=this.getCognosViewer();
var _18d=_18c.getRAPReportInfo();
_18b=_18d.getContainer(_18a);
}
return _18b;
};
CognosViewerAction.prototype.isSelectionOnChart=function(){
var _18e=this.getCognosViewer();
if(_18e.getSelectionController().hasSelectedChartNodes()){
return true;
}
var _18f=this.getContainerId(_18e.getSelectionController());
if(typeof _18f!="undefined"){
var _190=this.getReportInfo(_18f);
if(_190!=null&&_190.displayTypeId){
var _191=_190.displayTypeId.toLowerCase();
return _18e.getRAPReportInfo().isChart(_191);
}
}
return false;
};
CognosViewerAction.prototype.ifContainsInteractiveDataContainer=function(){
var _192=this.getCognosViewer().getRAPReportInfo();
if(_192){
return _192.containsInteractiveDataContainer();
}
return false;
};
CognosViewerAction.prototype.isPromptWidget=function(){
var oCV=this.getCognosViewer();
if(oCV.getRAPReportInfo()&&oCV.getRAPReportInfo().isPromptPart()){
return true;
}
return false;
};
CognosViewerAction.prototype.getLayoutComponents=function(){
var _194=[];
var _195=document.getElementById("rt"+this.m_oCV.getId());
if(_195!=null){
_194=getElementsByAttribute(_195,"*","lid");
}
return _194;
};
CognosViewerAction.prototype.addClientContextData=function(_196){
var _197=this.m_oCV.getSelectionController();
if(typeof _197!="undefined"&&_197!=null&&typeof _197.getCCDManager!="undefined"&&_197.getCCDManager()!=null){
var _198=_197.getCCDManager();
return ("<md>"+xml_encode(_198.MetadataToJSON())+"</md>"+"<cd>"+xml_encode(_198.ContextDataSubsetToJSON(_196))+"</cd>");
}
return "";
};
CognosViewerAction.prototype.getDataItemInfoMap=function(){
var _199=this.m_oCV.getSelectionController();
if(typeof _199!="undefined"&&_199!=null&&typeof _199.getCCDManager!="undefined"&&_199.getCCDManager()!=null){
var _19a=_199.getCCDManager();
return ("<di>"+xml_encode(_19a.DataItemInfoToJSON())+"</di>");
}
return "";
};
CognosViewerAction.prototype.getRAPLayoutTag=function(_19b){
var _19c=null;
if(typeof _19b=="object"&&_19b!=null){
_19c=_19b.getAttribute("rap_layout_tag");
}
return _19c;
};
CognosViewerAction.prototype.addMenuItemChecked=function(_19d,_19e,_19f){
if(_19d){
if(this.getCognosViewer().isHighContrast()){
_19e["class"]="menuItemSelected";
}
_19e.iconClass="menuItemChecked";
}else{
if(_19f&&_19f.length>0){
_19e.iconClass=_19f;
}
}
};
CognosViewerAction.prototype.gatherFilterInfoBeforeAction=function(_1a0){
var _1a1=this.getCognosViewer().getViewerWidget();
_1a1.filterRequiredAction=_1a0;
_1a1.clearRAPCache();
_1a1.fireEvent("com.ibm.bux.widget.action",null,{action:"canvas.filters"});
};
CognosViewerAction.prototype.addClientSideUndo=function(_1a2,_1a3){
var _1a4=GUtil.generateCallback(_1a2.doUndo,_1a3,_1a2);
var _1a5=GUtil.generateCallback(_1a2.doRedo,_1a3,_1a2);
this.getUndoRedoQueue().addClientSideUndo({"tooltip":_1a2.getUndoHint(),"undoCallback":_1a4,"redoCallback":_1a5});
this.getCognosViewer().getViewerWidget().updateToolbar();
};
CognosViewerAction.prototype.isValidMenuItem=function(){
var _1a6=this.getCognosViewer();
var _1a7=_1a6.getViewerWidget();
if(this.isPromptWidget()){
return false;
}
return true;
};
CognosViewerAction.prototype.isPositiveInt=function(_1a8){
if(typeof _1a8==="undefined"||_1a8===null){
return false;
}
var _1a9=parseInt(_1a8,10);
return _1a8&&_1a9===+_1a8&&_1a9>0&&_1a8.indexOf(".")==-1;
};
CognosViewerAction.prototype.buildActionResponseObject=function(_1aa,code,msg){
return {"status":_1aa,"message":msg?msg:null,"code":code?code:null,getStatus:function(){
return this.status;
},getMessage:function(){
return this.message;
},getCode:function(){
return this.code;
}};
};
function LineageAction(){
};
LineageAction.prototype=new CognosViewerAction();
LineageAction.prototype.getCommonOptions=function(_1ad){
_1ad.addFormField("cv.responseFormat","asynchDetailMIMEAttachment");
_1ad.addFormField("bux",this.m_oCV.getViewerWidget()?"true":"false");
_1ad.addFormField("cv.id",this.m_oCV.envParams["cv.id"]);
};
LineageAction.prototype.getSelectionOptions=function(_1ae){
var _1af=this.m_oCV.getSelectionController();
var _1b0=getSelectionContextIds(_1af);
_1ae.addFormField("context.format","initializer");
_1ae.addFormField("context.type","reportService");
_1ae.addFormField("context.selection","metadata,"+_1b0.toString());
};
LineageAction.prototype.getPrimaryRequestOptions=function(_1b1){
_1b1.addFormField("specificationType","metadataServiceLineageSpecification");
_1b1.addFormField("ui.action","runLineageSpecification");
_1b1.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
};
LineageAction.prototype.getSecondaryRequestOptions=function(_1b2){
_1b2.addFormField("ui.conversation",this.m_oCV.getConversation());
_1b2.addFormField("m_tracking",this.m_oCV.getTracking());
_1b2.addFormField("ui.action","lineage");
};
LineageAction.prototype.updateMenu=function(_1b3){
if(!this.getCognosViewer().bCanUseLineage){
return "";
}
_1b3.disabled=!this.selectionHasContext();
return _1b3;
};
LineageAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _1b5=new AsynchDataDispatcherEntry(oCV);
this.getCommonOptions(_1b5);
this.getSelectionOptions(_1b5);
if(oCV.getConversation()==""){
this.getPrimaryRequestOptions(_1b5);
}else{
this.getSecondaryRequestOptions(_1b5);
}
_1b5.setCallbacks({"complete":{"object":this,"method":this.handleLineageResponse}});
if(!oCV.m_viewerFragment){
_1b5.setRequestIndicator(oCV.getRequestIndicator());
var _1b6=new WorkingDialog(oCV);
_1b6.setSimpleWorkingDialogFlag(true);
_1b5.setWorkingDialog(_1b6);
}
oCV.dispatchRequest(_1b5);
};
LineageAction.prototype.handleLineageResponse=function(_1b7){
var oCV=this.getCognosViewer();
oCV.loadExtra();
oCV.setStatus(_1b7.getAsynchStatus());
oCV.setConversation(_1b7.getConversation());
oCV.setTracking(_1b7.getTracking());
var _1b9=null;
if(typeof MDSRV_CognosConfiguration!="undefined"){
_1b9=new MDSRV_CognosConfiguration();
var _1ba="";
if(this.m_oCV.envParams["metadataInformationURI"]){
_1ba=this.m_oCV.envParams["metadataInformationURI"];
}
_1b9.addProperty("lineageURI",_1ba);
_1b9.addProperty("gatewayURI",this.m_oCV.getGateway());
}
var _1bb=this.m_oCV.envParams["ui.object"];
var _1bc=getViewerSelectionContext(this.m_oCV.getSelectionController(),new CSelectionContext(_1bb));
var _1bd=new MDSRV_LineageFragmentContext(_1b9,_1bc);
_1bd.setExecutionParameters(this.m_oCV.getExecutionParameters());
if(typeof _1bb=="string"){
_1bd.setReportPath(_1bb);
}
_1bd.setReportLineage(_1b7.getResult());
_1bd.open();
};
function CSelectionDefaultStyles(_1be){
this.m_primarySelectionColor=null;
this.m_highContrastBorderStyle="solid";
this.m_secondarySelectionIsDisabled=false;
if(_1be){
this.m_selectionController=_1be;
this.m_oCognosViewer=_1be.m_oCognosViewer;
if(this.m_oCognosViewer){
var _1bf=this.m_oCognosViewer.getUIConfig();
if(_1bf){
if(_1bf.getPrimarySelectionColor()){
this.m_primarySelectionColor=_1bf.getPrimarySelectionColor();
}
if(!_1bf.getShowSecondarySelection()){
this.m_secondarySelectionIsDisabledConfig=true;
}else{
if(_1bf.getSeondarySelectionColor()){
this.m_secondarySelectionColor=_1bf.getSeondarySelectionColor();
}
}
}
}
}
};
CSelectionDefaultStyles.prototype.getPrimarySelectionColor=function(_1c0){
return this.m_primarySelectionColor;
};
CSelectionDefaultStyles.prototype.getSecondarySelectionColor=function(){
return this.m_secondarySelectionColor;
};
CSelectionDefaultStyles.prototype.getHighContrastBorderStyle=function(){
return this.m_highContrastBorderStyle;
};
CSelectionDefaultStyles.prototype.canApplyToSelection=function(_1c1){
return true;
};
CSelectionDefaultStyles.prototype.secondarySelectionIsDisabled=function(){
return this.m_secondarySelectionIsDisabled;
};
CSelectionDefaultStyles.prototype.setStyleForSelection=function(){
};
function CSelectionFilterStyles(_1c2){
this.m_selectionController=_1c2;
this.m_primarySelectionColor=this.m_primarySelectionFilterColor="#44BFDD";
this.m_primarySelectionFilterColorForMeasure=null;
this.m_secondarySelectionColor=null;
this.m_highContrastBorderStyle="dotted";
this.m_secondarySelectionIsDisabled=true;
};
CSelectionFilterStyles.prototype=new CSelectionDefaultStyles();
CSelectionFilterStyles.prototype.getPrimarySelectionColor=function(_1c3){
return this.m_primarySelectionColor;
};
CSelectionFilterStyles.prototype.getSecondarySelectionColor=function(){
return this.m_secondarySelectionColor;
};
CSelectionFilterStyles.prototype.getHighContrastBorderStyle=function(){
return this.m_highContrastBorderStyle;
};
CSelectionFilterStyles.prototype.secondarySelectionIsDisabled=function(){
return this.m_secondarySelectionIsDisabled;
};
CSelectionFilterStyles.prototype.canApplyToSelection=function(_1c4){
return !this.selectionHasOnlyMeasure(_1c4);
};
CSelectionFilterStyles.prototype.selectionHasOnlyMeasure=function(_1c5){
return (_1c5.length===1&&_1c5[0].length===1&&this.m_selectionController.isMeasure(_1c5[0][0]));
};
CSelectionFilterStyles.prototype.setStyleForSelection=function(_1c6){
this.m_primarySelectionColor=(this.selectionHasOnlyMeasure(_1c6))?null:this.m_primarySelectionFilterColor;
};
function CSelectionFilterContextMenuStyles(_1c7){
CSelectionDefaultStyles.call(this,_1c7);
this.m_secondarySelectionIsDisabled=true;
};
CSelectionFilterContextMenuStyles.prototype=new CSelectionDefaultStyles();
function CSelectionObject(){
this.initialize();
};
CSelectionObject.prototype.initialize=function(){
this.m_oCellRef={};
this.m_sColumnRef="";
this.m_sColumnName="";
this.m_aDataItems=[];
this.m_aUseValues=[];
this.m_aDisplayValues=[];
this.m_sCellTypeId="";
this.m_sLayoutType="";
this.m_sTag="";
this.m_aMuns=[];
this.m_aRefQueries=[];
this.m_aMetadataItems=[];
this.m_aDrillOptions=[];
this.m_selectionController={};
this.m_contextIds=[];
this.m_ctxAttributeString="";
this.m_fetchedContextIds=false;
this.m_selectedClass=[];
this.m_cutClass=[];
this.m_dataContainerType="";
this.m_oJsonContext=null;
};
CSelectionObject.prototype.isSelectionOnVizChart=function(){
return false;
};
CSelectionObject.prototype.getCellRef=function(){
return this.m_oCellRef;
};
CSelectionObject.prototype.getColumnRP_Name=function(){
if(this.m_oCellRef!=null){
return this.m_oCellRef.getAttribute("rp_name");
}
};
CSelectionObject.prototype.getColumnRef=function(){
return this.m_sColumnRef;
};
CSelectionObject.prototype.getColumnName=function(){
if(this.m_sColumnName==""){
if(this.m_selectionController.hasContextData()&&this.m_contextIds.length){
this.m_sColumnName=this.m_selectionController.getRefDataItem(this.m_contextIds[0][0]);
}
}
return this.m_sColumnName;
};
CSelectionObject.prototype.getDataItemDisplayValue=function(_1c8){
var _1c9=this.getDataItems();
var item="";
if(_1c9&&_1c9[0]&&_1c9[0][0]){
item=this.getDataItems()[0][0];
if(_1c8&&_1c8.itemInfo&&_1c8.itemInfo.length){
var _1cb=_1c8.itemInfo;
for(var i=0;i<_1cb.length;i++){
if(_1cb[i].item===item&&_1cb[i].itemLabel){
return _1cb[i].itemLabel;
}
}
}
}
return item;
};
CSelectionObject.prototype.getDataItems=function(){
if(!this.m_aDataItems.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aDataItems[this.m_aDataItems.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _1cf=this.m_contextIds[i][j];
this.m_aDataItems[this.m_aDataItems.length-1].push(this.m_selectionController.isContextId(_1cf)?this.m_selectionController.getRefDataItem(_1cf):"");
}
}
}
return this.m_aDataItems;
};
CSelectionObject.prototype.getUseValues=function(){
if(!this.m_aUseValues.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aUseValues[this.m_aUseValues.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _1d2=this.m_contextIds[i][j];
this.m_aUseValues[this.m_aUseValues.length-1].push(this.m_selectionController.isContextId(_1d2)?this.m_selectionController.getUseValue(_1d2):"");
}
}
}
return this.m_aUseValues;
};
CSelectionObject.prototype.getCellTypeId=function(){
return this.m_sCellTypeId;
};
CSelectionObject.prototype.getDisplayValues=function(){
return this.m_aDisplayValues;
};
CSelectionObject.prototype.getLayoutType=function(){
return this.m_sLayoutType;
};
CSelectionObject.prototype.getTag=function(){
return this.m_sTag;
};
CSelectionObject.prototype.getMuns=function(){
if(!this.m_aMuns.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aMuns[this.m_aMuns.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _1d5=this.m_contextIds[i][j];
this.m_aMuns[this.m_aMuns.length-1].push(this.m_selectionController.isContextId(_1d5)?this.m_selectionController.getMun(_1d5):"");
}
}
}
return this.m_aMuns;
};
CSelectionObject.prototype.getRefQueries=function(){
if(!this.m_aRefQueries.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aRefQueries[this.m_aRefQueries.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _1d8=this.m_contextIds[i][j];
this.m_aRefQueries[this.m_aRefQueries.length-1].push(this.m_selectionController.isContextId(_1d8)?this.m_selectionController.getRefQuery(_1d8):"");
}
}
}
return this.m_aRefQueries;
};
CSelectionObject.prototype.getDimensionalItems=function(_1d9){
var _1da=[];
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
_1da[_1da.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _1dd=this.m_contextIds[i][j];
var _1de="";
if(this.m_selectionController.isContextId(_1dd)){
switch(_1d9){
case "hun":
_1de=this.m_selectionController.getHun(_1dd);
break;
case "lun":
_1de=this.m_selectionController.getLun(_1dd);
break;
case "dun":
_1de=this.m_selectionController.getDun(_1dd);
break;
}
}
_1da[_1da.length-1].push(_1de);
}
}
return _1da;
};
CSelectionObject.prototype.getMetadataItems=function(){
if(!this.m_aMetadataItems.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aMetadataItems[this.m_aMetadataItems.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _1e1=this.m_contextIds[i][j];
var _1e2="";
if(this.m_selectionController.isContextId(_1e1)){
var sLun=this.m_selectionController.getLun(_1e1);
var sHun=this.m_selectionController.getHun(_1e1);
if(sLun&&sLun!=""){
_1e2=sLun;
}else{
if(sHun&&sHun!=""){
_1e2=sHun;
}else{
_1e2=this.m_selectionController.getQueryModelId(_1e1);
}
}
}
this.m_aMetadataItems[this.m_aMetadataItems.length-1].push(_1e2);
}
}
}
return this.m_aMetadataItems;
};
CSelectionObject.prototype.getDrillOptions=function(){
if(!this.m_aDrillOptions.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aDrillOptions[this.m_aDrillOptions.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _1e7=this.m_contextIds[i][j];
this.m_aDrillOptions[this.m_aDrillOptions.length-1].push(this.m_selectionController.isContextId(_1e7)?this.m_selectionController.getDrillFlag(_1e7):0);
}
}
}
return this.m_aDrillOptions;
};
CSelectionObject.prototype.getSelectedContextIds=function(){
return this.m_contextIds;
};
CSelectionObject.prototype.fetchContextIds=function(){
if(!this.m_fetchedContextIds&&this.m_contextIds.length&&this.m_selectionController.hasContextData()){
var _1e8=[];
for(var i=0;i<this.m_contextIds.length;i++){
for(var j=0;j<this.m_contextIds[i].length;j++){
_1e8.push(this.m_contextIds[i][j]);
}
}
this.m_selectionController.fetchContextData(_1e8);
this.m_fetchedContextIds=true;
}
};
CSelectionObject.prototype.setSelectionController=function(sc){
if(sc){
this.m_selectionController=sc;
}
};
CSelectionObject.prototype.getLayoutElementId=function(){
return this.m_layoutElementId;
};
CSelectionObject.prototype.hasContextInformation=function(){
for(var i=0;i<this.m_contextIds.length;i++){
for(var j=0;j<this.m_contextIds[i].length;j++){
if(this.m_contextIds[i][j].length>0){
return true;
}
}
}
return false;
};
CSelectionObject.prototype.isHomeCell=function(){
var _1ee=this.getCellRef().className;
if(_1ee&&(_1ee=="xm"||_1ee.indexOf("xm ")!=-1||_1ee.indexOf(" xm")!=-1)){
return true;
}
return false;
};
CSelectionObject.prototype.getDataContainerType=function(){
return this.m_dataContainerType;
};
CSelectionObject.prototype.getContextJsonObject=function(_1ef,_1f0){
if(this.m_oJsonContext===null){
var _1f1={};
var _1f2=[];
var _1f3=null;
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return null;
}
var i=0,j=0;
var _1f6=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_1ef);
_1f3=_1f6;
this._populateJsonContextObj(_1f6,this.m_aUseValues[i][j],_1ef.getDisplayValue(this.m_contextIds[i][j]),_1ef.getMun(this.m_contextIds[i][j]),_1f1,_1f2);
j++;
for(;i<this.m_aDataItems.length;i++,j=0){
for(;j<this.m_aDataItems[i].length;j++){
_1f6=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_1ef);
if(!_1f3){
_1f3=_1f6;
}
this._populateJsonContextObj(_1f6,this.m_aUseValues[i][j],_1ef.getDisplayValue(this.m_contextIds[i][j]),_1ef.getMun(this.m_contextIds[i][j]),_1f1,_1f2);
}
}
this.m_oJsonContext=this._createGenericPayloadStructureJson(_1f3,_1f1,_1f2,_1f0);
}
return this.m_oJsonContext;
};
CSelectionObject.prototype._getBestPossibleItemName=function(_1f7,_1f8,_1f9){
var _1fa=null;
if(_1f9.isMeasure(_1f8)){
if(!_1f9.isValidColumnTitle(this.m_oCellRef)){
if(!_1f9.isRelational([_1f8])){
_1fa=_1f9.getCCDManager().GetBestPossibleDimensionMeasureName(_1f8);
}
return (_1fa)?_1fa:_1f7;
}
}
_1fa=_1f9.getCCDManager().GetBestPossibleItemName(_1f8);
return (_1fa)?_1fa:_1f7;
};
CSelectionObject.prototype._isTypeColumnTitle=function(){
if(this.m_oCellRef&&typeof this.m_oCellRef.getAttribute=="function"){
return (this.m_oCellRef.getAttribute("type")==="columnTitle");
}
return false;
};
CSelectionObject.prototype._populateJsonContextObj=function(_1fb,_1fc,_1fd,mun,_1ff,_200){
if(_1ff&&_200&&_1fb&&typeof _1ff[_1fb]=="undefined"){
var _201=_1fd?_1fd:_1fc;
_1ff[_1fb]=[_201];
var _202={};
if(_1fd){
_202["caption"]=_1fd;
}
if(mun){
_202["mun"]=mun;
}
if(_1fc){
_202["use"]=_1fc;
}
_200.push(_202);
}
};
CSelectionObject.prototype._createGenericPayloadStructureJson=function(_203,_204,_205,_206){
if(_203&&_204&&_205){
var _207=(_206)?_206:".";
var _208={};
_208[_207]={"values":_205};
var obj={"com.ibm.widget.context":{"values":_204},"com.ibm.widget.context.report.select":{"select":{"selectedItem":_203,"itemSpecification":_208}}};
return obj;
}
return null;
};
CSelectionObject.prototype.populateSelectionPayload=function(_20a,_20b,_20c){
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return false;
}
_20c=((_20c===undefined)?false:_20c);
var _20d=this.m_selectionController;
for(var i=0,j=0;i<this.m_aDataItems.length;i++,j=0){
var _210=(_20c?1:this.m_aDataItems[i].length);
for(;j<_210;j++){
if(!_20d.isMeasure(this.m_contextIds[i][j])){
var _211=this.m_aDataItems[i][j];
this._populateItemInSelectionPayload(_211,this.m_aUseValues[i][j],_20d.getDisplayValue(this.m_contextIds[i][j]),_20d.getMun(this.m_contextIds[i][j]),_20a,_20b);
}
}
}
return true;
};
CSelectionObject.prototype._populateItemInSelectionPayload=function(_212,_213,_214,mun,_216,_217){
if(_216&&_212){
var _218=_213?_213:_214;
if(_216[_212]){
_216[_212].push(_218);
}else{
_216[_212]=[_218];
}
var _219={};
_219["caption"]=_218;
if(mun){
_219["mun"]=mun;
}
var _21a=_217[_212];
if(!_21a){
_21a={"values":[]};
_217[_212]=_21a;
}
_21a.values.push(_219);
}
};
CSelectionObject.prototype.getCtxAttributeString=function(){
return this.m_ctxAttributeString;
};
CSelectionObject.prototype.isDataValueOrChartElement=function(){
return (this.m_sLayoutType==="datavalue"||this.m_sLayoutType==="chartElement");
};
CSelectionObject.prototype.marshal=function(_21b,_21c){
if(!this.m_oJsonForMarshal){
var _21d={};
var _21e=[];
var _21f=null;
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return null;
}
var i=0,j=0;
if(this.m_contextIds[i][j].length==0){
var _222=false;
do{
for(;j<this.m_contextIds[i].length;j++){
if(this.m_contextIds[i][j].length>0){
_222=true;
break;
}
}
if(!_222){
j=0;
i++;
}
}while(!_222);
}
var _223=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_21b);
var _224=_21b.isMeasure(this.m_contextIds[i][j]);
var _225=this._getBestPossibleItemReference(this.m_contextIds[i][j],_224,_21b.getCCDManager());
var _226=_21b.getCCDManager().GetQuery(this.m_contextIds[i][j]);
var _227=this.isDataValueOrChartElement();
var _228=this._populateJsonForMarshal(_223,_225,_224,this.m_aUseValues[i][j],_21b.getDisplayValue(this.m_contextIds[i][j]),_21b.getMun(this.m_contextIds[i][j]),_227);
j++;
var _229=[];
for(;i<this.m_aDataItems.length;i++,j=0){
for(;j<this.m_aDataItems[i].length;j++){
_223=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_21b);
_224=_21b.isMeasure(this.m_contextIds[i][j]);
_225=this._getBestPossibleItemReference(this.m_contextIds[i][j],_224,_21b.getCCDManager());
var _22a=this._populateJsonForMarshal(_223,_225,_224,this.m_aUseValues[i][j],_21b.getDisplayValue(this.m_contextIds[i][j]),_21b.getMun(this.m_contextIds[i][j]));
if(_22a){
_229.push(_22a);
}
}
}
var lid=(typeof this.getArea=="function")?getImmediateLayoutContainerId(this.getArea()):getImmediateLayoutContainerId(this.getCellRef());
if(lid&&lid.indexOf(_21c)>0){
lid=lid.substring(0,lid.indexOf(_21c)-1);
}
this.m_oJsonForMarshal={"lid":lid,"query":_226,"selectedItem":_228,"context":_229};
}
return this.m_oJsonForMarshal;
};
CSelectionObject.prototype._populateJsonForMarshal=function(_22c,_22d,_22e,_22f,_230,mun,_232){
if(_22c){
var _233={};
_233["itemName"]=_22c;
_233["isMeasure"]=_22e?"true":"false";
_233["mdProperty"]=_22d.mdProperty;
_233["mdValue"]=_22d.mdValue;
_233["isDataValueOrChartElement"]=_232?"true":"false";
if(mun){
_233["mun"]=mun;
}
if(_22f){
_233["use"]=_22f;
}
return _233;
}
return null;
};
CSelectionObject.prototype._getBestPossibleItemReference=function(_234,_235,_236){
var _237=null;
var _238=null;
if(_235){
_238="i";
_237=_236.GetQMID(_234);
if(_237==null){
_238="m";
_237=_236.GetMUN(_234);
}
if(_237==null){
_238="r";
_237=_236.GetRDIValue(_234);
}
}else{
_238="l";
_237=_236.GetLUN(_234);
if(_237==null){
_238="h";
_237=_236.GetHUN(_234);
}
if(_237==null){
_238="i";
_237=_236.GetQMID(_234);
}
if(_237==null){
_238="r";
_237=_236.GetRDIValue(_234);
}
}
return {"mdProperty":_238,"mdValue":_237};
};
CSelectionChartObject.prototype=new CSelectionObject();
CSelectionChartObject.prototype.constructor=CSelectionChartObject;
CSelectionChartObject.baseclass=CSelectionObject.prototype;
function CSelectionChartObject(){
CSelectionChartObject.baseclass.initialize.call(this);
this.m_chartArea=null;
this.m_context="";
this.m_chartCtxAreas=[];
this.m_selectedVizChart=false;
};
CSelectionChartObject.prototype.isSelectionOnVizChart=function(){
return this.m_selectedVizChart;
};
CSelectionChartObject.prototype.setSelectionOnVizChart=function(_239){
var _23a=this.m_selectionController.getSelectedChartImageFromChartArea(_239);
if(_23a){
this.m_selectedVizChart=_23a.parentNode.getAttribute("vizchart")=="true"?true:false;
}
};
CSelectionChartObject.prototype.getArea=function(){
return this.m_chartArea;
};
CSelectionChartObject.prototype.getContext=function(){
return this.m_context;
};
CSelectionChartObject.prototype.getCtxAreas=function(){
return this.m_chartCtxAreas;
};
CSelectionChartObject.prototype.setCtxAreas=function(_23b){
this.m_chartCtxAreas=_23b;
};
CSelectionChartObject.prototype.getCtxAttributeString=function(){
return this.m_context;
};
function CChartHelper(_23c,_23d,_23e){
var _23f=_23c.parentNode;
this.m_selectionObjectFactory=_23d;
this.m_map=_23f;
_23e.loadExtra();
this.imageMapHighlighter=new CImageMapHighlight(_23f,_23e.sWebContentRoot);
this.initialize();
};
CChartHelper.prototype.initialize=function(){
this.buildMapCtxAreas();
this.m_chartCtxNodes={};
};
CChartHelper.prototype.buildMapCtxAreas=function(){
var _240={};
var _241=this.m_map.childNodes;
var _242=_241.length;
var _243=null;
for(var i=0;i<_242;i++){
var a=_241[i];
_243=a.getAttribute("ctx");
if(_243){
if(_240[_243]){
_240[_243].push(a);
}else{
_240[_243]=[a];
}
}
}
this.m_ctxAreas=_240;
};
CChartHelper.prototype.getChartNode=function(_246){
if(!this.isAreaInitialized(_246)){
var _247=_246.parentNode;
this.m_map=_247;
this.initialize();
this.imageMapHighlighter.initialize(_247);
}
var _248=_246.getAttribute("ctx");
if(!this.m_chartCtxNodes[_248]){
this.m_chartCtxNodes[_248]=this.m_selectionObjectFactory.getSelectionChartObject(_246);
this.m_chartCtxNodes[_248].setCtxAreas(this.m_ctxAreas[_248]);
}
return this.m_chartCtxNodes[_248];
};
CChartHelper.prototype.isAreaInitialized=function(_249){
return this.imageMapHighlighter.isAreaInitialized(_249);
};
CChartHelper.prototype.getImageMapHighlighter=function(){
return this.imageMapHighlighter;
};
function CSelectionObjectFactory(_24a){
this.m_selectionController=_24a;
};
CSelectionObjectFactory.prototype.getSelectionController=function(){
return this.m_selectionController;
};
CSelectionObjectFactory.prototype.getChildSpans=function(_24b){
var _24c=[];
for(var i=0;i<_24b.childNodes.length;i++){
var _24e=_24b.childNodes[i];
if(!_24e.getAttribute||_24e.getAttribute("skipSelection")!="true"){
_24c.push(_24b.childNodes[i]);
}
}
var _24f=_24b;
var _250="";
while(!_250&&_24f){
_250=_24f.attributes?_24f.attributes["LID"]:"";
_24f=_24f.parentNode;
}
_250=_250?_250.value:"";
var _251=[];
while(_24c.length>0){
var _24e=_24c.pop();
var lid=_24e.attributes?_24e.attributes["LID"]:"";
lid=lid?lid.value:"";
if(!lid||lid==_250){
if(_24e.nodeName.toLowerCase()=="span"){
_251.push(_24e);
}else{
for(i=0;i<_24e.childNodes.length;i++){
_24c.push(_24e.childNodes[i]);
}
}
}
}
return _251;
};
CSelectionObjectFactory.prototype.getSelectionObject=function(_253,_254){
var _255=new CSelectionObject();
try{
_255.setSelectionController(this.getSelectionController());
_255.m_oCellRef=_253;
_255.m_sColumnRef=_253.getAttribute("cid");
_255.m_sCellTypeId=_253.getAttribute("uid");
_255.m_sLayoutType=_253.getAttribute("type");
_255.m_sTag=_253.getAttribute("tag");
_255.m_layoutElementId=this.getLayoutElementId(_253);
_255.m_dataContainerType=this.getContainerType(_253);
if(typeof cf!="undefined"){
var _256=cf.cfgGet("MiniQueryObj");
if(_256){
var _257=_256.findChildWithAttribute("tag",_255.m_sTag);
if(_257&&_257.getAttribute("id")!=null){
_255.m_sColumnName=_257.getAttribute("id");
}
}
}
var _258=this.getChildSpans(_253);
if(_258.length>0){
for(var i=0;i<_258.length;i++){
var _25a=_258[i];
if(_25a.nodeType==1&&_25a.nodeName.toLowerCase()=="span"&&_25a.style.visibility!="hidden"){
var _25b=null;
if(_253.getAttribute("ctx")!=null&&_253.getAttribute("ctx")!=""){
_25b=_253;
}else{
if(_25a.getAttribute("ctx")!=null&&_25a.getAttribute("ctx")!=""){
_25b=_25a;
}else{
if(_25a.getAttribute("dtTargets")&&_25a.childNodes&&_25a.childNodes.length){
for(var _25c=0;_25c<_25a.childNodes.length;_25c++){
if(_25a.childNodes[_25c].nodeType==1&&_25a.childNodes[_25c].style.visibility!="hidden"){
_25b=_25a.childNodes[_25c];
}
}
}else{
for(var _25d=0;_25d<_25a.childNodes.length;_25d++){
var _25e=_25a.childNodes[_25d];
if(typeof _25e.getAttribute!="undefined"&&_25e.getAttribute("ctx")!=null&&_25e.getAttribute("ctx")!=""){
_25b=_25e;
break;
}
}
}
}
}
var _25f="";
if(_25b&&_25b.getAttribute("ctx")){
_25f=_25b.getAttribute("ctx");
}
_255.m_aDisplayValues[_255.m_aDisplayValues.length]=this.getSelectionController().getDisplayValue(_25f,_253.parentNode);
if(typeof _254!="undefined"&&_254!=_25f){
continue;
}
_255=this.processCTX(_255,_25f);
}
}
}else{
if(_253.getAttribute("ctx")!=null&&_253.getAttribute("ctx")!=""&&_255.m_sLayoutType=="datavalue"){
_255=this.processCTX(_255,_253.getAttribute("ctx"));
}
}
this.getSelectionController().processColumnTitleNode(_255);
}
catch(ex){
}
return _255;
};
CSelectionObjectFactory.prototype.processCTX=function(_260,_261){
if(typeof _261!="string"||_261.length==0){
return _260;
}
var ctx;
if(typeof _260.m_contextIds=="object"&&_260.m_contextIds!==null&&_260.m_contextIds.length>0){
var _263=_261.split("::");
for(ctx=0;ctx<_260.m_contextIds.length;++ctx){
try{
if(_263[ctx]){
_260.m_contextIds[ctx]=_260.m_contextIds[ctx].concat(_263[ctx].split(":"));
}
}
catch(e){
}
}
}else{
_260.m_contextIds=this.m_selectionController.m_oCognosViewer.getReportContextHelper().processCtx(_261);
}
_260.m_ctxAttributeString=_261;
return _260;
};
CSelectionObjectFactory.prototype.getSecondarySelectionObject=function(tag,_265,_266){
if(!_266){
_266=document;
}
var _267=new CSelectionObject();
_267.setSelectionController(this.getSelectionController());
_267.m_oCellRef=null;
_267.m_sColumnRef=null;
_267.m_sCellTypeId=null;
_267.refQuery="";
var _268=_266.getElementsByTagName("td");
for(var i=0;i<_268.length;i++){
var _26a=_268[i].getAttribute("tag");
if(_26a!=null&&_26a!=""){
if(tag==_26a){
var _26b=_268[i].className;
if(_26b!=null&&_26a!=""){
if((_265=="columnTitle"&&_26b=="lt")||(_265=="datavalue"&&_26b=="lc")){
_267.m_sColumnRef=_268[i].getAttribute("cid");
_267.m_sCellTypeId=_268[i].getAttribute("uid");
break;
}
}
}
}
}
if(_267.m_sCellTypeId==null){
return null;
}
return _267;
};
CSelectionObjectFactory.prototype.getSelectionChartObject=function(_26c){
var _26d="";
if(_26c.getAttribute("flashChart")!=null){
if(typeof _26c.getCtx!="undefined"){
try{
_26d=_26c.getCtx();
}
catch(e){
_26d="";
}
}
}else{
_26d=_26c.getAttribute("ctx");
}
var _26e=new CSelectionChartObject();
_26e.setSelectionController(this.getSelectionController());
if(_26d!=null){
_26e.m_contextIds=_26d.split("::");
for(var ctx=0;ctx<_26e.m_contextIds.length;++ctx){
_26e.m_contextIds[ctx]=_26e.m_contextIds[ctx].split(":");
}
}
_26e.m_layoutElementId=this.getLayoutElementId(_26c);
_26e.m_sLayoutType=_26c.getAttribute("type");
_26e.m_chartArea=_26c;
_26e.m_context=_26d;
_26e.setSelectionOnVizChart(_26c);
return _26e;
};
CSelectionObjectFactory.prototype.getContainerTypeFromClass=function(_270){
var _271="";
switch(_270){
case "ls":
_271="list";
break;
case "xt":
_271="crosstab";
break;
case "rt":
_271="repeaterTable";
break;
}
return _271;
};
CSelectionObjectFactory.prototype.getContainerType=function(el){
var type="";
if(el){
if(el.className){
type=this.getContainerTypeFromClass(el.className);
}
if(!type){
var _274=el.parentNode;
if(_274){
type=this.getContainerType(_274);
}
}
}
return type;
};
CSelectionObjectFactory.prototype.getLayoutElementId=function(el){
var id="";
var _277=this.getSelectionController().getNamespace();
if(el){
if(el.getAttribute&&el.getAttribute("chartcontainer")=="true"){
for(var _278=0;_278<el.childNodes.length;_278++){
var _279=el.childNodes[_278];
if(_279.nodeName.toLowerCase()=="img"&&_279.getAttribute("lid")!=null){
return _279.getAttribute("lid");
}
}
}
id=(el.getAttribute&&el.getAttribute("LID"))||"";
if(!id){
var _27a=el.parentNode;
if(_27a){
id=this.getLayoutElementId(_27a);
}
}else{
if(el.tagName.toUpperCase()=="MAP"){
id=id.replace(_277,"");
id=_277+id;
var _27b="#"+id;
var _27c=getElementsByAttribute(el.parentNode,"IMG","usemap",_27b);
if(_27c.length>0){
id=_27c[0].getAttribute("LID");
}
}
}
}
return id;
};
function CSelectionController(_27d,_27e){
this.m_bSelectionBasedFeaturesEnabled=false;
this.m_bDrillUpDownEnabled=false;
this.m_bModelDrillThroughEnabled=false;
this.m_oCognosViewer=null;
this.m_bSavedSelections=false;
if(_27e){
this.m_oCognosViewer=_27e;
}
this.initialize(_27d);
this.FILTER_SELECTION_STYLE=0;
this.FILTER_SELECTION_CONTEXT_MENU_STYLE=1;
};
CSelectionController.prototype.initialize=function(_27f){
this.m_sNamespace=_27f;
this.m_aCutColumns=[];
this.m_aSelectedObjects=[];
this.m_selectedClass=[];
this.m_cutClass=[];
this.m_oObserver=new CObserver(this);
this.m_bSelectionArraysSetup=false;
this.m_aSelectionHoverNodes=[];
this.m_bUsingCCDManager=false;
this.m_aReportMetadataArray=[];
this.m_aReportContextDataArray=[];
this.m_oCDManager=new CCDManager();
this.m_oSelectionObjectFactory=new CSelectionObjectFactory(this);
this.m_selectedChartArea=null;
this.m_selectedChartNodes=[];
this.m_selectionContainerMap=null;
this.m_chartHelpers={};
if(this.m_oCognosViewer!=null){
this.m_oCDManager.SetCognosViewer(this.m_oCognosViewer);
}
this.m_maxSecondarySelection=-1;
this.c_usageMeasure="2";
this.m_ccl_dateTypes={59:"dateTime",60:"interval"};
this.m_selectionStyles=new CSelectionDefaultStyles(this);
this.m_originalSelectionStyles=this.m_selectionStyles;
this.m_bAllowHorizontalDataValueSelection=false;
};
CSelectionController.prototype.secondarySelectionIsDisabled=function(){
return this.m_selectionStyles.secondarySelectionIsDisabled();
};
CSelectionController.prototype.getPrimarySelectionColor=function(){
return this.m_selectionStyles.getPrimarySelectionColor();
};
CSelectionController.prototype.getHighContrastBorderStyle=function(){
return this.m_selectionStyles.getHighContrastBorderStyle();
};
CSelectionController.prototype.getSecondarySelectionColor=function(){
return this.m_selectionStyles.getSecondarySelectionColor();
};
CSelectionController.prototype.resetSelectionStyles=function(){
this.setSelectionStyles();
};
CSelectionController.prototype.setSelectionStyles=function(_280){
switch(_280){
case this.FILTER_SELECTION_STYLE:
if(!this.m_selectionFilterStyles){
this.m_selectionFilterStyles=new CSelectionFilterStyles(this);
}
this.m_selectionStyles=this.m_selectionFilterStyles;
break;
case this.FILTER_SELECTION_CONTEXT_MENU_STYLE:
if(!this.m_selectionFilterContextMenuStyles){
this.m_selectionFilterContextMenuStyles=new CSelectionFilterContextMenuStyles(this);
}
this.m_selectionStyles=this.m_selectionFilterContextMenuStyles;
break;
default:
this.m_selectionStyles=this.m_originalSelectionStyles;
}
};
CSelectionController.prototype.resetAllowHorizontalDataValueSelection=function(){
this.m_bAllowHorizontalDataValueSelection=false;
};
CSelectionController.prototype.setAllowHorizontalDataValueSelection=function(_281){
this.m_bAllowHorizontalDataValueSelection=_281;
};
CSelectionController.prototype.allowHorizontalDataValueSelection=function(){
return this.m_bAllowHorizontalDataValueSelection;
};
CSelectionController.prototype.clearSelectionData=function(){
this.m_aSelectedObjects=[];
this.m_selectedChartNodes=[];
this.m_oSelectedDrillThroughImage=null;
this.m_oSelectedDrillThroughSingleton=null;
};
CSelectionController.prototype.getCCDManager=function(){
return this.m_oCDManager;
};
CSelectionController.prototype.getCtxIdFromDisplayValue=function(_282){
if(!this.m_bUsingCCDManager){
var _283=this.getReportContextDataArray();
var _284=1;
for(var _285 in _283){
var _286=_283[_285];
if(_286[_284]==_282){
return _285;
}
}
return "";
}else{
var sId=this.m_oCDManager.GetContextIdForDisplayValue(_282);
return (sId==null)?"":sId;
}
};
CSelectionController.prototype.getCtxIdFromMetaData=function(sLun,sHun,_28a){
return this.m_oCDManager.getContextIdForMetaData(sLun,sHun,_28a);
};
CSelectionController.prototype.replaceNamespaceForSharedTM1DimensionOnly=function(lun,hun,mun){
var sLun=lun;
var sHun=hun;
if(mun&&mun.indexOf("->:[TM].")>0){
sLun=this.m_oCDManager._replaceNamespaceForSharedTM1DimensionOnly(lun);
sHun=this.m_oCDManager._replaceNamespaceForSharedTM1DimensionOnly(hun);
}
return {"lun":sLun,"hun":sHun};
};
CSelectionController.prototype.getCtxIdFromMun=function(sMun){
if(!this.m_bUsingCCDManager){
var _291=this.getReportMetadataArray();
var _292=0;
for(var sKey in _291){
var _294=_291[sKey];
if(_294[_292]==sMun){
var _295=2;
var _296=this.getReportContextDataArray();
for(var _297 in _296){
var _298=_296[_297];
if(_298[_295]==sKey){
return _297;
}
}
}
}
return "";
}else{
var sId=this.m_oCDManager.GetContextIdForMUN(sMun);
return (sId==null)?"":sId;
}
};
CSelectionController.prototype.canDrillDown=function(_29a){
var _29b=this.getDrillFlagForMember(_29a);
return (_29b==3||_29b==2);
};
CSelectionController.prototype.canDrillUp=function(_29c){
var _29d=this.getDrillFlagForMember(_29c);
return (_29d==3||_29d==1);
};
CSelectionController.prototype.getQueryModelId=function(_29e){
var qmid="";
if(!this.m_bUsingCCDManager){
var _2a0=this.m_aReportContextDataArray[_29e];
if(_2a0&&typeof _2a0[3]!="undefined"){
var _2a1=_2a0[3];
var _2a2=this.m_aReportMetadataArray[_2a1];
if(typeof _2a2!="undefined"&&typeof _2a2[1]!="undefined"&&_2a2[1]=="I"){
qmid=_2a2[0];
}
}
}else{
qmid=this.m_oCDManager.GetQMID(_29e);
}
return qmid;
};
CSelectionController.prototype.getRefQuery=function(_2a3){
if(!this.m_bUsingCCDManager){
return this.getMetaDataItemUseValue(4,_2a3);
}else{
var _2a4=this.m_oCDManager.GetQuery(_2a3);
return (_2a4==null)?"":_2a4;
}
};
CSelectionController.prototype.getRefDataItem=function(_2a5){
return this.m_oCognosViewer.getReportContextHelper().getRefDataItem(_2a5);
};
CSelectionController.prototype.getMun=function(_2a6){
return this.m_oCognosViewer.getReportContextHelper().getMun(_2a6);
};
CSelectionController.prototype.getHun=function(_2a7){
if(!this.m_bUsingCCDManager){
var sHun=null;
var _2a9=this.getRDI(_2a7);
if(_2a9&&_2a9.length>4&&_2a9[1]=="R"){
var _2aa=_2a9[4];
var _2ab=this.getReportMetadataArray();
_2a9=_2ab[_2aa];
}
if(_2a9&&_2a9.length>1&&_2a9[1]=="H"){
sHun=_2a9[0];
}
return sHun;
}else{
return this.m_oCDManager.GetHUN(_2a7);
}
};
CSelectionController.prototype.fetchContextData=function(_2ac,_2ad){
var _2ae=0;
if(this.m_bUsingCCDManager){
_2ae=this.m_oCDManager.FetchContextData(_2ac,_2ad);
}
return _2ae;
};
CSelectionController.prototype.getMetaDataItem=function(sKey){
var _2b0=this.getReportMetadataArray();
if(typeof _2b0[sKey]!="undefined"){
return _2b0[sKey];
}
return null;
};
CSelectionController.prototype.getContextDataItem=function(_2b1){
var _2b2=this.getReportContextDataArray();
if(typeof _2b2[_2b1]!="undefined"){
return _2b2[_2b1];
}
return null;
};
CSelectionController.prototype.getMetaDataItemUseValue=function(_2b3,_2b4){
var _2b5=this.getContextDataItem(_2b4);
if(_2b5!=null){
var _2b6=_2b5[_2b3];
if(_2b6!=""){
var _2b7=this.getMetaDataItem(_2b6);
if(_2b7!=null){
return _2b7[0];
}
}
}
return "";
};
CSelectionController.prototype.getRDI=function(_2b8){
var _2b9=this.getContextDataItem(_2b8);
if(_2b9!=null){
var _2ba=_2b9[0];
if(_2ba!=""){
var _2bb=this.getMetaDataItem(_2ba);
if(_2bb!=null){
return _2bb;
}
}
}
};
CSelectionController.prototype.getNamespace=function(){
return this.m_sNamespace;
};
CSelectionController.prototype.setSelectionBasedFeaturesEnabled=function(_2bc){
this.m_bSelectionBasedFeaturesEnabled=_2bc;
};
CSelectionController.prototype.getSelectionBasedFeaturesEnabled=function(){
return this.m_bSelectionBasedFeaturesEnabled;
};
CSelectionController.prototype.setDrillUpDownEnabled=function(_2bd){
this.m_bDrillUpDownEnabled=_2bd;
};
CSelectionController.prototype.getDrillUpDownEnabled=function(){
return this.m_bDrillUpDownEnabled;
};
CSelectionController.prototype.setModelDrillThroughEnabled=function(_2be){
this.m_bModelDrillThroughEnabled=_2be;
};
CSelectionController.prototype.getBookletItemForCurrentSelection=function(){
var _2bf=this.getAllSelectedObjects();
if(_2bf&&_2bf.length>0){
var _2c0=_2bf[0];
if(_2c0.hasContextInformation()){
var _2c1=this.m_oCDManager.GetBIValue(_2c0.m_contextIds[0][0]);
if(!_2c1){
return null;
}
return _2c1;
}
}
return null;
};
CSelectionController.prototype.getModelPathForCurrentSelection=function(){
var _2c2=null;
var _2c3=this.getBookletItemForCurrentSelection();
if(_2c3){
var _2c2=this.m_oCDManager.getModelPathFromBookletItem(_2c3);
}
return _2c2;
};
CSelectionController.prototype.getModelDrillThroughEnabled=function(){
var _2c4=this.getBookletItemForCurrentSelection();
if(_2c4){
var _2c5=this.m_oCDManager.GetBookletModelBasedDrillThru(_2c4);
return _2c5==1?true:false;
}else{
return this.m_bModelDrillThroughEnabled;
}
};
CSelectionController.prototype.clearSelectedObjects=function(_2c6){
try{
if(!_2c6){
_2c6=document;
}
this.updateUI(_2c6,this.getSelections(),true,false);
this.m_aSelectedObjects=[];
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.resetSelections=function(_2c7){
try{
if(!_2c7){
_2c7=document;
}
if(this.hasSelectedChartNodes()){
this.resetChartSelections(_2c7);
}
this.m_oSelectedDrillThroughImage=null;
this.m_oSelectedDrillThroughSingleton=null;
if(this.getSelections()){
this.updateUI(_2c7,this.getSelections(),true,false);
this.updateUI(_2c7,this.getCutColumns(),true,false);
this.m_aCutColumns=[];
this.m_aSelectedObjects=[];
this.m_selectedClass=[];
this.m_cutClass=[];
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.resetChartSelections=function(_2c8){
var _2c9=this.m_chartHelpers;
for(var _2ca in _2c9){
if(_2c9[_2ca]){
var _2cb=_2c9[_2ca].getImageMapHighlighter();
if(_2cb.hideAllAreas){
_2cb.hideAllAreas();
}
}
}
this.m_selectedChartNodes=[];
this.m_selectionContainerMap=null;
};
CSelectionController.prototype.addSelectionObject=function(_2cc,_2cd){
try{
if(!_2cd){
_2cd=document;
}
var _2ce=_2cc.getCellRef();
if(this.isCellSelected(_2ce)!==true||(typeof _2ce!="object"||_2ce===null)){
if(this.isColumnCut(_2cc.getTag())!==true){
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_2cc;
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
this.updateUI(_2cd,this.getSelections(),false,false);
}
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.removeSelectionObject=function(_2cf,_2d0){
try{
if(!_2d0){
_2d0=document;
}
var _2d1=[];
var _2d2;
for(_2d2=0;_2d2<this.m_aSelectedObjects.length;_2d2++){
var _2d3=this.m_aSelectedObjects[_2d2].getCellRef();
var _2d4=_2cf.getCellRef();
if(typeof _2d3=="object"&&typeof _2d4=="object"&&_2d3!==null&&_2d4!==null){
if(_2d3==_2d4){
_2d1[_2d1.length]=_2d2;
}
}
}
if(_2d1.length>0){
this.updateUI(_2d0,this.getSelections(),true,false);
var _2d5=[];
for(_2d2=0;_2d2<this.m_aSelectedObjects.length;_2d2++){
var _2d6=true;
for(var j=0;j<_2d1.length;j++){
if(_2d2==_2d1[j]){
_2d6=false;
}
}
if(_2d6){
_2d5[_2d5.length]=this.m_aSelectedObjects[_2d2];
}
}
this.m_aSelectedObjects=_2d5;
this.updateUI(_2d0,this.getSelections(),false,false);
}
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.isSavedCellSelected=function(_2d8){
return this.isCellSelectedHelper(_2d8,this.getSavedSelectedObjects());
};
CSelectionController.prototype.isCellSelected=function(_2d9){
return this.isCellSelectedHelper(_2d9,this.getSelections());
};
CSelectionController.prototype.isCellSelectedHelper=function(_2da,_2db){
try{
for(var i=0;i<_2db.length;i++){
var _2dd=_2db[i].getCellRef();
if(typeof _2dd=="object"&&_2dd!==null){
if(_2dd==_2da){
return true;
}
}
}
}
catch(e){
}
return false;
};
CSelectionController.prototype.isColumnSelected=function(_2de){
try{
for(var i=0;i<this.m_aSelectedObjects.length;i++){
if(this.m_aSelectedObjects[i].getTag()==_2de){
return true;
}
}
}
catch(e){
}
return false;
};
CSelectionController.prototype.isColumnCut=function(_2e0){
try{
for(var i=0;i<this.m_aCutColumns.length;i++){
if(this.m_aCutColumns[i].getTag()==_2e0){
return true;
}
}
}
catch(e){
}
return false;
};
CSelectionController.prototype.getSelections=function(){
return this.m_aSelectedObjects;
};
CSelectionController.prototype.selectSingleDomNode=function(_2e2){
this.clearSelectedObjects();
var _2e3=this.getSelectionObjectFactory().getSelectionObject(_2e2);
var _2e4=null;
if(isIE()){
_2e4=_2e2.document;
}else{
_2e4=_2e2.ownerDocument;
}
this.addSelectionObject(_2e3,_2e4);
};
CSelectionController.prototype.hasCutColumns=function(){
if(this.m_aCutColumns.length===0){
return false;
}else{
return true;
}
};
CSelectionController.prototype.setCutColumns=function(_2e5,_2e6){
try{
if(!_2e6){
_2e6=document;
}
this.updateUI(_2e6,this.getSelections(),true,false);
this.updateUI(_2e6,this.getCutColumns(),true,1);
this.m_aCutColumns=[];
if(_2e5===true){
for(var i=0;i<this.m_aSelectedObjects.length;i++){
this.m_aCutColumns[i]=this.m_aSelectedObjects[i];
}
this.m_aSelectedObjects=[];
}
this.updateUI(_2e6,this.getCutColumns(),false,2);
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.getCutColumns=function(){
return this.m_aCutColumns;
};
CSelectionController.prototype.getObservers=function(){
return this.m_oObserver;
};
CSelectionController.prototype.attachObserver=function(_2e8){
this.m_oObserver.attach(_2e8);
};
CSelectionController.prototype.onSelectionChange=function(){
this.getObservers().notify();
};
CSelectionController.prototype.getSelectedColumns=function(_2e9){
var _2ea=[];
if(typeof _2e9=="undefined"){
_2e9=this.getSelections();
}
var _2eb=_2e9.length;
for(var i=0;i<_2eb;i++){
var _2ed=_2e9[i];
var _2ee=true;
for(var j=0;j<_2ea.length;j++){
if(_2ea[j][0]==_2ed.getColumnRef()&&_2ea[j][1]==_2ed.getCellTypeId()){
_2ee=false;
break;
}
}
if(_2ee){
_2ea[_2ea.length]=[_2ed.getColumnRef(),_2ed.getCellTypeId(),_2ed.getLayoutType(),_2ed.getTag(),_2ed.getColumnName()];
}
}
return _2ea;
};
CSelectionController.prototype.getAllSelectedObjectsWithUniqueCTXIDs=function(){
var _2f0=[];
var _2f1=this.getAllSelectedObjects();
for(var i=0;i<_2f1.length;i++){
var _2f3=false;
var _2f4=_2f1[i];
for(var ii=0;ii<_2f0.length;ii++){
if(_2f4.m_contextIds[0][0]==_2f0[ii].m_contextIds[0][0]){
_2f3=true;
break;
}
}
if(!_2f3){
_2f0.push(_2f4);
}
}
return _2f0;
};
CSelectionController.prototype.getAllSelectedObjects=function(){
var _2f6=this.getSelections();
if(this.hasSelectedChartNodes()){
_2f6=_2f6.concat(this.getSelectedChartNodes());
}
return _2f6;
};
CSelectionController.prototype.getSelectedColumnIds=function(_2f7){
var _2f8=[];
if(typeof _2f7=="undefined"){
_2f7=this.getSelections();
}
var _2f9=this.getSelectedColumns(_2f7);
for(var _2fa=0;_2fa<_2f9.length;_2fa++){
var _2fb=true;
for(var _2fc=0;_2fc<_2f8.length;_2fc++){
if(_2f8[_2fc]==_2f9[_2fa][4]){
_2fb=false;
break;
}
}
if(_2fb){
_2f8[_2f8.length]=_2f9[_2fa][4];
}
}
return _2f8;
};
var STYLE_SELECTION={};
CSelectionController.prototype.selecting=function(c,_2fe){
var _2ff="."+c+_2fe;
var doc=document;
var _301=document.getElementById("CVIFrame"+this.m_sNamespace);
if(_301){
doc=_301.contentWindow.document;
}
var _302=doc.createElement("style");
_302.setAttribute("type","text/css");
if(_302.styleSheet){
_302.styleSheet.cssText=_2ff;
}else{
_302.appendChild(doc.createTextNode(_2ff));
}
doc.getElementsByTagName("head").item(0).appendChild(_302);
STYLE_SELECTION[c]=_302;
};
CSelectionController.prototype.deselecting=function(_303){
for(var i=0;i<_303.length;++i){
if(STYLE_SELECTION[_303[i]]){
var node=STYLE_SELECTION[_303[i]];
node.parentNode.removeChild(node);
STYLE_SELECTION[_303[i]]=null;
}
}
if(isIE()&&typeof this.m_oCognosViewer.m_viewerFragment!="undefined"){
var _306=document.getElementById("CVReport"+this.m_oCognosViewer.getId());
if(_306!=null){
var _307=_306.style.display;
_306.style.display="none";
_306.style.display=_307;
}
}
};
CSelectionController.prototype.showViewerContextMenu=function(){
if(this.hasSelectedChartNodes()){
return true;
}
if(this.m_aSelectedObjects&&this.m_aSelectedObjects.length>0){
return true;
}
return false;
};
function getStyleFromClass(c){
for(var i=0;i<document.styleSheets.length;i++){
var ss=document.styleSheets[i];
var _30b=(ss.cssRules?ss.cssRules:ss.rules);
for(var j=0;j<_30b.length;j++){
var cr=_30b[j];
var _30e=new RegExp("\\b"+c+"\\b","g");
if(cr.selectorText&&cr.selectorText.match(_30e)){
return cr;
}
}
}
return 0;
};
CSelectionController.prototype.canUpdateSelection=function(_30f){
return this.m_selectionStyles.canApplyToSelection(_30f);
};
CSelectionController.prototype.setStyleForSelection=function(_310){
return this.m_selectionStyles.setStyleForSelection(_310);
};
CSelectionController.prototype.updateUI=function(_311,_312,_313,_314){
if(!_311){
_311=document;
}
try{
if(_312&&_312.length>0){
var _315,_316,_317;
if(_314==1||_314==2){
if(_313){
this.deselecting(this.m_cutClass);
}else{
var _318=getStyleFromClass("cutSelection").style.color;
var _319=getStyleFromClass("cutSelection").style.backgroundColor;
_315=_312.length;
for(_316=0;_316<_315;_316++){
_317=_312[_316].getCellRef();
var _31a="cutQS"+_317.getAttribute("cid");
this.selecting(_31a,"\n{ background-color: "+_319+"; color: "+_318+";}\n");
this.m_cutClass.push(_31a);
}
}
}else{
if(this.m_oCognosViewer){
this.findSelectionURLs();
_317="";
_315=_312.length;
for(_316=0;_316<_315;_316++){
_317=_312[_316].getCellRef();
if(_317.getAttribute("oldClassName")!=null){
_317.className=_317.getAttribute("oldClassName");
_317.removeAttribute("oldClassName");
}
this.setStyleForSelection(_312[_316].m_contextIds);
if(!this.secondarySelectionIsDisabled()||_313){
var _31b=document.getElementById("CVReport"+this.getNamespace());
var _31c=getElementsByAttribute(_31b,["td","th"],"name",_317.getAttribute("name"),this.m_maxSecondarySelection);
for(var _31d=0;_31d<_31c.length;_31d++){
var cell=_31c[_31d];
if(_313){
this.restoreOldBackgroundImage(cell);
}else{
if(cell.getAttribute("oldBackgroundImageStyle")==null){
this.saveOldCellStyles(cell);
this.setSecondarySelectionStyles(cell);
}
}
}
}
this.saveOldCellStyles(_317);
if(_313){
this.restoreOldBackgroundImage(_317);
if(this.m_oCognosViewer.isHighContrast()){
this.restoreOldBorder(_317);
this.restoreOldPadding(_317);
}
}else{
this.setPrimarySelectionStyles(_317);
if(this.m_oCognosViewer.isHighContrast()){
var size=getBoxInfo(_317,true);
this.saveOldBorder(_317);
this.saveOldPadding(_317,size);
var _320=3;
var _321=size.borderTopWidth+size.paddingTop-_320;
var _322=size.borderBottomWidth+size.paddingBottom-_320;
var _323=size.borderLeftWidth+size.paddingLeft-_320;
var _324=size.borderRightWidth+size.paddingRight-_320;
_317.style.border=_320+"px "+this.getHighContrastBorderStyle()+" black";
_317.style.padding=_321+"px "+_324+"px "+_322+"px "+_323+"px";
}
}
}
}
}
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.findSelectionURLs=function(){
if(!(this.sS_backgroundImageURL&&this.pS_backgroundImageURL)){
if(this.m_oCognosViewer.isBux||isSafari()||this.m_oCognosViewer.isMobile()){
this.pS_backgroundImageURL="url(../common/images/selection_primary.png)";
this.sS_backgroundImageURL="url(../common/images/selection_secondary.png)";
}else{
this.pS_backgroundImageURL=this.getBackgroundImage(getStyleFromClass("primarySelection"));
this.sS_backgroundImageURL=this.getBackgroundImage(getStyleFromClass("secondarySelection"));
}
}
};
CSelectionController.prototype.setSelectedChartImgArea=function(_325){
var _326=true;
var _327=_325.getAttribute("rsvpChart");
var _328=_325.parentNode.getAttribute("chartContainer");
if(_327!="true"&&_328!="true"){
this.m_selectedChartNodes=[];
_326=false;
}else{
var _329=this.getSelectionObjectFactory().getSelectionChartObject(_325);
this.m_selectedChartNodes=[_329];
}
return _326;
};
CSelectionController.prototype.setSelectedChartArea=function(_32a,e){
var _32c=typeof this.m_oCognosViewer.isBux!=="undefined";
var _32d=false;
if(_32a!==null){
if(_32a.tagName=="IMG"){
_32d=this.setSelectedChartImgArea(_32a);
}else{
if(_32a.nodeName=="AREA"&&_32a.attributes["ctx"]){
_32d=true;
if(_32c){
this.setBuxSelectedChartArea(_32a,e);
}else{
this.m_selectedChartNodes=[this.getSelectionObjectFactory().getSelectionChartObject(_32a)];
}
}
}
if(_32d){
this.getObservers().notify();
}
}
return _32d;
};
CSelectionController.prototype.setBuxSelectedChartArea=function(_32e,e){
var _330=this.getChartHelper(_32e);
var _331=_330.getChartNode(_32e);
this.setStyleForSelection(_331.m_contextIds);
var _332=_330.getImageMapHighlighter();
_332.setFillColour(this.getPrimarySelectionColor());
_332.setStrokeColour(this.getPrimarySelectionColor());
if(typeof e=="undefined"){
e={};
}
if(this.ctrlKeyPressed(e)||this.shiftKeyPressed(e)){
if(_332.isAreaHighlighted(_32e)){
_332.hideAreas(_331.getCtxAreas());
var _333=_32e.getAttribute("ctx");
var _334=this.m_selectedChartNodes.length;
for(var i=0;i<_334;i++){
var _336=this.m_selectedChartNodes[i];
if(_333==_336.getContext()){
this.m_selectedChartNodes.splice(i,1);
break;
}
}
}else{
this.updateSelectionContainer(_32e);
_332.highlightAreas(_331.getCtxAreas(),true);
this.m_selectedChartNodes.push(_331);
}
}else{
if(this.hasSavedSelectedChartNodes()){
var _337=this.m_savedSelectedChartNodes.length;
var _338=this.m_savedSelectedChartNodes;
for(var i=0;i<_337;i++){
var area=_338[i].getArea();
var _33a=this.getSavedChartHelper(area);
var _33b=_33a.getImageMapHighlighter();
var _33c=_33b.getAreaId(area);
if(_332.getAreaId(_32e)===_33c){
_33b.hideAreaById(_33c+this.m_savedPrimarySelectionColor);
break;
}
}
}
this.updateSelectionContainer(_32e);
_332.highlightAreas(_331.getCtxAreas());
this.m_selectedChartNodes=[_331];
}
};
CSelectionController.prototype.updateSelectionContainer=function(_33d){
var _33e=_33d.parentNode;
if(this.m_selectionContainerMap&&this.m_selectionContainerMap.name!=_33e.name){
var _33f=this.getChartHelper(_33d).getImageMapHighlighter();
_33f.hideAllAreas();
}
this.m_selectionContainerMap=_33e;
};
CSelectionController.prototype.getChartHelper=function(_340){
var _341=_340.parentNode;
var _342=_341.name;
if(!this.m_chartHelpers[_342]){
this.m_chartHelpers[_342]=new CChartHelper(_340,this.getSelectionObjectFactory(),this.m_oCognosViewer);
}
return this.m_chartHelpers[_342];
};
CSelectionController.prototype.getSavedChartHelper=function(_343){
var _344=_343.parentNode;
var _345=_344.name;
return this.m_savedChartHelpers[_345];
};
CSelectionController.prototype.getSelectedChartArea=function(){
return this.m_selectedChartArea;
};
CSelectionController.prototype.getSelectedChartNodes=function(){
return this.m_selectedChartNodes;
};
CSelectionController.prototype.hasSelectedChartNodes=function(){
return this.m_selectedChartNodes&&this.m_selectedChartNodes.length&&this.m_selectedChartNodes.length>0;
};
CSelectionController.prototype.getSelectedChartImage=function(){
var _346=null;
if(this.hasSelectedChartNodes()){
var _347=this.m_selectedChartNodes[0];
_346=_347.getArea();
}
if(_346===null){
return null;
}
if(_346.tagName=="IMG"){
return _346;
}
return this.getSelectedChartImageFromChartArea(_346);
};
CSelectionController.prototype.getSelectedChartImageFromChartArea=function(_348){
var _349=_348.parentNode;
var _34a="#"+_349.getAttribute("name");
return this.checkChildrenForChart(_349.parentNode,_34a);
};
CSelectionController.prototype.checkChildrenForChart=function(_34b,_34c){
var _34d=_34b.firstChild;
while(_34d!==null){
if(!_34d.tagName){
return null;
}else{
if(_34d.tagName=="IMG"&&_34d.getAttribute("usemap")==_34c){
return _34d;
}else{
if(_34d.tagName==="DIV"||_34d.tagName==="SPAN"){
var _34e=this.checkChildrenForChart(_34d,_34c);
if(_34e){
return _34e;
}
}
}
}
_34d=_34d.nextSibling;
}
return null;
};
CSelectionController.prototype.downloadSelectedChartImage=function(_34f){
var _350=this.getSelectedChartImage();
if(_350!==null){
var _351=this.getDocumentFromImage(_350);
var _352=_350.name.replace(".","_");
var _353=_352.substr(5);
var _354="?m_name=";
_354+=_353;
_354+="&format=png&b_action=xts.run&m=portal/download.xts&m_obj=";
if(isIE()){
_352=_351.parentWindow.eval("graphicSrc"+_353);
}else{
_352=_351.defaultView.eval("graphicSrc"+_353);
}
var _355="";
if(typeof _352!="undefined"&&_352!==null){
var _356=_352.split("&");
if(_356.length===0){
return;
}
if(_352.indexOf("/repository/")<0){
for(var i=0;i<_356.length;++i){
var _358=_356[i];
var _359=_358.indexOf("=");
if(_359!=-1){
var _35a=_358.substr(0,_359);
var _35b=_358.slice(_359+1);
if(_35a=="search"){
_355+=_35b;
break;
}
}
}
}
if(_355==""){
_354=_350.getAttribute("src");
if(_354.indexOf("?")!=-1){
_354+="&download=true";
}else{
_354+="?download=true";
}
}
if(typeof getConfigFrame=="function"){
_354+=_355;
_354=getConfigFrame().constructGETRequestParamsString(_354);
window.open(_354,"_blank","width=0,height=0");
}else{
_354=constructGETRequestParamsString(_354);
_354+=_355;
var _35c=this.m_oCognosViewer.getGateway();
var _35d=document.getElementById("CVIFrame"+this.m_sNamespace);
if(_35d){
var _35e=_35d.src;
if(_35e.indexOf("repository")>=0&&_354.indexOf("repository")<0){
var _35f=_35e.indexOf("content");
_354=_35e.substring(0,_35f)+_354;
}
}
if(_354.indexOf(_35c)==-1){
var _360=document.forms["formWarpRequest"+_34f];
_354=_360.action+_354;
}
if(typeof window.detachLeavingRV=="function"){
window.detachLeavingRV();
}
location.href=_354;
if(typeof window.attachLeavingRV=="function"){
setTimeout(window.attachLeavingRV,100);
}
}
}
}
};
CSelectionController.prototype.getDocumentFromImage=function(_361){
var _362=null;
if(_361.ownerDocument){
_362=_361.ownerDocument;
}else{
_362=_361.document;
}
return _362;
};
CSelectionController.prototype.shouldExecutePageClickedOnMouseDown=function(e){
var _364=this.getSelections();
if(_364.length>1){
if(this.m_oCognosViewer.envParams["ui.action"]!=="view"){
var node=getNodeFromEvent(e);
try{
while(node&&(node.nodeType==3||(node.getAttribute&&node.getAttribute("uid")===null))){
node=node.parentNode;
}
}
catch(ex){
}
var _366=this.getSelectionObjectFactory().getContainerType(node);
if(_366==="list"){
for(var i=0;i<_364.length;i++){
if(_364[i].m_oCellRef==node){
return false;
}
}
}
}
}
return true;
};
CSelectionController.prototype.getContainerType=function(){
var _368="";
if(this.hasSelectedChartNodes()){
_368="chart";
}else{
if(this.getDataContainerType()==="list"){
_368="list";
}else{
_368="crosstab";
}
}
return _368;
};
CSelectionController.prototype.getDisplayValues=function(){
var _369={};
var _36a=this.getAllSelectedObjects()[0];
if(_36a){
var _36b=_36a.getSelectedContextIds();
if(_36b){
for(var axis=0;axis<_36b.length;axis++){
var _36d=[];
var _36e=_36b[axis];
for(var _36f=0;_36f<_36e.length;_36f++){
var _370=_36e[_36f];
var _371=this.getDisplayValue(_370);
_36d.push(_371);
if(axis===0){
break;
}
}
var _372="";
switch(axis){
case 0:
_372="selected";
break;
case 1:
_372="rows";
break;
default:
_372="columns";
}
_369[_372]=_36d;
}
}
}
return _369;
};
CSelectionController.prototype.getChartTooltip=function(){
var _373=this.getAllSelectedObjects()[0];
if(_373){
var area=_373.getArea();
if(area){
var _375=area.getAttribute("title");
if(_375&&_375.length>0){
return area.getAttribute("title");
}
}
}
return "";
};
CSelectionController.prototype.pageClickedForMobile=function(e){
this.pageClicked(e);
var _377=this.getAllSelectedObjects().length;
if(_377==0){
var node=getNodeFromEvent(e,true);
if(!node){
return false;
}
if(node.nodeName.toLowerCase()=="img"&&node.getAttribute("dttargets")){
this.selectDrillThroughImage(node);
return true;
}else{
if(node.getAttribute("dttargets")){
this.selectDrillThroughSingleton(node);
return true;
}else{
if(node.parentNode&&node.parentNode.getAttribute("dttargets")){
this.selectDrillThroughSingleton(node.parentNode);
return true;
}
}
}
return false;
}
return true;
};
CSelectionController.prototype.clearSavedSelections=function(){
this.m_bSavedSelections=false;
if(this.hasSavedSelectedObjects()){
this.updateUI(null,this.getSavedSelectedObjects(),true,false);
delete (this.m_aSavedSelectedObjects);
}
if(this.hasSavedSelectedChartNodes()){
var _379=this.m_savedChartHelpers;
for(var _37a in _379){
if(_379[_37a]){
var _37b=_379[_37a].getImageMapHighlighter();
if(_37b.hideAllAreas){
_37b.hideAllAreas();
}
}
}
delete this.m_savedChartHelpers;
delete this.m_savedSelectedChartNodes;
}
};
CSelectionController.prototype.hasSavedSelectedChartNodes=function(){
return (this.m_savedSelectedChartNodes&&this.m_savedSelectedChartNodes.length>0);
};
CSelectionController.prototype.getSavedSelectedChartNodes=function(){
return this.m_savedSelectedChartNodes;
};
CSelectionController.prototype.saveSelections=function(){
this.m_savedSelectionStyles=this.m_selectionStyles;
if(this.m_aSelectedObjects.length>0){
this.m_aSavedSelectedObjects=[];
var _37c=this.m_aSelectedObjects.length;
var temp=[];
for(var i=0;i<_37c;i++){
if(this.isMeasure(this.m_aSelectedObjects[i].m_contextIds[0][0])){
temp.push(this.m_aSelectedObjects[i]);
}else{
this.m_aSavedSelectedObjects.push(this.m_aSelectedObjects[i]);
}
}
this.m_aSelectedObjects=temp;
}
if(this.hasSelectedChartNodes()){
this.m_savedChartHelpers=this.m_chartHelpers;
this.m_chartHelpers={};
this.m_savedSelectedChartNodes=[];
var _37f=this.m_selectedChartNodes.length;
var temp=[];
for(var i=0;i<_37f;i++){
if(this.isMeasure(this.m_selectedChartNodes[i].m_contextIds[0][0])){
var _380=this.m_selectedChartNodes[i].getArea();
var _381=this.getImageMapName(_380);
this.m_chartHelpers[_381]=this.m_savedChartHelpers[_381];
delete this.m_savedChartHelpers[_381];
temp.push(this.m_selectedChartNodes[i]);
}else{
this.m_savedSelectedChartNodes.push(this.m_selectedChartNodes[i]);
}
}
this.m_selectedChartNodes=temp;
}
this.m_bSavedSelections=true;
};
CSelectionController.prototype.hasSavedSelections=function(){
return this.m_bSavedSelections;
};
CSelectionController.prototype.hasSavedSelectedObjects=function(){
return (this.m_aSavedSelectedObjects&&this.m_aSavedSelectedObjects.length>0)||this.hasSavedSelectedChartNodes();
};
CSelectionController.prototype.getSavedSelectedObjects=function(){
return this.m_aSavedSelectedObjects;
};
CSelectionController.prototype.getImageMapName=function(_382){
var _383=_382.parentNode;
return _383.name;
};
CSelectionController.prototype.repaintBUXSelectedChartArea=function(_384,_385,_386){
var _387={};
var _388=_384.length;
for(var i=0;i<_388;i++){
var _38a=_384[i].getArea();
var _38b=this.getImageMapName(_38a);
var _38c;
if(!_387[_38b]){
_38c=(_385)?this.getSavedChartHelper(_38a):this.getChartHelper(_38a);
_387[_38b]=_38c;
var _38d=_38c.getImageMapHighlighter();
_38d.hideAllAreas();
_38d.setFillColour(this.getPrimarySelectionColor());
_38d.setStrokeColour(this.getPrimarySelectionColor());
}else{
_38c=_387[_38b];
}
var _38e=_384[i].m_contextIds;
if(_386&&_38e.length===1&&_38e[0].length===1&&this.isMeasure(_38e[0][0])){
continue;
}
_38d.highlightAreas(_384[i].getCtxAreas(),1);
}
};
CSelectionController.prototype.repaintSavedSelections=function(){
var _38f=this.m_selectionStyles;
this.m_selectionStyles=this.m_savedSelectionStyles;
var _390=this.getSavedSelectedChartNodes();
var _391=false;
if(_390&&_390.length>0){
bIsChart=true;
}else{
_390=this.getSavedSelectedObjects();
}
this.repaintSelectionsHelper(_390,true,_391);
this.resetSelectionStyles();
this.m_selectionStyles=_38f;
};
CSelectionController.prototype.repaintSelections=function(){
var _392=this.getSelectedChartNodes();
var _393=false;
if(_392&&_392.length>0){
_393=true;
}else{
_392=this.getSelections();
}
this.repaintSelectionsHelper(_392,false,_393);
};
CSelectionController.prototype.repaintSelectionsHelper=function(_394,_395,_396){
try{
if(_396){
this.repaintBUXSelectedChartArea(_394,_395);
}else{
this.updateUI(document,_394,true,false);
this.updateUI(document,_394,false,false);
}
}
catch(e){
return false;
}
};
CSelectionController.prototype.resetAll=function(){
this.resetSelectionStyles();
this.clearSavedSelections();
this.resetSelections();
this.resetAllowHorizontalDataValueSelection();
};
CSelectionController.prototype.pageClicked=function(e){
try{
var node=getNodeFromEvent(e);
if(this.m_aSelectedObjects.length>0&&!this.shiftKeyPressed(e)&&!this.ctrlKeyPressed(e)){
var _399=node;
if(!_399.getAttribute("uid")){
var _39a=_399.parentNode;
if(_39a&&_39a.nodeType==1&&typeof _39a.getAttribute!="undefined"&&_39a.getAttribute("uid")!=null){
_399=_39a;
}
}
if(this.isCellSelected(_399)){
if(typeof this.m_oCognosViewer.isBux!=="undefined"){
this.repaintSelections();
}
if(e.button!==0){
return false;
}
}
}
if(node.tagName&&node.tagName.toUpperCase()=="INPUT"){
return true;
}
if((e.keyCode!=null)&&(e.keyCode!=13)&&(e.keyCode!=32)&&(e.keyCode!=27)&&(e.keyCode!=0)&&(e.keyCode!=121)&&(e.keyCode!=93)){
return false;
}
var _39b=getDocumentFromEvent(e);
if(!this.hasContextData()||!this.hasMetadata()){
if(node.nodeName=="AREA"||node.nodeName=="IMG"||(typeof node.getAttribute=="function"&&node.getAttribute("flashChart")!=null)){
this.setSelectedChartArea(node,e);
}
this.getObservers().notify();
return false;
}
if(typeof node.selectedCell!="undefined"){
var _39c=node;
node=node.selectedCell;
_39c.removeAttribute("selectedCell");
}
if(typeof cf!="undefined"&&typeof cf.hidePickers=="function"){
cf.hidePickers();
}
if(e.keyCode==27){
if(typeof g_reportSelectionController!="undefined"){
g_reportSelectionController.clearSelections();
}
this.resetSelections(_39b);
}else{
if(node.nodeName=="AREA"||node.nodeName=="IMG"||(typeof node.getAttribute!="undefined"&&node.getAttribute("flashChart")!=null)){
if(e.button!==2||this.getAllSelectedObjects().length<=1||typeof this.m_oCognosViewer.isBux==="undefined"){
this.selectNode(node,e);
this.setSelectedChartArea(node,e);
}
}else{
if(!(node.firstChild==null&&node.cellIndex==0&&node.parentNode.rowIndex==0&&node.getAttribute("cid")==null)){
var _39d=this.m_oCognosViewer.getViewerWidget();
this.selectNode(node,e);
}
}
}
if(window.gViewerLogger){
window.gViewerLogger.addContextInfo(this);
}
}
catch(e){
}
};
CSelectionController.prototype.getSelectionObjectFactory=function(){
return this.m_oSelectionObjectFactory;
};
CSelectionController.prototype.isDrillLinkOnCrosstabCell=function(node){
return (node.getAttribute("ctx")==null&&node.parentNode.getAttribute("dtTargets")!=null);
};
CSelectionController.prototype.selectObject=function(sMun,sLun,sHun,_3a2){
var _3a3=this.getCtxIdFromMun(sMun);
if(_3a3==""){
_3a3=this.getCtxIdFromMetaData(sLun,sHun,_3a2);
}
if(_3a3!=null&&this.m_oCDManager.GetUsage(_3a3)!="2"){
var _3a4=document.getElementById("rt"+this.getNamespace());
if(_3a4!=null){
var _3a5=getElementsByAttribute(_3a4,"*","ctx",_3a3);
if(_3a5&&_3a5.length===0){
var _3a6=new RegExp("(^|:)"+_3a3+"(:|$)","i");
_3a5=getElementsByAttribute(_3a4,"*","ctx",_3a3,-1,_3a6);
}
var _3a7=null;
if(_3a5!=null&&_3a5.length>0){
_3a7=new CSelectionObject();
_3a7.setSelectionController(this);
_3a7.m_sColumnRef=_3a5[0].getAttribute("cid");
_3a7.m_sCellTypeId=_3a5[0].getAttribute("uid");
_3a7.m_sLayoutType=_3a5[0].getAttribute("type");
_3a7.m_sTag=_3a5[0].getAttribute("tag");
_3a7.m_layoutElementId=this.m_oSelectionObjectFactory.getLayoutElementId(_3a5[0]);
_3a7.m_dataContainerType=this.m_oSelectionObjectFactory.getContainerType(_3a5[0]);
_3a7.m_contextIds=[[_3a3]];
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_3a7;
}else{
var _3a8=getElementsByAttribute(_3a4,"*","flashChart","true");
if(_3a8!=null){
for(var _3a9=0;_3a9<_3a8.length;++_3a9){
var ldx=_3a8[_3a9].getLDX();
if(ldx.indexOf("<ctx>"+_3a3+"</ctx>")!=-1){
_3a7=new CSelectionObject();
_3a7.setSelectionController(this);
var lid=_3a8[_3a9].getAttribute("lid");
_3a7.m_layoutElementId=lid.replace(this.m_oCognosViewer.getId(),"");
_3a7.m_dataContainerType="chart";
_3a7.m_contextIds=[[_3a3]];
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_3a7;
}
}
}
}
}
}
};
CSelectionController.prototype.buildSelectionObject=function(node,e){
var _3ae=null;
try{
while(node.nodeType==3){
node=node.parentNode;
}
if(this.isDrillLinkOnCrosstabCell(node)){
node=node.parentNode;
}
var ctx=node.getAttribute("ctx");
var uid=node.getAttribute("uid");
if((uid==null)&&((ctx!=null)||(node.parentNode&&node.parentNode.nodeType==1&&typeof node.parentNode.getAttribute!="undefined"&&node.parentNode.getAttribute("uid")!=null))){
if(node.nodeName=="IMG"&&(node.src.indexOf("SM=")>-1||(isIE()>-1&&node.src.indexOf("space.gif")>-1))){
return null;
}
node=node.parentNode;
if((node.className.toUpperCase()=="BLOCK"&&node.nodeName.toUpperCase()=="DIV")||(node.getAttribute("dtTargets")!=null)){
node=node.parentNode;
}
uid=node.getAttribute("uid");
}
if(uid!=null){
var _3b1=node.childNodes;
for(var i=0;i<_3b1.length;i++){
if(_3b1[i].nodeName.toUpperCase()=="TABLE"&&(_3b1[i].className=="ls"||_3b1[i].className=="xt")){
var trs=_3b1[i].rows;
for(var j=0;j<trs.length;j++){
var tds=trs[j].cells;
for(var k=0;k<tds.length;k++){
if(tds[k].getAttribute("uid")!=null){
return null;
}
}
}
}
}
if(node.className.toUpperCase()=="REPEATERTABLECELL"&&ctx!=null){
_3ae=this.getSelectionObjectFactory().getSelectionObject(node,ctx);
}else{
_3ae=this.getSelectionObjectFactory().getSelectionObject(node);
}
}
}
catch(e){
}
return _3ae;
};
CSelectionController.prototype.shiftKeyPressed=function(e){
if(e.keyCode=="121"){
return false;
}
if(isSafari()){
if(e.button!=2){
return e.shiftKey?e.shiftKey:false;
}else{
return false;
}
}
return e.shiftKey?e.shiftKey:false;
};
CSelectionController.prototype.ctrlKeyPressed=function(e){
if(isSafari()){
if(e.button!=2){
return e.ctrlKey?e.ctrlKey:false;
}else{
return false;
}
}
return e.ctrlKey?e.ctrlKey:false;
};
CSelectionController.prototype.isSelectionsPreviouslySaved=function(_3b9){
var _3ba=false;
if(!this.m_aSavedSelectedObjects||!this.m_aSavedSelectedObjects.length||!_3b9||!_3b9.length){
return false;
}
for(var i=0;i<_3b9.length;i++){
if(this.isSavedCellSelected(_3b9[i].getCellRef())){
return true;
}
}
return false;
};
CSelectionController.prototype.selectNode=function(node,e){
try{
while(node.nodeType==3){
node=node.parentNode;
}
if(this.isDrillLinkOnCrosstabCell(node)){
node=node.parentNode;
}
var _3be=null;
if(isIE()){
_3be=node.document;
}else{
_3be=node.ownerDocument;
}
var ctx=node.getAttribute("ctx");
var uid=node.getAttribute("uid");
var _3c1=false;
if(typeof e=="undefined"){
e={};
}
var _3c2=false;
if(typeof g_reportSelectionController!="undefined"){
_3c2=this.checkForReportElementNode(node);
}
if((ctx==null&&uid==null&&node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")==null&&_3c2==false)||(!this.ctrlKeyPressed(e)&&!this.shiftKeyPressed(e))){
if(this.getSelections().length>0){
_3c1=true;
}
if(this.hasCutColumns()==true){
this.clearSelectedObjects(_3be);
}else{
this.resetSelections(_3be);
this.repaintSavedSelections();
if(typeof cf!="undefined"&&typeof cf.removeAllSelectionsFromCfgVariables=="function"){
cf.removeAllSelectionsFromCfgVariables();
}
this.m_oCognosViewer.setCurrentNodeFocus(null);
}
if(this.ctrlKeyPressed(e)||this.shiftKeyPressed(e)){
clearTextSelection(_3be);
}
if(typeof g_reportSelectionController!="undefined"&&_3c2==false){
if(g_reportSelectionController.getSelections().length>0){
_3c1=true;
}
g_reportSelectionController.clearSelections();
}
}
var _3c3=node.getAttribute("dtTargets")?node:null;
var _3c4=(node.nodeName.toLowerCase()==="area");
if((uid==null)&&((ctx!=null)||(node.parentNode&&node.parentNode.nodeType==1&&typeof node.parentNode.getAttribute!="undefined"))){
if(node.nodeName=="IMG"&&(node.src.indexOf("SM=")>-1||(isIE()>-1&&node.src.indexOf("space.gif")>-1))){
return false;
}
node=node.parentNode;
_3c3=(!_3c3&&node.getAttribute("dtTargets"))?node:_3c3;
if((node.className.toUpperCase()=="BLOCK"&&node.nodeName.toUpperCase()=="DIV")||(node.getAttribute("dtTargets")!=null)){
node=node.parentNode;
}
_3c3=(!_3c3&&typeof node.getAttribute!="undefined"&&node.getAttribute("dtTargets"))?node:_3c3;
uid=(typeof node.getAttribute!="undefined")?node.getAttribute("uid"):null;
if(uid==null&&node.nodeName.toLowerCase()=="span"&&node.parentNode.nodeName.toLowerCase()=="td"){
node=node.parentNode;
uid=node.getAttribute("uid");
}
}
if(uid!=null){
var _3c5=node.childNodes;
for(var i=0;i<_3c5.length;i++){
if(_3c5[i].nodeName.toUpperCase()=="TABLE"&&(_3c5[i].className=="ls"||_3c5[i].className=="xt")){
var trs=_3c5[i].rows;
for(var j=0;j<trs.length;j++){
var tds=trs[j].cells;
for(var k=0;k<tds.length;k++){
if(tds[k].getAttribute("uid")!=null){
return false;
}
}
}
}
}
var _3cb;
if(node.className.toUpperCase()=="REPEATERTABLECELL"&&ctx!=null){
_3cb=this.getSelectionObjectFactory().getSelectionObject(node,ctx);
}else{
_3cb=this.getSelectionObjectFactory().getSelectionObject(node);
}
if(this.isCellSelected(node)==false){
if(this.shiftKeyPressed(e)){
var _3cc=this.getSelections();
if(_3cc.length>0){
var _3cd=_3cc[_3cc.length-1];
if(_3cd.getLayoutType()==_3cb.getLayoutType()&&(_3cd.getCellRef().parentNode.parentNode==_3cb.getCellRef().parentNode.parentNode)){
if(this.cellsAreInSameColumn(_3cd.getCellRef(),_3cb.getCellRef())){
this.selectVertical(_3cd,_3cb,_3be);
}else{
if(_3cd.getCellRef().parentNode.rowIndex==_3cb.getCellRef().parentNode.rowIndex){
this.selectHorizontal(_3cd,_3cb,_3be);
}
}
}
}
clearTextSelection(_3be);
}else{
if(this.ctrlKeyPressed(e)){
clearTextSelection(_3be);
}
}
this.addSelectionObject(_3cb,_3be);
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_3cb.getColumnName());
}
this.m_oCognosViewer.setCurrentNodeFocus(node);
}else{
if(this.ctrlKeyPressed(e)){
this.removeSelectionObject(_3cb,_3be);
if(typeof cf!="undefined"&&typeof cf.removeSelectionFromCfgVariables=="function"){
if(!this.isColumnSelected(_3cb.getTag())){
cf.removeSelectionFromCfgVariables(_3cb.getTag());
}
}
clearTextSelection(_3be);
}else{
if(this.shiftKeyPressed(e)){
clearTextSelection(_3be);
}
}
}
_3c1=true;
}else{
if(_3c2){
var _3ce=null;
while((typeof node.id=="undefined"||node.id==null||node.id=="")&&node.parentNode!=null){
node=node.parentNode;
}
if(node.id=="reportTitle"){
_3ce="TitleStyle";
}else{
if(node.id=="reportSubtitle"){
_3ce="SubtitleStyle";
}else{
if(node.id.indexOf("reportFilter")==0){
_3ce="FilterStyle";
}
}
}
if(_3ce!=null){
selectReportElement(e,node.id,_3ce);
_3c1=true;
}
}else{
if(_3c3!=null&&this.m_oCognosViewer&&this.m_oCognosViewer.isMobile()&&!_3c4){
var _3cb=this.getSelectionObjectFactory().getSelectionObject(_3c3);
this.addSelectionObject(_3cb,_3be);
}
}
}
if(_3c1==true&&(typeof cf!="undefined"&&typeof cf.refreshDialog=="function")){
cf.refreshDialog();
}
}
catch(ex){
}
};
CSelectionController.prototype.selectDrillThroughImage=function(node){
this.m_oSelectedDrillThroughImage=node;
};
CSelectionController.prototype.getSelectedDrillThroughImage=function(){
return this.m_oSelectedDrillThroughImage?this.m_oSelectedDrillThroughImage:null;
};
CSelectionController.prototype.selectDrillThroughSingleton=function(node){
this.m_oSelectedDrillThroughSingleton=node;
};
CSelectionController.prototype.getSelectDrillThroughSingleton=function(){
return this.m_oSelectedDrillThroughSingleton?this.m_oSelectedDrillThroughSingleton:null;
};
CSelectionController.prototype.getReportContextDataArray=function(){
return this.m_aReportContextDataArray;
};
CSelectionController.prototype.getReportMetadataArray=function(){
return this.m_aReportMetadataArray;
};
CSelectionController.prototype.setupContextDataArray=function(_3d1){
this.m_aReportContextDataArray=_3d1;
};
CSelectionController.prototype.setupMetaDataArray=function(_3d2){
this.m_aReportMetadataArray=_3d2;
};
CSelectionController.prototype.addContextData=function(_3d3){
this.m_aSelectedObjects=[];
this.m_oCDManager.SetContextData(_3d3);
if(!this.m_bUsingCCDManager){
this.m_bUsingCCDManager=true;
}
for(var i=0;i<this.m_selectedClass.length;++i){
this.deselecting(this.m_selectedClass);
}
};
CSelectionController.prototype.addMetaData=function(_3d5){
this.m_aSelectedObjects=[];
this.m_oCDManager.SetMetadata(_3d5);
if(!this.m_bUsingCCDManager){
this.m_bUsingCCDManager=true;
}
};
CSelectionController.prototype.getDrillFlag=function(_3d6){
var _3d7="";
if(!this.m_bUsingCCDManager){
var _3d8=this.m_aReportContextDataArray[_3d6];
var _3d9=_3d8[0];
var _3da=this.m_aReportMetadataArray[_3d9];
if(typeof _3da!="undefined"&&typeof _3da[3]!="undefined"){
_3d7=_3da[3];
}
}else{
_3d7=this.m_oCDManager.GetDrillFlag(_3d6);
}
return _3d7;
};
CSelectionController.prototype.getDrillFlagForMember=function(_3db){
var _3dc="0";
if(!this.m_bUsingCCDManager){
var _3dd=this.getContextDataItem(_3db);
if(_3dd!=null){
var _3de=_3dd[2];
if(_3de!=""){
var _3df=_3dd[0];
var _3e0=this.getMetaDataItem(_3df);
if(_3e0!=null){
_3dc=_3e0[3];
}
}
}
}else{
_3dc=this.m_oCDManager.GetDrillFlagForMember(_3db);
}
return (_3dc==null)?0:_3dc;
};
CSelectionController.prototype.getDataType=function(_3e1){
var _3e2=null;
if(!this.m_bUsingCCDManager){
var _3e3=this.getRDI(_3e1);
if(_3e3&&_3e3.length>2){
_3e2=parseInt(_3e3[2],10);
}
}else{
_3e2=parseInt(this.m_oCDManager.GetDataType(_3e1),10);
}
return _3e2;
};
CSelectionController.prototype.getUsageInfo=function(_3e4){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetUsage(_3e4);
}
};
CSelectionController.prototype.isMeasure=function(_3e5){
return (this.getUsageInfo(_3e5)==this.c_usageMeasure);
};
CSelectionController.prototype.getDepth=function(_3e6){
var _3e7=null;
if(!this.m_bUsingCCDManager){
var _3e8=this.getRDI(_3e6);
if(_3e8&&_3e8.length>5&&_3e8[1]=="R"){
_3e7=_3e8[5];
}
}else{
_3e7=this.m_oCDManager.GetDepth(_3e6);
}
return _3e7;
};
CSelectionController.prototype.getUseValue=function(_3e9){
var _3ea="";
if(!this.m_bUsingCCDManager){
var _3eb=this.m_aReportContextDataArray[_3e9];
if(typeof _3eb[1]!="undefined"){
_3ea=_3eb[1];
}
}else{
_3ea=this.m_oCDManager.GetDisplayValue(_3e9);
}
return _3ea;
};
CSelectionController.prototype.getTextValue=function(_3ec){
var _3ed=null;
for(var _3ee=0;_3ee<_3ec.length;_3ee++){
if(_3ec[_3ee].style.visisbility!="hidden"){
if(isIE()){
_3ed=_3ec[_3ee].innerText;
}else{
_3ed=_3ec[_3ee].textContent;
}
var _3ef=_3ec[_3ee].nextSibling;
while(_3ef!=null){
if(_3ef.nodeName.toUpperCase()=="SPAN"&&_3ef.style.visibility!="hidden"){
if(isIE()){
_3ed+=_3ef.innerText;
}else{
_3ed+=_3ef.textContent;
}
}
_3ef=_3ef.nextSibling;
}
break;
}
}
return _3ed;
};
CSelectionController.prototype.getDisplayValueFromDOM=function(_3f0,_3f1){
var _3f2=null;
var _3f3;
var _3f4=new RegExp("(^|\\s)"+_3f0+"(\\s|$|:)","i");
if(typeof _3f1!="undefined"){
_3f3=getElementsByAttribute(_3f1,["span","td","th"],"ctx",_3f0,1,_3f4);
}else{
var _3f5=document.getElementById("CVIFrame"+this.m_sNamespace);
if(typeof _3f5=="undefined"||_3f5==null){
var _3f6=document.getElementById("RVContent"+this.m_sNamespace);
if(typeof _3f6=="undefined"||_3f6==null){
_3f3=getElementsByAttribute(document.body,["span","td","th"],"ctx",_3f0,1,_3f4);
}else{
_3f3=getElementsByAttribute(_3f6,["span","td","th"],"ctx",_3f0,1,_3f4);
}
}else{
_3f3=getElementsByAttribute(_3f5.contentWindow.document.body,["span","td","th"],"ctx",_3f0,1,_3f4);
}
}
var _3f7;
if(_3f3.length>0&&(_3f3[0].nodeName.toUpperCase()=="TD"||_3f3[0].nodeName.toUpperCase()=="TH")){
_3f7=_3f3[0].childNodes;
}else{
_3f7=_3f3;
}
if(_3f7.length==0||(_3f7[0].className.indexOf("chart_area")==-1&&_3f7[0].className.indexOf("bux-comment")==-1)){
_3f2=this.getTextValue(_3f7);
}
return _3f2;
};
CSelectionController.prototype.getDisplayValue=function(_3f8,_3f9){
var _3fa=this.getDisplayValueFromDOM(_3f8,_3f9);
if(_3fa==null){
_3fa=this.getUseValue(_3f8);
}
return _3fa;
};
CSelectionController.prototype.getDun=function(_3fb){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetDUN(_3fb);
}else{
var _3fc=this.m_aReportContextDataArray[_3fb];
if(_3fc&&typeof _3fc[5]!="undefined"){
var _3fd=_3fc[5];
var _3fe=this.m_aReportMetadataArray[_3fd];
if(typeof _3fe!="undefined"&&typeof _3fe[1]!="undefined"&&_3fe[1]=="D"){
return _3fe[0];
}
}
}
};
CSelectionController.prototype.getPun=function(_3ff){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetPUN(_3ff);
}
};
CSelectionController.prototype.getLun=function(_400){
var lun="";
if(!this.m_bUsingCCDManager){
var _402=this.m_aReportContextDataArray[_400];
if(_402&&typeof _402[3]!="undefined"){
var _403=_402[3];
var _404=this.m_aReportMetadataArray[_403];
if(typeof _404!="undefined"&&typeof _404[1]!="undefined"&&_404[1]=="L"){
lun=_404[0];
}
}
}else{
lun=this.m_oCDManager.GetLUN(_400);
}
return lun;
};
CSelectionController.prototype.isContextId=function(_405){
var _406=false;
if(!this.m_bUsingCCDManager){
var _407=this.m_aReportContextDataArray[_405];
_406=(typeof _407=="object");
}else{
this.m_oCDManager.FetchContextData([_405]);
_406=this.m_oCDManager.ContextIdExists(_405);
}
return _406;
};
CSelectionController.prototype.hasContextData=function(){
var _408=false;
if(!this.m_bUsingCCDManager){
if(this.m_aReportContextDataArray&&this.m_aReportContextDataArray.length&&this.m_aReportContextDataArray.length()>0){
return true;
}
}else{
_408=this.m_oCDManager.HasContextData();
}
return _408;
};
CSelectionController.prototype.hasMetadata=function(){
var _409=false;
if(!this.m_bUsingCCDManager){
if(this.m_aReportMetadataArray&&this.m_aReportMetadataArray.length&&this.m_aReportMetadataArray.length()>0){
return true;
}
}else{
_409=this.m_oCDManager.HasMetadata();
}
return _409;
};
CSelectionController.prototype.getDifferentCellIndex=function(_40a,_40b,_40c){
for(var i=0;i<_40a.cells.length;i++){
if(this.getSelectionObjectFactory().getSelectionObject(_40a.cells[i]).getLayoutType()=="datavalue"){
break;
}
}
if(_40c=="relative"){
return (_40b-i);
}else{
if(_40c=="actual"){
return (_40b+i);
}
}
};
CSelectionController.prototype.cellsAreInSameColumn=function(_40e,_40f){
if(_40e.parentNode.rowIndex==_40f.parentNode.rowIndex){
return false;
}
if(_40e.getAttribute("cid")===null){
if(_40e.getAttribute("uid")===_40f.getAttribute("uid")){
if(_40e.getAttribute("type")!="datavalue"){
return true;
}else{
if(this.getDifferentCellIndex(_40e.parentNode,_40e.cellIndex,"relative")==this.getDifferentCellIndex(_40f.parentNode,_40f.cellIndex,"relative")){
return true;
}
}
}else{
return false;
}
}else{
if(_40e.getAttribute("cid")===_40f.getAttribute("cid")){
return true;
}else{
return false;
}
}
};
CSelectionController.prototype.selectVertical=function(_410,_411,_412){
if(!_412){
_412=document;
}
var _413=_410.getCellRef().parentNode;
var _414,i;
var _416=(_410.getCellRef().parentNode.rowIndex<_411.getCellRef().parentNode.rowIndex);
var _417=(_410.getCellRef().parentNode.cells.length-_410.getCellRef().cellIndex);
while(_413.rowIndex!=_411.getCellRef().parentNode.rowIndex){
if(_416){
_413=_413.nextSibling;
}else{
_413=_413.previousSibling;
}
if(_413==null){
break;
}
if(_413.cells.length>=_417){
for(i=0;i<_413.cells.length;i++){
if((_413.cells[i].getAttribute("type")==_410.getLayoutType())&&this.cellsAreInSameColumn(_410.getCellRef(),_413.cells[i])){
_414=this.getSelectionObjectFactory().getSelectionObject(_413.cells[i]);
if(this.addSelectionObject(_414,_412)){
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_414.getColumnName());
}
}
break;
}
}
}
}
};
CSelectionController.prototype.selectHorizontal=function(_418,_419,_41a){
var _41b="";
if(_418.getColumnRef()==null){
if(_418.getCellRef().getAttribute("uid")==_419.getCellRef().getAttribute("uid")){
_41b=_418.getCellRef().getAttribute("uid");
}else{
return;
}
}
var _41c,_41d;
var _41e=_419.getCellRef().parentNode;
var _41f;
if(_419.getCellRef().cellIndex<_418.getCellRef().cellIndex){
_41c=_419.getCellRef().cellIndex;
_41d=_418.getCellRef().cellIndex;
}else{
_41d=_419.getCellRef().cellIndex;
_41c=_418.getCellRef().cellIndex;
}
for(var i=_41c+1;i<_41d;i++){
if(((_418.getColumnRef()!=null)&&(_418.getLayoutType()==_419.getLayoutType())&&(_418.getLayoutType()!="datavalue")||this.allowHorizontalDataValueSelection())||((_418.getColumnRef()==null)&&(_41e.cells[i].getAttribute("uid")==_41b))){
_41f=this.getSelectionObjectFactory().getSelectionObject(_41e.cells[i]);
if(this.addSelectionObject(_41f,_41a)){
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_41f.getColumnName());
}
}
}
}
};
CSelectionController.prototype.pageDoubleClicked=function(e){
try{
var node=getNodeFromEvent(e);
if(typeof node.selectedCell!="undefined"){
var _423=node;
node=node.selectedCell;
_423.removeAttribute("selectedCell");
}
while(node.nodeType==3){
node=node.parentNode;
}
var ctx=node.getAttribute("ctx");
var uid=node.getAttribute("uid");
if((ctx!=null)||(node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")!=null)){
node=node.parentNode;
if(node.className.toUpperCase()=="BLOCK"&&node.nodeName.toUpperCase()=="DIV"){
node=node.parentNode;
}
uid=node.getAttribute("uid");
}
if(uid!=null&&node.firstChild!=null&&(node.getAttribute("type")=="columnTitle"||node.getAttribute("type")=="section")){
if(typeof goWindowManager!="undefined"&&goWindowManager&&typeof goWindowManager.getApplicationFrame=="function"){
goWindowManager.getFeatureManager().launchFeature("Rename");
}
}
if(typeof g_reportSelectionController!="undefined"){
g_reportSelectionController.clearSelections();
}
}
catch(ex){
}
};
CSelectionController.prototype.getSelectionHoverNodes=function(){
return this.m_aSelectionHoverNodes;
};
CSelectionController.prototype.setSelectionHoverNodes=function(_426){
this.m_aSelectionHoverNodes=_426;
};
CSelectionController.prototype.addSelectionHoverNode=function(node){
this.m_aSelectionHoverNodes[this.m_aSelectionHoverNodes.length]=node;
};
CSelectionController.prototype.pageHover=function(e){
try{
var node=getNodeFromEvent(e);
while(node.nodeType==3){
node=node.parentNode;
}
if((node.getAttribute("ctx")!=null)||(node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")!=null)){
if(node.parentNode.nodeName.toLowerCase()!="tr"){
node=node.parentNode;
}
}
var _42a=this.getSelectionHoverNodes();
var _42b=this.getAllSelectedObjects().length;
if(!(_42a.length==1&&_42a[0]==node)){
for(var i=0;i<_42a.length;i++){
this.sortIconHover(_42a[i],true);
if(_42b==0){
this.pageChangeHover(_42a[i],true);
}
}
this.setSelectionHoverNodes([]);
if(_42b==0){
this.sortIconHover(node,false);
if(this.pageChangeHover(node,false)){
this.addSelectionHoverNode(node);
}
}else{
if(this.sortIconHover(node,false)){
this.addSelectionHoverNode(node);
}
}
}
}
catch(ex){
}
};
CSelectionController.prototype.sortIconHover=function(node,_42e){
if(!this.isValidColumnTitle(node)){
return false;
}
var _42f=this.getSortImgNode(node);
if(_42f!=null&&_42f!="undefined"){
if(_42f.getAttribute("sortOrder")==="nosort"){
if(_42e){
_42f.style.visibility="hidden";
}else{
_42f.style.visibility="visible";
}
}
return true;
}
return false;
};
CSelectionController.prototype.isValidColumnTitle=function(node){
if(node&&node.parentNode){
var uid=node.getAttribute("uid");
if(uid!=null&&(!(node.firstChild==null&&node.cellIndex==0&&node.parentNode.rowIndex==0&&node.getAttribute("cid")==null))&&(node.getAttribute("type")=="columnTitle"||node.getAttribute("type")=="section")){
return true;
}
}
return false;
};
CSelectionController.prototype.pageChangeHover=function(node,_433){
try{
if((node.getAttribute("ctx")!=null)||(node.parentNode&&node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")!=null)){
if(node.parentNode.nodeName.toLowerCase()!="tr"){
node=node.parentNode;
}
}
if(this.isValidColumnTitle(node)){
var _434=this.isColumnSelected(node.getAttribute("tag"));
if(!_434){
_434=this.isColumnCut(node.getAttribute("tag"));
}
if(!_434){
if(_433){
if(node.getAttribute("oldClassName")!=null){
node.className=node.getAttribute("oldClassName");
node.removeAttribute("oldClassName");
}
this.restoreOldBackgroundImage(node);
}else{
if(node.getAttribute("oldClassName")!=null){
node.className=node.getAttribute("oldClassName");
}else{
node.setAttribute("oldClassName",node.className);
}
if(node.getAttribute("oldBackgroundImageStyle")!=null){
node.style.backgroundImage=node.getAttribute("oldBackgroundImageStyle");
}else{
this.saveOldCellStyles(node);
}
node.className+=" hoverSelection";
return true;
}
}
}
}
catch(ex){
}
return false;
};
CSelectionController.prototype.getSortImgNode=function(node){
var _436=node.getElementsByTagName("img");
for(var i=0;i<_436.length;i++){
var sId=_436[i].id.toString();
if(sId!=null&&sId.length>0&&sId.indexOf("sortimg")>=0){
node=_436[i];
return node;
}
}
return null;
};
CSelectionController.prototype.restoreOldPadding=function(node){
if(node&&node.style&&node.getAttribute("oldPaddingStyle")!=null){
if(node.getAttribute("oldPaddingStyle").length>0){
node.style.padding=node.getAttribute("oldPaddingStyle");
}
node.removeAttribute("oldPaddingStyle");
}
};
CSelectionController.prototype.saveOldPadding=function(node,size){
if(node&&node.getAttribute("oldPaddingStyle")==null){
node.setAttribute("oldPaddingStyle",size.paddingTop+"px "+size.paddingRight+"px "+size.paddingBottom+"px "+size.paddingLeft+"px");
}
};
CSelectionController.prototype.saveOldBorder=function(node){
if(node&&node.getAttribute("oldBorderStyle")==null){
node.setAttribute("oldBorderStyle",node.style.border);
}
};
CSelectionController.prototype.restoreOldBorder=function(node){
if(node&&node.style&&node.getAttribute("oldBorderStyle")!=null){
if(node.getAttribute("oldBorderStyle").length>0){
node.style.border=node.getAttribute("oldBorderStyle");
}else{
node.style.borderColor=node.style.borderWidth=node.style.borderStyle="";
}
node.removeAttribute("oldBorderStyle");
}
};
CSelectionController.prototype.setPrimarySelectionStyles=function(cell){
if(this.getPrimarySelectionColor()){
cell.style.backgroundColor=this.getPrimarySelectionColor();
}else{
cell.style.backgroundImage=this.pS_backgroundImageURL;
cell.style.backgroundRepeat="repeat";
}
};
CSelectionController.prototype.setSecondarySelectionStyles=function(cell){
if(this.getSecondarySelectionColor()){
cell.style.backgroundColor=this.getSecondarySelectionColor();
}else{
cell.style.backgroundImage=this.sS_backgroundImageURL;
cell.style.backgroundRepeat="repeat";
}
};
CSelectionController.prototype.saveOldCellStyles=function(node){
if(node&&node.getAttribute("oldBackgroundImageStyle")==null){
node.setAttribute("oldBackgroundColor",this.getStyleProperty(node,"backgroundColor"));
node.setAttribute("oldBackgroundImageStyle",this.getBackgroundImage(node));
node.setAttribute("oldBackgroundRepeat",this.getStyleProperty(node,"backgroundRepeat"));
node.style.backgroundImage="";
node.style.backgroundRepeat="";
}
};
CSelectionController.prototype.restoreOldBackgroundImage=function(node){
if(node&&node.style&&node.getAttribute("oldBackgroundImageStyle")!=null){
node.style.backgroundImage=node.getAttribute("oldBackgroundImageStyle");
node.removeAttribute("oldBackgroundImageStyle");
node.style.backgroundRepeat=node.getAttribute("oldBackgroundRepeat");
node.removeAttribute("oldBackgroundRepeat");
node.style.backgroundColor=node.getAttribute("oldBackgroundColor");
node.removeAttribute("oldBackgroundColor");
}
};
CSelectionController.prototype.getStyleProperty=function(node,_443){
if(node&&node.style&&node.style[_443]){
return node.style[_443];
}
return "";
};
CSelectionController.prototype.getBackgroundImage=function(node){
if(node&&node.style){
return node.style.backgroundImage;
}
return "";
};
CSelectionController.prototype.pageContextClicked=function(e){
var node=getNodeFromEvent(e);
if(typeof node.selectedCell!="undefined"){
var _447=node;
node=node.selectedCell;
_447.removeAttribute("selectedCell");
}
while(node!=null&&node.tagName!="TD"){
node=node.parentNode;
}
if(node!=null){
var _448=this.getBackgroundImage(node);
this.findSelectionURLs();
if(this.getSelections().length==0||_448!=this.pS_backgroundImageURL){
this.pageClicked(e);
}
}
if(typeof populateContextMenu!="undefined"){
populateContextMenu();
moveContextMenu(e);
}
var _449=false;
if(this.showViewerContextMenu()){
if(typeof e.preventDefault=="function"){
e.preventDefault();
}
_449=true;
}
return _449;
};
CSelectionController.prototype.chartContextMenu=function(e){
if(!this.hasSelectedChartNodes()){
return;
}
if(typeof populateContextMenu!="undefined"){
populateContextMenu();
moveContextMenu(e);
}
if(typeof e.preventDefault=="function"){
e.preventDefault();
}
return false;
};
CSelectionController.prototype.titleAreaContextMenu=function(e,_44c,sId){
if(typeof populateContextMenu!="undefined"){
goWindowManager.getApplicationFrame().cfgSet("contextMenuType",_44c);
goWindowManager.getApplicationFrame().cfgSet("contextMenuId",sId);
populateContextMenu(_44c.toUpperCase());
moveContextMenu(e,_44c.toUpperCase());
}
if(typeof e.preventDefault=="function"){
e.preventDefault();
}
return false;
};
CSelectionController.prototype.selectionsAreAllSameType=function(){
var _44e=this.getSelections();
if(_44e.length>0){
var _44f=_44e[0].getLayoutType();
for(var i=1;i<_44e.length;i++){
if(_44f!=_44e[i].getLayoutType()){
return 0;
}
}
return 1;
}
return -1;
};
CSelectionController.prototype.selectionsAreAllOnSameColumn=function(){
var _451=this.getSelections();
var i=0;
if(_451.length>0){
var _453=_451[0].getColumnRef();
if(_453!=null&&_453!=""){
for(i=1;i<_451.length;i++){
if(_453!=_451[i].getColumnRef()){
return false;
}
}
}else{
var _454=_451[0].getCellTypeId();
for(i=1;i<_451.length;i++){
if(_454!=_451[i].getCellTypeId()){
return false;
}
}
}
return true;
}
return false;
};
CSelectionController.prototype.checkForReportElementNode=function(node){
if(typeof node!="undefined"&&node!=null&&typeof node.className!="undefined"&&node.className!=null){
if(node.className=="tt"){
if(typeof node.parentNode!="undefined"&&node.parentNode!=null&&typeof node.parentNode.parentNode!="undefined"&&node.parentNode.parentNode!=null&&(node.parentNode.className=="reportSubtitleStyle"||node.parentNode.id=="reportTitleLink")){
node=node.parentNode.parentNode;
}else{
return false;
}
}else{
if(typeof node.parentNode!="undefined"&&node.parentNode!=null){
var _456=node.parentNode;
while(typeof _456!="undefined"&&_456!=null){
if(typeof _456.className!="undefined"&&_456.className!=null&&_456.className.substr(0,2)=="ft"){
node=_456;
break;
}else{
_456=_456.parentNode;
}
}
}else{
return false;
}
}
var _457=node.className.substr(0,2);
if(_457=="ta"||_457=="ts"||_457=="ft"){
return true;
}
}
return false;
};
CSelectionController.prototype.chartClicked=function(_458){
this.setSelectedChartArea(_458);
};
CSelectionController.prototype.processColumnTitleNode=function(_459){
if(!_459||!this.m_oCognosViewer.isBux){
return;
}
var _45a=_459.getCellRef();
if(_45a.getAttribute("contextAugmented")=="true"||"list"!=_459.getDataContainerType()||"columnTitle"!=_459.getLayoutType()){
return;
}
var _45b=_459.getSelectedContextIds();
var _45c=false;
if(typeof _45b=="object"&&_45b!=null&&_45b.length>0){
if(this.isRelational(_45b)&&this.getQueryModelId(_45b[0][0])==null){
_45c=true;
}else{
return;
}
}
var lid=_45a.parentNode.parentNode.parentNode.getAttribute("lid");
var _45e=_45a.parentNode.nextSibling;
var _45f=getChildElementsByAttribute(_45e,"td","cid",_45a.getAttribute("cid"));
var _460=null;
var _461=true;
var _462;
if(_45f.length>0){
var _463=_45f[0];
var _464=_463.childNodes.length;
for(var _465=0;_465<_464;_465++){
var _466=_463.childNodes[_465];
if(_466.getAttribute&&((_466.nodeName.toLowerCase()=="table"&&typeof _466.getAttribute("lid")=="string")||_466.nodeName.toLowerCase()=="map"||_466.nodeName.toLowerCase()=="img"||_466.getAttribute("chartcontainer")=="true")){
if(_465==0){
_461=false;
}
}else{
_462=[];
if(_466.nodeName.toLowerCase()=="span"){
_462.push(_466);
}
var _467=_466.getElementsByTagName?_466.getElementsByTagName("span"):[];
for(var _468=0;_468<_467.length;++_468){
if(lid==getImmediateLayoutContainerId(_467[_468])){
_462.push(_467[_468]);
}
}
for(var _469=0;_469<_462.length;++_469){
var _46a=_462[_469];
if(_46a.nodeType==1&&_46a.nodeName.toLowerCase()=="span"&&_46a.style.visibility!="hidden"){
if(_46a.getAttribute("ctx")!=null&&_46a.getAttribute("ctx")!=""){
_460=_46a.getAttribute("ctx");
break;
}
}
}
}
}
}
if(_460!=null){
var _46b=_460.split("::")[0].split(":")[0];
if(!_45c){
_462=_45a.getElementsByTagName("span");
if(_462.length!=0){
var _46c=this.m_oCDManager.m_cd[_46b];
var _46d=this.getTextValue(_462);
var _46e={"u":_46d===null?"":_46d};
if(typeof _46c!="undefined"){
if(typeof _46c["r"]!="undefined"){
_46e.r=_46c["r"];
}
if(typeof _46c["q"]!="undefined"){
_46e.q=_46c["q"];
}
if(typeof _46c["i"]!="undefined"){
_46e.i=_46c["i"];
}
}
var _46f="cloned"+_46b;
this.m_oCDManager.m_cd[_46f]=_46e;
_462[0].setAttribute("ctx",_46f);
_459=this.getSelectionObjectFactory().processCTX(_459,_46f);
}
}else{
var qmid=this.getQueryModelId(_46b);
if(qmid==null){
}
if(qmid!=null){
var _471=_45b[0][0];
this.m_oCDManager.m_cd[_471].i=this.m_oCDManager.m_cd[_46b].i;
return false;
}
}
}else{
_461=false;
}
if(!_461){
_45a.setAttribute("canSort","false");
}
_45a.setAttribute("contextAugmented","true");
};
CSelectionController.prototype.selectionsInSameDataContainer=function(){
try{
var _472=this.getAllSelectedObjects();
var _473=_472[0].getLayoutElementId();
for(var _474=1;_474<_472.length;_474++){
if(_473!=_472[_474].getLayoutElementId()){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.selectionsFromSameDataItem=function(){
try{
var _475=this.getAllSelectedObjects();
var _476=_475[0].getDataItems()[0][0];
for(var _477=1;_477<_475.length;_477++){
if(_476!=_475[_477].getDataItems()[0][0]){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.isRelational=function(_478){
try{
if(!_478){
var _479=this.getAllSelectedObjects()[0];
_478=_479.getSelectedContextIds();
}
for(var _47a=0;_47a<_478.length;_47a++){
for(var _47b=0;_47b<_478[_47a].length;_47b++){
var ctx=_478[_47a][_47b];
var mun=this.getMun(ctx);
var lun=this.getLun(ctx);
var hun=this.getHun(ctx);
if(mun!=null&&typeof mun!="undefined"&&mun.length>0){
return false;
}
if(lun!=null&&typeof lun!="undefined"&&lun.length>0){
return false;
}
if(hun!=null&&typeof hun!="undefined"&&hun.length>0){
return false;
}
}
}
return true;
}
catch(e){
return true;
}
return true;
};
CSelectionController.prototype.getDataContainerType=function(){
try{
if(!this.getAllSelectedObjects()[0]){
return "";
}
return this.getAllSelectedObjects()[0].m_dataContainerType;
}
catch(e){
return "";
}
};
CSelectionController.prototype.areSelectionsColumnRowTitles=function(){
try{
var _480=this.getAllSelectedObjects();
for(var _481=0;_481<_480.length;_481++){
var _482=_480[_481];
if(_482.getLayoutType()!="columnTitle"||_482.isHomeCell()){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.selectionsAreMeasures=function(){
try{
var _483=this.getAllSelectedObjects();
for(var _484=0;_484<_483.length;_484++){
var _485=_483[_484];
if(this.getUsageInfo(_485.getSelectedContextIds()[0][0])!=this.c_usageMeasure){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.selectionsNonMeasureWithMUN=function(){
var _486=this.getAllSelectedObjects();
if(_486.length==0){
return false;
}
for(var _487=0;_487<_486.length;_487++){
var _488=_486[0];
if(_488.getSelectedContextIds().length==0){
return false;
}
var _489=_488.getSelectedContextIds()[0][0];
var mun=this.getMun(_489);
var _48b=this.getUsageInfo(_489);
if(mun==null||typeof mun=="undefined"||mun.length==0||_48b==this.c_usageMeasure){
return false;
}
}
return true;
};
CSelectionController.prototype.areSelectionsMeasureOrCalculation=function(){
var _48c=this.getAllSelectedObjects();
if(_48c.length==0){
return false;
}
var _48d=this.selectionsHaveCalculationMetadata();
for(var _48e=0;_48e<_48c.length;_48e++){
var _48f=_48c[_48e];
var _490=_48f.getSelectedContextIds()[0][0];
if(!this.isCalculationOrMeasure(_490,_48d)){
return false;
}
}
return true;
};
CSelectionController.prototype.selectionsHaveCalculationMetadata=function(){
try{
var _491=this.getDataContainerType();
var _492=this.getAllSelectedObjects();
for(var _493=0;_493<_492.length;_493++){
var _494=_492[_493];
var _495=_494.getSelectedContextIds();
var _496=_495[0][0];
var sHun=this.getHun(_496);
if(!this.hasCalculationMetadata(_496,_495,_491)){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.isCalculationOrMeasure=function(_498,_499){
var mun=this.getMun(_498);
var _49b=this.getUsageInfo(_498);
if(!(((mun==null||typeof mun=="undefined"||mun.length==0)&&_499)||_49b==this.c_usageMeasure)){
return false;
}
return true;
};
CSelectionController.prototype.hasCalculationMetadata=function(_49c,_49d,_49e){
var sHun=this.getHun(_49c);
if(this.getUsageInfo(_49c)!=this.c_usageMeasure){
if((this.isRelational(_49d)&&this.getQueryModelId(_49c)!=null)||(!this.isRelational(_49d)&&_49e=="list"&&(sHun&&sHun!=""))){
return false;
}
}
return true;
};
CSelectionController.prototype.selectionsAreDateTime=function(){
try{
var _4a0=this.getAllSelectedObjects();
for(var _4a1=0;_4a1<_4a0.length;_4a1++){
var _4a2=_4a0[_4a1];
var _4a3=_4a2.getSelectedContextIds();
var _4a4=_4a3[0][0];
var _4a5=this.getDataType(_4a4);
if(_4a5&&typeof this.m_ccl_dateTypes[_4a5]!=="undefined"){
return true;
}
}
}
catch(e){
return false;
}
return false;
};
CSelectionController.prototype.getSelectedObjectsJsonContext=function(){
try{
var _4a6=this.getAllSelectedObjects();
if(_4a6===null||_4a6.length<=0){
return null;
}
var _4a7=this.m_oCognosViewer.getModelPath();
var _4a8=[];
for(var i=0;i<_4a6.length;i++){
var obj=_4a6[i].getContextJsonObject(this,_4a7);
_4a8.push(obj);
}
return _4a8;
}
catch(e){
}
};
CSelectionController.prototype.destroy=function(){
delete this.m_oCognosViewer;
delete this.m_aCutColumns;
delete this.m_aSelectedObjects;
delete this.m_selectedClass;
delete this.m_cutClass;
if(this.m_oObserver&&this.m_oObserver.destroy){
this.m_oObserver.destroy();
}
delete this.m_oObserver;
delete this.m_aReportMetadataArray;
delete this.m_aReportContextDataArray;
if(this.m_oCDManager&&this.m_oCDManager.destroy){
this.m_oCDManager.destroy();
}
delete this.m_oCDManager;
if(this.m_oSelectionObjectFactory&&this.m_oSelectionObjectFactory.destroy){
this.m_oSelectionObjectFactory.destroy();
}
delete this.m_oSelectionObjectFactory;
delete this.m_selectedChartArea;
delete this.m_selectedChartNodes;
delete this.m_selectionContainerMap;
delete this.m_chartHelpers;
delete this.m_oJsonForMarshal;
if(this.hasSavedSelections()){
this.clearSavedSelections();
}
};
function clearTextSelection(_4ab){
if(!_4ab){
_4ab=document;
}
try{
if(typeof _4ab.selection=="object"&&_4ab.selection!==null){
_4ab.selection.empty();
}else{
if(typeof window.getSelection=="function"&&typeof window.getSelection()=="object"&&window.getSelection()!==null){
window.getSelection().removeAllRanges();
}
}
}
catch(e){
}
};
function CtxArrayPlaceHolder(){
};
var self=window;
function CDrillManager(oCV){
this.m_drawDrillTargets=false;
this.setCV(oCV);
};
CDrillManager.prototype=new CViewerHelper();
CDrillManager.prototype.getSelectionController=function(){
var _4ad;
try{
_4ad=getCognosViewerSCObjectRef(this.getCV().getId());
}
catch(e){
_4ad=null;
}
return _4ad;
};
CDrillManager.prototype.getSelectedObject=function(){
var _4ae=this.getSelectionController();
if(_4ae==null){
return null;
}
var _4af=null;
var _4b0=null;
if(_4ae.hasSelectedChartNodes()){
_4b0=_4ae.getSelectedChartNodes();
}else{
_4b0=_4ae.getSelections();
}
if(_4b0&&_4b0.length==1){
_4af=_4b0[0];
}
return _4af;
};
CDrillManager.prototype.canDrillUp=function(){
if(this.getDrillOption("drillUp")==true&&this.hasMuns()){
return true;
}
return false;
};
CDrillManager.prototype.canDrillDown=function(){
if(this.getDrillOption("drillDown")==true){
return true;
}
return false;
};
CDrillManager.prototype.hasMuns=function(_4b1){
if(typeof _4b1=="undefined"){
_4b1=this.getSelectedObject();
}
if(_4b1==null){
return false;
}
var _4b2=_4b1.getMuns();
var muns="";
for(var _4b4=0;_4b4<_4b2.length&&muns=="";++_4b4){
if(typeof _4b2[_4b4][0]!="undefined"){
muns+=_4b2[_4b4][0];
}
}
return (muns!="");
};
CDrillManager.prototype.getRefQuery=function(){
var _4b5="";
var _4b6=this.getSelectedObject();
if(_4b6==null){
return "";
}
var _4b7=_4b6.getRefQueries();
for(var i=0;i<_4b7.length;i++){
if(_4b7[i]!=null){
for(var j=0;j<_4b7[i].length;j++){
if(_4b7[i][j]!=null&&_4b7[i][j]!=""){
return _4b7[i][j];
}
}
}
}
return _4b5;
};
CDrillManager.prototype.isIsolated=function(){
var _4ba=this.getSelectionController();
if(_4ba==null||_4ba.getDrillUpDownEnabled()==false){
return false;
}
var _4bb=this.getSelectedObject();
if(_4bb==null){
return false;
}
if(_4bb instanceof CSelectionChartObject&&_4ba!=null){
var _4bc=_4bb.getArea();
if(_4bc!=null){
var _4bd=_4bc.getAttribute("isolated");
if(typeof _4bd!="undefined"&&_4bd!=null&&_4bd=="true"){
return true;
}
}
}else{
var _4be=_4bb.getCellRef();
if(typeof _4be=="object"&&_4be!=null){
var _4bf=_4be.getElementsByTagName("span");
if(_4bf!=null&&typeof _4bf!="undefined"&&_4bf.length>0){
var _4c0=_4bf[0].getAttribute("isolated");
if(_4c0!=null&&_4c0!="undefined"&&_4c0=="true"){
return true;
}
}
}
}
return false;
};
CDrillManager.prototype.getDrillOption=function(_4c1){
var _4c2=this.getSelectionController();
if(_4c2==null||_4c2.getDrillUpDownEnabled()==false||typeof _4c1=="undefined"){
return false;
}
var _4c3=this.getSelectedObject();
if(_4c3==null){
return false;
}
if(this.isIsolated()){
if(_4c1=="drillDown"){
return false;
}else{
if(_4c1=="drillUp"){
return true;
}
}
}
if(_4c1=="drillDown"){
if(_4c3 instanceof CSelectionChartObject&&_4c2!=null){
var _4c4=_4c3.getArea();
if(_4c4!=null){
var _4c5=_4c4.getAttribute("isChartTitle");
if(typeof _4c5!="undefined"&&_4c5!=null&&_4c5=="true"){
return false;
}
}
}
}
var _4c6=_4c3.getDrillOptions();
var _4c7=(typeof DrillContextMenuHelper!=="undefined"&&DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV));
for(var idx=0;idx<_4c6.length;++idx){
var _4c9=(_4c7)?_4c6[idx].length:1;
for(var _4ca=0;_4ca<_4c9;++_4ca){
var _4cb=_4c6[idx][_4ca];
if(_4cb=="3"){
return true;
}else{
if(_4c1=="drillUp"&&_4cb=="1"){
return true;
}else{
if(_4c1=="drillDown"&&_4cb=="2"){
return true;
}
}
}
}
}
return false;
};
CDrillManager.prototype.canDrillThrough=function(){
var _4cc=this.getSelectionController();
if(_4cc==null||_4cc.getModelDrillThroughEnabled()==false){
return false;
}
return true;
};
CDrillManager.prototype.singleClickDrillEvent=function(evt,app){
var _4cf=this.getSelectionController();
if(_4cf!=null){
if(this.getCV().bCanUseCognosViewerSelection==true){
_4cf.pageClicked(evt);
}
}
var node=getCrossBrowserNode(evt);
try{
if(node.className&&node.className.indexOf("dl")==0){
if(this.canDrillDown()){
this.singleClickDrillDown(evt,app);
return true;
}else{
if(this.canDrillUp()){
this.singleClickDrillUp(evt,app);
return true;
}
}
}
}
catch(e){
}
if(app=="RV"){
return this.getDrillThroughParameters("execute",evt);
}
return false;
};
CDrillManager.prototype.singleClickDrillDown=function(evt,app){
if(app=="QS"){
this.qsDrillDown();
}else{
this.rvDrillDown();
}
};
CDrillManager.prototype.singleClickDrillUp=function(evt,app){
if(app=="QS"){
this.qsDrillUp();
}else{
this.rvDrillUp();
}
};
CDrillManager.prototype.getDrillParameters=function(_4d5,_4d6,_4d7,_4d8){
var _4d9=[];
var _4da=this.getSelectedObject();
if(_4da==null){
return _4d9;
}
if(typeof _4d6=="undefined"){
_4d6=true;
}
var _4db=_4da.getDataItems();
var _4dc=_4da.getMuns();
var _4dd=_4da.getDimensionalItems("lun");
var _4de=_4da.getDimensionalItems("hun");
var _4df=_4da.getDrillOptions();
if(typeof _4db=="undefined"||typeof _4dc=="undefined"||typeof _4df=="undefined"||_4dc==null||_4db==null||_4df==null){
return _4d9;
}
if(_4dc.length!=_4db.length){
return _4d9;
}
var _4e0=_4dc.length;
for(var _4e1=0;_4e1<_4e0;++_4e1){
if(_4db[_4e1].length!=0){
var _4e2=(_4d8)?this.findUserSelectedDrillItem(_4d8,_4db[_4e1]):0;
if(_4e2<0){
continue;
}
if((_4d7===true)||this.getDrillOption(_4d5)){
if(_4dc[_4e1][_4e2]==""||_4d9.toString().indexOf(_4dc[_4e1][_4e2],0)==-1){
_4d9[_4d9.length]=_4db[_4e1][_4e2];
_4d9[_4d9.length]=_4dc[_4e1][_4e2];
if(_4d6===true){
_4d9[_4d9.length]=_4dd[_4e1][_4e2];
_4d9[_4d9.length]=_4de[_4e1][_4e2];
}
}
}
}
}
return _4d9;
};
CDrillManager.prototype.findUserSelectedDrillItem=function(_4e3,_4e4){
for(var _4e5=0;_4e5<_4e4.length;++_4e5){
if(_4e3==_4e4[_4e5]){
return _4e5;
}
}
return -1;
};
CDrillManager.prototype.getModelDrillThroughContext=function(_4e6){
var _4e7="";
if(this.canDrillThrough()===true){
if(typeof gUseNewSelectionContext=="undefined"){
var _4e8="";
if(typeof getConfigFrame!="undefined"){
_4e8=decodeURIComponent(getConfigFrame().cfgGet("PackageBase"));
}else{
if(this.getCV().getModelPath()!==""){
_4e8=this.getCV().getModelPath();
}
}
_4e7=getViewerSelectionContext(this.getSelectionController(),new CSelectionContext(_4e8));
}else{
var _4e9=new CParameterValues();
var _4ea=this.getSelectionController();
if(_4ea){
var _4eb=_4ea.getAllSelectedObjects();
for(var _4ec=0;_4ec<_4eb.length;++_4ec){
var _4ed=_4eb[_4ec];
var _4ee=_4ed.getMuns();
var _4ef=_4ed.getMetadataItems();
var _4f0=_4ed.getUseValues();
for(var _4f1=0;_4f1<_4ef.length;++_4f1){
for(var idx=0;idx<_4ef[_4f1].length;++idx){
if(_4ef[_4f1][idx]==null||_4ef[_4f1][idx]==""){
continue;
}
var name=_4ef[_4f1][idx];
var _4f4;
if(_4ee[_4f1][idx]!=null&&_4ee[_4f1][idx]!=""){
_4f4=_4ee[_4f1][idx];
}else{
_4f4=_4f0[_4f1][idx];
}
var _4f5=_4f0[_4f1][idx];
_4e9.addSimpleParmValueItem(name,_4f4,_4f5,"true");
}
}
}
}
var _4f6=_4e6.XMLBuilderCreateXMLDocument("context");
_4e7=_4e9.generateXML(_4e6,_4f6);
}
}
return _4e7;
};
CDrillManager.prototype.rvDrillUp=function(_4f7){
this.getCV().executeAction("DrillUp",_4f7);
};
CDrillManager.prototype.rvDrillDown=function(_4f8){
this.getCV().executeAction("DrillDown",_4f8);
};
CDrillManager.prototype.rvBuildXMLDrillParameters=function(_4f9,_4fa){
var _4fb=this.getDrillParameters(_4f9,true,false,_4fa);
if(_4fb.length==0){
return drillParams;
}
return this.buildDrillParametersSpecification(_4fb);
};
CDrillManager.prototype.buildDrillParametersSpecification=function(_4fc){
var _4fd="<DrillParameters>";
var idx=0;
while(idx<_4fc.length){
_4fd+="<DrillGroup>";
_4fd+="<DataItem>";
_4fd+=sXmlEncode(_4fc[idx++]);
_4fd+="</DataItem>";
_4fd+="<MUN>";
_4fd+=sXmlEncode(_4fc[idx++]);
_4fd+="</MUN>";
_4fd+="<LUN>";
_4fd+=sXmlEncode(_4fc[idx++]);
_4fd+="</LUN>";
_4fd+="<HUN>";
_4fd+=sXmlEncode(_4fc[idx++]);
_4fd+="</HUN>";
_4fd+="</DrillGroup>";
}
_4fd+="</DrillParameters>";
return _4fd;
};
CDrillManager.prototype.getAuthoredDrillsForCurrentSelection=function(){
var _4ff=null;
var _500=this.getAuthoredDrillThroughTargets();
if(_500.length>0){
var _501="<AuthoredDrillTargets>";
for(var _502=0;_502<_500.length;++_502){
_501+=eval("\""+_500[_502]+"\"");
}
_501+="</AuthoredDrillTargets>";
var cv=this.getCV();
var _504=cv.getAction("AuthoredDrill");
var _505=cv.getDrillTargets();
if(_505.length>0){
_4ff=_504.getAuthoredDrillThroughContext(_501,_505);
}
}
return _4ff;
};
CDrillManager.prototype.getAuthoredDrillsForGotoPage=function(){
var _506="";
var _507=this.getAuthoredDrillsForCurrentSelection();
if(_507){
_506=XMLBuilderSerializeNode(_507);
}
return _506;
};
CDrillManager.prototype.launchGoToPage=function(_508,_509){
var _50a=this.getSelectionController();
if((_50a!=null&&_50a.getModelDrillThroughEnabled()==true)||(typeof _508!="undefined"&&_508!=null&&_508!="")){
var _50b=this.getAuthoredDrillsForGotoPage();
var _50c=this.getModelDrillThroughContext(self);
var form=document.getElementById("drillForm");
if(form!=null){
document.body.removeChild(form);
}
form=document.createElement("form");
var cvid=this.getCVId();
var _50f=document.forms["formWarpRequest"+cvid];
form.setAttribute("id","drillForm");
form.setAttribute("name","drillForm");
form.setAttribute("target",_50f.getAttribute("target"));
form.setAttribute("method","post");
form.setAttribute("action",_50f.getAttribute("action"));
form.style.display="none";
document.body.appendChild(form);
if(this.getCV().getModelPath()!==""){
form.appendChild(createHiddenFormField("modelPath",this.getCV().getModelPath()));
}
if(typeof _50f["ui.object"]!="undefined"&&_50f["ui.object"].value!=""){
form.appendChild(createFormField("drillSource",_50f["ui.object"].value));
}else{
if(typeof this.getCV().envParams["ui.spec"]!="undefined"){
form.appendChild(createFormField("sourceSpecification",this.getCV().envParams["ui.spec"]));
}
}
if(_50b!=""){
form.appendChild(createHiddenFormField("m","portal/drillthrough.xts"));
form.appendChild(createFormField("invokeGotoPage","true"));
form.appendChild(createFormField("m","portal/drillthrough.xts"));
form.appendChild(createFormField("modelDrillEnabled",_50a.getModelDrillThroughEnabled()));
if(typeof gUseNewSelectionContext=="undefined"){
form.appendChild(createFormField("newSelectionContext","true"));
}
}else{
if(typeof gUseNewSelectionContext=="undefined"){
form.appendChild(createHiddenFormField("m","portal/goto2.xts"));
}else{
form.appendChild(createHiddenFormField("m","portal/goto.xts"));
}
}
form.appendChild(createHiddenFormField("b_action","xts.run"));
form.appendChild(createHiddenFormField("drillTargets",_50b));
if(typeof gUseNewSelectionContext=="undefined"){
form.appendChild(createHiddenFormField("drillContext",_50c));
}else{
form.appendChild(createHiddenFormField("modeledDrillthru",_50c));
}
form.appendChild(createHiddenFormField("errURL","javascript:window.close();"));
if(typeof _509!="undefined"&&_509==true){
form.appendChild(this.createFormField("directLaunch","true"));
}
var _510="";
if(this.getCV().envParams["ui.routingServerGroup"]){
_510=this.getCV().envParams["ui.routingServerGroup"];
}
form.appendChild(createHiddenFormField("ui.routingServerGroup",_510));
if(this.getCV().getExecutionParameters()!=""){
form.appendChild(createHiddenFormField("encExecutionParameters",this.getCV().getExecutionParameters()));
}
if(_50f.lang&&_50f.lang.value!=""){
form.appendChild(createHiddenFormField("lang",_50f.lang.value));
}
if(!this.getCV()||!this.getCV().launchGotoPageForIWidgetMobile(drillForm)){
if(typeof this.getCV().launchGotoPage==="function"){
this.getCV().launchGotoPage(form);
}else{
var _511="winNAT_"+(new Date()).getTime();
var _512=this.getCV().getWebContentRoot()+"/rv/blankDrillWin.html?cv.id="+cvid;
window.open(_512,_511,"toolbar,location,status,menubar,resizable,scrollbars=1");
form.target=_511;
}
}
}
};
CDrillManager.prototype.buildSearchPageXML=function(_513,pkg,_515,_516,_517,_518,_519){
var _51a=null;
if(typeof _513.XMLElement=="function"){
_51a=_513.XMLBuilderCreateXMLDocument("cognosSearch");
_513.XMLBuilderSetAttributeNodeNS(_51a.documentElement,"xmlns:cs","http://developer.cognos.com/schemas/cs/1/");
var _51b=_51a.createElement("package");
if(typeof pkg=="string"&&pkg!==""){
_51b.appendChild(_51a.createTextNode(pkg));
}
_51a.documentElement.appendChild(_51b);
var _51c=_51a.createElement("model");
if(typeof _515=="string"&&_515!==""){
_51c.appendChild(_51a.createTextNode(_515));
}
_51a.documentElement.appendChild(_51c);
var _51d=_51a.createElement("selectedContext");
_513.XMLBuilderSetAttributeNodeNS(_51d,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
_513.XMLBuilderSetAttributeNodeNS(_51d,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
_513.XMLBuilderSetAttributeNodeNS(_51d,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
_513.XMLBuilderSetAttributeNodeNS(_51d,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
_513.XMLBuilderSetAttributeNodeNS(_51d,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_51a.documentElement.appendChild(_51d);
for(var _51e in _516){
var _51f=_51a.createElement("item");
_513.XMLBuilderSetAttributeNodeNS(_51f,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
var _520=_513.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",_51a);
_513.XMLBuilderSetAttributeNodeNS(_520,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_520.appendChild(_51a.createTextNode(_516[_51e].name));
var _521=_513.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",_51a);
_513.XMLBuilderSetAttributeNodeNS(_521,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_513.XMLBuilderSetAttributeNodeNS(_521,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
for(var j=0;j<_516[_51e].values.length;j++){
var _523=_51a.createElement("item");
_513.XMLBuilderSetAttributeNodeNS(_523,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
var _524=_513.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",_51a);
_513.XMLBuilderSetAttributeNodeNS(_524,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_524.appendChild(_51a.createTextNode(_516[_51e].values[j][0]));
var _525=_513.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",_51a);
_513.XMLBuilderSetAttributeNodeNS(_525,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
var _526=_516[_51e].values[j][1]==null?"":_516[_51e].values[j][1];
_525.appendChild(_51a.createTextNode(_526));
_523.appendChild(_524);
_523.appendChild(_525);
_521.appendChild(_523);
}
_51f.appendChild(_520);
_51f.appendChild(_521);
_51d.appendChild(_51f);
}
var _527=_51a.createElement("defaultMeasure");
_51a.documentElement.appendChild(_527);
_518.buildXML(_513,_51a,"data");
var _528=_51a.createElement("filter");
_51a.documentElement.appendChild(_528);
}
return _51a;
};
CDrillManager.prototype.openSearchPage=function(_529,_52a){
this.getModelDrillThroughContext(self);
var _52b=document.getElementById("searchPage");
if(_52b!=null){
document.body.removeChild(_52b);
}
_52b=document.createElement("form");
_52b.setAttribute("id","searchPage");
_52b.setAttribute("name","searchPage");
_52b.setAttribute("method","post");
_52b.setAttribute("target",_52b.name);
_52b.setAttribute("action",this.getCV().getGateway()+"/gosearch");
_52b.style.display="none";
document.body.appendChild(_52b);
_52b.appendChild(createHiddenFormField("csn.action","search"));
_52b.appendChild(createHiddenFormField("csn.drill",_52a));
var _52c=window.open("",_52b.name,"directories=no,location=no,status=no,toolbar=no,resizable=yes,scrollbars=yes,top=100,left=100,height=480,width=640");
_52c.focus();
_52b.submit();
};
CDrillManager.prototype.launchSearchPage=function(){
var _52d=this.getSelectionController();
var _52e=document.forms["formWarpRequest"+this.getCVId()];
var _52f=this.determineSelectionsForSearchPage(_52d);
var _530=this.getSearchContextDataSpecfication(_52d);
var _531=this.buildSearchPageXML(self,_52e.packageBase.value,this.getCV().getModelPath(),_52f,[],_530,[]);
this.openSearchPage(_52e.packageBase.value,XMLBuilderSerializeNode(_531));
};
CDrillManager.prototype.qsDrillDown=function(){
if(!this.canDrillDown()){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _532="DD:";
this.qsSendDrillCommand(_532);
};
CDrillManager.prototype.qsDrillUp=function(){
if(!this.canDrillUp()){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _533="DU:";
this.qsSendDrillCommand(_533);
};
CDrillManager.prototype.qsSendDrillCommand=function(_534){
var _535;
if(_534=="DU:"){
_535="drillUp";
}else{
_535="drillDown";
}
var _536=this.getDrillParameters(_535,false,false);
if(_536.length==0){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
for(var idx=0;idx<_536.length;++idx){
_534+=getConfigFrame().escapeParam(_536[idx]);
if(idx+1<_536.length){
_534+=",";
}
}
getConfigFrame().sendCmd(_534,"",true);
};
CDrillManager.prototype.qsLaunchGoToPage=function(_538){
var _539=this.getSelectionController();
if(_539!=null&&_539.getModelDrillThroughEnabled()==true){
var _53a=this.getModelDrillThroughContext(cf);
if(_53a==""){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _53b=document.getElementById("gotoPage");
if(_53b!=null){
document.body.removeChild(_53b);
}
_53b=document.createElement("form");
_53b.setAttribute("id","gotoPage");
_53b.setAttribute("name","gotoPage");
_53b.setAttribute("method","post");
_53b.style.display="none";
document.body.appendChild(_53b);
var _53c=getConfigFrame();
_53b.appendChild(this.createFormField("objpath",decodeURIComponent(_53c.cfgGet("PackageBase"))));
if(typeof gUseNewSelectionContext=="undefined"){
_53b.appendChild(this.createFormField("m","portal/goto2.xts"));
}else{
_53b.appendChild(this.createFormField("m","portal/goto.xts"));
}
_53b.appendChild(this.createFormField("b_action","xts.run"));
if(typeof gUseNewSelectionContext=="undefined"){
_53b.appendChild(this.createFormField("drillContext",_53a));
}else{
_53b.appendChild(this.createFormField("modeledDrillthru",_53a));
}
if(typeof getConfigFrame().routingServerGroup!="undefined"){
_53b.appendChild(this.createFormField("ui.routingServerGroup",getConfigFrame().routingServerGroup));
}
if(typeof _538!="undefined"&&_538==true){
_53b.appendChild(this.createFormField("directLaunch","true"));
}
var _53d=_53c.goApplicationManager.getReportManager().getParameterManager().getExecutionParameters();
if(_53d){
_53b.appendChild(this.createFormField("encExecutionParameters",_53d));
}
var _53e="winNAT_"+(new Date()).getTime();
var _53f=this.getCV().getWebContentRoot()+"/rv/blankDrillWin.html?cv.id="+this.getCVId();
window.open(_53f,_53e,"toolbar,location,status,menubar,resizable,scrollbars=1");
_53b.target=_53e;
}
};
CDrillManager.prototype.qsLaunchSearchPage=function(){
var cf=getConfigFrame();
var _541=goWindowManager.getSelectionController();
var _542=this.determineSelectionsForSearchPage(_541);
var _543=this.getSearchContextDataSpecfication(_541);
var _544=decodeURIComponent(cf.cfgGet("PackageBase"));
var _545=this.buildSearchPageXML(cf,_544,decodeURIComponent(cf.cfgGet("cmLastModel")),_542,[],_543,[]);
this.openSearchPage(_544,cf.XMLBuilderSerializeNode(_545));
};
CDrillManager.prototype.determineSelectionsForSearchPage=function(_546){
var _547=new CtxArrayPlaceHolder();
var _548=_546.getAllSelectedObjects();
for(var i=0;i<_548.length;i++){
var _54a=_548[i].getColumnName();
if(!this.containsByIndiceInArray(_547,_54a)){
_547[_54a]={};
_547[_54a].name=_54a;
_547[_54a].values=[];
}
var idx0="";
var muns=_548[i].getMuns();
if(muns!=null&&muns.length>0){
idx0=muns[0][0];
}
var idx1=_548[i].getDisplayValues()[0];
if(!(this.containsInArray(_547[_54a].values,0,idx0)&&this.containsInArray(_547[_54a].values,1,idx1))){
_547[_54a].values[_547[_54a].values.length]=[idx0,idx1];
}
}
return _547;
};
CDrillManager.prototype.getSearchContextDataSpecfication=function(_54e){
var _54f=new CParameterValues();
var _550=_54e.getCCDManager();
var _551=_550.m_cd;
for(var _552 in _551){
var _553=_550.GetUsage(_552);
if(_553!="2"){
var _554=_550.GetRDIValue(_552);
var _555=_550.GetDisplayValue(_552);
_54f.addSimpleParmValueItem(_554,_554,_555,"true");
}
}
return _54f;
};
CDrillManager.prototype.containsByIndiceInArray=function(a,v){
for(var i in a){
if(i==v){
return true;
}
}
return false;
};
CDrillManager.prototype.containsInArray=function(a,idx,v){
for(var i in a){
if(a[i][idx]==v){
return true;
}
}
return false;
};
CDrillManager.prototype.createFormField=function(name,_55e){
var _55f=document.createElement("input");
_55f.setAttribute("type","hidden");
_55f.setAttribute("name",name);
_55f.setAttribute("value",_55e);
return (_55f);
};
CDrillManager.prototype.getAuthoredDrillThroughTargets=function(){
var _560=[];
var _561=this.getSelectionController();
var _562=null;
if(_561!=null){
if(_561.getSelectedColumnIds().length==1){
var _563=_561.getSelections();
for(var _564=0;_564<_563.length;++_564){
var _565=_563[_564];
_562=_565.getCellRef();
while(_562){
if(_562.getAttribute("dtTargets")!=null){
_560.push("<rvDrillTargets>"+_562.getAttribute("dtTargets")+"</rvDrillTargets>");
break;
}
_562=XMLHelper_GetFirstChildElement(_562);
}
}
}else{
if(_561.hasSelectedChartNodes()){
var _566=_561.getSelectedChartNodes();
var _567=_566[0];
_562=_567.getArea();
if(_562.getAttribute("dtTargets")!=null){
_560.push("<rvDrillTargets>"+_562.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}else{
if(_561.getSelectedDrillThroughImage()!=null){
var _568=_561.getSelectedDrillThroughImage();
if(_568&&_568.getAttribute("dtTargets")!=null){
_560.push("<rvDrillTargets>"+_568.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}else{
if(_561.getSelectDrillThroughSingleton()!=null){
var _569=_561.getSelectDrillThroughSingleton();
if(_569&&_569.getAttribute("dtTargets")!=null){
_560.push("<rvDrillTargets>"+_569.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}
}
}
}
}
return _560;
};
CDrillManager.prototype.getDrillThroughParameters=function(_56a,evt){
if(typeof _56a=="undefined"){
_56a="query";
}
var _56c=[];
if(typeof evt!="undefined"){
var _56d=getCrossBrowserNode(evt,true);
try{
while(_56d){
if(typeof _56d.getAttribute!="undefined"&&_56d.getAttribute("dtTargets")){
_56c.push("<rvDrillTargets>"+_56d.getAttribute("dtTargets")+"</rvDrillTargets>");
break;
}
_56d=_56d.parentNode;
}
}
catch(e){
return false;
}
}else{
var oCV=this.getCV();
var _56f=oCV.getDrillMgr();
var _570=_56f.getSelectionController();
if(_570!=null){
var _571=null;
if(_570.hasSelectedChartNodes()){
var _572=_570.getSelectedChartNodes();
var _573=_572[0];
_571=_573.getArea();
}
if(_571!=null){
_56c.push("<rvDrillTargets>"+_571.getAttribute("dtTargets")+"</rvDrillTargets>");
}else{
_56c=this.getAuthoredDrillThroughTargets();
}
}
}
if(_56c.length>0){
var _574="<AuthoredDrillTargets>";
for(var _575=0;_575<_56c.length;++_575){
_574+=eval("\""+_56c[_575]+"\"");
}
_574+="</AuthoredDrillTargets>";
var _576=this.getCV().getAction("AuthoredDrill");
if(_56a=="query"){
_576.populateContextMenu(_574);
this.showOtherMenuItems();
}else{
if(this.getCV().envParams["cv.id"]=="AA"){
this.getCV().m_viewerFragment.raiseAuthoredDrillClickEvent();
}else{
_576.execute(_574);
}
}
return true;
}else{
if(_56a=="query"){
this.showOtherMenuItems();
return true;
}else{
return false;
}
}
};
CDrillManager.prototype.executeAuthoredDrill=function(_577){
var _578=decodeURIComponent(_577);
var _579=this.getCV().getAction("AuthoredDrill");
_579.executeDrillTarget(_578);
};
CDrillManager.prototype.doesMoreExist=function(_57a){
for(var i=0;i<_57a.getNumItems();i++){
var _57c=_57a.get(i);
if(_57c!=null){
if((_57c instanceof CMenuItem)&&(_57c.getLabel()==RV_RES.RV_MORE)&&(_57c.getAction()==this.getCVObjectRef()+".getDrillMgr().launchGoToPage();")){
return true;
}
}
}
return false;
};
CDrillManager.prototype.showOtherMenuItems=function(){
var cv=this.getCV();
var _57e=cv.rvMainWnd;
var _57f=_57e.getToolbarControl();
var _580=null;
var _581=null;
if(typeof _57f!="undefined"&&_57f!=null){
_580=_57f.getItem("goto");
if(_580){
_581=_580.getMenu();
}
}
var _582=_57e.getContextMenu();
var _583=_57e.getUIHide();
var _584=null;
if(typeof _582!="undefined"&&_582!=null&&_582.getGoToMenuItem()){
_584=_582.getGoToMenuItem().getMenu();
}
var _585=null;
var _586=this.getSelectionController();
if(_581!=null){
if(this.doesMoreExist(_581)==false){
if(typeof gMenuSeperator!="undefined"&&_581.getNumItems()>0&&(cv.bCanUseCognosViewerIndexSearch||_583.indexOf(" RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ")==-1)){
_581.add(gMenuSeperator);
}
var _587=new CMenuItem(_581,RV_RES.RV_MORE,this.getCVObjectRef()+".getDrillMgr().launchGoToPage();","",gMenuItemStyle,cv.getWebContentRoot(),cv.getSkin());
if(_583.indexOf(" RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ")!=-1){
_587.hide();
}else{
if(_586==null||_586.getModelDrillThroughEnabled()==false){
_587.disable();
}
}
}
}
if(_584!=null){
if(typeof gMenuSeperator!="undefined"&&_584.getNumItems()>0&&(cv.bCanUseCognosViewerIndexSearch||_583.indexOf(" RV_CONTEXT_MENU_GOTO_RELATED_LINKS ")==-1)){
_584.add(gMenuSeperator);
}
var _588=new CMenuItem(_584,RV_RES.RV_MORE,this.getCVObjectRef()+".getDrillMgr().launchGoToPage();","",gMenuItemStyle,cv.getWebContentRoot(),cv.getSkin());
if(_583.indexOf(" RV_CONTEXT_MENU_GOTO_RELATED_LINKS ")!=-1){
_588.hide();
}else{
if(_586==null||_586.getModelDrillThroughEnabled()==false){
_588.disable();
}
}
}
if(_585!=null&&_586!=null){
var _589=_586.getAllSelectedObjects();
if(_589==null||_589.length===0){
_585.disable();
}
}
if(_581!=null){
_581.draw();
if(_581.isVisible()){
_581.show();
}
}
if(_584!=null){
_584.draw();
if(_584.isVisible()){
_584.show();
}
}
};
CDrillManager.prototype.ddc=function(evt){
var node=getNodeFromEvent(evt);
if(node!=null&&node.getAttribute("ddc")!=="1"){
node.setAttribute("ddc","1");
if(node.getAttribute("dtTargets")){
node.className="dl "+node.className;
node.setAttribute("href","#");
return;
}
var _58c=this.getSelectionController();
if(_58c!=null){
var _58d=_58c.getSelectionObjectFactory().getSelectionChartObject(node);
if(_58d!=null){
var _58e=_58d.getDrillOptions();
for(var idx=0;idx<_58e.length;++idx){
var _590=_58e[idx][0];
if((node.getAttribute("isChartTitle")==="true"&&_590=="1")||_590=="3"||_590=="2"){
node.className="dl "+node.className;
node.setAttribute("href","#");
break;
}
}
}
}
}
};
function CDrillThroughTarget(_591,_592,_593,_594,_595,path,_597,_598,_599,_59a,_59b,_59c){
this.m_label=_591;
this.m_outputFormat=_592;
this.m_outputLocale=_593;
this.m_showInNewWindow=_594;
this.m_method=_595;
this.m_path=path;
this.m_bookmark=_597;
this.m_parameters=_598;
this.m_objectPaths=_599;
this.m_prompt="false";
this.m_dynamicDrillThrough=false;
this.m_parameterProperties=_59c;
if(typeof _59a!="undefined"&&_59a!=null){
if(_59a=="yes"){
this.m_prompt="true";
}else{
if(_59a=="target"){
this.m_prompt="";
}
}
}
if(typeof _59b!="undefined"&&_59b!=null){
if(typeof _59b=="string"){
_59b=_59b=="true"?true:false;
}
this.m_dynamicDrillThrough=_59b;
}
};
function CDrillThroughTarget_getParameterProperties(){
return this.m_parameterProperties;
};
function CDrillThroughTarget_getLabel(){
return this.m_label;
};
function CDrillThroughTarget_getOutputFormat(){
return this.m_outputFormat;
};
function CDrillThroughTarget_getOutputLocale(){
return this.m_outputLocale;
};
function CDrillThroughTarget_getShowInNewWindow(){
return this.m_showInNewWindow;
};
function CDrillThroughTarget_getMethod(){
return this.m_method;
};
function CDrillThroughTarget_getPath(){
return this.m_path;
};
function CDrillThroughTarget_getBookmark(){
return this.m_bookmark;
};
function CDrillThroughTarget_getParameters(){
return this.m_parameters;
};
function CDrillThroughTarget_getObjectPaths(){
return this.m_objectPaths;
};
function CDrillThroughTarget_getPrompt(){
return this.m_prompt;
};
function CDrillThroughTarget_isDynamicDrillThrough(){
return this.m_dynamicDrillThrough;
};
CDrillThroughTarget.prototype.getLabel=CDrillThroughTarget_getLabel;
CDrillThroughTarget.prototype.getOutputFormat=CDrillThroughTarget_getOutputFormat;
CDrillThroughTarget.prototype.getOutputLocale=CDrillThroughTarget_getOutputLocale;
CDrillThroughTarget.prototype.getShowInNewWindow=CDrillThroughTarget_getShowInNewWindow;
CDrillThroughTarget.prototype.getMethod=CDrillThroughTarget_getMethod;
CDrillThroughTarget.prototype.getPath=CDrillThroughTarget_getPath;
CDrillThroughTarget.prototype.getBookmark=CDrillThroughTarget_getBookmark;
CDrillThroughTarget.prototype.getParameters=CDrillThroughTarget_getParameters;
CDrillThroughTarget.prototype.getObjectPaths=CDrillThroughTarget_getObjectPaths;
CDrillThroughTarget.prototype.getPrompt=CDrillThroughTarget_getPrompt;
CDrillThroughTarget.prototype.isDynamicDrillThrough=CDrillThroughTarget_isDynamicDrillThrough;
CDrillThroughTarget.prototype.getParameterProperties=CDrillThroughTarget_getParameterProperties;
function sXmlEncode(_59d){
var _59e=""+_59d;
if((_59e=="0")||((_59d!=null)&&(_59d!=false))){
_59e=_59e.replace(/&/g,"&amp;");
_59e=_59e.replace(/</g,"&lt;");
_59e=_59e.replace(/>/g,"&gt;");
_59e=_59e.replace(/"/g,"&quot;");
_59e=_59e.replace(/'/g,"&apos;");
}else{
if(_59d==null){
_59e="";
}
}
return _59e;
};
function createFormField(name,_5a0){
var _5a1=document.createElement("input");
_5a1.setAttribute("type","hidden");
_5a1.setAttribute("name",name);
_5a1.setAttribute("value",_5a0);
return (_5a1);
};
function setBackURLToCloseWindow(_5a2){
var _5a3=_5a2.childNodes;
if(_5a3){
for(var _5a4=0;_5a4<_5a3.length;++_5a4){
var _5a5=_5a3[_5a4];
var _5a6=_5a5.getAttribute("name");
if(_5a6&&_5a6=="ui.backURL"){
_5a2.removeChild(_5a5);
}
}
}
_5a2.appendChild(createFormField("ui.backURL","javascript:window.close();"));
};
function doMultipleDrills(_5a7,cvId){
if(parent!=this&&parent.doMultipleDrills){
if(getCVId()!=""&&getCVId()!=cvId){
cvId=getCVId();
}
return parent.doMultipleDrills(_5a7,cvId);
}else{
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Targets",_5a7,"text");
}
var oCV=null;
try{
oCV=getCognosViewerObjectRef(cvId);
}
catch(exception){
}
var _5aa=buildDrillForm(oCV);
addDrillEnvironmentFormFields(_5aa,oCV);
if(typeof oCV!="undefined"&&oCV!=null){
var _5ab=oCV.getModelPath();
_5aa.appendChild(createFormField("modelPath",_5ab));
var _5ac=oCV.getSelectionController();
var _5ad="";
if(typeof getViewerSelectionContext!="undefined"&&typeof CSelectionContext!="undefined"){
_5ad=getViewerSelectionContext(_5ac,new CSelectionContext(_5ab));
}
_5aa.appendChild(createFormField("drillContext",_5ad));
_5aa.appendChild(createFormField("modelDrillEnabled",_5ac.getModelDrillThroughEnabled()));
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"&&document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value!=""){
_5aa.appendChild(createFormField("drillSource",document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value));
}else{
if(typeof oCV.envParams["ui.spec"]!="undefined"){
_5aa.appendChild(createFormField("sourceSpecification",oCV.envParams["ui.spec"]));
}
}
}
_5aa.setAttribute("launchGotoPage","true");
_5aa.appendChild(createFormField("drillTargets",_5a7));
_5aa.appendChild(createFormField("invokeGotoPage","true"));
_5aa.appendChild(createFormField("m","portal/drillthrough.xts"));
_5aa.appendChild(createFormField("b_action","xts.run"));
var _5ae="winNAT_"+(new Date()).getTime();
var _5af="..";
if(oCV!=null){
_5af=oCV.getWebContentRoot();
var _5b0=oCV.getExecutionParameters();
if(_5b0!=""){
_5aa.appendChild(createFormField("encExecutionParameters",_5b0));
}
}
if(!oCV||!oCV.launchGotoPageForIWidgetMobile(_5aa)){
if(oCV&&typeof oCV.launchGotoPage==="function"){
oCV.launchGotoPage(_5aa);
}else{
var _5b1=_5af+"/rv/blankDrillWin.html";
_5aa.target=_5ae;
window.open(_5b1,_5ae);
}
}
}
};
function buildDrillForm(oCV){
var _5b3=document.getElementById("drillForm");
if(_5b3){
document.body.removeChild(_5b3);
}
_5b3=document.createElement("form");
if(typeof oCV!="undefined"&&oCV!=null){
var _5b4=document.getElementById("formWarpRequest"+oCV.getId());
_5b3.setAttribute("target",_5b4.getAttribute("target"));
_5b3.setAttribute("action",_5b4.getAttribute("action"));
}else{
_5b3.setAttribute("action",location.pathname);
}
_5b3.setAttribute("id","drillForm");
_5b3.setAttribute("name","drillForm");
_5b3.setAttribute("method","post");
_5b3.style.display="none";
document.body.appendChild(_5b3);
return _5b3;
};
function addDrillEnvironmentFormFields(_5b5,oCV){
if(window.g_dfEmail){
_5b5.appendChild(createFormField("dfemail",window.g_dfEmail));
}
if(oCV!=null){
_5b5.appendChild(createFormField("cv.id",oCV.getId()));
if(typeof oCV.envParams["ui.sh"]!="undefined"){
_5b5.appendChild(createFormField("ui.sh",oCV.envParams["ui.sh"]));
}
if(oCV.getViewerWidget()==null){
if(typeof oCV.envParams["cv.header"]!="undefined"){
_5b5.appendChild(createFormField("cv.header",oCV.envParams["cv.header"]));
}
if(typeof oCV.envParams["cv.toolbar"]!="undefined"){
_5b5.appendChild(createFormField("cv.toolbar",oCV.envParams["cv.toolbar"]));
}else{
var _5b7=oCV.getAdvancedServerProperty("VIEWER_PASS_PORTLET_TOOLBAR_STATE_ON_DRILLTHROUGH");
if(oCV.m_viewerFragment&&_5b7!=null&&_5b7===true){
var _5b8=oCV.m_viewerFragment.canShowToolbar()?"true":"false";
_5b5.appendChild(createFormField("cv.toolbar",_5b8));
}
}
}
if(typeof oCV.envParams["ui.backURL"]!="undefined"){
_5b5.appendChild(createFormField("ui.backURL",oCV.envParams["ui.backURL"]));
}
if(typeof oCV.envParams["ui.postBack"]!="undefined"){
_5b5.appendChild(createFormField("ui.postBack",oCV.envParams["ui.postBack"]));
}
if(typeof oCV.envParams["savedEnv"]!="undefined"){
_5b5.appendChild(createFormField("savedEnv",oCV.envParams["savedEnv"]));
}
if(typeof oCV.envParams["ui.navlinks"]!="undefined"){
_5b5.appendChild(createFormField("ui.navlinks",oCV.envParams["ui.navlinks"]));
}
if(typeof oCV.envParams["lang"]!="undefined"){
_5b5.appendChild(createFormField("lang",oCV.envParams["lang"]));
}
if(typeof oCV.envParams["ui.errURL"]!="undefined"){
_5b5.appendChild(createFormField("ui.errURL",oCV.envParams["ui.errURL"]));
}
var _5b9="";
if(oCV.envParams["ui.routingServerGroup"]){
_5b9=oCV.envParams["ui.routingServerGroup"];
}
_5b5.appendChild(createHiddenFormField("ui.routingServerGroup",_5b9));
}else{
_5b5.appendChild(createFormField("cv.header","false"));
_5b5.appendChild(createFormField("cv.toolbar","false"));
}
};
function appendReportHistoryObjects(oCV,_5bb){
if(oCV!=null&&typeof oCV.rvMainWnd!="undefined"&&_5bb!=null){
oCV.rvMainWnd.addCurrentReportToReportHistory();
var _5bc=oCV.rvMainWnd.saveReportHistoryAsXML();
_5bb.appendChild(createFormField("cv.previousReports",_5bc));
}
};
function doSingleDrill(_5bd,args,_5bf,_5c0,_5c1,_5c2,_5c3,_5c4,cvId,_5c6,_5c7){
var _5c8="";
if(typeof cvId=="string"){
_5c8=cvId;
}
var oCV=null;
try{
oCV=getCognosViewerObjectRef(cvId);
}
catch(exception){
}
if(!oCV&&parent!=this&&parent.doSingleDrill){
if(getCVId()!=""&&getCVId()!=cvId){
cvId=getCVId();
}
return parent.doSingleDrill(_5bd,args,_5bf,_5c0,_5c1,_5c2,_5c3,_5c4,cvId,_5c6,_5c7);
}else{
if(typeof _5bf=="undefined"){
_5bf="default";
}else{
if(_5bf=="execute"){
_5bf="run";
}
}
if(_5bf=="edit"&&oCV!=null&&typeof oCV.m_viewerFragment){
_5bd="_blank";
}
var _5ca=buildDrillForm(oCV);
var _5cb="<authoredDrillRequest>";
_5cb+="<param name=\"action\">"+sXmlEncode(_5bf)+"</param>";
_5cb+="<param name=\"target\">"+sXmlEncode(args[0][1])+"</param>";
_5cb+="<param name=\"format\">"+sXmlEncode(_5c0)+"</param>";
_5cb+="<param name=\"locale\">"+sXmlEncode(_5c1)+"</param>";
_5cb+="<param name=\"prompt\">"+sXmlEncode(_5c6)+"</param>";
_5cb+="<param name=\"dynamicDrill\">"+sXmlEncode(_5c7)+"</param>";
if(typeof oCV!="undefined"&&oCV!=null){
_5cb+="<param name=\"sourceTracking\">"+oCV.getTracking()+"</param>";
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"){
_5cb+="<param name=\"source\">"+sXmlEncode(document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value)+"</param>";
}
var _5cc=oCV.getModelPath();
_5cb+="<param name=\"metadataModel\">"+sXmlEncode(_5cc)+"</param>";
_5cb+="<param name=\"selectionContext\">"+sXmlEncode(getViewerSelectionContext(oCV.getSelectionController(),new CSelectionContext(_5cc)))+"</param>";
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"&&document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value!=""){
_5cb+="<param name=\"source\">"+sXmlEncode(document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value)+"</param>";
}else{
if(typeof oCV.envParams["ui.spec"]!="undefined"){
_5cb+="<param name=\"sourceSpecification\">"+sXmlEncode(oCV.envParams["ui.spec"])+"</param>";
}
}
}
if(_5c2!=""){
_5cb+="<param name=\"bookmark\">"+_5c2+"</param>";
}
if(_5bf!="view"){
if(typeof _5c3!="undefined"){
_5cb+="<param name=\"sourceContext\">"+sXmlEncode(_5c3)+"</param>";
}
if(typeof _5c4!="undefined"){
_5cb+="<param name=\"objectPaths\">"+sXmlEncode(_5c4)+"</param>";
}
}
var _5cd=0;
_5cb+="<drillParameters>";
var _5ce=[];
for(_5cd=1;_5cd<args.length;_5cd++){
var sSel=args[_5cd][1];
if(_5c0=="HTML"&&(sSel.indexOf("<selectChoices")==0)){
var _5d0=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(args[_5cd][1])));
if(_5d0){
var sMun=_5d0.getAttribute("mun");
if(sMun!=null&&sMun!=""){
_5d0.setAttribute("useValue",sMun);
sSel="<selectChoices>"+XMLBuilderSerializeNode(_5d0)+"</selectChoices>";
}
}
}
var _5d2=args[_5cd][0];
var _5d3=false;
for(var i=0;i<_5ce.length;i++){
var _5d5=_5ce[i];
if(_5d5.name===_5d2&&_5d5.value===sSel){
_5d3=true;
break;
}
}
if(!_5d3){
_5ce.push({"name":_5d2,"value":sSel});
_5cb+="<param name=\""+sXmlEncode(_5d2)+"\">"+sXmlEncode(sSel)+"</param>";
}
}
_5cb+="</drillParameters>";
_5cb+=getExecutionParamNode(oCV);
_5cb+="</authoredDrillRequest>";
_5ca.appendChild(createFormField("authoredDrill.request",_5cb));
_5ca.appendChild(createFormField("ui.action","authoredDrillThrough2"));
_5ca.appendChild(createFormField("b_action","cognosViewer"));
addDrillEnvironmentFormFields(_5ca,oCV);
if(!oCV||!oCV.executeDrillThroughForIWidgetMobile(_5ca)){
if(oCV&&typeof oCV.sendDrillThroughRequest==="function"){
oCV.sendDrillThroughRequest(_5ca);
}else{
if(_5bd==""&&oCV!=null&&typeof oCV.m_viewerFragment!="undefined"){
oCV.m_viewerFragment.raiseAuthoredDrillEvent(_5cb);
}else{
if((oCV!=null&&oCV.getViewerWidget()!=null)||_5bd!=""||_5c0=="XLS"||_5c0=="CSV"||_5c0=="XLWA"||_5c0=="singleXLS"){
setBackURLToCloseWindow(_5ca);
var _5d6="winNAT_"+(new Date()).getTime();
var _5d7="..";
if(oCV!=null){
_5d7=oCV.getWebContentRoot();
}
var _5d8=_5d7+"/rv/blankDrillWin.html";
if(_5c8){
_5d8+="?cv.id="+_5c8;
}
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Specification",_5cb,"xml");
}
_5ca.target=_5d6;
newWindow=window.open(_5d8,_5d6);
}else{
appendReportHistoryObjects(oCV,_5ca);
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Specification",_5cb,"xml");
}
_5ca.target="_self";
_5ca.submit();
if(oCV!=null){
setTimeout(getCognosViewerObjectRefAsString(oCV.getId())+".getRequestIndicator().show()",10);
}
}
}
}
}
}
};
function getExecutionParamNode(oCV){
var _5da="";
if(typeof oCV!="undefined"&&oCV!=null){
var _5db=oCV.getExecutionParameters();
if(_5db!=""){
_5da+="<param name=\"executionParameters\">";
_5da+=sXmlEncode(_5db);
_5da+="</param>";
}
}
return _5da;
};
function doSingleDrillThrough(_5dc,_5dd,cvId){
var _5df=_5dc[0][0];
if(typeof _5df=="undefined"||_5df==null){
return;
}
var _5e0=cvId&&window[cvId+"drillTargets"]?window[cvId+"drillTargets"][_5df]:drillTargets[_5df];
if(typeof _5e0=="undefined"){
return;
}
if(_5dd!=""&&_5e0.getPath()==""){
document.location="#"+_5dd;
}else{
var args=[];
args[args.length]=["ui.object",_5e0.getPath()];
for(var _5e2=1;_5e2<_5dc.length;++_5e2){
args[args.length]=_5dc[_5e2];
}
var _5e3="";
if(_5e0.getShowInNewWindow()=="true"){
_5e3="_blank";
}
var _5e4=_5e0.getParameters();
var _5e5=_5e0.getObjectPaths();
var _5e6=cvId;
if(!cvId){
_5e6=getCVId();
}
doSingleDrill(_5e3,args,_5e0.getMethod(),_5e0.getOutputFormat(),_5e0.getOutputLocale(),_5dd,_5e4,_5e5,_5e6,_5e0.getPrompt(),false);
}
};
function getCVId(){
var _5e7="";
try{
_5e7=this.frameElement.id.substring("CVIFrame".length);
}
catch(exception){
}
return _5e7;
};
function doMultipleDrillThrough(_5e8,cvId){
var _5ea="<rvDrillTargets>";
for(var _5eb=0;_5eb<_5e8.length;++_5eb){
var _5ec=_5e8[_5eb];
if(_5ec.length<3){
continue;
}
var _5ed=_5ec[0];
if(typeof _5ed=="undefined"||_5ed==null){
continue;
}
var _5ee=_5ec[1];
if(typeof _5ee=="undefined"||_5ee==null){
continue;
}
var _5ef=cvId&&window[cvId+"drillTargets"]?window[cvId+"drillTargets"][_5ed]:drillTargets[_5ed];
if(typeof _5ef=="undefined"||_5ef==null){
continue;
}
if(_5ee===null||_5ee===""){
_5ee=_5ef.getLabel();
}
_5ea+="<drillTarget ";
_5ea+="outputFormat=\"";
_5ea+=_5ef.getOutputFormat();
_5ea+="\" ";
_5ea+="outputLocale=\"";
_5ea+=_5ef.getOutputLocale();
_5ea+="\" ";
_5ea+="label=\"";
_5ea+=sXmlEncode(_5ee);
_5ea+="\" ";
_5ea+="path=\"";
_5ea+=sXmlEncode(_5ef.getPath());
_5ea+="\" ";
_5ea+="showInNewWindow=\"";
_5ea+=_5ef.getShowInNewWindow();
_5ea+="\" ";
_5ea+="method=\"";
_5ea+=_5ef.getMethod();
_5ea+="\" ";
_5ea+="prompt=\"";
_5ea+=_5ef.getPrompt();
_5ea+="\" ";
_5ea+="dynamicDrill=\"";
_5ea+=_5ef.isDynamicDrillThrough();
_5ea+="\">";
for(var _5f0=2;_5f0<_5ec.length;++_5f0){
_5ea+=_5ec[_5f0];
}
_5ea+=_5ef.getParameters();
_5ea+=_5ef.getObjectPaths();
_5ea+="</drillTarget>";
}
_5ea+="</rvDrillTargets>";
if(!cvId){
cvId=getCVId();
}
doMultipleDrills(_5ea,cvId);
};
function CScriptLoader(_5f1){
this.m_oFiles={};
this.m_aScripts=[];
this.m_aDocumentWriters=[];
this.m_ajaxWarnings=[];
this.m_bIgnoreAjaxWarnings=false;
this.m_bHandleStylesheetLimit=false;
this.m_iInterval=20;
this.m_reFindCssPath=new RegExp("<link[^>]*href=\"([^\"]*)\"","i");
this.m_reFindInlineStyle=/<style\b(\s|.)*?<\/style>/gi;
this.m_reHasCss=/<link .*?>/gi;
this.m_reIsCss=/\.css$/i;
this.m_reIsJavascript=/\.js$/i;
this.m_reIsPromptingLocaleJavascript=/prompting.res.[promptingStrings|promptLocale].*\.js$/i;
this.m_reScriptTagClose=/\s*<\/script>.*?$/i;
this.m_reScriptTagOpen=/^.*?<script[^>]*>\s*/i;
this.m_reStyleTagClose=/(-|>|\s)*<\/style>\s*$/gi;
this.m_reStyleTagOpen=/^\s*<style[^>]*>(\s|<|!|-)*/gi;
this.m_reEscapedCharacters=/\\[\\"']/g;
this.m_reStringLiterals=/("|')[\s\S]*?\1/g;
this.m_sWebContentRoot=_5f1;
this.m_bHasCompletedExecution=false;
this.m_aScriptLoadQueue=[];
this.m_bBlockScriptLoading=false;
this.m_bUseScriptBlocking=false;
this.m_bBlockPromptingLocaleScripts=false;
this.m_aBlockedPromptingLocaleFileQueue=[];
};
CScriptLoader.prototype.hasCompletedExecution=function(){
return this.m_bHasCompletedExecution;
};
CScriptLoader.prototype.setHandlerStylesheetLimit=function(_5f2){
this.m_bHandleStylesheetLimit=_5f2;
};
CScriptLoader.prototype.executeScripts=function(_5f3,_5f4){
if(this.isReadyToExecute()){
for(var _5f5=0;_5f5<this.m_aScripts.length;_5f5++){
if(this.m_aScripts[_5f5]){
var _5f6=document.createElement("script");
_5f6.setAttribute("language","javascript");
_5f6.setAttribute("type","text/javascript");
this.addNamespaceAttribute(_5f6,_5f4);
_5f6.text=this.m_aScripts[_5f5];
document.getElementsByTagName("head").item(0).appendChild(_5f6);
}
}
this.m_aScripts=[];
for(var idx=0;idx<this.m_aDocumentWriters.length;++idx){
var _5f8=this.m_aDocumentWriters[idx];
_5f8.execute();
}
this.m_aDocumentWriters=[];
if(!this.m_aScripts.length&&!this.m_aDocumentWriters.length){
if(typeof _5f3=="function"){
_5f3();
}
this.m_bHasCompletedExecution=true;
}else{
setTimeout(function(){
window.gScriptLoader.executeScripts(_5f3,_5f4);
},this.m_iInterval);
}
}else{
setTimeout(function(){
window.gScriptLoader.executeScripts(_5f3,_5f4);
},this.m_iInterval);
}
};
CScriptLoader.prototype.isReadyToExecute=function(){
for(var _5f9 in this.m_oFiles){
if(this.m_oFiles[_5f9]!="complete"){
return false;
}
}
if(this.m_aScriptLoadQueue.length>0){
return false;
}
return true;
};
CScriptLoader.prototype.loadCSS=function(_5fa,_5fb,_5fc,_5fd){
var aM=_5fa.match(this.m_reHasCss);
if(aM){
for(var i=0;i<aM.length;i++){
if(aM[i].match(this.m_reFindCssPath)){
var _600=RegExp.$1;
if(_600.indexOf("GlobalReportStyles")!=-1){
this.validateGlobalReportStyles(_600);
if(_5fc){
if(_600.indexOf("GlobalReportStyles.css")!=-1){
_600=_600.replace("GlobalReportStyles.css","GlobalReportStyles_10.css");
}
var _601=this.getGlobalReportStylesClassPrefix(_600);
_600=_600.replace(".css","_NS.css");
if(_5fb){
_5fb.className="buxReport "+_601;
}
}
}
this.loadObject(_600,_5fd);
}
_5fa=_5fa.replace(aM[i],"");
}
}
return _5fa;
};
CScriptLoader.prototype.getGlobalReportStylesClassPrefix=function(_602){
var _603=null;
if(_602.indexOf("GlobalReportStyles_10.css")!=-1){
_603="v10";
}else{
if(_602.indexOf("GlobalReportStyles_1.css")!=-1){
_603="v1";
}else{
if(_602.indexOf("GlobalReportStyles_none.css")!=-1){
_603="vnone";
}else{
if(_602.indexOf("GlobalReportStyles.css")!=-1){
_603="v8";
}
}
}
}
return _603;
};
CScriptLoader.prototype.validateGlobalReportStyles=function(_604){
var _605=document.getElementsByTagName("link");
for(var i=0;i<_605.length;++i){
var _607=_605[i];
if(_607.getAttribute("href").indexOf("GlobalReportStyles")!=-1){
if(_607.getAttribute("href").toLowerCase()!=_604.toLowerCase()){
var _608=_604.split("/");
var _609=_607.getAttribute("href").split("/");
if(_608[_608.length-1]!=_609[_609.length-1]){
this.m_ajaxWarnings.push("Ajax response contains different versions of the GlobalReportStyles.css.");
}
}
break;
}
}
};
CScriptLoader.prototype.loadFile=function(_60a,_60b,_60c){
var sURL="";
if(_60a){
sURL=_60a;
}
var _60e=null;
if(typeof _60b=="string"){
_60e=_60b;
}
var _60f="POST";
if(_60c=="GET"){
_60f="GET";
}
var _610=null;
if(typeof ActiveXObject!="undefined"){
_610=new ActiveXObject("Msxml2.XMLHTTP");
}else{
_610=new XMLHttpRequest();
}
_610.open(_60f,sURL,false);
_610.send(_60e);
return _610.responseText;
};
function CScriptLoader_onReadyStateChange(){
if(typeof this.readyState=="undefined"){
this.readyState="complete";
}
if(this.readyState=="loaded"||this.readyState=="complete"){
var path=this.sFilePath;
if(!path&&this.getAttribute){
path=this.getAttribute("href");
}
window.gScriptLoader.setFileState(path,"complete");
window.gScriptLoader.m_bBlockScriptLoading=false;
if(this.sFilePath&&window.gScriptLoader.m_bBlockPromptingLocaleScripts&&this.sFilePath.match(window.gScriptLoader.m_reIsPromptingLocaleJavascript)){
window.gScriptLoader.m_bBlockPromptingLocaleScripts=false;
if(window.gScriptLoader.m_aBlockedPromptingLocaleFileQueue.length>0){
var _612=window.gScriptLoader.m_aBlockedPromptingLocaleFileQueue.shift();
window.gScriptLoader.loadObject(_612.sName,_612.sNamespaceId);
}
}
if(window.gScriptLoader.m_aScriptLoadQueue.length>0){
window.gScriptLoader.loadObject();
}
}
};
CScriptLoader.prototype.moveLinks=function(node){
if(!node){
return;
}
var _614=node.getAttribute("href");
if(!_614||this.m_oFiles[_614]){
return;
}
this.m_oFiles[_614]="complete";
document.getElementsByTagName("head").item(0).appendChild(node);
};
CScriptLoader.prototype.loadObject=function(_615,_616){
var _617=null;
if(typeof _615==="undefined"){
if(this.m_aScriptLoadQueue.length>0){
var _618=this.m_aScriptLoadQueue.shift();
_615=_618.name;
_616=_618.namespaceId;
}else{
return;
}
}
if(this.m_oFiles[_615]){
return;
}
if(this.m_bBlockScriptLoading){
this.m_aScriptLoadQueue.push({"name":_615,"namespaceId":_616});
}else{
if(_615.match(this.m_reIsCss)){
_617=document.createElement("link");
_617.setAttribute("rel","stylesheet");
_617.setAttribute("type","text/css");
_617.setAttribute("href",_615);
if(window.isIE&&window.isIE()){
_617.onreadystatechange=CScriptLoader_onReadyStateChange;
_617.onload=CScriptLoader_onReadyStateChange;
_617.onerror=CScriptLoader_onReadyStateChange;
this.m_oFiles[_615]="new";
}else{
this.m_oFiles[_615]="complete";
}
}else{
if(_615.match(this.m_reIsJavascript)){
if(_615.match(this.m_reIsPromptingLocaleJavascript)){
if(this.m_bBlockPromptingLocaleScripts){
this.m_aBlockedPromptingLocaleFileQueue.push({"sName":_615,"sNamespaceId":_616});
return;
}
this.m_bBlockPromptingLocaleScripts=true;
}
this.m_bBlockScriptLoading=this.m_bUseScriptBlocking;
_617=document.createElement("script");
_617.setAttribute("language","javascript");
_617.setAttribute("type","text/javascript");
_617.setAttribute("src",_615);
_617.sFilePath=_615;
_617.onreadystatechange=CScriptLoader_onReadyStateChange;
_617.onload=CScriptLoader_onReadyStateChange;
_617.onerror=CScriptLoader_onReadyStateChange;
this.addNamespaceAttribute(_617,_616);
this.m_oFiles[_615]="new";
}
}
if(_617){
document.getElementsByTagName("head").item(0).appendChild(_617);
}
}
};
CScriptLoader.prototype.loadScriptsFromDOM=function(_619,_61a,_61b){
if(!_619){
return;
}
var _61c=_619.parentNode.getElementsByTagName("script");
while(_61c.length>0){
var _61d=_61c[0];
if(_61d.getAttribute("src")!=null&&_61d.getAttribute("src").length>0){
this.loadObject(_61d.getAttribute("src"),_61a);
}else{
var _61e=_61d.innerHTML;
var _61f=false;
if(_61e.indexOf("document.write")!=-1){
var _620=_61e.replace(this.m_reEscapedCharacters,"").replace(this.m_reStringLiterals,"");
_61f=(_620.indexOf("document.write")!=-1);
}
if(_61f){
if(_61b){
var sId="CVScriptFromDOMPlaceHolder"+_61c.length+_61a;
var _622=_61d.ownerDocument.createElement("span");
_622.setAttribute("id",sId);
_61d.parentNode.insertBefore(_622,_61d);
this.m_aDocumentWriters.push(new CDocumentWriter(sId,_61e));
}
}else{
if(_61e.length>0){
this.m_aScripts.push(_61e);
}
}
}
_61d.parentNode.removeChild(_61d);
}
};
CScriptLoader.prototype.loadStyles=function(_623,_624){
if(!_623||!_623.parentNode){
return;
}
var _625=_623.parentNode.getElementsByTagName("style");
while(_625.length>0){
var _626=_625[0];
if(_624){
this.addNamespaceAttribute(_626,_624);
}
if(window.isIE&&window.isIE()&&window.getNavVer()<10){
if((document.getElementsByTagName("style").length+document.getElementsByTagName("link").length)>=30){
if(this.m_bHandleStylesheetLimit){
if(typeof window.gaRV_INSTANCES!="undefined"){
for(var i=0;i<window.gaRV_INSTANCES.length;i++){
window.gaRV_INSTANCES[i].cleanupStyles();
}
}
}
if((document.getElementsByTagName("style").length+document.getElementsByTagName("link").length)>=30){
if(typeof console!="undefined"&&console&&console.log){
console.log("Stylesheet limit reached.");
}
this.m_ajaxWarnings.push("Stylesheet limit reached.");
return;
}
}
}
document.getElementsByTagName("head").item(0).appendChild(_626);
}
};
CScriptLoader.prototype.loadAll=function(_628,_629,_62a,_62b){
this.m_bScriptLoaderCalled=true;
this.m_bHasCompletedExecution=false;
this.loadScriptsFromDOM(_628,_62a,_62b);
if(this.containsAjaxWarnings()){
return false;
}
this.loadStyles(_628,_62a);
if(this.containsAjaxWarnings()){
return false;
}
this.executeScripts(_629,_62a);
return true;
};
CScriptLoader.prototype.setFileState=function(_62c,_62d){
this.m_oFiles[_62c]=_62d;
};
CScriptLoader.prototype.containsAjaxWarnings=function(){
if(this.m_bIgnoreAjaxWarnings){
return false;
}else{
return (this.m_ajaxWarnings.length>0);
}
};
CScriptLoader.prototype.addNamespaceAttribute=function(_62e,_62f){
if(typeof _62f==="string"){
_62e.setAttribute("namespaceId",_62f);
}
};
if(typeof window.gScriptLoader=="undefined"){
window.gScriptLoader=new CScriptLoader();
}
function ViewerA11YHelper(oCV){
this.m_oCV=oCV;
};
ViewerA11YHelper.prototype.onFocus=function(evt){
var _632=getCrossBrowserNode(evt);
_632=ViewerA11YHelper.findChildOfTableCell(_632);
this.updateCellAccessibility(_632,false);
};
ViewerA11YHelper.prototype.onKeyDown=function(evt){
evt=(evt)?evt:((event)?event:null);
var _634=getCrossBrowserNode(evt);
if(ViewerA11YHelper.isTableCell(_634)){
for(var i=0;i<_634.childNodes.length;i++){
if(_634.childNodes[i].nodeName.toLowerCase()=="span"){
_634=_634.childNodes[i];
break;
}
}
}
if(!this.isValidNodeToSelect(_634)){
return true;
}
_634=ViewerA11YHelper.findChildOfTableCell(_634);
if(_634){
if(evt.keyCode=="39"){
if(this.m_oCV.getState()&&this.m_oCV.getState().getFindState()&&evt.ctrlKey&&evt.shiftKey){
this.m_oCV.executeAction("FindNext");
}else{
this.moveRight(_634);
}
return stopEventBubble(evt);
}else{
if(evt.keyCode=="37"){
this.moveLeft(_634);
return stopEventBubble(evt);
}else{
if(evt.keyCode=="38"){
this.moveUp(_634);
return stopEventBubble(evt);
}else{
if(evt.keyCode=="40"){
this.moveDown(_634);
return stopEventBubble(evt);
}else{
if(evt.keyCode=="13"){
if(this.m_oCV.isBux){
if(this.m_oCV.getViewerWidget().isSelectionFilterEnabled()){
this.m_oCV.getViewerWidget().preprocessPageClicked(false,evt);
if(this.m_oCV.getSelectionController().pageClicked(evt)!==false){
this.m_oCV.JAWSTalk(RV_RES.IDS_JS_SELECTION_FILTER_INFO_JAWS);
this.m_oCV.getViewerWidget().updateToolbar();
}
}else{
this.m_oCV.getSelectionController().pageClicked(evt);
var _636=this.m_oCV.getActionFactory().load("Selection");
_636.onKeyDown(evt);
}
this.m_oCV.getViewerWidget().onSelectionChange();
}else{
this.m_oCV.de(evt);
}
}else{
if(evt.keyCode=="32"){
if(this.m_oCV.isBux){
this.m_oCV.getViewerWidget().preprocessPageClicked(false);
if(this.m_oCV.getSelectionController().pageClicked(evt)!==false&&this.m_oCV.getViewerWidget().isSelectionFilterEnabled()){
this.m_oCV.JAWSTalk(RV_RES.IDS_JS_SELECTION_FILTER_INFO_JAWS);
}
this.m_oCV.getViewerWidget().updateToolbar();
this.m_oCV.getViewerWidget().onSelectionChange();
}else{
this.m_oCV.getSelectionController().pageClicked(evt);
}
return stopEventBubble(evt);
}else{
if(evt.keyCode=="46"&&this.m_oCV.isBux){
if(typeof this.m_oCV.envParams!="undefined"&&typeof this.m_oCV.envParams["ui.action"]!="undefined"&&this.m_oCV.envParams["ui.action"]!="view"&&!this.m_oCV.isLimitedInteractiveMode()){
var _637=this.m_oCV.getActionFactory().load("Delete");
if(!this.m_oCV.isBlacklisted("Delete")&&_637.canDelete()){
_637.execute();
return stopEventBubble(evt);
}
}
}else{
if(this.m_oCV.isBux&&evt.ctrlKey==true&&evt.shiftKey==true&&evt.keyCode=="49"){
var lid=this.m_oCV.getSelectionController().getSelectionObjectFactory().getLayoutElementId(_634);
if(lid!=""){
lid=lid.split(this.m_oCV.getId())[0];
var _639=-1;
var _63a=this.m_oCV.getRAPReportInfo();
if(_63a){
var _63b=_63a.getContainer(lid);
if(typeof _63b.layoutIndex!="undefined"){
_639=_63b.layoutIndex;
}
}
var _63c=document.getElementById("infoBarHeaderButton"+_639+this.m_oCV.getId());
if(_63c!==null){
this.m_oCV.setCurrentNodeFocus(getCrossBrowserNode(evt));
_63c.focus();
}
}
return stopEventBubble(evt);
}else{
if(!this.m_oCV.isBux&&evt.shiftKey==true&&evt.keyCode=="121"){
var ocv=this.m_oCV;
var _63e=function(){
if(typeof evt.clientX=="undefined"||typeof evt.clientY=="undefined"){
var _63f=clientToScreenCoords(evt.target,document.body);
evt.clientX=_63f.leftCoord;
evt.clientY=_63f.topCoord;
}
ocv.dcm(evt,true);
};
if(isFF()){
setTimeout(_63e,0);
}else{
_63e.call();
}
return stopEventBubble(evt);
}else{
if(this.m_oCV.isBux&&(evt.keyCode=="93"||(evt.shiftKey==true&&evt.keyCode=="121"))){
var _640=this.m_oCV.getViewerWidget();
var _641=this.m_oCV.getSelectionController();
_640.preprocessPageClicked(true);
_641.pageClicked(evt);
_640.updateToolbar();
_640.onContextMenu(evt);
}
}
}
}
}
}
}
}
}
}
}
};
ViewerA11YHelper.prototype.isValidNodeToSelect=function(node){
return this.getValidNodeToSelect(node)?true:false;
};
ViewerA11YHelper.prototype.getValidNodeToSelect=function(node){
if(node&&node.style&&node.style.visibility!="hidden"&&node.style.display!="none"){
var _644=node.nodeName.toLowerCase();
if((_644=="span"&&(!node.getAttribute("class")||node.getAttribute("class").indexOf("expandButton")===-1))||(_644=="div"&&node.getAttribute("flashchartcontainer")=="true")||(_644=="div"&&node.getAttribute("chartcontainer")=="true")||(_644=="img"&&(!node.id||node.id.indexOf("sortimg")!==0))){
return node;
}
if(ViewerA11YHelper.isSemanticNode(node)){
var _645=node.childNodes&&node.childNodes.length?node.childNodes[0]:null;
if(_645){
return this.getValidNodeToSelect(_645);
}
}
}
return null;
};
ViewerA11YHelper.isSemanticNode=function(node){
if(!ViewerA11YHelper.isSemanticNode._semanticNodeNames){
ViewerA11YHelper.isSemanticNode._semanticNodeNames=["strong","em","h1","h2","h3","h4","h5","h6"];
}
var _647=node.nodeName.toLowerCase();
for(var i=0;i<ViewerA11YHelper.isSemanticNode._semanticNodeNames.length;i++){
if(_647===ViewerA11YHelper.isSemanticNode._semanticNodeNames[i]){
return true;
}
}
return false;
};
ViewerA11YHelper.isTableCell=function(node){
var _64a=node.nodeName.toLowerCase();
return _64a==="td"||_64a==="th";
};
ViewerA11YHelper.findChildOfTableCell=function(_64b){
var _64c=_64b;
while(_64c&&_64c.parentNode){
if(ViewerA11YHelper.getTableCell(_64c)){
break;
}
_64c=_64c.parentNode;
}
return _64c;
};
ViewerA11YHelper.getTableCell=function(node){
var _64e=node.parentNode;
if(ViewerA11YHelper.isTableCell(_64e)){
return _64e;
}
if(ViewerA11YHelper.isSemanticNode(_64e)&&ViewerA11YHelper.isTableCell(_64e.parentNode)){
return _64e.parentNode;
}
return null;
};
ViewerA11YHelper.prototype.moveRight=function(_64f){
var _650=this.getNextNonTextSibling(_64f);
_650=this.getValidNodeToSelect(_650);
if(_650){
this.setFocusToNode(_650);
return true;
}
var _651=ViewerA11YHelper.getTableCell(_64f);
_651=this.getPfMainOutputCell(_651);
while(_651.nextSibling){
if(this.moveToTD(_651.nextSibling)){
return true;
}
_651=_651.nextSibling;
}
var _652=_651.parentNode;
while(_652.nextSibling){
var _653=_652.nextSibling;
if(this.moveToTD(_653.childNodes[0])){
return true;
}
_652=_652.nextSibling;
}
return false;
};
ViewerA11YHelper.prototype.moveLeft=function(_654){
var _655=this.getPreviousNonTextSibling(_654);
_655=this.getValidNodeToSelect(_655);
if(_655){
this.setFocusToNode(_655);
return true;
}
var _656=ViewerA11YHelper.getTableCell(_654);
_656=this.getPfMainOutputCell(_656);
while(_656.previousSibling){
if(this.moveToTDFromTheRight(_656.previousSibling)){
return true;
}
_656=_656.previousSibling;
}
var _657=_656.parentNode;
while(_657.previousSibling){
var _658=_657.previousSibling;
if(this.moveToTDFromTheRight(_658.lastChild)){
return true;
}
_657=_657.previousSibling;
}
return false;
};
ViewerA11YHelper.prototype.moveDown=function(_659){
var _65a=ViewerA11YHelper.getTableCell(_659);
_65a=this.getPfMainOutputCell(_65a);
var _65b=this.getColumnIndex(_65a);
_65b+=this.getColSpanFromRowSpans(_65a);
var _65c=_65a.parentNode;
if(_65a.rowSpan&&_65a.rowSpan>1){
var _65d=_65a.rowSpan;
for(var _65e=1;_65e<_65d;_65e++){
_65c=_65c.nextSibling;
}
}
var _65f=false;
while(_65c){
if(_65c.nextSibling){
_65c=_65c.nextSibling;
}else{
if(_65a.nextSibling&&!_65f){
_65c=_65c.parentNode.firstChild;
_65f=true;
_65b++;
}else{
return false;
}
}
if(this.doMoveUpDown(_65c,_65b)){
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.moveUp=function(_660){
var _661=ViewerA11YHelper.getTableCell(_660);
_661=this.getPfMainOutputCell(_661);
var _662=_661.parentNode;
var _663=this.getColumnIndex(_661);
_663+=this.getColSpanFromRowSpans(_661);
var _664=false;
while(_662){
if(_662.previousSibling){
_662=_662.previousSibling;
}else{
if(_661.previousSibling&&!_664){
_662=_662.parentNode.lastChild;
_664=true;
_663--;
}else{
return false;
}
}
if(this.doMoveUpDown(_662,_663)){
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.getNextNonTextSibling=function(node){
while(node.nextSibling){
node=node.nextSibling;
if(node.nodeName.toLowerCase()!="#text"){
return node;
}
}
if(ViewerA11YHelper.isSemanticNode(node.parentNode)){
return this.getNextNonTextSibling(node.parentNode);
}
return null;
};
ViewerA11YHelper.prototype.doMoveUpDown=function(_666,_667){
if(_666!=null){
var _668=_666.firstChild;
var pos=this.getColSpanFromRowSpans(_668);
while(_668){
if(pos==_667){
return this.moveToTDFromTheRight(_668);
}else{
if(pos>_667){
break;
}
}
var _66a=0;
if(_668.colSpan){
_66a=_668.colSpan;
}else{
_66a++;
}
pos+=_66a;
_668=_668.nextSibling;
}
}
};
ViewerA11YHelper.prototype.moveToTDFromTheRight=function(td){
td=this.getPfVisibleCell(td);
var _66c=td.childNodes;
for(var _66d=_66c.length-1;_66d>=0;_66d--){
var node=this.getValidNodeToSelect(_66c[_66d]);
if(node){
if(node.childNodes&&node.childNodes[0]&&node.childNodes[0].nodeName.toLowerCase()=="span"){
node=node.childNodes[0];
}
if(node.tabIndex!=-1&&node.tabIndex!=0){
node.tabIndex=-1;
}
this.setFocusToNode(node);
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.moveToTD=function(td){
td=this.getPfVisibleCell(td);
var _670=td.childNodes;
for(var _671=0;_671<_670.length;_671++){
var node=this.getValidNodeToSelect(_670[_671]);
if(node){
if(node.childNodes&&node.childNodes[0]&&node.childNodes[0].nodeName.toLowerCase()=="span"){
node=node.childNodes[0];
}
if(node.tabIndex!=-1&&node.tabIndex!=0){
node.tabIndex=-1;
}
this.setFocusToNode(node);
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.setFocusToNode=function(node){
this.m_oCV.setCurrentNodeFocus(node);
this.updateCellAccessibility(node,false);
node.focus();
if(this.m_oCV.m_pinFreezeManager){
var _674=this.m_oCV.m_pinFreezeManager.nodeToContainer(node);
if(_674){
_674.updateScroll(node);
}
}
};
ViewerA11YHelper.prototype.getPfMainOutputCell=function(_675){
var main=null;
var slid=_675.getAttribute("pfslid");
if(slid){
var lid=PinFreezeContainer.getLidFromSlid(slid);
if(lid&&this.m_oCV.m_pinFreezeManager){
lid=this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
var _679=this.m_oCV.m_pinFreezeManager.getContainer(lid);
if(_679){
main=_679.getMain(_675);
}
}
}
return main?main:_675;
};
ViewerA11YHelper.prototype.getPreviousNonTextSibling=function(node){
while(node.previousSibling){
node=node.previousSibling;
if(node.nodeName.toLowerCase()!="#text"){
return node;
}
}
if(ViewerA11YHelper.isSemanticNode(node.parentNode)){
return this.getPreviousNonTextSibling(node.parentNode);
}
return null;
};
ViewerA11YHelper.prototype.getColumnIndex=function(node){
var _67c=0;
while(node.previousSibling){
node=node.previousSibling;
if(node.rowSpan==1){
if(node.colSpan){
_67c+=node.colSpan;
}else{
_67c++;
}
}
}
return _67c;
};
ViewerA11YHelper.prototype.getPfVisibleCell=function(_67d){
var copy=null;
var slid=_67d.getAttribute("pfslid");
if(slid){
var lid=PinFreezeContainer.getLidFromSlid(slid);
if(lid&&this.m_oCV.m_pinFreezeManager){
lid=this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
var _681=this.m_oCV.m_pinFreezeManager.getContainer(lid);
if(_681){
copy=_681.getCopy(_67d);
}
}
}
return copy?copy:_67d;
};
ViewerA11YHelper.prototype.updateCellAccessibility=function(_682,_683){
if(!_682){
return false;
}
var _684=false;
var _685=false;
var _686=false;
var _687=_682.getAttribute("ctx")!=null?_682:_682.parentNode;
if(_682.getAttribute("flashChartContainer")!="true"){
if(_687.getAttribute("ctx")!=null){
if(this.m_oCV.isBux){
var _688=this.m_oCV.getAction("DrillUpDown");
_688.updateDrillability(this.m_oCV,_687);
_684=_688.canDrillDown();
_685=_688.canDrillUp();
}else{
var _689=_687.getAttribute("ctx");
var _68a=_689.indexOf(":")==-1?_689:_689.substring(0,_689.indexOf(":"));
var _68b=this.m_oCV.getSelectionController();
_684=_68b.canDrillDown(_68a);
_685=_68b.canDrillUp(_68a);
}
}
_686=_682.parentNode.getAttribute("dtTargets")?true:false;
}
var _68c=_682.nodeName.toLowerCase()=="img";
var _68d=_682.parentNode.getAttribute("type")=="columnTitle";
if(!_68c&&(_683||((_682.getAttribute("aria-labelledby")!=null||_68d||this.m_oCV.isAccessibleMode())))){
var _68e="";
if(_682.parentNode.getAttribute("cc")=="true"){
_68e+=" "+RV_RES.IDS_JS_CROSSTAB_CORNER;
}
if(_682.innerHTML.length===0){
_68e+=" "+RV_RES.IDS_JS_EMPTY_CELL;
}
if(_684&&_685){
_68e+=" "+RV_RES.IDS_JS_DRILL_DOWN_UP_JAWS;
}else{
if(_684){
_68e+=" "+RV_RES.IDS_JS_DRILL_DOWN_JAWS;
}else{
if(_685){
_68e+=" "+RV_RES.IDS_JS_DRILL_UP_JAWS;
}
}
}
if(_686){
_68e+=" "+RV_RES.IDS_JS_DRILL_THROUGH_JAWS;
}
if(_682.altText&&_682.altText.length>0){
_68e=_682.altText;
}else{
if(_682.getAttribute("flashChartContainer")=="true"){
_68e=RV_RES.IDS_JS_CHART_IMAGE;
}
}
if(this.m_oCV.isBux){
var _68f=_682.previousSibling;
if(_68f){
var wid=_68f.getAttribute("widgetid");
if(wid&&wid.indexOf("comment")){
_68e+=" "+RV_RES.IDS_JS_ANNOTATION_JAWS;
}
}
if(_682.getAttribute("rp_name")||_682.parentNode.getAttribute("rp_name")){
_68e+=" "+RV_RES.IDS_JS_LABEL_HAS_BEEN_RENAMED;
}
if(_682.nextSibling&&_682.nextSibling.getAttribute("class")=="sortIconVisible"){
_68e+=" "+_682.nextSibling.getAttribute("alt");
}
}
if(_68e.length>0){
this.addAriaLabelledByOnCell(_682,_68e);
}
}
if(_685||_684||_686){
this.addDrillAccessibilityAttributes(_682,_686);
}
if(_682.attachEvent){
_682.attachEvent("onblur",this.onBlur);
}else{
_682.addEventListener("blur",this.onBlur,false);
}
if((isIE()&&_682.getAttribute("tabIndex")!=0)||_68c){
_682.setAttribute("modifiedTabIndex","true");
_682.setAttribute("oldTabIndex",_682.getAttribute("tabIndex"));
_682.setAttribute("tabIndex",0);
}
};
ViewerA11YHelper.prototype.addAriaLabelledByOnCell=function(_691,_692){
var _693=0;
var _694=_691;
while(_694.previousSibling){
_693++;
_694=_694.previousSibling;
}
var _695=_691.getAttribute("ariaHiddenSpanId");
if(_695&&document.getElementById(_695)){
document.getElementById(_695).innerHTML=_692;
}else{
if(!_691.parentNode.id&&!_691.id){
_691.parentNode.id=Math.random();
}
var _696=document.createElement("span");
_696.style.visibility="hidden";
_696.style.display="none";
_696.id=(_691.id==""?_691.parentNode.id:_691.id)+"_"+_693;
_696.innerHTML=_692;
_691.parentNode.appendChild(_696);
var _697="";
if(_691.getAttribute("aria-labelledby")!=null){
_697+=_691.getAttribute("aria-labelledby");
}else{
if(_691.id==""){
_691.id=_691.parentNode.id+"_main_"+_693;
}
_697+=_691.id;
}
_697+=" "+_696.id;
_691.setAttribute("aria-labelledby",_697);
_691.setAttribute("ariaHiddenSpanId",_696.id);
}
};
ViewerA11YHelper.prototype.addDrillAccessibilityAttributes=function(_698,_699){
if(!_698.getAttribute("oldClassName")){
if(!_699){
_698.setAttribute("oldClassName",_698.className);
_698.className="dl "+_698.className;
}
if(!_698.getAttribute("role")){
_698.setAttribute("role","link");
}
}
};
ViewerA11YHelper.prototype.onBlur=function(evt){
var _69b=null;
if(isIE()){
_69b=getNodeFromEvent(evt,true);
}else{
_69b=this;
}
_69b=ViewerA11YHelper.findChildOfTableCell(_69b);
if(_69b){
if(_69b.getAttribute("oldClassName")){
_69b.className=_69b.getAttribute("oldClassName");
_69b.removeAttribute("oldClassName");
}
if(_69b.getAttribute("modifiedTabIndex")=="true"){
_69b.removeAttribute("modifiedTabIndex");
_69b.removeAttribute("tabIndex");
if(_69b.getAttribute("oldTabIndex")){
_69b.setAttribute("tabIndex",_69b.getAttribute("oldTabIndex"));
}
_69b.removeAttribute("oldTabIndex");
}
var _69c=_69b.getAttribute("ariaHiddenSpanId");
if(_69c){
var _69d=document.getElementById(_69c);
if(_69d){
_69d.innerHTML="";
}
}
}
};
ViewerA11YHelper.prototype.getColSpanFromRowSpans=function(_69e){
var _69f=0;
var _6a0=_69e.parentNode;
var _6a1=0;
while(_6a0){
var _6a2=_6a0.firstChild;
var _6a3=this.getColumnCount(_6a0)-_6a1;
while(_6a2&&_6a2.rowSpan>1&&_6a3>0&&_6a2!=_69e){
_69f+=_6a2.colSpan;
_6a2=_6a2.nextSibling;
_6a3--;
}
if(_6a0.childNodes.length>_6a1){
_6a1=this.getColumnCount(_6a0);
}
_6a0=_6a0.previousSibling;
}
return _69f;
};
ViewerA11YHelper.prototype.getColumnCount=function(_6a4){
var _6a5=0;
var node=_6a4.firstChild;
while(node){
_6a5+=node.colSpan;
node=node.nextSibling;
}
return _6a5;
};
ViewerA11YHelper.prototype.addLabelledByForItemsOutsideOfContainers=function(){
if(!this.m_oCV.isAccessibleMode()){
return;
}
var _6a7=document.getElementById("RVContent"+this.m_oCV.getId());
if(!_6a7){
return;
}
var _6a8=getElementsByAttribute(_6a7,"span","tabindex","0");
if(!_6a8){
return;
}
for(var i=0;i<_6a8.length;i++){
var span=_6a8[i];
this.updateCellAccessibility(span,false);
}
};
var CV_BACKGROUND_LAYER_ID="CV_BACK";
if(typeof window.gaRV_INSTANCES=="undefined"){
window.gaRV_INSTANCES=[];
}
if(!window.gViewerLogger){
window.gViewerLogger={log:function(hint,_6ac,type){
},addContextInfo:function(_6ae){
}};
}
function CognosViewerSession(oCV){
this.m_sConversation=oCV.getConversation();
this.m_sParameters=oCV.getExecutionParameters();
this.m_envParams={};
applyJSONProperties(this.m_envParams,oCV.envParams);
this.m_bRefreshPage=false;
};
function CCognosViewer(sId,_6b1){
if(typeof window.gCognosViewer=="undefined"){
window.gCognosViewer=this;
}
if(typeof ViewerConfig=="function"){
this.m_viewerConfig=new ViewerConfig();
try{
if(typeof window.getViewerConfiguration=="function"){
this.m_viewerConfig.configure(window.getViewerConfiguration());
}else{
if(window.parent&&typeof window.parent.getViewerConfiguration=="function"){
this.m_viewerConfig.configure(window.parent.getViewerConfiguration());
}
}
}
catch(e){
}
this.m_viewerUIConfig=this.m_viewerConfig.getUIConfig();
}
this.m_sActionState="";
this.m_bKeepSessionAlive=false;
this.m_undoStack=[];
this.m_aSecRequests=[];
this.m_bDebug=false;
this.m_sCAFContext="";
this.m_sContextInfoXML="";
this.m_sConversation="";
this.m_sStatus="";
this.m_sGateway=_6b1;
this.m_sId=sId;
this.m_sMetadataInfoXML="";
this.m_sParameters="";
this.m_sReportState="";
this.envParams={};
this.m_sTracking="";
this.m_sSoapFault="";
this.m_sWaitHTML="";
this.m_oDrillMgr=null;
this.goDrillManager=null;
this.m_oWorkingDialog=null;
this.m_oRequestExecutedIndicator=null;
this.m_bUseWorkingDialog=true;
this.m_oSubscriptionManager=null;
this.m_oCVMgr=null;
this.m_bUseSafeMode=true;
if(typeof CViewerManager=="function"){
this.m_oCVMgr=new CViewerManager(this);
}
if(window.gaRV_INSTANCES){
var _6b2=false;
for(var _6b3=0;_6b3<window.gaRV_INSTANCES.length;_6b3++){
if(window.gaRV_INSTANCES[_6b3].m_sId==sId){
window.gaRV_INSTANCES[_6b3]=this;
_6b2=true;
break;
}
}
if(!_6b2){
window.gaRV_INSTANCES=window.gaRV_INSTANCES.concat(this);
}
}
this.m_bReportHasPrompts=false;
this.m_viewerWidget=null;
this.m_flashChartsObjectIds=[];
this.m_raiseSharePromptEvent=true;
this.m_actionFactory=null;
this.m_calculationCache={};
this.m_drillTargets=[];
this.m_reportRenderingDone=false;
if(typeof PinFreezeManager!=="undefined"){
this.m_pinFreezeManager=new PinFreezeManager(this);
}
if(typeof ViewerDispatcher!=="undefined"){
this.m_viewerDispatcher=new ViewerDispatcher();
}
this.m_retryDispatcherEntry=null;
this.m_RAPReportInfo=null;
if(typeof ViewerState=="function"){
this.m_viewerState=new ViewerState();
}
this.m_aInfoBar=null;
};
CCognosViewer.prototype.setScheduledMobileOutput=function(_6b4){
this.m_mobileScheduledOutput=_6b4;
if(_6b4){
this.m_sStatus="complete";
}
};
CCognosViewer.prototype.setTabInfo=function(_6b5){
this.m_tabsPayload=_6b5;
if(this.m_tabsPayload&&this.m_tabsPayload.tabs&&this._keepTabSelected){
var _6b6=false;
for(var i=0;i<this.m_tabsPayload.tabs.length;i++){
var tab=this.m_tabsPayload.tabs[i];
if(tab.id==this._keepTabSelected){
this.m_tabsPayload.currentTabId=this._keepTabSelected;
break;
}
}
this._keepTabSelected=null;
}
};
CCognosViewer.prototype.setKeepTabSelected=function(_6b9){
this._keepTabSelected=_6b9;
};
CCognosViewer.prototype.getTabController=function(){
return this.m_tabControl;
};
CCognosViewer.prototype.getCurrentlySelectedTab=function(){
return this.m_currentlySelectedTab?this.m_currentlySelectedTab:null;
};
CCognosViewer.prototype.deleteTabs=function(){
if(this.m_tabControl){
this.m_tabControl.destroy();
delete this.m_tabControl;
this.m_tabControl=null;
}
this.m_tabsPayload=null;
};
CCognosViewer.prototype.renderTabs=function(){
if(!this.m_tabsPayload){
return;
}
var _6ba=this.isSavedOutput()&&!this.m_mobileScheduledOutput;
var _6bb=document.getElementById("CVNavLinks"+this.getId());
if(_6bb||!this.shouldWriteNavLinks()||_6ba){
var _6bc=this.getReportDiv();
this.m_bHasTabs=true;
if(this.m_tabControl&&this.m_tabControl.isSavedOutput()!=_6ba){
this.deleteTabs();
}
if(!this.m_tabControl){
if(this.getStatus()!="complete"&&!_6ba){
return;
}
var tr=document.createElement("tr");
var _6be=document.createElement("td");
tr.appendChild(_6be);
var _6bf=document.getElementById("mainViewerTR"+this.getId());
if(!_6bf){
return;
}
if(this.m_tabsPayload.position=="topLeft"){
_6bf.parentNode.insertBefore(tr,_6bf);
}else{
_6bf.parentNode.appendChild(tr);
}
var _6c0=null;
if(this.m_viewerWidget){
_6c0=this.m_viewerWidget.findContainerDiv().firstChild;
}else{
_6c0=_6be;
}
var oCV=this;
if(_6ba){
this.m_tabControl=new CognosTabControl(_6c0,function(_6c2){
oCV.switchSavedOutputTab(_6c2,true);
});
this.switchSavedOutputTab(this.m_tabsPayload.currentTabId,false);
}else{
this.m_tabControl=new CognosTabControl(_6c0,function(_6c3){
oCV.switchTabs(_6c3);
});
}
if(this.m_viewerWidget){
this.m_tabControl.setSpaceSaverContainer(_6be);
this.m_tabControl.setScrollAttachNode(this.m_viewerWidget.findContainerDiv());
this.m_tabControl.useAbsolutePosition(true);
}
this.m_tabControl.setIsSavedOutput(_6ba);
if(!window.gScriptLoader.m_bScriptLoaderCalled){
var _6c4=document.getElementById("RVContent"+this.getId());
var _6c5=this._getNodesWithViewerId(_6c4,"link",null);
for(var i=0;i<_6c5.length;i++){
window.gScriptLoader.moveLinks(_6c5[i]);
if(_6c5[i].getAttribute("href").indexOf("promptCommon.css")>0){
this.setHasPrompts(true);
}
}
window.gScriptLoader.loadStyles(_6c4,this.getId());
this.repaintDiv(_6c4);
}
}
if(this.getStatus()=="prompting"){
this.previouslySelectedTab=null;
this.m_tabControl.hide();
}else{
if(this.isHighContrast()){
this.m_tabControl.setHighContrast(true);
}
this.m_tabControl.render(this.m_tabsPayload);
this.m_currentlySelectedTab=this.m_tabControl.getSelectedTabId();
if(this.m_switchingToTabId&&this.m_currentlySelectedTab!=this.m_switchingToTabId){
this._removeTabContent(_6bc.parentNode,this.m_switchingToTabId);
this._removeTabContent(_6bc.parentNode,this.m_currentlySelectedTab);
if(_6bb){
this._removeTabContent(_6bb.parentNode,this.m_switchingToTabId);
this._removeTabContent(_6bb.parentNode,this.m_currentlySelectedTab);
}
this.m_tabInfo={};
}
this.m_switchingToTabId=null;
_6bc.setAttribute("tabId",this.m_currentlySelectedTab);
if(_6bb){
_6bb.setAttribute("tabId",this.m_currentlySelectedTab);
}
if(isIE()&&_6ba&&window.resizeIFrame&&!this.m_viewerFragment&&!this.m_viewerWidget){
window.resizeIFrame();
}
}
this.setMaxContentSize();
}else{
var obj=this;
setTimeout(function(){
obj.renderTabs();
},100);
}
};
CCognosViewer.prototype.cancelTabSwitch=function(){
var _6c8=this.getReportDiv();
var _6c9=this.m_switchingToTabId;
this.m_currentlySelectedTab=_6c9;
this.m_tabControl.selectTab(this.previouslySelectedTab,false);
this.switchTabs(this.previouslySelectedTab);
if(_6c8){
_6c8.parentNode.removeChild(_6c8);
}
if(this.m_tabInfo[this.m_currentlySelectedTab]&&this.m_tabInfo[this.m_currentlySelectedTab].styles){
this._addTabStylesToHead(this.m_tabInfo[this.m_currentlySelectedTab].styles);
}
this.previouslySelectedTab=null;
this.m_tabInfo[_6c9]=null;
};
CCognosViewer.prototype.switchSavedOutputTab=function(_6ca,_6cb){
var _6cc=this.getSelectionController();
if(_6cc){
_6cc.clearSelectedObjects();
}
this.m_currentlySelectedTab=this.m_tabControl.getSelectedTabId();
if(_6cb){
this.notifyTabChange(_6ca);
}
if(this.m_viewerWidget){
this.m_viewerWidget.getSavedOutput().switchSavedOutputTab(_6ca,_6cb);
this.getTabController().resetPosition();
}else{
if(!this.savedOutputTabNodes){
var _6cd=document.getElementById("CVIFrame"+this.getId());
this.savedOutputTabNodes=getElementsByAttribute(_6cd.contentWindow.document.body,"*","tabid");
}
if(!this.savedOutputTabNodes){
return;
}
for(var i=0;i<this.savedOutputTabNodes.length;i++){
var _6cf=this.savedOutputTabNodes[i];
_6cf.style.display=_6cf.getAttribute("tabid")==_6ca?"":"none";
}
this.setMaxContentSize();
}
};
CCognosViewer.prototype.notifyTabChange=function(_6d0){
};
CCognosViewer.prototype._getNodesWithViewerId=function(_6d1,_6d2,id){
var _6d4=[];
var _6d5=_6d1.getElementsByTagName(_6d2);
for(var i=0;i<_6d5.length;i++){
var node=_6d5[i];
if(!id||(node.getAttribute&&node.getAttribute("namespaceId")==id)){
node.parentNode.removeChild(node);
_6d4.push(node);
i--;
}
}
return _6d4;
};
CCognosViewer.prototype._removeTabStylesFromHead=function(){
var id=this.getId();
return this._getNodesWithViewerId(document.getElementsByTagName("head").item(0),"style",id);
};
CCognosViewer.prototype._addTabStylesToHead=function(_6d9){
if(!_6d9){
return;
}
for(var i=0;i<_6d9.length;i++){
document.getElementsByTagName("head").item(0).appendChild(_6d9[i]);
}
};
CCognosViewer.prototype.switchTabs=function(_6db){
if(this.m_currentlySelectedTab==_6db){
return;
}
var _6dc=this.getSelectionController();
if(_6dc){
_6dc.clearSelectedObjects();
}
var _6dd=this.getReportDiv();
this.m_nReportDiv=null;
var _6de=_6dd.clientHeight;
_6dd.removeAttribute("id");
_6dd.style.display="none";
if(!this.m_tabInfo){
this.m_tabInfo={};
}
var _6df=this._removeTabStylesFromHead();
var _6e0=this.getSelectionController().getCCDManager();
this.m_tabInfo[this.m_currentlySelectedTab]={"conversation":this.getConversation(),"metadata":_6e0.getClonedMetadataArray(),"contextdata":_6e0.getClonedContextdataArray(),"secondaryRequests":this.getSecondaryRequests(),"styles":_6df,"hasPromptControl":this.getHasPrompts()};
var _6e1=this._findChildWithTabId(_6dd.parentNode,_6db);
this.previouslySelectedTab=this.m_currentlySelectedTab;
if(_6e1&&this.m_tabInfo[_6db]&&this.m_tabInfo[_6db].hasPromptControl){
if(_6e1){
_6e1.parentNode.removeChild(_6e1);
_6e1=null;
}
delete this.m_tabInfo[_6db];
this.m_tabInfo[_6db]=null;
}
if(_6e1){
this.m_currentlySelectedTab=_6db;
_6e1.style.display="block";
_6e1.setAttribute("id","CVReport"+this.getId());
if(this.m_tabInfo&&this.m_tabInfo[_6db]){
var _6e2=this.m_tabInfo[_6db];
if(_6e2.conversation){
this.setConversation(_6e2.conversation);
}
if(_6e2.metadata){
_6e0.SetMetadata(_6e2.metadata);
}
if(_6e2.contextdata){
_6e0.SetContextData(_6e2.contextdata);
}
if(_6e2.secondaryRequests){
this.setSecondaryRequests(_6e2.secondaryRequests);
}
if(_6e2.styles){
this._addTabStylesToHead(_6e2.styles);
}
this.setHasPrompts(_6e2.hasPromptControl);
}
if(this.shouldWriteNavLinks()){
this.writeNavLinks(this.getSecondaryRequests().join(" "));
}
if(this.getPinFreezeManager()&&this.getPinFreezeManager().hasFrozenContainers()){
this.getPinFreezeManager().rePaint();
if(isIE()){
var _6e3=document.getElementById("RVContent"+this.getId());
this.repaintDiv(_6e3);
}
}
if(this.m_viewerWidget){
this.m_viewerWidget.placeTabControlInView();
}
this._keepFocus=null;
this.doneLoadingUpdateA11Y("complete");
this.getTabController().resetPosition();
this.setMaxContentSize();
}else{
this.m_switchingToTabId=_6db;
var _6e4=_6dd.cloneNode(false);
_6e4.style.display="block";
_6e4.setAttribute("id","CVReport"+this.getId());
_6e4.removeAttribute("tabId");
_6dd.parentNode.appendChild(_6e4);
_6e4.innerHTML="<table height='"+_6de+"px'><tr><td height='100%'></td></tr></table>";
var _6e5=new ViewerDispatcherEntry(this);
_6e5.addFormField("ui.action","reportAction");
_6e5.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",_6db);
if(this.m_viewerWidget){
this.m_viewerWidget.placeTabControlInView();
}
this.dispatchRequest(_6e5);
}
};
CCognosViewer.prototype._removeTabContent=function(_6e6,_6e7){
var _6e8=this._findChildWithTabId(_6e6,_6e7);
while(_6e8){
_6e8.parentNode.removeChild(_6e8);
_6e8=this._findChildWithTabId(_6e6,_6e7);
}
};
CCognosViewer.prototype._findChildWithTabId=function(_6e9,_6ea){
var _6eb=null;
for(var i=0;i<_6e9.childNodes.length;i++){
var _6ed=_6e9.childNodes[i];
if(_6ed.getAttribute("tabId")==_6ea){
_6eb=_6ed;
break;
}
}
return _6eb;
};
CCognosViewer.prototype.clearTabs=function(){
if(!this.m_bHasTabs){
return;
}
this.m_tabInfo={};
var _6ee=this.getReportDiv();
var _6ef=_6ee.parentNode;
for(var i=0;i<_6ef.childNodes.length;i++){
var node=_6ef.childNodes[i];
if(node.getAttribute("id")!="CVReport"+this.m_sId){
_6ef.removeChild(node);
i--;
}
}
};
CCognosViewer.prototype.isSavedOutput=function(){
var _6f2=this.envParams["ui.action"];
return _6f2==="view"||_6f2==="buxView";
};
CCognosViewer.prototype.renderSavedOutputIFrame=function(url,_6f4,_6f5){
var _6f6=document.getElementById("CVReport"+this.getId());
var _6f7=document.createElement("iframe");
_6f7.style.width="100%";
_6f7.style.height=_6f6.clientHeight?_6f6.clientHeight+"px":"99%";
_6f7.id="CVIFrame"+this.getId();
_6f7.title=_6f4;
_6f7.setAttribute("frameBorder","0");
_6f6.appendChild(_6f7);
var obj=this;
var func=function(){
obj.renderTabs();
};
setTimeout(function(){
if(_6f5){
if(_6f7.attachEvent){
_6f7.attachEvent("onload",func);
}else{
_6f7.addEventListener("load",func,true);
}
}
_6f7.src=url;
},1);
};
CCognosViewer.prototype.updatePageState=function(_6fa){
if(_6fa&&this.getState()){
this.getState().setPageState(_6fa);
}
};
CCognosViewer.prototype.getPageInfo=function(){
if(this.m_viewerState&&this.m_viewerState.getPageState()){
var _6fb=this.m_viewerState.getPageState();
return {"currentPage":_6fb.getCurrentPage(),"pageCount":_6fb.getPageCount()};
}
return {};
};
CCognosViewer.prototype.isIWidgetMobile=function(){
return this.m_viewerWidget&&this.m_viewerWidget.isMobile();
};
CCognosViewer.prototype.isInteractiveViewer=function(){
return false;
};
CCognosViewer.prototype.launchGotoPageForIWidgetMobile=function(form){
if(this.isIWidgetMobile()){
this.m_viewerWidget.launchGotoPageForIWidgetMobile(form);
return true;
}
return false;
};
CCognosViewer.prototype.executeDrillThroughForIWidgetMobile=function(form){
if(this.isIWidgetMobile()){
this.m_viewerWidget.executeDrillThroughForIWidgetMobile(form);
return true;
}
return false;
};
CCognosViewer.prototype.getState=function(){
return this.m_viewerState;
};
CCognosViewer.prototype.getConfig=function(){
return this.m_viewerConfig;
};
CCognosViewer.prototype.getUIConfig=function(){
return this.m_viewerUIConfig;
};
CCognosViewer.prototype.setCurrentNodeFocus=function(node){
this.m_currentNodeFocus=node;
};
CCognosViewer.prototype.getCurrentNodeFocus=function(node){
return this.m_currentNodeFocus;
};
CCognosViewer.prototype.loadExtra=function(){
};
CCognosViewer.prototype.setRetryDispatcherEntry=function(_700){
this.m_retryDispatcherEntry=_700;
};
CCognosViewer.prototype.getRetryDispatcherEntry=function(){
return this.m_retryDispatcherEntry;
};
CCognosViewer.prototype.resetViewerDispatcher=function(){
if(this.m_viewerDispatcher!==null){
delete this.m_viewerDispatcher;
this.m_viewerDispatcher=new ViewerDispatcher();
}
};
CCognosViewer.prototype.getViewerDispatcher=function(){
return this.m_viewerDispatcher;
};
CCognosViewer.prototype.setFaultDispatcherEntry=function(_701){
this.m_faultDispatcherEntry=_701;
};
CCognosViewer.prototype.getFaultDispatcherEntry=function(){
return this.m_faultDispatcherEntry;
};
CCognosViewer.prototype.dispatchRequest=function(_702){
this.setFaultDispatcherEntry(null);
this.getViewerDispatcher().dispatchRequest(_702);
};
CCognosViewer.prototype.getActiveRequest=function(){
return this.getViewerDispatcher().getActiveRequest();
};
CCognosViewer.prototype.getProductLocale=function(){
if(this.sProductLocale){
return this.sProductLocale;
}
return "en";
};
CCognosViewer.prototype.getDirection=function(){
if(this.sDirection){
return this.sDirection;
}
return "ltr";
};
CCognosViewer.prototype.isBidiEnabled=function(){
if(this.bIsBidiEnabled){
return true;
}
return false;
};
CCognosViewer.prototype.getBaseTextDirection=function(){
if(this.isBidiEnabled()){
if(this.sBaseTextDirection){
return this.sBaseTextDirection;
}
}
return "";
};
CCognosViewer.prototype.getActionFactory=function(){
if(!this.m_actionFactory){
this.m_actionFactory=new ActionFactory(this);
}
return this.m_actionFactory;
};
CCognosViewer.prototype.getAction=function(_703){
var _703=this.getActionFactory().load(_703);
_703.setCognosViewer(this);
return _703;
};
CCognosViewer.prototype.getCalculationCache=function(){
return this.m_calculationCache;
};
CCognosViewer.prototype.updateOutputForA11ySupport=function(){
this.updateBorderCollapse();
if(this.getA11YHelper()){
this.getA11YHelper().addLabelledByForItemsOutsideOfContainers();
}
var _704=navigator.userAgent.toLowerCase();
var _705=_704.indexOf("iphone")!=-1;
var _706=_704.indexOf("ipod")!=-1;
var _707=_704.indexOf("ipad")!=-1;
var _708=_705||_706||_707;
var _709=_704.indexOf("android")!=-1;
if(_708||_709){
document.body.classList.add("clsViewerMobile");
}
};
CCognosViewer.prototype.checkForHighContrast=function(){
if(this.isBux){
this.m_bHighContrast=dojo.hasClass(document.body,"dijit_a11y")?true:false;
}else{
var _70a=document.createElement("div");
_70a.id=this.m_sId+"hc";
_70a.style.border="1px solid";
_70a.style.borderColor="red green";
_70a.style.height="10px";
_70a.style.top="-999px";
_70a.style.position="absolute";
document.body.appendChild(_70a);
var _70b=null;
if(isIE()){
_70b=_70a.currentStyle;
}else{
_70b=_70a.ownerDocument.defaultView.getComputedStyle(_70a,null);
}
if(!_70b){
return;
}
this.m_bHighContrast=_70b.borderTopColor==_70b.borderRightColor;
document.body.removeChild(_70a);
}
};
CCognosViewer.prototype.isHighContrast=function(){
if(typeof this.m_bHighContrast==="undefined"){
this.checkForHighContrast();
}
return this.m_bHighContrast;
};
CCognosViewer.prototype.isLimitedInteractiveMode=function(){
return this.envParams&&this.envParams.limitedInteractiveMode&&this.envParams.limitedInteractiveMode==="true";
};
CCognosViewer.prototype.updateBorderCollapse=function(){
if(this.isHighContrast()==true){
var _70c=null;
if(this.envParams["ui.action"]=="view"&&!this.isBux){
var _70d=document.getElementById("CVIFrame"+this.getId());
_70c=_70d.contentWindow.document;
}else{
_70c=document.getElementById("CVReport"+this.getId());
}
var _70e=_70c.getElementsByTagName("table");
for(var i=0;i<_70e.length;i++){
if(_70e[i].style.borderCollapse=="collapse"){
_70e[i].style.borderCollapse="separate";
}
}
}
};
CCognosViewer.prototype.isAccessibleMode=function(){
if(this.m_bAccessibleMode==true){
return true;
}
return false;
};
CCognosViewer.prototype.isSinglePageReport=function(){
for(var _710 in this.m_aSecRequests){
if(this.m_aSecRequests[_710]=="nextPage"||this.m_aSecRequests[_710]=="previousPage"){
return false;
}
}
return true;
};
CCognosViewer.prototype.hasNextPage=function(){
for(var _711 in this.m_aSecRequests){
if(this.m_aSecRequests[_711]=="nextPage"){
return true;
}
}
return false;
};
CCognosViewer.prototype.hasPrevPage=function(){
for(var _712 in this.m_aSecRequests){
if(this.m_aSecRequests[_712]=="previousPage"){
return true;
}
}
return false;
};
CCognosViewer.prototype.captureHotkeyPageNavigation=function(evt){
evt=(evt)?evt:((event)?event:null);
if(evt){
var node=getNodeFromEvent(evt);
var _715=(node&&node.nodeName)?node.nodeName.toLowerCase():null;
if((evt.keyCode==8&&_715!="input"&&_715!="textarea")||(evt.altKey==true&&(evt.keyCode==37||evt.keyCode==39))){
evt.returnValue=false;
evt.cancelBubble=true;
if(typeof evt.stopPropagation!="undefined"){
evt.stopPropagation();
}
if(typeof evt.preventDefault!="undefined"){
evt.preventDefault();
}
return false;
}
}
return true;
};
CCognosViewer.prototype.setUseWorkingDialog=function(_716){
this.m_bUseWorkingDialog=_716;
};
CCognosViewer.prototype.getWorkingDialog=function(){
if(!this.m_oWorkingDialog&&this.m_bUseWorkingDialog&&typeof WorkingDialog!=="undefined"){
if(this.getConfig()&&this.getConfig().getHttpRequestConfig()&&this.getConfig().getHttpRequestConfig().getWorkingDialog()){
this.m_oWorkingDialog=this.getConfig().getHttpRequestConfig().getWorkingDialog();
}else{
this.m_oWorkingDialog=new WorkingDialog(this);
}
}
return this.m_oWorkingDialog;
};
CCognosViewer.prototype.getRequestIndicator=function(){
if(this.m_bUseWorkingDialog&&!this.m_oRequestExecutedIndicator&&typeof RequestExecutedIndicator!=="undefined"){
if(this.getConfig()&&this.getConfig().getHttpRequestConfig()&&this.getConfig().getHttpRequestConfig().getRequestIndicator()){
this.m_oRequestExecutedIndicator=this.getConfig().getHttpRequestConfig().getRequestIndicator();
}else{
this.m_oRequestExecutedIndicator=new RequestExecutedIndicator(this);
}
}
return this.m_oRequestExecutedIndicator;
};
CCognosViewer.prototype.disableBrowserHotkeyPageNavigation=function(){
if(document.attachEvent){
document.attachEvent("onkeydown",this.captureHotkeyPageNavigation);
}else{
if(document.addEventListener){
document.addEventListener("keydown",this.captureHotkeyPageNavigation,false);
}
}
};
CCognosViewer.prototype.setHasPrompts=function(_717){
if(!_717){
this.preProcessControlArray=[];
}
this.m_bReportHasPrompts=_717;
};
CCognosViewer.prototype.getHasPrompts=function(){
return this.m_bReportHasPrompts;
};
CCognosViewer.prototype.setUsePageRequest=function(_718){
this.m_viewerDispatcher.setUsePageRequest(_718);
};
CCognosViewer.prototype.getUsePageRequest=function(){
return this.m_viewerDispatcher.getUsePageRequest();
};
CCognosViewer.prototype.setKeepSessionAlive=function(_719){
this.m_bKeepSessionAlive=_719;
};
CCognosViewer.prototype.getKeepSessionAlive=function(){
return this.m_bKeepSessionAlive;
};
CCognosViewer.prototype.getWebContentRoot=function(){
if(typeof this.sWebContentRoot!="undefined"){
return this.sWebContentRoot;
}else{
return "..";
}
};
CCognosViewer.prototype.getSkin=function(){
if(typeof this.sSkin!="undefined"){
return this.sSkin;
}else{
return this.getWebContentRoot()+"/skins/corporate";
}
};
CCognosViewer.prototype.getSelectionController=function(){
var _71a;
try{
_71a=getCognosViewerSCObjectRef(this.m_sId);
}
catch(e){
_71a=null;
}
return _71a;
};
CCognosViewer.prototype.addCallback=function(_71b,oFct,_71d){
if(!this.m_aCallback){
this.m_aCallback=[];
}
this.m_aCallback=this.m_aCallback.concat({m_sEvent:_71b,m_oCallback:oFct,m_bCaptureEvent:(_71d===true)});
};
CCognosViewer.prototype.canDrillDown=function(sId){
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _720=this.getSelectionController();
if(_720){
return (_720.canDrillDown(sCtx));
}
}
return false;
};
CCognosViewer.prototype.canDrillUp=function(sId){
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _723=this.getSelectionController();
if(_723){
return (_723.canDrillUp(sCtx));
}
}
return false;
};
CCognosViewer.prototype.canSubmitPrompt=function(){
var _724=null;
if(this.preProcessControlArray&&this.preProcessControlArray instanceof Array){
var _725=this.preProcessControlArray.length;
for(var k=0;k<_725;k++){
_724=eval(this.preProcessControlArray[k]);
if(_724.isValid()===false){
if(!this.m_reportRenderingDone||!_724.getCascadeOnParameter||!_724.getCascadeOnParameter()){
return false;
}
}
}
}
return true;
};
CCognosViewer.prototype.closeContextMenuAndToolbarMenus=function(){
if(this.rvMainWnd){
this.rvMainWnd.closeContextMenuAndToolbarMenus();
}
};
CCognosViewer.prototype.dcm=function(_727,_728){
if(this.canDisplayContextMenu()){
if(this.preSelectNode==true){
_728=false;
this.preSelectNode=false;
}
if(this.rvMainWnd.displayContextMenu(_727,_728)!=false){
return stopEventBubble(_727);
}
}
};
CCognosViewer.prototype.canDisplayContextMenu=function(){
if(!this.getUIConfig()||this.getUIConfig().getShowContextMenu()){
return (!this.isWorkingOrPrompting()&&this.rvMainWnd!=null&&typeof this.bCanUseCognosViewerContextMenu!="undefined"&&this.bCanUseCognosViewerContextMenu);
}
return false;
};
CCognosViewer.prototype.de=function(_729){
var _72a=this.getDrillMgr();
if(_72a){
_72a.singleClickDrillEvent(_729,"RV");
}
};
CCognosViewer.prototype.debug=function(sMsg){
if(this.m_bDebug){
var _72c="";
var _72d=this.debug.caller;
if(typeof _72d=="object"&&_72d!==null){
_72c=_72d.toString().match(/function (\w*)/)[1];
}
if(!_72c){
_72c="?";
}
alert(_72c+": "+sMsg);
}
};
CCognosViewer.prototype.callbackExists=function(_72e){
var _72f=false;
if(this.m_aCallback&&this.m_aCallback.length){
for(var _730=0;_730<this.m_aCallback.length;++_730){
var oCB=this.m_aCallback[_730];
if(oCB.m_sEvent==_72e){
return true;
}
}
}
return false;
};
CCognosViewer.prototype.executeCallback=function(_732){
var _733=false;
if(this.m_aCallback&&this.m_aCallback.length){
for(var _734=0;_734<this.m_aCallback.length;++_734){
var oCB=this.m_aCallback[_734];
if(oCB.m_sEvent==_732){
if(typeof oCB.m_oCallback=="function"){
oCB.m_oCallback();
}
if(oCB.m_bCaptureEvent){
_733=true;
}
}
}
}
return _733;
};
CCognosViewer.prototype.getCAFContext=function(){
return this.m_sCAFContext;
};
CCognosViewer.prototype.getSoapFault=function(){
return this.m_sSoapFault;
};
CCognosViewer.prototype.getColumnContextIds=function(sId){
return this.getContextIds(sId,2);
};
CCognosViewer.prototype.getConversation=function(){
return this.m_sConversation;
};
CCognosViewer.prototype.getStatus=function(){
return (this.m_sStatus?this.m_sStatus:"");
};
CCognosViewer.prototype.isWorking=function(_737){
if(typeof _737!="string"){
_737=this.getStatus();
}
return ((""+_737).match(/^(working|stillWorking)$/)?true:false);
};
CCognosViewer.prototype.isWorkingOrPrompting=function(){
return (this.getStatus().match(/^(working|stillWorking|prompting)$/)?true:false);
};
CCognosViewer.prototype.getActionState=function(){
return this.m_sActionState;
};
CCognosViewer.prototype.getDataItemName=function(sId){
var _739=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _73b=this.getSelectionController();
if(_73b){
var _73c=_73b.getRefDataItem(sCtx);
if(_73c){
_739=_73c;
}
}
}
return _739;
};
CCognosViewer.prototype.getDataType=function(sId){
var _73e=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _740=this.getSelectionController();
if(_740){
var _741=_740.getDataType(sCtx);
if(_741){
_73e=_741;
}
}
}
return _73e;
};
CCognosViewer.prototype.getDepth=function(sId){
var _743=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _745=this.getSelectionController();
if(_745){
var _746=_745.getDepth(sCtx);
if(_746){
_743=_746;
}
}
}
return _743;
};
CCognosViewer.prototype.getDrillMgr=function(){
if(!this.m_oDrillMgr){
this.loadExtra();
if(typeof CDrillManager=="function"){
this.m_oDrillMgr=new CDrillManager(this);
this.goDrillManager=this.m_oDrillMgr;
}
}
return this.m_oDrillMgr;
};
CCognosViewer.prototype.getSubscriptionManager=function(){
if(!this.m_oSubscriptionManager){
this.loadExtra();
if(typeof CSubscriptionManager=="function"){
this.m_oSubscriptionManager=new CSubscriptionManager(this);
}
}
return this.m_oSubscriptionManager;
};
CCognosViewer.prototype.getExecutionParameters=function(){
return this.m_sParameters;
};
CCognosViewer.prototype.getGateway=function(){
return this.m_sGateway;
};
CCognosViewer.prototype.getSpecification=function(){
return this.envParams["ui.spec"];
};
CCognosViewer.prototype.getHierarchyUniqueName=function(sId){
var sHun=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _74a=this.getSelectionController();
if(_74a){
var aHUN=_74a.getHun(sCtx);
if(aHUN){
sHun=aHUN;
}
}
}
return sHun;
};
CCognosViewer.prototype.getDimensionUniqueName=function(sId){
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _74e=this.getSelectionController();
if(_74e){
var aDUN=_74e.getDun(sCtx);
if(aDUN){
return aDUN;
}
}
}
return null;
};
CCognosViewer.prototype.getId=function(){
return this.m_sId;
};
CCognosViewer.prototype.getLevelId=function(sId){
var _751=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _753=this.getSelectionController();
if(_753){
var aLUN=_753.getLun(sCtx);
if(aLUN){
_751=aLUN;
}
}
}
return _751;
};
CCognosViewer.prototype.getMemberUniqueName=function(sId){
var sMUN=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _758=this.getSelectionController();
if(_758){
var aMUN=_758.getMun(sCtx);
if(aMUN){
sMUN=aMUN;
}
}
}
return sMUN;
};
CCognosViewer.prototype.getObjectId=function(){
var _75a="window";
if(typeof this.getId()=="string"){
_75a=getCognosViewerObjectRefAsString(this.getId());
}
return _75a;
};
CCognosViewer.prototype.getQueryModelId=function(sId){
var _75c=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _75e=this.getSelectionController();
if(_75e){
var _75f=_75e.getQueryModelId(sCtx);
if(_75f){
_75c=_75f;
}
}
}
return _75c;
};
CCognosViewer.prototype.getQueryName=function(sId){
var _761=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _763=this.getSelectionController();
if(_763){
var _764=_763.getRefQuery(sCtx);
if(_764){
_761=_764;
}
}
}
return _761;
};
CCognosViewer.prototype.getContextIds=function(sId,_766){
var aIds=[];
var sCtx=this.findCtx(sId);
if(sCtx){
var _769=sCtx.split("::");
if(_769&&_769.length>1&&_766<_769.length){
aIds=_769[_766].split(":");
}
}
return aIds;
};
CCognosViewer.prototype.getRowContextIds=function(sId){
return this.getContextIds(sId,1);
};
CCognosViewer.prototype.getPageContextIds=function(sId){
return this.getContextIds(sId,3);
};
CCognosViewer.prototype.getString=function(sKey){
if(RV_RES&&RV_RES[sKey]){
return RV_RES[sKey];
}
return sKey;
};
CCognosViewer.prototype.getRV=function(){
if(typeof this.m_oCVMgr=="object"){
return this.m_oCVMgr;
}
return window;
};
CCognosViewer.prototype.getSecondaryRequests=function(){
return this.m_aSecRequests;
};
CCognosViewer.prototype.getTracking=function(){
return this.m_sTracking;
};
CCognosViewer.prototype.findCtx=function(sId){
var sCtx="";
if(typeof sId=="string"){
var aCtx=this.getReportContextHelper().processCtx(sId);
var _770=aCtx[0][0];
var _771=this.getSelectionController();
if(_771){
if(_771.isContextId(_770)){
sCtx=sId;
}
}
}
if(!sCtx){
var _772=this.findElementWithCtx(sId);
if(_772){
sCtx=_772.getAttribute("ctx");
}
}
return sCtx;
};
CCognosViewer.prototype.findElementWithCtx=function(sId){
var _774=sId;
if(typeof sId=="string"){
_774=this.findElementWithCtx(document.getElementById(sId));
}
if(_774){
if(_774.getAttribute&&_774.getAttribute("ctx")){
return _774;
}
for(var _775=0;_775<_774.childNodes.length;_775++){
var _776=this.findElementWithCtx(_774.childNodes[_775]);
if(_776){
return _776;
}
}
}
return null;
};
CCognosViewer.prototype.getUseValue=function(sId){
var sVal=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _77a=this.getSelectionController();
if(_77a){
sVal=_77a.getUseValue(sCtx);
}
}
return sVal;
};
CCognosViewer.prototype.init=function(_77b){
if(_77b&&typeof _77b=="object"){
for(var _77c in _77b){
this[_77c]=_77b[_77c];
}
}
};
CCognosViewer.prototype.initViewer=function(_77d){
var _77e=new RequestHandler(this);
var _77f=document.getElementById("formBackJax"+this.getId());
if(_77f&&typeof _77f.state!="undefined"&&_77f.state.value.length>0){
_77e.loadReportHTML(_77f.result.value);
var _780=eval("("+_77f.state.value+")");
_77e.updateViewerState(_780);
_77e.postComplete();
}else{
if(this.getUsePageRequest()){
var _781=_77d?_77d.m_sStatus:null;
if(isIE()){
if(window.location.hash=="#working"){
window.history.go(-2);
return;
}else{
if(_781==="working"||_781==="stillWorking"){
window.location.hash="#working";
}
}
}else{
if(_77f&&_77f.working){
if(_77f.working.value=="true"){
window.history.go(-1);
return;
}else{
if(_781==="working"||_781==="stillWorking"){
_77f.working.value="true";
}
}
}
}
}
_77e.processInitialResponse(_77d);
}
};
CCognosViewer.prototype.saveBackJaxInformation=function(_782){
var _783=document.getElementById("formBackJax"+this.getId());
if(_783){
if(typeof _783.state!="undefined"){
_783.state.value=_782.getResponseStateText();
}
if(typeof _783.result!="undefined"){
_783.result.value=_782.getResult();
}
}
};
CCognosViewer.prototype.pcc=function(evt){
if(evt&&typeof evt.button!="undefined"&&evt.button!="1"){
this.preSelectNode=true;
var _785=this.getSelectionController();
if(_785){
_785.pageContextClicked(evt);
}
}
};
CCognosViewer.prototype.isValidAjaxResponse=function(_786){
return (_786&&_786.childNodes&&_786.childNodes.length>0&&_786.childNodes[0].nodeName!="parsererror"?true:false);
};
CCognosViewer.prototype.resubmitInSafeMode=function(_787){
if(this.m_bUseSafeMode){
this.resetViewerDispatcher();
this.setUsePageRequest(true);
this.envParams["cv.useAjax"]="false";
if(_787){
_787.retryRequest();
}
}
};
CCognosViewer.prototype.showLoadedContent=function(_788){
if(_788!==null&&typeof _788!="undefined"){
_788.style.display="block";
}
this.m_resizeReady=true;
this.doneLoading();
var obj=this;
setTimeout(function(){
obj.renderTabs();
},1);
};
CCognosViewer.prototype.doneLoading=function(){
var _78a=this.getViewerWidget();
if(_78a){
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_doneLoading",this);
}
var _78b=this.getStatus();
if(!this.m_reportRenderingDone&&this.m_resizeReady&&this.m_stateSet){
var _78c=_78b=="working"||_78b=="stillWorking"||_78b=="fault";
_78a.fireEvent("com.ibm.bux.widget.render.done",null,{noAutoResize:_78c});
if(_78b=="complete"){
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_doneLoading",this);
}
if(typeof _78a.postLoadContent=="function"){
_78a.postLoadContent();
}
this.m_reportRenderingDone=true;
if(!_78c){
var _78d=this;
setTimeout(function(){
_78d.m_readyToRespondToResizeEvent=true;
},20);
}
}
}
if(_78b!="fault"){
_78a.clearErrorDlg();
}
this.doneLoadingUpdateA11Y(_78b);
}else{
var _78b=this.getStatus();
if(_78b=="complete"){
this.m_reportRenderingDone=true;
this.JAWSTalk(RV_RES.IDS_JS_READY);
}else{
if(_78b=="working"){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
}
}
}
};
CCognosViewer.prototype.doneLoadingUpdateA11Y=function(_78e){
if(this.getKeepFocus()!==false&&this.getKeepFocus()!=null){
var _78f=this.getKeepFocus();
if(_78e=="complete"){
this.setKeepFocus(false);
}
var _790=null;
if(this.getVisibleDialog()!==null){
_790=this.getVisibleDialog().getDialogDiv();
}else{
if(_78f===true){
_790=document.getElementById("CVReport"+this.getId());
}else{
if(typeof _78f=="string"){
_790=document.getElementById(_78f);
}else{
if(_78f!==null){
_790=_78f;
if(this.isBux){
dojo.window.scrollIntoView(_790);
}
}
}
}
}
if(_790){
setFocusToFirstTabItem(_790);
}
if(_78e=="complete"){
this.JAWSTalk(RV_RES.IDS_JS_READY);
}else{
if(_78e=="working"||_78e=="stillWorking"){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
}
}
}
};
CCognosViewer.prototype.JAWSTalk=function(_791){
if(this.isMobile()||this.isIWidgetMobile()){
return;
}
var id=this.getId();
var div=document.getElementById("JAWS_Alert_"+id);
if(div){
div.parentNode.removeChild(div);
}
div=document.createElement("div");
div.id="JAWS_Alert_"+id;
div.style.position="absolute";
div.style.top="-9000px";
div.style.display="none";
div.setAttribute("role","alert");
div.appendChild(document.createTextNode(_791));
var _794=document.getElementById("RVContent"+id);
if(_794){
_794.appendChild(div);
}else{
if(typeof console!="undefined"&&console&&console.log){
console.log("CCognosViewer: Could not find the Viewer div to append the JAWS alert.");
}
}
};
CCognosViewer.prototype.canInsertExpandIconsForAllCrosstabs=function(){
if(this.isLimitedInteractiveMode()||this.isBlacklisted("ExpandMember")||this.isIWidgetMobile()){
return false;
}
var _795=this.getAdvancedServerProperty("VIEWER_JS_EXPAND_COLLAPSE_CONTROLS_DEFAULT");
if(_795===null){
return false;
}
var _796=this.getViewerWidget().getProperties().getShowExpandCollapseIconFlag();
return (_795.toLowerCase()==="on"&&_796!==false)||(_795.toLowerCase()==="off"&&_796===true);
};
CCognosViewer.prototype.setMaxContentSize=function(){
if("10"!=window.getIEVersion()){
return;
}
if(document.body.className==="viewer"){
var _797=document.body.offsetHeight;
var _798=this.getNonReportHeight(document.getElementById("CVReport"+this.getId()));
var _799=document.getElementById("mainViewerTable"+this.getId());
_799.style.maxHeight=_797-_798-2+"px";
var _79a=GUtil.generateCallback(this.setMaxContentSize,[true],this);
if(!this.attachedOnResize){
this.attachedOnResize=true;
if(window.attachEvent){
window.attachEvent("onresize",_79a);
}else{
if(window.addEventListener){
window.addEventListener("resize",_79a,false);
}
}
}
}
};
CCognosViewer.prototype.getNonReportHeight=function(node){
var _79c=0;
var _79d=node.parentNode;
if(!_79d){
return _79c;
}
if(_79d.childNodes.length>1){
for(var i=0;i<_79d.childNodes.length;i++){
var _79f=_79d.childNodes[i];
if(_79f!=node&&!isNaN(_79f.clientHeight)&&_79f.style.display!="none"){
_79c+=_79f.clientHeight;
}
}
}
if(node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
_79c+=this.getNonReportHeight(_79d);
}
return _79c;
};
CCognosViewer.prototype.addPageAdornments=function(){
this.m_layoutElements=null;
this.m_lidToElement=null;
this.initFlashCharts();
this.insertSortIconsForAllLists();
var _7a0=this.getViewerWidget().getProperties();
if(this.canInsertExpandIconsForAllCrosstabs()){
this.insertExpandIconsForAllCrosstabs();
}
var _7a1=document.getElementById("CVReport"+this.getId());
if(_7a1){
var oCV=this;
setTimeout(function(){
if(oCV.getPinFreezeManager()&&oCV.getPinFreezeManager().hasFrozenContainers()){
oCV.getPinFreezeManager().renderReportWithFrozenContainers(_7a1);
}
oCV.addInfoBar();
},1);
}
this.getViewerWidget().reselectSelectionFilterObjects();
this.getViewerWidget().addChromeWhitespaceHandler(this.getId());
};
CCognosViewer.prototype.addFlashChart=function(_7a3){
this.m_flashChartsObjectIds.push(_7a3);
};
CCognosViewer.prototype.flashChartError=function(_7a4){
var _7a5=this.getViewerWidget();
var _7a6=_7a5.getProperties();
_7a6.setProperty("flashCharts",false);
var _7a7=this.getAction("Redraw");
_7a7.isUndoable=function(){
return false;
};
_7a7.execute();
};
CCognosViewer.prototype.initFlashCharts=function(){
var _7a8=this.getViewerWidget();
if(this.m_flashChartsObjectIds.length>0){
var _7a9=document.getElementById("rt"+this.getId());
if(window.addEventListener){
_7a9.addEventListener("mousedown",onFlashChartRightClick,true);
}else{
var _7aa={};
var _7ab=function(){
this.releaseCapture();
};
var _7ac=function(){
onFlashChartRightClick(event);
this.setCapture();
};
for(var i=0;i<this.m_flashChartsObjectIds.length;++i){
var _7ae=this.m_flashChartsObjectIds[i];
var _7af=document.getElementById(_7ae);
_7aa[_7ae]=1;
_7af.parentNode.onmouseup=_7ab;
_7af.parentNode.onmousedown=_7ac;
}
if(this.m_flashChartsObjectIds.length>0){
_7a9.attachEvent("oncontextmenu",function(){
if(_7aa[window.event.srcElement.id]){
return false;
}
});
}
}
if(_7a8){
_7a8.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive",null,true);
}
}else{
if(_7a8){
_7a8.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive",null,false);
}
}
};
CCognosViewer.prototype.initializeLayoutElements=function(){
var _7b0=document.getElementById("rt"+this.getId());
var _7b1=getElementsByAttribute(_7b0,"*","lid");
this.m_lidToElement={};
this.m_layoutElements=[];
var _7b2=0;
var _7b3=this.getPinFreezeManager();
for(var i=0;i<_7b1.length;i++){
var e=_7b1[i];
if(!_7b3||!_7b3.getContainerElement(e)||_7b3.isElementInMainOutput(e)){
this.m_layoutElements[_7b2]=e;
this.m_lidToElement[e.getAttribute("lid")]=e;
_7b2++;
}
}
};
CCognosViewer.prototype.getLayoutElement=function(_7b6){
if(!this.m_layoutElements){
this.initializeLayoutElements();
}
if(this.m_layoutElements){
return this.m_layoutElements[_7b6];
}
return null;
};
CCognosViewer.prototype.getLayoutElementFromLid=function(lid){
if(!this.m_lidToElement){
this.initializeLayoutElements();
}
return this.m_lidToElement[lid];
};
CCognosViewer.prototype.getInfoBars=function(){
return this.m_aInfoBar?this.m_aInfoBar:null;
};
CCognosViewer.prototype.addInfoBar=function(){
if(this.getAdvancedServerProperty("VIEWER_JS_HIDE_INFO_BAR")==="true"){
return;
}
var _7b8=this.getRAPReportInfo();
if(_7b8){
var _7b9=document.getElementById("rt"+this.getId());
this.initializeLayoutElements();
var _7ba=[];
this.m_aInfoBar=[];
for(var _7bb=0;_7bb<this.m_layoutElements.length;++_7bb){
var _7bc=this.m_layoutElements[_7bb];
var lid=_7bc.getAttribute("lid");
if(lid){
if(lid.indexOf("RAP_NDH_")>-1){
lid=lid.substring(8);
}
lid=lid.substring(0,lid.indexOf(this.getId()));
}
var _7be=_7b8.getContainer(lid);
if(_7be&&typeof _7be.parentContainer=="undefined"){
var _7bf=this.collectChildContainers(_7be.container);
if(this.getPinFreezeManager()){
oPinFreezeContainerElement=this.getPinFreezeManager().getContainerElement(_7bc);
_7bc=(oPinFreezeContainerElement)?oPinFreezeContainerElement:_7bc;
}
var _7c0=new InfoBar(this,_7bc,_7be,_7bf,_7bb);
_7c0.setTimingDetails(_7b8._getEventTimings());
_7c0.render();
if(_7c0.hasSomethingRendered()){
_7ba.push(_7c0.getId());
}
this.m_aInfoBar.push(_7c0);
}
}
var _7c1=this.getViewerWidget();
if(_7c1){
_7c1.refreshInfoBarRenderedState(_7ba);
}
}
};
CCognosViewer.prototype.collectChildContainers=function(_7c2){
var _7c3=[];
var _7c4=this.getRAPReportInfo();
if(_7c4){
var _7c5=_7c4.getContainerCount();
for(var cidx=0;cidx<_7c5;++cidx){
var _7c7=_7c4.getContainerFromPos(cidx);
if(typeof _7c7.parentContainer!="undefined"&&_7c7.parentContainer==_7c2){
_7c3.push(_7c7);
}
}
}
return _7c3;
};
CCognosViewer.prototype.addReportInfo=function(){
var _7c8=this.getViewerWidget();
if(typeof _7c8==="undefined"||_7c8===null){
return;
}
if(!_7c8.getAttributeValue("originalReport")||this.isIWidgetMobile()){
return;
}
var _7c9=this.envParams["baseReportModificationTime"];
var _7ca=_7c8.getAttributeValue("baseReportModificationTime");
if(typeof _7c9!=="undefined"&&typeof _7ca!=="undefined"&&_7ca&&_7ca!="<empty>"&&_7c9!==_7ca){
var cvid=this.getId();
var _7cc=document.getElementById("CVReport"+cvid);
var _7cd=_7cc.parentNode;
var id="ReportInfo"+cvid;
var _7cf=document.createElement("div");
_7cf.setAttribute("id",id+"_container");
_7cf.setAttribute("cvid",cvid);
_7cf.className="new-info-indicator BUXNoPrint";
var _7d0=document.createElement("img");
var img=null;
if(this.getDirection()==="rtl"){
img="/rv/images/action_show_info_rtl.png";
}else{
img="/rv/images/action_show_info.png";
}
_7d0.src=this.getWebContentRoot()+img;
_7d0.className="reportInfoIcon";
_7d0.setAttribute("tabIndex","0");
_7d0.setAttribute("alt","");
_7d0.setAttribute("title","");
_7d0.setAttribute("role","presentation");
var _7d2=RV_RES.IDS_JS_REPORT_INFO_TITLE;
var _7d3=RV_RES.IDS_JS_REPORT_INFO_TEXT;
var _7d4=RV_RES.IDS_JS_REPORT_INFO_LINK_TEXT;
_7cf.appendChild(_7d0);
_7cd.insertBefore(_7cf,_7cc);
this.m_reportInfoTooltip=new bux.reportViewer.ReportInfo({connectId:[id+"_container"],focusElement:_7d0,position:["above","below"],title:_7d2,text:_7d3,linkText:_7d4,linkScript:getCognosViewerObjectRefAsString(cvid)+".reportInfoResetReport();",allowMouseOverToolTip:true});
}
};
CCognosViewer.prototype.reportInfoResetReport=function(){
this.executeAction("ResetToOriginal");
};
CCognosViewer.prototype.hideReportInfo=function(){
var _7d5=document.getElementById("ReportInfo"+this.getId()+"_container");
if(typeof _7d5!=="undefined"&&_7d5!==null){
_7d5.style.visibility="hidden";
}
};
CCognosViewer.prototype.insertSortIcons=function(){
var _7d6=this.envParams?this.envParams.limitedInteractiveMode:true;
if(typeof _7d6==="undefined"||_7d6===true){
return;
}
if(this.envParams["ui.action"]==="run"||this.envParams["ui.primaryAction"]==="run"){
this.insertSortIconsForAllLists();
}
};
CCognosViewer.prototype._getContainers=function(_7d7){
var _7d8=[];
var _7d9="",_7da="";
if(_7d7==="list"){
_7d9="list";
_7da="ls";
}else{
if(_7d7==="crosstab"){
_7d9="crosstab";
_7da="xt";
}
}
var _7db=document.getElementById("CVReport"+this.getId());
if(this.getRAPReportInfo()){
var _7dc=this.getRAPReportInfo().getContainerIds(_7d9);
for(var i=0;i<_7dc.length;++i){
var _7de=getElementsByAttribute(_7db,"table","lid",_7dc[i]+this.getId(),1);
if(_7de&&_7de.length>0){
_7d8.push(_7de[0]);
}
}
}else{
_7d8=getElementsByClassName(_7db,"table",_7da);
}
return _7d8;
};
CCognosViewer.prototype.insertSortIconsForAllLists=function(){
var _7df=this._getContainers("list");
for(var i=0;i<_7df.length;++i){
this.insertSortIconsToList(_7df[i]);
}
};
CCognosViewer.prototype.insertSortIconsToList=function(_7e1){
var _7e2=getElementsByAttribute(_7e1,"*","type","columnTitle");
for(var i=0;i<_7e2.length;++i){
var _7e4=_7e2[i];
this.getSelectionController().getSelectionObjectFactory().getSelectionObject(_7e4);
if(_7e4.getAttribute("canSort")!="false"&&_7e4.getAttribute("CTNM")===null&&_7e4.getAttribute("CC")===null){
var _7e5=false;
for(var _7e6=0;_7e6<_7e4.childNodes.length;_7e6++){
var _7e7=_7e4.childNodes[_7e6];
if(_7e7.nodeName.toLowerCase()=="img"){
if(_7e7.id&&_7e7.id.indexOf("sortimg")===0){
_7e5=true;
break;
}
var sLid=_7e7.getAttribute("lid");
if(sLid&&sLid.indexOf("SortIcon")!==-1){
_7e4.removeChild(_7e7);
break;
}
}
}
if(!_7e5&&this.canInsertSortIcon(_7e4)){
this.insertSortIconToColumnHeader(_7e4);
}
}
}
};
CCognosViewer.prototype.isDrillBlackListed=function(){
if(typeof this.m_bDrillBlacklisted=="undefined"){
this.m_bDrillBlacklisted=this.isBlacklisted("DrillDown")||this.isBlacklisted("DrillUp");
}
return this.m_bDrillBlacklisted;
};
CCognosViewer.prototype.isBlacklisted=function(item){
return this.UIBlacklist&&this.UIBlacklist.indexOf(" "+item+" ")>0;
};
CCognosViewer.prototype.canInsertSortIcon=function(_7ea){
var _7eb=_7ea.getAttribute("rp_sort");
return ((!this.isLimitedInteractiveMode()&&!this.isBlacklisted("Sort"))||(_7eb!==undefined&&_7eb!==null&&_7eb.length>0));
};
CCognosViewer.prototype.insertSortIconToColumnHeader=function(_7ec){
if(!_7ec.style.whiteSpace){
_7ec.style.whiteSpace="nowrap";
}
var _7ed=document.createElement("img");
_7ed.setAttribute("id","sortimg"+Math.random());
if((!this.isLimitedInteractiveMode()&&!this.isBlacklisted("Sort"))){
_7ed.onmouseover=function(){
this.setAttribute("oldClassName",this.className);
this.className+=" sortIconOver";
};
_7ed.onmouseout=function(){
this.className=this.getAttribute("oldClassName");
this.removeAttribute("oldClassName");
};
}
_7ed.src=this.getImgSrc(_7ec);
var _7ee=this.getSortInfo(_7ec);
var _7ef=this.getSortOrder(_7ee);
_7ed.setAttribute("alt",this.getSortAltText(_7ef));
_7ed.setAttribute("title",this.getSortAltText(_7ef));
_7ed.className=this.getSortClass(_7ee);
_7ed.setAttribute("sortOrder",_7ef);
_7ec.appendChild(_7ed);
};
CCognosViewer.prototype.canInsertShowExpandCollapseIconForNode=function(_7f0,_7f1){
var _7f2=this.getSelectionController();
var _7f3=_7f2.hasCalculationMetadata(_7f1,[_7f1],"crosstab");
return ((_7f2.canDrillDown(_7f1)||_7f0.alwaysCanExpandCollapse)&&!_7f2.isCalculationOrMeasure(_7f1,_7f3));
};
CCognosViewer.prototype.insertExpandIconsForAllCrosstabs=function(){
var _7f4=this._getContainers("crosstab");
var _7f5=this;
var _7f6=this.getRAPReportInfo();
var _7f7=this.getReportContextHelper();
for(var i=0;i<_7f4.length;i++){
var _7f9=_7f4[i];
var _7fa=_7f9.getAttribute("lid");
_7fa=_7fa.substring(0,_7fa.length-this.getId().length);
var _7fb=getElementsByAttribute(_7f9,["td","th"],"ctnm","true");
for(var j=0;j<_7fb.length;j++){
var _7fd=_7fb[j];
var sCtx=this.findCtx(_7fd);
var _7ff=_7f7.getDataItemName(sCtx);
if(_7ff){
var _800=_7f6.getItemInfo(_7fa,_7ff);
var _801=_7f7.processCtx(sCtx);
if(this.canInsertShowExpandCollapseIconForNode(_800,_801[0][0])){
var sMun=_7f7.getMun(sCtx);
var _803=sMun&&_800.expandedMembers&&_800.expandedMembers[sMun]===true;
var _804=document.createElement("div");
_804.setAttribute("skipSelection","true");
_804.className="expandButton "+(_803?"collapse":"expand");
_7fd.insertBefore(_804,_7fd.firstChild);
var _805=document.createElement("span");
_805.className="expandButtonCaption";
_805.innerHTML=(_803?"[-]":"[+]");
_804.appendChild(_805);
}
}
}
}
};
CCognosViewer.prototype.removeExpandIconsForAllCrosstabs=function(){
var _806=this._getContainers("crosstab");
for(var i=0;i<_806.length;i++){
var _808=_806[i];
var _809=_808.getAttribute("lid");
_809=_809.substring(0,_809.length-this.getId().length);
var _80a=getElementsByAttribute(_808,"td","ctnm","true");
for(var j=0;j<_80a.length;j++){
var _80c=_80a[j];
if(_80c.firstChild.className==="expandButton collapse"||_80c.firstChild.className==="expandButton expand"){
_80c.removeChild(_80c.firstChild);
}
}
}
};
CCognosViewer.prototype.fillInContextData=function(){
if(!this.isLimitedInteractiveMode()){
var _80d=document.getElementById("CVReport"+this.getId());
var _80e=getElementsByClassName(_80d,"table","ls");
for(var i=0;i<_80e.length;++i){
var _810=getElementsByAttribute(_80e[i],"*","type","columnTitle");
for(var j=0;j<_810.length;++j){
this.getSelectionController().getSelectionObjectFactory().getSelectionObject(_810[j]);
}
}
}
};
CCognosViewer.prototype.getSortAltText=function(_812){
if(_812==="ascending"){
return RV_RES.IDS_JS_SORT_ASCENDING;
}else{
if(_812==="descending"){
return RV_RES.IDS_JS_SORT_DESCENDING;
}else{
if(_812==="nosort"){
return RV_RES.IDS_JS_NOT_SORTED;
}
}
}
};
CCognosViewer.prototype.getSortInfo=function(_813){
var _814=_813.getAttribute("rp_sort");
if(_814){
_814=_814.split(".");
}
return _814;
};
CCognosViewer.prototype.getSortClass=function(_815){
var _816="sortIconHidden";
if(_815){
if(_815[0]==="d"||_815[0]==="a"){
_816="sortIconVisible";
}
}
return _816;
};
CCognosViewer.prototype.getSortOrder=function(_817){
var _818="nosort";
if(_817){
if(_817[0]==="d"){
_818="descending";
}else{
if(_817[0]==="a"){
_818="ascending";
}
}
}
return _818;
};
CCognosViewer.prototype.getImgSrc=function(_819){
var _81a=_819.getAttribute("rp_sort");
var src=this.getWebContentRoot()+"/rv/images/"+this.getSortIconName(_81a);
return src;
};
CCognosViewer.prototype.getSortIconName=function(_81c){
var _81d="sort_no.gif";
if(_81c){
_81c=_81c.split(".");
if(_81c[0]==="d"){
_81d="sort_descending.gif";
}else{
if(_81c[0]==="a"){
_81d="sort_ascending.gif";
}
}
}
return _81d;
};
CCognosViewer.prototype.shouldWriteNavLinks=function(){
if(this.envParams["cv.navlinks"]=="false"){
return false;
}else{
if(!this.getUIConfig()||this.getUIConfig().getShowPageNavigation()){
if(this.rvMainWnd||(this.isBux&&!this.isActiveReport())){
return true;
}
}
}
return false;
};
CCognosViewer.prototype.isActiveReport=function(){
if(this.envParams["cv.responseFormat"]==="activeReport"){
return true;
}
return false;
};
CCognosViewer.prototype.resetRaiseSharePromptEventFlag=function(){
this.m_raiseSharePromptEvent=true;
};
CCognosViewer.prototype.resetbHasPromptFlag=function(){
this.m_bHasPrompt=null;
};
CCognosViewer.prototype.disableRaiseSharePromptEvent=function(){
this.m_raiseSharePromptEvent=false;
};
CCognosViewer.prototype.widgetHasPromptParameters=function(){
var _81e=this.getViewerWidget();
return (_81e&&_81e.promptParametersRetrieved==true&&this.envParams&&typeof this.envParams["reportPrompts"]!="undefined"&&this.envParams["reportPrompts"]!=null&&this.envParams["reportPrompts"].length>0);
};
CCognosViewer.prototype.getPromptParametersInfo=function(){
var _81f=null;
if(this.widgetHasPromptParameters()){
_81f="<widget><parameterValues>"+sXmlEncode(this.getExecutionParameters())+"</parameterValues>"+this.envParams["reportPrompts"]+"</widget>";
}
return _81f;
};
CCognosViewer.prototype.raisePromptEvent=function(_820,_821,_822){
try{
var _823=this.getViewerWidget();
_823.getWidgetContextManager().raisePromptEvent(_820,_821,_821.get("ui.action"),this.getModelPath(),_822);
}
catch(e){
}
};
CCognosViewer.prototype.getModelPath=function(){
var _824=this.getSelectionController().getModelPathForCurrentSelection();
if(_824){
return _824;
}else{
if(this.envParams.modelPath){
return this.envParams.modelPath;
}else{
if(typeof document.forms["formWarpRequest"+this.getId()].modelPath!=="undefined"){
return document.forms["formWarpRequest"+this.getId()].modelPath.value;
}
}
}
return "";
};
CCognosViewer.prototype.setKeepFocus=function(_825){
this._keepFocus=_825;
};
CCognosViewer.prototype.getKeepFocus=function(){
if(typeof this._keepFocus!="undefined"){
return this._keepFocus;
}
return false;
};
CCognosViewer.prototype.onFocus=function(evt){
var _827=this.getA11YHelper();
if(_827){
_827.onFocus(evt);
}
};
CCognosViewer.prototype.getA11YHelper=function(){
if(!this.a11yHelper){
this.loadExtra();
if(typeof ViewerA11YHelper=="function"){
this.a11yHelper=new ViewerA11YHelper(this);
}else{
if(typeof console!=="undefined"&&console.log){
console.log("CCognosViewer: Could not create ViewerA11YHelper object.");
}
return null;
}
}
return this.a11yHelper;
};
CCognosViewer.prototype.onKeyDown=function(evt){
if(this.getA11YHelper()){
this.getA11YHelper().onKeyDown(evt);
}
};
CCognosViewer.prototype.updateSkipToReportLink=function(){
var _829=this.getStatus();
var _82a=document.getElementById("cvSkipToReport"+this.getId());
if(_82a){
_82a.style.display=_829=="prompting"?"none":"";
}
};
CCognosViewer.prototype.updateSkipToNavigationLink=function(_82b){
var _82c=document.getElementById("cvSkipToNavigation"+this.getId());
if(_82c){
_82c.style.display=_82b?"none":"";
}
};
CCognosViewer.prototype.pageAction=function(_82d){
this.setKeepFocus("CVNavLinks"+this.getId());
var _82e=new ViewerDispatcherEntry(this);
_82e.addFormField("ui.action",_82d);
if(this.getCurrentlySelectedTab()){
_82e.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",this.getCurrentlySelectedTab());
}
this.dispatchRequest(_82e);
};
CCognosViewer.prototype.writeNavLink=function(_82f,_830,_831,_832){
var _833="";
if(_831){
_833="<td nowrap=\"nowrap\">"+"<img src=\"LINK_IMG\" width=\"15\" height=\"15\" alt=\"\" style=\"vertical-align:middle;\">"+"</td>"+"<td nowrap=\"nowrap\">";
if(_832){
_833+="<a href=\"#\" tabindex=\"0\" onclick=\""+getCognosViewerObjectRefAsString(this.getId())+".getViewerWidget().getSavedOutput().pageAction('LINK_REQUEST');return false;\"";
}else{
_833+="<a href=\"#\" tabindex=\"0\" onclick=\""+getCognosViewerObjectRefAsString(this.getId())+".pageAction('LINK_REQUEST');return false;\"";
}
_833+=">LINK_TEXT</a>&#160;"+"</td>";
}else{
_833="<td nowrap=\"nowrap\">"+"<img src=\"LINK_IMG\" width=\"15\" height=\"15\" alt=\"\" style=\"vertical-align:middle;\">"+"</td>"+"<td nowrap=\"nowrap\">LINK_TEXT&#160;</td>";
}
var sImg=this.sSkin+(!_831&&_82f.sImgDisabled?_82f.sImgDisabled:_82f.sImg);
return _833.replace(/LINK_REQUEST/g,_830).replace(/LINK_TEXT/g,_82f.sText).replace(/LINK_IMG/g,sImg);
};
CCognosViewer.prototype.loadNavLinks=function(){
var _835=window.gScriptLoader.loadFile(this.getGateway(),"b_action=xts.run&m=portal/report-viewer-navlinks.xts");
if(_835){
this.init(eval("("+_835+")"));
}
};
CCognosViewer.prototype.writeNavLinks=function(sSR,_837){
var _838=document.getElementById("CVNavLinks"+this.getId());
if(_838){
var _839=document.getElementById("CVNavLinks_Container"+this.getId());
if(typeof this.oNavLinks!="object"||typeof sSR!="string"||!sSR.match(/\bfirstPage\b|\bpreviousPage\b|\bnextPage\b|\blastPage\b|\bplayback\b/i)){
_838.style.display="none";
if(_839){
_839.style.display="none";
}
this.updateSkipToNavigationLink(true);
return;
}
this.updateSkipToNavigationLink(false);
if(_839){
_839.style.display="";
}
_838.style.display=(isIE()?"block":"table-cell");
var _83a="";
_83a+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"pageControls BUXNoPrint\" role=\"presentation\"><tbody><tr>";
_83a+=this.writeNavLink(this.oNavLinks.oFirst,"firstPage",sSR.match(/\bfirstPage\b/gi),_837);
_83a+=this.writeNavLink(this.oNavLinks.oPrevious,"previousPage",sSR.match(/\bpreviousPage\b/gi),_837);
_83a+=this.writeNavLink(this.oNavLinks.oNext,"nextPage",sSR.match(/\bnextPage\b/gi),_837);
_83a+=this.writeNavLink(this.oNavLinks.oLast,"lastPage",sSR.match(/\blastPage\b/gi),_837);
_83a+="</tr></tbody></table>";
var _83b=document.getElementById("CVNavLinks_label"+this.getId());
var _83c="";
if(_83b){
_83c+="<span id=\"CVNavLinks_label"+this.getId()+"\" style=\"visibilty:hidden; display:none;\">"+_83b.innerHTML+"</span>";
}
_838.innerHTML=_83c+_83a;
}else{
if(this.shouldWriteNavLinks()){
setTimeout(getCognosViewerObjectRefAsString(this.getId())+".writeNavLinks(\""+sSR+"\",\""+_837+"\");",100);
}
}
};
function CVBackgroundLayer_ignoreMouseClick(e){
if(e.returnValue){
e.returnValue=false;
}else{
if(e.preventDefault){
e.preventDefault();
}else{
return false;
}
}
};
CCognosViewer.prototype.createTransparentBackgroundLayer=function(){
this.removeTransparentBackgroundLayer();
var oBL=document.createElement("div");
oBL.id=CV_BACKGROUND_LAYER_ID;
oBL.style.display="none";
oBL.style.position="absolute";
oBL.setAttribute("role","region");
oBL.setAttribute("aria-label",RV_RES.IDS_JS_A11Y_BACKGROUND_TINT);
oBL.style.top="0px";
oBL.style.left="0px";
oBL.style.zIndex=98;
oBL.style.width="100%";
oBL.style.height="100%";
oBL.style.backgroundColor="rgb(238, 238, 238)";
oBL.style.opacity="0";
oBL.style.filter="alpha(opacity:0)";
oBL.innerHTML="<table tabindex=\"1\" width=\"100%\" height=\"100%\"><tr><td role=\"presentation\" onclick=\"CVBackgroundLayer_ignoreMouseClick(event)\"></td></tr></table>";
oBL.style.display="inline";
document.body.appendChild(oBL);
};
CCognosViewer.prototype.removeTransparentBackgroundLayer=function(){
var oBL=document.getElementById(CV_BACKGROUND_LAYER_ID);
if(oBL){
oBL.parentNode.removeChild(oBL);
}
};
CCognosViewer.prototype.closeActiveHTTPConnection=function(){
var _840=this.getActiveRequest();
if(_840){
_840.abortHttpRequest();
}
};
CCognosViewer.prototype.canCancel=function(){
var _841=this.getTracking();
var _842=this.getStatus();
return _841!=""&&_842!="complete";
};
CCognosViewer.prototype.cancel=function(_843){
if(this.getWorkingDialog()&&this.getWorkingDialog().disableCancelButton){
this.getWorkingDialog().disableCancelButton(_843);
}
this.removeTransparentBackgroundLayer();
this.clearPrompts();
if(this.m_viewerFragment&&this.envParams["fragment.fireEventWhenComplete"]){
this.envParams["fragment.fireEventWhenComplete"]="";
}
var _844=null;
if(this.m_undoStack.length>0){
_844=this.m_undoStack.pop();
}
var _845=this.getActiveRequest();
if(this.canCancel()===true||_845){
if(_845){
_845.cancelRequest(true);
}else{
var _846=null;
var _847=_844!=null&&_844.m_bRefreshPage;
if(typeof this.getCancelDispatcherEntry=="function"){
_846=this.getCancelDispatcherEntry();
}else{
if(_847||this.m_viewerFragment){
_846=new ViewerDispatcherEntry(this);
}else{
if(this.getId()=="RS"){
_846=new ViewerDispatcherEntry(this);
_846.addFormField("cv.responseFormat","rs");
}else{
_846=new DispatcherEntry(this);
_846.addFormField("cv.responseFormat","successfulRequest");
}
}
}
_846.forceSynchronous();
_846.addFormField("ui.action","cancel");
_846.addFormField("m_tracking",this.getTracking());
this.setTracking("");
if(_847){
var _848="<CognosViewerUndo><conversation>";
_848+=_844.m_sConversation;
_848+="</conversation></CognosViewerUndo>";
_846.addFormField("cv.previousSession",_848);
}
this.dispatchRequest(_846);
if(!this.isBux&&!this.m_viewerFragment&&(this.getUsePageRequest()||!this.isReportRenderingDone())){
this.executeCallback("cancel");
}
}
this.setStatus("complete");
var _849=this.envParams["ui.action"];
var _84a=this.getUsePageRequest();
var _84b=this.m_undoStack.length;
if(_844!=null){
this.m_sConversation=_844.m_sConversation;
this.m_sParameters=_844.m_sParameters;
this.envParams={};
applyJSONProperties(this.envParams,_844.m_envParams);
this.m_undoStack.push(_844);
}
this.setTracking("");
if(this.previouslySelectedTab){
this.cancelTabSwitch();
}else{
if(_849!="view"&&_84b<=0&&this.rvMainWnd){
this.rvMainWnd.executePreviousReport(-1);
}
}
return true;
}else{
if(this.rvMainWnd&&typeof this.envParams!="undefined"&&(this.envParams["ui.primaryAction"]=="authoredDrillThrough"||this.envParams["ui.primaryAction"]=="authoredDrillThrough2")){
this.rvMainWnd.executePreviousReport(-1);
return true;
}else{
if(!this.isBux){
executeBackURL(this.getId());
}
return true;
}
}
return false;
};
CCognosViewer.prototype.clearPrompts=function(){
if(this.preProcessControlArray){
var _84c=this.preProcessControlArray.length;
var k=0;
for(k=0;k<_84c;k++){
var _84e=eval(this.preProcessControlArray[k]);
if(_84e){
if(_84e.clearSubmit){
_84e.clearSubmit();
}
}
}
}
};
CCognosViewer.prototype.wait=function(){
if(this.isWorking()){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
var _84f=new ViewerDispatcherEntry(this);
_84f.addFormField("ui.action","wait");
_84f.addFormField("ui.primaryAction",this.envParams["ui.primaryAction"]);
_84f.addFormField("cv.actionState",this.envParams["cv.actionState"]);
_84f.addNonEmptyStringFormField("bux",this.envParams["bux"]);
_84f.addNonEmptyStringFormField("ui.preserveRapTags",this.envParams["ui.preserveRapTags"]);
this.dispatchRequest(_84f);
return true;
}
return false;
};
CCognosViewer.prototype.setCAFContext=function(_850){
this.m_sCAFContext=_850;
};
CCognosViewer.prototype.setContextInfo=function(sXML){
this.m_sContextInfoXML=sXML;
};
CCognosViewer.prototype.setConversation=function(_852){
this.m_sConversation=_852;
};
CCognosViewer.prototype.setActionState=function(_853){
this.m_sActionState=_853;
};
CCognosViewer.prototype.setStatus=function(_854){
this.m_sStatus=_854;
};
CCognosViewer.prototype.setDebug=function(_855){
this.m_bDebug=_855;
};
CCognosViewer.prototype.setExecutionParameters=function(_856){
this.m_sParameters=_856;
};
CCognosViewer.prototype.setMetadataInfo=function(sXML){
this.m_sMetadataInfoXML=sXML;
};
CCognosViewer.prototype.setSecondaryRequests=function(_858){
if(_858){
this.m_aSecRequests=_858;
}else{
this.m_aSecRequests=[];
}
};
CCognosViewer.prototype.setTracking=function(_859){
this.m_sTracking=_859;
};
CCognosViewer.prototype.setSoapFault=function(_85a){
this.m_sSoapFault=_85a;
};
CCognosViewer.prototype.showOutputInNewWindow=function(sURL){
var _85c=document.getElementById("formWarpRequest"+this.getId());
var _85d=_85c.elements["ui.postBack"];
var _85e=_85c.elements["ui.backURL"];
if(window.opener||_85d||(_85e&&_85e.value!=="javascript:window.close();")){
window.open(sURL,"","");
this.updateNewBrowserWindow();
}else{
if(this.isAccessibleMode()&&this.envParams["run.outputFormat"]=="PDF"&&window.detachLeavingRV){
window.detachLeavingRV();
}
window.location=sURL;
}
};
CCognosViewer.prototype.hideToolbar=function(_85f){
this.m_bHideToolbar=_85f;
};
CCognosViewer.prototype.showExcel=function(sURL){
var _861=true;
var _862=document.getElementById("formWarpRequest"+this.getId());
var _863=_862.elements["ui.backURL"];
if(_863&&_863.value.indexOf("javascript:window.close()")!==0&&_863.value.indexOf("close.html")===-1){
_861=false;
}
var _864=window;
if(window.opener&&(isIE()||isFF())&&_861){
_864=window.opener?window.opener:window;
}else{
if(!window.opener&&_861){
var _865=this.envParams["run.outputFormat"].toLowerCase();
if((_865=="spreadsheetml"||_865=="csv"||_865=="singlexls"||_865=="xlsxdata"||_865=="xlwa")&&window.detachLeavingRV&&window.attachLeavingRV){
window.detachLeavingRV();
window.location=sURL;
window.attachLeavingRV();
return;
}else{
window.location=sURL;
return;
}
}
}
var _866=null;
var _867="";
try{
if(this.envParams["cv.excelWindowOpenProperties"]){
_867=this.envParams["cv.excelWindowOpenProperties"];
}
_866=_864.open(sURL,"",_867);
}
catch(e){
_864=window;
_866=_864.open(sURL,"",_867);
}
if(!_866||_866.closed||typeof _866.closed=="undefined"){
alert(RV_RES.RV_BROWSER_POPUP_IS_ENABLED);
}
this.updateNewBrowserWindow();
};
CCognosViewer.prototype.updateNewBrowserWindow=function(){
var id=this.getId();
var _869=document.forms["formWarpRequest"+id].elements["ui.postBack"];
var _86a=document.forms["formWarpRequest"+id].elements["ui.backURL"];
if(_869&&_869.value){
setTimeout(getCognosViewerObjectRefAsString(id)+".getRV().doPostBack();",100);
}else{
if(_86a&&_86a.value){
if(_86a.value.length<2048){
setTimeout("location.replace(\""+_86a.value+"\");",100);
}else{
_86a=decodeURIComponent(_86a.value);
var _86b=_86a.split("?");
var _86c=document.createElement("form");
_86c.style.display="none";
_86c.setAttribute("target","_self");
_86c.setAttribute("method","post");
_86c.setAttribute("action",_86b[0]);
var _86d=_86b[1].split("&");
for(var _86e=0;_86e<_86d.length;_86e++){
var _86f=_86d[_86e].indexOf("=");
var _870=_86d[_86e].substr(0,_86f);
var _871=_86d[_86e].substr(_86f+1);
var _872=document.createElement("img");
_872.setAttribute("type","hidden");
_872.setAttribute("name",decodeURIComponent(_870));
_872.setAttribute("value",decodeURIComponent(_871));
_86c.appendChild(_872);
}
document.body.appendChild(_86c);
_86c.submit();
}
}else{
window.close();
}
}
};
CCognosViewer.prototype.showWaitPage=function(){
};
CCognosViewer.prototype.sendRequest=function(_873){
var _874=new ViewerDispatcherEntry(this);
_874.addFormField("ui.action",_873.getAction());
if(_873.getCallback()!=null){
_874.setCallbacks({"complete":{"object":null,"method":_873.getCallback()}});
}
var _875=_873.getFormFields().keys();
for(var _876=0;_876<_875.length;_876++){
_874.addFormField(_875[_876],_873.getFormFields().get(_875[_876]));
}
var _877=_873.m_oOptions.keys();
for(var _878=0;_878<_877.length;_878++){
_874.addFormField(_877[_878],_873.getOption(_877[_878]));
}
var _879=_873.m_oParams.keys();
for(var _87a=0;_87a<_879.length;_87a++){
_874.addFormField(_879[_87a],_873.getParameter(_879[_87a]));
}
this.dispatchRequest(_874);
};
CCognosViewer.prototype.promptAction=function(_87b,sUrl){
this.setKeepFocus(true);
if(typeof datePickerObserverNotify=="function"){
datePickerObserverNotify();
}
var _87d=this.getViewerWidget();
if(_87b=="cancel"){
this.cancelPrompt(sUrl);
if(_87d){
if(!this.isReportRenderingDone()){
var _87e={action:"deleteWidget"};
_87d.fireEvent("com.ibm.bux.widget.action",null,_87e);
}
}
}else{
var oReq=new ViewerDispatcherEntry(this);
oReq.addFormField("ui.action",_87b=="back"?"back":"forward");
if(_87b=="finish"){
oReq.addFormField("run.prompt",false);
}else{
if(_87b=="back"||_87b=="next"){
oReq.addFormField("run.prompt",true);
}
}
if(_87b=="reprompt"){
if(typeof repromptObserverNotify=="function"){
repromptObserverNotify(this);
}
oReq.addFormField("_promptControl",_87b);
}else{
oReq.addFormField("_promptControl","prompt");
}
if(_87d){
_87d.fireEvent("com.ibm.bux.widget.modified",null,{"modified":true});
if(_87d.isSelectionFilterEnabled){
_87d.clearSelectionFilter();
}
}
this.submitPromptValues(oReq);
}
};
CCognosViewer.prototype.cancelPrompt=function(sUrl){
this.cancel();
};
CCognosViewer.prototype.notify=function(_881,_882){
var _883=0,k=0;
var _885=null;
if(this.rangeObserverArray&&this.rangeObserverArray instanceof Array){
_883=this.rangeObserverArray.length;
for(k=0;k<_883;k++){
_885=eval(this.rangeObserverArray[k]);
if(_885&&typeof _885=="object"&&typeof _885.update=="function"){
_885.update();
}
}
}
var _886=true;
if(this.preProcessControlArray&&this.preProcessControlArray instanceof Array){
_883=this.preProcessControlArray.length;
for(k=0;k<_883;k++){
_885=eval(this.preProcessControlArray[k]);
if((typeof _885.getValid=="function")&&!_885.getValid()){
_886=false;
break;
}
}
}
this.notifyPageNavEnabled(_886);
if(this.multipleObserverArray&&this.multipleObserverArray instanceof Array){
_883=this.multipleObserverArray.length;
for(k=0;k<_883;k++){
_885=eval(this.multipleObserverArray[k]);
if(_885&&typeof _885=="object"&&typeof _885.checkInsertRemove=="function"){
_885.checkInsertRemove();
}
}
}
for(var _887=0;_887<gaNotifyTargets.length;_887++){
var _888=gaNotifyTargets[_887];
if(typeof _888!="undefined"&&typeof _888.notify=="function"){
_888.notify(_881,_882);
}
}
};
CCognosViewer.prototype.notifyPageNavEnabled=function(_889){
if(this.pageNavigationObserverArray&&this.pageNavigationObserverArray instanceof Array){
var _88a=this.pageNavigationObserverArray.length;
var _88b=false;
var _88c=null;
var _88d=null;
var k=0;
for(k=0;k<_88a;k++){
try{
_88c=eval(this.pageNavigationObserverArray[k]);
_88d=_88c.getType();
if(_88d==PROMPTBUTTON_FINISH){
_88b=true;
break;
}
}
catch(e){
}
}
for(k=0;k<_88a;k++){
try{
_88c=eval(this.pageNavigationObserverArray[k]);
_88d=_88c.getType();
if(!_889){
if((_88d==PROMPTBUTTON_NEXT)||(_88d==PROMPTBUTTON_OK)||(_88d==PROMPTBUTTON_FINISH)){
_88c.setEnabled(false);
}
}else{
if(_88d==PROMPTBUTTON_FINISH){
_88c.setEnabled(this.bCanFinish);
}else{
if(_88d==PROMPTBUTTON_NEXT){
_88c.setEnabled(this.bNextPage||!_88b);
}else{
if(_88d==PROMPTBUTTON_OK){
_88c.setEnabled(true);
}
}
}
}
}
catch(e2){
}
}
}
};
CCognosViewer.prototype.getDrillResetHUNs=function(_88f){
var _890=null;
if(this.getRAPReportInfo()){
_890=this.getRAPReportInfo().getDrilledOnHUNs();
}
if(!_890){
return null;
}
var _891=this.getExecutionParameters();
if(!_891){
return null;
}
var _892=this._getListOfChangedPromptParameters(_88f);
if(!_892||_892.length===0){
return null;
}
var _893=[];
for(var i=0;i<_890.length;i++){
for(var j=0;j<_892.length;j++){
if(_892[j].indexOf(_890[i])!==-1){
_893.push(_890[i]);
}
}
}
return _893;
};
CCognosViewer.prototype.getOldParameters=function(){
var _896=new CParameterValues();
var _897=XMLBuilderLoadXMLFromString(this.getExecutionParameters());
if(_897.childNodes.length==1){
_896.loadWithOptions(_897.childNodes[0],false);
}
if(!_896||!_896.m_parameterValues||!_896.m_parameterValues.m_aValues){
return null;
}
return _896.m_parameterValues.m_aValues;
};
CCognosViewer.prototype._createDummyRequest=function(){
var _898=new ViewerDispatcherEntry(this);
return this.preparePromptValues(_898);
};
CCognosViewer.prototype._getChangedPromptParametersValues=function(_899,_89a,_89b){
var _89c=XMLBuilderLoadXMLFromString(_89a);
if(!_89c){
for(var j=0;j<_899.length;j++){
var _89e=_899[j].m_useValue;
if(_89a.indexOf(sXmlEncode(_89e))<0){
_89b.push(_89e);
}
}
return;
}
var _89f=_89c.getElementsByTagName("selectOption");
if(!_89f){
return;
}
var _8a0=_899.length;
var _8a1=_89f.length;
for(var i=0;i<_8a1;i++){
var _89a=_89f[i].attributes.getNamedItem("useValue").nodeValue;
bMatchOldParam=false;
for(var j=0;j<_8a0;j++){
var _89e=_899[j].m_useValue;
if(_89a.indexOf(_89e)===0){
bMatchOldParam=true;
break;
}
}
if(!bMatchOldParam){
_89b.push(_89a);
}
}
};
CCognosViewer.prototype._getListOfChangedPromptParameters=function(_8a3){
var _8a4=this.getOldParameters();
if(!_8a4){
return null;
}
var _8a5=[];
if(!_8a3){
var _8a6=this._createDummyRequest();
for(var _8a7 in _8a4){
var _8a8=_8a4[_8a7].m_parmValueItems;
var _8a9=_8a6.getRequest().getFormFields().get("p_"+_8a7);
if(!_8a9){
continue;
}
this._getChangedPromptParametersValues(_8a8,_8a9,_8a5);
}
}else{
if(!_8a3.parameters){
return null;
}
var _8aa=_8a3.parameters;
for(var i=0;i<_8aa.length;i++){
var _8ac=_8aa[i].parmName;
if(!_8ac||!_8a4[_8ac]){
continue;
}
var _8a8=_8a4[_8ac].m_parmValueItems;
if(!_8a8||_8a8.length==0){
continue;
}
this._getChangedPromptParametersValues(_8a8,_8aa[i].parmValue,_8a5);
}
}
return _8a5;
};
CCognosViewer.prototype.submitPromptValues=function(oReq){
if(this.gbPromptRequestSubmitted===true){
return false;
}
if(this.isReportRenderingDone()){
this.m_currentlySelectedTab=null;
}
this.gbPromptRequestSubmitted=true;
if(this.isBux){
var _8ae=this.getDrillResetHUNs(null);
if(_8ae&&_8ae.length!==0){
var _8af={"drilledResetHUNs":_8ae};
this.executeAction("DrillReset",_8af);
return;
}
}
oReq=this.preparePromptValues(oReq);
if(window.portletSharePrompt){
var _8b0=this.portletPromptParams(oReq);
if(_8b0.length>0){
portletSharePrompt(_8b0);
}
}
this.dispatchRequest(oReq);
};
CCognosViewer.prototype.portletPromptParams=function(oReq){
var _8b2=[];
var _8b3=null;
var _8b4=true;
var _8b5=oReq.getFormFields().keys();
for(var _8b6=0;_8b6<_8b5.length;_8b6++){
_8b3=_8b5[_8b6];
if(_8b3=="_promptControl"&&oReq.getFormField(_8b3)=="search"){
_8b4=false;
break;
}else{
if(_8b3.indexOf("p_")===0){
if(_8b3.indexOf("p_credential")===0){
_8b4=false;
break;
}else{
_8b2.push([_8b3,oReq.getFormField(_8b3)]);
}
}
}
}
if(_8b2&&!_8b4){
_8b2=[];
}
return _8b2;
};
CCognosViewer.prototype.preparePromptValues=function(oReq){
var _8b8=[];
if(this.preProcessControlArray){
var _8b9=this.preProcessControlArray.length;
var k=0;
for(k=0;k<_8b9;k++){
var _8bb=eval(this.preProcessControlArray[k]);
var _8bc=(typeof _8bb.isEnabled=="function"?_8bb.isEnabled():true);
if(_8bb&&typeof _8bb.preProcess=="function"&&_8bc){
_8bb.preProcess();
if(_8bb.m_oSubmit){
if(oReq.addParameter){
oReq.addParameter(_8bb.m_oSubmit.name,_8bb.m_oSubmit.value);
}else{
oReq.addFormField(_8bb.m_oSubmit.name,_8bb.m_oSubmit.value);
}
_8b8.push(_8bb.m_oSubmit);
if(_8bb.m_sPromptId&&_8bb.m_oForm&&_8bb.m_oForm.elements&&typeof _8bb.m_oForm.elements["p_"+_8bb.m_sRef]=="object"){
if(oReq.addParameter){
oReq.addParameter("p_"+_8bb.m_sPromptId,_8bb.m_oForm.elements["p_"+_8bb.m_sRef].value);
}else{
oReq.addFormField("p_"+_8bb.m_sPromptId,_8bb.m_oForm.elements["p_"+_8bb.m_sRef].value);
}
}
}
}
}
}
var _8bd=document.getElementById("formWarpRequest"+this.getId());
if(_8bd){
var _8be=_8bd.elements;
for(var _8bf=0;_8bf<_8be.length;_8bf++){
var _8c0=_8be[_8bf];
if(!_8c0.name||!_8c0.name.match(/^p_/)){
continue;
}
var _8c1=true;
for(var _8c2=0;_8c2<_8b8.length;_8c2++){
if(_8b8[_8c2]==_8c0){
_8c1=false;
break;
}
}
if(_8c1){
oReq.addFormField(_8c0.name,_8c0.value);
_8b8.push(_8c0);
}
}
}
var oRM=this["CognosReport"];
if(oRM){
var _8c4=oRM.prompt.getParameters();
for(var i=0;i<_8c4.length;i++){
var _8c6="p_"+_8c4[i].getName();
if(!oReq.getFormField(_8c6)){
oReq.addFormField(_8c6,_8c4[i].getXML());
}
}
}
return oReq;
};
CCognosViewer.prototype.setViewerWidget=function(_8c7){
this.m_viewerWidget=_8c7;
};
CCognosViewer.prototype.getViewerWidget=function(){
return this.m_viewerWidget;
};
CCognosViewer.prototype.getFlashChartOption=function(){
var _8c8=this.getViewerWidget();
var _8c9=null;
if(_8c8){
var _8ca=_8c8.getProperties();
if(_8ca){
_8c9=_8ca.getFlashCharts();
}
}
return _8c9;
};
CCognosViewer.prototype.fireWidgetEvent=function(evt,_8cc){
var _8cd=this.getViewerWidget();
if(_8cd!=null){
_8cd.fireEvent(evt,null,_8cc);
}
};
CCognosViewer.prototype.isMobile=function(){
return false;
};
CCognosViewer.prototype.setVisibleDialog=function(_8ce){
this.m_visibleDialog=_8ce;
};
CCognosViewer.prototype.getVisibleDialog=function(){
if(typeof this.m_visibleDialog!="undefined"){
return this.m_visibleDialog;
}
return null;
};
CCognosViewer.prototype.getContentLocale=function(){
var _8cf=document.getElementById("formWarpRequest"+this.getId());
if(_8cf&&_8cf["ui.contentLocale"]&&_8cf["reRunObj"]&&_8cf["reRunObj"].value.length>0){
return _8cf["ui.contentLocale"].value;
}
return null;
};
CCognosViewer.prototype.updateLayout=function(_8d0){
var cvid=this.getId();
var _8d2=document.getElementById("CVHeader"+cvid);
var _8d3=document.getElementById("CVToolbar"+cvid);
if(!_8d2&&!_8d3){
setTimeout(getCognosViewerObjectRefAsString(cvid)+".updateLayout(\""+_8d0+"\");",100);
return;
}
if(_8d2){
var _8d4=this.getUIConfig()&&!this.getUIConfig().getShowBanner();
if((_8d0=="prompting"&&!this.bShowHeaderWithPrompts)||_8d4){
_8d2.parentNode.style.display="none";
}else{
_8d2.parentNode.style.display="";
}
}
if(_8d3){
if(_8d0=="prompting"||this.m_bHideToolbar==true){
_8d3.parentNode.style.display="none";
}else{
_8d3.parentNode.style.display="";
}
}
};
CCognosViewer.prototype.updateResponseSpecification=function(_8d5){
this.sResponseSpecification=_8d5;
};
CCognosViewer.prototype.getResponseSpecification=function(){
return this.sResponseSpecification;
};
CCognosViewer.prototype.release=function(_8d6){
if(this.getStatus()!="fault"){
this._release(_8d6);
}
};
CCognosViewer.prototype._release=function(_8d7){
var form=document.getElementById("formWarpRequest"+this.getId());
var _8d9=this.getTracking();
if(!_8d9&&form&&form["m_tracking"]&&form["m_tracking"].value){
_8d9=form["m_tracking"].value;
form["m_tracking"].value="";
}
this.setTracking("");
if(_8d9){
var _8da=new DispatcherEntry(this);
if(this.isWorkingOrPrompting()){
_8da.addFormField("ui.action","cancel");
}else{
_8da.addFormField("ui.action","release");
}
_8da.addFormField("cv.responseFormat","successfulRequest");
_8da.addNonEmptyStringFormField("ui.primaryAction",this.envParams["ui.primaryAction"]);
_8da.addNonEmptyStringFormField("ui.objectClass",this.envParams["ui.objectClass"]);
_8da.addFormField("m_tracking",_8d9);
if(_8d7!=true){
_8da.forceSynchronous();
}
var _8db=this.getActiveRequest()?this.getActiveRequest():this.getFaultDispatcherEntry();
if(_8db&&_8db.getFormField("cv.outputKey")){
_8da.addFormField("b_action","cvx.high");
_8da.addFormField("cv.outputKey",_8db.getFormField("cv.outputKey"));
_8da.addFormField("cv.waitForResponse","false");
_8da.setHeaders(_8db.getHeaders());
}
_8da.sendRequest();
return true;
}
return false;
};
CCognosViewer.prototype.cleanupStyles=function(){
if(this.getViewerWidget()){
this.getViewerWidget().cleanupStyles();
}
};
CCognosViewer.prototype.destroy=function(_8dc){
this.release(_8dc);
if(!this.m_destroyed){
if(typeof window.gaRV_INSTANCES!="undefined"){
for(var _8dd=0;_8dd<window.gaRV_INSTANCES.length;_8dd++){
if(window.gaRV_INSTANCES[_8dd].m_sId==this.getId()){
window.gaRV_INSTANCES.splice(_8dd,1);
this.m_destroyed=true;
break;
}
}
}
if(this.m_layoutElements){
for(var i=0;i<this.m_layoutElements.length;i++){
var e=this.m_layoutElements[i];
var j=e.getAttribute("lid");
this.m_layoutElements.splice(i,1);
delete this.m_lidToElement[j];
var _8e1=e.parentNode;
if(_8e1){
_8e1.removeChild(e);
}
}
delete this.m_layoutElements;
delete this.m_lidToElement;
}
if(this.m_oDrillMgr){
this.m_oDrillMgr.setCV(null);
}
var _8e2=this.getSelectionController();
if(_8e2){
GUtil.destroyProperties(_8e2);
}
var cvId=this.getId();
this.m_viewerDispatcher=null;
GUtil.destroyProperties(this,true);
cleanupGlobalObjects(cvId);
}
};
CCognosViewer.prototype.exit=function(){
this.release();
};
CCognosViewer.prototype.executeAction=function(_8e4,_8e5){
var _8e6=this.getAction(_8e4);
_8e6.setRequestParms(_8e5);
return _8e6.execute();
};
CCognosViewer.prototype.getCalculation=function(_8e7){
var calc=null;
var _8e9=this.getCalculationCache();
if(_8e9[_8e7]){
calc=_8e9[_8e7];
}else{
calc=eval("new "+_8e7+"();");
calc.setCognosViewer(this);
_8e9[_8e7]=calc;
}
return calc;
};
CCognosViewer.prototype.findBlueDotMenu=function(_8ea){
var root=null;
var _8ec=(_8ea)?_8ea:this.getToolbar();
for(var idx=0;idx<_8ec.length;++idx){
if(typeof _8ec[idx]._root!="undefined"){
root=_8ec[idx]._root;
break;
}
}
return root;
};
CCognosViewer.prototype.findToolbarItem=function(_8ee,_8ef){
var spec=typeof _8ef=="undefined"||_8ef==null?this.getToolbar():_8ef;
var _8f1=null;
for(var _8f2=0;_8f2<spec.length;++_8f2){
var name=spec[_8f2]["name"];
if(typeof name!="undefined"&&name==_8ee){
_8f1=spec[_8f2];
break;
}
}
return _8f1;
};
CCognosViewer.prototype.findToolbarItemIndex=function(_8f4,_8f5){
var spec=typeof _8f5=="undefined"||_8f5==null?this.getToolbar():_8f5;
var _8f7=null;
for(var _8f8=0;_8f8<spec.length;++_8f8){
var name=spec[_8f8]["name"];
if(typeof name!="undefined"&&name==_8f4){
_8f7=_8f8;
break;
}
}
return _8f7;
};
CCognosViewer.prototype.addedButtonToToolbar=function(_8fa,_8fb,_8fc,_8fd){
if(typeof _8fb!="undefined"&&_8fb!=null){
if(this.findToolbarItem(_8fb.name,_8fa)==null){
_8fc=this.findToolbarItemIndex(_8fc,_8fa);
if(typeof _8fc!="undefined"&&_8fc!=null){
_8fa.splice(++_8fc,0,_8fb);
return true;
}else{
if(typeof _8fd!="undefined"&&_8fd!=null){
_8fa.splice(_8fd,0,_8fb);
return true;
}
}
}
}
return false;
};
CCognosViewer.prototype.addDrillTargets=function(_8fe){
this.m_drillTargets=_8fe;
};
CCognosViewer.prototype.getDrillTargets=function(){
return this.m_drillTargets;
};
CCognosViewer.prototype.getDrillTarget=function(idx){
if(idx>=this.m_drillTargets.length){
return null;
}
return this.m_drillTargets[idx];
};
CCognosViewer.prototype.getNumberOfDrillTargets=function(){
return this.m_drillTargets.length;
};
CCognosViewer.prototype.isReportRenderingDone=function(){
return this.m_reportRenderingDone;
};
CCognosViewer.prototype.setReportRenderingDone=function(flag){
this.m_reportRenderingDone=flag;
};
CCognosViewer.prototype.hasAVSChart=function(){
var _901=this.getRAPReportInfo();
if(_901){
var _902=_901.getDisplayTypes();
return _902.match("_v2")!=null||_902.match("v2_")!=null;
}
return false;
};
CCognosViewer.prototype.getPinFreezeManager=function(){
return this.m_pinFreezeManager;
};
CCognosViewer.prototype.getReportContextHelper=function(){
if(!this.m_reportContextHelper){
this.m_reportContextHelper=new ReportContextHelper(this.getSelectionController().getCCDManager());
}
return this.m_reportContextHelper;
};
CCognosViewer.prototype.getRAPReportInfo=function(){
return this.m_RAPReportInfo;
};
CCognosViewer.prototype.setRAPReportInfo=function(_903){
this.m_RAPReportInfo=_903;
};
CCognosViewer.prototype.isNodeVisible=function(node){
if(this.m_pinFreezeManager){
return this.m_pinFreezeManager.isNodeVisible(node);
}
return true;
};
CCognosViewer.prototype.getWarpRequestForm=function(){
return document.getElementById("formWarpRequest"+this.getId());
};
CCognosViewer.prototype.getBrowser=function(){
return this.sBrowser;
};
CCognosViewer.prototype.repaintDiv=function(oDiv){
var _906=oDiv.style.display;
oDiv.style.display="none";
oDiv.style.display=_906;
};
CCognosViewer.prototype.isMetadataEmpty=function(){
var oSC=this.getSelectionController();
if(oSC){
var _908=oSC.getCCDManager();
if(_908){
return _908.isMetadataEmpty();
}
}
return true;
};
CCognosViewer.prototype.setContextMenu=function(_909){
this.m_contextMenu=_909;
};
CCognosViewer.prototype.getContextMenu=function(){
return this.m_contextMenu;
};
CCognosViewer.prototype.setToolbar=function(_90a){
this.m_toolbar=_90a;
};
CCognosViewer.prototype.getToolbar=function(){
return this.m_toolbar;
};
CCognosViewer.prototype.getAdvancedServerProperty=function(_90b){
if(this.m_advancedProperties&&this.m_advancedProperties[_90b]!==undefined&&this.m_advancedProperties[_90b]!==null){
return this.m_advancedProperties[_90b];
}else{
return null;
}
};
CCognosViewer.prototype.hasPrompt=function(){
if(typeof this.m_bHasPrompt==="undefined"||this.m_bHasPrompt===null){
var _90c=false;
if(this.getAdvancedServerProperty("VIEWER_JS_PROMPT_AGAIN_SHOW_ALWAYS")==="true"||(this.envParams.reportPrompts&&this.envParams.reportPrompts.length>0)){
_90c=true;
}else{
var _90d=new CParameterValues();
var _90e=XMLBuilderLoadXMLFromString(this.getExecutionParameters());
if(_90e.childNodes.length==1){
_90d.loadWithOptions(_90e.childNodes[0],true);
var _90f=_90d.length();
for(var _910=0;_910<_90f;++_910){
var _911=_90d.getAt(_910);
if(_911!==null&&_911.length()>0&&_911.name().indexOf("credential:")!=-1){
_90c=true;
break;
}
}
}
}
this.m_bHasPrompt=_90c;
}
return this.m_bHasPrompt;
};
CCognosViewer.prototype.getDrillState=function(){
return this.m_sStateData?this.m_sStateData:"";
};
CCognosViewer.prototype.isSelectionFilterEnabled=function(){
if(typeof this.m_bSelectionFilterSwitch=="undefined"){
this.m_bSelectionFilterSwitch=false;
}
return this.m_bSelectionFilterSwitch;
};
CCognosViewer.prototype.broadcastContextChange=function(evt,_913){
if(this.getViewerWidget()){
this.getViewerWidget().broadcastContextChange(_913);
}
stopEventBubble(evt);
};
CCognosViewer.prototype.broadcastParameterChange=function(evt,_915){
if(this.getViewerWidget()){
this.getViewerWidget().broadcastParameterChange(_915);
}
stopEventBubble(evt);
};
CCognosViewer.prototype.getReportDiv=function(){
if(!this.m_nReportDiv){
this.m_nReportDiv=document.getElementById("CVReport"+this.m_sId);
}
return this.m_nReportDiv;
};
function CDocumentWriter(sId,_917){
this.m_sId=sId;
this.m_sText="";
this.m_sScript=_917;
};
CDocumentWriter.prototype.isValid=function(){
if(typeof this.m_sScript!="undefined"&&this.m_sScript&&window.gScriptLoader){
return true;
}
return false;
};
CDocumentWriter.prototype.execute=function(){
if(this.isValid()&&window.gScriptLoader){
var _918=/document\.write(ln)?\s*\(/gi;
var _919=this.m_sScript.replace(_918,"this.write(").replace(window.gScriptLoader.m_reScriptTagOpen,"").replace(window.gScriptLoader.m_reScriptTagClose,"");
try{
eval(_919);
var _91a=document.getElementById(this.m_sId);
if(_91a){
_91a.innerHTML=this.m_sText;
return true;
}
}
catch(e){
}
}
return false;
};
CDocumentWriter.prototype.write=function(_91b){
var _91c="";
if(typeof _91b=="function"){
_91c=eval(_91b);
}else{
if(typeof _91b=="string"){
_91c=_91b;
}
}
this.m_sText+=_91c;
};
function setFocusToFirstTabItem(_91d){
if(!window.dojo){
return;
}
var _91e=dojo.query("*",_91d);
var _91f=_91e.length;
for(var i=0;i<_91f;i++){
var node=_91e[i];
if(!node.style||(node.style.display!="none"&&node.style.visibility!="hidden")){
if(node.getAttribute("tabIndex")==0){
try{
node.focus();
}
catch(e){
}
break;
}
}
}
};
function ReportContextHelper(_922){
this.m_oCDManager=_922;
};
ReportContextHelper.prototype.destroy=function(){
if(this.m_oCDManager&&this.m_oCDManager.destroy){
this.m_oCDManager.destroy();
}
delete this.m_oCDManager;
};
ReportContextHelper.prototype.processCtx=function(sCtx){
var _924=sCtx.split("::");
var _925=[];
for(var i=0;i<_924.length;++i){
_925[i]=_924[i].split(":");
}
if(_925&&_925.length&&_925[0].length){
return _925;
}else{
return null;
}
};
ReportContextHelper.prototype.getDataItemName=function(sCtx){
var _928=this.processCtx(sCtx);
if(_928){
return this.getRefDataItem(_928[0][0]);
}
return null;
};
ReportContextHelper.prototype.getRefDataItem=function(_929){
var _92a=this.m_oCDManager.GetRDIValue(_929);
return (_92a==null)?"":_92a;
};
ReportContextHelper.prototype.getMun=function(_92b){
var aCtx=null;
if(typeof _92b==="string"){
aCtx=this.processCtx(_92b);
}else{
if(typeof _92b==="number"){
aCtx=this.processCtx(_92b.toString());
}else{
aCtx=_92b;
}
}
if(aCtx){
var sMun=this.m_oCDManager.GetMUN(aCtx[0][0]);
return (sMun==null)?"":sMun;
}
return "";
};
function CCDManager(cv){
this.m_cd=null;
this.m_md=null;
this.m_oCV=null;
this.m_dataItemInfo=null;
};
CCDManager.prototype.SetContextData=function(CD){
if(this.m_cd){
this.m_cd=null;
}
this.m_cd=CD;
};
CCDManager.prototype.SetMetadata=function(MD){
if(this.m_md){
this.m_md=null;
}
this.m_md=MD;
};
CCDManager.prototype.AddContextData=function(CD){
if(!this.m_cd){
this.m_cd=CD;
}else{
for(var i in CD){
this.m_cd[i]=CD[i];
}
}
};
CCDManager.prototype.AddMetadata=function(MD){
if(!this.m_md){
this.m_md=MD;
}else{
for(var j in MD){
this.m_md[j]=MD[j];
}
}
};
CCDManager.prototype.getClonedMetadataArray=function(){
var _935={};
applyJSONProperties(_935,this.m_md);
return _935;
};
CCDManager.prototype.getClonedContextdataArray=function(){
var _936={};
applyJSONProperties(_936,this.m_cd);
return _936;
};
CCDManager.prototype.SetCognosViewer=function(_937){
if(_937){
this.m_oCV=_937;
}
};
CCDManager.prototype.onComplete_GetCDRequest=function(_938,_939){
if(_938){
var _93a=_938.getResult();
var _93b=XMLBuilderLoadXMLFromString(_93a);
if(_93b){
var _93c=_93b.getElementsByTagName("Block");
for(var i=0;i<_93c.length;i++){
var _93e="";
var _93f=_93c[i].firstChild;
while(_93f){
_93e+=_93f.nodeValue;
_93f=_93f.nextSibling;
}
var cd=eval("("+_93e+")");
this.AddContextData(cd);
}
}
}
if(_939&&typeof _939=="function"){
_939();
}
};
CCDManager.prototype.FetchContextData=function(_941,_942){
var _943=[];
var c=null,_945=_941.length;
for(var i=0;i<_945;++i){
c=_941[i];
if(c!=""&&!this.ContextIdExists(c)){
_943.push(c);
}
}
if(_943.length){
if(this.m_oCV){
this.getContextData(_943,_942);
}
}
return _943.length;
};
CCDManager.prototype.getContextData=function(_947,_948){
var oCV=this.m_oCV;
var _94a=new AsynchDataDispatcherEntry(oCV);
_94a.setCanBeQueued(false);
if(!oCV.isBux){
_94a.forceSynchronous();
}
var form=document["formWarpRequest"+oCV.getId()];
var _94c=oCV.getConversation();
var _94d=oCV.getTracking();
if(!_94d&&form&&form["m_tracking"]&&form["m_tracking"].value){
_94d=form["m_tracking"].value;
}
if(oCV.m_viewerFragment){
var _94e=oCV.getActiveRequest();
if(_94e&&_94e.getFormField("m_tracking")==_94d){
return;
}
}
var _94f={customArguments:[_948],"complete":{"object":this,"method":this.onComplete_GetCDRequest}};
if(oCV.getStatus()=="prompting"){
_94f["prompting"]={"object":this,"method":this.onComplete_GetCDRequest};
}
_94a.setCallbacks(_94f);
if(_94c&&oCV.envParams["ui.action"]!="view"){
_94a.addFormField("ui.action","getContext");
_94a.addFormField("ui.conversation",_94c);
}else{
var _950=form["ui.object"];
if(typeof _950.length!="undefined"&&_950.length>1){
_94a.addFormField("ui.object",form["ui.object"][0].value);
}else{
_94a.addFormField("ui.object",form["ui.object"].value);
}
_94a.addFormField("ui.action","getObjectContext");
}
_94a.addFormField("cv.responseFormat","asynchDetailContext");
_94a.addFormField("context.format","initializer");
_94a.addFormField("context.type","reportService");
_94a.addFormField("context.selection",_947.join(","));
_94a.addNonEmptyStringFormField("m_tracking",_94d);
oCV.dispatchRequest(_94a);
};
CCDManager.prototype.ContextIdExists=function(_951){
return (this.m_cd&&this.m_cd[_951]?true:false);
};
CCDManager.prototype.HasContextData=function(){
return (this.m_cd?true:false);
};
CCDManager.prototype.HasMetadata=function(){
return (this.m_md?true:false);
};
CCDManager.prototype._getMDPropertyFromCD=function(_952,_953,_954){
var p=null;
this.FetchContextData([_952]);
var cd=this.m_cd&&this.m_cd[_952];
if(cd){
var md=this.m_md[cd[_953]];
if(md){
p=md[_954];
}
}
return p;
};
CCDManager.prototype.GetDrillFlag=function(_958){
return this._getMDPropertyFromCD(_958,"r","drill");
};
CCDManager.prototype.getModelPathFromBookletItem=function(_959){
var mp=null;
var md=this.m_md[_959];
if(md){
mp=md.mp;
if(mp&&this.m_md[mp]){
mp=this.m_md[mp].mp;
}
}
return mp?mp:null;
};
CCDManager.prototype.GetBookletModelBasedDrillThru=function(_95c){
var p=null;
var md=this.m_md[_95c];
if(md){
p=md.modelBasedDrillThru;
}
return p?p:0;
};
CCDManager.prototype.GetDrillFlagForMember=function(_95f){
var _960=null;
var d=this._getMDPropertyFromCD(_95f,"r","drill");
if(d!==null&&this.m_cd[_95f].m){
_960=d;
}
return _960;
};
CCDManager.prototype.GetDataType=function(_962){
return this._getMDPropertyFromCD(_962,"r","dtype");
};
CCDManager.prototype.GetUsage=function(_963){
return this._getMDPropertyFromCD(_963,"r","usage");
};
CCDManager.prototype.GetHUN=function(_964){
var hun=this._getMDPropertyFromCD(_964,"h","h");
if(!hun){
var h=this._getMDPropertyFromCD(_964,"r","h");
if(h){
hun=this.m_md[h].h;
}
}
if(hun!=null&&hun.indexOf("[__ns_")==0){
hun=null;
}
return hun;
};
CCDManager.prototype.GetQuery=function(_967){
var qry=null;
var q=this._getMDPropertyFromCD(_967,"r","q");
if(q){
qry=this.m_md[q].q;
}
return qry;
};
CCDManager.prototype.GetDepth=function(_96a){
return this._getMDPropertyFromCD(_96a,"r","level");
};
CCDManager.prototype.GetDisplayValue=function(_96b){
var _96c=null;
this.FetchContextData([_96b]);
if(this.ContextIdExists(_96b)&&this.m_cd[_96b]){
_96c=this.m_cd[_96b].u;
}
return _96c;
};
CCDManager.prototype.GetPUN=function(_96d){
return this._getMDPropertyFromCD(_96d,"p","p");
};
CCDManager.prototype.GetLUN=function(_96e){
return this._getMDPropertyFromCD(_96e,"l","l");
};
CCDManager.prototype.GetMUN=function(_96f){
return this._getMDPropertyFromCD(_96f,"m","m");
};
CCDManager.prototype.GetDUN=function(_970){
return this._getMDPropertyFromCD(_970,"d","d");
};
CCDManager.prototype.GetQMID=function(_971){
return this._getMDPropertyFromCD(_971,"i","i");
};
CCDManager.prototype.GetRDIValue=function(_972){
return this._getMDPropertyFromCD(_972,"r","r");
};
CCDManager.prototype.GetBIValue=function(_973){
return this._getMDPropertyFromCD(_973,"r","bi");
};
CCDManager.prototype.getContextIdForMetaData=function(lun,hun,_976){
var _977=[{"expression":lun,"type":"l"},{"expression":hun,"type":"h"}];
for(var _978=0;_978<_977.length;++_978){
var _979=_977[_978].expression;
var _97a=_977[_978].type;
if(_979==""){
continue;
}
for(var _97b in this.m_md){
if(this.m_md[_97b][_97a]==_979){
for(var _97c in this.m_md){
if(this.m_md[_97c].r&&this.m_md[_97c][_97a]==_97b){
if(this.m_md[_97c].drill!=0||_976==true){
for(var ctx in this.m_cd){
if(this.m_cd[ctx].r==_97c&&this.m_cd[ctx].m){
return ctx;
}
}
}
}
}
}
}
}
return "";
};
CCDManager.prototype.GetContextIdForMUN=function(mun){
var _97f=null;
var _980=null;
for(var i in this.m_md){
if(this.m_md[i].m==mun){
_97f=i;
break;
}
}
if(_97f!=null){
for(var j in this.m_cd){
if(this.m_cd[j].m==_97f){
_980=j;
break;
}
}
}
return _980;
};
CCDManager.prototype.GetContextIdsForRDI=function(rdi){
var _984=[];
for(var i in this.m_md){
if(this.m_md[i].r==rdi){
_984.push(i);
}
}
return _984;
};
CCDManager.prototype.getMUNForRDIAndUseValue=function(rdi,_987){
var _988=this.GetContextIdsForRDI(rdi);
for(var i in this.m_cd){
for(var j in _988){
if(this.m_cd[i].r==_988[j]&&this.m_cd[i].u==_987){
var _98b=this.m_cd[i].m;
if(_98b){
return this.m_md[_98b].m;
}
}
}
}
return null;
};
CCDManager.prototype.GetPageMinMaxForRDI=function(rdi){
var _98d=null;
var _98e=null;
var _98f=this.GetContextIdsForRDI(rdi);
this.FetchContextData([0]);
for(var i in this.m_cd){
for(var j in _98f){
if(this.m_cd[i].r==_98f[j]){
var _992=parseFloat(this.m_cd[i].u);
if(_992==this.m_cd[i].u){
if(_98d==null||_992<_98d){
_98d=_992;
}
if(_98e==null||_992>_98e){
_98e=_992;
}
}
}
}
}
if(_98d!=null&&_98e!=null){
return eval("({ pageMin: "+_98d+", pageMax: "+_98e+"})");
}
};
CCDManager.prototype.GetContextIdForDisplayValue=function(_993){
var _994=null;
for(var i in this.m_cd){
if(this.m_cd[i].u==_993){
_994=i;
break;
}
}
return _994;
};
CCDManager.prototype.GetContextIdForUseValue=function(_996){
var _997=null;
var _998=null;
var _999=null;
for(var i in this.m_md){
var md=this.m_md[i];
for(var j in md){
if(md[j]==_996){
_997=i;
_998=j;
break;
}
}
}
if(_997!=null){
for(var k in this.m_cd){
if(this.m_cd[k][_998]==_997){
_999=k;
break;
}
}
}
return _999;
};
CCDManager.prototype.getDataItemInfo=function(){
if(this.m_cd){
var _99e={};
this.m_dataItemInfo={};
for(var i in this.m_cd){
var _9a0=this.m_cd[i].r;
if(typeof _9a0!="undefined"){
var _9a1=this.m_md[_9a0].r;
if(this.m_dataItemInfo[_9a1]==null){
this.m_dataItemInfo[_9a1]=1;
}else{
this.m_dataItemInfo[_9a1]++;
}
}
}
return CViewerCommon.toJSON(this.m_dataItemInfo);
}
return "";
};
CCDManager.prototype.DataItemInfoToJSON=function(){
return this.getDataItemInfo();
};
CCDManager.prototype.MetadataToJSON=function(){
if(this.m_md){
return CViewerCommon.toJSON(this.m_md);
}
return "";
};
CCDManager.prototype.ContextDataToJSON=function(){
if(this.m_cd){
return CViewerCommon.toJSON(this.m_cd);
}
return "";
};
CCDManager.prototype.ContextDataSubsetToJSON=function(_9a2){
if(_9a2<=0){
return this.ContextDataToJSON();
}
if(this.m_cd){
var _9a3={};
var _9a4={};
for(var i in this.m_cd){
var _9a6=this.m_cd[i].r;
if(typeof _9a6!="undefined"){
if(_9a3[_9a6]==null){
_9a3[_9a6]=0;
}else{
_9a3[_9a6]++;
}
if(_9a3[_9a6]<_9a2){
_9a4[i]=this.m_cd[i];
}
}
}
return CViewerCommon.toJSON(_9a4);
}
return "";
};
CCDManager.prototype.GetHUNForRDI=function(rdi,_9a8){
for(var i in this.m_md){
if(this.m_md[i].r==rdi&&this.m_md[i].q==_9a8){
var _9aa=this.m_md[i].h;
if(_9aa){
return this.m_md[_9aa].h;
}
}
}
return null;
};
CCDManager.prototype.GetMetadataIdForQueryName=function(_9ab){
for(var i in this.m_md){
if(this.m_md[i].q===_9ab){
return i;
}
}
return null;
};
CCDManager.prototype._isEmptyObject=function(obj){
for(var _9ae in obj){
return false;
}
return true;
};
CCDManager.prototype.isMetadataEmpty=function(){
if(this.m_md){
return this._isEmptyObject(this.m_md);
}
return true;
};
CCDManager.prototype.GetBestPossibleItemName=function(_9af){
var item=this.m_cd[_9af];
if(!item){
return null;
}
if(item.l&&this.m_md[item.l].l){
return this._getStringInLastBracket(this.m_md[item.l].l);
}
if(item.r&&this.m_md[item.r].r){
return this._getStringInLastBracket(this.m_md[item.r].r);
}
if(item.h&&this.m_md[item.h].h){
return this._getStringInLastBracket(this.m_md[item.h].h);
}
if(item.i&&this.m_md[item.i].i){
return this._getStringInLastBracket(this.m_md[item.i].i);
}
return null;
};
CCDManager.prototype.GetBestPossibleDimensionMeasureName=function(_9b1){
var item=this.m_cd[_9b1];
if(item&&item.m&&this.m_md[item.m]&&this.m_md[item.m].m){
return this._getStringInLastBracket(this.m_md[item.m].m);
}
return null;
};
CCDManager.prototype._getStringInLastBracket=function(str){
if(str&&str.indexOf("].[")>0){
var _9b4=str.split("].[");
var _9b5=_9b4[_9b4.length-1];
return _9b5.substring(0,_9b5.length-1);
}
return str;
};
CCDManager.prototype._replaceNamespaceForSharedTM1DimensionOnly=function(_9b6){
var _9b7=this._getNamespaceAndDimensionFromUniqueName(_9b6);
if(_9b7&&this.m_md){
for(var _9b8 in this.m_md){
var sMun=this.m_md[_9b8].m;
if(sMun&&sMun.length>0){
if(sMun.indexOf("->:[TM].")>0){
var oObj=this._getNamespaceAndDimensionFromUniqueName(sMun);
if(oObj.dimension&&oObj.dimension===_9b7.dimension&&oObj.namespace!==_9b7.namespace){
var _9bb=_9b6.indexOf(".");
return oObj.namespace+_9b6.substr(_9bb,_9b6.length);
}
}else{
var _9bc=sMun.indexOf("->:[");
if(_9bc>0){
if(sMun.substr(_9bc+4,4)!=="TM]."){
return _9b6;
}
}
}
}
}
}
return _9b6;
};
CCDManager.prototype._getNamespaceAndDimensionFromUniqueName=function(_9bd){
if(_9bd&&_9bd.length>0&&_9bd.indexOf("].[")>0){
var _9be=_9bd.split("].[");
if(_9be.length>1){
return {"namespace":_9be[0]+"]","dimension":"["+_9be[1]+"]"};
}
}
return null;
};
CCDManager.prototype.destroy=function(){
delete this.m_cd;
delete this.m_md;
delete this.m_oCV;
delete this.m_dataItemInfo;
};
function CSelectionXml(_9bf,_9c0,_9c1){
this.queries={};
this.burstContext=_9bf||"";
this.expressionLocale=_9c0||"";
this.contentLocale=_9c1||"";
};
function SC_SingleSelection(){
this.rows=[];
this.cols=[];
this.sections=[];
this.measures=[];
this.layoutElementId="";
};
function SC_SingleQuery(){
this.selections=[];
this.slicers=[];
this.filters=[];
};
function SC_SingleSlicer(){
};
function SC_SingleDetailFilter(){
};
function SC_SingleSummaryFilter(){
};
CSelectionXml.prototype.BuildSelectionFromController=function(sc){
if(sc){
var _9c3=sc.getAllSelectedObjects();
for(var s=0;s<_9c3.length;++s){
var _9c5=_9c3[s];
var _9c6=_9c5.getSelectedContextIds();
var muns=_9c5.getMuns();
var _9c8=muns.length;
var _9c9=new SC_SingleSelection();
_9c9.layoutElementId=_9c5.getLayoutElementId();
var _9ca=null;
for(var i=0;i<_9c8;++i){
var j,_9cd,_9ce;
if(i===0&&_9c8===1){
for(j=0;j<muns[i].length;++j){
_9cd=_9c6[i][j];
if(_9cd!=0){
if(j===0){
_9ca=sc.getRefQuery(_9cd);
_9ce=_9c5.getDisplayValues()[j];
this._buildMeasureSelection(sc,_9cd,_9c9.measures,_9ce,j,_9c5.getLayoutType());
}else{
if(sc.getUsageInfo(_9cd)!=2){
this._buildEdgeSelection(sc,_9cd,_9c9.cols,j);
}
}
}
}
}else{
for(j=0;j<muns[i].length;++j){
_9cd=_9c6[i][j];
if(_9cd!=0){
if(i===0){
_9ce=_9c5.getDisplayValues()[j];
_9ca=sc.getRefQuery(_9cd);
this._buildMeasureSelection(sc,_9cd,_9c9.measures,_9ce,j,_9c5.getLayoutType());
}else{
if(i===1){
this._buildEdgeSelection(sc,_9cd,_9c9.rows,j);
}else{
if(i===2){
this._buildEdgeSelection(sc,_9cd,_9c9.cols,j);
}else{
this._buildSectionSelection(sc,_9cd,_9c9.sections,j);
}
}
}
}
}
}
}
this.AddSelection(_9ca,_9c9);
}
}
};
CSelectionXml.prototype.AddSelection=function(_9cf,_9d0){
if(!this.queries[_9cf]){
this.queries[_9cf]=new SC_SingleQuery();
}
this.queries[_9cf].selections.push(_9d0);
};
CSelectionXml.prototype._buildMeasureSelection=function(sc,_9d2,_9d3,_9d4,idx,_9d6){
if(_9d6==""||_9d6==null){
_9d6="datavalue";
}
if(_9d2){
_9d3.push({name:sc.getRefDataItem(_9d2),values:[{use:sc.getUseValue(_9d2),display:_9d4}],order:idx,hun:sc.getHun(_9d2),dataType:_9d6,usage:sc.getUsageInfo(_9d2),dtype:sc.getDataType(_9d2),selection:"true"});
}
};
CSelectionXml.prototype._buildEdgeSelection=function(sc,_9d8,_9d9,idx){
if(_9d8){
_9d9.push({name:sc.getRefDataItem(_9d8),values:[{use:this.getUseValue(sc,_9d8),display:sc.getDisplayValue(_9d8)}],order:idx,lun:sc.getLun(_9d8),hun:sc.getHun(_9d8),dataType:"columnTitle",usage:sc.getUsageInfo(_9d8),dtype:sc.getDataType(_9d8)});
}
};
CSelectionXml.prototype._buildSectionSelection=function(sc,_9dc,_9dd,idx){
if(_9dc){
_9dd.push({name:sc.getRefDataItem(_9dc),values:[{use:this.getUseValue(sc,_9dc),display:sc.getDisplayValue(_9dc)}],order:idx,lun:sc.getLun(_9dc),hun:sc.getHun(_9dc),dataType:"section",usage:sc.getUsageInfo(_9dc),dtype:sc.getDataType(_9dc),queryRef:sc.getRefQuery(_9dc)});
}
};
CSelectionXml.prototype.getUseValue=function(sc,_9e0){
var _9e1=sc.getMun(_9e0);
if(_9e1==""){
_9e1=sc.getUseValue(_9e0);
}
return _9e1;
};
CSelectionXml.prototype.toXml=function(){
var _9e2=XMLBuilderCreateXMLDocument("selections");
var _9e3=_9e2.documentElement;
XMLBuilderSetAttributeNodeNS(_9e3,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
XMLBuilderSetAttributeNodeNS(_9e3,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
XMLBuilderSetAttributeNodeNS(_9e3,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
XMLBuilderSetAttributeNodeNS(_9e3,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
XMLBuilderSetAttributeNodeNS(_9e3,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_9e3.setAttribute("contentLocale",this.contentLocale);
_9e3.setAttribute("expressionLocale",this.expressionLocale);
for(var q in this.queries){
this._queryToXml(_9e3,q,this.queries[q]);
}
this._burstToXml(_9e3);
return XMLBuilderSerializeNode(_9e2);
};
CSelectionXml.prototype._queryToXml=function(_9e5,name,obj){
var _9e8=_9e5.ownerDocument.createElement("query");
_9e8.setAttribute("name",name);
for(var _9e9=0;_9e9<obj.selections.length;++_9e9){
this._selectionToXml(_9e8,obj.selections[_9e9]);
}
for(var _9ea=0;_9ea<obj.slicers.length;++_9ea){
this._slicersToXml(_9e8,obj.slicers[_9ea]);
}
for(var _9eb=0;_9eb<obj.selections.length;++_9eb){
this._filtersToXml(_9e8,obj.selections[_9eb]);
}
_9e5.appendChild(_9e8);
};
CSelectionXml.prototype._selectionToXml=function(_9ec,_9ed){
var doc=_9ec.ownerDocument;
var _9ef=doc.createElement("selection");
_9ec.appendChild(_9ef);
this._edgeToXml(_9ef,"row",_9ed.rows);
this._edgeToXml(_9ef,"column",_9ed.cols);
this._edgeToXml(_9ef,"measure",_9ed.measures);
this._edgeToXml(_9ef,"section",_9ed.sections);
var _9f0=doc.createElement("layoutElementId");
_9f0.appendChild(doc.createTextNode(_9ed.layoutElementId));
_9ef.appendChild(_9f0);
};
CSelectionXml.prototype._edgeToXml=function(_9f1,_9f2,_9f3){
var doc=_9f1.ownerDocument;
var _9f5=doc.createElement(_9f2+"s");
_9f1.appendChild(_9f5);
for(var i=0;i<_9f3.length;++i){
var _9f7=doc.createElement(_9f2);
_9f5.appendChild(_9f7);
var edge=_9f3[i];
for(var j in edge){
if(j!=="name"&&j!=="values"){
_9f7.setAttribute(j,edge[j]!==null?edge[j]:"");
}
}
this._itemToXml(_9f7,edge.name,edge.values);
}
};
CSelectionXml.prototype._itemToXml=function(_9fa,name,_9fc){
var doc=_9fa.ownerDocument;
var _9fe=doc.createElement("item");
XMLBuilderSetAttributeNodeNS(_9fe,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
var _9ff=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",doc);
XMLBuilderSetAttributeNodeNS(_9ff,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_9ff.appendChild(doc.createTextNode(name));
_9fe.appendChild(_9ff);
var _a00=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",doc);
XMLBuilderSetAttributeNodeNS(_a00,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
XMLBuilderSetAttributeNodeNS(_a00,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
_9fe.appendChild(_a00);
for(var j=0;j<_9fc.length;j++){
var _a02=doc.createElement("item");
XMLBuilderSetAttributeNodeNS(_a02,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
var _a03=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",doc);
XMLBuilderSetAttributeNodeNS(_a03,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
if(_9fc[j].use){
_a03.appendChild(doc.createTextNode(_9fc[j].use));
}else{
if(_9fc[j].display){
_a03.appendChild(doc.createTextNode(_9fc[j].display));
}else{
_a03.appendChild(doc.createTextNode(""));
}
}
var _a04=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",doc);
XMLBuilderSetAttributeNodeNS(_a04,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
if(_9fc[j].display){
_a04.appendChild(doc.createTextNode(_9fc[j].display));
}else{
_a04.appendChild(doc.createTextNode(""));
}
_a02.appendChild(_a03);
_a02.appendChild(_a04);
_a00.appendChild(_a02);
}
_9fa.appendChild(_9fe);
};
CSelectionXml.prototype._burstToXml=function(_a05){
var doc=_a05.ownerDocument;
var _a07=doc.createElement("burst-context");
_a07.appendChild(doc.createTextNode(this.burstContext));
_a05.appendChild(_a07);
};
CSelectionXml.prototype._slicersToXml=function(_a08,_a09){
};
CSelectionXml.prototype._filtersToXml=function(_a0a,_a0b){
};
var GUtil={};
GUtil.createHiddenForm=function(name,_a0d,_a0e,_a0f){
var form=document.getElementById(name);
if(form){
document.body.removeChild(form);
}
form=document.createElement("form");
form.id=name;
form.name=name;
form.method=_a0d;
form.style.display="none";
form.action=document.forms["formWarpRequest"+_a0e].action;
form.target=_a0f+(new Date()).getTime();
document.body.appendChild(form);
return form;
};
GUtil.createFormField=function(el,name,_a13){
var _a14=document.createElement("input");
_a14.type="hidden";
_a14.name=name;
_a14.value=_a13;
el.appendChild(_a14);
};
GUtil.generateCallback=function(func,_a16,_a17){
if(func){
var _a18=_a17||this;
_a16=(_a16 instanceof Array)?_a16:[];
return (function(_a19){
if(typeof _a19!="undefined"&&_a16.length==0){
_a16.push(_a19);
}
return func.apply(_a18,_a16);
});
}else{
return (function(){
});
}
};
GUtil.destroyProperties=function(_a1a,_a1b){
var _a1c;
if(_a1a instanceof Array){
for(var i=0;i<_a1a.length;i++){
_a1c=_a1a[i];
if(_a1c instanceof String){
_a1c=null;
}else{
if(_a1c&&_a1c.destroy&&!_a1c._beingDestroyed){
_a1c.destroy();
}
GUtil.destroyProperties(_a1c);
}
}
}else{
if(_a1a instanceof Object){
if(_a1a._beingDestroyed){
return;
}
var obj=_a1a;
obj._beingDestroyed=true;
for(var _a1f in obj){
_a1c=obj[_a1f];
if(_a1f==="_beingDestroyed"||_a1f==="m_destroyed"||_a1f==="_destroyed"||typeof _a1c=="function"){
continue;
}
if(_a1c instanceof Array){
GUtil.destroyProperties(_a1c);
}else{
if(_a1c instanceof Object){
if(typeof _a1c.destroy=="function"&&!_a1c._destroyed&&(_a1c!==CCognosViewer||_a1b)){
_a1c.destroy();
}
}
}
delete obj[_a1f];
}
}
}
};
cvLoadDialog=function(_a20,_a21,_a22,_a23,_a24){
var _a25=document.getElementById("formWarpRequest"+_a20.getId());
if(_a25&&_a20){
_a20.getWorkingDialog().hide();
var _a26="";
var _a27="";
var _a28=null;
if(_a20.isAccessibleMode()){
_a26="winNAT_"+(new Date()).getTime();
_a27=_a20.getWebContentRoot()+"/"+"rv/blankNewWin.html?cv.id="+this.getCVId();
}else{
var _a29=document.body;
_a28=new CModal("","",_a29,null,null,_a23,_a22,true,true,false,true,_a20.getWebContentRoot());
if(typeof _a24=="string"){
document.getElementById(CMODAL_CONTENT_ID).setAttribute("title",_a24);
}
document.getElementById(CMODAL_BACK_IFRAME_ID).setAttribute("title",RV_RES.IDS_JS_MODAL_BACK_IFRAME);
_a26=CMODAL_CONTENT_ID;
}
var _a2a=document.createElement("FORM");
_a2a.method="POST";
_a2a.action=_a20.getGateway();
_a2a.target=_a26;
_a2a.style.margin="0px";
document.body.appendChild(_a2a);
for(var _a2b in _a21){
_a2a.appendChild(createHiddenFormField(_a2b,_a21[_a2b]));
}
_a2a.appendChild(createHiddenFormField("cv.id",_a20.getId()));
_a2a.appendChild(createHiddenFormField("b_action","xts.run"));
_a2a.appendChild(createHiddenFormField("ui.action",_a25["ui.action"].value));
_a2a.appendChild(createHiddenFormField("ui.object",_a25["ui.object"].value));
if(typeof _a20.rvMainWnd!="undefined"){
_a2a.appendChild(createHiddenFormField("run.outputFormat",_a20.rvMainWnd.getCurrentFormat()));
}
if(typeof _a25["run.outputLocale"]!="undefined"){
_a2a.appendChild(createHiddenFormField("run.outputLocale",_a25["run.outputLocale"].value));
}
if(typeof _a2a["backURL"]=="undefined"&&typeof _a2a["ui.backURL"]=="undefined"&&typeof _a25["ui.backURL"]!="undefined"){
_a2a.appendChild(createHiddenFormField("ui.backURL",_a25["ui.backURL"].value));
}
if(typeof _a20!="undefined"&&typeof _a20.getConversation!="undefined"&&typeof _a20.getTracking!="undefined"){
_a2a.appendChild(createHiddenFormField("ui.conversation",_a20.getConversation()));
_a2a.appendChild(createHiddenFormField("m_tracking",_a20.getTracking()));
if(_a20.envParams["ui.name"]!="undefined"){
_a2a.appendChild(createHiddenFormField("ui.name",_a20.envParams["ui.name"]));
}
}
var _a2c=window.onbeforeunload;
window.onbeforeunload=null;
if(_a20.isAccessibleMode()){
window.open(_a27,_a26,"rv");
_a2a.submit();
}else{
_a2a.submit();
_a28.show();
}
window.onbeforeunload=_a2c;
document.body.removeChild(_a2a);
_a20.modalShown=true;
}
};
function createHiddenFormField(name,_a2e){
var _a2f=document.createElement("input");
_a2f.setAttribute("type","hidden");
_a2f.setAttribute("name",name);
_a2f.setAttribute("id",name);
_a2f.setAttribute("value",_a2e);
return (_a2f);
};
function isAuthenticationFault(_a30){
if(_a30!=null){
var _a31=XMLHelper_FindChildByTagName(_a30,"CAM",true);
return (_a31!=null&&XMLHelper_FindChildByTagName(_a31,"promptInfo",true)!=null);
}
};
function processAuthenticationFault(_a32,_a33){
if(isAuthenticationFault(_a32)){
launchLogOnDialog(_a33,_a32);
return true;
}
return false;
};
function isObjectEmpty(_a34){
for(var _a35 in _a34){
if(_a34.hasOwnProperty(_a35)){
return false;
}
}
return true;
};
function launchLogOnDialog(cvID,_a37){
try{
var oCV=getCognosViewerObjectRef(cvID);
var _a39={"b_action":"xts.run","m":"portal/close.xts","h_CAM_action":"logonAs"};
if(_a37!=null){
var _a3a=XMLHelper_FindChildrenByTagName(_a37,"namespace",true);
if(_a3a!=null){
for(var _a3b=0;_a3b<_a3a.length;++_a3b){
var _a3c=_a3a[_a3b];
if(_a3c!=null){
var _a3d=XMLHelper_FindChildByTagName(_a3c,"name",false);
var _a3e=XMLHelper_FindChildByTagName(_a3c,"value",false);
if(_a3d!=null&&_a3e!=null){
var _a3f=XMLHelper_GetText(_a3d);
var _a40=XMLHelper_GetText(_a3e);
if(_a3f!=null&&_a3f.length>0){
_a39[_a3f]=_a40;
}
}
}
}
}
}
cvLoadDialog(oCV,_a39,540,460);
}
catch(exception){
}
};
function getCVWaitingOnFault(){
var oCV=null;
for(var _a42=0;_a42<window.gaRV_INSTANCES.length;_a42++){
if(window.gaRV_INSTANCES[_a42].getRetryDispatcherEntry()!=null){
oCV=window.gaRV_INSTANCES[_a42];
break;
}
}
return oCV;
};
function ccModalCallBack(_a43,data){
var oCV=getCVWaitingOnFault();
destroyCModal();
if(typeof HiddenIframeDispatcherEntry=="function"&&HiddenIframeDispatcherEntry.hideIframe){
var oCV=window.gaRV_INSTANCES[0];
if(oCV){
HiddenIframeDispatcherEntry.hideIframe(oCV.getId());
}
}
if(oCV!=null){
if(typeof _a43!="undefined"&&_a43=="ok"){
var _a46=oCV.getRetryDispatcherEntry();
if(_a46){
_a46.retryRequest();
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
function getCrossBrowserNode(evt,_a49){
var node=null;
if(_a49&&evt.explicitOriginalTarget){
node=evt.explicitOriginalTarget;
}else{
if(evt.originalTarget){
node=evt.originalTarget;
}else{
if(evt.target){
node=evt.target;
}else{
if(evt.srcElement){
node=evt.srcElement;
}
}
}
}
try{
if(node&&node.nodeType==3){
node=node.parentNode;
}
}
catch(ex){
}
return node;
};
function getNodeFromEvent(evt,_a4c){
var node=getCrossBrowserNode(evt,true);
if(node&&node.getAttribute&&node.getAttribute("name")=="primarySelectionDiv"){
node=node.parentNode.firstChild;
}
if(node&&node.getAttribute&&node.getAttribute("flashChartContainer")=="true"){
node=node.firstChild;
}
if(node&&node.getAttribute&&node.getAttribute("chartContainer")=="true"&&node.childNodes){
for(var i=0;i<node.childNodes.length;i++){
if(node.childNodes[i].nodeName.toLowerCase()=="img"){
node=node.childNodes[i];
break;
}
}
}else{
if(!_a4c&&node&&node.nodeName&&node.nodeName.toLowerCase()=="img"&&node.getAttribute("rsvpChart")!="true"){
node=node.parentNode;
}
}
return node;
};
function getCtxNodeFromEvent(evt){
try{
var node=getCrossBrowserNode(evt);
var _a51=node.nodeName.toUpperCase();
if((_a51=="SPAN"||_a51=="AREA"||_a51=="IMG")&&node.getAttribute("ctx")!=null){
return node;
}else{
if(_a51=="SPAN"&&(node.parentNode.getAttribute("ctx")!=null)){
return node.parentNode;
}
}
}
catch(exception){
}
return null;
};
function getDocumentFromEvent(evt){
var node=getCrossBrowserNode(evt,true);
var _a54=node.document?node.document:node.ownerDocument;
return _a54;
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
var _a57=getNodeFromEvent(evt);
if(_a57&&_a57.nodeName){
var _a58=_a57.nodeName.toLowerCase();
if((_a58=="td"||_a58=="span")&&_a57.childNodes&&_a57.childNodes.length>0&&_a57.childNodes[0].className=="textItem"){
try{
_a57.childNodes[0].focus();
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
function replaceNewLine(_a5a){
var regX=/\r\n|\r|\n/g;
var _a5c="<br/>";
return _a5a.replace(regX,_a5c);
};
function xml_encode(_a5d){
var _a5e=""+_a5d;
if((_a5e=="0")||((_a5d!=null)&&(_a5d!=false))){
_a5e=_a5e.replace(/&/g,"&amp;");
_a5e=_a5e.replace(/</g,"&lt;");
_a5e=_a5e.replace(/>/g,"&gt;");
_a5e=_a5e.replace(/"/g,"&quot;");
_a5e=_a5e.replace(/'/g,"&apos;");
}else{
if(_a5d==null){
_a5e="";
}
}
return _a5e;
};
function xml_decodeParser(sAll,_a60){
var _a61=sAll;
switch(_a60){
case "amp":
_a61="&";
break;
case "lt":
_a61="<";
break;
case "gt":
_a61=">";
break;
case "quot":
_a61="\"";
break;
case "apos":
_a61="'";
break;
}
return _a61;
};
function xml_decode(_a62){
var _a63=""+_a62;
if((_a63=="0")||((_a62!=null)&&(_a62!=false))){
_a63=_a63.replace(/&(amp|lt|gt|quot|apos);/g,xml_decodeParser);
}else{
if(_a62==null){
_a63="";
}
}
return _a63;
};
function xpath_attr_encode(_a64){
var _a65=null;
if(_a64.indexOf("'")>=0&&_a64.indexOf("\"")>=0){
var _a66=_a64.split("\"");
_a65="concat(";
for(var i=0;i<_a66.length;++i){
if(i>0){
_a65+=",";
}
if(_a66[i].length>0){
_a65+=("\""+_a66[i]+"\"");
}else{
_a65+="'\"'";
}
}
_a65+=")";
}else{
if(_a64.indexOf("'")>=0){
_a65="\""+_a64+"\"";
}else{
_a65="'"+_a64+"'";
}
}
return _a65;
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
function cleanupVariable(_a6f){
if(typeof window[_a6f]!="undefined"&&window[_a6f]){
if(isIE()){
eval("delete "+_a6f);
}else{
delete window[_a6f];
}
}
};
function loadClass(_a70){
try{
var _a71=eval("new "+_a70+"();");
return _a71;
}
catch(e){
return null;
}
};
function getElementsByClassName(oElm,_a73,_a74){
var _a75=(_a73=="*"&&oElm.all)?oElm.all:oElm.getElementsByTagName(_a73);
var _a76=[];
var _a77=new RegExp("(^|\\s)"+_a74+"(\\s|$)");
var _a78=_a75.length;
for(var i=0;i<_a78;i++){
var _a7a=_a75[i];
if(_a77.test(_a7a.className)){
_a76.push(_a7a);
}
}
return _a76;
};
function getImmediateLayoutContainerId(node){
var _a7c=node;
while(_a7c!=null){
if(_a7c.getAttribute&&_a7c.getAttribute("lid")!=null){
return _a7c.getAttribute("lid");
}
_a7c=_a7c.parentNode;
}
return null;
};
function getChildElementsByAttribute(oElm,_a7e,_a7f,_a80){
return getDescendantElementsByAttribute(oElm,_a7e,_a7f,_a80,true);
};
function getElementsByAttribute(oElm,_a82,_a83,_a84,_a85,_a86){
return getDescendantElementsByAttribute(oElm,_a82,_a83,_a84,false,_a85,_a86);
};
function getDescendantElementsByAttribute(oElm,_a88,_a89,_a8a,_a8b,_a8c,_a8d){
var _a8e=[];
var _a8f=null;
if(typeof _a8d==="undefined"){
_a8f=(typeof _a8a!="undefined")?new RegExp("(^|\\s)"+_a8a+"(\\s|$)","i"):null;
}else{
_a8f=_a8d;
}
if(typeof _a88=="string"){
_a88=[_a88];
}
var _a90=(oElm?_a88.length:0);
for(var _a91=0;_a91<_a90;_a91++){
var _a92=null;
if(_a8b){
if(_a88[_a91]=="*"&&oElm.all){
_a92=oElm.childNodes;
}else{
_a92=[];
var _a93=oElm.childNodes;
for(var i=0;i<_a93.length;++i){
if(_a93[i].nodeName.toLowerCase()==_a88[_a91].toLowerCase()){
_a92.push(_a93[i]);
}
}
}
}else{
_a92=(_a88[_a91]=="*"&&oElm.all)?oElm.all:oElm.getElementsByTagName(_a88[_a91]);
}
var _a95=_a92.length;
for(var idx=0;idx<_a95;idx++){
var _a97=_a92[idx];
var _a98=_a97.getAttribute&&_a97.getAttribute(_a89);
if(_a98!==null){
var _a99=null;
if(typeof _a98==="number"){
_a99=String(_a98);
}else{
if(typeof _a98==="string"&&_a98.length>0){
_a99=_a98;
}
}
if(_a99!==null){
if(typeof _a8a=="undefined"||(_a8f&&_a8f.test(_a99))){
_a8e.push(_a97);
if(_a8c!=-1&&_a8e.length>_a8c){
return [];
}else{
if(_a8c==1&&_a8e.length==1){
return _a8e;
}
}
}
}
}
}
}
return _a8e;
};
function savedOutputDoneLoading(cvId,_a9b){
var oCV=window["oCV"+cvId];
var _a9d=(oCV&&oCV.getViewerWidget?oCV.getViewerWidget():null);
var _a9e=(_a9d?_a9d.getSavedOutput():null);
if(_a9e){
_a9e.outputDoneLoading();
}else{
if(_a9b<5){
_a9b++;
var _a9f=function(){
savedOutputDoneLoading(cvId,_a9b);
};
setTimeout(_a9f,100);
}
}
};
function getNavVer(){
var temp;
if(isIE()){
return getIEVersion();
}else{
temp=navigator.userAgent.split("/");
return parseFloat(temp[temp.length-1]);
}
};
function isSafari(){
return (navigator.userAgent.toLowerCase().indexOf("safari")!=-1);
};
function isIE(){
return (navigator.userAgent.indexOf("MSIE")!=-1||navigator.userAgent.indexOf("Trident")!=-1);
};
function getIEVersion(){
var _aa1=navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
return _aa1?parseFloat(_aa1[1]):null;
};
function isFF(){
return (navigator.userAgent.indexOf("Firefox")!=-1);
};
function isIOS(){
return navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("iPhone")!=-1;
};
function displayChart(_aa2,_aa3,_aa4,_aa5){
if(_aa3.length>1){
document.images[_aa2].src=_aa3;
}
};
function isFlashChartNode(evt){
var node=getNodeFromEvent(evt);
if(node!=null&&typeof node.getAttribute=="function"){
return node.getAttribute("flashChart")!=null;
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
var node=getNodeFromEvent(evt);
var _aab=node.getAttribute("viewerId");
if(!_aab){
_aab=node.parentNode.getAttribute("viewerId");
}
if(!_aab){
return;
}
var oCV=window["oCV"+_aab];
var _aad=oCV.getAction("Selection");
_aad.pageClicked(evt);
return stopEventBubble(evt);
};
function clientToScreenCoords(_aae,_aaf){
var _ab0=_aae;
var _ab1={topCoord:0,leftCoord:0};
while(_ab0!=null&&_ab0!=_aaf){
_ab1.topCoord+=_ab0.offsetTop;
_ab1.leftCoord+=_ab0.offsetLeft;
_ab0=_ab0.offsetParent;
}
return _ab1;
};
function getCurrentPosistionString(oCV,_ab3,_ab4){
var _ab5=RV_RES.IDS_JS_INFOBAR_ITEM_COUNT;
var _ab6=/\{0\}/;
var _ab7=/\{1\}/;
_ab5=_ab5.replace(_ab6,_ab3);
_ab5=" "+_ab5.replace(_ab7,_ab4)+" ";
return _ab5;
};
function applyJSONProperties(obj,_ab9){
for(property in _ab9){
if(typeof _ab9[property]=="object"&&!(_ab9[property] instanceof Array)){
if(typeof obj[property]=="undefined"){
obj[property]={};
}
applyJSONProperties(obj[property],_ab9[property]);
}else{
obj[property]=_ab9[property];
}
}
};
function CViewerCommon(){
};
CViewerCommon.openNewWindowOrTab=function(sURL,_abb){
return window.open(sURL,_abb);
};
CViewerCommon.toJSON=function(obj){
var type=typeof (obj);
if(type!="object"||type===null){
if(type==="string"){
obj="\""+obj+"\"";
}
return String(obj);
}else{
var _abe;
var prop;
var json=[];
var _ac1=(obj&&obj.constructor==Array);
for(_abe in obj){
prop=obj[_abe];
type=typeof (prop);
if(type==="string"){
prop="\""+prop+"\"";
}else{
if(type=="object"&&prop!==null){
prop=CViewerCommon.toJSON(prop);
}
}
json.push((_ac1?"":"\""+_abe+"\":")+String(prop));
}
return (_ac1?"[":"{")+String(json)+(_ac1?"]":"}");
}
};
function resizePinnedContainers(){
var oCV=window.gaRV_INSTANCES[0];
if(oCV&&!oCV.m_viewerFragment){
var _ac3=oCV.getPinFreezeManager();
if(_ac3&&_ac3.hasFrozenContainers()){
var _ac4=document.getElementById("RVContent"+oCV.getId());
var _ac5=document.getElementById("mainViewerTable"+oCV.getId());
var _ac6=_ac4.clientWidth;
var _ac7=_ac5.clientHeight;
_ac3.resize(_ac6,_ac7);
if(isIE()){
oCV.repaintDiv(_ac4);
}
}
}
};
function setWindowHref(url){
var _ac9=window.onbeforeunload;
window.onbeforeunload=null;
window.location.href=url;
window.onbeforeunload=_ac9;
};
CViewerCommon.getMessage=function(msg,args){
if(typeof args=="undefined"){
return msg;
}else{
if(typeof args=="string"){
msg=msg.replace("{0}",args);
}else{
if(args.length){
for(var i=0;i<args.length;++i){
msg=msg.replace("{"+i+"}",args[i]);
}
}else{
msg=msg.replace("{0}",args);
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
var _acd=gaRV_INSTANCES[0].isBidiEnabled();
if(_acd){
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
function enforceTextDir(_ace){
if(isViewerBidiEnabled()&&_ace){
var sDir=getViewerBaseTextDirection();
var _ad0=BidiUtils.getInstance();
if(sDir=="auto"){
sDir=_ad0.resolveStrBtd(_ace);
}
var _ad1=(!dojo._isBodyLtr())?_ad0.RLM:_ad0.LRM;
return _ad1+((sDir==="rtl")?_ad0.RLE:_ad0.LRE)+_ace+_ad0.PDF+_ad1;
}
return _ace;
};
function getElementDirection(_ad2){
var dir=null;
if(_ad2.currentStyle){
dir=_ad2.currentStyle.direction;
}else{
if(window.getComputedStyle){
var _ad4=window.getComputedStyle(_ad2,null);
if(_ad4){
dir=_ad4.getPropertyValue("direction");
}
}
}
if(dir){
dir=dir.toLowerCase();
}
return dir;
};
function getScrollLeft(_ad5){
if(getElementDirection(_ad5)==="rtl"&&isFF()){
return _ad5.scrollWidth-_ad5.offsetWidth+_ad5.scrollLeft;
}
return _ad5.scrollLeft;
};
function setScrollLeft(_ad6,_ad7){
if(getElementDirection(_ad6)==="rtl"&&isFF()){
_ad6.scrollLeft=_ad6.offsetWidth+_ad7-_ad6.scrollWidth;
}else{
_ad6.scrollLeft=_ad7;
}
};
function setScrollRight(_ad8,_ad9){
if(getElementDirection(_ad8)==="rtl"&&isFF()){
_ad8.scrollLeft=-_ad9;
}else{
_ad8.scrollLeft=_ad8.scrollWidth-_ad8.offsetWidth-_ad9;
}
};
function getBoxInfo(el,_adb){
if(!getBoxInfo.aStyles){
getBoxInfo.aStyles=[{name:"marginLeft",ie:"marginLeft",ff:"margin-left"},{name:"marginRight",ie:"marginRight",ff:"margin-right"},{name:"marginTop",ie:"marginTop",ff:"margin-top"},{name:"marginBottom",ie:"marginBottom",ff:"margin-bottom"},{name:"borderLeftWidth",ie:"borderLeftWidth",ff:"border-left-width"},{name:"borderRightWidth",ie:"borderRightWidth",ff:"border-right-width"},{name:"borderTopWidth",ie:"borderTopWidth",ff:"border-top-width"},{name:"borderBottomWidth",ie:"borderBottomWidth",ff:"border-bottom-width"},{name:"paddingLeft",ie:"paddingLeft",ff:"padding-left"},{name:"paddingRight",ie:"paddingRight",ff:"padding-right"},{name:"paddingTop",ie:"paddingTop",ff:"padding-top"},{name:"paddingBottom",ie:"paddingBottom",ff:"padding-bottom"}];
}
var _adc={};
var _add=null;
if(el.currentStyle){
_add=el.currentStyle;
}else{
if(window.getComputedStyle){
_add=window.getComputedStyle(el,null);
}
}
if(!_add){
return null;
}
for(i in getBoxInfo.aStyles){
var _ade=getBoxInfo.aStyles[i];
var size=null;
if(_add.getPropertyValue){
size=_add.getPropertyValue(_ade.ff);
}else{
size=_add[_ade.ie];
}
if(size&&_adb){
size=Number(size.replace("px",""));
}
_adc[_ade.name]=size;
}
return _adc;
};
function CSelectionMetadata(){
this.m_sContextId="";
this.m_sDataItem="";
this.m_sMetadataModelItem="";
this.m_sUseValue="";
this.m_sUseValueType="";
this.m_sType=null;
this.m_sDisplayValue="";
this.m_sUsage=null;
this.m_refQuery=null;
this.m_sHun=null;
this.m_sDun=null;
};
CSelectionMetadata.prototype.setContextId=function(_ae0){
this.m_sContextId=_ae0;
};
CSelectionMetadata.prototype.getContextId=function(){
return this.m_sContextId;
};
CSelectionMetadata.prototype.setRefQuery=function(_ae1){
this.m_refQuery=_ae1;
};
CSelectionMetadata.prototype.getRefQuery=function(){
return this.m_refQuery;
};
CSelectionMetadata.prototype.setDataItem=function(_ae2){
this.m_sDataItem=_ae2;
};
CSelectionMetadata.prototype.getDataItem=function(){
return this.m_sDataItem;
};
CSelectionMetadata.prototype.setMetadataModelItem=function(_ae3){
this.m_sMetadataModelItem=_ae3;
};
CSelectionMetadata.prototype.getMetadataModelItem=function(){
return this.m_sMetadataModelItem;
};
CSelectionMetadata.prototype.setUseValue=function(_ae4){
this.m_sUseValue=_ae4;
};
CSelectionMetadata.prototype.getUseValue=function(){
return this.m_sUseValue;
};
CSelectionMetadata.prototype.setUseValueType=function(_ae5){
this.m_sUseValueType=_ae5;
};
CSelectionMetadata.prototype.setType=function(_ae6){
this.m_sType=_ae6;
};
CSelectionMetadata.prototype.getType=function(){
var _ae7=null;
switch(this.m_sUseValueType){
case 25:
case 27:
case 30:
case 32:
_ae7="memberUniqueName";
break;
case 26:
_ae7="memberCaption";
break;
case 1:
case 55:
case 56:
_ae7="string";
break;
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
case 8:
case 9:
case 10:
case 11:
case 12:
case 16:
case 17:
case 18:
case 19:
case 20:
case 22:
case 21:
case 23:
case 24:
case 54:
_ae7=parseInt(this.m_sUseValueType,10);
break;
}
return _ae7;
};
CSelectionMetadata.prototype.getUseValueType=function(){
if(this.m_sType==null){
this.m_sType=this.getType();
}
return this.m_sType;
};
CSelectionMetadata.prototype.setDisplayValue=function(_ae8){
this.m_sDisplayValue=_ae8;
};
CSelectionMetadata.prototype.getDisplayValue=function(){
return this.m_sDisplayValue;
};
CSelectionMetadata.prototype.setUsage=function(_ae9){
this.m_sUsage=_ae9;
};
CSelectionMetadata.prototype.getUsage=function(){
if(this.m_sUsage=="2"){
return "measure";
}else{
return "nonMeasure";
}
};
CSelectionMetadata.prototype.setHun=function(sHun){
this.m_sHun=sHun;
};
CSelectionMetadata.prototype.getHun=function(){
return this.m_sHun;
};
CSelectionMetadata.prototype.setDun=function(sDun){
this.m_sDun=sDun;
};
CSelectionMetadata.prototype.getDun=function(){
return this.m_sDun;
};
function CSelectionMetadataIterator(_aec,_aed){
this.m_axisIndex=_aed;
this.m_index=0;
this.m_selectionObject=_aec;
};
CSelectionMetadataIterator.prototype.getSelectionAxis=function(){
var _aee=null;
if(typeof this.m_selectionObject=="object"&&this.m_axisIndex<this.m_selectionObject.getSelectedContextIds().length){
_aee=this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex];
}
return _aee;
};
CSelectionMetadataIterator.prototype.hasNext=function(){
var _aef=this.getSelectionAxis();
if(_aef!=null){
return (this.m_index<_aef.length);
}else{
return false;
}
};
CSelectionMetadataIterator.prototype.next=function(){
var _af0=null;
if(this.hasNext()){
_af0=new CSelectionMetadata();
_af0.setContextId(this.m_selectionObject.m_contextIds[this.m_axisIndex][this.m_index]);
_af0.setDataItem(this.m_selectionObject.getDataItems()[this.m_axisIndex][this.m_index]);
_af0.setMetadataModelItem(this.m_selectionObject.getMetadataItems()[this.m_axisIndex][this.m_index]);
if(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]!=null&&this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]!=""){
_af0.setUseValue(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]);
_af0.setType("memberUniqueName");
}else{
_af0.setUseValue(this.m_selectionObject.getUseValues()[this.m_axisIndex][this.m_index]);
}
if(typeof this.m_selectionObject.m_selectionController=="object"){
var _af1=this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex][this.m_index];
if(this.m_selectionObject.useDisplayValueFromObject){
_af0.setDisplayValue(this.m_selectionObject.getDisplayValues()[this.m_axisIndex]);
}else{
var _af2=null;
var _af3=null;
if(this.m_axisIndex===0){
var _af4=this.m_selectionObject.getCellRef();
if(_af4&&_af4.nodeName&&_af4.nodeName.toLowerCase()==="td"){
_af3=this.m_selectionObject.m_selectionController.getDisplayValueFromDOM(_af1,_af4.parentNode);
}
}
if(_af3==null){
_af3=this.m_selectionObject.m_selectionController.getDisplayValue(_af1);
}
if(_af3===""){
_af3=this.m_selectionObject.m_selectionController.getUseValue(_af1);
}
_af0.setDisplayValue(_af3);
}
_af0.setUseValueType(this.m_selectionObject.m_selectionController.getDataType(_af1));
_af0.setUsage(this.m_selectionObject.m_selectionController.getUsageInfo(_af1));
_af0.setRefQuery(this.m_selectionObject.m_selectionController.getRefQuery(_af1));
_af0.setHun(this.m_selectionObject.m_selectionController.getHun(_af1));
_af0.setDun(this.m_selectionObject.m_selectionController.getDun(_af1));
}
++this.m_index;
}
return _af0;
};
function CAxisSelectionIterator(_af5){
this.m_index=0;
this.m_selectionObject=_af5;
};
CAxisSelectionIterator.prototype.hasNext=function(){
return ((typeof this.m_selectionObject=="object")&&(this.m_index<this.m_selectionObject.getSelectedContextIds().length));
};
CAxisSelectionIterator.prototype.next=function(){
var _af6=null;
if(this.hasNext()){
_af6=new CSelectionMetadataIterator(this.m_selectionObject,this.m_index);
++this.m_index;
}
return _af6;
};
function getSelectionContextIds(_af7){
var _af8=[];
var _af9=_af7.getAllSelectedObjects();
if(_af9!=null&&_af9.length>0){
for(var _afa=0;_afa<_af9.length;++_afa){
var _afb=_af9[_afa];
var _afc=_afb.getSelectedContextIds();
var _afd=[];
for(var item=0;item<_afc.length;++item){
var _aff=_afc[item].join(":");
_afd.push(_aff);
}
_af8.push(_afd.join("::"));
}
}
return _af8;
};
function getViewerSelectionContext(_b00,_b01,_b02){
var _b03=_b02==true?_b00.getAllSelectedObjectsWithUniqueCTXIDs():_b00.getAllSelectedObjects();
if(_b03!=null&&_b03.length>0){
for(var _b04=0;_b04<_b03.length;++_b04){
var _b05={};
var _b06=new CAxisSelectionIterator(_b03[_b04]);
if(_b06.hasNext()){
var _b07=_b06.next();
if(_b07.hasNext()){
var _b08=_b07.next();
var _b09=_b08.getContextId();
_b05[_b09]=true;
var _b0a=_b01.addSelectedCell(_b08.getDataItem(),_b08.getMetadataModelItem(),_b08.getUseValue(),_b08.getUseValueType(),_b08.getDisplayValue(),_b08.getUsage(),{"queryName":_b08.getRefQuery()});
if(_b08.getHun()!=null){
_b0a.addProperty("HierarchyUniqueName",_b08.getHun());
}
if(_b08.getDun()!=null){
_b0a.addProperty("DimensionUniqueName",_b08.getDun());
}
while(_b07.hasNext()){
_b08=_b07.next();
_b09=_b08.getContextId();
if(typeof _b05[_b09]=="undefined"||_b09===""){
_b05[_b09]=true;
var _b0b=_b0a.addDefiningCell(_b08.getDataItem(),_b08.getMetadataModelItem(),_b08.getUseValue(),_b08.getUseValueType(),_b08.getDisplayValue(),_b08.getUsage(),{"queryName":_b08.getRefQuery()});
if(_b08.getHun()!=null){
_b0b.addProperty("HierarchyUniqueName",_b08.getHun());
}
if(_b08.getDun()!=null){
_b0b.addProperty("DimensionUniqueName",_b08.getDun());
}
}
}
while(_b06.hasNext()){
_b07=_b06.next();
var _b0c=_b0a;
while(_b07.hasNext()){
_b08=_b07.next();
_b09=_b08.getContextId();
if(typeof _b05[_b09]=="undefined"||_b09===""){
_b05[_b09]=true;
_b0c=_b0c.addDefiningCell(_b08.getDataItem(),_b08.getMetadataModelItem(),_b08.getUseValue(),_b08.getUseValueType(),_b08.getDisplayValue(),_b08.getUsage(),{"queryName":_b08.getRefQuery()});
if(_b08.getHun()!=null){
_b0c.addProperty("HierarchyUniqueName",_b08.getHun());
}
if(_b08.getDun()!=null){
_b0c.addProperty("DimensionUniqueName",_b08.getDun());
}
}
}
}
}
}
}
}
var _b0d=_b01.toString();
if(window.gViewerLogger){
window.gViewerLogger.log("Selection context",_b0d,"xml");
}
return _b0d;
};
function PinFreezeContainer(_b0e,lid,_b10,_b11,_b12,_b13,_b14){
this.m_pinFreezeManager=_b0e;
this.m_lid=lid;
this.m_lidNS=lid+_b10+_b14;
this.m_viewerId=_b10;
this.m_freezeTop=_b11;
this.m_freezeSide=_b12;
this.m_cachedReportDiv=null;
this.m_cachedPFContainer=null;
this.m_cachedBaseContainer=_b13;
this.m_containerMargin={"top":0,"left":0};
if(this.m_cachedBaseContainer&&this.m_cachedBaseContainer.style){
if(this.m_cachedBaseContainer.style.marginTop){
this.m_containerMargin.top=Number(this.m_cachedBaseContainer.style.marginTop.replace("px",""));
}
if(this.m_cachedBaseContainer.style.marginLeft){
this.m_containerMargin.left=Number(this.m_cachedBaseContainer.style.marginLeft.replace("px",""));
}
}
this.m_cachedContainerIndex=_b14;
this.m_sectionCache=null;
this.m_homeCellNodes={};
this.m_fixedWidth=null;
this.m_clientWidth=700;
this.m_scrollableClientWidth=700;
this.m_fixedHeight=null;
this.m_clientHeight=300;
this.m_scrollableClientHeight=300;
this.m_wrapFlag=false;
this.c_pageMargin=(this.m_freezeTop&&this.m_freezeSide)?50:20;
this.touchScrollSections=false;
this.touchPreviousX=-1;
this.touchPreviousY=-1;
};
PinFreezeContainer.prototype.toJSONString=function(){
var _b15="{";
_b15+="\"m_clientWidth\":"+this.m_clientWidth+"";
_b15+=",\"m_scrollableClientWidth\":"+this.m_scrollableClientWidth+"";
_b15+=",\"m_clientHeight\":"+this.m_clientHeight+"";
_b15+=",\"m_scrollableClientHeight\":"+this.m_scrollableClientHeight+"";
_b15+="}";
return _b15;
};
PinFreezeContainer.prototype.copyProperties=function(_b16){
this.m_clientWidth=_b16.m_clientWidth;
this.m_scrollableClientWidth=_b16.m_scrollableClientWidth;
this.m_clientHeight=_b16.m_clientHeight;
this.m_scrollableClientHeight=_b16.m_scrollableClientHeight;
};
PinFreezeContainer.prototype.setViewerId=function(id){
this.m_viewerId=id;
};
PinFreezeContainer.prototype.getLid=function(){
return this.m_lid;
};
PinFreezeContainer.prototype.createPFContainer=function(_b18,_b19){
var _b1a=document.createElement("temp");
if(this.m_cachedBaseContainer){
this.applyAuthoredFixedSizes(this.m_cachedBaseContainer);
this.m_cachedReportDiv=_b18;
var _b1b=this.m_cachedBaseContainer.parentNode;
var _b1c=this.loadTemplateHTML();
if(_b1c){
_b1a.innerHTML=_b1c;
var _b1d=this.getContainerByLID(_b1a);
var _b1e=this.getSectionByLID(_b1a.firstChild,"pfMainOutput");
if(_b1e){
var i=this.getChildPosition(_b1b,this.m_cachedBaseContainer);
if(i!=-1){
var _b20=this.m_pinFreezeManager.m_oCV;
if(_b20&&_b20.envParams["freezeDefaultWrap"]){
if(this.m_cachedBaseContainer.style.whiteSpace===""&&_b20.envParams["freezeDefaultWrap"].toLowerCase()==="true"){
var _b21=this.m_cachedBaseContainer.getElementsByTagName("span");
if(_b21){
for(var k=0;k<_b21.length;k++){
_b21[k].style.whiteSpace="nowrap";
}
}
this.m_wrapFlag=true;
}
}
if(!_b19){
if(!this._getFixedWidth()){
this.m_cachedBaseContainer.setAttribute("authoredFixedWidth","false");
this.m_addedFixedWidth=this.m_cachedBaseContainer.clientWidth+1;
this.m_cachedBaseContainer.style.width=this.m_addedFixedWidth+"px";
}
if(!this._getFixedHeight()){
this.m_cachedBaseContainer.setAttribute("authoredFixedHeight","false");
this.m_addedFixedHeight=this.m_cachedBaseContainer.clientHeight;
this.m_cachedBaseContainer.style.height=this.m_addedFixedHeight+"px";
}
_b1e.style.width=this.m_cachedBaseContainer.clientWidth+2+"px";
_b1e.style.height=this.m_cachedBaseContainer.clientHeight+2+"px";
}
_b1e.appendChild(this.m_cachedBaseContainer);
this.insertAt(_b1b,_b1d,i);
}
if(this.m_cachedBaseContainer.style.border!==""){
_b1d.style.border=this.m_cachedBaseContainer.style.border;
this.m_cachedBaseContainer.style.border="";
}
}
}
}
};
PinFreezeContainer.prototype._getFixedWidth=function(_b23){
if(_b23&&_b23.style.width&&!_b23.getAttribute("authoredFixedWidth")){
var _b24=Number(_b23.style.width.split("px")[0]);
return isNaN(_b24)?null:_b24;
}
return null;
};
PinFreezeContainer.prototype._getFixedHeight=function(_b25){
if(_b25&&_b25.style.height&&!_b25.getAttribute("authoredFixedHeight")){
var _b26=Number(_b25.style.height.split("px")[0]);
return isNaN(_b26)?null:_b26;
}
return null;
};
PinFreezeContainer.prototype.applyAuthoredFixedSizes=function(_b27){
var _b28=this._getFixedWidth(_b27);
if(_b28){
this.m_fixedWidth=_b28;
this.m_clientWidth=this.m_fixedWidth;
this.m_scrollableClientWidth=this.m_fixedWidth;
}
var _b29=this._getFixedHeight(_b27);
if(_b29){
this.m_fixedHeight=_b29;
this.m_clientHeight=this.m_fixedHeight;
this.m_scrollableClientHeight=this.m_fixedHeight;
}
};
PinFreezeContainer.prototype.loadFreezeBothTemplateHTML=function(){
var _b2a="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\">"+"<tr class=\"BUXNoPrint\" templatePart=\"freezeTop\"><td align=\"center\" templatePart=\"freezeSide\"><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfHomeCell_"+this.m_lidNS+"\" style=\"overflow-x:hidden; overflow-y:hidden; width:100%; height:100%\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfTopHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td><td templatePart=\"freezeTop\"></td></tr>"+"<tr><td class=\"BUXNoPrint\" valign=top templatePart=\"freezeSide\"><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfSideHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\">"+"</div></td>"+"<td class=\"BUXNoPrint\" templatePart=\"freezeTop\">"+"<div style=\"padding-right:1px;overflow-x:hidden; overflow-y:scroll;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfVerticalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchVScroll()\">"+"<div style=\"padding-right:1px;\"/>"+"</div>"+"</td>"+"</tr>"+"<tr class=\"BUXNoPrint\" templatePart=\"freezeSide\"><td></td><td>"+"<div style=\"overflow-x:scroll; overflow-y:hidden;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfHorizontalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchScroll()\">"+"<div style=\"height:2px;\">&nbsp;</div>"+"</div>"+"</td><td></td></tr></table>";
return _b2a;
};
PinFreezeContainer.prototype.loadFreezeSideTemplateHTML=function(){
var _b2b="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\"><tr>"+"<td class=\"BUXNoPrint\" valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfSideHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\">"+"</div></td>"+"</tr>"+"<tr class=\"BUXNoPrint\"><td></td><td>"+"<div style=\"overflow-x:scroll; overflow-y:hidden;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfHorizontalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchScroll()\">"+"<div style=\"height:2px;\">&nbsp;</div>"+"</div>"+"</td></tr></table>";
return _b2b;
};
PinFreezeContainer.prototype.loadFreezeTopTemplateHTML=function(){
var _b2c="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\">"+"<tr class=\"BUXNoPrint\"><td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfTopHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td><td></td></tr>"+"<tr><td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"></div></td>"+"<td class=\"BUXNoPrint\">"+"<div style=\"padding-right:1px;overflow-x:hidden; overflow-y:scroll;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfVerticalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchVScroll()\">"+"<div style=\"padding-right:1px;\"/>"+"</div>"+"</td>"+"</tr></table>";
return _b2c;
};
PinFreezeContainer.prototype.loadTemplateHTML=function(){
if(this.m_freezeSide&&this.m_freezeTop){
return this.loadFreezeBothTemplateHTML();
}else{
if(this.m_freezeSide){
return this.loadFreezeSideTemplateHTML();
}else{
if(this.m_freezeTop){
return this.loadFreezeTopTemplateHTML();
}
}
}
return null;
};
PinFreezeContainer.prototype.createSideHeadings=function(_b2d){
var _b2e=this.getSection("pfMainOutput");
var _b2f=_b2e.getAttribute("pfslid");
var _b30=this.getSection("pfSideHeadings");
var _b31=_b30.getAttribute("pfslid");
var _b32=this.getMainOutputHomeCell();
if(!_b32){
return;
}
var _b33=_b2d;
var _b34=_b30;
var _b35=this.isA11yEnabled(_b33);
var _b36=this.m_pinFreezeManager.deepCloneNode(_b33);
_b34.appendChild(_b36);
var _b37=this.getSectionHomeCell(_b30);
if(!_b37){
return;
}
var _b38=_b33.getElementsByTagName("tbody");
var _b39=_b36.getElementsByTagName("tbody");
if(_b38.length>0&&_b39.length>0){
var _b3a=_b38[0];
var _b3b=_b39[0];
var _b3c=_b3a.firstChild;
var _b3d=_b3b.firstChild;
var _b3e=_b32.rowSpan;
this.markAsCopy(_b32,_b37,_b2f,_b31);
for(var r=0;r<_b3e;++r){
var _b40=_b3b.rows[r];
this.removeCTX(_b40);
}
for(var r=_b3e;r<_b3b.rows.length;++r){
var _b41=_b3a.rows[r];
var _b40=_b3b.rows[r];
_b40.style.visibility="hidden";
for(var c=0;c<_b40.cells.length;++c){
var _b43=_b40.cells[c];
if(_b35){
_b43=this.m_pinFreezeManager.removeIdAttribute(_b43);
}
if(_b43.getAttribute("type")=="datavalue"){
_b43.removeAttribute("ctx");
_b43.removeAttribute("uid");
_b43.removeAttribute("name");
}else{
var _b44=_b41.cells[c];
this.markAsCopy(_b44,_b43,_b2f,_b31);
}
}
_b40.style.visibility="visible";
}
}
};
PinFreezeContainer.prototype.applyNeighbouringBorderStylesToHomeCell=function(_b45,_b46){
if(isFF()||isIE()){
if(_b45&&_b45.length&&_b45[0].cells&&_b45[0].cells.length>1){
if(this.m_freezeSide){
var _b47=this.getBorderInfo(_b45[0].cells[1],"right");
if(_b47){
_b46.style.borderRightWidth=_b47.borderRightWidth;
_b46.style.borderRightStyle=_b47.borderRightStyle;
_b46.style.borderRightColor=_b47.borderRightColor;
}
}
if(this.m_freezeTop){
var _b47=this.getBorderInfo(_b45[0].cells[1],"bottom");
if(_b47){
_b46.style.borderBottomWidth=_b47.borderBottomWidth;
_b46.style.borderBottomStyle=_b47.borderBottomStyle;
_b46.style.borderBottomColor=_b47.borderBottomColor;
}
}
}
}
};
PinFreezeContainer.prototype.createTopHeadings=function(_b48){
var _b49=this.getSection("pfMainOutput");
var _b4a=_b49.getAttribute("pfslid");
var _b4b=this.getSection("pfTopHeadings");
var _b4c=_b4b.getAttribute("pfslid");
var _b4d=this.getMainOutputHomeCell();
if(!_b4d){
return;
}
var _b4e=_b48;
var _b4f=_b4b;
var _b50=this.isA11yEnabled(_b4e);
var _b51=this.m_pinFreezeManager.deepCloneNode(_b4e);
_b51.setAttribute("clonednode","true");
_b4f.appendChild(_b51);
var _b52=_b4e.getElementsByTagName("tbody");
var _b53=_b51.getElementsByTagName("tbody");
if(_b52.length>0&&_b53.length>0){
var _b54=_b52[0];
var _b55=_b53[0];
var _b56=_b4d.rowSpan;
for(var r=0;r<_b55.rows.length;++r){
var _b58=_b54.rows[r];
var _b59=_b55.rows[r];
if(_b50){
_b59=this.m_pinFreezeManager.removeIdAttribute(_b59);
}
_b59.style.visibility="hidden";
for(var c=0;c<_b59.cells.length;++c){
var _b5b=_b59.cells[c];
if(r>_b56||_b5b.getAttribute("type")=="datavalue"){
_b5b.removeAttribute("ctx");
_b5b.removeAttribute("uid");
_b5b.removeAttribute("name");
}else{
var _b5c=_b58.cells[c];
this.markAsCopy(_b5c,_b5b,_b4a,_b4c);
if(_b5c===_b4d){
this.initializeHomeCellTabIndex(_b5b);
this.applyNeighbouringBorderStylesToHomeCell(_b54.rows,_b5b);
}
}
}
_b59.style.visibility="visible";
}
}
};
PinFreezeContainer.prototype.createHomeCellHeading=function(){
var _b5d=this.getSection("pfMainOutput");
var _b5e=_b5d.getAttribute("pfslid");
var _b5f=this.getSection("pfHomeCell");
var _b60=_b5f.parentNode;
var _b61=_b5f.getAttribute("pfslid");
var _b62=this.getMainOutputHomeCell();
if(!_b62){
return;
}
_b60.style.height="100%";
var _b63=this.getTopHeadingSectionHeight(_b62);
_b5f.style.height=_b63-this.m_containerMargin.top+"px";
_b5f.style.width=this.getSideHeadingSectionWidth(_b62)-this.m_containerMargin.left+"px";
_b5f.style.marginTop=this.m_containerMargin.top+"px";
_b5f.style.marginLeft=this.m_containerMargin.left+"px";
var _b64=_b62.parentNode;
var _b65=_b64.cloneNode(false);
var _b66=this._findBestGuessHomeCell(_b62);
var _b67=document.createElement("div");
_b67.style.width="100%";
_b67.style.height="100%";
while(_b62.offsetLeft<=_b66.offsetLeft){
oTargetHomeCell=this.m_pinFreezeManager.deepCloneNode(_b62);
if(isFF()||isIE()){
_b62.appendChild(_b67);
oTargetHomeCell.style.width=_b67.clientWidth+"px";
_b62.removeChild(_b67);
}else{
oTargetHomeCell.style.width=_b62.clientWidth+1+"px";
}
oTargetHomeCell.style.borderBottomWidth="0px";
_b65.appendChild(oTargetHomeCell);
this.markAsCopy(_b62,oTargetHomeCell,_b5e,_b61);
if(_b62.nextSibling){
_b62=_b62.nextSibling;
}else{
break;
}
}
if(oTargetHomeCell){
oTargetHomeCell.style.borderRightWidth="0px";
}
var _b68=_b64.parentNode;
var _b69=_b68.cloneNode(false);
_b69.appendChild(_b65);
var _b6a=_b68.parentNode;
var _b6b=_b6a.cloneNode(false);
_b6b.appendChild(_b69);
_b6b.style.width="100%";
_b6b.style.height="100%";
_b6b.style.marginLeft="";
_b6b.style.marginTop="";
_b5f.appendChild(_b6b);
this.initializeHomeCellTabIndex(oTargetHomeCell);
this.applyNeighbouringBorderStylesToHomeCell(_b5d.firstChild.rows,_b5f);
};
PinFreezeContainer.prototype.markAsCopy=function(main,copy,_b6e,_b6f){
if(!main.pfCopy){
main.setAttribute("pfslid",_b6e);
main.pfCopy=[];
}
main.pfCopy.push(copy);
copy.pfMain=main;
copy.setAttribute("pfslid",_b6f);
};
PinFreezeContainer.prototype.getCopy=function(_b70){
if(_b70.pfCopy){
var _b71={};
for(var i in _b70.pfCopy){
var copy=_b70.pfCopy[i];
if(copy.getAttribute){
var _b74=copy.getAttribute("pfslid");
if(_b74){
var _b75=PinFreezeContainer.getSectionNameFromSlid(_b74);
var _b76=this.getSection(_b75);
if(_b76&&PinFreezeContainer.isSectionVisible(_b76)){
_b71[_b75]=copy;
}
}
}
}
if(_b71["pfHomeCell"]){
return _b71["pfHomeCell"];
}
for(i in _b71){
return _b71[i];
}
}
return null;
};
PinFreezeContainer.prototype.getMain=function(_b77){
if(_b77.pfMain){
return _b77.pfMain;
}
return null;
};
PinFreezeContainer.isSectionVisible=function(_b78){
var node=_b78;
if(!node){
return false;
}
while(node.parentNode&&!node.getAttribute("pfclid")){
if(node.style&&node.style.display==="none"){
return false;
}
node=node.parentNode;
}
return (!node.style||node.style.display!=="none");
};
PinFreezeContainer.prototype.getSectionStructure=function(){
var _b7a={isSideFrozen:false,isTopFrozen:false};
if(this.m_freezeSide){
var side=this.getSection("pfSideHeadings");
if(side){
_b7a.isSideFrozen=PinFreezeContainer.isSectionVisible(side);
}
}
if(this.m_freezeTop){
var top=this.getSection("pfTopHeadings");
if(top){
_b7a.isTopFrozen=PinFreezeContainer.isSectionVisible(top);
}
}
return _b7a;
};
PinFreezeContainer.prototype.checkSectionStructureChange=function(_b7d,_b7e){
if(_b7d.isSideFrozen!==_b7e.isSideFrozen||_b7d.isTopFrozen!==_b7e.isTopFrozen){
this.m_pinFreezeManager.sectionStructureChange();
}
};
PinFreezeContainer.prototype.freezeContainerInReport=function(_b7f){
this.cacheContainerAndSections(this.getContainerByLID(_b7f));
this.m_homeCellNodes={};
this.updateContainer();
};
PinFreezeContainer.prototype.frozenSectionsRequired=function(){
return (this.frozenSideHeadingsRequired()||this.frozenTopHeadingsRequired());
};
PinFreezeContainer.prototype.frozenSideHeadingsRequired=function(){
var _b80=this.getSection("pfMainOutput");
if(_b80){
if(this.m_freezeSide){
var _b81=_b80.scrollWidth;
return ((this.m_clientWidth<_b81)||_b81==0);
}
}
return false;
};
PinFreezeContainer.prototype.frozenTopHeadingsRequired=function(){
var _b82=this.getSection("pfMainOutput");
if(_b82){
if(this.m_freezeTop){
var _b83=_b82.scrollHeight;
return ((this.m_clientHeight<_b83)||_b83==0);
}
}
return false;
};
PinFreezeContainer.prototype.showTemplatePart=function(_b84,_b85){
var _b86=this.getContainer().rows;
for(var r=0;r<_b86.length;++r){
if(_b86[r].getAttribute("templatePart")===_b84){
_b86[r].style.display=((_b85)?"":"none");
}else{
var _b88=_b86[r].cells;
for(var c=0;c<_b88.length;++c){
if(_b88[c].getAttribute("templatePart")===_b84){
_b88[c].style.display=((_b85)?"":"none");
}
}
}
}
};
PinFreezeContainer.prototype.showFreezeTopOnly=function(_b8a){
if(!(this.m_freezeTop&&this.m_freezeSide)){
return;
}
var _b8b=(_b8a.scrollWidth==0)?_b8a.clientWidth:_b8a.scrollWidth;
this.updateMainOutputWidth(_b8b);
this.setScrollX(_b8a,0);
if(this.getSection("pfTopHeadings")){
this.getSection("pfTopHeadings").style.width=_b8b+"px";
this.setScrollX(this.getSection("pfTopHeadings"),0);
}
this.showTemplatePart("freezeSide",false);
};
PinFreezeContainer.prototype.showFreezeSideOnly=function(_b8c){
if(!(this.m_freezeTop&&this.m_freezeSide)){
return;
}
var _b8d=(_b8c.scrollHeight==0)?_b8c.clientHeight:_b8c.scrollHeight;
this.updateMainOutputHeight(_b8d);
this.setScrollY(_b8c,0);
if(this.getSection("pfSideHeadings")){
this.getSection("pfSideHeadings").style.height=_b8d+"px";
this.setScrollY(this.getSection("pfSideHeadings"),0);
}
this.showTemplatePart("freezeTop",false);
};
PinFreezeContainer.prototype.showAll=function(){
if(!(this.m_freezeTop&&this.m_freezeSide)){
return;
}
this.showTemplatePart("freezeTop",true);
this.showTemplatePart("freezeSide",true);
};
PinFreezeContainer.prototype.showMainOutputOnly=function(_b8e){
this.updateMainOutputWidth((_b8e.scrollWidth==0)?_b8e.clientWidth:_b8e.scrollWidth);
this.updateMainOutputHeight((_b8e.scrollHeight==0)?_b8e.clientHeight:_b8e.scrollHeight);
this.setInitialScrollPosition(_b8e,0,0);
if(this.m_freezeSide&&this.m_freezeTop){
this.getSection("pfHomeCell").style.display="none";
}
if(this.m_freezeSide){
this.getSection("pfSideHeadings").style.display="none";
this.getSection("pfHorizontalScrollBar").style.display="none";
}
if(this.m_freezeTop){
this.getSection("pfTopHeadings").style.display="none";
this.getSection("pfVerticalScrollBar").style.display="none";
}
};
PinFreezeContainer.prototype.getWrap=function(el){
if(el.currentStyle){
return el.currentStyle.whiteSpace;
}else{
if(window.getComputedStyle){
return window.getComputedStyle(el,null).getPropertyValue("white-space");
}else{
return el.style.whiteSpace;
}
}
};
PinFreezeContainer.prototype.headingsCreated=function(_b90){
return _b90.firstChild?true:false;
};
PinFreezeContainer.prototype.updateContainer=function(){
var _b91=this.getSection("pfMainOutput");
var _b92=this.getMainOutputHomeCell();
if(_b92){
if(this.m_scrollableClientHeight===this.m_clientHeight||!this.m_scrollableClientHeight){
this.m_scrollableClientHeight-=_b92.offsetHeight;
var _b93=this.calculateMinCrossTabScrollableClientHeight();
if(_b93>this.m_scrollableClientHeight){
this.m_scrollableClientHeight=_b93;
}
}
if(this.m_scrollableClientWidth===this.m_clientWidth||!this.m_scrollableClientWidth){
this.m_scrollableClientWidth-=this.getHomeCellOffsetWidth(_b92);
}
}
if(_b91&&_b92){
this.showAll();
if(this.frozenSectionsRequired()){
this.updateMainOutputSize();
this.initializeHomeCellTabIndex(_b92);
if(this.m_freezeSide){
var _b94=this.getSection("pfSideHeadings");
if(!this.headingsCreated(_b94)){
this.createSideHeadings(this.m_cachedBaseContainer);
if(this.m_freezeTop){
this.initializeTouchScrolling(_b94);
}
}
var _b95=this.getSection("pfHorizontalScrollBar");
_b95.scrollLeft="0px";
}
if(this.m_freezeTop){
var _b96=this.getSection("pfTopHeadings");
if(!this.headingsCreated(_b96)){
this.createTopHeadings(this.m_cachedBaseContainer);
if(this.m_freezeSide){
this.initializeTouchScrolling(_b96);
}
}
var _b97=this.getSection("pfVerticalScrollBar");
_b97.scrollTop="0px";
}
if(this.m_freezeSide&&this.m_freezeTop){
var _b98=this.getSection("pfHomeCell");
if(!this.headingsCreated(_b98)){
this.createHomeCellHeading();
}
_b98.style.display="";
}
var _b99=this.updateSideHeadingSize(_b92);
var _b9a=this.updateTopHeadingSize(_b92);
if(!this.frozenSectionsRequired()){
this.showMainOutputOnly(_b91);
}
this.setInitialScrollPosition(_b91,_b99,_b9a);
if(this.m_freezeTop&&this.m_freezeSide){
this.setInitialScrollPosition(this.getSection("pfSideHeadings"),0,_b9a);
this.setInitialScrollPosition(this.getSection("pfTopHeadings"),_b99,0);
}
this.initializeTouchScrolling(_b91);
}else{
this.showMainOutputOnly(_b91);
this.removeTouchScrolling();
}
this.updateTabIndexValues();
}
};
PinFreezeContainer.prototype.calculateMinCrossTabScrollableClientHeight=function(){
var _b9b=0;
if(this.m_cachedPFContainer){
var _b9c=this.getElementByLID(this.m_cachedPFContainer,"table",this.m_lid+this.m_viewerId);
if(_b9c){
var _b9d=0;
for(var r=0;r<_b9c.rows.length;r++){
var row=_b9c.rows[r];
for(var c=0;c<row.cells.length;c++){
var cell=row.cells[c];
if(cell.getAttribute("type")=="datavalue"){
_b9d++;
if(cell.childNodes.length===1&&cell.childNodes[0].getAttribute&&cell.childNodes[0].getAttribute("class")==="textItem"){
_b9b=_b9b+cell.offsetHeight;
}else{
_b9d++;
var _ba2=this.getSection("pfVerticalScrollBar");
if(_ba2){
_b9b=_ba2.offsetWidth*2;
}
}
break;
}
}
if(_b9d>=2){
break;
}
}
}
}
return _b9b;
};
PinFreezeContainer.prototype.updateSideHeadingSize=function(_ba3){
var _ba4=0;
if(this.m_freezeSide){
var _ba5=this.getSection("pfMainOutput");
if(!_ba5){
return 0;
}
if(!this.frozenSideHeadingsRequired()){
this.showFreezeTopOnly(_ba5);
return 0;
}
var _ba6=this.getSection("pfSideHeadings");
_ba4=this.getSideHeadingSectionWidth(_ba3);
var _ba7=this.getSection("pfHorizontalScrollBar");
var _ba8=this.getSectionHomeCell(_ba6);
if(_ba6.style.display=="none"){
_ba6.style.display="";
_ba7.style.display="";
}
_ba6.style.width=_ba4+"px";
_ba6.style.height=_ba5.clientHeight+"px";
}
return _ba4;
};
PinFreezeContainer.prototype.updateTopHeadingSize=function(_ba9){
var _baa=0;
if(this.m_freezeTop){
var _bab=this.getSection("pfMainOutput");
if(!_bab){
return 0;
}
if(!this.frozenTopHeadingsRequired()){
this.showFreezeSideOnly(_bab);
return 0;
}
var _bac=this.getSection("pfTopHeadings");
_baa=this.getTopHeadingSectionHeight(_ba9);
var _bad=this.getSection("pfVerticalScrollBar");
var _bae=this.getSectionHomeCell(_bac);
if(_bac.style.display=="none"){
_bac.style.display="";
_bad.style.display="";
}
_bac.style.height=_baa+"px";
_bac.style.width=_bab.clientWidth+"px";
}
return _baa;
};
PinFreezeContainer.prototype.setScrollX=function(_baf,_bb0){
if(getElementDirection(_baf)==="rtl"){
setScrollRight(_baf,_bb0);
}else{
setScrollLeft(_baf,_bb0);
}
};
PinFreezeContainer.prototype.setScrollY=function(_bb1,_bb2){
_bb1.scrollTop=_bb2;
};
PinFreezeContainer.prototype.setInitialScrollPosition=function(_bb3,_bb4,_bb5){
if(getElementDirection(_bb3)==="rtl"){
setScrollRight(_bb3,_bb4);
}else{
setScrollLeft(_bb3,_bb4);
}
_bb3.scrollTop=_bb5;
};
PinFreezeContainer.prototype.getScrollableClientWidth=function(){
return this.m_scrollableClientWidth;
};
PinFreezeContainer.prototype.setScrollableClientWidth=function(_bb6){
this.m_scrollableClientWidth=_bb6;
};
PinFreezeContainer.prototype.getContainerWidth=function(){
return this.m_addedFixedWidth?this.m_addedFixedWidth:this.m_clientWidth;
};
PinFreezeContainer.prototype.getClientWidth=function(){
return this.m_clientWidth;
};
PinFreezeContainer.prototype.getScrollableClientHeight=function(){
return this.m_scrollableClientHeight;
};
PinFreezeContainer.prototype.setScrollableClientHeight=function(_bb7){
this.m_scrollableClientHeight=_bb7;
};
PinFreezeContainer.prototype.getClientHeight=function(){
return this.m_clientHeight;
};
PinFreezeContainer.prototype.clientHeight=function(_bb8){
return _bb8.clientHeight;
};
PinFreezeContainer.prototype.findBestContainerHeight=function(_bb9){
if(this.m_freezeTop&&this.m_cachedReportDiv){
var _bba=this.m_cachedReportDiv.parentNode;
if(_bba){
var _bbb=this._findRestOfPageHeight(this.getContainer());
return _bb9-_bbb-(this.c_pageMargin/2)-this.m_containerMargin.top;
}
}
return _bb9-this.c_pageMargin;
};
PinFreezeContainer.prototype.findBestContainerWidth=function(_bbc){
var node=this.getContainer();
while(node&&node.nodeName.toLowerCase()!="td"&&node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
node=node.parentNode;
}
if(!node){
return -1;
}
if(node.nodeName.toLowerCase()=="td"){
var _bbe=0;
var _bbf=node.parentNode.childNodes;
for(var i=0;i<_bbf.length;i++){
if(_bbf[i]!==node){
_bbe+=_bbf[i].clientWidth;
}
}
return _bbc-_bbe-(this.c_pageMargin/2);
}
return _bbc;
};
PinFreezeContainer.prototype._findRestOfPageHeight=function(node){
var _bc2=0;
var _bc3=node.parentNode;
if(!_bc3){
return _bc2;
}
if(_bc3.childNodes.length>1){
for(var i=0;i<_bc3.childNodes.length;i++){
var _bc5=_bc3.childNodes[i];
if(_bc5!=node&&!isNaN(_bc5.clientHeight)&&_bc5.style.display!="none"){
_bc2+=this.clientHeight(_bc5);
}
}
}
if(node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
_bc2+=this._findRestOfPageHeight(_bc3);
}
return _bc2;
};
PinFreezeContainer.prototype.resize=function(_bc6,_bc7,_bc8,_bc9){
if(this.m_fixedWidth&&this.m_fixedHeight){
return;
}
_bc6=(this.m_fixedWidth)?this.m_fixedWidth:_bc6;
_bc7=(this.m_fixedHeight)?this.m_fixedHeight:_bc7;
var _bca=this.getSectionStructure();
if(this.m_sectionCache&&this.m_cachedPFContainer){
var _bcb=0;
if(_bc7!==0){
_bcb=this.findBestContainerHeight(_bc7);
if(_bc8&&_bcb<300){
_bcb=300;
}else{
if(_bcb<100){
_bcb=100;
}
}
}
this.m_clientHeight=_bcb>0?_bcb:this.m_clientHeight;
var _bcc=0;
if(_bc6!==0){
_bcc=this.findBestContainerWidth(_bc6);
}
this.m_clientWidth=(_bcc>0)?_bcc-5-(this.c_pageMargin/2):this.m_clientWidth;
var _bcd=this.getSection("pfMainOutput");
var _bce=this.getSectionHomeCell(_bcd);
if(_bce){
this.m_scrollableClientWidth=this.m_clientWidth-this.getSideHeadingSectionWidth(_bce);
this.m_scrollableClientHeight=this.m_clientHeight-_bce.offsetHeight;
}
if(_bc9){
var _bcf=getElementsByAttribute(this.m_cachedPFContainer,"div","pflid",_bc9.lid);
if(_bcf){
var node=_bcf[0];
while(node.nodeName.toLowerCase()!="table"){
node=node.parentNode;
}
node.style.width=_bc9.width+"px";
}
}
this.updateContainer();
}else{
this.m_clientWidth=_bc6-this.c_pageMargin;
this.m_clientHeight=_bc7-this.c_pageMargin;
}
var _bd1=this.getSectionStructure();
this.checkSectionStructureChange(_bca,_bd1);
};
PinFreezeContainer.prototype.updateMainOutputSize=function(){
if(this.m_freezeSide&&this.m_freezeTop){
if(this.frozenSideHeadingsRequired()){
this.updateMainOutputWidth(this.getScrollableClientWidth());
}
if(this.frozenTopHeadingsRequired()){
this.updateMainOutputHeight(this.getScrollableClientHeight());
}
}else{
if(this.m_freezeSide){
this.updateMainOutputWidth(this.getScrollableClientWidth());
}else{
if(this.m_freezeTop){
this.updateMainOutputHeight(this.getScrollableClientHeight());
}
}
}
};
PinFreezeContainer.prototype.updateMainOutputWidth=function(_bd2){
var _bd3=this.getSection("pfMainOutput");
if(!_bd3){
return;
}
if(this.m_freezeSide==true){
_bd3.style.width=(_bd2+"px");
if(this.m_freezeTop==false||!this.frozenTopHeadingsRequired()){
_bd3.style.height=_bd3.firstChild.clientHeight+"px";
}
var _bd4=this.getSection("pfHorizontalScrollBar");
if(_bd4){
_bd4.style.width=(_bd2+"px");
var _bd5=_bd4.firstChild;
if(_bd5){
var _bd6=this.getSectionHomeCell(_bd3);
var _bd7=_bd3.scrollWidth-this.getHomeCellOffsetWidth(_bd6);
_bd5.style.width=_bd7+"px";
}
}
}
};
PinFreezeContainer.prototype.updateMainOutputHeight=function(_bd8){
var _bd9=this.getSection("pfMainOutput");
if(!_bd9){
return;
}
_bd9.style.height=(_bd8+"px");
if(!this.m_freezeSide||!this.frozenSideHeadingsRequired()){
_bd9.style.width=_bd9.firstChild.clientWidth+2+"px";
}
var _bda=this.getSection("pfVerticalScrollBar");
if(_bda){
_bda.style.height=(_bd8+"px");
var _bdb=_bda.firstChild;
if(_bdb){
var _bdc=this.getSectionHomeCell(_bd9);
var _bdd=_bd9.scrollHeight-_bdc.offsetHeight;
_bdb.style.height=_bdd+"px";
}
}
};
PinFreezeContainer.prototype.getElementByLID=function(_bde,tag,lid){
var _be1=getElementsByAttribute(_bde,tag,"lid",lid);
if(_be1.length>0){
return _be1[0];
}
return null;
};
PinFreezeContainer.prototype.getContainerByLID=function(_be2){
var _be3=getElementsByAttribute(_be2,"table","pfclid","pfContainer_"+this.m_lidNS);
if(_be3.length>0){
return _be3[0];
}
return null;
};
PinFreezeContainer.prototype.getSectionByLID=function(_be4,_be5){
var _be6=getElementsByAttribute(_be4,"div","pfslid",_be5+"_"+this.m_lidNS);
if(_be6.length>0){
return _be6[0];
}
return null;
};
PinFreezeContainer.getSectionNameFromSlid=function(slid){
return slid?slid.split("_")[0]:null;
};
PinFreezeContainer.getLidFromSlid=function(slid){
return slid.split("_")[1];
};
PinFreezeContainer.nodeToSlid=function(_be9){
while(_be9.parentNode&&!_be9.getAttribute("pfslid")){
_be9=_be9.parentNode;
}
if(_be9.getAttribute){
return _be9.getAttribute("pfslid");
}
return null;
};
PinFreezeContainer.prototype.cacheContainerAndSections=function(_bea){
if(!_bea){
return _bea;
}
this.m_cachedPFContainer=_bea;
var _beb=getElementsByAttribute(this.m_cachedPFContainer,"div","pflid",this.m_lidNS);
this.m_sectionCache={};
for(var i=0;i<_beb.length;++i){
var key=_beb[i].getAttribute("pfslid");
key=key.split("_",1);
this.m_sectionCache[key]=_beb[i];
}
return _bea;
};
PinFreezeContainer.prototype.getContainer=function(){
return this.m_cachedPFContainer;
};
PinFreezeContainer.prototype.getSection=function(key){
if(!this.m_sectionCache){
return null;
}
if(!this.m_sectionCache[key]){
this.m_sectionCache[key]=this.getSectionByLID(this.m_cachedPFContainer,key);
}
return this.m_sectionCache[key];
};
PinFreezeContainer.prototype.initializeHomeCellTabIndex=function(_bef){
var slid=PinFreezeContainer.nodeToSlid(_bef);
if(!this.m_homeCellNodes[slid]){
var _bf1=getElementsByAttribute(_bef,"*","tabIndex","*");
for(var i in _bf1){
if(!_bf1[i].getAttribute("widgetid")){
this.m_homeCellNodes[slid]=_bf1[i];
break;
}
}
}
};
PinFreezeContainer.prototype.updateTabIndexValues=function(){
if(this.isContainerFrozen()){
for(var slid in this.m_homeCellNodes){
var _bf4=this.m_pinFreezeManager.isNodeVisible(this.m_homeCellNodes[slid])?"0":"-1";
this.m_homeCellNodes[slid].setAttribute("tabIndex",_bf4);
}
}else{
for(var slid in this.m_homeCellNodes){
var _bf4=(PinFreezeContainer.getSectionNameFromSlid(slid)==="pfMainOutput")?"0":"-1";
this.m_homeCellNodes[slid].setAttribute("tabIndex",_bf4);
}
}
};
PinFreezeContainer.prototype.getSectionHomeCell=function(_bf5){
if(_bf5){
var _bf6=this.getElementByLID(_bf5,"table",this.m_lid+this.m_viewerId);
if(_bf6&&_bf6.rows.length&&_bf6.rows[0].cells.length){
return _bf6.rows[0].cells[0];
}
}
return null;
};
PinFreezeContainer.prototype.getMainOutputHomeCell=function(){
var _bf7=this.getSection("pfMainOutput");
if(!_bf7){
_bf7=this.getSectionByLID(this.m_cachedPFContainer,"pfMainOutput");
}
return this.getSectionHomeCell(_bf7);
};
PinFreezeContainer.prototype.getChildPosition=function(_bf8,_bf9){
for(var i=0;i<_bf8.childNodes.length;++i){
if(_bf8.childNodes[i]==_bf9){
return i;
}
}
return -1;
};
PinFreezeContainer.prototype.insertAt=function(_bfb,_bfc,_bfd){
if(_bfd==_bfb.childNodes.length){
_bfb.appendChild(_bfc);
}else{
_bfb.insertBefore(_bfc,_bfb.childNodes[_bfd]);
}
};
PinFreezeContainer.prototype.synchScroll=function(){
if(!this.m_cachedPFContainer){
return;
}
var _bfe=this.getMainOutputHomeCell();
var _bff=this.getSection("pfMainOutput");
var _c00=this.getSection("pfSideHeadings");
if(_c00!=null){
var _c01=this.getSection("pfHorizontalScrollBar");
if(_c01){
var _c02=this.getSideHeadingSectionWidth(_bfe);
if(getElementDirection(_bff)==="rtl"){
_c02=0;
}
setScrollLeft(_bff,getScrollLeft(_c01)+_c02);
if(this.m_freezeTop){
setScrollLeft(this.getSection("pfTopHeadings"),getScrollLeft(_c01)+_c02);
}
}
}
};
PinFreezeContainer.prototype.updateScroll=function(_c03){
var slid=PinFreezeContainer.nodeToSlid(_c03);
if(!slid){
return;
}
var _c05=PinFreezeContainer.getSectionNameFromSlid(slid);
if(!_c05){
return;
}
var _c06=document.getElementById("CVReport"+this.m_viewerId);
if(!_c06){
return;
}
if(!this.m_cachedPFContainer){
return;
}
var _c07=_c03.parentNode;
if(_c07){
var _c08=_c07.tagName.toLowerCase();
if(_c08==="td"||_c08==="th"){
var _c09=this.getMainOutputHomeCell();
var _c0a=this.getSection("pfMainOutput");
if(_c05==="pfMainOutput"||_c05==="pfTopHeadings"){
var _c0b=this.getSection("pfHorizontalScrollBar");
if(_c0b){
var _c0c=PinFreezeContainer.calculateNewPosition(_c07.offsetLeft,_c07.offsetWidth,getScrollLeft(_c0a),_c0a.offsetWidth);
var _c0d=this.getHomeCellOffsetWidth(_c09);
if(getElementDirection(_c0a)==="rtl"){
_c0d=0;
}
setScrollLeft(_c0b,_c0c-_c0d);
setScrollLeft(_c0a,_c0c);
}
}
if(_c05==="pfMainOutput"||_c05==="pfSideHeadings"){
var _c0e=this.getSection("pfVerticalScrollBar");
if(_c0e){
var _c0f=PinFreezeContainer.calculateNewPosition(_c07.offsetTop,_c07.offsetHeight,_c0a.scrollTop,_c0a.offsetHeight);
_c0e.scrollTop=_c0f-_c09.offsetHeight;
_c0a.scrollTop=_c0f;
}
}
}
}
};
PinFreezeContainer.calculateNewPosition=function(_c10,_c11,_c12,_c13){
var _c14=_c10+_c11;
var _c15=_c12+_c13;
if(_c12>_c10){
return _c10;
}else{
if(_c15<_c14){
if(_c11>_c13){
return _c10;
}
return _c14-_c13;
}
}
return _c12;
};
PinFreezeContainer.prototype.synchVScroll=function(){
if(!this.m_cachedPFContainer){
return;
}
var _c16=this.getMainOutputHomeCell();
var _c17=this.getSection("pfMainOutput");
var _c18=this.getSection("pfTopHeadings");
if(_c18!=null){
var _c19=this.getSection("pfVerticalScrollBar");
if(_c19){
_c17.scrollTop=_c19.scrollTop+this.getTopHeadingSectionHeight(_c16);
if(this.m_freezeSide){
this.getSection("pfSideHeadings").scrollTop=_c19.scrollTop+this.getTopHeadingSectionHeight(_c16);
}
}
}
};
PinFreezeContainer.prototype.getTopHeadingSectionHeight=function(_c1a){
return _c1a.offsetHeight+_c1a.offsetTop+this.m_containerMargin.top;
};
PinFreezeContainer.prototype._findBestGuessHomeCell=function(_c1b){
if(this.m_bestGuessHomeCell){
return this.m_bestGuessHomeCell;
}
if(_c1b){
var _c1c=_c1b.parentNode.parentNode;
var _c1d=_c1b.rowSpan?(_c1b.rowSpan):1;
var tr=_c1c.childNodes[_c1d];
if(tr){
var _c1f=tr.childNodes.length;
var _c20=null;
var td=null;
for(var i=0;i<_c1f;i++){
td=tr.childNodes[i];
if(td.getAttribute("type")=="datavalue"){
break;
}
_c20=td;
}
if(_c20){
this.m_bestGuessHomeCell=_c20;
return this.m_bestGuessHomeCell;
}
}else{
return _c1b;
}
}
return null;
};
PinFreezeContainer.prototype.getHomeCellOffsetWidth=function(_c23){
var _c24=this._findBestGuessHomeCell(_c23);
return _c24?_c24.offsetWidth:0;
};
PinFreezeContainer.prototype.getSideHeadingSectionWidth=function(_c25){
var _c26=this._findBestGuessHomeCell(_c25);
if(_c26){
return _c26.offsetWidth+_c26.offsetLeft+this.m_containerMargin.left;
}else{
return _c25.offsetWidth+_c25.offsetLeft;
}
};
PinFreezeContainer.prototype.isContainerFrozen=function(){
return (this.m_freezeTop||this.m_freezeSide);
};
PinFreezeContainer.prototype.unfreeze=function(_c27){
var _c28=this.getContainerByLID(_c27);
this.m_freezeTop=false;
this.m_freezeSide=false;
if(_c28){
var _c29=_c28.parentNode;
pfMainOutput=this.getSectionByLID(_c28,"pfMainOutput");
if(pfMainOutput&&_c29){
if(_c28.style.border!==""){
pfMainOutput.firstChild.style.border=_c28.style.border;
_c28.style.border="";
}
if(this.m_wrapFlag){
var _c2a=pfMainOutput.firstChild.getElementsByTagName("span");
if(_c2a){
for(var k=0;k<_c2a.length;k++){
_c2a[k].style.whiteSpace="";
}
}
this.m_wrapFlag=false;
}
this.updateTabIndexValues();
if(this.m_cachedBaseContainer.getAttribute("authoredFixedWidth")){
this.m_cachedBaseContainer.removeAttribute("authoredFixedWidth");
this.m_cachedBaseContainer.style.width="auto";
this.m_addedFixedWidth=null;
}
if(this.m_cachedBaseContainer.getAttribute("authoredFixedHeight")){
this.m_cachedBaseContainer.removeAttribute("authoredFixedHeight");
this.m_cachedBaseContainer.style.height="auto";
this.m_addedFixedHeight=null;
}
_c29.replaceChild(this.m_pinFreezeManager.deepCloneNode(pfMainOutput.firstChild),_c28);
}
}
};
PinFreezeContainer.prototype.getBorderInfo=function(el,_c2d){
var _c2e={};
var _c2f="border-"+_c2d+"-";
var _c30="border"+_c2d.charAt(0).toUpperCase()+_c2d.substring(1);
if(el.currentStyle){
_c2e[_c30+"Width"]=el.currentStyle[_c30+"Width"];
_c2e[_c30+"Style"]=el.currentStyle[_c30+"Style"];
_c2e[_c30+"Color"]=el.currentStyle[_c30+"Color"];
}else{
if(window.getComputedStyle){
_c2e[_c30+"Width"]=window.getComputedStyle(el,null).getPropertyValue(_c2f+"width");
_c2e[_c30+"Style"]=window.getComputedStyle(el,null).getPropertyValue(_c2f+"style");
_c2e[_c30+"Color"]=window.getComputedStyle(el,null).getPropertyValue(_c2f+"color");
}else{
return null;
}
}
return _c2e;
};
PinFreezeContainer.prototype.isA11yEnabled=function(_c31){
return (_c31.getAttribute("role")==="grid");
};
PinFreezeContainer.isElementInMainOutput=function(_c32){
var _c33=PinFreezeContainer.nodeToSlid(_c32);
if(_c33){
return (_c33.indexOf("pfMainOutput_")===0);
}
return false;
};
PinFreezeContainer.prototype.removeCTX=function(_c34){
_c34.removeAttribute("ctx");
var _c35=getElementsByAttribute(_c34,"*","ctx","*");
if(_c35&&_c35.length){
for(var i=0;i<_c35.length;i++){
_c35[i].removeAttribute("ctx");
}
}
};
PinFreezeContainer.prototype.initializeTouchScrolling=function(_c37){
if(!this.m_pinFreezeManager.isIWidgetMobile()){
return;
}
if(_c37){
_c37.m_pinFreezeContainer=this;
if(document.attachEvent){
_c37.attachEvent("touchstart",this.touchStart);
_c37.attachEvent("touchmove",this.touchMove);
_c37.attachEvent("touchend",this.touchEnd);
}else{
_c37.addEventListener("touchstart",this.touchStart,false);
_c37.addEventListener("touchmove",this.touchMove,false);
_c37.addEventListener("touchend",this.touchEnd,false);
}
}
};
PinFreezeContainer.prototype.removeTouchScrolling=function(){
if(!this.m_pinFreezeManager.isIWidgetMobile()){
return;
}
this.removeTouchScrollingEvents(this.getSection("pfMainOutput"));
this.removeTouchScrollingEvents(this.getSection("pfSideHeadings"));
this.removeTouchScrollingEvents(this.getSection("pfTopHeadings"));
};
PinFreezeContainer.prototype.removeTouchScrollingEvents=function(_c38){
if(!this.m_pinFreezeManager.isIWidgetMobile()){
return;
}
if(_c38){
if(document.detachEvent){
_c38.detachEvent("touchstart",this.touchStart);
_c38.detachEvent("touchmove",this.touchMove);
_c38.detachEvent("touchend",this.touchEnd);
}else{
_c38.removeEventListener("touchstart",this.touchStart,false);
_c38.removeEventListener("touchmove",this.touchMove,false);
_c38.removeEventListener("touchend",this.touchEnd,false);
}
}
};
PinFreezeContainer.prototype.touchMove=function(e){
if(this.m_pinFreezeContainer&&e&&e.changedTouches&&e.touches&&e.touches.length==1){
var _c3a=e.changedTouches[0];
if(_c3a&&_c3a.clientX&&_c3a.clientY){
var _c3b=parseInt(_c3a.clientX);
var _c3c=parseInt(_c3a.clientY);
if(this.m_pinFreezeContainer.touchMoveHandler(_c3b,_c3c)){
return stopEventBubble(e);
}
}
}
};
PinFreezeContainer.prototype.touchStart=function(e){
if(this.m_pinFreezeContainer&&e&&e.changedTouches&&e.touches&&e.touches.length==1){
var _c3e=e.changedTouches[0];
if(_c3e&&_c3e.clientX&&_c3e.clientY){
var _c3f=parseInt(_c3e.clientX);
var _c40=parseInt(_c3e.clientY);
this.m_pinFreezeContainer.touchStartHandler(_c3f,_c40);
}
}
};
PinFreezeContainer.prototype.touchStartHandler=function(_c41,_c42){
this.touchScrollSections=false;
this.touchPreviousX=_c41;
this.touchPreviousY=_c42;
};
PinFreezeContainer.prototype.touchEnd=function(e){
if(this.m_pinFreezeContainer&&this.m_pinFreezeContainer.touchEndHandler()){
stopEventBubble(e);
}
};
PinFreezeContainer.prototype.touchEndHandler=function(){
var _c44=this.touchScrollSections;
this.touchScrollSections=false;
this.touchPreviousX=-1;
this.touchPreviousY=-1;
return _c44;
};
PinFreezeContainer.prototype.touchMoveHandler=function(_c45,_c46){
var _c47=this.getSection("pfMainOutput");
if(!_c47){
return;
}
var _c48=this.getSectionHomeCell(_c47);
var _c49=this.getTopHeadingSectionHeight(_c48);
var _c4a=this.getSideHeadingSectionWidth(_c48);
var _c4b=_c46-this.touchPreviousY;
var _c4c=_c45-this.touchPreviousX;
if(this.touchScrollSections){
if(_c4b!=0){
var _c4d=_c47.scrollTop-_c4b;
_c4d=(_c4d>_c49)?_c4d:_c49;
_c47.scrollTop=_c4d;
var _c4e=this.getSection("pfSideHeadings");
if(_c4e){
_c4e.scrollTop=_c4d;
}
}
if(_c4c!=0){
var _c4f=_c47.scrollLeft-_c4c;
_c4f=(_c4f>_c4a)?_c4f:_c4a;
_c47.scrollLeft=_c4f;
var _c50=this.getSection("pfTopHeadings");
if(_c50){
_c50.scrollLeft=_c4f;
}
}
}else{
this.firstTouchMove(_c47,_c4c,_c4b,_c4a,_c49);
}
this.touchPreviousX=_c45;
this.touchPreviousY=_c46;
return this.touchScrollSections;
};
PinFreezeContainer.prototype.firstTouchMove=function(_c51,_c52,_c53,_c54,_c55){
var _c56=this.mostlyVerticalTouchMove(_c52,_c53);
var _c57=PinFreezeContainer.isSectionVisible(this.getSection("pfTopHeadings"));
var _c58=PinFreezeContainer.isSectionVisible(this.getSection("pfSideHeadings"));
if(_c56&&(!_c57||(_c53>0&&_c51.scrollTop<=_c55)||(_c53<0&&_c51.scrollTop+_c51.clientHeight>=_c51.scrollHeight))){
this.touchScrollSections=false;
}else{
if(!_c56&&(!_c58||(_c52>0&&_c51.scrollLeft<=_c54)||(_c52<0&&_c51.scrollLeft+_c51.clientWidth>=_c51.scrollWidth))){
this.touchScrollSections=false;
}else{
this.touchScrollSections=true;
}
}
};
PinFreezeContainer.prototype.mostlyVerticalTouchMove=function(_c59,_c5a){
var _c5b=(_c59>0)?_c59:0-_c59;
var _c5c=(_c5a>0)?_c5a:0-_c5a;
return (_c5c>_c5b);
};
PinFreezeContainer.prototype.destroy=function(){
this.removeTouchScrolling();
GUtil.destroyProperties(this);
};
function PinFreezeManager(oCV){
this.m_oCV=oCV;
this.m_viewerId=oCV.getId();
this.m_frozenInfo=null;
this.m_lastWidthProcessed=0;
this.m_lastHeightProcessed=0;
this.c_resizeTweekLimit=5;
this.m_repaintOnVisible=false;
};
PinFreezeManager.prototype.addContainerObject=function(lid,_c5f,_c60,_c61,_c62){
if(_c5f||_c60){
if(!this.m_frozenInfo){
this.m_frozenInfo={};
}
if(!this.m_frozenInfo[lid]){
this._createDefaultFrozenInfo(lid);
}
this.m_frozenInfo[lid].freezeTop=_c5f;
this.m_frozenInfo[lid].freezeSide=_c60;
var _c63=this.newContainer(lid,_c5f,_c60,_c61,_c62);
this.m_frozenInfo[lid].pinFreezeContainers.push(_c63);
return _c63;
}
return null;
};
PinFreezeManager.prototype.newContainer=function(lid,_c65,_c66,_c67,_c68){
return new PinFreezeContainer(this,lid,this.m_viewerId,_c65,_c66,_c67,_c68);
};
PinFreezeManager.prototype.clearPinInfo=function(lid){
if(!this.m_frozenInfo){
return;
}
if(lid){
if(this.m_frozenInfo[lid]){
delete this.m_frozenInfo[lid];
}
}else{
delete this.m_frozenInfo;
this.m_frozenInfo=null;
}
};
PinFreezeManager.prototype._createDefaultFrozenInfo=function(lid){
this.m_frozenInfo[lid]={"lid":lid,"freezeTop":false,"freezeSide":false,"pinFreezeContainers":[],"childContainers":{}};
};
PinFreezeManager.prototype._resetFrozenInfo=function(lid){
var _c6c=this.m_frozenInfo[lid];
if(_c6c){
delete _c6c.pinFreezeContainers;
_c6c.pinFreezeContainers=[];
_c6c.freezeTop=false;
_c6c.freezeSide=false;
}
};
PinFreezeManager.prototype.prepopulateFrozenInfo=function(_c6d){
var _c6e=getDescendantElementsByAttribute(_c6d,"table","lid","",false,-1,new RegExp("[\\s\\S]*"));
if(_c6e){
if(!this.m_frozenInfo){
this.m_frozenInfo={};
}
for(var i=0;i<_c6e.length;i++){
var _c70=_c6e[i];
if(_c70.getAttribute("id")=="rt"+this.m_viewerId){
continue;
}
var lid=this.removeNamespace(_c70.getAttribute("lid"));
if(this.m_frozenInfo[lid]&&this.m_frozenInfo[lid].childContainers){
continue;
}
if(!this.m_frozenInfo[lid]){
this._createDefaultFrozenInfo(lid);
}
if(!this.m_frozenInfo[lid].childContainers){
this.m_frozenInfo[lid].childContainers={};
}
var _c72=getDescendantElementsByAttribute(_c70,"table","lid","",false,-1,new RegExp("[\\s\\S]*"));
if(_c72){
for(var _c73=0;_c73<_c72.length;_c73++){
var _c74=_c72[_c73];
var _c75=this.removeNamespace(_c74.getAttribute("lid"));
if(!this.m_frozenInfo[lid].childContainers[_c75]){
var _c76=_c74.parentNode;
while(_c76&&!_c76.getAttribute("lid")){
_c76=_c76.parentNode;
}
if(_c76&&this.removeNamespace(_c76.getAttribute("lid"))==lid){
this.m_frozenInfo[lid].childContainers[_c75]=true;
}
}
}
}
}
this._updateParentContainerInfo();
}
};
PinFreezeManager.prototype._updateParentContainerInfo=function(){
for(var _c77 in this.m_frozenInfo){
var _c78=this.m_frozenInfo[_c77].childContainers;
if(_c78){
for(var _c79 in _c78){
if(this.m_frozenInfo[_c79]){
this.m_frozenInfo[_c79].parentContainer=_c77;
break;
}
}
}
}
};
PinFreezeManager.prototype.getTopLevelContainerLID=function(lid){
if(this.m_frozenInfo[lid]){
while(this.m_frozenInfo[lid].parentContainer){
lid=this.m_frozenInfo[lid].parentContainer;
}
}
return lid;
};
PinFreezeManager.prototype.freezeContainer=function(lid,_c7c,_c7d){
var _c7e=document.getElementById("CVReport"+this.m_viewerId);
this.prepopulateFrozenInfo(_c7e);
var _c7f=this.getTopLevelContainerLID(lid);
this.unfreezeAllNestedContainers(_c7f,_c7e);
this.m_frozenInfo[lid].freezeTop=_c7c;
this.m_frozenInfo[lid].freezeSide=_c7d;
var _c80=this._createPinAndFreezeObject(_c7e,_c7f);
this.m_lastWidthProcessed=0;
this.m_lastHeightProcessed=0;
this._resizePinFreezeObjects(_c80);
this.sectionStructureChange();
if(isIE()){
var obj=this;
setTimeout(function(){
obj.refresh();
},1);
var _c82=document.getElementById("RVContent"+this.m_viewerId);
this.m_oCV.repaintDiv(_c82);
}
return _c80;
};
PinFreezeManager.prototype.getInitialWidthThreshold=function(){
return document.body.clientWidth*3/4;
};
PinFreezeManager.prototype.getInitialHeightThreshold=function(){
return document.body.clientWidth*9/10;
};
PinFreezeManager.prototype.hasFrozenContainers=function(){
return ((this.m_frozenInfo)?true:false);
};
PinFreezeManager.prototype.hasFrozenRowHeadings=function(lid){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]){
return this.m_frozenInfo[lid].freezeSide?this.m_frozenInfo[lid].freezeSide:false;
}
return false;
};
PinFreezeManager.prototype.hasFrozenColumnHeadings=function(lid){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]){
return this.m_frozenInfo[lid].freezeTop?this.m_frozenInfo[lid].freezeTop:false;
}
return false;
};
PinFreezeManager.prototype.removeNamespace=function(idNS){
if(idNS.length>this.m_viewerId.length){
if(idNS.indexOf(this.m_viewerId)>0){
return idNS.substring(0,idNS.indexOf(this.m_viewerId));
}
}
return idNS;
};
PinFreezeManager.prototype.getContainer=function(lid,_c87){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]&&this.m_frozenInfo[lid].pinFreezeContainers[0]){
_c87=_c87?_c87:0;
return this.m_frozenInfo[lid].pinFreezeContainers[_c87];
}
return null;
};
PinFreezeManager.prototype.nodeToContainer=function(node){
var slid=PinFreezeContainer.nodeToSlid(node);
var _c8a=null;
if(slid){
var lid=this.removeNamespace(PinFreezeContainer.getLidFromSlid(slid));
_c8a=this.getContainer(lid);
}
return _c8a;
};
PinFreezeManager.prototype.getContainerElement=function(_c8c){
var lid=this.removeNamespace(_c8c.getAttribute("lid"));
if(lid){
var _c8e=this.getContainer(lid);
if(_c8e){
return _c8e.getContainer();
}
}
return null;
};
PinFreezeManager.prototype._createPinAndFreezeObject=function(_c8f,lid){
var _c91=null;
if(this.m_frozenInfo){
var _c92=this.m_frozenInfo[lid];
var _c93=_c92.initialLoad;
if(_c93){
delete _c92.initialLoad;
}
var _c94=_c92.freezeTop;
var _c95=_c92.freezeSide;
var _c96=null;
if(_c93&&_c92.pinFreezeContainers&&(_c94||_c95)){
_c96=_c92.pinFreezeContainers.slice(0);
}
var _c97=_c8f;
if(_c92&&_c92.parentContainer){
var _c98=getElementsByAttribute(_c8f,"table","lid",_c92.parentContainer+this.m_viewerId);
if(_c98){
for(parentIndex=0;parentIndex<_c98.length;parentIndex++){
if(!_c98[parentIndex].getAttribute("clonednode")){
_c97=_c98[parentIndex];
break;
}
}
}
}
if(_c92.childContainers){
for(var _c99 in _c92.childContainers){
var _c9a=this._createPinAndFreezeObject(_c97,_c99);
_c91=_c91?_c91:_c9a;
}
}
var _c9b=getElementsByAttribute(_c97,"table","lid",lid+this.m_viewerId);
if(_c9b&&_c9b.length>0){
delete _c92.pinFreezeContainers;
_c92.pinFreezeContainers=[];
}else{
return null;
}
if(_c9b&&(_c94||_c95)){
var _c9c=(_c91!==null);
for(var i=0;i<_c9b.length;i++){
var _c9e=_c9b[i];
if(_c9e.getAttribute("clonednode")=="true"){
continue;
}
_c91=this.addContainerObject(lid,_c94,_c95,_c9e,i);
if(_c91){
_c91.createPFContainer(_c97,_c9c);
if(_c93){
_c91.copyProperties(_c96[0]);
}
_c91.freezeContainerInReport(_c8f);
}
}
}
}
return _c91;
};
PinFreezeManager.prototype.renderReportWithFrozenContainers=function(_c9f){
if(this.m_frozenInfo){
var _ca0=false;
var _ca1=null;
for(var _ca2 in this.m_frozenInfo){
var _ca3=this.m_frozenInfo[_ca2];
if(!_ca0){
_ca0=_ca3.initialLoad;
}
if(!_ca3.parentContainer){
var temp=this._createPinAndFreezeObject(_c9f,_ca3.lid);
_ca1=_ca1?_ca1:temp;
}
}
if(!_ca0&&_ca1){
this._resizePinFreezeObjects(_ca1);
}
this.refresh();
}
};
PinFreezeManager.prototype._resizePinFreezeObjects=function(_ca5){
var _ca6,_ca7;
var _ca8=this.m_oCV.getViewerWidget();
if(_ca8){
var size=_ca8.getWidgetSize();
_ca7=(size&&size.w&&(size.w<this.getInitialWidthThreshold()))?size.w:_ca5.getClientWidth();
_ca6=(size&&size.h&&(size.h<this.getInitialHeightThreshold()))?size.h:_ca5.getClientHeight();
}else{
var _caa=document.getElementById("RVContent"+this.m_viewerId);
var _cab=document.getElementById("mainViewerTable"+this.m_viewerId);
_ca7=_caa.clientWidth;
_ca6=_cab.clientHeight;
}
this.m_lastWidthProcessed=0;
this.m_lastHeightProcessed=0;
this.resize(_ca7,_ca6);
};
PinFreezeManager.prototype.resize=function(_cac,_cad){
var _cae=(Math.abs(_cac-this.m_lastWidthProcessed)<this.c_resizeTweekLimit);
var _caf=(Math.abs(_cad-this.m_lastHeightProcessed)<this.c_resizeTweekLimit);
if(_cae&&_caf){
return;
}
var _cb0=(Math.abs(_cac-this.m_lastWidthProcessed)>2)?_cac:0;
var _cb1=(Math.abs(_cad-this.m_lastHeightProcessed)>2)?_cad:0;
for(var lid in this.m_frozenInfo){
if(!this.m_frozenInfo[lid].parentContainer){
this.resizeContainer(lid,_cb0,_cb1);
}
}
this.m_lastWidthProcessed=_cac;
this.m_lastHeightProcessed=_cad;
};
PinFreezeManager.prototype.resizeContainer=function(lid,_cb4,_cb5){
var _cb6=this.m_frozenInfo[lid];
if(_cb6){
var _cb7=null;
if(_cb6.childContainers){
var _cb8=_cb4>10?_cb4-10:_cb4;
var _cb9=_cb5>10?_cb5-10:_cb5;
for(var _cba in _cb6.childContainers){
_cb7=this.resizeContainer(_cba,_cb8,_cb9);
}
}
var _cbb=_cb6.pinFreezeContainers;
var _cbc=null;
var _cbd=null;
if(_cbb){
for(var i=0;i<_cbb.length;i++){
_cbc=_cbb[i];
_cbc.resize(_cb4,_cb5,_cb6.parentContainer,_cb7);
var _cbf=_cbc.getContainer();
if(_cbf&&(!_cbd||(_cbd.width<_cbf.clientWidth))){
_cbd={"width":_cbf.clientWidth,"lid":_cbc.m_lidNS};
}
}
}
return _cbd;
}
};
PinFreezeManager.prototype.processAutoResize=function(_cc0,_cc1){
this.m_lastWidthProcessed=_cc0;
this.m_lastHeightProcessed=_cc1;
};
PinFreezeManager.prototype.onSetVisible=function(){
this.refresh();
if(this.m_repaintOnVisible){
this.rePaint();
this.m_repaintOnVisible=false;
}
};
PinFreezeManager.prototype.onResizeCanvas=function(_cc2){
if(_cc2){
this.rePaint();
}else{
this.m_repaintOnVisible=true;
}
};
PinFreezeManager.prototype.rePaint=function(){
for(var lid in this.m_frozenInfo){
if(!this.m_frozenInfo[lid].parentContainer){
this.resizeContainer(lid,this.m_lastWidthProcessed,this.m_lastHeightProcessed);
}
}
};
PinFreezeManager.prototype.refresh=function(){
for(var _cc4 in this.m_frozenInfo){
var _cc5=this.m_frozenInfo[_cc4].pinFreezeContainers;
if(_cc5){
for(var i=0;i<_cc5.length;i++){
var _cc7=_cc5[i];
_cc7.synchScroll();
_cc7.synchVScroll();
}
}
}
};
PinFreezeManager.prototype.freezeContainerRowHeadings=function(lid){
return this.freezeContainer(lid,this.hasFrozenColumnHeadings(lid),true);
};
PinFreezeManager.prototype.freezeSelectedRowHeadings=function(){
var lid=this.getValidSelectedContainerId(false);
if(lid){
this.m_oCV.getSelectionController().resetSelections();
return this.freezeContainerRowHeadings(lid);
}
return null;
};
PinFreezeManager.prototype.canFreezeSelectedRowHeadings=function(){
var lid=this.getValidSelectedContainerId(false);
if(lid){
return (!this.hasFrozenRowHeadings(lid));
}
return false;
};
PinFreezeManager.prototype.unfreezeContainerRowHeadings=function(lid){
this.freezeContainer(lid,this.hasFrozenColumnHeadings(lid),false);
};
PinFreezeManager.prototype.unfreezeSelectedRowHeadings=function(){
var lid=this.getValidSelectedContainerId(false);
if(lid){
this.m_oCV.getSelectionController().resetSelections();
this.unfreezeContainerRowHeadings(lid);
}
};
PinFreezeManager.prototype.canUnfreezeSelectedRowHeadings=function(){
var lid=this.getValidSelectedContainerId(false);
if(lid){
return (this.hasFrozenRowHeadings(lid));
}
return false;
};
PinFreezeManager.prototype.freezeContainerColumnHeadings=function(lid){
return this.freezeContainer(lid,true,this.hasFrozenRowHeadings(lid));
};
PinFreezeManager.prototype.freezeSelectedColumnHeadings=function(){
var lid=this.getValidSelectedContainerId(true);
if(lid){
this.m_oCV.getSelectionController().resetSelections();
return this.freezeContainerColumnHeadings(lid);
}
return null;
};
PinFreezeManager.prototype.canFreezeSelectedColumnHeadings=function(){
var lid=this.getValidSelectedContainerId(true);
if(lid){
return (!this.hasFrozenColumnHeadings(lid));
}
return false;
};
PinFreezeManager.prototype.unfreezeContainerColumnHeadings=function(lid){
this.freezeContainer(lid,false,this.hasFrozenRowHeadings(lid));
};
PinFreezeManager.prototype.unfreezeSelectedColumnHeadings=function(){
var lid=this.getValidSelectedContainerId(true);
if(lid){
this.m_oCV.getSelectionController().resetSelections();
this.unfreezeContainerColumnHeadings(lid);
}
};
PinFreezeManager.prototype.canUnfreezeSelectedColumnHeadings=function(){
var lid=this.getValidSelectedContainerId(true);
if(lid){
return (this.hasFrozenColumnHeadings(lid));
}
return false;
};
PinFreezeManager.prototype.getValidSelectedContainerId=function(_cd4){
var _cd5=this.m_oCV.getSelectionController().getAllSelectedObjects();
if(_cd5&&_cd5.length&&(_cd5[0].getDataContainerType()==="crosstab"||(_cd4&&_cd5[0].getDataContainerType()==="list"))){
var lid=(_cd5[0].getLayoutElementId());
if(lid){
if(!this.hasPromptControlsInFreezableCells(lid)){
return this.removeNamespace(lid);
}
}
}
return null;
};
PinFreezeManager.prototype.hasPromptControlsInFreezableCells=function(lid){
var _cd8=this.m_oCV.getLayoutElementFromLid(lid);
var _cd9=getElementsByAttribute(_cd8,["td","th"],"type","columnTitle");
var _cda=new RegExp("(^|[W])clsPromptComponent($|[W])");
var _cdb=isIE()?"className":"class";
for(var j in _cd9){
if(_cd9.hasOwnProperty(j)){
var _cdd=getElementsByAttribute(_cd9[j],"*",_cdb,null,1,_cda);
if(_cdd.length>0){
return true;
}
}
}
return false;
};
PinFreezeManager.prototype.unfreeze=function(lid,_cdf,_ce0){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]){
var _ce1=this.m_frozenInfo[lid].pinFreezeContainers;
if(_ce1){
for(var i=0;i<_ce1.length;i++){
var _ce3=_ce1[i];
_ce3.unfreeze(_cdf);
}
if(_ce0){
this._resetFrozenInfo(lid);
}
}
}
};
PinFreezeManager.prototype.unfreezeAllNestedContainers=function(lid,_ce5){
var _ce6=this.m_frozenInfo[lid];
if(_ce6){
if(_ce6.freezeTop||_ce6.freezeSide){
this.unfreeze(lid,_ce5,false);
}
if(_ce6.childContainers){
for(var _ce7 in _ce6.childContainers){
this.unfreezeAllNestedContainers(_ce7,_ce5);
}
}
}
};
PinFreezeManager.prototype.isNodeVisible=function(node){
var slid=PinFreezeContainer.nodeToSlid(node);
if(!slid){
return true;
}
var lid=this.removeNamespace(PinFreezeContainer.getLidFromSlid(slid));
var _ceb=this.getContainer(lid);
if(!_ceb){
return true;
}
var _cec=PinFreezeContainer.getSectionNameFromSlid(slid);
var _ced=_ceb.getSection(_cec);
var _cee=null,_cef=null;
var _cf0=node;
var _cf1=null;
while(_cf0&&_cf0!==_ced&&!_cee&&!_cef){
_cee=_ceb.getMain(_cf0);
_cef=_ceb.getCopy(_cf0);
_cf1=_cf0;
_cf0=_cf0.parentNode;
}
var _cf2=_cee?true:false;
var _cf3=_cef?true:false;
if(_cf2){
return _ceb.getCopy(_cee)===_cf1;
}else{
if(_cf3){
return _ceb.getCopy(_cf1)?false:true;
}else{
return true;
}
}
};
PinFreezeManager.prototype.sectionStructureChange=function(){
var _cf4=this.m_oCV.getViewerWidget();
if(_cf4&&_cf4.getAnnotationHelper()){
_cf4.getAnnotationHelper().repositionCommentIndicators();
}
};
PinFreezeManager.prototype.deepCloneNode=function(_cf5){
var copy=_cf5.cloneNode(true);
var _cf7=this.m_oCV.getViewerWidget();
if(_cf7){
if(_cf7.reportContainsDijits()){
var _cf8=getElementsByAttribute(copy,"*","widgetid","*");
if(_cf8&&_cf8.length){
for(var i=0;i<_cf8.length;i++){
_cf8[i].parentNode.removeChild(_cf8[i]);
}
}
}
}
return copy;
};
PinFreezeManager.prototype.toJSONString=function(){
var _cfa="";
var _cfb="";
for(var _cfc in this.m_frozenInfo){
if(_cfa.length>0){
_cfa+=",";
}
var _cfd=this.m_frozenInfo[_cfc];
_cfa+="{";
_cfa+="\"lid\":\""+_cfd.lid.replace("\"","\\\"")+"\",";
_cfa+="\"freezeTop\":"+_cfd.freezeTop+",";
_cfa+="\"freezeSide\":"+_cfd.freezeSide+",";
if(_cfd.parentContainer){
_cfa+="\"parentContainer\":\""+_cfd.parentContainer+"\",";
}
if(_cfd.pinFreezeContainers&&_cfd.pinFreezeContainers.length>0){
_cfa+="\"properties\":"+_cfd.pinFreezeContainers[0].toJSONString()+",";
}
_cfa+="\"childContainers\": {";
if(_cfd.childContainers){
var _cfe=true;
for(var _cff in _cfd.childContainers){
if(!_cfe){
_cfa+=",";
}
_cfa+="\""+_cff+"\":true";
_cfe=false;
}
}
_cfa+="}}";
}
if(_cfa.length>0){
_cfb="{\"version\":1, \"containers\":["+_cfa+"]}";
}
return _cfb;
};
PinFreezeManager.prototype.fromJSONString=function(_d00){
if(!_d00||_d00.length===0){
return;
}
var _d01=null;
try{
_d01=eval("("+_d00+")");
}
catch(e){
if(typeof console!="undefined"){
console.log("PinFreezeManager.prototype.fromJSON could not parse JSON - "+_d00);
console.log(e);
}
}
if(!_d01){
return;
}
var _d02=_d01.containers;
var _d03=_d01.version;
if(_d02.length>0){
this.m_frozenInfo={};
}
for(var _d04=0;_d04<_d02.length;_d04++){
var _d05=_d02[_d04];
var lid=_d05.lid;
var _d07=_d05.freezeTop;
var _d08=_d05.freezeSide;
var _d09=document.getElementById("CVReport"+this.m_viewerId);
var _d0a=getElementsByAttribute(_d09,"table","lid",lid+this.m_viewerId);
var _d0b=[];
if(_d0a&&(_d07||_d08)){
for(var i=0;i<_d0a.length;i++){
var _d0d=_d0a[i];
var _d0e=new PinFreezeContainer(this,lid,this.m_viewerId,_d05.freezeTop,_d05.freezeSide,_d0d,i);
if(_d05.properties){
applyJSONProperties(_d0e,_d05.properties);
}
_d0b.push(_d0e);
}
}
this.m_frozenInfo[lid]={"lid":lid,"freezeTop":_d07,"freezeSide":_d08,"pinFreezeContainers":_d0b,"initialLoad":true};
if(_d03>=1){
if(_d05.childContainers){
this.m_frozenInfo[lid].childContainers=_d05.childContainers;
}
if(_d05.parentContainer){
this.m_frozenInfo[lid].parentContainer=_d05.parentContainer;
}
}
}
};
PinFreezeManager.prototype.removeIdAttribute=function(_d0f){
var _d10=_d0f.getAttribute("id");
if(_d10!==null&&_d10!==""){
_d0f.removeAttribute("id");
}
var _d11=getElementsByAttribute(_d0f,"*","id","*");
if(_d11&&_d11.length){
for(var i=0;i<_d11.length;i++){
_d11[i].removeAttribute("id");
}
}
return _d0f;
};
PinFreezeManager.prototype.isElementInMainOutput=function(_d13){
return PinFreezeContainer.isElementInMainOutput(_d13);
};
PinFreezeManager.prototype.isIWidgetMobile=function(){
return (this.m_oCV&&this.m_oCV.isIWidgetMobile());
};
PinFreezeManager.prototype.destroy=function(){
GUtil.destroyProperties(this);
};
function AuthoredDrillAction(){
this.m_drillTargetSpecification="";
};
AuthoredDrillAction.prototype=new CognosViewerAction();
AuthoredDrillAction.prototype.setRequestParms=function(_d14){
this.m_drillTargetSpecification=_d14;
};
AuthoredDrillAction.prototype.executeDrillTarget=function(_d15){
var _d16=XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(_d15));
var _d17=encodeURIComponent(_d16.getAttribute("bookmarkRef"));
var _d18=_d16.getAttribute("path");
var _d19=this._shouldShowInNewWindow(_d16);
var oCV=this.getCognosViewer();
if((_d17!==null&&_d17!=="")&&(_d18===null||_d18==="")){
var _d1b=_d16.getAttribute("bookmarkPage");
if(_d1b&&_d1b!==""){
oCV.executeAction("GotoPage",{"pageNumber":_d1b,"anchorName":_d17});
}else{
document.location="#"+_d17;
}
}else{
var _d1c="";
if(_d19){
_d1c="_blank";
}
var _d1d=[];
var _d1e=[];
_d1e.push("obj");
_d1e.push(_d18);
_d1d[_d1d.length]=_d1e;
var _d1f=false;
var _d20,_d21,_d22,_d23,sNil;
var _d25=XMLHelper_FindChildrenByTagName(_d16,"drillParameter",false);
for(var _d26=0;_d26<_d25.length;++_d26){
_d20=[];
_d21=_d25[_d26];
_d22=_d21.getAttribute("value");
_d23=_d21.getAttribute("name");
if(_d22!==null&&_d22!==""){
_d20.push("p_"+_d23);
_d20.push(this.buildSelectionChoicesSpecification(_d21));
}
sNil=_d21.getAttribute("nil");
if(sNil!==null&&sNil!==""){
_d20.push("p_"+_d23);
_d20.push(this.buildSelectionChoicesNilSpecification());
}
if(_d20.length>0){
_d1d[_d1d.length]=_d20;
}
if(!_d1f){
var _d27=_d21.getAttribute("propertyToPass");
_d1f=(_d27&&_d27.length>0)?true:false;
}
}
var _d28=_d16.getAttribute("method");
var _d29=_d16.getAttribute("outputFormat");
var _d2a=_d16.getAttribute("outputLocale");
var _d2b=_d16.getAttribute("prompt");
var _d2c=_d16.getAttribute("dynamicDrill");
var _d2d=this.getXMLNodeAsString(_d16,"parameters");
var _d2e=this.getXMLNodeAsString(_d16,"objectPaths");
var _d2f=oCV.getId();
var _d30=document.forms["formWarpRequest"+_d2f];
var _d31=oCV.getAdvancedServerProperty("VIEWER_JS_CALL_FORWARD_DRILLTHROUGH_TO_SELF");
if((!_d31||_d31.toLowerCase()!=="false")&&_d2b!="true"&&this.isSameReport(_d30,_d18)&&this.isSameReportFormat(_d29)&&!_d19&&!_d1f){
var _d32=new ViewerDispatcherEntry(oCV);
_d32.addFormField("ui.action","forward");
if(oCV!==null&&typeof oCV.rvMainWnd!="undefined"){
oCV.rvMainWnd.addCurrentReportToReportHistory();
var _d33=oCV.rvMainWnd.saveReportHistoryAsXML();
_d32.addFormField("cv.previousReports",_d33);
}
for(_d26=0;_d26<_d25.length;++_d26){
_d20=[];
_d21=_d25[_d26];
_d22=_d21.getAttribute("value");
_d23=_d21.getAttribute("name");
sNil=_d21.getAttribute("nil");
if((sNil===null||sNil==="")&&(_d22===null||_d22==="")){
_d20.push("p_"+_d23);
_d20.push(this.buildSelectionChoicesNilSpecification());
}
if(_d20.length>0){
_d1d[_d1d.length]=_d20;
}
}
for(_d26=1;_d26<_d1d.length;_d26++){
_d32.addFormField(_d1d[_d26][0],_d1d[_d26][1]);
}
_d32.addFormField("_drillThroughToSelf","true");
if(oCV.m_tabsPayload&&oCV.m_tabsPayload.tabs){
_d32.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",oCV.m_tabsPayload.tabs[0].id);
}
oCV.setUsePageRequest(true);
oCV.dispatchRequest(_d32);
if(typeof oCV.m_viewerFragment=="undefined"){
var _d34=getCognosViewerObjectRefAsString(_d2f);
setTimeout(_d34+".getRequestIndicator().show()",10);
}
}else{
doSingleDrill(_d1c,_d1d,_d28,_d29,_d2a,_d17,_d2d,_d2e,this.getCognosViewer().getId(),_d2b,_d2c);
}
}
};
AuthoredDrillAction.prototype._shouldShowInNewWindow=function(_d35){
return _d35.getAttribute("showInNewWindow")=="true";
};
AuthoredDrillAction.prototype.isSameReport=function(_d36,_d37){
if(_d36["ui.object"]&&_d37==_d36["ui.object"].value){
return true;
}
return false;
};
AuthoredDrillAction.prototype.isSameReportFormat=function(_d38){
var _d39=this.getCognosViewer().envParams["run.outputFormat"];
if(_d39){
if(_d38==_d39){
return true;
}else{
if(_d39=="HTML"&&_d38=="HTMLFragment"){
return true;
}
}
}
return false;
};
AuthoredDrillAction.prototype.getXMLNodeAsString=function(_d3a,_d3b){
var sXML="";
if(_d3a!=null){
var node=XMLHelper_FindChildByTagName(_d3a,_d3b,false);
if(node!=null){
sXML=XMLBuilderSerializeNode(node);
}
}
return sXML;
};
AuthoredDrillAction.prototype.execute=function(_d3e){
if(this.m_drillTargetSpecification!=""){
this.executeDrillTarget(this.m_drillTargetSpecification);
}else{
if(typeof _d3e!="undefined"){
var _d3f=this.getCognosViewer().getDrillTargets();
var _d40=this.getAuthoredDrillThroughContext(_d3e,_d3f);
var _d41=_d40.childNodes;
if(_d41.length==1){
this.executeDrillTarget(XMLBuilderSerializeNode(_d41[0]));
}else{
doMultipleDrills(XMLBuilderSerializeNode(_d40),this.getCognosViewer().getId());
}
}
}
};
AuthoredDrillAction.prototype.showDrillTargets=function(_d42){
var _d43="<context>";
for(var _d44=0;_d44<_d42.length;++_d44){
var _d45=_d42[_d44];
_d43+="<member>";
var _d46=_d45.getAttribute("label");
_d43+="<name>";
_d43+=sXmlEncode(_d46);
_d43+="</name>";
var _d47=_d45.getAttribute("path");
_d43+="<drillThroughSearchPath>";
_d43+=sXmlEncode(_d47);
_d43+="</drillThroughSearchPath>";
var _d48=_d45.getAttribute("method");
_d43+="<drillThroughAction>";
_d43+=sXmlEncode(_d48);
_d43+="</drillThroughAction>";
var _d49=_d45.getAttribute("outputFormat");
_d43+="<drillThroughFormat>";
_d43+=sXmlEncode(_d49);
_d43+="</drillThroughFormat>";
var _d4a="parent."+this.getTargetReportRequestString(_d45);
_d43+="<data>";
_d43+=sXmlEncode(_d4a);
_d43+="</data>";
_d43+="</member>";
}
_d43+="</context>";
};
AuthoredDrillAction.prototype.populateContextMenu=function(_d4b){
var _d4c=this.getCognosViewer();
var _d4d=_d4c.rvMainWnd.getToolbarControl();
var _d4e=null;
if(typeof _d4d!="undefined"&&_d4d!=null){
var _d4f=_d4d.getItem("goto");
if(_d4f){
_d4e=_d4f.getMenu();
}
}
var _d50=_d4c.rvMainWnd.getContextMenu();
var _d51=null;
if(typeof _d50!="undefined"&&_d50!=null){
_d51=_d50.getGoToMenuItem().getMenu();
}
if(_d4e!=null||_d51!=null){
var _d52=this.getCognosViewer().getDrillTargets();
var _d53=this.getAuthoredDrillThroughContext(_d4b,_d52);
var _d54=_d53.childNodes;
if(_d54.length>0){
for(var _d55=0;_d55<_d54.length;++_d55){
var _d56=_d54[_d55];
var _d57=getCognosViewerObjectRefAsString(this.getCognosViewer().getId())+".m_oDrillMgr.executeAuthoredDrill(\""+encodeURIComponent(XMLBuilderSerializeNode(_d56))+"\");";
var _d58=this.getTargetReportIconPath(_d56);
var _d59=_d56.getAttribute("label");
if(isViewerBidiEnabled()){
var bidi=BidiUtils.getInstance();
_d59=bidi.btdInjectUCCIntoStr(_d59,getViewerBaseTextDirection());
}
if(_d4e!=null){
new CMenuItem(_d4e,_d59,_d57,_d58,gMenuItemStyle,_d4c.getWebContentRoot(),_d4c.getSkin());
}
if(_d51!=null){
new CMenuItem(_d51,_d59,_d57,_d58,gMenuItemStyle,_d4c.getWebContentRoot(),_d4c.getSkin());
}
}
}
}
};
AuthoredDrillAction.prototype.buildSelectionChoicesNilSpecification=function(){
return "<selectChoices/>";
};
AuthoredDrillAction.prototype.buildSelectionChoicesSpecification=function(_d5b){
var _d5c="";
var _d5d=_d5b.getAttribute("value");
if(_d5d!=null){
var _d5e=_d5b.getAttribute("propertyToPass");
_d5c+="<selectChoices";
if(_d5e!=null&&_d5e!=""){
_d5c+=" propertyToPass=\"";
_d5c+=sXmlEncode(_d5e);
_d5c+="\"";
}
_d5c+=">";
if(_d5d.indexOf("<selectChoices>")!=-1){
_d5c+=_d5d.substring(_d5d.indexOf("<selectChoices>")+15);
}else{
if(_d5d!=""){
_d5c+="<selectOption ";
var sMun=_d5b.getAttribute("mun");
if(sMun!=null&&sMun!=""){
var _d60=sXmlEncode(sMun);
_d5c+="useValue=\"";
_d5c+=_d60;
_d5c+="\" ";
_d5c+="mun=\"";
_d5c+=_d60;
_d5c+="\" ";
_d5c+="displayValue=\"";
_d5c+=sXmlEncode(_d5d);
_d5c+="\"";
}else{
_d5c+="useValue=\"";
_d5c+=sXmlEncode(_d5d);
_d5c+="\" ";
var _d61=_d5b.getAttribute("displayValue");
if(_d61==null||_d61==""){
_d61=_d5d;
}
_d5c+="displayValue=\"";
_d5c+=sXmlEncode(_d61);
_d5c+="\"";
}
_d5c+="/>";
_d5c+="</selectChoices>";
}
}
}
return _d5c;
};
AuthoredDrillAction.prototype.getPropertyToPass=function(_d62,_d63){
if(_d62!=null&&_d62!=""&&_d63!=null){
var _d64=_d63.childNodes;
if(_d64!=null){
for(var _d65=0;_d65<_d64.length;++_d65){
var _d66=_d64[_d65];
var _d67="";
if(_d66.getAttribute("name")!=null){
_d67=_d66.getAttribute("name");
}
if(_d67==_d62){
return _d66.getAttribute("propertyToPass");
}
}
}
}
return "";
};
AuthoredDrillAction.prototype.getTargetReportRequestString=function(_d68){
var _d69="";
var _d6a=_d68.getAttribute("bookmarkRef");
var _d6b=_d68.getAttribute("path");
var _d6c=_d68.getAttribute("showInNewWindow");
if((_d6a!=null&&_d6a!="")&&(_d6b==null||_d6b=="")){
_d69+="document.location=\"#";
_d69+=_d6a;
_d69+="\";";
}else{
_d69+="doSingleDrill(";
if(_d6c=="true"){
_d69+="\"_blank\",";
}else{
_d69+="\"\",";
}
_d69+="[[\"obj\",\"";
_d69+=encodeURIComponent(_d6b);
_d69+="\"]";
var _d6d=XMLHelper_FindChildrenByTagName(_d68,"drillParameter",false);
for(var _d6e=0;_d6e<_d6d.length;++_d6e){
var _d6f=_d6d[_d6e];
var _d70=_d6f.getAttribute("value");
var _d71=_d6f.getAttribute("name");
if(_d70!=null&&_d70!=""){
_d69+=", [\"p_"+_d71+"\",\""+encodeURIComponent(this.buildSelectionChoicesSpecification(_d6f))+"\"]";
}
var sNil=_d6f.getAttribute("nil");
if(sNil!=null&&sNil!=""){
_d69+="\", [\"p_"+_d71+"\",\""+encodeURIComponent(this.buildSelectionChoicesNilSpecification())+"\"]";
}
}
_d69+="],";
var _d73=_d68.getAttribute("method");
_d69+="\""+encodeURIComponent(_d73)+"\",";
var _d74=_d68.getAttribute("outputFormat");
_d69+="\""+encodeURIComponent(_d74)+"\",";
var _d75=_d68.getAttribute("outputLocale");
_d69+="\""+encodeURIComponent(_d75)+"\",";
_d69+="\""+encodeURIComponent(_d6a)+"\",";
var _d76=XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(_d68,"parameters",false));
_d69+="\""+encodeURIComponent(_d76)+"\",";
var _d77=XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(_d68,"objectPaths",false));
_d69+="\""+encodeURIComponent(_d77)+"\",";
_d69+="\""+encodeURIComponent(this.getCognosViewer().getId())+"\",";
var _d78=_d68.getAttribute("prompt");
_d69+="\""+encodeURIComponent(_d78)+"\",";
var _d79=_d68.getAttribute("dynamicDrill");
_d69+=" "+encodeURIComponent(_d79);
_d69+=");";
}
return _d69;
};
AuthoredDrillAction.prototype.getTargetReportIconPath=function(_d7a){
var _d7b="";
var _d7c=_d7a.getAttribute("bookmarkRef");
var _d7d=XMLHelper_FindChildByTagName(_d7a,"drillParameter",false);
if((_d7c!=null&&_d7c!="")&&_d7d==null){
_d7b="/common/images/spacer.gif";
}else{
var _d7e=_d7a.getAttribute("method");
switch(_d7e){
case "editAnalysis":
_d7b="/ps/portal/images/icon_ps_analysis.gif";
break;
case "editQuery":
_d7b="/ps/portal/images/icon_qs_query.gif";
break;
case "execute":
_d7b="/ps/portal/images/action_run.gif";
break;
case "view":
var _d7f=_d7a.getAttribute("outputFormat");
switch(_d7f){
case "HTML":
case "XHTML":
case "HTMLFragment":
_d7b="/ps/portal/images/icon_result_html.gif";
break;
case "PDF":
_d7b="/ps/portal/images/icon_result_pdf.gif";
break;
case "XML":
_d7b="/ps/portal/images/icon_result_xml.gif";
break;
case "CSV":
_d7b="/ps/portal/images/icon_result_csv.gif";
break;
case "XLS":
_d7b="/ps/portal/images/icon_result_excel.gif";
break;
case "SingleXLS":
_d7b="/ps/portal/images/icon_result_excel_single.gif";
break;
case "XLWA":
_d7b="/ps/portal/images/icon_result_excel_web_arch.gif";
break;
default:
_d7b="/common/images/spacer.gif";
}
break;
default:
_d7b="/common/images/spacer.gif";
}
}
return this.getCognosViewer().getWebContentRoot()+_d7b;
};
AuthoredDrillAction.prototype.getAuthoredDrillThroughContext=function(_d80,_d81){
if(typeof _d80!="string"||typeof _d81!="object"){
return null;
}
var _d82=XMLBuilderLoadXMLFromString(_d80);
if(_d82==null||_d82.firstChild==null){
return null;
}
var _d83=XMLHelper_GetFirstChildElement(_d82);
if(XMLHelper_GetLocalName(_d83)!="AuthoredDrillTargets"){
return null;
}
var _d84=XMLHelper_GetFirstChildElement(_d83);
if(XMLHelper_GetLocalName(_d84)!="rvDrillTargets"){
return null;
}
var _d85=_d84.childNodes;
if(_d85===null||_d85.length===0){
return null;
}
var _d86=self.XMLBuilderCreateXMLDocument("rvDrillTargets");
for(var _d87=0;_d87<_d85.length;++_d87){
if(typeof _d85[_d87].getAttribute=="undefined"){
continue;
}
var _d88=_d86.createElement("drillTarget");
_d86.documentElement.appendChild(_d88);
var _d89=_d85[_d87].getAttribute("bookmarkRef");
if(_d89===null){
_d88.setAttribute("bookmarkRef","");
}else{
_d88.setAttribute("bookmarkRef",_d89);
}
var _d8a=_d85[_d87].getAttribute("bookmarkPage");
if(_d8a===null){
_d88.setAttribute("bookmarkPage","");
}else{
_d88.setAttribute("bookmarkPage",_d8a);
}
var _d8b=_d85[_d87].getAttribute("drillIdx");
if(_d8b==null){
continue;
}
if(_d8b>=_d81.length){
continue;
}
var _d8c=_d81[_d8b];
if(typeof _d8c!="object"){
continue;
}
_d88.setAttribute("outputFormat",_d8c.getOutputFormat());
_d88.setAttribute("outputLocale",_d8c.getOutputLocale());
_d88.setAttribute("prompt",_d8c.getPrompt());
_d88.setAttribute("dynamicDrill",_d8c.isDynamicDrillThrough()?"true":"false");
var _d8d=_d85[_d87].getAttribute("label");
if(_d8d===null||_d8d===""){
_d8d=_d8c.getLabel();
}
_d88.setAttribute("label",_d8d);
_d88.setAttribute("path",_d8c.getPath());
_d88.setAttribute("showInNewWindow",_d8c.getShowInNewWindow());
_d88.setAttribute("method",_d8c.getMethod());
var _d8e=_d84;
var _d8f="";
var _d90=_d8c.getParameterProperties();
if(typeof _d90!="undefined"&&_d90!=null&&_d90!=""){
_d8f=XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(_d8c.getParameterProperties()));
}
while(_d8e){
var _d91=_d8e.childNodes[_d87].childNodes;
for(var _d92=0;_d92<_d91.length;++_d92){
var _d93=_d91[_d92].cloneNode(true);
if(_d8f){
var _d94=this.getPropertyToPass(_d93.getAttribute("name"),_d8f);
if(_d94!=null&&_d94!=""){
_d93.setAttribute("propertyToPass",_d94);
}
}
_d88.appendChild(_d93);
}
_d8e=_d8e.nextSibling;
}
var _d95="<root xmlns:bus=\"http://developer.cognos.com/schemas/bibus/3/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">";
var _d96="</root>";
var _d97=_d95+_d8c.getParameters()+_d96;
var _d98=XMLBuilderLoadXMLFromString(_d97);
var _d99=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(_d98));
if(_d99){
_d88.appendChild(_d99.cloneNode(true));
}
var _d9a=_d95+_d8c.getObjectPaths()+_d96;
var _d9b=XMLBuilderLoadXMLFromString(_d9a);
_d99=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(_d9b));
if(_d99){
_d88.appendChild(_d99.cloneNode(true));
}
}
return XMLHelper_GetFirstChildElement(_d86);
};
function XmlHttpObject(){
this.m_formFields=new CDictionary();
this.xmlHttp=XmlHttpObject.createRequestObject();
this.m_requestIndicator=null;
this.m_httpCallbacks={};
this.m_asynch=true;
this.m_headers=null;
};
XmlHttpObject.prototype.setHeaders=function(_d9c){
this.m_headers=_d9c;
};
XmlHttpObject.prototype.getHeaders=function(){
return this.m_headers;
};
XmlHttpObject.prototype.newRequest=function(){
var _d9d=new XmlHttpObject();
_d9d.init(this.m_action,this.m_gateway,this.m_url,this.m_asynch);
this.executeHttpCallback("newRequest");
return _d9d;
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
XmlHttpObject.prototype.executeHttpCallback=function(_d9e){
if(this.m_httpCallbacks&&this.m_httpCallbacks[_d9e]){
var _d9f=this.concatResponseArguments(this.m_httpCallbacks.customArguments);
var _da0=GUtil.generateCallback(this.m_httpCallbacks[_d9e].method,_d9f,this.m_httpCallbacks[_d9e].object);
_da0();
return true;
}
return false;
};
XmlHttpObject.prototype.setCallbacks=function(_da1){
if(!this.m_httpCallbacks){
this.m_httpCallbacks={};
}
for(callback in _da1){
this.m_httpCallbacks[callback]=_da1[callback];
}
};
XmlHttpObject.prototype.getCallbacks=function(){
return this.m_httpCallbacks;
};
XmlHttpObject.createRequestObject=function(){
var _da2=null;
if(window.XMLHttpRequest){
_da2=new XMLHttpRequest();
}else{
if(window.ActiveXObject){
_da2=new ActiveXObject("Msxml2.XMLHTTP");
}else{
}
}
return _da2;
};
XmlHttpObject.prototype.waitForXmlHttpResponse=function(){
var _da3=this.xmlHttp;
if(_da3&&_da3.readyState===4){
if(_da3.status===200){
this.httpSuccess();
}else{
this.httpError();
}
}else{
}
};
XmlHttpObject.prototype.init=function(_da4,_da5,url,_da7){
this.m_action=_da4;
this.m_gateway=_da5;
this.m_url=url;
this.m_asynch=_da7;
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
XmlHttpObject.prototype.sendHtmlRequest=function(_da8,_da9,url,_dab){
var _dac=this.xmlHttp;
if(_dac){
_dac.open(_da8,_da9,_dab);
if(_dab){
_dac.onreadystatechange=GUtil.generateCallback(this.waitForXmlHttpResponse,[],this);
}else{
_dac.onreadystatechange=GUtil.generateCallback(this.waitForXmlHttpResponse,[],this);
if(!isIE()){
_dac.onload=GUtil.generateCallback(this.httpSuccess,[],this);
_dac.onerror=GUtil.generateCallback(this.httpError,[],this);
}
}
_dac.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
if(this.m_headers){
for(header in this.m_headers){
_dac.setRequestHeader(header,this.m_headers[header]);
}
}
this.executeHttpCallback("preHttpRequest");
var _dad=this.convertFormFieldsToUrl();
if(url){
_dad+=url;
}
_dac.send(_dad);
}
};
XmlHttpObject.prototype.getResponseXml=function(){
return (this.xmlHttp)?this.xmlHttp.responseXML:null;
};
XmlHttpObject.prototype.getResponseText=function(){
return (this.xmlHttp)?this.xmlHttp.responseText:"";
};
XmlHttpObject.prototype.getResponseHeader=function(item){
return (this.xmlHttp)?this.xmlHttp.getResponseHeader(item):null;
};
XmlHttpObject.prototype.getStatus=function(){
return this.xmlHttp.status;
};
XmlHttpObject.prototype.addFormField=function(name,_db0){
this.m_formFields.add(name,_db0);
};
XmlHttpObject.prototype.getFormFields=function(){
return this.m_formFields;
};
XmlHttpObject.prototype.getFormField=function(_db1){
return this.m_formFields.get(_db1);
};
XmlHttpObject.prototype.clearFormFields=function(){
this.m_formFields=new CDictionary();
};
XmlHttpObject.prototype.convertFormFieldsToUrl=function(){
var url="";
var _db3=this.m_formFields.keys();
for(var _db4=0;_db4<_db3.length;_db4++){
if(_db4>0){
url+="&";
}
url+=encodeURIComponent(_db3[_db4])+"="+encodeURIComponent(this.m_formFields.get(_db3[_db4]));
}
return url;
};
XmlHttpObject.prototype.concatResponseArguments=function(_db5){
var _db6=[this];
if(_db5){
_db6=_db6.concat(_db5);
}
return _db6;
};
function AsynchRequest(_db7,_db8){
AsynchRequest.baseConstructor.call(this);
this.m_gateway=_db7;
this.m_webContentRoot=_db8;
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
AsynchRequest.prototype.executeCallback=function(_db9){
if(this.m_callbacks[_db9]){
var _dba=this.concatResponseArguments(this.m_callbacks.customArguments);
var _dbb=GUtil.generateCallback(this.m_callbacks[_db9].method,_dba,this.m_callbacks[_db9].object);
_dbb();
return true;
}
return false;
};
AsynchRequest.prototype.setCallbacks=function(_dbc){
if(!this.m_callbacks){
this.m_callbacks={};
}
for(callback in _dbc){
this.m_callbacks[callback]=_dbc[callback];
}
};
AsynchRequest.prototype.getCallbacks=function(){
return this.m_callbacks;
};
AsynchRequest.prototype.newRequest=function(){
var _dbd=this.construct();
_dbd.setHeaders(this.getHeaders());
if(this.getFormFields().exists("b_action")){
_dbd.addFormField("b_action",this.getFormField("b_action"));
}
if(this.getFormFields().exists("cv.catchLogOnFault")){
_dbd.addFormField("cv.catchLogOnFault",this.getFormField("cv.catchLogOnFault"));
}
_dbd.setPromptDialog(this.m_promptDialog);
_dbd.setFaultDialog(this.m_faultDialog);
_dbd.setLogonDialog(this.m_logonDialog);
_dbd.m_asynch=this.m_asynch;
if(this.m_callbacks.newRequest){
var _dbe=GUtil.generateCallback(this.m_callbacks.newRequest.method,[_dbd],this.m_callbacks.newRequest.object);
_dbe();
}
return _dbd;
};
AsynchRequest.prototype.success=function(){
var _dbf=this.getAsynchStatus();
switch(_dbf){
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
AsynchRequest.prototype.setFaultDialog=function(_dc0){
if(_dc0 instanceof IFaultDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setFaultDialog is deprecated");
}
this.m_faultDialog=_dc0;
}else{
if(_dc0&&typeof console!="undefined"){
console.log("The parameter faultDialog must be an instance of IFaultDialog");
}
}
};
AsynchRequest.prototype.setPromptDialog=function(_dc1){
if(_dc1 instanceof IPromptDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setPromptDialog is deprecated");
}
this.m_promptDialog=_dc1;
}else{
if(_dc1&&typeof console!="undefined"){
console.log("The parameter promptDialog must be an instance of IPromptDialog");
}
}
};
AsynchRequest.prototype.setLogonDialog=function(_dc2){
if(_dc2 instanceof ILogOnDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setLogonDialog is deprecated");
}
this.m_logonDialog=_dc2;
}else{
if(_dc2&&typeof console!="undefined"){
console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
}
}
};
AsynchRequest.prototype.resubmitRequest=function(){
var _dc3=this.newRequest();
_dc3.m_formFields=this.m_formFields;
_dc3.sendRequest();
return _dc3;
};
AsynchRequest.prototype.sendRequest=function(){
var _dc4=this;
var _dc5={"complete":{"object":_dc4,"method":_dc4.successHandler},"fault":{"object":_dc4,"method":_dc4.errorHandler}};
this.init("POST",this.m_gateway,"",this.m_asynch);
this.executeCallback("preHttpRequest");
this.parent.setCallbacks.call(this,_dc5);
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
var _dc6=this.getResponseText();
if(_dc6.indexOf("<ERROR_CODE>CAM_PASSPORT_ERROR</ERROR_CODE>")!=-1){
this.passportTimeout();
}else{
this.executeCallback("entryFault");
if(!this.executeCallback("fault")){
var _dc7=window.open("","","height=400,width=500");
if(_dc7!=null){
_dc7.document.write(_dc6);
}
}
}
}else{
this.m_soapFault=this.constructFaultEnvelope();
if(this.m_soapFault!=null){
var _dc8=XMLHelper_FindChildByTagName(this.m_soapFault,"CAM",true);
if(_dc8!=null&&XMLHelper_FindChildByTagName(_dc8,"promptInfo",true)){
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
var _dc9=this.getFormField("m_tracking");
if(_dc9){
var _dca=new XmlHttpObject();
_dca.init("POST",this.m_gateway,"",false);
if(this.getFormField("cv.outputKey")){
_dca.addFormField("b_action","cvx.high");
_dca.addFormField("cv.outputKey",this.getFormField("cv.outputKey"));
_dca.setHeaders(this.getHeaders());
}else{
_dca.addFormField("b_action","cognosViewer");
}
_dca.addFormField("cv.responseFormat","successfulRequest");
_dca.addFormField("ui.action","cancel");
_dca.addFormField("m_tracking",_dc9);
if(this.getFormField("cv.debugDirectory")){
_dca.addFormField("cv.debugDirectory",this.getFormField("cv.debugDirectory"));
}
_dca.sendRequest();
this.executeCallback("cancel");
}
};
AsynchRequest.prototype.working=function(){
this.executeCallback("working");
var _dcb=this.newRequest();
_dcb.addFormField("m_tracking",this.getTracking());
if(this.getFormField("cv.outputKey")){
_dcb.addFormField("cv.outputKey",this.getFormField("cv.outputKey"));
_dcb.addFormField("b_action","cvx.high");
}
if(this.isRAPWaitTrue()){
_dcb.m_formFields=this.m_formFields;
_dcb.addFormField("m_tracking",this.getTracking());
_dcb.addFormField("rapWait","true");
var _dcc=this.getRAPRequestCache();
if(_dcc!==null&&typeof _dcc!="undefined"){
_dcb.addFormField("rapRequestCache",_dcc);
}
var _dcd=this.getMainConversation();
if(_dcd){
_dcb.addFormField("mainConversation",_dcd);
}
var _dce=this.getMainTracking();
if(_dce){
_dcb.addFormField("mainTracking",_dce);
}
}else{
_dcb.addFormField("ui.action","wait");
_dcb.addFormField("ui.primaryAction",this.getPrimaryAction());
_dcb.addFormField("cv.actionState",this.getActionState());
if(this.getFormField("ui.preserveRapTags")){
_dcb.addFormField("ui.preserveRapTags",this.getFormField("ui.preserveRapTags"));
}
if(this.getFormField("ui.backURL")){
_dcb.addFormField("ui.backURL",this.getFormField("ui.backURL"));
}
if(this.getFormField("errURL")){
_dcb.addFormField("errURL",this.getFormField("errURL"));
}
if(this.getFormField("cv.showFaultPage")){
_dcb.addFormField("cv.showFaultPage",this.getFormField("cv.showFaultPage"));
}
if(this.getFormField("cv.catchLogOnFault")){
_dcb.addFormField("cv.catchLogOnFault",this.getFormField("cv.catchLogOnFault"));
}
}
if(this.getFormField("bux")){
_dcb.addFormField("bux",this.getFormField("bux"));
}
if(this.getFormField("cv.debugDirectory")){
_dcb.addFormField("cv.debugDirectory",this.getFormField("cv.debugDirectory"));
}
_dcb.sendRequest();
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
AsynchRequest.prototype.promptPageOkCallback=function(_dcf){
var _dd0=this.newRequest();
_dd0.addFormField("ui.action","forward");
_dd0.addFormField("m_tracking",this.getTracking());
_dd0.addFormField("ui.conversation",this.getConversation());
_dd0.addFormField("ui.primaryAction",this.getPrimaryAction());
_dd0.addFormField("cv.actionState",this.getActionState());
for(var _dd1 in _dcf){
_dd0.addFormField(_dd1,_dcf[_dd1]);
}
_dd0.sendRequest();
window["AsynchRequestObject"]=null;
};
AsynchRequest.prototype.promptPageCancelCallback=function(){
window["AsynchRequestPromptDialog"].hide();
this.complete();
};
AsynchRequest.prototype.showPromptPage=function(){
window["AsynchRequestObject"]=this;
window["AsynchRequestPromptDialog"]=this.m_promptDialog;
var _dd2=this.m_promptDialog.getViewerId()==null?"":"?cv.id="+this.m_promptDialog.getViewerId();
window["AsynchRequestPromptDialog"].initialize(this.m_webContentRoot+"/rv/showStandalonePrompts.html"+_dd2,400,400);
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
var _dd3=this.constructFaultEnvelope();
if(_dd3){
var _dd4=XMLHelper_FindChildByTagName(_dd3,"faultcode",true);
if(_dd4!=null){
return XMLHelper_GetText(_dd4);
}
}
return null;
};
AsynchRequest.prototype.getSoapFaultDetailMessageString=function(){
var _dd5=this.constructFaultEnvelope();
if(_dd5){
var _dd6=XMLHelper_FindChildByTagName(_dd5,"messageString",true);
if(_dd6!=null){
return XMLHelper_GetText(_dd6);
}
}
return null;
};
function AsynchDATARequest(_dd7,_dd8){
AsynchDATARequest.baseConstructor.call(this,_dd7,_dd8);
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
var _dd9=this.getResponseText().substring(0,12);
if(_dd9==this.cStatePrefix){
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
var _dda=this.getResponseState();
if(_dda!=null){
if(_dda.m_sSoapFault){
var _ddb=_dda.m_sSoapFault;
this.m_soapFault=XMLBuilderLoadXMLFromString(_ddb);
}
}
}
return this.m_soapFault;
};
AsynchDATARequest.prototype.construct=function(){
var _ddc=new AsynchDATARequest(this.m_gateway,this.m_webContentRoot);
_ddc.setCallbacks(this.m_callbacks);
if(this.getFormFields().exists("cv.responseFormat")){
_ddc.addFormField("cv.responseFormat",this.getFormField("cv.responseFormat"));
}else{
_ddc.addFormField("cv.responseFormat","data");
}
return _ddc;
};
AsynchDATARequest.prototype.getEnvParam=function(_ddd){
var _dde=this.getResponseState();
if(_dde&&typeof _dde.envParams!="undefined"&&typeof _dde.envParams[_ddd]!="undefined"){
return _dde.envParams[_ddd];
}
return null;
};
AsynchDATARequest.prototype.isRAPWaitTrue=function(){
var _ddf=this.getEnvParam("rapWait");
if(_ddf!=null){
return _ddf=="true"?true:false;
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
function AsynchJSONRequest(_de0,_de1){
AsynchJSONRequest.baseConstructor.call(this,_de0,_de1);
this.m_jsonResponse=null;
};
AsynchJSONRequest.prototype=new AsynchRequest();
AsynchJSONRequest.baseConstructor=AsynchRequest;
AsynchJSONRequest.prototype.getJSONResponseObject=function(){
if(this.m_jsonResponse==null){
if(this.getResponseHeader("Content-type").indexOf("application/json")!=-1){
var text=this.getResponseText();
if(text!=null){
var _de3=this.removeInvalidCharacters(text);
this.m_jsonResponse=eval("("+_de3+")");
}
}
}
return this.m_jsonResponse;
};
AsynchJSONRequest.prototype.getTracking=function(){
var _de4=this.getJSONResponseObject();
if(_de4){
return _de4.tracking;
}
return "";
};
AsynchJSONRequest.prototype.getConversation=function(){
var _de5=this.getJSONResponseObject();
if(_de5){
return _de5.conversation;
}
return "";
};
AsynchJSONRequest.prototype.getAsynchStatus=function(){
var _de6=this.getJSONResponseObject();
if(_de6){
return _de6.status;
}
return "unknown";
};
AsynchJSONRequest.prototype.getPrimaryAction=function(){
var _de7=this.getJSONResponseObject();
if(_de7){
return _de7.primaryAction;
}
return "";
};
AsynchJSONRequest.prototype.getActionState=function(){
var _de8=this.getJSONResponseObject();
if(_de8){
return _de8.actionState;
}
return "";
};
AsynchJSONRequest.prototype.getDebugLogs=function(){
var _de9=this.getJSONResponseObject();
if(_de9){
return _de9.debugLogs;
}
return "";
};
AsynchJSONRequest.prototype.isRAPWaitTrue=function(){
var _dea=this.getJSONResponseObject();
if(_dea){
return (_dea.rapWait==="true");
}
return false;
};
AsynchJSONRequest.prototype.getRAPRequestCache=function(){
var _deb=this.getJSONResponseObject();
if(_deb){
var _dec=_deb.rapRequestCache;
if(_dec!==null&&typeof _dec!="undefined"){
return _dec;
}
}
return null;
};
AsynchJSONRequest.prototype.getMainConversation=function(){
var _ded=this.getJSONResponseObject();
if(_ded){
return _ded.mainConversation;
}
return null;
};
AsynchJSONRequest.prototype.getMainTracking=function(){
var _dee=this.getJSONResponseObject();
if(_dee){
return _dee.mainTracking;
}
return null;
};
AsynchJSONRequest.prototype.getResult=function(){
var _def=this.getJSONResponseObject();
if(_def&&_def.json){
var _df0=this.removeInvalidCharacters(_def.json);
return eval("("+_df0+")");
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
var _df2=this.getJSONResponseObject();
if(_df2&&_df2.promptHTMLFragment){
return _df2.promptHTMLFragment;
}
return "";
};
AsynchJSONRequest.prototype.constructFaultEnvelope=function(){
if(this.m_soapFault==null){
var _df3=this.getJSONResponseObject();
if(_df3.status=="fault"){
this.m_soapFault=XMLBuilderLoadXMLFromString(_df3.fault);
}
}
return this.m_soapFault;
};
AsynchJSONRequest.prototype.construct=function(){
var _df4=new AsynchJSONRequest(this.m_gateway,this.m_webContentRoot);
_df4.setCallbacks(this.m_callbacks);
if(this.getFormFields().exists("cv.responseFormat")){
_df4.addFormField("cv.responseFormat",this.getFormField("cv.responseFormat"));
}else{
_df4.addFormField("cv.responseFormat","asynchJSON");
}
return _df4;
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
ILogOnDialog.prototype.show=function(_df5){
if(typeof console!="undefined"){
console.log("Required method ILogOnDialog:show not implemented.");
}
};
ILogOnDialog.prototype.handleUnknownHTMLResponse=function(_df6){
if(typeof console!="undefined"){
console.log("Required method ILogOnDialog:handleUnknownHTMLResponse not implemented.");
}
};
function IPromptDialog(){
};
IPromptDialog.prototype.initialize=function(url,_df8,_df9){
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
IRequestHandler.prototype.preHttpRequest=function(_dfa){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:preHttpRequest not implemented.");
}
};
IRequestHandler.prototype.postHttpRequest=function(_dfb){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:postHttpRequest not implemented.");
}
};
IRequestHandler.prototype.postComplete=function(_dfc){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:postComplete not implemented.");
}
};
IRequestHandler.prototype.onComplete=function(_dfd){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onComplete not implemented.");
}
};
IRequestHandler.prototype.onPostEntryComplete=function(_dfe){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onPostEntryComplete not implemented.");
}
};
IRequestHandler.prototype.onFault=function(_dff){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onFault not implemented.");
}
};
IRequestHandler.prototype.onPrompting=function(_e00){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onPrompting not implemented.");
}
};
IRequestHandler.prototype.onWorking=function(_e01){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onWorking not implemented.");
}
};
IRequestHandler.prototype.setWorkingDialog=function(_e02){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:setWorkingDialog not implemented.");
}
};
IRequestHandler.prototype.setRequestIndicator=function(_e03){
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
BaseRequestHandler.prototype.onError=function(_e05){
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
BaseRequestHandler.prototype.setDispatcherEntry=function(_e06){
this.m_oDispatcherEntry=_e06;
};
BaseRequestHandler.prototype.getDispatcherEntry=function(){
return this.m_oDispatcherEntry;
};
BaseRequestHandler.prototype.processInitialResponse=function(_e07){
this.updateViewerState(_e07);
};
BaseRequestHandler.prototype.setLogOnDialog=function(_e08){
if(_e08==null){
this.m_logOnDialog=null;
}else{
if(_e08 instanceof ILogOnDialog){
this.m_logOnDialog=_e08;
}else{
if(_e08&&typeof console!="undefined"){
console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
}
}
}
};
BaseRequestHandler.prototype.setWorkingDialog=function(_e09){
if(_e09==null){
this.m_workingDialog=null;
}else{
if(this.m_httpRequestConfig&&this.m_httpRequestConfig.getWorkingDialog()){
this.m_workingDialog=this.m_httpRequestConfig.getWorkingDialog();
}else{
if(_e09 instanceof IRequestIndicator){
this.m_workingDialog=_e09;
}else{
if(_e09&&typeof console!="undefined"){
console.log("The parameter workingDialog must be an instance of IRequestIndicator");
}
}
}
}
};
BaseRequestHandler.prototype.getWorkingDialog=function(){
return this.m_workingDialog;
};
BaseRequestHandler.prototype.setRequestIndicator=function(_e0a){
if(_e0a==null){
this.m_requestIndicator=null;
}else{
if(this.m_httpRequestConfig&&this.m_httpRequestConfig.getRequestIndicator()){
this.m_requestIndicator=this.m_httpRequestConfig.getRequestIndicator();
}else{
if(_e0a instanceof IRequestIndicator){
this.m_requestIndicator=_e0a;
}else{
if(_e0a&&typeof console!="undefined"){
console.log("The parameter requestIndicator must be an instance of IRequestIndicator");
}
}
}
}
};
BaseRequestHandler.prototype.getRequestIndicator=function(){
return this.m_requestIndicator;
};
BaseRequestHandler.prototype.setFaultDialog=function(_e0b){
if(_e0b==null){
this.m_faultDialog=null;
}else{
if(_e0b instanceof IFaultDialog){
this.m_faultDialog=_e0b;
}else{
if(_e0b&&typeof console!="undefined"){
console.log("The parameter faultDialog must be an instance of IFaultDialog");
}
}
}
};
BaseRequestHandler.prototype.setPromptDialog=function(_e0c){
if(_e0c==null){
this.m_promptDialog=null;
}else{
if(_e0c instanceof IPromptDialog){
this.m_promptDialog=_e0c;
}else{
if(_e0c&&typeof console!="undefined"){
console.log("The parameter promptDialog must be an instance of IPromptDialog");
}
}
}
};
BaseRequestHandler.prototype.preHttpRequest=function(_e0d){
if(_e0d&&typeof _e0d.getFormField=="function"){
if(_e0d.getFormField("ui.action")!="wait"&&_e0d.getFormField("rapWait")!="true"){
if(this.m_requestIndicator){
this.m_requestIndicator.show();
}
}
}
};
BaseRequestHandler.prototype.postHttpRequest=function(_e0e){
if(_e0e&&typeof _e0e.getAsynchStatus=="function"){
var _e0f=_e0e.getAsynchStatus();
if(_e0f!="working"&&_e0f!="stillWorking"){
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
BaseRequestHandler.prototype.onFault=function(_e10){
var oCV=this.getViewer();
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
if(typeof FaultDialog=="undefined"){
if(typeof console!="undefined"){
console.log("An unhandled fault was returned: %o",_e10);
}
return;
}
if(!this.m_faultDialog){
this.m_faultDialog=new FaultDialog(this.getViewer());
}
if(_e10&&_e10.getResponseHeader&&_e10.getResponseHeader("Content-type").indexOf("text/html")!=-1){
this.m_faultDialog.handleUnknownHTMLResponse(_e10.getResponseText());
}else{
if(_e10&&_e10.getSoapFault){
this.m_faultDialog.show(_e10.getSoapFault());
}else{
if(oCV.getSoapFault()){
var _e12=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
this.m_faultDialog.show(_e12);
oCV.setSoapFault("");
}else{
if(typeof console!="undefined"){
console.log("An unhandled fault was returned: %o",_e10);
}
}
}
}
};
BaseRequestHandler.prototype.isAuthenticationFault=function(_e13){
var oCV=this.getViewer();
var _e15=null;
if(_e13&&_e13.getSoapFault){
_e15=_e13.getSoapFault();
}else{
if(oCV.getSoapFault()){
_e15=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
}
}
if(_e15!=null){
var _e16=XMLHelper_FindChildByTagName(_e15,"CAM",true);
return (_e16!=null&&XMLHelper_FindChildByTagName(_e16,"promptInfo",true)!=null);
}
return false;
};
BaseRequestHandler.prototype.onPassportTimeout=function(_e17){
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
if(_e17&&_e17.getResponseHeader&&_e17.getResponseHeader("Content-type").indexOf("text/html")!=-1){
this.m_logOnDialog.handleUnknownHTMLResponse(_e17.getResponseText());
}else{
if(_e17&&_e17.getSoapFault){
this.m_logOnDialog.show(_e17.getSoapFault());
}else{
if(oCV.getSoapFault()){
var _e19=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
this.m_logOnDialog.show(_e19);
oCV.setSoapFault("");
}else{
if(typeof console!="undefined"){
console.log("BaseRequestHandler.prototype.onPassportTimeout: An unhandled authentication fault was returned: %o",_e17);
}
}
}
}
};
BaseRequestHandler.prototype.onWorking=function(_e1a){
if(this.m_workingDialog){
var _e1b=_e1a&&typeof _e1a.getAsynchStatus=="function"&&_e1a.getAsynchStatus()=="stillWorking"?true:false;
if(!_e1b){
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
var _e1e=oCV.getViewerWidget();
if(_e1e.getLoadManager()){
_e1e.getLoadManager().processQueue();
}
}
};
BaseRequestHandler.prototype.onPrompting=function(_e1f){
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
window["AsynchRequestObject"]=_e1f;
window["AsynchRequestPromptDialog"]=this.m_promptDialog;
var _e21="?cv.id="+oCV.getId();
window["AsynchRequestPromptDialog"].initialize(oCV.getWebContentRoot()+"/rv/showStandalonePrompts.html"+_e21,400,400);
window["AsynchRequestPromptDialog"].show();
};
BaseRequestHandler.prototype.processDATAReportResponse=function(_e22){
var oCV=this.getViewer();
if(!oCV||oCV.m_destroyed){
if(console){
console.warn("Tried to process a data response on an invalid CCognosViewer",oCV);
}
return;
}
var _e24=_e22.getResponseState();
if(!_e24){
this.resubmitInSafeMode();
}
if(this.loadReportHTML(_e22.getResult())===false){
this.resubmitInSafeMode();
}
this.updateViewerState(_e24);
};
BaseRequestHandler.prototype.updateViewerState=function(_e25){
var oCV=this.getViewer();
applyJSONProperties(oCV,_e25);
var _e27=oCV.getStatus();
if(typeof oCV.envParams["ui.spec"]!="undefined"&&oCV.envParams["ui.spec"].indexOf("&lt;")===0){
oCV.envParams["ui.spec"]=xml_decode(oCV.envParams["ui.spec"]);
}
if(_e27!="fault"){
if(oCV.envParams["rapReportInfo"]){
this._processRapReportInfo(oCV);
}
if(typeof _e25.clientunencodedexecutionparameters!="undefined"){
var _e28=document.getElementById("formWarpRequest"+oCV.getId());
if(_e28!=null&&typeof _e28["clientunencodedexecutionparameters"]!="undefined"){
_e28["clientunencodedexecutionparameters"].value=_e25.clientunencodedexecutionparameters;
}
if(typeof document.forms["formWarpRequest"]!="undefined"&&typeof document.forms["formWarpRequest"]["clientunencodedexecutionparameters"]!="undefined"){
document.forms["formWarpRequest"]["clientunencodedexecutionparameters"].value=_e25.clientunencodedexecutionparameters;
}
}
}else{
oCV.setTracking("");
}
};
BaseRequestHandler.prototype._processRapReportInfo=function(oCV){
if(oCV.envParams["rapReportInfo"]){
var _e2a=eval("("+oCV.envParams["rapReportInfo"]+")");
if(typeof RAPReportInfo!="undefined"){
var _e2b=new RAPReportInfo(_e2a,oCV);
oCV.setRAPReportInfo(_e2b);
}
}
};
BaseRequestHandler.prototype.loadReportHTML=function(_e2c){
var oCV=this.getViewer();
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_gotHtml",oCV);
}
if(oCV.m_undoStack.length>0){
oCV.m_undoStack[oCV.m_undoStack.length-1].m_bRefreshPage=true;
}
oCV.pageNavigationObserverArray=[];
oCV.m_flashChartsObjectIds=[];
var _e2e=_e2c.replace(/<form[^>]*>/gi,"").replace(/<\/form[^>]*>/gi,"");
oCV.m_sHTML=_e2e;
oCV.setHasPrompts(false);
var id=oCV.getId();
var _e30=document.getElementById("RVContent"+id);
var _e31=document.getElementById("CVReport"+id);
if(_e2e.match(/prompt\/control\.js|PRMTcompiled\.js|prmt_core\.js/gi)){
oCV.setHasPrompts(true);
_e31.style.display="none";
}
if(window.gScriptLoader){
var _e32=oCV.getViewerWidget()?true:false;
var _e33=oCV.getViewerWidget()?document.getElementById("_"+oCV.getViewerWidget().iContext.widgetId+"_cv"):_e31;
_e2e=window.gScriptLoader.loadCSS(_e2e,_e33,_e32,id);
}
if(oCV.sBrowser=="ie"){
_e2e="<span style='display:none'>&nbsp;</span>"+_e2e;
}
_e31.innerHTML=_e2e;
this.massageHtmlBeforeDisplayed();
if(window.gScriptLoader){
var _e34=GUtil.generateCallback(oCV.showLoadedContent,[_e30],oCV);
oCV.m_resizeReady=false;
if(!window.gScriptLoader.loadAll(_e31,_e34,id,true)){
if(window.gScriptLoader.containsAjaxWarnings()){
return false;
}
}
}else{
_e30.style.display="block";
}
oCV.updateOutputForA11ySupport();
this._clearFindState();
return true;
};
BaseRequestHandler.prototype._clearFindState=function(){
var oCV=this.getViewer();
var _e36=oCV.getState()&&oCV.getState().getFindState()?oCV.getState().getFindState():null;
if(_e36&&!_e36.findOnServerInProgress()){
oCV.getState().clearFindState();
}
};
BaseRequestHandler.prototype.showReport=function(){
var oCV=this.getViewer();
var _e38=document.getElementById("CVReport"+oCV.getId());
if(_e38){
_e38.style.display="";
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
BaseRequestHandler.prototype.onAsynchStatusUpdate=function(_e3a){
if(this.m_httpRequestConfig){
var _e3b=this.m_httpRequestConfig.getReportStatusCallback(_e3a);
if(_e3b){
_e3b();
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
BaseRequestHandler.prototype._addCallback=function(_e3c,_e3d){
var _e3e=_e3c;
var _e3f=this[_e3d];
this[_e3d]=function(_e40){
_e3f.apply(this,arguments);
var _e41=null;
if(_e40&&typeof _e40.getAsynchStatus=="function"){
_e41=_e40.getAsynchStatus();
}else{
_e41=_e3e=="complete"?this.getViewer().getStatus():_e3e;
}
if(_e41=="stillWorking"){
return;
}
var _e42=this.m_httpRequestConfig.getReportStatusCallback(_e41);
if(typeof _e42=="function"){
setTimeout(_e42,10);
}
};
};
function ViewerBaseWorkingDialog(_e43){
if(!_e43){
return;
}
this.setCognosViewer(_e43);
this.m_oCV=_e43;
this.m_sNamespace=_e43.getId();
this.m_sGateway=_e43.getGateway();
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
ViewerBaseWorkingDialog.prototype.setCancelSubmitted=function(_e45){
this.m_bCancelSubmitted=_e45;
};
ViewerBaseWorkingDialog.prototype.show=function(){
var _e46=document.getElementById(this.getContainerId());
if(_e46){
_e46.style.display="block";
this.enableCancelButton();
}else{
this.create();
}
var _e47=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_e47){
_e47.style.display="block";
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
ViewerBaseWorkingDialog.prototype.createContainer=function(_e48){
var _e49=document.createElement("div");
_e49.setAttribute("id",this.getContainerId());
_e49.className=_e48?"modalWaitPage":"inlineWaitPage";
return _e49;
};
ViewerBaseWorkingDialog.prototype.createModalWaitDialog=function(){
this._createBlocker();
var _e4a=this.createContainer(true);
_e4a.innerHTML=this.renderHTML();
_e4a.style.zIndex="7002";
_e4a.setAttribute("role","region");
_e4a.setAttribute("aria-label",RV_RES.GOTO_WORKING);
document.body.appendChild(_e4a);
var _e4b=this.createModalIframeBackground();
document.body.appendChild(_e4b);
var _e4c=0;
var _e4d=0;
if(typeof window.innerHeight!="undefined"){
_e4c=Math.round((window.innerHeight/2)-(_e4a.offsetHeight/2));
_e4d=Math.round((window.innerWidth/2)-(_e4a.offsetWidth/2));
}else{
_e4c=Math.round((document.body.clientHeight/2)-(_e4a.offsetHeight/2));
_e4d=Math.round((document.body.clientWidth/2)-(_e4a.offsetWidth/2));
}
_e4a.style.bottom=_e4c+"px";
_e4a.style.left=_e4d+"px";
_e4b.style.left=_e4d-1+"px";
_e4b.style.bottom=_e4c-1+"px";
_e4b.style.width=_e4a.offsetWidth+2+"px";
_e4b.style.height=_e4a.offsetHeight+2+"px";
};
ViewerBaseWorkingDialog.prototype._createBlocker=function(){
var _e4e=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_e4e){
return;
}
var _e4f=document.getElementById("mainViewerTable"+this.m_oCV.getId());
if(_e4f){
_e4e=document.createElement("div");
_e4f.parentNode.appendChild(_e4e);
_e4e.id="reportBlocker"+this.m_oCV.getId();
_e4e.style.zIndex="6001";
_e4e.style.position="absolute";
_e4e.style.top="0px";
_e4e.style.left="0px";
_e4e.style.width="100%";
_e4e.style.height="100%";
_e4e.style.display="none";
_e4e.style.opacity="0";
_e4e.style.backgroundColor="#FFFFFF";
_e4e.style.filter="alpha(opacity:0)";
}
};
ViewerBaseWorkingDialog.prototype.createInlineWaitDialog=function(){
var _e50=this.m_oCV.getId();
var _e51=document.getElementById("CVReport"+_e50);
if(_e51){
var _e52=this.createContainer(false);
_e52.innerHTML="<table width=\"100%\" height=\"100%\"><tr><td valign=\"middle\" align=\"center\" role=\"presentation\">"+this.renderHTML()+"</td></tr></table>";
_e51.appendChild(_e52);
}
};
ViewerBaseWorkingDialog.prototype.createModalIframeBackground=function(){
var _e53=document.createElement("iframe");
var _e54="..";
var oCV=this.getCognosViewer();
if(oCV!==null){
_e54=oCV.getWebContentRoot();
}
_e53.setAttribute("id",this.getContainerId()+"Iframe");
_e53.setAttribute("title","Empty iframe");
_e53.setAttribute("src",_e54+"/common/images/spacer.gif");
_e53.setAttribute("scrolling","no");
_e53.setAttribute("frameborder","0");
_e53.style.position="absolute";
_e53.style.zIndex="6002";
_e53.style.display="block";
return _e53;
};
ViewerBaseWorkingDialog.prototype.updateCoords=function(_e56,_e57){
if(this.m_container!==null&&m_iframeBackground!==null){
var _e58=0;
var _e59=0;
if(typeof window.innerHeight!="undefined"){
_e58=Math.round((window.innerHeight/2)-(_e56.offsetHeight/2));
_e59=Math.round((window.innerWidth/2)-(_e56.offsetWidth/2));
}else{
_e58=Math.round((document.body.clientHeight/2)-(_e56.offsetHeight/2));
_e59=Math.round((document.body.clientWidth/2)-(_e56.offsetWidth/2));
}
_e56.style.bottom=_e58+"px";
_e56.style.left=_e59+"px";
_e57.style.left=_e56.style.left;
_e57.style.bottom=_e56.style.bottom;
_e57.style.width=_e56.offsetWidth+"px";
_e57.style.height=_e56.offsetHeight+"px";
}
};
ViewerBaseWorkingDialog.prototype.hide=function(){
var _e5a=document.getElementById(this.getContainerId());
if(_e5a){
_e5a.parentNode.removeChild(_e5a);
}
var _e5b=document.getElementById(this.getContainerId()+"Iframe");
if(_e5b){
_e5b.parentNode.removeChild(_e5b);
}
var _e5c=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_e5c){
_e5c.parentNode.removeChild(_e5c);
}
};
ViewerBaseWorkingDialog.prototype.isModal=function(){
var _e5d=this.m_oCV.getId();
var _e5e=document.getElementById("CVReport"+_e5d);
var _e5f=true;
if(_e5e&&_e5e.innerHTML===""){
_e5f=false;
}
return _e5f;
};
ViewerBaseWorkingDialog.prototype.disableCancelButton=function(_e60){
};
ViewerBaseWorkingDialog.prototype.enableCancelButton=function(){
};
function FaultDialog(oCV){
this.m_oCV=oCV;
};
FaultDialog.prototype=new IFaultDialog();
FaultDialog.prototype.show=function(_e62){
if(typeof console!="undefined"){
console.log("FaultDialog - an unhandled soap fault was returned: %o",_e62);
}
};
FaultDialog.prototype.handleUnknownHTMLResponse=function(_e63){
this.m_oCV.setTracking("");
this.m_oCV.setConversation("");
if(_e63){
if(this.m_oCV.envParams["useAlternateErrorCodeRendering"]){
var _e64=document.getElementsByTagName("head")[0];
var _e65=_e63.match(/<body[^>]*>([\s\S]*)<\/body>/im)[1];
var _e66=/<script[^>]*>([\s\S]*?)<\/script>/igm;
var _e67=_e66.exec(_e63);
while(_e67!=null){
var _e68=document.createElement("script");
_e68.type="text/javascript";
var _e69=_e67[0].match(/src="([\s\S]*?)"/i);
if(_e69==null){
_e68.text=_e67[1];
}else{
_e68.src=_e69[1];
}
_e64.appendChild(_e68);
_e67=_e66.exec(_e63);
}
document.body.innerHTML=_e65;
}else{
document.write(_e63);
}
}
};
function LogOnDialog(oCV){
this.m_oCV=oCV;
};
LogOnDialog.prototype=new ILogOnDialog();
LogOnDialog.prototype.handleUnknownHTMLResponse=function(_e6b){
if(_e6b){
document.write(_e6b);
}
};
LogOnDialog.prototype.show=function(_e6c){
launchLogOnDialog(this.m_oCV.getId(),_e6c);
};
LogOnDialog.prototype.hide=function(){
};
function PromptDialog(oCV){
this.m_oCV=oCV;
this.m_dialogImpl=null;
};
PromptDialog.prototype=new IPromptDialog();
PromptDialog.prototype.initialize=function(url,_e6f,_e70){
this.m_dialogImpl=new CModal("","",document.body,null,null,_e6f,_e70,true,true,false,true,this.m_oCV.getWebContentRoot());
var _e71=document.getElementById(CMODAL_CONTENT_ID);
_e71.src=url;
};
PromptDialog.prototype.show=function(){
this.m_dialogImpl.show();
};
PromptDialog.prototype.hide=function(){
this.m_dialogImpl.hide();
destroyCModal();
};
function WorkingDialog(_e72){
if(_e72){
this.m_bSimpleWorkingDialog=false;
this.m_bShowCancelButton=(_e72.getAdvancedServerProperty("VIEWER_JS_HIDE_CANCEL_BUTTON")=="true")?false:true;
WorkingDialog.baseConstructor.call(this,_e72);
this.m_secondaryRequests=_e72.getSecondaryRequests();
}
};
WorkingDialog.prototype=new ViewerBaseWorkingDialog();
WorkingDialog.baseConstructor=ViewerBaseWorkingDialog;
WorkingDialog.prototype.setSecondaryRequests=function(_e73){
this.m_secondaryRequests=_e73;
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
WorkingDialog.prototype.showDeliveryOptions=function(_e75){
var _e76=this.getNamespace();
var _e77=document.getElementById("DeliveryOptionsVisible"+_e76);
if(_e77){
_e77.style.display=(_e75===false?"none":"block");
if(_e75){
var _e78=_e77.getElementsByTagName("a");
for(var i=_e78.length;i>0;i--){
if(_e78[i]&&_e78[i].getAttribute("tabIndex")=="0"){
_e78[i].focus();
}
}
}
}
_e77=document.getElementById("OptionsLinkSelected"+_e76);
if(_e77){
_e77.style.display=(_e75===false?"none":"block");
}
_e77=document.getElementById("OptionsLinkUnselected"+_e76);
if(_e77){
_e77.style.display=(_e75===false?"block":"none");
}
};
WorkingDialog.prototype.renderHTML=function(){
var _e7a=this.getNamespace();
var _e7b=_e7a+"_workingMsg "+_e7a+"_workingMsg2";
var html="<table class=\"viewerWorkingDialog\" id=\"CVWaitTable"+_e7a+"\""+" role=\"presentation\">";
html+=("<tr>"+"<td align=\"center\">"+"<div tabIndex=\"0\" role=\"presentation\" aria-labelledby=\""+_e7b+"\""+" class=\"body_dialog_modal workingDialogDiv\">");
html+=this.renderFirstInnerTable();
html+=this.renderSecondInnerTable();
html+=("</div>"+"</td>"+"</tr>"+"</table>");
return html;
};
WorkingDialog.prototype.renderFirstInnerTable=function(){
var _e7d=this.getSimpleWorkingDialogFlag();
var _e7e=_e7d?RV_RES.GOTO_WORKING:RV_RES.RV_RUNNING;
var _e7f=this.m_sNamespace;
var _e80="<table class=\"workingDialogInnerTable\" role=\"presentation\">"+"<tr>"+"<td valign=\"middle\">";
var _e81=this.getCognosViewer().getSkin()+"/branding/";
_e80+="<img src=\""+_e81+"progress.gif\"";
if(isIE()){
_e80+=" width=\"48\" height=\"48\" border=\"0\"";
}
_e80+=" name=\"progress\"";
if(isIE()){
_e80+=" align=\"top\"";
}
_e80+=" alt=\"";
_e80+=_e7e;
_e80+="\"/></td>";
_e80+="<td width=\"20\">&nbsp;</td>";
_e80+="<td style=\"padding-top: 5px;\" class=\"tableText\">";
_e80+="<span id=\""+_e7f+"_workingMsg\">";
_e80+=_e7e;
_e80+="</span>";
_e80+="<br/><br/>";
var _e82=this.getCognosViewer().envParams["cv.responseFormat"];
if(_e7d||this.isUIBlacklisted("RV_TOOLBAR_BUTTONS")||!this.deliverySectionIsNeeded()||(_e82&&("qs"===_e82||"fragment"===_e82))){
_e80+=RV_RES.RV_PLEASE_WAIT;
}else{
var _e83=this.canShowDeliveryOptions();
if(_e83){
_e80+=this.optionLinkSelectedDiv();
_e80+=this.optionLinkUnselectedDiv();
}else{
_e80+=RV_RES.RV_PLEASE_WAIT;
}
}
_e80+="</td></tr><tr><td colspan=\"3\">&nbsp;</td></tr></table>";
return _e80;
};
WorkingDialog.prototype.optionLinkSelectedDiv=function(){
var _e84="";
_e84+="<div id=\"OptionsLinkSelected"+this.getNamespace()+"\" style=\"display: none\">";
_e84+=RV_RES.RV_BUSY_OPTIONS_SELECTED;
_e84+="</div>";
return _e84;
};
WorkingDialog.prototype.optionLinkUnselectedDiv=function(){
var _e85="";
var _e86=this.getNamespace();
var _e87="window.oCV"+_e86+".getWorkingDialog()";
_e85+="<div id=\"OptionsLinkUnselected"+_e86+"\">";
_e85+="<span id=\""+_e86+"_workingMsg2\">";
_e85+=RV_RES.RV_BUSY_OPTIONS_UNSELECTED;
_e85+="</span><br/>";
_e85+="<a href=\"#\" class=\"deliveryOptionLink\" onclick=\"javascript:"+_e87+".showDeliveryOptions(true)\">";
_e85+=RV_RES.RV_BUSY_OPTIONS_LINK;
_e85+="</a></div>";
return _e85;
};
WorkingDialog.prototype.canShowDeliveryOptions=function(){
var _e88=this.getCognosViewer().envParams["ui.primaryAction"];
if("saveAs"!==_e88&&"email"!==_e88&&this.getIsSavedReport()){
return true;
}
return false;
};
WorkingDialog.prototype.isUIBlacklisted=function(item){
var _e8a=this.getUIBlacklist();
for(var _e8b in _e8a){
if(_e8a[_e8b]===item){
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
WorkingDialog.prototype._hasSecondaryRequest=function(_e8c){
var _e8d=this._getSecondaryRequests();
if(_e8d){
var _e8e=_e8d.length;
for(var i=0;i<_e8e;i++){
if(_e8d[i]==_e8c){
return true;
}
}
}
return false;
};
WorkingDialog.prototype.renderSecondInnerTable=function(){
var _e90="";
var _e91=this.getCognosViewer().getWebContentRoot();
_e90+="<table width=\"300\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">";
_e90+="<tr id=\"DeliveryOptionsVisible"+this.getNamespace()+"\" class=\"workingDialogOptions\">";
_e90+="<td align=\"left\">";
_e90+="<table class=\"workingDialogInnerTable workingDialogLinks\" role=\"presentation\">";
var _e92=this.canShowDeliveryOptions();
if(_e92&&this.deliverySectionIsNeeded()){
if(!this._isSaveBlackListed()){
_e90+=this.addDeliverOption("/rv/images/action_save_report_output.gif",RV_RES.RV_SAVE_REPORT,"SaveReport(true);");
}
if("reportView"!==this.getCognosViewer().envParams["ui.objectClass"]&&!this._isSaveAsBlackListed()){
_e90+=this.addDeliverOption("/rv/images/action_save_report_view.gif",RV_RES.RV_SAVE_AS_REPORT_VIEW,"SaveAsReportView(true);");
}
if(!this.isUIBlacklisted("CC_RUN_OPTIONS_EMAIL_ATTACHMENT")&&!this._isEmailBlackListed()){
_e90+=this.addDeliverOption("/rv/images/action_send_report.gif",RV_RES.RV_EMAIL_REPORT,"SendReport(true);");
}
}
_e90+="</table></td></tr> ";
_e90+="<tr style=\"padding-top: 5px\"> ";
_e90+="<td align=\"left\" colspan=\"3\" id=\"cancelButtonContainer"+this.getNamespace()+"\"> ";
if(this.showCancelButton()){
_e90+=this.addCancelButton();
}
_e90+="</td></tr> ";
_e90+="</table> ";
return _e90;
};
WorkingDialog.prototype.addDeliverOption=function(_e93,_e94,_e95){
var _e96="";
var _e97=this.getCognosViewer().getWebContentRoot();
var _e98="javascript: window.oCV"+this.getNamespace()+".getRV().";
var _e99=_e98+_e95;
_e96+="<tr><td> ";
_e96+="<a tabIndex=\"-1\" href=\""+_e95+"\"> ";
_e96+="<img border=\"0\" src=\""+_e97+_e93+"\" alt=\" "+html_encode(_e94)+"\"/></a> ";
_e96+="</td><td width=\"100%\" valign=\"middle\" class=\"tableText\"> ";
_e96+="<a tabIndex=\"0\" role=\"link\" href=\"#\" onclick=\""+_e99+"\" style=\"padding-left: 5px\" class=\"deliveryOptionLink\"> ";
_e96+=(_e94+"</a></td></tr>");
return _e96;
};
WorkingDialog.prototype.addCancelButton=function(){
var _e9a="";
var _e9b=this.getCognosViewer().getWebContentRoot();
_e9a+="<table role=\"presentation\"><tr><td> ";
_e9a+="<table id=\"cvWorkingDialog"+this.getNamespace()+"\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" onmouseover=\"this.className = 'commandButtonOver'\" onmouseout=\"this.className = 'commandButton'\" onmousedown=\"this.className = 'commandButtonDown'\" class=\"commandButton\"> ";
_e9a+="<tr> ";
_e9a+="<td valign=\"middle\" align=\"center\" nowrap=\"nowrap\" class=\"workingDialogCancelButton\" ";
if(isIE()){
_e9a+="id=\"btnAnchorIE\" ";
}else{
_e9a+="id=\"btnAnchor\" ";
}
_e9a+="> ";
var _e9c="window.oCV"+this.m_sNamespace+".cancel(this)";
_e9a+="<a href=\"#\" onclick=\""+_e9c+"\"> ";
_e9a+=RV_RES.CANCEL;
_e9a+="</a> ";
_e9a+="</td></tr></table></td> ";
_e9a+="<td><img alt=\"\" height=\"1\"  ";
if(isIE()){
_e9a+="width=\"10\"  ";
}
_e9a+="src=\""+_e9b+"/ps/images/space.gif\"/></td> ";
_e9a+="</tr></table> ";
return _e9a;
};
WorkingDialog.prototype.disableCancelButton=function(_e9d){
this.cancelButtonDisabled=true;
var _e9e=document.getElementById("cvWorkingDialog"+this.getNamespace());
if(_e9e){
_e9e.style.cursor="default";
_e9e.className="commandButtonOver";
_e9e.removeAttribute("onmouseover");
_e9e.removeAttribute("onmouseout");
}
if(_e9d){
_e9d.removeAttribute("href");
_e9d.removeAttribute("onclick");
_e9d.style.cursor="default";
}
};
WorkingDialog.prototype.enableCancelButton=function(){
if(this.cancelButtonDisabled){
var _e9f=document.getElementById("cancelButtonContainer"+this.getNamespace());
if(_e9f){
_e9f.innerHTML=this.addCancelButton();
}
this.cancelButtonDisabled=false;
}
};
WorkingDialog.prototype.getContainerId=function(){
return "CVWait"+this.getNamespace();
};
function RequestExecutedIndicator(_ea0){
if(_ea0){
RequestExecutedIndicator.baseConstructor.call(this,_ea0);
}
};
RequestExecutedIndicator.baseConstructor=WorkingDialog;
RequestExecutedIndicator.prototype=new WorkingDialog();
RequestExecutedIndicator.prototype.renderHTML=function(){
var _ea1="<table id=\"CVWaitTable"+this.getNamespace()+"\" requestExecutionIndicator=\"true\" class=\"viewerWorkingDialog\" role=\"presentation\">";
_ea1+="<tr><td align=\"center\">";
_ea1+="<div class=\"body_dialog_modal\">";
_ea1+="<table align=\"center\" cellspacing=\"0\" cellpadding=\"0\" style=\"vertical-align:middle; text-align: left;\" role=\"presentation\">";
_ea1+="<tr><td rowspan=\"2\">";
_ea1+="<img alt=\""+RV_RES.GOTO_WORKING+"\" src=\""+this.getCognosViewer().getSkin()+"/branding/progress.gif\" style=\"margin:5px;\" width=\"48\" height=\"48\" name=\"progress\"/>";
_ea1+="</td><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
_ea1+=RV_RES.GOTO_WORKING;
_ea1+="</span></td></tr><tr><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
_ea1+=RV_RES.RV_PLEASE_WAIT;
_ea1+="</span></td></tr><tr><td style=\"height:7px;\" colspan=\"2\"></td></tr></table></div></td></tr></table>";
return _ea1;
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
RequestHandler.prototype.onComplete=function(_ea3){
this.parent.onComplete.call(this,_ea3);
this.processDATAReportResponse(_ea3);
this.postComplete();
};
RequestHandler.prototype.processInitialResponse=function(_ea4){
this.parent.processInitialResponse.call(this,_ea4);
var oCV=this.getViewer();
var _ea6=oCV.getStatus();
oCV.setMaxContentSize();
var _ea7=(oCV.isWorking(_ea6)||_ea6=="default");
if(_ea7){
if(oCV.getWorkingDialog()){
oCV.getWorkingDialog().show();
}
setTimeout(getCognosViewerObjectRefAsString(oCV.getId())+".executeCallback(\"wait\");",10);
}else{
if(_ea6=="fault"){
oCV.setSoapFault(_ea4.m_sSoapFault);
oCV.executeCallback("fault");
}else{
if(_ea4.status=="cancel"){
oCV.executeCallback("cancel");
}else{
oCV.updateSkipToReportLink();
if(oCV.envParams&&oCV.envParams["pinFreezeInfo"]){
var _ea8=oCV.getPinFreezeManager();
_ea8.fromJSONString(oCV.envParams["pinFreezeInfo"]);
delete oCV.envParams["pinFreezeInfo"];
}
if(_ea6!="prompting"||!oCV.executeCallback("prompt")){
this.postComplete();
}else{
oCV.updateSkipToNavigationLink(true);
}
}
}
}
this.showReport();
this.getViewer().renderTabs();
this.onAsynchStatusUpdate(_ea6);
};
RequestHandler.prototype.postComplete=function(){
this.parent.postComplete.call(this);
var oCV=this.getViewer();
var _eaa=document.getElementById("RVContent"+oCV.getId());
if(_eaa){
_eaa.scrollTop=0;
}
oCV.updateSkipToReportLink();
if(oCV.rvMainWnd){
oCV.updateLayout(oCV.getStatus());
if(!oCV.getUIConfig()||oCV.getUIConfig().getShowToolbar()){
var _eab=oCV.rvMainWnd.getToolbar();
if(_eab){
oCV.rvMainWnd.updateToolbar(oCV.outputFormat);
_eab.draw();
}
}
if(!oCV.getUIConfig()||oCV.getUIConfig().getShowBanner()){
var _eac=oCV.rvMainWnd.getBannerToolbar();
if(_eac){
_eac.draw();
}
}
}
if(oCV.getBrowser()=="moz"){
if(_eaa){
if(oCV.outputFormat=="XML"&&oCV.getStatus()!="prompting"){
_eaa.style.overflow="hidden";
}else{
_eaa.style.overflow="auto";
}
}
}
oCV.gbPromptRequestSubmitted=false;
this.showReport();
if(oCV.getPinFreezeManager()&&oCV.getPinFreezeManager().hasFrozenContainers()){
var _ead=document.getElementById("CVReport"+oCV.getId());
if(_ead){
setTimeout(function(){
oCV.getPinFreezeManager().renderReportWithFrozenContainers(_ead);
if(isIE()){
oCV.repaintDiv(_eaa);
}
},1);
}
}
oCV.setMaxContentSize();
oCV.executeCallback("done");
oCV.doneLoading();
};
function ActionFormFields(_eae){
this.m_dispatcherEntry=_eae;
this.m_oCV=_eae.getViewer();
};
ActionFormFields.prototype.addFormFields=function(){
var _eaf=this.m_dispatcherEntry;
var _eb0=_eaf.getAction();
_eb0.preProcess();
_eaf.addFormField("ui.action","modifyReport");
if(this.m_oCV.getModelPath()!==""){
_eaf.addFormField("modelPath",this.m_oCV.getModelPath());
if(typeof this.m_oCV.envParams["metaDataModelModificationTime"]!="undefined"){
_eaf.addFormField("metaDataModelModificationTime",this.m_oCV.envParams["metaDataModelModificationTime"]);
}
}
if(_eb0.doAddActionContext()===true){
var _eb1=_eb0.addActionContext();
_eaf.addFormField("cv.actionContext",_eb1);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_eb1,"xml");
}
}
var _eb2=this.m_oCV.envParams["bux"]=="true";
if(_eb2){
_eaf.addFormField("cv.showFaultPage","false");
}else{
_eaf.addFormField("cv.showFaultPage","true");
}
_eaf.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_eaf.addDefinedFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_eaf.addDefinedFormField("modelPath",this.m_oCV.envParams["modelPath"]);
_eaf.addDefinedFormField("packageBase",this.m_oCV.envParams["packageBase"]);
_eaf.addDefinedFormField("rap.state",this.m_oCV.envParams["rap.state"]);
_eaf.addDefinedFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
_eaf.addDefinedFormField("ui.primaryAction",this.m_oCV.envParams["ui.primaryAction"]);
_eaf.addNonNullFormField("cv.debugDirectory",this.m_oCV.envParams["cv.debugDirectory"]);
_eaf.addNonNullFormField("ui.objectClass",this.m_oCV.envParams["ui.objectClass"]);
_eaf.addNonNullFormField("bux",this.m_oCV.envParams["bux"]);
_eaf.addNonNullFormField("baseReportModificationTime",this.m_oCV.envParams["baseReportModificationTime"]);
_eaf.addNonNullFormField("originalReport",this.m_oCV.envParams["originalReport"]);
var _eb3=this.m_oCV.getFlashChartOption();
if(_eb3!=null){
_eaf.addFormField("savedFlashChartOption",_eb3);
if(_eb3&&_eb0!=null&&typeof (_eb0.m_requestParams)!="undefined"&&typeof (_eb0.m_requestParams.targetType)!="undefined"){
var _eb4=false;
var _eb5=null;
if(typeof (_eb0.m_requestParams.targetType.targetType)!="undefined"){
_eb5=_eb0.m_requestParams.targetType.targetType;
}else{
_eb5=_eb0.m_requestParams.targetType;
}
if(_eb5.match("v2_")!=null||_eb5.match("_v2")!=null){
_eb4=true;
}else{
var _eb6=this.m_oCV.getRAPReportInfo();
var _eb7=_eb0.getSelectedReportInfo();
if(_eb6&&_eb7){
var _eb8=_eb6.getDisplayTypes(_eb7.container);
if(_eb8.match("v2_")!=null||_eb8.match("_v2")!=null){
_eb4=true;
}
}
}
_eaf.addFormField("hasAVSChart",_eb4);
}else{
_eaf.addFormField("hasAVSChart",this.m_oCV.hasAVSChart());
}
}
var sEP=this.m_oCV.getExecutionParameters();
if(sEP){
_eaf.addFormField("executionParameters",encodeURIComponent(sEP));
}
_eaf.addFormField("ui.conversation",encodeURIComponent(this.m_oCV.getConversation()));
_eaf.addFormField("m_tracking",encodeURIComponent(this.m_oCV.getTracking()));
var sCAF=this.m_oCV.getCAFContext();
if(sCAF){
_eaf.addFormField("ui.cafcontextid",sCAF);
}
if(_eb0.forceRunSpecRequest()){
_eaf.addFormField("widget.forceRunSpec","true");
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
ViewerDispatcher.prototype.setUsePageRequest=function(_ebb){
this.m_bUsePageRequest=_ebb;
};
ViewerDispatcher.prototype.getUsePageRequest=function(){
return this.m_bUsePageRequest;
};
ViewerDispatcher.prototype.dispatchRequest=function(_ebc){
if(this.m_activeRequest==null){
this.startRequest(_ebc);
}else{
if(_ebc.canBeQueued()==true){
this.m_requestQueue.push(_ebc);
}else{
if(window.cognosViewerDebug&&console&&console.warn){
console.warn("Warning! Dropped a dispatcher entry!");
}
}
}
};
ViewerDispatcher.prototype.startRequest=function(_ebd){
this.m_activeRequest=_ebd;
if(_ebd!=null){
_ebd.setUsePageRequest(this.m_bUsePageRequest);
_ebd.sendRequest();
}
};
ViewerDispatcher.prototype.cancelRequest=function(key){
for(var i=0;i<this.m_requestQueue.length;i++){
var _ec0=this.m_requestQueue[i];
if(_ec0.getKey()===key){
_ec0.setCallbacks({"onEntryComplete":null});
_ec0.cancelRequest(false);
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
ViewerDispatcher.prototype.requestComplete=function(_ec1){
this.startRequest(this.nextRequest());
};
ViewerDispatcher.prototype.nextRequest=function(){
var _ec2=null;
if(this.m_requestQueue.length>0){
_ec2=this.m_requestQueue.shift();
if(_ec2.getKey()!=null){
while(this.m_requestQueue.length>0&&this.m_requestQueue[0].getKey()==_ec2.getKey()){
_ec2=this.m_requestQueue.shift();
}
}
}
return _ec2;
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
DispatcherEntry.prototype.setHeaders=function(_ec4){
this.m_request.setHeaders(_ec4);
};
DispatcherEntry.prototype.getHeaders=function(){
return this.m_request.getHeaders();
};
DispatcherEntry.prototype.setOriginalFormFields=function(_ec5){
this.m_originalFormFields=_ec5;
};
DispatcherEntry.prototype.getOriginalFormFields=function(){
return this.m_originalFormFields;
};
DispatcherEntry.prototype.setRequestHandler=function(_ec6){
_ec6.addCallbackHooks();
this.m_requestHandler=_ec6;
};
DispatcherEntry.prototype.getRequestHandler=function(){
return this.m_requestHandler;
};
DispatcherEntry.prototype.setWorkingDialog=function(_ec7){
if(this.getRequestHandler()){
this.m_requestHandler.setWorkingDialog(_ec7);
}
};
DispatcherEntry.prototype.setRequestIndicator=function(_ec8){
if(this.getRequestHandler()){
this.getRequestHandler().setRequestIndicator(_ec8);
}
};
DispatcherEntry.prototype.forceSynchronous=function(){
this.getRequest().forceSynchronous();
};
DispatcherEntry.prototype.setUsePageRequest=function(_ec9){
this.m_bUsePageRequest=_ec9;
};
DispatcherEntry.prototype.getUsePageRequest=function(){
return this.m_bUsePageRequest;
};
DispatcherEntry.prototype.setDefaultFormFields=function(){
var _eca=this.getViewer().envParams;
this.addFormField("b_action","cognosViewer");
this.addFormField("cv.catchLogOnFault","true");
this.addDefinedNonNullFormField("protectParameters",_eca["protectParameters"]);
this.addDefinedNonNullFormField("ui.routingServerGroup",_eca["ui.routingServerGroup"]);
this.addDefinedNonNullFormField("cv.debugDirectory",_eca["cv.debugDirectory"]);
this.addDefinedNonNullFormField("cv.showFaultPage",_eca["cv.showFaultPage"]);
this.addDefinedNonNullFormField("cv.useRAPDrill",_eca["cv.useRAPDrill"]);
this.addDefinedNonNullFormField("container",_eca["container"]);
this.addNonEmptyStringFormField("cv.objectPermissions",_eca["cv.objectPermissions"]);
};
DispatcherEntry.prototype.getViewer=function(){
return this.m_oCV;
};
DispatcherEntry.prototype.prepareRequest=function(){
};
DispatcherEntry.addWidgetInfoToFormFields=function(_ecb,_ecc){
if(_ecb){
var _ecd=_ecb.getBUXRTStateInfoMap();
if(_ecd){
_ecc.addFormField("cv.buxRTStateInfo",_ecd);
}
var _ece=_ecb.getDisplayName();
if(_ece&&_ece.length>0){
_ecc.addFormField("displayTitle",_ece);
}
}
};
DispatcherEntry.prototype.canBeQueued=function(){
return this.m_canBeQueued;
};
DispatcherEntry.prototype.setCanBeQueued=function(_ecf){
this.m_canBeQueued=_ecf;
};
DispatcherEntry.prototype.getKey=function(){
return this.m_requestKey;
};
DispatcherEntry.prototype.setKey=function(key){
this.m_requestKey=key;
};
DispatcherEntry.prototype.setRequest=function(_ed1){
this.m_request=_ed1;
};
DispatcherEntry.prototype.getRequest=function(){
return this.m_request;
};
DispatcherEntry.prototype.setCallbacks=function(_ed2){
this.getRequest().setCallbacks(_ed2);
};
DispatcherEntry.prototype.getCallbacks=function(){
return this.getRequest().getCallbacks();
};
DispatcherEntry.prototype.sendRequest=function(){
this.prepareRequest();
var _ed3=this.getRequest().getFormFields();
var _ed4=_ed3.keys();
if(!this.m_originalFormFields){
this.m_originalFormFields=new CDictionary();
for(var _ed5=0;_ed5<_ed4.length;_ed5++){
this.m_originalFormFields.add(_ed4[_ed5],_ed3.get(_ed4[_ed5]));
}
}
this.getRequest().sendRequest();
};
DispatcherEntry.prototype.onNewRequest=function(_ed6){
this.setRequest(_ed6);
};
DispatcherEntry.prototype.retryRequest=function(){
var oCV=this.getViewer();
oCV.setRetryDispatcherEntry(null);
var _ed8=this.getRequest().newRequest();
_ed8.setHeaders(null);
this.setRequest(_ed8);
var _ed9=this.m_originalFormFields.keys();
for(var _eda=0;_eda<_ed9.length;_eda++){
var _edb=_ed9[_eda];
var _edc=this.m_originalFormFields.get(_edb);
if(_edb=="cv.responseFormat"&&_edc=="iWidget"){
this.addFormField("cv.responseFormat","data");
}else{
if(_edb=="ui.action"&&_edc=="wait"){
this.addFormField("ui.action",this.m_originalFormFields.get("ui.primaryAction"));
}else{
if(_edb!="m_tracking"&&_edb!="cv.outputKey"){
this.addFormField(_edb,_edc);
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
DispatcherEntry.prototype.cancelRequest=function(_edd){
if(!this.m_bCancelCalled){
this.m_bCancelCalled=true;
if(this.getRequestHandler()){
this.getRequestHandler().onCancel();
}
if(_edd){
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
DispatcherEntry.prototype.addFormField=function(name,_ee2){
this.m_request.addFormField(name,_ee2);
};
DispatcherEntry.prototype.addDefinedNonNullFormField=function(name,_ee4){
if(typeof _ee4!="undefined"&&_ee4!=null){
this.addFormField(name,_ee4);
}
};
DispatcherEntry.prototype.addDefinedFormField=function(name,_ee6){
if(typeof _ee6!="undefined"){
this.addFormField(name,_ee6);
}
};
DispatcherEntry.prototype.addNonNullFormField=function(name,_ee8){
if(_ee8!=null){
this.addFormField(name,_ee8);
}
};
DispatcherEntry.prototype.addNonEmptyStringFormField=function(name,_eea){
if(typeof _eea!="undefined"&&_eea!=null&&_eea!=""){
this.addFormField(name,_eea);
}
};
DispatcherEntry.prototype.onWorking=function(_eeb,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onWorking(_eeb);
}
};
DispatcherEntry.prototype.onFault=function(_eed){
if(this.getRequestHandler()){
this.getRequestHandler().onFault(_eed);
}
};
DispatcherEntry.prototype.onError=function(_eee){
if(this.m_bCancelCalled){
return;
}
if(this.getRequestHandler()){
this.getRequestHandler().onError(_eee);
}
};
DispatcherEntry.prototype.possibleUnloadEvent=function(){
this.setCallbacks({"error":{}});
};
DispatcherEntry.prototype.onPreHttpRequest=function(_eef){
if(this.getRequestHandler()){
this.getRequestHandler().preHttpRequest(_eef);
}
};
DispatcherEntry.prototype.onPostHttpRequest=function(_ef0){
if(this.getRequestHandler()){
this.getRequestHandler().postHttpRequest(_ef0);
}
};
DispatcherEntry.prototype.onPassportTimeout=function(_ef1){
if(this.getRequestHandler()){
this.getRequestHandler().onPassportTimeout(_ef1);
}
};
DispatcherEntry.prototype.onPrompting=function(_ef2){
if(this.getRequestHandler()){
this.getRequestHandler().onPrompting(_ef2);
}
};
DispatcherEntry.prototype.onEntryComplete=function(_ef3){
if(!this.m_oCV._beingDestroyed){
this.m_oCV.getViewerDispatcher().requestComplete(this);
}
};
DispatcherEntry.prototype.onEntryFault=function(_ef4){
this.m_oCV.setFaultDispatcherEntry(this);
this.m_oCV.resetViewerDispatcher();
if(!this.m_bCancelCalled){
this.m_oCV.setRetryDispatcherEntry(this);
}
};
DispatcherEntry.prototype.onCloseErrorDlg=function(){
var _ef5=this.getCallbacks();
if(_ef5["closeErrorDlg"]){
var _ef6=GUtil.generateCallback(_ef5["closeErrorDlg"].method,[],_ef5["closeErrorDlg"].object);
_ef6();
}
};
DispatcherEntry.prototype.onPostEntryComplete=function(){
if(this.getRequestHandler()){
this.getRequestHandler().onPostEntryComplete();
}
this.executeCallback("postComplete");
};
DispatcherEntry.prototype.executeCallback=function(_ef7){
var _ef8=this.getCallbacks();
if(_ef8[_ef7]){
var _ef9=(_ef8.customArguments)?[this,_ef8.customArguments]:[this];
var _efa=GUtil.generateCallback(_ef8[_ef7].method,_ef9,_ef8[_ef7].object);
_efa();
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
var _efe=new AsynchDATARequest(oCV.getGateway(),oCV.getWebContentRoot());
this.setRequest(_efe);
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
var _f00=new AsynchJSONRequest(oCV.getGateway(),oCV.getWebContentRoot());
this.setRequest(_f00);
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
var _f02=this.getFormField("ui.action");
var _f03=this.getViewer().getActionState();
if(_f03!==""&&(_f02=="wait"||_f02=="forward"||_f02=="back")){
this.addFormField("cv.actionState",_f03);
}
var _f04=["nextPage","previousPage","firstPage","lastPage","reportAction","cancel","wait"];
var _f05=true;
for(var i=0;i<_f04.length;i++){
if(_f04[i]==_f02){
_f05=false;
break;
}
}
if(_f05){
this.getViewer().clearTabs();
}
if(this.getViewer().getCurrentlySelectedTab()&&!this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")){
this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",this.getViewer().getCurrentlySelectedTab());
}
};
ReportDispatcherEntry.prototype.setDefaultFormFields=function(){
var oCV=this.getViewer();
var _f08=oCV.envParams;
this.addFormField("cv.id",oCV.getId());
if(_f08["cv.showFaultPage"]){
this.addFormField("cv.showFaultPage",_f08["cv.showFaultPage"]);
}else{
this.addFormField("cv.showFaultPage","false");
}
this.addDefinedNonNullFormField("ui.object",_f08["ui.object"]);
this.addDefinedNonNullFormField("ui.primaryAction",_f08["ui.primaryAction"]);
this.addDefinedNonNullFormField("ui.objectClass",_f08["ui.objectClass"]);
this.addNonEmptyStringFormField("specificationType",_f08["specificationType"]);
this.addNonEmptyStringFormField("cv.promptForDownload",_f08["cv.promptForDownload"]);
this.addNonEmptyStringFormField("ui.conversation",oCV.getConversation());
this.addNonEmptyStringFormField("m_tracking",oCV.getTracking());
var _f09=oCV.getExecutionParameters();
this.addNonEmptyStringFormField("executionParameters",_f09);
var sCAF=oCV.getCAFContext();
this.addDefinedNonNullFormField("ui.cafcontextid",sCAF);
};
ReportDispatcherEntry.prototype.onWorking=function(_f0b,arg1){
var _f0d=_f0b.getResponseState();
var _f0e=this.getRequestHandler();
if(_f0e){
var _f0f=_f0e.getWorkingDialog();
if(_f0f&&_f0f.setSecondaryRequests&&_f0d.m_aSecRequests){
_f0f.setSecondaryRequests(_f0d.m_aSecRequests);
}
}
DispatcherEntry.prototype.onWorking.call(this,_f0b,arg1);
if(_f0e){
this.getRequestHandler().updateViewerState(_f0d);
}
};
ReportDispatcherEntry.prototype.onComplete=function(_f10,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onComplete(_f10);
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
var _f14=oCV.envParams;
this.addFormField("cv.showFaultPage","true");
this.addDefinedNonNullFormField("cv.header",_f14["cv.header"]);
this.addDefinedNonNullFormField("cv.toolbar",_f14["cv.toolbar"]);
this.addDefinedNonNullFormField("ui.backURL",_f14["ui.backURL"]);
this.addDefinedNonNullFormField("errURL",_f14["ui.backURL"]);
this.addDefinedNonNullFormField("errURL",_f14["ui.errURL"]);
this.addDefinedNonNullFormField("cv.catchLogOnFault","true");
this.addDefinedNonNullFormField("m_sessionConv",_f14["m_sessionConv"]);
if(_f14["m_session"]){
this.addFormField("m_session",_f14["m_session"]);
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
var _f15=this.m_oCV.getPinFreezeManager();
if(_f15&&_f15.hasFrozenContainers()){
this.addFormField("pinFreezeInfo",_f15.toJSONString());
}
}
};
ViewerDispatcherEntry.prototype.sendRequest=function(){
if(this.getUsePageRequest()){
this.prepareRequest();
var _f16=this.buildRequestForm();
if(typeof document.progress!="undefined"){
setTimeout("document.progress.src=\""+this.m_oCV.getSkin()+"/branding/progress.gif"+"\";",1);
}
_f16.submit();
}else{
this.getViewer().closeContextMenuAndToolbarMenus();
this.parent.sendRequest.call(this);
}
};
ViewerDispatcherEntry.prototype.buildRequestForm=function(){
var oCV=this.getViewer();
var _f18=document.createElement("form");
_f18.setAttribute("id","requestForm");
_f18.setAttribute("name","requestForm");
_f18.setAttribute("method","post");
_f18.setAttribute("target","_self");
_f18.setAttribute("action",oCV.getGateway());
_f18.style.display="none";
document.body.appendChild(_f18);
var _f19=this.getRequest().getFormFields();
var _f1a=_f19.keys();
for(var _f1b=0;_f1b<_f1a.length;_f1b++){
_f18.appendChild(this.createHiddenFormField(_f1a[_f1b],_f19.get(_f1a[_f1b])));
}
for(param in oCV.envParams){
if(!_f19.exists(param)&&param!="cv.actionState"){
_f18.appendChild(this.createHiddenFormField(param,oCV.envParams[param]));
}
}
return _f18;
};
ViewerDispatcherEntry.prototype.createHiddenFormField=function(name,_f1d){
var _f1e=document.createElement("input");
_f1e.setAttribute("type","hidden");
_f1e.setAttribute("name",name);
_f1e.setAttribute("id",name);
_f1e.setAttribute("value",_f1d);
return (_f1e);
};
ViewerDispatcherEntry.prototype.onCancel=function(){
var oCV=this.getViewer();
oCV.setStatus("complete");
if(this.getUsePageRequest()||!oCV.isReportRenderingDone()){
oCV.executeCallback("cancel");
}
};
ViewerDispatcherEntry.prototype.onFault=function(_f20){
if(this.getViewer().callbackExists("fault")){
this.getViewer().setSoapFault(_f20.getSoapFault());
this.getViewer().executeCallback("fault");
}else{
this.parent.onFault.call(this,_f20);
}
};
ViewerDispatcherEntry.prototype.onComplete=function(_f21){
var oCV=this.getViewer();
oCV.saveBackJaxInformation(_f21);
if(oCV.isReportRenderingDone()){
this.getViewer().getSelectionController().resetSelections();
}
this.parent.onComplete.call(this,_f21);
};
ViewerDispatcherEntry.prototype.onPrompting=function(_f23){
var oCV=this.getViewer();
oCV.updateSkipToNavigationLink(true);
if(!oCV.executeCallback("prompt")){
this.onComplete(_f23);
}
};
ViewerDispatcherEntry.prototype.onEntryComplete=function(_f25){
if(this.getRequestHandler()){
this.getRequestHandler().setDispatcherEntry(this);
}
this.parent.onEntryComplete.call(this,_f25);
};

