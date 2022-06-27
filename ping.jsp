<%@ page import="com.focus.rcl.AbstractRclAppContext" %>
<%@ page import="com.focus.rcl.RclAppContext" %>
<%@ page import="com.focus.rcl.crn.CrnFacade" %>
<%@ page import="com.focus.rcl.crn.config.ICognosRoutingDecision" %>
<%@ page import="com.focus.rcl.customer.IRclCustomerEnvironment" %>
<%@ page import="org.dom4j.Document" %>
<%@ page import="org.dom4j.Element" %>
<%@ page import="org.dom4j.tree.DefaultDocument" %>
<%@ page import="org.dom4j.tree.DefaultElement" %>
<%@ page import="javax.sql.DataSource" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="com.focus.rcl.crn.config.ICognosConfigurationService" %>
<%@ page import="com.focus.rcl.web.framework.AbstractRclAction" %>
<%
   Document doc = new DefaultDocument();
   Element root = new DefaultElement("ping");
   doc.setRootElement(root);
   String status;

   Element dbStatusElement = new DefaultElement("adf-db");
   DataSource ds = (DataSource) RclAppContext.getAppContext().getBean("dataSource");
   Connection c = null;
   try
   {
      c = ds.getConnection();
      status = "up";
      c.close();
   }
   catch (Throwable t)
   {
      status = "down";
   }
   dbStatusElement.addAttribute("status", status);
   root.add(dbStatusElement);

   Element cgStatusElement = new DefaultElement("cognos");
   status = "up";
   try
   {
      //--- TODO: this is really only testing ONE Cognos Instance... likely better to test all which have an 'ONLINE' status
      ICognosConfigurationService cognosConfigService = (ICognosConfigurationService) AbstractRclAppContext.getAppContext().getBean(ICognosConfigurationService.BEAN_NAME);
      CrnFacade crnFacade = cognosConfigService.getDefaultConfiguration().getServiceAccountCrnFacade();

      crnFacade.query("~");
   }
   catch (Throwable t)
   {
      status = "down";
   }
   cgStatusElement.addAttribute("status", status);
   root.add(cgStatusElement);
   out.print(doc.asXML());
%>