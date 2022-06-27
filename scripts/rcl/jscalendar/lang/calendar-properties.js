// Author: Chad Rainey <crainey@seekfocus.com>

// I am a property file for JsCalendar.  I depend on the ApplicationContext JS class.
// The other JsCalendar property files are for each locale but this property file pulls
// properties from the RclWebResource i18n bundle which helps keep all of RCL's i18n properties
// in a single file.

//todo I am not sure why Sunday is repeated in this array, but it is done like this in the other JsCalendar property files...
Calendar._DN = new Array
(applicationResources.getProperty("jsCalendar.sunday"),
 applicationResources.getProperty("jsCalendar.monday"),
 applicationResources.getProperty("jsCalendar.tuesday"),
 applicationResources.getProperty("jsCalendar.wednesday"),
 applicationResources.getProperty("jsCalendar.thursday"),
 applicationResources.getProperty("jsCalendar.friday"),
 applicationResources.getProperty("jsCalendar.saturday"),
 applicationResources.getProperty("jsCalendar.sunday"));

// Please note that the following array of short day names (and the same goes
// for short month names, _SMN) isn't absolutely necessary.  We give it here
// for exemplification on how one can customize the short day names, but if
// they are simply the first N letters of the full name you can simply say:
//
//   Calendar._SDN_len = N; // short day name length
//   Calendar._SMN_len = N; // short month name length
//
// If N = 3 then this is not needed either since we assume a value of 3 if not
// present, to be compatible with translation files that were written before
// this feature.

// short day names
Calendar._SDN = new Array
(applicationResources.getProperty("jsCalendar.sunday.abbr"),
 applicationResources.getProperty("jsCalendar.monday.abbr"),
 applicationResources.getProperty("jsCalendar.tuesday.abbr"),
 applicationResources.getProperty("jsCalendar.wednesday.abbr"),
 applicationResources.getProperty("jsCalendar.thursday.abbr"),
 applicationResources.getProperty("jsCalendar.friday.abbr"),
 applicationResources.getProperty("jsCalendar.saturday.abbr"),
 applicationResources.getProperty("jsCalendar.sunday.abbr"));

// First day of the week. "0" means display Sunday first, "1" means display
// Monday first, etc.
Calendar._FD = parseInt(applicationResources.getProperty("jsCalendar.firstDayOfWeek"));
//Calendar._FD = 0;

// full month names
Calendar._MN = new Array
(applicationResources.getProperty("jsCalendar.january"),
 applicationResources.getProperty("jsCalendar.february"),
 applicationResources.getProperty("jsCalendar.march"),
 applicationResources.getProperty("jsCalendar.april"),
 applicationResources.getProperty("jsCalendar.may"),
 applicationResources.getProperty("jsCalendar.june"),
 applicationResources.getProperty("jsCalendar.july"),
 applicationResources.getProperty("jsCalendar.august"),
 applicationResources.getProperty("jsCalendar.september"),
 applicationResources.getProperty("jsCalendar.october"),
 applicationResources.getProperty("jsCalendar.november"),
 applicationResources.getProperty("jsCalendar.december"));

// short month names
Calendar._SMN = new Array
(applicationResources.getProperty("jsCalendar.january.abbr"),
 applicationResources.getProperty("jsCalendar.february.abbr"),
 applicationResources.getProperty("jsCalendar.march.abbr"),
 applicationResources.getProperty("jsCalendar.april.abbr"),
 applicationResources.getProperty("jsCalendar.may.abbr"),
 applicationResources.getProperty("jsCalendar.june.abbr"),
 applicationResources.getProperty("jsCalendar.july.abbr"),
 applicationResources.getProperty("jsCalendar.august.abbr"),
 applicationResources.getProperty("jsCalendar.september.abbr"),
 applicationResources.getProperty("jsCalendar.october.abbr"),
 applicationResources.getProperty("jsCalendar.november.abbr"),
 applicationResources.getProperty("jsCalendar.december.abbr"));

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = applicationResources.getProperty("jsCalendar.tooltip.aboutTheCalendar");

//Calendar._TT["ABOUT"] =
//"DHTML Date/Time Selector\n" +
//"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
//"For latest version visit: http://www.dynarch.com/projects/calendar/\n" +
//"Distributed under GNU LGPL.  See http://gnu.org/licenses/lgpl.html for details." +
//"\n\n" +
//"Date selection:\n" +
//"- Use the \xab, \xbb buttons to select year\n" +
//"- Use the " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " buttons to select month\n" +
//"- Hold mouse button on any of the above buttons for faster selection.";
Calendar._TT["ABOUT"] = applicationResources.getPropertyWithParameters("jsCalendar.tooltip.about", new Array("\xab", "\xbb", String.fromCharCode(0x2039), String.fromCharCode(0x203a)));
Calendar._TT["ABOUT_TIME"] = applicationResources.getProperty("jsCalendar.tooltip.aboutTime");

Calendar._TT["PREV_YEAR"] = applicationResources.getProperty("jsCalendar.tooltip.prevYear");
Calendar._TT["PREV_MONTH"] = applicationResources.getProperty("jsCalendar.tooltip.prevMonth");
Calendar._TT["GO_TODAY"] = applicationResources.getProperty("jsCalendar.tooltip.goToday");
Calendar._TT["NEXT_MONTH"] = applicationResources.getProperty("jsCalendar.tooltip.nextMonth");
Calendar._TT["NEXT_YEAR"] = applicationResources.getProperty("jsCalendar.tooltip.nextYear");
Calendar._TT["SEL_DATE"] = applicationResources.getProperty("jsCalendar.tooltip.selectDate");
Calendar._TT["DRAG_TO_MOVE"] = applicationResources.getProperty("jsCalendar.tooltip.dragToMove");
Calendar._TT["PART_TODAY"] = applicationResources.getProperty("jsCalendar.tooltip.partToday");

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Calendar._TT["DAY_FIRST"] = applicationResources.getProperty("jsCalendar.tooltip.dayFirst");

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Calendar._TT["WEEKEND"] = applicationResources.getProperty("jsCalendar.tooltip.weekend");

Calendar._TT["CLOSE"] = applicationResources.getProperty("jsCalendar.tooltip.close");
Calendar._TT["TODAY"] = applicationResources.getProperty("jsCalendar.tooltip.today");
Calendar._TT["TIME_PART"] = applicationResources.getProperty("jsCalendar.tooltip.timePart");

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d"; //For RCL purposes, don't i18n this.
Calendar._TT["TT_DATE_FORMAT"] = applicationResources.getProperty("jsCalendar.tooltip.dateFormat");

Calendar._TT["WK"] = applicationResources.getProperty("jsCalendar.tooltip.week.abbr");
Calendar._TT["TIME"] = applicationResources.getProperty("jsCalendar.tooltip.time");