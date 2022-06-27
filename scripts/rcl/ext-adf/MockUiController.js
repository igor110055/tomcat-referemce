/**
 * Mock UI Controller interacts with legacy prompt pages
 *
 * @author sallman@motio.com
 * @since 6/8/11
 */

Adf.MockUiController = function()
{
   ////////////////////////////////////////////////////////////////////////////
   // Private
   ////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////
   // Public
   ////////////////////////////////////////////////////////////////////////////
   return {
      init : function()
      {
         //pass in callbacks to get rei and set results
      },

      getPromptIframeUiController:  function()
      {
         return frames["promptIframe"].uiController;
      },

      getRei : function()
      {
         //todo this is wrong
         return this.model.rei;
      },

      willSubmit: function()
      {
         this.getPromptIframeUiController().willSubmit();
         //todo do this for ext
         this.document.forms[0].reiXml.value = this.model.rei.toXml();
      },

      beforeSubmit: function()
      {
         var promptBeforeSubmit = this.getPromptIframeUiController().beforeSubmit();

         if (!promptBeforeSubmit)
            return false;

         //--- kind of a hack, but the REI is only updated during willSubmit()
         this.getPromptIframeUiController().willSubmit();

         var msg = '';
         var errorFound;
         var paramInfo;

         //todo this.model and this.model.rei
         for (var i = 0; i < this.model.reportParamInfo.length; ++i)
         {
            paramInfo = this.model.reportParamInfo[i];
            if (!paramInfo.isSatisfiedBy(this.model.rei.parameterSet))
            {
               msg += applicationResources.getPropertyWithParameters("prompt.reiParameters.errMsg.requiredParamters", new Array(paramInfo.name))+"\n";
               errorFound = true;
            }
         }

         if (errorFound)
         {
            alert(applicationResources.getProperty("prompt.reiParameters.errMsg.badParameters")+":\n\n" + msg);
            return false;
         }

         return true;
      }

   };
}();


var workspaceUi = Adf.manageUsersUi;
