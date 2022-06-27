/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */


Adf = Ext.ns('Adf');
Adf.widgets = Ext.ns('Adf.widgets');
Adf.widgets.legacy = Ext.ns('Adf.widgets.legacy');


Adf.DateParameterWidgetTimeCombo = Ext.extend(Ext.form.ComboBox, {
   SEPARATOR: '---------------',

   namedTimeValues: [{displayValue: applicationResources.getProperty("prompt.dateParameterWidget.startOfDay"), actualValue: "00:00:00"},
      {displayValue: "8:00 AM", actualValue: "08:00:00"},
      {displayValue: applicationResources.getProperty("prompt.dateParameterWidget.noon"), actualValue: "12:00:00"},
      {displayValue: "5:00 PM", actualValue: "17:00:00"},
      {displayValue: applicationResources.getProperty("prompt.dateParameterWidget.endOfDay"), actualValue: "23:59:59"}],

   constructor: function(aConfig)
   {
      this.timeInterval = Ext.isEmpty(aConfig.timeInterval) ? 30 : aConfig.timeInterval;


      var timeStore = new Ext.data.JsonStore({
         autoDestroy: true,
         root: 'namedTimeValues',
         idProperty: 'displayValue',
         fields: ['displayValue', 'actualValue']
      });

      timeStore.loadData(this);
      timeStore.loadData({namedTimeValues: {displayValue: this.SEPARATOR, actualValue: this.SEPARATOR}}, true);
      timeStore.loadData({namedTimeValues: this.createTimeEntryArray(this.timeInterval)}, true);



      aConfig = Ext.apply({
         store: timeStore,
         triggerAction: 'all',
         mode: 'local',
         forceSelection: true,
         displayField: 'displayValue',
         valueField: 'actualValue',
         value: '08:00:00',
         lazyInit: false,

         listeners: {
            beforeselect : function(aComboBox, aRecord, aIndex){
               if (aRecord.data.actualValue == this.SEPARATOR)
               {
                  return false;
               }
               else
               {
                  return true;
               }
            }
         }
      }, aConfig);

      Adf.DateParameterWidgetTimeCombo.superclass.constructor.call(this, aConfig);
   }
   ,


   // private
   onViewOver : function(e, t){
      if(this.inKeyMode){ // prevent key nav and mouse over conflicts
         return;
      }
      var item = this.view.findItemFromChild(t);
      if(item){
         var index = this.view.indexOf(item);
         var record = this.view.getStore().getAt(index);
         if (record.data.displayValue != this.SEPARATOR)
         {
            this.select(index, false);
         }
      }
   }
   ,

   // private
   selectNext : function(){
      var ct = this.store.getCount();
      if(ct > 0)
      {
         if(this.selectedIndex == -1)
         {
            this.select(0);
         }
         else if(this.selectedIndex < ct-1)
         {
            var index = this.selectedIndex+1;
            var record = this.view.getStore().getAt(index);
            if (record.data.displayValue == this.SEPARATOR)
            {
               index++;
            }
            this.select(index);
         }
      }
   },

   // private
   selectPrev : function(){
      var ct = this.store.getCount();
      if(ct > 0)
      {
         if(this.selectedIndex == -1)
         {
            this.select(0);
         }
         else if(this.selectedIndex !== 0)
         {
            var index = this.selectedIndex-1;
            var record = this.view.getStore().getAt(index);
            if (record.data.displayValue == this.SEPARATOR)
            {
               index--;
            }
            this.select(index);
         }
      }
   },


   createTimeEntryArray: function(aInterval)
   {
      var timeEntries = new Array();

      for (var hour = 0; hour < 24; hour++)
      {
         var displayHour = (hour == 0) ? 12 : (hour>12) ? hour-12 : hour;
         var amPm = (hour<12) ? " AM" : " PM";

         for (var min = 0; min < 60; min+=aInterval)
         {

            var displayTime = this.twoDigitString(displayHour) + ":" + this.twoDigitString(min) + amPm;
            var actualTime = this.twoDigitString(hour) + ":" + this.twoDigitString(min) + ":00";  //24 hour clock

            timeEntries.push({
               displayValue: displayTime,
               actualValue: actualTime
            });
         }
      }

      return timeEntries;
   },

   twoDigitString: function(aValue)
   {
      if (aValue<10)
      {
         return "0" + aValue;
      }
      else
      {
         return "" + aValue;
      }
   }

});





Adf.DateParameterWidget = Ext.extend(Ext.form.FieldSet, {

   // todo: get from server.
   fuzzyDateValues: [
      "PriorMonthBegin",
      "PriorMonthEnd",
      "PriorWeekBegin",
      "PriorWeekEnd",
      "PriorDay",
      "CurrentDay"
   ],

   constructor: function(aConfig)
   {
      aConfig = Ext.apply(aConfig, {
         parameterName: !Ext.isEmpty(aConfig.parameterName) ? aConfig.parameterName : Ext.id(),
         title: !Ext.isEmpty(aConfig.title) ? aConfig.title : '',
         parameterSet: !Ext.isEmpty(aConfig.parameterSet) ? aConfig.parameterSet : null,
         concreteDateFormat: !Ext.isEmpty(aConfig.concreteDateFormat) ? aConfig.concreteDateFormat : 'Y-m-d',
         enableFuzzyDateField: Ext.isBoolean(aConfig.enableFuzzyDateField) ? aConfig.enableFuzzyDateField : true,
         enableTimeField: Ext.isBoolean(aConfig.enableTimeField) ? aConfig.enableTimeField : false,
         timeInterval: Ext.isNumber(aConfig.timeInterval) ?  aConfig.timeInterval : 30,
         defaultInitialTimeValue: !Ext.isEmpty(aConfig.initialTimeValue) ? aConfig.initialTimeValue : '08:00:00'
      });


      // todo move control creation to initComponent or render and then we don't have to do this.
      Ext.apply(this, aConfig);
//      this.parameterName = aConfig.parameterName;
//      this.title: aConfig.title;
//      this.parameterSet = aConfig.parameterSet;
//      this.concreteDateFormat = aConfig.concreteDateFormat;
//      this.enableFuzzyDateField = aConfig.enableFuzzyDateField;
//      this.enableTimeField = aConfig.enableTimeField;
//      this.timeInterval = aConfig.timeInterval;
//      this.initialTimeValue = aConfig.initialTimeValue;


      this.valueField = new Ext.form.Hidden({

      });



      this.showFuzzyDateButton = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("prompt.dateParameterWidget.relative"),
         label: 'Start Date',
         id: this.parameterName + '_rbFuzzy',
         name: this.parameterName + '_dateType',
         listeners: {
            scope: this,
            check: this.onFuzzyDateButtonChecked
         }
      });

      this.showConcreteDateButton = new Ext.form.Radio({
         boxLabel: applicationResources.getProperty("prompt.dateParameterWidget.specific"),
         id: this.parameterName + '_rbConcrete',
         name: this.parameterName + '_dateType',
         listeners: {
            scope: this,
            check: this.onConcreteDateButtonChecked
         }
      });


      this.concreteDateField = new Ext.form.DateField({
         id: this.parameterName + '_concreteValue',
         name: this.parameterName + '_concreteValue',
         format: this.concreteDateFormat
      });


      this.timeField = null;
      if (this.enableTimeField)
      {
         this.timeField = new Adf.DateParameterWidgetTimeCombo({
            id: this.parameterName + '_timeValue',
            name: this.parameterName + '_timeValue',
            timeInterval: 30,
            width: 140,
            value: aConfig.initialTimeValue
         });
      }


      this.fuzzyDateField = new Ext.form.ComboBox({
         store: this.fuzzyDateValues,
         id: this.parameterName + '_fuzzyValue',
         name: this.parameterName + '_fuzzyValue',
         width: 140
      });

      var items = [{
         xtype: 'radiogroup',
         items: [this.showConcreteDateButton, this.showFuzzyDateButton]
      }, this.concreteDateField, this.fuzzyDateField];
//      var items = [this.showFuzzyDateButton, this.showConcreteDateButton, this.concreteDateField, this.fuzzyDateField];
      if (this.enableTimeField)
      {
         items.push(this.timeField);
      }

      aConfig = Ext.apply({
         width: 360,
         items: items
      }, aConfig);

      Adf.DateParameterWidget.superclass.constructor.call(this, aConfig);


      this.showConcreteDateButton.setValue(true);

      Adf.DateParameterWidget.instances.push(this);
   },


   /**
    * This method handles the Fuzzy date radio button check event. It shows the Fuzzy date entry fields and hides the
    * Concrete date entry fields.
    *
    * @param aRadioButton (Ext.form.Radio) Fuzzy date radio button.
    * @param aChecked (Boolean) true if the Fuzzy date radio is selected, otherwise false.
    */
   onFuzzyDateButtonChecked: function (aRadioButton, aChecked)
   {
      if (aChecked)
      {
         this.fuzzyDateField.setVisible(true);
         this.concreteDateField.setVisible(false);
         if (this.enableTimeField)
         {
            this.timeField.show();
         }
      }
   },


   /**
    * This method handles the Concrete radio button check event. It shows the Concrete date entry fields and hides the
    * Fuzzy date entry fields.
    *
    * @param aRadioButton (Ext.form.Radio) Show Concrete date radio button.
    * @param aChecked true if the show Concrete date button is selected, otherwise false.
    */
   onConcreteDateButtonChecked: function (aRadioButton, aChecked)
   {
      if (aChecked)
      {
         this.fuzzyDateField.setVisible(false);
         this.concreteDateField.setVisible(true);
         if (this.enableTimeField)
         {
            this.timeField.show();
         }
      }
   },


   /**
    * This method notifies the control to update the date parameter in the parameter set for submission to the server.
    */
   willSubmit: function ()
   {
      this.updateParamValues();
   },


   /**
    * This method updates the associated parameter's state based on our current values
    **/
   updateParamValues: function ()
   {
      if (this.isConcrete())
      {
         var concreteValue = this.getConcreteValue();
         if (concreteValue)
         {
            if (this.enableTimeField)
            {
               var actualValue = concreteValue + " " + this.getTimeValue();
               this.parameterSet.addParameter(ReportParameter.createSingleConcreteParameter(this.parameterName, actualValue, actualValue));
            }
            else
            {
               this.parameterSet.addParameter(ReportParameter.createSingleConcreteParameter(this.parameterName, concreteValue, concreteValue + " 00:00:00"));
            }
         }
      }
      else
      {
         var fuzzyValue = this.getFuzzyValue();
         if (fuzzyValue)
         {
            if (this.enableTimeField)
            {
               this.parameterSet.addParameter(ReportParameter.createSingleFuzzyParameter(this.parameterName, fuzzyValue, this.getTimeValue()));
            }
            else
            {
               this.parameterSet.addParameter(ReportParameter.createSingleFuzzyParameter(this.parameterName, fuzzyValue));
            }
         }
      }
   },


   /**
    * This method renders the widget as a child to the element specified by the insertion point.
    *
    * @param aInsertionPoint (HTMLElement) The element that will contain the widget.
    */
   insertIntoDocument: function (aInsertionPoint)
   {
      this.render(aInsertionPoint);
      this.initFromParamValues();
   },


   /**
    * This method initializes the widget's initial values from an existing report parameter.
    */
   initFromParamValues: function ()
   {
      var isTimeSet = false;
      if (!Ext.isEmpty(this.parameterSet))
      {
         var param = this.parameterSet.getParameter(this.parameterName);

         if (param && param.values.length > 0)
         {
            var paramValue = param.values[0];

            if (paramValue.isConcrete())
            {
               this.showConcreteDateButton.setValue(true);

               var dateAndTime = paramValue.value;

               var spaceIndex = dateAndTime.indexOf(' ');
               if (spaceIndex > -1)
               {
                  this.concreteDateField.setValue(dateAndTime.substring(0, dateAndTime.indexOf(' ')));
               }
               else
               {
                  this.concreteDateField.setValue(dateAndTime);
               }


               if (this.enableTimeField)
               {
                  this.timeField.setValue(dateAndTime.substring(dateAndTime.indexOf(' ') + 1));
                  isTimeSet = true;
               }
            }
            else
            {
               if (this.enableFuzzyDateField)
               {
                  this.showFuzzyDateButton.setValue(true);

                  if (this.enableTimeField)
                  {
                     this.timeField.setValue(paramValue.auxiliaryValue);
                     isTimeSet = true;
                  }

                  this.fuzzyDateField.setValue(paramValue.fuzzyValue);
               }
            }
         }
      }


      //if the user is being prompted for time; and it is not already set -- set it to the default
      if (this.enableTimeField && !isTimeSet)
      {
         this.timeField.setValue(this.defaultInitialTimeValue);
      }
   },


   /**
    * This method validates the current values in the control.
    * @param aFormat
    * @param aAllowBlank
    * @returns (Boolean) True if the values are valid otherwise false is returned.
    */
   validate: function (aFormat, aAllowBlank)
   {
      if (this.showFuzzyDateButton.getValue())
      {
         return true;
      }

      if (Ext.isString(aFormat))
      {
         var concreteValue = this.concreteDateField.getRawValue();
         return this.validateDateStr(concreteValue, aFormat, aAllowBlank);
      }
      else
      {
         return this.concreteDateField.validate();
      }
   },

//   legacyValidate: function(aFormat, aAllowBlank)
//   {
//      if (this.showFuzzyDateButton.getValue())
//      {
//         return true;
//      }
//
//      var concreteValue = this.concreteDateField.getRawValue();
//      return this.validateDateStr(concreteValue, aFormat, aAllowBlank);
//   },




   validateDateStr: function(aDateStr, aFormat, aAllowBlank)
   {
      if (Date.validateDateStr)
      {
         return Date.validateDateStr(aDateStr, aFormat, aAllowBlank)
      }
      else
      {
         if (Ext.isEmpty(aDateStr))
         {
            return Ext.isBoolean(aAllowBlank) ? aAllowBlank : false;
         }
         else
         {
            aFormat = aFormat.replace(/%/g, '');
            return (Date.parseDate(aDateStr, aFormat, true) != null)
         }
      }
   },


   /**
    * This method was used by the legacy code to unwire any bi-directional references between dom and our object model.
    *
    * @deprecated
    */
   _onUnload: function ()
   {
//      //alert('unloading [' + this.containerId + ']');
//      var containerDiv = $(this.containerId);
//      containerDiv.widget = null;
   },


   /**
    * This property returns a flag which indicates that the control is setup for a Concrete date value.
    *
    * @returns (Boolean) True if the Concrete date value is active.
    */
   isConcrete: function ()
   {
      return this.showConcreteDateButton.getValue();
   },


   /**
    * This property returns a flag which indicates that the control is setup for a Fuzzy date value.
    *
    * @returns (Boolean) True if the Fuzzy date value is active.
    */
   isFuzzy: function ()
   {
      return this.showFuzzyDateButton.getValue();
   },


   /**
    * This property returns the current Concrete date value.
    *
    * @returns {String} A date or an empty string if no date value is set.
    */
   getConcreteValue: function ()
   {
      var currentDate = this.concreteDateField.getValue();
      if (!Ext.isEmpty(currentDate))
      {
         // todo: date format.
         return currentDate.format('Y-m-d');
      }
      else
      {
         return "";
      }
   },


   /**
    * This property returns the current Fuzzy date value.
    *
    * @returns {String} The current value or an empty if no value is set.
    */
   getFuzzyValue: function ()
   {
      return this.fuzzyDateField.getValue();
   },


   /**
    * This property returns the current Time value. If a time value has not been selected then the default time
    * is set and returned.
    *
    * @returns (String) Current time value.
    */
   getTimeValue: function ()
   {
      var time = this.timeField.getValue();
      if (Ext.isEmpty(time))
      {
         this.timeField.setValue(this.defaultInitialTimeValue);
         time = this.timeField.getValue();
      }
      return time;
   }



});



// todo remove?
Adf.DateParameterWidget.instances = [];
Adf.DateParameterWidget.onDocumentUnload = function()
{
   Adf.DateParameterWidget.instances.each(function(anInstance) {
      anInstance._onUnload();
   });
};

//--- make sure all instances cleanly unwire themselves from the DOM...
DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
   Adf.DateParameterWidget.onDocumentUnload();
});



/**
 *
 * @param aParamName
 * @param aParamLabel
 * @param aParamSet
 * @param aEnterTime
 * @param aTimeInterval
 * @param aDefaultInitialTimeValue
 * @param aEnableFuzzyDates
 * @constructor
 */
Adf.LegacyDateParameterWidget = function (aParamName, aParamLabel, aParamSet, aEnterTime, aTimeInterval, aDefaultInitialTimeValue, aEnableFuzzyDates)
{
   var config = {
      parameterName: aParamName,
      title: aParamLabel,
      parameterSet: aParamSet,
      concreteDateFormat: 'Y-m-d',
      enableFuzzyDateField: Ext.isBoolean(aEnableFuzzyDates) ? aEnableFuzzyDates : true,
      enableTimeField: Ext.isBoolean(aEnterTime) ? aEnterTime : false,
      timeInterval: Ext.isNumber(aTimeInterval) ?  aTimeInterval : 30,
      initialTimeValue: !Ext.isEmpty(aDefaultInitialTimeValue) ? aDefaultInitialTimeValue : '08:00:00'
   };

   Adf.LegacyDateParameterWidget.superclass.constructor.call(this, config);
}
DateParameterWidget = Ext.extend(Adf.LegacyDateParameterWidget, Adf.DateParameterWidget, {

});


// Override the legacy date parameter widget.
//DateParameterWidget = Adf.LegacyTest;




//temp = {
//
//   extend : function(){
//      // inline overrides
//      var io = function(o){
//         for(var m in o){
//            this[m] = o[m];
//         }
//      };
//
//      var oc = Object.prototype.constructor;
//
//
//      return function(aSubClass, aSuperClass, overrides){
//
//
//         // If the super class parameter is an object then it's using the 2 parameter function call. Alter the parameters
//         // so it's a 3 parameter function call.
//         if(Ext.isObject(aSuperClass))
//         {
//            overrides = aSuperClass;
//            aSuperClass = aSubClass;
//
//            // Shifting over the previous parameters causes the first parameter to redefined. Use the constructor from
//            // the overrides. If one is not defined then create a new class that calls the super class function, not sure why?
//            aSubClass = overrides.constructor != oc ? overrides.constructor : function(){aSuperClass.apply(this, arguments);};
//         }
//
//
//         var F = function(){},
//            subClassPrototype,
//            superClassPrototype = aSuperClass.prototype;
//
//         F.prototype = superClassPrototype;
//         subClassPrototype = aSubClass.prototype = new F();
//         subClassPrototype.constructor=aSubClass;
//         aSubClass.superclass=superClassPrototype;
//
//         if(superClassPrototype.constructor == oc){
//            superClassPrototype.constructor=aSuperClass;
//         }
//
//         aSubClass.override = function(o){
//            Ext.override(aSubClass, o);
//         };
//
//         subClassPrototype.superclass = subClassPrototype.supr = (function(){
//            return superClassPrototype;
//         });
//
//         subClassPrototype.override = io;
//
//         Ext.override(aSubClass, overrides);
//
//         aSubClass.extend = function(o){return Ext.extend(aSubClass, o);};
//
//         return aSubClass;
//      };
//   }()
//   ,
//
//
//   apply : function(o, c, defaults){
//      // no "this" reference for friendly out of scope calls
//      if(defaults){
//         Ext.apply(o, defaults);
//      }
//      if(o && c && typeof c == 'object'){
//         for(var p in c){
//            o[p] = c[p];
//         }
//      }
//      return o;
//   },
//
//   override : function(origclass, overrides){
//      if(overrides){
//         var p = origclass.prototype;
//         Ext.apply(p, overrides);
//         if(Ext.isIE && overrides.hasOwnProperty('toString')){
//            p.toString = overrides.toString;
//         }
//      }
//   },
//
//
//   extend : function(){
//      // inline overrides
//      var io = function(o){
//         for(var m in o){
//            this[m] = o[m];
//         }
//      };
//
//      var oc = Object.prototype.constructor;
//
//
//      return function(aFuncA, aFuncB, overrides){
//
//         if(Ext.isObject(aFuncB)){
//            overrides = aFuncB;
//            aFuncB = aFuncA;
//            aFuncA = overrides.constructor != oc ? overrides.constructor : function(){aFuncB.apply(this, arguments);};
//         }
//
//         var F = function(){},
//            subClassPrototype,
//            superClassPrototype = aFuncB.prototype;
//
//         F.prototype = superClassPrototype;
//         subClassPrototype = aFuncA.prototype = new F();
//         subClassPrototype.constructor=aFuncA;
//         aFuncA.superclass=superClassPrototype;
//         if(superClassPrototype.constructor == oc){
//            superClassPrototype.constructor=aFuncB;
//         }
//         aFuncA.override = function(o){
//            Ext.override(aFuncA, o);
//         };
//         subClassPrototype.superclass = subClassPrototype.supr = (function(){
//            return superClassPrototype;
//         });
//         subClassPrototype.override = io;
//         Ext.override(aFuncA, overrides);
//         aFuncA.extend = function(o){return Ext.extend(aFuncA, o);};
//         return aFuncA;
//      };
//   }()
//};


