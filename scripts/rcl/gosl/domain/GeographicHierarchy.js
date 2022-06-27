//-----------------------------------------------------------------------------
/**
 * @constructor
 * @class
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function Retailer (aName)
{
   this.name = aName;
}


//-----------------------------------------------------------------------------
/**
 * @constructor
 * @class
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function City (aName)
{
   this.name = aName;
   this.retailers = new Object();
}

City.prototype.addRetailer = function (aRetailer)
{
   this.retailers[aRetailer.name] = aRetailer;
};


//-----------------------------------------------------------------------------
/**
 * @constructor
 * @class
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/

function Region (aName)
{
   this.name = aName;
   this.cities = new Object();
}

Region.prototype.addCity = function (aCity)
{
   this.cities[aCity.name] = aCity;
};


//-----------------------------------------------------------------------------
/**
 * @constructor
 * @class
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/

function Country (aName)
{
   this.name = aName;
   this.regions = new Object();
}

Country.prototype.addRegion = function (aRegion)
{
   this.regions[aRegion.name] = aRegion;
};

//-----------------------------------------------------------------------------
/**
 * @constructor
 * @class
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/

function GeographicHierarchy()
{
   this.countries = new Object();
}

GeographicHierarchy.prototype.addCountry = function (aCountry)
{
   this.countries[aCountry.name] = aCountry;
};

