/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

function CSelectionDefaultStyles( selectionController )
{	
	
	this.m_primarySelectionColor = null;
	
	this.m_highContrastBorderStyle = "solid";

	this.m_secondarySelectionIsDisabled = false;

	if (selectionController ) 
	{
		this.m_selectionController = selectionController;
		this.m_oCognosViewer = selectionController.m_oCognosViewer;
		if( this.m_oCognosViewer )
		{		
			var configUI = this.m_oCognosViewer.getUIConfig();
			if (configUI) 
			{
				if (configUI.getPrimarySelectionColor()) {
					this.m_primarySelectionColor = configUI.getPrimarySelectionColor();
				}

				if (!configUI.getShowSecondarySelection()) {
					this.m_secondarySelectionIsDisabledConfig = true;
				}
				else if (configUI.getSeondarySelectionColor()) {
					this.m_secondarySelectionColor = configUI.getSeondarySelectionColor();
				}
			}
			
		}

	}
};


CSelectionDefaultStyles.prototype.getPrimarySelectionColor = function(contextIds)
{
	return this.m_primarySelectionColor;
};

CSelectionDefaultStyles.prototype.getSecondarySelectionColor = function()
{
	return this.m_secondarySelectionColor;
};

CSelectionDefaultStyles.prototype.getHighContrastBorderStyle = function()
{
	return this.m_highContrastBorderStyle;
};

CSelectionDefaultStyles.prototype.canApplyToSelection = function( contextIds )
{
	return true;
};

CSelectionDefaultStyles.prototype.secondarySelectionIsDisabled = function()
{
	return this.m_secondarySelectionIsDisabled;
};

CSelectionDefaultStyles.prototype.setStyleForSelection = function()
{
	//do nothing for default style
};

