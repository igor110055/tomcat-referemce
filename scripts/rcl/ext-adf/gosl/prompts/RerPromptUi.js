
/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the geographic hierarchy screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function RerPromptUiController (aDocument)
{
   if (arguments.length > 0)
   {
      RerPromptUiController.superclass.constructor.call(this, aDocument);



      //--- setup in initUi...
      this.reports = null;
      this.startDate = null;
      this.endDate = null;
   }

}

//--- inheritance chain...
RerPromptUiController.prototype = new AbstractCustomPromptUiController();
RerPromptUiController.prototype.constructor = RerPromptUiController;
RerPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
RerPromptUiController.prototype.initUi = function()
{
   var paramSet = this.getRei().parameterSet;



   this.reports = new Adf.widgets.ListBoxWidget({
      title: 'Report',
      frame: true,
      store: new Ext.data.JsonStore({
         url: ServerEnvironment.baseUrl + '/secure/actions/ext/stats/rerPrompt/getReports.do',
         autoDestroy: true,
         root: 'reports',
         idProperty: 'id',
         fields: [{name: 'value', mapping: 'id'}, {name: 'text', mapping: 'name'}],
         autoLoad: {
            scope: this,
            callback: function(aRecords, aOpts, aSuccess){
               if (aSuccess)
               {
                  var reportsParam = paramSet.getParameter("Report");
                  if (!Ext.isEmpty(reportsParam))
                  {
                     var reportRawValues = reportsParam.getRawValues();
                     var reportParamValues = {
                        records: [],
                        store: this.reports.getStore(),
                        getRecords: function(aItem, aIndex, aAllItems)
                        {
                           var rec = this.store.getById(aItem);
                           if (!Ext.isEmpty(rec))
                           {
                              this.records.push(rec);
                           }
                        }
                     };

                     Ext.each(reportRawValues, reportParamValues.getRecords, reportParamValues);
                     this.reports.view.select(reportParamValues.records);
                  }
               }
            }

         }
      }),
      enableButtons: true,
      listeners: {
         scope: this,
         selectAll: function(){
            this.reports.selectAll();
         },
         clearAll: function(){
            this.reports.clearSelections();
         }
      },
      height: 200,
      width: 400
   });



   this.userLogons = new Adf.widgets.ListBoxWidget({
      title: 'User Logon',
      store: new Ext.data.JsonStore({
         url: ServerEnvironment.baseUrl + '/secure/actions/ext/stats/rerPrompt/getUsers.do',
         autoDestroy: true,
         root: 'userLogons',
         idProperty: 'logon',
         fields: [{name: 'value', mapping: 'logon'}, {name: 'text', mapping: 'logon'}],
         autoLoad: {
            scope: this,
            callback: function(aRecords, aOpts, aSuccess){
               if (aSuccess)
               {
                  var userLogonParam = paramSet.getParameter("UserLogon");
                  if (!Ext.isEmpty(userLogonParam))
                  {
                     var userLogonRawValues = userLogonParam.getRawValues();
                     var userLogonParamValues = {
                        records: [],
                        store: this.userLogons.getStore(),
                        getRecords: function(aItem, aIndex, aAllItems)
                        {
                           var rec = this.store.getById(aItem);
                           if (!Ext.isEmpty(rec))
                           {
                              this.records.push(rec);
                           }
                        }
                     };

                     Ext.each(userLogonRawValues, userLogonParamValues.getRecords, userLogonParamValues);
                     this.userLogons.view.select(userLogonParamValues.records);
                  }
               }
            }

         }
      }),
      frame: true,
      height: 200
   });


   this.minPdfSize = new Ext.form.NumberField({
      fieldLabel: 'Minimum PDF Size',
      name: 'minPdfSize',
      id: 'minPdfSize',
      allowDecimals: false,
      value: Ext.value(paramSet.getParameter("MinPdfSize"), '')
   });

   this.minHtmlSize = new Ext.form.NumberField({
      fieldLabel: 'Minimum HTML Size',
      name: 'minHtmlSize',
      id: 'minHtmlSize',
      allowDecimals: false,
      value: Ext.value(paramSet.getParameter("MinHtmlSize"), '')
   });

   var outputSizeSection = new Ext.form.FieldSet({
      title: 'Output Size',
      height: 90,
      width: 360,
      labelWidth: 160,
      items: [this.minPdfSize, this.minHtmlSize]
   });

   this.startDate = new Adf.DateParameterWidget({
      parameterName: "StartDate",
      title: applicationResources.getProperty("prompt.startDate"),
      parameterSet: paramSet,
      enableTimeField: true,
      timeInterval: 15,
      initialTimeValue: "00:00:00"
   });

   this.endDate = new Adf.DateParameterWidget({
      parameterName: "EndDate",
      title: applicationResources.getProperty("prompt.endDate"),
      parameterSet: paramSet,
      enableTimeField: true,
      timeInterval: 15,
      initialTimeValue: "23:59:59"
   });

   this.mainPanel = new Ext.Panel({
      title: 'Report Execution Prompt',
      renderTo: Ext.getBody(),

      items: [{
         xtype: 'panel',
         layout: 'hbox',
         border: false,
         height: 250,
         padding: 20,
         items: [this.reports, {
            xtype: 'panel',
            border: false,
            height: 250,
            width: 20
         }, this.userLogons]
      },{
         xtype: 'panel',
         layout: 'hbox',
         border: false,
         height: 300,
         padding: 20,
         items: [{
            xtype: 'panel',
            layout: 'form',
            border: false,
            height: 250,
            width: 400,
            items: [outputSizeSection]
         },{
            xtype: 'panel',
            border: false,
            height: 250,
            width: 20
         }, {
            border: false,
            xtype: 'panel',
            layout: 'vbox',
            height: 250,
            items: [this.startDate, this.endDate]
         }]
      }],
      listeners: {
         scope: this,
         afterrender: function()
         {
            var minPdfSizeParam = paramSet.getParameter("MinPdfSize");
            if (!Ext.isEmpty(minPdfSizeParam))
            {
               this.minPdfSize.setValue(minPdfSizeParam.getRawValues()[0]);
            }

            var minHtmlSizeParam = paramSet.getParameter("MinHtmlSize");
            if (!Ext.isEmpty(minHtmlSizeParam))
            {
               this.minHtmlSize.setValue(minHtmlSizeParam.getRawValues()[0]);
            }

            this.startDate.initFromParamValues();
            this.endDate.initFromParamValues();
         }
      }
   });

   //--- base class initUi...
   RerPromptUiController.superclass.initUi.call(this);

};




/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
RerPromptUiController.prototype.beforeSubmit = function()
{
   if(!this.startDate.validate("%Y-%m-%d", true))
   {
      Ext.MessageBox.alert("Start Date is invalid; Please enter a valid date using the format yyyy-mm-dd.");
      return false;
   }

   if(!this.endDate.validate("%Y-%m-%d", true))
   {
      Ext.MessageBox.alert("End Date is invalid; Please enter a valid date using the format yyyy-mm-dd.");
      return false;
   }

   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
RerPromptUiController.prototype.willSubmit = function()
{
   var paramSet = this.getRei().parameterSet;
   paramSet.clear();


   if (this.reports.view.getSelectionCount() > 0)
   {
      var reportsParam = {
         values: [],
         getValues: function(aItem, aIndex, aAllItems){
            this.values.push(new ConcreteReportParameterValue(aItem.data.text, aItem.data.value))
         }

      };
      Ext.each(this.reports.view.getSelectedRecords(), reportsParam.getValues, reportsParam);

      paramSet.addParameter(new ReportParameter("Report", reportsParam.values, 'GenericString'));
   }


   if (this.userLogons.view.getSelectionCount() > 0)
   {
      var userLogonsParam = {
         values: [],
         getValues: function(aItem, aIndex, aAllItems){
            this.values.push(new ConcreteReportParameterValue(aItem.data.text, aItem.data.value))
         }

      };
      Ext.each(this.userLogons.view.getSelectedRecords(), userLogonsParam.getValues, userLogonsParam);

      paramSet.addParameter(new ReportParameter("UserLogon", userLogonsParam.values, 'GenericString'));
   }


   var minPdfSize = this.minPdfSize.getValue();
   if (!Ext.isEmpty(minPdfSize))
   {
      paramSet.addParameter(ReportParameter.createSingleConcreteParameter("MinPdfSize", minPdfSize, minPdfSize));
   }

   var minHtmlSize = this.minHtmlSize.getValue();
   if (!Ext.isEmpty(minHtmlSize))
   {
      paramSet.addParameter(ReportParameter.createSingleConcreteParameter("MinHtmlSize", minHtmlSize, minHtmlSize));
   }


   this.startDate.willSubmit();
   this.endDate.willSubmit();
};


