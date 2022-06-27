/**
 * this is the replacement for the frameset UI controller.  It manages the overall layout
 * of the UI.
 */
Adf.folderContentsUi = function()
{
   ////////////////////////////////////////////////////////////////////////////
   // Private
   ////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////
   // Public
   ////////////////////////////////////////////////////////////////////////////
   return {
      adminFlag : false,
      reportWizardFlag: false,

      setAdminFlag: function(aAdminFlag)
      {
         this.adminFlag = aAdminFlag;
      },

      setReportWizardFlag: function(aReportWizardFlag)
      {
         this.reportWizardFlag = aReportWizardFlag;
      },

      init : function()
      {
         this.hiddenIframe = document.createElement('iframe');
         this.hiddenIframe.style.display = "none";
         document.body.appendChild(this.hiddenIframe);

         this.eventSubscription = Adf.frameSetUi.eventChannel.subscribe("FolderContentsUi", function(aEvent)
         {
            if (aEvent.type == 'userPreferenceChanged')
            {
               if (aEvent.itemsPerPageChanged || aEvent.dateFormatChanged || aEvent.timeFormatChanged)
               {
                  Adf.folderContentsUi.refreshContentsGrid();
               }
               else if (aEvent.categoryViewChanged)
               {
                  // Will fire a refreshContentsGrid after setting the CategorizedBy menu.
                  Adf.folderContentsUi.selectCategorizedByValue(UserPreference.getCategoryView());
               }
            }
         });

         this.REPORT_PROFILE = new this.ContentViewItemType("Report Profile", ContentNodeTypeEnum.REPORT_PROFILE, ServerEnvironment.imageDir + "/reportProfile-public.gif");
         this.WIZARD_REPORT = new this.ContentViewItemType("Wizard Report", ContentNodeTypeEnum.WIZARD_REPORT, ServerEnvironment.imageDir + "/wizardReport-public.gif");

         this.adminUtil = new Adf.AdminScreenUtils();
         this.adminUtil.setScope(this);

         //todo pass these in as parameters
         this.categorizeBy = "category";
         this.filterType = "COMBINED";

         var executableContentTree = new Ext.tree.TreePanel({
            title:'Browse Executable Content',
            animate:true,
            lines:false,
            enableDD:false,
            containerScroll: true,
            rootVisible: false,
            loader: new Ext.tree.TreeLoader(),
            region: 'west',
            split: true,
            collapsible :true,
            width: 200
         });


         executableContentTree.getSelectionModel().on(
               'selectionchange',
               function()
               {
                  var selected = executableContentTree.getSelectionModel().getSelectedNode();
                  if (selected)
                  {
                     this.selectedFolderId = selected.id;
                     this.refreshContentsGrid();
                  }
               },
               this);

         var treeRoot = new Ext.tree.AsyncTreeNode({
            text: 'Executable Content',
            cls:'menuRoot',
            type:'menuRoot',
            contentType:'menuHeader',
            draggable:false,
            expanded:true,
            id:'-99',
            loader: new Ext.tree.TreeLoader({
               dataUrl:ServerEnvironment.baseUrl + '/secure/actions/ext/navMenu.do'
            })
         });

         executableContentTree.setRootNode(treeRoot);

         //select first node when the screen loads
         executableContentTree.getRootNode().expand(false, null, function(){
            executableContentTree.root.firstChild.select();
         });

         this.currentParams = JsUtil.substringAfterFirst(document.location.href, "?");

         var moreToolbarMenu = [
             this.adminUtil.createToolbarMenuItem(
                "renameMove",
                ServerEnvironment.baseUrl + "/images/silkIcons/" + "report_edit.png",
                this.onRenameMoveButtonClicked,
                applicationResources.getProperty("button.renameMove")
             ),
             this.adminUtil.createToolbarMenuItem(
                "changeOwner",
                ServerEnvironment.baseUrl + "/images/silkIcons/" + "user_edit.png",
                this.onChangeOwnerButtonClicked,
                applicationResources.getProperty("button.changeOwner")
             ),
             this.adminUtil.createToolbarMenuItem(
                "userPreferences",
                ServerEnvironment.baseUrl + "/images/silkIcons/" + "user_edit.png",
                this.onUserPreferencesButtonClicked,
                applicationResources.getProperty("navMenu.links.userPreferences")
             )
         ];

         if(this.adminFlag)
         {
            moreToolbarMenu.push(this.adminUtil.createToolbarMenuItem(
                "reportMetadata",
                ServerEnvironment.baseUrl + "/images/silkIcons/" + "report_magnify.png",
                this.onReportMetadataButtonClicked,
                applicationResources.getProperty("navMenu.links.reportMetadata")
             ));
         }

         var toolbarItems =
          [
            this.adminUtil.createToolbarButton("executeFolderContent", "report_go.png", this.onExecuteButtonClicked, applicationResources.getProperty("button.execute")), '-',
            this.adminUtil.createToolbarButton("scheduleFolderContent", "clock_add.png", this.validateLaunchInfo(this.onScheduleButtonClicked, this, 1, 30, null), applicationResources.getProperty("button.schedule")), '-',
            this.adminUtil.createToolbarButton("deleteFolderContent", "report_delete.png", this.onDeleteButtonClicked, applicationResources.getProperty("button.delete")), '-',
            this.adminUtil.createToolbarButton("editProfileFolderContent", "report_edit.png", this.onEditProfileButtonClicked, applicationResources.getProperty("button.editProfile")),'-'
          ];

//          if(this.reportWizardFlag)
//          {
             toolbarItems.push(
                   this.adminUtil.createToolbarMenuButton(
                      "reportWizardMenuFolderContent",
                      ServerEnvironment.baseUrl + "/images/silkIcons/" + "report_edit.png",
                      applicationResources.getProperty('button.reportWizard'),
                      [
                         this.adminUtil.createToolbarMenuItem(
                            "editWizardReportContent",
                            ServerEnvironment.baseUrl + "/images/silkIcons/" + "report_edit.png",
                            this.onEditWizardReportButtonClicked,
                            applicationResources.getProperty('button.editReportWizard')),
                         this.adminUtil.createToolbarMenuItem(
                            "createWizardReportContent",
                            ServerEnvironment.baseUrl + "/images/silkIcons/" + "report_add.png",
                            this.onCreateWizardReportButtonClicked,
                            applicationResources.getProperty('button.createReportWizard'))
                      ]),
                   '-' );
//          }

          toolbarItems.push(
            {
               text: applicationResources.getProperty('button.filterBy'),
               icon: ServerEnvironment.baseUrl + "/images/" + "btnFilter.gif",
               menu: [{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.filterBy.combinedView'),
                  id: 'FilterByCombined',
                  group: 'FilterByGroup',
   //                     checked: true,
                  listeners: {
                     checkchange: this.onFilterByCheckChanged.createDelegate(this)
                  }
               },{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.filterBy.publicItems'),
                  id: 'FilterByPublic',
                  group: 'FilterByGroup',
                  listeners: {
                     checkchange: this.onFilterByCheckChanged.createDelegate(this)
                  }
               },{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.filterBy.privateItems'),
                  id: 'FilterByPrivate',
                  group: 'FilterByGroup',
                  listeners: {
                     checkchange: this.onFilterByCheckChanged.createDelegate(this)
                  }
               }]
            },
            '-',
            {
               text: applicationResources.getProperty('button.categorizeBy'),
               icon: ServerEnvironment.baseUrl + "/images/silkIcons/" + "application_view_tile.png",
               menu: [{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.categorizeBy.flatView'),
                  id: 'CategorizeByFlatView',
   //                     checked: true,
                  group: 'CategorizeByGroup',
                  listeners: {
                     checkchange: this.onCategorizeByCheckChanged.createDelegate(this)
                  }
               },{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.categorizeBy.bySourceReport'),
                  id: 'CategorizeBySourceReport',
                  group: 'CategorizeByGroup',
                  listeners: {
                     checkchange: this.onCategorizeByCheckChanged.createDelegate(this)
                  }
               },{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.categorizeBy.byReportType'),
                  id: 'CategorizeByReportType',
                  group: 'CategorizeByGroup',
                  listeners: {
                     checkchange: this.onCategorizeByCheckChanged.createDelegate(this)
                  }
               },{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.categorizeBy.byReportInputs'),
                  id: 'CategorizeByReportInputs',
                  group: 'CategorizeByGroup',
                  listeners: {
                     checkchange: this.onCategorizeByCheckChanged.createDelegate(this)
                  }
               },{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.categorizeBy.byFrequencyOfUse'),
                  id: 'CategorizeByFrequencyOfUse',
                  group: 'CategorizeByGroup',
                  listeners: {
                     checkchange: this.onCategorizeByCheckChanged.createDelegate(this)
                  }
               },{
                  xtype: 'menucheckitem',
                  text: applicationResources.getProperty('button.categorizeBy.byPublicAndPrivate'),
                  id: 'CategorizeByPublicAndPrivate',
                  group: 'CategorizeByGroup',
                  listeners: {
                     checkchange: this.onCategorizeByCheckChanged.createDelegate(this)
                  }
               }]
            },'-',
             this.adminUtil.createToolbarMenuButton(
                "moreOperationsMenu",
                null,
                applicationResources.getProperty('button.more'),
                moreToolbarMenu)
            );

         this.workspaceToolbar = new Ext.Toolbar({
            items : toolbarItems
         });


         //--- refresh button is only an icon...
         //                  this.workspaceToolbar.add({cls: 'x-btn-icon',id: "refresh", handler:  function (aButton){ Adf.folderContentsUi.onRefreshButtonClicked(aButton); },scope: this, icon:  ServerEnvironment.baseUrl + "/images/bbar_icons/" + 'actionRefresh.gif'}, '-');
         //         if (ServerEnvironment.showReportWizard)
         //            this.workspaceToolbar.add(this.createToolbarButton("reportWizard", "actionReportCustomize.gif", Adf.folderContentsUi.onReportWizardButtonClicked, applicationResources.getProperty("button.reportWizard")),'-');

         //         this.workspaceToolbar.add(this.createToolbarButton("renameReport", "actionRename.gif", Adf.folderContentsUi.onRenameMoveButtonClicked, applicationResources.getProperty("button.renameMove")),'-');

         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store (created below)

         var folderContentsStore = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy({
               url: ServerEnvironment.baseUrl + '/secure/actions/ext/fetchFolderContents.do'
            }),
            groupField:'category',
            // create reader that reads the RER records
            reader: new Ext.data.JsonReader({
               root: 'folderContents',
               totalProperty: 'totalCount',
               id: 'id'
            }, [
               {name: 'id', mapping: 'id', type: 'int'},
               {name: 'name', mapping: 'name'},
               {name: 'category', mapping: 'category'},
               {name: 'type', mapping: 'type'},
               {name: 'parentId', mapping: 'parentId'},
               {name: 'isPublic', mapping: 'isPublic'},
               {name: 'prompt', mapping: 'prompt'},
               {name: 'isOffline', mapping: 'isOffline'}
            ]),
            remoteSort: true,
            listeners: {
               load : this.onFolderContentsStoreLoad.createDelegate(this)
            }
         });

         folderContentsStore.setDefaultSort('name', 'DESC');

         //--- custom render function for type field...
         var renderIconFn = function (aValue, aCellMetaData, aRecord)
         {
            var html = '<img alt="icon" src="' + ServerEnvironment.baseUrl + "/images/silkIcons/";

            switch (aValue)
                  {
               case ContentNodeTypeEnum.REPORT_PROFILE.value:
                  //                  html += (aRecord.get('isPublic') == 1 ? "reportProfile-public.gif" : "reportProfile-private.gif");
                  if(aRecord.data.isPublic == 1)
                  {
                     html += "report_user_public.png";
                  }
                  else
                  {
                     html += "report_user_private.png";
                  }
                  break;

               case ContentNodeTypeEnum.REPORT.value:
                  html += "report.png";
                  break;

               case ContentNodeTypeEnum.REPORT_GROUP.value:
                  html += "reportGroup.gif";
                  break;

               case ContentNodeTypeEnum.SOFTLINK.value:
                  html += "softlink.gif";
                  break;

               case ContentNodeTypeEnum.WIZARD_REPORT.value:
                  html += "report_edit.png";
                  break;

               case ContentNodeTypeEnum.QUERY_STUDIO_REPORT.value:
                  html += "qs_report_icon.png";
                  break;

               case ContentNodeTypeEnum.ANALYSIS_STUDIO_REPORT.value:
                  html += "as_report_icon.gif";
                  break;

               default:
                  //--- ok...?
                  html += "report-public.gif";
                  break;
            }

            html += '"/>';
            return html;
         };


         //--- custom render function for type field...
         // the column model has information about grid columns
         // dataIndex maps the column to the specific data field in
         // the data store
         var cm = new Ext.grid.ColumnModel(
               [
                  { id: 'type',
                     header: '',
                     dataIndex: 'type',
                     width: 30,
                     renderer: renderIconFn },

                  { id: 'name', // id assigned so we can apply custom css (e.g. .x-grid-col-profileName b { color:#333 })
                     header: applicationResources.getProperty("folderContents.name"),
                     dataIndex: 'name',
                     width: 300,
                     css: 'white-space:normal;'},

                  { id: 'category',
                     header: applicationResources.getProperty("folderContents.category"),
                     dataIndex: 'category',
                     width: 210 },

                  { id: 'prompt',
                     header: applicationResources.getProperty("folderContents.customPrompt"),
                     dataIndex: 'prompt',
                     width: 210 }

               ]);

         cm.defaultSortable = true;


         this.pagingToolbar = new Ext.PagingToolbar({
            pageSize: UserPreference.getItemsPerPage(),
            store: folderContentsStore,
            displayInfo: true,
            displayMsg: 'Executable Content {0} - {1} of {2}',
            emptyMsg: "No Content Found."
         });

         // create the Layout (including the data grid)
         this.contentsGrid = new Ext.grid.GridPanel({
            region:'center',
            border:false,
            enableHdMenu:false,
            enableColumnMove:false,
            enableDragDrop:false,
            loadMask:true,
            store: folderContentsStore,
            cm: cm,
            stripeRows: true,
            tbar:this.workspaceToolbar,
            bbar: this.pagingToolbar,
            view: new Ext.grid.GroupingView({
               forceFit:true,
               groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            })
            ,
            listeners: {
               scope: this,
               load : function(aStore, aRecords, aOptions)
               {
                  alert('contentsGrid::load aRecords='+aRecords.length);
//                  alert('this.id='+this.id);
                  alert('selected='+this.getSelectionModel().hasSelection());
               },

               rowdblclick: function(aGrid, aRowIndex, aEventObject)
               {
                  this.onEditProfileButtonClicked();
               }
            }

         });

         this.propertiesPanel = new Ext.Panel({
            id: 'myPropertiesPanel',
            title: applicationResources.getProperty("propertiesPanel.title.properties"),
            region : 'south',
            layout: 'card',
            items: [new Ext.Panel({
               layout: 'form',
               bodyStyle: "padding:5px 5px 5px 5px",
               items: [{
                  xtype: 'displayfield',
                  style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;",
                  hideLabel: true,
                  value: applicationResources.getProperty("propertiesPanel.blankProperties")
               }],
               border: false
            })],
            activeItem: 0,
            split: true,
            height:200,
            autoScroll : true,
            collapsible :true,

            // map multiple keys to multiple actions by strings and array of codes
            keys: [
               {
                  key: [10,13],
                  fn: function()
                  {
                     alert("Return was pressed");
                  }
               },
               {
                  key: "abc",
                  fn: function()
                  {
                     alert('a, b or c was pressed');
                  }
               },
               {
                  key: "d",
                  ctrl:true,
                  fn: function()
                  {
                     alert('d was pressed');
                  }
               },
               {
                  key: 39,
                  ctrl:true,
                  alt:true,
//                  shift:true,
                  stopEvent: true,
                  fn: function()
                  {
                     alert('ctrl - right arrow was pressed');
                     return true;
                  }
               },
               {
                  key: 9,
                  ctrl:true,
//                  shift:true,
                  stopEvent: true,
                  fn: function()
                  {
                     alert('Control + shift + tab was pressed.');
                  }
               }
            ]


         });

//         this.propertiesPanel.getKeyMap().stopEvent = true;

         var tempPanel = new Ext.Panel({
            region: 'center',
            layout: 'border',
            items: [this.contentsGrid, this.propertiesPanel]
         });

         this.adminUtil.init(this, this.contentsGrid);

//         this.uiObjects = [this.contentsGrid, executableContentTree, this.propertiesPanel];
         this.uiObjects = [tempPanel, executableContentTree];


         // Set the Filter By and Categorize By menus.
         this.setSelectedFilterByValue(ServerEnvironment.contentFilterBy, true);
         this.selectCategorizedByValue(UserPreference.getCategoryView(), true);

         //Needed to get the Pagination toolbar to use the required inputs
         folderContentsStore.proxy.on('beforeload', function(proxy, params)
         {
//            params = Ext.apply(params, this.getFetchParams());
            params.folderId = this.selectedFolderId;
            // Added following logic to categorized by and filter type because they are Integer objects in the Form
            // and the null value gets translated to 0. The absence of the value seems to give the desired results of
            // null.
            var categorizeBy = this.getSelectedCategorizedByValue();
            if (!Ext.isEmpty(categorizeBy))
            {
               params.categorizeBy = categorizeBy;
            }

            var filterType = this.getSelectedFilterByValue();
            if (!Ext.isEmpty(filterType))
            {
               params.filterType = filterType;
            }
         },
         this);

         folderContentsStore.load({
            params: this.getFetchParams(),
            scope:this
         });

         // Note: this event handles situations when the row click event is fired instead of the row selection event.
         this.contentsGrid.on('rowclick', this.onContentsGridRowClick, this);

         UserPreference.on('itemsperpagechanged', this.onItemsPerPageChanged, this);
      },



      /**
       * This method validates the launch type of the selected report output before calling the callback function. It
       * creates a new function by combining the validation code and the callback function. The validation code
       * verifies that launch type is not "launch in Cognos Viewer". Cognos Viewer content is not supported within
       * the ADF. The validation code is too prevent Cognos content from being scheduled, view or any other ADF actions.
       *
       * @param aSuccessfulCallbackFn (Function) The function to call if none of the selected content has a Cognos Viewer launch type.
       * @param aScope (Object) The scope to use for the callback function.
       * @param aMinRows (Number)
       * @param aMaxRows (Number)
       * @param aPredicate (Object)
       * @returns {Function} A new function that validates the launch type before calling the function passed in.
       */
      validateLaunchInfo: function(aSuccessfulCallbackFn, aScope, aMinRows, aMaxRows, aPredicate)
      {
         var callerScope = this;

         return function()
         {
            // Define runtime information that will be used to process the selected report.
            var info = {
               callerScope: callerScope,
               callbackFn: aSuccessfulCallbackFn,
               scope: aScope || this,
               minRows: aMinRows,
               maxRows: aMaxRows,
               predicate: aPredicate
            };
            info.arguments = arguments;
            info.nodeIds = info.callerScope.getNodeIdsForSelectedRows(info.minRows, info.maxRows, info.predicate);

            // Validate the launch types.
            if (Ext.isArray(info.nodeIds) && info.nodeIds.length > 0)
            {
               info.nodeTypes = [];
               for (var i = 0; i < info.nodeIds.length; i++)
               {
                  var o = {
                     nodeId: info.nodeIds[i],
                     nodeType: null
                  };
                  info.callerScope.contentsGrid.getSelectionModel().each(function(aRecord){
                     if (this.nodeId == aRecord.data.id)
                     {
                        this.nodeType = aRecord.data.type;
                        this.found = true;

                        return false;
                     }
                     return true;
                  }, o);
                  if (!Ext.isEmpty(o.nodeType))
                  {
                     info.nodeTypes.push(o.nodeType);
                  }
                  else
                  {
                     alert('Could not find the content type for the selected row [ID='+ o.nodeId+']');
                  }
               }
               info.callerScope.getLaunchInfo(info);
            }
         }
      },


      /**
       * This method validates a single RER ID. It checks the launch type of the RER. If the launch is COGNOS_VIEWER
       * then alert the user that their requested action cannot be processed. If this RER is valid and there are
       * no more RERs to be processed then call the callback function. Otherwise, recursively call this method again.
       *
       * NOTE: This method is called recursively to process the array of content node IDs. The way it traverses the
       * array is it pops the last RER ID off the array and passes it as a parameter to the service call.
       *
       * @param aInfo Runtime validation information that is used to validate the list of RERs.
       */
      getLaunchInfo: function(aInfo)
      {


         RequestUtil.request({
            method: 'GET',
            url: ServerEnvironment.baseUrl + "/rs/report/biLaunchNodeInfo",
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json"
            },
            params: {
               nodeId: aInfo.nodeIds.pop(),
               nodeType: aInfo.nodeTypes.pop()
            },
            scope: aInfo,
            success: function(aResponse, aOptions)
            {
               var results = Ext.decode(aResponse.responseText);
//               alert(aResponse.responseText);


               if (results.cognosLaunchInfo[0].launchPreference == 'COGNOS_VIEWER')
               {
                  // Alert the user that this is Cognos Viewer report and none of the ADF action apply.
                  Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'),
                     String.format(applicationResources.getProperty('folderContents.cognosViewerLaunchType'),results.cognosLaunchInfo[0].targetName));
               }
               else if (aInfo.nodeIds.length > 0)
               {
                  // The current content node ID being processed is valid but there are more content node IDs to be validated.
                  aInfo.callerScope.getLaunchInfo(aInfo);
               }
               else
               {
                  // All of the content node IDs are valid so call the callback function.
                  aInfo.callbackFn.apply(aInfo.scope, aInfo.arguments);
               }
            }
         });
      },

      /**
       * This method is the handler for the Filter By menu when the check mark changes.
       *
       * @param aCheckItem (Ext.menu.CheckItem) Filter By menu item selected.
       * @param aIsChecked (Boolean) The state of the Filter By menu item whether or not it is checked.
       */
      onFilterByCheckChanged: function(aCheckItem, aIsChecked)
      {
         // Only refresh the contents grid when the menu item is gaining the selection. Ignore when the menu item
         // is being deselected to prevent refreshing the contents grid twice.
         if (aIsChecked)
         {
            this.refreshContentsGrid();
         }
      },


      /**
       * This method checks the Filter Menu to see which menu item is currently selected and returns the value
       * for the Filter By option which will be passed to the backend to retrieve the rows to fill the contents grid.
       *
       * @return (String) Filter By option which is currently selected or null if none of the Filter By menu items
       * is selected.
       */
      getSelectedFilterByValue: function()
      {
         var ContentViewFilterByOptions = {
            PUBLIC: 'PUBLIC',
            PRIVATE: 'PRIVATE',
            COMBINED: 'COMBINED'
         };

         var value = null;
         if (Ext.getCmp('FilterByCombined').checked)
         {
            value = ContentViewFilterByOptions.COMBINED;
         }
         else if (Ext.getCmp('FilterByPublic').checked)
         {
            value = ContentViewFilterByOptions.PUBLIC;
         }
         else if (Ext.getCmp('FilterByPrivate').checked)
         {
            value = ContentViewFilterByOptions.PRIVATE;
         }
         return value;
      },


      /**
       * This method sets the content filter by menu item in the Filter By menu.
       * The default option is the COMBINED option.
       *
       * @param aFilterByOption (String) - Filter By option.
       * @param aSuppressEvent (Boolean) - Suppress the checkchange event from firing.
       */
      setSelectedFilterByValue: function(aFilterByOption, aSuppressEvent)
      {
         var ContentViewFilterByOptions = {
            PUBLIC: 'PUBLIC',
            PRIVATE: 'PRIVATE',
            COMBINED: 'COMBINED'
         };

         if (aFilterByOption == ContentViewFilterByOptions.COMBINED)
         {
            Ext.getCmp('FilterByCombined').setChecked(true, aSuppressEvent);
         }
         else if (aFilterByOption == ContentViewFilterByOptions.PUBLIC)
         {
            Ext.getCmp('FilterByPublic').setChecked(true, aSuppressEvent);
         }
         else if (aFilterByOption == ContentViewFilterByOptions.PRIVATE)
         {
            Ext.getCmp('FilterByPrivate').setChecked(true, aSuppressEvent);
         }
         else
         {
            Ext.getCmp('FilterByCombined').setChecked(true, aSuppressEvent);
         }
      },


      /**
       * This method is the handler for the Categorized By Menu. It handles the check changed event which occurs when
       * the checked state on a Categorized By menu item changes.
       *
       * @param aCheckItem (Ext.menu.CheckItem) Categorized By menu item for which the change is occurring.
       * @param aIsChecked (Boolean) The state of the menu item, true is the menu item is selected and false
       * if it losing the selection.
       *
       */
      onCategorizeByCheckChanged: function(aCheckItem, aIsChecked)
      {
         // Only refresh the contents grid when the menu item is gaining the selection. Ignore when the menu item
         // is being deselected to prevent refreshing the contents grid twice.
         if (aIsChecked)
         {
            this.refreshContentsGrid();
         }
      },


      /**
       * This method examines the Categorized By menu to find the selected menu item and return Categorized By option
       * which will be used to refresh the contents grid.
       *
       * @return (Integer) Categorized By option or null if none of the Categorized By menu items are not selected.
       */
      getSelectedCategorizedByValue: function()
      {
         var ContentViewCategorizeByEnum = {
            FLAT_VIEW: 0,
            BY_SOURCE_REPORT: 1,
            BY_PROMPT_TYPE: 2,
            BY_TYPE: 3,
            BY_USAGE_FREQUENCY: 4,
            OVERLAY_VIEW: 5
         };

         var currentValue = null;
         if (Ext.getCmp('CategorizeByFlatView').checked)
         {
            currentValue = ContentViewCategorizeByEnum.FLAT_VIEW;
         }
         else if (Ext.getCmp('CategorizeBySourceReport').checked)
         {
            currentValue = ContentViewCategorizeByEnum.BY_SOURCE_REPORT;
         }
         else if (Ext.getCmp('CategorizeByReportType').checked)
         {
            currentValue = ContentViewCategorizeByEnum.BY_TYPE;
         }
         else if (Ext.getCmp('CategorizeByReportInputs').checked)
         {
            currentValue = ContentViewCategorizeByEnum.BY_PROMPT_TYPE;
         }
         else if (Ext.getCmp('CategorizeByFrequencyOfUse').checked)
         {
            currentValue = ContentViewCategorizeByEnum.BY_USAGE_FREQUENCY;
         }
         else if (Ext.getCmp('CategorizeByPublicAndPrivate').checked)
         {
            currentValue = ContentViewCategorizeByEnum.OVERLAY_VIEW;
         }

         return currentValue;
      },


      /**
       * This method selects the appropriate Categorized By menu item and trigger a refresh of the contents grid.
       * Default is flat view.
       *
       * @param aCategoryView (Integer) Categorized By option.
       * @param aSuppressEvent (Boolean) - Suppress the checkchange event from firing.
       */
      selectCategorizedByValue: function(aCategoryView, aSuppressEvent)
      {
         var ContentViewCategorizeByEnum = {
            FLAT_VIEW: 0,
            BY_SOURCE_REPORT: 1,
            BY_PROMPT_TYPE: 2,
            BY_TYPE: 3,
            BY_USAGE_FREQUENCY: 4,
            OVERLAY_VIEW: 5
         };

         if (aCategoryView == ContentViewCategorizeByEnum.FLAT_VIEW)
         {
            Ext.getCmp('CategorizeByFlatView').setChecked(true, aSuppressEvent);
         }
         else if (aCategoryView == ContentViewCategorizeByEnum.BY_SOURCE_REPORT)
         {
            Ext.getCmp('CategorizeBySourceReport').setChecked(true, aSuppressEvent);
         }
         else if (aCategoryView == ContentViewCategorizeByEnum.BY_TYPE)
         {
            Ext.getCmp('CategorizeByReportType').setChecked(true, aSuppressEvent);
         }
         else if (aCategoryView == ContentViewCategorizeByEnum.BY_PROMPT_TYPE)
         {
            Ext.getCmp('CategorizeByReportInputs').setChecked(true, aSuppressEvent);
         }
         else if (aCategoryView == ContentViewCategorizeByEnum.BY_USAGE_FREQUENCY)
         {
            Ext.getCmp('CategorizeByFrequencyOfUse').setChecked(true, aSuppressEvent);
         }
         else if (aCategoryView == ContentViewCategorizeByEnum.OVERLAY_VIEW)
         {
            Ext.getCmp('CategorizeByPublicAndPrivate').setChecked(true, aSuppressEvent);
         }
         else
         {
            Ext.getCmp('CategorizeByFlatView').setChecked(true, aSuppressEvent);
         }

      },


      setCanDeletePublicItems: function(aBool)
      {
         this.canDeletePublicItems = aBool;
      },

      /**
       * returns the params used by the ajax call (based on URL params)
       */
      getFetchParams: function()
      {
         var params = {
            folderId: this.selectedFolderId,
            start : 0,
            limit : UserPreference.getItemsPerPage()
         };

         // Added following logic to categorized by and filter type because they are Integer objects in the Form
         // and the null value gets translated to 0. The absence of the value seems to give the desired results of
         // null.
         var categorizeBy = this.getSelectedCategorizedByValue();
         if (!Ext.isEmpty(categorizeBy))
         {
            params = Ext.apply(params, {
               categorizeBy: categorizeBy
            });
         }


         var filterType = this.getSelectedFilterByValue();
         if (!Ext.isEmpty(filterType))
         {
            params = Ext.apply(params, {
               filterType: filterType
            });
         }


         return params;
      },

      /**
       * update the params passed to this screen
       */
      updateParameters: function (aParams)
      {
         if (this.currentParams != aParams)
         {
            this.currentParams = aParams;

            var nvPairs = this.currentParams.split("&");

            var name;
            for (var i = 0; i < nvPairs.length; ++i)
            {
               name = JsUtil.substringBeforeFirst(nvPairs[i], "=");

               var formElement = Ext.get(name);
               if (formElement)
               {
                  var value = JsUtil.substringAfterFirst(nvPairs[i], "=");
                  //formElement.value = value;
                  (document.forms[0])[name].value = value;
               }
            }

            this.refreshContentsGrid();
         }
      },

      /**
       * refreshes the RER grid
       */
      refreshContentsGrid: function()
      {
         Adf.folderContentsUi.adminUtil.refreshContentsGrid(this.getFetchParams());
      },


      /**
       * This method handles the row clicks on the Contents Grid.  The row click event is fired when a row is
       * clicked on and the selection does not change.  When this event is captured, the properties panel is refreshed
       * with the appropriate details.
       *
       * @param aGrid - The Contents grid.
       * @param aRowIndex - The index of the row clicked on.
       * @param aEventObject - An event object.
       */
      onContentsGridRowClick: function(aGrid, aRowIndex, aEventObject)
      {
         this.onContentsGridRowSelect(aGrid.getSelectionModel());
      },


      /**
       * This method handles the load event for the Folder Contents data store. This event is raised after the
       * data stores loads in records. This method will handle the special situation when records are loaded and none
       * of the records are selected (or no records are loaded).  The issue in this situation is that no row selection
       * event is raised so the detail properties pane is not updated and shows the details of the last selection.
       * When records are loaded and no records are selected, this method will update the detail properties pane
       * as if the row selection event was raised with no rows selected.
       *
       * @param aStore (Ext.data.GroupingStore) - The Folder Contents data store.
       * @param aRecords (Ext.data.Record) - Array of records loaded.
       * @param aOptions (Object) - The parameters used to load the records.
       */
      onFolderContentsStoreLoad : function(aStore, aRecords, aOptions)
      {
         if (!this.contentsGrid.getSelectionModel().hasSelection())
         {
            this.onContentsGridRowSelect(this.contentsGrid.getSelectionModel());
         }
      },


      /**
       * This method handles the event when a row is selected in the content grid.
       *
       * @param aSelectionModel - Content grid selection model.
       */
      onContentsGridRowSelect: function(aSelectionModel)
      {
         switch (aSelectionModel.getCount())
         {
            case 0:
               this.updatePropertiesCard(new Ext.Panel({
                  layout: 'form',
                  bodyStyle: "padding:5px 5px 5px 5px",
                  items: [{
                     xtype: 'displayfield',
                     style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;",
                     hideLabel: true,
                     value: applicationResources.getProperty("propertiesPanel.blankProperties")
                  }],
                  border: false
               }));
            break;

            case 1:
               var selected = aSelectionModel.getSelected();

//               alert(selected.data.type);
               // 0 - Wizard Report
               // 1 - Report
               // 5 - Report Profile
               RequestUtil.request({
                  url: ServerEnvironment.baseUrl + '/secure/actions/ext/getContentNodeDetails.do',
                  success: this.getContentNodeDetailsSuccess,
                  failure: this.getContentNodeDetailsFailure,
                  scope: this,
                  params: {
                     nodeId: selected.data.id,
                     nodeType: selected.data.type
                  }
               });

            break;

            default:
               this.updatePropertiesCard(new Ext.Panel({
                  layout: 'form',
                  bodyStyle: "padding:5px 5px 5px 5px",
                  items: [{
                     xtype: 'displayfield',
                     style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;",
                     hideLabel: true,
                     value: applicationResources.getProperty("propertiesPanel.multipleItemsSelected")
                  }],
                  border: false
               }));
            break;
         }
      },


      /**
       * The method handles the successful callback from the AJAX call to get the content node details.
       *
       * @param aResponse - AJAX response.
       * @param aOptions - The parameters passed into the AJAX call.
       */
      getContentNodeDetailsSuccess: function(aResponse, aOptions)
      {
//         alert(aResponse.responseText);
         var details = new Adf.ContentDetailsForm();
         var data = Ext.decode(aResponse.responseText);
         details.loadData(data);
         this.updatePropertiesCard(details);

      },


      /**
       * The method handles the unsuccessful callback from the AJAX call to get the content node details.
       *
       * @param aResponse - AJAX response.
       * @param aOptions - The parameters passed into the AJAX call.
       */
      getContentNodeDetailsFailure: function(aResponse, aOptions)
      {

      },


      /**
       * This method replaces the existing panel in the properties panel with a new panel.
       *
       * @param aNewCard - The new panel to display in the properties panel.
       */
      updatePropertiesCard: function(aNewCard)
      {
         var oldCard = this.propertiesPanel.activeItem;
         this.propertiesPanel.add(aNewCard);
         this.propertiesPanel.getLayout().setActiveItem(aNewCard);
         this.propertiesPanel.remove(oldCard);
      },


      /**
       * the refresh button was clicked
       */
      getNodeIdsForSelectedRows: function (aMinRows, aMaxRows, aPredicate)
      {
         var selected = this.contentsGrid.getSelectionModel().getSelections();


         if (aMinRows && selected.length < aMinRows)
         {
            Ext.Msg.alert(applicationResources.getProperty("reportWizard.msg.invalidSelection.title"), applicationResources.getPropertyWithParameters("general.tooFewItemsSelected", [aMinRows]));
            return null;
         }
         else if (aMaxRows && selected.length > aMaxRows)
         {
            Ext.Msg.alert(applicationResources.getProperty("reportWizard.msg.invalidSelection.title"), applicationResources.getPropertyWithParameters("general.tooManyRowsSelected", [aMaxRows]));
            return null;
         }
         else
         {
            var nodeIds = new Array();
            for (var i = 0; i < selected.length; ++i)
            {
               //if (selected[i].data.status > 0)
               if ((!aPredicate) || aPredicate.matches(selected[i]))
               {
                  nodeIds.push(selected[i].data.id);
               }
            }
            return nodeIds;
         }

      },

      onRefreshButtonClicked: function (aButton)
      {
         this.refreshContentsGrid();
      },

      onExecuteButtonClicked: function (aButton)
      {
         RequestUtil.pingUserSession(function()
            {
               var nodes = this.getNodeIdsForSelectedRows(1, 30, null);

               if (nodes != null && nodes.length > 0)
               {
                  Ext.Msg.wait(applicationResources.getProperty("general.submittingRequest"));

                  RequestUtil.request({
                     url: ServerEnvironment.baseUrl + "/secure/actions/ext/executeReports.do",
                     params: JsUtil.arrayToUrlParams(nodes, "nodeId"),
                     method: "POST",
                     callback: function (aOptions, aSuccess, aResponse) {

                        Ext.Msg.hide();

                        // Extracting the execution results from response.
                        var response = Ext.decode(aResponse.responseText);

                        // Display failures and error messages.
                        if (!Ext.isEmpty(response.errorMessage))
                        {
                           // If there is 1 report failure and the failure was caused by missing parameters then
                           // the error message will include a prompt to allow the user to edit the parameters. So
                           // the error message needs to be displayed in a confirmation alert.
                           if (!Ext.isEmpty(response.failedReports) &&
                               response.failedReports.length == 1 &&
                               response.failedReports[0].failureReasonCode == response.FailureReasonCodes.MISSING_REQUIRED_PARAMETER)
                           {
                              if (confirm(response.errorMessage))
                              {
                                 var windowUrl = ServerEnvironment.contextPath + "/secure/actions/ext/editReiWindow.do?launchNodeId=" + response.failedReports[0].id + "&launchNodeType=" + response.failedReports[0].type;
                                 var windowName = ServerEnvironment.windowNamePrefix + "_EditRei_" + response.failedReports[0].id;

                                 var geom = new BrowserGeometry();
                                 var win = window.open(windowUrl,
                                       windowName,
                                       "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

                                 win.focus();
                              }
                           }
                           else
                           {
                              alert(response.errorMessage);
                           }
                        }


                        // Display any RER messages.
                        if (!Ext.isEmpty(response.displayMessage))
                        {
                           FadeMessageController.getInstance().showFadeMessage(response.displayMessage, 3000);
                        }


                        // Notify the RER Status screen that reports are executing.
                        var executionMessage = Ext.applyIf({type: "reportExecution"}, response);
                        Adf.frameSetUi.eventChannel.publish(executionMessage);


                        // Launch reports in the Cognos Viewer.
                        if (Ext.isArray(response.cognosRerIdsToView))
                        {
                           for (var cv = 0; cv < response.cognosRerIdsToView.length; cv++)
                           {
                              // Open a blank browser window.
                              var windowName = Ext.id().replace(/-/g, "_");
                              var geom = new BrowserGeometry();
                              var win = window.open(ServerEnvironment.contextPath + '/secure/actions/ext/launchCognosViewer.do?rerId=' + response.cognosRerIdsToView[cv],
                                 windowName,
                                 "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
                                win.focus();

                           }
                        }

                         //todo perhaps remove me
                          // Launch the report into the report viewer if the RER Inputs specify to run the report in the
                        // foreground.
                        if (!Ext.isEmpty(response.rerIdsToLaunchInForeground))
                        {
                           launchReportViewer(response.rerIdsToLaunchInForeground);
                        }
                      // Launch reports in new browser windows.
                      if (!Ext.isEmpty(response.windowsToOpen))
                      {
                         var geom = new BrowserGeometry();
                         this.hiddenIframe.onload = function(){

                            for (var count = 0; count < response.windowsToOpen.length; count++)
                            {
                               var eachWindow = response.windowsToOpen[count];
                               var win = window.open(eachWindow,
                                  "",
                                  "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

                               win.focus();
                            }

                         };

                         this.hiddenIframe.src = "" + response.warmUpUrl;
                      }
               },
                     scope: this
                  });
               }
            }, this);
      },






      /**
       * the schedule button was clicked
       */
      onScheduleButtonClicked: function (aButton)
      {

         var nodes = this.getNodeIdsForSelectedRows(1, 30, null);

         if (nodes != null && nodes.length > 0)
         {
            //--- this request will validate that all selected nodes already have all of their
            //    required parameters....

            RequestUtil.request({
               url: ServerEnvironment.baseUrl + "/secure/actions/checkRequiredParametersAction.do?",
               params: JsUtil.arrayToUrlParams(nodes, "targetIds"),
               method: "POST",
               callback: function (aOptions, aSuccess, aResponse)
               {
                  //alert("check params callback, success [" + aSuccess + "]\n\n" +  aResponse.responseText);

                  //--- response will contain something like :
                  //
                  //    var allParametersMet = true;
                  //
                  // note, this can currently contain an alert if not all params are met, we should
                  // change this to a JS array with enough info for the alert to be handled here on
                  // the client side...
                  eval(aResponse.responseText);
                  if (!allParametersMet)
                  {
                     return;
                  }

                  var initialRecords = this.contentsGrid.getSelectionModel().getSelections();
                  var initialData = [];
                  for(var i=0;i<initialRecords.length;i++)
                  {
                     initialData.push(initialRecords[i].data);
                  }

                  ScheduleWizard.launch({
                     targets: initialData
                  });
               },
               scope: this
            });
         }
      },

      getNodesForSelectedRows: function (aMinRows, aMaxRows, aPredicate)
      {
         var selected = this.contentsGrid.getSelectionModel().getSelections();


         if (selected.length < aMinRows)
         {
            alert(applicationResources.getPropertyWithParameters("general.tooFewItemsSelected", [aMinRows]));
            return null;
         }
         else if (selected.length > aMaxRows)
         {
            alert(applicationResources.getPropertyWithParameters("general.tooManyRowsSelected", [aMaxRows]));
            return null;
         }
         else
         {
            return selected;
         }

      },

      ContentViewItemType: function(aName, anEnum, anIconSrc)
      {
         this.name = aName;
         this.jsEnum = anEnum;
         this.iconSrc = anIconSrc;
      },


      /**
       * This method processes the delete button click.
       *
       * @param aButton - (Ext.Button) The delete button.
       */
      onDeleteButtonClicked: function (aButton)
      {
         if (UserPreference.getConfirmDeletes())
         {
            Ext.MessageBox.confirm(
               applicationResources.getProperty("general.dialog.confirmTitle"),
               applicationResources.getProperty("general.confirmDeletions"),
               function (aButton)
               {
                  if ('yes' == aButton)
                  {
                    this.processDeletion();
                  }
               }.createDelegate(this)
            );

         }
         else
         {
            this.processDeletion();
         }
      },


      processDeletion: function()
      {
         var selectedForDelete = this.getNodesForSelectedRows(1, 30, null);

         if (selectedForDelete != null && selectedForDelete.length > 0)
         {
            var notEligableForDelete = new Array();

            var folderId = this.selectedFolderId;
            var profileIds = '';
            var reportIds = '';
            var numOfReportIds = 0;


            for (var i = 0; i < selectedForDelete.length; ++i)
            {
               //deletion is allowed on profiles and wizard reports only
               //the wizard report or profile must be private or you must be a system admin
               if ((selectedForDelete[i].data.isPublic == 0 || this.canDeletePublicItems) && ((selectedForDelete[i].data.type == this.REPORT_PROFILE.jsEnum.value) || (selectedForDelete[i].data.type == this.WIZARD_REPORT.jsEnum.value)))
               {
                  if (selectedForDelete[i].data.type == this.REPORT_PROFILE.jsEnum.value)
                  {
                     profileIds += "profileId=" + selectedForDelete[i].data.id + "&";
                  }
                  else if (selectedForDelete[i].data.type == this.WIZARD_REPORT.jsEnum.value)
                  {
                     reportIds += "reportId=" + selectedForDelete[i].data.id + "&";
                     numOfReportIds++;
                  }
               }
               else
               {
                  notEligableForDelete.push(selectedForDelete[i]);
                  selectedForDelete.splice(i, 1);
                  i--;
               }
            }

            if (notEligableForDelete.length > 0)
            {
               var notDeleted = "";
               for (var x = 0; x < notEligableForDelete.length; x++)
               {
                  notDeleted += "<li>" + notEligableForDelete[x].data.name + "</li>";
               }

               if (notEligableForDelete.length > 0)
               {
                  Ext.Msg.minWidth = 350;
                  Ext.Msg.alert("Invalid Delete", "<p><b>" + applicationResources.getProperty("general.dialog.deleteWarning") + "</b></p><br/>" +
                                                  notDeleted);
               }
            }
            else
            {
               this.deleteContentNodes(folderId, profileIds, reportIds);
            }
         }
      },

      deleteContentNodes: function (aFolderId, aProfileIds, aReportsIds)
      {
         var url = ServerEnvironment.baseUrl + "/secure/actions/deleteContentNode.do?fromFolderId=" + aFolderId;

         if(aProfileIds && '' != aProfileIds)
         {
            url += "&" + aProfileIds;
         }

         if(aReportsIds && '' != aReportsIds)
         {
            if(!aProfileIds || '' == aProfileIds)
            {
               url += "&";
            }
            url += aReportsIds;
         }

         RequestUtil.request({
            url: url,
            method: "POST",
            callback: function (aOptions, aSuccess, aResponse)
            {
               //todo - Struts action needs to be updated to return JS for the Ext
               this.refreshContentsGrid();
               if (aProfileIds != '' && aReportsIds != '')
               {
                  Ext.Msg.alert("Finished", 'The selected report(s) and profile(s) have been deleted.');
               }
               else if (aProfileIds != '')
               {
                  Ext.Msg.alert("Finished", 'The selected profile(s) have been deleted.');
               }
               else if (aReportsIds != '')
                  {
                     Ext.Msg.alert("Finished", 'The selected report(s) have been deleted.');
                  }
            },
            scope: this
         });

      },




      /**
       * the edit profile button was clicked
       */
      onEditProfileButtonClicked: function (aButton)
      {
         RequestUtil.pingUserSession(function()
            {
               var targetIds = this.getNodeIdsForSelectedRows(1, 1, {
                  matches: function (aRow)
                  {
                     if (aRow.data.type == ContentNodeTypeEnum.QUERY_STUDIO_REPORT.value ||
                         aRow.data.type == ContentNodeTypeEnum.ANALYSIS_STUDIO_REPORT.value)
                     {
                        Ext.MessageBox.alert(applicationResources.getProperty('folderContents.editFailTitle'), applicationResources.getProperty('folderContents.editFail'));
                        return false;
                     }

                     return true;
                  }
               });

               if (targetIds != null && targetIds.length == 1)
               {
                  var selectedRow = this.contentsGrid.getSelectionModel().getSelections()[0];

                  var windowUrl = ServerEnvironment.contextPath + "/secure/actions/ext/editReiWindow.do?launchNodeId=" + selectedRow.data['id'] + "&launchNodeType=" + selectedRow.data['type'];
                  var windowName = ServerEnvironment.windowNamePrefix + "_EditRei_" + selectedRow.data['id'];

                  var geom = new BrowserGeometry();
                  var win = window.open(windowUrl,
                        windowName,
                        "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

                  win.focus();
               }
            }, this);
      },

      /**
       * the "create wizard report" button was clicked
       */
      onCreateWizardReportButtonClicked: function (aButton)
      {
         RequestUtil.pingUserSession(function(){
    //        var url = ServerEnvironment.baseUrl + "/secure/actions/reportWizard.do?wizardStep=initialize";
            var url = ServerEnvironment.baseUrl + "/secure/actions/extReportWizard.do";

            var geom = new BrowserGeometry();
            var windowName = ServerEnvironment.windowNamePrefix + "_ReportWizard";
            var win = JsUtil.openNewWindow(url,
                  windowName,
                  "width=1200,height=750,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");
            win.focus();
         }, this);
      },

      onChangeOwnerButtonClicked: function()
      {
         var targetIds = this.getNodeIdsForSelectedRows(1);
         if(!targetIds)
         {
            return null;
         }

         RequestUtil.request({
            url: ServerEnvironment.baseUrl + "/secure/actions/changeOwner/getUsersAndProfiles.do",
            params: {
               targetIds: targetIds
            },
            success: function(aResponse)
            {
               var usersAndProfiles = Ext.decode(aResponse.responseText);

               var usersCombo = new Ext.form.ComboBox({
                  fieldLabel: applicationResources.getProperty("dialogs.changeOwner.changeOwnerTo"),
                  triggerAction: "all",
                  mode: "local",
                  lazyRender: true,
                  editable: false,
                  width: 125,
                  store: new Ext.data.JsonStore({
                     fields: ["id", "logon"],
                     data: usersAndProfiles.users
                  }),
                  valueField: "id",
                  displayField: "logon",
                  allowBlank: false,
                  value: usersAndProfiles.users[0].id
               });

               var usersComposite = new Ext.form.CompositeField({
                  region: "north",
                  height: 25,
                  items: [
                     {
                        xtype: "displayfield",
                        value: "Change Owner To:&nbsp;",
                        style: "padding-top: 4px;"
                     },
                     usersCombo]
               });

               var profilesStore = new Ext.data.JsonStore({
                  fields: ["defaultName", "logon"],
                  data: usersAndProfiles.profiles
               });

               var nameColumnId = Ext.id();

               var profilesGrid = new Ext.grid.GridPanel({
                  region: "center",
                  store: profilesStore,
                  columns: [
                     {id: nameColumnId, header: applicationResources.getProperty("profileWizard.content.name"), dataIndex: "defaultName"},
                     {header: applicationResources.getProperty("dialogs.changeOwner.header.owner"), dataIndex: "logon", width: 125}
                  ],
                  autoExpandColumn: nameColumnId,
                  autoScroll: true
               });

               profilesGrid.getSelectionModel().lock();

               var changeOwnerWindow = new Ext.Window({
                  title: applicationResources.getProperty("button.changeOwner"),
                  layout: "border",
                  modal: true,
                  items: [usersComposite, profilesGrid],
                  height: 300,
                  width: 400,
                  buttons: [{
                     text: applicationResources.getProperty("admin.button.ok"),
                     handler: function()
                     {
                        RequestUtil.request({
                           url: ServerEnvironment.baseUrl + "/secure/actions/changeOwner/saveChanges.do",
                           params: {
                              ownerId: usersCombo.getValue(),
                              targetIds: targetIds
                           }
                        });
                        changeOwnerWindow.close();
                     }
                  },{
                     text: applicationResources.getProperty("admin.button.cancel"),
                     handler: function()
                     {
                        changeOwnerWindow.close();
                     }
                  }]
               });

               changeOwnerWindow.show();
            }
         });
      },

      /**
       * the edit in report wizard button was clicked
       */
      onEditWizardReportButtonClicked : function (aButton)
      {
         var targetIds = this.getNodeIdsForSelectedRows(1, 1, {
            matches: function (aRow)
            {
               if (aRow.data.type != ContentNodeTypeEnum.WIZARD_REPORT.value)
               {
                  Ext.MessageBox.alert(applicationResources.getProperty("general.permissionDenied"), applicationResources.getProperty("folderContents.errMsg.optionOnlyForWizardReports"));
                  return false;
               }
               return true;
            }
         });

         if (targetIds != null && targetIds.length == 1)
         {
//            var url = ServerEnvironment.baseUrl + "/secure/actions/reportWizard.do?wizardStep=initialize&reportId=" + targetIds[0];
            var url = ServerEnvironment.baseUrl + "/secure/actions/extReportWizard.do?reportId=" + targetIds[0];

            var windowName = ServerEnvironment.windowNamePrefix + "_ReportWizard_" + targetIds[0];

            var geom = new BrowserGeometry();
            var win = window.open(url,
                  windowName,
                  "width=1000,height=750,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=no,resizable=yes,status=yes");

            win.focus();
         }
      },

      /**
       * the edit in report wizard button was clicked
       */
      onRenameMoveButtonClicked: function (aButton)
      {
         var targetIds = this.getNodeIdsForSelectedRows(1, 1, {
            matches: function (aRow)
            {
               // TODO: this should really be checking permissions
               if (aRow.data.type == ContentNodeTypeEnum.REPORT.value ||
                   aRow.data.type == ContentNodeTypeEnum.QUERY_STUDIO_REPORT.value ||
                   aRow.data.type == ContentNodeTypeEnum.ANALYSIS_STUDIO_REPORT.value)
               {
                  Ext.MessageBox.alert(applicationResources.getProperty("general.permissionDenied"), applicationResources.getProperty("folderContents.errMsg.renameReportBadPermissions"));
                  return false;
               }

               return true;
            }
         });

         if (targetIds != null && targetIds.length == 1)
         {
            var selectedRow = this.contentsGrid.getSelectionModel().getSelections()[0];

            var dlg = new Adf.RenameReportDialog({
               nodeId: targetIds[0],
               nodeType: selectedRow.data.type
            });
            dlg.show();
         }
      },

      /**
       * This method handles the user preferences button click event. It displays the user preferences screen.
       *
       * @param aButton - The user preferences button.
       * @param aEventObject - A button click event.
       */
      onUserPreferencesButtonClicked: function(aButton, aEventObject)
      {
         UserPreferencesUi.launch();
      },

      /**
       * This method handles the report metadata button click event. It displays the user preferences screen.
       *
       * @param aButton - The user preferences button.
       * @param aEventObject - A button click event.
       */
      onReportMetadataButtonClicked: function(aButton, aEventObject)
      {
         var targetIds = this.getNodeIdsForSelectedRows(1, 1, {
            matches: function (aRow)
            {
               if(aRow.data.type != ContentNodeTypeEnum.REPORT.value)
               {
                  Ext.Msg.alert(applicationResources.getProperty('folderContents.failedOperationTitle'), applicationResources.getProperty('folderContents.warnMetaData'));
                  return false;
               }
               return true;
            }
         });

         if (targetIds != null && targetIds.length == 1)
         {
            var url = ServerEnvironment.baseUrl + "/secure/actions/admin/reportMd/edit.do?reportId=" + targetIds[0];

            var windowName = ServerEnvironment.windowNamePrefix + "_EditMetadata_" + targetIds[0];

            var geom = new BrowserGeometry();
            var win = window.open(url,
                  windowName,
                  "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

            win.focus();
         }
      },

      /**
       * This method handles Items Per Page Changed event.
       *
       * @param aUserPreference - User preference object.
       */
      onItemsPerPageChanged: function(aUserPreference)
      {
         this.pagingToolbar.pageSize = aUserPreference.getItemsPerPage();
      }


   };
}();


var workspaceUi = Adf.folderContentsUi;


Adf.ContentDetailsForm = Ext.extend(Ext.FormPanel, {

   constructor: function(aConfig) {
//      this.addEvents({
//         'expressionCreated': true,
//         'expressionChanged': true,
//         'expressionDeleted': true
//      });

      var contentNodeDetailsForm = {
         contentNodeName: 'contentNodeName',
         reportSimplePath: 'reportSimplePath',
         targetReportCustomPromptName: 'targetReportCustomPromptName',
         jsFormattedReportDescription: 'jsFormattedReportDescription',
         reportExecutionInputs: {
            parameterSet: [{
               name: 'name',
               values: [{
                  displayText: 'displayText',
                  fuzzyParameterValue: 'fuzzyParameterValue',
                  auxiliaryValue: 'auxiliaryValue'
               }]
            }],
            outputPreferences: {
               enabledOutputPreferences: [{
                  outputFormat: {
                     displayValue: 'displayValue'
                  }
               }]
            },
            runtimeFilters: {}
         },
         numberOfTimesRun: 'numberOfTimesRun',
         contentNode: {
            lastUpdatedBy: 'lastUpdatedBy',
            lastUpdatedOn: 'lastUpdatedOn'
         }
      };

      aConfig = Ext.apply({

         autoScroll: true,
         border: false,
         layout: "column",
         bodyStyle: "padding:5px 5px 5px 5px",
         defaults: {
//            layout: "form"
//            ,
            bodyStyle: "padding:5px 5px 5px 5px"
         },
         items: []
      }, aConfig);

      Adf.ContentDetailsForm.superclass.constructor.call(this, aConfig);


//      Your postprocessing here
   },


   nodeTypes: {
      WIZARD_REPORT: 0,
      REPORT: 1,
      REPORT_PROFILE: 5,
      SOFT_LINK: 4,
      QUERY_STUDIO_REPORT: 7,
      ANALYSIS_STUDIO_REPORT: 8
   },


   /**
    * This method displays the content details based on the node type.
    *
    * @param aContentNodeDetailsForm - The content node details action form as a JSON object.
    */
   loadData: function(aContentNodeDetailsForm)
   {
      if ((aContentNodeDetailsForm.nodeType == this.nodeTypes.WIZARD_REPORT) ||
          (aContentNodeDetailsForm.nodeType == this.nodeTypes.REPORT))
      {
         // General properties.
         this.add(new Ext.form.FieldSet({
            title: applicationResources.getProperty('propertiesPanel.title.general'),
            columnWidth: 1,
            style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
            labelWidth: 130,
            items: [
               new Ext.form.DisplayField({
                  style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
                  labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
                  fieldLabel: applicationResources.getProperty('propertiesPanel.label.reportName'),
                  labelSeparator: "",
                  value: aContentNodeDetailsForm.contentNodeName
               }),
               new Ext.form.DisplayField({
                  style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
                  labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
                  fieldLabel: applicationResources.getProperty('propertiesPanel.label.reportPath'),
                  labelSeparator: "",
                  value: aContentNodeDetailsForm.reportSimplePath
               }),
               new Ext.form.DisplayField({
                  style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
                  labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
                  fieldLabel: applicationResources.getProperty('propertiesPanel.label.customPrompt'),
                  labelSeparator: "",
                  value: aContentNodeDetailsForm.targetReportCustomPromptName
               }),
               new Ext.form.DisplayField({
                  style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
                  labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
                  fieldLabel: applicationResources.getProperty('propertiesPanel.label.reportDescription'),
                  labelSeparator: "",
                  value: this.formatReportDescription(aContentNodeDetailsForm.reportDescription)
               })
            ]
         }));

         this.createReportDetailsSections(aContentNodeDetailsForm);
      }
      else if ((aContentNodeDetailsForm.nodeType == this.nodeTypes.REPORT_PROFILE) ||
               (aContentNodeDetailsForm.nodeType == this.nodeTypes.SOFT_LINK))
      {
         // General Properties.
         var generalItems = [];

         // 5 - Report profile.
         if (aContentNodeDetailsForm.nodeType == this.nodeTypes.REPORT_PROFILE)
         {
            generalItems.push(new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               fieldLabel: applicationResources.getProperty('propertiesPanel.label.reportProfileName'),
               labelSeparator: "",
               value: aContentNodeDetailsForm.contentNodeName
            }));
         }

         // 4 - Soft link.
         if (aContentNodeDetailsForm.nodeType == this.nodeTypes.SOFT_LINK)
         {
            generalItems.push(new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               fieldLabel: applicationResources.getProperty('propertiesPanel.label.softLinkName'),
               labelSeparator: "",
               value: aContentNodeDetailsForm.contentNodeName
            }));

            generalItems.push(new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               fieldLabel: applicationResources.getProperty('propertiesPanel.label.targetReportProfile'),
               labelSeparator: "",
               value: aContentNodeDetailsForm.targetProfileSimplePath
            }));
         }

         generalItems.push(new Ext.form.DisplayField({
            style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
            labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
            fieldLabel: applicationResources.getProperty('propertiesPanel.label.targetReportPath'),
            labelSeparator: "",
            value: aContentNodeDetailsForm.targetReportSimplePath
         }));

         generalItems.push(new Ext.form.DisplayField({
            style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
            labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
            fieldLabel: applicationResources.getProperty('propertiesPanel.label.customPrompt'),
            labelSeparator: "",
//            value: applicationResources.getProperty('propertiesPanel.label.customPrompt')
            value: aContentNodeDetailsForm.targetReportCustomPromptName
         }));

         if (aContentNodeDetailsForm.recentRerId)
         {
            generalItems.push(new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               hideLabel: true,
               value: String.format('<a href="javascript:launchReportViewer([{0}])">View Recent Output</a>', aContentNodeDetailsForm.recentRerId)
            }));
         }

         this.add(new Ext.form.FieldSet({
//         this.add(new Ext.Panel({
            title: applicationResources.getProperty('propertiesPanel.title.general'),
            layout: 'form',
            columnWidth: 1,
            style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
            bodyStyle: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},

            labelWidth: 130,
            items: generalItems
         }));


         this.createReportDetailsSections(aContentNodeDetailsForm);
      }
      else if ((aContentNodeDetailsForm.nodeType == this.nodeTypes.QUERY_STUDIO_REPORT) ||
               (aContentNodeDetailsForm.nodeType == this.nodeTypes.ANALYSIS_STUDIO_REPORT))
      {
         var generalItems = [];

         generalItems.push(new Ext.form.DisplayField({
            style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
            labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
            fieldLabel: applicationResources.getProperty('propertiesPanel.label.reportName'),
            labelSeparator: "",
            value: aContentNodeDetailsForm.contentNodeName
         }));


         generalItems.push(new Ext.form.DisplayField({
            style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
            labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
            fieldLabel: applicationResources.getProperty('propertiesPanel.label.reportDescription'),
            labelSeparator: "",
            value: this.formatReportDescription(aContentNodeDetailsForm.reportDescription)
         }));

         this.add(new Ext.form.FieldSet({
            title: applicationResources.getProperty('propertiesPanel.title.general'),
            labelWidth: 130,
            columnWidth: 1,
            style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
            items: generalItems
         }));

      }
      else
      {
         this.add(new Ext.form.DisplayField({
            style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;",
            hideLabel: true,
            value: 'No properties for the row selected.'
         }));
      }


   },


   /**
    * This method creates the runtime report detail sections.
    *
    * @param aContentNodeDetailsForm - Content node details.
    */
   createReportDetailsSections: function(aContentNodeDetailsForm)
   {
         // Report Parameters Section.
         this.createParametersSection(aContentNodeDetailsForm);

         var t = new Ext.Container({
            layout: 'form',
            items: [],
            columnWidth: .5
//            ,
//            height: 200
         });
         this.add(t);

         // Report Output Formats and Delivery Section.
         var f1 = this.createOutputFormatsDeliverySection.createDelegate(t);
         f1(aContentNodeDetailsForm);

         // Status panel.
         var f2 = this.createReportStatusSection.createDelegate(t);
         f2(aContentNodeDetailsForm);


         // Report Runtime Filters Section.
         this.createReportRuntimeFilters(aContentNodeDetailsForm);
   },


   /**
    * This method formats the report description. If the description is longer than 80 characters then description is
    * truncated and converted into a link that will display the entire description in a message box.
    *
    * @param aReportDescription - A report description.
    */
   formatReportDescription: function(aReportDescription)
   {
      var MAX_VALUE = 80;
      var formattedReportDescription = '';
      if (!aReportDescription || aReportDescription.length == 0)
      {
         formattedReportDescription = applicationResources.getProperty('propertiesPanel.none');
      }
      else if (aReportDescription.length > MAX_VALUE)
      {
         formattedReportDescription = String.format("{0}...<a href='#' onclick=\"javascript:Ext.MessageBox.alert('{1}','{2}');\">{3}</a>",
                                                aReportDescription.substr(0, MAX_VALUE),
                                                applicationResources.getProperty('propertiesPanel.reportDescription.title'),
                                                aReportDescription,
                                                applicationResources.getProperty('propertiesPanel.reportDescription.more'));
      }
      else
      {
         formattedReportDescription = aReportDescription;
      }

      return formattedReportDescription;
   },


   /**
    * This method creates the report parameters section.
    *
    * @param aContentNodeDetailsForm - Content node details data.
    */
   createParametersSection: function(aContentNodeDetailsForm)
   {
      var parametersItems = [];
      if (aContentNodeDetailsForm.reportExecutionInputs.parameterSet.parameters.length > 0)
      {
         // Create the data.
         var data = [];
         var parameters = aContentNodeDetailsForm.reportExecutionInputs.parameterSet.parameters;
         for (var p = 0; p < parameters.length; p++)
         {
            var displayValues = '';
            var paramValues = parameters[p].values;
            for (var v = 0; v < paramValues.length; v++)
            {
               displayValues = paramValues[v].displayText;
               if (paramValues[v].isFuzzyParameterValue && paramValues[v].auxiliaryValue)
               {
                  displayValues += String.format(' ({0})', paramValues[v].auxiliaryValue);
               }
               data.push({
                  name: parameters[p].name,
                  displayText: displayValues
               });
            }
         }

         var parametersStore = new Ext.data.GroupingStore({
            groupField: "name",
            reader: new Ext.data.JsonReader({fields: ["name", "displayText"]}),
            data: data
         });

         var parametersGrid = new Ext.grid.GridPanel({
            height: 150,
            autoScroll: true,
            store: parametersStore,
            columns: [
               {header: applicationResources.getProperty("propertiesPanel.th.parameterName"), dataIndex: "name", width: 150},
               {header: applicationResources.getProperty("propertiesPanel.th.parameterValues"), width: 300, dataIndex: "displayText"}
            ],
            view: new Ext.grid.GroupingView({
               groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "' + applicationResources.getProperty("propertiesPanel.th.parameterValues") + '" :"' + applicationResources.getProperty("profileWizard.filters.value") + '"]})'
            })
         });

         parametersItems.push(parametersGrid);
      }
      else
      {
         parametersItems.push(new Ext.form.DisplayField({
            style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;",
            hideLabel: true,
            value: applicationResources.getProperty('propertiesPanel.noParameters')
         }));
      }

      this.add(new Ext.form.FieldSet({
         title: applicationResources.getProperty('propertiesPanel.title.parameters'),
         columnWidth: 0.5,
         height: 200,
         style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
         items: parametersItems
      }));
   },

   /**
    * This method creates the Output Formats and Delivery section.
    *
    * @param aContentNodeDetailsForm - Content node details data.
    */
   createOutputFormatsDeliverySection: function(aContentNodeDetailsForm)
   {
      var outputFormatsValues = '';
      for (var i = 0; i < aContentNodeDetailsForm.reportExecutionInputs.outputPreferences.enabledOutputPreferences.length; i++)
      {
         var eachFormatPref = aContentNodeDetailsForm.reportExecutionInputs.outputPreferences.enabledOutputPreferences[i];

         outputFormatsValues += outputFormatsValues.length == 0 ? '' : ', ';
         outputFormatsValues += eachFormatPref.outputFormat.displayValue;
      }
      if (outputFormatsValues.length == 0)
      {
         outputFormatsValues = applicationResources.getProperty('propertiesPanel.default');
      }


      var deliveryPreferencesValue = '';
      for (var j = 0; j < aContentNodeDetailsForm.reportExecutionInputs.deliveryPreferences.activeDeliveryPreferences.length; j++)
      {
         var eachDeliveryPref = aContentNodeDetailsForm.reportExecutionInputs.deliveryPreferences.activeDeliveryPreferences[j];

         var outputReferencesDisplayValue = '';
         for (var k = 0; k < eachDeliveryPref.outputReferences.length; k++)
         {
            outputReferencesDisplayValue += outputReferencesDisplayValue.length == 0 ? '[' : ', ';
            outputReferencesDisplayValue += eachDeliveryPref.outputReferences[k].displayValue;
         }
         if (outputReferencesDisplayValue.length > 0)
         {
            outputReferencesDisplayValue += ']';
         }

         deliveryPreferencesValue += String.format('{0}: {1}<br/>', eachDeliveryPref.deliveryType.name, outputReferencesDisplayValue);
      }
      if (deliveryPreferencesValue.length == 0)
      {
         deliveryPreferencesValue = applicationResources.getProperty('propertiesPanel.none');
      }

      var maxExecutionTimeValue;
      if (aContentNodeDetailsForm.reportExecutionInputs.maxExecutionTime)
      {
         maxExecutionTimeValue = aContentNodeDetailsForm.reportExecutionInputs.maxExecutionTime;
      }
      else
      {
         maxExecutionTimeValue = applicationResources.getProperty('propertiesPanel.default');
      }

      this.add(new Ext.form.FieldSet({
         title: applicationResources.getProperty('propertiesPanel.title.formatAndDelivery'),
         columnWidth: 0.5,
         labelWidth: 130,
//         height: 100,
         style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
         items: [
            new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               labelSeparator: "",
               fieldLabel: applicationResources.getProperty('propertiesPanel.label.outputFormats'),
               value: outputFormatsValues
            }),
            new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               labelSeparator: "",
               fieldLabel: applicationResources.getProperty('propertiesPanel.label.deliveryPreferences'),
               value: deliveryPreferencesValue
            }),
            new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               fieldLabel: applicationResources.getProperty('propertiesPanel.label.maxExecutionTime'),
               labelSeparator: "",
               value: maxExecutionTimeValue
            })
         ]
      }));

   },


   /**
    * This method creates the Report Status section.
    *
    * @param aContentNodeDetailsForm - Content node details data.
    */
   createReportStatusSection: function(aContentNodeDetailsForm)
   {
      var lastModifiedByValue = String.format(applicationResources.getProperty('propertiesPanel.label.lastModifiedTime'),
                                              aContentNodeDetailsForm.contentNode.lastUpdatedBy,
                                              aContentNodeDetailsForm.contentNode.lastUpdatedOn);
      this.add(new Ext.form.FieldSet({
         title: applicationResources.getProperty('propertiesPanel.title.stats'),
         columnWidth: 0.5,
         labelWidth: 130,
//         height: 90,
         style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
         items: [
            new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               fieldLabel: applicationResources.getProperty('propertiesPanel.label.numTimesRun'),
               labelSeparator: "",
               value: aContentNodeDetailsForm.numberOfTimesRun
            }),
            new Ext.form.DisplayField({
               style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
               labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
               fieldLabel: applicationResources.getProperty('propertiesPanel.label.lastModifiedBy'),
               labelSeparator: "",
               value: lastModifiedByValue
            })
         ]
      }));
   },


   /**
    * This method creates the Report Runtime Filters section.
    *
    * @param aContentNodeDetailsForm - Content node details data.
    */
   createReportRuntimeFilters: function(aContentNodeDetailsForm)
   {
      var filterValuesItems = [];
      for (var p = 0; p < aContentNodeDetailsForm.reportExecutionInputs.runtimeFilters.filters.length; p++)
      {
         var eachFilter = aContentNodeDetailsForm.reportExecutionInputs.runtimeFilters.filters[p];
         filterValuesItems.push(new Ext.form.DisplayField({
//            hideLabel: true,
            style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;font-weight:bold",
            labelStyle: "font-family:Verdana,Helvetica,sans-serif;font-size:11px;padding:0px;",
            fieldLabel: String.format('{0} {1}', applicationResources.getProperty('propertiesPanel.label.runtimeFilter'), (p+1)),
            value: eachFilter.expression
//            value: String.format('{0}. {1}', (p+1), eachFilter.expression)
         }));
      }
      if (filterValuesItems.length == 0)
      {
         filterValuesItems.push(new Ext.form.DisplayField({
            style: "font-family:Verdana, Helvetica, sans-serif;font-size:11px;padding:0px;",
            hideLabel: true,
            value: applicationResources.getProperty('propertiesPanel.noRuntimeFilters')
         }));
      }
      this.add(new Ext.form.FieldSet({
         title: applicationResources.getProperty('propertiesPanel.title.runtimeFilters'),
         columnWidth: 1,
         style: {marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "5px"},
         items: filterValuesItems
      }));

   }
});
