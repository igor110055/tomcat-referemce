//-----------------------------------------------------------------------------
/**
 * I store the properties for a single locale for localization...
 *
 * @constructor
 * @author Chad Rainey (crainey@seekfocus.com)
 **/
function ApplicationResources()
{
   this.propertyMap = new Array();
}

ApplicationResources.prototype.addProperty = function(key, value){
   this.propertyMap[key] = value;
}

ApplicationResources.prototype.getProperty = function(key){
   var value = this.propertyMap[key];
   if(value == undefined)
   {
      value = "???"+key+"???";
   }
   return value;
}

/**
 * Function models the Java function getMessage() in the class MessageSource.
 * @param key a key in the property file
 * @param parameters array of strings
 */
ApplicationResources.prototype.getPropertyWithParameters = function(key, parameters){

   if(parameters == undefined || parameters.length == 0)
   {
      return this.getProperty(key);
   }

   var value = this.getProperty(key);

   for(var i = 0; i < parameters.length; i++)
   {
      var strPattern ='\\{'+i+'\\}';
      var regExp = new RegExp(strPattern, "g");
      value = value.replace(regExp,parameters[i]);
   }

   return value;
}