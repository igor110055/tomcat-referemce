Ext.ns("Adf");

Adf.AdfFormPanel = Ext.extend(Ext.FormPanel, {
   createForm: function(){
      var config = Ext.applyIf({listeners: {}}, this.initialConfig);
      return new Adf.BasicAdfForm(null, config);
   }
});
