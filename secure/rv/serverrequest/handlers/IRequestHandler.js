/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2013
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function IRequestHandler(){}
IRequestHandler.prototype.preHttpRequest = function(request) { if(typeof console != "undefined") { console.log("Required method IRequestHandler:preHttpRequest not implemented."); } };
IRequestHandler.prototype.postHttpRequest = function(response) { if(typeof console != "undefined") { console.log("Required method IRequestHandler:postHttpRequest not implemented."); } };
IRequestHandler.prototype.postComplete = function(response) { if(typeof console != "undefined") { console.log("Required method IRequestHandler:postComplete not implemented."); } };
IRequestHandler.prototype.onComplete = function(response) { if(typeof console != "undefined") { console.log("Required method IRequestHandler:onComplete not implemented."); } };
IRequestHandler.prototype.onPostEntryComplete = function(response) { if(typeof console != "undefined") { console.log("Required method IRequestHandler:onPostEntryComplete not implemented."); } };
IRequestHandler.prototype.onFault = function(response)  { if(typeof console != "undefined") { console.log("Required method IRequestHandler:onFault not implemented."); } };
IRequestHandler.prototype.onPrompting = function(response)  { if(typeof console != "undefined") { console.log("Required method IRequestHandler:onPrompting not implemented."); } };
IRequestHandler.prototype.onWorking = function(response)  { if(typeof console != "undefined") { console.log("Required method IRequestHandler:onWorking not implemented."); } };
IRequestHandler.prototype.setWorkingDialog = function(workingDialog)  { if(typeof console != "undefined") { console.log("Required method IRequestHandler:setWorkingDialog not implemented."); } };
IRequestHandler.prototype.setRequestIndicator = function(executionCursor)  { if(typeof console != "undefined") { console.log("Required method IRequestHandler:setExecutionCursor not implemented."); } };


