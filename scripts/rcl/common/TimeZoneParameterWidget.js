/**
 * @fileoverview
 * This file defines a time zone widget used on custom prompt screens
 *
 * @author Roger Moore
 *
 **/



//-----------------------------------------------------------------------------


/**
* TimeZoneParameterWidget
* @constructor
* @class
*
* @param aParamName name of the report parameter that this time zone widget will populate
* @param aParamLabel label that the user will see
* @param aTimeZones list of TimeZone objects that provide the available selections
* @param aParamSet the parameter set (from the rei)
* @param aAllowFuzzyTimeZones true indicates that the user will be allowed to select the fuzzy value "my time zone"
**/
function TimeZoneParameterWidget (aParamName, aParamLabel, aParamSet, aTimeZones, aAllowFuzzyTimeZones, aFuzzyMyTimeZoneLabel)
{
   this.paramName = aParamName;
   this.paramLabel = aParamLabel;
   this.paramSet = aParamSet;
   this.timeZones = aTimeZones;
   this.allowFuzzyTimeZones =  aAllowFuzzyTimeZones;
   this.fuzzyMyTimeZoneLabel = aFuzzyMyTimeZoneLabel;


   this.containerId = this.paramName + "_containerDiv";
   this.valueId = this.paramName + '_Value';

   if (this.allowFuzzyTimeZones)
   {
      this.myTimeZone = { id:'MyTimeZone', displayName:aFuzzyMyTimeZoneLabel, fuzzy:true};
   }

   //TimeZoneParameterWidget.instances.push(this);
}

/*
TimeZoneParameterWidget.instances = [];
TimeZoneParameterWidget.onDocumentUnload = function()
{
   TimeZoneParameterWidget.instances.each(function(anInstance) {
      anInstance._onUnload();
   });
};

//--- make sure all instances cleanly unwire themselves from the DOM...
DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
   TimeZoneParameterWidget.onDocumentUnload();
});
*/





/**
 * submission is imminent, update my resepective parameter values...
 **/
TimeZoneParameterWidget.prototype.willSubmit = function()
{
   this.updateParamValues();
};



/**
 * initialize the widget's initial values from an existing report parameter
 **/
TimeZoneParameterWidget.prototype.initFromParamValues = function()
{   
   if (this.paramSet)
   {
      var param = this.paramSet.getParameter(this.paramName);

      if (param && param.values.length > 0)
      {
         var paramValue = param.values[0];


         var tzValue = paramValue.value;

         this.setTimeZone(tzValue);


      }
   }

};



/**
 * update the associated parameter's state based on our current values
 **/
TimeZoneParameterWidget.prototype.updateParamValues = function()
{

   var timeZone = this.getTimeZone();

   if (timeZone.fuzzy)
   {
      this.paramSet.addParameter(ReportParameter.createSingleFuzzyParameter(this.paramName,timeZone.id, null, timeZone.displayName ));        
   }
   else
   {
      this.paramSet.addParameter(ReportParameter.createSingleConcreteParameter(this.paramName, timeZone.id, timeZone.displayName));
   }
};

TimeZoneParameterWidget.prototype.getTimeZone = function()
{
   var selectElm = $(this.valueId);

   var index = selectElm.selectedIndex;

   var option = selectElm.options[index];

   return option.srcObject;

}

TimeZoneParameterWidget.prototype.setTimeZone = function(aTzValue)
{
   var element = $(this.valueId);

   for (var i = 0; i < element.options.length; ++i)
   {
      if (element.options[i].value == aTzValue)
      {
         element.options[i].selected = true;
      }
   }
};





/**
 * unwire any bi-directional references between dom and our object model...
 **/
TimeZoneParameterWidget.prototype._onUnload = function()
{
   //alert('unloading [' + this.containerId + ']');
   var containerDiv = $(this.containerId);
   containerDiv.widget = null;
};




/**
 * insert this widget into the document under the supplied insertion point element
 **/
TimeZoneParameterWidget.prototype.insertIntoDocument = function(aInsertionPoint)
{

   var containerDiv = document.createElement('div');
   containerDiv.id = this.containerId;
   containerDiv.className = "TimeZoneParameterWidget";

   containerDiv.widget = this;

   aInsertionPoint.appendChild(containerDiv);


   var labelDiv = document.createElement('div');
   labelDiv.className = "timeZoneParamLabel";

   var html ='<span class="label" id="' + this.paramName + '_label">' + this.paramLabel + '</span>';

   labelDiv.innerHTML = html;
   
   containerDiv.appendChild(labelDiv);

   var valueDiv = document.createElement('div');
   valueDiv.className = "timeZoneParamValue";


   containerDiv.appendChild(valueDiv);

   var timeZoneSelect = document.createElement('select');
   timeZoneSelect.id  = this.valueId;
   timeZoneSelect.name  = this.valueId;

   timeZoneSelect.options.length = 0;

   if (this.allowFuzzyTimeZones)
   {
      this.addOption(timeZoneSelect, this.myTimeZone.id, this.myTimeZone.displayName, this.myTimeZone);      
      this.addOptionGroup(timeZoneSelect, '------------------');      
   }

   var thisObject = this;
   this.timeZones.each(
              function (aValue)
              {
                 thisObject.addOption(timeZoneSelect, aValue.id, aValue.displayName, aValue);
              });



   valueDiv.appendChild(timeZoneSelect);



   this.initFromParamValues();

};


TimeZoneParameterWidget.prototype.addOptionGroup = function(aSelect, aLabel)
{
   var newOptItem = document.createElement("optgroup");
   newOptItem.label = aLabel;
   aSelect.appendChild(newOptItem);
};

TimeZoneParameterWidget.prototype.addOption = function(aSelect, aValue, aText, aSrcObject)
{
   var newOptItem = document.createElement("option");
   newOptItem.value = aValue;
   newOptItem.text  = aText;
   newOptItem.srcObject = aSrcObject;
   aSelect.options[aSelect.options.length] =newOptItem;
};


