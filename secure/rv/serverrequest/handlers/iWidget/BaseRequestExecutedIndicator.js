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
 
function BaseRequestExecutedIndicator(oCV)
{
	this.m_oCV = oCV;
	if( oCV ){
		this.m_oCVId = oCV.getId();
		if( oCV.getViewerWidget() ){
			this.m_background = oCV.getViewerWidget().getReportBlocker();
		}
	}
};

BaseRequestExecutedIndicator.prototype = new IRequestIndicator();

BaseRequestExecutedIndicator.prototype.getViewer = function() 
{
	return this.m_oCV;
};


BaseRequestExecutedIndicator.prototype.show = function(){	
	this.m_background.setClassNameOverride( 'report-blocker');
	this.m_background.show();
	
};

BaseRequestExecutedIndicator.prototype.hide = function(){
	if (this.m_background ) {
		this.m_background.hide();
	}
	
};