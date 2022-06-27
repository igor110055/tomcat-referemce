//-----------------------------------------------------------------------------
/**
 * I am the UI model for the geographic hierarchy screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function GeographicHierarchyPromptUiModel (aGeographicHierarchy)
{
   this.geographicHierarchy = aGeographicHierarchy;
}


//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the geographic hierarchy screen
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function GeographicHierarchyPromptUiController (aDocument, aModel)
{
   if (arguments.length > 0)
   {
      GeographicHierarchyPromptUiController.superclass.constructor.call(this, aDocument);

      this.model = aModel;

      //--- cascading listboxes...
//      this.countryList  = new Adf.prompts.ListBoxWidget({
//         view: new Adf.prompts.MyListBoxView("countryList", "countryList", aModel.geographicHierarchy.countries, new SimpleFieldExtractor("name", "name")),
//         contentEl: "countryList",
//         width: 200,
//         title: '',
//         border: false
//      });
//      this.regionList   = new Adf.prompts.ListBoxWidget({
//         view: new Adf.prompts.MyListBoxView("regionList", "regionList", new Object(), new SimpleFieldExtractor("name", "name")),
//         listId: "regionList",
//         width: 200,
//         title: '',
//         border: false
//      });
//      this.cityList     = new Adf.prompts.ListBoxWidget({
//         view: new Adf.prompts.MyListBoxView("cityList", "cityList", new Object(), new SimpleFieldExtractor("name", "name")),
//         listId: "cityList",
//         width: 200,
//         title: '',
//         border: false
//      });
//      this.retailerList = new Adf.prompts.ListBoxWidget({
//         view: new Adf.prompts.MyListBoxView("retailerList", "retailerList", new Object(), new SimpleFieldExtractor("name", "name")),
//         listId: "retailerList",
//         width: 240,
//         title: '',
//         border: false
//      });

//      this.countryList  = new Adf.prompts.LegacyJsListBox("countryList", "countryList", aModel.geographicHierarchy.countries, new SimpleFieldExtractor("name", "name"));
//      this.countryList  = new Adf.prompts.LegacyJsListShowAll("countryList", "countryList", aModel.geographicHierarchy.countries, new SimpleFieldExtractor("name", "name"), "Country");
//      this.regionList   = new Adf.prompts.LegacyJsListShowAll("regionList", "regionList", new Object(), new SimpleFieldExtractor("name", "name"), "Region");
//      this.cityList     = new Adf.prompts.LegacyJsListShowAll("cityList", "cityList", new Object(), new SimpleFieldExtractor("name", "name"), "City");
//      this.retailerList = new Adf.prompts.LegacyJsListShowAll("retailerList", "retailerList", new Object(), new SimpleFieldExtractor("name", "name"), "Retailer");
//      Ext.onReady(function(){
//         Ext.getDom("listHeadersId").style.display = "none";
//         Ext.getDom("listButtonsId").style.display = "none";
//      });


//      var selectHTMLElement = Ext.getDom("countryList");
//      alert("selectHTMLElement="+selectHTMLElement);


//      this.panel = new Ext.Panel({
////         renderTo: Ext.getDom("countryList").parentElement,
//         title: 'List',
//         layout: 'fit',
//         contentEl: "countryList"
//         ,
//         buttons: [{
//            text: 'Select All'
//         }, {
//            text: 'Reset All'
//         }]
//      });
//
//      Ext.onReady(function(){
//         this.panel.render(Ext.getDom("countryList").parentElement)
//      }, this);

//      Ext.onReady(function(){
//         var panel = new Ext.Panel({
//            renderTo: Ext.getDom("countryList").parentElement,
//            title: 'List',
//            layout: 'fit',
//            contentEl: "countryList"
//            ,
//            buttons: [{
//               text: 'Select All'
//            }, {
//               text: 'Reset All'
//            }]
//         });
//      });

//      this.testEl = new Ext.Panel({
//         title: 'JSListBox',
//      applyTo: Ext.getBody(),
//         width: 160,
//         height: 200,
//         autoShow: true,
//         layout: 'fit',
//         items: [{
//            xtype: 'box',
//            contentEl: 'countryList'
////            autoEl: {
////               tag: 'select',
////               size: '20'
////               ,
////               children: [{
////                  tag: 'option',
////                  html: 'item 1'
////               }, {
////                  tag: 'option',
////                  html: 'item 2'
////               }]
////            }
//         }]
////         autoEl: {
////            tag: 'select',
////            size: '20'
////            ,
////            children: [{
////               tag: 'option',
////               html: 'item 1'
////            }, {
////               tag: 'option',
////               html: 'item 2'
////            }]
////         }
//      });

//      this.testEl = new Ext.BoxComponent({
//         renderTo: Ext.getBody(),
//         width: 160,
//         contentEl: 'countryList'
////         autoEl: {
////            tag: 'select',
////            size: '20'
////            ,
////            children: [{
////               tag: 'option',
////               html: 'item 1'
////            }, {
////               tag: 'option',
////               html: 'item 2'
////            }]
////         }
//      });
////      this.testList1 = new Adf.prompts.LegacyJsListBox("retailerList", "retailerList", new Object(), new SimpleFieldExtractor("name", "name"));
//      this.testList1 = new Adf.prompts.ListBoxWidget({});
////      this.testList1.render(Ext.getBody());
//      this.testList2 = new Adf.prompts.ListBoxWidget({title: 'list 2'});
////      this.testList2.render(Ext.getBody());
//      this.testPanel = new Ext.Panel({
//         title: 'linked lists',
//         layout: 'hbox',
//         items: [this.testList1, this.testList2],
//         renderTo: Ext.getBody()
//      });


      //--- date widgets setup in initUi...
      this.startDate = null;
      this.endDate = null;
   }

}

//--- inheritance chain...
GeographicHierarchyPromptUiController.prototype = new AbstractCustomPromptUiController();
GeographicHierarchyPromptUiController.prototype.constructor = GeographicHierarchyPromptUiController;
GeographicHierarchyPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


/**
* initialize the UI
**/
GeographicHierarchyPromptUiController.prototype.initUi = function()
{
   var paramSet = this.getRei().parameterSet;

//   this.countryList  = new Adf.prompts.ListBoxWidget({
//      view: new Adf.prompts.DefaultListBoxView("countryList", "countryList", this.model.geographicHierarchy.countries, new SimpleFieldExtractor("name", "name")),
//      listId: "countryList",
//      width: 200,
//      title: applicationResources.getProperty('prompt.geographicHierarchy.country'),
////      border: false,
//      enableButtons: true,
////      frame: false,
//      buttonAlign: 'center',
//      listeners: {
//         scope: this,
//         selectionChange:  this.countrySelectionChanged,
//         selectAll:  this.selectAllCountries,
//         clearAll:  this.resetCountries
//      }
//   });
   this.countryList  = new Adf.widgets.ListBoxWidget({
      title: applicationResources.getProperty('prompt.geographicHierarchy.country'),
      frame: true,
      enableButtons: true,
      width: 200,
      height: 300,
      listeners: {
         scope: this,
         selectionChange:  this.countrySelectionChanged,
         selectAll:  this.selectAllCountries,
         clearAll:  this.resetCountries
      }
   });

   this.countryList.getStore().loadData({
      listBoxItems: this.convertSrcItemsToListBoxItems(this.model.geographicHierarchy.countries)
   });


//   this.regionList   = new Adf.prompts.ListBoxWidget({
//      view: new Adf.prompts.DefaultListBoxView("regionList", "regionList", new Object(), new SimpleFieldExtractor("name", "name")),
//      listId: "regionList",
//      width: 200,
//      title: applicationResources.getProperty('prompt.geographicHierarchy.region'),
////      border: false,
//      enableButtons: true,
////      frame: false,
//      buttonAlign: 'center',
//      listeners: {
//         scope: this,
//         selectionChange:  this.regionSelectionChanged,
//         selectAll:  this.selectAllRegions,
//         clearAll:  this.resetRegions
//      }
//   });
   this.regionList  = new Adf.widgets.ListBoxWidget({
      title: applicationResources.getProperty('prompt.geographicHierarchy.region'),
      frame: true,
      enableButtons: true,
      width: 200,
      height: 300,
      listeners: {
         scope: this,
         selectionChange:  this.regionSelectionChanged,
         selectAll:  this.selectAllRegions,
         clearAll:  this.resetRegions
      }
   });


//   this.cityList     = new Adf.prompts.ListBoxWidget({
//      view: new Adf.prompts.DefaultListBoxView("cityList", "cityList", new Object(), new SimpleFieldExtractor("name", "name")),
//      listId: "cityList",
//      width: 200,
//      title: applicationResources.getProperty('prompt.geographicHierarchy.city'),
////      border: false,
//      enableButtons: true,
////      frame: false,
//      buttonAlign: 'center',
//      listeners: {
//         scope: this,
//         selectionChange:  this.citySelectionChanged,
//         selectAll:  this.selectAllCities,
//         clearAll:  this.resetCities
//      }
//   });
   this.cityList  = new Adf.widgets.ListBoxWidget({
      title: applicationResources.getProperty('prompt.geographicHierarchy.city'),
      frame: true,
      enableButtons: true,
      width: 200,
      height: 300,
      listeners: {
         scope: this,
         selectionChange:  this.citySelectionChanged,
         selectAll:  this.selectAllCities,
         clearAll:  this.resetCities
      }
   });

//   this.retailerList = new Adf.prompts.ListBoxWidget({
//      view: new Adf.prompts.DefaultListBoxView("retailerList", "retailerList", new Object(), new SimpleFieldExtractor("name", "name")),
//      listId: "retailerList",
//      width: 240,
//      title: applicationResources.getProperty('prompt.geographicHierarchy.retailer'),
////      border: false,
//      enableButtons: true,
////      frame: false,
//      buttonAlign: 'center',
//      listeners: {
//         scope: this,
//         selectionChange:  this.retailerSelectionChanged,
//         selectAll:  this.selectAllRetailers,
//         clearAll:  this.resetRetailers
//      }
//   });
   this.retailerList  = new Adf.widgets.ListBoxWidget({
      title: applicationResources.getProperty('prompt.geographicHierarchy.retailer'),
      frame: true,
      enableButtons: true,
      width: 240,
      height: 300,
      listeners: {
         scope: this,
         selectionChange:  this.retailerSelectionChanged,
         selectAll:  this.selectAllRetailers,
         clearAll:  this.resetRetailers
      }
   });

   this.regionPanel = new Ext.Panel({
      layout: 'hbox',
      border: false,
      layoutConfig: {
         defaultMargins: {
            top: 0,
            left: 0,
            right: 4,
            bottom: 0
         }
      },
      bodyStyle: 'padding: 20px 10px 20px 10px',
      items: [this.countryList, this.regionList, this.cityList, this.retailerList]
   });


   this.startDate = new DateParameterWidget ("StartDate", applicationResources.getProperty("prompt.startDate"), paramSet, true, 15, "00:00:00");
   this.endDate = new DateParameterWidget ("EndDate", applicationResources.getProperty("prompt.endDate"), paramSet, true, 15, "23:59:59");

   this.dateRangePanel = new Ext.Panel({
      border: false,
      bodyStyle: 'padding: 0px 10px 10px 10px;',
      items: [{
         title: 'Reporting Period',
         xtype: 'panel',
         layout: 'hbox',
//         frame: true,
         bodyStyle: 'padding: 10px 10px 10px 10px;',
//         width: 780,
         layoutConfig: {
            defaultMargins: {
               top: 0,
               left: 0,
               right: 10,
               bottom: 0
            }
         },
         items: [this.startDate, this.endDate]
      }]
   });

//   this.dateRangePanel = new Ext.Panel({
//      layout: 'hbox',
//      layoutConfig: {
//         defaultMargins: {
//            top: 0,
//            left: 0,
//            right: 10,
//            bottom: 0
//         }
//      },
//      border: false,
//      bodyStyle: 'padding: 20px 10px 20px 10px;',
//      items: [this.startDate, this.endDate]
//   });
//

   this.mainPanel = new Ext.Panel({
      title: applicationResources.getProperty('prompt.geographicHierarchy.title'),
      border: false,
//      frame: true,
      renderTo: Ext.getBody(),
      items: [this.regionPanel, this.dateRangePanel]
   });

   this.startDate.initFromParamValues();
   this.endDate.initFromParamValues();


   //--- initial draw...
//   this.countryList.refreshView();
//   this.regionList.refreshView();
//   this.cityList.refreshView();
//   this.retailerList.refreshView();


   var countryParam = paramSet.getParameter("Country");
   var regionParam = paramSet.getParameter("Region");
   var cityParam = paramSet.getParameter("City");
   var retailerParam = paramSet.getParameter("Retailer");


   //--- pre-select any param values that are part of the starting REI...
   if (JsUtil.isGood(countryParam) && countryParam.values.length > 0)
   {
      this.selectItemsFromValues(this.countryList, countryParam.getRawValues());
      this.countrySelectionChanged();
   }

   if (JsUtil.isGood(regionParam) && regionParam.values.length > 0)
   {
      this.selectItemsFromValues(this.regionList, regionParam.getRawValues());
      this.regionSelectionChanged();
   }

   if (JsUtil.isGood(cityParam) && cityParam.values.length > 0)
   {
      this.selectItemsFromValues(this.cityList, cityParam.getRawValues());
      this.citySelectionChanged();
   }

   if (JsUtil.isGood(retailerParam) && retailerParam.values.length > 0)
   {
      this.selectItemsFromValues(this.retailerList, retailerParam.getRawValues());
   }


   //--- base class initUi...
   GeographicHierarchyPromptUiController.superclass.initUi.call(this);

};


/**
 * called when the country listbox changes...
 **/
GeographicHierarchyPromptUiController.prototype.countrySelectionChanged = function()
{
   var selected = this.getSelectedItems(this.countryList);

   var newListItems = new Object();

   var eachItem;
   for (var i = 0; i < selected.length; ++i)
   {
      eachItem = selected[i].srcObject;

      JsUtil.copyObjectProperties(eachItem.regions, newListItems);
   }

   this.regionList.getStore().loadData({
      listBoxItems: this.convertSrcItemsToListBoxItems(newListItems)
   });

   //--- invalidate far left...
   this.regionSelectionChanged();
};

/**
 * called when the region listbox changes...
 **/
GeographicHierarchyPromptUiController.prototype.regionSelectionChanged = function()
{
   var selected = this.getSelectedItems(this.regionList);

   var newListItems = new Object();

   var eachItem;
   for (var i = 0; i < selected.length; ++i)
   {
      eachItem = selected[i].srcObject;

      JsUtil.copyObjectProperties(eachItem.cities, newListItems);
   }

   this.cityList.getStore().loadData({
      listBoxItems: this.convertSrcItemsToListBoxItems(newListItems)
   });

   //--- invalidate far left...
   this.citySelectionChanged();
};

/**
 * called when the city listbox changes...
 **/
GeographicHierarchyPromptUiController.prototype.citySelectionChanged = function()
{
   var selected = this.getSelectedItems(this.cityList);

   var newListItems = new Object();

   var eachItem;
   for (var i = 0; i < selected.length; ++i)
   {
      eachItem = selected[i].srcObject;

      JsUtil.copyObjectProperties(eachItem.retailers, newListItems);
   }

   this.retailerList.getStore().loadData({
      listBoxItems: this.convertSrcItemsToListBoxItems(newListItems)
   });
};



/**
 * called when the retailer listbox changes...
 **/
GeographicHierarchyPromptUiController.prototype.retailerSelectionChanged = function()
{
};




GeographicHierarchyPromptUiController.prototype.selectAllCountries = function()
{
   this.countryList.selectAll();
   this.countrySelectionChanged();
};

GeographicHierarchyPromptUiController.prototype.resetCountries = function()
{
   this.countryList.clearSelections();
   this.countrySelectionChanged();
};


GeographicHierarchyPromptUiController.prototype.selectAllRegions = function()
{
   this.regionList.selectAll();
   this.regionSelectionChanged();
};

GeographicHierarchyPromptUiController.prototype.resetRegions = function()
{
   this.regionList.clearSelections();
   this.regionSelectionChanged();
};



GeographicHierarchyPromptUiController.prototype.selectAllCities = function()
{
   this.cityList.selectAll();
   this.citySelectionChanged();
};

GeographicHierarchyPromptUiController.prototype.resetCities = function()
{
   this.cityList.clearSelections();
   this.citySelectionChanged();
};



GeographicHierarchyPromptUiController.prototype.selectAllRetailers = function()
{
   this.retailerList.selectAll();
   this.retailerSelectionChanged();
};

GeographicHierarchyPromptUiController.prototype.resetRetailers = function()
{
   this.retailerList.clearSelections();
   this.retailerSelectionChanged();
};









/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
GeographicHierarchyPromptUiController.prototype.beforeSubmit = function()
{
    if(!this.startDate.validate("%Y-%m-%d", true))
   {
      alert("Start Date is invalid; Please enter a valid date using the format yyyy-mm-dd.");
      return false;
   }

   if(!this.endDate.validate("%Y-%m-%d", true))
   {
      alert("End Date is invalid; Please enter a valid date using the format yyyy-mm-dd.");
      return false;
   }

   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
GeographicHierarchyPromptUiController.prototype.willSubmit = function()
{
   var selectedCountries = this.getSelectedItems(this.countryList);
   var selectedRegions = this.getSelectedItems(this.regionList);
   var selectedCities = this.getSelectedItems(this.cityList);
   var selectedRetailers = this.getSelectedItems(this.retailerList);

   var paramSet = this.getRei().parameterSet;
   paramSet.clear();

   paramSet.addParameter(new ReportParameter("Country", this.convertListBoxItemsToParamValues(selectedCountries), 'GenericString'));
   paramSet.addParameter(new ReportParameter("Region", this.convertListBoxItemsToParamValues(selectedRegions), 'GenericString'));
   paramSet.addParameter(new ReportParameter("City", this.convertListBoxItemsToParamValues(selectedCities), 'GenericString'));
   paramSet.addParameter(new ReportParameter("Retailer", this.convertListBoxItemsToParamValues(selectedRetailers), 'GenericString'));

   this.startDate.willSubmit();
   this.endDate.willSubmit();
};


GeographicHierarchyPromptUiController.prototype.convertListBoxItemsToParamValues = function(aListBoxItems)
{
   var paramValues = [];

   for (var i = 0; i < aListBoxItems.length; ++i)
   {
      paramValues.push(new ConcreteReportParameterValue(aListBoxItems[i].text, aListBoxItems[i].value));
   }

   return paramValues;
};



GeographicHierarchyPromptUiController.prototype.convertSrcItemsToListBoxItems = function(aSourceItems)
{
   var fieldExtractor = new SimpleFieldExtractor("name", "name");
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

GeographicHierarchyPromptUiController.prototype.selectItemsFromValues = function (aListBoxWidget, aItemsToSelect)
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


GeographicHierarchyPromptUiController.prototype.getSelectedItems = function (aListBoxWidget)
{
   var selectedRecords = aListBoxWidget.view.getSelectedRecords();
   var o = {selectedItems: []};
   Ext.each(selectedRecords, function(aItem, aIndex, aAllItems){
      this.selectedItems.push(aItem.json);
   }, o);
   return o.selectedItems;
};