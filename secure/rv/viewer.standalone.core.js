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
function CUIStyle(_15d,_15e,_15f,_160,_161){
this.m_active=_15d;
this.m_normal=_15d;
this.m_rollover=_15e;
this.m_activeRollover=_15e;
this.m_depressed=_15f;
this.m_depressed_rollover=_160;
this.m_disabled=_161;
};
function CUIStyle_getActiveState(){
return this.m_active;
};
function CUIStyle_setActiveState(_162){
switch(_162){
case "normal":
this.m_active=this.m_normal;
break;
case "depressed":
this.m_active=this.m_depressed;
break;
case "disabled":
this.m_active=this.m_disabled;
break;
default:
this.m_active=this.m_normal;
}
};
function CUIStyle_getActiveRolloverState(){
return this.m_activeRollover;
};
function CUIStyle_setActiveRolloverState(_163){
switch(_163){
case "normal":
this.m_activeRollover=this.m_rollover;
break;
case "depressed":
this.m_activeRollover=this.m_depressed_rollover;
break;
case "disabled":
this.m_activeRollover=this.m_disabled;
break;
default:
this.m_activeRollover=this.m_rollover;
}
};
function CUIStyle_getNormalState(){
return this.m_normal;
};
function CUIStyle_getRolloverState(){
return this.m_rollover;
};
function CUIStyle_getDepressedState(){
return this.m_depressed;
};
function CUIStyle_getDepressedRolloverState(){
return this.m_depressed_rollover;
};
function CUIStyle_getDisabledState(){
return this.m_disabled;
};
function CUIStyle_setNormalState(_164){
this.m_normal=_164;
};
function CUIStyle_setRolloverState(_165){
this.m_rollover=_165;
};
function CUIStyle_setDepressedState(_166){
this.m_depressed=_166;
};
function CUIStyle_setDepressedRolloverState(_167){
this.m_depressed_rollover=_167;
};
function CUIStyle_setDisabledState(_168){
this.m_disabled=_168;
};
CUIStyle.prototype.getNormalState=CUIStyle_getNormalState;
CUIStyle.prototype.getRolloverState=CUIStyle_getRolloverState;
CUIStyle.prototype.getDepressedState=CUIStyle_getDepressedState;
CUIStyle.prototype.getDepressedRolloverState=CUIStyle_getDepressedRolloverState;
CUIStyle.prototype.getDisabledState=CUIStyle_getDisabledState;
CUIStyle.prototype.setNormalState=CUIStyle_setNormalState;
CUIStyle.prototype.setRolloverState=CUIStyle_setRolloverState;
CUIStyle.prototype.setDepressedState=CUIStyle_setDepressedState;
CUIStyle.prototype.setDepressedRolloverState=CUIStyle_setDepressedRolloverState;
CUIStyle.prototype.setDisabledState=CUIStyle_setDisabledState;
CUIStyle.prototype.setActiveState=CUIStyle_setActiveState;
CUIStyle.prototype.getActiveState=CUIStyle_getActiveState;
CUIStyle.prototype.getActiveRolloverState=CUIStyle_getActiveRolloverState;
CUIStyle.prototype.setActiveRolloverState=CUIStyle_setActiveRolloverState;
function CToolbarSelect(_169,name,_16b,_16c,_16d){
this.m_parent=_169;
this.m_name=name;
this.m_command=_16b;
this.m_label=_16c;
this.m_toolTip=_16d;
this.m_items=[];
if(typeof this.m_parent=="object"&&typeof this.m_parent.add=="function"){
this.m_parent.add(this);
}
if(_16c){
this.add("",_16c);
}
};
function CToolbarSelect_draw(){
var html="<select id=\""+this.m_name+"\" name=\""+this.m_name+"\" onchange=\""+this.m_command+"\"";
if(this.m_toolTip!=""){
html+=" title=\""+this.m_toolTip+"\"";
}
html+=">";
html+=this.drawItems();
html+="</select>";
return html;
};
function CToolbarSelect_drawItems(){
var html="";
for(var i=0;i<this.m_items.length;i++){
html+="<option value=\""+this.m_items[i].getUse()+"\">"+this.m_items[i].getDisplay()+"</option>";
}
return html;
};
function CToolbarSelect_add(sUse,_172){
var _173=new CSelectItem(sUse,_172);
this.m_items=this.m_items.concat(_173);
};
function CToolbarSelect_isVisible(){
return true;
};
CToolbarSelect.prototype.draw=CToolbarSelect_draw;
CToolbarSelect.prototype.drawItems=CToolbarSelect_drawItems;
CToolbarSelect.prototype.isVisible=CToolbarSelect_isVisible;
CToolbarSelect.prototype.add=CToolbarSelect_add;
function CSelectItem(sUse,_175){
this.m_sUse=sUse;
this.m_sDisplay=_175;
};
function CSelectItem_getUse(){
return this.m_sUse;
};
function CSelectItem_getDisplay(){
return this.m_sDisplay;
};
CSelectItem.prototype.getUse=CSelectItem_getUse;
CSelectItem.prototype.getDisplay=CSelectItem_getDisplay;
function CToolbarPicker(_176,_177,_178,sRef,_17a){
this.m_parent=_176;
this.m_command=_177;
this.m_oPicker=null;
this.m_sPromptId=_178;
this.m_sRef=sRef;
this.m_sType=_17a;
if(typeof this.m_parent=="object"&&typeof this.m_parent.add=="function"){
this.m_parent.add(this);
}
};
function CToolbarPicker_draw(){
var html="<div id=\""+this.m_sType+this.m_sPromptId+"\" onclick=\""+this.m_sRef+".preventBubbling(event);\"></div>";
return html;
};
function CToolbarPicker_init(){
this.m_oPicker=eval(this.m_command);
g_pickerObservers=g_pickerObservers.concat(this.m_sRef);
};
function CToolbarPicker_isVisible(){
return true;
};
function CToolbarPicker_togglePicker(){
this.m_oPicker.togglePicker();
};
function CToolbarPicker_setActiveColor(s){
this.m_oPicker.setActiveColor(s);
};
function CToolbarPicker_setColor(s){
this.m_oPicker.setColor(s);
};
function CToolbarPicker_setAlignment(s){
this.m_oPicker.setAlignment(s);
};
function CToolbarPicker_setActiveAlignment(s){
this.m_oPicker.setActiveAlignment(s);
};
function CToolbarPicker_setPalette(s){
this.m_oPicker.setPalette(s);
};
function CToolbarPicker_applyCustomStyle(){
this.m_oPicker.applyCustomStyle();
};
function CToolbarPicker_updateCustomStyle(){
this.m_oPicker.updateCustomStyle();
};
function CToolbarPicker_hide(){
this.m_oPicker.hide();
};
function CToolbarPicker_preventBubbling(e){
this.m_oPicker.preventBubbling(e);
};
function CToolbarPicker_buttonMouseHandler(_182,_183){
this.m_oPicker.buttonMouseHandler(_182,_183);
};
CToolbarPicker.prototype.draw=CToolbarPicker_draw;
CToolbarPicker.prototype.isVisible=CToolbarPicker_isVisible;
CToolbarPicker.prototype.init=CToolbarPicker_init;
CToolbarPicker.prototype.togglePicker=CToolbarPicker_togglePicker;
CToolbarPicker.prototype.setColor=CToolbarPicker_setColor;
CToolbarPicker.prototype.setAlignment=CToolbarPicker_setAlignment;
CToolbarPicker.prototype.setActiveAlignment=CToolbarPicker_setActiveAlignment;
CToolbarPicker.prototype.setActiveColor=CToolbarPicker_setActiveColor;
CToolbarPicker.prototype.setPalette=CToolbarPicker_setPalette;
CToolbarPicker.prototype.applyCustomStyle=CToolbarPicker_applyCustomStyle;
CToolbarPicker.prototype.updateCustomStyle=CToolbarPicker_updateCustomStyle;
CToolbarPicker.prototype.hide=CToolbarPicker_hide;
CToolbarPicker.prototype.preventBubbling=CToolbarPicker_preventBubbling;
CToolbarPicker.prototype.buttonMouseHandler=CToolbarPicker_buttonMouseHandler;
var tbUniqueId=0;
function makeId(){
return tbUniqueId++;
};
gDropDownButtonStyle=new CUIStyle("dropDownArrow","dropDownArrowOver","","","");
gHeaderDropDownButtonStyle=new CUIStyle("bannerDropDownArrow","bannerDropDownArrowOver","","","");
function CToolbarButton(_184,_185,_186,_187,_188,_189,_18a,_18b,_18c){
this.m_id="tbbutton"+makeId();
this.m_bVisible=true;
this.m_action=_185;
this.m_toolTip=_187;
if(typeof _18c!="undefined"&&_18c!=""){
this.m_webContentRoot=_18c;
}else{
this.m_webContentRoot="..";
}
this.m_icon=(_186)?new CIcon(_186,_187,this.webContentRoot):null;
this.m_parent=_184;
this.m_menu=null;
if(typeof _189=="boolean"){
this.m_bHideDropDown=_189;
}else{
this.m_bHideDropDown=false;
}
this.m_style=new CUIStyle(_188.getNormalState(),_188.getRolloverState(),_188.getDepressedState(),_188.getDepressedRolloverState(),_188.getDisabledState());
this.m_observers=new CObserver(this);
if(typeof this.m_parent=="object"&&typeof this.m_parent.add=="function"){
this.m_parent.add(this);
}
this.m_label=(_18a)?_18a:null;
this.m_dropDownToolTip=(_18b)?_18b:this.m_toolTip;
this.m_dropDownStyle=gDropDownButtonStyle;
};
function CToolbarButton_getId(){
return this.m_id;
};
function CToolbarButton_draw(){
var html="";
html+="<div style=\"margin-right:3px;\"><button type=\"button\" id=\"";
html+=this.m_id;
html+="\"";
if(typeof this.getStyle()=="object"){
html+=" class=\""+this.getStyle().getActiveState()+"\"";
if(this.getStyle().getActiveState()!=this.getStyle().getDisabledState()){
if(this.isEnabled()){
html+=" tabIndex=\"1\"";
}
html+=" hideFocus=\"true\"";
}
}
if(this.m_toolTip!=""){
html+=" title=\""+this.m_toolTip+"\"";
}
html+=">";
if(this.m_icon!=null){
html+=this.m_icon.draw();
}
if(this.m_label!=null){
html+=this.m_label;
}
html+="</button>";
if(this.m_menu!=null&&!this.m_bHideDropDown){
html+="<button type=\"button\" id=\"";
html+=("menu"+this.getId());
html+="\"";
if(typeof this.getStyle()=="object"){
html+=" class=\""+this.getDropDownStyle().getActiveState()+"\"";
if(this.getStyle().getActiveState()!=this.getStyle().getDisabledState()){
if(this.isEnabled()){
html+=" tabIndex=\"1\"";
}
html+=" hideFocus=\"true\"";
}
}
if(this.m_dropDownToolTip!=""){
html+=" title=\""+this.m_dropDownToolTip+"\"";
}
html+="><img style=\"vertical-align:middle;\" border=\"0\" src=\""+this.m_webContentRoot+"/common/images/toolbar_drop_arrow.gif\"";
if(this.m_dropDownToolTip!=""){
html+=" alt=\""+this.m_dropDownToolTip+"\"";
html+=" title=\""+this.m_dropDownToolTip+"\"";
}else{
html+=" alt=\"\"";
}
html+=" width=\"7\" height=\"16\"/></button>";
}
html+="</div>";
return html;
};
function CToolbarButton_attachEvents(){
if(typeof this.getParent().getHTMLContainer!="function"){
return;
}
var _18e=this.getParent().getHTMLContainer();
if(_18e==null){
return;
}
var _18f=eval(_18e.document?_18e.document.getElementById(this.m_id):_18e.ownerDocument.getElementById(this.m_id));
if(_18f==null){
return;
}
_18f.onmouseover=this.onmouseover;
_18f.onmouseout=this.onmouseout;
_18f.onclick=this.onclick;
_18f.onkeypress=this.onkeypress;
_18f.onfocus=this.onfocus;
_18f.onblur=this.onblur;
_18f.tbItem=eval(this);
if(this.m_menu!=null&&!this.m_bHideDropDown){
var _190=eval(_18e.document?_18e.document.getElementById("menu"+this.getId()):_18e.ownerDocument.getElementById("menu"+this.getId()));
_190.onmouseover=this.onmouseover;
_190.onmouseout=this.onmouseout;
_190.onclick=this.onclick;
_190.onkeypress=this.onkeypress;
_190.onfocus=this.onfocus;
_190.onblur=this.onblur;
_190.tbItem=eval(this);
}
};
function CToolbarButton_createDropDownMenu(_191,_192){
this.m_dropDownToolTip=(_192)?_192:this.m_toolTip;
this.m_menu=new CMenu("dropDown"+this.getId(),_191,this.m_webContentRoot);
this.m_menu.setParent(this);
return this.m_menu;
};
function CToolbarButton_addOwnerDrawControl(_193){
this.m_menu=_193;
if(typeof _193.setParent!="undefined"){
this.m_menu.setParent(this);
}
};
function CToolbarButton_getParent(){
return this.m_parent;
};
function CToolbarButton_setParent(_194){
this.m_parent=_194;
};
function CToolbarButton_getAction(){
return this.m_action;
};
function CToolbarButton_setAction(_195){
this.m_action=_195;
};
function CToolbarButton_getToolTip(){
return this.m_toolTip;
};
function CToolbarButton_setToolTip(_196){
this.m_toolTip=_196;
};
function CToolbarButton_getDropDownToolTip(){
return this.m_dropDownToolTip;
};
function CToolbarButton_setDropDownToolTip(_197){
this.m_dropDownToolTip=_197;
};
function CToolbarButton_getIcon(){
return this.m_icon;
};
function CToolbarButton_setIcon(_198){
this.m_icon.setPath(_198);
};
function CToolbarButton_onmouseover(evt){
var _19a=this.tbItem;
if(typeof _19a=="object"){
if(!_19a.isEnabled()){
return;
}
if(_19a.getMenu()!=null&&!_19a.m_bHideDropDown&&("menu"+_19a.getId())==this.id){
this.className=_19a.getDropDownStyle().getActiveRolloverState();
}else{
if(typeof _19a.getStyle()=="object"){
this.className=_19a.getStyle().getActiveRolloverState();
}
if(_19a.getMenu()!=null&&!_19a.m_bHideDropDown){
var _19b=this.document?this.document.getElementById("menu"+_19a.getId()):this.ownerDocument.getElementById("menu"+_19a.getId());
if(typeof _19b=="object"){
_19b.className=_19a.getDropDownStyle().getActiveRolloverState();
}
}
}
if(_19a.getParent()!=null&&typeof _19a.getParent().onmouseover=="function"){
_19a.getParent().onmouseover(evt);
}
_19a.getObservers().notify(CToolbarButton_onmouseover);
}
};
function CToolbarButton_onmouseout(evt){
var _19d=this.tbItem;
if(typeof _19d=="object"){
if(!_19d.isEnabled()){
return;
}
if(_19d.getMenu()!=null&&!_19d.m_bHideDropDown&&("menu"+_19d.getId())==this.id){
this.className=_19d.getDropDownStyle().getActiveState();
}else{
if(typeof _19d.getStyle()=="object"){
this.className=_19d.getStyle().getActiveState();
}
if(_19d.getMenu()!=null&&!_19d.m_bHideDropDown){
var _19e=this.document?this.document.getElementById("menu"+_19d.getId()):this.ownerDocument.getElementById("menu"+_19d.getId());
if(typeof _19e=="object"){
_19e.className=_19d.getDropDownStyle().getActiveState();
}
}
}
if(_19d.getParent()!=null&&typeof _19d.getParent().onmouseout=="function"){
_19d.getParent().onmouseout(evt);
}
_19d.getObservers().notify(CToolbarButton_onmouseout);
}
};
function CToolbarButton_onclick(evt){
evt=(evt)?evt:((event)?event:null);
var _1a0=this.tbItem;
if(_1a0!=null){
if(!_1a0.isEnabled()){
return;
}
var menu=_1a0.getMenu();
if(menu!=null&&((this.id==("menu"+_1a0.getId()))||(_1a0.m_bHideDropDown&&this.id==_1a0.getId()))){
if(menu.isVisible()){
menu.remove();
}else{
if(typeof menu.setHTMLContainer!="undefined"){
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
}
if(typeof _1a0.m_parent.closeMenus=="function"){
_1a0.m_parent.closeMenus();
}
menu.draw();
menu.show();
}
}else{
eval(this.tbItem.m_action);
}
if(_1a0.getParent()!=null&&typeof _1a0.getParent().onclick=="function"){
_1a0.getParent().onclick(evt);
}
_1a0.getObservers().notify(CToolbarButton_onclick);
}
if(this.blur){
this.blur();
}
evt.cancelBubble=true;
return false;
};
function CToolbarButton_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
if(evt.keyCode==13||evt.keyCode==0){
var _1a3=this.tbItem;
if(_1a3!=null){
if(!_1a3.isEnabled()){
return;
}
var menu=_1a3.getMenu();
if(menu!=null&&((this.id==("menu"+_1a3.getId()))||(_1a3.m_bHideDropDown&&this.id==_1a3.getId()))){
if(menu.isVisible()){
menu.remove();
}else{
if(typeof menu.setHTMLContainer!="undefined"){
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
}
menu.draw();
menu.show();
}
}else{
eval(this.tbItem.m_action);
}
if(_1a3.getParent()!=null&&typeof _1a3.getParent().onkeypress=="function"){
_1a3.getParent().onkeypress(evt);
}
_1a3.getObservers().notify(CToolbarButton_onkeypress);
}
return false;
}
evt.cancelBubble=true;
return true;
};
function CToolbarButton_getMenu(){
return this.m_menu;
};
function CToolbarButton_getMenuType(){
return "dropDown";
};
function CToolbarButton_setStyle(_1a5){
this.m_style=_1a5;
};
function CToolbarButton_getStyle(){
return this.m_style;
};
function CToolbarButton_getDropDownStyle(){
return this.m_dropDownStyle;
};
function CToolbarButton_setDropDownStyle(_1a6){
this.m_dropDownStyle=_1a6;
};
function CToolbarButton_isVisible(){
return this.m_bVisible;
};
function CToolbarButton_hide(){
this.m_bVisible=false;
};
function CToolbarButton_show(){
this.m_bVisible=true;
};
function CToolbarButton_enable(){
this.getStyle().setActiveState("normal");
this.getStyle().setActiveRolloverState("normal");
if(this.getIcon()){
this.getIcon().enable();
}
this.updateHTML();
};
function CToolbarButton_disable(){
this.getStyle().setActiveState("disabled");
this.getStyle().setActiveRolloverState("disabled");
if(this.getIcon()){
this.getIcon().disable();
}
this.updateHTML();
};
function CToolbarButton_isEnabled(){
if(this.getIcon()){
return this.getIcon().isEnabled();
}else{
return true;
}
};
function CToolbarButton_pressed(){
this.getStyle().setActiveState("depressed");
this.getStyle().setActiveRolloverState("depressed");
this.updateHTML();
};
function CToolbarButton_reset(){
this.getStyle().setActiveState("normal");
this.getStyle().setActiveRolloverState("normal");
this.updateHTML();
};
function CToolbarButton_updateHTML(){
if(typeof this.getStyle()=="object"){
if(typeof this.getParent().getHTMLContainer=="function"){
var _1a7=this.getParent().getHTMLContainer();
if(_1a7!=null){
var _1a8=_1a7.document?_1a7.document.getElementById(this.getId()):_1a7.ownerDocument.getElementById(this.getId());
if(_1a8!=null){
var _1a9=_1a8.getElementsByTagName("img");
if(typeof _1a9!="undefined"&&_1a9 instanceof Array&&_1a9.length>0){
if(this.getIcon()){
if(this.getIcon().isEnabled()){
_1a9[0].src=this.getIcon().getPath();
}else{
_1a9[0].src=this.getIcon().getDisabledImagePath();
}
}
if(this.getToolTip()){
_1a8.title=this.getToolTip();
_1a9[0].title=this.getToolTip();
}
}
var _1aa;
if(this.getStyle().getActiveState()!=this.getStyle().getDisabledState()){
_1a8.tabIndex=1;
if(this.getMenu()!=null&&!this.m_bHideDropDown){
_1a8.nextSibling.tabIndex=1;
_1a8.nextSibling.title=this.getToolTip();
_1aa=_1a8.nextSibling.getElementsByTagName("img");
if(_1aa!=null){
_1aa[0].title=this.getToolTip();
}
}
}else{
if(_1a8.tabIndex!="undefined"){
_1a8.removeAttribute("tabIndex");
if(this.getMenu()!=null){
_1a8.nextSibling.removeAttribute("tabIndex");
_1a8.nextSibling.title=this.getToolTip();
_1aa=_1a8.nextSibling.getElementsByTagName("img");
if(_1aa!=null){
_1aa[0].title=this.getToolTip();
}
}
}
}
_1a8.className=this.getStyle().getActiveState();
}
}
}
}
};
function CToolbarButton_getObservers(){
return this.m_observers;
};
function CToolbarButton_setFocus(){
if(this.m_menu!=null&&!this.m_bHideDropDown){
document.getElementById(this.m_id).nextSibling.focus();
}else{
document.getElementById(this.m_id).focus();
}
};
CToolbarButton.prototype.draw=CToolbarButton_draw;
CToolbarButton.prototype.attachEvents=CToolbarButton_attachEvents;
CToolbarButton.prototype.onblur=CToolbarButton_onmouseout;
CToolbarButton.prototype.onfocus=CToolbarButton_onmouseover;
CToolbarButton.prototype.onkeypress=CToolbarButton_onkeypress;
CToolbarButton.prototype.onmouseover=CToolbarButton_onmouseover;
CToolbarButton.prototype.onmouseout=CToolbarButton_onmouseout;
CToolbarButton.prototype.onclick=CToolbarButton_onclick;
CToolbarButton.prototype.setParent=CToolbarButton_setParent;
CToolbarButton.prototype.getParent=CToolbarButton_getParent;
CToolbarButton.prototype.getAction=CToolbarButton_getAction;
CToolbarButton.prototype.setAction=CToolbarButton_setAction;
CToolbarButton.prototype.getToolTip=CToolbarButton_getToolTip;
CToolbarButton.prototype.setToolTip=CToolbarButton_setToolTip;
CToolbarButton.prototype.getDropDownToolTip=CToolbarButton_getDropDownToolTip;
CToolbarButton.prototype.setDropDownToolTip=CToolbarButton_setDropDownToolTip;
CToolbarButton.prototype.getIcon=CToolbarButton_getIcon;
CToolbarButton.prototype.setIcon=CToolbarButton_setIcon;
CToolbarButton.prototype.getMenu=CToolbarButton_getMenu;
CToolbarButton.prototype.getMenuType=CToolbarButton_getMenuType;
CToolbarButton.prototype.getId=CToolbarButton_getId;
CToolbarButton.prototype.setStyle=CToolbarButton_setStyle;
CToolbarButton.prototype.getStyle=CToolbarButton_getStyle;
CToolbarButton.prototype.getDropDownStyle=CToolbarButton_getDropDownStyle;
CToolbarButton.prototype.setDropDownStyle=CToolbarButton_setDropDownStyle;
CToolbarButton.prototype.createDropDownMenu=CToolbarButton_createDropDownMenu;
CToolbarButton.prototype.addOwnerDrawControl=CToolbarButton_addOwnerDrawControl;
CToolbarButton.prototype.getObservers=CToolbarButton_getObservers;
CToolbarButton.prototype.update=new Function("return true");
CToolbarButton.prototype.isVisible=CToolbarButton_isVisible;
CToolbarButton.prototype.hide=CToolbarButton_hide;
CToolbarButton.prototype.show=CToolbarButton_show;
CToolbarButton.prototype.isEnabled=CToolbarButton_isEnabled;
CToolbarButton.prototype.enable=CToolbarButton_enable;
CToolbarButton.prototype.disable=CToolbarButton_disable;
CToolbarButton.prototype.pressed=CToolbarButton_pressed;
CToolbarButton.prototype.reset=CToolbarButton_reset;
CToolbarButton.prototype.setFocus=CToolbarButton_setFocus;
CToolbarButton.prototype.updateHTML=CToolbarButton_updateHTML;
var CMODAL_ID="CMODAL_FRAME";
var CMODAL_BLUR="CMODAL_BLUR";
var CMODAL_CONTENT_ID="CMODAL_CONTENT";
var CMODAL_HEADER="CMODAL_HEADER";
var CMODAL_BACKGROUND_LAYER_ID="CMODAL_BK";
var CMODAL_BACK_IFRAME_ID="CMODAL_BK_IFRAME";
var CMODAL_ZINDEX=111;
var CMODAL_dragEnabled=false;
var CMODAL_resizeDirection=null;
var CMODAL_startLeft=null;
var CMODAL_startTop=null;
var CMODAL_startWidth=null;
var CMODAL_startHeight=null;
var CMODAL_deltaX=null;
var CMODAL_deltaY=null;
function CModal(_1ab,_1ac,_1ad,t,l,h,w,_1b2,_1b3,_1b4,_1b5,_1b6){
this.m_hideButtonBar=false;
if(typeof _1b2!="undefined"){
this.m_hideButtonBar=_1b2;
}
this.m_hideHeader=false;
if(typeof _1b3!="undefined"){
this.m_hideHeader=_1b3;
}
this.m_title=_1ab;
this.m_sCloseToolTip=_1ac;
if(_1ad){
this.m_parent=_1ad;
}else{
this.m_parent=(document.body?document.body:document.documentElement);
}
var oBL=document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
if(oBL){
oBL.parentNode.removeChild(oBL);
}
if(typeof _1b6!="undefined"&&_1b6!=""){
this.m_webContentRoot=_1b6;
}else{
this.m_webContentRoot="..";
}
oBL=document.createElement("div");
oBL.id=CMODAL_BACKGROUND_LAYER_ID;
oBL.style.display="none";
oBL.style.position="absolute";
oBL.style.top="0px";
oBL.style.left="0px";
oBL.style.zIndex=(CMODAL_ZINDEX-2);
oBL.style.width="100%";
oBL.style.height="100%";
if(typeof _1b5!="undefined"&&_1b5){
oBL.style.backgroundColor="rgb(238, 238, 238)";
oBL.style.opacity="0.6";
oBL.style.filter="alpha(opacity:60)";
}
oBL.innerHTML="<table width=\"100%\" height=\"100%\" role=\"presentation\"><tr><td role=\"presentation\" onmousemove=\"CModalEvent_mousemoving(event)\" onmouseup=\"CModalEvent_disableDrag(event)\"></td></tr></table>";
this.m_parent.appendChild(oBL);
this.m_backLayer=oBL;
this.m_top=(t==null?0:t);
this.m_left=(l==null?0:l);
this.m_height=(h==null?0:h);
this.m_width=(w==null?0:w);
if(typeof _1b4!="undefined"&&_1b4==true){
this.m_height=CModal_dynamicHeight();
this.m_width=CModal_dynamicWidth();
}
if(window.attachEvent){
window.attachEvent("onresize",CModalEvent_onWindowResize);
window.attachEvent("onscroll",CModalEvent_onWindowResize);
}else{
window.addEventListener("resize",CModalEvent_onWindowResize,false);
window.addEventListener("scroll",CModalEvent_onWindowResize,false);
}
var f=document.getElementById(CMODAL_ID);
if(f){
f.parentNode.removeChild(f);
}
f=document.createElement("span");
f.id=CMODAL_ID;
f.CModal=this;
f.className="CModal_frame";
f.style.zIndex=CMODAL_ZINDEX;
f.style.border="#99aacc 1px solid";
var div=this.createHiddenDiv("CMODAL_TAB_LOOP_BEFORE",0);
div.onfocus=function(){
document.getElementById("CMODAL_AFTER_PLACEHOLDER").focus();
};
this.m_parent.appendChild(f);
div=this.createHiddenDiv("CMODAL_AFTER_PLACEHOLDER",-1);
div=this.createHiddenDiv("CMODAL_TAB_LOOP_AFTER",0);
div.onfocus=function(){
document.getElementById(CMODAL_CONTENT_ID).contentWindow.focus();
};
this.m_back_iframe=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(this.m_back_iframe){
this.m_back_iframe.parentNode.removeChild(this.m_back_iframe);
}
this.m_back_iframe=document.createElement("iframe");
this.m_back_iframe.id=CMODAL_BACK_IFRAME_ID;
this.m_back_iframe.frameBorder=0;
this.m_back_iframe.src=this.m_webContentRoot+"/common/blank.html";
this.m_back_iframe.style.position="absolute";
this.m_back_iframe.style.zIndex=CMODAL_ZINDEX-1;
this.m_back_iframe.onfocus=function(){
document.getElementById(CMODAL_BACKGROUND_LAYER_ID).focus();
};
this.m_back_iframe.tabIndex=1;
this.m_back_iframe.title="Empty frame";
this.m_back_iframe.role="presentation";
this.m_parent.appendChild(this.m_back_iframe);
f.innerHTML=this.renderDialogFrame();
this.m_frame=f;
};
function CModal_createHiddenDiv(_1ba,_1bb){
var div=document.getElementById(_1ba);
if(div){
div.parentNode.removeChild(div);
}
div=document.createElement("div");
div.id=_1ba;
div.tabIndex=_1bb;
div.style.position="absolute";
div.style.overflow="hidden";
div.style.width="0px";
div.style.height="0px";
this.m_parent.appendChild(div);
return div;
};
function CModal_hide(){
this.m_top=parseInt(this.m_frame.offsetTop,10);
this.m_left=parseInt(this.m_frame.offsetLeft,10);
this.m_height=parseInt(this.m_frame.offsetHeight,10);
this.m_width=parseInt(this.m_frame.offsetWidth,10);
this.m_backLayer.style.display="none";
this.m_frame.style.display="none";
if(this.m_back_iframe){
this.m_back_iframe.style.display="none";
}
};
function CModal_reCenter(){
this.m_left=(document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth-this.m_width)/2;
this.m_top=(document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight-this.m_height)/2;
};
function CModal_renderDialogFrame(){
var _1bd="summary=\"\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\"";
var out="<table role=\"presentation\" style=\"width:100%; height:99%; padding-top:2px;\" "+_1bd+" onmouseup=\"CModalEvent_disableDrag(event)\" onmousemove=\"CModalEvent_mousemoving(event)\">";
if(!this.m_hideHeader){
out+=""+"<tr>"+"<td role=\"presentation\" onmousedown=\"CModalEvent_enableDrag(event);\">"+"<table class=\"dialogHeader\" width=\"100%\" "+_1bd+">"+"<tr>"+"<td id=\""+CMODAL_HEADER+"\" valign=\"top\" class=\"dialogHeaderTitle\" width=\"100%\" nowrap=\"nowrap\">"+getConfigFrame().htmlencode(this.m_title)+"</td><td align=\"right\" valign=\"middle\">"+"<a onclick=\"hideCModal()\" style=\"cursor:pointer;\">"+"<img height=\"16\" width=\"16\" vspace=\"2\" border=\"0\" class=\"dialogClose\" onmouseover=\"this.className = 'dialogCloseOver'\" onmouseout=\"this.className = 'dialogClose'\" onmouseup=\"this.className = 'dialogClose'\" src=\""+p_sSkinFolder+"/portal/images/close.gif\" alt=\""+getConfigFrame().htmlencode(this.m_sCloseToolTip)+"\" title=\""+getConfigFrame().htmlencode(this.m_sCloseToolTip)+"\">"+"</a>"+"</td>"+"</tr>"+"</table>"+"</td>"+"</tr>";
}
out+="<tr><td role=\"presentation\" width=\"100%\" height=\"100%\" class=\"body_dialog_modal\" onmousemove=\"CModalEvent_mousemoving(event)\" onmouseup=\"CModalEvent_disableDrag(event)\">"+"<iframe title=\"modal dialog\" id=\""+CMODAL_CONTENT_ID+"\" name=\""+CMODAL_CONTENT_ID+"\" class=\"body_dialog_modal\" src=\""+this.m_webContentRoot+"/"+"qs"+"/blankNewWin.html\" style=\"padding:0px;margin:0px;width:100%;height:100%;\" frameborder=\"0\">no iframe support?</iframe>"+"</td></tr>";
if(!this.m_hideButtonBar){
out+="<tr><td>"+"<table "+_1bd+" class=\"dialogButtonBar\" style=\"padding:0px\">"+"<tr>"+"<td width=\"2\" valign=\"middle\"><img width=\"2\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"></td>"+"<td valign=\"middle\"><table border=\"0\" cellpadding=\"1\" cellspacing=\"0\" role=\"presentation\">"+"<tr>"+"<td><img height=\"1\" width=\"8\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"></td>"+"<td>"+CModal_renderButton(msgQS["OK"],"okCModal()")+"</td>"+"<td><img height=\"1\" width=\"8\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"></td>"+"<td>"+CModal_renderButton(msgQS["CANCEL"],"cancelCModal()")+"</td>"+"<td><img height=\"1\" width=\"8\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"></td>"+"</tr></table>"+"</td><td width=\"100%\">&nbsp;</td>"+"<td style=\"padding:3px;\" valign=\"bottom\" class=\"CModal_sideSE\" onmousedown=\"CModalEvent_enableResize(event)\">"+"<img role=\"presentation\" class=\"CModal_sideSE\" style=\"cursor:se-resize;\" alt=\"\" height=\"12\" width=\"12\" border=\"0\" src=\""+this.m_webContentRoot+"/common/images/dialog_resize.gif\" onmousedown=\"CModalEvent_enableResize(event);return false;\" onmouseup=\"CModalEvent_disableDrag(event);return false;\" onmousemove=\"CModalEvent_mousemoving(event);return false;\">"+"</td>"+"</tr></table></td></tr>";
}
out+="</table>";
return out;
};
function CModal_renderButton(_1bf,_1c0){
var out="<table cellpadding=\"0\" cellspacing=\"0\" style=\"padding: 2px 10px 3px;\" class=\"commandButton\" onmouseover=\"this.className='commandButtonOver'\""+" onmouseout=\"this.className = 'commandButton'\" onmousedown=\"this.className='commandButtonDown'\">"+"<tr>"+"<td style=\"cursor:pointer;\" valign=\"middle\" align=\"center\" nowrap id=\"btnAnchor\" onclick=\""+_1c0+"\">"+" <img height=\"1\" width=\"60\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"><br>"+_1bf+"</td></tr></table>";
return out;
};
function CModal_show(){
this.m_backLayer.style.display="";
this.reCenter();
var _1c2=CMenu_getScrollingPosition();
this.m_frame.style.top=(_1c2.y+this.m_top)+"px";
this.m_frame.style.left=(_1c2.x+this.m_left)+"px";
this.m_frame.style.height=this.m_height+"px";
this.m_frame.style.width=this.m_width+"px";
this.m_frame.style.display="inline";
this.m_frame.focus();
if(this.m_back_iframe){
this.m_back_iframe.style.top=this.m_frame.offsetTop+"px";
this.m_back_iframe.style.left=this.m_frame.offsetLeft+"px";
this.m_back_iframe.style.height=this.m_frame.offsetHeight+"px";
this.m_back_iframe.style.width=this.m_frame.offsetWidth+"px";
this.m_back_iframe.style.display="block";
}
};
CModal.prototype.hide=CModal_hide;
CModal.prototype.createHiddenDiv=CModal_createHiddenDiv;
CModal.prototype.reCenter=CModal_reCenter;
CModal.prototype.renderDialogFrame=CModal_renderDialogFrame;
CModal.prototype.show=CModal_show;
function hideCModal(){
var cdlg=document.getElementById(CMODAL_ID);
if(cdlg&&cdlg.CModal){
cdlg.CModal.hide();
}
};
function destroyCModal(){
var oBL=document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
if(oBL){
oBL.style.display="none";
}
var _1c5=document.getElementById(CMODAL_ID);
if(_1c5){
_1c5.style.display="none";
}
var _1c6=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(_1c6){
_1c6.style.display="none";
}
if(window.detachEvent){
window.detachEvent("onresize",CModalEvent_onWindowResize);
window.detachEvent("onscroll",CModalEvent_onWindowResize);
}else{
window.removeEventListener("resize",CModalEvent_onWindowResize,false);
window.removeEventListener("scroll",CModalEvent_onWindowResize,false);
}
};
function cancelCModal(){
var _1c7=document.getElementById(CMODAL_CONTENT_ID);
if(_1c7&&_1c7.contentWindow&&typeof _1c7.contentWindow.cancelDialog=="function"){
_1c7.contentWindow.cancelDialog();
}else{
hideCModal();
}
};
function okCModal(){
var _1c8=document.getElementById(CMODAL_CONTENT_ID);
if(_1c8&&_1c8.contentWindow&&typeof _1c8.contentWindow.execute=="function"){
_1c8.contentWindow.execute();
}else{
hideCModal();
}
};
function CModal_dynamicWidth(){
return (window.innerWidth!=null?window.innerWidth:document.documentElement&&document.documentElement.clientWidth?document.documentElement.clientWidth:document.body!=null?document.body.clientWidth:null)-150;
};
function CModal_dynamicHeight(){
return (window.innerHeight!=null?window.innerHeight:document.documentElement&&document.documentElement.clientHeight?document.documentElement.clientHeight:document.body!=null?document.body.clientHeight:null)-150;
};
function CModal_setModalHeight(_1c9){
var _1ca=_1c9.getAttribute("storedHeight");
if(_1c9.offsetHeight>document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight){
if(_1ca==null){
_1c9.setAttribute("storedHeight",_1c9.offsetHeight);
}
_1c9.style.height=document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight+"px";
}else{
if(_1ca!=null){
if(_1ca<document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight){
_1c9.style.height=_1ca+"px";
}else{
_1c9.style.height=document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight+"px";
}
}
}
};
function CModal_setModalWidth(_1cb){
var _1cc=_1cb.getAttribute("storedWidth");
if(_1cb.offsetWidth>document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth){
if(_1cc==null){
_1cb.setAttribute("storedWidth",_1cb.offsetWidth);
}
_1cb.style.width=document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth+"px";
}else{
if(_1cc!=null){
if(_1cc<document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth){
_1cb.removeAttribute("storedWidth");
_1cb.style.width=_1cc+"px";
}else{
_1cb.style.width=document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth+"px";
}
}
}
};
function CModalEvent_onWindowResize(e){
var _1ce=document.getElementById(CMODAL_ID);
var _1cf=document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
var _1d0=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(_1ce&&_1cf&&_1d0){
CModal_setModalWidth(_1ce);
CModal_setModalHeight(_1ce);
var _1d1=CMenu_getScrollingPosition();
var _1d2=(_1d1.y+((_1cf.clientHeight-_1ce.offsetHeight)/2));
var _1d3=(_1d1.x+((_1cf.clientWidth-_1ce.offsetWidth)/2));
_1ce.style.top=_1d2+"px";
_1ce.style.left=_1d3+"px";
_1d0.style.top=_1d2+"px";
_1d0.style.width=_1ce.style.width;
_1d0.style.height=_1ce.style.height;
_1d0.style.left=_1d3+"px";
}
};
function CModalEvent_mousemoving(e){
var oDlg=null;
var _1d6=null;
if(CMODAL_dragEnabled){
if(e==null&&(typeof event=="object")&&event.clientX!=null){
e=event;
}
oDlg=document.getElementById(CMODAL_ID);
if(CMODAL_startLeft==null){
CMODAL_startLeft=parseInt(oDlg.style.left,10)-e.clientX;
CMODAL_startTop=parseInt(oDlg.style.top,10)-e.clientY;
}
oDlg.style.left=CMODAL_startLeft+e.clientX;
oDlg.style.top=CMODAL_startTop+e.clientY;
_1d6=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(_1d6){
_1d6.style.left=oDlg.style.left;
_1d6.style.top=oDlg.style.top;
}
}
if(CMODAL_resizeDirection){
if(e==null&&(typeof event=="object")&&event.clientX!=null){
e=event;
}
oDlg=document.getElementById(CMODAL_ID);
if(CMODAL_startLeft==null){
CMODAL_startLeft=parseInt(oDlg.style.left,10);
CMODAL_startTop=parseInt(oDlg.style.top,10);
CMODAL_startHeight=parseInt(oDlg.style.height,10);
CMODAL_startWidth=parseInt(oDlg.style.width,10);
}
var h=0,w=0;
switch(CMODAL_resizeDirection){
case "NE":
case "E":
case "SE":
w=(e.clientX-CMODAL_startLeft+CMODAL_deltaX);
if(w<100){
w=100;
}
oDlg.style.width=w+"px";
}
switch(CMODAL_resizeDirection){
case "SW":
case "S":
case "SE":
h=(e.clientY-CMODAL_startTop+CMODAL_deltaY);
if(h<100){
h=100;
}
oDlg.style.height=h+"px";
}
switch(CMODAL_resizeDirection){
case "NW":
case "N":
case "NE":
oDlg.style.top=e.clientY;
h=(CMODAL_startHeight+(CMODAL_startTop-e.clientY)+CMODAL_deltaY);
if(h<100){
h=100;
}
oDlg.style.height=h+"px";
}
switch(CMODAL_resizeDirection){
case "NW":
case "W":
case "SW":
oDlg.style.left=e.clientX;
w=(CMODAL_startWidth+(CMODAL_startLeft-e.clientX)+CMODAL_deltaX);
if(w<100){
w=100;
}
oDlg.style.width=w+"px";
}
_1d6=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(_1d6){
_1d6.style.left=oDlg.offsetLeft;
_1d6.style.top=oDlg.offsetTop;
_1d6.style.height=oDlg.offsetHeight;
_1d6.style.width=oDlg.offsetWidth;
}
}
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
function CModalEvent_disableDrag(e){
CMODAL_dragEnabled=false;
CMODAL_resizeDirection=null;
CMODAL_startLeft=null;
CMODAL_startTop=null;
CMODAL_deltaX=0;
CMODAL_deltaY=0;
var cn=document.getElementById(CMODAL_ID).className;
var _1db=document.getElementById(CMODAL_HEADER);
if(_1db!=null){
_1db.style.cursor="default";
}
document.getElementById(CMODAL_ID).className=cn.replace(/\s*\bCModal_dragging\b/g,"");
document.getElementById(CMODAL_CONTENT_ID).style.visibility="visible";
if(typeof document.getElementById(CMODAL_CONTENT_ID).contentWindow.refreshContent=="function"){
document.getElementById(CMODAL_CONTENT_ID).contentWindow.refreshContent();
}
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
function CModalEvent_enableDrag(e){
CMODAL_dragEnabled=true;
CMODAL_startLeft=null;
CMODAL_startTop=null;
if(e==null&&(typeof event=="object")&&event.clientX!=null){
e=event;
}
document.getElementById(CMODAL_ID).className+=" CModal_dragging";
document.getElementById(CMODAL_HEADER).style.cursor="move";
document.getElementById(CMODAL_CONTENT_ID).style.visibility="hidden";
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
function CModalEvent_enableResize(e){
CMODAL_startLeft=null;
CMODAL_startTop=null;
CMODAL_startWidth=null;
CMODAL_startHeight=null;
CMODAL_deltaX=0;
CMODAL_deltaY=0;
if(e==null&&(typeof event=="object")&&event.clientX!=null){
e=event;
}
var oDlg=document.getElementById(CMODAL_ID);
CMODAL_startLeft=parseInt(oDlg.style.left,10);
CMODAL_startTop=parseInt(oDlg.style.top,10);
CMODAL_startHeight=parseInt(oDlg.style.height,10);
CMODAL_startWidth=parseInt(oDlg.style.width,10);
CMODAL_deltaX=(CMODAL_startLeft+CMODAL_startWidth-e.clientX);
CMODAL_deltaY=(CMODAL_startTop+CMODAL_startHeight-e.clientY);
var src=(e.srcElement?e.srcElement:e.target);
if((/\bCModal_side(\w+)\b/).test(src.className)){
CMODAL_resizeDirection=RegExp.$1;
document.getElementById(CMODAL_ID).className+=" CModal_dragging";
document.getElementById(CMODAL_CONTENT_ID).style.visibility="hidden";
}
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
function CMenuEntry(){
this.m_menu=null;
this.m_menuType="";
this.m_action=null;
this.m_bEnabled=true;
};
function CMenuEntry_setParent(_1e0){
this.m_parent=_1e0;
};
function CMenuEntry_getParent(){
return this.m_parent;
};
function CMenuEntry_setWebContentRoot(_1e1){
this.m_webContentRoot=_1e1;
};
function CMenuEntry_setId(id){
this.m_id=id;
};
function CMenuEntry_getId(){
return this.m_id;
};
function CMenuEntry_getObservers(){
return this.m_observers;
};
function CMenuEntry_onkeydown(evt){
evt=(evt)?evt:((event)?event:null);
if(typeof evt!="object"||evt==null){
return;
}
var i=0,ii,_1e6,_1e7,_1e8;
var _1e9=true;
var _1ea=evt.currentTarget||evt.srcElement;
if(evt.keyCode==9&&evt.shiftKey){
_1e8=this.getParent();
for(i=0;i<_1e8.getNumItems();i++){
if(_1e8.get(i)==this){
_1e8.hide();
this.getObservers().notify("CMenuItem_closeMenuTabEvent");
var _1eb=_1e8.getMenuType?_1e8.getMenuType():null;
if(_1eb!==cHorizonalBar&&_1eb!==cVerticalBar){
if(isIE()){
evt.preventDefault();
}else{
evt.returnValue=false;
}
}
break;
}else{
if(this.getParent().get(i).m_bEnabled==true){
break;
}
}
}
}else{
if(evt.keyCode==9){
if(this.isInMenu()){
for(i=(this.getParent().getNumItems()-1);i>=0;i++){
if(this.getParent().get(i)==this){
if(this.getMenu()){
this.getMenu().hide();
}
this.getParent().hide();
this.getObservers().notify("CMenuItem_closeMenuTabEvent");
if(isIE()){
evt.preventDefault();
}else{
evt.returnValue=false;
}
break;
}else{
if(this.getParent().get(i).m_bEnabled==true){
break;
}
}
}
}else{
if(typeof this.getParent().closeAllMenus=="function"){
this.getParent().closeAllMenus();
}else{
if(typeof this.getParent().closeMenus=="function"){
this.getParent().closeMenus();
}
}
}
}else{
if(evt.keyCode==40){
if(this.isInMenu()){
_1e6=this.getParent().getNumItems();
for(i=0;i<_1e6;i++){
if(this===this.getParent().get(i)){
var _1ec=0;
var _1ed=true;
if(i!=(_1e6-1)){
_1ec=i+1;
_1ed=false;
}
for(ii=_1ec;ii<_1e6;ii++){
_1e7=this.getParent().get(ii);
if(typeof _1e7.isVisible=="function"&&_1e7.isVisible()&&typeof _1e7.setFocus=="function"){
_1e7.setFocus();
break;
}
if(ii==(_1e6-1)&&!_1ed){
ii=0;
_1ed=true;
}
}
break;
}
}
}else{
if(this.isEnabled()){
_1e9=false;
var menu=this.getMenu();
if(this.getMenuType()=="dropDown"){
if(menu.isVisible()==false){
menu.setHTMLContainer(_1ea.document?_1ea.document.body:_1ea.ownerDocument.body);
menu.draw();
menu.show();
}else{
menu.remove();
}
}
}
}
}else{
if(evt.keyCode==38&&this.isInMenu()){
_1e6=this.getParent().getNumItems();
for(i=0;i<_1e6;i++){
if(this===this.getParent().get(i)){
var _1ec=i-1;
var _1ef=false;
if(i<=0){
_1ec=_1e6-1;
_1ef=true;
}
for(ii=_1ec;ii>=0;ii--){
_1e7=this.getParent().get(ii);
if(typeof _1e7.isVisible=="function"&&_1e7.isVisible()&&typeof _1e7.setFocus=="function"){
_1e7.setFocus();
break;
}
if(ii==0&&!_1ef){
_1ef=true;
ii=_1e6;
}
}
break;
}
}
}else{
if(evt.keyCode==37||evt.keyCode==39){
if(this.isEnabled()&&this.getMenu()!=null){
var menu=this.getMenu();
if(this.getMenuType()=="cascaded"){
_1e9=false;
if(menu.isVisible()==false){
menu.setHTMLContainer(_1ea.document?_1ea.document.body:_1ea.ownerDocument.body);
menu.draw();
menu.show();
}
}
}else{
_1e9=false;
_1e8=this.getParent();
if(_1e8&&_1e8.getParent()&&_1e8.getParent().getMenuType()=="cascaded"){
_1e8.hide();
}
}
}
}
}
}
}
if(_1e9&&this.getParent()!=null&&typeof this.getParent().onkeydown=="function"){
this.getParent().onkeydown(evt);
}
this.getObservers().notify(CMenuItem_onkeydown);
};
function CMenuEntry_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
var _1f1=evt.keyCode;
if(_1f1==0&&typeof evt.charCode!="undefined"){
_1f1=evt.charCode;
}
if(typeof evt=="object"&&evt!=null){
var _1f2=evt.currentTarget||evt.srcElement;
var _1f3=true;
if(_1f1==9||_1f1==37||_1f1==38||_1f1==39||_1f1==40){
_1f3=false;
}else{
if(_1f1==13||_1f1==32){
if(!this.isEnabled()){
return;
}
if(this.getMenu()!=null){
var menu=this.getMenu();
if(this.getMenuType()=="cascaded"){
_1f3=false;
if(menu.isVisible()==false){
menu.setHTMLContainer(_1f2.document?_1f2.document.body:_1f2.ownerDocument.body);
menu.draw();
menu.show();
}else{
menu.remove();
}
}else{
if(this.getMenuType()=="dropDown"){
if(menu.isVisible()==false){
menu.setHTMLContainer(_1f2.document?_1f2.document.body:_1f2.ownerDocument.body);
menu.draw();
menu.show();
}else{
menu.remove();
}
}
}
}else{
eval(this.getAction());
}
}else{
if(_1f1==27){
this.getParent().hide();
return;
}
}
}
if(_1f3){
if(this.getParent()!=null&&typeof this.getParent().onkeypress=="function"){
this.getParent().onkeypress(evt);
}
this.getObservers().notify(CMenuItem_onkeypress);
}
}
if(_1f1==13||_1f1==0||_1f1==40||_1f1==38){
if(evt!=null){
evt.cancelBubble=true;
}
return false;
}
return true;
};
function CMenuEntry_getMenu(){
return this.m_menu;
};
function CMenuEntry_getMenuType(){
return this.m_menuType;
};
function CMenuEntry_isEnabled(){
return this.m_bEnabled;
};
function CMenuEntry_isInMenu(){
return this.getParent() instanceof CMenu;
};
function CMenuEntry_getAction(){
return this.m_action;
};
function CMenuEntry_setAction(_1f5){
this.m_action=_1f5;
};
CMenuEntry.prototype.getObservers=CMenuEntry_getObservers;
CMenuEntry.prototype.setId=CMenuEntry_setId;
CMenuEntry.prototype.getId=CMenuEntry_getId;
CMenuEntry.prototype.onkeypress=CMenuEntry_onkeypress;
CMenuEntry.prototype.onkeydown=CMenuEntry_onkeydown;
CMenuEntry.prototype.getMenu=CMenuEntry_getMenu;
CMenuEntry.prototype.getMenuType=CMenuEntry_getMenuType;
CMenuEntry.prototype.setParent=CMenuEntry_setParent;
CMenuEntry.prototype.getParent=CMenuEntry_getParent;
CMenuEntry.prototype.setWebContentRoot=CMenuEntry_setWebContentRoot;
CMenuEntry.prototype.isEnabled=CMenuEntry_isEnabled;
CMenuEntry.prototype.isInMenu=CMenuEntry_isInMenu;
CMenuEntry.prototype.getAction=CMenuEntry_getAction;
CMenuEntry.prototype.setAction=CMenuEntry_setAction;
var theMenuCnt=1;
function CMenuItem(_1f6,_1f7,_1f8,_1f9,_1fa,_1fb,skin){
this.m_label=_1f7;
if(this.m_label){
this.m_label=this.m_label.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
this.setId(escape(_1f7)+theMenuCnt++);
this.m_bVisible=true;
this.setAction(_1f8);
this.setWebContentRoot(_1fb);
var _1fd=_1f9;
if((typeof gCognosViewer!="undefined")&&(gCognosViewer.envParams["isTitan"])&&(gCognosViewer.envParams["isTitan"]==true)){
_1fd="blankIcon";
}
this.m_icon=new CIcon(_1fd,"",this.m_webContentRoot);
this.setParent(_1f6);
this.m_style=_1fa;
this.m_observers=new CObserver(this);
if(typeof skin!="undefined"&&skin!=""){
this.m_sSkin=skin;
}else{
this.m_sSkin=(typeof getPromptSkin!="undefined"?getPromptSkin():this.m_webContentRoot+"/skins/corporate");
}
if(typeof this.m_parent=="object"&&typeof this.m_parent.add=="function"){
this.m_parent.add(this);
}
this.m_sDropDownArrow="dropdown_arrow_banner.gif";
};
CMenuItem.prototype=new CMenuEntry();
CMenuItem.prototype.setDropDownArrow=function(_1fe){
this.m_sDropDownArrow=_1fe;
};
CMenuItem.prototype.getDropDownArrow=function(){
return this.m_sDropDownArrow;
};
function CMenuItem_setId(id){
this.m_id=id;
};
function CMenuItem_setIcon(_200){
this.m_icon.setPath(_200);
};
function CMenuItem_setToolTip(_201){
this.m_icon.m_toolTip=_201;
};
function CMenuItem_getToolTip(){
return this.m_icon.m_toolTip;
};
function CMenuItem_setAltText(_202){
this.m_sAltText=_202;
};
function CMenuItem_getAltText(){
if(this.m_sAltText){
return this.m_sAltText;
}else{
return "";
}
};
function CMenuItem_genARIATags(){
var html="";
if(this.isInMenu()){
html+=" role=\"menuitem\" ";
}else{
html+=" role=\"button\" ";
}
if(this.m_menuType=="dropDown"||this.m_menuType=="cascaded"){
html+=" aria-haspopup=\"true\" ";
}
if(this.getAltText().length==0){
this.setAltText(this.m_label);
}
if((this.getAltText()&&this.getAltText().length>0)||(this.m_icon&&this.m_icon.getToolTip())){
html+=" aria-labelledby=\""+this.m_id+"label\" ";
}
if(!this.isEnabled()){
html+=" aria-disabled=\"true\" ";
}
return html;
};
function CMenuItem_genMenuItemAltText(){
var html="";
if((this.getAltText()&&this.getAltText().length>0)||(this.m_icon&&this.m_icon.getToolTip())){
html+="<div style=\"position: absolute; overflow: hidden; width: 0; height: 0;\" id=\""+this.m_id+"label\">";
if(this.getAltText()&&this.getAltText().length>0){
html+=this.getAltText();
}else{
html+=this.m_icon.getToolTip();
}
html+="</div>";
}
return html;
};
function CMenuItem_draw(){
var html="<div>";
var _206=false,_207=null,_208=null,_209=0;
if(this.m_menu==null||this.m_menuType=="dropDown"){
html+="<table ";
html+=this.genARIATags();
if(this.isInMenu()){
if(this.isEnabled()){
html+=" hideFocus=\"true\" ";
}
html+=" tabIndex=\"0\" ";
}else{
if(this.isEnabled()){
html+=" tabIndex=\"0\"";
}
}
html+=" width=\"100%\" ";
html+="class=\"";
if(typeof this.getStyle()=="object"){
if(this.isEnabled()){
html+=this.getStyle().getNormalState();
}else{
html+=this.getStyle().getDisabledState();
}
}
html+="\" id=\"";
html+=this.getId();
html+="\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:1px;\"><tr>";
_206=false;
if(this.m_icon.getPath()==""&&this.m_parent instanceof CMenu){
_207=this.m_parent.getNumItems();
for(_209=0;_209<_207;++_209){
_208=this.m_parent.get(_209);
if(typeof _208.getIcon=="function"&&_208.getIcon().getPath()){
_206=true;
break;
}
}
}
if(_206||this.m_icon.getPath()!=""){
var f="";
if(getViewerDirection()=="rtl"){
f=" float: right;";
}
html+="<td width=\"16\" style=\"padding-right: 2px; padding-left: 2px;"+f+"\">";
if(this.m_icon.getPath()!=""){
html+=this.m_icon.draw();
}else{
html+="<img alt=\"\" src=\""+this.m_webContentRoot+"/common/images/spacer.gif\" width=\"16\"/>";
}
html+="</td>";
}
if(getViewerDirection()=="rtl"){
html+="<td nowrap=\"nowrap\" align=\"right\">";
}else{
html+="<td nowrap=\"nowrap\" align=\"left\">";
}
html+=this.m_label;
html+=this.genMenuItemAltText();
html+="</td>";
if(this.m_menuType=="dropDown"){
html+="<td width=\"10%\" align=\"right\" style=\"padding-right: 3px;padding-left: 3px\">";
html+="<img alt=\"\" src=\""+this.m_sSkin;
if(this.getDropDownArrow()=="dropdown_arrow_banner.gif"){
html+="/shared/images/";
}else{
html+="/portal/images/";
}
html+=this.getDropDownArrow()+"\" WIDTH=\"7\" HEIGHT=\"16\" style=\"vertical-align:middle;\"/>";
html+="</td>";
}
html+="</tr></table></div>";
}else{
html+="<table";
html+=this.genARIATags();
if(this.isEnabled()||this.isInMenu()){
html+=" tabIndex=\"0\" hideFocus=\"true\"";
}
html+=" width=\"100%\" class=\"";
if(typeof this.getStyle()=="object"){
if(this.isEnabled()){
html+=this.getStyle().getNormalState();
}else{
html+=this.getStyle().getDisabledState();
}
}
html+="\" id=\"";
html+=this.getId();
html+="\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:1px;\"><tr>";
html+="<td";
_206=false;
if(this.m_icon.getPath()==""){
_207=this.m_parent.getNumItems();
for(_209=0;_209<_207;++_209){
_208=this.m_parent.get(_209);
if(typeof _208.getIcon=="function"&&_208.getIcon().getPath()){
_206=true;
break;
}
}
}
if(_206||this.m_icon.getPath()!=""){
html+=" width=\"16\" style=\"padding-right: 2px; padding-left: 2px;\">";
}else{
html+=" width=\"1\">";
}
html+=this.m_icon.draw();
html+="</td>";
if(getViewerDirection()=="rtl"){
html+="<td nowrap=\"nowrap\" align=\"right\">";
}else{
html+="<td nowrap=\"nowrap\" align=\"left\">";
}
html+=this.m_label;
html+=this.genMenuItemAltText();
html+="</td>";
if(getViewerDirection()=="rtl"){
html+="<td width=\"10%\" align=\"left\">";
html+="<img style=\"vertical-align:middle;\" alt=\"\" src=\""+this.m_sSkin+"/viewer/images/menu_expand_rtl.gif\" WIDTH=\"13\" HEIGHT=\"13\"/>";
}else{
html+="<td width=\"10%\" align=\"right\">";
html+="<img style=\"vertical-align:middle;\" alt=\"\" src=\""+this.m_sSkin+"/viewer/images/menu_expand.gif\" WIDTH=\"13\" HEIGHT=\"13\"/>";
}
html+="</td>";
html+="</tr></table>";
html+="</div>";
}
return html;
};
function CMenuItem_onmouseover(evt){
evt=(evt)?evt:((event)?event:null);
var _20c=null;
if(typeof this.menuItem!="undefined"){
_20c=this.menuItem;
}else{
if(this instanceof CMenuItem){
_20c=this;
}
}
if(_20c==null||!(_20c instanceof CMenuItem)||!_20c.isEnabled()){
return;
}
var menu=_20c.getMenu();
if(typeof _20c.getStyle()=="object"&&(menu!=null||typeof _20c.getIcon().getPath()!="undefined")){
this.className=_20c.getStyle().getRolloverState();
}
if(menu!=null){
var _20e=0;
var _20f=0;
if(typeof window.innerWidth!="undefined"){
_20e=window.innerWidth;
}else{
_20e=document.body.clientWidth;
}
if(typeof window.innerHeight!="undefined"){
_20f=window.innerHeight;
}else{
_20f=document.body.clientHeight;
}
if(_20c.getMenuType()=="cascaded"){
if(menu.isVisible()==false){
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
menu.draw();
menu.show();
}
}else{
if(_20c.getMenuType()=="dropDown"){
var _210=_20c.getParent();
var _211=_210.getNumItems();
for(var i=0;i<_211;++i){
var _213=_210.get(i);
if(_213!=_20c&&typeof _213.getMenu=="function"&&_213.getMenu()&&_213.getMenu().isVisible()){
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
menu.draw();
menu.show();
break;
}
}
}
}
}
if(_20c.getParent()!=null&&typeof _20c.getParent().onmouseover=="function"){
_20c.getParent().onmouseover(evt);
}
_20c.getObservers().notify(CMenuItem_onmouseover);
};
function CMenuItem_onfocus(evt){
evt=(evt)?evt:((event)?event:null);
var _215=null;
if(typeof this.menuItem!="undefined"){
_215=this.menuItem;
}else{
if(this instanceof CMenuItem){
_215=this;
}
}
if(_215==null||!(_215 instanceof CMenuItem)||!_215.isEnabled()){
return;
}
if(typeof _215.getStyle()=="object"){
this.className=_215.getStyle().getRolloverState();
}
if(_215.getParent()!=null&&typeof _215.getParent().onmouseover=="function"){
_215.getParent().onmouseover(evt);
}
_215.getObservers().notify(CMenuItem_onfocus);
};
function CMenuItem_onmouseout(evt){
evt=(evt)?evt:((event)?event:null);
var _217=null;
if(typeof this.menuItem!="undefined"){
_217=this.menuItem;
}else{
if(this instanceof CMenuItem){
_217=this;
}
}
if(_217==null||!(_217 instanceof CMenuItem)||!_217.isEnabled()){
return;
}
if(typeof _217.getStyle()=="object"){
this.className=_217.getStyle().getNormalState();
}
if(_217.getParent()!=null&&typeof _217.getParent().onmouseout=="function"){
_217.getParent().onmouseout(evt);
}
_217.getObservers().notify(CMenuItem_onmouseout);
};
function CMenuItem_onclick(evt){
evt=(evt)?evt:((event)?event:null);
if(evt!=null){
evt.cancelBubble=true;
}
return false;
};
function CMenuItem_onmouseup(evt){
evt=(evt)?evt:((event)?event:null);
var _21a=null;
if(typeof this.menuItem!="undefined"){
_21a=this.menuItem;
}else{
if(this instanceof CMenuItem){
_21a=this;
}
}
if(_21a!=null&&_21a instanceof CMenuItem){
if(!_21a.isEnabled()){
return;
}
if(_21a.getMenu()!=null){
if(_21a.getMenuType()=="cascaded"){
}else{
if(_21a.getMenuType()=="dropDown"){
var menu=_21a.getMenu();
if(menu.isVisible()==false){
if(!this.document&&!this.ownerDocument){
return;
}
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
menu.draw();
menu.show();
}else{
menu.remove();
}
}
}
}else{
eval(_21a.getAction());
}
if(typeof getReportFrame!="undefined"&&typeof getReportFrame().clearTextSelection!="undefined"){
getReportFrame().clearTextSelection();
}else{
if(typeof clearTextSelection!="undefined"){
clearTextSelection();
}
}
if(_21a.getMenuType()!="cascaded"){
if(_21a.getParent()!=null&&typeof _21a.getParent().onmouseup=="function"){
_21a.getParent().onmouseup(evt);
}
_21a.getObservers().notify(CMenuItem_onmouseup);
}
if(typeof this.menuItem!="undefined"&&_21a.getMenu()!=null&&_21a.getMenuType()=="cascaded"&&_21a.getAction()!=""){
eval(_21a.getAction());
}
}
if(evt!=null){
evt.cancelBubble=true;
}
return false;
};
function CMenuItem_onkeydown(evt){
var _21d=null;
if(typeof this.menuItem!="undefined"){
_21d=this.menuItem;
}else{
if(this instanceof CMenuItem){
_21d=this;
}
}
if(_21d==null||!(_21d instanceof CMenuItem)){
return;
}
return CMenuEntry_onkeydown.call(_21d,evt);
};
function CMenuItem_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
var _21f=null;
if(typeof this.menuItem!="undefined"){
_21f=this.menuItem;
}else{
if(this instanceof CMenuItem){
_21f=this;
}
}
if(_21f!=null&&_21f instanceof CMenuItem){
return CMenuEntry_onkeypress.call(_21f,evt);
}
};
function CMenuItem_createDropDownMenu(_220){
this.m_menu=new CMenu("dropDownMenu_"+this.getId(),_220,this.m_webContentRoot);
this.m_menu.setParent(this);
this.m_menuType="dropDown";
return this.m_menu;
};
function CMenuItem_createCascadedMenu(_221){
this.m_menu=new CMenu("cascadedMenu_"+this.getId(),_221,this.m_webContentRoot);
this.m_menu.setParent(this);
this.m_originalMenuType=this.m_menuType;
this.m_menuType="cascaded";
return this.m_menu;
};
function CMenuItem_clearCascadedMenu(){
if(this.m_menu){
this.m_menu.remove();
this.m_menu=null;
}
if(this.m_originalMenuType){
this.m_menuType=this.m_originalMenuType;
}
};
function CMenuItem_addOwnerDrawControl(_222,type){
this.m_menu=_222;
this.m_menuType=type;
if(typeof _222.setParent!="undefined"){
this.m_menu.setParent(this);
}
};
function CMenuItem_attachEvents(){
if(typeof this.getParent().getHTMLContainer!="function"){
return;
}
var _224=this.getParent().getHTMLContainer();
if(_224==null){
return;
}
var _225=eval(_224.document?_224.document.getElementById(this.getId()):_224.ownerDocument.getElementById(this.getId()));
if(_225==null){
return;
}
_225.onmouseover=this.onmouseover;
_225.onmouseout=this.onmouseout;
_225.onmouseup=this.onmouseup;
_225.onkeypress=this.onkeypress;
_225.onfocus=this.onfocus;
_225.onblur=this.onblur;
_225.onkeydown=this.onkeydown;
_225.onclick=this.onclick;
_225.menuItem=eval(this);
};
function CMenuItem_remove(){
};
function CMenuItem_getStyle(){
return this.m_style;
};
function CMenuItem_setStyle(_226){
this.m_style=_226;
};
function CMenuItem_hide(){
this.m_bVisible=false;
};
function CMenuItem_show(){
this.m_bVisible=true;
};
function CMenuItem_enable(){
if(typeof this.getStyle()=="object"){
if(typeof this.getParent().getHTMLContainer=="function"){
var _227=this.getParent().getHTMLContainer();
if(_227!=null){
var _228=_227.document?_227.document.getElementById(this.getId()):_227.ownerDocument.getElementById(this.getId());
if(_228!=null){
_228.className=this.getStyle().getNormalState();
}
}
}
this.m_bEnabled=true;
this.getIcon().enable();
this.updateHTML();
}
};
function CMenuItem_updateHTML(){
if(typeof this.getStyle()=="object"){
if(typeof this.getParent().getHTMLContainer=="function"){
var _229=this.getParent().getHTMLContainer();
if(_229!=null){
var _22a=_229.document?_229.document.getElementById(this.getId()):_229.ownerDocument.getElementById(this.getId());
if(_22a!=null){
var _22b=_22a.getElementsByTagName("img");
if(typeof _22b!="undefined"){
if(this.getIcon()){
if(this.getIcon().isEnabled()){
_22b[0].src=this.getIcon().getPath();
}else{
_22b[0].src=this.getIcon().getDisabledImagePath();
}
}
if(this.getToolTip()){
_22a.title=this.getToolTip();
_22b[0].title=this.getToolTip();
}
}
if(this.isEnabled()){
if(_22a.getAttribute("aria-disabled")){
_22a.removeAttribute("aria-disabled");
}
}else{
_22a.setAttribute("aria-disabled","true");
}
var _22c;
if(this.getStyle().getActiveState()!=this.getStyle().getDisabledState()){
_22a.tabIndex=0;
if(this.getMenu()!=null&&!this.m_bHideDropDown&&_22a.nextSibling){
_22a.nextSibling.tabIndex=0;
_22a.nextSibling.title=this.getToolTip();
_22c=_22a.nextSibling.getElementsByTagName("img");
if(_22c!=null){
_22c[0].title=this.getToolTip();
}
}
}else{
if(_22a.tabIndex!="undefined"){
_22a.removeAttribute("tabIndex");
if(this.getMenu()!=null){
_22a.nextSibling.removeAttribute("tabIndex");
_22a.nextSibling.title=this.getToolTip();
_22c=_22a.nextSibling.getElementsByTagName("img");
if(_22c!=null){
_22c[0].title=this.getToolTip();
}
}
}
}
_22a.className=this.getStyle().getActiveState();
}
}
}
}
};
function CMenuItem_disable(){
if(typeof this.getStyle()=="object"){
if(typeof this.getParent().getHTMLContainer=="function"){
var _22d=this.getParent().getHTMLContainer();
if(_22d!=null){
var _22e=_22d.document?_22d.document.getElementById(this.getId()):_22d.ownerDocument.getElementById(this.getId());
if(_22e!=null){
_22e.className=this.getStyle().getDisabledState();
}
}
}
this.m_bEnabled=false;
this.getIcon().disable();
this.updateHTML();
}
};
function CMenuItem_isVisible(){
return this.m_bVisible;
};
function CMenuItem_getIcon(){
return this.m_icon;
};
function CMenuItem_getLabel(){
return this.m_label;
};
function CMenuItem_setFocus(){
var e=document.getElementById(this.m_id);
if(e){
e.focus();
return true;
}
return false;
};
CMenuItem.prototype.draw=CMenuItem_draw;
CMenuItem.prototype.onmouseover=CMenuItem_onmouseover;
CMenuItem.prototype.onmouseout=CMenuItem_onmouseout;
CMenuItem.prototype.onmouseup=CMenuItem_onmouseup;
CMenuItem.prototype.onkeypress=CMenuItem_onkeypress;
CMenuItem.prototype.onkeydown=CMenuItem_onkeydown;
CMenuItem.prototype.onfocus=CMenuItem_onfocus;
CMenuItem.prototype.onblur=CMenuItem_onmouseout;
CMenuItem.prototype.onclick=CMenuItem_onclick;
CMenuItem.prototype.attachEvents=CMenuItem_attachEvents;
CMenuItem.prototype.remove=CMenuItem_remove;
CMenuItem.prototype.setStyle=CMenuItem_setStyle;
CMenuItem.prototype.getStyle=CMenuItem_getStyle;
CMenuItem.prototype.createDropDownMenu=CMenuItem_createDropDownMenu;
CMenuItem.prototype.createCascadedMenu=CMenuItem_createCascadedMenu;
CMenuItem.prototype.clearCascadedMenu=CMenuItem_clearCascadedMenu;
CMenuItem.prototype.addOwnerDrawControl=CMenuItem_addOwnerDrawControl;
CMenuItem.prototype.isVisible=CMenuItem_isVisible;
CMenuItem.prototype.hide=CMenuItem_hide;
CMenuItem.prototype.show=CMenuItem_show;
CMenuItem.prototype.enable=CMenuItem_enable;
CMenuItem.prototype.disable=CMenuItem_disable;
CMenuItem.prototype.getIcon=CMenuItem_getIcon;
CMenuItem.prototype.setIcon=CMenuItem_setIcon;
CMenuItem.prototype.getLabel=CMenuItem_getLabel;
CMenuItem.prototype.setFocus=CMenuItem_setFocus;
CMenuItem.prototype.setToolTip=CMenuItem_setToolTip;
CMenuItem.prototype.getToolTip=CMenuItem_getToolTip;
CMenuItem.prototype.updateHTML=CMenuItem_updateHTML;
CMenuItem.prototype.update=new Function("return true");
CMenuItem.prototype.genARIATags=CMenuItem_genARIATags;
CMenuItem.prototype.setAltText=CMenuItem_setAltText;
CMenuItem.prototype.getAltText=CMenuItem_getAltText;
CMenuItem.prototype.genMenuItemAltText=CMenuItem_genMenuItemAltText;
function CSeperator(type,size,_232,_233){
this.m_type=type;
this.m_size=size;
this.m_bVisible=true;
if(_232!==null&&typeof _232=="object"){
this.m_style=new CUIStyle(_232.getNormalState(),_232.getRolloverState(),_232.getDepressedState(),_232.getDepressedRolloverState(),_232.getDisabledState());
}else{
this.m_style=new CUIStyle("","","","","");
}
if(typeof _233!="undefined"&&_233!=""){
this.m_webContentRoot=_233;
}else{
this.m_webContentRoot="..";
}
this.m_toolbarSeperatorClass="bannerDivider";
};
CSeperator.prototype.setToolbarSeperatorClass=function(_234){
this.m_toolbarSeperatorClass=_234;
};
CSeperator.prototype.getToolbarSeperatorClass=function(){
return this.m_toolbarSeperatorClass;
};
CSeperator.prototype.setWebContentRoot=function(_235){
this.m_webContentRoot=_235;
};
function CSeperator_draw(){
if(this.m_style==""){
return;
}
var html="";
switch(this.m_type){
case "horizonal_blank":
html+="<td style=\"padding:0px;\"><img border=\"0\" alt=\"\" src=\""+this.m_webContentRoot+"/common/images/spacer.gif\" height=\"1\" width=\"";
html+=this.m_size;
html+="\"/></td>";
break;
case "horizontal_line":
html+="<div class=\""+this.getStyle().getActiveState()+"\"></div>";
break;
case "vertical_blank":
html+="<tr>";
html+="<td style=\"padding:0px;\"><img border=\"0\" alt=\"\" src=\""+this.m_webContentRoot+"/common/images/spacer.gif\" width=\"1\" height=\"";
html+=this.m_size;
html+="\"/></td></tr>";
break;
case "vertical_line":
html+="<td class=\"toolbarVerticalSeperator\"><div class=\""+this.getToolbarSeperatorClass()+"\"/></td>";
break;
}
return html;
};
function CSeperator_getSize(){
return this.m_size;
};
function CSeperator_setSize(size){
this.m_size=size;
};
function CSeperator_setStyle(_238){
this.m_style=_238;
};
function CSeperator_getStyle(){
return this.m_style;
};
function CSeperator_setType(type){
this.m_type=type;
};
function CSeperator_getType(){
return this.m_type;
};
function CSeperator_hide(){
this.m_bVisible=false;
};
function CSeperator_show(){
this.m_bVisible=true;
};
function CSeperator_isVisible(){
return this.m_bVisible;
};
CSeperator.prototype.draw=CSeperator_draw;
CSeperator.prototype.setSize=CSeperator_setSize;
CSeperator.prototype.getSize=CSeperator_getSize;
CSeperator.prototype.setStyle=CSeperator_setStyle;
CSeperator.prototype.getStyle=CSeperator_getStyle;
CSeperator.prototype.getType=CSeperator_getType;
CSeperator.prototype.setType=CSeperator_setType;
CSeperator.prototype.isVisible=CSeperator_isVisible;
CSeperator.prototype.show=CSeperator_show;
CSeperator.prototype.hide=CSeperator_hide;
function CInfoPanel(size,_23b,id){
this.m_size=size;
this.m_bVisible=true;
this.m_properties=[];
this.setId(id);
this.m_observers=new CObserver(this);
this.setWebContentRoot(_23b);
};
CInfoPanel.prototype=new CMenuEntry();
CInfoPanel.prototype.setWebContentRoot=function(_23d){
this.m_webContentRoot=_23d;
};
function CInfoPanel_addCheckedProperty(name,_23f){
var o={"name":name,"value":_23f,"type":"checkBox","spacer":false};
this.m_properties[this.m_properties.length]=o;
};
function CInfoPanel_addProperty(name,_242){
var o={"name":name,"value":_242,"spacer":false};
this.m_properties[this.m_properties.length]=o;
};
function CInfoPanel_addSpacer(_244){
var o={"spacer":true,"height":_244};
this.m_properties[this.m_properties.length]=o;
};
function CInfoPanel_draw(){
var i=0;
var html="<table CELLPADDING=\"0\" CELLSPACING=\"0\" role=\"presentation\">";
if(this.m_properties.length>0){
var _248="<tr><td>";
var _249="";
for(i=0;i<this.m_properties.length;i++){
if(this.m_properties[i].spacer){
}else{
if(this.m_properties[i].type!=null&&this.m_properties[i].type=="checkBox"){
_248+="<tr><td><span><span class=\"formText\">";
if(this.m_properties[i].value=="true"){
_248+="<input type=\"checkbox\" disabled=\"true\" checked>";
}else{
_248+="<input type=\"checkbox\" disabled=\"true\">";
}
_248+=this.m_properties[i].name;
_248+="</span>&nbsp;</input>";
_248+="<span></td></tr>";
}else{
_248+="<tr><td><span><span class=\"menuItem_normal\" style=\"font-weight:bold\">";
_248+=this.m_properties[i].name;
_248+="</span>&nbsp;<span class=\"menuItem_normal\">";
_248+=this.m_properties[i].value;
_248+="</span></span></td></tr>";
}
_249+=this.m_properties[i].name+" "+this.m_properties[i].value+", ";
}
}
var id=this.getId()?"id=\""+this.getId()+"\" ":"";
var _24b="<table summary=\""+_249+"\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" "+id+" tabindex=\"0\" style=\"margin-bottom:1px;";
if(typeof this.m_size!="undefined"&&this.m_size!=""){
_24b+="width:"+this.m_size;
}
_24b+="\"\t>";
html+=_24b+_248+"</table></td></tr>";
}
html+="</table>";
return html;
};
function CInfoPanel_getSize(){
return this.m_size;
};
function CInfoPanel_setSize(size){
this.m_size=size;
};
function CInfoPanel_hide(){
this.m_bVisible=false;
};
function CInfoPanel_show(){
this.m_bVisible=true;
};
function CInfoPanel_isVisible(){
return this.m_bVisible;
};
function CInfoPanel_isEnabled(){
return true;
};
function CInfoPanel_onkeydown(evt){
var _24e=null;
if(typeof this.infoPanel!="undefined"){
_24e=this.infoPanel;
}else{
if(this instanceof CInfoPanel){
_24e=this;
}
}
if(_24e==null||!(_24e instanceof CInfoPanel)){
return;
}
return CMenuEntry_onkeydown.call(_24e,evt);
};
function CInfoPanel_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
var _250=null;
if(typeof this.infoPanel!="undefined"){
_250=this.infoPanel;
}else{
if(this instanceof CInfoPanel){
_250=this;
}
}
if(_250!=null&&_250 instanceof CInfoPanel){
return CMenuEntry_onkeypress.call(_250,evt);
}
};
function CInfoPanel_setFocus(){
if(this.getId()){
document.getElementById(this.getId()).focus();
}
};
function CInfoPanel_attachEvents(){
if(typeof this.getParent().getHTMLContainer!="function"){
return;
}
var _251=this.getParent().getHTMLContainer();
if(_251==null){
return;
}
var _252=eval(_251.document?_251.document.getElementById(this.getId()):_251.ownerDocument.getElementById(this.getId()));
if(_252==null){
return;
}
_252.onkeypress=this.onkeypress;
_252.onkeydown=this.onkeydown;
_252.infoPanel=eval(this);
};
CInfoPanel.prototype.draw=CInfoPanel_draw;
CInfoPanel.prototype.onkeypress=CInfoPanel_onkeypress;
CInfoPanel.prototype.onkeydown=CInfoPanel_onkeydown;
CInfoPanel.prototype.addProperty=CInfoPanel_addProperty;
CInfoPanel.prototype.addCheckedProperty=CInfoPanel_addCheckedProperty;
CInfoPanel.prototype.addSpacer=CInfoPanel_addSpacer;
CInfoPanel.prototype.setSize=CInfoPanel_setSize;
CInfoPanel.prototype.getSize=CInfoPanel_getSize;
CInfoPanel.prototype.isVisible=CInfoPanel_isVisible;
CInfoPanel.prototype.show=CInfoPanel_show;
CInfoPanel.prototype.hide=CInfoPanel_hide;
CInfoPanel.prototype.isEnabled=CInfoPanel_isEnabled;
CInfoPanel.prototype.setFocus=CInfoPanel_setFocus;
CInfoPanel.prototype.attachEvents=CInfoPanel_attachEvents;
var g_ownerDocument=null;
function CMenu(id,_254,_255){
this.m_htmlContainer=document.body;
this.m_bVisible=false;
this.m_id=id;
this.m_htmlDivElement=null;
this.m_parent=null;
this.m_menuItems=[];
this.m_style=_254;
this.m_callback=null;
this.m_observers=new CObserver(this);
this.m_bForceCallback=false;
this.m_loadingMenuItem=false;
this.m_oCV=null;
if(typeof _255!="undefined"&&_255!=""){
this.m_webContentRoot=_255;
}else{
this.m_webContentRoot="..";
}
};
function CMenu_setHTMLContainer(_256){
this.m_htmlContainer=_256;
g_ownerDocument=this.m_htmlContainer.document?this.m_htmlContainer.document:this.m_htmlContainer.ownerDocument;
};
function CMenu_getHTMLContainer(){
return this.m_htmlContainer;
};
function CMenu_setParent(_257){
this.m_parent=_257;
};
function CMenu_getParent(){
return this.m_parent;
};
function CMenu_getId(){
return this.m_id;
};
function CMenu_getHTMLDiv(){
return this.m_htmlDivElement;
};
function CMenu_create(){
var _258=this.m_htmlContainer.document?this.m_htmlContainer.document.createElement("div"):this.m_htmlContainer.ownerDocument.createElement("div");
if(typeof this.getStyle()=="object"){
_258.className=this.getStyle().getNormalState();
}
_258.style.display="none";
_258.style.visibility="hidden";
_258.style.position="absolute";
_258.style.left="0px";
_258.style.top="0px";
_258.id=this.m_id;
_258.setAttribute("role","region");
if(window.RV_RES){
_258.setAttribute("aria-label",RV_RES.IDS_JS_A11Y_DYNAMIC_MENU);
}
this.m_htmlContainer.appendChild(_258);
this.m_htmlDivElement=_258;
};
function CMenu_setAltText(_259){
this.m_altText=_259;
};
function CMenu_getAltText(){
if(this.m_altText){
return this.m_altText;
}else{
return "";
}
};
function CMenu_genARIATags(){
var html=" role=\"menu\"";
if(this.getAltText()&&this.getAltText().length>0){
html+=" aria-labelledby=\""+this.m_id+"label\" ";
}else{
if(window.RV_RES){
html+=" aria-label=\""+RV_RES.IDS_JS_A11Y_DYNAMIC_MENU+"\" ";
}
}
return html;
};
function CMenu_genMenuAltText(){
var html="";
if(this.getAltText()&&this.getAltText().length>0){
html+="<tr><td><div style=\"position: absolute; overflow: hidden; width: 0; height: 0;\" id=\""+this.m_id+"label\">"+this.getAltText()+"</div></td></tr>";
}
return html;
};
function CMenu_draw(){
if(this.m_htmlContainer==null){
return;
}
if(this.m_htmlDivElement==null){
this.create();
}
var html="";
if(this.m_menuItems.length==0||this.m_bForceCallback==true){
this.setForceCallback(false);
if(this.m_callback!=null){
this.setLoadingMenuItem(true);
var menu=this;
var _25e=function(){
if(menu&&menu.executeCallback){
menu.executeCallback();
}
};
setTimeout(_25e,1000);
html="<table class=\"menuItem_normal\" CELLPADDING=\"0\" CELLSPACING=\"0\" tabindex=\"0\" hidefocus=\"true\"";
html+=this.genARIATags();
html+=">";
html+=this.genMenuAltText();
html+="<tr>";
var _25f="";
if(this.m_oCV&&RV_RES.GOTO_LOADING){
_25f=RV_RES.GOTO_LOADING;
}else{
if(typeof gUIFrameWorkMenuLoadingMessage!="undefined"){
_25f=gUIFrameWorkMenuLoadingMessage;
}else{
_25f="...";
}
}
html+="<td>";
html+="<img style=\"vertical-align:middle;\" alt=\""+_25f+"\" width=\"16\" height=\"16\" src=\""+this.m_webContentRoot+"/common/images/tv_loading.gif\"/>";
html+="</td>";
html+="<td nowrap=\"nowrap\" align=\"left\">";
html+=_25f;
html+="</td>";
html+="</tr>";
html+="</table>";
}
}else{
this.setLoadingMenuItem(false);
var i=0;
html="<table CELLPADDING=\"0\" CELLSPACING=\"0\" tabindex=\"0\" style=\"outline: none;\" hidefocus=\"true\"";
html+=this.genARIATags();
html+=">";
html+=this.genMenuAltText();
var _261=false;
for(i=0;i<this.m_menuItems.length;i++){
if(this.m_menuItems[i].isVisible()){
_261=true;
html+="<tr><td>";
html+=this.m_menuItems[i].draw();
html+="</td></tr>";
}
}
if(!_261){
this.remove();
return;
}
html+="</table>";
}
try{
this.m_htmlDivElement.innerHTML=html;
this.attachEvents();
}
catch(e){
}
this.updateCoords();
var _262="uiFrameworkHiddenIframe"+this.m_id;
var _263=((!isIE())&&(document.getElementById))?true:false;
setTimeout("updateIframeCoords(\""+_262+"\", \""+this.m_htmlDivElement.id+"\", "+_263+")",50);
if((typeof gCognosViewer!="undefined")&&(gCognosViewer.envParams["cv.responseFormat"])&&(gCognosViewer.envParams["cv.responseFormat"]=="fragment")){
AdjustPortalFont(this.m_htmlDivElement);
}
};
function CMenu_setLoadingMenuItem(_264){
this.m_loadingMenuItem=_264;
};
function CMenu_getLoadingMenuItem(){
return this.m_loadingMenuItem;
};
function CMenu_getScrollingPosition(){
var _265={"x":0,"y":0};
if(typeof window.pageYOffset!="undefined"){
_265={"x":window.pageXOffset,"y":window.pageYOffset};
}else{
if(typeof document.documentElement.scrollTop!="undefined"&&document.documentElement.scrollTop>0){
_265={"x":document.documentElement.scrollLeft,"y":document.documentElement.scrollTop};
}else{
if(typeof document.body.scrollTop!="undefined"){
_265={"x":document.body.scrollLeft,"y":document.body.scrollTop};
}
}
}
return _265;
};
function AdjustPortalFont(div){
var _267=fragments;
if(_267){
div.className+=" PortalFontFix";
var _268=null;
for(var frag in _267){
if(frag.indexOf("rvCanvas")>-1){
_268=$(_267[frag].div);
if(_268!=null){
break;
}
}
}
if(_268!=null){
div.style.fontSize=xGetComputedStyle(_268,"font-size");
}
}
};
function CMenu_updateCoords(){
var _26a=this.getParent();
var mnu=this.m_htmlDivElement;
if(mnu!=null){
var _26c=this.m_htmlContainer.document?this.m_htmlContainer.document:this.m_htmlContainer.ownerDocument;
var _26d=mnu.style.visibility;
var _26e=mnu.style.display;
mnu.style.visibility="hidden";
mnu.style.display="block";
if(mnu.firstChild!=null){
mnu.style.width=mnu.firstChild.offsetWidth;
}
var x=0,y=0;
var db=mnu.parentNode;
var _272=db.clientWidth;
var _273=db.clientHeight;
var _274=CMenu_getScrollingPosition();
var _275=_274.x;
var _276=_274.y;
if(_26a==null){
x=mnu.style.left;
y=mnu.style.top;
if(x.substr(x.length-2,2)=="px"){
x=parseInt(x.substring(0,x.length-2),10);
y=parseInt(y.substring(0,y.length-2),10);
}
if(y+mnu.offsetHeight>=(_273)){
if(y-mnu.offsetHeight>0){
y=y+_276-mnu.offsetHeight;
}else{
y=Math.max(_273-mnu.offsetHeight,0);
}
}else{
y=y+_276;
}
if(x+mnu.offsetWidth>=(_272)){
if(x-mnu.offsetWidth>0){
x=x+_275-mnu.offsetWidth;
}else{
x=Math.max(_272-mnu.offsetWidth,0);
}
}else{
x=x+_275;
}
}else{
if(!(_26a instanceof CToolbarButton)&&!(_26a instanceof CMenuItem)){
return;
}
if(typeof _26a.getMenuType!="function"){
return;
}
var _277=_26c.getElementById(this.getParent().getId());
var _278=_26c.getElementById("menu"+this.getParent().getId());
if(_277==null){
return;
}
var _279=_277;
if(_26a.getMenuType()=="dropDown"){
x=0;
y=_277.offsetHeight;
while(_279!=null){
x+=_279.offsetLeft;
y+=_279.offsetTop;
_279=_279.offsetParent;
}
if(getViewerDirection()=="rtl"){
var _27a=x-(mnu.offsetWidth-_277.offsetWidth);
if(_27a>_275){
x=_27a;
}
}
if((typeof gCognosViewer!="undefined")&&(gCognosViewer.envParams["cv.responseFormat"])&&(gCognosViewer.envParams["cv.responseFormat"]=="fragment")){
var _27b=_277;
while((_27b!=document.body)&&(_27b=_27b.parentNode)){
x-=_27b.scrollLeft||0;
y-=_27b.scrolltop||0;
}
if(_275){
x+=_275;
}
}
if((x+mnu.offsetWidth)>(_272+_275)){
x=x+_277.offsetWidth-mnu.offsetWidth;
if(_278!=null){
x=x+_278.offsetWidth;
}
}
if(((y+mnu.offsetHeight)>(_273+_276))&&(y-(mnu.offsetHeight+_277.clientHeight)>=0)){
y-=(mnu.offsetHeight+_277.clientHeight);
}
}else{
if(_26a.getMenuType()=="cascaded"){
x=_277.offsetWidth;
while(_279!=null){
x+=_279.offsetLeft;
y+=_279.offsetTop;
_279=_279.offsetParent;
}
if(getViewerDirection()=="rtl"){
var _27a=x-(mnu.offsetWidth+_277.offsetWidth);
if(_27a>_275){
x=_27a;
}
}
if((x+mnu.offsetWidth)>(_272+_275)){
x-=(_277.offsetWidth+mnu.offsetWidth);
}
if((y+mnu.offsetHeight)>(_273+_276)){
y-=(mnu.offsetHeight-_277.clientHeight);
}
}
}
}
mnu.style.visibility=_26d;
mnu.style.display=_26e;
this.setXCoord(x);
this.setYCoord(y);
this.setZIndex(500);
}
};
function CMenu_add(_27c){
if(typeof _27c.getObservers=="function"&&typeof _27c.getObservers()=="object"){
_27c.getObservers().attach(this,this.closeSubMenus,_27c.onmouseover);
_27c.getObservers().attach(this,this.closeAllMenus,_27c.onmouseup);
_27c.getObservers().attach(this,this.closeSubMenus,_27c.onfocus);
_27c.getObservers().attach(this,this.closeAllMenus,_27c.onkeypress);
}
this.m_menuItems[this.m_menuItems.length]=_27c;
};
function CMenu_get(_27d){
if(_27d>=0&&_27d<this.getNumItems()){
return this.m_menuItems[_27d];
}
return null;
};
CMenu.prototype.getItem=function(_27e){
var sId=_27e;
if(this.m_oCV){
sId=this.m_oCV.getId()+_27e;
}
for(var _280=0;_280<this.getNumItems();_280++){
var _281=this.get(_280);
if(typeof _281.getId=="function"&&_281.getId()==sId){
return _281;
}
}
};
function CMenu_getNumItems(){
return this.m_menuItems.length;
};
function CMenu_hide(){
this.hideHiddenIframe();
if(this.m_htmlDivElement!=null){
this.m_htmlDivElement.style.visibility="hidden";
}
this.m_bVisible=false;
var _282=this.getParent();
if(_282!=null&&typeof _282.setFocus=="function"){
_282.setFocus();
}else{
if(_282!=null&&typeof _282.focus=="function"){
_282.focus();
}else{
if(typeof this.m_focusCell=="object"&&typeof this.m_focusCell.focus=="function"){
this.m_focusCell.focus();
}
}
}
};
function CMenu_setFocus(){
try{
var _283=null;
for(var _284=0;_284<this.getNumItems()&&!_283;_284++){
var _285=this.get(_284);
if(_285.isVisible&&_285.isVisible()){
_283=_285;
}
}
if(!_283||!_283.setFocus()){
this.m_htmlDivElement.childNodes[0].focus();
}
}
catch(e){
}
};
function CMenu_show(){
if(this.m_htmlDivElement!=null){
this.m_bVisible=true;
if(!window.isIOS()){
var _286=this;
if(window.attachEvent){
window.attachEvent("onresize",function(){
_286.remove();
});
window.attachEvent("onscroll",function(){
_286.remove();
});
}else{
window.addEventListener("resize",function(){
_286.remove();
},false);
window.addEventListener("scroll",function(){
_286.remove();
},false);
}
var _287=null;
if(this.m_oCV!=null){
_287=document.getElementById(this.m_oCV.getId()+"content");
}
if(_287){
if(_287.parentNode.parentNode.attachEvent){
_287.parentNode.parentNode.attachEvent("onscroll",function(){
_286.remove();
});
}else{
_287.parentNode.parentNode.addEventListener("scroll",function(){
_286.remove();
},false);
}
}
}
this.updateCoords();
var _288=((!isIE())&&(document.getElementById))?true:false;
var _289="uiFrameworkHiddenIframe"+this.m_id;
var _28a=this.m_htmlContainer.document?this.m_htmlContainer.document.getElementById(_289):this.m_htmlContainer.ownerDocument.getElementById(_289);
if(_28a==null){
_28a=this.createHiddenIFrame(_289);
}
if(_28a){
_28a.style.display="block";
_28a.style.left="0px";
_28a.style.top="0px";
updateIframeCoords(_289,this.m_htmlDivElement.id,_288);
setTimeout("updateIframeCoords(\""+_289+"\", \""+this.m_htmlDivElement.id+"\", "+_288+")",50);
}
this.m_htmlDivElement.style.display="block";
this.m_htmlDivElement.style.visibility="visible";
this.setFocus();
}
};
function CMenu_createHiddenIFrame(_28b){
var _28c=this.getHTMLContainer();
var _28d=_28c.document?_28c.document.createElement("iframe"):_28c.ownerDocument.createElement("iframe");
_28d.setAttribute("id",_28b);
_28d.setAttribute("src",this.m_webContentRoot+"/common/images/spacer.gif");
_28d.setAttribute("scrolling","no");
_28d.setAttribute("frameborder","0");
_28d.style.position="absolute";
_28d.style.minWidth="0px";
_28d.style.minHeight="0px";
_28d.style.left="0px";
_28d.style.top="0px";
_28d.style.zIndex=499;
_28d.style.display="none";
_28d.setAttribute("title","Empty frame");
_28d.setAttribute("role","presentation");
_28c.appendChild(_28d);
return _28d;
};
function CMenu_isVisible(){
return this.m_bVisible;
};
function CMenu_remove(){
this.removeHiddenIframe();
for(var i=0;i<this.getNumItems();++i){
var _28f=this.get(i);
if(typeof _28f.getMenu=="function"&&_28f.getMenu()!=null){
_28f.getMenu().remove();
}
}
if(this.m_htmlContainer!=null&&this.m_htmlDivElement!=null){
this.m_htmlContainer.removeChild(this.m_htmlDivElement);
}
this.m_htmlDivElement=null;
this.m_bVisible=false;
};
function CMenu_removeHiddenIframe(){
try{
if(g_ownerDocument){
var _290=g_ownerDocument.getElementById("uiFrameworkHiddenIframe"+this.m_id);
if(_290!=null){
_290.style.display="none";
if(_290.parentNode&&_290.parentNode.removeChild){
_290.parentNode.removeChild(_290);
}
}
}
}
catch(e){
}
};
function CMenu_hideHiddenIframe(){
try{
var _291=g_ownerDocument.getElementById("uiFrameworkHiddenIframe"+this.m_id);
if(_291){
_291.style.display="none";
}
}
catch(e){
}
};
function CMenu_enable(){
};
function CMenu_disable(){
};
function CMenu_getState(){
};
function CMenu_clear(){
if(this.m_htmlDivElement!=null){
this.m_htmlDivElement.innerHTML="";
}
this.m_menuItems.splice(0,this.m_menuItems.length);
};
function CMenu_attachEvents(){
for(var i=0;i<this.m_menuItems.length;i++){
if(typeof this.m_menuItems[i].attachEvents=="function"){
this.m_menuItems[i].attachEvents();
}
}
this.m_htmlDivElement.onkeypress=this.onkeypress;
this.m_htmlDivElement.tbMenu=eval(this);
};
function CMenu_closeSubMenus(_293){
for(var i=0;i<this.m_menuItems.length;i++){
var _295=this.m_menuItems[i];
var _296=_293.getSubject();
if(_295!=_296&&typeof _295.getMenu=="function"&&_295.getMenu()!=null&&_295.getMenu().isVisible()){
_295.getMenu().remove();
}
}
};
function CMenu_closeAllMenus(_297){
var _298=this;
var _299=null;
while(_298){
if(_298 instanceof CMenu){
_299=_298;
}
_298=_298.getParent();
}
if(_299!=null){
_299.remove();
}
};
function CMenu_setStyle(_29a){
this.m_style=_29a;
};
function CMenu_getStyle(){
return this.m_style;
};
function CMenu_setXCoord(x){
var _29c=this.getHTMLDiv();
if(_29c!=null){
_29c.style.left=x+"px";
}
};
function CMenu_setYCoord(y){
var _29e=this.getHTMLDiv();
if(_29e!=null){
_29e.style.top=y+"px";
}
};
function CMenu_setZIndex(_29f){
var _2a0=this.getHTMLDiv();
if(_2a0!=null){
_2a0.style.zIndex=_29f;
}
};
function CMenu_registerCallback(_2a1){
this.m_callback=_2a1;
};
function CMenu_executeCallback(){
if(typeof this.m_callback=="function"){
this.m_callback();
}else{
if(typeof this.m_callback=="string"){
eval(this.m_callback);
}
}
};
function CMenu_getObservers(){
return this.m_observers;
};
function CMenu_onmouseover(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseover=="function"){
this.getParent().onmouseover(evt);
}
this.getObservers().notify(CMenu_onmouseover);
};
function CMenu_onmouseout(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseout=="function"){
this.getParent().onmouseout(evt);
}
this.getObservers().notify(CMenu_onmouseout);
};
function CMenu_onmouseup(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseup=="function"){
this.getParent().onmouseup(evt);
}
this.getObservers().notify(CMenu_onmouseup);
};
function CMenu_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
var menu=this.tbMenu;
if(typeof menu=="object"){
if(evt.keyCode==40){
var _2a7=false;
for(var i=0;i<menu.m_menuItems.length;i++){
var _2a9=menu.m_menuItems[i];
if(typeof _2a9.isVisible=="function"&&_2a9.isVisible()&&typeof _2a9.setFocus=="function"){
_2a9.setFocus();
_2a7=true;
break;
}
}
if(!_2a7){
menu.hide();
}
}
if(evt.keyCode==38){
menu.hide();
}
}
if(typeof this.getParent=="function"&&this.getParent()!=null&&typeof this.getParent().onkeypress=="function"){
this.getParent().onkeypress(evt);
}
if(typeof this.getObservers=="function"){
this.getObservers().notify(CMenu_onkeypress);
}
};
function CMenu_getForceCallback(){
return this.m_bForceCallback;
};
function CMenu_setForceCallback(_2aa){
this.m_bForceCallback=_2aa;
};
CMenu.prototype.draw=CMenu_draw;
CMenu.prototype.updateCoords=CMenu_updateCoords;
CMenu.prototype.add=CMenu_add;
CMenu.prototype.get=CMenu_get;
CMenu.prototype.getNumItems=CMenu_getNumItems;
CMenu.prototype.hide=CMenu_hide;
CMenu.prototype.hideHiddenIframe=CMenu_hideHiddenIframe;
CMenu.prototype.removeHiddenIframe=CMenu_removeHiddenIframe;
CMenu.prototype.show=CMenu_show;
CMenu.prototype.enable=CMenu_enable;
CMenu.prototype.disable=CMenu_disable;
CMenu.prototype.getState=CMenu_getState;
CMenu.prototype.clear=CMenu_clear;
CMenu.prototype.attachEvents=CMenu_attachEvents;
CMenu.prototype.setParent=CMenu_setParent;
CMenu.prototype.getParent=CMenu_getParent;
CMenu.prototype.getHTMLContainer=CMenu_getHTMLContainer;
CMenu.prototype.setHTMLContainer=CMenu_setHTMLContainer;
CMenu.prototype.getHTMLDiv=CMenu_getHTMLDiv;
CMenu.prototype.create=CMenu_create;
CMenu.prototype.remove=CMenu_remove;
CMenu.prototype.getId=CMenu_getId;
CMenu.prototype.isVisible=CMenu_isVisible;
CMenu.prototype.setStyle=CMenu_setStyle;
CMenu.prototype.getStyle=CMenu_getStyle;
CMenu.prototype.closeSubMenus=CMenu_closeSubMenus;
CMenu.prototype.closeAllMenus=CMenu_closeAllMenus;
CMenu.prototype.setXCoord=CMenu_setXCoord;
CMenu.prototype.setYCoord=CMenu_setYCoord;
CMenu.prototype.setZIndex=CMenu_setZIndex;
CMenu.prototype.update=new Function("return true");
CMenu.prototype.registerCallback=CMenu_registerCallback;
CMenu.prototype.executeCallback=CMenu_executeCallback;
CMenu.prototype.getObservers=CMenu_getObservers;
CMenu.prototype.onmouseover=CMenu_onmouseover;
CMenu.prototype.onmouseout=CMenu_onmouseout;
CMenu.prototype.onmouseup=CMenu_onmouseup;
CMenu.prototype.onkeypress=CMenu_onkeypress;
CMenu.prototype.createHiddenIFrame=CMenu_createHiddenIFrame;
CMenu.prototype.setForceCallback=CMenu_setForceCallback;
CMenu.prototype.getForceCallback=CMenu_getForceCallback;
CMenu.prototype.setFocus=CMenu_setFocus;
CMenu.prototype.genARIATags=CMenu_genARIATags;
CMenu.prototype.setAltText=CMenu_setAltText;
CMenu.prototype.getAltText=CMenu_getAltText;
CMenu.prototype.genMenuAltText=CMenu_genMenuAltText;
CMenu.prototype.setLoadingMenuItem=CMenu_setLoadingMenuItem;
CMenu.prototype.getLoadingMenuItem=CMenu_getLoadingMenuItem;
function updateIframeCoords(id,_2ac,_2ad){
if(g_ownerDocument==null){
return;
}
var _2ae=g_ownerDocument.getElementById(_2ac);
var _2af=g_ownerDocument.getElementById(id);
if(_2af&&_2ae){
if(_2ad==true){
_2af.style.left=_2ae.offsetLeft+"px";
_2af.style.top=_2ae.offsetTop+"px";
_2af.style.width=_2ae.offsetWidth+"px";
_2af.style.height=_2ae.offsetHeight+"px";
}else{
_2af.style.pixelLeft=_2ae.offsetLeft;
_2af.style.pixelTop=_2ae.offsetTop;
_2af.style.pixelWidth=_2ae.offsetWidth;
_2af.style.pixelHeight=_2ae.offsetHeight;
}
}
};
function CIcon(_2b0,_2b1,_2b2){
this.m_iconPath=_2b0;
this.m_toolTip=_2b1;
this.m_enabled=true;
this.m_height=16;
this.m_width=16;
if(typeof _2b2!="undefined"&&_2b2!=""){
this.m_webContentRoot=_2b2;
}else{
this.m_webContentRoot="..";
}
};
function CIcon_draw(){
var html="";
html+="<img style=\"vertical-align:middle;\" src=\"";
if(typeof this.m_iconPath!="undefined"&&this.m_iconPath!==""&&this.m_iconPath!="blankIcon"){
if(this.m_enabled==true){
html+=this.m_iconPath;
}else{
html+=this.getDisabledImagePath();
}
html+="\" title=\"";
if(typeof this.m_toolTip=="string"&&this.m_toolTip.length>0){
html+=this.m_toolTip;
}
html+="\" alt=\"";
if(typeof this.m_toolTip=="string"&&this.m_toolTip.length>0){
html+=this.m_toolTip;
}
html+="\" width=\"";
html+=this.m_width;
html+="\" height=\"";
html+=this.m_height;
html+="\"/>";
}else{
html+=this.m_webContentRoot+"/common/images/spacer.gif";
html+="\" alt=\"\"";
if(this.m_iconPath=="blankIcon"){
html+=" width=\"";
html+=this.m_width;
html+="\" height=\"";
html+=this.m_height;
html+="\"/>";
}else{
html+=" width=\"1\" height=\"1\"/>";
}
}
return html;
};
function CIcon_getDisabledImagePath(){
var _2b4=this.m_iconPath.split("/");
var _2b5="";
for(var i=0;i<(_2b4.length-1);++i){
_2b5+=_2b4[i]+"/";
}
_2b5+="dis_"+_2b4[_2b4.length-1];
return _2b5;
};
function CIcon_getPath(){
return this.m_iconPath;
};
function CIcon_setPath(path){
this.m_iconPath=path;
};
function CIcon_getToolTip(){
return this.m_toolTip;
};
function CIcon_setToolTip(_2b8){
this.m_toolTip=_2b8;
};
function CIcon_enable(){
this.m_enabled=true;
};
function CIcon_disable(){
this.m_enabled=false;
};
function CIcon_isEnabled(){
return this.m_enabled;
};
function CIcon_setHeight(_2b9){
this.m_height=_2b9;
};
function CIcon_getHeight(){
return this.m_height;
};
function CIcon_setWidth(_2ba){
this.m_width=_2ba;
};
function CIcon_getWidth(){
return this.m_width;
};
CIcon.prototype.draw=CIcon_draw;
CIcon.prototype.enable=CIcon_enable;
CIcon.prototype.disable=CIcon_disable;
CIcon.prototype.isEnabled=CIcon_isEnabled;
CIcon.prototype.getDisabledImagePath=CIcon_getDisabledImagePath;
CIcon.prototype.getPath=CIcon_getPath;
CIcon.prototype.setPath=CIcon_setPath;
CIcon.prototype.setHeight=CIcon_setHeight;
CIcon.prototype.getHeight=CIcon_getHeight;
CIcon.prototype.setWidth=CIcon_setWidth;
CIcon.prototype.getWidth=CIcon_getWidth;
CIcon.prototype.getToolTip=CIcon_getToolTip;
CIcon.prototype.setToolTip=CIcon_setToolTip;
var cHorizonalBar=0;
var cVerticalBar=1;
function CBar(_2bb,_2bc,sId,_2be,_2bf,_2c0,_2c1,_2c2){
this.m_align="left";
this.m_items=[];
this.m_htmlContainerId=_2bb;
this.m_htmlContainer=null;
this.m_id="cbar"+_2bb;
this.m_menuType=cVerticalBar;
this.m_style=_2bc;
this.m_parent=null;
this.m_observers=new CObserver(this);
this.m_cookieVar=_2c1;
this.m_cookieName=_2c2;
this.m_sId=(sId)?sId:null;
this.m_display=DISPLAY_INLINE;
this.m_imagePath=(_2be)?_2be:"../common/images/toolbar/";
this.m_imgCollapseSrc=this.m_imagePath+"toolbar_collapse.gif";
this.m_imgExpandSrc=this.m_imagePath+"toolbar_expand.gif";
this.m_showTooltip=_2bf?_2bf:null;
this.m_hideTooltip=_2c0?_2c0:null;
};
function CBar_hideBar(){
var bar=document.getElementById("bar"+this.m_id);
var _2c4=document.getElementById("barIcon"+this.m_id);
if(_2c4){
_2c4.src=this.m_imgExpandSrc;
if(this.m_showTooltip!=null){
_2c4.alt=this.m_showTooltip;
_2c4.title=this.m_showTooltip;
}
}
if(bar){
bar.style.display=DISPLAY_NONE;
if(typeof setQSCookie=="function"){
setQSCookie(this.m_cookieVar,this.m_cookieName,0);
}
}
};
function CBar_showBar(){
var bar=document.getElementById("bar"+this.m_id);
var _2c6=document.getElementById("barIcon"+this.m_id);
if(_2c6){
_2c6.src=this.m_imgCollapseSrc;
if(this.m_hideTooltip!=null){
_2c6.alt=this.m_hideTooltip;
_2c6.title=this.m_hideTooltip;
}
}
if(bar){
bar.style.display=this.m_display;
if(typeof setQSCookie=="function"){
setQSCookie(this.m_cookieVar,this.m_cookieName,1);
}
}
};
function CBar_toggleBar(){
var bar=document.getElementById("bar"+this.m_id);
var _2c8=bar.style.display;
if((_2c8==this.m_display)||(_2c8=="")){
this.hideBar();
}else{
this.showBar();
}
};
function CBar_getParent(){
return this.m_parent;
};
function CBar_setParent(_2c9){
this.m_parent=_2c9;
};
function CBar_draw(){
if(this.m_htmlContainer==null){
this.m_htmlContainer=document.getElementById(this.m_htmlContainerId);
if(this.m_htmlContainer==null){
return;
}
}
var html="";
html+="<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\"";
if(this.m_sId!=null){
html+="style=\"display: inline;\"><tr>";
html+="<td"+(isFF()?" style=\"vertical-align:bottom\"":"")+" style=\"height:26px\"><img id=\"barIcon"+this.m_id+"\" border=\"0\" src=\""+this.m_imgCollapseSrc+"\"";
if(this.m_hideTooltip!=null){
html+=" alt=\""+this.m_hideTooltip+"\" title=\""+this.m_hideTooltip+"\"";
}
html+=" onclick=\""+this.m_sId+".toggleBar();\" style=\"cursor:pointer;cursor:hand;\"></td>";
}else{
var _2cb="";
if(this.m_htmlContainer.style.textAlign=="right"){
_2cb="margin-left:auto; margin-right: 0;";
}else{
if(this.m_htmlContainer.style.textAlign=="left"){
_2cb="margin-left:0; margin-right: auto;";
}else{
if(this.m_htmlContainer.style.textAlign=="center"){
_2cb="margin-left:auto; margin-right: auto;";
}
}
}
if(_2cb!=""){
html+=" style=\""+_2cb+"\"";
}
html+="><tr>";
}
html+="<td id=\"bar"+this.m_id+"\">";
html+="<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\" class=\"";
if(this.getStyle()!=null){
html+=this.getStyle().getNormalState();
}
html+="\" id=\"";
html+=this.m_id;
html+="\" style=\""+this.m_style+"\"><tr>";
html+=this.drawItems();
html+="</tr></table></td>";
html+="</tr></table>";
this.m_htmlContainer.innerHTML=html;
this.m_htmlContainer.style.textAlign=this.m_align;
for(var i=0;i<this.m_items.length;++i){
if(typeof this.m_items[i].init=="function"){
this.m_items[i].init();
}
}
this.attachEvents();
};
function CBar_drawItems(){
var html="";
for(var i=0;i<this.m_items.length;++i){
if(typeof this.m_items[i].draw=="function"){
if(this.m_menuType==cHorizonalBar&&!(this.m_items[i] instanceof CSeperator)){
html+="<td style=\"white-space:nowrap;";
if(this.m_items[i] instanceof CMenuItem){
html+=";padding-left:1px; padding-right: 1px;";
}
html+="\">";
}
if(this.m_items[i].isVisible()){
html+=this.m_items[i].draw();
}
if(this.m_menuType==cHorizonalBar&&!(this.m_items[i] instanceof CSeperator)){
html+="</td>";
}
}
}
return html;
};
function CBar_attachEvents(){
for(var i=0;i<this.m_items.length;++i){
if(typeof this.m_items[i].attachEvents=="function"&&this.m_items[i].isVisible()){
this.m_items[i].attachEvents();
}
}
};
function CBar_add(item){
if(typeof item.getObservers=="function"&&typeof item.getObservers()=="object"&&typeof item.onmouseover=="function"&&item instanceof CMenuItem){
item.getObservers().attach(this,this.closeMenus,item.onmouseover);
}
this.m_items[this.m_items.length]=item;
};
function CBar_getNumItems(){
return this.m_items.length;
};
function CBar_getId(){
return this.m_id;
};
function CBar_get(_2d1){
if(_2d1>=0&&_2d1<this.getNumItems()){
return this.m_items[_2d1];
}
return null;
};
function CBar_hide(_2d2){
if(_2d2>0&&_2d2<this.getNumItems()){
if(typeof this.m_items[i].hide=="function"){
this.m_items[i].hide();
}
}
};
function CBar_show(_2d3){
if(_2d3>0&&_2d3<this.getNumItems()){
if(typeof this.m_items[i].show=="function"){
this.m_items[i].show();
}
}
};
function CBar_enable(_2d4){
if(_2d4>0&&_2d4<this.getNumItems()){
if(typeof this.m_items[i].enable=="function"){
this.m_items[i].enable();
}
}
};
function CBar_disable(_2d5){
if(_2d5>0&&_2d5<this.getNumItems()){
if(typeof this.m_items[i].disable=="function"){
this.m_items[i].disable();
}
}
};
function CBar_getState(_2d6){
if(_2d6>0&&_2d6<this.getNumItems()){
if(typeof this.m_items[i].getState=="function"){
this.m_items[i].getState();
}
}
};
function CBar_setMenuType(_2d7){
this.m_menuType=_2d7;
};
function CBar_getMenuType(){
return this.m_menuType;
};
function CBar_setStyle(_2d8){
this.m_style=_2d8;
};
function CBar_setAlign(_2d9){
this.m_align=_2d9;
};
function CBar_getStyle(){
return this.m_style;
};
function CBar_closeMenus(_2da){
for(var i=0;i<this.getNumItems();i++){
var _2dc=this.get(i);
if(typeof _2da=="object"){
if(_2da.getSubject()==_2dc){
continue;
}
}
if(typeof _2dc.getMenu=="function"&&_2dc.getMenu()!=null&&_2dc.getMenu().isVisible()){
_2dc.getMenu().remove();
}
}
};
function CBar_getHTMLContainer(){
return this.m_htmlContainer;
};
function CBar_getObservers(){
return this.m_observers;
};
function CBar_onmouseover(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseover=="function"){
this.getParent().onmouseover(evt);
}
this.getObservers().notify(CBar_onmouseover);
};
function CBar_onmouseout(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseout=="function"){
this.getParent().onmouseout(evt);
}
this.getObservers().notify(CBar_onmouseout);
};
function CBar_onmouseup(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseup=="function"){
this.getParent().onmouseup(evt);
}
this.getObservers().notify(CBar_onmouseup);
};
function CBar_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onkeypress=="function"){
this.getParent().onkeypress(evt);
}
this.getObservers().notify(CBar_onkeypress);
};
CBar.prototype.draw=CBar_draw;
CBar.prototype.add=CBar_add;
CBar.prototype.get=CBar_get;
CBar.prototype.hide=CBar_hide;
CBar.prototype.show=CBar_show;
CBar.prototype.enable=CBar_enable;
CBar.prototype.disable=CBar_disable;
CBar.prototype.getState=CBar_getState;
CBar.prototype.attachEvents=CBar_attachEvents;
CBar.prototype.drawItems=CBar_drawItems;
CBar.prototype.getId=CBar_getId;
CBar.prototype.setMenuType=CBar_setMenuType;
CBar.prototype.getMenuType=CBar_getMenuType;
CBar.prototype.getNumItems=CBar_getNumItems;
CBar.prototype.setStyle=CBar_setStyle;
CBar.prototype.getStyle=CBar_getStyle;
CBar.prototype.setAlign=CBar_setAlign;
CBar.prototype.closeMenus=CBar_closeMenus;
CBar.prototype.setParent=CBar_setParent;
CBar.prototype.getParent=CBar_getParent;
CBar.prototype.getHTMLContainer=CBar_getHTMLContainer;
CBar.prototype.getObservers=CBar_getObservers;
CBar.prototype.update=new Function("return true");
CBar.prototype.getObservers=CBar_getObservers;
CBar.prototype.onmouseover=CBar_onmouseover;
CBar.prototype.onmouseout=CBar_onmouseout;
CBar.prototype.onmouseup=CBar_onmouseup;
CBar.prototype.onkeypress=CBar_onkeypress;
CBar.prototype.hideBar=CBar_hideBar;
CBar.prototype.showBar=CBar_showBar;
CBar.prototype.toggleBar=CBar_toggleBar;
function CStaticText(text,_2e2){
this.m_text=text;
this.m_style=_2e2;
this.m_bVisible=true;
this.m_sId="";
};
CStaticText.prototype.setId=function(sId){
this.m_sId=sId;
};
CStaticText.prototype.getId=function(){
return this.m_sId;
};
CStaticText.prototype.setText=function(text){
this.m_text=text;
};
CStaticText.prototype.setLabelledBy=function(text){
this.m_labelledBy=text;
};
CStaticText.prototype.draw=function(){
var html="";
html+="<td style=\"white-space: nowrap;\" class=\"";
html+=this.m_style.getNormalState()+"\"";
if(this.getId()!=""){
html+=" id=\""+this.getId()+"\"";
}
html+=">";
var _2e7=this.m_labelledBy?"aria-labelledby=\""+this.getId()+"label\"":"";
html+="<div role=\"presentation\" tabIndex=\"0\" "+_2e7+">";
html+=this.m_text;
html+="</div>";
if(this.m_labelledBy){
html+="<div style=\"position: absolute; overflow: hidden; width: 0; height: 0;\" id=\""+this.getId()+"label\">";
html+=this.m_labelledBy;
html+="</div>";
}
html+="</td>";
return html;
};
CStaticText.prototype.isVisible=function(){
return this.m_bVisible;
};
CStaticText.prototype.hide=function(){
this.m_bVisible=false;
};
CStaticText.prototype.hide.show=function(){
this.m_bVisible=true;
};
var DISPLAY_INLINE="inline";
var DISPLAY_NONE="none";
var DISPLAY_BLOCK="block";
var __excel_win=null;
var __pdf_win=null;
if(window.attachEvent){
window.attachEvent("onkeydown",viewerMainKeyPress);
window.attachEvent("onresize",onResizeViewerEvent);
}else{
if(window.addEventListener){
window.addEventListener("keypress",viewerMainKeyPress,false);
window.addEventListener("resize",onResizeViewerEvent,false);
}
}
function attachLeavingRV(){
if(window.attachEvent){
window.attachEvent("onbeforeunload",leavingRV);
}else{
if(window.addEventListener){
window.addEventListener("beforeunload",leavingRV,false);
}else{
try{
var _2e8=window.onunload;
if(!(""+_2e8).match(/leavingRV/gi)){
window.oLeavingRV_onunload=window.onunload;
window.onunload=function(){
window.oLeavingRV_onunload();
leavingRV();
};
}
}
catch(e){
}
}
}
};
function detachLeavingRV(){
if(window.detachEvent){
window.detachEvent("onbeforeunload",leavingRV);
}else{
window.removeEventListener("beforeunload",leavingRV,false);
}
};
window.attachLeavingRV();
function CContextMenu(_2e9){
if(_2e9==null){
return;
}
this.m_mainWnd=_2e9;
this.setCV(this.m_mainWnd.getCV());
var _2ea=this.m_mainWnd.getCV().getWebContentRoot();
var _2eb=this.m_mainWnd.getCV().getSkin();
var _2ec=this.m_mainWnd.getUIHide();
this.m_contextMenu=new CMenu("rvContextMenu"+this.getCVId(),gMenuStyle,_2ea);
this.m_contextMenu.m_oCV=this.getCV();
this.m_downloadChart=new CMenuItem(this.m_contextMenu,RV_RES.RV_DOWNLOAD_CHART,"if(typeof "+getCognosViewerSCObjectRefAsString(this.getCVId())+" != 'undefined') "+getCognosViewerSCObjectRefAsString(this.getCVId())+".downloadSelectedChartImage('"+this.getCVId()+"');",_2ea+"/rv/images/action_chart.gif",gMenuItemStyle,_2ea,_2eb);
this.m_downloadChart.hide();
this.m_downloadChartSeperator=new CSeperator("horizontal_line"+this.getCVId(),"1",gMenuSeperatorStyle,_2ea);
this.m_downloadChartSeperator.hide();
this.m_contextMenu.add(this.m_downloadChartSeperator);
var _2ed=this.getCV().getDrillMgr();
if(_2ed){
if(this.getCV().envParams["ui.action"]=="view"){
if(this.getCV().bCanUseCognosViewerIndexSearch&&_2ec.indexOf(" RV_CONTEXT_MENU_GOTO ")==-1){
this.m_goto=new CMenuItem(this.m_contextMenu,RV_RES.RV_GO_TO,this.getCVObjectRef()+".getDrillMgr().launchGoToPage(null,true);",_2ea+"/rv/images/action_go_to.gif",gMenuItemStyle,_2ea,_2eb);
var _2ee=this.m_goto.createCascadedMenu(gMenuStyle);
}
}else{
if(typeof RV_RES.RV_DRILL_DOWN!="undefined"){
this.m_drillDown=new CMenuItem(this.m_contextMenu,RV_RES.RV_DRILL_DOWN,this.getCVObjectRef()+".getDrillMgr().rvDrillDown();",_2ea+"/rv/images/action_drill_down.gif",gMenuItemStyle,_2ea,_2eb);
this.m_drillDown.disable();
}
if(typeof RV_RES.RV_DRILL_UP!="undefined"){
this.m_drillUp=new CMenuItem(this.m_contextMenu,RV_RES.RV_DRILL_UP,this.getCVObjectRef()+".getDrillMgr().rvDrillUp();",_2ea+"/rv/images/action_drill_up.gif",gMenuItemStyle,_2ea,_2eb);
this.m_drillUp.disable();
}
if(this.getCV().isInteractiveViewer()&&this.getCV().getAdvancedServerProperty("VIEWER_JS_ENABLE_EXPAND_COLLAPSE")=="true"){
this.m_contextMenu.add(gMenuSeperator);
if(typeof RV_RES.IDS_JS_EXPAND_MEMBER!="undefined"){
this.m_expand=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_EXPAND_MEMBER,this.getCVObjectRef()+".expand();","",gMenuItemStyle,_2ea,_2eb);
this.m_expand.disable();
}
if(typeof RV_RES.IDS_JS_COLLAPSE_MEMBER!="undefined"){
this.m_collapse=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_COLLAPSE_MEMBER,this.getCVObjectRef()+".collapse();","",gMenuItemStyle,_2ea,_2eb);
this.m_collapse.disable();
}
}
if(!this.getCV().m_viewerFragment&&typeof RV_RES.IDS_JS_FREEZECOLUMNHEADINGS!=="undefined"&&typeof RV_RES.IDS_JS_FREEZEROWHEADINGS!=="undefined"){
this.m_freezeRowHeadings=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_FREEZEROWHEADINGS,this.getCVObjectRef()+".getPinFreezeManager().freezeSelectedRowHeadings();",_2ea+"/rv/images/action_freeze_row_heading.gif",gMenuItemStyle,_2ea,_2eb);
this.m_unfreezeRowHeadings=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_UNFREEZEROWHEADINGS,this.getCVObjectRef()+".getPinFreezeManager().unfreezeSelectedRowHeadings();",_2ea+"/rv/images/action_freeze_row_heading.gif",gMenuItemStyle,_2ea,_2eb);
this.m_freezeColumnHeadings=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_FREEZECOLUMNHEADINGS,this.getCVObjectRef()+".getPinFreezeManager().freezeSelectedColumnHeadings();",_2ea+"/rv/images/action_freeze_column_heading.gif",gMenuItemStyle,_2ea,_2eb);
this.m_unfreezeColumnHeadings=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_UNFREEZECOLUMNHEADINGS,this.getCVObjectRef()+".getPinFreezeManager().unfreezeSelectedColumnHeadings();",_2ea+"/rv/images/action_freeze_column_heading.gif",gMenuItemStyle,_2ea,_2eb);
this.m_freezeColumnHeadings.hide();
this.m_unfreezeColumnHeadings.hide();
this.m_freezeRowHeadings.hide();
this.m_unfreezeRowHeadings.hide();
}
if(typeof RV_RES.RV_GO_TO!="undefined"){
if(_2ec.indexOf(" RV_CONTEXT_MENU_GOTO ")==-1){
if(_2ec.indexOf(" RV_CONTEXT_MENU_DRILL_UP ")==-1||!_2ec.indexOf(" RV_CONTEXT_MENU_DRILL_DOWN ")==-1){
this.m_contextMenu.add(gMenuSeperator);
}
}
this.m_goto=new CMenuItem(this.m_contextMenu,RV_RES.RV_GO_TO,this.getCVObjectRef()+".getDrillMgr().launchGoToPage(null,true);",_2ea+"/rv/images/action_go_to.gif",gMenuItemStyle,_2ea,_2eb);
var _2ef=this.m_goto.createCascadedMenu(gMenuStyle);
_2ef.m_oCV=this.getCV();
if(this.getCV().envParams["cv.containerApp"]=="AA"){
_2ef.registerCallback(this.getCVObjectRef()+".m_viewerFragment.raiseGotoContextMenuEvent()");
}else{
_2ef.registerCallback(this.getCVObjectRef()+".getDrillMgr().getDrillThroughParameters()");
}
}
}
}
var _2f0=this.getCV().getSubscriptionManager();
if(_2f0&&this.getCV().bCanUseCognosViewerConditionalSubscriptions){
this.m_subscriptionSeperator=new CSeperator("horizontal_line","1",gMenuSeperatorStyle,_2ea);
this.m_subscriptionSeperator.hide();
this.m_contextMenu.add(this.m_subscriptionSeperator);
if(RV_RES.RV_NEW_WATCH_RULE){
this.m_subscription=new CMenuItem(this.m_contextMenu,RV_RES.RV_NEW_WATCH_RULE,this.getCVObjectRef()+".getSubscriptionManager().NewSubscription();",_2ea+"/rv/images/action_new_subscription.gif",gMenuItemStyle,_2ea,_2eb);
this.m_subscription.disable();
}
}
var _2f1=false;
if(this.getCV().bCanUseGlossary&&RV_RES.RV_GLOSSARY&&_2ec.indexOf(" RV_CONTEXT_MENU_GLOSSARY ")==-1){
_2f1=true;
this.m_contextMenu.add(gMenuSeperator);
this.m_glossaryItem=new CMenuItem(this.m_contextMenu,RV_RES.RV_GLOSSARY,this.getCVObjectRef()+".executeAction('Glossary');",_2ea+"/rv/images/action_glossary.gif",gMenuItemStyle,_2ea,_2eb);
this.m_glossaryItem.disable();
}
if(this.isLinegaeVisisble(_2ec)){
if(!_2f1){
this.m_contextMenu.add(gMenuSeperator);
}
this.m_lineageItem=new CMenuItem(this.m_contextMenu,RV_RES.RV_LINEAGE,this.getCVObjectRef()+".executeAction('Lineage');",_2ea+"/rv/images/action_lineage.gif",gMenuItemStyle,_2ea,_2eb);
this.m_lineageItem.disable();
}
};
CContextMenu.prototype=new CViewerHelper();
CContextMenu.prototype.isLinegaeVisisble=function(_2f2){
if(!isSafari()&&this.getCV().bCanUseLineage&&RV_RES.RV_LINEAGE&&_2f2.indexOf(" RV_CONTEXT_MENU_LINEAGE ")==-1){
if(this.getCV().envParams["ui.object"]||(this.getCV().envParams["metadataInformationURI"]&&this.getCV().envParams["metadataInformationURI"].indexOf("iis=")==-1)){
return true;
}
}
return false;
};
CContextMenu.prototype.hideFirstSeperators=function(){
var _2f3=this.m_contextMenu.m_menuItems.length;
for(var _2f4=0;_2f4<_2f3;_2f4++){
var _2f5=this.m_contextMenu.m_menuItems[_2f4];
if(_2f5.isVisible()&&typeof _2f5.m_toolbarSeperatorClass!="string"){
break;
}else{
if(typeof _2f5.m_toolbarSeperatorClass=="string"){
_2f5.hide();
}
}
}
};
CContextMenu.prototype.updateFreezeHeadings=function(){
if(this.getCV().m_viewerFragment){
return;
}
if(this.getCV().getPinFreezeManager()){
var _2f6=this.getCV().getPinFreezeManager();
if(this.m_freezeRowHeadings){
if(_2f6.canFreezeSelectedRowHeadings()){
this.m_freezeRowHeadings.show();
}else{
this.m_freezeRowHeadings.hide();
}
}
if(this.m_unfreezeRowHeadings){
if(_2f6.canUnfreezeSelectedRowHeadings()){
this.m_unfreezeRowHeadings.show();
}else{
this.m_unfreezeRowHeadings.hide();
}
}
if(this.m_freezeColumnHeadings){
if(_2f6.canFreezeSelectedColumnHeadings()){
this.m_freezeColumnHeadings.show();
}else{
this.m_freezeColumnHeadings.hide();
}
}
if(this.m_unfreezeColumnHeadings){
if(_2f6.canUnfreezeSelectedColumnHeadings()){
this.m_unfreezeColumnHeadings.show();
}else{
this.m_unfreezeColumnHeadings.hide();
}
}
}
};
function CContextMenu_draw(evt){
this.updateSubscriptionContextMenuItem();
if(this.m_bFaultModalShown){
this.update(this.subject);
this.m_bFaultModalShown=false;
}
this.hideFirstSeperators();
this.m_contextMenu.remove();
this.m_contextMenu.setHTMLContainer(document.body);
this.m_contextMenu.draw();
if(isIE()&&evt.keyCode&&evt.keyCode!=0){
var node=getCrossBrowserNode(evt);
var _2f9=clientToScreenCoords(node,document.body);
this.m_contextMenu.setXCoord(_2f9.leftCoord+node.scrollWidth);
this.m_contextMenu.setYCoord(_2f9.topCoord);
}else{
this.m_contextMenu.setXCoord(evt.clientX);
this.m_contextMenu.setYCoord(evt.clientY);
}
if(getCVWaitingOnFault()==null){
this.m_contextMenu.show();
this.m_bFaultModalShown=false;
}else{
this.m_bFaultModalShown=true;
}
var _2fa=this.m_contextMenu.get(this.m_contextMenu.getNumItems()-1);
if(_2fa&&typeof _2fa.getObservers=="function"&&typeof _2fa.getObservers()=="object"){
_2fa.getObservers().attach(this,this.closeMenuTabEvent,"CMenuItem_closeMenuTabEvent");
}
};
function CContextMenu_getDrillUpMenuItem(){
return this.m_drillUp;
};
function CContextMenu_getDrillDownMenuItem(){
return this.m_drillDown;
};
function CContextMenu_getGoToMenuItem(){
return this.m_goto;
};
function CContextMenu_closeMenuTabEvent(){
var oCV=this.m_mainWnd.getCV();
var _2fc=oCV.getSelectionController();
var _2fd=_2fc.getAllSelectedObjects().length;
if(_2fd>0){
var _2fe=_2fc.getAllSelectedObjects()[_2fd-1];
var _2ff=_2fe.getCellRef().getElementsByTagName("span");
if(_2ff.length>0){
for(var i=0;i<_2ff.length;i++){
var span=_2ff[i];
if(span.getAttribute("tabindex")!=null&&span.style.visibility!="hidden"){
span.focus();
}
}
}
}
};
function CContextMenu_hide(){
this.m_contextMenu.remove();
};
function CContextMenu_hideDownloadChartMenuItem(){
this.m_downloadChart.hide();
this.m_downloadChartSeperator.hide();
};
function CContextMenu_showDownloadChartMenuItem(){
this.m_downloadChart.show();
this.m_downloadChartSeperator.show();
};
function CContextMenu_update(_302){
if(_302 instanceof CSelectionController){
this.subject=_302;
var _303=this.m_mainWnd.getUIHide();
var _304=this.getCV().getDrillMgr();
if(_304){
if(this.getCV().envParams["ui.action"]!="view"){
var _305=this.getGoToMenuItem();
var _306=_305.getMenu();
if(_306){
_306.clear();
}
if(!_302.getSelectionBasedFeaturesEnabled()||_303.indexOf(" RV_CONTEXT_MENU_GOTO ")!=-1){
_305.hide();
}
var _307=this.getDrillDownMenuItem();
if(_303.indexOf(" RV_CONTEXT_MENU_DRILL_DOWN ")!=-1){
_307.hide();
}else{
if(_304.canDrillDown()){
this.updateDrillMenu(_307,"DrillDown");
_307.enable();
}else{
if(!_302.getSelectionBasedFeaturesEnabled()){
_307.hide();
}else{
_307.disable();
}
}
}
var _308=this.getDrillUpMenuItem();
if(_303.indexOf(" RV_CONTEXT_MENU_DRILL_UP ")!=-1){
_308.hide();
}
if(_304.canDrillUp()){
this.updateDrillMenu(_308,"DrillUp");
_308.enable();
}else{
if(!_302.getSelectionBasedFeaturesEnabled()){
_308.hide();
gMenuSeperator.hide();
}else{
_308.disable();
}
}
if(this.m_expand){
this.getCV().canExpand()?this.m_expand.enable():this.m_expand.disable();
}
if(this.m_collapse){
this.getCV().canCollapse()?this.m_collapse.enable():this.m_collapse.disable();
}
}
if(_303.indexOf(" RV_CONTEXT_MENU_DOWNLOAD_CHART ")!=-1){
this.hideDownloadChartMenuItem();
}else{
if(!_302.hasSelectedChartNodes()){
if(!_302.getSelectionBasedFeaturesEnabled()){
this.hide();
}else{
this.hideDownloadChartMenuItem();
}
}else{
this.showDownloadChartMenuItem();
}
}
}
var _309=false;
if(this.m_lineageItem||this.m_glossaryItem){
var _30a=_302.getAllSelectedObjects();
if(_30a!=null&&_30a.length>0){
for(var i=0;i<_30a.length;i++){
if(_30a[i].hasContextInformation()){
_309=true;
break;
}
}
}
}
this.updateFreezeHeadings();
if(this.m_glossaryItem&&_309&&this.getCV().envParams["glossaryURI"]!=null&&this.getCV().envParams["glossaryURI"]!=""){
this.m_glossaryItem.enable();
}else{
if(this.m_glossaryItem){
this.m_glossaryItem.disable();
}
}
if(this.m_lineageItem&&_309){
this.m_lineageItem.enable();
}else{
if(this.m_lineageItem){
this.m_lineageItem.disable();
}
}
}
};
CContextMenu.prototype.updateDrillMenu=function(_30c,_30d){
_30c.clearCascadedMenu();
var _30e={};
DrillContextMenuHelper.updateDrillMenuItems(_30e,this.getCV(),_30d);
if(_30e.items){
var _30f=_30e.items;
var _310=_30c.createCascadedMenu(gMenuStyle);
var _311=this.getCV().getWebContentRoot();
var _312=this.m_mainWnd.getCV().getSkin();
for(var i=0;i<_30f.length;i++){
var _314=_30f[i];
if(_314.separator){
if(i<(_30f.length-1)){
_310.add(gMenuSeperator);
}
}else{
var _315=_314.action&&_314.action.payload&&_314.action.payload.userSelectedDrillItem?_314.action.payload.userSelectedDrillItem:"";
var _316=_315?"{\"userSelectedDrillItem\" : \""+_315+"\"}":"{}";
if(_30d=="DrillDown"){
new CMenuItem(_310,_314.label,this.getCVObjectRef()+".getDrillMgr().rvDrillDown("+_316+");","",gMenuItemStyle,_311,_312);
}else{
new CMenuItem(_310,_314.label,this.getCVObjectRef()+".getDrillMgr().rvDrillUp("+_316+");","",gMenuItemStyle,_311,_312);
}
}
}
}
};
function CContextMenu_updateSubscriptionContextMenuItem(){
var _317=this.m_mainWnd.getUIHide();
var _318=this.getCV().getSubscriptionManager();
if(_317.indexOf(" RV_CONTEXT_MENU_ALERT_USING_NEW_WATCH_RULE ")!=-1&&this.m_subscription){
this.m_subscription.hide();
}else{
if(_318&&this.m_subscription&&_318.CanCreateNewWatchRule()){
this.m_subscriptionSeperator.show();
this.m_subscription.show();
if(_318.IsValidSelectionForNewRule()){
this.m_subscription.enable();
}else{
this.m_subscription.disable();
}
}else{
if(this.m_subscription){
this.m_subscriptionSeperator.hide();
this.m_subscription.hide();
}
}
}
};
CContextMenu.prototype.draw=CContextMenu_draw;
CContextMenu.prototype.hide=CContextMenu_hide;
CContextMenu.prototype.closeMenuTabEvent=CContextMenu_closeMenuTabEvent;
CContextMenu.prototype.getDrillUpMenuItem=CContextMenu_getDrillUpMenuItem;
CContextMenu.prototype.getDrillDownMenuItem=CContextMenu_getDrillDownMenuItem;
CContextMenu.prototype.getGoToMenuItem=CContextMenu_getGoToMenuItem;
CContextMenu.prototype.hideDownloadChartMenuItem=CContextMenu_hideDownloadChartMenuItem;
CContextMenu.prototype.showDownloadChartMenuItem=CContextMenu_showDownloadChartMenuItem;
CContextMenu.prototype.update=CContextMenu_update;
CContextMenu.prototype.updateSubscriptionContextMenuItem=CContextMenu_updateSubscriptionContextMenuItem;
function CReportHistory(_319,_31a,_31b,_31c){
this.m_mainWnd=_319;
this.m_stack_idx=_31a;
this.m_reportName="";
if(typeof _31b=="undefined"||_31b==null||_31b.length==0){
if(typeof _319!="undefined"&&_319!=null){
var _31d=RV_RES.RV_PREVIOUS_REPORT;
this.m_reportName=_31d;
}
}else{
this.m_reportName=_31b;
}
this.m_params=_31c;
};
CReportHistory.prototype.getDropDownMenuIcon=function(){
var _31e="/ps/portal/images/";
if(this.m_params["ui.action"]=="view"){
_31e+="icon_result_";
if(this.m_params["ui.format"]=="PDF"){
_31e+="pdf.gif";
}else{
_31e+="html.gif";
}
}else{
_31e+="action_run.gif";
}
return _31e;
};
CReportHistory.prototype.addParamNode=function(_31f,_320,_321){
var _322=_31f.ownerDocument.createElement("param");
_31f.appendChild(_322);
_322.setAttribute("name",_320);
_322.appendChild(_31f.ownerDocument.createTextNode(_321));
};
CReportHistory.prototype.saveAsXML=function(_323){
var _324=_323.ownerDocument.createElement("previousReport");
_323.appendChild(_324);
for(var _325 in this.m_params){
this.addParamNode(_324,_325,this.m_params[_325]);
}
this.addParamNode(_324,"ui.name",this.getReportName());
};
CReportHistory.prototype.getIdx=function(){
return this.m_stack_idx;
};
CReportHistory.prototype.getReportName=function(){
return this.m_reportName;
};
CReportHistory.prototype.getParameters=function(){
return this.m_params;
};
CReportHistory.prototype.createRequestForm=function(){
var oCV=this.m_mainWnd.getCV();
var _327=document.getElementById("formWarpRequest"+oCV.getId());
var form=document.createElement("form");
form.setAttribute("id","previousReport");
form.setAttribute("name","previousReport");
form.setAttribute("target",_327.getAttribute("target")?_327.getAttribute("target"):"");
form.setAttribute("method","post");
form.setAttribute("action",_327.getAttribute("action"));
form.style.display="none";
document.body.appendChild(form);
for(var _329 in this.m_params){
if(_329!="m_tracking"){
form.appendChild(createHiddenFormField(_329,this.m_params[_329]));
}
}
for(var _32a in oCV.envParams){
if(_32a.indexOf("cv.")==0&&_32a!="cv.previousReports"&&_32a!="m_tracking"&&_32a!="cv.actionState"){
form.appendChild(createHiddenFormField(_32a,oCV.envParams[_32a]));
}
}
if(this.getIdx()>0){
this.m_mainWnd.m_reportHistoryList=this.m_mainWnd.m_reportHistoryList.slice(0,this.getIdx());
form.appendChild(createHiddenFormField("cv.previousReports",this.m_mainWnd.saveReportHistoryAsXML()));
}
form.appendChild(createHiddenFormField("ui.name",this.getReportName()));
form.appendChild(createHiddenFormField("b_action","cognosViewer"));
var _32b=_327.getElementsByTagName("INPUT");
for(var _32c=0;_32c<_32b.length;++_32c){
if(typeof form[_32b[_32c].name]=="undefined"&&_32b[_32c].name!="cv.previousReports"&&_32b[_32c].name.length>0){
form.appendChild(createHiddenFormField(_32b[_32c].name,_32b[_32c].value));
}
}
return form;
};
CReportHistory.prototype.execute=function(){
var oCV=this.m_mainWnd.getCV();
if(typeof oCV.m_viewerFragment!="undefined"){
var _32e=new ViewerDispatcherEntry(oCV);
_32e.addFormField("ui.action",this.m_params["ui.action"]);
for(var _32f in this.m_params){
if(_32f!="ui.action"&&_32f!="m_tracking"&&_32f!="cv.actionState"){
_32e.addFormField(_32f,this.m_params[_32f]);
}
}
if(this.getIdx()>0){
this.m_mainWnd.m_reportHistoryList=this.m_mainWnd.m_reportHistoryList.slice(0,this.getIdx());
_32e.addFormField("cv.previousReports",this.m_mainWnd.saveReportHistoryAsXML());
}else{
_32e.removeFormField("cv.previousReports");
}
if(this.m_reportName&&this.m_reportName.length>0){
_32e.addFormField("ui.name",this.m_reportName);
}
_32e.addFormField("cv.responseFormat","fragment");
_32e.addFormField("cv.ignoreState","true");
_32e.addFormField("cv.id","_THIS_");
_32e.addFormField("m_tracking","");
oCV.dispatchRequest(_32e);
}else{
var form=this.createRequestForm();
form.submit();
}
};
function CViewerManager(oCV){
this.setCV(oCV);
};
CViewerManager.prototype=new CViewerHelper();
CViewerManager.prototype.Print=function(){
var _332=document.getElementById("CVIFrame"+this.getCVId());
if(_332){
if(isIE()){
_332.contentWindow.document.execCommand("print",true,null);
}else{
_332.focus();
_332.contentWindow.print();
}
}
var cv=this.getCV();
var _334=cv.rvMainWnd;
var _335=_334.getToolbarControl();
if(typeof _335!="undefined"&&_335!=null){
var _336=_335.getItem("print");
if(_336){
_336.setFocus();
}
}
};
CViewerManager.prototype.DownloadReport=function(){
var _337="";
var f=document.forms["formWarpRequest"+this.getCVId()];
_337+="b_action=xts.run&m=portal/download.xts&m_obj=";
_337+=f["ui.object"].value;
_337+="&m_name=";
_337+=f["ui.name"].value;
if(f["ui.format"]&&f["ui.format"].value){
_337+="&format=";
_337+=f["ui.format"].value;
}
_337=constructGETRequestParamsString(_337);
_337=f.action+"?"+_337;
location.href=_337;
};
CViewerManager.prototype.SaveReport=function(_339){
var oCV=this.getCV();
var oReq=new ViewerDispatcherEntry(oCV);
oReq.setWorkingDialog(null);
oReq.addFormField("ui.action","save");
if(!_339){
oReq.addFormField("run.continueConversation","true");
}else{
this.getCV().closeActiveHTTPConnection();
if(oCV.getWorkingDialog()){
oCV.getWorkingDialog().hide();
}
this.getCV().setKeepSessionAlive(true);
oReq.addFormField("run.continueConversation","false");
var _33c=GUtil.generateCallback(executeBackURL,[this.getCV().getId()],null);
oReq.setCallbacks({"complete":{"method":_33c}});
}
oReq.addFormField("run.saveOutput","true");
this.getCV().dispatchRequest(oReq);
};
CViewerManager.prototype.SaveAsReportView=function(_33d){
var _33e=document.getElementById("formWarpRequest"+this.getCVId());
if(_33e){
var _33f=!_33d;
var _340={"m":"portal/viewer-saveAs.xts"};
_340["run.continueConversation"]=_33f;
_340["initializeSave"]="true";
_340["ui.object"]=_33e["ui.object"].value;
_340["ui.backURL"]=_33e["ui.backURL"].value;
_340["ui.routingServerGroup"]=this.getRoutingServerGroup();
cvLoadDialog(this.getCV(),_340,600,425,RV_RES.IDS_JS_SAVE_AS_REPORT_VIEW_IFRAME_TITLE);
}
};
CViewerManager.prototype.init=function(_341){
if(_341&&typeof _341=="object"){
for(var _342 in _341){
this[_342]=_341[_342];
}
}
};
CViewerManager.prototype.SendReport=function(_343){
var _344=!_343;
var _345={"m":"portal/viewer-email.xts"};
_345["run.continueConversation"]=_344;
_345["ui.routingServerGroup"]=this.getRoutingServerGroup();
cvLoadDialog(this.getCV(),_345,800,550,RV_RES.IDS_JS_EMAIL_REPORT_IFRAME_TITLE);
};
CViewerManager.prototype.validatePromptControls=function(){
if(typeof this.getCV().preProcessControlArray!="undefined"&&typeof preProcessForm!="undefined"){
preProcessForm(this.getCV().preProcessControlArray);
}
};
CViewerManager.prototype.RunReport=function(){
this.validatePromptControls();
var oReq=null;
var _347=this.getCV().envParams["ui.object"];
var _348=this.getCV().envParams["ui.spec"];
var _349=this.getCV().envParams["ui.action"];
var _34a=document.forms["formWarpRequest"+this.getCVId()];
if(_348!=null&&_348!=""){
oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","runSpecification");
oReq.addFormField("ui.spec",_348);
var _34b=this.getCV().envParams["specificationType"];
if(_34b!=null){
oReq.addFormField("specificationType",_34b);
}
}else{
if(_347!=null&&_347!=""){
if(this.getCV().isBux){
oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","bux");
}else{
oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","run");
}
if(_349=="view"){
if(this.getCV().envParams["ui.reRunObj"]){
_347=this.getCV().envParams["ui.reRunObj"];
}else{
if(typeof _34a["reRunObj"]!="undefined"&&_34a["reRunObj"]!=null){
_347=_34a["reRunObj"].value;
}
}
}
oReq.addFormField("ui.object",_347);
}
}
oReq.addFormField("run.outputFormat",this.getCV().rvMainWnd.getCurrentFormat());
oReq.addFormField("ui.primaryAction","");
var _34c=this.getCV().envParams["promptOnRerun"];
if(_34c!=null){
oReq.addFormField("run.prompt",_34c);
}else{
oReq.addFormField("run.prompt","true");
}
this.getCV().preparePromptValues(oReq);
this.getCV().dispatchRequest(oReq);
};
CViewerManager.prototype.viewReport=function(_34d){
if(this.getCV().rvMainWnd.getCurrentFormat()==_34d){
return;
}
var f=document.forms["formWarpRequest"+this.getCVId()];
if(f["ui.action"].value=="view"){
this.viewOutput(_34d);
}else{
var oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","render");
oReq.addFormField("run.outputFormat",_34d);
if(this.isExcelFormat(_34d)){
this.viewInExcel(oReq);
}else{
if(this.getCV().isAccessibleMode()&&_34d=="PDF"){
this.viewPDFInNewWindow(oReq);
}else{
if(isSafari()&&_34d=="PDF"){
oReq.addFormField("ui.reuseWindow","true");
this.viewPDFInNewWindow(oReq);
}else{
this.getCV().deleteTabs();
this.getCV().dispatchRequest(oReq);
}
}
}
}
};
CViewerManager.prototype.isExcelFormat=function(_350){
if(_350=="xlsxData"||_350=="XLS"||_350=="CSV"||_350=="XLWA"||_350=="singleXLS"||_350=="spreadsheetML"){
return true;
}
return false;
};
CViewerManager.prototype.viewOutput=function(_351){
var oFWR=document.forms["formWarpRequest"+this.getCVId()];
var oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","view");
oReq.addFormField("cv.responseFormat","view");
oReq.addFormField("ui.format",_351);
var _354="";
switch(_351){
case "HTML":
_354=this.getCV().oOutputFormatPath.HTML;
break;
case "PDF":
_354=this.getCV().oOutputFormatPath.PDF;
break;
case "singleXLS":
_354=this.getCV().oOutputFormatPath.singleXLS;
break;
case "XLS":
_354=this.getCV().oOutputFormatPath.XLS;
break;
case "XLWA":
_354=this.getCV().oOutputFormatPath.XLWA;
break;
case "CSV":
_354=this.getCV().oOutputFormatPath.CSV;
break;
case "XML":
_354=this.getCV().oOutputFormatPath.XML;
break;
case "spreadsheetML":
_354=this.getCV().oOutputFormatPath.spreadsheetML;
break;
case "xlsxData":
_354=this.getCV().oOutputFormatPath.xlsxData;
break;
}
if(_354){
oReq.addFormField("ui.object",_354);
}
oReq.addFormField("reRunObj",oFWR.reRunObj.value);
oReq.addFormField("ui.format",_351);
oReq.addFormField("ui.name",oFWR["ui.name"].value);
if(this.isExcelFormat(_351)){
this.viewInExcel(oReq);
}else{
if(this.getCV().isAccessibleMode()&&_351=="PDF"){
this.viewPDFInNewWindow(oReq);
}else{
if(isSafari()&&_351=="PDF"){
oReq.addFormField("ui.reuseWindow","true");
this.viewPDFInNewWindow(oReq);
}else{
this.getCV().dispatchRequest(oReq);
}
}
}
};
CViewerManager.prototype.viewPDFInNewWindow=function(oReq){
this.viewInNewWindow(oReq,__pdf_win);
};
CViewerManager.prototype.viewInExcel=function(oReq){
this.viewInNewWindow(oReq,__excel_win);
};
CViewerManager.prototype.viewInNewWindow=function(oReq,_358){
var _359=window.onbeforeunload;
window.onbeforeunload=null;
if(_358!=null){
_358.close();
}
var _35a="winNAT_"+(new Date()).getTime();
var _35b=this.getCV().getWebContentRoot()+"/"+"rv/blankNewWin.html?cv.id="+this.getCVId();
var _35c="viewForm"+this.getCVId();
var _35d=document.getElementById(_35c);
if(_35d){
_35d.parentNode.removeChild(_35d);
}
_35d=document.createElement("form");
_35d.setAttribute("method","post");
_35d.setAttribute("id",_35c);
_35d.setAttribute("action",this.getCV().getGateway());
_35d.style.display="inline";
var oFWR=document["formWarpRequest"+this.getCVId()];
if(oFWR&&oFWR["run.outputFormat"]){
oReq.addFormField("previousFormat",oFWR["run.outputFormat"].value);
}
var _35f=oReq.getFormFields().keys();
for(var _360=0;_360<_35f.length;_360++){
var name=_35f[_360];
if(name!="cv.responseFormat"&&name!="b_action"&&name!="m_tracking"){
_35d.appendChild(createHiddenFormField(name,oReq.getFormField(name)));
}
}
_35d.appendChild(createHiddenFormField("cv.responseFormat","page"));
_35d.appendChild(createHiddenFormField("b_action","cognosViewer"));
_35d.appendChild(createHiddenFormField("BIline1",RV_RES.RV_RUNNING));
_35d.appendChild(createHiddenFormField("BIline2",RV_RES.RV_PLEASE_WAIT));
if(this.getCV().envParams["ui.name"]){
_35d.appendChild(createHiddenFormField("ui.name",this.getCV().envParams["ui.name"]));
}
document.body.appendChild(_35d);
_35d.target=_35a;
_358=window.open(_35b,_35a,"rv");
window.onbeforeunload=_359;
};
CViewerManager.prototype.cancel=function(){
var oCV=this.getCV();
oCV.cancel();
};
CViewerManager.prototype.sXmlEncode=function(_363){
var _364=""+_363;
if((_364=="0")||((_363!=null)&&(_363!=false))){
_364=_364.replace(/&/g,"&amp;");
_364=_364.replace(/</g,"&lt;");
_364=_364.replace(/>/g,"&gt;");
_364=_364.replace(/"/g,"&quot;");
_364=_364.replace(/'/g,"&apos;");
}else{
if(_363==null){
_364="";
}
}
return _364;
};
CViewerManager.prototype.exit=function(_365){
var form=document.getElementById("formWarpRequest"+this.getCVId());
var oCV=this.getCV();
if(form&&form["ui.action"]&&form["ui.action"].value=="view"&&_365){
executeBackURL(this.getCVId());
}else{
if(oCV.getKeepSessionAlive()==false){
oCV.exit(_365);
}
}
};
function executeBackURL(_368){
var _369="";
if(_368){
_369=_368;
}
if(window["oCV"+_369]&&window["oCV"+_369].isBux){
return false;
}
var form=document.getElementById("formWarpRequest"+_369);
if(form["ui.backURL"].value.length<2048){
document.location.href=form["ui.backURL"].value;
return;
}
var _36b=decodeURIComponent(form["ui.backURL"].value);
var _36c=_36b.split("?");
var _36d=document.createElement("form");
_36d.style.display="none";
_36d.setAttribute("method","post");
_36d.setAttribute("action",_36c[0]);
_36d.setAttribute("target","_self");
var _36e=_36c[1].split("&");
for(var _36f=0;_36f<_36e.length;_36f++){
var _370=_36e[_36f].indexOf("=");
var _371=_36e[_36f].substr(0,_370);
var _372=_36e[_36f].substr(_370+1);
var _373=document.createElement("input");
_373.setAttribute("type","hidden");
_373.setAttribute("name",decodeURIComponent(_371));
_373.setAttribute("value",decodeURIComponent(_372));
_36d.appendChild(_373);
}
document.body.appendChild(_36d);
_36d.submit();
};
CViewerManager.prototype.getRoutingServerGroup=function(){
var oCV=this.getCV();
if(oCV.envParams["ui.routingServerGroup"]){
return oCV.envParams["ui.routingServerGroup"];
}
return "";
};
CViewerManager.prototype.launchQS=function(){
var _375=document.forms["formWarpRequest"+this.getCVId()];
var oCV=this.getCV();
if(typeof oCV.m_viewerFragment!="undefined"){
cognosLaunchInWindow("","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480","ui.gateway",_375.action,"ui.tool","QueryStudio","ui.action","edit","ui.object",_375["ui.object"].value,"ui.routingServerGroup",this.getRoutingServerGroup());
}else{
cognosLaunch("ui.gateway",_375.action,"ui.tool","QueryStudio","ui.action","edit","ui.object",_375["ui.object"].value,"ui.backURL",_375["ui.backURL"].value,"ui.routingServerGroup",this.getRoutingServerGroup());
}
};
CViewerManager.prototype.launchAS=function(){
var _377=document.forms["formWarpRequest"+this.getCVId()];
cognosLaunchInWindow("","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480","ui.gateway",_377.action,"ui.tool","AnalysisStudio","ui.action","edit","ui.object",_377["ui.object"].value,"ui.routingServerGroup",this.getRoutingServerGroup());
};
CViewerManager.prototype.launchRS=function(){
var _378=document.forms["formWarpRequest"+this.getCVId()];
cognosLaunchInWindow("_blank","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480","ui.gateway",_378.action,"ui.tool","ReportStudio","ui.action","edit","ui.profile","Professional","ui.object",_378["ui.object"].value,"ui.routingServerGroup",this.getRoutingServerGroup());
};
CViewerManager.prototype.returnHome=function(url){
var _37a=document.forms["formWarpRequest"+this.getCVId()];
_37a["ui.backURL"].value=url;
executeBackURL(this.getCVId());
};
CViewerManager.prototype.doPostBack=function(){
var f=document.forms["formWarpRequest"+this.getCVId()];
f.appendChild(createHiddenFormField("b_action","xts.run"));
f.appendChild(createHiddenFormField("m",f["ui.postBack"].value));
f.submit();
};
CViewerManager.prototype.hideAbout=function(){
this.getCV().removeTransparentBackgroundLayer();
var cvId=this.getCV().getId();
if(document.getElementById("viewerAboutDiv"+cvId)){
document.getElementById("viewerAboutDiv"+cvId).parentNode.removeChild(document.getElementById("viewerAboutDiv"+cvId));
}
if(document.getElementById("viewerAboutIframe"+cvId)){
document.getElementById("viewerAboutIframe"+cvId).parentNode.removeChild(document.getElementById("viewerAboutIframe"+cvId));
}
};
function viewerAboutOnKeyDown(evt){
evt=(evt)?evt:((event)?event:null);
var _37e=getCrossBrowserNode(evt);
if(evt.keyCode=="13"||evt.keyCode=="27"||evt.keyCode=="32"){
var oCV=window["oCV"+_37e.getAttribute("viewerId")];
oCV.m_oCVMgr.hideAbout();
return stopEventBubble(evt);
}
};
CViewerManager.prototype.fileExist=function(_380){
var http=null;
if(window.XMLHttpRequest){
http=new XMLHttpRequest();
}else{
http=new ActiveXObject("Msxml2.XMLHTTP");
}
http.open("HEAD",_380,false);
http.send();
return (http.status==200);
};
CViewerManager.prototype.getAboutBoxImageURL=function(){
var _382="about_"+this.getCV().getProductLocale()+".jpg";
var _383=this.getCV().getWebContentRoot()+"/rv/images/";
var _384=_383+_382;
if(!this.fileExist(_384)){
_384=_383+"about_en.jpg";
}
return _384;
};
CViewerManager.prototype.about=function(){
if(document.getElementById("viewerAbout"+this.getCV().getId())){
this.hideAbout();
}
this.getCV().createTransparentBackgroundLayer();
var _385=650;
var _386=522;
var _387=document.createElement("iframe");
_387.id="viewerAboutIframe"+this.getCV().getId();
_387.style.position="absolute";
_387.style.zIndex=99;
_387.style.width=_385+"px";
_387.style.height=_386+"px";
_387.setAttribute("src",this.getCV().getWebContentRoot()+"/common/blank.html");
_387.setAttribute("scrolling","no");
_387.setAttribute("frameborder","0");
_387.setAttribute("title",RV_RES.IDS_JS_MODAL_BACK_IFRAME);
_387.setAttribute("role","presentation");
document.body.appendChild(_387);
var id=this.getCV().getId();
var _389=document.createElement("div");
_389.tabIndex=0;
_389.onfocus=function(){
document.getElementById("viewerAboutOK"+id).focus();
};
document.body.appendChild(_389);
var div=document.createElement("div");
div.id="viewerAboutDiv"+this.getCV().getId();
div.style.position="absolute";
div.onkeydown=viewerAboutOnKeyDown;
div.style.zIndex=100;
div.style.width=_385+"px";
div.style.height=_386+"px";
div.style.outline="none";
div.setAttribute("role","dialog");
div.setAttribute("aria-label",RV_RES.RV_ABOUT_DESCRIPTION);
var _38b=this.getAboutBoxImageURL();
var _38c=RV_RES.RV_ABOUT_DESCRIPTION.replace(/"/g,"&quot;")+RV_RES.IDS_PROP_LEGAL.replace(/"/g,"&quot;");
div.innerHTML="<img role=\"img\" id=\"viewerAbout"+this.getCV().getId()+"\" tabIndex=\"0\" alt=\""+_38c+"\" title=\""+_38c+"\" src=\""+_38b+"\" onclick=\""+getCognosViewerObjectString(this.getCV().getId())+".m_oCVMgr.hideAbout()\"></img>";
div.setAttribute("viewerId",this.getCV().getId());
document.body.appendChild(div);
this.createOKButton(div);
var _38d=document.createElement("div");
_38d.tabIndex=0;
_38d.onfocus=function(){
document.getElementById("viewerAbout"+id).focus();
};
document.body.appendChild(_38d);
var _38e=0;
var _38f=0;
if(typeof window.innerHeight!="undefined"){
_38e=Math.round((window.innerHeight/2)-(_386/2));
_38f=Math.round((window.innerWidth/2)-(_385/2));
}else{
_38e=Math.round((document.body.clientHeight/2)-(_386/2));
_38f=Math.round((document.body.clientWidth/2)-(_385/2));
}
div.style.bottom=_387.style.bottom=_38e+"px";
div.style.left=_387.style.left=_38f+"px";
setTimeout("document.getElementById('viewerAbout"+id+"').focus();",1);
};
CViewerManager.prototype.createOKButton=function(_390){
var _391=document.createElement("div");
_391.style.backgroundcolor="#FFFFFF";
_391.id="viewerAboutOK"+this.getCV().getId();
_391.setAttribute("role","button");
_391.setAttribute("viewerId",this.getCV().getId());
_391.setAttribute("tabIndex","0");
var _392=this;
_391.onclick=function(){
_392.hideAbout();
};
_391.onkeydown=viewerAboutOnKeyDown;
_391.className="aboutOkButton";
_390.appendChild(_391);
var span=document.createElement("span");
span.style.padding="7px 30px 7px 30px";
span.appendChild(document.createTextNode(RV_RES.IDS_JS_OK));
_391.appendChild(span);
};
CViewerManager.prototype.updateUserName=function(){
var _394=new DataDispatcherEntry(this.getCV());
_394.addFormField("ui.action","CMRequest");
_394.addFormField("CMRequest","<CMRequest><searchPath>~</searchPath><properties><property>defaultName</property></properties></CMRequest>");
_394.addFormField("cv.responseFormat","CMRequest");
_394.addFormField("cv.catchLogOnFault","true");
_394.addFormField("cv.id",this.getCVId());
_394.setCallbacks({"complete":{"object":this,"method":this.updateUserNameCallback}});
_394.setCanBeQueued(true);
this.getCV().dispatchRequest(_394);
};
CViewerManager.prototype.updateUserNameCallback=function(_395){
var _396=this.getUserNameFromResponse(_395);
if(_396!=null){
var _397="userNameTD"+this.getCVId();
var _398=document.getElementById(_397);
if(_398!=null){
_398.innerHTML=html_encode(_396);
}
var _399=this.getCV().rvMainWnd.getBannerToolbar();
if(_399){
for(var _39a=0;_39a<_399.getNumItems();_39a++){
if(typeof _399.get(_39a).getId=="function"&&_399.get(_39a).getId()==_397){
_399.get(_39a).setText(html_encode(_396));
break;
}
}
}
}
};
CViewerManager.prototype.getUserNameFromResponse=function(_39b){
if(_39b){
var _39c=XMLBuilderLoadXMLFromString(_39b.getResult());
var _39d=XMLHelper_FindChildByTagName(_39c,"defaultName",true);
if(_39d!=null){
var _39e=XMLHelper_FindChildByTagName(_39d,"value",false);
if(_39e!=null){
return XMLHelper_GetText(_39e);
}
}
}
return null;
};
CViewerManager.prototype.getAvailableOutput=function(){
var oCV=this.getCV();
var _3a0=document.getElementById("formWarpRequest"+this.getCVId());
var _3a1=new JSONDispatcherEntry(this.getCV());
_3a1.addFormField("ui.action","getAvailableOutputs");
_3a1.addFormField("cv.responseFormat","getAvailableOutputs");
_3a1.addFormField("ui.object",_3a0["ui.object"].value);
_3a1.addFormField("ui.reportVersion",_3a0["ui.reportVersion"].value);
_3a1.addFormField("reRunObj",_3a0["reRunObj"].value);
_3a1.addFormField("ui.outputLocale",_3a0["ui.outputLocale"].value);
_3a1.addFormField("ui.burstKey",_3a0["ui.burstKey"].value);
_3a1.addFormField("cv.id",this.getCVId());
_3a1.setCallbacks({"complete":{"object":this,"method":this.getAvailableOutputResponseCallback}});
oCV.dispatchRequest(_3a1);
};
CViewerManager.prototype.getAvailableOutputResponseCallback=function(_3a2){
var oCV=this.getCV();
oCV.init(_3a2.getJSONResponseObject());
oCV.rvMainWnd.renderAvailableOutputs();
};
CViewerManager.prototype.authenticate=function(_3a4,url){
this.exit();
this.getCV().setKeepSessionAlive(true);
if(window.delCookie){
delCookie("cc_state");
}
if(_3a4=="logon"||_3a4=="relogon"){
location.href=url+"&h_CAM_action=logon&m_reload=";
}
if(_3a4=="logoff"){
location.href=url+"&h_CAM_action=logoff";
}
};
CViewerManager.prototype.launchNewGeneral=function(_3a6,_3a7){
var _3a8=document.getElementById("formWarpRequest"+this.getCVId());
if(_3a8){
var _3a9="";
if(_3a8["reRunObj"]){
_3a9=_3a8["reRunObj"].value;
}else{
_3a9=_3a8["ui.object"].value;
}
var _3aa=this.getCV().getGateway()+"?"+constructGETRequestParamsString("b_action=xts.run&m=portal/viewer-closeIframe.xts&cv.id="+this.getCVId());
var _3ab={"m":"portal/new_general.xts","m_new_class":_3a6,"so.searchPath":_3a7,"m_name":this.getCV().envParams["ui.name"],"m_obj_searchPath":_3a9,"m_obj":_3a9};
_3ab["ui.backURL"]=_3aa;
cvLoadDialog(this.getCV(),_3ab,500,425,RV_RES.IDS_JS_ADD_TO_MY_FOLDERS_IFRAME_TITLE);
}
};
CViewerManager.prototype.addToBookmarks=function(){
var _3ac=document.getElementById("formWarpRequest"+this.getCVId());
var _3ad=this.getCV().envParams;
var _3ae="b_action=cognosViewer";
for(var _3af in _3ad){
if(_3af.indexOf("ui.")==0&&_3af!="ui.primaryAction"&&_3af!="ui.backURL"&&_3ad!="ui.spec"&&_3af!="ui.conversation"&&_3af!="ui.cafcontextid"){
_3ae+="&"+_3af+"=";
if(_3af=="ui.action"&&_3ad["ui.primaryAction"]!=""){
_3ae+=encodeURIComponent(_3ad["ui.primaryAction"]);
}else{
_3ae+=encodeURIComponent(_3ad[_3af]);
}
}
if(_3af.indexOf("run.")==0){
_3ae+="&"+_3af+"="+encodeURIComponent(_3ad[_3af]);
}
}
var sURL=this.getCV().sGateway+"?"+constructGETRequestParamsString(_3ae);
var _3b1="";
if(_3ac["ui.action"].value=="view"){
if(typeof _3ad["versionName"]!="undefined"&&_3ad["versionName"]!=""){
_3b1=RV_RES.RV_VIEW_REPORT;
}else{
_3b1=RV_RES.RV_VIEW_RECENT_REPORT;
}
}
if(_3ac["ui.action"].value=="run"){
_3b1=RV_RES.RV_RUN_REPORT;
}
if(_3b1!=""){
_3b1+=" - ";
}
_3b1+=_3ad["ui.name"];
window.external.AddFavorite(sURL,_3b1);
};
function leavingRV(){
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
for(var _3b2=0;_3b2<window.gaRV_INSTANCES.length;_3b2++){
try{
var oCV=window.gaRV_INSTANCES[_3b2];
if(oCV){
var oRV=oCV.getRV();
if(oRV){
oRV.exit();
}
}
}
catch(e){
}
}
}
};
function viewerMainKeyPress(evt){
evt=(evt)?evt:((event)?event:null);
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
for(var _3b6=0;_3b6<window.gaRV_INSTANCES.length;_3b6++){
try{
var oCV=window.gaRV_INSTANCES[_3b6];
if(oCV&&oCV.getId()=="_NS_"){
var _3b8=evt.keyCode;
if(_3b8==0&&typeof evt.charCode!="undefined"){
_3b8=evt.charCode;
}
if(!oCV.getViewerWidget()&&(_3b8=="64"||_3b8=="50")&&evt.shiftKey==true&&evt.ctrlKey==true){
var _3b9=document.getElementById("RVContent"+oCV.getId());
if(_3b9){
_3b9.setAttribute("tabIndex","-1");
_3b9.focus();
return stopEventBubble(evt);
}
}else{
if(!oCV.getViewerWidget()&&(_3b8=="78"||_3b8=="110")&&evt.shiftKey==true&&evt.ctrlKey==true){
var _3ba=document.getElementById("CVNavLinks"+oCV.getId());
if(_3ba){
_3ba.setAttribute("tabIndex","-1");
_3ba.focus();
return stopEventBubble(evt);
}
}
}
}
}
catch(e){
}
}
}
};
var g_ViewerResizeTimer=0;
function onResizeViewerEvent(evt){
clearTimeout(g_ViewerResizeTimer);
g_ViewerResizeTimer=setTimeout(resizePinnedContainers,200);
};
function constructGETRequestParamsString(_3bc){
if(typeof CAFXSSEncode=="function"){
if(_3bc.indexOf("?")>=0){
var _3bd=_3bc.split("?");
return _3bd[0]+"?"+CAFXSSEncode(_3bd[_3bd.length-1]);
}
return CAFXSSEncode(_3bc);
}else{
return _3bc;
}
};
function sortReportHistoryStackDescending(a,b){
return (b.getIdx()-a.getIdx());
};
function sortReportHistoryStackAscending(a,b){
return (b.getIdx()-a.getIdx());
};
gToolbarButtonStyle=new CUIStyle("toolbarButton","toolbarButtonOver","toolbarButtonPressed","toolbarButtonOverPressed","toolbarButton");
gToolbarStyle=new CUIStyle("mainViewerHeader3","","","","");
gBannerButtonStyle=new CUIStyle("bannerToolbarButton","bannerToolbarButtonOver","","","");
gBannerToolbarStyle=new CUIStyle("bannerButtonContainer","","","","");
gMenuItemStyle=new CUIStyle("menuItem_normal","menuItem_hover","","","menuItem_disabled");
gMenuStyle=new CUIStyle("clsMenu","","","","");
gMenuSeperatorStyle=new CUIStyle("menuHorizontalSeperator","","","","");
gBannerItemStyle=new CUIStyle("bannerMenuItem","bannerMenuItemOver","","","");
gBannerStaticText=new CUIStyle("bannerText","","","","");
gBannerLink=new CUIStyle("bannerLink","bannerLink","","","");
gMenuSeperator=new CSeperator("horizontal_line","1",gMenuSeperatorStyle);
gToolbarSeperator=new CSeperator("horizonal_blank","5");
function CMainWnd(oCV){
this.setCV(oCV);
this.m_contextMenu=null;
this.m_reportHistoryList=[];
this.m_currentFormat="";
this.m_toolbar=null;
this.m_bannerToolbar=null;
this.m_browserHistoryIndex=history.length;
this.m_showContextMenuOnClick=false;
if(oCV.getConfig&&oCV.getConfig()){
var _3c3=oCV.getConfig().getEventsConfig();
this.m_showContextMenuOnClick=_3c3?_3c3.getShowContextMenuOnClick():false;
}
};
CMainWnd.prototype=new CViewerHelper();
CMainWnd.prototype.setBannerToolbar=function(_3c4){
this.m_bannerToolbar=new CViewerToolbar();
this.m_bannerToolbar.init(_3c4);
};
CMainWnd.prototype.getBannerToolbar=function(){
if(this.m_bannerToolbar){
return this.m_bannerToolbar.getCBar();
}
return null;
};
CMainWnd.prototype.closeContextMenuAndToolbarMenus=function(){
var _3c5=this.getToolbar();
if(_3c5){
_3c5.closeMenus();
}
var cm=this.getContextMenu();
if(cm){
cm.m_contextMenu.remove();
}
};
CMainWnd.prototype.setToolbar=function(_3c7){
this.m_toolbar=new CViewerToolbar();
this.m_toolbar.init(_3c7);
};
CMainWnd.prototype.getToolbar=function(){
if(this.m_toolbar){
return this.m_toolbar.getCBar();
}
return null;
};
CMainWnd.prototype.getToolbarControl=function(){
return this.m_toolbar;
};
CMainWnd.prototype.setCurrentFormat=function(_3c8){
this.m_currentFormat=_3c8;
};
CMainWnd.prototype.updateToolbar=function(_3c9){
this.updateCurrentFormat(_3c9,this.getCV().getWebContentRoot());
this.updateKeepThisVersion();
};
CMainWnd.prototype.updateKeepThisVersion=function(){
if(this.getCV().getStatus()=="complete"){
var _3ca=this.getCV().getSecondaryRequests();
var _3cb=false;
var _3cc=false;
var _3cd=false;
if(_3ca){
for(var _3ce=0;_3ce<_3ca.length;_3ce++){
switch(_3ca[_3ce]){
case "save":
_3cb=true;
break;
case "saveAs":
_3cc=true;
break;
case "email":
_3cd=true;
break;
}
}
}
var _3cf=this.getToolbarControl();
if(_3cf){
var _3d0=_3cf.getItem("keepThisVersion");
if(_3d0){
if(!_3cb&&!_3cc&&!_3cd){
_3d0.hide();
}else{
_3d0.show();
}
var _3d1=_3d0.getMenu();
if(_3cb||_3cc||_3cd){
if(_3d1){
var _3d2=_3d1.getItem("saveReport");
if(_3d2){
if(_3cb){
_3d2.show();
}else{
_3d2.hide();
}
}
var _3d3=_3d1.getItem("saveAsReportView");
if(_3d3){
if(_3cc){
_3d3.show();
}else{
_3d3.hide();
}
}
var _3d4=_3d1.getItem("emailReport");
if(_3d4){
if(_3cd){
_3d4.show();
}else{
_3d4.hide();
}
}
}
}
}
}
}
};
function CMainWnd_updateCurrentFormat(_3d5,_3d6){
var _3d7="";
var _3d8="";
switch(_3d5){
case "HTML":
case "HTMLFragment":
case "XHTMLFRGMT":
_3d7=_3d6+"/rv/images/action_view_html.gif";
_3d8=RV_RES.RV_VIEW_HTML;
break;
case "PDF":
_3d7=_3d6+"/rv/images/action_view_pdf.gif";
_3d8=RV_RES.RV_VIEW_PDF;
break;
case "XML":
_3d7=_3d6+"/rv/images/action_view_xml.gif";
_3d8=RV_RES.RV_VIEW_XML;
break;
}
if(_3d7!=""&&_3d8!=""){
var _3d9=this.getToolbarControl();
if(_3d9){
var _3da=this.getCV().envParams["ui.action"]=="view";
var _3db=null;
if(_3da){
_3db=_3d9.getItem("viewIn");
}else{
_3db=_3d9.getItem("runIn");
}
if(_3db){
_3db.setIcon(_3d7);
_3db.setToolTip(_3d8);
var sRV=this.getCVObjectRef()+".getRV().";
_3db.setAction("javascript:"+sRV+"viewReport('"+_3d5+"');");
}
}
}
this.setCurrentFormat(_3d5);
};
CMainWnd.prototype.getCurrentFormat=function(){
return this.m_currentFormat;
};
function CMainWnd_getSelectionController(){
var _3dd;
try{
_3dd=getCognosViewerSCObjectRef(this.getCV().getId());
}
catch(e){
_3dd=null;
}
return _3dd;
};
var g_oPressTimer=null;
var g_bLongPressDetected=false;
var g_oPreviousValues={};
if(window.attachEvent){
window.attachEvent("onmouseout",f_cancelLongTouch);
window.attachEvent("ontouchstart",onTouchStart);
window.attachEvent("ontouchend",f_cancelLongTouch);
window.attachEvent("ontouchleave",f_cancelLongTouch);
window.attachEvent("ontouchcancel",f_cancelLongTouch);
}else{
if(window.addEventListener){
window.addEventListener("mouseout",f_cancelLongTouch);
window.addEventListener("touchstart",onTouchStart);
window.addEventListener("touchend",f_cancelLongTouch);
window.addEventListener("touchleave",f_cancelLongTouch);
window.addEventListener("touchcancel",f_cancelLongTouch);
}
}
function f_cancelLongTouch(evt){
if(isIOS()){
if(g_oPressTimer!==null){
clearTimeout(g_oPressTimer);
g_oPressTimer=null;
}
}
};
function onTouchStart(evt){
if(isIOS()){
g_bLongPressDetected=false;
g_oPressTimer=setTimeout(function(){
var node=getNodeFromEvent(evt);
g_oPreviousValues.webkitTouchCallout=node.style.getPropertyValue("webkitTouchCallout");
g_oPreviousValues.webkitUserSelect=node.style.getPropertyValue("webkitUserSelect");
node.style.webkitTouchCallout="None";
node.style.webkitUserSelect="None";
g_bLongPressDetected=true;
},1500);
}
return false;
};
function CMainWnd_pageClicked(evt){
var oCV=this.getCV();
f_cancelLongTouch(evt);
if(this.m_showContextMenuOnClick||(isIOS()&&g_bLongPressDetected)){
var node=getNodeFromEvent(evt);
if(node&&typeof node.onclick!="function"&&(node.nodeName.toLowerCase()!="span"||typeof node.parentNode.onclick!="function")){
oCV.dcm(evt,true);
if(isIOS()&&g_bLongPressDetected){
node.style.webkitTouchCallout=g_oPreviousValues.webkitTouchCallout;
node.style.webkitUserSelect=g_oPreviousValues.webkitUserSelect;
}
return stopEventBubble(evt);
}
}
this.hideOpenMenus();
if(oCV!=null){
if(typeof oCV.sortColumn=="undefined"||!oCV.sortColumn(evt)){
var _3e4=oCV.getDrillMgr();
if(_3e4){
var _3e5=_3e4.singleClickDrillEvent(evt,"RV");
}
}
}
if(oCV.getViewerWidget()){
oCV.getViewerWidget().updateToolbar();
}
setNodeFocus(evt);
if(_3e5){
return stopEventBubble(evt);
}
};
function CMainWnd_hideOpenMenus(){
var cm=this.getContextMenu();
if(typeof cm!="undefined"&&cm!=null){
cm.hide();
}
var tb=this.getToolbar();
if(typeof tb!="undefined"&&tb!=null){
tb.closeMenus();
}
var _3e8=this.getBannerToolbar();
if(_3e8!="undefined"&&_3e8!=null){
_3e8.closeMenus();
}
};
function CMainWnd_draw(){
var _3e9=this.getToolbar();
if(_3e9&&this.m_uiBlackList.indexOf(" RV_TOOLBAR_BUTTONS ")){
var _3ea="";
var f=document.forms["formWarpRequest"+this.getCVId()];
if(f["run.outputFormat"]&&f["run.outputFormat"].value){
_3ea=f["run.outputFormat"].value;
}else{
if(f["ui.format"]&&f["ui.format"].value){
_3ea=f["ui.format"].value;
}
}
if(_3ea!=""){
this.updateCurrentFormat(_3ea,this.getCV().getWebContentRoot());
}
_3e9.draw();
}
var _3ec=this.getBannerToolbar();
if(_3ec){
_3ec.draw();
}
};
function CMainWnd_addToReportHistory(_3ed){
this.m_reportHistoryList[this.m_reportHistoryList.length]=_3ed;
};
function CMainWnd_getReportHistory(){
return this.m_reportHistoryList;
};
function CMainWnd_getContextMenu(){
return this.m_contextMenu;
};
function CMainWnd_displayContextMenu(evt,_3ef){
if(!this.getCV().bEnableContextMenu){
return false;
}
evt=(evt)?evt:((event)?event:null);
var _3f0=this.getSelectionController();
if(_3f0!=null){
var cm=this.getContextMenu();
if(_3ef&&this.getCV().bCanUseCognosViewerSelection==true){
if(!_3f0.pageContextClicked(evt)){
if(typeof cm!="undefined"&&cm!=null){
cm.m_contextMenu.remove();
}
return false;
}
}
cm=this.getContextMenu();
if(typeof cm!="undefined"&&cm!=null){
cm.draw(evt);
if(!isIE()){
cm.m_contextMenu.m_focusCell=getNodeFromEvent(evt);
}
}
var tb=this.getToolbar();
if(typeof tb!="undefined"&&tb!=null){
tb.closeMenus();
}
var _3f3=this.getBannerToolbar();
if(_3f3!="undefined"&&_3f3!=null){
_3f3.closeMenus();
}
}
};
function CMainWnd_getReportHistoryLength(){
return this.m_reportHistoryList.length;
};
function CMainWnd_executePreviousReport(_3f4){
if(_3f4==-1){
_3f4=this.getReportHistoryLength()-1;
}
for(var i=0;i<this.getReportHistoryLength();++i){
var _3f6=this.m_reportHistoryList[i];
if(_3f6.getIdx()==_3f4){
_3f6.execute();
return;
}
}
};
function CMainWnd_getReportHistoryConversations(){
var _3f7=[];
var _3f8=this.getReportHistory();
for(var _3f9=0;_3f9<_3f8.length;++_3f9){
var _3fa=_3f8[_3f9];
var _3fb=_3fa.getTrackingInfo();
if(_3fb!=""){
_3f7.push(_3fb);
}
}
return _3f7;
};
function CMainWnd_getUIHide(){
return this.m_uiBlackList;
};
CMainWnd.prototype.loadPreviousReports=function(){
var _3fc=this.getCV().envParams["cv.previousReports"];
if(typeof _3fc!="undefined"&&_3fc!=null){
var _3fd=XMLBuilderLoadXMLFromString(_3fc);
var _3fe=XMLHelper_GetFirstChildElement(_3fd);
if(XMLHelper_GetLocalName(_3fe)=="previousReports"){
var _3ff=_3fe.childNodes;
for(var _400=0;_400<_3ff.length;++_400){
var _401=_3ff[_400];
var _402=_401.childNodes;
var _403="";
var _404={};
for(var _405=0;_405<_402.length;++_405){
var _406=_402[_405].getAttribute("name");
switch(_406){
case "ui.name":
_403=XMLHelper_GetText(_402[_405]);
break;
default:
_404[_406]=XMLHelper_GetText(_402[_405]);
break;
}
}
this.addToReportHistory(new CReportHistory(this,_400,_403,_404));
}
}
}
};
CMainWnd.prototype.init=function(){
this.m_uiBlackList="";
if(typeof this.getCV().UIBlacklist=="string"){
this.m_uiBlackList=this.getCV().UIBlacklist;
}
if((typeof gCognosViewer!="undefined")&&(gCognosViewer.envParams["isTitan"])&&(gCognosViewer.envParams["isTitan"]==true)){
gMenuItemStyle=new CUIStyle("titanui menuItem_normal","titanui menuItem_hover","","","titanui menuItem_disabled");
}
this.m_contextMenu=null;
if(this.getCV().bEnableContextMenu&&typeof CContextMenu!="undefined"&&this.m_uiBlackList.indexOf(" RV_CONTEXT_MENU ")==-1){
this.m_contextMenu=new CContextMenu(this);
}
this.loadPreviousReports();
gMenuSeperator.setWebContentRoot(this.getCV().getWebContentRoot());
gToolbarSeperator.setWebContentRoot(this.getCV().getWebContentRoot());
};
CMainWnd.prototype.renderPreviousReports=function(){
var _407=this.getToolbarControl();
var _408=_407.getItem("previousReport");
var _409=this.getCV().getWebContentRoot();
var _40a=this.getCV().getSkin();
if(_408){
var _40b=_408.getMenu();
var _40c=this.getReportHistory();
for(var _40d=0;_40d<_40c.length;++_40d){
var _40e=_40c[_40d];
new CMenuItem(_40b,_40e.getReportName(),"javascript:"+this.getCV().getObjectId()+".rvMainWnd.executePreviousReport("+_40d+");",_409+_40e.getDropDownMenuIcon(),gMenuItemStyle,_409,_40a);
}
_40b.draw();
}
};
function CMainWnd_update(_40f){
if(typeof _40f=="undefined"||_40f===null){
return;
}
if(_40f instanceof CSelectionController){
var _410=this.getToolbarControl();
if(typeof _410!="undefined"&&_410!=null){
var _411=this.getCV().getDrillMgr();
if(_411){
var _412=_410.getItem("goto");
if(_412){
var menu=_412.getMenu();
if(menu){
menu.clear();
}
}
var _414=_410.getItem("drillDown");
if(_414){
if(_411.canDrillDown()){
_414.enable();
}else{
_414.disable();
}
}
var _415=_410.getItem("drillUp");
if(_415){
if(_411.canDrillUp()){
_415.enable();
}else{
_415.disable();
}
}
}
var _416=_410.getItem("lineage");
if(_416){
var _417=_40f.getAllSelectedObjects();
if(_417!=null&&_417.length>0){
_416.enable();
}else{
_416.disable();
}
}
}
var _418=this.getContextMenu();
if(typeof _418!="undefined"&&_418!=null){
_418.update(_40f);
}
}
};
function CMainWnd_addDrillTargets(_419){
this.m_oCV.addDrillTargets(_419);
};
function CMainWnd_getDrillTargets(){
return this.m_oCV.getDrillTargets();
};
function CMainWnd_getDrillTarget(idx){
return this.m_oCV.getDrillTarget(idx);
};
function CMainWnd_getNumberOfDrillTargets(){
return this.m_oCV.getNumberOfDrillTargets();
};
CMainWnd.prototype.renderAvailableOutputs=function(){
var _41b=this.getCVObjectRef()+".getRV().";
var oCV=this.getCV();
var _41d=this.getToolbarControl();
var _41e=this.getUIHide();
var _41f=oCV.getWebContentRoot();
var _420=oCV.getSkin();
var _421=null;
var _422=null;
if(typeof _41d!="undefined"&&_41d!=null){
_421=_41d.getItem("viewIn");
if(_421){
_422=_421.getMenu();
}
}
if(_422.getNumItems()==0){
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_HTML ")==-1){
this.m_viewInHtmlButton=new CMenuItem(_422,RV_RES.RV_VIEW_HTML,"javascript:"+_41b+"viewReport('HTML');",_41f+"/rv/images/action_view_html.gif",gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.HTML==""){
this.m_viewInHtmlButton.disable();
}
}
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_PDF ")==-1){
this.m_viewInPDFButton=new CMenuItem(_422,RV_RES.RV_VIEW_PDF,"javascript:"+_41b+"viewReport('PDF');",_41f+"/rv/images/action_view_pdf.gif",gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.PDF==""){
this.m_viewInPDFButton.disable();
}
}
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_XML ")==-1){
this.m_viewInXMLButton=new CMenuItem(_422,RV_RES.RV_VIEW_XML,"javascript:"+_41b+"viewReport('XML');",_41f+"/rv/images/action_view_xml.gif",gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.XML==""){
this.m_viewInXMLButton.disable();
}
}
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_XLS ")==-1){
this.m_viewInXLSButton=new CMenuItem(_422,RV_RES.RV_VIEW_OPTIONS,"",_41f+"/rv/images/action_view_excel_options.gif",gMenuItemStyle,_41f,_420);
this.excelFormatCascadedMenu=this.m_viewInXLSButton.createCascadedMenu(gMenuStyle,RV_RES.RV_VIEW_OPTIONS);
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_XLS_SPREADSHEETML_DATA ")==-1){
this.viewInSpreadsheetMLDataMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_SPREADSHEETML_DATA,"javascript:"+_41b+"viewReport('xlsxData');",_41f+"/rv/images/action_view_excel_2007.gif",gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.xlsxData==""){
this.viewInSpreadsheetMLDataMenuItem.disable();
}
}
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_XLS_SPREADSHEETML ")==-1){
this.viewInSpreadsheetMLMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_SPREADSHEETML,"javascript:"+_41b+"viewReport('spreadsheetML');",_41f+"/rv/images/action_view_excel_2007.gif",gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.spreadsheetML==""){
this.viewInSpreadsheetMLMenuItem.disable();
}
}
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_XLS_XLWA ")==-1){
this.viewInXLSWebArchiveMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_XLWA,"javascript:"+_41b+"viewReport('XLWA');",_41f+"/rv/images/action_view_excel_2002.gif",gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.XLWA==""){
this.viewInXLSWebArchiveMenuItem.disable();
}
}
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_XLS_SINGLEXLS ")==-1){
this.viewInSingleXLSMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_SINGLE_EXCEL,"javascript:"+_41b+"viewReport('singleXLS');",_41f+"/rv/images/action_view_excel_options.gif",gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.singleXLS==""){
this.viewInSingleXLSMenuItem.disable();
}
}
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_XLS_XLS ")==-1){
this.viewInSingleXLSMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_EXCEL,"javascript:"+_41b+"viewReport('XLS');",_41f+"/rv/images/action_view_excel_2000.gif",gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.XLS==""){
this.viewInSingleXLSMenuItem.disable();
}
}
if(_41e.indexOf(" RV_TOOLBAR_BUTTONS_XLS_CSV ")==-1){
var _423="";
if(getViewerDirection()=="rtl"){
_423="/rv/images/action_view_csv_rtl.gif";
}else{
_423="/rv/images/action_view_csv.gif";
}
this.viewInCSVMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_CSV,"javascript:"+_41b+"viewReport('CSV');",_41f+_423,gMenuItemStyle,_41f,_420);
if(oCV.oOutputFormatPath.CSV==""){
this.viewInCSVMenuItem.disable();
}
}
}
}
_422.draw();
if(_422.isVisible()){
_422.show();
}
};
CMainWnd.prototype.saveReportHistoryAsXML=function(){
var _424="";
var _425=this.getReportHistory();
if(_425.length>0){
var _426=self.XMLBuilderCreateXMLDocument("previousReports");
var _427=0;
if(_425.length>20){
_427=_425.length-20;
}
for(var _428=_427;_428<_425.length;++_428){
_425[_428].saveAsXML(_426.documentElement);
}
_424=XMLBuilderSerializeNode(_426);
}
return _424;
};
CMainWnd.prototype.addCurrentReportToReportHistory=function(){
var oCV=this.getCV();
var _42a={};
var _42b=oCV.envParams["ui.name"];
var _42c=oCV.envParams["ui.action"];
if(_42c=="view"){
_42a["ui.action"]="view";
_42a["ui.format"]=oCV.envParams["ui.format"];
}else{
_42a["ui.action"]="currentPage";
_42a["ui.conversation"]=oCV.getConversation();
_42a["m_tracking"]=oCV.getTracking();
_42a["run.outputFormat"]=oCV.envParams["run.outputFormat"];
if(oCV.envParams["rapReportInfo"]){
_42a["rapReportInfo"]=oCV.envParams["rapReportInfo"];
}
if(oCV.envParams.limitedInteractiveMode){
_42a.limitedInteractiveMode=oCV.envParams.limitedInteractiveMode;
}
if(oCV.envParams["ui.spec"]){
_42a["ui.spec"]=oCV.envParams["ui.spec"];
}
if(oCV.envParams.uiSpecAddedFromRun){
_42a.uiSpecAddedFromRun=oCV.envParams.uiSpecAddedFromRun;
}
}
if(typeof oCV.envParams["ui.object"]!="undefined"){
_42a["ui.object"]=oCV.envParams["ui.object"];
}else{
_42a["ui.spec"]=oCV.envParams["ui.spec"];
_42a["ui.object"]="";
}
_42a["ui.primaryAction"]=oCV.envParams["ui.primaryAction"];
if(oCV.envParams["ui.routingServerGroup"]){
_42a["ui.routingServerGroup"]=oCV.envParams["ui.routingServerGroup"];
}
this.addToReportHistory(new CReportHistory(this,this.m_reportHistoryList.length,_42b,_42a));
};
CMainWnd.prototype.draw=CMainWnd_draw;
CMainWnd.prototype.addDrillTargets=CMainWnd_addDrillTargets;
CMainWnd.prototype.getDrillTarget=CMainWnd_getDrillTarget;
CMainWnd.prototype.getDrillTargets=CMainWnd_getDrillTargets;
CMainWnd.prototype.getNumberOfDrillTargets=CMainWnd_getNumberOfDrillTargets;
CMainWnd.prototype.addToReportHistory=CMainWnd_addToReportHistory;
CMainWnd.prototype.getReportHistoryLength=CMainWnd_getReportHistoryLength;
CMainWnd.prototype.getReportHistory=CMainWnd_getReportHistory;
CMainWnd.prototype.executePreviousReport=CMainWnd_executePreviousReport;
CMainWnd.prototype.getContextMenu=CMainWnd_getContextMenu;
CMainWnd.prototype.displayContextMenu=CMainWnd_displayContextMenu;
CMainWnd.prototype.hideOpenMenus=CMainWnd_hideOpenMenus;
CMainWnd.prototype.pageClicked=CMainWnd_pageClicked;
CMainWnd.prototype.getUIHide=CMainWnd_getUIHide;
CMainWnd.prototype.update=CMainWnd_update;
CMainWnd.prototype.getSelectionController=CMainWnd_getSelectionController;
CMainWnd.prototype.getReportHistoryConversations=CMainWnd_getReportHistoryConversations;
CMainWnd.prototype.updateCurrentFormat=CMainWnd_updateCurrentFormat;
function resizeIFrame(evt){
var oCV=window.gaRV_INSTANCES[0];
var _42f=document.getElementById("CVReport"+oCV.getId());
var _430=document.getElementById("CVIFrame"+oCV.getId());
if(typeof _42f!="undefined"&&_42f!=null&&typeof _430!="undefined"&&_430!=null){
oCV.attachedOnResize=true;
oCV.setMaxContentSize();
_430.style.height=_42f.clientHeight+"px";
}
};
function CognosViewerAction(){
this.m_oCV=null;
};
CognosViewerAction.prototype.setRequestParms=function(_431){
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
CognosViewerAction.prototype.updateMenu=function(_437){
return _437;
};
CognosViewerAction.prototype.addAdditionalOptions=function(_438){
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
var _43a="";
if(this.m_oCV!=null){
if(typeof this.m_oCV.envParams["reportpart_id"]!="undefined"){
_43a=this.m_oCV.envParams["reportpart_id"];
}else{
if(typeof this.m_oCV.envParams["ui.name"]!="undefined"){
_43a=this.m_oCV.envParams["ui.name"];
}
}
}
return _43a;
};
CognosViewerAction.prototype.getContainerId=function(_43b){
var _43c="";
if(_43b&&_43b.getAllSelectedObjects){
var _43d=_43b.getAllSelectedObjects();
if(_43d){
var _43e=_43d[0];
if(_43e&&_43e.getLayoutElementId){
_43c=this.removeNamespace(_43e.getLayoutElementId());
}
}
}
return _43c;
};
CognosViewerAction.prototype.removeNamespace=function(_43f){
var _440=_43f;
try{
if(_43f!=""){
var _441=_43f.indexOf(this.m_oCV.getId());
if(_441!=-1){
_43f=_43f.replace(this.m_oCV.getId(),"");
}
}
return _43f;
}
catch(e){
return _440;
}
};
CognosViewerAction.prototype.doAddActionContext=function(){
return true;
};
CognosViewerAction.prototype.getSelectionContext=function(){
return getViewerSelectionContext(this.m_oCV.getSelectionController(),new CSelectionContext(this.m_oCV.envParams["ui.object"]),this.genSelectionContextWithUniqueCTXIDs());
};
CognosViewerAction.prototype.getNumberOfSelections=function(){
var _442=-1;
if(this.m_oCV!=null&&this.m_oCV.getSelectionController()!=null){
_442=this.m_oCV.getSelectionController().getSelections().length;
}
return _442;
};
CognosViewerAction.prototype.buildDynamicMenuItem=function(_443,_444){
_443.action={name:"LoadMenu",payload:{action:_444}};
_443.items=[{"name":"loading","label":RV_RES.GOTO_LOADING,iconClass:"loading"}];
return _443;
};
CognosViewerAction.prototype.createCognosViewerDispatcherEntry=function(_445){
var oReq=new ViewerDispatcherEntry(this.getCognosViewer());
oReq.addFormField("ui.action",_445);
this.preProcess();
if(this.doAddActionContext()===true){
var _447=this.addActionContext();
oReq.addFormField("cv.actionContext",_447);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_447,"xml");
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
var _448=this.getCognosViewer().getViewerWidget();
if(_448){
var _449={"modified":true};
_448.fireEvent("com.ibm.bux.widget.modified",null,_449);
}
}
catch(e){
}
};
CognosViewerAction.prototype.showCustomCursor=function(evt,id,_44c){
var _44d=document.getElementById(id);
if(_44d==null){
_44d=document.createElement("span");
_44d.className="customCursor";
_44d.setAttribute("id",id);
document.body.appendChild(_44d);
}
var _44e="<img src=\""+this.getCognosViewer().getWebContentRoot()+_44c+"\"/>";
_44d.innerHTML=_44e;
_44d.style.position="absolute";
_44d.style.left=(evt.clientX+15)+"px";
_44d.style.top=(evt.clientY+15)+"px";
_44d.style.display="inline";
};
CognosViewerAction.prototype.hideCustomCursor=function(id){
var _450=document.getElementById(id);
if(_450!=null){
_450.style.display="none";
}
};
CognosViewerAction.prototype.selectionHasContext=function(){
var _451=this.getCognosViewer().getSelectionController().getAllSelectedObjects();
var _452=false;
if(_451!=null&&_451.length>0){
for(var i=0;i<_451.length;i++){
if(_451[i].hasContextInformation()){
_452=true;
break;
}
}
}
return _452;
};
CognosViewerAction.prototype.isInteractiveDataContainer=function(_454){
var _455=false;
if(typeof _454!="undefined"&&_454!=null){
var id=_454.toLowerCase();
_455=id=="crosstab"||id=="list"||this.getCognosViewer().getRAPReportInfo().isChart(id);
}
return _455;
};
CognosViewerAction.prototype.getSelectedContainerId=function(){
var _457=this.getCognosViewer();
var _458=_457.getSelectionController();
var _459=null;
if(_458!=null&&typeof _458!="undefined"){
_459=this.getContainerId(_458);
}
return _459;
};
CognosViewerAction.prototype.getSelectedReportInfo=function(){
var _45a=this.getCognosViewer();
var _45b=this.getSelectedContainerId();
var _45c=this.getReportInfo(_45b);
if(_45c==null){
var _45d=_45a.getRAPReportInfo();
if(_45d.getContainerCount()==1){
_45c=_45d.getContainerFromPos(0);
}
}
return _45c;
};
CognosViewerAction.prototype.getReportInfo=function(_45e){
var _45f=null;
if(_45e!=null&&_45e.length>0){
var _460=this.getCognosViewer();
var _461=_460.getRAPReportInfo();
_45f=_461.getContainer(_45e);
}
return _45f;
};
CognosViewerAction.prototype.isSelectionOnChart=function(){
var _462=this.getCognosViewer();
if(_462.getSelectionController().hasSelectedChartNodes()){
return true;
}
var _463=this.getContainerId(_462.getSelectionController());
if(typeof _463!="undefined"){
var _464=this.getReportInfo(_463);
if(_464!=null&&_464.displayTypeId){
var _465=_464.displayTypeId.toLowerCase();
return _462.getRAPReportInfo().isChart(_465);
}
}
return false;
};
CognosViewerAction.prototype.ifContainsInteractiveDataContainer=function(){
var _466=this.getCognosViewer().getRAPReportInfo();
if(_466){
return _466.containsInteractiveDataContainer();
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
var _468=[];
var _469=document.getElementById("rt"+this.m_oCV.getId());
if(_469!=null){
_468=getElementsByAttribute(_469,"*","lid");
}
return _468;
};
CognosViewerAction.prototype.addClientContextData=function(_46a){
var _46b=this.m_oCV.getSelectionController();
if(typeof _46b!="undefined"&&_46b!=null&&typeof _46b.getCCDManager!="undefined"&&_46b.getCCDManager()!=null){
var _46c=_46b.getCCDManager();
return ("<md>"+xml_encode(_46c.MetadataToJSON())+"</md>"+"<cd>"+xml_encode(_46c.ContextDataSubsetToJSON(_46a))+"</cd>");
}
return "";
};
CognosViewerAction.prototype.getDataItemInfoMap=function(){
var _46d=this.m_oCV.getSelectionController();
if(typeof _46d!="undefined"&&_46d!=null&&typeof _46d.getCCDManager!="undefined"&&_46d.getCCDManager()!=null){
var _46e=_46d.getCCDManager();
return ("<di>"+xml_encode(_46e.DataItemInfoToJSON())+"</di>");
}
return "";
};
CognosViewerAction.prototype.getRAPLayoutTag=function(_46f){
var _470=null;
if(typeof _46f=="object"&&_46f!=null){
_470=_46f.getAttribute("rap_layout_tag");
}
return _470;
};
CognosViewerAction.prototype.addMenuItemChecked=function(_471,_472,_473){
if(_471){
if(this.getCognosViewer().isHighContrast()){
_472["class"]="menuItemSelected";
}
_472.iconClass="menuItemChecked";
}else{
if(_473&&_473.length>0){
_472.iconClass=_473;
}
}
};
CognosViewerAction.prototype.gatherFilterInfoBeforeAction=function(_474){
var _475=this.getCognosViewer().getViewerWidget();
_475.filterRequiredAction=_474;
_475.clearRAPCache();
_475.fireEvent("com.ibm.bux.widget.action",null,{action:"canvas.filters"});
};
CognosViewerAction.prototype.addClientSideUndo=function(_476,_477){
var _478=GUtil.generateCallback(_476.doUndo,_477,_476);
var _479=GUtil.generateCallback(_476.doRedo,_477,_476);
this.getUndoRedoQueue().addClientSideUndo({"tooltip":_476.getUndoHint(),"undoCallback":_478,"redoCallback":_479});
this.getCognosViewer().getViewerWidget().updateToolbar();
};
CognosViewerAction.prototype.isValidMenuItem=function(){
var _47a=this.getCognosViewer();
var _47b=_47a.getViewerWidget();
if(this.isPromptWidget()){
return false;
}
return true;
};
CognosViewerAction.prototype.isPositiveInt=function(_47c){
if(typeof _47c==="undefined"||_47c===null){
return false;
}
var _47d=parseInt(_47c,10);
return _47c&&_47d===+_47c&&_47d>0&&_47c.indexOf(".")==-1;
};
CognosViewerAction.prototype.buildActionResponseObject=function(_47e,code,msg){
return {"status":_47e,"message":msg?msg:null,"code":code?code:null,getStatus:function(){
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
LineageAction.prototype.getCommonOptions=function(_481){
_481.addFormField("cv.responseFormat","asynchDetailMIMEAttachment");
_481.addFormField("bux",this.m_oCV.getViewerWidget()?"true":"false");
_481.addFormField("cv.id",this.m_oCV.envParams["cv.id"]);
};
LineageAction.prototype.getSelectionOptions=function(_482){
var _483=this.m_oCV.getSelectionController();
var _484=getSelectionContextIds(_483);
_482.addFormField("context.format","initializer");
_482.addFormField("context.type","reportService");
_482.addFormField("context.selection","metadata,"+_484.toString());
};
LineageAction.prototype.getPrimaryRequestOptions=function(_485){
_485.addFormField("specificationType","metadataServiceLineageSpecification");
_485.addFormField("ui.action","runLineageSpecification");
_485.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
};
LineageAction.prototype.getSecondaryRequestOptions=function(_486){
_486.addFormField("ui.conversation",this.m_oCV.getConversation());
_486.addFormField("m_tracking",this.m_oCV.getTracking());
_486.addFormField("ui.action","lineage");
};
LineageAction.prototype.updateMenu=function(_487){
if(!this.getCognosViewer().bCanUseLineage){
return "";
}
_487.disabled=!this.selectionHasContext();
return _487;
};
LineageAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _489=new AsynchDataDispatcherEntry(oCV);
this.getCommonOptions(_489);
this.getSelectionOptions(_489);
if(oCV.getConversation()==""){
this.getPrimaryRequestOptions(_489);
}else{
this.getSecondaryRequestOptions(_489);
}
_489.setCallbacks({"complete":{"object":this,"method":this.handleLineageResponse}});
if(!oCV.m_viewerFragment){
_489.setRequestIndicator(oCV.getRequestIndicator());
var _48a=new WorkingDialog(oCV);
_48a.setSimpleWorkingDialogFlag(true);
_489.setWorkingDialog(_48a);
}
oCV.dispatchRequest(_489);
};
LineageAction.prototype.handleLineageResponse=function(_48b){
var oCV=this.getCognosViewer();
oCV.loadExtra();
oCV.setStatus(_48b.getAsynchStatus());
oCV.setConversation(_48b.getConversation());
oCV.setTracking(_48b.getTracking());
var _48d=null;
if(typeof MDSRV_CognosConfiguration!="undefined"){
_48d=new MDSRV_CognosConfiguration();
var _48e="";
if(this.m_oCV.envParams["metadataInformationURI"]){
_48e=this.m_oCV.envParams["metadataInformationURI"];
}
_48d.addProperty("lineageURI",_48e);
_48d.addProperty("gatewayURI",this.m_oCV.getGateway());
}
var _48f=this.m_oCV.envParams["ui.object"];
var _490=getViewerSelectionContext(this.m_oCV.getSelectionController(),new CSelectionContext(_48f));
var _491=new MDSRV_LineageFragmentContext(_48d,_490);
_491.setExecutionParameters(this.m_oCV.getExecutionParameters());
if(typeof _48f=="string"){
_491.setReportPath(_48f);
}
_491.setReportLineage(_48b.getResult());
_491.open();
};
function CSelectionDefaultStyles(_492){
this.m_primarySelectionColor=null;
this.m_highContrastBorderStyle="solid";
this.m_secondarySelectionIsDisabled=false;
if(_492){
this.m_selectionController=_492;
this.m_oCognosViewer=_492.m_oCognosViewer;
if(this.m_oCognosViewer){
var _493=this.m_oCognosViewer.getUIConfig();
if(_493){
if(_493.getPrimarySelectionColor()){
this.m_primarySelectionColor=_493.getPrimarySelectionColor();
}
if(!_493.getShowSecondarySelection()){
this.m_secondarySelectionIsDisabledConfig=true;
}else{
if(_493.getSeondarySelectionColor()){
this.m_secondarySelectionColor=_493.getSeondarySelectionColor();
}
}
}
}
}
};
CSelectionDefaultStyles.prototype.getPrimarySelectionColor=function(_494){
return this.m_primarySelectionColor;
};
CSelectionDefaultStyles.prototype.getSecondarySelectionColor=function(){
return this.m_secondarySelectionColor;
};
CSelectionDefaultStyles.prototype.getHighContrastBorderStyle=function(){
return this.m_highContrastBorderStyle;
};
CSelectionDefaultStyles.prototype.canApplyToSelection=function(_495){
return true;
};
CSelectionDefaultStyles.prototype.secondarySelectionIsDisabled=function(){
return this.m_secondarySelectionIsDisabled;
};
CSelectionDefaultStyles.prototype.setStyleForSelection=function(){
};
function CSelectionFilterStyles(_496){
this.m_selectionController=_496;
this.m_primarySelectionColor=this.m_primarySelectionFilterColor="#44BFDD";
this.m_primarySelectionFilterColorForMeasure=null;
this.m_secondarySelectionColor=null;
this.m_highContrastBorderStyle="dotted";
this.m_secondarySelectionIsDisabled=true;
};
CSelectionFilterStyles.prototype=new CSelectionDefaultStyles();
CSelectionFilterStyles.prototype.getPrimarySelectionColor=function(_497){
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
CSelectionFilterStyles.prototype.canApplyToSelection=function(_498){
return !this.selectionHasOnlyMeasure(_498);
};
CSelectionFilterStyles.prototype.selectionHasOnlyMeasure=function(_499){
return (_499.length===1&&_499[0].length===1&&this.m_selectionController.isMeasure(_499[0][0]));
};
CSelectionFilterStyles.prototype.setStyleForSelection=function(_49a){
this.m_primarySelectionColor=(this.selectionHasOnlyMeasure(_49a))?null:this.m_primarySelectionFilterColor;
};
function CSelectionFilterContextMenuStyles(_49b){
CSelectionDefaultStyles.call(this,_49b);
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
CSelectionObject.prototype.getDataItemDisplayValue=function(_49c){
var _49d=this.getDataItems();
var item="";
if(_49d&&_49d[0]&&_49d[0][0]){
item=this.getDataItems()[0][0];
if(_49c&&_49c.itemInfo&&_49c.itemInfo.length){
var _49f=_49c.itemInfo;
for(var i=0;i<_49f.length;i++){
if(_49f[i].item===item&&_49f[i].itemLabel){
return _49f[i].itemLabel;
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
var _4a3=this.m_contextIds[i][j];
this.m_aDataItems[this.m_aDataItems.length-1].push(this.m_selectionController.isContextId(_4a3)?this.m_selectionController.getRefDataItem(_4a3):"");
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
var _4a6=this.m_contextIds[i][j];
this.m_aUseValues[this.m_aUseValues.length-1].push(this.m_selectionController.isContextId(_4a6)?this.m_selectionController.getUseValue(_4a6):"");
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
var _4a9=this.m_contextIds[i][j];
this.m_aMuns[this.m_aMuns.length-1].push(this.m_selectionController.isContextId(_4a9)?this.m_selectionController.getMun(_4a9):"");
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
var _4ac=this.m_contextIds[i][j];
this.m_aRefQueries[this.m_aRefQueries.length-1].push(this.m_selectionController.isContextId(_4ac)?this.m_selectionController.getRefQuery(_4ac):"");
}
}
}
return this.m_aRefQueries;
};
CSelectionObject.prototype.getDimensionalItems=function(_4ad){
var _4ae=[];
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
_4ae[_4ae.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4b1=this.m_contextIds[i][j];
var _4b2="";
if(this.m_selectionController.isContextId(_4b1)){
switch(_4ad){
case "hun":
_4b2=this.m_selectionController.getHun(_4b1);
break;
case "lun":
_4b2=this.m_selectionController.getLun(_4b1);
break;
case "dun":
_4b2=this.m_selectionController.getDun(_4b1);
break;
}
}
_4ae[_4ae.length-1].push(_4b2);
}
}
return _4ae;
};
CSelectionObject.prototype.getMetadataItems=function(){
if(!this.m_aMetadataItems.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aMetadataItems[this.m_aMetadataItems.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4b5=this.m_contextIds[i][j];
var _4b6="";
if(this.m_selectionController.isContextId(_4b5)){
var sLun=this.m_selectionController.getLun(_4b5);
var sHun=this.m_selectionController.getHun(_4b5);
if(sLun&&sLun!=""){
_4b6=sLun;
}else{
if(sHun&&sHun!=""){
_4b6=sHun;
}else{
_4b6=this.m_selectionController.getQueryModelId(_4b5);
}
}
}
this.m_aMetadataItems[this.m_aMetadataItems.length-1].push(_4b6);
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
var _4bb=this.m_contextIds[i][j];
this.m_aDrillOptions[this.m_aDrillOptions.length-1].push(this.m_selectionController.isContextId(_4bb)?this.m_selectionController.getDrillFlag(_4bb):0);
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
var _4bc=[];
for(var i=0;i<this.m_contextIds.length;i++){
for(var j=0;j<this.m_contextIds[i].length;j++){
_4bc.push(this.m_contextIds[i][j]);
}
}
this.m_selectionController.fetchContextData(_4bc);
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
var _4c2=this.getCellRef().className;
if(_4c2&&(_4c2=="xm"||_4c2.indexOf("xm ")!=-1||_4c2.indexOf(" xm")!=-1)){
return true;
}
return false;
};
CSelectionObject.prototype.getDataContainerType=function(){
return this.m_dataContainerType;
};
CSelectionObject.prototype.getContextJsonObject=function(_4c3,_4c4){
if(this.m_oJsonContext===null){
var _4c5={};
var _4c6=[];
var _4c7=null;
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return null;
}
var i=0,j=0;
var _4ca=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_4c3);
_4c7=_4ca;
this._populateJsonContextObj(_4ca,this.m_aUseValues[i][j],_4c3.getDisplayValue(this.m_contextIds[i][j]),_4c3.getMun(this.m_contextIds[i][j]),_4c5,_4c6);
j++;
for(;i<this.m_aDataItems.length;i++,j=0){
for(;j<this.m_aDataItems[i].length;j++){
_4ca=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_4c3);
if(!_4c7){
_4c7=_4ca;
}
this._populateJsonContextObj(_4ca,this.m_aUseValues[i][j],_4c3.getDisplayValue(this.m_contextIds[i][j]),_4c3.getMun(this.m_contextIds[i][j]),_4c5,_4c6);
}
}
this.m_oJsonContext=this._createGenericPayloadStructureJson(_4c7,_4c5,_4c6,_4c4);
}
return this.m_oJsonContext;
};
CSelectionObject.prototype._getBestPossibleItemName=function(_4cb,_4cc,_4cd){
var _4ce=null;
if(_4cd.isMeasure(_4cc)){
if(!_4cd.isValidColumnTitle(this.m_oCellRef)){
if(!_4cd.isRelational([_4cc])){
_4ce=_4cd.getCCDManager().GetBestPossibleDimensionMeasureName(_4cc);
}
return (_4ce)?_4ce:_4cb;
}
}
_4ce=_4cd.getCCDManager().GetBestPossibleItemName(_4cc);
return (_4ce)?_4ce:_4cb;
};
CSelectionObject.prototype._isTypeColumnTitle=function(){
if(this.m_oCellRef&&typeof this.m_oCellRef.getAttribute=="function"){
return (this.m_oCellRef.getAttribute("type")==="columnTitle");
}
return false;
};
CSelectionObject.prototype._populateJsonContextObj=function(_4cf,_4d0,_4d1,mun,_4d3,_4d4){
if(_4d3&&_4d4&&_4cf&&typeof _4d3[_4cf]=="undefined"){
var _4d5=_4d1?_4d1:_4d0;
_4d3[_4cf]=[_4d5];
var _4d6={};
if(_4d1){
_4d6["caption"]=_4d1;
}
if(mun){
_4d6["mun"]=mun;
}
if(_4d0){
_4d6["use"]=_4d0;
}
_4d4.push(_4d6);
}
};
CSelectionObject.prototype._createGenericPayloadStructureJson=function(_4d7,_4d8,_4d9,_4da){
if(_4d7&&_4d8&&_4d9){
var _4db=(_4da)?_4da:".";
var _4dc={};
_4dc[_4db]={"values":_4d9};
var obj={"com.ibm.widget.context":{"values":_4d8},"com.ibm.widget.context.report.select":{"select":{"selectedItem":_4d7,"itemSpecification":_4dc}}};
return obj;
}
return null;
};
CSelectionObject.prototype.populateSelectionPayload=function(_4de,_4df,_4e0){
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return false;
}
_4e0=((_4e0===undefined)?false:_4e0);
var _4e1=this.m_selectionController;
for(var i=0,j=0;i<this.m_aDataItems.length;i++,j=0){
var _4e4=(_4e0?1:this.m_aDataItems[i].length);
for(;j<_4e4;j++){
if(!_4e1.isMeasure(this.m_contextIds[i][j])){
var _4e5=this.m_aDataItems[i][j];
this._populateItemInSelectionPayload(_4e5,this.m_aUseValues[i][j],_4e1.getDisplayValue(this.m_contextIds[i][j]),_4e1.getMun(this.m_contextIds[i][j]),_4de,_4df);
}
}
}
return true;
};
CSelectionObject.prototype._populateItemInSelectionPayload=function(_4e6,_4e7,_4e8,mun,_4ea,_4eb){
if(_4ea&&_4e6){
var _4ec=_4e7?_4e7:_4e8;
if(_4ea[_4e6]){
_4ea[_4e6].push(_4ec);
}else{
_4ea[_4e6]=[_4ec];
}
var _4ed={};
_4ed["caption"]=_4ec;
if(mun){
_4ed["mun"]=mun;
}
var _4ee=_4eb[_4e6];
if(!_4ee){
_4ee={"values":[]};
_4eb[_4e6]=_4ee;
}
_4ee.values.push(_4ed);
}
};
CSelectionObject.prototype.getCtxAttributeString=function(){
return this.m_ctxAttributeString;
};
CSelectionObject.prototype.isDataValueOrChartElement=function(){
return (this.m_sLayoutType==="datavalue"||this.m_sLayoutType==="chartElement");
};
CSelectionObject.prototype.marshal=function(_4ef,_4f0){
if(!this.m_oJsonForMarshal){
var _4f1={};
var _4f2=[];
var _4f3=null;
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return null;
}
var i=0,j=0;
if(this.m_contextIds[i][j].length==0){
var _4f6=false;
do{
for(;j<this.m_contextIds[i].length;j++){
if(this.m_contextIds[i][j].length>0){
_4f6=true;
break;
}
}
if(!_4f6){
j=0;
i++;
}
}while(!_4f6);
}
var _4f7=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_4ef);
var _4f8=_4ef.isMeasure(this.m_contextIds[i][j]);
var _4f9=this._getBestPossibleItemReference(this.m_contextIds[i][j],_4f8,_4ef.getCCDManager());
var _4fa=_4ef.getCCDManager().GetQuery(this.m_contextIds[i][j]);
var _4fb=this.isDataValueOrChartElement();
var _4fc=this._populateJsonForMarshal(_4f7,_4f9,_4f8,this.m_aUseValues[i][j],_4ef.getDisplayValue(this.m_contextIds[i][j]),_4ef.getMun(this.m_contextIds[i][j]),_4fb);
j++;
var _4fd=[];
for(;i<this.m_aDataItems.length;i++,j=0){
for(;j<this.m_aDataItems[i].length;j++){
_4f7=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_4ef);
_4f8=_4ef.isMeasure(this.m_contextIds[i][j]);
_4f9=this._getBestPossibleItemReference(this.m_contextIds[i][j],_4f8,_4ef.getCCDManager());
var _4fe=this._populateJsonForMarshal(_4f7,_4f9,_4f8,this.m_aUseValues[i][j],_4ef.getDisplayValue(this.m_contextIds[i][j]),_4ef.getMun(this.m_contextIds[i][j]));
if(_4fe){
_4fd.push(_4fe);
}
}
}
var lid=(typeof this.getArea=="function")?getImmediateLayoutContainerId(this.getArea()):getImmediateLayoutContainerId(this.getCellRef());
if(lid&&lid.indexOf(_4f0)>0){
lid=lid.substring(0,lid.indexOf(_4f0)-1);
}
this.m_oJsonForMarshal={"lid":lid,"query":_4fa,"selectedItem":_4fc,"context":_4fd};
}
return this.m_oJsonForMarshal;
};
CSelectionObject.prototype._populateJsonForMarshal=function(_500,_501,_502,_503,_504,mun,_506){
if(_500){
var _507={};
_507["itemName"]=_500;
_507["isMeasure"]=_502?"true":"false";
_507["mdProperty"]=_501.mdProperty;
_507["mdValue"]=_501.mdValue;
_507["isDataValueOrChartElement"]=_506?"true":"false";
if(mun){
_507["mun"]=mun;
}
if(_503){
_507["use"]=_503;
}
return _507;
}
return null;
};
CSelectionObject.prototype._getBestPossibleItemReference=function(_508,_509,_50a){
var _50b=null;
var _50c=null;
if(_509){
_50c="i";
_50b=_50a.GetQMID(_508);
if(_50b==null){
_50c="m";
_50b=_50a.GetMUN(_508);
}
if(_50b==null){
_50c="r";
_50b=_50a.GetRDIValue(_508);
}
}else{
_50c="l";
_50b=_50a.GetLUN(_508);
if(_50b==null){
_50c="h";
_50b=_50a.GetHUN(_508);
}
if(_50b==null){
_50c="i";
_50b=_50a.GetQMID(_508);
}
if(_50b==null){
_50c="r";
_50b=_50a.GetRDIValue(_508);
}
}
return {"mdProperty":_50c,"mdValue":_50b};
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
CSelectionChartObject.prototype.setSelectionOnVizChart=function(_50d){
var _50e=this.m_selectionController.getSelectedChartImageFromChartArea(_50d);
if(_50e){
this.m_selectedVizChart=_50e.parentNode.getAttribute("vizchart")=="true"?true:false;
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
CSelectionChartObject.prototype.setCtxAreas=function(_50f){
this.m_chartCtxAreas=_50f;
};
CSelectionChartObject.prototype.getCtxAttributeString=function(){
return this.m_context;
};
function CChartHelper(_510,_511,_512){
var _513=_510.parentNode;
this.m_selectionObjectFactory=_511;
this.m_map=_513;
_512.loadExtra();
this.imageMapHighlighter=new CImageMapHighlight(_513,_512.sWebContentRoot);
this.initialize();
};
CChartHelper.prototype.initialize=function(){
this.buildMapCtxAreas();
this.m_chartCtxNodes={};
};
CChartHelper.prototype.buildMapCtxAreas=function(){
var _514={};
var _515=this.m_map.childNodes;
var _516=_515.length;
var _517=null;
for(var i=0;i<_516;i++){
var a=_515[i];
_517=a.getAttribute("ctx");
if(_517){
if(_514[_517]){
_514[_517].push(a);
}else{
_514[_517]=[a];
}
}
}
this.m_ctxAreas=_514;
};
CChartHelper.prototype.getChartNode=function(_51a){
if(!this.isAreaInitialized(_51a)){
var _51b=_51a.parentNode;
this.m_map=_51b;
this.initialize();
this.imageMapHighlighter.initialize(_51b);
}
var _51c=_51a.getAttribute("ctx");
if(!this.m_chartCtxNodes[_51c]){
this.m_chartCtxNodes[_51c]=this.m_selectionObjectFactory.getSelectionChartObject(_51a);
this.m_chartCtxNodes[_51c].setCtxAreas(this.m_ctxAreas[_51c]);
}
return this.m_chartCtxNodes[_51c];
};
CChartHelper.prototype.isAreaInitialized=function(_51d){
return this.imageMapHighlighter.isAreaInitialized(_51d);
};
CChartHelper.prototype.getImageMapHighlighter=function(){
return this.imageMapHighlighter;
};
function CSelectionObjectFactory(_51e){
this.m_selectionController=_51e;
};
CSelectionObjectFactory.prototype.getSelectionController=function(){
return this.m_selectionController;
};
CSelectionObjectFactory.prototype.getChildSpans=function(_51f){
var _520=[];
for(var i=0;i<_51f.childNodes.length;i++){
var _522=_51f.childNodes[i];
if(!_522.getAttribute||_522.getAttribute("skipSelection")!="true"){
_520.push(_51f.childNodes[i]);
}
}
var _523=_51f;
var _524="";
while(!_524&&_523){
_524=_523.attributes?_523.attributes["LID"]:"";
_523=_523.parentNode;
}
_524=_524?_524.value:"";
var _525=[];
while(_520.length>0){
var _522=_520.pop();
var lid=_522.attributes?_522.attributes["LID"]:"";
lid=lid?lid.value:"";
if(!lid||lid==_524){
if(_522.nodeName.toLowerCase()=="span"){
_525.push(_522);
}else{
for(i=0;i<_522.childNodes.length;i++){
_520.push(_522.childNodes[i]);
}
}
}
}
return _525;
};
CSelectionObjectFactory.prototype.getSelectionObject=function(_527,_528){
var _529=new CSelectionObject();
try{
_529.setSelectionController(this.getSelectionController());
_529.m_oCellRef=_527;
_529.m_sColumnRef=_527.getAttribute("cid");
_529.m_sCellTypeId=_527.getAttribute("uid");
_529.m_sLayoutType=_527.getAttribute("type");
_529.m_sTag=_527.getAttribute("tag");
_529.m_layoutElementId=this.getLayoutElementId(_527);
_529.m_dataContainerType=this.getContainerType(_527);
if(typeof cf!="undefined"){
var _52a=cf.cfgGet("MiniQueryObj");
if(_52a){
var _52b=_52a.findChildWithAttribute("tag",_529.m_sTag);
if(_52b&&_52b.getAttribute("id")!=null){
_529.m_sColumnName=_52b.getAttribute("id");
}
}
}
var _52c=this.getChildSpans(_527);
if(_52c.length>0){
for(var i=0;i<_52c.length;i++){
var _52e=_52c[i];
if(_52e.nodeType==1&&_52e.nodeName.toLowerCase()=="span"&&_52e.style.visibility!="hidden"){
var _52f=null;
if(_527.getAttribute("ctx")!=null&&_527.getAttribute("ctx")!=""){
_52f=_527;
}else{
if(_52e.getAttribute("ctx")!=null&&_52e.getAttribute("ctx")!=""){
_52f=_52e;
}else{
if(_52e.getAttribute("dtTargets")&&_52e.childNodes&&_52e.childNodes.length){
for(var _530=0;_530<_52e.childNodes.length;_530++){
if(_52e.childNodes[_530].nodeType==1&&_52e.childNodes[_530].style.visibility!="hidden"){
_52f=_52e.childNodes[_530];
}
}
}else{
for(var _531=0;_531<_52e.childNodes.length;_531++){
var _532=_52e.childNodes[_531];
if(typeof _532.getAttribute!="undefined"&&_532.getAttribute("ctx")!=null&&_532.getAttribute("ctx")!=""){
_52f=_532;
break;
}
}
}
}
}
var _533="";
if(_52f&&_52f.getAttribute("ctx")){
_533=_52f.getAttribute("ctx");
}
_529.m_aDisplayValues[_529.m_aDisplayValues.length]=this.getSelectionController().getDisplayValue(_533,_527.parentNode);
if(typeof _528!="undefined"&&_528!=_533){
continue;
}
_529=this.processCTX(_529,_533);
}
}
}else{
if(_527.getAttribute("ctx")!=null&&_527.getAttribute("ctx")!=""&&_529.m_sLayoutType=="datavalue"){
_529=this.processCTX(_529,_527.getAttribute("ctx"));
}
}
this.getSelectionController().processColumnTitleNode(_529);
}
catch(ex){
}
return _529;
};
CSelectionObjectFactory.prototype.processCTX=function(_534,_535){
if(typeof _535!="string"||_535.length==0){
return _534;
}
var ctx;
if(typeof _534.m_contextIds=="object"&&_534.m_contextIds!==null&&_534.m_contextIds.length>0){
var _537=_535.split("::");
for(ctx=0;ctx<_534.m_contextIds.length;++ctx){
try{
if(_537[ctx]){
_534.m_contextIds[ctx]=_534.m_contextIds[ctx].concat(_537[ctx].split(":"));
}
}
catch(e){
}
}
}else{
_534.m_contextIds=this.m_selectionController.m_oCognosViewer.getReportContextHelper().processCtx(_535);
}
_534.m_ctxAttributeString=_535;
return _534;
};
CSelectionObjectFactory.prototype.getSecondarySelectionObject=function(tag,_539,_53a){
if(!_53a){
_53a=document;
}
var _53b=new CSelectionObject();
_53b.setSelectionController(this.getSelectionController());
_53b.m_oCellRef=null;
_53b.m_sColumnRef=null;
_53b.m_sCellTypeId=null;
_53b.refQuery="";
var _53c=_53a.getElementsByTagName("td");
for(var i=0;i<_53c.length;i++){
var _53e=_53c[i].getAttribute("tag");
if(_53e!=null&&_53e!=""){
if(tag==_53e){
var _53f=_53c[i].className;
if(_53f!=null&&_53e!=""){
if((_539=="columnTitle"&&_53f=="lt")||(_539=="datavalue"&&_53f=="lc")){
_53b.m_sColumnRef=_53c[i].getAttribute("cid");
_53b.m_sCellTypeId=_53c[i].getAttribute("uid");
break;
}
}
}
}
}
if(_53b.m_sCellTypeId==null){
return null;
}
return _53b;
};
CSelectionObjectFactory.prototype.getSelectionChartObject=function(_540){
var _541="";
if(_540.getAttribute("flashChart")!=null){
if(typeof _540.getCtx!="undefined"){
try{
_541=_540.getCtx();
}
catch(e){
_541="";
}
}
}else{
_541=_540.getAttribute("ctx");
}
var _542=new CSelectionChartObject();
_542.setSelectionController(this.getSelectionController());
if(_541!=null){
_542.m_contextIds=_541.split("::");
for(var ctx=0;ctx<_542.m_contextIds.length;++ctx){
_542.m_contextIds[ctx]=_542.m_contextIds[ctx].split(":");
}
}
_542.m_layoutElementId=this.getLayoutElementId(_540);
_542.m_sLayoutType=_540.getAttribute("type");
_542.m_chartArea=_540;
_542.m_context=_541;
_542.setSelectionOnVizChart(_540);
return _542;
};
CSelectionObjectFactory.prototype.getContainerTypeFromClass=function(_544){
var _545="";
switch(_544){
case "ls":
_545="list";
break;
case "xt":
_545="crosstab";
break;
case "rt":
_545="repeaterTable";
break;
}
return _545;
};
CSelectionObjectFactory.prototype.getContainerType=function(el){
var type="";
if(el){
if(el.className){
type=this.getContainerTypeFromClass(el.className);
}
if(!type){
var _548=el.parentNode;
if(_548){
type=this.getContainerType(_548);
}
}
}
return type;
};
CSelectionObjectFactory.prototype.getLayoutElementId=function(el){
var id="";
var _54b=this.getSelectionController().getNamespace();
if(el){
if(el.getAttribute&&el.getAttribute("chartcontainer")=="true"){
for(var _54c=0;_54c<el.childNodes.length;_54c++){
var _54d=el.childNodes[_54c];
if(_54d.nodeName.toLowerCase()=="img"&&_54d.getAttribute("lid")!=null){
return _54d.getAttribute("lid");
}
}
}
id=(el.getAttribute&&el.getAttribute("LID"))||"";
if(!id){
var _54e=el.parentNode;
if(_54e){
id=this.getLayoutElementId(_54e);
}
}else{
if(el.tagName.toUpperCase()=="MAP"){
id=id.replace(_54b,"");
id=_54b+id;
var _54f="#"+id;
var _550=getElementsByAttribute(el.parentNode,"IMG","usemap",_54f);
if(_550.length>0){
id=_550[0].getAttribute("LID");
}
}
}
}
return id;
};
function CSelectionController(_551,_552){
this.m_bSelectionBasedFeaturesEnabled=false;
this.m_bDrillUpDownEnabled=false;
this.m_bModelDrillThroughEnabled=false;
this.m_oCognosViewer=null;
this.m_bSavedSelections=false;
if(_552){
this.m_oCognosViewer=_552;
}
this.initialize(_551);
this.FILTER_SELECTION_STYLE=0;
this.FILTER_SELECTION_CONTEXT_MENU_STYLE=1;
};
CSelectionController.prototype.initialize=function(_553){
this.m_sNamespace=_553;
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
CSelectionController.prototype.setSelectionStyles=function(_554){
switch(_554){
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
CSelectionController.prototype.setAllowHorizontalDataValueSelection=function(_555){
this.m_bAllowHorizontalDataValueSelection=_555;
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
CSelectionController.prototype.getCtxIdFromDisplayValue=function(_556){
if(!this.m_bUsingCCDManager){
var _557=this.getReportContextDataArray();
var _558=1;
for(var _559 in _557){
var _55a=_557[_559];
if(_55a[_558]==_556){
return _559;
}
}
return "";
}else{
var sId=this.m_oCDManager.GetContextIdForDisplayValue(_556);
return (sId==null)?"":sId;
}
};
CSelectionController.prototype.getCtxIdFromMetaData=function(sLun,sHun,_55e){
return this.m_oCDManager.getContextIdForMetaData(sLun,sHun,_55e);
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
var _565=this.getReportMetadataArray();
var _566=0;
for(var sKey in _565){
var _568=_565[sKey];
if(_568[_566]==sMun){
var _569=2;
var _56a=this.getReportContextDataArray();
for(var _56b in _56a){
var _56c=_56a[_56b];
if(_56c[_569]==sKey){
return _56b;
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
CSelectionController.prototype.canDrillDown=function(_56e){
var _56f=this.getDrillFlagForMember(_56e);
return (_56f==3||_56f==2);
};
CSelectionController.prototype.canDrillUp=function(_570){
var _571=this.getDrillFlagForMember(_570);
return (_571==3||_571==1);
};
CSelectionController.prototype.getQueryModelId=function(_572){
var qmid="";
if(!this.m_bUsingCCDManager){
var _574=this.m_aReportContextDataArray[_572];
if(_574&&typeof _574[3]!="undefined"){
var _575=_574[3];
var _576=this.m_aReportMetadataArray[_575];
if(typeof _576!="undefined"&&typeof _576[1]!="undefined"&&_576[1]=="I"){
qmid=_576[0];
}
}
}else{
qmid=this.m_oCDManager.GetQMID(_572);
}
return qmid;
};
CSelectionController.prototype.getRefQuery=function(_577){
if(!this.m_bUsingCCDManager){
return this.getMetaDataItemUseValue(4,_577);
}else{
var _578=this.m_oCDManager.GetQuery(_577);
return (_578==null)?"":_578;
}
};
CSelectionController.prototype.getRefDataItem=function(_579){
return this.m_oCognosViewer.getReportContextHelper().getRefDataItem(_579);
};
CSelectionController.prototype.getMun=function(_57a){
return this.m_oCognosViewer.getReportContextHelper().getMun(_57a);
};
CSelectionController.prototype.getHun=function(_57b){
if(!this.m_bUsingCCDManager){
var sHun=null;
var _57d=this.getRDI(_57b);
if(_57d&&_57d.length>4&&_57d[1]=="R"){
var _57e=_57d[4];
var _57f=this.getReportMetadataArray();
_57d=_57f[_57e];
}
if(_57d&&_57d.length>1&&_57d[1]=="H"){
sHun=_57d[0];
}
return sHun;
}else{
return this.m_oCDManager.GetHUN(_57b);
}
};
CSelectionController.prototype.fetchContextData=function(_580,_581){
var _582=0;
if(this.m_bUsingCCDManager){
_582=this.m_oCDManager.FetchContextData(_580,_581);
}
return _582;
};
CSelectionController.prototype.getMetaDataItem=function(sKey){
var _584=this.getReportMetadataArray();
if(typeof _584[sKey]!="undefined"){
return _584[sKey];
}
return null;
};
CSelectionController.prototype.getContextDataItem=function(_585){
var _586=this.getReportContextDataArray();
if(typeof _586[_585]!="undefined"){
return _586[_585];
}
return null;
};
CSelectionController.prototype.getMetaDataItemUseValue=function(_587,_588){
var _589=this.getContextDataItem(_588);
if(_589!=null){
var _58a=_589[_587];
if(_58a!=""){
var _58b=this.getMetaDataItem(_58a);
if(_58b!=null){
return _58b[0];
}
}
}
return "";
};
CSelectionController.prototype.getRDI=function(_58c){
var _58d=this.getContextDataItem(_58c);
if(_58d!=null){
var _58e=_58d[0];
if(_58e!=""){
var _58f=this.getMetaDataItem(_58e);
if(_58f!=null){
return _58f;
}
}
}
};
CSelectionController.prototype.getNamespace=function(){
return this.m_sNamespace;
};
CSelectionController.prototype.setSelectionBasedFeaturesEnabled=function(_590){
this.m_bSelectionBasedFeaturesEnabled=_590;
};
CSelectionController.prototype.getSelectionBasedFeaturesEnabled=function(){
return this.m_bSelectionBasedFeaturesEnabled;
};
CSelectionController.prototype.setDrillUpDownEnabled=function(_591){
this.m_bDrillUpDownEnabled=_591;
};
CSelectionController.prototype.getDrillUpDownEnabled=function(){
return this.m_bDrillUpDownEnabled;
};
CSelectionController.prototype.setModelDrillThroughEnabled=function(_592){
this.m_bModelDrillThroughEnabled=_592;
};
CSelectionController.prototype.getBookletItemForCurrentSelection=function(){
var _593=this.getAllSelectedObjects();
if(_593&&_593.length>0){
var _594=_593[0];
if(_594.hasContextInformation()){
var _595=this.m_oCDManager.GetBIValue(_594.m_contextIds[0][0]);
if(!_595){
return null;
}
return _595;
}
}
return null;
};
CSelectionController.prototype.getModelPathForCurrentSelection=function(){
var _596=null;
var _597=this.getBookletItemForCurrentSelection();
if(_597){
var _596=this.m_oCDManager.getModelPathFromBookletItem(_597);
}
return _596;
};
CSelectionController.prototype.getModelDrillThroughEnabled=function(){
var _598=this.getBookletItemForCurrentSelection();
if(_598){
var _599=this.m_oCDManager.GetBookletModelBasedDrillThru(_598);
return _599==1?true:false;
}else{
return this.m_bModelDrillThroughEnabled;
}
};
CSelectionController.prototype.clearSelectedObjects=function(_59a){
try{
if(!_59a){
_59a=document;
}
this.updateUI(_59a,this.getSelections(),true,false);
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
CSelectionController.prototype.resetSelections=function(_59b){
try{
if(!_59b){
_59b=document;
}
if(this.hasSelectedChartNodes()){
this.resetChartSelections(_59b);
}
this.m_oSelectedDrillThroughImage=null;
this.m_oSelectedDrillThroughSingleton=null;
if(this.getSelections()){
this.updateUI(_59b,this.getSelections(),true,false);
this.updateUI(_59b,this.getCutColumns(),true,false);
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
CSelectionController.prototype.resetChartSelections=function(_59c){
var _59d=this.m_chartHelpers;
for(var _59e in _59d){
if(_59d[_59e]){
var _59f=_59d[_59e].getImageMapHighlighter();
if(_59f.hideAllAreas){
_59f.hideAllAreas();
}
}
}
this.m_selectedChartNodes=[];
this.m_selectionContainerMap=null;
};
CSelectionController.prototype.addSelectionObject=function(_5a0,_5a1){
try{
if(!_5a1){
_5a1=document;
}
var _5a2=_5a0.getCellRef();
if(this.isCellSelected(_5a2)!==true||(typeof _5a2!="object"||_5a2===null)){
if(this.isColumnCut(_5a0.getTag())!==true){
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_5a0;
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
this.updateUI(_5a1,this.getSelections(),false,false);
}
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.removeSelectionObject=function(_5a3,_5a4){
try{
if(!_5a4){
_5a4=document;
}
var _5a5=[];
var _5a6;
for(_5a6=0;_5a6<this.m_aSelectedObjects.length;_5a6++){
var _5a7=this.m_aSelectedObjects[_5a6].getCellRef();
var _5a8=_5a3.getCellRef();
if(typeof _5a7=="object"&&typeof _5a8=="object"&&_5a7!==null&&_5a8!==null){
if(_5a7==_5a8){
_5a5[_5a5.length]=_5a6;
}
}
}
if(_5a5.length>0){
this.updateUI(_5a4,this.getSelections(),true,false);
var _5a9=[];
for(_5a6=0;_5a6<this.m_aSelectedObjects.length;_5a6++){
var _5aa=true;
for(var j=0;j<_5a5.length;j++){
if(_5a6==_5a5[j]){
_5aa=false;
}
}
if(_5aa){
_5a9[_5a9.length]=this.m_aSelectedObjects[_5a6];
}
}
this.m_aSelectedObjects=_5a9;
this.updateUI(_5a4,this.getSelections(),false,false);
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
CSelectionController.prototype.isSavedCellSelected=function(_5ac){
return this.isCellSelectedHelper(_5ac,this.getSavedSelectedObjects());
};
CSelectionController.prototype.isCellSelected=function(_5ad){
return this.isCellSelectedHelper(_5ad,this.getSelections());
};
CSelectionController.prototype.isCellSelectedHelper=function(_5ae,_5af){
try{
for(var i=0;i<_5af.length;i++){
var _5b1=_5af[i].getCellRef();
if(typeof _5b1=="object"&&_5b1!==null){
if(_5b1==_5ae){
return true;
}
}
}
}
catch(e){
}
return false;
};
CSelectionController.prototype.isColumnSelected=function(_5b2){
try{
for(var i=0;i<this.m_aSelectedObjects.length;i++){
if(this.m_aSelectedObjects[i].getTag()==_5b2){
return true;
}
}
}
catch(e){
}
return false;
};
CSelectionController.prototype.isColumnCut=function(_5b4){
try{
for(var i=0;i<this.m_aCutColumns.length;i++){
if(this.m_aCutColumns[i].getTag()==_5b4){
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
CSelectionController.prototype.selectSingleDomNode=function(_5b6){
this.clearSelectedObjects();
var _5b7=this.getSelectionObjectFactory().getSelectionObject(_5b6);
var _5b8=null;
if(isIE()){
_5b8=_5b6.document;
}else{
_5b8=_5b6.ownerDocument;
}
this.addSelectionObject(_5b7,_5b8);
};
CSelectionController.prototype.hasCutColumns=function(){
if(this.m_aCutColumns.length===0){
return false;
}else{
return true;
}
};
CSelectionController.prototype.setCutColumns=function(_5b9,_5ba){
try{
if(!_5ba){
_5ba=document;
}
this.updateUI(_5ba,this.getSelections(),true,false);
this.updateUI(_5ba,this.getCutColumns(),true,1);
this.m_aCutColumns=[];
if(_5b9===true){
for(var i=0;i<this.m_aSelectedObjects.length;i++){
this.m_aCutColumns[i]=this.m_aSelectedObjects[i];
}
this.m_aSelectedObjects=[];
}
this.updateUI(_5ba,this.getCutColumns(),false,2);
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
CSelectionController.prototype.attachObserver=function(_5bc){
this.m_oObserver.attach(_5bc);
};
CSelectionController.prototype.onSelectionChange=function(){
this.getObservers().notify();
};
CSelectionController.prototype.getSelectedColumns=function(_5bd){
var _5be=[];
if(typeof _5bd=="undefined"){
_5bd=this.getSelections();
}
var _5bf=_5bd.length;
for(var i=0;i<_5bf;i++){
var _5c1=_5bd[i];
var _5c2=true;
for(var j=0;j<_5be.length;j++){
if(_5be[j][0]==_5c1.getColumnRef()&&_5be[j][1]==_5c1.getCellTypeId()){
_5c2=false;
break;
}
}
if(_5c2){
_5be[_5be.length]=[_5c1.getColumnRef(),_5c1.getCellTypeId(),_5c1.getLayoutType(),_5c1.getTag(),_5c1.getColumnName()];
}
}
return _5be;
};
CSelectionController.prototype.getAllSelectedObjectsWithUniqueCTXIDs=function(){
var _5c4=[];
var _5c5=this.getAllSelectedObjects();
for(var i=0;i<_5c5.length;i++){
var _5c7=false;
var _5c8=_5c5[i];
for(var ii=0;ii<_5c4.length;ii++){
if(_5c8.m_contextIds[0][0]==_5c4[ii].m_contextIds[0][0]){
_5c7=true;
break;
}
}
if(!_5c7){
_5c4.push(_5c8);
}
}
return _5c4;
};
CSelectionController.prototype.getAllSelectedObjects=function(){
var _5ca=this.getSelections();
if(this.hasSelectedChartNodes()){
_5ca=_5ca.concat(this.getSelectedChartNodes());
}
return _5ca;
};
CSelectionController.prototype.getSelectedColumnIds=function(_5cb){
var _5cc=[];
if(typeof _5cb=="undefined"){
_5cb=this.getSelections();
}
var _5cd=this.getSelectedColumns(_5cb);
for(var _5ce=0;_5ce<_5cd.length;_5ce++){
var _5cf=true;
for(var _5d0=0;_5d0<_5cc.length;_5d0++){
if(_5cc[_5d0]==_5cd[_5ce][4]){
_5cf=false;
break;
}
}
if(_5cf){
_5cc[_5cc.length]=_5cd[_5ce][4];
}
}
return _5cc;
};
var STYLE_SELECTION={};
CSelectionController.prototype.selecting=function(c,_5d2){
var _5d3="."+c+_5d2;
var doc=document;
var _5d5=document.getElementById("CVIFrame"+this.m_sNamespace);
if(_5d5){
doc=_5d5.contentWindow.document;
}
var _5d6=doc.createElement("style");
_5d6.setAttribute("type","text/css");
if(_5d6.styleSheet){
_5d6.styleSheet.cssText=_5d3;
}else{
_5d6.appendChild(doc.createTextNode(_5d3));
}
doc.getElementsByTagName("head").item(0).appendChild(_5d6);
STYLE_SELECTION[c]=_5d6;
};
CSelectionController.prototype.deselecting=function(_5d7){
for(var i=0;i<_5d7.length;++i){
if(STYLE_SELECTION[_5d7[i]]){
var node=STYLE_SELECTION[_5d7[i]];
node.parentNode.removeChild(node);
STYLE_SELECTION[_5d7[i]]=null;
}
}
if(isIE()&&typeof this.m_oCognosViewer.m_viewerFragment!="undefined"){
var _5da=document.getElementById("CVReport"+this.m_oCognosViewer.getId());
if(_5da!=null){
var _5db=_5da.style.display;
_5da.style.display="none";
_5da.style.display=_5db;
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
var _5df=(ss.cssRules?ss.cssRules:ss.rules);
for(var j=0;j<_5df.length;j++){
var cr=_5df[j];
var _5e2=new RegExp("\\b"+c+"\\b","g");
if(cr.selectorText&&cr.selectorText.match(_5e2)){
return cr;
}
}
}
return 0;
};
CSelectionController.prototype.canUpdateSelection=function(_5e3){
return this.m_selectionStyles.canApplyToSelection(_5e3);
};
CSelectionController.prototype.setStyleForSelection=function(_5e4){
return this.m_selectionStyles.setStyleForSelection(_5e4);
};
CSelectionController.prototype.updateUI=function(_5e5,_5e6,_5e7,_5e8){
if(!_5e5){
_5e5=document;
}
try{
if(_5e6&&_5e6.length>0){
var _5e9,_5ea,_5eb;
if(_5e8==1||_5e8==2){
if(_5e7){
this.deselecting(this.m_cutClass);
}else{
var _5ec=getStyleFromClass("cutSelection").style.color;
var _5ed=getStyleFromClass("cutSelection").style.backgroundColor;
_5e9=_5e6.length;
for(_5ea=0;_5ea<_5e9;_5ea++){
_5eb=_5e6[_5ea].getCellRef();
var _5ee="cutQS"+_5eb.getAttribute("cid");
this.selecting(_5ee,"\n{ background-color: "+_5ed+"; color: "+_5ec+";}\n");
this.m_cutClass.push(_5ee);
}
}
}else{
if(this.m_oCognosViewer){
this.findSelectionURLs();
_5eb="";
_5e9=_5e6.length;
for(_5ea=0;_5ea<_5e9;_5ea++){
_5eb=_5e6[_5ea].getCellRef();
if(_5eb.getAttribute("oldClassName")!=null){
_5eb.className=_5eb.getAttribute("oldClassName");
_5eb.removeAttribute("oldClassName");
}
this.setStyleForSelection(_5e6[_5ea].m_contextIds);
if(!this.secondarySelectionIsDisabled()||_5e7){
var _5ef=document.getElementById("CVReport"+this.getNamespace());
var _5f0=getElementsByAttribute(_5ef,["td","th"],"name",_5eb.getAttribute("name"),this.m_maxSecondarySelection);
for(var _5f1=0;_5f1<_5f0.length;_5f1++){
var cell=_5f0[_5f1];
if(_5e7){
this.restoreOldBackgroundImage(cell);
}else{
if(cell.getAttribute("oldBackgroundImageStyle")==null){
this.saveOldCellStyles(cell);
this.setSecondarySelectionStyles(cell);
}
}
}
}
this.saveOldCellStyles(_5eb);
if(_5e7){
this.restoreOldBackgroundImage(_5eb);
if(this.m_oCognosViewer.isHighContrast()){
this.restoreOldBorder(_5eb);
this.restoreOldPadding(_5eb);
}
}else{
this.setPrimarySelectionStyles(_5eb);
if(this.m_oCognosViewer.isHighContrast()){
var size=getBoxInfo(_5eb,true);
this.saveOldBorder(_5eb);
this.saveOldPadding(_5eb,size);
var _5f4=3;
var _5f5=size.borderTopWidth+size.paddingTop-_5f4;
var _5f6=size.borderBottomWidth+size.paddingBottom-_5f4;
var _5f7=size.borderLeftWidth+size.paddingLeft-_5f4;
var _5f8=size.borderRightWidth+size.paddingRight-_5f4;
_5eb.style.border=_5f4+"px "+this.getHighContrastBorderStyle()+" black";
_5eb.style.padding=_5f5+"px "+_5f8+"px "+_5f6+"px "+_5f7+"px";
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
CSelectionController.prototype.setSelectedChartImgArea=function(_5f9){
var _5fa=true;
var _5fb=_5f9.getAttribute("rsvpChart");
var _5fc=_5f9.parentNode.getAttribute("chartContainer");
if(_5fb!="true"&&_5fc!="true"){
this.m_selectedChartNodes=[];
_5fa=false;
}else{
var _5fd=this.getSelectionObjectFactory().getSelectionChartObject(_5f9);
this.m_selectedChartNodes=[_5fd];
}
return _5fa;
};
CSelectionController.prototype.setSelectedChartArea=function(_5fe,e){
var _600=typeof this.m_oCognosViewer.isBux!=="undefined";
var _601=false;
if(_5fe!==null){
if(_5fe.tagName=="IMG"){
_601=this.setSelectedChartImgArea(_5fe);
}else{
if(_5fe.nodeName=="AREA"&&_5fe.attributes["ctx"]){
_601=true;
if(_600){
this.setBuxSelectedChartArea(_5fe,e);
}else{
this.m_selectedChartNodes=[this.getSelectionObjectFactory().getSelectionChartObject(_5fe)];
}
}
}
if(_601){
this.getObservers().notify();
}
}
return _601;
};
CSelectionController.prototype.setBuxSelectedChartArea=function(_602,e){
var _604=this.getChartHelper(_602);
var _605=_604.getChartNode(_602);
this.setStyleForSelection(_605.m_contextIds);
var _606=_604.getImageMapHighlighter();
_606.setFillColour(this.getPrimarySelectionColor());
_606.setStrokeColour(this.getPrimarySelectionColor());
if(typeof e=="undefined"){
e={};
}
if(this.ctrlKeyPressed(e)||this.shiftKeyPressed(e)){
if(_606.isAreaHighlighted(_602)){
_606.hideAreas(_605.getCtxAreas());
var _607=_602.getAttribute("ctx");
var _608=this.m_selectedChartNodes.length;
for(var i=0;i<_608;i++){
var _60a=this.m_selectedChartNodes[i];
if(_607==_60a.getContext()){
this.m_selectedChartNodes.splice(i,1);
break;
}
}
}else{
this.updateSelectionContainer(_602);
_606.highlightAreas(_605.getCtxAreas(),true);
this.m_selectedChartNodes.push(_605);
}
}else{
if(this.hasSavedSelectedChartNodes()){
var _60b=this.m_savedSelectedChartNodes.length;
var _60c=this.m_savedSelectedChartNodes;
for(var i=0;i<_60b;i++){
var area=_60c[i].getArea();
var _60e=this.getSavedChartHelper(area);
var _60f=_60e.getImageMapHighlighter();
var _610=_60f.getAreaId(area);
if(_606.getAreaId(_602)===_610){
_60f.hideAreaById(_610+this.m_savedPrimarySelectionColor);
break;
}
}
}
this.updateSelectionContainer(_602);
_606.highlightAreas(_605.getCtxAreas());
this.m_selectedChartNodes=[_605];
}
};
CSelectionController.prototype.updateSelectionContainer=function(_611){
var _612=_611.parentNode;
if(this.m_selectionContainerMap&&this.m_selectionContainerMap.name!=_612.name){
var _613=this.getChartHelper(_611).getImageMapHighlighter();
_613.hideAllAreas();
}
this.m_selectionContainerMap=_612;
};
CSelectionController.prototype.getChartHelper=function(_614){
var _615=_614.parentNode;
var _616=_615.name;
if(!this.m_chartHelpers[_616]){
this.m_chartHelpers[_616]=new CChartHelper(_614,this.getSelectionObjectFactory(),this.m_oCognosViewer);
}
return this.m_chartHelpers[_616];
};
CSelectionController.prototype.getSavedChartHelper=function(_617){
var _618=_617.parentNode;
var _619=_618.name;
return this.m_savedChartHelpers[_619];
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
var _61a=null;
if(this.hasSelectedChartNodes()){
var _61b=this.m_selectedChartNodes[0];
_61a=_61b.getArea();
}
if(_61a===null){
return null;
}
if(_61a.tagName=="IMG"){
return _61a;
}
return this.getSelectedChartImageFromChartArea(_61a);
};
CSelectionController.prototype.getSelectedChartImageFromChartArea=function(_61c){
var _61d=_61c.parentNode;
var _61e="#"+_61d.getAttribute("name");
return this.checkChildrenForChart(_61d.parentNode,_61e);
};
CSelectionController.prototype.checkChildrenForChart=function(_61f,_620){
var _621=_61f.firstChild;
while(_621!==null){
if(!_621.tagName){
return null;
}else{
if(_621.tagName=="IMG"&&_621.getAttribute("usemap")==_620){
return _621;
}else{
if(_621.tagName==="DIV"||_621.tagName==="SPAN"){
var _622=this.checkChildrenForChart(_621,_620);
if(_622){
return _622;
}
}
}
}
_621=_621.nextSibling;
}
return null;
};
CSelectionController.prototype.downloadSelectedChartImage=function(_623){
var _624=this.getSelectedChartImage();
if(_624!==null){
var _625=this.getDocumentFromImage(_624);
var _626=_624.name.replace(".","_");
var _627=_626.substr(5);
var _628="?m_name=";
_628+=_627;
_628+="&format=png&b_action=xts.run&m=portal/download.xts&m_obj=";
if(isIE()){
_626=_625.parentWindow.eval("graphicSrc"+_627);
}else{
_626=_625.defaultView.eval("graphicSrc"+_627);
}
var _629="";
if(typeof _626!="undefined"&&_626!==null){
var _62a=_626.split("&");
if(_62a.length===0){
return;
}
if(_626.indexOf("/repository/")<0){
for(var i=0;i<_62a.length;++i){
var _62c=_62a[i];
var _62d=_62c.indexOf("=");
if(_62d!=-1){
var _62e=_62c.substr(0,_62d);
var _62f=_62c.slice(_62d+1);
if(_62e=="search"){
_629+=_62f;
break;
}
}
}
}
if(_629==""){
_628=_624.getAttribute("src");
if(_628.indexOf("?")!=-1){
_628+="&download=true";
}else{
_628+="?download=true";
}
}
if(typeof getConfigFrame=="function"){
_628+=_629;
_628=getConfigFrame().constructGETRequestParamsString(_628);
window.open(_628,"_blank","width=0,height=0");
}else{
_628=constructGETRequestParamsString(_628);
_628+=_629;
var _630=this.m_oCognosViewer.getGateway();
var _631=document.getElementById("CVIFrame"+this.m_sNamespace);
if(_631){
var _632=_631.src;
if(_632.indexOf("repository")>=0&&_628.indexOf("repository")<0){
var _633=_632.indexOf("content");
_628=_632.substring(0,_633)+_628;
}
}
if(_628.indexOf(_630)==-1){
var _634=document.forms["formWarpRequest"+_623];
_628=_634.action+_628;
}
if(typeof window.detachLeavingRV=="function"){
window.detachLeavingRV();
}
location.href=_628;
if(typeof window.attachLeavingRV=="function"){
setTimeout(window.attachLeavingRV,100);
}
}
}
}
};
CSelectionController.prototype.getDocumentFromImage=function(_635){
var _636=null;
if(_635.ownerDocument){
_636=_635.ownerDocument;
}else{
_636=_635.document;
}
return _636;
};
CSelectionController.prototype.shouldExecutePageClickedOnMouseDown=function(e){
var _638=this.getSelections();
if(_638.length>1){
if(this.m_oCognosViewer.envParams["ui.action"]!=="view"){
var node=getNodeFromEvent(e);
try{
while(node&&(node.nodeType==3||(node.getAttribute&&node.getAttribute("uid")===null))){
node=node.parentNode;
}
}
catch(ex){
}
var _63a=this.getSelectionObjectFactory().getContainerType(node);
if(_63a==="list"){
for(var i=0;i<_638.length;i++){
if(_638[i].m_oCellRef==node){
return false;
}
}
}
}
}
return true;
};
CSelectionController.prototype.getContainerType=function(){
var _63c="";
if(this.hasSelectedChartNodes()){
_63c="chart";
}else{
if(this.getDataContainerType()==="list"){
_63c="list";
}else{
_63c="crosstab";
}
}
return _63c;
};
CSelectionController.prototype.getDisplayValues=function(){
var _63d={};
var _63e=this.getAllSelectedObjects()[0];
if(_63e){
var _63f=_63e.getSelectedContextIds();
if(_63f){
for(var axis=0;axis<_63f.length;axis++){
var _641=[];
var _642=_63f[axis];
for(var _643=0;_643<_642.length;_643++){
var _644=_642[_643];
var _645=this.getDisplayValue(_644);
_641.push(_645);
if(axis===0){
break;
}
}
var _646="";
switch(axis){
case 0:
_646="selected";
break;
case 1:
_646="rows";
break;
default:
_646="columns";
}
_63d[_646]=_641;
}
}
}
return _63d;
};
CSelectionController.prototype.getChartTooltip=function(){
var _647=this.getAllSelectedObjects()[0];
if(_647){
var area=_647.getArea();
if(area){
var _649=area.getAttribute("title");
if(_649&&_649.length>0){
return area.getAttribute("title");
}
}
}
return "";
};
CSelectionController.prototype.pageClickedForMobile=function(e){
this.pageClicked(e);
var _64b=this.getAllSelectedObjects().length;
if(_64b==0){
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
var _64d=this.m_savedChartHelpers;
for(var _64e in _64d){
if(_64d[_64e]){
var _64f=_64d[_64e].getImageMapHighlighter();
if(_64f.hideAllAreas){
_64f.hideAllAreas();
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
var _650=this.m_aSelectedObjects.length;
var temp=[];
for(var i=0;i<_650;i++){
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
var _653=this.m_selectedChartNodes.length;
var temp=[];
for(var i=0;i<_653;i++){
if(this.isMeasure(this.m_selectedChartNodes[i].m_contextIds[0][0])){
var _654=this.m_selectedChartNodes[i].getArea();
var _655=this.getImageMapName(_654);
this.m_chartHelpers[_655]=this.m_savedChartHelpers[_655];
delete this.m_savedChartHelpers[_655];
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
CSelectionController.prototype.getImageMapName=function(_656){
var _657=_656.parentNode;
return _657.name;
};
CSelectionController.prototype.repaintBUXSelectedChartArea=function(_658,_659,_65a){
var _65b={};
var _65c=_658.length;
for(var i=0;i<_65c;i++){
var _65e=_658[i].getArea();
var _65f=this.getImageMapName(_65e);
var _660;
if(!_65b[_65f]){
_660=(_659)?this.getSavedChartHelper(_65e):this.getChartHelper(_65e);
_65b[_65f]=_660;
var _661=_660.getImageMapHighlighter();
_661.hideAllAreas();
_661.setFillColour(this.getPrimarySelectionColor());
_661.setStrokeColour(this.getPrimarySelectionColor());
}else{
_660=_65b[_65f];
}
var _662=_658[i].m_contextIds;
if(_65a&&_662.length===1&&_662[0].length===1&&this.isMeasure(_662[0][0])){
continue;
}
_661.highlightAreas(_658[i].getCtxAreas(),1);
}
};
CSelectionController.prototype.repaintSavedSelections=function(){
var _663=this.m_selectionStyles;
this.m_selectionStyles=this.m_savedSelectionStyles;
var _664=this.getSavedSelectedChartNodes();
var _665=false;
if(_664&&_664.length>0){
bIsChart=true;
}else{
_664=this.getSavedSelectedObjects();
}
this.repaintSelectionsHelper(_664,true,_665);
this.resetSelectionStyles();
this.m_selectionStyles=_663;
};
CSelectionController.prototype.repaintSelections=function(){
var _666=this.getSelectedChartNodes();
var _667=false;
if(_666&&_666.length>0){
_667=true;
}else{
_666=this.getSelections();
}
this.repaintSelectionsHelper(_666,false,_667);
};
CSelectionController.prototype.repaintSelectionsHelper=function(_668,_669,_66a){
try{
if(_66a){
this.repaintBUXSelectedChartArea(_668,_669);
}else{
this.updateUI(document,_668,true,false);
this.updateUI(document,_668,false,false);
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
var _66d=node;
if(!_66d.getAttribute("uid")){
var _66e=_66d.parentNode;
if(_66e&&_66e.nodeType==1&&typeof _66e.getAttribute!="undefined"&&_66e.getAttribute("uid")!=null){
_66d=_66e;
}
}
if(this.isCellSelected(_66d)){
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
var _66f=getDocumentFromEvent(e);
if(!this.hasContextData()||!this.hasMetadata()){
if(node.nodeName=="AREA"||node.nodeName=="IMG"||(typeof node.getAttribute=="function"&&node.getAttribute("flashChart")!=null)){
this.setSelectedChartArea(node,e);
}
this.getObservers().notify();
return false;
}
if(typeof node.selectedCell!="undefined"){
var _670=node;
node=node.selectedCell;
_670.removeAttribute("selectedCell");
}
if(typeof cf!="undefined"&&typeof cf.hidePickers=="function"){
cf.hidePickers();
}
if(e.keyCode==27){
if(typeof g_reportSelectionController!="undefined"){
g_reportSelectionController.clearSelections();
}
this.resetSelections(_66f);
}else{
if(node.nodeName=="AREA"||node.nodeName=="IMG"||(typeof node.getAttribute!="undefined"&&node.getAttribute("flashChart")!=null)){
if(e.button!==2||this.getAllSelectedObjects().length<=1||typeof this.m_oCognosViewer.isBux==="undefined"){
this.selectNode(node,e);
this.setSelectedChartArea(node,e);
}
}else{
if(!(node.firstChild==null&&node.cellIndex==0&&node.parentNode.rowIndex==0&&node.getAttribute("cid")==null)){
var _671=this.m_oCognosViewer.getViewerWidget();
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
CSelectionController.prototype.selectObject=function(sMun,sLun,sHun,_676){
var _677=this.getCtxIdFromMun(sMun);
if(_677==""){
_677=this.getCtxIdFromMetaData(sLun,sHun,_676);
}
if(_677!=null&&this.m_oCDManager.GetUsage(_677)!="2"){
var _678=document.getElementById("rt"+this.getNamespace());
if(_678!=null){
var _679=getElementsByAttribute(_678,"*","ctx",_677);
if(_679&&_679.length===0){
var _67a=new RegExp("(^|:)"+_677+"(:|$)","i");
_679=getElementsByAttribute(_678,"*","ctx",_677,-1,_67a);
}
var _67b=null;
if(_679!=null&&_679.length>0){
_67b=new CSelectionObject();
_67b.setSelectionController(this);
_67b.m_sColumnRef=_679[0].getAttribute("cid");
_67b.m_sCellTypeId=_679[0].getAttribute("uid");
_67b.m_sLayoutType=_679[0].getAttribute("type");
_67b.m_sTag=_679[0].getAttribute("tag");
_67b.m_layoutElementId=this.m_oSelectionObjectFactory.getLayoutElementId(_679[0]);
_67b.m_dataContainerType=this.m_oSelectionObjectFactory.getContainerType(_679[0]);
_67b.m_contextIds=[[_677]];
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_67b;
}else{
var _67c=getElementsByAttribute(_678,"*","flashChart","true");
if(_67c!=null){
for(var _67d=0;_67d<_67c.length;++_67d){
var ldx=_67c[_67d].getLDX();
if(ldx.indexOf("<ctx>"+_677+"</ctx>")!=-1){
_67b=new CSelectionObject();
_67b.setSelectionController(this);
var lid=_67c[_67d].getAttribute("lid");
_67b.m_layoutElementId=lid.replace(this.m_oCognosViewer.getId(),"");
_67b.m_dataContainerType="chart";
_67b.m_contextIds=[[_677]];
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_67b;
}
}
}
}
}
}
};
CSelectionController.prototype.buildSelectionObject=function(node,e){
var _682=null;
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
var _685=node.childNodes;
for(var i=0;i<_685.length;i++){
if(_685[i].nodeName.toUpperCase()=="TABLE"&&(_685[i].className=="ls"||_685[i].className=="xt")){
var trs=_685[i].rows;
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
_682=this.getSelectionObjectFactory().getSelectionObject(node,ctx);
}else{
_682=this.getSelectionObjectFactory().getSelectionObject(node);
}
}
}
catch(e){
}
return _682;
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
CSelectionController.prototype.isSelectionsPreviouslySaved=function(_68d){
var _68e=false;
if(!this.m_aSavedSelectedObjects||!this.m_aSavedSelectedObjects.length||!_68d||!_68d.length){
return false;
}
for(var i=0;i<_68d.length;i++){
if(this.isSavedCellSelected(_68d[i].getCellRef())){
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
var _692=null;
if(isIE()){
_692=node.document;
}else{
_692=node.ownerDocument;
}
var ctx=node.getAttribute("ctx");
var uid=node.getAttribute("uid");
var _695=false;
if(typeof e=="undefined"){
e={};
}
var _696=false;
if(typeof g_reportSelectionController!="undefined"){
_696=this.checkForReportElementNode(node);
}
if((ctx==null&&uid==null&&node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")==null&&_696==false)||(!this.ctrlKeyPressed(e)&&!this.shiftKeyPressed(e))){
if(this.getSelections().length>0){
_695=true;
}
if(this.hasCutColumns()==true){
this.clearSelectedObjects(_692);
}else{
this.resetSelections(_692);
this.repaintSavedSelections();
if(typeof cf!="undefined"&&typeof cf.removeAllSelectionsFromCfgVariables=="function"){
cf.removeAllSelectionsFromCfgVariables();
}
this.m_oCognosViewer.setCurrentNodeFocus(null);
}
if(this.ctrlKeyPressed(e)||this.shiftKeyPressed(e)){
clearTextSelection(_692);
}
if(typeof g_reportSelectionController!="undefined"&&_696==false){
if(g_reportSelectionController.getSelections().length>0){
_695=true;
}
g_reportSelectionController.clearSelections();
}
}
var _697=node.getAttribute("dtTargets")?node:null;
var _698=(node.nodeName.toLowerCase()==="area");
if((uid==null)&&((ctx!=null)||(node.parentNode&&node.parentNode.nodeType==1&&typeof node.parentNode.getAttribute!="undefined"))){
if(node.nodeName=="IMG"&&(node.src.indexOf("SM=")>-1||(isIE()>-1&&node.src.indexOf("space.gif")>-1))){
return false;
}
node=node.parentNode;
_697=(!_697&&node.getAttribute("dtTargets"))?node:_697;
if((node.className.toUpperCase()=="BLOCK"&&node.nodeName.toUpperCase()=="DIV")||(node.getAttribute("dtTargets")!=null)){
node=node.parentNode;
}
_697=(!_697&&typeof node.getAttribute!="undefined"&&node.getAttribute("dtTargets"))?node:_697;
uid=(typeof node.getAttribute!="undefined")?node.getAttribute("uid"):null;
if(uid==null&&node.nodeName.toLowerCase()=="span"&&node.parentNode.nodeName.toLowerCase()=="td"){
node=node.parentNode;
uid=node.getAttribute("uid");
}
}
if(uid!=null){
var _699=node.childNodes;
for(var i=0;i<_699.length;i++){
if(_699[i].nodeName.toUpperCase()=="TABLE"&&(_699[i].className=="ls"||_699[i].className=="xt")){
var trs=_699[i].rows;
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
var _69f;
if(node.className.toUpperCase()=="REPEATERTABLECELL"&&ctx!=null){
_69f=this.getSelectionObjectFactory().getSelectionObject(node,ctx);
}else{
_69f=this.getSelectionObjectFactory().getSelectionObject(node);
}
if(this.isCellSelected(node)==false){
if(this.shiftKeyPressed(e)){
var _6a0=this.getSelections();
if(_6a0.length>0){
var _6a1=_6a0[_6a0.length-1];
if(_6a1.getLayoutType()==_69f.getLayoutType()&&(_6a1.getCellRef().parentNode.parentNode==_69f.getCellRef().parentNode.parentNode)){
if(this.cellsAreInSameColumn(_6a1.getCellRef(),_69f.getCellRef())){
this.selectVertical(_6a1,_69f,_692);
}else{
if(_6a1.getCellRef().parentNode.rowIndex==_69f.getCellRef().parentNode.rowIndex){
this.selectHorizontal(_6a1,_69f,_692);
}
}
}
}
clearTextSelection(_692);
}else{
if(this.ctrlKeyPressed(e)){
clearTextSelection(_692);
}
}
this.addSelectionObject(_69f,_692);
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_69f.getColumnName());
}
this.m_oCognosViewer.setCurrentNodeFocus(node);
}else{
if(this.ctrlKeyPressed(e)){
this.removeSelectionObject(_69f,_692);
if(typeof cf!="undefined"&&typeof cf.removeSelectionFromCfgVariables=="function"){
if(!this.isColumnSelected(_69f.getTag())){
cf.removeSelectionFromCfgVariables(_69f.getTag());
}
}
clearTextSelection(_692);
}else{
if(this.shiftKeyPressed(e)){
clearTextSelection(_692);
}
}
}
_695=true;
}else{
if(_696){
var _6a2=null;
while((typeof node.id=="undefined"||node.id==null||node.id=="")&&node.parentNode!=null){
node=node.parentNode;
}
if(node.id=="reportTitle"){
_6a2="TitleStyle";
}else{
if(node.id=="reportSubtitle"){
_6a2="SubtitleStyle";
}else{
if(node.id.indexOf("reportFilter")==0){
_6a2="FilterStyle";
}
}
}
if(_6a2!=null){
selectReportElement(e,node.id,_6a2);
_695=true;
}
}else{
if(_697!=null&&this.m_oCognosViewer&&this.m_oCognosViewer.isMobile()&&!_698){
var _69f=this.getSelectionObjectFactory().getSelectionObject(_697);
this.addSelectionObject(_69f,_692);
}
}
}
if(_695==true&&(typeof cf!="undefined"&&typeof cf.refreshDialog=="function")){
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
CSelectionController.prototype.setupContextDataArray=function(_6a5){
this.m_aReportContextDataArray=_6a5;
};
CSelectionController.prototype.setupMetaDataArray=function(_6a6){
this.m_aReportMetadataArray=_6a6;
};
CSelectionController.prototype.addContextData=function(_6a7){
this.m_aSelectedObjects=[];
this.m_oCDManager.SetContextData(_6a7);
if(!this.m_bUsingCCDManager){
this.m_bUsingCCDManager=true;
}
for(var i=0;i<this.m_selectedClass.length;++i){
this.deselecting(this.m_selectedClass);
}
};
CSelectionController.prototype.addMetaData=function(_6a9){
this.m_aSelectedObjects=[];
this.m_oCDManager.SetMetadata(_6a9);
if(!this.m_bUsingCCDManager){
this.m_bUsingCCDManager=true;
}
};
CSelectionController.prototype.getDrillFlag=function(_6aa){
var _6ab="";
if(!this.m_bUsingCCDManager){
var _6ac=this.m_aReportContextDataArray[_6aa];
var _6ad=_6ac[0];
var _6ae=this.m_aReportMetadataArray[_6ad];
if(typeof _6ae!="undefined"&&typeof _6ae[3]!="undefined"){
_6ab=_6ae[3];
}
}else{
_6ab=this.m_oCDManager.GetDrillFlag(_6aa);
}
return _6ab;
};
CSelectionController.prototype.getDrillFlagForMember=function(_6af){
var _6b0="0";
if(!this.m_bUsingCCDManager){
var _6b1=this.getContextDataItem(_6af);
if(_6b1!=null){
var _6b2=_6b1[2];
if(_6b2!=""){
var _6b3=_6b1[0];
var _6b4=this.getMetaDataItem(_6b3);
if(_6b4!=null){
_6b0=_6b4[3];
}
}
}
}else{
_6b0=this.m_oCDManager.GetDrillFlagForMember(_6af);
}
return (_6b0==null)?0:_6b0;
};
CSelectionController.prototype.getDataType=function(_6b5){
var _6b6=null;
if(!this.m_bUsingCCDManager){
var _6b7=this.getRDI(_6b5);
if(_6b7&&_6b7.length>2){
_6b6=parseInt(_6b7[2],10);
}
}else{
_6b6=parseInt(this.m_oCDManager.GetDataType(_6b5),10);
}
return _6b6;
};
CSelectionController.prototype.getUsageInfo=function(_6b8){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetUsage(_6b8);
}
};
CSelectionController.prototype.isMeasure=function(_6b9){
return (this.getUsageInfo(_6b9)==this.c_usageMeasure);
};
CSelectionController.prototype.getDepth=function(_6ba){
var _6bb=null;
if(!this.m_bUsingCCDManager){
var _6bc=this.getRDI(_6ba);
if(_6bc&&_6bc.length>5&&_6bc[1]=="R"){
_6bb=_6bc[5];
}
}else{
_6bb=this.m_oCDManager.GetDepth(_6ba);
}
return _6bb;
};
CSelectionController.prototype.getUseValue=function(_6bd){
var _6be="";
if(!this.m_bUsingCCDManager){
var _6bf=this.m_aReportContextDataArray[_6bd];
if(typeof _6bf[1]!="undefined"){
_6be=_6bf[1];
}
}else{
_6be=this.m_oCDManager.GetDisplayValue(_6bd);
}
return _6be;
};
CSelectionController.prototype.getTextValue=function(_6c0){
var _6c1=null;
for(var _6c2=0;_6c2<_6c0.length;_6c2++){
if(_6c0[_6c2].style.visisbility!="hidden"){
if(isIE()){
_6c1=_6c0[_6c2].innerText;
}else{
_6c1=_6c0[_6c2].textContent;
}
var _6c3=_6c0[_6c2].nextSibling;
while(_6c3!=null){
if(_6c3.nodeName.toUpperCase()=="SPAN"&&_6c3.style.visibility!="hidden"){
if(isIE()){
_6c1+=_6c3.innerText;
}else{
_6c1+=_6c3.textContent;
}
}
_6c3=_6c3.nextSibling;
}
break;
}
}
return _6c1;
};
CSelectionController.prototype.getDisplayValueFromDOM=function(_6c4,_6c5){
var _6c6=null;
var _6c7;
var _6c8=new RegExp("(^|\\s)"+_6c4+"(\\s|$|:)","i");
if(typeof _6c5!="undefined"){
_6c7=getElementsByAttribute(_6c5,["span","td","th"],"ctx",_6c4,1,_6c8);
}else{
var _6c9=document.getElementById("CVIFrame"+this.m_sNamespace);
if(typeof _6c9=="undefined"||_6c9==null){
var _6ca=document.getElementById("RVContent"+this.m_sNamespace);
if(typeof _6ca=="undefined"||_6ca==null){
_6c7=getElementsByAttribute(document.body,["span","td","th"],"ctx",_6c4,1,_6c8);
}else{
_6c7=getElementsByAttribute(_6ca,["span","td","th"],"ctx",_6c4,1,_6c8);
}
}else{
_6c7=getElementsByAttribute(_6c9.contentWindow.document.body,["span","td","th"],"ctx",_6c4,1,_6c8);
}
}
var _6cb;
if(_6c7.length>0&&(_6c7[0].nodeName.toUpperCase()=="TD"||_6c7[0].nodeName.toUpperCase()=="TH")){
_6cb=_6c7[0].childNodes;
}else{
_6cb=_6c7;
}
if(_6cb.length==0||(_6cb[0].className.indexOf("chart_area")==-1&&_6cb[0].className.indexOf("bux-comment")==-1)){
_6c6=this.getTextValue(_6cb);
}
return _6c6;
};
CSelectionController.prototype.getDisplayValue=function(_6cc,_6cd){
var _6ce=this.getDisplayValueFromDOM(_6cc,_6cd);
if(_6ce==null){
_6ce=this.getUseValue(_6cc);
}
return _6ce;
};
CSelectionController.prototype.getDun=function(_6cf){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetDUN(_6cf);
}else{
var _6d0=this.m_aReportContextDataArray[_6cf];
if(_6d0&&typeof _6d0[5]!="undefined"){
var _6d1=_6d0[5];
var _6d2=this.m_aReportMetadataArray[_6d1];
if(typeof _6d2!="undefined"&&typeof _6d2[1]!="undefined"&&_6d2[1]=="D"){
return _6d2[0];
}
}
}
};
CSelectionController.prototype.getPun=function(_6d3){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetPUN(_6d3);
}
};
CSelectionController.prototype.getLun=function(_6d4){
var lun="";
if(!this.m_bUsingCCDManager){
var _6d6=this.m_aReportContextDataArray[_6d4];
if(_6d6&&typeof _6d6[3]!="undefined"){
var _6d7=_6d6[3];
var _6d8=this.m_aReportMetadataArray[_6d7];
if(typeof _6d8!="undefined"&&typeof _6d8[1]!="undefined"&&_6d8[1]=="L"){
lun=_6d8[0];
}
}
}else{
lun=this.m_oCDManager.GetLUN(_6d4);
}
return lun;
};
CSelectionController.prototype.isContextId=function(_6d9){
var _6da=false;
if(!this.m_bUsingCCDManager){
var _6db=this.m_aReportContextDataArray[_6d9];
_6da=(typeof _6db=="object");
}else{
this.m_oCDManager.FetchContextData([_6d9]);
_6da=this.m_oCDManager.ContextIdExists(_6d9);
}
return _6da;
};
CSelectionController.prototype.hasContextData=function(){
var _6dc=false;
if(!this.m_bUsingCCDManager){
if(this.m_aReportContextDataArray&&this.m_aReportContextDataArray.length&&this.m_aReportContextDataArray.length()>0){
return true;
}
}else{
_6dc=this.m_oCDManager.HasContextData();
}
return _6dc;
};
CSelectionController.prototype.hasMetadata=function(){
var _6dd=false;
if(!this.m_bUsingCCDManager){
if(this.m_aReportMetadataArray&&this.m_aReportMetadataArray.length&&this.m_aReportMetadataArray.length()>0){
return true;
}
}else{
_6dd=this.m_oCDManager.HasMetadata();
}
return _6dd;
};
CSelectionController.prototype.getDifferentCellIndex=function(_6de,_6df,_6e0){
for(var i=0;i<_6de.cells.length;i++){
if(this.getSelectionObjectFactory().getSelectionObject(_6de.cells[i]).getLayoutType()=="datavalue"){
break;
}
}
if(_6e0=="relative"){
return (_6df-i);
}else{
if(_6e0=="actual"){
return (_6df+i);
}
}
};
CSelectionController.prototype.cellsAreInSameColumn=function(_6e2,_6e3){
if(_6e2.parentNode.rowIndex==_6e3.parentNode.rowIndex){
return false;
}
if(_6e2.getAttribute("cid")===null){
if(_6e2.getAttribute("uid")===_6e3.getAttribute("uid")){
if(_6e2.getAttribute("type")!="datavalue"){
return true;
}else{
if(this.getDifferentCellIndex(_6e2.parentNode,_6e2.cellIndex,"relative")==this.getDifferentCellIndex(_6e3.parentNode,_6e3.cellIndex,"relative")){
return true;
}
}
}else{
return false;
}
}else{
if(_6e2.getAttribute("cid")===_6e3.getAttribute("cid")){
return true;
}else{
return false;
}
}
};
CSelectionController.prototype.selectVertical=function(_6e4,_6e5,_6e6){
if(!_6e6){
_6e6=document;
}
var _6e7=_6e4.getCellRef().parentNode;
var _6e8,i;
var _6ea=(_6e4.getCellRef().parentNode.rowIndex<_6e5.getCellRef().parentNode.rowIndex);
var _6eb=(_6e4.getCellRef().parentNode.cells.length-_6e4.getCellRef().cellIndex);
while(_6e7.rowIndex!=_6e5.getCellRef().parentNode.rowIndex){
if(_6ea){
_6e7=_6e7.nextSibling;
}else{
_6e7=_6e7.previousSibling;
}
if(_6e7==null){
break;
}
if(_6e7.cells.length>=_6eb){
for(i=0;i<_6e7.cells.length;i++){
if((_6e7.cells[i].getAttribute("type")==_6e4.getLayoutType())&&this.cellsAreInSameColumn(_6e4.getCellRef(),_6e7.cells[i])){
_6e8=this.getSelectionObjectFactory().getSelectionObject(_6e7.cells[i]);
if(this.addSelectionObject(_6e8,_6e6)){
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_6e8.getColumnName());
}
}
break;
}
}
}
}
};
CSelectionController.prototype.selectHorizontal=function(_6ec,_6ed,_6ee){
var _6ef="";
if(_6ec.getColumnRef()==null){
if(_6ec.getCellRef().getAttribute("uid")==_6ed.getCellRef().getAttribute("uid")){
_6ef=_6ec.getCellRef().getAttribute("uid");
}else{
return;
}
}
var _6f0,_6f1;
var _6f2=_6ed.getCellRef().parentNode;
var _6f3;
if(_6ed.getCellRef().cellIndex<_6ec.getCellRef().cellIndex){
_6f0=_6ed.getCellRef().cellIndex;
_6f1=_6ec.getCellRef().cellIndex;
}else{
_6f1=_6ed.getCellRef().cellIndex;
_6f0=_6ec.getCellRef().cellIndex;
}
for(var i=_6f0+1;i<_6f1;i++){
if(((_6ec.getColumnRef()!=null)&&(_6ec.getLayoutType()==_6ed.getLayoutType())&&(_6ec.getLayoutType()!="datavalue")||this.allowHorizontalDataValueSelection())||((_6ec.getColumnRef()==null)&&(_6f2.cells[i].getAttribute("uid")==_6ef))){
_6f3=this.getSelectionObjectFactory().getSelectionObject(_6f2.cells[i]);
if(this.addSelectionObject(_6f3,_6ee)){
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_6f3.getColumnName());
}
}
}
}
};
CSelectionController.prototype.pageDoubleClicked=function(e){
try{
var node=getNodeFromEvent(e);
if(typeof node.selectedCell!="undefined"){
var _6f7=node;
node=node.selectedCell;
_6f7.removeAttribute("selectedCell");
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
CSelectionController.prototype.setSelectionHoverNodes=function(_6fa){
this.m_aSelectionHoverNodes=_6fa;
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
var _6fe=this.getSelectionHoverNodes();
var _6ff=this.getAllSelectedObjects().length;
if(!(_6fe.length==1&&_6fe[0]==node)){
for(var i=0;i<_6fe.length;i++){
this.sortIconHover(_6fe[i],true);
if(_6ff==0){
this.pageChangeHover(_6fe[i],true);
}
}
this.setSelectionHoverNodes([]);
if(_6ff==0){
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
CSelectionController.prototype.sortIconHover=function(node,_702){
if(!this.isValidColumnTitle(node)){
return false;
}
var _703=this.getSortImgNode(node);
if(_703!=null&&_703!="undefined"){
if(_703.getAttribute("sortOrder")==="nosort"){
if(_702){
_703.style.visibility="hidden";
}else{
_703.style.visibility="visible";
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
CSelectionController.prototype.pageChangeHover=function(node,_707){
try{
if((node.getAttribute("ctx")!=null)||(node.parentNode&&node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")!=null)){
if(node.parentNode.nodeName.toLowerCase()!="tr"){
node=node.parentNode;
}
}
if(this.isValidColumnTitle(node)){
var _708=this.isColumnSelected(node.getAttribute("tag"));
if(!_708){
_708=this.isColumnCut(node.getAttribute("tag"));
}
if(!_708){
if(_707){
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
var _70a=node.getElementsByTagName("img");
for(var i=0;i<_70a.length;i++){
var sId=_70a[i].id.toString();
if(sId!=null&&sId.length>0&&sId.indexOf("sortimg")>=0){
node=_70a[i];
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
CSelectionController.prototype.getStyleProperty=function(node,_717){
if(node&&node.style&&node.style[_717]){
return node.style[_717];
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
var _71b=node;
node=node.selectedCell;
_71b.removeAttribute("selectedCell");
}
while(node!=null&&node.tagName!="TD"){
node=node.parentNode;
}
if(node!=null){
var _71c=this.getBackgroundImage(node);
this.findSelectionURLs();
if(this.getSelections().length==0||_71c!=this.pS_backgroundImageURL){
this.pageClicked(e);
}
}
if(typeof populateContextMenu!="undefined"){
populateContextMenu();
moveContextMenu(e);
}
var _71d=false;
if(this.showViewerContextMenu()){
if(typeof e.preventDefault=="function"){
e.preventDefault();
}
_71d=true;
}
return _71d;
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
CSelectionController.prototype.titleAreaContextMenu=function(e,_720,sId){
if(typeof populateContextMenu!="undefined"){
goWindowManager.getApplicationFrame().cfgSet("contextMenuType",_720);
goWindowManager.getApplicationFrame().cfgSet("contextMenuId",sId);
populateContextMenu(_720.toUpperCase());
moveContextMenu(e,_720.toUpperCase());
}
if(typeof e.preventDefault=="function"){
e.preventDefault();
}
return false;
};
CSelectionController.prototype.selectionsAreAllSameType=function(){
var _722=this.getSelections();
if(_722.length>0){
var _723=_722[0].getLayoutType();
for(var i=1;i<_722.length;i++){
if(_723!=_722[i].getLayoutType()){
return 0;
}
}
return 1;
}
return -1;
};
CSelectionController.prototype.selectionsAreAllOnSameColumn=function(){
var _725=this.getSelections();
var i=0;
if(_725.length>0){
var _727=_725[0].getColumnRef();
if(_727!=null&&_727!=""){
for(i=1;i<_725.length;i++){
if(_727!=_725[i].getColumnRef()){
return false;
}
}
}else{
var _728=_725[0].getCellTypeId();
for(i=1;i<_725.length;i++){
if(_728!=_725[i].getCellTypeId()){
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
var _72a=node.parentNode;
while(typeof _72a!="undefined"&&_72a!=null){
if(typeof _72a.className!="undefined"&&_72a.className!=null&&_72a.className.substr(0,2)=="ft"){
node=_72a;
break;
}else{
_72a=_72a.parentNode;
}
}
}else{
return false;
}
}
var _72b=node.className.substr(0,2);
if(_72b=="ta"||_72b=="ts"||_72b=="ft"){
return true;
}
}
return false;
};
CSelectionController.prototype.chartClicked=function(_72c){
this.setSelectedChartArea(_72c);
};
CSelectionController.prototype.processColumnTitleNode=function(_72d){
if(!_72d||!this.m_oCognosViewer.isBux){
return;
}
var _72e=_72d.getCellRef();
if(_72e.getAttribute("contextAugmented")=="true"||"list"!=_72d.getDataContainerType()||"columnTitle"!=_72d.getLayoutType()){
return;
}
var _72f=_72d.getSelectedContextIds();
var _730=false;
if(typeof _72f=="object"&&_72f!=null&&_72f.length>0){
if(this.isRelational(_72f)&&this.getQueryModelId(_72f[0][0])==null){
_730=true;
}else{
return;
}
}
var lid=_72e.parentNode.parentNode.parentNode.getAttribute("lid");
var _732=_72e.parentNode.nextSibling;
var _733=getChildElementsByAttribute(_732,"td","cid",_72e.getAttribute("cid"));
var _734=null;
var _735=true;
var _736;
if(_733.length>0){
var _737=_733[0];
var _738=_737.childNodes.length;
for(var _739=0;_739<_738;_739++){
var _73a=_737.childNodes[_739];
if(_73a.getAttribute&&((_73a.nodeName.toLowerCase()=="table"&&typeof _73a.getAttribute("lid")=="string")||_73a.nodeName.toLowerCase()=="map"||_73a.nodeName.toLowerCase()=="img"||_73a.getAttribute("chartcontainer")=="true")){
if(_739==0){
_735=false;
}
}else{
_736=[];
if(_73a.nodeName.toLowerCase()=="span"){
_736.push(_73a);
}
var _73b=_73a.getElementsByTagName?_73a.getElementsByTagName("span"):[];
for(var _73c=0;_73c<_73b.length;++_73c){
if(lid==getImmediateLayoutContainerId(_73b[_73c])){
_736.push(_73b[_73c]);
}
}
for(var _73d=0;_73d<_736.length;++_73d){
var _73e=_736[_73d];
if(_73e.nodeType==1&&_73e.nodeName.toLowerCase()=="span"&&_73e.style.visibility!="hidden"){
if(_73e.getAttribute("ctx")!=null&&_73e.getAttribute("ctx")!=""){
_734=_73e.getAttribute("ctx");
break;
}
}
}
}
}
}
if(_734!=null){
var _73f=_734.split("::")[0].split(":")[0];
if(!_730){
_736=_72e.getElementsByTagName("span");
if(_736.length!=0){
var _740=this.m_oCDManager.m_cd[_73f];
var _741=this.getTextValue(_736);
var _742={"u":_741===null?"":_741};
if(typeof _740!="undefined"){
if(typeof _740["r"]!="undefined"){
_742.r=_740["r"];
}
if(typeof _740["q"]!="undefined"){
_742.q=_740["q"];
}
if(typeof _740["i"]!="undefined"){
_742.i=_740["i"];
}
}
var _743="cloned"+_73f;
this.m_oCDManager.m_cd[_743]=_742;
_736[0].setAttribute("ctx",_743);
_72d=this.getSelectionObjectFactory().processCTX(_72d,_743);
}
}else{
var qmid=this.getQueryModelId(_73f);
if(qmid==null){
}
if(qmid!=null){
var _745=_72f[0][0];
this.m_oCDManager.m_cd[_745].i=this.m_oCDManager.m_cd[_73f].i;
return false;
}
}
}else{
_735=false;
}
if(!_735){
_72e.setAttribute("canSort","false");
}
_72e.setAttribute("contextAugmented","true");
};
CSelectionController.prototype.selectionsInSameDataContainer=function(){
try{
var _746=this.getAllSelectedObjects();
var _747=_746[0].getLayoutElementId();
for(var _748=1;_748<_746.length;_748++){
if(_747!=_746[_748].getLayoutElementId()){
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
var _749=this.getAllSelectedObjects();
var _74a=_749[0].getDataItems()[0][0];
for(var _74b=1;_74b<_749.length;_74b++){
if(_74a!=_749[_74b].getDataItems()[0][0]){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.isRelational=function(_74c){
try{
if(!_74c){
var _74d=this.getAllSelectedObjects()[0];
_74c=_74d.getSelectedContextIds();
}
for(var _74e=0;_74e<_74c.length;_74e++){
for(var _74f=0;_74f<_74c[_74e].length;_74f++){
var ctx=_74c[_74e][_74f];
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
var _754=this.getAllSelectedObjects();
for(var _755=0;_755<_754.length;_755++){
var _756=_754[_755];
if(_756.getLayoutType()!="columnTitle"||_756.isHomeCell()){
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
var _757=this.getAllSelectedObjects();
for(var _758=0;_758<_757.length;_758++){
var _759=_757[_758];
if(this.getUsageInfo(_759.getSelectedContextIds()[0][0])!=this.c_usageMeasure){
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
var _75a=this.getAllSelectedObjects();
if(_75a.length==0){
return false;
}
for(var _75b=0;_75b<_75a.length;_75b++){
var _75c=_75a[0];
if(_75c.getSelectedContextIds().length==0){
return false;
}
var _75d=_75c.getSelectedContextIds()[0][0];
var mun=this.getMun(_75d);
var _75f=this.getUsageInfo(_75d);
if(mun==null||typeof mun=="undefined"||mun.length==0||_75f==this.c_usageMeasure){
return false;
}
}
return true;
};
CSelectionController.prototype.areSelectionsMeasureOrCalculation=function(){
var _760=this.getAllSelectedObjects();
if(_760.length==0){
return false;
}
var _761=this.selectionsHaveCalculationMetadata();
for(var _762=0;_762<_760.length;_762++){
var _763=_760[_762];
var _764=_763.getSelectedContextIds()[0][0];
if(!this.isCalculationOrMeasure(_764,_761)){
return false;
}
}
return true;
};
CSelectionController.prototype.selectionsHaveCalculationMetadata=function(){
try{
var _765=this.getDataContainerType();
var _766=this.getAllSelectedObjects();
for(var _767=0;_767<_766.length;_767++){
var _768=_766[_767];
var _769=_768.getSelectedContextIds();
var _76a=_769[0][0];
var sHun=this.getHun(_76a);
if(!this.hasCalculationMetadata(_76a,_769,_765)){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.isCalculationOrMeasure=function(_76c,_76d){
var mun=this.getMun(_76c);
var _76f=this.getUsageInfo(_76c);
if(!(((mun==null||typeof mun=="undefined"||mun.length==0)&&_76d)||_76f==this.c_usageMeasure)){
return false;
}
return true;
};
CSelectionController.prototype.hasCalculationMetadata=function(_770,_771,_772){
var sHun=this.getHun(_770);
if(this.getUsageInfo(_770)!=this.c_usageMeasure){
if((this.isRelational(_771)&&this.getQueryModelId(_770)!=null)||(!this.isRelational(_771)&&_772=="list"&&(sHun&&sHun!=""))){
return false;
}
}
return true;
};
CSelectionController.prototype.selectionsAreDateTime=function(){
try{
var _774=this.getAllSelectedObjects();
for(var _775=0;_775<_774.length;_775++){
var _776=_774[_775];
var _777=_776.getSelectedContextIds();
var _778=_777[0][0];
var _779=this.getDataType(_778);
if(_779&&typeof this.m_ccl_dateTypes[_779]!=="undefined"){
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
var _77a=this.getAllSelectedObjects();
if(_77a===null||_77a.length<=0){
return null;
}
var _77b=this.m_oCognosViewer.getModelPath();
var _77c=[];
for(var i=0;i<_77a.length;i++){
var obj=_77a[i].getContextJsonObject(this,_77b);
_77c.push(obj);
}
return _77c;
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
function clearTextSelection(_77f){
if(!_77f){
_77f=document;
}
try{
if(typeof _77f.selection=="object"&&_77f.selection!==null){
_77f.selection.empty();
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
var _781;
try{
_781=getCognosViewerSCObjectRef(this.getCV().getId());
}
catch(e){
_781=null;
}
return _781;
};
CDrillManager.prototype.getSelectedObject=function(){
var _782=this.getSelectionController();
if(_782==null){
return null;
}
var _783=null;
var _784=null;
if(_782.hasSelectedChartNodes()){
_784=_782.getSelectedChartNodes();
}else{
_784=_782.getSelections();
}
if(_784&&_784.length==1){
_783=_784[0];
}
return _783;
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
CDrillManager.prototype.hasMuns=function(_785){
if(typeof _785=="undefined"){
_785=this.getSelectedObject();
}
if(_785==null){
return false;
}
var _786=_785.getMuns();
var muns="";
for(var _788=0;_788<_786.length&&muns=="";++_788){
if(typeof _786[_788][0]!="undefined"){
muns+=_786[_788][0];
}
}
return (muns!="");
};
CDrillManager.prototype.getRefQuery=function(){
var _789="";
var _78a=this.getSelectedObject();
if(_78a==null){
return "";
}
var _78b=_78a.getRefQueries();
for(var i=0;i<_78b.length;i++){
if(_78b[i]!=null){
for(var j=0;j<_78b[i].length;j++){
if(_78b[i][j]!=null&&_78b[i][j]!=""){
return _78b[i][j];
}
}
}
}
return _789;
};
CDrillManager.prototype.isIsolated=function(){
var _78e=this.getSelectionController();
if(_78e==null||_78e.getDrillUpDownEnabled()==false){
return false;
}
var _78f=this.getSelectedObject();
if(_78f==null){
return false;
}
if(_78f instanceof CSelectionChartObject&&_78e!=null){
var _790=_78f.getArea();
if(_790!=null){
var _791=_790.getAttribute("isolated");
if(typeof _791!="undefined"&&_791!=null&&_791=="true"){
return true;
}
}
}else{
var _792=_78f.getCellRef();
if(typeof _792=="object"&&_792!=null){
var _793=_792.getElementsByTagName("span");
if(_793!=null&&typeof _793!="undefined"&&_793.length>0){
var _794=_793[0].getAttribute("isolated");
if(_794!=null&&_794!="undefined"&&_794=="true"){
return true;
}
}
}
}
return false;
};
CDrillManager.prototype.getDrillOption=function(_795){
var _796=this.getSelectionController();
if(_796==null||_796.getDrillUpDownEnabled()==false||typeof _795=="undefined"){
return false;
}
var _797=this.getSelectedObject();
if(_797==null){
return false;
}
if(this.isIsolated()){
if(_795=="drillDown"){
return false;
}else{
if(_795=="drillUp"){
return true;
}
}
}
if(_795=="drillDown"){
if(_797 instanceof CSelectionChartObject&&_796!=null){
var _798=_797.getArea();
if(_798!=null){
var _799=_798.getAttribute("isChartTitle");
if(typeof _799!="undefined"&&_799!=null&&_799=="true"){
return false;
}
}
}
}
var _79a=_797.getDrillOptions();
var _79b=(typeof DrillContextMenuHelper!=="undefined"&&DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV));
for(var idx=0;idx<_79a.length;++idx){
var _79d=(_79b)?_79a[idx].length:1;
for(var _79e=0;_79e<_79d;++_79e){
var _79f=_79a[idx][_79e];
if(_79f=="3"){
return true;
}else{
if(_795=="drillUp"&&_79f=="1"){
return true;
}else{
if(_795=="drillDown"&&_79f=="2"){
return true;
}
}
}
}
}
return false;
};
CDrillManager.prototype.canDrillThrough=function(){
var _7a0=this.getSelectionController();
if(_7a0==null||_7a0.getModelDrillThroughEnabled()==false){
return false;
}
return true;
};
CDrillManager.prototype.singleClickDrillEvent=function(evt,app){
var _7a3=this.getSelectionController();
if(_7a3!=null){
if(this.getCV().bCanUseCognosViewerSelection==true){
_7a3.pageClicked(evt);
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
CDrillManager.prototype.getDrillParameters=function(_7a9,_7aa,_7ab,_7ac){
var _7ad=[];
var _7ae=this.getSelectedObject();
if(_7ae==null){
return _7ad;
}
if(typeof _7aa=="undefined"){
_7aa=true;
}
var _7af=_7ae.getDataItems();
var _7b0=_7ae.getMuns();
var _7b1=_7ae.getDimensionalItems("lun");
var _7b2=_7ae.getDimensionalItems("hun");
var _7b3=_7ae.getDrillOptions();
if(typeof _7af=="undefined"||typeof _7b0=="undefined"||typeof _7b3=="undefined"||_7b0==null||_7af==null||_7b3==null){
return _7ad;
}
if(_7b0.length!=_7af.length){
return _7ad;
}
var _7b4=_7b0.length;
for(var _7b5=0;_7b5<_7b4;++_7b5){
if(_7af[_7b5].length!=0){
var _7b6=(_7ac)?this.findUserSelectedDrillItem(_7ac,_7af[_7b5]):0;
if(_7b6<0){
continue;
}
if((_7ab===true)||this.getDrillOption(_7a9)){
if(_7b0[_7b5][_7b6]==""||_7ad.toString().indexOf(_7b0[_7b5][_7b6],0)==-1){
_7ad[_7ad.length]=_7af[_7b5][_7b6];
_7ad[_7ad.length]=_7b0[_7b5][_7b6];
if(_7aa===true){
_7ad[_7ad.length]=_7b1[_7b5][_7b6];
_7ad[_7ad.length]=_7b2[_7b5][_7b6];
}
}
}
}
}
return _7ad;
};
CDrillManager.prototype.findUserSelectedDrillItem=function(_7b7,_7b8){
for(var _7b9=0;_7b9<_7b8.length;++_7b9){
if(_7b7==_7b8[_7b9]){
return _7b9;
}
}
return -1;
};
CDrillManager.prototype.getModelDrillThroughContext=function(_7ba){
var _7bb="";
if(this.canDrillThrough()===true){
if(typeof gUseNewSelectionContext=="undefined"){
var _7bc="";
if(typeof getConfigFrame!="undefined"){
_7bc=decodeURIComponent(getConfigFrame().cfgGet("PackageBase"));
}else{
if(this.getCV().getModelPath()!==""){
_7bc=this.getCV().getModelPath();
}
}
_7bb=getViewerSelectionContext(this.getSelectionController(),new CSelectionContext(_7bc));
}else{
var _7bd=new CParameterValues();
var _7be=this.getSelectionController();
if(_7be){
var _7bf=_7be.getAllSelectedObjects();
for(var _7c0=0;_7c0<_7bf.length;++_7c0){
var _7c1=_7bf[_7c0];
var _7c2=_7c1.getMuns();
var _7c3=_7c1.getMetadataItems();
var _7c4=_7c1.getUseValues();
for(var _7c5=0;_7c5<_7c3.length;++_7c5){
for(var idx=0;idx<_7c3[_7c5].length;++idx){
if(_7c3[_7c5][idx]==null||_7c3[_7c5][idx]==""){
continue;
}
var name=_7c3[_7c5][idx];
var _7c8;
if(_7c2[_7c5][idx]!=null&&_7c2[_7c5][idx]!=""){
_7c8=_7c2[_7c5][idx];
}else{
_7c8=_7c4[_7c5][idx];
}
var _7c9=_7c4[_7c5][idx];
_7bd.addSimpleParmValueItem(name,_7c8,_7c9,"true");
}
}
}
}
var _7ca=_7ba.XMLBuilderCreateXMLDocument("context");
_7bb=_7bd.generateXML(_7ba,_7ca);
}
}
return _7bb;
};
CDrillManager.prototype.rvDrillUp=function(_7cb){
this.getCV().executeAction("DrillUp",_7cb);
};
CDrillManager.prototype.rvDrillDown=function(_7cc){
this.getCV().executeAction("DrillDown",_7cc);
};
CDrillManager.prototype.rvBuildXMLDrillParameters=function(_7cd,_7ce){
var _7cf=this.getDrillParameters(_7cd,true,false,_7ce);
if(_7cf.length==0){
return drillParams;
}
return this.buildDrillParametersSpecification(_7cf);
};
CDrillManager.prototype.buildDrillParametersSpecification=function(_7d0){
var _7d1="<DrillParameters>";
var idx=0;
while(idx<_7d0.length){
_7d1+="<DrillGroup>";
_7d1+="<DataItem>";
_7d1+=sXmlEncode(_7d0[idx++]);
_7d1+="</DataItem>";
_7d1+="<MUN>";
_7d1+=sXmlEncode(_7d0[idx++]);
_7d1+="</MUN>";
_7d1+="<LUN>";
_7d1+=sXmlEncode(_7d0[idx++]);
_7d1+="</LUN>";
_7d1+="<HUN>";
_7d1+=sXmlEncode(_7d0[idx++]);
_7d1+="</HUN>";
_7d1+="</DrillGroup>";
}
_7d1+="</DrillParameters>";
return _7d1;
};
CDrillManager.prototype.getAuthoredDrillsForCurrentSelection=function(){
var _7d3=null;
var _7d4=this.getAuthoredDrillThroughTargets();
if(_7d4.length>0){
var _7d5="<AuthoredDrillTargets>";
for(var _7d6=0;_7d6<_7d4.length;++_7d6){
_7d5+=eval("\""+_7d4[_7d6]+"\"");
}
_7d5+="</AuthoredDrillTargets>";
var cv=this.getCV();
var _7d8=cv.getAction("AuthoredDrill");
var _7d9=cv.getDrillTargets();
if(_7d9.length>0){
_7d3=_7d8.getAuthoredDrillThroughContext(_7d5,_7d9);
}
}
return _7d3;
};
CDrillManager.prototype.getAuthoredDrillsForGotoPage=function(){
var _7da="";
var _7db=this.getAuthoredDrillsForCurrentSelection();
if(_7db){
_7da=XMLBuilderSerializeNode(_7db);
}
return _7da;
};
CDrillManager.prototype.launchGoToPage=function(_7dc,_7dd){
var _7de=this.getSelectionController();
if((_7de!=null&&_7de.getModelDrillThroughEnabled()==true)||(typeof _7dc!="undefined"&&_7dc!=null&&_7dc!="")){
var _7df=this.getAuthoredDrillsForGotoPage();
var _7e0=this.getModelDrillThroughContext(self);
var form=document.getElementById("drillForm");
if(form!=null){
document.body.removeChild(form);
}
form=document.createElement("form");
var cvid=this.getCVId();
var _7e3=document.forms["formWarpRequest"+cvid];
form.setAttribute("id","drillForm");
form.setAttribute("name","drillForm");
form.setAttribute("target",_7e3.getAttribute("target"));
form.setAttribute("method","post");
form.setAttribute("action",_7e3.getAttribute("action"));
form.style.display="none";
document.body.appendChild(form);
if(this.getCV().getModelPath()!==""){
form.appendChild(createHiddenFormField("modelPath",this.getCV().getModelPath()));
}
if(typeof _7e3["ui.object"]!="undefined"&&_7e3["ui.object"].value!=""){
form.appendChild(createFormField("drillSource",_7e3["ui.object"].value));
}else{
if(typeof this.getCV().envParams["ui.spec"]!="undefined"){
form.appendChild(createFormField("sourceSpecification",this.getCV().envParams["ui.spec"]));
}
}
if(_7df!=""){
form.appendChild(createHiddenFormField("m","portal/drillthrough.xts"));
form.appendChild(createFormField("invokeGotoPage","true"));
form.appendChild(createFormField("m","portal/drillthrough.xts"));
form.appendChild(createFormField("modelDrillEnabled",_7de.getModelDrillThroughEnabled()));
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
form.appendChild(createHiddenFormField("drillTargets",_7df));
if(typeof gUseNewSelectionContext=="undefined"){
form.appendChild(createHiddenFormField("drillContext",_7e0));
}else{
form.appendChild(createHiddenFormField("modeledDrillthru",_7e0));
}
form.appendChild(createHiddenFormField("errURL","javascript:window.close();"));
if(typeof _7dd!="undefined"&&_7dd==true){
form.appendChild(this.createFormField("directLaunch","true"));
}
var _7e4="";
if(this.getCV().envParams["ui.routingServerGroup"]){
_7e4=this.getCV().envParams["ui.routingServerGroup"];
}
form.appendChild(createHiddenFormField("ui.routingServerGroup",_7e4));
if(this.getCV().getExecutionParameters()!=""){
form.appendChild(createHiddenFormField("encExecutionParameters",this.getCV().getExecutionParameters()));
}
if(_7e3.lang&&_7e3.lang.value!=""){
form.appendChild(createHiddenFormField("lang",_7e3.lang.value));
}
if(!this.getCV()||!this.getCV().launchGotoPageForIWidgetMobile(drillForm)){
if(typeof this.getCV().launchGotoPage==="function"){
this.getCV().launchGotoPage(form);
}else{
var _7e5="winNAT_"+(new Date()).getTime();
var _7e6=this.getCV().getWebContentRoot()+"/rv/blankDrillWin.html?cv.id="+cvid;
window.open(_7e6,_7e5,"toolbar,location,status,menubar,resizable,scrollbars=1");
form.target=_7e5;
}
}
}
};
CDrillManager.prototype.buildSearchPageXML=function(_7e7,pkg,_7e9,_7ea,_7eb,_7ec,_7ed){
var _7ee=null;
if(typeof _7e7.XMLElement=="function"){
_7ee=_7e7.XMLBuilderCreateXMLDocument("cognosSearch");
_7e7.XMLBuilderSetAttributeNodeNS(_7ee.documentElement,"xmlns:cs","http://developer.cognos.com/schemas/cs/1/");
var _7ef=_7ee.createElement("package");
if(typeof pkg=="string"&&pkg!==""){
_7ef.appendChild(_7ee.createTextNode(pkg));
}
_7ee.documentElement.appendChild(_7ef);
var _7f0=_7ee.createElement("model");
if(typeof _7e9=="string"&&_7e9!==""){
_7f0.appendChild(_7ee.createTextNode(_7e9));
}
_7ee.documentElement.appendChild(_7f0);
var _7f1=_7ee.createElement("selectedContext");
_7e7.XMLBuilderSetAttributeNodeNS(_7f1,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
_7e7.XMLBuilderSetAttributeNodeNS(_7f1,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
_7e7.XMLBuilderSetAttributeNodeNS(_7f1,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
_7e7.XMLBuilderSetAttributeNodeNS(_7f1,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
_7e7.XMLBuilderSetAttributeNodeNS(_7f1,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_7ee.documentElement.appendChild(_7f1);
for(var _7f2 in _7ea){
var _7f3=_7ee.createElement("item");
_7e7.XMLBuilderSetAttributeNodeNS(_7f3,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
var _7f4=_7e7.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",_7ee);
_7e7.XMLBuilderSetAttributeNodeNS(_7f4,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_7f4.appendChild(_7ee.createTextNode(_7ea[_7f2].name));
var _7f5=_7e7.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",_7ee);
_7e7.XMLBuilderSetAttributeNodeNS(_7f5,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_7e7.XMLBuilderSetAttributeNodeNS(_7f5,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
for(var j=0;j<_7ea[_7f2].values.length;j++){
var _7f7=_7ee.createElement("item");
_7e7.XMLBuilderSetAttributeNodeNS(_7f7,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
var _7f8=_7e7.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",_7ee);
_7e7.XMLBuilderSetAttributeNodeNS(_7f8,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_7f8.appendChild(_7ee.createTextNode(_7ea[_7f2].values[j][0]));
var _7f9=_7e7.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",_7ee);
_7e7.XMLBuilderSetAttributeNodeNS(_7f9,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
var _7fa=_7ea[_7f2].values[j][1]==null?"":_7ea[_7f2].values[j][1];
_7f9.appendChild(_7ee.createTextNode(_7fa));
_7f7.appendChild(_7f8);
_7f7.appendChild(_7f9);
_7f5.appendChild(_7f7);
}
_7f3.appendChild(_7f4);
_7f3.appendChild(_7f5);
_7f1.appendChild(_7f3);
}
var _7fb=_7ee.createElement("defaultMeasure");
_7ee.documentElement.appendChild(_7fb);
_7ec.buildXML(_7e7,_7ee,"data");
var _7fc=_7ee.createElement("filter");
_7ee.documentElement.appendChild(_7fc);
}
return _7ee;
};
CDrillManager.prototype.openSearchPage=function(_7fd,_7fe){
this.getModelDrillThroughContext(self);
var _7ff=document.getElementById("searchPage");
if(_7ff!=null){
document.body.removeChild(_7ff);
}
_7ff=document.createElement("form");
_7ff.setAttribute("id","searchPage");
_7ff.setAttribute("name","searchPage");
_7ff.setAttribute("method","post");
_7ff.setAttribute("target",_7ff.name);
_7ff.setAttribute("action",this.getCV().getGateway()+"/gosearch");
_7ff.style.display="none";
document.body.appendChild(_7ff);
_7ff.appendChild(createHiddenFormField("csn.action","search"));
_7ff.appendChild(createHiddenFormField("csn.drill",_7fe));
var _800=window.open("",_7ff.name,"directories=no,location=no,status=no,toolbar=no,resizable=yes,scrollbars=yes,top=100,left=100,height=480,width=640");
_800.focus();
_7ff.submit();
};
CDrillManager.prototype.launchSearchPage=function(){
var _801=this.getSelectionController();
var _802=document.forms["formWarpRequest"+this.getCVId()];
var _803=this.determineSelectionsForSearchPage(_801);
var _804=this.getSearchContextDataSpecfication(_801);
var _805=this.buildSearchPageXML(self,_802.packageBase.value,this.getCV().getModelPath(),_803,[],_804,[]);
this.openSearchPage(_802.packageBase.value,XMLBuilderSerializeNode(_805));
};
CDrillManager.prototype.qsDrillDown=function(){
if(!this.canDrillDown()){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _806="DD:";
this.qsSendDrillCommand(_806);
};
CDrillManager.prototype.qsDrillUp=function(){
if(!this.canDrillUp()){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _807="DU:";
this.qsSendDrillCommand(_807);
};
CDrillManager.prototype.qsSendDrillCommand=function(_808){
var _809;
if(_808=="DU:"){
_809="drillUp";
}else{
_809="drillDown";
}
var _80a=this.getDrillParameters(_809,false,false);
if(_80a.length==0){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
for(var idx=0;idx<_80a.length;++idx){
_808+=getConfigFrame().escapeParam(_80a[idx]);
if(idx+1<_80a.length){
_808+=",";
}
}
getConfigFrame().sendCmd(_808,"",true);
};
CDrillManager.prototype.qsLaunchGoToPage=function(_80c){
var _80d=this.getSelectionController();
if(_80d!=null&&_80d.getModelDrillThroughEnabled()==true){
var _80e=this.getModelDrillThroughContext(cf);
if(_80e==""){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _80f=document.getElementById("gotoPage");
if(_80f!=null){
document.body.removeChild(_80f);
}
_80f=document.createElement("form");
_80f.setAttribute("id","gotoPage");
_80f.setAttribute("name","gotoPage");
_80f.setAttribute("method","post");
_80f.style.display="none";
document.body.appendChild(_80f);
var _810=getConfigFrame();
_80f.appendChild(this.createFormField("objpath",decodeURIComponent(_810.cfgGet("PackageBase"))));
if(typeof gUseNewSelectionContext=="undefined"){
_80f.appendChild(this.createFormField("m","portal/goto2.xts"));
}else{
_80f.appendChild(this.createFormField("m","portal/goto.xts"));
}
_80f.appendChild(this.createFormField("b_action","xts.run"));
if(typeof gUseNewSelectionContext=="undefined"){
_80f.appendChild(this.createFormField("drillContext",_80e));
}else{
_80f.appendChild(this.createFormField("modeledDrillthru",_80e));
}
if(typeof getConfigFrame().routingServerGroup!="undefined"){
_80f.appendChild(this.createFormField("ui.routingServerGroup",getConfigFrame().routingServerGroup));
}
if(typeof _80c!="undefined"&&_80c==true){
_80f.appendChild(this.createFormField("directLaunch","true"));
}
var _811=_810.goApplicationManager.getReportManager().getParameterManager().getExecutionParameters();
if(_811){
_80f.appendChild(this.createFormField("encExecutionParameters",_811));
}
var _812="winNAT_"+(new Date()).getTime();
var _813=this.getCV().getWebContentRoot()+"/rv/blankDrillWin.html?cv.id="+this.getCVId();
window.open(_813,_812,"toolbar,location,status,menubar,resizable,scrollbars=1");
_80f.target=_812;
}
};
CDrillManager.prototype.qsLaunchSearchPage=function(){
var cf=getConfigFrame();
var _815=goWindowManager.getSelectionController();
var _816=this.determineSelectionsForSearchPage(_815);
var _817=this.getSearchContextDataSpecfication(_815);
var _818=decodeURIComponent(cf.cfgGet("PackageBase"));
var _819=this.buildSearchPageXML(cf,_818,decodeURIComponent(cf.cfgGet("cmLastModel")),_816,[],_817,[]);
this.openSearchPage(_818,cf.XMLBuilderSerializeNode(_819));
};
CDrillManager.prototype.determineSelectionsForSearchPage=function(_81a){
var _81b=new CtxArrayPlaceHolder();
var _81c=_81a.getAllSelectedObjects();
for(var i=0;i<_81c.length;i++){
var _81e=_81c[i].getColumnName();
if(!this.containsByIndiceInArray(_81b,_81e)){
_81b[_81e]={};
_81b[_81e].name=_81e;
_81b[_81e].values=[];
}
var idx0="";
var muns=_81c[i].getMuns();
if(muns!=null&&muns.length>0){
idx0=muns[0][0];
}
var idx1=_81c[i].getDisplayValues()[0];
if(!(this.containsInArray(_81b[_81e].values,0,idx0)&&this.containsInArray(_81b[_81e].values,1,idx1))){
_81b[_81e].values[_81b[_81e].values.length]=[idx0,idx1];
}
}
return _81b;
};
CDrillManager.prototype.getSearchContextDataSpecfication=function(_822){
var _823=new CParameterValues();
var _824=_822.getCCDManager();
var _825=_824.m_cd;
for(var _826 in _825){
var _827=_824.GetUsage(_826);
if(_827!="2"){
var _828=_824.GetRDIValue(_826);
var _829=_824.GetDisplayValue(_826);
_823.addSimpleParmValueItem(_828,_828,_829,"true");
}
}
return _823;
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
CDrillManager.prototype.createFormField=function(name,_832){
var _833=document.createElement("input");
_833.setAttribute("type","hidden");
_833.setAttribute("name",name);
_833.setAttribute("value",_832);
return (_833);
};
CDrillManager.prototype.getAuthoredDrillThroughTargets=function(){
var _834=[];
var _835=this.getSelectionController();
var _836=null;
if(_835!=null){
if(_835.getSelectedColumnIds().length==1){
var _837=_835.getSelections();
for(var _838=0;_838<_837.length;++_838){
var _839=_837[_838];
_836=_839.getCellRef();
while(_836){
if(_836.getAttribute("dtTargets")!=null){
_834.push("<rvDrillTargets>"+_836.getAttribute("dtTargets")+"</rvDrillTargets>");
break;
}
_836=XMLHelper_GetFirstChildElement(_836);
}
}
}else{
if(_835.hasSelectedChartNodes()){
var _83a=_835.getSelectedChartNodes();
var _83b=_83a[0];
_836=_83b.getArea();
if(_836.getAttribute("dtTargets")!=null){
_834.push("<rvDrillTargets>"+_836.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}else{
if(_835.getSelectedDrillThroughImage()!=null){
var _83c=_835.getSelectedDrillThroughImage();
if(_83c&&_83c.getAttribute("dtTargets")!=null){
_834.push("<rvDrillTargets>"+_83c.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}else{
if(_835.getSelectDrillThroughSingleton()!=null){
var _83d=_835.getSelectDrillThroughSingleton();
if(_83d&&_83d.getAttribute("dtTargets")!=null){
_834.push("<rvDrillTargets>"+_83d.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}
}
}
}
}
return _834;
};
CDrillManager.prototype.getDrillThroughParameters=function(_83e,evt){
if(typeof _83e=="undefined"){
_83e="query";
}
var _840=[];
if(typeof evt!="undefined"){
var _841=getCrossBrowserNode(evt,true);
try{
while(_841){
if(typeof _841.getAttribute!="undefined"&&_841.getAttribute("dtTargets")){
_840.push("<rvDrillTargets>"+_841.getAttribute("dtTargets")+"</rvDrillTargets>");
break;
}
_841=_841.parentNode;
}
}
catch(e){
return false;
}
}else{
var oCV=this.getCV();
var _843=oCV.getDrillMgr();
var _844=_843.getSelectionController();
if(_844!=null){
var _845=null;
if(_844.hasSelectedChartNodes()){
var _846=_844.getSelectedChartNodes();
var _847=_846[0];
_845=_847.getArea();
}
if(_845!=null){
_840.push("<rvDrillTargets>"+_845.getAttribute("dtTargets")+"</rvDrillTargets>");
}else{
_840=this.getAuthoredDrillThroughTargets();
}
}
}
if(_840.length>0){
var _848="<AuthoredDrillTargets>";
for(var _849=0;_849<_840.length;++_849){
_848+=eval("\""+_840[_849]+"\"");
}
_848+="</AuthoredDrillTargets>";
var _84a=this.getCV().getAction("AuthoredDrill");
if(_83e=="query"){
_84a.populateContextMenu(_848);
this.showOtherMenuItems();
}else{
if(this.getCV().envParams["cv.id"]=="AA"){
this.getCV().m_viewerFragment.raiseAuthoredDrillClickEvent();
}else{
_84a.execute(_848);
}
}
return true;
}else{
if(_83e=="query"){
this.showOtherMenuItems();
return true;
}else{
return false;
}
}
};
CDrillManager.prototype.executeAuthoredDrill=function(_84b){
var _84c=decodeURIComponent(_84b);
var _84d=this.getCV().getAction("AuthoredDrill");
_84d.executeDrillTarget(_84c);
};
CDrillManager.prototype.doesMoreExist=function(_84e){
for(var i=0;i<_84e.getNumItems();i++){
var _850=_84e.get(i);
if(_850!=null){
if((_850 instanceof CMenuItem)&&(_850.getLabel()==RV_RES.RV_MORE)&&(_850.getAction()==this.getCVObjectRef()+".getDrillMgr().launchGoToPage();")){
return true;
}
}
}
return false;
};
CDrillManager.prototype.showOtherMenuItems=function(){
var cv=this.getCV();
var _852=cv.rvMainWnd;
var _853=_852.getToolbarControl();
var _854=null;
var _855=null;
if(typeof _853!="undefined"&&_853!=null){
_854=_853.getItem("goto");
if(_854){
_855=_854.getMenu();
}
}
var _856=_852.getContextMenu();
var _857=_852.getUIHide();
var _858=null;
if(typeof _856!="undefined"&&_856!=null&&_856.getGoToMenuItem()){
_858=_856.getGoToMenuItem().getMenu();
}
var _859=null;
var _85a=this.getSelectionController();
if(_855!=null){
if(this.doesMoreExist(_855)==false){
if(typeof gMenuSeperator!="undefined"&&_855.getNumItems()>0&&(cv.bCanUseCognosViewerIndexSearch||_857.indexOf(" RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ")==-1)){
_855.add(gMenuSeperator);
}
var _85b=new CMenuItem(_855,RV_RES.RV_MORE,this.getCVObjectRef()+".getDrillMgr().launchGoToPage();","",gMenuItemStyle,cv.getWebContentRoot(),cv.getSkin());
if(_857.indexOf(" RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ")!=-1){
_85b.hide();
}else{
if(_85a==null||_85a.getModelDrillThroughEnabled()==false){
_85b.disable();
}
}
}
}
if(_858!=null){
if(typeof gMenuSeperator!="undefined"&&_858.getNumItems()>0&&(cv.bCanUseCognosViewerIndexSearch||_857.indexOf(" RV_CONTEXT_MENU_GOTO_RELATED_LINKS ")==-1)){
_858.add(gMenuSeperator);
}
var _85c=new CMenuItem(_858,RV_RES.RV_MORE,this.getCVObjectRef()+".getDrillMgr().launchGoToPage();","",gMenuItemStyle,cv.getWebContentRoot(),cv.getSkin());
if(_857.indexOf(" RV_CONTEXT_MENU_GOTO_RELATED_LINKS ")!=-1){
_85c.hide();
}else{
if(_85a==null||_85a.getModelDrillThroughEnabled()==false){
_85c.disable();
}
}
}
if(_859!=null&&_85a!=null){
var _85d=_85a.getAllSelectedObjects();
if(_85d==null||_85d.length===0){
_859.disable();
}
}
if(_855!=null){
_855.draw();
if(_855.isVisible()){
_855.show();
}
}
if(_858!=null){
_858.draw();
if(_858.isVisible()){
_858.show();
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
var _860=this.getSelectionController();
if(_860!=null){
var _861=_860.getSelectionObjectFactory().getSelectionChartObject(node);
if(_861!=null){
var _862=_861.getDrillOptions();
for(var idx=0;idx<_862.length;++idx){
var _864=_862[idx][0];
if((node.getAttribute("isChartTitle")==="true"&&_864=="1")||_864=="3"||_864=="2"){
node.className="dl "+node.className;
node.setAttribute("href","#");
break;
}
}
}
}
}
};
function CDrillThroughTarget(_865,_866,_867,_868,_869,path,_86b,_86c,_86d,_86e,_86f,_870){
this.m_label=_865;
this.m_outputFormat=_866;
this.m_outputLocale=_867;
this.m_showInNewWindow=_868;
this.m_method=_869;
this.m_path=path;
this.m_bookmark=_86b;
this.m_parameters=_86c;
this.m_objectPaths=_86d;
this.m_prompt="false";
this.m_dynamicDrillThrough=false;
this.m_parameterProperties=_870;
if(typeof _86e!="undefined"&&_86e!=null){
if(_86e=="yes"){
this.m_prompt="true";
}else{
if(_86e=="target"){
this.m_prompt="";
}
}
}
if(typeof _86f!="undefined"&&_86f!=null){
if(typeof _86f=="string"){
_86f=_86f=="true"?true:false;
}
this.m_dynamicDrillThrough=_86f;
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
function sXmlEncode(_871){
var _872=""+_871;
if((_872=="0")||((_871!=null)&&(_871!=false))){
_872=_872.replace(/&/g,"&amp;");
_872=_872.replace(/</g,"&lt;");
_872=_872.replace(/>/g,"&gt;");
_872=_872.replace(/"/g,"&quot;");
_872=_872.replace(/'/g,"&apos;");
}else{
if(_871==null){
_872="";
}
}
return _872;
};
function createFormField(name,_874){
var _875=document.createElement("input");
_875.setAttribute("type","hidden");
_875.setAttribute("name",name);
_875.setAttribute("value",_874);
return (_875);
};
function setBackURLToCloseWindow(_876){
var _877=_876.childNodes;
if(_877){
for(var _878=0;_878<_877.length;++_878){
var _879=_877[_878];
var _87a=_879.getAttribute("name");
if(_87a&&_87a=="ui.backURL"){
_876.removeChild(_879);
}
}
}
_876.appendChild(createFormField("ui.backURL","javascript:window.close();"));
};
function doMultipleDrills(_87b,cvId){
if(parent!=this&&parent.doMultipleDrills){
if(getCVId()!=""&&getCVId()!=cvId){
cvId=getCVId();
}
return parent.doMultipleDrills(_87b,cvId);
}else{
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Targets",_87b,"text");
}
var oCV=null;
try{
oCV=getCognosViewerObjectRef(cvId);
}
catch(exception){
}
var _87e=buildDrillForm(oCV);
addDrillEnvironmentFormFields(_87e,oCV);
if(typeof oCV!="undefined"&&oCV!=null){
var _87f=oCV.getModelPath();
_87e.appendChild(createFormField("modelPath",_87f));
var _880=oCV.getSelectionController();
var _881="";
if(typeof getViewerSelectionContext!="undefined"&&typeof CSelectionContext!="undefined"){
_881=getViewerSelectionContext(_880,new CSelectionContext(_87f));
}
_87e.appendChild(createFormField("drillContext",_881));
_87e.appendChild(createFormField("modelDrillEnabled",_880.getModelDrillThroughEnabled()));
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"&&document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value!=""){
_87e.appendChild(createFormField("drillSource",document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value));
}else{
if(typeof oCV.envParams["ui.spec"]!="undefined"){
_87e.appendChild(createFormField("sourceSpecification",oCV.envParams["ui.spec"]));
}
}
}
_87e.setAttribute("launchGotoPage","true");
_87e.appendChild(createFormField("drillTargets",_87b));
_87e.appendChild(createFormField("invokeGotoPage","true"));
_87e.appendChild(createFormField("m","portal/drillthrough.xts"));
_87e.appendChild(createFormField("b_action","xts.run"));
var _882="winNAT_"+(new Date()).getTime();
var _883="..";
if(oCV!=null){
_883=oCV.getWebContentRoot();
var _884=oCV.getExecutionParameters();
if(_884!=""){
_87e.appendChild(createFormField("encExecutionParameters",_884));
}
}
if(!oCV||!oCV.launchGotoPageForIWidgetMobile(_87e)){
if(oCV&&typeof oCV.launchGotoPage==="function"){
oCV.launchGotoPage(_87e);
}else{
var _885=_883+"/rv/blankDrillWin.html";
_87e.target=_882;
window.open(_885,_882);
}
}
}
};
function buildDrillForm(oCV){
var _887=document.getElementById("drillForm");
if(_887){
document.body.removeChild(_887);
}
_887=document.createElement("form");
if(typeof oCV!="undefined"&&oCV!=null){
var _888=document.getElementById("formWarpRequest"+oCV.getId());
_887.setAttribute("target",_888.getAttribute("target"));
_887.setAttribute("action",_888.getAttribute("action"));
}else{
_887.setAttribute("action",location.pathname);
}
_887.setAttribute("id","drillForm");
_887.setAttribute("name","drillForm");
_887.setAttribute("method","post");
_887.style.display="none";
document.body.appendChild(_887);
return _887;
};
function addDrillEnvironmentFormFields(_889,oCV){
if(window.g_dfEmail){
_889.appendChild(createFormField("dfemail",window.g_dfEmail));
}
if(oCV!=null){
_889.appendChild(createFormField("cv.id",oCV.getId()));
if(typeof oCV.envParams["ui.sh"]!="undefined"){
_889.appendChild(createFormField("ui.sh",oCV.envParams["ui.sh"]));
}
if(oCV.getViewerWidget()==null){
if(typeof oCV.envParams["cv.header"]!="undefined"){
_889.appendChild(createFormField("cv.header",oCV.envParams["cv.header"]));
}
if(typeof oCV.envParams["cv.toolbar"]!="undefined"){
_889.appendChild(createFormField("cv.toolbar",oCV.envParams["cv.toolbar"]));
}else{
var _88b=oCV.getAdvancedServerProperty("VIEWER_PASS_PORTLET_TOOLBAR_STATE_ON_DRILLTHROUGH");
if(oCV.m_viewerFragment&&_88b!=null&&_88b===true){
var _88c=oCV.m_viewerFragment.canShowToolbar()?"true":"false";
_889.appendChild(createFormField("cv.toolbar",_88c));
}
}
}
if(typeof oCV.envParams["ui.backURL"]!="undefined"){
_889.appendChild(createFormField("ui.backURL",oCV.envParams["ui.backURL"]));
}
if(typeof oCV.envParams["ui.postBack"]!="undefined"){
_889.appendChild(createFormField("ui.postBack",oCV.envParams["ui.postBack"]));
}
if(typeof oCV.envParams["savedEnv"]!="undefined"){
_889.appendChild(createFormField("savedEnv",oCV.envParams["savedEnv"]));
}
if(typeof oCV.envParams["ui.navlinks"]!="undefined"){
_889.appendChild(createFormField("ui.navlinks",oCV.envParams["ui.navlinks"]));
}
if(typeof oCV.envParams["lang"]!="undefined"){
_889.appendChild(createFormField("lang",oCV.envParams["lang"]));
}
if(typeof oCV.envParams["ui.errURL"]!="undefined"){
_889.appendChild(createFormField("ui.errURL",oCV.envParams["ui.errURL"]));
}
var _88d="";
if(oCV.envParams["ui.routingServerGroup"]){
_88d=oCV.envParams["ui.routingServerGroup"];
}
_889.appendChild(createHiddenFormField("ui.routingServerGroup",_88d));
}else{
_889.appendChild(createFormField("cv.header","false"));
_889.appendChild(createFormField("cv.toolbar","false"));
}
};
function appendReportHistoryObjects(oCV,_88f){
if(oCV!=null&&typeof oCV.rvMainWnd!="undefined"&&_88f!=null){
oCV.rvMainWnd.addCurrentReportToReportHistory();
var _890=oCV.rvMainWnd.saveReportHistoryAsXML();
_88f.appendChild(createFormField("cv.previousReports",_890));
}
};
function doSingleDrill(_891,args,_893,_894,_895,_896,_897,_898,cvId,_89a,_89b){
var _89c="";
if(typeof cvId=="string"){
_89c=cvId;
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
return parent.doSingleDrill(_891,args,_893,_894,_895,_896,_897,_898,cvId,_89a,_89b);
}else{
if(typeof _893=="undefined"){
_893="default";
}else{
if(_893=="execute"){
_893="run";
}
}
if(_893=="edit"&&oCV!=null&&typeof oCV.m_viewerFragment){
_891="_blank";
}
var _89e=buildDrillForm(oCV);
var _89f="<authoredDrillRequest>";
_89f+="<param name=\"action\">"+sXmlEncode(_893)+"</param>";
_89f+="<param name=\"target\">"+sXmlEncode(args[0][1])+"</param>";
_89f+="<param name=\"format\">"+sXmlEncode(_894)+"</param>";
_89f+="<param name=\"locale\">"+sXmlEncode(_895)+"</param>";
_89f+="<param name=\"prompt\">"+sXmlEncode(_89a)+"</param>";
_89f+="<param name=\"dynamicDrill\">"+sXmlEncode(_89b)+"</param>";
if(typeof oCV!="undefined"&&oCV!=null){
_89f+="<param name=\"sourceTracking\">"+oCV.getTracking()+"</param>";
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"){
_89f+="<param name=\"source\">"+sXmlEncode(document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value)+"</param>";
}
var _8a0=oCV.getModelPath();
_89f+="<param name=\"metadataModel\">"+sXmlEncode(_8a0)+"</param>";
_89f+="<param name=\"selectionContext\">"+sXmlEncode(getViewerSelectionContext(oCV.getSelectionController(),new CSelectionContext(_8a0)))+"</param>";
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"&&document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value!=""){
_89f+="<param name=\"source\">"+sXmlEncode(document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value)+"</param>";
}else{
if(typeof oCV.envParams["ui.spec"]!="undefined"){
_89f+="<param name=\"sourceSpecification\">"+sXmlEncode(oCV.envParams["ui.spec"])+"</param>";
}
}
}
if(_896!=""){
_89f+="<param name=\"bookmark\">"+_896+"</param>";
}
if(_893!="view"){
if(typeof _897!="undefined"){
_89f+="<param name=\"sourceContext\">"+sXmlEncode(_897)+"</param>";
}
if(typeof _898!="undefined"){
_89f+="<param name=\"objectPaths\">"+sXmlEncode(_898)+"</param>";
}
}
var _8a1=0;
_89f+="<drillParameters>";
var _8a2=[];
for(_8a1=1;_8a1<args.length;_8a1++){
var sSel=args[_8a1][1];
if(_894=="HTML"&&(sSel.indexOf("<selectChoices")==0)){
var _8a4=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(args[_8a1][1])));
if(_8a4){
var sMun=_8a4.getAttribute("mun");
if(sMun!=null&&sMun!=""){
_8a4.setAttribute("useValue",sMun);
sSel="<selectChoices>"+XMLBuilderSerializeNode(_8a4)+"</selectChoices>";
}
}
}
var _8a6=args[_8a1][0];
var _8a7=false;
for(var i=0;i<_8a2.length;i++){
var _8a9=_8a2[i];
if(_8a9.name===_8a6&&_8a9.value===sSel){
_8a7=true;
break;
}
}
if(!_8a7){
_8a2.push({"name":_8a6,"value":sSel});
_89f+="<param name=\""+sXmlEncode(_8a6)+"\">"+sXmlEncode(sSel)+"</param>";
}
}
_89f+="</drillParameters>";
_89f+=getExecutionParamNode(oCV);
_89f+="</authoredDrillRequest>";
_89e.appendChild(createFormField("authoredDrill.request",_89f));
_89e.appendChild(createFormField("ui.action","authoredDrillThrough2"));
_89e.appendChild(createFormField("b_action","cognosViewer"));
addDrillEnvironmentFormFields(_89e,oCV);
if(!oCV||!oCV.executeDrillThroughForIWidgetMobile(_89e)){
if(oCV&&typeof oCV.sendDrillThroughRequest==="function"){
oCV.sendDrillThroughRequest(_89e);
}else{
if(_891==""&&oCV!=null&&typeof oCV.m_viewerFragment!="undefined"){
oCV.m_viewerFragment.raiseAuthoredDrillEvent(_89f);
}else{
if((oCV!=null&&oCV.getViewerWidget()!=null)||_891!=""||_894=="XLS"||_894=="CSV"||_894=="XLWA"||_894=="singleXLS"){
setBackURLToCloseWindow(_89e);
var _8aa="winNAT_"+(new Date()).getTime();
var _8ab="..";
if(oCV!=null){
_8ab=oCV.getWebContentRoot();
}
var _8ac=_8ab+"/rv/blankDrillWin.html";
if(_89c){
_8ac+="?cv.id="+_89c;
}
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Specification",_89f,"xml");
}
_89e.target=_8aa;
newWindow=window.open(_8ac,_8aa);
}else{
appendReportHistoryObjects(oCV,_89e);
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Specification",_89f,"xml");
}
_89e.target="_self";
_89e.submit();
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
var _8ae="";
if(typeof oCV!="undefined"&&oCV!=null){
var _8af=oCV.getExecutionParameters();
if(_8af!=""){
_8ae+="<param name=\"executionParameters\">";
_8ae+=sXmlEncode(_8af);
_8ae+="</param>";
}
}
return _8ae;
};
function doSingleDrillThrough(_8b0,_8b1,cvId){
var _8b3=_8b0[0][0];
if(typeof _8b3=="undefined"||_8b3==null){
return;
}
var _8b4=cvId&&window[cvId+"drillTargets"]?window[cvId+"drillTargets"][_8b3]:drillTargets[_8b3];
if(typeof _8b4=="undefined"){
return;
}
if(_8b1!=""&&_8b4.getPath()==""){
document.location="#"+_8b1;
}else{
var args=[];
args[args.length]=["ui.object",_8b4.getPath()];
for(var _8b6=1;_8b6<_8b0.length;++_8b6){
args[args.length]=_8b0[_8b6];
}
var _8b7="";
if(_8b4.getShowInNewWindow()=="true"){
_8b7="_blank";
}
var _8b8=_8b4.getParameters();
var _8b9=_8b4.getObjectPaths();
var _8ba=cvId;
if(!cvId){
_8ba=getCVId();
}
doSingleDrill(_8b7,args,_8b4.getMethod(),_8b4.getOutputFormat(),_8b4.getOutputLocale(),_8b1,_8b8,_8b9,_8ba,_8b4.getPrompt(),false);
}
};
function getCVId(){
var _8bb="";
try{
_8bb=this.frameElement.id.substring("CVIFrame".length);
}
catch(exception){
}
return _8bb;
};
function doMultipleDrillThrough(_8bc,cvId){
var _8be="<rvDrillTargets>";
for(var _8bf=0;_8bf<_8bc.length;++_8bf){
var _8c0=_8bc[_8bf];
if(_8c0.length<3){
continue;
}
var _8c1=_8c0[0];
if(typeof _8c1=="undefined"||_8c1==null){
continue;
}
var _8c2=_8c0[1];
if(typeof _8c2=="undefined"||_8c2==null){
continue;
}
var _8c3=cvId&&window[cvId+"drillTargets"]?window[cvId+"drillTargets"][_8c1]:drillTargets[_8c1];
if(typeof _8c3=="undefined"||_8c3==null){
continue;
}
if(_8c2===null||_8c2===""){
_8c2=_8c3.getLabel();
}
_8be+="<drillTarget ";
_8be+="outputFormat=\"";
_8be+=_8c3.getOutputFormat();
_8be+="\" ";
_8be+="outputLocale=\"";
_8be+=_8c3.getOutputLocale();
_8be+="\" ";
_8be+="label=\"";
_8be+=sXmlEncode(_8c2);
_8be+="\" ";
_8be+="path=\"";
_8be+=sXmlEncode(_8c3.getPath());
_8be+="\" ";
_8be+="showInNewWindow=\"";
_8be+=_8c3.getShowInNewWindow();
_8be+="\" ";
_8be+="method=\"";
_8be+=_8c3.getMethod();
_8be+="\" ";
_8be+="prompt=\"";
_8be+=_8c3.getPrompt();
_8be+="\" ";
_8be+="dynamicDrill=\"";
_8be+=_8c3.isDynamicDrillThrough();
_8be+="\">";
for(var _8c4=2;_8c4<_8c0.length;++_8c4){
_8be+=_8c0[_8c4];
}
_8be+=_8c3.getParameters();
_8be+=_8c3.getObjectPaths();
_8be+="</drillTarget>";
}
_8be+="</rvDrillTargets>";
if(!cvId){
cvId=getCVId();
}
doMultipleDrills(_8be,cvId);
};
function CScriptLoader(_8c5){
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
this.m_sWebContentRoot=_8c5;
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
CScriptLoader.prototype.setHandlerStylesheetLimit=function(_8c6){
this.m_bHandleStylesheetLimit=_8c6;
};
CScriptLoader.prototype.executeScripts=function(_8c7,_8c8){
if(this.isReadyToExecute()){
for(var _8c9=0;_8c9<this.m_aScripts.length;_8c9++){
if(this.m_aScripts[_8c9]){
var _8ca=document.createElement("script");
_8ca.setAttribute("language","javascript");
_8ca.setAttribute("type","text/javascript");
this.addNamespaceAttribute(_8ca,_8c8);
_8ca.text=this.m_aScripts[_8c9];
document.getElementsByTagName("head").item(0).appendChild(_8ca);
}
}
this.m_aScripts=[];
for(var idx=0;idx<this.m_aDocumentWriters.length;++idx){
var _8cc=this.m_aDocumentWriters[idx];
_8cc.execute();
}
this.m_aDocumentWriters=[];
if(!this.m_aScripts.length&&!this.m_aDocumentWriters.length){
if(typeof _8c7=="function"){
_8c7();
}
this.m_bHasCompletedExecution=true;
}else{
setTimeout(function(){
window.gScriptLoader.executeScripts(_8c7,_8c8);
},this.m_iInterval);
}
}else{
setTimeout(function(){
window.gScriptLoader.executeScripts(_8c7,_8c8);
},this.m_iInterval);
}
};
CScriptLoader.prototype.isReadyToExecute=function(){
for(var _8cd in this.m_oFiles){
if(this.m_oFiles[_8cd]!="complete"){
return false;
}
}
if(this.m_aScriptLoadQueue.length>0){
return false;
}
return true;
};
CScriptLoader.prototype.loadCSS=function(_8ce,_8cf,_8d0,_8d1){
var aM=_8ce.match(this.m_reHasCss);
if(aM){
for(var i=0;i<aM.length;i++){
if(aM[i].match(this.m_reFindCssPath)){
var _8d4=RegExp.$1;
if(_8d4.indexOf("GlobalReportStyles")!=-1){
this.validateGlobalReportStyles(_8d4);
if(_8d0){
if(_8d4.indexOf("GlobalReportStyles.css")!=-1){
_8d4=_8d4.replace("GlobalReportStyles.css","GlobalReportStyles_10.css");
}
var _8d5=this.getGlobalReportStylesClassPrefix(_8d4);
_8d4=_8d4.replace(".css","_NS.css");
if(_8cf){
_8cf.className="buxReport "+_8d5;
}
}
}
this.loadObject(_8d4,_8d1);
}
_8ce=_8ce.replace(aM[i],"");
}
}
return _8ce;
};
CScriptLoader.prototype.getGlobalReportStylesClassPrefix=function(_8d6){
var _8d7=null;
if(_8d6.indexOf("GlobalReportStyles_10.css")!=-1){
_8d7="v10";
}else{
if(_8d6.indexOf("GlobalReportStyles_1.css")!=-1){
_8d7="v1";
}else{
if(_8d6.indexOf("GlobalReportStyles_none.css")!=-1){
_8d7="vnone";
}else{
if(_8d6.indexOf("GlobalReportStyles.css")!=-1){
_8d7="v8";
}
}
}
}
return _8d7;
};
CScriptLoader.prototype.validateGlobalReportStyles=function(_8d8){
var _8d9=document.getElementsByTagName("link");
for(var i=0;i<_8d9.length;++i){
var _8db=_8d9[i];
if(_8db.getAttribute("href").indexOf("GlobalReportStyles")!=-1){
if(_8db.getAttribute("href").toLowerCase()!=_8d8.toLowerCase()){
var _8dc=_8d8.split("/");
var _8dd=_8db.getAttribute("href").split("/");
if(_8dc[_8dc.length-1]!=_8dd[_8dd.length-1]){
this.m_ajaxWarnings.push("Ajax response contains different versions of the GlobalReportStyles.css.");
}
}
break;
}
}
};
CScriptLoader.prototype.loadFile=function(_8de,_8df,_8e0){
var sURL="";
if(_8de){
sURL=_8de;
}
var _8e2=null;
if(typeof _8df=="string"){
_8e2=_8df;
}
var _8e3="POST";
if(_8e0=="GET"){
_8e3="GET";
}
var _8e4=null;
if(typeof ActiveXObject!="undefined"){
_8e4=new ActiveXObject("Msxml2.XMLHTTP");
}else{
_8e4=new XMLHttpRequest();
}
_8e4.open(_8e3,sURL,false);
_8e4.send(_8e2);
return _8e4.responseText;
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
var _8e6=window.gScriptLoader.m_aBlockedPromptingLocaleFileQueue.shift();
window.gScriptLoader.loadObject(_8e6.sName,_8e6.sNamespaceId);
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
var _8e8=node.getAttribute("href");
if(!_8e8||this.m_oFiles[_8e8]){
return;
}
this.m_oFiles[_8e8]="complete";
document.getElementsByTagName("head").item(0).appendChild(node);
};
CScriptLoader.prototype.loadObject=function(_8e9,_8ea){
var _8eb=null;
if(typeof _8e9==="undefined"){
if(this.m_aScriptLoadQueue.length>0){
var _8ec=this.m_aScriptLoadQueue.shift();
_8e9=_8ec.name;
_8ea=_8ec.namespaceId;
}else{
return;
}
}
if(this.m_oFiles[_8e9]){
return;
}
if(this.m_bBlockScriptLoading){
this.m_aScriptLoadQueue.push({"name":_8e9,"namespaceId":_8ea});
}else{
if(_8e9.match(this.m_reIsCss)){
_8eb=document.createElement("link");
_8eb.setAttribute("rel","stylesheet");
_8eb.setAttribute("type","text/css");
_8eb.setAttribute("href",_8e9);
if(window.isIE&&window.isIE()){
_8eb.onreadystatechange=CScriptLoader_onReadyStateChange;
_8eb.onload=CScriptLoader_onReadyStateChange;
_8eb.onerror=CScriptLoader_onReadyStateChange;
this.m_oFiles[_8e9]="new";
}else{
this.m_oFiles[_8e9]="complete";
}
}else{
if(_8e9.match(this.m_reIsJavascript)){
if(_8e9.match(this.m_reIsPromptingLocaleJavascript)){
if(this.m_bBlockPromptingLocaleScripts){
this.m_aBlockedPromptingLocaleFileQueue.push({"sName":_8e9,"sNamespaceId":_8ea});
return;
}
this.m_bBlockPromptingLocaleScripts=true;
}
this.m_bBlockScriptLoading=this.m_bUseScriptBlocking;
_8eb=document.createElement("script");
_8eb.setAttribute("language","javascript");
_8eb.setAttribute("type","text/javascript");
_8eb.setAttribute("src",_8e9);
_8eb.sFilePath=_8e9;
_8eb.onreadystatechange=CScriptLoader_onReadyStateChange;
_8eb.onload=CScriptLoader_onReadyStateChange;
_8eb.onerror=CScriptLoader_onReadyStateChange;
this.addNamespaceAttribute(_8eb,_8ea);
this.m_oFiles[_8e9]="new";
}
}
if(_8eb){
document.getElementsByTagName("head").item(0).appendChild(_8eb);
}
}
};
CScriptLoader.prototype.loadScriptsFromDOM=function(_8ed,_8ee,_8ef){
if(!_8ed){
return;
}
var _8f0=_8ed.parentNode.getElementsByTagName("script");
while(_8f0.length>0){
var _8f1=_8f0[0];
if(_8f1.getAttribute("src")!=null&&_8f1.getAttribute("src").length>0){
this.loadObject(_8f1.getAttribute("src"),_8ee);
}else{
var _8f2=_8f1.innerHTML;
var _8f3=false;
if(_8f2.indexOf("document.write")!=-1){
var _8f4=_8f2.replace(this.m_reEscapedCharacters,"").replace(this.m_reStringLiterals,"");
_8f3=(_8f4.indexOf("document.write")!=-1);
}
if(_8f3){
if(_8ef){
var sId="CVScriptFromDOMPlaceHolder"+_8f0.length+_8ee;
var _8f6=_8f1.ownerDocument.createElement("span");
_8f6.setAttribute("id",sId);
_8f1.parentNode.insertBefore(_8f6,_8f1);
this.m_aDocumentWriters.push(new CDocumentWriter(sId,_8f2));
}
}else{
if(_8f2.length>0){
this.m_aScripts.push(_8f2);
}
}
}
_8f1.parentNode.removeChild(_8f1);
}
};
CScriptLoader.prototype.loadStyles=function(_8f7,_8f8){
if(!_8f7||!_8f7.parentNode){
return;
}
var _8f9=_8f7.parentNode.getElementsByTagName("style");
while(_8f9.length>0){
var _8fa=_8f9[0];
if(_8f8){
this.addNamespaceAttribute(_8fa,_8f8);
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
document.getElementsByTagName("head").item(0).appendChild(_8fa);
}
};
CScriptLoader.prototype.loadAll=function(_8fc,_8fd,_8fe,_8ff){
this.m_bScriptLoaderCalled=true;
this.m_bHasCompletedExecution=false;
this.loadScriptsFromDOM(_8fc,_8fe,_8ff);
if(this.containsAjaxWarnings()){
return false;
}
this.loadStyles(_8fc,_8fe);
if(this.containsAjaxWarnings()){
return false;
}
this.executeScripts(_8fd,_8fe);
return true;
};
CScriptLoader.prototype.setFileState=function(_900,_901){
this.m_oFiles[_900]=_901;
};
CScriptLoader.prototype.containsAjaxWarnings=function(){
if(this.m_bIgnoreAjaxWarnings){
return false;
}else{
return (this.m_ajaxWarnings.length>0);
}
};
CScriptLoader.prototype.addNamespaceAttribute=function(_902,_903){
if(typeof _903==="string"){
_902.setAttribute("namespaceId",_903);
}
};
if(typeof window.gScriptLoader=="undefined"){
window.gScriptLoader=new CScriptLoader();
}
function ViewerA11YHelper(oCV){
this.m_oCV=oCV;
};
ViewerA11YHelper.prototype.onFocus=function(evt){
var _906=getCrossBrowserNode(evt);
_906=ViewerA11YHelper.findChildOfTableCell(_906);
this.updateCellAccessibility(_906,false);
};
ViewerA11YHelper.prototype.onKeyDown=function(evt){
evt=(evt)?evt:((event)?event:null);
var _908=getCrossBrowserNode(evt);
if(ViewerA11YHelper.isTableCell(_908)){
for(var i=0;i<_908.childNodes.length;i++){
if(_908.childNodes[i].nodeName.toLowerCase()=="span"){
_908=_908.childNodes[i];
break;
}
}
}
if(!this.isValidNodeToSelect(_908)){
return true;
}
_908=ViewerA11YHelper.findChildOfTableCell(_908);
if(_908){
if(evt.keyCode=="39"){
if(this.m_oCV.getState()&&this.m_oCV.getState().getFindState()&&evt.ctrlKey&&evt.shiftKey){
this.m_oCV.executeAction("FindNext");
}else{
this.moveRight(_908);
}
return stopEventBubble(evt);
}else{
if(evt.keyCode=="37"){
this.moveLeft(_908);
return stopEventBubble(evt);
}else{
if(evt.keyCode=="38"){
this.moveUp(_908);
return stopEventBubble(evt);
}else{
if(evt.keyCode=="40"){
this.moveDown(_908);
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
var _90a=this.m_oCV.getActionFactory().load("Selection");
_90a.onKeyDown(evt);
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
var _90b=this.m_oCV.getActionFactory().load("Delete");
if(!this.m_oCV.isBlacklisted("Delete")&&_90b.canDelete()){
_90b.execute();
return stopEventBubble(evt);
}
}
}else{
if(this.m_oCV.isBux&&evt.ctrlKey==true&&evt.shiftKey==true&&evt.keyCode=="49"){
var lid=this.m_oCV.getSelectionController().getSelectionObjectFactory().getLayoutElementId(_908);
if(lid!=""){
lid=lid.split(this.m_oCV.getId())[0];
var _90d=-1;
var _90e=this.m_oCV.getRAPReportInfo();
if(_90e){
var _90f=_90e.getContainer(lid);
if(typeof _90f.layoutIndex!="undefined"){
_90d=_90f.layoutIndex;
}
}
var _910=document.getElementById("infoBarHeaderButton"+_90d+this.m_oCV.getId());
if(_910!==null){
this.m_oCV.setCurrentNodeFocus(getCrossBrowserNode(evt));
_910.focus();
}
}
return stopEventBubble(evt);
}else{
if(!this.m_oCV.isBux&&evt.shiftKey==true&&evt.keyCode=="121"){
var ocv=this.m_oCV;
var _912=function(){
if(typeof evt.clientX=="undefined"||typeof evt.clientY=="undefined"){
var _913=clientToScreenCoords(evt.target,document.body);
evt.clientX=_913.leftCoord;
evt.clientY=_913.topCoord;
}
ocv.dcm(evt,true);
};
if(isFF()){
setTimeout(_912,0);
}else{
_912.call();
}
return stopEventBubble(evt);
}else{
if(this.m_oCV.isBux&&(evt.keyCode=="93"||(evt.shiftKey==true&&evt.keyCode=="121"))){
var _914=this.m_oCV.getViewerWidget();
var _915=this.m_oCV.getSelectionController();
_914.preprocessPageClicked(true);
_915.pageClicked(evt);
_914.updateToolbar();
_914.onContextMenu(evt);
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
var _918=node.nodeName.toLowerCase();
if((_918=="span"&&(!node.getAttribute("class")||node.getAttribute("class").indexOf("expandButton")===-1))||(_918=="div"&&node.getAttribute("flashchartcontainer")=="true")||(_918=="div"&&node.getAttribute("chartcontainer")=="true")||(_918=="img"&&(!node.id||node.id.indexOf("sortimg")!==0))){
return node;
}
if(ViewerA11YHelper.isSemanticNode(node)){
var _919=node.childNodes&&node.childNodes.length?node.childNodes[0]:null;
if(_919){
return this.getValidNodeToSelect(_919);
}
}
}
return null;
};
ViewerA11YHelper.isSemanticNode=function(node){
if(!ViewerA11YHelper.isSemanticNode._semanticNodeNames){
ViewerA11YHelper.isSemanticNode._semanticNodeNames=["strong","em","h1","h2","h3","h4","h5","h6"];
}
var _91b=node.nodeName.toLowerCase();
for(var i=0;i<ViewerA11YHelper.isSemanticNode._semanticNodeNames.length;i++){
if(_91b===ViewerA11YHelper.isSemanticNode._semanticNodeNames[i]){
return true;
}
}
return false;
};
ViewerA11YHelper.isTableCell=function(node){
var _91e=node.nodeName.toLowerCase();
return _91e==="td"||_91e==="th";
};
ViewerA11YHelper.findChildOfTableCell=function(_91f){
var _920=_91f;
while(_920&&_920.parentNode){
if(ViewerA11YHelper.getTableCell(_920)){
break;
}
_920=_920.parentNode;
}
return _920;
};
ViewerA11YHelper.getTableCell=function(node){
var _922=node.parentNode;
if(ViewerA11YHelper.isTableCell(_922)){
return _922;
}
if(ViewerA11YHelper.isSemanticNode(_922)&&ViewerA11YHelper.isTableCell(_922.parentNode)){
return _922.parentNode;
}
return null;
};
ViewerA11YHelper.prototype.moveRight=function(_923){
var _924=this.getNextNonTextSibling(_923);
_924=this.getValidNodeToSelect(_924);
if(_924){
this.setFocusToNode(_924);
return true;
}
var _925=ViewerA11YHelper.getTableCell(_923);
_925=this.getPfMainOutputCell(_925);
while(_925.nextSibling){
if(this.moveToTD(_925.nextSibling)){
return true;
}
_925=_925.nextSibling;
}
var _926=_925.parentNode;
while(_926.nextSibling){
var _927=_926.nextSibling;
if(this.moveToTD(_927.childNodes[0])){
return true;
}
_926=_926.nextSibling;
}
return false;
};
ViewerA11YHelper.prototype.moveLeft=function(_928){
var _929=this.getPreviousNonTextSibling(_928);
_929=this.getValidNodeToSelect(_929);
if(_929){
this.setFocusToNode(_929);
return true;
}
var _92a=ViewerA11YHelper.getTableCell(_928);
_92a=this.getPfMainOutputCell(_92a);
while(_92a.previousSibling){
if(this.moveToTDFromTheRight(_92a.previousSibling)){
return true;
}
_92a=_92a.previousSibling;
}
var _92b=_92a.parentNode;
while(_92b.previousSibling){
var _92c=_92b.previousSibling;
if(this.moveToTDFromTheRight(_92c.lastChild)){
return true;
}
_92b=_92b.previousSibling;
}
return false;
};
ViewerA11YHelper.prototype.moveDown=function(_92d){
var _92e=ViewerA11YHelper.getTableCell(_92d);
_92e=this.getPfMainOutputCell(_92e);
var _92f=this.getColumnIndex(_92e);
_92f+=this.getColSpanFromRowSpans(_92e);
var _930=_92e.parentNode;
if(_92e.rowSpan&&_92e.rowSpan>1){
var _931=_92e.rowSpan;
for(var _932=1;_932<_931;_932++){
_930=_930.nextSibling;
}
}
var _933=false;
while(_930){
if(_930.nextSibling){
_930=_930.nextSibling;
}else{
if(_92e.nextSibling&&!_933){
_930=_930.parentNode.firstChild;
_933=true;
_92f++;
}else{
return false;
}
}
if(this.doMoveUpDown(_930,_92f)){
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.moveUp=function(_934){
var _935=ViewerA11YHelper.getTableCell(_934);
_935=this.getPfMainOutputCell(_935);
var _936=_935.parentNode;
var _937=this.getColumnIndex(_935);
_937+=this.getColSpanFromRowSpans(_935);
var _938=false;
while(_936){
if(_936.previousSibling){
_936=_936.previousSibling;
}else{
if(_935.previousSibling&&!_938){
_936=_936.parentNode.lastChild;
_938=true;
_937--;
}else{
return false;
}
}
if(this.doMoveUpDown(_936,_937)){
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
ViewerA11YHelper.prototype.doMoveUpDown=function(_93a,_93b){
if(_93a!=null){
var _93c=_93a.firstChild;
var pos=this.getColSpanFromRowSpans(_93c);
while(_93c){
if(pos==_93b){
return this.moveToTDFromTheRight(_93c);
}else{
if(pos>_93b){
break;
}
}
var _93e=0;
if(_93c.colSpan){
_93e=_93c.colSpan;
}else{
_93e++;
}
pos+=_93e;
_93c=_93c.nextSibling;
}
}
};
ViewerA11YHelper.prototype.moveToTDFromTheRight=function(td){
td=this.getPfVisibleCell(td);
var _940=td.childNodes;
for(var _941=_940.length-1;_941>=0;_941--){
var node=this.getValidNodeToSelect(_940[_941]);
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
var _944=td.childNodes;
for(var _945=0;_945<_944.length;_945++){
var node=this.getValidNodeToSelect(_944[_945]);
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
var _948=this.m_oCV.m_pinFreezeManager.nodeToContainer(node);
if(_948){
_948.updateScroll(node);
}
}
};
ViewerA11YHelper.prototype.getPfMainOutputCell=function(_949){
var main=null;
var slid=_949.getAttribute("pfslid");
if(slid){
var lid=PinFreezeContainer.getLidFromSlid(slid);
if(lid&&this.m_oCV.m_pinFreezeManager){
lid=this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
var _94d=this.m_oCV.m_pinFreezeManager.getContainer(lid);
if(_94d){
main=_94d.getMain(_949);
}
}
}
return main?main:_949;
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
var _950=0;
while(node.previousSibling){
node=node.previousSibling;
if(node.rowSpan==1){
if(node.colSpan){
_950+=node.colSpan;
}else{
_950++;
}
}
}
return _950;
};
ViewerA11YHelper.prototype.getPfVisibleCell=function(_951){
var copy=null;
var slid=_951.getAttribute("pfslid");
if(slid){
var lid=PinFreezeContainer.getLidFromSlid(slid);
if(lid&&this.m_oCV.m_pinFreezeManager){
lid=this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
var _955=this.m_oCV.m_pinFreezeManager.getContainer(lid);
if(_955){
copy=_955.getCopy(_951);
}
}
}
return copy?copy:_951;
};
ViewerA11YHelper.prototype.updateCellAccessibility=function(_956,_957){
if(!_956){
return false;
}
var _958=false;
var _959=false;
var _95a=false;
var _95b=_956.getAttribute("ctx")!=null?_956:_956.parentNode;
if(_956.getAttribute("flashChartContainer")!="true"){
if(_95b.getAttribute("ctx")!=null){
if(this.m_oCV.isBux){
var _95c=this.m_oCV.getAction("DrillUpDown");
_95c.updateDrillability(this.m_oCV,_95b);
_958=_95c.canDrillDown();
_959=_95c.canDrillUp();
}else{
var _95d=_95b.getAttribute("ctx");
var _95e=_95d.indexOf(":")==-1?_95d:_95d.substring(0,_95d.indexOf(":"));
var _95f=this.m_oCV.getSelectionController();
_958=_95f.canDrillDown(_95e);
_959=_95f.canDrillUp(_95e);
}
}
_95a=_956.parentNode.getAttribute("dtTargets")?true:false;
}
var _960=_956.nodeName.toLowerCase()=="img";
var _961=_956.parentNode.getAttribute("type")=="columnTitle";
if(!_960&&(_957||((_956.getAttribute("aria-labelledby")!=null||_961||this.m_oCV.isAccessibleMode())))){
var _962="";
if(_956.parentNode.getAttribute("cc")=="true"){
_962+=" "+RV_RES.IDS_JS_CROSSTAB_CORNER;
}
if(_956.innerHTML.length===0){
_962+=" "+RV_RES.IDS_JS_EMPTY_CELL;
}
if(_958&&_959){
_962+=" "+RV_RES.IDS_JS_DRILL_DOWN_UP_JAWS;
}else{
if(_958){
_962+=" "+RV_RES.IDS_JS_DRILL_DOWN_JAWS;
}else{
if(_959){
_962+=" "+RV_RES.IDS_JS_DRILL_UP_JAWS;
}
}
}
if(_95a){
_962+=" "+RV_RES.IDS_JS_DRILL_THROUGH_JAWS;
}
if(_956.altText&&_956.altText.length>0){
_962=_956.altText;
}else{
if(_956.getAttribute("flashChartContainer")=="true"){
_962=RV_RES.IDS_JS_CHART_IMAGE;
}
}
if(this.m_oCV.isBux){
var _963=_956.previousSibling;
if(_963){
var wid=_963.getAttribute("widgetid");
if(wid&&wid.indexOf("comment")){
_962+=" "+RV_RES.IDS_JS_ANNOTATION_JAWS;
}
}
if(_956.getAttribute("rp_name")||_956.parentNode.getAttribute("rp_name")){
_962+=" "+RV_RES.IDS_JS_LABEL_HAS_BEEN_RENAMED;
}
if(_956.nextSibling&&_956.nextSibling.getAttribute("class")=="sortIconVisible"){
_962+=" "+_956.nextSibling.getAttribute("alt");
}
}
if(_962.length>0){
this.addAriaLabelledByOnCell(_956,_962);
}
}
if(_959||_958||_95a){
this.addDrillAccessibilityAttributes(_956,_95a);
}
if(_956.attachEvent){
_956.attachEvent("onblur",this.onBlur);
}else{
_956.addEventListener("blur",this.onBlur,false);
}
if((isIE()&&_956.getAttribute("tabIndex")!=0)||_960){
_956.setAttribute("modifiedTabIndex","true");
_956.setAttribute("oldTabIndex",_956.getAttribute("tabIndex"));
_956.setAttribute("tabIndex",0);
}
};
ViewerA11YHelper.prototype.addAriaLabelledByOnCell=function(_965,_966){
var _967=0;
var _968=_965;
while(_968.previousSibling){
_967++;
_968=_968.previousSibling;
}
var _969=_965.getAttribute("ariaHiddenSpanId");
if(_969&&document.getElementById(_969)){
document.getElementById(_969).innerHTML=_966;
}else{
if(!_965.parentNode.id&&!_965.id){
_965.parentNode.id=Math.random();
}
var _96a=document.createElement("span");
_96a.style.visibility="hidden";
_96a.style.display="none";
_96a.id=(_965.id==""?_965.parentNode.id:_965.id)+"_"+_967;
_96a.innerHTML=_966;
_965.parentNode.appendChild(_96a);
var _96b="";
if(_965.getAttribute("aria-labelledby")!=null){
_96b+=_965.getAttribute("aria-labelledby");
}else{
if(_965.id==""){
_965.id=_965.parentNode.id+"_main_"+_967;
}
_96b+=_965.id;
}
_96b+=" "+_96a.id;
_965.setAttribute("aria-labelledby",_96b);
_965.setAttribute("ariaHiddenSpanId",_96a.id);
}
};
ViewerA11YHelper.prototype.addDrillAccessibilityAttributes=function(_96c,_96d){
if(!_96c.getAttribute("oldClassName")){
if(!_96d){
_96c.setAttribute("oldClassName",_96c.className);
_96c.className="dl "+_96c.className;
}
if(!_96c.getAttribute("role")){
_96c.setAttribute("role","link");
}
}
};
ViewerA11YHelper.prototype.onBlur=function(evt){
var _96f=null;
if(isIE()){
_96f=getNodeFromEvent(evt,true);
}else{
_96f=this;
}
_96f=ViewerA11YHelper.findChildOfTableCell(_96f);
if(_96f){
if(_96f.getAttribute("oldClassName")){
_96f.className=_96f.getAttribute("oldClassName");
_96f.removeAttribute("oldClassName");
}
if(_96f.getAttribute("modifiedTabIndex")=="true"){
_96f.removeAttribute("modifiedTabIndex");
_96f.removeAttribute("tabIndex");
if(_96f.getAttribute("oldTabIndex")){
_96f.setAttribute("tabIndex",_96f.getAttribute("oldTabIndex"));
}
_96f.removeAttribute("oldTabIndex");
}
var _970=_96f.getAttribute("ariaHiddenSpanId");
if(_970){
var _971=document.getElementById(_970);
if(_971){
_971.innerHTML="";
}
}
}
};
ViewerA11YHelper.prototype.getColSpanFromRowSpans=function(_972){
var _973=0;
var _974=_972.parentNode;
var _975=0;
while(_974){
var _976=_974.firstChild;
var _977=this.getColumnCount(_974)-_975;
while(_976&&_976.rowSpan>1&&_977>0&&_976!=_972){
_973+=_976.colSpan;
_976=_976.nextSibling;
_977--;
}
if(_974.childNodes.length>_975){
_975=this.getColumnCount(_974);
}
_974=_974.previousSibling;
}
return _973;
};
ViewerA11YHelper.prototype.getColumnCount=function(_978){
var _979=0;
var node=_978.firstChild;
while(node){
_979+=node.colSpan;
node=node.nextSibling;
}
return _979;
};
ViewerA11YHelper.prototype.addLabelledByForItemsOutsideOfContainers=function(){
if(!this.m_oCV.isAccessibleMode()){
return;
}
var _97b=document.getElementById("RVContent"+this.m_oCV.getId());
if(!_97b){
return;
}
var _97c=getElementsByAttribute(_97b,"span","tabindex","0");
if(!_97c){
return;
}
for(var i=0;i<_97c.length;i++){
var span=_97c[i];
this.updateCellAccessibility(span,false);
}
};
var CV_BACKGROUND_LAYER_ID="CV_BACK";
if(typeof window.gaRV_INSTANCES=="undefined"){
window.gaRV_INSTANCES=[];
}
if(!window.gViewerLogger){
window.gViewerLogger={log:function(hint,_980,type){
},addContextInfo:function(_982){
}};
}
function CognosViewerSession(oCV){
this.m_sConversation=oCV.getConversation();
this.m_sParameters=oCV.getExecutionParameters();
this.m_envParams={};
applyJSONProperties(this.m_envParams,oCV.envParams);
this.m_bRefreshPage=false;
};
function CCognosViewer(sId,_985){
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
this.m_sGateway=_985;
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
var _986=false;
for(var _987=0;_987<window.gaRV_INSTANCES.length;_987++){
if(window.gaRV_INSTANCES[_987].m_sId==sId){
window.gaRV_INSTANCES[_987]=this;
_986=true;
break;
}
}
if(!_986){
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
CCognosViewer.prototype.setScheduledMobileOutput=function(_988){
this.m_mobileScheduledOutput=_988;
if(_988){
this.m_sStatus="complete";
}
};
CCognosViewer.prototype.setTabInfo=function(_989){
this.m_tabsPayload=_989;
if(this.m_tabsPayload&&this.m_tabsPayload.tabs&&this._keepTabSelected){
var _98a=false;
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
CCognosViewer.prototype.setKeepTabSelected=function(_98d){
this._keepTabSelected=_98d;
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
var _98e=this.isSavedOutput()&&!this.m_mobileScheduledOutput;
var _98f=document.getElementById("CVNavLinks"+this.getId());
if(_98f||!this.shouldWriteNavLinks()||_98e){
var _990=this.getReportDiv();
this.m_bHasTabs=true;
if(this.m_tabControl&&this.m_tabControl.isSavedOutput()!=_98e){
this.deleteTabs();
}
if(!this.m_tabControl){
if(this.getStatus()!="complete"&&!_98e){
return;
}
var tr=document.createElement("tr");
var _992=document.createElement("td");
tr.appendChild(_992);
var _993=document.getElementById("mainViewerTR"+this.getId());
if(!_993){
return;
}
if(this.m_tabsPayload.position=="topLeft"){
_993.parentNode.insertBefore(tr,_993);
}else{
_993.parentNode.appendChild(tr);
}
var _994=null;
if(this.m_viewerWidget){
_994=this.m_viewerWidget.findContainerDiv().firstChild;
}else{
_994=_992;
}
var oCV=this;
if(_98e){
this.m_tabControl=new CognosTabControl(_994,function(_996){
oCV.switchSavedOutputTab(_996,true);
});
this.switchSavedOutputTab(this.m_tabsPayload.currentTabId,false);
}else{
this.m_tabControl=new CognosTabControl(_994,function(_997){
oCV.switchTabs(_997);
});
}
if(this.m_viewerWidget){
this.m_tabControl.setSpaceSaverContainer(_992);
this.m_tabControl.setScrollAttachNode(this.m_viewerWidget.findContainerDiv());
this.m_tabControl.useAbsolutePosition(true);
}
this.m_tabControl.setIsSavedOutput(_98e);
if(!window.gScriptLoader.m_bScriptLoaderCalled){
var _998=document.getElementById("RVContent"+this.getId());
var _999=this._getNodesWithViewerId(_998,"link",null);
for(var i=0;i<_999.length;i++){
window.gScriptLoader.moveLinks(_999[i]);
if(_999[i].getAttribute("href").indexOf("promptCommon.css")>0){
this.setHasPrompts(true);
}
}
window.gScriptLoader.loadStyles(_998,this.getId());
this.repaintDiv(_998);
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
this._removeTabContent(_990.parentNode,this.m_switchingToTabId);
this._removeTabContent(_990.parentNode,this.m_currentlySelectedTab);
if(_98f){
this._removeTabContent(_98f.parentNode,this.m_switchingToTabId);
this._removeTabContent(_98f.parentNode,this.m_currentlySelectedTab);
}
this.m_tabInfo={};
}
this.m_switchingToTabId=null;
_990.setAttribute("tabId",this.m_currentlySelectedTab);
if(_98f){
_98f.setAttribute("tabId",this.m_currentlySelectedTab);
}
if(isIE()&&_98e&&window.resizeIFrame&&!this.m_viewerFragment&&!this.m_viewerWidget){
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
var _99c=this.getReportDiv();
var _99d=this.m_switchingToTabId;
this.m_currentlySelectedTab=_99d;
this.m_tabControl.selectTab(this.previouslySelectedTab,false);
this.switchTabs(this.previouslySelectedTab);
if(_99c){
_99c.parentNode.removeChild(_99c);
}
if(this.m_tabInfo[this.m_currentlySelectedTab]&&this.m_tabInfo[this.m_currentlySelectedTab].styles){
this._addTabStylesToHead(this.m_tabInfo[this.m_currentlySelectedTab].styles);
}
this.previouslySelectedTab=null;
this.m_tabInfo[_99d]=null;
};
CCognosViewer.prototype.switchSavedOutputTab=function(_99e,_99f){
var _9a0=this.getSelectionController();
if(_9a0){
_9a0.clearSelectedObjects();
}
this.m_currentlySelectedTab=this.m_tabControl.getSelectedTabId();
if(_99f){
this.notifyTabChange(_99e);
}
if(this.m_viewerWidget){
this.m_viewerWidget.getSavedOutput().switchSavedOutputTab(_99e,_99f);
this.getTabController().resetPosition();
}else{
if(!this.savedOutputTabNodes){
var _9a1=document.getElementById("CVIFrame"+this.getId());
this.savedOutputTabNodes=getElementsByAttribute(_9a1.contentWindow.document.body,"*","tabid");
}
if(!this.savedOutputTabNodes){
return;
}
for(var i=0;i<this.savedOutputTabNodes.length;i++){
var _9a3=this.savedOutputTabNodes[i];
_9a3.style.display=_9a3.getAttribute("tabid")==_99e?"":"none";
}
this.setMaxContentSize();
}
};
CCognosViewer.prototype.notifyTabChange=function(_9a4){
};
CCognosViewer.prototype._getNodesWithViewerId=function(_9a5,_9a6,id){
var _9a8=[];
var _9a9=_9a5.getElementsByTagName(_9a6);
for(var i=0;i<_9a9.length;i++){
var node=_9a9[i];
if(!id||(node.getAttribute&&node.getAttribute("namespaceId")==id)){
node.parentNode.removeChild(node);
_9a8.push(node);
i--;
}
}
return _9a8;
};
CCognosViewer.prototype._removeTabStylesFromHead=function(){
var id=this.getId();
return this._getNodesWithViewerId(document.getElementsByTagName("head").item(0),"style",id);
};
CCognosViewer.prototype._addTabStylesToHead=function(_9ad){
if(!_9ad){
return;
}
for(var i=0;i<_9ad.length;i++){
document.getElementsByTagName("head").item(0).appendChild(_9ad[i]);
}
};
CCognosViewer.prototype.switchTabs=function(_9af){
if(this.m_currentlySelectedTab==_9af){
return;
}
var _9b0=this.getSelectionController();
if(_9b0){
_9b0.clearSelectedObjects();
}
var _9b1=this.getReportDiv();
this.m_nReportDiv=null;
var _9b2=_9b1.clientHeight;
_9b1.removeAttribute("id");
_9b1.style.display="none";
if(!this.m_tabInfo){
this.m_tabInfo={};
}
var _9b3=this._removeTabStylesFromHead();
var _9b4=this.getSelectionController().getCCDManager();
this.m_tabInfo[this.m_currentlySelectedTab]={"conversation":this.getConversation(),"metadata":_9b4.getClonedMetadataArray(),"contextdata":_9b4.getClonedContextdataArray(),"secondaryRequests":this.getSecondaryRequests(),"styles":_9b3,"hasPromptControl":this.getHasPrompts()};
var _9b5=this._findChildWithTabId(_9b1.parentNode,_9af);
this.previouslySelectedTab=this.m_currentlySelectedTab;
if(_9b5&&this.m_tabInfo[_9af]&&this.m_tabInfo[_9af].hasPromptControl){
if(_9b5){
_9b5.parentNode.removeChild(_9b5);
_9b5=null;
}
delete this.m_tabInfo[_9af];
this.m_tabInfo[_9af]=null;
}
if(_9b5){
this.m_currentlySelectedTab=_9af;
_9b5.style.display="block";
_9b5.setAttribute("id","CVReport"+this.getId());
if(this.m_tabInfo&&this.m_tabInfo[_9af]){
var _9b6=this.m_tabInfo[_9af];
if(_9b6.conversation){
this.setConversation(_9b6.conversation);
}
if(_9b6.metadata){
_9b4.SetMetadata(_9b6.metadata);
}
if(_9b6.contextdata){
_9b4.SetContextData(_9b6.contextdata);
}
if(_9b6.secondaryRequests){
this.setSecondaryRequests(_9b6.secondaryRequests);
}
if(_9b6.styles){
this._addTabStylesToHead(_9b6.styles);
}
this.setHasPrompts(_9b6.hasPromptControl);
}
if(this.shouldWriteNavLinks()){
this.writeNavLinks(this.getSecondaryRequests().join(" "));
}
if(this.getPinFreezeManager()&&this.getPinFreezeManager().hasFrozenContainers()){
this.getPinFreezeManager().rePaint();
if(isIE()){
var _9b7=document.getElementById("RVContent"+this.getId());
this.repaintDiv(_9b7);
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
this.m_switchingToTabId=_9af;
var _9b8=_9b1.cloneNode(false);
_9b8.style.display="block";
_9b8.setAttribute("id","CVReport"+this.getId());
_9b8.removeAttribute("tabId");
_9b1.parentNode.appendChild(_9b8);
_9b8.innerHTML="<table height='"+_9b2+"px'><tr><td height='100%'></td></tr></table>";
var _9b9=new ViewerDispatcherEntry(this);
_9b9.addFormField("ui.action","reportAction");
_9b9.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",_9af);
if(this.m_viewerWidget){
this.m_viewerWidget.placeTabControlInView();
}
this.dispatchRequest(_9b9);
}
};
CCognosViewer.prototype._removeTabContent=function(_9ba,_9bb){
var _9bc=this._findChildWithTabId(_9ba,_9bb);
while(_9bc){
_9bc.parentNode.removeChild(_9bc);
_9bc=this._findChildWithTabId(_9ba,_9bb);
}
};
CCognosViewer.prototype._findChildWithTabId=function(_9bd,_9be){
var _9bf=null;
for(var i=0;i<_9bd.childNodes.length;i++){
var _9c1=_9bd.childNodes[i];
if(_9c1.getAttribute("tabId")==_9be){
_9bf=_9c1;
break;
}
}
return _9bf;
};
CCognosViewer.prototype.clearTabs=function(){
if(!this.m_bHasTabs){
return;
}
this.m_tabInfo={};
var _9c2=this.getReportDiv();
var _9c3=_9c2.parentNode;
for(var i=0;i<_9c3.childNodes.length;i++){
var node=_9c3.childNodes[i];
if(node.getAttribute("id")!="CVReport"+this.m_sId){
_9c3.removeChild(node);
i--;
}
}
};
CCognosViewer.prototype.isSavedOutput=function(){
var _9c6=this.envParams["ui.action"];
return _9c6==="view"||_9c6==="buxView";
};
CCognosViewer.prototype.renderSavedOutputIFrame=function(url,_9c8,_9c9){
var _9ca=document.getElementById("CVReport"+this.getId());
var _9cb=document.createElement("iframe");
_9cb.style.width="100%";
_9cb.style.height=_9ca.clientHeight?_9ca.clientHeight+"px":"99%";
_9cb.id="CVIFrame"+this.getId();
_9cb.title=_9c8;
_9cb.setAttribute("frameBorder","0");
_9ca.appendChild(_9cb);
var obj=this;
var func=function(){
obj.renderTabs();
};
setTimeout(function(){
if(_9c9){
if(_9cb.attachEvent){
_9cb.attachEvent("onload",func);
}else{
_9cb.addEventListener("load",func,true);
}
}
_9cb.src=url;
},1);
};
CCognosViewer.prototype.updatePageState=function(_9ce){
if(_9ce&&this.getState()){
this.getState().setPageState(_9ce);
}
};
CCognosViewer.prototype.getPageInfo=function(){
if(this.m_viewerState&&this.m_viewerState.getPageState()){
var _9cf=this.m_viewerState.getPageState();
return {"currentPage":_9cf.getCurrentPage(),"pageCount":_9cf.getPageCount()};
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
CCognosViewer.prototype.setRetryDispatcherEntry=function(_9d4){
this.m_retryDispatcherEntry=_9d4;
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
CCognosViewer.prototype.setFaultDispatcherEntry=function(_9d5){
this.m_faultDispatcherEntry=_9d5;
};
CCognosViewer.prototype.getFaultDispatcherEntry=function(){
return this.m_faultDispatcherEntry;
};
CCognosViewer.prototype.dispatchRequest=function(_9d6){
this.setFaultDispatcherEntry(null);
this.getViewerDispatcher().dispatchRequest(_9d6);
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
CCognosViewer.prototype.getAction=function(_9d7){
var _9d7=this.getActionFactory().load(_9d7);
_9d7.setCognosViewer(this);
return _9d7;
};
CCognosViewer.prototype.getCalculationCache=function(){
return this.m_calculationCache;
};
CCognosViewer.prototype.updateOutputForA11ySupport=function(){
this.updateBorderCollapse();
if(this.getA11YHelper()){
this.getA11YHelper().addLabelledByForItemsOutsideOfContainers();
}
var _9d8=navigator.userAgent.toLowerCase();
var _9d9=_9d8.indexOf("iphone")!=-1;
var _9da=_9d8.indexOf("ipod")!=-1;
var _9db=_9d8.indexOf("ipad")!=-1;
var _9dc=_9d9||_9da||_9db;
var _9dd=_9d8.indexOf("android")!=-1;
if(_9dc||_9dd){
document.body.classList.add("clsViewerMobile");
}
};
CCognosViewer.prototype.checkForHighContrast=function(){
if(this.isBux){
this.m_bHighContrast=dojo.hasClass(document.body,"dijit_a11y")?true:false;
}else{
var _9de=document.createElement("div");
_9de.id=this.m_sId+"hc";
_9de.style.border="1px solid";
_9de.style.borderColor="red green";
_9de.style.height="10px";
_9de.style.top="-999px";
_9de.style.position="absolute";
document.body.appendChild(_9de);
var _9df=null;
if(isIE()){
_9df=_9de.currentStyle;
}else{
_9df=_9de.ownerDocument.defaultView.getComputedStyle(_9de,null);
}
if(!_9df){
return;
}
this.m_bHighContrast=_9df.borderTopColor==_9df.borderRightColor;
document.body.removeChild(_9de);
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
var _9e0=null;
if(this.envParams["ui.action"]=="view"&&!this.isBux){
var _9e1=document.getElementById("CVIFrame"+this.getId());
_9e0=_9e1.contentWindow.document;
}else{
_9e0=document.getElementById("CVReport"+this.getId());
}
var _9e2=_9e0.getElementsByTagName("table");
for(var i=0;i<_9e2.length;i++){
if(_9e2[i].style.borderCollapse=="collapse"){
_9e2[i].style.borderCollapse="separate";
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
for(var _9e4 in this.m_aSecRequests){
if(this.m_aSecRequests[_9e4]=="nextPage"||this.m_aSecRequests[_9e4]=="previousPage"){
return false;
}
}
return true;
};
CCognosViewer.prototype.hasNextPage=function(){
for(var _9e5 in this.m_aSecRequests){
if(this.m_aSecRequests[_9e5]=="nextPage"){
return true;
}
}
return false;
};
CCognosViewer.prototype.hasPrevPage=function(){
for(var _9e6 in this.m_aSecRequests){
if(this.m_aSecRequests[_9e6]=="previousPage"){
return true;
}
}
return false;
};
CCognosViewer.prototype.captureHotkeyPageNavigation=function(evt){
evt=(evt)?evt:((event)?event:null);
if(evt){
var node=getNodeFromEvent(evt);
var _9e9=(node&&node.nodeName)?node.nodeName.toLowerCase():null;
if((evt.keyCode==8&&_9e9!="input"&&_9e9!="textarea")||(evt.altKey==true&&(evt.keyCode==37||evt.keyCode==39))){
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
CCognosViewer.prototype.setUseWorkingDialog=function(_9ea){
this.m_bUseWorkingDialog=_9ea;
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
CCognosViewer.prototype.setHasPrompts=function(_9eb){
if(!_9eb){
this.preProcessControlArray=[];
}
this.m_bReportHasPrompts=_9eb;
};
CCognosViewer.prototype.getHasPrompts=function(){
return this.m_bReportHasPrompts;
};
CCognosViewer.prototype.setUsePageRequest=function(_9ec){
this.m_viewerDispatcher.setUsePageRequest(_9ec);
};
CCognosViewer.prototype.getUsePageRequest=function(){
return this.m_viewerDispatcher.getUsePageRequest();
};
CCognosViewer.prototype.setKeepSessionAlive=function(_9ed){
this.m_bKeepSessionAlive=_9ed;
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
var _9ee;
try{
_9ee=getCognosViewerSCObjectRef(this.m_sId);
}
catch(e){
_9ee=null;
}
return _9ee;
};
CCognosViewer.prototype.addCallback=function(_9ef,oFct,_9f1){
if(!this.m_aCallback){
this.m_aCallback=[];
}
this.m_aCallback=this.m_aCallback.concat({m_sEvent:_9ef,m_oCallback:oFct,m_bCaptureEvent:(_9f1===true)});
};
CCognosViewer.prototype.canDrillDown=function(sId){
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _9f4=this.getSelectionController();
if(_9f4){
return (_9f4.canDrillDown(sCtx));
}
}
return false;
};
CCognosViewer.prototype.canDrillUp=function(sId){
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _9f7=this.getSelectionController();
if(_9f7){
return (_9f7.canDrillUp(sCtx));
}
}
return false;
};
CCognosViewer.prototype.canSubmitPrompt=function(){
var _9f8=null;
if(this.preProcessControlArray&&this.preProcessControlArray instanceof Array){
var _9f9=this.preProcessControlArray.length;
for(var k=0;k<_9f9;k++){
_9f8=eval(this.preProcessControlArray[k]);
if(_9f8.isValid()===false){
if(!this.m_reportRenderingDone||!_9f8.getCascadeOnParameter||!_9f8.getCascadeOnParameter()){
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
CCognosViewer.prototype.dcm=function(_9fb,_9fc){
if(this.canDisplayContextMenu()){
if(this.preSelectNode==true){
_9fc=false;
this.preSelectNode=false;
}
if(this.rvMainWnd.displayContextMenu(_9fb,_9fc)!=false){
return stopEventBubble(_9fb);
}
}
};
CCognosViewer.prototype.canDisplayContextMenu=function(){
if(!this.getUIConfig()||this.getUIConfig().getShowContextMenu()){
return (!this.isWorkingOrPrompting()&&this.rvMainWnd!=null&&typeof this.bCanUseCognosViewerContextMenu!="undefined"&&this.bCanUseCognosViewerContextMenu);
}
return false;
};
CCognosViewer.prototype.de=function(_9fd){
var _9fe=this.getDrillMgr();
if(_9fe){
_9fe.singleClickDrillEvent(_9fd,"RV");
}
};
CCognosViewer.prototype.debug=function(sMsg){
if(this.m_bDebug){
var _a00="";
var _a01=this.debug.caller;
if(typeof _a01=="object"&&_a01!==null){
_a00=_a01.toString().match(/function (\w*)/)[1];
}
if(!_a00){
_a00="?";
}
alert(_a00+": "+sMsg);
}
};
CCognosViewer.prototype.callbackExists=function(_a02){
var _a03=false;
if(this.m_aCallback&&this.m_aCallback.length){
for(var _a04=0;_a04<this.m_aCallback.length;++_a04){
var oCB=this.m_aCallback[_a04];
if(oCB.m_sEvent==_a02){
return true;
}
}
}
return false;
};
CCognosViewer.prototype.executeCallback=function(_a06){
var _a07=false;
if(this.m_aCallback&&this.m_aCallback.length){
for(var _a08=0;_a08<this.m_aCallback.length;++_a08){
var oCB=this.m_aCallback[_a08];
if(oCB.m_sEvent==_a06){
if(typeof oCB.m_oCallback=="function"){
oCB.m_oCallback();
}
if(oCB.m_bCaptureEvent){
_a07=true;
}
}
}
}
return _a07;
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
CCognosViewer.prototype.isWorking=function(_a0b){
if(typeof _a0b!="string"){
_a0b=this.getStatus();
}
return ((""+_a0b).match(/^(working|stillWorking)$/)?true:false);
};
CCognosViewer.prototype.isWorkingOrPrompting=function(){
return (this.getStatus().match(/^(working|stillWorking|prompting)$/)?true:false);
};
CCognosViewer.prototype.getActionState=function(){
return this.m_sActionState;
};
CCognosViewer.prototype.getDataItemName=function(sId){
var _a0d=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a0f=this.getSelectionController();
if(_a0f){
var _a10=_a0f.getRefDataItem(sCtx);
if(_a10){
_a0d=_a10;
}
}
}
return _a0d;
};
CCognosViewer.prototype.getDataType=function(sId){
var _a12=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a14=this.getSelectionController();
if(_a14){
var _a15=_a14.getDataType(sCtx);
if(_a15){
_a12=_a15;
}
}
}
return _a12;
};
CCognosViewer.prototype.getDepth=function(sId){
var _a17=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a19=this.getSelectionController();
if(_a19){
var _a1a=_a19.getDepth(sCtx);
if(_a1a){
_a17=_a1a;
}
}
}
return _a17;
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
var _a1e=this.getSelectionController();
if(_a1e){
var aHUN=_a1e.getHun(sCtx);
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
var _a22=this.getSelectionController();
if(_a22){
var aDUN=_a22.getDun(sCtx);
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
var _a25=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a27=this.getSelectionController();
if(_a27){
var aLUN=_a27.getLun(sCtx);
if(aLUN){
_a25=aLUN;
}
}
}
return _a25;
};
CCognosViewer.prototype.getMemberUniqueName=function(sId){
var sMUN=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a2c=this.getSelectionController();
if(_a2c){
var aMUN=_a2c.getMun(sCtx);
if(aMUN){
sMUN=aMUN;
}
}
}
return sMUN;
};
CCognosViewer.prototype.getObjectId=function(){
var _a2e="window";
if(typeof this.getId()=="string"){
_a2e=getCognosViewerObjectRefAsString(this.getId());
}
return _a2e;
};
CCognosViewer.prototype.getQueryModelId=function(sId){
var _a30=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a32=this.getSelectionController();
if(_a32){
var _a33=_a32.getQueryModelId(sCtx);
if(_a33){
_a30=_a33;
}
}
}
return _a30;
};
CCognosViewer.prototype.getQueryName=function(sId){
var _a35=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a37=this.getSelectionController();
if(_a37){
var _a38=_a37.getRefQuery(sCtx);
if(_a38){
_a35=_a38;
}
}
}
return _a35;
};
CCognosViewer.prototype.getContextIds=function(sId,_a3a){
var aIds=[];
var sCtx=this.findCtx(sId);
if(sCtx){
var _a3d=sCtx.split("::");
if(_a3d&&_a3d.length>1&&_a3a<_a3d.length){
aIds=_a3d[_a3a].split(":");
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
var _a44=aCtx[0][0];
var _a45=this.getSelectionController();
if(_a45){
if(_a45.isContextId(_a44)){
sCtx=sId;
}
}
}
if(!sCtx){
var _a46=this.findElementWithCtx(sId);
if(_a46){
sCtx=_a46.getAttribute("ctx");
}
}
return sCtx;
};
CCognosViewer.prototype.findElementWithCtx=function(sId){
var _a48=sId;
if(typeof sId=="string"){
_a48=this.findElementWithCtx(document.getElementById(sId));
}
if(_a48){
if(_a48.getAttribute&&_a48.getAttribute("ctx")){
return _a48;
}
for(var _a49=0;_a49<_a48.childNodes.length;_a49++){
var _a4a=this.findElementWithCtx(_a48.childNodes[_a49]);
if(_a4a){
return _a4a;
}
}
}
return null;
};
CCognosViewer.prototype.getUseValue=function(sId){
var sVal=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a4e=this.getSelectionController();
if(_a4e){
sVal=_a4e.getUseValue(sCtx);
}
}
return sVal;
};
CCognosViewer.prototype.init=function(_a4f){
if(_a4f&&typeof _a4f=="object"){
for(var _a50 in _a4f){
this[_a50]=_a4f[_a50];
}
}
};
CCognosViewer.prototype.initViewer=function(_a51){
var _a52=new RequestHandler(this);
var _a53=document.getElementById("formBackJax"+this.getId());
if(_a53&&typeof _a53.state!="undefined"&&_a53.state.value.length>0){
_a52.loadReportHTML(_a53.result.value);
var _a54=eval("("+_a53.state.value+")");
_a52.updateViewerState(_a54);
_a52.postComplete();
}else{
if(this.getUsePageRequest()){
var _a55=_a51?_a51.m_sStatus:null;
if(isIE()){
if(window.location.hash=="#working"){
window.history.go(-2);
return;
}else{
if(_a55==="working"||_a55==="stillWorking"){
window.location.hash="#working";
}
}
}else{
if(_a53&&_a53.working){
if(_a53.working.value=="true"){
window.history.go(-1);
return;
}else{
if(_a55==="working"||_a55==="stillWorking"){
_a53.working.value="true";
}
}
}
}
}
_a52.processInitialResponse(_a51);
}
};
CCognosViewer.prototype.saveBackJaxInformation=function(_a56){
var _a57=document.getElementById("formBackJax"+this.getId());
if(_a57){
if(typeof _a57.state!="undefined"){
_a57.state.value=_a56.getResponseStateText();
}
if(typeof _a57.result!="undefined"){
_a57.result.value=_a56.getResult();
}
}
};
CCognosViewer.prototype.pcc=function(evt){
if(evt&&typeof evt.button!="undefined"&&evt.button!="1"){
this.preSelectNode=true;
var _a59=this.getSelectionController();
if(_a59){
_a59.pageContextClicked(evt);
}
}
};
CCognosViewer.prototype.isValidAjaxResponse=function(_a5a){
return (_a5a&&_a5a.childNodes&&_a5a.childNodes.length>0&&_a5a.childNodes[0].nodeName!="parsererror"?true:false);
};
CCognosViewer.prototype.resubmitInSafeMode=function(_a5b){
if(this.m_bUseSafeMode){
this.resetViewerDispatcher();
this.setUsePageRequest(true);
this.envParams["cv.useAjax"]="false";
if(_a5b){
_a5b.retryRequest();
}
}
};
CCognosViewer.prototype.showLoadedContent=function(_a5c){
if(_a5c!==null&&typeof _a5c!="undefined"){
_a5c.style.display="block";
}
this.m_resizeReady=true;
this.doneLoading();
var obj=this;
setTimeout(function(){
obj.renderTabs();
},1);
};
CCognosViewer.prototype.doneLoading=function(){
var _a5e=this.getViewerWidget();
if(_a5e){
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_doneLoading",this);
}
var _a5f=this.getStatus();
if(!this.m_reportRenderingDone&&this.m_resizeReady&&this.m_stateSet){
var _a60=_a5f=="working"||_a5f=="stillWorking"||_a5f=="fault";
_a5e.fireEvent("com.ibm.bux.widget.render.done",null,{noAutoResize:_a60});
if(_a5f=="complete"){
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_doneLoading",this);
}
if(typeof _a5e.postLoadContent=="function"){
_a5e.postLoadContent();
}
this.m_reportRenderingDone=true;
if(!_a60){
var _a61=this;
setTimeout(function(){
_a61.m_readyToRespondToResizeEvent=true;
},20);
}
}
}
if(_a5f!="fault"){
_a5e.clearErrorDlg();
}
this.doneLoadingUpdateA11Y(_a5f);
}else{
var _a5f=this.getStatus();
if(_a5f=="complete"){
this.m_reportRenderingDone=true;
this.JAWSTalk(RV_RES.IDS_JS_READY);
}else{
if(_a5f=="working"){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
}
}
}
};
CCognosViewer.prototype.doneLoadingUpdateA11Y=function(_a62){
if(this.getKeepFocus()!==false&&this.getKeepFocus()!=null){
var _a63=this.getKeepFocus();
if(_a62=="complete"){
this.setKeepFocus(false);
}
var _a64=null;
if(this.getVisibleDialog()!==null){
_a64=this.getVisibleDialog().getDialogDiv();
}else{
if(_a63===true){
_a64=document.getElementById("CVReport"+this.getId());
}else{
if(typeof _a63=="string"){
_a64=document.getElementById(_a63);
}else{
if(_a63!==null){
_a64=_a63;
if(this.isBux){
dojo.window.scrollIntoView(_a64);
}
}
}
}
}
if(_a64){
setFocusToFirstTabItem(_a64);
}
if(_a62=="complete"){
this.JAWSTalk(RV_RES.IDS_JS_READY);
}else{
if(_a62=="working"||_a62=="stillWorking"){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
}
}
}
};
CCognosViewer.prototype.JAWSTalk=function(_a65){
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
div.appendChild(document.createTextNode(_a65));
var _a68=document.getElementById("RVContent"+id);
if(_a68){
_a68.appendChild(div);
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
var _a69=this.getAdvancedServerProperty("VIEWER_JS_EXPAND_COLLAPSE_CONTROLS_DEFAULT");
if(_a69===null){
return false;
}
var _a6a=this.getViewerWidget().getProperties().getShowExpandCollapseIconFlag();
return (_a69.toLowerCase()==="on"&&_a6a!==false)||(_a69.toLowerCase()==="off"&&_a6a===true);
};
CCognosViewer.prototype.setMaxContentSize=function(){
if("10"!=window.getIEVersion()){
return;
}
if(document.body.className==="viewer"){
var _a6b=document.body.offsetHeight;
var _a6c=this.getNonReportHeight(document.getElementById("CVReport"+this.getId()));
var _a6d=document.getElementById("mainViewerTable"+this.getId());
_a6d.style.maxHeight=_a6b-_a6c-2+"px";
var _a6e=GUtil.generateCallback(this.setMaxContentSize,[true],this);
if(!this.attachedOnResize){
this.attachedOnResize=true;
if(window.attachEvent){
window.attachEvent("onresize",_a6e);
}else{
if(window.addEventListener){
window.addEventListener("resize",_a6e,false);
}
}
}
}
};
CCognosViewer.prototype.getNonReportHeight=function(node){
var _a70=0;
var _a71=node.parentNode;
if(!_a71){
return _a70;
}
if(_a71.childNodes.length>1){
for(var i=0;i<_a71.childNodes.length;i++){
var _a73=_a71.childNodes[i];
if(_a73!=node&&!isNaN(_a73.clientHeight)&&_a73.style.display!="none"){
_a70+=_a73.clientHeight;
}
}
}
if(node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
_a70+=this.getNonReportHeight(_a71);
}
return _a70;
};
CCognosViewer.prototype.addPageAdornments=function(){
this.m_layoutElements=null;
this.m_lidToElement=null;
this.initFlashCharts();
this.insertSortIconsForAllLists();
var _a74=this.getViewerWidget().getProperties();
if(this.canInsertExpandIconsForAllCrosstabs()){
this.insertExpandIconsForAllCrosstabs();
}
var _a75=document.getElementById("CVReport"+this.getId());
if(_a75){
var oCV=this;
setTimeout(function(){
if(oCV.getPinFreezeManager()&&oCV.getPinFreezeManager().hasFrozenContainers()){
oCV.getPinFreezeManager().renderReportWithFrozenContainers(_a75);
}
oCV.addInfoBar();
},1);
}
this.getViewerWidget().reselectSelectionFilterObjects();
this.getViewerWidget().addChromeWhitespaceHandler(this.getId());
};
CCognosViewer.prototype.addFlashChart=function(_a77){
this.m_flashChartsObjectIds.push(_a77);
};
CCognosViewer.prototype.flashChartError=function(_a78){
var _a79=this.getViewerWidget();
var _a7a=_a79.getProperties();
_a7a.setProperty("flashCharts",false);
var _a7b=this.getAction("Redraw");
_a7b.isUndoable=function(){
return false;
};
_a7b.execute();
};
CCognosViewer.prototype.initFlashCharts=function(){
var _a7c=this.getViewerWidget();
if(this.m_flashChartsObjectIds.length>0){
var _a7d=document.getElementById("rt"+this.getId());
if(window.addEventListener){
_a7d.addEventListener("mousedown",onFlashChartRightClick,true);
}else{
var _a7e={};
var _a7f=function(){
this.releaseCapture();
};
var _a80=function(){
onFlashChartRightClick(event);
this.setCapture();
};
for(var i=0;i<this.m_flashChartsObjectIds.length;++i){
var _a82=this.m_flashChartsObjectIds[i];
var _a83=document.getElementById(_a82);
_a7e[_a82]=1;
_a83.parentNode.onmouseup=_a7f;
_a83.parentNode.onmousedown=_a80;
}
if(this.m_flashChartsObjectIds.length>0){
_a7d.attachEvent("oncontextmenu",function(){
if(_a7e[window.event.srcElement.id]){
return false;
}
});
}
}
if(_a7c){
_a7c.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive",null,true);
}
}else{
if(_a7c){
_a7c.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive",null,false);
}
}
};
CCognosViewer.prototype.initializeLayoutElements=function(){
var _a84=document.getElementById("rt"+this.getId());
var _a85=getElementsByAttribute(_a84,"*","lid");
this.m_lidToElement={};
this.m_layoutElements=[];
var _a86=0;
var _a87=this.getPinFreezeManager();
for(var i=0;i<_a85.length;i++){
var e=_a85[i];
if(!_a87||!_a87.getContainerElement(e)||_a87.isElementInMainOutput(e)){
this.m_layoutElements[_a86]=e;
this.m_lidToElement[e.getAttribute("lid")]=e;
_a86++;
}
}
};
CCognosViewer.prototype.getLayoutElement=function(_a8a){
if(!this.m_layoutElements){
this.initializeLayoutElements();
}
if(this.m_layoutElements){
return this.m_layoutElements[_a8a];
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
var _a8c=this.getRAPReportInfo();
if(_a8c){
var _a8d=document.getElementById("rt"+this.getId());
this.initializeLayoutElements();
var _a8e=[];
this.m_aInfoBar=[];
for(var _a8f=0;_a8f<this.m_layoutElements.length;++_a8f){
var _a90=this.m_layoutElements[_a8f];
var lid=_a90.getAttribute("lid");
if(lid){
if(lid.indexOf("RAP_NDH_")>-1){
lid=lid.substring(8);
}
lid=lid.substring(0,lid.indexOf(this.getId()));
}
var _a92=_a8c.getContainer(lid);
if(_a92&&typeof _a92.parentContainer=="undefined"){
var _a93=this.collectChildContainers(_a92.container);
if(this.getPinFreezeManager()){
oPinFreezeContainerElement=this.getPinFreezeManager().getContainerElement(_a90);
_a90=(oPinFreezeContainerElement)?oPinFreezeContainerElement:_a90;
}
var _a94=new InfoBar(this,_a90,_a92,_a93,_a8f);
_a94.setTimingDetails(_a8c._getEventTimings());
_a94.render();
if(_a94.hasSomethingRendered()){
_a8e.push(_a94.getId());
}
this.m_aInfoBar.push(_a94);
}
}
var _a95=this.getViewerWidget();
if(_a95){
_a95.refreshInfoBarRenderedState(_a8e);
}
}
};
CCognosViewer.prototype.collectChildContainers=function(_a96){
var _a97=[];
var _a98=this.getRAPReportInfo();
if(_a98){
var _a99=_a98.getContainerCount();
for(var cidx=0;cidx<_a99;++cidx){
var _a9b=_a98.getContainerFromPos(cidx);
if(typeof _a9b.parentContainer!="undefined"&&_a9b.parentContainer==_a96){
_a97.push(_a9b);
}
}
}
return _a97;
};
CCognosViewer.prototype.addReportInfo=function(){
var _a9c=this.getViewerWidget();
if(typeof _a9c==="undefined"||_a9c===null){
return;
}
if(!_a9c.getAttributeValue("originalReport")||this.isIWidgetMobile()){
return;
}
var _a9d=this.envParams["baseReportModificationTime"];
var _a9e=_a9c.getAttributeValue("baseReportModificationTime");
if(typeof _a9d!=="undefined"&&typeof _a9e!=="undefined"&&_a9e&&_a9e!="<empty>"&&_a9d!==_a9e){
var cvid=this.getId();
var _aa0=document.getElementById("CVReport"+cvid);
var _aa1=_aa0.parentNode;
var id="ReportInfo"+cvid;
var _aa3=document.createElement("div");
_aa3.setAttribute("id",id+"_container");
_aa3.setAttribute("cvid",cvid);
_aa3.className="new-info-indicator BUXNoPrint";
var _aa4=document.createElement("img");
var img=null;
if(this.getDirection()==="rtl"){
img="/rv/images/action_show_info_rtl.png";
}else{
img="/rv/images/action_show_info.png";
}
_aa4.src=this.getWebContentRoot()+img;
_aa4.className="reportInfoIcon";
_aa4.setAttribute("tabIndex","0");
_aa4.setAttribute("alt","");
_aa4.setAttribute("title","");
_aa4.setAttribute("role","presentation");
var _aa6=RV_RES.IDS_JS_REPORT_INFO_TITLE;
var _aa7=RV_RES.IDS_JS_REPORT_INFO_TEXT;
var _aa8=RV_RES.IDS_JS_REPORT_INFO_LINK_TEXT;
_aa3.appendChild(_aa4);
_aa1.insertBefore(_aa3,_aa0);
this.m_reportInfoTooltip=new bux.reportViewer.ReportInfo({connectId:[id+"_container"],focusElement:_aa4,position:["above","below"],title:_aa6,text:_aa7,linkText:_aa8,linkScript:getCognosViewerObjectRefAsString(cvid)+".reportInfoResetReport();",allowMouseOverToolTip:true});
}
};
CCognosViewer.prototype.reportInfoResetReport=function(){
this.executeAction("ResetToOriginal");
};
CCognosViewer.prototype.hideReportInfo=function(){
var _aa9=document.getElementById("ReportInfo"+this.getId()+"_container");
if(typeof _aa9!=="undefined"&&_aa9!==null){
_aa9.style.visibility="hidden";
}
};
CCognosViewer.prototype.insertSortIcons=function(){
var _aaa=this.envParams?this.envParams.limitedInteractiveMode:true;
if(typeof _aaa==="undefined"||_aaa===true){
return;
}
if(this.envParams["ui.action"]==="run"||this.envParams["ui.primaryAction"]==="run"){
this.insertSortIconsForAllLists();
}
};
CCognosViewer.prototype._getContainers=function(_aab){
var _aac=[];
var _aad="",_aae="";
if(_aab==="list"){
_aad="list";
_aae="ls";
}else{
if(_aab==="crosstab"){
_aad="crosstab";
_aae="xt";
}
}
var _aaf=document.getElementById("CVReport"+this.getId());
if(this.getRAPReportInfo()){
var _ab0=this.getRAPReportInfo().getContainerIds(_aad);
for(var i=0;i<_ab0.length;++i){
var _ab2=getElementsByAttribute(_aaf,"table","lid",_ab0[i]+this.getId(),1);
if(_ab2&&_ab2.length>0){
_aac.push(_ab2[0]);
}
}
}else{
_aac=getElementsByClassName(_aaf,"table",_aae);
}
return _aac;
};
CCognosViewer.prototype.insertSortIconsForAllLists=function(){
var _ab3=this._getContainers("list");
for(var i=0;i<_ab3.length;++i){
this.insertSortIconsToList(_ab3[i]);
}
};
CCognosViewer.prototype.insertSortIconsToList=function(_ab5){
var _ab6=getElementsByAttribute(_ab5,"*","type","columnTitle");
for(var i=0;i<_ab6.length;++i){
var _ab8=_ab6[i];
this.getSelectionController().getSelectionObjectFactory().getSelectionObject(_ab8);
if(_ab8.getAttribute("canSort")!="false"&&_ab8.getAttribute("CTNM")===null&&_ab8.getAttribute("CC")===null){
var _ab9=false;
for(var _aba=0;_aba<_ab8.childNodes.length;_aba++){
var _abb=_ab8.childNodes[_aba];
if(_abb.nodeName.toLowerCase()=="img"){
if(_abb.id&&_abb.id.indexOf("sortimg")===0){
_ab9=true;
break;
}
var sLid=_abb.getAttribute("lid");
if(sLid&&sLid.indexOf("SortIcon")!==-1){
_ab8.removeChild(_abb);
break;
}
}
}
if(!_ab9&&this.canInsertSortIcon(_ab8)){
this.insertSortIconToColumnHeader(_ab8);
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
CCognosViewer.prototype.canInsertSortIcon=function(_abe){
var _abf=_abe.getAttribute("rp_sort");
return ((!this.isLimitedInteractiveMode()&&!this.isBlacklisted("Sort"))||(_abf!==undefined&&_abf!==null&&_abf.length>0));
};
CCognosViewer.prototype.insertSortIconToColumnHeader=function(_ac0){
if(!_ac0.style.whiteSpace){
_ac0.style.whiteSpace="nowrap";
}
var _ac1=document.createElement("img");
_ac1.setAttribute("id","sortimg"+Math.random());
if((!this.isLimitedInteractiveMode()&&!this.isBlacklisted("Sort"))){
_ac1.onmouseover=function(){
this.setAttribute("oldClassName",this.className);
this.className+=" sortIconOver";
};
_ac1.onmouseout=function(){
this.className=this.getAttribute("oldClassName");
this.removeAttribute("oldClassName");
};
}
_ac1.src=this.getImgSrc(_ac0);
var _ac2=this.getSortInfo(_ac0);
var _ac3=this.getSortOrder(_ac2);
_ac1.setAttribute("alt",this.getSortAltText(_ac3));
_ac1.setAttribute("title",this.getSortAltText(_ac3));
_ac1.className=this.getSortClass(_ac2);
_ac1.setAttribute("sortOrder",_ac3);
_ac0.appendChild(_ac1);
};
CCognosViewer.prototype.canInsertShowExpandCollapseIconForNode=function(_ac4,_ac5){
var _ac6=this.getSelectionController();
var _ac7=_ac6.hasCalculationMetadata(_ac5,[_ac5],"crosstab");
return ((_ac6.canDrillDown(_ac5)||_ac4.alwaysCanExpandCollapse)&&!_ac6.isCalculationOrMeasure(_ac5,_ac7));
};
CCognosViewer.prototype.insertExpandIconsForAllCrosstabs=function(){
var _ac8=this._getContainers("crosstab");
var _ac9=this;
var _aca=this.getRAPReportInfo();
var _acb=this.getReportContextHelper();
for(var i=0;i<_ac8.length;i++){
var _acd=_ac8[i];
var _ace=_acd.getAttribute("lid");
_ace=_ace.substring(0,_ace.length-this.getId().length);
var _acf=getElementsByAttribute(_acd,["td","th"],"ctnm","true");
for(var j=0;j<_acf.length;j++){
var _ad1=_acf[j];
var sCtx=this.findCtx(_ad1);
var _ad3=_acb.getDataItemName(sCtx);
if(_ad3){
var _ad4=_aca.getItemInfo(_ace,_ad3);
var _ad5=_acb.processCtx(sCtx);
if(this.canInsertShowExpandCollapseIconForNode(_ad4,_ad5[0][0])){
var sMun=_acb.getMun(sCtx);
var _ad7=sMun&&_ad4.expandedMembers&&_ad4.expandedMembers[sMun]===true;
var _ad8=document.createElement("div");
_ad8.setAttribute("skipSelection","true");
_ad8.className="expandButton "+(_ad7?"collapse":"expand");
_ad1.insertBefore(_ad8,_ad1.firstChild);
var _ad9=document.createElement("span");
_ad9.className="expandButtonCaption";
_ad9.innerHTML=(_ad7?"[-]":"[+]");
_ad8.appendChild(_ad9);
}
}
}
}
};
CCognosViewer.prototype.removeExpandIconsForAllCrosstabs=function(){
var _ada=this._getContainers("crosstab");
for(var i=0;i<_ada.length;i++){
var _adc=_ada[i];
var _add=_adc.getAttribute("lid");
_add=_add.substring(0,_add.length-this.getId().length);
var _ade=getElementsByAttribute(_adc,"td","ctnm","true");
for(var j=0;j<_ade.length;j++){
var _ae0=_ade[j];
if(_ae0.firstChild.className==="expandButton collapse"||_ae0.firstChild.className==="expandButton expand"){
_ae0.removeChild(_ae0.firstChild);
}
}
}
};
CCognosViewer.prototype.fillInContextData=function(){
if(!this.isLimitedInteractiveMode()){
var _ae1=document.getElementById("CVReport"+this.getId());
var _ae2=getElementsByClassName(_ae1,"table","ls");
for(var i=0;i<_ae2.length;++i){
var _ae4=getElementsByAttribute(_ae2[i],"*","type","columnTitle");
for(var j=0;j<_ae4.length;++j){
this.getSelectionController().getSelectionObjectFactory().getSelectionObject(_ae4[j]);
}
}
}
};
CCognosViewer.prototype.getSortAltText=function(_ae6){
if(_ae6==="ascending"){
return RV_RES.IDS_JS_SORT_ASCENDING;
}else{
if(_ae6==="descending"){
return RV_RES.IDS_JS_SORT_DESCENDING;
}else{
if(_ae6==="nosort"){
return RV_RES.IDS_JS_NOT_SORTED;
}
}
}
};
CCognosViewer.prototype.getSortInfo=function(_ae7){
var _ae8=_ae7.getAttribute("rp_sort");
if(_ae8){
_ae8=_ae8.split(".");
}
return _ae8;
};
CCognosViewer.prototype.getSortClass=function(_ae9){
var _aea="sortIconHidden";
if(_ae9){
if(_ae9[0]==="d"||_ae9[0]==="a"){
_aea="sortIconVisible";
}
}
return _aea;
};
CCognosViewer.prototype.getSortOrder=function(_aeb){
var _aec="nosort";
if(_aeb){
if(_aeb[0]==="d"){
_aec="descending";
}else{
if(_aeb[0]==="a"){
_aec="ascending";
}
}
}
return _aec;
};
CCognosViewer.prototype.getImgSrc=function(_aed){
var _aee=_aed.getAttribute("rp_sort");
var src=this.getWebContentRoot()+"/rv/images/"+this.getSortIconName(_aee);
return src;
};
CCognosViewer.prototype.getSortIconName=function(_af0){
var _af1="sort_no.gif";
if(_af0){
_af0=_af0.split(".");
if(_af0[0]==="d"){
_af1="sort_descending.gif";
}else{
if(_af0[0]==="a"){
_af1="sort_ascending.gif";
}
}
}
return _af1;
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
var _af2=this.getViewerWidget();
return (_af2&&_af2.promptParametersRetrieved==true&&this.envParams&&typeof this.envParams["reportPrompts"]!="undefined"&&this.envParams["reportPrompts"]!=null&&this.envParams["reportPrompts"].length>0);
};
CCognosViewer.prototype.getPromptParametersInfo=function(){
var _af3=null;
if(this.widgetHasPromptParameters()){
_af3="<widget><parameterValues>"+sXmlEncode(this.getExecutionParameters())+"</parameterValues>"+this.envParams["reportPrompts"]+"</widget>";
}
return _af3;
};
CCognosViewer.prototype.raisePromptEvent=function(_af4,_af5,_af6){
try{
var _af7=this.getViewerWidget();
_af7.getWidgetContextManager().raisePromptEvent(_af4,_af5,_af5.get("ui.action"),this.getModelPath(),_af6);
}
catch(e){
}
};
CCognosViewer.prototype.getModelPath=function(){
var _af8=this.getSelectionController().getModelPathForCurrentSelection();
if(_af8){
return _af8;
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
CCognosViewer.prototype.setKeepFocus=function(_af9){
this._keepFocus=_af9;
};
CCognosViewer.prototype.getKeepFocus=function(){
if(typeof this._keepFocus!="undefined"){
return this._keepFocus;
}
return false;
};
CCognosViewer.prototype.onFocus=function(evt){
var _afb=this.getA11YHelper();
if(_afb){
_afb.onFocus(evt);
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
var _afd=this.getStatus();
var _afe=document.getElementById("cvSkipToReport"+this.getId());
if(_afe){
_afe.style.display=_afd=="prompting"?"none":"";
}
};
CCognosViewer.prototype.updateSkipToNavigationLink=function(_aff){
var _b00=document.getElementById("cvSkipToNavigation"+this.getId());
if(_b00){
_b00.style.display=_aff?"none":"";
}
};
CCognosViewer.prototype.pageAction=function(_b01){
this.setKeepFocus("CVNavLinks"+this.getId());
var _b02=new ViewerDispatcherEntry(this);
_b02.addFormField("ui.action",_b01);
if(this.getCurrentlySelectedTab()){
_b02.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",this.getCurrentlySelectedTab());
}
this.dispatchRequest(_b02);
};
CCognosViewer.prototype.writeNavLink=function(_b03,_b04,_b05,_b06){
var _b07="";
if(_b05){
_b07="<td nowrap=\"nowrap\">"+"<img src=\"LINK_IMG\" width=\"15\" height=\"15\" alt=\"\" style=\"vertical-align:middle;\">"+"</td>"+"<td nowrap=\"nowrap\">";
if(_b06){
_b07+="<a href=\"#\" tabindex=\"0\" onclick=\""+getCognosViewerObjectRefAsString(this.getId())+".getViewerWidget().getSavedOutput().pageAction('LINK_REQUEST');return false;\"";
}else{
_b07+="<a href=\"#\" tabindex=\"0\" onclick=\""+getCognosViewerObjectRefAsString(this.getId())+".pageAction('LINK_REQUEST');return false;\"";
}
_b07+=">LINK_TEXT</a>&#160;"+"</td>";
}else{
_b07="<td nowrap=\"nowrap\">"+"<img src=\"LINK_IMG\" width=\"15\" height=\"15\" alt=\"\" style=\"vertical-align:middle;\">"+"</td>"+"<td nowrap=\"nowrap\">LINK_TEXT&#160;</td>";
}
var sImg=this.sSkin+(!_b05&&_b03.sImgDisabled?_b03.sImgDisabled:_b03.sImg);
return _b07.replace(/LINK_REQUEST/g,_b04).replace(/LINK_TEXT/g,_b03.sText).replace(/LINK_IMG/g,sImg);
};
CCognosViewer.prototype.loadNavLinks=function(){
var _b09=window.gScriptLoader.loadFile(this.getGateway(),"b_action=xts.run&m=portal/report-viewer-navlinks.xts");
if(_b09){
this.init(eval("("+_b09+")"));
}
};
CCognosViewer.prototype.writeNavLinks=function(sSR,_b0b){
var _b0c=document.getElementById("CVNavLinks"+this.getId());
if(_b0c){
var _b0d=document.getElementById("CVNavLinks_Container"+this.getId());
if(typeof this.oNavLinks!="object"||typeof sSR!="string"||!sSR.match(/\bfirstPage\b|\bpreviousPage\b|\bnextPage\b|\blastPage\b|\bplayback\b/i)){
_b0c.style.display="none";
if(_b0d){
_b0d.style.display="none";
}
this.updateSkipToNavigationLink(true);
return;
}
this.updateSkipToNavigationLink(false);
if(_b0d){
_b0d.style.display="";
}
_b0c.style.display=(isIE()?"block":"table-cell");
var _b0e="";
_b0e+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"pageControls BUXNoPrint\" role=\"presentation\"><tbody><tr>";
_b0e+=this.writeNavLink(this.oNavLinks.oFirst,"firstPage",sSR.match(/\bfirstPage\b/gi),_b0b);
_b0e+=this.writeNavLink(this.oNavLinks.oPrevious,"previousPage",sSR.match(/\bpreviousPage\b/gi),_b0b);
_b0e+=this.writeNavLink(this.oNavLinks.oNext,"nextPage",sSR.match(/\bnextPage\b/gi),_b0b);
_b0e+=this.writeNavLink(this.oNavLinks.oLast,"lastPage",sSR.match(/\blastPage\b/gi),_b0b);
_b0e+="</tr></tbody></table>";
var _b0f=document.getElementById("CVNavLinks_label"+this.getId());
var _b10="";
if(_b0f){
_b10+="<span id=\"CVNavLinks_label"+this.getId()+"\" style=\"visibilty:hidden; display:none;\">"+_b0f.innerHTML+"</span>";
}
_b0c.innerHTML=_b10+_b0e;
}else{
if(this.shouldWriteNavLinks()){
setTimeout(getCognosViewerObjectRefAsString(this.getId())+".writeNavLinks(\""+sSR+"\",\""+_b0b+"\");",100);
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
var _b14=this.getActiveRequest();
if(_b14){
_b14.abortHttpRequest();
}
};
CCognosViewer.prototype.canCancel=function(){
var _b15=this.getTracking();
var _b16=this.getStatus();
return _b15!=""&&_b16!="complete";
};
CCognosViewer.prototype.cancel=function(_b17){
if(this.getWorkingDialog()&&this.getWorkingDialog().disableCancelButton){
this.getWorkingDialog().disableCancelButton(_b17);
}
this.removeTransparentBackgroundLayer();
this.clearPrompts();
if(this.m_viewerFragment&&this.envParams["fragment.fireEventWhenComplete"]){
this.envParams["fragment.fireEventWhenComplete"]="";
}
var _b18=null;
if(this.m_undoStack.length>0){
_b18=this.m_undoStack.pop();
}
var _b19=this.getActiveRequest();
if(this.canCancel()===true||_b19){
if(_b19){
_b19.cancelRequest(true);
}else{
var _b1a=null;
var _b1b=_b18!=null&&_b18.m_bRefreshPage;
if(typeof this.getCancelDispatcherEntry=="function"){
_b1a=this.getCancelDispatcherEntry();
}else{
if(_b1b||this.m_viewerFragment){
_b1a=new ViewerDispatcherEntry(this);
}else{
if(this.getId()=="RS"){
_b1a=new ViewerDispatcherEntry(this);
_b1a.addFormField("cv.responseFormat","rs");
}else{
_b1a=new DispatcherEntry(this);
_b1a.addFormField("cv.responseFormat","successfulRequest");
}
}
}
_b1a.forceSynchronous();
_b1a.addFormField("ui.action","cancel");
_b1a.addFormField("m_tracking",this.getTracking());
this.setTracking("");
if(_b1b){
var _b1c="<CognosViewerUndo><conversation>";
_b1c+=_b18.m_sConversation;
_b1c+="</conversation></CognosViewerUndo>";
_b1a.addFormField("cv.previousSession",_b1c);
}
this.dispatchRequest(_b1a);
if(!this.isBux&&!this.m_viewerFragment&&(this.getUsePageRequest()||!this.isReportRenderingDone())){
this.executeCallback("cancel");
}
}
this.setStatus("complete");
var _b1d=this.envParams["ui.action"];
var _b1e=this.getUsePageRequest();
var _b1f=this.m_undoStack.length;
if(_b18!=null){
this.m_sConversation=_b18.m_sConversation;
this.m_sParameters=_b18.m_sParameters;
this.envParams={};
applyJSONProperties(this.envParams,_b18.m_envParams);
this.m_undoStack.push(_b18);
}
this.setTracking("");
if(this.previouslySelectedTab){
this.cancelTabSwitch();
}else{
if(_b1d!="view"&&_b1f<=0&&this.rvMainWnd){
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
var _b20=this.preProcessControlArray.length;
var k=0;
for(k=0;k<_b20;k++){
var _b22=eval(this.preProcessControlArray[k]);
if(_b22){
if(_b22.clearSubmit){
_b22.clearSubmit();
}
}
}
}
};
CCognosViewer.prototype.wait=function(){
if(this.isWorking()){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
var _b23=new ViewerDispatcherEntry(this);
_b23.addFormField("ui.action","wait");
_b23.addFormField("ui.primaryAction",this.envParams["ui.primaryAction"]);
_b23.addFormField("cv.actionState",this.envParams["cv.actionState"]);
_b23.addNonEmptyStringFormField("bux",this.envParams["bux"]);
_b23.addNonEmptyStringFormField("ui.preserveRapTags",this.envParams["ui.preserveRapTags"]);
this.dispatchRequest(_b23);
return true;
}
return false;
};
CCognosViewer.prototype.setCAFContext=function(_b24){
this.m_sCAFContext=_b24;
};
CCognosViewer.prototype.setContextInfo=function(sXML){
this.m_sContextInfoXML=sXML;
};
CCognosViewer.prototype.setConversation=function(_b26){
this.m_sConversation=_b26;
};
CCognosViewer.prototype.setActionState=function(_b27){
this.m_sActionState=_b27;
};
CCognosViewer.prototype.setStatus=function(_b28){
this.m_sStatus=_b28;
};
CCognosViewer.prototype.setDebug=function(_b29){
this.m_bDebug=_b29;
};
CCognosViewer.prototype.setExecutionParameters=function(_b2a){
this.m_sParameters=_b2a;
};
CCognosViewer.prototype.setMetadataInfo=function(sXML){
this.m_sMetadataInfoXML=sXML;
};
CCognosViewer.prototype.setSecondaryRequests=function(_b2c){
if(_b2c){
this.m_aSecRequests=_b2c;
}else{
this.m_aSecRequests=[];
}
};
CCognosViewer.prototype.setTracking=function(_b2d){
this.m_sTracking=_b2d;
};
CCognosViewer.prototype.setSoapFault=function(_b2e){
this.m_sSoapFault=_b2e;
};
CCognosViewer.prototype.showOutputInNewWindow=function(sURL){
var _b30=document.getElementById("formWarpRequest"+this.getId());
var _b31=_b30.elements["ui.postBack"];
var _b32=_b30.elements["ui.backURL"];
if(window.opener||_b31||(_b32&&_b32.value!=="javascript:window.close();")){
window.open(sURL,"","");
this.updateNewBrowserWindow();
}else{
if(this.isAccessibleMode()&&this.envParams["run.outputFormat"]=="PDF"&&window.detachLeavingRV){
window.detachLeavingRV();
}
window.location=sURL;
}
};
CCognosViewer.prototype.hideToolbar=function(_b33){
this.m_bHideToolbar=_b33;
};
CCognosViewer.prototype.showExcel=function(sURL){
var _b35=true;
var _b36=document.getElementById("formWarpRequest"+this.getId());
var _b37=_b36.elements["ui.backURL"];
if(_b37&&_b37.value.indexOf("javascript:window.close()")!==0&&_b37.value.indexOf("close.html")===-1){
_b35=false;
}
var _b38=window;
if(window.opener&&(isIE()||isFF())&&_b35){
_b38=window.opener?window.opener:window;
}else{
if(!window.opener&&_b35){
var _b39=this.envParams["run.outputFormat"].toLowerCase();
if((_b39=="spreadsheetml"||_b39=="csv"||_b39=="singlexls"||_b39=="xlsxdata"||_b39=="xlwa")&&window.detachLeavingRV&&window.attachLeavingRV){
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
var _b3a=null;
var _b3b="";
try{
if(this.envParams["cv.excelWindowOpenProperties"]){
_b3b=this.envParams["cv.excelWindowOpenProperties"];
}
_b3a=_b38.open(sURL,"",_b3b);
}
catch(e){
_b38=window;
_b3a=_b38.open(sURL,"",_b3b);
}
if(!_b3a||_b3a.closed||typeof _b3a.closed=="undefined"){
alert(RV_RES.RV_BROWSER_POPUP_IS_ENABLED);
}
this.updateNewBrowserWindow();
};
CCognosViewer.prototype.updateNewBrowserWindow=function(){
var id=this.getId();
var _b3d=document.forms["formWarpRequest"+id].elements["ui.postBack"];
var _b3e=document.forms["formWarpRequest"+id].elements["ui.backURL"];
if(_b3d&&_b3d.value){
setTimeout(getCognosViewerObjectRefAsString(id)+".getRV().doPostBack();",100);
}else{
if(_b3e&&_b3e.value){
if(_b3e.value.length<2048){
setTimeout("location.replace(\""+_b3e.value+"\");",100);
}else{
_b3e=decodeURIComponent(_b3e.value);
var _b3f=_b3e.split("?");
var _b40=document.createElement("form");
_b40.style.display="none";
_b40.setAttribute("target","_self");
_b40.setAttribute("method","post");
_b40.setAttribute("action",_b3f[0]);
var _b41=_b3f[1].split("&");
for(var _b42=0;_b42<_b41.length;_b42++){
var _b43=_b41[_b42].indexOf("=");
var _b44=_b41[_b42].substr(0,_b43);
var _b45=_b41[_b42].substr(_b43+1);
var _b46=document.createElement("img");
_b46.setAttribute("type","hidden");
_b46.setAttribute("name",decodeURIComponent(_b44));
_b46.setAttribute("value",decodeURIComponent(_b45));
_b40.appendChild(_b46);
}
document.body.appendChild(_b40);
_b40.submit();
}
}else{
window.close();
}
}
};
CCognosViewer.prototype.showWaitPage=function(){
};
CCognosViewer.prototype.sendRequest=function(_b47){
var _b48=new ViewerDispatcherEntry(this);
_b48.addFormField("ui.action",_b47.getAction());
if(_b47.getCallback()!=null){
_b48.setCallbacks({"complete":{"object":null,"method":_b47.getCallback()}});
}
var _b49=_b47.getFormFields().keys();
for(var _b4a=0;_b4a<_b49.length;_b4a++){
_b48.addFormField(_b49[_b4a],_b47.getFormFields().get(_b49[_b4a]));
}
var _b4b=_b47.m_oOptions.keys();
for(var _b4c=0;_b4c<_b4b.length;_b4c++){
_b48.addFormField(_b4b[_b4c],_b47.getOption(_b4b[_b4c]));
}
var _b4d=_b47.m_oParams.keys();
for(var _b4e=0;_b4e<_b4d.length;_b4e++){
_b48.addFormField(_b4d[_b4e],_b47.getParameter(_b4d[_b4e]));
}
this.dispatchRequest(_b48);
};
CCognosViewer.prototype.promptAction=function(_b4f,sUrl){
this.setKeepFocus(true);
if(typeof datePickerObserverNotify=="function"){
datePickerObserverNotify();
}
var _b51=this.getViewerWidget();
if(_b4f=="cancel"){
this.cancelPrompt(sUrl);
if(_b51){
if(!this.isReportRenderingDone()){
var _b52={action:"deleteWidget"};
_b51.fireEvent("com.ibm.bux.widget.action",null,_b52);
}
}
}else{
var oReq=new ViewerDispatcherEntry(this);
oReq.addFormField("ui.action",_b4f=="back"?"back":"forward");
if(_b4f=="finish"){
oReq.addFormField("run.prompt",false);
}else{
if(_b4f=="back"||_b4f=="next"){
oReq.addFormField("run.prompt",true);
}
}
if(_b4f=="reprompt"){
if(typeof repromptObserverNotify=="function"){
repromptObserverNotify(this);
}
oReq.addFormField("_promptControl",_b4f);
}else{
oReq.addFormField("_promptControl","prompt");
}
if(_b51){
_b51.fireEvent("com.ibm.bux.widget.modified",null,{"modified":true});
if(_b51.isSelectionFilterEnabled){
_b51.clearSelectionFilter();
}
}
this.submitPromptValues(oReq);
}
};
CCognosViewer.prototype.cancelPrompt=function(sUrl){
this.cancel();
};
CCognosViewer.prototype.notify=function(_b55,_b56){
var _b57=0,k=0;
var _b59=null;
if(this.rangeObserverArray&&this.rangeObserverArray instanceof Array){
_b57=this.rangeObserverArray.length;
for(k=0;k<_b57;k++){
_b59=eval(this.rangeObserverArray[k]);
if(_b59&&typeof _b59=="object"&&typeof _b59.update=="function"){
_b59.update();
}
}
}
var _b5a=true;
if(this.preProcessControlArray&&this.preProcessControlArray instanceof Array){
_b57=this.preProcessControlArray.length;
for(k=0;k<_b57;k++){
_b59=eval(this.preProcessControlArray[k]);
if((typeof _b59.getValid=="function")&&!_b59.getValid()){
_b5a=false;
break;
}
}
}
this.notifyPageNavEnabled(_b5a);
if(this.multipleObserverArray&&this.multipleObserverArray instanceof Array){
_b57=this.multipleObserverArray.length;
for(k=0;k<_b57;k++){
_b59=eval(this.multipleObserverArray[k]);
if(_b59&&typeof _b59=="object"&&typeof _b59.checkInsertRemove=="function"){
_b59.checkInsertRemove();
}
}
}
for(var _b5b=0;_b5b<gaNotifyTargets.length;_b5b++){
var _b5c=gaNotifyTargets[_b5b];
if(typeof _b5c!="undefined"&&typeof _b5c.notify=="function"){
_b5c.notify(_b55,_b56);
}
}
};
CCognosViewer.prototype.notifyPageNavEnabled=function(_b5d){
if(this.pageNavigationObserverArray&&this.pageNavigationObserverArray instanceof Array){
var _b5e=this.pageNavigationObserverArray.length;
var _b5f=false;
var _b60=null;
var _b61=null;
var k=0;
for(k=0;k<_b5e;k++){
try{
_b60=eval(this.pageNavigationObserverArray[k]);
_b61=_b60.getType();
if(_b61==PROMPTBUTTON_FINISH){
_b5f=true;
break;
}
}
catch(e){
}
}
for(k=0;k<_b5e;k++){
try{
_b60=eval(this.pageNavigationObserverArray[k]);
_b61=_b60.getType();
if(!_b5d){
if((_b61==PROMPTBUTTON_NEXT)||(_b61==PROMPTBUTTON_OK)||(_b61==PROMPTBUTTON_FINISH)){
_b60.setEnabled(false);
}
}else{
if(_b61==PROMPTBUTTON_FINISH){
_b60.setEnabled(this.bCanFinish);
}else{
if(_b61==PROMPTBUTTON_NEXT){
_b60.setEnabled(this.bNextPage||!_b5f);
}else{
if(_b61==PROMPTBUTTON_OK){
_b60.setEnabled(true);
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
CCognosViewer.prototype.getDrillResetHUNs=function(_b63){
var _b64=null;
if(this.getRAPReportInfo()){
_b64=this.getRAPReportInfo().getDrilledOnHUNs();
}
if(!_b64){
return null;
}
var _b65=this.getExecutionParameters();
if(!_b65){
return null;
}
var _b66=this._getListOfChangedPromptParameters(_b63);
if(!_b66||_b66.length===0){
return null;
}
var _b67=[];
for(var i=0;i<_b64.length;i++){
for(var j=0;j<_b66.length;j++){
if(_b66[j].indexOf(_b64[i])!==-1){
_b67.push(_b64[i]);
}
}
}
return _b67;
};
CCognosViewer.prototype.getOldParameters=function(){
var _b6a=new CParameterValues();
var _b6b=XMLBuilderLoadXMLFromString(this.getExecutionParameters());
if(_b6b.childNodes.length==1){
_b6a.loadWithOptions(_b6b.childNodes[0],false);
}
if(!_b6a||!_b6a.m_parameterValues||!_b6a.m_parameterValues.m_aValues){
return null;
}
return _b6a.m_parameterValues.m_aValues;
};
CCognosViewer.prototype._createDummyRequest=function(){
var _b6c=new ViewerDispatcherEntry(this);
return this.preparePromptValues(_b6c);
};
CCognosViewer.prototype._getChangedPromptParametersValues=function(_b6d,_b6e,_b6f){
var _b70=XMLBuilderLoadXMLFromString(_b6e);
if(!_b70){
for(var j=0;j<_b6d.length;j++){
var _b72=_b6d[j].m_useValue;
if(_b6e.indexOf(sXmlEncode(_b72))<0){
_b6f.push(_b72);
}
}
return;
}
var _b73=_b70.getElementsByTagName("selectOption");
if(!_b73){
return;
}
var _b74=_b6d.length;
var _b75=_b73.length;
for(var i=0;i<_b75;i++){
var _b6e=_b73[i].attributes.getNamedItem("useValue").nodeValue;
bMatchOldParam=false;
for(var j=0;j<_b74;j++){
var _b72=_b6d[j].m_useValue;
if(_b6e.indexOf(_b72)===0){
bMatchOldParam=true;
break;
}
}
if(!bMatchOldParam){
_b6f.push(_b6e);
}
}
};
CCognosViewer.prototype._getListOfChangedPromptParameters=function(_b77){
var _b78=this.getOldParameters();
if(!_b78){
return null;
}
var _b79=[];
if(!_b77){
var _b7a=this._createDummyRequest();
for(var _b7b in _b78){
var _b7c=_b78[_b7b].m_parmValueItems;
var _b7d=_b7a.getRequest().getFormFields().get("p_"+_b7b);
if(!_b7d){
continue;
}
this._getChangedPromptParametersValues(_b7c,_b7d,_b79);
}
}else{
if(!_b77.parameters){
return null;
}
var _b7e=_b77.parameters;
for(var i=0;i<_b7e.length;i++){
var _b80=_b7e[i].parmName;
if(!_b80||!_b78[_b80]){
continue;
}
var _b7c=_b78[_b80].m_parmValueItems;
if(!_b7c||_b7c.length==0){
continue;
}
this._getChangedPromptParametersValues(_b7c,_b7e[i].parmValue,_b79);
}
}
return _b79;
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
var _b82=this.getDrillResetHUNs(null);
if(_b82&&_b82.length!==0){
var _b83={"drilledResetHUNs":_b82};
this.executeAction("DrillReset",_b83);
return;
}
}
oReq=this.preparePromptValues(oReq);
if(window.portletSharePrompt){
var _b84=this.portletPromptParams(oReq);
if(_b84.length>0){
portletSharePrompt(_b84);
}
}
this.dispatchRequest(oReq);
};
CCognosViewer.prototype.portletPromptParams=function(oReq){
var _b86=[];
var _b87=null;
var _b88=true;
var _b89=oReq.getFormFields().keys();
for(var _b8a=0;_b8a<_b89.length;_b8a++){
_b87=_b89[_b8a];
if(_b87=="_promptControl"&&oReq.getFormField(_b87)=="search"){
_b88=false;
break;
}else{
if(_b87.indexOf("p_")===0){
if(_b87.indexOf("p_credential")===0){
_b88=false;
break;
}else{
_b86.push([_b87,oReq.getFormField(_b87)]);
}
}
}
}
if(_b86&&!_b88){
_b86=[];
}
return _b86;
};
CCognosViewer.prototype.preparePromptValues=function(oReq){
var _b8c=[];
if(this.preProcessControlArray){
var _b8d=this.preProcessControlArray.length;
var k=0;
for(k=0;k<_b8d;k++){
var _b8f=eval(this.preProcessControlArray[k]);
var _b90=(typeof _b8f.isEnabled=="function"?_b8f.isEnabled():true);
if(_b8f&&typeof _b8f.preProcess=="function"&&_b90){
_b8f.preProcess();
if(_b8f.m_oSubmit){
if(oReq.addParameter){
oReq.addParameter(_b8f.m_oSubmit.name,_b8f.m_oSubmit.value);
}else{
oReq.addFormField(_b8f.m_oSubmit.name,_b8f.m_oSubmit.value);
}
_b8c.push(_b8f.m_oSubmit);
if(_b8f.m_sPromptId&&_b8f.m_oForm&&_b8f.m_oForm.elements&&typeof _b8f.m_oForm.elements["p_"+_b8f.m_sRef]=="object"){
if(oReq.addParameter){
oReq.addParameter("p_"+_b8f.m_sPromptId,_b8f.m_oForm.elements["p_"+_b8f.m_sRef].value);
}else{
oReq.addFormField("p_"+_b8f.m_sPromptId,_b8f.m_oForm.elements["p_"+_b8f.m_sRef].value);
}
}
}
}
}
}
var _b91=document.getElementById("formWarpRequest"+this.getId());
if(_b91){
var _b92=_b91.elements;
for(var _b93=0;_b93<_b92.length;_b93++){
var _b94=_b92[_b93];
if(!_b94.name||!_b94.name.match(/^p_/)){
continue;
}
var _b95=true;
for(var _b96=0;_b96<_b8c.length;_b96++){
if(_b8c[_b96]==_b94){
_b95=false;
break;
}
}
if(_b95){
oReq.addFormField(_b94.name,_b94.value);
_b8c.push(_b94);
}
}
}
var oRM=this["CognosReport"];
if(oRM){
var _b98=oRM.prompt.getParameters();
for(var i=0;i<_b98.length;i++){
var _b9a="p_"+_b98[i].getName();
if(!oReq.getFormField(_b9a)){
oReq.addFormField(_b9a,_b98[i].getXML());
}
}
}
return oReq;
};
CCognosViewer.prototype.setViewerWidget=function(_b9b){
this.m_viewerWidget=_b9b;
};
CCognosViewer.prototype.getViewerWidget=function(){
return this.m_viewerWidget;
};
CCognosViewer.prototype.getFlashChartOption=function(){
var _b9c=this.getViewerWidget();
var _b9d=null;
if(_b9c){
var _b9e=_b9c.getProperties();
if(_b9e){
_b9d=_b9e.getFlashCharts();
}
}
return _b9d;
};
CCognosViewer.prototype.fireWidgetEvent=function(evt,_ba0){
var _ba1=this.getViewerWidget();
if(_ba1!=null){
_ba1.fireEvent(evt,null,_ba0);
}
};
CCognosViewer.prototype.isMobile=function(){
return false;
};
CCognosViewer.prototype.setVisibleDialog=function(_ba2){
this.m_visibleDialog=_ba2;
};
CCognosViewer.prototype.getVisibleDialog=function(){
if(typeof this.m_visibleDialog!="undefined"){
return this.m_visibleDialog;
}
return null;
};
CCognosViewer.prototype.getContentLocale=function(){
var _ba3=document.getElementById("formWarpRequest"+this.getId());
if(_ba3&&_ba3["ui.contentLocale"]&&_ba3["reRunObj"]&&_ba3["reRunObj"].value.length>0){
return _ba3["ui.contentLocale"].value;
}
return null;
};
CCognosViewer.prototype.updateLayout=function(_ba4){
var cvid=this.getId();
var _ba6=document.getElementById("CVHeader"+cvid);
var _ba7=document.getElementById("CVToolbar"+cvid);
if(!_ba6&&!_ba7){
setTimeout(getCognosViewerObjectRefAsString(cvid)+".updateLayout(\""+_ba4+"\");",100);
return;
}
if(_ba6){
var _ba8=this.getUIConfig()&&!this.getUIConfig().getShowBanner();
if((_ba4=="prompting"&&!this.bShowHeaderWithPrompts)||_ba8){
_ba6.parentNode.style.display="none";
}else{
_ba6.parentNode.style.display="";
}
}
if(_ba7){
if(_ba4=="prompting"||this.m_bHideToolbar==true){
_ba7.parentNode.style.display="none";
}else{
_ba7.parentNode.style.display="";
}
}
};
CCognosViewer.prototype.updateResponseSpecification=function(_ba9){
this.sResponseSpecification=_ba9;
};
CCognosViewer.prototype.getResponseSpecification=function(){
return this.sResponseSpecification;
};
CCognosViewer.prototype.release=function(_baa){
if(this.getStatus()!="fault"){
this._release(_baa);
}
};
CCognosViewer.prototype._release=function(_bab){
var form=document.getElementById("formWarpRequest"+this.getId());
var _bad=this.getTracking();
if(!_bad&&form&&form["m_tracking"]&&form["m_tracking"].value){
_bad=form["m_tracking"].value;
form["m_tracking"].value="";
}
this.setTracking("");
if(_bad){
var _bae=new DispatcherEntry(this);
if(this.isWorkingOrPrompting()){
_bae.addFormField("ui.action","cancel");
}else{
_bae.addFormField("ui.action","release");
}
_bae.addFormField("cv.responseFormat","successfulRequest");
_bae.addNonEmptyStringFormField("ui.primaryAction",this.envParams["ui.primaryAction"]);
_bae.addNonEmptyStringFormField("ui.objectClass",this.envParams["ui.objectClass"]);
_bae.addFormField("m_tracking",_bad);
if(_bab!=true){
_bae.forceSynchronous();
}
var _baf=this.getActiveRequest()?this.getActiveRequest():this.getFaultDispatcherEntry();
if(_baf&&_baf.getFormField("cv.outputKey")){
_bae.addFormField("b_action","cvx.high");
_bae.addFormField("cv.outputKey",_baf.getFormField("cv.outputKey"));
_bae.addFormField("cv.waitForResponse","false");
_bae.setHeaders(_baf.getHeaders());
}
_bae.sendRequest();
return true;
}
return false;
};
CCognosViewer.prototype.cleanupStyles=function(){
if(this.getViewerWidget()){
this.getViewerWidget().cleanupStyles();
}
};
CCognosViewer.prototype.destroy=function(_bb0){
this.release(_bb0);
if(!this.m_destroyed){
if(typeof window.gaRV_INSTANCES!="undefined"){
for(var _bb1=0;_bb1<window.gaRV_INSTANCES.length;_bb1++){
if(window.gaRV_INSTANCES[_bb1].m_sId==this.getId()){
window.gaRV_INSTANCES.splice(_bb1,1);
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
var _bb5=e.parentNode;
if(_bb5){
_bb5.removeChild(e);
}
}
delete this.m_layoutElements;
delete this.m_lidToElement;
}
if(this.m_oDrillMgr){
this.m_oDrillMgr.setCV(null);
}
var _bb6=this.getSelectionController();
if(_bb6){
GUtil.destroyProperties(_bb6);
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
CCognosViewer.prototype.executeAction=function(_bb8,_bb9){
var _bba=this.getAction(_bb8);
_bba.setRequestParms(_bb9);
return _bba.execute();
};
CCognosViewer.prototype.getCalculation=function(_bbb){
var calc=null;
var _bbd=this.getCalculationCache();
if(_bbd[_bbb]){
calc=_bbd[_bbb];
}else{
calc=eval("new "+_bbb+"();");
calc.setCognosViewer(this);
_bbd[_bbb]=calc;
}
return calc;
};
CCognosViewer.prototype.findBlueDotMenu=function(_bbe){
var root=null;
var _bc0=(_bbe)?_bbe:this.getToolbar();
for(var idx=0;idx<_bc0.length;++idx){
if(typeof _bc0[idx]._root!="undefined"){
root=_bc0[idx]._root;
break;
}
}
return root;
};
CCognosViewer.prototype.findToolbarItem=function(_bc2,_bc3){
var spec=typeof _bc3=="undefined"||_bc3==null?this.getToolbar():_bc3;
var _bc5=null;
for(var _bc6=0;_bc6<spec.length;++_bc6){
var name=spec[_bc6]["name"];
if(typeof name!="undefined"&&name==_bc2){
_bc5=spec[_bc6];
break;
}
}
return _bc5;
};
CCognosViewer.prototype.findToolbarItemIndex=function(_bc8,_bc9){
var spec=typeof _bc9=="undefined"||_bc9==null?this.getToolbar():_bc9;
var _bcb=null;
for(var _bcc=0;_bcc<spec.length;++_bcc){
var name=spec[_bcc]["name"];
if(typeof name!="undefined"&&name==_bc8){
_bcb=_bcc;
break;
}
}
return _bcb;
};
CCognosViewer.prototype.addedButtonToToolbar=function(_bce,_bcf,_bd0,_bd1){
if(typeof _bcf!="undefined"&&_bcf!=null){
if(this.findToolbarItem(_bcf.name,_bce)==null){
_bd0=this.findToolbarItemIndex(_bd0,_bce);
if(typeof _bd0!="undefined"&&_bd0!=null){
_bce.splice(++_bd0,0,_bcf);
return true;
}else{
if(typeof _bd1!="undefined"&&_bd1!=null){
_bce.splice(_bd1,0,_bcf);
return true;
}
}
}
}
return false;
};
CCognosViewer.prototype.addDrillTargets=function(_bd2){
this.m_drillTargets=_bd2;
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
var _bd5=this.getRAPReportInfo();
if(_bd5){
var _bd6=_bd5.getDisplayTypes();
return _bd6.match("_v2")!=null||_bd6.match("v2_")!=null;
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
CCognosViewer.prototype.setRAPReportInfo=function(_bd7){
this.m_RAPReportInfo=_bd7;
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
var _bda=oDiv.style.display;
oDiv.style.display="none";
oDiv.style.display=_bda;
};
CCognosViewer.prototype.isMetadataEmpty=function(){
var oSC=this.getSelectionController();
if(oSC){
var _bdc=oSC.getCCDManager();
if(_bdc){
return _bdc.isMetadataEmpty();
}
}
return true;
};
CCognosViewer.prototype.setContextMenu=function(_bdd){
this.m_contextMenu=_bdd;
};
CCognosViewer.prototype.getContextMenu=function(){
return this.m_contextMenu;
};
CCognosViewer.prototype.setToolbar=function(_bde){
this.m_toolbar=_bde;
};
CCognosViewer.prototype.getToolbar=function(){
return this.m_toolbar;
};
CCognosViewer.prototype.getAdvancedServerProperty=function(_bdf){
if(this.m_advancedProperties&&this.m_advancedProperties[_bdf]!==undefined&&this.m_advancedProperties[_bdf]!==null){
return this.m_advancedProperties[_bdf];
}else{
return null;
}
};
CCognosViewer.prototype.hasPrompt=function(){
if(typeof this.m_bHasPrompt==="undefined"||this.m_bHasPrompt===null){
var _be0=false;
if(this.getAdvancedServerProperty("VIEWER_JS_PROMPT_AGAIN_SHOW_ALWAYS")==="true"||(this.envParams.reportPrompts&&this.envParams.reportPrompts.length>0)){
_be0=true;
}else{
var _be1=new CParameterValues();
var _be2=XMLBuilderLoadXMLFromString(this.getExecutionParameters());
if(_be2.childNodes.length==1){
_be1.loadWithOptions(_be2.childNodes[0],true);
var _be3=_be1.length();
for(var _be4=0;_be4<_be3;++_be4){
var _be5=_be1.getAt(_be4);
if(_be5!==null&&_be5.length()>0&&_be5.name().indexOf("credential:")!=-1){
_be0=true;
break;
}
}
}
}
this.m_bHasPrompt=_be0;
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
CCognosViewer.prototype.broadcastContextChange=function(evt,_be7){
if(this.getViewerWidget()){
this.getViewerWidget().broadcastContextChange(_be7);
}
stopEventBubble(evt);
};
CCognosViewer.prototype.broadcastParameterChange=function(evt,_be9){
if(this.getViewerWidget()){
this.getViewerWidget().broadcastParameterChange(_be9);
}
stopEventBubble(evt);
};
CCognosViewer.prototype.getReportDiv=function(){
if(!this.m_nReportDiv){
this.m_nReportDiv=document.getElementById("CVReport"+this.m_sId);
}
return this.m_nReportDiv;
};
function CDocumentWriter(sId,_beb){
this.m_sId=sId;
this.m_sText="";
this.m_sScript=_beb;
};
CDocumentWriter.prototype.isValid=function(){
if(typeof this.m_sScript!="undefined"&&this.m_sScript&&window.gScriptLoader){
return true;
}
return false;
};
CDocumentWriter.prototype.execute=function(){
if(this.isValid()&&window.gScriptLoader){
var _bec=/document\.write(ln)?\s*\(/gi;
var _bed=this.m_sScript.replace(_bec,"this.write(").replace(window.gScriptLoader.m_reScriptTagOpen,"").replace(window.gScriptLoader.m_reScriptTagClose,"");
try{
eval(_bed);
var _bee=document.getElementById(this.m_sId);
if(_bee){
_bee.innerHTML=this.m_sText;
return true;
}
}
catch(e){
}
}
return false;
};
CDocumentWriter.prototype.write=function(_bef){
var _bf0="";
if(typeof _bef=="function"){
_bf0=eval(_bef);
}else{
if(typeof _bef=="string"){
_bf0=_bef;
}
}
this.m_sText+=_bf0;
};
function setFocusToFirstTabItem(_bf1){
if(!window.dojo){
return;
}
var _bf2=dojo.query("*",_bf1);
var _bf3=_bf2.length;
for(var i=0;i<_bf3;i++){
var node=_bf2[i];
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
function ReportContextHelper(_bf6){
this.m_oCDManager=_bf6;
};
ReportContextHelper.prototype.destroy=function(){
if(this.m_oCDManager&&this.m_oCDManager.destroy){
this.m_oCDManager.destroy();
}
delete this.m_oCDManager;
};
ReportContextHelper.prototype.processCtx=function(sCtx){
var _bf8=sCtx.split("::");
var _bf9=[];
for(var i=0;i<_bf8.length;++i){
_bf9[i]=_bf8[i].split(":");
}
if(_bf9&&_bf9.length&&_bf9[0].length){
return _bf9;
}else{
return null;
}
};
ReportContextHelper.prototype.getDataItemName=function(sCtx){
var _bfc=this.processCtx(sCtx);
if(_bfc){
return this.getRefDataItem(_bfc[0][0]);
}
return null;
};
ReportContextHelper.prototype.getRefDataItem=function(_bfd){
var _bfe=this.m_oCDManager.GetRDIValue(_bfd);
return (_bfe==null)?"":_bfe;
};
ReportContextHelper.prototype.getMun=function(_bff){
var aCtx=null;
if(typeof _bff==="string"){
aCtx=this.processCtx(_bff);
}else{
if(typeof _bff==="number"){
aCtx=this.processCtx(_bff.toString());
}else{
aCtx=_bff;
}
}
if(aCtx){
var sMun=this.m_oCDManager.GetMUN(aCtx[0][0]);
return (sMun==null)?"":sMun;
}
return "";
};
function ViewerConfig(){
this.uiConfig=new ViewerUIConfig();
this.findConfig=typeof ViewerFindActionConfig=="function"?new ViewerFindActionConfig():null;
this.httpRequestConfig=typeof ViewerHttpRequestConfig=="function"?new ViewerHttpRequestConfig():null;
this.eventsConfig=typeof ViewerEventsConfig=="function"?new ViewerEventsConfig():null;
};
ViewerConfig.prototype.configure=function(_c02){
if(!_c02){
return;
}
if(_c02.findAction&&this.findConfig){
this.findConfig.configure(_c02.findAction);
}
if(_c02.UI){
this.uiConfig.configure(_c02.UI);
}
if(_c02.httpRequestCallbacks&&this.httpRequestConfig){
this.httpRequestConfig.configure(_c02.httpRequestCallbacks);
}
if(_c02.events&&this.eventsConfig){
this.eventsConfig.configure(_c02.events);
}
};
ViewerConfig.prototype.getUIConfig=function(){
return this.uiConfig;
};
ViewerConfig.prototype.getFindActionConfig=function(){
return this.findConfig;
};
ViewerConfig.prototype.getHttpRequestConfig=function(){
return this.httpRequestConfig;
};
ViewerConfig.prototype.getEventsConfig=function(){
return this.eventsConfig;
};
function ViewerUIConfig(){
this.showBanner=true;
this.showToolbar=true;
this.showContextMenu=true;
this.showPageNavigation=true;
this.primarySelectionColor=null;
this.secondarySelectionColor=null;
this.showSecondarySelection=true;
};
ViewerUIConfig.prototype.configure=function(_c03){
applyJSONProperties(this,_c03);
};
ViewerUIConfig.prototype.getShowBanner=function(){
return this.showBanner;
};
ViewerUIConfig.prototype.getShowToolbar=function(){
return this.showToolbar;
};
ViewerUIConfig.prototype.getShowContextMenu=function(){
return this.showContextMenu;
};
ViewerUIConfig.prototype.getShowPageNavigation=function(){
return this.showPageNavigation;
};
ViewerUIConfig.prototype.getPrimarySelectionColor=function(){
return this.primarySelectionColor;
};
ViewerUIConfig.prototype.getSeondarySelectionColor=function(){
return this.secondarySelectionColor;
};
ViewerUIConfig.prototype.getShowSecondarySelection=function(){
return this.showSecondarySelection;
};
function ViewerHttpRequestConfig(){
this.reportStatus={};
this.UI={};
};
ViewerHttpRequestConfig.prototype.configure=function(_c04){
applyJSONProperties(this,_c04);
};
ViewerHttpRequestConfig.prototype.getRequestIndicator=function(){
if(this.UI){
return this.UI.requestIndicator?this.UI.requestIndicator:null;
}
};
ViewerHttpRequestConfig.prototype.getWorkingDialog=function(){
if(this.UI){
return this.UI.workingDialog?this.UI.workingDialog:null;
}
};
ViewerHttpRequestConfig.prototype.getReportStatusCallback=function(_c05){
if(this.reportStatus){
var _c06=this.reportStatus[_c05];
if(_c06){
return _c06;
}
if(_c05=="complete"&&this.reportStatus["initialComplete"]){
var _c07=this.reportStatus["initialComplete"];
this.reportStatus["initialComplete"]=null;
return _c07;
}
}
return null;
};
function ViewerEventsConfig(){
this.showContextMenuOnClick=false;
};
ViewerEventsConfig.prototype.configure=function(_c08){
applyJSONProperties(this,_c08);
};
ViewerEventsConfig.prototype.getShowContextMenuOnClick=function(){
return this.showContextMenuOnClick;
};
function ViewerState(){
this.findState=null;
this.pageState=null;
};
ViewerState.prototype.setFindState=function(_c09){
if(typeof ViewerFindState!="function"){
return;
}
if(!this.findState){
this.findState=new ViewerFindState();
}
this.findState.setState(_c09);
};
ViewerState.prototype.clearFindState=function(){
this.findState=null;
};
ViewerState.prototype.getFindState=function(){
return this.findState;
};
ViewerState.prototype.setPageState=function(_c0a){
if(typeof ViewerPageState!="function"){
return;
}
if(!this.pageState){
this.pageState=new ViewerPageState();
}
this.pageState.setState(_c0a);
};
ViewerState.prototype.clearPageState=function(){
this.pageState=null;
};
ViewerState.prototype.getPageState=function(){
return this.pageState;
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
var _c12={};
applyJSONProperties(_c12,this.m_md);
return _c12;
};
CCDManager.prototype.getClonedContextdataArray=function(){
var _c13={};
applyJSONProperties(_c13,this.m_cd);
return _c13;
};
CCDManager.prototype.SetCognosViewer=function(_c14){
if(_c14){
this.m_oCV=_c14;
}
};
CCDManager.prototype.onComplete_GetCDRequest=function(_c15,_c16){
if(_c15){
var _c17=_c15.getResult();
var _c18=XMLBuilderLoadXMLFromString(_c17);
if(_c18){
var _c19=_c18.getElementsByTagName("Block");
for(var i=0;i<_c19.length;i++){
var _c1b="";
var _c1c=_c19[i].firstChild;
while(_c1c){
_c1b+=_c1c.nodeValue;
_c1c=_c1c.nextSibling;
}
var cd=eval("("+_c1b+")");
this.AddContextData(cd);
}
}
}
if(_c16&&typeof _c16=="function"){
_c16();
}
};
CCDManager.prototype.FetchContextData=function(_c1e,_c1f){
var _c20=[];
var c=null,_c22=_c1e.length;
for(var i=0;i<_c22;++i){
c=_c1e[i];
if(c!=""&&!this.ContextIdExists(c)){
_c20.push(c);
}
}
if(_c20.length){
if(this.m_oCV){
this.getContextData(_c20,_c1f);
}
}
return _c20.length;
};
CCDManager.prototype.getContextData=function(_c24,_c25){
var oCV=this.m_oCV;
var _c27=new AsynchDataDispatcherEntry(oCV);
_c27.setCanBeQueued(false);
if(!oCV.isBux){
_c27.forceSynchronous();
}
var form=document["formWarpRequest"+oCV.getId()];
var _c29=oCV.getConversation();
var _c2a=oCV.getTracking();
if(!_c2a&&form&&form["m_tracking"]&&form["m_tracking"].value){
_c2a=form["m_tracking"].value;
}
if(oCV.m_viewerFragment){
var _c2b=oCV.getActiveRequest();
if(_c2b&&_c2b.getFormField("m_tracking")==_c2a){
return;
}
}
var _c2c={customArguments:[_c25],"complete":{"object":this,"method":this.onComplete_GetCDRequest}};
if(oCV.getStatus()=="prompting"){
_c2c["prompting"]={"object":this,"method":this.onComplete_GetCDRequest};
}
_c27.setCallbacks(_c2c);
if(_c29&&oCV.envParams["ui.action"]!="view"){
_c27.addFormField("ui.action","getContext");
_c27.addFormField("ui.conversation",_c29);
}else{
var _c2d=form["ui.object"];
if(typeof _c2d.length!="undefined"&&_c2d.length>1){
_c27.addFormField("ui.object",form["ui.object"][0].value);
}else{
_c27.addFormField("ui.object",form["ui.object"].value);
}
_c27.addFormField("ui.action","getObjectContext");
}
_c27.addFormField("cv.responseFormat","asynchDetailContext");
_c27.addFormField("context.format","initializer");
_c27.addFormField("context.type","reportService");
_c27.addFormField("context.selection",_c24.join(","));
_c27.addNonEmptyStringFormField("m_tracking",_c2a);
oCV.dispatchRequest(_c27);
};
CCDManager.prototype.ContextIdExists=function(_c2e){
return (this.m_cd&&this.m_cd[_c2e]?true:false);
};
CCDManager.prototype.HasContextData=function(){
return (this.m_cd?true:false);
};
CCDManager.prototype.HasMetadata=function(){
return (this.m_md?true:false);
};
CCDManager.prototype._getMDPropertyFromCD=function(_c2f,_c30,_c31){
var p=null;
this.FetchContextData([_c2f]);
var cd=this.m_cd&&this.m_cd[_c2f];
if(cd){
var md=this.m_md[cd[_c30]];
if(md){
p=md[_c31];
}
}
return p;
};
CCDManager.prototype.GetDrillFlag=function(_c35){
return this._getMDPropertyFromCD(_c35,"r","drill");
};
CCDManager.prototype.getModelPathFromBookletItem=function(_c36){
var mp=null;
var md=this.m_md[_c36];
if(md){
mp=md.mp;
if(mp&&this.m_md[mp]){
mp=this.m_md[mp].mp;
}
}
return mp?mp:null;
};
CCDManager.prototype.GetBookletModelBasedDrillThru=function(_c39){
var p=null;
var md=this.m_md[_c39];
if(md){
p=md.modelBasedDrillThru;
}
return p?p:0;
};
CCDManager.prototype.GetDrillFlagForMember=function(_c3c){
var _c3d=null;
var d=this._getMDPropertyFromCD(_c3c,"r","drill");
if(d!==null&&this.m_cd[_c3c].m){
_c3d=d;
}
return _c3d;
};
CCDManager.prototype.GetDataType=function(_c3f){
return this._getMDPropertyFromCD(_c3f,"r","dtype");
};
CCDManager.prototype.GetUsage=function(_c40){
return this._getMDPropertyFromCD(_c40,"r","usage");
};
CCDManager.prototype.GetHUN=function(_c41){
var hun=this._getMDPropertyFromCD(_c41,"h","h");
if(!hun){
var h=this._getMDPropertyFromCD(_c41,"r","h");
if(h){
hun=this.m_md[h].h;
}
}
if(hun!=null&&hun.indexOf("[__ns_")==0){
hun=null;
}
return hun;
};
CCDManager.prototype.GetQuery=function(_c44){
var qry=null;
var q=this._getMDPropertyFromCD(_c44,"r","q");
if(q){
qry=this.m_md[q].q;
}
return qry;
};
CCDManager.prototype.GetDepth=function(_c47){
return this._getMDPropertyFromCD(_c47,"r","level");
};
CCDManager.prototype.GetDisplayValue=function(_c48){
var _c49=null;
this.FetchContextData([_c48]);
if(this.ContextIdExists(_c48)&&this.m_cd[_c48]){
_c49=this.m_cd[_c48].u;
}
return _c49;
};
CCDManager.prototype.GetPUN=function(_c4a){
return this._getMDPropertyFromCD(_c4a,"p","p");
};
CCDManager.prototype.GetLUN=function(_c4b){
return this._getMDPropertyFromCD(_c4b,"l","l");
};
CCDManager.prototype.GetMUN=function(_c4c){
return this._getMDPropertyFromCD(_c4c,"m","m");
};
CCDManager.prototype.GetDUN=function(_c4d){
return this._getMDPropertyFromCD(_c4d,"d","d");
};
CCDManager.prototype.GetQMID=function(_c4e){
return this._getMDPropertyFromCD(_c4e,"i","i");
};
CCDManager.prototype.GetRDIValue=function(_c4f){
return this._getMDPropertyFromCD(_c4f,"r","r");
};
CCDManager.prototype.GetBIValue=function(_c50){
return this._getMDPropertyFromCD(_c50,"r","bi");
};
CCDManager.prototype.getContextIdForMetaData=function(lun,hun,_c53){
var _c54=[{"expression":lun,"type":"l"},{"expression":hun,"type":"h"}];
for(var _c55=0;_c55<_c54.length;++_c55){
var _c56=_c54[_c55].expression;
var _c57=_c54[_c55].type;
if(_c56==""){
continue;
}
for(var _c58 in this.m_md){
if(this.m_md[_c58][_c57]==_c56){
for(var _c59 in this.m_md){
if(this.m_md[_c59].r&&this.m_md[_c59][_c57]==_c58){
if(this.m_md[_c59].drill!=0||_c53==true){
for(var ctx in this.m_cd){
if(this.m_cd[ctx].r==_c59&&this.m_cd[ctx].m){
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
var _c5c=null;
var _c5d=null;
for(var i in this.m_md){
if(this.m_md[i].m==mun){
_c5c=i;
break;
}
}
if(_c5c!=null){
for(var j in this.m_cd){
if(this.m_cd[j].m==_c5c){
_c5d=j;
break;
}
}
}
return _c5d;
};
CCDManager.prototype.GetContextIdsForRDI=function(rdi){
var _c61=[];
for(var i in this.m_md){
if(this.m_md[i].r==rdi){
_c61.push(i);
}
}
return _c61;
};
CCDManager.prototype.getMUNForRDIAndUseValue=function(rdi,_c64){
var _c65=this.GetContextIdsForRDI(rdi);
for(var i in this.m_cd){
for(var j in _c65){
if(this.m_cd[i].r==_c65[j]&&this.m_cd[i].u==_c64){
var _c68=this.m_cd[i].m;
if(_c68){
return this.m_md[_c68].m;
}
}
}
}
return null;
};
CCDManager.prototype.GetPageMinMaxForRDI=function(rdi){
var _c6a=null;
var _c6b=null;
var _c6c=this.GetContextIdsForRDI(rdi);
this.FetchContextData([0]);
for(var i in this.m_cd){
for(var j in _c6c){
if(this.m_cd[i].r==_c6c[j]){
var _c6f=parseFloat(this.m_cd[i].u);
if(_c6f==this.m_cd[i].u){
if(_c6a==null||_c6f<_c6a){
_c6a=_c6f;
}
if(_c6b==null||_c6f>_c6b){
_c6b=_c6f;
}
}
}
}
}
if(_c6a!=null&&_c6b!=null){
return eval("({ pageMin: "+_c6a+", pageMax: "+_c6b+"})");
}
};
CCDManager.prototype.GetContextIdForDisplayValue=function(_c70){
var _c71=null;
for(var i in this.m_cd){
if(this.m_cd[i].u==_c70){
_c71=i;
break;
}
}
return _c71;
};
CCDManager.prototype.GetContextIdForUseValue=function(_c73){
var _c74=null;
var _c75=null;
var _c76=null;
for(var i in this.m_md){
var md=this.m_md[i];
for(var j in md){
if(md[j]==_c73){
_c74=i;
_c75=j;
break;
}
}
}
if(_c74!=null){
for(var k in this.m_cd){
if(this.m_cd[k][_c75]==_c74){
_c76=k;
break;
}
}
}
return _c76;
};
CCDManager.prototype.getDataItemInfo=function(){
if(this.m_cd){
var _c7b={};
this.m_dataItemInfo={};
for(var i in this.m_cd){
var _c7d=this.m_cd[i].r;
if(typeof _c7d!="undefined"){
var _c7e=this.m_md[_c7d].r;
if(this.m_dataItemInfo[_c7e]==null){
this.m_dataItemInfo[_c7e]=1;
}else{
this.m_dataItemInfo[_c7e]++;
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
CCDManager.prototype.ContextDataSubsetToJSON=function(_c7f){
if(_c7f<=0){
return this.ContextDataToJSON();
}
if(this.m_cd){
var _c80={};
var _c81={};
for(var i in this.m_cd){
var _c83=this.m_cd[i].r;
if(typeof _c83!="undefined"){
if(_c80[_c83]==null){
_c80[_c83]=0;
}else{
_c80[_c83]++;
}
if(_c80[_c83]<_c7f){
_c81[i]=this.m_cd[i];
}
}
}
return CViewerCommon.toJSON(_c81);
}
return "";
};
CCDManager.prototype.GetHUNForRDI=function(rdi,_c85){
for(var i in this.m_md){
if(this.m_md[i].r==rdi&&this.m_md[i].q==_c85){
var _c87=this.m_md[i].h;
if(_c87){
return this.m_md[_c87].h;
}
}
}
return null;
};
CCDManager.prototype.GetMetadataIdForQueryName=function(_c88){
for(var i in this.m_md){
if(this.m_md[i].q===_c88){
return i;
}
}
return null;
};
CCDManager.prototype._isEmptyObject=function(obj){
for(var _c8b in obj){
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
CCDManager.prototype.GetBestPossibleItemName=function(_c8c){
var item=this.m_cd[_c8c];
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
CCDManager.prototype.GetBestPossibleDimensionMeasureName=function(_c8e){
var item=this.m_cd[_c8e];
if(item&&item.m&&this.m_md[item.m]&&this.m_md[item.m].m){
return this._getStringInLastBracket(this.m_md[item.m].m);
}
return null;
};
CCDManager.prototype._getStringInLastBracket=function(str){
if(str&&str.indexOf("].[")>0){
var _c91=str.split("].[");
var _c92=_c91[_c91.length-1];
return _c92.substring(0,_c92.length-1);
}
return str;
};
CCDManager.prototype._replaceNamespaceForSharedTM1DimensionOnly=function(_c93){
var _c94=this._getNamespaceAndDimensionFromUniqueName(_c93);
if(_c94&&this.m_md){
for(var _c95 in this.m_md){
var sMun=this.m_md[_c95].m;
if(sMun&&sMun.length>0){
if(sMun.indexOf("->:[TM].")>0){
var oObj=this._getNamespaceAndDimensionFromUniqueName(sMun);
if(oObj.dimension&&oObj.dimension===_c94.dimension&&oObj.namespace!==_c94.namespace){
var _c98=_c93.indexOf(".");
return oObj.namespace+_c93.substr(_c98,_c93.length);
}
}else{
var _c99=sMun.indexOf("->:[");
if(_c99>0){
if(sMun.substr(_c99+4,4)!=="TM]."){
return _c93;
}
}
}
}
}
}
return _c93;
};
CCDManager.prototype._getNamespaceAndDimensionFromUniqueName=function(_c9a){
if(_c9a&&_c9a.length>0&&_c9a.indexOf("].[")>0){
var _c9b=_c9a.split("].[");
if(_c9b.length>1){
return {"namespace":_c9b[0]+"]","dimension":"["+_c9b[1]+"]"};
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
function CSelectionXml(_c9c,_c9d,_c9e){
this.queries={};
this.burstContext=_c9c||"";
this.expressionLocale=_c9d||"";
this.contentLocale=_c9e||"";
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
var _ca0=sc.getAllSelectedObjects();
for(var s=0;s<_ca0.length;++s){
var _ca2=_ca0[s];
var _ca3=_ca2.getSelectedContextIds();
var muns=_ca2.getMuns();
var _ca5=muns.length;
var _ca6=new SC_SingleSelection();
_ca6.layoutElementId=_ca2.getLayoutElementId();
var _ca7=null;
for(var i=0;i<_ca5;++i){
var j,_caa,_cab;
if(i===0&&_ca5===1){
for(j=0;j<muns[i].length;++j){
_caa=_ca3[i][j];
if(_caa!=0){
if(j===0){
_ca7=sc.getRefQuery(_caa);
_cab=_ca2.getDisplayValues()[j];
this._buildMeasureSelection(sc,_caa,_ca6.measures,_cab,j,_ca2.getLayoutType());
}else{
if(sc.getUsageInfo(_caa)!=2){
this._buildEdgeSelection(sc,_caa,_ca6.cols,j);
}
}
}
}
}else{
for(j=0;j<muns[i].length;++j){
_caa=_ca3[i][j];
if(_caa!=0){
if(i===0){
_cab=_ca2.getDisplayValues()[j];
_ca7=sc.getRefQuery(_caa);
this._buildMeasureSelection(sc,_caa,_ca6.measures,_cab,j,_ca2.getLayoutType());
}else{
if(i===1){
this._buildEdgeSelection(sc,_caa,_ca6.rows,j);
}else{
if(i===2){
this._buildEdgeSelection(sc,_caa,_ca6.cols,j);
}else{
this._buildSectionSelection(sc,_caa,_ca6.sections,j);
}
}
}
}
}
}
}
this.AddSelection(_ca7,_ca6);
}
}
};
CSelectionXml.prototype.AddSelection=function(_cac,_cad){
if(!this.queries[_cac]){
this.queries[_cac]=new SC_SingleQuery();
}
this.queries[_cac].selections.push(_cad);
};
CSelectionXml.prototype._buildMeasureSelection=function(sc,_caf,_cb0,_cb1,idx,_cb3){
if(_cb3==""||_cb3==null){
_cb3="datavalue";
}
if(_caf){
_cb0.push({name:sc.getRefDataItem(_caf),values:[{use:sc.getUseValue(_caf),display:_cb1}],order:idx,hun:sc.getHun(_caf),dataType:_cb3,usage:sc.getUsageInfo(_caf),dtype:sc.getDataType(_caf),selection:"true"});
}
};
CSelectionXml.prototype._buildEdgeSelection=function(sc,_cb5,_cb6,idx){
if(_cb5){
_cb6.push({name:sc.getRefDataItem(_cb5),values:[{use:this.getUseValue(sc,_cb5),display:sc.getDisplayValue(_cb5)}],order:idx,lun:sc.getLun(_cb5),hun:sc.getHun(_cb5),dataType:"columnTitle",usage:sc.getUsageInfo(_cb5),dtype:sc.getDataType(_cb5)});
}
};
CSelectionXml.prototype._buildSectionSelection=function(sc,_cb9,_cba,idx){
if(_cb9){
_cba.push({name:sc.getRefDataItem(_cb9),values:[{use:this.getUseValue(sc,_cb9),display:sc.getDisplayValue(_cb9)}],order:idx,lun:sc.getLun(_cb9),hun:sc.getHun(_cb9),dataType:"section",usage:sc.getUsageInfo(_cb9),dtype:sc.getDataType(_cb9),queryRef:sc.getRefQuery(_cb9)});
}
};
CSelectionXml.prototype.getUseValue=function(sc,_cbd){
var _cbe=sc.getMun(_cbd);
if(_cbe==""){
_cbe=sc.getUseValue(_cbd);
}
return _cbe;
};
CSelectionXml.prototype.toXml=function(){
var _cbf=XMLBuilderCreateXMLDocument("selections");
var _cc0=_cbf.documentElement;
XMLBuilderSetAttributeNodeNS(_cc0,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
XMLBuilderSetAttributeNodeNS(_cc0,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
XMLBuilderSetAttributeNodeNS(_cc0,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
XMLBuilderSetAttributeNodeNS(_cc0,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
XMLBuilderSetAttributeNodeNS(_cc0,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_cc0.setAttribute("contentLocale",this.contentLocale);
_cc0.setAttribute("expressionLocale",this.expressionLocale);
for(var q in this.queries){
this._queryToXml(_cc0,q,this.queries[q]);
}
this._burstToXml(_cc0);
return XMLBuilderSerializeNode(_cbf);
};
CSelectionXml.prototype._queryToXml=function(_cc2,name,obj){
var _cc5=_cc2.ownerDocument.createElement("query");
_cc5.setAttribute("name",name);
for(var _cc6=0;_cc6<obj.selections.length;++_cc6){
this._selectionToXml(_cc5,obj.selections[_cc6]);
}
for(var _cc7=0;_cc7<obj.slicers.length;++_cc7){
this._slicersToXml(_cc5,obj.slicers[_cc7]);
}
for(var _cc8=0;_cc8<obj.selections.length;++_cc8){
this._filtersToXml(_cc5,obj.selections[_cc8]);
}
_cc2.appendChild(_cc5);
};
CSelectionXml.prototype._selectionToXml=function(_cc9,_cca){
var doc=_cc9.ownerDocument;
var _ccc=doc.createElement("selection");
_cc9.appendChild(_ccc);
this._edgeToXml(_ccc,"row",_cca.rows);
this._edgeToXml(_ccc,"column",_cca.cols);
this._edgeToXml(_ccc,"measure",_cca.measures);
this._edgeToXml(_ccc,"section",_cca.sections);
var _ccd=doc.createElement("layoutElementId");
_ccd.appendChild(doc.createTextNode(_cca.layoutElementId));
_ccc.appendChild(_ccd);
};
CSelectionXml.prototype._edgeToXml=function(_cce,_ccf,_cd0){
var doc=_cce.ownerDocument;
var _cd2=doc.createElement(_ccf+"s");
_cce.appendChild(_cd2);
for(var i=0;i<_cd0.length;++i){
var _cd4=doc.createElement(_ccf);
_cd2.appendChild(_cd4);
var edge=_cd0[i];
for(var j in edge){
if(j!=="name"&&j!=="values"){
_cd4.setAttribute(j,edge[j]!==null?edge[j]:"");
}
}
this._itemToXml(_cd4,edge.name,edge.values);
}
};
CSelectionXml.prototype._itemToXml=function(_cd7,name,_cd9){
var doc=_cd7.ownerDocument;
var _cdb=doc.createElement("item");
XMLBuilderSetAttributeNodeNS(_cdb,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
var _cdc=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",doc);
XMLBuilderSetAttributeNodeNS(_cdc,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_cdc.appendChild(doc.createTextNode(name));
_cdb.appendChild(_cdc);
var _cdd=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",doc);
XMLBuilderSetAttributeNodeNS(_cdd,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
XMLBuilderSetAttributeNodeNS(_cdd,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
_cdb.appendChild(_cdd);
for(var j=0;j<_cd9.length;j++){
var _cdf=doc.createElement("item");
XMLBuilderSetAttributeNodeNS(_cdf,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
var _ce0=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",doc);
XMLBuilderSetAttributeNodeNS(_ce0,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
if(_cd9[j].use){
_ce0.appendChild(doc.createTextNode(_cd9[j].use));
}else{
if(_cd9[j].display){
_ce0.appendChild(doc.createTextNode(_cd9[j].display));
}else{
_ce0.appendChild(doc.createTextNode(""));
}
}
var _ce1=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",doc);
XMLBuilderSetAttributeNodeNS(_ce1,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
if(_cd9[j].display){
_ce1.appendChild(doc.createTextNode(_cd9[j].display));
}else{
_ce1.appendChild(doc.createTextNode(""));
}
_cdf.appendChild(_ce0);
_cdf.appendChild(_ce1);
_cdd.appendChild(_cdf);
}
_cd7.appendChild(_cdb);
};
CSelectionXml.prototype._burstToXml=function(_ce2){
var doc=_ce2.ownerDocument;
var _ce4=doc.createElement("burst-context");
_ce4.appendChild(doc.createTextNode(this.burstContext));
_ce2.appendChild(_ce4);
};
CSelectionXml.prototype._slicersToXml=function(_ce5,_ce6){
};
CSelectionXml.prototype._filtersToXml=function(_ce7,_ce8){
};
CSubscriptionManager.k_SubscriptionWizardName="subscriptionWizard";
function CSubscriptionManager(cv){
this.m_cv=cv;
this.m_bInitialized=false;
this.m_aWatchRules=null;
this.m_sEmail="";
this.m_sAlertNewVersionConfirm="";
this.m_sQueryNotificationResponse="";
this.m_bAllowNotification=false;
this.m_bAllowSubscription=false;
this.m_bCanCreateNewWatchRule=false;
this.m_bCanGetNotified=false;
this.m_bAllowAnnotations=false;
this.m_bCanCreateAnnotations=false;
this.m_windowOptions="width=450,height=350,toolbar=0,location=0,status=0,menubar=0,resizable,scrollbars=1";
};
CSubscriptionManager.prototype.getViewer=function(){
return this.m_cv;
};
CSubscriptionManager.prototype.Initialize=function(_cea){
try{
var _ceb=_cea.getJSONResponseObject();
var _cec=document.forms["formWarpRequest"+this.m_cv.getId()];
if(_ceb["annotationInfo"]){
var _ced=_ceb["annotationInfo"];
this.m_AnnotationsCount=_ced.annotations.length;
this.m_annotations=_ced.annotations;
this.m_bAllowAnnotations=_ced.allowAnnotations;
this.m_bCanCreateAnnotations=_ced.traverse=="true";
return true;
}
if(_ceb["subscriptionInfo"]){
var _cee=_ceb["subscriptionInfo"];
if(!this.m_bInitialized){
this.m_sEmail=_cee.sEmail;
this.m_bAllowNotification=_cee.bAllowNotification;
this.m_bAllowSubscription=_cee.bAllowSubscription;
this.m_sAlertNewVersionConfirm=_cee.sAlertNewVersionConfirm;
if(_cec["ui.action"]&&_cec["ui.action"].value=="view"){
if(_cec["ui.format"]){
this.m_bCanCreateNewWatchRule=(_cec["ui.format"].value=="HTML")&&this.m_cv.bCanUseCognosViewerConditionalSubscriptions&&this.m_bAllowSubscription;
}
this.m_bCanGetNotified=(!_cec["ui.burstKey"]||(_cec["ui.burstKey"]&&_cec["ui.burstKey"].value==""))&&this.m_bAllowNotification;
}
}
if(_cee.sQueryNotificationResponse){
this.m_sQueryNotificationResponse=_cee.sQueryNotificationResponse;
}
if(_cee.aWatchRules){
var _cef=_cee.aWatchRules;
this.m_aWatchRules=[];
for(var i=0;i<_cef.length;i++){
this.m_aWatchRules.push(_cef[i]);
}
}
this.m_bInitialized=true;
return true;
}
}
catch(exception){
return false;
}
return false;
};
CSubscriptionManager.prototype.IsValidSelectionForNewRule=function(){
var _cf1=this.m_cv.getSelectionController();
if(_cf1&&!_cf1.hasSelectedChartNodes()){
var _cf2=_cf1.getAllSelectedObjects();
if(_cf2.length===1){
if(_cf2[0]!=null&&_cf2[0].getLayoutType()!="columnTitle"){
return true;
}
}
}
return false;
};
CSubscriptionManager.prototype.CanCreateNewWatchRule=function(){
if(typeof this.m_cv.UIBlacklist!="undefined"&&this.m_cv.UIBlacklist.indexOf(" RV_TOOLBAR_BUTTONS_ALERT_USING_NEW_WATCH_RULE ")!=-1){
return false;
}
if(!this.m_bInitialized&&this.getViewer().envParams["ui.action"]=="view"){
var oCV=this.getViewer();
var _cf4=new JSONDispatcherEntry(oCV);
_cf4.setKey("subscriptionManager");
_cf4.forceSynchronous();
_cf4.addFormField("ui.action","getSubscriptionInfo");
_cf4.addFormField("cv.responseFormat","subscriptionManager");
_cf4.addFormField("contextMenu","true");
this.addCommonFormFields(_cf4);
_cf4.setCallbacks({"complete":{"object":this,"method":this.Initialize}});
oCV.dispatchRequest(_cf4);
}
return this.m_bCanCreateNewWatchRule;
};
CSubscriptionManager.prototype.CanModifyWatchRule=function(){
return this.m_cv.bCanUseCognosViewerConditionalSubscriptions&&this.m_bAllowSubscription;
};
CSubscriptionManager.prototype.CanGetNotified=function(){
if(typeof this.m_cv.UIBlacklist!="undefined"&&this.m_cv.UIBlacklist.indexOf(" RV_TOOLBAR_BUTTONS_ALERT_ABOUT_NEW_VERSIONS ")!=-1){
return false;
}
return this.m_bCanGetNotified;
};
CSubscriptionManager.prototype.UpdateSubscribeMenu=function(){
var _cf5=this.getStandaloneViewerToolbarControl();
var _cf6=_cf5?_cf5.getItem("watchNewVersions"):null;
var _cf7=this.m_cv.getWebContentRoot();
var _cf8=this.m_cv.getSkin();
if(_cf6){
var _cf9=_cf6.getMenu();
this.ClearSubscriptionMenu();
var _cfa=false;
if(this.CanGetNotified()){
if(this.m_sQueryNotificationResponse=="on"){
new CMenuItem(_cf9,RV_RES.RV_DO_NOT_ALERT_NEW_VERSION,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().DeleteNotification();",_cf7+"/rv/images/action_remove_from_list.gif",gMenuItemStyle,_cf7,_cf8);
_cfa=true;
}else{
if(this.m_sQueryNotificationResponse=="off"&&this.m_sEmail!=""){
new CMenuItem(_cf9,RV_RES.RV_ALERT_NEW_VERSION,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().AddNotification();",_cf7+"/rv/images/action_add_to_list.gif",gMenuItemStyle,_cf7,_cf8);
_cfa=true;
}
}
}
if(this.CanCreateNewWatchRule()){
if(_cfa){
_cf9.add(gMenuSeperator);
}
var _cfb=new CMenuItem(_cf9,RV_RES.RV_NEW_WATCH_RULE,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().NewSubscription();",_cf7+"/rv/images/action_new_subscription.gif",gMenuItemStyle,_cf7,_cf8);
if(!this.IsValidSelectionForNewRule()){
_cfb.disable();
}
_cfa=true;
}
var _cfc="";
if(typeof this.m_cv.UIBlacklist!="undefined"){
_cfc=this.m_cv.UIBlacklist;
}
var _cfd;
if(_cfc.indexOf(" RV_TOOLBAR_BUTTONS_RULES ")==-1){
if(_cfa){
_cf9.add(gMenuSeperator);
}
if(this.m_aWatchRules&&this.m_aWatchRules.length>0){
var _cfe=this.CanModifyWatchRule();
for(var sub=0;sub<this.m_aWatchRules.length;++sub){
var menu=new CMenuItem(_cf9,this.m_aWatchRules[sub].name,"",_cf7+"/rv/images/icon_subscription.gif",gMenuItemStyle,_cf7,_cf8);
var _d01=menu.createCascadedMenu(gMenuStyle);
_d01.m_oCV=this.m_cv;
if(_cfe&&_cfc.indexOf(" RV_TOOLBAR_BUTTONS_RULES_MODIFY ")==-1){
new CMenuItem(_d01,RV_RES.RV_MODIFY_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().ModifySubscription("+sub+");",_cf7+"/rv/images/action_edit.gif",gMenuItemStyle,_cf7,_cf8);
}
if(_cfc.indexOf(" RV_TOOLBAR_BUTTONS_RULES_DELETE ")==-1){
new CMenuItem(_d01,RV_RES.RV_DELETE_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().DeleteSubscription("+sub+");",_cf7+"/rv/images/action_delete.gif",gMenuItemStyle,_cf7,_cf8);
}
}
}else{
_cfd=new CMenuItem(_cf9,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_cf7,_cf8);
_cfd.disable();
}
}
if(_cf9.getNumItems()==0){
_cfd=new CMenuItem(_cf9,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_cf7,_cf8);
_cfd.disable();
}
_cf9.setForceCallback(false);
_cf9.draw();
if(_cf9.isVisible()){
_cf9.show();
}
_cf9.setForceCallback(true);
}
};
CSubscriptionManager.prototype.UpdateAnnotationMenu=function(){
var _d02=this.getStandaloneViewerToolbarControl();
var _d03=_d02?_d02.getItem("addAnnotations"):null;
var _d04=this.m_cv.getWebContentRoot();
var _d05=this.m_cv.getSkin();
var _d06=_d03.getMenu();
this.ClearAnnotationMenu();
var menu=new CMenuItem(_d06,RV_RES.RV_NEW_COMMENT,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().NewAnnotation();",_d04+"/rv/images/action_comment_add.gif",gMenuItemStyle,_d04,_d05);
var _d08=this.m_annotations.length;
if(_d08>0){
_d06.add(gMenuSeperator);
}
if(!this.m_bAllowAnnotations||!this.m_bCanCreateAnnotations){
menu.disable();
}
var _d09;
var bidi=isViewerBidiEnabled()?BidiUtils.getInstance():null;
for(var i=0;i<_d08;i++){
var _d0c=this.m_annotations[i].defaultName;
_d09=_d0c.length>60?_d0c.substring(0,60)+"...":_d0c;
if(isViewerBidiEnabled()){
_d09=bidi.btdInjectUCCIntoStr(_d09,getViewerBaseTextDirection());
}
var _d0d=Boolean(this.m_annotations[i].permissions.read);
var _d0e=Boolean(this.m_annotations[i].permissions.write);
var _d0f=Boolean(this.m_annotations[i].permissions.traverse)&&Boolean(this.m_annotations[i].permissions.write);
var _d10="javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().ViewAnnotation("+i+");";
var _d11="javascript:alert('Permission denied')";
_d10=_d0d?_d10:_d11;
if(i>0&&this.m_annotations[i].layoutElementId!=this.m_annotations[i-1].layoutElementId){
_d06.add(gMenuSeperator);
}
var _d12="/rv/images/action_comment.gif";
if(this.m_annotations[i].layoutElementId!=""){
_d12="/rv/images/action_subscribe.gif";
}
menu=new CMenuItem(_d06,_d09,_d10,_d04+_d12,gMenuItemStyle,_d04,_d05);
var _d13=menu.createCascadedMenu(gMenuStyle);
var _d14=new CInfoPanel("300px",_d04,_d13.getId()+"_comments");
_d14.setParent(_d13);
_d0c=this.m_annotations[i].defaultName;
var _d15=_d0c.length>60?_d0c.substring(0,60)+"...":_d0c;
if(isViewerBidiEnabled()){
_d15=bidi.btdInjectUCCIntoStr(_d15,getViewerBaseTextDirection());
}
_d14.addProperty(RV_RES.RV_VIEW_COMMENT_NAME,html_encode(_d15));
_d14.addSpacer(4);
var cmnt=this.m_annotations[i].description;
var _d17=cmnt.length>590?cmnt.substring(0,590)+"...":cmnt;
if(isViewerBidiEnabled()){
_d17=bidi.btdInjectUCCIntoStr(_d17,getViewerBaseTextDirection());
}
_d14.addProperty(RV_RES.RV_VIEW_COMMENT_CONTENTS,replaceNewLine(html_encode(_d17)));
_d14.addSpacer(4);
var _d18=this.m_annotations[i].modificationTime;
if(isViewerBidiEnabled()){
_d18=bidi.btdInjectUCCIntoStr(_d18,getViewerBaseTextDirection());
}
_d14.addProperty(RV_RES.RV_VIEW_COMMENT_MODTIME,_d18);
var _d19=this.m_annotations[i].owner.defaultName;
if(isViewerBidiEnabled()){
_d19=bidi.btdInjectUCCIntoStr(_d19,getViewerBaseTextDirection());
}
_d14.addProperty(RV_RES.RV_VIEW_COMMENT_OWNER,_d19);
_d13.add(_d14);
if(_d0e||_d0f){
_d13.add(gMenuSeperator);
}
new CMenuItem(_d13,RV_RES.RV_VIEW_COMMENT,this.m_cv.getObjectId()+".getSubscriptionManager().ViewAnnotation("+i+");",_d04+"/rv/images/action_comment_view.gif",gMenuItemStyle,_d04,_d05);
if(_d0e){
new CMenuItem(_d13,RV_RES.RV_MODIFY_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().ModifyAnnotation("+i+");",_d04+"/rv/images/action_comment_modify.gif",gMenuItemStyle,_d04,_d05);
}
if(_d0f){
new CMenuItem(_d13,RV_RES.RV_DELETE_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().DeleteAnnotation("+i+");",_d04+"/rv/images/action_comment_delete.gif",gMenuItemStyle,_d04,_d05);
}
}
_d06.setForceCallback(false);
_d06.draw();
if(_d06.isVisible()){
_d06.show();
}
_d06.setForceCallback(true);
};
CSubscriptionManager.prototype.AddNotification=function(){
alert(this.m_sAlertNewVersionConfirm);
var oCV=this.getViewer();
var _d1b=new DataDispatcherEntry(oCV);
_d1b.setKey("subscriptionManager");
_d1b.addFormField("ui.action","addNotification");
_d1b.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_d1b);
oCV.dispatchRequest(_d1b);
};
CSubscriptionManager.prototype.DeleteNotification=function(){
alert(RV_RES.RV_DO_NOT_ALERT_NEW_VERSION_CONFIRM);
var oCV=this.getViewer();
var _d1d=new DataDispatcherEntry(oCV);
_d1d.setKey("subscriptionManager");
_d1d.addFormField("ui.action","deleteNotification");
_d1d.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_d1d);
oCV.dispatchRequest(_d1d);
};
CSubscriptionManager.prototype.NewAnnotation=function(){
var oFWR=document.forms["formWarpRequest"+this.m_cv.getId()];
var _d1f=oFWR["ui.object"].value;
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_d1f);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
GUtil.createFormField(form,"action_hint","create");
var _d21=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d21,form.target,this.m_windowOptions);
};
CSubscriptionManager.prototype.ViewAnnotation=function(idx){
var sub=this.m_annotations[idx];
var _d24=sub.searchPath;
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_d24);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
var _d26=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d26,form.target,this.m_windowOptions);
};
CSubscriptionManager.prototype.ModifyAnnotation=function(idx){
var sub=this.m_annotations[idx];
var _d29=this.m_annotations[idx].searchPath;
if(sub&&_d29){
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_d29);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
GUtil.createFormField(form,"action_hint","save");
var _d2b=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d2b,form.target,this.m_windowOptions);
}
};
CSubscriptionManager.prototype.DeleteAnnotation=function(idx){
var sub=this.m_annotations[idx];
if(sub&&sub.searchPath&&confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE)){
var oCV=this.getViewer();
var _d2f=new DataDispatcherEntry(oCV);
_d2f.setKey("subscriptionManager");
_d2f.addFormField("ui.action","deleteAnnotation");
_d2f.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_d2f,sub.searchPath);
oCV.dispatchRequest(_d2f);
}
};
CSubscriptionManager.prototype.NewSubscription=function(){
var sc=this.m_cv.getSelectionController();
var oFWR=document.forms["formWarpRequest"+this.m_cv.getId()];
var _d32=oFWR.reRunObj.value;
if(_d32&&sc&&sc.getAllSelectedObjects().length===1){
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
var fWR=document.getElementById("formWarpRequest"+this.m_cv.getId());
var _d35=new CSelectionXml(fWR["ui.burstID"].value,fWR["ui.contentLocale"].value,fWR["ui.outputLocale"].value);
_d35.BuildSelectionFromController(sc);
GUtil.createFormField(form,"rv.selectionSpecXML",_d35.toXml());
GUtil.createFormField(form,"rv.periodicalProducer",_d32);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","subscribe/conditional_subscribe1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
var _d36=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d36,form.target,"toolbar,location,status,menubar,resizable,scrollbars=1");
}else{
}
};
CSubscriptionManager.prototype.DeleteSubscription=function(idx){
var sub=this.m_aWatchRules[idx];
if(sub&&sub.searchPath&&confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE)){
var oCV=this.getViewer();
var _d3a=new DataDispatcherEntry(oCV);
_d3a.setKey("subscriptionManager");
_d3a.addFormField("ui.action","deleteSubscription");
_d3a.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_d3a,sub.searchPath);
oCV.dispatchRequest(_d3a);
}
};
CSubscriptionManager.prototype.ModifySubscription=function(idx){
var sub=this.m_aWatchRules[idx];
if(sub&&sub.searchPath){
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"m_obj",sub.searchPath);
GUtil.createFormField(form,"m_name",sub.name);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m_class","reportDataServiceAgentDefinition");
GUtil.createFormField(form,"m","portal/properties_subscription.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
var _d3e=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d3e,form.target,"toolbar,location,status,menubar,resizable,scrollbars=1");
}
};
CSubscriptionManager.prototype.OpenSubscriptionMenu=function(){
var oCV=this.getViewer();
var _d40=new JSONDispatcherEntry(oCV);
_d40.setKey("subscriptionManager");
_d40.addFormField("ui.action","getSubscriptionInfo");
_d40.addFormField("cv.responseFormat","subscriptionManager");
this.addCommonFormFields(_d40);
_d40.setCallbacks({"complete":{"object":this,"method":this.OpenSubscriptionMenuResponse}});
oCV.dispatchRequest(_d40);
};
CSubscriptionManager.prototype.OpenAnnotationMenu=function(){
var oCV=this.getViewer();
var _d42=new JSONDispatcherEntry(oCV);
_d42.setKey("subscriptionManager");
_d42.addFormField("ui.action","getAnnotationInfo");
_d42.addFormField("cv.responseFormat","getAnnotations");
var _d43=oCV.envParams["ui.object"];
this.addCommonFormFields(_d42,_d43?_d43:"");
_d42.setCallbacks({"complete":{"object":this,"method":this.OpenAnnotationMenuResponse}});
oCV.dispatchRequest(_d42);
};
CSubscriptionManager.prototype.OpenAnnotationMenuResponse=function(_d44){
if(this.Initialize(_d44)){
this.UpdateAnnotationMenu();
}else{
this.ClearAnnotationMenu();
}
};
CSubscriptionManager.prototype.OpenSubscriptionMenuResponse=function(_d45){
if(this.Initialize(_d45)){
this.UpdateSubscribeMenu();
}else{
this.AddEmptySubscriptionMenuItem();
}
};
CSubscriptionManager.prototype.addCommonFormFields=function(_d46,_d47){
if(_d47&&_d47!=""){
_d46.addFormField("ui.object",_d47);
}else{
var _d48=document["formWarpRequest"+this.getViewer().getId()];
if(_d48&&_d48["reRunObj"]){
_d46.addFormField("ui.object",_d48["reRunObj"].value);
}
}
if(_d46.getFormField("ui.action")=="getSubscriptionInfo"){
_d46.addFormField("initialized",this.m_bInitialized?"true":"false");
}
_d46.addFormField("cv.id",this.getViewer().getId());
};
CSubscriptionManager.prototype.AddEmptySubscriptionMenuItem=function(){
var _d49=this.getStandaloneViewerToolbarControl();
if(_d49){
var _d4a=_d49.getItem("watchNewVersions");
if(_d4a){
_d4a.getMenu().clear();
}
var _d4b=this.m_cv.getWebContentRoot();
var _d4c=this.m_cv.getSkin();
var _d4d=_d4a.getMenu();
var _d4e=new CMenuItem(_d4d,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_d4b,_d4c);
_d4e.disable();
_d4d.setForceCallback(false);
_d4d.draw();
if(_d4d.isVisible()){
_d4d.show();
}
_d4d.setForceCallback(true);
}
};
CSubscriptionManager.prototype.ClearSubscriptionMenu=function(){
var _d4f=this.getStandaloneViewerToolbarControl();
if(_d4f){
var _d50=_d4f.getItem("watchNewVersions");
if(_d50){
_d50.getMenu().clear();
}
}
};
CSubscriptionManager.prototype.ClearAnnotationMenu=function(){
var _d51=this.getStandaloneViewerToolbarControl();
if(_d51){
var _d52=_d51.getItem("addAnnotations");
if(_d52){
_d52.getMenu().clear();
}
}
};
CSubscriptionManager.prototype.ClearContextAnnotationMenu=function(){
var _d53=this.getStandaloneViewerContextMenu();
if(_d53){
var _d54=_d53.getFindCommentMenuItem();
if(_d54){
_d54.getMenu().clear();
}
}
};
CSubscriptionManager.prototype.getStandaloneViewerToolbarControl=function(){
if(typeof this.m_cv.rvMainWnd!="undefined"&&this.m_cv.rvMainWnd!=null&&typeof this.m_cv.rvMainWnd.getToolbarControl=="function"){
return this.m_cv.rvMainWnd.getToolbarControl();
}else{
return null;
}
};
CSubscriptionManager.prototype.getStandaloneViewerContextMenu=function(){
if(typeof this.m_cv.rvMainWnd!="undefined"&&this.m_cv.rvMainWnd!=null&&typeof this.m_cv.rvMainWnd.getContextMenu=="function"){
return this.m_cv.rvMainWnd.getContextMenu();
}else{
return null;
}
};
var GUtil={};
GUtil.createHiddenForm=function(name,_d56,_d57,_d58){
var form=document.getElementById(name);
if(form){
document.body.removeChild(form);
}
form=document.createElement("form");
form.id=name;
form.name=name;
form.method=_d56;
form.style.display="none";
form.action=document.forms["formWarpRequest"+_d57].action;
form.target=_d58+(new Date()).getTime();
document.body.appendChild(form);
return form;
};
GUtil.createFormField=function(el,name,_d5c){
var _d5d=document.createElement("input");
_d5d.type="hidden";
_d5d.name=name;
_d5d.value=_d5c;
el.appendChild(_d5d);
};
GUtil.generateCallback=function(func,_d5f,_d60){
if(func){
var _d61=_d60||this;
_d5f=(_d5f instanceof Array)?_d5f:[];
return (function(_d62){
if(typeof _d62!="undefined"&&_d5f.length==0){
_d5f.push(_d62);
}
return func.apply(_d61,_d5f);
});
}else{
return (function(){
});
}
};
GUtil.destroyProperties=function(_d63,_d64){
var _d65;
if(_d63 instanceof Array){
for(var i=0;i<_d63.length;i++){
_d65=_d63[i];
if(_d65 instanceof String){
_d65=null;
}else{
if(_d65&&_d65.destroy&&!_d65._beingDestroyed){
_d65.destroy();
}
GUtil.destroyProperties(_d65);
}
}
}else{
if(_d63 instanceof Object){
if(_d63._beingDestroyed){
return;
}
var obj=_d63;
obj._beingDestroyed=true;
for(var _d68 in obj){
_d65=obj[_d68];
if(_d68==="_beingDestroyed"||_d68==="m_destroyed"||_d68==="_destroyed"||typeof _d65=="function"){
continue;
}
if(_d65 instanceof Array){
GUtil.destroyProperties(_d65);
}else{
if(_d65 instanceof Object){
if(typeof _d65.destroy=="function"&&!_d65._destroyed&&(_d65!==CCognosViewer||_d64)){
_d65.destroy();
}
}
}
delete obj[_d68];
}
}
}
};
cvLoadDialog=function(_d69,_d6a,_d6b,_d6c,_d6d){
var _d6e=document.getElementById("formWarpRequest"+_d69.getId());
if(_d6e&&_d69){
_d69.getWorkingDialog().hide();
var _d6f="";
var _d70="";
var _d71=null;
if(_d69.isAccessibleMode()){
_d6f="winNAT_"+(new Date()).getTime();
_d70=_d69.getWebContentRoot()+"/"+"rv/blankNewWin.html?cv.id="+this.getCVId();
}else{
var _d72=document.body;
_d71=new CModal("","",_d72,null,null,_d6c,_d6b,true,true,false,true,_d69.getWebContentRoot());
if(typeof _d6d=="string"){
document.getElementById(CMODAL_CONTENT_ID).setAttribute("title",_d6d);
}
document.getElementById(CMODAL_BACK_IFRAME_ID).setAttribute("title",RV_RES.IDS_JS_MODAL_BACK_IFRAME);
_d6f=CMODAL_CONTENT_ID;
}
var _d73=document.createElement("FORM");
_d73.method="POST";
_d73.action=_d69.getGateway();
_d73.target=_d6f;
_d73.style.margin="0px";
document.body.appendChild(_d73);
for(var _d74 in _d6a){
_d73.appendChild(createHiddenFormField(_d74,_d6a[_d74]));
}
_d73.appendChild(createHiddenFormField("cv.id",_d69.getId()));
_d73.appendChild(createHiddenFormField("b_action","xts.run"));
_d73.appendChild(createHiddenFormField("ui.action",_d6e["ui.action"].value));
_d73.appendChild(createHiddenFormField("ui.object",_d6e["ui.object"].value));
if(typeof _d69.rvMainWnd!="undefined"){
_d73.appendChild(createHiddenFormField("run.outputFormat",_d69.rvMainWnd.getCurrentFormat()));
}
if(typeof _d6e["run.outputLocale"]!="undefined"){
_d73.appendChild(createHiddenFormField("run.outputLocale",_d6e["run.outputLocale"].value));
}
if(typeof _d73["backURL"]=="undefined"&&typeof _d73["ui.backURL"]=="undefined"&&typeof _d6e["ui.backURL"]!="undefined"){
_d73.appendChild(createHiddenFormField("ui.backURL",_d6e["ui.backURL"].value));
}
if(typeof _d69!="undefined"&&typeof _d69.getConversation!="undefined"&&typeof _d69.getTracking!="undefined"){
_d73.appendChild(createHiddenFormField("ui.conversation",_d69.getConversation()));
_d73.appendChild(createHiddenFormField("m_tracking",_d69.getTracking()));
if(_d69.envParams["ui.name"]!="undefined"){
_d73.appendChild(createHiddenFormField("ui.name",_d69.envParams["ui.name"]));
}
}
var _d75=window.onbeforeunload;
window.onbeforeunload=null;
if(_d69.isAccessibleMode()){
window.open(_d70,_d6f,"rv");
_d73.submit();
}else{
_d73.submit();
_d71.show();
}
window.onbeforeunload=_d75;
document.body.removeChild(_d73);
_d69.modalShown=true;
}
};
function createHiddenFormField(name,_d77){
var _d78=document.createElement("input");
_d78.setAttribute("type","hidden");
_d78.setAttribute("name",name);
_d78.setAttribute("id",name);
_d78.setAttribute("value",_d77);
return (_d78);
};
function isAuthenticationFault(_d79){
if(_d79!=null){
var _d7a=XMLHelper_FindChildByTagName(_d79,"CAM",true);
return (_d7a!=null&&XMLHelper_FindChildByTagName(_d7a,"promptInfo",true)!=null);
}
};
function processAuthenticationFault(_d7b,_d7c){
if(isAuthenticationFault(_d7b)){
launchLogOnDialog(_d7c,_d7b);
return true;
}
return false;
};
function isObjectEmpty(_d7d){
for(var _d7e in _d7d){
if(_d7d.hasOwnProperty(_d7e)){
return false;
}
}
return true;
};
function launchLogOnDialog(cvID,_d80){
try{
var oCV=getCognosViewerObjectRef(cvID);
var _d82={"b_action":"xts.run","m":"portal/close.xts","h_CAM_action":"logonAs"};
if(_d80!=null){
var _d83=XMLHelper_FindChildrenByTagName(_d80,"namespace",true);
if(_d83!=null){
for(var _d84=0;_d84<_d83.length;++_d84){
var _d85=_d83[_d84];
if(_d85!=null){
var _d86=XMLHelper_FindChildByTagName(_d85,"name",false);
var _d87=XMLHelper_FindChildByTagName(_d85,"value",false);
if(_d86!=null&&_d87!=null){
var _d88=XMLHelper_GetText(_d86);
var _d89=XMLHelper_GetText(_d87);
if(_d88!=null&&_d88.length>0){
_d82[_d88]=_d89;
}
}
}
}
}
}
cvLoadDialog(oCV,_d82,540,460);
}
catch(exception){
}
};
function getCVWaitingOnFault(){
var oCV=null;
for(var _d8b=0;_d8b<window.gaRV_INSTANCES.length;_d8b++){
if(window.gaRV_INSTANCES[_d8b].getRetryDispatcherEntry()!=null){
oCV=window.gaRV_INSTANCES[_d8b];
break;
}
}
return oCV;
};
function ccModalCallBack(_d8c,data){
var oCV=getCVWaitingOnFault();
destroyCModal();
if(typeof HiddenIframeDispatcherEntry=="function"&&HiddenIframeDispatcherEntry.hideIframe){
var oCV=window.gaRV_INSTANCES[0];
if(oCV){
HiddenIframeDispatcherEntry.hideIframe(oCV.getId());
}
}
if(oCV!=null){
if(typeof _d8c!="undefined"&&_d8c=="ok"){
var _d8f=oCV.getRetryDispatcherEntry();
if(_d8f){
_d8f.retryRequest();
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
function getCrossBrowserNode(evt,_d92){
var node=null;
if(_d92&&evt.explicitOriginalTarget){
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
function getNodeFromEvent(evt,_d95){
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
if(!_d95&&node&&node.nodeName&&node.nodeName.toLowerCase()=="img"&&node.getAttribute("rsvpChart")!="true"){
node=node.parentNode;
}
}
return node;
};
function getCtxNodeFromEvent(evt){
try{
var node=getCrossBrowserNode(evt);
var _d9a=node.nodeName.toUpperCase();
if((_d9a=="SPAN"||_d9a=="AREA"||_d9a=="IMG")&&node.getAttribute("ctx")!=null){
return node;
}else{
if(_d9a=="SPAN"&&(node.parentNode.getAttribute("ctx")!=null)){
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
var _d9d=node.document?node.document:node.ownerDocument;
return _d9d;
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
var _da0=getNodeFromEvent(evt);
if(_da0&&_da0.nodeName){
var _da1=_da0.nodeName.toLowerCase();
if((_da1=="td"||_da1=="span")&&_da0.childNodes&&_da0.childNodes.length>0&&_da0.childNodes[0].className=="textItem"){
try{
_da0.childNodes[0].focus();
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
function replaceNewLine(_da3){
var regX=/\r\n|\r|\n/g;
var _da5="<br/>";
return _da3.replace(regX,_da5);
};
function xml_encode(_da6){
var _da7=""+_da6;
if((_da7=="0")||((_da6!=null)&&(_da6!=false))){
_da7=_da7.replace(/&/g,"&amp;");
_da7=_da7.replace(/</g,"&lt;");
_da7=_da7.replace(/>/g,"&gt;");
_da7=_da7.replace(/"/g,"&quot;");
_da7=_da7.replace(/'/g,"&apos;");
}else{
if(_da6==null){
_da7="";
}
}
return _da7;
};
function xml_decodeParser(sAll,_da9){
var _daa=sAll;
switch(_da9){
case "amp":
_daa="&";
break;
case "lt":
_daa="<";
break;
case "gt":
_daa=">";
break;
case "quot":
_daa="\"";
break;
case "apos":
_daa="'";
break;
}
return _daa;
};
function xml_decode(_dab){
var _dac=""+_dab;
if((_dac=="0")||((_dab!=null)&&(_dab!=false))){
_dac=_dac.replace(/&(amp|lt|gt|quot|apos);/g,xml_decodeParser);
}else{
if(_dab==null){
_dac="";
}
}
return _dac;
};
function xpath_attr_encode(_dad){
var _dae=null;
if(_dad.indexOf("'")>=0&&_dad.indexOf("\"")>=0){
var _daf=_dad.split("\"");
_dae="concat(";
for(var i=0;i<_daf.length;++i){
if(i>0){
_dae+=",";
}
if(_daf[i].length>0){
_dae+=("\""+_daf[i]+"\"");
}else{
_dae+="'\"'";
}
}
_dae+=")";
}else{
if(_dad.indexOf("'")>=0){
_dae="\""+_dad+"\"";
}else{
_dae="'"+_dad+"'";
}
}
return _dae;
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
function cleanupVariable(_db8){
if(typeof window[_db8]!="undefined"&&window[_db8]){
if(isIE()){
eval("delete "+_db8);
}else{
delete window[_db8];
}
}
};
function loadClass(_db9){
try{
var _dba=eval("new "+_db9+"();");
return _dba;
}
catch(e){
return null;
}
};
function getElementsByClassName(oElm,_dbc,_dbd){
var _dbe=(_dbc=="*"&&oElm.all)?oElm.all:oElm.getElementsByTagName(_dbc);
var _dbf=[];
var _dc0=new RegExp("(^|\\s)"+_dbd+"(\\s|$)");
var _dc1=_dbe.length;
for(var i=0;i<_dc1;i++){
var _dc3=_dbe[i];
if(_dc0.test(_dc3.className)){
_dbf.push(_dc3);
}
}
return _dbf;
};
function getImmediateLayoutContainerId(node){
var _dc5=node;
while(_dc5!=null){
if(_dc5.getAttribute&&_dc5.getAttribute("lid")!=null){
return _dc5.getAttribute("lid");
}
_dc5=_dc5.parentNode;
}
return null;
};
function getChildElementsByAttribute(oElm,_dc7,_dc8,_dc9){
return getDescendantElementsByAttribute(oElm,_dc7,_dc8,_dc9,true);
};
function getElementsByAttribute(oElm,_dcb,_dcc,_dcd,_dce,_dcf){
return getDescendantElementsByAttribute(oElm,_dcb,_dcc,_dcd,false,_dce,_dcf);
};
function getDescendantElementsByAttribute(oElm,_dd1,_dd2,_dd3,_dd4,_dd5,_dd6){
var _dd7=[];
var _dd8=null;
if(typeof _dd6==="undefined"){
_dd8=(typeof _dd3!="undefined")?new RegExp("(^|\\s)"+_dd3+"(\\s|$)","i"):null;
}else{
_dd8=_dd6;
}
if(typeof _dd1=="string"){
_dd1=[_dd1];
}
var _dd9=(oElm?_dd1.length:0);
for(var _dda=0;_dda<_dd9;_dda++){
var _ddb=null;
if(_dd4){
if(_dd1[_dda]=="*"&&oElm.all){
_ddb=oElm.childNodes;
}else{
_ddb=[];
var _ddc=oElm.childNodes;
for(var i=0;i<_ddc.length;++i){
if(_ddc[i].nodeName.toLowerCase()==_dd1[_dda].toLowerCase()){
_ddb.push(_ddc[i]);
}
}
}
}else{
_ddb=(_dd1[_dda]=="*"&&oElm.all)?oElm.all:oElm.getElementsByTagName(_dd1[_dda]);
}
var _dde=_ddb.length;
for(var idx=0;idx<_dde;idx++){
var _de0=_ddb[idx];
var _de1=_de0.getAttribute&&_de0.getAttribute(_dd2);
if(_de1!==null){
var _de2=null;
if(typeof _de1==="number"){
_de2=String(_de1);
}else{
if(typeof _de1==="string"&&_de1.length>0){
_de2=_de1;
}
}
if(_de2!==null){
if(typeof _dd3=="undefined"||(_dd8&&_dd8.test(_de2))){
_dd7.push(_de0);
if(_dd5!=-1&&_dd7.length>_dd5){
return [];
}else{
if(_dd5==1&&_dd7.length==1){
return _dd7;
}
}
}
}
}
}
}
return _dd7;
};
function savedOutputDoneLoading(cvId,_de4){
var oCV=window["oCV"+cvId];
var _de6=(oCV&&oCV.getViewerWidget?oCV.getViewerWidget():null);
var _de7=(_de6?_de6.getSavedOutput():null);
if(_de7){
_de7.outputDoneLoading();
}else{
if(_de4<5){
_de4++;
var _de8=function(){
savedOutputDoneLoading(cvId,_de4);
};
setTimeout(_de8,100);
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
var _dea=navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
return _dea?parseFloat(_dea[1]):null;
};
function isFF(){
return (navigator.userAgent.indexOf("Firefox")!=-1);
};
function isIOS(){
return navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("iPhone")!=-1;
};
function displayChart(_deb,_dec,_ded,_dee){
if(_dec.length>1){
document.images[_deb].src=_dec;
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
var _df4=node.getAttribute("viewerId");
if(!_df4){
_df4=node.parentNode.getAttribute("viewerId");
}
if(!_df4){
return;
}
var oCV=window["oCV"+_df4];
var _df6=oCV.getAction("Selection");
_df6.pageClicked(evt);
return stopEventBubble(evt);
};
function clientToScreenCoords(_df7,_df8){
var _df9=_df7;
var _dfa={topCoord:0,leftCoord:0};
while(_df9!=null&&_df9!=_df8){
_dfa.topCoord+=_df9.offsetTop;
_dfa.leftCoord+=_df9.offsetLeft;
_df9=_df9.offsetParent;
}
return _dfa;
};
function getCurrentPosistionString(oCV,_dfc,_dfd){
var _dfe=RV_RES.IDS_JS_INFOBAR_ITEM_COUNT;
var _dff=/\{0\}/;
var _e00=/\{1\}/;
_dfe=_dfe.replace(_dff,_dfc);
_dfe=" "+_dfe.replace(_e00,_dfd)+" ";
return _dfe;
};
function applyJSONProperties(obj,_e02){
for(property in _e02){
if(typeof _e02[property]=="object"&&!(_e02[property] instanceof Array)){
if(typeof obj[property]=="undefined"){
obj[property]={};
}
applyJSONProperties(obj[property],_e02[property]);
}else{
obj[property]=_e02[property];
}
}
};
function CViewerCommon(){
};
CViewerCommon.openNewWindowOrTab=function(sURL,_e04){
return window.open(sURL,_e04);
};
CViewerCommon.toJSON=function(obj){
var type=typeof (obj);
if(type!="object"||type===null){
if(type==="string"){
obj="\""+obj+"\"";
}
return String(obj);
}else{
var _e07;
var prop;
var json=[];
var _e0a=(obj&&obj.constructor==Array);
for(_e07 in obj){
prop=obj[_e07];
type=typeof (prop);
if(type==="string"){
prop="\""+prop+"\"";
}else{
if(type=="object"&&prop!==null){
prop=CViewerCommon.toJSON(prop);
}
}
json.push((_e0a?"":"\""+_e07+"\":")+String(prop));
}
return (_e0a?"[":"{")+String(json)+(_e0a?"]":"}");
}
};
function resizePinnedContainers(){
var oCV=window.gaRV_INSTANCES[0];
if(oCV&&!oCV.m_viewerFragment){
var _e0c=oCV.getPinFreezeManager();
if(_e0c&&_e0c.hasFrozenContainers()){
var _e0d=document.getElementById("RVContent"+oCV.getId());
var _e0e=document.getElementById("mainViewerTable"+oCV.getId());
var _e0f=_e0d.clientWidth;
var _e10=_e0e.clientHeight;
_e0c.resize(_e0f,_e10);
if(isIE()){
oCV.repaintDiv(_e0d);
}
}
}
};
function setWindowHref(url){
var _e12=window.onbeforeunload;
window.onbeforeunload=null;
window.location.href=url;
window.onbeforeunload=_e12;
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
var _e16=gaRV_INSTANCES[0].isBidiEnabled();
if(_e16){
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
function enforceTextDir(_e17){
if(isViewerBidiEnabled()&&_e17){
var sDir=getViewerBaseTextDirection();
var _e19=BidiUtils.getInstance();
if(sDir=="auto"){
sDir=_e19.resolveStrBtd(_e17);
}
var _e1a=(!dojo._isBodyLtr())?_e19.RLM:_e19.LRM;
return _e1a+((sDir==="rtl")?_e19.RLE:_e19.LRE)+_e17+_e19.PDF+_e1a;
}
return _e17;
};
function getElementDirection(_e1b){
var dir=null;
if(_e1b.currentStyle){
dir=_e1b.currentStyle.direction;
}else{
if(window.getComputedStyle){
var _e1d=window.getComputedStyle(_e1b,null);
if(_e1d){
dir=_e1d.getPropertyValue("direction");
}
}
}
if(dir){
dir=dir.toLowerCase();
}
return dir;
};
function getScrollLeft(_e1e){
if(getElementDirection(_e1e)==="rtl"&&isFF()){
return _e1e.scrollWidth-_e1e.offsetWidth+_e1e.scrollLeft;
}
return _e1e.scrollLeft;
};
function setScrollLeft(_e1f,_e20){
if(getElementDirection(_e1f)==="rtl"&&isFF()){
_e1f.scrollLeft=_e1f.offsetWidth+_e20-_e1f.scrollWidth;
}else{
_e1f.scrollLeft=_e20;
}
};
function setScrollRight(_e21,_e22){
if(getElementDirection(_e21)==="rtl"&&isFF()){
_e21.scrollLeft=-_e22;
}else{
_e21.scrollLeft=_e21.scrollWidth-_e21.offsetWidth-_e22;
}
};
function getBoxInfo(el,_e24){
if(!getBoxInfo.aStyles){
getBoxInfo.aStyles=[{name:"marginLeft",ie:"marginLeft",ff:"margin-left"},{name:"marginRight",ie:"marginRight",ff:"margin-right"},{name:"marginTop",ie:"marginTop",ff:"margin-top"},{name:"marginBottom",ie:"marginBottom",ff:"margin-bottom"},{name:"borderLeftWidth",ie:"borderLeftWidth",ff:"border-left-width"},{name:"borderRightWidth",ie:"borderRightWidth",ff:"border-right-width"},{name:"borderTopWidth",ie:"borderTopWidth",ff:"border-top-width"},{name:"borderBottomWidth",ie:"borderBottomWidth",ff:"border-bottom-width"},{name:"paddingLeft",ie:"paddingLeft",ff:"padding-left"},{name:"paddingRight",ie:"paddingRight",ff:"padding-right"},{name:"paddingTop",ie:"paddingTop",ff:"padding-top"},{name:"paddingBottom",ie:"paddingBottom",ff:"padding-bottom"}];
}
var _e25={};
var _e26=null;
if(el.currentStyle){
_e26=el.currentStyle;
}else{
if(window.getComputedStyle){
_e26=window.getComputedStyle(el,null);
}
}
if(!_e26){
return null;
}
for(i in getBoxInfo.aStyles){
var _e27=getBoxInfo.aStyles[i];
var size=null;
if(_e26.getPropertyValue){
size=_e26.getPropertyValue(_e27.ff);
}else{
size=_e26[_e27.ie];
}
if(size&&_e24){
size=Number(size.replace("px",""));
}
_e25[_e27.name]=size;
}
return _e25;
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
CSelectionMetadata.prototype.setContextId=function(_e29){
this.m_sContextId=_e29;
};
CSelectionMetadata.prototype.getContextId=function(){
return this.m_sContextId;
};
CSelectionMetadata.prototype.setRefQuery=function(_e2a){
this.m_refQuery=_e2a;
};
CSelectionMetadata.prototype.getRefQuery=function(){
return this.m_refQuery;
};
CSelectionMetadata.prototype.setDataItem=function(_e2b){
this.m_sDataItem=_e2b;
};
CSelectionMetadata.prototype.getDataItem=function(){
return this.m_sDataItem;
};
CSelectionMetadata.prototype.setMetadataModelItem=function(_e2c){
this.m_sMetadataModelItem=_e2c;
};
CSelectionMetadata.prototype.getMetadataModelItem=function(){
return this.m_sMetadataModelItem;
};
CSelectionMetadata.prototype.setUseValue=function(_e2d){
this.m_sUseValue=_e2d;
};
CSelectionMetadata.prototype.getUseValue=function(){
return this.m_sUseValue;
};
CSelectionMetadata.prototype.setUseValueType=function(_e2e){
this.m_sUseValueType=_e2e;
};
CSelectionMetadata.prototype.setType=function(_e2f){
this.m_sType=_e2f;
};
CSelectionMetadata.prototype.getType=function(){
var _e30=null;
switch(this.m_sUseValueType){
case 25:
case 27:
case 30:
case 32:
_e30="memberUniqueName";
break;
case 26:
_e30="memberCaption";
break;
case 1:
case 55:
case 56:
_e30="string";
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
_e30=parseInt(this.m_sUseValueType,10);
break;
}
return _e30;
};
CSelectionMetadata.prototype.getUseValueType=function(){
if(this.m_sType==null){
this.m_sType=this.getType();
}
return this.m_sType;
};
CSelectionMetadata.prototype.setDisplayValue=function(_e31){
this.m_sDisplayValue=_e31;
};
CSelectionMetadata.prototype.getDisplayValue=function(){
return this.m_sDisplayValue;
};
CSelectionMetadata.prototype.setUsage=function(_e32){
this.m_sUsage=_e32;
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
function CSelectionMetadataIterator(_e35,_e36){
this.m_axisIndex=_e36;
this.m_index=0;
this.m_selectionObject=_e35;
};
CSelectionMetadataIterator.prototype.getSelectionAxis=function(){
var _e37=null;
if(typeof this.m_selectionObject=="object"&&this.m_axisIndex<this.m_selectionObject.getSelectedContextIds().length){
_e37=this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex];
}
return _e37;
};
CSelectionMetadataIterator.prototype.hasNext=function(){
var _e38=this.getSelectionAxis();
if(_e38!=null){
return (this.m_index<_e38.length);
}else{
return false;
}
};
CSelectionMetadataIterator.prototype.next=function(){
var _e39=null;
if(this.hasNext()){
_e39=new CSelectionMetadata();
_e39.setContextId(this.m_selectionObject.m_contextIds[this.m_axisIndex][this.m_index]);
_e39.setDataItem(this.m_selectionObject.getDataItems()[this.m_axisIndex][this.m_index]);
_e39.setMetadataModelItem(this.m_selectionObject.getMetadataItems()[this.m_axisIndex][this.m_index]);
if(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]!=null&&this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]!=""){
_e39.setUseValue(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]);
_e39.setType("memberUniqueName");
}else{
_e39.setUseValue(this.m_selectionObject.getUseValues()[this.m_axisIndex][this.m_index]);
}
if(typeof this.m_selectionObject.m_selectionController=="object"){
var _e3a=this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex][this.m_index];
if(this.m_selectionObject.useDisplayValueFromObject){
_e39.setDisplayValue(this.m_selectionObject.getDisplayValues()[this.m_axisIndex]);
}else{
var _e3b=null;
var _e3c=null;
if(this.m_axisIndex===0){
var _e3d=this.m_selectionObject.getCellRef();
if(_e3d&&_e3d.nodeName&&_e3d.nodeName.toLowerCase()==="td"){
_e3c=this.m_selectionObject.m_selectionController.getDisplayValueFromDOM(_e3a,_e3d.parentNode);
}
}
if(_e3c==null){
_e3c=this.m_selectionObject.m_selectionController.getDisplayValue(_e3a);
}
if(_e3c===""){
_e3c=this.m_selectionObject.m_selectionController.getUseValue(_e3a);
}
_e39.setDisplayValue(_e3c);
}
_e39.setUseValueType(this.m_selectionObject.m_selectionController.getDataType(_e3a));
_e39.setUsage(this.m_selectionObject.m_selectionController.getUsageInfo(_e3a));
_e39.setRefQuery(this.m_selectionObject.m_selectionController.getRefQuery(_e3a));
_e39.setHun(this.m_selectionObject.m_selectionController.getHun(_e3a));
_e39.setDun(this.m_selectionObject.m_selectionController.getDun(_e3a));
}
++this.m_index;
}
return _e39;
};
function CAxisSelectionIterator(_e3e){
this.m_index=0;
this.m_selectionObject=_e3e;
};
CAxisSelectionIterator.prototype.hasNext=function(){
return ((typeof this.m_selectionObject=="object")&&(this.m_index<this.m_selectionObject.getSelectedContextIds().length));
};
CAxisSelectionIterator.prototype.next=function(){
var _e3f=null;
if(this.hasNext()){
_e3f=new CSelectionMetadataIterator(this.m_selectionObject,this.m_index);
++this.m_index;
}
return _e3f;
};
function getSelectionContextIds(_e40){
var _e41=[];
var _e42=_e40.getAllSelectedObjects();
if(_e42!=null&&_e42.length>0){
for(var _e43=0;_e43<_e42.length;++_e43){
var _e44=_e42[_e43];
var _e45=_e44.getSelectedContextIds();
var _e46=[];
for(var item=0;item<_e45.length;++item){
var _e48=_e45[item].join(":");
_e46.push(_e48);
}
_e41.push(_e46.join("::"));
}
}
return _e41;
};
function getViewerSelectionContext(_e49,_e4a,_e4b){
var _e4c=_e4b==true?_e49.getAllSelectedObjectsWithUniqueCTXIDs():_e49.getAllSelectedObjects();
if(_e4c!=null&&_e4c.length>0){
for(var _e4d=0;_e4d<_e4c.length;++_e4d){
var _e4e={};
var _e4f=new CAxisSelectionIterator(_e4c[_e4d]);
if(_e4f.hasNext()){
var _e50=_e4f.next();
if(_e50.hasNext()){
var _e51=_e50.next();
var _e52=_e51.getContextId();
_e4e[_e52]=true;
var _e53=_e4a.addSelectedCell(_e51.getDataItem(),_e51.getMetadataModelItem(),_e51.getUseValue(),_e51.getUseValueType(),_e51.getDisplayValue(),_e51.getUsage(),{"queryName":_e51.getRefQuery()});
if(_e51.getHun()!=null){
_e53.addProperty("HierarchyUniqueName",_e51.getHun());
}
if(_e51.getDun()!=null){
_e53.addProperty("DimensionUniqueName",_e51.getDun());
}
while(_e50.hasNext()){
_e51=_e50.next();
_e52=_e51.getContextId();
if(typeof _e4e[_e52]=="undefined"||_e52===""){
_e4e[_e52]=true;
var _e54=_e53.addDefiningCell(_e51.getDataItem(),_e51.getMetadataModelItem(),_e51.getUseValue(),_e51.getUseValueType(),_e51.getDisplayValue(),_e51.getUsage(),{"queryName":_e51.getRefQuery()});
if(_e51.getHun()!=null){
_e54.addProperty("HierarchyUniqueName",_e51.getHun());
}
if(_e51.getDun()!=null){
_e54.addProperty("DimensionUniqueName",_e51.getDun());
}
}
}
while(_e4f.hasNext()){
_e50=_e4f.next();
var _e55=_e53;
while(_e50.hasNext()){
_e51=_e50.next();
_e52=_e51.getContextId();
if(typeof _e4e[_e52]=="undefined"||_e52===""){
_e4e[_e52]=true;
_e55=_e55.addDefiningCell(_e51.getDataItem(),_e51.getMetadataModelItem(),_e51.getUseValue(),_e51.getUseValueType(),_e51.getDisplayValue(),_e51.getUsage(),{"queryName":_e51.getRefQuery()});
if(_e51.getHun()!=null){
_e55.addProperty("HierarchyUniqueName",_e51.getHun());
}
if(_e51.getDun()!=null){
_e55.addProperty("DimensionUniqueName",_e51.getDun());
}
}
}
}
}
}
}
}
var _e56=_e4a.toString();
if(window.gViewerLogger){
window.gViewerLogger.log("Selection context",_e56,"xml");
}
return _e56;
};
function PinFreezeContainer(_e57,lid,_e59,_e5a,_e5b,_e5c,_e5d){
this.m_pinFreezeManager=_e57;
this.m_lid=lid;
this.m_lidNS=lid+_e59+_e5d;
this.m_viewerId=_e59;
this.m_freezeTop=_e5a;
this.m_freezeSide=_e5b;
this.m_cachedReportDiv=null;
this.m_cachedPFContainer=null;
this.m_cachedBaseContainer=_e5c;
this.m_containerMargin={"top":0,"left":0};
if(this.m_cachedBaseContainer&&this.m_cachedBaseContainer.style){
if(this.m_cachedBaseContainer.style.marginTop){
this.m_containerMargin.top=Number(this.m_cachedBaseContainer.style.marginTop.replace("px",""));
}
if(this.m_cachedBaseContainer.style.marginLeft){
this.m_containerMargin.left=Number(this.m_cachedBaseContainer.style.marginLeft.replace("px",""));
}
}
this.m_cachedContainerIndex=_e5d;
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
var _e5e="{";
_e5e+="\"m_clientWidth\":"+this.m_clientWidth+"";
_e5e+=",\"m_scrollableClientWidth\":"+this.m_scrollableClientWidth+"";
_e5e+=",\"m_clientHeight\":"+this.m_clientHeight+"";
_e5e+=",\"m_scrollableClientHeight\":"+this.m_scrollableClientHeight+"";
_e5e+="}";
return _e5e;
};
PinFreezeContainer.prototype.copyProperties=function(_e5f){
this.m_clientWidth=_e5f.m_clientWidth;
this.m_scrollableClientWidth=_e5f.m_scrollableClientWidth;
this.m_clientHeight=_e5f.m_clientHeight;
this.m_scrollableClientHeight=_e5f.m_scrollableClientHeight;
};
PinFreezeContainer.prototype.setViewerId=function(id){
this.m_viewerId=id;
};
PinFreezeContainer.prototype.getLid=function(){
return this.m_lid;
};
PinFreezeContainer.prototype.createPFContainer=function(_e61,_e62){
var _e63=document.createElement("temp");
if(this.m_cachedBaseContainer){
this.applyAuthoredFixedSizes(this.m_cachedBaseContainer);
this.m_cachedReportDiv=_e61;
var _e64=this.m_cachedBaseContainer.parentNode;
var _e65=this.loadTemplateHTML();
if(_e65){
_e63.innerHTML=_e65;
var _e66=this.getContainerByLID(_e63);
var _e67=this.getSectionByLID(_e63.firstChild,"pfMainOutput");
if(_e67){
var i=this.getChildPosition(_e64,this.m_cachedBaseContainer);
if(i!=-1){
var _e69=this.m_pinFreezeManager.m_oCV;
if(_e69&&_e69.envParams["freezeDefaultWrap"]){
if(this.m_cachedBaseContainer.style.whiteSpace===""&&_e69.envParams["freezeDefaultWrap"].toLowerCase()==="true"){
var _e6a=this.m_cachedBaseContainer.getElementsByTagName("span");
if(_e6a){
for(var k=0;k<_e6a.length;k++){
_e6a[k].style.whiteSpace="nowrap";
}
}
this.m_wrapFlag=true;
}
}
if(!_e62){
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
_e67.style.width=this.m_cachedBaseContainer.clientWidth+2+"px";
_e67.style.height=this.m_cachedBaseContainer.clientHeight+2+"px";
}
_e67.appendChild(this.m_cachedBaseContainer);
this.insertAt(_e64,_e66,i);
}
if(this.m_cachedBaseContainer.style.border!==""){
_e66.style.border=this.m_cachedBaseContainer.style.border;
this.m_cachedBaseContainer.style.border="";
}
}
}
}
};
PinFreezeContainer.prototype._getFixedWidth=function(_e6c){
if(_e6c&&_e6c.style.width&&!_e6c.getAttribute("authoredFixedWidth")){
var _e6d=Number(_e6c.style.width.split("px")[0]);
return isNaN(_e6d)?null:_e6d;
}
return null;
};
PinFreezeContainer.prototype._getFixedHeight=function(_e6e){
if(_e6e&&_e6e.style.height&&!_e6e.getAttribute("authoredFixedHeight")){
var _e6f=Number(_e6e.style.height.split("px")[0]);
return isNaN(_e6f)?null:_e6f;
}
return null;
};
PinFreezeContainer.prototype.applyAuthoredFixedSizes=function(_e70){
var _e71=this._getFixedWidth(_e70);
if(_e71){
this.m_fixedWidth=_e71;
this.m_clientWidth=this.m_fixedWidth;
this.m_scrollableClientWidth=this.m_fixedWidth;
}
var _e72=this._getFixedHeight(_e70);
if(_e72){
this.m_fixedHeight=_e72;
this.m_clientHeight=this.m_fixedHeight;
this.m_scrollableClientHeight=this.m_fixedHeight;
}
};
PinFreezeContainer.prototype.loadFreezeBothTemplateHTML=function(){
var _e73="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\">"+"<tr class=\"BUXNoPrint\" templatePart=\"freezeTop\"><td align=\"center\" templatePart=\"freezeSide\"><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfHomeCell_"+this.m_lidNS+"\" style=\"overflow-x:hidden; overflow-y:hidden; width:100%; height:100%\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfTopHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td><td templatePart=\"freezeTop\"></td></tr>"+"<tr><td class=\"BUXNoPrint\" valign=top templatePart=\"freezeSide\"><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfSideHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\">"+"</div></td>"+"<td class=\"BUXNoPrint\" templatePart=\"freezeTop\">"+"<div style=\"padding-right:1px;overflow-x:hidden; overflow-y:scroll;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfVerticalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchVScroll()\">"+"<div style=\"padding-right:1px;\"/>"+"</div>"+"</td>"+"</tr>"+"<tr class=\"BUXNoPrint\" templatePart=\"freezeSide\"><td></td><td>"+"<div style=\"overflow-x:scroll; overflow-y:hidden;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfHorizontalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchScroll()\">"+"<div style=\"height:2px;\">&nbsp;</div>"+"</div>"+"</td><td></td></tr></table>";
return _e73;
};
PinFreezeContainer.prototype.loadFreezeSideTemplateHTML=function(){
var _e74="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\"><tr>"+"<td class=\"BUXNoPrint\" valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfSideHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\">"+"</div></td>"+"</tr>"+"<tr class=\"BUXNoPrint\"><td></td><td>"+"<div style=\"overflow-x:scroll; overflow-y:hidden;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfHorizontalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchScroll()\">"+"<div style=\"height:2px;\">&nbsp;</div>"+"</div>"+"</td></tr></table>";
return _e74;
};
PinFreezeContainer.prototype.loadFreezeTopTemplateHTML=function(){
var _e75="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\">"+"<tr class=\"BUXNoPrint\"><td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfTopHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td><td></td></tr>"+"<tr><td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"></div></td>"+"<td class=\"BUXNoPrint\">"+"<div style=\"padding-right:1px;overflow-x:hidden; overflow-y:scroll;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfVerticalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchVScroll()\">"+"<div style=\"padding-right:1px;\"/>"+"</div>"+"</td>"+"</tr></table>";
return _e75;
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
PinFreezeContainer.prototype.createSideHeadings=function(_e76){
var _e77=this.getSection("pfMainOutput");
var _e78=_e77.getAttribute("pfslid");
var _e79=this.getSection("pfSideHeadings");
var _e7a=_e79.getAttribute("pfslid");
var _e7b=this.getMainOutputHomeCell();
if(!_e7b){
return;
}
var _e7c=_e76;
var _e7d=_e79;
var _e7e=this.isA11yEnabled(_e7c);
var _e7f=this.m_pinFreezeManager.deepCloneNode(_e7c);
_e7d.appendChild(_e7f);
var _e80=this.getSectionHomeCell(_e79);
if(!_e80){
return;
}
var _e81=_e7c.getElementsByTagName("tbody");
var _e82=_e7f.getElementsByTagName("tbody");
if(_e81.length>0&&_e82.length>0){
var _e83=_e81[0];
var _e84=_e82[0];
var _e85=_e83.firstChild;
var _e86=_e84.firstChild;
var _e87=_e7b.rowSpan;
this.markAsCopy(_e7b,_e80,_e78,_e7a);
for(var r=0;r<_e87;++r){
var _e89=_e84.rows[r];
this.removeCTX(_e89);
}
for(var r=_e87;r<_e84.rows.length;++r){
var _e8a=_e83.rows[r];
var _e89=_e84.rows[r];
_e89.style.visibility="hidden";
for(var c=0;c<_e89.cells.length;++c){
var _e8c=_e89.cells[c];
if(_e7e){
_e8c=this.m_pinFreezeManager.removeIdAttribute(_e8c);
}
if(_e8c.getAttribute("type")=="datavalue"){
_e8c.removeAttribute("ctx");
_e8c.removeAttribute("uid");
_e8c.removeAttribute("name");
}else{
var _e8d=_e8a.cells[c];
this.markAsCopy(_e8d,_e8c,_e78,_e7a);
}
}
_e89.style.visibility="visible";
}
}
};
PinFreezeContainer.prototype.applyNeighbouringBorderStylesToHomeCell=function(_e8e,_e8f){
if(isFF()||isIE()){
if(_e8e&&_e8e.length&&_e8e[0].cells&&_e8e[0].cells.length>1){
if(this.m_freezeSide){
var _e90=this.getBorderInfo(_e8e[0].cells[1],"right");
if(_e90){
_e8f.style.borderRightWidth=_e90.borderRightWidth;
_e8f.style.borderRightStyle=_e90.borderRightStyle;
_e8f.style.borderRightColor=_e90.borderRightColor;
}
}
if(this.m_freezeTop){
var _e90=this.getBorderInfo(_e8e[0].cells[1],"bottom");
if(_e90){
_e8f.style.borderBottomWidth=_e90.borderBottomWidth;
_e8f.style.borderBottomStyle=_e90.borderBottomStyle;
_e8f.style.borderBottomColor=_e90.borderBottomColor;
}
}
}
}
};
PinFreezeContainer.prototype.createTopHeadings=function(_e91){
var _e92=this.getSection("pfMainOutput");
var _e93=_e92.getAttribute("pfslid");
var _e94=this.getSection("pfTopHeadings");
var _e95=_e94.getAttribute("pfslid");
var _e96=this.getMainOutputHomeCell();
if(!_e96){
return;
}
var _e97=_e91;
var _e98=_e94;
var _e99=this.isA11yEnabled(_e97);
var _e9a=this.m_pinFreezeManager.deepCloneNode(_e97);
_e9a.setAttribute("clonednode","true");
_e98.appendChild(_e9a);
var _e9b=_e97.getElementsByTagName("tbody");
var _e9c=_e9a.getElementsByTagName("tbody");
if(_e9b.length>0&&_e9c.length>0){
var _e9d=_e9b[0];
var _e9e=_e9c[0];
var _e9f=_e96.rowSpan;
for(var r=0;r<_e9e.rows.length;++r){
var _ea1=_e9d.rows[r];
var _ea2=_e9e.rows[r];
if(_e99){
_ea2=this.m_pinFreezeManager.removeIdAttribute(_ea2);
}
_ea2.style.visibility="hidden";
for(var c=0;c<_ea2.cells.length;++c){
var _ea4=_ea2.cells[c];
if(r>_e9f||_ea4.getAttribute("type")=="datavalue"){
_ea4.removeAttribute("ctx");
_ea4.removeAttribute("uid");
_ea4.removeAttribute("name");
}else{
var _ea5=_ea1.cells[c];
this.markAsCopy(_ea5,_ea4,_e93,_e95);
if(_ea5===_e96){
this.initializeHomeCellTabIndex(_ea4);
this.applyNeighbouringBorderStylesToHomeCell(_e9d.rows,_ea4);
}
}
}
_ea2.style.visibility="visible";
}
}
};
PinFreezeContainer.prototype.createHomeCellHeading=function(){
var _ea6=this.getSection("pfMainOutput");
var _ea7=_ea6.getAttribute("pfslid");
var _ea8=this.getSection("pfHomeCell");
var _ea9=_ea8.parentNode;
var _eaa=_ea8.getAttribute("pfslid");
var _eab=this.getMainOutputHomeCell();
if(!_eab){
return;
}
_ea9.style.height="100%";
var _eac=this.getTopHeadingSectionHeight(_eab);
_ea8.style.height=_eac-this.m_containerMargin.top+"px";
_ea8.style.width=this.getSideHeadingSectionWidth(_eab)-this.m_containerMargin.left+"px";
_ea8.style.marginTop=this.m_containerMargin.top+"px";
_ea8.style.marginLeft=this.m_containerMargin.left+"px";
var _ead=_eab.parentNode;
var _eae=_ead.cloneNode(false);
var _eaf=this._findBestGuessHomeCell(_eab);
var _eb0=document.createElement("div");
_eb0.style.width="100%";
_eb0.style.height="100%";
while(_eab.offsetLeft<=_eaf.offsetLeft){
oTargetHomeCell=this.m_pinFreezeManager.deepCloneNode(_eab);
if(isFF()||isIE()){
_eab.appendChild(_eb0);
oTargetHomeCell.style.width=_eb0.clientWidth+"px";
_eab.removeChild(_eb0);
}else{
oTargetHomeCell.style.width=_eab.clientWidth+1+"px";
}
oTargetHomeCell.style.borderBottomWidth="0px";
_eae.appendChild(oTargetHomeCell);
this.markAsCopy(_eab,oTargetHomeCell,_ea7,_eaa);
if(_eab.nextSibling){
_eab=_eab.nextSibling;
}else{
break;
}
}
if(oTargetHomeCell){
oTargetHomeCell.style.borderRightWidth="0px";
}
var _eb1=_ead.parentNode;
var _eb2=_eb1.cloneNode(false);
_eb2.appendChild(_eae);
var _eb3=_eb1.parentNode;
var _eb4=_eb3.cloneNode(false);
_eb4.appendChild(_eb2);
_eb4.style.width="100%";
_eb4.style.height="100%";
_eb4.style.marginLeft="";
_eb4.style.marginTop="";
_ea8.appendChild(_eb4);
this.initializeHomeCellTabIndex(oTargetHomeCell);
this.applyNeighbouringBorderStylesToHomeCell(_ea6.firstChild.rows,_ea8);
};
PinFreezeContainer.prototype.markAsCopy=function(main,copy,_eb7,_eb8){
if(!main.pfCopy){
main.setAttribute("pfslid",_eb7);
main.pfCopy=[];
}
main.pfCopy.push(copy);
copy.pfMain=main;
copy.setAttribute("pfslid",_eb8);
};
PinFreezeContainer.prototype.getCopy=function(_eb9){
if(_eb9.pfCopy){
var _eba={};
for(var i in _eb9.pfCopy){
var copy=_eb9.pfCopy[i];
if(copy.getAttribute){
var _ebd=copy.getAttribute("pfslid");
if(_ebd){
var _ebe=PinFreezeContainer.getSectionNameFromSlid(_ebd);
var _ebf=this.getSection(_ebe);
if(_ebf&&PinFreezeContainer.isSectionVisible(_ebf)){
_eba[_ebe]=copy;
}
}
}
}
if(_eba["pfHomeCell"]){
return _eba["pfHomeCell"];
}
for(i in _eba){
return _eba[i];
}
}
return null;
};
PinFreezeContainer.prototype.getMain=function(_ec0){
if(_ec0.pfMain){
return _ec0.pfMain;
}
return null;
};
PinFreezeContainer.isSectionVisible=function(_ec1){
var node=_ec1;
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
var _ec3={isSideFrozen:false,isTopFrozen:false};
if(this.m_freezeSide){
var side=this.getSection("pfSideHeadings");
if(side){
_ec3.isSideFrozen=PinFreezeContainer.isSectionVisible(side);
}
}
if(this.m_freezeTop){
var top=this.getSection("pfTopHeadings");
if(top){
_ec3.isTopFrozen=PinFreezeContainer.isSectionVisible(top);
}
}
return _ec3;
};
PinFreezeContainer.prototype.checkSectionStructureChange=function(_ec6,_ec7){
if(_ec6.isSideFrozen!==_ec7.isSideFrozen||_ec6.isTopFrozen!==_ec7.isTopFrozen){
this.m_pinFreezeManager.sectionStructureChange();
}
};
PinFreezeContainer.prototype.freezeContainerInReport=function(_ec8){
this.cacheContainerAndSections(this.getContainerByLID(_ec8));
this.m_homeCellNodes={};
this.updateContainer();
};
PinFreezeContainer.prototype.frozenSectionsRequired=function(){
return (this.frozenSideHeadingsRequired()||this.frozenTopHeadingsRequired());
};
PinFreezeContainer.prototype.frozenSideHeadingsRequired=function(){
var _ec9=this.getSection("pfMainOutput");
if(_ec9){
if(this.m_freezeSide){
var _eca=_ec9.scrollWidth;
return ((this.m_clientWidth<_eca)||_eca==0);
}
}
return false;
};
PinFreezeContainer.prototype.frozenTopHeadingsRequired=function(){
var _ecb=this.getSection("pfMainOutput");
if(_ecb){
if(this.m_freezeTop){
var _ecc=_ecb.scrollHeight;
return ((this.m_clientHeight<_ecc)||_ecc==0);
}
}
return false;
};
PinFreezeContainer.prototype.showTemplatePart=function(_ecd,_ece){
var _ecf=this.getContainer().rows;
for(var r=0;r<_ecf.length;++r){
if(_ecf[r].getAttribute("templatePart")===_ecd){
_ecf[r].style.display=((_ece)?"":"none");
}else{
var _ed1=_ecf[r].cells;
for(var c=0;c<_ed1.length;++c){
if(_ed1[c].getAttribute("templatePart")===_ecd){
_ed1[c].style.display=((_ece)?"":"none");
}
}
}
}
};
PinFreezeContainer.prototype.showFreezeTopOnly=function(_ed3){
if(!(this.m_freezeTop&&this.m_freezeSide)){
return;
}
var _ed4=(_ed3.scrollWidth==0)?_ed3.clientWidth:_ed3.scrollWidth;
this.updateMainOutputWidth(_ed4);
this.setScrollX(_ed3,0);
if(this.getSection("pfTopHeadings")){
this.getSection("pfTopHeadings").style.width=_ed4+"px";
this.setScrollX(this.getSection("pfTopHeadings"),0);
}
this.showTemplatePart("freezeSide",false);
};
PinFreezeContainer.prototype.showFreezeSideOnly=function(_ed5){
if(!(this.m_freezeTop&&this.m_freezeSide)){
return;
}
var _ed6=(_ed5.scrollHeight==0)?_ed5.clientHeight:_ed5.scrollHeight;
this.updateMainOutputHeight(_ed6);
this.setScrollY(_ed5,0);
if(this.getSection("pfSideHeadings")){
this.getSection("pfSideHeadings").style.height=_ed6+"px";
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
PinFreezeContainer.prototype.showMainOutputOnly=function(_ed7){
this.updateMainOutputWidth((_ed7.scrollWidth==0)?_ed7.clientWidth:_ed7.scrollWidth);
this.updateMainOutputHeight((_ed7.scrollHeight==0)?_ed7.clientHeight:_ed7.scrollHeight);
this.setInitialScrollPosition(_ed7,0,0);
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
PinFreezeContainer.prototype.headingsCreated=function(_ed9){
return _ed9.firstChild?true:false;
};
PinFreezeContainer.prototype.updateContainer=function(){
var _eda=this.getSection("pfMainOutput");
var _edb=this.getMainOutputHomeCell();
if(_edb){
if(this.m_scrollableClientHeight===this.m_clientHeight||!this.m_scrollableClientHeight){
this.m_scrollableClientHeight-=_edb.offsetHeight;
var _edc=this.calculateMinCrossTabScrollableClientHeight();
if(_edc>this.m_scrollableClientHeight){
this.m_scrollableClientHeight=_edc;
}
}
if(this.m_scrollableClientWidth===this.m_clientWidth||!this.m_scrollableClientWidth){
this.m_scrollableClientWidth-=this.getHomeCellOffsetWidth(_edb);
}
}
if(_eda&&_edb){
this.showAll();
if(this.frozenSectionsRequired()){
this.updateMainOutputSize();
this.initializeHomeCellTabIndex(_edb);
if(this.m_freezeSide){
var _edd=this.getSection("pfSideHeadings");
if(!this.headingsCreated(_edd)){
this.createSideHeadings(this.m_cachedBaseContainer);
if(this.m_freezeTop){
this.initializeTouchScrolling(_edd);
}
}
var _ede=this.getSection("pfHorizontalScrollBar");
_ede.scrollLeft="0px";
}
if(this.m_freezeTop){
var _edf=this.getSection("pfTopHeadings");
if(!this.headingsCreated(_edf)){
this.createTopHeadings(this.m_cachedBaseContainer);
if(this.m_freezeSide){
this.initializeTouchScrolling(_edf);
}
}
var _ee0=this.getSection("pfVerticalScrollBar");
_ee0.scrollTop="0px";
}
if(this.m_freezeSide&&this.m_freezeTop){
var _ee1=this.getSection("pfHomeCell");
if(!this.headingsCreated(_ee1)){
this.createHomeCellHeading();
}
_ee1.style.display="";
}
var _ee2=this.updateSideHeadingSize(_edb);
var _ee3=this.updateTopHeadingSize(_edb);
if(!this.frozenSectionsRequired()){
this.showMainOutputOnly(_eda);
}
this.setInitialScrollPosition(_eda,_ee2,_ee3);
if(this.m_freezeTop&&this.m_freezeSide){
this.setInitialScrollPosition(this.getSection("pfSideHeadings"),0,_ee3);
this.setInitialScrollPosition(this.getSection("pfTopHeadings"),_ee2,0);
}
this.initializeTouchScrolling(_eda);
}else{
this.showMainOutputOnly(_eda);
this.removeTouchScrolling();
}
this.updateTabIndexValues();
}
};
PinFreezeContainer.prototype.calculateMinCrossTabScrollableClientHeight=function(){
var _ee4=0;
if(this.m_cachedPFContainer){
var _ee5=this.getElementByLID(this.m_cachedPFContainer,"table",this.m_lid+this.m_viewerId);
if(_ee5){
var _ee6=0;
for(var r=0;r<_ee5.rows.length;r++){
var row=_ee5.rows[r];
for(var c=0;c<row.cells.length;c++){
var cell=row.cells[c];
if(cell.getAttribute("type")=="datavalue"){
_ee6++;
if(cell.childNodes.length===1&&cell.childNodes[0].getAttribute&&cell.childNodes[0].getAttribute("class")==="textItem"){
_ee4=_ee4+cell.offsetHeight;
}else{
_ee6++;
var _eeb=this.getSection("pfVerticalScrollBar");
if(_eeb){
_ee4=_eeb.offsetWidth*2;
}
}
break;
}
}
if(_ee6>=2){
break;
}
}
}
}
return _ee4;
};
PinFreezeContainer.prototype.updateSideHeadingSize=function(_eec){
var _eed=0;
if(this.m_freezeSide){
var _eee=this.getSection("pfMainOutput");
if(!_eee){
return 0;
}
if(!this.frozenSideHeadingsRequired()){
this.showFreezeTopOnly(_eee);
return 0;
}
var _eef=this.getSection("pfSideHeadings");
_eed=this.getSideHeadingSectionWidth(_eec);
var _ef0=this.getSection("pfHorizontalScrollBar");
var _ef1=this.getSectionHomeCell(_eef);
if(_eef.style.display=="none"){
_eef.style.display="";
_ef0.style.display="";
}
_eef.style.width=_eed+"px";
_eef.style.height=_eee.clientHeight+"px";
}
return _eed;
};
PinFreezeContainer.prototype.updateTopHeadingSize=function(_ef2){
var _ef3=0;
if(this.m_freezeTop){
var _ef4=this.getSection("pfMainOutput");
if(!_ef4){
return 0;
}
if(!this.frozenTopHeadingsRequired()){
this.showFreezeSideOnly(_ef4);
return 0;
}
var _ef5=this.getSection("pfTopHeadings");
_ef3=this.getTopHeadingSectionHeight(_ef2);
var _ef6=this.getSection("pfVerticalScrollBar");
var _ef7=this.getSectionHomeCell(_ef5);
if(_ef5.style.display=="none"){
_ef5.style.display="";
_ef6.style.display="";
}
_ef5.style.height=_ef3+"px";
_ef5.style.width=_ef4.clientWidth+"px";
}
return _ef3;
};
PinFreezeContainer.prototype.setScrollX=function(_ef8,_ef9){
if(getElementDirection(_ef8)==="rtl"){
setScrollRight(_ef8,_ef9);
}else{
setScrollLeft(_ef8,_ef9);
}
};
PinFreezeContainer.prototype.setScrollY=function(_efa,_efb){
_efa.scrollTop=_efb;
};
PinFreezeContainer.prototype.setInitialScrollPosition=function(_efc,_efd,_efe){
if(getElementDirection(_efc)==="rtl"){
setScrollRight(_efc,_efd);
}else{
setScrollLeft(_efc,_efd);
}
_efc.scrollTop=_efe;
};
PinFreezeContainer.prototype.getScrollableClientWidth=function(){
return this.m_scrollableClientWidth;
};
PinFreezeContainer.prototype.setScrollableClientWidth=function(_eff){
this.m_scrollableClientWidth=_eff;
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
PinFreezeContainer.prototype.setScrollableClientHeight=function(_f00){
this.m_scrollableClientHeight=_f00;
};
PinFreezeContainer.prototype.getClientHeight=function(){
return this.m_clientHeight;
};
PinFreezeContainer.prototype.clientHeight=function(_f01){
return _f01.clientHeight;
};
PinFreezeContainer.prototype.findBestContainerHeight=function(_f02){
if(this.m_freezeTop&&this.m_cachedReportDiv){
var _f03=this.m_cachedReportDiv.parentNode;
if(_f03){
var _f04=this._findRestOfPageHeight(this.getContainer());
return _f02-_f04-(this.c_pageMargin/2)-this.m_containerMargin.top;
}
}
return _f02-this.c_pageMargin;
};
PinFreezeContainer.prototype.findBestContainerWidth=function(_f05){
var node=this.getContainer();
while(node&&node.nodeName.toLowerCase()!="td"&&node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
node=node.parentNode;
}
if(!node){
return -1;
}
if(node.nodeName.toLowerCase()=="td"){
var _f07=0;
var _f08=node.parentNode.childNodes;
for(var i=0;i<_f08.length;i++){
if(_f08[i]!==node){
_f07+=_f08[i].clientWidth;
}
}
return _f05-_f07-(this.c_pageMargin/2);
}
return _f05;
};
PinFreezeContainer.prototype._findRestOfPageHeight=function(node){
var _f0b=0;
var _f0c=node.parentNode;
if(!_f0c){
return _f0b;
}
if(_f0c.childNodes.length>1){
for(var i=0;i<_f0c.childNodes.length;i++){
var _f0e=_f0c.childNodes[i];
if(_f0e!=node&&!isNaN(_f0e.clientHeight)&&_f0e.style.display!="none"){
_f0b+=this.clientHeight(_f0e);
}
}
}
if(node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
_f0b+=this._findRestOfPageHeight(_f0c);
}
return _f0b;
};
PinFreezeContainer.prototype.resize=function(_f0f,_f10,_f11,_f12){
if(this.m_fixedWidth&&this.m_fixedHeight){
return;
}
_f0f=(this.m_fixedWidth)?this.m_fixedWidth:_f0f;
_f10=(this.m_fixedHeight)?this.m_fixedHeight:_f10;
var _f13=this.getSectionStructure();
if(this.m_sectionCache&&this.m_cachedPFContainer){
var _f14=0;
if(_f10!==0){
_f14=this.findBestContainerHeight(_f10);
if(_f11&&_f14<300){
_f14=300;
}else{
if(_f14<100){
_f14=100;
}
}
}
this.m_clientHeight=_f14>0?_f14:this.m_clientHeight;
var _f15=0;
if(_f0f!==0){
_f15=this.findBestContainerWidth(_f0f);
}
this.m_clientWidth=(_f15>0)?_f15-5-(this.c_pageMargin/2):this.m_clientWidth;
var _f16=this.getSection("pfMainOutput");
var _f17=this.getSectionHomeCell(_f16);
if(_f17){
this.m_scrollableClientWidth=this.m_clientWidth-this.getSideHeadingSectionWidth(_f17);
this.m_scrollableClientHeight=this.m_clientHeight-_f17.offsetHeight;
}
if(_f12){
var _f18=getElementsByAttribute(this.m_cachedPFContainer,"div","pflid",_f12.lid);
if(_f18){
var node=_f18[0];
while(node.nodeName.toLowerCase()!="table"){
node=node.parentNode;
}
node.style.width=_f12.width+"px";
}
}
this.updateContainer();
}else{
this.m_clientWidth=_f0f-this.c_pageMargin;
this.m_clientHeight=_f10-this.c_pageMargin;
}
var _f1a=this.getSectionStructure();
this.checkSectionStructureChange(_f13,_f1a);
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
PinFreezeContainer.prototype.updateMainOutputWidth=function(_f1b){
var _f1c=this.getSection("pfMainOutput");
if(!_f1c){
return;
}
if(this.m_freezeSide==true){
_f1c.style.width=(_f1b+"px");
if(this.m_freezeTop==false||!this.frozenTopHeadingsRequired()){
_f1c.style.height=_f1c.firstChild.clientHeight+"px";
}
var _f1d=this.getSection("pfHorizontalScrollBar");
if(_f1d){
_f1d.style.width=(_f1b+"px");
var _f1e=_f1d.firstChild;
if(_f1e){
var _f1f=this.getSectionHomeCell(_f1c);
var _f20=_f1c.scrollWidth-this.getHomeCellOffsetWidth(_f1f);
_f1e.style.width=_f20+"px";
}
}
}
};
PinFreezeContainer.prototype.updateMainOutputHeight=function(_f21){
var _f22=this.getSection("pfMainOutput");
if(!_f22){
return;
}
_f22.style.height=(_f21+"px");
if(!this.m_freezeSide||!this.frozenSideHeadingsRequired()){
_f22.style.width=_f22.firstChild.clientWidth+2+"px";
}
var _f23=this.getSection("pfVerticalScrollBar");
if(_f23){
_f23.style.height=(_f21+"px");
var _f24=_f23.firstChild;
if(_f24){
var _f25=this.getSectionHomeCell(_f22);
var _f26=_f22.scrollHeight-_f25.offsetHeight;
_f24.style.height=_f26+"px";
}
}
};
PinFreezeContainer.prototype.getElementByLID=function(_f27,tag,lid){
var _f2a=getElementsByAttribute(_f27,tag,"lid",lid);
if(_f2a.length>0){
return _f2a[0];
}
return null;
};
PinFreezeContainer.prototype.getContainerByLID=function(_f2b){
var _f2c=getElementsByAttribute(_f2b,"table","pfclid","pfContainer_"+this.m_lidNS);
if(_f2c.length>0){
return _f2c[0];
}
return null;
};
PinFreezeContainer.prototype.getSectionByLID=function(_f2d,_f2e){
var _f2f=getElementsByAttribute(_f2d,"div","pfslid",_f2e+"_"+this.m_lidNS);
if(_f2f.length>0){
return _f2f[0];
}
return null;
};
PinFreezeContainer.getSectionNameFromSlid=function(slid){
return slid?slid.split("_")[0]:null;
};
PinFreezeContainer.getLidFromSlid=function(slid){
return slid.split("_")[1];
};
PinFreezeContainer.nodeToSlid=function(_f32){
while(_f32.parentNode&&!_f32.getAttribute("pfslid")){
_f32=_f32.parentNode;
}
if(_f32.getAttribute){
return _f32.getAttribute("pfslid");
}
return null;
};
PinFreezeContainer.prototype.cacheContainerAndSections=function(_f33){
if(!_f33){
return _f33;
}
this.m_cachedPFContainer=_f33;
var _f34=getElementsByAttribute(this.m_cachedPFContainer,"div","pflid",this.m_lidNS);
this.m_sectionCache={};
for(var i=0;i<_f34.length;++i){
var key=_f34[i].getAttribute("pfslid");
key=key.split("_",1);
this.m_sectionCache[key]=_f34[i];
}
return _f33;
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
PinFreezeContainer.prototype.initializeHomeCellTabIndex=function(_f38){
var slid=PinFreezeContainer.nodeToSlid(_f38);
if(!this.m_homeCellNodes[slid]){
var _f3a=getElementsByAttribute(_f38,"*","tabIndex","*");
for(var i in _f3a){
if(!_f3a[i].getAttribute("widgetid")){
this.m_homeCellNodes[slid]=_f3a[i];
break;
}
}
}
};
PinFreezeContainer.prototype.updateTabIndexValues=function(){
if(this.isContainerFrozen()){
for(var slid in this.m_homeCellNodes){
var _f3d=this.m_pinFreezeManager.isNodeVisible(this.m_homeCellNodes[slid])?"0":"-1";
this.m_homeCellNodes[slid].setAttribute("tabIndex",_f3d);
}
}else{
for(var slid in this.m_homeCellNodes){
var _f3d=(PinFreezeContainer.getSectionNameFromSlid(slid)==="pfMainOutput")?"0":"-1";
this.m_homeCellNodes[slid].setAttribute("tabIndex",_f3d);
}
}
};
PinFreezeContainer.prototype.getSectionHomeCell=function(_f3e){
if(_f3e){
var _f3f=this.getElementByLID(_f3e,"table",this.m_lid+this.m_viewerId);
if(_f3f&&_f3f.rows.length&&_f3f.rows[0].cells.length){
return _f3f.rows[0].cells[0];
}
}
return null;
};
PinFreezeContainer.prototype.getMainOutputHomeCell=function(){
var _f40=this.getSection("pfMainOutput");
if(!_f40){
_f40=this.getSectionByLID(this.m_cachedPFContainer,"pfMainOutput");
}
return this.getSectionHomeCell(_f40);
};
PinFreezeContainer.prototype.getChildPosition=function(_f41,_f42){
for(var i=0;i<_f41.childNodes.length;++i){
if(_f41.childNodes[i]==_f42){
return i;
}
}
return -1;
};
PinFreezeContainer.prototype.insertAt=function(_f44,_f45,_f46){
if(_f46==_f44.childNodes.length){
_f44.appendChild(_f45);
}else{
_f44.insertBefore(_f45,_f44.childNodes[_f46]);
}
};
PinFreezeContainer.prototype.synchScroll=function(){
if(!this.m_cachedPFContainer){
return;
}
var _f47=this.getMainOutputHomeCell();
var _f48=this.getSection("pfMainOutput");
var _f49=this.getSection("pfSideHeadings");
if(_f49!=null){
var _f4a=this.getSection("pfHorizontalScrollBar");
if(_f4a){
var _f4b=this.getSideHeadingSectionWidth(_f47);
if(getElementDirection(_f48)==="rtl"){
_f4b=0;
}
setScrollLeft(_f48,getScrollLeft(_f4a)+_f4b);
if(this.m_freezeTop){
setScrollLeft(this.getSection("pfTopHeadings"),getScrollLeft(_f4a)+_f4b);
}
}
}
};
PinFreezeContainer.prototype.updateScroll=function(_f4c){
var slid=PinFreezeContainer.nodeToSlid(_f4c);
if(!slid){
return;
}
var _f4e=PinFreezeContainer.getSectionNameFromSlid(slid);
if(!_f4e){
return;
}
var _f4f=document.getElementById("CVReport"+this.m_viewerId);
if(!_f4f){
return;
}
if(!this.m_cachedPFContainer){
return;
}
var _f50=_f4c.parentNode;
if(_f50){
var _f51=_f50.tagName.toLowerCase();
if(_f51==="td"||_f51==="th"){
var _f52=this.getMainOutputHomeCell();
var _f53=this.getSection("pfMainOutput");
if(_f4e==="pfMainOutput"||_f4e==="pfTopHeadings"){
var _f54=this.getSection("pfHorizontalScrollBar");
if(_f54){
var _f55=PinFreezeContainer.calculateNewPosition(_f50.offsetLeft,_f50.offsetWidth,getScrollLeft(_f53),_f53.offsetWidth);
var _f56=this.getHomeCellOffsetWidth(_f52);
if(getElementDirection(_f53)==="rtl"){
_f56=0;
}
setScrollLeft(_f54,_f55-_f56);
setScrollLeft(_f53,_f55);
}
}
if(_f4e==="pfMainOutput"||_f4e==="pfSideHeadings"){
var _f57=this.getSection("pfVerticalScrollBar");
if(_f57){
var _f58=PinFreezeContainer.calculateNewPosition(_f50.offsetTop,_f50.offsetHeight,_f53.scrollTop,_f53.offsetHeight);
_f57.scrollTop=_f58-_f52.offsetHeight;
_f53.scrollTop=_f58;
}
}
}
}
};
PinFreezeContainer.calculateNewPosition=function(_f59,_f5a,_f5b,_f5c){
var _f5d=_f59+_f5a;
var _f5e=_f5b+_f5c;
if(_f5b>_f59){
return _f59;
}else{
if(_f5e<_f5d){
if(_f5a>_f5c){
return _f59;
}
return _f5d-_f5c;
}
}
return _f5b;
};
PinFreezeContainer.prototype.synchVScroll=function(){
if(!this.m_cachedPFContainer){
return;
}
var _f5f=this.getMainOutputHomeCell();
var _f60=this.getSection("pfMainOutput");
var _f61=this.getSection("pfTopHeadings");
if(_f61!=null){
var _f62=this.getSection("pfVerticalScrollBar");
if(_f62){
_f60.scrollTop=_f62.scrollTop+this.getTopHeadingSectionHeight(_f5f);
if(this.m_freezeSide){
this.getSection("pfSideHeadings").scrollTop=_f62.scrollTop+this.getTopHeadingSectionHeight(_f5f);
}
}
}
};
PinFreezeContainer.prototype.getTopHeadingSectionHeight=function(_f63){
return _f63.offsetHeight+_f63.offsetTop+this.m_containerMargin.top;
};
PinFreezeContainer.prototype._findBestGuessHomeCell=function(_f64){
if(this.m_bestGuessHomeCell){
return this.m_bestGuessHomeCell;
}
if(_f64){
var _f65=_f64.parentNode.parentNode;
var _f66=_f64.rowSpan?(_f64.rowSpan):1;
var tr=_f65.childNodes[_f66];
if(tr){
var _f68=tr.childNodes.length;
var _f69=null;
var td=null;
for(var i=0;i<_f68;i++){
td=tr.childNodes[i];
if(td.getAttribute("type")=="datavalue"){
break;
}
_f69=td;
}
if(_f69){
this.m_bestGuessHomeCell=_f69;
return this.m_bestGuessHomeCell;
}
}else{
return _f64;
}
}
return null;
};
PinFreezeContainer.prototype.getHomeCellOffsetWidth=function(_f6c){
var _f6d=this._findBestGuessHomeCell(_f6c);
return _f6d?_f6d.offsetWidth:0;
};
PinFreezeContainer.prototype.getSideHeadingSectionWidth=function(_f6e){
var _f6f=this._findBestGuessHomeCell(_f6e);
if(_f6f){
return _f6f.offsetWidth+_f6f.offsetLeft+this.m_containerMargin.left;
}else{
return _f6e.offsetWidth+_f6e.offsetLeft;
}
};
PinFreezeContainer.prototype.isContainerFrozen=function(){
return (this.m_freezeTop||this.m_freezeSide);
};
PinFreezeContainer.prototype.unfreeze=function(_f70){
var _f71=this.getContainerByLID(_f70);
this.m_freezeTop=false;
this.m_freezeSide=false;
if(_f71){
var _f72=_f71.parentNode;
pfMainOutput=this.getSectionByLID(_f71,"pfMainOutput");
if(pfMainOutput&&_f72){
if(_f71.style.border!==""){
pfMainOutput.firstChild.style.border=_f71.style.border;
_f71.style.border="";
}
if(this.m_wrapFlag){
var _f73=pfMainOutput.firstChild.getElementsByTagName("span");
if(_f73){
for(var k=0;k<_f73.length;k++){
_f73[k].style.whiteSpace="";
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
_f72.replaceChild(this.m_pinFreezeManager.deepCloneNode(pfMainOutput.firstChild),_f71);
}
}
};
PinFreezeContainer.prototype.getBorderInfo=function(el,_f76){
var _f77={};
var _f78="border-"+_f76+"-";
var _f79="border"+_f76.charAt(0).toUpperCase()+_f76.substring(1);
if(el.currentStyle){
_f77[_f79+"Width"]=el.currentStyle[_f79+"Width"];
_f77[_f79+"Style"]=el.currentStyle[_f79+"Style"];
_f77[_f79+"Color"]=el.currentStyle[_f79+"Color"];
}else{
if(window.getComputedStyle){
_f77[_f79+"Width"]=window.getComputedStyle(el,null).getPropertyValue(_f78+"width");
_f77[_f79+"Style"]=window.getComputedStyle(el,null).getPropertyValue(_f78+"style");
_f77[_f79+"Color"]=window.getComputedStyle(el,null).getPropertyValue(_f78+"color");
}else{
return null;
}
}
return _f77;
};
PinFreezeContainer.prototype.isA11yEnabled=function(_f7a){
return (_f7a.getAttribute("role")==="grid");
};
PinFreezeContainer.isElementInMainOutput=function(_f7b){
var _f7c=PinFreezeContainer.nodeToSlid(_f7b);
if(_f7c){
return (_f7c.indexOf("pfMainOutput_")===0);
}
return false;
};
PinFreezeContainer.prototype.removeCTX=function(_f7d){
_f7d.removeAttribute("ctx");
var _f7e=getElementsByAttribute(_f7d,"*","ctx","*");
if(_f7e&&_f7e.length){
for(var i=0;i<_f7e.length;i++){
_f7e[i].removeAttribute("ctx");
}
}
};
PinFreezeContainer.prototype.initializeTouchScrolling=function(_f80){
if(!this.m_pinFreezeManager.isIWidgetMobile()){
return;
}
if(_f80){
_f80.m_pinFreezeContainer=this;
if(document.attachEvent){
_f80.attachEvent("touchstart",this.touchStart);
_f80.attachEvent("touchmove",this.touchMove);
_f80.attachEvent("touchend",this.touchEnd);
}else{
_f80.addEventListener("touchstart",this.touchStart,false);
_f80.addEventListener("touchmove",this.touchMove,false);
_f80.addEventListener("touchend",this.touchEnd,false);
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
PinFreezeContainer.prototype.removeTouchScrollingEvents=function(_f81){
if(!this.m_pinFreezeManager.isIWidgetMobile()){
return;
}
if(_f81){
if(document.detachEvent){
_f81.detachEvent("touchstart",this.touchStart);
_f81.detachEvent("touchmove",this.touchMove);
_f81.detachEvent("touchend",this.touchEnd);
}else{
_f81.removeEventListener("touchstart",this.touchStart,false);
_f81.removeEventListener("touchmove",this.touchMove,false);
_f81.removeEventListener("touchend",this.touchEnd,false);
}
}
};
PinFreezeContainer.prototype.touchMove=function(e){
if(this.m_pinFreezeContainer&&e&&e.changedTouches&&e.touches&&e.touches.length==1){
var _f83=e.changedTouches[0];
if(_f83&&_f83.clientX&&_f83.clientY){
var _f84=parseInt(_f83.clientX);
var _f85=parseInt(_f83.clientY);
if(this.m_pinFreezeContainer.touchMoveHandler(_f84,_f85)){
return stopEventBubble(e);
}
}
}
};
PinFreezeContainer.prototype.touchStart=function(e){
if(this.m_pinFreezeContainer&&e&&e.changedTouches&&e.touches&&e.touches.length==1){
var _f87=e.changedTouches[0];
if(_f87&&_f87.clientX&&_f87.clientY){
var _f88=parseInt(_f87.clientX);
var _f89=parseInt(_f87.clientY);
this.m_pinFreezeContainer.touchStartHandler(_f88,_f89);
}
}
};
PinFreezeContainer.prototype.touchStartHandler=function(_f8a,_f8b){
this.touchScrollSections=false;
this.touchPreviousX=_f8a;
this.touchPreviousY=_f8b;
};
PinFreezeContainer.prototype.touchEnd=function(e){
if(this.m_pinFreezeContainer&&this.m_pinFreezeContainer.touchEndHandler()){
stopEventBubble(e);
}
};
PinFreezeContainer.prototype.touchEndHandler=function(){
var _f8d=this.touchScrollSections;
this.touchScrollSections=false;
this.touchPreviousX=-1;
this.touchPreviousY=-1;
return _f8d;
};
PinFreezeContainer.prototype.touchMoveHandler=function(_f8e,_f8f){
var _f90=this.getSection("pfMainOutput");
if(!_f90){
return;
}
var _f91=this.getSectionHomeCell(_f90);
var _f92=this.getTopHeadingSectionHeight(_f91);
var _f93=this.getSideHeadingSectionWidth(_f91);
var _f94=_f8f-this.touchPreviousY;
var _f95=_f8e-this.touchPreviousX;
if(this.touchScrollSections){
if(_f94!=0){
var _f96=_f90.scrollTop-_f94;
_f96=(_f96>_f92)?_f96:_f92;
_f90.scrollTop=_f96;
var _f97=this.getSection("pfSideHeadings");
if(_f97){
_f97.scrollTop=_f96;
}
}
if(_f95!=0){
var _f98=_f90.scrollLeft-_f95;
_f98=(_f98>_f93)?_f98:_f93;
_f90.scrollLeft=_f98;
var _f99=this.getSection("pfTopHeadings");
if(_f99){
_f99.scrollLeft=_f98;
}
}
}else{
this.firstTouchMove(_f90,_f95,_f94,_f93,_f92);
}
this.touchPreviousX=_f8e;
this.touchPreviousY=_f8f;
return this.touchScrollSections;
};
PinFreezeContainer.prototype.firstTouchMove=function(_f9a,_f9b,_f9c,_f9d,_f9e){
var _f9f=this.mostlyVerticalTouchMove(_f9b,_f9c);
var _fa0=PinFreezeContainer.isSectionVisible(this.getSection("pfTopHeadings"));
var _fa1=PinFreezeContainer.isSectionVisible(this.getSection("pfSideHeadings"));
if(_f9f&&(!_fa0||(_f9c>0&&_f9a.scrollTop<=_f9e)||(_f9c<0&&_f9a.scrollTop+_f9a.clientHeight>=_f9a.scrollHeight))){
this.touchScrollSections=false;
}else{
if(!_f9f&&(!_fa1||(_f9b>0&&_f9a.scrollLeft<=_f9d)||(_f9b<0&&_f9a.scrollLeft+_f9a.clientWidth>=_f9a.scrollWidth))){
this.touchScrollSections=false;
}else{
this.touchScrollSections=true;
}
}
};
PinFreezeContainer.prototype.mostlyVerticalTouchMove=function(_fa2,_fa3){
var _fa4=(_fa2>0)?_fa2:0-_fa2;
var _fa5=(_fa3>0)?_fa3:0-_fa3;
return (_fa5>_fa4);
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
PinFreezeManager.prototype.addContainerObject=function(lid,_fa8,_fa9,_faa,_fab){
if(_fa8||_fa9){
if(!this.m_frozenInfo){
this.m_frozenInfo={};
}
if(!this.m_frozenInfo[lid]){
this._createDefaultFrozenInfo(lid);
}
this.m_frozenInfo[lid].freezeTop=_fa8;
this.m_frozenInfo[lid].freezeSide=_fa9;
var _fac=this.newContainer(lid,_fa8,_fa9,_faa,_fab);
this.m_frozenInfo[lid].pinFreezeContainers.push(_fac);
return _fac;
}
return null;
};
PinFreezeManager.prototype.newContainer=function(lid,_fae,_faf,_fb0,_fb1){
return new PinFreezeContainer(this,lid,this.m_viewerId,_fae,_faf,_fb0,_fb1);
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
var _fb5=this.m_frozenInfo[lid];
if(_fb5){
delete _fb5.pinFreezeContainers;
_fb5.pinFreezeContainers=[];
_fb5.freezeTop=false;
_fb5.freezeSide=false;
}
};
PinFreezeManager.prototype.prepopulateFrozenInfo=function(_fb6){
var _fb7=getDescendantElementsByAttribute(_fb6,"table","lid","",false,-1,new RegExp("[\\s\\S]*"));
if(_fb7){
if(!this.m_frozenInfo){
this.m_frozenInfo={};
}
for(var i=0;i<_fb7.length;i++){
var _fb9=_fb7[i];
if(_fb9.getAttribute("id")=="rt"+this.m_viewerId){
continue;
}
var lid=this.removeNamespace(_fb9.getAttribute("lid"));
if(this.m_frozenInfo[lid]&&this.m_frozenInfo[lid].childContainers){
continue;
}
if(!this.m_frozenInfo[lid]){
this._createDefaultFrozenInfo(lid);
}
if(!this.m_frozenInfo[lid].childContainers){
this.m_frozenInfo[lid].childContainers={};
}
var _fbb=getDescendantElementsByAttribute(_fb9,"table","lid","",false,-1,new RegExp("[\\s\\S]*"));
if(_fbb){
for(var _fbc=0;_fbc<_fbb.length;_fbc++){
var _fbd=_fbb[_fbc];
var _fbe=this.removeNamespace(_fbd.getAttribute("lid"));
if(!this.m_frozenInfo[lid].childContainers[_fbe]){
var _fbf=_fbd.parentNode;
while(_fbf&&!_fbf.getAttribute("lid")){
_fbf=_fbf.parentNode;
}
if(_fbf&&this.removeNamespace(_fbf.getAttribute("lid"))==lid){
this.m_frozenInfo[lid].childContainers[_fbe]=true;
}
}
}
}
}
this._updateParentContainerInfo();
}
};
PinFreezeManager.prototype._updateParentContainerInfo=function(){
for(var _fc0 in this.m_frozenInfo){
var _fc1=this.m_frozenInfo[_fc0].childContainers;
if(_fc1){
for(var _fc2 in _fc1){
if(this.m_frozenInfo[_fc2]){
this.m_frozenInfo[_fc2].parentContainer=_fc0;
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
PinFreezeManager.prototype.freezeContainer=function(lid,_fc5,_fc6){
var _fc7=document.getElementById("CVReport"+this.m_viewerId);
this.prepopulateFrozenInfo(_fc7);
var _fc8=this.getTopLevelContainerLID(lid);
this.unfreezeAllNestedContainers(_fc8,_fc7);
this.m_frozenInfo[lid].freezeTop=_fc5;
this.m_frozenInfo[lid].freezeSide=_fc6;
var _fc9=this._createPinAndFreezeObject(_fc7,_fc8);
this.m_lastWidthProcessed=0;
this.m_lastHeightProcessed=0;
this._resizePinFreezeObjects(_fc9);
this.sectionStructureChange();
if(isIE()){
var obj=this;
setTimeout(function(){
obj.refresh();
},1);
var _fcb=document.getElementById("RVContent"+this.m_viewerId);
this.m_oCV.repaintDiv(_fcb);
}
return _fc9;
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
PinFreezeManager.prototype.getContainer=function(lid,_fd0){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]&&this.m_frozenInfo[lid].pinFreezeContainers[0]){
_fd0=_fd0?_fd0:0;
return this.m_frozenInfo[lid].pinFreezeContainers[_fd0];
}
return null;
};
PinFreezeManager.prototype.nodeToContainer=function(node){
var slid=PinFreezeContainer.nodeToSlid(node);
var _fd3=null;
if(slid){
var lid=this.removeNamespace(PinFreezeContainer.getLidFromSlid(slid));
_fd3=this.getContainer(lid);
}
return _fd3;
};
PinFreezeManager.prototype.getContainerElement=function(_fd5){
var lid=this.removeNamespace(_fd5.getAttribute("lid"));
if(lid){
var _fd7=this.getContainer(lid);
if(_fd7){
return _fd7.getContainer();
}
}
return null;
};
PinFreezeManager.prototype._createPinAndFreezeObject=function(_fd8,lid){
var _fda=null;
if(this.m_frozenInfo){
var _fdb=this.m_frozenInfo[lid];
var _fdc=_fdb.initialLoad;
if(_fdc){
delete _fdb.initialLoad;
}
var _fdd=_fdb.freezeTop;
var _fde=_fdb.freezeSide;
var _fdf=null;
if(_fdc&&_fdb.pinFreezeContainers&&(_fdd||_fde)){
_fdf=_fdb.pinFreezeContainers.slice(0);
}
var _fe0=_fd8;
if(_fdb&&_fdb.parentContainer){
var _fe1=getElementsByAttribute(_fd8,"table","lid",_fdb.parentContainer+this.m_viewerId);
if(_fe1){
for(parentIndex=0;parentIndex<_fe1.length;parentIndex++){
if(!_fe1[parentIndex].getAttribute("clonednode")){
_fe0=_fe1[parentIndex];
break;
}
}
}
}
if(_fdb.childContainers){
for(var _fe2 in _fdb.childContainers){
var _fe3=this._createPinAndFreezeObject(_fe0,_fe2);
_fda=_fda?_fda:_fe3;
}
}
var _fe4=getElementsByAttribute(_fe0,"table","lid",lid+this.m_viewerId);
if(_fe4&&_fe4.length>0){
delete _fdb.pinFreezeContainers;
_fdb.pinFreezeContainers=[];
}else{
return null;
}
if(_fe4&&(_fdd||_fde)){
var _fe5=(_fda!==null);
for(var i=0;i<_fe4.length;i++){
var _fe7=_fe4[i];
if(_fe7.getAttribute("clonednode")=="true"){
continue;
}
_fda=this.addContainerObject(lid,_fdd,_fde,_fe7,i);
if(_fda){
_fda.createPFContainer(_fe0,_fe5);
if(_fdc){
_fda.copyProperties(_fdf[0]);
}
_fda.freezeContainerInReport(_fd8);
}
}
}
}
return _fda;
};
PinFreezeManager.prototype.renderReportWithFrozenContainers=function(_fe8){
if(this.m_frozenInfo){
var _fe9=false;
var _fea=null;
for(var _feb in this.m_frozenInfo){
var _fec=this.m_frozenInfo[_feb];
if(!_fe9){
_fe9=_fec.initialLoad;
}
if(!_fec.parentContainer){
var temp=this._createPinAndFreezeObject(_fe8,_fec.lid);
_fea=_fea?_fea:temp;
}
}
if(!_fe9&&_fea){
this._resizePinFreezeObjects(_fea);
}
this.refresh();
}
};
PinFreezeManager.prototype._resizePinFreezeObjects=function(_fee){
var _fef,_ff0;
var _ff1=this.m_oCV.getViewerWidget();
if(_ff1){
var size=_ff1.getWidgetSize();
_ff0=(size&&size.w&&(size.w<this.getInitialWidthThreshold()))?size.w:_fee.getClientWidth();
_fef=(size&&size.h&&(size.h<this.getInitialHeightThreshold()))?size.h:_fee.getClientHeight();
}else{
var _ff3=document.getElementById("RVContent"+this.m_viewerId);
var _ff4=document.getElementById("mainViewerTable"+this.m_viewerId);
_ff0=_ff3.clientWidth;
_fef=_ff4.clientHeight;
}
this.m_lastWidthProcessed=0;
this.m_lastHeightProcessed=0;
this.resize(_ff0,_fef);
};
PinFreezeManager.prototype.resize=function(_ff5,_ff6){
var _ff7=(Math.abs(_ff5-this.m_lastWidthProcessed)<this.c_resizeTweekLimit);
var _ff8=(Math.abs(_ff6-this.m_lastHeightProcessed)<this.c_resizeTweekLimit);
if(_ff7&&_ff8){
return;
}
var _ff9=(Math.abs(_ff5-this.m_lastWidthProcessed)>2)?_ff5:0;
var _ffa=(Math.abs(_ff6-this.m_lastHeightProcessed)>2)?_ff6:0;
for(var lid in this.m_frozenInfo){
if(!this.m_frozenInfo[lid].parentContainer){
this.resizeContainer(lid,_ff9,_ffa);
}
}
this.m_lastWidthProcessed=_ff5;
this.m_lastHeightProcessed=_ff6;
};
PinFreezeManager.prototype.resizeContainer=function(lid,_ffd,_ffe){
var _fff=this.m_frozenInfo[lid];
if(_fff){
var _1000=null;
if(_fff.childContainers){
var _1001=_ffd>10?_ffd-10:_ffd;
var _1002=_ffe>10?_ffe-10:_ffe;
for(var _1003 in _fff.childContainers){
_1000=this.resizeContainer(_1003,_1001,_1002);
}
}
var _1004=_fff.pinFreezeContainers;
var _1005=null;
var _1006=null;
if(_1004){
for(var i=0;i<_1004.length;i++){
_1005=_1004[i];
_1005.resize(_ffd,_ffe,_fff.parentContainer,_1000);
var _1008=_1005.getContainer();
if(_1008&&(!_1006||(_1006.width<_1008.clientWidth))){
_1006={"width":_1008.clientWidth,"lid":_1005.m_lidNS};
}
}
}
return _1006;
}
};
PinFreezeManager.prototype.processAutoResize=function(width,_100a){
this.m_lastWidthProcessed=width;
this.m_lastHeightProcessed=_100a;
};
PinFreezeManager.prototype.onSetVisible=function(){
this.refresh();
if(this.m_repaintOnVisible){
this.rePaint();
this.m_repaintOnVisible=false;
}
};
PinFreezeManager.prototype.onResizeCanvas=function(_100b){
if(_100b){
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
for(var _100d in this.m_frozenInfo){
var _100e=this.m_frozenInfo[_100d].pinFreezeContainers;
if(_100e){
for(var i=0;i<_100e.length;i++){
var _1010=_100e[i];
_1010.synchScroll();
_1010.synchVScroll();
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
PinFreezeManager.prototype.getValidSelectedContainerId=function(_101d){
var _101e=this.m_oCV.getSelectionController().getAllSelectedObjects();
if(_101e&&_101e.length&&(_101e[0].getDataContainerType()==="crosstab"||(_101d&&_101e[0].getDataContainerType()==="list"))){
var lid=(_101e[0].getLayoutElementId());
if(lid){
if(!this.hasPromptControlsInFreezableCells(lid)){
return this.removeNamespace(lid);
}
}
}
return null;
};
PinFreezeManager.prototype.hasPromptControlsInFreezableCells=function(lid){
var _1021=this.m_oCV.getLayoutElementFromLid(lid);
var _1022=getElementsByAttribute(_1021,["td","th"],"type","columnTitle");
var _1023=new RegExp("(^|[W])clsPromptComponent($|[W])");
var _1024=isIE()?"className":"class";
for(var j in _1022){
if(_1022.hasOwnProperty(j)){
var _1026=getElementsByAttribute(_1022[j],"*",_1024,null,1,_1023);
if(_1026.length>0){
return true;
}
}
}
return false;
};
PinFreezeManager.prototype.unfreeze=function(lid,_1028,reset){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]){
var _102a=this.m_frozenInfo[lid].pinFreezeContainers;
if(_102a){
for(var i=0;i<_102a.length;i++){
var _102c=_102a[i];
_102c.unfreeze(_1028);
}
if(reset){
this._resetFrozenInfo(lid);
}
}
}
};
PinFreezeManager.prototype.unfreezeAllNestedContainers=function(lid,_102e){
var _102f=this.m_frozenInfo[lid];
if(_102f){
if(_102f.freezeTop||_102f.freezeSide){
this.unfreeze(lid,_102e,false);
}
if(_102f.childContainers){
for(var _1030 in _102f.childContainers){
this.unfreezeAllNestedContainers(_1030,_102e);
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
var _1034=this.getContainer(lid);
if(!_1034){
return true;
}
var _1035=PinFreezeContainer.getSectionNameFromSlid(slid);
var _1036=_1034.getSection(_1035);
var _1037=null,_1038=null;
var nodeI=node;
var _103a=null;
while(nodeI&&nodeI!==_1036&&!_1037&&!_1038){
_1037=_1034.getMain(nodeI);
_1038=_1034.getCopy(nodeI);
_103a=nodeI;
nodeI=nodeI.parentNode;
}
var _103b=_1037?true:false;
var _103c=_1038?true:false;
if(_103b){
return _1034.getCopy(_1037)===_103a;
}else{
if(_103c){
return _1034.getCopy(_103a)?false:true;
}else{
return true;
}
}
};
PinFreezeManager.prototype.sectionStructureChange=function(){
var _103d=this.m_oCV.getViewerWidget();
if(_103d&&_103d.getAnnotationHelper()){
_103d.getAnnotationHelper().repositionCommentIndicators();
}
};
PinFreezeManager.prototype.deepCloneNode=function(_103e){
var copy=_103e.cloneNode(true);
var _1040=this.m_oCV.getViewerWidget();
if(_1040){
if(_1040.reportContainsDijits()){
var _1041=getElementsByAttribute(copy,"*","widgetid","*");
if(_1041&&_1041.length){
for(var i=0;i<_1041.length;i++){
_1041[i].parentNode.removeChild(_1041[i]);
}
}
}
}
return copy;
};
PinFreezeManager.prototype.toJSONString=function(){
var _1043="";
var _1044="";
for(var _1045 in this.m_frozenInfo){
if(_1043.length>0){
_1043+=",";
}
var _1046=this.m_frozenInfo[_1045];
_1043+="{";
_1043+="\"lid\":\""+_1046.lid.replace("\"","\\\"")+"\",";
_1043+="\"freezeTop\":"+_1046.freezeTop+",";
_1043+="\"freezeSide\":"+_1046.freezeSide+",";
if(_1046.parentContainer){
_1043+="\"parentContainer\":\""+_1046.parentContainer+"\",";
}
if(_1046.pinFreezeContainers&&_1046.pinFreezeContainers.length>0){
_1043+="\"properties\":"+_1046.pinFreezeContainers[0].toJSONString()+",";
}
_1043+="\"childContainers\": {";
if(_1046.childContainers){
var first=true;
for(var _1048 in _1046.childContainers){
if(!first){
_1043+=",";
}
_1043+="\""+_1048+"\":true";
first=false;
}
}
_1043+="}}";
}
if(_1043.length>0){
_1044="{\"version\":1, \"containers\":["+_1043+"]}";
}
return _1044;
};
PinFreezeManager.prototype.fromJSONString=function(sJSON){
if(!sJSON||sJSON.length===0){
return;
}
var oJSON=null;
try{
oJSON=eval("("+sJSON+")");
}
catch(e){
if(typeof console!="undefined"){
console.log("PinFreezeManager.prototype.fromJSON could not parse JSON - "+sJSON);
console.log(e);
}
}
if(!oJSON){
return;
}
var _104b=oJSON.containers;
var _104c=oJSON.version;
if(_104b.length>0){
this.m_frozenInfo={};
}
for(var _104d=0;_104d<_104b.length;_104d++){
var _104e=_104b[_104d];
var lid=_104e.lid;
var _1050=_104e.freezeTop;
var _1051=_104e.freezeSide;
var _1052=document.getElementById("CVReport"+this.m_viewerId);
var _1053=getElementsByAttribute(_1052,"table","lid",lid+this.m_viewerId);
var _1054=[];
if(_1053&&(_1050||_1051)){
for(var i=0;i<_1053.length;i++){
var _1056=_1053[i];
var _1057=new PinFreezeContainer(this,lid,this.m_viewerId,_104e.freezeTop,_104e.freezeSide,_1056,i);
if(_104e.properties){
applyJSONProperties(_1057,_104e.properties);
}
_1054.push(_1057);
}
}
this.m_frozenInfo[lid]={"lid":lid,"freezeTop":_1050,"freezeSide":_1051,"pinFreezeContainers":_1054,"initialLoad":true};
if(_104c>=1){
if(_104e.childContainers){
this.m_frozenInfo[lid].childContainers=_104e.childContainers;
}
if(_104e.parentContainer){
this.m_frozenInfo[lid].parentContainer=_104e.parentContainer;
}
}
}
};
PinFreezeManager.prototype.removeIdAttribute=function(_1058){
var _1059=_1058.getAttribute("id");
if(_1059!==null&&_1059!==""){
_1058.removeAttribute("id");
}
var _105a=getElementsByAttribute(_1058,"*","id","*");
if(_105a&&_105a.length){
for(var i=0;i<_105a.length;i++){
_105a[i].removeAttribute("id");
}
}
return _1058;
};
PinFreezeManager.prototype.isElementInMainOutput=function(_105c){
return PinFreezeContainer.isElementInMainOutput(_105c);
};
PinFreezeManager.prototype.isIWidgetMobile=function(){
return (this.m_oCV&&this.m_oCV.isIWidgetMobile());
};
PinFreezeManager.prototype.destroy=function(){
GUtil.destroyProperties(this);
};
function CViewerToolbar(){
this.m_specification=null;
this.m_oCBar=null;
this.m_sWebContentRoot=null;
this.m_sSkin=null;
};
CViewerToolbar.prototype.getNamespace=function(){
if(this.m_specification&&typeof this.m_specification.namespace!="undefined"){
return this.m_specification.namespace;
}
return "";
};
CViewerToolbar.prototype.getSkin=function(){
if(this.m_sSkin==null){
var oCV=null;
try{
oCV=getCognosViewerObjectRef(this.getNamespace());
}
catch(exception){
}
if(oCV){
this.m_sSkin=oCV.getSkin();
}else{
this.m_sSkin=this.getWebContentRoot()+"/skins/corporate";
}
}
return this.m_sSkin;
};
CViewerToolbar.prototype.getWebContentRoot=function(){
if(this.m_sWebContentRoot==null){
var oCV=null;
try{
oCV=getCognosViewerObjectRef(this.getNamespace());
}
catch(exception){
}
if(oCV){
this.m_sWebContentRoot=oCV.getWebContentRoot();
}else{
this.m_sWebContentRoot="..";
}
}
return this.m_sWebContentRoot;
};
CViewerToolbar.prototype.getDivId=function(){
if(this.m_specification&&typeof this.m_specification.divId!="undefined"){
return this.m_specification.divId;
}
return "";
};
CViewerToolbar.prototype.getStyle=function(){
if(this.m_specification&&typeof this.m_specification.style!="undefined"){
return this.m_specification.style;
}
return "";
};
CViewerToolbar.prototype.getToolbarSpecification=function(){
if(this.m_specification&&typeof this.m_specification.S!="undefined"){
return new CViewerToolbarSpecification(this,this.m_specification.S);
}
return null;
};
CViewerToolbar.prototype.getItem=function(sId){
if(this.m_oCBar){
var _1060=this.m_oCBar.getNumItems();
sId=this.getNamespace()+sId;
for(var index=0;index<_1060;++index){
var _1062=this.m_oCBar.get(index);
if(typeof _1062.getId=="function"&&_1062.getId()==sId){
return _1062;
}
}
}
return null;
};
CViewerToolbar.prototype.init=function(_1063){
if(typeof _1063!="undefined"&&typeof _1063=="object"&&_1063!=null){
this.m_specification=_1063;
}
};
CViewerToolbar.prototype.getCBar=function(){
if(!this.m_oCBar&&this.m_specification){
this.load();
}
return this.m_oCBar;
};
CViewerToolbar.prototype.load=function(){
var _1064=null;
if(this.m_specification!=null){
var divId=this.getDivId();
var _1066=document.getElementById(divId);
var _1067=this.getToolbarSpecification();
if(_1066&&_1067){
_1064=_1067.draw();
}
}
this.m_oCBar=_1064;
return _1064;
};
CViewerToolbar.prototype.draw=function(){
if(this.m_oCBar){
this.m_oCBar.draw();
}
};
function CViewerToolbarSpecification(_1068,_1069){
this.m_viewerToolbar=_1068;
this.m_toolbarSpecification=_1069;
};
CViewerToolbarSpecification.prototype.draw=function(){
if(this.m_toolbarSpecification){
var _106a=gToolbarStyle;
if(this.m_viewerToolbar.getStyle()==="banner"){
_106a=gBannerToolbarStyle;
}
var _106b=new CBar(this.m_viewerToolbar.getDivId(),_106a,null,this.m_viewerToolbar.getWebContentRoot());
_106b.setMenuType(cHorizonalBar);
_106b.style=this.m_viewerToolbar.getStyle();
_106b.setAlign("right");
var _106c=false;
var _106d=null;
var _106e=null;
for(var _106f=0;_106f<this.m_toolbarSpecification.length;_106f++){
for(var _1070 in this.m_toolbarSpecification[_106f]){
try{
var _1071=eval("new "+_1070+"();");
if(_1070=="P"){
if(_106c&&_106e==null){
_106d=_1071;
_106e=this.m_toolbarSpecification[_106f][_1070];
}
}else{
_106c=true;
if(_106e!=null&&_106d!=null){
_106d.load(_106b,_106e,this.m_viewerToolbar);
_106d=null;
_106e=null;
}
_1071.load(_106b,this.m_toolbarSpecification[_106f][_1070],this.m_viewerToolbar);
}
}
catch(exception){
}
}
}
return _106b;
}
return null;
};
function B(){
};
B.prototype.isValid=function(_1072){
if(_1072!=null){
return true;
}
return false;
};
B.prototype.load=function(_1073,_1074,_1075){
if(this.isValid(_1074)){
var _1076="";
var _1077="";
var _1078="";
var sName=_1074.N;
var _107a=null;
if(typeof _1074.M!="undefined"&&_1074.M.IS!="undefined"){
_107a=_1074.M.IS;
}
if(typeof _1074.C=="undefined"){
if(_107a){
var _107b=_107a[0]["I"];
if(_107b!=null&&this.isValid(_107b)){
_1076=_107b.O;
if(typeof _1076=="undefined"||_1076==""){
_1076=_107b.E;
}
_1077=_107b.C;
_1078=_107b.A;
}
}
}else{
_1076=_1074.O;
_1077=_1074.C;
_1078=_1074.A;
}
var _107c=null;
if(_1075.getStyle()==="banner"){
_107c=new CMenuItem(_1073,"",_1078,_1077,gBannerButtonStyle,_1075.getWebContentRoot(),_1075.getSkin());
_107c.setDropDownArrow("dropdown_arrow_banner.gif");
}else{
_107c=new CMenuItem(_1073,"",_1078,_1077,gMenuItemStyle,_1075.getWebContentRoot(),_1075.getSkin());
_107c.setDropDownArrow("dropdown_arrow_narrow.gif");
}
_107c.setId(_1075.getNamespace()+sName);
_107c.setToolTip(_1076);
if(typeof _1074.ALT!="undefined"){
_107c.setAltText(_1074.ALT);
}
if(typeof _1074.D!="undefined"&&_1074.D=="true"){
_107c.disable();
}
if(typeof _1074.M!="undefined"){
var _107d=_1074.M;
if(typeof _107d.Y!="undefined"&&(typeof _107d.A!="undefined"||(_107a&&_107a.length>1)||(typeof _107d.H=="undefined"||_107d.H=="false"))){
var menu=new M();
_107c.m_menu=menu.load(_1073,_107d,_1075);
_107c.m_menu.setParent(_107c);
_107c.m_menuType=_107d.Y;
}
}
return _107c;
}
return null;
};
function I(){
};
I.prototype.isValid=function(_107f){
if(typeof _107f!="undefined"&&_107f!=null){
return true;
}
return false;
};
I.prototype.load=function(_1080,_1081,_1082){
if(this.isValid(_1081)){
var sText=_1081.E;
var _1084=_1081.C;
var _1085=_1081.A;
var sName=_1081.N;
var _1087=null;
if(typeof _1081.M!="undefined"&&_1081.M.IS!="undefined"){
_1087=_1081.M.IS;
}
if(typeof _1081.E=="undefined"){
if(_1087&&_1087[0]){
var _1088=_1087[0]["I"];
if(_1088!=null&&this.isValid(_1088)){
sText=_1088.E;
if(typeof sText=="undefined"||sText==""){
sText=_1088.O;
}
_1085=_1088.A;
}
}else{
return null;
}
}else{
sText=_1081.E;
_1084=_1081.C;
_1085=_1081.A;
}
var _1089=null;
if(_1080.style&&_1080.style==="banner"){
_1089=gBannerItemStyle;
}else{
_1089=gMenuItemStyle;
}
var _108a=new CMenuItem(_1080,sText,_1085,_1084,_1089,_1082.getWebContentRoot(),_1082.getSkin());
if(typeof _1081.ALT!="undefined"){
_108a.setAltText(_1081.ALT);
}
if(_1080.style&&_1080.style==="banner"){
_108a.setDropDownArrow("dropdown_arrow_banner.gif");
}else{
_108a.setDropDownArrow("dropdown_arrow_narrow.gif");
}
_108a.setId(_1082.getNamespace()+sName);
if(typeof _1081.D!="undefined"&&_1081.D=="true"){
_108a.disable();
}
if(typeof _1081.M!="undefined"){
var _108b=_1081.M;
if(typeof _108b.Y!="undefined"&&(typeof _108b.A!="undefined"||(_1087&&_1087.length>1)||(typeof _108b.H=="undefined"||_108b.H=="false"))){
var menu=new M();
_108a.m_menu=menu.load(_1080,_108b,_1082);
_108a.m_menu.setParent(_108a);
_108a.m_menuType=_1081.M.Y;
}
}
return _108a;
}
return null;
};
function M(){
};
M.prototype.isValid=function(_108d){
return (typeof _108d!="undefined"&&_108d!=null&&typeof _108d.id!="undefined");
};
M.prototype.load=function(_108e,_108f,_1090){
if(this.isValid(_108f)){
var menu=new CMenu(_108f.id,gMenuStyle,_1090.getWebContentRoot());
menu.setParent(_108e);
if(typeof _108f.ALT!="undefined"){
menu.setAltText(_108f.ALT);
}
try{
menu.m_oCV=getCognosViewerObjectRef(_1090.getNamespace());
}
catch(e){
}
if(typeof _108f.A!="undefined"){
menu.registerCallback(_108f.A);
}
var _1092=_108f.IS;
if(_1092){
for(var _1093=0;_1093<_1092.length;_1093++){
for(var _1094 in _1092[_1093]){
try{
var _1095=new I();
_1095.load(menu,_1092[_1093][_1094],_1090);
}
catch(exception){
}
}
}
}
return menu;
}
return null;
};
function T(){
};
T.prototype.isValid=function(_1096){
return (typeof _1096!="undefined"&&_1096!=null&&typeof _1096.E!="undefined");
};
T.prototype.load=function(_1097,_1098,_1099){
if(this.isValid(_1098)){
var _109a=null;
if(_1099.getStyle()==="banner"){
_109a=gBannerStaticText;
}else{
}
if(_1098.E&&_1098.E.length>0){
var _109b=new CStaticText(_1098.E,_109a);
if(_1098.N=="userName"){
_109b.setId("userNameTD"+_1099.getNamespace());
}
if(_1098.ALT){
_109b.setLabelledBy(_1098.ALT+" "+_1098.E);
}
_1097.add(_109b);
}
}
return null;
};
function L(){
};
L.prototype.isValid=function(_109c){
return (typeof _109c!="undefined"&&_109c!=null&&typeof _109c.E!="undefined");
};
L.prototype.load=function(_109d,_109e,_109f){
if(this.isValid(_109e)){
var _10a0=null;
if(_109f.getStyle()==="banner"){
_10a0=gBannerLink;
}else{
}
var _10a1=_109e.A;
var _10a2=new CMenuItem(_109d,_109e.E,_10a1,"",_10a0,_109f.getWebContentRoot(),_109f.getSkin());
_10a2.iconPlaceholder=false;
if(_109e.ALT!="undefined"){
_10a2.setAltText(_109e.ALT);
}
return _10a2;
}
return null;
};
function P(){
};
P.prototype.isValid=function(_10a3){
return (typeof _10a3!="undefined"&&_10a3!=null&&typeof _10a3.Y!="undefined");
};
P.prototype.load=function(_10a4,_10a5,_10a6){
if(this.isValid(_10a5)){
var _10a7=new CSeperator(_10a5.Y,"","",_10a6.getWebContentRoot());
if(_10a6.getStyle()==="banner"){
_10a7.setToolbarSeperatorClass("bannerDivider");
}else{
_10a7.setToolbarSeperatorClass("toolbarDivider");
}
_10a4.add(_10a7);
return _10a7;
}
return null;
};
function GlossaryAction(){
};
GlossaryAction.prototype=new CognosViewerAction();
GlossaryAction.prototype.execute=function(){
var _10a8=this.getCognosViewer();
_10a8.loadExtra();
var _10a9=_10a8.getSelectionController();
var _10aa=_10a9.getAllSelectedObjects();
if(_10aa.length>0){
var _10ab=null;
if(typeof MDSRV_CognosConfiguration!="undefined"){
_10ab=new MDSRV_CognosConfiguration();
var _10ac="";
if(_10a8.envParams["glossaryURI"]){
_10ac=_10a8.envParams["glossaryURI"];
}
_10ab.addProperty("glossaryURI",_10ac);
_10ab.addProperty("gatewayURI",_10a8.getGateway());
}
var _10ad=_10a8.envParams["ui.object"];
var _10ae=getViewerSelectionContext(_10a9,new CSelectionContext(_10ad));
var _10af=new MDSRV_BusinessGlossary(_10ab,_10ae);
_10af.open();
}
};
GlossaryAction.prototype.updateMenu=function(_10b0){
if(!this.getCognosViewer().bCanUseGlossary){
return "";
}
var _10b1=this.selectionHasContext();
if(!_10b1||this.getCognosViewer().envParams["glossaryURI"]==null||this.getCognosViewer().envParams["glossaryURI"]==""){
_10b0.disabled=true;
}else{
_10b0.disabled=false;
}
return _10b0;
};
function AuthoredDrillAction(){
this.m_drillTargetSpecification="";
};
AuthoredDrillAction.prototype=new CognosViewerAction();
AuthoredDrillAction.prototype.setRequestParms=function(_10b2){
this.m_drillTargetSpecification=_10b2;
};
AuthoredDrillAction.prototype.executeDrillTarget=function(_10b3){
var _10b4=XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(_10b3));
var _10b5=encodeURIComponent(_10b4.getAttribute("bookmarkRef"));
var _10b6=_10b4.getAttribute("path");
var _10b7=this._shouldShowInNewWindow(_10b4);
var oCV=this.getCognosViewer();
if((_10b5!==null&&_10b5!=="")&&(_10b6===null||_10b6==="")){
var _10b9=_10b4.getAttribute("bookmarkPage");
if(_10b9&&_10b9!==""){
oCV.executeAction("GotoPage",{"pageNumber":_10b9,"anchorName":_10b5});
}else{
document.location="#"+_10b5;
}
}else{
var _10ba="";
if(_10b7){
_10ba="_blank";
}
var _10bb=[];
var _10bc=[];
_10bc.push("obj");
_10bc.push(_10b6);
_10bb[_10bb.length]=_10bc;
var _10bd=false;
var _10be,_10bf,_10c0,sName,sNil;
var _10c3=XMLHelper_FindChildrenByTagName(_10b4,"drillParameter",false);
for(var index=0;index<_10c3.length;++index){
_10be=[];
_10bf=_10c3[index];
_10c0=_10bf.getAttribute("value");
sName=_10bf.getAttribute("name");
if(_10c0!==null&&_10c0!==""){
_10be.push("p_"+sName);
_10be.push(this.buildSelectionChoicesSpecification(_10bf));
}
sNil=_10bf.getAttribute("nil");
if(sNil!==null&&sNil!==""){
_10be.push("p_"+sName);
_10be.push(this.buildSelectionChoicesNilSpecification());
}
if(_10be.length>0){
_10bb[_10bb.length]=_10be;
}
if(!_10bd){
var _10c5=_10bf.getAttribute("propertyToPass");
_10bd=(_10c5&&_10c5.length>0)?true:false;
}
}
var _10c6=_10b4.getAttribute("method");
var _10c7=_10b4.getAttribute("outputFormat");
var _10c8=_10b4.getAttribute("outputLocale");
var _10c9=_10b4.getAttribute("prompt");
var _10ca=_10b4.getAttribute("dynamicDrill");
var _10cb=this.getXMLNodeAsString(_10b4,"parameters");
var _10cc=this.getXMLNodeAsString(_10b4,"objectPaths");
var oCVId=oCV.getId();
var _10ce=document.forms["formWarpRequest"+oCVId];
var _10cf=oCV.getAdvancedServerProperty("VIEWER_JS_CALL_FORWARD_DRILLTHROUGH_TO_SELF");
if((!_10cf||_10cf.toLowerCase()!=="false")&&_10c9!="true"&&this.isSameReport(_10ce,_10b6)&&this.isSameReportFormat(_10c7)&&!_10b7&&!_10bd){
var _10d0=new ViewerDispatcherEntry(oCV);
_10d0.addFormField("ui.action","forward");
if(oCV!==null&&typeof oCV.rvMainWnd!="undefined"){
oCV.rvMainWnd.addCurrentReportToReportHistory();
var _10d1=oCV.rvMainWnd.saveReportHistoryAsXML();
_10d0.addFormField("cv.previousReports",_10d1);
}
for(index=0;index<_10c3.length;++index){
_10be=[];
_10bf=_10c3[index];
_10c0=_10bf.getAttribute("value");
sName=_10bf.getAttribute("name");
sNil=_10bf.getAttribute("nil");
if((sNil===null||sNil==="")&&(_10c0===null||_10c0==="")){
_10be.push("p_"+sName);
_10be.push(this.buildSelectionChoicesNilSpecification());
}
if(_10be.length>0){
_10bb[_10bb.length]=_10be;
}
}
for(index=1;index<_10bb.length;index++){
_10d0.addFormField(_10bb[index][0],_10bb[index][1]);
}
_10d0.addFormField("_drillThroughToSelf","true");
if(oCV.m_tabsPayload&&oCV.m_tabsPayload.tabs){
_10d0.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",oCV.m_tabsPayload.tabs[0].id);
}
oCV.setUsePageRequest(true);
oCV.dispatchRequest(_10d0);
if(typeof oCV.m_viewerFragment=="undefined"){
var _10d2=getCognosViewerObjectRefAsString(oCVId);
setTimeout(_10d2+".getRequestIndicator().show()",10);
}
}else{
doSingleDrill(_10ba,_10bb,_10c6,_10c7,_10c8,_10b5,_10cb,_10cc,this.getCognosViewer().getId(),_10c9,_10ca);
}
}
};
AuthoredDrillAction.prototype._shouldShowInNewWindow=function(_10d3){
return _10d3.getAttribute("showInNewWindow")=="true";
};
AuthoredDrillAction.prototype.isSameReport=function(_10d4,_10d5){
if(_10d4["ui.object"]&&_10d5==_10d4["ui.object"].value){
return true;
}
return false;
};
AuthoredDrillAction.prototype.isSameReportFormat=function(_10d6){
var _10d7=this.getCognosViewer().envParams["run.outputFormat"];
if(_10d7){
if(_10d6==_10d7){
return true;
}else{
if(_10d7=="HTML"&&_10d6=="HTMLFragment"){
return true;
}
}
}
return false;
};
AuthoredDrillAction.prototype.getXMLNodeAsString=function(_10d8,_10d9){
var sXML="";
if(_10d8!=null){
var node=XMLHelper_FindChildByTagName(_10d8,_10d9,false);
if(node!=null){
sXML=XMLBuilderSerializeNode(node);
}
}
return sXML;
};
AuthoredDrillAction.prototype.execute=function(_10dc){
if(this.m_drillTargetSpecification!=""){
this.executeDrillTarget(this.m_drillTargetSpecification);
}else{
if(typeof _10dc!="undefined"){
var _10dd=this.getCognosViewer().getDrillTargets();
var _10de=this.getAuthoredDrillThroughContext(_10dc,_10dd);
var _10df=_10de.childNodes;
if(_10df.length==1){
this.executeDrillTarget(XMLBuilderSerializeNode(_10df[0]));
}else{
doMultipleDrills(XMLBuilderSerializeNode(_10de),this.getCognosViewer().getId());
}
}
}
};
AuthoredDrillAction.prototype.showDrillTargets=function(_10e0){
var _10e1="<context>";
for(var index=0;index<_10e0.length;++index){
var _10e3=_10e0[index];
_10e1+="<member>";
var sName=_10e3.getAttribute("label");
_10e1+="<name>";
_10e1+=sXmlEncode(sName);
_10e1+="</name>";
var _10e5=_10e3.getAttribute("path");
_10e1+="<drillThroughSearchPath>";
_10e1+=sXmlEncode(_10e5);
_10e1+="</drillThroughSearchPath>";
var _10e6=_10e3.getAttribute("method");
_10e1+="<drillThroughAction>";
_10e1+=sXmlEncode(_10e6);
_10e1+="</drillThroughAction>";
var _10e7=_10e3.getAttribute("outputFormat");
_10e1+="<drillThroughFormat>";
_10e1+=sXmlEncode(_10e7);
_10e1+="</drillThroughFormat>";
var sData="parent."+this.getTargetReportRequestString(_10e3);
_10e1+="<data>";
_10e1+=sXmlEncode(sData);
_10e1+="</data>";
_10e1+="</member>";
}
_10e1+="</context>";
};
AuthoredDrillAction.prototype.populateContextMenu=function(_10e9){
var _10ea=this.getCognosViewer();
var _10eb=_10ea.rvMainWnd.getToolbarControl();
var _10ec=null;
if(typeof _10eb!="undefined"&&_10eb!=null){
var _10ed=_10eb.getItem("goto");
if(_10ed){
_10ec=_10ed.getMenu();
}
}
var _10ee=_10ea.rvMainWnd.getContextMenu();
var _10ef=null;
if(typeof _10ee!="undefined"&&_10ee!=null){
_10ef=_10ee.getGoToMenuItem().getMenu();
}
if(_10ec!=null||_10ef!=null){
var _10f0=this.getCognosViewer().getDrillTargets();
var _10f1=this.getAuthoredDrillThroughContext(_10e9,_10f0);
var _10f2=_10f1.childNodes;
if(_10f2.length>0){
for(var index=0;index<_10f2.length;++index){
var _10f4=_10f2[index];
var _10f5=getCognosViewerObjectRefAsString(this.getCognosViewer().getId())+".m_oDrillMgr.executeAuthoredDrill(\""+encodeURIComponent(XMLBuilderSerializeNode(_10f4))+"\");";
var _10f6=this.getTargetReportIconPath(_10f4);
var _10f7=_10f4.getAttribute("label");
if(isViewerBidiEnabled()){
var bidi=BidiUtils.getInstance();
_10f7=bidi.btdInjectUCCIntoStr(_10f7,getViewerBaseTextDirection());
}
if(_10ec!=null){
new CMenuItem(_10ec,_10f7,_10f5,_10f6,gMenuItemStyle,_10ea.getWebContentRoot(),_10ea.getSkin());
}
if(_10ef!=null){
new CMenuItem(_10ef,_10f7,_10f5,_10f6,gMenuItemStyle,_10ea.getWebContentRoot(),_10ea.getSkin());
}
}
}
}
};
AuthoredDrillAction.prototype.buildSelectionChoicesNilSpecification=function(){
return "<selectChoices/>";
};
AuthoredDrillAction.prototype.buildSelectionChoicesSpecification=function(_10f9){
var _10fa="";
var _10fb=_10f9.getAttribute("value");
if(_10fb!=null){
var _10fc=_10f9.getAttribute("propertyToPass");
_10fa+="<selectChoices";
if(_10fc!=null&&_10fc!=""){
_10fa+=" propertyToPass=\"";
_10fa+=sXmlEncode(_10fc);
_10fa+="\"";
}
_10fa+=">";
if(_10fb.indexOf("<selectChoices>")!=-1){
_10fa+=_10fb.substring(_10fb.indexOf("<selectChoices>")+15);
}else{
if(_10fb!=""){
_10fa+="<selectOption ";
var sMun=_10f9.getAttribute("mun");
if(sMun!=null&&sMun!=""){
var _10fe=sXmlEncode(sMun);
_10fa+="useValue=\"";
_10fa+=_10fe;
_10fa+="\" ";
_10fa+="mun=\"";
_10fa+=_10fe;
_10fa+="\" ";
_10fa+="displayValue=\"";
_10fa+=sXmlEncode(_10fb);
_10fa+="\"";
}else{
_10fa+="useValue=\"";
_10fa+=sXmlEncode(_10fb);
_10fa+="\" ";
var _10ff=_10f9.getAttribute("displayValue");
if(_10ff==null||_10ff==""){
_10ff=_10fb;
}
_10fa+="displayValue=\"";
_10fa+=sXmlEncode(_10ff);
_10fa+="\"";
}
_10fa+="/>";
_10fa+="</selectChoices>";
}
}
}
return _10fa;
};
AuthoredDrillAction.prototype.getPropertyToPass=function(_1100,_1101){
if(_1100!=null&&_1100!=""&&_1101!=null){
var _1102=_1101.childNodes;
if(_1102!=null){
for(var index=0;index<_1102.length;++index){
var _1104=_1102[index];
var sName="";
if(_1104.getAttribute("name")!=null){
sName=_1104.getAttribute("name");
}
if(sName==_1100){
return _1104.getAttribute("propertyToPass");
}
}
}
}
return "";
};
AuthoredDrillAction.prototype.getTargetReportRequestString=function(_1106){
var _1107="";
var _1108=_1106.getAttribute("bookmarkRef");
var _1109=_1106.getAttribute("path");
var _110a=_1106.getAttribute("showInNewWindow");
if((_1108!=null&&_1108!="")&&(_1109==null||_1109=="")){
_1107+="document.location=\"#";
_1107+=_1108;
_1107+="\";";
}else{
_1107+="doSingleDrill(";
if(_110a=="true"){
_1107+="\"_blank\",";
}else{
_1107+="\"\",";
}
_1107+="[[\"obj\",\"";
_1107+=encodeURIComponent(_1109);
_1107+="\"]";
var _110b=XMLHelper_FindChildrenByTagName(_1106,"drillParameter",false);
for(var index=0;index<_110b.length;++index){
var _110d=_110b[index];
var _110e=_110d.getAttribute("value");
var sName=_110d.getAttribute("name");
if(_110e!=null&&_110e!=""){
_1107+=", [\"p_"+sName+"\",\""+encodeURIComponent(this.buildSelectionChoicesSpecification(_110d))+"\"]";
}
var sNil=_110d.getAttribute("nil");
if(sNil!=null&&sNil!=""){
_1107+="\", [\"p_"+sName+"\",\""+encodeURIComponent(this.buildSelectionChoicesNilSpecification())+"\"]";
}
}
_1107+="],";
var _1111=_1106.getAttribute("method");
_1107+="\""+encodeURIComponent(_1111)+"\",";
var _1112=_1106.getAttribute("outputFormat");
_1107+="\""+encodeURIComponent(_1112)+"\",";
var _1113=_1106.getAttribute("outputLocale");
_1107+="\""+encodeURIComponent(_1113)+"\",";
_1107+="\""+encodeURIComponent(_1108)+"\",";
var _1114=XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(_1106,"parameters",false));
_1107+="\""+encodeURIComponent(_1114)+"\",";
var _1115=XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(_1106,"objectPaths",false));
_1107+="\""+encodeURIComponent(_1115)+"\",";
_1107+="\""+encodeURIComponent(this.getCognosViewer().getId())+"\",";
var _1116=_1106.getAttribute("prompt");
_1107+="\""+encodeURIComponent(_1116)+"\",";
var _1117=_1106.getAttribute("dynamicDrill");
_1107+=" "+encodeURIComponent(_1117);
_1107+=");";
}
return _1107;
};
AuthoredDrillAction.prototype.getTargetReportIconPath=function(_1118){
var _1119="";
var _111a=_1118.getAttribute("bookmarkRef");
var _111b=XMLHelper_FindChildByTagName(_1118,"drillParameter",false);
if((_111a!=null&&_111a!="")&&_111b==null){
_1119="/common/images/spacer.gif";
}else{
var _111c=_1118.getAttribute("method");
switch(_111c){
case "editAnalysis":
_1119="/ps/portal/images/icon_ps_analysis.gif";
break;
case "editQuery":
_1119="/ps/portal/images/icon_qs_query.gif";
break;
case "execute":
_1119="/ps/portal/images/action_run.gif";
break;
case "view":
var _111d=_1118.getAttribute("outputFormat");
switch(_111d){
case "HTML":
case "XHTML":
case "HTMLFragment":
_1119="/ps/portal/images/icon_result_html.gif";
break;
case "PDF":
_1119="/ps/portal/images/icon_result_pdf.gif";
break;
case "XML":
_1119="/ps/portal/images/icon_result_xml.gif";
break;
case "CSV":
_1119="/ps/portal/images/icon_result_csv.gif";
break;
case "XLS":
_1119="/ps/portal/images/icon_result_excel.gif";
break;
case "SingleXLS":
_1119="/ps/portal/images/icon_result_excel_single.gif";
break;
case "XLWA":
_1119="/ps/portal/images/icon_result_excel_web_arch.gif";
break;
default:
_1119="/common/images/spacer.gif";
}
break;
default:
_1119="/common/images/spacer.gif";
}
}
return this.getCognosViewer().getWebContentRoot()+_1119;
};
AuthoredDrillAction.prototype.getAuthoredDrillThroughContext=function(_111e,_111f){
if(typeof _111e!="string"||typeof _111f!="object"){
return null;
}
var _1120=XMLBuilderLoadXMLFromString(_111e);
if(_1120==null||_1120.firstChild==null){
return null;
}
var _1121=XMLHelper_GetFirstChildElement(_1120);
if(XMLHelper_GetLocalName(_1121)!="AuthoredDrillTargets"){
return null;
}
var _1122=XMLHelper_GetFirstChildElement(_1121);
if(XMLHelper_GetLocalName(_1122)!="rvDrillTargets"){
return null;
}
var _1123=_1122.childNodes;
if(_1123===null||_1123.length===0){
return null;
}
var _1124=self.XMLBuilderCreateXMLDocument("rvDrillTargets");
for(var _1125=0;_1125<_1123.length;++_1125){
if(typeof _1123[_1125].getAttribute=="undefined"){
continue;
}
var _1126=_1124.createElement("drillTarget");
_1124.documentElement.appendChild(_1126);
var _1127=_1123[_1125].getAttribute("bookmarkRef");
if(_1127===null){
_1126.setAttribute("bookmarkRef","");
}else{
_1126.setAttribute("bookmarkRef",_1127);
}
var _1128=_1123[_1125].getAttribute("bookmarkPage");
if(_1128===null){
_1126.setAttribute("bookmarkPage","");
}else{
_1126.setAttribute("bookmarkPage",_1128);
}
var _1129=_1123[_1125].getAttribute("drillIdx");
if(_1129==null){
continue;
}
if(_1129>=_111f.length){
continue;
}
var _112a=_111f[_1129];
if(typeof _112a!="object"){
continue;
}
_1126.setAttribute("outputFormat",_112a.getOutputFormat());
_1126.setAttribute("outputLocale",_112a.getOutputLocale());
_1126.setAttribute("prompt",_112a.getPrompt());
_1126.setAttribute("dynamicDrill",_112a.isDynamicDrillThrough()?"true":"false");
var _112b=_1123[_1125].getAttribute("label");
if(_112b===null||_112b===""){
_112b=_112a.getLabel();
}
_1126.setAttribute("label",_112b);
_1126.setAttribute("path",_112a.getPath());
_1126.setAttribute("showInNewWindow",_112a.getShowInNewWindow());
_1126.setAttribute("method",_112a.getMethod());
var _112c=_1122;
var _112d="";
var _112e=_112a.getParameterProperties();
if(typeof _112e!="undefined"&&_112e!=null&&_112e!=""){
_112d=XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(_112a.getParameterProperties()));
}
while(_112c){
var _112f=_112c.childNodes[_1125].childNodes;
for(var _1130=0;_1130<_112f.length;++_1130){
var _1131=_112f[_1130].cloneNode(true);
if(_112d){
var _1132=this.getPropertyToPass(_1131.getAttribute("name"),_112d);
if(_1132!=null&&_1132!=""){
_1131.setAttribute("propertyToPass",_1132);
}
}
_1126.appendChild(_1131);
}
_112c=_112c.nextSibling;
}
var _1133="<root xmlns:bus=\"http://developer.cognos.com/schemas/bibus/3/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">";
var _1134="</root>";
var _1135=_1133+_112a.getParameters()+_1134;
var _1136=XMLBuilderLoadXMLFromString(_1135);
var _1137=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(_1136));
if(_1137){
_1126.appendChild(_1137.cloneNode(true));
}
var _1138=_1133+_112a.getObjectPaths()+_1134;
var _1139=XMLBuilderLoadXMLFromString(_1138);
_1137=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(_1139));
if(_1137){
_1126.appendChild(_1137.cloneNode(true));
}
}
return XMLHelper_GetFirstChildElement(_1124);
};
function DrillContextMenuHelper(){
};
DrillContextMenuHelper.updateDrillMenuItems=function(_113a,oCV,_113c){
var _113d=[];
if(DrillContextMenuHelper.needsDrillSubMenu(oCV)){
var _113e=oCV.getSelectionController();
var _113f=_113e.getAllSelectedObjects();
var _1140=_113f[0];
if(_1140.getUseValues().length>1&&typeof RV_RES!="undefined"){
var _1141={name:_113c,label:RV_RES.RV_DRILL_DEFAULT,action:{name:_113c,payload:{}}};
_113d.push(_1141);
}
var _1142=(_1140.getUseValues().length>1)?1:0;
var _1143=_1140.getUseValues().length-1;
_1143=(_1143>2)?2:_1143;
for(var iDim=_1142;iDim<=_1143;++iDim){
DrillContextMenuHelper.addSubMenuItem(_113c,_113d,_1140,iDim,0);
}
var _1145=false;
for(var iDim=_1142;iDim<=_1143;++iDim){
for(var _1146=1;_1146<_1140.getUseValues()[iDim].length;++_1146){
if(_1145==false){
_113d.push({separator:true});
_1145=true;
}
DrillContextMenuHelper.addSubMenuItem(_113c,_113d,_1140,iDim,_1146);
}
}
}
DrillContextMenuHelper.completeDrillMenu(_113c,_113d,_113a);
};
DrillContextMenuHelper.needsDrillSubMenu=function(oCV){
var _1148=(oCV&&oCV.getSelectionController());
if(_1148){
var _1149=_1148.getAllSelectedObjects();
if(_1149.length==1&&_1149[0].isHomeCell&&_1149[0].isHomeCell()==false){
var _114a=_1149[0].isSelectionOnVizChart();
if(!_114a){
var _114b=oCV.getAdvancedServerProperty("VIEWER_JS_ENABLE_DRILL_SUBMENU");
_114a=(_114b=="charts"&&_1148.hasSelectedChartNodes());
}
if(_114a){
var _114c=_1149[0];
return (_114a&&_114c.getUseValues()&&(_114c.getUseValues().length>1||_114c.getUseValues()[0].length>1));
}
}
}
return false;
};
DrillContextMenuHelper.addSubMenuItem=function(_114d,_114e,_114f,iDim,_1151){
var _1152=_114f.getDrillOptions()[iDim][_1151];
if(DrillContextMenuHelper.isOptionDrillable(_114d,_1152)){
var _1153=DrillContextMenuHelper.getItemValue(_114f,iDim,_1151);
if(_1153){
var _1154=_114f.getDataItems()[iDim][_1151];
var _1155={name:_114d,label:_1153,action:{name:_114d,payload:{userSelectedDrillItem:_1154}}};
_114e.push(_1155);
}
}
};
DrillContextMenuHelper.completeDrillMenu=function(_1156,_1157,_1158){
if(_1157.length>0){
_1158.items=_1157;
}else{
_1158.items=null;
if(_1158.action==null){
_1158.action={name:_1156,action:{name:_1156}};
}
}
};
DrillContextMenuHelper.isOptionDrillable=function(_1159,_115a){
return (_115a>=3||(_1159=="DrillDown"&&_115a==2)||(_1159=="DrillUp"&&_115a==1));
};
DrillContextMenuHelper.getItemValue=function(_115b,iDim,_115d){
var _115e=(_115d==0)?_115b.getDisplayValues()[iDim]:null;
return ((_115e)?_115e:_115b.getUseValues()[iDim][_115d]);
};
function DrillAction(){
};
DrillAction.prototype=new CognosViewerAction();
DrillAction.prototype.setRequestParms=function(parms){
if(parms&&parms.userSelectedDrillItem){
this.m_userSelectedDrillItem=parms.userSelectedDrillItem;
}
};
DrillAction.prototype.submitDrillRequest=function(_1160,_1161,_1162){
var oCV=this.getCognosViewer();
var oReq=new ViewerDispatcherEntry(oCV);
oReq.addFormField("ui.action","drill");
oReq.addFormField("rv_drillOption",_1161);
oReq.addFormField("rv_drillparams",_1160);
oReq.addFormField("rv_drillRefQuery",_1162);
oCV.dispatchRequest(oReq);
};
function DrillDownAction(){
this.m_sAction="DrillDown";
};
DrillDownAction.prototype=new DrillAction();
DrillDownAction.prototype.updateMenu=function(_1165){
return _1165;
};
DrillDownAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _1167=oCV.getDrillMgr();
if(_1167.canDrillDown()==false){
return;
}
var _1168=_1167.rvBuildXMLDrillParameters("drillDown",this.m_userSelectedDrillItem);
var _1169=_1167.getRefQuery();
if(oCV.envParams["cv.id"]=="AA"){
oCV.m_viewerFragment.raiseAADrillDownEvent();
}
this.submitDrillRequest(_1168,"down",_1169);
};
function DrillUpAction(){
this.m_sAction="DrillUp";
};
DrillUpAction.prototype=new DrillAction();
DrillUpAction.prototype.updateMenu=function(_116a){
return _116a;
};
DrillUpAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _116c=oCV.getDrillMgr();
if(_116c.canDrillUp()==false){
return;
}
var _116d=_116c.rvBuildXMLDrillParameters("drillUp",this.m_userSelectedDrillItem);
var _116e=_116c.getRefQuery();
if(oCV.envParams["cv.containerApp"]=="AA"){
oCV.m_viewerFragment.raiseAADrillUpEvent();
}
this.submitDrillRequest(_116d,"up",_116e);
};
function ResizeChartAction(){
this.m_width=0;
this.m_height=0;
this.m_actionContext=null;
};
ResizeChartAction.prototype=new CognosViewerAction();
ResizeChartAction.prototype.setRequestParms=function(_116f){
if(_116f&&_116f.resize){
this.m_width=_116f.resize.w;
this.m_height=_116f.resize.h;
this.m_actionContext=_116f.resize.actionContext;
}
};
ResizeChartAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var oReq=new ViewerDispatcherEntry(oCV);
oReq.addFormField("ui.action","modifyReport");
if(!this.m_actionContext){
this.m_actionContext="<reportActions><ChangeDataContainerSize><idSelectAll/><height>"+this.m_height+"</height><width>"+this.m_width+"</width></ChangeDataContainerSize></reportActions>";
}
oReq.addFormField("cv.actionContext",this.m_actionContext);
oReq.addFormField("keepIterators","true");
oReq.addFormField("cv.reuseConversation","true");
oReq.addFormField("reuseResults","true");
oReq.addDefinedFormField("ui.spec",oCV.envParams["ui.spec"]);
oReq.addDefinedFormField("modelPath",oCV.getModelPath());
oReq.addDefinedFormField("packageBase",oCV.envParams["packageBase"]);
oReq.setCanBeQueued(true);
oCV.dispatchRequest(oReq);
};
function CCognosViewerSaveReport(_1172,_1173){
this.m_cognosViewer=_1172;
this.m_params=null;
this.dashboardToSaveIn=_1173.cm$storeID;
this.m_doSaveAsOnFault=false;
};
CCognosViewerSaveReport.prototype.canSave=function(_1174){
return (this.doSaveAs()||_1174&&_1174.indexOf("write")!==-1);
};
CCognosViewerSaveReport.prototype.isSavedOutput=function(){
var _1175=this.m_cognosViewer.envParams["ui.action"];
return (typeof _1175!=="undefined"&&_1175==="view");
};
CCognosViewerSaveReport.prototype.doSaveAs=function(){
var _1176=(this.m_doSaveAsOnFault||!this.m_cognosViewer.envParams["savedReportName"]||!this.isSameDashboard());
return _1176;
};
CCognosViewerSaveReport.prototype.isSameDashboard=function(){
var _1177=(this.m_cognosViewer.envParams["ui.object"].indexOf(this.dashboardToSaveIn)!==-1);
return _1177;
};
CCognosViewerSaveReport.prototype.getUIAction=function(){
return (this.doSaveAs()?"saveInDashboard":"updateSavedReport");
};
CCognosViewerSaveReport.prototype.populateRequestParams=function(_1178){
_1178.addFormField("ui.action",this.getUIAction());
_1178.addFormField("cv.ignoreState","true");
_1178.addFormField("dashboard-id",this.dashboardToSaveIn);
_1178.addNonEmptyStringFormField("executionParameters",this.m_cognosViewer.m_sParameters);
for(var param in this.m_cognosViewer.envParams){
if(param.indexOf("frag-")==0||param=="cv.actionState"||param=="ui.primaryAction"||param=="dashboard"||param=="ui.action"||param=="cv.responseFormat"||param=="b_action"){
continue;
}
_1178.addFormField(param,this.m_cognosViewer.envParams[param]);
}
};
CCognosViewerSaveReport.prototype.getCognosViewer=function(){
return this.m_cognosViewer;
};
CCognosViewerSaveReport.prototype.getViewerWidget=function(){
return this.getCognosViewer().getViewerWidget();
};
CCognosViewerSaveReport.prototype.dispatchRequest=function(){
var _117a=this.m_cognosViewer;
var _117b=this.getViewerWidget();
var _117c={"complete":{"object":_117b,"method":_117b.handleWidgetSaveDone},"fault":{"object":this,"method":this.onFault}};
var _117d=new AsynchJSONDispatcherEntry(_117a);
_117d.setCallbacks(_117c);
this.populateRequestParams(_117d);
_117a.dispatchRequest(_117d);
};
CCognosViewerSaveReport.prototype.onFault=function(_117e,arg1){
var _1180=this.m_cognosViewer;
var _1181=this.getViewerWidget();
var _1182=_117e.getSoapFault();
var _1183=XMLHelper_FindChildByTagName(_1182,"Fault",true);
if(this.ifIsEmptySelectionFault(_1183)){
this.handleEmptySelectionFault();
return;
}
var _1184=_1182.createElement("allowRetry");
_1184.appendChild(_1182.createTextNode("false"));
_1183.appendChild(_1184);
var _1185=XMLBuilderSerializeNode(_1183);
_1180.setSoapFault(_1185);
_1181.handleFault();
var _1186={"status":false};
_1181.iContext.iEvents.fireEvent("com.ibm.bux.widget.save.done",null,_1186);
};
CCognosViewerSaveReport.prototype.ifIsEmptySelectionFault=function(_1187){
if(_1187){
var _1188=XMLHelper_FindChildByTagName(_1187,"errorCode",true);
if(_1188){
var _1189=XMLHelper_GetText(_1188,false);
return (_1189==="cmEmptySelection");
}
}
return false;
};
CCognosViewerSaveReport.prototype.handleEmptySelectionFault=function(){
delete (this.m_cognosViewer.envParams["savedReportName"]);
this.m_doSaveAsOnFault=true;
this.dispatchRequest();
};
function XmlHttpObject(){
this.m_formFields=new CDictionary();
this.xmlHttp=XmlHttpObject.createRequestObject();
this.m_requestIndicator=null;
this.m_httpCallbacks={};
this.m_asynch=true;
this.m_headers=null;
};
XmlHttpObject.prototype.setHeaders=function(_118a){
this.m_headers=_118a;
};
XmlHttpObject.prototype.getHeaders=function(){
return this.m_headers;
};
XmlHttpObject.prototype.newRequest=function(){
var _118b=new XmlHttpObject();
_118b.init(this.m_action,this.m_gateway,this.m_url,this.m_asynch);
this.executeHttpCallback("newRequest");
return _118b;
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
XmlHttpObject.prototype.executeHttpCallback=function(_118c){
if(this.m_httpCallbacks&&this.m_httpCallbacks[_118c]){
var _118d=this.concatResponseArguments(this.m_httpCallbacks.customArguments);
var _118e=GUtil.generateCallback(this.m_httpCallbacks[_118c].method,_118d,this.m_httpCallbacks[_118c].object);
_118e();
return true;
}
return false;
};
XmlHttpObject.prototype.setCallbacks=function(_118f){
if(!this.m_httpCallbacks){
this.m_httpCallbacks={};
}
for(callback in _118f){
this.m_httpCallbacks[callback]=_118f[callback];
}
};
XmlHttpObject.prototype.getCallbacks=function(){
return this.m_httpCallbacks;
};
XmlHttpObject.createRequestObject=function(){
var _1190=null;
if(window.XMLHttpRequest){
_1190=new XMLHttpRequest();
}else{
if(window.ActiveXObject){
_1190=new ActiveXObject("Msxml2.XMLHTTP");
}else{
}
}
return _1190;
};
XmlHttpObject.prototype.waitForXmlHttpResponse=function(){
var _1191=this.xmlHttp;
if(_1191&&_1191.readyState===4){
if(_1191.status===200){
this.httpSuccess();
}else{
this.httpError();
}
}else{
}
};
XmlHttpObject.prototype.init=function(_1192,_1193,url,_1195){
this.m_action=_1192;
this.m_gateway=_1193;
this.m_url=url;
this.m_asynch=_1195;
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
XmlHttpObject.prototype.sendHtmlRequest=function(_1196,_1197,url,async){
var _119a=this.xmlHttp;
if(_119a){
_119a.open(_1196,_1197,async);
if(async){
_119a.onreadystatechange=GUtil.generateCallback(this.waitForXmlHttpResponse,[],this);
}else{
_119a.onreadystatechange=GUtil.generateCallback(this.waitForXmlHttpResponse,[],this);
if(!isIE()){
_119a.onload=GUtil.generateCallback(this.httpSuccess,[],this);
_119a.onerror=GUtil.generateCallback(this.httpError,[],this);
}
}
_119a.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
if(this.m_headers){
for(header in this.m_headers){
_119a.setRequestHeader(header,this.m_headers[header]);
}
}
this.executeHttpCallback("preHttpRequest");
var _119b=this.convertFormFieldsToUrl();
if(url){
_119b+=url;
}
_119a.send(_119b);
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
XmlHttpObject.prototype.addFormField=function(name,value){
this.m_formFields.add(name,value);
};
XmlHttpObject.prototype.getFormFields=function(){
return this.m_formFields;
};
XmlHttpObject.prototype.getFormField=function(_119f){
return this.m_formFields.get(_119f);
};
XmlHttpObject.prototype.clearFormFields=function(){
this.m_formFields=new CDictionary();
};
XmlHttpObject.prototype.convertFormFieldsToUrl=function(){
var url="";
var _11a1=this.m_formFields.keys();
for(var index=0;index<_11a1.length;index++){
if(index>0){
url+="&";
}
url+=encodeURIComponent(_11a1[index])+"="+encodeURIComponent(this.m_formFields.get(_11a1[index]));
}
return url;
};
XmlHttpObject.prototype.concatResponseArguments=function(_11a3){
var _11a4=[this];
if(_11a3){
_11a4=_11a4.concat(_11a3);
}
return _11a4;
};
function AsynchRequest(_11a5,_11a6){
AsynchRequest.baseConstructor.call(this);
this.m_gateway=_11a5;
this.m_webContentRoot=_11a6;
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
AsynchRequest.prototype.executeCallback=function(_11a7){
if(this.m_callbacks[_11a7]){
var _11a8=this.concatResponseArguments(this.m_callbacks.customArguments);
var _11a9=GUtil.generateCallback(this.m_callbacks[_11a7].method,_11a8,this.m_callbacks[_11a7].object);
_11a9();
return true;
}
return false;
};
AsynchRequest.prototype.setCallbacks=function(_11aa){
if(!this.m_callbacks){
this.m_callbacks={};
}
for(callback in _11aa){
this.m_callbacks[callback]=_11aa[callback];
}
};
AsynchRequest.prototype.getCallbacks=function(){
return this.m_callbacks;
};
AsynchRequest.prototype.newRequest=function(){
var _11ab=this.construct();
_11ab.setHeaders(this.getHeaders());
if(this.getFormFields().exists("b_action")){
_11ab.addFormField("b_action",this.getFormField("b_action"));
}
if(this.getFormFields().exists("cv.catchLogOnFault")){
_11ab.addFormField("cv.catchLogOnFault",this.getFormField("cv.catchLogOnFault"));
}
_11ab.setPromptDialog(this.m_promptDialog);
_11ab.setFaultDialog(this.m_faultDialog);
_11ab.setLogonDialog(this.m_logonDialog);
_11ab.m_asynch=this.m_asynch;
if(this.m_callbacks.newRequest){
var _11ac=GUtil.generateCallback(this.m_callbacks.newRequest.method,[_11ab],this.m_callbacks.newRequest.object);
_11ac();
}
return _11ab;
};
AsynchRequest.prototype.success=function(){
var _11ad=this.getAsynchStatus();
switch(_11ad){
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
AsynchRequest.prototype.setFaultDialog=function(_11ae){
if(_11ae instanceof IFaultDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setFaultDialog is deprecated");
}
this.m_faultDialog=_11ae;
}else{
if(_11ae&&typeof console!="undefined"){
console.log("The parameter faultDialog must be an instance of IFaultDialog");
}
}
};
AsynchRequest.prototype.setPromptDialog=function(_11af){
if(_11af instanceof IPromptDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setPromptDialog is deprecated");
}
this.m_promptDialog=_11af;
}else{
if(_11af&&typeof console!="undefined"){
console.log("The parameter promptDialog must be an instance of IPromptDialog");
}
}
};
AsynchRequest.prototype.setLogonDialog=function(_11b0){
if(_11b0 instanceof ILogOnDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setLogonDialog is deprecated");
}
this.m_logonDialog=_11b0;
}else{
if(_11b0&&typeof console!="undefined"){
console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
}
}
};
AsynchRequest.prototype.resubmitRequest=function(){
var _11b1=this.newRequest();
_11b1.m_formFields=this.m_formFields;
_11b1.sendRequest();
return _11b1;
};
AsynchRequest.prototype.sendRequest=function(){
var _11b2=this;
var _11b3={"complete":{"object":_11b2,"method":_11b2.successHandler},"fault":{"object":_11b2,"method":_11b2.errorHandler}};
this.init("POST",this.m_gateway,"",this.m_asynch);
this.executeCallback("preHttpRequest");
this.parent.setCallbacks.call(this,_11b3);
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
var _11b4=this.getResponseText();
if(_11b4.indexOf("<ERROR_CODE>CAM_PASSPORT_ERROR</ERROR_CODE>")!=-1){
this.passportTimeout();
}else{
this.executeCallback("entryFault");
if(!this.executeCallback("fault")){
var _11b5=window.open("","","height=400,width=500");
if(_11b5!=null){
_11b5.document.write(_11b4);
}
}
}
}else{
this.m_soapFault=this.constructFaultEnvelope();
if(this.m_soapFault!=null){
var _11b6=XMLHelper_FindChildByTagName(this.m_soapFault,"CAM",true);
if(_11b6!=null&&XMLHelper_FindChildByTagName(_11b6,"promptInfo",true)){
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
var _11b7=this.getFormField("m_tracking");
if(_11b7){
var _11b8=new XmlHttpObject();
_11b8.init("POST",this.m_gateway,"",false);
if(this.getFormField("cv.outputKey")){
_11b8.addFormField("b_action","cvx.high");
_11b8.addFormField("cv.outputKey",this.getFormField("cv.outputKey"));
_11b8.setHeaders(this.getHeaders());
}else{
_11b8.addFormField("b_action","cognosViewer");
}
_11b8.addFormField("cv.responseFormat","successfulRequest");
_11b8.addFormField("ui.action","cancel");
_11b8.addFormField("m_tracking",_11b7);
if(this.getFormField("cv.debugDirectory")){
_11b8.addFormField("cv.debugDirectory",this.getFormField("cv.debugDirectory"));
}
_11b8.sendRequest();
this.executeCallback("cancel");
}
};
AsynchRequest.prototype.working=function(){
this.executeCallback("working");
var _11b9=this.newRequest();
_11b9.addFormField("m_tracking",this.getTracking());
if(this.getFormField("cv.outputKey")){
_11b9.addFormField("cv.outputKey",this.getFormField("cv.outputKey"));
_11b9.addFormField("b_action","cvx.high");
}
if(this.isRAPWaitTrue()){
_11b9.m_formFields=this.m_formFields;
_11b9.addFormField("m_tracking",this.getTracking());
_11b9.addFormField("rapWait","true");
var _11ba=this.getRAPRequestCache();
if(_11ba!==null&&typeof _11ba!="undefined"){
_11b9.addFormField("rapRequestCache",_11ba);
}
var _11bb=this.getMainConversation();
if(_11bb){
_11b9.addFormField("mainConversation",_11bb);
}
var _11bc=this.getMainTracking();
if(_11bc){
_11b9.addFormField("mainTracking",_11bc);
}
}else{
_11b9.addFormField("ui.action","wait");
_11b9.addFormField("ui.primaryAction",this.getPrimaryAction());
_11b9.addFormField("cv.actionState",this.getActionState());
if(this.getFormField("ui.preserveRapTags")){
_11b9.addFormField("ui.preserveRapTags",this.getFormField("ui.preserveRapTags"));
}
if(this.getFormField("ui.backURL")){
_11b9.addFormField("ui.backURL",this.getFormField("ui.backURL"));
}
if(this.getFormField("errURL")){
_11b9.addFormField("errURL",this.getFormField("errURL"));
}
if(this.getFormField("cv.showFaultPage")){
_11b9.addFormField("cv.showFaultPage",this.getFormField("cv.showFaultPage"));
}
if(this.getFormField("cv.catchLogOnFault")){
_11b9.addFormField("cv.catchLogOnFault",this.getFormField("cv.catchLogOnFault"));
}
}
if(this.getFormField("bux")){
_11b9.addFormField("bux",this.getFormField("bux"));
}
if(this.getFormField("cv.debugDirectory")){
_11b9.addFormField("cv.debugDirectory",this.getFormField("cv.debugDirectory"));
}
_11b9.sendRequest();
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
AsynchRequest.prototype.promptPageOkCallback=function(_11bd){
var _11be=this.newRequest();
_11be.addFormField("ui.action","forward");
_11be.addFormField("m_tracking",this.getTracking());
_11be.addFormField("ui.conversation",this.getConversation());
_11be.addFormField("ui.primaryAction",this.getPrimaryAction());
_11be.addFormField("cv.actionState",this.getActionState());
for(var _11bf in _11bd){
_11be.addFormField(_11bf,_11bd[_11bf]);
}
_11be.sendRequest();
window["AsynchRequestObject"]=null;
};
AsynchRequest.prototype.promptPageCancelCallback=function(){
window["AsynchRequestPromptDialog"].hide();
this.complete();
};
AsynchRequest.prototype.showPromptPage=function(){
window["AsynchRequestObject"]=this;
window["AsynchRequestPromptDialog"]=this.m_promptDialog;
var _11c0=this.m_promptDialog.getViewerId()==null?"":"?cv.id="+this.m_promptDialog.getViewerId();
window["AsynchRequestPromptDialog"].initialize(this.m_webContentRoot+"/rv/showStandalonePrompts.html"+_11c0,400,400);
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
var _11c1=this.constructFaultEnvelope();
if(_11c1){
var _11c2=XMLHelper_FindChildByTagName(_11c1,"faultcode",true);
if(_11c2!=null){
return XMLHelper_GetText(_11c2);
}
}
return null;
};
AsynchRequest.prototype.getSoapFaultDetailMessageString=function(){
var _11c3=this.constructFaultEnvelope();
if(_11c3){
var entry=XMLHelper_FindChildByTagName(_11c3,"messageString",true);
if(entry!=null){
return XMLHelper_GetText(entry);
}
}
return null;
};
function AsynchDATARequest(_11c5,_11c6){
AsynchDATARequest.baseConstructor.call(this,_11c5,_11c6);
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
var _11c7=this.getResponseText().substring(0,12);
if(_11c7==this.cStatePrefix){
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
var state=this.getResponseState();
if(state!=null){
if(state.m_sSoapFault){
var _11c9=state.m_sSoapFault;
this.m_soapFault=XMLBuilderLoadXMLFromString(_11c9);
}
}
}
return this.m_soapFault;
};
AsynchDATARequest.prototype.construct=function(){
var _11ca=new AsynchDATARequest(this.m_gateway,this.m_webContentRoot);
_11ca.setCallbacks(this.m_callbacks);
if(this.getFormFields().exists("cv.responseFormat")){
_11ca.addFormField("cv.responseFormat",this.getFormField("cv.responseFormat"));
}else{
_11ca.addFormField("cv.responseFormat","data");
}
return _11ca;
};
AsynchDATARequest.prototype.getEnvParam=function(param){
var _11cc=this.getResponseState();
if(_11cc&&typeof _11cc.envParams!="undefined"&&typeof _11cc.envParams[param]!="undefined"){
return _11cc.envParams[param];
}
return null;
};
AsynchDATARequest.prototype.isRAPWaitTrue=function(){
var _11cd=this.getEnvParam("rapWait");
if(_11cd!=null){
return _11cd=="true"?true:false;
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
function AsynchJSONRequest(_11ce,_11cf){
AsynchJSONRequest.baseConstructor.call(this,_11ce,_11cf);
this.m_jsonResponse=null;
};
AsynchJSONRequest.prototype=new AsynchRequest();
AsynchJSONRequest.baseConstructor=AsynchRequest;
AsynchJSONRequest.prototype.getJSONResponseObject=function(){
if(this.m_jsonResponse==null){
if(this.getResponseHeader("Content-type").indexOf("application/json")!=-1){
var text=this.getResponseText();
if(text!=null){
var _11d1=this.removeInvalidCharacters(text);
this.m_jsonResponse=eval("("+_11d1+")");
}
}
}
return this.m_jsonResponse;
};
AsynchJSONRequest.prototype.getTracking=function(){
var _11d2=this.getJSONResponseObject();
if(_11d2){
return _11d2.tracking;
}
return "";
};
AsynchJSONRequest.prototype.getConversation=function(){
var _11d3=this.getJSONResponseObject();
if(_11d3){
return _11d3.conversation;
}
return "";
};
AsynchJSONRequest.prototype.getAsynchStatus=function(){
var _11d4=this.getJSONResponseObject();
if(_11d4){
return _11d4.status;
}
return "unknown";
};
AsynchJSONRequest.prototype.getPrimaryAction=function(){
var _11d5=this.getJSONResponseObject();
if(_11d5){
return _11d5.primaryAction;
}
return "";
};
AsynchJSONRequest.prototype.getActionState=function(){
var _11d6=this.getJSONResponseObject();
if(_11d6){
return _11d6.actionState;
}
return "";
};
AsynchJSONRequest.prototype.getDebugLogs=function(){
var _11d7=this.getJSONResponseObject();
if(_11d7){
return _11d7.debugLogs;
}
return "";
};
AsynchJSONRequest.prototype.isRAPWaitTrue=function(){
var _11d8=this.getJSONResponseObject();
if(_11d8){
return (_11d8.rapWait==="true");
}
return false;
};
AsynchJSONRequest.prototype.getRAPRequestCache=function(){
var _11d9=this.getJSONResponseObject();
if(_11d9){
var _11da=_11d9.rapRequestCache;
if(_11da!==null&&typeof _11da!="undefined"){
return _11da;
}
}
return null;
};
AsynchJSONRequest.prototype.getMainConversation=function(){
var _11db=this.getJSONResponseObject();
if(_11db){
return _11db.mainConversation;
}
return null;
};
AsynchJSONRequest.prototype.getMainTracking=function(){
var _11dc=this.getJSONResponseObject();
if(_11dc){
return _11dc.mainTracking;
}
return null;
};
AsynchJSONRequest.prototype.getResult=function(){
var _11dd=this.getJSONResponseObject();
if(_11dd&&_11dd.json){
var _11de=this.removeInvalidCharacters(_11dd.json);
return eval("("+_11de+")");
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
var _11e0=this.getJSONResponseObject();
if(_11e0&&_11e0.promptHTMLFragment){
return _11e0.promptHTMLFragment;
}
return "";
};
AsynchJSONRequest.prototype.constructFaultEnvelope=function(){
if(this.m_soapFault==null){
var _11e1=this.getJSONResponseObject();
if(_11e1.status=="fault"){
this.m_soapFault=XMLBuilderLoadXMLFromString(_11e1.fault);
}
}
return this.m_soapFault;
};
AsynchJSONRequest.prototype.construct=function(){
var _11e2=new AsynchJSONRequest(this.m_gateway,this.m_webContentRoot);
_11e2.setCallbacks(this.m_callbacks);
if(this.getFormFields().exists("cv.responseFormat")){
_11e2.addFormField("cv.responseFormat",this.getFormField("cv.responseFormat"));
}else{
_11e2.addFormField("cv.responseFormat","asynchJSON");
}
return _11e2;
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
ILogOnDialog.prototype.show=function(_11e3){
if(typeof console!="undefined"){
console.log("Required method ILogOnDialog:show not implemented.");
}
};
ILogOnDialog.prototype.handleUnknownHTMLResponse=function(_11e4){
if(typeof console!="undefined"){
console.log("Required method ILogOnDialog:handleUnknownHTMLResponse not implemented.");
}
};
function IPromptDialog(){
};
IPromptDialog.prototype.initialize=function(url,width,_11e7){
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
IRequestHandler.prototype.preHttpRequest=function(_11e8){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:preHttpRequest not implemented.");
}
};
IRequestHandler.prototype.postHttpRequest=function(_11e9){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:postHttpRequest not implemented.");
}
};
IRequestHandler.prototype.postComplete=function(_11ea){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:postComplete not implemented.");
}
};
IRequestHandler.prototype.onComplete=function(_11eb){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onComplete not implemented.");
}
};
IRequestHandler.prototype.onPostEntryComplete=function(_11ec){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onPostEntryComplete not implemented.");
}
};
IRequestHandler.prototype.onFault=function(_11ed){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onFault not implemented.");
}
};
IRequestHandler.prototype.onPrompting=function(_11ee){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onPrompting not implemented.");
}
};
IRequestHandler.prototype.onWorking=function(_11ef){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onWorking not implemented.");
}
};
IRequestHandler.prototype.setWorkingDialog=function(_11f0){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:setWorkingDialog not implemented.");
}
};
IRequestHandler.prototype.setRequestIndicator=function(_11f1){
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
BaseRequestHandler.prototype.onError=function(_11f3){
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
BaseRequestHandler.prototype.setDispatcherEntry=function(_11f4){
this.m_oDispatcherEntry=_11f4;
};
BaseRequestHandler.prototype.getDispatcherEntry=function(){
return this.m_oDispatcherEntry;
};
BaseRequestHandler.prototype.processInitialResponse=function(_11f5){
this.updateViewerState(_11f5);
};
BaseRequestHandler.prototype.setLogOnDialog=function(_11f6){
if(_11f6==null){
this.m_logOnDialog=null;
}else{
if(_11f6 instanceof ILogOnDialog){
this.m_logOnDialog=_11f6;
}else{
if(_11f6&&typeof console!="undefined"){
console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
}
}
}
};
BaseRequestHandler.prototype.setWorkingDialog=function(_11f7){
if(_11f7==null){
this.m_workingDialog=null;
}else{
if(this.m_httpRequestConfig&&this.m_httpRequestConfig.getWorkingDialog()){
this.m_workingDialog=this.m_httpRequestConfig.getWorkingDialog();
}else{
if(_11f7 instanceof IRequestIndicator){
this.m_workingDialog=_11f7;
}else{
if(_11f7&&typeof console!="undefined"){
console.log("The parameter workingDialog must be an instance of IRequestIndicator");
}
}
}
}
};
BaseRequestHandler.prototype.getWorkingDialog=function(){
return this.m_workingDialog;
};
BaseRequestHandler.prototype.setRequestIndicator=function(_11f8){
if(_11f8==null){
this.m_requestIndicator=null;
}else{
if(this.m_httpRequestConfig&&this.m_httpRequestConfig.getRequestIndicator()){
this.m_requestIndicator=this.m_httpRequestConfig.getRequestIndicator();
}else{
if(_11f8 instanceof IRequestIndicator){
this.m_requestIndicator=_11f8;
}else{
if(_11f8&&typeof console!="undefined"){
console.log("The parameter requestIndicator must be an instance of IRequestIndicator");
}
}
}
}
};
BaseRequestHandler.prototype.getRequestIndicator=function(){
return this.m_requestIndicator;
};
BaseRequestHandler.prototype.setFaultDialog=function(_11f9){
if(_11f9==null){
this.m_faultDialog=null;
}else{
if(_11f9 instanceof IFaultDialog){
this.m_faultDialog=_11f9;
}else{
if(_11f9&&typeof console!="undefined"){
console.log("The parameter faultDialog must be an instance of IFaultDialog");
}
}
}
};
BaseRequestHandler.prototype.setPromptDialog=function(_11fa){
if(_11fa==null){
this.m_promptDialog=null;
}else{
if(_11fa instanceof IPromptDialog){
this.m_promptDialog=_11fa;
}else{
if(_11fa&&typeof console!="undefined"){
console.log("The parameter promptDialog must be an instance of IPromptDialog");
}
}
}
};
BaseRequestHandler.prototype.preHttpRequest=function(_11fb){
if(_11fb&&typeof _11fb.getFormField=="function"){
if(_11fb.getFormField("ui.action")!="wait"&&_11fb.getFormField("rapWait")!="true"){
if(this.m_requestIndicator){
this.m_requestIndicator.show();
}
}
}
};
BaseRequestHandler.prototype.postHttpRequest=function(_11fc){
if(_11fc&&typeof _11fc.getAsynchStatus=="function"){
var _11fd=_11fc.getAsynchStatus();
if(_11fd!="working"&&_11fd!="stillWorking"){
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
BaseRequestHandler.prototype.onFault=function(_11fe){
var oCV=this.getViewer();
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
if(typeof FaultDialog=="undefined"){
if(typeof console!="undefined"){
console.log("An unhandled fault was returned: %o",_11fe);
}
return;
}
if(!this.m_faultDialog){
this.m_faultDialog=new FaultDialog(this.getViewer());
}
if(_11fe&&_11fe.getResponseHeader&&_11fe.getResponseHeader("Content-type").indexOf("text/html")!=-1){
this.m_faultDialog.handleUnknownHTMLResponse(_11fe.getResponseText());
}else{
if(_11fe&&_11fe.getSoapFault){
this.m_faultDialog.show(_11fe.getSoapFault());
}else{
if(oCV.getSoapFault()){
var _1200=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
this.m_faultDialog.show(_1200);
oCV.setSoapFault("");
}else{
if(typeof console!="undefined"){
console.log("An unhandled fault was returned: %o",_11fe);
}
}
}
}
};
BaseRequestHandler.prototype.isAuthenticationFault=function(_1201){
var oCV=this.getViewer();
var _1203=null;
if(_1201&&_1201.getSoapFault){
_1203=_1201.getSoapFault();
}else{
if(oCV.getSoapFault()){
_1203=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
}
}
if(_1203!=null){
var _1204=XMLHelper_FindChildByTagName(_1203,"CAM",true);
return (_1204!=null&&XMLHelper_FindChildByTagName(_1204,"promptInfo",true)!=null);
}
return false;
};
BaseRequestHandler.prototype.onPassportTimeout=function(_1205){
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
if(_1205&&_1205.getResponseHeader&&_1205.getResponseHeader("Content-type").indexOf("text/html")!=-1){
this.m_logOnDialog.handleUnknownHTMLResponse(_1205.getResponseText());
}else{
if(_1205&&_1205.getSoapFault){
this.m_logOnDialog.show(_1205.getSoapFault());
}else{
if(oCV.getSoapFault()){
var _1207=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
this.m_logOnDialog.show(_1207);
oCV.setSoapFault("");
}else{
if(typeof console!="undefined"){
console.log("BaseRequestHandler.prototype.onPassportTimeout: An unhandled authentication fault was returned: %o",_1205);
}
}
}
}
};
BaseRequestHandler.prototype.onWorking=function(_1208){
if(this.m_workingDialog){
var _1209=_1208&&typeof _1208.getAsynchStatus=="function"&&_1208.getAsynchStatus()=="stillWorking"?true:false;
if(!_1209){
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
var _120c=oCV.getViewerWidget();
if(_120c.getLoadManager()){
_120c.getLoadManager().processQueue();
}
}
};
BaseRequestHandler.prototype.onPrompting=function(_120d){
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
window["AsynchRequestObject"]=_120d;
window["AsynchRequestPromptDialog"]=this.m_promptDialog;
var _120f="?cv.id="+oCV.getId();
window["AsynchRequestPromptDialog"].initialize(oCV.getWebContentRoot()+"/rv/showStandalonePrompts.html"+_120f,400,400);
window["AsynchRequestPromptDialog"].show();
};
BaseRequestHandler.prototype.processDATAReportResponse=function(_1210){
var oCV=this.getViewer();
if(!oCV||oCV.m_destroyed){
if(console){
console.warn("Tried to process a data response on an invalid CCognosViewer",oCV);
}
return;
}
var _1212=_1210.getResponseState();
if(!_1212){
this.resubmitInSafeMode();
}
if(this.loadReportHTML(_1210.getResult())===false){
this.resubmitInSafeMode();
}
this.updateViewerState(_1212);
};
BaseRequestHandler.prototype.updateViewerState=function(_1213){
var oCV=this.getViewer();
applyJSONProperties(oCV,_1213);
var _1215=oCV.getStatus();
if(typeof oCV.envParams["ui.spec"]!="undefined"&&oCV.envParams["ui.spec"].indexOf("&lt;")===0){
oCV.envParams["ui.spec"]=xml_decode(oCV.envParams["ui.spec"]);
}
if(_1215!="fault"){
if(oCV.envParams["rapReportInfo"]){
this._processRapReportInfo(oCV);
}
if(typeof _1213.clientunencodedexecutionparameters!="undefined"){
var _1216=document.getElementById("formWarpRequest"+oCV.getId());
if(_1216!=null&&typeof _1216["clientunencodedexecutionparameters"]!="undefined"){
_1216["clientunencodedexecutionparameters"].value=_1213.clientunencodedexecutionparameters;
}
if(typeof document.forms["formWarpRequest"]!="undefined"&&typeof document.forms["formWarpRequest"]["clientunencodedexecutionparameters"]!="undefined"){
document.forms["formWarpRequest"]["clientunencodedexecutionparameters"].value=_1213.clientunencodedexecutionparameters;
}
}
}else{
oCV.setTracking("");
}
};
BaseRequestHandler.prototype._processRapReportInfo=function(oCV){
if(oCV.envParams["rapReportInfo"]){
var _1218=eval("("+oCV.envParams["rapReportInfo"]+")");
if(typeof RAPReportInfo!="undefined"){
var _1219=new RAPReportInfo(_1218,oCV);
oCV.setRAPReportInfo(_1219);
}
}
};
BaseRequestHandler.prototype.loadReportHTML=function(_121a){
var oCV=this.getViewer();
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_gotHtml",oCV);
}
if(oCV.m_undoStack.length>0){
oCV.m_undoStack[oCV.m_undoStack.length-1].m_bRefreshPage=true;
}
oCV.pageNavigationObserverArray=[];
oCV.m_flashChartsObjectIds=[];
var sHTML=_121a.replace(/<form[^>]*>/gi,"").replace(/<\/form[^>]*>/gi,"");
oCV.m_sHTML=sHTML;
oCV.setHasPrompts(false);
var id=oCV.getId();
var _121e=document.getElementById("RVContent"+id);
var _121f=document.getElementById("CVReport"+id);
if(sHTML.match(/prompt\/control\.js|PRMTcompiled\.js|prmt_core\.js/gi)){
oCV.setHasPrompts(true);
_121f.style.display="none";
}
if(window.gScriptLoader){
var _1220=oCV.getViewerWidget()?true:false;
var _1221=oCV.getViewerWidget()?document.getElementById("_"+oCV.getViewerWidget().iContext.widgetId+"_cv"):_121f;
sHTML=window.gScriptLoader.loadCSS(sHTML,_1221,_1220,id);
}
if(oCV.sBrowser=="ie"){
sHTML="<span style='display:none'>&nbsp;</span>"+sHTML;
}
_121f.innerHTML=sHTML;
this.massageHtmlBeforeDisplayed();
if(window.gScriptLoader){
var _1222=GUtil.generateCallback(oCV.showLoadedContent,[_121e],oCV);
oCV.m_resizeReady=false;
if(!window.gScriptLoader.loadAll(_121f,_1222,id,true)){
if(window.gScriptLoader.containsAjaxWarnings()){
return false;
}
}
}else{
_121e.style.display="block";
}
oCV.updateOutputForA11ySupport();
this._clearFindState();
return true;
};
BaseRequestHandler.prototype._clearFindState=function(){
var oCV=this.getViewer();
var _1224=oCV.getState()&&oCV.getState().getFindState()?oCV.getState().getFindState():null;
if(_1224&&!_1224.findOnServerInProgress()){
oCV.getState().clearFindState();
}
};
BaseRequestHandler.prototype.showReport=function(){
var oCV=this.getViewer();
var _1226=document.getElementById("CVReport"+oCV.getId());
if(_1226){
_1226.style.display="";
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
BaseRequestHandler.prototype.onAsynchStatusUpdate=function(_1228){
if(this.m_httpRequestConfig){
var _1229=this.m_httpRequestConfig.getReportStatusCallback(_1228);
if(_1229){
_1229();
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
BaseRequestHandler.prototype._addCallback=function(_122a,_122b){
var _122c=_122a;
var _122d=this[_122b];
this[_122b]=function(_122e){
_122d.apply(this,arguments);
var _122f=null;
if(_122e&&typeof _122e.getAsynchStatus=="function"){
_122f=_122e.getAsynchStatus();
}else{
_122f=_122c=="complete"?this.getViewer().getStatus():_122c;
}
if(_122f=="stillWorking"){
return;
}
var _1230=this.m_httpRequestConfig.getReportStatusCallback(_122f);
if(typeof _1230=="function"){
setTimeout(_1230,10);
}
};
};
function ViewerBaseWorkingDialog(_1231){
if(!_1231){
return;
}
this.setCognosViewer(_1231);
this.m_oCV=_1231;
this.m_sNamespace=_1231.getId();
this.m_sGateway=_1231.getGateway();
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
ViewerBaseWorkingDialog.prototype.setCancelSubmitted=function(_1233){
this.m_bCancelSubmitted=_1233;
};
ViewerBaseWorkingDialog.prototype.show=function(){
var _1234=document.getElementById(this.getContainerId());
if(_1234){
_1234.style.display="block";
this.enableCancelButton();
}else{
this.create();
}
var _1235=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_1235){
_1235.style.display="block";
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
ViewerBaseWorkingDialog.prototype.createContainer=function(_1236){
var _1237=document.createElement("div");
_1237.setAttribute("id",this.getContainerId());
_1237.className=_1236?"modalWaitPage":"inlineWaitPage";
return _1237;
};
ViewerBaseWorkingDialog.prototype.createModalWaitDialog=function(){
this._createBlocker();
var _1238=this.createContainer(true);
_1238.innerHTML=this.renderHTML();
_1238.style.zIndex="7002";
_1238.setAttribute("role","region");
_1238.setAttribute("aria-label",RV_RES.GOTO_WORKING);
document.body.appendChild(_1238);
var _1239=this.createModalIframeBackground();
document.body.appendChild(_1239);
var _123a=0;
var iLeft=0;
if(typeof window.innerHeight!="undefined"){
_123a=Math.round((window.innerHeight/2)-(_1238.offsetHeight/2));
iLeft=Math.round((window.innerWidth/2)-(_1238.offsetWidth/2));
}else{
_123a=Math.round((document.body.clientHeight/2)-(_1238.offsetHeight/2));
iLeft=Math.round((document.body.clientWidth/2)-(_1238.offsetWidth/2));
}
_1238.style.bottom=_123a+"px";
_1238.style.left=iLeft+"px";
_1239.style.left=iLeft-1+"px";
_1239.style.bottom=_123a-1+"px";
_1239.style.width=_1238.offsetWidth+2+"px";
_1239.style.height=_1238.offsetHeight+2+"px";
};
ViewerBaseWorkingDialog.prototype._createBlocker=function(){
var _123c=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_123c){
return;
}
var _123d=document.getElementById("mainViewerTable"+this.m_oCV.getId());
if(_123d){
_123c=document.createElement("div");
_123d.parentNode.appendChild(_123c);
_123c.id="reportBlocker"+this.m_oCV.getId();
_123c.style.zIndex="6001";
_123c.style.position="absolute";
_123c.style.top="0px";
_123c.style.left="0px";
_123c.style.width="100%";
_123c.style.height="100%";
_123c.style.display="none";
_123c.style.opacity="0";
_123c.style.backgroundColor="#FFFFFF";
_123c.style.filter="alpha(opacity:0)";
}
};
ViewerBaseWorkingDialog.prototype.createInlineWaitDialog=function(){
var _123e=this.m_oCV.getId();
var _123f=document.getElementById("CVReport"+_123e);
if(_123f){
var _1240=this.createContainer(false);
_1240.innerHTML="<table width=\"100%\" height=\"100%\"><tr><td valign=\"middle\" align=\"center\" role=\"presentation\">"+this.renderHTML()+"</td></tr></table>";
_123f.appendChild(_1240);
}
};
ViewerBaseWorkingDialog.prototype.createModalIframeBackground=function(){
var _1241=document.createElement("iframe");
var _1242="..";
var oCV=this.getCognosViewer();
if(oCV!==null){
_1242=oCV.getWebContentRoot();
}
_1241.setAttribute("id",this.getContainerId()+"Iframe");
_1241.setAttribute("title","Empty iframe");
_1241.setAttribute("src",_1242+"/common/images/spacer.gif");
_1241.setAttribute("scrolling","no");
_1241.setAttribute("frameborder","0");
_1241.style.position="absolute";
_1241.style.zIndex="6002";
_1241.style.display="block";
return _1241;
};
ViewerBaseWorkingDialog.prototype.updateCoords=function(_1244,_1245){
if(this.m_container!==null&&m_iframeBackground!==null){
var _1246=0;
var iLeft=0;
if(typeof window.innerHeight!="undefined"){
_1246=Math.round((window.innerHeight/2)-(_1244.offsetHeight/2));
iLeft=Math.round((window.innerWidth/2)-(_1244.offsetWidth/2));
}else{
_1246=Math.round((document.body.clientHeight/2)-(_1244.offsetHeight/2));
iLeft=Math.round((document.body.clientWidth/2)-(_1244.offsetWidth/2));
}
_1244.style.bottom=_1246+"px";
_1244.style.left=iLeft+"px";
_1245.style.left=_1244.style.left;
_1245.style.bottom=_1244.style.bottom;
_1245.style.width=_1244.offsetWidth+"px";
_1245.style.height=_1244.offsetHeight+"px";
}
};
ViewerBaseWorkingDialog.prototype.hide=function(){
var _1248=document.getElementById(this.getContainerId());
if(_1248){
_1248.parentNode.removeChild(_1248);
}
var _1249=document.getElementById(this.getContainerId()+"Iframe");
if(_1249){
_1249.parentNode.removeChild(_1249);
}
var _124a=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_124a){
_124a.parentNode.removeChild(_124a);
}
};
ViewerBaseWorkingDialog.prototype.isModal=function(){
var _124b=this.m_oCV.getId();
var _124c=document.getElementById("CVReport"+_124b);
var _124d=true;
if(_124c&&_124c.innerHTML===""){
_124d=false;
}
return _124d;
};
ViewerBaseWorkingDialog.prototype.disableCancelButton=function(_124e){
};
ViewerBaseWorkingDialog.prototype.enableCancelButton=function(){
};
function FaultDialog(oCV){
this.m_oCV=oCV;
};
FaultDialog.prototype=new IFaultDialog();
FaultDialog.prototype.show=function(_1250){
if(typeof console!="undefined"){
console.log("FaultDialog - an unhandled soap fault was returned: %o",_1250);
}
};
FaultDialog.prototype.handleUnknownHTMLResponse=function(_1251){
this.m_oCV.setTracking("");
this.m_oCV.setConversation("");
if(_1251){
if(this.m_oCV.envParams["useAlternateErrorCodeRendering"]){
var _1252=document.getElementsByTagName("head")[0];
var _1253=_1251.match(/<body[^>]*>([\s\S]*)<\/body>/im)[1];
var _1254=/<script[^>]*>([\s\S]*?)<\/script>/igm;
var _1255=_1254.exec(_1251);
while(_1255!=null){
var _1256=document.createElement("script");
_1256.type="text/javascript";
var _1257=_1255[0].match(/src="([\s\S]*?)"/i);
if(_1257==null){
_1256.text=_1255[1];
}else{
_1256.src=_1257[1];
}
_1252.appendChild(_1256);
_1255=_1254.exec(_1251);
}
document.body.innerHTML=_1253;
}else{
document.write(_1251);
}
}
};
function LogOnDialog(oCV){
this.m_oCV=oCV;
};
LogOnDialog.prototype=new ILogOnDialog();
LogOnDialog.prototype.handleUnknownHTMLResponse=function(_1259){
if(_1259){
document.write(_1259);
}
};
LogOnDialog.prototype.show=function(_125a){
launchLogOnDialog(this.m_oCV.getId(),_125a);
};
LogOnDialog.prototype.hide=function(){
};
function PromptDialog(oCV){
this.m_oCV=oCV;
this.m_dialogImpl=null;
};
PromptDialog.prototype=new IPromptDialog();
PromptDialog.prototype.initialize=function(url,width,_125e){
this.m_dialogImpl=new CModal("","",document.body,null,null,width,_125e,true,true,false,true,this.m_oCV.getWebContentRoot());
var _125f=document.getElementById(CMODAL_CONTENT_ID);
_125f.src=url;
};
PromptDialog.prototype.show=function(){
this.m_dialogImpl.show();
};
PromptDialog.prototype.hide=function(){
this.m_dialogImpl.hide();
destroyCModal();
};
function WorkingDialog(_1260){
if(_1260){
this.m_bSimpleWorkingDialog=false;
this.m_bShowCancelButton=(_1260.getAdvancedServerProperty("VIEWER_JS_HIDE_CANCEL_BUTTON")=="true")?false:true;
WorkingDialog.baseConstructor.call(this,_1260);
this.m_secondaryRequests=_1260.getSecondaryRequests();
}
};
WorkingDialog.prototype=new ViewerBaseWorkingDialog();
WorkingDialog.baseConstructor=ViewerBaseWorkingDialog;
WorkingDialog.prototype.setSecondaryRequests=function(_1261){
this.m_secondaryRequests=_1261;
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
WorkingDialog.prototype.showDeliveryOptions=function(bShow){
var _1264=this.getNamespace();
var _1265=document.getElementById("DeliveryOptionsVisible"+_1264);
if(_1265){
_1265.style.display=(bShow===false?"none":"block");
if(bShow){
var links=_1265.getElementsByTagName("a");
for(var i=links.length;i>0;i--){
if(links[i]&&links[i].getAttribute("tabIndex")=="0"){
links[i].focus();
}
}
}
}
_1265=document.getElementById("OptionsLinkSelected"+_1264);
if(_1265){
_1265.style.display=(bShow===false?"none":"block");
}
_1265=document.getElementById("OptionsLinkUnselected"+_1264);
if(_1265){
_1265.style.display=(bShow===false?"block":"none");
}
};
WorkingDialog.prototype.renderHTML=function(){
var _1268=this.getNamespace();
var _1269=_1268+"_workingMsg "+_1268+"_workingMsg2";
var html="<table class=\"viewerWorkingDialog\" id=\"CVWaitTable"+_1268+"\""+" role=\"presentation\">";
html+=("<tr>"+"<td align=\"center\">"+"<div tabIndex=\"0\" role=\"presentation\" aria-labelledby=\""+_1269+"\""+" class=\"body_dialog_modal workingDialogDiv\">");
html+=this.renderFirstInnerTable();
html+=this.renderSecondInnerTable();
html+=("</div>"+"</td>"+"</tr>"+"</table>");
return html;
};
WorkingDialog.prototype.renderFirstInnerTable=function(){
var _126b=this.getSimpleWorkingDialogFlag();
var _126c=_126b?RV_RES.GOTO_WORKING:RV_RES.RV_RUNNING;
var _126d=this.m_sNamespace;
var _126e="<table class=\"workingDialogInnerTable\" role=\"presentation\">"+"<tr>"+"<td valign=\"middle\">";
var _126f=this.getCognosViewer().getSkin()+"/branding/";
_126e+="<img src=\""+_126f+"progress.gif\"";
if(isIE()){
_126e+=" width=\"48\" height=\"48\" border=\"0\"";
}
_126e+=" name=\"progress\"";
if(isIE()){
_126e+=" align=\"top\"";
}
_126e+=" alt=\"";
_126e+=_126c;
_126e+="\"/></td>";
_126e+="<td width=\"20\">&nbsp;</td>";
_126e+="<td style=\"padding-top: 5px;\" class=\"tableText\">";
_126e+="<span id=\""+_126d+"_workingMsg\">";
_126e+=_126c;
_126e+="</span>";
_126e+="<br/><br/>";
var _1270=this.getCognosViewer().envParams["cv.responseFormat"];
if(_126b||this.isUIBlacklisted("RV_TOOLBAR_BUTTONS")||!this.deliverySectionIsNeeded()||(_1270&&("qs"===_1270||"fragment"===_1270))){
_126e+=RV_RES.RV_PLEASE_WAIT;
}else{
var _1271=this.canShowDeliveryOptions();
if(_1271){
_126e+=this.optionLinkSelectedDiv();
_126e+=this.optionLinkUnselectedDiv();
}else{
_126e+=RV_RES.RV_PLEASE_WAIT;
}
}
_126e+="</td></tr><tr><td colspan=\"3\">&nbsp;</td></tr></table>";
return _126e;
};
WorkingDialog.prototype.optionLinkSelectedDiv=function(){
var _1272="";
_1272+="<div id=\"OptionsLinkSelected"+this.getNamespace()+"\" style=\"display: none\">";
_1272+=RV_RES.RV_BUSY_OPTIONS_SELECTED;
_1272+="</div>";
return _1272;
};
WorkingDialog.prototype.optionLinkUnselectedDiv=function(){
var _1273="";
var _1274=this.getNamespace();
var _1275="window.oCV"+_1274+".getWorkingDialog()";
_1273+="<div id=\"OptionsLinkUnselected"+_1274+"\">";
_1273+="<span id=\""+_1274+"_workingMsg2\">";
_1273+=RV_RES.RV_BUSY_OPTIONS_UNSELECTED;
_1273+="</span><br/>";
_1273+="<a href=\"#\" class=\"deliveryOptionLink\" onclick=\"javascript:"+_1275+".showDeliveryOptions(true)\">";
_1273+=RV_RES.RV_BUSY_OPTIONS_LINK;
_1273+="</a></div>";
return _1273;
};
WorkingDialog.prototype.canShowDeliveryOptions=function(){
var _1276=this.getCognosViewer().envParams["ui.primaryAction"];
if("saveAs"!==_1276&&"email"!==_1276&&this.getIsSavedReport()){
return true;
}
return false;
};
WorkingDialog.prototype.isUIBlacklisted=function(item){
var _1278=this.getUIBlacklist();
for(var index in _1278){
if(_1278[index]===item){
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
WorkingDialog.prototype._hasSecondaryRequest=function(_127a){
var _127b=this._getSecondaryRequests();
if(_127b){
var _127c=_127b.length;
for(var i=0;i<_127c;i++){
if(_127b[i]==_127a){
return true;
}
}
}
return false;
};
WorkingDialog.prototype.renderSecondInnerTable=function(){
var _127e="";
var _127f=this.getCognosViewer().getWebContentRoot();
_127e+="<table width=\"300\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">";
_127e+="<tr id=\"DeliveryOptionsVisible"+this.getNamespace()+"\" class=\"workingDialogOptions\">";
_127e+="<td align=\"left\">";
_127e+="<table class=\"workingDialogInnerTable workingDialogLinks\" role=\"presentation\">";
var _1280=this.canShowDeliveryOptions();
if(_1280&&this.deliverySectionIsNeeded()){
if(!this._isSaveBlackListed()){
_127e+=this.addDeliverOption("/rv/images/action_save_report_output.gif",RV_RES.RV_SAVE_REPORT,"SaveReport(true);");
}
if("reportView"!==this.getCognosViewer().envParams["ui.objectClass"]&&!this._isSaveAsBlackListed()){
_127e+=this.addDeliverOption("/rv/images/action_save_report_view.gif",RV_RES.RV_SAVE_AS_REPORT_VIEW,"SaveAsReportView(true);");
}
if(!this.isUIBlacklisted("CC_RUN_OPTIONS_EMAIL_ATTACHMENT")&&!this._isEmailBlackListed()){
_127e+=this.addDeliverOption("/rv/images/action_send_report.gif",RV_RES.RV_EMAIL_REPORT,"SendReport(true);");
}
}
_127e+="</table></td></tr> ";
_127e+="<tr style=\"padding-top: 5px\"> ";
_127e+="<td align=\"left\" colspan=\"3\" id=\"cancelButtonContainer"+this.getNamespace()+"\"> ";
if(this.showCancelButton()){
_127e+=this.addCancelButton();
}
_127e+="</td></tr> ";
_127e+="</table> ";
return _127e;
};
WorkingDialog.prototype.addDeliverOption=function(_1281,sText,_1283){
var _1284="";
var _1285=this.getCognosViewer().getWebContentRoot();
var _1286="javascript: window.oCV"+this.getNamespace()+".getRV().";
var _1287=_1286+_1283;
_1284+="<tr><td> ";
_1284+="<a tabIndex=\"-1\" href=\""+_1283+"\"> ";
_1284+="<img border=\"0\" src=\""+_1285+_1281+"\" alt=\" "+html_encode(sText)+"\"/></a> ";
_1284+="</td><td width=\"100%\" valign=\"middle\" class=\"tableText\"> ";
_1284+="<a tabIndex=\"0\" role=\"link\" href=\"#\" onclick=\""+_1287+"\" style=\"padding-left: 5px\" class=\"deliveryOptionLink\"> ";
_1284+=(sText+"</a></td></tr>");
return _1284;
};
WorkingDialog.prototype.addCancelButton=function(){
var _1288="";
var _1289=this.getCognosViewer().getWebContentRoot();
_1288+="<table role=\"presentation\"><tr><td> ";
_1288+="<table id=\"cvWorkingDialog"+this.getNamespace()+"\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" onmouseover=\"this.className = 'commandButtonOver'\" onmouseout=\"this.className = 'commandButton'\" onmousedown=\"this.className = 'commandButtonDown'\" class=\"commandButton\"> ";
_1288+="<tr> ";
_1288+="<td valign=\"middle\" align=\"center\" nowrap=\"nowrap\" class=\"workingDialogCancelButton\" ";
if(isIE()){
_1288+="id=\"btnAnchorIE\" ";
}else{
_1288+="id=\"btnAnchor\" ";
}
_1288+="> ";
var _128a="window.oCV"+this.m_sNamespace+".cancel(this)";
_1288+="<a href=\"#\" onclick=\""+_128a+"\"> ";
_1288+=RV_RES.CANCEL;
_1288+="</a> ";
_1288+="</td></tr></table></td> ";
_1288+="<td><img alt=\"\" height=\"1\"  ";
if(isIE()){
_1288+="width=\"10\"  ";
}
_1288+="src=\""+_1289+"/ps/images/space.gif\"/></td> ";
_1288+="</tr></table> ";
return _1288;
};
WorkingDialog.prototype.disableCancelButton=function(_128b){
this.cancelButtonDisabled=true;
var _128c=document.getElementById("cvWorkingDialog"+this.getNamespace());
if(_128c){
_128c.style.cursor="default";
_128c.className="commandButtonOver";
_128c.removeAttribute("onmouseover");
_128c.removeAttribute("onmouseout");
}
if(_128b){
_128b.removeAttribute("href");
_128b.removeAttribute("onclick");
_128b.style.cursor="default";
}
};
WorkingDialog.prototype.enableCancelButton=function(){
if(this.cancelButtonDisabled){
var _128d=document.getElementById("cancelButtonContainer"+this.getNamespace());
if(_128d){
_128d.innerHTML=this.addCancelButton();
}
this.cancelButtonDisabled=false;
}
};
WorkingDialog.prototype.getContainerId=function(){
return "CVWait"+this.getNamespace();
};
function RequestExecutedIndicator(_128e){
if(_128e){
RequestExecutedIndicator.baseConstructor.call(this,_128e);
}
};
RequestExecutedIndicator.baseConstructor=WorkingDialog;
RequestExecutedIndicator.prototype=new WorkingDialog();
RequestExecutedIndicator.prototype.renderHTML=function(){
var _128f="<table id=\"CVWaitTable"+this.getNamespace()+"\" requestExecutionIndicator=\"true\" class=\"viewerWorkingDialog\" role=\"presentation\">";
_128f+="<tr><td align=\"center\">";
_128f+="<div class=\"body_dialog_modal\">";
_128f+="<table align=\"center\" cellspacing=\"0\" cellpadding=\"0\" style=\"vertical-align:middle; text-align: left;\" role=\"presentation\">";
_128f+="<tr><td rowspan=\"2\">";
_128f+="<img alt=\""+RV_RES.GOTO_WORKING+"\" src=\""+this.getCognosViewer().getSkin()+"/branding/progress.gif\" style=\"margin:5px;\" width=\"48\" height=\"48\" name=\"progress\"/>";
_128f+="</td><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
_128f+=RV_RES.GOTO_WORKING;
_128f+="</span></td></tr><tr><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
_128f+=RV_RES.RV_PLEASE_WAIT;
_128f+="</span></td></tr><tr><td style=\"height:7px;\" colspan=\"2\"></td></tr></table></div></td></tr></table>";
return _128f;
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
RequestHandler.prototype.onComplete=function(_1291){
this.parent.onComplete.call(this,_1291);
this.processDATAReportResponse(_1291);
this.postComplete();
};
RequestHandler.prototype.processInitialResponse=function(_1292){
this.parent.processInitialResponse.call(this,_1292);
var oCV=this.getViewer();
var _1294=oCV.getStatus();
oCV.setMaxContentSize();
var _1295=(oCV.isWorking(_1294)||_1294=="default");
if(_1295){
if(oCV.getWorkingDialog()){
oCV.getWorkingDialog().show();
}
setTimeout(getCognosViewerObjectRefAsString(oCV.getId())+".executeCallback(\"wait\");",10);
}else{
if(_1294=="fault"){
oCV.setSoapFault(_1292.m_sSoapFault);
oCV.executeCallback("fault");
}else{
if(_1292.status=="cancel"){
oCV.executeCallback("cancel");
}else{
oCV.updateSkipToReportLink();
if(oCV.envParams&&oCV.envParams["pinFreezeInfo"]){
var _1296=oCV.getPinFreezeManager();
_1296.fromJSONString(oCV.envParams["pinFreezeInfo"]);
delete oCV.envParams["pinFreezeInfo"];
}
if(_1294!="prompting"||!oCV.executeCallback("prompt")){
this.postComplete();
}else{
oCV.updateSkipToNavigationLink(true);
}
}
}
}
this.showReport();
this.getViewer().renderTabs();
this.onAsynchStatusUpdate(_1294);
};
RequestHandler.prototype.postComplete=function(){
this.parent.postComplete.call(this);
var oCV=this.getViewer();
var _1298=document.getElementById("RVContent"+oCV.getId());
if(_1298){
_1298.scrollTop=0;
}
oCV.updateSkipToReportLink();
if(oCV.rvMainWnd){
oCV.updateLayout(oCV.getStatus());
if(!oCV.getUIConfig()||oCV.getUIConfig().getShowToolbar()){
var _1299=oCV.rvMainWnd.getToolbar();
if(_1299){
oCV.rvMainWnd.updateToolbar(oCV.outputFormat);
_1299.draw();
}
}
if(!oCV.getUIConfig()||oCV.getUIConfig().getShowBanner()){
var _129a=oCV.rvMainWnd.getBannerToolbar();
if(_129a){
_129a.draw();
}
}
}
if(oCV.getBrowser()=="moz"){
if(_1298){
if(oCV.outputFormat=="XML"&&oCV.getStatus()!="prompting"){
_1298.style.overflow="hidden";
}else{
_1298.style.overflow="auto";
}
}
}
oCV.gbPromptRequestSubmitted=false;
this.showReport();
if(oCV.getPinFreezeManager()&&oCV.getPinFreezeManager().hasFrozenContainers()){
var _129b=document.getElementById("CVReport"+oCV.getId());
if(_129b){
setTimeout(function(){
oCV.getPinFreezeManager().renderReportWithFrozenContainers(_129b);
if(isIE()){
oCV.repaintDiv(_1298);
}
},1);
}
}
oCV.setMaxContentSize();
oCV.executeCallback("done");
oCV.doneLoading();
};
function ActionFormFields(_129c){
this.m_dispatcherEntry=_129c;
this.m_oCV=_129c.getViewer();
};
ActionFormFields.prototype.addFormFields=function(){
var _129d=this.m_dispatcherEntry;
var _129e=_129d.getAction();
_129e.preProcess();
_129d.addFormField("ui.action","modifyReport");
if(this.m_oCV.getModelPath()!==""){
_129d.addFormField("modelPath",this.m_oCV.getModelPath());
if(typeof this.m_oCV.envParams["metaDataModelModificationTime"]!="undefined"){
_129d.addFormField("metaDataModelModificationTime",this.m_oCV.envParams["metaDataModelModificationTime"]);
}
}
if(_129e.doAddActionContext()===true){
var _129f=_129e.addActionContext();
_129d.addFormField("cv.actionContext",_129f);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_129f,"xml");
}
}
var isBux=this.m_oCV.envParams["bux"]=="true";
if(isBux){
_129d.addFormField("cv.showFaultPage","false");
}else{
_129d.addFormField("cv.showFaultPage","true");
}
_129d.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_129d.addDefinedFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_129d.addDefinedFormField("modelPath",this.m_oCV.envParams["modelPath"]);
_129d.addDefinedFormField("packageBase",this.m_oCV.envParams["packageBase"]);
_129d.addDefinedFormField("rap.state",this.m_oCV.envParams["rap.state"]);
_129d.addDefinedFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
_129d.addDefinedFormField("ui.primaryAction",this.m_oCV.envParams["ui.primaryAction"]);
_129d.addNonNullFormField("cv.debugDirectory",this.m_oCV.envParams["cv.debugDirectory"]);
_129d.addNonNullFormField("ui.objectClass",this.m_oCV.envParams["ui.objectClass"]);
_129d.addNonNullFormField("bux",this.m_oCV.envParams["bux"]);
_129d.addNonNullFormField("baseReportModificationTime",this.m_oCV.envParams["baseReportModificationTime"]);
_129d.addNonNullFormField("originalReport",this.m_oCV.envParams["originalReport"]);
var _12a1=this.m_oCV.getFlashChartOption();
if(_12a1!=null){
_129d.addFormField("savedFlashChartOption",_12a1);
if(_12a1&&_129e!=null&&typeof (_129e.m_requestParams)!="undefined"&&typeof (_129e.m_requestParams.targetType)!="undefined"){
var _12a2=false;
var _12a3=null;
if(typeof (_129e.m_requestParams.targetType.targetType)!="undefined"){
_12a3=_129e.m_requestParams.targetType.targetType;
}else{
_12a3=_129e.m_requestParams.targetType;
}
if(_12a3.match("v2_")!=null||_12a3.match("_v2")!=null){
_12a2=true;
}else{
var _12a4=this.m_oCV.getRAPReportInfo();
var _12a5=_129e.getSelectedReportInfo();
if(_12a4&&_12a5){
var _12a6=_12a4.getDisplayTypes(_12a5.container);
if(_12a6.match("v2_")!=null||_12a6.match("_v2")!=null){
_12a2=true;
}
}
}
_129d.addFormField("hasAVSChart",_12a2);
}else{
_129d.addFormField("hasAVSChart",this.m_oCV.hasAVSChart());
}
}
var sEP=this.m_oCV.getExecutionParameters();
if(sEP){
_129d.addFormField("executionParameters",encodeURIComponent(sEP));
}
_129d.addFormField("ui.conversation",encodeURIComponent(this.m_oCV.getConversation()));
_129d.addFormField("m_tracking",encodeURIComponent(this.m_oCV.getTracking()));
var sCAF=this.m_oCV.getCAFContext();
if(sCAF){
_129d.addFormField("ui.cafcontextid",sCAF);
}
if(_129e.forceRunSpecRequest()){
_129d.addFormField("widget.forceRunSpec","true");
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
ViewerDispatcher.prototype.setUsePageRequest=function(_12a9){
this.m_bUsePageRequest=_12a9;
};
ViewerDispatcher.prototype.getUsePageRequest=function(){
return this.m_bUsePageRequest;
};
ViewerDispatcher.prototype.dispatchRequest=function(_12aa){
if(this.m_activeRequest==null){
this.startRequest(_12aa);
}else{
if(_12aa.canBeQueued()==true){
this.m_requestQueue.push(_12aa);
}else{
if(window.cognosViewerDebug&&console&&console.warn){
console.warn("Warning! Dropped a dispatcher entry!");
}
}
}
};
ViewerDispatcher.prototype.startRequest=function(_12ab){
this.m_activeRequest=_12ab;
if(_12ab!=null){
_12ab.setUsePageRequest(this.m_bUsePageRequest);
_12ab.sendRequest();
}
};
ViewerDispatcher.prototype.cancelRequest=function(key){
for(var i=0;i<this.m_requestQueue.length;i++){
var _12ae=this.m_requestQueue[i];
if(_12ae.getKey()===key){
_12ae.setCallbacks({"onEntryComplete":null});
_12ae.cancelRequest(false);
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
ViewerDispatcher.prototype.requestComplete=function(_12af){
this.startRequest(this.nextRequest());
};
ViewerDispatcher.prototype.nextRequest=function(){
var _12b0=null;
if(this.m_requestQueue.length>0){
_12b0=this.m_requestQueue.shift();
if(_12b0.getKey()!=null){
while(this.m_requestQueue.length>0&&this.m_requestQueue[0].getKey()==_12b0.getKey()){
_12b0=this.m_requestQueue.shift();
}
}
}
return _12b0;
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
DispatcherEntry.prototype.setHeaders=function(_12b2){
this.m_request.setHeaders(_12b2);
};
DispatcherEntry.prototype.getHeaders=function(){
return this.m_request.getHeaders();
};
DispatcherEntry.prototype.setOriginalFormFields=function(_12b3){
this.m_originalFormFields=_12b3;
};
DispatcherEntry.prototype.getOriginalFormFields=function(){
return this.m_originalFormFields;
};
DispatcherEntry.prototype.setRequestHandler=function(_12b4){
_12b4.addCallbackHooks();
this.m_requestHandler=_12b4;
};
DispatcherEntry.prototype.getRequestHandler=function(){
return this.m_requestHandler;
};
DispatcherEntry.prototype.setWorkingDialog=function(_12b5){
if(this.getRequestHandler()){
this.m_requestHandler.setWorkingDialog(_12b5);
}
};
DispatcherEntry.prototype.setRequestIndicator=function(_12b6){
if(this.getRequestHandler()){
this.getRequestHandler().setRequestIndicator(_12b6);
}
};
DispatcherEntry.prototype.forceSynchronous=function(){
this.getRequest().forceSynchronous();
};
DispatcherEntry.prototype.setUsePageRequest=function(_12b7){
this.m_bUsePageRequest=_12b7;
};
DispatcherEntry.prototype.getUsePageRequest=function(){
return this.m_bUsePageRequest;
};
DispatcherEntry.prototype.setDefaultFormFields=function(){
var _12b8=this.getViewer().envParams;
this.addFormField("b_action","cognosViewer");
this.addFormField("cv.catchLogOnFault","true");
this.addDefinedNonNullFormField("protectParameters",_12b8["protectParameters"]);
this.addDefinedNonNullFormField("ui.routingServerGroup",_12b8["ui.routingServerGroup"]);
this.addDefinedNonNullFormField("cv.debugDirectory",_12b8["cv.debugDirectory"]);
this.addDefinedNonNullFormField("cv.showFaultPage",_12b8["cv.showFaultPage"]);
this.addDefinedNonNullFormField("cv.useRAPDrill",_12b8["cv.useRAPDrill"]);
this.addDefinedNonNullFormField("container",_12b8["container"]);
this.addNonEmptyStringFormField("cv.objectPermissions",_12b8["cv.objectPermissions"]);
};
DispatcherEntry.prototype.getViewer=function(){
return this.m_oCV;
};
DispatcherEntry.prototype.prepareRequest=function(){
};
DispatcherEntry.addWidgetInfoToFormFields=function(_12b9,_12ba){
if(_12b9){
var _12bb=_12b9.getBUXRTStateInfoMap();
if(_12bb){
_12ba.addFormField("cv.buxRTStateInfo",_12bb);
}
var _12bc=_12b9.getDisplayName();
if(_12bc&&_12bc.length>0){
_12ba.addFormField("displayTitle",_12bc);
}
}
};
DispatcherEntry.prototype.canBeQueued=function(){
return this.m_canBeQueued;
};
DispatcherEntry.prototype.setCanBeQueued=function(_12bd){
this.m_canBeQueued=_12bd;
};
DispatcherEntry.prototype.getKey=function(){
return this.m_requestKey;
};
DispatcherEntry.prototype.setKey=function(key){
this.m_requestKey=key;
};
DispatcherEntry.prototype.setRequest=function(_12bf){
this.m_request=_12bf;
};
DispatcherEntry.prototype.getRequest=function(){
return this.m_request;
};
DispatcherEntry.prototype.setCallbacks=function(_12c0){
this.getRequest().setCallbacks(_12c0);
};
DispatcherEntry.prototype.getCallbacks=function(){
return this.getRequest().getCallbacks();
};
DispatcherEntry.prototype.sendRequest=function(){
this.prepareRequest();
var _12c1=this.getRequest().getFormFields();
var _12c2=_12c1.keys();
if(!this.m_originalFormFields){
this.m_originalFormFields=new CDictionary();
for(var index=0;index<_12c2.length;index++){
this.m_originalFormFields.add(_12c2[index],_12c1.get(_12c2[index]));
}
}
this.getRequest().sendRequest();
};
DispatcherEntry.prototype.onNewRequest=function(_12c4){
this.setRequest(_12c4);
};
DispatcherEntry.prototype.retryRequest=function(){
var oCV=this.getViewer();
oCV.setRetryDispatcherEntry(null);
var _12c6=this.getRequest().newRequest();
_12c6.setHeaders(null);
this.setRequest(_12c6);
var _12c7=this.m_originalFormFields.keys();
for(var index=0;index<_12c7.length;index++){
var _12c9=_12c7[index];
var _12ca=this.m_originalFormFields.get(_12c9);
if(_12c9=="cv.responseFormat"&&_12ca=="iWidget"){
this.addFormField("cv.responseFormat","data");
}else{
if(_12c9=="ui.action"&&_12ca=="wait"){
this.addFormField("ui.action",this.m_originalFormFields.get("ui.primaryAction"));
}else{
if(_12c9!="m_tracking"&&_12c9!="cv.outputKey"){
this.addFormField(_12c9,_12ca);
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
DispatcherEntry.prototype.cancelRequest=function(_12cb){
if(!this.m_bCancelCalled){
this.m_bCancelCalled=true;
if(this.getRequestHandler()){
this.getRequestHandler().onCancel();
}
if(_12cb){
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
DispatcherEntry.prototype.addFormField=function(name,value){
this.m_request.addFormField(name,value);
};
DispatcherEntry.prototype.addDefinedNonNullFormField=function(name,value){
if(typeof value!="undefined"&&value!=null){
this.addFormField(name,value);
}
};
DispatcherEntry.prototype.addDefinedFormField=function(name,value){
if(typeof value!="undefined"){
this.addFormField(name,value);
}
};
DispatcherEntry.prototype.addNonNullFormField=function(name,value){
if(value!=null){
this.addFormField(name,value);
}
};
DispatcherEntry.prototype.addNonEmptyStringFormField=function(name,value){
if(typeof value!="undefined"&&value!=null&&value!=""){
this.addFormField(name,value);
}
};
DispatcherEntry.prototype.onWorking=function(_12d9,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onWorking(_12d9);
}
};
DispatcherEntry.prototype.onFault=function(_12db){
if(this.getRequestHandler()){
this.getRequestHandler().onFault(_12db);
}
};
DispatcherEntry.prototype.onError=function(_12dc){
if(this.m_bCancelCalled){
return;
}
if(this.getRequestHandler()){
this.getRequestHandler().onError(_12dc);
}
};
DispatcherEntry.prototype.possibleUnloadEvent=function(){
this.setCallbacks({"error":{}});
};
DispatcherEntry.prototype.onPreHttpRequest=function(_12dd){
if(this.getRequestHandler()){
this.getRequestHandler().preHttpRequest(_12dd);
}
};
DispatcherEntry.prototype.onPostHttpRequest=function(_12de){
if(this.getRequestHandler()){
this.getRequestHandler().postHttpRequest(_12de);
}
};
DispatcherEntry.prototype.onPassportTimeout=function(_12df){
if(this.getRequestHandler()){
this.getRequestHandler().onPassportTimeout(_12df);
}
};
DispatcherEntry.prototype.onPrompting=function(_12e0){
if(this.getRequestHandler()){
this.getRequestHandler().onPrompting(_12e0);
}
};
DispatcherEntry.prototype.onEntryComplete=function(_12e1){
if(!this.m_oCV._beingDestroyed){
this.m_oCV.getViewerDispatcher().requestComplete(this);
}
};
DispatcherEntry.prototype.onEntryFault=function(_12e2){
this.m_oCV.setFaultDispatcherEntry(this);
this.m_oCV.resetViewerDispatcher();
if(!this.m_bCancelCalled){
this.m_oCV.setRetryDispatcherEntry(this);
}
};
DispatcherEntry.prototype.onCloseErrorDlg=function(){
var _12e3=this.getCallbacks();
if(_12e3["closeErrorDlg"]){
var _12e4=GUtil.generateCallback(_12e3["closeErrorDlg"].method,[],_12e3["closeErrorDlg"].object);
_12e4();
}
};
DispatcherEntry.prototype.onPostEntryComplete=function(){
if(this.getRequestHandler()){
this.getRequestHandler().onPostEntryComplete();
}
this.executeCallback("postComplete");
};
DispatcherEntry.prototype.executeCallback=function(_12e5){
var _12e6=this.getCallbacks();
if(_12e6[_12e5]){
var _12e7=(_12e6.customArguments)?[this,_12e6.customArguments]:[this];
var _12e8=GUtil.generateCallback(_12e6[_12e5].method,_12e7,_12e6[_12e5].object);
_12e8();
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
var _12ec=new AsynchDATARequest(oCV.getGateway(),oCV.getWebContentRoot());
this.setRequest(_12ec);
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
var _12ee=new AsynchJSONRequest(oCV.getGateway(),oCV.getWebContentRoot());
this.setRequest(_12ee);
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
var _12f0=this.getFormField("ui.action");
var _12f1=this.getViewer().getActionState();
if(_12f1!==""&&(_12f0=="wait"||_12f0=="forward"||_12f0=="back")){
this.addFormField("cv.actionState",_12f1);
}
var _12f2=["nextPage","previousPage","firstPage","lastPage","reportAction","cancel","wait"];
var _12f3=true;
for(var i=0;i<_12f2.length;i++){
if(_12f2[i]==_12f0){
_12f3=false;
break;
}
}
if(_12f3){
this.getViewer().clearTabs();
}
if(this.getViewer().getCurrentlySelectedTab()&&!this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")){
this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",this.getViewer().getCurrentlySelectedTab());
}
};
ReportDispatcherEntry.prototype.setDefaultFormFields=function(){
var oCV=this.getViewer();
var _12f6=oCV.envParams;
this.addFormField("cv.id",oCV.getId());
if(_12f6["cv.showFaultPage"]){
this.addFormField("cv.showFaultPage",_12f6["cv.showFaultPage"]);
}else{
this.addFormField("cv.showFaultPage","false");
}
this.addDefinedNonNullFormField("ui.object",_12f6["ui.object"]);
this.addDefinedNonNullFormField("ui.primaryAction",_12f6["ui.primaryAction"]);
this.addDefinedNonNullFormField("ui.objectClass",_12f6["ui.objectClass"]);
this.addNonEmptyStringFormField("specificationType",_12f6["specificationType"]);
this.addNonEmptyStringFormField("cv.promptForDownload",_12f6["cv.promptForDownload"]);
this.addNonEmptyStringFormField("ui.conversation",oCV.getConversation());
this.addNonEmptyStringFormField("m_tracking",oCV.getTracking());
var _12f7=oCV.getExecutionParameters();
this.addNonEmptyStringFormField("executionParameters",_12f7);
var sCAF=oCV.getCAFContext();
this.addDefinedNonNullFormField("ui.cafcontextid",sCAF);
};
ReportDispatcherEntry.prototype.onWorking=function(_12f9,arg1){
var _12fb=_12f9.getResponseState();
var _12fc=this.getRequestHandler();
if(_12fc){
var _12fd=_12fc.getWorkingDialog();
if(_12fd&&_12fd.setSecondaryRequests&&_12fb.m_aSecRequests){
_12fd.setSecondaryRequests(_12fb.m_aSecRequests);
}
}
DispatcherEntry.prototype.onWorking.call(this,_12f9,arg1);
if(_12fc){
this.getRequestHandler().updateViewerState(_12fb);
}
};
ReportDispatcherEntry.prototype.onComplete=function(_12fe,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onComplete(_12fe);
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
var _1302=oCV.envParams;
this.addFormField("cv.showFaultPage","true");
this.addDefinedNonNullFormField("cv.header",_1302["cv.header"]);
this.addDefinedNonNullFormField("cv.toolbar",_1302["cv.toolbar"]);
this.addDefinedNonNullFormField("ui.backURL",_1302["ui.backURL"]);
this.addDefinedNonNullFormField("errURL",_1302["ui.backURL"]);
this.addDefinedNonNullFormField("errURL",_1302["ui.errURL"]);
this.addDefinedNonNullFormField("cv.catchLogOnFault","true");
this.addDefinedNonNullFormField("m_sessionConv",_1302["m_sessionConv"]);
if(_1302["m_session"]){
this.addFormField("m_session",_1302["m_session"]);
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
var _1303=this.m_oCV.getPinFreezeManager();
if(_1303&&_1303.hasFrozenContainers()){
this.addFormField("pinFreezeInfo",_1303.toJSONString());
}
}
};
ViewerDispatcherEntry.prototype.sendRequest=function(){
if(this.getUsePageRequest()){
this.prepareRequest();
var _1304=this.buildRequestForm();
if(typeof document.progress!="undefined"){
setTimeout("document.progress.src=\""+this.m_oCV.getSkin()+"/branding/progress.gif"+"\";",1);
}
_1304.submit();
}else{
this.getViewer().closeContextMenuAndToolbarMenus();
this.parent.sendRequest.call(this);
}
};
ViewerDispatcherEntry.prototype.buildRequestForm=function(){
var oCV=this.getViewer();
var _1306=document.createElement("form");
_1306.setAttribute("id","requestForm");
_1306.setAttribute("name","requestForm");
_1306.setAttribute("method","post");
_1306.setAttribute("target","_self");
_1306.setAttribute("action",oCV.getGateway());
_1306.style.display="none";
document.body.appendChild(_1306);
var _1307=this.getRequest().getFormFields();
var _1308=_1307.keys();
for(var index=0;index<_1308.length;index++){
_1306.appendChild(this.createHiddenFormField(_1308[index],_1307.get(_1308[index])));
}
for(param in oCV.envParams){
if(!_1307.exists(param)&&param!="cv.actionState"){
_1306.appendChild(this.createHiddenFormField(param,oCV.envParams[param]));
}
}
return _1306;
};
ViewerDispatcherEntry.prototype.createHiddenFormField=function(name,value){
var _130c=document.createElement("input");
_130c.setAttribute("type","hidden");
_130c.setAttribute("name",name);
_130c.setAttribute("id",name);
_130c.setAttribute("value",value);
return (_130c);
};
ViewerDispatcherEntry.prototype.onCancel=function(){
var oCV=this.getViewer();
oCV.setStatus("complete");
if(this.getUsePageRequest()||!oCV.isReportRenderingDone()){
oCV.executeCallback("cancel");
}
};
ViewerDispatcherEntry.prototype.onFault=function(_130e){
if(this.getViewer().callbackExists("fault")){
this.getViewer().setSoapFault(_130e.getSoapFault());
this.getViewer().executeCallback("fault");
}else{
this.parent.onFault.call(this,_130e);
}
};
ViewerDispatcherEntry.prototype.onComplete=function(_130f){
var oCV=this.getViewer();
oCV.saveBackJaxInformation(_130f);
if(oCV.isReportRenderingDone()){
this.getViewer().getSelectionController().resetSelections();
}
this.parent.onComplete.call(this,_130f);
};
ViewerDispatcherEntry.prototype.onPrompting=function(_1311){
var oCV=this.getViewer();
oCV.updateSkipToNavigationLink(true);
if(!oCV.executeCallback("prompt")){
this.onComplete(_1311);
}
};
ViewerDispatcherEntry.prototype.onEntryComplete=function(_1313){
if(this.getRequestHandler()){
this.getRequestHandler().setDispatcherEntry(this);
}
this.parent.onEntryComplete.call(this,_1313);
};

