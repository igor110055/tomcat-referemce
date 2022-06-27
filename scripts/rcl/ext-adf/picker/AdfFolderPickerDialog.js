
/**
 * Folder picker dialog used in manage folder and manage report screens
 *
 * @author sallman@motio.com
 * @since 2/23/11
 */


Adf.adfFolderPickerDialog = function()
{
   return{
      showFolderPickerWindow: function(aCallback)
      {
         var tree = new Adf.AdfFolderPickerTree({});

         var cognosPickerWindow = new Ext.Window({
            autoScroll: true,
            modal: true,
            title: applicationResources.getProperty('dialogs.picker.title'),
            closable: true,
            layout      : 'fit',
            width       : 300,
            height      : 400,
            closeAction : 'close',
            plain       : true,
            items       :[tree],
            buttons     : [
               {
                  text     : applicationResources.getProperty('button.Ok'),
                  handler  : function()
                  {
                     var node = tree.getSelectionModel().getSelectedNode();
                     if (JsUtil.isGood(node))
                     {
                        if (aCallback)
                        {
                           aCallback(node.attributes.id);
                        }
                     }
                     cognosPickerWindow.close();
                  }
               },
               {
                  text    : applicationResources.getProperty('button.close'),
                  handler : function()
                  {
                     cognosPickerWindow.close();
                  }
               }
            ]

         });
         cognosPickerWindow.show();
      }
   };
}();
