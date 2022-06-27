/**
 Copyright 2001-2008, Focus Technologies LLC.
 All rights reserved.
 **/

// $Id: ReiKeyHandler.js 8428 2013-06-20 22:55:14Z dk $

//-----------------------------------------------------------------------------
/**
 * I am the JavaScript key handler for Report Execution Inputs
 *
 * @constructor
 * @author David Paul (dpaul@inmotio.com)
 **/
function ReiKeyHandler(aUiController)
{
   this.controller = aUiController;
   this.init(aUiController.document);
   this.loadKeyCodes();
}

ReiKeyHandler.prototype = new AbstractKeyHandler();
ReiKeyHandler.prototype.constructor = ReiKeyHandler;
ReiKeyHandler.superclass = AbstractKeyHandler.prototype;

ReiKeyHandler.prototype.init = function(aDocument)
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

ReiKeyHandler.prototype.destroy = function(aDocument)
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

ReiKeyHandler.prototype.loadKeyCodes = function()
{
   this.keySave = applicationResources.getProperty("keycode.rei.save");
   this.keySave = this.keySave.indexOf('{') > -1 ? eval("("+this.keySave+")") : this.keySave;
   this.keySaveAs = applicationResources.getProperty("keycode.rei.save.as");
   this.keySaveAs = this.keySaveAs.indexOf('{') > -1 ? eval("("+this.keySaveAs+")") : this.keySaveAs;
   this.keyRun = applicationResources.getProperty("keycode.rei.run");
   this.keyRun = this.keyRun.indexOf('{') > -1 ? eval("("+this.keyRun+")") : this.keyRun;
   this.keyCancel = applicationResources.getProperty("keycode.rei.cancel");
   this.keyCancel = this.keyCancel.indexOf('{') > -1 ? eval("("+this.keyCancel+")") : this.keyCancel;
   this.keyClose = applicationResources.getProperty("keycode.rei.close");
   this.keyClose = this.keyClose.indexOf('{') > -1 ? eval("("+this.keyClose+")") : this.keyClose;
   this.keyGetSql = applicationResources.getProperty("keycode.rei.get.sql");
   this.keyGetSql = this.keyGetSql.indexOf('{') > -1 ? eval("("+this.keyGetSql+")").key : this.keyGetSql;
   this.keyPrevious = applicationResources.getProperty("keycode.rei.previous");
   this.keyPrevious = this.keyPrevious.indexOf('{') > -1 ? eval("("+this.keyPrevious+")") : this.keyPrevious;
   this.keyNext = applicationResources.getProperty("keycode.rei.next");
   this.keyNext = this.keyNext.indexOf('{') > -1 ? eval("("+this.keyNext+")") : this.keyNext;
   this.keyBack = applicationResources.getProperty("keycode.rei.back");
   this.keyBack = this.keyBack.indexOf('{') > -1 ? eval("("+this.keyBack+")") : this.keyBack;
   this.keyForward = applicationResources.getProperty("keycode.rei.forward");
   this.keyForward = this.keyForward.indexOf('{') > -1 ? eval("("+this.keyForward+")") : this.keyForward;
   this.keyJump = applicationResources.getProperty("keycode.rei.jump");
   this.keyJump = this.keyJump.indexOf('{') > -1 ? eval("("+this.keyJump+")") : this.keyJump;
   this.keyEnter = applicationResources.getProperty("keycode.rei.enter");
   this.keyEnter = this.keyEnter.indexOf('{') > -1 ? eval("("+this.keyEnter+")") : this.keyEnter;
};

ReiKeyHandler.prototype.handleKeyEvent = function(anEvent)
{
   var ctrlKey = anEvent.ctrlKey;
   var shiftKey = anEvent.shiftKey;
   var altKey = anEvent.altKey;
   var keyCode = anEvent.keyCode;

   //--- get sql
   if (ctrlKey && altKey && keyCode == this.keyGetSql)
   {
      this.controller.getSql();
   }
   //--- save (why are there two different sets of hotkeys for this? sigh...)
   else if ((ctrlKey && altKey) && (keyCode == this.keyEnter || keyCode == this.keySave))
   {
      this.controller.save();
   }
   //--- saveAs...
   else if (ctrlKey && altKey && this.keySaveAs == keyCode)
   {
      this.controller.saveAs();
   }
   //--- run...
   else if (ctrlKey && altKey && this.keyRun == keyCode)
   {
      this.controller.run();
   }
   //--- cancel (two ways...? why?)
   else if ((altKey && this.keyCancel == keyCode) || keyCode == this.keyClose)
   {
      this.controller.cancel();
   }
   //--- previous (two ways...?  why?)
   else if ((ctrlKey && altKey) && (keyCode == this.keyPrevious || keyCode == this.keyBack))
   {
      this.controller.previousButton();
   }
   //--- next (THREE different sets of hotkeys for doing this...?  OMG why why why?)
   else if ((ctrlKey && altKey) &&
           (keyCode == this.keyNext || keyCode == this.keyForward || keyCode == this.keyJump ))
   {
      this.controller.nextButton();
   }
};