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
      this.countryList  = new JsListBox("countryList", "countryList", aModel.geographicHierarchy.countries, new SimpleFieldExtractor("name", "name"));
      this.regionList   = new JsListBox("regionList", "regionList", new Object(), new SimpleFieldExtractor("name", "name"));
      this.cityList     = new JsListBox("cityList", "cityList", new Object(), new SimpleFieldExtractor("name", "name"));
      this.retailerList = new JsListBox("retailerList", "retailerList", new Object(), new SimpleFieldExtractor("name", "name"));

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

   //--- initial draw...
   this.countryList.refreshView();
   this.regionList.refreshView();
   this.cityList.refreshView();
   this.retailerList.refreshView();


   var countryParam = paramSet.getParameter("Country");
   var regionParam = paramSet.getParameter("Region");
   var cityParam = paramSet.getParameter("City");
   var retailerParam = paramSet.getParameter("Retailer");


   //--- pre-select any param values that are part of the starting REI...
   if (JsUtil.isGood(countryParam) && countryParam.values.length > 0)
   {
      this.countryList.selectItemsFromValues(countryParam.getRawValues());
      this.countrySelectionChanged();
   }

   if (JsUtil.isGood(regionParam) && regionParam.values.length > 0)
   {
      this.regionList.selectItemsFromValues(regionParam.getRawValues());
      this.regionSelectionChanged();
   }

   if (JsUtil.isGood(cityParam) && cityParam.values.length > 0)
   {
      this.cityList.selectItemsFromValues(cityParam.getRawValues());
      this.citySelectionChanged();
   }

   if (JsUtil.isGood(retailerParam) && retailerParam.values.length > 0)
   {
      this.retailerList.selectItemsFromValues(retailerParam.getRawValues());
   }



   //--- start and end date...

   this.startDate = new DateParameterWidget ("StartDate", applicationResources.getProperty("prompt.startDate"), paramSet, true, 15, "00:00:00");
   this.endDate = new DateParameterWidget ("EndDate", applicationResources.getProperty("prompt.endDate"), paramSet, true, 15, "23:59:59");

   var insertAt = $('dateWidgets');

   this.startDate.insertIntoDocument(insertAt);
   this.endDate.insertIntoDocument(insertAt);




   //--- base class initUi...
   GeographicHierarchyPromptUiController.superclass.initUi.call(this);

};


/**
 * called when the country listbox changes...
 **/
GeographicHierarchyPromptUiController.prototype.countrySelectionChanged = function()
{
   var selected = this.countryList.getSelectedItems();

   var newListItems = new Object();

   var eachItem;
   for (var i = 0; i < selected.length; ++i)
   {
      eachItem = selected[i].srcObject;

      JsUtil.copyObjectProperties(eachItem.regions, newListItems);
   }

   this.regionList.resetAvailableItems(newListItems);
   this.regionList.refreshView();

   //--- invalidate far left...
   this.regionSelectionChanged();
};

/**
 * called when the region listbox changes...
 **/
GeographicHierarchyPromptUiController.prototype.regionSelectionChanged = function()
{
   var selected = this.regionList.getSelectedItems();

   var newListItems = new Object();

   var eachItem;
   for (var i = 0; i < selected.length; ++i)
   {
      eachItem = selected[i].srcObject;

      JsUtil.copyObjectProperties(eachItem.cities, newListItems);
   }

   this.cityList.resetAvailableItems(newListItems);
   this.cityList.refreshView();

   //--- invalidate far left...
   this.citySelectionChanged();
};

/**
 * called when the city listbox changes...
 **/
GeographicHierarchyPromptUiController.prototype.citySelectionChanged = function()
{
   var selected = this.cityList.getSelectedItems();

   var newListItems = new Object();

   var eachItem;
   for (var i = 0; i < selected.length; ++i)
   {
      eachItem = selected[i].srcObject;

      JsUtil.copyObjectProperties(eachItem.retailers, newListItems);
   }

   this.retailerList.resetAvailableItems(newListItems);
   this.retailerList.refreshView();
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
   this.countryList.deselectAll();
   this.countrySelectionChanged();
};


GeographicHierarchyPromptUiController.prototype.selectAllRegions = function()
{
   this.regionList.selectAll();
   this.regionSelectionChanged();
};

GeographicHierarchyPromptUiController.prototype.resetRegions = function()
{
   this.regionList.deselectAll();
   this.regionSelectionChanged();
};



GeographicHierarchyPromptUiController.prototype.selectAllCities = function()
{
   this.cityList.selectAll();
   this.citySelectionChanged();
};

GeographicHierarchyPromptUiController.prototype.resetCities = function()
{
   this.cityList.deselectAll();
   this.citySelectionChanged();
};



GeographicHierarchyPromptUiController.prototype.selectAllRetailers = function()
{
   this.retailerList.selectAll();
   this.retailerSelectionChanged();
};

GeographicHierarchyPromptUiController.prototype.resetRetailers = function()
{
   this.retailerList.deselectAll();
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
   var selectedCountries = this.countryList.getSelectedItems();
   var selectedRegions = this.regionList.getSelectedItems();
   var selectedCities = this.cityList.getSelectedItems();
   var selectedRetailers = this.retailerList.getSelectedItems();

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

