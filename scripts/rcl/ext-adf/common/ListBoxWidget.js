/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

Ext.QuickTips.init();


Adf = Ext.ns('Adf');
Adf.widgets = Ext.ns('Adf.widgets');


//======================================================================================================================
//======================================================================================================================
/**
 * SimpleFieldExtractor
 * @constructor
 */
function SimpleFieldExtractor(aValueProperty, aTextProperty)
{
   this.valueProperty = aValueProperty;
   this.textProperty = aTextProperty;
}


SimpleFieldExtractor.prototype.extractListBoxItem = function (anObject)
{
   return new ListBoxItem(anObject[this.valueProperty], anObject[this.textProperty]);
};


//======================================================================================================================
//======================================================================================================================
/**
 * NoOpFieldExtractor
 * @constructor
 */
function NoOpFieldExtractor()
{
}


NoOpFieldExtractor.prototype.extractListBoxItem = function (anObject)
{
   return new ListBoxItem(anObject, anObject);
};




//======================================================================================================================
//======================================================================================================================
/**
 * ExtraPropertyFieldExtractor allows you to add a single, extra property
 * to every list box item (useful for adding an extra property for use in
 * custom sorting functions)
 * @constructor
 */
function ExtraPropertyFieldExtractor(aValueProperty, aTextProperty, aExtraProperty)
{
   this.valueProperty = aValueProperty;
   this.textProperty = aTextProperty;
   this.extraProperty = aExtraProperty;
}

/**
 * Creates a ListBoxItem with the extra property value set from the function parameter
 * @returns a ListBoxItem with the properties from the parameter
 */
ExtraPropertyFieldExtractor.prototype.extractListBoxItem = function (anObject)
{
   var newItem = new ListBoxItem(anObject[this.valueProperty], anObject[this.textProperty]);
   newItem[this.extraProperty] = anObject[this.extraProperty];
   return newItem;
};


//======================================================================================================================
//======================================================================================================================
/**
 * DefaultFilter : you can provide your own if you don't like the default behavior
 * @constructor
 * @param aFilterValue the filter value
 * @param aListBox the ListBox to which to apply this filter
 */
function DefaultFilter(aFilterValue, aListBox)
{
   this.filterValue = aFilterValue.toLowerCase();
   this.listBox = aListBox;
}

/**
 * sets the filter value
 * @param aValue the filter value
 */
DefaultFilter.prototype = {
   setFilterValue: function(aValue)
   {
      this.filterValue = aValue.toLowerCase();
      this.listBox.filterHasChanged();
   },

   /**
    * @return a boolean specifying whether or not this ListBoxItem should be displayed
    */
   shouldDisplay: function(aListBoxItem)
   {
      if ("" == this.filterValue)
      {
         return true;
      }

      return aListBoxItem.text.toLowerCase().indexOf(this.filterValue) != -1;
   }
};


//======================================================================================================================
//======================================================================================================================
/**
 * DefaultRemoveListener : you can provide your own if you don't like the default behavior
 * @constructor
 */
function DefaultRemoveListener()
{
}

DefaultRemoveListener.prototype = {
   /**
    * @return a boolean specifying whether to allow removal
    */
   allowRemove: function (aListBoxItem)
   {
      return true;
   }
};

/**
 * static property containing the singleton instance
 */
DefaultRemoveListener.instance = new DefaultRemoveListener();



//======================================================================================================================
//======================================================================================================================
/**
 * ListBoxItem
 * @param aValue the ListBoxItem's value
 * @param aText the ListBoxItem's text
 * @constructor
 */
function ListBoxItem(aValue,aText)
{
   this.value = aValue;
   this.text  = aText;
   this.srcObject = null;   // set just after extraction..

   this.originalListBox = null;
}

ListBoxItem.prototype.toString = function()
{
   return "(" + this.value + ") (" + this.text + ")";
};


//======================================================================================================================
//======================================================================================================================
/**
 *
 * @type {*}
 */
Adf.widgets.ListBoxView = Ext.extend(Ext.DataView, {
//   constructor: function(aConfig){
//      aConfig = Ext.apply({
//
//      }, aConfig);
//
//      Adf.widgets.ListBoxView.superclass.initComponent.call(this);
//   },
//
//   initComponent: function()
//   {
//
//      Adf.widgets.ListBoxView.superclass.initComponent.call(this);
//   },

   lastActive: false,

   afterRender: function()
   {
      Adf.widgets.ListBoxView.superclass.afterRender.call(this);
      this.rowNav = new Ext.KeyNav(this.getEl(), {
         up: this.onKeyPress,
         down: this.onKeyPress,
         scope: this
      });
      this.el.unselectable();
   },


   onKeyPress: function(aEventObject, aKeyName)
   {
      var up = aKeyName == 'up',
         method = up ? 'selectPrevious' : 'selectNext',
         add = up ? -1 : 1,
         last;
      if (!aEventObject.shiftKey || this.singleSelect)
      {
         this[method](false);
      }
      else if (this.last !== false && this.lastActive !== false)
      {
         last = this.last;
         this.selectRange(this.last, this.lastActive + add);
         //todo: this.grid.getView().focusRow(this.lastActive);
         if (last !== false)
         {
            this.last = last;
         }
      }
      else
      {
         this.selectFirstRow();
      }
   },



   selectFirstRow : function(){
      this.select(0);
   },



   selectPrevious : function(keepExisting){
      if (this.hasPrevious())
      {
         this.select(this.last - 1, keepExisting, false);
         // todo: this.grid.getView().focusRow(this.last);
         return true;
      }
      return false;
   },


   hasPrevious : function(){
      return !!this.last;
   },


   selectNext : function(keepExisting){
      if (this.hasNext())
      {
         this.select(this.last + 1, keepExisting, false);
         // todo: this.grid.getView().focusRow(this.last);
         return true;
      }
      return false;
   },



   hasNext : function(){
      return this.last !== false && (this.last+1) < this.store.getCount();
   },



   select : function(nodeInfo, keepExisting, suppressEvent){
      if (Ext.isArray(nodeInfo))
      {
         if (!keepExisting)
         {
            this.clearSelections(true);
         }
         for (var i = 0, len = nodeInfo.length; i < len; i++)
         {
            this.select(nodeInfo[i], true, true);
         }
         if (!suppressEvent)
         {
            this.fireEvent("selectionchange", this, this.selected.elements);
         }
      }
      else
      {
         var node = this.getNode(nodeInfo);
         if (!keepExisting)
         {
            this.clearSelections(true);
         }
         if (node && !this.isSelected(node))
         {
            if (this.fireEvent("beforeselect", this, node, this.selected.elements) !== false)
            {
               Ext.fly(node).addClass(this.selectedClass);
               this.selected.add(node);
               this.last = this.lastActive = node.viewIndex;
               if (!suppressEvent)
               {
                  this.fireEvent("selectionchange", this, this.selected.elements);
               }
            }
         }
      }
   },



   deselect : function(node){
      if (this.isSelected(node))
      {
         node = this.getNode(node);
         this.selected.removeElement(node);
         if (this.last == node.viewIndex)
         {
            this.last = false;
         }
         if (this.lastActive == node.viewIndex)
         {
            this.lastActive = false;
         }
         Ext.fly(node).removeClass(this.selectedClass);
         this.fireEvent("selectionchange", this, this.selected.elements);
      }
   },





   selectAll : function(){
// todo
//      if(this.isLocked()){
//         return;
//      }
      this.clearSelections(true);
      for(var i = 0, len = this.store.getCount(); i < len; i++){
         this.select(i, true, true);
      }
      this.fireEvent("selectionchange", this, this.selected.elements);
   },

   onAdd : function(ds, records, index)
   {
      Adf.widgets.ListBoxView.superclass.onAdd.call(this, ds, records, index);
   }


//   ,
//
//
//   onDataChanged: function(){
//      if (this.filter)
//      {
//         this.store.suspendEvents();
//         this.store.filterBy(this.filter.extFilterFunction, this.filter);
//         this.store.resumeEvents();
//      }
//
//      Adf.widgets.ListBoxView.superclass.onDataChanged.call(this, arguments);
//   }

});


//======================================================================================================================
//======================================================================================================================
/**
 * This class is the Filter panel that appears on the ADF List Box widget. It allows users to enter text to filter
 * the list box and also allows users to remove the filter.
 *
 * @type {Adf.widgets.ListBoxFilterPanel}
 */
Adf.widgets.ListBoxFilterPanel = Ext.extend(Ext.Panel, {


   /**
    * Constructor.
    *
    * @param aConfig A configuration for this panel.
    */
   constructor: function(aConfig)
   {
      this.addEvents({
         "filterChanged": true
      });


      this.applyButton = new Ext.Button({
         icon:  ServerEnvironment.baseUrl + "/images/silkIcons/tick.png",
         scope: this,
         handler: function(aButton, aEventObject)
         {
            this.fireEvent("filterChanged", this, this.getFilterValue());
         }
      });

      this.clearButton = new Ext.Button({
         icon:  ServerEnvironment.baseUrl + "/images/silkIcons/cross.png",
         scope: this,
         handler: function(aButton, aEventObject)
         {
            this.setFilterValue("");
            this.fireEvent("filterChanged", this, this.getFilterValue());
         }
      });


      this.filterField = new Ext.form.Field({
         columnWidth: 1
      });

      aConfig = Ext.apply({
         title: 'Filter By',
         region: 'north',
         height: 50,
         layout: 'column',
         border: false,
         hidden: true,
         items: [
            this.filterField,
            this.applyButton,
            this.clearButton
         ]
      }, aConfig);


      Adf.widgets.ListBoxFilterPanel.superclass.constructor.call(this, aConfig);
   },


   /**
    * This property sets the filter value in the Filter text field,
    *
    * @param aValue (String) Filter text value.
    */
   setFilterValue: function(aValue)
   {
      this.filterField.setValue(aValue);
   },


   /**
    * This property returns the current value from the filter field.
    *
    * @returns (String) The current filter value.
    */
   getFilterValue: function()
   {
      return this.filterField.getValue();
   }
});





//======================================================================================================================
//======================================================================================================================

Adf.widgets.ListBoxWidget = Ext.extend(Ext.Panel, {
   constructor: function(aConfig)
   {

      this.addEvents({
         "selectionChange" : true,
         "selectAll" : true,
         "clearAll" : true,
         "sortAscending": true,
         "sortDescending": true,
         "moveUp": true,
         "moveDown": true,
         "moveTop": true,
         "moveBottom": true,
         "filterBy": true
      });


      if (Ext.isEmpty(aConfig.store))
      {
         this.store = new Ext.data.JsonStore({
            autoDestroy: true,
            root: 'listBoxItems',
            idProperty: 'value',
            fields: ['value', 'text']
         });
      }
      else
      {
         this.store = aConfig.store;
      }

      this.divStyle = "border-color: #fff;";

      // border-color: #fff; - removes border that is added by x-grid3-row.
      // class="x-unselectable" unselectable="on" - prevents text from being highlighted inside a div or element.
      var tpl = new Ext.XTemplate(
         '<tpl for=".">',
         '<div class="dk-row x-grid3-row x-grid3-col x-grid3-cell x-grid3-cell-inner" id="{text}" style="{[this.getDivStyle()]}">',
         '<tpl if="!text">&nbsp;</tpl>',
         '<tpl if="text">{text}</tpl>',
         '</div>',
         '</tpl>',
         '<div class="x-clear"></div>',
         {
            testStyle: this.divStyle,
            getDivStyle: function()
            {
               return this.testStyle;
            }
         }
      );



      this.view = new Adf.widgets.ListBoxView({
         region: 'center',
         store: this.store,
         tpl: tpl,
         height: 100,
         multiSelect: Ext.value(aConfig.multiSelect, true),
         singleSelect: Ext.value(aConfig.singleSelect, false),
         cls: 'x-grid3-scroller x-grid3-body',
         selectedClass: 'x-grid3-row-selected',
         overClass:'x-grid3-row-over',
         itemSelector:'div.dk-row'
      });
      this.view.on('selectionchange', this.onViewSelectionChange, this);


      this.filterPanel = new Adf.widgets.ListBoxFilterPanel({
         listeners: {
            scope: this,
            filterChanged: this.onFilterValueChanged
         }
      });



      // Validate the filter object is not null. If the filter has not been passed in or defaulted by a derived class
      // then set the filter to a default.
      if (!Ext.isEmpty(aConfig.filter))
      {
         this.filter = aConfig.filter;
      }

      if (Ext.isEmpty(this.filter))
      {
         this.filter = {
            filterValue: "",
            listBox: this,
            store: this.store,
            setFilterValue: function(aValue)
            {
               this.filterValue = aValue.toLowerCase();
               this.listBox.filterHasChanged();
            },

            extShouldDisplay: function(aRecord, aRecordId){
               if ("" == this.filterValue)
               {
                  return true;
               }

               return aRecord.json.text.toLowerCase().indexOf(this.filterValue) != -1;
            }
         };

      }



      if (Ext.isBoolean(aConfig.enableButtons) && aConfig.enableButtons)
      {
         aConfig.buttons = !Ext.isEmpty(aConfig.buttons) ? aConfig.buttons : [{
            text: applicationResources.getProperty('prompt.button.selectAll'),
            scope: this,
            handler: this.onSelectAllButtonClicked
         }, {
            text: applicationResources.getProperty('prompt.button.reset'),
            scope: this,
            handler: this.onResetButtonClicked
         }];
      }

      if (Ext.isBoolean(aConfig.enableToolbar) && aConfig.enableToolbar)
      {
         this.sortAscendingButton = new Ext.Button({
            icon:  ServerEnvironment.baseUrl + "/images/hmenu-asc.gif",
            tooltip: 'Sort Ascending',
            enableToggle: true,
            toggleGroup: 'sortingGroup',
            toggleHandler: function(aButton, aState) {
               this.sort('ASC');
               this.filterHasChanged();
            },
            scope: this
         });

         this.sortDescendingButton = new Ext.Button({
            icon:  ServerEnvironment.baseUrl + "/images/hmenu-desc.gif",
            tooltip: 'Sort Descending',
            enableToggle: true,
            toggleGroup: 'sortingGroup',
            toggleHandler: function(aButton, aState) {
               this.sort('DESC');
               this.filterHasChanged();
            },
            scope: this
         });

         aConfig.tbar  = new Ext.Toolbar({
            hideBorders: true,
            items: [
            {
               xtype: 'buttongroup',
               title: 'Sorting',
               items: [this.sortAscendingButton, this.sortDescendingButton]
            },

            {
               xtype: 'buttongroup',
               title: 'Ordering',
               items: [
                  {
                     icon:  ServerEnvironment.baseUrl + "/images/page-first.gif",
                     style: "-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);",
                     tooltip: 'Move Top',
                     handler: function(aButton, aEventObject) {
                        this.shiftSelectedToTop();
                     },
                     scope: this
                  }, {
                     icon:  ServerEnvironment.baseUrl + "/images/page-prev.gif",
                     tooltip: 'Move Up',
                     style: "-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);",
                     handler: function(aButton, aEventObject) {
                        this.shiftSelectedUp();
                     },
                     scope: this
                  }, {
                     icon:  ServerEnvironment.baseUrl + "/images/page-next.gif",
                     style: "-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);",
                     tooltip: 'Move Down',
                     handler: function(aButton, aEventObject) {
                        this.shiftSelectedDown();
                     },
                     scope: this
                  }, {
                     icon:  ServerEnvironment.baseUrl + "/images/page-last.gif",
                     style: "-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);",
                     tooltip: 'Move Bottom',
                     handler: function(aButton, aEventObject) {
                        this.shiftSelectedToBottom();
                     },
                     scope: this
                  }
               ]
            },
            {
               xtype: 'buttongroup',
               title: 'Filter',
               items: [
                  {
                     icon:  ServerEnvironment.baseUrl + "/images/btnFilter.gif",
                     width: 26,
                     tooltip: 'Filter',
                     enableToggle: true,
                     toggleHandler: function(aButton, aState) {
                        if (aState)
                        {
                           this.filterPanel.show();
                        }
                        else
                        {
                           this.filterPanel.hide();
                        }
                        this.doLayout();
                     },
                     scope: this
                  }
               ]
            }
         ]});
      }

//      aConfig = Ext.apply({
//         layout: 'fit',
//         width: 200,
//         buttonAlign: 'center',
//         bodyStyle: {backgroundColor: '#fff'},
//         items: [this.view]
//      }, aConfig);


      aConfig = Ext.apply({
         layout: 'border',
         width: 200,
         buttonAlign: 'center',
         bodyStyle: {backgroundColor: '#fff'},
         items: [this.filterPanel, this.view]
      }, aConfig);


//      this.on('afterlayout', this.onPanelRendered, this);

      Adf.widgets.ListBoxWidget.superclass.constructor.call(this, aConfig);


   },



   /**
    * This property indicates that list box items are filtered.
    *
    * @returns {Boolean} true if the list box is filtered or false the list box has no filter applied.
    */
   isFiltered: function()
   {
      return this.getStore().isFiltered();
   },


   /**
    * This method removes the current filter on list box.
    */
   clearFilter: function()
   {
      this.getStore().clearFilter();
   },


   /**
    * This method filters the list box items based on the value passed in. If the filter value is an empty string
    * then it is assumed that the list box is no longer filtered and that filter will be removed.
    *
    * @param aNewValue (String) A filter value.
    */
   setTextFilter: function (aNewValue)
   {
      // Note: the filter object should eventually call the Adf.widgets.ListBoxWidget.filterHasChanged method
      // which applies the filter. This was the old legacy design where updating the filter value caused
      // the list box to be filtered.
      this.filter.setFilterValue(aNewValue.toLowerCase());
   },


   /**
    * This method filters the list box items. If the filter value is an empty string or null value then it is
    * assumed that the list box is no longer filtered and that filter will be removed.
    *
    * Note: the filter object should eventually call the Adf.widgets.ListBoxWidget.filterHasChanged method
    * which applies the filter. This was the old legacy design where updating the filter value caused
    8 the list box to be filtered.
    */
   filterHasChanged: function()
   {
      if (!Ext.isEmpty(this.filter.filterValue))
      {
         // Validate the filter has an Ext compatible filter function.
         if (Ext.isEmpty(this.filter.extShouldDisplay))
         {
            this.filter = Ext.apply(this.filter, {
               extShouldDisplay: function(aRecord, aRecordId)
               {
                  return this.shouldDisplay(aRecord.json);
               }
            });
         }

         this.getStore().filterBy(this.filter.extShouldDisplay, this.filter);
      }
      else
      {
         this.clearFilter();
      }
   },


   /**
    * This method handles the filterChanged event from the List Box Filter Panel. It applies the updated filter value. If the
    * value is an empty string then filter is cleared.
    *
    * @param aFilterPanel (Adf.widgets.ListBoxFilterPanel) A reference to the List Box Filter Panel.
    * @param aFilterValue (String) Filter value.
    */
   onFilterValueChanged: function(aFilterPanel, aFilterValue)
   {
      this.setTextFilter(aFilterValue);
   },


   clearSort: function()
   {
      if (this.sortAscendingButton)
      {
         this.sortAscendingButton.toggle(false, true);
      }
      if (this.sortDescendingButton)
      {
         this.sortDescendingButton.toggle(false, true);
      }
      delete this.getStore().sortInfo;
   },

   sort: function(aDirection)
   {
      this.suspendEvents();
      var selectedRecords = this.view.getSelectedRecords();
      this.getStore().sort('text', aDirection);
      this.view.select(selectedRecords);
      this.resumeEvents();
   },


   // no longer used.
   onPanelRendered: function(aPanel)
   {
      var listboxElement = Ext.getDom(this.listId);
      if (listboxElement)
      {
         if (!listboxElement.onchange)
         {
//            alert('setting handler');
            listboxElement.onchange = this.onChange.createDelegate(this);
         }
      }

   },

   onChange: function()
   {
      this.fireEvent('selectionChange')
   },

   onSelectAllButtonClicked: function(aButton, aEventObject)
   {
      this.fireEvent('selectAll');
   },

   onResetButtonClicked: function(aButton, aEventObject)
   {
      this.fireEvent('clearAll')
   },

   onViewSelectionChange: function()
   {
      this.fireEvent('selectionChange');
   },


   /**
    * This property returns the data store for this widget. The data store is the container that holds all of the
    * data used by this widget.
    *
    * @returns {Ext.data.Store}
    */
   getStore: function()
   {
      return this.view.getStore();
   },


   /**
    * This method selects all of the items in the list box.
    */
   selectAll: function()
   {
      this.view.selectAll();
   },


   /**
    * This method removes all of the items in the list box.
    */
   clearSelections: function()
   {
      this.view.clearSelections();
   },


   /**
    * This method returns an array of records for all selected items in the list box.
    *
    * @returns {Ext.data.Record} Array of selected items.
    */
   getSelectedRecords: function()
   {
      return this.view.getSelectedRecords();
   },


   /**
    * This method moves all selected items to the top.
    *
    * NOTE: one side effect of this method is that it will remove any
    * sortFn which is installed on this list (since sorting doesn't make sense
    * if we allow shifting).
    *
    **/
   shiftSelectedToTop: function ()
   {
      if (this.view.getSelectionCount() > 0)
      {
         this.clearSort();

         var selectedRecords = this.view.getSelectedRecords();

         // This array is sorted in the order the items are selected in the list, sort the array to match the list order.
         selectedRecords.sort(function(a, b){
            return this.getStore().indexOf(a) - this.getStore().indexOf(b);
         }.createDelegate(this));

         this.suspendEvents();
         this.getStore().remove(selectedRecords);
         this.getStore().insert(0, selectedRecords);
         this.view.select(selectedRecords, false, false);
         this.resumeEvents();
      }
   },



   /**
    * This method moves all selected items to the top.
    *
    * NOTE: one side effect of this method is that it will remove any
    * sortFn which is installed on this list (since sorting doesn't make sense
    * if we allow shifting).
    *
    **/
   shiftSelectedToBottom: function ()
   {
      if (this.view.getSelectionCount() > 0)
      {
         this.clearSort();

         var selectedRecords = this.view.getSelectedRecords();

         // This array is sorted in the order the items are selected in the list, sort the array to match the list order.
         selectedRecords.sort(function(a, b){
            return this.getStore().indexOf(a) - this.getStore().indexOf(b);
         }.createDelegate(this));

         this.suspendEvents();
         this.getStore().remove(selectedRecords);
         this.getStore().add(selectedRecords);
         this.view.select(selectedRecords, false, false);
         this.resumeEvents();
      }
   },




   /**
    * This method shifts all currently selected objects up by one.  This method automatically
    * refreshs the view when its done.
    *
    * NOTE: one side effect of this method is that it will set the remove any
    * sortFn which is installed on this list (since sorting doesn't make sense
    * if we allow shifting).
    **/
   shiftSelectedUp: function()
   {
      if (this.view.getSelectionCount() > 0)
      {
         this.clearSort();

         var selectedRecords = this.view.getSelectedRecords();

         // This array is sorted in the order the items are selected in the list, sort the array to match the list order.
         selectedRecords.sort(function(a, b){
            return this.getStore().indexOf(a) - this.getStore().indexOf(b);
         }.createDelegate(this));

         this.suspendEvents();

         Ext.each(selectedRecords, function(aItem, aItemIndex, aAllItems){
            var recordIndex = this.indexOf(aItem);
            var previousRecordIndex = (aItemIndex - 1) > -1 ? this.indexOf(aAllItems[aItemIndex-1]) : -1;

            // Validate that this is not the first record. The first record cannot be moved up.
            if (recordIndex > 0)
            {
               var moveTo = recordIndex - 1;

               // Validate that the current record is not moved above a previously moved record. To maintain list order.
               if (moveTo > previousRecordIndex)
               {
                  this.remove(aItem);
                  this.insert(moveTo, aItem);
               }
            }

         }, this.getStore());

         this.view.select(selectedRecords, false, false);
         this.resumeEvents();
      }
   },


   /**
    * This method shifts all currently selected objects down by one.  This method automatically
    * refresh the view when its done.
    *
    * NOTE: one side effect of this method is that it will set the remove any
    * sortFn which is installed on this list (since sorting doesn't make sense
    * if we allow shifting).
    **/
   shiftSelectedDown: function()
   {
      if (this.view.getSelectionCount() > 0)
      {
         this.clearSort();

         var selectedRecords = this.view.getSelectedRecords();

         // This array is sorted in the order the items are selected in the list, sort the array to match the list order.
         selectedRecords.sort(function(a, b){
            return this.getStore().indexOf(a) - this.getStore().indexOf(b);
         }.createDelegate(this));

         this.suspendEvents();

         // Note: processing the records in reverse order.
         var selectedRecordCount = (selectedRecords.length-1);
         for (var i = selectedRecordCount; i >= 0; i--)
         {
            var record = selectedRecords[i];
            var recordIndex = this.getStore().indexOf(record);
            var previousRecordIndex = (i + 1) <= selectedRecordCount ? this.getStore().indexOf(selectedRecords[i+1]) : this.getStore().getCount();

            // Validate that this is not the last record in the list. The last record cannot be moved down.
            if (recordIndex < (this.getStore().getCount() - 1))
            {
               var moveTo = recordIndex + 1;

               // Validate that the current record is not being moved below a previously moved record. To maintain list order.
               if (moveTo < previousRecordIndex)
               {
                  this.getStore().remove(record);
                  this.getStore().insert(moveTo, record);
               }
            }

         }

         this.view.select(selectedRecords, false, false);
         this.resumeEvents();
      }
   }

});



//======================================================================================================================
//======================================================================================================================
/**
 * This class is the ADF List Box Widget that supports the Legacy JsListBox interface. Most of the JsListBox interface
 * is supported but some of the properties, methods and functionality have been removed because they are obsolete
 * or no longer applicable.
 *
 * The JsListBox widget used to wrap an existing HTML Select on a JSP page. The new ADF List Box widget
 * no longer just a wrapper so it does not use the existing HTML Select anymore but instead it replaces the HTML Select
 * with its own visual component. However, the existing HTML Select is still need and acts as a placeholder the new
 * ADF list box widget. And the new visual component will match more of the look of the other EXTJS controls.
 *
 * @param aName Name of this list box widget. Note: This used to be underlying HTML Select in the legacy widget.
 * @param aSelectId ID of the existing HTML Select. The HTML Select is just a place holder and will be removed and
 *                  replaced by the ADF List Box widget.
 * @param aSourceItems (Array) An initial list of items to display in the list box.
 * @param aFieldExtractor
 * @param aConfig
 * @constructor
 */
function JsListBox(aName, aSelectId, aSourceItems, aFieldExtractor, aConfig)
{

   this.name = aName;
   this.selectId = aSelectId;
   this.fieldExtractor = aFieldExtractor;
   this.filter = new DefaultFilter("", this);
   this.removeListener = DefaultRemoveListener.instance;
   this.isSortingEnabled = true;
   this.sortDirection = 'ASC';
   this.sortFn = function (a, b)
   {
      if (a == undefined || a['text'] == undefined)
         return -1;

      if (b == undefined || b['text'] == undefined)
         return 1;

      var isLessThan = a['text'].toLowerCase() < b['text'].toLowerCase();
      return (isLessThan ? -1 : 1);
   };

   // Define a data store that will accept a list box item.
   this.store = new Ext.data.JsonStore({
      autoDestroy: true,
      root: 'listBoxItems',
      idProperty: 'value',
      fields: [{name: 'value', mapping: 'value'}, {name: 'text', mapping: 'text'}, 'srcObject']
   });


   // Convert the source objects into list box items and then load them into the data store.
   this.listBoxItems = this.convertSrcItemsToListBoxItems(aSourceItems);
//   if (listBoxItems.length > 0)
//   {
//      // Manual Sorting.
//      if (this.sortFn)
//      {
//         listBoxItems.sort(this.sortFn);
//      }
//
//      this.store.loadData({
//         listBoxItems: listBoxItems
//      });
//   }

   var config = {
      title: '',
      enableButtons: false,
      frame: false
   };


   if (Ext.isObject(aConfig))
   {
      if (!Ext.isEmpty(aConfig.title) || (Ext.isBoolean(aConfig.enableButtons) && aConfig.enableButtons))
      {
         config.frame = true;
      }
      config = Ext.apply(config, aConfig);
   }

   Adf.widgets.LegacyJsListBox.superclass.constructor.call(this, config);

//   Ext.onReady(function(){
//      if (!this.view.rendered)
//      {
//         var oldListBoxElement = Ext.get(this.selectId);
//
//         // Make the new ADF list box widget the same size as the old list box.
//         this.setWidth(oldListBoxElement.getWidth());
//         this.setHeight(oldListBoxElement.getHeight());
//
//         // onchange
//         this.onchange = oldListBoxElement.dom.onchange;
//         if (!Ext.isEmpty(this.onchange))
//         {
//            this.on('selectionChange', this.onchange);
//         }
//
//         // Remove the old HTML select list box and replace it with the new ADF List Box widget.
//         var parentElement = oldListBoxElement.dom.parentElement;
//         Ext.destroy(Ext.get(this.selectId));
//         this.render(parentElement);
//
//      }
//
//   }, this);
};

//JsListBox = Adf.widgets.LegacyJsListBox;
Adf.widgets.LegacyJsListBox = Ext.extend(JsListBox, Adf.widgets.ListBoxWidget, {


   /**
    * This method converts the source items into list box items by using the field extractor.
    *
    * @param aSourceItems An array of objects or an object map.
    * @returns {Array} Converted list box items.
    */
   convertSrcItemsToListBoxItems: function(aSourceItems)
   {
      var listBoxItems = [];

      if (!Ext.isEmpty(aSourceItems))
      {
         if (Ext.isArray(aSourceItems))
         {
            for (var i = 0; i < aSourceItems.length; i++)
            {
               var arrayItem = this.fieldExtractor.extractListBoxItem(aSourceItems[i]);
               arrayItem.srcObject = aSourceItems[i];
               arrayItem.originalListBox = this;
               listBoxItems.push(arrayItem);
            }
         }
         else
         {
            for (var key in aSourceItems)
            {
               var objItem = this.fieldExtractor.extractListBoxItem(aSourceItems[key]);
               objItem.srcObject = aSourceItems[key];
               objItem.originalListBox = this;
               listBoxItems.push(objItem);
            }
         }
      }

      return listBoxItems;
   },




   resetAvailableItems: function (aNewAvailItems)
   {
      this.listBoxItems = this.convertSrcItemsToListBoxItems(aNewAvailItems);
//      this.view.getStore().loadData({listBoxItems: listBoxItems});
   },

   refreshView: function ()
   {
      if (this.id == this.selectId)
      {
         if (this.isSortingEnabled)
         {
            this.sort(this.sortDirection);
         }
         else
         {
            this.getStore().loadData({listBoxItems: this.listBoxItems});
         }

         this.filterHasChanged();

         this.view.refresh();
      }
      else
      {
         var oldListBoxElement = Ext.get(this.selectId);

         var oldDimensions = {
            selectId: this.selectId,
            width: oldListBoxElement.getWidth(),
            height: oldListBoxElement.getHeight(),
            top: oldListBoxElement.getTop(),
            left: oldListBoxElement.getLeft()
         };

         // onchange
         this.onchange = oldListBoxElement.dom.onchange;
         if (!Ext.isEmpty(this.onchange))
         {
            this.on('selectionChange', this.onchange);
         }

         // Remove the old HTML select list box and replace it with the new ADF List Box widget.
         var parentElement = oldListBoxElement.dom.parentElement;
         Ext.destroy(Ext.get(this.selectId));

         // Change the ID of this list box widget to the ID of the select control that was just removed. Changing the
         // ID involves removing the component from the Ext Component Manager, changing the ID and then registering
         // it again because the Ext Component Manager stores components based on the ID so the ID cannot simply be
         // changed.
         Ext.ComponentMgr.unregister(this);
         this.id = this.selectId;
         Ext.ComponentMgr.register(this);


         // Make the new ADF list box widget the same size as the old list box.
         this.updateBox({
            x: oldDimensions.left,
            y: oldDimensions.top,
            width: oldDimensions.width,
            height: oldDimensions.height
         });

         this.render(parentElement);

         if (this.isSortingEnabled)
         {
            this.sort(this.sortDirection);
         }
         else
         {
            this.getStore().loadData({listBoxItems: this.listBoxItems});
         }

         this.filterHasChanged();

         this.view.refresh();
      }
   },

   sort: function(aDirection)
   {
      if (Ext.isFunction(this.sortFn))
      {
         // Remove automatic sorting just in case it was used before manual sorting.
         JsListBox.superclass.clearSort.call(this);

         // Manual Sorting.
         if (aDirection == 'ASC')
         {
            this.listBoxItems.sort(this.sortFn);
         }
         else
         {
            var descFn = {
               ascSortFn: this.sortFn,
               sortFn: function(a, b)
               {
                  return this.ascSortFn(a, b) * -1;
               }
            };
            this.listBoxItems.sort(descFn.sortFn.createDelegate(descFn));
         }

         this.suspendEvents();
         var selectedRecords = this.view.getSelectedRecords();
         this.getStore().loadData({listBoxItems: this.listBoxItems});
         for (var i = 0; i < selectedRecords.length; i++)
         {
            var o = {
               selectedRecord: selectedRecords[i],
               view: this.view,
               fn: function(aRecord)
               {
                  if (this.selectedRecord.data.value == aRecord.data.value)
                  {
                     this.view.select(aRecord, true, true);
                     return false;
                  }
               }
            };
            this.getStore().each(o.fn, o);
         }
         this.resumeEvents();

         if (aDirection == 'ASC')
         {
            if (this.sortAscendingButton)
            {
               this.sortAscendingButton.toggle(true, true);
            }
         }
         else
         {
            if (this.sortDescendingButton)
            {
               this.sortDescendingButton.toggle(true, true);
            }
         }
      }
      else
      {
         // Automatic sorting.
         JsListBox.superclass.sort.call(this);
      }

      this.sortDirection = aDirection;
   },

   clearSort: function()
   {
      this.isSortingEnabled = false;
      JsListBox.superclass.clearSort.call(this);
   },

   getSelectedItems: function ()
   {
      var selectedRecords = this.view.getSelectedRecords();
      var o = {selectedItems: []};
      Ext.each(selectedRecords, function(aItem, aIndex, aAllItems){
         this.selectedItems.push(aItem.json);
      }, o);
      return o.selectedItems;
   },

   selectAll: function ()
   {
      this.view.selectAll();
   },

   deselectAll: function ()
   {
      this.view.clearSelections();
   },

   selectItemsFromValues: function (aItemsToSelect)
   {
      if (Ext.isArray(aItemsToSelect))
      {
         var itemIndexes = [];
         for (var i = 0; i < aItemsToSelect.length; i++)
         {
            var searchResult = {
               searchValue: aItemsToSelect[i],
               itemIndex: -1
            };

            // Don't use findExact() find the record because it uses === to compare values an integer 2 and a string "2"
            // do not match.
            this.view.getStore().each(function(aRecord){
               if (aRecord.data.value == this.searchValue)
               {
                  this.itemIndex = aRecord.store.indexOf(aRecord);
                  return false;
               }
            }, searchResult);

            if (searchResult.itemIndex > -1)
            {
               itemIndexes.push(searchResult.itemIndex);
            }
         }
         if (itemIndexes.length > 0)
         {
            this.view.select(itemIndexes, false, false);
         }
      }
   },


   removeSelected: function ()
   {
      var selectedRecords = this.view.getSelectedRecords();
      var o = {
         removeListener: this.removeListener,
         removedItems: [],
         removedRecords: []
      };

      // Build the list of items to remove.
      Ext.each(selectedRecords, function(aItem, aIndex, aAllItems){
         if (!Ext.isEmpty(this.removeListener) && this.removeListener.allowRemove(aItem.json))
         {
            this.removedRecords.push(aItem)
            this.removedItems.push(aItem.json);
         }
      }, o);

      // Remove the items from the data store.
      if (o.removedRecords.length > 0)
      {
         this.view.getStore().remove(o.removedRecords);
      }

      return o.removedItems;
   },

   removeAllItems: function()
   {
      var o = {
         removeListener: this.removeListener,
         removedItems: [],
         removedRecords: []
      };

      // Build the list of items to remove.

      this.view.getStore().each(function(aItem){
         if (!Ext.isEmpty(this.removeListener) && this.removeListener.allowRemove(aItem.json))
         {
            this.removedRecords.push(aItem)
            this.removedItems.push(aItem.json);
         }
      }, o);

      // Remove the items from the data store.
      if (o.removedRecords.length > 0)
      {
         this.view.getStore().remove(o.removedRecords);
      }

      return o.removedItems;
   },


   /**
    * @param aNewItems a collection of sourceItems, from which the extractor will
    * extract value and text fields
    */
   appendSourceObjects: function (aNewItems)
   {
      var listBoxItems = this.convertSrcItemsToListBoxItems(aNewItems);
      if (listBoxItems.length > 0)
      {
         this.view.getStore().loadData({listBoxItems: listBoxItems}, true);
      }
   },

   /**
    * @param aNewItems - an Array of sourceItems, from which the extractor will
    * extract value and text fields
    */
   appendSourceObjectsFromArray: function (aNewItems)
   {
      this.appendSourceObjects(aNewItems);
   },


   appendSourceObject: function (aSingleNewItem)
   {
      var sourceObjects = [];
      sourceObjects.push(aSingleNewItem);
      this.appendSourceObjects(sourceObjects);
   },


   /**
    * adds list items to this JsListBox
    * @param aNewItems an Array of ListItems
    */
   appendListItems: function (aNewItems)
   {
      if (Ext.isArray(aNewItems))
      {
         this.view.getStore().loadData({listBoxItems: aNewItems}, true);
      }
   },


   /**
    * removes list items from this JsListBox
    * @param aNewItems an Array of ListItems
    */
   removeListItems: function(aTargetListItems)
   {
      var o = {
         targetListItem: null,
         removeListener: this.removeListener,
         removedItems: [],
         removedRecords: []
      };

      // Build the list of items to remove.

      for (var i = 0; i < aTargetListItems.length; i++)
      {
         o.targetListItem = aTargetListItems[i];
         this.view.getStore().each(function(aItem){
            if (aItem.json.value == this.targetListItem.value)
            {
               this.removedRecords.push(aItem)
               this.removedItems.push(aItem.json);
               return false;
            }
         }, o);
      }

      // Remove the items from the data store.
      if (o.removedRecords.length > 0)
      {
         this.view.getStore().remove(o.removedRecords);
      }
   },


   /**
    *  remove items from list A based on other list
    * @param aOtherList a JsListBox
    */
   removeItemsBasedOnOtherList: function (aOtherList)
   {
      var otherListRecords = aOtherList.view.getStore().getRange();
      var o = {
         targetListItem: null,
         removeListener: this.removeListener,
         removedItems: [],
         removedRecords: []
      };

      // Build the list of items to remove.
      for (var i = 0; i < otherListRecords.length; i++)
      {
         o.targetListItem = otherListRecords[i].json;
         this.view.getStore().each(function(aItem){
            if (aItem.json.value == this.targetListItem.value)
            {
               this.removedRecords.push(aItem)
               this.removedItems.push(aItem.json);
               return false;
            }
         }, o);
      }

      // Remove the items from the data store.
      if (o.removedRecords.length > 0)
      {
         this.view.getStore().remove(o.removedRecords);
      }
   },


   /**
    * @param removeIfInOriginal determines what happens if the items are in their original list box
    * @return a boolean: true -- remove them; the items will be deleted, false -- keep them
    **/
   returnSelectedToOriginalList: function (removeIfInOriginal)
   {
      var targetItems = this.removeSelected();

      for (var i = 0; i < targetItems.length; ++i)
      {
         if (targetItems[i].originalListBox == this &&
            removeIfInOriginal)
         {
            continue;   //just skip and it will be removed
         }
         targetItems[i].originalListBox.view.getStore().loadData({listBoxItems: [targetItems[i]]}, true);
      }

   },

   /**
    * copy all my currently selected items to some other list...
    */
   copySelectedToOtherList: function(aOtherList, aAllowDuplicates)
   {
      var existingMap = new Object();

      if (!aAllowDuplicates) //build map of id's so that we can quickly determine if a given id is in the "other list"
      {
         var allOtherItems = aOtherList.getAllItems();
         for (var i=0; i<allOtherItems.length; i++)
         {
            var item =  allOtherItems[i];
            existingMap[item.value] = item;
         }
      }

      var targetItems = this.getSelectedItems();
      var listBoxItems = [];
      for (var i = 0; i < targetItems.length; ++i)
      {
         var item = targetItems[i];
         if (aAllowDuplicates || existingMap[item.value]==null)
         {
            listBoxItems.push(item);
//            aOtherList.availableItems[aOtherList.availableItems.length] = item ;
         }
      }
      if (listBoxItems.length > 0)
      {
         aOtherList.getStore().loadData({listBoxItems: listBoxItems}, true);

      }
   },


   /**
    * ssed specifically for copying selected columns SUM fields to separate list box.
    */
   copySelectedValuesToOtherList: function (aOtherList, literal)
   {
      var copyItems = this.getSelectedItems();
      var element = document.getElementById(aOtherList.selectId);

      var text;
      var value;
      var j = 0;

      //--- reset old listbox items...
      element.options.length = 0;

      //--- now reset the actual items...
      for (var i = 0; i < copyItems.length; ++i)
      {
         text = copyItems[i].text;
         value = copyItems[i].value;
         if (literal == null || text.indexOf(literal) != -1)
         {
            var newOptItem = document.createElement("option");

            newOptItem.value = value;
            newOptItem.text = text;
            newOptItem.listBoxItem = copyItems[i];

            element.options[element.options.length] = newOptItem;
            element.options[element.options.length - 1].selected = true;
         }
      }
   },


   /**
    * ssed specifically for copying selected columns SUM fields to separate list box.
    */
   copySelectedValuesToOtherList: function (aOtherList, literal)
   {
      var copyItems = this.getSelectedItems();
      var element = document.getElementById(aOtherList.selectId);

      var text;
      var value;
      var j = 0;

      //--- reset old listbox items...
      element.options.length = 0;

      //--- now reset the actual items...
      for (var i = 0; i < copyItems.length; ++i)
      {
         text = copyItems[i].text;
         value = copyItems[i].value;
         if (literal == null || text.indexOf(literal) != -1)
         {
            var newOptItem = document.createElement("option");

            newOptItem.value = value;
            newOptItem.text = text;
            newOptItem.listBoxItem = copyItems[i];

            element.options[element.options.length] = newOptItem;
            element.options[element.options.length - 1].selected = true;
         }
      }
   },

   /**
    * used specifically for copying selected columns Names to a separate list box
    */
   copySelectedNamesToOtherList: function (aOtherList)
   {
      var copyItems = this.getSelectedItems();
      var element = document.getElementById(aOtherList.selectId);

      var text;
      var value;
      var j = 0;

      //--- reset old listbox items...
      element.options.length = 0;

      //--- now reset the actual items...
      for (var i = 0; i < copyItems.length; ++i)
      {
         text = copyItems[i].text;
         value = copyItems[i].value;

         var newOptItem = document.createElement("option");
         newOptItem.value = value;
         newOptItem.text = text;
         newOptItem.listBoxItem = copyItems[i];

         element.options[element.options.length] = newOptItem;
         element.options[element.options.length - 1].selected = true;
      }
   },


   /**
    * @param aItemsToSelect an Array of ListBoxItem objects
    **/
   selectItems: function (aItemsToSelect)
   {
      if (Ext.isArray(aItemsToSelect))
      {
         var itemIndexes = [];
         for (var i = 0; i < aItemsToSelect.length; i++)
         {
            var searchResult = {
               searchValue: aItemsToSelect[i],
               itemIndex: -1
            };

            // Don't use findExact() find the record because it uses === to compare values an integer 2 and a string "2"
            // do not match.
            this.view.getStore().each(function(aRecord){
               if (aRecord.data.value == this.searchValue.value)
               {
                  this.itemIndex = aRecord.store.indexOf(aRecord);
                  return false;
               }
            }, searchResult);

            if (searchResult.itemIndex > -1)
            {
               itemIndexes.push(searchResult.itemIndex);
            }
         }

         if (itemIndexes.length > 0)
         {
            this.view.select(itemIndexes, false, false);
         }
      }
   },

   unselectItemsFromValues: function (aItemsToUnselect)
   {
      if (Ext.isArray(aItemsToUnselect))
      {
         var itemIndexes = [];
         for (var i = 0; i < aItemsToUnselect.length; i++)
         {
            var searchResult = {
               searchValue: aItemsToUnselect[i],
               itemIndex: -1
            };

            // Don't use findExact() find the record because it uses === to compare values an integer 2 and a string "2"
            // do not match.
            this.view.getStore().each(function(aRecord){
               if (aRecord.data.value == this.searchValue)
               {
                  this.itemIndex = aRecord.store.indexOf(aRecord);
                  return false;
               }
            }, searchResult);

            if (searchResult.itemIndex > -1)
            {
               itemIndexes.push(searchResult.itemIndex);
            }
         }

         for (var j = 0; j < itemIndexes.length; j++)
         {
            this.view.deselect(itemIndexes[j]);
         }
      }
   },


   /**
    * @return array of selected srcObjects
    **/
   getSelectedSrcObjects: function ()
   {
      var selected = this.getSelectedItems();
      var selectedSrc = [];

      for (var i = 0; i < selected.length; ++i)
      {
         selectedSrc.push(selected[i].srcObject);
      }

      return selectedSrc;
   },


   /**
    * @return array of selected values
    *
    **/
   getSelectedValues: function ()
   {
      var results = {
         selected: []
      };
      var selectedListBoxItems = this.getSelectedItems();
      Ext.each(selectedListBoxItems, function(aItem, aIndex, aAllItems){
         this.selected.push(aItem.value);
      }, results);

      return results.selected;
   },


   /**
    * @return an Array of ListBoxItem objects
    *
    **/
   getAllItems: function()
   {
      var o = {
         availableItems: []
      };
      this.getStore().each(function(aRecord){
         this.availableItems.push(aRecord.json);
      }, 0);
      return o.availableItems;
   },


   /**
    * @return an Array of ints which represent the currently selected indices...
    *
    **/
   getSelectedIndices: function ()
   {
      return this.view.getSelectedIndexes();
   },


   clearList: function()
   {
      this.getStore().removeAll();
   },


   getLength: function ()
   {
      return this.getStore().getCount();
   },


   /**
    *  We keep this misspelled version for backward compatibility.
    * Notice, the missing 't' in items.  Please use setItemAsSelectedByText
    **/
   setIemAsSelectedByValue: function (anItemValue)
   {
      this.setItemAsSelectedByValue(anItemValue);
   },


   setItemAsSelectedByValue: function (anItemValue)
   {
      var o = {
         searchValue: anItemValue,
         index: -1
      };

      this.getStore().each(function(aRecord){
         if (this.searchValue == aRecord.json.value)
         {
            this.index = aRecord.store.indexOf(aRecord);
            return false;
         }
      }, o);

      if (o.index > -1)
      {
         this.view.select(o.index, true);
      }
   },


   /**
    * Sets the item with the given index as selected
    * The indices start with zero and end with this.availableItems.length-1
    **/
   setItemAsSelectedByIndex: function (anIndex)
   {
      this.view.select(anIndex, true);
   },


   /**
    *  We keep this misspelled version for backward compatibility.
    * Notice, the missing 't' in items.  Please use setItemAsSelectedByText
    **/
   setIemAsSelectedByText: function (anItemText)
   {
      this.setItemAsSelectedByText(anItemText);
   },

   setItemAsSelectedByText: function (anItemText)
   {
      var o = {
         searchValue: anItemText,
         index: -1
      };

      this.getStore().each(function(aRecord){
         if (this.searchValue == aRecord.json.text)
         {
            this.index = aRecord.store.indexOf(aRecord);
            return false;
         }
      }, o);

      if (o.index > -1)
      {
         this.view.select(o.index, true);
      }
   },


   /**
    * returns true if this list contains an item with the supplied value
    **/
   containsItemWithValue: function (aValue)
   {
      var o = {
         searchValue: aValue,
         index: -1,
         isFound: false
      };

      this.getStore().each(function(aRecord){
         if (this.searchValue == aRecord.json.value)
         {
            this.index = aRecord.store.indexOf(aRecord);
            this.isFound = true;
            return false;
         }
      }, o);

      return o.isFound;
   },


   /**
    * returns true if this list contains an item with the supplied display text
    **/
   containsItemWithText: function (aText)
   {
      var o = {
         searchValue: anItemText,
         index: -1,
         isFound: false
      };

      this.getStore().each(function(aRecord){
         if (this.searchValue == aRecord.json.text)
         {
            this.index = aRecord.store.indexOf(aRecord);
            this.isFound = true;
            return false;
         }
      }, o);

      return o.isFound;
   }




});


