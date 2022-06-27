/**
 * @fileoverview
 * This file defines a date range widget used on custom prompt screens
 *
 * @author Jonathan James
 *
 **/



//-----------------------------------------------------------------------------

/**
 * DateRangeWidget
 * @constructor
 * @class
 *
 * @param aParamName name of the report parameter that this date range widget will populate
 * @param aParamLabel label that the user will see
 * @param aParamSet the parameter set (from the rei)
 * @param aEnterTime true indicates that the user should be prompted for time entry as well as date
 * @param aTimeInterval granularity of time entry (i.e., 0 for hours only, 15 for every 15 minutes, 30 for every half hour)
 * @param aEnableFuzzyDates whether fuzzy dates should be enabled defaults to true NOT SUPPORTING THIS YET FOR RANGES TODO
 **/
function DateRangeWidget(aParamName, aParamLabel, aParamSet, aEnterTime, aTimeInterval ) //, aEnableFuzzyDates)
{
   this.paramName = aParamName;
   this.paramLabel = aParamLabel;
   this.paramSet = aParamSet;
   this.nestedParamSet = new ReportParameterSet();
   this.parameterObject = new ReportParameter(this.paramName, [], 'GenericString');

   this.enterTime = JsUtil.isGood(aEnterTime) && aEnterTime;
   this.timeInterval = (JsUtil.isGood(aTimeInterval)) ? aTimeInterval : 30; //default to 30 minutes
//   this.enableFuzzyDates = (JsUtil.isGood(aEnableFuzzyDates)) ? aEnableFuzzyDates : true; // default to true


   this.containerId = this.paramName + "_containerDiv";
   this.selectId = this.paramName + "_select";
   this.selectWidget = null;
   this.valuesAssocArray = new Array();


   this.imageDir = ServerEnvironment.baseUrl + "/images";

   this.startDate = new DateParameterWidget(aParamName + "_start", applicationResources.getProperty("prompt.startDate"), this.nestedParamSet, aEnterTime, aTimeInterval, null, false);
   this.endDate = new DateParameterWidget(aParamName + "_end", applicationResources.getProperty("prompt.endDate"), this.nestedParamSet, aEnterTime, aTimeInterval, null, false);

   DateRangeWidget.instances.push(this);
}


DateRangeWidget.instances = [];
DateRangeWidget.onDocumentUnload = function()
{
   DateRangeWidget.instances.each(function(anInstance)
   {
      anInstance._onUnload();
   });
};

//--- make sure all instances cleanly unwire themselves from the DOM...
DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function()
{
   DateRangeWidget.onDocumentUnload();
});


/**
 * submission is imminent, update my resepective parameter values...
 **/
DateRangeWidget.prototype.willSubmit = function()
{
   this.updateParamValues();
};


/**
 * initialize the widget's initial values from an existing report parameter
 **/
DateRangeWidget.prototype.initFromParamValues = function()
{
   if (this.paramSet)
   {
      var param = this.paramSet.getParameter(this.paramName);

      if (param && param.values.length > 0)
      {
         this.parameterObject = param;
         for(var index = 0; index<param.values.length; index++)
         {
            var eachParmValue = param.values[index];
            this.selectWidget.addValue(eachParmValue.getDisplayValue());
            this.valuesAssocArray[eachParmValue.getDisplayValue()] = eachParmValue;
         }
      }
   }
};


/**
 * return the currently displayed option (concrete or fuzzy)
 **/
DateRangeWidget.prototype.isConcrete = function()
{
   return true;
};

/**
 * return the currently displayed option (concrete or fuzzy)
 **/
DateRangeWidget.prototype.isFuzzy = function()
{
   return false;
};

/**
 * get the current concrete value...
 **/
DateRangeWidget.prototype.getConcreteValue = function()
{
   return $F(this.paramName + "_concreteValue");
};

/**
 * get the current fuzzy value...
 DateRangeWidget
DateParameterWidget.prototype.getFuzzyValue = function()
{
   return $F(this.paramName + "_fuzzyValue");
};


/**
 * update the associated parameter's state based on our current values
 **/
DateRangeWidget.prototype.updateParamValues = function()
{
   this.paramSet.addParameter(this.parameterObject);
};

/**
 * validates the current value, returns true if its valid,
 * false if its not valid.
 **/
DateRangeWidget.prototype.validate = function(aFormat, aAllowBlank)
{
   var values = this.parameterObject.values;
   return aAllowBlank || (JsUtil.isGood(values) && values.length > 0);
};


/**
 * unwire any bi-directional references between dom and our object model...
 **/
DateRangeWidget.prototype._onUnload = function()
{
   //alert('unloading [' + this.containerId + ']');
   var containerDiv = $(this.containerId);
   containerDiv.widget = null;
};

/**
 * Fired when a user clicks inside of the start or end date widget (presumably to pick an explicit date)
 **/
DateRangeWidget.prototype.dateWidgetClicked = function(aDateWidgetId)
{
   $(aDateWidgetId + "_rbmax").checked = false;
   $(aDateWidgetId + "_explicit").checked = true;
};

/**
 * Move an entered date into the set of selected dates.
 **/
DateRangeWidget.prototype.addUserSuppliedValue = function()
{
   var isEarliest =$(this.paramName + "_start_rbmax").checked;
   var isLatest =$(this.paramName + "_end_rbmax").checked;

   this.startDate.updateParamValues();
   this.endDate.updateParamValues();

   var paramValue;

   if(isEarliest && isLatest )
   {
      // That's the same as not specifying a parameter value. Do nothing.
   }
   else if(isEarliest)
   {
      paramValue = new UnboundedStartRangeParameterValue(this.nestedParamSet.getParameter(this.paramName + "_end").values[0]);
   }
   else if(isLatest)
   {
      paramValue = new UnboundedEndRangeParameterValue(this.nestedParamSet.getParameter(this.paramName + "_start").values[0]);
   }
   else
   {
      paramValue = new BoundedReportParameterValue(this.nestedParamSet.getParameter(this.paramName + "_start").values[0],
            this.nestedParamSet.getParameter(this.paramName + "_end").values[0]);
   }

   if(JsUtil.isGood(paramValue))
   {
      this.parameterObject.addValue(paramValue);

      this.selectWidget.addValue(paramValue.getDisplayValue());
      this.valuesAssocArray[paramValue.getDisplayValue()] =  paramValue;
   }
};

/**
 * Remove a selected value
 **/
DateRangeWidget.prototype.removeFromSelected = function()
{
   var selectedItems = this.selectWidget.getSelectedItems();
   if( JsUtil.isGood(selectedItems))
   {
      for ( var index=0; index < selectedItems.length; index++)
      {
         this.parameterObject.removeValue(this.valuesAssocArray[selectedItems[index].value]);
      }
      this.selectWidget.removeSelectedItems();
   }
};



/**
 * insert this widget into the document under the supplied insertion point element
 **/
DateRangeWidget.prototype.insertIntoDocument = function(aInsertionPoint)
{
   var html =
         '<table><tr><td>' +
         '<div class="dateRangeLabel">' +
               '<span class="label" id="' + this.paramName + '_label">' + this.paramLabel + '</span>' +
               '</div>' +
               '<div class="dateRangeValuesDiv">';

   html +=
         '<input type="radio" name="' + this.paramName + '_start_dateType" id="' + this.paramName + '_start_rbmax" checked="checked" >' + applicationResources.getProperty("prompt.earliestDate") + '<br/>' +
         '<input type="radio" name="' + this.paramName + '_start_dateType" id="' + this.paramName + '_start_explicit"  style="float:left">' +
         '<div style="float:left"><div id="' + this.paramName + '_start_dateWidget" onclick="$(\'' + this.containerId + '\').widget.dateWidgetClicked(' + "'" + this.paramName + "_start'" + ')"></div></div>' +
         '<div style="clear:both"></div><input type="radio" name="' + this.paramName + '_end_dateType" id="' + this.paramName + '_end_rbmax" checked="checked" >' + applicationResources.getProperty("prompt.latestDate") + '<br/>' +
         '<input type="radio" name="' + this.paramName + '_end_dateType" id="' + this.paramName + '_end_explicit"  style="float:left">' +
         '<div style="float:left"><div id="' + this.paramName + '_end_dateWidget" onclick="$(\'' + this.containerId + '\').widget.dateWidgetClicked(' + "'" + this.paramName + "_end'" + ')""></div></div>';

   html += '</div>';

   html += "</td>";
   html +='<td class="buttons">' +
             '<input type="button" class="button" value=">>" onclick="$(\'' + this.containerId + '\').widget.addUserSuppliedValue();"/><br/>' +
             '<input type="button" class="button" value="<<" onclick="$(\'' + this.containerId + '\').widget.removeFromSelected();"/>' +
          '</td>' +
          '<td class="selectedValues">' +
             '<select id="' + this.selectId + '" multiple="true" size="8">' +
             '</select>' +
          '</td>';
   html += "</tr></table>"

   //alert(html);

   var containerDiv = document.createElement('div');
   containerDiv.id = this.containerId;
   containerDiv.className = "dateRangeWidget";

   if( !this.enterTime )
   {
      containerDiv.style.height = "160px";
   }

   containerDiv.widget = this;

   containerDiv.innerHTML = html;

   aInsertionPoint.appendChild(containerDiv);

   //--- now wire in the DateWidgets...
   this.startDate.insertIntoDocument($(this.paramName + '_start_dateWidget'));
   this.endDate.insertIntoDocument($(this.paramName + '_end_dateWidget'));

   this.selectWidget = new HtmlSelect($(this.selectId));
   this.initFromParamValues();
};

