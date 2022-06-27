<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Describe Page Here...

   ---------------------------
   @author : Lance Hankins
   
   $Id: importMetaData.jsp 4256 2007-04-27 21:36:24Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Manage Metadata</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>



      <script type="text/javascript">
      </script>

   </head>
   <body class="rclBody">
      <html:xhtml/>

      <html:form action="/secure/actions/admin/importMetaData.do" method="post" enctype="multipart/form-data">

         <h3>Import Metadata</h3>

         Select a file for import (this will override your existing metadata).

         <div style="padding:20px;">
            <span>Local File : </span>
            <html:file size="60" value="..." name="x" property="importFile"/>
            <br/>
            <br/>
            <br/>
            <input type="button" value="Import" onclick="document.forms[0].submit();"/>
         </div>


         <div style="clear:both;">
            <a href="<%=request.getContextPath()%>/secure/actions/admin/metaDataMenu.do">Back to MetaData Menu</a>
         </div>


      </html:form>

   </body>
</html>
