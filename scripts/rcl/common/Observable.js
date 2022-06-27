/**
 * @fileoverview
 * This file defines JS abstractions for implementing the Observer design
 * pattern.
 */


//-----------------------------------------------------------------------------
/**
 * a template for events sent throught he Observer Observable pattern.   Feel
 * free to define extra fields in concrete descendants, the only real required
 * fields are those which defined at this level...
 *
 * @param aType - the type of event
 * @param aPayload - payload of the event...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ObservableEvent (aType, aPayload)
{
   this.type = aType;
   this.payload = aPayload;
}

ObservableEvent.prototype.toString = function ()
{
   return " type = [" + this.type + "], payload = [" + this.payload + "]";
}




//-----------------------------------------------------------------------------
/**
 * instances of this class identify a class of events
 *
 * @param aFamil - a broad family category for events
 * @param aName - the name of this specific event type
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ObservableEventType (aFamily, aName)
{
   this.family = aFamily;

   this.id = ObservableEventType.nextId++;
   this.name = aName;
}

ObservableEventType.prototype.toString = function ()
{
   return this.name;
}


//--- static
ObservableEventType.nextId = 0;

ObservableEventType.COMPOUND_EVENT = new ObservableEventType("observable", "COMPOUND_EVENT");


//-----------------------------------------------------------------------------
/**
 * contains many other events
 *
 * @param anArrayOfEvents - an array of other events contained in this compound
 *        event.
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function CompoundObservableEvent (anArrayOfEvents)
{
   //--- call super.constructor
   CompoundObservableEvent.superclass.constructor.call(this, ObservableEventType.COMPOUND_EVENT, anArrayOfEvents);
}


CompoundObservableEvent.prototype = new ObservableEvent();
CompoundObservableEvent.prototype.constructor = CompoundObservableEvent;
CompoundObservableEvent.superclass = ObservableEvent.prototype;




//-----------------------------------------------------------------------------
/**
 * abstract implementation of Observer - extend this and override the
 * processEvent behavior
 *
 * @param aFamil - a broad family category for events
 * @param aName - the name of this specific event type
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function Observer (anId)
{
   this.id = anId;
}

Observer.prototype.processEvent = function (anEvent)
{
}



//-----------------------------------------------------------------------------
/**
 * an object which supports the observer design pattern
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function Observable()
{
   this.observers = new Array();
   this.batchUpdateStack = new Array();
   this.queuedEvents = new Array();
}

/**
 * adds the supplied observer to the list of oberservers which are watching
 * this observable
 **/
Observable.prototype.addObserver = function (anObserver)
{
   this.observers.push(anObserver)
}

/**
 * remove the supplied observer...
 **/
Observable.prototype.removeObserver = function (anId)
{
   for (var i = 0; i < this.observers.length; ++i)
   {
      if (this.observers[i].id = anId)
      {
         this.observers.splice(i,1);
         break;
      }
   }
}

Observable.prototype.hasObservers = function()
{
   return this.observers.length > 0;
}

/**
 * pushes an event to all subscribed observers...
 **/
Observable.prototype.publishEvent = function (anEvent)
{
   //--- queue events and send them all at once...
   if (this.isBatchMode())
   {
      this.queuedEvents.push(anEvent);
      //alert("pushed event onto queue : \n" + this.queuedEvents.join("\n"));
      return;
   }

   var badObservers = null;
   var eachObserver = null;

   for (var o = 0; o < this.observers.length; ++o)
   {
//      try
//      {
         eachObserver = this.observers[o];
         eachObserver.processEvent(anEvent);
//      }
//      catch (ex)
//      {
//         if (badObservers == null)
//         {
//            badObservers = new Array();
//         }
//         badObservers.push(eachObserver.id);
//      }
//      finally
//      {
//         //--- remove any observers which threw an exception...
//         if (badObservers)
//         {
//            for (var i = 0; i < badObservers.length; ++i)
//            {
//               alert("*** WARNING - removing bad observer [" + badObservers[i] + "]");
//               this.removeObserver(badObservers[i]);
//            }
//         }
//      }
   }
}


Observable.prototype.isBatchMode = function()
{
   return this.batchUpdateStack.length > 0;
}

/**
 * used to signal the start of a batch operation which may generate many
 * events.  While inside a batch operation, all events will be queued and
 * then sent as a single compound event when the batch operation completes.
 **/
Observable.prototype.beginBatchOperation = function()
{
   this.batchUpdateStack.push(true);
}

/**
 * used to signal the end of a batch operation (triggers delivery of all
 * queued events as a single compound event). 
 **/
Observable.prototype.endBatchOperation = function()
{
   this.batchUpdateStack.pop();

   if (this.batchUpdateStack.length == 0)
   {
      this.publishQueuedEvents();
   }
}

/**
 * @private
 **/
Observable.prototype.publishQueuedEvents = function()
{
   if (this.queuedEvents.length > 0)
   {
      var pending = this.queuedEvents;
      this.queuedEvents = new Array();

      this.publishEvent(new CompoundObservableEvent(pending));
   }
}



