/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/



//-----------------------------------------------------------------------------
/**
 * I am a simple wrapper for an Html Select Dom element.
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function HtmlSelect (aDomElement)
{
   this.domElement = aDomElement;
}


/**
* @return an array of all options from an HTML select element, regardless
* of whether they are selected or not.
**/
HtmlSelect.prototype.getAllItems = function()
{
   var allItems = [];

   for (var i = 0; i < this.domElement.options.length; ++i)
   {
      allItems.push(this.domElement.options[i]);
   }
   return allItems;
};




/**
* @return an array of the selected options from an HTML select element.  Each
* option contains both value and text
**/
HtmlSelect.prototype.getSelectedItems = function()
{
   var selected = [];

   for (var i = 0; i < this.domElement.options.length; ++i)
   {
      if (this.domElement.options[i].selected)
      {
         selected.push(this.domElement.options[i]);
      }
   }
   return selected;
};

/**
* @return an array of the selected option.value's from an HTML select element.
**/
HtmlSelect.prototype.getSelectedValues = function()
{
   var selected = [];

   for (var i = 0; i < this.domElement.options.length; ++i)
   {
      if (this.domElement.options[i].selected)
      {
         selected.push(this.domElement.options[i].value);
      }
   }
   return selected;
};

/**
* @return an array of the selected option.text  from an HTML select element.
**/
HtmlSelect.prototype.getSelectedDisplayText = function()
{
   var selected = [];

   for (var i = 0; i < this.domElement.options.length; ++i)
   {
      if (this.domElement.options[i].selected)
      {
         selected.push(this.domElement.options[i].text);
      }
   }
   return selected;
};


/**
 * select the named items in the Html select element
 *
 * @param aValuesToSelect - array of values to select
 **/
HtmlSelect.prototype.resetSelectedItems = function(aValuesToSelect)
{
   //alert("values are \n\n[" + aValuesToSelect.join("\n") + "]");

   for (var i = 0; i < this.domElement.options.length; ++i)
   {
      this.domElement.options[i].selected = false;

      for (var j = 0; j < aValuesToSelect.length; ++j)
      {
         if (this.domElement.options[i].value == aValuesToSelect[j])
         {
            this.domElement.options[i].selected = true;
            break;
         }
      }
   }
};

/**
 * select a single item (by value) in the select box...
 *
 * @param aValueToSelect - value of option to select
 **/
HtmlSelect.prototype.selectSingleItem = function(aValueToSelect)
{
   this.resetSelectedItems([aValueToSelect]);
};


HtmlSelect.prototype.addValue = function(aValue, aDisplayValue)
{
   if (JsUtil.isGood(aDisplayValue) == false)
   {
      aDisplayValue = aValue;
   }

   var newOptItem = new Option(aDisplayValue, aValue);

   this.domElement.options[this.domElement.options.length] = newOptItem;
   this.removeDuplicates();
};

HtmlSelect.prototype.addAll = function(aArray, aValuePropertyName, aDisplayValuePropertyName)
{
   for (var i = 0; i < aArray.length; ++i)
   {
      this.addValue((aArray[i])[aValuePropertyName], (aArray[i])[aDisplayValuePropertyName]);
   }
};

HtmlSelect.prototype.removeAll = function()
{
   for (var i = this.domElement.options.length-1; i >= 0; i--)
   {
      this.domElement.remove(i);
   }
};

HtmlSelect.prototype.removeSelectedItems = function()
{
   for (var i = this.domElement.options.length-1; i >= 0; i--)
   {
      if (this.domElement.options[i].selected)
      {
         this.domElement.remove(i);
      }
   }
};

HtmlSelect.prototype.selectAll = function()
{
   this.setAllSelectedTo(true);
};

HtmlSelect.prototype.deselectAll = function()
{
   this.setAllSelectedTo(false);
};

HtmlSelect.prototype.setAllSelectedTo = function(aValue)
{
   for (var i = 0; i < this.domElement.options.length; ++i)
   {
      this.domElement.options[i].selected = aValue;
   }
};

/**
 * this method can transform all selected values into XML - useful if you
 * need to submit both the value and displayText
 **/
HtmlSelect.prototype.toXml = function()
{
   var xml = "<select>";

   var selected = this.getSelectedItems();

   for (var i = 0; i < selected.length; ++i)
   {
      xml += '<option><value>' + JsUtil.escapeXml(selected[i].value) + '</value><text>' +
             JsUtil.escapeXml(selected[i].text)  + '</text></option>';
   }

   xml += "</select>";
   return xml;
};


/**
 * remove any duplicate items from the select box...
 */
HtmlSelect.prototype.removeDuplicates = function()
{
   var set = new Object();


   var eachItem;
   var eachKey;

   var duplicates = [];

   //--- first iterate through all items, adding value+text combination as the key
   //    for our set...
   for (var i = 0; i < this.domElement.options.length; ++i)
   {
      eachItem = this.domElement.options[i];
      eachKey = eachItem.text + "_+_" + eachItem.value;

      if (!(set[eachKey]))
      {
         set[eachKey] = this.domElement.options[i];
      }
      else
      {
         duplicates.push(i);
      }
   }

   //--- now iterate in descending order the duplicate indexes, removing them...
   if (duplicates.length > 0)
   {
      for (var i = duplicates.length-1; i >= 0; --i)
      {
         this.domElement.remove(duplicates[i]);
      }
   }
};

