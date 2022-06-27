<%@ page import="com.focus.ftl.web.WebUtil"%>
<%@ page import="com.focus.rcl.RclEnvironment"%>
<%@ page import="com.focus.rcl.core.UserPreference"%>
<%@ page import="com.focus.rcl.crn.CrnSettings" %>
<%@ page import="com.focus.rcl.security.RclAuthentication" %>
<%@ page import="com.focus.rcl.web.util.RclWebUtil" %>
<%@ page import="org.springframework.security.core.Authentication" %>
<%@ page import="org.springframework.security.core.context.SecurityContextHolder" %>
<%--
   This file contains common includes which are used from most JSP's in
   the application.   Its meant to be included in the <head> element of
   other JSP's.

   ---------------------------
   @author : Lance Hankins

   $Id: commonIncludes.jsp 9255 2015-07-07 23:34:09Z sallman $

--%>

<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/prototype.js"></script>

<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/BrowserSniffer.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/BrowserGeometry.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/JsUtil.js"></script>

<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/ServerEnvironment.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/DocumentLifeCycleMonitor.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/FadeMessage.js"></script>
<script type="text/javascript" src="<%= request.getContextPath()%>/scripts/rcl/common/PleaseWaitDiv.js"></script>

<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/domain/Enum.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/domain/RclJsEnums.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/common/DateUtils.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/debug/JsClientDebug.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/i18n/Localization/<rcl:currentLocale/>.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/rcl/reportViewer/LaunchReportViewer.js"></script>

<%
   RclAuthentication currentAuth = RclAuthentication.getCurrentThreadIdentity();

   CrnSettings crnSettings = null;
   if (currentAuth != null)
   {
      crnSettings = currentAuth.getCrnSettingsAndCredentials().getCrnSettings();
   }
%>
<script type="text/javascript">
   /* <![CDATA[ */
   ServerEnvironment.crnEndPoint= '<%= crnSettings != null ? crnSettings.getDispatcherUrlAsString() : "" %>';
   ServerEnvironment.crnBaseUrl = '<%= crnSettings != null ? crnSettings.getGatewayBaseUrl() : ""%>';
   ServerEnvironment.crnGateway = '<%= crnSettings != null ? crnSettings.getGatewayUrlAsString()  : ""%>';

   ServerEnvironment.baseUrl = location.protocol + '//' + window.location.host + '<%=request.getContextPath()%>';
   ServerEnvironment.windowNamePrefix = window.location.host;
   ServerEnvironment.contextPath = '<%= request.getContextPath() %>';

   var temp = ServerEnvironment.windowNamePrefix.split(':');
   ServerEnvironment.windowNamePrefix = "";
   for (var i = 0; i < temp.length; i++)
   {
      ServerEnvironment.windowNamePrefix += temp[i];
   }

   //replace '.' with underscrore
   ServerEnvironment.windowNamePrefix = ServerEnvironment.windowNamePrefix.replace(/\./g,"_");

   //replace '-' with underscrore
   ServerEnvironment.windowNamePrefix = ServerEnvironment.windowNamePrefix.replace(/-/g,"_");

   ServerEnvironment.imageDir = '<%=request.getContextPath()%>/images';
   ServerEnvironment.contextPath = '<%=request.getContextPath()%>';
   ServerEnvironment.sessionId = '<%=session.getId()%>';
   ServerEnvironment.jsClientDebug = <%= RclEnvironment.getJsClientDebug() %>;
   ServerEnvironment.hideReportWizard = <%= !RclWebUtil.isAllowedReportWizard() %>;
   ServerEnvironment.showReportWizard = <%= RclWebUtil.isAllowedReportWizard() %>;
   ServerEnvironment.showQueryStudioLink = <%= RclEnvironment.isShowQueryStudioLink() %>;
   <%
      Authentication anAuth =  SecurityContextHolder.getContext().getAuthentication();

      RclAuthentication authentication = anAuth == null ? null : (RclAuthentication) anAuth.getPrincipal();
      String isLaunchViewerInSeparateWindows = "false";


      if( authentication != null && authentication.getRclUser() != null && authentication.getRclUser().getPreferences() != null)
      {
         UserPreference userPreference = authentication.getRclUser().getPreferences();
         isLaunchViewerInSeparateWindows = Boolean.toString( userPreference.isLaunchViewerInSeparateWindows() );
         out.println("ServerEnvironment.pageSize = " + userPreference.getItemsPerPage() + ";");
         out.println("ServerEnvironment.userLocale = '" + RclWebUtil.getUserJavaLocale(request) + "';");
         out.println("ServerEnvironment.userDateFormat = '" + userPreference.getDateFormat() + "';");
         out.println("ServerEnvironment.userTimeFormat = '" + userPreference.getTimeFormat() + "';");
         out.println("ServerEnvironment.extUserDateFormat = '" + userPreference.getExtDateFormat() + "';");
         out.println("ServerEnvironment.extUserTimeFormat = '" + userPreference.getExtTimeFormat() + "';");
      }
      if ( WebUtil.isCallerMemberOfRole(request, RclEnvironment.getRclSecurityAdminGroupsArray()) )
      {
         out.println(" ServerEnvironment.isAdminUser = true;");
      }
      else
      {
         out.println(" ServerEnvironment.isAdminUser = false;");
      }
   %>

   ServerEnvironment.launchViewerInSeparateWindows = <%= isLaunchViewerInSeparateWindows %>;
   ServerEnvironment.extPageSize = <%= RclEnvironment.getExtPageSize()%>;
   ServerEnvironment.rerRowsPerPage = <%= RclEnvironment.getRerDefaultRowsPerPage()%>;
   /* ]]> */
</script>

<style type="text/css">
   @import "<%= request.getContextPath() %>/styles/rcl/rcl.css";
   @import "<%= request.getContextPath() %>/styles/rcl/i18n/<rcl:currentLocale/>.css";

   @import "<%= request.getContextPath() %>/styles/rcl/rcl-overrides.css";
   @import "<%= request.getContextPath() %>/styles/rcl/pleaseWaitDiv.css";
   @import "<%= request.getContextPath() %>/styles/rcl/FadeMessage.css";
   @import "<%= request.getContextPath() %>/styles/rcl/DropShadow.css";

</style>

<%@ include file="/scripts/rcl/dialogs/DialogIncludes.jsp"%>
<!-- conditional stylesheets... -->
<script type="text/javascript">
   /* <![CDATA[ */

   if(is_ie7)
   {
      document.write('<style type="text/css">\n' +
                     '@import "<%= request.getContextPath()%>/styles/rcl/browser/ie7/browserHacks.css";\n' +
                     '</style>\n');
   }
   else if(is_ie)
   {
      document.write('<style type="text/css">\n' +
                     '@import "<%= request.getContextPath()%>/styles/rcl/browser/ie6/browserHacks.css";\n' +
                     '</style>\n');
   }
   else
   {
      document.write('<style type="text/css">\n' +
                     '@import "<%= request.getContextPath()%>/styles/rcl/browser/ff/browserHacks.css";\n' +
                     '</style>\n');
   }
   /* ]]> */
</script>



<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>

<%-- Flexpoint for Customer Projects to Inject their own stuff here --%>
<%@ include file="/WEB-INF/pages/common/customer-includes/commonIncludes-fragment.jsp" %>
