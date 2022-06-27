/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

Adf.ContainerPicker = Ext.extend(Ext.Window, {
   constructor: function(aConfig)
   {
      this.addEvents({
         "valueSelected" : true
      });

      this.crnPackage = aConfig.crnPackage;
      this.directiveData = aConfig.directiveData;
      this.callBack = aConfig.callBack;
      this.callBackScope = aConfig.callBackScope;

      var containers = [];

      for (var count = 0; count < aConfig.containers.length; count++)
      {
          var eachContainer = aConfig.containers[count];

          if (eachContainer.queryItemRefs && eachContainer.queryItemRefs.length > 0)
          {
             var containerName = (count == 0 ? eachContainer.name : (eachContainer.name + " " + count));
             eachContainer.name = containerName;
            containers.push([eachContainer.name, eachContainer]);
          }

      }

      var containerStore = new Ext.data.ArrayStore({
         autoDestroy: true,
         storeId: 'containerStore',
         idIndex: 0,
         fields: [
            {name: 'containerName'},
            {name: 'container'}
         ]
      });

      containerStore.loadData(containers);

      var containerCm = new Ext.grid.ColumnModel([
         {
            id: 'containerName',
            header: applicationResources.getProperty('containerPicker.grid.containerNameHeader'),
            dataIndex: 'containerName',
            sortable: true
         }
      ]);

      this.containerGrid = new Ext.grid.GridPanel({
         cm: containerCm,
         autoExpandColumn: 'containerName',
         stripeRows: true,
         store: containerStore,
         listeners: {
            scope: this,
            rowdblclick: function(aGrid, aRowIndex, aEventObject)
            {
               this.okButtonClicked();
            }

         }
      });

      aConfig = Ext.apply({
         title: applicationResources.getProperty('containerPicker.title'),
         layout: 'fit',
         modal: true,
         width: 350,
         height: 500,
         items: [this.containerGrid],

         buttons: [
            {
               text: applicationResources.getProperty('button.Ok'),
               scope: this,
               handler: this.okButtonClicked
            },
            {
               text: applicationResources.getProperty('button.Cancel'),
               scope: this,
               handler: this.cancelButtonClicked
            }
         ]
      }, aConfig);

      Adf.ContainerPicker.superclass.constructor.call(this, aConfig);
   },

   createNewInsertContentDirective : function(aContainer)
   {
      return new InsertContentDirective (
        this.crnPackage,
        aContainer.queryItemRefs[0].refItem,
        RelationalInsertionPointEnum.AFTER,
        applicationResources.getProperty("profileWizard.content.newColumn"),
        "",
        RegularAggregateEnum.AUTOMATIC,
        AggregateFunctionEnum.NONE,
        SortEnum.DONT_SORT,
        "",
        null);
   },

   okButtonClicked: function(aButton)
   {
      var selectedContainer = this.containerGrid.getSelectionModel().getSelected();

      if(selectedContainer)
      {
         var propertySet = this.createNewInsertContentDirective(selectedContainer.data['container']).
                 toPropertySet(selectedContainer.data['container']);

         this.fireEvent("valueSelected", selectedContainer.data['container'], this.directiveData, propertySet, this.callBack);
         this.close();
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty('containerPicker.validation.title'), applicationResources.getProperty('containerPicker.validation.msg'));
      }
   },

   cancelButtonClicked: function(aButton)
   {
      this.close();
   }
});
