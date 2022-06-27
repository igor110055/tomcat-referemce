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
function ProductLinePromptUiController (aDocument)
{
   AbstractCustomPromptUiController.prototype.constructor.call(this, aDocument);

   //--- set during initUi...
   this.productLineSelect = null;
}

//--- inheritance chain...
ProductLinePromptUiController.prototype = new AbstractCustomPromptUiController();
ProductLinePromptUiController.prototype.constructor = ProductLinePromptUiController;
ProductLinePromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
ProductLinePromptUiController.prototype.initUi = function()
{

   this.productList1 = new Ext.form.ComboBox({
      fieldLabel: 'Product Line',
      typeAhead: true,
      triggerAction: 'all',
      lazyRender: false,
      mode: 'local',
      store: new Ext.data.JsonStore({
         root: 'allProductLines',
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
      title: applicationResources.getProperty('prompt.productLine.subtitle'),
      bodyStyle: 'padding: 20px 10px 20px 10px',
      layout: 'form',
      items: [this.productList1],
      listeners: {
         scope: this,
         afterrender: this.onMainPanelRender
      }
   });
};

/**
 * This method fills the product lines lists with data when the main panel is rendered.
 */
ProductLinePromptUiController.prototype.onMainPanelRender = function()
{
   RequestUtil.request({
      url: ServerEnvironment.baseUrl + "/secure/actions/ext/productLinePrompt/getProducts.do",
      scope: this,
      success: function(aResponse, aOpts)
      {
         var paramSet = this.getRei().parameterSet;

         var product1Param = paramSet.getParameter("Product Line");

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
               this.productList1.setValue(result.allProductLines[0].value);
            }
         }
      }
   });
}


/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
ProductLinePromptUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
ProductLinePromptUiController.prototype.willSubmit = function()
{
   var selected = this.productList1.getValue();
   var paramSet = this.getRei().parameterSet;

   paramSet.addParameter(ReportParameter.createSingleConcreteParameter("Product Line", null, selected));
};

