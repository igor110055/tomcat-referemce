
Adf.UserPreference = Ext.extend(Ext.util.Observable, {

   // Date and Time format default value.
   SYSTEM_DEFAULT: 'DEFAULT',

   //com.focus.rcl.web.ui.ContentViewCategorizeByEnum
   CategoryViews: {
      FLAT_VIEW: 0,
      BY_SOURCE_REPORT: 1,
      BY_PROMPT_TYPE: 2,
      BY_TYPE: 3,
      BY_USAGE_FREQUENCY: 4,
      OVERLAY_VIEW: 5
   },


   OutputExpiration: {
      NEVER: -1,
      _7_DAYS: 7,
      _30_DAYS: 30,
      _90_DAYS: 90,
      _365_DAYS: 365,
      _548_DAYS: 548
   },


   Themes: {
      AERO: 'aero',
      VISTA: 'vista',
      GALDAKA: 'galdaka',
      GRAY: 'gray'
   },


   constructor: function(config) {
      this.addEvents({
         'categoryviewchanged' : true,
         'itemsperpagechanged' : true,
         'themechanged' : true,
         'dateformatchanged' : true,
         'timeformatchanged' : true
      });

      Ext.apply(this, config, {
         savedCategory: this.CategoryViews.FLAT_VIEW,
         numberOfDaysUntilOuputExpiration: this.OutputExpiration._30_DAYS,
         dateFormat: this.SYSTEM_DEFAULT,
         timeFormat: this.SYSTEM_DEFAULT,
         theme: this.Themes.AERO,
         confirmDeletes: false,
         itemsPerPage: 0,
         automaticallyLaunchReportViewer: false,
         launchViewerInSeparateWindows: false
      });


      // Copy configured listeners into *this* object so that the base class's
      // constructor will add them.
      this.listeners = config.listeners;

      // Call our superclass constructor to complete construction process.
      Adf.UserPreference.superclass.constructor.call(this, config)
   },


   getCategoryView: function()
   {
      return this.savedCategory;
   },


   setCategoryView: function(aCategoryView)
   {
      if (this.savedCategory != aCategoryView)
      {
         this.savedCategory = aCategoryView;
         this.fireEvent('categoryviewchanged', this);
      }
   },


   /**
    * This property returns the maximum number of rows displayed in grids.
    */
   getItemsPerPage: function()
   {
      return this.itemsPerPage;
   },


   /**
    * This property sets the maximum number of rows displayed in grids and fires a changed event to notify
    * grids to reset the number of rows displayed.
    *
    * @param aItemsPerPage - Maximum number of rows to display in a grid.
    */
   setItemsPerPage: function(aItemsPerPage)
   {
      if (this.itemsPerPage != aItemsPerPage)
      {
         this.itemsPerPage = aItemsPerPage;
         this.fireEvent('itemsperpagechanged', this);
      }
   },


   /**
    * This property returns the user's date format or DEFAULT if the system default date format is to be used.
    *
    * @return A date format string or 'DEFAULT'.
    */
   getDateFormat: function()
   {
      return this.dateFormat;
   },

   getExtDateFormat: function()
   {
      var format = this.getDateFormat();
      if (format == this.SYSTEM_DEFAULT)
      {
         format = ServerEnvironment.defaultDateFormat;
      }

      format = format.replace("MM", "m");
      format = format.replace("dd", "d");
      format = format.replace("yyyy", "Y");
      format = format.replace("yy", "y");

      return format;
   },

   /**
    * This property sets the user's date format.
    *
    * @param aDateFormat A date format string or 'DEFAULT' to use the system default.
    */
   setDateFormat: function(aDateFormat)
   {
      aDateFormat = Ext.isEmpty(aDateFormat) ? this.SYSTEM_DEFAULT : aDateFormat;
      if (this.dateFormat != aDateFormat)
      {
         this.dateFormat = aDateFormat;
         this.fireEvent('dateformatchanged', this);
      }
   },

   /**
    * This property returns the user's time format or DEFAULT if the system default time format is to be used.
    *
    * @return (String) A time format string or 'DEFAULT'.
    */
   getTimeFormat: function()
   {
      return this.timeFormat;
   },

   getExtTimeFormat: function()
   {
      var format = this.getTimeFormat();
      if (format == this.SYSTEM_DEFAULT)
      {
         format = ServerEnvironment.defaultTimeFormat;
      }
      format = format.replace("hh", "h");
      format = format.replace("HH", "H");
      format = format.replace("mm", "i");
      format = format.replace("ss", "s");

      return format;
   },

   /**
    * This property returns the user's time format.
    *
    * @param aTimeFormat (String) A time format string or 'DEFAULT' to use the system default.
    */
   setTimeFormat: function(aTimeFormat)
   {
      aTimeFormat = Ext.isEmpty(aTimeFormat) ? this.SYSTEM_DEFAULT : aTimeFormat;
      if (this.timeFormat != aTimeFormat)
      {
         this.timeFormat = aTimeFormat;
         this.fireEvent('timeformatchanged', this);
      }
   },


   getTheme: function()
   {
      return this.theme;
   },


   setTheme: function(aTheme)
   {
      if (this.theme != aTheme)
      {
         this.theme = aTheme;
         this.fireEvent('themechanged', this);
      }
   },


   /**
    * This property returns an indicator to confirm deletions before deleting.
    *
    * @return (Boolean) true to confirm deletions before deleting. Otherwise false is returned.
    */
   getConfirmDeletes: function()
   {
      return this.confirmDeletes;
   },


   /**
    * This property sets the confirm deletions before deleting indicator.
    *
    * @param aConfirmDeletes (Boolean) true to confirm deletions before deleting. Otherwise false.
    */
   setConfirmDeletes: function(aConfirmDeletes)
   {
      this.confirmDeletes = aConfirmDeletes;
   }

});

