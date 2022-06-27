
//----------------------------------------------------------------------------------------------------------------------
/**
 * This class represents the Sort Override Editor Window. It allows a user to override the default report sorting. It
 * allows the user to add and remove columns to sort and modify the sort order and sorting direction.
 */
Adf.ProfileSortOverrideEditor = Ext.extend(Ext.Window, {
   constructor: function(aConfig)
   {
      this.addEvents({
         /**
          * savechanges : (Array aSortOverrides)
          * This event returns an array containing the sort overrides.
          *
          * @param aSortOverrides (Array) The sort columns that were selected by the user.
          *
          * format: {
          *    id: '',
          *    name: '',
          *    direction: 1,
          *    order: 0
          * }
          *
          */
         'savechanges': true,


         /**
          * cancelchanges : ()
          *
          * This event is raised when the Cancel button is pressed.
          */
         'cancelchanges': true
      });


      this.availableColumns = new Ext.grid.GridPanel({
         width: 200,
         store: new Ext.data.JsonStore({
            autoDestroy: true,
            root: 'columns',
            idProperty: 'id',
            fields: ['id', 'name', 'isDimension']
         }),
         colModel:  new Ext.grid.ColumnModel({
            columns: [{
               id: 'columnName',
               header: applicationResources.getProperty('profileWizard.sorts.availableColumns'),
               width: 100,
               sortable: false,
               menuDisabled: true,
               dataIndex: 'name',
               renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                  var displayValue = value;
                  if (record.data.isDimension)
                  {
                     displayValue += String.format(' ({0})', applicationResources.getProperty('profileWizard.grouped'));
                  }
                  return displayValue;
               }
            }]
         }),

         viewConfig: {
            forceFit: true
         }
      });


      this.sortOverridesGrid = new Ext.grid.GridPanel({
//         title: 'Sort Overrides',
         store: new Ext.data.JsonStore({
            autoDestroy: true,
            root: 'sortOverrides',
            idProperty: 'id',
            fields: ['id', 'name', 'direction', 'isDimension']
         }),
         colModel:  new Ext.grid.ColumnModel({
            columns: [{
               id: 'columnSortName',
               header: applicationResources.getProperty('profileWizard.sorts.columns'),
               sortable: false,
               menuDisabled: true,
               width: 200,
               dataIndex: 'name',
               renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                  var displayValue = value;
                  if (record.data.isDimension)
                  {
                     displayValue += String.format(' ({0})', applicationResources.getProperty('profileWizard.grouped'));
                  }
                  return displayValue;
               }
            },{
               id: 'columnSortDirection',
               header: applicationResources.getProperty('profileWizard.sorts.direction.title'),
               width: 200,
               sortable: false,
               menuDisabled: true,
               dataIndex: 'direction',
               renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                  var displayValue = '';
                  if (value == 1)
                  {
                     displayValue += applicationResources.getProperty("profileWizard.ascending");
                  }
                  else
                  {
                     displayValue += applicationResources.getProperty("profileWizard.descending");
                  }
                  return displayValue;
               }

            }]
         }),

         viewConfig: {
            forceFit: true,
            markDirty: false
         },
         sm: new Ext.grid.RowSelectionModel({singleSelect:false})
      });



      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         title: applicationResources.getProperty('profileWizard.sorts.currentSortOverrides'),
         layout: 'border',
         modal: true,
         height: 600,
         width: 870,


         items: [
            {
               xtype: 'panel',
               region: 'center',
               layout: 'border',
               border: false,
               items: [
                  {
                     xtype: 'panel',
                     region: 'west',
                     layout: 'border',
                     border: false,
                     width: 320,
                     items: [{
                        xtype: 'panel',
                        region: 'east',
                        width: 100,
                        layout: 'vbox',
                        frame: true,
                        layoutConfig: {
                           align: 'center',
                           pack: 'center'
                        },
                        items:[{
                           xtype: 'button',
                           width: 80,
                           icon:  ServerEnvironment.baseUrl + "/images/silkIcons/control_fastforward_blue.png",
//                           icon:  ServerEnvironment.baseUrl + "/images/silkIcons/add.png",
                           iconAlign: 'top',
                           text: applicationResources.getProperty('button.add'),
                           handler: this.onAddButtonClicked,
                           scope: this,
                           padding: '10 0 10 0'
                        },{
                           xtype: 'spacer',
                           height: 10,
                           width: 80
                        },{
                           xtype: 'button',
                           width: 80,
                           icon:  ServerEnvironment.baseUrl + "/images/silkIcons/control_rewind_blue.png",
//                           icon:  ServerEnvironment.baseUrl + "/images/silkIcons/cancel.png",
                           iconAlign: 'top',
                           text: applicationResources.getProperty('button.remove'),
                           handler: this.onRemoveButtonClicked,
                           scope: this
                        }]
                     },
                        Ext.apply(this.availableColumns, {width: 200, region: 'center'})
                     ]
                  }, {
                     xtype: 'panel',
                     region: 'center',
                     layout: 'border',
                     border: false,
                     items: [{
                        xtype: 'panel',
//                        border: false,
                        frame: true,
                        layout: 'vbox',
                        layoutConfig: {
                           align: 'center'
                        },
                        region: 'east',
                        width: 120,

                        items: [{
                           xtype: 'buttongroup',
                           title: applicationResources.getProperty('profileWizard.sorts.button.move.title'),
                           columns: 1,
                           padding: '10',
                           items: [{
                              xtype: 'button',
                              width: 80,
                              icon:  ServerEnvironment.baseUrl + "/images/silkIcons/bullet_arrow_top.png",
                              iconAlign: 'top',
                              text: applicationResources.getProperty('profileWizard.sorts.button.moveTop'),
                              handler: this.onMoveTopButtonClicked,
                              scope: this
                           },{
                              xtype: 'spacer',
                              height: 4
//                              xtype: 'tbseparator'
                           },{
                              xtype: 'button',
                              width: 80,
                              icon:  ServerEnvironment.baseUrl + "/images/silkIcons/bullet_arrow_up.png",
                              iconAlign: 'top',
                              text: applicationResources.getProperty('profileWizard.sorts.button.moveUp'),
                              handler: this.onMoveUpButtonClicked,
                              scope: this
                           },{
                              xtype: 'spacer',
                              height: 4
                           },{
                              xtype: 'button',
                              width: 80,
                              icon:  ServerEnvironment.baseUrl + "/images/silkIcons/bullet_arrow_down.png",
                              iconAlign: 'top',
                              text: applicationResources.getProperty('profileWizard.sorts.button.moveDown'),
                              handler: this.onMoveDownButtonClicked,
                              scope: this
                           },{
                              xtype: 'spacer',
                              height: 4
                           },{
                              xtype: 'button',
                              width: 80,
                              icon:  ServerEnvironment.baseUrl + "/images/silkIcons/bullet_arrow_bottom.png",
                              iconAlign: 'top',
                              text: applicationResources.getProperty('profileWizard.sorts.button.moveBottom'),
                              handler: this.onMoveBottomButtonClicked,
                              scope: this
                           }]
                        },{
                           xtype: 'spacer',
                           height: 20
                        }, {
                           xtype: 'buttongroup',
                           title: applicationResources.getProperty('profileWizard.sorts.direction.title'),
                           columns: 1,
                           padding: '10',
                           items: [{
                              xtype: 'button',
                              width: 80,
                              icon:  ServerEnvironment.baseUrl + "/images/hmenu-asc.gif",
                              iconAlign: 'top',
                              text: applicationResources.getProperty('profileWizard.ascending'),
                              handler: this.onSortAscendingButtonClicked,
                              scope: this
                           },{
                              xtype: 'spacer',
                              height: 4
                           },{
                              xtype: 'button',
                              width: 80,
                              icon:  ServerEnvironment.baseUrl + "/images/hmenu-desc.gif",
                              iconAlign: 'top',
                              text: applicationResources.getProperty('profileWizard.descending'),
                              handler: this.onSortDescendingButtonClicked,
                              scope: this
                           }]
                        }]
                     },
                        Ext.apply(this.sortOverridesGrid, {region: 'center'})
                     ]


                  }

               ]
            },
            {
               region: 'south',
               height: 100,

               xtype: 'form',
               bodyStyle: {padding: '10px'},
               html: String.format('<span style="font-weight:bold;">{0}:</span> {1}',
                                   applicationResources.getProperty('profileWizard.sorts.overrideNote.title'),
                                   applicationResources.getProperty('profileWizard.sorts.overrideNote.message'))
            }
         ],
         buttons: [{
            xtype: 'button',
            text: applicationResources.getProperty('button.Ok'),
            handler: this.onOkButtonClicked,
            scope: this
         },{
            xtype: 'button',
            text: applicationResources.getProperty('button.Cancel'),
            handler: this.onCancelButtonClicked,
            scope: this
         }]
      }, aConfig);

      Adf.ProfileSortOverrideEditor.superclass.constructor.call(this, aConfig);

//      Your postprocessing here
      this.sortOverridesGrid.on('viewready', this.onSortOverridesGridViewReady);
   },


   /**
    * This method handles the OK button click event. It will pass the saved values to the calling window and
    * close the Override Sort window.
    *
    * @param aButton (Ext.Button) Save button.
    * @param aEventObject (Ext.EventObject) Button click event.
    */
   onOkButtonClicked: function(aButton, aEventObject)
   {
      // Notify the caller that save button was pressed and pass the info back.
      var changes = [];
      var selectedRecords = this.sortOverridesGrid.getStore().getRange();

      for (var i = 0; i < selectedRecords.length; i++)
      {
         changes.push({
            id: selectedRecords[i].get('id'),
            name: selectedRecords[i].get('name'),
            direction: selectedRecords[i].get('direction'),
            order: i,
            isDimension: selectedRecords[i].get('isDimension')
         });
      }
      this.fireEvent('savechanges', changes);


      // close the window.
      this.close();
   },


   /**
    * This method handles the Cancel button click event. It will close the Override Sort window when the Cancel button
    * is pressed.
    *
    * @param aButton (Ext.Button) Cancel button.
    * @param aEventObject (Ext.ObjectEvent) Button click event.
    */
   onCancelButtonClicked: function(aButton, aEventObject)
   {
      // Notifiy the caller that cancel button was pressed.
      this.fireEvent('cancelchanges');

      // Close the window.
      this.close();
   },


   /**
    * This method populates the current sort overrides into the grid.
    *
    * @param aPageData (Object) An object that contains the currently defined sort overrides and all the report columns
    * defined in the list.
    *
    * pageDataObject: {
    *
    *    columns: [{
    *       name: ''
    *    }],
    *
    *    sortOverrides: [{
    *       columnName: '',
    *       sortDirection: 1  // 1-Ascending | 2-Descending
    *    }]
    * }
    */
   loadPageData: function(aPageData)
   {
      this.pageData = aPageData;

      if (!Ext.isEmpty(this.pageData.containerName))
      {
         this.setTitle(String.format('{0} {1}',
                                     applicationResources.getProperty('profileWizard.sorts.overridesFor'),
                                     this.pageData.containerName));
      }

      var gridData = {
         sortOverrides: []
      };


      // Create a list of available columns.
      var availableColumns = [];
      for (var i = 0; i < this.pageData.columns.length; i++)
      {
         var o = {
            index: -1,
            searchString: this.pageData.columns[i].name,
            fn: function(aItem, aIndex, aAllItems){
               if (aItem.columnName == this.searchString)
               {
                  this.index = aIndex;
                  return false;
               }
            }
         };

         Ext.each(this.pageData.sortOverrides, o.fn, o);
         if (o.index == -1)
         {
            var isDimension = Ext.isEmpty() ? false : true;
            availableColumns.push({
               id: this.pageData.columns[i].name,
               name: this.pageData.columns[i].name,
               isDimension: Ext.isEmpty(this.pageData.columns[i].groupDirective) ? false : true
            });
         }
      }

      this.availableColumns.getStore().loadData({
         columns: availableColumns
      });


      for (var i = 0; i < this.pageData.sortOverrides.length; i++)
      {
         gridData.sortOverrides.push({
            id: this.pageData.sortOverrides[i].columnName,
            name: this.pageData.sortOverrides[i].columnName,
            direction: this.pageData.sortOverrides[i].sortDirection
         });
      }

      if (!Ext.isEmpty(gridData.sortOverrides))
      {
         this.sortOverridesGrid.getStore().loadData(gridData);
      }
   },


   /**
    * This method selects the first row in the Sort Overrides grid when the grid view is ready.
    *
    * @param aSortOverridesGrid (Ext.grid.GridPanel) Sort Overrides grid.
    */
   onSortOverridesGridViewReady: function(aSortOverridesGrid)
   {
      if (aSortOverridesGrid.getStore().getTotalCount() > 1)
      {
         aSortOverridesGrid.getSelectionModel().selectFirstRow();
      }
   },


   /**
    * This method handles the Add button click event. It adds a new sort column to the grid.
    *
    * @param aButton (Ext.Button) Add button.
    * @param aEventObject (Ext.EventObject) Button click event.
    */
   onAddButtonClicked: function(aButton, aEventObject)
   {

      if (this.availableColumns.getSelectionModel().hasSelection())
      {
         var selectedColumnRecords = this.availableColumns.getSelectionModel().getSelections();

         if (!Ext.isEmpty(selectedColumnRecords))
         {
            var data = {
               sortOverrides: [],
               fn: function(aItem, aIndex, aAllItems)
               {
                  data.sortOverrides.push({
                     id: aItem.data.id,
                     name: aItem.data.name,
                     direction: 1, // Default: Ascending
                     isDimension: aItem.data.isDimension
                  });
               }
            };
            Ext.each(selectedColumnRecords, data.fn, data);

            this.availableColumns.getStore().remove(selectedColumnRecords);

            // Append the selected columns to the sort overrides.
            this.sortOverridesGrid.getStore().loadData(data, true);

            if (selectedColumnRecords.length > 0)
            {
               this.sortOverridesGrid.getSelectionModel().selectLastRow();
            }
         }
      }
   },


   /**
    * This method handles the selected columns event. It adds the columns that were selected from the Column Picker
    * pop up. The selected columns are returned as an array of column objects.
    *
    * columnObject: {
    *    id: '',              // (String) Column id. Can use column if an ID does not exist.
    *    name: '',            // (String) Column name.
    *    isDimension: false   // (Boolean) Indicates if this is a grouped column.
    * }
    *
    * @param aColumns (Array) An array of selected column objects.
    */
   onSelectedColumns: function(aColumns)
   {
      var data = {
         sortOverrides: []
      };

      for (var i = 0; i < aColumns.length; i++)
      {
         data.sortOverrides.push({
            id: aColumns[i].id,
            name: aColumns[i].name,
            direction: 1, // Default: Ascending
            isDimension: aColumns[i].isDimension
         });
      }

      // Append the selected columns to the sort overrides.
      this.sortOverridesGrid.getStore().loadData(data, true);

      if (aColumns.length > 0)
      {
         this.sortOverridesGrid.getSelectionModel().selectLastRow();
      }
   },


   /**
    * This method handles the Remove button click event. It removes the selected sort override from the grid.
    *
    * @param aButton (Ext.Button) Remove Sort Override button.
    * @param aEventObject (Ext.EventObject) click event.
    */
   onRemoveButtonClicked: function(aButton, aEventObject)
   {
      if (this.sortOverridesGrid.getSelectionModel().hasSelection())
      {
         var selectedRows = this.sortOverridesGrid.getSelectionModel().getSelections();


         // Create a list of available columns.
         var availableColumns = [];
         for (var j = 0; j < selectedRows.length; j++)
         {
            availableColumns.push({
               id: selectedRows[j].data.id,
               name: selectedRows[j].data.name,
               isDimension: Ext.isEmpty(selectedRows[j].data.groupDirective) ? false : true
            });
         }


         var indexes = {
            all: [],
            sortOverridesGrid: this.sortOverridesGrid,
            fn: function(aItem, aIndex, aAllItems){
               this.all.push(this.sortOverridesGrid.getStore().indexOf(aItem));
            }
         };
         Ext.each(selectedRows, indexes.fn, indexes);
         var index = Ext.min(indexes.all);

         this.availableColumns.getStore().loadData({
            columns: availableColumns
         }, true);

         this.sortOverridesGrid.getStore().remove(selectedRows);
         if (index < this.sortOverridesGrid.getStore().getCount())
         {
            this.sortOverridesGrid.getSelectionModel().selectRow(index);
         }
         else
         {
            this.sortOverridesGrid.getSelectionModel().selectLastRow();
         }
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },


   /**
    * This method handles the Move To Top button click event. It moves the selected sort override to the top of the
    * grid.
    *
    * @param aButton (Ext.Button) Move To Top button.
    * @param aEventObject (Ext.EventObject) Button click event.
    */
   onMoveTopButtonClicked: function(aButton, aEventObject)
   {
      // Validate a sort override is selected.
      if (this.sortOverridesGrid.getSelectionModel().hasSelection())
      {
         // Validate that there are previous records.
         if (this.sortOverridesGrid.getSelectionModel().hasPrevious())
         {
            // Remove the selected sort override and insert it at the beginning of the grid.
            // Note: using getSelections() instead of getSelected() because it returns an array which will make it
            // easier to call insert().
            var selectedSortOverrides = this.sortOverridesGrid.getSelectionModel().getSelections();
            this.sortOverridesGrid.getStore().remove(selectedSortOverrides);
            this.sortOverridesGrid.getStore().insert(0, selectedSortOverrides);
            this.sortOverridesGrid.getSelectionModel().selectRecords(selectedSortOverrides);
         }
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },


   /**
    * This method handles the Move Up button click event. It will move the selected sort override up one row.
    *
    * @param aButton (Ext.Button) Move Up button.
    * @param aEventObject (Ext.EventObject) Button click event.
    */
   onMoveUpButtonClicked: function(aButton, aEventObject)
   {
      // Validate a sort override is selected.
      if (this.sortOverridesGrid.getSelectionModel().hasSelection())
      {
         // Validate that there are previous records.
         if (this.sortOverridesGrid.getSelectionModel().hasPrevious())
         {
            // Remove the selected sort override and insert it above the previous row.
            // Note: using getSelections() instead of getSelected() because it returns an array which will make it
            // easier to call insert().
            var selectedSortOverrides = this.sortOverridesGrid.getSelectionModel().getSelections();
            var index = this.sortOverridesGrid.getStore().indexOf(selectedSortOverrides[0]);
            this.sortOverridesGrid.getStore().remove(selectedSortOverrides);
            this.sortOverridesGrid.getStore().insert(index-1, selectedSortOverrides);
            this.sortOverridesGrid.getSelectionModel().selectRecords(selectedSortOverrides);
         }
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },


   /**
    * This method handles the Move Down button click event. It moves the selected sort override down one row.
    *
    * @param aButton (Ext.Button) Move Down button.
    * @param aEventObject (Ext.EventObject) Button click event.
    */
   onMoveDownButtonClicked: function(aButton, aEventObject)
   {
      // Validate a sort override is selected.
      if (this.sortOverridesGrid.getSelectionModel().hasSelection())
      {
         // Validate that there are records below the selected row.
         if (this.sortOverridesGrid.getSelectionModel().hasNext())
         {
            // Remove the selected sort override and insert it below the next row.
            // Note: using getSelections() instead of getSelected() because it returns an array which will make it
            // easier to call insert().
            var selectedSortOverrides = this.sortOverridesGrid.getSelectionModel().getSelections();
            var index = this.sortOverridesGrid.getStore().indexOf(selectedSortOverrides[0]);
            this.sortOverridesGrid.getStore().remove(selectedSortOverrides);
            this.sortOverridesGrid.getStore().insert(index+1, selectedSortOverrides);
            this.sortOverridesGrid.getSelectionModel().selectRecords(selectedSortOverrides);
         }
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },


   /**
    * This method handles the Move To Bottom click event. It moves the selected sort override to the bottom of the
    * grid when the button is pressed.
    *
    * @param aButton (Ext.Button) Move To Bottom button.
    * @param aEventObject (Ext.EventObject) Button click event.
    */
   onMoveBottomButtonClicked: function(aButton, aEventObject)
   {
      // Validate a sort override is selected.
      if (this.sortOverridesGrid.getSelectionModel().hasSelection())
      {
         // Validate that there are records below the selected row.
         if (this.sortOverridesGrid.getSelectionModel().hasNext())
         {
            // Remove the selected sort override and insert it at the bottom of the grid.
            // Note: using getSelections() instead of getSelected() because it returns an array which will make it
            // easier to call insert().
            var selectedSortOverrides = this.sortOverridesGrid.getSelectionModel().getSelections();
//            var index = this.sortOverridesGrid.getStore().indexOf(selectedSortOverrides[0]);
            this.sortOverridesGrid.getStore().remove(selectedSortOverrides);
            this.sortOverridesGrid.getStore().add(selectedSortOverrides);
            this.sortOverridesGrid.getSelectionModel().selectRecords(selectedSortOverrides);
         }
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },


   /**
    * This method handles the Sort Ascending button click event. It sets the sort direction of the selected sort
    * override to Ascending when the Sort Ascending button is pressed.
    *
    * @param aButton (Ext.Button) Sort Ascending button.
    * @param aEventObject (Ext.EventObject) Button click event.
    */
   onSortAscendingButtonClicked: function(aButton, aEventObject)
   {
      // Validate a sort override is selected.
      if (this.sortOverridesGrid.getSelectionModel().hasSelection())
      {
         var selectedSortOverrides = this.sortOverridesGrid.getSelectionModel().getSelections();
         for (var i = 0; i < selectedSortOverrides.length; i++)
         {
            selectedSortOverrides[i].set('direction', 1);
         }
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },


   /**
    * This method handles the Sort Descending button click event. It sets the sort direction of the selection sort
    * override to Descending when the Sort Descending button is pressed.
    *
    * @param aButton (Ext.Button) Sort Descending button.
    * @param aEventObject (Ext.EventObject) Button click event.
    */
   onSortDescendingButtonClicked: function(aButton, aEventObject)
   {
      // Validate a sort override is selected.
      if (this.sortOverridesGrid.getSelectionModel().hasSelection())
      {
         var selectedSortOverrides = this.sortOverridesGrid.getSelectionModel().getSelections();
         for (var i = 0; i < selectedSortOverrides.length; i++)
         {
            selectedSortOverrides[i].set('direction', 2);
         }
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },

   yourMethod: function()
   {
      // etc.

   }
});




//----------------------------------------------------------------------------------------------------------------------
/**
 * This class represents the Sort Modifications tab in the Profile Editor. It will display the default sorting and it
 * will allow users to override the default sorting settings.
 */
Adf.ProfileSortPanel = Ext.extend(Ext.Panel, {
   constructor: function(aConfig)
   {

      this.addEvents({
         'sortoverrideadded': true,
         'sortoverrideremoved': true,
         'sortoverrideupdated': true
      });

      this.defaultSortsGrid = new Ext.grid.GridPanel({
//         title: 'Sort Overrides',
         tbar: [{
            text: applicationResources.getProperty('profileWizard.button.sorts.editOverride'),
            id: 'editSortOverride',
            icon:  ServerEnvironment.baseUrl + "/images/silkIcons/report_edit.png",
            handler: this.onEditButtonClicked,
            scope: this
         }, '-', {
            text: applicationResources.getProperty('profileWizard.button.sorts.removeOverride'),
            icon:  ServerEnvironment.baseUrl + "/images/silkIcons/report_delete.png",
            id: 'removeSortOverride',
            handler: this.onRemoveButtonClicked,
            scope: this
         }, '-'],

         store: new Ext.data.JsonStore({
            autoDestroy: true,
            root: 'containers',
            idProperty: 'id',
            fields: ['id', 'name', 'columns', 'sortOverrides']
         }),

         colModel:  new Ext.grid.ColumnModel({
            columns: [{
               id: 'containerName',
               header: applicationResources.getProperty('profileWizard.sorts.containers'),
               sortable: false,
               menuDisabled: true,
               width: 200,
               dataIndex: 'name'
            },{
               id: 'columns',
               header: applicationResources.getProperty('profileWizard.sorts.columns'),
               width: 200,
               sortable: false,
               menuDisabled: true,
               dataIndex: 'name',
               renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                  var displayValue = '';

                  for (var i = 0; i < record.json.columns.length; i++)
                  {
                     displayValue += record.json.columns[i].name;
                     if (!Ext.isEmpty(record.json.columns[i].groupDirective))
                     {
                        displayValue += String.format(' ({0})', applicationResources.getProperty('profileWizard.grouped'));
                     }
                     if (i < (record.json.columns.length-1))
                     {
                        displayValue += '<br/>';
                     }
                  }
                  return displayValue;
               }
            },{
               id: 'defaultSortOrder',
               header: applicationResources.getProperty('profileWizard.sorts.defaultSortOrder'),
               width: 200,
               sortable: false,
               menuDisabled: true,
               dataIndex: 'name',
               renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                  var displayValue = '';

                  for (var i = 0; i < record.json.columns.length; i++)
                  {
                     if (!Ext.isEmpty(record.json.columns[i].sortDirective))
                     {
                        displayValue += record.json.columns[i].name;

                        if(SortEnum.SORT_ASCENDING.value === record.json.columns[i].sortDirective.direction)
                        {
                           displayValue += "(" + SortEnum.SORT_ASCENDING.crnValue + ")";
                        }
                        if(SortEnum.SORT_DESCENDING.value === record.json.columns[i].sortDirective.direction)
                        {
                           displayValue += "(" + SortEnum.SORT_DESCENDING.crnValue + ")";
                        }
                        if (!Ext.isEmpty(record.json.columns[i].groupDirective))
                        {
                           displayValue += String.format(' ({0})', applicationResources.getProperty('profileWizard.grouped'));
                        }

                        if (i < (record.json.columns.length-1))
                        {
                           displayValue += '<br/>';
                        }
                     }
                  }
                  return displayValue;
               }
            },{
               id: 'sortOverrides',
               header: applicationResources.getProperty('profileWizard.sorts.currentSortOverrides'),
               width: 200,
               sortable: false,
               menuDisabled: true,
               dataIndex: 'sortOverrides',
               renderer: function(value, metaData, record, rowIndex, colIndex, store) {

                  // This method will render the sort overridden columns in a list. The <br/> element is appended
                  // to end of each row except the last row. This will force each sort overridden column to appear
                  // on a row by itself.
                  //
                  // For example:
                  // Column 1 (grouped, ascending)<br/>
                  // Column 2 (descending)<br/>
                  // Column 3 (ascending)

                  var displayValue = '';
                  for (var i = 0; i < value.length; i++)
                  {
                     displayValue += value[i].columnName;
                     displayValue += ' (';
                     if (value[i].isDimension)
                     {
                        displayValue += applicationResources.getProperty("profileWizard.grouped")+", ";
                     }

                     if (value[i].sortDirection == 1)
                     {
                        displayValue += applicationResources.getProperty("profileWizard.ascending");
                     }
                     else
                     {
                        displayValue += applicationResources.getProperty("profileWizard.descending");
                     }

                     displayValue += ')';

                     if (i < (value.length-1))
                     {
                        displayValue += '<br/>';
                     }
                  }
                  return displayValue;
               }
            }]
         }),

         columnLines: true,
         stripeRows: true,
         viewConfig: {
            forceFit: true,
            markDirty: false
         },
         sm: new Ext.grid.RowSelectionModel({singleSelect:true})

      });


      // Create a new config object containing our computed properties
      // *plus* whatever was in the config parameter.
      aConfig = Ext.apply({
         title: applicationResources.getProperty('profileWizard.wizardBar.sortModifications'),
         layout: 'fit',
         id: 'sortOverridePanel',
         items: [this.defaultSortsGrid]
      }, aConfig);

      Adf.ProfileSortPanel.superclass.constructor.call(this, aConfig);

//      Your postprocessing here
      this.defaultSortsGrid.on('viewready', this.onDefaultSortsGridViewReady);

   },


   /**
    * This method handles the Edit Override Sort button click event. It will display the Sort Editor window when
    * the Edit Override Sort button is pressed.
    *
    * @param aButton (Ext.Button) Edit Sort Override button.
    * @param aEventObject (Ext.EventObject) Click button event.
    */
   onEditButtonClicked: function(aButton, aEventObject)
   {
      if (this.defaultSortsGrid.getSelectionModel().hasSelection())
      {
         var selectedRecord = this.defaultSortsGrid.getSelectionModel().getSelected();
         var pageData = {
            containerName: selectedRecord.data.name,
            columns: selectedRecord.get('columns'),
            sortOverrides: selectedRecord.get('sortOverrides')
         };
//         var container = selectedRecord.json;
         var editDialog = new Adf.ProfileSortOverrideEditor({});
         editDialog.loadPageData(pageData);
         editDialog.on('savechanges', this.onSaveChanges, this);
         editDialog.on('cancelchanges', this.onCancelChanges, this);
         editDialog.show();
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },


   /**
    * This method handles the Save Changes event from the Sort Override Editor. It loads the sort overrides for the
    * report container selected.
    *
    * @param aChanges (Array) Sort overrides.
    */
   onSaveChanges: function(aChanges)
   {
      // Determine if this is a new sort override or an update to an existing sort override.
      var selectedRecord = this.defaultSortsGrid.getSelectionModel().getSelected();
      var eventName = 'sortoverrideadded';
      if (selectedRecord.data.sortOverrides.length > 0)
      {
         eventName = 'sortoverrideupdated';
      }

      // Update the sort overrides grid when the changes from the Sort Editor.
      var columnOverrides = [];
      for (var i = 0; i < aChanges.length; i++)
      {
         columnOverrides.push({
            columnName: aChanges[i].name,
            isDimension: aChanges[i].isDimension,
            sortDirection: aChanges[i].direction,
            sortOrder: aChanges[i].order
         });
      }
      selectedRecord.set('sortOverrides', columnOverrides);


      // Fire an event to notify any components that are monitoring changes to the sort grid.
      this.fireEvent(eventName, {
         id: selectedRecord.data.id,
         name: selectedRecord.data.name,
         sortOverrides: selectedRecord.data.sortOverrides
      });

   },


   /**
    * This method handles Cancel Changes event from the Sort Overrides Editor.
    */
   onCancelChanges: function()
   {
   },


   /**
    * This method handles the Remove Sort Override button click event. It will remove the sort overrides when the
    * Remove Sort Override button is pressed.
    *
    * @param aButton (Ext.Button) Remove Sort Override button.
    * @param aEventObject (Ext.EventObject) Click button event.
    */
   onRemoveButtonClicked: function(aButton, aEventObject)
   {
      if (this.defaultSortsGrid.getSelectionModel().hasSelection())
      {
         // Remove the sort overrides from the sort grid for selected report container.
         var selectedRecord = this.defaultSortsGrid.getSelectionModel().getSelected();
         selectedRecord.set('sortOverrides', []);

         // Fire an event to notify any components that are monitoring changes to the sort grid.
         this.fireEvent('sortoverrideremoved', {
            id: selectedRecord.data.id,
            name: selectedRecord.data.name,
            sortOverrides: selectedRecord.data.sortOverrides
         });
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty("profileWizard.message.warning"), applicationResources.getProperty("profileWizard.sorts.select.warning"));
      }
   },


   /**
    * This method loads the sorts overrides grid.
    *
    * pageData : {
    *    containers:[{
    *       name:
    *       id:
    *       columns:[{
    *          name:
    *          groupDirective:
    *          sortDirective:
    *       }],
    *       defaultSorts:[],
    *       sortOverrides:[]
    *    }]
    * }
    *
    * @param aPageData (Object) Data used by the panel.
    */
   loadPageData: function(aPageData)
   {
      this.pageData = aPageData;
      this.defaultSortsGrid.getStore().loadData(aPageData, true);
   },


   /**
    * This method selects the first row in the sort overrides grid when it is displayed.
    *
    * @param aDefaultSortsGrid (Ext.grid.GridPanel) Sort overrides grid.
    */
   onDefaultSortsGridViewReady: function(aDefaultSortsGrid)
   {
      if (aDefaultSortsGrid.getStore().getTotalCount() > 0)
      {
         aDefaultSortsGrid.getSelectionModel().selectFirstRow();
      }
   }
});
