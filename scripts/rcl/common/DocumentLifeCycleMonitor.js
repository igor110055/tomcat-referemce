
/**
 * @fileoverview
 * <p>This file defines classes which allow us to later install document lifecyle
 * listeners.  The two lifecycle events that are often of interest to us are
 * onload (happens when the document has fully loaded) and onunload (happens when
 * the document is being unloaded).</p>
 *
 * <p>The DocumentLifeCycleMonitor supports multiple listeners for any of these
 * events.</p>
 *
 * @author Lance Hankins
 *
 **/

function DocumentLifeCycleMonitor ()
{
   this.onLoadListeners = new Array();
   this.onUnLoadListeners = new Array();

   this.isDocumentLoaded = false;
}

//--- static...

DocumentLifeCycleMonitor.getInstance = function()
{
   return DocumentLifeCycleMonitor.INSTANCE;
}



//--- member..

DocumentLifeCycleMonitor.prototype.addOnLoadListener = function(aListener)
{
   this.onLoadListeners[this.onLoadListeners.length] = aListener;
}

DocumentLifeCycleMonitor.prototype.addOnUnLoadListener = function(aListener)
{
   this.onUnLoadListeners[this.onUnLoadListeners.length] = aListener;
}


DocumentLifeCycleMonitor.prototype.documentWasLoaded = function()
{
   for (var i = 0; i < this.onLoadListeners.length; ++i)
   {
      this.onLoadListeners[i]();
   }

   this.isDocumentLoaded = true;
}


DocumentLifeCycleMonitor.prototype.documentWasUnLoaded = function()
{
   for (var i = 0; i < this.onUnLoadListeners.length; ++i)
   {
      this.onUnLoadListeners[i]();
   }
}



//--- static...
DocumentLifeCycleMonitor.INSTANCE = new DocumentLifeCycleMonitor();


/*
// see ticket #789 - having issues getting the following to work
// wire to load / unload via prototype...
Event.observe(document, 'load', function() {
      DocumentLifeCycleMonitor.getInstance().documentWasLoaded(); }, false);

Event.observe(document, 'unload', function() {
      DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded(); }, false);
*/

