//-----------------------------------------------------------------------------
/**
 * I am the UI model for the product hierarchy screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProductHierarchyPromptDivListUiModel (aCatalog)
{
   this.catalog = aCatalog;
}


//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the product hierarchy screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProductHierarchyPromptDivListUiController (aDocument, aModel)
{
   AbstractCustomPromptUiController.prototype.constructor.call(this, aDocument);

   this.model = aModel;

   //--- set during initUi...
   this.multiSelectProductLine = true;
   this.multiSelectProductType = true;
   this.multiSelectProduct = true;

   this.hideProductLine = false;
   this.hideProductType = false;
   this.hideProduct = false;
}

//--- inheritance chain...
ProductHierarchyPromptDivListUiController.prototype = new AbstractCustomPromptUiController();
ProductHierarchyPromptDivListUiController.prototype.constructor = ProductHierarchyPromptDivListUiController;
ProductHierarchyPromptDivListUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI : sets the state of this custom prompt to reflect the starting
* selections.
**/
ProductHierarchyPromptDivListUiController.prototype.initUi = function()
{
   //--- Call out to Harness to get "starting" parameter set...
   var paramSet = this.getRei().parameterSet;

   var productLineParam = paramSet.getParameter("ProductLine");
   var productTypeParam = paramSet.getParameter("ProductType");
   var productParam = paramSet.getParameter("Product");

   var productLineInitialValues = (JsUtil.isGood(productLineParam) && productLineParam.values.length > 0) ? productLineParam.values : null;
   var productTypeInitialValues = (JsUtil.isGood(productTypeParam) && productTypeParam.values.length > 0) ? productTypeParam.values : null;
   var productInitialValues = (JsUtil.isGood(productParam) && productParam.values.length > 0) ? productParam.values : null;

   //--- cascading DivLists...
   var productLineValueProvider = new CrnDialogValueProvider("/content/package[@name='GO Sales and Retailers']", "[gosales_goretailers].[Products].[Product line code]", "[gosales_goretailers].[Products].[Product line]", true, null, 23, null, null);
   this.productLineList = new DivList(document, "productLineList", "150px", (this.multiSelectProductLine ? 1000 : 1), productLineInitialValues, new DivList.SimpleFieldExtractor("value", "displayText"), productLineValueProvider);
   this.productLineList.emptyMessage = '(Select a Product Line)';
//   this.productLineList = new DivList(document, "productLineList", "150px", (this.multiSelectProductLine ? 1000 : 1), productLineInitialValues, new DivList.SimpleFieldExtractor("value", "displayText"), productLineValueProvider, {
//      emptyMessage: '(Select a Product Line)'
//   });


   var productTypeValueProvider = new CrnDialogValueProvider("/content/package[@name='GO Sales and Retailers']", "[gosales_goretailers].[Products].[Product type code]", "[gosales_goretailers].[Products].[Product type]", true, null, 23, null, null);
   productTypeValueProvider.addCascade(this.productLineList);
   this.productTypeList = new DivList(document, "productTypeList", "150px", (this.multiSelectProductType ? 1000 : 1), productTypeInitialValues, new DivList.SimpleFieldExtractor("value", "displayText"), productTypeValueProvider);
   this.productTypeList.emptyMessage = '(Select a Product Type)';

   var productValueProvider = new CrnDialogValueProvider("/content/package[@name='GO Sales and Retailers']", "[gosales_goretailers].[Products].[Product number]", "[gosales_goretailers].[Products].[Product name]", true, null, 23, null, null);
   productValueProvider.addCascade(this.productTypeList);
   this.productList  = new DivList(document, "productList", "150px", (this.multiSelectProduct ? 1000 : 1), productInitialValues, new DivList.SimpleFieldExtractor("value", "displayText"), productValueProvider);
   this.productList.emptyMessage = '(Select a Product)';


   //--- initial draw...
   this.productLineList.refreshView();
   this.productTypeList.refreshView();
   this.productList.refreshView();


   //--- base class initUi...
   ProductHierarchyPromptDivListUiController.superclass.initUi.call(this);
};



/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
ProductHierarchyPromptDivListUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
ProductHierarchyPromptDivListUiController.prototype.willSubmit = function()
{
   //--- harvest current parameter selections...
   var selectedProductLines = this.productLineList.getSelectedItems();
   var selectedProductTypes = this.productTypeList.getSelectedItems();
   var selectedProducts     = this.productList.getSelectedItems();

   //--- Call out to Harness and reset the Parameters to reflect current selections 
   var paramSet = this.getRei().parameterSet;
   paramSet.clear();
   
   paramSet.addParameter(new ReportParameter("ProductLine", this.convertDivListItemsToParamValues(selectedProductLines), 'GenericString'));
   paramSet.addParameter(new ReportParameter("ProductType", this.convertDivListItemsToParamValues(selectedProductTypes), 'GenericString'));
   paramSet.addParameter(new ReportParameter("Product", this.convertDivListItemsToParamValues(selectedProducts), 'GenericString'));


};

ProductHierarchyPromptDivListUiController.prototype.convertDivListItemsToParamValues = function(aItems)
{
   var paramValues = [];

   for (var i = 0; i < aItems.length; ++i)
   {
      paramValues.push(new ConcreteReportParameterValue(aItems[i].text, aItems[i].value));
   }

   return paramValues;
};

