/**
 Copyright 2001-2008, Focus Technologies LLC.
 All rights reserved.
 **/

// $Id: ReportWizardKeyHandler.js 7180 2010-05-12 13:25:34Z dsellari $

//-----------------------------------------------------------------------------
/**
 * I am the JavaScript key handler for Report Wizard
 *
 * @constructor
 * @author David Paul (dpaul@inmotio.com)
 **/
function ReportWizardKeyHandler(aUiController)
{
   this.controller = aUiController;
   this.init(aUiController.document);
   this.loadKeyCodes();
}

ReportWizardKeyHandler.prototype = new AbstractKeyHandler();
ReportWizardKeyHandler.prototype.constructor = ReportWizardKeyHandler;
ReportWizardKeyHandler.superclass = AbstractKeyHandler.prototype;

ReportWizardKeyHandler.prototype.init = function(aDocument)
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
};

ReportWizardKeyHandler.prototype.destroy = function(aDocument)
{
   if (aDocument != null)
   {
      Event.stopObserving(aDocument, 'keydown', this.handleKeyEventBind, true);
   }
   else
   {
      Event.stopObserving(document, 'keydown', this.handleKeyEventBind, true);
   }
};

ReportWizardKeyHandler.prototype.loadKeyCodes = function()
{
   this.keySave = applicationResources.getProperty("keycode.report.wizard.save");
   this.keySaveAs = applicationResources.getProperty("keycode.report.wizard.save.as");
   this.keyRun = applicationResources.getProperty("keycode.report.wizard.run");
   this.keyCancel = applicationResources.getProperty("keycode.report.wizard.cancel");
   this.keyClose = applicationResources.getProperty("keycode.report.wizard.close");
   this.keyBack = applicationResources.getProperty("keycode.report.wizard.back");
   this.keyForward = applicationResources.getProperty("keycode.report.wizard.forward");
   this.keyJump = applicationResources.getProperty("keycode.report.wizard.jump");
   this.keyEnter = applicationResources.getProperty("keycode.report.wizard.enter");
   this.keyValidate = applicationResources.getProperty("keycode.report.wizard.validate");
   this.keyPreview = applicationResources.getProperty("keycode.report.wizard.preview");
   this.keyFinish = applicationResources.getProperty("keycode.report.wizard.finish");
};

ReportWizardKeyHandler.prototype.handleKeyEvent = function(anEvent)
{
   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;
   var altKey = anEvent.altKey;
   var keyCode = anEvent.keyCode;
            
   if (this.keyEnter == keyCode)
   {
      this.controller.save();
   }
   else if (altKey && this.keyFinish == keyCode)
   {         
      this.controller.finishButton();
   }
   else if (altKey && this.keySave == keyCode)
   {
      this.controller.save();
   }
   else if (altKey && this.keySaveAs == keyCode)
   {
      this.controller.saveAs();
   }
   else if (altKey && this.keyRun == keyCode)
   {
      this.controller.runButton();
   }
   else if (altKey && this.keyCancel == keyCode)
   {
      this.controller.cancel();
   }
   else if (altKey && this.keyBack == keyCode)
   {
      this.controller.previous();
   }
   else if (altKey && this.keyForward == keyCode)
   {
      this.controller.next();
   }
   else if (this.keyJump == keyCode)
   {
      this.controller.next();
   }
   else if (this.keyClose == keyCode)
   {
      this.controller.cancel();
   }
   else if (ctrlKey && this.keyValidate == keyCode)
   {
      this.controller.validateButton();
   }
   else if (ctrlKey && this.keyPreview == keyCode)
   {
      this.controller.preview();
   }
};