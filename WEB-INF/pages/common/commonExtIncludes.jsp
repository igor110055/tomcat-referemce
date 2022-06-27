<%@ page import="com.focus.rcl.security.IRclUser" %>
<%@ page import="com.focus.rcl.web.ui.ContentViewFilterByEnum" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="com.focus.rcl.RclEnvironment" %>
<%@ page import="com.focus.rcl.web.util.RclWebUtil" %>

<%--
   This file contains common includes which are used from most JSP's in
   the application.   Its meant to be included in the <head> element of
   other JSP's.

   ---------------------------
   @author : Lance Hankins

   $Id: commonExtIncludes.jsp 9255 2015-07-07 23:34:09Z sallman $

--%>
<%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
<script type="text/javascript">
   /* <![CDATA[ */
   ServerEnvironment.defaultDateFormat = '<%=RclEnvironment.getDefaultDateFormat()%>';
   ServerEnvironment.defaultTimeFormat = '<%=RclEnvironment.getDefaultTimeFormat()%>';
   <%
      ContentViewFilterByEnum sessionFilterByView = (ContentViewFilterByEnum)session.getAttribute(ContentViewFilterByEnum.class.getName());
      if (sessionFilterByView != null)
      {
         out.println("ServerEnvironment.contentFilterBy = '" + sessionFilterByView.getName() + "';");
      }
      else
      {
         out.println("ServerEnvironment.contentFilterBy = null;");
      }
   %>
   ServerEnvironment.isAllowedDebugRers = <%=RclWebUtil.isAllowedDebugRers()%>
   /* ]]> */
</script>

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/ext-all.css"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/scripts/lib/ext/resources/css/xtheme-<%=authentication.getRclUser().getPreferences().getTheme()%>.css" />

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/ext-adf.css"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/styles/rcl/ext-adf/fileuploadfield.css"/>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/lib/ext/ext-all-debug.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/ux-all-debug.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/scripts/rcl/ext-adf/common/ext-overrides.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/RequestUtil.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/AdfFacade.js"></script>

<script type="text/javascript">
   var Adf;
   Ext.namespace('Adf');

   Ext.BLANK_IMAGE_URL = '<%=request.getContextPath()%>/images/blank-1x1.gif';

   // Listen to exception event fired by all proxies
   // handle timeouts and anything else that needs handlin'
   Ext.data.DataProxy.on('exception', RequestUtil.handleDataProxyException);

   // Update the EXTJS Message Box button text to the local language.
   Ext.MessageBox.buttonText.ok = applicationResources.getProperty('button.Ok');
   Ext.MessageBox.buttonText.cancel = applicationResources.getProperty('button.Cancel');
   Ext.MessageBox.buttonText.yes = applicationResources.getProperty('button.Yes');
   Ext.MessageBox.buttonText.no = applicationResources.getProperty('button.No');

   // EXTJS Localization.
   Ext.override(Ext.form.TextField, {
      /**
       * @cfg {String} minLengthText Error text to display if the {@link #minLength minimum length}
       * validation fails (defaults to 'The minimum length for this field is {minLength}')
       */
      minLengthText : applicationResources.getProperty('ext.form.textField.minLengthText'),

      /**
       * @cfg {String} maxLengthText Error text to display if the {@link #maxLength maximum length}
       * validation fails (defaults to 'The maximum length for this field is {maxLength}')
       */
      maxLengthText : applicationResources.getProperty('ext.form.textField.maxLengthText'),

      /**
       * @cfg {String} blankText The error text to display if the {@link #allowBlank} validation
       * fails (defaults to 'This field is required')
       */
      blankText : applicationResources.getProperty('ext.form.textField.blankText')
   });


   // EXTJS UX Localization.
   Ext.override(Ext.ux.grid.RowEditor, {
      saveText: applicationResources.getProperty('button.Save'),
      cancelText: applicationResources.getProperty('button.Cancel'),
      commitChangesText: applicationResources.getProperty('ext.ux.grid.rowEditor.commitChangesText'),
      errorText: applicationResources.getProperty('ext.ux.grid.rowEditor.errorText'),

      startEditing: function(rowIndex, doFocus){
         if(this.editing && this.isDirty()){
            this.showTooltip(this.commitChangesText);
            return;
         }
         if(Ext.isObject(rowIndex)){
            rowIndex = this.grid.getStore().indexOf(rowIndex);
         }
         if(this.fireEvent('beforeedit', this, rowIndex) !== false){
            this.editing = true;
            var g = this.grid, view = g.getView(),
                  row = view.getRow(rowIndex),
                  record = g.store.getAt(rowIndex);

            this.record = record;
            this.rowIndex = rowIndex;
            this.values = {};
            if(!this.rendered){
               this.render(view.getEditorParent());
            }
            var w = Ext.fly(row).getWidth();
            this.setSize(w);
            if(!this.initialized){
               this.initFields();
            }
            var cm = g.getColumnModel(), fields = this.items.items, f, val;
            for(var i = 0, len = cm.getColumnCount(); i < len; i++){
               val = this.preEditValue(record, cm.getDataIndex(i));
               f = fields[i];
               f.setValue(val);
               this.values[f.id] = Ext.isEmpty(val) ? '' : val;
            }
            this.verifyLayout(true);
            if(!this.isVisible()){
               this.setPagePosition(Ext.fly(row).getXY());
            } else{
               this.el.setXY(Ext.fly(row).getXY(), {duration:0.15});
            }
            // Bug Fix - Adjust the height of editor when displaying in IE so the buttons do not overlap
            // the edit fields - DK
            if (Ext.isIE)
            {
               this.setHeight(Ext.fly(row).getHeight()+this.btns.getHeight()+2);
            }
            if(!this.isVisible()){
               this.show().doLayout();
            }
            if(doFocus !== false){
               this.doFocus.defer(this.focusDelay, this);
            }
         }
      }
   });

</script>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/UserPreference.js"></script>
<script type="text/javascript">
   // Setup User Preferences.

   /* <![CDATA[ */
   <%
      JSONObject jsonUserPref = new JSONObject();
      if( authentication != null && authentication.getRclUser() != null && authentication.getRclUser().getPreferences() != null)
      {
         IRclUser user = authentication.getRclUser();
         jsonUserPref.put("savedCategory", user.getPreferences().getSavedCategory());
         jsonUserPref.put("numberOfDaysUntilOuputExpiration", user.getPreferences().getNumberOfDaysUntilOuputExpiration());
         jsonUserPref.put("confirmDeletes", user.getPreferences().isConfirmDeletes());
         jsonUserPref.put("itemsPerPage", user.getPreferences().getItemsPerPage());
         jsonUserPref.put("dateFormat",user.getPreferences().getDateFormat());
         jsonUserPref.put("timeFormat", user.getPreferences().getTimeFormat());
         jsonUserPref.put("extDateFormat", user.getPreferences().getExtDateFormat());
         jsonUserPref.put("extTimeFormat", user.getPreferences().getExtTimeFormat());
         jsonUserPref.put("automaticallyLaunchReportViewer", user.getPreferences().isAutomaticallyLaunchReportViewer());
         jsonUserPref.put("launchViewerInSeparateWindows", user.getPreferences().isLaunchViewerInSeparateWindows());
         jsonUserPref.put("theme", user.getPreferences().getTheme());
      }
   %>

   var UserPreference = new Adf.UserPreference(Ext.decode('<%=jsonUserPref.toJSONString()%>'));
   /* ]]> */
</script>

<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/ext-adf/common/MultipleEmailValidation.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/overrides/BasicAdfForm.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/overrides/AdfFormPanel.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/ext-adf/common/FadeMessage.js"></script>


<%-- Flexpoint for Customer Projects to Inject their own stuff here --%>
<%@ include file="/WEB-INF/pages/common/customer-includes/commonExtIncludes-fragment.jsp" %>
