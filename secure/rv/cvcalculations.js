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
/**
 * CognosViewerCalculation constructor (base class for all calculation rules)
 * @constructor
 */
function CognosViewerCalculation() {
	this.m_oCV = null;
}

/**
 * Sets the cognos viewer object (called by the action factory
 * @param CCognosViewer object
 * @private
 */
CognosViewerCalculation.prototype.setCognosViewer = function(oCV) {
	this.m_oCV = oCV;
};

/**
 * Returns an instance to the cognos viewer object
 * @return CCognosViewer object
 */
CognosViewerCalculation.prototype.getCognosViewer = function() {
	return this.m_oCV;
};


/**
 * Most calculations require only 2 selected cells
 */
CognosViewerCalculation.prototype.validSelectionLength = function(selectionController) {
	try	{
		return selectionController.getAllSelectedObjects().length > 0;
	} catch (e) {
		return false;
	}
};

/**
 * Gets the display value to show in the calculation string. If the current selection is a column title, then
 * simply use the display from the selection, if not then find the defining cells display value
 */
CognosViewerCalculation.prototype.getDisplayValueFromSelection = function(selection) {
	var displayValue = "";
	if (!selection) {
		return displayValue;
	}

	if (selection.getLayoutType() == "columnTitle") {
		displayValue = selection.getDisplayValues()[0];
	} else if (selection.getLayoutType() == "datavalue") {
		// only time we'd be doing a calculation and wouldn't have columnTitles selected
		// is in a list, so get the column header
		var viewerAction = this.m_oCV.getAction("CognosViewer");
		var selectionController = this.m_oCV.getSelectionController();
		var containerId = viewerAction.getContainerId(selectionController);
		displayValue = selection.getDataItemDisplayValue(viewerAction.getReportInfo(containerId));
	}

	if (displayValue.indexOf("+") != -1 || displayValue.indexOf("-") != -1 || displayValue.indexOf("*") != -1 || displayValue.indexOf("/") != -1) {
		displayValue = "(" + displayValue + ")";
	}

	return displayValue;
};

/**
 * Need to override this method if your class uses the CognosViewerCalculation getMenuItemString method
 * +, -, *, /
 */
CognosViewerCalculation.prototype.getCalcSymbol = function() {};

/**
 * Generates the menu item string to be displayed in the context menu. Used for simply calculations like
 * +, -, *, /
 */
CognosViewerCalculation.prototype.getMenuItemString = function(menuEnabled) {
	var cognosViewer = this.getCognosViewer();
	var selectionController = cognosViewer.getSelectionController();
	var sMenuItemString = "";
	var selection, index;

	if (menuEnabled) {
		try {
			var selectionLength = selectionController.getAllSelectedObjects().length;
			if (selectionLength == 1) {
				selection = selectionController.getAllSelectedObjects()[0];
				if(this.m_bFlipSelection) {
					sMenuItemString = RV_RES.IDS_JS_CALCULATE_NUMBER + " " + this.getCalcSymbol() + " " + this.getDisplayValueFromSelection(selection);
				} else {
					sMenuItemString = this.getDisplayValueFromSelection(selection) + " " + this.getCalcSymbol() + " " + RV_RES.IDS_JS_CALCULATE_NUMBER;
				}
			} else {
				if (this.m_bFlipSelection) {
					selectionLength--;
					for (index=selectionLength; index >= 0; index--) {
						selection = selectionController.getAllSelectedObjects()[index];
						if (index != selectionLength) {
							sMenuItemString += " " + this.getCalcSymbol() + " ";
						}
						sMenuItemString += this.getDisplayValueFromSelection(selection);
					}
				}
				else {
					for (index=0; index < selectionLength; index++) {
						selection = selectionController.getAllSelectedObjects()[index];
						if (index > 0) {
							sMenuItemString += " " + this.getCalcSymbol() + " ";
						}
						sMenuItemString += this.getDisplayValueFromSelection(selection);
					}
				}
			}
		} catch (e) {
			sMenuItemString = this.getCalcSymbol();
		}
	} else {
		sMenuItemString = this.getCalcSymbol();
	}

	return sMenuItemString;
};



/**
 * Percent Difference Calculation
 */
function PercentDifferenceCalculation() {}
PercentDifferenceCalculation.prototype = new CognosViewerCalculation();

PercentDifferenceCalculation.prototype.validSelectionLength = function(selectionController) {
	try	{
		return selectionController.getAllSelectedObjects().length == 2;
	} catch (e) {
		return false;
	}
};



/**
 * Generates the menu item string to be displayed in the context menu
 */
PercentDifferenceCalculation.prototype.getMenuItemString = function(menuEnabled) {
	var selectionController = this.getCognosViewer().getSelectionController();
	var sMenuItemString = RV_RES.IDS_JS_CALCULATE_PERCENT_DIFFERENCE;

	if (menuEnabled) {
		try {
			var selectionLength = selectionController.getAllSelectedObjects().length;
			sMenuItemString += " (";
			for (var index=0; index < selectionLength; index++) {
				var selection = selectionController.getAllSelectedObjects()[index];
				if (index > 0) {
					sMenuItemString += ", ";
				}
				sMenuItemString += this.getDisplayValueFromSelection(selection);
			}
			sMenuItemString += ")";
		} catch (e) {}
	}

	return sMenuItemString;
};

/**
 * Percent Difference Calculation
 */
function PercentDifferenceCalculationSwapOrder()
{
	this.m_bFlipSelection = true;
}
PercentDifferenceCalculationSwapOrder.prototype = new PercentDifferenceCalculation();

/**
 * Generates the menu item string to be displayed in the context menu
 */
PercentDifferenceCalculationSwapOrder.prototype.getMenuItemString = function(menuEnabled) {
	var selectionController = this.getCognosViewer().getSelectionController();
	var sMenuItemString = RV_RES.IDS_JS_CALCULATE_PERCENT_DIFFERENCE;

	if (menuEnabled) {
		try {
			var selectionLength = selectionController.getAllSelectedObjects().length;
			sMenuItemString += " (";
			selectionLength--;
			for (var index=selectionLength; index >= 0; index--) {
				var selection = selectionController.getAllSelectedObjects()[index];
				if (index < selectionLength) {
					sMenuItemString += ", ";
				}
				sMenuItemString += this.getDisplayValueFromSelection(selection);
			}
			sMenuItemString += ")";
		} catch (e) {}
	}

	return sMenuItemString;
};

/**
 * Addition calculation
 */
function AdditionCalculation() {}
AdditionCalculation.prototype = new CognosViewerCalculation();

AdditionCalculation.prototype.getCalcSymbol = function() {
	return "+";
};

/**
 * Subtraction calculation
 */
function SubtractionCalculation() {}
SubtractionCalculation.prototype = new CognosViewerCalculation();

SubtractionCalculation.prototype.getCalcSymbol = function() {
	return "-";
};

/**
 * Override the validSelectionLength method since additions allows from 1 to 2 selections
 */
SubtractionCalculation.prototype.validSelectionLength = function(selectionController) {
	try	{
		var selLength = selectionController.getAllSelectedObjects().length;
		return selLength > 0 && selLength < 3;
	} catch (e) {
		return false;
	}
};

/**
 * Subtraction calculation when we flip the selection order
 */
function SubtractionCalculationSwapOrder()
{
	this.m_bFlipSelection = true;
}
SubtractionCalculationSwapOrder.prototype = new SubtractionCalculation();

/**
 * Multiplication calculation
 */
function MultiplicationCalculation() {}
MultiplicationCalculation.prototype = new CognosViewerCalculation();

MultiplicationCalculation.prototype.getCalcSymbol = function() {
	return "*";
};

/**
 * Division Calculation
 */
function DivisionCalculation() {}
DivisionCalculation.prototype = new CognosViewerCalculation();

DivisionCalculation.prototype.getCalcSymbol = function() {
	return "/";
};

DivisionCalculation.prototype.validSelectionLength = function(selectionController) {
	try	{
		var selectionLength = selectionController.getAllSelectedObjects().length;
		return  (selectionLength > 0 && selectionLength < 3);
	} catch (e) {
		return false;
	}
};


/**
 * Division Calculation when we swap the order of selection
 */
function DivisionCalculationSwapOrder()
{
	this.m_bFlipSelection = true;
}
DivisionCalculationSwapOrder.prototype = new DivisionCalculation();


/**
 * Calculation Actions (Addition, Subtraction, Multiplication, Division, PercentDifference etc.)
 */
function CalculationAction()
{
	this.m_payload = "";
	this.m_menuBuilderClass = null;
	this.m_defaultName = "";
	this.m_constant = null;
}

CalculationAction.prototype = new ModifyReportAction();

CalculationAction.prototype.getUndoHint = function()
{
	return RV_RES.IDS_JS_CALCULATION;
};

CalculationAction.prototype.keepRAPCache = function()
{
	return false;
};


/**
 * Specific rules for lists:
 * 1. No two selections can be on the same column.
 * 2. Selections have calculation Metadata
 * @return true if the current selections are valid for calculations
 */
CalculationAction.prototype.listRules = function() {

	var selectionController = this.getCognosViewer().getSelectionController();
	var aSelectionObjects = selectionController.getSelections();
	if (aSelectionObjects.length > 1)
	{
		var tmp = {};
		for (var i = 0; i < aSelectionObjects.length; ++i)
		{
			var columnRef = aSelectionObjects[i].getColumnRef();
			if (typeof tmp[columnRef] == "undefined")
			{
				tmp[columnRef] = 1;
			}
			else
			{
				return false; //duplicate found
			}
		}
	}
	return selectionController.selectionsHaveCalculationMetadata();
};

/**
 * Specific rules for crosstabs
 * @return true if the current selections are valid for calculations
 */
CalculationAction.prototype.crosstabRules = function() {
	var selectionController = this.getCognosViewer().getSelectionController();

	if (!selectionController.areSelectionsColumnRowTitles()) {
		return false;
	}

	if (selectionController.isRelational()) {
		if (!this.relationalCrosstabRules(selectionController)) {
			return false;
		}
	} else {
		if (!this.olapCrosstabRules(selectionController)) {
			return false;
		}
	}

	return true;
};

/**
 * Specific rules for relational data
 * @return true is the selections meet all the relational crosstab specific rules for allowing calculations
 */
CalculationAction.prototype.relationalCrosstabRules = function(selectionController) {
	return selectionController.selectionsHaveCalculationMetadata();
};

/**
 * Specific rules for OLAP data
 * @return true if the selections meet all the olap specific crosstab rules for allowing calculations
 */

CalculationAction.prototype.olapCrosstabRules = function(selectionController) {

	if (! selectionController.selectionsHaveCalculationMetadata())
	{
		return false;
	}
	if (!this.sameDimension(selectionController))
	{
		// Allow calculations between measures of different measure dimensions
		// Only allow members calcs if all measures
		return (typeof this.m_oCV.aQoSFunctions != "undefined") && this.m_oCV.aQoSFunctions.toString().indexOf('MULTIPLE_MEASURE_DIMENSION_CALCULATIONS') != -1 && selectionController.selectionsAreMeasures();
	}
	else
	{
	   if (this.sameHierarchy(selectionController))
	   {
		   return true;
	   }
	   else
	   {
		   return (typeof this.m_oCV.aQoSFunctions != "undefined") && this.m_oCV.aQoSFunctions.toString().indexOf('VALUE_EXPRESSIONS_REF_MULTIPLE_HIERARCHIES_OF_SAME_DIMENSION') != -1;
	   }
	}
};
/**
 * Checks to see if the selected cells are from the same hierarchy
 * @return true if the selections are from the same hierarchy, false otherwise
 */

CalculationAction.prototype.sameDimension = function(selectionController) {
	try {
		var dim = "";
		var selLength = selectionController.getAllSelectedObjects().length;
		for (var selIndex = 0; selIndex < selLength; selIndex++) {
			if (dim.length == 0) {
				dim = selectionController.getAllSelectedObjects()[selIndex].getDimensionalItems('dun')[0][0];
			} else if (dim != selectionController.getAllSelectedObjects()[selIndex].getDimensionalItems('dun')[0][0]){
				return false;
			}
		}
		return true;
	}catch (e) {
		return false;
	}
};

CalculationAction.prototype.sameHierarchy = function(selectionController) {
	try {
		var dim = "";
		var selLength = selectionController.getAllSelectedObjects().length;
		for (var selIndex = 0; selIndex < selLength; selIndex++) {
			if (dim.length == 0) {
				dim = selectionController.getAllSelectedObjects()[selIndex].getDimensionalItems('hun')[0][0];
			} else if (dim != selectionController.getAllSelectedObjects()[selIndex].getDimensionalItems('hun')[0][0]){
				return false;
			}
		}
		return true;
	}catch (e) {
		return false;
	}
};

/**
 * For calculations, pass the calculation string to the RAP for generating calculation column name.
 */
CalculationAction.prototype.addActionContextAdditionalParms = function()
{
	var additionalContextParms = "";

	if(this.m_constant != null)
	{
		additionalContextParms += "<constant>" + xml_encode(this.m_constant) + "</constant>";

		if(this.m_swapSelectionOrder)
		{
			additionalContextParms += "<constantFirst/>";
		}
	}

	if(this.m_defaultName != "")
	{
		additionalContextParms += "<columnName>" + xml_encode(this.m_defaultName) + "</columnName>";
	}

	return additionalContextParms;
};

CalculationAction.prototype.setRequestParms = function(parms)
{
	if(parms != null)
	{
		if(typeof parms.constant != null)
		{
			this.m_constant = parms.constant;
		}
	}
};

CalculationAction.prototype.buildDefaultName = function()
{
	try {
		var calc = this.getCognosViewer().getCalculation(this.m_menuBuilderClass);
		this.m_defaultName = calc.getMenuItemString(true);

		if(this.m_constant != null)
		{
			var numberLabel = "" + this.m_constant;
			var separator = this.getCognosViewer().envParams['contentDecimalSeparator'];
			if (typeof separator != "undefined" && separator != null && separator != ".")
			{
				numberLabel = numberLabel.replace(".", separator);
			}
			this.m_defaultName = this.m_defaultName.replace(RV_RES.IDS_JS_CALCULATE_NUMBER, numberLabel);
		}
	} catch (e) {
		this.m_defaultName = "";
	}
};

CalculationAction.prototype.preProcess = function()
{
	var selectionCount = this.getNumberOfSelections();

	this.buildDefaultName();

	if(this.m_swapSelectionOrder && selectionCount == 2)
	{
		var selectionController = this.getCognosViewer().getSelectionController();

		var sel1 = selectionController.getAllSelectedObjects()[0];
		var sel2 = selectionController.getAllSelectedObjects()[1];

		selectionController.m_aSelectedObjects = [sel2, sel1];
	}
};

CalculationAction.prototype.isFactCellOnCrosstabOrEmpty = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();

	if (selectedObjects != null && typeof selectedObjects != "undefined")	{
		if (selectedObjects.length == 0) {
			return true;
		} else {
			var selectedObject = selectedObjects[0];
			//If the select object should be disabled when the user selects a fact cell(s).
			if (selectionController.getDataContainerType() == "crosstab" && selectedObject.getLayoutType() == 'datavalue')
			{
				return true;
			}
		}
	}
	return false;
};

CalculationAction.prototype.isSummaryOrAggregateCell = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();
	if (selectedObjects != null && typeof selectedObjects != "undefined")	{
		var cellRef;
		var reCrosstabLevel = /\b(ol|il)\b/;
		for (var i = 0; i < selectedObjects.length; i++)
		{
			cellRef = selectedObjects[i].getCellRef();
			if (cellRef != null && typeof cellRef != "undefined")	{
				if (selectedObjects[i].getLayoutType() == "summary" || (cellRef != null && reCrosstabLevel.test(cellRef.className)))
				{
					return true;
				}
			}
			cellRef =null;
		}
	}
	return false;
};

CalculationAction.prototype.isLastSelectionSingleDimensionNested = function()
{
	var selectionController = this.m_oCV.getSelectionController();
	var selectedObjects = selectionController.getAllSelectedObjects();
	if (selectedObjects != null && typeof selectedObjects != "undefined" && selectedObjects.length)	{
		var lastSelection = selectedObjects[selectedObjects.length - 1];
		var dimItemsAxis0 = lastSelection.getDimensionalItems('dun')[0];
		//If dimension of this item is same as any of its parents, its SD nested.
		if (dimItemsAxis0 && dimItemsAxis0.length && dimItemsAxis0[0]) {
			for(var parent=1; parent<dimItemsAxis0.length; ++parent) {
				if (dimItemsAxis0[parent]===dimItemsAxis0[0]) {
					return true;
				}
			}
		}
	}
	return false;
};

/**
 * Checks to see if all types of calculation are possible. This function
 * checks general conditions of selections that apply to all types of calculation.
 */
CalculationAction.prototype.areCalculationsPossible = function()
{
	var selectionController = this.getCognosViewer().getSelectionController();

	if(this.isFactCellOnCrosstabOrEmpty())
	{
		return false;
	}

	if(this.isSelectionOnChart())
	{
		return false;
	}

	if(this.isSummaryOrAggregateCell())
	{
		return false;
	}

	if (!selectionController.selectionsInSameDataContainer())
	{
		return false;
	}

	// different rules for lists and crosstabs
	if (selectionController.getDataContainerType() == "list")
	{
		return this.listRules(selectionController);
	}
	else if (selectionController.getDataContainerType() == "crosstab" && ! this.isLastSelectionSingleDimensionNested())
	{
		return this.crosstabRules(selectionController);
	}

	return false;
};

CalculationAction.prototype.updateMenu = function(toolbarItem,updateMenucallback)
{
	toolbarItem.visible = this.ifContainsInteractiveDataContainer();
	if (! toolbarItem.visible)
	{
		return toolbarItem;
	}

	if (! this.areCalculationsPossible())
	{
		return this.toggleMenu(toolbarItem, false);
	}

	this.toggleMenu(toolbarItem, true);

	if(this.m_oCV.aQoSFunctions) {
		toolbarItem = this.buildCalculationMenuItemsAgainstSelection(toolbarItem);
	} else {
		toolbarItem = this.buildDynamicMenuItem(toolbarItem, "Calculation");
	}

	return toolbarItem;
};

CalculationAction.prototype.toggleMenu = function(toolbarItem, enabled)
{
	if (enabled)
	{
		toolbarItem.iconClass = "calculate";
		toolbarItem.disabled = false;
	}
	else
	{
		toolbarItem.iconClass = "calculateDisabled";
		toolbarItem.disabled = true;
	}
	return toolbarItem;
};

CalculationAction.prototype.buildMenu = function(toolbarItem, buildMenuCallback)
{
	toolbarItem.visible = this.ifContainsInteractiveDataContainer();
	if (! toolbarItem.visible)
	{
		return toolbarItem;
	}

	if (! this.areCalculationsPossible())
	{
		return this.toggleMenu(toolbarItem, false);
	}

	this.toggleMenu(toolbarItem, true);

	// check to see if we have the QoS properies, if not, go fetch them
	var viewerObject = this.getCognosViewer();

	if(typeof viewerObject.aQoSFunctions == "undefined")
	{
		// bux context menu's don't support asynch callback yet, once the fix is in to support it, we have to do this request synchrounously.
		this.fetchQoS(toolbarItem, buildMenuCallback, (typeof buildMenuCallback == "undefined") ? false : true);
	}

	if (typeof viewerObject.aQoSFunctions != "undefined")
	{
		return this.buildCalculationMenuItemsAgainstSelection(toolbarItem);
	}
};

CalculationAction.prototype.fetchQoS = function(toolbarItem, buildMenuCallback, asynch) {
	var callbacks = {
		customArguments: [toolbarItem, buildMenuCallback],
		"complete": {"object": this, "method": this.handleQoSResponse}
	};

	var asynchRequest = new AsynchJSONDispatcherEntry(this.m_oCV);
	asynchRequest.setCallbacks(callbacks);

	asynchRequest.addFormField("ui.action", "getQualityOfService");
	asynchRequest.addFormField("parameterValues", this.m_oCV.getExecutionParameters());
	asynchRequest.addFormField("bux", "true");

	asynchRequest.addNonEmptyStringFormField("modelPath", this.m_oCV.getModelPath());
	asynchRequest.addDefinedFormField("metaDataModelModificationTime", this.m_oCV.envParams["metaDataModelModificationTime"]);

	if (!asynch) {
		asynchRequest.forceSynchronous();
	}

	this.m_oCV.dispatchRequest(asynchRequest);
};

CalculationAction.prototype.handleQoSResponse = function(asynchJSONResponse, toolbarItem, buildMenuCallback)
{
	this.m_oCV.aQoSFunctions = asynchJSONResponse.getResult();
	this.buildCalculationMenuItemsAgainstSelection(toolbarItem, buildMenuCallback);
	if (typeof buildMenuCallback == "function") {
		buildMenuCallback();
	}
};

CalculationAction.prototype.buildCalculationMenuItemsAgainstSelection = function(toolbarItem, buildMenuCallback)
{
	var aCalculations = this.m_oCV.aBuxCalculations;
	var calcItems = [];

	for (var calcIndex=0; calcIndex < aCalculations.length; calcIndex++)
	{
		var calc = this.m_oCV.getCalculation(aCalculations[calcIndex]);

		// There might be some cases (GetQualityOfServer request is generated and async is forced) where this.m_oCV.aQoSFunctions is null because asynchJSONResponse.getResult() returns null (see COGCQ00261753).
		// This is a highly unlikly situation and the below condition is a safty net, just in case something goes really bad.
		// So, if this is the case we do not alow any calculations.
		if (this.m_oCV.aQoSFunctions == null || typeof this.m_oCV.aQoSFunctions == "undefined")
		{
			toolbarItem.disabled = true;
			toolbarItem.iconClass = "calculate";
			toolbarItem.items = null;
			return toolbarItem;
		}

		if (calc && calc.validSelectionLength(this.getCognosViewer().getSelectionController()) && this.m_oCV.aQoSFunctions.toString().indexOf(aCalculations[calcIndex]) != -1)
		{
			var newCalcItem = {};
			newCalcItem.name = aCalculations[calcIndex];
			newCalcItem.label = calc.getMenuItemString(true);
			newCalcItem.action = {};

			var sIconClass = "";
			if (aCalculations[calcIndex].indexOf("SwapOrder") != -1)
			{
				sIconClass = aCalculations[calcIndex].substring(0, aCalculations[calcIndex].indexOf("SwapOrder"));
			}
			else
			{
				sIconClass = aCalculations[calcIndex];
			}
			newCalcItem.iconClass = sIconClass;

			if(this.getNumberOfSelections() == 1)
			{
				newCalcItem.action.name = "ConstantOperandCalculation";
				newCalcItem.action.payload = aCalculations[calcIndex];

			}
			else
			{
				newCalcItem.action.name = aCalculations[calcIndex];
				newCalcItem.action.payload = "";
			}

			if(newCalcItem.action.name == "PercentDifferenceCalculation")
			{
				calcItems.push({separator: true});
			}

			newCalcItem.items = null;
			calcItems.push(newCalcItem);
		}
	}

	if(calcItems.length == 0)
	{
		this.toggleMenu(toolbarItem, false);
		calcItems.push({name: "None", label: RV_RES.IDS_JS_CALCULATION_SELECT_DATA, iconClass: "", action: null, items: null });
	} else {
		this.toggleMenu(toolbarItem, true);
	}
	toolbarItem.items = calcItems;

	return toolbarItem;
};


/**
 * Percent Difference calculation
 */
function PercentDifferenceCalculationAction(){
	this.m_sAction = "PercentDifference";
	this.m_menuBuilderClass = "PercentDifferenceCalculation";
}
PercentDifferenceCalculationAction.prototype = new CalculationAction();

/**
 * Percent Different with reversed order of selection
 */
function PercentDifferenceCalculationSwapOrderAction() {
	this.m_sAction = "PercentDifference";
	this.m_menuBuilderClass = "PercentDifferenceCalculationSwapOrder";
	this.m_swapSelectionOrder = true;
}
PercentDifferenceCalculationSwapOrderAction.prototype = new CalculationAction();

/**
 * Addition calculation
 */
function AdditionCalculationAction(){
	this.m_sAction = "Addition";
	this.m_menuBuilderClass = "AdditionCalculation";
}
AdditionCalculationAction.prototype = new CalculationAction();

/**
 * Subtraction calculation
 */
function SubtractionCalculationAction(){
	this.m_sAction = "Subtraction";
	this.m_menuBuilderClass = "SubtractionCalculation";
}
SubtractionCalculationAction.prototype = new CalculationAction();


/**
 * Subtraction calculation with reversed selection (i.e. A-B vs B-A)
 */
function SubtractionCalculationSwapOrderAction() {
	this.m_sAction = "Subtraction";
	this.m_menuBuilderClass = "SubtractionCalculationSwapOrder";

	this.m_swapSelectionOrder = true;
}
SubtractionCalculationSwapOrderAction.prototype = new CalculationAction();

/**
 * Multiplication calculation
 */
function MultiplicationCalculationAction(){
	this.m_sAction = "Multiplication";
	this.m_menuBuilderClass = "MultiplicationCalculation";
}
MultiplicationCalculationAction.prototype = new CalculationAction();

/**
 * Division calculation
 */
function DivisionCalculationAction(){
	this.m_sAction = "Division";
	this.m_menuBuilderClass = "DivisionCalculation";
}
DivisionCalculationAction.prototype = new CalculationAction();

/**
 * Division calculation with reversed selection (i.e. A / B vs. B / A)
 * @return
 */
function DivisionCalculationSwapOrderAction() {
	this.m_sAction = "Division";
	this.m_menuBuilderClass = "DivisionCalculationSwapOrder";
	this.m_swapSelectionOrder = true;
}
DivisionCalculationSwapOrderAction.prototype = new CalculationAction();

function ConstantOperandCalculationAction()
{
	this.m_action = null;
}

ConstantOperandCalculationAction.prototype = new CognosViewerAction();

ConstantOperandCalculationAction.prototype.setRequestParms = function(payload)
{
	this.m_action = payload;
};

ConstantOperandCalculationAction.prototype.execute = function()
{
	var cognosViewerObjectString = getCognosViewerObjectString(this.m_oCV.getId());
	var action = this.m_action;
	var calculation = this.m_oCV.getCalculation(action);
	var menuItemString = calculation.getMenuItemString(true);
	var dialogTitle = RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER_TITLE;
	var dialogDescription = RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER_DESCRIPTION;
	dialogDescription = dialogDescription.substring(0, dialogDescription.indexOf("{0}")) + menuItemString + dialogDescription.substring(dialogDescription.indexOf("{0}") + 3);
	var enterNumberLabel = RV_RES.IDS_JS_CALCULATE_ENTER_NUMBER;
    var contentLocale = this.m_oCV.envParams["contentLocale"];
	
	var calculationDialog = new viewer.dialogs.CalculationDialog({
		sTitle:dialogTitle,
		sLabel:enterNumberLabel,
		sDescription:dialogDescription,
		sContentLocale : contentLocale,
		okHandler: function(value)
		{
			window[cognosViewerObjectString].executeAction(action, {constant:value});
		},
		cancelHandler: function() {}
	});
	calculationDialog.startup();
	window.setTimeout(function () { calculationDialog.show(); },0);
};
