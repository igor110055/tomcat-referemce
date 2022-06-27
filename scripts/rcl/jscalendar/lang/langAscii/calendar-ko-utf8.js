// ** I18N

// Calendar EN language
// Author: Mihai Bazon, <mihai_bazon@yahoo.com>
// Translation: Yourim Yi <yyi@yourim.net>
// Encoding: EUC-KR
// lang : ko
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible.  We strongly believe that
// Unicode is the answer to a real internationalized world.  Also please
// include your contact information in the header, as can be seen above.

// full day names

Calendar._DN = new Array
("\ufffd\ufffd\uc1f1\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\uf9cf\u2479\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\u6e72\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\uc1f1\ufffd\ufffd\ufffd\ufffd\ufffd");

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
("\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd",
 "\uf9cf\ufffd",
 "\u6e72\ufffd",
 "\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd");

// First day of the week. "0" means display Sunday first, "1" means display
// Monday first, etc.
Calendar._FD = 0;

// full month names
Calendar._MN = new Array
("1\ufffd\ufffd\ufffd",
 "2\ufffd\ufffd\ufffd",
 "3\ufffd\ufffd\ufffd",
 "4\ufffd\ufffd\ufffd",
 "5\ufffd\ufffd\ufffd",
 "6\ufffd\ufffd\ufffd",
 "7\ufffd\ufffd\ufffd",
 "8\ufffd\ufffd\ufffd",
 "9\ufffd\ufffd\ufffd",
 "10\ufffd\ufffd\ufffd",
 "11\ufffd\ufffd\ufffd",
 "12\ufffd\ufffd\ufffd");

// short month names
Calendar._SMN = new Array
("1",
 "2",
 "3",
 "4",
 "5",
 "6",
 "7",
 "8",
 "9",
 "10",
 "11",
 "12");

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = "calendar \ufffd\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ub301\ufffd\ufffd";

Calendar._TT["ABOUT"] =
"DHTML Date/Time Selector\n" +
"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
"\n"+
"\uf9e4\ufffd\ufffd\ufffd\ufffd \u8e30\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd \u8adb\ufffd\ufffd\ufffd\uc1f1\ufffd\ufffd\ufffd\ufffd\u317b\u3203 http://www.dynarch.com/projects/calendar/ \ufffd\ufffd\ufffd \u8adb\u2478\u0426\ufffd\ufffd\ufffd\ufffd\ufffd\uba84\ufffd\ufffd\n" +
"\n"+
"GNU LGPL \ufffd\ufffd\uc1f1\ufffd\ub301\ufffd\uc1f1\ufffd\u317b\ufffd\ufffd \u8adb\uace0\ufffd\u0449\ufffd\u2478\ufffd\ufffd\ufffd\ufffd\ufffd. \n"+
"\ufffd\ufffd\uc1f1\ufffd\ub301\ufffd\uc1f1\ufffd\u317c\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\uba85\ufffd\ufffd \ufffd\ufffd\ub301\ufffd\u2479\ufffd\ufffd http://gnu.org/licenses/lgpl.html \ufffd\ufffd\ufffd \ufffd\ufffd\uc38c\ufffd\uc1f1\ufffd\uba84\ufffd\ufffd." +
"\n\n" +
"\ufffd\ufffd\ufffd\uf9de\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd:\n" +
"- \ufffd\ufffd\uacd5\ufffd\ufffd\u745c\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u317b\u3203 \xab, \xbb \u8e30\ufffd\ufffd\ufffd\uc1f1\ufffd\ufffd \ufffd\ufffd\u044a\ufffd\u247a\ufffd\u2478\ufffd\ufffd\ufffd\ufffd\ufffd\n" +
"- \ufffd\ufffd\u044a\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u317b\u3203 " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " \u8e30\ufffd\ufffd\ufffd\uc1f1\ufffd\ufffd \ufffd\ufffd\ufffd\u745c\ub301\ufffd\uba84\ufffd\ufffd\n" +
"- \u6028\ufffd\ufffd\ufffd\ufffd \ufffd\ufffd\ufffd\u745c\ub2ff\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\uc1f0\u3203 \ufffd\ufffd\ufffd \u5a9b\ufffd\ufffd\ufffd\u317c\ufffd\ufffd \u936e\ufffd\u745c\ub2ff\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd \ufffd\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ub4ec\ufffd\ufffd\ufffd\ufffd\ufffd.";
Calendar._TT["ABOUT_TIME"] = "\n\n" +
"\ufffd\ufffd\ufffd\u5a9b\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd:\n" +
"- \uf9cd\ufffd\ufffd\ufffd\uacd7\ufffd\u317b\ufffd\ufffd \ufffd\ufffd\ufffd\u745c\ub300\u3203 \ufffd\ufffd\ufffd\u5a9b\ufffd\ufffd\ufffd\ufffd \uf9dd\ufffd\u5a9b\ufffd\ufffd\ufffd\u2478\ufffd\ufffd\ufffd\ufffd\ufffd\n" +
"- Shift \ufffd\ufffd\u317c\ufffd\ufffd \ufffd\ufffd\u2463\ufffd\ufffd \ufffd\ufffd\ufffd\u745c\ub300\u3203 \u5a9b\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u2478\ufffd\ufffd\ufffd\ufffd\ufffd\n" +
"- \ufffd\ufffd\ufffd\u745c\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd \uf9cd\ufffd\ufffd\ufffd\uacd7\ufffd\u317b\ufffd\ufffd \ufffd\ufffd\ufffd\uf9de\ufffd\ufffd\ufffd\ub300\u3203 \u91ab\ufffd \ufffd\ufffd\ufffd \u936e\ufffd\u745c\ub2ff\ufffd\ufffd \u5a9b\ufffd\ufffd\ufffd\ufffd \u8e42\ufffd\ufffd\ufffd\u2478\ufffd\ufffd\ufffd\ufffd\ufffd.\n";

Calendar._TT["PREV_YEAR"] = "\uf9de\ufffd\ufffd\ufffd\ufffd \ufffd\ufffd\ufffd (\u6e72\uba78\ufffd\ufffd \ufffd\ufffd\ufffd\u745c\ub300\u3203 \uf9cf\u2478\ufffd\ufffd)";
Calendar._TT["PREV_MONTH"] = "\uf9de\ufffd\ufffd\ufffd\ufffd \ufffd\ufffd\ufffd (\u6e72\uba78\ufffd\ufffd \ufffd\ufffd\ufffd\u745c\ub300\u3203 \uf9cf\u2478\ufffd\ufffd)";
Calendar._TT["GO_TODAY"] = "\ufffd\ufffd\u317b\ufffd\ufffd \ufffd\ufffd\ufffd\uf9de\ufffd\u6fe1\ufffd";
Calendar._TT["NEXT_MONTH"] = "\ufffd\ufffd\u317c\ufffd\ufffd \ufffd\ufffd\ufffd (\u6e72\uba78\ufffd\ufffd \ufffd\ufffd\ufffd\u745c\ub300\u3203 \uf9cf\u2478\ufffd\ufffd)";
Calendar._TT["NEXT_YEAR"] = "\ufffd\ufffd\u317c\ufffd\ufffd \ufffd\ufffd\ufffd (\u6e72\uba78\ufffd\ufffd \ufffd\ufffd\ufffd\u745c\ub300\u3203 \uf9cf\u2478\ufffd\ufffd)";
Calendar._TT["SEL_DATE"] = "\ufffd\ufffd\ufffd\uf9de\ufffd\u745c\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\uba84\ufffd\ufffd";
Calendar._TT["DRAG_TO_MOVE"] = "\uf9cd\ufffd\ufffd\ufffd\uacd7\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u6d39\uba83\ufffd\ufffd \ufffd\ufffd\ub300\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\uba84\ufffd\ufffd";
Calendar._TT["PART_TODAY"] = " (\ufffd\ufffd\u317b\ufffd\ufffd)";
Calendar._TT["MON_FIRST"] = "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\uc1f1\ufffd\ufffd \ufffd\ufffd\ufffd \u4e8c\uc1f1\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\uc1f0\ufffd\ufffd";
Calendar._TT["SUN_FIRST"] = "\ufffd\ufffd\uc1f1\ufffd\ufffd\ufffd\ufffd\uc1f1\ufffd\ufffd \ufffd\ufffd\ufffd \u4e8c\uc1f1\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\uc1f0\ufffd\ufffd";
Calendar._TT["CLOSE"] = "\ufffd\ufffd\u30ea\ub9b0";
Calendar._TT["TODAY"] = "\ufffd\ufffd\u317b\ufffd\ufffd";
Calendar._TT["TIME_PART"] = "(Shift-)\ufffd\ufffd\ub300\u2503 \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u6d39\ufffd \ufffd\ufffd\ufffd\ufffd\ufffd\uba84\ufffd\ufffd";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Calendar._TT["DAY_FIRST"] = "Display %s first";

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Calendar._TT["WEEKEND"] = "0,6";

Calendar._TT["CLOSE"] = "Close";
Calendar._TT["TODAY"] = "Today";
Calendar._TT["TIME_PART"] = "(Shift-)Click or drag to change value";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d";
Calendar._TT["TT_DATE_FORMAT"] = "%b/%e [%a]";

Calendar._TT["WK"] = "\u4e8c\ufffd";
