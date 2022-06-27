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

/**
 * Used for QS only. They'll build a CCognosViewerRequest and call CCognosViewer.sendRequest where
 * we'll switch from a CCognosViewerRequest to a ViewerDispatcherEntry
 * @param {Object} sAction
 */

/**
	@constructor
	@param sAction {string} See {@link #setAction} method for possible values.
	@type CCognosViewerRequest
*/
function CCognosViewerRequest(sAction)
{
	/**
		@private
		@type string
	*/
	this.m_sAction = "";
	/**
		@private
		@type CDictionary
		@deprecated
	*/
	this.m_oOptions = new CDictionary();
	/**
		@private
		@type CDictionary
		@deprecated
	*/
	this.m_oParams = new CDictionary();

	/**
	 * @private
	 * @type CDictionary
	 */
	this.m_oFormFields = new CDictionary();

	/**
	 * @private
	 * @type string
	 */
	this.m_sRequestType = "ajax";

	/**
	 * The callback to be executed
	 * @private
	 */
	this.m_callback = null;

	this.setAction(sAction);


}

/**
 * Sets the callback function to be executed
 * @param callbackFunction (function)
 */
CCognosViewerRequest.prototype.setCallback = function(callback)
{
	this.m_callback = callback;
};

/**
 * Returns the callback function to be used
 * @return (function)
 */
CCognosViewerRequest.prototype.getCallback = function()
{
	return this.m_callback;
};

/**
 * Sets the request type (ajax,post,get)
 * @param string
 */
CCognosViewerRequest.prototype.setRequestType = function(sRequestType)
{
	if(typeof sRequestType != "undefined" && typeof sRequestType == "string")
	{
		if(sRequestType.match(/\ajax\b|\bpost\b|\bget\b/i))
		{
			this.m_sRequestType = sRequestType;
		}
	}
};

/**
 * Returns the request type
 * @return string
 */
CCognosViewerRequest.prototype.getRequestType = function()
{
	return this.m_sRequestType;
};

/**
	Add a option (name/value pair). See URL Api for possible options.
	@param {string} sName
	@param {string} sValue
	@deprecated
*/
CCognosViewerRequest.prototype.addOption = function(sName, sValue)
{
	this.m_oOptions.add(sName, sValue);
};

/**
	Remove an option (by name). See URL Api for possible options.
	@param {string} sName
	@param {string} sValue
	@deprecated
*/
CCognosViewerRequest.prototype.removeOption = function(sName)
{
	this.m_oOptions.remove(sName);
};

/**
	Add a parameter name/value pair to this request (for prompts).
	@param {string} sName
	@param {string} sValue
	@deprecated
*/
CCognosViewerRequest.prototype.addParameter = function(sName, sValue)
{
	this.m_oParams.add(sName, sValue);
};

/**
 * Adds a form field to the request
 * @param (string) sName
 * @param (string) sValue
 */
 CCognosViewerRequest.prototype.addFormField = function(sName, sValue)
 {
	this.m_oFormFields.add(sName, sValue);
 };

 /**
  * Returns the list of form fields associated with the request
  * @return CDictionary
  */
 CCognosViewerRequest.prototype.getFormFields = function()
 {
	return this.m_oFormFields;
 };

/**
	@type string
*/
CCognosViewerRequest.prototype.getAction = function()
{
	return this.m_sAction;
};

/**
	@param {string} sName
	@type string
	@deprecated
*/
CCognosViewerRequest.prototype.getOption = function(sName)
{
	return this.m_oOptions.get(sName);
};

/**
	@param {string} sName
	@type string
	@deprecated
*/
CCognosViewerRequest.prototype.getParameter = function(sName)
{
	return this.m_oParams.get(sName);
};

/**
	@param {string} sName
	@type bool
	@deprecated
*/
CCognosViewerRequest.prototype.hasOption = function(sName)
{
	return this.m_oOptions.exists(sName);
};

/**
	@param {string} sName
	@type bool
	@deprecated
*/
CCognosViewerRequest.prototype.hasParameter = function(sName)
{
	return this.m_oParams.exists(sName);
};

/**
	@param sAction {string} possible values: <ul><li>add</li><li>back</li><li>cancel</li><li>currentPage</li><li>drill</li><li>email</li><li>firstPage</li><li>forward</li><li>getOutput</li><li>lastPage</li><li>nextPage</li><li>previousPage</li><li>print</li><li>release</li><li>render</li><li>run</li><li>runSpecification</li><li>save</li><li>saveas</li><li>wait</li></ul>
*/
CCognosViewerRequest.prototype.setAction = function(sAction)
{
	this.m_sAction = sAction;
};


