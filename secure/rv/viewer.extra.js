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
 function ViewerA11YHelper(_1){
this.m_oCV=_1;
};
ViewerA11YHelper.prototype.onFocus=function(_2){
var _3=getCrossBrowserNode(_2);
_3=ViewerA11YHelper.findChildOfTableCell(_3);
this.updateCellAccessibility(_3,false);
};
ViewerA11YHelper.prototype.onKeyDown=function(_4){
_4=(_4)?_4:((event)?event:null);
var _5=getCrossBrowserNode(_4);
if(ViewerA11YHelper.isTableCell(_5)){
for(var i=0;i<_5.childNodes.length;i++){
if(_5.childNodes[i].nodeName.toLowerCase()=="span"){
_5=_5.childNodes[i];
break;
}
}
}
if(!this.isValidNodeToSelect(_5)){
return true;
}
_5=ViewerA11YHelper.findChildOfTableCell(_5);
if(_5){
if(_4.keyCode=="39"){
if(this.m_oCV.getState()&&this.m_oCV.getState().getFindState()&&_4.ctrlKey&&_4.shiftKey){
this.m_oCV.executeAction("FindNext");
}else{
this.moveRight(_5);
}
return stopEventBubble(_4);
}else{
if(_4.keyCode=="37"){
this.moveLeft(_5);
return stopEventBubble(_4);
}else{
if(_4.keyCode=="38"){
this.moveUp(_5);
return stopEventBubble(_4);
}else{
if(_4.keyCode=="40"){
this.moveDown(_5);
return stopEventBubble(_4);
}else{
if(_4.keyCode=="13"){
if(this.m_oCV.isBux){
if(this.m_oCV.getViewerWidget().isSelectionFilterEnabled()){
this.m_oCV.getViewerWidget().preprocessPageClicked(false,_4);
if(this.m_oCV.getSelectionController().pageClicked(_4)!==false){
this.m_oCV.JAWSTalk(RV_RES.IDS_JS_SELECTION_FILTER_INFO_JAWS);
this.m_oCV.getViewerWidget().updateToolbar();
}
}else{
this.m_oCV.getSelectionController().pageClicked(_4);
var _7=this.m_oCV.getActionFactory().load("Selection");
_7.onKeyDown(_4);
}
this.m_oCV.getViewerWidget().onSelectionChange();
}else{
this.m_oCV.de(_4);
}
}else{
if(_4.keyCode=="32"){
if(this.m_oCV.isBux){
this.m_oCV.getViewerWidget().preprocessPageClicked(false);
if(this.m_oCV.getSelectionController().pageClicked(_4)!==false&&this.m_oCV.getViewerWidget().isSelectionFilterEnabled()){
this.m_oCV.JAWSTalk(RV_RES.IDS_JS_SELECTION_FILTER_INFO_JAWS);
}
this.m_oCV.getViewerWidget().updateToolbar();
this.m_oCV.getViewerWidget().onSelectionChange();
}else{
this.m_oCV.getSelectionController().pageClicked(_4);
}
return stopEventBubble(_4);
}else{
if(_4.keyCode=="46"&&this.m_oCV.isBux){
if(typeof this.m_oCV.envParams!="undefined"&&typeof this.m_oCV.envParams["ui.action"]!="undefined"&&this.m_oCV.envParams["ui.action"]!="view"&&!this.m_oCV.isLimitedInteractiveMode()){
var _8=this.m_oCV.getActionFactory().load("Delete");
if(!this.m_oCV.isBlacklisted("Delete")&&_8.canDelete()){
_8.execute();
return stopEventBubble(_4);
}
}
}else{
if(this.m_oCV.isBux&&_4.ctrlKey==true&&_4.shiftKey==true&&_4.keyCode=="49"){
var _9=this.m_oCV.getSelectionController().getSelectionObjectFactory().getLayoutElementId(_5);
if(_9!=""){
_9=_9.split(this.m_oCV.getId())[0];
var _a=-1;
var _b=this.m_oCV.getRAPReportInfo();
if(_b){
var _c=_b.getContainer(_9);
if(typeof _c.layoutIndex!="undefined"){
_a=_c.layoutIndex;
}
}
var _d=document.getElementById("infoBarHeaderButton"+_a+this.m_oCV.getId());
if(_d!==null){
this.m_oCV.setCurrentNodeFocus(getCrossBrowserNode(_4));
_d.focus();
}
}
return stopEventBubble(_4);
}else{
if(!this.m_oCV.isBux&&_4.shiftKey==true&&_4.keyCode=="121"){
var _e=this.m_oCV;
var _f=function(){
if(typeof _4.clientX=="undefined"||typeof _4.clientY=="undefined"){
var _10=clientToScreenCoords(_4.target,document.body);
_4.clientX=_10.leftCoord;
_4.clientY=_10.topCoord;
}
_e.dcm(_4,true);
};
if(isFF()){
setTimeout(_f,0);
}else{
_f.call();
}
return stopEventBubble(_4);
}else{
if(this.m_oCV.isBux&&(_4.keyCode=="93"||(_4.shiftKey==true&&_4.keyCode=="121"))){
var _11=this.m_oCV.getViewerWidget();
var _12=this.m_oCV.getSelectionController();
_11.preprocessPageClicked(true);
_12.pageClicked(_4);
_11.updateToolbar();
_11.onContextMenu(_4);
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
ViewerA11YHelper.prototype.isValidNodeToSelect=function(_13){
return this.getValidNodeToSelect(_13)?true:false;
};
ViewerA11YHelper.prototype.getValidNodeToSelect=function(_14){
if(_14&&_14.style&&_14.style.visibility!="hidden"&&_14.style.display!="none"){
var _15=_14.nodeName.toLowerCase();
if((_15=="span"&&(!_14.getAttribute("class")||_14.getAttribute("class").indexOf("expandButton")===-1))||(_15=="div"&&_14.getAttribute("flashchartcontainer")=="true")||(_15=="div"&&_14.getAttribute("chartcontainer")=="true")||(_15=="img"&&(!_14.id||_14.id.indexOf("sortimg")!==0))){
return _14;
}
if(ViewerA11YHelper.isSemanticNode(_14)){
var _16=_14.childNodes&&_14.childNodes.length?_14.childNodes[0]:null;
if(_16){
return this.getValidNodeToSelect(_16);
}
}
}
return null;
};
ViewerA11YHelper.isSemanticNode=function(_17){
if(!ViewerA11YHelper.isSemanticNode._semanticNodeNames){
ViewerA11YHelper.isSemanticNode._semanticNodeNames=["strong","em","h1","h2","h3","h4","h5","h6"];
}
var _18=_17.nodeName.toLowerCase();
for(var i=0;i<ViewerA11YHelper.isSemanticNode._semanticNodeNames.length;i++){
if(_18===ViewerA11YHelper.isSemanticNode._semanticNodeNames[i]){
return true;
}
}
return false;
};
ViewerA11YHelper.isTableCell=function(_1a){
var _1b=_1a.nodeName.toLowerCase();
return _1b==="td"||_1b==="th";
};
ViewerA11YHelper.findChildOfTableCell=function(_1c){
var _1d=_1c;
while(_1d&&_1d.parentNode){
if(ViewerA11YHelper.getTableCell(_1d)){
break;
}
_1d=_1d.parentNode;
}
return _1d;
};
ViewerA11YHelper.getTableCell=function(_1e){
var _1f=_1e.parentNode;
if(ViewerA11YHelper.isTableCell(_1f)){
return _1f;
}
if(ViewerA11YHelper.isSemanticNode(_1f)&&ViewerA11YHelper.isTableCell(_1f.parentNode)){
return _1f.parentNode;
}
return null;
};
ViewerA11YHelper.prototype.moveRight=function(_20){
var _21=this.getNextNonTextSibling(_20);
_21=this.getValidNodeToSelect(_21);
if(_21){
this.setFocusToNode(_21);
return true;
}
var _22=ViewerA11YHelper.getTableCell(_20);
_22=this.getPfMainOutputCell(_22);
while(_22.nextSibling){
if(this.moveToTD(_22.nextSibling)){
return true;
}
_22=_22.nextSibling;
}
var _23=_22.parentNode;
while(_23.nextSibling){
var _24=_23.nextSibling;
if(this.moveToTD(_24.childNodes[0])){
return true;
}
_23=_23.nextSibling;
}
return false;
};
ViewerA11YHelper.prototype.moveLeft=function(_25){
var _26=this.getPreviousNonTextSibling(_25);
_26=this.getValidNodeToSelect(_26);
if(_26){
this.setFocusToNode(_26);
return true;
}
var _27=ViewerA11YHelper.getTableCell(_25);
_27=this.getPfMainOutputCell(_27);
while(_27.previousSibling){
if(this.moveToTDFromTheRight(_27.previousSibling)){
return true;
}
_27=_27.previousSibling;
}
var _28=_27.parentNode;
while(_28.previousSibling){
var _29=_28.previousSibling;
if(this.moveToTDFromTheRight(_29.lastChild)){
return true;
}
_28=_28.previousSibling;
}
return false;
};
ViewerA11YHelper.prototype.moveDown=function(_2a){
var _2b=ViewerA11YHelper.getTableCell(_2a);
_2b=this.getPfMainOutputCell(_2b);
var _2c=this.getColumnIndex(_2b);
_2c+=this.getColSpanFromRowSpans(_2b);
var _2d=_2b.parentNode;
if(_2b.rowSpan&&_2b.rowSpan>1){
var _2e=_2b.rowSpan;
for(var _2f=1;_2f<_2e;_2f++){
_2d=_2d.nextSibling;
}
}
var _30=false;
while(_2d){
if(_2d.nextSibling){
_2d=_2d.nextSibling;
}else{
if(_2b.nextSibling&&!_30){
_2d=_2d.parentNode.firstChild;
_30=true;
_2c++;
}else{
return false;
}
}
if(this.doMoveUpDown(_2d,_2c)){
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.moveUp=function(_31){
var _32=ViewerA11YHelper.getTableCell(_31);
_32=this.getPfMainOutputCell(_32);
var _33=_32.parentNode;
var _34=this.getColumnIndex(_32);
_34+=this.getColSpanFromRowSpans(_32);
var _35=false;
while(_33){
if(_33.previousSibling){
_33=_33.previousSibling;
}else{
if(_32.previousSibling&&!_35){
_33=_33.parentNode.lastChild;
_35=true;
_34--;
}else{
return false;
}
}
if(this.doMoveUpDown(_33,_34)){
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.getNextNonTextSibling=function(_36){
while(_36.nextSibling){
_36=_36.nextSibling;
if(_36.nodeName.toLowerCase()!="#text"){
return _36;
}
}
if(ViewerA11YHelper.isSemanticNode(_36.parentNode)){
return this.getNextNonTextSibling(_36.parentNode);
}
return null;
};
ViewerA11YHelper.prototype.doMoveUpDown=function(_37,_38){
if(_37!=null){
var _39=_37.firstChild;
var pos=this.getColSpanFromRowSpans(_39);
while(_39){
if(pos==_38){
return this.moveToTDFromTheRight(_39);
}else{
if(pos>_38){
break;
}
}
var _3b=0;
if(_39.colSpan){
_3b=_39.colSpan;
}else{
_3b++;
}
pos+=_3b;
_39=_39.nextSibling;
}
}
};
ViewerA11YHelper.prototype.moveToTDFromTheRight=function(td){
td=this.getPfVisibleCell(td);
var _3d=td.childNodes;
for(var _3e=_3d.length-1;_3e>=0;_3e--){
var _3f=this.getValidNodeToSelect(_3d[_3e]);
if(_3f){
if(_3f.childNodes&&_3f.childNodes[0]&&_3f.childNodes[0].nodeName.toLowerCase()=="span"){
_3f=_3f.childNodes[0];
}
if(_3f.tabIndex!=-1&&_3f.tabIndex!=0){
_3f.tabIndex=-1;
}
this.setFocusToNode(_3f);
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.moveToTD=function(td){
td=this.getPfVisibleCell(td);
var _41=td.childNodes;
for(var _42=0;_42<_41.length;_42++){
var _43=this.getValidNodeToSelect(_41[_42]);
if(_43){
if(_43.childNodes&&_43.childNodes[0]&&_43.childNodes[0].nodeName.toLowerCase()=="span"){
_43=_43.childNodes[0];
}
if(_43.tabIndex!=-1&&_43.tabIndex!=0){
_43.tabIndex=-1;
}
this.setFocusToNode(_43);
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.setFocusToNode=function(_44){
this.m_oCV.setCurrentNodeFocus(_44);
this.updateCellAccessibility(_44,false);
_44.focus();
if(this.m_oCV.m_pinFreezeManager){
var _45=this.m_oCV.m_pinFreezeManager.nodeToContainer(_44);
if(_45){
_45.updateScroll(_44);
}
}
};
ViewerA11YHelper.prototype.getPfMainOutputCell=function(_46){
var _47=null;
var _48=_46.getAttribute("pfslid");
if(_48){
var lid=PinFreezeContainer.getLidFromSlid(_48);
if(lid&&this.m_oCV.m_pinFreezeManager){
lid=this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
var _4a=this.m_oCV.m_pinFreezeManager.getContainer(lid);
if(_4a){
_47=_4a.getMain(_46);
}
}
}
return _47?_47:_46;
};
ViewerA11YHelper.prototype.getPreviousNonTextSibling=function(_4b){
while(_4b.previousSibling){
_4b=_4b.previousSibling;
if(_4b.nodeName.toLowerCase()!="#text"){
return _4b;
}
}
if(ViewerA11YHelper.isSemanticNode(_4b.parentNode)){
return this.getPreviousNonTextSibling(_4b.parentNode);
}
return null;
};
ViewerA11YHelper.prototype.getColumnIndex=function(_4c){
var _4d=0;
while(_4c.previousSibling){
_4c=_4c.previousSibling;
if(_4c.rowSpan==1){
if(_4c.colSpan){
_4d+=_4c.colSpan;
}else{
_4d++;
}
}
}
return _4d;
};
ViewerA11YHelper.prototype.getPfVisibleCell=function(_4e){
var _4f=null;
var _50=_4e.getAttribute("pfslid");
if(_50){
var lid=PinFreezeContainer.getLidFromSlid(_50);
if(lid&&this.m_oCV.m_pinFreezeManager){
lid=this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
var _52=this.m_oCV.m_pinFreezeManager.getContainer(lid);
if(_52){
_4f=_52.getCopy(_4e);
}
}
}
return _4f?_4f:_4e;
};
ViewerA11YHelper.prototype.updateCellAccessibility=function(_53,_54){
if(!_53){
return false;
}
var _55=false;
var _56=false;
var _57=false;
var _58=_53.getAttribute("ctx")!=null?_53:_53.parentNode;
if(_53.getAttribute("flashChartContainer")!="true"){
if(_58.getAttribute("ctx")!=null){
if(this.m_oCV.isBux){
var _59=this.m_oCV.getAction("DrillUpDown");
_59.updateDrillability(this.m_oCV,_58);
_55=_59.canDrillDown();
_56=_59.canDrillUp();
}else{
var _5a=_58.getAttribute("ctx");
var _5b=_5a.indexOf(":")==-1?_5a:_5a.substring(0,_5a.indexOf(":"));
var _5c=this.m_oCV.getSelectionController();
_55=_5c.canDrillDown(_5b);
_56=_5c.canDrillUp(_5b);
}
}
_57=_53.parentNode.getAttribute("dtTargets")?true:false;
}
var _5d=_53.nodeName.toLowerCase()=="img";
var _5e=_53.parentNode.getAttribute("type")=="columnTitle";
if(!_5d&&(_54||((_53.getAttribute("aria-labelledby")!=null||_5e||this.m_oCV.isAccessibleMode())))){
var _5f="";
if(_53.parentNode.getAttribute("cc")=="true"){
_5f+=" "+RV_RES.IDS_JS_CROSSTAB_CORNER;
}
if(_53.innerHTML.length===0){
_5f+=" "+RV_RES.IDS_JS_EMPTY_CELL;
}
if(_55&&_56){
_5f+=" "+RV_RES.IDS_JS_DRILL_DOWN_UP_JAWS;
}else{
if(_55){
_5f+=" "+RV_RES.IDS_JS_DRILL_DOWN_JAWS;
}else{
if(_56){
_5f+=" "+RV_RES.IDS_JS_DRILL_UP_JAWS;
}
}
}
if(_57){
_5f+=" "+RV_RES.IDS_JS_DRILL_THROUGH_JAWS;
}
if(_53.altText&&_53.altText.length>0){
_5f=_53.altText;
}else{
if(_53.getAttribute("flashChartContainer")=="true"){
_5f=RV_RES.IDS_JS_CHART_IMAGE;
}
}
if(this.m_oCV.isBux){
var _60=_53.previousSibling;
if(_60){
var wid=_60.getAttribute("widgetid");
if(wid&&wid.indexOf("comment")){
_5f+=" "+RV_RES.IDS_JS_ANNOTATION_JAWS;
}
}
if(_53.getAttribute("rp_name")||_53.parentNode.getAttribute("rp_name")){
_5f+=" "+RV_RES.IDS_JS_LABEL_HAS_BEEN_RENAMED;
}
if(_53.nextSibling&&_53.nextSibling.getAttribute("class")=="sortIconVisible"){
_5f+=" "+_53.nextSibling.getAttribute("alt");
}
}
if(_5f.length>0){
this.addAriaLabelledByOnCell(_53,_5f);
}
}
if(_56||_55||_57){
this.addDrillAccessibilityAttributes(_53,_57);
}
if(_53.attachEvent){
_53.attachEvent("onblur",this.onBlur);
}else{
_53.addEventListener("blur",this.onBlur,false);
}
if((isIE()&&_53.getAttribute("tabIndex")!=0)||_5d){
_53.setAttribute("modifiedTabIndex","true");
_53.setAttribute("oldTabIndex",_53.getAttribute("tabIndex"));
_53.setAttribute("tabIndex",0);
}
};
ViewerA11YHelper.prototype.addAriaLabelledByOnCell=function(_62,_63){
var _64=0;
var _65=_62;
while(_65.previousSibling){
_64++;
_65=_65.previousSibling;
}
var _66=_62.getAttribute("ariaHiddenSpanId");
if(_66&&document.getElementById(_66)){
document.getElementById(_66).innerHTML=_63;
}else{
if(!_62.parentNode.id&&!_62.id){
_62.parentNode.id=Math.random();
}
var _67=document.createElement("span");
_67.style.visibility="hidden";
_67.style.display="none";
_67.id=(_62.id==""?_62.parentNode.id:_62.id)+"_"+_64;
_67.innerHTML=_63;
_62.parentNode.appendChild(_67);
var _68="";
if(_62.getAttribute("aria-labelledby")!=null){
_68+=_62.getAttribute("aria-labelledby");
}else{
if(_62.id==""){
_62.id=_62.parentNode.id+"_main_"+_64;
}
_68+=_62.id;
}
_68+=" "+_67.id;
_62.setAttribute("aria-labelledby",_68);
_62.setAttribute("ariaHiddenSpanId",_67.id);
}
};
ViewerA11YHelper.prototype.addDrillAccessibilityAttributes=function(_69,_6a){
if(!_69.getAttribute("oldClassName")){
if(!_6a){
_69.setAttribute("oldClassName",_69.className);
_69.className="dl "+_69.className;
}
if(!_69.getAttribute("role")){
_69.setAttribute("role","link");
}
}
};
ViewerA11YHelper.prototype.onBlur=function(evt){
var _6c=null;
if(isIE()){
_6c=getNodeFromEvent(evt,true);
}else{
_6c=this;
}
_6c=ViewerA11YHelper.findChildOfTableCell(_6c);
if(_6c){
if(_6c.getAttribute("oldClassName")){
_6c.className=_6c.getAttribute("oldClassName");
_6c.removeAttribute("oldClassName");
}
if(_6c.getAttribute("modifiedTabIndex")=="true"){
_6c.removeAttribute("modifiedTabIndex");
_6c.removeAttribute("tabIndex");
if(_6c.getAttribute("oldTabIndex")){
_6c.setAttribute("tabIndex",_6c.getAttribute("oldTabIndex"));
}
_6c.removeAttribute("oldTabIndex");
}
var _6d=_6c.getAttribute("ariaHiddenSpanId");
if(_6d){
var _6e=document.getElementById(_6d);
if(_6e){
_6e.innerHTML="";
}
}
}
};
ViewerA11YHelper.prototype.getColSpanFromRowSpans=function(_6f){
var _70=0;
var _71=_6f.parentNode;
var _72=0;
while(_71){
var _73=_71.firstChild;
var _74=this.getColumnCount(_71)-_72;
while(_73&&_73.rowSpan>1&&_74>0&&_73!=_6f){
_70+=_73.colSpan;
_73=_73.nextSibling;
_74--;
}
if(_71.childNodes.length>_72){
_72=this.getColumnCount(_71);
}
_71=_71.previousSibling;
}
return _70;
};
ViewerA11YHelper.prototype.getColumnCount=function(_75){
var _76=0;
var _77=_75.firstChild;
while(_77){
_76+=_77.colSpan;
_77=_77.nextSibling;
}
return _76;
};
ViewerA11YHelper.prototype.addLabelledByForItemsOutsideOfContainers=function(){
if(!this.m_oCV.isAccessibleMode()){
return;
}
var _78=document.getElementById("RVContent"+this.m_oCV.getId());
if(!_78){
return;
}
var _79=getElementsByAttribute(_78,"span","tabindex","0");
if(!_79){
return;
}
for(var i=0;i<_79.length;i++){
var _7b=_79[i];
this.updateCellAccessibility(_7b,false);
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
var _7d;
try{
_7d=getCognosViewerSCObjectRef(this.getCV().getId());
}
catch(e){
_7d=null;
}
return _7d;
};
CDrillManager.prototype.getSelectedObject=function(){
var _7e=this.getSelectionController();
if(_7e==null){
return null;
}
var _7f=null;
var _80=null;
if(_7e.hasSelectedChartNodes()){
_80=_7e.getSelectedChartNodes();
}else{
_80=_7e.getSelections();
}
if(_80&&_80.length==1){
_7f=_80[0];
}
return _7f;
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
CDrillManager.prototype.hasMuns=function(_81){
if(typeof _81=="undefined"){
_81=this.getSelectedObject();
}
if(_81==null){
return false;
}
var _82=_81.getMuns();
var _83="";
for(var _84=0;_84<_82.length&&_83=="";++_84){
if(typeof _82[_84][0]!="undefined"){
_83+=_82[_84][0];
}
}
return (_83!="");
};
CDrillManager.prototype.getRefQuery=function(){
var _85="";
var _86=this.getSelectedObject();
if(_86==null){
return "";
}
var _87=_86.getRefQueries();
for(var i=0;i<_87.length;i++){
if(_87[i]!=null){
for(var j=0;j<_87[i].length;j++){
if(_87[i][j]!=null&&_87[i][j]!=""){
return _87[i][j];
}
}
}
}
return _85;
};
CDrillManager.prototype.isIsolated=function(){
var _8a=this.getSelectionController();
if(_8a==null||_8a.getDrillUpDownEnabled()==false){
return false;
}
var _8b=this.getSelectedObject();
if(_8b==null){
return false;
}
if(_8b instanceof CSelectionChartObject&&_8a!=null){
var _8c=_8b.getArea();
if(_8c!=null){
var _8d=_8c.getAttribute("isolated");
if(typeof _8d!="undefined"&&_8d!=null&&_8d=="true"){
return true;
}
}
}else{
var _8e=_8b.getCellRef();
if(typeof _8e=="object"&&_8e!=null){
var _8f=_8e.getElementsByTagName("span");
if(_8f!=null&&typeof _8f!="undefined"&&_8f.length>0){
var _90=_8f[0].getAttribute("isolated");
if(_90!=null&&_90!="undefined"&&_90=="true"){
return true;
}
}
}
}
return false;
};
CDrillManager.prototype.getDrillOption=function(_91){
var _92=this.getSelectionController();
if(_92==null||_92.getDrillUpDownEnabled()==false||typeof _91=="undefined"){
return false;
}
var _93=this.getSelectedObject();
if(_93==null){
return false;
}
if(this.isIsolated()){
if(_91=="drillDown"){
return false;
}else{
if(_91=="drillUp"){
return true;
}
}
}
if(_91=="drillDown"){
if(_93 instanceof CSelectionChartObject&&_92!=null){
var _94=_93.getArea();
if(_94!=null){
var _95=_94.getAttribute("isChartTitle");
if(typeof _95!="undefined"&&_95!=null&&_95=="true"){
return false;
}
}
}
}
var _96=_93.getDrillOptions();
var _97=(typeof DrillContextMenuHelper!=="undefined"&&DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV));
for(var idx=0;idx<_96.length;++idx){
var _99=(_97)?_96[idx].length:1;
for(var _9a=0;_9a<_99;++_9a){
var _9b=_96[idx][_9a];
if(_9b=="3"){
return true;
}else{
if(_91=="drillUp"&&_9b=="1"){
return true;
}else{
if(_91=="drillDown"&&_9b=="2"){
return true;
}
}
}
}
}
return false;
};
CDrillManager.prototype.canDrillThrough=function(){
var _9c=this.getSelectionController();
if(_9c==null||_9c.getModelDrillThroughEnabled()==false){
return false;
}
return true;
};
CDrillManager.prototype.singleClickDrillEvent=function(evt,app){
var _9f=this.getSelectionController();
if(_9f!=null){
if(this.getCV().bCanUseCognosViewerSelection==true){
_9f.pageClicked(evt);
}
}
var _a0=getCrossBrowserNode(evt);
try{
if(_a0.className&&_a0.className.indexOf("dl")==0){
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
CDrillManager.prototype.getDrillParameters=function(_a5,_a6,_a7,_a8){
var _a9=[];
var _aa=this.getSelectedObject();
if(_aa==null){
return _a9;
}
if(typeof _a6=="undefined"){
_a6=true;
}
var _ab=_aa.getDataItems();
var _ac=_aa.getMuns();
var _ad=_aa.getDimensionalItems("lun");
var _ae=_aa.getDimensionalItems("hun");
var _af=_aa.getDrillOptions();
if(typeof _ab=="undefined"||typeof _ac=="undefined"||typeof _af=="undefined"||_ac==null||_ab==null||_af==null){
return _a9;
}
if(_ac.length!=_ab.length){
return _a9;
}
var _b0=_ac.length;
for(var _b1=0;_b1<_b0;++_b1){
if(_ab[_b1].length!=0){
var _b2=(_a8)?this.findUserSelectedDrillItem(_a8,_ab[_b1]):0;
if(_b2<0){
continue;
}
if((_a7===true)||this.getDrillOption(_a5)){
if(_ac[_b1][_b2]==""||_a9.toString().indexOf(_ac[_b1][_b2],0)==-1){
_a9[_a9.length]=_ab[_b1][_b2];
_a9[_a9.length]=_ac[_b1][_b2];
if(_a6===true){
_a9[_a9.length]=_ad[_b1][_b2];
_a9[_a9.length]=_ae[_b1][_b2];
}
}
}
}
}
return _a9;
};
CDrillManager.prototype.findUserSelectedDrillItem=function(_b3,_b4){
for(var _b5=0;_b5<_b4.length;++_b5){
if(_b3==_b4[_b5]){
return _b5;
}
}
return -1;
};
CDrillManager.prototype.getModelDrillThroughContext=function(_b6){
var _b7="";
if(this.canDrillThrough()===true){
if(typeof gUseNewSelectionContext=="undefined"){
var _b8="";
if(typeof getConfigFrame!="undefined"){
_b8=decodeURIComponent(getConfigFrame().cfgGet("PackageBase"));
}else{
if(this.getCV().getModelPath()!==""){
_b8=this.getCV().getModelPath();
}
}
_b7=getViewerSelectionContext(this.getSelectionController(),new CSelectionContext(_b8));
}else{
var _b9=new CParameterValues();
var _ba=this.getSelectionController();
if(_ba){
var _bb=_ba.getAllSelectedObjects();
for(var _bc=0;_bc<_bb.length;++_bc){
var _bd=_bb[_bc];
var _be=_bd.getMuns();
var _bf=_bd.getMetadataItems();
var _c0=_bd.getUseValues();
for(var _c1=0;_c1<_bf.length;++_c1){
for(var idx=0;idx<_bf[_c1].length;++idx){
if(_bf[_c1][idx]==null||_bf[_c1][idx]==""){
continue;
}
var _c3=_bf[_c1][idx];
var _c4;
if(_be[_c1][idx]!=null&&_be[_c1][idx]!=""){
_c4=_be[_c1][idx];
}else{
_c4=_c0[_c1][idx];
}
var _c5=_c0[_c1][idx];
_b9.addSimpleParmValueItem(_c3,_c4,_c5,"true");
}
}
}
}
var _c6=_b6.XMLBuilderCreateXMLDocument("context");
_b7=_b9.generateXML(_b6,_c6);
}
}
return _b7;
};
CDrillManager.prototype.rvDrillUp=function(_c7){
this.getCV().executeAction("DrillUp",_c7);
};
CDrillManager.prototype.rvDrillDown=function(_c8){
this.getCV().executeAction("DrillDown",_c8);
};
CDrillManager.prototype.rvBuildXMLDrillParameters=function(_c9,_ca){
var _cb=this.getDrillParameters(_c9,true,false,_ca);
if(_cb.length==0){
return drillParams;
}
return this.buildDrillParametersSpecification(_cb);
};
CDrillManager.prototype.buildDrillParametersSpecification=function(_cc){
var _cd="<DrillParameters>";
var idx=0;
while(idx<_cc.length){
_cd+="<DrillGroup>";
_cd+="<DataItem>";
_cd+=sXmlEncode(_cc[idx++]);
_cd+="</DataItem>";
_cd+="<MUN>";
_cd+=sXmlEncode(_cc[idx++]);
_cd+="</MUN>";
_cd+="<LUN>";
_cd+=sXmlEncode(_cc[idx++]);
_cd+="</LUN>";
_cd+="<HUN>";
_cd+=sXmlEncode(_cc[idx++]);
_cd+="</HUN>";
_cd+="</DrillGroup>";
}
_cd+="</DrillParameters>";
return _cd;
};
CDrillManager.prototype.getAuthoredDrillsForCurrentSelection=function(){
var _cf=null;
var _d0=this.getAuthoredDrillThroughTargets();
if(_d0.length>0){
var _d1="<AuthoredDrillTargets>";
for(var _d2=0;_d2<_d0.length;++_d2){
_d1+=eval("\""+_d0[_d2]+"\"");
}
_d1+="</AuthoredDrillTargets>";
var cv=this.getCV();
var _d4=cv.getAction("AuthoredDrill");
var _d5=cv.getDrillTargets();
if(_d5.length>0){
_cf=_d4.getAuthoredDrillThroughContext(_d1,_d5);
}
}
return _cf;
};
CDrillManager.prototype.getAuthoredDrillsForGotoPage=function(){
var _d6="";
var _d7=this.getAuthoredDrillsForCurrentSelection();
if(_d7){
_d6=XMLBuilderSerializeNode(_d7);
}
return _d6;
};
CDrillManager.prototype.launchGoToPage=function(_d8,_d9){
var _da=this.getSelectionController();
if((_da!=null&&_da.getModelDrillThroughEnabled()==true)||(typeof _d8!="undefined"&&_d8!=null&&_d8!="")){
var _db=this.getAuthoredDrillsForGotoPage();
var _dc=this.getModelDrillThroughContext(self);
var _dd=document.getElementById("drillForm");
if(_dd!=null){
document.body.removeChild(_dd);
}
_dd=document.createElement("form");
var _de=this.getCVId();
var _df=document.forms["formWarpRequest"+_de];
_dd.setAttribute("id","drillForm");
_dd.setAttribute("name","drillForm");
_dd.setAttribute("target",_df.getAttribute("target"));
_dd.setAttribute("method","post");
_dd.setAttribute("action",_df.getAttribute("action"));
_dd.style.display="none";
document.body.appendChild(_dd);
if(this.getCV().getModelPath()!==""){
_dd.appendChild(createHiddenFormField("modelPath",this.getCV().getModelPath()));
}
if(typeof _df["ui.object"]!="undefined"&&_df["ui.object"].value!=""){
_dd.appendChild(createFormField("drillSource",_df["ui.object"].value));
}else{
if(typeof this.getCV().envParams["ui.spec"]!="undefined"){
_dd.appendChild(createFormField("sourceSpecification",this.getCV().envParams["ui.spec"]));
}
}
if(_db!=""){
_dd.appendChild(createHiddenFormField("m","portal/drillthrough.xts"));
_dd.appendChild(createFormField("invokeGotoPage","true"));
_dd.appendChild(createFormField("m","portal/drillthrough.xts"));
_dd.appendChild(createFormField("modelDrillEnabled",_da.getModelDrillThroughEnabled()));
if(typeof gUseNewSelectionContext=="undefined"){
_dd.appendChild(createFormField("newSelectionContext","true"));
}
}else{
if(typeof gUseNewSelectionContext=="undefined"){
_dd.appendChild(createHiddenFormField("m","portal/goto2.xts"));
}else{
_dd.appendChild(createHiddenFormField("m","portal/goto.xts"));
}
}
_dd.appendChild(createHiddenFormField("b_action","xts.run"));
_dd.appendChild(createHiddenFormField("drillTargets",_db));
if(typeof gUseNewSelectionContext=="undefined"){
_dd.appendChild(createHiddenFormField("drillContext",_dc));
}else{
_dd.appendChild(createHiddenFormField("modeledDrillthru",_dc));
}
_dd.appendChild(createHiddenFormField("errURL","javascript:window.close();"));
if(typeof _d9!="undefined"&&_d9==true){
_dd.appendChild(this.createFormField("directLaunch","true"));
}
var _e0="";
if(this.getCV().envParams["ui.routingServerGroup"]){
_e0=this.getCV().envParams["ui.routingServerGroup"];
}
_dd.appendChild(createHiddenFormField("ui.routingServerGroup",_e0));
if(this.getCV().getExecutionParameters()!=""){
_dd.appendChild(createHiddenFormField("encExecutionParameters",this.getCV().getExecutionParameters()));
}
if(_df.lang&&_df.lang.value!=""){
_dd.appendChild(createHiddenFormField("lang",_df.lang.value));
}
if(!this.getCV()||!this.getCV().launchGotoPageForIWidgetMobile(drillForm)){
if(typeof this.getCV().launchGotoPage==="function"){
this.getCV().launchGotoPage(_dd);
}else{
var _e1="winNAT_"+(new Date()).getTime();
var _e2=this.getCV().getWebContentRoot()+"/rv/blankDrillWin.html?cv.id="+_de;
window.open(_e2,_e1,"toolbar,location,status,menubar,resizable,scrollbars=1");
_dd.target=_e1;
}
}
}
};
CDrillManager.prototype.buildSearchPageXML=function(_e3,pkg,_e5,_e6,_e7,_e8,_e9){
var _ea=null;
if(typeof _e3.XMLElement=="function"){
_ea=_e3.XMLBuilderCreateXMLDocument("cognosSearch");
_e3.XMLBuilderSetAttributeNodeNS(_ea.documentElement,"xmlns:cs","http://developer.cognos.com/schemas/cs/1/");
var _eb=_ea.createElement("package");
if(typeof pkg=="string"&&pkg!==""){
_eb.appendChild(_ea.createTextNode(pkg));
}
_ea.documentElement.appendChild(_eb);
var _ec=_ea.createElement("model");
if(typeof _e5=="string"&&_e5!==""){
_ec.appendChild(_ea.createTextNode(_e5));
}
_ea.documentElement.appendChild(_ec);
var _ed=_ea.createElement("selectedContext");
_e3.XMLBuilderSetAttributeNodeNS(_ed,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
_e3.XMLBuilderSetAttributeNodeNS(_ed,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
_e3.XMLBuilderSetAttributeNodeNS(_ed,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
_e3.XMLBuilderSetAttributeNodeNS(_ed,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
_e3.XMLBuilderSetAttributeNodeNS(_ed,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_ea.documentElement.appendChild(_ed);
for(var _ee in _e6){
var _ef=_ea.createElement("item");
_e3.XMLBuilderSetAttributeNodeNS(_ef,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
var _f0=_e3.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",_ea);
_e3.XMLBuilderSetAttributeNodeNS(_f0,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_f0.appendChild(_ea.createTextNode(_e6[_ee].name));
var _f1=_e3.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",_ea);
_e3.XMLBuilderSetAttributeNodeNS(_f1,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_e3.XMLBuilderSetAttributeNodeNS(_f1,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
for(var j=0;j<_e6[_ee].values.length;j++){
var _f3=_ea.createElement("item");
_e3.XMLBuilderSetAttributeNodeNS(_f3,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
var _f4=_e3.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",_ea);
_e3.XMLBuilderSetAttributeNodeNS(_f4,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_f4.appendChild(_ea.createTextNode(_e6[_ee].values[j][0]));
var _f5=_e3.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",_ea);
_e3.XMLBuilderSetAttributeNodeNS(_f5,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
var _f6=_e6[_ee].values[j][1]==null?"":_e6[_ee].values[j][1];
_f5.appendChild(_ea.createTextNode(_f6));
_f3.appendChild(_f4);
_f3.appendChild(_f5);
_f1.appendChild(_f3);
}
_ef.appendChild(_f0);
_ef.appendChild(_f1);
_ed.appendChild(_ef);
}
var _f7=_ea.createElement("defaultMeasure");
_ea.documentElement.appendChild(_f7);
_e8.buildXML(_e3,_ea,"data");
var _f8=_ea.createElement("filter");
_ea.documentElement.appendChild(_f8);
}
return _ea;
};
CDrillManager.prototype.openSearchPage=function(_f9,_fa){
this.getModelDrillThroughContext(self);
var _fb=document.getElementById("searchPage");
if(_fb!=null){
document.body.removeChild(_fb);
}
_fb=document.createElement("form");
_fb.setAttribute("id","searchPage");
_fb.setAttribute("name","searchPage");
_fb.setAttribute("method","post");
_fb.setAttribute("target",_fb.name);
_fb.setAttribute("action",this.getCV().getGateway()+"/gosearch");
_fb.style.display="none";
document.body.appendChild(_fb);
_fb.appendChild(createHiddenFormField("csn.action","search"));
_fb.appendChild(createHiddenFormField("csn.drill",_fa));
var _fc=window.open("",_fb.name,"directories=no,location=no,status=no,toolbar=no,resizable=yes,scrollbars=yes,top=100,left=100,height=480,width=640");
_fc.focus();
_fb.submit();
};
CDrillManager.prototype.launchSearchPage=function(){
var _fd=this.getSelectionController();
var _fe=document.forms["formWarpRequest"+this.getCVId()];
var _ff=this.determineSelectionsForSearchPage(_fd);
var _100=this.getSearchContextDataSpecfication(_fd);
var _101=this.buildSearchPageXML(self,_fe.packageBase.value,this.getCV().getModelPath(),_ff,[],_100,[]);
this.openSearchPage(_fe.packageBase.value,XMLBuilderSerializeNode(_101));
};
CDrillManager.prototype.qsDrillDown=function(){
if(!this.canDrillDown()){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _102="DD:";
this.qsSendDrillCommand(_102);
};
CDrillManager.prototype.qsDrillUp=function(){
if(!this.canDrillUp()){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _103="DU:";
this.qsSendDrillCommand(_103);
};
CDrillManager.prototype.qsSendDrillCommand=function(_104){
var _105;
if(_104=="DU:"){
_105="drillUp";
}else{
_105="drillDown";
}
var _106=this.getDrillParameters(_105,false,false);
if(_106.length==0){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
for(var idx=0;idx<_106.length;++idx){
_104+=getConfigFrame().escapeParam(_106[idx]);
if(idx+1<_106.length){
_104+=",";
}
}
getConfigFrame().sendCmd(_104,"",true);
};
CDrillManager.prototype.qsLaunchGoToPage=function(_108){
var _109=this.getSelectionController();
if(_109!=null&&_109.getModelDrillThroughEnabled()==true){
var _10a=this.getModelDrillThroughContext(cf);
if(_10a==""){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _10b=document.getElementById("gotoPage");
if(_10b!=null){
document.body.removeChild(_10b);
}
_10b=document.createElement("form");
_10b.setAttribute("id","gotoPage");
_10b.setAttribute("name","gotoPage");
_10b.setAttribute("method","post");
_10b.style.display="none";
document.body.appendChild(_10b);
var _10c=getConfigFrame();
_10b.appendChild(this.createFormField("objpath",decodeURIComponent(_10c.cfgGet("PackageBase"))));
if(typeof gUseNewSelectionContext=="undefined"){
_10b.appendChild(this.createFormField("m","portal/goto2.xts"));
}else{
_10b.appendChild(this.createFormField("m","portal/goto.xts"));
}
_10b.appendChild(this.createFormField("b_action","xts.run"));
if(typeof gUseNewSelectionContext=="undefined"){
_10b.appendChild(this.createFormField("drillContext",_10a));
}else{
_10b.appendChild(this.createFormField("modeledDrillthru",_10a));
}
if(typeof getConfigFrame().routingServerGroup!="undefined"){
_10b.appendChild(this.createFormField("ui.routingServerGroup",getConfigFrame().routingServerGroup));
}
if(typeof _108!="undefined"&&_108==true){
_10b.appendChild(this.createFormField("directLaunch","true"));
}
var _10d=_10c.goApplicationManager.getReportManager().getParameterManager().getExecutionParameters();
if(_10d){
_10b.appendChild(this.createFormField("encExecutionParameters",_10d));
}
var _10e="winNAT_"+(new Date()).getTime();
var _10f=this.getCV().getWebContentRoot()+"/rv/blankDrillWin.html?cv.id="+this.getCVId();
window.open(_10f,_10e,"toolbar,location,status,menubar,resizable,scrollbars=1");
_10b.target=_10e;
}
};
CDrillManager.prototype.qsLaunchSearchPage=function(){
var cf=getConfigFrame();
var _111=goWindowManager.getSelectionController();
var _112=this.determineSelectionsForSearchPage(_111);
var _113=this.getSearchContextDataSpecfication(_111);
var _114=decodeURIComponent(cf.cfgGet("PackageBase"));
var _115=this.buildSearchPageXML(cf,_114,decodeURIComponent(cf.cfgGet("cmLastModel")),_112,[],_113,[]);
this.openSearchPage(_114,cf.XMLBuilderSerializeNode(_115));
};
CDrillManager.prototype.determineSelectionsForSearchPage=function(_116){
var _117=new CtxArrayPlaceHolder();
var _118=_116.getAllSelectedObjects();
for(var i=0;i<_118.length;i++){
var _11a=_118[i].getColumnName();
if(!this.containsByIndiceInArray(_117,_11a)){
_117[_11a]={};
_117[_11a].name=_11a;
_117[_11a].values=[];
}
var idx0="";
var muns=_118[i].getMuns();
if(muns!=null&&muns.length>0){
idx0=muns[0][0];
}
var idx1=_118[i].getDisplayValues()[0];
if(!(this.containsInArray(_117[_11a].values,0,idx0)&&this.containsInArray(_117[_11a].values,1,idx1))){
_117[_11a].values[_117[_11a].values.length]=[idx0,idx1];
}
}
return _117;
};
CDrillManager.prototype.getSearchContextDataSpecfication=function(_11e){
var _11f=new CParameterValues();
var _120=_11e.getCCDManager();
var _121=_120.m_cd;
for(var _122 in _121){
var _123=_120.GetUsage(_122);
if(_123!="2"){
var _124=_120.GetRDIValue(_122);
var _125=_120.GetDisplayValue(_122);
_11f.addSimpleParmValueItem(_124,_124,_125,"true");
}
}
return _11f;
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
CDrillManager.prototype.createFormField=function(name,_12e){
var _12f=document.createElement("input");
_12f.setAttribute("type","hidden");
_12f.setAttribute("name",name);
_12f.setAttribute("value",_12e);
return (_12f);
};
CDrillManager.prototype.getAuthoredDrillThroughTargets=function(){
var _130=[];
var _131=this.getSelectionController();
var _132=null;
if(_131!=null){
if(_131.getSelectedColumnIds().length==1){
var _133=_131.getSelections();
for(var _134=0;_134<_133.length;++_134){
var _135=_133[_134];
_132=_135.getCellRef();
while(_132){
if(_132.getAttribute("dtTargets")!=null){
_130.push("<rvDrillTargets>"+_132.getAttribute("dtTargets")+"</rvDrillTargets>");
break;
}
_132=XMLHelper_GetFirstChildElement(_132);
}
}
}else{
if(_131.hasSelectedChartNodes()){
var _136=_131.getSelectedChartNodes();
var _137=_136[0];
_132=_137.getArea();
if(_132.getAttribute("dtTargets")!=null){
_130.push("<rvDrillTargets>"+_132.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}else{
if(_131.getSelectedDrillThroughImage()!=null){
var _138=_131.getSelectedDrillThroughImage();
if(_138&&_138.getAttribute("dtTargets")!=null){
_130.push("<rvDrillTargets>"+_138.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}else{
if(_131.getSelectDrillThroughSingleton()!=null){
var _139=_131.getSelectDrillThroughSingleton();
if(_139&&_139.getAttribute("dtTargets")!=null){
_130.push("<rvDrillTargets>"+_139.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}
}
}
}
}
return _130;
};
CDrillManager.prototype.getDrillThroughParameters=function(_13a,evt){
if(typeof _13a=="undefined"){
_13a="query";
}
var _13c=[];
if(typeof evt!="undefined"){
var _13d=getCrossBrowserNode(evt,true);
try{
while(_13d){
if(typeof _13d.getAttribute!="undefined"&&_13d.getAttribute("dtTargets")){
_13c.push("<rvDrillTargets>"+_13d.getAttribute("dtTargets")+"</rvDrillTargets>");
break;
}
_13d=_13d.parentNode;
}
}
catch(e){
return false;
}
}else{
var oCV=this.getCV();
var _13f=oCV.getDrillMgr();
var _140=_13f.getSelectionController();
if(_140!=null){
var _141=null;
if(_140.hasSelectedChartNodes()){
var _142=_140.getSelectedChartNodes();
var _143=_142[0];
_141=_143.getArea();
}
if(_141!=null){
_13c.push("<rvDrillTargets>"+_141.getAttribute("dtTargets")+"</rvDrillTargets>");
}else{
_13c=this.getAuthoredDrillThroughTargets();
}
}
}
if(_13c.length>0){
var _144="<AuthoredDrillTargets>";
for(var _145=0;_145<_13c.length;++_145){
_144+=eval("\""+_13c[_145]+"\"");
}
_144+="</AuthoredDrillTargets>";
var _146=this.getCV().getAction("AuthoredDrill");
if(_13a=="query"){
_146.populateContextMenu(_144);
this.showOtherMenuItems();
}else{
if(this.getCV().envParams["cv.id"]=="AA"){
this.getCV().m_viewerFragment.raiseAuthoredDrillClickEvent();
}else{
_146.execute(_144);
}
}
return true;
}else{
if(_13a=="query"){
this.showOtherMenuItems();
return true;
}else{
return false;
}
}
};
CDrillManager.prototype.executeAuthoredDrill=function(_147){
var _148=decodeURIComponent(_147);
var _149=this.getCV().getAction("AuthoredDrill");
_149.executeDrillTarget(_148);
};
CDrillManager.prototype.doesMoreExist=function(_14a){
for(var i=0;i<_14a.getNumItems();i++){
var _14c=_14a.get(i);
if(_14c!=null){
if((_14c instanceof CMenuItem)&&(_14c.getLabel()==RV_RES.RV_MORE)&&(_14c.getAction()==this.getCVObjectRef()+".getDrillMgr().launchGoToPage();")){
return true;
}
}
}
return false;
};
CDrillManager.prototype.showOtherMenuItems=function(){
var cv=this.getCV();
var _14e=cv.rvMainWnd;
var _14f=_14e.getToolbarControl();
var _150=null;
var _151=null;
if(typeof _14f!="undefined"&&_14f!=null){
_150=_14f.getItem("goto");
if(_150){
_151=_150.getMenu();
}
}
var _152=_14e.getContextMenu();
var _153=_14e.getUIHide();
var _154=null;
if(typeof _152!="undefined"&&_152!=null&&_152.getGoToMenuItem()){
_154=_152.getGoToMenuItem().getMenu();
}
var _155=null;
var _156=this.getSelectionController();
if(_151!=null){
if(this.doesMoreExist(_151)==false){
if(typeof gMenuSeperator!="undefined"&&_151.getNumItems()>0&&(cv.bCanUseCognosViewerIndexSearch||_153.indexOf(" RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ")==-1)){
_151.add(gMenuSeperator);
}
var _157=new CMenuItem(_151,RV_RES.RV_MORE,this.getCVObjectRef()+".getDrillMgr().launchGoToPage();","",gMenuItemStyle,cv.getWebContentRoot(),cv.getSkin());
if(_153.indexOf(" RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ")!=-1){
_157.hide();
}else{
if(_156==null||_156.getModelDrillThroughEnabled()==false){
_157.disable();
}
}
}
}
if(_154!=null){
if(typeof gMenuSeperator!="undefined"&&_154.getNumItems()>0&&(cv.bCanUseCognosViewerIndexSearch||_153.indexOf(" RV_CONTEXT_MENU_GOTO_RELATED_LINKS ")==-1)){
_154.add(gMenuSeperator);
}
var _158=new CMenuItem(_154,RV_RES.RV_MORE,this.getCVObjectRef()+".getDrillMgr().launchGoToPage();","",gMenuItemStyle,cv.getWebContentRoot(),cv.getSkin());
if(_153.indexOf(" RV_CONTEXT_MENU_GOTO_RELATED_LINKS ")!=-1){
_158.hide();
}else{
if(_156==null||_156.getModelDrillThroughEnabled()==false){
_158.disable();
}
}
}
if(_155!=null&&_156!=null){
var _159=_156.getAllSelectedObjects();
if(_159==null||_159.length===0){
_155.disable();
}
}
if(_151!=null){
_151.draw();
if(_151.isVisible()){
_151.show();
}
}
if(_154!=null){
_154.draw();
if(_154.isVisible()){
_154.show();
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
var _15c=this.getSelectionController();
if(_15c!=null){
var _15d=_15c.getSelectionObjectFactory().getSelectionChartObject(node);
if(_15d!=null){
var _15e=_15d.getDrillOptions();
for(var idx=0;idx<_15e.length;++idx){
var _160=_15e[idx][0];
if((node.getAttribute("isChartTitle")==="true"&&_160=="1")||_160=="3"||_160=="2"){
node.className="dl "+node.className;
node.setAttribute("href","#");
break;
}
}
}
}
}
};
function CImageMapHighlight(map,_162){
this.m_webContentRoot=_162;
this.createHighlight=CImageMapHighlight.prototype.createHighlightElement;
this.initialize(map);
};
CImageMapHighlight.prototype.initialize=function(map){
this.m_map=map;
this.m_areas={};
this.m_areaNodes={};
this.m_visibleAreas=[];
this.initImageBlank();
this.m_divCanvas=null;
this.m_creationNode=null;
this._setMapAreasId();
this.m_sDefaultFillColour="#F7E1BC";
this.m_sDefaultStrokeColour="#F0A630";
this.m_sFillColour=this.m_sDefaultFillColour;
this.m_sStrokeColour=this.m_sDefaultStrokeColour;
};
CImageMapHighlight.prototype.setFillColour=function(_164){
this.m_sFillColour=(!_164)?this.m_sDefaultFillColour:_164;
};
CImageMapHighlight.prototype.getFillColour=function(){
return this.m_sFillColour;
};
CImageMapHighlight.prototype.setStrokeColour=function(_165){
this.m_sStrokeColour=(!_165)?this.m_sDefaultStrokeColour:_165;
};
CImageMapHighlight.prototype.getStrokeColour=function(){
return this.m_sStrokeColour;
};
CImageMapHighlight.prototype.resetColours=function(){
this.m_sStrokeColour=this.m_sDefaultStrokeColour;
this.m_sFillColour=this.m_sDefaultFillColour;
};
CImageMapHighlight.prototype.initImageBlank=function(){
var img=this._getChartImageFromMap();
if(img===null){
return;
}
this.m_img=img;
this.m_sImageHeight=img.offsetHeight+"px";
this.m_sImageWidth=img.offsetWidth+"px";
this.m_sUseMap=img.getAttribute("usemap");
this.m_imgLid=img.getAttribute("lid");
this.m_imgBlank=img.ownerDocument.createElement("IMG");
this.m_imgBlank.src=this.m_webContentRoot+"/rv/images/blank.gif";
this.m_imgBlank.style.height=this.m_sImageHeight;
this.m_imgBlank.style.width=this.m_sImageWidth;
this.m_imgBlank.style.position="absolute";
this.m_imgBlank.border="0";
this.m_imgBlank.useMap=this.m_sUseMap;
this.m_imgBlank.setAttribute("lid",this.m_imgLid);
this.m_imgBlank.setAttribute("rsvpchart",img.getAttribute("rsvpchart"));
this.m_imgBlank.alt=img.alt;
if(this.m_bShowPointer){
this.m_imgBlank.style.cursor="auto";
}
this.m_imgBlank.v_bIsBlankImageMapImg=true;
img.parentNode.insertBefore(this.m_imgBlank,img);
this.f_copyStyle(img,this.m_imgBlank);
this.m_imgBlank.style.borderColor="transparent";
};
CImageMapHighlight.prototype._getChartImageFromMap=function(){
var map=this.m_map;
var _168=null;
var _169=null;
var _16a=map.nextSibling;
while(_16a){
if(_16a.tagName=="DIV"){
var _16b=_16a.firstChild;
while(_16b){
if((_16b.tagName=="SPAN"||_16b.tagName=="DIV")&&_16b.getAttribute("chartcontainer")=="true"){
_169=_16b;
break;
}
_16b=_16b.nextSibling;
}
}
if(_169){
break;
}
_16a=_16a.nextSibling;
}
if(_169){
var _16c=_169.children;
var _16d=_16c.length;
for(var i=0;i<_16d;i++){
var el=_16c[i];
if(el.tagName=="IMG"&&el.getAttribute("rsvpchart")=="true"&&el.getAttribute("usemap")=="#"+map.name){
_168=el;
break;
}
}
}
return _168;
};
CImageMapHighlight.prototype._AREA_ID="aid";
CImageMapHighlight.prototype._setMapAreasId=function(){
var _170=this.m_map.getAttribute("lid")+"_";
var _171=this.m_map.childNodes;
var _172=_171.length;
for(var i=0;i<_172;i++){
var a=_171[i];
var id=_170+i;
a.setAttribute(this._AREA_ID,id);
this.m_areaNodes[id]=a;
}
};
CImageMapHighlight.prototype.isAreaInitialized=function(area){
return (area.getAttribute(this._AREA_ID)===null?false:true);
};
CImageMapHighlight.prototype.getAreaId=function(area){
var _178=area.getAttribute(this._AREA_ID);
if(_178===null){
this.initialize(area.parentNode);
_178=area.getAttribute(this._AREA_ID);
}
return _178+this.getFillColour();
};
CImageMapHighlight.prototype.getAreaFromId=function(_179){
return this.m_areaNodes[_179];
};
CImageMapHighlight.prototype.highlightArea=function(area,_17b){
var _17c=this.getAreaId(area);
if(!_17b){
var _17d=this.m_visibleAreas;
var _17e=_17d.length;
for(var i=0;i<_17e;i++){
if(_17c!=_17d[i]){
this.hideAreaById(_17d[i]);
}
}
this.m_visibleAreas=[];
}
this._highlightArea(area);
};
CImageMapHighlight.prototype.highlightAreas=function(_180,_181){
if(!_181){
this.hideAllAreas();
}
this._highlightAreas(_180);
};
CImageMapHighlight.prototype._highlightAreas=function(_182){
var _183=_182.length;
for(var i=0;i<_183;i++){
this._highlightArea(_182[i]);
}
};
CImageMapHighlight.prototype._highlightArea=function(area){
var _186=this.getAreaId(area);
if(!this.highlightAreaExists(_186)){
var _187=this.createHighlight(area);
if(_187){
this.m_areas[_186]=_187;
_187.style.visibility="visible";
area.setAttribute("highlighted","true");
}
}else{
if(this.m_areas[_186].style.visibility=="hidden"){
this.m_areas[_186].style.visibility="visible";
area.setAttribute("highlighted","true");
}
}
this.m_visibleAreas.push(_186);
};
CImageMapHighlight.prototype.highlightAreaExists=function(_188){
return this.m_areas[_188]?true:false;
};
CImageMapHighlight.prototype.hideAreaById=function(_189){
if(this.m_areas[_189]&&this.m_areas[_189].style.visibility){
this.m_areas[_189].style.visibility="hidden";
}
};
CImageMapHighlight.prototype.hideAreas=function(_18a){
var _18b=_18a.length;
for(var i=0;i<_18b;i++){
this.hideArea(_18a[i]);
}
};
CImageMapHighlight.prototype.hideArea=function(area){
this.hideAreaById(this.getAreaId(area));
area.setAttribute("highlighted","false");
};
CImageMapHighlight.prototype.hideAllAreas=function(){
var _18e=this.m_visibleAreas;
var _18f=_18e.length;
for(var i=0;i<_18f;i++){
this.hideAreaById(_18e[i]);
var _191=this.getAreaFromId(_18e[i]);
if(_191){
_191.setAttribute("highlighted","false");
}
}
this.m_visibleAreas=[];
};
CImageMapHighlight.prototype.isAreaHighlighted=function(area){
var _193=this.getAreaId(area);
return this.m_areas[_193]&&this.m_areas[_193].style.visibility=="visible";
};
CImageMapHighlight.prototype.removeAreaHighlights=function(_194){
};
CImageMapHighlight.prototype.removeAllAreaHighlights=function(){
};
CImageMapHighlight.prototype.destroy=function(area){
this.removeAllAreaHighlights();
};
CImageMapHighlight.prototype.createHighlightElement=function(_196,_197){
var doc=_196.ownerDocument;
if(!this.m_divCanvas){
for(var _199=this.m_img.parentNode;_199;_199=_199.parentNode){
if((_199.nodeName=="DIV")&&(_199.getAttribute("sSpecName")=="block")){
var _19a=doc.defaultView.getComputedStyle(_199,null);
var _19b=_19a.overflow;
if((_19b=="auto")||(_19b=="scroll")&&(_19a.position!="relative")){
_199.style.position="relative";
}
}
}
this.m_divCanvas=doc.createElementNS("http://www.w3.org/2000/svg","svg");
this.m_divCanvas.style.height=this.m_sImageHeight;
this.m_divCanvas.style.width=this.m_sImageWidth;
this.m_divCanvas.style.position="absolute";
this.m_img.parentNode.insertBefore(this.m_divCanvas,this.m_imgBlank);
this.f_copyStyle(this.m_imgBlank,this.m_divCanvas);
this.m_divCanvas.style.display=this.m_bHiddenCanvas?"none":"block";
}
var _19c=doc.createElementNS("http://www.w3.org/2000/svg","polyline");
var _19d=_196.getAttribute("coords");
_19c.setAttribute("points",_196.getAttribute("coords")+" "+_19d.substr(0,_19d.indexOf(",",_19d.indexOf(",")+1)));
_19c.style.position="absolute";
_19c.style.top="0px";
_19c.style.left="0px";
_19c.style.visibility="hidden";
_19c.setAttribute("stroke",_197?"#F7CB83":this.getStrokeColour());
_19c.setAttribute("stroke-width",(_196.getAttribute("type")=="legendLabel")?"1pt":"1.75pt");
_19c.setAttribute("fill",_197?"#F7E1BC":this.getFillColour());
_19c.setAttribute("fill-opacity","0.4");
this.m_divCanvas.appendChild(_19c);
return _19c;
};
CImageMapHighlight.prototype.f_copyStyle=function(_19e,_19f){
var a=["margin","marginTop","marginRight","marginBottom","marginLeft","border","borderTop","borderRight","borderBottom","borderLeft"];
var _1a1=a.length;
for(var i=0;i<_1a1;i++){
var _1a3=a[i];
var _1a4=_19e.style[_1a3];
if(_1a4){
_19f.style[_1a3]=_1a4;
}
}
};
function CSelectionXml(_1a5,_1a6,_1a7){
this.queries={};
this.burstContext=_1a5||"";
this.expressionLocale=_1a6||"";
this.contentLocale=_1a7||"";
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
var _1a9=sc.getAllSelectedObjects();
for(var s=0;s<_1a9.length;++s){
var _1ab=_1a9[s];
var _1ac=_1ab.getSelectedContextIds();
var muns=_1ab.getMuns();
var _1ae=muns.length;
var _1af=new SC_SingleSelection();
_1af.layoutElementId=_1ab.getLayoutElementId();
var _1b0=null;
for(var i=0;i<_1ae;++i){
var j,_1b3,_1b4;
if(i===0&&_1ae===1){
for(j=0;j<muns[i].length;++j){
_1b3=_1ac[i][j];
if(_1b3!=0){
if(j===0){
_1b0=sc.getRefQuery(_1b3);
_1b4=_1ab.getDisplayValues()[j];
this._buildMeasureSelection(sc,_1b3,_1af.measures,_1b4,j,_1ab.getLayoutType());
}else{
if(sc.getUsageInfo(_1b3)!=2){
this._buildEdgeSelection(sc,_1b3,_1af.cols,j);
}
}
}
}
}else{
for(j=0;j<muns[i].length;++j){
_1b3=_1ac[i][j];
if(_1b3!=0){
if(i===0){
_1b4=_1ab.getDisplayValues()[j];
_1b0=sc.getRefQuery(_1b3);
this._buildMeasureSelection(sc,_1b3,_1af.measures,_1b4,j,_1ab.getLayoutType());
}else{
if(i===1){
this._buildEdgeSelection(sc,_1b3,_1af.rows,j);
}else{
if(i===2){
this._buildEdgeSelection(sc,_1b3,_1af.cols,j);
}else{
this._buildSectionSelection(sc,_1b3,_1af.sections,j);
}
}
}
}
}
}
}
this.AddSelection(_1b0,_1af);
}
}
};
CSelectionXml.prototype.AddSelection=function(_1b5,_1b6){
if(!this.queries[_1b5]){
this.queries[_1b5]=new SC_SingleQuery();
}
this.queries[_1b5].selections.push(_1b6);
};
CSelectionXml.prototype._buildMeasureSelection=function(sc,_1b8,_1b9,_1ba,idx,_1bc){
if(_1bc==""||_1bc==null){
_1bc="datavalue";
}
if(_1b8){
_1b9.push({name:sc.getRefDataItem(_1b8),values:[{use:sc.getUseValue(_1b8),display:_1ba}],order:idx,hun:sc.getHun(_1b8),dataType:_1bc,usage:sc.getUsageInfo(_1b8),dtype:sc.getDataType(_1b8),selection:"true"});
}
};
CSelectionXml.prototype._buildEdgeSelection=function(sc,_1be,_1bf,idx){
if(_1be){
_1bf.push({name:sc.getRefDataItem(_1be),values:[{use:this.getUseValue(sc,_1be),display:sc.getDisplayValue(_1be)}],order:idx,lun:sc.getLun(_1be),hun:sc.getHun(_1be),dataType:"columnTitle",usage:sc.getUsageInfo(_1be),dtype:sc.getDataType(_1be)});
}
};
CSelectionXml.prototype._buildSectionSelection=function(sc,_1c2,_1c3,idx){
if(_1c2){
_1c3.push({name:sc.getRefDataItem(_1c2),values:[{use:this.getUseValue(sc,_1c2),display:sc.getDisplayValue(_1c2)}],order:idx,lun:sc.getLun(_1c2),hun:sc.getHun(_1c2),dataType:"section",usage:sc.getUsageInfo(_1c2),dtype:sc.getDataType(_1c2),queryRef:sc.getRefQuery(_1c2)});
}
};
CSelectionXml.prototype.getUseValue=function(sc,_1c6){
var _1c7=sc.getMun(_1c6);
if(_1c7==""){
_1c7=sc.getUseValue(_1c6);
}
return _1c7;
};
CSelectionXml.prototype.toXml=function(){
var _1c8=XMLBuilderCreateXMLDocument("selections");
var _1c9=_1c8.documentElement;
XMLBuilderSetAttributeNodeNS(_1c9,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
XMLBuilderSetAttributeNodeNS(_1c9,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
XMLBuilderSetAttributeNodeNS(_1c9,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
XMLBuilderSetAttributeNodeNS(_1c9,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
XMLBuilderSetAttributeNodeNS(_1c9,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_1c9.setAttribute("contentLocale",this.contentLocale);
_1c9.setAttribute("expressionLocale",this.expressionLocale);
for(var q in this.queries){
this._queryToXml(_1c9,q,this.queries[q]);
}
this._burstToXml(_1c9);
return XMLBuilderSerializeNode(_1c8);
};
CSelectionXml.prototype._queryToXml=function(_1cb,name,obj){
var _1ce=_1cb.ownerDocument.createElement("query");
_1ce.setAttribute("name",name);
for(var _1cf=0;_1cf<obj.selections.length;++_1cf){
this._selectionToXml(_1ce,obj.selections[_1cf]);
}
for(var _1d0=0;_1d0<obj.slicers.length;++_1d0){
this._slicersToXml(_1ce,obj.slicers[_1d0]);
}
for(var _1d1=0;_1d1<obj.selections.length;++_1d1){
this._filtersToXml(_1ce,obj.selections[_1d1]);
}
_1cb.appendChild(_1ce);
};
CSelectionXml.prototype._selectionToXml=function(_1d2,_1d3){
var doc=_1d2.ownerDocument;
var _1d5=doc.createElement("selection");
_1d2.appendChild(_1d5);
this._edgeToXml(_1d5,"row",_1d3.rows);
this._edgeToXml(_1d5,"column",_1d3.cols);
this._edgeToXml(_1d5,"measure",_1d3.measures);
this._edgeToXml(_1d5,"section",_1d3.sections);
var _1d6=doc.createElement("layoutElementId");
_1d6.appendChild(doc.createTextNode(_1d3.layoutElementId));
_1d5.appendChild(_1d6);
};
CSelectionXml.prototype._edgeToXml=function(_1d7,_1d8,_1d9){
var doc=_1d7.ownerDocument;
var _1db=doc.createElement(_1d8+"s");
_1d7.appendChild(_1db);
for(var i=0;i<_1d9.length;++i){
var _1dd=doc.createElement(_1d8);
_1db.appendChild(_1dd);
var edge=_1d9[i];
for(var j in edge){
if(j!=="name"&&j!=="values"){
_1dd.setAttribute(j,edge[j]!==null?edge[j]:"");
}
}
this._itemToXml(_1dd,edge.name,edge.values);
}
};
CSelectionXml.prototype._itemToXml=function(_1e0,name,_1e2){
var doc=_1e0.ownerDocument;
var _1e4=doc.createElement("item");
XMLBuilderSetAttributeNodeNS(_1e4,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
var _1e5=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",doc);
XMLBuilderSetAttributeNodeNS(_1e5,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_1e5.appendChild(doc.createTextNode(name));
_1e4.appendChild(_1e5);
var _1e6=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",doc);
XMLBuilderSetAttributeNodeNS(_1e6,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
XMLBuilderSetAttributeNodeNS(_1e6,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
_1e4.appendChild(_1e6);
for(var j=0;j<_1e2.length;j++){
var _1e8=doc.createElement("item");
XMLBuilderSetAttributeNodeNS(_1e8,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
var _1e9=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",doc);
XMLBuilderSetAttributeNodeNS(_1e9,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
if(_1e2[j].use){
_1e9.appendChild(doc.createTextNode(_1e2[j].use));
}else{
if(_1e2[j].display){
_1e9.appendChild(doc.createTextNode(_1e2[j].display));
}else{
_1e9.appendChild(doc.createTextNode(""));
}
}
var _1ea=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",doc);
XMLBuilderSetAttributeNodeNS(_1ea,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
if(_1e2[j].display){
_1ea.appendChild(doc.createTextNode(_1e2[j].display));
}else{
_1ea.appendChild(doc.createTextNode(""));
}
_1e8.appendChild(_1e9);
_1e8.appendChild(_1ea);
_1e6.appendChild(_1e8);
}
_1e0.appendChild(_1e4);
};
CSelectionXml.prototype._burstToXml=function(_1eb){
var doc=_1eb.ownerDocument;
var _1ed=doc.createElement("burst-context");
_1ed.appendChild(doc.createTextNode(this.burstContext));
_1eb.appendChild(_1ed);
};
CSelectionXml.prototype._slicersToXml=function(_1ee,_1ef){
};
CSelectionXml.prototype._filtersToXml=function(_1f0,_1f1){
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
CSubscriptionManager.prototype.Initialize=function(_1f3){
try{
var _1f4=_1f3.getJSONResponseObject();
var _1f5=document.forms["formWarpRequest"+this.m_cv.getId()];
if(_1f4["annotationInfo"]){
var _1f6=_1f4["annotationInfo"];
this.m_AnnotationsCount=_1f6.annotations.length;
this.m_annotations=_1f6.annotations;
this.m_bAllowAnnotations=_1f6.allowAnnotations;
this.m_bCanCreateAnnotations=_1f6.traverse=="true";
return true;
}
if(_1f4["subscriptionInfo"]){
var _1f7=_1f4["subscriptionInfo"];
if(!this.m_bInitialized){
this.m_sEmail=_1f7.sEmail;
this.m_bAllowNotification=_1f7.bAllowNotification;
this.m_bAllowSubscription=_1f7.bAllowSubscription;
this.m_sAlertNewVersionConfirm=_1f7.sAlertNewVersionConfirm;
if(_1f5["ui.action"]&&_1f5["ui.action"].value=="view"){
if(_1f5["ui.format"]){
this.m_bCanCreateNewWatchRule=(_1f5["ui.format"].value=="HTML")&&this.m_cv.bCanUseCognosViewerConditionalSubscriptions&&this.m_bAllowSubscription;
}
this.m_bCanGetNotified=(!_1f5["ui.burstKey"]||(_1f5["ui.burstKey"]&&_1f5["ui.burstKey"].value==""))&&this.m_bAllowNotification;
}
}
if(_1f7.sQueryNotificationResponse){
this.m_sQueryNotificationResponse=_1f7.sQueryNotificationResponse;
}
if(_1f7.aWatchRules){
var _1f8=_1f7.aWatchRules;
this.m_aWatchRules=[];
for(var i=0;i<_1f8.length;i++){
this.m_aWatchRules.push(_1f8[i]);
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
var _1fa=this.m_cv.getSelectionController();
if(_1fa&&!_1fa.hasSelectedChartNodes()){
var _1fb=_1fa.getAllSelectedObjects();
if(_1fb.length===1){
if(_1fb[0]!=null&&_1fb[0].getLayoutType()!="columnTitle"){
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
var _1fd=new JSONDispatcherEntry(oCV);
_1fd.setKey("subscriptionManager");
_1fd.forceSynchronous();
_1fd.addFormField("ui.action","getSubscriptionInfo");
_1fd.addFormField("cv.responseFormat","subscriptionManager");
_1fd.addFormField("contextMenu","true");
this.addCommonFormFields(_1fd);
_1fd.setCallbacks({"complete":{"object":this,"method":this.Initialize}});
oCV.dispatchRequest(_1fd);
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
var _1fe=this.getStandaloneViewerToolbarControl();
var _1ff=_1fe?_1fe.getItem("watchNewVersions"):null;
var _200=this.m_cv.getWebContentRoot();
var _201=this.m_cv.getSkin();
if(_1ff){
var _202=_1ff.getMenu();
this.ClearSubscriptionMenu();
var _203=false;
if(this.CanGetNotified()){
if(this.m_sQueryNotificationResponse=="on"){
new CMenuItem(_202,RV_RES.RV_DO_NOT_ALERT_NEW_VERSION,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().DeleteNotification();",_200+"/rv/images/action_remove_from_list.gif",gMenuItemStyle,_200,_201);
_203=true;
}else{
if(this.m_sQueryNotificationResponse=="off"&&this.m_sEmail!=""){
new CMenuItem(_202,RV_RES.RV_ALERT_NEW_VERSION,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().AddNotification();",_200+"/rv/images/action_add_to_list.gif",gMenuItemStyle,_200,_201);
_203=true;
}
}
}
if(this.CanCreateNewWatchRule()){
if(_203){
_202.add(gMenuSeperator);
}
var _204=new CMenuItem(_202,RV_RES.RV_NEW_WATCH_RULE,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().NewSubscription();",_200+"/rv/images/action_new_subscription.gif",gMenuItemStyle,_200,_201);
if(!this.IsValidSelectionForNewRule()){
_204.disable();
}
_203=true;
}
var _205="";
if(typeof this.m_cv.UIBlacklist!="undefined"){
_205=this.m_cv.UIBlacklist;
}
var _206;
if(_205.indexOf(" RV_TOOLBAR_BUTTONS_RULES ")==-1){
if(_203){
_202.add(gMenuSeperator);
}
if(this.m_aWatchRules&&this.m_aWatchRules.length>0){
var _207=this.CanModifyWatchRule();
for(var sub=0;sub<this.m_aWatchRules.length;++sub){
var menu=new CMenuItem(_202,this.m_aWatchRules[sub].name,"",_200+"/rv/images/icon_subscription.gif",gMenuItemStyle,_200,_201);
var _20a=menu.createCascadedMenu(gMenuStyle);
_20a.m_oCV=this.m_cv;
if(_207&&_205.indexOf(" RV_TOOLBAR_BUTTONS_RULES_MODIFY ")==-1){
new CMenuItem(_20a,RV_RES.RV_MODIFY_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().ModifySubscription("+sub+");",_200+"/rv/images/action_edit.gif",gMenuItemStyle,_200,_201);
}
if(_205.indexOf(" RV_TOOLBAR_BUTTONS_RULES_DELETE ")==-1){
new CMenuItem(_20a,RV_RES.RV_DELETE_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().DeleteSubscription("+sub+");",_200+"/rv/images/action_delete.gif",gMenuItemStyle,_200,_201);
}
}
}else{
_206=new CMenuItem(_202,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_200,_201);
_206.disable();
}
}
if(_202.getNumItems()==0){
_206=new CMenuItem(_202,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_200,_201);
_206.disable();
}
_202.setForceCallback(false);
_202.draw();
if(_202.isVisible()){
_202.show();
}
_202.setForceCallback(true);
}
};
CSubscriptionManager.prototype.UpdateAnnotationMenu=function(){
var _20b=this.getStandaloneViewerToolbarControl();
var _20c=_20b?_20b.getItem("addAnnotations"):null;
var _20d=this.m_cv.getWebContentRoot();
var _20e=this.m_cv.getSkin();
var _20f=_20c.getMenu();
this.ClearAnnotationMenu();
var menu=new CMenuItem(_20f,RV_RES.RV_NEW_COMMENT,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().NewAnnotation();",_20d+"/rv/images/action_comment_add.gif",gMenuItemStyle,_20d,_20e);
var _211=this.m_annotations.length;
if(_211>0){
_20f.add(gMenuSeperator);
}
if(!this.m_bAllowAnnotations||!this.m_bCanCreateAnnotations){
menu.disable();
}
var _212;
var bidi=isViewerBidiEnabled()?BidiUtils.getInstance():null;
for(var i=0;i<_211;i++){
var _215=this.m_annotations[i].defaultName;
_212=_215.length>60?_215.substring(0,60)+"...":_215;
if(isViewerBidiEnabled()){
_212=bidi.btdInjectUCCIntoStr(_212,getViewerBaseTextDirection());
}
var _216=Boolean(this.m_annotations[i].permissions.read);
var _217=Boolean(this.m_annotations[i].permissions.write);
var _218=Boolean(this.m_annotations[i].permissions.traverse)&&Boolean(this.m_annotations[i].permissions.write);
var _219="javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().ViewAnnotation("+i+");";
var _21a="javascript:alert('Permission denied')";
_219=_216?_219:_21a;
if(i>0&&this.m_annotations[i].layoutElementId!=this.m_annotations[i-1].layoutElementId){
_20f.add(gMenuSeperator);
}
var _21b="/rv/images/action_comment.gif";
if(this.m_annotations[i].layoutElementId!=""){
_21b="/rv/images/action_subscribe.gif";
}
menu=new CMenuItem(_20f,_212,_219,_20d+_21b,gMenuItemStyle,_20d,_20e);
var _21c=menu.createCascadedMenu(gMenuStyle);
var _21d=new CInfoPanel("300px",_20d,_21c.getId()+"_comments");
_21d.setParent(_21c);
_215=this.m_annotations[i].defaultName;
var _21e=_215.length>60?_215.substring(0,60)+"...":_215;
if(isViewerBidiEnabled()){
_21e=bidi.btdInjectUCCIntoStr(_21e,getViewerBaseTextDirection());
}
_21d.addProperty(RV_RES.RV_VIEW_COMMENT_NAME,html_encode(_21e));
_21d.addSpacer(4);
var cmnt=this.m_annotations[i].description;
var _220=cmnt.length>590?cmnt.substring(0,590)+"...":cmnt;
if(isViewerBidiEnabled()){
_220=bidi.btdInjectUCCIntoStr(_220,getViewerBaseTextDirection());
}
_21d.addProperty(RV_RES.RV_VIEW_COMMENT_CONTENTS,replaceNewLine(html_encode(_220)));
_21d.addSpacer(4);
var _221=this.m_annotations[i].modificationTime;
if(isViewerBidiEnabled()){
_221=bidi.btdInjectUCCIntoStr(_221,getViewerBaseTextDirection());
}
_21d.addProperty(RV_RES.RV_VIEW_COMMENT_MODTIME,_221);
var _222=this.m_annotations[i].owner.defaultName;
if(isViewerBidiEnabled()){
_222=bidi.btdInjectUCCIntoStr(_222,getViewerBaseTextDirection());
}
_21d.addProperty(RV_RES.RV_VIEW_COMMENT_OWNER,_222);
_21c.add(_21d);
if(_217||_218){
_21c.add(gMenuSeperator);
}
new CMenuItem(_21c,RV_RES.RV_VIEW_COMMENT,this.m_cv.getObjectId()+".getSubscriptionManager().ViewAnnotation("+i+");",_20d+"/rv/images/action_comment_view.gif",gMenuItemStyle,_20d,_20e);
if(_217){
new CMenuItem(_21c,RV_RES.RV_MODIFY_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().ModifyAnnotation("+i+");",_20d+"/rv/images/action_comment_modify.gif",gMenuItemStyle,_20d,_20e);
}
if(_218){
new CMenuItem(_21c,RV_RES.RV_DELETE_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().DeleteAnnotation("+i+");",_20d+"/rv/images/action_comment_delete.gif",gMenuItemStyle,_20d,_20e);
}
}
_20f.setForceCallback(false);
_20f.draw();
if(_20f.isVisible()){
_20f.show();
}
_20f.setForceCallback(true);
};
CSubscriptionManager.prototype.AddNotification=function(){
alert(this.m_sAlertNewVersionConfirm);
var oCV=this.getViewer();
var _224=new DataDispatcherEntry(oCV);
_224.setKey("subscriptionManager");
_224.addFormField("ui.action","addNotification");
_224.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_224);
oCV.dispatchRequest(_224);
};
CSubscriptionManager.prototype.DeleteNotification=function(){
alert(RV_RES.RV_DO_NOT_ALERT_NEW_VERSION_CONFIRM);
var oCV=this.getViewer();
var _226=new DataDispatcherEntry(oCV);
_226.setKey("subscriptionManager");
_226.addFormField("ui.action","deleteNotification");
_226.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_226);
oCV.dispatchRequest(_226);
};
CSubscriptionManager.prototype.NewAnnotation=function(){
var oFWR=document.forms["formWarpRequest"+this.m_cv.getId()];
var _228=oFWR["ui.object"].value;
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_228);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
GUtil.createFormField(form,"action_hint","create");
var _22a=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_22a,form.target,this.m_windowOptions);
};
CSubscriptionManager.prototype.ViewAnnotation=function(idx){
var sub=this.m_annotations[idx];
var _22d=sub.searchPath;
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_22d);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
var _22f=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_22f,form.target,this.m_windowOptions);
};
CSubscriptionManager.prototype.ModifyAnnotation=function(idx){
var sub=this.m_annotations[idx];
var _232=this.m_annotations[idx].searchPath;
if(sub&&_232){
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_232);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
GUtil.createFormField(form,"action_hint","save");
var _234=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_234,form.target,this.m_windowOptions);
}
};
CSubscriptionManager.prototype.DeleteAnnotation=function(idx){
var sub=this.m_annotations[idx];
if(sub&&sub.searchPath&&confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE)){
var oCV=this.getViewer();
var _238=new DataDispatcherEntry(oCV);
_238.setKey("subscriptionManager");
_238.addFormField("ui.action","deleteAnnotation");
_238.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_238,sub.searchPath);
oCV.dispatchRequest(_238);
}
};
CSubscriptionManager.prototype.NewSubscription=function(){
var sc=this.m_cv.getSelectionController();
var oFWR=document.forms["formWarpRequest"+this.m_cv.getId()];
var _23b=oFWR.reRunObj.value;
if(_23b&&sc&&sc.getAllSelectedObjects().length===1){
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
var fWR=document.getElementById("formWarpRequest"+this.m_cv.getId());
var _23e=new CSelectionXml(fWR["ui.burstID"].value,fWR["ui.contentLocale"].value,fWR["ui.outputLocale"].value);
_23e.BuildSelectionFromController(sc);
GUtil.createFormField(form,"rv.selectionSpecXML",_23e.toXml());
GUtil.createFormField(form,"rv.periodicalProducer",_23b);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","subscribe/conditional_subscribe1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
var _23f=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_23f,form.target,"toolbar,location,status,menubar,resizable,scrollbars=1");
}else{
}
};
CSubscriptionManager.prototype.DeleteSubscription=function(idx){
var sub=this.m_aWatchRules[idx];
if(sub&&sub.searchPath&&confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE)){
var oCV=this.getViewer();
var _243=new DataDispatcherEntry(oCV);
_243.setKey("subscriptionManager");
_243.addFormField("ui.action","deleteSubscription");
_243.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_243,sub.searchPath);
oCV.dispatchRequest(_243);
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
var _247=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_247,form.target,"toolbar,location,status,menubar,resizable,scrollbars=1");
}
};
CSubscriptionManager.prototype.OpenSubscriptionMenu=function(){
var oCV=this.getViewer();
var _249=new JSONDispatcherEntry(oCV);
_249.setKey("subscriptionManager");
_249.addFormField("ui.action","getSubscriptionInfo");
_249.addFormField("cv.responseFormat","subscriptionManager");
this.addCommonFormFields(_249);
_249.setCallbacks({"complete":{"object":this,"method":this.OpenSubscriptionMenuResponse}});
oCV.dispatchRequest(_249);
};
CSubscriptionManager.prototype.OpenAnnotationMenu=function(){
var oCV=this.getViewer();
var _24b=new JSONDispatcherEntry(oCV);
_24b.setKey("subscriptionManager");
_24b.addFormField("ui.action","getAnnotationInfo");
_24b.addFormField("cv.responseFormat","getAnnotations");
var _24c=oCV.envParams["ui.object"];
this.addCommonFormFields(_24b,_24c?_24c:"");
_24b.setCallbacks({"complete":{"object":this,"method":this.OpenAnnotationMenuResponse}});
oCV.dispatchRequest(_24b);
};
CSubscriptionManager.prototype.OpenAnnotationMenuResponse=function(_24d){
if(this.Initialize(_24d)){
this.UpdateAnnotationMenu();
}else{
this.ClearAnnotationMenu();
}
};
CSubscriptionManager.prototype.OpenSubscriptionMenuResponse=function(_24e){
if(this.Initialize(_24e)){
this.UpdateSubscribeMenu();
}else{
this.AddEmptySubscriptionMenuItem();
}
};
CSubscriptionManager.prototype.addCommonFormFields=function(_24f,_250){
if(_250&&_250!=""){
_24f.addFormField("ui.object",_250);
}else{
var _251=document["formWarpRequest"+this.getViewer().getId()];
if(_251&&_251["reRunObj"]){
_24f.addFormField("ui.object",_251["reRunObj"].value);
}
}
if(_24f.getFormField("ui.action")=="getSubscriptionInfo"){
_24f.addFormField("initialized",this.m_bInitialized?"true":"false");
}
_24f.addFormField("cv.id",this.getViewer().getId());
};
CSubscriptionManager.prototype.AddEmptySubscriptionMenuItem=function(){
var _252=this.getStandaloneViewerToolbarControl();
if(_252){
var _253=_252.getItem("watchNewVersions");
if(_253){
_253.getMenu().clear();
}
var _254=this.m_cv.getWebContentRoot();
var _255=this.m_cv.getSkin();
var _256=_253.getMenu();
var _257=new CMenuItem(_256,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_254,_255);
_257.disable();
_256.setForceCallback(false);
_256.draw();
if(_256.isVisible()){
_256.show();
}
_256.setForceCallback(true);
}
};
CSubscriptionManager.prototype.ClearSubscriptionMenu=function(){
var _258=this.getStandaloneViewerToolbarControl();
if(_258){
var _259=_258.getItem("watchNewVersions");
if(_259){
_259.getMenu().clear();
}
}
};
CSubscriptionManager.prototype.ClearAnnotationMenu=function(){
var _25a=this.getStandaloneViewerToolbarControl();
if(_25a){
var _25b=_25a.getItem("addAnnotations");
if(_25b){
_25b.getMenu().clear();
}
}
};
CSubscriptionManager.prototype.ClearContextAnnotationMenu=function(){
var _25c=this.getStandaloneViewerContextMenu();
if(_25c){
var _25d=_25c.getFindCommentMenuItem();
if(_25d){
_25d.getMenu().clear();
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
CSelectionMetadata.prototype.setContextId=function(_25e){
this.m_sContextId=_25e;
};
CSelectionMetadata.prototype.getContextId=function(){
return this.m_sContextId;
};
CSelectionMetadata.prototype.setRefQuery=function(_25f){
this.m_refQuery=_25f;
};
CSelectionMetadata.prototype.getRefQuery=function(){
return this.m_refQuery;
};
CSelectionMetadata.prototype.setDataItem=function(_260){
this.m_sDataItem=_260;
};
CSelectionMetadata.prototype.getDataItem=function(){
return this.m_sDataItem;
};
CSelectionMetadata.prototype.setMetadataModelItem=function(_261){
this.m_sMetadataModelItem=_261;
};
CSelectionMetadata.prototype.getMetadataModelItem=function(){
return this.m_sMetadataModelItem;
};
CSelectionMetadata.prototype.setUseValue=function(_262){
this.m_sUseValue=_262;
};
CSelectionMetadata.prototype.getUseValue=function(){
return this.m_sUseValue;
};
CSelectionMetadata.prototype.setUseValueType=function(_263){
this.m_sUseValueType=_263;
};
CSelectionMetadata.prototype.setType=function(_264){
this.m_sType=_264;
};
CSelectionMetadata.prototype.getType=function(){
var _265=null;
switch(this.m_sUseValueType){
case 25:
case 27:
case 30:
case 32:
_265="memberUniqueName";
break;
case 26:
_265="memberCaption";
break;
case 1:
case 55:
case 56:
_265="string";
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
_265=parseInt(this.m_sUseValueType,10);
break;
}
return _265;
};
CSelectionMetadata.prototype.getUseValueType=function(){
if(this.m_sType==null){
this.m_sType=this.getType();
}
return this.m_sType;
};
CSelectionMetadata.prototype.setDisplayValue=function(_266){
this.m_sDisplayValue=_266;
};
CSelectionMetadata.prototype.getDisplayValue=function(){
return this.m_sDisplayValue;
};
CSelectionMetadata.prototype.setUsage=function(_267){
this.m_sUsage=_267;
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
function CSelectionMetadataIterator(_26a,_26b){
this.m_axisIndex=_26b;
this.m_index=0;
this.m_selectionObject=_26a;
};
CSelectionMetadataIterator.prototype.getSelectionAxis=function(){
var _26c=null;
if(typeof this.m_selectionObject=="object"&&this.m_axisIndex<this.m_selectionObject.getSelectedContextIds().length){
_26c=this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex];
}
return _26c;
};
CSelectionMetadataIterator.prototype.hasNext=function(){
var _26d=this.getSelectionAxis();
if(_26d!=null){
return (this.m_index<_26d.length);
}else{
return false;
}
};
CSelectionMetadataIterator.prototype.next=function(){
var _26e=null;
if(this.hasNext()){
_26e=new CSelectionMetadata();
_26e.setContextId(this.m_selectionObject.m_contextIds[this.m_axisIndex][this.m_index]);
_26e.setDataItem(this.m_selectionObject.getDataItems()[this.m_axisIndex][this.m_index]);
_26e.setMetadataModelItem(this.m_selectionObject.getMetadataItems()[this.m_axisIndex][this.m_index]);
if(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]!=null&&this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]!=""){
_26e.setUseValue(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]);
_26e.setType("memberUniqueName");
}else{
_26e.setUseValue(this.m_selectionObject.getUseValues()[this.m_axisIndex][this.m_index]);
}
if(typeof this.m_selectionObject.m_selectionController=="object"){
var _26f=this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex][this.m_index];
if(this.m_selectionObject.useDisplayValueFromObject){
_26e.setDisplayValue(this.m_selectionObject.getDisplayValues()[this.m_axisIndex]);
}else{
var _270=null;
var _271=null;
if(this.m_axisIndex===0){
var _272=this.m_selectionObject.getCellRef();
if(_272&&_272.nodeName&&_272.nodeName.toLowerCase()==="td"){
_271=this.m_selectionObject.m_selectionController.getDisplayValueFromDOM(_26f,_272.parentNode);
}
}
if(_271==null){
_271=this.m_selectionObject.m_selectionController.getDisplayValue(_26f);
}
if(_271===""){
_271=this.m_selectionObject.m_selectionController.getUseValue(_26f);
}
_26e.setDisplayValue(_271);
}
_26e.setUseValueType(this.m_selectionObject.m_selectionController.getDataType(_26f));
_26e.setUsage(this.m_selectionObject.m_selectionController.getUsageInfo(_26f));
_26e.setRefQuery(this.m_selectionObject.m_selectionController.getRefQuery(_26f));
_26e.setHun(this.m_selectionObject.m_selectionController.getHun(_26f));
_26e.setDun(this.m_selectionObject.m_selectionController.getDun(_26f));
}
++this.m_index;
}
return _26e;
};
function CAxisSelectionIterator(_273){
this.m_index=0;
this.m_selectionObject=_273;
};
CAxisSelectionIterator.prototype.hasNext=function(){
return ((typeof this.m_selectionObject=="object")&&(this.m_index<this.m_selectionObject.getSelectedContextIds().length));
};
CAxisSelectionIterator.prototype.next=function(){
var _274=null;
if(this.hasNext()){
_274=new CSelectionMetadataIterator(this.m_selectionObject,this.m_index);
++this.m_index;
}
return _274;
};
function getSelectionContextIds(_275){
var _276=[];
var _277=_275.getAllSelectedObjects();
if(_277!=null&&_277.length>0){
for(var _278=0;_278<_277.length;++_278){
var _279=_277[_278];
var _27a=_279.getSelectedContextIds();
var _27b=[];
for(var item=0;item<_27a.length;++item){
var _27d=_27a[item].join(":");
_27b.push(_27d);
}
_276.push(_27b.join("::"));
}
}
return _276;
};
function getViewerSelectionContext(_27e,_27f,_280){
var _281=_280==true?_27e.getAllSelectedObjectsWithUniqueCTXIDs():_27e.getAllSelectedObjects();
if(_281!=null&&_281.length>0){
for(var _282=0;_282<_281.length;++_282){
var _283={};
var _284=new CAxisSelectionIterator(_281[_282]);
if(_284.hasNext()){
var _285=_284.next();
if(_285.hasNext()){
var _286=_285.next();
var _287=_286.getContextId();
_283[_287]=true;
var _288=_27f.addSelectedCell(_286.getDataItem(),_286.getMetadataModelItem(),_286.getUseValue(),_286.getUseValueType(),_286.getDisplayValue(),_286.getUsage(),{"queryName":_286.getRefQuery()});
if(_286.getHun()!=null){
_288.addProperty("HierarchyUniqueName",_286.getHun());
}
if(_286.getDun()!=null){
_288.addProperty("DimensionUniqueName",_286.getDun());
}
while(_285.hasNext()){
_286=_285.next();
_287=_286.getContextId();
if(typeof _283[_287]=="undefined"||_287===""){
_283[_287]=true;
var _289=_288.addDefiningCell(_286.getDataItem(),_286.getMetadataModelItem(),_286.getUseValue(),_286.getUseValueType(),_286.getDisplayValue(),_286.getUsage(),{"queryName":_286.getRefQuery()});
if(_286.getHun()!=null){
_289.addProperty("HierarchyUniqueName",_286.getHun());
}
if(_286.getDun()!=null){
_289.addProperty("DimensionUniqueName",_286.getDun());
}
}
}
while(_284.hasNext()){
_285=_284.next();
var _28a=_288;
while(_285.hasNext()){
_286=_285.next();
_287=_286.getContextId();
if(typeof _283[_287]=="undefined"||_287===""){
_283[_287]=true;
_28a=_28a.addDefiningCell(_286.getDataItem(),_286.getMetadataModelItem(),_286.getUseValue(),_286.getUseValueType(),_286.getDisplayValue(),_286.getUsage(),{"queryName":_286.getRefQuery()});
if(_286.getHun()!=null){
_28a.addProperty("HierarchyUniqueName",_286.getHun());
}
if(_286.getDun()!=null){
_28a.addProperty("DimensionUniqueName",_286.getDun());
}
}
}
}
}
}
}
}
var _28b=_27f.toString();
if(window.gViewerLogger){
window.gViewerLogger.log("Selection context",_28b,"xml");
}
return _28b;
};
dojo.provide("bux.dialogs.CalculationDialog");
dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");
dojo.declare("viewer.dialogs.CalculationDialog",bux.dialogs.BaseCustomContentDialog,{sTitle:null,sLabel:null,sDescription:null,sContentLocale:null,okHandler:null,cancelHandler:null,startup:function(){
this.updateTitle(this.sTitle);
this.inherited(arguments);
var _28c=new bux.layout.TableContainer({classname:"bux-InformationDialog"},this.contentContainer);
var cell=null,row=null;
if(this.sDescription){
row=new bux.layout.TableContainerRow({parentContainer:_28c});
cell=new bux.layout.TableContainerCell({classname:"bux-dialog-info",parentContainer:row});
cell.addContent(document.createTextNode(this.sDescription));
dijit.setWaiState(this._buxBaseDialog.domNode,"describedBy",cell.id);
}
row=new bux.layout.TableContainerRow({parentContainer:_28c});
cell=new bux.layout.TableContainerCell({classname:"bux-dialog-label",parentContainer:row});
this._calculationField=new dijit.form.NumberTextBox({required:true,onBlur:function(){
if(!this._cancelled&&!this.isValid()){
this.focus();
}
},_setOKBtnDisabled:function(_28f,_290){
if(_28f&&_28f[0]&&_28f[0].label===RV_RES.IDS_JS_OK){
_28f[0].set("disabled",_290);
}
},isValid:function(){
var _291=this.validator(this.get("displayedValue"),this.get("constraints"));
this._setOKBtnDisabled(this.oDlgBtns,!_291);
return _291;
}});
if(this.sContentLocale!=null){
dojo.requireLocalization("dojo.cldr","number",this.sContentLocale);
this._calculationField.constraints={locale:this.sContentLocale};
}
var _292=document.createElement("label");
_292.appendChild(document.createTextNode(this.sLabel));
_292.setAttribute("for",this._calculationField.id);
cell.addContent(_292);
row=new bux.layout.TableContainerRow({parentContainer:_28c});
cell=new bux.layout.TableContainerCell({classname:"bux-dialog-field",parentContainer:row});
cell.addContent(this._calculationField.domNode);
this._calculationField.oDlgBtns=this._buxBaseDialog._aButtonObjects;
},onOK:function(){
if(this._calculationField.state!="Error"){
this.inherited(arguments);
this.okHandler(this._calculationField.get("value"));
this.hide();
}
},onCancel:function(){
this._calculationField._cancelled=true;
this.inherited(arguments);
}});
dojo.provide("bux.dialogs.ConfirmationDialog");
viewer.dialogs.ConfirmationDialog=function(_293,_294,_295,_296,_297,_298){
dojo["require"]("bux.dialogs.InformationDialog");
var _299=new bux.dialogs.Confirm(_293,_294,_295,dojo.hitch(_297,_298,_297),_296);
return _299;
};
dojo.provide("bux.dialogs.SelectSnapshot");
dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");
dojo.declare("viewer.dialogs.SelectSnapshot",bux.dialogs.BaseCustomContentDialog,{sTitle:null,sLabel:null,okHandler:null,cancelHandler:null,startup:function(){
this.updateTitle(this.sTitle);
this.inherited(arguments);
var _29a=new bux.layout.TableContainer({classname:"bux-InformationDialog"},this.contentContainer);
var row=new bux.layout.TableContainerRow({parentContainer:_29a});
var cell=new bux.layout.TableContainerCell({classname:"bux-dialog-label",parentContainer:row});
this.createSnapshotsControl();
var _29d=document.createElement("label");
_29d.appendChild(document.createTextNode(this.sLabel));
_29d.setAttribute("for",this._snapshots.id);
cell.addContent(_29d);
row=new bux.layout.TableContainerRow({parentContainer:_29a});
cell=new bux.layout.TableContainerCell({classname:"bux-dialog-field",parentContainer:row});
cell.addContent(this._snapshots);
},onOK:function(){
this.inherited(arguments);
var _29e=this._snapshots.selectedIndex;
var _29f=this._snapshots.options[_29e];
this.okHandler(_29f.getAttribute("storeID"),_29f.value);
this.hide();
},createSnapshotsControl:function(){
this._snapshots=document.createElement("select");
this._snapshots.id=this.dialogId+"snapshots";
this._snapshots.setAttribute("size","8");
this._snapshots.setAttribute("name",this.dialogId+"snapshots");
var _2a0=XMLHelper_FindChildByTagName(this.cmResponse,"result",true);
var _2a1=XMLHelper_FindChildrenByTagName(_2a0,"item",false);
for(var _2a2=0;_2a2<_2a1.length;_2a2++){
var _2a3=_2a1[_2a2];
var _2a4=XMLHelper_GetText(XMLHelper_FindChildByTagName(_2a3,"creationTime_localized",true));
var _2a5=XMLHelper_FindChildByTagName(_2a3,"storeID",true);
var _2a6=XMLHelper_GetText(XMLHelper_FindChildByTagName(_2a5,"value",true));
var _2a7=XMLHelper_FindChildByTagName(_2a3,"creationTime",true);
var _2a8=XMLHelper_GetText(XMLHelper_FindChildByTagName(_2a7,"value",true));
this._snapshots.options[_2a2]=new Option(_2a4,_2a8);
this._snapshots.options[_2a2].setAttribute("storeID",_2a6);
if(this.currentSnapshotCreationTime==_2a8){
this._snapshots.options[_2a2].selected=true;
}
}
}});
function CognosViewerAction(){
this.m_oCV=null;
};
CognosViewerAction.prototype.setRequestParms=function(_2a9){
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
CognosViewerAction.prototype.updateMenu=function(_2af){
return _2af;
};
CognosViewerAction.prototype.addAdditionalOptions=function(_2b0){
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
var _2b2="";
if(this.m_oCV!=null){
if(typeof this.m_oCV.envParams["reportpart_id"]!="undefined"){
_2b2=this.m_oCV.envParams["reportpart_id"];
}else{
if(typeof this.m_oCV.envParams["ui.name"]!="undefined"){
_2b2=this.m_oCV.envParams["ui.name"];
}
}
}
return _2b2;
};
CognosViewerAction.prototype.getContainerId=function(_2b3){
var _2b4="";
if(_2b3&&_2b3.getAllSelectedObjects){
var _2b5=_2b3.getAllSelectedObjects();
if(_2b5){
var _2b6=_2b5[0];
if(_2b6&&_2b6.getLayoutElementId){
_2b4=this.removeNamespace(_2b6.getLayoutElementId());
}
}
}
return _2b4;
};
CognosViewerAction.prototype.removeNamespace=function(_2b7){
var _2b8=_2b7;
try{
if(_2b7!=""){
var _2b9=_2b7.indexOf(this.m_oCV.getId());
if(_2b9!=-1){
_2b7=_2b7.replace(this.m_oCV.getId(),"");
}
}
return _2b7;
}
catch(e){
return _2b8;
}
};
CognosViewerAction.prototype.doAddActionContext=function(){
return true;
};
CognosViewerAction.prototype.getSelectionContext=function(){
return getViewerSelectionContext(this.m_oCV.getSelectionController(),new CSelectionContext(this.m_oCV.envParams["ui.object"]),this.genSelectionContextWithUniqueCTXIDs());
};
CognosViewerAction.prototype.getNumberOfSelections=function(){
var _2ba=-1;
if(this.m_oCV!=null&&this.m_oCV.getSelectionController()!=null){
_2ba=this.m_oCV.getSelectionController().getSelections().length;
}
return _2ba;
};
CognosViewerAction.prototype.buildDynamicMenuItem=function(_2bb,_2bc){
_2bb.action={name:"LoadMenu",payload:{action:_2bc}};
_2bb.items=[{"name":"loading","label":RV_RES.GOTO_LOADING,iconClass:"loading"}];
return _2bb;
};
CognosViewerAction.prototype.createCognosViewerDispatcherEntry=function(_2bd){
var oReq=new ViewerDispatcherEntry(this.getCognosViewer());
oReq.addFormField("ui.action",_2bd);
this.preProcess();
if(this.doAddActionContext()===true){
var _2bf=this.addActionContext();
oReq.addFormField("cv.actionContext",_2bf);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_2bf,"xml");
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
var _2c0=this.getCognosViewer().getViewerWidget();
if(_2c0){
var _2c1={"modified":true};
_2c0.fireEvent("com.ibm.bux.widget.modified",null,_2c1);
}
}
catch(e){
}
};
CognosViewerAction.prototype.showCustomCursor=function(evt,id,_2c4){
var _2c5=document.getElementById(id);
if(_2c5==null){
_2c5=document.createElement("span");
_2c5.className="customCursor";
_2c5.setAttribute("id",id);
document.body.appendChild(_2c5);
}
var _2c6="<img src=\""+this.getCognosViewer().getWebContentRoot()+_2c4+"\"/>";
_2c5.innerHTML=_2c6;
_2c5.style.position="absolute";
_2c5.style.left=(evt.clientX+15)+"px";
_2c5.style.top=(evt.clientY+15)+"px";
_2c5.style.display="inline";
};
CognosViewerAction.prototype.hideCustomCursor=function(id){
var _2c8=document.getElementById(id);
if(_2c8!=null){
_2c8.style.display="none";
}
};
CognosViewerAction.prototype.selectionHasContext=function(){
var _2c9=this.getCognosViewer().getSelectionController().getAllSelectedObjects();
var _2ca=false;
if(_2c9!=null&&_2c9.length>0){
for(var i=0;i<_2c9.length;i++){
if(_2c9[i].hasContextInformation()){
_2ca=true;
break;
}
}
}
return _2ca;
};
CognosViewerAction.prototype.isInteractiveDataContainer=function(_2cc){
var _2cd=false;
if(typeof _2cc!="undefined"&&_2cc!=null){
var id=_2cc.toLowerCase();
_2cd=id=="crosstab"||id=="list"||this.getCognosViewer().getRAPReportInfo().isChart(id);
}
return _2cd;
};
CognosViewerAction.prototype.getSelectedContainerId=function(){
var _2cf=this.getCognosViewer();
var _2d0=_2cf.getSelectionController();
var _2d1=null;
if(_2d0!=null&&typeof _2d0!="undefined"){
_2d1=this.getContainerId(_2d0);
}
return _2d1;
};
CognosViewerAction.prototype.getSelectedReportInfo=function(){
var _2d2=this.getCognosViewer();
var _2d3=this.getSelectedContainerId();
var _2d4=this.getReportInfo(_2d3);
if(_2d4==null){
var _2d5=_2d2.getRAPReportInfo();
if(_2d5.getContainerCount()==1){
_2d4=_2d5.getContainerFromPos(0);
}
}
return _2d4;
};
CognosViewerAction.prototype.getReportInfo=function(_2d6){
var _2d7=null;
if(_2d6!=null&&_2d6.length>0){
var _2d8=this.getCognosViewer();
var _2d9=_2d8.getRAPReportInfo();
_2d7=_2d9.getContainer(_2d6);
}
return _2d7;
};
CognosViewerAction.prototype.isSelectionOnChart=function(){
var _2da=this.getCognosViewer();
if(_2da.getSelectionController().hasSelectedChartNodes()){
return true;
}
var _2db=this.getContainerId(_2da.getSelectionController());
if(typeof _2db!="undefined"){
var _2dc=this.getReportInfo(_2db);
if(_2dc!=null&&_2dc.displayTypeId){
var _2dd=_2dc.displayTypeId.toLowerCase();
return _2da.getRAPReportInfo().isChart(_2dd);
}
}
return false;
};
CognosViewerAction.prototype.ifContainsInteractiveDataContainer=function(){
var _2de=this.getCognosViewer().getRAPReportInfo();
if(_2de){
return _2de.containsInteractiveDataContainer();
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
var _2e0=[];
var _2e1=document.getElementById("rt"+this.m_oCV.getId());
if(_2e1!=null){
_2e0=getElementsByAttribute(_2e1,"*","lid");
}
return _2e0;
};
CognosViewerAction.prototype.addClientContextData=function(_2e2){
var _2e3=this.m_oCV.getSelectionController();
if(typeof _2e3!="undefined"&&_2e3!=null&&typeof _2e3.getCCDManager!="undefined"&&_2e3.getCCDManager()!=null){
var _2e4=_2e3.getCCDManager();
return ("<md>"+xml_encode(_2e4.MetadataToJSON())+"</md>"+"<cd>"+xml_encode(_2e4.ContextDataSubsetToJSON(_2e2))+"</cd>");
}
return "";
};
CognosViewerAction.prototype.getDataItemInfoMap=function(){
var _2e5=this.m_oCV.getSelectionController();
if(typeof _2e5!="undefined"&&_2e5!=null&&typeof _2e5.getCCDManager!="undefined"&&_2e5.getCCDManager()!=null){
var _2e6=_2e5.getCCDManager();
return ("<di>"+xml_encode(_2e6.DataItemInfoToJSON())+"</di>");
}
return "";
};
CognosViewerAction.prototype.getRAPLayoutTag=function(_2e7){
var _2e8=null;
if(typeof _2e7=="object"&&_2e7!=null){
_2e8=_2e7.getAttribute("rap_layout_tag");
}
return _2e8;
};
CognosViewerAction.prototype.addMenuItemChecked=function(_2e9,_2ea,_2eb){
if(_2e9){
if(this.getCognosViewer().isHighContrast()){
_2ea["class"]="menuItemSelected";
}
_2ea.iconClass="menuItemChecked";
}else{
if(_2eb&&_2eb.length>0){
_2ea.iconClass=_2eb;
}
}
};
CognosViewerAction.prototype.gatherFilterInfoBeforeAction=function(_2ec){
var _2ed=this.getCognosViewer().getViewerWidget();
_2ed.filterRequiredAction=_2ec;
_2ed.clearRAPCache();
_2ed.fireEvent("com.ibm.bux.widget.action",null,{action:"canvas.filters"});
};
CognosViewerAction.prototype.addClientSideUndo=function(_2ee,_2ef){
var _2f0=GUtil.generateCallback(_2ee.doUndo,_2ef,_2ee);
var _2f1=GUtil.generateCallback(_2ee.doRedo,_2ef,_2ee);
this.getUndoRedoQueue().addClientSideUndo({"tooltip":_2ee.getUndoHint(),"undoCallback":_2f0,"redoCallback":_2f1});
this.getCognosViewer().getViewerWidget().updateToolbar();
};
CognosViewerAction.prototype.isValidMenuItem=function(){
var _2f2=this.getCognosViewer();
var _2f3=_2f2.getViewerWidget();
if(this.isPromptWidget()){
return false;
}
return true;
};
CognosViewerAction.prototype.isPositiveInt=function(_2f4){
if(typeof _2f4==="undefined"||_2f4===null){
return false;
}
var _2f5=parseInt(_2f4,10);
return _2f4&&_2f5===+_2f4&&_2f5>0&&_2f4.indexOf(".")==-1;
};
CognosViewerAction.prototype.buildActionResponseObject=function(_2f6,code,msg){
return {"status":_2f6,"message":msg?msg:null,"code":code?code:null,getStatus:function(){
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
LineageAction.prototype.getCommonOptions=function(_2f9){
_2f9.addFormField("cv.responseFormat","asynchDetailMIMEAttachment");
_2f9.addFormField("bux",this.m_oCV.getViewerWidget()?"true":"false");
_2f9.addFormField("cv.id",this.m_oCV.envParams["cv.id"]);
};
LineageAction.prototype.getSelectionOptions=function(_2fa){
var _2fb=this.m_oCV.getSelectionController();
var _2fc=getSelectionContextIds(_2fb);
_2fa.addFormField("context.format","initializer");
_2fa.addFormField("context.type","reportService");
_2fa.addFormField("context.selection","metadata,"+_2fc.toString());
};
LineageAction.prototype.getPrimaryRequestOptions=function(_2fd){
_2fd.addFormField("specificationType","metadataServiceLineageSpecification");
_2fd.addFormField("ui.action","runLineageSpecification");
_2fd.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
};
LineageAction.prototype.getSecondaryRequestOptions=function(_2fe){
_2fe.addFormField("ui.conversation",this.m_oCV.getConversation());
_2fe.addFormField("m_tracking",this.m_oCV.getTracking());
_2fe.addFormField("ui.action","lineage");
};
LineageAction.prototype.updateMenu=function(_2ff){
if(!this.getCognosViewer().bCanUseLineage){
return "";
}
_2ff.disabled=!this.selectionHasContext();
return _2ff;
};
LineageAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _301=new AsynchDataDispatcherEntry(oCV);
this.getCommonOptions(_301);
this.getSelectionOptions(_301);
if(oCV.getConversation()==""){
this.getPrimaryRequestOptions(_301);
}else{
this.getSecondaryRequestOptions(_301);
}
_301.setCallbacks({"complete":{"object":this,"method":this.handleLineageResponse}});
if(!oCV.m_viewerFragment){
_301.setRequestIndicator(oCV.getRequestIndicator());
var _302=new WorkingDialog(oCV);
_302.setSimpleWorkingDialogFlag(true);
_301.setWorkingDialog(_302);
}
oCV.dispatchRequest(_301);
};
LineageAction.prototype.handleLineageResponse=function(_303){
var oCV=this.getCognosViewer();
oCV.loadExtra();
oCV.setStatus(_303.getAsynchStatus());
oCV.setConversation(_303.getConversation());
oCV.setTracking(_303.getTracking());
var _305=null;
if(typeof MDSRV_CognosConfiguration!="undefined"){
_305=new MDSRV_CognosConfiguration();
var _306="";
if(this.m_oCV.envParams["metadataInformationURI"]){
_306=this.m_oCV.envParams["metadataInformationURI"];
}
_305.addProperty("lineageURI",_306);
_305.addProperty("gatewayURI",this.m_oCV.getGateway());
}
var _307=this.m_oCV.envParams["ui.object"];
var _308=getViewerSelectionContext(this.m_oCV.getSelectionController(),new CSelectionContext(_307));
var _309=new MDSRV_LineageFragmentContext(_305,_308);
_309.setExecutionParameters(this.m_oCV.getExecutionParameters());
if(typeof _307=="string"){
_309.setReportPath(_307);
}
_309.setReportLineage(_303.getResult());
_309.open();
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
ModifyReportAction.prototype.reuseConversation=function(_30a){
if(typeof _30a!="undefined"){
this.m_reuseConversation=_30a;
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
var _30b=new ModifyReportDispatcherEntry(this.m_oCV);
_30b.initializeAction(this);
return _30b;
};
ModifyReportAction.prototype.isSelectSingleMember=function(_30c){
var _30d=this.m_oCV.getRAPReportInfo();
var _30e=_30c.getDataItems();
if(_30d&&_30e.length>0){
var _30f=this.getContainerId(this.m_oCV.getSelectionController());
var _310=_30d.getItemInfo(_30f,_30e[0][0]);
if(_310.single=="true"){
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
var _312=this.createActionDispatcherEntry();
this.addAdditionalOptions(_312);
oCV.dispatchRequest(_312);
}else{
var _313=this.createCognosViewerDispatcherEntry("modifyReport");
_313.setCallbacks({"complete":{"object":this,"method":this.updateReportSpecCallback}});
oCV.dispatchRequest(_313);
}
this.fireModifiedReportEvent();
};
ModifyReportAction.prototype.updateReportSpecCallback=function(_314){
var _315=_314.getResponseState();
var _316=new RequestHandler(this.m_oCV);
_316.updateViewerState(_315);
if(!this.m_bUndoAdded){
this.m_bUndoAdded=true;
var _317=this.getUndoRedoQueue();
if(_317){
_317.initUndoObj({"tooltip":this.getUndoHint(),"saveSpec":true});
_317.add({"reportUpdated":true});
}
var _318=this.getCognosViewer().getViewerWidget();
if(_318){
_318.updateToolbar();
}
}
};
ModifyReportAction.prototype.addActionContext=function(){
var _319="<reportActions";
if(this.runReport()==false){
_319+=" run=\"false\"";
}
_319+=">";
_319+=this.getReportActionContext();
_319+="</reportActions>";
return _319;
};
ModifyReportAction.prototype.getReportActionContext=function(){
var _31a=this.getCognosViewer();
var _31b=_31a.getSelectionController();
var _31c="<"+this.m_sAction+">";
var _31d=this.getContainerId(_31b);
if(_31d!=""){
_31c+="<id>"+xml_encode(_31d)+"</id>";
}
_31c+=this.getRTStateInfo();
_31c+=this.getSelectionContext();
var _31e=this.addActionContextAdditionalParms();
if(_31e!=null&&_31e!="undefined"){
_31c+=_31e;
}
_31c+="</"+this.m_sAction+">";
if(this.updateInfoBar()){
_31c+=this.getGetInfoActionContext();
}
return _31c;
};
ModifyReportAction.prototype.getGetInfoActionContext=function(){
return "<GetInfo/>";
};
ModifyReportAction.prototype.getRTStateInfo=function(){
var _31f=this.getCognosViewer().getViewerWidget();
if(_31f&&_31f.getBUXRTStateInfoMap){
var _320=_31f.getBUXRTStateInfoMap();
return _320?_320:"";
}
return "";
};
ModifyReportAction.prototype.createEmptyMenuItem=function(){
return {name:"None",label:"(empty)",iconClass:"",action:null,items:null};
};
ModifyReportAction.prototype.getStateFromResponse=function(_321){
var _322=null;
if(_321&&typeof _321!="undefined"&&_321.responseText&&typeof _321.responseText!="undefined"&&_321.responseText.length>0){
var _323=XMLBuilderLoadXMLFromString(_321.responseText);
var _324=_323.getElementsByTagName("state");
if(_324!=null&&_324.length>0){
try{
if(typeof _324[0].text!="undefined"){
_322=eval("("+_324[0].text+")");
}else{
_322=eval("("+_324[0].textContent+")");
}
}
catch(e){
if(typeof console!="undefined"&&console&&console.log){
console.log(e);
}
}
}
}
return _322;
};
ModifyReportAction.prototype.getSelectedCellTags=function(){
var _325="";
var _326=this.getCognosViewer().getSelectionController().getSelections();
for(var i=0;i<_326.length;++i){
var _328=_326[i].getCellRef();
var _329=_326[i].getDataItems()[0];
if(typeof _329=="undefined"||_329==null){
_329="";
}
var tag=this.getRAPLayoutTag(_328);
if(tag!=null){
_325+="<tag><tagValue>"+xml_encode(tag)+"</tagValue><dataItem>"+xml_encode(_329)+"</dataItem></tag>";
}else{
_325+="<tag><tagValue/><dataItem>"+xml_encode(_329)+"</dataItem></tag>";
}
}
if(_325!=""){
_325="<selectedCellTags>"+_325+"</selectedCellTags>";
}
return _325;
};
ModifyReportAction.prototype.getIsNumericFromReportInfo=function(_32b){
var _32c=this.getSelectedReportInfo();
if(_32c!=null&&typeof _32c.itemInfo!="undefined"){
for(var item=0;item<_32c.itemInfo.length;++item){
if(_32b==_32c.itemInfo[item].item&&typeof _32c.itemInfo[item].numeric!="undefined"){
return (_32c.itemInfo[item].numeric=="true");
}
}
}
return false;
};
function CognosViewerCalculation(){
this.m_oCV=null;
};
CognosViewerCalculation.prototype.setCognosViewer=function(oCV){
this.m_oCV=oCV;
};
CognosViewerCalculation.prototype.getCognosViewer=function(){
return this.m_oCV;
};
CognosViewerCalculation.prototype.validSelectionLength=function(_32f){
try{
return _32f.getAllSelectedObjects().length>0;
}
catch(e){
return false;
}
};
CognosViewerCalculation.prototype.getDisplayValueFromSelection=function(_330){
var _331="";
if(!_330){
return _331;
}
if(_330.getLayoutType()=="columnTitle"){
_331=_330.getDisplayValues()[0];
}else{
if(_330.getLayoutType()=="datavalue"){
var _332=this.m_oCV.getAction("CognosViewer");
var _333=this.m_oCV.getSelectionController();
var _334=_332.getContainerId(_333);
_331=_330.getDataItemDisplayValue(_332.getReportInfo(_334));
}
}
if(_331.indexOf("+")!=-1||_331.indexOf("-")!=-1||_331.indexOf("*")!=-1||_331.indexOf("/")!=-1){
_331="("+_331+")";
}
return _331;
};
CognosViewerCalculation.prototype.getCalcSymbol=function(){
};
CognosViewerCalculation.prototype.getMenuItemString=function(_335){
var _336=this.getCognosViewer();
var _337=_336.getSelectionController();
var _338="";
var _339,_33a;
if(_335){
try{
var _33b=_337.getAllSelectedObjects().length;
if(_33b==1){
_339=_337.getAllSelectedObjects()[0];
if(this.m_bFlipSelection){
_338=RV_RES.IDS_JS_CALCULATE_NUMBER+" "+this.getCalcSymbol()+" "+this.getDisplayValueFromSelection(_339);
}else{
_338=this.getDisplayValueFromSelection(_339)+" "+this.getCalcSymbol()+" "+RV_RES.IDS_JS_CALCULATE_NUMBER;
}
}else{
if(this.m_bFlipSelection){
_33b--;
for(_33a=_33b;_33a>=0;_33a--){
_339=_337.getAllSelectedObjects()[_33a];
if(_33a!=_33b){
_338+=" "+this.getCalcSymbol()+" ";
}
_338+=this.getDisplayValueFromSelection(_339);
}
}else{
for(_33a=0;_33a<_33b;_33a++){
_339=_337.getAllSelectedObjects()[_33a];
if(_33a>0){
_338+=" "+this.getCalcSymbol()+" ";
}
_338+=this.getDisplayValueFromSelection(_339);
}
}
}
}
catch(e){
_338=this.getCalcSymbol();
}
}else{
_338=this.getCalcSymbol();
}
return _338;
};
function PercentDifferenceCalculation(){
};
PercentDifferenceCalculation.prototype=new CognosViewerCalculation();
PercentDifferenceCalculation.prototype.validSelectionLength=function(_33c){
try{
return _33c.getAllSelectedObjects().length==2;
}
catch(e){
return false;
}
};
PercentDifferenceCalculation.prototype.getMenuItemString=function(_33d){
var _33e=this.getCognosViewer().getSelectionController();
var _33f=RV_RES.IDS_JS_CALCULATE_PERCENT_DIFFERENCE;
if(_33d){
try{
var _340=_33e.getAllSelectedObjects().length;
_33f+=" (";
for(var _341=0;_341<_340;_341++){
var _342=_33e.getAllSelectedObjects()[_341];
if(_341>0){
_33f+=", ";
}
_33f+=this.getDisplayValueFromSelection(_342);
}
_33f+=")";
}
catch(e){
}
}
return _33f;
};
function PercentDifferenceCalculationSwapOrder(){
this.m_bFlipSelection=true;
};
PercentDifferenceCalculationSwapOrder.prototype=new PercentDifferenceCalculation();
PercentDifferenceCalculationSwapOrder.prototype.getMenuItemString=function(_343){
var _344=this.getCognosViewer().getSelectionController();
var _345=RV_RES.IDS_JS_CALCULATE_PERCENT_DIFFERENCE;
if(_343){
try{
var _346=_344.getAllSelectedObjects().length;
_345+=" (";
_346--;
for(var _347=_346;_347>=0;_347--){
var _348=_344.getAllSelectedObjects()[_347];
if(_347<_346){
_345+=", ";
}
_345+=this.getDisplayValueFromSelection(_348);
}
_345+=")";
}
catch(e){
}
}
return _345;
};
function AdditionCalculation(){
};
AdditionCalculation.prototype=new CognosViewerCalculation();
AdditionCalculation.prototype.getCalcSymbol=function(){
return "+";
};
function SubtractionCalculation(){
};
SubtractionCalculation.prototype=new CognosViewerCalculation();
SubtractionCalculation.prototype.getCalcSymbol=function(){
return "-";
};
SubtractionCalculation.prototype.validSelectionLength=function(_349){
try{
var _34a=_349.getAllSelectedObjects().length;
return _34a>0&&_34a<3;
}
catch(e){
return false;
}
};
function SubtractionCalculationSwapOrder(){
this.m_bFlipSelection=true;
};
SubtractionCalculationSwapOrder.prototype=new SubtractionCalculation();
function MultiplicationCalculation(){
};
MultiplicationCalculation.prototype=new CognosViewerCalculation();
MultiplicationCalculation.prototype.getCalcSymbol=function(){
return "*";
};
function DivisionCalculation(){
};
DivisionCalculation.prototype=new CognosViewerCalculation();
DivisionCalculation.prototype.getCalcSymbol=function(){
return "/";
};
DivisionCalculation.prototype.validSelectionLength=function(_34b){
try{
var _34c=_34b.getAllSelectedObjects().length;
return (_34c>0&&_34c<3);
}
catch(e){
return false;
}
};
function DivisionCalculationSwapOrder(){
this.m_bFlipSelection=true;
};
DivisionCalculationSwapOrder.prototype=new DivisionCalculation();
function CalculationAction(){
this.m_payload="";
this.m_menuBuilderClass=null;
this.m_defaultName="";
this.m_constant=null;
};
CalculationAction.prototype=new ModifyReportAction();
CalculationAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_CALCULATION;
};
CalculationAction.prototype.keepRAPCache=function(){
return false;
};
CalculationAction.prototype.listRules=function(){
var _34d=this.getCognosViewer().getSelectionController();
var _34e=_34d.getSelections();
if(_34e.length>1){
var tmp={};
for(var i=0;i<_34e.length;++i){
var _351=_34e[i].getColumnRef();
if(typeof tmp[_351]=="undefined"){
tmp[_351]=1;
}else{
return false;
}
}
}
return _34d.selectionsHaveCalculationMetadata();
};
CalculationAction.prototype.crosstabRules=function(){
var _352=this.getCognosViewer().getSelectionController();
if(!_352.areSelectionsColumnRowTitles()){
return false;
}
if(_352.isRelational()){
if(!this.relationalCrosstabRules(_352)){
return false;
}
}else{
if(!this.olapCrosstabRules(_352)){
return false;
}
}
return true;
};
CalculationAction.prototype.relationalCrosstabRules=function(_353){
return _353.selectionsHaveCalculationMetadata();
};
CalculationAction.prototype.olapCrosstabRules=function(_354){
if(!_354.selectionsHaveCalculationMetadata()){
return false;
}
if(!this.sameDimension(_354)){
return (typeof this.m_oCV.aQoSFunctions!="undefined")&&this.m_oCV.aQoSFunctions.toString().indexOf("MULTIPLE_MEASURE_DIMENSION_CALCULATIONS")!=-1&&_354.selectionsAreMeasures();
}else{
if(this.sameHierarchy(_354)){
return true;
}else{
return (typeof this.m_oCV.aQoSFunctions!="undefined")&&this.m_oCV.aQoSFunctions.toString().indexOf("VALUE_EXPRESSIONS_REF_MULTIPLE_HIERARCHIES_OF_SAME_DIMENSION")!=-1;
}
}
};
CalculationAction.prototype.sameDimension=function(_355){
try{
var dim="";
var _357=_355.getAllSelectedObjects().length;
for(var _358=0;_358<_357;_358++){
if(dim.length==0){
dim=_355.getAllSelectedObjects()[_358].getDimensionalItems("dun")[0][0];
}else{
if(dim!=_355.getAllSelectedObjects()[_358].getDimensionalItems("dun")[0][0]){
return false;
}
}
}
return true;
}
catch(e){
return false;
}
};
CalculationAction.prototype.sameHierarchy=function(_359){
try{
var dim="";
var _35b=_359.getAllSelectedObjects().length;
for(var _35c=0;_35c<_35b;_35c++){
if(dim.length==0){
dim=_359.getAllSelectedObjects()[_35c].getDimensionalItems("hun")[0][0];
}else{
if(dim!=_359.getAllSelectedObjects()[_35c].getDimensionalItems("hun")[0][0]){
return false;
}
}
}
return true;
}
catch(e){
return false;
}
};
CalculationAction.prototype.addActionContextAdditionalParms=function(){
var _35d="";
if(this.m_constant!=null){
_35d+="<constant>"+xml_encode(this.m_constant)+"</constant>";
if(this.m_swapSelectionOrder){
_35d+="<constantFirst/>";
}
}
if(this.m_defaultName!=""){
_35d+="<columnName>"+xml_encode(this.m_defaultName)+"</columnName>";
}
return _35d;
};
CalculationAction.prototype.setRequestParms=function(_35e){
if(_35e!=null){
if(typeof _35e.constant!=null){
this.m_constant=_35e.constant;
}
}
};
CalculationAction.prototype.buildDefaultName=function(){
try{
var calc=this.getCognosViewer().getCalculation(this.m_menuBuilderClass);
this.m_defaultName=calc.getMenuItemString(true);
if(this.m_constant!=null){
var _360=""+this.m_constant;
var _361=this.getCognosViewer().envParams["contentDecimalSeparator"];
if(typeof _361!="undefined"&&_361!=null&&_361!="."){
_360=_360.replace(".",_361);
}
this.m_defaultName=this.m_defaultName.replace(RV_RES.IDS_JS_CALCULATE_NUMBER,_360);
}
}
catch(e){
this.m_defaultName="";
}
};
CalculationAction.prototype.preProcess=function(){
var _362=this.getNumberOfSelections();
this.buildDefaultName();
if(this.m_swapSelectionOrder&&_362==2){
var _363=this.getCognosViewer().getSelectionController();
var sel1=_363.getAllSelectedObjects()[0];
var sel2=_363.getAllSelectedObjects()[1];
_363.m_aSelectedObjects=[sel2,sel1];
}
};
CalculationAction.prototype.isFactCellOnCrosstabOrEmpty=function(){
var _366=this.m_oCV.getSelectionController();
var _367=_366.getAllSelectedObjects();
if(_367!=null&&typeof _367!="undefined"){
if(_367.length==0){
return true;
}else{
var _368=_367[0];
if(_366.getDataContainerType()=="crosstab"&&_368.getLayoutType()=="datavalue"){
return true;
}
}
}
return false;
};
CalculationAction.prototype.isSummaryOrAggregateCell=function(){
var _369=this.m_oCV.getSelectionController();
var _36a=_369.getAllSelectedObjects();
if(_36a!=null&&typeof _36a!="undefined"){
var _36b;
var _36c=/\b(ol|il)\b/;
for(var i=0;i<_36a.length;i++){
_36b=_36a[i].getCellRef();
if(_36b!=null&&typeof _36b!="undefined"){
if(_36a[i].getLayoutType()=="summary"||(_36b!=null&&_36c.test(_36b.className))){
return true;
}
}
_36b=null;
}
}
return false;
};
CalculationAction.prototype.isLastSelectionSingleDimensionNested=function(){
var _36e=this.m_oCV.getSelectionController();
var _36f=_36e.getAllSelectedObjects();
if(_36f!=null&&typeof _36f!="undefined"&&_36f.length){
var _370=_36f[_36f.length-1];
var _371=_370.getDimensionalItems("dun")[0];
if(_371&&_371.length&&_371[0]){
for(var _372=1;_372<_371.length;++_372){
if(_371[_372]===_371[0]){
return true;
}
}
}
}
return false;
};
CalculationAction.prototype.areCalculationsPossible=function(){
var _373=this.getCognosViewer().getSelectionController();
if(this.isFactCellOnCrosstabOrEmpty()){
return false;
}
if(this.isSelectionOnChart()){
return false;
}
if(this.isSummaryOrAggregateCell()){
return false;
}
if(!_373.selectionsInSameDataContainer()){
return false;
}
if(_373.getDataContainerType()=="list"){
return this.listRules(_373);
}else{
if(_373.getDataContainerType()=="crosstab"&&!this.isLastSelectionSingleDimensionNested()){
return this.crosstabRules(_373);
}
}
return false;
};
CalculationAction.prototype.updateMenu=function(_374,_375){
_374.visible=this.ifContainsInteractiveDataContainer();
if(!_374.visible){
return _374;
}
if(!this.areCalculationsPossible()){
return this.toggleMenu(_374,false);
}
this.toggleMenu(_374,true);
if(this.m_oCV.aQoSFunctions){
_374=this.buildCalculationMenuItemsAgainstSelection(_374);
}else{
_374=this.buildDynamicMenuItem(_374,"Calculation");
}
return _374;
};
CalculationAction.prototype.toggleMenu=function(_376,_377){
if(_377){
_376.iconClass="calculate";
_376.disabled=false;
}else{
_376.iconClass="calculateDisabled";
_376.disabled=true;
}
return _376;
};
CalculationAction.prototype.buildMenu=function(_378,_379){
_378.visible=this.ifContainsInteractiveDataContainer();
if(!_378.visible){
return _378;
}
if(!this.areCalculationsPossible()){
return this.toggleMenu(_378,false);
}
this.toggleMenu(_378,true);
var _37a=this.getCognosViewer();
if(typeof _37a.aQoSFunctions=="undefined"){
this.fetchQoS(_378,_379,(typeof _379=="undefined")?false:true);
}
if(typeof _37a.aQoSFunctions!="undefined"){
return this.buildCalculationMenuItemsAgainstSelection(_378);
}
};
CalculationAction.prototype.fetchQoS=function(_37b,_37c,_37d){
var _37e={customArguments:[_37b,_37c],"complete":{"object":this,"method":this.handleQoSResponse}};
var _37f=new AsynchJSONDispatcherEntry(this.m_oCV);
_37f.setCallbacks(_37e);
_37f.addFormField("ui.action","getQualityOfService");
_37f.addFormField("parameterValues",this.m_oCV.getExecutionParameters());
_37f.addFormField("bux","true");
_37f.addNonEmptyStringFormField("modelPath",this.m_oCV.getModelPath());
_37f.addDefinedFormField("metaDataModelModificationTime",this.m_oCV.envParams["metaDataModelModificationTime"]);
if(!_37d){
_37f.forceSynchronous();
}
this.m_oCV.dispatchRequest(_37f);
};
CalculationAction.prototype.handleQoSResponse=function(_380,_381,_382){
this.m_oCV.aQoSFunctions=_380.getResult();
this.buildCalculationMenuItemsAgainstSelection(_381,_382);
if(typeof _382=="function"){
_382();
}
};
CalculationAction.prototype.buildCalculationMenuItemsAgainstSelection=function(_383,_384){
var _385=this.m_oCV.aBuxCalculations;
var _386=[];
for(var _387=0;_387<_385.length;_387++){
var calc=this.m_oCV.getCalculation(_385[_387]);
if(this.m_oCV.aQoSFunctions==null||typeof this.m_oCV.aQoSFunctions=="undefined"){
_383.disabled=true;
_383.iconClass="calculate";
_383.items=null;
return _383;
}
if(calc&&calc.validSelectionLength(this.getCognosViewer().getSelectionController())&&this.m_oCV.aQoSFunctions.toString().indexOf(_385[_387])!=-1){
var _389={};
_389.name=_385[_387];
_389.label=calc.getMenuItemString(true);
_389.action={};
var _38a="";
if(_385[_387].indexOf("SwapOrder")!=-1){
_38a=_385[_387].substring(0,_385[_387].indexOf("SwapOrder"));
}else{
_38a=_385[_387];
}
_389.iconClass=_38a;
if(this.getNumberOfSelections()==1){
_389.action.name="ConstantOperandCalculation";
_389.action.payload=_385[_387];
}else{
_389.action.name=_385[_387];
_389.action.payload="";
}
if(_389.action.name=="PercentDifferenceCalculation"){
_386.push({separator:true});
}
_389.items=null;
_386.push(_389);
}
}
if(_386.length==0){
this.toggleMenu(_383,false);
_386.push({name:"None",label:RV_RES.IDS_JS_CALCULATION_SELECT_DATA,iconClass:"",action:null,items:null});
}else{
this.toggleMenu(_383,true);
}
_383.items=_386;
return _383;
};
function PercentDifferenceCalculationAction(){
this.m_sAction="PercentDifference";
this.m_menuBuilderClass="PercentDifferenceCalculation";
};
PercentDifferenceCalculationAction.prototype=new CalculationAction();
function PercentDifferenceCalculationSwapOrderAction(){
this.m_sAction="PercentDifference";
this.m_menuBuilderClass="PercentDifferenceCalculationSwapOrder";
this.m_swapSelectionOrder=true;
};
PercentDifferenceCalculationSwapOrderAction.prototype=new CalculationAction();
function AdditionCalculationAction(){
this.m_sAction="Addition";
this.m_menuBuilderClass="AdditionCalculation";
};
AdditionCalculationAction.prototype=new CalculationAction();
function SubtractionCalculationAction(){
this.m_sAction="Subtraction";
this.m_menuBuilderClass="SubtractionCalculation";
};
SubtractionCalculationAction.prototype=new CalculationAction();
function SubtractionCalculationSwapOrderAction(){
this.m_sAction="Subtraction";
this.m_menuBuilderClass="SubtractionCalculationSwapOrder";
this.m_swapSelectionOrder=true;
};
SubtractionCalculationSwapOrderAction.prototype=new CalculationAction();
function MultiplicationCalculationAction(){
this.m_sAction="Multiplication";
this.m_menuBuilderClass="MultiplicationCalculation";
};
MultiplicationCalculationAction.prototype=new CalculationAction();
function DivisionCalculationAction(){
this.m_sAction="Division";
this.m_menuBuilderClass="DivisionCalculation";
};
DivisionCalculationAction.prototype=new CalculationAction();
function DivisionCalculationSwapOrderAction(){
this.m_sAction="Division";
this.m_menuBuilderClass="DivisionCalculationSwapOrder";
this.m_swapSelectionOrder=true;
};
DivisionCalculationSwapOrderAction.prototype=new CalculationAction();
function ConstantOperandCalculationAction(){
this.m_action=null;
};
ConstantOperandCalculationAction.prototype=new CognosViewerAction();
ConstantOperandCalculationAction.prototype.setRequestParms=function(_38b){
this.m_action=_38b;
};
ConstantOperandCalculationAction.prototype.execute=function(){
var _38c=getCognosViewerObjectString(this.m_oCV.getId());
var _38d=this.m_action;
var _38e=this.m_oCV.getCalculation(_38d);
var _38f=_38e.getMenuItemString(true);
var _390=RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER_TITLE;
var _391=RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER_DESCRIPTION;
_391=_391.substring(0,_391.indexOf("{0}"))+_38f+_391.substring(_391.indexOf("{0}")+3);
var _392=RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER;
var _393=this.m_oCV.envParams["contentLocale"];
var _394=new viewer.dialogs.CalculationDialog({sTitle:_390,sLabel:_392,sDescription:_391,sContentLocale:_393,okHandler:function(_395){
window[_38c].executeAction(_38d,{constant:_395});
},cancelHandler:function(){
}});
_394.startup();
window.setTimeout(function(){
_394.show();
},0);
};
function FilterAction(){
this.m_sAction="Filter";
this.m_sType="";
this.m_sItem="";
this.m_sFormattedNumber="";
this.m_sFormattedEndNumber="";
this.m_jsonDetails="";
};
FilterAction.prototype=new ModifyReportAction();
FilterAction.prototype.execute=function(){
ModifyReportAction.prototype.execute.apply(this,arguments);
if(this.m_sType.indexOf("remove")!=-1){
this.getCognosViewer().getViewerWidget().clearRAPCache();
}
};
FilterAction.prototype.genSelectionContextWithUniqueCTXIDs=function(){
return true;
};
FilterAction.prototype.getUndoHint=function(){
if(this.m_sType.indexOf("remove")!=-1){
return RV_RES.IDS_JS_REMOVE_FILTER;
}else{
return RV_RES.IDS_JS_FILTER;
}
};
FilterAction.prototype.setRequestParms=function(_396){
if(_396.type!=null&&typeof _396.type!="undefined"){
this.m_sType=_396.type;
if(_396.id!=null&&typeof _396.id!="undefined"){
this.m_sId=_396.id;
}
if(_396.item!=null&&typeof _396.item!="undefined"){
this.m_sItem=_396.item;
}
if(_396.details){
this.m_jsonDetails=_396.details;
}
if(_396.formattedNumber!=null&&typeof _396.formattedNumber!="undefined"){
this.m_sFormattedNumber=_396.formattedNumber;
}
if(_396.formattedEndNumber!=null&&typeof _396.formattedEndNumber!="undefined"){
this.m_sFormattedEndNumber=_396.formattedEndNumber;
}
}else{
this.m_sType=_396;
}
};
FilterAction.prototype.addActionContextAdditionalParms=function(){
var _397="<type>"+this.m_sType+"</type>";
if(this.m_sId!=null&&typeof this.m_sId!="undefined"){
_397+=("<id>"+xml_encode(this.m_sId)+"</id>");
}
if(this.m_sItem!=null&&typeof this.m_sItem!="undefined"&&this.m_sItem!=""){
_397+=("<item>"+xml_encode(this.m_sItem)+"</item>");
}
if(this.m_jsonDetails&&this.m_jsonDetails!=""){
_397+="<details>"+xml_encode(this.m_jsonDetails)+"</details>";
}
if(this.m_sFormattedNumber!=null&&typeof this.m_sFormattedNumber!="undefined"&&this.m_sFormattedNumber!=""){
_397+=("<formattedNumber>"+this.m_sFormattedNumber+"</formattedNumber>");
}
if(this.m_sFormattedEndNumber!=null&&typeof this.m_sFormattedEndNumber!="undefined"&&this.m_sFormattedEndNumber!=""){
_397+=("<formattedEndNumber>"+this.m_sFormattedEndNumber+"</formattedEndNumber>");
}
return _397;
};
FilterAction.prototype.buildSelectedItemsString=function(_398){
var _399="";
var _39a=_398.length;
var _39b=_39a>5?5:_39a;
for(var _39c=0;_39c<_39a;++_39c){
var _39d=this.getItemLabel(_398[_39c]);
if(typeof _39d=="undefined"||_39d==""){
return "";
}
if((_39c)<_39b){
_399+=_39d;
}
if((_39c+1)<_39b){
_399+=", ";
}
}
if(_39a>5){
_399+=", ++";
}
return _399;
};
FilterAction.prototype.getItemLabel=function(_39e){
var _39f=_39e.getDisplayValues()[0];
if(typeof _39f=="undefined"){
_39f=_39e.getUseValues()[0][0];
}
return _39f;
};
FilterAction.prototype.toggleMenu=function(_3a0,_3a1){
if(_3a1){
_3a0.iconClass="filter";
_3a0.disabled=false;
}else{
_3a0.iconClass="filterDisabled";
_3a0.disabled=true;
}
return _3a0;
};
FilterAction.prototype.updateMenu=function(_3a2){
_3a2.visible=(this.ifContainsInteractiveDataContainer()&&!this.detailFilteringIsDisabled());
var _3a3=_3a2;
if(_3a2.visible){
var _3a4=(this.m_oCV.getSelectionController().getAllSelectedObjects().length>0||this.isSelectionFilterable()||this.isRemoveAllValid());
if(!_3a4){
_3a3=this.toggleMenu(_3a2,false);
}else{
this.buildMenu(_3a2);
if(_3a2.disabled==true){
_3a3=this.toggleMenu(_3a2,false);
}else{
_3a3=this.buildDynamicMenuItem(_3a2,"Filter");
}
}
}
return _3a3;
};
FilterAction.prototype.detailFilteringIsDisabled=function(){
var _3a5=this.getCognosViewer().getRAPReportInfo();
if(_3a5){
return _3a5.isDetailFilteringDisabled();
}
return false;
};
FilterAction.prototype.buildMenu=function(_3a6){
_3a6.visible=(this.ifContainsInteractiveDataContainer()&&!this.detailFilteringIsDisabled());
if(!_3a6.visible){
return _3a6;
}
var _3a7=this.isSelectionFilterable();
this.toggleMenu(_3a6,_3a7);
var _3a8=[];
var _3a9=false;
var _3aa=false;
var _3ab=this.m_oCV.getSelectionController();
var _3ac=_3ab.getAllSelectedObjects();
if(_3ac.length>0&&_3ab.selectionsInSameDataContainer()&&_3ab.selectionsFromSameDataItem()){
var _3ad=_3ac[0].getDataItems()[0][0];
if(_3a7){
_3a9=this.addFilterValueActionsToMenu(_3ab,_3a8,_3ad);
}
if(this.isRemoveItemFilterValid(_3ad)){
if(_3a9==true){
_3a8.push({separator:true});
_3aa=true;
}
var _3ae=this.getRefDataItemLabel(_3ad);
_3a8.push({name:"RemoveFilterFor",label:RV_RES.IDS_JS_REMOVE_FILTER_FOR+" "+enforceTextDir(_3ae),iconClass:"",action:{name:"Filter",payload:"remove"},items:null});
}
}
if(this.isRemoveAllValid()==true){
if(_3a9&&!_3aa){
_3a8.push({separator:true});
}
_3a8.push({name:"RemoveAllFiltersForWidget",label:RV_RES.IDS_JS_REMOVE_ALL_FILTERS_FOR_WIDGET,iconClass:"",action:{name:"Filter",payload:"removeAllForWidget"},items:null});
}
if(_3a8.length==0){
return this.toggleMenu(_3a6,false);
}else{
_3a6.items=_3a8;
this.toggleMenu(_3a6,true);
return _3a6;
}
};
FilterAction.prototype.getRefDataItemLabel=function(_3af){
var _3b0=_3af;
var _3b1=this.m_oCV.getRAPReportInfo();
if(_3b1){
var _3b2=_3b1.getFilterObject(_3af,true);
if(_3b2){
_3b0=_3b2.itemLabel;
}
}
return _3b0;
};
FilterAction.prototype.addFilterValueActionsToMenu=function(_3b3,_3b4,_3b5){
var _3b6=_3b3.getAllSelectedObjectsWithUniqueCTXIDs();
var _3b7=_3b6.length;
var sel=0;
if(_3b6[0].m_dataContainerType=="list"){
for(sel=0;sel<_3b6.length;++sel){
if(_3b6[sel].m_sLayoutType=="columnTitle"){
_3b7=0;
break;
}
}
}
if(_3b7==0){
return false;
}
var _3b9=this.buildSelectedItemsString(_3b6);
if(_3b9==""){
if(_3b7==1&&_3b6[0].getLayoutType()=="datavalue"){
_3b9=RV_RES.IDS_JS_NULL;
_3b4.push({name:"InFilter",label:CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_INCLUDE,_3b9),iconClass:"",action:{name:"Filter",payload:"in"},items:null});
_3b4.push({name:"NotInFilter",label:CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_EXCLUDE,_3b9),iconClass:"",action:{name:"Filter",payload:"not"},items:null});
}
}else{
if(_3b3.selectionsAreDateTime()||(_3b3.selectionsHaveCalculationMetadata()&&!_3b3.selectionsNonMeasureWithMUN())){
for(sel=0;sel<_3b7;++sel){
if(_3b6[sel].m_sLayoutType=="columnTitle"){
return false;
}
}
if(_3b7==1){
if(_3b6[0].getUseValues()[0][0]){
_3b4.push({name:"LessFilter",label:RV_RES.IDS_JS_FILTER_LESS_THAN+" "+_3b9,iconClass:"",action:{name:"Filter",payload:{type:"lessThan",formattedNumber:_3b9}},items:null});
_3b4.push({name:"LessEqualFilter",label:RV_RES.IDS_JS_FILTER_LESS_THAN_EQUAL+" "+_3b9,iconClass:"",action:{name:"Filter",payload:{type:"lessThanEqual",formattedNumber:_3b9}},items:null});
_3b4.push({name:"GreaterEqualFilter",label:RV_RES.IDS_JS_FILTER_GREATER_THAN_EQUAL+" "+_3b9,iconClass:"",action:{name:"Filter",payload:{type:"greaterThanEqual",formattedNumber:_3b9}},items:null});
_3b4.push({name:"GreaterFilter",label:RV_RES.IDS_JS_FILTER_GREATER_THAN+" "+_3b9,iconClass:"",action:{name:"Filter",payload:{type:"greaterThan",formattedNumber:_3b9}},items:null});
}
}else{
if(_3b7==2){
if(_3b6[0].getUseValues()[0][0]&&_3b6[1].getUseValues()[0][0]){
var _3ba=this.getItemLabel(_3b6[0]);
var _3bb=this.getItemLabel(_3b6[1]);
_3b4.push({name:"BetweenFilter",label:CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_BETWEEN,[_3ba,_3bb]),iconClass:"",action:{name:"Filter",payload:{type:"between",formattedNumber:_3ba,formattedEndNumber:_3bb}},items:null});
_3b4.push({name:"NotBetweenFilter",label:CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_NOT_BETWEEN,[_3ba,_3bb]),iconClass:"",action:{name:"Filter",payload:{type:"notBetween",formattedNumber:_3ba,formattedEndNumber:_3bb}},items:null});
}
}else{
return false;
}
}
}else{
var _3bc=_3b3.getDataContainerType();
if(_3bc=="crosstab"&&_3b6[0].getLayoutType()=="columnTitle"){
if(this.isSelectSingleMember(_3b6[0])==true){
return false;
}
}
_3b4.push({name:"InFilter",label:CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_INCLUDE,enforceTextDir(_3b9)),iconClass:"",action:{name:"Filter",payload:"in"},items:null});
_3b4.push({name:"NotInFilter",label:CViewerCommon.getMessage(RV_RES.IDS_JS_FILTER_EXCLUDE,enforceTextDir(_3b9)),iconClass:"",action:{name:"Filter",payload:"not"},items:null});
}
}
return true;
};
FilterAction.prototype.isRemoveAllValid=function(){
var _3bd=this.m_oCV.getRAPReportInfo();
if(_3bd){
return _3bd.containsFilters();
}
return false;
};
FilterAction.prototype.isRemoveItemFilterValid=function(_3be){
var _3bf=this.getContainerId(this.m_oCV.getSelectionController());
var _3c0=this.m_oCV.getRAPReportInfo();
if(_3bf!=null&&_3c0){
var _3c1=_3c0.getFilterObjectFromContainer(_3bf,_3be,false);
return _3c1?true:false;
}
return false;
};
FilterAction.prototype.isSelectionFilterable=function(){
var _3c2=this.m_oCV.getSelectionController();
var _3c3=_3c2.getAllSelectedObjects();
if(_3c3.length>0){
var _3c4=_3c3[0].getCellRef();
if(_3c4&&_3c4.getAttribute&&_3c4.getAttribute("no_data_item_column")==="true"){
return false;
}
if(_3c2.hasSelectedChartNodes()){
var _3c5=false;
if(_3c2.selectionsAreDateTime()||(_3c2.selectionsHaveCalculationMetadata()&&!_3c2.selectionsNonMeasureWithMUN())){
_3c5=true;
}
for(var sel=0;sel<_3c3.length;++sel){
if(_3c3[sel].getLayoutType()){
if(_3c3[sel].getLayoutType().match("Title$")=="Title"){
return false;
}
if(_3c5&&_3c3[sel].getLayoutType().match("Label$")=="Label"){
return false;
}
}
}
}
}
return true;
};
function GetFilterInfoAction(){
this.m_requestParms=null;
};
GetFilterInfoAction.prototype=new ModifyReportAction();
GetFilterInfoAction.prototype.isUndoable=function(){
return false;
};
GetFilterInfoAction.prototype.canBeQueued=function(){
return true;
};
GetFilterInfoAction.prototype.setRequestParms=function(_3c7){
this.m_requestParms=_3c7;
};
GetFilterInfoAction.prototype.runReport=function(){
return false;
};
GetFilterInfoAction.prototype.updateInfoBar=function(){
return false;
};
GetFilterInfoAction.prototype.fireModifiedReportEvent=function(){
};
GetFilterInfoAction.prototype.buildActionContextAdditionalParmsXML=function(){
var _3c8=XMLBuilderCreateXMLDocument("item");
var _3c9=_3c8.documentElement;
for(var parm in this.m_requestParms){
if(this.m_requestParms.hasOwnProperty(parm)){
var _3cb=_3c8.createElement(parm);
_3cb.appendChild(_3c8.createTextNode(this.m_requestParms[parm]));
_3c9.appendChild(_3cb);
}
}
return _3c8;
};
GetFilterInfoAction.prototype.addActionContextAdditionalParms=function(){
if(this.m_requestParms===null){
return "";
}
return XMLBuilderSerializeNode(this.buildActionContextAdditionalParmsXML());
};
GetFilterInfoAction.prototype.createFilterInfoDispatcherEntry=function(){
var _3cc=new ReportInfoDispatcherEntry(this.m_oCV);
_3cc.initializeAction(this);
return _3cc;
};
GetFilterInfoAction.prototype.execute=function(){
this.getCognosViewer().setKeepFocus(this.keepFocusOnWidget());
var _3cd=this.createFilterInfoDispatcherEntry();
this.m_oCV.dispatchRequest(_3cd);
this.fireModifiedReportEvent();
};
GetFilterInfoAction.prototype.getOnPromptingCallback=function(){
return this.getOnCompleteCallback();
};
function GetFilterValuesAction(){
this.m_sAction="CollectFilterValues";
this.m_sRetryClass="GetFilterValues";
};
GetFilterValuesAction.prototype=new GetFilterInfoAction();
GetFilterValuesAction.prototype.addActionContextAdditionalParms=function(){
if(this.m_requestParms===null){
return "";
}
var _3ce=this.buildActionContextAdditionalParmsXML();
var _3cf=_3ce.documentElement;
for(var parm in this.m_requestParms){
if(parm=="name"){
var _3d1=this.m_oCV.getSelectionController();
if(typeof _3d1!="undefined"&&typeof _3d1.getCCDManager()!="undefined"){
var _3d2=_3d1.getCCDManager().GetPageMinMaxForRDI(this.m_requestParms[parm]);
if(typeof _3d2!="undefined"){
var _3d3=_3ce.createElement("pageMin");
_3d3.appendChild(_3ce.createTextNode(_3d2.pageMin));
var _3d4=_3ce.createElement("pageMax");
_3d4.appendChild(_3ce.createTextNode(_3d2.pageMax));
_3cf.appendChild(_3d3);
_3cf.appendChild(_3d4);
}
if(this.m_oCV.isSinglePageReport()==true){
var _3d5=_3ce.createElement("singlePageReport");
_3cf.appendChild(_3d5);
}
}
break;
}
}
var _3d6=XMLBuilderSerializeNode(_3ce);
return (_3d6+this.addClientContextData(3));
};
GetFilterValuesAction.prototype.getOnCompleteCallback=function(){
var _3d7=this.getCognosViewer();
var _3d8=_3d7.getViewerWidget();
var _3d9=this.m_requestParms;
var _3da=function(_3db){
_3d8.handleGetFilterValuesResponse(_3db,_3d9);
};
return _3da;
};
GetFilterValuesAction.prototype.canBeQueued=function(){
return true;
};
GetFilterValuesAction.prototype.getActionKey=function(){
if(typeof this.m_requestParms!="undefined"&&typeof this.m_requestParms.source!="undefined"){
return this.m_sAction+this.m_requestParms.source;
}
return null;
};
function GetFilterableItemsAction(){
this.m_sAction="CollectFilterableItems";
};
GetFilterableItemsAction.prototype=new GetFilterInfoAction();
GetFilterableItemsAction.prototype.addActionContextAdditionalParms=function(){
return this.addClientContextData(3);
};
GetFilterableItemsAction.prototype.getOnCompleteCallback=function(){
var _3dc=this.getCognosViewer();
var _3dd=_3dc.getViewerWidget();
var _3de=function(_3df){
_3dd.handleGetFilterableItemsResponse(_3df);
};
return _3de;
};
function UpdateDataFilterAction(){
this.m_sAction="UpdateDataFilter";
this.m_bForceRunSpec=false;
};
UpdateDataFilterAction.prototype=new ModifyReportAction();
UpdateDataFilterAction.prototype.runReport=function(){
return this.getViewerWidget().shouldReportBeRunOnAction();
};
UpdateDataFilterAction.prototype.getActionKey=function(){
if(typeof this.m_requestParams!="undefined"){
try{
var _3e0=eval("("+this.m_requestParams+")");
if(_3e0.clientId!==null){
return this.m_sAction+_3e0.clientId;
}
}
catch(e){
}
}
return null;
};
UpdateDataFilterAction.prototype.canBeQueued=function(){
return true;
};
UpdateDataFilterAction.prototype.keepFocusOnWidget=function(){
return false;
};
UpdateDataFilterAction.prototype.isUndoable=function(){
return false;
};
UpdateDataFilterAction.prototype.setRequestParms=function(_3e1){
this.m_requestParams=_3e1.filterPayload;
this.m_drillResetHUN=_3e1.drillResetHUN;
this.m_isFacet=_3e1.isFacet;
if(_3e1.forceCleanup){
this.m_sForceCleanup=_3e1.forceCleanup;
}
};
UpdateDataFilterAction.prototype.forceRunSpecRequest=function(){
return this.m_bForceRunSpec;
};
UpdateDataFilterAction.prototype.preProcessContextValues=function(){
var _3e2=[];
var _3e3=dojo.fromJson(this.m_requestParams);
if(_3e3&&_3e3["com.ibm.widget.context"]&&(_3e3["com.ibm.widget.context"]["values"]||_3e3["com.ibm.widget.context"]["ranges"])){
var _3e4=this.m_oCV.m_RAPReportInfo;
var _3e5=_3e4.getContainers();
if(!_3e5){
_3e2;
}
var key="";
var _3e7="";
if(_3e3["com.ibm.widget.context"]["values"]){
key="values";
_3e7=_3e3["com.ibm.widget.context"]["values"];
}else{
key="ranges";
_3e7=_3e3["com.ibm.widget.context"]["ranges"];
}
var _3e8=_3e4.collectSliderSetFromReportInfo();
for(dataItem in _3e7){
if(_3e4&&_3e4.isReferenced(dataItem)){
var _3e9=dojo.clone(_3e3);
var _3ea={};
_3ea[dataItem]=_3e3["com.ibm.widget.context"][key][dataItem];
_3e9["com.ibm.widget.context"][key]=_3ea;
if(_3e3["com.ibm.widget.context.bux.selectValueControl"]&&_3e3["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]&&_3e3["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"]){
var _3eb={};
_3e9["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"]={};
var _3ec=document.forms["formWarpRequest"+this.m_oCV.getId()].packageBase.value;
for(modelItem in _3e3["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"]){
if(modelItem.indexOf(_3ec)!=-1){
_3eb[dataItem]=_3e3["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"][modelItem][dataItem];
if(_3eb[dataItem]){
_3e9["com.ibm.widget.context.bux.selectValueControl"]["selectValueControl"]["itemSpecification"][modelItem]=_3eb;
break;
}
}
}
}
var _3ed=_3e7[dataItem]&&key!=="ranges"?_3e7[dataItem].length:0;
if(this.checkIfFilterExpressionChanged(dataItem,_3e3.clientId,_3ed,_3e8)){
this.m_bForceRunSpec=true;
}
_3e2.push(dojo.toJson(_3e9));
}
}
}else{
_3e2.push(dojo.toJson(_3e3));
}
return _3e2;
};
UpdateDataFilterAction.prototype.checkIfFilterExpressionChanged=function(_3ee,_3ef,_3f0,_3f1){
if(!_3f1||!_3f1[_3ef]||_3f1[_3ef].name!=_3ee){
return true;
}
var _3f2=_3f1[_3ef].values?_3f1[_3ef].values.length:0;
if(_3f0==_3f2){
return false;
}
return (_3f0===1)!==(_3f2===1);
};
UpdateDataFilterAction.prototype.addActionContext=function(){
var _3f3="<reportActions";
var _3f4="";
if(!this.runReport()){
_3f3+=" run=\"false\"";
_3f4="<inlineValues/>";
}
_3f3+=">";
if(this.m_drillResetHUN&&this.m_drillResetHUN.length>0){
_3f3+=this._getDrillResetActionContext();
}
if(this.m_sForceCleanup){
_3f3+="<reportAction name=\""+this.m_sAction+"\">"+dojo.toJson(this.m_sForceCleanup)+"</reportAction>";
}
var _3f5;
var _3f6=(this.m_requestParams.charAt(0)==="<");
if(this.m_isFacet||_3f6){
_3f5=[this.m_requestParams];
}else{
_3f5=this.preProcessContextValues();
}
for(var idx=0;idx<_3f5.length;++idx){
var _3f8=_3f5[idx];
_3f3+="<reportAction name=\""+this.m_sAction+"\">"+_3f4;
_3f3+=(_3f6)?_3f8:xml_encode(_3f8);
if(idx>0){
_3f3+="<augment>true</augment>";
}
if(!this.m_isFacet){
_3f3+=this.addClientContextData(3);
}
_3f3+="</reportAction>";
_3f3+="<reportAction name=\"GetInfo\"><include><sliders/></include>";
_3f3+="</reportAction>";
}
_3f3+="</reportActions>";
return _3f3;
};
UpdateDataFilterAction.prototype._getDrillResetActionContext=function(){
var _3f9=new DrillResetAction();
_3f9.setCognosViewer(this.getCognosViewer());
var _3fa={drilledResetHUNs:this.m_drillResetHUN};
_3f9.setRequestParms(_3fa);
_3f9.setUpdateInfoBar(false);
var _3fb=_3f9.getReportActionContext();
return _3fb;
};
function CognosViewerSort(_3fc,oCV){
this.m_oCV=oCV;
if(_3fc){
this.m_oEvent=_3fc;
this.m_oNode=getCrossBrowserNode(_3fc,true);
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
var _3ff=getCognosViewerSCObjectRef(this.m_oCV.getId());
_3ff.selectSingleDomNode(this.m_oNode.parentNode);
var _400=this.getSortAction();
_400.setCognosViewer(this.m_oCV);
_400.execute();
if(window.gViewerLogger){
window.gViewerLogger.addContextInfo(_3ff);
}
};
CognosViewerSort.prototype.getSortAction=function(){
var _401=this.m_oCV.getAction("Sort");
var _402=this.m_oNode.getAttribute("sortOrder");
if(_402.indexOf("nosort")!=-1){
_401.setRequestParms({order:"ascending",type:"value"});
}else{
if(_402.indexOf("ascending")!=-1){
_401.setRequestParms({order:"descending",type:"value"});
}else{
if(_402.indexOf("descending")!=-1){
_401.setRequestParms({order:"none",type:"value"});
}
}
}
return _401;
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
var _403=this.getCurrentSortFromSelection();
if(this.m_sortType==="value"&&_403.indexOf("sortByValue")===-1){
return false;
}else{
if(this.m_sortType==="label"&&_403.indexOf("sortByLabel")===-1){
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
SortAction.prototype.setRequestParms=function(_404){
this.m_sortOrder=_404.order;
this.m_sortType=_404.type;
if(_404.id!=null&&typeof _404.id!="undefined"){
this.m_sId=_404.id;
}
if(_404.item!=null&&typeof _404.item!="undefined"){
this.m_sItem=_404.item;
}
};
SortAction.prototype.addActionContextAdditionalParms=function(){
var _405=this.m_oCV.getSelectionController();
var _406="<order>"+this.m_sortOrder+"</order>";
if(this.m_sortType=="label"){
_406+="<byLabel/>";
}
if(this.getContainerId(_405)==""&&this.m_sId!=null&&typeof this.m_sId!="undefined"&&this.m_sId!=""){
_406+=("<id>"+xml_encode(this.m_sId)+"</id>");
}
if(this.m_sItem!=null&&typeof this.m_sItem!="undefined"&&this.m_sItem!=""){
_406+=("<item>"+xml_encode(this.m_sItem)+"</item>");
}
_406+=this.addClientContextData(3);
_406+=this.getSelectedCellTags();
return _406;
};
SortAction.prototype.toggleMenu=function(_407,_408){
if(_408){
_407.iconClass="sort";
_407.disabled=false;
}else{
_407.iconClass="sortDisabled";
_407.disabled=true;
}
return _407;
};
SortAction.prototype.updateMenu=function(_409){
_409.visible=this.ifContainsInteractiveDataContainer();
if(!_409.visible){
return _409;
}
this.buildMenu(_409);
if(_409.disabled==true){
return this.toggleMenu(_409,false);
}
return this.buildDynamicMenuItem(this.toggleMenu(_409,true),"Sort");
};
SortAction.prototype.buildSelectedItemsString=function(_40a,_40b,_40c){
try{
var _40d=_40a[_40a.length-1];
if(_40b){
var _40e=_40d.getDisplayValues()[0];
if(typeof _40e=="undefined"){
_40e=_40d.getUseValues()[0][0];
}
return _40e;
}else{
return _40d.getDataItemDisplayValue(_40c);
}
}
catch(e){
if(console&&console.log){
console.log(e);
}
}
};
SortAction.prototype.buildMenu=function(_40f){
_40f.visible=this.ifContainsInteractiveDataContainer();
if(!_40f.visible){
return _40f;
}
if(!this.isSelectionSortable()){
return this.toggleMenu(_40f,false);
}
_40f=this.toggleMenu(_40f,true);
var _410=[];
var _411=this.m_oCV.getSelectionController();
var _412=_411.getAllSelectedObjects();
if(_412.length==1&&_412[0].isHomeCell()==false){
var _413=_411.getDataContainerType();
var _414=this.getContainerId(_411);
var _415=this.getReportInfo(_414);
if(_413==""&&!this.isSelectionOnChart()&&_412[0].getLayoutType()=="section"){
if(_415!=null){
_413=_415.displayTypeId;
}
}
var _416,_417,_418;
var _419=this.getCurrentSortFromSelection();
var _41a=this.isSelectionOnChart();
var _41b=_419.indexOf("sortByValue")!=-1;
var _41c=_419.indexOf("sortByValueAscending")!=-1;
var _41d=_419.indexOf("sortByValueDescending")!=-1;
var _41e=this.m_oCV.isIWidgetMobile();
if(_413=="list"){
var _41f={name:"SortAscending",label:RV_RES.IDS_JS_SORT_ASCENDING,action:{name:"Sort",payload:{order:"ascending",type:"value"}},items:null};
this.addMenuItemChecked(_41c,_41f,"sortAscending");
_410.push(_41f);
var _420={name:"SortDescending",label:RV_RES.IDS_JS_SORT_DESCENDING,action:{name:"Sort",payload:{order:"descending",type:"value"}},items:null};
this.addMenuItemChecked(_41d,_420,"sortDescending");
_410.push(_420);
var _421={name:"DontSort",label:RV_RES.IDS_JS_DONT_SORT,action:{name:"Sort",payload:{order:"none",type:"value"}},items:null};
this.addMenuItemChecked(!_41b,_421,"sortNone");
_410.push(_421);
}else{
if(_413=="crosstab"||_41a){
if(_412[0].getLayoutType()=="columnTitle"||_41a){
_416=this.m_oCV.getRAPReportInfo();
if(this.canSortByValueOnCrosstab(_412[0],_416)){
_417=RV_RES.IDS_JS_SORT_BY_VALUE;
if(_41a){
_418=this.buildSelectedItemsString(_412,true,_415);
if(typeof _418!=="undefined"){
_417+=":"+_418;
}
}
var _422={name:"SortByValue",label:_417,action:null,items:[{name:"Ascending",label:RV_RES.IDS_JS_SORT_BY_ASCENDING,action:{name:"Sort",payload:{order:"ascending",type:"value"}},items:null},{name:"Descending",label:RV_RES.IDS_JS_SORT_BY_DESCENDING,action:{name:"Sort",payload:{order:"descending",type:"value"}},items:null},{name:"SortNone",label:RV_RES.IDS_JS_DONT_SORT,action:{name:"Sort",payload:{order:"none",type:"value"}},items:null}]};
this.addMenuItemChecked(_41b,_422);
this.addMenuItemChecked(_41c,_422.items[0],"sortAscending");
this.addMenuItemChecked(_41d,_422.items[1],"sortDescending");
this.addMenuItemChecked(!_41b,_422.items[2],"sortNone");
if(_41e){
_422.flatten=true;
}
_410.push(_422);
}
if(this.canSortByLabelOnCrosstab(_412[0])){
_417=RV_RES.IDS_JS_SORT_BY_LABEL;
if(_41a){
_418=this.buildSelectedItemsString(_412,false,_415);
if(typeof _418!=="undefined"){
_417+=":"+_418;
}
}
var _423={name:"SortByLabel",label:_417,action:null,items:[{name:"Ascending",label:RV_RES.IDS_JS_SORT_BY_ASCENDING,action:{name:"Sort",payload:{order:"ascending",type:"label"}},items:null},{name:"Descending",label:RV_RES.IDS_JS_SORT_BY_DESCENDING,action:{name:"Sort",payload:{order:"descending",type:"label"}},items:null},{name:"SortNone",label:RV_RES.IDS_JS_DONT_SORT,action:{name:"Sort",payload:{order:"none",type:"label"}},items:null}]};
var _424=_419.indexOf("sortByLabel")!=-1;
this.addMenuItemChecked(_424,_423);
this.addMenuItemChecked(_419.indexOf("sortByLabelAscending")!=-1,_423.items[0],"sortAscending");
this.addMenuItemChecked(_419.indexOf("sortByLabelDescending")!=-1,_423.items[1],"sortDescending");
this.addMenuItemChecked(!_424,_423.items[2],"sortNone");
if(_41e){
_423.flatten=true;
}
_410.push(_423);
}
}
}
}
}
if(_410.length==0){
this.toggleMenu(_40f,false);
}else{
if(_41e){
if(_413=="crosstab"||_41a){
_40f.useChildrenItems=true;
}else{
_40f.flatten=true;
}
}
_40f.items=_410;
this.toggleMenu(_40f,true);
}
return _40f;
};
SortAction.prototype.isSelectionSortable=function(){
var _425=this.m_oCV.getSelectionController();
var _426=_425.getAllSelectedObjects();
if(_426.length==1){
var _427=_426[0];
if(_425.getDataContainerType()=="crosstab"&&_427.getLayoutType()=="datavalue"){
return false;
}
if(_425.hasSelectedChartNodes()){
var node=_427.getArea();
if(node.nodeName=="AREA"||node.nodeName=="IMG"){
return _426[0].getLayoutType()=="ordinalAxisLabel"||_426[0].getLayoutType()=="legendLabel";
}
}else{
var data=_427.getDataItems();
if(_427.getCellRef().getAttribute("type")=="datavalue"&&!(data&&data.length)){
return false;
}
var _42a=_427.getCellRef();
if(_42a.getAttribute("no_data_item_column")==="true"){
return false;
}
if(_42a.getAttribute("canSort")!="false"){
return true;
}
}
}
return false;
};
SortAction.prototype.getCurrentSortFromSelection=function(){
var _42b=this.getContainerId(this.m_oCV.getSelectionController());
var _42c=this.m_oCV.getRAPReportInfo();
var _42d="";
if(_42b!=""&&_42c){
var _42e=_42c.getContainer(_42b);
if(typeof _42e.sort!="undefined"){
var _42f=this.m_oCV.getSelectionController();
var _430=_42f.getAllSelectedObjects();
if(_430.length==1){
var _431=_430[0].getDataItems();
if(_431.length<1){
return _42d;
}
var _432=_431[0][0];
for(var _433=0;_433<_42e.sort.length;++_433){
var _434=_42e.sort[_433];
if(typeof _434.labels=="string"&&_434.labels==_432){
_42d+=_434.order=="descending"?"sortByLabelDescending":"sortByLabelAscending";
}
if(typeof _434.valuesOf=="string"&&(_434.valuesOf==_432||this.isSortedValueOnRenamedColumn(_430[0],_434))){
_42d+=_434.order=="descending"?"sortByValueDescending":"sortByValueAscending";
}else{
if(_434.valuesOf instanceof Array){
var _435=true;
for(var _436=0;_436<_434.valuesOf.length;++_436){
if(_436<_430[0].m_contextIds[0].length){
var ctx=_430[0].m_contextIds[0][_436];
var _438=_42f.getDisplayValue(ctx);
var _439=this.findItemLabel(_42e,_434.valuesOf[_436].item);
if(_439!=_438){
_435=false;
break;
}
}
}
if(_435){
_42d+=_434.valuesOf[0].order=="descending"?"sortByValueDescending":"sortByValueAscending";
}
}
}
}
}
}
}
return _42d;
};
SortAction.prototype.isSortedValueOnRenamedColumn=function(_43a,_43b){
if(_43b&&_43a){
return (_43b.valuesOf===_43a.getColumnRP_Name()&&_43a.getLayoutType()==="columnTitle");
}
};
SortAction.prototype.findItemLabel=function(_43c,item){
var _43e=_43c.itemInfo;
if(_43e){
for(var i=0;i<_43e.length;i++){
if(_43e[i].item===item){
if(_43e[i].itemLabel){
return _43e[i].itemLabel;
}
break;
}
}
}
return item;
};
SortAction.prototype.canSortByValueOnCrosstab=function(_440,_441){
var _442=this.m_oCV.getSelectionController();
var _443=this.getContainerId(this.m_oCV.getSelectionController());
if(_442.isRelational()==true){
return false;
}
if(_442.selectionsHaveCalculationMetadata()&&this.selectedObjectIsLeaf(_443,_440,_441)){
var _444=_440.getMuns()[0];
for(var _445=0;_445<_444.length;++_445){
if(_444[_445]!=null&&_444[_445].indexOf("uuid:")>=0){
return false;
}
}
return true;
}
return false;
};
SortAction.prototype.selectedObjectIsLeaf=function(_446,_447,_448){
if(_448){
var _449=_447.getDataItems();
if(_449!=null&&typeof _449!="undefined"&&_449.length>0){
var _44a=_448.getDrillability(_446,_449[0][0]);
if(_44a){
return _44a.leaf==true;
}
}
}
return false;
};
SortAction.prototype.canSortByLabelOnCrosstab=function(_44b){
var _44c=this.m_oCV.getSelectionController();
var _44d=_44c.getAllSelectedObjects();
if(_44d.length==1){
var _44b=_44d[0];
if(this.isSelectSingleMember(_44b)==false){
if(_44c.selectionsNonMeasureWithMUN()||!_44c.selectionsHaveCalculationMetadata()){
return true;
}
}
}
return false;
};
function RedrawAction(){
this.m_specUpdated=false;
};
RedrawAction.prototype=new ModifyReportAction();
RedrawAction.prototype.reuseQuery=function(){
return true;
};
RedrawAction.prototype.keepRAPCache=function(){
return false;
};
RedrawAction.prototype.setSpecUpdated=function(flag){
this.m_specUpdated=flag;
};
RedrawAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_ADVANCED_EDITING;
};
RedrawAction.prototype.addActionContext=function(){
if(this.m_specUpdated){
return "<reportActions><GetInfo><specUpdatedInBUA/></GetInfo></reportActions>";
}
return "<reportActions><GetInfo/></reportActions>";
};
function EditContentAction(){
this._oMissingMemberRecoveryMode=null;
};
EditContentAction.prototype=new CognosViewerAction();
EditContentAction.superclass=CognosViewerAction.prototype;
EditContentAction.prototype.execute=function(){
if(typeof this.preferencesChanged!="undefined"&&this.preferencesChanged!==null&&this.preferencesChanged===true){
this.deleteCWAContainer();
return;
}
window.CVEditContentActionInstance=this;
var _44f=window.viewerCWAContainer?true:false;
if(!window.viewerCWAContainer){
this.createCWAContainer();
}
this.addWindowEventListeners();
this.buildBUAObjects();
window.viewerCWAContainer.show();
if(_44f){
window.BUAEvent("appReady");
}
};
EditContentAction.prototype.createCWAContainer=function(){
this.deleteCWAContainer();
var _450=this.createCWAIFrame();
var _451=this.createBlocker();
window.viewerCWAContainer={"type":"iframe","containerDiv":_450,"blocker":_451,"iframePadding":"18","show":function(){
this.resize();
this.containerDiv.style.display="block";
this.blocker.style.display="block";
},"hide":function(){
this.blocker.style.display="none";
this.containerDiv.style.display="none";
},"resize":function(){
var _452=dojo.window.getBox();
this.containerDiv.style.height=_452.h-this.iframePadding+"px";
this.containerDiv.style.width=_452.w-this.iframePadding+"px";
}};
};
EditContentAction.prototype.deleteCWAContainer=function(){
var _453=window.viewerCWAContainer;
if(_453){
_453.hide();
document.body.removeChild(_453.containerDiv);
document.body.removeChild(_453.blocker);
delete window.viewerCWAContainer;
window.viewerCWAContainer=null;
}
};
EditContentAction.prototype.hideCWAContainer=function(){
this.removeWindowEventListeners();
if(window.viewerCWAContainer){
window.viewerCWAContainer.hide();
}
window.CVEditContentActionInstance=null;
};
EditContentAction.prototype.createCWAIFrame=function(){
var _454=document.createElement("div");
_454.className="buaContainer";
document.body.appendChild(_454);
var _455=document.createElement("iframe");
_455.setAttribute("id","buaIframe");
_455.setAttribute("src",this.getWebContent()+"/pat/rsapp.htm");
_455.setAttribute("name","buaIframe");
_455.setAttribute("frameborder","0");
_455.className="buaIframe";
_454.appendChild(_455);
return _454;
};
EditContentAction.prototype.createBlocker=function(){
var _456=document.createElement("div");
_456.setAttribute("id","reportBlocker");
_456.setAttribute("name","reportBlocker");
_456.setAttribute("tabIndex","1");
_456.className="reportBlocker";
document.body.appendChild(_456);
return _456;
};
EditContentAction.prototype.buildBUAObjects=function(){
window.RSParameters={"rs_UIProfile":"BUA","ui.action":"edit","gateway":location.protocol+"//"+location.host+this.getGateway(),"theme":"corporate","capabilitiesXML":this.getCapabilitiesXml(),"cafcontextid":this.getCafContextId(),"paneOnRight":this.getViewerIWidget().getPaneOnRight()};
var _457=this.getViewerIWidget();
if(_457!==null){
var _458=_457.getAttributeValue("gateway");
if(_458){
window.RSParameters["cv.gateway"]=_458;
}
var _459=_457.getAttributeValue("webcontent");
if(_459){
window.RSParameters["cv.webcontent"]=_459;
}
}
this.addExtraLaunchParameters(window.RSParameters);
};
EditContentAction.prototype.getBUAIframe=function(){
return document.getElementById("buaIframe");
};
EditContentAction.prototype.getBUAWindow=function(){
var _45a=null;
var _45b=this.getBUAIframe();
if(_45b!==null){
_45a=_45b.contentWindow;
}
return _45a;
};
EditContentAction.prototype.setReportSettings=function(){
var oCV=this.getCognosViewer();
var _45d=oCV.getViewerWidget();
_45d.fireEvent("com.ibm.bux.widget.getDisplayTitle",null,{callback:function(_45e){
window.CVEditContentActionInstance.openReportWithBUA(_45e);
}});
};
EditContentAction.prototype.openReportWithBUA=function(_45f){
var _460=this.m_oCV.envParams["ui.spec"].indexOf("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
if(_460==-1){
_460=0;
}else{
_460="<?xml version=\"1.0\" encoding=\"UTF-8\"?>".length;
}
var _461=this.m_oCV.envParams["ui.spec"].substr(_460,this.m_oCV.envParams["ui.spec"].length);
var _462={"displayName":xml_decode(_45f),"parameterValues":this.m_oCV.getExecutionParameters(),"reportXML":_461,"showOpenTransition":false};
if(this.ifPassTrackingtoBUA()){
_462.tracking=this.m_oCV.getTracking();
}
var _463=this.getBUAWindow();
_463.Application.SetBUAContext(_462);
};
EditContentAction.prototype.getViewerIWidget=function(){
return this.m_oCV.getViewerWidget();
};
EditContentAction.prototype.getGateway=function(){
return this.m_oCV.getGateway();
};
EditContentAction.prototype.getCapabilitiesXml=function(){
return this.m_oCV.capabilitiesXML;
};
EditContentAction.prototype.getCafContextId=function(){
return typeof this.m_oCV.cafContextId!="undefined"?this.m_oCV.cafContextId:"";
};
EditContentAction.prototype.getWebContent=function(){
return this.getCognosViewer().getWebContentRoot();
};
EditContentAction.prototype.addExtraLaunchParameters=function(_464){
};
EditContentAction.prototype.runUpdatedReportFromBUA=function(){
var _465=this.getBUAWindow();
var _466=this.m_oCV.envParams["ui.spec"];
var _467=_465.Application.GetBUAContext();
if(_467.isSpecModified){
this.m_oCV.envParams["ui.spec"]=_467.reportXML;
this.m_oCV.setTracking(_467.tracking);
this.m_oCV.setExecutionParameters(_467.parameterValues);
this._invokeRedrawAction(_466);
}
};
EditContentAction.prototype._invokeRedrawAction=function(_468){
this.getUndoRedoQueue().setOriginalSpec(_468);
var _469=this.m_oCV.getAction("Redraw");
_469.setSpecUpdated(true);
this.m_oCV.getViewerWidget().setPromptParametersRetrieved(false);
_469.execute();
};
EditContentAction.prototype.ifPassTrackingtoBUA=function(){
if(this.m_oCV.getRAPReportInfo()){
return this.m_oCV.getRAPReportInfo().getPassTrackingtoBUA();
}
return true;
};
EditContentAction.prototype.setRequestParms=function(_46a){
EditContentAction.superclass.setRequestParms(_46a);
if(_46a){
if(_46a.preferencesChanged){
this.preferencesChanged=_46a.preferencesChanged;
}
if(_46a.MissingMemberRecoveryMode){
this._oMissingMemberRecoveryMode=_46a.MissingMemberRecoveryMode;
}
}
};
EditContentAction.prototype.runUpdatedReportFromBUA_MissingMemberRecoveryMode=function(){
var _46b=this.getBUAWindow();
var _46c=this.m_oCV.envParams["ui.spec"];
var _46d=_46b.Application.GetBUAContext();
this.m_oCV.setTracking(_46d.tracking);
this.m_oCV.envParams["ui.spec"]=_46d.reportXML;
this.m_oCV.setExecutionParameters(_46d.parameterValues);
if(this._oMissingMemberRecoveryMode&&this._oMissingMemberRecoveryMode.oFaultDialog){
this._oMissingMemberRecoveryMode.oFaultDialog.hide();
}
this._invokeRedrawAction(_46c);
};
EditContentAction.prototype.cancelPressed=function(){
};
EditContentAction.prototype.addWindowEventListeners=function(){
if(window.attachEvent){
window.attachEvent("onresize",window.CVEditContentActionInstance.onWindowResize);
}else{
window.addEventListener("resize",window.CVEditContentActionInstance.onWindowResize,false);
}
};
EditContentAction.prototype.removeWindowEventListeners=function(){
if(window.detachEvent){
window.detachEvent("onresize",window.CVEditContentActionInstance.onWindowResize);
}else{
window.removeEventListener("resize",window.CVEditContentActionInstance.onWindowResize,false);
}
};
EditContentAction.prototype.onWindowResize=function(){
var _46e=window.viewerCWAContainer;
if(_46e){
_46e.resize();
}
};
function BUAEvent(_46f){
var _470=window.CVEditContentActionInstance;
switch(_46f){
case "appReady":
_470.setReportSettings();
break;
case "donePressed":
_470.hideCWAContainer();
if(_470._oMissingMemberRecoveryMode){
_470.runUpdatedReportFromBUA_MissingMemberRecoveryMode();
}else{
_470.runUpdatedReportFromBUA();
}
break;
case "cancelPressed":
_470.cancelPressed();
_470.hideCWAContainer();
break;
}
};
function NewReportAction(){
this._viewerIWidget=null;
this._packageSearchPath=null;
this._webContentRoot=null;
this._gateway=null;
this._capabilitiesXml=null;
this._cafContextId=null;
};
NewReportAction.prototype=new EditContentAction();
NewReportAction.prototype.parent=EditContentAction.prototype;
NewReportAction.prototype.clearSelections=function(){
};
NewReportAction.prototype.getCognosViewer=function(){
return this.getViewerIWidget().getViewerObject();
};
NewReportAction.prototype.setRequestParms=function(_471){
this.parent.setRequestParms.call(this,_471);
this._packageSearchPath=_471.packageSearchPath;
this._viewerIWidget=_471.viewerIWidget;
this._webContentRoot=_471.webContentRoot;
this._gateway=_471.gateway;
this._capabilitiesXml=_471.capabilitiesXml;
this._cafContextId=_471.cafContextId;
};
NewReportAction.prototype.getViewerIWidget=function(){
return this._viewerIWidget;
};
NewReportAction.prototype.getGateway=function(){
return this._gateway;
};
NewReportAction.prototype.getCapabilitiesXml=function(){
return this._capabilitiesXml;
};
NewReportAction.prototype.getCafContextId=function(){
return this._cafContextId?this._cafContextId:"";
};
NewReportAction.prototype.getWebContent=function(){
return this._webContentRoot;
};
NewReportAction.prototype.setReportSettings=function(){
var _472={"showOpenTransition":false,"model":this._packageSearchPath};
var _473=this.getBUAWindow();
_473.Application.SetBUAContext(_472);
};
NewReportAction.prototype.addExtraLaunchParameters=function(_474){
_474.model=this._packageSearchPath;
};
NewReportAction.prototype.cancelPressed=function(){
this.getViewerIWidget().iContext.iEvents.fireEvent("com.ibm.bux.widget.action",null,{action:"deleteWidget"});
};
NewReportAction.prototype.runUpdatedReportFromBUA=function(){
var _475=this.getViewerIWidget();
_475.setAttributeValue("reportCreatedInCW","true");
var _476=this.getBUAWindow().Application.GetBUAContext();
_475.setNewReportInfo({"ui.spec":_476.reportXML,"m_tracking":_476.tracking?_476.tracking:"","parameterValues":_476.parameterValues?_476.parameterValues:""});
_475.onLoad();
};
function AuthoredDrillAction(){
this.m_drillTargetSpecification="";
};
AuthoredDrillAction.prototype=new CognosViewerAction();
AuthoredDrillAction.prototype.setRequestParms=function(_477){
this.m_drillTargetSpecification=_477;
};
AuthoredDrillAction.prototype.executeDrillTarget=function(_478){
var _479=XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(_478));
var _47a=encodeURIComponent(_479.getAttribute("bookmarkRef"));
var _47b=_479.getAttribute("path");
var _47c=this._shouldShowInNewWindow(_479);
var oCV=this.getCognosViewer();
if((_47a!==null&&_47a!=="")&&(_47b===null||_47b==="")){
var _47e=_479.getAttribute("bookmarkPage");
if(_47e&&_47e!==""){
oCV.executeAction("GotoPage",{"pageNumber":_47e,"anchorName":_47a});
}else{
document.location="#"+_47a;
}
}else{
var _47f="";
if(_47c){
_47f="_blank";
}
var _480=[];
var _481=[];
_481.push("obj");
_481.push(_47b);
_480[_480.length]=_481;
var _482=false;
var _483,_484,_485,_486,sNil;
var _488=XMLHelper_FindChildrenByTagName(_479,"drillParameter",false);
for(var _489=0;_489<_488.length;++_489){
_483=[];
_484=_488[_489];
_485=_484.getAttribute("value");
_486=_484.getAttribute("name");
if(_485!==null&&_485!==""){
_483.push("p_"+_486);
_483.push(this.buildSelectionChoicesSpecification(_484));
}
sNil=_484.getAttribute("nil");
if(sNil!==null&&sNil!==""){
_483.push("p_"+_486);
_483.push(this.buildSelectionChoicesNilSpecification());
}
if(_483.length>0){
_480[_480.length]=_483;
}
if(!_482){
var _48a=_484.getAttribute("propertyToPass");
_482=(_48a&&_48a.length>0)?true:false;
}
}
var _48b=_479.getAttribute("method");
var _48c=_479.getAttribute("outputFormat");
var _48d=_479.getAttribute("outputLocale");
var _48e=_479.getAttribute("prompt");
var _48f=_479.getAttribute("dynamicDrill");
var _490=this.getXMLNodeAsString(_479,"parameters");
var _491=this.getXMLNodeAsString(_479,"objectPaths");
var _492=oCV.getId();
var _493=document.forms["formWarpRequest"+_492];
var _494=oCV.getAdvancedServerProperty("VIEWER_JS_CALL_FORWARD_DRILLTHROUGH_TO_SELF");
if((!_494||_494.toLowerCase()!=="false")&&_48e!="true"&&this.isSameReport(_493,_47b)&&this.isSameReportFormat(_48c)&&!_47c&&!_482){
var _495=new ViewerDispatcherEntry(oCV);
_495.addFormField("ui.action","forward");
if(oCV!==null&&typeof oCV.rvMainWnd!="undefined"){
oCV.rvMainWnd.addCurrentReportToReportHistory();
var _496=oCV.rvMainWnd.saveReportHistoryAsXML();
_495.addFormField("cv.previousReports",_496);
}
for(_489=0;_489<_488.length;++_489){
_483=[];
_484=_488[_489];
_485=_484.getAttribute("value");
_486=_484.getAttribute("name");
sNil=_484.getAttribute("nil");
if((sNil===null||sNil==="")&&(_485===null||_485==="")){
_483.push("p_"+_486);
_483.push(this.buildSelectionChoicesNilSpecification());
}
if(_483.length>0){
_480[_480.length]=_483;
}
}
for(_489=1;_489<_480.length;_489++){
_495.addFormField(_480[_489][0],_480[_489][1]);
}
_495.addFormField("_drillThroughToSelf","true");
if(oCV.m_tabsPayload&&oCV.m_tabsPayload.tabs){
_495.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",oCV.m_tabsPayload.tabs[0].id);
}
oCV.setUsePageRequest(true);
oCV.dispatchRequest(_495);
if(typeof oCV.m_viewerFragment=="undefined"){
var _497=getCognosViewerObjectRefAsString(_492);
setTimeout(_497+".getRequestIndicator().show()",10);
}
}else{
doSingleDrill(_47f,_480,_48b,_48c,_48d,_47a,_490,_491,this.getCognosViewer().getId(),_48e,_48f);
}
}
};
AuthoredDrillAction.prototype._shouldShowInNewWindow=function(_498){
return _498.getAttribute("showInNewWindow")=="true";
};
AuthoredDrillAction.prototype.isSameReport=function(_499,_49a){
if(_499["ui.object"]&&_49a==_499["ui.object"].value){
return true;
}
return false;
};
AuthoredDrillAction.prototype.isSameReportFormat=function(_49b){
var _49c=this.getCognosViewer().envParams["run.outputFormat"];
if(_49c){
if(_49b==_49c){
return true;
}else{
if(_49c=="HTML"&&_49b=="HTMLFragment"){
return true;
}
}
}
return false;
};
AuthoredDrillAction.prototype.getXMLNodeAsString=function(_49d,_49e){
var sXML="";
if(_49d!=null){
var node=XMLHelper_FindChildByTagName(_49d,_49e,false);
if(node!=null){
sXML=XMLBuilderSerializeNode(node);
}
}
return sXML;
};
AuthoredDrillAction.prototype.execute=function(_4a1){
if(this.m_drillTargetSpecification!=""){
this.executeDrillTarget(this.m_drillTargetSpecification);
}else{
if(typeof _4a1!="undefined"){
var _4a2=this.getCognosViewer().getDrillTargets();
var _4a3=this.getAuthoredDrillThroughContext(_4a1,_4a2);
var _4a4=_4a3.childNodes;
if(_4a4.length==1){
this.executeDrillTarget(XMLBuilderSerializeNode(_4a4[0]));
}else{
doMultipleDrills(XMLBuilderSerializeNode(_4a3),this.getCognosViewer().getId());
}
}
}
};
AuthoredDrillAction.prototype.showDrillTargets=function(_4a5){
var _4a6="<context>";
for(var _4a7=0;_4a7<_4a5.length;++_4a7){
var _4a8=_4a5[_4a7];
_4a6+="<member>";
var _4a9=_4a8.getAttribute("label");
_4a6+="<name>";
_4a6+=sXmlEncode(_4a9);
_4a6+="</name>";
var _4aa=_4a8.getAttribute("path");
_4a6+="<drillThroughSearchPath>";
_4a6+=sXmlEncode(_4aa);
_4a6+="</drillThroughSearchPath>";
var _4ab=_4a8.getAttribute("method");
_4a6+="<drillThroughAction>";
_4a6+=sXmlEncode(_4ab);
_4a6+="</drillThroughAction>";
var _4ac=_4a8.getAttribute("outputFormat");
_4a6+="<drillThroughFormat>";
_4a6+=sXmlEncode(_4ac);
_4a6+="</drillThroughFormat>";
var _4ad="parent."+this.getTargetReportRequestString(_4a8);
_4a6+="<data>";
_4a6+=sXmlEncode(_4ad);
_4a6+="</data>";
_4a6+="</member>";
}
_4a6+="</context>";
};
AuthoredDrillAction.prototype.populateContextMenu=function(_4ae){
var _4af=this.getCognosViewer();
var _4b0=_4af.rvMainWnd.getToolbarControl();
var _4b1=null;
if(typeof _4b0!="undefined"&&_4b0!=null){
var _4b2=_4b0.getItem("goto");
if(_4b2){
_4b1=_4b2.getMenu();
}
}
var _4b3=_4af.rvMainWnd.getContextMenu();
var _4b4=null;
if(typeof _4b3!="undefined"&&_4b3!=null){
_4b4=_4b3.getGoToMenuItem().getMenu();
}
if(_4b1!=null||_4b4!=null){
var _4b5=this.getCognosViewer().getDrillTargets();
var _4b6=this.getAuthoredDrillThroughContext(_4ae,_4b5);
var _4b7=_4b6.childNodes;
if(_4b7.length>0){
for(var _4b8=0;_4b8<_4b7.length;++_4b8){
var _4b9=_4b7[_4b8];
var _4ba=getCognosViewerObjectRefAsString(this.getCognosViewer().getId())+".m_oDrillMgr.executeAuthoredDrill(\""+encodeURIComponent(XMLBuilderSerializeNode(_4b9))+"\");";
var _4bb=this.getTargetReportIconPath(_4b9);
var _4bc=_4b9.getAttribute("label");
if(isViewerBidiEnabled()){
var bidi=BidiUtils.getInstance();
_4bc=bidi.btdInjectUCCIntoStr(_4bc,getViewerBaseTextDirection());
}
if(_4b1!=null){
new CMenuItem(_4b1,_4bc,_4ba,_4bb,gMenuItemStyle,_4af.getWebContentRoot(),_4af.getSkin());
}
if(_4b4!=null){
new CMenuItem(_4b4,_4bc,_4ba,_4bb,gMenuItemStyle,_4af.getWebContentRoot(),_4af.getSkin());
}
}
}
}
};
AuthoredDrillAction.prototype.buildSelectionChoicesNilSpecification=function(){
return "<selectChoices/>";
};
AuthoredDrillAction.prototype.buildSelectionChoicesSpecification=function(_4be){
var _4bf="";
var _4c0=_4be.getAttribute("value");
if(_4c0!=null){
var _4c1=_4be.getAttribute("propertyToPass");
_4bf+="<selectChoices";
if(_4c1!=null&&_4c1!=""){
_4bf+=" propertyToPass=\"";
_4bf+=sXmlEncode(_4c1);
_4bf+="\"";
}
_4bf+=">";
if(_4c0.indexOf("<selectChoices>")!=-1){
_4bf+=_4c0.substring(_4c0.indexOf("<selectChoices>")+15);
}else{
if(_4c0!=""){
_4bf+="<selectOption ";
var sMun=_4be.getAttribute("mun");
if(sMun!=null&&sMun!=""){
var _4c3=sXmlEncode(sMun);
_4bf+="useValue=\"";
_4bf+=_4c3;
_4bf+="\" ";
_4bf+="mun=\"";
_4bf+=_4c3;
_4bf+="\" ";
_4bf+="displayValue=\"";
_4bf+=sXmlEncode(_4c0);
_4bf+="\"";
}else{
_4bf+="useValue=\"";
_4bf+=sXmlEncode(_4c0);
_4bf+="\" ";
var _4c4=_4be.getAttribute("displayValue");
if(_4c4==null||_4c4==""){
_4c4=_4c0;
}
_4bf+="displayValue=\"";
_4bf+=sXmlEncode(_4c4);
_4bf+="\"";
}
_4bf+="/>";
_4bf+="</selectChoices>";
}
}
}
return _4bf;
};
AuthoredDrillAction.prototype.getPropertyToPass=function(_4c5,_4c6){
if(_4c5!=null&&_4c5!=""&&_4c6!=null){
var _4c7=_4c6.childNodes;
if(_4c7!=null){
for(var _4c8=0;_4c8<_4c7.length;++_4c8){
var _4c9=_4c7[_4c8];
var _4ca="";
if(_4c9.getAttribute("name")!=null){
_4ca=_4c9.getAttribute("name");
}
if(_4ca==_4c5){
return _4c9.getAttribute("propertyToPass");
}
}
}
}
return "";
};
AuthoredDrillAction.prototype.getTargetReportRequestString=function(_4cb){
var _4cc="";
var _4cd=_4cb.getAttribute("bookmarkRef");
var _4ce=_4cb.getAttribute("path");
var _4cf=_4cb.getAttribute("showInNewWindow");
if((_4cd!=null&&_4cd!="")&&(_4ce==null||_4ce=="")){
_4cc+="document.location=\"#";
_4cc+=_4cd;
_4cc+="\";";
}else{
_4cc+="doSingleDrill(";
if(_4cf=="true"){
_4cc+="\"_blank\",";
}else{
_4cc+="\"\",";
}
_4cc+="[[\"obj\",\"";
_4cc+=encodeURIComponent(_4ce);
_4cc+="\"]";
var _4d0=XMLHelper_FindChildrenByTagName(_4cb,"drillParameter",false);
for(var _4d1=0;_4d1<_4d0.length;++_4d1){
var _4d2=_4d0[_4d1];
var _4d3=_4d2.getAttribute("value");
var _4d4=_4d2.getAttribute("name");
if(_4d3!=null&&_4d3!=""){
_4cc+=", [\"p_"+_4d4+"\",\""+encodeURIComponent(this.buildSelectionChoicesSpecification(_4d2))+"\"]";
}
var sNil=_4d2.getAttribute("nil");
if(sNil!=null&&sNil!=""){
_4cc+="\", [\"p_"+_4d4+"\",\""+encodeURIComponent(this.buildSelectionChoicesNilSpecification())+"\"]";
}
}
_4cc+="],";
var _4d6=_4cb.getAttribute("method");
_4cc+="\""+encodeURIComponent(_4d6)+"\",";
var _4d7=_4cb.getAttribute("outputFormat");
_4cc+="\""+encodeURIComponent(_4d7)+"\",";
var _4d8=_4cb.getAttribute("outputLocale");
_4cc+="\""+encodeURIComponent(_4d8)+"\",";
_4cc+="\""+encodeURIComponent(_4cd)+"\",";
var _4d9=XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(_4cb,"parameters",false));
_4cc+="\""+encodeURIComponent(_4d9)+"\",";
var _4da=XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(_4cb,"objectPaths",false));
_4cc+="\""+encodeURIComponent(_4da)+"\",";
_4cc+="\""+encodeURIComponent(this.getCognosViewer().getId())+"\",";
var _4db=_4cb.getAttribute("prompt");
_4cc+="\""+encodeURIComponent(_4db)+"\",";
var _4dc=_4cb.getAttribute("dynamicDrill");
_4cc+=" "+encodeURIComponent(_4dc);
_4cc+=");";
}
return _4cc;
};
AuthoredDrillAction.prototype.getTargetReportIconPath=function(_4dd){
var _4de="";
var _4df=_4dd.getAttribute("bookmarkRef");
var _4e0=XMLHelper_FindChildByTagName(_4dd,"drillParameter",false);
if((_4df!=null&&_4df!="")&&_4e0==null){
_4de="/common/images/spacer.gif";
}else{
var _4e1=_4dd.getAttribute("method");
switch(_4e1){
case "editAnalysis":
_4de="/ps/portal/images/icon_ps_analysis.gif";
break;
case "editQuery":
_4de="/ps/portal/images/icon_qs_query.gif";
break;
case "execute":
_4de="/ps/portal/images/action_run.gif";
break;
case "view":
var _4e2=_4dd.getAttribute("outputFormat");
switch(_4e2){
case "HTML":
case "XHTML":
case "HTMLFragment":
_4de="/ps/portal/images/icon_result_html.gif";
break;
case "PDF":
_4de="/ps/portal/images/icon_result_pdf.gif";
break;
case "XML":
_4de="/ps/portal/images/icon_result_xml.gif";
break;
case "CSV":
_4de="/ps/portal/images/icon_result_csv.gif";
break;
case "XLS":
_4de="/ps/portal/images/icon_result_excel.gif";
break;
case "SingleXLS":
_4de="/ps/portal/images/icon_result_excel_single.gif";
break;
case "XLWA":
_4de="/ps/portal/images/icon_result_excel_web_arch.gif";
break;
default:
_4de="/common/images/spacer.gif";
}
break;
default:
_4de="/common/images/spacer.gif";
}
}
return this.getCognosViewer().getWebContentRoot()+_4de;
};
AuthoredDrillAction.prototype.getAuthoredDrillThroughContext=function(_4e3,_4e4){
if(typeof _4e3!="string"||typeof _4e4!="object"){
return null;
}
var _4e5=XMLBuilderLoadXMLFromString(_4e3);
if(_4e5==null||_4e5.firstChild==null){
return null;
}
var _4e6=XMLHelper_GetFirstChildElement(_4e5);
if(XMLHelper_GetLocalName(_4e6)!="AuthoredDrillTargets"){
return null;
}
var _4e7=XMLHelper_GetFirstChildElement(_4e6);
if(XMLHelper_GetLocalName(_4e7)!="rvDrillTargets"){
return null;
}
var _4e8=_4e7.childNodes;
if(_4e8===null||_4e8.length===0){
return null;
}
var _4e9=self.XMLBuilderCreateXMLDocument("rvDrillTargets");
for(var _4ea=0;_4ea<_4e8.length;++_4ea){
if(typeof _4e8[_4ea].getAttribute=="undefined"){
continue;
}
var _4eb=_4e9.createElement("drillTarget");
_4e9.documentElement.appendChild(_4eb);
var _4ec=_4e8[_4ea].getAttribute("bookmarkRef");
if(_4ec===null){
_4eb.setAttribute("bookmarkRef","");
}else{
_4eb.setAttribute("bookmarkRef",_4ec);
}
var _4ed=_4e8[_4ea].getAttribute("bookmarkPage");
if(_4ed===null){
_4eb.setAttribute("bookmarkPage","");
}else{
_4eb.setAttribute("bookmarkPage",_4ed);
}
var _4ee=_4e8[_4ea].getAttribute("drillIdx");
if(_4ee==null){
continue;
}
if(_4ee>=_4e4.length){
continue;
}
var _4ef=_4e4[_4ee];
if(typeof _4ef!="object"){
continue;
}
_4eb.setAttribute("outputFormat",_4ef.getOutputFormat());
_4eb.setAttribute("outputLocale",_4ef.getOutputLocale());
_4eb.setAttribute("prompt",_4ef.getPrompt());
_4eb.setAttribute("dynamicDrill",_4ef.isDynamicDrillThrough()?"true":"false");
var _4f0=_4e8[_4ea].getAttribute("label");
if(_4f0===null||_4f0===""){
_4f0=_4ef.getLabel();
}
_4eb.setAttribute("label",_4f0);
_4eb.setAttribute("path",_4ef.getPath());
_4eb.setAttribute("showInNewWindow",_4ef.getShowInNewWindow());
_4eb.setAttribute("method",_4ef.getMethod());
var _4f1=_4e7;
var _4f2="";
var _4f3=_4ef.getParameterProperties();
if(typeof _4f3!="undefined"&&_4f3!=null&&_4f3!=""){
_4f2=XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(_4ef.getParameterProperties()));
}
while(_4f1){
var _4f4=_4f1.childNodes[_4ea].childNodes;
for(var _4f5=0;_4f5<_4f4.length;++_4f5){
var _4f6=_4f4[_4f5].cloneNode(true);
if(_4f2){
var _4f7=this.getPropertyToPass(_4f6.getAttribute("name"),_4f2);
if(_4f7!=null&&_4f7!=""){
_4f6.setAttribute("propertyToPass",_4f7);
}
}
_4eb.appendChild(_4f6);
}
_4f1=_4f1.nextSibling;
}
var _4f8="<root xmlns:bus=\"http://developer.cognos.com/schemas/bibus/3/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">";
var _4f9="</root>";
var _4fa=_4f8+_4ef.getParameters()+_4f9;
var _4fb=XMLBuilderLoadXMLFromString(_4fa);
var _4fc=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(_4fb));
if(_4fc){
_4eb.appendChild(_4fc.cloneNode(true));
}
var _4fd=_4f8+_4ef.getObjectPaths()+_4f9;
var _4fe=XMLBuilderLoadXMLFromString(_4fd);
_4fc=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(_4fe));
if(_4fc){
_4eb.appendChild(_4fc.cloneNode(true));
}
}
return XMLHelper_GetFirstChildElement(_4e9);
};
function ChangeDisplayTypeAction(){
this.m_requestParams=null;
this.m_sAction="ChangeDataContainerType";
this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES=5;
};
ChangeDisplayTypeAction.prototype=new ModifyReportAction();
ChangeDisplayTypeAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_CHANGE_DISPLAY;
};
ChangeDisplayTypeAction.prototype.setRequestParms=function(_4ff){
this.m_requestParams=_4ff;
};
ChangeDisplayTypeAction.prototype.addActionContextAdditionalParms=function(){
this._cleaerPinAndFreeze();
var _500=false;
if(this.m_requestParams.bestVisualization){
_500=true;
}else{
if(((this.m_requestParams.targetType.targetType==undefined)||(this.m_requestParams.targetType.targetType=="undefined"))&&(this.m_requestParams.targetType.templateId==undefined)){
var _501=eval("("+this.m_requestParams.targetType+")");
}else{
var _501=this.m_requestParams.targetType;
}
}
var _502=this.m_oCV.getViewerWidget().findContainerDiv();
var _503="";
if(_502){
_503="<widgetWidth>"+(parseInt(_502.style.width,10)-ResizeChartAction.PADDING.getWidth())+"px</widgetWidth>"+"<widgetHeight>"+(parseInt(_502.style.height,10)-ResizeChartAction.PADDING.getHeight())+"px</widgetHeight>";
}
var _504="";
if(_500){
_504+="<bestVisualization>true</bestVisualization>";
_504+=this.getDataItemInfoMap();
}else{
_504+="<target>";
_504+=_501.targetType;
_504+="</target>";
if(_501.templateId){
_504+="<templateId>";
_504+=((_501.templateId)?_501.templateId:"");
_504+="</templateId>";
_504+="<variationId>";
_504+=((_501.variationId)?_501.variationId:"");
_504+="</variationId>";
_504+=this.getDataItemInfoMap();
}
_504+="<label>";
_504+=_501.label;
_504+="</label>";
}
_504+=_503;
_504+=this.addClientContextData(3);
return (_504);
};
ChangeDisplayTypeAction.prototype._cleaerPinAndFreeze=function(){
var _505=this.m_oCV.getPinFreezeManager();
if(_505){
var _506=this.getContainerId(this.m_oCV.getSelectionController());
_505.clearPinInfo(_506);
}
};
ChangeDisplayTypeAction.prototype.updateMenu=function(_507){
var _508=this.getCognosViewer().getRAPReportInfo();
_507.visible=(_508)?_508.containsInteractiveDataContainer():_507.visible;
if(!_507.visible){
return _507;
}
var _509=this.getSelectedReportInfo();
_507.disabled=(_509==null||_509.displayTypeId==null||!this.isInteractiveDataContainer(_509.displayTypeId));
if(_507.disabled){
_507.iconClass="chartTypesDisabled";
return _507;
}
_507.iconClass="chartTypes";
return this.buildDynamicMenuItem(_507,"ChangeDisplayType");
};
ChangeDisplayTypeAction.prototype.createEmptyMenuItem=function(){
return {name:"None",label:RV_RES.IDS_JS_CHANGE_DISPLAY_SELECT_DATA,iconClass:"",action:null,items:null};
};
ChangeDisplayTypeAction.prototype.getActionContextString=function(_50a){
var _50b="<getInfoActions>";
_50b+="<getInfoAction name=\"GetInfo\">";
_50b+="<include><suggestedDisplayTypes/></include>";
_50b+=this.getDataItemInfoMap();
_50b+="<groupId>";
_50b+=_50a;
_50b+="</groupId>";
_50b+=this.addClientContextData(3);
_50b+="</getInfoAction>";
_50b+="</getInfoActions>";
return _50b;
};
ChangeDisplayTypeAction.prototype.fetchSuggestedDisplayTypes=function(_50c){
var oCV=this.getCognosViewer();
var _50e=new AsynchJSONDispatcherEntry(oCV);
_50e.addFormField("ui.action","getInfoFromReportSpec");
_50e.addFormField("bux","true");
_50e.addFormField("ui.object",oCV.envParams["ui.object"]);
_50e.addFormField("cv.actionContext",this.getActionContextString(_50c));
_50e.addDefinedFormField("ui.spec",oCV.envParams["ui.spec"]);
_50e.addNonEmptyStringFormField("modelPath",oCV.getModelPath());
if(_50c=="undefined"){
_50e.setCallbacks({"complete":{"object":this,"method":this.handleSuggestedDisplayTypesResponse}});
}else{
_50e.setCallbacks({"complete":{"object":this,"method":this.handleSuggestedDisplayVariationsResponse}});
}
oCV.dispatchRequest(_50e);
};
ChangeDisplayTypeAction.prototype.handleSuggestedDisplayTypesResponse=function(_50f){
var _510=this.getCognosViewer();
var _511=_510.getViewerWidget();
this.addSuggestedDisplayTypesMenuItems(_50f.getResult());
};
ChangeDisplayTypeAction.prototype.addSuggestedDisplayTypesMenuItems=function(_512){
var _513=this.getCognosViewer().findToolbarItem("ChangeDisplayType");
if(_513){
_513.open=false;
}
var _514=[];
var _515=this.getSelectedReportInfo();
var _516=undefined;
for(var x=0;x<_512.containers.length;x++){
if(_515.container==_512.containers[x].container){
_516=_512.containers[x];
break;
}
}
if(_516==undefined){
return;
}
var _518=_516.suggestedDisplayTypes.length<=this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES?_516.suggestedDisplayTypes.length:this.m_iMAX_NUM_SUGGESTED_DISPLAY_TYPES;
_514.push({title:RV_RES.IDS_JS_CHANGE_DISPLAY_RECOMMENDED});
_514.push({separator:true});
for(var i=0;i<_518;i++){
_514.push({name:_516.suggestedDisplayTypes[i].name,label:_516.suggestedDisplayTypes[i].title,description:_516.suggestedDisplayTypes[i].description,iconClass:_516.suggestedDisplayTypes[i].iconClass,action:{name:"ChangeDisplayType",payload:{targetType:{templateId:_516.suggestedDisplayTypes[i].templateId},label:_516.suggestedDisplayTypes[i].title}},items:null});
}
_514.push({separator:true});
_514.push({name:"ChangeDisplayMore",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE,iconClass:"ChartTypeOther",action:{name:"InvokeChangeDisplayTypeDialog",payload:{}},items:null});
_513.open=true;
_513.items=_514;
var _51a=[];
_51a.push(_513);
this.getCognosViewer().getViewerWidget().fireEvent("com.ibm.bux.widgetchrome.toolbar.update",null,_51a);
return _514;
};
ChangeDisplayTypeAction.prototype.buildMenu=function(_51b){
var _51c=this.getCognosViewer().getRAPReportInfo();
_51b.visible=(_51c)?_51c.containsInteractiveDataContainer():_51b.visible;
if(!_51b.visible){
return _51b;
}
var _51d=this.getSelectedReportInfo();
_51b.disabled=(_51d==null||_51d.displayTypeId==null||!this.isInteractiveDataContainer(_51d.displayTypeId));
if(_51b.disabled){
_51b.iconClass="chartTypesDisabled";
}else{
_51b.iconClass="chartTypes";
var _51e=this.getCognosViewer().getAdvancedServerProperty("VIEWER_JS_enableVisCoach");
if(_51e!=="false"&&(typeof _51d.suggestedDisplayTypesEnabled!="undefined")&&(_51d.suggestedDisplayTypesEnabled!=null)&&(_51d.suggestedDisplayTypesEnabled=="true")){
this.fetchSuggestedDisplayTypes("undefined");
return this.buildDynamicMenuItem(_51b,"ChangeDisplayType");
}else{
_51b.items=[];
var isV2=(_51d.displayTypeId.match("v2_")!=null||_51d.displayTypeId=="crosstab"||_51d.displayTypeId=="list");
if(isV2){
_51b.items.push({name:"ChangeDisplayBar",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_BAR,iconClass:"ChartTypeBar",action:{name:"ChangeDisplayType",payload:{targetType:"v2_bar_rectangle_clustered"}},items:null});
_51b.items.push({name:"ChangeDisplayColumn",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_COLUMN,iconClass:"ChartTypeColumn",action:{name:"ChangeDisplayType",payload:{targetType:"v2_column_rectangle_clustered"}},items:null});
_51b.items.push({name:"ChangeDisplayLine",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LINE,iconClass:"ChartTypeLine",action:{name:"ChangeDisplayType",payload:{targetType:"v2_line_clustered_markers"}},items:null});
_51b.items.push({name:"ChangeDisplayPie",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_PIE,iconClass:"ChartTypePie",action:{name:"ChangeDisplayType",payload:{targetType:"v2_pie"}},items:null});
_51b.items.push({name:"ChangeDisplayCrosstab",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_CROSSTAB,iconClass:"ChartTypeCrosstab",action:{name:"ChangeDisplayType",payload:{targetType:"Crosstab"}},items:null});
_51b.items.push({name:"ChangeDisplayList",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LIST,iconClass:"ChartTypeList",action:{name:"ChangeDisplayType",payload:{targetType:"List"}},items:null});
_51b.items.push({name:"ChangeDisplayMore",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE,iconClass:"ChartTypeOther",action:{name:"InvokeChangeDisplayTypeDialog",payload:""},items:null});
}else{
_51b.items.push({name:"ChangeDisplayBar",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_BAR,iconClass:"ChartTypeBar",action:{name:"ChangeDisplayType",payload:{targetType:"bar_clustered_flat"}},items:null});
_51b.items.push({name:"ChangeDisplayColumn",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_COLUMN,iconClass:"ChartTypeColumn",action:{name:"ChangeDisplayType",payload:{targetType:"column_clustered_flat"}},items:null});
_51b.items.push({name:"ChangeDisplayLine",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LINE,iconClass:"ChartTypeLine",action:{name:"ChangeDisplayType",payload:{targetType:"line_clustered_flat_markers"}},items:null});
_51b.items.push({name:"ChangeDisplayPie",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_PIE,iconClass:"ChartTypePie",action:{name:"ChangeDisplayType",payload:{targetType:"pie_flat"}},items:null});
_51b.items.push({name:"ChangeDisplayCrosstab",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_CROSSTAB,iconClass:"ChartTypeCrosstab",action:{name:"ChangeDisplayType",payload:{targetType:"Crosstab"}},items:null});
_51b.items.push({name:"ChangeDisplayList",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_LIST,iconClass:"ChartTypeList",action:{name:"ChangeDisplayType",payload:{targetType:"List"}},items:null});
_51b.items.push({name:"ChangeDisplayMore",label:RV_RES.IDS_JS_CHANGE_DISPLAY_TYPE_MORE,iconClass:"ChartTypeOther",action:{name:"InvokeChangeDisplayTypeDialog",payload:""},items:null});
}
}
for(var i in _51b.items){
_51b.items[i].action.payload={targetType:_51b.items[i].action.payload};
_51b.items[i].action.payload.targetType.label=_51b.items[i].label;
}
}
return _51b;
};
function ChangeDisplayVariationsAction(){
};
ChangeDisplayVariationsAction.prototype=new CognosViewerAction();
function ChangeDisplayVariationsAction(){
this.m_requestParams=null;
};
ChangeDisplayVariationsAction.prototype.setRequestParms=function(_521){
this.m_requestParams=_521;
};
ChangeDisplayVariationsAction.prototype.execute=function(){
var _522=this.m_requestParams.groupId;
var _523=this.getCognosViewer();
var _524=this.getSelectedReportInfo();
if(_524){
var _525=_523.getViewerWidget();
if(typeof _524.suggestedDisplayVariations=="undefined"){
var _526=new AsynchJSONDispatcherEntry(this.m_oCV);
_526.setCallbacks({"complete":{"object":this,"method":this.handleResponse}});
_526.setRequestIndicator(_523.getRequestIndicator());
_526.addFormField("ui.action","getInfoFromReportSpec");
_526.addFormField("bux","true");
_526.addNonEmptyStringFormField("modelPath",this.m_oCV.getModelPath());
_526.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_526.addDefinedFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_526.addFormField("cv.actionContext",this.addActionContext(_522));
_523.dispatchRequest(_526);
}else{
_525.updateDisplayTypeDialogVariations(_524.possibleDisplayTypes,_524.suggestedDisplayVariations);
}
}
};
ChangeDisplayVariationsAction.prototype.handleResponse=function(_527){
var _528=this.getCognosViewer();
var _529=_528.getViewerWidget();
var _52a=_527.getResult();
for(var i in _52a.containers){
var _52c=this.getReportInfo(_52a.containers[i].container);
_52c.possibleDisplayTypes=_52a.containers[i].possibleDisplayTypes;
_52c.variationGroups=_52a.containers[i].variationGroups;
}
var _52d=this.getSelectedReportInfo();
_529.updateDisplayTypeDialogVariations(_52d.possibleDisplayTypes,_52d.variationGroups);
};
ChangeDisplayVariationsAction.prototype.addActionContext=function(_52e){
var _52f="<getInfoActions>";
_52f+="<getInfoAction name=\"GetInfo\">";
_52f+="<include><suggestedDisplayVariations/></include>";
_52f+=this.getDataItemInfoMap();
_52f+=this.addClientContextData(3);
_52f+="<groupId>";
_52f+=_52e;
_52f+="</groupId>";
_52f+="</getInfoAction>";
_52f+="</getInfoActions>";
return _52f;
};
function ChangePaletteAction(){
this.m_sAction="ChangePalette";
this.m_palette="";
this.m_runReport=true;
this.m_aPaletteNames=["Flow","Classic","Contemporary","Contrast","Corporate","Dynamic","Excel","Excel 2007","Gradients","Grey Scale","Jazz","Legacy","Metro","Mixed","Modern","Patterns"];
this.m_aPaletteIcons=["changePaletteFlow","changePaletteClassic","changePaletteContemporary","changePaletteContrast","changePaletteCorporate","changePaletteDynamic","changePaletteExcel","changePaletteExcel2007","changePaletteGradients","changePaletteGreyScale","changePaletteJazz","changePaletteLegacy","changePaletteMetro","changePaletteMixed","changePaletteModern","changePalettePatterns"];
};
ChangePaletteAction.prototype=new ModifyReportAction();
ChangePaletteAction.baseclass=ModifyReportAction.prototype;
ChangePaletteAction.prototype.reuseQuery=function(){
return true;
};
ChangePaletteAction.prototype.preProcess=function(){
this.updateRunReport();
if(this.m_runReport==false){
var _530=this.getLayoutComponents();
for(var _531=0;_531<_530.length;++_531){
var _532=_530[_531];
if(_532.getAttribute("flashChart")!=null){
if(this.m_palette==""){
_532.setPalette("Flow");
}else{
_532.setPalette(this.m_palette);
}
}
}
}
};
ChangePaletteAction.prototype.updateRunReport=function(){
this.m_runReport=true;
var _533=document.getElementById("rt"+this.m_oCV.getId());
if(_533!=null){
var _534=getElementsByAttribute(_533,"*","chartcontainer","true");
if(_534.length==0){
this.m_runReport=false;
}
}
};
ChangePaletteAction.prototype.runReport=function(){
return this.m_runReport;
};
ChangePaletteAction.prototype.updateInfoBar=function(){
return false;
};
ChangePaletteAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_CHANGE_PALETTE;
};
ChangePaletteAction.prototype.setRequestParms=function(_535){
if(typeof _535=="string"){
this.m_palette=_535;
if(this.m_oCV!=null&&typeof this.m_oCV!="undefined"){
this.m_oCV.m_sPalette=_535;
}
}
};
ChangePaletteAction.prototype.addActionContextAdditionalParms=function(){
if(this.m_palette!=""){
return "<name>"+this.m_palette+"</name>";
}
return "";
};
ChangePaletteAction.prototype.updateMenu=function(_536){
_536.visible=this.ifContainsInteractiveDataContainer();
if(!_536.visible){
return _536;
}
var _537=this.getSelectedReportInfo();
if(_537!=null&&_537.displayTypeId.indexOf("Chart")>=0){
_536.disabled=false;
return _536;
}
_536.disabled=true;
return _536;
};
ChangePaletteAction.reset=function(oCV){
delete (oCV.m_sPalette);
};
function DragDropAction(){
this.m_source=null;
this.m_target=null;
this.m_insertBefore=false;
this.m_sAction="Reorder";
};
DragDropAction.prototype=new ModifyReportAction();
DragDropAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_MOVE;
};
DragDropAction.prototype.getOffsetCoords=function(_539){
var _53a=document.getElementById("rt"+this.getCognosViewer().getId());
var _53b=_539;
var _53c=0;
var _53d=0;
while(_53b!=_53a){
_53c+=_53b.offsetTop;
_53d+=_53b.offsetLeft;
_53b=_53b.offsetParent;
}
return {left:_53d,top:_53c};
};
DragDropAction.prototype.showDragDropCaret=function(evt,cell,_540){
var _541=document.getElementById("VDDC"+this.getCognosViewer().getId());
if(_541==null){
_541=document.createElement("span");
_541.setAttribute("id","VDDC"+this.getCognosViewer().getId());
_541.className="dropCaret";
if(_541.attachEvent){
_541.attachEvent("onmousemove",stopEventBubble);
}else{
_541.addEventListener("mousemove",stopEventBubble,false);
}
_541.style.width="8px";
_541.innerHTML="<img style=\"margin:1px;width:2px;height:100%;\" src=\""+this.getCognosViewer().getWebContentRoot()+"/rv/images/drop_caret.gif\"/>";
_540.appendChild(_541);
}
var _542=this.getOffsetCoords(_540);
_541.style.top=(_542.top-1)+"px";
var _543;
if(typeof evt.offsetX=="undefined"){
_543=evt.layerX;
}else{
_542=this.getOffsetCoords(evt.srcElement);
_543=evt.offsetX+_542.left;
}
_542=this.getOffsetCoords(cell);
var _544=_542.left+(cell.clientWidth/2);
this.m_insertBefore=(_543<_544);
_541.style.height=_540.clientHeight+"px";
if(this.m_insertBefore==false){
_541.style.left=(_542.left+cell.clientWidth+1)+"px";
}else{
_541.style.left=_542.left+"px";
}
_541.style.display="inline";
};
DragDropAction.prototype.showDragDropIndicators=function(evt){
if(this.m_target!=null){
var cell=this.m_target.getCellRef();
var _547=cell;
while(_547.getAttribute("lid")==null){
_547=_547.parentNode;
}
this.showDragDropCaret(evt,cell,_547);
}
};
DragDropAction.prototype.showDragDropToolTip=function(evt){
var _549="";
if(this.canDrop()==true){
_549="/rv/images/cursor_move.gif";
}else{
_549="/rv/images/cursor_nodrop.gif";
}
this.showCustomCursor(evt,"viewerTooltipSpan",_549);
};
DragDropAction.prototype.canMove=function(){
if(this.m_oCV.isBlacklisted("Move")){
return false;
}
var _54a=this.getCognosViewer().getSelectionController();
this.m_source=_54a.getAllSelectedObjects();
if(this.m_source!=null&&this.m_source.length>0){
if(typeof this.m_source[0].m_dataContainerType!="undefined"&&this.m_source[0].m_dataContainerType=="list"&&this.m_source[0].getLayoutType()!="summary"){
return true;
}
}
return false;
};
DragDropAction.prototype.onDrag=function(evt){
clearTextSelection();
var _54c=getNodeFromEvent(evt);
var _54d=this.getCognosViewer().getSelectionController();
this.m_target=_54d.buildSelectionObject(_54c,evt);
this.showDragDropToolTip(evt);
if(this.canDrop()){
this.showDragDropIndicators(evt);
}else{
this.hideDropIndicators();
}
};
DragDropAction.prototype.hideDropIndicators=function(){
var _54e=document.getElementById("VDDC"+this.getCognosViewer().getId());
if(_54e!=null){
_54e.style.display="none";
}
};
DragDropAction.prototype.onMouseDown=function(evt){
if(this.canMove()){
window.oCVDragDropObject={action:this,x:evt.clientX,y:evt.clientY,dragging:false};
}
};
DragDropAction.prototype.canDrop=function(){
return this.m_target!=null&&this.m_source!=null&&this.m_target.getLayoutType()!="summary"&&(this.m_target.getLayoutElementId()==this.m_source[0].getLayoutElementId());
};
DragDropAction.prototype.onDrop=function(evt){
this.hideCustomCursor("viewerTooltipSpan");
this.hideDropIndicators();
if(this.canDrop(evt)){
var _551=true;
var _552;
var _553=parseInt(this.m_source[0].getColumnRef(),10);
var last=_553;
var _555=true;
for(var _556=0;_556<this.m_source.length;++_556){
_552=parseInt(this.m_source[_556].getColumnRef(),10);
if(_556>0&&_552!==last+1){
_555=false;
break;
}
last=_552;
}
if(_555){
var _557=parseInt(this.m_target.getColumnRef(),10);
_557+=this.m_insertBefore?0:1;
if(_557>=_553&&_557<=last+1){
_551=false;
}
}
if(_551){
this.execute();
}
}
};
DragDropAction.prototype.addActionContextAdditionalParms=function(){
var tag=this.m_insertBefore==true?"before":"after";
var _559=this.m_target.getCellRef();
var _55a=this.getRAPLayoutTag(_559);
_55a=(_55a!=null)?_55a:this.m_target.getColumnName();
return this.getSelectedCellTags()+"<"+tag+">"+xml_encode(_55a)+"</"+tag+">";
};
function DragDropAction_isDragging(evt){
var _55c=window.oCVDragDropObject;
if(_55c){
var _55d=evt.clientX;
var _55e=evt.clientY;
var _55f=_55c.x;
var _560=_55c.y;
if((_55d>=(_55f+2))||(_55d<=(_55f-2))||(_55e>=(_560+2))||(_55e<=(_560-2))){
_55c.dragging=true;
}
return _55c.dragging;
}
return false;
};
function DragDropAction_onmouseup(evt){
if(DragDropAction_isDragging(evt)){
window.oCVDragDropObject.action.onDrop(evt);
}
window.oCVDragDropObject=null;
};
function DragDropAction_onmousemove(evt){
if(DragDropAction_isDragging(evt)){
window.oCVDragDropObject.action.onDrag(evt);
}
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
DrillAction.prototype.setRequestParms=function(_563){
if(_563){
this.m_userSelectedDrillItem=_563.userSelectedDrillItem;
}
};
DrillAction.prototype.setKeepFocusOnWidget=function(_564){
this.m_bKeepFocusOnWidget=_564;
};
DrillAction.prototype.keepFocusOnWidget=function(){
if(typeof this.m_bKeepFocusOnWidget!="undefined"){
return this.m_bKeepFocusOnWidget;
}
return true;
};
DrillAction.prototype.getDrillabilityForItemFromReportInfo=function(_565){
if(!this.m_oCV){
return null;
}
var _566=this.m_oCV.getRAPReportInfo();
if(!_566){
return null;
}
var _567=_566.getContainers();
for(var _568 in _567){
var _569=_566.getDrillability(_568);
if(_569[_565]){
return _569[_565];
}
}
return null;
};
DrillAction.prototype.onDoubleClick=function(evt){
this.execute();
};
DrillAction.prototype.preProcess=function(){
if(typeof this.m_drillSpec==="undefined"||this.m_drillSpec===null){
var _56b=this.generateDrillSpecObjects();
if(!_56b){
return null;
}
var _56c=this.getCognosViewer();
var _56d=_56c.getViewerWidget();
if(_56d){
var _56e=_56c.getModelPath();
_56d.getWidgetContextManager().raiseDrillEvent(_56b,this.m_sAction,_56e);
}
}
};
DrillAction.prototype.generateDrillSpecObjects=function(){
try{
var _56f=[];
var oCV=this.getCognosViewer();
var _571=oCV.getDrillMgr();
var _572=oCV.getSelectionController();
var _573=true;
var _574=_571.getDrillParameters(this.m_drillOption,true,_573,this.m_userSelectedDrillItem);
if(_574.length===0){
return null;
}
var _575=_571.getSelectedObject();
if(_574.length>3*4&&(_575.getDataContainerType()=="crosstab"||_575.getLayoutType()=="chartElement")){
_574.length=3*4;
}
var _576=_571.getSelectedObject().getSelectedContextIds();
for(var i=0,_578=0;_578<_576.length&&i<_574.length;++_578){
var _579=_576[_578][0];
var _57a=_572.getRefDataItem(_579);
var sMUN=_572.getMun(_579);
var _57c=_572.getDisplayValue(_579);
if(_572.getDrillFlagForMember(_579)===0){
i=i+4;
continue;
}
var _57d={"dataItem":_574[i++],"mun":_574[i++],"lun":_574[i++],"hun":_574[i++]};
if(_57a!=""&&_57c!=""){
if(_57d.dataItem===_57a){
_57d.displayValue=_57c;
}
}
var _57e=_572.getUsageInfo(_579);
_57d.isMeasure=(_57e==="2")?"true":"false";
var _57f=false;
if(sMUN!=""&&_57e!="2"){
var _580=this.getDrillabilityForItemFromReportInfo(_57a);
if((_580!=null&&_580.disableDown==true)||this.m_oCV.getSelectionController().getDrillFlagForMember(_579)==1){
_57f=true;
}
}
if(_57f){
if(_57d.dataItem===_57a){
_57d.summary="true";
}
}
_56f.push(_57d);
}
return (_56f.length>0)?_56f:null;
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
var _583=XMLBuilderLoadXMLFromString(this.m_drillSpec);
var _584=_583.firstChild;
var _585=getCognosViewerSCObjectRef(oCV.getId());
_585.m_aSelectedObjects=[];
if(_585.hasSelectedChartNodes()){
_585.clearSelectionData();
}
var _586=XMLHelper_FindChildrenByTagName(_584,"DrillGroup",false);
for(var _587=0;_587<_586.length;++_587){
var _588=XMLHelper_FindChildByTagName(_586[_587],"MUN",false);
var sMun=XMLHelper_GetText(_588);
var sLun="";
var sHun="";
var _58c="";
var _58d="";
var _58e=XMLHelper_FindChildByTagName(_586[_587],"DisplayValue",false);
if(_58e!=null){
_58c=XMLHelper_GetText(_58e);
}
var _58f=XMLHelper_FindChildByTagName(_586[_587],"LUN",false);
if(_58f!=null){
sLun=XMLHelper_GetText(_58f);
}
var _590=XMLHelper_FindChildByTagName(_586[_587],"HUN",false);
if(_590!=null){
sHun=XMLHelper_GetText(_590);
}
var _591=XMLHelper_FindChildByTagName(_586[_587],"Summary",false);
if(_591!=null){
_58d=XMLHelper_GetText(_591);
}
this.selectObject(sMun,sLun,sHun,_58c,_58d,_585);
}
}
catch(e){
return false;
}
return (_585.m_aSelectedObjects.length>0);
};
DrillAction.prototype.parseDrillSpecObjects=function(_592){
if(this.useReportInfoSelection()){
return this.parseDrillSpecObjectsWithReportInfo(_592);
}
try{
var oCV=this.getCognosViewer();
if(oCV.getStatus()!=="complete"||oCV.getConversation()===""){
return false;
}
this.m_drillSpec="";
var _594=getCognosViewerSCObjectRef(oCV.getId());
_594.m_aSelectedObjects=[];
if(_594.hasSelectedChartNodes()){
_594.clearSelectionData();
}
for(var i in _592){
var _596=_592[i];
var _597=(_596.summary)?_596.summary:"";
var _598=true;
this.selectObject(_596.mun,_596.lun,_596.hun,_596.displayValue,_597,_594,_598);
}
}
catch(e){
return false;
}
return (_594.m_aSelectedObjects.length>0);
};
DrillAction.prototype.getDrillabilityForCtxValue=function(_599){
if(console&&console.log){
console.log("Required method, getDrillabilityForCtxValue, not implemented.");
}
};
DrillAction.prototype.setDrillabilityForSelectObject=function(_59a){
this.drillability=this.getDrillabilityForCtxValue(_59a);
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
DrillAction.prototype.selectObject=function(sMun,sLun,sHun,_59e,_59f,_5a0,_5a1){
var _5a2=sHun;
var _5a3=sLun;
var _5a4=sMun;
var _5a5=false;
var _5a6=_5a0.getCtxIdFromMun(sMun);
var _5a7=_5a6;
if(_5a6===""){
var _5a8=_5a0.replaceNamespaceForSharedTM1DimensionOnly(sLun,sHun,sMun);
_5a3=_5a8.lun;
_5a2=_5a8.hun;
if(_5a2!==sHun){
_5a4=this._replaceNamespace(sMun,_5a2);
}
_5a5=(_5a1==true);
_5a6=_5a0.getCtxIdFromMetaData(_5a3,_5a2,_5a5);
if(_5a6===""){
return false;
}
}
this.setDrillabilityForSelectObject(_5a6);
if((_5a5==true)||(this.m_sAction=="DrillDown"&&this.canDrillDown())||(this.m_sAction=="DrillUp"&&this.canDrillUp())){
var _5a9=_5a0.getSelections().length;
_5a0.selectObject(_5a4,_5a3,_5a2,_5a5);
var _5aa=_5a0.getSelections();
if(_5a7===""&&_5aa.length>_5a9){
var _5ab=_5aa[_5aa.length-1].m_aMuns;
_5ab[_5ab.length]=[];
_5ab[_5ab.length-1].push(_5a4);
var _5ac=_5aa[_5aa.length-1].m_aDisplayValues;
_5ac.push(_59e);
_5aa[_5aa.length-1].useDisplayValueFromObject=true;
}
if(_59f=="true"){
_5aa=_5a0.getSelections();
_5aa[_5aa.length-1].onSummary=true;
}
}
};
DrillAction.prototype._replaceNamespace=function(mun,_5ae){
var _5af=null;
if(_5ae){
var _5b0=_5ae.substr(0,_5ae.indexOf("].[")+1);
if(mun&&_5b0&&!(mun.match("^"+_5b0))){
var _5b1=mun.indexOf("].[");
_5af=_5b0+mun.substr(_5b1+1,mun.length);
}
}
return _5af||mun;
};
DrillAction.prototype.addActionContextAdditionalParms=function(){
var _5b2="";
var _5b3=(this.useReportInfoSelection())?this.m_aDrillSelectedObjects:this.getCognosViewer().getSelectionController().getSelections();
var _5b4=null;
for(var i=0;i<_5b3.length;++i){
if(_5b3[i].onSummary){
_5b4=(this.useReportInfoSelection())?_5b3[i].item:_5b3[i].getDataItems()[0][0];
_5b2+="<dataItem>"+xml_encode(_5b4)+"</dataItem>";
}
}
if(_5b2!=""){
_5b2="<onSummary>"+_5b2+"</onSummary>";
}
if(this.m_userSelectedDrillItem){
_5b2+=("<userSelectedDrillItem>"+this.m_userSelectedDrillItem+"</userSelectedDrillItem>");
}
if(this.m_useMARequest===true){
_5b2=_5b2+"<useMAGetChildRequest>false</useMAGetChildRequest>";
_5b2=_5b2+"<useMAGetParentRequest>false</useMAGetParentRequest>";
}
_5b2+=this.addClientContextData(3);
return _5b2;
};
DrillAction.prototype.getDrillOptionsAsString=function(){
var _5b6=this.getViewerWidget();
var _5b7="";
if(_5b6){
_5b7="<addSummaryMembers>"+_5b6.getDrillOptions().addSummaryMembers+"</addSummaryMembers>";
_5b7=_5b7+"<backwardsCompatible>"+_5b6.getDrillOptions().backwardsCompatible+"</backwardsCompatible>";
}
return _5b7;
};
DrillAction.prototype.getItemInfo=function(_5b8,_5b9){
var _5ba=_5b8.getRAPReportInfo();
if(!_5ba){
return null;
}
var _5bb=_5ba.getContainers();
for(var _5bc in _5bb){
var _5bd=_5ba.getItemInfo(_5bc);
if(_5bd[_5b9]){
return _5bd[_5b9];
}
}
return null;
};
DrillAction.prototype.isSelectionFilterEnabled=function(){
var _5be=this.getViewerWidget();
if(!_5be){
return false;
}
return _5be.isSelectionFilterEnabled();
};
DrillAction.prototype.getHierarchyHasExpandedSet=function(_5bf,_5c0){
var _5c1=this.getItemInfo(_5bf,_5c0);
return (_5c1&&_5c1.hierarchyHasExpandedMembers);
};
DrillAction.prototype.getIsRSDrillParent=function(_5c2,_5c3){
var _5c4=this.getItemInfo(_5c2,_5c3);
return (_5c4&&_5c4.isRSDrillParent);
};
DrillAction.prototype.setUseReportInfoSelection=function(_5c5){
this.m_bUseReportInfoSelection=_5c5;
};
DrillAction.prototype.useReportInfoSelection=function(){
return this.m_bUseReportInfoSelection;
};
DrillAction.prototype.parseDrillSpecObjectsWithReportInfo=function(_5c6){
try{
var _5c7=this.m_oCV.getRAPReportInfo();
if(!_5c7){
return null;
}
this.m_drillSpec="";
this.m_aDrillSelectedObjects=[];
for(var i in _5c6){
this.populateSelectObjectWithReportInfo(_5c6[i],_5c7);
}
}
catch(e){
return false;
}
return (this.m_aDrillSelectedObjects.length>0);
};
DrillAction.prototype.populateSelectObjectWithReportInfo=function(_5c9,_5ca){
var _5cb=_5ca.getItemDetails(_5c9.dataItem,_5c9.hun);
if(!_5cb){
_5cb=_5ca.getItemDetailsByHun(_5c9.hun);
if(!_5cb){
return null;
}
}
if(_5c9.mun){
_5cb.mun=_5c9.mun;
}
if(_5c9.lun){
_5cb.lun=_5c9.lun;
}
if(_5c9.displayValue){
_5cb.displayValue=_5c9.displayValue;
}
if(_5c9.isMeasure==="true"){
_5cb.isMeasure=true;
}
if(_5c9.summary==="true"){
_5cb.onSummary=true;
}
this.m_aDrillSelectedObjects.push(_5cb);
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
var _5cc="";
for(var idx in this.m_aDrillSelectedObjects){
var obj=this.m_aDrillSelectedObjects[idx];
_5cc+="<selectedCell>";
_5cc+=("<name>"+obj.item+"</name>"+"<display>"+obj.displayValue+"</display>"+"<rapLayoutTag>"+obj.lid+"</rapLayoutTag>"+"<queryName>"+obj.queryName+"</queryName>");
if(obj.mun){
_5cc+=("<nodeUse>"+obj.mun+"</nodeUse>");
_5cc+=("<nodeType>memberUniqueName</nodeType>");
}
if(obj.hun){
_5cc+=("<nodeHierarchyUniqueName>"+obj.hun+"</nodeHierarchyUniqueName>");
}
var _5cf=(obj.isMeasure)?"measure":"nonMeasure";
_5cc+=("<nodeUsage>"+_5cf+"</nodeUsage>");
_5cc+="</selectedCell>";
}
return ("<selection>"+_5cc+"</selection>");
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
DrillUpDownAction.prototype.updateDrillability=function(_5d0,_5d1){
this.m_oCV=_5d0;
var _5d2=_5d1.getAttribute("ctx");
this.drillability=0;
if(_5d2){
var _5d3=_5d2.split("::");
if(_5d3&&_5d3.length>0){
if(_5d3.length>2){
this.drillability=this.getDrillabilityForIntersection(_5d3[1].split(":")[0],_5d3[2].split(":")[0]);
}else{
if(_5d3.length===2){
this.drillability=this.getDrillabilityForCtxValue(_5d3[1].split(":")[0]);
}else{
this.drillability=this.getDrillabilityForCtxValue(_5d3[0].split(":")[0]);
}
}
}
}
if(this.isDefaultDrillUp(_5d1)){
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
var _5d4=this.m_oCV.getSelectionController();
var _5d5=_5d4.getAllSelectedObjects();
this.drillability=0;
if(_5d5!=null&&typeof _5d5!="undefined"&&_5d5.length==1&&_5d5[0].m_contextIds!=null){
if(_5d5[0].getLayoutType()=="section"){
this.drillability=0;
}else{
if(_5d5[0].m_contextIds.length==0){
this.drillability=0;
}else{
if(typeof DrillContextMenuHelper!=="undefined"&&DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV)){
this.drillability=this.getDrillabilityForAll(_5d5[0].m_contextIds);
}else{
if(_5d5[0].m_contextIds.length>2){
this.drillability=this.getDrillabilityForIntersection(_5d5[0].m_contextIds[1][0],_5d5[0].m_contextIds[2][0]);
}else{
this.drillability=this.getDrillabilityForCtxValue(_5d5[0].m_contextIds[0][0]);
}
}
}
}
}
return this.drillability;
};
DrillUpDownAction.prototype.getDrillabilityForCtxValue=function(_5d6){
var _5d7=0;
var _5d8=this.m_oCV.getSelectionController();
var _5d9=_5d8.getRefDataItem(_5d6);
if(this.getHierarchyHasExpandedSet(this.m_oCV,_5d9)&&this.getIsRSDrillParent(this.m_oCV,_5d9)){
_5d7=1;
return _5d7;
}
if(_5d8.getMun(_5d6)!==""&&_5d8.getUsageInfo(_5d6)!=="2"){
_5d7=(+_5d8.getDrillFlagForMember(_5d6));
var _5da=this.getDrillabilityForItemFromReportInfo(_5d8.getRefDataItem(_5d6));
if(_5da!=null){
if(_5da.disableDown==true||_5da.isolated==true){
if(_5d7==1||_5d7>=3||_5da.isolated==true){
_5d7=1;
}else{
_5d7=0;
}
}
if(_5da.disableUp==true){
if(_5d7>=2){
_5d7=2;
}else{
_5d7=0;
}
}
}
}
return _5d7;
};
DrillUpDownAction.prototype.getDrillabilityForIntersection=function(_5db,_5dc){
var _5dd=this.getDrillabilityForCtxValue(_5db);
return this.mergeDrillability(_5dd,_5dc);
};
DrillUpDownAction.prototype.getDrillabilityForAll=function(_5de){
var _5df=(_5de.length>=2)?1:0;
var _5e0;
if(_5de.length==2){
_5e0=1;
}else{
if(_5de.length>2){
_5e0=2;
}else{
_5e0=0;
}
}
var _5e1=0;
for(var iDim=_5df;iDim<=_5e0;++iDim){
for(var _5e3=0;_5e3<_5de[iDim].length;++_5e3){
_5e1=this.mergeDrillability(_5e1,_5de[iDim][_5e3]);
}
}
return _5e1;
};
DrillUpDownAction.prototype.mergeDrillability=function(_5e4,_5e5){
var _5e6=this.getDrillabilityForCtxValue(_5e5);
if(_5e4==_5e6){
return _5e4;
}
if(_5e4>_5e6){
var temp=_5e4;
_5e4=_5e6;
_5e6=temp;
}
if(_5e4==1&&_5e6==2){
return 3;
}
return _5e6;
};
DrillUpDownAction.prototype.hasPermission=function(){
if(this.m_oCV){
if(this.m_oCV.isDrillBlackListed()){
return false;
}
var _5e8=this.m_oCV.envParams;
if(_5e8){
return !(this.m_oCV.isLimitedInteractiveMode()||(_5e8["cv.objectPermissions"].indexOf("read")===-1));
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
DrillUpDownAction.prototype.isDefaultDrillUp=function(_5e9){
if(this.drillability==1||this.drillability==4||(_5e9&&_5e9.getAttribute("ischarttitle")==="true")){
return true;
}else{
return false;
}
};
DrillUpDownAction.prototype.doOnMouseOver=function(evt){
if(this.drillability>0&&!this.getCognosViewer().isLimitedInteractiveMode()){
var _5eb=getCtxNodeFromEvent(evt);
this.addDrillableClass(_5eb);
if(evt.toElement&&evt.toElement.nodeName&&evt.toElement.nodeName.toLowerCase()=="img"){
this.addDrillableClass(evt.toElement);
}
}
};
DrillUpDownAction.prototype.doOnMouseOut=function(evt){
var _5ed=getCtxNodeFromEvent(evt);
if(_5ed){
this.removeDrillableClass(_5ed);
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
var _5f1=getCtxNodeFromEvent(evt);
if(_5f1!=null){
this.removeDrillableClass(_5f1);
}
}
};
DrillUpDownAction.prototype.addDrillableClass=function(node){
if(!node.className.match(new RegExp("(\\s|^)"+this.getHoverClassName()+"(\\s|$)"))){
node.className+=" "+this.getHoverClassName();
}
};
DrillUpDownAction.prototype.removeDrillableClass=function(node){
var _5f4=node.className;
_5f4=_5f4.replace(new RegExp("(\\s|^)"+this.getHoverClassName()+"(\\s|$)")," ");
node.className=_5f4.replace(/^\s*/,"").replace(/\s*$/,"");
};
function DrillUpDownOrThroughAction(){
this.m_hasAuthoredDrillTargets=false;
this.m_canDrillUpDown=false;
};
DrillUpDownOrThroughAction.prototype=new DrillUpDownAction();
DrillUpDownOrThroughAction.prototype.init=function(_5f5,_5f6){
if(this.getCognosViewer()){
var _5f7=this.getCognosViewer().getViewerWidget();
if(_5f7&&_5f7.isSelectionFilterEnabled()){
return;
}else{
if(this.m_oCV.isDrillBlackListed()){
return;
}
}
}
this.m_hasAuthoredDrillTargets=_5f5;
this.m_canDrillUpDown=_5f6;
};
DrillUpDownOrThroughAction.prototype.updateDrillabilityInfo=function(_5f8,_5f9){
if(this.m_canDrillUpDown){
return this.updateDrillability(_5f8,_5f9);
}
return null;
};
DrillUpDownOrThroughAction.prototype.onMouseOver=function(evt){
if(this.m_hasAuthoredDrillTargets){
var _5fb=getCtxNodeFromEvent(evt);
if(_5fb){
this.addDrillableClass(_5fb);
this._set_chartImage_drillThroughCursor_IE("pointer",evt);
}
}
if(this.m_canDrillUpDown&&!this.isSelectionFilterEnabled()&&!this.m_oCV.isDrillBlackListed()){
this.doOnMouseOver(evt);
}
};
DrillUpDownOrThroughAction.prototype.onMouseOut=function(evt){
if(this.m_hasAuthoredDrillTargets){
var _5fd=getCtxNodeFromEvent(evt);
if(_5fd){
this.removeDrillableClass(_5fd);
this._set_chartImage_drillThroughCursor_IE("default",evt);
}
}
if(this.m_canDrillUpDown&&!this.isSelectionFilterEnabled()&&!this.m_oCV.isDrillBlackListed()){
this.doOnMouseOut(evt);
}
};
DrillUpDownOrThroughAction.prototype._getDrillThroughChartImage_from_chartArea=function(evt){
var _5ff=getCrossBrowserNode(evt);
if(_5ff){
var _600=this.m_oCV.getSelectionController();
return _600.getSelectedChartImageFromChartArea(_5ff);
}
};
DrillUpDownOrThroughAction.prototype._set_chartImage_drillThroughCursor_IE=function(_601,evt){
if(dojo.isIE||dojo.isTrident){
var oImg=this._getDrillThroughChartImage_from_chartArea(evt);
if(oImg){
oImg.style.cursor=_601;
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
DrillDownAction.prototype.updateMenu=function(_604){
_604.visible=this.ifContainsInteractiveDataContainer();
if(!_604.visible){
return _604;
}
this.updateDrillabilityFromSelections();
if(!this.canDrillDown()){
_604.disabled=true;
}else{
_604.disabled=false;
DrillContextMenuHelper.updateDrillMenuItems(_604,this.m_oCV,this.m_sAction);
}
return _604;
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
DrillUpAction.prototype.updateMenu=function(_605){
_605.visible=this.ifContainsInteractiveDataContainer();
if(!_605.visible){
return _605;
}
this.updateDrillabilityFromSelections();
if(!this.canDrillUp()){
_605.disabled=true;
}else{
_605.disabled=false;
DrillContextMenuHelper.updateDrillMenuItems(_605,this.m_oCV,this.m_sAction);
}
return _605;
};
function DeleteAction(){
this.m_sAction="Delete";
};
DeleteAction.prototype=new ModifyReportAction();
DeleteAction.baseclass=ModifyReportAction.prototype;
DeleteAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_DELETE;
};
DeleteAction.prototype.canDelete=function(){
if(!this.m_oCV.isLimitedInteractiveMode()){
var _606=this.m_oCV.getSelectionController().getAllSelectedObjects();
if(_606.length>0){
for(var i=0;i<_606.length;++i){
var _608=_606[i];
var _609=_608.getCellRef();
if(!_608.hasContextInformation()||_608.isHomeCell()||(_608.getLayoutType()!="columnTitle"&&_608.getDataContainerType()!="list")||_609.getAttribute("cc")=="true"){
return false;
}
}
return true;
}
}
return false;
};
DeleteAction.prototype.execute=function(){
DeleteAction.baseclass.execute.call(this);
this.m_oCV.getSelectionController().clearSelectionData();
this.m_oCV.getViewerWidget().onContextMenu(null);
};
DeleteAction.prototype.keepRAPCache=function(){
return false;
};
DeleteAction.prototype.updateMenu=function(_60a){
_60a.visible=this.ifContainsInteractiveDataContainer();
if(!_60a.visible){
return _60a;
}
_60a.disabled=!this.canDelete();
return _60a;
};
DeleteAction.prototype.addActionContextAdditionalParms=function(){
return this.getSelectedCellTags();
};
function UndoableClientActionBase(){
};
UndoableClientActionBase.prototype=new CognosViewerAction();
UndoableClientActionBase.prototype.setContainerId=function(_60b){
this.m_sContainerId=_60b;
};
UndoableClientActionBase.prototype.doRedo=function(_60c){
this.setContainerId(_60c);
this.execute();
};
UndoableClientActionBase.prototype.doUndo=function(_60d){
factory=this.getCognosViewer().getActionFactory();
var _60e=factory.load(this.getUndoClass());
_60e.setContainerId(_60d);
_60e.execute();
};
UndoableClientActionBase.prototype.getSelectedContainerId=function(){
var _60f=this.m_oCV.getSelectionController().getAllSelectedObjects();
if(_60f&&_60f.length){
var lid=_60f[0].getLayoutElementId();
if(lid){
return this.removeNamespace(lid);
}
}
return null;
};
function FreezeRowHeadingsAction(){
};
FreezeRowHeadingsAction.prototype=new UndoableClientActionBase();
FreezeRowHeadingsAction.superclass=UndoableClientActionBase.prototype;
FreezeRowHeadingsAction.prototype.execute=function(){
var _611=this.m_sContainerId?this.m_sContainerId:this.getSelectedCrosstabContainerId();
if(_611){
this.m_oCV.getSelectionController().resetSelections();
this.m_oCV.getPinFreezeManager().freezeContainerRowHeadings(_611);
this.addClientSideUndo(this,[_611]);
}
};
FreezeRowHeadingsAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_FREEZEROWHEADINGS;
};
FreezeRowHeadingsAction.prototype.getUndoClass=function(){
return "UnfreezeRowHeadings";
};
FreezeRowHeadingsAction.prototype.getSelectedCrosstabContainerLid=function(){
var _612=this.m_oCV.getSelectionController().getAllSelectedObjects();
if(_612&&_612.length&&_612[0].getDataContainerType()=="crosstab"){
var lid=(_612[0].getLayoutElementId());
if(lid){
return lid;
}
}
return null;
};
FreezeRowHeadingsAction.prototype.getSelectedCrosstabContainerId=function(){
var lid=this.getSelectedCrosstabContainerLid();
if(lid){
return this.removeNamespace(lid);
}
return null;
};
FreezeRowHeadingsAction.prototype.canFreezeRowHeadings=function(){
var _615=this.m_oCV.getPinFreezeManager();
if(_615){
var _616=this.getSelectedCrosstabContainerId();
if(_616){
if(!_615.hasFrozenRowHeadings(_616)&&_615.getValidSelectedContainerId(false)){
return true;
}
}
}
return false;
};
FreezeRowHeadingsAction.prototype.updateMenu=function(_617){
_617.visible=this.canFreezeRowHeadings();
return _617;
};
function UnfreezeRowHeadingsAction(){
};
UnfreezeRowHeadingsAction.prototype=new UndoableClientActionBase();
UnfreezeRowHeadingsAction.superclass=UndoableClientActionBase.prototype;
UnfreezeRowHeadingsAction.prototype.execute=function(){
if(this.m_oCV.getPinFreezeManager()){
var _618=document.getElementById("CVReport"+this.m_oCV.getId());
var _619=this.m_sContainerId?this.m_sContainerId:this.getSelectedContainerId();
this.m_oCV.getSelectionController().resetSelections();
this.m_oCV.getPinFreezeManager().unfreezeContainerRowHeadings(_619,_618);
this.addClientSideUndo(this,[_619]);
}
};
UnfreezeRowHeadingsAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_UNFREEZEROWHEADINGS;
};
UnfreezeRowHeadingsAction.prototype.getUndoClass=function(){
return "FreezeRowHeadings";
};
UnfreezeRowHeadingsAction.prototype.areRowHeadingsFrozen=function(){
if(this.m_oCV.getPinFreezeManager()&&this.m_oCV.getPinFreezeManager().hasFrozenRowHeadings(this.getSelectedContainerId())){
return true;
}
return false;
};
UnfreezeRowHeadingsAction.prototype.updateMenu=function(_61a){
_61a.visible=this.areRowHeadingsFrozen();
return _61a;
};
function FreezeColumnHeadingsAction(){
};
FreezeColumnHeadingsAction.prototype=new UndoableClientActionBase();
FreezeColumnHeadingsAction.superclass=UndoableClientActionBase.prototype;
FreezeColumnHeadingsAction.prototype.execute=function(){
var _61b=this.m_sContainerId?this.m_sContainerId:this.getSelectedCrosstabOrListContainerId();
if(_61b){
this.m_oCV.getSelectionController().resetSelections();
this.m_oCV.getPinFreezeManager().freezeContainerColumnHeadings(_61b);
this.addClientSideUndo(this,[_61b]);
}
};
FreezeColumnHeadingsAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_FREEZECOLUMNHEADINGS;
};
FreezeColumnHeadingsAction.prototype.getUndoClass=function(){
return "UnfreezeColumnHeadings";
};
FreezeColumnHeadingsAction.prototype.getSelectedCrosstabOrListContainerLid=function(){
var _61c=this.m_oCV.getSelectionController().getAllSelectedObjects();
if(_61c&&_61c.length&&(_61c[0].getDataContainerType()=="crosstab"||_61c[0].getDataContainerType()=="list")){
var lid=(_61c[0].getLayoutElementId());
if(lid){
return lid;
}
}
return null;
};
FreezeColumnHeadingsAction.prototype.getSelectedCrosstabOrListContainerId=function(){
var lid=this.getSelectedCrosstabOrListContainerLid();
if(lid){
return this.removeNamespace(lid);
}
return null;
};
FreezeColumnHeadingsAction.prototype.canFreezeColumnHeadings=function(){
var _61f=this.m_oCV.getPinFreezeManager();
if(_61f){
var _620=this.getSelectedCrosstabOrListContainerId();
if(_620){
if(!_61f.hasFrozenColumnHeadings(_620)&&_61f.getValidSelectedContainerId(true)){
return true;
}
}
return false;
}
};
FreezeColumnHeadingsAction.prototype.updateMenu=function(_621){
_621.visible=this.canFreezeColumnHeadings();
return _621;
};
function UnfreezeColumnHeadingsAction(){
};
UnfreezeColumnHeadingsAction.prototype=new UndoableClientActionBase();
UnfreezeColumnHeadingsAction.superclass=UndoableClientActionBase.prototype;
UnfreezeColumnHeadingsAction.prototype.execute=function(){
if(this.m_oCV.getPinFreezeManager()){
var _622=document.getElementById("CVReport"+this.m_oCV.getId());
var _623=this.m_sContainerId?this.m_sContainerId:this.getSelectedContainerId();
this.m_oCV.getSelectionController().resetSelections();
this.m_oCV.getPinFreezeManager().unfreezeContainerColumnHeadings(_623,_622);
this.addClientSideUndo(this,[_623]);
}
};
UnfreezeColumnHeadingsAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_UNFREEZECOLUMNHEADINGS;
};
UnfreezeColumnHeadingsAction.prototype.getUndoClass=function(){
return "FreezeColumnHeadings";
};
UnfreezeColumnHeadingsAction.prototype.areColumnHeadingsFrozen=function(){
if(this.m_oCV.getPinFreezeManager()&&this.m_oCV.getPinFreezeManager().hasFrozenColumnHeadings(this.getSelectedContainerId())){
return true;
}
return false;
};
UnfreezeColumnHeadingsAction.prototype.updateMenu=function(_624){
_624.visible=this.areColumnHeadingsFrozen();
return _624;
};
function GlossaryAction(){
};
GlossaryAction.prototype=new CognosViewerAction();
GlossaryAction.prototype.execute=function(){
var _625=this.getCognosViewer();
_625.loadExtra();
var _626=_625.getSelectionController();
var _627=_626.getAllSelectedObjects();
if(_627.length>0){
var _628=null;
if(typeof MDSRV_CognosConfiguration!="undefined"){
_628=new MDSRV_CognosConfiguration();
var _629="";
if(_625.envParams["glossaryURI"]){
_629=_625.envParams["glossaryURI"];
}
_628.addProperty("glossaryURI",_629);
_628.addProperty("gatewayURI",_625.getGateway());
}
var _62a=_625.envParams["ui.object"];
var _62b=getViewerSelectionContext(_626,new CSelectionContext(_62a));
var _62c=new MDSRV_BusinessGlossary(_628,_62b);
_62c.open();
}
};
GlossaryAction.prototype.updateMenu=function(_62d){
if(!this.getCognosViewer().bCanUseGlossary){
return "";
}
var _62e=this.selectionHasContext();
if(!_62e||this.getCognosViewer().envParams["glossaryURI"]==null||this.getCognosViewer().envParams["glossaryURI"]==""){
_62d.disabled=true;
}else{
_62d.disabled=false;
}
return _62d;
};
function GroupAction(){
this.m_sAction="GroupColumn";
};
GroupAction.prototype=new ModifyReportAction();
GroupAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_GROUP_UNGROUP;
};
GroupAction.prototype.updateMenu=function(_62f){
_62f.visible=this.ifContainsInteractiveDataContainer();
if(!_62f.visible){
return _62f;
}
var _630=this.m_oCV.getSelectionController();
var _631=_630.getAllSelectedObjects();
if(_631.length===0||_630.getDataContainerType()!="list"){
return this.disableMenuItem(_62f);
}
if(_631[0].getCellRef().getAttribute("no_data_item_column")==="true"){
return this.disableMenuItem(_62f);
}
var _632=!_630.isRelational();
for(var _633=0;_633<_631.length;++_633){
if(_630.getUsageInfo(_631[_633].getSelectedContextIds()[0][0])==_630.c_usageMeasure&&(_632||_631[_633].getLayoutType()==="summary")){
return this.disableMenuItem(_62f);
}
}
_62f.disabled=false;
_62f.iconClass="group";
return _62f;
};
GroupAction.prototype.disableMenuItem=function(_634){
_634.disabled=true;
_634.iconClass="groupDisabled";
return _634;
};
GroupAction.prototype.addActionContextAdditionalParms=function(){
return this.addClientContextData(3);
};
function LoadMenuAction(){
this.m_action=null;
};
LoadMenuAction.prototype=new CognosViewerAction();
LoadMenuAction.prototype.FROM_TOOLBAR="toolbar";
LoadMenuAction.prototype.FROM_TOOLBAR_BLUEDOTMENU="toolbarBlueDotMenu";
LoadMenuAction.prototype.FROM_CONTEXTMENU="contextMenu";
LoadMenuAction.prototype.FROM_CONTEXTMENU_MOREACTIONS="contextMenuMoreActions";
LoadMenuAction.prototype.TOOLBAR_UPDATE_EVENT="com.ibm.bux.widgetchrome.toolbar.update";
LoadMenuAction.prototype.CONTEXTMENU_UPDATE_EVENT="com.ibm.bux.widget.contextMenu.update";
LoadMenuAction.prototype.setRequestParms=function(_635){
this.m_action=_635.action;
this.m_sFrom=(_635.from)?_635.from:this.FROM_TOOLBAR;
};
LoadMenuAction.prototype.execute=function(){
var _636=this.m_oCV.getActionFactory();
var _637=_636.load(this.m_action);
var _638=this.getMenuSpec();
var _639=GUtil.generateCallback(this.buildMenuCallback,[_638],this);
_638=_637.buildMenu(_638,_639);
if(_638!=null){
this.buildMenuCallback(_638);
}
};
LoadMenuAction.prototype.buildMenuCallback=function(_63a){
_63a.open=true;
_63a.action=null;
this.fireEvent(_63a);
};
LoadMenuAction.prototype.getMenuSpec=function(){
var oCV=this.m_oCV;
var _63c=this.m_sFrom;
if(!_63c||!oCV){
return null;
}
var _63d=null;
var _63e=null;
switch(_63c){
case this.FROM_TOOLBAR:
_63d=oCV.getToolbar();
break;
case this.FROM_TOOLBAR_BLUEDOTMENU:
_63d=oCV.findBlueDotMenu();
break;
case this.FROM_CONTEXTMENU_MOREACTIONS:
_63d=oCV.findToolbarItem("MoreActions",oCV.getContextMenu());
break;
}
if(_63d){
_63e=oCV.findToolbarItem(this.m_action,_63d);
}
if(_63e){
_63e.from=_63c;
}
return _63e;
};
LoadMenuAction.prototype.fireEvent=function(_63f){
var _640=[];
if(_63f){
_640.push(_63f);
}
var _641=this.m_oCV.getViewerWidget();
var _642=_63f.from;
switch(_642){
case this.FROM_TOOLBAR:
case this.FROM_TOOLBAR_BLUEDOTMENU:
_641.fireEvent(this.TOOLBAR_UPDATE_EVENT,null,_640);
break;
case this.FROM_CONTEXTMENU_MOREACTIONS:
_641.fireEvent(this.CONTEXTMENU_UPDATE_EVENT,null,_640);
break;
}
};
function MoveAction(){
this.m_sAction="Reorder";
};
MoveAction.prototype=new DragDropAction();
MoveAction.prototype.setRequestParms=function(_643){
this.m_order=_643.order;
};
MoveAction.prototype.canMoveLeftRight=function(_644){
var _645=this.m_oCV.getSelectionController();
if(_645&&_645.getAllSelectedObjects().length==1){
var _646=_645.getAllSelectedObjects()[0].getCellRef();
if(_644=="right"&&_646.nextSibling){
return true;
}else{
if(_644=="left"&&_646.previousSibling){
return true;
}
}
}
return false;
};
MoveAction.prototype.updateMenu=function(_647){
if(!this.canMove()){
_647="";
}else{
var _648=this.m_oCV.getSelectionController();
if(_648&&_648.getAllSelectedObjects().length>1){
_647.disabled=true;
_647.items=null;
}else{
_647.disabled=false;
_647.items=[];
_647.items.push({disabled:!this.canMoveLeftRight("left"),name:"Move",label:RV_RES.IDS_JS_LEFT,iconClass:"moveLeft",action:{name:"Move",payload:{order:"left"}},items:null});
_647.items.push({disabled:!this.canMoveLeftRight("right"),name:"Move",label:RV_RES.IDS_JS_RIGHT,iconClass:"moveRight",action:{name:"Move",payload:{order:"right"}},items:null});
}
}
return _647;
};
MoveAction.prototype.addActionContextAdditionalParms=function(){
var _649=this.getCognosViewer().getSelectionController();
var _64a=null;
if(this.m_order=="right"){
_64a=_649.getAllSelectedObjects()[0].getCellRef().nextSibling;
}else{
_64a=_649.getAllSelectedObjects()[0].getCellRef().previousSibling;
}
var _64b=_649.buildSelectionObject(_64a,null);
var tag=this.m_order=="right"?"after":"before";
var _64d=this.getRAPLayoutTag(_64a);
_64d=(_64d!=null)?_64d:_64b.getColumnName();
return this.getSelectedCellTags()+"<"+tag+">"+xml_encode(_64d)+"</"+tag+">";
};
function RefreshViewAction(){
this.m_bCanvasRefreshEvent=false;
};
RefreshViewAction.prototype=new CognosViewerAction();
RefreshViewAction.prototype.addCommonOptions=function(_64e){
var _64f=this.getCognosViewer().getViewerWidget();
if(this.m_bCanvasRefreshEvent&&_64f.getSavedOutputSearchPath()!=null){
_64e.addFormField("ui.savedOutputSearchPath",encodeURIComponent(_64f.getSavedOutputSearchPath()));
}else{
_64f.setSavedOutputsCMResponse(null);
_64f.setSavedOutputSearchPath(null);
}
_64e.addFormField("run.outputFormat","HTML");
_64e.addFormField("widget.reloadToolbar","true");
_64f.clearPropertiesDialog();
var _650=document.getElementById("formWarpRequest"+this.getCognosViewer().getId());
_64e.addFormField("ui.object",_650["reRunObj"].value);
};
RefreshViewAction.prototype.execute=function(){
var _651=this.createCognosViewerDispatcherEntry("buxDropReportOnCanvas");
this.addCommonOptions(_651);
var oCV=this.getCognosViewer();
var _653=oCV.getViewerWidget();
if(oCV.getCurrentlySelectedTab()&&_653.getSavedOutput()){
oCV.setKeepTabSelected(oCV.getCurrentlySelectedTab());
}
this.getCognosViewer().dispatchRequest(_651);
};
RefreshViewAction.prototype.doAddActionContext=function(){
return false;
};
RefreshViewAction.prototype.updateMenu=function(_654){
_654.disabled=false;
var oCV=this.getCognosViewer();
if(oCV){
var _656=oCV.getViewerWidget();
if(_656&&_656.getSavedOutputSearchPath()!=null){
_654.disabled=true;
}
}
return _654;
};
function RefreshViewEventAction(){
this.m_bCanvasRefreshEvent=true;
};
RefreshViewEventAction.prototype=new RefreshViewAction();
function RenameDataItemAction(){
this.m_sAction="Rename";
this.m_newLabel="";
this.m_prevLabel="";
this.m_containerId="";
this.m_bUndoAdded=false;
};
RenameDataItemAction.prototype=new ModifyReportAction();
RenameDataItemAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_RENAME;
};
RenameDataItemAction.prototype.saveSpecForUndo=function(){
return true;
};
RenameDataItemAction.prototype.getContainerId=function(){
return this.m_containerId;
};
RenameDataItemAction.prototype.addActionContextAdditionalParms=function(){
var _657=this.getSelectedCellTags();
return (_657+"<prevName>"+xml_encode(this.m_prevLabel)+"</prevName>"+"<toName>"+xml_encode(this.m_newLabel)+"</toName>");
};
RenameDataItemAction.prototype.onMouseOver=function(evt){
var _659=getCtxNodeFromEvent(evt);
_659.style.cursor=this.canRename()?"text":"default";
};
RenameDataItemAction.prototype.onMouseOut=function(evt){
var _65b=getCtxNodeFromEvent(evt);
_65b.style.cursor="default";
};
RenameDataItemAction.prototype.onDoubleClick=function(evt){
if(this.canRename()){
var _65d=getCtxNodeFromEvent(evt);
this.insertTextArea(_65d);
}
};
RenameDataItemAction.prototype.canRename=function(){
if(this.m_oCV.isBlacklisted("RenameFromContextMenu")){
return false;
}
var _65e=this.m_oCV.getSelectionController();
var _65f=_65e.getAllSelectedObjects().length;
if(_65f==1&&!this.m_oCV.isLimitedInteractiveMode()){
var _660=_65e.getAllSelectedObjects()[0];
if(_660.hasContextInformation()){
var _661=_660.getSelectedContextIds()[0][0];
var _662=_660.getCellRef();
return this.checkRenamableConditions(_660,_662,_661,_65e);
}
}
return false;
};
RenameDataItemAction.prototype.checkRenamableConditions=function(_663,_664,_665,_666){
if(_663.isHomeCell()){
return false;
}
if(_663.getLayoutType()=="columnTitle"&&_666.selectionsHaveCalculationMetadata()){
if(_663.getDataContainerType()=="crosstab"&&!_666.areSelectionsMeasureOrCalculation()){
return false;
}
return true;
}
if(_663.getLayoutType()=="columnTitle"&&_663.getDataContainerType()=="crosstab"){
return false;
}
if(_663.getLayoutType()!="columnTitle"){
return false;
}
if(_664.getAttribute("cc")=="true"){
return false;
}
if(_664.getAttribute("CTNM")!=null&&_666.getMun(_665)!=""){
return false;
}
return true;
};
RenameDataItemAction.prototype.insertTextArea=function(_667){
var _668=document.createElement("label");
_668.style.height="1px";
_668.style.width="1px";
_668.style.overflow="hidden";
_668.style.position="absolute";
_668.style.left="0px";
_668.style.top="-500px";
_668.setAttribute("for","rename"+this.m_oCV.getId());
_668.id="renameLabel"+this.m_oCV.getId();
_668.innerHTML=RV_RES.IDS_JS_RENAME_LABEL;
var _669=document.createElement("input");
_669.id="rename"+this.m_oCV.getId();
_669.name="rename"+this.m_oCV.getId();
_669.type="text";
_669.value=_667.childNodes[0].nodeValue;
_669.style.backgroundColor="transparent";
_669.style.borderWidth="0px";
_669.style.padding="0px";
_669.style.margin="0px";
_669.setAttribute("role","textbox");
_669.setAttribute("aria-labelledby","renameLabel"+this.m_oCV.getId());
var _66a=_667.parentNode.scrollWidth-10;
var _66b=_667.parentNode.firstChild;
while(_66b){
if(_66b!=_667){
_66a-=_66b.scrollWidth;
}
_66b=_66b.nextSibling;
}
_669.style.width=_66a+"px";
_669.ctxNode=_667;
_669.action=this;
_669.originalLabel=_667.childNodes[0].nodeValue;
if(isIE()){
_669.style.fontFamily=_667.currentStyle.fontFamily;
_669.style.fontSize=_667.currentStyle.fontSize;
_669.style.fontStyle=_667.currentStyle.fontStyle;
_669.style.fontVariant=_667.currentStyle.fontVariant;
_669.style.fontWeight=_667.currentStyle.fontWeight;
_669.attachEvent("onblur",this.onBlur);
_669.attachEvent("onkeydown",this.onKeyDown);
_669.style.overflow="hidden";
}else{
_669.style.font="inherit";
_669.addEventListener("blur",this.onBlur,false);
_669.addEventListener("keydown",this.onKeyDown,false);
_669.style.overflow="visible";
}
_667.innerHTML="";
_667.appendChild(_668);
_667.appendChild(_669);
_669.focus();
_669.select();
};
RenameDataItemAction.prototype.onMouseDown=function(evt){
if(evt){
try{
var node=evt.originalTarget?evt.originalTarget:evt.srcElement;
if(node&&node.getAttribute("id")==="rename"+this.m_oCV.getId()){
return true;
}
}
catch(ex){
}
}
return false;
};
RenameDataItemAction.prototype.onBlur=function(evt){
var node;
if(isIE()){
node=getNodeFromEvent(evt);
}else{
node=this;
}
var _670=node.ctxNode;
var _671=node.action;
var _672=node.value!=""?node.value:node.innerHTML;
_671.updateLabel(_670,_672,node.originalLabel);
};
RenameDataItemAction.prototype.onKeyDown=function(evt){
var _674="";
var node=getNodeFromEvent(evt);
if(evt.keyCode=="13"){
_674=node.value!=""?node.value:node.originalLabel;
}else{
if(evt.keyCode=="27"){
_674=node.originalLabel;
}
}
if(_674!=""){
var _676=node.ctxNode;
var _677=node.action;
_677.updateLabel(_676,_674,node.originalLabel);
return stopEventBubble(evt);
}else{
return true;
}
};
RenameDataItemAction.prototype.updateLabel=function(_678,_679,_67a){
this.m_newLabel=_679;
this.m_prevLabel=_67a;
_678.innerHTML="";
_678.appendChild(document.createTextNode(_679));
var _67b=this.m_oCV.getSelectionController();
if(_67b!=null&&_679!=_67a){
var _67c=new CSelectionObjectFactory(_67b);
this.m_containerId=this.removeNamespace(_67c.getLayoutElementId(_678));
var _67d=_67c.getSelectionObject(_678.parentNode);
_67b.m_aSelectedObjects[0]=_67d;
var _67e=_67d.getCellRef().getElementsByTagName("span");
var span=null;
if(_67e){
for(var i=0;i<_67e.length;i++){
span=_67e[i];
if(span.getAttribute("ctx")!=null&&span.style.visibility!="hidden"){
span.focus();
break;
}
}
}
this.execute();
}
};
RenameDataItemAction.prototype.buildUrl=function(){
var _681="b_action=cognosViewer&ui.action=modifyReport&cv.responseFormat=xml";
var _682=this.addActionContext();
_681+="&cv.actionContext="+encodeURIComponent(_682);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_682,"xml");
}
_681+="&ui.object="+encodeURIComponent(this.m_oCV.envParams["ui.object"]);
if(typeof this.m_oCV.envParams["ui.spec"]!="undefined"){
_681+="&ui.spec="+encodeURIComponent(this.m_oCV.envParams["ui.spec"]);
}
if(typeof this.m_oCV.getModelPath()!=""){
_681+="&modelPath="+encodeURIComponent(this.m_oCV.getModelPath());
}
return _681;
};
RenameDataItemAction.prototype.keepRAPCache=function(){
return false;
};
RenameDataItemAction.prototype.reuseQuery=function(){
return true;
};
function RenameFromContextMenuAction(){
};
RenameFromContextMenuAction.prototype=new RenameDataItemAction();
RenameFromContextMenuAction.prototype.canRename=function(_683){
if(!_683||_683.hasContextInformation()==false){
return false;
}
var _684=this.m_oCV.getSelectionController();
var _685=_683.getSelectedContextIds()[0][0];
var _686=_683.getCellRef();
return this.checkRenamableConditions(_683,_686,_685,_684);
};
RenameFromContextMenuAction.prototype.updateMenu=function(_687){
_687.visible=this.ifContainsInteractiveDataContainer();
if(!_687.visible){
return _687;
}
var _688=this.m_oCV.getSelectionController();
var _689=_688.getAllSelectedObjects().length;
if(_689!=1){
for(var _68a=0;_68a<_689;_68a++){
if(!this.canRename(_688.getAllSelectedObjects()[_68a])){
return "";
}
}
_687.disabled=true;
}else{
if(!this.canRename(_688.getAllSelectedObjects()[0])){
_687="";
}else{
_687.disabled=false;
}
}
return _687;
};
RenameFromContextMenuAction.prototype.getSpanFromCellRef=function(_68b){
var _68c=_68b.getElementsByTagName("span");
var span=null;
if(_68c){
for(var i=0;i<_68c.length;i++){
span=_68c[i];
if(span.getAttribute("ctx")!=null&&span.style.visibility!="hidden"){
break;
}
}
}
return span;
};
RenameFromContextMenuAction.prototype.execute=function(){
var _68f=this.m_oCV.getSelectionController().getAllSelectedObjects()[0].getCellRef();
if(_68f){
var span=this.getSpanFromCellRef(_68f);
var _691=this.m_oCV.getAction("RenameDataItem");
_691.insertTextArea(span);
}
};
function ResetToOriginalAction(){
};
ResetToOriginalAction.prototype=new CognosViewerAction();
ResetToOriginalAction.prototype.updateMenu=function(_692){
var _693=this.getCognosViewer().envParams.baseReportAvailable;
_692.disabled=(_693==="false")?true:_692.disabled;
return _692;
};
ResetToOriginalAction.prototype.execute=function(){
var _694=viewer.dialogs.ConfirmationDialog(RV_RES.IDS_JS_RESET_TO_ORIGINAL,RV_RES.IDS_JS_RESET_TO_ORIGINAL_WARNING,RV_RES.IDS_JS_RESET_TO_ORIGINAL_WARNING_DESC,null,this,this.executeAction);
_694.startup();
_694.show();
};
ResetToOriginalAction.prototype.executeAction=function(_695){
this.gatherFilterInfoBeforeAction("ResetToOriginal");
ChangePaletteAction.reset(this.getCognosViewer());
};
ResetToOriginalAction.prototype.dispatchRequest=function(_696){
var _697=this.getCognosViewer();
var _698=_697.getViewerWidget();
_698.reset();
var _699=_698.getAttributeValue("originalReport");
if(!_699){
var _69a=_698.getSavedItem();
if(_698.isSavedReport(_699,_69a)){
_699=_69a;
}
}
var _69b=_698.getAttributeValue("originalReportPart");
var _69c=_697.envParams["cv.objectPermissions"];
var _69d=_697.envParams["bpmRestURI"];
var _69e=_697.envParams["glossaryURI"];
var _69f=_697.envParams["metadataInformationURI"];
var _6a0=_697.envParams["ui.routingServerGroup"];
delete _697.envParams;
_697.envParams={};
_697.envParams["ui.object"]=_699;
_697.envParams["originalReport"]=_699;
_697.envParams["bux"]="true";
_697.envParams["cv.objectPermissions"]=_69c;
_697.envParams["ui.routingServerGroup"]=_6a0;
if(_69d){
_697.envParams["bpmRestURI"]=_69d;
}
if(_69e){
_697.envParams["glossaryURI"]=_69e;
}
if(_69f){
_697.envParams["metadataInformationURI"]=_69f;
}
var _6a1=this.createCognosViewerDispatcherEntry("resetToOriginal");
_6a1.addFormField("run.outputFormat","HTML");
_6a1.addFormField("widget.reloadToolbar","true");
_6a1.addFormField("ui.reportDrop","true");
_697.resetbHasPromptFlag();
_6a1.addFormField("widget.forceGetParameters","true");
if(_696!=""){
_6a1.addFormField("cv.updateDataFilters",_696);
}
_6a1.addFormField("run.prompt","false");
var _6a2=(_69b&&_69b.length>0);
if(_6a2){
_6a1.addFormField("reportpart_id",_69b);
}
_697.hideReportInfo();
_697.dispatchRequest(_6a1);
this.fireModifiedReportEvent();
};
ResetToOriginalAction.prototype.doAddActionContext=function(){
return false;
};
ResetToOriginalAction.prototype.canShowMenuInGlobalArea=function(){
return true;
};
ResetToOriginalAction.prototype.isValidMenuItem=function(){
var _6a3=this.getCognosViewer();
var _6a4=_6a3.getViewerWidget();
if(_6a4.m_isInGlobalArea){
return (this.isPromptWidget()?true:false);
}else{
return (this.isPromptWidget()?false:true);
}
};
function ResizeChartAction(){
this.m_width=0;
this.m_height=0;
this.m_sAction="ChangeDataContainerSize";
this.m_bRunReport=true;
this.m_oChart=null;
};
ResizeChartAction.prototype=new ModifyReportAction();
ResizeChartAction.prototype.isUndoable=function(){
return false;
};
ResizeChartAction.superclass=ModifyReportAction.prototype;
ResizeChartAction.prototype.runReport=function(){
return this.m_bRunReport;
};
ResizeChartAction.prototype.canBeQueued=function(){
return true;
};
ResizeChartAction.prototype.reuseQuery=function(){
return true;
};
ResizeChartAction.PADDING={getWidth:function(){
return 2;
},getHeight:function(){
return 2;
}};
ResizeChartAction.prototype.getActionKey=function(){
return "ResizeChartAction";
};
ResizeChartAction.prototype.setRequestParms=function(_6a5){
if(_6a5&&_6a5.resize){
this.m_width=parseInt(_6a5.resize.w,10)-ResizeChartAction.PADDING.getWidth();
this.m_height=parseInt(_6a5.resize.h,10)-ResizeChartAction.PADDING.getHeight();
}
};
ResizeChartAction.prototype.execute=function(){
if(this.m_oCV.m_readyToRespondToResizeEvent!==true){
return;
}
if(this.m_oCV.getPinFreezeManager()){
this.m_oCV.getPinFreezeManager().resize(this.m_width,this.m_height);
}
if(this.isActionApplicable()){
var _6a6=this.getLayoutComponents();
if(_6a6&&_6a6.length>0){
for(var i=0;i<_6a6.length;++i){
if(_6a6[i].nodeName==="IMG"||_6a6[0].getAttribute("flashChart")!==null){
this.m_oChart=_6a6[i];
break;
}
}
if(this.m_oChart&&this.isNewSizeDifferent()){
if(_6a6[0].getAttribute("flashChart")!==null){
this.m_bRunReport=false;
this.resizeFlashChart();
}else{
this.m_bRunReport=true;
this.resizeChart();
}
}
}
}
};
ResizeChartAction.prototype.isActionApplicable=function(){
var _6a8=this.m_oCV.getRAPReportInfo();
if(_6a8&&_6a8.isSingleContainer()){
return true;
}
return false;
};
ResizeChartAction.prototype.resizeFlashChart=function(){
var size=this.getNewChartSize();
this.m_oChart.setAttribute("width",size.w+"px");
this.m_oChart.setAttribute("height",size.h+"px");
this.resizeChart();
};
ResizeChartAction.prototype.resizeChart=function(){
ResizeChartAction.superclass.execute.call(this);
};
ResizeChartAction.prototype.addActionContextAdditionalParms=function(){
var _6aa="";
var size=this.getNewChartSize();
_6aa+="<height>"+size.h+"px</height>";
_6aa+="<width>"+size.w+"px</width>";
return _6aa;
};
ResizeChartAction.prototype.isNewSizeDifferent=function(){
var _6ac=(this.m_oChart.getAttribute("flashChart")!==null);
var _6ad=_6ac?this.m_oChart.getAttribute("width"):this.m_oChart.style.width;
var _6ae=_6ac?this.m_oChart.getAttribute("height"):this.m_oChart.style.height;
if(!_6ad||_6ad==""){
_6ad=this.m_oChart.width;
_6ae=this.m_oChart.height;
}
return parseInt(_6ad,10)!=this.m_width||parseInt(_6ae,10)!=this.m_height;
};
ResizeChartAction.prototype.getNewChartSize=function(){
var _6af=this.m_oChart;
var _6b0=0;
var _6b1=0;
var _6b2=0;
var _6b3=0;
var _6b4=0;
var _6b5=0;
var _6b6=0;
var _6b7=0;
var _6b8=0;
var _6b9=0;
var _6ba=0;
var _6bb=0;
require(["dojo/dom-style"],function(_6bc){
_6b0=_6bc.get(_6af,"marginLeft");
_6b1=_6bc.get(_6af,"marginRight");
_6b2=_6bc.get(_6af,"marginTop");
_6b3=_6bc.get(_6af,"marginBottom");
_6b4=_6bc.get(_6af,"borderLeftWidth");
_6b5=_6bc.get(_6af,"borderRightWidth");
_6b6=_6bc.get(_6af,"borderTopWidth");
_6b7=_6bc.get(_6af,"borderBottomWidth");
_6b8=_6bc.get(_6af,"paddingLeft");
_6b9=_6bc.get(_6af,"paddingRight");
_6ba=_6bc.get(_6af,"paddingTop");
_6bb=_6bc.get(_6af,"paddingBottom");
});
this.m_width-=_6b4+_6b5+_6b0+_6b1+_6b8+_6b9;
this.m_height-=_6b6+_6b7+_6b2+_6b3+_6ba+_6bb;
if(this.m_keepRatio){
var _6bd=parseInt(this.m_oChart.style.width,10)/parseInt(this.m_oChart.style.height,10);
var _6be=_6bd*this.m_height;
if(_6be>this.m_width){
this.m_height=this.m_width/_6bd;
}
var _6bf=this.m_width/_6bd;
if(_6bf>this.m_height){
this.m_width=this.m_height*_6bd;
}
}
return {w:this.m_width,h:this.m_height};
};
function RetryRequestAction(){
this.m_lastActionParams=null;
};
RetryRequestAction.prototype=new CognosViewerAction();
RetryRequestAction.prototype.setRequestParms=function(_6c0){
this.m_lastActionParams=_6c0;
};
RetryRequestAction.prototype.execute=function(){
if(this.m_lastActionParams){
var _6c1=new ViewerDispatcherEntry(this.m_oCV);
var _6c2=this.m_lastActionParams.keys();
for(var _6c3=0;_6c3<_6c2.length;_6c3++){
_6c1.addFormField(_6c2[_6c3],this.m_lastActionParams.get(_6c2[_6c3]));
}
_6c1.addFormField("cv.responseFormat","data");
_6c1.addFormField("widget.reloadToolbar","true");
_6c1.addNonEmptyStringFormField("limitedInteractiveMode",this.m_oCV.envParams["limitedInteractiveMode"]);
this.m_oCV.dispatchRequest(_6c1);
this.m_oCV.getViewerWidget().setOriginalFormFields(null);
}
};
function RunReportAction(){
this.m_reuseQuery=false;
this.m_promptValues=null;
this.m_sendParameterValues=false;
this.m_clearCascadeParamsList=null;
};
RunReportAction.prototype=new CognosViewerAction();
RunReportAction.prototype.setRequestParams=function(_6c4){
if(!_6c4){
return;
}
this.m_promptValues=_6c4.promptValues;
this.m_clearCascadeParamsList=_6c4.clearCascadeParamsList;
};
RunReportAction.prototype.setSendParameterValues=function(_6c5){
this.m_sendParameterValues=_6c5;
};
RunReportAction.prototype.reuseQuery=function(){
return this.m_reuseQuery;
};
RunReportAction.prototype.setReuseQuery=function(_6c6){
this.m_reuseQuery=_6c6;
};
RunReportAction.prototype.getPromptOption=function(){
return "false";
};
RunReportAction.prototype.canBeQueued=function(){
return false;
};
RunReportAction.prototype.getAction=function(_6c7){
return _6c7?"run":"runSpecification";
};
RunReportAction.prototype.addAdditionalOptions=function(_6c8){
this._addCommonOptions(_6c8);
this._addRunOptionsFromProperties(_6c8);
this._addClearCascadeParams(_6c8);
this._addPromptValuesToRequest(_6c8);
};
RunReportAction.prototype._addClearCascadeParams=function(oReq){
if(!this.m_clearCascadeParamsList||this.m_clearCascadeParamsList.length==0){
return;
}
var _6ca=this.m_clearCascadeParamsList.length;
for(var i=0;i<_6ca;i++){
oReq.addFormField("c"+this.m_clearCascadeParamsList[i],"1");
}
};
RunReportAction.prototype._addPromptValuesToRequest=function(_6cc){
if(!this.m_promptValues){
return;
}
_6cc.addFormField("sharedPromptRequest","true");
for(var _6cd in this.m_promptValues){
_6cc.addFormField(_6cd,this.m_promptValues[_6cd]);
}
};
RunReportAction.prototype._addCommonOptions=function(oReq){
var _6cf=this.getCognosViewer().isLimitedInteractiveMode();
if(typeof this.m_action==="undefined"){
this.m_action=this.getAction(_6cf);
}
oReq.addFormField("run.prompt",this.getPromptOption());
oReq.addFormField("ui.action",this.m_action);
if(_6cf){
oReq.addFormField("run.xslURL","bux.xsl");
}
oReq.addFormField("run.outputFormat","HTML");
if(this.reuseQuery()===true){
oReq.addFormField("reuseResults","true");
}
};
RunReportAction.prototype._addRunOptionsFromProperties=function(oReq){
var _6d1=this.getCognosViewer().getViewerWidget().getProperties();
if(_6d1.getRowsPerPage()!=null){
oReq.addFormField("run.verticalElements",_6d1.getRowsPerPage());
}
};
RunReportAction.prototype.execute=function(){
var oReq=this.createCognosViewerDispatcherEntry(this.m_action);
oReq.setCanBeQueued(this.canBeQueued());
if((this.m_action==="forward"||this.m_action==="back")&&(typeof this.m_bAbortAction==="undefined"||this.m_bAbortAction===true)){
return false;
}
var oCV=this.getCognosViewer();
if(this.m_sendParameterValues&&oCV.envParams["delayedLoadingExecutionParams"]){
oReq.addFormField("delayedLoadingExecutionParams",oCV.envParams["delayedLoadingExecutionParams"]);
delete oCV.envParams["delayedLoadingExecutionParams"];
}
this.getCognosViewer().dispatchRequest(oReq);
return true;
};
RunReportAction.prototype.doAddActionContext=function(){
return false;
};
RunReportAction.prototype.updateMenu=function(json){
json.visible=!this.isPromptWidget();
return json;
};
function BuxRunReportAction(){
BuxRunReportAction.baseConstructor.call();
};
BuxRunReportAction.prototype=new RunReportAction();
BuxRunReportAction.baseConstructor=RunReportAction;
BuxRunReportAction.prototype.canBeQueued=function(){
return true;
};
BuxRunReportAction.prototype.getAction=function(_6d5){
return _6d5?"runBux":"buxRunSpec";
};
function RefreshAction(){
this.m_sAction="Refresh";
};
RefreshAction.prototype=new RunReportAction();
RefreshAction.superclass=RunReportAction.prototype;
RefreshAction.prototype.execute=function(){
RefreshAction.superclass.execute.call(this);
};
function GetParametersAction(){
this.m_payload="";
this.isPrimaryPromptWidget=false;
this.m_requestParamsCopy=null;
};
GetParametersAction.prototype=new RunReportAction();
GetParametersAction.prototype.setRequestParms=function(_6d6){
this.m_payload=_6d6;
};
GetParametersAction.prototype.addRequestOptions=function(_6d7){
_6d7.addFormField("asynch.alwaysIncludePrimaryRequest","false");
_6d7.addFormField("ui.action","getParameters");
_6d7.addFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_6d7.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_6d7.addFormField("isPrimaryPromptWidget",this.isPrimaryPromptWidget?"true":"false");
_6d7.addFormField("parameterValues",this.m_oCV.getExecutionParameters());
if(this.m_oCV.envParams["bux"]=="true"){
_6d7.addFormField("bux","true");
}
};
GetParametersAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _6d9=new AsynchJSONDispatcherEntry(oCV);
_6d9.setCallbacks({"complete":{"object":this,"method":this.handleGetParametersResponse}});
this.addRequestOptions(_6d9);
if(oCV.getActiveRequest()){
this.m_requestFormFieldsCopy=oCV.getActiveRequest().getFormFields();
}
_6d9.sendRequest();
};
GetParametersAction.prototype.handleGetParametersResponse=function(_6da){
try{
var _6db=_6da.getResult();
var _6dc=_6db.xml;
var _6dd=this.getCognosViewer();
var _6de=_6dd.getViewerWidget();
if(typeof _6dc!="undefined"&&_6dc!=null){
var _6df=xml_decode(_6dc);
this.m_oCV.envParams["reportPrompts"]=_6df;
if(this.isPrimaryPromptWidget){
this.m_oCV.raisePromptEvent(_6df,this.m_requestFormFieldsCopy);
}else{
_6de.sharePrompts(this.m_payload);
}
}
if(typeof _6de!="undefined"){
_6de.promptParametersRetrieved=true;
var _6e0=_6de.getButtonFromSavedToolbarButtons("Reprompt");
if(typeof _6e0!="undefined"&&_6e0!=null){
var _6e1=_6dd.findBlueDotMenu();
if(_6dd.addedButtonToToolbar(_6e1,_6e0.button,"Refresh",_6e0.position)){
_6dd.resetbHasPromptFlag();
_6de.updateToolbar();
}
_6de.removeFromSavedToolbarButtons("Reprompt");
}
}
}
catch(e){
}
};
function RepromptAction(){
this.m_repromptAction=null;
};
RepromptAction.prototype=new CognosViewerAction();
RepromptAction.superclass=CognosViewerAction.prototype;
RepromptAction.prototype.updateMenu=function(_6e2){
var oCV=this.getCognosViewer();
_6e2.visible=(!this.isPromptWidget()&&oCV.hasPrompt());
if(!_6e2.visible){
_6e2.save=true;
}else{
delete _6e2.save;
}
return _6e2;
};
RepromptAction.prototype.setRequestParms=function(_6e4){
RepromptAction.superclass.setRequestParms(_6e4);
if(_6e4&&_6e4["preferencesChanged"]){
this["preferencesChanged"]=_6e4["preferencesChanged"];
}
};
RepromptAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
if(oCV.isLimitedInteractiveMode()){
this.m_repromptAction=new RepromptRunAction();
}else{
this.m_repromptAction=new RepromptRAPAction();
}
this.m_repromptAction.setCognosViewer(oCV);
if(this["preferencesChanged"]){
this.m_repromptAction.reuseConversation(false);
}
this.m_repromptAction.execute();
};
function RepromptRAPAction(){
this.m_sAction="Reprompt";
};
RepromptRAPAction.prototype=new ModifyReportAction();
RepromptRAPAction.prototype.getPromptOption=function(){
return "true";
};
RepromptRAPAction.prototype.isUndoable=function(){
return false;
};
RepromptRAPAction.prototype.reuseQuery=function(){
return false;
};
RepromptRAPAction.prototype.reuseGetParameter=function(){
return false;
};
RepromptRAPAction.prototype.keepFocusOnWidget=function(){
return false;
};
RepromptRAPAction.prototype.preProcess=function(){
var cv=this.getCognosViewer();
cv.m_raiseSharePromptEvent=true;
};
RepromptRAPAction.prototype.addAdditionalOptions=function(_6e7){
_6e7.addFormField("run.outputFormat","HTML");
_6e7.addFormField("bux","true");
};
function RepromptRunAction(){
};
RepromptRunAction.prototype=new RunReportAction();
RepromptRunAction.prototype.reuseQuery=function(){
return false;
};
RepromptRunAction.prototype.reuseGetParameter=function(){
return false;
};
RepromptRunAction.prototype.preProcess=function(){
var cv=this.getCognosViewer();
cv.m_raiseSharePromptEvent=true;
};
RepromptRunAction.prototype.getPromptOption=function(){
return "true";
};
function SelectionAction(){
};
SelectionAction.prototype=new CognosViewerAction();
SelectionAction.prototype.onMouseOver=function(evt){
if(DragDropAction_isDragging(evt)==false){
var _6ea=this.getCognosViewer().getSelectionController();
_6ea.pageHover(evt);
}
};
SelectionAction.prototype.onMouseOut=function(evt){
if(DragDropAction_isDragging(evt)==false){
var _6ec=this.getCognosViewer().getSelectionController();
_6ec.pageHover(evt);
}
};
SelectionAction.prototype.hasPermission=function(){
var oCV=this.getCognosViewer();
return !(oCV.isLimitedInteractiveMode()||oCV.envParams["cv.objectPermissions"].indexOf("read")===-1);
};
SelectionAction.prototype.executeDrillUpDown=function(evt){
var oCV=this.getCognosViewer();
var _6f0=oCV.getViewerWidget();
if(oCV.isDrillBlackListed()||(_6f0&&_6f0.isSelectionFilterEnabled())){
return false;
}
if(evt.button==0||evt.button==1||evt.keyCode=="13"){
var _6f1=getCtxNodeFromEvent(evt);
if(_6f1!=null){
var _6f2=this.m_oCV.getSelectionController();
var _6f3=_6f1.getAttribute("type")!=null?_6f1:_6f1.parentNode;
var type=_6f3.getAttribute("type");
var _6f5=_6f1.getAttribute("ctx");
_6f5=_6f5.split("::")[0].split(":")[0];
if((_6f3.getAttribute("CTNM")!=null||type=="datavalue")&&_6f2.getMun(_6f5)!=""){
var _6f6=_6f2.getAllSelectedObjects();
for(var _6f7=0;_6f7<_6f6.length;++_6f7){
var _6f8=_6f6[_6f7];
if(_6f8.getCellRef()==_6f1.parentNode){
if(_6f6.length>1){
_6f2.clearSelectedObjects();
_6f2.addSelectionObject(_6f8);
}
var _6f9=this.m_oCV.getActionFactory();
var _6fa=_6f9.load("DrillUpDown");
_6fa.updateDrillability(this.m_oCV,_6f1);
if(_6fa.drillability>0&&this.hasPermission()){
_6fa.execute();
return true;
}
}
}
}
}
}
return false;
};
SelectionAction.prototype.executeDrillThrough=function(evt){
var _6fc=this.getCognosViewer().getViewerWidget();
if(_6fc&&_6fc.isSelectionFilterEnabled()){
return;
}
var _6fd=this.getCognosViewer().getDrillMgr();
return _6fd.getDrillThroughParameters("execute",evt);
};
SelectionAction.prototype.pageClicked=function(evt){
var _6ff=false;
var _700=evt.which?evt.which==1:evt.button==1;
var _701=new CognosViewerSort(evt,this.m_oCV);
var _702,_703=getCrossBrowserNode(evt);
try{
_702=(_703&&_703.className)||"";
}
catch(ex){
_702="";
}
var oCV=this.getCognosViewer();
var _705=null;
if(_700&&_701.isSort(evt)&&!oCV.isLimitedInteractiveMode()&&!oCV.isBlacklisted("Sort")){
_701.execute();
}else{
if(_700&&_702.indexOf("expandButton")>-1){
var _706=_703;
if(_702.indexOf("expandButtonCaption")>-1){
_706=_706.parentNode;
_702=_706.className;
}
_705=getCognosViewerSCObjectRef(this.m_oCV.getId());
_705.selectSingleDomNode(_706.parentNode);
var _707;
if(_702.indexOf("collapse")===-1){
_707=new ExpandMemberAction();
}else{
_707=new CollapseMemberAction();
}
_707.setCognosViewer(oCV);
_707.execute();
}else{
_705=this.m_oCV.getSelectionController();
if(this.executeDrillUpDown(evt)===false){
var _708=this.m_oCV.getViewerWidget();
if(_708.isSelectionFilterEnabled()){
if(_700||evt.keyCode===13){
_708.preprocessPageClicked(false,evt);
}else{
_708.preprocessPageClicked(true);
}
}
if(_705.pageClicked(evt)!=false){
this.m_oCV.getViewerWidget().updateToolbar();
_705.resetAllowHorizontalDataValueSelection();
}
setNodeFocus(evt);
}
if(_700||evt.keyCode===13){
_6ff=this.executeDrillThrough(evt);
}
if(_700&&this.m_oCV.getViewerWidget()&&this.m_oCV.getViewerWidget().onSelectionChange){
this.m_oCV.getViewerWidget().onSelectionChange();
}
}
}
return _6ff;
};
SelectionAction.prototype.mouseActionInvolvesSelection=function(evt){
var _70a=evt.which?evt.which==1:evt.button==1;
var _70b=new CognosViewerSort(evt,this.m_oCV);
if(_70a&&_70b.isSort(evt)){
return false;
}
if(this.executeDrillUpDown(evt)!==false){
return false;
}
return true;
};
SelectionAction.prototype.onMouseDown=function(evt){
this.delegateClickToMouseUp=false;
if(this.mouseActionInvolvesSelection(evt)&&!this.m_oCV.getSelectionController().shouldExecutePageClickedOnMouseDown(evt)){
this.delegateClickToMouseUp=true;
return false;
}
return this.pageClicked(evt);
};
SelectionAction.prototype.onMouseUp=function(evt,_70e){
var ret=false;
if(!_70e&&this.mouseActionInvolvesSelection(evt)&&this.delegateClickToMouseUp){
ret=this.pageClicked(evt);
}
this.delegateClickToMouseUp=false;
return ret;
};
SelectionAction.prototype.onKeyDown=function(evt){
this.pageClicked(evt);
};
SelectionAction.prototype.onDoubleClick=function(evt){
var _712=this.m_oCV;
var _713=_712.getViewerWidget();
if(_712.isDrillBlackListed()||(_713&&_713.isSelectionFilterEnabled())){
return;
}
if(_712.getStatus()=="complete"){
var _714=_712.getDrillMgr();
var _715="DrillDown";
var _716="DrillDown";
var _717=false;
var _718=false;
if(_714!=null){
if(!this.hasPermission()){
return true;
}
var _719=_714.getSelectedObject();
if(_719==null||(_719.m_dataContainerType=="list"&&_719.m_sLayoutType=="columnTitle")){
return true;
}
var _71a=_719.getDrillOptions();
if(typeof _71a=="undefined"||_71a==null||!_71a.length){
return true;
}
_717=_714.canDrillDown();
if(!_717){
_718=_714.canDrillUp();
if(_718){
_715="DrillUp";
_716="DrillUp";
}
}
if(_717||_718){
_712.executeAction(_715,_716);
}
}else{
return true;
}
}
};
function SelectionFilterSwitchAction(){
this.m_sAction="SelectionFilterSwitch";
};
SelectionFilterSwitchAction.prototype=new CognosViewerAction();
SelectionFilterSwitchAction.prototype.updateMenu=function(_71b){
if(this.getCognosViewer().getViewerWidget().isSelectionFilterEnabled()){
_71b.disabled=false;
_71b.checked=true;
_71b.iconClass="selectionFilterEnabled";
_71b.label=RV_RES.IDS_JS_SELECTION_FILTER_SWITCH_DISABLE;
}else{
_71b.disabled=false;
_71b.checked=false;
_71b.iconClass="selectionFilter";
_71b.label=RV_RES.IDS_JS_SELECTION_FILTER_SWITCH;
}
return _71b;
};
SelectionFilterSwitchAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _71d=oCV.getViewerWidget();
var _71e=_71d.isSelectionFilterEnabled();
if(_71e){
if(_71d.selectionFilterSent()){
_71d.clearSelectionFilter();
}
}
_71d.toggleSelectionFilterSwitch();
_71d.updateToolbar();
_71d.onContextMenu({});
if(!_71e){
if(_71d.somethingSelected()){
_71d.broadcastSelectionFilter();
}
}
_71d.updateDrillThroughLinks();
_71d.fireEvent("com.ibm.bux.widget.modified",null,{"modified":true});
};
function SharePromptAction(){
this.m_bAbortAction=true;
};
SharePromptAction.prototype=new RunReportAction();
SharePromptAction.prototype.preProcess=function(){
var cv=this.getCognosViewer();
cv.disableRaiseSharePromptEvent();
};
SharePromptAction.prototype.setRequestParms=function(_720){
this.m_sharePromptParameters=_720.parameters;
this.m_action="forward";
};
SharePromptAction.prototype.parsePromptParameters=function(){
var _721=false;
var _722=this.getReportParameterNodes();
if(_722){
var _723=this.m_sharePromptParameters;
var _724={};
var _725=[];
for(var i in _723){
var _727=_723[i].parmName;
var _728=_723[i].modelItem;
var _729=null;
var _72a=null;
var _72b=false;
var _72c={};
for(var j in _722){
var _72e=_722[j].getAttribute("parameterName");
var _72f=_722[j].getAttribute("modelItem");
if((typeof _72e!=="undefined"&&_72e===_727)||(typeof _72f!=="undefined"&&_728!=="undefined"&&_728!==""&&_72f===_728&&!this.arrayContains(_725,_72f))){
_721=true;
_729="p_"+_72e;
_72a=this.getSharedPromptValue(_723[i],_722[j]);
if(_72e===_727){
_724[_729]=_72a;
_725.push(_72f);
_72b=false;
break;
}else{
_72c[_729]=_72a;
_72b=true;
}
}
}
if(_72b){
for(var x in _72c){
_724[x]=_72c[x];
}
}
}
if(_721){
this.m_bAbortAction=false;
this.m_promptValues=_724;
}
}
return _721;
};
SharePromptAction.prototype.getSharedPromptValue=function(_731,_732){
var _733=null;
var _734=_731.parmValue;
var _735=this._isPromptParamMultiValued(_731.multivalued,_734);
var _736=new RegExp(/^<selectChoices><selectOption/);
if(_735&&_732.getAttribute("multivalued")==null&&_734.match(_736)){
var _737=new RegExp(/^(<selectChoices><selectOption.*?><)/);
var _738=_737.exec(_734);
_733=_738[1]+"/selectChoices>";
}else{
_733=_734;
}
return _733;
};
SharePromptAction.prototype.arrayContains=function(_739,_73a){
var _73b=false;
for(var i=0;i<_739.length;i++){
if(_739[i]===_73a){
_73b=true;
break;
}
}
return _73b;
};
SharePromptAction.prototype.getPromptValues=function(){
if(!this.m_promptValues){
this.parsePromptParameters();
}
return this.m_promptValues;
};
SharePromptAction.prototype._isPromptParamMultiValued=function(_73d,_73e){
var _73f=false;
if(_73d!="undefined"&&_73d){
_73f=true;
}else{
var _740=new RegExp(/^<selectChoices><selectOption.*?>\s*<selectOption/);
if(_73e.match(_740)){
_73f=true;
}
}
return _73f;
};
SharePromptAction.prototype.getReportParameterNodes=function(){
var cv=this.getCognosViewer();
var _742=null;
try{
if(cv.envParams&&cv.envParams.reportPrompts){
var _743=cv.envParams.reportPrompts;
var _744=XMLBuilderLoadXMLFromString(_743);
if(!(_744&&_744.childNodes&&_744.childNodes.length>0&&_744.childNodes[0].nodeName==="parsererror")){
var _745=_744.firstChild;
var _746=XMLHelper_FindChildByTagName(_745,"reportParameters",true);
_742=XMLHelper_FindChildrenByTagName(_746,"reportParameter",false);
}
}
}
catch(e){
}
return _742;
};
SharePromptAction.prototype.executePrompt=function(){
if(this.getPromptValues()!==null){
this.execute();
return true;
}
return false;
};
function SnapshotsAction(){
};
SnapshotsAction.prototype=new CognosViewerAction();
SnapshotsAction.prototype.updateMenu=function(_747){
var _748=this.m_oCV.getViewerWidget();
_747.disabled=(_748.getAttributeValue("reportCreatedInCW")=="true")||(_748.getAttributeValue("fromReportPart")=="true")||(this.m_oCV.envParams["reportpart_id"]&&this.m_oCV.envParams["reportpart_id"].length)>0?true:false;
_747.visible=!this.isPromptWidget();
return _747;
};
SnapshotsAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _74a=oCV.getViewerWidget();
if(_74a.getSavedOutputsCMResponse()==null){
this.queryCMForSavedOutputs({"complete":{"object":this,"method":this.handleQueryResponse}});
}else{
if(typeof _74a.savedOutputMenuUpdated!="undefined"&&_74a.savedOutputMenuUpdated==false){
this.populateMenu(true);
_74a.savedOutputMenuUpdated=true;
}
}
};
SnapshotsAction.prototype.queryCMForSavedOutputs=function(_74b){
var oCV=this.getCognosViewer();
var _74d=oCV.getViewerWidget();
var _74e="";
var _74f=document.getElementById("formWarpRequest"+oCV.getId());
if(oCV.envParams["originalReport"]){
_74e=oCV.envParams["originalReport"];
}else{
if(_74f&&_74f["reRunObj"]!=null&&_74f["reRunObj"].value.length>0){
_74e=_74f["reRunObj"].value;
}else{
_74e=oCV.envParams["ui.object"];
}
}
_74e+="/reportVersion/*[@format='HTML' or @format='XHTML']/..";
var _750="<CMRequest>"+"<searchPath>"+xml_encode(_74e)+"</searchPath>"+"<properties>"+"<property>searchPath</property>"+"<property>creationTime</property>"+"<property>storeID</property>"+"</properties>"+"<sortBy>"+"<sortItem>"+"<property>creationTime</property>"+"<order>descending</order>"+"</sortItem>"+"</sortBy>"+"</CMRequest>";
var _751=new DataDispatcherEntry(oCV);
_751.addFormField("ui.action","CMRequest");
_751.addFormField("cv.responseFormat","CMRequest");
_751.addFormField("ui.object",_74e);
_751.addFormField("CMRequest",_750);
_751.setCallbacks(_74b);
oCV.dispatchRequest(_751);
};
SnapshotsAction.prototype.setSavedOutputsCMResponse=function(_752){
var oCV=this.getCognosViewer();
var _754=oCV.getViewerWidget();
var _755=XMLBuilderLoadXMLFromString(_752.getResult());
_754.setSavedOutputsCMResponse(_755);
};
SnapshotsAction.prototype.handleQueryResponse=function(_756){
this.setSavedOutputsCMResponse(_756);
this.populateMenu(true);
};
SnapshotsAction.prototype.canShowLiveMenuItem=function(){
var oCV=this.getCognosViewer();
return (oCV.envParams["cv.responseFormat"]!=="activeReport"&&(oCV.isLimitedInteractiveMode()||(oCV.envParams["cv.objectPermissions"]&&oCV.envParams["cv.objectPermissions"].indexOf("execute")!=-1)));
};
SnapshotsAction.prototype.getMenuItemActionClassHandler=function(){
var oCV=this.getCognosViewer();
return oCV.envParams["cv.responseFormat"]==="activeReport"?"ViewActiveReport":"ViewSavedOutput";
};
SnapshotsAction.prototype.populateMenu=function(_759){
var oCV=this.getCognosViewer();
var _75b=oCV.getViewerWidget();
var _75c=oCV.envParams["ui.action"];
var _75d=_75b.savedOutputsCMResponse;
var root=oCV.findBlueDotMenu();
root.open=_759;
var _75f=oCV.findToolbarItem("Snapshots",root);
var _760=XMLHelper_FindChildByTagName(_75d,"result",true);
var _761=XMLHelper_FindChildrenByTagName(_760,"item",false);
var _762=[];
var _763=null;
var _764=null;
var _765=null;
var _766;
if(this.canShowLiveMenuItem()){
_766=(_75c!="view"&&_75c!="buxView"&&oCV.getStatus()!=="fault");
_765={name:"live",label:RV_RES.IDS_JS_SNAPSHOTS_LIVE,action:_766?{}:{name:"RunSavedOutputReport",payload:{}},items:null};
this.addMenuItemChecked(_766,_765);
_762.push(_765);
if(_761.length>0){
_762.push({separator:true});
}
}
if(_761.length>0){
var _767=this.getMenuItemActionClassHandler();
var _768=[];
for(var _769=0;_769<_761.length;_769++){
if(_769<5){
var _76a=_761[_769];
var _76b=XMLHelper_GetText(XMLHelper_FindChildByTagName(_76a,"creationTime_localized",true));
_76b=enforceTextDir(_76b);
var _76c=XMLHelper_FindChildByTagName(_76a,"storeID",true);
var _76d=XMLHelper_GetText(XMLHelper_FindChildByTagName(_76c,"value",true));
var _76e=XMLHelper_FindChildByTagName(_76a,"creationTime",true);
var _76f=XMLHelper_GetText(XMLHelper_FindChildByTagName(_76e,"value",true));
if(_763==null){
_763=_76f;
_764=_76d;
}
_766=(_75c=="view"||_75c=="buxView")&&oCV.envParams["creationTime"]==_76f&&_75b.getSavedOutputSearchPath()!=null;
_765={name:"savedOutput",label:_76b,action:_766?{}:{name:_767,payload:{obj:_76d,creationTime:_76f,mostRecent:false}},items:null};
this.addMenuItemChecked(_766,_765);
_768.push(_765);
}else{
_768.push({name:"viewAllSnapshots",label:RV_RES.IDS_JS_VIEW_ALL_SNAPSHOTS,action:{name:"ViewAllSnapshots",payload:{}},items:null});
break;
}
}
_766=false;
if(_75b.getSavedOutputSearchPath()==null&&(_75c=="view"||_75c=="buxView")){
_766=true;
}
_765={name:"savedOutput",label:RV_RES.IDS_JS_MOST_RECENT_SNAPSHOT,action:_766?{}:{name:_767,payload:{obj:_764,creationTime:_763,mostRecent:true}},items:null};
this.addMenuItemChecked(_766,_765);
_762.push(_765);
_762.push({separator:true});
_762=_762.concat(_768);
}
_75f.open=_759;
_75f.items=_762;
var _770=[];
_770.push(_75f);
_75b.fireEvent("com.ibm.bux.widgetchrome.toolbar.update",null,_770);
};
SnapshotsAction.prototype.resetMenu=function(_771){
var oCV=this.getCognosViewer();
var _773=oCV.getViewerWidget();
var root=oCV.findBlueDotMenu();
var _775=oCV.findToolbarItem("Snapshots",root);
if(_775){
_775.open=false;
var _776=[{name:"loadng",label:RV_RES.GOTO_LOADING,iconClass:"loading"}];
_775.items=_776;
var _777=[_775];
_773.fireEvent("com.ibm.bux.widgetchrome.toolbar.update",null,_777);
}
};
function SwapRowsAndColumnsAction(){
this.m_sAction="SwapRowsAndColumns";
};
SwapRowsAndColumnsAction.prototype=new ModifyReportAction();
SwapRowsAndColumnsAction.prototype.getUndoHint=function(){
return RV_RES.IDS_JS_SWAP_ROWS_AND_COLUMNS;
};
SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported={winLossChart:true,progressiveChart:true,list:true};
SwapRowsAndColumnsAction.prototype.canSwap=function(){
if(this.reportHasOneObjectOnly()){
return this.isCurrentObject_singlePart_SupportedChartOrCrosstab();
}else{
return this.isSelectedObject_SupportedChartOrCrosstab();
}
};
SwapRowsAndColumnsAction.prototype.reportHasOneObjectOnly=function(){
var _778=this.m_oCV.getRAPReportInfo();
if(_778){
return (_778.getContainerCount()==1);
}
return false;
};
SwapRowsAndColumnsAction.prototype.isSelectedObject_SupportedChartOrCrosstab=function(){
var _779=this.getSelectedReportInfo();
return (_779&&!SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported[_779.displayTypeId]);
};
SwapRowsAndColumnsAction.prototype.isCurrentObject_singlePart_SupportedChartOrCrosstab=function(){
var _77a=this.m_oCV.getRAPReportInfo();
if(_77a){
if(_77a.getContainerCount()===1){
var _77b=_77a.getContainerFromPos(0).displayTypeId;
if(_77b&&!SwapRowsAndColumnsAction.M_oDisplayTypeIsUnsupported[_77b]){
return true;
}
}
}
return false;
};
SwapRowsAndColumnsAction.prototype.keepRAPCache=function(){
return false;
};
SwapRowsAndColumnsAction.prototype.updateMenu=function(_77c){
_77c.visible=this.ifContainsInteractiveDataContainer();
if(!_77c.visible){
return _77c;
}
_77c.disabled=!this.canSwap();
_77c.iconClass=_77c.disabled?"disabledSwap":"swap";
return _77c;
};
function UndoRedoAction(){
};
UndoRedoAction.prototype=new CognosViewerAction();
UndoRedoAction.prototype.dispatchRequest=function(_77d,_77e){
var _77f=null;
var _780=null;
var _781=this.getUndoRedoQueue();
if(_77e=="Undo"){
_780=_781.moveBack();
}else{
_780=_781.moveForward();
}
if(_77e=="Undo"&&_780&&_780.undoCallback){
_780.undoCallback();
this.getCognosViewer().getViewerWidget().updateToolbar();
}else{
if(_77e=="Redo"&&_780&&_780.redoCallback){
_780.redoCallback();
this.getCognosViewer().getViewerWidget().updateToolbar();
}else{
var _782=this.getCognosViewer().getViewerWidget().getProperties();
if(_782&&_780.widgetProperties){
_782.doUndo(_780.widgetProperties);
}
var _77f=new ViewerDispatcherEntry(this.getCognosViewer());
if(typeof _780.spec!="undefined"){
_77f.addFormField("ui.action","undoRedo");
_77f.addFormField("ui.spec",_780.spec);
_77f.addFormField("executionParameters",_780.parameters);
}else{
_77f.addFormField("ui.action","undoRedo");
_77f.addFormField("ui.conversation",_780.conversation);
}
if(typeof _780.hasAVSChart!="undefined"){
_77f.addFormField("hasAVSChart",_780.hasAVSChart);
}
if(_782&&_782.getRowsPerPage()!=null){
_77f.addFormField("run.verticalElements",_782.getRowsPerPage());
}
if(_77d!=""){
_77f.addFormField("cv.updateDataFilters",_77d);
}
if(typeof _780.infoBar=="string"){
_77f.addFormField("rap.reportInfo",_780.infoBar);
}else{
_77f.addFormField("rap.reportInfo","{}");
}
_77f.addFormField("run.prompt","false");
_77f.setCallbacks({"closeErrorDlg":{"object":_781,"method":_781.handleCancel}});
this.getCognosViewer().dispatchRequest(_77f);
}
}
this.fireModifiedReportEvent();
};
UndoRedoAction.prototype.execute=function(){
this.gatherFilterInfoBeforeAction(this.m_sAction);
};
function UndoAction(){
this.m_sAction="Undo";
};
UndoAction.prototype=new UndoRedoAction();
UndoAction.prototype.updateMenu=function(_783){
_783.visible=this.getCognosViewer().isLimitedInteractiveMode()?true:this.ifContainsInteractiveDataContainer();
if(!_783.visible){
return _783;
}
if(this.getUndoRedoQueue().getPosition()>0){
_783.iconClass="undo";
_783.disabled=false;
}else{
_783.iconClass="undoDisabled";
_783.disabled=true;
}
_783.label=this.getUndoRedoQueue().getUndoTooltip();
return _783;
};
function RedoAction(){
this.m_sAction="Redo";
};
RedoAction.prototype=new UndoRedoAction();
RedoAction.prototype.updateMenu=function(_784){
_784.visible=this.getCognosViewer().isLimitedInteractiveMode()?true:this.ifContainsInteractiveDataContainer();
if(!_784.visible){
return _784;
}
if(this.getUndoRedoQueue().getPosition()<(this.getUndoRedoQueue().getLength()-1)){
_784.iconClass="redo";
_784.disabled=false;
}else{
_784.iconClass="redoDisabled";
_784.disabled=true;
}
_784.label=this.getUndoRedoQueue().getRedoTooltip();
return _784;
};
function ViewAllSnapshotsAction(){
};
ViewAllSnapshotsAction.prototype=new SnapshotsAction();
ViewAllSnapshotsAction.prototype.updateMenu=function(_785){
var oCV=this.getCognosViewer();
var _787=oCV.getViewerWidget();
if(_787.m_bNoSavedOutputs==true){
_785.disabled=true;
}
return _785;
};
ViewAllSnapshotsAction.prototype.execute=function(){
if(!this.getCognosViewer().getViewerWidget().getSavedOutputsCMResponse()){
this.queryCMForSavedOutputs({"complete":{"object":this,"method":this.handleQueryResponse}});
}else{
this.showDialog();
}
};
ViewAllSnapshotsAction.prototype.handleQueryResponse=function(_788){
this.setSavedOutputsCMResponse(_788);
this.showDialog();
};
ViewAllSnapshotsAction.prototype.showDialog=function(){
var oCV=this.getCognosViewer();
var _78a=oCV.getViewerWidget();
var _78b=_78a.getSavedOutputsCMResponse();
var _78c=null;
var _78d=null;
if(_78b){
_78c=XMLHelper_FindChildByTagName(_78b,"result",true);
if(_78c){
_78d=XMLHelper_FindChildrenByTagName(_78c,"item",false);
}
}
if(!_78b||!_78d||_78d.length==0){
_78a.m_bNoSavedOutputs=true;
var _78e=new WarningMessageDialog(oCV,RV_RES.IDS_JS_NO_SAVED_OUTPUTS);
_78e.renderInlineDialog();
}else{
var _78f=getCognosViewerObjectString(this.m_oCV.getId());
var _790=RV_RES.IDS_JS_SELECT_SNAPSHOT_DIALOG_TITLE;
var _791=RV_RES.IDS_JS_SELECT_SNAPSHOT_DIALOG_DESC;
var _792=this.getCognosViewer().envParams["creationTime"];
this.selectSnapshotDialog=new viewer.dialogs.SelectSnapshot({sTitle:_790,sLabel:_791,cmResponse:_78b,currentSnapshotCreationTime:_792,okHandler:function(_793,_794){
window[_78f].executeAction("ViewSavedOutput",{obj:_793,creationTime:_794});
},cancelHandler:function(){
}});
this.selectSnapshotDialog.startup();
this.selectSnapshotDialog.show();
}
};
function ViewOriginalLabelAction(){
};
ViewOriginalLabelAction.prototype=new CognosViewerAction();
ViewOriginalLabelAction.prototype.getCellRef=function(){
return this.m_oCV.getSelectionController().getSelections()[0].getCellRef();
};
ViewOriginalLabelAction.prototype.updateMenu=function(_795){
if(this.getNumberOfSelections()==1){
var _796=this.getCellRef();
if(_796.getAttribute("rp_name")){
var _797=[];
_797.push({name:"originalLabel",label:_796.getAttribute("rp_name"),iconClass:"",action:null,items:null});
_795.items=_797;
return _795;
}
}
return "";
};
function ViewSavedOutputAction(){
this.m_obj="";
this.creationTime="";
this.m_mostRecent=false;
};
ViewSavedOutputAction.prototype=new CognosViewerAction();
ViewSavedOutputAction.prototype.addAdditionalRequestParms=function(_798){
};
ViewSavedOutputAction.prototype.setRequestParms=function(_799){
this.m_obj=_799.obj;
this.creationTime=_799.creationTime;
this.m_mostRecent=_799.mostRecent;
};
ViewSavedOutputAction.prototype.updateMenu=function(){
var _79a=this.getCognosViewer().getAction("Snapshots");
_79a.populateMenu(false);
};
ViewSavedOutputAction.prototype.execute=function(){
var _79b=this.getCognosViewer();
var _79c=_79b.getViewerWidget();
if(_79b.getStatus()==="fault"){
_79c.clearErrorDlg();
}
_79b.getViewerWidget().setPromptParametersRetrieved(false);
_79b.envParams["reportPrompts"]="";
var _79d=_79b.envParams["ui.action"];
var _79e=document.getElementById("formWarpRequest"+_79b.getId());
if(_79d=="view"&&_79e&&_79e.reRunObj&&_79e.reRunObj.value){
_79b.envParams["ui.reRunObj"]=_79e["reRunObj"].value;
}else{
if(_79d!="view"){
_79b.envParams["ui.reRunObj"]=_79b.envParams["ui.object"];
}
}
var _79f="storeID('"+this.m_obj+"')";
_79b.envParams["ui.action"]="buxView";
_79b.envParams["ui.object"]=_79b.envParams["ui.reRunObj"];
_79b.envParams["creationTime"]=this.creationTime;
if(this.m_mostRecent===true){
_79c.setSavedOutputSearchPath(null);
}else{
_79c.setSavedOutputSearchPath(_79f);
}
this.updateMenu();
this.getUndoRedoQueue().clearQueue();
_79b.getViewerWidget().clearPropertiesDialog();
if(_79b.getCurrentlySelectedTab()&&_79c.getSavedOutput()){
_79b.setKeepTabSelected(_79b.getCurrentlySelectedTab());
}
this.dispatchRequest(_79f);
this.fireModifiedReportEvent();
};
ViewSavedOutputAction.prototype.dispatchRequest=function(_7a0){
this.m_request=new ViewerDispatcherEntry(this.m_oCV);
this.m_request.addFormField("ui.action","buxView");
this.m_request.addFormField("ui.name",this.m_oCV.envParams["ui.name"]);
this.m_request.addFormField("widget.reloadToolbar","true");
this.m_request.addFormField("cv.objectPermissions",this.m_oCV.envParams["cv.objectPermissions"]);
this.m_request.addFormField("ui.savedOutputSearchPath",_7a0);
this.m_request.setCallbacks({"complete":{"object":this,"method":this.onComplete}});
this.addAdditionalRequestParms(this.m_request);
this.m_oCV.dispatchRequest(this.m_request);
};
ViewSavedOutputAction.prototype.onComplete=function(_7a1,arg1){
this.m_oCV.setTracking("");
this.m_oCV.setConversation("");
this.m_request.onComplete(_7a1,arg1);
};
function WatchNewVersionsAction(){
this.m_requestParms={subAction:""};
};
WatchNewVersionsAction.prototype=new CognosViewerAction();
WatchNewVersionsAction.prototype.setRequestParms=function(_7a3){
this.m_requestParms=_7a3;
};
WatchNewVersionsAction.prototype.execute=function(){
var _7a4=this.m_oCV.getSubscriptionManager();
switch(this.m_requestParms.subAction){
case "loadMenu":
this.loadMenu(this.m_requestParms.contextMenu);
break;
case "close":
this.closeMenu();
break;
case "DeleteNotification":
_7a4.DeleteNotification();
break;
case "AddNotification":
_7a4.AddNotification();
break;
case "NewSubscription":
_7a4.NewSubscription();
break;
case "ModifySubscription":
_7a4.ModifySubscription(this.m_requestParms.subscriptionId);
break;
case "DeleteSubscription":
_7a4.DeleteSubscription(this.m_requestParms.subscriptionId);
break;
}
};
WatchNewVersionsAction.prototype.closeMenu=function(){
var _7a5=this.m_oCV.findToolbarItem("WatchNewVersions");
this.resetMenu(_7a5);
var _7a6=getCognosViewerObjectRefAsString(this.m_oCV.getId());
setTimeout(_7a6+".getViewerWidget().fireEvent(\"com.ibm.bux.widgetchrome.toolbar.update\", null, ["+_7a6+".findToolbarItem(\"WatchNewVersions\")]);",1);
};
WatchNewVersionsAction.prototype.resetMenu=function(_7a7){
_7a7.open=false;
_7a7.action={name:"WatchNewVersions",payload:{subAction:"loadMenu",contextMenu:false}};
_7a7.closeAction=null;
var _7a8=[];
_7a8.push({name:"loadng",label:RV_RES.GOTO_LOADING,iconClass:"loading"});
_7a7.items=_7a8;
};
WatchNewVersionsAction.prototype.updateMenu=function(_7a9){
var _7aa=_7a9.items;
var _7ab=this.m_oCV.getSubscriptionManager();
if(!_7aa||_7aa.length===0){
_7a9.visible=_7ab.CanCreateNewWatchRule();
_7a9.disabled=!(_7ab.IsValidSelectionForNewRule());
}else{
this.resetMenu(_7a9);
}
return _7a9;
};
WatchNewVersionsAction.prototype.loadMenu=function(_7ac){
var _7ad=this.m_oCV.getSubscriptionManager();
var cvId=this.m_oCV.getId();
var oCV=this.m_oCV;
var _7b0=new JSONDispatcherEntry(oCV);
_7b0.addFormField("ui.action","getSubscriptionInfo");
_7b0.addFormField("cv.responseFormat","subscriptionManager");
_7b0.addFormField("contextMenu",_7ac==true?"true":"false");
_7ad.addCommonFormFields(_7b0,"");
_7b0.setCallbacks({"complete":{"object":this,"method":this.openSubscriptionMenuResponse}});
oCV.dispatchRequest(_7b0);
};
WatchNewVersionsAction.prototype.openSubscriptionMenuResponse=function(_7b1){
var _7b2=this.m_oCV.getSubscriptionManager();
_7b2.Initialize(_7b1);
var _7b3=[];
_7b2.ClearSubscriptionMenu();
var _7b4=false;
if(_7b2.CanGetNotified()){
if(_7b2.m_sQueryNotificationResponse=="on"){
_7b3.push({name:"DeleteNotification",label:RV_RES.RV_DO_NOT_ALERT_NEW_VERSION,iconClass:"deleteNotification",action:{name:"WatchNewVersions",payload:{subAction:"DeleteNotification"}},items:null});
_7b4=true;
}else{
if(_7b2.m_sQueryNotificationResponse=="off"&&_7b2.m_sEmail!=""){
_7b3.push({name:"AddNotification",label:RV_RES.RV_ALERT_NEW_VERSION,iconClass:"addNotification",action:{name:"WatchNewVersions",payload:{subAction:"AddNotification"}},items:null});
_7b4=true;
}
}
}
if(_7b2.CanCreateNewWatchRule()){
if(_7b4){
_7b3.push({separator:true});
}
var _7b5={name:"NewSubscription",label:RV_RES.RV_NEW_WATCH_RULE,iconClass:"newSubscription",action:{name:"WatchNewVersions",payload:{subAction:"NewSubscription"}},items:null};
if(!_7b2.IsValidSelectionForNewRule()){
_7b5.disabled=true;
}
_7b3.push(_7b5);
_7b4=true;
}
var _7b6="";
if(typeof this.m_oCV.UIBlacklist!="undefined"){
_7b6=this.m_oCV.UIBlacklist;
}
if(_7b6.indexOf(" RV_TOOLBAR_BUTTONS_RULES ")==-1){
if(_7b2.m_aWatchRules&&_7b2.m_aWatchRules.length>0){
if(_7b4){
_7b3.push({separator:true});
}
var _7b7=_7b2.CanModifyWatchRule();
for(var sub=0;sub<_7b2.m_aWatchRules.length;++sub){
var menu={name:"WatchRule"+sub,label:_7b2.m_aWatchRules[sub].name,iconClass:"watchRule",action:null,items:[]};
if(_7b7&&_7b6.indexOf(" RV_TOOLBAR_BUTTONS_RULES_MODIFY ")==-1){
menu.items.push({name:"ModifySubscription"+sub,label:RV_RES.RV_MODIFY_WATCH_RULE,iconClass:"modifySubscription",action:{name:"WatchNewVersions",payload:{subAction:"ModifySubscription",subscriptionId:sub}},items:null});
}
if(_7b6.indexOf(" RV_TOOLBAR_BUTTONS_RULES_DELETE ")==-1){
menu.items.push({name:"DeleteSubscription"+sub,label:RV_RES.RV_DELETE_WATCH_RULE,iconClass:"deleteSubscription",action:{name:"WatchNewVersions",payload:{subAction:"DeleteSubscription",subscriptionId:sub}},items:null});
}
_7b3.push(menu);
}
}
}
if(_7b3.length===0){
_7b3.push({name:"NoWatchRules",label:RV_RES.RV_NO_WATCH_RULES,iconClass:"",action:null,items:null,disabled:true});
}
var _7ba=this.m_oCV.findToolbarItem("WatchNewVersions");
if(_7ba){
_7ba.items=_7b3;
_7ba.action=null;
_7ba.open=true;
_7ba.closeAction={name:"WatchNewVersions",payload:{subAction:"close"}};
var _7bb=[];
_7bb.push(_7ba);
this.m_oCV.getViewerWidget().fireEvent("com.ibm.bux.widgetchrome.toolbar.update",null,_7bb);
}
};
function RunSavedOutputReportAction(){
};
RunSavedOutputReportAction.prototype=new CognosViewerAction();
RunSavedOutputReportAction.prototype.updateMenu=function(_7bc){
var _7bd=this.m_oCV.envParams["ui.action"];
var _7be=(_7bd!="view"&&_7bd!="buxView"&&this.m_oCV.getStatus()!=="fault");
this.addMenuItemChecked(_7be,_7bc);
return _7bc;
};
RunSavedOutputReportAction.prototype.dispatchRequest=function(_7bf){
var _7c0=this.getCognosViewer();
if(_7c0.envParams["savedReportName"]){
delete _7c0.envParams["savedReportName"];
}
if(_7c0.getStatus()==="fault"){
var _7c1=this.getCognosViewer().getViewerWidget();
_7c1.clearErrorDlg();
}
var _7c2=_7c0.envParams["ui.action"];
var _7c3=document.getElementById("formWarpRequest"+_7c0.getId());
if(_7c0.envParams["ui.reRunObj"]){
_7c0.envParams["ui.object"]=_7c0.envParams["ui.reRunObj"];
}else{
if(_7c2=="view"&&_7c3&&typeof _7c3["reRunObj"]!="undefined"&&_7c3["reRunObj"]!=null&&_7c3["reRunObj"].value.length>0){
_7c0.envParams["ui.object"]=_7c3["reRunObj"].value;
}
}
var oReq=new ViewerDispatcherEntry(_7c0);
oReq.addFormField("ui.action","bux");
oReq.addFormField("widget.runFromSavedOutput","true");
oReq.addFormField("ui.object",_7c0.envParams["ui.object"]);
oReq.addFormField("run.outputFormat","HTML");
oReq.addFormField("ui.primaryAction","");
oReq.addFormField("widget.reloadToolbar","true");
oReq.addDefinedNonNullFormField("cv.objectPermissions",_7c0.envParams["cv.objectPermissions"]);
oReq.addDefinedNonNullFormField("run.prompt",_7c0.envParams["promptOnRerun"]);
oReq.addDefinedNonNullFormField("limitedInteractiveMode",_7c0.envParams["limitedInteractiveMode"]);
oReq.addDefinedNonNullFormField("widget.globalPromptInfo",_7c0.getViewerWidget().getGlobalPromptsInfo());
oReq.addDefinedNonNullFormField("baseReportSearchPath",_7c0.envParams["baseReportSearchPath"]);
oReq.addNonEmptyStringFormField("cv.updateDataFilters",_7bf);
_7c0.getViewerWidget().clearPropertiesDialog();
_7c0.preparePromptValues(oReq);
_7c0.dispatchRequest(oReq);
this.fireModifiedReportEvent();
_7c0.envParams["ui.action"]="run";
};
RunSavedOutputReportAction.prototype.execute=function(){
this.gatherFilterInfoBeforeAction("RunSavedOutputReport");
};
function InvokeChangeDisplayTypeDialogAction(){
};
InvokeChangeDisplayTypeDialogAction.prototype=new CognosViewerAction();
InvokeChangeDisplayTypeDialogAction.prototype.execute=function(){
var _7c5=this.getCognosViewer();
var _7c6=this.getSelectedReportInfo();
if(_7c6){
var _7c7=_7c5.getViewerWidget();
var _7c8=false;
if(_7c6.suggestedDisplayTypesEnabled==true){
_7c8=(typeof _7c6.possibleDisplayTypes=="undefined")||(typeof _7c6.suggestedDisplayTypes=="undefined")?true:false;
}else{
_7c8=(typeof _7c6.possibleDisplayTypes=="undefined");
}
if(_7c8){
var _7c9=new AsynchJSONDispatcherEntry(this.m_oCV);
_7c9.setCallbacks({"complete":{"object":this,"method":this.handleResponse}});
_7c9.setRequestIndicator(_7c5.getRequestIndicator());
_7c9.addFormField("ui.action","getInfoFromReportSpec");
_7c9.addFormField("bux","true");
_7c9.addNonEmptyStringFormField("modelPath",this.m_oCV.getModelPath());
_7c9.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_7c9.addDefinedFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_7c9.addFormField("cv.actionContext",this.addActionContext());
_7c9.addFormField("ui.conversation",encodeURIComponent(this.m_oCV.getConversation()));
_7c5.dispatchRequest(_7c9);
}else{
_7c7.invokeDisplayTypeDialog(_7c6.possibleDisplayTypes,_7c6.suggestedDisplayTypes);
}
}
};
InvokeChangeDisplayTypeDialogAction.prototype.handleResponse=function(_7ca){
var _7cb=this.getCognosViewer();
var _7cc=_7cb.getViewerWidget();
var _7cd=_7ca.getResult();
for(var i in _7cd.containers){
var _7cf=this.getReportInfo(_7cd.containers[i].container);
_7cf.possibleDisplayTypes=_7cd.containers[i].possibleDisplayTypes;
_7cf.suggestedDisplayTypes=_7cd.containers[i].suggestedDisplayTypes;
}
var _7d0=this.getSelectedReportInfo();
_7cc.invokeDisplayTypeDialog(_7d0.possibleDisplayTypes,_7d0.suggestedDisplayTypes);
};
InvokeChangeDisplayTypeDialogAction.prototype.addActionContext=function(){
var _7d1="<getInfoActions>";
_7d1+="<getInfoAction name=\"GetInfo\">";
_7d1+="<include><possibleDisplayTypes/></include>";
_7d1+="<include><suggestedDisplayTypes/></include>";
_7d1+=this.getDataItemInfoMap();
_7d1+=this.addClientContextData(3);
_7d1+="</getInfoAction>";
_7d1+="</getInfoActions>";
return _7d1;
};
InvokeChangeDisplayTypeDialogAction.prototype.updateMenu=function(_7d2){
var _7d3=this.getCognosViewer().getRAPReportInfo();
_7d2.visible=_7d3.containsInteractiveDataContainer();
if(!_7d2.visible){
return _7d2;
}
var _7d4=this.getSelectedReportInfo();
_7d2.disabled=(_7d4==null||_7d4.displayTypeId==null||!this.isInteractiveDataContainer(_7d4.displayTypeId));
if(_7d2.disabled){
_7d2.iconClass="chartTypesDisabled";
return _7d2;
}
_7d2.iconClass="chartTypes";
return _7d2;
};
function GotoAction(){
};
GotoAction.prototype=new CognosViewerAction();
GotoAction.prototype.execute=function(){
var _7d5=this.m_oCV.getDrillMgr();
_7d5.launchGoToPage();
};
GotoAction.prototype.updateMenu=function(_7d6){
var _7d7=[];
var _7d8=this.m_oCV.getDrillTargets();
var _7d9=this.m_oCV.getDrillMgr();
var _7da=_7d9.getAuthoredDrillThroughTargets();
if(_7da.length>0){
var _7db="<AuthoredDrillTargets>";
for(var _7dc=0;_7dc<_7da.length;++_7dc){
_7db+=eval("\""+_7da[_7dc]+"\"");
}
_7db+="</AuthoredDrillTargets>";
var _7dd=this.m_oCV.getAction("AuthoredDrill");
var _7de=_7dd.getAuthoredDrillThroughContext(_7db,_7d8);
var _7df=_7de.childNodes;
if(_7df.length>0){
for(var _7e0=0;_7e0<_7df.length;++_7e0){
var _7e1=_7df[_7e0];
var _7e2=this.getTargetReportIconClass(_7e1);
var _7e3=_7e1.getAttribute("label");
_7d7.push({name:"AuthoredDrill",label:_7e3,iconClass:_7e2,action:{name:"AuthoredDrill",payload:XMLBuilderSerializeNode(_7e1)},items:null});
}
}
}
if(_7d7.length>0){
_7d7.push({separator:true});
}
var _7e4=false;
if(this.m_oCV.getSelectionController()==null||this.m_oCV.getSelectionController().getModelDrillThroughEnabled()==false){
_7e4=true;
}
_7d7.push({name:"Goto",disabled:_7e4,label:RV_RES.RV_MORE,iconClass:"",action:{name:"Goto",payload:""},items:null});
if(this.m_oCV.isIWidgetMobile()){
_7d6.flatten="true";
}
_7d6.items=_7d7;
return _7d6;
};
GotoAction.prototype.getTargetReportIconClass=function(_7e5){
var _7e6="";
var _7e7=_7e5.getAttribute("method");
switch(_7e7){
case "edit":
_7e6="editContent";
break;
case "execute":
_7e6="runReport";
break;
case "view":
var _7e8=_7e5.getAttribute("outputFormat");
switch(_7e8){
case "HTML":
case "XHTML":
case "HTMLFragment":
_7e6="html";
break;
case "PDF":
_7e6="pdf";
break;
case "XML":
_7e6="xml";
break;
case "CSV":
_7e6="csv";
break;
case "XLS":
_7e6="excel2000";
break;
case "SingleXLS":
_7e6="excelSingleSheet";
break;
case "XLWA":
_7e6="excel2002";
break;
case "spreadsheetML":
_7e6="excel2007";
break;
case "xlsxData":
_7e6="excel2007";
break;
}
break;
}
return _7e6;
};
function AnnotationAction(){
};
AnnotationAction.prototype=new CognosViewerAction();
AnnotationAction.prototype.updateMenu=function(_7e9){
var _7ea=this.m_oCV.getViewerWidget();
var _7eb=this.m_oCV.aBuxAnnotations;
var _7ec=[];
for(var _7ed=0;_7ed<_7eb.length;_7ed++){
var ann=eval("new "+_7eb[_7ed]+"()");
ann.setCognosViewer(this.m_oCV);
if(ann&&ann.isEnabled(_7e9.placeType)){
var _7ef={};
_7ef.name=_7eb[_7ed];
_7ef.label=ann.getMenuItemString(_7ea.getAttributeValue("itemName"));
_7ef.action={};
_7ef.action.name=_7eb[_7ed];
_7ef.action.payload="";
_7ef.items=null;
_7ef.iconClass=ann.getMenuItemIconClass();
_7ec.push(_7ef);
}
}
_7e9.items=_7ec;
_7e9.disabled=!(_7e9.items&&_7e9.items.length);
if(_7e9.disabled){
_7e9.iconClass="disabledAnnotation";
}else{
_7e9.iconClass="annotation";
}
return _7e9;
};
AnnotationAction.prototype.execute=function(){
var _7f0=this.getCognosViewer();
var _7f1=_7f0.getSelectionController();
var _7f2=_7f1.getSelections();
if(_7f2&&_7f2.length==1){
var _7f3=_7f0.getViewerWidget();
if(_7f3){
this.executeAction(_7f0,_7f3,_7f2[0]);
}
}
};
AnnotationAction.prototype.executeAction=function(_7f4,_7f5,_7f6){
};
function DeleteWidgetAnnotationAction(){
};
DeleteWidgetAnnotationAction.prototype=new AnnotationAction();
DeleteWidgetAnnotationAction.prototype.execute=function(){
var _7f7=this.getCognosViewer();
var _7f8=_7f7.getViewerWidget();
if(_7f8){
_7f8.getAnnotationHelper().deleteWidgetComment();
}
};
function EditWidgetAnnotationAction(){
};
EditWidgetAnnotationAction.prototype=new AnnotationAction();
EditWidgetAnnotationAction.prototype.execute=function(){
var _7f9=this.getCognosViewer();
var _7fa=_7f9.getViewerWidget();
if(_7fa){
window.setTimeout(function(){
_7fa.getAnnotationHelper().editWidgetComment();
},0);
}
};
function NewWidgetAnnotationAction(){
};
NewWidgetAnnotationAction.prototype=new AnnotationAction();
NewWidgetAnnotationAction.prototype.execute=function(){
var _7fb=this.getCognosViewer();
var _7fc=_7fb.getViewerWidget();
if(_7fc){
_7fc.getAnnotationHelper().addWidgetComment();
}
};
function DeleteAnnotationAction(){
};
DeleteAnnotationAction.prototype=new AnnotationAction();
DeleteAnnotationAction.prototype.executeAction=function(_7fd,_7fe,_7ff){
if(_7fd&&_7fe&&_7ff){
var _800=_7ff.getCellRef();
var _801=_7fd.findCtx(_800);
_7fe.getAnnotationHelper().deleteComment(_801);
}
};
function EditAnnotationAction(){
};
EditAnnotationAction.prototype=new AnnotationAction();
EditAnnotationAction.prototype.executeAction=function(_802,_803,_804){
if(_802&&_803&&_804){
var _805=_804.getCellRef();
var _806=_802.findCtx(_805);
window.setTimeout(function(){
_803.getAnnotationHelper().editComment(_806);
},0);
}
};
function NewAnnotationAction(){
};
NewAnnotationAction.prototype=new AnnotationAction();
NewAnnotationAction.prototype.executeAction=function(_807,_808,_809){
if(_807&&_808&&_809){
var _80a=_809.getCellRef();
var _80b=_807.findCtx(_80a);
var _80c=_809.getDisplayValues()[0];
window.setTimeout(function(){
_808.getAnnotationHelper().addComment(_80b,_80c);
},0);
}
};
function ExploreWithAAFAction(){
};
ExploreWithAAFAction.prototype=new CognosViewerAction();
ExploreWithAAFAction.prototype.execute=function(){
window.open(this.m_oCV.getGateway()+this.m_oCV.envParams.aafBaseURL,"_blank");
};
function ViewActiveReportAction(){
};
ViewActiveReportAction.prototype=new ViewSavedOutputAction();
ViewActiveReportAction.prototype.addAdditionalRequestParms=function(_80d){
_80d.addFormField("cv.responseFormat","CMRequest");
_80d.setCallbacks({"complete":{"object":this,"method":this.handleQueryResponse}});
};
ViewActiveReportAction.prototype.handleQueryResponse=function(_80e){
var _80f=this.m_oCV.getViewerWidget();
_80f.showLoading();
var _810=XMLBuilderLoadXMLFromString(_80e.getResult());
var _811=XMLHelper_FindChildByTagName(_810,"storeID",true);
var _812=XMLHelper_GetText(XMLHelper_FindChildByTagName(_811,"value",true));
var _813=dojo.byId(this.m_oCV.getViewerWidget().getIFrameId());
_813.src=this.m_oCV.getGateway()+"/output/cm/"+_812+"/";
};
function RefreshActiveReportAction(){
this.m_sAction="RefreshActiveReport";
};
RefreshActiveReportAction.prototype=new CognosViewerAction();
RefreshActiveReportAction.prototype.execute=function(){
var _814=this.m_oCV.getViewerWidget();
var _815=dojo.byId(_814.getIFrameId());
var _816=_815.src;
_815.src=_816;
_814.showLoading();
};
function ExportAction(){
this.m_format="";
this.m_responseFormat="";
};
ExportAction.prototype=new CognosViewerAction();
ExportAction.prototype.getWindowTitle=function(){
return "";
};
ExportAction.prototype.execute=function(){
if(!this.m_format){
return false;
}
this.initializeForm();
this.insertGenericFormElements();
this.insertSpecializedFormElements();
return this.sendRequest();
};
ExportAction.prototype.addFormField=function(_817,_818){
if(console){
console.log("Required method ExportAction.addFormField not implemented");
}
};
ExportAction.prototype.initializeForm=function(){
if(console){
console.log("Required method ExportAction.initializeForm not implemented");
}
};
ExportAction.prototype.sendRequest=function(){
if(console){
console.log("Required method ExportAction.sendRequest not implemented");
}
};
ExportAction.prototype.insertGenericFormElements=function(){
var _819="false";
var _81a="cognosViewer";
this.addFormField("b_action",_81a);
this.addFormField("cv.toolbar","false");
this.addFormField("cv.header","false");
this.addFormField("ui.windowtitleformat","chromeless_window_action_format");
this.addFormField("ui.name",this.getObjectDisplayName());
this.addFormField("cv.responseFormat",this.m_responseFormat);
this.addFormField("ui.reuseWindow","true");
var _81b=this.m_oCV.envParams["ui.spec"];
var _81c=this.m_oCV.getConversation();
this.addFormField("ui.action","export");
this.addFormField("ui.conversation",_81c);
this.addFormField("run.prompt",_819);
this.addFormField("asynch.attachmentEncoding","base64");
this.addFormField("run.outputEncapsulation","URLQueryString");
this.addFormField("ui.spec",_81b);
this.addFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
if(this.m_oCV.envParams["ui.routingServerGroup"]){
this.addFormField("ui.routingServerGroup",this.m_oCV.envParams["ui.routingServerGroup"]);
}
var _81d=this.m_oCV.getViewerWidget();
if(_81d!=null){
dojo.when(_81d.getWidgetStoreID(),dojo.hitch(this,function(_81e){
if(typeof _81e!="undefined"&&_81e!=null){
this.addFormField("widgetStoreID",_81e);
}
}));
var _81f=_81d.getAttributeValue("gateway");
if(_81f){
this.addFormField("cv.gateway",_81f);
}
var _820=_81d.getAttributeValue("webcontent");
if(_820){
this.addFormField("cv.webcontent",_820);
}
}
this.addFormField("rap.parametersInfo",CViewerCommon.buildParameterValuesSpec(this.m_oCV));
};
ExportAction.prototype.insertSpecializedFormElements=function(_821){
this.addFormField("run.outputFormat",this.m_format);
this.addFormField("ui.windowtitleaction",this.getWindowTitle());
};
ExportAction.prototype.updateMenu=function(json){
json.visible=!this.isPromptWidget();
if(this.m_oCV.isIWidgetMobile()){
json.flatten=true;
}
return json;
};
function ExportFromIframeAction(){
this.m_format="";
this.m_responseFormat="downloadObject";
};
ExportFromIframeAction.prototype=new ExportAction();
ExportFromIframeAction.prototype.initializeForm=function(){
this.oRequest=new HiddenIframeDispatcherEntry(this.getCognosViewer());
this.addFormField("cv.detachRelease","true");
};
ExportFromIframeAction.prototype.addFormField=function(_823,_824){
this.oRequest.addFormField(_823,_824);
};
ExportFromIframeAction.prototype.sendRequest=function(){
this.getCognosViewer().dispatchRequest(this.oRequest);
return true;
};
function ExportToCSVAction(){
this.m_format="CSV";
};
ExportToCSVAction.prototype=new ExportFromIframeAction();
ExportToCSVAction.prototype.getWindowTitle=function(){
return RV_RES.RV_CSV;
};
function ExportToExcel2000Action(){
this.m_format="XLS";
};
ExportToExcel2000Action.prototype=new ExportFromIframeAction();
ExportToExcel2000Action.prototype.getWindowTitle=function(){
return RV_RES.RV_EXCEL_2000;
};
function ExportToExcel2002Action(){
this.m_format="XLWA";
};
ExportToExcel2002Action.prototype=new ExportFromIframeAction();
ExportToExcel2002Action.prototype.getWindowTitle=function(){
return RV_RES.RV_EXCEL_2002;
};
function ExportToExcel2007Action(){
this.m_format="spreadsheetML";
};
ExportToExcel2007Action.prototype=new ExportFromIframeAction();
ExportToExcel2007Action.prototype.getWindowTitle=function(){
return RV_RES.RV_EXCEL_2007;
};
function ExportToExcel2007DataAction(){
this.m_format="xlsxData";
};
ExportToExcel2007DataAction.prototype=new ExportFromIframeAction();
ExportToExcel2007DataAction.prototype.getWindowTitle=function(){
return RV_RES.RV_EXCEL_2007_DATA;
};
function ExportToExcelSingleSheetAction(){
this.m_format="singleXLS";
};
ExportToExcelSingleSheetAction.prototype=new ExportFromIframeAction();
ExportToExcelSingleSheetAction.prototype.getWindowTitle=function(){
return RV_RES.RV_EXCEL_2000SF;
};
function ExportToPDFAction(){
this.m_format="PDF";
};
ExportToPDFAction.prototype=new ExportFromIframeAction();
ExportToPDFAction.prototype.getWindowTitle=function(){
return RV_RES.RV_PDF;
};
function ExportToXMLAction(){
this.m_format="XML";
};
ExportToXMLAction.prototype=new ExportFromIframeAction();
ExportToXMLAction.prototype.getWindowTitle=function(){
return RV_RES.RV_XML;
};
function PrintAsPDFAction(){
this.m_format="PDF";
this.m_responseFormat="page";
};
PrintAsPDFAction.prototype=new ExportAction();
PrintAsPDFAction.prototype.getWindowTitle=function(){
return RV_RES.IDS_PRINT_AS_PDF;
};
PrintAsPDFAction.prototype.initializeForm=function(){
this.nForm=document.createElement("form");
this.nForm.setAttribute("method","post");
var _825=location.protocol+"//"+location.host+this.m_oCV.m_sGateway;
this.nForm.setAttribute("action",_825);
};
PrintAsPDFAction.prototype.sendRequest=function(){
var _826=this.m_oCV.getId();
var _827="get"+this.m_format+_826;
this.nForm.setAttribute("id",_827);
this.nForm.setAttribute("name",_827);
this.nForm.setAttribute("target",this.m_format+"Window"+_826);
document.body.appendChild(this.nForm);
var _828=this.nForm.getAttribute("target");
window.open("",_828,"resizable=yes,menubar=no,directories=no,location=no,status=no,toolbar=no,titlebar=no");
this.nForm.submit();
document.body.removeChild(this.nForm);
this.nForm=null;
return true;
};
PrintAsPDFAction.prototype.addFormField=function(_829,_82a){
this.nForm.appendChild(createHiddenFormField(_829,_82a));
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
ExpandCollapseMemberAction.prototype._getCanExpand=function(_82b){
var _82c=this._getItemInfo(_82b);
return (_82c&&_82c.canExpand);
};
ExpandCollapseMemberAction.prototype._isExpanded=function(_82d){
var sMUN=this._getSelectedMUN(_82d);
if(!sMUN){
return false;
}
var _82f=this._getItemInfo(_82d);
return (_82f&&_82f.expandedMembers&&_82f.expandedMembers[sMUN]===true);
};
ExpandCollapseMemberAction.prototype._getSelectedMUN=function(_830){
var sMun=null;
var _832=_830.getMuns();
if(_832&&_832.length>0&&_832[0].length>0){
sMun=_832[0][0];
}
return sMun;
};
ExpandCollapseMemberAction.prototype._getDataItem=function(_833){
if(!_833){
return null;
}
var _834=null;
var _835=_833.getDataItems();
if(_835&&_835.length>0&&_835[0].length>0){
_834=_835[0][0];
}
return _834;
};
ExpandCollapseMemberAction.prototype._getItemInfo=function(_836){
var _837=this._getDataItem(_836);
if(!_837){
return null;
}
var _838=this.removeNamespace(_836.getLayoutElementId());
this.m_RAPReportInfo=this.m_oCV.getRAPReportInfo();
this.m_itemInfo=this.m_RAPReportInfo.getItemInfo(_838,_837);
this.m_sPreviousDataItem=_837;
return this.m_itemInfo;
};
ExpandCollapseMemberAction.prototype._alwaysCanExpandCollapse=function(_839){
var _83a=this._getItemInfo(_839);
return (_83a&&_83a.alwaysCanExpandCollapse);
};
ExpandCollapseMemberAction.prototype._canShowMenu=function(_83b){
var _83c=this._getFirstSelectedObject(_83b);
return (_83c&&this._hasMUN(_83c)&&this._isCrosstab(_83c)&&this._isOnEdge(_83c)&&!_83b.areSelectionsMeasureOrCalculation());
};
ExpandCollapseMemberAction.prototype._getCtxId=function(_83d){
var _83e=_83d.getCellRef();
if(_83e&&_83e.getAttribute){
var _83f=_83e.getAttribute("ctx");
if(_83f){
_83f=_83f.split("::")[0].split(":")[0];
return _83f;
}
}
return "";
};
ExpandCollapseMemberAction.prototype._hasMUN=function(_840){
var _841=_840.getMuns();
return _841.length>0?true:false;
};
ExpandCollapseMemberAction.prototype._isCrosstab=function(_842){
return _842.getDataContainerType()==="crosstab"?true:false;
};
ExpandCollapseMemberAction.prototype._isOnEdge=function(_843){
return _843.getLayoutType()==="columnTitle"?true:false;
};
ExpandCollapseMemberAction.prototype.keepRAPCache=function(){
return false;
};
ExpandCollapseMemberAction.prototype.updateMenu=function(_844){
var _845=this.m_oCV.getSelectionController();
_844.visible=this._canShowMenu(_845);
if(!_844.visible){
return _844;
}
_844.disabled=!this._canEnableMenu(_845);
return _844;
};
ExpandCollapseMemberAction.prototype._canEnableMenu=function(_846){
return true;
};
ExpandCollapseMemberAction.prototype._getFirstSelectedObject=function(_847){
var _848=_847.getAllSelectedObjects();
if(_848.length>0){
return _848[0];
}
return null;
};
ExpandCollapseMemberAction.prototype._isSingleSelection=function(_849){
var _84a=_849.getAllSelectedObjects();
return (_84a.length===1);
};
ExpandCollapseMemberAction.prototype.addActionContextAdditionalParms=function(){
var _84b=this.getCognosViewer().getSelectionController();
var _84c=this._getFirstSelectedObject(_84b);
var sPUN=_84b.getPun(this._getCtxId(_84c));
if(sPUN){
sPUN="<PUN>"+sXmlEncode(sPUN)+"</PUN>";
}
var _84e="";
if(this.m_sExpandCollapseType){
_84e="<ExpandCollapseType>"+this.m_sExpandCollapseType+"</ExpandCollapseType>";
}
return this.getSelectedCellTags()+sPUN+_84e;
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
ExpandMemberAction.prototype._canEnableMenu=function(_84f){
if(!this._isSingleSelection(_84f)){
return false;
}
var _850=this._getFirstSelectedObject(_84f);
if(this._alwaysCanExpandCollapse(_850)){
return true;
}
var _851=this._getCtxId(_850);
var _852=true;
if(_84f.getDrillUpDownEnabled()===true){
_852=_84f.canDrillDown(_851);
}
return (_852&&this._getCanExpand(_850)&&!this._isExpanded(_850));
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
CollapseMemberAction.prototype._canDisableMenu=function(_853){
if(this._isSingleSelection(_853)&&!this._isExpanded()){
return true;
}
return false;
};
CollapseMemberAction.prototype._canEnableMenu=function(_854){
var _855=this._getFirstSelectedObject(_854);
if(this._alwaysCanExpandCollapse(_855)){
return true;
}
return (this._isSingleSelection(_854)&&this._isExpanded(_855));
};
function OpenReportFromClipboardAction(){
this.m_action="bux";
this.m_cv=this.getCognosViewer();
};
OpenReportFromClipboardAction.prototype=new CognosViewerAction();
OpenReportFromClipboardAction.prototype.reuseQuery=function(){
return false;
};
OpenReportFromClipboardAction.prototype.reuseGetParameter=function(){
return false;
};
OpenReportFromClipboardAction.prototype.keepRAPCache=function(){
return false;
};
OpenReportFromClipboardAction.prototype.reuseConversation=function(){
return false;
};
OpenReportFromClipboardAction.prototype.runReport=function(){
return true;
};
OpenReportFromClipboardAction.prototype.isUndoable=function(){
return true;
};
OpenReportFromClipboardAction.prototype.execute=function(){
if(window.clipboardData){
this.openReportForIE();
}else{
this.openReportForNonIE();
}
};
OpenReportFromClipboardAction.prototype.openReportForNonIE=function(){
var _856=this;
var _857=new viewer.dialogs.ClipboardDialog({sTitle:RV_RES.IDS_JS_CLIPBOARD,okHandler:function(_858){
_856.executeAction(_858);
},cancelHandler:function(){
}});
_857.startup();
window.setTimeout(function(){
_857.show();
},0);
};
OpenReportFromClipboardAction.prototype.openReportForIE=function(){
var _859=window.clipboardData.getData("Text");
this.executeAction(_859);
};
OpenReportFromClipboardAction.prototype.getDeleteEnvParamsList=function(){
var _85a=["modelPath","packageBase","rapReportInfo","rap.state"];
return _85a;
};
OpenReportFromClipboardAction.prototype.deleteEnvParams=function(){
var _85b=this.m_cv.envParams;
var _85c=this.getDeleteEnvParamsList();
for(var _85d in _85c){
if(_85b[_85c[_85d]]){
delete _85b[_85c[_85d]];
}
}
};
OpenReportFromClipboardAction.prototype.cleanUpCognosViewer=function(){
this.m_cv.setExecutionParameters("");
this.m_cv.setConversation("");
this.deleteEnvParams();
};
OpenReportFromClipboardAction.prototype.getRequestParams=function(){
var _85e={"run.outputFormat":"HTML","cv.id":this.m_cv.getId(),"widget.reloadToolbar":"true","openReportFromClipboard":"true","ui.reportDrop":"true"};
var _85f=this.m_cv.getViewerWidget().getGlobalPromptsInfo();
if(_85f!=null){
_85e["widget.globalPromptInfo"]=_85f;
}
if(this.m_filters!=""){
_85e["cv.updateDataFilters"]=this.m_filters;
}
var _860=["cv.objectPermissions","limitedInteractiveMode"];
for(var _861 in _860){
var _862=_860[_861];
var _863=this.m_cv.envParams[_862];
if(_863){
_85e[_862]=_863;
}
}
return _85e;
};
OpenReportFromClipboardAction.prototype.addAdditionalOptions=function(_864){
var _865=this.getRequestParams();
for(var _866 in _865){
_864.addFormField(_866,_865[_866]);
}
};
OpenReportFromClipboardAction.prototype.executeAction=function(_867){
this.m_cv=this.getCognosViewer();
this.m_cv.envParams["ui.spec"]=_867;
this.gatherFilterInfoBeforeAction("OpenReportFromClipboard");
ChangePaletteAction.reset(this.getCognosViewer());
};
OpenReportFromClipboardAction.prototype.dispatchRequest=function(_868){
this.m_cv=this.getCognosViewer();
var _869=this.m_cv.getViewerWidget();
_869.reset();
this.m_filters=_868;
this.cleanUpCognosViewer();
var _86a=this.createCognosViewerDispatcherEntry(this.m_action);
this.m_cv.hideReportInfo();
this.m_cv.dispatchRequest(_86a);
this.fireModifiedReportEvent();
};
OpenReportFromClipboardAction.prototype.doAddActionContext=function(){
return false;
};
OpenReportFromClipboardAction.prototype.updateMenu=function(json){
json.visible=(window.cognosViewerDebug===true);
return json;
};
function SaveAsReportAction(){
_progressDisplay=null;
};
SaveAsReportAction.prototype=new CognosViewerAction();
SaveAsReportAction.prototype.onSaveCallback=function(){
if(!this._progressDisplay){
dojo["require"]("bux.dialogs.InformationDialog");
this._progressDisplay=new bux.dialogs.Working(BUXMSG.CPN.IDS_CPN_SAVING);
this._progressDisplay.startup();
this._progressDisplay.show();
}
};
SaveAsReportAction.prototype.afterSaveCallback=function(){
if(this._progressDisplay){
this._progressDisplay.destroy();
this._progressDisplay=null;
}
};
SaveAsReportAction.prototype.execute=function(){
this.getCognosViewer().executeAction("RemoveAllDataFilter",{callback:{method:this.doSaveAs,object:this}});
};
SaveAsReportAction.prototype.updateMenu=function(_86c){
_86c.visible=this.hasEnvUISpec();
return _86c;
};
SaveAsReportAction.prototype.hasEnvUISpec=function(){
if(this.m_oCV){
var _86d=this.m_oCV.envParams["ui.spec"];
return (_86d&&_86d.length>0);
}
return false;
};
SaveAsReportAction.prototype.doSaveAs=function(_86e){
dojo["require"]("bux.dialogs.FileDialog");
dojo["require"]("bux.iwidget.canvas.ReportIOHandler");
this.m_cv=this.getCognosViewer();
var _86f=_86e;
var _870=this.m_cv.envParams["ui.objectClass"];
var _871=this.onSaveCallback;
var _872=this.afterSaveCallback;
var _873={filter:"content-report",title:RV_RES.IDS_JS_SAVE_AS_FDG_TITLE,sMainActionButtonLabel:RV_RES.IDS_JS_OK,"class":"bux-fileDialog"};
var _874=new bux.iwidget.canvas.ReportIOHandler(_86f,_870,_871,_872,_873);
_874._doSaveAs();
};
function BusinessProcessAction(){
};
BusinessProcessAction.prototype=new CognosViewerAction();
BusinessProcessAction.prototype.updateMenu=function(_875){
var _876=this.getCognosViewer().envParams["bpmRestURI"];
_875.visible=(_876?true:false);
if(_875.visible){
_875.disabled=!this._hasAnyContextInSelectedObjects();
}
return _875;
};
BusinessProcessAction.prototype._initBPMGateway=function(){
var _877=this.getCognosViewer();
this.m_BPMGateway=_877.envParams["bpmRestURI"];
var _878=this.m_BPMGateway.length;
if(this.m_BPMGateway[_878-1]!=="/"){
this.m_BPMGateway+="/";
}
};
BusinessProcessAction.prototype.execute=function(){
this._initBPMGateway();
var _879=this._getBPMProcesses();
};
BusinessProcessAction.prototype._getBPMProcesses=function(){
var _87a={complete:{object:this,method:this.handleGetBPMProcessSuccess},fault:{object:this,method:this.handleGetBPMProcessFail}};
var url=this.m_BPMGateway+"exposed/process";
var _87c=this._createBPMServerRequest("GET",_87a,url);
_87c.sendRequest();
};
BusinessProcessAction.prototype._createBPMServerRequest=function(_87d,_87e,url,_880){
var _881=new XmlHttpObject();
_881.init(_87d,this._rewriteURL(url));
_881.setCallbacks(_87e);
_881.setHeaders({Accept:"application/json"});
if(_880){
for(var i in _880){
_881.addFormField(_880[i].name,_880[i].value);
}
}
return _881;
};
BusinessProcessAction.prototype._rewriteURL=function(url){
if(bux&&bux.iwidget&&bux.iwidget.canvas&&bux.iwidget.canvas.Helper&&bux.iwidget.canvas.Helper.rewriteUrl){
return bux.iwidget.canvas.Helper.rewriteUrl(url);
}
return url;
};
BusinessProcessAction.prototype.handleGetBPMProcessFail=function(_884){
var _885=RV_RES.IDS_JS_BUSINESS_PROCESS_GET_PROCESSES_FAIL_MSG;
var _886=_884.getResponseText();
this._showErrorMessage(_885,_886);
};
BusinessProcessAction.prototype.handleGetBPMProcessSuccess=function(_887){
var _888=_887.getResponseText();
if(!_888){
return;
}
var _889=dojo.fromJson(_888);
var _88a=this._getBusinessProcessesInfo(_889.data.exposedItemsList);
this._showDialog(_88a);
};
BusinessProcessAction.prototype._getBusinessProcessesInfo=function(_88b){
if(!_88b){
return;
}
var _88c=_88b.length;
var _88d=new Array();
var _88e={};
for(var i=0;i<_88c;i++){
var _890=_88b[i].display;
var _891=_88b[i].itemID;
var _892=_88b[i].processAppID;
if(_890&&!_88e[_890]&&_891&&_892){
_88e[_890]=true;
_88d.push({sCaption:_890,sBPD_ID:_891,sProcessAppID:_892});
}
}
return _88d;
};
BusinessProcessAction.prototype._showDialog=function(_893){
var _894=this;
var _895=new viewer.dialogs.SelectBusinessProcess({sTitle:RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_TITLE,sLabel:RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_DESC,okHandler:function(){
},cancelHandler:function(){
},BPMProcessesInfo:_893,bpAction:_894});
_895.startup();
_895.show();
};
BusinessProcessAction.prototype.getInputParameter=function(_896){
var obj=null;
var _898=this.getCognosViewer();
var _899=_898.getSelectionController();
var _89a=_899.getSelectedObjectsJsonContext();
if(_89a){
var _89b=_89a;
if(_896){
_89b=dojo.toJson(_89b);
}
obj={"cognosParameter":_89b};
}
return obj;
};
BusinessProcessAction.prototype.startProcess=function(_89c,_89d,_89e){
var _89f={customArguments:[_89e],complete:{object:this,method:this.handleGetStartProcessSuccessResponse},fault:{object:this,method:this.handleGetStartProcessFailResponse}};
var url=this.m_BPMGateway+"process";
var _8a1=new Array();
_8a1.push({name:"action",value:"start"});
_8a1.push({name:"parts",value:"data"});
if(_89c){
_8a1.push({name:"bpdId",value:_89c});
}
if(_89d){
_8a1.push({name:"processAppId",value:_89d});
}
var _8a2=this.getInputParameter(true);
if(_8a2){
_8a1.push({name:"params",value:dojo.toJson(_8a2)});
}
var _8a3=this._createBPMServerRequest("POST",_89f,url,_8a1);
_8a3.sendRequest();
};
BusinessProcessAction.prototype.handleGetStartProcessSuccessResponse=function(_8a4,_8a5){
var _8a6=_8a4.getResponseText();
if(_8a6){
var _8a7=dojo.fromJson(_8a6);
if(_8a7.status==="200"){
var sMsg=CViewerCommon.getMessage(RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG,_8a5);
var _8a9=new ModalInfoMessageDialog({sTitle:RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG_TITLE,sMessage:sMsg,sDescription:RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_SUCCEED_MSG_DETAIL});
_8a9.show();
}
}
};
BusinessProcessAction.prototype.handleGetStartProcessFailResponse=function(_8aa,_8ab){
var _8ac=_8aa.getResponseXml();
if(_8ac&&_8ac.documentElement){
this._handleXMLErrorResponse(_8ac,_8ab);
return;
}
var _8ad=CViewerCommon.getMessage(RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_FAILED_MSG,_8ab);
var _8ae=_8aa.getResponseText();
try{
var _8af=dojo.fromJson(_8ae);
_8ae=_8af.Data.errorMessage;
}
catch(err){
}
this._showErrorMessage(_8ad,_8ae);
};
BusinessProcessAction.prototype._handleXMLErrorResponse=function(_8b0,_8b1){
var _8b2=XMLHelper_FindChildrenByTagName(_8b0,"error");
var _8b3="";
var _8b4="";
if(_8b2){
_8b3=XMLHelper_FindChildrenByTagName(_8b2,"message").childNodes[0].nodeValue;
_8b4=XMLHelper_FindChildrenByTagName(_8b2,"detail").childNodes[0].nodeValue;
}else{
_8b3=CViewerCommon.getMessage(RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_FAILED_MSG,_8b1);
}
this._showErrorMessage(_8b3,_8b4);
};
BusinessProcessAction.prototype._showErrorMessage=function(_8b5,_8b6){
var _8b7=new ModalFaultMessageDialog(_8b5,_8b6);
_8b7.show();
};
BusinessProcessAction.prototype._hasAnyContextInSelectedObjects=function(){
var _8b8=false;
var _8b9=this.m_oCV.getSelectionController();
var _8ba=_8b9.getAllSelectedObjects();
for(var i=0;i<_8ba.length;i++){
var _8bc=_8ba[i].getSelectedContextIds();
if(_8bc&&_8bc.length>0){
_8b8=true;
break;
}
}
return _8b8;
};
function DrillResetAction(){
this.m_sAction="DrillDown";
this.m_sharePromptValues=null;
this.m_aDrilledResetHUNs=null;
this.m_updateInfoBar=true;
};
DrillResetAction.prototype=new ModifyReportAction();
DrillResetAction.prototype.setRequestParms=function(_8bd){
this.m_aDrilledResetHUNs=_8bd.drilledResetHUNs;
this.m_sharePromptValues=_8bd.promptValues;
};
DrillResetAction.prototype.addAdditionalOptions=function(oReq){
if(!this.m_oCV){
return;
}
if(!this.m_sharePromptValues){
this.m_oCV.preparePromptValues(oReq);
oReq.getRequestHandler().setForceRaiseSharePrompt(true);
}else{
if(!this.m_sharePromptValues){
return;
}
for(var _8bf in this.m_sharePromptValues){
oReq.addFormField(_8bf,this.m_sharePromptValues[_8bf]);
}
}
};
DrillResetAction.prototype.addActionContextAdditionalParms=function(){
var _8c0="<HUNS>";
for(var i=0;i<this.m_aDrilledResetHUNs.length;i++){
_8c0+="<HUN>"+xml_encode(this.m_aDrilledResetHUNs[i])+"</HUN>";
}
_8c0+="</HUNS>";
_8c0+="<action>resetDimension</action>";
return _8c0;
};
DrillResetAction.prototype.setUpdateInfoBar=function(_8c2){
this.m_updateInfoBar=_8c2;
};
DrillResetAction.prototype.updateInfoBar=function(){
this.m_updateInfoBar;
};
function RemoveAllDataFilterAction(){
this.m_sAction="UpdateDataFilter";
};
RemoveAllDataFilterAction.prototype.setCognosViewer=function(oCV){
this.m_oCV=oCV;
};
RemoveAllDataFilterAction.prototype.getCognosViewer=function(oCV){
return this.m_oCV;
};
RemoveAllDataFilterAction.prototype.setRequestParms=function(_8c5){
if(!_8c5||!_8c5.callback){
return;
}
this.m_callbackMethod=_8c5.callback.method;
this.m_callbackObject=_8c5.callback.object;
};
RemoveAllDataFilterAction.prototype.createJSONDispatcherEntry=function(_8c6){
var oReq=new JSONDispatcherEntry(this.getCognosViewer());
oReq.addFormField("ui.action",_8c6);
var _8c8=this.addActionContext();
oReq.addFormField("cv.actionContext",_8c8);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_8c8,"xml");
}
if(typeof this.m_oCV.envParams["ui.spec"]!="undefined"){
oReq.addFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
}
oReq.addFormField("bux","true");
return oReq;
};
RemoveAllDataFilterAction.prototype.addActionContext=function(){
var _8c9="<reportActions";
var _8ca="";
_8c9+=" run=\"false\"";
_8c9+=">";
_8c9+="<reportAction name=\""+this.m_sAction+"\">";
var _8cb="{ \"removeAll\" :\"true\"}";
_8c9+=xml_encode(_8cb);
_8c9+="</reportAction>";
_8c9+="</reportActions>";
return _8c9;
};
RemoveAllDataFilterAction.prototype.executeCallback=function(_8cc){
var _8cd=GUtil.generateCallback(this.m_callbackMethod,[_8cc],this.m_callbackObject);
_8cd();
};
RemoveAllDataFilterAction.prototype.handleServerResponse=function(_8ce){
if(_8ce&&_8ce.getJSONResponseObject()){
this.executeCallback(_8ce.getJSONResponseObject().reportSpec);
}
};
RemoveAllDataFilterAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
if(!oCV.getRAPReportInfo().hasSlider()){
this.executeCallback(oCV.envParams["ui.spec"]);
}else{
var _8d0=this.createJSONDispatcherEntry("modifyReport");
_8d0.setCallbacks({"complete":{"object":this,"method":this.handleServerResponse}});
oCV.dispatchRequest(_8d0);
}
};
CCognosViewer.prototype.loadExtra=function(){
};
function DrillContextMenuHelper(){
};
DrillContextMenuHelper.updateDrillMenuItems=function(_8d1,oCV,_8d3){
var _8d4=[];
if(DrillContextMenuHelper.needsDrillSubMenu(oCV)){
var _8d5=oCV.getSelectionController();
var _8d6=_8d5.getAllSelectedObjects();
var _8d7=_8d6[0];
if(_8d7.getUseValues().length>1&&typeof RV_RES!="undefined"){
var _8d8={name:_8d3,label:RV_RES.RV_DRILL_DEFAULT,action:{name:_8d3,payload:{}}};
_8d4.push(_8d8);
}
var _8d9=(_8d7.getUseValues().length>1)?1:0;
var _8da=_8d7.getUseValues().length-1;
_8da=(_8da>2)?2:_8da;
for(var iDim=_8d9;iDim<=_8da;++iDim){
DrillContextMenuHelper.addSubMenuItem(_8d3,_8d4,_8d7,iDim,0);
}
var _8dc=false;
for(var iDim=_8d9;iDim<=_8da;++iDim){
for(var _8dd=1;_8dd<_8d7.getUseValues()[iDim].length;++_8dd){
if(_8dc==false){
_8d4.push({separator:true});
_8dc=true;
}
DrillContextMenuHelper.addSubMenuItem(_8d3,_8d4,_8d7,iDim,_8dd);
}
}
}
DrillContextMenuHelper.completeDrillMenu(_8d3,_8d4,_8d1);
};
DrillContextMenuHelper.needsDrillSubMenu=function(oCV){
var _8df=(oCV&&oCV.getSelectionController());
if(_8df){
var _8e0=_8df.getAllSelectedObjects();
if(_8e0.length==1&&_8e0[0].isHomeCell&&_8e0[0].isHomeCell()==false){
var _8e1=_8e0[0].isSelectionOnVizChart();
if(!_8e1){
var _8e2=oCV.getAdvancedServerProperty("VIEWER_JS_ENABLE_DRILL_SUBMENU");
_8e1=(_8e2=="charts"&&_8df.hasSelectedChartNodes());
}
if(_8e1){
var _8e3=_8e0[0];
return (_8e1&&_8e3.getUseValues()&&(_8e3.getUseValues().length>1||_8e3.getUseValues()[0].length>1));
}
}
}
return false;
};
DrillContextMenuHelper.addSubMenuItem=function(_8e4,_8e5,_8e6,iDim,_8e8){
var _8e9=_8e6.getDrillOptions()[iDim][_8e8];
if(DrillContextMenuHelper.isOptionDrillable(_8e4,_8e9)){
var _8ea=DrillContextMenuHelper.getItemValue(_8e6,iDim,_8e8);
if(_8ea){
var _8eb=_8e6.getDataItems()[iDim][_8e8];
var _8ec={name:_8e4,label:_8ea,action:{name:_8e4,payload:{userSelectedDrillItem:_8eb}}};
_8e5.push(_8ec);
}
}
};
DrillContextMenuHelper.completeDrillMenu=function(_8ed,_8ee,_8ef){
if(_8ee.length>0){
_8ef.items=_8ee;
}else{
_8ef.items=null;
if(_8ef.action==null){
_8ef.action={name:_8ed,action:{name:_8ed}};
}
}
};
DrillContextMenuHelper.isOptionDrillable=function(_8f0,_8f1){
return (_8f1>=3||(_8f0=="DrillDown"&&_8f1==2)||(_8f0=="DrillUp"&&_8f1==1));
};
DrillContextMenuHelper.getItemValue=function(_8f2,iDim,_8f4){
var _8f5=(_8f4==0)?_8f2.getDisplayValues()[iDim]:null;
return ((_8f5)?_8f5:_8f2.getUseValues()[iDim][_8f4]);
};
dojo.provide("viewer.dialogs.ClipboardDialog");
dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.Button");
dojo.declare("viewer.dialogs.ClipboardDialog",bux.dialogs.BaseCustomContentDialog,{sTitle:null,okHandler:null,cancelHandler:null,startup:function(){
this.updateTitle(this.sTitle);
this.inherited(arguments);
var _8f6=new bux.layout.TableContainer({classname:"bux-InformationDialog"},this.contentContainer);
var cell=null,row=null;
this._textField=new dijit.form.SimpleTextarea({required:true,rows:10,cols:50,style:"width:auto"});
row=new bux.layout.TableContainerRow({parentContainer:_8f6});
cell=new bux.layout.TableContainerCell({classname:"bux-dialog-field",parentContainer:row});
cell.addContent(this._textField.domNode);
},onOK:function(){
if(this._textField.state!="Error"){
this.inherited(arguments);
this.okHandler(this._textField.get("value"));
this.hide();
}
}});
dojo.provide("bux.reportViewer.chart");
dojo.declare("bux.reportViewer.chart",null,{m_displayTypeDialogDefinition:null,constructor:function(){
this.initialize();
},initialize:function(){
if(this.m_displayTypeDialogDefinition!==null){
return;
}
this.m_displayTypeDialogDefinition=[{label:RV_RES.IDS_JS_CHART_TABLE,image:"images/dialog/displayOptionsDialog/type_icons/table.gif",options:[{label:RV_RES.IDS_JS_CHART_CROSSTAB,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/crosstab_48.gif",value:"crosstab"},{label:RV_RES.IDS_JS_CHART_LIST_TABLE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/List_48.gif",value:"list"}]},{label:RV_RES.IDS_JS_CHART_COLUMN,image:"images/dialog/displayOptionsDialog/type_icons/column.gif",options:[{label:RV_RES.IDS_JS_CHART_COLUMN,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_column_clustered_flat.gif",value:"column_clustered_flat"},{label:RV_RES.IDS_JS_CHART_COLUMN_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_column_clustered.gif",value:"column_clustered"},{label:RV_RES.IDS_JS_CHART_STACKED_COLUMN,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_column_stacked_flat.gif",value:"column_stacked_flat"},{label:RV_RES.IDS_JS_CHART_STACKED_COLUMN_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_column_stacked.gif",value:"column_stacked"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_column_percent_flat.gif",value:"column_percent_flat"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_column_percent.gif",value:"column_percent"},{label:RV_RES.IDS_JS_CHART_3D_AXIS_COLUMN,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_column_3daxis.gif",value:"column_3daxis"},{label:RV_RES.IDS_JS_CHART_COLUMN,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_clustered.jpg",value:"v2_column_rectangle_clustered"},{label:RV_RES.IDS_JS_CHART_COLUMN_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_clustered_depth.jpg",value:"v2_column_box_clustered_depth"},{label:RV_RES.IDS_JS_CHART_STACKED_COLUMN,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_stacked.jpg",value:"v2_column_rectangle_stacked"},{label:RV_RES.IDS_JS_CHART_STACKED_COLUMN_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_stacked_depth.jpg",value:"v2_column_box_stacked_depth"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_percent.jpg",value:"v2_column_rectangle_percent"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_percent_depth.jpg",value:"v2_column_box_percent_depth"}]},{label:RV_RES.IDS_JS_CHART_BAR,image:"images/dialog/displayOptionsDialog/type_icons/bar.gif",options:[{label:RV_RES.IDS_JS_CHART_BAR,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_clustered_flat.gif",value:"bar_clustered_flat"},{label:RV_RES.IDS_JS_CHART_BAR_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_clustered.gif",value:"bar_clustered"},{label:RV_RES.IDS_JS_CHART_STACKED_BAR,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_stacked_flat.gif",value:"bar_stacked_flat"},{label:RV_RES.IDS_JS_CHART_STACKED_BAR_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_stacked.gif",value:"bar_stacked"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_percent_flat.gif",value:"bar_percent_flat"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_percent.gif",value:"bar_percent"},{label:RV_RES.IDS_JS_CHART_BAR,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_clustered.jpg",value:"v2_bar_rectangle_clustered"},{label:RV_RES.IDS_JS_CHART_BAR_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_clustered_depth.jpg",value:"v2_bar_box_clustered_depth"},{label:RV_RES.IDS_JS_CHART_STACKED_BAR,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_stacked.jpg",value:"v2_bar_rectangle_stacked"},{label:RV_RES.IDS_JS_CHART_STACKED_BAR_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_stacked_depth.jpg",value:"v2_bar_box_stacked_depth"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_percent.jpg",value:"v2_bar_rectangle_percent"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_percent_depth.jpg",value:"v2_bar_box_percent_depth"}]},{label:RV_RES.IDS_JS_CHART_LINE,image:"images/dialog/displayOptionsDialog/type_icons/line.gif",options:[{label:RV_RES.IDS_JS_CHART_LINE_WITH_MARKERS,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered_flat_markers.gif",value:"line_clustered_flat_markers"},{label:RV_RES.IDS_JS_CHART_LINE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered_flat.gif",value:"line_clustered_flat"},{label:RV_RES.IDS_JS_CHART_LINE_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered.gif",value:"line_clustered"},{label:RV_RES.IDS_JS_CHART_STEP_LINE_MARKERS,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stepAtPoint_clustered_flat_markers.gif",value:"line_stepAtPoint_clustered_flat_markers"},{label:RV_RES.IDS_JS_CHART_STEP_LINE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stepAtPoint_clustered_flat.gif",value:"line_stepAtPoint_clustered_flat"},{label:RV_RES.IDS_JS_CHART_STACKED_LINE_MARKERS,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked_flat_markers.gif",value:"line_stacked_flat_markers"},{label:RV_RES.IDS_JS_CHART_STACKED_LINE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked_flat.gif",value:"line_stacked_flat"},{label:RV_RES.IDS_JS_CHART_STACKED_LINE_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked.gif",value:"line_stacked"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE_MARKERS,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent_flat_markers.gif",value:"line_percent_flat_markers"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent_flat.gif",value:"line_percent_flat"},{label:RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE__3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent.gif",value:"line_percent"},{label:RV_RES.IDS_JS_CHART_3D_AXIS_LINE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_line_3daxis.gif",value:"line_3daxis"},{label:RV_RES.IDS_JS_CHART_LINE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered.jpg",value:"v2_line_clustered"},{label:RV_RES.IDS_JS_CHART_LINE_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_depth.jpg",value:"v2_line_clustered_depth"},{label:RV_RES.IDS_JS_CHART_LINE_WITH_MARKERS,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_markers.jpg",value:"v2_line_clustered_markers"},{label:RV_RES.IDS_JS_CHART_LINE_WITH_3D_MARKERS,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_3dmarkers.jpg",value:"v2_line_clustered_3dmarkers"},{label:RV_RES.IDS_JS_CHART_STEP_LINE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_stepped_line_at_points_clustered.jpg",value:"v2_stepped_line_at_points_clustered"},{label:RV_RES.IDS_JS_CHART_STEP_LINE_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_stepped_line_at_points_clustered_depth.jpg",value:"v2_stepped_line_at_points_clustered_depth"}]},{label:RV_RES.IDS_JS_CHART_PIE_DONUT,image:"images/dialog/displayOptionsDialog/type_icons/pie.gif",options:[{label:RV_RES.IDS_JS_CHART_PIE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_flat.gif",value:"pie_flat"},{label:RV_RES.IDS_JS_CHART_DONUT,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_flat_hole.gif",value:"pie_flat_hole"},{label:RV_RES.IDS_JS_CHART_PIE_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_pie.gif",value:"pie"},{label:RV_RES.IDS_JS_CHART_DONUT_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_hole.gif",value:"pie_hole"},{label:RV_RES.IDS_JS_CHART_PIE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_flat.jpg",value:"v2_pie"},{label:RV_RES.IDS_JS_CHART_PIE_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie.jpg",value:"v2_pie_depth_round"},{label:RV_RES.IDS_JS_CHART_DONUT,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_hole_flat.jpg",value:"v2_donut"},{label:RV_RES.IDS_JS_CHART_DONUT_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_hole.jpg",value:"v2_donut_depth_round"}]},{label:RV_RES.IDS_JS_CHART_AREA,image:"images/dialog/displayOptionsDialog/type_icons/area.gif",options:[{label:RV_RES.IDS_JS_CHART_AREA,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_area_clustered_flat.gif",value:"area_clustered_flat"},{label:RV_RES.IDS_JS_CHART_AREA_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_area_clustered.gif",value:"area_clustered"},{label:RV_RES.IDS_JS_CHART_STACKED_AREA,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_area_stacked_flat.gif",value:"area_stacked_flat"},{label:RV_RES.IDS_JS_CHART_STACKED_AREA_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_area_stacked.gif",value:"area_stacked"},{label:RV_RES.IDS_JS_CHART_PERCENT_AREA,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_area_percent_flat.gif",value:"area_percent_flat"},{label:RV_RES.IDS_JS_CHART_PERCENT_AREA_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_area_percent.gif",value:"area_percent"},{label:RV_RES.IDS_JS_CHART_3D_AXIS_AREA,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_area_3daxis.gif",value:"area_3daxis"},{label:RV_RES.IDS_JS_CHART_STACKED_AREA,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_flat_point_to_point.gif",value:"v2_area_stacked_flat"},{label:RV_RES.IDS_JS_CHART_STACKED_AREA_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_depth_point_to_point.gif",value:"v2_area_stacked"},{label:RV_RES.IDS_JS_CHART_PERCENT_AREA,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_flat_percent_point_to_point.gif",value:"v2_area_percent_flat"},{label:RV_RES.IDS_JS_CHART_PERCENT_AREA_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_depth_percent_point_to_point.gif",value:"v2_area_percent"}]},{label:RV_RES.IDS_JS_CHART_SCATTER_BUBBLE_POINT,image:"images/dialog/displayOptionsDialog/type_icons/scatter.gif",options:[{label:RV_RES.IDS_JS_CHART_SCATTER,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_scatter.gif",value:"scatter"},{label:RV_RES.IDS_JS_CHART_BUBBLE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_bubble.gif",value:"bubble"},{label:RV_RES.IDS_JS_CHART_BUBBLE_WITH_EXCEL_BUBBLE_SIZING,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_bubble_excel.gif",value:"bubble_zeroBased"},{label:RV_RES.IDS_JS_CHART_POINT,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_point_clustered.gif",value:"point_clustered"},{label:RV_RES.IDS_JS_CHART_3D_SCATTER,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_scatter_3daxis.gif",value:"scatter_3daxis"},{label:RV_RES.IDS_JS_CHART_SCATTER,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_scatter.gif",value:"v2_scatter"},{label:RV_RES.IDS_JS_CHART_BUBBLE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bubble.gif",value:"v2_bubble"},{label:RV_RES.IDS_JS_CHART_BUBBLE_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bubble_3dmarkers.gif",value:"v2_bubble_3d"},{label:RV_RES.IDS_JS_CHART_POINT,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_point_clustered_markers.jpg",value:"v2_point_clustered_markers"},{label:RV_RES.IDS_JS_CHART_POINT_3D,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_point_clustered_3dmarkers.jpg",value:"v2_point_clustered_3dmarkers"}]},{label:RV_RES.IDS_JS_CHART_GAUGE,image:"images/dialog/displayOptionsDialog/type_icons/gauge.gif",options:[{label:RV_RES.IDS_JS_CHART_DIAL_GAUGE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_gauge_dial.gif",value:"gauge_dial"},{label:RV_RES.IDS_JS_CHART_DIAL_GAUGE,Description:"",image:"images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_gauge.gif",value:"v2_gauge"}]}];
},getDisplayTypeDialogDefinition:function(_8f9){
var _8fa=[];
for(var j in this.m_displayTypeDialogDefinition){
var _8fc=this.m_displayTypeDialogDefinition[j];
var _8fd={};
_8fd.image=this.m_displayTypeDialogDefinition[j].image;
_8fd.label=this.m_displayTypeDialogDefinition[j].label;
_8fd.options=[];
var _8fe=_8fc.options;
for(var k in _8fe){
var _900=_8fe[k];
for(var i in _8f9){
var _902=_8f9[i];
if(_900.value===_902){
var _903={label:_900.label,Description:_900.Description,image:_900.image,value:"{targetType:'"+_900.value+"', label:'"+_900.label+"'}"};
_8fd.options.push(_903);
}
}
}
if(_8fd.options.length>0){
_8fa.push(_8fd);
}
}
return _8fa;
}});
function ActionFormFields(_904){
this.m_dispatcherEntry=_904;
this.m_oCV=_904.getViewer();
};
ActionFormFields.prototype.addFormFields=function(){
var _905=this.m_dispatcherEntry;
var _906=_905.getAction();
_906.preProcess();
_905.addFormField("ui.action","modifyReport");
if(this.m_oCV.getModelPath()!==""){
_905.addFormField("modelPath",this.m_oCV.getModelPath());
if(typeof this.m_oCV.envParams["metaDataModelModificationTime"]!="undefined"){
_905.addFormField("metaDataModelModificationTime",this.m_oCV.envParams["metaDataModelModificationTime"]);
}
}
if(_906.doAddActionContext()===true){
var _907=_906.addActionContext();
_905.addFormField("cv.actionContext",_907);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_907,"xml");
}
}
var _908=this.m_oCV.envParams["bux"]=="true";
if(_908){
_905.addFormField("cv.showFaultPage","false");
}else{
_905.addFormField("cv.showFaultPage","true");
}
_905.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_905.addDefinedFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_905.addDefinedFormField("modelPath",this.m_oCV.envParams["modelPath"]);
_905.addDefinedFormField("packageBase",this.m_oCV.envParams["packageBase"]);
_905.addDefinedFormField("rap.state",this.m_oCV.envParams["rap.state"]);
_905.addDefinedFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
_905.addDefinedFormField("ui.primaryAction",this.m_oCV.envParams["ui.primaryAction"]);
_905.addNonNullFormField("cv.debugDirectory",this.m_oCV.envParams["cv.debugDirectory"]);
_905.addNonNullFormField("ui.objectClass",this.m_oCV.envParams["ui.objectClass"]);
_905.addNonNullFormField("bux",this.m_oCV.envParams["bux"]);
_905.addNonNullFormField("baseReportModificationTime",this.m_oCV.envParams["baseReportModificationTime"]);
_905.addNonNullFormField("originalReport",this.m_oCV.envParams["originalReport"]);
var _909=this.m_oCV.getFlashChartOption();
if(_909!=null){
_905.addFormField("savedFlashChartOption",_909);
if(_909&&_906!=null&&typeof (_906.m_requestParams)!="undefined"&&typeof (_906.m_requestParams.targetType)!="undefined"){
var _90a=false;
var _90b=null;
if(typeof (_906.m_requestParams.targetType.targetType)!="undefined"){
_90b=_906.m_requestParams.targetType.targetType;
}else{
_90b=_906.m_requestParams.targetType;
}
if(_90b.match("v2_")!=null||_90b.match("_v2")!=null){
_90a=true;
}else{
var _90c=this.m_oCV.getRAPReportInfo();
var _90d=_906.getSelectedReportInfo();
if(_90c&&_90d){
var _90e=_90c.getDisplayTypes(_90d.container);
if(_90e.match("v2_")!=null||_90e.match("_v2")!=null){
_90a=true;
}
}
}
_905.addFormField("hasAVSChart",_90a);
}else{
_905.addFormField("hasAVSChart",this.m_oCV.hasAVSChart());
}
}
var sEP=this.m_oCV.getExecutionParameters();
if(sEP){
_905.addFormField("executionParameters",encodeURIComponent(sEP));
}
_905.addFormField("ui.conversation",encodeURIComponent(this.m_oCV.getConversation()));
_905.addFormField("m_tracking",encodeURIComponent(this.m_oCV.getTracking()));
var sCAF=this.m_oCV.getCAFContext();
if(sCAF){
_905.addFormField("ui.cafcontextid",sCAF);
}
if(_906.forceRunSpecRequest()){
_905.addFormField("widget.forceRunSpec","true");
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
var sCAF=oCV.getCAFContext();
this.addDefinedNonNullFormField("ui.cafcontextid",sCAF);
};
HiddenIframeDispatcherEntry.prototype.sendRequest=function(){
this._createHiddenIframe();
var form=this._createForm();
this._setupCallbacks();
this.onPreHttpRequest(this.getRequest());
form.submit();
};
HiddenIframeDispatcherEntry.prototype._iframeRequestComplete=function(){
window.getViewerConfiguration=this.originalGetViewerConfiguration;
this.onPostHttpRequest();
this.onEntryComplete();
};
HiddenIframeDispatcherEntry.prototype._setupCallbacks=function(){
this.originalGetViewerConfiguration=window.getViewerConfiguration;
if(this.getFormField("cv.useAjax")!="false"){
var _915=this;
var _916=this.getRequestHandler().getRequestIndicator();
var _917=this.getRequestHandler().getWorkingDialog();
window.getViewerConfiguration=function(){
var _918={"httpRequestCallbacks":{"reportStatus":{"complete":function(){
_915.onComplete();
},"working":function(){
_915.onWorking();
},"prompting":function(){
_915.onPrompting();
}}}};
return _918;
};
}
};
HiddenIframeDispatcherEntry.prototype.setIframeId=function(id){
this._iframeId=id;
};
HiddenIframeDispatcherEntry.prototype.getIframeId=function(){
return this._iframeId;
};
HiddenIframeDispatcherEntry.prototype._createForm=function(_91a){
var oCV=this.getViewer();
var _91c=HiddenIframeDispatcherEntry.FORM_NAME+oCV.getId();
var _91d=document.getElementById(_91c);
if(_91d){
_91d.parentNode.removeChild(_91d);
_91d=null;
}
var _91e=location.protocol+"//"+location.host+oCV.m_sGateway;
_91d=document.createElement("form");
_91d.setAttribute("method","post");
_91d.setAttribute("action",_91e);
_91d.setAttribute("target",this.getIframeId());
_91d.setAttribute("id",_91c);
_91d.style.display="none";
var _91f=this.getRequest().getFormFields();
var _920=_91f.keys();
for(var _921=0;_921<_920.length;_921++){
_91d.appendChild(createHiddenFormField(_920[_921],_91f.get(_920[_921])));
}
document.body.appendChild(_91d);
return _91d;
};
HiddenIframeDispatcherEntry.prototype._createHiddenIframe=function(){
var oCV=this.getViewer();
var _923=this.getIframeId();
var _924=document.getElementById(_923);
if(_924){
_924.parentNode.parentNode.removeChild(_924.parentNode);
}
var div=document.createElement("div");
div.style.position="absolute";
div.style.left="0px";
div.style.top="0px";
div.style.display="none";
document.body.appendChild(div);
div.innerHTML="<iframe frameborder=\"0\" id=\""+_923+"\" name=\""+_923+"\"></iframe>";
_924=document.getElementById(_923);
var _926=this;
var func=function(){
HiddenIframeDispatcherEntry.handleIframeLoad(_926);
};
if(_924.attachEvent){
_924.attachEvent("onload",func);
}else{
_924.addEventListener("load",func,true);
}
};
HiddenIframeDispatcherEntry.hideIframe=function(cvId){
var _929=document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX+cvId);
if(_929){
_929.parentNode.style.display="none";
}
};
HiddenIframeDispatcherEntry.showIframeContentsInWindow=function(cvId){
var _92b=document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX+cvId);
if(!_92b){
return;
}
var html=_92b.contentWindow.document.getElementsByTagName("html")[0].innerHTML;
var _92d=window.open("","","height=400,width=500");
if(_92d){
_92d.document.write("<html>"+html+"</html>");
}
};
HiddenIframeDispatcherEntry.handleIframeLoad=function(_92e){
if(!_92e){
return;
}
var _92f=document.getElementById(_92e.getIframeId());
if(!_92f){
return;
}
var oCV=_92f.contentWindow.window.gaRV_INSTANCES?_92f.contentWindow.window.gaRV_INSTANCES[0]:null;
var _931=oCV?oCV.getStatus():null;
if(_931=="complete"){
_92e.onComplete();
}
if(_931=="working"){
_92e.onWorking();
}
if(_931=="prompting"){
_92e.onPrompting();
}
if(!oCV||_931=="fault"||_931==""){
_92e.onFault();
}
};
HiddenIframeDispatcherEntry.prototype.onFault=function(){
this._iframeRequestComplete();
HiddenIframeDispatcherEntry.showIframeContentsInWindow(this.getViewer().getId());
};
HiddenIframeDispatcherEntry.prototype.onPrompting=function(){
this._iframeRequestComplete();
if(this.m_httpRequestConfig){
var _932=this.m_httpRequestConfig.getReportStatusCallback("prompting");
if(typeof _932=="function"){
_932();
}
}
HiddenIframeDispatcherEntry.showIframeContentsInWindow(this.getViewer().getId());
};
HiddenIframeDispatcherEntry.prototype.onComplete=function(){
this._iframeRequestComplete();
if(this.m_httpRequestConfig){
var _933=this.m_httpRequestConfig.getReportStatusCallback("complete");
if(typeof _933=="function"){
_933();
}
}
var _934=document.getElementById(this.getIframeId());
if(typeof _934.contentWindow.detachLeavingRV=="function"){
_934.contentWindow.detachLeavingRV();
}
var _935=_934.parentNode;
_935.style.display="none";
if(this.getCallbacks()&&this.getCallbacks()["complete"]){
HiddenIframeDispatcherEntry.executeCallback(this.getCallbacks()["complete"]);
}
};
HiddenIframeDispatcherEntry.prototype.cancelRequest=function(_936){
this._iframeRequestComplete();
if(!this.m_bCancelCalled){
this.m_bCancelCalled=true;
var _937=document.getElementById(this.getIframeId());
if(!_937){
return;
}
var oCV=_937.contentWindow[getCognosViewerObjectString(this.getViewer().getId())];
if(oCV){
oCV.cancel();
}
}
};
HiddenIframeDispatcherEntry.executeCallback=function(_939){
if(_939){
var _93a=GUtil.generateCallback(_939.method,_939.params,_939.object);
_93a();
}
};
HiddenIframeDispatcherEntry.getIframe=function(cvId){
var _93c=document.getElementById(HiddenIframeDispatcherEntry.IFRAME_ID_PREFIX+cvId);
return _93c;
};
function ReportInfoDispatcherEntry(oCV){
ReportInfoDispatcherEntry.baseConstructor.call(this,oCV);
if(oCV){
this.setCallbacks({"complete":{"object":this,"method":this.onComplete},"prompting":{"object":this,"method":this.onPrompting}});
this.getRequestHandler().setFaultDialog(new ModalFaultDialog(oCV));
}
};
ReportInfoDispatcherEntry.prototype=new AsynchJSONDispatcherEntry();
ReportInfoDispatcherEntry.baseConstructor=AsynchJSONDispatcherEntry;
ReportInfoDispatcherEntry.prototype.initializeAction=function(_93e){
this.setKey(_93e.getActionKey());
this.setCanBeQueued(_93e.canBeQueued());
this.m_action=_93e;
};
ReportInfoDispatcherEntry.prototype.getAction=function(){
return this.m_action;
};
ReportInfoDispatcherEntry.prototype.prepareRequest=function(){
var _93f=new ActionFormFields(this);
_93f.addFormFields();
};
ReportInfoDispatcherEntry.prototype.onComplete=function(_940,arg1){
if(this.m_oCV.getViewerDispatcher().queueIsEmpty()==true){
var _942=this.m_action.getOnCompleteCallback();
_942(_940);
}
};
ReportInfoDispatcherEntry.prototype.onPrompting=function(_943,arg1){
var _945=this.m_action.getOnPromptingCallback();
_945(_943);
};
ReportInfoDispatcherEntry.prototype.onPostEntryComplete=function(){
var oCV=this.getViewer();
if(oCV&&oCV.getViewerWidget()){
var _947=oCV.getViewerWidget();
_947.getLoadManager().processQueue();
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
ModifyReportDispatcherEntry.prototype.initializeAction=function(_949){
this.setKey(_949.getActionKey());
this.setCanBeQueued(_949.canBeQueued());
this.m_action=_949;
};
ModifyReportDispatcherEntry.prototype.getAction=function(){
return this.m_action;
};
ModifyReportDispatcherEntry.prototype.prepareRequest=function(){
if(this.m_viewerWidget){
DispatcherEntry.addWidgetInfoToFormFields(this.m_viewerWidget,this);
}
var _94a=new ActionFormFields(this);
_94a.addFormFields();
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
ModifyReportDispatcherEntry.prototype.onComplete=function(_94b,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onComplete(_94b);
}
};
ModifyReportDispatcherEntry.prototype.onPrompting=function(_94d){
if(this.getRequestHandler()){
this.getRequestHandler().onPrompting(_94d);
}
};
ModifyReportDispatcherEntry.prototype.onWorking=function(_94e,arg1){
this.parent.onWorking.call(this,_94e,arg1);
var _950=_94e.getResponseState();
if(this.getRequestHandler()){
this.getRequestHandler().updateViewerState(_950);
}
};
dojo.provide("ModalInfoMessageDialog");
dojo.declare("ModalInfoMessageDialog",null,{sMessage:"",sDescription:"",sTitle:"",constructor:function(args){
dojo.safeMixin(this,args);
},getMessage:function(){
return this.sMessage;
},getDescription:function(){
return this.sDescription;
},getTitle:function(){
return this.sTitle;
},show:function(){
dojo["require"]("bux.dialogs.InformationDialog");
var _952=new bux.dialogs.InformationDialog({title:this.getTitle(),sMainMessage:this.getMessage(),sDescription:this.getDescription(),sInfoIconClass:"bux-informationDialog-info-icon"});
_952.show();
}});
function CCognosViewerSaveReport(_953,_954){
this.m_cognosViewer=_953;
this.m_params=null;
this.dashboardToSaveIn=_954.cm$storeID;
this.m_doSaveAsOnFault=false;
};
CCognosViewerSaveReport.prototype.canSave=function(_955){
return (this.doSaveAs()||_955&&_955.indexOf("write")!==-1);
};
CCognosViewerSaveReport.prototype.isSavedOutput=function(){
var _956=this.m_cognosViewer.envParams["ui.action"];
return (typeof _956!=="undefined"&&_956==="view");
};
CCognosViewerSaveReport.prototype.doSaveAs=function(){
var _957=(this.m_doSaveAsOnFault||!this.m_cognosViewer.envParams["savedReportName"]||!this.isSameDashboard());
return _957;
};
CCognosViewerSaveReport.prototype.isSameDashboard=function(){
var _958=(this.m_cognosViewer.envParams["ui.object"].indexOf(this.dashboardToSaveIn)!==-1);
return _958;
};
CCognosViewerSaveReport.prototype.getUIAction=function(){
return (this.doSaveAs()?"saveInDashboard":"updateSavedReport");
};
CCognosViewerSaveReport.prototype.populateRequestParams=function(_959){
_959.addFormField("ui.action",this.getUIAction());
_959.addFormField("cv.ignoreState","true");
_959.addFormField("dashboard-id",this.dashboardToSaveIn);
_959.addNonEmptyStringFormField("executionParameters",this.m_cognosViewer.m_sParameters);
for(var _95a in this.m_cognosViewer.envParams){
if(_95a.indexOf("frag-")==0||_95a=="cv.actionState"||_95a=="ui.primaryAction"||_95a=="dashboard"||_95a=="ui.action"||_95a=="cv.responseFormat"||_95a=="b_action"){
continue;
}
_959.addFormField(_95a,this.m_cognosViewer.envParams[_95a]);
}
};
CCognosViewerSaveReport.prototype.getCognosViewer=function(){
return this.m_cognosViewer;
};
CCognosViewerSaveReport.prototype.getViewerWidget=function(){
return this.getCognosViewer().getViewerWidget();
};
CCognosViewerSaveReport.prototype.dispatchRequest=function(){
var _95b=this.m_cognosViewer;
var _95c=this.getViewerWidget();
var _95d={"complete":{"object":_95c,"method":_95c.handleWidgetSaveDone},"fault":{"object":this,"method":this.onFault}};
var _95e=new AsynchJSONDispatcherEntry(_95b);
_95e.setCallbacks(_95d);
this.populateRequestParams(_95e);
_95b.dispatchRequest(_95e);
};
CCognosViewerSaveReport.prototype.onFault=function(_95f,arg1){
var _961=this.m_cognosViewer;
var _962=this.getViewerWidget();
var _963=_95f.getSoapFault();
var _964=XMLHelper_FindChildByTagName(_963,"Fault",true);
if(this.ifIsEmptySelectionFault(_964)){
this.handleEmptySelectionFault();
return;
}
var _965=_963.createElement("allowRetry");
_965.appendChild(_963.createTextNode("false"));
_964.appendChild(_965);
var _966=XMLBuilderSerializeNode(_964);
_961.setSoapFault(_966);
_962.handleFault();
var _967={"status":false};
_962.iContext.iEvents.fireEvent("com.ibm.bux.widget.save.done",null,_967);
};
CCognosViewerSaveReport.prototype.ifIsEmptySelectionFault=function(_968){
if(_968){
var _969=XMLHelper_FindChildByTagName(_968,"errorCode",true);
if(_969){
var _96a=XMLHelper_GetText(_969,false);
return (_96a==="cmEmptySelection");
}
}
return false;
};
CCognosViewerSaveReport.prototype.handleEmptySelectionFault=function(){
delete (this.m_cognosViewer.envParams["savedReportName"]);
this.m_doSaveAsOnFault=true;
this.dispatchRequest();
};
SAVE_REPORT_TYPE={reportView:"application/x-ibmcognos_v5reportview+xml",report:"application/x-ibmcognos_v5report+xml"};
function ViewerIWidgetSave(_96b,_96c){
this.m_ViewerWidget=_96b;
this.m_payload=_96c;
this._setIsSavedDashboard();
};
ViewerIWidgetSave.prototype.setDoCWCopy=function(_96d){
this._doCWCopy=_96d;
};
ViewerIWidgetSave.prototype._getSavedReport=function(){
var _96e=this._getWidgetAttributeValue("savedReportPath");
if(!_96e){
_96e=this._getWidgetAttributeValue("savedReportName");
}
return _96e;
};
ViewerIWidgetSave.prototype._setIsSavedDashboard=function(){
var _96f=this._getSavedReport();
this._bIsSavedDashboard=(_96f!==null&&_96f!==undefined&&_96f.length!==0);
};
ViewerIWidgetSave.prototype._isSavedDashboard=function(){
return this._bIsSavedDashboard;
};
ViewerIWidgetSave.prototype.canSave=function(_970){
return (this._doSaveNewOrSaveAs()||_970&&_970.indexOf("write")!==-1||this.m_ViewerWidget.isDropped());
};
ViewerIWidgetSave.prototype.isSavedOutput=function(){
var _971=this.m_cognosViewer.envParams["ui.action"];
return (typeof _971!=="undefined"&&_971==="view");
};
ViewerIWidgetSave.prototype._doSaveNewOrSaveAs=function(){
var _972=(this.m_payload.operation==="save"&&!this._isSavedDashboard())||(this.m_payload.operation==="saveAs");
return _972;
};
ViewerIWidgetSave.prototype._getWidgetAttributeValue=function(_973){
return this._getViewerWidget().getAttributeValue(_973);
};
ViewerIWidgetSave.prototype._getEnvParam=function(_974){
return this._getViewerWidget().getEnvParam(_974);
};
ViewerIWidgetSave.prototype._getViewerWidget=function(){
return this.m_ViewerWidget;
};
ViewerIWidgetSave.prototype._isLimitedInteractiveMode=function(){
return this._getViewerWidget().isLimitedInteractiveMode();
};
ViewerIWidgetSave.prototype._getDefaultReportName=function(){
return this._getEnvParam("ui.name");
};
ViewerIWidgetSave.prototype._getReportSpec=function(){
return this._getEnvParam("ui.spec");
};
ViewerIWidgetSave.prototype._getCurrentReportIsReportView=function(){
return (this._getEnvParam("ui.objectClass")==="reportView");
};
ViewerIWidgetSave.prototype.doGetSavePropertiesFromServer=function(){
this.delayedLoadingContext=this._getViewerWidget().getLoadManager().getDelayedLoadingContext();
if(this._getEnvParam("delayedLoadingExecutionParams")){
return true;
}
return (this.delayedLoadingContext&&this.delayedLoadingContext.getPromptValues()!==null);
};
ViewerIWidgetSave.prototype.getSavePropertiesFromServer=function(){
var oCV=this._getViewerWidget().getViewerObject();
var _976=new JSONDispatcherEntry(oCV);
var _977=this._getViewerWidget();
_976.setCallbacks({customArguments:[this.m_payload],complete:{"object":_977,"method":_977.handleGetSavePropertiesFromServerResponse}});
this._addRequestOptions(_976);
_976.sendRequest();
};
ViewerIWidgetSave.prototype._addRequestOptions=function(_978){
_978.addFormField("ui.action","noOp");
_978.addFormField("bux","true");
_978.addFormField("cv.responseFormat","IWidgetSavePropertiesJSON");
if(this._getEnvParam("delayedLoadingExecutionParams")){
_978.addFormField("delayedLoadingExecutionParams",this._getEnvParam("delayedLoadingExecutionParams"));
}else{
_978.addFormField("ui.conversation",this._getViewerWidget().getViewerObject().getConversation());
}
var _979=this.delayedLoadingContext.getPromptValues();
for(var _97a in _979){
_978.addFormField(_97a,_979[_97a]);
}
};
ViewerIWidgetSave.prototype._getExecutionParameters=function(){
return this._getViewerWidget().getViewerObject().getExecutionParameters();
};
ViewerIWidgetSave.prototype._setExecutionParameters=function(body){
var _97c=this._getExecutionParameters();
var doc=XMLBuilderLoadXMLFromString(_97c);
if(!doc.documentElement){
return;
}
var root=XMLBuilderCreateXMLDocument("root");
var _97f=root.createElement("parameters");
XMLBuilderSetAttributeNodeNS(_97f,"xmlns:SOAP-ENC","http://schemas.xmlsoap.org/soap/encoding/");
XMLBuilderSetAttributeNodeNS(_97f,"xsi:type","bus:parameterValueArrayProp","http://www.w3.org/2001/XMLSchema-instance");
XMLBuilderSetAttributeNodeNS(_97f,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
XMLBuilderSetAttributeNodeNS(_97f,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
root.documentElement.appendChild(_97f);
var _980=XMLHelper_FindChildrenByTagName(doc.documentElement,"item",false);
var _981=root.createElement("value");
XMLBuilderSetAttributeNodeNS(_981,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_97f.appendChild(_981);
var _982=_980.length;
for(var i=0;i<_980.length;i++){
var _984=XMLHelper_FindChildByTagName(_980[i],"name",false);
if(_984&&_984.childNodes[0].nodeValue.indexOf("credential:")!==-1){
_982--;
continue;
}
_981.appendChild(_980[i]);
}
XMLBuilderSetAttributeNodeNS(_981,"SOAP-ENC:arrayType","bus:parameterValue["+_982+"]","http://schemas.xmlsoap.org/soap/encoding/");
body.parameters=XMLBuilderSerializeNode(_97f);
};
ViewerIWidgetSave.prototype._setSourceObject=function(_985,_986){
var _987=(_986===true)?this._getEnvParam("ui.object"):this._getEnvParam("originalReport");
if(_987){
_985.sourceObject=_987;
}
};
ViewerIWidgetSave.prototype._setReportTypeToReportView=function(_988){
_988.type=SAVE_REPORT_TYPE.reportView;
};
ViewerIWidgetSave.prototype._setReportTypeToReport=function(_989){
_989.type=SAVE_REPORT_TYPE.report;
};
ViewerIWidgetSave.prototype._setReportSpec=function(body){
body.specification=this._getReportSpec();
};
ViewerIWidgetSave.prototype._setResourceForSave=function(_98b){
if(!this._getCurrentReportIsReportView()&&!this._isLimitedInteractiveMode()){
this._setReportSpec(_98b.body);
this._setReportTypeToReport(_98b);
}
return _98b;
};
ViewerIWidgetSave.prototype._setResourceForCopy=function(_98c){
this._setReportSpec(_98c.body);
this._setReportTypeToReport(_98c);
return _98c;
};
ViewerIWidgetSave.prototype._setResourceForSaveNew=function(_98d){
var _98e=false;
if(this._getEnvParam("originalReport")==null){
_98e=true;
}
this._setSourceObject(_98d,_98e);
if(this._isLimitedInteractiveMode()){
this._setReportTypeToReportView(_98d);
}else{
this._setReportTypeToReport(_98d);
this._setReportSpec(_98d.body);
}
return _98d;
};
ViewerIWidgetSave.prototype._setResourceForSaveAs=function(_98f){
if(this._getCurrentReportIsReportView()){
this._setReportTypeToReportView(_98f);
this._setSourceObject(_98f);
}else{
if(this._isLimitedInteractiveMode()){
this._setReportTypeToReportView(_98f);
this._setSourceObject(_98f,true);
}else{
this._setReportTypeToReport(_98f);
this._setSourceObject(_98f,true);
this._setReportSpec(_98f.body);
}
}
return _98f;
};
ViewerIWidgetSave.prototype._getResource=function(){
var _990={};
if(this._doCWCopy===true){
_990.copyOnCreate=true;
}
_990.body={};
var _991=(this.m_payload.operation==="save");
var _992=(this.m_payload.operation==="copy");
if(_992){
this._setResourceForCopy(_990);
}else{
if(_991){
this._setResourceForSave(_990);
}else{
if(this._isSavedDashboard()){
this._setResourceForSaveAs(_990);
}else{
this._setResourceForSaveNew(_990);
}
}
}
this._setExecutionParameters(_990.body);
if(!_992){
_990.itemSetUpdate={name:"savedReportPath",type:"searchPath"};
}
return _990;
};
ViewerIWidgetSave.prototype._getWidgetId=function(){
return this._getViewerWidget().getWidgetId();
};
ViewerIWidgetSave.prototype.getPayload=function(){
var _993={};
_993.resource=new Array();
_993.widgetId=this._getWidgetId();
_993.resource.push(this._getResource());
return _993;
};
dojo.provide("viewer.dialogs.SelectBusinessProcess");
dojo.require("bux.dialogs.BaseCustomContentDialog");
dojo.require("bux.layout.TableContainer");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Button");
dojo.declare("viewer.dialogs.SelectBusinessProcess",bux.dialogs.BaseCustomContentDialog,{sTitle:null,sLabel:null,okHandler:null,cancelHanlder:null,buildRendering:function(){
this.aButtonsSpec=[{label:RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_START_BUTTON_LABEL,action:dojo.hitch(this,this.onOK),type:"button"},{label:RV_RES.CANCEL,action:dojo.hitch(this,this.onCancel),type:"button"}];
this.inherited(arguments);
if(!this.BPMProcessesInfo||this.BPMProcessesInfo.length===0){
this._buxBaseDialog._aButtonObjects[0].set("disabled",true);
}
},startup:function(){
this.updateTitle(this.sTitle);
this.inherited(arguments);
this.set("role","group");
var _994=new bux.layout.TableContainer({classname:"bux-InformationDialog buxFilterConfigDiscreteValuesTable"},this.contentContainer);
var row=new bux.layout.TableContainerRow({classname:"bux-dialog-label",parentContainer:_994});
var cell=new bux.layout.TableContainerCell({parentContainer:row});
this.generateSelectProcessSection(cell);
cell.addContent(document.createElement("br"));
this.generateViewInputValuesSection(cell);
cell.addContent(document.createElement("br"));
},addDivContainer:function(_997,sID,_999){
var div=document.createElement("div");
dojo.attr(div,{"class":"buxFilterConfigFilterValue","aria-labelledby":sID,role:_999});
_997.addContent(div);
return div;
},generateSelectProcessSection:function(_99b){
var _99c=this.id+"_selectProcess_a11ylabel";
this.addTableDescription(_99b,this.sLabel,_99c);
var div=this.addDivContainer(_99b,_99c,"radiogroup");
var _99e=new bux.layout.TableContainer({classname:"buxFilterConfigFilterValueTable"});
dojo.style(_99e.domNode,"width","325px");
this.addSelectProcessTableHeader(_99e);
if(!this.BPMProcessesInfo||this.BPMProcessesInfo.length===0){
this.addEmptySelectProcessTableContent(_99e);
}else{
this.addSelectProcessTableContent(_99e);
}
div.appendChild(_99e.domNode);
},addSelectProcessTableHeader:function(_99f){
var _9a0=new bux.layout.TableContainerRow({classname:"buxFilterConfigFilterValueTableHeaderRow",parentContainer:_99f});
var _9a1=new bux.layout.TableContainerCell({classname:"buxListHeader buxFilterConfigFilterValueTableHeaderLeft",width:"25px",parentContainer:_9a0});
var _9a2=new bux.layout.TableContainerCell({classname:"buxListHeader buxFilterConfigFilterValueTableHeader",width:"300px",parentContainer:_9a0});
_9a2.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_TABLE_HEADER));
},addEmptySelectProcessTableContent:function(_9a3){
var _9a4=this.id+"_processItemsRow_label_none";
var _9a5=new bux.layout.TableContainerRow({parentContainer:_9a3});
dojo.attr(_9a5.domNode,{id:this.id+"_processItemsRow_none","aria-labelledby":_9a4,tabindex:0});
var _9a6=this.createA11yLabel(RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_NO_PROCESS_A11Y,_9a4,true);
_9a5.domNode.appendChild(_9a6);
var cell=new bux.layout.TableContainerCell({parentContainer:_9a5});
cell.set("colspan",2);
cell.addContent(this.createLabelElement(RV_RES.IDS_JS_BUSINESS_PROCESS_SELECT_DIALOG_NO_PROCESS));
},addSelectProcessTableContent:function(_9a8){
for(var i=0;i<this.BPMProcessesInfo.length;i++){
var _9aa=new dijit.form.RadioButton({checked:((i===0)?true:false),name:this.id+"_processItem",disabled:false});
var _9ab=html_encode(this.BPMProcessesInfo[i].sCaption);
var _9ac=this.BPMProcessesInfo[i].sBPD_ID;
var _9ad=this.BPMProcessesInfo[i].sProcessAppID;
_9aa.onChange=dojo.hitch(this,"getProcessItemRadioChangeFunction",_9ac,_9ad,_9ab,_9aa);
var _9ae=new bux.layout.TableContainerRow({parentContainer:_9a8,classname:((i===0)?"buxFilterConfigFilterValueRowSelected":"")});
_9ae.set("id",this.id+"_processItemsRow"+_9aa.id);
var _9af=new bux.layout.TableContainerCell({align:"center",parentContainer:_9ae});
_9af.addContent(_9aa.domNode);
_9af.set("id",this.id+"_processItemsCell"+i);
var _9b0=new bux.layout.TableContainerCell({classname:"buxFilterConfigFilterItemName text_overflow_ellipsis_ie",width:"300px",valign:"top",parentContainer:_9ae});
var _9b1=document.createElement("label");
_9b1.appendChild(document.createTextNode(_9ab));
_9b1.setAttribute("for",_9aa.id);
_9b0.addContent(_9b1);
}
this.setDefaultProcessSelectedInfo();
},setDefaultProcessSelectedInfo:function(){
this._selectedBPD_ID=this.BPMProcessesInfo[0].sBPD_ID;
this._selectedProcessAppId=this.BPMProcessesInfo[0].sProcessAppID;
this._selectedProcessName=html_encode(this.BPMProcessesInfo[0].sCaption);
},getProcessItemRadioChangeFunction:function(_9b2,_9b3,_9b4,_9b5){
if(_9b5.get("value")==="on"){
dojo.byId(this.id+"_processItemsRow"+_9b5.id).className="buxFilterConfigFilterValueRowSelected";
this._selectedBPD_ID=_9b2;
this._selectedProcessAppId=_9b3;
this._selectedProcessName=_9b4;
}else{
dojo.byId(this.id+"_processItemsRow"+_9b5.id).className="";
}
},generateViewInputValuesSection:function(_9b6){
var _9b7=this.id+"_viewInputValues_a11ylabel";
this.addTableDescription(_9b6,RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_DESCRIPTION,_9b7);
this.addViewInputValuesTable(_9b6,_9b7);
},addViewInputValuesTable:function(_9b8,_9b9){
_9b8.addContent(this.generateViewInputValuesTable(_9b9));
},addTableDescription:function(_9ba,_9bb,sID){
var div=document.createElement("div");
dojo.attr(div,{"class":"bux-label",id:sID});
div.appendChild(document.createTextNode(html_encode(_9bb)));
_9ba.addContent(div);
},generateViewInputValuesTable:function(_9be){
var _9bf=this.bpAction.getInputParameter();
var div=document.createElement("div");
dojo.attr(div,{"class":"buxFilterConfigFilterValue",style:"height:80px",role:"group","aria-labelledby":_9be});
var _9c1=new bux.layout.TableContainer({classname:"buxFilterConfigFilterValueTable"});
dojo.style(_9c1.domNode,"width","335px");
_9c1.set("role","list");
div.appendChild(_9c1.domNode);
var _9c2=new bux.layout.TableContainerRow({classname:"buxFilterConfigFilterValueTableHeaderRow",parentContainer:_9c1});
var _9c3=new bux.layout.TableContainerCell({classname:"buxListHeader buxFilterConfigFilterValueTableHeaderLeft",width:"40%",parentContainer:_9c2});
_9c3.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DATA_ITEM));
var _9c4=new bux.layout.TableContainerCell({classname:"buxListHeader buxFilterConfigFilterValueTableHeader",width:"60%",parentContainer:_9c2});
_9c4.addContent(document.createTextNode(RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DISPLAY_VALUE_HEADER));
var _9c5=_9bf.cognosParameter;
var _9c6=false;
for(var i=0;i<_9c5.length;i++){
var _9c8=0;
var _9c9=this.getWidgetContextValues(_9c5[i]);
for(var _9ca in _9c9){
var row=new bux.layout.TableContainerRow({parentContainer:_9c1});
var _9cc={id:this.id+"_inputValueRow_"+_9c8,role:"listitem"};
if(!_9c6){
_9cc.tabindex=0;
_9c6=true;
}
dojo.attr(row.domNode,_9cc);
this.addRowAccessibility(row,_9c8,_9ca,_9c9[_9ca]);
var _9cd=new bux.layout.TableContainerCell({classname:"buxFilterConfigFilterItemName text_overflow_ellipsis_ie",width:"40%",valign:"top",parentContainer:row});
_9cd.set("id",this.id+"_dataItem_"+i);
_9cd.addContent(this.createLabelElement(_9ca));
var _9ce=new bux.layout.TableContainerCell({classname:"buxFilterConfigFilterItemName text_overflow_ellipsis_ie",width:"60%",valign:"top",parentContainer:row});
_9ce.set("id",this.id+"_displayValue_"+i);
_9ce.addContent(this.createLabelElement(_9c9[_9ca][0]));
_9c8++;
}
}
return div;
},getWidgetContextValues:function(_9cf){
return values=_9cf["com.ibm.widget.context"].values;
},addRowAccessibility:function(row,_9d1,_9d2,_9d3){
var _9d4=this.id+"_inputValueRow_label_"+_9d1;
dojo.attr(row.domNode,{"aria-labelledby":_9d4});
var _9d5=RV_RES.IDS_JS_BUSINESS_PROCESS_VIEW_INPUT_VALUES_TABLE_COLUMN_HEADER_DATA_ITEM+" "+_9d2+" "+RV_RES.IDS_JS_BUSINESS_PROCESS_START_PROCESS_A11Y_DESC_VALUE+" "+_9d3;
row.domNode.appendChild(this.createA11yLabel(_9d5,_9d4,true));
dojo.connect(row.domNode,"onkeypress",dojo.hitch(this,this._rowOnKeyPress));
},_rowOnKeyPress:function(evt){
switch(evt.keyCode){
case dojo.keys.DOWN_ARROW:
this.changeNodeFocus(evt,evt.target,evt.target.nextSibling);
break;
case dojo.keys.UP_ARROW:
this.changeNodeFocus(evt,evt.target,evt.target.previousSibling);
break;
}
},changeNodeFocus:function(evt,_9d8,_9d9){
if(!_9d9||(_9d9&&_9d9.id&&_9d9.id.indexOf("_inputValueRow_")===-1)){
return;
}
dojo.attr(_9d8,{tabindex:-1});
dojo.attr(_9d9,{tabindex:0});
dijit.focus(_9d9);
if(dojo.isIE||dojo.isTrident){
evt.keyCode=0;
}
dojo.stopEvent(evt);
},createA11yLabel:function(_9da,_9db,_9dc){
var _9dd=this.createLabelElement(_9da);
var _9de={id:_9db};
if(_9dc){
_9de.style="visibility:hidden;display:none";
}
dojo.attr(_9dd,_9de);
return _9dd;
},createLabelElement:function(_9df){
var _9e0=document.createElement("span");
_9e0.appendChild(document.createTextNode(html_encode(_9df)));
return _9e0;
},onOK:function(){
this.hide();
this.bpAction.startProcess(this._selectedBPD_ID,this._selectedProcessAppId,this._selectedProcessName);
}});

