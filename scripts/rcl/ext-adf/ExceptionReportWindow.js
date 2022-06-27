var ExceptionReportWindow =
{
   launch: function(aExceptionReport)
   {
      Ext.Msg.hide();

      var detailsHtml = "<div>An exception occurred: " + aExceptionReport.type + ".<br/><br/>";
      if(aExceptionReport.errorMessage)
      {
         detailsHtml += aExceptionReport.errorMessage + "<br/><br/>";
      }
      detailsHtml += "<a href='mailto:_self'>Notify Support - Please attach Logs and Exception Report.</a></div>";

      var exceptionReportWindow = new Ext.Window({
         title: "Exception",
         html: detailsHtml,
         modal: true,
         width: 500,
         constrainHeader: true,
         buttons: [{
            text: "Download",
            handler: function()
            {
               DownloadLogsWindow.launch( aExceptionReport.exceptionReportId  );
            }
         },{
            text: "Show Details",
            handler: function()
            {
               ExceptionReportWindow.launchDetailedExceptionReportWindow(aExceptionReport);
               exceptionReportWindow.close();
            }
         },{
            text: "OK",
            handler: function()
            {
               exceptionReportWindow.close();
            }
         }]
      });

      exceptionReportWindow.show();
   },

   launchDetailedExceptionReportWindow: function(aExceptionReport)
   {
      var detailsHtml = "An exception occurred: " + aExceptionReport.type + ".";
      if(aExceptionReport.errorMessage)
      {
         detailsHtml += "<br/><br/>" + aExceptionReport.errorMessage + "<br/><br/>";
      }

      detailsHtml += "Date: " + aExceptionReport.date + "<br/><br/>";
      if(aExceptionReport.namespace && aExceptionReport.username)
      {
         detailsHtml += "User: " + aExceptionReport.namespace + "/" + aExceptionReport.username + "<br/><br/>";
      }
      detailsHtml += "Location: " + aExceptionReport.location + "<br/><br/>";
      if(aExceptionReport.requestUri)
      {
         detailsHtml += "Request URI: " + aExceptionReport.requestUri + "<br/><br/>";
      }
      detailsHtml += "<a href='mailto:_self'>Notify Support - Please attach Logs and Exception Report.</a>";

      var detailsField = {
         xtype: "displayfield",
         title: "Exception Details",
         value: detailsHtml,
         autoScroll: true
      };

      if(aExceptionReport.formJson && aExceptionReport.formJson.length > 0)
      {
         var formValues = Ext.decode(aExceptionReport.formJson);
         var formValueHtml = "<table border='1' cellspacing='0'>";
         for(var formValueName in formValues)
         {
            formValueHtml += "<tr><td>" + formValueName + "</td><td>" + (formValues[formValueName] ? formValues[formValueName] : "&nbsp;") + "</td></tr>";
         }

         var formValuesField = {
            xtype: "displayfield",
            title: "Submitted Values",
            value: formValueHtml,
            autoScroll: true
         };
      }

      var stackTraceElements = aExceptionReport.stackTrace.split("\n");
      var stackTraceHtml = "";
      for(var i=0;i<stackTraceElements.length;i++)
      {
         stackTraceHtml += stackTraceElements[i] + "<br/>";
      }

      var stackTraceField = {
         xtype: "displayfield",
         title: "Stack Trace",
         value: stackTraceHtml,
         autoScroll: true
      };

      var detailedExceptionReportWindow = new Ext.Window({
         title: "Exception Report",
         layout: "fit",
         constrainHeader: true,
         items: [
            new Ext.TabPanel({
               items: (formValuesField ? [detailsField, formValuesField, stackTraceField] : [detailsField, stackTraceField]),
               activeTab: 0
            })],
         height: 500,
         width: 500,
         modal: true,
         buttons: [{
            text: "Download",
            handler: function()
            {
               DownloadLogsWindow.launch( aExceptionReport.exceptionReportId );
            }
         },{
            text: "OK",
            handler: function()
            {
               detailedExceptionReportWindow.close();
            }
         }]
      });

      detailedExceptionReportWindow.show();
   }
};
