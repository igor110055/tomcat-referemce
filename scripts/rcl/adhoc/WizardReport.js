

/**
 * This file defines JS representations of things used in the ReportWizard...
 *
 * @author Lance Hankins
 * @author Roger Moore
 * @author Ryan Baula
 *
 **/



//-----------------------------------------------------
//  Function that will allow any type
//-----------------------------------------------------
var allowAny =  function (aQueryItem) { return true; };


//------------------------------------------------------
// Return true only if the query item is of a number type
//-------------------------------------------------------
var allowOnlyNumbers = function (aReportColumn)
{
   var dataType = aReportColumn.dataType;
   if ( dataType=="float64" ||
        dataType=="int16" ||
        dataType=="int32" ||
        dataType=="int64" ||
        dataType=="decimal")
   {
      return true;
   }
   else
   {
      return false;
   }
};

//---------------------------------------------------------------------------//
//  AggregateFunctionEnum -- slight extensions to default generated Js version
//---------------------------------------------------------------------------//
AggregateFunctionEnum.AVERAGE.isAllowedOn = allowOnlyNumbers;
AggregateFunctionEnum.TOTAL.isAllowedOn = allowOnlyNumbers;
AggregateFunctionEnum.COUNT.isAllowedOn = allowAny;
AggregateFunctionEnum.NONE.isAllowedOn = allowAny;


AggregateFunctionEnum.prototype.toggleFunction = function (aReportColumn)
{
   if (aReportColumn.summaryFunction == this)  //set to NONE if currently set to this function
   {
      aReportColumn.summaryFunction = AggregateFunctionEnum.NONE;
   }
   else
   {
      if ( this.isAllowedOn ( aReportColumn) )
      {
         aReportColumn.summaryFunction = this;
       }
       else
       {
         alert( applicationResources.getPropertyWithParameters("reportWizard.errMsg.cantBeAppliedToType", new Array(this.name, aReportColumn.dataType) ))
       }
   }
};


AggregateFunctionEnum.prototype.getDisplayText = function ()
{
  if ( this == AggregateFunctionEnum.NONE)
  {
     return "";
  }
  else
  {
     return applicationResources.getProperty(this.displayValueKey);
  }
};


AggregateFunctionEnum.prototype.toString = function ()
{
   return this.name;
};






//---------------------------------------------------------------------------//
// ReportColumn -- represents a single report column...
//---------------------------------------------------------------------------//

function ReportColumn (aName, aDataType, aRegularAggregate, aColumnType, aExpression, aAggregateFn, aIsCalculated, aSortDirective, aGroupDirective, aIsDefault, aIsHidden)
{
   this.name = aName;
   this.dataType = aDataType;
   this.regularAggregate = aRegularAggregate;
   this.columnType = aColumnType;
   this.queryItemName = aName;
   this.expression = aExpression;
   this.isCalculated = aIsCalculated;
   this.summaryFunction = aAggregateFn;
   this.isSuppressed=false;
   this.isHidden=aIsHidden;
   this.isDefault = aIsDefault;

   //--- 0..1 relations...
   this.sortDirective = aSortDirective;
   this.groupDirective = aGroupDirective;
}

ReportColumn.toPropertySet = function()
{
   var ps = new PropertySet();
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.name"), this.name, PropertyTypes.string));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.regularAggregate"), this.regularAggregate.name, PropertyTypes.regularAggregateEnum));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.summaryFunction"), this.summaryFunction.name, PropertyTypes.aggregateFunctionEnum));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.content.sort"), this.sortDirective.name, PropertyTypes.sortEnum));
   ps.addProperty(new Property(applicationResources.getProperty("profileWizard.suppressed"), this.isSuppressed, PropertyTypes.p_boolean));

   return ps;
};

ReportColumn.fromPropertySet = function(aPropertySet)
{
   this.name = aPropertySet.getProperty(applicationResources.getProperty("profileWizard.content.name")).value;
   this.regularAggregate = Enum.parseEnumFromName(RegularAggregateEnum, aPropertySet.getProperty(applicationResources.getProperty("profileWizard.content.regularAggregate")).value);
   this.summaryFunction = Enum.parseFromName(AggregateFunctionEnum, aPropertySet.getProperty(applicationResources.getProperty("profileWizard.content.summaryFunction")).value);
   this.sortDirective = Enum.parseEnumFromName(SortEnum, aPropertySet.getProperty(applicationResources.getProperty("profileWizard.content.sort")).value);
   this.isSuppressed = aPropertySet.getProperty(applicationResources.getProperty("profileWizard.suppressed")).value;
};

ReportColumn.createFromQueryItemRef = function(aQueryItemRef)
{
   var col = new ReportColumn(aQueryItemRef.refItem, null, null, ReportColumnTypeEnum.GENERIC, aQueryItemRef.refItem, AggregateFunctionEnum.NONE, false, null, null, false, false);
   return col;
};

ReportColumn.createFromQueryItemRefs = function(aQueryItemRefs)
{
   var cols = [];

   for (var i = 0; i < aQueryItemRefs.length; ++i)
   {
      cols.push(ReportColumn.createFromQueryItemRef(aQueryItemRefs[i]));
   }
   return cols;
};

/**
 * create an instance from a single QueryItem
 **/
ReportColumn.createFromQueryItem = function (aQueryItem)
{

   var col = new ReportColumn(aQueryItem.name, aQueryItem.dataType, aQueryItem.regularAggregate, ReportColumnTypeEnum.GENERIC, aQueryItem.ref, AggregateFunctionEnum.NONE, false, null, null, false, false);
   return col;
};

/**
 * create an array of instances from an array of QueryItems
 **/
ReportColumn.createFromQueryItems = function (aQueryItems)
{
   var cols = [];

   for (var i = 0; i < aQueryItems.length; ++i)
   {
      cols.push(ReportColumn.createFromQueryItem(aQueryItems[i]));
   }
   return cols;
};

/**
 * create an array of instances from an array of QueryItems
 **/
ReportColumn.renameFromQueryItems = function (aName, aQueryItems)
{
   var cols = [];

   for (var i = 0; i < aQueryItems.length; ++i)
   {
      cols.push(ReportColumn.renameFromQueryItem(aName, aQueryItems[i]));
   }
   return cols;
};

//returns text to be displayed in the list box
ReportColumn.prototype.getDisplayText = function ()
{
   var displayText = this.name;
   var attributeText = "";

   attributeText = this.summaryFunction.getDisplayText();

   if ( this.sortDirective )
   {
      if ( attributeText != "" )
      {
         attributeText += ", ";
      }
      attributeText += this.sortDirective.getDisplayText();
   }

   if ( this.groupDirective )
   {
      if ( attributeText != "" )
      {
         attributeText += ", ";
      }
      attributeText += this.groupDirective.getDisplayText();
   }
   if ( this.isSuppressed)
   {
      if(attributeText != "")
      {
         attributeText += ", ";
      }
      attributeText += applicationResources.getProperty("reportWizard.columnSelection.suppress");;
   }

   if ( attributeText != "" )
   {
      displayText += " (" + attributeText + ")";
   }
   return displayText;
};

/**
 * returns the "value" for the list box item
 **/
ReportColumn.prototype.getValue = function ()
{
  return this.expression;
};

/**
 * toggle sort directive oscillates between : ascending, descending, none
 **/
ReportColumn.prototype.toggleSort = function ()
{
   if  (this.sortDirective)
   {
      if (this.sortDirective.direction == 0)
         this.sortDirective.direction = 1;
      else
         this.sortDirective = null;
   }
   else
   {
      this.sortDirective = new SortDirective(0, 0);
   }

};


ReportColumn.prototype.toXml = function ()
{
   var xml = '<report-column name="' + JsUtil.escapeXml(this.name) +
                        '" dataType="' + this.dataType +
                        '" columnType="' + this.columnType.name +
                        '" isCalculated="' + this.isCalculated +
                        '" isSuppressed="' + this.isSuppressed +
                        '" isHidden="' + this.isHidden +
                        '" isDefault="' + this.isDefault +
                        '" regularAggregate="' + this.regularAggregate + 
                        '" summaryFunction="' + this.summaryFunction + '">';

   xml += ("<expr><![CDATA[" + this.expression + "]]></expr>");

   if (this.groupDirective)
   {
      xml += this.groupDirective.toXml();
   }
   if (this.sortDirective)
   {
      xml += this.sortDirective.toXml();
   }


   xml += '</report-column>';

   return xml;
};


//---------------------------------------------------------------------------//
// ReportFilter :
//---------------------------------------------------------------------------//
function ReportFilter (aName, aExpr, aUsage, anApplication)
{
   this.name = aName;
   this.expression = aExpr;
   this.usage = aUsage;
   this.application = anApplication;
}


ReportFilter.prototype.toXml = function()
{
   return '<filter name="' + JsUtil.escapeXml(this.name) + '" usage="' + this.usage.name + '" application="' + this.application + '">' +
             "<![CDATA[" +
                this.expression +
             "]]>" +
          '</filter>';
};

//---------------------------------------------------------------------------//
// Wizard  :
//---------------------------------------------------------------------------//
function WizardReport(aReportId, aName, aPackagePath, aPageOrientation, aReportType, aSaveToFolderId)
{
   this.reportId = aReportId;
   this.name = aName;
   this.packagePath = aPackagePath;
   this.pageOrientation = aPageOrientation;
   this.reportType = aReportType;
   this.saveToFolderId = aSaveToFolderId;

   this.columns = [];
   this.filters = [];
   this.pageBreakColumn = null;
}


/**
 * add a column
 **/
WizardReport.prototype.addColumn = function (aColumn)
{
   this.columns.push(aColumn);
};

/**
 * add a filter
 **/
WizardReport.prototype.addFilter = function (aFilter)
{
   this.filters.push(aFilter);
};

/**
 * retrieve all calculated columns
 * @return an array of ReportColumn objects
 **/
WizardReport.prototype.getCalculatedColumns = function ()
{
   var calculatedColumns = [];

   for (var i = 0; i < this.columns.length; ++i)
   {
      if (this.columns[i].isCalculated)
      {
         calculatedColumns.push(this.columns[i]);
      }
   }
   return calculatedColumns;
};

/**
 * retrieve all crosstab rows
 * @return an array of ReportColumn objects
 **/
WizardReport.prototype.getCrossTabRowEdges = function ()
{
   return this.getColumnByType(ReportColumnTypeEnum.ROW_EDGE);
};

/**
 * retrieve all crosstab columns
 * @return an array of ReportColumn objects
 **/
WizardReport.prototype.getCrossTabColumnEdges = function ()
{
   return this.getColumnByType(ReportColumnTypeEnum.COLUMN_EDGE);
};


/**
 * retrieve all crosstab columns
 * @return an array of ReportColumn objects
 **/
WizardReport.prototype.getCrossTabMeasures = function ()
{
   return this.getColumnByType(ReportColumnTypeEnum.MEASURE);
};


/**
 * retrieve all crosstab columns
 * @return an array of ReportColumn objects
 **/
WizardReport.prototype.getColumnByType = function (aType)
{
   var columns = [];

   for (var i = 0; i < this.columns.length; ++i)
   {
      if (this.columns[i].columnType == aType)
      {
         columns.push(this.columns[i]);
      }
   }
   return columns;
};


/**
 * retrieve a column by name
 **/
WizardReport.prototype.getColumnByName = function (aColumnName)
{
   for (var i = 0; i < this.columns.length; ++i)
   {
      if (this.columns[i].name == aColumnName)
      {
         return this.columns[i];
      }
   }
   return null;
};


/**
 * retrieve a filter by name
 **/
WizardReport.prototype.getFilterByName = function (aFilterName)
{
   for (var i = 0; i < this.filters.length; ++i)
   {
      if (this.filters[i].name == aFilterName)
      {
         return this.filters[i];
      }
   }
   return null;
};

/**
 * retrieve a filters
 **/
WizardReport.prototype.getFilters = function ()
{
   return this.filters;
};



/**
 * reset calculated columns based on the supplied values... will update
 * any existing columns with the same name, and add the new ones to the
 * end...
 *
 **/
WizardReport.prototype.updateCalculatedColumns = function (aNewCalcColumns)
{
   var newColsByName = new Object();
   for (var i = 0; i < aNewCalcColumns.length; ++i)
   {
      newColsByName[aNewCalcColumns[i].name] = aNewCalcColumns[i];
   }

   //--- first, remove any wizard calc columns that have been deleted...
   var current = this.getCalculatedColumns();
   var removed = [];

   for (var i = 0; i < current.length; ++i)
   {
      if (!(newColsByName[current[i].name]))
      {
         removed.push(current[i]);
      }
   }

   if (removed.length > 0)
   {
      this.columns = JsUtil.removeElementsFromArrayByValues(this.columns, removed);
   }


   //--- jumping through some hoops here to leave updated columns in the same
   //    order they were in originally...
   for (var i = 0; i < this.columns.length; ++i)
   {
      if (this.columns[i].isCalculated)
      {
         var updated = newColsByName[this.columns[i].name];
         this.columns[i].expression = updated.expression;

         //--- remove it, so we'll know which ones are left to add at the end...
         delete newColsByName[updated.name];
      }
   }

   //--- add the new columns...
   for (var colName in newColsByName)
   {
      this.columns.push(newColsByName[colName]);
   }
};


/**
 * xform this wizard report into its xml form...
 **/
WizardReport.prototype.toXml = function ()
{
   var xmlString =
      '<wizard-report name="' + JsUtil.escapeXml(this.name) +'" pageOrientation="' + this.pageOrientation + '" reportType="' + this.reportType + '"' + (this.saveToFolderId ? ' saveToFolderId="' + this.saveToFolderId + '"' : '') + (this.reportId ? ' reportId="' + this.reportId+ '"' : '') + '>' +
         '<package-path>' + this.packagePath + '</package-path>' +
         '<filters>';

   for (var i = 0; i < this.filters.length; ++i)
   {
      xmlString += this.filters[i].toXml();
   }

   xmlString += '</filters><columns>';

   for (var i = 0; i < this.columns.length; ++i)
   {
      xmlString += this.columns[i].toXml();
   }

   xmlString += '</columns>';

   if(this.pageBreakColumn)
   {
      xmlString += '<pageBreakColumn>' + this.pageBreakColumn.toXml() + '</pageBreakColumn>';
   }

   xmlString += '</wizard-report>';

   return xmlString;
};

