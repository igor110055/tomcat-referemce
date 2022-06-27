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
 function GotoAction(){
};
GotoAction.prototype=new CognosViewerAction();
GotoAction.prototype.execute=function(){
var _1=this.m_oCV.getDrillMgr();
_1.launchGoToPage();
};
GotoAction.prototype.updateMenu=function(_2){
var _3=[];
var _4=this.m_oCV.getDrillTargets();
var _5=this.m_oCV.getDrillMgr();
var _6=_5.getAuthoredDrillThroughTargets();
if(_6.length>0){
var _7="<AuthoredDrillTargets>";
for(var _8=0;_8<_6.length;++_8){
_7+=eval("\""+_6[_8]+"\"");
}
_7+="</AuthoredDrillTargets>";
var _9=this.m_oCV.getAction("AuthoredDrill");
var _a=_9.getAuthoredDrillThroughContext(_7,_4);
var _b=_a.childNodes;
if(_b.length>0){
for(var _c=0;_c<_b.length;++_c){
var _d=_b[_c];
var _e=this.getTargetReportIconClass(_d);
var _f=_d.getAttribute("label");
_3.push({name:"AuthoredDrill",label:_f,iconClass:_e,action:{name:"AuthoredDrill",payload:XMLBuilderSerializeNode(_d)},items:null});
}
}
}
if(_3.length>0){
_3.push({separator:true});
}
var _10=false;
if(this.m_oCV.getSelectionController()==null||this.m_oCV.getSelectionController().getModelDrillThroughEnabled()==false){
_10=true;
}
_3.push({name:"Goto",disabled:_10,label:RV_RES.RV_MORE,iconClass:"",action:{name:"Goto",payload:""},items:null});
if(this.m_oCV.isIWidgetMobile()){
_2.flatten="true";
}
_2.items=_3;
return _2;
};
GotoAction.prototype.getTargetReportIconClass=function(_11){
var _12="";
var _13=_11.getAttribute("method");
switch(_13){
case "edit":
_12="editContent";
break;
case "execute":
_12="runReport";
break;
case "view":
var _14=_11.getAttribute("outputFormat");
switch(_14){
case "HTML":
case "XHTML":
case "HTMLFragment":
_12="html";
break;
case "PDF":
_12="pdf";
break;
case "XML":
_12="xml";
break;
case "CSV":
_12="csv";
break;
case "XLS":
_12="excel2000";
break;
case "SingleXLS":
_12="excelSingleSheet";
break;
case "XLWA":
_12="excel2002";
break;
case "spreadsheetML":
_12="excel2007";
break;
case "xlsxData":
_12="excel2007";
break;
}
break;
}
return _12;
};
function DrillContextMenuHelper(){
};
DrillContextMenuHelper.updateDrillMenuItems=function(_15,oCV,_17){
var _18=[];
if(DrillContextMenuHelper.needsDrillSubMenu(oCV)){
var _19=oCV.getSelectionController();
var _1a=_19.getAllSelectedObjects();
var _1b=_1a[0];
if(_1b.getUseValues().length>1&&typeof RV_RES!="undefined"){
var _1c={name:_17,label:RV_RES.RV_DRILL_DEFAULT,action:{name:_17,payload:{}}};
_18.push(_1c);
}
var _1d=(_1b.getUseValues().length>1)?1:0;
var _1e=_1b.getUseValues().length-1;
_1e=(_1e>2)?2:_1e;
for(var _1f=_1d;_1f<=_1e;++_1f){
DrillContextMenuHelper.addSubMenuItem(_17,_18,_1b,_1f,0);
}
var _20=false;
for(var _1f=_1d;_1f<=_1e;++_1f){
for(var _21=1;_21<_1b.getUseValues()[_1f].length;++_21){
if(_20==false){
_18.push({separator:true});
_20=true;
}
DrillContextMenuHelper.addSubMenuItem(_17,_18,_1b,_1f,_21);
}
}
}
DrillContextMenuHelper.completeDrillMenu(_17,_18,_15);
};
DrillContextMenuHelper.needsDrillSubMenu=function(oCV){
var _23=(oCV&&oCV.getSelectionController());
if(_23){
var _24=_23.getAllSelectedObjects();
if(_24.length==1&&_24[0].isHomeCell&&_24[0].isHomeCell()==false){
var _25=_24[0].isSelectionOnVizChart();
if(!_25){
var _26=oCV.getAdvancedServerProperty("VIEWER_JS_ENABLE_DRILL_SUBMENU");
_25=(_26=="charts"&&_23.hasSelectedChartNodes());
}
if(_25){
var _27=_24[0];
return (_25&&_27.getUseValues()&&(_27.getUseValues().length>1||_27.getUseValues()[0].length>1));
}
}
}
return false;
};
DrillContextMenuHelper.addSubMenuItem=function(_28,_29,_2a,_2b,_2c){
var _2d=_2a.getDrillOptions()[_2b][_2c];
if(DrillContextMenuHelper.isOptionDrillable(_28,_2d)){
var _2e=DrillContextMenuHelper.getItemValue(_2a,_2b,_2c);
if(_2e){
var _2f=_2a.getDataItems()[_2b][_2c];
var _30={name:_28,label:_2e,action:{name:_28,payload:{userSelectedDrillItem:_2f}}};
_29.push(_30);
}
}
};
DrillContextMenuHelper.completeDrillMenu=function(_31,_32,_33){
if(_32.length>0){
_33.items=_32;
}else{
_33.items=null;
if(_33.action==null){
_33.action={name:_31,action:{name:_31}};
}
}
};
DrillContextMenuHelper.isOptionDrillable=function(_34,_35){
return (_35>=3||(_34=="DrillDown"&&_35==2)||(_34=="DrillUp"&&_35==1));
};
DrillContextMenuHelper.getItemValue=function(_36,_37,_38){
var _39=(_38==0)?_36.getDisplayValues()[_37]:null;
return ((_39)?_39:_36.getUseValues()[_37][_38]);
};
function DrillAction(){
};
DrillAction.prototype=new CognosViewerAction();
DrillAction.prototype.setRequestParms=function(_3a){
if(_3a&&_3a.userSelectedDrillItem){
this.m_userSelectedDrillItem=_3a.userSelectedDrillItem;
}
};
DrillAction.prototype.submitDrillRequest=function(_3b,_3c,_3d){
var oCV=this.getCognosViewer();
var _3f=new ViewerDispatcherEntry(oCV);
_3f.addFormField("ui.action","drill");
_3f.addFormField("rv_drillOption",_3c);
_3f.addFormField("rv_drillparams",_3b);
_3f.addFormField("rv_drillRefQuery",_3d);
oCV.dispatchRequest(_3f);
};
function DrillDownAction(){
this.m_sAction="DrillDown";
};
DrillDownAction.prototype=new DrillAction();
DrillDownAction.prototype.updateMenu=function(_40){
return _40;
};
DrillDownAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _42=oCV.getDrillMgr();
if(_42.canDrillDown()==false){
return;
}
var _43=_42.rvBuildXMLDrillParameters("drillDown",this.m_userSelectedDrillItem);
var _44=_42.getRefQuery();
if(oCV.envParams["cv.id"]=="AA"){
oCV.m_viewerFragment.raiseAADrillDownEvent();
}
this.submitDrillRequest(_43,"down",_44);
};
function DrillUpAction(){
this.m_sAction="DrillUp";
};
DrillUpAction.prototype=new DrillAction();
DrillUpAction.prototype.updateMenu=function(_45){
return _45;
};
DrillUpAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _47=oCV.getDrillMgr();
if(_47.canDrillUp()==false){
return;
}
var _48=_47.rvBuildXMLDrillParameters("drillUp",this.m_userSelectedDrillItem);
var _49=_47.getRefQuery();
if(oCV.envParams["cv.containerApp"]=="AA"){
oCV.m_viewerFragment.raiseAADrillUpEvent();
}
this.submitDrillRequest(_48,"up",_49);
};
DrillDownAction.prototype.updateMenu=function(_4a){
var _4b=this.getCognosViewer().getDrillMgr();
if(_4b&&_4b.canDrillDown()==false){
_4a.visible=false;
}else{
_4a.visible=true;
DrillContextMenuHelper.updateDrillMenuItems(_4a,this.m_oCV,this.m_sAction);
}
return _4a;
};
DrillUpAction.prototype.updateMenu=function(_4c){
var _4d=this.getCognosViewer().getDrillMgr();
if(_4d&&_4d.canDrillUp()==false){
_4c.visible=false;
}else{
_4c.visible=true;
DrillContextMenuHelper.updateDrillMenuItems(_4c,this.m_oCV,this.m_sAction);
}
return _4c;
};
AuthoredDrillAction.prototype._shouldShowInNewWindow=function(_4e){
return true;
};
function CCognosViewerToolbarHelper(){
};
CCognosViewerToolbarHelper.updateToolbarForCurrentSelection=function(oCV,_50){
if(_50){
var _51=oCV.getActionFactory();
for(var _52=0;_52<_50.length;++_52){
var _53=_50[_52]["name"];
if(typeof _53!="undefined"&&_53!=null){
var _54=_51.load(_53);
if(_54!=null&&typeof _54!="undefined"){
var _55=_54.updateMenu(_50[_52]);
if(_55.visible==false){
if(_55.save){
oCV.getViewerWidget().addButtonToSavedToolbarButtons(_53,_50[_52],_52);
}
_50.splice(_52,1);
--_52;
}else{
_50[_52]=_55;
}
}
}else{
if(typeof _50[_52]._root!="undefined"){
CCognosViewerToolbarHelper.updateToolbarForCurrentSelection(oCV,_50[_52]._root);
}else{
if(_50[_52].separator){
if(_52==0||(_52>0&&_50[_52-1].separator)||_52==_50.length){
_50.splice(_52,1);
--_52;
}
}
}
}
}
}
};
CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection=function(oCV,_57){
var _58=[];
if(_57){
var _59=oCV.getActionFactory();
for(var _5a=0;_5a<_57.length;++_5a){
var _5b=_57[_5a];
var _5c=_57[_5a]["name"];
var _5d=true;
if(typeof _5c!="undefined"){
var _5e=_59.load(_5c);
if(_5e!=null&&typeof _5e!="undefined"){
if(typeof _5e.buildMenu=="function"){
_5b=_5e.buildMenu(_57[_5a]);
}else{
_5b=_5e.updateMenu(_57[_5a]);
}
_5d=_5e.isValidMenuItem();
}else{
if(typeof _5b.items!="undefined"){
_5b.items=CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection(oCV,_5b.items);
_5d=(_5b.items&&_5b.items.length>0)?true:false;
if(_5d&&_5b.items.length==1){
_5b=_5b.items[0];
}
}
}
}
if(_5b&&_5b.visible!==false&&_5d){
if(_5b.separator===true){
if(_58.length>0&&typeof _58[_58.length-1].separator=="undefined"){
_58[_58.length]=_5b;
}
}else{
if(_5b.useChildrenItems==true&&_5b.items&&_5b.items.length>0){
if(!_5b.disabled){
for(var _5f=0;_5f<_5b.items.length;_5f++){
_58[_58.length]=_5b.items[_5f];
}
}
}else{
if(typeof _5b._root!="undefined"){
_58[_58.length]={"_root":CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection(oCV,_5b._root)};
}else{
_58[_58.length]=_5b;
}
}
}
}
}
if(_58.length>1){
if(_58[_58.length-1].separator){
_58=_58.splice(0,_58.length-1);
}
}
}
return _58;
};
CMainWnd.prototype.pageClicked=function(evt){
var oCV=this.getCV();
var _62=oCV.getSelectionController();
if(_62&&oCV.bCanUseCognosViewerSelection==true){
_62.resetSelections();
var _63=_62.pageClickedForMobile(evt);
if(_63){
if(this._bookmarkDrillThrough(evt,oCV)){
return;
}
var _64=CCognosViewerToolbarHelper.updateContextMenuForCurrentSelection(oCV,oCV.getContextMenu());
this._fixGotoMenu(_64);
var _65=_62.getContainerType();
var _66=_65==="chart"?_62.getChartTooltip():null;
var _67={"action":"showMenu","event":evt,"payload":_64.length>0?_64:null,"displayValues":_62.getDisplayValues(_62),"chartTooltip":_66,"containerType":_65};
if(window.onAction){
window.onAction(_67);
}else{
if(typeof console!="undefined"){
console.log(_67);
}
}
}
}
};
CMainWnd.prototype._bookmarkDrillThrough=function(evt,oCV){
var _6a=oCV.getDrillMgr();
var _6b=_6a.getAuthoredDrillsForCurrentSelection();
if(_6b){
var _6c=XMLHelper_FindChildrenByTagName(_6b,"drillTarget",false);
if(_6c&&_6c.length==1){
var _6d=_6c[0];
var _6e=_6d.getAttribute("bookmarkRef");
var _6f=_6d.getAttribute("path");
if(_6e&&_6e.length>0&&(!_6f||_6f.length==0)){
_6a.singleClickDrillEvent(evt,"RV");
return true;
}
}
}
return false;
};
CMainWnd.prototype.displayContextMenu=function(evt,_71){
if(!this.getCV().bEnableContextMenu){
return false;
}
this.pageClicked(evt);
};
CMainWnd.prototype._fixGotoMenu=function(_72){
if(_72&&_72.length){
var _73=null;
var _74=_72.length;
var _75=0;
for(var i=0;i<_74;i++){
if(_72[i].name==="Goto"){
_75=i;
_73=_72.splice(i,1);
break;
}
}
if(_73&&_73[0]&&_73[0].items){
var _77=_73[0].items;
var _78=_77.length;
for(var i=0;i<_78;i++){
if(!_77[i].separator){
_72.splice(_75,0,_77[i]);
_75++;
}
}
}
}
};
CCognosViewer.prototype.isMobile=function(){
return true;
};
CCognosViewer.prototype.sendDrillThroughRequest=function(_79){
var _7a=getChildElementsByAttribute(_79,"input","name","ui.action");
if(_7a&&_7a.length>0){
_7a[0].setAttribute("value","authoredDrillThroughMobile");
}
ViewerMobileRequest.passFormFieldsToMobile(_79);
};
CCognosViewer.prototype.launchGotoPage=function(_7b){
ViewerMobileRequest.passFormFieldsToMobile(_7b);
};
CCognosViewer.prototype.shouldWriteNavLinks=function(){
return false;
};
CCognosViewer.prototype.getCancelDispatcherEntry=function(){
return new ViewerDispatcherEntry(this);
};
CCognosViewer.prototype.notifyTabChange=function(_7c){
var _7d={"action":"savedOutputTabChange","tabId":_7c};
if(typeof window.onAction=="function"){
window.onAction(_7d);
}else{
if(typeof console!="undefined"){
console.log(_7d);
}
}
};
ViewerDispatcherEntry.prototype.sendRequest=function(){
this.prepareRequest();
var oCV=this.getViewer();
if(oCV.envParams["ui.action"]=="view"){
this.addFormField("cv.responseFormat","mobileView");
}else{
this.addFormField("cv.responseFormat","mobileData");
}
oCV.resetViewerDispatcher();
var _7f=this.getRequest().getFormFields();
for(param in oCV.envParams){
if(!_7f.exists(param)&&param!="cv.actionState"){
this.addFormField(param,oCV.envParams[param]);
}
}
if(!ViewerMobileRequest.passRequestFieldsToMobile(this.getRequest())){
var _80=this.buildRequestForm();
_80.submit();
}
};
function ViewerMobileRequest(){
};
ViewerMobileRequest.passFormFieldsToMobile=function(_81){
var _82={};
var _83=_81.getElementsByTagName("input");
if(_83){
for(var i=0;i<_83.length;i++){
var _85=_83[i].getAttribute("name");
var _86=_83[i].getAttribute("value");
if(_85&&_86){
_82[_85]=_86;
}
}
}
return ViewerMobileRequest._callMobile(_82);
};
ViewerMobileRequest.passRequestFieldsToMobile=function(_87){
var _88={};
var _89=_87.getFormFields();
var _8a=_89.keys();
for(var _8b=0;_8b<_8a.length;_8b++){
var _8c=_8a[_8b];
_88[_8c]=_89.get(_8c);
}
return ViewerMobileRequest._callMobile(_88);
};
ViewerMobileRequest._callMobile=function(_8d){
var _8e={"action":"httpRequest",payload:_8d};
if(window.onAction){
window.onAction(_8e);
return true;
}else{
if(typeof console!="undefined"&&console&&console.log){
console.log(_8e);
return false;
}
}
return false;
};

