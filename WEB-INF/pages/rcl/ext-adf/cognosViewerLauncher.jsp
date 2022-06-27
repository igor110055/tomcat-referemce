<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

   <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/ServerEnvironment.js"></script>

   <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/i18n/Localization/<rcl:currentLocale/>.js"></script>
   <script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/reportViewer/LaunchReportViewer.js"></script>


   <script type="text/javascript">
        /* <![CDATA[ */
      ServerEnvironment.baseUrl = location.protocol + '//' + window.location.host + '<%=request.getContextPath()%>';
        /* ]]> */
   </script>

   <%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>


   <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/ext-all.css"/>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/adapter/ext/ext-base.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath() %>/scripts/rcl/ext-adf/common/ext-overrides.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/RequestUtil.js"></script>

   <script type="text/javascript" xml:space="preserve">
   </script>

</head>

<body>
<input type='hidden' name='rerId' id='rerId' value='<c:out value="${param.rerId}"/>'/>
<input type='hidden' name='rerStatus' id='rerStatus' value=''/>

<script type="text/javascript">
   function poll()
   {
      RequestUtil.request({
         method: 'GET',
         url: ServerEnvironment.baseUrl + "/rs/report/pollLaunchViewerResult",
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
         },
         params: {
            rerId: Ext.get('rerId').getValue(true)
         },
         success: function(aResponse, aOptions)
         {
//            alert("aResponse.responseText="+aResponse.responseText);
            var results = Ext.decode(aResponse.responseText);

            for (var i = 0; i < results.cognosViewerLaunchInfo.length; i++)
            {
               Ext.get('rerStatus').dom.value = results.cognosViewerLaunchInfo[i].rerStatus;

               if (results.cognosViewerLaunchInfo[i].rerStatus == 'FINISHED')
               {
                  // launch Cognos Viewer.
                  launchViewer(results.cognosViewerLaunchInfo[i]);
               }
               else
               {
                  // Re-poll.
                  poll.defer(300);
               }
            }
         }
      });

   }


   function launchViewer(aCognosLaunchInfo)
   {

      if (aCognosLaunchInfo.rerStatus == 'FINISHED')
      {
         // Cognos Viewer.


         // Create a form in the new browser window to submit Cognos configuration data and report
         // parameters to the Cognos Viewer.
         Ext.getCmp('mainPanel').cognosViewerUrl = aCognosLaunchInfo.gatewayUri;

         // Add the Cognos configuration parameters to the form.
         Ext.getCmp('m_passportID').setValue(aCognosLaunchInfo.camid);
         Ext.getCmp('ui.object').setValue(aCognosLaunchInfo.modifiedReportPath);
         Ext.getCmp('run.outputFormat').setValue(aCognosLaunchInfo.outputFormat);
         Ext.getCmp('ui.outputLocale').setValue(aCognosLaunchInfo.locale);
         Ext.getCmp('run.outputLocale').setValue(aCognosLaunchInfo.locale);

         // Submit.
         Ext.getCmp('mainPanel').getForm().url = Ext.getCmp('mainPanel').cognosViewerUrl;
         Ext.getCmp('mainPanel').getForm().submit();
      }
   }


   Ext.onReady(function(){

      var mainViewPanel = new Ext.Viewport({
         layout: 'border',
         renderTo: Ext.getBody(),
         items: [{
            xtype: 'form',
            id: 'mainPanel',
            standardSubmit: true,
            region: 'center',
            items: [{
               xtype: 'hidden',
               name: 'b_action',
               id: 'b_action',
               fieldLabel: 'b_action',
               value: 'cognosViewer'
            },{
               xtype: 'hidden',
               name: 'm_passportID',
               id: 'm_passportID',
               fieldLabel: 'm_passportID',
               value: ''
            },{
               xtype: 'hidden',
               name: 'ui.action',
               id: 'ui.action',
               fieldLabel: 'ui.action',
               value: 'run'
            },{
               xtype: 'hidden',
               name: 'ui.object',
               id: 'ui.object',
               fieldLabel: 'ui.object',
               value: ''
            },{
               xtype: 'hidden',
               name: 'run.outputFormat',
               id: 'run.outputFormat',
               fieldLabel: 'run.outputFormat',
               value: ''
            },{
               xtype: 'hidden',
               name: 'ui.outputLocale',
               id: 'ui.outputLocale',
               fieldLabel: 'ui.outputLocale',
               value: ''
            },{
               xtype: 'hidden',
               name: 'run.outputLocale',
               id: 'run.outputLocale',
               fieldLabel: 'run.outputLocale',
               value: ''
            },{
               xtype: 'hidden',
               name: 'run.prompt',
               id: 'run.prompt',
               fieldLabel: 'run.prompt',
               value: 'false'
            },{
               xtype: 'hidden',
               name: 'cv.header',
               id: 'cv.header',
               fieldLabel: 'cv.header',
               value: 'false'
            },{
               xtype: 'hidden',
               name: 'run.verticalElements',
               id: 'run.verticalElements',
               fieldLabel: 'run.verticalElements',
               value: ServerEnvironment.rerRowsPerPage
            }]

         }]
      });


      Ext.getCmp('mainPanel').myMask = new Ext.LoadMask(Ext.getBody(), {msg:applicationResources.getProperty('general.pleaseWait')});
      Ext.getCmp('mainPanel').myMask.show();

      poll();
   });
</script>

</body>

</html>