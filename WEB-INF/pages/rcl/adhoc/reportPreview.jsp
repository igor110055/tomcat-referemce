<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>

      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <title><fmt:message key="reportWizard.reportPreview.title"/></title>

      <style type="text/css">
         @import "<%= request.getContextPath() %>/styles/rcl/adhoc/reportPreviewStyles.css";

      </style>
   </head>
   <body>
      <table align="center" border="0">
         <tr>
            <td>
               <c:out escapeXml="false" value="${preview}"/>
            </td>
         </tr>
      </table>
   </body>
</html>