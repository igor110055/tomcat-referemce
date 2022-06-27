Ext.QuickTips.init();
Ext.enableFx = true;


/**
 * This class displays and controls the user preferences UI.
 */
function UserPreferencesUi()
{

}

/**
 * This method displays a user preferences UI.
 */
UserPreferencesUi.launch = function()
{
   RequestUtil.request({
      url: ServerEnvironment.contextPath+'/secure/actions/extEditUserPreference.do',
      success: function(aResponse, aOptions) {
         var formObj = Ext.decode(aResponse.responseText);

         var uiModel = new UserPreferencesModel();
         Ext.apply(uiModel, formObj);
         var uiController = new UserPreferencesUiController(uiModel);

         uiController.init();
      },
      failure: function(aResponse, aOptions){
         Ext.Msg.show({
            title: applicationResources.getProperty('userPrefs.heading'),
            msg: applicationResources.getProperty("userPrefs.serverError"),
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
         });
      }
   });
}


/**
 * This class is the Model for the User Preferences UI.
 */
function UserPreferencesModel()
{
   this.savedCategory;
   this.numberOfDaysUntilOuputExpiration = 30;
   this.dateFormat = 'DEFAULT';
   this.timeFormat = 'DEFAULT';
   this.theme;
   this.confirmDeletes = false;
   this.itemsPerPage = 0;
   this.automaticallyLaunchReportViewer = false;
   this.launchViewerInSeparateWindows = false;

   this.categorizeByOptions = [];
   this.allowedDateFormats = [];
   this.allowedTimeFormats = [];
//   this.expiryDays = [];
   this.initExpiryDays();
//   this.themes = [];
   this.initThemes();
}
UserPreferencesModel.prototype = {

   /**
    * This method initializes the list of available expiry days used to fill the output expiration combo.
    */
   initExpiryDays: function(){
      this.expiryDays = [];

      this.expiryDays.push({
         value: 7,
         text: String.format(applicationResources.getProperty('profileWizard.outputs.Days'), 7)
      });

      this.expiryDays.push({
         value: 30,
         text: String.format(applicationResources.getProperty('profileWizard.outputs.Days'), 30)
      });

      this.expiryDays.push({
         value: 90,
         text: String.format(applicationResources.getProperty('profileWizard.outputs.Days'), 90)
      });

      this.expiryDays.push({
         value: 365,
         text: applicationResources.getProperty('profileWizard.outputs.Year')
      });

      this.expiryDays.push({
         value: 548,
         text: String.format(applicationResources.getProperty('profileWizard.outputs.Years'), 1.5)
      });

      this.expiryDays.push({
         value: -1,
         text: applicationResources.getProperty('profileWizard.outputs.Never')
      });

   },


   /**
    * This method initializes the list of available themes used to fill the themes combo.
    */
   initThemes: function(){
      this.themes = [];

      this.themes.push({
         value: 'blue',
         text: 'Blue'
      });

      this.themes.push({
         value: 'gray',
         text: 'Grey'
      });
   }
}


/**
 * This class is the UI controller for the user preferences screen.
 *
 * @param aUiModel (UserPreferencesModel) - The data model for this screen.
 */
function UserPreferencesUiController(aUiModel)
{
   this.uiModel = aUiModel;
}
UserPreferencesUiController.prototype = {


   /**
    * This method initializes the user preferences screen. It creates all of the controls, attaches all of the
    * event handlers and loads the initial data from the UI model.
    */
   init: function(){

      var customLabelStyle = 'width: 360px;';

      // Folder views.
      this.savedCategory = new Ext.form.ComboBox({
         fieldLabel: applicationResources.getProperty('userPrefs.label.categorizeFolders'),
         labelSeparator: '',
//         labelStyle: customLabelStyle,

         triggerAction: 'all',
         lazyRender:true,
         mode: 'local',

         store: new Ext.data.JsonStore({
            autoDestroy: true,

            root: 'categorizeByOptions',
            idProperty: 'name',
            fields: ['value', 'displayValue']
         }),

         valueField: 'value',
         displayField: 'displayValue'

      });


      // Output expiration.
      this.numberOfDaysUntilOuputExpiration = new Ext.form.ComboBox({
         fieldLabel: applicationResources.getProperty('userPrefs.label.expire'),
         labelSeparator: '',
//         labelStyle: customLabelStyle,
         triggerAction: 'all',
         lazyRender:true,
         mode: 'local',

         store: new Ext.data.JsonStore({
            autoDestroy: true,

            root: 'expiryDays',
            idProperty: 'name',
            fields: ['value', 'text']
         }),

         valueField: 'value',
         displayField: 'text'

      });


      // Date format.
      this.dateFormat = new Ext.form.ComboBox({
         fieldLabel: applicationResources.getProperty('userPrefs.label.dateFormat'),
         labelSeparator: '',
//         labelStyle: customLabelStyle,

         triggerAction: 'all',
         lazyRender:true,
         mode: 'local',

         store: new Ext.data.JsonStore({
            autoDestroy: true,

            root: 'allowedDateFormats',
            idProperty: 'name',
            fields: ['value', 'displayValue']
         }),

         valueField: 'value',
         displayField: 'displayValue'

      });


      // Time format.
      this.timeFormat = new Ext.form.ComboBox({
         fieldLabel: applicationResources.getProperty('userPrefs.label.timeFormat'),
         labelSeparator: '',
//         labelStyle: customLabelStyle,

         triggerAction: 'all',
         lazyRender:true,
         mode: 'local',

         store: new Ext.data.JsonStore({
            autoDestroy: true,

            root: 'allowedTimeFormats',
            idProperty: 'name',
            fields: ['value', 'displayValue']
         }),

         valueField: 'value',
         displayField: 'displayValue'

      });


      // Theme.
      this.theme = new Ext.form.ComboBox({
         fieldLabel: applicationResources.getProperty('userPrefs.label.theme'),
         labelSeparator: '',
//         labelStyle: customLabelStyle,
         triggerAction: 'all',
         lazyRender:true,
         mode: 'local',

         store: new Ext.data.JsonStore({
            autoDestroy: true,

            root: 'themes',
            idProperty: 'name',
            fields: ['value', 'text']
         }),

         valueField: 'value',
         displayField: 'text'

      });


      // Confirm deletions.
      this.confirmDeletes = new Ext.form.Checkbox({
         fieldLabel: applicationResources.getProperty('userPrefs.label.delete'),
         boxLabel: applicationResources.getProperty('button.Yes'),
         labelSeparator: ''
//         ,
//         labelStyle: customLabelStyle
      });


      // The number of items to display per page.
      this.itemsPerPage = new Ext.form.NumberField({
         fieldLabel: applicationResources.getProperty('userPrefs.label.itemsPerPage'),
         labelSeparator: '',
         autoCreate: {tag: 'input', type: 'text', size: '10', autocomplete: 'off'},
//         labelStyle: customLabelStyle,
         enableKeyEvents: true,
         allowDecimals: false
      });


      // Automatically launcher report viewer indicator.
      this.automaticallyLaunchReportViewer = new Ext.form.Checkbox({
         fieldLabel: applicationResources.getProperty('userPrefs.label.autoLaunchReports'),
         boxLabel: applicationResources.getProperty('button.Yes'),
         labelSeparator: ''
//         ,
//         labelStyle: customLabelStyle
      });


      // Launch the report viewer in a separate window indicator.
      this.launchViewerInSeparateWindows = new Ext.form.Checkbox({
         fieldLabel: applicationResources.getProperty('userPrefs.label.launchOutputInNewViewer'),
         boxLabel: applicationResources.getProperty('button.Yes'),
         labelSeparator: ''
//         ,
//         labelStyle: customLabelStyle
      });


      this.mainPanel = new Ext.form.FormPanel({
         labelWidth: 360,
         bodyStyle: {
            padding: '10px'
         },
         items: [
            this.savedCategory,
            this.numberOfDaysUntilOuputExpiration,
            this.dateFormat,
            this.timeFormat,
            this.theme,
            this.confirmDeletes,
            this.itemsPerPage,
            this.automaticallyLaunchReportViewer,
            this.launchViewerInSeparateWindows
         ]
      });

      this.saveButton = new Ext.Button({
         text: applicationResources.getProperty('button.Save')
      });

      this.cancelButton = new Ext.Button({
         text: applicationResources.getProperty('button.Cancel')
      });


      // User preferences window.
      this.ui = new Ext.Window({
         title: applicationResources.getProperty('userPrefs.heading'),
         header: false,
         closable: false,
         resizable: false,
         modal: true,
         height: 400,
         width: 620,
         layout: 'fit',
         items: this.mainPanel
         ,

         fbar: [this.saveButton, this.cancelButton]
      });


      // Attach the even handlers.
      this.saveButton.on('click', this.onSaveButtonClicked, this);
      this.cancelButton.on('click', this.onCancelButtonClicked, this);
      this.itemsPerPage.on('keydown', this.onItemsPerPageKeyDown, this);


      // Populate drop down list.
      this.savedCategory.getStore().loadData(this.uiModel);
      this.numberOfDaysUntilOuputExpiration.getStore().loadData(this.uiModel);
      this.dateFormat.getStore().loadData(this.uiModel);
      this.timeFormat.getStore().loadData(this.uiModel);
      this.theme.getStore().loadData(this.uiModel);

      this.loadData();
      this.ui.show();

   },


   /**
    * This method populates the UI preferences values.
    */
   loadData: function()
   {
      this.savedCategory.setValue(this.uiModel.savedCategory);
      this.numberOfDaysUntilOuputExpiration.setValue(this.uiModel.numberOfDaysUntilOuputExpiration);
      this.dateFormat.setValue(this.uiModel.dateFormat);
      this.timeFormat.setValue(this.uiModel.timeFormat);
      this.theme.setValue(this.uiModel.theme);
      this.confirmDeletes.setValue(this.uiModel.confirmDeletes);
      this.itemsPerPage.setValue(this.uiModel.itemsPerPage);
      this.automaticallyLaunchReportViewer.setValue(this.uiModel.automaticallyLaunchReportViewer);
      this.launchViewerInSeparateWindows.setValue(this.uiModel.launchViewerInSeparateWindows);
   },


   /**
    * This method handles the save button click event. It haves the user preferences and closes the window.
    *
    * @param aButton (Ext.Button) - The save button.
    * @param aEventObject (Ext.EventObject) - The click event.
    */
   onSaveButtonClicked: function(aButton, aEventObject)
   {
      this.saveUserPreferences(true);
   },


   /**
    * This method saves the user preferences.
    *
    * @param aCloseWindow (boolean) - An indicator if the window should be closed after the data is successfully saved.
    */
   saveUserPreferences: function(aCloseWindow)
   {
      if (this.beforeSubmit())
      {
         var userPreferenceForm = {
            savedCategory: this.uiModel.savedCategory,
            numberOfDaysUntilOuputExpiration: this.uiModel.numberOfDaysUntilOuputExpiration,
            dateFormat: this.uiModel.dateFormat,
            timeFormat: this.uiModel.timeFormat,
            theme: this.uiModel.theme,
            confirmDeletes: this.uiModel.confirmDeletes,
            itemsPerPage: this.uiModel.itemsPerPage,
            automaticallyLaunchReportViewer: this.uiModel.automaticallyLaunchReportViewer,
            launchViewerInSeparateWindows: this.uiModel.launchViewerInSeparateWindows
         };

         RequestUtil.request({
            url: ServerEnvironment.contextPath+'/secure/actions/extSaveUserPreference.do',
            params: userPreferenceForm,
            closeWindow: aCloseWindow,
            success: this.onSubmitSuccess.createDelegate(this),
            failure: function(aResponse, aOptions){
               Ext.Msg.show({
                  title: applicationResources.getProperty('userPrefs.heading'),
                  msg: applicationResources.getProperty("userPrefs.serverError"),
                  buttons: Ext.MessageBox.OK,
                  icon: Ext.MessageBox.ERROR
               });
            }
         });
      }
   },


   /**
    * This method processes the successful response when the user preferences are submitted to the server. It
    * runs the javascript code returned, closes the window if necessary, and displays a successful message.
    *
    * @param aResponse - Submitted ajax response.
    * @param aOptions - Ajax parameters.
    */
   onSubmitSuccess: function(aResponse, aOptions)
   {
      var response = Ext.decode(aResponse.responseText);

      eval(response.clientJs);

      if (aOptions.closeWindow)
      {
         this.ui.close();
      }

      FadeMessageController.getInstance().showFadeMessage(response.saveMessage, 3000);

      // Update global user preferences.
      if (UserPreference)
      {
         var settingsChangedEvent = {
            type: 'userPreferenceChanged',
            itemsPerPageChanged: false,
            dateFormatChanged: false,
            timeFormatChanged: false,
            confirmDeletesChanged: false,
            categoryViewChanged: false
         };
         var settingsChanged = false;

         if (UserPreference.theme != this.uiModel.theme)
         {
            document.location.reload(true);
         }

         // Check for an items per page change.
         if (UserPreference.getItemsPerPage() != this.uiModel.itemsPerPage)
         {
            UserPreference.setItemsPerPage(this.uiModel.itemsPerPage);
            settingsChangedEvent.itemsPerPageChanged = true;
            settingsChanged = true;
            Adf.frameSetUi.eventChannel.publish({
               type: 'itemsPerPageChanged'
            });
         }

         // Check for a category view change.
         if (UserPreference.getCategoryView() != this.uiModel.savedCategory)
         {
            UserPreference.setCategoryView(this.uiModel.savedCategory);
            settingsChangedEvent.categoryViewChanged = true;
            settingsChanged = true;
         }


         // Check for a date format change.
         if (UserPreference.getDateFormat() != this.uiModel.dateFormat)
         {
            UserPreference.setDateFormat(this.uiModel.dateFormat);
            settingsChangedEvent.dateFormatChanged = true;
            settingsChanged = true;
         }

         // Check for a time format change.
         if (UserPreference.getTimeFormat() != this.uiModel.timeFormat)
         {
            UserPreference.setTimeFormat(this.uiModel.timeFormat);
            settingsChangedEvent.timeFormatChanged = true;
            settingsChanged = true;
         }

         // Check for confirm deletion changes.
         if (UserPreference.getConfirmDeletes() != this.uiModel.confirmDeletes)
         {
            UserPreference.setConfirmDeletes(this.uiModel.confirmDeletes);
            settingsChangedEvent.confirmDeletesChanged = true;
            settingsChanged = true;
         }

         // Notify the rest of UI that some user preference settings have changed by broadcasting a settings
         // changed message.
         if (settingsChanged)
         {
            Adf.frameSetUi.eventChannel.publish(settingsChangedEvent);
         }
      }
   },


   /**
    * This method validates and stores the current UI values in the data model.
    *
    * @return - true if the values are valid. Otherwise false is returned.
    */
   beforeSubmit: function()
   {
      var isValid = true;

      this.uiModel.savedCategory = this.savedCategory.getValue();
      this.uiModel.numberOfDaysUntilOuputExpiration = this.numberOfDaysUntilOuputExpiration.getValue();
      this.uiModel.dateFormat = this.dateFormat.getValue();
      this.uiModel.timeFormat = this.timeFormat.getValue();
      this.uiModel.theme = this.theme.getValue();
      this.uiModel.confirmDeletes = this.confirmDeletes.getValue();
      this.uiModel.itemsPerPage = this.itemsPerPage.getValue();
      this.uiModel.automaticallyLaunchReportViewer = this.automaticallyLaunchReportViewer.getValue();
      this.uiModel.launchViewerInSeparateWindows = this.launchViewerInSeparateWindows.getValue();

      return isValid;
   },


   /**
    * This method handles the click event when the cancel button is pressed. It closes the user preference screen.
    *
    * @param aButton - The cancel button.
    * @param aEventObject - The click event.
    */
   onCancelButtonClicked: function(aButton, aEventObject)
   {
      this.ui.close();
   },


   /**
    * This method handles the key down event for the items per page text field. It submits the user permissions
    * when the Enter key is pressed while the items per page field has the focus.
    *
    * @param aTextField - The items per page text field.
    * @param aEventObject - The key down event.
    */
   onItemsPerPageKeyDown: function(aTextField, aEventObject)
   {
      if (aEventObject.getCharCode() == 13)
      {
         this.saveUserPreferences(false);
      }
   }




}