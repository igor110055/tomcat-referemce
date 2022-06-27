/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: FadeMessage.js 4533 2007-07-26 19:34:05Z lhankins $


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
}

FadeMessage.nextId = 0;

FadeMessage.prototype.insertIntoDocument = function()
{
   this.domDiv = document.createElement("div");
   this.domDiv.id = "FadeMessage_" + this.id;


   this.domDiv.className = "ydsf centeredMessage";

   var content = document.createElement("div");
   content.innerHTML = this.message;
   content.className = "ydsfInner fadeMessage";

   this.domDiv.appendChild(content);


   this.opacity = 100.0;

   document.body.appendChild(this.domDiv);

   window.setTimeout("FadeMessageController.getInstance().fadeActiveNote(" + this.id + ");", this.displayTime);
}


FadeMessage.prototype.fadeOut = function()
{
   this.opacity -= 10;

   //--- IE and mozilla deal with opacity differently...
   if (is_ie5_5up)
   {
      this.domDiv.style.filter = "alpha(opacity=" + this.opacity + ")";
   }
   else
   {
      var newOpacity = (this.opacity/100.0);
      //document.getElementById("debugText").innerHTML = "opacity = [" + newOpacity + "]";
      this.domDiv.style["MozOpacity"] = newOpacity;
   }

   window.status = "set opacity to " + this.opacity;

   if (this.opacity <= 0)
   {
      FadeMessageController.getInstance().removeFadeMessage(this.id);
   }
   else
   {
      window.setTimeout("FadeMessageController.getInstance().fadeActiveNote(" + this.id + ");", 100);
   }
}

FadeMessage.prototype.removeFromDocument = function()
{
   // remove...
   this.domDiv.parentNode.removeChild(this.domDiv);
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


