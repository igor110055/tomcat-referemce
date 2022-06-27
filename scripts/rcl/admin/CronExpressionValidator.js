/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: CronExpressionValidator.js 6945 2009-10-19 14:40:14Z dbequeaith $




//-----------------------------------------------------------------------------
/**
 * This class supports ajax based validation of a CronExpression.
 *
 * @constructor
 * @class
 * @author David Paul (dpaul@inmotio.com)
 **/

//-----------------------------------------------------------------------------

function CronExpressionValidator( )
{
   this.checkSucceeded = false;
   this.errMsg = applicationResources.getProperty("management.validation.defaultError");
}

CronExpressionValidator.prototype.isCronExpressionValidated = function()
{
   return this.checkSucceeded;
};

CronExpressionValidator.prototype.getErrMsg = function()
{
   return this.errMsg;
};

CronExpressionValidator.prototype.isCronExpressionValid = function(aTriggerName, aMin, aHour, aDay, aMonth, aWeekday, aDaysOld)
{
   var isValid = true;
   var nullCheck = document.getElementById("nullCheck");
   var minuteCheck = document.getElementById("minuteCheck");
   var hourCheck = document.getElementById("hourCheck");
   var dayCheck = document.getElementById("dayCheck");
   var monthCheck = document.getElementById("monthCheck");
   var weekdayCheck = document.getElementById("weekdayCheck");
   var daysOldCheck = document.getElementById("daysOldCheck");
   var markCheck = document.getElementById("markCheck");

   if (aTriggerName == "triggerForCleanupOldIncidentsJob")
   {
      if (aDaysOld == null)
      {
         daysOldCheck.innerHTML = "Days old cannot be null";
         daysOldCheck.style.color = "red";
         daysOldCheck.style.display = "block";
         isValid = false;
      }
      else if (!JsUtil.isInteger(aDaysOld))
      {
         daysOldCheck.innerHTML = "Days old must be an integer";
         daysOldCheck.style.color = "red";
         daysOldCheck.style.display = "block";
         isValid = false;
      }
      else
      {
         daysOldCheck.style.display = "none";
      }
   }

   if (aMin == null || aHour == null || aDay == null || aMonth == null || aWeekday == null ||
           aMin == "" || aHour == "" || aDay == "" || aMonth == "" || aWeekday == "")
   {
      nullCheck.innerHTML = applicationResources.getProperty("management.validation.null");
      nullCheck.style.color = "red";
      nullCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      nullCheck.style.display = "none";
   }

   if (!aMin.match("[0-9,*\\-*/*]+|\\*"))
   {
      minuteCheck.innerHTML = applicationResources.getProperty("management.validation.minute");
      minuteCheck.style.color = "red";
      minuteCheck.style.display = "block";
      isValid = false;
   }
   else if (!this.isValidRange(aMin, -1, 60))
   {
      minuteCheck.innerHTML = applicationResources.getProperty("management.validation.minute");
      minuteCheck.style.color = "red";
      minuteCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      minuteCheck.style.display = "none";
   }

   // Check hours
   if (!aHour.match("[0-9,*\\-*/*]+|\\*"))
   {
      hourCheck.innerHTML = applicationResources.getProperty("management.validation.hour");
      hourCheck.style.color = "red";
      hourCheck.style.display = "block";
      isValid = false;
   }
   else if (!this.isValidRange(aHour, -1, 24))
   {
      hourCheck.innerHTML = applicationResources.getProperty("management.validation.hour");
      hourCheck.style.color = "red";
      hourCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      hourCheck.style.display = "none";
   }

   // Check day of the month
   if (!aDay.match("[0-9,*\\-*/*W*C*]+|\\*|\\?|L|LW"))
   {
      dayCheck.innerHTML = applicationResources.getProperty("management.validation.day");
      dayCheck.style.color = "red";
      dayCheck.style.display = "block";
      isValid = false;
   }
   else if (!this.isValidRange(aDay, 0, 32))
   {
      dayCheck.innerHTML = applicationResources.getProperty("management.validation.day");
      dayCheck.style.color = "red";
      dayCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      dayCheck.style.display = "none";
   }

   // Check months
   if (!aMonth.match("[0-9,*\\-*/*]+|\\*|[A-Za-z,*\\-*]+"))
   {
      monthCheck.innerHTML = applicationResources.getProperty("management.validation.month");
      monthCheck.style.color = "red";
      monthCheck.style.display = "block";
      isValid = false;
   }
   else if (!this.isValidRange(aMonth, 0, 13))
   {
      monthCheck.innerHTML = applicationResources.getProperty("management.validation.month");
      monthCheck.style.color = "red";
      monthCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      monthCheck.style.display = "none";
   }

   // Check day of the week
   if (!aWeekday.match("[1-7,*\\-*/*#*L*C*]+|\\*|\\?|[A-Za-z,*\\-*]+|L"))
   {
      weekdayCheck.innerHTML = applicationResources.getProperty("management.validation.weekday");
      weekdayCheck.style.color = "red";
      weekdayCheck.style.display = "block";
      isValid = false;
   }
   else if (!this.isValidRange(aWeekday, 0, 8, true))
   {
      weekdayCheck.innerHTML = applicationResources.getProperty("management.validation.weekday");
      weekdayCheck.style.color = "red";
      weekdayCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      weekdayCheck.style.display = "none";
   }

   // Check for question mark
   if ("?" == aDay && aDay == aWeekday)
   {
      markCheck.innerHTML = applicationResources.getProperty("management.validation.duplicatemark");
      markCheck.style.color = "red";
      markCheck.style.display = "block";
      isValid = false;
   }
   else if (!("?" == aDay || "?" == aWeekday))
   {
      markCheck.innerHTML = applicationResources.getProperty( "management.validation.nomark");
      markCheck.style.color = "red";
      markCheck.style.display = "block";
      isValid = false;
   }
   else
   {
      markCheck.style.display = "none";
   }

   return isValid;
};

CronExpressionValidator.prototype.isValidRange = function(aNumber, aStart, aStop, aWeekdayValue)
{
   if (typeof aWeekdayValue == "undefined")
   {
      aWeekdayValue = false;
   }
   
   var numbers = new Array();

   if (aNumber == null)
   {
      return false;
   }

   if ("?" == aNumber || "L" == aNumber || "LW" == aNumber || "*" == aNumber)
   {
      return true;
   }

   if (aNumber.indexOf("LC") != -1 || aNumber.indexOf("WC") != -1)
   {
      return false;
   }

   if (aNumber.indexOf("-") != -1)
   {
      numbers = aNumber.split("-");
   }
   else if (aNumber.indexOf(",") != -1)
   {
      numbers = aNumber.split(",");
   }
   else if (aNumber.indexOf("/") != -1)
   {
      numbers = aNumber.split("/");
   }
   else if (aNumber.indexOf("#") != -1)
   {
      numbers = aNumber.split("#");
      aStart = 0;
      aStop = 6;
   }
   else if (aNumber.indexOf("L") != -1)
   {
      numbers[0] = aNumber.substring(0, aNumber.indexOf("L"));
   }
   else if (aNumber.indexOf("C") != -1)
   {
      numbers[0] = aNumber.substring(0, aNumber.indexOf("C"));
   }
   else if (aNumber.indexOf("W") != -1)
   {
      numbers[0] = aNumber.substring(0, aNumber.indexOf("W"));
   }
   else
   {
      numbers[0] = aNumber;
   }

   if (numbers.length == 0)
   {
      return false;
   }


   for (i=0; i < numbers.length; i++)
   {
      if (JsUtil.isInteger(numbers[i]) && numbers[i].indexOf("L") == -1)
      {
         if (!(parseInt(numbers[i]) > aStart && parseInt(numbers[i]) < aStop))
         {
            return false;
         }
      }
      else if ("*" == numbers[i])
      {
         return true;
      }
      else
      {
         if (aWeekdayValue)
         {
            if (!this.isDay(numbers[i]))
            {
               return false;
            }
         }
         else
         {
            if (!this.isMonth(numbers[i]))
            {
               return false;
            }
         }
      }
   }

   return true;
};

CronExpressionValidator.prototype.isDay = function (aDay)
{
   var days = new Array("mon", "tue", "wed", "thu", "fri", "sat", "sun");

   for (i=0; i < days.length; i++)
   {
      if (days[i] == aDay.toLowerCase())
      {
         return true;
      }
   }
   return false;
};

CronExpressionValidator.prototype.isMonth = function(aMonth)
{
   var months = new Array("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec");
   
   for (i=0; i < months.length; i++)
   {
      if (months[i]==aMonth.toLowerCase())
      {
         return true;
      }
   }
   return false;
};