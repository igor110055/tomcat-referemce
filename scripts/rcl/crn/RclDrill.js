

/**
 * acts as a namespace for otherwise free functions...
 **/
function Rcl()
{
}


/**
 * wrapper for a parameter and its values...
 **/
function RclParam (aName, aCommaSeparatedValues)
{
   this.name = aName;
   this.values = aCommaSeparatedValues.split(", ");
}

RclParam.prototype.toString = function()
{
   return this.name + " = [" + this.values.join(",") + "] (" + this.values.length + ")";
}

Rcl.createSingleValueRclParam = function (aName, aValue)
{
   var p = new Param(aName, "");
   p.values = [aValue];
   return p;
}


/**
 * helper method to create hidden input field with the supplied value
 * on the supplied form...
 **/
Rcl.createFormInput = function (aName, aValue, aForm)
{
   var input = document.createElement("input");
   input.type = "hidden";
   input.name = aName;
   input.value = aValue;

   aForm.appendChild(input);
}


Rcl.launchDrillThrough = function (aTargetXpath, aParamName, aParamValue)
{
   //alert("launching drill through for : \n\n" + aTargetXpath + "\n\n[" + aParamName + "] = [" + aParamValue + "]");

   var aParamNameArray = new Array(1);
   var aParamValueArray = new Array(1);

   aParamNameArray[0] = aParamName;
   aParamValueArray[0] = aParamValue;

   parent.parent.uiController.addDrillTab (aTargetXpath, aParamNameArray, aParamValueArray);
}

Rcl.launchDrillThroughWithMultipleParams = function (aTargetXpath, aParamNameArray, aParamValueArray)
{
   //alert("launching drill through for : \n\n" + aTargetXpath + "\n\n[" + aParamName + "] = [" + aParamValue + "]");

   parent.parent.uiController.addDrillTab (aTargetXpath, aParamNameArray, aParamValueArray);
}
