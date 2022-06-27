/*
 * Copyright (c) 2001-2013. Motio, Inc.
 * All Rights reserved
 */

Adf.EmailPreferencesDialog = Ext.extend(Ext.Window, {
   constructor: function(aConfig) {

      this.formPanel = new Adf.AdfFormPanel({
         region: 'center',

         header: true,
         title: '.',

         bodyStyle: {
            padding: '10px'
         },

         defaults: {
            labelSeparator: '',
            width: 400
         },

         labelWidth: 160,

         items: [
            this.toList = new Ext.form.TextField({
               xtype: 'textfield',
               name: 'toList',
               vtype:'multipleEmail',
               allowBlank: false,
               fieldLabel: applicationResources.getProperty('emailViewer.to')
            }),

            this.ccList = new Ext.form.TextField({
               xtype: 'textfield',
               name: 'ccList',
               vtype:'multipleEmail',
               fieldLabel: applicationResources.getProperty('emailViewer.cc')
            }),

            this.bccList = new Ext.form.TextField({
               xtype: 'textfield',
               name: 'bccList',
               vtype:'multipleEmail',
               fieldLabel: applicationResources.getProperty('emailViewer.bcc')
            }),

            this.emailSubject = new Ext.form.TextField({
               xtype: 'textfield',
               name: 'subject',
               fieldLabel: applicationResources.getProperty('emailViewer.subject')
         }),

            this.emailBody = new Ext.form.TextArea({
            xtype: 'textarea',
            name: 'body',
            fieldLabel: applicationResources.getProperty('emailViewer.body')
            }),

            {
               xtype: 'checkboxgroup',
               fieldLabel: applicationResources.getProperty('emailViewer.availableAttachments'),

               items: [
                  this.pdfEnabled = new Ext.form.Checkbox({
                     xtype: 'checkbox',
                     name: 'pdfEnabled',
                     boxLabel: applicationResources.getProperty('emailViewer.pdf')
                  }),

                  this.xlsEnabled = new Ext.form.Checkbox({
                     xtype: 'checkbox',
                     name: 'xlsEnabled',
                     boxLabel: applicationResources.getProperty('emailViewer.xls')
                  }),

                  this.xls2007Enabled = new Ext.form.Checkbox({
                     xtype: 'checkbox',
                     name: 'xls2007Enabled',
                     boxLabel: applicationResources.getProperty('emailViewer.xls.2007')
                  }),

                  this.xmlEnabled = new Ext.form.Checkbox({
                     xtype: 'checkbox',
                     name: 'xmlEnabled',
                     boxLabel: applicationResources.getProperty('emailViewer.xml')
                  }),

                  this.csvEnabled = new Ext.form.Checkbox({
                     xtype: 'checkbox',
                     name: 'csvEnabled',
                     boxLabel: applicationResources.getProperty('emailViewer.csv')
                  })
               ]
            }, {
               xtype: 'checkbox',
            name: 'zipEnabled',
            boxLabel: applicationResources.getProperty('emailViewer.zipReports')
         }]
      });

      aConfig = Ext.apply({
         title: applicationResources.getProperty('emailViewer.title'),
         modal: true,
         width: 620,
         height: 360,
         layout: 'fit',
         items: [this.formPanel],
         buttons: [
            this.emailButton = new Ext.Button({
            text: applicationResources.getProperty('emailViewer.button.email'),
            scope: this,
            handler: this.onEmailButtonClicked
         }), {
            text: applicationResources.getProperty('emailViewer.button.cancel'),
            scope: this,
            handler: this.onCancelButtonClicked
         }]
      }, aConfig);

      Adf.EmailPreferencesDialog.superclass.constructor.call(this, aConfig);


   },

   show: function(aParams)
   {
      this.formPanel.getForm().load({
         url: ServerEnvironment.baseUrl + '/secure/actions/ext/displayEmailOptions.do',
         params: aParams,
         scope: this,
         success: this.onLoadSuccess
      });

      Adf.EmailPreferencesDialog.superclass.show.call(this);
   },

   onLoadSuccess: function(aForm, aAction)
   {

      // Display the list of reports to be emailed.
      if (!Ext.isEmpty(aAction.result.data.reportNames))
      {
         var title = '';
         for (var i = 0; i < aAction.result.data.reportNames.length; i++)
         {
            title += (i > 0 ? ', ' : '') + aAction.result.data.reportNames[i];
         }
         this.formPanel.setTitle(title);
      }


      this.pdfEnabled.setDisabled(!aAction.result.data.pdfEnabled);
      this.xlsEnabled.setDisabled(!aAction.result.data.xlsEnabled);
      this.xls2007Enabled.setDisabled(!aAction.result.data.xls2007Enabled);
      this.xmlEnabled.setDisabled(!aAction.result.data.xmlEnabled);
      this.csvEnabled.setDisabled(!aAction.result.data.csvEnabled);


      this.pdfEnabled.setValue(false);
      this.xlsEnabled.setValue(false);
      this.xls2007Enabled.setValue(false);
      this.xmlEnabled.setValue(false);
      this.csvEnabled.setValue(false);

      this.rerIds = aAction.result.data.rerIds;
      if (Ext.isEmpty(this.rerIds))
      {
         this.toList.setDisabled(true);
         this.ccList.setDisabled(true);
         this.bccList.setDisabled(true);
         this.emailSubject.setDisabled(true);
         this.emailBody.setDisabled(true);
         this.emailButton.setDisabled(true);
      }


      if (!Ext.isEmpty(aAction.result.data.message))
      {
         Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'), aAction.result.data.message);
      }
   },

   isFormValid: function()
   {
      var isValid = true;
      var errorMessage = "";

      if (!this.pdfEnabled.getValue() &&
         !this.xlsEnabled.getValue() &&
         !this.xls2007Enabled.getValue() &&
         !this.xmlEnabled.getValue() &&
         !this.csvEnabled.getValue())
      {
         errorMessage += applicationResources.getProperty("emailViewer.error.chooseOutputFormat")+"<br/>"
      }

      if (this.toList.getValue() == "" &&
         this.ccList.getValue() == "" &&
         this.bccList.getValue() == "")
      {
         errorMessage += applicationResources.getProperty("emailViewer.error.chooseRecipient")+"<br/>"
      }

      if (errorMessage != "")
      {
         Ext.Msg.alert(applicationResources.getProperty('general.dialog.alertTitle'), errorMessage);
         isValid = false;
      }

      return isValid;

   },

   onEmailButtonClicked: function(aButton, aEventObject)
   {
      if (this.isFormValid())
      {

         this.formPanel.getForm().submit({
            url: ServerEnvironment.baseUrl + '/secure/actions/ext/executeEmailOptions.do',
            params: {
               rerIds: this.rerIds
            },
            scope: this,
            success: this.onSubmitSuccess
         });
      }
   },

   onSubmitSuccess: function(aForm, aAction)
   {
      this.close();
   },

   onCancelButtonClicked: function(aButton, aEventObject)
   {
      this.close();
   }
});