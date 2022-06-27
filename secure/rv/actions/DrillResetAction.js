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

function DrillResetAction(){
	this.m_sAction = "DrillDown";
	this.m_sharePromptValues = null;
	this.m_aDrilledResetHUNs = null;
	this.m_updateInfoBar = true;
};

DrillResetAction.prototype = new ModifyReportAction();

DrillResetAction.prototype.setRequestParms = function(params) { 
	this.m_aDrilledResetHUNs = params.drilledResetHUNs;
	this.m_sharePromptValues = params.promptValues;
};

DrillResetAction.prototype.addAdditionalOptions = function( oReq ) {
	if( !this.m_oCV ) { return; }

	if( !this.m_sharePromptValues ){
		/**
		 * The format of prompt values from prompt control is different from that of the 
		 * share prompt event, therefore, need to prepare it differently 
		 */
		this.m_oCV.preparePromptValues( oReq );
		oReq.getRequestHandler().setForceRaiseSharePrompt(true);
	}else{
		if( !this.m_sharePromptValues ){
			return;
		}
		
		for (var promptValue in this.m_sharePromptValues){
			oReq.addFormField( promptValue, this.m_sharePromptValues[promptValue] );
		}
	}
};


DrillResetAction.prototype.addActionContextAdditionalParms = function(){
	var additionalContext = '<HUNS>';
	for( var i = 0; i < this.m_aDrilledResetHUNs.length ; i++ ){
		additionalContext += '<HUN>' + xml_encode( this.m_aDrilledResetHUNs[i] ) +'</HUN>';
	}
	additionalContext += '</HUNS>';
	additionalContext += '<action>resetDimension</action>';
	return additionalContext;
};

DrillResetAction.prototype.setUpdateInfoBar = function( bUpdate ){
	this.m_updateInfoBar = bUpdate;
}

DrillResetAction.prototype.updateInfoBar = function() {
	this.m_updateInfoBar;
};
