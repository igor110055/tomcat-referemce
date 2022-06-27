/**
 * SimpleDebugMessageFormatter - a default formatter for timestamps and messages
 * @constructor
 */
function SimpleDebugMessageFormatter() {}

SimpleDebugMessageFormatter.DATE_FORMAT = "HH:mm:ss";

SimpleDebugMessageFormatter.prototype.formatMessage = function(aDebugMessage) {
   var timestamp = DateUtils.formatDate(aDebugMessage.timestamp, SimpleDebugMessageFormatter.DATE_FORMAT);
   var name;
   if (JsUtil.isGood(aDebugMessage.document) && JsUtil.isGood(aDebugMessage.document.name)) {
      name = aDebugMessage.document.name;
   } else {
      name = "'" + aDebugMessage.document.title + "'";
   }
   return "[" + timestamp + "] [" + name + "] " + aDebugMessage.message + "\n";
}

/**
 * DebugMessage
 * @constructor
 */
function DebugMessage(aDocument, aMessage)
{
   this.timestamp = new Date();
   this.document = aDocument;
   this.message = aMessage;
}

/**
 * JsClientDebug
 * @constructor
 */
function JsClientDebug(uiController)
{
   this.uiController = uiController;
   this.window = null;

   this.messageQueue = new Array();

   this.windowLoaded = false;
}

if (!JsUtil.isGood(JsClientDebug.logMessageErrorShown)) {
   JsClientDebug.logMessageErrorShown = false;
}

/**
 * logs a message onto the current singleton JsClientDebug window
 */
JsClientDebug.logMessage = function(aDocument, aMessage) {
   // make sure everything's kosher
   if (typeof(ServerEnvironment.jsClientDebug) == "undefined" || ServerEnvironment.jsClientDebug == false) {
      return;
   }

   if (!JsUtil.isGood(uiController) ||
       (JsUtil.isGood(uiController) && !JsUtil.isGood(uiController.getFrameSetUiController))) {
      if (!JsClientDebug.logMessageErrorShown) {
         alert("Client-side logging is disabled because there is no apparent access to the Frameset UI Controller.");
         JsClientDebug.logMessageErrorShown = true;
      }
   }

   // convert this into a DebugMessage instance
   var debugMessage = new DebugMessage(aDocument, aMessage);

   // get the actual JsClientDebug instance
   fsUiController = uiController.getFrameSetUiController();
   var jsClientDebug = fsUiController.getJsClientDebug();

   // send this message to it
   jsClientDebug.logMessage(debugMessage);
}

/**
 * @private
 */
JsClientDebug.prototype.logMessage = function(aDebugMessage) {
   // put it on the messageQueue
   this.messageQueue.unshift(aDebugMessage);

   if (this.window == null || (JsUtil.isGood(this.window) && this.window.closed == true)) {
      this.window = JsUtil.openNewWindow(ServerEnvironment.baseUrl + "/secure/actions/jsClientDebug.do", ServerEnvironment.windowNamePrefix + "jsClientDebug",
              "menubar=no,status=no,titlebar=yes,directories=no,location=no,height=600,width=800,innerHeight=600,innerWidth=800");
      this.window.jsClientDebug = this;
   } else if (this.windowLoaded == true && this.uiController.windowLoaded == true){
      this.processMessageQueue();
   }
}

/**
 * @private
 */
JsClientDebug.prototype.processMessageQueue = function() {
   while (this.messageQueue.length > 0 && this.uiController.windowLoaded) {
      this.uiController.renderMessage(this.messageQueue.pop());
   }
}

/**
 * JsClientDebugUiController - the Ui Controller for the JsClientDebug window
 * @constructor
 */
function JsClientDebugUiController(aDocument, aWindow, aMessageFormatter) {
   this.init(aDocument, aWindow, aMessageFormatter);
}

/**
 * @private
 */
JsClientDebugUiController.prototype.init = function(aDocument, aWindow, aMessageFormatter) {
   this.document = aDocument;
   this.window = aWindow;
   this.messageFormatter = aMessageFormatter;

   this.windowLoaded = false;
}

JsClientDebugUiController.prototype.initUi = function() {
   this.windowLoaded = true;
   this.jsClientDebug.windowLoaded = true;
   this.jsClientDebug.processMessageQueue();
}

/**
 * @private
 */
JsClientDebugUiController.prototype.windowClosing = function() {
   this.windowLoaded = false;
   this.jsClientDebug.windowLoaded = false;
}

/**
 * @private
 */
JsClientDebugUiController.prototype.renderMessage = function(aDebugMessage) {
   var textarea = this.document.getElementById("debugTextarea");
   textarea.value += this.messageFormatter.formatMessage(aDebugMessage);
   textarea.scrollTop = textarea.scrollHeight;
}