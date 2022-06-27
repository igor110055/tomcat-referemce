function SelectFieldDisplayController()
{
   this.hiddenSelects = new Array();
}

SelectFieldDisplayController._instance = new SelectFieldDisplayController();

SelectFieldDisplayController.getInstance = function()
{
   return SelectFieldDisplayController._instance;
};

SelectFieldDisplayController.prototype.hideAllSelects = function ()
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

SelectFieldDisplayController.prototype.restoreHiddenSelects = function ()
{
   for (var i = 0; i < this.hiddenSelects.length; ++i)
   {
      this.hiddenSelects[i].style.display = this.hiddenSelects[i].oldDisplay;
   }
   this.hiddenSelects = [];
};


/**
 * Abstract baseclass for UI controllers.
 *
 * @author Lance Hankins
 *
 **/


//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for all RCL UI Controllers
 * @constructor
 **/
function AbstractUiController(aDocument)
{
   if (arguments.length > 0)
   {
      this.document = aDocument;
      this.document.uiController = this;

      //--- make sure to null out this reference when the doc is being unloaded...
      DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
         uiController.document.uiController = null;
         uiController.document = null;
      });




      this.hiddenSelects = [];

      this.pleaseWaitDiv = null;
   }
}


AbstractUiController.prototype.getFrameSetUiController = function()
{
   if (top.rclFrameSetUiController)
      return top.rclFrameSetUiController;

   // TODO: handle various other situations (e.g. modal dialog or popup window)...
//   alert("getFrameSetUiController failed");
   window.status = "getFrameSetUiController failed";
};


/**
 * generally called as the result of async XmlHttpRequest call...
 **/
AbstractUiController.prototype.setServerInfoMessage = function(aMessage)
{
   FadeMessageController.getInstance().showFadeMessage(aMessage, 3000);
};

/**
 * refresh the currently viewed page...
 **/
AbstractUiController.prototype.refreshPage = function()
{
   this.startPleaseWaitDiv(null, applicationResources.getProperty("general.loading"));
   window.location.href = window.location.href;
};

/**
 * changes the url currently displayed in this document...
 **/
AbstractUiController.prototype.changeUrl = function(aLocation)
{
   this.startPleaseWaitDiv(null, applicationResources.getProperty("general.loading"));
   window.location.href = aLocation;
};


/**
 * used to temporarily hide all select elements on this page
 **/
AbstractUiController.prototype.hideAllSelects = function ()
{
   var sels = this.document.getElementsByTagName("select");
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

/**
 * restores any hidden selects on this page...
 **/
AbstractUiController.prototype.restoreHiddenSelects = function ()
{
   for (var i = 0; i < this.hiddenSelects.length; ++i)
   {
      this.hiddenSelects[i].style.display = this.hiddenSelects[i].oldDisplay;
   }
   this.hiddenSelects = [];
};


AbstractUiController.prototype.startPleaseWaitDiv = function (aDomId, aMessage)
{
   if (aDomId == null && is_ie && $('contentShell'))
   {
      aDomId = "contentShell";
   }

   this.pleaseWaitDiv = new PleaseWaitDiv(aDomId, aMessage);
   this.pleaseWaitDiv.begin();
};

AbstractUiController.prototype.endPleaseWaitDiv = function ()
{
   this.pleaseWaitDiv.end();
};







//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for UI Controllers that are visible in the
 * Workspace portion of the UI.
 *
 * @constructor
 **/
function AbstractWorkspaceUiController(aDocument)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);
      this.propertiesPanelExpanded = true;
      this.propertyPanelResizeInProgress = true;

   }
}

AbstractWorkspaceUiController.prototype = new AbstractUiController();
AbstractWorkspaceUiController.prototype.constructor = AbstractWorkspaceUiController;
AbstractWorkspaceUiController.superclass = AbstractUiController.prototype;




AbstractWorkspaceUiController.prototype.setPropertiesPanelUrl = function(aUrl)
{
   var fsUiController = this.getFrameSetUiController();

   if (fsUiController)
   {
      fsUiController.showPropertiesPanel();
      fsUiController.changeWorkSpacePropertiesUrl(aUrl);
   }
};

/**
* I create ext buttons used for the button bar
*
**/
AbstractWorkspaceUiController.prototype.createButton = function(aButtonId, aButtonIcon, aHandler, aButtonName)
{
   return {
            id: aButtonId,
            text: aButtonName == null ? "" : aButtonName,
            handler: aHandler,
            scope: this,
//            tooltip: {text:'This is a QuickTip with autoHide set to false and a title', title:'Tip Title', autoHide:false},
            cls: 'x-btn-text-icon',
            icon:  ServerEnvironment.baseUrl + "/images/bbar_icons/" + aButtonIcon
       }
};

/**
 * This method is wired to the onresize handler for the frame/body.  It adjusts
 * the height values for the appropriate overflow container in the concrete JSP.
 * NOTE: this can (and will) be overriden by certain concrete UI controllers to
 * cause the overflow to happen in a container other than "bodyDiv"
 **/
AbstractWorkspaceUiController.prototype.onFrameResize = function()
{
   var newHeight;

   if (is_ie)
   {
      var geom = new BrowserGeometry();
      newHeight = (geom.height-20);
   }
   else
   {
      newHeight = top.frames["workSpace"].innerHeight - 14;
   }

   if (newHeight < 6)
      newHeight = 6;


   document.getElementById("bodyDiv").style.height = newHeight + "px";
   if (!is_ie7)
   {
      document.getElementById("contentShell").style.height = (newHeight - 6 ) + "px";
   }
};


//-----------------------------------------------------------------------------
/**
 * I am an abstract base class for UI Controllers that are visible in the
 * properties portion of the UI.
 *
 * @constructor
 **/
function AbstractPropertiesUiController(aDocument)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);
   }
}

AbstractPropertiesUiController.prototype = new AbstractUiController();
AbstractPropertiesUiController.prototype.constructor = AbstractPropertiesUiController;
AbstractPropertiesUiController.superclass = AbstractUiController.prototype;


AbstractPropertiesUiController.prototype.setPropertiesPanelUrl = function(aUrl)
{
   this.getFrameSetUiController().changeWorkSpacePropertiesUrl(aUrl);
};

/**
 * This method is wired to the onresize handler for the frame/body.  It adjusts
 * the height values for the appropriate overflow container in the concrete jsp.
 **/
AbstractPropertiesUiController.prototype.onFrameResize = function()
{
   var newHeight;

   if (is_ie)
   {
      var geom = new BrowserGeometry();
      newHeight = geom.height-6;
   }
   else
   {
      newHeight = top.frames["workspaceProperties"].innerHeight -6;
   }


   if (newHeight < 6)
      newHeight = 6;


   var bodyDiv = document.getElementById("bodyDiv");
   bodyDiv.style.height = newHeight + "px";

   var contentShell = document.getElementById("contentShell");

   if (is_ie6)
   {
      contentShell.style.height = "100%";
   }
   else
   {
      contentShell.style.height = (bodyDiv.scrollHeight - 24) + "px";
   }


   //window.status = "new height [" + newHeight + "], contentShell = [" + newContentShellHeight + "]";
};


//-----------------------------------------------------------------------------
/**
 * Default implementation of workspace UI controller (no real logic here,
 * available for use on screens where you don't have any real logic that
 * neccessitates a ui controller).
 *
 * @constructor
 **/
function DefaultWorkspaceUiController(aDocument)
{
   if (arguments.length > 0)
   {
      AbstractWorkspaceUiController.prototype.constructor.call(this, aDocument);
   }
}

DefaultWorkspaceUiController.prototype = new AbstractWorkspaceUiController();
DefaultWorkspaceUiController.prototype.constructor = DefaultWorkspaceUiController;
DefaultWorkspaceUiController.superclass = AbstractWorkspaceUiController.prototype;




//-----------------------------------------------------------------------------
/**
 * Default implementation of properties UI controller (no real logic here,
 * available for use on screens where you don't have any real logic that
 * neccessitates a ui controller).
 *
 * @constructor
 **/
function DefaultPropertiesUiController(aDocument)
{
   if (arguments.length > 0)
   {
      AbstractPropertiesUiController.prototype.constructor.call(this, aDocument);
   }
}

DefaultPropertiesUiController.prototype = new AbstractPropertiesUiController();
DefaultPropertiesUiController.prototype.constructor = DefaultPropertiesUiController;
DefaultPropertiesUiController.superclass = AbstractPropertiesUiController.prototype;



