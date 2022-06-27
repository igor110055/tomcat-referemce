/**
 */
Adf = Ext.ns('Adf');
Adf.widgets = Ext.ns('Adf.widgets');
Adf.widgets.legacy = Ext.ns('Adf.widgets.legacy');


Adf.widgets.QueryItemValuePickerDialog = Ext.extend(Adf.QueryItemValuePickerDialog, {
   getFetchParams: function()
   {
      return {
         'itemsPerPage' : ServerEnvironment.pageSize,
         'filterType' : 'displayValue',
         'extraParams' : '',
         start : 0,
         limit : ServerEnvironment.pageSize
         ,
         displayValueRef: this.displayValueRef,
         cascadeContextXml: this.cascadeContextXml
      };
   },


   constructor: function(aConfig)
   {
      this.displayValueRef = aConfig.displayValueRef;
      this.cascadeContextXml = aConfig.cascadeContextXml;

      aConfig = Ext.apply({

      }, aConfig);

      Adf.widgets.QueryItemValuePickerDialog.superclass.constructor.call(this, aConfig);
   },


   okButtonClicked : function(aButton, aEvent)
   {
      var selectedValues = [];

      if(this.singleSelect)
      {
         if(this.resultList.store.data.items.length > 0)
         {
            selectedValues.push({
               value: this.resultList.store.data.items[0].data.value,
               text: this.resultList.store.data.items[0].data.displayValue
            });
         }
      }
      else
      {
         for (var count = 0; count < this.resultList.store.data.items.length; count++)
         {
            var eachRecord = this.resultList.store.data.items[count];
            selectedValues.push({
               value: eachRecord.data.value,
               text: eachRecord.data.displayValue
            });
         }
      }

      this.callBack.call(this.callBackScope, selectedValues);
      this.close();
   }

});

/**
 * adapter which adapts CrnDialog value picker operation to DivList needs...
 * @param aPackagePath
 * @param aValueRef
 * @param aDisplayTextRef
 * @param aIsMultiSelect
 * @param aInitialFilter
 * @param aItemsPerPage
 * @param aFilterType
 */
Adf.widgets.legacy.CrnDialogValueProvider = function(aPackagePath, aValueRef, aDisplayTextRef, aIsMultiSelect, aInitialFilter, aItemsPerPage, aFilterType, aExtraParams)
{
   this.crnDialog = new CrnDialog();
   this.packagePath = aPackagePath;
   this.valueRef = aValueRef;
   this.displayTextRef = aDisplayTextRef;
   this.isMultiSelect = aIsMultiSelect;
   this.initialFilter = aInitialFilter;
   this.itemsPerPage = aItemsPerPage;
   this.filterType = aFilterType ? aFilterType : "displayValue";

   this.extraParams = aExtraParams;

   // set later...
   this.divList = null;
   this.cascades = [];
}


Ext.extend(Adf.widgets.legacy.CrnDialogValueProvider, Ext.emptyFn, {
   setDivList: function (aDivList)
   {
      this.divList = aDivList;
   },


   /**
    * called by CrnDialog when its finished...
    * @param aPicker
    */
   dialogFinished: function (aPicker)
   {
      if (aPicker.wasCancelled)
      {
         this.divList.onDialogCancelButtonPressed(this);
      }
      else
      {
         this.divList.onDialogOkButtonPressed(aPicker.selectedValues);


         //--- this is an attempt to work around ticket #936 (for IE6
         //this.divList.focusModifyButton();
         this.divList.focusOnSomeTextInput();
      }
   },

   show: function (aInitialValues, aMaxNumberOfSelections)
   {
//      this.crnDialog.setDialogListener(this);
//
      var cascadeContext = null;
      if (this.cascades.length > 0)
      {
         cascadeContext = new CascadeContext();
         this.cascades.each(function (aDivList) {
            cascadeContext.addItem(aDivList.valuePickerDialog.valueRef,  aDivList.getSelectedValues());
         });
      }
//
//      this.crnDialog.positionY = 30;
//      this.crnDialog.showValuePickerDialog("Select Values", this.valueRef, this.displayTextRef, this.isMultiSelect, this.initialFilter, this.packagePath, this.itemsPerPage, this.filterType, this.extraParams, aInitialValues, cascadeContext, aMaxNumberOfSelections);

//      alert("this.isMultiSelect="+this.isMultiSelect);
//      alert("aInitialValues="+aInitialValues);

      var dialog = new Adf.widgets.QueryItemValuePickerDialog({
         queryItemPath : this.valueRef,
         displayValueRef : this.displayTextRef,
         packagePath : this.packagePath,
         callBackScope : this.divList,
         callBack : this.divList.onDialogOkButtonPressed,
         singleSelect : !this.isMultiSelect,
         initialValues: aInitialValues,
         cascadeContextXml: !Ext.isEmpty(cascadeContext) ? cascadeContext.toXml() : ''
      });
      dialog.show();
   },


   addCascade: function (aDivList)
   {
      this.cascades.push(aDivList);
   }
});




Adf.widgets.legacy.DivList = function(aDocument, aContainerId, aHeightCssExpr, aMaxItems, aInitialValues, aFieldExtractor, aValuePickerDialog)
{
   if (arguments.length > 0)
   {
//      DivList.superclass.constructor.call(this);
      this.document = aDocument;
      this.containerId = aContainerId;
      this.heightCssExpr = aHeightCssExpr;
      this.maxItems = aMaxItems;
      this.fieldExtractor = aFieldExtractor;

      this.valuePickerDialog = aValuePickerDialog;

      this.setItemsFromSourceObjects(aInitialValues);

      this.emptyMessage = null;


      //--- event handlers, bound later... referenced here just so we can unwire them
      this.onClickFn = null;
      this.onMouseOverFn = null;
      this.onMouseOutFn = null;
   }
};

Ext.extend(Adf.widgets.legacy.DivList, Observable, {
   /**
    * sets the items visible available in this DivList, from a list of Source Objects (the
    * fieldExtractor will be used to extract a DivListItem from each SourceObject).
    * @param aItems - an Array of source objects
    */
   setItemsFromSourceObjects: function (aSourceObjects)
   {
      if (JsUtil.isGood(aSourceObjects))
      {
         var divListItems;

         if (JsUtil.isArray(aSourceObjects))
         {
            divListItems = [];

            for (var i = 0; i < aSourceObjects.length; ++i)
            {
               divListItems.push(this.fieldExtractor.extractDivListItem(aSourceObjects[i]));
            }
         }
         else
         {
            divListItems = [];

            aSourceObjects.each(function (anObject) {
               divListItems.push(this.fieldExtractor.extractDivListItem(anObject));
            }.bind(this));
         }

         this.setItems(divListItems);
      }
      else
      {
         this.setItems([]);
      }
   },


   /**
    * set the list of items
    * @param aItems - must be an array of DivList.DivListItem objects
    */

   setItems: function (aItems)
   {
      if (!Ext.isArray(aItems) || (aItems.length > 0 && !(aItems[0] instanceof Adf.widgets.legacy.DivList.DivListItem)))
      {
         alert("ERROR  - DivList.prototype.setItems(aItems) was called, but aItems is not an array of DivList.DivListItem objects");
         return;
      }

      this.items = aItems;

      if (this.items)
      {
         this.items.each(function(anItem) {
            anItem.divList = this;
         }.bind(this));
      }
   },


   /**
    * re-render this widget to its display area...
    */
   refreshView: function()
   {
      /*
       <div class="divList" id="divList_(containerId)">
       <ul class="divListItems">
       </ul>
       <div class="divListButtons">
       ...
       </div>
       </div>
       */

      var listDiv = this.getDocument().getElementById("divList_" + this.containerId);

      var ul = null;

      //--- first time rendering, render the whole skeleton, with buttons, etc...
      if (!JsUtil.isGood(listDiv))
      {
         listDiv = this.getDocument().createElement("div");
         listDiv.className = "divList";
         listDiv.id = "divList_" + this.containerId;

         var ul = this.getDocument().createElement("ul");
         ul.className = "divListItems";
         ul.style.height = this.heightCssExpr;
         listDiv.appendChild(ul);


         var divListButtons = this.getDocument().createElement("div");
         divListButtons.className = "divListButtons";

         listDiv.appendChild(divListButtons);

         var resetButton = document.createElement("input");
         resetButton.type = "button";
         resetButton.id = listDiv.id + "_reset";
         resetButton.value = "Reset";
         Event.observe(resetButton, "click", function(anEvent) {
            this.onResetButtonPressed(anEvent);
         }.bind(this), false);

         divListButtons.appendChild(resetButton);

         var modifyButton = document.createElement("input");
         modifyButton.type = "button";
         modifyButton.id = listDiv.id + "_modify";
         modifyButton.value = "Modify";
         Event.observe(modifyButton, "click", function(anEvent) {
            this.onModifyButtonPressed(anEvent);
         }.bind(this), false);

         divListButtons.appendChild(modifyButton);

         //--- now insert or replace at the appropriate location...
         var target = this.getDocument().getElementById(this.containerId);

         target.appendChild(listDiv);
      }
      //--- else we're just updating the contents of a previous version of the divList
      //    here we really just need to update the <ul> and its contents...
      else
      {
         ul = this.getDocument().createElement("ul");
         ul.className = "divListItems";
         ul.style.height = this.heightCssExpr;

         var previousUl = listDiv.getElementsByTagName("ul")[0];

         Event.stopObserving(previousUl, "click", this.onClickFn, false);
         Event.stopObserving(previousUl, "mouseover", this.onMouseOverFn, false);
         Event.stopObserving(previousUl, "mouseout", this.onMouseOutFn, false);

         listDiv.replaceChild(ul, previousUl);
      }

      //--- wire handlers for the body of this DivList (which is largely the <ul>)...
      this.onClickFn = this.onModifyButtonPressed.bindAsEventListener(this);
      Event.observe(ul, "click", this.onClickFn, false);

      this.onMouseOverFn = function(anEvent) { Element.addClassName(this,"divListHover");}.bind(ul);
      Event.observe(ul, "mouseover", this.onMouseOverFn, false);

      this.onMouseOutFn = function(anEvent) { Element.removeClassName(this,"divListHover"); }.bind(ul)
      Event.observe(ul, "mouseout", this.onMouseOutFn, false);


      //--- now just update the items...
      for (var i = 0; i < this.items.length; ++i)
      {
         ul.appendChild(this.items[i].toDomElement());
      }

      if (this.items.length == 0 && this.emptyMessage != null)
      {
         var emptyMessageDiv = this.document.createElement("div");
         emptyMessageDiv.className = "emptyMessage";
         emptyMessageDiv.innerHTML = this.emptyMessage;

         ul.appendChild(emptyMessageDiv);
      }
   },



   onModifyButtonPressed: function()
   {
      if (this.valuePickerDialog)
      {
         this.valuePickerDialog.setDivList(this);
         this.valuePickerDialog.show(this.items, this.maxItems);
      }
   },

   onResetButtonPressed: function()
   {
      this.setItems([]);
      this.refreshView();
   },

   onDialogOkButtonPressed: function(aSelectedValues)
   {
      var newItems = [];
      for (var i = 0; i < aSelectedValues.length; ++i)
      {
         newItems.push(new Adf.widgets.legacy.DivList.DivListItem(aSelectedValues[i].value, aSelectedValues[i].text));
      }
      this.setItems(newItems);
      this.refreshView();
   },

   onDialogCancelButtonPressed: function(aDialog)
   {
      // no-op...
   },


   /**
    * returns an array of DivListItem objects which represent the current
    * selections of the DivList
    */
   getSelectedItems: function()
   {
      return this.items;
   },

   /**
    * returns an array of String value objects which represent the current
    * selections of the DivList.   This is the DivListItem.value field from
    * getCurrentItems();
    */
   getSelectedValues: function()
   {
      var values = [];
      for (var i = 0; i < this.items.length; ++i)
      {
         values.push(this.items[i].value);
      }

      return values;
   },

   focusModifyButton: function()
   {
      this.document.getElementById("divList_" + this.containerId + "_modify").focus();
   },

   focusOnSomeTextInput: function()
   {
      var inputs = this.document.getElementsByName("input");
      for (var i = 0; i < inputs.length; ++i)
      {
         if (inputs[i].type == "text")
         {
            inputs[i].focus();
            break;
         }
      }

   },


   getDocument: function()
   {
      return this.document;
   }

});



///////////////////////////////////////////////////////////////////////////////
// inner classes :
///////////////////////////////////////////////////////////////////////////////



/**
 * DivListItem - an item in the DivList
 * @param aValue the value
 * @param aText the display text
 * @constructor
 */
Adf.widgets.legacy.DivList.DivListItem = function (aValue, aText)
{
   this.value = aValue;
   this.text  = aText;

   // set later, by the DivList...
   this.divList = null;
}

Ext.extend(Adf.widgets.legacy.DivList.DivListItem, Ext.emptyFn, {
   getDocument: function()
   {
      return this.divList.getDocument();
   },

   toString: function()
   {
      return "(" + this.value + ") (" + this.text + ")";
   },

   /**
    * creates a dom element representation of this item
    */
   toDomElement: function()
   {
      var doc = this.getDocument();
      var liNode = doc.createElement("li");
      liNode.className = "divListItem";

      liNode.appendChild(doc.createTextNode(this.text));

      return liNode;
   }
});



/**
 * SimpleFieldExtractor - extracts properties from source object to create
 * a DivListItem
 * @param aValue the value
 * @param aText the display text
 * @constructor
 */
Adf.widgets.legacy.DivList.SimpleFieldExtractor = function (aValueProperty, aTextProperty)
{
   this.valueProperty = aValueProperty;
   this.textProperty = aTextProperty;
}

Ext.extend(Adf.widgets.legacy.DivList.SimpleFieldExtractor, Ext.emptyFn, {
   extractDivListItem: function (aSourceObject)
   {
      return new Adf.widgets.legacy.DivList.DivListItem(aSourceObject[this.valueProperty], aSourceObject[this.textProperty]);
   }
});



//CrnDialogValueProvider = Adf.widgets.legacy.CrnDialogValueProvider;
//DivList = Adf.widgets.legacy.DivList;
//DivList.DivListItem = Adf.widgets.legacy.DivList.DivListItem;
//DivList.SimpleFieldExtractor = Adf.widgets.legacy.DivList.SimpleFieldExtractor;





//======================================================================================================================
//======================================================================================================================

Adf.widgets.ValuePickerListBox = Ext.extend(Ext.Panel, {

   constructor: function(aConfig)
   {
      Ext.apply(this, aConfig);

      var tpl = new Ext.XTemplate(
         '<ul>',
         '<tpl for=".">',
         '<li class="dk_divListItems">{text}</li>',
//         '<li>{text}</li>',
         '</tpl>',
         '</ul>'
//         ,
//         '<div class="x-clear"></div>'
      );

//
      var store = new Ext.data.JsonStore({
         root: 'listItems',
         id: 'value',
         fields: ['value', 'text']
      });


      this.view = new Ext.DataView({
         store: store,
         tpl: tpl,
         overCls: 'dk_divListHover' ,
         itemSelector:'div.thumb-wrap',
         deferEmptyText: false,
//         emptyText: '(Click to select items)',
//         emptyText: '<div class="dk_emptyMessage">(Click to select items)</div>',
         emptyText: '<div class="dk_emptyMessage">' + aConfig.emptyMessage + '</div>',
         listeners: {
            scope: this,
            containerclick: this.onModifyButtonClicked
         }
         ,
         autoScroll: true,
         width: 300,
         region: 'center'

      });

      var currentItems = [{
//         region: 'north',
//         xtype: 'panel',
//         frame: true,
//         layout: 'fit',
//         border: false,
//         html: 'Products'
//      }, {
         region: 'center',
         xtype: 'panel',
         layout: 'fit',
         border: false,
//         autoScroll: true,
         items: this.view
      }, {
         xtype: 'panel',
         region: 'south',
         border: false,
         buttonAlign: 'center',
         buttons: [{
            text: 'Modify',
//            icon: ServerEnvironment.baseUrl + "/images/silkIcons/add.png",
            scope: this,
            handler: this.onModifyButtonClicked
         }, {
            text: 'Clear All',
//            icon: ServerEnvironment.baseUrl + "/images/silkIcons/delete.png",
            scope: this,
            handler: this.onResetButtonClicked
         }]
      }];

//      if (!Ext.isEmpty(aConfig.listLabel))
//      {
//         currentItems.push({
//            region: 'north',
//            xtype: 'panel',
//            frame: true,
//            layout: 'fit',
//            border: false,
//            html: '<span class="label">' + aConfig.listLabel + '</span>'
//         });
//      }

      aConfig = Ext.apply({
         title: aConfig.listLabel,

         height: 200,

         layout: 'border',
         items: currentItems
//         items: [{
//            region: 'north',
//            xtype: 'panel',
//            frame: true,
//            layout: 'fit',
//            border: false,
//            html: 'Products'
//         }, {
//            region: 'center',
//            xtype: 'panel',
//            layout: 'fit',
//            border: false,
//            items: this.view
//         }, {
//            xtype: 'panel',
//            region: 'south',
//            border: false,
//            buttonAlign: 'center',
//            buttons: [{
//               text: 'Edit',
//               icon: ServerEnvironment.baseUrl + "/images/silkIcons/add.png",
//               scope: this,
//               handler: this.onModifyButtonClicked
//            }, {
//               text: 'Clear All',
//               icon: ServerEnvironment.baseUrl + "/images/silkIcons/delete.png",
//               scope: this,
//               handler: this.onResetButtonClicked
//            }]
//         }]
      }, aConfig);
//      aConfig = Ext.apply({
//         title: 'Value Picker LB',
//
//         height: 300,
//
//         layout: 'fit',
//         items: this.view,
//
//         frame: true,
//         border: true,
//
//         buttonAlign: 'center',
//         buttons: [{
//            text: 'Edit',
//            icon: ServerEnvironment.baseUrl + "/images/silkIcons/add.png",
//            scope: this,
//            handler: this.onModifyButtonClicked
//         }, {
//            text: 'Clear All',
//            icon: ServerEnvironment.baseUrl + "/images/silkIcons/delete.png",
//            scope: this,
//            handler: this.onResetButtonClicked
//         }]
//      }, aConfig);

      Adf.widgets.ValuePickerListBox.superclass.constructor.call(this, aConfig);
   },

   initComponent: function()
   {
      Adf.widgets.ValuePickerListBox.superclass.initComponent.call(this);
   },

   onRender: function(ct, position)
   {
      Adf.widgets.ValuePickerListBox.superclass.onRender.call(this, ct, position);
   },


   getStore: function(){
      return this.view.getStore();
   },

   setEmptyMessage: function(aEmptyMessage)
   {
      this.view.emptyText = '<div class="dk_emptyMessage">' + aEmptyMessage + '</div>';
      this.view.refresh();
   },

   /**
    * sets the items visible available in this DivList, from a list of Source Objects (the
    * fieldExtractor will be used to extract a DivListItem from each SourceObject).
    * @param aItems - an Array of source objects
    */

   /**
    *
     * @param aSourceObjects
    */
   setItemsFromSourceObjects: function (aSourceObjects)
   {
      if (!Ext.isEmpty(aSourceObjects))
      {
         var divListItems;

         if (Ext.isArray(aSourceObjects))
         {
            divListItems = [];

            for (var i = 0; i < aSourceObjects.length; ++i)
            {
               divListItems.push(this.fieldExtractor.extractDivListItem(aSourceObjects[i]));
            }
         }
         else
         {
            divListItems = [];

            aSourceObjects.each(function (anObject) {
               divListItems.push(this.fieldExtractor.extractDivListItem(anObject));
            }.bind(this));
         }

         this.setItems(divListItems);
      }
      else
      {
         this.setItems([]);
      }
   },



   /**
    * set the list of items
    * @param aItems - must be an array of DivList.DivListItem objects
    */

   setItems: function (aItems)
   {
      if (!Ext.isArray(aItems) || (aItems.length > 0 && !(aItems[0] instanceof Adf.widgets.legacy.DivList.DivListItem)))
      {
         alert("ERROR  - DivList.prototype.setItems(aItems) was called, but aItems is not an array of DivList.DivListItem objects");
         return;
      }

      this.listItems = aItems;
      Ext.each(this.listItems, function(anItem, aIndex, aAllItems) {
         anItem.divList = this;
      }, this);

      this.view.getStore().loadData({listItems: this.listItems});
   },


   /**
    *
    * @deprecated
    */
   refreshView: function()
   {
      this.setEmptyMessage(this.emptyMessage);
//      this.view.refresh();
      return;
   },


   /**
    * @deprecated
    */
   onModifyButtonPressed: function()
   {
      if (this.valuePickerDialog)
      {
         this.valuePickerDialog.setDivList(this);
         this.valuePickerDialog.show(this.getSelectedItems(), this.maxItems);
      }
   },


   /**
    *
    * @param aButton
    * @param aEventObject
    */
   onModifyButtonClicked: function(aButton, aEventObject)
   {
      if (this.valuePickerDialog)
      {
         this.valuePickerDialog.setDivList(this);
         this.valuePickerDialog.show(this.getSelectedItems(), this.maxItems);
      }
   },

   /**
    *
    * @param aButton
    * @param aEventObject
    */
   onResetButtonClicked: function(aButton, aEventObject)
   {
      this.view.getStore().removeAll();
   },

   /**
    *
    * @param aButton
    * @param aEventObject
    */
//   onModifyButtonClicked: function(aButton, aEventObject)
//   {
//      if (this.valuePickerDialog)
//      {
//         this.valuePickerDialog.setDivList(this);
//         this.valuePickerDialog.show(this.listItems, this.maxItems);
//      }
//   },


   /**
    * @deprecated
    */
   onResetButtonPressed: function()
   {
      this.view.getStore().removeAll();
   },


   /**
    *
    * @param aSelectedValues
    */
   onDialogOkButtonPressed: function(aSelectedValues)
   {
      var newItems = [];
      for (var i = 0; i < aSelectedValues.length; ++i)
      {
         newItems.push({
            value: aSelectedValues[i].value,
            text: aSelectedValues[i].text
         });
      }

      this.view.getStore().loadData({
         listItems: newItems
      });
   },


   /**
    *
    * @param aDialog
    */
   onDialogCancelButtonPressed: function(aDialog)
   {
      // no-op...
   },


   /**
    * returns an array of DivListItem objects which represent the current
    * selections of the DivList
    */
   getSelectedItems: function()
   {
      var o = {
         values: [],
         fn: function(aRecord)
         {
            this.values.push({
               value: aRecord.data.value,
               text: aRecord.data.text
            });
         }
      };
      this.view.getStore().each(o.fn, o);

      return o.values;
   },

   /**
    * returns an array of String value objects which represent the current
    * selections of the DivList.   This is the DivListItem.value field from
    * getCurrentItems();
    */
   getSelectedValues: function()
   {
      var o = {
         values: [],
         fn: function(aRecord)
         {
            this.values.push(aRecord.data.value);
         }
      };
      this.view.getStore().each(o.fn, o);

      return o.values;
   },


   /**
    * @deprecated
    */
   focusModifyButton: function()
   {
      return;
//      this.document.getElementById("divList_" + this.containerId + "_modify").focus();
   },


   /**
    * @deprecated
    */
   focusOnSomeTextInput: function()
   {
      var inputs = this.document.getElementsByName("input");
      for (var i = 0; i < inputs.length; ++i)
      {
         if (inputs[i].type == "text")
         {
            inputs[i].focus();
            break;
         }
      }

   },

   /**
    * @deprecated
    * @returns {*|HTMLDocument}
    */
   getDocument: function()
   {
      return this.document;
   }

});




//======================================================================================================================
//======================================================================================================================
Adf.widgets.LegacyDivList = function(aDocument, aContainerId, aHeightCssExpr, aMaxItems, aInitialValues, aFieldExtractor, aValuePickerDialog, aConfig)
{

   if (arguments.length > 0)
   {
      this.document = aDocument;
      this.containerId = aContainerId;
      this.heightCssExpr = aHeightCssExpr;
      this.maxItems = aMaxItems;
      this.fieldExtractor = aFieldExtractor;

      this.valuePickerDialog = aValuePickerDialog;


      this.emptyMessage = null;


      //--- event handlers, bound later... referenced here just so we can unwire them
      this.onClickFn = null;
      this.onMouseOverFn = null;
      this.onMouseOutFn = null;


      var config = {
         renderTo: aContainerId
         ,
         title: ''
      };

      if (Ext.isObject(aConfig))
      {
         config = Ext.apply(config, aConfig);
         Ext.apply(this, config);
//         alert('config='+Ext.encode(config));
      }

      if (!Ext.isEmpty(this.heightCssExpr))
      {
         config.height = 50 + (1*this.heightCssExpr.replace('px', ''));
      }

      Adf.widgets.LegacyDivList.superclass.constructor.call(this, config);

      this.setItemsFromSourceObjects(aInitialValues);
   }

};

Ext.extend(Adf.widgets.LegacyDivList, Adf.widgets.ValuePickerListBox, {

});

CrnDialogValueProvider = Adf.widgets.legacy.CrnDialogValueProvider;
DivList = Adf.widgets.LegacyDivList;
DivList.DivListItem = Adf.widgets.legacy.DivList.DivListItem;
DivList.SimpleFieldExtractor = Adf.widgets.legacy.DivList.SimpleFieldExtractor;
