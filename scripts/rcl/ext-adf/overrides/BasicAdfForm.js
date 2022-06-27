Ext.ns("Adf");

Adf.BasicAdfForm = Ext.extend(Ext.form.BasicForm, {
   doAction : function(action, options)
   {

      var origFailure = options.failure;
      options.failure = function(aForm, aAction)
      {
          //Run either the defined failure handler or the generic ADF one, if an overridden doesn't exist
         if (origFailure)
         {
            if(options.scope)
            {
              origFailure.call(options.scope, aForm, aAction);
            }
            else
            {
              origFailure(aForm, aAction);
            }
         }
         else
         {
            RequestUtil.handleGenericFail(aForm, aAction);
         }

      };

      var origSuccess = options.success;
      options.success = function(aForm, aAction)
      {
         if(origSuccess)
         {
            if(options.scope)
            {
               origSuccess.call(options.scope, aForm, aAction);
            }
            else
            {
               origSuccess(aForm, aAction);
            }
         }
      };

      if(!options.params)
      {
         options.params = {};
      }
      options.params['extAjax'] = 'true';

      Adf.BasicAdfForm.superclass.doAction.call(this, action, options);
   }
});

