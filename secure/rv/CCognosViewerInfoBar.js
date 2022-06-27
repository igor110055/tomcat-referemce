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

dojo.provide("InfoBarBase");

// InfoBar Base class
dojo.declare("InfoBarBase", null, {
	constructor : function(cognosViewer) {
		this.m_cognosViewer = cognosViewer;
		this.m_parameterValues = new CParameterValues();

		var documentNode = XMLBuilderLoadXMLFromString(this.m_cognosViewer.getExecutionParameters());
		if (documentNode.childNodes.length == 1) {
			this.m_parameterValues.loadWithOptions(documentNode.childNodes[0], /*credentials*/false);
		}
		this.m_parameterStringOperators = new CParameterValueStringOperators(
			RV_RES.IDS_JS_FILTER_BETWEEN,
			RV_RES.IDS_JS_FILTER_NOT_BETWEEN,
			RV_RES.IDS_JS_FILTER_LESS_THAN,
			RV_RES.IDS_JS_FILTER_GREATER_THAN,
			RV_RES.IDS_JS_INFOBAR_AND_TEXT,
			RV_RES.IDS_JS_FILTER_EXCLUDE
		);
		this.c_SliderCheckboxParameterPrefix = "BusinessInsight."; //non-nls string constant
		this.m_containerInfo = null;
		this.m_editableFilters = null;
		this.m_editableSorts = null;
		this.m_editableSliders=null;
		this.m_id = null;
		this.m_layoutIndex = null;
		this.m_timingDetails = null;
	},

	setContainerInfo: function(containerInfo) {
		this.m_containerInfo = containerInfo;
	},

	setTimingDetails: function(timingDetails) {
		this.m_timingDetails = timingDetails;
	},

	setEditableFilters: function(editableFilters) {
		this.m_editableFilters = editableFilters;
	},

	setId: function(theId) {
		this.m_id = theId;
	},

	getId: function() {
		return this.m_id;
	},

	hasPrompts : function() {
		var numberOfParameters = this.m_parameterValues.length();
		for (var index = 0; index < numberOfParameters; ++index) {
			var parameter = this.m_parameterValues.getAt(index);
			if (parameter !== null && parameter.length() > 0 &&
				parameter.name().indexOf(this.c_SliderCheckboxParameterPrefix) !== 0) {
				return true;
			}
		}
		return false;
	},

	addPromptDetails : function(viewOnlyMode) {
		var promptDetails = "";
		var showControl = (viewOnlyMode !== true); // showControl is true unless the viewOnlyMode is passed with value of "true"

		if (this.hasPrompts()) {
			var staticLabelledBy = this.m_id + "instructions " + this.m_id + "_promptString " + this.m_id + "_lockedString ";

			for (var index = 0, numberOfParameters = this.m_parameterValues.length(); index < numberOfParameters; ++index) {
				var labelledBy = staticLabelledBy + this.m_id + index + "_promptDetail";
				var parameter = this.m_parameterValues.getAt(index);
				var numberOfPromptValueItems = parameter.length();

				if (parameter !== null && numberOfPromptValueItems > 0 &&
					parameter.name().indexOf(this.c_SliderCheckboxParameterPrefix) !== 0) {
					promptDetails += "<div class=\"infoBarDetailRow\" aria-labelledby=\"" + labelledBy + "\" role=\"listitem\"" + (!showControl?">":" tabindex=\"-1\">");
					promptDetails += "<table role=\"presentation\"><tr>";
					promptDetails += this.addInfoBarIcon("infobar_filter.gif", true);
					promptDetails += "<td class=\"infoBarDetailsText\" role=\"presentation\" id=\"" + this.m_id + index + "_promptDetail\">";
					promptDetails += "<span class=\"bibi\">";
					promptDetails += html_encode(parameter.name());
					promptDetails += "</span>";
					promptDetails += " : ";
					promptDetails += parameter.toString(this.m_parameterStringOperators);
					promptDetails += "</td>";
					promptDetails += (showControl ? this.addInfoBarIcon("infobar_locked.gif", false) :"");
					promptDetails += "</tr></table></div>";
				}
			}
		}
		return promptDetails;
	},

	getPromptDetailsInJSON : function() {
		var promptList = [];
		if (this.hasPrompts()) {

			for (var index = 0, numberOfParameters = this.m_parameterValues.length(); index < numberOfParameters; ++index) {
				var parameter = this.m_parameterValues.getAt(index);
				var numberOfPromptValueItems = parameter.length();

				if (parameter !== null && numberOfPromptValueItems > 0 &&
					parameter.name().indexOf(this.c_SliderCheckboxParameterPrefix) !== 0) {
						promptList.push(
							{
								'type': 'prompt',
								'label': parameter.name(),
								'description': parameter.toString(this.m_parameterStringOperators)
							}
						);
				}
			}
		}
		return promptList;
	},

	addSliderDetails : function(viewOnlyMode) {
		var sliderDetails = "";
		var showControl = (viewOnlyMode !== true); // showControl is true unless the viewOnlyMode is passed with value of "true"

		if (this.m_containerInfo !== null && this.m_editableSliders) {
			var staticLabelledBy = this.m_id + "instructions " + this.m_id + "_sliderString ";
			var numberOfSliders = this.m_editableSliders.length;
			for (var index=0; index<numberOfSliders; ++index) {
				var labelledBy = staticLabelledBy + this.m_id + index + "_sliderDetail";
				var slider = this.m_editableSliders[index];
				if (slider && slider.name) {
					sliderDetails += "<div class=\"infoBarDetailRow\" type=\"slider\" aria-labelledby=\"" + labelledBy + "\" role=\"listitem\"" + (!showControl ? ">" : " tabindex=\"-1\">");
					sliderDetails += "<table role=\"presentation\"><tr>";

					if (typeof slider.controlType != "undefined" && slider.controlType == "checkbox") {
						sliderDetails += this.addInfoBarIcon("infobar_select.gif", true);
					}
					else {
						sliderDetails += this.addInfoBarIcon("infobar_slider.gif", true);
					}
					sliderDetails += "<td class=\"infoBarDetailsText\" role=\"presentation\" id=\"" + this.m_id + index + "_sliderDetail\">";
					sliderDetails += "<span class=\"bibi\">";
					sliderDetails += (slider.label ? slider.label : slider.name);
					sliderDetails += (slider.attributeName) ? (" - " + slider.attributeName) : "";
					sliderDetails += "</span>";
					sliderDetails += " : ";

					if (typeof slider.values != "undefined") {
						sliderDetails += this.processFilterOperatorItems(slider.values);
					}
					else {
						if (slider.min == slider.max) {
							sliderDetails += slider.min;
						}
						else {
							sliderDetails += this.processFilterOperatorRange(RV_RES.IDS_JS_INFOBAR_BETWEEN_TEXT, slider.min, slider.max);
						}
					}
					sliderDetails += "</td>";
					sliderDetails += (showControl ? this.addRemoveSliderButton(slider.clientId) : "");
					sliderDetails += "</tr></table></div>";
				}
			}
		}
		return sliderDetails;
	},

	getSliderDetailsInJSON : function() {
		var sliderList = [];

		if (this.m_containerInfo !== null && this.m_editableSliders) {
			var staticLabelledBy = this.m_id + "instructions " + this.m_id + "_sliderString ";
			var numberOfSliders = this.m_editableSliders.length;
			for (var index=0; index<numberOfSliders; ++index) {
				var slider = this.m_editableSliders[index];
				if (slider && slider.name) {

					var label = (slider.label ? slider.label : slider.name);
					if (slider.attributeName) {
						label += (" " + slider.attributeName);
					}

					var description = "";

					if (typeof slider.values != "undefined") {
						description += this.processFilterOperatorItems(slider.values);
					}
					else {
						if (slider.min == slider.max) {
							description += slider.min;
						}
						else {
							description += this.processFilterOperatorRange(RV_RES.IDS_JS_INFOBAR_BETWEEN_TEXT, slider.min, slider.max);
						}
					}

					sliderList.push(
						{
							'type': 'slider',
							'label': label,
							'description': description
						}
					);
				}
			}
		}
		return sliderList;
	},

	hasLockedFilters : function() {
		var result = false;
		if (this.m_containerInfo !== null && typeof this.m_containerInfo.lockedFilters !== "undefined") {
			var numberOfLockedFilters = this.m_containerInfo.lockedFilters.length;
			for (var index=0; index<numberOfLockedFilters; ++index) {
				var lockedFilter = this.m_containerInfo.lockedFilters[index];
				if (typeof lockedFilter.staticText != "undefined" && lockedFilter.staticText.charAt(0) !== ' ') {
					result = true;
				}
			}
		}
		return result;
	},

	addLockedFilterDetails : function(viewOnlyMode) {
		var lockedFilterDetails = "";
		var showControl = (viewOnlyMode !== true); // showControl is true unless the viewOnlyMode is passed with value of "true"

		if (this.m_containerInfo !== null && typeof this.m_containerInfo.lockedFilters !== "undefined") {
			var staticLabelledBy = this.m_id + "instructions " + this.m_id + "_filterString " + this.m_id + "_lockedString ";
			var numberOfLockedFilters = this.m_containerInfo.lockedFilters.length;

			for (var index=0; index<numberOfLockedFilters; ++index) {
				var labelledBy = staticLabelledBy + this.m_id + index + "_lockedFilterDetail";
				var lockedFilter = this.m_containerInfo.lockedFilters[index];

				if (typeof lockedFilter.staticText != "undefined" && lockedFilter.staticText.charAt(0) !== ' ') {
					lockedFilterDetails += "<div class=\"infoBarDetailRow\" aria-labelledby=\"" + labelledBy + "\" role=\"listitem\"" + (!showControl?">":" tabindex=\"-1\">");
					lockedFilterDetails += "<table role=\"presentation\"><tr>";
					lockedFilterDetails += this.addInfoBarIcon("infobar_filter.gif", true);
					lockedFilterDetails += "</td>";
					lockedFilterDetails += "<td class=\"infoBarDetailsText\" role=\"presentation\" id=\"" + this.m_id + index + "_lockedFilterDetail\">";
					lockedFilterDetails += "<span class=\"bibi\">";
					lockedFilterDetails += html_encode(lockedFilter.staticText);
					lockedFilterDetails += "</span>";
					lockedFilterDetails += "</td>";
					lockedFilterDetails += (showControl ? this.addInfoBarIcon("infobar_locked.gif", false) : "");
					lockedFilterDetails += "</tr></table></div>";
				}
			}
		}
		return lockedFilterDetails;
	},

	addFilteredItemsDetails : function(viewOnlyMode) {
		var filteredItemsDetails = "";
		var showControl = (viewOnlyMode !== true); // showControl is true unless the viewOnlyMode is passed with value of "true"

		if (this.m_editableFilters) {
			for (var index = 0, filterLength = this.m_editableFilters.length; index < filterLength; ++index) {
				var filterItem = this.m_editableFilters[index];
				var labelledBy = this.m_id + "instructions " + this.m_id + "_filterString " + this.m_id + index + "_filterDetail";
				var labelText = (typeof filterItem.itemLabel == "string") ? filterItem.itemLabel : filterItem.item;
				filteredItemsDetails += "<div class=\"infoBarDetailRow\" type=\"filter\" aria-labelledby=\"" + labelledBy + "\" role=\"listitem\"" + (!showControl?">":" tabindex=\"-1\">");
				filteredItemsDetails += "<table role=\"presentation\"><tr>";
				filteredItemsDetails += this.addInfoBarIcon("infobar_filter.gif", true);
				filteredItemsDetails += "<td class=\"bibi infoBarDetailsText\" role=\"presentation\" id=\"" + this.m_id + index + "_filterDetail\">";
				filteredItemsDetails += this.createHiddenSpan(this.m_id + index + "_filterPosition", getCurrentPosistionString(this.m_cognosViewer, index + 1, filterLength));
				filteredItemsDetails += html_encode(enforceTextDir(labelText));
				filteredItemsDetails += this.processFilterOperator(filterItem);
				filteredItemsDetails += "</td>";
				filteredItemsDetails += (showControl ? this.addRemoveFilterButton(filterItem.item, this.processFilterDetails(filterItem)) : "");
				filteredItemsDetails += "</tr></table></div>";
			}
		}
		return filteredItemsDetails;
	},

	getFilteredItemsDetailsInJSON : function() {
		var filterList = [];

		if (this.m_editableFilters) {
			for (var index = 0, filterLength = this.m_editableFilters.length; index < filterLength; ++index) {
				var filterItem = this.m_editableFilters[index];
				var labelText = (typeof filterItem.itemLabel == "string") ? filterItem.itemLabel : filterItem.item;

						filterList.push(
							{
								'type': 'filter',
								'label': enforceTextDir(labelText) + this.processFilterOperator(filterItem),
								'description': ""
							}
						);

			}
		}
		return filterList;
	},

	addSortDetails : function(viewOnlyMode) {
		var sortDetails = "";
		var showControl = (viewOnlyMode !== true); // showControl is true unless the viewOnlyMode is passed with value of "true"

		if (this.m_editableSorts) {
			for (var index = 0, sortLength = this.m_editableSorts.length; index < sortLength; ++index) {
				var sortInfo = this.m_editableSorts[index];
				var labelledBy = this.m_id + "instructions " + this.m_id + "_sortString " + this.m_id + index + "_sortDetail";
				sortDetails += "<div class=\"infoBarDetailRow\" type=\"sort\" aria-labelledby=\"" + labelledBy + "\" role=\"listitem\"" + (!showControl?">":" tabindex=\"-1\">");
				sortDetails += "<table role=\"presentation\"><tr>";
				sortDetails += this.addInfoBarIcon("infobar_sort.gif", true);

				var itemLabel;
				if (typeof sortInfo.labels == "string" || typeof sortInfo.valuesOf == "string") {
					var itemName = (typeof sortInfo.labels == "string") ? sortInfo.labels : sortInfo.valuesOf;
					itemLabel = (typeof sortInfo.itemLabel == "string") ? sortInfo.itemLabel : itemName;
					sortDetails += "<td class=\"bibi infoBarDetailsText\" role=\"presentation\" id=\"" + this.m_id + index + "_sortDetail\">";
					sortDetails += this.createHiddenSpan(this.m_id + index + "_sortPosition", getCurrentPosistionString(this.m_cognosViewer, index+1, sortLength));
					sortDetails += html_encode(itemLabel);
					sortDetails += " : ";

					if (sortInfo.byItems instanceof Array) {
						//TODO: Leave out string "Sorted by" until rp1 (see infoBarAdornment)
						//sortDetails += this.m_sortStrings["byItems"];
						for (var byItemsIdx = 0; byItemsIdx < sortInfo.byItems.length; ++byItemsIdx) {
							sortDetails += (byItemsIdx>0) ? " - " : "";
							sortDetails += sortInfo.byItems[byItemsIdx].item;
							sortDetails += ", ";
							sortDetails += this.m_sortStrings[sortInfo.byItems[byItemsIdx].order];
						}
					} else {
						if (typeof sortInfo.valuesOf == "string") {
							sortDetails += this.m_sortStrings["byValue"];
						} else {
							sortDetails += this.m_sortStrings["byLabel"];
						}
						sortDetails += ", ";
						sortDetails += this.m_sortStrings[sortInfo.order];
					}
					sortDetails += "</td>";
					sortDetails += (showControl ? this.addRemoveSortButton(itemName, "true") : "");
				} else if (sortInfo.valuesOf instanceof Array) {
					if (sortInfo.valuesOf.length > 0 && typeof sortInfo.valuesOf[0].item == "string") {
						sortDetails += "<td class=\"bibi infoBarDetailsText\" role=\"presentation\" id=\"" + this.m_id + index + "_sortDetail\">";
						sortDetails += this.createHiddenSpan(this.m_id + index + "_sortPosition", getCurrentPosistionString(this.m_cognosViewer, index+1, sortLength));

						itemLabel = "";
						if (typeof sortInfo.itemLabel == "string") {
							itemLabel = sortInfo.itemLabel;
						} else {
							for (var valueSortIdx = 0; valueSortIdx < sortInfo.valuesOf.length; ++valueSortIdx) {
								itemLabel += " - ";
								itemLabel += sortInfo.valuesOf[valueSortIdx].item;
							}
							itemLabel = itemLabel.substring(3);
						}

						sortDetails += itemLabel;
						sortDetails +=  " : ";
						sortDetails += this.m_sortStrings["byValue"];
						sortDetails += ", ";
						sortDetails += this.m_sortStrings[sortInfo.order];
						sortDetails += "</td>";
						sortDetails += (showControl ? this.addRemoveSortButton(sortInfo.valuesOf[0].item, "false") : "");
					}
				}
				sortDetails += "</tr></table></div>";
			}
		}
		return sortDetails;
	},

	addInfoBarIcon : function(imageName, isLeft) {
		return "<td class=\"infoBar" + (isLeft?"Left":"Right") + "Icon\">" +
				"<img alt=\"\" src=\"" + this.m_cognosViewer.getWebContentRoot() + "/rv/images/" + imageName + "\"/>" +
			"</td>";
	},

	createHiddenSpan : function(id, text) {
		return "<span style=\"display:none\" id=\"" + id + "\"> " + text + " </span>";
	},

	addRemoveFilterButton : function(item, txtDetails) {
		var result = "";
		var oWidget = this.m_cognosViewer.getViewerWidget();
		if(!this.m_cognosViewer.isLimitedInteractiveMode() && !oWidget.isConsumeUser()) {
			var buttonTitle = RV_RES.IDS_JS_DELETE;
			var labelledBy = this.m_id + "_delete";
			result = "<td class=\"infoBarRightIcon\" filterItem=\"" + item + "\"" + (txtDetails ? " details=\""+ txtDetails +  "\"" :"") + ">" +
						"<button class=\"dijitStretch infoBarDeleteButton BUXNoPrint\" onclick=\"InfoBarHelper.infoBarRemoveFilter('" + this.m_cognosViewer.getId() + "'," + this.m_layoutIndex + ",'" + item  + "'" + (txtDetails ? ",'" + txtDetails + "'" : "") + ");\" aria-labelledby=\"" + labelledBy + "\" type=\"button\" role=\"button\" tabindex=\"0\" value=\"\" title=\"" + buttonTitle + "\">" +
							"<span class=\"dijitInline infoBarIconDelete\" title=\"" + buttonTitle + "\"></span>" +
							"<span class=\"dijitInline dijitDisplayNone infoBarDeleteButtonText\">x</span>" +
						"</button>" +
					"</td>";
		}
		return result;

	},

	addRemoveSliderButton : function(sliderId) {
		var result = "";
		var oWidget = this.m_cognosViewer.getViewerWidget();
		if (!this.m_cognosViewer.isLimitedInteractiveMode() && !oWidget.isConsumeUser()) {
			var buttonTitle = RV_RES.IDS_JS_DELETE;
			var labelledBy = this.m_id + "_delete";
			result = "<td class=\"infoBarRightIcon\" slider=\"" + sliderId + "\">" +
					"<button class=\"dijitStretch infoBarDeleteButton BUXNoPrint\" onclick=\"InfoBarHelper.infoBarRemoveSlider('" + this.m_cognosViewer.getId() + "','" + sliderId + "');\" aria-labelledby=\"" + labelledBy + "\" type=\"button\" role=\"button\" tabindex=\"0\" value=\"\" title=\"" + buttonTitle + "\">" +
						"<span class=\"dijitInline infoBarIconDelete\" title=\"" + buttonTitle + "\"></span>" +
						"<span class=\"dijitInline dijitDisplayNone infoBarDeleteButtonText\">x</span>" +
					"</button>" +
				"</td>";
		}
		return result;

	},

	addRemoveSortButton : function(item, byLabel) {
		var result = "";
		var oWidget = this.m_cognosViewer.getViewerWidget();
		if (!this.m_cognosViewer.isLimitedInteractiveMode() && !this.m_cognosViewer.isBlacklisted("Sort")) {
			var buttonTitle = RV_RES.IDS_JS_DELETE;
			var labelledBy = this.m_id + "_delete";
			result = "<td class=\"infoBarRightIcon\" sortItem=\"" + item + "\" byLabel=\"" + byLabel + "\">" +
						"<button class=\"dijitStretch infoBarDeleteButton BUXNoPrint\" onclick=\"InfoBarHelper.infoBarRemoveSort('" + this.m_cognosViewer.getId() + "'," + this.m_layoutIndex + ",'" + item + "','" + byLabel + "');\" aria-labelledby=\"" + labelledBy + "\" type=\"button\" role=\"button\" tabindex=\"0\" value=\"\" title=\"" + buttonTitle + "\">" +
							"<span class=\"dijitInline infoBarIconDelete\" title=\"" + buttonTitle + "\"></span>" +
							"<span class=\"dijitInline dijitDisplayNone infoBarDeleteButtonText\">x</span>" +
						"</button>" +
					"</td>";
		}
		return result;
	},

	processFilterOperator : function(filterItem) {
		var filterOperatorText = "";

		if (typeof filterItem["in"] != "undefined") {
			filterOperatorText += " " + CViewerCommon.getMessage(RV_RES.IDS_JS_INFOBAR_INCLUDE_TEXT, this.processFilterOperatorItems(filterItem["in"]));
		} else if (typeof filterItem["notIn"] != "undefined") {
			filterOperatorText += " " + CViewerCommon.getMessage(RV_RES.IDS_JS_INFOBAR_EXCLUDE_TEXT, this.processFilterOperatorItems(filterItem["notIn"]));
		} else if (typeof filterItem["range"] != "undefined" || typeof filterItem["notRange"] != "undefined") {
			var operatorText = typeof filterItem["range"] != "undefined" ? RV_RES.IDS_JS_INFOBAR_BETWEEN_TEXT : RV_RES.IDS_JS_INFOBAR_NOT_BETWEEN_TEXT;
			var rangeArray = typeof filterItem["range"] != "undefined" ? filterItem["range"] : filterItem["notRange"];
			for (var index = 0; index < rangeArray.length; ++index) {
				var range = rangeArray[index];
				filterOperatorText += " " + CViewerCommon.getMessage(operatorText, [range.from, range.to]);
			}
		} else if (typeof filterItem["lessThan"] != "undefined") {
			filterOperatorText += " " + RV_RES.IDS_JS_FILTER_LESS_THAN + " " + filterItem["lessThan"];

		} else if (typeof filterItem["lessThanEqual"] != "undefined") {
			filterOperatorText += " " + RV_RES.IDS_JS_FILTER_LESS_THAN_EQUAL + " " + filterItem["lessThanEqual"];

		} else if (typeof filterItem["greaterThan"] != "undefined") {
			filterOperatorText += " " + RV_RES.IDS_JS_FILTER_GREATER_THAN + " " + filterItem["greaterThan"];

		} else if (typeof filterItem["greaterThanEqual"] != "undefined") {
			filterOperatorText += " " + RV_RES.IDS_JS_FILTER_GREATER_THAN_EQUAL + " " + filterItem["greaterThanEqual"];
		} else {
			if( typeof filterItem[ "not" ] != "undefined"  && filterItem[ 'not' ] == 'true') {
				filterOperatorText += " " + RV_RES.IDS_JS_FILTER_IS_NOT;	
			}
			if( typeof filterItem[ "endsWith"] != "undefined" ) {
				filterOperatorText += " " + RV_RES.IDS_JS_FILTER_ENDS_WITH + " " + filterItem["endsWith"];	
			} else if( typeof filterItem[ "beginsWith"] != "undefined" ) {
				filterOperatorText += " " + RV_RES.IDS_JS_FILTER_BEGINS_WITH + " " + filterItem["beginsWith"];	
			}else if( typeof filterItem[ "contains"] != "undefined" ) {
				filterOperatorText += " " + RV_RES.IDS_JS_FILTER_CONTAINS + " " + filterItem["contains"];	
			}else if( typeof filterItem[ "isMatchesSQLPatternFilter"] != "undefined" ) {
				filterOperatorText += " " + RV_RES.IDS_JS_FILTER_IS_MATCHES_SQLPATTERNFILTER + " " + filterItem["isMatchesSQLPatternFilter"];	
			}
		}
		return filterOperatorText;
	},

	processFilterDetails : function(filterItem) {
		return html_encode('[' + dojo.toJson(filterItem) + ']');
	},

	processFilterOperatorItems : function(filterOperatorItems) {
		var filterOperatorItemsText = "";
		for (var index = 0; index < filterOperatorItems.length; ++index) {
			if (index !== 0) {
				filterOperatorItemsText += (RV_RES.IDS_JS_LIST_SEPARATOR + " ");
			}
			filterOperatorItemsText += enforceTextDir(filterOperatorItems[index]);
		}
		return filterOperatorItemsText;
	},

	processFilterOperatorRange : function(rangeTypeText, minRange, maxRange) {
		if (typeof minRange == "undefined") {
			minRange =' ';
		}
		if (typeof maxRange == "undefined") {
			maxRange = ' ';
		}
		return  CViewerCommon.getMessage(rangeTypeText, [minRange, maxRange]);
	}
});

// Info Bar
dojo.declare("InfoBar", InfoBarBase, {
	constructor : function(cognosViewer, layoutElement, containerInfo, childContainers, layoutIndex) {
		this.m_layoutElement = layoutElement;
		this.m_containerInfo = containerInfo;
		this.m_bRendered = false;
		this.initializeEditableSorts(childContainers);
		this.initializeEditableFilters(childContainers);
		this.initializeEditableSliders(childContainers);

		this.m_id = layoutIndex + cognosViewer.getId();
		this.m_layoutIndex = layoutIndex;
		this.m_sortStrings = {
			byLabel: RV_RES.IDS_JS_SORTED_BY_LABEL,
			byValue: RV_RES.IDS_JS_SORTED_BY_VALUE,
			descending: RV_RES.IDS_JS_SORT_DESCENDING_ORDER,
			ascending: RV_RES.IDS_JS_SORT_ASCENDING_ORDER
		};
		this.connections = [];
	},

	getLayoutElement : function() {
		var layoutElement = this.m_layoutElement;
		var layoutId = layoutElement.getAttribute("lid");
		if (layoutId == null) {
			layoutId = layoutElement.getAttribute("pflid");
		}
		if (layoutId !== null) {
			if (layoutElement.tagName.toUpperCase() == "MAP") {
				var allSiblings = layoutElement.parentNode.childNodes;
				for (var index = 0; index < allSiblings.length; ++index) {
					var useMapValue = allSiblings[index].getAttribute("usemap");
					if (useMapValue !== null && useMapValue == ("#" + this.m_cognosViewer.getId() + layoutId)) {
						return allSiblings[index];
					}
				}
			}
			else if (layoutElement.parentNode.getAttribute("chartcontainer") == "true") {
				return layoutElement.parentNode;
			}
			return layoutElement;
		}
		return null;
	},

	initializeEditableSorts : function(childContainers) {
		if (this.m_containerInfo !== null) {
			if (typeof this.m_containerInfo.sort !== "undefined") {
				this.m_editableSorts = this.m_containerInfo.sort;
			}
			if (typeof childContainers !== "undefined") {
				for (var i=0; i<childContainers.length; ++i) {
					this.m_editableSorts = this.mergeChildInfo(this.m_editableSorts, childContainers[i].sort, 'labels');
					this.m_editableSorts = this.mergeChildInfo(this.m_editableSorts, childContainers[i].sort, 'valuesOf');
				}
			}
		}
	},

	initializeEditableFilters : function(childContainers) {
		if (typeof this.m_containerInfo !== "undefined" && this.m_containerInfo !== null) {
			if (typeof this.m_containerInfo.filter !== "undefined") {
				this.m_editableFilters = this.m_containerInfo.filter;
			}
			if (typeof childContainers!== "undefined") {
				for (var i=0; i<childContainers.length; ++i) {
					this.m_editableFilters = this.mergeChildInfo(this.m_editableFilters, childContainers[i].filter, 'item');
				}
			}
		}
	},

	initializeEditableSliders : function(childContainers) {
		if (typeof this.m_containerInfo !== "undefined" && this.m_containerInfo !== null) {
			if (typeof this.m_containerInfo.sliders !== "undefined") {
				this.m_editableSliders = this.m_containerInfo.sliders;
			}
			if (typeof childContainers!== "undefined") {
				for (var i=0; i<childContainers.length; ++i) {
					this.m_editableSliders = this.mergeChildInfo(this.m_editableSliders, childContainers[i].sliders, 'name');
				}
			}
		}
	},

	mergeChildInfo : function(parentList, childList, key) {
		if (typeof childList != "undefined") {
			if (typeof parentList === "undefined" || parentList === null) {
				parentList = childList;
			} else {
				//remove duplicates....(eg shared filters)
				var duplicateChecker = [];
				for (var i = 0; i<parentList.length; ++i) {
					duplicateChecker[parentList[i][key]] = parentList[i];
				}

				for (var j = 0; j<childList.length; ++j) {
					var childEntry = childList[j];
					if (typeof duplicateChecker[childEntry[key]] == "undefined") {
						parentList.push(childEntry);
						duplicateChecker[childEntry.item] = childEntry;
					}
				}
			}
		}
		return parentList;
	},

	hasSomethingRendered: function () {
		return this.m_bRendered;
	},

	render : function() {
		var divElement = document.getElementById("infoBar" + this.m_id);

		if(divElement === null) {
			var isSingleton = (this.m_containerInfo && this.m_containerInfo.displayTypeId === "singleton") ? true : false;

			if( isSingleton && !this.m_editableFilters && !this.m_editableSliders ) {
				return;
			}

			if(this.m_timingDetails || this.m_editableSorts || this.m_editableFilters || this.m_editableSliders || this.hasPrompts() || this.hasLockedFilters())
			{
				var layoutElement = this.getLayoutElement();

				var parentDiv = document.createElement("div");

				parentDiv.setAttribute("dir", this.m_cognosViewer.getDirection() === "rtl" ? "rtl" : "ltr");

				divElement = document.createElement("div");
				divElement.className = "infoBar";
				divElement.setAttribute("id", "infoBar" + this.m_id);
				divElement.setAttribute("cvid", this.m_cognosViewer.getId());
				divElement.setAttribute("layoutid", this.m_id);
				divElement.setAttribute("containerid", this.m_layoutIndex);
				divElement.setAttribute("role", "region");
				divElement.setAttribute("aria-label", RV_RES.IDS_JS_REPORT_INFO_TITLE);

				if( isSingleton ) {
					dojo.style(divElement, {opacity: "0.6"});
				}

				divElement.appendChild(this.renderHeader());
				divElement.appendChild(this.renderDetails());

				parentDiv.appendChild(divElement);
				layoutElement.parentNode.insertBefore(parentDiv, layoutElement);

				this.connections.push( dojo.connect(divElement, 'onkeydown', this, this.onKeyDown) );
				this.connections.push( dojo.query('.infoBarHeader', divElement).connect('onmousedown', this, this.toggle) );
				this.connections.push( dojo.query('.infoBarLeftIcon', divElement).connect('onmousedown', this, this.ignoreEvent) );
				this.connections.push( dojo.query('.infoBarDetailsText', divElement).connect('onmousedown', this, this.ignoreEvent) );
				this.connections.push( dojo.query('.infoBarLockedItems', divElement).connect('onmousedown', this, this.ignoreEvent) );

				this.m_bRendered = true;
				if (this.wasInfoBarExpanded(this.m_id)) {
					this.show();
				}
			}
		}
	},

	renderHeader : function() {
		var isFiltered = this.isFilterApplied();
		var isSorted = this.isSortApplied();

		var headerDiv = document.createElement("div");
		headerDiv.id = "infoBarHeader" + this.m_id;
		headerDiv.className="infoBarHeaderDiv";
		var header =
			'<div role="presentation" class="infoBarHeader BUXNoPrint" style="width:100%">' +
				this.addHeaderCloseButton() +
				this.addHeaderNavigationButton(isFiltered, isSorted) +
				this.addHeaderText(isFiltered, isSorted) +
			'</div>';
		headerDiv.innerHTML = header;
		return headerDiv;
	},

	addHeaderNavigationButton : function(isFiltered, isSorted) {
		var buttonTitle = RV_RES.IDS_JS_INFOBAR_EXPAND;
		var buttonClass = "infoBarIcon" + (isFiltered?"Filter":"") + (isSorted?"Sort":"") + "Applied";
		var labelledBy = "infoBarHeaderButton" + this.m_id + " infoBarHeaderText" + this.m_id;
		return '<button class="dijitStretch infoBarHeaderButton" id="infoBarHeaderButton' + this.m_id + '" aria-labelledby="' + labelledBy + '" type="button" role="button" tabindex="0" value="" title="' + buttonTitle + '">' +
				'<span class="dijitInline ' + buttonClass + '" title="' + buttonTitle + '"></span>' +
				'<span class="dijitInline dijitDisplayNone infoBarHeaderButtonText">!</span>' +
			'</button>';
	},

	addHeaderText : function(isFiltered, isSorted) {
		var headerText = [];
		if (isFiltered) {headerText.push(RV_RES.IDS_JS_FILTER_APPLIED);}
		if (isSorted) {headerText.push(RV_RES.IDS_JS_SORT_APPLIED);}
		return '<span class="infoBarHeaderText" id="infoBarHeaderText' + this.m_id + '">' +
			headerText.join(', ') +
		'</span>';
	},

	addHeaderCloseButton : function() {
		var buttonTitle = RV_RES.IDS_JS_INFOBAR_COLLAPSE;
		var labelledBy = this.m_id + "_collapse";
		return '<button class="dijitStretch infoBarHeaderCloseButton" id="infoBarHeaderCloseButton' + this.m_id + '" aria-labelledby="' + labelledBy + '" type="button" role="button" tabindex="0" value="" title="' + buttonTitle + '">' +
				'<span class="dijitInline infoBarIconClose BUXNoPrint" title="' + buttonTitle + '"></span>' +
				'<span class="dijitInline dijitDisplayNone infoBarCloseButtonText">x</span>' +
			'</button>';
	},

	isFilterApplied : function() {
		if (this.m_editableFilters || this.m_editableSliders || typeof this.m_containerInfo.lockedFilters !== "undefined" || this.hasPrompts()) {
			return true;
		}
		return false;
	},

	isSortApplied : function() {
		if (this.m_editableSorts) {
			return true;
		}
		return false;
	},

	renderDetails : function() {
		var divElement = document.getElementById("infoBarFlyout" + this.m_id);
		var instructions = document.getElementById(this.m_id + "instructions");

		if (divElement === null) {
			this.getLayoutElement();
			divElement = document.createElement("div");
			divElement.setAttribute("id", "infoBarFlyout" + this.m_id);
			divElement.setAttribute("cvid", this.m_cognosViewer.getId());
			divElement.setAttribute("layoutid", this.m_id);
			divElement.setAttribute("containerid", this.m_layoutIndex);
			divElement.className = "infoBarFlyout";
			divElement.style.display = "none";

			divElement.innerHTML =  "<div class=\"infoBarFlyoutContent\" id=\"infoBarFlyoutContent" + this.m_id + "\" role=\"list\">" +
										this.addLockedInfoBarDetails() +
										this.addEditableInfoBarDetails() +
										this.addRAPTimingDetails() +
									"</div>" +

									this.createHiddenSpan(this.m_id + "_filterString", RV_RES.IDS_JS_FILTER) +
									this.createHiddenSpan(this.m_id + "_sortString", RV_RES.IDS_JS_SORT) +
									this.createHiddenSpan(this.m_id + "_promptString", RV_RES.IDS_JS_INFOBAR_PROMPT) +
									this.createHiddenSpan(this.m_id + "_sliderString", RV_RES.IDS_JS_INFOBAR_SLIDER) +
									this.createHiddenSpan(this.m_id + "_lockedString", RV_RES.IDS_JS_INFOBAR_LOCKED) +
									this.createHiddenSpan(this.m_id + "_collapse", RV_RES.IDS_JS_INFOBAR_COLLAPSE) +
									this.createHiddenSpan(this.m_id + "_delete", RV_RES.IDS_JS_DELETE);

			this.connections.push( dojo.connect(divElement, 'onkeydown', this, this.onKeyDown));

			this.connections.push(
			dojo.query('.infoBarDetailRow', divElement)
				.forEach(function (item, index, array) {
					dojo.attr(item, {
						"aria-setsize" : array.length,
						"aria-posinset" : index+1
					});
				})
				.connect('onfocus', function(e) {
					dojo.query(e.currentTarget).addClass('infoBarDetailRowHover');
				})
				.connect('onblur', function(e) {
					var el = typeof e.explicitOriginalTarget !== "undefined" ? e.explicitOriginalTarget : document.activeElement;
					if (dojo.hasClass(el, 'infoBarDeleteButton')) {
						return true;
					}
					dojo.query(e.currentTarget).removeClass('infoBarDetailRowHover');
				})
				.connect('onmouseover', this, function(e) {
					this.focusDetailRow(e.currentTarget);
				})
				);
		}

		// used for JAWS to let the user know how to navigate the info bar
		if (instructions === null) {
			instructions = document.createElement("span");
			instructions.id = this.m_id + "instructions";
			instructions.setAttribute("role", "presentation");
			instructions.style.visibility = "hidden";
			instructions.style.display = "none";
			document.body.appendChild(instructions);
			instructions.innerHTML = RV_RES.IDS_JS_INFOBAR_EXPLANATION;
		}
		return divElement;
	},

	addRAPTimingDetails : function() {
		if (this.m_timingDetails) {
			var lastDetail=this.m_timingDetails.length - 1;
			var totalTime=this.m_timingDetails[lastDetail].time - this.m_timingDetails[0].time;
			return '<div><table role="presentation" class="infoBarLockedItems">' +
						'<tr>' +
							this.addTimingIcon(totalTime, 250, 500) +
							'<td colspan="2" class="bibi inforBarDetailsText" role="presentation" id=\"' + this.m_id + '_timingDetail\" style=\"background-color:LightGray\"><b>RAP Total Time: (' + totalTime + ")</b></td>" +
						'</tr>' +
						this.addRAPTimingItemDetails() +
					'</table></div>';
		}
		return "";
	},

	addRAPTimingItemDetails : function() {
		var timingItemDetails = "";
		if (this.m_timingDetails) {
			for (var index = 0; index <= this.m_timingDetails.length - 1; ++index) {
				var timingItem = this.m_timingDetails[index];
				var timeDiff = this.getTimeDiff(index);
				timingItemDetails += "<tr class=\"infoBarDetailRow\" type=\"filter\" tabindex=\"-1\">";
				if (timingItem.level) {
					timingItemDetails += "<td colspan=3><font size=\"1\">" + timeDiff + ':' + html_encode(timingItem.event) + "</font></td></tr>";
				} else {
					timingItemDetails += this.addTimingIcon(timeDiff, 100,500);
					timingItemDetails += "<td class=\"bibi infoBarDetailsText\" role=\"presentation\" id=\"" + this.m_id + index + "_timingDetail\">";
					timingItemDetails += html_encode(timingItem.event);
					timingItemDetails += '</td><td align="right">' + timeDiff + '</td>';
				}
				timingItemDetails += "</tr>";
			}
		}
		return timingItemDetails;
	},

	getTimeDiff: function(index) {
		var nextTimeIdx=index+1;
		if (nextTimeIdx>=this.m_timingDetails.length) {
			return 0;
		}
		var thisLevel=this.m_timingDetails[index].level;
		if (!(thisLevel==this.m_timingDetails[nextTimeIdx].level)) {
			while(nextTimeIdx < this.m_timingDetails.length &&
					this.m_timingDetails[nextTimeIdx].level != thisLevel &&
					typeof this.m_timingDetails[nextTimeIdx].level != "undefined") {
				nextTimeIdx++;
			}
		}
		return (this.m_timingDetails[nextTimeIdx].time - this.m_timingDetails[index].time);
	},

	addTimingIcon: function(timeDiff, yellow, red) {
		var theIcon="icon_excellent_traffic.gif";
		if (timeDiff > red) {
			theIcon="icon_poor_traffic.gif";
		} else if (timeDiff > yellow) {
			theIcon="icon_average_traffic.gif";
		}
		return this.addInfoBarIcon(theIcon, true);
	},

	addLockedInfoBarDetails : function() {
		if (this.hasPrompts() || typeof this.m_containerInfo.lockedFilters !== "undefined") {
			return "<div role=\"presentation\" class=\"infoBarLockedItems\">" +
					this.addPromptDetails() +
					this.addLockedFilterDetails() +
				"</div>";
		}
		return "";
	},

	addEditableInfoBarDetails : function() {
		if (this.m_editableFilters || this.m_editableSorts || this.m_editableSliders) {
			return "<div role=\"presentation\" class=\"infoBarEditableItems\">" +
					this.addFilteredItemsDetails() +
					this.addSliderDetails() +
					this.addSortDetails() +
				"</div>";
		}
		return "";
	},

	onKeyDown : function(evt) {
		var srcNode = evt.target;
		var cvId = this.m_cognosViewer.getId();

		var infoBarHeaderButton = document.getElementById("infoBarHeaderButton" + this.m_id);
		var instructions = document.getElementById(this.m_id + "instructions");
		var node;

		if (evt.keyCode == "13") { // enter
			instructions.innerHTML = RV_RES.IDS_JS_INFOBAR_EXPLANATION;
			if (srcNode === infoBarHeaderButton) {
				this.toggle();
				return stopEventBubble(evt);
			}

		} else if (evt.keyCode == "27")	{ // esc
			var a11yHelper = this.m_cognosViewer.getA11YHelper();
			if (this.m_cognosViewer.getCurrentNodeFocus()) {
				node = this.m_cognosViewer.getCurrentNodeFocus();
				if (node.nodeName.toLowerCase() != "span") {
					var spans = node.getElementsByTagName("span");
					for (var index=0; index < spans.length; index++) {
						if (spans[index].style.display != "hidden") {
							node = spans[index];
							break;
						}
					}
				}
				this.hide(false);
				a11yHelper.setFocusToNode(node);
			} else {
				this.hide();
			}
			return stopEventBubble(evt);

		} else if (evt.keyCode == "46") { // del
			if (dojo.hasClass(srcNode, "infoBarDetailRow")) {
				node = dojo.query("td.infoBarRightIcon", srcNode)[0];
				if (typeof node !== "undefined") {
					if (srcNode.getAttribute("type") == "filter") {
						InfoBarHelper.infoBarRemoveFilter(cvId, this.m_layoutIndex, node.getAttribute("filterItem"), node.getAttribute("details"));
					} else if (srcNode.getAttribute("type") == "sort") {
						InfoBarHelper.infoBarRemoveSort(cvId, this.m_layoutIndex, node.getAttribute("sortItem"), node.getAttribute("byLabel"));
					} else if (srcNode.getAttribute("type") == "slider") {
						InfoBarHelper.infoBarRemoveSlider(cvId, node.getAttribute("slider"));
					}
				}
			}

		} else if (evt.keyCode == "38") { // up arrow
			if (dojo.hasClass(srcNode, "infoBarDetailRow")) {
				this.focusDetailRow(srcNode, "prev");
			} else {
				this.focusDetailRow();
			}
			instructions.innerHTML = "";
			return stopEventBubble(evt);

		} else if (evt.keyCode == "40") { // down arrow
			if (dojo.hasClass(srcNode, "infoBarDetailRow")) {
				this.focusDetailRow(srcNode, "next");
			} else {
				this.focusDetailRow();
			}
			instructions.innerHTML = "";
			return stopEventBubble(evt);
		} else if (evt.keyCode == "9") { // tab
			// if the info bar is expanded either set the focus to the info or the close button
			var infoBar = document.getElementById("infoBar" + this.m_id);
			if (dojo.hasClass(infoBar, "infoBarExpanded")) {
				if (dojo.hasClass(srcNode, "infoBarDetailRow")) {
					dojo.byId("infoBarHeaderCloseButton" + this.m_id).focus();
				} else {
					this.focusDetailRow();
				}
				return stopEventBubble(evt);
			}
		}
	},

	focusDetailRow : function(detailRow, dir) {
		var infoBarFlyout = document.getElementById("infoBarFlyout" + this.m_id);
		var infoBar = document.getElementById("infoBar" + this.m_id);

		if (!dojo.hasClass(infoBar, "infoBarExpanded")) {
			return;
		}

		if (typeof detailRow == "undefined" || detailRow === null) {
			var firstDetailRows = dojo.query(".infoBarLockedItems .infoBarDetailRow, .infoBarEditableItems .infoBarDetailRow", infoBarFlyout);
			detailRow = firstDetailRows[0];
		}

		if (detailRow && dojo.hasClass(detailRow, "infoBarDetailRow")) {
			var newRow, rows, len, i;
			if (dir === "prev") {
				if (detailRow.parentNode.previousSibling) { // faster
					newRow = detailRow.parentNode.previousSibling.childNodes[1];
				} else {
					rows = dojo.query(".infoBarDetailRow", infoBarFlyout);
					len = rows.length;
					if (detailRow === rows[0]) {
						newRow = rows[len-1];
					} else {
						for (i = 1; i < len; i++) {
							if (detailRow === rows[i]) {
								newRow = rows[i-1];
								break;
							}
						}
					}
				}
			} else if (dir === "next") {
				if (detailRow.parentNode.nextSibling) { // faster
					newRow = detailRow.parentNode.nextSibling.childNodes[1];
				} else {
					rows = dojo.query(".infoBarDetailRow", infoBarFlyout);
					len = rows.length;
					if (detailRow === rows[len-1]) {
						newRow = rows[0];
					} else {
						for (i = 0; i < len-1; i++) {
							if (detailRow === rows[i]) {
								newRow = rows[i+1];
								break;
							}
						}
					}
				}
			} else {
				newRow = detailRow;
			}
			newRow.focus();
		}
	},

	toggle : function(evt) {
		var infoBar = document.getElementById("infoBar" + this.m_id);
		if (dojo.hasClass(infoBar, "infoBarExpanded")) {
			this.hide();
		} else {
			this.show();
		}
		stopEventBubble(evt);
	},
	
	ignoreEvent : function(evt) {
		stopEventBubble(evt);
	},

	show : function() {
		var infoBar = document.getElementById("infoBar" + this.m_id);

		if (!dojo.hasClass(infoBar, "infoBarExpanded")) {
			var infoBarHeader = document.getElementById("infoBarHeader" + this.m_id);
			var infoBarFlyout = document.getElementById("infoBarFlyout" + this.m_id);
			var infoBarHeaderButton = document.getElementById("infoBarHeaderButton" + this.m_id);
			var flyoutCoords, canvasCoords, newWidth;
			var wipeIn = dojo.fx.wipeIn({
				node: infoBarFlyout,
				duration: 300,
				onEnd: dojo.hitch(this, function() {
					this.focusDetailRow();
					infoBarHeaderButton.setAttribute('title', RV_RES.IDS_JS_INFOBAR_COLLAPSE);
					infoBarHeaderButton.childNodes[0].setAttribute('title', RV_RES.IDS_JS_INFOBAR_COLLAPSE);
				})
			});

			this.updateInfoBarRenderedState(this.m_id, "true");

			dojo.addClass(infoBar, "infoBarExpanded");
			if(this.m_containerInfo && this.m_containerInfo.displayTypeId === "singleton") {
				dojo.style(infoBar, {opacity: '1'});
			}

			dojo.style(infoBar, "width", 'auto');
			wipeIn.play();

			var infoBarHeaderText = document.getElementById("infoBarHeaderText" + this.m_id).innerHTML;
			var infoBarHeaderWidth = this._getTextWidth(infoBarHeaderText) + 40; // the 40 is for the icons to the left and right of the text
			
			// 500 is the min the infobar should be
			if (infoBarHeaderWidth < 500) {
				infoBarHeaderWidth = 500;
			}
			
			var oWidget = this.m_cognosViewer.getViewerWidget();
			var maxWidth = oWidget.findContainerDiv().clientWidth;
			
			if (infoBarHeaderWidth > maxWidth) {
				infoBarHeaderWidth = maxWidth - 5;  // -5 to make sure the info bar doesn't casuse scroll bars to show up
			}
			
			//dojo.style(infoBar, "width", infoBarHeaderWidth + "px");
			infoBar.style.width = infoBarHeaderWidth + "px";
			dojo.removeClass(infoBarHeader, "BUXNoPrint");
		}
	},

	_getTextWidth : function(text) {
		var div = document.createElement("div");
		div.className = "infoBar infoBarHeader";
		div.style.fontWeight = "bold";
		div.style.position = "absolute";
		div.style.visibility = "hidden";
		div.style.height = "auto";
		div.style.width = "auto";
		document.body.appendChild(div);
		div.innerHTML = text;
		
		var result = div.clientWidth;
		document.body.removeChild(div);
		
		return result;
	},
	
	hide : function(focus) {
		var infoBar = document.getElementById("infoBar" + this.m_id);

		if (dojo.hasClass(infoBar, "infoBarExpanded")) {
			this.updateInfoBarRenderedState(this.m_id, "false");

			var infoBarHeader = document.getElementById("infoBarHeader" + this.m_id);
			var infoBarFlyout = document.getElementById("infoBarFlyout" + this.m_id);
			var infoBarHeaderButton = document.getElementById("infoBarHeaderButton" + this.m_id);
			dojo.addClass(infoBarHeader, "BUXNoPrint");
			dojo.fx.wipeOut({
				node: infoBarFlyout,
				duration: 300,
				onEnd: dojo.hitch(this, function() {
					dojo.removeClass(infoBar, "infoBarExpanded");
					dojo.style(infoBar, "width", 'auto');
					if(this.m_containerInfo && this.m_containerInfo.displayTypeId === "singleton")
					{
						dojo.style(infoBar, {opacity: '0.6'});
					}

					infoBarHeaderButton.setAttribute('title', RV_RES.IDS_JS_INFOBAR_EXPAND);
					infoBarHeaderButton.childNodes[0].setAttribute('title', RV_RES.IDS_JS_INFOBAR_EXPAND);

					if (!focus) {
						infoBarHeaderButton.focus();
					}
				})
			}).play();
		}
	},

	updateInfoBarRenderedState: function(uniqueId, sExpanded) {

		var oWidget = this.m_cognosViewer.getViewerWidget();
		if (oWidget) {
			var object = oWidget.getInfoBarRenderedState();
			object[uniqueId] = sExpanded;
		}
	},

	wasInfoBarExpanded: function(uniqueId) {

		var oWidget = this.m_cognosViewer.getViewerWidget();
		if (oWidget) {
			var object = oWidget.getInfoBarRenderedState();
			if (object) {
				if (object[uniqueId]) {
					if ("true" === object[uniqueId]) {
						return true;
					}
				}
			}
		}
		return false;
	},

	destroy: function() {

		for(var i=0; i<this.connections.length; i++) {
			var handle = this.connections[i];
			if (handle && handle.remove) {//skip hmtl mode and make sure it is a handle object with remove function
				dojo.disconnect(handle);
			}
		}

		var divElement = document.getElementById("infoBar" + this.m_id);
		if (divElement) {
			var parentNode = divElement.parentNode;
			if (parentNode) {
				parentNode.removeChild(divElement);
			}
		}
		divElement = document.getElementById(this.m_id + "instructions");
		if (divElement) {
			divElement.parentNode.removeChild(divElement);
		}

		delete this.m_layoutElement;
		delete this.m_containerInfo;
	}
});

// ///////////////////////////////////////////////////////////
// AnnotationFilterContext class
dojo.declare("AnnotationFilterContext", null, {
	m_parameterValuesString: null,
	m_parameterValuesSpec: null,
	m_slidersJSON: null,
	m_filterJSON: null,

	constructor : function(paramValuesString, paramValuesSpec, slidersJSON, filterJSON){
		this.m_parameterValuesString = paramValuesString;
		this.m_parameterValuesSpec = paramValuesSpec;
		this.m_slidersJSON = slidersJSON;
		this.m_filterJSON = filterJSON;
	},

	setParameterValuesString: function(param) {
		this.m_parameterValuesString = param;
	},
	setParameterValuesSpec: function(param){
		this.m_parameterValuesSpec = param;
	},
	setSlidersJSON: function(param) {
		this.m_slidersJSON = param;
	},
	setFilterJSON: function(param){
		this.m_filterJSON = param;
	},
	getParameterValuesString: function(){
		return this.m_parameterValuesString || null; // if null or undefined, return null;
	},
	getParameterValuesSpec: function(){
		return this.m_parameterValuesSpec || null; // if null or undefined, return null;
	},
	getPromptsJSON: function(){
		var promptObject = null;
		if (this.m_parameterValuesString) {
			promptObject = {};
			promptObject.parameterValuesString = this.m_parameterValuesString;
		}
		if (this.m_parameterValuesString) {
			promptObject = promptObject || {};
			promptObject.parameterValuesSpec = this.m_parameterValuesSpec;
		}

		return promptObject;
	},
	getSlidersJSON: function(){
		return this.m_slidersJSON || null; // if null or undefined, return null;
	},
	getFilterJSON: function(){
		return this.m_filterJSON || null; // if null or undefined, return null;
	},

	isEmpty: function(){
		if (this.m_parameterValuesString || this.m_parameterValuesSpec || this.m_slidersJSON || this.m_filterJSON ) {
			return false;
		}
		return true;
	}
});

// ///////////////////////////////////////////////////////////
// AnnotationInfoBar class
dojo.declare("AnnotationInfoBar", InfoBarBase, {
	constructor : function(cognosViewer, lid) {
		this.m_id = "annoInfoBar_" + lid;
		this.m_layoutElementId = lid;
	},

	/*
	 * returns AnnotationFilterContext object if parameterValuesString, filter, or sliders exists
	 */
	createFilterContext : function() {
		var filter = null;
		var slider = null;
		var paramSpec = null;
		var paramString = null;

		if (this.m_cognosViewer.getRAPReportInfo()) {
			var oRapReportInfo = this.m_cognosViewer.getRAPReportInfo();
			if (oRapReportInfo.getContainers()) {
				var oContainers = oRapReportInfo.getContainers();

				if (oContainers[this.m_layoutElementId]) {
					var oContainer = oContainers[this.m_layoutElementId];
					if(typeof oContainer.filter !== "undefined") {
						filter = oContainer.filter;
					}
					if(typeof oContainer.sliders !== "undefined") {
						slider = oContainer.sliders;
					}
				}
			}
		}

		if (this.hasPrompts()) {
			paramSpec = CViewerCommon.buildParameterValuesSpec(this.m_cognosViewer);
			paramString = this.m_cognosViewer.getExecutionParameters();
		}


		if (filter || slider || paramSpec || paramString) {
			return new AnnotationFilterContext(paramString, paramSpec, slider, filter);
		}

		return null;
	}
});

// ///////////////////////////////////////////////////////////
// AnnotationInfoBar class
dojo.declare("AnnotationInfoBarRenderer", null, {
	m_AnnotationInfoBar: null,
	m_id: null,
	m_labelledByHideButton: "",
	miniCognosViewer: null,
	m_editableSliders: null,


	constructor : function(cognosViewer, lid, filterContext, annoId) {

		this.m_AnnotationInfoBar = null;
		this.miniCognosViewer = {};

		this.miniCognosViewer.m_sId = cognosViewer.id;
		this.miniCognosViewer.getId = cognosViewer.getId;
		this.miniCognosViewer.m_sParameters = (filterContext === null || filterContext.getParameterValuesString() === null)? "" :filterContext.getParameterValuesString();
		this.miniCognosViewer.getExecutionParameters = cognosViewer.getExecutionParameters;
		this.miniCognosViewer.getWebContentRoot = cognosViewer.getWebContentRoot;

		this.m_AnnotationInfoBar = new AnnotationInfoBar(this.miniCognosViewer, lid);
		this.m_AnnotationInfoBar.setId( "annoInfoBar_" + annoId + lid );
		this.m_id = "annoInfoBar_" + annoId + lid + "_renderer";

		if (filterContext) {
			if (filterContext.getSlidersJSON()) {
				this.m_AnnotationInfoBar.setContainerInfo( {"sliders": filterContext.getSlidersJSON() } );
				this.m_AnnotationInfoBar.m_editableSliders = filterContext.getSlidersJSON();
			}

			if (filterContext.getFilterJSON()) {
				this.m_AnnotationInfoBar.setEditableFilters( filterContext.getFilterJSON() );
			}
		}
	},

	render: function() {

		var renderHidden =
			"<div class=\"infoBar infoBarCollapsed\" id=\"infoBarHeaderCollapsed" + this.m_id +"\" >" +
			this.renderHeader(false) +
			"</div>";

		var renderShown =
			"<div class=\"infoBar infoBarExpanded\" id=\"infoBarHeaderExpanded" + this.m_id +"\" style=\"display:none;\" >" +
			this.renderHeader(true) +
			this.renderDetails() +
			"</div>";

		renderShown = this.updateHideButtonLabelledBy(renderShown);

		var instructions = document.getElementById("annotationInfoBarInstructions");

		if (instructions === null) {
			instructions = document.createElement("span");
			instructions.id = "annotationInfoBarInstructions";
			instructions.setAttribute("role", "presentation");
			instructions.style.visibility = "hidden";
			instructions.style.display = "none";

			var details =
				this.m_AnnotationInfoBar.createHiddenSpan("annoInfoBarButtonInstruction",  RV_RES.IDS_JS_ANNO_INFOBAR_BUTTON_EXPLANATION) +
				this.m_AnnotationInfoBar.createHiddenSpan("annoInfoBar_filterString", RV_RES.IDS_JS_FILTER) +
				this.m_AnnotationInfoBar.createHiddenSpan("annoInfoBar_promptString", RV_RES.IDS_JS_INFOBAR_PROMPT) +
				this.m_AnnotationInfoBar.createHiddenSpan("annoInfoBar_sliderString", RV_RES.IDS_JS_INFOBAR_SLIDER);

			document.body.appendChild(instructions);
			instructions.innerHTML = details;
		}

		return renderHidden + renderShown;
	},

	renderInJSON: function() {
		var filters = [];
		return filters.concat(
			this.m_AnnotationInfoBar.getPromptDetailsInJSON(),
			this.m_AnnotationInfoBar.getFilteredItemsDetailsInJSON(),
			this.m_AnnotationInfoBar.getSliderDetailsInJSON()
		);
	},


	renderHeader: function(shown) {
		var mode = (shown)?"Hide":"Show";
		var buttonText = (shown)? RV_RES.IDS_JS_ANNO_INFOBAR_HIDE :RV_RES.IDS_JS_ANNO_INFOBAR_SHOW;

		var labelledBy = (shown)? ("XXREPLACEXX") : " annoInfoBarHeaderControlButtonText" + mode + this.m_id;

		var header =
			"<table class=\"annoInfoBarHeader\" id=\"annoInfoBarHeader" + mode + this.m_id + "\" role=\"presentation\">" +
				"<tr>" +
					"<td class=\"annoInfoBarHeaderText\" id=\"infoBarHeaderText" + this.m_id + "\" >" +
						RV_RES.IDS_JS_FILTER_APPLIED +
					"</td>" +
					"<td class=\"annoInfoBarHeaderControl\" id=\"infoBarHeader"+ mode + this.m_id + "\" >" +
						"<button id=\"annoInfoBarHeaderControl" + mode + this.m_id + "\" aria-labelledby=\"" + labelledBy + "\" type=\"button\" role=\"button\" tabindex=\"0\" value=\"\" title=\"" + buttonText + "\"" +
									" onmousedown=\"annotationInfoBarToggle('" + this.m_id + "', '"+ mode+"');\">"  +
							"<span id=\"annoInfoBarHeaderControlButtonText" + mode + this.m_id + "\"class=\"dijitInline annoInfoBarHeaderControlText\" title=\"" + buttonText + "\" >"+ buttonText+ "</span>" +
						"</button>" +
					"</td>"+
				"</tr>" +
			"</table>";

		return header;
	},

	renderDetails: function() {

		var promptDetail = this.m_AnnotationInfoBar.addPromptDetails(true);
		var filterDetail = this.m_AnnotationInfoBar.addFilteredItemsDetails(true);
		var sliderDetail = this.m_AnnotationInfoBar.addSliderDetails(true);

		var renderDetails =
			"<div class=\"annoInfoBarDetails\" id=\"annoInfoBarDetails" + this.m_id + "\" role=\"presentation\">"+
				promptDetail + filterDetail + sliderDetail +
			"</div>";

		this.m_labelledByHideButton  = (promptDetail.length === 0)? "":(" annoInfoBar_promptString " + this.m_AnnotationInfoBar.getId() + "0_promptDetail ");
		this.m_labelledByHideButton += (filterDetail.length === 0)? "":(" annoInfoBar_filterString " + this.m_AnnotationInfoBar.getId() + "0_filterDetail ");
		this.m_labelledByHideButton += (sliderDetail.length === 0)? "":(" annoInfoBar_sliderString " + this.m_AnnotationInfoBar.getId() + "0_sliderDetail  annoInfoBar_sliderString " + this.m_AnnotationInfoBar.getId() + "1_sliderDetail " );
		this.m_labelledByHideButton += " annoInfoBarHeaderControlButtonTextHide" + this.m_id;

		return renderDetails;
	},

	updateHideButtonLabelledBy: function(headerString) {
		return headerString.replace("XXREPLACEXX", this.m_labelledByHideButton);
	}
});

//==============================================
// Global function for annotation InfoBar Toggle
function annotationInfoBarToggle(mId, changeTo)
{
	var expanded = document.getElementById("infoBarHeaderExpanded" + mId);
	var collapsed = document.getElementById("infoBarHeaderCollapsed" + mId);

	var control = null;
	if ("Show" === changeTo) {
		dojo.style(expanded, {display: ""});
		dojo.style(collapsed, {display: "none"});
		control = document.getElementById("annoInfoBarHeaderControlHide" + mId);

	} else {
		dojo.style(collapsed, {display: ""});
		dojo.style(expanded, {display: "none"});
		control = document.getElementById("annoInfoBarHeaderControlShow" + mId);
	}

	if (control) {
		control.focus();
	}
}
