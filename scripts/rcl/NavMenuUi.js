/**
    Copyright 2001-2008, Focus Technologies LLC.
    All rights reserved.
**/

// $Id: NavMenuUi.js 7181 2010-05-12 19:04:25Z dsellari $


//-----------------------------------------------------------------------------
/**
 * I am the UI model for the NavMenu screen...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function NavMenuUiModel ()
{
}






//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the NavMenu screen...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function NavMenuUiController (aDocument, aModel, aMenuBar)
{
   if (arguments.length > 0)
   {
      AbstractUiController.prototype.constructor.call(this, aDocument);
      this.model = aModel;
      this.menuBar = aMenuBar;
   }
}

//--- This class extends AbstractUiController
NavMenuUiController.prototype = new AbstractUiController();
NavMenuUiController.prototype.constructor = NavMenuUiController;
NavMenuUiController.superclass = AbstractUiController.prototype;



/**
 * called once (after document is fully loaded) to initialize the user interface
 **/
NavMenuUiController.prototype.initUi = function()
{
   this.menuBar.insertIntoDocument();
   this.menuBar.openAllGroups();
};


/**
 * favorite link was clicked...
 **/
NavMenuUiController.prototype.favoriteClicked = function(anId)
{
   window.status = "favorite was clicked [" + anId + "]";
};

/**
 * folder was clicked...
 **/
NavMenuUiController.prototype.folderClicked = function(anId)
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/folderContents.do?folderId=" + anId;
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
};

/**
 * navigate to the browse user outputs screen
 **/
NavMenuUiController.prototype.browseReportOutputs = function(aNumberOfPastDays)
{
   var pastDaysParam = aNumberOfPastDays ? '?numberOfPastDays=' + aNumberOfPastDays : '';

   var url = ServerEnvironment.baseUrl + "/secure/actions/browseReportInstances.do" + pastDaysParam;
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
};

/**
 * navigate to the admin browse all outputs screen
 **/
NavMenuUiController.prototype.adminBrowseReportOutputs = function(aNumberOfPastDays)
{
   var pastDaysParam = aNumberOfPastDays ? '?numberOfPastDays=' + aNumberOfPastDays : '';

   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/browseReportInstances.do" + pastDaysParam;
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
};

NavMenuUiController.prototype.browseSchedules = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/browseSchedules.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
};

NavMenuUiController.prototype.adminBrowseSchedules = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin//browseSchedules.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
};

/**
* navigate to the "my report central" screen
**/
NavMenuUiController.prototype.launchReportWizard = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/reportWizard.do?wizardStep=initialize";

   var geom = new BrowserGeometry();
   var windowName = ServerEnvironment.windowNamePrefix + "_RCL_ReportWizard";
   var win = JsUtil.openNewWindow(url,
                     windowName,
                     "width=1000,height=750,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=no");

   win.focus();
};

/**
* launch query studio in a window
**/
NavMenuUiController.prototype.launchQueryStudio = function()
{
   if( crnPackagePaths.length > 1 )
   {
      top.frames["workSpace"].DialogUtil.openPackageDialog(crnPackagePaths, crnPackageNames,this.finishLaunchingQueryStudio, this.doNothing);
   }
   else
   {
      var pathObject = new Object();
      pathObject.value = crnPackagePaths[0];
      this.finishLaunchingQueryStudio( pathObject );
   }
};

NavMenuUiController.prototype.doNothing = function()
{
};

NavMenuUiController.prototype.finishLaunchingQueryStudio = function( aPackagePath )
{
   var url = ServerEnvironment.crnEndPoint + "?b_action=xts.run&m=qs/qs.xts&method=newQuery&obj=" + aPackagePath.value;

   var geom = new BrowserGeometry();
   var windowName = "_blank";
   win = window.open(url,
                     windowName,
                     "width=1000,height=750,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

   win.focus();
};

/**
* launch url in new browser window
**/
NavMenuUiController.prototype.launchInBrowserWindow = function(aUrl, aWindowName)
{
   var geom = new BrowserGeometry();

   var win = JsUtil.openNewWindow(aUrl,
                     aWindowName,
                     "width=1024,height=768,top=" + geom.top + ",left=" + geom.left + ",address=yes,menubar=yes,toolbar=yes,scrollbars=yes,resizable=yes,status=yes");

   win.focus();
};



/**
 * navigate to the "my report central" screen
 **/
NavMenuUiController.prototype.showMyReportCentral = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/dashboard.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
};

/**
 * navigate to the "messages" screen
 **/
NavMenuUiController.prototype.showMyMessages = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/viewUserMessages.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
};

/**
 * navigate to the user preferences screen
 **/
NavMenuUiController.prototype.showUserPreferences = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/editUserPreference.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
};

/**
 * logout...
 **/
NavMenuUiController.prototype.logOut = function()
{
   window.location.href = ServerEnvironment.baseUrl + "/logout.do";
};

NavMenuUiController.prototype.manageUserContent = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageUserContent.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageFolders = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageFolders.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageCapabilities = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageCapabilities.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}


NavMenuUiController.prototype.manageReports = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageReports.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageSystemJobs = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageSystemJobs.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageIncidents = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageIncidents.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}


NavMenuUiController.prototype.manageCustomPrompts = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageCustomPrompts.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageProcessorChains=function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageRerProcessorChains.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageUsers = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageUsers.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageOrganizations = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageOrganizations.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageFragments = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageFragments.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageAnnouncements = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageAnnouncements.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.flushCaches = function()
{

   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/flushCaches.do";
   this.launchInBrowserWindow(url,'flushConsole');

}

NavMenuUiController.prototype.debugClassLoader = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/debugClassLoader.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.cleanupOldRers = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/cleanupOldRers.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.downloadServerLogs = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/downloadServerLogs.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.viewCrnProxyCache = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/viewCrnProxyCache.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}



NavMenuUiController.prototype.scanReports = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/scanReports.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}


NavMenuUiController.prototype.manageConfigProperties = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageConfigProperties.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);
}

NavMenuUiController.prototype.manageReportService = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageReportService.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.manage = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/adminService/manage.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.metaDataMenu = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/metaDataMenu.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.menu = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/reportMd/menu.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.manageSampleParameterValues = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/manageSampleParameterValues.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.sessionStats = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/sessionStats.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.showActiveUserSessions = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/showActiveUserSessions.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.incidentLookup = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/incidentLookup.do";
   this.getFrameSetUiController().changeWorkSpaceUrl(url);

}

NavMenuUiController.prototype.adminConsole = function()
{
   var url = ServerEnvironment.baseUrl + "/secure/actions/admin/console.do";
   this.launchInBrowserWindow(url,'adminConsole');
}

