/**
 * @fileoverview
 * This file defines a date widget used on custom prompt screens
 *
 * @author Lance Hankins
 *
 **/



//-----------------------------------------------------------------------------

/**
* A "named" time value like "Start of Day", "End of Day".
* @constructor
* @class
*
* @param aName name of the time
* @param aTimeValue actual 24 hour time value
**/
function NamedTime (aName, aTimeValue)
{
   this.name = aName;
   this.timeValue = aTimeValue;
}



//todo consult with Lance to see if there is a better way todo this
var namedTimeValues = new Object;
namedTimeValues["00:00:00"] = new NamedTime(applicationResources.getProperty("prompt.dateParameterWidget.startOfDay"), "00:00:00");
namedTimeValues["08:00:00"] = new NamedTime("8:00 AM", "08:00:00");
namedTimeValues["12:00:00"] = new NamedTime(applicationResources.getProperty("prompt.dateParameterWidget.noon"), "12:00:00");
namedTimeValues["17:00:00"] = new NamedTime("5:00 PM", "17:00:00");
namedTimeValues["23:59:59"] = new NamedTime(applicationResources.getProperty("prompt.dateParameterWidget.endOfDay"), "23:59:59");

/**
* DateWidget
* @constructor
* @class
*
* @param aParamName name of the report parameter that this date widget will populate
* @param aParamLabel label that the user will see
* @param aParamSet the parameter set (from the rei)
* @param aEnterTime true indicates that the user should be prompted for time entry as well as date
* @param aTimeInterval granularity of time entry (i.e., 0 for hours only, 15 for every 15 minutes, 30 for every half hour)
* @param aDefaultInitialTimeValue value to initialize the time entry to; must be actual 24 hour format (08:00:00 for 8:00 AM for example)
* @param aEnsableFuzzyDates whether fuzzy dates shouild be enabled defaults to true
**/
function DateParameterWidget (aParamName, aParamLabel, aParamSet, aEnterTime, aTimeInterval, aDefaultInitialTimeValue, aEnableFuzzyDates)
{
   this.paramName = aParamName;
   this.paramLabel = aParamLabel;
   this.paramSet = aParamSet;

   this.enterTime = JsUtil.isGood(aEnterTime) && aEnterTime;
   this.timeInterval = (JsUtil.isGood(aTimeInterval)) ? aTimeInterval : 30; //default to 30 minutes
   this.defaultInitialTimeValue = (JsUtil.isGood(aDefaultInitialTimeValue)) ? aDefaultInitialTimeValue : '08:00:00'; //default to 8 AM
   this.enableFuzzyDates = (JsUtil.isGood(aEnableFuzzyDates)) ? aEnableFuzzyDates : true; // default to true


   this.containerId = this.paramName + "_containerDiv";


   this.imageDir = ServerEnvironment.baseUrl + "/images";

   DateParameterWidget.instances.push(this);
}


//--- TODO: this should be dynamically pulled from the server...
DateParameterWidget.fuzzyDateValues = [
   "PriorMonthBegin",
   "PriorMonthEnd",
   "PriorWeekBegin",
   "PriorWeekEnd",
   "PriorDay",
   "CurrentDay"
];

DateParameterWidget.instances = [];
DateParameterWidget.onDocumentUnload = function()
{
   DateParameterWidget.instances.each(function(anInstance) {
      anInstance._onUnload();
   });
};

//--- make sure all instances cleanly unwire themselves from the DOM...
DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
   DateParameterWidget.onDocumentUnload();
});






/**
 * submission is imminent, update my resepective parameter values...
 **/
DateParameterWidget.prototype.willSubmit = function()
{
   this.updateParamValues();
};



/**
 * initialize the widget's initial values from an existing report parameter
 **/
DateParameterWidget.prototype.initFromParamValues = function()
{
   var timeSet =false;
   if (this.paramSet)
   {
      var param = this.paramSet.getParameter(this.paramName);

      if (param && param.values.length > 0)
      {
         var paramValue = param.values[0];

         if (paramValue.isConcrete())
         {
            var dateAndTime = paramValue.value;

            var spaceIndex = dateAndTime.indexOf(' ');
            if( spaceIndex > -1 )
            {
               $(this.paramName + "_concreteValue").value = dateAndTime.substring(0, dateAndTime.indexOf(' '));
            }
            else
            {
               $(this.paramName + "_concreteValue").value = dateAndTime;
            }

            // would be nicer to simulate a click than to do in two statements like this...
            if (this.enableFuzzyDates)
            {
               $(this.paramName + '_rbConcrete').checked = true;
            }

            if (this.enterTime)
            {
               $(this.paramName + "_timeValue").value = dateAndTime.substring(dateAndTime.indexOf(' ') +1);
               timeSet=true;
            }
            if (this.enableFuzzyDates)
            {
               this.showConcrete();
            }
         }
         else
         {
            if( this.enableFuzzyDates )
            {
               new HtmlSelect($(this.paramName + "_fuzzyValue")).resetSelectedItems([paramValue.fuzzyValue]);

               $(this.paramName + '_rbFuzzy').checked = true;

               if (this.enterTime)
               {
                  $(this.paramName + "_timeValue").value = paramValue.auxiliaryValue;
                  timeSet=true;
               }

               this.showFuzzy();
            }
         }
      }
   }

   //if the user is being prompted for time; and it is not already set -- set it to the default
   if (this.enterTime && !timeSet)
   {
      $(this.paramName + "_timeValue").value = this.defaultInitialTimeValue;
   }
};


/**
 * return the currently displayed option (concrete or fuzzy)
 **/
DateParameterWidget.prototype.isConcrete = function()
{
   return isConcrete = !this.enableFuzzyDates || $(this.paramName + '_fuzzyDiv').style.display == "none";
};

/**
 * return the currently displayed option (concrete or fuzzy)
 **/
DateParameterWidget.prototype.isFuzzy = function()
{
   return !(this.isConcrete());
};

/**
 * get the current concrete value...
 **/
DateParameterWidget.prototype.getConcreteValue = function()
{
   return $F(this.paramName + "_concreteValue");
};

/**
 * get the current fuzzy value...
 **/
DateParameterWidget.prototype.getFuzzyValue = function()
{
   return $F(this.paramName + "_fuzzyValue");
};



/**
 * update the associated parameter's state based on our current values
 **/
DateParameterWidget.prototype.updateParamValues = function()
{
   if (this.isConcrete())
   {
      var concreteValue = this.getConcreteValue();
      if (concreteValue)
      {
         if (this.enterTime)
         {
            var actualvalue = concreteValue +  " "+ this.getTime();
            this.paramSet.addParameter(ReportParameter.createSingleConcreteParameter(this.paramName, actualvalue, actualvalue));
         }
         else
         {
            this.paramSet.addParameter(ReportParameter.createSingleConcreteParameter(this.paramName, concreteValue, concreteValue + " 00:00:00"));
         }
      }
   }
   else
   {
      var fuzzyValue = this.getFuzzyValue();

      if (fuzzyValue)
      {

         if (this.enterTime)
         {
            this.paramSet.addParameter(ReportParameter.createSingleFuzzyParameter(this.paramName, fuzzyValue, this.getTime()));
         }
         else
         {
            this.paramSet.addParameter(ReportParameter.createSingleFuzzyParameter(this.paramName, fuzzyValue));
         }


      }
   }
};

DateParameterWidget.prototype.getTime = function()
{
   var time = $F(this.paramName + "_timeValue");
   if(time == null)
   {
       $(this.paramName + "_timeValue").value = this.defaultInitialTimeValue;
       time = $F(this.paramName + "_timeValue");
   }

   return time;
}


/**
 *
 **/
DateParameterWidget.prototype.showFuzzy = function()
{
   $(this.paramName + '_fuzzyDiv').style.display = "block";
   $(this.paramName + '_concreteDiv').style.display = "none";
};

/**
 *
 **/
DateParameterWidget.prototype.showConcrete = function()
{
   $(this.paramName + '_fuzzyDiv').style.display = "none";
   $(this.paramName + '_concreteDiv').style.display = "block";
};

/**
 * validates the current date value, returns true if its valid,
 * false if its not valid.
 **/
DateParameterWidget.prototype.validate = function(aFormat, aAllowBlank)
{
   if (this.isFuzzy())
      return true;

   var concreteValue = this.getConcreteValue();

   return Date.validateDateStr(concreteValue, aFormat, aAllowBlank);
};



/**
 * unwire any bi-directional references between dom and our object model...
 **/
DateParameterWidget.prototype._onUnload = function()
{
   //alert('unloading [' + this.containerId + ']');
   var containerDiv = $(this.containerId);
   containerDiv.widget = null;
};


DateParameterWidget.prototype.createNamedTimeEntryArray = function()
{
   var timeEntries = new Array();

    for ( var namedTime in namedTimeValues)
    {
       var time = namedTimeValues[namedTime];

       var displayTime = time.name;
       var actualTime =  time.timeValue;

       timeEntries.push( new TimeEntry(displayTime, actualTime) );

    }


    return timeEntries;
}

DateParameterWidget.prototype.createTimeEntryArray = function(aInterval)
{
    var timeEntries = new Array();

    for (var hour = 0; hour < 24; hour++)
    {
       var displayHour = (hour == 0) ? 12 : (hour>12) ? hour-12 : hour;
       var amPm = (hour<12) ? " AM" : " PM";

       for (var min = 0; min < 60; min+=aInterval)
       {

         var displayTime = twoDigitString(displayHour) + ":" + twoDigitString(min) + amPm;
         var actualTime = twoDigitString(hour) + ":" + twoDigitString(min) + ":00";  //24 hour clock

         timeEntries.push( new TimeEntry(displayTime, actualTime) );
       }
    }


    return timeEntries;
}

/**
 * insert this widget into the document under the supplied insertion point element
 **/
DateParameterWidget.prototype.insertIntoDocument = function(aInsertionPoint)
{
   var fuzzyOnClick = 'onclick="$(\'' + this.containerId + '\').widget.showFuzzy();"';
   var concreteOnClick = 'onclick="$(\'' + this.containerId + '\').widget.showConcrete();"';

   var html =
      '<div class="dateParamLabel">' +
         '<span class="label" id="' + this.paramName + '_label">' + this.paramLabel + '</span>' +
      '</div>' +
      '<div class="dateParamValuesDiv">';
   if( this.enableFuzzyDates )
   {
      html += '<input type="radio" name="' + this.paramName + '_dateType" id="' + this.paramName + '_rbFuzzy" ' + fuzzyOnClick + '>' + applicationResources.getProperty("prompt.dateParameterWidget.relative") + '<br/>' +
            '<input type="radio" name="' + this.paramName + '_dateType" id="' + this.paramName + '_rbConcrete" checked="checked" ' + concreteOnClick + '>' + applicationResources.getProperty("prompt.dateParameterWidget.specific") +
            '<div id="' + this.paramName + '_fuzzyDiv" style="display:none">' +
               '<select name="' + this.paramName + '_fuzzyValue" id="'+ this.paramName + '_fuzzyValue">';
      DateParameterWidget.fuzzyDateValues.each(function (aValue) {
         html += '<option value="' + aValue + '">' + aValue + '</option>';
      });

      html +=  '</select>' +
         '</div>';
   }

   html +=
         '<div id="' + this.paramName + '_concreteDiv">' +
            '<input type="text" size="10" name="' + this.paramName + '_concreteValue" id="' + this.paramName + '_concreteValue" />' +
            '<input type="button" value="..." id="' + this.paramName + '_pickConcreteDateButton"/>' +
         '</div>' ;


   if (this.enterTime)
   {




      html += '<div name="' + this.paramName + '_timeDiv" id="' + this.paramName + '_timeDiv">' +
              '<select name="' + this.paramName + '_timeValue" id="' + this.paramName + '_timeValue">';

      //html += '<option value="' + '12:30' + '">' +  '12:30'+ '</option>';
      var timeEntries = this.createTimeEntryArray(this.timeInterval);

      var namedtimeEntries = this.createNamedTimeEntryArray();
      namedtimeEntries.each(
              function (aValue)
              {
                 html += '<option value="' + aValue.actualValue + '">' + aValue.displayValue + '</option>';
              });

       html += '<optgroup label="---------------"></optgroup>';    //empty optgroup to create seporator

      timeEntries.each(
              function (aValue)
              {
                 html += '<option  value="' + aValue.actualValue + '">' + aValue.displayValue + '</option>';
              });



      /**/

      html += '</select>' +'</div>';
   }




   html +=  '</div>';

   //alert(html);

   var containerDiv = document.createElement('div');
   containerDiv.id = this.containerId;
   containerDiv.className = "dateParameterWidget";
   if(!this.enableFuzzyDates)
   {
      if(!this.enterTime)
      {
         containerDiv.style.height="20px";
      }
      else
      {
         containerDiv.style.height="40px";
      }
   }

   containerDiv.widget = this;

   containerDiv.innerHTML = html;

   aInsertionPoint.appendChild(containerDiv);

   //--- now wire in the calendar...
   Calendar.setup( {
         inputField : this.paramName + '_concreteValue', // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button : this.paramName + '_pickConcreteDateButton' // ID of the button
      }
   );

   this.initFromParamValues();

};

function twoDigitString(aValue)
{
   if (aValue<10)
   {
      return "0" + aValue;
   }
   else
   {
      return "" + aValue;
   }
};

function TimeEntry (aDisplayValue, aActualValue)
{
   this.displayValue = aDisplayValue;
   this.actualValue = aActualValue;
};
