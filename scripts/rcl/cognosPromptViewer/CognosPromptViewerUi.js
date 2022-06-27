/**
 Copyright 2001-2008, Focus Technologies LLC.
 All rights reserved.
 **/

// $Id:

//-----------------------------------------------------------------------------

/**
 * I am the UI controller for the Cognos Prompt Viewer screen...
 *
 * @constructor
 * @author Chad Rainey (crainey@inmotio.com)
 **/
function CognosPromptViewerUiController(aDocument)
{
   AbstractUiController.prototype.constructor.call(this, aDocument);
}


//--- This class extends AbstractUiController
CognosPromptViewerUiController.prototype = new AbstractUiController();
CognosPromptViewerUiController.prototype.constructor = CognosPromptViewerUiController;
CognosPromptViewerUiController.superclass = AbstractUiController.prototype;

/**
 * called once (after document is fully loaded) to initialize the user interface
 **/
CognosPromptViewerUiController.prototype.initUi = function()
{
};
