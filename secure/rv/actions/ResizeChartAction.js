/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2016
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function ResizeChartAction()
{
	this.m_width = 0;
	this.m_height = 0;
	this.m_sAction = "ChangeDataContainerSize";
	this.m_bRunReport = true;
	this.m_oChart = null;
}

ResizeChartAction.prototype = new ModifyReportAction();
ResizeChartAction.prototype.isUndoable = function() { return false; };
ResizeChartAction.superclass = ModifyReportAction.prototype;
ResizeChartAction.prototype.runReport = function() { return this.m_bRunReport; };
ResizeChartAction.prototype.canBeQueued = function() { return true; };
ResizeChartAction.prototype.reuseQuery = function() { return true; };
ResizeChartAction.PADDING = {
	getWidth: function() { return 2;},
	getHeight: function() {return 2;}
};

ResizeChartAction.prototype.getActionKey = function() {
	return "ResizeChartAction";
};

ResizeChartAction.prototype.setRequestParms = function(requestParms)
{
	if(requestParms && requestParms.resize)	{
		this.m_width = parseInt(requestParms.resize.w, 10) - ResizeChartAction.PADDING.getWidth();
		this.m_height = parseInt(requestParms.resize.h, 10) - ResizeChartAction.PADDING.getHeight();
	}
};

ResizeChartAction.prototype.execute = function() {

	if (this.m_oCV.m_readyToRespondToResizeEvent !== true) {
		return; //not resize on initial loading.
	}

	if (this.m_oCV.getPinFreezeManager()) {
		//Resize a container with frozen headings.
		this.m_oCV.getPinFreezeManager().resize(this.m_width, this.m_height);
	}
	
	if (this.isActionApplicable()) {
		var charts = this.getLayoutComponents();

		if(charts && charts.length > 0) {
			//chart is displayed.
			for (var i = 0; i < charts.length; ++i) {
				if (charts[i].nodeName === "IMG" || charts[0].getAttribute("flashChart") !== null) {
					this.m_oChart = charts[i];
					break;
				}
			}

			if (this.m_oChart && this.isNewSizeDifferent()) {
				if (charts[0].getAttribute("flashChart") !== null) {
					this.m_bRunReport = false;
					this.resizeFlashChart();
				} else {
					this.m_bRunReport = true;
					this.resizeChart();
				}
			}
		}
	}
};

ResizeChartAction.prototype.isActionApplicable = function() {
	var rapReportInfo = this.m_oCV.getRAPReportInfo();
	if (rapReportInfo && rapReportInfo.isSingleContainer()) {
		return true;
	}
	return false;
};

ResizeChartAction.prototype.resizeFlashChart = function() {
	var size = this.getNewChartSize();
	this.m_oChart.setAttribute("width", size.w + "px");
	this.m_oChart.setAttribute("height", size.h + "px");
	this.resizeChart(); //update report spec.
};

ResizeChartAction.prototype.resizeChart = function()
{
	ResizeChartAction.superclass.execute.call(this);
};


ResizeChartAction.prototype.addActionContextAdditionalParms = function() {
	var returnValue = "";
	var size = this.getNewChartSize();
	returnValue += "<height>" + size.h + "px</height>";
	returnValue += "<width>" + size.w + "px</width>";

	return returnValue;
};

ResizeChartAction.prototype.isNewSizeDifferent = function() {
	var bFlashChart = (this.m_oChart.getAttribute("flashChart") !== null);
	var chartWidth = bFlashChart ? this.m_oChart.getAttribute("width") :  this.m_oChart.style.width;
	var chartHeight = bFlashChart ? this.m_oChart.getAttribute("height") :  this.m_oChart.style.height;
	if (!chartWidth || chartWidth == "") {
		chartWidth = this.m_oChart.width;
		chartHeight = this.m_oChart.height; 
	}
	return  parseInt(chartWidth, 10) != this.m_width || parseInt(chartHeight, 10) != this.m_height; 
};

ResizeChartAction.prototype.getNewChartSize = function () {

    var myChart = this.m_oChart

    var marginLeft = 0;
    var marginRight = 0;
    var marginTop = 0;
    var marginBottom = 0;

    var borderLeft = 0;
    var borderRight = 0;
    var borderTop = 0;
    var borderBottom = 0;

    var paddingLeft = 0;
    var paddingRight = 0;
    var paddingTop = 0;
    var paddingBottom = 0;

    require(["dojo/dom-style"], function (domStyle) {

        marginLeft = domStyle.get(myChart, "marginLeft");
        marginRight = domStyle.get(myChart, "marginRight");
        marginTop = domStyle.get(myChart, "marginTop");
        marginBottom = domStyle.get(myChart, "marginBottom");

        borderLeft = domStyle.get(myChart, "borderLeftWidth");
        borderRight = domStyle.get(myChart, "borderRightWidth");
        borderTop = domStyle.get(myChart, "borderTopWidth");
        borderBottom = domStyle.get(myChart, "borderBottomWidth");

        paddingLeft = domStyle.get(myChart, "paddingLeft");
        paddingRight = domStyle.get(myChart, "paddingRight");
        paddingTop = domStyle.get(myChart, "paddingTop");
        paddingBottom = domStyle.get(myChart, "paddingBottom");
    });

    this.m_width -= borderLeft + borderRight + marginLeft + marginRight + paddingLeft + paddingRight;
    this.m_height -= borderTop + borderBottom + marginTop + marginBottom + paddingTop + paddingBottom;
	if (this.m_keepRatio) {
		var ratio = parseInt(this.m_oChart.style.width, 10)/parseInt(this.m_oChart.style.height, 10);
		var newWidth = ratio * this.m_height;
		if (newWidth > this.m_width) {
			this.m_height = this.m_width / ratio;
		}
		var newHeight = this.m_width /ratio;
		if (newHeight > this.m_height) {
			this.m_width = this.m_height * ratio;
		}
	}

	return {w:this.m_width, h:this.m_height};
};

