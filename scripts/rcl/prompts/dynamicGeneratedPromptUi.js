
//-----------------------------------------------------------------------------
/**
 * Dynamic Generated Prompt UI Controller
 *
 * @constructor
 * @author Lance Hankins
 **/
function DynamicGeneratedPromptUiController (aDocument, aInsertionPoint, aPromptScreen, aReportId)
{
   if (arguments.length > 0)
      DynamicGeneratedPromptUiController.superclass.constructor.call(this, aDocument);

   this.insertionPoint = aInsertionPoint;
   this.generatedPromptScreen = aPromptScreen;
   this.generatedPromptScreen.document = aDocument;
   this.reportId = aReportId;
}

DynamicGeneratedPromptUiController.prototype = new AbstractCustomPromptUiController();
DynamicGeneratedPromptUiController.prototype.constructor = DynamicGeneratedPromptUiController;
DynamicGeneratedPromptUiController.superclass = AbstractCustomPromptUiController.prototype;


DynamicGeneratedPromptUiController.prototype.renderPrompts = function()
{
   var insertAt = this.document.getElementById(this.insertionPoint);
   this.generatedPromptScreen.renderPrompts(insertAt, this.getRei().parameterSet, this.reportId );   
}

DynamicGeneratedPromptUiController.prototype.initUi = function()
{
   this.renderPrompts();
}

DynamicGeneratedPromptUiController.prototype.selectAll = function(anId)
{
   var selectBox = document.getElementById(anId);
   for (var i = 0; i < selectBox.length; i++)
   {
      selectBox[i].selected = true
   }
}

DynamicGeneratedPromptUiController.prototype.unSelectAll = function(anId)
{
   var selectBox = document.getElementById(anId);
   selectBox.selectedIndex = -1;
}



/**
* hook for derived classes to cancel a submit (usually do to some sort
* of validation error).  Return false to cancel submission, true to allow it.
**/
DynamicGeneratedPromptUiController.prototype.beforeSubmit = function()
{
   return true;
};


/**
* hook for derived classes: submission is imminent, update anything that
* needs to be submitted
**/
DynamicGeneratedPromptUiController.prototype.willSubmit = function()
{
   var paramSet = this.getRei().parameterSet;

    paramSet.clear(); //remove any previously saved parameters

   var eachPrompt;
   var eachParamName;
   var param;

   for (eachParamName in this.generatedPromptScreen.prompts)
   {
      eachPrompt = this.generatedPromptScreen.prompts[eachParamName]

      param = eachPrompt.harvestParameter();

      if (JsUtil.isGood(param))
      {
         paramSet.addParameter(param);
      }
   }

   for (var i = 0; i < this.generatedPromptScreen.promptGroups.length; i++)
   {
      var prompts = this.generatedPromptScreen.promptGroups[i].prompts;

      for (var name in prompts)
      {
         paramSet.addParameter(prompts[name].harvestParameter());
      }
   }
};
