<%--
   NOTE: This is the version for ADF build info (NOT customer buildInfo)
--%>
<%@ page import="com.focus.rcl.buildinfo.*" %>
<%@ page import="java.util.Iterator" %>
<html>
<head>
   <%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/extIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>


   <style type="text/css">
      body {
         font-family:Verdana, Helvetica, sans-serif;
         font-size:11px;
         /*margin: 5px;*/
         overflow:hidden;
      }
      h1 {
         font-size:2.0em;
      }
      h2 {
         font-size:1.7em;
      }
      h3 {
         font-size:1.5em;
      }

      table.propertyTable td {
         padding:5px;
      }
      td.rightAlignedLabel {
         text-align:right;
         font-weight:bold;
      }

   </style>
</head>

<body>
<div style="padding:10px;">
   <h1>ADF Build Version Info</h1>

   <%
      BuildInfo buildInfo = BuildInfoFactory.createBuildInfo();
   %>

   <table class="propertyTable" border="1" cellpadding="5" style="margin:10px;">
      <tr>
         <td class="rightAlignedLabel">SVN Last Changed Revision (Local Root)</td>
         <td><%=buildInfo.getProp("local.svn.lastChangedRevision")%>
         </td>
      </tr>
      <tr>
         <td class="rightAlignedLabel">SVN Changeset (From Repository)</td>
         <td><%=buildInfo.getProp("local.svn.changeset")%>
         </td>
      </tr>
      <tr>
         <td class="rightAlignedLabel">SVN URL</td>
         <td><%=buildInfo.getProp("local.svn.url")%>
         </td>
      </tr>
      <tr>
         <td class="rightAlignedLabel">Built On Host</td>
         <td><%=buildInfo.getProp("built.on.host")%>
         </td>
      </tr>
      <tr>
         <td class="rightAlignedLabel">Build Time</td>
         <td><%=buildInfo.getProp("build.timestamp")%>
         </td>
      </tr>
      <tr>
         <td class="rightAlignedLabel">Build Version</td>
         <td><%=buildInfo.getBuildVersion()%>
         </td>
      </tr>
      <tr>
         <td class="rightAlignedLabel">Cognos Version</td>
         <td><%=buildInfo.getProp("crn.version")%>
         </td>
      </tr>
   </table>

   <hr/>

   <h3>All Properties</h3>
   <table border="1">
      <thead style="background-color:navy;color:white;">
         <td>property</td>
         <td>value</td>
      </thead>

      <%
         String eachPropertyName;
         String eachPropertyValue;
         for (Iterator itor = buildInfo.getPropNames(); itor.hasNext();)
         {
            eachPropertyName = (String) itor.next();
            eachPropertyValue = buildInfo.getProp(eachPropertyName);
      %>
      <tr>
         <td><%=eachPropertyName%>
         </td>
         <td><%=eachPropertyValue%>
         </td>
      </tr>
      <%
         }
      %>

   </table>
</div>
</body>
</html>
