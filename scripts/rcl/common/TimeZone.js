

/**
 * Representation of a timezon.
 *
 * @constructor
 * @param aId Java id of the time zone (eg, "US/Central")
 * @param aDisplayName display name according to the locale
 * @param aSummerOffset the offset of the time zone in the summer time
 * @param aCurrentOffset the offset of the time zone on the current date
 */
function TimeZone(aId, aDisplayName, aSummerOffset, aWinterOffset, aCurrentOffset)
{
   this.id=aId;
   this.displayName=aDisplayName;
   this.summerOffset=aSummerOffset;
   this.winterOffset=aWinterOffset;
   this.currentOffset=aCurrentOffset;
   this.fuzzy=false;
}

