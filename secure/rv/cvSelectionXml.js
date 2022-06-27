/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 /*------------------------------------------------------------------------------------------
				Object model for the selection context information

	CSelectionXml = {
		queries: {
			<query_name>: {	<!! SC_SingleQuery !!>
				selections: [
					{	<!! SC_SingleSelection !!>
						rows:		[{},...],
						cols:		[{},...],
						measures:	[{},...],
						sections:	[{},...],
						layoutElementId: <string>
					},
					...
				],
				slicers: [	{	<!! SC_SingleSlicer !!>	},... ],
				filters: {
					detailFilters:	[	{	<!! SC_SingleDetailFilter !!>	},... ],
					summaryFilters: [	{	<!! SC_SingleSummaryFilter !!>	},... ]
				}
			},
			...
		},
		burstContext: {
			//TODO
		}
	}
------------------------------------------------------------------------------------------*/

function CSelectionXml(burstID, contentLocale, expressionLocale) {
	this.queries = {};

	this.burstContext = burstID || "";
	this.expressionLocale = contentLocale || "";
	this.contentLocale = expressionLocale || "";
}

///////////////////////////////////////////////////////////////
// NOTE: shallow functions for defining structure. They'll be
// treated as Objects within CSelectionXml.
//  i.e., they're not expected to do self-serialization
///////////////////////////////////////////////////////////////
function SC_SingleSelection() {
	this.rows = [];
	this.cols = [];
	this.sections = [];
	this.measures = [];
	this.layoutElementId = "";
}
function SC_SingleQuery() {
	this.selections = [];
	this.slicers = [];
	this.filters = [];
}
function SC_SingleSlicer() {}
function SC_SingleDetailFilter() {}
function SC_SingleSummaryFilter() {}


////////////////////////////////////////////////////////////

CSelectionXml.prototype.BuildSelectionFromController = function(sc) {
	if (sc) {
		var selectedObjects = sc.getAllSelectedObjects();
		for(var s = 0; s < selectedObjects.length; ++s) {
			var selection = selectedObjects[s];
			var selectionCtx = selection.getSelectedContextIds();
			var muns = selection.getMuns();
			var munCount = muns.length;

			var singleSelection = new SC_SingleSelection();
			singleSelection.layoutElementId = selection.getLayoutElementId();
			var sQuery = null;

			/********
			To make this more generic in the future, all measure-oriented checks will need to be removed.
			We should need to support member-only context, and other permutations.
			********/
			for(var i = 0; i < munCount; ++i) {
				var j, ctxId, displayValue;
				if (i === 0 && munCount === 1) {
					for(j = 0; j < muns[i].length; ++j) {
						ctxId = selectionCtx[i][j];

						if (ctxId != 0)
						{
							// place the selceted cell in the measure section. The wizard will take
							// care of verifying that it's really a measure
							if(j===0) {
								//get the measure's query ref. This should be unique within a selection, except for sections.
								sQuery = sc.getRefQuery(ctxId);
								displayValue = selection.getDisplayValues()[j];
								this._buildMeasureSelection(sc, ctxId, singleSelection.measures, displayValue, j, selection.getLayoutType());
							} else {
								//ignore other measures on the list report
								if (sc.getUsageInfo(ctxId) != 2) {
									this._buildEdgeSelection(sc, ctxId, singleSelection.cols, j);
								}
							}
						}
					}
				} else {
					for(j = 0; j < muns[i].length; ++j) {
						ctxId = selectionCtx[i][j];
						if (ctxId != 0)
						{
							if (i === 0) {
								displayValue = selection.getDisplayValues()[j];
								sQuery = sc.getRefQuery(ctxId);

								this._buildMeasureSelection(sc, ctxId, singleSelection.measures, displayValue, j, selection.getLayoutType());
								//get the measure's query ref. This should be unique within a selection, except for sections.
							} else if (i === 1 ) {
								this._buildEdgeSelection(sc, ctxId, singleSelection.rows, j);
							} else if (i === 2) {
								this._buildEdgeSelection(sc, ctxId, singleSelection.cols, j);
							} else {
								this._buildSectionSelection(sc, ctxId, singleSelection.sections, j);
							}
						}
					}
				}
			}

			this.AddSelection(sQuery, singleSelection);
		}
	}
};


CSelectionXml.prototype.AddSelection = function(queryName, context) {
	if (!this.queries[queryName]) {
		this.queries[queryName] = new SC_SingleQuery();
	}

	this.queries[queryName].selections.push(context);
};


CSelectionXml.prototype._buildMeasureSelection = function(sc, ctxId, measures, displayValue, idx, dataType) {
	if (dataType == "" || dataType == null)
	{
		dataType = "datavalue";
	}

	if (ctxId) {
			measures.push( {
			name:		sc.getRefDataItem(ctxId),
			values:		[ {	use:		sc.getUseValue(ctxId),
							display:	displayValue				}],
			order:		idx,
			hun:		sc.getHun(ctxId),
			dataType:	dataType,
			usage:		sc.getUsageInfo(ctxId),
			dtype:		sc.getDataType(ctxId),
			selection:	"true"					//TODO: is this supposed to be anything else?
		});
	}
};

CSelectionXml.prototype._buildEdgeSelection = function(sc, ctxId, edges, idx) {
	if (ctxId) {
		edges.push( {
			name:		sc.getRefDataItem(ctxId),
			values:		[ {	use:		this.getUseValue(sc, ctxId),
							display:	sc.getDisplayValue(ctxId)	}],
			order:		idx,
			lun:		sc.getLun(ctxId),
			hun:		sc.getHun(ctxId),
			dataType:	"columnTitle",
			usage:		sc.getUsageInfo(ctxId),
			dtype:		sc.getDataType(ctxId)
		});
	}
};

CSelectionXml.prototype._buildSectionSelection = function(sc, ctxId, sections, idx) {
	if (ctxId) {
		sections.push( {
			name:		sc.getRefDataItem(ctxId),
			values:		[ {	use:		this.getUseValue(sc, ctxId),
							display:	sc.getDisplayValue(ctxId)	}],
			order:		idx,
			lun:		sc.getLun(ctxId),
			hun:		sc.getHun(ctxId),
			dataType:	"section",
			usage:		sc.getUsageInfo(ctxId),
			dtype:		sc.getDataType(ctxId),
			queryRef:	sc.getRefQuery(ctxId)
		});
	}
};

/**
 * If we have a MUN then use it, otherwise use the useValue
 * @private
 */
CSelectionXml.prototype.getUseValue = function(sc, ctxId)
{
	var useValue = sc.getMun(ctxId);
	if (useValue == "")
	{
		useValue = sc.getUseValue(ctxId);
	}

	return useValue;
};


/*===================================================
			Serialization of the selection
			Context
====================================================*/
CSelectionXml.prototype.toXml = function() {
	var xmlSelectionsDocument = XMLBuilderCreateXMLDocument("selections");
	var xmlSelections = xmlSelectionsDocument.documentElement;
	XMLBuilderSetAttributeNodeNS(xmlSelections, "xmlns:xs", "http://www.w3.org/2001/XMLSchema");
	XMLBuilderSetAttributeNodeNS(xmlSelections, "xmlns:bus", "http://developer.cognos.com/schemas/bibus/3/");
	XMLBuilderSetAttributeNodeNS(xmlSelections, "SOAP-ENC:arrayType", "bus:parameterValue[]", "http://schemas.xmlsoap.org/soap/encoding/");
	XMLBuilderSetAttributeNodeNS(xmlSelections, "xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
	XMLBuilderSetAttributeNodeNS(xmlSelections, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
	xmlSelections.setAttribute("contentLocale", this.contentLocale);
	xmlSelections.setAttribute("expressionLocale", this.expressionLocale);

	for(var q in this.queries) {
		this._queryToXml(xmlSelections, q, this.queries[q]);
	}
	this._burstToXml(xmlSelections);

	return XMLBuilderSerializeNode(xmlSelectionsDocument);
};


CSelectionXml.prototype._queryToXml = function(parent, name, obj) {
	var xmlQuery = parent.ownerDocument.createElement("query");
	xmlQuery.setAttribute("name", name);

	for(var selection = 0; selection < obj.selections.length; ++selection) {
		this._selectionToXml(xmlQuery, obj.selections[selection]);
	}

	for(var slicer = 0; slicer < obj.slicers.length; ++slicer) {
		this._slicersToXml(xmlQuery, obj.slicers[slicer]);
	}

	for(var filter = 0; filter < obj.selections.length; ++filter) {
		this._filtersToXml(xmlQuery, obj.selections[filter]);
	}

	parent.appendChild(xmlQuery);
};

CSelectionXml.prototype._selectionToXml = function(parent, selection) {
	var doc = parent.ownerDocument;
	var xmlSelection = doc.createElement("selection");
	parent.appendChild(xmlSelection);

	this._edgeToXml(xmlSelection, "row", selection.rows);
	this._edgeToXml(xmlSelection, "column", selection.cols);
	this._edgeToXml(xmlSelection, "measure", selection.measures);
	this._edgeToXml(xmlSelection, "section", selection.sections);

	var layoutElementId = doc.createElement("layoutElementId");
	layoutElementId.appendChild(doc.createTextNode(selection.layoutElementId));

	xmlSelection.appendChild(layoutElementId);

};


CSelectionXml.prototype._edgeToXml = function(parent, sEdge, aContext) {
	var doc = parent.ownerDocument;

	//row edge name: "row" + "s"
	var xmlEdgeContainer = doc.createElement(sEdge+'s');
	parent.appendChild(xmlEdgeContainer);

	for(var i = 0; i < aContext.length; ++i) {
		var xmlEdge = doc.createElement(sEdge);
		xmlEdgeContainer.appendChild(xmlEdge);

		var edge = aContext[i];
		for(var j in edge) {
			if (j !== "name" && j !== "values") {
				//add all the properties of the object as attributes, except "name" and "values" which
				//are added later. Check for null only. Nothing should be undefined, and we want to maintain
				//0 as a number.
				xmlEdge.setAttribute(j,  edge[j] !== null ? edge[j] : "");
			}
		}

		this._itemToXml(xmlEdge, edge.name, edge.values);
	}

};


CSelectionXml.prototype._itemToXml = function(parent, name, values) {
	var doc = parent.ownerDocument;
	var xmlItem = doc.createElement("item");

	XMLBuilderSetAttributeNodeNS(xmlItem, "xsi:type", "bus:parameterValue", "http://www.w3.org/2001/XMLSchema-instance");

	var xmlBusName = XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:name", doc);
	XMLBuilderSetAttributeNodeNS(xmlBusName, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
	xmlBusName.appendChild(doc.createTextNode(name));
	xmlItem.appendChild(xmlBusName);

	var xmlBusValue = XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:value", doc);
	XMLBuilderSetAttributeNodeNS(xmlBusValue, "xsi:type", "SOAP-ENC:Array", "http://www.w3.org/2001/XMLSchema-instance");
	XMLBuilderSetAttributeNodeNS(xmlBusValue, "SOAP-ENC:arrayType", "bus:parmValueItem[]", "http://schemas.xmlsoap.org/soap/encoding/");
	xmlItem.appendChild(xmlBusValue);

	///NOTE: We only expect one value currently, but we support a list
	for (var j = 0; j < values.length; j++)
	{
		var xmlValueItem = doc.createElement("item");
		XMLBuilderSetAttributeNodeNS(xmlValueItem, "xsi:type", "bus:simpleParmValueItem", "http://www.w3.org/2001/XMLSchema-instance");
		var xmlValueUse = XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:use", doc);
		XMLBuilderSetAttributeNodeNS(xmlValueUse, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");

		if(values[j].use)
		{
			xmlValueUse.appendChild(doc.createTextNode(values[j].use));
		}
		else if (values[j].display)
		{
			xmlValueUse.appendChild(doc.createTextNode(values[j].display));
		}
		else
		{
			xmlValueUse.appendChild(doc.createTextNode(""));
		}


		var xmlValueDisplay = XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/", "bus:display", doc);
		XMLBuilderSetAttributeNodeNS(xmlValueDisplay, "xsi:type", "xs:string", "http://www.w3.org/2001/XMLSchema-instance");
		if (values[j].display)
		{
			xmlValueDisplay.appendChild(doc.createTextNode(values[j].display));
		}
		else
		{
			xmlValueDisplay.appendChild(doc.createTextNode(""));
		}
		xmlValueItem.appendChild(xmlValueUse);
		xmlValueItem.appendChild(xmlValueDisplay);
		xmlBusValue.appendChild(xmlValueItem);
	}

	parent.appendChild(xmlItem);
};


CSelectionXml.prototype._burstToXml = function(parent) {
	var doc = parent.ownerDocument;

	var burstContext = doc.createElement("burst-context");
	burstContext.appendChild(doc.createTextNode(this.burstContext));
	parent.appendChild(burstContext);
};


CSelectionXml.prototype._slicersToXml = function(parent, slicers) {
	//TODO: add later
};


CSelectionXml.prototype._filtersToXml = function(parent, filter) {
	//TODO: add later
};


