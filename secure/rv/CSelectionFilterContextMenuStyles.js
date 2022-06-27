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


function CSelectionFilterContextMenuStyles(selectionController){
	CSelectionDefaultStyles.call( this, selectionController );
	this.m_secondarySelectionIsDisabled = true;

};

CSelectionFilterContextMenuStyles.prototype = new CSelectionDefaultStyles( );