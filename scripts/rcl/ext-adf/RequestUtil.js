
var RequestUtil =
{
   request: function(aConfig, aIsLoginController)
   {
      //todo this is causing issues for some reason, test it out in an immediate window
//      if(ServerEnvironment.contextPath && ServerEnvironment.contextPath.length > 0 && !aConfig.url.match("^" + ServerEnvironment.contextPath))
//      {
//         aConfig.url = ServerEnvironment.contextPath + aConfig.url;
//      }

      if(!aIsLoginController
            && !aConfig.suppressAuthCheck
            && aConfig.params
            && aConfig.params.crnInstanceId
            && uiController.crnInstanceNodes[aConfig.params.crnInstanceId]
            && !uiController.crnInstanceNodes[aConfig.params.crnInstanceId].attributes.authenticated)
      {
         var callback = function()
         {
            RequestUtil.request(aConfig, aIsLoginController);
         };

         RequestUtil.promptForCredentials(aConfig.params.crnInstanceId, callback);
         return;
      }

      var originalSuccess = aConfig.success;
      aConfig.success = function(aResponse, aOptions)
      {
         if(aResponse.responseText)
         {
            try
            {
               var responseObject = Ext.decode(aResponse.responseText);
               if(responseObject.errorMessage)
               {
                  if(responseObject.exceptionReportId)
                  {
                     if(!aConfig.onException || aConfig.onException(responseObject))
                     {
                        ExceptionReportWindow.launch(responseObject);
                     }
                  }
                  else
                  {
                     if(!aConfig.onErrorMessage || aConfig.onErrorMessage(responseObject.errorMessage))
                     {
                        Ext.Msg.alert("Error", responseObject.errorMessage);
                     }
                  }
                  return;
               }
               else if(responseObject.validationMessage)
               {
                  if(!aConfig.onValidationMessage || aConfig.onValidationMessage(responseObject.validationMessage))
                  {
                     Ext.Msg.alert("Validation", responseObject.validationMessage);
                  }
                  return;
               }
            }
            catch(e)
            {
               if(aResponse.responseText.indexOf("/scripts/rcl/login.js") > 0)
               {
                  Ext.Msg.alert("Session Expired", "Your MotioADF session has expired.", function()
                  {
                     window.location = ServerEnvironment.contextPath + "/actions/loginPromptAction.do";
                  });
                  return;
               }
            }
         }

         if(originalSuccess)
         {
            if(aConfig.scope)
            {
               originalSuccess.call(aConfig.scope, aResponse, aOptions);
            }
            else
            {
               originalSuccess(aResponse, aOptions);
            }
         }
      };

      var originalFailure = aConfig.failure;
      aConfig.failure = function(aResponse, aOptions)
      {
//         if(!aIsLoginController)
//         {
//            uiController.endWait();
//         }
         if(originalFailure)
         {
            if(aConfig.scope)
            {
               originalFailure.call(this, aResponse, aOptions);
            }
            else
            {
               originalFailure(aResponse, aOptions);
            }
         }
         if(aResponse.isTimeout)
         {
            if(originalSuccess)
            {
               Ext.Msg.alert("Request Timeout", "The request has timed out.");
            }
         }
         else
         {
            if(aResponse.statusText && aResponse.statusText != "undefined")
            {
               Ext.Msg.alert("Request Failed", "The request has failed: " + aResponse.statusText + ".<br/>Please verify that MotioADF is running.");
            }
            else
            {
               Ext.Msg.alert("Request Failed", "The request has failed for an unknown reason.<br/>Please verify that MotioADF is running.");
            }
         }
      };
      if(!aConfig.params)
      {
         aConfig.params = {};
      }
      aConfig.params['extAjax'] = 'true';

      return Ext.Ajax.request(aConfig);
   },

   loadStore: function(aStore, aConfig)
   {
      if(!aConfig)
      {
         aConfig = {};
      }
      aConfig.url = aStore.url;
      var originalSuccess = aConfig.success;
      aConfig.success = function(aResponse, aOptions)
      {
         if(aResponse && aResponse.responseText)
         {
            aStore.loadData(Ext.decode(aResponse.responseText));
         }
         if(originalSuccess)
         {
            originalSuccess(aResponse, aOptions);
         }
      };
      RequestUtil.request(aConfig);
   },

   validateContainer: function(aContainer, aSuppressEndWait)
   {
      var validationErrors = [];
      if(!aContainer.items)
      {
         return true;
      }
      var items = aContainer.items;
      if(!items.getCount)
      {
         var itemsCollection = new Ext.util.MixedCollection();
         itemsCollection.addAll(items);
         items = itemsCollection;
      }
      for(var i=0;i<items.getCount();i++)
      {
         if(items.get(i).validate && !items.get(i).validate())
         {
            validationErrors.push(items.get(i).fieldLabel);
         }
         if(items.get(i).items && !RequestUtil.validateContainer(items.get(i), aSuppressEndWait))
         {
            return false;
         }
      }
      if(validationErrors.length > 0)
      {
         var message = "The following fields are invalid: ";
         var missingFieldName = false;
         for(i=0;i<validationErrors.length;i++)
         {
            if(i>0)
            {
               message += ", ";
            }
            if(validationErrors[i])
            {
               message += validationErrors[i];
            }
            else
            {
               missingFieldName = true;
            }
         }
         message += ".";
         if(uiController && !aSuppressEndWait)
         {
            uiController.endWait();
         }
         Ext.Msg.alert("Validation", (missingFieldName ? validationErrors.length + (validationErrors.length == 1 ? " field is invalid." : " fields are invalid.") : message));
      }
      return validationErrors.length == 0;
   },

   promptForCredentials: function(aCrnInstanceNodeOrId, aCallback)
   {
      if(uiController && uiController.contentPanelContainer)
      {
         uiController.contentPanelContainer.removeAll(true);
         var emptyTabPanel = new Ext.TabPanel();
         uiController.contentPanelContainer.add(emptyTabPanel);
         uiController.contentPanelContainer.getLayout().setActiveItem(emptyTabPanel);
      }

      var crnInstanceId;
      var crnInstanceNode;
      if(aCrnInstanceNodeOrId.attributes)
      {
         crnInstanceId = aCrnInstanceNodeOrId.attributes.crnInstanceId;
         crnInstanceNode = aCrnInstanceNodeOrId;
      }
      else
      {
         crnInstanceId = aCrnInstanceNodeOrId;
         crnInstanceNode = uiController.crnInstanceNodes[aCrnInstanceNodeOrId];
      }

      var namespacesStore = new Ext.data.SimpleStore({
         url: ServerEnvironment.contextPath + '/secure/actions/instance/getCrnInstanceNamespaces.do?crnInstanceId=' + crnInstanceId,
         fields:[
            {name: 'namespaceName', type:'string'},
            {name: 'namespaceId', type:'string'}
         ]
      });

      var namespacesCombo = new Ext.form.ComboBox({
         store: namespacesStore,
         fieldLabel: 'Namespace',
         allowBlank: false,
         blankText: 'required',
         editable: true,
         triggerAction: 'all',
         displayField: 'namespaceName',
         valueField: 'namespaceId',
         emptyText: 'Select a Namespace',
         forceSelect: true,
         mode: 'remote',
         width: 140
      });

      var usernameField = new Ext.form.TextField({
         fieldLabel: 'Username',
         allowBlank: false,
         width: 140
      });

      var passwordField = new Ext.form.TextField({
         fieldLabel: 'Password',
         inputType: 'password',
         allowBlank: false,
         width: 140
      });

      if(!uiController.credentialsWindow || !uiController.credentialsWindow.isVisible())
      {
         uiController.credentialsWindow = new Ext.Window({
            title: 'Please login to ' + crnInstanceNode.attributes.text,
            height: 150,
            width: 275,
            layout: 'form',
            closable: false,
            modal: true,
            constrainHeader: true,
            items: [
               namespacesCombo,
               usernameField,
               passwordField
            ],
            buttons:[{
               text :('OK'),
               handler: function()
               {
                  uiController.startWait();
                  RequestUtil.request({
                     url: '/secure/actions/versionControl/validateCredentials.do',
                     params: {
                        crnInstanceId: crnInstanceId,
                        namespace: namespacesCombo.getValue(),
                        username: usernameField.getValue(),
                        password: passwordField.getValue()
                     },
                     suppressAuthCheck: true,
                     success: function(aValidateCredentialsResponse)
                     {
                        var responseObject = Ext.decode(aValidateCredentialsResponse.responseText);
                        if(responseObject.capabilities)
                        {
                           RequestUtil.request({
                              url: '/secure/actions/instance/isCompatibleInstance.do',
                              params: {
                                 crnInstanceId: crnInstanceId
                              },
                              suppressAuthCheck: true,
                              success: function( aIsCompatibleInstanceResponse )
                              {
                                 var result = Ext.decode(aIsCompatibleInstanceResponse.responseText);

                                 var supportedCognosVersion = result.supportedCognosVersion;
                                 var crnVersion = result.crnVersion;

                                 crnInstanceNode.attributes.authenticated = true;
                                 crnInstanceNode.attributes.capability = responseObject.capabilities;
                                 crnInstanceNode.attributes.authCanceled = false;

                                 if(uiController.tree && crnInstanceNode.isSelected())
                                 {
                                    InstanceContent.handleSelection(crnInstanceNode);
                                 }

                                 uiController.updateLoginStatus();

                                 uiController.credentialsWindow.close();
                                 uiController.endWait();

                                 if ( !result.compatibleInstance )
                                 {
                                    Ext.Msg.alert( "Warning", "This Cognos instance's version is " + crnVersion + ", supported version is " + supportedCognosVersion + "." );
                                 }

                                 if(aCallback)
                                 {
                                    aCallback();
                                 }
                              }
                           });

                        }
                        else if(responseObject.invalid)
                        {
                           uiController.endWait();
                           Ext.Msg.alert("Error", "Invalid credentials.");
                        }
                        else
                        {
                           uiController.endWait();
                           Ext.Msg.alert("Error", "Could not validate credentials.");
                        }
                     }
                  });
               }
            },{
               text: 'Cancel',
               handler: function()
               {
                  crnInstanceNode.attributes.authenticated = false;
                  crnInstanceNode.attributes.authCanceled = true;
                  uiController.credentialsWindow.close();
               }
            }]
         });
         uiController.endWait();
         uiController.credentialsWindow.show();
      }
      return false;
   },

   handleGenericFail: function(aForm, aAction)
   {
      if(RequestUtil.handleTimeout(aAction))
      {
         return true;
      }
      else if(aAction.result)
      {
         Ext.Msg.alert("Operation failed", aAction.result['errorMessage']);
      }
      else if(aAction.failureType && 'connect' == aAction.failureType)
      {
         Ext.Msg.alert("Operation failed", "There was an error of type [" + aAction.failureType + "].  Connection to the server may have timed out.");
      }
      else if("server" === aAction.failureType && aAction.response.responseText.indexOf('Login Page') != -1)
      {
         RequestUtil.processSessionTimeout();
      }
      else if(aAction.failureType)
      {
         Ext.Msg.alert("Operation failed", "There was an error of type [" + aAction.failureType + "]");
      }

      return false;
   },

   handleDataProxyException: function(aProxy, aType, aAction, aError, aResponse, aErrorMessage)
   {

      if(aResponse.responseText)
      {
         try
         {
            var responseObject = Ext.decode(aResponse.responseText);
            if(responseObject.errorMessage)
            {
               if(responseObject.exceptionReportId)
               {
                  if(!aConfig.onException || aConfig.onException(responseObject))
                  {
                     ExceptionReportWindow.launch(responseObject);
                  }
               }
               else
               {
                  if(!aConfig.onErrorMessage || aConfig.onErrorMessage(responseObject.errorMessage))
                  {
                     Ext.Msg.alert("Error", responseObject.errorMessage);
                  }
               }
               return;
            }
            else if(responseObject.validationMessage)
            {
               if(!aConfig.onValidationMessage || aConfig.onValidationMessage(responseObject.validationMessage))
               {
                  Ext.Msg.alert("Validation", responseObject.validationMessage);
               }
               return;
            }
         }
         catch(e)
         {
            if(RequestUtil.handleTimeout(aProxy, aType, aAction, aError, aResponse, aErrorMessage))
            {
               return;
            }
         }
      }
   },

   pingUserSession: function(aSuccessCallBack, aCallBackScope)
   {
      Ext.Ajax.request({
         url: ServerEnvironment.contextPath + "/secure/blank.html",
         scope: this,
         success: function(response, opts)
         {
            if(!this.handleRequestTimeout(response))
            {
               aSuccessCallBack.call(aCallBackScope);
            }
         }
      });
   },

   handleRequestTimeout: function(aResponse)
   {
      //todo surely there's a better way to detect session timeouts
      if(aResponse && aResponse.responseText && aResponse.responseText.indexOf('Login Page') != -1)
      {
         //todo we could pop up an ext dialog to log in (would need ssl?)
         RequestUtil.processSessionTimeout();
         return true;
      }
      return false;
   },

   handleTimeout: function(aProxy, aType, aAction, aError, aResponse, aErrorMessage)
   {
      return this.handleRequestTimeout(aResponse);
   },

   processSessionTimeout: function()
   {
     //Expired session, redirect to login
     Ext.Msg.alert("Session Expired", "The session has expired.  You will be redirected to the login page.", function(){

         var loginPageURL = ServerEnvironment.baseUrl + "/actions/loginPromptAction.do?sessionExpired=true";
         if(!window.isADFDialog)
         {
            location.href = loginPageURL;
         }
         else
         {
             window.opener.location.href = loginPageURL;
             window.opener.focus();
             window.close();
         }
     });
   }
};
