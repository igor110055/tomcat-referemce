/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013, 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

dojo.provide("WidgetContextManager");


dojo.declare("WidgetContextManager", null, {

	// PP stands for Property of Payload
	PP_WIDGET_CONTEXT: "com.ibm.widget.context", 
	PP_REPORT_PROMPT_CONTEXT: "com.ibm.widget.context.report.prompt", 
	PP_REPORT_DRILL_CONTEXT: "com.ibm.widget.context.report.drill", 
	PP_VALUES: "values", 
	PP_RANGES: "ranges",
	PP_MULTIVALUED: "multivalued",
	PP_MODELITEM: "modelItem",
	PP_MODELINFO: "modelInfo",
	PP_PROMPT: "prompt",
	PP_DRILL: "drill",
	PP_SELECT_CHOICES: "selectChoices",

	PP_BUX_SELECTVALUECONTROL_CONTEXT: "com.ibm.widget.context.bux.selectValueControl",
	PP_BUX_SELECTION_CONTEXT: "com.ibm.widget.context.bux.selection",
	
	PP_CASCADEPROMPT_CLEAR: "clearCascadePromptParams",
	
	EVENT_NAME_PROMPT: "com.ibm.widget.contextChanged.prompt",
	EVENT_NAME_DRILL: "com.ibm.widget.contextChanged.drill",
	EVENT_NAME_SELECTVALUECONTROL: "com.ibm.widget.contextChanged.selectValueControl",

	
	DEFAULT_MODEL_PATH: ".",

	m_widget: null, //Viewer Widget Instance
	m_oWidgetContextContainer: null, //Contains complete context of current widget
	m_oPromptContextContainer: null, //Contains complete prompt context of current widget
	m_oDrillContextContainer : null, //contains complete drill context container
	
	m_oPromptGenericContext : null, //contains the prompt in generic context format
	m_oDrillGenericContext : null, // contains the drill info in generic context format
	m_oFilterGenericContext : null, // contains the Filter (slider/selectValue) info in generic context format
	m_oSelectionFilterContext: null, // contains the selection filter info in generic context format
	
	m_oContextCollection: null, // contains the any context info in generic context format. Used for Active Report
	
	m_oWidgetContextObject: null, //Working object to share between functions
	m_oPromptContextObject: null, //Working object to share between functions
	m_oDrillContextObject: null, //Working object to share between functions
	
	m_aSelectionFilterObjects: null, // contains serialized json format of selection objects to be used in re-select
	
	constructor: function(widget) {
		this.m_widget = widget;
		
		this.m_oWidgetContextContainer = {};
		this.m_oPromptContextContainer = {};
		this.m_oDrillContextContainer = {};
		
		this.m_oPromptGenericContext = {};
		this.m_oDrillGenericContext = {};
		this.m_oFilterGenericContext = {};
		this.m_oSelectionFilterContext = {};
		
		this.m_oContextCollection = {};
		
		this.m_oWidgetContextObject = {};
		this.m_oPromptContextObject = {};
		this.m_oDrillContextObject = {};
		
		this.m_aSelectionFilterObjects = null;
	},

	/*
	 * This function is to support onDrop filter. 
	 * Canvas collects all widgets' widget context and send array of contexts to the widget being dropped. 
	 *  
	 * m_oWidgetContextContainer stores name/value pairs of its prompt and drill context
	 * 
	 * returns an object with the following fields in it
	 * 	{'com.ibm.widget.context': object, 
	 * 	 'clientId': string
	 *  }
	 */
	getWidgetContextObject: function() {		
		var payload = {};
		if (this.m_oWidgetContextContainer) {
			payload[this.PP_WIDGET_CONTEXT] = this.m_oWidgetContextContainer;
			if (this.m_widget) {
				payload.clientId = this.m_widget.getWidgetId();
			}
		}
		return payload;
	},

	/*
	 * This function is called from ViewerIWidget.canFilter
	 */
	getFilterFirstItemName: function() {
		var genericContext = this.m_oFilterGenericContext;
		if (genericContext) {
			var valuesOrRanges=(genericContext.values ? genericContext.values : genericContext.ranges);
			for (firstName in valuesOrRanges) {
				return firstName;
			}					
		}
		//When facets are being cleared, they supply the name as neither values or ranges.
		for (var firstName in genericContext) {
			return firstName;
		}
		return null;
	},
	getItemNames: function(payload) {
		var names = [];
		var genericContext = payload[this.PP_WIDGET_CONTEXT];
		if (genericContext) {
			var valuesOrRanges=(genericContext.values ? genericContext.values : genericContext.ranges);
			for (var field in valuesOrRanges) {
				names.push(field);
			}
			return names;
		}
		//When facets are being cleared, they supply the name as neither values or ranges.
		for (var field in genericContext) {
				names.push(field);
		}
		return names;
	},

	/*
	 * publish prompt event with generic payload
	 * 
	 */
	raisePromptEvent: function(sSharedPrompts, aServerRequestEnvParams, sActionParam, sModelPath,clearCascadePromptParams) {

		var oGeneralizedPayload = this._buildGeneralizedPromptPayload(sSharedPrompts, aServerRequestEnvParams, sActionParam, sModelPath,clearCascadePromptParams);
		if (oGeneralizedPayload) {
			this.m_widget.fireEvent(this.EVENT_NAME_PROMPT, null, oGeneralizedPayload);

			this._updatePromptContext(oGeneralizedPayload);
			this._updateWidgetContextContainer();
		}
	},
	
	_updatePromptContext : function( payload ) {
		this._updatePromptGenericContext( payload );
		this._updatePromptContextContainer(payload);
	},
	
	_resetWorkingMembers: function () {
		this.m_oWidgetContextObject = {};
		this.m_oPromptContextObject = {};
		this.m_oDrillContextObject = {};
	},

	/*
	 * This function is called from ViewerIWidget.onGenericSelectValueControl
	 */
	updateFilterContext: function(contextJSON) {
		this.m_oFilterGenericContext = contextJSON[this.PP_WIDGET_CONTEXT];
		this._updateWidgetContextContainer();
	},

	/*
	 * If this payload represents a selectValueControl, return the controlType...otherwise, return null.
	 *  
	 * 	{ 
	 * 		"com.ibm.widget.context": {
	 * 			"values": {  "productcategory": [ "Electronics"  ]  }
	 * 		},
	 *  	"com.ibm.widget.context.bux.selectValueControl": {
	 *      	"selectValueControl": { "controlType": "facet",  "id": "testID" }
	 *  	}
	 *  }

	 */
	getSelectValueControlTypeFromPayload: function( payload ) {
		var selectValueControlContext = payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT];
		if (selectValueControlContext && selectValueControlContext["selectValueControl"]) {
			return selectValueControlContext["selectValueControl"]["controlType"];
		}
		return null;
	},

	getSelectValuePropertyFromPayload: function( payload, property ) {
		var selectValueControlContext = payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT];
		if (selectValueControlContext && selectValueControlContext["selectValueControl"]) {
			return selectValueControlContext["selectValueControl"][property];
		}
		return null;
	},
	
	/**
	 * It is important that prompt context and drill context be updated prior to calling this function.
	 */
	_updateWidgetContextContainer: function() {
		this.m_oWidgetContextContainer = {};
		var values = null;
		if (this.m_oDrillGenericContext[this.PP_VALUES]) {
			values = dojo.mixin( values, this.m_oDrillGenericContext[this.PP_VALUES] );
		}
		if (this.m_oPromptGenericContext[this.PP_VALUES]) {
			values = dojo.mixin( values, this.m_oPromptGenericContext[this.PP_VALUES] );
		}		
		if (this.m_oFilterGenericContext[this.PP_VALUES]) {
			values = dojo.mixin( values, this.m_oFilterGenericContext[this.PP_VALUES] );
		}
		if (this.m_oSelectionFilterContext[this.PP_VALUES]) {
			values = dojo.mixin( values, this.m_oSelectionFilterContext[this.PP_VALUES] );
		}
		
		if (values) {
			this.m_oWidgetContextContainer[this.PP_VALUES] = values;
		}
		
		var ranges = null;
		if (this.m_oPromptGenericContext[this.PP_RANGES]) {
			ranges = dojo.mixin( ranges, this.m_oPromptGenericContext[this.PP_RANGES] );
		}
		if (this.m_oFilterGenericContext[this.PP_RANGES]) {
			ranges = dojo.mixin( ranges, this.m_oFilterGenericContext[this.PP_RANGES] );
		}
		
		if (ranges) {
			this.m_oWidgetContextContainer[this.PP_RANGES] = ranges;
		}

	},
	
	/**
	 * Updates the prompt generic context and the widget context.
	 */
	_updatePromptGenericContext : function(payload) {		
		if ( payload[this.PP_WIDGET_CONTEXT] ) {
			 this.m_oPromptGenericContext = payload[this.PP_WIDGET_CONTEXT]; 
		}
	},
	
	_updatePromptContextContainer: function(payload) {				
		if (payload[this.PP_REPORT_PROMPT_CONTEXT] && payload[this.PP_REPORT_PROMPT_CONTEXT][this.PP_PROMPT]) {
			this.m_oPromptContextContainer = payload[this.PP_REPORT_PROMPT_CONTEXT][this.PP_PROMPT];
		}
	},
	
	/*
	 * returns generalized form of prompt payload
	 * 
	 */
	_buildGeneralizedPromptPayload: function(sSharedPrompts, aServerRequestEnvParams, sActionParam, sModelPath,clearCascadePromptParams) {
		var payload = null;
		
		this._resetWorkingMembers();
		
		
		var bResult = this._buildContextsFromPrompt(sSharedPrompts, aServerRequestEnvParams);
		if (bResult) {
			payload = {};
			payload[this.PP_WIDGET_CONTEXT] = this.m_oWidgetContextObject;
			
			var oItemSpecObject = {};
			oItemSpecObject[sModelPath]= this.m_oPromptContextObject;
			
			payload[this.PP_REPORT_PROMPT_CONTEXT] = {
					"prompt": {
						"id": this.m_widget.iContext.widgetId,
						"action": sActionParam,
						"itemSpecification": oItemSpecObject
					}
			};
			payload[this.PP_CASCADEPROMPT_CLEAR]=clearCascadePromptParams;
		}
		
		return payload; 
	},
	
	_getReportParameterNodes: function(sSharedPrompts) {
		
		var xmlDom = XMLBuilderLoadXMLFromString(sSharedPrompts);
		if (!xmlDom) {
			return null;
		}
		var cvTransientSpec = xmlDom.firstChild;
		if (!cvTransientSpec) {
			return null;
		}
		var reportParameters = XMLHelper_FindChildByTagName( cvTransientSpec, "reportParameters", true);
		if (!reportParameters) {
			return null;
		}			
		var reportParameterNodes = XMLHelper_FindChildrenByTagName( reportParameters, "reportParameter", false);
		if (!reportParameterNodes) {
			return null;
		}
		return reportParameterNodes;
	},
	
	_getSelectChoicesXMLString : function(sName, aServerRequestEnvParams) {
		
		var sSelectChoicesXML = null;
		var sp_ParameterName = 'p_' + sName;
		if( aServerRequestEnvParams.get(sp_ParameterName )) {
			sSelectChoicesXML = aServerRequestEnvParams.get(sp_ParameterName);
		}
		return sSelectChoicesXML;
	},
	
	_getSelectChoicesNode : function(sSelectChoicesXML) {
		
		var nNode = null;
		if( sSelectChoicesXML) {
			var xmlDom = XMLBuilderLoadXMLFromString(sSelectChoicesXML, true);
			if (xmlDom && xmlDom.firstChild) {
				nNode = xmlDom.firstChild;
			}
		}
		return nNode;
	},
	
	/*
	 * Main processor for prompt, handles ranges and single/multi-selects
	 *
	 */
	_buildContextsFromPrompt: function(sSharedPrompts, aServerRequestEnvParams) {
		
		var reportParameterNodes = this._getReportParameterNodes(sSharedPrompts);
		if (reportParameterNodes===null) {
			return false;
		}
		
		for ( var i in reportParameterNodes )
		{
			var reportParameterNode = reportParameterNodes[i];			
			var sName = reportParameterNode.getAttribute( "parameterName");			
			var sSelectChoicesXML = this._getSelectChoicesXMLString(sName, aServerRequestEnvParams);
			var nSelectChoicesNode = this._getSelectChoicesNode(sSelectChoicesXML);
			
			if (nSelectChoicesNode) {
				var oPromptDetailObject, aValue, sValuesOrRanges;
				
				if (!this._isPromptRangeType(sSelectChoicesXML)) {
					
					var aPromptContextValues = this._buildReportContextValuesFromPromptSelectOption(nSelectChoicesNode);
					oPromptDetailObject = this._createPromptDetailObject(sSelectChoicesXML, reportParameterNode.getAttribute( "modelItem"), reportParameterNode.getAttribute( "multivalued"), aPromptContextValues);						
					aValue = this._buildValuesArrayFromReportContextValueArray(aPromptContextValues);
					sValuesOrRanges = this.PP_VALUES;
				} else { // Range type
					aValue = this._buildMinMaxArrayFromRangePrompt(nSelectChoicesNode);
					oPromptDetailObject = this._createPromptDetailObject(sSelectChoicesXML, reportParameterNode.getAttribute( "modelItem"), reportParameterNode.getAttribute( "multivalued"), aValue);						
					sValuesOrRanges = this.PP_RANGES;
				}
				
				//Working area for Prompt Context
				this.m_oPromptContextObject[sName] = oPromptDetailObject;
				
				//Working area for Widget Context Values or Ranges
				if(!this.m_oWidgetContextObject[sValuesOrRanges]) {
					this.m_oWidgetContextObject[sValuesOrRanges] = {};
				};
				this.m_oWidgetContextObject[sValuesOrRanges][sName] = aValue;									
				
			}
		}

		return true;
	},
	
	_createPromptDetailObject: function (sSelectChoicesXML, sModelItem, multivalued, aPromptContextValues) {
		
		var oPromptDetail = {};
				
		oPromptDetail[this.PP_SELECT_CHOICES] = sSelectChoicesXML;
		if (sModelItem !== null) {
			oPromptDetail[this.PP_MODELITEM] = sModelItem;
		}
		if (multivalued !== null) {
			oPromptDetail[this.PP_MULTIVALUED] = true;
		}
		oPromptDetail[this.PP_VALUES] = aPromptContextValues;
		
		return oPromptDetail;
	},
	
	_isPromptRangeType: function(sSelectChoicesXML) {
		var regExp = new RegExp(/^<selectChoices><select[\s\S]*Range/);  
		
		return regExp.test(sSelectChoicesXML);
	},
	
	/*
	 * returns an array which contains below objects. the array is values of 'values' property of an item in Report Context 
	 {
               [
                  {
                     "caption":"2004",
                     "mun":"[Great Outdoors Company].[Years].[Year]->:PC].[@MEMBER].[20040101-20041231]"
                  },
                  {
                     "caption":"2005",
                     "mun":"[Great Outdoors Company].[Years].[Year]->:PC].[@MEMBER].[20050101-20051231]"
                  }
               ]
	 }
	 */
	_buildReportContextValuesFromPromptSelectOption: function (nSelectChoices) {
		var aValues = [];
		if(nSelectChoices) {
			var nodeList = dojo.query("selectOption[displayValue]", nSelectChoices);
			if (nodeList.length > 0) {
				for (var i = 0; i < nodeList.length; i++) {
					var caption = nodeList[i].getAttribute("displayValue");
					var useValue = nodeList[i].getAttribute("useValue");
					
					var value = {"caption": caption, "use": useValue};
					aValues.push(value);
				}
			}
		}
		return aValues;
	},
	
	/*
	 * returns an array which contains value of caption property from Report Context Values array
	 {
	 	[
	 		"2004",
	 		"2005"
	 	]
	 }
	 */
	_buildValuesArrayFromReportContextValueArray: function (aReportContextValues) {
		var aWidgetContextValues = [];
		
		if (aReportContextValues && aReportContextValues.length>0) {
			for( var i=0; i<aReportContextValues.length; i++) {
				var caption = aReportContextValues[i].caption;
				if (caption) {
					aWidgetContextValues.push(caption);
				}
			}
		}
		return aWidgetContextValues;
	},
	
	/**
	 * returns json object if input include select<any>Range node. 
	 				[
	 					{ "min: 123.45, 
	 					  "minDisplay": "$123.45",
	 					  "max": 999.99, 
	 					  "maxDisplay": "$999.99" }
	 					},
	 					{ "min: 1123.45, 
	 					  "minDisplay": "$1,123.45",
	 					  "max": 9599.99, 
	 					  "maxDisplay": "$9,599.99"
	 					}	 			             		
	 				]
	 * 
	 * 
	 * 
	 * @param {node} nSelectBoundRange is a node which may include selectBoundRange child.
	 * examples, 
	 *  "<selectChoices><selectBoundRange selected=\"true\"><start useValue=\"Camping\" displayValue=\"Camping\"/><end useValue=\"Golf\" displayValue=\"Golf\"/></selectBoundRange></selectChoices>";
	 * <selectChoices><selectUnboundedEndRange selected="true"><start useValue="2004-07-12T00:00:00.000" displayValue="Jul 12, 2004"/></selectUnboundedEndRange></selectChoices>
	 * <selectChoices><selectUnboundedStartRange selected="true"><end useValue="2011-07-11T23:59:59.999" displayValue="Jul 11, 2011"/></selectUnboundedStartRange></selectChoices>  
	 */
	_buildMinMaxArrayFromRangePrompt: function (nSelectChoices) {
		var aRanges = [];
				
		if (nSelectChoices && nSelectChoices.childNodes && nSelectChoices.childNodes.length>0) {
			var length = nSelectChoices.childNodes.length;
			for (var i=0; i<length; i++ ) {
				var oMinMax = this._buildMinMaxFromSelectAnyRange(nSelectChoices.childNodes[i] );
	
				if (oMinMax) {
					aRanges.push(oMinMax);
				}
			}
		}
		return aRanges;
	},
		
	/**
	 * returns  
	 					{ "min:" 123.45, 
	 					  "minDisplay": "$123.45",
	 					  "max": 999.99, 
	 					  "maxDisplay": "$999.99" }
	 					}
	 *
	 */
	_buildMinMaxFromSelectAnyRange: function (nRangeNode) {
		
		var oMinMax = null;
		if(nRangeNode) {
				var nodeList = dojo.query("[displayValue]", nRangeNode);
				if (nodeList.length > 0) {
					oMinMax = {};
					for (var i = 0; i < nodeList.length; i++) {
						var node = nodeList[i];
						var sPropertyName = (node.nodeName === "start") ? "min" : "max";
						
						oMinMax[sPropertyName] = node.getAttribute("useValue");
						oMinMax[ sPropertyName + 'Display' ] = node.getAttribute("displayValue");
					}
				}
		}
		return oMinMax;
	},
	
	
	/*
	 * handling incoming prompt event with generalized payload. 
	 */
	handleIncomingPromptEvent: function(evt) {
		if (!evt || !evt.payload) {
			return;
		}
		
		var oLegacyPayload = this._convertToLegacyPromptPayload(evt.payload);
		if (oLegacyPayload) {
			var oNewEvt =  {"payload": oLegacyPayload};

			this.m_widget.onPromptLegacyPayload(oNewEvt);
		}
	},
	
	/*
	 * return prompt payload that is pre-generic event.
	 */
	_convertToLegacyPromptPayload: function (oGeneralizedPayload) {
		var oPayload = null;
		
		var oPromptContext = oGeneralizedPayload[this.PP_REPORT_PROMPT_CONTEXT];
		
		if (oPromptContext && oPromptContext.prompt ) {
			oPromptContext = oPromptContext.prompt;
			oPayload = {};
			oPayload.cv_id = oPromptContext.id;
			oPayload.parameters = this._genLegacyPromptParameterArrayFromItemSpec(oPromptContext.itemSpecification);
			oPayload.clearCascadePromptParams = oGeneralizedPayload[this.PP_CASCADEPROMPT_CLEAR];
		}
		else if (oGeneralizedPayload[this.PP_WIDGET_CONTEXT] && oGeneralizedPayload[this.PP_WIDGET_CONTEXT].values) {
			// Handle simple name/value pairs
			oPayload = {};
			oPayload.parameters = [];
			var paramValues = oGeneralizedPayload[this.PP_WIDGET_CONTEXT].values;
			for (var param in paramValues) {
				var paramValue = paramValues[param];
				if (paramValue && paramValue.length > 0) {
					// We already have a selectChoices
					if (paramValue.length == 1 && paramValue[0].indexOf("<selectChoices>") === 0) {
						oPayload.parameters.push({"parmName" : param, "parmValue" : paramValue[0]});
					}
					else {
						// We have simple values, build a select choices out of them
						var selectChoice = "<selectChoices>";
						for (var i=0; i < paramValue.length; i++) {
							selectChoice += "<selectOption useValue=\"" + paramValue[i] + "\" displayValue=\"" + paramValue[i] + "\"/>";
						}
						selectChoice += "</selectChoices>";
						oPayload.parameters.push({"parmName" : param, "parmValue" : selectChoice});
					}
				}
			}
			oPayload.clearCascadePromptParams = oGeneralizedPayload[this.PP_CASCADEPROMPT_CLEAR];			
		}
		return oPayload;
	},

	/*
	 * 
				var paramAttributes = {
					parmName: sParameterName,
					parmValue: decodeURIComponent(this.m_oServerRequest.m_oParams[ sp_ParameterName ]),
					modelItem: sModelItem,
					multivalued: true //optional
				};
	 
	 */
	_genLegacyPromptParameterArrayFromItemSpec: function (oSpec) {
		if (!oSpec) {
			return null;
		}
		
		var oItemObject = this._getFirstPropertyOfObject(oSpec);
		var aParameters = [];
		for(var sName in oItemObject) {
			
			var oDetail = oItemObject[sName];
			
			var paramAttributes = {
					parmName: sName,
					parmValue: oDetail[this.PP_SELECT_CHOICES],
					modelItem: oDetail[this.PP_MODELITEM]
				};
				if ( oDetail[this.PP_MULTIVALUES] !== null ) {
					paramAttributes.multivalued = true;
				}
				
			aParameters.push( paramAttributes );			
		}
		return aParameters;
	},
	
	/*
	 * return true if min or max property is present on the object passed.
	 * 
	 */
	_isRangeTypeValues: function (oValues) {
		
		if (oValues) {
			if (oValues.min || oValues.max) {
				return true;
			}
		}
		return false;
	},

	
	_getFirstPropertyOfObject: function (oSpec) {
		
		var oItemObject = null;
		for(var sProperty in oSpec) {
			oItemObject = oSpec[sProperty];
			break;
		}
		return oItemObject;
	},
	
	_getFirstPropertyNameOfObject: function (oSpec) {
		
		var sName = null;
		for(var sProperty in oSpec) {
			sName = sProperty;
			break;
		}
		return sName;
	},
	
	/*
	 * returns object with widge context part in it
	 */
	extractWidgetContextObject: function(oGeneralizedPayload) {
		
		if (oGeneralizedPayload) {
			var oCommon = oGeneralizedPayload[this.PP_WIDGET_CONTEXT];
			if (oCommon) {
				var obj = {};
				obj[this.PP_WIDGET_CONTEXT] = oCommon;
				return obj;
			}
		}
		return null;		
	},

	/*
	 * This function is to support Active Report onDrop and filtering interactions with other widgets. 
	 * 
	 * Returns generic payload object that includes superset of name value pairs in m_oContextCollection  
	 */
	genMergedWidgetContextObject: function() {
		
		var oMergedValuesObj = null;
		var oMergedRangesObj = null;
		for (var key in this.m_oContextCollection) {
			var oGeneralizedPayload = this.m_oContextCollection[key];
			if (oGeneralizedPayload) {
				var oCommon = oGeneralizedPayload[this.PP_WIDGET_CONTEXT];
				if (oCommon) {
					if (oCommon[this.PP_VALUES]) {
						oMergedValuesObj = dojo.mixin(oMergedValuesObj, oCommon[this.PP_VALUES]);
					}
					if (oCommon[this.PP_RANGES]) {
						oMergedRangesObj = dojo.mixin(oMergedRangesObj, this._convertRangeArrayToObjectForActiveReport(oCommon[this.PP_RANGES]) );
					}
				}
			}
		}
		
		if (oMergedValuesObj || oMergedRangesObj) {
			var obj = {};
			obj[this.PP_WIDGET_CONTEXT] = {};
			
			if (oMergedValuesObj) {
				obj[this.PP_WIDGET_CONTEXT][this.PP_VALUES] = oMergedValuesObj;
			}
			
			if (oMergedRangesObj) {
				obj[this.PP_WIDGET_CONTEXT][this.PP_RANGES] = oMergedRangesObj;
			}
			return obj;
		}
		
		return null;
	},
	
	/*
	 * publish drill event with generic payload
	 * 
	 */
	raiseDrillEvent: function(aDrillSpecObjects, sActionParam, sModelPath) {
		
		var oGeneralizedPayload = this._buildGeneralizedDrillPayload(aDrillSpecObjects, sActionParam, sModelPath);
		if (oGeneralizedPayload) {
			this.m_widget.fireEvent(this.EVENT_NAME_DRILL, null, oGeneralizedPayload);
			this._updateDrillContext( oGeneralizedPayload );
			this._updateWidgetContextContainer();
		}
	},
	
	_updateDrillContext : function( payload ) {
		this._updateDrillGenericContext( payload );
		this._updateDrillContextContainer( payload );
	},
	
	_updateDrillGenericContext : function( payload ) {
		if (payload[this.PP_WIDGET_CONTEXT]) {
			this.m_oDrillGenericContext = payload[this.PP_WIDGET_CONTEXT];
		}
	},
	
	_updateDrillContextContainer : function( payload ) {
		
		if (payload[this.PP_REPORT_DRILL_CONTEXT] && payload[this.PP_REPORT_DRILL_CONTEXT][this.PP_DRILL]) {
			this.m_oDrillContextContainer = payload[this.PP_REPORT_DRILL_CONTEXT][this.PP_DRILL];
		}
	},

	/*
	 * 
		oDrillSpecObject = {
				"dataItem": "", 
				"mun":  "",
				"lun":  "",
				"hun": "",
				"displayValue": "",
				"summary": ""
		};
	 
	 */
	_buildGeneralizedDrillPayload: function(aDrillSpecObjects, sActionParam, sModelPath) {
		if(!aDrillSpecObjects || !sActionParam) {
			return null;
		}

		var oDrillContextValuesObject = {};
		var oWidgetContextValuesObject = {};
		
		for(var i in aDrillSpecObjects) {
			var oDrillSpec = aDrillSpecObjects[i];
			
			var mun = (oDrillSpec.mun)? oDrillSpec.mun: "";
			var lun = (oDrillSpec.lun)? oDrillSpec.lun: "";
			var hun = (oDrillSpec.hun)? oDrillSpec.hun: "";
			
			var oDrillParamObject = {};			
			oDrillParamObject[this.PP_VALUES] = [{
					"caption": oDrillSpec.displayValue,
					"mun": mun,
					"lun": lun,
					"hun": hun 
				}];
			if(oDrillSpec.summary) {
				oDrillParamObject["summary"] = oDrillSpec.summary;  
			}
		
			oDrillContextValuesObject[oDrillSpec.dataItem] = oDrillParamObject;			
			oWidgetContextValuesObject[oDrillSpec.dataItem] = [oDrillSpec.displayValue];
		}		
		
		var oWidgetContextObject = {};
		oWidgetContextObject[this.PP_VALUES] = oWidgetContextValuesObject;
		
		var oItemSpecObject = {};
		oItemSpecObject[sModelPath]= oDrillContextValuesObject;
		
		var oDrillContextObject = {};
		oDrillContextObject[sActionParam] = {
					"id": this.m_widget.iContext.widgetId,
					"action": sActionParam,
					"itemSpecification": oItemSpecObject
				}; 
		
		var payload = {};
		payload[this.PP_WIDGET_CONTEXT] = oWidgetContextObject;
		payload[this.PP_REPORT_DRILL_CONTEXT] = oDrillContextObject;
		

		return payload;
	},
	
	/*
	 * returns array of DrillSpec objects which are built from genenric drill payload
	 */
	genDrillSpecObjects: function(oPayload) {
		if(!oPayload || !oPayload[this.PP_REPORT_DRILL_CONTEXT]) {
			return null;
		}

		var aDrillSpecObjects = []; 		
		var oDrillContextObject = oPayload[this.PP_REPORT_DRILL_CONTEXT];
		var oDrillUpOrDown = this._getFirstPropertyOfObject(oDrillContextObject);
		var oItemSpecObject = this._getFirstPropertyOfObject(oDrillUpOrDown.itemSpecification);
				
		for(var sName in oItemSpecObject) {
			var oDrillParamObject = oItemSpecObject[sName];
			var aValues = oDrillParamObject[this.PP_VALUES]; 
			if (aValues && aValues.length>0) {
				var oValue = aValues[0];
				var oDrillSpecObject = {
						"dataItem": sName,
						"displayValue": oValue.caption,
						"mun": oValue.mun,
						"lun": oValue.lun,
						"hun": oValue.hun 				
				};
				if(oValue.summary) {
					oDrillSpecObject["summary"] = oValue.summary;  
				}
				
				aDrillSpecObjects.push(oDrillSpecObject);
				
			}
		}		
				
		return (aDrillSpecObjects.length>0)? aDrillSpecObjects : null;
	}, 
	
	getDrillActionType: function(oPayload) {
		
		if(!oPayload || !oPayload[this.PP_REPORT_DRILL_CONTEXT]) {
			return null;
		}
		
		return this._getFirstPropertyNameOfObject(oPayload[this.PP_REPORT_DRILL_CONTEXT]);
	}, 
	
	/*
	 * An object not array is expected as Range value type in Active Report. 
	 * However in generic payload, the value is an array to support multimple range values. 
	 * 
	 * This function is to convert array range value to object. 
	 * The value in the array is in used.
	 * 
	 */
	_convertRangeArrayToObjectForActiveReport: function(oRanges) {
		
		if (oRanges) {
			var newRanges = {};
			for (var name in oRanges) {
				var value = oRanges[name];
				if (value && value.length>0) {
					//Pass first item because Active report takes only one range input. 
					newRanges[name] = value[0];	
				} else {
					newRanges[name] = value;
				}
			}
			
			return newRanges;
		}
		return oRanges;
	},
	
	/*
	 * returns value of 
	 * 		"com.ibm.widget.context.bux.selectValueControl"/"selectValueControl"/"itemSpecification"
	 */
	getItemsInItemSpecification: function( payload ) {
		var selectValueControlContext = payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT];
		if (selectValueControlContext && selectValueControlContext["selectValueControl"] && 
			selectValueControlContext["selectValueControl"]["itemSpecification"]) {
			return this._getFirstPropertyOfObject(selectValueControlContext["selectValueControl"]["itemSpecification"])
		}
		return null;
	},
	
	/*
	 * return clearComment payload of discrete type SelectValueControl 
	 * 		"com.ibm.widget.context.bux.selectValueControl"/"selectValueControl"/"itemSpecification"
	 * 
	 * @param widgetId: widgetId of control
	 */
	genRemoveDiscreteFilterPayload: function(widgetId) {
		var payload = {
			"clientId": widgetId,
			"com.ibm.widget.context": {
				},
			"com.ibm.widget.context.bux.selectValueControl":{
				"selectValueControl":{
					"id":widgetId,
					"controlType":"selectValueFilter",
					"type":"discrete",
					"valueType":"string"
				}
			}
		};
		
		return payload;
	},
	
	/**
	 * Creates an empty selection payload
	 */
	genEmptySelectionPayload: function(oCV, sWidgetId) {
		var obj = {
			"clientId":sWidgetId,
			"com.ibm.widget.context": {},
			"com.ibm.widget.context.bux.selection":{
				"selection":{
					"id":sWidgetId,
					"valueType":"string"
				}
			}
		};

		this.m_oSelectionFilterContext = {};
		this._updateWidgetContextContainer();
		this.setSelectionFilterObjects(null);

		return obj;
	},
	

	/*
	 * returns generic selection payload with current selection objects
	 * 
	 */
	genSelectionPayload: function(oCV, sWidgetId, bExcludeContext ) {
		
		var valuesObj = {};
		var selectionObj = {
				"id":sWidgetId,
				"valueType":"string"
		};
		var obj = {
			"clientId":sWidgetId,
			"com.ibm.widget.context": valuesObj,
			"com.ibm.widget.context.bux.selection":{
				"selection":selectionObj
			}
		};
		
		var foundData = false;
		var aSelectionFilterObjects = [];
		var oSC = oCV.getSelectionController();
		var aSelectedObjects = oSC.getAllSelectedObjects();
		if ( aSelectedObjects && aSelectedObjects.length >0 ) {
			var oUniqueCtxs = {};
			var ctxString = null;
			var nameValueObject = {};
			var itemSpecModelObj = {}
			for (var i=0; i < aSelectedObjects.length; i++) {
				if (aSelectedObjects[i].populateSelectionPayload(nameValueObject, itemSpecModelObj, bExcludeContext) ){
					foundData = true;
					
					ctxString = aSelectedObjects[i].getCtxAttributeString();
					if (typeof oUniqueCtxs[ctxString] == 'undefined') {
						oUniqueCtxs[ctxString] = true;
						aSelectionFilterObjects.push(aSelectedObjects[i].marshal(oSC, oCV.getId()));
					}
				}
			}
	
			if (foundData) {
				valuesObj.values = nameValueObject;
				
				var itemSpecObj = {};
				var modelPath = oCV.getModelPath();
				var modelPathName = (modelPath)? modelPath : ".";
				itemSpecObj[modelPathName] = itemSpecModelObj;
				
				selectionObj.itemSpecification = itemSpecObj;
			}
		}

		this.m_oSelectionFilterContext = obj[this.PP_WIDGET_CONTEXT];
		this._updateWidgetContextContainer();

		this.setSelectionFilterObjects( aSelectionFilterObjects.length>0? aSelectionFilterObjects : null);
		
		return obj;
	},
	
	isSelectionPayloadForReset: function(obj) {
		
		if (obj  && obj[this.PP_WIDGET_CONTEXT]) {
			return this.isEmptyObject(obj[this.PP_WIDGET_CONTEXT]);
		}
		return true;
	},

	setSelectionFilterObjects: function(aSelectionFilterObjects) {
		this.m_aSelectionFilterObjects = aSelectionFilterObjects;
	},	
	getSelectionFilterObjects: function() {
		return this.m_aSelectionFilterObjects;
	},	
	toStringSelectionFilterObjects: function() {
		var str = "";
		for( var idx in this.m_aSelectionFilterObjects) {
			if (str.length>0) {
				str += ",";
			}
			str += JSON.stringify(this.m_aSelectionFilterObjects[idx]);
		}
		return "[" + str +"]";
	},
	
	convertSelectionToSelectValueControlPayload: function(oSelectionPayload) {
		

		if (oSelectionPayload["com.ibm.widget.context.bux.selection"]) {
			
			//add controlType and type
			var selectionObj = oSelectionPayload["com.ibm.widget.context.bux.selection"]["selection"];
			selectionObj.controlType = "selectValueFilter";
			selectionObj.type = "discrete";
			
			//copy to selectionValueControl
			oSelectionPayload["com.ibm.widget.context.bux.selectValueControl"] = {"selectValueControl": selectionObj};
			
			delete  oSelectionPayload["com.ibm.widget.context.bux.selection"];
		}
		
		return oSelectionPayload;
	},
	
	/**
	 * If we receive a generic event, build up a selectValueControl payload so the rest 
	 * of our javascript doesn't know the difference
	 */
	convertGenericToSelectValueControlPayload: function(payload) {
		if (this._hasItemSpecification(payload) ) {
			return;
		}
		
		//Remove names without values
		if(payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES]) {
			var contextObject = payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES];
			
			//Delete the name with empty array value so that the name filter gets removed.
			for(dataItem in contextObject) {
				if (contextObject[dataItem].length == 0) {
					delete contextObject[dataItem];
				}
			}
			
			//If contextObject is empty, remove it
			var bEmpty = true;
			for(dataItem in contextObject) {
				bEmpty = false;
				break;
			}
			if (bEmpty) {
				delete payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES];
			}
		};
		
		if(payload[this.PP_WIDGET_CONTEXT][this.PP_RANGES]) {
			var contextObject = payload[this.PP_WIDGET_CONTEXT][this.PP_RANGES];
			
			//If contextObject is empty, remove it
			var bEmpty = true;
			for(dataItem in contextObject) {
				bEmpty = false;
				break;
			}
			if (bEmpty) {
				delete payload[this.PP_WIDGET_CONTEXT][this.PP_RANGES];
			}
		}
		
		var contextObject = null;
		if(payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES]) {
			key = this.PP_VALUES;
			contextObject = payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES];
		} 
		else {
			key = this.PP_RANGES;
			contextObject = payload[this.PP_WIDGET_CONTEXT][this.PP_RANGES];
		}
		
		var cv = this.m_widget.getViewerObject();
		var dataManager = null;
		if (cv) {
			var sc = cv.getSelectionController();
			dataManager = sc.getCCDManager();
		}
		
		for(dataItem in contextObject) {
			var foundAllMuns = true;
			var itemValues = {};
			
			for (var modelItem in contextObject) {
				var values = [];
				for (var i=0; i < contextObject[modelItem].length; i++) {
					var useValue = contextObject[modelItem][i];
					var value = {"caption" : useValue};
					
					// We need all the MUNs or none at all. So keep getting them as long as we've all the needed ones so far
					if (foundAllMuns) {
						var mun = dataManager ? dataManager.getMUNForRDIAndUseValue(modelItem, useValue) : null;
						if (mun != null) {
							value.mun = mun;
						}
						else {
							// We didn't find the MUN in our cotext information, loop through the array of
							// values we've built so far and delete the MUN information
							foundAllMuns = false;
							for (var i=0; i < values.length; i++) {
								delete values[i].mun;
							}
						}
					}
					
					values.push(value);
				}
				
				itemValues[modelItem] = {"values" : values};
			}

			var itemSpecification = {};
			var modelPath = cv ? cv.getModelPath() : null;
			var modelPathName = (modelPath) ? modelPath : "unknown";

			itemSpecification[modelPathName] = itemValues;
			
			payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT] = {
					"selectValueControl" : {
						"valueType":"string",
						"type":"discrete",
						"controlType": "selectValueFilter",
						"id" : payload.clientId ? payload.clientId : "",
						"itemSpecification" : itemSpecification
					}
			};
		}		
	},
	
	/*
	 * returns MUN of the first value of the itemName in itemSpecification/package_name
	 * 
	 * @param payload
	 * @param itemName the itemName MUN it is looking for 
	 * 
	 */
	getMUNOfItemValueInItemSpecification: function( payload, itemName ) {
		var oPackage = this.getItemsInItemSpecification(payload)
		
		if (oPackage && oPackage[itemName]) {
			var oItem = oPackage[itemName];
			if( oItem.values && oItem.values.length>0) {
				return oItem.values[0].mun;
			}
		}
		return null;
	},
	
	_hasItemSpecification: function(payload) {
		
		if (payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT] && 
			payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT]["selectValueControl"] && 
			payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT]["selectValueControl"]["itemSpecification"] ) {
			return true;
		}
		if (payload[this.PP_BUX_SELECTION_CONTEXT] && 
			payload[this.PP_BUX_SELECTION_CONTEXT]["selection"] && 
			payload[this.PP_BUX_SELECTION_CONTEXT]["selection"]["itemSpecification"] ) {
			return true;
		}
		
		return false;
	},
	
	getSourceUniqueId: function(payload, actionNameOverride) {
		var id = null;
		var action = null;
		if (payload["clientId"]) {
			id = payload["clientId"];
		}
		
		if (payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT]) {
			action = "selectValueControl";
			if (!id && payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT]["selectValueControl"] && payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT]["selectValueControl"]["id"] ) {
				id = payload[this.PP_BUX_SELECTVALUECONTROL_CONTEXT]["selectValueControl"]["id"];
			}
		} else
		if (payload[this.PP_BUX_SELECTION_CONTEXT]) {
			action = "selection";
			if (!id && payload[this.PP_BUX_SELECTION_CONTEXT]["selection"] && payload[this.PP_BUX_SELECTION_CONTEXT]["selection"]["id"] ) {
				id = payload[this.PP_BUX_SELECTION_CONTEXT]["selection"]["id"];
			}
		} else
		if (payload[this.PP_REPORT_PROMPT_CONTEXT] ) {
			action = "prompt";
			if (!id && payload[this.PP_REPORT_PROMPT_CONTEXT]["prompt"] && payload[this.PP_REPORT_PROMPT_CONTEXT]["prompt"]["id"] ) {
				id = payload[this.PP_REPORT_PROMPT_CONTEXT]["prompt"]["id"];
			}
		} else 
		if (payload[this.PP_REPORT_DRILL_CONTEXT]) {
			action = "drill";
			if (!id && payload[this.PP_REPORT_DRILL_CONTEXT]["DrillUp"] && payload[this.PP_REPORT_DRILL_CONTEXT]["DrillUp"]["id"] ) {
				id = payload[this.PP_REPORT_DRILL_CONTEXT]["DrillUp"]["id"];
			}
		} else 
		if (payload[this.PP_REPORT_DRILL_CONTEXT]) {
			action = "drill";
			if (!id && payload[this.PP_REPORT_DRILL_CONTEXT]["DrillDown"] &&payload[this.PP_REPORT_DRILL_CONTEXT]["DrillDown"]["id"] ) {
				id = payload[this.PP_REPORT_DRILL_CONTEXT]["DrillDown"]["id"];
			}
		}
		
		if(!id) {
			id = "unknown";
		}
		if(!action) { 
			action = "unknown";
		}
		
		if(typeof actionNameOverride == "string") {
			action = actionNameOverride;
		}
		return id + "_" + action;
	},
	
	/**
	 * returns true 
	 * if payload has no 'com.ibm.widget.context' field or the field is empty object, or
	 * if the'com.ibm.widget.context' field has no 'values' or 'ranges' field 
	 */
	isWidgetContextEmpty: function(payload) {
		return ( this.isEmptyObject(payload[this.PP_WIDGET_CONTEXT]) ||
			(this.isEmptyObject(payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES]) && 
			 this.isEmptyObject(payload[this.PP_WIDGET_CONTEXT][this.PP_RANGES])) 
		);
	},
	
	isEmptyObject: function(obj) {
		
		var bEmpty = true;
		if (obj) {
			for(var field in obj) {
				bEmpty = false;
				break;
			}
		}
		return bEmpty;
	},
	
	updateContextCollection: function(payload) {

		if (!this.isEmptyObject(payload)) {
			var uniqueId = this.getSourceUniqueId(payload);
			if (this.isWidgetContextEmpty(payload)) {
				if (this.m_oContextCollection[uniqueId]) {
					this.setEmptyArrayToWidgetContextValues(this.m_oContextCollection[uniqueId]);
				} else {
					var onDropId = this.getSourceUniqueId(payload, "unknown");
					if (this.m_oContextCollection[onDropId]) {
						this.setEmptyArrayToWidgetContextValues(this.m_oContextCollection[onDropId]);
					}
				}
			} else {
				if (payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES]) {
					//Delete filters on same data item from other widgets
					for (var name in  payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES]) {
						for( var key in this.m_oContextCollection) {
							var otherFilter = this.m_oContextCollection[key];
							if (otherFilter[this.PP_WIDGET_CONTEXT][this.PP_VALUES] &&
								otherFilter[this.PP_WIDGET_CONTEXT][this.PP_VALUES][name]) {
								delete otherFilter[this.PP_WIDGET_CONTEXT][this.PP_VALUES][name];
							}
						}
					}
				}
				this.m_oContextCollection[uniqueId] = dojo.clone(payload);
			}
			return this.m_oContextCollection;
		}		
	}, 
	
	/*
	 * Set value to empty string. Can't delete the name because the name must be passed to Active report.
	 */
	setEmptyArrayToWidgetContextValues: function(payload) {
		if(payload && payload[this.PP_WIDGET_CONTEXT] && payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES] ) {
			var oNameValuePairs = payload[this.PP_WIDGET_CONTEXT][this.PP_VALUES];
			for(var name in oNameValuePairs) {
				oNameValuePairs[name] = [];
			}
		}
	}
	
});
