/**
 * Baseclass key event handler for wizard pages.
 *
 * @author Cory Williamson
 *
 **/



//-----------------------------------------------------------------------

function AbstractFolderContentsKeyHandler()
{

}

AbstractFolderContentsKeyHandler.prototype.changeNextTab = function()
{
   alert("You must implement changeNextTab from AbstractFolderContentsKeyHandler");
};

AbstractFolderContentsKeyHandler.prototype.changePreviousTab = function()
{
   alert("You must implement previousPage from AbstractFolderContentsKeyHandler");
};

AbstractFolderContentsKeyHandler.prototype.getBrowseOutputWindow = function()
{
   alert("You must implement browseOutputWindow from AbstractFolderContentsKeyHandler");
};


//-----------------------------------------------------------------------

function FolderContentsKeyListener(anAbstractHandler, anAbstractReiUiController)
{
   this.abstractHandler = anAbstractHandler;
   this.abstractFolderUiController = anAbstractReiUiController;
}

FolderContentsKeyListener.prototype.init = function(aDocument)
{
   this.handleKeyEventBind = this.handleKeyEvent.bind(this);
   this.handleKeyReleaseBind = this.handleKeyRelease.bind(this);
   if (aDocument != null)
   {
      Event.observe(aDocument, 'keydown', this.handleKeyEventBind, true);
      Event.observe(aDocument, 'keyup', this.handleKeyReleaseBind, true);
   }
   else
   {
      Event.observe(document, 'keydown', this.handleKeyEventBind, true);
      Event.observe(document, 'keyup', this.handleKeyReleaseBind, true);
   }

   this.loadKeyCodes();
};

FolderContentsKeyListener.prototype.handleKeyRelease = function(anEvent)
{
   this.abstractFolderUiController.shouldReloadProperties = true;
   this.abstractFolderUiController.selectionChanged();
};

FolderContentsKeyListener.prototype.loadKeyCodes = function ()
{
   this.wizardKey = applicationResources.getProperty("keycode.folder.contents.report.wizard");
   this.deleteKey = applicationResources.getProperty("keycode.folder.contents.delete");
   this.refreshKey = applicationResources.getProperty("keycode.folder.contents.refresh");
   this.editProfileKey = applicationResources.getProperty("keycode.folder.contents.report.profile");
   this.executeKey = applicationResources.getProperty("keycode.folder.contents.execute");
   this.renameKey = applicationResources.getProperty("keycode.folder.contents.rename");
   this.downKey = applicationResources.getProperty("keycode.folder.contents.down");
   this.upKey = applicationResources.getProperty("keycode.folder.contents.up");
   this.defaultExecutionKey = applicationResources.getProperty("keycode.folder.contents.default.execution");
   this.deselectKey = applicationResources.getProperty("keycode.folder.contents.deselect");
   this.toggleSelectionKey = applicationResources.getProperty("keycode.folder.contents.toggle.selection");
   this.homeKey = applicationResources.getProperty("keycode.folder.contents.home");
   this.endKey = applicationResources.getProperty("keycode.folder.contents.end");
}


FolderContentsKeyListener.prototype.handleKeyEvent = function(anEvent)
{
   this.abstractFolderUiController.shouldReloadProperties = false;

   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;
   var altKey = anEvent.altKey;
   var keyCode = anEvent.keyCode;

   //---ctrl+alt+w

   if (ctrlKey && altKey && this.wizardKey == keyCode && !shiftKey)
   {
      this.abstractFolderUiController.openInReportWizard();
   }

   //---delete
   else if (this.deleteKey == keyCode && !(ctrlKey || shiftKey || altKey))
   {
      this.abstractFolderUiController.deleteSelectedProfiles();
   }

   //---ctrl+alt+r
   else if (ctrlKey && altKey && this.refreshKey == keyCode && !shiftKey)
   {
      this.abstractFolderUiController.refreshPage();
   }

   //---ctrl+alt+p
   else if (ctrlKey && altKey && this.editProfileKey == keyCode && !shiftKey)
   {
      this.abstractFolderUiController.editReportProfile();
   }

   //---ctrl+alt+e
   else if (ctrlKey && altKey && this.executeKey == keyCode && !shiftKey)
   {
      this.abstractFolderUiController.executeSelectedReports();
   }

   //---ctrl+alt+m
   else if (ctrlKey && altKey && this.renameKey == keyCode && !shiftKey)
   {
      this.abstractFolderUiController.renameReport();
   }

   //---down arrow
   else if (this.downKey == keyCode && !(ctrlKey || altKey))
   {
      if (this.abstractHandler.canSelect())
      {
         this.abstractHandler.handleDownSelection(shiftKey);
      }
   }

   //---up arrow
   else if (this.upKey == keyCode && !(ctrlKey || altKey))
   {
      if (this.abstractHandler.canSelect())
      {
         this.abstractHandler.handleUpSelection(shiftKey);
      }
   }

   //---enter
   else if (this.defaultExecutionKey == keyCode && !(ctrlKey || altKey || shiftKey))
   {
      this.abstractFolderUiController.processDefaultExecution();
   }

   //---escape
   else if (this.deselectKey == keyCode && !(ctrlKey || altKey || shiftKey))
   {
      this.abstractHandler.deselectItems();
   }

   //---shift+space
   else if (this.toggleSelectionKey == keyCode && shiftKey && !(ctrlKey || altKey))
   {
      if (this.abstractHandler.canSelect())
      {
         this.abstractHandler.switchCurrentSelection();
      }
   }

   //---home
   else if (this.homeKey == keyCode)
   {
      if (this.abstractHandler.canSelect())
      {
         this.abstractHandler.selectFirstItem(shiftKey);
      }
   }

   //---end
   else if (this.endKey == keyCode)
   {
      if (this.abstractHandler.canSelect())
      {
         this.abstractHandler.selectLastItem(shiftKey);
      }
   }
};