
/**
 * admin tab landing page
 */
Adf.AdminScreenUi = function()
{
   return {

      getUiObjects : function()
      {
         this.adminPanel = new Ext.Panel({
            region: 'center',
            id: 'adminCenterPanel',
            border:true,
            layout: 'card',
            activeItem: 0,
            items:
            [
               // Added a blank panel so the tree selection is used to display the first admin screen.
               {
                  xtype: 'panel',
                  title: '',
                  id: 'blankpanel'
               },

               // Admin Console Panel. Using the legacy screen displayed in an iframe.
//               {
//                  xtype: 'panel',
//                  title: applicationResources.getProperty('navMenu.manage.adminConsole'),
//                  id: ServerEnvironment.baseUrl + '/secure/actions/admin/console.do',
//                  html: '<iframe frameborder="0" src="'+ ServerEnvironment.baseUrl + '/secure/actions/admin/console.do' + '"></iframe>'
//               },

               // Preprocessor Chain.
               Adf.manageProcessorChainsUi.getAdminGrid('manageProcessorChainsGrid'),

               // Announcements.
               Adf.ManageAnnouncementsUi.getAdminGrid({
                  id: 'manageAnnouncementsGrid'
               }),

               // System jobs.
               Adf.manageSystemJobsUi.getAdminGrid('manageSystemJobsGrid'),

               // Incidents.
               Adf.manageIncidentsUi.getAdminGrid('manageIncidentsGrid'),
//               {
//                  xtype: 'panel',
//                  title: applicationResources.getProperty('navMenu.manage.incidents'),
//                  id: 'manageIncidentsGrid',
//                  html: '<p>Not Implemented Yet.</p>'
//               },

               Adf.manageUsersUi.getAdminGrid('manageUsersGrid'),
               Adf.manageOrganizationsUi.getAdminGrid('manageOrganizationsGrid'),
               Adf.manageDestinationsUi.getAdminGrid('manageDestinationsGrid'),
               Adf.manageDestinationsUi.getEditEmailForm(),
               Adf.manageDestinationsUi.getEditFtpForm(),
               Adf.manageDestinationsUi.getEditFsForm(),
               Adf.manageCustomPromptsUi.getAdminGrid('manageCustomPromptsGrid'),
               Adf.manageCustomPromptsUi.getEditForm(),
               Adf.manageFoldersUi.getAdminGrid('manageFoldersGrid'),
               Adf.manageFoldersUi.getEditForm(),
               Adf.manageFragmentsUi.getAdminGrid('manageFragmentsGrid'),
               Adf.manageFragmentsUi.getEditForm(),
               Adf.manageReportsUi.getAdminGrid('manageReportsGrid'),
               Adf.manageReportsUi.getEditForm(),
               Adf.manageCapabilitiesUi.getAdminGrid('manageCapabilitiesGrid'),
               Adf.manageCapabilitiesUi.getEditForm(),
               Adf.manageUserContentUi.getAdminGrid('manageUserContentGrid')
            ]
         });

         Adf.manageCapabilitiesUi.setAdminPanel(this.adminPanel);
         Adf.manageOrganizationsUi.setAdminPanel(this.adminPanel);
         Adf.manageCustomPromptsUi.setAdminPanel(this.adminPanel);
         Adf.manageDestinationsUi.setAdminPanel(this.adminPanel);
         Adf.manageFoldersUi.setAdminPanel(this.adminPanel);
         Adf.manageFragmentsUi.setAdminPanel(this.adminPanel);
         Adf.manageReportsUi.setAdminPanel(this.adminPanel);
         Adf.manageUserContentUi.setAdminPanel(this.adminPanel);
         Adf.manageProcessorChainsUi.setAdminPanel(this.adminPanel);
         Adf.ManageAnnouncementsUi.setAdminPanel(this.adminPanel);
         Adf.manageProcessorChainsUi.setAdminPanel(this.adminPanel);
         Adf.manageSystemJobsUi.setAdminPanel(this.adminPanel);
         Adf.manageIncidentsUi.setAdminPanel(this.adminPanel);

         this.adminFunctions = [
               //todo ext-ize admin console

            // Note: setting the ID of the Admin Console to a non-zero value so the tree doesn't arbitrarily generate the ID. The ID CANNOT be used
            // as an index into this array - DK
//            { "text": applicationResources.getProperty('navMenu.manage.adminConsole'), "leaf": true, "id": 22, "adfAction": ServerEnvironment.baseUrl + "/secure/actions/admin/console.do", iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.users'), "leaf": true, "id": 1, "adfAction": 'manageUsersGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.userContent'), "leaf": true, "id": 2, "adfAction": 'manageUserContentGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.folders'), "leaf": true, "id": 3, "adfAction": 'manageFoldersGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.reports'), "leaf": true, "id": 4, "adfAction": 'manageReportsGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.reportPrompts'), "leaf": true, "id": 5, "adfAction": 'manageCustomPromptsGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.processorChains'), "leaf": true, "id": 6, "adfAction": 'manageProcessorChainsGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.organizations'), "leaf": true, "id": 7, "adfAction": 'manageOrganizationsGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.fragments'), "leaf": true, "id": 8, "adfAction": 'manageFragmentsGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.announcements'), "leaf": true, "id": 9, "adfAction": 'manageAnnouncementsGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.capabilities'), "leaf": true, "id": 10, "adfAction": 'manageCapabilitiesGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.systemJobs'), "leaf": true, "id": 11, "adfAction": 'manageSystemJobsGrid', iconCls: 'adminTreeNode' },
            { "text": applicationResources.getProperty('navMenu.manage.incidents'), "leaf": true, "id": 12, "adfAction": 'manageIncidentsGrid', iconCls: 'adminTreeNode' }
         ];

         ///---Admin function accoridan
         var adminTree = new Ext.tree.TreePanel({
            title: applicationResources.getProperty('navMenu.manage.administrator'),
            animate:true,
            lines:false,
            enableDD:false,
            containerScroll: true,
            rootVisible: false,
            loader: new Ext.tree.TreeLoader(),
            region: 'west',
            split: true
         });

         adminTree.getSelectionModel().on('selectionchange', function()
         {
            var selected = adminTree.getSelectionModel().getSelectedNode();
            if (selected)
            {
               // Note: when adding a node with ID = 0 like the Admin Console node, the Ext.tree.TreePanel will
               // generate a new ID. So using selected.id as an array index will not work.
               this.adminPanel.layout.setActiveItem(selected.attributes.adfAction);


               // Note: assuming all the admin panels are grid panels and these grid panels have a paging toolbar.
               if (this.adminPanel.layout.activeItem.getStore().getCount() == 0 || this.adminPanel.layout.activeItem.getBottomToolbar().pageSize != UserPreference.itemsPerPage)
               {
                  this.adminPanel.layout.activeItem.getBottomToolbar().pageSize = UserPreference.itemsPerPage;
                  this.adminPanel.layout.activeItem.getBottomToolbar().doRefresh();
               }
            }
         }, this);

         var adminTreeRoot = new Ext.tree.AsyncTreeNode({
            text: applicationResources.getProperty('navMenu.manage.administrator'),
            cls:'menuRoot',
            type:'menuRoot',
            contentType:'menuHeader',
            draggable:false,
            expanded:true,
            id:'-97',
            children: this.adminFunctions
         });

         adminTree.setRootNode(adminTreeRoot);

         // Select the first admin panel in the tree. It is coded in the following way because selecting the
         // first tree node fires a selection event which displays the correct admin screen. In order to display
         // the correct admin screen, the adminPanel must be rendered. And since the adminPanel and the adminTree
         // are siblings and don't have real knowledge about each other, the function scope is set to the adminTree.
         this.adminPanel.on(
               'afterrender',
               function(aAdminPanel){

                  if (this.getRootNode().hasChildNodes())
                  {
                     // Search all the child nodes to find the first one.
                     var firstChildNode = this.getRootNode().findChildBy(function(aNode){
                        return aNode.isFirst();
                     });

                     // Select the first tree node.
                     if (!Ext.isEmpty(firstChildNode))
                     {
                        this.getSelectionModel().select(firstChildNode);
                     }
                  }
               },
               adminTree
         );

         return [
            adminTree, this.adminPanel
         ];
      },

      listeners: {
         activate: function()
         {
            // Note: assuming all the admin panels are grid panels and these grid panels have a paging toolbar.
            if (this.adminPanel.layout.activeItem.getStore().getCount() == 0 || this.adminPanel.layout.activeItem.getBottomToolbar().pageSize != UserPreference.itemsPerPage)
            {
               this.adminPanel.layout.activeItem.getBottomToolbar().pageSize = UserPreference.itemsPerPage;
               this.adminPanel.layout.activeItem.getBottomToolbar().doRefresh();
            }
         }
      }

   };
}();
