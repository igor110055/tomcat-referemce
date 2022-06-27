// calendar-cs-win.js
//	language: Czech
//	Encoding: windows-1250
//	author: Lubos Jerabek (xnet@seznam.cz)
//	        Jan Uhlir (espinosa@centrum.cz)
//

// ** I18N
Calendar._DN  = new Array('Ned\u00c4\u203ale','Pond\u00c4\u203al\u0102\u00ad','\u0102\u0161ter\u0102\u02dd','St\u0139\u2122eda','\u00c4\u015atvrtek','P\u0102\u02c7tek','Sobota','Ned\u00c4\u203ale');
Calendar._SDN = new Array('Ne','Po','\u0102\u0161t','St','\u00c4\u015at','P\u0102\u02c7','So','Ne');
Calendar._MN  = new Array('Leden','\u0102\u0161nor','B\u0139\u2122ezen','Duben','Kv\u00c4\u203aten','\u00c4\u015aerven','\u00c4\u015aervenec','Srpen','Z\u0102\u02c7\u0139\u2122\u0102\u00ad','\u0139\ufffd\u0102\u00adjen','Listopad','Prosinec');
Calendar._SMN = new Array('Led','\u0102\u0161no','B\u0139\u2122e','Dub','Kv\u00c4\u203a','\u00c4\u015arv','\u00c4\u015avc','Srp','Z\u0102\u02c7\u0139\u2122','\u0139\ufffd\u0102\u00adj','Lis','Pro');

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = "O komponent\u00c4\u203a kalend\u0102\u02c7\u0139\u2122";
Calendar._TT["TOGGLE"] = "Zm\u00c4\u203ana prvn\u0102\u00adho dne v t\u0102\u02dddnu";
Calendar._TT["PREV_YEAR"] = "P\u0139\u2122edchoz\u0102\u00ad rok (p\u0139\u2122idr\u0139\u013e pro menu)";
Calendar._TT["PREV_MONTH"] = "P\u0139\u2122edchoz\u0102\u00ad m\u00c4\u203as\u0102\u00adc (p\u0139\u2122idr\u0139\u013e pro menu)";
Calendar._TT["GO_TODAY"] = "Dne\u0139\u02c7n\u0102\u00ad datum";
Calendar._TT["NEXT_MONTH"] = "Dal\u0139\u02c7\u0102\u00ad m\u00c4\u203as\u0102\u00adc (p\u0139\u2122idr\u0139\u013e pro menu)";
Calendar._TT["NEXT_YEAR"] = "Dal\u0139\u02c7\u0102\u00ad rok (p\u0139\u2122idr\u0139\u013e pro menu)";
Calendar._TT["SEL_DATE"] = "Vyber datum";
Calendar._TT["DRAG_TO_MOVE"] = "Chy\u0139\u0104 a t\u0102\u02c7hni, pro p\u0139\u2122esun";
Calendar._TT["PART_TODAY"] = " (dnes)";
Calendar._TT["MON_FIRST"] = "Uka\u0139\u013e jako prvn\u0102\u00ad Pond\u00c4\u203al\u0102\u00ad";
//Calendar._TT["SUN_FIRST"] = "Uka\u0139\u013e jako prvn\u0102\u00ad Ned\u00c4\u203ali";

Calendar._TT["ABOUT"] =
"DHTML Date/Time Selector\n" +
"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
"For latest version visit: http://www.dynarch.com/projects/calendar/\n" +
"Distributed under GNU LGPL.  See http://gnu.org/licenses/lgpl.html for details." +
"\n\n" +
"V\u0102\u02ddb\u00c4\u203ar datumu:\n" +
"- Use the \xab, \xbb buttons to select year\n" +
"- Pou\u0139\u013eijte tla\u00c4\u0164\u0102\u00adtka " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " k v\u0102\u02ddb\u00c4\u203aru m\u00c4\u203as\u0102\u00adce\n" +
"- Podr\u0139\u013ete tla\u00c4\u0164\u0102\u00adtko my\u0139\u02c7i na jak\u0102\u00a9mkoliv z t\u00c4\u203ach tla\u00c4\u0164\u0102\u00adtek pro rychlej\u0139\u02c7\u0102\u00ad v\u0102\u02ddb\u00c4\u203ar.";

Calendar._TT["ABOUT_TIME"] = "\n\n" +
"V\u0102\u02ddb\u00c4\u203ar \u00c4\u0164asu:\n" +
"- Klikn\u00c4\u203ate na jakoukoliv z \u00c4\u0164\u0102\u02c7st\u0102\u00ad v\u0102\u02ddb\u00c4\u203aru \u00c4\u0164asu pro zv\u0102\u02dd\u0139\u02c7en\u0102\u00ad.\n" +
"- nebo Shift-click pro sn\u0102\u00ad\u0139\u013een\u0102\u00ad\n" +
"- nebo klikn\u00c4\u203ate a t\u0102\u02c7hn\u00c4\u203ate pro rychlej\u0139\u02c7\u0102\u00ad v\u0102\u02ddb\u00c4\u203ar.";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Calendar._TT["DAY_FIRST"] = "Zobraz %s prvn\u0102\u00ad";

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Calendar._TT["WEEKEND"] = "0,6";

Calendar._TT["CLOSE"] = "Zav\u0139\u2122\u0102\u00adt";
Calendar._TT["TODAY"] = "Dnes";
Calendar._TT["TIME_PART"] = "(Shift-)Klikni nebo t\u0102\u02c7hni pro zm\u00c4\u203anu hodnoty";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "d.m.yy";
Calendar._TT["TT_DATE_FORMAT"] = "%a, %b %e";

Calendar._TT["WK"] = "wk";
Calendar._TT["TIME"] = "\u00c4\u015aas:";
