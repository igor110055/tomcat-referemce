// ** I18N

// Calendar HU language
// Author: ???
// Modifier: KARASZI Istvan, <jscalendar@spam.raszi.hu>
// Encoding: UTF-8
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible.  We strongly believe that
// Unicode is the answer to a real internationalized world.  Also please
// include your contact information in the header, as can be seen above.

// full day names
Calendar._DN = new Array
("Vas\ufffdrnap",
 "H\ufffdtf\ufffd",
 "Kedd",
 "Szerda",
 "Cs\ufffdt\ufffdrt\ufffdk",
 "P\ufffdntek",
 "Szombat",
 "Vas\ufffdrnap");

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
("v",
 "h",
 "k",
 "sze",
 "cs",
 "p",
 "szo",
 "v");

// First day of the week. "0" means display Sunday first, "1" means display
// Monday first, etc.
Calendar._FD = 0;

// full month names
Calendar._MN = new Array
("janu\ufffdr",
 "febru\ufffdr",
 "m\ufffdrcius",
 "\ufffdprilis",
 "m\ufffdjus",
 "j\ufffdnius",
 "j\ufffdlius",
 "augusztus",
 "szeptember",
 "okt\ufffdber",
 "november",
 "december");

// short month names
Calendar._SMN = new Array
("jan",
 "feb",
 "m\ufffdr",
 "\ufffdpr",
 "m\ufffdj",
 "j\ufffdn",
 "j\ufffdl",
 "aug",
 "sze",
 "okt",
 "nov",
 "dec");

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = "A kalend\ufffdriumr\ufffdl";

Calendar._TT["ABOUT"] =
"DHTML d\ufffdtum/id\ufffd kiv\ufffdlaszt\ufffd\n" +
"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
"a legfrissebb verzi\ufffd megtal\ufffdlhat\ufffd: http://www.dynarch.com/projects/calendar/\n" +
"GNU LGPL alatt terjesztve.  L\ufffdsd a http://gnu.org/licenses/lgpl.html oldalt a r\ufffdszletekhez." +
"\n\n" +
"D\ufffdtum v\ufffdlaszt\ufffds:\n" +
"- haszn\ufffdlja a \xab, \xbb gombokat az \ufffdv kiv\ufffdlaszt\ufffds\ufffdhoz\n" +
"- haszn\ufffdlja a " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " gombokat a h\ufffdnap kiv\ufffdlaszt\ufffds\ufffdhoz\n" +
"- tartsa lenyomva az eg\ufffdrgombot a gyors v\ufffdlaszt\ufffdshoz.";
Calendar._TT["ABOUT_TIME"] = "\n\n" +
"Id\ufffd v\ufffdlaszt\ufffds:\n" +
"- kattintva n\ufffdvelheti az id\ufffdt\n" +
"- shift-tel kattintva cs\ufffdkkentheti\n" +
"- lenyomva tartva \ufffds h\ufffdzva gyorsabban kiv\ufffdlaszthatja.";

Calendar._TT["PREV_YEAR"] = "El\ufffdz\ufffd \ufffdv (tartsa nyomva a men\ufffdh\ufffdz)";
Calendar._TT["PREV_MONTH"] = "El\ufffdz\ufffd h\ufffdnap (tartsa nyomva a men\ufffdh\ufffdz)";
Calendar._TT["GO_TODAY"] = "Mai napra ugr\ufffds";
Calendar._TT["NEXT_MONTH"] = "K\ufffdv. h\ufffdnap (tartsa nyomva a men\ufffdh\ufffdz)";
Calendar._TT["NEXT_YEAR"] = "K\ufffdv. \ufffdv (tartsa nyomva a men\ufffdh\ufffdz)";
Calendar._TT["SEL_DATE"] = "V\ufffdlasszon d\ufffdtumot";
Calendar._TT["DRAG_TO_MOVE"] = "H\ufffdzza a mozgat\ufffdshoz";
Calendar._TT["PART_TODAY"] = " (ma)";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Calendar._TT["DAY_FIRST"] = "%s legyen a h\ufffdt els\ufffd napja";

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Calendar._TT["WEEKEND"] = "0,6";

Calendar._TT["CLOSE"] = "Bez\ufffdr";
Calendar._TT["TODAY"] = "Ma";
Calendar._TT["TIME_PART"] = "(Shift-)Klikk vagy h\ufffdz\ufffds az \ufffdrt\ufffdk v\ufffdltoztat\ufffds\ufffdhoz";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d";
Calendar._TT["TT_DATE_FORMAT"] = "%b %e, %a";

Calendar._TT["WK"] = "h\ufffdt";
Calendar._TT["TIME"] = "id\ufffd:";
