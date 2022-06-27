/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
function IRequestIndicator(){}
IRequestIndicator.prototype.show = function() { if(typeof console != "undefined") { console.log("Required method IRequestIndicator:show not implemented."); } };
IRequestIndicator.prototype.hide = function() { if(typeof console != "undefined") { console.log("Required method IRequestIndicator:hide not implemented."); } };
