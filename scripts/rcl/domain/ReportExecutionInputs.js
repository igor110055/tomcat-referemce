/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/


// $Id: ReportExecutionInputs.js 9235 2015-06-30 16:48:00Z lhankins $


//-----------------------------------------------------------------------------
/**
 * I am the JS version of a DataSourceQualifier object
 *
 * @constructor
 * @author David Paul (dpaul@inmotio.com)
 */
function DataSourceQualifier (aSearchPath)
{
   this.searchPath = aSearchPath;
}

DataSourceQualifier.prototype.getDataSourceSearchPath = function()
{
      if (this.searchPath.indexOf("/dataSource") == -1)
      {
         return null;
      }
      else
      {
         var index = this.searchPath.indexOf("/dataSourceConnection");
         return (index == -1) ? this.searchPath : this.searchPath.substring(0, index);
      }
};

DataSourceQualifier.prototype.getConnectionSearchPath = function()
{
      if (this.searchPath.indexOf("/dataSourceConnection") == -1)
      {
         return null;
      }
      else
      {
         var index = this.searchPath.indexOf("/dataSourceSignon");
         return (index == -1) ? searchPath : searchPath.substring(0, index);
      }
};

DataSourceQualifier.prototype.getSignonSearchPath = function()
{
      if (this.searchPath.indexOf("/dataSourceSignon") == -1)
         return null;
      return this.searchPath;
};

DataSourceQualifier.prototype.toXml = function()
{
   return '<dataSourceQualifier searchPath="' + JsUtil.escapeQuotations(this.searchPath) + '" />';
};

//-----------------------------------------------------------------------------
/**
 * I am the JS version of a DataSourceSet object...
 *
 * @constructor
 * @author David Paul (dpaul@inmotio.com)
 **/
function DataSourceSet()
{
   this.dataSourceQualifiers = new Array();
}

DataSourceSet.prototype.addDataSourceQualifier = function(aDataSourceQualifier)
{
   this.dataSourceQualifiers.push(aDataSourceQualifier);
};

DataSourceSet.prototype.getDataSourceQualifiers = function()
{
   return this.dataSourceQualifiers;
};

DataSourceSet.prototype.clear = function()
{
   this.dataSourceQualifiers = new Array();
};


DataSourceSet.prototype.toXml = function()
{
   var xml = '<dataSourceSet>';

   for (var i=0; i < this.dataSourceQualifiers.length; i++)
   {
      xml += this.dataSourceQualifiers[i].toXml();
   }

   xml += '</dataSourceSet>';
   return xml;
};

//-----------------------------------------------------------------------------
/**
 * I am the JS version of a ConcreteReportParameterValue object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ConcreteReportParameterValue (aDisplayText, aValue)
{
   this.displayText = aDisplayText;
   this.value = aValue;
}

ConcreteReportParameterValue.prototype.isConcrete = function()
{
   return true;
};

ConcreteReportParameterValue.prototype.isFuzzy = function()
{
   return false;
};

ConcreteReportParameterValue.prototype.getValue = function()
{
   return this.value;
};

ConcreteReportParameterValue.prototype.getDisplayValue = function()
{
   return this.displayText;
};

ConcreteReportParameterValue.prototype.toXml = function()
{
   return '<paramValue>' +
          (JsUtil.isGood(this.displayText) ? '<display>' + JsUtil.escapeXml(this.displayText) + '</display>' : '') +
          '<value>' + JsUtil.escapeXml(this.value) + '</value>' +
          '</paramValue>';

};


//-----------------------------------------------------------------------------
/**
 * I am the JS version of a FuzzyReportParameterValue object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FuzzyReportParameterValue (aFuzzyValue, aDerivedDisplayText, aDerivedValue, aAuxiliaryValue)
{
   this.fuzzyValue = aFuzzyValue;
   this.derivedDisplayText = aDerivedDisplayText;
   this.derivedValue = aDerivedValue;
   this.auxiliaryValue = aAuxiliaryValue;
}


FuzzyReportParameterValue.prototype.isConcrete = function()
{
   return false;
};

FuzzyReportParameterValue.prototype.isFuzzy = function()
{
   return true;
};


FuzzyReportParameterValue.prototype.getValue = function()
{
   return this.fuzzyValue;
};

FuzzyReportParameterValue.prototype.getDisplayValue = function()
{
   return this.fuzzyValue;
};

FuzzyReportParameterValue.prototype.getAuxiliaryValue = function()
{
   return this.auxiliaryValue;
};



FuzzyReportParameterValue.prototype.toXml = function()
{
   var xml = '<fuzzyParamValue><fuzzyValue>' +
             JsUtil.escapeXml(this.fuzzyValue) +
             '</fuzzyValue>';

   if (JsUtil.isGood(this.derivedValue))
   {
      xml += "<derivedValue>" + JsUtil.escapeXml(this.derivedValue) + "</derivedValue>";
   }

   if (JsUtil.isGood(this.derivedDisplayText))
   {
      xml += "<derivedDisplayText>" + JsUtil.escapeXml(this.derivedDisplayText) + "</derivedDisplayText>";
   }

   if (JsUtil.isGood(this.auxiliaryValue))
   {
      xml += "<auxiliaryValue>" + JsUtil.escapeXml(this.auxiliaryValue) + "</auxiliaryValue>";
   }

   xml += '</fuzzyParamValue>';

   return xml;
};

/**
 * I am the JS version of a BoundedReportParameterValue object...
 *
 * @constructor
 * @author Jonathan James (jjames@motio.com)
 **/
function BoundedReportParameterValue(aStartValue, aEndValue)
{
   this.startValue = aStartValue;
   this.endValue = aEndValue;
}

BoundedReportParameterValue.prototype.isConcrete = function()
{
   return true;
};

BoundedReportParameterValue.prototype.isFuzzy = function()
{
   return false;
};

BoundedReportParameterValue.prototype.getValue = function()
{
   return this.toXml();
};

BoundedReportParameterValue.prototype.getDisplayValue = function()
{
   return "Between " + this.startValue.getDisplayValue() + " and " + this.endValue.getDisplayValue();
};

BoundedReportParameterValue.prototype.toXml = function()
{
   return '<boundedParamValue><startRangeParamValue>' + this.startValue.toXml() + '</startRangeParamValue><endRangeParamValue>' +
         this.endValue.toXml() + '</endRangeParamValue></boundedParamValue>';
};

/**
 * I am the JS version of an UnboundedStartRangeParameterValue object...
 *
 * @constructor
 * @author Jonathan James (jjames@motio.com)
 **/
function UnboundedStartRangeParameterValue(aEndValue)
{
   this.endValue = aEndValue;
}

UnboundedStartRangeParameterValue.prototype.isConcrete = function()
{
   return true;
};

UnboundedStartRangeParameterValue.prototype.isFuzzy = function()
{
   return false;
};

UnboundedStartRangeParameterValue.prototype.getValue = function()
{
   return this.toXml();
};

UnboundedStartRangeParameterValue.prototype.getDisplayValue = function()
{
   return "Before " + this.endValue.getDisplayValue();
};

UnboundedStartRangeParameterValue.prototype.toXml = function()
{
   return '<unboundedStartRangeParamValue><endRangeParamValue>' +
         this.endValue.toXml() + '</endRangeParamValue></unboundedStartRangeParamValue>';
};

/**
 * I am the JS version of an UnboundedEndRangeParameterValue object...
 *
 * @constructor
 * @author Jonathan James (jjames@motio.com)
 **/
function UnboundedEndRangeParameterValue(aStartValue)
{
   this.startValue = aStartValue;
}

UnboundedEndRangeParameterValue.prototype.isConcrete = function()
{
   return true;
};

UnboundedEndRangeParameterValue.prototype.isFuzzy = function()
{
   return false;
};

UnboundedEndRangeParameterValue.prototype.getValue = function()
{
   return this.toXml();
};

UnboundedEndRangeParameterValue.prototype.getDisplayValue = function()
{
   return "After " + this.startValue.getDisplayValue();
};

UnboundedEndRangeParameterValue.prototype.toXml = function()
{
   return '<unboundedEndRangeParamValue><startRangeParamValue>' +
         this.startValue.toXml() + '</startRangeParamValue></unboundedEndRangeParamValue>';
};


//-----------------------------------------------------------------------------
/**
 * I am the JS version of a ReportParameter object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ReportParameter(aName, aValues, aType)
{
   this.name = aName;
   this.values = aValues;
   this.type = aType;
};

/**
 * returns the raw value for each contained ConcreteReportParameterValue or
 * FuzzyReportParameterValue (not the objects themselves though)
 **/
ReportParameter.prototype.getRawValues = function()
{
   var rawValues = [];
   for (var i = 0; i < this.values.length; ++i)
   {
      rawValues.push(this.values[i].getValue());
   }
   return rawValues;
};

/**
 * add an IReportParameterValue
 **/
ReportParameter.prototype.addValue = function(aParamValue)
{
   this.values.push(aParamValue);
}

ReportParameter.prototype.clearValues = function()
{
   this.values = [];
}

ReportParameter.prototype.replaceValues = function(sourceParameter)
{
   this.clearValues();
   for (var i = 0; i < sourceParameter.values.length; ++i)
   {
      this.addValue( sourceParameter.values[i] );
   }
}

ReportParameter.prototype.removeValues = function(sourceParameter)
{
   if( JsUtil.isGood(sourceParameter) && sourceParameter.values.length > 0 )
   {
      for (var i = 0; i < sourceParameter.values.length; ++i)
      {
         this.removeValue( sourceParameter.values[i] );
      }
   }
}

ReportParameter.prototype.removeValue = function(aParamValue)
{
   for (var i = 0; i < this.values.length; ++i)
   {
      if( this.values[i].getValue() == aParamValue.getValue() )
      {
         this.values.splice(i,1);
         return;
      }
   }
}

ReportParameter.prototype.convertToSingleCommaSeparatedValue = function()
{
   if( this.values.length > 1 )
   {
      var commaSeparatedValuesList = "";
      var commaSeparatedDisplayTextList = "";
      for (var i = 0; i < this.values.length; ++i)
      {
         if( commaSeparatedValuesList.length > 0 )
         {
            commaSeparatedValuesList += ",";
         }
         commaSeparatedValuesList += this.values[i].getValue();
         if( commaSeparatedDisplayTextList.length > 0 )
         {
            commaSeparatedDisplayTextList += ",";
         }
         commaSeparatedDisplayTextList += this.values[i].getDisplayValue();
      }
      this.clearValues();
      this.values.push( new ConcreteReportParameterValue(commaSeparatedDisplayTextList, commaSeparatedValuesList));
   }
}

ReportParameter.prototype.convertFromSingleCommaSeparatedValue = function()
{
   if( this.values.length > 0 )
   {
      var commaSeparatedValuesList = this.values[0].getValue();
      var commaSeparatedDisplayTextList = this.values[0].getDisplayValue();
      this.clearValues();
      var splitValues = commaSeparatedValuesList.split( "," );
      var splitDisplayValues = commaSeparatedDisplayTextList.split( "," );
      for (var i = 0; i < splitValues.length; ++i)
      {
         this.values.push( new ConcreteReportParameterValue(splitDisplayValues[i], splitValues[i]));
      }
   }
}

ReportParameter.prototype.toXml = function()
{
   var xml = '<param name="' + this.name + '" type="' + this.type + '">';

   for (var i = 0; i < this.values.length; ++i)
   {
      xml += this.values[i].toXml();
   }

   xml += '</param>';

   return xml;
};




/**
 * conveneince method for easily creating a single concrete value report aprameter.
 **/
ReportParameter.createSingleConcreteParameter = function (aName, aDisplayValue, aValue)
{
   return new ReportParameter(aName, [new ConcreteReportParameterValue(aDisplayValue, aValue)], 'GenericString');
};

/**
 * conveneince method for easily creating a single fuzzy value report aprameter.
 **/
ReportParameter.createSingleFuzzyParameter = function (aParamName, aFuzzyValue, aAuxiliaryValue, aDerivedDisplayText)
{
   return new ReportParameter(aParamName, [new FuzzyReportParameterValue(aFuzzyValue, aDerivedDisplayText, null, aAuxiliaryValue)], 'GenericString');
};

/**
 * creates a report param and initializes the values from an HTML Select Element
 **/
ReportParameter.createFromSelectElement = function (aName, aSelectDomNode, aSelectAll)
{
   return ReportParameter.createFromHtmlSelectObject(aName, new HtmlSelect(aSelectDomNode), aSelectAll);
};


/**
 * creates a report param and initializes the values from an HtmlSelectObject
 **/
ReportParameter.createFromHtmlSelectObject = function (aName, aHtmlSelect, aSelectAll)
{
   if (aSelectAll)
   {
      aHtmlSelect.selectAll();
   }

   var selectItems = aHtmlSelect.getSelectedItems();

   var paramValues = new Array();
   for (var i = 0; i < selectItems.length; ++i)
   {
      paramValues.push(new ConcreteReportParameterValue(selectItems[i].text, selectItems[i].value));
   }

   return new ReportParameter(aName, paramValues, 'GenericString');
};


/**
 * creates a report param and initializes the values an Array of objects (using the specified
 * property names to pull the display text property and value property)
 *
 * @param aParamName - the name of the new parameter
 * @param anArray - the array of values
 * @param aDisplayTextProperty - the name of the property to use for the display text (for each
 * item in the supplied anArray argument)
 * @param aValue - the name of the property to use for the value (for each item in the supplied
 * anArray argument)
 **/
ReportParameter.createFromArray = function (aParamName, anArray, aDisplayTextProperty, aValueProperty )
{
   var paramValues = [];
   for (var i = 0; i < anArray.length; ++i)
   {
      paramValues.push(new ConcreteReportParameterValue((anArray[i])[aDisplayTextProperty], (anArray[i])[aValueProperty]));
   }

   return new ReportParameter(aParamName, paramValues, 'GenericString');
};


//-----------------------------------------------------------------------------
/**
 * I am the JS version of a ReportParameterSet object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ReportParameterSet()
{
   this.params = new Object();
}

ReportParameterSet.prototype.addParameter = function(aParam)
{
   this.params[aParam.name] = aParam;
};

ReportParameterSet.prototype.getParameter = function(aParam)
{
   return this.params[aParam];
};

/**
 * removes all parameters from this paramset... (resets it).
 **/
ReportParameterSet.prototype.clear = function()
{
   this.params = new Object();
};


ReportParameterSet.prototype.toXml = function()
{
   var xml = '<reportParameterSet>';

   var key;

   for (key in this.params)
   {
      xml += this.params[key].toXml();
   }

   xml += '</reportParameterSet>';
   return xml;
};



//-----------------------------------------------------------------------------
/**
 * Abstract superclass for delivery prefs...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function AbstractDeliveryPreference (aType, aIsEnabled, aDestId)
{
   this.type = aType;
   this.isEnabled = aIsEnabled;
   this.destinationId = aDestId;
   this.outputReferences = new Array();
}

AbstractDeliveryPreference.prototype.getAbstractAttributes = function()
{
   return 'enabled="' + this.isEnabled + '" destinationId="' + this.destinationId + '" ';
};


AbstractDeliveryPreference.prototype.addOutputReference = function(anOutputFormat)
{
   this.outputReferences.push(anOutputFormat);
};

AbstractDeliveryPreference.prototype.isOutputReferenceEnabled = function(anOutputFormat)
{
   for (var i = 0; i < this.outputReferences.length; ++i)
   {
      if (this.outputReferences[i] == anOutputFormat)
      {
         return true;
      }
   }

   return false;
};


AbstractDeliveryPreference.prototype.getAbstractChildElements = function()
{
   var xml = '';
   for (var i = 0; i < this.outputReferences.length; ++i)
   {
      xml += '<includeFormat type="' + this.outputReferences[i].name + '"/>';
   }
   return xml;
}



//-----------------------------------------------------------------------------
/**
 * I am the JS version of an EmailDeliveryPreference object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function EmailDeliveryPreference (aIsEnabled, aDestinationId)
{
   if (arguments.length > 0)
   {
      EmailDeliveryPreference.superclass.constructor.call(this, DeliveryTypeEnum.EMAIL, aIsEnabled, aDestinationId);

      this.toList = new Array();
      this.ccList = new Array();
      this.bccList = new Array();
      this.subject = new Object();
      this.body = new Object();
      this.zip = new Object();
      this.maxAttachmentSize = 0;

      /*this.subject.value = "";
      this.body.value = "";*/
   }
}

//--- inheritence chain...
EmailDeliveryPreference.prototype = new AbstractDeliveryPreference();
EmailDeliveryPreference.prototype.constructor = EmailDeliveryPreference;
EmailDeliveryPreference.superclass = AbstractDeliveryPreference.prototype;




EmailDeliveryPreference.prototype.toXml = function()
{
   var xml = '<emailPref ' + this.getAbstractAttributes() + '>';

   for (var i = 0; i < this.toList.length; ++i)
   {
      xml += '<to at="' + this.toList[i] + '"/>';
   }

   for (var i = 0; i < this.ccList.length; ++i)
   {
      xml += '<cc at="' + this.ccList[i] + '"/>';
   }

   for (var i = 0; i < this.bccList.length; ++i)
   {
      xml += '<bcc at="' + this.bccList[i] + '"/>';
   }

   xml += '<subject value="' + JsUtil.escapeXml(this.subject) + '"/>';
   xml += '<body>' + JsUtil.escapeXml(this.body) + '</body>';
   xml += '<maxAttachmentSize value="' + JsUtil.escapeXml(this.maxAttachmentSize) + '"/>';

   xml += '<zip value="' + this.zip + '"/>';

   xml += this.getAbstractChildElements();

   xml += '</emailPref>';
   return xml;
};


//-----------------------------------------------------------------------------
/**
 * I am the JS version of an PrintDeliveryPreference object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function PrintDeliveryPreference (aIsEnabled, aDestinationId)
{
   if (arguments.length > 0)
   {
      PrintDeliveryPreference.superclass.constructor.call(this, DeliveryTypeEnum.PRINT, aIsEnabled, aDestinationId);
   }
}

//--- inheritence chain...
PrintDeliveryPreference.prototype = new AbstractDeliveryPreference();
PrintDeliveryPreference.prototype.constructor = PrintDeliveryPreference;
PrintDeliveryPreference.superclass = AbstractDeliveryPreference.prototype;


PrintDeliveryPreference.prototype.toXml = function()
{
   return '<printPref ' + this.getAbstractAttributes() + '>' +
            this.getAbstractChildElements() +
          '</printPref>';
};


//-----------------------------------------------------------------------------
/**
 * I am the JS version of an DatabaseDeliveryPreference object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function DatabaseDeliveryPreference (aIsEnabled, aRetentionPolicy)
{
   if (arguments.length > 0)
   {
      DatabaseDeliveryPreference.superclass.constructor.call(this, DeliveryTypeEnum.STORE_IN_DATABASE, aIsEnabled, -1);
      this.retentionPolicy = aRetentionPolicy;
   }
}

//--- inheritence chain...
DatabaseDeliveryPreference.prototype = new AbstractDeliveryPreference();
DatabaseDeliveryPreference.prototype.constructor = DatabaseDeliveryPreference;
DatabaseDeliveryPreference.superclass = AbstractDeliveryPreference.prototype;

DatabaseDeliveryPreference.prototype.toXml = function()
{
   return '<dbPref retentionPolicy="' + this.retentionPolicy + '" ' + this.getAbstractAttributes()  + '>' +
           this.getAbstractChildElements() +
          '</dbPref>';
};


//-----------------------------------------------------------------------------
/**
 * I am the JS version of an FileTransferDeliveryPreference object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FileTransferDeliveryPreference (aIsEnabled, aIsZip, aDestinationId)
{
   if (arguments.length > 0)
   {
      FileTransferDeliveryPreference.superclass.constructor.call(this, DeliveryTypeEnum.FILE_TRANSFER, aIsEnabled, aDestinationId);
      this.zip = aIsZip;
      this.subFolderPath = null;
   }
}

//--- inheritence chain...
FileTransferDeliveryPreference.prototype = new AbstractDeliveryPreference();
FileTransferDeliveryPreference.prototype.constructor = FileTransferDeliveryPreference;
FileTransferDeliveryPreference.superclass = AbstractDeliveryPreference.prototype;

FileTransferDeliveryPreference.prototype.toXml = function()
{
   return '<fileTransfer zip="' + this.zip + '" '+
           (JsUtil.isGood(this.subFolderPath)  ? ' subFolderPath="' + this.subFolderPath + '" ' : '') + 
           this.getAbstractAttributes()  + '>' +
           this.getAbstractChildElements() +
          '</fileTransfer >';
};



//-----------------------------------------------------------------------------
/**
 * I am the JS version of an DeliveryPreferenceSet object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function DeliveryPreferenceSet()
{
   this.prefs = new Array();
}

DeliveryPreferenceSet.prototype.addDeliveryPreference = function (aPref)
{
   this.prefs.push(aPref);
};

DeliveryPreferenceSet.prototype.getEmailPref = function ()
{
   for (var i = 0; i < this.prefs.length; i++)
   {
      if (this.prefs[i].type.name == DeliveryTypeEnum.EMAIL.name)
      {
         return this.prefs[i];
      }
   }

   return null;
};

DeliveryPreferenceSet.prototype.toXml = function ()
{
   var xml = '<deliveryPreferenceSet>';

   for (var i = 0; i < this.prefs.length; ++i)
   {
      xml += this.prefs[i].toXml();
   }

   xml += '</deliveryPreferenceSet>';
   return xml;
};





//-----------------------------------------------------------------------------
/**
 * I am the JS version of an OutputPreference object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function OutputPreference(aIsEnabled, aFormat)
{
   this.isEnabled = aIsEnabled;
   this.outputFormat = aFormat;
}


OutputPreference.prototype.toXml = function ()
{
   return '<outputPreference enabled="' + this.isEnabled + '" format="' + this.outputFormat.name + '"/>';
};


//-----------------------------------------------------------------------------
/**
 * I am the JS version of a OutputPreferenceSet object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function OutputPreferenceSet()
{
   this.prefs = {};
   this.xslUrl = null;
}

OutputPreferenceSet.prototype.addOutputPreference = function (aPref)
{
   this.prefs[aPref.outputFormat.name] = aPref;
};

OutputPreferenceSet.prototype.clear = function ()
{
   this.prefs = {};
};

OutputPreferenceSet.prototype.getPdfPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.PDF);
};

OutputPreferenceSet.prototype.getHtmlPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.HTML);
};

OutputPreferenceSet.prototype.getPagedHtmlPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.PAGED_HTML);
};

OutputPreferenceSet.prototype.getXlsPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.singleXLS);
};

OutputPreferenceSet.prototype.getXls2007Pref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.spreadsheetML);
};

OutputPreferenceSet.prototype.getCsvPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.CSV);
};

OutputPreferenceSet.prototype.getXmlPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.XML);
};

OutputPreferenceSet.prototype.getXhtmlPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.XHTML);
};

OutputPreferenceSet.prototype.getMhtPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.MHT);
};

OutputPreferenceSet.prototype.getHtmlFragmentPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.HTMLFragment);
};

OutputPreferenceSet.prototype.getXlwaPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.XLWA);
};

OutputPreferenceSet.prototype.getXlsxDataPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.xlsxData);
};

OutputPreferenceSet.prototype.getLayoutDataXmlPref = function ()
{
   return this.getOutputPreference(OutputFormatEnum.layoutDataXML);
};



OutputPreferenceSet.prototype.getOutputPreference = function (aFormat)
{
   var pref = this.prefs[aFormat.name];

   if (!pref)
   {
      pref = new OutputPreference(false, aFormat);
      this.addOutputPreference(pref);
   }

   return pref;
};




OutputPreferenceSet.prototype.toXml = function ()
{
   var xslAttrib = (this.xslUrl ? ' xslUrl="' + this.xslUrl + '" ' : '');
   var xml = "<outputPreferenceSet " + xslAttrib + ">";

   var key;
   var eachPref;
   for (key in this.prefs)
   {
      eachPref = this.prefs[key];

      if (eachPref.isEnabled)
      {
         xml += eachPref.toXml();
      }
   }

   xml += "</outputPreferenceSet>";

   return xml;
};

//-----------------------------------------------------------------------------
/**
 * I am the JS version of a Runtime Filter
 *
 * @constructor
 * @author Jeremy Siler
 **/
function ReiRuntimeFilter(aDataItemName, aRelation, aValues, aQuery, aFullQueryExpression)
{
   this.dataItemName = aDataItemName;
   this.relation = aRelation;
   this.values = aValues;
   this.query = aQuery;
   this.fullQueryExpression =  aFullQueryExpression;
           
}


ReiRuntimeFilter.prototype.toXml = function ()
{
   var columnExpression = '';

   if (JsUtil.isGood(this.dataItemName) && this.dataItemName.length>0)
   {
      columnExpression +=  ' <dataItemName>' + JsUtil.escapeXml(this.dataItemName) +'</dataItemName>';
   }

   if (JsUtil.isGood(this.fullQueryExpression)&& this.fullQueryExpression.length>0)
   {
      columnExpression +=  ' <fullQueryItemExp>' + JsUtil.escapeXml(this.fullQueryExpression) +'</fullQueryItemExp>';
   }
   return '<runtimeFilter>  '+ columnExpression
          + ' <relation>' + JsUtil.escapeXml(this.relation) +
          '</relation> <values>' + JsUtil.escapeXml(this.values) +
          '</values><query>' + JsUtil.escapeXml(this.query) +
          '</query></runtimeFilter>';
};



//-----------------------------------------------------------------------------
/**
 * I am a set of Runtime Filters
 *
 * @constructor
 * @author Jeremy Siler
 **/
function RuntimeFilterSet()
{
   this.filters = new Array();
}

RuntimeFilterSet.prototype.toXml = function ()
{
   var xml = '<runtimeFilterSet>';

   for (var i = 0; i < this.filters.length; ++i)
   {
      xml += this.filters[i].toXml();
   }

   xml += '</runtimeFilterSet>';
   return xml;
};

RuntimeFilterSet.prototype.addFilter = function (aFilter)
{
   this.filters.push(aFilter);
};



//-----------------------------------------------------------------------------
/**
 * SortOverride
 *
 * @constructor
 * @author Lance Hankins
 **/
function SortOverride(aRefItemName, aSortDirection, aSortOrder, aIsDimension)
{
   this.refItemName = aRefItemName;
   this.sortDirection = aSortDirection;
   this.sortOrder = aSortOrder;
   this.isDimension = aIsDimension;
}


SortOverride.prototype.toggleDirection = function()
{
   this.sortDirection = (this.sortDirection == 0 ? 1 : 0);
};



SortOverride.prototype.toString = function()
{
   return this.toXml();
}

SortOverride.prototype.toXml = function()
{
   return '<sortOverride refItem="' + this.refItemName + '" sort="' + this.sortDirection + '" order="' + this.sortOrder + '" isDimension="' + this.isDimension + '"/>';
};



//-----------------------------------------------------------------------------
/**
 * ContainerSortOverrides
 *
 * @constructor
 * @author Lance Hankins
 **/
function ContainerSortOverrides(aContainerXpath)
{
   this.containerXpath = aContainerXpath;
   this.sortOverrides = [];
}

ContainerSortOverrides.prototype.clear = function()
{
   this.sortOverrides = [];
};

ContainerSortOverrides.prototype.addOverride = function(anOverride)
{
   this.sortOverrides.push(anOverride);
};


ContainerSortOverrides.prototype.toXml = function()
{
   var xml = '<containerSortOverrides xpath="' + this.containerXpath + '">';

   for (var i = 0; i < this.sortOverrides.length; ++i)
   {
      xml += this.sortOverrides[i].toXml();
   }

   xml += '</containerSortOverrides>';
   return xml;
};


//-----------------------------------------------------------------------------
/**
 * SortOverrides
 *
 * @constructor
 * @author Lance Hankins
 **/
function ReportSortOverrides()
{
   this.overrides = new Object();
}

ReportSortOverrides.prototype.add = function (aContainerOverrides)
{
   this.overrides[aContainerOverrides.containerXpath] = aContainerOverrides;
};

ReportSortOverrides.prototype.getOverridesFor = function (anXpath)
{
   return this.overrides[anXpath];
};

ReportSortOverrides.prototype.removeOverridesFor = function (anXpath)
{
   delete this.overrides[anXpath];
};



ReportSortOverrides.prototype.toXml = function()
{
   var xml = '<reportSortOverrides>';

   var xpath;
   var value;
   for (xpath in this.overrides)
   {
      xml += this.overrides[xpath].toXml();
   }

   xml += '</reportSortOverrides>';
   return xml;
};









//-----------------------------------------------------------------------------
/**
 * InsertContentDirective
 *
 * @constructor
 * @author Lance Hankins
 **/
function InsertContentDirective(aContainerXpath,
                                aInsertRelativeToRef,
                                aInsertRelation,
                                aNewColumnName,
                                aNewColumnExpr,
                                aRegularAggregate,
                                aSummaryFunction,
                                aSort,
                                aCss,
                                aContentType)
{
   this.containerXpath = aContainerXpath;
   this.insertRelativeToRef = aInsertRelativeToRef;
   this.insertRelation = aInsertRelation;
   this.newColumnName = aNewColumnName;
   this.newColumnExpression = aNewColumnExpr;
   this.regularAggregate = aRegularAggregate;
   this.summaryFunction = aSummaryFunction;
   this.sort = aSort;
   this.css = aCss;
   this.contentType = aContentType;
   if(this.contentType == null)
   {
      this.contentType = ModifiableContentTypeEnum.LIST_COLUMN;
   }
}

InsertContentDirective.prototype.getType = function()
{
   return "insert";
};

InsertContentDirective.prototype.getCssAttribute = function(aAttributeName, aDefaultValue)
{
   var toks = this.css.split(";");
   var nvPair;

   for (var i = 0; i < toks.length; ++i)
   {
      nvPair = toks[i].split(":");

      if (nvPair.length == 2 && nvPair[0] == aAttributeName)
      {
         return nvPair[1];
      }
   }

   return aDefaultValue;
};




InsertContentDirective.prototype.toXml = function()
{
   return "<insertContent " +
          'container="' + this.containerXpath + '" ' +
          'relativeToRef="' + this.insertRelativeToRef + '" ' +
          'insertRelation="' + this.insertRelation.name + '" ' +
          'newColumnName="' + this.newColumnName + '" ' +
          'regularAggregate="' + this.regularAggregate.name + '" ' +
          'summaryFunction="' + this.summaryFunction.name + '" ' +
          'sort="' + this.sort.name + '" ' +
          'css="' + this.css + '" ' +
          'contentType="' + this.contentType.name + '" ' +
          ">" +
          '<insertContentExpression><![CDATA[' +
          this.newColumnExpression +
          ']]></insertContentExpression>' +
          '</insertContent>';
};

//-----------------------------------------------------------------------------
/**
 * SuppressContentDirective
 *
 * @constructor
 * @author Lance Hankins
 **/
function SuppressContentDirective(aContainerXpath, aRefItemName, aIsDelete, aContentType)
{
   this.containerXpath = aContainerXpath;
   this.refItemName = aRefItemName;
   this.isDelete = aIsDelete;
   this.contentType = aContentType;
   if(this.contentType == null)
   {
      this.contentType = ModifiableContentTypeEnum.LIST_COLUMN;
   }
}


SuppressContentDirective.prototype.getType = function()
{
   return "suppress";
};

SuppressContentDirective.prototype.toXml = function()
{
   // NOTE: this is somewhat of a hack - we're using the containerXpath for one of two
   // things.  If this is a reference to a column, its the containerXpath... if its a
   // reference to something more generic, this is a raw Xpath.   The way to tell between
   // the two cases is refItemName will be null
   var contentLocator;

   if (JsUtil.isGood(this.refItemName) && this.refItemName != "")
   {
      contentLocator = 'container="' + this.containerXpath + '" refItemName="' + this.refItemName + '" ';
   }
   else
   {
      contentLocator = 'xpath="' + this.containerXpath + '" ';

   }
   return "<suppressContent " +
          contentLocator + 
          'isDelete="' + this.isDelete + '" ' +
          'contentType="' + this.contentType.name + '" ' +
          "/>";
};



//-----------------------------------------------------------------------------
/**
 * ConvertChartDirective
 *
 * @constructor
 * @author Lance Hankins
 **/
function ConvertChartDirective(aTargetXpath, aNewChartType)
{
   this.targetXpath = aTargetXpath;
   this.newChartType = aNewChartType;
}


ConvertChartDirective.prototype.getType = function()
{
   return "convertChart";
};

ConvertChartDirective.prototype.toXml = function()
{
   return "<convertChart " +
          'targetXpath="' + this.targetXpath + '" ' +
          'newChartType="' + this.newChartType + '" ' +
          "/>";
};

//-----------------------------------------------------------------------------
/**
 * MoveContentDirective
 *
 * @constructor
 * @author Brian Miller
 *
**/
function MoveContentDirective(aContainerXpath, aColumnName, aRelativeOffset, aDirection, aAnchorColumnName) {
    this.containerXpath = aContainerXpath;
    this.columnName = aColumnName;
    this.relativeOffset = aRelativeOffset;
    this.direction = aDirection;
    this.anchorColumnName = aAnchorColumnName;
}

MoveContentDirective.prototype.getType = function () {
    return "move";
};

MoveContentDirective.prototype.toXml = function () {

    var contentLocator = 'container="' + this.containerXpath + '" columnName="' + this.columnName + '" ';

    var placement;
    if (JsUtil.isGood(this.direction) && this.direction != '') {
        placement = 'direction="' + this.direction + '" anchorColumnName="' + this.anchorColumnName + '"';
    }
    else {
        placement = 'relativeOffset="' + this.relativeOffset + '"';
    }
    return "<moveContent " + contentLocator + placement + "/>";
};


//-----------------------------------------------------------------------------
/**
 * AddListSummaryDirective
 *
 * @constructor
 * @author Lance Hankins
 *
**/
function AddListSummaryDirective (aContainerXpath,
                                  aRegularAggregate,
                                  aAggregate,
                                  aListGroupNamesArray,
                                  aSummaryColumnRefsArray,
                                  aSummaryNewDataItemNamesArray,
                                  aSummaryNewDataItemExpressionsArray,
                                  aCssValues,
                                  aIsSummaryRowAtTop) {
   this.containerXpath = aContainerXpath;
   this.regularAggregate = aRegularAggregate;
   this.aggregate= aAggregate;
   this.listGroupNames = aListGroupNamesArray;
   this.summaryColumnRefs = aSummaryColumnRefsArray;
   this.summaryNewDataItemNames = aSummaryNewDataItemNamesArray;
   this.summaryNewDataItemExpressions = aSummaryNewDataItemExpressionsArray;
   this.cssValues = aCssValues;
   this.isSummaryRowAtTop  = aIsSummaryRowAtTop;
}


AddListSummaryDirective.prototype.getType = function () {
    return "addListSummary";
};

AddListSummaryDirective.prototype.toXml = function () {

   /*
      Example XML Snippet:

      <addListSummary container="//list" regularAggregate="AVERAGE" aggregateFunction="CALCULATED" summaryRowAtTop="false">
         <listGroup name="Product line"/>
         <listGroup name="Product type"/>
         <summarize refItem="Unit cost" newDataItemName="Unit cost - AVERAGE">
            <newDataItemExpr><![CDATA[[Unit cost]]]></newDataItemExpr>
         </summarize>
         <summarize refItem="Unit sale price" newDataItemName="Unit sale price - AVERAGE">
            <newDataItemExpr><![CDATA[[Unit sale price]]]></newDataItemExpr>
         </summarize>
      </addListSummary>
   */
   var xml = "<addListSummary container=\"" + JsUtil.escapeXml(this.containerXpath) +
             "\" regularAggregate=\"" + this.regularAggregate.name +
             "\" aggregateFunction=\"" + this.aggregate.name + "\"" +
             (JsUtil.isGood(this.cssValues) ? " cssValues=\"" + JsUtil.escapeXml(this.cssValues) + "\"" : "")  +
             " summaryRowAtTop=\"" + (this.isSummaryRowAtTop ? "true" : "false" ) + "\"" +
             ">";

   for (var i = 0; i < this.listGroupNames.length; ++i) {
      xml += "<listGroup name=\"" + this.listGroupNames[i] + "\"/>";
   }

   for (var i = 0; i < this.summaryColumnRefs.length; ++i) {
      xml += "<summarize refItem=\"" + this.summaryColumnRefs[i] + "\" newDataItemName=\"" + this.summaryNewDataItemNames[i] + "\">" +
                "<newDataItemExpr><![CDATA[" + JsUtil.escapeXml(this.summaryNewDataItemExpressions[i]) + "]]></newDataItemExpr>" +
             "</summarize>";
   }

   xml += "</addListSummary>";
   return xml;
};





//-----------------------------------------------------------------------------
/**
 * RuntimeContentAdjustments
 *
 * @constructor
 * @author Lance Hankins
 **/
function RuntimeContentAdjustments()
{
   this.adjustments = [];
}

RuntimeContentAdjustments.prototype.addAdjustment = function (anAdjustment)
{
   this.adjustments.push(anAdjustment);
};

RuntimeContentAdjustments.prototype.clear = function ()
{
   this.adjustments = [];
};


RuntimeContentAdjustments.prototype.toXml = function ()
{
   var xml = "<contentAdjustments>";

   for (var i = 0; i < this.adjustments.length; ++i)
   {
      xml += this.adjustments[i].toXml();
   }

   xml += "</contentAdjustments>";
   return xml;
};



//-----------------------------------------------------------------------------
/**
 * I am the JS version of a ReportExecutionInputs object...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ReportExecutionInputs()
{
   this.dataSourceSet = new DataSourceSet();
   this.parameterSet = new ReportParameterSet();
   this.outputPreferenceSet = new OutputPreferenceSet();
   this.defaultOutputPreferenceSet = new OutputPreferenceSet();
   this.deliveryPreferenceSet = new DeliveryPreferenceSet();
   this.runtimeFilterSet = new RuntimeFilterSet();
   this.sortOverrides = new ReportSortOverrides();
   this.contentAdjustments = new RuntimeContentAdjustments();
   this.outputExpirationDays = '';
   this.rerFolderPath = '';
   this.customerDefinedReiBucketXml = '';
   this.maxExecutionTime = null;
   this.packageOverride = null;
   this.isBurst = null;
   this.launchPreference = 'BACKGROUND';
//   this.rowsPerPage = 50;
//   this.maxPages = 10;
   //todo - outputLocale needs to be in here
}

ReportExecutionInputs.prototype.toXml = function ()
{

   var maxExecutionTimeXml = '';
   if (this.maxExecutionTime != null)
   {
      maxExecutionTimeXml = '<maxExecutionTime time="' + this.maxExecutionTime + '"/>';
   }
   return '<reportExecutionInputs version="2735">' +
                this.dataSourceSet.toXml() +
                this.parameterSet.toXml() +
                this.outputPreferenceSet.toXml() +
                this.deliveryPreferenceSet.toXml() +
                this.runtimeFilterSet.toXml() +
                this.sortOverrides.toXml() +
                this.contentAdjustments.toXml() +
                '<outputExpirationDays days="' + this.outputExpirationDays + '"/>' +
                '<reportExecutionRequestFolderPath path="' + this.rerFolderPath + '"/>' +
                '<launchPreference type="' + this.launchPreference + '"/>' +
                this.customerDefinedReiBucketXml +
                maxExecutionTimeXml +
                (this.packageOverride != null ? '<packageOverride name="' + this.packageOverride + '" />' : '') +
                '<isBurst value="'+ this.isBurst +'"/>' +
               (this.rowsPerPage != null ? '<rowsPerPage value="' +this.rowsPerPage + '"/>' : '') +
               (this.maxPages != null ? '<maxPages value="' +this.maxPages + '"/>' : '') +
                '</reportExecutionInputs>';

};
