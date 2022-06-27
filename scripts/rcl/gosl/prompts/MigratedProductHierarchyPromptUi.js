//-----------------------------------------------------------------------------
/**
 * I am the UI model for the product hierarchy screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProductHierarchyPromptUiModel (aCatalog)
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
function ProductHierarchyPromptUiController (aDocument, aModel)
{
   AbstractCustomPromptUiController.prototype.constructor.call(this, aDocument);

   this.model = aModel;

   //--- set during initUi...
   this.multiSelectProductLine = false;
   this.multiSelectProductType = false;
   this.multiSelectProduct = false;

   this.hideProductLine = false;
   this.hideProductType = false;
   this.hideProduct = false;

   //--- cascading listboxes...
   this.productLineList = new JsListBox("productLineList", "productLineList", aModel.catalog.productLines, new SimpleFieldExtractor("id", "name"));
   this.productTypeList = new JsListBox("productTypeList", "productTypeList", new Object(), new SimpleFieldExtractor("id", "name"));
   this.productList     = new JsListBox("productList", "productList", new Object(), new SimpleFieldExtractor("id", "name"));

//   this.productLineList.on('moveTop', this.productLineMoveTop, this);
//   this.productLineList.on('moveBottom', this.productLineMoveBottom, this);
//   this.productLineList.on('moveUp', this.productLineMoveUp, this);
//   this.productLineList.on('moveDown', this.productLineMoveDown, this);

//   this.productLineList = new JsListBox("productLineList", "productLineList", aModel.catalog.productLines, new SimpleFieldExtractor("id", "name"), {enableButtons: true, title: 'Products', frame: false, selectAllCallback: this.selectAllProductLines, resetAllCallback: this.resetProductLines, callbackScope: this});
//   this.productTypeList = new JsListBox("productTypeList", "productTypeList", new Object(), new SimpleFieldExtractor("id", "name"), {title: 'bbb'});
//   this.productList     = new JsListBox("productList", "productList", new Object(), new SimpleFieldExtractor("id", "name"), {enableButtons: true, frame: false});
}

//--- inheritance chain...
ProductHierarchyPromptUiController.prototype = new AbstractCustomPromptUiController();
ProductHierarchyPromptUiController.prototype.constructor = ProductHierarchyPromptUiController;
ProductHierarchyPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
 * initialize the UI
 **/
ProductHierarchyPromptUiController.prototype.initUi = function()
{
   var paramSet = this.getRei().parameterSet;


   //--- initial draw...
   this.productLineList.refreshView();
   this.productTypeList.refreshView();
   this.productList.refreshView();


   var productLineParam = paramSet.getParameter("ProductLine");
   var productTypeParam = paramSet.getParameter("ProductType");
   var productParam = paramSet.getParameter("Product");



   //--- pre-select any param values that are part of the starting REI...
   if (JsUtil.isGood(productLineParam) && productLineParam.values.length > 0)
   {
      this.productLineList.selectItemsFromValues(productLineParam.getRawValues());
      this.productLineSelectionChanged();
   }

   if (JsUtil.isGood(productTypeParam) && productTypeParam.values.length > 0)
   {
      this.productTypeList.selectItemsFromValues(productTypeParam.getRawValues());
      this.productTypeSelectionChanged();
   }

   if (JsUtil.isGood(productParam) && productParam.values.length > 0)
   {
      this.productList.selectItemsFromValues(productParam.getRawValues());
   }



   if (this.hideProductLine == true)
   {
      this.selectAllProductLines();
   }
   if (this.hideProductType == true)
   {
      this.selectAllProductTypes();
   }

   // Test code.
   this.testList1 = new JsListBox("testList1", "testList1", this.model.catalog.productLines, new SimpleFieldExtractor("id", "name"));
   this.testList1.refreshView();
   this.testremoveSelectedButton = new Ext.Button({
      text: 'removeSelected',
      renderTo: 'testButtons1',
      scope: this,
      handler: function()
      {
         this.testList1.removeSelected();
      }
   });
   this.testRemoveAllButton = new Ext.Button({
      text: 'removeAll',
      renderTo: 'testButtons1',
      scope: this,
      handler: function()
      {
         this.testList1.removeAll();
      }
   });

   //--- base class initUi...
   ProductHierarchyPromptUiController.superclass.initUi.call(this);
};


/**
 * called when the productLine listbox changes...
 **/
ProductHierarchyPromptUiController.prototype.productLineSelectionChanged = function()
{
   var selectedProductLines = this.productLineList.getSelectedItems();

   var newListItems = new Object();

   var eachProductLine;
   for (var i = 0; i < selectedProductLines.length; ++i)
   {
      eachProductLine = selectedProductLines[i].srcObject;

      JsUtil.copyObjectProperties(eachProductLine.productTypes, newListItems);
   }

   this.productTypeList.resetAvailableItems(newListItems);
   this.productTypeList.refreshView();

   //--- invalidate far left...
   this.productTypeSelectionChanged();
};

/**
 * called when the productType listbox changes...
 **/
ProductHierarchyPromptUiController.prototype.productTypeSelectionChanged = function()
{
   var selectedProductTypes = this.productTypeList.getSelectedItems();

   var newListItems = new Object();

   var eachProductType;
   for (var i = 0; i < selectedProductTypes.length; ++i)
   {
      eachProductType = selectedProductTypes[i].srcObject;

      JsUtil.copyObjectProperties(eachProductType.products, newListItems);
   }

   this.productList.resetAvailableItems(newListItems);
   this.productList.refreshView();
};


ProductHierarchyPromptUiController.prototype.selectAllProductLines = function()
{
   this.productLineList.selectAll();
   this.productLineSelectionChanged();
};

ProductHierarchyPromptUiController.prototype.resetProductLines = function()
{
   this.productLineList.deselectAll();
   this.productLineSelectionChanged();
};

ProductHierarchyPromptUiController.prototype.selectAllProductTypes = function()
{
   this.productTypeList.selectAll();
   this.productTypeSelectionChanged();
};

ProductHierarchyPromptUiController.prototype.resetProductTypes = function()
{
   this.productTypeList.deselectAll();
   this.productTypeSelectionChanged();
};

ProductHierarchyPromptUiController.prototype.selectAllProducts = function()
{
   this.productList.selectAll();
};

ProductHierarchyPromptUiController.prototype.resetProducts = function()
{
   this.productList.deselectAll();
};


/**
 * hook for derived classes to cancel a submit (usually do to some sort
 * of validation error).  Return false to cancel submission, true to allow it.
 **/
ProductHierarchyPromptUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
 * hook for derived classes: submission is imminent, update anything that
 * needs to be submitted
 **/
ProductHierarchyPromptUiController.prototype.willSubmit = function()
{
   var selectedProductLines = this.productLineList.getSelectedItems();
   var selectedProductTypes = this.productTypeList.getSelectedItems();
   var selectedProducts     = this.productList.getSelectedItems();

   var paramSet = this.getRei().parameterSet;
   paramSet.clear();

   paramSet.addParameter(new ReportParameter("ProductLine", this.convertListBoxItemsToParamValues(selectedProductLines), 'GenericString'));
   paramSet.addParameter(new ReportParameter("ProductType", this.convertListBoxItemsToParamValues(selectedProductTypes), 'GenericString'));
   paramSet.addParameter(new ReportParameter("Product", this.convertListBoxItemsToParamValues(selectedProducts), 'GenericString'));


};

ProductHierarchyPromptUiController.prototype.convertListBoxItemsToParamValues = function(aListBoxItems)
{
   var paramValues = [];

   for (var i = 0; i < aListBoxItems.length; ++i)
   {
      paramValues.push(new ConcreteReportParameterValue(aListBoxItems[i].text, aListBoxItems[i].value));
   }

   return paramValues;
};


ProductHierarchyPromptUiController.prototype.productLineMoveTop = function()
{
   this.productLineList.shiftSelectedToTop();
}


ProductHierarchyPromptUiController.prototype.productLineMoveBottom = function()
{
   this.productLineList.shiftSelectedToBottom();
}


ProductHierarchyPromptUiController.prototype.productLineMoveUp = function()
{
   this.productLineList.shiftSelectedUp();
}


ProductHierarchyPromptUiController.prototype.productLineMoveDown = function()
{
   this.productLineList.shiftSelectedDown();
}

