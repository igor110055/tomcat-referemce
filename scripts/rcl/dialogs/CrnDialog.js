/**
    Copyright 2001-2005, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: CrnDialog.js 8277 2013-04-25 20:39:21Z dk $




//-----------------------------------------------------------------------------
/**
 * CrnSettingsAndCredentials
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function CrnSettingsAndCredentials (aEndPoint, aNameSpace, aUserId, aPassword)
{
   this.endPoint = aEndPoint;
   this.nameSpace = aNameSpace;
   this.userId = aUserId;
   this.password = aPassword;
   this.encryptedCredentials = null;
}

CrnSettingsAndCredentials.prototype.asUrlParams = function()
{
   var params = "&crnEndPoint=" + this.endPoint;

   if (this.encryptedCredentials)
   {
      params += "&encryptedCredentials=" + this.encryptedCredentials;
   }
   else
   {
      params += "&crnNameSpace=" + this.nameSpace +
                "&crnUserId=" + this.userId +
                "&crnPassword=" + this.password;
   }

   return params;
};

CrnSettingsAndCredentials.prototype.asFormFields = function(aForm)
{
   this.createHiddenInput("crnEndPoint", this.endPoint, aForm);


   if (this.encryptedCredentials)
   {
      this.createHiddenInput("encryptedCredentials", this.encryptedCredentials, aForm);
   }
   else
   {
      this.createHiddenInput("crnNameSpace", this.nameSpace, aForm);
      this.createHiddenInput("crnUserId", this.userId, aForm);
      this.createHiddenInput("crnPassword", this.password, aForm);
   }
};


//-----------------------------------------------------------------------------
/**
 * CascadeContextItem
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function CascadeContext ()
{
   this.cascadeItems = {};
}

CascadeContext.prototype.addItem = function (aRef, aValues)
{
   this.cascadeItems[aRef] = new CascadeContext.Item(aRef, aValues);
};

CascadeContext.prototype.toXml = function ()
{
   var xml = "<cascadeContext>";

   var key;
   var eachItem;
   for (key in this.cascadeItems)
   {
      eachItem = this.cascadeItems[key];

      if (eachItem.values && eachItem.values.length > 0)
      {
         xml += eachItem.toXml();
      }
   }

   xml += "</cascadeContext>";
   return xml;
};


//-----------------------------------------------------------------------------
/**
 * CascadeContext.Item
 *
 * @constructor
 * @class
 * @param aRef - the model ref
 * @param aValues - array of values...
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/

CascadeContext.Item = function (aRef, aValues)
{
   this.ref = aRef;
   this.values = aValues;
};

CascadeContext.Item.prototype.toXml = function()
{
   var xml = '<item ref="' + this.ref + '">';
   // TODO: string concat is slow in JS too...
   this.values.each(function (anItem) {
      xml += "<value>" + anItem + "</value>";
   });
   xml += "</item>";
   return xml;
}




//-----------------------------------------------------------------------------
/**
 * DialogBoxStyle
 *
 * @constructor
 * @class
 * @author Meenakshi Gupta (mgupta@focus-technologies.com)
 **/
function DialogBoxStyle( veilOverlayClassName, veilOverlayStyleWidth, veilOverlayStyleHeight)
{
   this.veilOverlayClassName = veilOverlayClassName;
   this.veilOverlayStyleWidth = veilOverlayStyleWidth;
   this.veilOverlayStyleHeight= veilOverlayStyleHeight;
}


//-----------------------------------------------------------------------------
/**
 * CrnDialog
 *
 * @constructor
 * @class
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function CrnDialog ()
{
   this.dialogDiv = null;
   this.jtDialogBox = null;


   this.dialogListener = null;
   this.selectedValues = null;
   this.wasCancelled = false;

   this.dialogType = null;
   this.dialogBoxStyle = null;

   this.hiddenSelects = [];

   //--- defaults to null, but can be overriden with the login method...
   this.credentials = null;

   this.positionX = -1;
   this.positionY = -1;

   this.document = document;
}

/**
 * optional - use this method if you need to login to a different crn instance
 * or user different credentials than you're currently logged into RCL with.
 **/
CrnDialog.prototype.login = function (aEndPoint, aNameSpace, aUserId, aPassword)
{
   var cred = new CrnSettingsAndCredentials(aEndPoint, aNameSpace, aUserId, aPassword);
   if (this.verifyCredentials(cred))
   {
      this.credentials = cred;
      return true;
   }
   else
   {
      alert("sorry, the Crn connection information you provided is not valid");
      return false;
   }
};

/**
 * optional - use this method if you need to login to a different crn instance
 * or user different credentials than you're currently logged into RCL with.
 **/
CrnDialog.prototype.loginEncrypted = function (aEndPoint, aEncryptedCredentials)
{
   var cred = new CrnSettingsAndCredentials(aEndPoint, null, null, null);
   cred.encryptedCredentials = aEncryptedCredentials;

   if (this.verifyCredentials(cred))
   {
      this.credentials = cred;
      return true;
   }
   else
   {
      alert("sorry, the Crn connection information you provided is not valid");
      return false;
   }
};


CrnDialog.prototype.verifyCredentials = function(aCredentials)
{

   //--- do async request to verify credentials...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.contextPath + "/secure/actions/verifyCrnCredentials.do";

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
      try
      {
         // will be something like :
         //       validationResult = true;
         eval(anXmlHttpRequest.responseText);

         this.validationResult = validationResult;
      }
      catch (e)
      {
         var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
         var writeString = anXmlHttpRequest.responseText;
         writeString = serverEnv + writeString;

         if (writeString.indexOf("<html>") == -1)
         {
            alert("A " + e.name + " occured evaluting the javascript.\n\nError message:  " + e.message + "\n\nStatement:  " + anXmlHttpRequest.responseText);
         }
         else
         {
            window.document.write(writeString);
         }
      }
   });

   xmlHttpRequest.open("POST", url, false);

   xmlHttpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
   );


   xmlHttpRequest.send(aCredentials.asUrlParams());
   if( !is_ie )
   {
      // firefox doesn't do synchronous calls with callback
      handler.callBackFn( xmlHttpRequest );
   }

   return handler.validationResult;
};


/**
 * launch a file chooser dialog (folders on left, files on right)
 **/
CrnDialog.prototype.showFileChooserDialog = function (aTitle, aStartFromFolder, aPreSelectedXpath, aIsMultiSelect, aObjectTypes, aIsMultiPopup)
{
   this.dialogType = "fileChooser";

   if (!JsUtil.isGood(aObjectTypes) || aObjectTypes.length == 0)
   {
      aObjectTypes = ["*"];
   }

   var extraParams = '';
   for (var i = 0; i < aObjectTypes.length; ++i)
   {
      extraParams += "&objectType=" + aObjectTypes[i];
   }

   this._launchPathPickerDialog(aTitle, aStartFromFolder, aPreSelectedXpath, aIsMultiSelect, aIsMultiPopup, extraParams);
};

/**
 * launch a folder chooser dialog (folders only, no files)
 **/
CrnDialog.prototype.showFolderChooserDialog = function (aTitle, aStartFromFolder, aPreSelectedXpath, aIsMultiSelect, aIsMultiPopup)
{
   this.dialogType = "folderChooser";
   this._launchPathPickerDialog(aTitle, aStartFromFolder, aPreSelectedXpath,  aIsMultiSelect, aIsMultiPopup, "");
};

/**
 * Launch the EXT version of the CRN picker
 *
 * @param aRootPath Root path from which to start searching
 * @param aObjectTypes Array of object types which should be shown. null selects all object types
 * @param aCallback function to be invoked with the search path of the selected object
 */
CrnDialog.prototype.showExtChooserDialog = function (aRootPath, aObjectTypes, aCallback)
{
   var simpleRootName;
   if (aRootPath == null)
   {
      simpleRootName = "/";
   }
   else if (aRootPath == "/content")
   {
      simpleRootName = applicationResources.getProperty('dialogs.picker.public.folders');
   }
   else
   {
      simpleRootName = aRootPath.substring(aRootPath.lastIndexOf("@name=") + 7, aRootPath.length - 2);
   }

   var tree = new Ext.tree.TreePanel(
   {
      rootVisible: aRootPath,
      loader: new Ext.tree.TreeLoader({
         dataUrl: ServerEnvironment.baseUrl + "/secure/actions/ext/crnDialog.do",
         listeners: {
            beforeload: function(aTreeLoader, aNode)
            {

               // I shouldn't have to do this. Apparently ext isn't handling array type parameters
               aTreeLoader.getParams = function(node)
               {
                  var buf = [], bp = this.baseParams;
                  for (var key in bp)
                  {
                     if (typeof bp[key] != "function")
                     {
                        if (typeof bp[key] == "object")
                        {
                           for (var index = 0; index < bp[key].length; index++)
                           {
                              buf.push(encodeURIComponent(key), "=", encodeURIComponent(bp[key][index]), "&");
                           }
                        }
                        else
                        {
                           buf.push(encodeURIComponent(key), "=", encodeURIComponent(bp[key]), "&");
                        }
                     }
                  }
                  buf.push("node=", encodeURIComponent(node.id));
                  return buf.join("");
               };

               if (this.credentials)
               {
                  aTreeLoader.baseParams.crnEndPoint = this.credentials.endPoint;
                  aTreeLoader.baseParams.crnNameSpace = this.credentials.nameSpace;
                  aTreeLoader.baseParams.crnUserName = this.credentials.userId;
                  aTreeLoader.baseParams.crnPassword = this.credentials.password;
               }

               aTreeLoader.baseParams.startFromPath = aNode.attributes.searchPath;
               aTreeLoader.baseParams.objectType = aObjectTypes;
            },

            loadexception: function(aTreeLoader, aNode, aResponse)
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
      }),
      root: new Ext.tree.AsyncTreeNode({
         text: simpleRootName.replace("<", ""),
         searchPath: aRootPath,
         icon: ServerEnvironment.baseUrl + "/images/silkIcons/folder.png"
      }),
      autoScroll: true
   });

   new Ext.tree.TreeSorter(tree,
   {
      caseSensitive  : false,
      dir            : 'ASC',
      folderSort     : true
   });

   var cognosPickerWindow = new Ext.Window({
      autoScroll: true,
      modal: true,
      title: applicationResources.getProperty('dialogs.picker.title'),
      closable: true,
      layout      : 'fit',
      width       : 300,
      height      : 400,
      closeAction : 'close',
      plain       : true,
      items       :[tree],
      buttons     : [
         {
            text     : applicationResources.getProperty('button.Ok'),
            handler  : function()
            {
               var node = tree.getSelectionModel().getSelectedNode();
               if (JsUtil.isGood(node))
               {
                  if (aCallback)
                  {
                     aCallback(node.attributes.searchPath);
                  }
               }
               cognosPickerWindow.close();
            }
         },
         {
            text    : applicationResources.getProperty('button.close'),
            handler : function()
            {
               cognosPickerWindow.close();
            }
         }
      ]

   });
   cognosPickerWindow.show();
};

/**
 * @private
 **/
CrnDialog.prototype._launchPathPickerDialog = function (aTitle, aStartFromFolder, aPreSelectedXpath, aIsMultiSelect, aIsMultiPopup, aExtraParams)
{
   this.dialogDiv = document.createElement("div");
   this.dialogDiv.className = "dialogDiv " + this.dialogType;

   document.crnDialog = this;

   var onload = "document.crnDialog.installDialogListener();";

   var preSelect = (JsUtil.isGood(aPreSelectedXpath)) ? "&currentSelection=" + encodeURIComponent( aPreSelectedXpath ) : '';


   var src = ServerEnvironment.baseUrl + '/secure/actions/crnDialog.do' +
             '?dialogType=' + this.dialogType +
             '&startFromPath=' + encodeURIComponent(aStartFromFolder) +
             "&multiSelect=" + aIsMultiSelect +
             preSelect +
             this.getCrnInfoParams() +
             aExtraParams;

   this.dialogDiv.innerHTML =
      '<iframe src="' + src + '" onload="' + onload + '"></iframe>'

   this.showDialog(aTitle, this.dialogDiv, aIsMultiPopup);
};



/**
 * show the value picker dialog...
 * @param aTitle - the title of the dialog
 * @param aQueryItemRef - a ref to the value query item
 * @param aDisplayValueRef - a ref to the display text query item
 * @param aIsMultiSelect - allow multi-select ?
 * @param aInitialFilter - initial value for filter
 * @param aPackagePath - the package path
 * @param aItemsPerPage - # of items per page
 * @param aFilterType - the type of filter to apply, one of {"raw", "value", "displayValue" }
 * (defaults to "displayValue")
 * @param aExtraParams - extra params that will be propagated down with the param value request
 * @param aInitialSelections - initial selections to start with, this must be an array of objects
 * that have at least the following two properties { "value", "text" }
 * @param aCascadeContext - the cascade context, if any
 * @param aMaxNumberOfSelections - the max # of selections that can be selected (defaults to 1000)
 **/
CrnDialog.prototype.showValuePickerDialog = function (aTitle, aQueryItemRef, aDisplayValueRef, aIsMultiSelect,
                                                      aInitialFilter, aPackagePath, aItemsPerPage, aFilterType,
                                                      aExtraParams, aInitialSelections, aCascadeContext,
                                                      aMaxNumberOfSelections, aIsMultiPopup)
{
   //--- Default values for optional parameters
   aMaxNumberOfSelections = JsUtil.isUndefined(aMaxNumberOfSelections) || aMaxNumberOfSelections == 0  ? 1000 : aMaxNumberOfSelections;


   this.dialogDiv = document.createElement("div");
   this.dialogDiv.className = "dialogDiv queryItemValuePicker";

   document.crnDialog = this;

   var onload = "document.crnDialog.installDialogListener();";

   // this is a temp variable (used after dialog has initialized to set values, then nulled out)
   this.initialSelections = aInitialSelections;



   //--- create iframe...
   var iframeId = "valuePickerIframe";
   var oldVersion = this.document.getElementById(iframeId);
   var iframe = this.document.createElement("iframe");
   iframe.setAttribute("id", iframeId);

   if (oldVersion)
   {
      this.dialogDiv.replaceChild(oldVersion, iframe);
   }
   else
   {
      this.dialogDiv.appendChild(iframe);
   }




   var title =  JsUtil.isGood(aTitle) ? aTitle : "Pick from the supplied values.";
   
   this.showDialog(title, this.dialogDiv, aIsMultiPopup);
   

   var fn = function () {

      //--- write form to iframe...
      var iframe = this.document.getElementById("valuePickerIframe");

      Event.observe(iframe, "load", function(anEvent) {
         this.installDialogListener();
      }.bind(this), false);


      
      var iframeDoc = iframe.contentWindow.document;

      var vpForm = iframeDoc.createElement("form");
      vpForm.action = ServerEnvironment.baseUrl + '/secure/actions/queryItemValuePickerDialog.do';
      vpForm.method = "POST";

      this.createHiddenInput(iframeDoc, "packagePath", aPackagePath, vpForm);
      this.createHiddenInput(iframeDoc, "queryItemRef", aQueryItemRef, vpForm);
      this.createHiddenInput(iframeDoc, "multiSelect", aIsMultiSelect, vpForm);
      this.createHiddenInput(iframeDoc, "maxNumberOfSelections", aMaxNumberOfSelections, vpForm);

      if (JsUtil.isGood(aDisplayValueRef))
      {
         this.createHiddenInput(iframeDoc, "displayValueRef", aDisplayValueRef, vpForm);
      }

      if (JsUtil.isGood(aInitialFilter))
      {
         this.createHiddenInput(iframeDoc, "filterBy", aInitialFilter, vpForm);
      }

      if (JsUtil.isGood(aItemsPerPage))
      {
         this.createHiddenInput(iframeDoc, "itemsPerPage", aItemsPerPage, vpForm);
      }

      if (JsUtil.isGood(aFilterType))
      {
         this.createHiddenInput(iframeDoc, "filterType", aFilterType, vpForm);
      }

      if (JsUtil.isGood(aExtraParams))
      {
         this.createHiddenInput(iframeDoc, "extraParams", aExtraParams, vpForm);
      }

      if (JsUtil.isGood(aCascadeContext))
      {
         this.createHiddenInput(iframeDoc, "cascadeContextXml", aCascadeContext.toXml(), vpForm);
      }

      if (this.credentials)
      {
         this.credentials.asFormFields(vpForm);
      }



      iframeDoc.body.appendChild(vpForm);
      vpForm.submit();

   }.bind(this);



   setTimeout(fn, 1000);
};



CrnDialog.prototype.createHiddenInput = function (aDocument, aName, aValue, aAppendTo)
{
   var input = aDocument.createElement("input");
   input.type = "hidden";
   input.name = aName;
   input.value = aValue;

   aAppendTo.appendChild(input);
};


CrnDialog.prototype.setDefaultPosition = function (aXposition, aYposition)
{
   this.positionX = aXposition;
   this.positionY = aYposition;
};

/**
 * private method
 */
CrnDialog.prototype.showDialog = function (aTitle, aDialogDiv, aIsMultiPopup)
{
   this.hideAllSelects();

   var dialogDivWrapper = document.createElement("div");
   dialogDivWrapper.appendChild(aDialogDiv);
   // if multiple popups are used, the first one will remove the cloak div.  This sets it to be removed by the first popup.
   if(aIsMultiPopup != null)
      this.jtDialogBox = new jt_DialogBox(!aIsMultiPopup);
   else
      this.jtDialogBox = new jt_DialogBox(true);

   this.jtDialogBox.setCallOK(document.crnDialog.disposeDialog);
   this.jtDialogBox.setCallCancel(document.crnDialog.disposeDialog);
   this.jtDialogBox.setTitle(aTitle);
   this.jtDialogBox.setContent(dialogDivWrapper.innerHTML);

   this.jtDialogBox.show();
   this.jtDialogBox.moveTo(this.positionX, this.positionY);

   if ( JsUtil.isGood( this.dialogBoxStyle ) )
   {
      if ( JsUtil.isGood( this.dialogBoxStyle.veilOverlayClassName ) )
      {
         jt_DialogBox.veilOverlay.className = this.dialogBoxStyle.veilOverlayClassName;
      }

      //*****
      // NEXT TWO LINES ARE NEEDED TO GET THE DISABLED BACKGROUND IN FIREFOX
      //********
      if ( JsUtil.isGood( this.dialogBoxStyle.veilOverlayStyleWidth ) )
      {
         jt_DialogBox.veilOverlay.style.width = this.dialogBoxStyle.veilOverlayStyleWidth;
      }

      if ( JsUtil.isGood( this.dialogBoxStyle.veilOverlayStyleHeight ) )
      {
         jt_DialogBox.veilOverlay.style.height = this.dialogBoxStyle.veilOverlayStyleHeight;
      }

   }
};


CrnDialog.prototype.hideAllSelects = function()
{
   var sels = document.getElementsByTagName("select");
   for (var i = 0; i < sels.length; ++i)
   {
      if (sels[i].style.display != "none")
      {
         sels[i].oldDisplay = sels[i].style.display;
         sels[i].style.display = "none";

         this.hiddenSelects.push(sels[i]);
      }
   }
};

CrnDialog.prototype.restoreHiddenSelects= function()
{
   for (var i = 0; i < this.hiddenSelects.length; ++i)
   {
      this.hiddenSelects[i].style.display = this.hiddenSelects[i].oldDisplay;
   }
   this.hiddenSelects = [];
};


CrnDialog.prototype.getCrnInfoParams = function()
{

   if (this.credentials)
   {
      return this.credentials.asUrlParams();
   }
   else
   {
      return '';
   }
};

CrnDialog.prototype.installDialogListener = function()
{
   this.iframe = this.jtDialogBox.container.getElementsByTagName("iframe")[0];

   if (this.iframe.contentWindow.dialogUiController)
   {
      this.iframe.contentWindow.dialogUiController.setDialogListener(this);
      this.iframe.contentWindow.dialogUiController.setInitialSelections(this.initialSelections);
      this.initialSelections = null;
   }
};



/**
 * someone's listening to this picker...
 **/
CrnDialog.prototype.setDialogListener = function(aListener)
{
   this.dialogListener = aListener;
};

/**
 * This method is global and installed with jtDialogBox to listen for close
 * Since this method will be called from jtDialogBox.hide(), there are 2 entry points
 * 1. CrnDialog.prototype.dialogFinished
 * 2. when the user clicks the close button from the title bar, jtDialogBox internally calls jtDialogBox.hide()
 * For the second case CrnDialog.prototype.dialogFinished is called from for proper notification of dialg listeners
 **/
CrnDialog.prototype.disposeDialog = function()
{
   //--- safe guard to avoid recursive calls
   if (JsUtil.isGood(document.crnDialog))
   {
      if (JsUtil.isGood(document.crnDialog.jtDialogBox))
      {
         //--- the X in the upper right hand corner was pressed...
         document.crnDialog.dialogFinished("Cancel", null);
      }
   }
};

/**
* child dialog is calling us back, telling us that it is done.
**/
CrnDialog.prototype.dialogFinished = function(aGesture, aDialogUiController)
{
   if (JsUtil.isGood(document.crnDialog))
   {
      if (JsUtil.isGood(document.crnDialog.jtDialogBox))
      {
         this.restoreHiddenSelects();
         document.crnDialog = null;

         this.wasCancelled = (aGesture == "Cancel");

         if (this.wasCancelled == false)
         {
            this.selectedValues = aDialogUiController.getDialogResults();
         }

         this.dialogListener.dialogFinished(this);

         //--- remove the dialog div...
         //--- use temp variable and reset this.jtDialogBox to avoid recursive call between jtDialogBox.hide() and CrnDialog.prototype.disposeDialog
         var temp = this.jtDialogBox;
         this.jtDialogBox = null;

         temp.destroy();

         
         // complete hack for IE - see ticket #936
         if (is_ie)
            JsUtil.focusFirstTextInput(this.document);
      }
   }
};

