/**
 * this is the replacement for the frameset UI controller.  It manages the overall layout
 * of the UI.
 */
Adf.frameSetUi = function()
{
   ////////////////////////////////////////////////////////////////////////////
   // Private
   ////////////////////////////////////////////////////////////////////////////

   ////////////////////////////////////////////////////////////////////////////
   // Public
   ////////////////////////////////////////////////////////////////////////////
   return {
      isAdmin: false,

      eventChannel: {
         subscriptions: {},

         subscribe: function(aSubscriberName, aEventCallback)
         {
            if(!aSubscriberName)
            {
               throw "Subscriber name is required.";
            }

            var id = Ext.id();
            var subscription = {
               id: id,
               subscriberName: aSubscriberName,
               eventCallback: aEventCallback,
               active: true,
               unsubscribe: function()
               {
                  Adf.frameSetUi.eventChannel.unsubscribe(this);
               }
            };

            this.subscriptions[subscription.id] = subscription;

            return subscription;
         },

         unsubscribe: function(aSubscription)
         {
            if(delete this.subscriptions[aSubscription.id])
            {
               aSubscription.active = false;
            }
         },

         publish: function(aEvent)
         {
            if(!aEvent.type)
            {
               throw "Event type is required.";
            }

            for(var id in this.subscriptions)
            {
               this.subscriptions[id].eventCallback(aEvent);
            }
         }
      },

      setAdminFlag: function(aAdminFlag)
      {
         this.isAdmin = aAdminFlag;
      },

      init : function()
      {

         var viewportTabs = [
            {
               title: 'Executable Content',
               id:'contentListTab',
               layout: 'border',
               items: [Adf.folderContentsUi.uiObjects]
            },
            {
               title: 'Report Outputs',
               id:'outputsTab',
               layout: 'border',
               items:[Adf.browseRersUi.uiObjects],
               listeners: Adf.browseRersUi.listeners
            },
            {
               title: 'Schedules',
               id:'schedulesTab',
               layout: "border",
               items:[Adf.scheduleContentsUi.uiObjects],
               listeners: Adf.scheduleContentsUi.listeners
            }
         ];

         if (this.isAdmin)
         {
            viewportTabs.push({
               title: 'Admin',
               id:'adminTab',
               layout: 'border',
               items:[Adf.AdminScreenUi.getUiObjects()],
               // Added the scope this way because defining it in the Adf.AdminScreenUi.listeners did not work.
               // It was picking up the Admin screen as the scoped reference.
               listeners: Ext.apply(Adf.AdminScreenUi.listeners, {scope: Adf.AdminScreenUi})
            });
         }

         this.rclFrameSetViewport = new Ext.Viewport({
            layout: 'border',
            renderTo: Ext.getBody(),
            items: [
               {
                  region: 'north',
                  xtype: 'panel',
                  height:48,
                  listeners: {
                     render: function(aPanel){
                        aPanel.body.getUpdater().showLoadIndicator = false;
                        aPanel.body.getUpdater().update({
                           url: ServerEnvironment.baseUrl + "/secure/actions/ext/topBanner.do",
                           nocache: true
                        });
                     }
                  }
               },
               {
                  region: 'center',
                  xtype: 'tabpanel',
                  activeTab: 0,
                  id: 'centerContentTabPanel',
                  border:true,
                  margins:'0 0 0 0',
                  items: [viewportTabs]
               }
            ]
         });
      },
      /*
       */

      /**
       * get the workspace UI controller
       **/
      getWorkSpaceUiController : function (anIframeElement)
      {
         // TODO: update this to support IE's different syntax too...
         return anIframeElement.dom.contentWindow.workspaceUi;

      },


      /**
       * nav tre item was selected...
       **/
      onNavTreeLinkSelected : function (aTree)
      {
         Ext.dump('onnav');
         //--- clear any other selections in the nav tree
         /* for (var i = 0; i < this.allNavTrees.length; ++i)
          {
          if (aTree != this.allNavTrees[i])
          {
          this.allNavTrees[i].getSelectionModel().clearSelections();
          }
          }*/
      }
   };
}();

//use this to pop an ext modal window outside an iframe
//all controls must be created in parent container for this to work

//window.frameProxy = function(klass, options)
//{
//   var tokens = klass.split('.');
//   var ref = window;
//   for (i=0;i<tokens.length;i++)
//   {
//      ref = ref[tokens[i]];
//   }
//   return new ref(options);
//};
