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

//   //--- cascading listboxes...
//   this.productLineList = new JsListBox("productLineList", "productLineList", aModel.catalog.productLines, new SimpleFieldExtractor("id", "name"));
//   this.productTypeList = new JsListBox("productTypeList", "productTypeList", new Object(), new SimpleFieldExtractor("id", "name"));
//   this.productList     = new JsListBox("productList", "productList", new Object(), new SimpleFieldExtractor("id", "name"));
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

   this.productLineList  = new Adf.widgets.ListBoxWidget({
      title: applicationResources.getProperty('prompt.productHierarchy.productLine'),
      frame: true,
      enableButtons: true,
      width: 200,
      height: 300,
      listeners: {
         scope: this,
         selectionChange:  this.productLineSelectionChanged,
         selectAll:  this.selectAllProductLines,
         clearAll:  this.resetProductLines
      }
   });

   this.productLineList.getStore().loadData({
      listBoxItems: this.convertSrcItemsToListBoxItems(this.model.catalog.productLines)
   });
   this.productLineList.filterHasChanged();



   this.productTypeList  = new Adf.widgets.ListBoxWidget({
      title: applicationResources.getProperty('prompt.productHierarchy.productType'),
      frame: true,
      enableButtons: true,
      width: 200,
      height: 300,
      listeners: {
         scope: this,
         selectionChange:  this.productTypeSelectionChanged,
         selectAll:  this.selectAllProductTypes,
         clearAll:  this.resetProductTypes
      }
   });



   this.productList  = new Adf.widgets.ListBoxWidget({
      title: applicationResources.getProperty('prompt.productHierarchy.product'),
      frame: true,
      enableButtons: true,
      width: 250,
      height: 300,
      listeners: {
         scope: this,
         selectAll:  this.selectAllProducts,
         clearAll:  this.resetProducts
      }
   });


   this.mainPanel = new Ext.Panel({
      title: applicationResources.getProperty('prompt.productHierarchy.title'),
      renderTo: Ext.getBody(),
      layout: 'hbox',
      layoutConfig: {
         defaultMargins: {
            top: 0,
            left: 0,
            right: 4,
            bottom: 0
         }
      },
      bodyStyle: 'padding: 20px 10px 20px 10px',
      items: [this.productLineList, this.productTypeList, this.productList]
   });




   var paramSet = this.getRei().parameterSet;


   var productLineParam = paramSet.getParameter("ProductLine");
   var productTypeParam = paramSet.getParameter("ProductType");
   var productParam = paramSet.getParameter("Product");



   //--- pre-select any param values that are part of the starting REI...
   if (JsUtil.isGood(productLineParam) && productLineParam.values.length > 0)
   {
      this.selectItemsFromValues(this.productLineList, productLineParam.getRawValues());
      this.productLineSelectionChanged();
   }

   if (JsUtil.isGood(productTypeParam) && productTypeParam.values.length > 0)
   {
      this.selectItemsFromValues(this.productTypeList, productTypeParam.getRawValues());
      this.productTypeSelectionChanged();
   }

   if (JsUtil.isGood(productParam) && productParam.values.length > 0)
   {
      this.selectItemsFromValues(this.productList, productParam.getRawValues());
   }



   if (this.hideProductLine == true)
   {
      this.selectAllProductLines();
   }
   if (this.hideProductType == true)
   {
      this.selectAllProductTypes();
   }


   //--- base class initUi...
   ProductHierarchyPromptUiController.superclass.initUi.call(this);
};


/**
 * called when the productLine listbox changes...
 **/
ProductHierarchyPromptUiController.prototype.productLineSelectionChanged = function()
{
   var selectedProductLines = this.getSelectedItems(this.productLineList)

   var newListItems = new Object();

   var eachProductLine;
   for (var i = 0; i < selectedProductLines.length; ++i)
   {
      eachProductLine = selectedProductLines[i].srcObject;

      JsUtil.copyObjectProperties(eachProductLine.productTypes, newListItems);
   }

   this.productTypeList.getStore().loadData({
      listBoxItems: this.convertSrcItemsToListBoxItems(newListItems)
   });
   this.productTypeList.filterHasChanged();

   //--- invalidate far left...
   this.productTypeSelectionChanged();
};

/**
 * called when the productType listbox changes...
 **/
ProductHierarchyPromptUiController.prototype.productTypeSelectionChanged = function()
{
   var selectedProductTypes = this.getSelectedItems(this.productTypeList);

   var newListItems = new Object();

   var eachProductType;
   for (var i = 0; i < selectedProductTypes.length; ++i)
   {
      eachProductType = selectedProductTypes[i].srcObject;

      JsUtil.copyObjectProperties(eachProductType.products, newListItems);
   }

   this.productList.getStore().loadData({
      listBoxItems: this.convertSrcItemsToListBoxItems(newListItems)
   });
   this.productList.filterHasChanged();
};


ProductHierarchyPromptUiController.prototype.selectAllProductLines = function()
{
   this.productLineList.selectAll();
   this.productLineSelectionChanged();
};

ProductHierarchyPromptUiController.prototype.resetProductLines = function()
{
   this.productLineList.clearSelections();
   this.productLineSelectionChanged();
};

ProductHierarchyPromptUiController.prototype.selectAllProductTypes = function()
{
   this.productTypeList.selectAll();
   this.productTypeSelectionChanged();
};

ProductHierarchyPromptUiController.prototype.resetProductTypes = function()
{
   this.productTypeList.clearSelections();
   this.productTypeSelectionChanged();
};

ProductHierarchyPromptUiController.prototype.selectAllProducts = function()
{
   this.productList.selectAll();
};

ProductHierarchyPromptUiController.prototype.resetProducts = function()
{
   this.productList.clearSelections();
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
   var selectedProductLines = this.getSelectedItems(this.productLineList);
   var selectedProductTypes = this.getSelectedItems(this.productTypeList);
   var selectedProducts     = this.getSelectedItems(this.productList);

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


ProductHierarchyPromptUiController.prototype.convertSrcItemsToListBoxItems = function(aSourceItems)
{
   var fieldExtractor = new SimpleFieldExtractor("id", "name");
   var listBoxItems = [];

   if (!Ext.isEmpty(aSourceItems))
   {
      if (Ext.isArray(aSourceItems))
      {
         for (var i = 0; i < aSourceItems.length; i++)
         {
            var arrayItem = fieldExtractor.extractListBoxItem(aSourceItems[i]);
            arrayItem.srcObject = aSourceItems[i];
            listBoxItems.push(arrayItem);
         }
      }
      else
      {
         for (var key in aSourceItems)
         {
            var objItem = fieldExtractor.extractListBoxItem(aSourceItems[key]);
            objItem.srcObject = aSourceItems[key];
            listBoxItems.push(objItem);
         }
      }
   }

   return listBoxItems;
};

ProductHierarchyPromptUiController.prototype.selectItemsFromValues = function (aListBoxWidget, aItemsToSelect)
{
   if (Ext.isArray(aItemsToSelect))
   {
      var itemIndexes = [];
      for (var i = 0; i < aItemsToSelect.length; i++)
      {
         var searchResult = {
            searchValue: aItemsToSelect[i],
            itemIndex: -1
         };

         // Don't use findExact() find the record because it uses === to compare values an integer 2 and a string "2"
         // do not match.
         aListBoxWidget.getStore().each(function(aRecord){
            if (aRecord.data.value == this.searchValue)
            {
               this.itemIndex = aRecord.store.indexOf(aRecord);
               return false;
            }
         }, searchResult);

         if (searchResult.itemIndex > -1)
         {
            itemIndexes.push(searchResult.itemIndex);
         }
      }
      if (itemIndexes.length > 0)
      {
         aListBoxWidget.view.select(itemIndexes, false, false);
      }
   }
};


ProductHierarchyPromptUiController.prototype.getSelectedItems = function (aListBoxWidget)
{
   var selectedRecords = aListBoxWidget.view.getSelectedRecords();
   var o = {selectedItems: []};
   Ext.each(selectedRecords, function(aItem, aIndex, aAllItems){
      this.selectedItems.push(aItem.json);
   }, o);
   return o.selectedItems;
};
