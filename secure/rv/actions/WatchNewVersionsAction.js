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

function WatchNewVersionsAction()
{
	this.m_requestParms = {subAction:""};
}
WatchNewVersionsAction.prototype = new CognosViewerAction();

WatchNewVersionsAction.prototype.setRequestParms = function(requestParms)
{
	this.m_requestParms = requestParms;
};

WatchNewVersionsAction.prototype.execute = function()
{
	var subscriptionManager = this.m_oCV.getSubscriptionManager();

	switch(this.m_requestParms.subAction)
	{
		case "loadMenu":
			this.loadMenu(this.m_requestParms.contextMenu);
			break;
		case "close":
			this.closeMenu();
			break;
		case "DeleteNotification":
			subscriptionManager.DeleteNotification();
			break;
		case "AddNotification":
			subscriptionManager.AddNotification();
			break;
		case "NewSubscription":
			subscriptionManager.NewSubscription();
			break;
		case "ModifySubscription":
			subscriptionManager.ModifySubscription(this.m_requestParms.subscriptionId);
			break;
		case "DeleteSubscription":
			subscriptionManager.DeleteSubscription(this.m_requestParms.subscriptionId);
			break;
	}
};

WatchNewVersionsAction.prototype.closeMenu = function() {
	var buttonSpec = this.m_oCV.findToolbarItem("WatchNewVersions");
	this.resetMenu(buttonSpec);

	var viewerString = getCognosViewerObjectRefAsString(this.m_oCV.getId());

	// we need to do a set time to let the original menu destroy itself before we go and create a new one
	setTimeout(viewerString + ".getViewerWidget().fireEvent(\"com.ibm.bux.widgetchrome.toolbar.update\", null, [" + viewerString + ".findToolbarItem(\"WatchNewVersions\")]);", 1);
};

WatchNewVersionsAction.prototype.resetMenu = function(jsonSpec) {
	jsonSpec.open = false;
	jsonSpec.action = {name: "WatchNewVersions", payload: {subAction:"loadMenu", contextMenu:false}};
	jsonSpec.closeAction = null; 

	var menuItems = [];
	menuItems.push({ name: "loadng", label: RV_RES.GOTO_LOADING, iconClass: "loading"});
	jsonSpec.items = menuItems;
};


WatchNewVersionsAction.prototype.updateMenu = function(jsonSpec)
{
	var items = jsonSpec.items;
	var subscriptionManager = this.m_oCV.getSubscriptionManager();

	// context menu won't have any items
	if (!items || items.length === 0){
		jsonSpec.visible = subscriptionManager.CanCreateNewWatchRule();
		jsonSpec.disabled = !(subscriptionManager.IsValidSelectionForNewRule());
	}
	else {
		// we always want to repopulate the toolbar menu, so reset it every time updaetMenu gets called
		this.resetMenu(jsonSpec);
	}

	return jsonSpec;
};

WatchNewVersionsAction.prototype.loadMenu = function(contextMenu)
{
	var subscriptionManager = this.m_oCV.getSubscriptionManager();
	var cvId = this.m_oCV.getId();

	var oCV = this.m_oCV;
	var request = new JSONDispatcherEntry(oCV);
	request.addFormField("ui.action", "getSubscriptionInfo");
	request.addFormField("cv.responseFormat", "subscriptionManager");
	request.addFormField("contextMenu", contextMenu == true ? "true" : "false");
	subscriptionManager.addCommonFormFields(request, "");
	
	request.setCallbacks({"complete":{"object":this, "method":this.openSubscriptionMenuResponse}});
	
	oCV.dispatchRequest(request);		
};

WatchNewVersionsAction.prototype.openSubscriptionMenuResponse = function(response)
{
	var subscriptionManager = this.m_oCV.getSubscriptionManager();
	subscriptionManager.Initialize(response);

	var menuItems = [];

	// Clear the menu
	subscriptionManager.ClearSubscriptionMenu();

	var bAddSeperator = false;

	if ( subscriptionManager.CanGetNotified() )
	{
		if (subscriptionManager.m_sQueryNotificationResponse == 'on')
		{
			menuItems.push({ name: "DeleteNotification", label: RV_RES.RV_DO_NOT_ALERT_NEW_VERSION, iconClass: "deleteNotification", action: { name: "WatchNewVersions", payload: {subAction:"DeleteNotification"} }, items: null });
			bAddSeperator = true;
		}
		else if (subscriptionManager.m_sQueryNotificationResponse == 'off' && subscriptionManager.m_sEmail != "")
		{
			menuItems.push({ name: "AddNotification", label: RV_RES.RV_ALERT_NEW_VERSION, iconClass: "addNotification", action: { name: "WatchNewVersions", payload: {subAction:"AddNotification"} }, items: null });
			bAddSeperator = true;
		}
	}

	if (subscriptionManager.CanCreateNewWatchRule())
	{
		if (bAddSeperator)
		{
			menuItems.push({separator: true});
		}

		var newSubScriptionMenuItem = { name: "NewSubscription", label: RV_RES.RV_NEW_WATCH_RULE, iconClass: "newSubscription", action: { name: "WatchNewVersions", payload: {subAction:"NewSubscription"} }, items: null };
		if (!subscriptionManager.IsValidSelectionForNewRule())
		{
			newSubScriptionMenuItem.disabled = true;
		}

		menuItems.push(newSubScriptionMenuItem);
		bAddSeperator = true;
	}

	var sBlacklist = "";
	if (typeof this.m_oCV.UIBlacklist != "undefined")
	{
		sBlacklist = this.m_oCV.UIBlacklist;
	}

	//iterate through existing subscriptions
	if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES ') == -1)
	{
		if ( subscriptionManager.m_aWatchRules && subscriptionManager.m_aWatchRules.length > 0)
		{
			if (bAddSeperator)
			{
				menuItems.push({separator: true});
			}

			var bCanModifyWatchRules = subscriptionManager.CanModifyWatchRule();

			for(var sub = 0; sub < subscriptionManager.m_aWatchRules.length; ++sub)
			{
				var menu = { name: "WatchRule" + sub, label: subscriptionManager.m_aWatchRules[sub].name, iconClass: "watchRule", action: null, items: [] };
				if (bCanModifyWatchRules && sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES_MODIFY ') == -1)
				{
					menu.items.push({ name: "ModifySubscription" + sub, label: RV_RES.RV_MODIFY_WATCH_RULE, iconClass: "modifySubscription", action: { name: "WatchNewVersions", payload: {subAction:"ModifySubscription", subscriptionId:sub} }, items: null });
				}
				if (sBlacklist.indexOf(' RV_TOOLBAR_BUTTONS_RULES_DELETE ') == -1)
				{
					menu.items.push({ name: "DeleteSubscription" + sub, label: RV_RES.RV_DELETE_WATCH_RULE, iconClass: "deleteSubscription", action: { name: "WatchNewVersions", payload: {subAction:"DeleteSubscription", subscriptionId:sub} }, items: null });
				}

				menuItems.push(menu);
			}
		}
	}

	if (menuItems.length === 0)
	{
		menuItems.push({ name: "NoWatchRules", label: RV_RES.RV_NO_WATCH_RULES, iconClass: "", action: null, items: null, disabled:true });
	}

	var buttonSpec = this.m_oCV.findToolbarItem("WatchNewVersions");
	if (buttonSpec) {
		buttonSpec.items = menuItems;
		buttonSpec.action = null;
		buttonSpec.open = true;
		buttonSpec.closeAction = { name: "WatchNewVersions", payload: {subAction:"close"} };

		var updateItems = [];
		updateItems.push(buttonSpec);
		this.m_oCV.getViewerWidget().fireEvent("com.ibm.bux.widgetchrome.toolbar.update", null, updateItems);
	}
};