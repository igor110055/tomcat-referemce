/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2012
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 


/**
 * This class should only be used in the case where there is delayed loading
 * of report.
 */
 function BuxRunReportAction()
 {
	 BuxRunReportAction.baseConstructor.call();
 }
 
 BuxRunReportAction.prototype = new RunReportAction();
 BuxRunReportAction.baseConstructor = RunReportAction;
 BuxRunReportAction.prototype.canBeQueued = function() { return true; };
 
 BuxRunReportAction.prototype.getAction = function( limitedInteractiveMode ) {
		return limitedInteractiveMode ? 'runBux' : 'buxRunSpec';
};
 

 
 

 
 