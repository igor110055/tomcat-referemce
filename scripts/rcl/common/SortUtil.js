
/**
 * This file contains utility classes related to sorting...
 *
 * @author Lance Hankins
 **/



/**
 * The following are a collection of utility methods used when sorting
 *
 **/
function SortUtil()
{
}


/**
 * sort the specified array based on the supplied compareFn in the
 * designated direction (-1 for descending, +1 for ascending).
 *
 **/
SortUtil.sortArray = function (anArray, aCompareFn, aSortDirection)
{
   anArray.sort(function(a,b) {
      return aSortDirection * aCompareFn(a,b);
   });
}

/**
 * sort the specified array based on the supplied compareFn in the
 * designated direction (-1 for descending, +1 for ascending).
 *
 **/
SortUtil.sortArrayViaMethod = function (anArray, aCompareFn, aThisPtr, aSortDirection)
{
   anArray.sort(function(a,b) {
      return aSortDirection * aCompareFn.call(aThisPtr, a,b);
   });
}



SortUtil.compareStringValues = function (a, b)
{
   if (a == undefined)
      return -1;

   if (b == undefined)
      return 1;

   var aLower = a.toLowerCase();
   var bLower = b.toLowerCase();

   if (aLower == bLower)
   {
      return 0;
   }


   var isLessThan = aLower < bLower;

   //alert("a = [" + a + "], b = [" + b + "], compare = [" + isLessThan + "]");
   return (isLessThan ? -1 : 1);
}


SortUtil.createCompareStringValuesForFieldFn = function (aFieldName)
{
   return function (a, b)
   {
      //alert("filedname = [" + aFieldName + "] comparing [" + a[aFieldName] + "] to [" + b[aFieldName] + "]");
      if (a == undefined || a[aFieldName] == undefined)
         return -1;

      if (b == undefined || b[aFieldName] == undefined)
         return 1;



      var isLessThan = a[aFieldName].toLowerCase() < b[aFieldName].toLowerCase();
      return (isLessThan ? -1 : 1);
   }
}


SortUtil.createCompareNumericValuesForFieldFn = function (aFieldName)
{
   return function (a, b)
   {
//      alert("a[aFieldName] : " + a[aFieldName] + "  b[aFieldName] " +  b[aFieldName]);
      if (a == undefined || a[aFieldName] == undefined)
         return -1;

      if (b == undefined || b[aFieldName] == undefined)
         return 1;

      var isLessThan = a[aFieldName] < b[aFieldName];
      return (isLessThan ? -1 : 1);
   }
}




SortUtil.compareNumericValues = function (a, b)
{
   if (a == b)
      return 0;

   if (!(a))
      return -1;

   if (!(b))
      return 1;

   return a - b;
}


SortUtil.compareStringifiedDates = function (a, b)
{
   if (a == undefined || a.length == 0)
      return -1;

   if (b == undefined || b.length == 0)
      return 1;

   return (new Date(a).getTime() - new Date(b).getTime());
}


SortUtil.compareStringifiedFileSizes = function (a, b)
{
   var sizeA = a.substr(0, a.length - 3);
   var sizeB = b.substr(0, b.length - 3);

   sizeA = sizeA.replace(",", "");
   sizeB = sizeB.replace(",", "");

   return sizeA - sizeB;
}

