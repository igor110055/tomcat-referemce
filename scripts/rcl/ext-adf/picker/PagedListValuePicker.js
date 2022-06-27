/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */
Adf = Ext.ns('Adf');

Adf.QueryItemValuePickerDialog = Ext.extend(Ext.Window,
{
   getFetchParams: function()
   {
      return {
         'itemsPerPage' : ServerEnvironment.pageSize,
         'filterType' : this.filterType,
         'extraParams' : this.extraParams,
         maxNumberOfSelections:  this.maxNumberOfSelections,
         start : 0,
         limit : ServerEnvironment.pageSize
      };
   },

   constructor : function(aConfig)
   {
      this.adminUtil = Adf.AdminScreenUtils();
      this.adminUtil.setScope(this);

      this.queryItemPath = aConfig.queryItemPath;
      if(aConfig.displayValueRef)
      {
          this.displayValueRef = aConfig.displayValueRef;
      }
      this.packagePath = aConfig.packagePath;
      this.callBack = aConfig.callBack;
      this.callBackScope = aConfig.callBackScope;
      this.singleSelect = (!Ext.isEmpty(aConfig.singleSelect) && aConfig.singleSelect);
      this.cognosEscapeValues = (!Ext.isEmpty(aConfig.cognosEscapeValues) ? aConfig.cognosEscapeValues : true);
      this.filterType = Ext.value(aConfig.filterType, 'displayValue', false);
      this.extraParams = Ext.value(aConfig.extraParams, '', false);
      this.maxNumberOfSelections = (Ext.isEmpty(aConfig.maxNumberOfSelections) || aConfig.maxNumberOfSelections == 0) ? 1000 : aConfig.maxNumberOfSelections;

      // the column model has information about grid columns
      // dataIndex maps the column to the specific data field in
      // the data store (created below)

      this.valueStore = new Ext.data.Store({
         proxy: new Ext.data.HttpProxy({
            url: ServerEnvironment.baseUrl + '/secure/actions/ext/queryItemValuePickerDialog.do'
         }),
         // create reader that reads the RER records
         reader: new Ext.data.JsonReader({
            root: 'pageContents',
            totalProperty: 'totalCount',
            id:'value'
         }, [
            {name: 'value', mapping: 'value'},
            {name: 'displayValue', mapping: 'displayValue'}
         ]),
         remoteSort: true
      });

      //--- custom render function for type field...
      // the column model has information about grid columns
      // dataIndex maps the column to the specific data field in
      // the data store
      var cm = new Ext.grid.ColumnModel([
         {
            id : 'displayValue',
            header: applicationResources.getProperty("valuePicker.listHeader"),
            dataIndex: 'displayValue',
            css: 'white-space:normal;' }
      ]);

      cm.defaultSortable = true;

      var controlHeight = 490;
      var controlWidth = 345;

      this.pagingToolbar = new Ext.PagingToolbar({
        pageSize: ServerEnvironment.pageSize,
        store: this.valueStore,
        displayInfo: true,
        displayMsg: 'Values {0} - {1} of {2}',
        emptyMsg: "No Values Found."
      });

      this.filterField = new Ext.form.TextField({
         value: Ext.value(aConfig.initialFilter, '', true),
         width: (controlWidth - 120),
         listeners: {
            specialkey: function(f,aEvent){
               if(aEvent.getKey() == aEvent.ENTER)
               {
                  this.valueStore.reload({});
               }
            },
            scope: this
         }
      });

      this.filterBar = new Ext.Toolbar({
         items: [
            new Ext.form.Label({
               style:
               {
                  paddingLeft:'5px',
                  paddingRight:'5px'
               },
               text: applicationResources.getProperty('button.filterBy') + ":"
            }),
            this.filterField,
            new Ext.Button({
               handler: function(aButton, aEvent){
                  this.valueStore.reload({});
               },
               scope: this,
               cls: 'x-btn-icon',
               icon:  ServerEnvironment.baseUrl + "/images/silkIcons/magnifier.png"
            })
         ]
      });

      // create the Layout (including the data grid)
      this.contentsGrid = new Ext.grid.GridPanel({
         sm: new Ext.grid.RowSelectionModel({singleSelect:this.singleSelect}),
         height: controlHeight,
         width: controlWidth,
         border:true,
         forceFit: true,
         enableHdMenu:false,
         enableColumnMove:false,
         enableDragDrop:false,
         loadMask:true,
         store: this.valueStore,
         cm: cm,
         stripeRows: true,
         tbar : this.filterBar,
         bbar:this.pagingToolbar,
         autoExpandColumn: 'displayValue'
      });

      this.adminUtil.init(this, this.contentsGrid);

      //Needed to get the Pagination toolbar to use the required inputs
      this.valueStore.proxy.on('beforeload', function(proxy, params)
      {
         params.packagePath = this.packagePath;
         params.queryItemRef = this.queryItemPath;
         if(this.displayValueRef)
         {
            params.displayValueRef = this.displayValueRef;
         }
         params.filterBy = this.filterField.getValue();

         Ext.applyIf(params, this.getFetchParams());
      }, this);

      var resultStore = new Ext.data.JsonStore(
      {
         autoDestroy:true,
         root: 'selectedValues',
         fields:[
            {name: 'value', type: 'string', mapping: 'value'},
            {name:'displayValue', type: 'string', mapping: 'text'}]
      });
      if (Ext.isArray(aConfig.initialValues))
      {
         resultStore.loadData({selectedValues: aConfig.initialValues});
      }


      this.resultList = new Ext.ux.form.MultiSelect(
      {
         xtype: 'multiselect',
         name: 'resultList',
         height: controlHeight,
         width: controlWidth,
         ddReorder: true,
         store:resultStore,
         displayField:'displayValue',
         valueFiled: 'value',
         delimiter: ',,'
      });


      aConfig = Ext.apply({
         id:'queryItemValuePickerDialog'
         ,title:applicationResources.getProperty('valuePicker.title')
         ,width:750
         ,height:520
         ,closable:true
         ,modal:true
         ,resizable: false
         ,border:false
         ,closeAction:'close',
         layout:{type : 'hbox', align: 'stretch'},
         items:[
            this.contentsGrid,
            new Ext.Panel(
            {
               padding:'2px',
               width:55,
               border: false,
               layout: 'vbox',
               items:[
                  {
                     xtype:'label',
                     text:' ',
                     height: ((controlHeight / 2) - 20)
                  },
                  {
                     xtype:'button',
                     width:50,
                     text:'&gt;&gt;',
                     scope: this,
                     handler: this.moveRightButton
                  },
                  {
                      xtype:'button',
                     width:50,
                     text:'&lt;&lt;',
                     scope: this,
                     handler: this.moveLeftButton
                  }
               ]

            }),
            this.resultList
         ],
         buttons: [{
            text : applicationResources.getProperty('button.Ok'),
            scope: this,
            handler: this.okButtonClicked
         },
         {
            text: applicationResources.getProperty('button.Cancel'),
            scope: this,
            handler: function(){this.close();}
         }]

      }, aConfig);

      Adf.QueryItemValuePickerDialog.superclass.constructor.call(this, aConfig);
   },

   show : function ()
   {
      var me = this;
      Adf.QueryItemValuePickerDialog.superclass.show.call(this);

      me.valueStore.load({
         params: me.getFetchParams(),
         scope:me
      });
   },

   moveRightButton: function()
   {
      var ids = this.contentsGrid.getSelectionModel().getSelections();
      for(var count = 0; count < ids.length; count++)
      {
         if(this.singleSelect && this.resultList.store.getCount() > 0)
         {
            Ext.Msg.alert(applicationResources.getProperty('valuePicker.warnSingleSelect.title'), applicationResources.getProperty('valuePicker.warnSingleSelect.msg'));
         }
         else
         {
            var curRecord = ids[count];
            if(this.resultList.store.indexOf(curRecord) == -1)
            {
               this.resultList.store.add(curRecord.copy());
            }
         }
      }

      this.resultList.view.refresh();
   },

   moveLeftButton: function()
   {
      var selectionsArray = this.resultList.view.getSelectedIndexes();
      var records = [];
      if (selectionsArray.length > 0)
      {
          for (var i=0; i<selectionsArray.length; i++)
          {
              var record = this.resultList.view.store.getAt(selectionsArray[i]);
              records.push(record);
          }
          for (var i=0; i<records.length; i++)
          {
              var record = records[i];

              this.resultList.view.store.remove(record);
          }
      }
      this.resultList.view.refresh();
      var si = this.resultList.store.sortInfo;
      if(si){
          this.resultList.store.sort(si.field, si.direction);
      }
   },


    okButtonClicked : function(aButton, aEvent)
   {
      var result = '';
      var arrayResult = [];
      if(this.singleSelect)
      {
         if(this.resultList.store.data.items.length > 0)
         {
            result = this.massageValue(this.resultList.store.data.items[0].data.value);
            arrayResult.push(result);
         }
      }
      else
      {
         for (var count = 0; count < this.resultList.store.data.items.length; count++)
         {
            var eachRecord = this.resultList.store.data.items[count];
            if(result.length > 0)
            {
               result += ",";
            }
            var eachValue = this.massageValue(eachRecord.data.value);
            result += "'" + eachValue + "'";
            arrayResult.push(eachValue);
         }
         result = "(" + result + ")";
      }
      this.callBack.call(this.callBackScope, result, arrayResult);
      this.close();
   },

   massageValue : function(aValue)
   {
      if (this.cognosEscapeValues)
      {
         return aValue.replace(/'/gi,"''");
      }

      return aValue;
   }
});
