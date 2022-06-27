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
// constants
CSubscriptionManager.k_SubscriptionWizardName = "subscriptionWizard";

function CSubscriptionManager(cv)
{
	this.m_cv = cv;

	/**
		@type boolean
		@private
	*/
	this.m_bInitialized = false;

	/**
		@type array
		@private
	*/
	this.m_aWatchRules = null;

	/**
		@type string
		@private
	*/
	this.m_sEmail = "";

	/**
		@type string
		@private
	*/
	this.m_sAlertNewVersionConfirm = "";

	/**
		@type boolean
		@private
	*/
	this.m_sQueryNotificationResponse = "";

	/**
		@type boolean
		@private
	*/
	this.m_bAllowNotification = false;

	/**
		@type boolean
		@private
	*/
	this.m_bAllowSubscription = false;

	/**
		@type boolean
		@private
	*/
	this.m_bCanCreateNewWatchRule = false;

	/**
		@type boolean
		@private
	*/
	this.m_bCanGetNotified = false;

	/**
		@type boolean
		@private
	*/
	this.m_bAllowAnnotations = false;

	/**
		@type boolean
		@private
	*/
	this.m_bCanCreateAnnotations = false;

	/**
		@type string
		@private
	*/
	this.m_windowOptions = "width=450,height=350,toolbar=0,location=0,status=0,menubar=0,resizable,scrollbars=1";
				//"width=500,height=350,toolbar=0,location=0,status=0,menubar=0,resizable,scrollbars=1";

}

CSubscriptionManager.prototype.getViewer = function() {
	return this.m_cv;
};

/**
	Initialize the subscription member variables with the server response
 */
CSubscriptionManager.prototype.Initialize = function(response)
{
	try
	{
		var oJSONResponse = response.getJSONResponseObject();
		var formWarpRequest = document.forms['formWarpRequest' + this.m_cv.getId()];

		if (oJSONResponse["annotationInfo"]) {
			var oAnnotationInfo = oJSONResponse["annotationInfo"];
			this.m_AnnotationsCount = oAnnotationInfo.annotations.length;
			// Push the whole annotations in current session
			this.m_annotations = oAnnotationInfo.annotations;
			this.m_bAllowAnnotations = oAnnotationInfo.allowAnnotations;
			this.m_bCanCreateAnnotations = oAnnotationInfo.traverse == "true";

			return true;
		}

		if (oJSONResponse["subscriptionInfo"])
		{
			var oSubscriptionInfo = oJSONResponse["subscriptionInfo"];
			if (!this.m_bInitialized)
			{
				this.m_sEmail = oSubscriptionInfo.sEmail;
				this.m_bAllowNotification = oSubscriptionInfo.bAllowNotification;
				this.m_bAllowSubscription = oSubscriptionInfo.bAllowSubscription;
				this.m_sAlertNewVersionConfirm = oSubscriptionInfo.sAlertNewVersionConfirm;

				if (formWarpRequest["ui.action"] && formWarpRequest["ui.action"].value == 'view')
				{
					/*
						Can the user create new watch rules
						- Report output is in HTML with interactive information
						- User has the 'Create and Run Watch Rules' capability
						- Alerts using watch rules are allowed for the report
					*/
					if (formWarpRequest["ui.format"])
					{
						this.m_bCanCreateNewWatchRule = (formWarpRequest["ui.format"].value == 'HTML') && this.m_cv.bCanUseCognosViewerConditionalSubscriptions && this.m_bAllowSubscription;
					}

					/*
					Can the user subscribe to notifications
						- the report must not be bursted
						- user cannot have scheduled the report
						- report must allow notifications
					 */
					this.m_bCanGetNotified = (!formWarpRequest["ui.burstKey"] || (formWarpRequest["ui.burstKey"] && formWarpRequest["ui.burstKey"].value == "")) && this.m_bAllowNotification;
				}
			}

			if (oSubscriptionInfo.sQueryNotificationResponse)
			{
				this.m_sQueryNotificationResponse = oSubscriptionInfo.sQueryNotificationResponse;
			}

			if (oSubscriptionInfo.aWatchRules)
			{
				var aWatchRules = oSubscriptionInfo.aWatchRules;

				this.m_aWatchRules = [];

				for (var i=0; i < aWatchRules.length; i++)
				{
					this.m_aWatchRules.push( aWatchRules[i] );
				}
			}

			this.m_bInitialized = true;

			return true;
		}
	}
	catch(exception)
	{
		return false;
	}

	return false;
};

/**
	Checks the current selection to see if it's valid for creating a new Watch Rule
 */
CSubscriptionManager.prototype.IsValidSelectionForNewRule = function()
{
	var selectionController = this.m_cv.getSelectionController();
	if (selectionController && !selectionController.hasSelectedChartNodes())
	{
		var selectedObjects = selectionController.getAllSelectedObjects();
		if (selectedObjects.length === 1)
		{
			if (selectedObjects[0] != null && selectedObjects[0].getLayoutType() != 'columnTitle')
			{
				return true;
			}
		}
	}

	return false;
};

/**
	Can the user create new watch rules
*/
CSubscriptionManager.prototype.CanCreateNewWatchRule = function()
{
	if (typeof this.m_cv.UIBlacklist != "undefined" && this.m_cv.UIBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_ALERT_USING_NEW_WATCH_RULE ') != -1)
	{
		return false;
	}

	// if we haven't been initialized yet and we're looking at saved output
	if (!this.m_bInitialized && this.getViewer().envParams["ui.action"] == 'view')
	{
		var oCV = this.getViewer();
		var request = new JSONDispatcherEntry(oCV);
		request.setKey("subscriptionManager");
		request.forceSynchronous();
		request.addFormField("ui.action", "getSubscriptionInfo");
		request.addFormField("cv.responseFormat", "subscriptionManager");
		request.addFormField("contextMenu", "true");
		this.addCommonFormFields(request);

		request.setCallbacks({"complete":{"object":this, "method":this.Initialize}});

		oCV.dispatchRequest(request);
	}

	return this.m_bCanCreateNewWatchRule;
};

/**
	Has the logic to determine if the current user can modify the Watch Rules
*/
CSubscriptionManager.prototype.CanModifyWatchRule = function()
{
	return this.m_cv.bCanUseCognosViewerConditionalSubscriptions && this.m_bAllowSubscription;
};

/**
	Has the logic to determine if the current user can subscribe to notifications
*/
CSubscriptionManager.prototype.CanGetNotified = function()
{
	if (typeof this.m_cv.UIBlacklist != "undefined" && this.m_cv.UIBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_ALERT_ABOUT_NEW_VERSIONS ') != -1)
	{
		return false;
	}

	return this.m_bCanGetNotified;
};

/**
	Updates the subscription dropdown menu
*/
CSubscriptionManager.prototype.UpdateSubscribeMenu = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	var subscribeButton = toolbar? toolbar.getItem("watchNewVersions") : null;
	var sWebContentRoot = this.m_cv.getWebContentRoot();
	var sSkin = this.m_cv.getSkin();

	if (subscribeButton)
	{
		var subscribeDropDownMenu = subscribeButton.getMenu();

		// Clear the menu
		this.ClearSubscriptionMenu();

		var bAddSeperator = false;

		if ( this.CanGetNotified() )
		{
			if (this.m_sQueryNotificationResponse == 'on')
			{
				new CMenuItem(subscribeDropDownMenu, RV_RES.RV_DO_NOT_ALERT_NEW_VERSION, "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().DeleteNotification();", sWebContentRoot + '/rv/images/action_remove_from_list.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				bAddSeperator = true;
			}
			else if (this.m_sQueryNotificationResponse == 'off' && this.m_sEmail != "")
			{
				new CMenuItem(subscribeDropDownMenu, RV_RES.RV_ALERT_NEW_VERSION, "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().AddNotification();", sWebContentRoot + '/rv/images/action_add_to_list.gif', gMenuItemStyle, sWebContentRoot, sSkin);
				bAddSeperator = true;
			}
		}

		if (this.CanCreateNewWatchRule())
		{
			if (bAddSeperator)
			{
				subscribeDropDownMenu.add(gMenuSeperator);
			}

			var newSubscription = new CMenuItem(subscribeDropDownMenu, RV_RES.RV_NEW_WATCH_RULE, "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().NewSubscription();", sWebContentRoot + '/rv/images/action_new_subscription.gif', gMenuItemStyle, sWebContentRoot, sSkin);

			if (!this.IsValidSelectionForNewRule())
			{
				newSubscription.disable();
			}

			bAddSeperator = true;
		}

		var sBlacklist = "";
		if (typeof this.m_cv.UIBlacklist != "undefined")
		{
			sBlacklist = this.m_cv.UIBlacklist;
		}

		var noWatchRules;
		//iterate through existing subscriptions
		if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES ') == -1)
		{
			if (bAddSeperator)
			{
				subscribeDropDownMenu.add(gMenuSeperator);
			}

			if ( this.m_aWatchRules && this.m_aWatchRules.length > 0)
			{
				var bCanModifyWatchRules = this.CanModifyWatchRule();

				for(var sub = 0; sub < this.m_aWatchRules.length; ++sub)
				{
					var menu = new CMenuItem(subscribeDropDownMenu, this.m_aWatchRules[sub].name, "", sWebContentRoot + "/rv/images/icon_subscription.gif", gMenuItemStyle, sWebContentRoot, sSkin);
					var subMenu = menu.createCascadedMenu(gMenuStyle);
					subMenu.m_oCV = this.m_cv;

					if (bCanModifyWatchRules && sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES_MODIFY ') == -1) {
						new CMenuItem(subMenu, RV_RES.RV_MODIFY_WATCH_RULE, this.m_cv.getObjectId() + ".getSubscriptionManager().ModifySubscription("+sub+");", sWebContentRoot + '/rv/images/action_edit.gif', gMenuItemStyle, sWebContentRoot, sSkin);
					}
					if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES_DELETE ') == -1)
					{
						new CMenuItem(subMenu, RV_RES.RV_DELETE_WATCH_RULE, this.m_cv.getObjectId() + ".getSubscriptionManager().DeleteSubscription("+sub+");", sWebContentRoot + '/rv/images/action_delete.gif', gMenuItemStyle, sWebContentRoot, sSkin);
					}
				}
			}
			else
			{
				noWatchRules = new CMenuItem(subscribeDropDownMenu, RV_RES.RV_NO_WATCH_RULES, "", '', gMenuItemStyle, sWebContentRoot, sSkin);
				noWatchRules.disable();
			}
		}

		if (subscribeDropDownMenu.getNumItems() == 0)
		{
			noWatchRules = new CMenuItem(subscribeDropDownMenu, RV_RES.RV_NO_WATCH_RULES, "", '', gMenuItemStyle, sWebContentRoot, sSkin);
			noWatchRules.disable();
		}

		// make sure we don't use the callback when drawing the menu
		subscribeDropDownMenu.setForceCallback(false);
		subscribeDropDownMenu.draw();
		if (subscribeDropDownMenu.isVisible()) {
			subscribeDropDownMenu.show();
		}
		// make sure our callback is used when the menu gets opened again
		subscribeDropDownMenu.setForceCallback(true);
	}
};
/**
	Updates the subscription dropdown menu
*/
CSubscriptionManager.prototype.UpdateAnnotationMenu = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	var annotationButton = toolbar? toolbar.getItem("addAnnotations") : null;
	var sWebContentRoot = this.m_cv.getWebContentRoot();
	var sSkin = this.m_cv.getSkin();

	var annotDropDownMenu = annotationButton.getMenu();

	// Clear the menu
	this.ClearAnnotationMenu();

	// add the create menu item
	var menu = new CMenuItem(annotDropDownMenu, RV_RES.RV_NEW_COMMENT, "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().NewAnnotation();", sWebContentRoot + "/rv/images/action_comment_add.gif", gMenuItemStyle, sWebContentRoot, sSkin);

	var annotationsCount = this.m_annotations.length;
	if (annotationsCount > 0) {
		annotDropDownMenu.add(gMenuSeperator);
	}

	// disable the item if allowAnnotations is false.
	if (!this.m_bAllowAnnotations || !this.m_bCanCreateAnnotations)
	{
		menu.disable();
	}


	//iterate through existing annotations
	var menuName;
	var bidi = isViewerBidiEnabled() ? BidiUtils.getInstance() : null;
	for(var i=0; i<annotationsCount; i++){

		var defName = this.m_annotations[i].defaultName ;
		menuName = defName.length>60 ? defName.substring(0, 60)+'...' : defName;
		if(isViewerBidiEnabled()){
			menuName = bidi.btdInjectUCCIntoStr(menuName, getViewerBaseTextDirection());
		}

		// check all the permissions
		var readPermission = Boolean(this.m_annotations[i].permissions.read);
		var modifyPermission = Boolean(this.m_annotations[i].permissions.write);
		var deletePermission = Boolean(this.m_annotations[i].permissions.traverse) && Boolean(this.m_annotations[i].permissions.write);

		var dispCmd = "javascript:" + this.m_cv.getObjectId() + ".getSubscriptionManager().ViewAnnotation("+i+");";
		var alertMsg = "javascript:alert('Permission denied')" ;
		dispCmd = readPermission ? dispCmd : alertMsg;

		// decide if we want to add a separator - which we do if the layoutElementId has changed
		if (i > 0 && this.m_annotations[i].layoutElementId != this.m_annotations[i-1].layoutElementId) {
			annotDropDownMenu.add(gMenuSeperator);
		}

		var menuItemImage = "/rv/images/action_comment.gif";
		if (this.m_annotations[i].layoutElementId != "") {
			menuItemImage = "/rv/images/action_subscribe.gif";
		}

		menu = new CMenuItem(annotDropDownMenu, menuName, dispCmd, sWebContentRoot + menuItemImage, gMenuItemStyle, sWebContentRoot, sSkin);

		// we only create the cascaded menu if can alter things
		var subMenu = menu.createCascadedMenu(gMenuStyle);
		

		// add an info pane to the top of the menu
		var infoPanel = new CInfoPanel("300px", sWebContentRoot, subMenu.getId() + "_comments");
		infoPanel.setParent(subMenu);

		// add all the properties that we want
		defName = this.m_annotations[i].defaultName ;
		var menuName1 = defName.length>60 ? defName.substring(0, 60)+'...' : defName;
		if(isViewerBidiEnabled()){
			menuName1 = bidi.btdInjectUCCIntoStr(menuName1, getViewerBaseTextDirection());
		}
		infoPanel.addProperty(RV_RES.RV_VIEW_COMMENT_NAME,html_encode(menuName1));
		infoPanel.addSpacer(4);
		

		var cmnt = this.m_annotations[i].description ;
		var shortComment = cmnt.length>590 ? cmnt.substring(0, 590)+'...' : cmnt;
		if(isViewerBidiEnabled()){
			shortComment = bidi.btdInjectUCCIntoStr(shortComment, getViewerBaseTextDirection());
		}
		infoPanel.addProperty(RV_RES.RV_VIEW_COMMENT_CONTENTS, replaceNewLine(html_encode(shortComment)));
		infoPanel.addSpacer(4);
		
		var modifyTime = this.m_annotations[i].modificationTime ;
		
		if(isViewerBidiEnabled()){
			modifyTime = bidi.btdInjectUCCIntoStr(modifyTime, getViewerBaseTextDirection());
		}

		infoPanel.addProperty(RV_RES.RV_VIEW_COMMENT_MODTIME,modifyTime);
		
		var ownerName = this.m_annotations[i].owner.defaultName ;
		
		if(isViewerBidiEnabled()){
			ownerName = bidi.btdInjectUCCIntoStr(ownerName, getViewerBaseTextDirection());
		}
		
		infoPanel.addProperty(RV_RES.RV_VIEW_COMMENT_OWNER, ownerName);

		// add the pane to the menu
		subMenu.add(infoPanel);

		// add a separator if we have actions
		if (modifyPermission || deletePermission) {
			subMenu.add(gMenuSeperator);
		}
		new CMenuItem(subMenu, RV_RES.RV_VIEW_COMMENT, this.m_cv.getObjectId() + ".getSubscriptionManager().ViewAnnotation("+i+");", sWebContentRoot + '/rv/images/action_comment_view.gif', gMenuItemStyle, sWebContentRoot, sSkin);
		if (modifyPermission) {
			new CMenuItem(subMenu, RV_RES.RV_MODIFY_WATCH_RULE, this.m_cv.getObjectId() + ".getSubscriptionManager().ModifyAnnotation("+i+");", sWebContentRoot + '/rv/images/action_comment_modify.gif', gMenuItemStyle, sWebContentRoot, sSkin);
		}
		if (deletePermission)
		{
			new CMenuItem(subMenu, RV_RES.RV_DELETE_WATCH_RULE, this.m_cv.getObjectId() + ".getSubscriptionManager().DeleteAnnotation("+i+");", sWebContentRoot + '/rv/images/action_comment_delete.gif', gMenuItemStyle, sWebContentRoot, sSkin);
		}
	}

	// make sure we don't use the callback when drawing the menu
	annotDropDownMenu.setForceCallback(false);
	annotDropDownMenu.draw();
	if (annotDropDownMenu.isVisible()) {
		annotDropDownMenu.show();
	}

	// make sure our callback is used when the menu gets opened again
	annotDropDownMenu.setForceCallback(true);
};


/**
	Called when the user clicked on the 'Alert Me About New Versions' link
*/
CSubscriptionManager.prototype.AddNotification = function()
{
	alert(this.m_sAlertNewVersionConfirm);
	var oCV = this.getViewer();
	var request = new DataDispatcherEntry(oCV);
	request.setKey("subscriptionManager");
	request.addFormField("ui.action", "addNotification");
	request.addFormField("cv.responseFormat", "data");
	this.addCommonFormFields(request);

	oCV.dispatchRequest(request);
};

/**
	Called when the user clicked on the 'Do Not Alert Me About New Versions' link
*/
CSubscriptionManager.prototype.DeleteNotification = function()
{
	alert(RV_RES.RV_DO_NOT_ALERT_NEW_VERSION_CONFIRM);
	var oCV = this.getViewer();
	var request = new DataDispatcherEntry(oCV);
	request.setKey("subscriptionManager");
	request.addFormField("ui.action", "deleteNotification");
	request.addFormField("cv.responseFormat", "data");
	this.addCommonFormFields(request);

	oCV.dispatchRequest(request);
};

/**
	Called when the user clicked on the 'Add annotation' link
*/
CSubscriptionManager.prototype.NewAnnotation = function()
{
	var oFWR = document.forms["formWarpRequest" + this.m_cv.getId()];
	var searchPath = oFWR["ui.object"].value;

	var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(), CSubscriptionManager.k_SubscriptionWizardName);

	GUtil.createFormField(form, "ui.object", searchPath);
	GUtil.createFormField(form, "b_action", "xts.run");
	GUtil.createFormField(form, "m", "rv/annotation1.xts");
	GUtil.createFormField(form, "backURL", "javascript:window.close();");
	GUtil.createFormField(form, "action_hint", "create");

	var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
	window.open(sPath, form.target, this.m_windowOptions);
};

/**
	Called when the user clicked on an annotation' link
*/

CSubscriptionManager.prototype.ViewAnnotation = function(idx)
{
	var sub = this.m_annotations[idx];
	var searchPath = sub.searchPath;
	var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(), CSubscriptionManager.k_SubscriptionWizardName);

	GUtil.createFormField(form, "ui.object", searchPath);
	GUtil.createFormField(form, "b_action", "xts.run");
	GUtil.createFormField(form, "m", "rv/annotation1.xts");
	GUtil.createFormField(form, "backURL", "javascript:window.close();");

	var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
	window.open(sPath, form.target, this.m_windowOptions);
};

/**
	User clicked the 'Modify...' link for a Watch Rule
	@param idx - index of the rule that was clicked on
*/
CSubscriptionManager.prototype.ModifyAnnotation = function(idx)
{
	var sub = this.m_annotations[idx];
	var searchPath = this.m_annotations[idx].searchPath;
	// we need report version here
	if (sub && searchPath)
	{
		var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(),
										CSubscriptionManager.k_SubscriptionWizardName);


		GUtil.createFormField(form, "ui.object", searchPath);
		GUtil.createFormField(form, "b_action", "xts.run");
		GUtil.createFormField(form, "m", "rv/annotation1.xts");
		GUtil.createFormField(form, "backURL", "javascript:window.close();");
		GUtil.createFormField(form, "action_hint", "save");

		var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
		window.open(sPath, form.target, this.m_windowOptions);
	}
};

/**
	Deletes an Annotation
	@param idx - index of the rule that was clicked on
*/
CSubscriptionManager.prototype.DeleteAnnotation = function(idx)
{
	var sub = this.m_annotations[idx];
	if (sub && sub.searchPath && confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE))
	{
		var oCV = this.getViewer();
		var request = new DataDispatcherEntry(oCV);
		request.setKey("subscriptionManager");
		request.addFormField("ui.action", "deleteAnnotation");
		request.addFormField("cv.responseFormat", "data");
		this.addCommonFormFields(request, sub.searchPath);

		oCV.dispatchRequest(request);
	}
};

/**
	Called when the user clicked on the 'Alert Using New Watch Rule' link
*/
CSubscriptionManager.prototype.NewSubscription = function()
{
	var sc = this.m_cv.getSelectionController();

	var oFWR = document.forms["formWarpRequest" + this.m_cv.getId()];
	var searchPath = oFWR.reRunObj.value;

	if (searchPath && sc && sc.getAllSelectedObjects().length === 1 )
	{
		var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(), CSubscriptionManager.k_SubscriptionWizardName);

		var fWR = document.getElementById("formWarpRequest" + this.m_cv.getId());

		var selectionXml = new CSelectionXml(	fWR["ui.burstID"].value,
												fWR["ui.contentLocale"].value,
												fWR["ui.outputLocale"].value
											);

		selectionXml.BuildSelectionFromController(sc);

		//display a selectable-prompt containing the xml output -- TESTING ONLY
		//prompt("SelectionXML: ", selectionXml.toXml());

		GUtil.createFormField(form, "rv.selectionSpecXML", selectionXml.toXml());
		GUtil.createFormField(form, "rv.periodicalProducer", searchPath);
		GUtil.createFormField(form, "b_action", "xts.run");
		GUtil.createFormField(form, "m", "subscribe/conditional_subscribe1.xts");
		GUtil.createFormField(form, "backURL", "javascript:window.close();");

		var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
		window.open(sPath, form.target, "toolbar,location,status,menubar,resizable,scrollbars=1");
	}
	else
	{
		// for debugging
		// alert("Invalid Context: sc: " + sc + "\n searchPath: " + searchPath);
	}
};

/**
	Deletes a watch rule
	@param idx - index of the rule that was clicked on
*/
CSubscriptionManager.prototype.DeleteSubscription = function(idx)
{
	var sub = this.m_aWatchRules[idx];
	if (sub && sub.searchPath && confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE))
	{
		var oCV = this.getViewer();
		var request = new DataDispatcherEntry(oCV);
		request.setKey("subscriptionManager");
		request.addFormField("ui.action", "deleteSubscription");
		request.addFormField("cv.responseFormat", "data");
		this.addCommonFormFields(request, sub.searchPath);

		oCV.dispatchRequest(request);
	}
};

/**
	User clicked the 'Modify...' link for a Watch Rule
	@param idx - index of the rule that was clicked on
*/
CSubscriptionManager.prototype.ModifySubscription = function(idx)
{
	var sub = this.m_aWatchRules[idx];
	if (sub && sub.searchPath)
	{
		var form = GUtil.createHiddenForm("subscriptionForm", "post", this.m_cv.getId(),
										CSubscriptionManager.k_SubscriptionWizardName);

		GUtil.createFormField(form, "m_obj", sub.searchPath);
		GUtil.createFormField(form, "m_name", sub.name);
		GUtil.createFormField(form, "b_action", "xts.run");
		GUtil.createFormField(form, "m_class", "reportDataServiceAgentDefinition");
		GUtil.createFormField(form, "m", "portal/properties_subscription.xts");
		GUtil.createFormField(form, "backURL", "javascript:window.close();");

		var sPath = this.m_cv.getWebContentRoot() + "/rv/blankSubscriptionWin.html?cv.id=" + this.m_cv.getId();
		window.open(sPath, form.target, "toolbar,location,status,menubar,resizable,scrollbars=1");
	}
};

/**
	Does an AJAX call to get the needed information, and then updated the
	drop down menu
*/
CSubscriptionManager.prototype.OpenSubscriptionMenu = function()
{
	var oCV = this.getViewer();
	var request = new JSONDispatcherEntry(oCV);
	request.setKey("subscriptionManager");
	request.addFormField("ui.action", "getSubscriptionInfo");
	request.addFormField("cv.responseFormat", "subscriptionManager");
	this.addCommonFormFields(request);

	request.setCallbacks({"complete":{"object":this, "method":this.OpenSubscriptionMenuResponse}});

	oCV.dispatchRequest(request);
};

/**
	Does an AJAX call to get the needed information, and then updated the
	drop down menu
*/
CSubscriptionManager.prototype.OpenAnnotationMenu = function()
{
	var oCV = this.getViewer();
	var request = new JSONDispatcherEntry(oCV);
	request.setKey("subscriptionManager");
	request.addFormField("ui.action", "getAnnotationInfo");
	request.addFormField("cv.responseFormat", "getAnnotations");
	var uiObject = oCV.envParams["ui.object"];
	this.addCommonFormFields(request, uiObject ? uiObject : "");

	request.setCallbacks({"complete":{"object":this, "method":this.OpenAnnotationMenuResponse}});

	oCV.dispatchRequest(request);
};

/**
	OpenSubscriptionMenuCallback will initialzie the CSubscriptionManager object and open the menu
	@param {httpRequest} the XML response from the viewer
*/
CSubscriptionManager.prototype.OpenAnnotationMenuResponse = function(response)
{
	if (this.Initialize(response)) {
		this.UpdateAnnotationMenu();
	}
	else {
		// something bad happened, just clear the menu
		this.ClearAnnotationMenu();
	}
};



/**
	OpenSubscriptionMenuCallback will initialzie the CSubscriptionManager object and open the menu
	@param {httpRequest} the XML response from the viewer
*/
CSubscriptionManager.prototype.OpenSubscriptionMenuResponse = function(response)
{
	if (this.Initialize(response))
	{
		this.UpdateSubscribeMenu();
	}
	else
	{
		// something bad happened, just clear the menu
		this.AddEmptySubscriptionMenuItem();
	}
};

CSubscriptionManager.prototype.addCommonFormFields = function(request, searchPath) {
	if (searchPath && searchPath != "") {
		request.addFormField("ui.object", searchPath);
	}
	else {
		var formWarpRequest = document["formWarpRequest" + this.getViewer().getId()];
		if (formWarpRequest && formWarpRequest["reRunObj"]) {
			request.addFormField("ui.object", formWarpRequest["reRunObj"].value);
		}
	}

	// if we're already initialized it'll cut down on the number of CM queries we need to do
	if (request.getFormField("ui.action") == "getSubscriptionInfo") {
		request.addFormField("initialized", this.m_bInitialized ? "true" : "false");
	}

	request.addFormField("cv.id", this.getViewer().getId());
};

/**
 * When there's nothing else to show in the Subscription menu, show
 * a disabled menu item
 */
CSubscriptionManager.prototype.AddEmptySubscriptionMenuItem = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	if (toolbar)
	{
		var subscribeButton = toolbar.getItem("watchNewVersions");
		if (subscribeButton)
		{
			subscribeButton.getMenu().clear();
		}

		var sWebContentRoot = this.m_cv.getWebContentRoot();
		var sSkin = this.m_cv.getSkin();
		var subscribeDropDownMenu = subscribeButton.getMenu();
		var noWatchRules = new CMenuItem(subscribeDropDownMenu, RV_RES.RV_NO_WATCH_RULES, "", '', gMenuItemStyle, sWebContentRoot, sSkin);
		noWatchRules.disable();

		// make sure we don't use the callback when drawing the menu
		subscribeDropDownMenu.setForceCallback(false);
		subscribeDropDownMenu.draw();
		if (subscribeDropDownMenu.isVisible()) {
			subscribeDropDownMenu.show();
		}

		// make sure our callback is used when the menu gets opened again
		subscribeDropDownMenu.setForceCallback(true);
	}
};

/**
	Removes all the menu items from the 'Watch New Versions' menu
*/
CSubscriptionManager.prototype.ClearSubscriptionMenu = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	if (toolbar)
	{
		var subscribeButton = toolbar.getItem("watchNewVersions");
		if (subscribeButton)
		{
			subscribeButton.getMenu().clear();
		}
	}
};

/**
	Removes all the menu items from the 'add Annotations' menu
*/
CSubscriptionManager.prototype.ClearAnnotationMenu = function()
{
	var toolbar = this.getStandaloneViewerToolbarControl();
	if (toolbar)
	{
		var annotationButton = toolbar.getItem("addAnnotations");
		if (annotationButton)
		{
			annotationButton.getMenu().clear();
		}
	}
};

/**
	Removes all the menu items from the 'add Annotations' menu
*/
CSubscriptionManager.prototype.ClearContextAnnotationMenu = function()
{
	var contextMenu = this.getStandaloneViewerContextMenu();
	if (contextMenu)
	{
		var commentFindAnnotationsMenu = contextMenu.getFindCommentMenuItem();
		if (commentFindAnnotationsMenu)
		{
			commentFindAnnotationsMenu.getMenu().clear();
		}
	}
};

CSubscriptionManager.prototype.getStandaloneViewerToolbarControl = function()
{
	if(typeof this.m_cv.rvMainWnd != "undefined" && this.m_cv.rvMainWnd != null && typeof this.m_cv.rvMainWnd.getToolbarControl == "function")
	{
		return this.m_cv.rvMainWnd.getToolbarControl();
	}
	else
	{
		return null;
	}
};

CSubscriptionManager.prototype.getStandaloneViewerContextMenu = function()
{
	if(typeof this.m_cv.rvMainWnd != "undefined" && this.m_cv.rvMainWnd != null && typeof this.m_cv.rvMainWnd.getContextMenu == "function")
	{
		return this.m_cv.rvMainWnd.getContextMenu();
	}
	else
	{
		return null;
	}
};
