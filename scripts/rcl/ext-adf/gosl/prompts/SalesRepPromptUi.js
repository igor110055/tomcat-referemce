//-----------------------------------------------------------------------------
/**
 * I am the UI controller for this prompt screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function SalesRepPromptUiController (aDocument)
{
   if (arguments.length > 0)
   {
      SalesRepPromptUiController.superclass.constructor.call(this, aDocument);
   }
}

//--- inheritance chain...
SalesRepPromptUiController.prototype = new AbstractCustomPromptUiController();
SalesRepPromptUiController.prototype.constructor = SalesRepPromptUiController;
SalesRepPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI (reset it to appropriate state, based on previously stored params)
**/
SalesRepPromptUiController.prototype.initUi = function()
{
   var config = {
      title: 'Salesperson',
      enableButtons: true,
      frame: true,
      height: 300
   };

   this.salesPersonListbox = new Adf.widgets.ListBoxWidget(config);
   this.salesPersonListbox.on('selectAll', function(){this.selectAll();}, this.salesPersonListbox);
   this.salesPersonListbox.on('clearAll', function(){this.clearSelections();}, this.salesPersonListbox);

   var mainPanel = new Ext.Viewport({
      renderTo: Ext.getBody(),
      layout: 'border',
      items: [{
         xtype: 'panel',
         region: 'center',
         title: applicationResources.getProperty('prompt.salesRep.subTitle'),
         padding: 10,
         margins: {
            top: 10,
            left: 10,
            bottom: 10,
            right: 10
         },
         items: [this.salesPersonListbox]
      }]
   });


   this.initSalesRepList();


   //--- base class initUi...
   SalesRepPromptUiController.superclass.initUi.call(this);
};

SalesRepPromptUiController.prototype.initSalesRepList = function()
{
   RequestUtil.request({
      url: ServerEnvironment.baseUrl + '/secure/actions/ext/getSalesReps.do',
      scope: this,
      success: function(aResponse, aOptions){

         var data = Ext.decode(aResponse.responseText);
         var o = {
            listBoxItems: [],
            fn: function(aItem, aIndex, aAllItems){
               this.listBoxItems.push({
                  value: aItem.fullName,
                  text: aItem.fullName
               });
            }
         };
         Ext.each(data.salesReps, o.fn, o);

         this.salesPersonListbox.getStore().loadData({listBoxItems: o.listBoxItems});

         var paramSet = this.getRei().parameterSet;
         var param = paramSet.getParameter("SalesRep");
         if (!Ext.isEmpty(param))
         {
            var paramValues = param.getRawValues();
            this.salesPersonListbox.view.select(paramValues);
         }
      }
   });
}

/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
SalesRepPromptUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
SalesRepPromptUiController.prototype.willSubmit = function()
{
   var paramSet = this.getRei().parameterSet;
   paramSet.clear();

   var selectedRecords = this.salesPersonListbox.getSelectedRecords();
   var o = {
      paramValues: [],
      fn: function(aItem, aIndex, aAllItems)
      {
         this.paramValues.push(new ConcreteReportParameterValue(aItem.data.text, aItem.data.value))
      }
   };
   Ext.each(selectedRecords, o.fn, o);

   var reportParameter = new ReportParameter('SalesRep', o.paramValues, 'GenericString');
   paramSet.addParameter(reportParameter);
};

