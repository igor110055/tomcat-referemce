Ext.ns("Adf");
Adf.AdminScreenUtils = function()
{
   return{

      minRowsForDelete: 1,
      maxRowsForDelete: -1,

      init: function(aScope, aContentGrid)
      {
         this.scope = aScope;
         this.contentGrid = aContentGrid;
      },

      setScope: function(aScope)
      {
         this.scope = aScope;
      },

      refreshContentsGrid: function(aParams)
      {
         this.refreshGrid(this.contentGrid, aParams);
      },

      /**
       * refreshes the RER grid
       */
      refreshGrid: function(aGrid, aParams)
      {
         aGrid.getStore().reload({
            params: aParams,
            scope:aGrid,
            callback: function(aRecords, aOptions, aSuccess)
            {
               var selections = this.getSelectionModel().getSelections();

               if(!Ext.isEmpty(selections) && selections.length >= 1)
               {
                  this.getView().focusRow(this.store.indexOf(selections[0]));
               }
            }
         });

      },

      /**
       * utility method to create toolbar button
       */
      createToolbarButton: function  (aButtonId, aButtonIcon, aHandler, aButtonName, anEnableToggle)
      {
         return { id: aButtonId,
            text: aButtonName == null ? "" : aButtonName,
            handler: aHandler,
            scope: this.scope,
            enableToggle:anEnableToggle,
            cls: 'x-btn-text-icon',
            icon:  ServerEnvironment.baseUrl + "/images/silkIcons/" + aButtonIcon
         };
      },

      /**
       * This method creates a toolbar drop down menu button.
       *
       * @param aButtonId - Menu button ID.
       * @param aButtonIcon - Menu button icon.
       * @param aButtonName - Menu button text.
       * @param aMenuItems - Array of Ext.menu.Item.
       *
       * @return Ext.Button - A toolbar drop down menu button.
       */
      createToolbarMenuButton: function(aButtonId, aButtonIcon, aButtonName, aMenuItems)
      {
         return new Ext.Button({
            id: aButtonId,
            text: aButtonName == null ? "" : aButtonName,
            scope: this.scope,
            icon:  aButtonIcon,
            menu: {
               items: aMenuItems
            }

         });
      },

      /**
       * This method creates a toolbar menu item.
       *
       * @param aItemId - Menu item ID.
       * @param aItemIcon - Menu item icon.
       * @param aHandler - A function to handle the menu item's click event.
       * @param aItemName - Menu item text.
       *
       * @return Ext.menu.Item - A toolbar menu item.
       */
      createToolbarMenuItem: function(aItemId, aItemIcon, aHandler, aItemName)
      {
         return new Ext.menu.Item({ id: aItemId,
            text: aItemName == null ? "" : aItemName,
            handler: aHandler,
            scope: this.scope,
            icon:  aItemIcon
         });
      },


      /**
       * the refresh button was clicked
       */
      getNodeIdsForSelectedRows: function (aGrid, aPredicate)
      {
         var selected = aGrid.getSelectionModel().getSelections();


         if (selected.length < this.minRowsForDelete)
         {
            Ext.Msg.alert("Select Rows", applicationResources.getPropertyWithParameters("general.tooFewItemsSelected", [this.minRowsForDelete]));
            return null;
         }
         else if (this.maxRowsForDelete > -1) // && selected.length > aMaxRows)
         {
            Ext.Msg.alert("Select Rows", applicationResources.getPropertyWithParameters("general.tooManyRowsSelected", [this.maxRowsForDelete]));
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
                  nodeIds.push(selected[i].id);
               }
            }
            return nodeIds;
         }

      },

      getNodesForSelectedRows: function (aGrid, aMinRows, aMaxRows, aPredicate)
      {
         var selected = aGrid.getSelectionModel().getSelections();


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

      deleteContentNodes: function (aGrid, aUrl, aItemKey, aExtraParams)
      {
         var nodeIds = this.getNodeIdsForSelectedRows(aGrid, null);

         if (nodeIds == null)
         {
            return;
         }
         var idString = "";
         for (var i = 0; i < nodeIds.length; ++i)
         {
            idString += aItemKey + "=" + nodeIds[i] + "&";
         }

         var url = aUrl + "?" + idString;

         if (aExtraParams)
         {
            url += aExtraParams;
         }
         var successScope = this;

         Ext.MessageBox.confirm(applicationResources.getProperty("general.dialog.confirmTitle"),
               applicationResources.getProperty("general.confirmDeletions"),
               function (aButton)
               {
                  if ('yes' == aButton)
                  {
                     RequestUtil.request({
                        scope: successScope,
                        url: url,
                        //todo POST the array instead of putting it into the URL
                        params: {},
                        success: function (aOptions, aSuccess, aResponse)
                        {
                           //todo - Struts action needs to be updated to return JS for the Ext
                           this.refreshContentsGrid(aGrid);
                        }
                     });
                  }
               });
      }
   };
};
