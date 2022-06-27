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

function CSelectionFilterStyles( selectionController )
{
	this.m_selectionController = selectionController;
	
	this.m_primarySelectionColor = this.m_primarySelectionFilterColor = '#44BFDD';
	
	this.m_primarySelectionFilterColorForMeasure = null;
	
	this.m_secondarySelectionColor = null;
	
	this.m_highContrastBorderStyle = "dotted";

	this.m_secondarySelectionIsDisabled = true;
};

CSelectionFilterStyles.prototype = new CSelectionDefaultStyles( );

CSelectionFilterStyles.prototype.getPrimarySelectionColor = function(contextIds)
{
	return this.m_primarySelectionColor;
};

CSelectionFilterStyles.prototype.getSecondarySelectionColor = function()
{
	return this.m_secondarySelectionColor;
};

CSelectionFilterStyles.prototype.getHighContrastBorderStyle = function()
{
	return this.m_highContrastBorderStyle;
};

CSelectionFilterStyles.prototype.secondarySelectionIsDisabled = function()
{
	return this.m_secondarySelectionIsDisabled;
};

CSelectionFilterStyles.prototype.canApplyToSelection = function( contextIds )
{
	return !this.selectionHasOnlyMeasure( contextIds );

};

CSelectionFilterStyles.prototype.selectionHasOnlyMeasure = function( contextIds )
{
	return ( contextIds.length === 1 && contextIds[0].length === 1 && this.m_selectionController.isMeasure(contextIds[0][0]) );
};

/**
 * Should be called just before applying styles to selection
 */
CSelectionFilterStyles.prototype.setStyleForSelection = function( contextIds )
{
	this.m_primarySelectionColor = ( this.selectionHasOnlyMeasure( contextIds)) ? null : this.m_primarySelectionFilterColor;
};
