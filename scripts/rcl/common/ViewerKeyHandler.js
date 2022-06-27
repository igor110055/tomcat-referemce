/**
 * Baseclass key event handler for wizard pages.
 *
 * @author Cory Williamson
 *
 **/



//-----------------------------------------------------------------------

function AbstractViewerKeyHandler()
{

}

AbstractViewerKeyHandler.prototype.changeNextTab = function()
{
   alert("You must implement c from AbstractViewerKeyHandler");
};

AbstractViewerKeyHandler.prototype.changePreviousTab = function()
{
   alert("You must implement previousPage from AbstractViewerKeyHandler");
};

AbstractViewerKeyHandler.prototype.getBrowseOutputWindow = function()
{
   alert("You must implement browseOutputWindow from AbstractViewerKeyHandler");
};


//-----------------------------------------------------------------------

function ViewerKeyHandler(anAbstractHandler, anAbstractReiUiController)
{
   this.abstractHandler = anAbstractHandler;
   this.abstractReiUiController = anAbstractReiUiController;
}

ViewerKeyHandler.prototype.init = function(aDocument)
{
   this.handleKeyEventBind = this.handleKeyEvent.bind(this);
   if (aDocument != null)
   {
      Event.observe(aDocument, 'keydown', this.handleKeyEventBind, true);
   }
   else
   {
      Event.observe(document, 'keydown', this.handleKeyEventBind, true);
   }

   this.loadKeyCodes();
};

ViewerKeyHandler.prototype.loadKeyCodes = function()
{
   this.tabKey =  applicationResources.getProperty("keycode.report.viewer.tab");
   this.saveAsKey = applicationResources.getProperty("keycode.report.viewer.save.as");
   this.closeTabKey = applicationResources.getProperty("keycode.report.viewer.close.tab");
   this.downKey = applicationResources.getProperty("keycode.report.viewer.change.format.down");
   this.upKey = applicationResources.getProperty("keycode.report.viewer.change.format.up");
   this.detachTabKey = applicationResources.getProperty("keycode.report.viewer.detach.tab");
   this.browseOutputKey = applicationResources.getProperty("keycode.common.browse.output");
};


ViewerKeyHandler.prototype.handleKeyEvent = function(anEvent)
{
   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;
   var altKey = anEvent.altKey;
   var keyCode = anEvent.keyCode;

   //---ctrl + tab to go to next tab
   if (ctrlKey && this.tabKey == keyCode && !shiftKey)
   {
      this.abstractHandler.changeNextTab();
   }
   //---ctrl + tab to go to previous tab
   else if (ctrlKey && this.tabKey == keyCode && shiftKey)
   {
      this.abstractHandler.changePreviousTab();
   }
   else if (ctrlKey && altKey && this.saveAsKey == keyCode && !shiftKey)
   {
      this.abstractReiUiController.saveAs();
   }
   else if (ctrlKey && this.closeTabKey == keyCode && !shiftKey)
   {
      this.abstractReiUiController.removeCurrentTab();
   }
   else if (ctrlKey && altKey && (this.downKey == keyCode || this.upKey == keyCode) && !shiftKey)
   {
      this.abstractReiUiController.navigateReportFormats();
   }
   else if (ctrlKey && altKey && this.detachTabKey == keyCode && !shiftKey)
   {
      this.abstractReiUiController.detachCurrentTab();
   }
   //---b to browse report output on parent
   else if (ctrlKey && altKey && this.browseOutputKey == keyCode && !shiftKey)
   {
      var numDays;
      var url = ServerEnvironment.baseUrl + "/secure/actions/browseReportInstances.do?aNumberOfPastDays=" + numDays;
      var browseWindow = this.abstractHandler.getBrowseOutputWindow();
      browseWindow.location.href = url;
      browseWindow.focus();
   }
};

