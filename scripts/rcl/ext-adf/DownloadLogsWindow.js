var DownloadLogsWindow =
{
   launch: function( aExceptionReportId )
   {
      RequestUtil.request({
         url: '/secure/actions/exceptionReport/getAvailableServerLogs.do',

         success: function(aResponse)
         {
            var logFiles = Ext.decode(aResponse.responseText);

            if(aExceptionReportId)
            {
               var downloadReportBox = new Ext.form.Checkbox({
                  fieldLabel: "Exception Report",
                  boxLabel: "Download",
                  checked: true
               });

               var downloadReportBoxFieldSet = new Ext.form.FieldSet({
                  title: "Exception Report",
                  autoWidth: true,
                  autoHeight: true,
                  items: [
                     downloadReportBox
                  ]
               });
            }

            var gridStore = new Ext.data.JsonStore({
               fields:[
                  {name: 'name', type:'string'},
                  {name: 'path', type:'string'}
               ]
            });

            gridStore.loadData( logFiles );

            var checkboxSelectModel = new Ext.grid.CheckboxSelectionModel({
               checkOnly: true
            });

             var renderViewLink = function (aPath)
             {
                 var linkHtml = '<a href="' + contextPath + '/secure/actions/exceptionReport/openLogFile.do?logPathToView=' + EncodingUtil.base64Encode(aPath)
                         + '">View' + '</a>';
                 return linkHtml;
             };

            var checkboxGrid = new Ext.grid.GridPanel({
               store: gridStore,
               sm: checkboxSelectModel,
               border: false,
               viewConfig: {
                  autoFill:true
               },
               columns: [
                  checkboxSelectModel,
                   {header: 'Name', dataIndex: 'name', align:'left', sortable: true, menuDisabled: true},
                   {header: '', dataIndex: 'path', align:'left', renderer: renderViewLink, menuDisabled: true}
               ],
               autoHeight: true
            });

            var serverLogsFieldSet = new Ext.form.FieldSet({
               title: "Server Logs",
               autoWidth: true,
               autoHeight: true,
               items: [
                  checkboxGrid
               ]
            });


            var downloadWindow = new Ext.Window({
               title: 'Select the files you want to download',
               autoScroll: true,
               height: 400,
               width: 400,
               closable: true,
               modal: true,
               constrainHeader: true,
               items: (aExceptionReportId ? [downloadReportBoxFieldSet, serverLogsFieldSet] : [serverLogsFieldSet]),
               buttons:[{
                  text :'OK',
                  handler: function()
                  {
                     var selectionArray = checkboxSelectModel.getSelections();

                     var iframeHtml = '<form id="exceptionReportForm" method="POST"' +
                                      ' action="' + contextPath + '/secure/actions/exceptionReport/download.do">';

                     for (var i = 0; i < selectionArray.length; i++)
                     {
                        iframeHtml += '<input type="hidden" name="logFilePathsToDownload" value="' + selectionArray[i].data.path
                              + '"/>';
                     }

                     if ( aExceptionReportId && downloadReportBox.checked )
                     {
                        iframeHtml += '<input type="hidden" name="exceptionReportId" value="' + aExceptionReportId + '"/>';
                     }
                     iframeHtml += '</form>';

                     var div = document.createElement('div');
                     document.body.appendChild(div);
                     div.innerHTML = iframeHtml;
                     document.getElementById('exceptionReportForm').submit();
                     document.body.removeChild(div);

                     downloadWindow.close();
                  }
               },{
                  text: 'Cancel',
                  handler: function()
                  {
                     downloadWindow.close();
                  }
               }]
            });

            downloadWindow.show();
         }
      });
   }
};
