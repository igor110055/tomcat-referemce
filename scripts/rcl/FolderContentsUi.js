/**
 Copyright 2001-2008, Focus Technologies LLC.
 All rights reserved.
 **/

// $Id: FolderContentsUi.js 7194 2010-06-23 15:06:30Z dbequeaith $


function CustomPrompt(aName, aDescription, anActionPath)
{
   this.name = aName;
   this.description = aDescription;
   this.actionPath = anActionPath;
   this.selected = null;
}


//-----------------------------------------------------------------------------
/**
 * I represent a "type" of content view item...
 *
 * @param aTypeName - the type name...
 * @param anIconSrc - this source for icons for this type...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ContentViewItemType(aName, anEnum, anIconSrc)
{
   this.name = aName;
   this.jsEnum = anEnum;
   this.iconSrc = anIconSrc;
}

//-----------------------------------------------------------------------------
/**
 * holder class for well known types, has static members only...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ContentViewItemTypes()
{
}

ContentViewItemTypes.REPORT_PROFILE = new ContentViewItemType("Report Profile", ContentNodeTypeEnum.REPORT_PROFILE, ServerEnvironment.imageDir + "/reportProfile-public.gif");
ContentViewItemTypes.REPORT_GROUP = new ContentViewItemType("Report Group", ContentNodeTypeEnum.REPORT_GROUP, ServerEnvironment.imageDir + "/reportGroup.gif");
ContentViewItemTypes.SOFTLINK = new ContentViewItemType("Softlink", ContentNodeTypeEnum.SOFTLINK, ServerEnvironment.imageDir + "/softlink.gif");
ContentViewItemTypes.REPORT = new ContentViewItemType("Report", ContentNodeTypeEnum.REPORT, ServerEnvironment.imageDir + "/report-public.gif");
ContentViewItemTypes.WIZARD_REPORT = new ContentViewItemType("Wizard Report", ContentNodeTypeEnum.WIZARD_REPORT, ServerEnvironment.imageDir + "/wizardReport-public.gif");
ContentViewItemTypes.QUERY_STUDIO_REPORT = new ContentViewItemType("Query Studio Report", ContentNodeTypeEnum.QUERY_STUDIO_REPORT, ServerEnvironment.imageDir + "/qs_report_icon.gif");
ContentViewItemTypes.ANALYSIS_STUDIO_REPORT = new ContentViewItemType("Analysis Studio Report", ContentNodeTypeEnum.ANALYSIS_STUDIO_REPORT, ServerEnvironment.imageDir + "/as_report_icon.gif");


//-----------------------------------------------------------------------------
/**
 * I represent a single content view item
 *
 * @param aName - the name of this item
 * @param anId - the ide of this item
 * @param aType - the type of this item.
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ContentViewItem(aName, anId, aType, aHidden, aParentId, aPermission, aOffline)
{
   this.name = aName;
   this.id = anId;
   this.type = aType;

   this.permission = aPermission;

   this.category = null;
   // set by category
   this.domDiv = null;

   this.isSelected = false;
   this.isHidden = aHidden;
   this.parentId = aParentId;
   this.isOffline = aOffline;
   /**
    * will be set by ui controller to number these items in ascending order
    * with respect to their display order...
    **/
   this.displayIndex = -1;
}


/**
 * @private
 **/
ContentViewItem.prototype.toHtml = function()
{
   this.type.iconSrc = this.type.iconSrc.replace(/-(public|private)\./, "-" + this.permission + ".");

   var html = '<div '
   if (this.isOffline)
      {
         html += 'class="contentViewItemOffline"';
      }
   else
   {
      html += 'class="contentViewItem"';
   }
   html += 'id="cvi_' + this.id + '">' + '<img class="itemIcon" src="' + this.type.iconSrc + '"/>' + this.name + '</div>';

   return html;

};

/**
 * @private
 **/
ContentViewItem.prototype.postInsert = function()
{
   this.domDiv = uiController.document.getElementById("cvi_" + this.id);

   Event.observe (this.domDiv, "mousedown", function (anEvent) { uiController.onItemMouseDown(this, anEvent); }.bind(this), false);
   Event.observe (this.domDiv, "dblclick", function (anEvent) { uiController.editReportProfile(); }.bind(this), false);

   if (this.isHidden == true)
   {
      this.domDiv.style.display = 'none';
   }
};


/**
 * select this item...
 **/
ContentViewItem.prototype.toggleSelection = function()
{
   if (this.isSelected)
      this.unSelect();
   else
      this.select();
}

/**
 * select this item...
 **/
ContentViewItem.prototype.select = function()
{
   this.setSelected(true);
}


/**
 * unselect this item...
 **/
ContentViewItem.prototype.unSelect = function()
{
   this.setSelected(false);
}

/**
 * @private
 **/
ContentViewItem.prototype.setSelected = function(aValue)
{
   this.isSelected = aValue;

   if (this.isOffline)
   {
      this.domDiv.className = (this.isSelected ? 'contentViewItemSelectedOffline' : 'contentViewItemOffline');
   }
   else
   {
      this.domDiv.className = (this.isSelected ? 'contentViewItemSelected' : 'contentViewItem');
   }
}


/**
 * returns a string representation of this object
 **/
ContentViewItem.prototype.toString = function()
{
   return this.name;
}


//-----------------------------------------------------------------------------
/**
 * I represent a content view category.
 *
 * @param aName - the name of this category...
 * @param aIsExpanded - a boolean indicating wether this category is currently
 * expanded
 *
 * @see ContentViewItem
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function ContentViewCategory(aName, aIsExpanded)
{
   this.name = aName;
   this.isExpanded = aIsExpanded;
   this.items = new Array();

   this.id = ContentViewCategory.nextInstanceId++;

   //--- dom element which are set during post-insert...
   this.domDiv = null;
   this.domBodyDiv = null;
   this.domImage = null;
}

/**
 * just an internal static variable that we use to give each ContentViewCategory
 * some unique id...
 **/
ContentViewCategory.nextInstanceId = 0;

/**
 * adds a new item to this category...
 **/
ContentViewCategory.prototype.addItem = function (anItem)
{
   this.items.push(anItem);
   anItem.category = this;
};


/**
 * toggles the expansion of this category...
 **/
ContentViewCategory.prototype.toggle = function ()
{
   if (this.isExpanded)
      this.collapse();
   else
      this.expand();
};

/**
 * expands this category
 **/
ContentViewCategory.prototype.expand = function ()
{
   this.setExpanded(true);
};

/**
 * collapses this category
 **/
ContentViewCategory.prototype.collapse = function ()
{
   this.setExpanded(false);
};


/**
 * set this category as expanded / collapsed
 * @private
 **/
ContentViewCategory.prototype.setExpanded = function (aValue)
{
   this.isExpanded = aValue;


   this.domBodyDiv.className = (this.isExpanded ? 'categoryBody' : 'categoryBodyCollapsed');
   this.domImage.src = this.getPlusMinusImageSrc();
};


/**
 * @private
 **/
ContentViewCategory.prototype.getPlusMinusImageSrc = function()
{
   return ServerEnvironment.imageDir + (this.isExpanded ? "/minus.gif" : "/plus.gif");
}

/**
 * @private
 **/
ContentViewCategory.prototype.getBodyDivClass = function()
{
   return this.isExpanded ? "categoryBody" : "categoryBodyCollapsed";
}

/**
 * return the HTML version of this category...
 **/
ContentViewCategory.prototype.toHtml = function ()
{
   var html = '';

   html +=
   '<div class="category" id="cvc_' + this.id + '">' +
   '<div class="categoryHeader" id="cvcContent_' + this.id + '"><img src="' + this.getPlusMinusImageSrc() + '"/>' + this.name + '</div>' +
   '<div class="' + this.getBodyDivClass() + '">';

   for (var i = 0; i < this.items.length; ++i)
   {
      html += this.items[i].toHtml(i);
   }

   html +=
   '</div>' +
   '</div>';

   return html;
}


/**
 * called after view has been inserted into the document...
 * @private
 **/
ContentViewCategory.prototype.postInsert = function()
{
   this.domDiv = uiController.document.getElementById("cvc_" + this.id);

   var categoryHeader = uiController.document.getElementsByClassName("categoryHeader", this.domDiv)[0];

   Event.observe(categoryHeader, "click", function (anEvent)
   {
      this.toggle();
   }.bind(this), false);

   this.domBodyDiv = this.domDiv.childNodes[1];
   this.domImage = this.domDiv.childNodes[0].childNodes[0];

   for (var i = 0; i < this.items.length; ++i)
   {
      this.items[i].postInsert();
   }
}


//-----------------------------------------------------------------------------
/**
 * I am the UI model for the FolderContents screen...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FolderContentsUiModel(aCategories)
{
   this.categories = aCategories;
}


//-----------------------------------------------------------------------------
/**
 * I am the UI controller for the FolderContents screen...
 *
 * @constructor
 * @author Lance Hankins (lhankins@focus-technologies.com)
 **/
function FolderContentsUiController(aDocument, aModel)
{
   if (arguments.length > 0)
   {
      AbstractWorkspaceUiController.prototype.constructor.call(this, aDocument);
      this.model = aModel;
   }
}

//--- This class extends AbstractUiController
FolderContentsUiController.prototype = new AbstractWorkspaceUiController();
FolderContentsUiController.prototype.constructor = FolderContentsUiController;
FolderContentsUiController.superclass = AbstractWorkspaceUiController.prototype;


/**
 * called once (after document is fully loaded) to initialize the user interface
 **/
FolderContentsUiController.prototype.initUi = function()
{

// **check this out  if (this.document.forms[0].displayFilterOptions.value == "true")
   this.numberItems();
   this.insertCategoriesIntoDocument();

   this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/blankProperties.do?userLocale=" + ServerEnvironment.userLocale);

   this.initKeyHandler();

   //---This is changed in the keyHanlder to prevent the properties panel from reloading on every keydown event.
   this.shouldReloadProperties = true;
   
   this.onFrameResize();

   window.focus();

//    Ext.QuickTips.init();

   var tb = new Ext.Toolbar();
   tb.render('toolbar');

   // They can also be referenced by id in or components
    tb.add({
        cls: 'x-btn-icon',
        id: "refresh",
        handler: function (btn){
                      this.buttonClicked(btn);
                   },
         scope: this,
//         tooltip: {text:'Refresh Folder Contents', autoHide:true},
         icon:  ServerEnvironment.baseUrl + "/images/bbar_icons/" + 'actionRefresh.gif'
    }, '-');

      if (ServerEnvironment.isAdminUser)
      {
         tb.add(
             this.createButton("execute", "actionResume.gif", this.buttonClicked, applicationResources.getProperty("button.execute")), '-',
             this.createButton("schedule", "actionSchedule.gif", this.buttonClicked, applicationResources.getProperty("button.schedule")), '-',
             this.createButton("delete", "actionDelete.gif", this.buttonClicked, applicationResources.getProperty("button.delete")), '-',
             this.createButton("editProfile", "actionEdit.gif", this.buttonClicked, applicationResources.getProperty("button.editProfile")),'-',
             this.createButton("changeOwner", "actionEdit.gif", this.buttonClicked, applicationResources.getProperty("button.changeOwner")),'-');
      }
      else
      {
         tb.add(
             this.createButton("execute", "actionResume.gif", this.buttonClicked, applicationResources.getProperty("button.execute")), '-',
             this.createButton("schedule", "actionSchedule.gif", this.buttonClicked, applicationResources.getProperty("button.schedule")), '-',
             this.createButton("delete", "actionDelete.gif", this.buttonClicked, applicationResources.getProperty("button.delete")), '-',
             this.createButton("editProfile", "actionEdit.gif", this.buttonClicked, applicationResources.getProperty("button.editProfile")),'-');
      }

      if (ServerEnvironment.showReportWizard)
      {
          tb.add(
                 this.createButton("reportWizard", "actionReportCustomize.gif", this.buttonClicked, applicationResources.getProperty("button.reportWizard")), '-'
                );
      }

   //todo update checked so proper item will be checked.  might have to change method of toolbar build to create buttons, then add by reference instead of inline
     var isChecked = this.document.getElementById("filterType").value == "PUBLIC" ? true : false;

     tb.add(
       this.createButton("renameReport", "actionRename.gif", this.buttonClicked, applicationResources.getProperty("button.renameMove")), '-',


       new Ext.Toolbar.SplitButton({
            text: applicationResources.getProperty("button.filterBy"),
//            tooltip: {text:'This is a QuickTip with autoHide set to true and a title', title:'Tip Title', autoHide:true},
            cls: 'x-btn-text-icon',
            // Menus can be built/referenced by using nested menu config objects
            menu : {items: [
                        new Ext.menu.CheckItem({checked: isChecked, id: 'PUBLIC', value:'PUBLIC', text: applicationResources.getProperty("button.filterBy.publicItems"), group: 'filter', scope: this, handler: onItemClick}),
                        new Ext.menu.CheckItem({id: 'PRIVATE', value:'PRIVATE', text: applicationResources.getProperty("button.filterBy.privateItems"), group: 'filter', scope: this, handler: onItemClick}),
                        new Ext.menu.CheckItem({id: 'COMBINED', value:'COMBINED', text: applicationResources.getProperty("button.filterBy.combinedView"), group: 'filter', scope: this, handler: onItemClick})
                ]}
        }),'-',

      new Ext.Toolbar.SplitButton({
            text: 'Categorize By',
//            tooltip: {text:'This is a QuickTip with autoHide set to true and a title', title:'Tip Title', autoHide:true},
            cls: 'x-btn-text-icon',
            // Menus can be built/referenced by using nested menu config objects
            menu : window.categorizeByOptionsMenu
        })
           );


   tb.doLayout();
    function onItemClick(item){
       this.filterItemClicked(item.value);
    }


};

FolderContentsUiController.prototype.initKeyHandler = function()
{
   this.folderContentsKeyHandler = new FolderContentsKeyHandler(this);
   this.keyListener = new FolderContentsKeyListener(this.folderContentsKeyHandler, this);

   this.keyListener.init();
};

/**
 * this is an override of the baseclass method, we want the scrollbar to be on the
 * folder
 **/
FolderContentsUiController.prototype.onFrameResize = function()
{
   var newBodyHeight;
   var contentShellOffSet;

   if (is_ie)
   {
      var geom = new BrowserGeometry();
      newBodyHeight = geom.height - 14;
      contentShellOffSet = 6;
   }
   else
   {
      newBodyHeight = top.frames["workSpace"].innerHeight - 14;
      contentShellOffSet = 14;
   }

   var toolbarHeight = 75;

   if (newBodyHeight < toolbarHeight)
      newBodyHeight = toolbarHeight;


   document.getElementById("bodyDiv").style.height = newBodyHeight + "px";
   document.getElementById("contentShell").style.height = (newBodyHeight - contentShellOffSet ) + "px";


   document.getElementById("workspaceBody").style.height = (newBodyHeight -toolbarHeight)+ "px";
};

FolderContentsUiController.prototype.filterItemClicked = function(aValue)
{
  var filterType = this.document.getElementById("filterType");
  filterType.value = aValue;

   this.document.forms[0].submit();
};

FolderContentsUiController.prototype.categoryItemClicked = function(aValue)
{
   var categorizeBy = this.document.getElementById("categorizeBy");
   categorizeBy.value = aValue;

   this.document.forms[0].submit();
};

FolderContentsUiController.prototype.buttonClicked = function(anIt)
{
   switch (anIt.id)
           {
      case "execute":
         this.executeSelectedReports();
         break;
      case "schedule":
         this.scheduleSelectedReports();
         break;
      case "editProfile":
         this.editReportProfile();
         break;
      case "reportWizard":
         this.openInReportWizard();
         break;
      case "reportstudio":
         this.editInReportStudio();
         break;
      case "renameReport":
         this.renameReport();
         break;
      case "delete":
         this.deleteSelectedProfiles();
         break;
      case "refresh":
         this.refreshPage();
         break;
      case "changeOwner":
         this.changeOwner();
         break;
   }
};

FolderContentsUiController.prototype.changeOwner = function()
{
   var selected = this.getSelectedItems();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("folderContents.errMsg.pleaseSelectReport"));
   }
   else
   {
      var selectedNodeIdParams = '';
      var selectedNodeParentIdParams = '';
      for (var i = 0; i < selected.length; ++i)
      {
         if (!selected[i].isOffline)
         {
            selectedNodeIdParams += "targetIds=" + selected[i].id + "&";
         }
      }
      
      var rclDialog = new RclDialog();

      var dialogListener = {
         thisDoc : document,
         dialogFinished : function (aPicker) {
            if (aPicker.wasCancelled == false)
            {
               if (aPicker.hasInputs)
               {
                  var xmlHttpRequest = JsUtil.createXmlHttpRequest();

                  var url = ServerEnvironment.contextPath + "/secure/actions/executeChangeOwner.do";

                  var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
                        uiController.endPleaseWaitDiv();
                  });
                  

                  xmlHttpRequest.open("POST", url, true);

                  xmlHttpRequest.setRequestHeader(
                          'Content-Type',
                          'application/x-www-form-urlencoded; charset=UTF-8'
                          );

                  uiController.startPleaseWaitDiv(null, applicationResources.getProperty("general.submittingRequest"));


                  xmlHttpRequest.send(selectedNodeIdParams + aPicker.inputValue);
               }
            }
         }
      };

      rclDialog.setDialogListener (dialogListener);

      rclDialog.showChangeOwnerDialog("Change Owner", selectedNodeIdParams, "changeOwnerDialog");
   }
   
};

/**
 * @private
 **/
FolderContentsUiController.prototype.numberItems = function()
{
   var functor = {
      displayIndex : 0,
      applyTo : function (anItem)
      {
         anItem.displayIndex = this.displayIndex++;
      }
   };

   this.applyToAllItems(functor);
};


/**
 * apply the supplied functor to all items...
 *
 * @param a functor which must implement an "applyTo" method that accepts one argument
 **/
FolderContentsUiController.prototype.applyToAllItems = function(aFunctor)
{
   var eachCategory = null;
   var eachItem = null;

   for (var i = 0; i < this.model.categories.length; ++i)
   {
      eachCategory = this.model.categories[i];

      for (var j = 0; j < eachCategory.items.length; ++j)
      {
         eachItem = this.model.categories[i].items[j];
         aFunctor.applyTo(eachItem);
      }
   }
};

/**
 * @private
 **/
FolderContentsUiController.prototype.insertCategoriesIntoDocument = function()
{
   var html = '';

   for (var i = 0; i < this.model.categories.length; ++i)
   {
      html += this.model.categories[i].toHtml();
   }

   var contentDiv = this.document.getElementById("workspaceBody");
   contentDiv.innerHTML = html;

   for (var i = 0; i < this.model.categories.length; ++i)
   {
      this.model.categories[i].postInsert();
   }

};

/**
 * user changed the "view by" drop down...
 **/
FolderContentsUiController.prototype.categorizeByChanged = function()
{
   this.document.forms[0].submit();
};

/**
 * execute the currently selected reports...
 **/
FolderContentsUiController.prototype.executeSelectedReports = function()
{

    var selected = this.getSelectedItems();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("folderContents.errMsg.pleaseSelectReport"));
   }
   else if (!(selected.length == 1 && selected[0].isOffline))
   {
      //alert("execute : \n\n" + selected.join("\n"));

      //--- compute selected id's...
      var selectedNodeIdParams = '';
      var selectedNodeParentIdParams = '';
      for (var i = 0; i < selected.length; ++i)
      {
         if (!selected[i].isOffline)
         {
            selectedNodeIdParams += "nodeId=" + selected[i].id + "&";
            selectedNodeParentIdParams += "parentId=" + selected[i].parentId + "&";
         }
      }

      // todo; trim trailing ampersand...

      //--- do async request to launch reports...
      var xmlHttpRequest = JsUtil.createXmlHttpRequest();

      var url = ServerEnvironment.contextPath + "/secure/actions/executeReports.do";

      var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest) {
         try
         {
            uiController.endPleaseWaitDiv();

            eval(anXmlHttpRequest.responseText);
         }
         catch (e)
         {
            var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
            var writeString = anXmlHttpRequest.responseText;
            writeString = serverEnv + writeString;

            if (writeString.indexOf("<html>") == -1)
            {
               alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, anXmlHttpRequest.responseText)));
            }
            else
            {
               window.document.write(writeString);
            }
         }
      });

      xmlHttpRequest.open("POST", url, true);

      xmlHttpRequest.setRequestHeader(
              'Content-Type',
              'application/x-www-form-urlencoded; charset=UTF-8'
              );



      this.startPleaseWaitDiv(null, applicationResources.getProperty("general.submittingRequest"));


      xmlHttpRequest.send(
              "fromFolderId=" + this.document.getElementById("folderId").value + "&" +
              selectedNodeIdParams + selectedNodeParentIdParams
              );
   }
};

/**
 * schedule the currently selected reports...
 **/
FolderContentsUiController.prototype.scheduleSelectedReports = function()
{
   var selected = this.getSelectedItems();

   if (selected.length == 0)
   {
      alert(applicationResources.getProperty("folderContents.errMsg.pleaseSelectReport"));
   }
   else if ( this.doesListContainLinkNodes(selected) )
   {
      alert(applicationResources.getProperty("folderContents.errMsg.scheduleNotSupported"));
   }
   else
   {
      var selectedNodeIdParams = '';
      for (var i = 0; i < selected.length; ++i)
      {
         selectedNodeIdParams += "targetIds=" + selected[i].id + "&";
      }


      //make AJAX call to get reports for folder
      var checkUrl = ServerEnvironment.contextPath + "/secure/actions/checkRequiredParametersAction.do?" + selectedNodeIdParams;
      var myAjax = new Ajax.Request(
                   checkUrl,
           {

               method: 'get',
               asynchronous:false,

               onFailure : function(resp)
               {
                  alert(applicationResources.getProperty("userPrefs.serverError"));
               },

               onException : function(resp)
               {
                  alert(applicationResources.getProperty("userPrefs.serverError"));
                  }
           });
      eval(myAjax.transport.responseText);
      if (!allParametersMet) return; //allParametersMet is set in the checkRequiredParametersAction action

      var url = ServerEnvironment.baseUrl + "/secure/actions/newSchedule.do?" + selectedNodeIdParams;

      var windowName = ServerEnvironment.windowNamePrefix + "_NewSchedule";

      var geom = new BrowserGeometry();
      win = window.open(url,
              windowName,
              "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
      //                          "width=900,height=700,top=" + geom.top + ",left=" + geom.left + ",menubar=yes,toolbar=yes,scrollbars=no,resizable=yes,status=yes");

      win.focus();      

   }
};

FolderContentsUiController.prototype.doesListContainLinkNodes = function( aTargetList )
{
   var selected = this.getSelectedItems();
   var isContainsLinkNodes = false;

   if (selected.length > 0)
   {
      for( var index = 0; index < selected.length; index++ )
      {
         var eachSelected = selected[index];
         var nodeType = eachSelected.type.jsEnum.value;
         if( nodeType == ContentViewItemTypes.QUERY_STUDIO_REPORT.jsEnum.value || nodeType == ContentViewItemTypes.ANALYSIS_STUDIO_REPORT.jsEnum.value)
         {
            isContainsLinkNodes = true;
            break;
         }
      }
   }

   return isContainsLinkNodes;
};



/**
 * delete the currently selected reports...
 **/
FolderContentsUiController.prototype.deleteSelectedProfiles = function()
{
   selectedForDelete = this.getSelectedItems();
   deleteFromfolderId = this.document.getElementById("folderId").value;

   if (selectedForDelete.length == 0)
   {
      alert(applicationResources.getProperty("folderContents.errMsg.pleaseSelectReport"));
      return;
   }



   if (userPreferences.confirmDeletes )
   {
      DialogUtil.rclConfirm(applicationResources.getProperty("general.confirmDeletions"), //ask the user "are you sure"?
                            function() { uiController._doDeleteSelected(); },
                            null,                                                         //nothing if cancel
                            applicationResources.getProperty("general.dialog.confirmTitle"), //title of the confirm dialog
                            applicationResources.getProperty("button.Yes"),
                            applicationResources.getProperty("button.No"));


   }
   else
   {
      this._doDeleteSelected();
   }

};


/**
 * @private
 **/
FolderContentsUiController.prototype._doDeleteSelected = function()
{
   selectedForDelete = this.getSelectedItems();
   deleteFromfolderId = this.document.getElementById("folderId").value;
   notEligableForDelete = new Array();

   //--- compute selected id's...
   var profileIds = '';
   var reportIds = '';
   var flag = false;
   for (var i = 0; i < selectedForDelete.length; ++i)
   {
      //deletion is allowed on profiles and wizard reports only
      //the wizard report or profile must be private or you must be a system admin
      if ( (selectedForDelete[i].type == ContentViewItemTypes.REPORT_PROFILE || selectedForDelete[i].type == ContentViewItemTypes.WIZARD_REPORT)
              &&
           (selectedForDelete[i].permission=='private' || canDeletePublicItems) )
      {
         if (selectedForDelete[i].type == ContentViewItemTypes.REPORT_PROFILE)
         {
            profileIds += "profileId=" + selectedForDelete[i].id + "&";
         }
         else if (selectedForDelete[i].type == ContentViewItemTypes.WIZARD_REPORT)
         {
            reportIds += "reportId=" + selectedForDelete[i].id + "&";
         }
      }
      else
      {
         notEligableForDelete.push(selectedForDelete[i]);
         selectedForDelete.splice(i, 1);
         i--;
      }
   }



   //--- do async request to delete targets reports...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var url = ServerEnvironment.contextPath + "/secure/actions/deleteContentNode.do";

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
      try
      {
         uiController.endPleaseWaitDiv();

         eval(anXmlHttpRequest.responseText);

//         uiController.setServerInfoMessage('<p>The Selected Report Profiles have been Deleted.</p>');setTimeout('uiController.refreshPage();', 2000);
      }
      catch (e)
      {
         var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
         var writeString = anXmlHttpRequest.responseText;
         writeString = serverEnv + writeString;

         if (writeString.indexOf("<html>") == -1)
         {
            alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, anXmlHttpRequest.responseText)));
         }
         else
         {
            window.document.write(writeString);
         }
      }
   });

   xmlHttpRequest.open("POST", url, true);

   xmlHttpRequest.setRequestHeader(
           'Content-Type',
           'application/x-www-form-urlencoded; charset=UTF-8'
           );

   var  notDeleted = "";
   for (var x = 0; x < notEligableForDelete.length; x++)
   {
      notDeleted += "<li>" + notEligableForDelete[x].name + "</li>";
   }

   if (notEligableForDelete.length > 0)
   {
//      uiController.setServerInfoMessage("<p> The following will not be deleted: </p>" + notDeleted);
      DialogUtil.rclAlertEx("<p> " + applicationResources.getProperty("general.dialog.deleteWarning") +"</p>" +
                            notDeleted, applicationResources.getProperty("general.dialog.alertTitle"));
   }

   if (selectedForDelete.length > 0)
   {
      this.startPleaseWaitDiv(null, applicationResources.getProperty("general.submittingRequest"));

      xmlHttpRequest.send(
              "fromFolderId=" + deleteFromfolderId + "&" +
              profileIds + "&" + reportIds
            );
   }


};



/**
 * editReportProfile
 **/
FolderContentsUiController.prototype.editReportProfile = function( aNodeId, aNodeType )
{
   if(!JsUtil.isGood(aNodeId) || !JsUtil.isGood(aNodeType))
   {
      var selected = this.getSelectedItems();

      if (selected.length != 1)
      {
         alert(applicationResources.getProperty("folderContents.errMsg.selectItem"));
         return;
      }
      else if (!selected[0].isOffline)
      {
         aNodeId = selected[0].id;
         aNodeType = selected[0].type.jsEnum.value;

         if( aNodeType == ContentViewItemTypes.QUERY_STUDIO_REPORT.jsEnum.value || aNodeType == ContentViewItemTypes.ANALYSIS_STUDIO_REPORT.jsEnum.value)
         {
            alert( "Cannot edit profile for reports that are links to cognos connection." );
            return;
         }

         var url = ServerEnvironment.baseUrl + "/secure/actions/editReportProfile.do?launchNodeId=" + aNodeId + "&launchNodeType=" + aNodeType;

         var windowName = ServerEnvironment.windowNamePrefix + "_EditReportProfile_" + aNodeId;

         var geom = new BrowserGeometry();
         win = window.open(url,
                 windowName,
                 "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
         //                          "width=900,height=700,top=" + geom.top + ",left=" + geom.left + ",menubar=yes,toolbar=yes,scrollbars=no,resizable=yes,status=yes");

         win.focus();
      }
      else
      {
         this.notifyOfOfflineReport(selected[0].name);
      }
   }


};

/**
 * rename report
 **/
FolderContentsUiController.prototype.renameReport = function()
{
   var selected = this.getSelectedItems();

   if (selected.length != 1)
   {
      alert(applicationResources.getProperty("folderContents.errMsg.selectItem"));
   }
   else if (this.document.getElementById("renameReportPermission").value == "false" && selected[0].type == ContentViewItemTypes.REPORT)
   {
      alert(applicationResources.getProperty("folderContents.errMsg.renameReportBadPermissions"))
   }
   else
   {
      var nodeId = selected[0].id;
      var nodeType = selected[0].type.jsEnum.value;

      var url = ServerEnvironment.baseUrl + "/secure/actions/displayRename.do?";

      url += "nodeId=" + nodeId + "&nodeType=" + nodeType;

      var geom = new BrowserGeometry();

      var rvWindowName = ServerEnvironment.windowNamePrefix + "_RCL_RM_" + Math.round(Math.random()*10000);
      win = JsUtil.openNewWindow("", rvWindowName,
              "width=710,height=475,top=geom.top,left=geom.left,menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

      win.location = url;

   }
};


/**
 * open selection in report wizard
 **/
FolderContentsUiController.prototype.openInReportWizard = function()
{
   var selected = this.getSelectedItems();

   if (selected.length != 1)
   {
      alert(applicationResources.getProperty("folderContents.errMsg.selectItem"));
   }
   else
   {
      if (selected[0].type != ContentViewItemTypes.WIZARD_REPORT)
      {
         alert(applicationResources.getProperty("folderContents.errMsg.optionOnlyForWizardReports"));
         return;
      }

      var nodeId = selected[0].id;

      var url = ServerEnvironment.baseUrl + "/secure/actions/reportWizard.do?wizardStep=initialize&reportId=" + nodeId;

      var windowName = ServerEnvironment.windowNamePrefix + "_ReportWizard";

      var geom = new BrowserGeometry();
      win = JsUtil.openNewWindow(url,
              windowName,
              "width=1000,height=750,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

      win.focus();
   }
};


/**
 * edit the selected report in ReportStudio
 **/
FolderContentsUiController.prototype.editInReportStudio = function()
{
   var selected = this.getSelectedItems();

   if (selected.length > 1)
   {
      alert(applicationResources.getProperty("folderContents.errMsg.doesNotSupportMultipleItems"));
   }
   else
   {
      var nodeId = selected[0].id;
      var nodeType = selected[0].type.jsEnum.value;

      var url = ServerEnvironment.baseUrl + "/secure/actions/openInReportStudio.do?nodeId=" + nodeId + "&nodeType=" + nodeType;

      var windowName = ServerEnvironment.windowNamePrefix + "_ReportStudioFor_" + nodeId + "_" + nodeType;
      win = JsUtil.openNewWindow(url,
              windowName,
              "width=1010,height=693,top=0,left=0,menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
      win.focus();
   }
};

/**
 * get selected items...
 *
 * @return an array of the selected items
 **/
FolderContentsUiController.prototype.getSelectedItems = function()
{
   var functor = {
      selectedItems : new Array(),
      applyTo : function (anItem)
      {
         if (anItem.isSelected)
            this.selectedItems.push(anItem);
      }
   };

   this.applyToAllItems(functor);

   return functor.selectedItems;
};


/**
 * clear all currently selected items...
 **/
FolderContentsUiController.prototype.clearAllSelectedItems = function()
{
   var functor = {
      applyTo : function (anItem)
      {
         anItem.unSelect();
      }
   };

   this.applyToAllItems(functor);
}

/**
 * the selected items changed...
 **/
FolderContentsUiController.prototype.selectionChanged = function()
{
   if (this.shouldReloadProperties == true)
   {
      var selected = this.getSelectedItems();

      if (selected.length == 1)
      {
         var item = selected[0];
         this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/getContentNodeDetails.do?nodeId=" + item.id + "&nodeType=" + item.type.jsEnum.value);
      }
      else if (selected.length == 0)
      {
         this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/blankProperties.do?userLocale=" + ServerEnvironment.userLocale);
      }
      else
      {
         this.setPropertiesPanelUrl(ServerEnvironment.baseUrl + "/secure/actions/multipleItemsSelectedProperties.do?userLocale=" + ServerEnvironment.userLocale);
      }
   }
}




/**
 * called when a mousedown event occurs on the category items...
 **/
FolderContentsUiController.prototype.onItemMouseDown = function(anItem, anEvent)
{
   var ctrlPressed = anEvent.ctrlKey;
   var shiftPressed = anEvent.shiftKey;

   //--- CTRL Click
   if (ctrlPressed == true)
   {
      anItem.toggleSelection();
   }
   //--- Shift Click
   else if (shiftPressed == true)
   {
      if (this.lastSelectedIndex)
      {
         this.clearAllSelectedItems();

         var functor = {
            minIndex : Math.min(this.lastSelectedIndex, anItem.displayIndex),
            maxIndex : Math.max(this.lastSelectedIndex, anItem.displayIndex),
            applyTo : function(anItem)
            {
               if (anItem.displayIndex >= this.minIndex && anItem.displayIndex <= this.maxIndex)
                  anItem.select();
            }
         }

         this.applyToAllItems(functor);
      }
      else
      {
         this.lastSelectedIndex = anItem.displayIndex;
         anItem.select();
      }

      var selectedItems = this.getSelectedItems();
      var firstSelectedItem = selectedItems[0];
      var lastSelectedItem = selectedItems[selectedItems.length - 1];
      var firstSelectedCategory = firstSelectedItem.category;
      var lastSelectedCategory = lastSelectedItem.category;

      if (firstSelectedItem.displayIndex != this.lastSelectedIndex)
      {
         //---Shift select was upwards
         this.folderContentsKeyHandler.changeSelection(this.getCategoryIndex(firstSelectedCategory),
                 firstSelectedCategory.items.indexOf(firstSelectedItem),
                 this.getCategoryIndex(lastSelectedCategory),
                 lastSelectedCategory.items.indexOf(lastSelectedItem));
      }
      else
      {
         //---Shift select was downwards
         this.folderContentsKeyHandler.changeSelection(this.getCategoryIndex(lastSelectedCategory),
                 lastSelectedCategory.items.indexOf(lastSelectedItem),
                 this.getCategoryIndex(firstSelectedCategory),
                 firstSelectedCategory.items.indexOf(firstSelectedItem));
      }
   }
   //--- Normal Click
   else
   {
      //--- clear all currently selected items first...
      this.clearAllSelectedItems();

      anItem.select();
      this.lastSelectedIndex = anItem.displayIndex;

      this.folderContentsKeyHandler.changeSelection(this.getCategoryIndex(anItem.category), this.lastSelectedIndex);

   }


   //--- selection is finished...
   this.selectionChanged();
};

FolderContentsUiController.prototype.getCategoryIndex = function(aCategory)
{
   for (var i = 0; i < this.model.categories.length; i++)
   {
      if (aCategory == this.model.categories[i])
      {
         return i;
      }
   }
   return -1;
};


FolderContentsUiController.prototype.selectItems = function(aItems)
{
   for (var i = 0; i < aItems.length; i++)
   {
      aItems[i].select();
   }

   this.selectionChanged();
};


FolderContentsUiController.prototype.savePropertySizeToPreferences = function()
{
   var url = ServerEnvironment.contextPath + "/secure/actions/propertiesResize.do";
   var httpParams = "workSpaceSize=" + this.document.getElementById("workspaceBody").style.height;

   //--- async request setup...
   var xmlHttpRequest = JsUtil.createXmlHttpRequest();

   var handler = new XmlHttpRequestCallBackHandler(xmlHttpRequest, function (anXmlHttpRequest)
   {
      try
      {
         eval(anXmlHttpRequest.responseText);
      }
      catch (e)
      {
         var serverEnv = "<script type=\"text/javascript\"> ServerEnvironment = new Object(); </script>";
         var writeString = anXmlHttpRequest.responseText;
         writeString = serverEnv + writeString;

         if (writeString.indexOf("<html>") == -1)
         {
            alert(applicationResources.getPropertyWithParameters("general.evaluateJavaScriptError", new Array(e.name, e.message, anXmlHttpRequest.responseText)));                       
         }
         else
         {
            window.document.write(writeString);
         }
      }
   });

   xmlHttpRequest.open("POST", url, true);

   xmlHttpRequest.setRequestHeader(
           'Content-Type',
           'application/x-www-form-urlencoded; charset=UTF-8'
           );

   xmlHttpRequest.send(httpParams + "&panel=reportPanel");
}

FolderContentsUiController.prototype.processDefaultExecution = function()
{
   var selected = this.getSelectedItems();

   var nodeId = selected[0].id;
   var nodeType = selected[0].type.jsEnum.value;

   if (selected.length > 1 || nodeType == ContentViewItemTypes.QUERY_STUDIO_REPORT.jsEnum.value || nodeType == ContentViewItemTypes.ANALYSIS_STUDIO_REPORT.jsEnum.value)
   {
      this.executeSelectedReports();
   }
   else
   {
      this.editReportProfile();
   }
};

FolderContentsUiController.prototype.notifyOfOfflineReport = function(aReport)
{
   alert(applicationResources.getPropertyWithParameters("folderContents.errMsg.reportIsOffline", new Array(aReport)));
//   alert("The " + aReport + " report is offline");
}


/**
 * Folder Contents Key Handler
 */
//------------------------------------------------
function FolderContentsKeyHandler(aFolderContentsUiController)
{
   this.controller = aFolderContentsUiController;
   this.lastSelectedIndex = -1;
   this.lastSelectedCategory = -1;
   this.focalItemIndex = 0;
   this.focalCategoryIndex = 0;
}
;


FolderContentsKeyHandler.prototype = new AbstractFolderContentsKeyHandler();
FolderContentsKeyHandler.prototype.constructor = FolderContentsKeyHandler;
FolderContentsKeyHandler.superclass = AbstractFolderContentsKeyHandler.prototype;


FolderContentsKeyHandler.prototype.handleDownSelection = function(aShiftKey)
{
   var categories = this.controller.model.categories;
   var allSelected;
   if (!aShiftKey)
   {
      allSelected = [];
   }
   else
   {
      allSelected = this.controller.getSelectedItems();
   }

   this.controller.clearAllSelectedItems();

   //---Handle case where no items have been selected
   if (this.lastSelectedCategory < 0)
   {
      allSelected.push(categories[0].items[0]);
      this.lastSelectedCategory = 0;
      this.lastSelectedIndex = 0;
   }
   else
   {
      var categoryItemsLength = categories[this.lastSelectedCategory].items.length;

      //---Selection will skip down a category
      if (this.lastSelectedIndex >= categoryItemsLength - 1)
      {
         if (this.focalCategoryIndex > this.lastSelectedCategory && aShiftKey)
         {
            allSelected.reverse();
            allSelected.pop();
            allSelected.reverse();
         }
         if (this.lastSelectedCategory < categories.length - 1)
         {
            this.lastSelectedIndex = 0;
         }
         this.lastSelectedCategory = Math.min(this.lastSelectedCategory + 1, categories.length - 1);
      }
      else
      {
         if (this.focalCategoryIndex > this.lastSelectedCategory
                 || (this.focalCategoryIndex == this.lastSelectedCategory && this.focalItemIndex > this.lastSelectedIndex)
                 && aShiftKey)
         {
            allSelected.reverse();
            allSelected.pop();
            allSelected.reverse();
         }
         this.lastSelectedIndex = Math.min(this.lastSelectedIndex + 1, categoryItemsLength);
      }
      this.addUnique(categories[this.lastSelectedCategory].items[this.lastSelectedIndex], allSelected);
   }

   if (!aShiftKey)
   {
      this.focalItemIndex = this.lastSelectedIndex;
      this.focalCategoryIndex = this.lastSelectedCategory;
   }

   this.controller.selectItems(allSelected);

   this.scrollContainer(FolderContentsKeyHandlerEnum.DOWN);

   if (!is_ie)
   {
      window.getSelection().removeAllRanges();
   }
};


FolderContentsKeyHandler.prototype.handleUpSelection = function(aShiftKey)
{
   var categories = this.controller.model.categories;
   var allSelected;
   if (!aShiftKey)
   {
      allSelected = [];
   }
   else
   {
      allSelected = this.controller.getSelectedItems();
   }

   this.controller.clearAllSelectedItems();

   if (this.lastSelectedCategory < 0)
   {
      allSelected.push(categories[0].items[0]);
      this.lastSelectedCategory = 0;
      this.lastSelectedIndex = 0;
   }
   else
   {
      var categoryItemsLength = categories[this.lastSelectedCategory].items.length;
      if (this.lastSelectedIndex == 0)
      {
         if (this.focalCategoryIndex < this.lastSelectedCategory && aShiftKey)
         {
            allSelected.pop();
         }
         if (this.lastSelectedCategory > 0)
         {
            this.lastSelectedCategory -= 1;
            this.lastSelectedIndex = categories[this.lastSelectedCategory].items.length - 1;
         }
      }
      else
      {
         if (this.focalCategoryIndex < this.lastSelectedCategory || (this.focalCategoryIndex == this.lastSelectedCategory && this.focalItemIndex < this.lastSelectedIndex) && aShiftKey)
         {
            allSelected.pop();
         }
         this.lastSelectedIndex = Math.max(this.lastSelectedIndex - 1, 0);
      }
      this.addUnique(categories[this.lastSelectedCategory].items[this.lastSelectedIndex], allSelected);
   }

   if (!aShiftKey)
   {
      this.focalItemIndex = this.lastSelectedIndex;
      this.focalCategoryIndex = this.lastSelectedCategory;
   }

   this.controller.selectItems(allSelected);

   this.scrollContainer(FolderContentsKeyHandlerEnum.UP);

   if (!is_ie)
   {
      window.getSelection().removeAllRanges();
   }

};

FolderContentsKeyHandler.prototype.getSelectedItemDistance = function(aDirection)
{
   var categories = this.controller.model.categories;
   var totalSize = 0;
   var distanceFromTop = 0;

   for (var i = 0; i < categories.length; i++)
   {
      distanceFromTop += this.getElementHeight(document.getElementById("cvcContent_" + categories[i].id)) + 5;

      if (categories[i].isExpanded)
      {
         var categoryItems = categories[i].items;

         for (var j = 0; j < categoryItems.length; j++)
         {
            distanceFromTop += this.getElementHeight(document.getElementById("cvi_" + categoryItems[j].id));
            if (this.lastSelectedCategory == i && this.lastSelectedIndex == j)
            {
               //---We want the distance to the distance to the top of the item if the direction is up
               if (aDirection == FolderContentsKeyHandlerEnum.UP)
               {
                  distanceFromTop = distanceFromTop - this.getElementHeight(document.getElementById("cvi_" + categoryItems[j].id));
               }

               j = categoryItems.length;
               i = categories.length;
            }
         }
      }
   }

   return distanceFromTop;
};

FolderContentsKeyHandler.prototype.isItemInView = function(aItemDistance, aContainerHeight, aScrollPosition)
{
   //aScrollPosition is the minRange, aScrollPosition + containerHeight is the max
   if (this.isBetween(aItemDistance, aScrollPosition, aScrollPosition + aContainerHeight))
   {
      return true;
   }
   else
   {
      return false;
   }
};

FolderContentsKeyHandler.prototype.isBetween = function(aNumber, aLowerBound, aUpperBound)
{
   if (aNumber < aLowerBound || aNumber > aUpperBound)
   {
      return false;
   }
   else
   {
      return true;
   }
};

FolderContentsKeyHandler.prototype.scrollContainer = function(aDirection)
{
   var container = document.getElementById("workspaceBody");
   var containerHeight = this.getElementHeight(container);
   var scrollPosition = container.scrollTop;
   var itemDistance = this.getSelectedItemDistance(aDirection);

   if (!this.isItemInView(itemDistance, containerHeight, scrollPosition))
   {
      var upperBound = scrollPosition + containerHeight;

      //---Determine if we add in the category
//      var itemHeight = this.getElementHeight(document.getElementById("cvi_" + categories[this.lastSelectedCategory].items[this.lastSelectedIndex].id));
      var itemHeight = 0;
      if (this.lastSelectedIndex == 0)
      {
//         itemHeight += this.getElementHeight(document.getElementById("cvcContent_" + categories[this.lastSelectedCategory].id));
         itemHeight += this.getElementHeight(document.getElementById("cvcContent_" + categories[this.lastSelectedCategory].id));
      }

      //---Scroll to item at top
      if (itemDistance < scrollPosition)
      {
         container.scrollTop = itemDistance - itemHeight;
      }
      //---Scroll to item at bottom
      else
      {
         container.scrollTop = scrollPosition + (itemDistance - upperBound);
      }
   }

};

FolderContentsKeyHandler.prototype.switchCurrentSelection = function()
{
   this.controller.model.categories[this.lastSelectedCategory].items[this.lastSelectedIndex].toggleSelection();
};

FolderContentsKeyHandler.prototype.selectFirstItem = function(aShiftKey)
{
   this.controller.clearAllSelectedItems();

   if (aShiftKey)
   {
      var allSelected = [];
      for (var i = 0; i < this.lastSelectedCategory + 1; i++)
      {
         var categoryLength;
         var endingPosition;

         if (i == this.lastSelectedCategory)
         {
            endingPosition = this.lastSelectedIndex + 1;
         }
         else
         {
            endingPosition = this.controller.model.categories[i].items.length;
         }

         for (var j = 0; j < endingPosition; j++)
         {
            allSelected.push(this.controller.model.categories[i].items[j]);
         }
      }

      this.controller.selectItems(allSelected);
   }
   else
   {
      this.controller.model.categories[0].items[0].select();
   }

   this.lastSelectedCategory = 0;
   this.lastSelectedIndex = 0;
   this.scrollContainer();
};

FolderContentsKeyHandler.prototype.selectLastItem = function(aShiftKey)
{
   this.controller.clearAllSelectedItems();

   var lastCategory = this.controller.model.categories.length;
   var lastIndex = this.controller.model.categories[Math.max(0, lastCategory - 1)].items.length;

   this.focalItemIndex = this.lastSelectedIndex;
   this.focalCategoryIndex = this.lastSelectedCategory;

   if (this.lastSelectedCategory == -1)
   {
      this.lastSelectedCategory = 0;
   }

   if (this.lastSelectedIndex == -1)
   {
      this.lastSelectedIndex = 0;
   }

   if (aShiftKey)
   {
      var allSelected = new Array();
      for (var i = this.lastSelectedCategory; i < lastCategory; i++)
      {
         var categoryLength;
         var startingPosition;
         if (i == lastCategory - 1)
         {
            categoryLength = lastIndex;
         }
         else
         {
            categoryLength = this.controller.model.categories[i].items.length;
         }

         if (i == this.lastSelectedCategory)
         {
            startingPosition = this.lastSelectedIndex;
         }
         else
         {
            startingPosition = 0;
         }

         for (var j = startingPosition; j < categoryLength; j++)
         {
            allSelected.push(this.controller.model.categories[i].items[j]);
         }
      }

      this.controller.selectItems(allSelected);
   }
   else
   {
      this.controller.model.categories[lastCategory - 1].items[lastIndex - 1].select();
   }

   this.lastSelectedCategory = lastCategory - 1;
   this.lastSelectedIndex = lastIndex - 1;
   this.scrollContainer();
};


FolderContentsKeyHandler.prototype.deselectItems = function()
{
   this.controller.clearAllSelectedItems();
   this.lastSelectedIndex = -1;
   this.lastSelectedCategory = -1;
   this.focalItemIndex = 0;
   this.focalCategoryIndex = 0;
};


FolderContentsKeyHandler.prototype.addUnique = function(anItem, anArray)
{
   if (!this.contains(anItem, anArray))
   {
      anArray.push(anItem);
   }
}

FolderContentsKeyHandler.prototype.contains = function(anItem, anArray)
{
   for (var i = 0; i < anArray.length; i++)
   {
      if (anItem == anArray[i])
      {
         return true;
      }
   }

   return false;
};

FolderContentsKeyHandler.prototype.getElementHeight = function(anElement)
{
   return Element.getHeight(anElement);
};

FolderContentsKeyHandler.prototype.changeSelection = function(aCategoryIndex, aItemIndex, aFocalCategoryIndex, aFocalItemIndex)
{
   this.lastSelectedIndex = aItemIndex;
   this.lastSelectedCategory = aCategoryIndex;

   if (aFocalItemIndex == null)
   {
      this.focalItemIndex = this.lastSelectedIndex;
   }
   else
   {
      this.focalItemIndex = aFocalItemIndex;
   }

   if (aFocalCategoryIndex == null)
   {
      this.focalCategoryIndex = this.lastSelectedCategory;
   }
   else
   {
      this.focalCategoryIndex = aFocalCategoryIndex;
   }
};

FolderContentsKeyHandler.prototype.canSelect = function()
{
   var categories = this.controller.model.categories;
   if (categories.length > 0)
   {
      var items = categories[0].items;
      if (items.length > 0)
      {
         return true;
      }
      else
      {
         return false;
      }
   }
};


function FolderContentsKeyHandlerEnum(){}

FolderContentsKeyHandlerEnum.UP = new Enum(0,0);
FolderContentsKeyHandlerEnum.DOWN = new Enum(1,1);
