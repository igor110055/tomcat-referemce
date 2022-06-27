/**
 *  Base class for key handlers.
 *
 * @author Cory Williamson
 */

function AbstractKeyHandler() {}

AbstractKeyHandler.prototype.handleKeyEvent = function(anEvent)
{
   alert("You must implement handleKeyEvent in the subclass.");
}
