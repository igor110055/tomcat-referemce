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

function WorkingDialog( cognosViewer )
{
	if (cognosViewer) {
		this.m_bSimpleWorkingDialog = false;
		this.m_bShowCancelButton = (cognosViewer.getAdvancedServerProperty("VIEWER_JS_HIDE_CANCEL_BUTTON") == "true") ? false : true;
		WorkingDialog.baseConstructor.call( this, cognosViewer );
		this.m_secondaryRequests = cognosViewer.getSecondaryRequests();
	}
}

WorkingDialog.prototype = new ViewerBaseWorkingDialog();
WorkingDialog.baseConstructor = ViewerBaseWorkingDialog;

WorkingDialog.prototype.setSecondaryRequests = function( aSecRequests )
{
	this.m_secondaryRequests = aSecRequests;
}
 
WorkingDialog.prototype._getSecondaryRequests = function(){
	return this.m_secondaryRequests;
};

WorkingDialog.prototype.getIsSavedReport = function()
{
	return this.getCognosViewer().bIsSavedReport;
};
 
 /**
  * Required only by lineage action.
  * TODO: ideally, the lineage action class need not set this flag but
  * can be figured out based on the cognos viewer object
  */
 WorkingDialog.prototype.setSimpleWorkingDialogFlag = function( flag )
 {
	 this.m_bSimpleWorkingDialog = flag;
 };
 
 WorkingDialog.prototype.getSimpleWorkingDialogFlag = function()
 {
	 return this.m_bSimpleWorkingDialog;
 };

 /**
  * Will hide/show the delivery options toolbar buttons within the wait page
  * @param bShow (boolean) Boolean which dictates whether to show the delivery option toolbar buttons
  */
 WorkingDialog.prototype.showDeliveryOptions = function(bShow)
 {
 	var namespace = this.getNamespace();
 	var htmlElement = document.getElementById("DeliveryOptionsVisible" + namespace);
 	if (htmlElement)
 	{
 		htmlElement.style.display = (bShow === false ? "none" : "block");
 		if (bShow)
 		{
 			var links = htmlElement.getElementsByTagName("a");
 			for (var i=links.length; i > 0; i--)
 			{
 				if (links[i] && links[i].getAttribute("tabIndex") == "0") {
 					links[i].focus();
 				}
 			}
 		}
 	}

 	htmlElement = document.getElementById("OptionsLinkSelected" + namespace);
 	if (htmlElement)
 	{
 		htmlElement.style.display = (bShow === false ? "none" : "block");
 	}

 	htmlElement = document.getElementById("OptionsLinkUnselected" + namespace);
 	if (htmlElement)
 	{
 		htmlElement.style.display = (bShow === false ? "block" : "none");
 	}
 };

 WorkingDialog.prototype.renderHTML = function()
 { 	
	var sNamespace = this.getNamespace();
 	var ariaLabelledby = sNamespace + '_workingMsg ' + sNamespace + '_workingMsg2';
 	
 	var html =	'<table class="viewerWorkingDialog" id="CVWaitTable' + sNamespace + '"' + ' role="presentation">';
 	html +=		('<tr>' + 	'<td align="center">' + '<div tabIndex="0" role="presentation" aria-labelledby="' + ariaLabelledby + '"' + ' class="body_dialog_modal workingDialogDiv">');
 	html +=		this.renderFirstInnerTable();
 	html += 	this.renderSecondInnerTable();
 	html += 	('</div>' +	'</td>' + 	'</tr>' +	'</table>');
 	
	return html;
 };
 
 WorkingDialog.prototype.renderFirstInnerTable = function()
 {
	var bSimpleWaitPage = this.getSimpleWorkingDialogFlag();
	var workingMsg = bSimpleWaitPage ? RV_RES.GOTO_WORKING : RV_RES.RV_RUNNING;
	var sNamespace = this.m_sNamespace;
 	
 	var output = 
 		'<table class="workingDialogInnerTable" role="presentation">' +
 			'<tr>' +
				'<td valign="middle">';

		var sBrandImageLocation = this.getCognosViewer().getSkin() + '/branding/';

		output += '<img src="' + sBrandImageLocation + 'progress.gif"';
		if( isIE() )
		{
			output += ' width="48" height="48" border="0"';
		}

		output += ' name="progress"';
		
		if( isIE() )
		{
			output += ' align="top"';
		}

		output += ' alt="';
		output += workingMsg;
		output += '"/></td>';
		output += '<td width="20">&nbsp;</td>';
		output += '<td style="padding-top: 5px;" class="tableText">';

		output += '<span id="' + sNamespace + '_workingMsg">';
		output += workingMsg;
		output += '</span>';

		output += '<br/><br/>';

		var sResponseFormat = this.getCognosViewer().envParams[ 'cv.responseFormat' ];

		if(bSimpleWaitPage || this.isUIBlacklisted('RV_TOOLBAR_BUTTONS') || !this.deliverySectionIsNeeded() || ( sResponseFormat && ( 'qs' === sResponseFormat || 'fragment' === sResponseFormat )) )
		{
			output += RV_RES.RV_PLEASE_WAIT;
		}
		else
		{
			var bCanShowDeliveryOptions = this.canShowDeliveryOptions();
			if(bCanShowDeliveryOptions)
			{
				output += this.optionLinkSelectedDiv();
				output += this.optionLinkUnselectedDiv();
			}
			else
			{
				output += RV_RES.RV_PLEASE_WAIT;
			}
		}

		output += '</td></tr><tr><td colspan="3">&nbsp;</td></tr></table>';
		return output;
 };
 
 WorkingDialog.prototype.optionLinkSelectedDiv = function()
 {
		var sbOutput = '';
		sbOutput += '<div id="OptionsLinkSelected' + this.getNamespace() + '" style="display: none">';
		sbOutput += RV_RES.RV_BUSY_OPTIONS_SELECTED;
		sbOutput += '</div>';
		return sbOutput;	 
 };
 
 WorkingDialog.prototype.optionLinkUnselectedDiv = function()
 {
		var sbOutput = '';
		var sNamespace = this.getNamespace();
		var sWaitPageObject = 'window.oCV' + sNamespace + '.getWorkingDialog()';
		
		sbOutput += '<div id="OptionsLinkUnselected' + sNamespace  + '">';
		sbOutput += '<span id="' + sNamespace + '_workingMsg2">';
		sbOutput += RV_RES.RV_BUSY_OPTIONS_UNSELECTED;
		sbOutput += '</span><br/>';
		sbOutput += '<a href="#" class="deliveryOptionLink" onclick="javascript:' + sWaitPageObject + '.showDeliveryOptions(true)">';
		sbOutput += RV_RES.RV_BUSY_OPTIONS_LINK;
		sbOutput += '</a></div>';

		return sbOutput;
 };
 
 
 WorkingDialog.prototype.canShowDeliveryOptions = function()
 {
	var sAction = this.getCognosViewer().envParams['ui.primaryAction'];
	
	if( 'saveAs' !== sAction && 'email' !== sAction && this.getIsSavedReport() )
	{
		return true;
	}
	 
	return false;
 };
 
 WorkingDialog.prototype.isUIBlacklisted = function( item )
 {

    var aUIBlacklist = this.getUIBlacklist();

	for( var index in aUIBlacklist )
	{
		if( aUIBlacklist[index] === item )
		{
			return true;
		}
	}
	
	return  false;	 
 };
 

WorkingDialog.prototype.getUIBlacklist = function()
{
	if( !this.m_UIBlacklist && this.getCognosViewer().UIBlacklist )
	{
		this.m_UIBlacklist = this.getCognosViewer().UIBlacklist.split( ' ' );
	}
	 
	return this.m_UIBlacklist;
};
 
 
WorkingDialog.prototype.deliverySectionIsNeeded = function() {
	return !this._isSaveBlackListed() || !this._isSaveAsBlackListed() || !this._isEmailBlackListed();
};
 
WorkingDialog.prototype._isSaveBlackListed = function() {
	return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SAVE") || this.isUIBlacklisted("RV_WORKING_DIALOG_SAVE") || !this._hasSecondaryRequest("save");
};
 
WorkingDialog.prototype._isSaveAsBlackListed = function() {
	return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SAVEAS") || this.isUIBlacklisted("RV_WORKING_DIALOG_SAVEAS") || !this._hasSecondaryRequest("saveAs");
};
 
WorkingDialog.prototype._isEmailBlackListed = function() {
	return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SEND") || this.isUIBlacklisted("RV_WORKING_DIALOG_SEND") || !this._hasSecondaryRequest("email");
};
 
WorkingDialog.prototype.showCancelButton = function()
{
	return this.m_bShowCancelButton;
};
 
WorkingDialog.prototype._hasSecondaryRequest = function(request) {
	var secondaryRequests = this._getSecondaryRequests();
	if (secondaryRequests) {
		var arrayLength = secondaryRequests.length;
		for (var i = 0; i < arrayLength; i++) {
			if (secondaryRequests[i] == request) {
				return true;
			}
		}
	}
	 
	return false;
};
 
 WorkingDialog.prototype.renderSecondInnerTable = function()
 {
		var sbOutput = '';	
		var sWebRoot = this.getCognosViewer().getWebContentRoot();

		sbOutput += '<table width="300" border="0" cellpadding="0" cellspacing="0" role="presentation">';
		sbOutput += '<tr id="DeliveryOptionsVisible' + this.getNamespace() + '" class="workingDialogOptions">';
		sbOutput += '<td align="left">';
		sbOutput += '<table class="workingDialogInnerTable workingDialogLinks" role="presentation">';

		var bCanShowDeliveryOptions = this.canShowDeliveryOptions();
		if( bCanShowDeliveryOptions && this.deliverySectionIsNeeded() )
		{
			if (!this._isSaveBlackListed()) {
				sbOutput += this.addDeliverOption('/rv/images/action_save_report_output.gif', RV_RES.RV_SAVE_REPORT, 'SaveReport(true);');
			}

			if( 'reportView' !== this.getCognosViewer().envParams['ui.objectClass'] && !this._isSaveAsBlackListed() )
			{
				sbOutput += this.addDeliverOption('/rv/images/action_save_report_view.gif', RV_RES.RV_SAVE_AS_REPORT_VIEW, 'SaveAsReportView(true);');
			}
				
			if( !this.isUIBlacklisted('CC_RUN_OPTIONS_EMAIL_ATTACHMENT') && !this._isEmailBlackListed()) 
			{
				sbOutput += this.addDeliverOption('/rv/images/action_send_report.gif', RV_RES.RV_EMAIL_REPORT, 'SendReport(true);');
			}
		}
		

		sbOutput += '</table></td></tr> ';

		sbOutput += '<tr style="padding-top: 5px"> ';
		sbOutput += '<td align="left" colspan="3" id="cancelButtonContainer' + this.getNamespace() + '"> ';
		if(this.showCancelButton()){
			sbOutput +=  this.addCancelButton();
		}
		sbOutput += '</td></tr> ';

		sbOutput += '</table> ';

		return sbOutput;
 };
 
 WorkingDialog.prototype.addDeliverOption = function( sImage, sText, sOptionHandler )
 {
		var sbOutput = '';
		var sWebRoot = this.getCognosViewer().getWebContentRoot();
		var sRvObject = 'javascript: window.oCV' + this.getNamespace() + '.getRV().'; 
		var s_onClick = sRvObject + sOptionHandler;

		sbOutput += '<tr><td> ';
		sbOutput += '<a tabIndex="-1" href="' + sOptionHandler + '"> ';
		sbOutput += '<img border="0" src="'+ sWebRoot + sImage + '" alt=" ' + html_encode(sText) + '"/></a> ';
		sbOutput += '</td><td width="100%" valign="middle" class="tableText"> ';
		sbOutput += '<a tabIndex="0" role="link" href="#" onclick="' + s_onClick + '" style="padding-left: 5px" class="deliveryOptionLink"> ';
		sbOutput += ( sText + '</a></td></tr>');

		return sbOutput;
 };
 
 WorkingDialog.prototype.addCancelButton = function()
 {
		var sbOutput = '';
		var sWebContent = this.getCognosViewer().getWebContentRoot();
		
		sbOutput += '<table role="presentation"><tr><td> ';
		sbOutput += '<table id="cvWorkingDialog' + this.getNamespace() + '" role="presentation" cellpadding="0" cellspacing="0" onmouseover="this.className = \'commandButtonOver\'" onmouseout="this.className = \'commandButton\'" onmousedown="this.className = \'commandButtonDown\'" class="commandButton"> ';
		sbOutput += '<tr> '; 
		sbOutput += '<td valign="middle" align="center" nowrap="nowrap" class="workingDialogCancelButton" ';

		if( isIE() )
		{
			sbOutput += 'id="btnAnchorIE" ';
		}
		else
		{
			sbOutput += 'id="btnAnchor" ';
		}

		sbOutput += '> ';

	    var cancelButtonHandler = 'window.oCV' + this.m_sNamespace + ".cancel(this)";
		sbOutput += '<a href="#" onclick="' + cancelButtonHandler + '"> ';
		sbOutput += RV_RES.CANCEL;
		sbOutput += '</a> ';
	    sbOutput += '</td></tr></table></td> ';
	    sbOutput += '<td><img alt="" height="1"  ';
	    if ( isIE() )
	    {
	    	sbOutput += 'width="10"  ';
	    }

	    sbOutput += 'src="' + sWebContent + '/ps/images/space.gif"/></td> ';

	    sbOutput += '</tr></table> ';

	    return sbOutput;
 };
 
WorkingDialog.prototype.disableCancelButton = function(cancelLink) {
	this.cancelButtonDisabled = true;
	var workingDialogTable = document.getElementById('cvWorkingDialog' + this.getNamespace());
	if (workingDialogTable) {
		workingDialogTable.style.cursor="default";
		workingDialogTable.className = "commandButtonOver";
		workingDialogTable.removeAttribute("onmouseover");
		workingDialogTable.removeAttribute("onmouseout");
	}

	if (cancelLink) {
		cancelLink.removeAttribute("href");
		cancelLink.removeAttribute("onclick");
		cancelLink.style.cursor="default";
	}
};

WorkingDialog.prototype.enableCancelButton = function() {
	if (this.cancelButtonDisabled) {
		var cancelButtonContainer = document.getElementById("cancelButtonContainer" + this.getNamespace());
		if (cancelButtonContainer) {
			cancelButtonContainer.innerHTML = this.addCancelButton();
		}
		
		this.cancelButtonDisabled = false;
	}
};

WorkingDialog.prototype.getContainerId = function() {
	return "CVWait" + this.getNamespace();
};
 
 