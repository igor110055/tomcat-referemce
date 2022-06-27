//-----------------------------------------------------------------------------
/**
 * represents information on a single parameter in a report.
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/

function ReportParameterInfo (aDataType, aIsMultiValue, aIsOptional, aName, aModelFilterItem)
{
   this.dataType = aDataType;
   this.isMultiValue = aIsMultiValue;
   this.isOptional = aIsOptional;
   this.name = aName;
   this.modelFilterItem = aModelFilterItem;
}

ReportParameterInfo.prototype.isRequired = function()
{
   return !(this.isOptional);
};

ReportParameterInfo.prototype.isSatisfiedBy = function(aParamSet)
{
   if (this.isOptional)
      return true;

   if (this.isImplicitParamPassedAtRuntime())
      return true;

   var param = aParamSet.getParameter(this.name);

   return JsUtil.isGood(param) && JsUtil.isGood(param.values) && param.values.length > 0;
};


ReportParameterInfo.prototype.isImplicitParamPassedAtRuntime = function()
{
   return "rerId" == this.name;
};




//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for Custom Prompt Screen UI Controllers
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function AbstractCustomPromptUiController (aDocument)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);
   }
}

AbstractCustomPromptUiController.prototype = new AbstractUiController();
AbstractCustomPromptUiController.prototype.constructor = AbstractCustomPromptUiController;
AbstractCustomPromptUiController.superclass = AbstractUiController.prototype;

/**
 * derived classes can utilize this method to retrieve the current REI
 * instance for this custom prompt screen.
 **/
AbstractCustomPromptUiController.prototype.getRei = function()
{
   if (parent.uiController == this)
   {
      alert("warning, running outside of harness, returning empty REI");
      return new ReportExecutionInputs();
   }
   return parent.uiController.getRei();
};

/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
AbstractCustomPromptUiController.prototype.beforeSubmit = function()
{
   return true;
};

/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
AbstractCustomPromptUiController.prototype.willSubmit = function()
{
};


/**
 * common init behaviors for custom prompts
 **/
AbstractCustomPromptUiController.prototype.initUi = function()
{
   this.highlightRequiredInputs(ServerEnvironment.baseUrl + "/images/required.gif");
};


/**
 * this method will cause any img tags whose id is of the form ParamName_required
 * to be hidden / shown, based on whether or not they are required for the
 * current report.
 **/
AbstractCustomPromptUiController.prototype.highlightRequiredInputs = function(anImage)
{
   parent.uiController.model.reportParamInfo.each(function (aParamInfo) {
      if (aParamInfo.isRequired())
      {
         var label = $(aParamInfo.name + "_label");

         if (label)
         {
            new Insertion.Bottom(label, '<img src="' + anImage + '" alt="req"/>');
         }
      }
   });
};

AbstractCustomPromptUiController.prototype.validateDateStr = function(aDateStr, aFormat, aAllowBlank)
{
   if (Date.validateDateStr)
   {
      return Date.validateDateStr(aDateStr, aFormat, aAllowBlank)
   }
   else
   {
      if (Ext.isEmpty(aDateStr))
      {
         return Ext.isBoolean(aAllowBlank) ? aAllowBlank : false;
      }
      else
      {
         aFormat = aFormat.replace(/%/g, '');
         return (Date.parseDate(aDateStr, aFormat, true) != null)
      }
   }
};

