//-----------------------------------------------------------------------------
/**
 * Schedule Timing UI Model
 *
 * @constructor
 * @author Roger Moore
 **/

function ScheduleTimingUiModel(aCurrentTimeZone)
{
   this.currentTimeZone = aCurrentTimeZone;
}

ScheduleTimingUiModel.prototype = new AbstractSchedulerUiModel();
ScheduleTimingUiModel.prototype.constructor = ScheduleTimingUiModel;
ScheduleTimingUiModel.superclass = AbstractSchedulerUiModel.prototype;

//-----------------------------------------------------------------------------
/**
 * Schedule Timing UI Controller
 *
 * @constructor
 * @author Roger Moore
 **/
function ScheduleTimingUiController(aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractSchedulerUiController.prototype.constructor.call(this, aDocument, aModel);
   }
}

ScheduleTimingUiController.prototype = new AbstractSchedulerUiController();
ScheduleTimingUiController.prototype.constructor = ScheduleTimingUiController;
ScheduleTimingUiController.superclass = AbstractSchedulerUiController.prototype;

/**
 * initialize the ui...
 **/
ScheduleTimingUiController.prototype.initUi = function()
{
   ScheduleTimingUiController.superclass.initUi.call(this);

   this.setStageTitle(applicationResources.getProperty("scheduleWizard.stageTitle.timing"));
   this.disableNext();

   this.setEndCondition();

   //--- now wire in the calendar...
   Calendar.setup( {
         inputField : 'startDate', // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button :  'startDateBnt' // ID of the button
      }
   );

   if ($('endDateTxt')!=null)
   {
      Calendar.setup({
         inputField : 'endDateTxt', // ID of the input field
         ifFormat : "%Y-%m-%d", // the date format
         button :  'endDateBnt' // ID of the button
      }
              );
   }

   this.refreshView();


}

ScheduleTimingUiController.prototype.setEndCondition = function()
{
   if ($('endDateTxt')==null) return; //no end date showing

   var endDate = $F('endDate');
   var numberOfExecutions = parseInt($F('numberOfExecutions'));


   if( JsUtil.isGood(endDate) && JsUtil.trim(endDate).length>0)
   {
      $('endDateTxt').value = endDate;
      this.setRadioValue('endType', 'date');
      return;
   }
   else if( numberOfExecutions>0 && $('numExecutionsTxt')!=null /*not visible on some weekly, monthly, or yearly*/)
   {
      $('numExecutionsTxt').value = numberOfExecutions;
      this.setRadioValue('endType', 'numberOfExecutions');
      return;
   }
   else
   {
      this.setRadioValue('endType', 'indefinite') ;
      return;
   }
};

ScheduleTimingUiController.prototype.harvestEndCondition = function()
{
   if ($('endDateTxt')==null) return; //no end date showing

   $('endDate').value = '';
   $('numberOfExecutions').value = '-1'; //minus one is indefinite

   var endType =  this.getRadioValue('endType') ;

   if ('date'==endType)
   {
      $('endDate').value = $F('endDateTxt');
   }
   else if ('numberOfExecutions'==endType)
   {
      $('numberOfExecutions').value = $F('numExecutionsTxt');
   }

};

ScheduleTimingUiController.prototype.validateEndCondition = function()
{
   if ($('endDateTxt')==null) return true; //no end date showing

   var endType =  this.getRadioValue('endType') ;

   if ('date' == endType)
   {
      if (!this.validateDate($F('endDateTxt'), "%Y-%m-%d"))
      {
         alert(applicationResources.getProperty('scheduler.errors.invalidEndDate'));
         return false;
      }
   }
   else if ('numberOfExecutions' == endType)
   {
      return this.validateInterval('numExecutionsTxt', 'scheduler.errors.numberOfExecutions.lessThanEqualZero')
   }

   return true;

}



/**
 * hook for derived classes to do something (e.g. client side validation)
 * before submitting.  If the method returns false, the submit will be
 * cancelled.
 **/
ScheduleTimingUiController.prototype.beforeSubmit = function()
{


   var scheduleType = $F('scheduleType');

   if (scheduleType == ScheduleTypeEnum.DAILY.value)
   {
      if (!this.validateInterval('dailyMinuteInterval', 'scheduler.errors.dailyInterval.lessThanEqualZero') ||
          !this.validateInterval('dailyHourInterval', 'scheduler.errors.dailyInterval.lessThanEqualZero') ||
          !this.validateInterval('dailyDayInterval', 'scheduler.errors.dailyInterval.lessThanEqualZero') )
      {
         return false;
      }
   }
   else if (scheduleType == ScheduleTypeEnum.WEEKLY.value )
   {
      if (!this.validateInterval('weeklyInterval', 'scheduler.errors.weeklyInterval.lessThanEqualZero') )
      {
         return false;
      }

      var firstSelected = this.getRadioValue('weeklyDays'); //will return the first selected value
      if (firstSelected==null)
      {
         alert(applicationResources.getProperty('scheduler.errors.weeklyDays.noDaysSelected'));
         return false;
      }
   }
   else if (scheduleType == ScheduleTypeEnum.MONTHLY.value )
   {
      var monthlyValue = this.getRadioValue('monthlyType');

      if (monthlyValue == 'relative')
      {
         if (!this.validateInterval('monthlyRelativeInterval', 'scheduler.errors.monthlyInterval.lessThanEqualZero') )
         {
            return false;
         }
      }
      else
      {
         if (!this.validateInterval('monthlyAbsoluteInterval', 'scheduler.errors.monthlyInterval.lessThanEqualZero'))
         {
            return false;
         }
      }


   }

   if (!this.validateDate($F('startDate'), "%Y-%m-%d"))
   {
      alert(applicationResources.getProperty('scheduler.errors.invalidStartDate'));
      return false;
   }

   //for the time we just stick a random date on it and pass to validateDate; interestingly you can not just pass the time and adjust the format (times like 4:56 mess up)
   if (!this.validateDate('2006-12-29 ' + $F('startTime') + ' ' + $F('startTimeAmPm')  , "%Y-%m-%d %l:%M %p"))
   {
      alert(applicationResources.getProperty('scheduler.errors.invalidStartTime'));
      return false;
   }

   //if this is a new schedule, then we want to validate that the start date and time are not in the past
   if ( this.isNew()  )
   {
      var startDate = Date.parseDate($F('startDate') + ' ' + $F('startTime') + ' ' + $F('startTimeAmPm')  , "%Y-%m-%d %l:%M %p");
      var now = new Date();

      //we have to make an adjustment so that these items are at the same offset
      //now is at the user's browser offest
      //the user will assume start date is at the session offset (though it was parsed in the browser offset)

      var nowOffset =  -(now.getTimezoneOffset() * 60 * 1000); //Javascript is at minutes and Java is in milliseconds; plus there signs are opposite

      var difference =  nowOffset - this.model.currentTimeZone.currentOffset;

      startDate.setTime(startDate.getTime() + difference);

      if (now.getTime() > startDate.getTime())
      {
         alert(applicationResources.getProperty('scheduler.errors.startInPast'));
         return false;
      }
   }

   if (!this.validateEndCondition())
   {
      return false;
   }
   return true;
};

ScheduleTimingUiController.prototype.isNew = function()
{
   var scheduleId = $F('scheduleId');   
   return (scheduleId==null) || (scheduleId=='') || (scheduleId=='0');
};

ScheduleTimingUiController.prototype.validateDate = function(aDate, aFormat)
{
   return Date.validateDateStr(aDate, aFormat, false);
};

ScheduleTimingUiController.prototype.validateInterval = function(aIntervalName, aErrorProperty)
{
   var element = $(aIntervalName);

   if (element==null) return true; //element does not exist must be different type

   var value = element.value;

   var number = parseInt(value, 10);  //use base 10 to prevent leading zero from being considered octal

   if (isNaN(number) || number<=0)
   {
      alert(applicationResources.getProperty(aErrorProperty));
      return false;
   }

   return true;
};


/**
 * hook for derived classes to do something when form submission is
 * imminent...
 **/
ScheduleTimingUiController.prototype.willSubmit = function()
{
   this.harvestEndCondition();

   //the schedule is complete at the end of the timing step
   $('complete').value='true';

};

ScheduleTimingUiController.prototype.getStageName = function()
{
   return "timing";
};

ScheduleTimingUiController.prototype.previousButton = function()
{
   this.jumpTo('type');
};

ScheduleTimingUiController.prototype.nextButton = function()
{
   this.jumpTo('timing');
};

ScheduleTimingUiController.prototype.refreshView = function()
{
   this.refreshDailySelections();
   this.refreshWeeklySelections();
   this.refreshMonthlySelections();
   this.refreshYearlySelections();
   this.refreshEndSelections();
};

ScheduleTimingUiController.prototype.refreshEndSelections = function()
{

}

ScheduleTimingUiController.prototype.refreshDailySelections = function()
{
   var radioOptions = this.document.getElementsByName('dailyRate');

   if (radioOptions==null) return; //this would happen if daily was not the given schedule type


   for (var i = 0; i < radioOptions.length; i++)
   {
      var eachValue = radioOptions[i];

      if ("days" == eachValue.value )
      {
         var textBox = $('dailyDayInterval')
         textBox.disabled = !eachValue.checked;

         if (textBox.disabled) textBox.value=1;
      }
      else if ("hours" == eachValue.value )
      {
         var textBox = $('dailyHourInterval')
         textBox.disabled = !eachValue.checked;

         if (textBox.disabled) textBox.value=1;
      }
      else if ("minutes" == eachValue.value )
      {
         var textBox = $('dailyMinuteInterval')
         textBox.disabled = !eachValue.checked;

         if (textBox.disabled) textBox.value=1;
      }

   }
};

ScheduleTimingUiController.prototype.refreshWeeklySelections = function()
{
   var radioOptions = this.document.getElementsByName('weeklyDays');

   if (radioOptions==null || radioOptions.length==0) return; //this would happen if weekly was not the given schedule type


   //check to see if any days are selected; if not, choose the current day
   var firstSelected = this.getRadioValue('weeklyDays');
   if (firstSelected == null)
   {
      var today=new Date();
      var thisDay=today.getDay();

      radioOptions[thisDay].checked=true;
   }





};

ScheduleTimingUiController.prototype.refreshMonthlySelections = function()
{

   var monthlyValue = this.getRadioValue('monthlyType');

   if (monthlyValue==null) return null; //not a monthly schedule

   if (monthlyValue == "relative")
   {
      this.document.getElementById('monthlyWeek').disabled = false;
      this.document.getElementById('monthlyWeekDay').disabled = false;
      this.document.getElementById('monthlyRelativeInterval').disabled = false;

      this.document.getElementById('monthlyDay').disabled = true;
      this.document.getElementById('monthlyAbsoluteInterval').disabled = true;
   }
   else
   {
      this.document.getElementById('monthlyWeek').disabled = true;
      this.document.getElementById('monthlyWeekDay').disabled = true;
      this.document.getElementById('monthlyRelativeInterval').disabled = true;

      this.document.getElementById('monthlyDay').disabled = false;
      this.document.getElementById('monthlyAbsoluteInterval').disabled = false;

   }
};

ScheduleTimingUiController.prototype.refreshYearlySelections = function()
{

   var yearlyValue = this.getRadioValue('yearlyType');

   if (yearlyValue==null) return; //not a yearly schedule

   if (yearlyValue == "relative")
   {
      this.document.getElementById('yearlyWeek').disabled = false;
      this.document.getElementById('yearlyWeekDay').disabled = false;
      this.document.getElementById('yearlyRelativeMonth').disabled = false;

      this.document.getElementById('yearlyDay').disabled = true;
      this.document.getElementById('yearlyAbsoluteMonth').disabled = true;
   }
   else
   {
      this.document.getElementById('yearlyWeek').disabled = true;
      this.document.getElementById('yearlyWeekDay').disabled = true;
      this.document.getElementById('yearlyRelativeMonth').disabled = true;

      this.document.getElementById('yearlyDay').disabled = false;
      this.document.getElementById('yearlyAbsoluteMonth').disabled = false;
   }
};


/**
 *  returns "days" "minutes" or "hours" depending on what is selected
 **/
ScheduleTimingUiController.prototype.getDailyRateType = function ()
{
   return getRadioValue('dailyRate');
};

ScheduleTimingUiController.prototype.setRadioValue = function (aElementId, aValue)
{

   var radioOptions = this.document.getElementsByName(aElementId);


   for (var i = 0; i < radioOptions.length; i++)
   {
      var eachValue = radioOptions[i];
      //alert (eachValue.name);
      //alert (eachValue.checked);
      //alert (eachValue.value);
      if (eachValue.value == aValue)
      {
         //alert ('checking ' + eachValue.value);
         eachValue.checked = true
      }
      else
      {
        eachValue.checked = false;
      }

   }

   return null;
};

ScheduleTimingUiController.prototype.getRadioValue = function (aElementId)
{

   var radioOptions = this.document.getElementsByName(aElementId);

   if (radioOptions==null)   //note we do depend on this behavior in the refresh monthly and yearly methods above
       return null;

   for (var i = 0; i < radioOptions.length; i++)
   {
      var eachValue = radioOptions[i];
      //alert (eachValue.name);
      //alert (eachValue.checked);
      if (eachValue.checked == true)
      {
         return eachValue.value;
      }
   }

   return null;
};
