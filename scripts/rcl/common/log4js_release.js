function NoOpLogger()
{

};

NoOpLogger.prototype = {

   addAppender: function( appender )
   {
   },

   setLevel: function( level )
   {
   },

   log: function( message, logLevel )
   {
   },

   clear : function ()
   {
   },

   isTraceEnabled: function()
   {
      return false;
   },

   trace: function( message )
   {
   },

   isDebugEnabled: function()
   {
      return false;
   },

   debug: function( message )
   {
   },

   isInfoEnabled: function()
   {
      return false;
   },

   info: function( message )
   {
   },

   isWarnEnabled: function()
   {
      return false;
   },


   warn: function( message )
   {
   },

   isErrorEnabled: function()
   {
      return false;
   },

   error: function( message )
   {
   },

   isFatalEnabled: function()
   {
      return false;
   },

   fatal: function( message )
   {
   },

   windowError: function( msg, url, line )
   {
   }
}

if (!JsUtil.isGood(window.top.rclLog))
{
   var rclLog = new NoOpLogger();
   window.top.rclLog = rclLog;
}

var log = window.top.rclLog;
