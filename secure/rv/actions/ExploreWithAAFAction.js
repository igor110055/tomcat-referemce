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
 
function ExploreWithAAFAction() {}

ExploreWithAAFAction.prototype = new CognosViewerAction();

ExploreWithAAFAction.prototype.execute = function() {
	window.open(this.m_oCV.getGateway() + this.m_oCV.envParams.aafBaseURL, "_blank");
};
