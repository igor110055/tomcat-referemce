<%--
   This page simply lets you debug which jar a class is loaded from

   ---------------------------
   @author : Lance Hankins

   $Id:debugClassLoader.jsp 533 2005-07-31 20:32:49 -0500 (Sun, 31 Jul 2005) lhankins $

--%>


<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
   <head>
      <title>ClassLoader Debugger</title>
   </head>

   <body class="rclBody" oncontextmenu="return false;">
      <html:form action="/secure/actions/admin/debugClassLoader.do">
         <p>Supply the fully qualified name of the class in question, then press the lookup button.</p>
         classname : <nested:text size="80" property="className"/><br/>
         <br/>
         <pre style="font-family:Arial, Helvetica, sans-serif;font-size:12px;background-color:black;color:cyan;">
            <nested:write property="classLocation"/>
         </pre>
         <br/>
         <html:submit value="Determine Which Jar this class is Loaded From"/>
      </html:form>
   </body>
</html>
