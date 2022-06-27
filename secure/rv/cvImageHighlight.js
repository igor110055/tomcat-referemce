/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2011, 2015
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

/**
* Class responsibility: Add or remove Highlight image map areas
*/


function CImageMapHighlight(map, webContentRoot)
{
	this.m_webContentRoot = webContentRoot;
	this.createHighlight = CImageMapHighlight.prototype.createHighlightElement;
	this.initialize(map);
}

CImageMapHighlight.prototype.initialize = function(map) {
	this.m_map = map;
	this.m_areas = {};
	this.m_areaNodes = {};
	this.m_visibleAreas = [];
	this.initImageBlank();
	this.m_divCanvas = null;
	this.m_creationNode = null;
	this._setMapAreasId();
	this.m_sDefaultFillColour = "#F7E1BC";
	this.m_sDefaultStrokeColour = "#F0A630";
	this.m_sFillColour = this.m_sDefaultFillColour;
	this.m_sStrokeColour = this.m_sDefaultStrokeColour;
};

CImageMapHighlight.prototype.setFillColour = function( sFillColour ){

	this.m_sFillColour = ( !sFillColour ) ? this.m_sDefaultFillColour : sFillColour;
};

CImageMapHighlight.prototype.getFillColour = function(){
	return this.m_sFillColour;
};

CImageMapHighlight.prototype.setStrokeColour = function( sStrokeColour ){
	
	this.m_sStrokeColour = (!sStrokeColour ) ? this.m_sDefaultStrokeColour : sStrokeColour ;
};

CImageMapHighlight.prototype.getStrokeColour = function(){
	return this.m_sStrokeColour;
};

CImageMapHighlight.prototype.resetColours = function(){
	this.m_sStrokeColour = this.m_sDefaultStrokeColour;
	this.m_sFillColour = this.m_sDefaultFillColour;
};

CImageMapHighlight.prototype.initImageBlank = function() {
	var img = this._getChartImageFromMap();
	// this test is to avoid a javascript error, but it won't work
	if (img === null) {
		return;
	}
	this.m_img = img;
	this.m_sImageHeight = img.offsetHeight + "px";
	this.m_sImageWidth = img.offsetWidth + "px";
	
	this.m_sUseMap = img.getAttribute( "usemap" );
	this.m_imgLid = img.getAttribute( "lid" );

	this.m_imgBlank = img.ownerDocument.createElement( "IMG" );
	this.m_imgBlank.src = this.m_webContentRoot + "/rv/images/blank.gif";
	this.m_imgBlank.style.height = this.m_sImageHeight;
	this.m_imgBlank.style.width = this.m_sImageWidth;
	this.m_imgBlank.style.position = "absolute";
	this.m_imgBlank.border = "0";
	this.m_imgBlank.useMap = this.m_sUseMap;
	this.m_imgBlank.setAttribute("lid", this.m_imgLid);
	this.m_imgBlank.setAttribute("rsvpchart", img.getAttribute( "rsvpchart"));
	this.m_imgBlank.alt = img.alt;
	if ( this.m_bShowPointer )
	{
		this.m_imgBlank.style.cursor = "auto";
	}
	this.m_imgBlank.v_bIsBlankImageMapImg = true;
	img.parentNode.insertBefore( this.m_imgBlank, img );
	
	this.f_copyStyle( img, this.m_imgBlank );
	this.m_imgBlank.style.borderColor = "transparent";
};

/**
 * Look in the DOM for the chart container image
 * <map/> [<div/>] <div><span></div> [<svg|div/> <img-blank/>] <img-rsvpchart=true>
 */
CImageMapHighlight.prototype._getChartImageFromMap = function() {
	var map = this.m_map;
	var result = null;
	
	// 1. find the span which is the chart container (it should be in the next
	var chartContainerSpan = null;
	var mapNextSibling = map.nextSibling;
	while (mapNextSibling) {
		if(mapNextSibling.tagName == "DIV") {
			var nDivChild = mapNextSibling.firstChild;
			while (nDivChild) {
			 
				if ((nDivChild.tagName == "SPAN" || nDivChild.tagName == "DIV") && nDivChild.getAttribute("chartcontainer") == "true") {
					chartContainerSpan = nDivChild;
					break;
				}
				nDivChild = nDivChild.nextSibling;
			}	
		}
		if(chartContainerSpan) {
			break;
		}
		mapNextSibling = mapNextSibling.nextSibling;
	}
	
	// 2. Find the image within the chart container Span
	if (chartContainerSpan) {
		var chartContainerChildren = chartContainerSpan.children;
		var chartContainerChildrenCount = chartContainerChildren.length;
		for (var i=0; i<chartContainerChildrenCount; i++) {
			var el = chartContainerChildren[i];
			if (el.tagName == "IMG" && el.getAttribute("rsvpchart") == "true" && el.getAttribute("usemap") == "#" + map.name) {
				result = el;
				break;
			}
		}
	}
	return result;
};

CImageMapHighlight.prototype._AREA_ID = "aid";

CImageMapHighlight.prototype._setMapAreasId = function() {
	var mapLid_ = this.m_map.getAttribute( "lid" ) + "_";
	var areas = this.m_map.childNodes;
	var areaCount = areas.length;
	for (var i=0; i<areaCount; i++ ) {
		var a = areas[i];
		var id = mapLid_ + i;
		a.setAttribute(this._AREA_ID,id);
		this.m_areaNodes[id]=a;
	}
};

CImageMapHighlight.prototype.isAreaInitialized = function(area) {
	return (area.getAttribute(this._AREA_ID) === null? false : true);
};

CImageMapHighlight.prototype.getAreaId = function(area) {
	var areaId = area.getAttribute(this._AREA_ID);
	if (areaId === null) {
		// re-initialize
		this.initialize(area.parentNode);
		areaId = area.getAttribute(this._AREA_ID);
	}
	return areaId + this.getFillColour();
};

CImageMapHighlight.prototype.getAreaFromId = function(areaid) {
	return this.m_areaNodes[areaid];
};

CImageMapHighlight.prototype.highlightArea = function(area, append) {
	var areaId = this.getAreaId(area); //

	// hide all but the one to highlight if not append
	if (!append) {
		var visibleAreas = this.m_visibleAreas;
		var visiblesAreaCount =  visibleAreas.length;
		for (var i = 0; i < visiblesAreaCount; i++) {
			if (areaId != visibleAreas[i]) {
				this.hideAreaById(visibleAreas[i]);
			}
		}
		this.m_visibleAreas = [];
	}
	this._highlightArea(area);
};

CImageMapHighlight.prototype.highlightAreas = function(areas, append) {
	if (!append) {
		this.hideAllAreas();
	}
	this._highlightAreas(areas);
};

/**
 * highlight multiple areas
 */
CImageMapHighlight.prototype._highlightAreas = function(areas) {
	var areasCount =  areas.length;
	for (var i = 0; i < areasCount; i++) {
		this._highlightArea(areas[i]);
	}
};

CImageMapHighlight.prototype._highlightArea = function(area) {
	var areaId = this.getAreaId(area);
	if (!this.highlightAreaExists(areaId)) {
		var highLight = this.createHighlight(area);
		if (highLight) {
			this.m_areas[areaId] = highLight;
			highLight.style.visibility = "visible";
			area.setAttribute("highlighted", "true");
		}
	} else {
		// if not visible make it so
		if (this.m_areas[areaId].style.visibility == "hidden") {
			this.m_areas[areaId].style.visibility = "visible";
			area.setAttribute("highlighted", "true");
		}
	}
	this.m_visibleAreas.push(areaId);
};

CImageMapHighlight.prototype.highlightAreaExists = function(areaId){
	return this.m_areas[areaId] ? true : false;
};

CImageMapHighlight.prototype.hideAreaById = function(areaId) {
	if ( this.m_areas[areaId] && this.m_areas[areaId].style.visibility ) {
		this.m_areas[areaId].style.visibility = "hidden";
	}
};

CImageMapHighlight.prototype.hideAreas = function(areas) {
	var areasCount =  areas.length;
	for (var i = 0; i < areasCount; i++) {
		this.hideArea(areas[i]);
	}
};

CImageMapHighlight.prototype.hideArea = function(area) {
	this.hideAreaById(this.getAreaId(area));
	area.setAttribute("highlighted", "false");
};

CImageMapHighlight.prototype.hideAllAreas = function() {
	var visibleAreas = this.m_visibleAreas;
	var visiblesAreaCount =  visibleAreas.length;
	for (var i = 0; i < visiblesAreaCount; i++) {
		this.hideAreaById(visibleAreas[i]);
		var areaNode = this.getAreaFromId(visibleAreas[i]);
		if(areaNode) {
			areaNode.setAttribute("highlighted", "false");
		}
	}
	this.m_visibleAreas = [];
};

CImageMapHighlight.prototype.isAreaHighlighted = function(area) {
	var areaId = this.getAreaId(area);
	return this.m_areas[areaId] && this.m_areas[areaId].style.visibility == "visible";
};

CImageMapHighlight.prototype.removeAreaHighlights = function(areas) {
	
};

CImageMapHighlight.prototype.removeAllAreaHighlights = function() {
	
};

CImageMapHighlight.prototype.destroy = function(area) {
	this.removeAllAreaHighlights();
};

CImageMapHighlight.prototype.createHighlightElement = function( v_elArea, v_bIsHover )
{
	var doc = v_elArea.ownerDocument;
	if ( !this.m_divCanvas )
	{
		for ( var v_elAncestor = this.m_img.parentNode; v_elAncestor; v_elAncestor = v_elAncestor.parentNode )
		{
			if ( ( v_elAncestor.nodeName == "DIV" ) && ( v_elAncestor.getAttribute( "sSpecName" ) == "block" ) )
			{
				var v_oStyle = doc.defaultView.getComputedStyle( v_elAncestor , null );
				var v_sOverflow = v_oStyle.overflow;
				if ( ( v_sOverflow == "auto" ) || ( v_sOverflow == "scroll" ) && ( v_oStyle.position != "relative" ) )
				{
					v_elAncestor.style.position = "relative";
				}
			}
		} 

		this.m_divCanvas = doc.createElementNS( "http://www.w3.org/2000/svg", "svg" );
		this.m_divCanvas.style.height = this.m_sImageHeight;
		this.m_divCanvas.style.width = this.m_sImageWidth;
		this.m_divCanvas.style.position = "absolute";
		//this.m_divCanvas.style.border = "1px solid green";
		//this.m_divCanvas.style.backgroundColor = "red";
		this.m_img.parentNode.insertBefore( this.m_divCanvas, this.m_imgBlank );
		this.f_copyStyle( this.m_imgBlank, this.m_divCanvas );
		this.m_divCanvas.style.display = this.m_bHiddenCanvas ? "none" : "block";
	}

	var v_elPolyline = doc.createElementNS( "http://www.w3.org/2000/svg", "polyline" );
	var v_sCoords = v_elArea.getAttribute( "coords" );
	v_elPolyline.setAttribute( "points", v_elArea.getAttribute( "coords" ) + " " + v_sCoords.substr( 0, v_sCoords.indexOf( ",", v_sCoords.indexOf( "," ) + 1 ) ) );
	v_elPolyline.style.position = "absolute";
	v_elPolyline.style.top = "0px";
	v_elPolyline.style.left = "0px";
	v_elPolyline.style.visibility = "hidden";
	v_elPolyline.setAttribute( "stroke", v_bIsHover ? "#F7CB83"  : this.getStrokeColour() );
	v_elPolyline.setAttribute( "stroke-width", ( v_elArea.getAttribute( "type" ) == "legendLabel" ) ? "1pt" : "1.75pt" );
	v_elPolyline.setAttribute( "fill", v_bIsHover ? "#F7E1BC" : this.getFillColour() );
	v_elPolyline.setAttribute( "fill-opacity", "0.4" );
	this.m_divCanvas.appendChild( v_elPolyline );

	return v_elPolyline;
};


CImageMapHighlight.prototype.f_copyStyle = function( v_elFrom, v_elTo )
{
	var a = ["margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "border", "borderTop", "borderRight", "borderBottom", "borderLeft"];
	var v_iLength = a.length;
	for ( var i = 0; i < v_iLength; i++ )
	{
		var v_sName = a[i];
		var v_sValue = v_elFrom.style[v_sName];
		if ( v_sValue )
		{
			v_elTo.style[v_sName] = v_sValue;
		}
	}
};

