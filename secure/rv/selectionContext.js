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
function CSelectionMetadata()
{
	this.m_sContextId = "";
	this.m_sDataItem = "";
	this.m_sMetadataModelItem = "";
	this.m_sUseValue = "";
	this.m_sUseValueType = "";
	this.m_sType = null;
	this.m_sDisplayValue = "";
	this.m_sUsage = null;
	this.m_refQuery = null;
	this.m_sHun = null;
	this.m_sDun = null;
}

CSelectionMetadata.prototype.setContextId = function(sContextId)
{
	this.m_sContextId = sContextId;
};

CSelectionMetadata.prototype.getContextId = function()
{
	return this.m_sContextId;
};

CSelectionMetadata.prototype.setRefQuery = function(sRefQuery)
{
	this.m_refQuery = sRefQuery;
};

CSelectionMetadata.prototype.getRefQuery = function()
{
	return this.m_refQuery;
};

CSelectionMetadata.prototype.setDataItem = function(sDataItem)
{
	this.m_sDataItem = sDataItem;
};

CSelectionMetadata.prototype.getDataItem = function()
{
	return this.m_sDataItem;
};

CSelectionMetadata.prototype.setMetadataModelItem = function(sMetadataModelItem)
{
	this.m_sMetadataModelItem = sMetadataModelItem;
};

CSelectionMetadata.prototype.getMetadataModelItem = function()
{
	return this.m_sMetadataModelItem;
};

CSelectionMetadata.prototype.setUseValue = function(sUseValue)
{
	this.m_sUseValue = sUseValue;
};

CSelectionMetadata.prototype.getUseValue = function()
{
	return this.m_sUseValue;
};

CSelectionMetadata.prototype.setUseValueType = function(sUseValueType)
{
	this.m_sUseValueType = sUseValueType;
};

CSelectionMetadata.prototype.setType = function(sType)
{
	this.m_sType = sType;
};

CSelectionMetadata.prototype.getType = function()
{
	var sType = null;
	switch(this.m_sUseValueType)
	{
		case 25: // MemberUniqueName
		case 27: // DimensionUniqueName
		case 30: // HierarchyUniqueName
		case 32: // LevelUniqueName
			sType = "memberUniqueName";
			break;
		case 26: //MemberCaption
			sType = "memberCaption";
			break;
		case 1: // String
		case 55: //I18NExternalBuffer
		case 56: //I18NExternalBuffer
			sType = "string";
			break;
		case 2: //Int8
		case 3: //UInt8
		case 4: //Int16
		case 5: //UInt16
		case 6: //Int32
		case 7: //UInt32
		case 8: //Int64
		case 9: //UInt64
		case 10: //float
		case 11: //double
		case 12: //decimal
		case 16: //dt interval
		case 17: //ym interval
		case 18: //blob
		case 19: //RowIterator
		case 20: //DimInterator
		case 22: //Variant
		case 21: //MasterDataset
		case 23: //Binary
		case 24: //VarBinary
		case 54: //numeric
			sType = parseInt(this.m_sUseValueType,10);
			break;
	}
	return sType;
};

CSelectionMetadata.prototype.getUseValueType = function()
{
	if(this.m_sType == null)
	{
		this.m_sType = this.getType();
	}

	return this.m_sType;
};

CSelectionMetadata.prototype.setDisplayValue = function(sDisplayValue)
{
	this.m_sDisplayValue = sDisplayValue;
};

CSelectionMetadata.prototype.getDisplayValue = function()
{
	return this.m_sDisplayValue;
};

CSelectionMetadata.prototype.setUsage = function(sUsage)
{
	this.m_sUsage = sUsage;
};

CSelectionMetadata.prototype.getUsage = function()
{
	if(this.m_sUsage == "2")
	{
		return "measure";
	}
	else
	{
		return "nonMeasure";
	}
};

CSelectionMetadata.prototype.setHun = function(sHun)
{
	this.m_sHun = sHun;
};

CSelectionMetadata.prototype.getHun = function()
{
	return this.m_sHun;
};

CSelectionMetadata.prototype.setDun = function(sDun)
{
	this.m_sDun = sDun;
};

CSelectionMetadata.prototype.getDun = function()
{
	return this.m_sDun;
};


function CSelectionMetadataIterator(selectionObject, axisIndex)
{
	this.m_axisIndex = axisIndex;
	this.m_index = 0;
	this.m_selectionObject = selectionObject;
}

CSelectionMetadataIterator.prototype.getSelectionAxis = function()
{
	var selectionAxis = null;

	if(typeof this.m_selectionObject == "object" && this.m_axisIndex < this.m_selectionObject.getSelectedContextIds().length)
	{
		selectionAxis = this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex];
	}

	return selectionAxis;
};

CSelectionMetadataIterator.prototype.hasNext = function()
{
	var selectionAxis = this.getSelectionAxis();
	if(selectionAxis != null)
	{
		return (this.m_index < selectionAxis.length);
	}
	else
	{
		return false;
	}
};

CSelectionMetadataIterator.prototype.next = function()
{
	var selectionMetadata = null;
	if(this.hasNext())
	{
		selectionMetadata = new CSelectionMetadata();
		selectionMetadata.setContextId(this.m_selectionObject.m_contextIds[this.m_axisIndex][this.m_index]);
		selectionMetadata.setDataItem(this.m_selectionObject.getDataItems()[this.m_axisIndex][this.m_index]);
		selectionMetadata.setMetadataModelItem(this.m_selectionObject.getMetadataItems()[this.m_axisIndex][this.m_index]);

		if(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index] != null && this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index] != "")
		{
			selectionMetadata.setUseValue(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]);
			selectionMetadata.setType("memberUniqueName");
		}
		else
		{
			selectionMetadata.setUseValue(this.m_selectionObject.getUseValues()[this.m_axisIndex][this.m_index]);
		}

		if(typeof this.m_selectionObject.m_selectionController == "object")
		{
			var ctxId = this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex][this.m_index];

			if (this.m_selectionObject.useDisplayValueFromObject) //display value can be set by DrillAction.parseDrillSpec()
			{
				selectionMetadata.setDisplayValue(this.m_selectionObject.getDisplayValues()[this.m_axisIndex]);
			}
			else
			{
			    var tableRow = null;
			    var displayValue = null;
			    //CQ: COGCQ00655050 - if we know we're getting the display values for a row, 
			    //then instead of searching the entire report we search the Table Row for it 
			    //and if it exists return the display value - if not search the entire report.
			    if (this.m_axisIndex === 0) {
			        var cellRef = this.m_selectionObject.getCellRef();
			        if (cellRef && cellRef.nodeName && cellRef.nodeName.toLowerCase() === "td") {
			            displayValue = this.m_selectionObject.m_selectionController.getDisplayValueFromDOM(ctxId, cellRef.parentNode);
			        }
			    }
				
			    if (displayValue == null) {
				    displayValue = this.m_selectionObject.m_selectionController.getDisplayValue(ctxId);
			    }
			    if (displayValue === "") {
				    displayValue = this.m_selectionObject.m_selectionController.getUseValue(ctxId);
				}
				selectionMetadata.setDisplayValue(displayValue);
			}
			selectionMetadata.setUseValueType(this.m_selectionObject.m_selectionController.getDataType(ctxId));
			selectionMetadata.setUsage(this.m_selectionObject.m_selectionController.getUsageInfo(ctxId));
			selectionMetadata.setRefQuery(this.m_selectionObject.m_selectionController.getRefQuery(ctxId));
			selectionMetadata.setHun(this.m_selectionObject.m_selectionController.getHun(ctxId));
			selectionMetadata.setDun(this.m_selectionObject.m_selectionController.getDun(ctxId));
		}

		++this.m_index;
	}

	return selectionMetadata;
};

function CAxisSelectionIterator(selectionObject)
{
	this.m_index = 0;
	this.m_selectionObject = selectionObject;
}

CAxisSelectionIterator.prototype.hasNext = function()
{
	return ((typeof this.m_selectionObject == "object") && (this.m_index < this.m_selectionObject.getSelectedContextIds().length));
};

CAxisSelectionIterator.prototype.next = function()
{
	var selectionMetadataIterator = null;

	if(this.hasNext())
	{
		selectionMetadataIterator = new CSelectionMetadataIterator(this.m_selectionObject, this.m_index);
		++this.m_index;
	}

	return selectionMetadataIterator;
};

function getSelectionContextIds(selectionController)
{
	var contextIds = [];

	var selectedObjects = selectionController.getAllSelectedObjects();

	if(selectedObjects != null && selectedObjects.length > 0)
	{
		for(var index = 0; index < selectedObjects.length; ++index)
		{
			var selectedObject = selectedObjects[index];
			var selectedContextIds = selectedObject.getSelectedContextIds();

			var itemArray = [];
			for(var item = 0; item < selectedContextIds.length; ++item)
			{
				var itemIdList = selectedContextIds[item].join(":");
				itemArray.push(itemIdList);
			}

			contextIds.push(itemArray.join("::"));
		}
	}

	return contextIds;
}

function getViewerSelectionContext(selectionController, selectionContext, uniqueCTXIDs)
{
	var selectedObjects = uniqueCTXIDs == true ? selectionController.getAllSelectedObjectsWithUniqueCTXIDs() : selectionController.getAllSelectedObjects();

	if(selectedObjects != null && selectedObjects.length > 0)
	{
		for(var index = 0; index < selectedObjects.length; ++index)
		{
			var usedIds = {};
			var axisSelectionIterator = new CAxisSelectionIterator(selectedObjects[index]);

			if(axisSelectionIterator.hasNext())
			{
				var selectionMetadataIterator = axisSelectionIterator.next();
				if(selectionMetadataIterator.hasNext())
				{
					var selectionMetadata = selectionMetadataIterator.next();
					var contextId = selectionMetadata.getContextId();

					usedIds[contextId] = true;
					var selectedCell = selectionContext.addSelectedCell(selectionMetadata.getDataItem(), selectionMetadata.getMetadataModelItem(), selectionMetadata.getUseValue(), selectionMetadata.getUseValueType(), selectionMetadata.getDisplayValue(), selectionMetadata.getUsage(), {"queryName":selectionMetadata.getRefQuery()});
					if (selectionMetadata.getHun() != null)
					{
						selectedCell.addProperty("HierarchyUniqueName", selectionMetadata.getHun());
					}
					if (selectionMetadata.getDun() != null)
					{
						selectedCell.addProperty("DimensionUniqueName", selectionMetadata.getDun());
					}


					while(selectionMetadataIterator.hasNext())
					{
						selectionMetadata = selectionMetadataIterator.next();

						contextId = selectionMetadata.getContextId();
						if(typeof usedIds[contextId] == "undefined" || contextId === "")
						{
							usedIds[contextId] = true;
							var definingCell = selectedCell.addDefiningCell(selectionMetadata.getDataItem(), selectionMetadata.getMetadataModelItem(), selectionMetadata.getUseValue(), selectionMetadata.getUseValueType(),  selectionMetadata.getDisplayValue(), selectionMetadata.getUsage(), {"queryName":selectionMetadata.getRefQuery()});
							if (selectionMetadata.getHun() != null)
							{
								definingCell.addProperty("HierarchyUniqueName", selectionMetadata.getHun());
							}
							if (selectionMetadata.getDun() != null)
							{
								definingCell.addProperty("DimensionUniqueName", selectionMetadata.getDun());
							}
						}
					}

					while(axisSelectionIterator.hasNext())
					{
						selectionMetadataIterator = axisSelectionIterator.next();
						var starterCell = selectedCell;
						while(selectionMetadataIterator.hasNext())
						{
							selectionMetadata = selectionMetadataIterator.next();
							contextId = selectionMetadata.getContextId();
							if(typeof usedIds[contextId] == "undefined" || contextId === "")
							{
								usedIds[contextId] = true;
								starterCell = starterCell.addDefiningCell(selectionMetadata.getDataItem(), selectionMetadata.getMetadataModelItem(), selectionMetadata.getUseValue(), selectionMetadata.getUseValueType(),  selectionMetadata.getDisplayValue(), selectionMetadata.getUsage(), {"queryName":selectionMetadata.getRefQuery()});
								if (selectionMetadata.getHun() != null)
								{
									starterCell.addProperty("HierarchyUniqueName", selectionMetadata.getHun());
								}
								if (selectionMetadata.getDun() != null)
								{
									starterCell.addProperty("DimensionUniqueName", selectionMetadata.getDun());
								}
							}
						}
					}
				}
			}
		}
	}

	var sSelectionContext = selectionContext.toString();

	if (window.gViewerLogger)
	{
		window.gViewerLogger.log('Selection context', sSelectionContext, "xml");
	}

	return sSelectionContext;
}

