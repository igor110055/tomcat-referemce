<%@ page import="com.focus.rcl.AbstractRclAppContext"%>
<%@ page import="com.focus.rcl.crn.CrnFacade"%>
<%@ page import="com.focus.rcl.crn.CrnReportExecutionRequest" %>
<%@ page import="com.focus.rcl.crn.CrnReportExecutionResponse" %>
<%@ page import="com.focus.rcl.crn.OutputFormatEnum" %>
<%@ page import="com.focus.rcl.crn.config.ICognosConfigurationService" %>
<%
   String xpath = request.getParameter("xpath");
   String[] productLine = request.getParameterValues("productLine");

   ICognosConfigurationService cognosConfigService = (ICognosConfigurationService) AbstractRclAppContext.getAppContext().getBean(ICognosConfigurationService.BEAN_NAME);
   CrnFacade crnFacade = cognosConfigService.getDefaultConfiguration().getServiceAccountCrnFacade();

   CrnReportExecutionRequest rer = new CrnReportExecutionRequest(xpath, crnFacade);
   rer.addOutputFormat(OutputFormatEnum.HTML);

   if (productLine != null)
      rer.getParameterSet().addParameter("ProductLine", productLine);


   CrnReportExecutionResponse toolkitResponse = rer.execute();

   out.println(toolkitResponse.getHtmlOutputData());
   //out.println(toolkitResponse.getUrlForHtmlOutputData());
%>
