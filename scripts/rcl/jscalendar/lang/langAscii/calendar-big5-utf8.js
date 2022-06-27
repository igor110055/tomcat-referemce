// ** I18N

// Calendar big5-utf8 language
// Author: Gary Fu, <gary@garyfu.idv.tw>
// Encoding: big5
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible.  We strongly believe that
// Unicode is the answer to a real internationalized world.  Also please
// include your contact information in the header, as can be seen above.
	
// full day names
Calendar._DN = new Array
("\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u929d\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u922d\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u929d\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u922d\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd");

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
 "\u929d\ufffd",
 "\u922d\ufffd",
 "\u929d\ufffd",
 "\ufffd\ufffd\ufffd",
 "\u922d\ufffd",
 "\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd");

// First day of the week. "0" means display Sunday first, "1" means display
// Monday first, etc.
Calendar._FD = 0;

// full month names
Calendar._MN = new Array
("\u929d\ufffd\ufffd\ufffd\ufffd",
 "\u922d\ufffd\ufffd\ufffd\ufffd",
 "\u929d\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\u922d\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\u525c\ufffd\ufffd",
 "\u929d\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\u6025\ufffd\ufffd",
 "\u928b\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\u929d\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\u922d\ufffd\ufffd\ufffd\ufffd");

// short month names
Calendar._SMN = new Array
("\u929d\ufffd\ufffd\ufffd\ufffd",
 "\u922d\ufffd\ufffd\ufffd\ufffd",
 "\u929d\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\u922d\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\u525c\ufffd\ufffd",
 "\u929d\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\u6025\ufffd\ufffd",
 "\u928b\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\u929d\ufffd\ufffd\ufffd\ufffd",
 "\ufffd\ufffd\ufffd\u922d\ufffd\ufffd\ufffd\ufffd");

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd";

Calendar._TT["ABOUT"] =
"DHTML Date/Time Selector\n" +
"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
"For latest version visit: http://www.dynarch.com/projects/calendar/\n" +
"Distributed under GNU LGPL.  See http://gnu.org/licenses/lgpl.html for details." +
"\n\n" +
"\ufffd\ufffd\u4ea4\ufffd\ufffd\ufffd\ufffd\u8c62\ufffd\ufffd\ufffd\ufffd\u5bde\ufffd\ufffd:\n" +
"- \u96ff\u8f3b\ufffd\ufffd \xab, \xbb \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u822b\ufffd\u8c62\ufffd\ufffd\u649f\u6e2f\u9062\n" +
"- \u96ff\u8f3b\ufffd\ufffd " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u822b\ufffd\u8c62\ufffd\ufffd\ufffd\ufffd\ufffd\u969e\u7a40n" +
"- \ufffd\ufffd\ufffd\u96ff\ufffd\u929d\ufffd\ufffd\ufffd\uff39\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u81ed\u8a91\ufffd\ufffd\ufffd\u6579\u604d\ufffd\u8a68\ufffd\ufffd";
Calendar._TT["ABOUT_TIME"] = "\n\n" +
"\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u8c62\ufffd\ufffd\ufffd\ufffd\u5bde\ufffd\ufffd:\n" +
"- \u66ba\ufffd\ufffd\ufffd\ufffd\u969e\u98b1\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u5176\u9062\ufffd\ufffd\u81ec\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u55c5\ufffd\u58a6n" +
"- \ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffdShift\ufffd\ufffd\u8404\ufffd\ufffd\u66ba\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\u8200\ufffd\ufffd\u64a0\ufffd\ufffd\ufffd\u55c5\ufffd\u58a6n" +
"- \u66ba\ufffd\ufffd\ufffd\ufffd\u929d\u884c\ufffd\ufffd\ufffd\ufffd\u55b3\ufffd\u81ec\ufffd\ufffd\u6579\u6025\ufffd\u5be1\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd";

Calendar._TT["PREV_YEAR"] = "\u929d\ufffd\u929d\ufffd\u649f\ufffd (\ufffd\ufffd\ufffd\u96ff\ufffd\ufffd\ufffd\u8a68\ufffd\ufffd)";
Calendar._TT["PREV_MONTH"] = "\u929d\ufffd\u929d\ufffd\u649f\ufffd (\ufffd\ufffd\ufffd\u96ff\ufffd\ufffd\ufffd\u8a68\ufffd\ufffd)";
Calendar._TT["GO_TODAY"] = "\ufffd\ufffd\u552c\ufffd\ufffd\ufffd\ufffd\ufffd";
Calendar._TT["NEXT_MONTH"] = "\u929d\ufffd\u929d\ufffd\ufffd\ufffd\ufffd (\ufffd\ufffd\ufffd\u96ff\ufffd\ufffd\ufffd\u8a68\ufffd\ufffd)";
Calendar._TT["NEXT_YEAR"] = "\u929d\ufffd\u929d\ufffd\ufffd\ufffd\ufffd (\ufffd\ufffd\ufffd\u96ff\ufffd\ufffd\ufffd\u8a68\ufffd\ufffd)";
Calendar._TT["SEL_DATE"] = "\ufffd\ufffd\u8c62\ufffd\ufffd\ufffd\ufffd\u4ea4\ufffd\ufffd";
Calendar._TT["DRAG_TO_MOVE"] = "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd";
Calendar._TT["PART_TODAY"] = " (\u969e\ufffd\ufffd\ufffd\ufffd)";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Calendar._TT["DAY_FIRST"] = "\u64a0\ufffd %s \u61bf\u8210\u5167\ufffd\ufffd\u5178\ufffd\ufffd";

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Calendar._TT["WEEKEND"] = "0,6";

Calendar._TT["CLOSE"] = "\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd";
Calendar._TT["TODAY"] = "\u969e\ufffd\ufffd\ufffd\ufffd";
Calendar._TT["TIME_PART"] = "\u66ba\ufffd\ufffd\ufffd\ufffdor\ufffd\ufffd\ufffd\ufffd\ufffd\u55b3\ufffd\u8200\ufffd\u5be1\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd(\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffdShift\ufffd\ufffd\u7bb8\ufffd\ufffd)";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d";
Calendar._TT["TT_DATE_FORMAT"] = "%a, %b %e";

Calendar._TT["WK"] = "\ufffd\ufffd\ufffd";
Calendar._TT["TIME"] = "Time:";
