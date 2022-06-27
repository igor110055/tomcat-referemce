function BurstSelector(aRerSummary)
{
   this.rerSummary = aRerSummary;

}

var pageLimit = 10;


BurstSelector.prototype.setupXmlStore = function (aReportInstanceId)
{
   var httpProxy = new Ext.data.HttpProxy(
   {
      url: ServerEnvironment.contextPath + '/rs/report/burstSlices/' + aReportInstanceId,
      method : 'GET'
   });

   var xmlReader = new Ext.data.XmlReader({
      record: 'burstGroup',
      totalProperty : 'total',
      id            : '@id'
   }, [
      {name: 'discriminator', mapping: '@discriminator'}
      //      {name: 'id', mapping:'@id'}
   ]);

   this.store = new Ext.data.Store({
      proxy : httpProxy,
      baseParams : {limit : pageLimit},
      reader : xmlReader,
      listeners :
      {
         beforeLoad : function(store, options)
         {
            addExcludedValues(options)
         }
      }
   });

}

function addExcludedValues(options)
{
   var selectedView = Ext.getCmp('selected-listview');
   if (JsUtil.isGood(selectedView))
   {
      var selected = selectedView.store.getRange();

      var selectedIds = new Array();
      Ext.each(selected, function(item, fn, scope)
      {
         selectedIds.push(item.id);
      });
      if (selectedIds.length > 0)
         options.params.ex = selectedIds;
   }
}


BurstSelector.prototype.setupAvailablePanel = function()
{


   var searchBar = new Ext.app.SearchField({
      store: this.store,
      width : 175
   });

   var availableListView = new Ext.list.ListView({
      id   : 'available-listview',
      store: this.store,
      multiSelect: true,
      reserveScrollOffset: true,
      hideHeaders : true,
      columnSort : false,
      columns: [{
         dataIndex: 'discriminator', id : 'id'
      }],
      listeners :
      {
         dblclick : add
      }

   });


   var tb = new Ext.Toolbar(
   {
   });
   //   tb.add('Search');
   //   tb.add(' ');
   tb.add(searchBar);

   var availablePanel = new Ext.Panel({
      id:'available-panel',
      layout:'fit',
      items : availableListView,
      tbar: tb
   });

   return availablePanel;
}

BurstSelector.prototype.setupSelectedPanel = function()
{
   var selectedArray = new Array();
   var selectedStore = new Ext.data.ArrayStore(
   {
      storeId : 'selected-store',
      idIndex : 0,
      fields  : [
         {name : 'id'},
         {name : 'discriminator'}],
      data    : selectedArray
   });

   var listView = new Ext.list.ListView({
      id   : 'selected-listview',
      store: selectedStore,
      multiSelect: true,
      reserveScrollOffset: true,
      columnSort : false,
      columns: [{
         dataIndex: 'discriminator', id : 'id'
      }],
      listeners :
      {
         dblclick : remove
      }

   });


   var selectedPanel = new Ext.Panel({
      id:'selected-panel',
      layout:'fit',
      store : selectedStore,
      items : listView

   });

   return selectedPanel;
}

/**
 * toggles the submit button on and off depending on whether or not a burst slice is selected 
 * @param aContainer
 */
function handleSubmitState()
{
   var aContainer = Ext.getCmp('selected-listview');
   var viewButton = Ext.getCmp('view-button');
   var records = aContainer.getStore();
   if (records.getCount() == 0)
      viewButton.disable();
   else
      viewButton.enable();
}

BurstSelector.prototype.viewSelectedOutputs = function (button, event)
{
   //get the report output keys in the selected listview
   var aContainer = Ext.getCmp('selected-listview');
   var store = aContainer.getStore();

   store.each(
           function(record)
           {
              launchReportViewer([this.rerSummary.rerId], null, null, null, record.get('discriminator'));
           }, this);


}

function add(aButton, aEvent)
{
   var listView = Ext.getCmp('available-listview');


   var selected = listView.getSelectedRecords();
   var store = listView.getStore();
   store.remove(selected);

   var selectedView = Ext.getCmp('selected-listview');
   selectedView.getStore().add(selected);
   handleSubmitState();


}

function remove(aButton, aEvent)
{
   var listView = Ext.getCmp('available-listview');
   var selectedView = Ext.getCmp('selected-listview');

   var selected = selectedView.getSelectedRecords();
   var store = selectedView.getStore();
   store.remove(selected);
   listView.getStore().add(selected);
   handleSubmitState();
}

BurstSelector.prototype.show = function()
{


   this.setupXmlStore(this.rerSummary.reportInstanceId);
   var availablePanel = this.setupAvailablePanel();
   availablePanel.region = 'west';
   availablePanel.width = 180;

   var selectedPanel = this.setupSelectedPanel();
   selectedPanel.region = 'east';
   selectedPanel.width = 180;


   var pagingToolbar = new Ext.PagingToolbar({
      store: this.store,
      pageSize: pageLimit,
      displayInfo: true,
      displayMsg: 'Report Outputs {0} - {1} of {2}',
      emptyMsg: "No report output to display"
   });

   var imageDir = ServerEnvironment.contextPath + '/scripts/lib/ext/resources/images';
   var buttonPanel = new Ext.Panel(
   {
      //      layout : {type : 'vbox' , padding : '5', align : 'center'},
      layout : 'absolute',
      items : [
         {
            y     : 50,
            xtype : 'button',
            icon: imageDir + '/default/grid/page-next.gif',
            handler : add},
         {
            y     : 75,
            xtype : 'button',
            icon: imageDir + '/default/grid/page-prev.gif',
            handler : remove}
      ]
   });
   buttonPanel.region = 'center';

   var submitButton = new Ext.Button(
   {

      id  : 'view-button',
      text:'Submit',
      disabled:true

   });

   submitButton.on('click', this.viewSelectedOutputs, this);


   var closeButton = new Ext.Button(
   {
      text: 'Close',
      handler: function()
      {
         burstSelectorWindow.hide();
      }
   });

   var burstSelectorWindow = new Ext.Window(
   {
      id    : 'grid-panel-window',
      title : this.rerSummary.name,
      resizable : false,
      closable : true,
      width    : 400,
      height   : 325,
      plain    : true,
      //      animateTarget : Ext.getDom('rerGrid'),
      layout   : 'border',
      items    : [
         availablePanel,
         selectedPanel,
         buttonPanel

      ],
      buttons: [submitButton,closeButton],
      bbar: pagingToolbar

   });


   this.store.load(
   {
      params   :
      {
         start:0,
         limit:pageLimit
      },
      callback : function(r, options, success)
      {
         burstSelectorWindow.show();
      }
   });


}

//custom search field
Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
   initComponent : function()
   {
      Ext.app.SearchField.superclass.initComponent.call(this);
      this.on('specialkey', function(f, e)
      {
         if (e.getKey() == e.ENTER)
         {
            this.onTrigger2Click();
         }
      }, this);
   },

   validationEvent:false,
   validateOnBlur:false,
   trigger1Class:'x-form-clear-trigger',
   trigger2Class:'x-form-search-trigger',
   hideTrigger1:true,
   //   width:100,
   hasSearch : false,
   paramName : 'filter',

   onTrigger1Click : function()
   {
      if (this.hasSearch)
      {
         this.el.dom.value = '';
         var o = {start: 0};

         this.store.baseParams = this.store.baseParams || {};
         this.store.baseParams[this.paramName] = '';
         this.store.reload({params:o});
         this.triggers[0].hide();
         this.hasSearch = false;
      }
   },

   onTrigger2Click : function()
   {
      var v = this.getRawValue();
      if (v.length < 1)
      {
         this.onTrigger1Click();
         return;
      }
      var o = {start: 0};
      this.store.baseParams = this.store.baseParams || {};
      this.store.baseParams[this.paramName] = v;
      this.store.reload({params:o});
      this.hasSearch = true;
      this.triggers[0].show();
   }
});