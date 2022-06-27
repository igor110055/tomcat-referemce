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
 CCognosViewer.prototype.sortColumn=function(_1){
var _2=_1.which?_1.which==1:_1.button==0;
var _3=new CognosViewerSort(_1,this);
if(_2&&_3.isSort(_1)){
_3.execute();
return true;
}
return false;
};
CCognosViewer.prototype.isInteractiveViewer=function(){
return true;
};
CCognosViewer.prototype.canExpand=function(){
var _4=new ExpandMemberAction();
_4.setCognosViewer(this);
return _4._canShowMenu(this.getSelectionController())&&_4._canEnableMenu(this.getSelectionController());
};
CCognosViewer.prototype.canCollapse=function(){
var _5=new CollapseMemberAction();
_5.setCognosViewer(this);
return _5._canEnableMenu(this.getSelectionController());
};
CCognosViewer.prototype.expand=function(){
var _6=new ExpandMemberAction();
_6.setCognosViewer(this);
_6.execute();
};
CCognosViewer.prototype.collapse=function(){
var _7=new CollapseMemberAction();
_7.setCognosViewer(this);
_7.execute();
};
function RAPReportInfo(_8,_9){
this.m_reportInfoJSON=_8;
this.m_containerInfoJSON={};
this.m_iContainerCount=0;
this.m_bPromptPart=null;
this.m_bSingleContainer=null;
this.m_bDetailFilteringDisabled=null;
this.m_aDrilledOnHUNs=null;
this.m_bPassTrackingToBUA=null;
this.m_sDisplayTypes=null;
this.m_bContainsInteractiveDataContainer=null;
this.m_bContainsFilters=false;
this.m_bContainsSlider=false;
this.m_referenceInfoObject={};
this.initializeContainerInfo();
this._addNonVisibleReferences(this.m_reportInfoJSON.reportLevelProperties);
this._populateHun(_9);
};
RAPReportInfo.prototype.initializeContainerInfo=function(){
if(this.m_reportInfoJSON){
var _a=this.m_reportInfoJSON.containers;
if(_a){
this.m_iContainerCount=_a.length;
for(var _b=0;_b<this.m_iContainerCount;++_b){
var _c=_a[_b].container;
this.m_containerInfoJSON[_c]=_a[_b];
this.m_containerInfoJSON[_c].m_itemInfoJSON=this._initializeItemInfo(_a[_b].itemInfo);
this.m_containerInfoJSON[_c].m_drillabilityJSON=this._initializeDrillability(_a[_b].drillability);
this._addFilterReferences(_a[_b].filter);
this._addSliderReferences(_a[_b].sliders);
this.m_containerInfoJSON[_c].layoutIndex=_b;
if(_a[_b].filter){
this.m_bContainsFilters=true;
}
if(_a[_b].sliders){
this.m_bContainsSlider=true;
}
}
}
}
};
RAPReportInfo.prototype._initializeItemInfo=function(_d){
var _e={};
for(var _f in _d){
_e[_d[_f].item]=_d[_f];
this.m_referenceInfoObject[_d[_f].item]=true;
}
return _e;
};
RAPReportInfo.prototype._initializeDrillability=function(_10){
var _11={};
for(var idx in _10){
_11[_10[idx].item]=_10[idx];
this.m_referenceInfoObject[_10[idx].item]=true;
}
return _11;
};
RAPReportInfo.prototype._addFilterReferences=function(_13){
for(var idx in _13){
this.m_referenceInfoObject[_13[idx].item]=true;
if(_13[idx].type==="contextSlice"&&_13[idx].hierarchyName){
this.m_referenceInfoObject[_13[idx].hierarchyName]=true;
}
}
};
RAPReportInfo.prototype._addSliderReferences=function(_15){
for(var idx in _15){
this.m_referenceInfoObject[_15[idx].name]=true;
}
};
RAPReportInfo.prototype._addNonVisibleReferences=function(_17){
if(_17&&_17.nonVisibleFiltersMemberItemInfo){
for(var i=0;i<_17.nonVisibleFiltersMemberItemInfo.length;i++){
this.m_referenceInfoObject[_17.nonVisibleFiltersMemberItemInfo[i]]=true;
}
}
};
RAPReportInfo.prototype.isReferenced=function(_19){
return (this.m_referenceInfoObject[_19])?true:false;
};
RAPReportInfo.prototype.getDrillability=function(_1a,_1b){
if(!_1b){
return this.m_containerInfoJSON[_1a].m_drillabilityJSON;
}else{
return this.m_containerInfoJSON[_1a].m_drillabilityJSON[_1b];
}
};
RAPReportInfo.prototype.getContainers=function(){
return this.m_containerInfoJSON;
};
RAPReportInfo.prototype.getContainer=function(lid){
return this.m_containerInfoJSON[lid];
};
RAPReportInfo.prototype.getContainerIds=function(_1d){
var _1e=[];
for(containerName in this.m_containerInfoJSON){
var _1f=this.m_containerInfoJSON[containerName];
if(_1f&&_1f.displayTypeId==_1d){
_1e.push(_1f.container);
}
}
return _1e;
};
RAPReportInfo.prototype.getContainerFromPos=function(_20){
return this.m_reportInfoJSON.containers[_20];
};
RAPReportInfo.prototype.getReportLevelProperties=function(){
return this.m_reportInfoJSON.reportLevelProperties;
};
RAPReportInfo.prototype.getItemInfo=function(_21,_22){
if(!_22){
return this.m_containerInfoJSON[_21].m_itemInfoJSON;
}
if(this.m_containerInfoJSON[_21]){
return this.m_containerInfoJSON[_21].m_itemInfoJSON[_22];
}
return null;
};
RAPReportInfo.prototype.isReportLevel_nonVisibleFilterItem=function(_23){
if(_23&&_23.length>0){
var _24=this.m_reportInfoJSON.reportLevelProperties;
if(_24){
if(_24&&_24.nonVisibleFiltersMemberItemInfo){
for(var i=0;i<_24.nonVisibleFiltersMemberItemInfo.length;i++){
if(_23===_24.nonVisibleFiltersMemberItemInfo[i]){
return true;
}
}
}
}
}
return false;
};
RAPReportInfo.prototype.isChildContainer=function(lid){
return ((this.m_containerInfoJSON[lid]&&this.m_containerInfoJSON[lid].parentContainer)?true:false);
};
RAPReportInfo.prototype.getItemDetails=function(_27,_28){
var obj=null;
for(var lid in this.m_containerInfoJSON){
var _2b=this.getItemInfo(lid,_27);
if(_2b&&_2b.hun===_28){
obj={};
obj.item=_2b.item;
if(_2b.hun){
obj.hun=_2b.hun;
}
obj.lid=lid;
obj.queryName=_2b.queryName;
break;
}
}
return (obj)?obj:null;
};
RAPReportInfo.prototype.getItemDetailsByHun=function(_2c){
var _2d=null;
for(var lid in this.m_containerInfoJSON){
var _2f=this.getItemInfo(lid);
for(var _30 in _2f){
var _31=_2f[_30];
if(_31.hun===_2c){
_2d=_30;
break;
}
}
}
return (_2d?this.getItemDetails(_2d,_2c):null);
};
RAPReportInfo.prototype._populateHun=function(oCV){
if(oCV){
var _33=oCV.getSelectionController().getCCDManager();
var _34=oCV.envParams;
var _35=oCV.getRAPReportInfo();
var _36=false;
for(var lid in this.m_containerInfoJSON){
var _38=this.m_containerInfoJSON[lid].m_itemInfoJSON;
for(var _39 in _38){
var _3a=_38[_39];
if(_3a.hun){
continue;
}
var _3b=this.getHUNForItem(_3a,_33,lid,_35);
if(_3b){
_3a.hun=_3b;
_36=true;
}
}
}
if(_36&&typeof JSON!="undefined"&&JSON!=null&&JSON.stringify){
_34["rapReportInfo"]=JSON.stringify(this.m_reportInfoJSON);
}
}
};
RAPReportInfo.prototype.getHUNForItem=function(_3c,_3d,lid,_3f){
var _40=this.getHUNFromCCDManager(_3d,_3c);
var _41=null;
if(!_40&&_3f){
_41=_3f.getItemInfo(lid,_3c.item);
if(_41){
_40=_41.hun;
}
}
return _40;
};
RAPReportInfo.prototype.getHUNFromCCDManager=function(_42,_43){
var _44={};
var _45=null;
var _46=this._findQueryMetadataId(_42,_44,_43.queryName);
if(_46){
_45=_42.GetHUNForRDI(_43.item,_46);
}
return _45;
};
RAPReportInfo.prototype._findQueryMetadataId=function(_47,_48,_49){
if(_48[_49]){
return _48[_49];
}
var _4a=_47.GetMetadataIdForQueryName(_49);
if(_4a){
_48[_49]=_4a;
return _4a;
}
return null;
};
RAPReportInfo.prototype.isPromptPart=function(){
if(this.m_bPromptPart===null){
if(this.m_reportInfoJSON.reportLevelProperties&&this.m_reportInfoJSON.reportLevelProperties.promptWidget===true){
this.m_bPromptPart=true;
}else{
this.m_bPromptPart=false;
}
}
return this.m_bPromptPart;
};
RAPReportInfo.prototype.getContainerCount=function(){
return this.m_iContainerCount;
};
RAPReportInfo.prototype.isSingleContainer=function(){
if(this.m_bSingleContainer===null){
if(this.m_iContainerCount===1&&this.m_reportInfoJSON.reportLevelProperties&&this.m_reportInfoJSON.reportLevelProperties.singleContainerReport===true){
this.m_bSingleContainer=true;
}else{
this.m_bSingleContainer=false;
}
}
return this.m_bSingleContainer;
};
RAPReportInfo.prototype.isDetailFilteringDisabled=function(){
if(this.m_bDetailFilteringDisabled===null){
if(this.m_reportInfoJSON.reportLevelProperties&&this.m_reportInfoJSON.reportLevelProperties.detailFilteringDisabled===true){
this.m_bDetailFilteringDisabled=true;
}else{
this.m_bDetailFilteringDisabled=false;
}
}
return this.m_bDetailFilteringDisabled;
};
RAPReportInfo.prototype.getPassTrackingtoBUA=function(){
if(this.m_bPassTrackingToBUA===null){
if(this.m_reportInfoJSON.reportLevelProperties&&this.m_reportInfoJSON.reportLevelProperties.shouldNotPassTrackingtoBUA===true){
this.m_bPassTrackingToBUA=false;
}else{
this.m_bPassTrackingToBUA=true;
}
}
return this.m_bPassTrackingToBUA;
};
RAPReportInfo.prototype.getDrilledOnHUNs=function(){
if(!this.m_aDrilledOnHUNs&&this.m_reportInfoJSON.reportLevelProperties&&this.m_reportInfoJSON.reportLevelProperties.drilledOnHUNs){
this.m_aDrilledOnHUNs=this.m_reportInfoJSON.reportLevelProperties.drilledOnHUNs;
}
return this.m_aDrilledOnHUNs;
};
RAPReportInfo.prototype.getDisplayTypes=function(_4b){
if(this.m_sDisplayTypes===null||_4b){
var _4c="";
var _4d=[];
for(var lid in this.m_containerInfoJSON){
if(!_4b||lid!=_4b){
_4d.push(this.m_containerInfoJSON[lid].displayTypeId);
}
}
_4c=_4d.join(",");
if(_4c==""&&this.isPromptPart()){
_4c="promptWidget";
}
if(!_4b){
this.m_sDisplayTypes=_4c;
}
return _4c;
}
return this.m_sDisplayTypes;
};
RAPReportInfo.prototype.isChart=function(lid){
var id=lid.toLowerCase();
return id!="mapchart"&&id.match("chart$")=="chart";
};
RAPReportInfo.prototype.isViz=function(lid){
if(this.m_containerInfoJSON[lid]){
var _52=this.m_containerInfoJSON[lid].displayTypeId;
if(_52){
return (_52.toLowerCase()=="viz");
}
}
return false;
};
RAPReportInfo.prototype.isInteractiveDataContainer=function(lid){
var _54=false;
if(this.m_containerInfoJSON[lid]){
var _55=this.m_containerInfoJSON[lid].displayTypeId;
if(_55){
var id=_55.toLowerCase();
_54=id=="crosstab"||id=="list"||id=="viz"||this.isChart(id);
}
}
return _54;
};
RAPReportInfo.prototype.containsInteractiveDataContainer=function(){
if(this.m_bContainsInteractiveDataContainer==null){
this.m_bContainsInteractiveDataContainer=false;
for(var lid in this.m_containerInfoJSON){
if(this.isInteractiveDataContainer(lid)){
this.m_bContainsInteractiveDataContainer=true;
break;
}
}
}
return this.m_bContainsInteractiveDataContainer;
};
RAPReportInfo.prototype.containsFilters=function(){
return this.m_bContainsFilters;
};
RAPReportInfo.prototype.getFilterObject=function(_58,_59){
for(var lid in this.m_containerInfoJSON){
var _5b=this.getFilterObjectFromContainer(lid,_58,_59);
if(_5b){
return _5b;
}
}
return null;
};
RAPReportInfo.prototype.getFilterObjectFromContainer=function(lid,_5d,_5e){
var _5f=this.m_containerInfoJSON[lid];
if(_5f&&_5f.filter){
var _60=_5f.filter.length;
for(var i=0;i<_60;++i){
var _62=_5f.filter[i];
if(_5d==_62.item){
if(!_5e||(_62.itemLabel&&_62.itemLabel.length>0)){
return _62;
}
}
}
}
return null;
};
RAPReportInfo.prototype.hunHasFilterOrSlider=function(_63){
if(!_63){
return null;
}
for(var lid in this.m_containerInfoJSON){
var _65=this.m_containerInfoJSON[lid];
if(_65&&_65.filter){
var _66=_65.filter.length;
for(var i=0;i<_66;++i){
var _68=_65.filter[i];
if(_68.HUN&&_63.indexOf(_68.HUN)==0){
return _68.item;
}
}
}
if(_65&&_65.sliders){
var _66=_65.sliders.length;
for(var i=0;i<_66;++i){
var _69=_65.sliders[i];
if(_69.hun&&_63.indexOf(_69.hun)==0){
return _69.name;
}
}
}
}
return null;
};
RAPReportInfo.prototype.hasSlider=function(){
return this.m_bContainsSlider;
};
RAPReportInfo.prototype.collectSliderSetFromReportInfo=function(){
var _6a={};
for(var lid in this.m_containerInfoJSON){
var _6c=this.m_containerInfoJSON[lid].sliders;
if(_6c){
for(var _6d=0;_6d<_6c.length;++_6d){
var _6e=_6c[_6d].clientId;
_6a[_6e]=_6c[_6d];
}
}
}
return _6a;
};
RAPReportInfo.prototype._getEventTimings=function(){
return (this.m_reportInfoJSON&&this.m_reportInfoJSON.reportLevelProperties&&this.m_reportInfoJSON.reportLevelProperties.eventTimings)?this.m_reportInfoJSON.reportLevelProperties.eventTimings:null;
};
RAPReportInfo.prototype.destroy=function(){
GUtil.destroyProperties(this);
};
function ModifyReportAction(){
this.m_reuseConversation=true;
};
ModifyReportAction.prototype=new CognosViewerAction();
ModifyReportAction.prototype.addActionContextAdditionalParms=function(){
};
ModifyReportAction.prototype.runReport=function(){
return true;
};
ModifyReportAction.prototype.updateRunReport=function(){
};
ModifyReportAction.prototype.reuseQuery=function(){
return false;
};
ModifyReportAction.prototype.reuseGetParameter=function(){
return true;
};
ModifyReportAction.prototype.reuseConversation=function(_6f){
if(typeof _6f!="undefined"){
this.m_reuseConversation=_6f;
}
return this.m_reuseConversation;
};
ModifyReportAction.prototype.updateInfoBar=function(){
return true;
};
ModifyReportAction.prototype.getUndoHint=function(){
return "";
};
ModifyReportAction.prototype.isUndoable=function(){
return true;
};
ModifyReportAction.prototype.saveSpecForUndo=function(){
return false;
};
ModifyReportAction.prototype.keepFocusOnWidget=function(){
return true;
};
ModifyReportAction.prototype.keepRAPCache=function(){
return true;
};
ModifyReportAction.prototype.getActionKey=function(){
return null;
};
ModifyReportAction.prototype.canBeQueued=function(){
return false;
};
ModifyReportAction.prototype.getPromptOption=function(){
return "false";
};
ModifyReportAction.prototype.createActionDispatcherEntry=function(){
var _70=new ModifyReportDispatcherEntry(this.m_oCV);
_70.initializeAction(this);
return _70;
};
ModifyReportAction.prototype.isSelectSingleMember=function(_71){
var _72=this.m_oCV.getRAPReportInfo();
var _73=_71.getDataItems();
if(_72&&_73.length>0){
var _74=this.getContainerId(this.m_oCV.getSelectionController());
var _75=_72.getItemInfo(_74,_73[0][0]);
if(_75.single=="true"){
return true;
}
}
return false;
};
ModifyReportAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
oCV.setKeepFocus(this.keepFocusOnWidget());
this.updateRunReport();
if(this.runReport()==true){
var _77=this.createActionDispatcherEntry();
this.addAdditionalOptions(_77);
oCV.dispatchRequest(_77);
}else{
var _78=this.createCognosViewerDispatcherEntry("modifyReport");
_78.setCallbacks({"complete":{"object":this,"method":this.updateReportSpecCallback}});
oCV.dispatchRequest(_78);
}
this.fireModifiedReportEvent();
};
ModifyReportAction.prototype.updateReportSpecCallback=function(_79){
var _7a=_79.getResponseState();
var _7b=new RequestHandler(this.m_oCV);
_7b.updateViewerState(_7a);
if(!this.m_bUndoAdded){
this.m_bUndoAdded=true;
var _7c=this.getUndoRedoQueue();
if(_7c){
_7c.initUndoObj({"tooltip":this.getUndoHint(),"saveSpec":true});
_7c.add({"reportUpdated":true});
}
var _7d=this.getCognosViewer().getViewerWidget();
if(_7d){
_7d.updateToolbar();
}
}
};
ModifyReportAction.prototype.addActionContext=function(){
var _7e="<reportActions";
if(this.runReport()==false){
_7e+=" run=\"false\"";
}
_7e+=">";
_7e+=this.getReportActionContext();
_7e+="</reportActions>";
return _7e;
};
ModifyReportAction.prototype.getReportActionContext=function(){
var _7f=this.getCognosViewer();
var _80=_7f.getSelectionController();
var _81="<"+this.m_sAction+">";
var _82=this.getContainerId(_80);
if(_82!=""){
_81+="<id>"+xml_encode(_82)+"</id>";
}
_81+=this.getRTStateInfo();
_81+=this.getSelectionContext();
var _83=this.addActionContextAdditionalParms();
if(_83!=null&&_83!="undefined"){
_81+=_83;
}
_81+="</"+this.m_sAction+">";
if(this.updateInfoBar()){
_81+=this.getGetInfoActionContext();
}
return _81;
};
ModifyReportAction.prototype.getGetInfoActionContext=function(){
return "<GetInfo/>";
};
ModifyReportAction.prototype.getRTStateInfo=function(){
var _84=this.getCognosViewer().getViewerWidget();
if(_84&&_84.getBUXRTStateInfoMap){
var _85=_84.getBUXRTStateInfoMap();
return _85?_85:"";
}
return "";
};
ModifyReportAction.prototype.createEmptyMenuItem=function(){
return {name:"None",label:"(empty)",iconClass:"",action:null,items:null};
};
ModifyReportAction.prototype.getStateFromResponse=function(_86){
var _87=null;
if(_86&&typeof _86!="undefined"&&_86.responseText&&typeof _86.responseText!="undefined"&&_86.responseText.length>0){
var _88=XMLBuilderLoadXMLFromString(_86.responseText);
var _89=_88.getElementsByTagName("state");
if(_89!=null&&_89.length>0){
try{
if(typeof _89[0].text!="undefined"){
_87=eval("("+_89[0].text+")");
}else{
_87=eval("("+_89[0].textContent+")");
}
}
catch(e){
if(typeof console!="undefined"&&console&&console.log){
console.log(e);
}
}
}
}
return _87;
};
ModifyReportAction.prototype.getSelectedCellTags=function(){
var _8a="";
var _8b=this.getCognosViewer().getSelectionController().getSelections();
for(var i=0;i<_8b.length;++i){
var _8d=_8b[i].getCellRef();
var _8e=_8b[i].getDataItems()[0];
if(typeof _8e=="undefined"||_8e==null){
_8e="";
}
var tag=this.getRAPLayoutTag(_8d);
if(tag!=null){
_8a+="<tag><tagValue>"+xml_encode(tag)+"</tagValue><dataItem>"+xml_encode(_8e)+"</dataItem></tag>";
}else{
_8a+="<tag><tagValue/><dataItem>"+xml_encode(_8e)+"</dataItem></tag>";
}
}
if(_8a!=""){
_8a="<selectedCellTags>"+_8a+"</selectedCellTags>";
}
return _8a;
};
ModifyReportAction.prototype.getIsNumericFromReportInfo=function(_90){
var _91=this.getSelectedReportInfo();
if(_91!=null&&typeof _91.itemInfo!="undefined"){
for(var _92=0;_92<_91.itemInfo.length;++_92){
if(_90==_91.itemInfo[_92].item&&typeof _91.itemInfo[_92].numeric!="undefined"){
return (_91.itemInfo[_92].numeric=="true");
}
}
}
return false;
};
function ExpandCollapseMemberAction(){
this.m_sAction="ExpandCollapseMember";
this.m_sExpandCollapseType=null;
this.m_RAPReportInfo=null;
this.m_itemInfo=null;
this.m_sPreviousDataItem=null;
};
ExpandCollapseMemberAction.prototype=new ModifyReportAction();
ExpandCollapseMemberAction.baseclass=ModifyReportAction.prototype;
ExpandCollapseMemberAction.prototype._getCanExpand=function(_93){
var _94=this._getItemInfo(_93);
return (_94&&_94.canExpand);
};
ExpandCollapseMemberAction.prototype._isExpanded=function(_95){
var _96=this._getSelectedMUN(_95);
if(!_96){
return false;
}
var _97=this._getItemInfo(_95);
return (_97&&_97.expandedMembers&&_97.expandedMembers[_96]===true);
};
ExpandCollapseMemberAction.prototype._getSelectedMUN=function(_98){
var _99=null;
var _9a=_98.getMuns();
if(_9a&&_9a.length>0&&_9a[0].length>0){
_99=_9a[0][0];
}
return _99;
};
ExpandCollapseMemberAction.prototype._getDataItem=function(_9b){
if(!_9b){
return null;
}
var _9c=null;
var _9d=_9b.getDataItems();
if(_9d&&_9d.length>0&&_9d[0].length>0){
_9c=_9d[0][0];
}
return _9c;
};
ExpandCollapseMemberAction.prototype._getItemInfo=function(_9e){
var _9f=this._getDataItem(_9e);
if(!_9f){
return null;
}
var _a0=this.removeNamespace(_9e.getLayoutElementId());
this.m_RAPReportInfo=this.m_oCV.getRAPReportInfo();
this.m_itemInfo=this.m_RAPReportInfo.getItemInfo(_a0,_9f);
this.m_sPreviousDataItem=_9f;
return this.m_itemInfo;
};
ExpandCollapseMemberAction.prototype._alwaysCanExpandCollapse=function(_a1){
var _a2=this._getItemInfo(_a1);
return (_a2&&_a2.alwaysCanExpandCollapse);
};
ExpandCollapseMemberAction.prototype._canShowMenu=function(_a3){
var _a4=this._getFirstSelectedObject(_a3);
return (_a4&&this._hasMUN(_a4)&&this._isCrosstab(_a4)&&this._isOnEdge(_a4)&&!_a3.areSelectionsMeasureOrCalculation());
};
ExpandCollapseMemberAction.prototype._getCtxId=function(_a5){
var _a6=_a5.getCellRef();
if(_a6&&_a6.getAttribute){
var _a7=_a6.getAttribute("ctx");
if(_a7){
_a7=_a7.split("::")[0].split(":")[0];
return _a7;
}
}
return "";
};
ExpandCollapseMemberAction.prototype._hasMUN=function(_a8){
var _a9=_a8.getMuns();
return _a9.length>0?true:false;
};
ExpandCollapseMemberAction.prototype._isCrosstab=function(_aa){
return _aa.getDataContainerType()==="crosstab"?true:false;
};
ExpandCollapseMemberAction.prototype._isOnEdge=function(_ab){
return _ab.getLayoutType()==="columnTitle"?true:false;
};
ExpandCollapseMemberAction.prototype.keepRAPCache=function(){
return false;
};
ExpandCollapseMemberAction.prototype.updateMenu=function(_ac){
var _ad=this.m_oCV.getSelectionController();
_ac.visible=this._canShowMenu(_ad);
if(!_ac.visible){
return _ac;
}
_ac.disabled=!this._canEnableMenu(_ad);
return _ac;
};
ExpandCollapseMemberAction.prototype._canEnableMenu=function(_ae){
return true;
};
ExpandCollapseMemberAction.prototype._getFirstSelectedObject=function(_af){
var _b0=_af.getAllSelectedObjects();
if(_b0.length>0){
return _b0[0];
}
return null;
};
ExpandCollapseMemberAction.prototype._isSingleSelection=function(_b1){
var _b2=_b1.getAllSelectedObjects();
return (_b2.length===1);
};
ExpandCollapseMemberAction.prototype.addActionContextAdditionalParms=function(){
var _b3=this.getCognosViewer().getSelectionController();
var _b4=this._getFirstSelectedObject(_b3);
var _b5=_b3.getPun(this._getCtxId(_b4));
if(_b5){
_b5="<PUN>"+sXmlEncode(_b5)+"</PUN>";
}
var _b6="";
if(this.m_sExpandCollapseType){
_b6="<ExpandCollapseType>"+this.m_sExpandCollapseType+"</ExpandCollapseType>";
}
return this.getSelectedCellTags()+_b5+_b6;
};
function ExpandMemberAction(){
this.m_sAction="ExpandCollapseMember";
this.m_sExpandCollapseType="ExpandMember";
};
ExpandMemberAction.prototype=new ExpandCollapseMemberAction();
ExpandMemberAction.baseclass=ExpandCollapseMemberAction.prototype;
ExpandMemberAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_EXPAND_MEMBER;
};
ExpandMemberAction.prototype._canEnableMenu=function(_b7){
if(!this._isSingleSelection(_b7)){
return false;
}
var _b8=this._getFirstSelectedObject(_b7);
if(this._alwaysCanExpandCollapse(_b8)){
return true;
}
var _b9=this._getCtxId(_b8);
var _ba=true;
if(_b7.getDrillUpDownEnabled()===true){
_ba=_b7.canDrillDown(_b9);
}
return (_ba&&this._getCanExpand(_b8)&&!this._isExpanded(_b8));
};
function CollapseMemberAction(){
this.m_sAction="ExpandCollapseMember";
this.m_sExpandCollapseType="CollapseMember";
};
CollapseMemberAction.prototype=new ExpandCollapseMemberAction();
CollapseMemberAction.baseclass=ExpandCollapseMemberAction.prototype;
CollapseMemberAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_COLLAPSE_MEMBER;
};
CollapseMemberAction.prototype._canDisableMenu=function(_bb){
if(this._isSingleSelection(_bb)&&!this._isExpanded()){
return true;
}
return false;
};
CollapseMemberAction.prototype._canEnableMenu=function(_bc){
var _bd=this._getFirstSelectedObject(_bc);
if(this._alwaysCanExpandCollapse(_bd)){
return true;
}
return (this._isSingleSelection(_bc)&&this._isExpanded(_bd));
};
function DrillAction(){
this.m_bUseReportInfoSelection=false;
this.m_aDrillSelectedObjects=[];
this.m_useMARequest=false;
this.m_userSelectedDrillItem=null;
};
DrillAction.prototype=new ModifyReportAction();
DrillAction.prototype.getHoverClassName=function(){
return "";
};
DrillAction.prototype.setRequestParms=function(_be){
if(_be){
this.m_userSelectedDrillItem=_be.userSelectedDrillItem;
}
};
DrillAction.prototype.setKeepFocusOnWidget=function(_bf){
this.m_bKeepFocusOnWidget=_bf;
};
DrillAction.prototype.keepFocusOnWidget=function(){
if(typeof this.m_bKeepFocusOnWidget!="undefined"){
return this.m_bKeepFocusOnWidget;
}
return true;
};
DrillAction.prototype.getDrillabilityForItemFromReportInfo=function(_c0){
if(!this.m_oCV){
return null;
}
var _c1=this.m_oCV.getRAPReportInfo();
if(!_c1){
return null;
}
var _c2=_c1.getContainers();
for(var _c3 in _c2){
var _c4=_c1.getDrillability(_c3);
if(_c4[_c0]){
return _c4[_c0];
}
}
return null;
};
DrillAction.prototype.onDoubleClick=function(evt){
this.execute();
};
DrillAction.prototype.preProcess=function(){
if(typeof this.m_drillSpec==="undefined"||this.m_drillSpec===null){
var _c6=this.generateDrillSpecObjects();
if(!_c6){
return null;
}
var _c7=this.getCognosViewer();
var _c8=_c7.getViewerWidget();
if(_c8){
var _c9=_c7.getModelPath();
_c8.getWidgetContextManager().raiseDrillEvent(_c6,this.m_sAction,_c9);
}
}
};
DrillAction.prototype.generateDrillSpecObjects=function(){
try{
var _ca=[];
var oCV=this.getCognosViewer();
var _cc=oCV.getDrillMgr();
var _cd=oCV.getSelectionController();
var _ce=true;
var _cf=_cc.getDrillParameters(this.m_drillOption,true,_ce,this.m_userSelectedDrillItem);
if(_cf.length===0){
return null;
}
var _d0=_cc.getSelectedObject();
if(_cf.length>3*4&&(_d0.getDataContainerType()=="crosstab"||_d0.getLayoutType()=="chartElement")){
_cf.length=3*4;
}
var _d1=_cc.getSelectedObject().getSelectedContextIds();
for(var i=0,_d3=0;_d3<_d1.length&&i<_cf.length;++_d3){
var _d4=_d1[_d3][0];
var _d5=_cd.getRefDataItem(_d4);
var _d6=_cd.getMun(_d4);
var _d7=_cd.getDisplayValue(_d4);
if(_cd.getDrillFlagForMember(_d4)===0){
i=i+4;
continue;
}
var _d8={"dataItem":_cf[i++],"mun":_cf[i++],"lun":_cf[i++],"hun":_cf[i++]};
if(_d5!=""&&_d7!=""){
if(_d8.dataItem===_d5){
_d8.displayValue=_d7;
}
}
var _d9=_cd.getUsageInfo(_d4);
_d8.isMeasure=(_d9==="2")?"true":"false";
var _da=false;
if(_d6!=""&&_d9!="2"){
var _db=this.getDrillabilityForItemFromReportInfo(_d5);
if((_db!=null&&_db.disableDown==true)||this.m_oCV.getSelectionController().getDrillFlagForMember(_d4)==1){
_da=true;
}
}
if(_da){
if(_d8.dataItem===_d5){
_d8.summary="true";
}
}
_ca.push(_d8);
}
return (_ca.length>0)?_ca:null;
}
catch(e){
return null;
}
};
DrillAction.prototype.parseDrillSpec=function(evt){
try{
var oCV=this.getCognosViewer();
if(oCV.getStatus()!=="complete"||oCV.getConversation()===""){
return false;
}
this.m_drillSpec=evt.payload.drillSpec;
var _de=XMLBuilderLoadXMLFromString(this.m_drillSpec);
var _df=_de.firstChild;
var _e0=getCognosViewerSCObjectRef(oCV.getId());
_e0.m_aSelectedObjects=[];
if(_e0.hasSelectedChartNodes()){
_e0.clearSelectionData();
}
var _e1=XMLHelper_FindChildrenByTagName(_df,"DrillGroup",false);
for(var _e2=0;_e2<_e1.length;++_e2){
var _e3=XMLHelper_FindChildByTagName(_e1[_e2],"MUN",false);
var _e4=XMLHelper_GetText(_e3);
var _e5="";
var _e6="";
var _e7="";
var _e8="";
var _e9=XMLHelper_FindChildByTagName(_e1[_e2],"DisplayValue",false);
if(_e9!=null){
_e7=XMLHelper_GetText(_e9);
}
var _ea=XMLHelper_FindChildByTagName(_e1[_e2],"LUN",false);
if(_ea!=null){
_e5=XMLHelper_GetText(_ea);
}
var _eb=XMLHelper_FindChildByTagName(_e1[_e2],"HUN",false);
if(_eb!=null){
_e6=XMLHelper_GetText(_eb);
}
var _ec=XMLHelper_FindChildByTagName(_e1[_e2],"Summary",false);
if(_ec!=null){
_e8=XMLHelper_GetText(_ec);
}
this.selectObject(_e4,_e5,_e6,_e7,_e8,_e0);
}
}
catch(e){
return false;
}
return (_e0.m_aSelectedObjects.length>0);
};
DrillAction.prototype.parseDrillSpecObjects=function(_ed){
if(this.useReportInfoSelection()){
return this.parseDrillSpecObjectsWithReportInfo(_ed);
}
try{
var oCV=this.getCognosViewer();
if(oCV.getStatus()!=="complete"||oCV.getConversation()===""){
return false;
}
this.m_drillSpec="";
var _ef=getCognosViewerSCObjectRef(oCV.getId());
_ef.m_aSelectedObjects=[];
if(_ef.hasSelectedChartNodes()){
_ef.clearSelectionData();
}
for(var i in _ed){
var _f1=_ed[i];
var _f2=(_f1.summary)?_f1.summary:"";
var _f3=true;
this.selectObject(_f1.mun,_f1.lun,_f1.hun,_f1.displayValue,_f2,_ef,_f3);
}
}
catch(e){
return false;
}
return (_ef.m_aSelectedObjects.length>0);
};
DrillAction.prototype.getDrillabilityForCtxValue=function(_f4){
if(console&&console.log){
console.log("Required method, getDrillabilityForCtxValue, not implemented.");
}
};
DrillAction.prototype.setDrillabilityForSelectObject=function(_f5){
this.drillability=this.getDrillabilityForCtxValue(_f5);
};
DrillAction.prototype.canDrillDown=function(){
if(console&&console.log){
console.log("Required method, canDrillDown, not implemented.");
}
};
DrillAction.prototype.canDrilUp=function(){
if(console&&console.log){
console.log("Required method, canDrilUp, not implemented.");
}
};
DrillAction.prototype.selectObject=function(_f6,_f7,_f8,_f9,_fa,_fb,_fc){
var _fd=_f8;
var _fe=_f7;
var _ff=_f6;
var _100=false;
var _101=_fb.getCtxIdFromMun(_f6);
var _102=_101;
if(_101===""){
var _103=_fb.replaceNamespaceForSharedTM1DimensionOnly(_f7,_f8,_f6);
_fe=_103.lun;
_fd=_103.hun;
if(_fd!==_f8){
_ff=this._replaceNamespace(_f6,_fd);
}
_100=(_fc==true);
_101=_fb.getCtxIdFromMetaData(_fe,_fd,_100);
if(_101===""){
return false;
}
}
this.setDrillabilityForSelectObject(_101);
if((_100==true)||(this.m_sAction=="DrillDown"&&this.canDrillDown())||(this.m_sAction=="DrillUp"&&this.canDrillUp())){
var _104=_fb.getSelections().length;
_fb.selectObject(_ff,_fe,_fd,_100);
var _105=_fb.getSelections();
if(_102===""&&_105.length>_104){
var _106=_105[_105.length-1].m_aMuns;
_106[_106.length]=[];
_106[_106.length-1].push(_ff);
var _107=_105[_105.length-1].m_aDisplayValues;
_107.push(_f9);
_105[_105.length-1].useDisplayValueFromObject=true;
}
if(_fa=="true"){
_105=_fb.getSelections();
_105[_105.length-1].onSummary=true;
}
}
};
DrillAction.prototype._replaceNamespace=function(mun,_109){
var _10a=null;
if(_109){
var _10b=_109.substr(0,_109.indexOf("].[")+1);
if(mun&&_10b&&!(mun.match("^"+_10b))){
var _10c=mun.indexOf("].[");
_10a=_10b+mun.substr(_10c+1,mun.length);
}
}
return _10a||mun;
};
DrillAction.prototype.addActionContextAdditionalParms=function(){
var _10d="";
var _10e=(this.useReportInfoSelection())?this.m_aDrillSelectedObjects:this.getCognosViewer().getSelectionController().getSelections();
var _10f=null;
for(var i=0;i<_10e.length;++i){
if(_10e[i].onSummary){
_10f=(this.useReportInfoSelection())?_10e[i].item:_10e[i].getDataItems()[0][0];
_10d+="<dataItem>"+xml_encode(_10f)+"</dataItem>";
}
}
if(_10d!=""){
_10d="<onSummary>"+_10d+"</onSummary>";
}
if(this.m_userSelectedDrillItem){
_10d+=("<userSelectedDrillItem>"+this.m_userSelectedDrillItem+"</userSelectedDrillItem>");
}
if(this.m_useMARequest===true){
_10d=_10d+"<useMAGetChildRequest>false</useMAGetChildRequest>";
_10d=_10d+"<useMAGetParentRequest>false</useMAGetParentRequest>";
}
_10d+=this.addClientContextData(3);
return _10d;
};
DrillAction.prototype.getDrillOptionsAsString=function(){
var _111=this.getViewerWidget();
var _112="";
if(_111){
_112="<addSummaryMembers>"+_111.getDrillOptions().addSummaryMembers+"</addSummaryMembers>";
_112=_112+"<backwardsCompatible>"+_111.getDrillOptions().backwardsCompatible+"</backwardsCompatible>";
}
return _112;
};
DrillAction.prototype.getItemInfo=function(_113,_114){
var _115=_113.getRAPReportInfo();
if(!_115){
return null;
}
var _116=_115.getContainers();
for(var _117 in _116){
var _118=_115.getItemInfo(_117);
if(_118[_114]){
return _118[_114];
}
}
return null;
};
DrillAction.prototype.isSelectionFilterEnabled=function(){
var _119=this.getViewerWidget();
if(!_119){
return false;
}
return _119.isSelectionFilterEnabled();
};
DrillAction.prototype.getHierarchyHasExpandedSet=function(_11a,_11b){
var _11c=this.getItemInfo(_11a,_11b);
return (_11c&&_11c.hierarchyHasExpandedMembers);
};
DrillAction.prototype.getIsRSDrillParent=function(_11d,_11e){
var _11f=this.getItemInfo(_11d,_11e);
return (_11f&&_11f.isRSDrillParent);
};
DrillAction.prototype.setUseReportInfoSelection=function(_120){
this.m_bUseReportInfoSelection=_120;
};
DrillAction.prototype.useReportInfoSelection=function(){
return this.m_bUseReportInfoSelection;
};
DrillAction.prototype.parseDrillSpecObjectsWithReportInfo=function(_121){
try{
var _122=this.m_oCV.getRAPReportInfo();
if(!_122){
return null;
}
this.m_drillSpec="";
this.m_aDrillSelectedObjects=[];
for(var i in _121){
this.populateSelectObjectWithReportInfo(_121[i],_122);
}
}
catch(e){
return false;
}
return (this.m_aDrillSelectedObjects.length>0);
};
DrillAction.prototype.populateSelectObjectWithReportInfo=function(_124,_125){
var _126=_125.getItemDetails(_124.dataItem,_124.hun);
if(!_126){
_126=_125.getItemDetailsByHun(_124.hun);
if(!_126){
return null;
}
}
if(_124.mun){
_126.mun=_124.mun;
}
if(_124.lun){
_126.lun=_124.lun;
}
if(_124.displayValue){
_126.displayValue=_124.displayValue;
}
if(_124.isMeasure==="true"){
_126.isMeasure=true;
}
if(_124.summary==="true"){
_126.onSummary=true;
}
this.m_aDrillSelectedObjects.push(_126);
};
DrillAction.prototype.getSelectionContext=function(){
if(this.useReportInfoSelection()){
return this.genLeanSelection();
}else{
return CognosViewerAction.prototype.getSelectionContext.call(this);
}
};
DrillAction.prototype.genLeanSelection=function(){
if(this.m_aDrillSelectedObjects.length==0){
return "";
}
var _127="";
for(var idx in this.m_aDrillSelectedObjects){
var obj=this.m_aDrillSelectedObjects[idx];
_127+="<selectedCell>";
_127+=("<name>"+obj.item+"</name>"+"<display>"+obj.displayValue+"</display>"+"<rapLayoutTag>"+obj.lid+"</rapLayoutTag>"+"<queryName>"+obj.queryName+"</queryName>");
if(obj.mun){
_127+=("<nodeUse>"+obj.mun+"</nodeUse>");
_127+=("<nodeType>memberUniqueName</nodeType>");
}
if(obj.hun){
_127+=("<nodeHierarchyUniqueName>"+obj.hun+"</nodeHierarchyUniqueName>");
}
var _12a=(obj.isMeasure)?"measure":"nonMeasure";
_127+=("<nodeUsage>"+_12a+"</nodeUsage>");
_127+="</selectedCell>";
}
return ("<selection>"+_127+"</selection>");
};
DrillAction.prototype.runReport=function(){
if(this.getViewerWidget()){
return this.getViewerWidget().shouldReportBeRunOnAction();
}else{
return true;
}
};
DrillAction.prototype.canBeQueued=function(){
if(this.getViewerWidget()){
return !(this.getViewerWidget().isVisible());
}else{
return false;
}
};
function DrillUpDownAction(){
this.m_sAction="DrillDown";
this.m_drillOption="drillDown";
this.undoTooltip="";
};
DrillUpDownAction.prototype=new DrillAction();
DrillUpDownAction.prototype.getHoverClassName=function(){
return "dl";
};
DrillUpDownAction.prototype.getUndoHint=function(){
return this.undoTooltip;
};
DrillUpDownAction.prototype.keepRAPCache=function(){
return false;
};
DrillUpDownAction.prototype.updateDrillability=function(_12b,_12c){
this.m_oCV=_12b;
var _12d=_12c.getAttribute("ctx");
this.drillability=0;
if(_12d){
var _12e=_12d.split("::");
if(_12e&&_12e.length>0){
if(_12e.length>2){
this.drillability=this.getDrillabilityForIntersection(_12e[1].split(":")[0],_12e[2].split(":")[0]);
}else{
if(_12e.length===2){
this.drillability=this.getDrillabilityForCtxValue(_12e[1].split(":")[0]);
}else{
this.drillability=this.getDrillabilityForCtxValue(_12e[0].split(":")[0]);
}
}
}
}
if(this.isDefaultDrillUp(_12c)){
this.m_sAction="DrillUp";
this.m_drillOption="drillUp";
this.undoTooltip=RV_RES.RV_DRILL_UP;
}else{
this.m_sAction="DrillDown";
this.m_drillOption="drillDown";
this.undoTooltip=RV_RES.RV_DRILL_DOWN;
}
return this.drillability;
};
DrillUpDownAction.prototype.updateDrillabilityFromSelections=function(){
var _12f=this.m_oCV.getSelectionController();
var _130=_12f.getAllSelectedObjects();
this.drillability=0;
if(_130!=null&&typeof _130!="undefined"&&_130.length==1&&_130[0].m_contextIds!=null){
if(_130[0].getLayoutType()=="section"){
this.drillability=0;
}else{
if(_130[0].m_contextIds.length==0){
this.drillability=0;
}else{
if(typeof DrillContextMenuHelper!=="undefined"&&DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV)){
this.drillability=this.getDrillabilityForAll(_130[0].m_contextIds);
}else{
if(_130[0].m_contextIds.length>2){
this.drillability=this.getDrillabilityForIntersection(_130[0].m_contextIds[1][0],_130[0].m_contextIds[2][0]);
}else{
this.drillability=this.getDrillabilityForCtxValue(_130[0].m_contextIds[0][0]);
}
}
}
}
}
return this.drillability;
};
DrillUpDownAction.prototype.getDrillabilityForCtxValue=function(_131){
var _132=0;
var _133=this.m_oCV.getSelectionController();
var _134=_133.getRefDataItem(_131);
if(this.getHierarchyHasExpandedSet(this.m_oCV,_134)&&this.getIsRSDrillParent(this.m_oCV,_134)){
_132=1;
return _132;
}
if(_133.getMun(_131)!==""&&_133.getUsageInfo(_131)!=="2"){
_132=(+_133.getDrillFlagForMember(_131));
var _135=this.getDrillabilityForItemFromReportInfo(_133.getRefDataItem(_131));
if(_135!=null){
if(_135.disableDown==true||_135.isolated==true){
if(_132==1||_132>=3||_135.isolated==true){
_132=1;
}else{
_132=0;
}
}
if(_135.disableUp==true){
if(_132>=2){
_132=2;
}else{
_132=0;
}
}
}
}
return _132;
};
DrillUpDownAction.prototype.getDrillabilityForIntersection=function(_136,_137){
var _138=this.getDrillabilityForCtxValue(_136);
return this.mergeDrillability(_138,_137);
};
DrillUpDownAction.prototype.getDrillabilityForAll=function(_139){
var _13a=(_139.length>=2)?1:0;
var _13b;
if(_139.length==2){
_13b=1;
}else{
if(_139.length>2){
_13b=2;
}else{
_13b=0;
}
}
var _13c=0;
for(var iDim=_13a;iDim<=_13b;++iDim){
for(var _13e=0;_13e<_139[iDim].length;++_13e){
_13c=this.mergeDrillability(_13c,_139[iDim][_13e]);
}
}
return _13c;
};
DrillUpDownAction.prototype.mergeDrillability=function(_13f,_140){
var _141=this.getDrillabilityForCtxValue(_140);
if(_13f==_141){
return _13f;
}
if(_13f>_141){
var temp=_13f;
_13f=_141;
_141=temp;
}
if(_13f==1&&_141==2){
return 3;
}
return _141;
};
DrillUpDownAction.prototype.hasPermission=function(){
if(this.m_oCV){
if(this.m_oCV.isDrillBlackListed()){
return false;
}
var _143=this.m_oCV.envParams;
if(_143){
return !(this.m_oCV.isLimitedInteractiveMode()||(_143["cv.objectPermissions"].indexOf("read")===-1));
}
}
return false;
};
DrillUpDownAction.prototype.canDrillUp=function(){
return ((this.drillability==1||this.drillability==3||this.drillability==4)&&this.hasPermission());
};
DrillUpDownAction.prototype.canDrillDown=function(){
return ((this.drillability==2||this.drillability==3||this.drillability==4)&&this.hasPermission());
};
DrillUpDownAction.prototype.isDefaultDrillUp=function(_144){
if(this.drillability==1||this.drillability==4||(_144&&_144.getAttribute("ischarttitle")==="true")){
return true;
}else{
return false;
}
};
DrillUpDownAction.prototype.doOnMouseOver=function(evt){
if(this.drillability>0&&!this.getCognosViewer().isLimitedInteractiveMode()){
var _146=getCtxNodeFromEvent(evt);
this.addDrillableClass(_146);
if(evt.toElement&&evt.toElement.nodeName&&evt.toElement.nodeName.toLowerCase()=="img"){
this.addDrillableClass(evt.toElement);
}
}
};
DrillUpDownAction.prototype.doOnMouseOut=function(evt){
var _148=getCtxNodeFromEvent(evt);
if(_148){
this.removeDrillableClass(_148);
if(evt.toElement&&evt.toElement.nodeName&&evt.toElement.nodeName.toLowerCase()=="img"){
this.removeDrillableClass(evt.toElement);
}
}
};
DrillUpDownAction.prototype.onMouseOver=function(evt){
this.doOnMouseOver(evt);
};
DrillUpDownAction.prototype.onMouseOut=function(evt){
this.doOnMouseOut(evt);
};
DrillUpDownAction.prototype.onDoubleClick=function(evt){
if(this.drillability>0&&this.hasPermission()&&!this.isSelectionFilterEnabled()){
this.execute();
var _14c=getCtxNodeFromEvent(evt);
if(_14c!=null){
this.removeDrillableClass(_14c);
}
}
};
DrillUpDownAction.prototype.addDrillableClass=function(node){
if(!node.className.match(new RegExp("(\\s|^)"+this.getHoverClassName()+"(\\s|$)"))){
node.className+=" "+this.getHoverClassName();
}
};
DrillUpDownAction.prototype.removeDrillableClass=function(node){
var _14f=node.className;
_14f=_14f.replace(new RegExp("(\\s|^)"+this.getHoverClassName()+"(\\s|$)")," ");
node.className=_14f.replace(/^\s*/,"").replace(/\s*$/,"");
};
function DrillUpDownOrThroughAction(){
this.m_hasAuthoredDrillTargets=false;
this.m_canDrillUpDown=false;
};
DrillUpDownOrThroughAction.prototype=new DrillUpDownAction();
DrillUpDownOrThroughAction.prototype.init=function(_150,_151){
if(this.getCognosViewer()){
var _152=this.getCognosViewer().getViewerWidget();
if(_152&&_152.isSelectionFilterEnabled()){
return;
}else{
if(this.m_oCV.isDrillBlackListed()){
return;
}
}
}
this.m_hasAuthoredDrillTargets=_150;
this.m_canDrillUpDown=_151;
};
DrillUpDownOrThroughAction.prototype.updateDrillabilityInfo=function(_153,_154){
if(this.m_canDrillUpDown){
return this.updateDrillability(_153,_154);
}
return null;
};
DrillUpDownOrThroughAction.prototype.onMouseOver=function(evt){
if(this.m_hasAuthoredDrillTargets){
var _156=getCtxNodeFromEvent(evt);
if(_156){
this.addDrillableClass(_156);
this._set_chartImage_drillThroughCursor_IE("pointer",evt);
}
}
if(this.m_canDrillUpDown&&!this.isSelectionFilterEnabled()&&!this.m_oCV.isDrillBlackListed()){
this.doOnMouseOver(evt);
}
};
DrillUpDownOrThroughAction.prototype.onMouseOut=function(evt){
if(this.m_hasAuthoredDrillTargets){
var _158=getCtxNodeFromEvent(evt);
if(_158){
this.removeDrillableClass(_158);
this._set_chartImage_drillThroughCursor_IE("default",evt);
}
}
if(this.m_canDrillUpDown&&!this.isSelectionFilterEnabled()&&!this.m_oCV.isDrillBlackListed()){
this.doOnMouseOut(evt);
}
};
DrillUpDownOrThroughAction.prototype._getDrillThroughChartImage_from_chartArea=function(evt){
var _15a=getCrossBrowserNode(evt);
if(_15a){
var _15b=this.m_oCV.getSelectionController();
return _15b.getSelectedChartImageFromChartArea(_15a);
}
};
DrillUpDownOrThroughAction.prototype._set_chartImage_drillThroughCursor_IE=function(_15c,evt){
if(dojo.isIE||dojo.isTrident){
var oImg=this._getDrillThroughChartImage_from_chartArea(evt);
if(oImg){
oImg.style.cursor=_15c;
}
}
};
function DrillDownAction(){
this.m_sAction="DrillDown";
this.m_drillOption="drillDown";
};
DrillDownAction.prototype=new DrillUpDownAction();
DrillDownAction.prototype.getUndoHint=function(){
return RV_RES.RV_DRILL_DOWN;
};
DrillDownAction.prototype.getHoverClassName=function(){
return "dl";
};
DrillDownAction.prototype.updateMenu=function(_15f){
_15f.visible=this.ifContainsInteractiveDataContainer();
if(!_15f.visible){
return _15f;
}
this.updateDrillabilityFromSelections();
if(!this.canDrillDown()){
_15f.disabled=true;
}else{
_15f.disabled=false;
DrillContextMenuHelper.updateDrillMenuItems(_15f,this.m_oCV,this.m_sAction);
}
return _15f;
};
function DrillUpAction(){
this.m_sAction="DrillUp";
this.m_drillOption="drillUp";
};
DrillUpAction.prototype=new DrillUpDownAction();
DrillUpAction.prototype.getHoverClassName=function(){
return "dl";
};
DrillUpAction.prototype.getUndoHint=function(){
return RV_RES.RV_DRILL_UP;
};
DrillUpAction.prototype.updateMenu=function(_160){
_160.visible=this.ifContainsInteractiveDataContainer();
if(!_160.visible){
return _160;
}
this.updateDrillabilityFromSelections();
if(!this.canDrillUp()){
_160.disabled=true;
}else{
_160.disabled=false;
DrillContextMenuHelper.updateDrillMenuItems(_160,this.m_oCV,this.m_sAction);
}
return _160;
};
function CognosViewerSort(_161,oCV){
this.m_oCV=oCV;
if(_161){
this.m_oEvent=_161;
this.m_oNode=getCrossBrowserNode(_161,true);
}
};
CognosViewerSort.prototype.setNode=function(node){
this.m_oNode=node;
};
CognosViewerSort.prototype.getNode=function(){
return this.m_oNode;
};
CognosViewerSort.prototype.isSort=function(){
if(this.m_oNode&&this.m_oNode.nodeName=="IMG"&&(this.m_oNode.id).indexOf("sortimg")>=0){
return true;
}else{
return false;
}
};
CognosViewerSort.prototype.execute=function(){
var _164=getCognosViewerSCObjectRef(this.m_oCV.getId());
_164.selectSingleDomNode(this.m_oNode.parentNode);
var _165=this.getSortAction();
_165.setCognosViewer(this.m_oCV);
_165.execute();
if(window.gViewerLogger){
window.gViewerLogger.addContextInfo(_164);
}
};
CognosViewerSort.prototype.getSortAction=function(){
var _166=this.m_oCV.getAction("Sort");
var _167=this.m_oNode.getAttribute("sortOrder");
if(_167.indexOf("nosort")!=-1){
_166.setRequestParms({order:"ascending",type:"value"});
}else{
if(_167.indexOf("ascending")!=-1){
_166.setRequestParms({order:"descending",type:"value"});
}else{
if(_167.indexOf("descending")!=-1){
_166.setRequestParms({order:"none",type:"value"});
}
}
}
return _166;
};
function SortAction(){
this.m_sAction="Sort";
this.m_sortOrder="none";
this.m_sortType="";
this.m_sItem="";
this.m_sId="";
};
SortAction.prototype=new ModifyReportAction();
SortAction.prototype.doExecute=function(){
if(this.m_sortOrder==="none"){
if(this.getContainerId(this.m_oCV.getSelectionController())){
var _168=this.getCurrentSortFromSelection();
if(this.m_sortType==="value"&&_168.indexOf("sortByValue")===-1){
return false;
}else{
if(this.m_sortType==="label"&&_168.indexOf("sortByLabel")===-1){
return false;
}
}
}
}
return true;
};
SortAction.prototype.execute=function(){
if(this.doExecute()){
ModifyReportAction.prototype.execute.call(this);
}
};
SortAction.prototype.getUndoHint=function(){
if(this.m_sortOrder=="none"){
return RV_RES.IDS_JS_DONT_SORT;
}else{
return RV_RES.IDS_JS_SORT;
}
};
SortAction.prototype.setRequestParms=function(_169){
this.m_sortOrder=_169.order;
this.m_sortType=_169.type;
if(_169.id!=null&&typeof _169.id!="undefined"){
this.m_sId=_169.id;
}
if(_169.item!=null&&typeof _169.item!="undefined"){
this.m_sItem=_169.item;
}
};
SortAction.prototype.addActionContextAdditionalParms=function(){
var _16a=this.m_oCV.getSelectionController();
var _16b="<order>"+this.m_sortOrder+"</order>";
if(this.m_sortType=="label"){
_16b+="<byLabel/>";
}
if(this.getContainerId(_16a)==""&&this.m_sId!=null&&typeof this.m_sId!="undefined"&&this.m_sId!=""){
_16b+=("<id>"+xml_encode(this.m_sId)+"</id>");
}
if(this.m_sItem!=null&&typeof this.m_sItem!="undefined"&&this.m_sItem!=""){
_16b+=("<item>"+xml_encode(this.m_sItem)+"</item>");
}
_16b+=this.addClientContextData(3);
_16b+=this.getSelectedCellTags();
return _16b;
};
SortAction.prototype.toggleMenu=function(_16c,_16d){
if(_16d){
_16c.iconClass="sort";
_16c.disabled=false;
}else{
_16c.iconClass="sortDisabled";
_16c.disabled=true;
}
return _16c;
};
SortAction.prototype.updateMenu=function(_16e){
_16e.visible=this.ifContainsInteractiveDataContainer();
if(!_16e.visible){
return _16e;
}
this.buildMenu(_16e);
if(_16e.disabled==true){
return this.toggleMenu(_16e,false);
}
return this.buildDynamicMenuItem(this.toggleMenu(_16e,true),"Sort");
};
SortAction.prototype.buildSelectedItemsString=function(_16f,_170,_171){
try{
var _172=_16f[_16f.length-1];
if(_170){
var _173=_172.getDisplayValues()[0];
if(typeof _173=="undefined"){
_173=_172.getUseValues()[0][0];
}
return _173;
}else{
return _172.getDataItemDisplayValue(_171);
}
}
catch(e){
if(console&&console.log){
console.log(e);
}
}
};
SortAction.prototype.buildMenu=function(_174){
_174.visible=this.ifContainsInteractiveDataContainer();
if(!_174.visible){
return _174;
}
if(!this.isSelectionSortable()){
return this.toggleMenu(_174,false);
}
_174=this.toggleMenu(_174,true);
var _175=[];
var _176=this.m_oCV.getSelectionController();
var _177=_176.getAllSelectedObjects();
if(_177.length==1&&_177[0].isHomeCell()==false){
var _178=_176.getDataContainerType();
var _179=this.getContainerId(_176);
var _17a=this.getReportInfo(_179);
if(_178==""&&!this.isSelectionOnChart()&&_177[0].getLayoutType()=="section"){
if(_17a!=null){
_178=_17a.displayTypeId;
}
}
var _17b,_17c,_17d;
var _17e=this.getCurrentSortFromSelection();
var _17f=this.isSelectionOnChart();
var _180=_17e.indexOf("sortByValue")!=-1;
var _181=_17e.indexOf("sortByValueAscending")!=-1;
var _182=_17e.indexOf("sortByValueDescending")!=-1;
var _183=this.m_oCV.isIWidgetMobile();
if(_178=="list"){
var _184={name:"SortAscending",label:RV_RES.IDS_JS_SORT_ASCENDING,action:{name:"Sort",payload:{order:"ascending",type:"value"}},items:null};
this.addMenuItemChecked(_181,_184,"sortAscending");
_175.push(_184);
var _185={name:"SortDescending",label:RV_RES.IDS_JS_SORT_DESCENDING,action:{name:"Sort",payload:{order:"descending",type:"value"}},items:null};
this.addMenuItemChecked(_182,_185,"sortDescending");
_175.push(_185);
var _186={name:"DontSort",label:RV_RES.IDS_JS_DONT_SORT,action:{name:"Sort",payload:{order:"none",type:"value"}},items:null};
this.addMenuItemChecked(!_180,_186,"sortNone");
_175.push(_186);
}else{
if(_178=="crosstab"||_17f){
if(_177[0].getLayoutType()=="columnTitle"||_17f){
_17b=this.m_oCV.getRAPReportInfo();
if(this.canSortByValueOnCrosstab(_177[0],_17b)){
_17c=RV_RES.IDS_JS_SORT_BY_VALUE;
if(_17f){
_17d=this.buildSelectedItemsString(_177,true,_17a);
if(typeof _17d!=="undefined"){
_17c+=":"+_17d;
}
}
var _187={name:"SortByValue",label:_17c,action:null,items:[{name:"Ascending",label:RV_RES.IDS_JS_SORT_BY_ASCENDING,action:{name:"Sort",payload:{order:"ascending",type:"value"}},items:null},{name:"Descending",label:RV_RES.IDS_JS_SORT_BY_DESCENDING,action:{name:"Sort",payload:{order:"descending",type:"value"}},items:null},{name:"SortNone",label:RV_RES.IDS_JS_DONT_SORT,action:{name:"Sort",payload:{order:"none",type:"value"}},items:null}]};
this.addMenuItemChecked(_180,_187);
this.addMenuItemChecked(_181,_187.items[0],"sortAscending");
this.addMenuItemChecked(_182,_187.items[1],"sortDescending");
this.addMenuItemChecked(!_180,_187.items[2],"sortNone");
if(_183){
_187.flatten=true;
}
_175.push(_187);
}
if(this.canSortByLabelOnCrosstab(_177[0])){
_17c=RV_RES.IDS_JS_SORT_BY_LABEL;
if(_17f){
_17d=this.buildSelectedItemsString(_177,false,_17a);
if(typeof _17d!=="undefined"){
_17c+=":"+_17d;
}
}
var _188={name:"SortByLabel",label:_17c,action:null,items:[{name:"Ascending",label:RV_RES.IDS_JS_SORT_BY_ASCENDING,action:{name:"Sort",payload:{order:"ascending",type:"label"}},items:null},{name:"Descending",label:RV_RES.IDS_JS_SORT_BY_DESCENDING,action:{name:"Sort",payload:{order:"descending",type:"label"}},items:null},{name:"SortNone",label:RV_RES.IDS_JS_DONT_SORT,action:{name:"Sort",payload:{order:"none",type:"label"}},items:null}]};
var _189=_17e.indexOf("sortByLabel")!=-1;
this.addMenuItemChecked(_189,_188);
this.addMenuItemChecked(_17e.indexOf("sortByLabelAscending")!=-1,_188.items[0],"sortAscending");
this.addMenuItemChecked(_17e.indexOf("sortByLabelDescending")!=-1,_188.items[1],"sortDescending");
this.addMenuItemChecked(!_189,_188.items[2],"sortNone");
if(_183){
_188.flatten=true;
}
_175.push(_188);
}
}
}
}
}
if(_175.length==0){
this.toggleMenu(_174,false);
}else{
if(_183){
if(_178=="crosstab"||_17f){
_174.useChildrenItems=true;
}else{
_174.flatten=true;
}
}
_174.items=_175;
this.toggleMenu(_174,true);
}
return _174;
};
SortAction.prototype.isSelectionSortable=function(){
var _18a=this.m_oCV.getSelectionController();
var _18b=_18a.getAllSelectedObjects();
if(_18b.length==1){
var _18c=_18b[0];
if(_18a.getDataContainerType()=="crosstab"&&_18c.getLayoutType()=="datavalue"){
return false;
}
if(_18a.hasSelectedChartNodes()){
var node=_18c.getArea();
if(node.nodeName=="AREA"||node.nodeName=="IMG"){
return _18b[0].getLayoutType()=="ordinalAxisLabel"||_18b[0].getLayoutType()=="legendLabel";
}
}else{
var data=_18c.getDataItems();
if(_18c.getCellRef().getAttribute("type")=="datavalue"&&!(data&&data.length)){
return false;
}
var _18f=_18c.getCellRef();
if(_18f.getAttribute("no_data_item_column")==="true"){
return false;
}
if(_18f.getAttribute("canSort")!="false"){
return true;
}
}
}
return false;
};
SortAction.prototype.getCurrentSortFromSelection=function(){
var _190=this.getContainerId(this.m_oCV.getSelectionController());
var _191=this.m_oCV.getRAPReportInfo();
var _192="";
if(_190!=""&&_191){
var _193=_191.getContainer(_190);
if(typeof _193.sort!="undefined"){
var _194=this.m_oCV.getSelectionController();
var _195=_194.getAllSelectedObjects();
if(_195.length==1){
var _196=_195[0].getDataItems();
if(_196.length<1){
return _192;
}
var _197=_196[0][0];
for(var _198=0;_198<_193.sort.length;++_198){
var _199=_193.sort[_198];
if(typeof _199.labels=="string"&&_199.labels==_197){
_192+=_199.order=="descending"?"sortByLabelDescending":"sortByLabelAscending";
}
if(typeof _199.valuesOf=="string"&&(_199.valuesOf==_197||this.isSortedValueOnRenamedColumn(_195[0],_199))){
_192+=_199.order=="descending"?"sortByValueDescending":"sortByValueAscending";
}else{
if(_199.valuesOf instanceof Array){
var _19a=true;
for(var _19b=0;_19b<_199.valuesOf.length;++_19b){
if(_19b<_195[0].m_contextIds[0].length){
var ctx=_195[0].m_contextIds[0][_19b];
var _19d=_194.getDisplayValue(ctx);
var _19e=this.findItemLabel(_193,_199.valuesOf[_19b].item);
if(_19e!=_19d){
_19a=false;
break;
}
}
}
if(_19a){
_192+=_199.valuesOf[0].order=="descending"?"sortByValueDescending":"sortByValueAscending";
}
}
}
}
}
}
}
return _192;
};
SortAction.prototype.isSortedValueOnRenamedColumn=function(_19f,_1a0){
if(_1a0&&_19f){
return (_1a0.valuesOf===_19f.getColumnRP_Name()&&_19f.getLayoutType()==="columnTitle");
}
};
SortAction.prototype.findItemLabel=function(_1a1,item){
var _1a3=_1a1.itemInfo;
if(_1a3){
for(var i=0;i<_1a3.length;i++){
if(_1a3[i].item===item){
if(_1a3[i].itemLabel){
return _1a3[i].itemLabel;
}
break;
}
}
}
return item;
};
SortAction.prototype.canSortByValueOnCrosstab=function(_1a5,_1a6){
var _1a7=this.m_oCV.getSelectionController();
var _1a8=this.getContainerId(this.m_oCV.getSelectionController());
if(_1a7.isRelational()==true){
return false;
}
if(_1a7.selectionsHaveCalculationMetadata()&&this.selectedObjectIsLeaf(_1a8,_1a5,_1a6)){
var _1a9=_1a5.getMuns()[0];
for(var _1aa=0;_1aa<_1a9.length;++_1aa){
if(_1a9[_1aa]!=null&&_1a9[_1aa].indexOf("uuid:")>=0){
return false;
}
}
return true;
}
return false;
};
SortAction.prototype.selectedObjectIsLeaf=function(_1ab,_1ac,_1ad){
if(_1ad){
var _1ae=_1ac.getDataItems();
if(_1ae!=null&&typeof _1ae!="undefined"&&_1ae.length>0){
var _1af=_1ad.getDrillability(_1ab,_1ae[0][0]);
if(_1af){
return _1af.leaf==true;
}
}
}
return false;
};
SortAction.prototype.canSortByLabelOnCrosstab=function(_1b0){
var _1b1=this.m_oCV.getSelectionController();
var _1b2=_1b1.getAllSelectedObjects();
if(_1b2.length==1){
var _1b0=_1b2[0];
if(this.isSelectSingleMember(_1b0)==false){
if(_1b1.selectionsNonMeasureWithMUN()||!_1b1.selectionsHaveCalculationMetadata()){
return true;
}
}
}
return false;
};
function ActionFormFields(_1b3){
this.m_dispatcherEntry=_1b3;
this.m_oCV=_1b3.getViewer();
};
ActionFormFields.prototype.addFormFields=function(){
var _1b4=this.m_dispatcherEntry;
var _1b5=_1b4.getAction();
_1b5.preProcess();
_1b4.addFormField("ui.action","modifyReport");
if(this.m_oCV.getModelPath()!==""){
_1b4.addFormField("modelPath",this.m_oCV.getModelPath());
if(typeof this.m_oCV.envParams["metaDataModelModificationTime"]!="undefined"){
_1b4.addFormField("metaDataModelModificationTime",this.m_oCV.envParams["metaDataModelModificationTime"]);
}
}
if(_1b5.doAddActionContext()===true){
var _1b6=_1b5.addActionContext();
_1b4.addFormField("cv.actionContext",_1b6);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_1b6,"xml");
}
}
var _1b7=this.m_oCV.envParams["bux"]=="true";
if(_1b7){
_1b4.addFormField("cv.showFaultPage","false");
}else{
_1b4.addFormField("cv.showFaultPage","true");
}
_1b4.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_1b4.addDefinedFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_1b4.addDefinedFormField("modelPath",this.m_oCV.envParams["modelPath"]);
_1b4.addDefinedFormField("packageBase",this.m_oCV.envParams["packageBase"]);
_1b4.addDefinedFormField("rap.state",this.m_oCV.envParams["rap.state"]);
_1b4.addDefinedFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
_1b4.addDefinedFormField("ui.primaryAction",this.m_oCV.envParams["ui.primaryAction"]);
_1b4.addNonNullFormField("cv.debugDirectory",this.m_oCV.envParams["cv.debugDirectory"]);
_1b4.addNonNullFormField("ui.objectClass",this.m_oCV.envParams["ui.objectClass"]);
_1b4.addNonNullFormField("bux",this.m_oCV.envParams["bux"]);
_1b4.addNonNullFormField("baseReportModificationTime",this.m_oCV.envParams["baseReportModificationTime"]);
_1b4.addNonNullFormField("originalReport",this.m_oCV.envParams["originalReport"]);
var _1b8=this.m_oCV.getFlashChartOption();
if(_1b8!=null){
_1b4.addFormField("savedFlashChartOption",_1b8);
if(_1b8&&_1b5!=null&&typeof (_1b5.m_requestParams)!="undefined"&&typeof (_1b5.m_requestParams.targetType)!="undefined"){
var _1b9=false;
var _1ba=null;
if(typeof (_1b5.m_requestParams.targetType.targetType)!="undefined"){
_1ba=_1b5.m_requestParams.targetType.targetType;
}else{
_1ba=_1b5.m_requestParams.targetType;
}
if(_1ba.match("v2_")!=null||_1ba.match("_v2")!=null){
_1b9=true;
}else{
var _1bb=this.m_oCV.getRAPReportInfo();
var _1bc=_1b5.getSelectedReportInfo();
if(_1bb&&_1bc){
var _1bd=_1bb.getDisplayTypes(_1bc.container);
if(_1bd.match("v2_")!=null||_1bd.match("_v2")!=null){
_1b9=true;
}
}
}
_1b4.addFormField("hasAVSChart",_1b9);
}else{
_1b4.addFormField("hasAVSChart",this.m_oCV.hasAVSChart());
}
}
var sEP=this.m_oCV.getExecutionParameters();
if(sEP){
_1b4.addFormField("executionParameters",encodeURIComponent(sEP));
}
_1b4.addFormField("ui.conversation",encodeURIComponent(this.m_oCV.getConversation()));
_1b4.addFormField("m_tracking",encodeURIComponent(this.m_oCV.getTracking()));
var sCAF=this.m_oCV.getCAFContext();
if(sCAF){
_1b4.addFormField("ui.cafcontextid",sCAF);
}
if(_1b5.forceRunSpecRequest()){
_1b4.addFormField("widget.forceRunSpec","true");
}
};
function ModifyReportDispatcherEntry(oCV){
ModifyReportDispatcherEntry.baseConstructor.call(this,oCV);
this.m_action=null;
if(oCV){
this.m_viewerWidget=oCV.getViewerWidget();
this.setRequestHandler(new RequestHandler(oCV));
this.setWorkingDialog(oCV.getWorkingDialog());
this.setRequestIndicator(oCV.getRequestIndicator());
this.setCallbacks({"complete":{"object":this,"method":this.onComplete},"prompting":{"object":this,"method":this.onPrompting}});
}
};
ModifyReportDispatcherEntry.prototype=new AsynchDataDispatcherEntry();
ModifyReportDispatcherEntry.baseConstructor=AsynchDataDispatcherEntry;
ModifyReportDispatcherEntry.prototype.parent=AsynchDataDispatcherEntry.prototype;
ModifyReportDispatcherEntry.prototype.initializeAction=function(_1c1){
this.setKey(_1c1.getActionKey());
this.setCanBeQueued(_1c1.canBeQueued());
this.m_action=_1c1;
};
ModifyReportDispatcherEntry.prototype.getAction=function(){
return this.m_action;
};
ModifyReportDispatcherEntry.prototype.prepareRequest=function(){
if(this.m_viewerWidget){
DispatcherEntry.addWidgetInfoToFormFields(this.m_viewerWidget,this);
}
var _1c2=new ActionFormFields(this);
_1c2.addFormFields();
if(this.m_viewerWidget){
this.addFormField("cv.id",this.m_viewerWidget.getViewerId());
}
this.addFormField("keepIterators","true");
this.addFormField("run.prompt",this.m_action.getPromptOption());
if(this.m_action.reuseQuery()===true){
this.addFormField("reuseResults","true");
}else{
if(this.m_action.reuseGetParameter()===true){
this.addFormField("reuseResults","paramInfo");
}
}
if(this.m_action.keepRAPCache()===false&&this.m_viewerWidget){
this.m_viewerWidget.clearRAPCache();
}
if(this.m_action.reuseConversation()===true){
this.addFormField("cv.reuseConversation","true");
}
if(this.m_action.isUndoable()&&this.m_action.getUndoRedoQueue()){
this.m_action.getUndoRedoQueue().initUndoObj({"tooltip":this.m_action.getUndoHint(),"saveSpec":this.m_action.saveSpecForUndo()});
}
if(this.getViewer().getCurrentlySelectedTab()&&!this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")){
this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",this.getViewer().getCurrentlySelectedTab());
}
this.getViewer().clearTabs();
};
ModifyReportDispatcherEntry.prototype.onComplete=function(_1c3,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onComplete(_1c3);
}
};
ModifyReportDispatcherEntry.prototype.onPrompting=function(_1c5){
if(this.getRequestHandler()){
this.getRequestHandler().onPrompting(_1c5);
}
};
ModifyReportDispatcherEntry.prototype.onWorking=function(_1c6,arg1){
this.parent.onWorking.call(this,_1c6,arg1);
var _1c8=_1c6.getResponseState();
if(this.getRequestHandler()){
this.getRequestHandler().updateViewerState(_1c8);
}
};
SortAction.prototype.getGetInfoActionContext=function(){
return "<GetInfo><include><sort/></include></GetInfo>";
};

