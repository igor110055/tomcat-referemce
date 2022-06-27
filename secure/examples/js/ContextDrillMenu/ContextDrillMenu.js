
function MenuFactory()
{
}

MenuFactory.prototype.createMenu_hardCoded = function(aDrillContext)
{
   var myMenu = new Ext.menu.Menu({

      id : 'myMenu',
      items:
              [
                  '<b>Subcategories</b>',
                  new Ext.menu.Item(
                  {
                     text: 'Subcategory 1',
                     useValue: 's1',
                     handler: itemHandler,
                     menu:
                     {
                        items:
                            [
                              '<b>Subcategory 1 - Brands',
                              new Ext.menu.Item(
                              {
                                 text: 'Brand 23',
                                 useValue: 'b23',
                                 handler: itemHandler
                              }),
                              new Ext.menu.Item(
                              {
                                 text: 'Brand 29',
                                 useValue: 'b29',
                                 handler: itemHandler,
                                 menu:
                                 {
                                    items:
                                    [
                                       '<b>Brand 29 - Items</b>',
                                       new Ext.menu.Item(
                                       {
                                          text: 'Item 5',
                                          useValue: 'i5',
                                          handler: itemHandler
                                       }),
                                       new Ext.menu.Item(
                                       {
                                          text: 'Item 54',
                                          useValue: 'i54',
                                          handler: itemHandler
                                       }),
                                    ]

                               }
                            }),
                            new Ext.menu.Item(
                            {
                               text: 'Brand 45',
                               useValue: 'b45',
                               handler: itemHandler
                            }),
                           ]
                     }
                  }),
                  new Ext.menu.Item(
                  {
                     text: 'Subcategory 2',
                     useValue: 's2',
                     handler: itemHandler,
                     menu:
                     {
                        items:
                        [
                           '<b>Subcategory 2 - Brands</b>',
                           new Ext.menu.Item(
                           {
                               text: 'Brand 11',
                               useValue: 'b11',
                               handler: itemHandler
                           }),
                           new Ext.menu.Item(
                           {
                              text: 'Brand 21',
                              useValue: 'b21',
                              handler: itemHandler
                           }),
                        ]
                     }
                  })
              ]
   });

   myMenu.showAt(aDrillContext.showAt);
};

MenuFactory.prototype.ajaxSuccessCallback = function(aResponse, anOptions)
{
   if(aResponse.responseText != null)
   {
//      alert(aResponse.responseText);

      var queryResults = eval(aResponse.responseText);
      JsUtil.debugObject('', queryResults);

   }
};

MenuFactory.prototype.psuedoAjaxSuccessCallback = function(aResponse, aDrillContext)
{
   var queryResults = eval(aResponse.responseText);

   var myMenu = new Ext.menu.Menu({});

   this.constructMenu(myMenu, queryResults, aDrillContext);

   myMenu.showAt(aDrillContext.showAt);

};

/*
 * private
 */
MenuFactory.prototype.constructMenu = function(aMenu, aQueryResults, aDrillContext)
{

   for(var i=0; i < aQueryResults.length; i++)
   {
      var resultItem = aQueryResults[i];
//      alert(resultItem.text);
      if(resultItem.menuLabel != undefined && resultItem.menuLabel == true)
      {
//         alert('menuLabel...');
         var item = new Ext.menu.TextItem('<b>'+resultItem.text+'</b>');
         aMenu.addItem(item);
      }
      else
      {
//         alert('item...');
         var item = new Ext.menu.Item({text: resultItem.text, handler: aDrillContext.itemHandler, useValue: resultItem.useValue});

         if(resultItem.menu != undefined)
         {
            var subMenu = new Ext.menu.Menu({});
            this.constructMenu(subMenu, resultItem.menu.items, aDrillContext); //recursive call
            item.menu = subMenu;
         }
         aMenu.addItem(item);

      }
   }
}

MenuFactory.prototype.ajaxFailureCallback = function(aResponse, anOptions)
{
   alert("a failure occurred [" + aResponse.status + ": " +aResponse.statusText + "]");
};



MenuFactory.prototype.createMenu_ajax = function(aDrillContext)
{
//   alert("will create menu for " + aDrillContext.contextId);

//   RequestUtil.request({
//      url: aDrillContext.url,
//      params: aDrillContext,
//      method: "GET",
//      success: myMenuFactory.ajaxSuccessCallback,
//      failure: myMenuFactory.ajaxFailureCallback
//   });

   var psuedoResponse = {responseText: sampleData}
   this.psuedoAjaxSuccessCallback(psuedoResponse, aDrillContext);


};

//sample JSON from a psuedo ajax call
var sampleData = "["+
                 "{menuLabel: true, text: 'Subcategories'},"+
                 "{text: 'Subcategory 1', useValue: 's1', menu: "+
                     "{ items: "+
                        "["+
                           "{menuLabel: true, text: 'Brands'},"+
                           "{text: 'Brand 1', useValue: 'b1'},"+
                           "{text: 'Brand 2', useValue: 'b2', menu: "+
                                 "{ items: "+
                                    "["+
                                       "{menuLabel: true, text: 'Items'},"+
                                       "{text: 'Item 54', useValue: 'i54'},"+
                                       "{text: 'Items 108', useValue: 'i108'}"+
                                    "]"+
                                 "}"+
                           "},"+
                           "{text: 'Brand 3', useValue: 'b3'},"+
                           "{text: 'Brand 5', useValue: 'b5'},"+
                           "{text: 'Brand 8', useValue: 'b8'},"+
                           "{text: 'Brand 11', useValue: 'b11'},"+
                           "{text: 'Brand 19', useValue: 'b19'},"+
                           "{text: 'Brand 30', usevalue: 'b30'}"+
                        "]"+
                     "}"+
                 "},"+
                 "{text: 'Subcategory 2', useValue: 's2', menu: "+
                     "{ items: "+
                        "["+
                           "{menuLabel: true, text: 'Brands'},"+
                           "{text: 'Brand 53', useValue: 'b53'},"+
                           "{text: 'Brand 101', useValue: 'b101'}"+
                        "]"+
                     "}"+
                 "}"+
                 "]";