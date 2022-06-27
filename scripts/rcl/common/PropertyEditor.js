/**
 * @fileoverview
 * This file defines a classes which enable the implementation of a simple
 * property editor
 *
 * @author Lance Hankins
 *
 **/

//-----------------------------------------------------------------------------
/**
 * LabelValuePair
 * @constructor
 */
function LabelValuePair (aLabel, aValue)
{
   this.label = aLabel;
   this.value = aValue;
}

LabelValuePair.prototype.toString = function()
{
   return "   label = [" + this.label + "], value = [" + this.value + "]\n";
};





//-----------------------------------------------------------------------------
/**
 * ConstantValueProvider
 * @constructor
 */
function ConstantValueProvider (aValues)
{
   this.allowedValues = aValues;
   this.propertyType = null;
}

ConstantValueProvider.prototype.getAllowedValues = function()
{
   return this.allowedValues;
};

ConstantValueProvider.prototype.getValueForLabel = function (aLabel)
{
   for (var i = 0; i < this.allowedValues.length; ++i)
   {
      if (this.allowedValues[i].label == aLabel)
         return this.allowedValues[i].value;
   }

   alert("warning - failed to find value for label [" + aLabel + "], \n\n allowed items where [" + this.allowedValues + "]");
};

ConstantValueProvider.prototype.isValueConstrained = function()
{
   return (this.allowedValues) ? true : false;
};


//-----------------------------------------------------------------------------
/**
 * FreeTextValueProvider
 * @constructor
 */
function FreeTextValueProvider ()
{
   this.propertyType = null;
}

FreeTextValueProvider.prototype.getAllowedValues = function()
{
};

FreeTextValueProvider.prototype.getValueForLabel = function (aLabel)
{
   return aLabel;
};

FreeTextValueProvider.prototype.isValueConstrained = function()
{
   return false;
};


//-----------------------------------------------------------------------------
/**
 * PropertyType
 * @constructor
 */
function PropertyType (aName, aValueProvider)
{
   this.name = aName;
   this.valueProvider = aValueProvider;

   aValueProvider.propertyType = this;
}

PropertyType.prototype.toString = function()
{
   return this.name;
};

PropertyType.prototype.createProperty = function (aName, aValue)
{
   var p = new Property(aName, aValue, this);
};

PropertyType.prototype.getValueForLabel = function (aLabel)
{
   return this.valueProvider.getValueForLabel(aLabel);
};

PropertyType.prototype.getAllowedValues = function()
{
   return this.valueProvider.getAllowedValues();
};

PropertyType.prototype.isValueConstrained = function()
{
   return this.valueProvider.isValueConstrained();
};

///////////////////////////////////////////////////////////////////////////////
// A few "Property Types" used by the property editor on this page
///////////////////////////////////////////////////////////////////////////////
function createPropertyTypeFromEnum (aPropertyTypeName, anEnum, aDisplayValue)
{
   var key;
   var value;

   var labelValuePairs = [];

   for (key in anEnum)
   {
      value = anEnum[key];

      if (value.name && value[aDisplayValue])
      {
         labelValuePairs.push(new LabelValuePair(value[aDisplayValue], value.name));
      }
   }

   return new PropertyType(aPropertyTypeName, new ConstantValueProvider(labelValuePairs));
}




function PropertyTypes()
{
}

PropertyTypes.string = new PropertyType("string", new FreeTextValueProvider());
PropertyTypes.p_boolean = new PropertyType("boolean", new ConstantValueProvider([new LabelValuePair('true', true), new LabelValuePair('false', false)]));
PropertyTypes.insertRelation = new PropertyType("relation", new ConstantValueProvider(
        [
           new LabelValuePair('Crosstab After', RelationalInsertionPointEnum.CROSSTAB_ADD_TO_CHILDREN.name),
           new LabelValuePair('Crosstab Before', RelationalInsertionPointEnum.CROSSTAB_PARENT.name),
           new LabelValuePair(applicationResources.getProperty("profileWizard.content.location.before"), RelationalInsertionPointEnum.BEFORE.name),
           new LabelValuePair(applicationResources.getProperty("profileWizard.content.location.after"), RelationalInsertionPointEnum.AFTER.name)
        ]));

//PropertyTypes.insertRelation = createPropertyTypeFromEnum("RelationalInsertionPointEnum", RelationalInsertionPointEnum, "name"); //new PropertyType("relation", new ConstantValueProvider([new LabelValuePair(applicationResources.getProperty("profileWizard.content.location.before"), RelationalInsertionPointEnum.BEFORE.name), new LabelValuePair(applicationResources.getProperty("profileWizard.content.location.after"), RelationalInsertionPointEnum.AFTER.name)]));
PropertyTypes.regularAggregateEnum = createPropertyTypeFromEnum("RegularAggregateEnum", RegularAggregateEnum, "reportSpecValue");
PropertyTypes.sortEnum = createPropertyTypeFromEnum("SortEnum", SortEnum, "crnValue");
PropertyTypes.aggregateFunctionEnum = createPropertyTypeFromEnum("AggregateFunctionEnum", AggregateFunctionEnum, "crnValue");

PropertyTypes.color = new PropertyType("color", new ConstantValueProvider([
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.transparent"), "transparent"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.black"), "black"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.silver"), "silver"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.gray"), "gray"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.white"), "white"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.maroon"), "maroon"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.red"), "red"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.purple"), "purple"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.fuchsia"), "fuchsia"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.green"), "green"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.lime"), "lime"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.olive"), "olive"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.yellow"), "yellow"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.navy"), "navy"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.blue"), "blue"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.teal"), "teal"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.colors.aqua"), "aqua")
]));

PropertyTypes.horizontalAlignment = new PropertyType("horizontalAlignment", new ConstantValueProvider([
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.alignment.left"), "left"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.alignment.center"), "center"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.alignment.right"), "right"),
        new LabelValuePair(applicationResources.getProperty("profileWizard.content.alignment.justify"), "justify")
]));


//-----------------------------------------------------------------------------
/**
 * Property
 * @constructor
 */
function Property (aName, aValue, aType, aReadOnly, aNameAddendum)
{
   this.name = aName;
   this.value = aValue;
   this.type = aType;

   this.id = "prop" + Property.nextId++;


   this.isReadOnly = (arguments.length >= 4 ? aReadOnly : false);
   this.nameAddendum = (arguments.length >= 5 ? aNameAddendum : "");

   this.propertySet = null;

   this.dom = new Object();

   this.dom.tr = null;
   this.dom.nameTd = null;
   this.dom.valueTd = null;
}


Property.prototype.toString = function()
{
   return " name = [" + this.name + "], value = [" + this.value + "], type = [" + this.type + "]";
};

Property.nextId = 0;

Property.prototype.getRowId = function()
{
   return "tr_" + this.id;
};

Property.prototype.getInputId = function()
{
   return "input_" + this.id;
};


Property.prototype.getInputHtml = function()
{
   var readOnlyMod = '';
   if (this.isReadOnly == true)
   {
      readOnlyMod = ' disabled="true" ';
   }

   var onFocusAndBlur = ' onfocus="parentNode.parentNode.jsProperty.focus();" onblur="parentNode.parentNode.jsProperty.blur();" ';

   if (this.type.isValueConstrained())
   {
      var html = '<select id="' + this.getInputId() + '" size="1"' + readOnlyMod + '>';

      var selectedOption = '';
      var allowedValues = this.type.getAllowedValues();
      for (var i = 0; i < allowedValues.length; ++i)
      {
         if (allowedValues[i].value == this.value)
         {
            selectedOption = ' selected="selected" ';
         }
         else
         {
            selectedOption = '';
         }

         html += '<option value="' + allowedValues[i].value + '"' + selectedOption + '>' + allowedValues[i].label + '</option>';
      }

      html += '</select>';
      return html;
   }
   else
   {
      return '<input size="30" id="' + this.getInputId() + '"' + readOnlyMod + onFocusAndBlur + 'type="text" value="' + this.value + '">';
   }
};




Property.prototype.getNameLabelClass = function()
{
   return this.isReadOnly ? 'readOnlyPropertyName' : 'propertyName';
};

Property.prototype.toHtml = function()
{
   var pvClass = this.isReadOnly ? "readOnlyPropertyValue" : "propertyValue";

   if (this.type.isValueConstrained())
   {
      pvClass = "propertyValueSelect";
   }

   var onClickHandler = this.type.isValueConstrained() ? ' onclick="this.jsProperty.focus();"' : ' onfocus="this.jsProperty.focus();"';

   return  '<tr id="' + this.getRowId() + '"' + onClickHandler + '>' +
           '    <td class="' + this.getNameLabelClass() + '">&nbsp;' + this.name + this.nameAddendum + '</td>' +
           '    <td class="' + pvClass + '">' + this.getInputHtml() + '</td>' +
           '</tr>';
};

Property.prototype.postInsert = function()
{
   // TODO : replace this with Event.observe
   this.dom.tr = document.getElementById(this.getRowId());
   this.dom.tr.jsProperty = this;

   var tds = this.dom.tr.getElementsByTagName("td");

   this.dom.nameTd = tds[0];
   this.dom.valueTd = tds[1];

};

/**
 * @private - called to disconnect any dom references when the document is unloaded...
 **/
Property.prototype._onUnLoad = function()
{
   this.dom.tr.jsProperty = null;
   this.dom.tr = null;

   this.dom.nameTd = null;
   this.dom.valueTd = null;

};



Property.prototype.getValueInputElement = function()
{
   return document.getElementById(this.getInputId());
};

Property.prototype.focus = function()
{
   if (this.propertySet.currentProperty)
      this.propertySet.currentProperty.blur();

   this.propertySet.currentProperty = this;


   if (this.isReadOnly == false && !(this.isValueConstrained()))
   {
      this.dom.nameTd.className = 'focusedProperty';
      this.getValueInputElement().select();
   }

};

Property.prototype.blur = function()
{
   this.value = this.getValueInputElement().value;
   this.dom.nameTd.className = this.getNameLabelClass();
};

Property.prototype.isValueConstrained = function()
{
   return JsUtil.isGood(this.type.isValueConstrained());
};







//-----------------------------------------------------------------------------
/**
 * PropertySet
 * @constructor
 */
function PropertySet ()
{
   this.properties = new Array();
   this.currentProperty = null;
}

PropertySet.prototype.addProperty = function (aProperty)
{
   this.properties.push(aProperty);
   aProperty.propertySet = this;
};

PropertySet.prototype.getProperty = function (aPropertyName)
{
   for(var i = 0; i < this.properties.length; ++i)
   {
      if (this.properties[i].name == aPropertyName)
      {
         return this.properties[i];
      }
   }
   return null;
};

PropertySet.prototype.markAllReadOnly = function ()
{
   this.changeAllReadOnlyFlags(true);
};

PropertySet.prototype.markAllWriteable = function ()
{
   this.changeAllReadOnlyFlags(false);
};

PropertySet.prototype.changeAllReadOnlyFlags = function (aValue)
{
   for(var i = 0; i < this.properties.length; ++i)
   {
      this.properties[i].isReadOnly = aValue;
   }
};

PropertySet.prototype.blur = function ()
{
   if (this.currentProperty)
   {
      this.currentProperty.blur();
   }
};





//-----------------------------------------------------------------------------
/**
 * PropertySetEditor
 * @constructor
 */

function PropertySetEditor (aInsertionPoint, aDomId, aTitle, aCurrentPropertySet)
{
   this.insertionPoint = aInsertionPoint;
   this.domId = aDomId;
   this.propertySet = aCurrentPropertySet;
   this.title = aTitle;

   PropertySetEditor.instances.push(this);
}


PropertySetEditor.prototype.blur = function()
{
   this.propertySet.blur();
};


PropertySetEditor.prototype.refreshView = function()
{
   this.insertIntoDocument();
};

PropertySetEditor.prototype.insertIntoDocument = function()
{
   var containerDiv = document.getElementById(this.insertionPoint);
   var html = '';

   html +=
      '<div class="psEditor" id="' + this.domId + '">' +
      '   <div class="psEditorHeader">&nbsp;' + this.title + '</div>' +
      '   <div class="psEditorBody">' +
      '      <table border="0" cellspacing="0" cellpadding="0" width="100%">';


   for (var i = 0; i < this.propertySet.properties.length; ++i)
   {
      html += this.propertySet.properties[i].toHtml();
   }

   html +=
      '      </table>' +
      '   </div>' +
      '</div>';

   containerDiv.innerHTML = html;

   for (var i = 0; i < this.propertySet.properties.length; ++i)
   {
      html += this.propertySet.properties[i].postInsert();
   }
};


/**
 * @private - remove all references between this JS object and any Dom Elements
 **/
PropertySetEditor.prototype._onUnLoad = function()
{
   for (var i = 0; i < this.propertySet.properties.length; ++i)
   {
      this.propertySet.properties[i]._onUnLoad();
   }

};



///////////////////////////////////////////////////////////////////////////////
// Static
///////////////////////////////////////////////////////////////////////////////
PropertySetEditor.instances = [];

PropertySetEditor.onDocumentUnload = function()
{
   for (var i = 0; i < PropertySetEditor.instances.length; ++i)
   {
      PropertySetEditor.instances[i]._onUnLoad ();
   }
};

//--- make sure all property editor's are properly shutdown during document unload
DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
   PropertySetEditor.onDocumentUnload();
});
