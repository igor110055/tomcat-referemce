/**
 * This class represents the UI Controller for the Display SQL UI. This screen displays the SQL statements contained
 * within a report.
 *
 * @author dk@motio.com
 *
 * Copyright 2001-2012, Motio Inc.
 * All rights reserved.
 */
function DisplaySqlUiController(){
}

DisplaySqlUiController.prototype = {

   /**
    * This method initializes the Display SQL UI.
    */
   initUi: function()
   {
      // The data store for the SQL Statement grid.
      this.dataStore = new Ext.data.JsonStore({
         // store configs
         autoDestroy: true,
//         url: ServerEnvironment.contextPath + '/secure/actions/ext/getReportProfileSql.do',
         storeId: 'displaySqlStore',
         // reader configs
         root: 'sqlStatements',
         idProperty: 'key',
         fields: ['key', 'sql']
      });

//      this.dataStore.on('load', this.onDataStoreLoaded, this);

      this.grid = new Ext.grid.GridPanel({
         region: 'center',
         layout: 'fit',
         store: this.dataStore,
         autoExpandColumn: 'sql',
         colModel: new Ext.grid.ColumnModel({
            defaults: {
               width: 120
            },
            columns: [{
               id: 'key',
               header: applicationResources.getProperty('rei.getsql.queryName'),
               menuDisabled: true,
               sortable: true,
               dataIndex: 'key'
            }, {
               id: 'sql',
               header: applicationResources.getProperty('rei.getsql.generatedSql'),
               menuDisabled: true,
               dataIndex: 'sql',
               sortable: false,
               renderer: function(aValue, aCell, aRecord, aRowIndex, aColIndex, aStore){
                  aCell.attr = 'style="white-space:normal"';
                  return aValue;
               }
            }]
         }),
         viewConfig: {
         },
         sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
         height: 500,
         frame: true,
//         loadMask: true,
         title: applicationResources.getProperty('profileWizard.banner') + ' - ' + applicationResources.getProperty('rei.getsql.generatedSql'),
         buttons: [{
            text: applicationResources.getProperty('button.close'),
            handler: function(aButton, aEventObject)
            {
               window.close();
            },
            icon:  ServerEnvironment.baseUrl + "/images/silkIcons/cancel.png"
         }],
         tbar: [{
            text: applicationResources.getProperty('button.copy'),
            handler: this.onCopyButtonClicked.createDelegate(this),
            icon:  ServerEnvironment.baseUrl + "/images/silkIcons/page_copy.png"
         }, '-'],
         iconCls: 'icon-grid'
      });

      this.grid.on('rowdblclick', this.onGridRowDblClicked, this);

      this.mainView = new Ext.Viewport({
//         title: 'view port',
         renderTo: Ext.getBody(),
         layout: 'border',
         items: [this.grid]
      });
   },


   onDataStoreLoaded: function(aDataStore, aRecords, aOptions)
   {
      alert(Ext.encode(aOptions));
   },

   /**
    * This method refreshes the SQL statements grid.
    */
   refreshGrid: function()
   {
      this.loadingMask = new Ext.LoadMask(Ext.getBody(), {msg: applicationResources.getProperty('general.loading')});
      this.loadingMask.show();

      RequestUtil.request({
         url: ServerEnvironment.contextPath + '/secure/actions/ext/getReportProfileSql.do',

         params: {
            targetId: document.forms[0].targetId.value,
            launchNodeType: document.forms[0].launchNodeType.value,
            rerId: document.forms[0].rerId.value,

            targetName: document.forms[0].targetName.value,
            reiXml: document.forms[0].reiXml.value
         },

         scope: this,


         /**
          * The method to be called upon receipt of the HTTP response. The callback is called regardless of success
          * or failure.
          *
          * @param aOptions (Object) - The parameter object passed to the request call.
          * @param aSuccess (Boolean) - True if the request succeeded.
          * @param aResponse (Object) - The XMLHttpRequest object containing the response data.
          */
         callback: function(aOptions, aSuccess, aResponse){
            this.loadingMask.hide();
         },


         /**
          * The method to be called upon success of the request.
          *
          * @param aResponse (Object) - The XMLHttpRequest object containing the response data.
          * @param aOptions (Object) - The parameter object passed to the request call.
          */
         success: function(aResponse, aOptions) {
            var responseObj = Ext.decode(aResponse.responseText);
            if (responseObj.succeeded)
            {
               this.grid.getStore().loadData(responseObj);
            }
            else
            {
               var failureCode = responseObj.failureReason.code;
               var failureMessage = responseObj.failureReason.message;
               Ext.Msg.show({
                  title: applicationResources.getProperty('display.sql.failure.title'),
                  msg: applicationResources.getProperty('display.sql.failure.message') + '<br/><br/>' + failureMessage + ' [' + failureCode + ']',
                  buttons: Ext.Msg.OK,
                  icon: Ext.MessageBox.ERROR
               });
            }
         },


         /**
          * The method to be called upon failure of the request.
          *
          * @param aResponse (Object) - The XMLHttpRequest object containing the response data.
          * @param aOptions (Object) - The parameter object passed to the request call.
          */
         failure: function(aResponse, aOptions) {
            var responseObj = Ext.encode(aResponse);

            Ext.Msg.show({
               title: applicationResources.getProperty('display.sql.failure.title'),
               msg: applicationResources.getProperty('display.sql.failure.message') + '<br/><br/>' + responseObj,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            });
//            alert('server-side failure with status code ' + aResponse.status);
         }
      });

//      this.dataStore.load({
//         params: {
//            targetId: document.forms[0].targetId.value,
//            launchNodeType: document.forms[0].launchNodeType.value,
//            rerId: document.forms[0].rerId.value,
//
//            targetName: document.forms[0].targetName.value,
//            reiXml: document.forms[0].reiXml.value,
//            defaultReiXml: document.forms[0].defaultReiXml.value
//         }
//      });
   },


   /**
    * This method displays the selected SQL statement in a pop up when the Copy button is pressed.
    *
    * @param aButton (Ext.Button) - Copy button.
    * @param aEventObject (Ext.EventObject) - A button click event.
    */
   onCopyButtonClicked: function(aButton, aEventObject)
   {
      this.showCopyWindow();
   },


   /**
    * This method displays the selected SQL statement in a pop up when a row in the grid is double clicked on.
    *
    * @param aGrid (Ext.grid.GridPanel) - A reference the grid clicked on.
    * @param aRowIndex (Number) - The index of the row clicked on.
    * @param aEventObject (Ext.EventObject) - The double click row event.
    */
   onGridRowDblClicked: function(aGrid, aRowIndex, aEventObject)
   {
      this.showCopyWindow();
   },


   /**
    * This method gets the currently selected row and displays a pop up window which allows the user to copy
    * the SQL statement contained in the currently selected row.
    */
   showCopyWindow: function()
   {
      if (this.grid.getSelectionModel().hasSelection())
      {
         // Get the highlighted SQL statement.
         var selectedRecord = this.grid.getSelectionModel().getSelected();
         var selectedSql = selectedRecord.get('sql');


         // Create the text area that will hold the SQL statement.
         var copyTextbox = new Ext.form.TextArea({
            readOnly: true,
            value: selectedSql
         });


         // Create the Select All button.
         var selectAllButton = new Ext.Button({
            text: applicationResources.getProperty('button.display.sql.select.all'),
            cls: 'x-btn-text-icon',
            icon:  ServerEnvironment.baseUrl + "/images/silkIcons/shading.png"
         });


         // Create the Copy window.
         this.copyWindow = new Ext.Window({
            title: applicationResources.getProperty('copy.window.title'),
            layout: 'fit',
            height: 400,
            width: 550,
            modal: true,
            copyTextbox: copyTextbox,
            items: [copyTextbox],
            tbar: [
               selectAllButton,
               '-'
            ],
            fbar: [{
               text: applicationResources.getProperty('button.close'),
               handler: function(aButton, aEventObject)
               {
                  this.copyWindow.close();
               }.createDelegate(this),
               icon:  ServerEnvironment.baseUrl + "/images/silkIcons/cancel.png"
            }]
         });


         // Attach the Select All button handler. It is performed here so that this.copyWindow and this.copyTextbox have
         // valid values.
         selectAllButton.on(
            'click',
            function(aButton, aEventObject)
            {
               this.copyTextbox.focus(true);
            },
            this.copyWindow
         );

         this.copyWindow.show(this);

         // Note: added a delay to fix a FF issue. FF needs a little extra time to render before highlighting text,
         // otherwise the highlight will disappear.
         this.copyWindow.copyTextbox.focus(true, 300);
      }
      else
      {
         Ext.Msg.alert(applicationResources.getProperty('display.sql.no.selection.title'),
                       applicationResources.getProperty('display.sql.no.selection.message'));
      }
   }

};
