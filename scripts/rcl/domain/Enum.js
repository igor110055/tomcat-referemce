/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: Enum.js 4533 2007-07-26 19:34:05Z lhankins $



//-----------------------------------------------------------------------------
/**
 * I am the JS equivalent of an Enum
 *
 * @param anIntValue  - the integer value of this enum
 * @param aStringValue - the string value of this enum
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function Enum (anIntValue, aStringValue)
{
   this.value = anIntValue;
   this.name = aStringValue;
}

/**
 * find the enum in the supplied enum class with the designated value
 **/
Enum.parseEnumFromValue = function (anEnumClass, aValue)
{
   var key;
   var eachEnum;

   for (key in anEnumClass)
   {
      eachEnum = anEnumClass[key];

      if (JsUtil.isObject(eachEnum) && eachEnum.value == aValue)
         return eachEnum;
   }

   alert("failed to find enum with value [" + aValue + "] in enum class [" + anEnumClass + "]");
   return null;
};


/**
 * find the enum in the supplied enum class with the designated name
 **/
Enum.parseEnumFromName = function (anEnumClass, aName)
{
   var key;
   var eachEnum;

   for (key in anEnumClass)
   {
      eachEnum = anEnumClass[key];

      if (JsUtil.isObject(eachEnum) && eachEnum.name == aName)
         return eachEnum;
   }

   alert("failed to find enum with name [" + aName + "] in enum class [" + anEnumClass + "]");
   return null;
};

