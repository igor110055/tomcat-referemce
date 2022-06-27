/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the product comparison prompt screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProductComparisonPromptUiController (aDocument)
{
   AbstractCustomPromptUiController.prototype.constructor.call(this, aDocument);

   //--- set during initUi...
//   this.select1 = null;
//   this.select2 = null;
}

//--- inheritance chain...
ProductComparisonPromptUiController.prototype = new AbstractCustomPromptUiController();
ProductComparisonPromptUiController.prototype.constructor = ProductComparisonPromptUiController;
ProductComparisonPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
ProductComparisonPromptUiController.prototype.initUi = function()
{
   this.productList1 = new Ext.form.ComboBox({
      fieldLabel: applicationResources.getProperty('prompt.productComparison.product1'),
      typeAhead: true,
      triggerAction: 'all',
      lazyRender: false,
      mode: 'local',
      store: new Ext.data.JsonStore({
         root: 'allProducts',
         fields: [
            'name',
            'value'
         ]
      }),
      valueField: 'value',
      displayField: 'name'
   });

   this.productList2 = new Ext.form.ComboBox({
      fieldLabel: applicationResources.getProperty('prompt.productComparison.product2'),
      typeAhead: true,
      triggerAction: 'all',
      lazyRender: false,
      mode: 'local',
      store: new Ext.data.JsonStore({
         root: 'allProducts',
         fields: [
            'name',
            'value'
         ]
      }),
      valueField: 'value',
      displayField: 'name'
   });

   this.mainPanel = new Ext.Panel({
      renderTo: Ext.getBody(),
      title: applicationResources.getProperty('prompt.productComparison.title'),
      bodyStyle: 'padding: 20px 10px 20px 10px',
      layout: 'form',
      items: [{
         xtype: 'fieldset',
         title: applicationResources.getProperty('prompt.productComparison.pickTwoProducts'),
         items: [this.productList1, this.productList2]
      }],
      listeners: {
         scope: this,
         afterrender: this.onMainPanelRender
      }
   });

};


/**
 * This method fills the products lists with data when the main panel is rendered.
 */
ProductComparisonPromptUiController.prototype.onMainPanelRender = function()
{
   RequestUtil.request({
      url: ServerEnvironment.baseUrl + "/secure/actions/ext/productComparisonPrompt/getAllProducts.do",
      scope: this,
      success: function(aResponse, aOpts)
      {
         var paramSet = this.getRei().parameterSet;

         var product1Param = paramSet.getParameter("Product1");
         var product2Param = paramSet.getParameter("Product2");

         var result = Ext.decode(aResponse.responseText);

         this.productList1.getStore().loadData(result);
         if (this.productList1.getStore().getCount() > 0)
         {
            if (JsUtil.isGood(product1Param))
            {
               this.productList1.setValue(product1Param.getRawValues()[0]);
            }
            else
            {
               this.productList1.setValue(result.allProducts[0].value);
            }
         }

         this.productList2.getStore().loadData(result);
         if (this.productList2.getStore().getCount() > 0)
         {
            if (JsUtil.isGood(product2Param))
            {
               this.productList2.setValue(product2Param.getRawValues()[0]);
            }
            else
            {
               this.productList2.setValue(result.allProducts[0].value);
            }
         }
      }
   });
}

/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
ProductComparisonPromptUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
ProductComparisonPromptUiController.prototype.willSubmit = function()
{
   var productValue1 = this.productList1.getValue();
   var productValue2 = this.productList2.getValue();

   var paramSet = this.getRei().parameterSet;

   paramSet.addParameter(ReportParameter.createSingleConcreteParameter("Product1", null, productValue1));
   paramSet.addParameter(ReportParameter.createSingleConcreteParameter("Product2", null, productValue2));
};

