<%--
   show the session stats...

   ---------------------------
   @author : Lance Hankins

   $Id: sessionStats.jsp 4099 2007-03-11 19:45:10Z lhankins $

--%>


<!--
 This is a simple debugging page which will print out all session
 variables in a table.
 -->
<%@ page import="java.io.ByteArrayInputStream"%>
<%@ page import="java.io.ByteArrayOutputStream" %>
<%@ page import="java.io.ObjectInputStream" %>
<%@ page import="java.io.ObjectOutputStream" %>
<%@ page import="java.util.Enumeration" %>
<%@ page import="java.text.DecimalFormat" %>

<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Session Stats</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <html:xhtml/>

      <style type="text/css" xml:space="preserve">
         td.shaded {
            background-color:navy;
            color:white;
         }
         *.error {
            color:red;
         }
      </style>

   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">



   <div style="text-align:center">
      <hr/>
      <h1>HttpSession Statistics</h1>
      <hr/>
   </div>



   <!-- Table Data -->

   <table border="1" width="100%" border="0" cellspacing="2" cellpadding="10">

      <tr>
         <td class="shaded">Attribute Name</td>
         <td class="shaded">Value</td>
         <td class="shaded">Serializes</td>
         <td class="shaded">Size</td>
      </tr>


      <%
         Enumeration e = session.getAttributeNames();
         int totalSize = 0;

         DecimalFormat format = new DecimalFormat("###,###");
         while (e.hasMoreElements())
         {
            String name = (String) e.nextElement();
            Object value = session.getAttribute(name);
            int size = 0;

            String serializeResult = "<span class=\"error\">Exception (see log)</span>";


            //--- test serialization...
            try
            {
               ByteArrayOutputStream memStream = new ByteArrayOutputStream(4096);
               ObjectOutputStream oos = new ObjectOutputStream(memStream);
               oos.writeObject(value);
               oos.flush();

               size = memStream.size();
               totalSize += size;


               ObjectInputStream ois =
                       new ObjectInputStream(new ByteArrayInputStream(memStream.toByteArray()));

               Object clone = ois.readObject();

               serializeResult = "Success";
            }
            catch (Exception ex)
            {
               System.out.println("EXCEPTION while testing serialization for object [" + value.getClass().getName() + "] [" + ex.getMessage() + "]");
               ex.printStackTrace(System.out);
            }
      %>
            <tr>
               <td><%= name %></td>
               <td><%= value %></td>
               <td><%= serializeResult %></td>
               <td style="text-align:right"><%= format.format(size) %></td>
            </tr>
      <%
         }
      %>

      <tr>
         <td colspan="2"/>
         <td class="shaded">Total Size</td>
         <td style="text-align:right"><%= format.format(totalSize) %> </td>
      <tr>

   </table>



   </body>
</html>
