

//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the UserPreference screen...
 *
 * @constructor
 * @author Jeremy Siler
 **/
function UserPreferenceUiController(aDocument)
{
   if (arguments.length > 0)
   {
      AbstractWorkspaceUiController.prototype.constructor.call(this, aDocument);
   }
}

//--- This class extends AbstractUiController
UserPreferenceUiController.prototype = new AbstractWorkspaceUiController();
UserPreferenceUiController.prototype.constructor = UserPreferenceUiController;
UserPreferenceUiController.superclass = AbstractWorkspaceUiController.prototype;


/**
 * called once (after document is fully loaded) to initialize the user interface
 **/
UserPreferenceUiController.prototype.initUi = function()
{
   this.getFrameSetUiController().hidePropertiesPanel();
   this.onFrameResize();
};


UserPreferenceUiController.prototype.refreshNavMenu = function()
{
   parent.document.getElementById("navMenu").setAttribute("src",ServerEnvironment.contextPath+"/secure/actions/navMenu.do");    //reload navMenu
   parent.document.getElementById("topBanner").setAttribute("src",ServerEnvironment.contextPath+"/secure/actions/topBanner.do");  //reload topBanner
   document.location.reload();    //reloads user preference frame
};




/**
 * Save all preferences...
 **/
UserPreferenceUiController.prototype.saveUserPreferences = function()
{
   var url = ServerEnvironment.contextPath + "/secure/actions/saveUserPreference.do?";
   var httpParams = Form.serialize(document.forms[0]);

   var myAjax = new Ajax.Request(
			url + httpParams,
			{
            method: 'POST',
            asynchronous:false,

            onFailure : function( resp )
            {
               alert(applicationResources.getProperty("userPrefs.serverError"));
            },

            onException : function( resp )
            {
               alert(applicationResources.getProperty("userPrefs.serverError"));
            }
         });
   eval(myAjax.transport.responseText);
};

/**
 * if the user presses enter after typing in the input box, call saveUserPreferences
 **/
UserPreferenceUiController.prototype.onInputKeyPress = function(anEvent)
{
   var evt = JsUtil.normalizeEvent(anEvent);
   if (evt.keyCode == 13)
   {
      this.saveUserPreferences();
      return false;
   }
};
