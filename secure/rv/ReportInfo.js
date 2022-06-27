/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
dojo.provide("bux.reportViewer.ReportInfo");
dojo.require("bux.Tooltip");

dojo.declare("bux.reportViewer.ReportInfo", bux.TooltipBase, {

	templateString: "<div class=\"dijitTooltip dijitTooltipLeft\" id=\"dojoTooltip\">\n\t<div class=\"dijitTooltipContainer dijitTooltipContents\" dojoAttachPoint=\"containerNode\" waiRole='alert'></div>\n\t<div class=\"dijitTooltipConnector\"></div>\n</div>\n",

	title: "",
	text: "",
	linkText: null,
	linkScript: null,
	
	constructor: function(args) {
		if(args.focusElement) {
			//We're supposed to get this for free from dojo,
			//but it's not working, so have to do it manually:
			dojo.connect(args.focusElement, "onfocus", this, "_onHover");
			dojo.connect(args.focusElement, "onblur", this, "_onUnHover");
		}
	},

	createMarkup: function() {
		var linkId = this.connectId + "_linkId";		
		var hrefTextLink = dojo.isIE || dojo.isTrident ? '"#"' : '"javascript:void(0);"';
		//IE is over enthusiastic to trigger window.onbeforeunload 
		//event for clicking on link which does not intend to open a new window
		var content = "";
		content +=		"<table role=\"presentation\" class=\"bux-tooltip-table\" cellspacing=\"0\" cellpadding=\"0\">";
		content +=			"<tr>";
		content +=				"<td class=\"bux-tooltip-title\">";
		content +=					html_encode(this.title);
		content +=			"</td>";
		content +=			"</tr>";
		content +=			"<tr>";
		content +=				"<td class=\"bux-tooltip-text\">";
		content +=					html_encode(this.text);
		content +=			"</td>";
		content +=			"</tr>";
		content +=			"<tr>";
		
		

		if( this.linkScript )
		{
			content +=			"<td class=\"bux-tooltip-text\">";
			content +=				'<a role=\"link\" id="' + linkId + '" href=' + hrefTextLink +' onmousedown="' + this.linkScript + '">' + html_encode(this.linkText) + '</a>';
			content +=			"</td>";
		}
		else
		{
			content +=			"<td></td>";
		}

		content +=			"</tr>";
		content +=		"</table>";

		return content;
	}


});