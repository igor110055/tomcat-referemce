/**
    Copyright 2001-2011, Motio Inc.
    All rights reserved.
**/

// $Id: $

if (!Ext.enableFx)
{
   Ext.enableFx = true;
}
//-----------------------------------------------------------------------------
/**
 * I represent a note which displays some information and then fades away...
 *
 * @param aMessage - HTML Message
 * @param aDisplayTime - length of time to display the fade note...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FadeMessage (aMessage, aDisplayTime)
{
   this.id = FadeMessage.nextId++;
   this.message = aMessage;
   this.displayTime = aDisplayTime;

   this.domDiv = null;
   this.win = null;
}

FadeMessage.nextId = 0;

FadeMessage.prototype.insertIntoDocument = function()
{

   this.win = new Ext.Window({
      renderTo: Ext.getBody(),
      id: "FadeMessage_" + this.id,
//      shadow: true, floating: true,
      closable: false,
//      border: false,
      resizable: false,
//      height: 300,
//      autoHeight: true,
//      height: 'auto',
//      autoWidth: true,
//      width: 'auto',
      bodyStyle: 'padding:10px',
      width: 360
   });
   this.win.update(this.message);
   this.win.show();

//   this.domDiv = document.createElement("div");
//   this.domDiv.id = "FadeMessage_" + this.id;


//   this.domDiv.className = "ydsf centeredMessage";
//
//   var content = document.createElement("div");
//   content.innerHTML = this.message;
//   content.className = "ydsfInner fadeMessage";
//
//   this.domDiv.appendChild(content);
//
//
//   this.opacity = 100.0;
//
//   document.body.appendChild(this.domDiv);

   window.setTimeout("FadeMessageController.getInstance().fadeActiveNote(" + this.id + ");", this.displayTime);
}


FadeMessage.prototype.fadeOut = function()
{

   this.win.body.fadeOut({
      endOpacity: 0, //can be any value between 0 and 1 (e.g. .5)
      easing: 'easeOut',
      duration: 1,
      remove: true,
      useDisplay: true,
      scope: this,
      callback: function(){
         this.win.hide();
         FadeMessageController.getInstance().removeFadeMessage(this.id);
      }
   });

}

FadeMessage.prototype.removeFromDocument = function()
{
   // remove...
//   this.domDiv.parentNode.removeChild(this.domDiv);
}




//-----------------------------------------------------------------------------
/**
 * Singleton controller for launching fade notes...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FadeMessageController()
{
   this.activeNotes = new Object();
}

FadeMessageController._instance = new FadeMessageController();

FadeMessageController.getInstance = function()
{
   return FadeMessageController._instance;
}

FadeMessageController.prototype.showFadeMessage = function (aMessage, aDisplayTime)
{
   var fadeMessage = new FadeMessage (aMessage, aDisplayTime);
   this.activeNotes[fadeMessage.id] = fadeMessage;

   fadeMessage.insertIntoDocument();
   return fadeMessage;
}

FadeMessageController.prototype.removeFadeMessage = function (anId)
{
   var fadeMessage = this.activeNotes[anId];
   delete this.activeNotes[anId];

   fadeMessage.removeFromDocument();
}

FadeMessageController.prototype.fadeActiveNote = function (anId)
{
   //alert("fading node [" + anId + "]");
   var fadeMessage = this.activeNotes[anId];
   fadeMessage.fadeOut();
}


