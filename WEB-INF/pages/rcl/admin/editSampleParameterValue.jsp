<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Describe Page Here...

   ---------------------------
   @author : Lance Hankins
   
   $Id: editSampleParameterValue.jsp 4336 2007-06-04 05:21:18Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Edit Sample Parameter Values</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>



      <script type="text/javascript">

         function doSubmit ()
         {
            document.forms[0].submit();
         }

         function doCancel (anId)
         {
            document.forms[0].action = ServerEnvironment.baseUrl + "/secure/actions/admin/manageSampleParameterValues.do";
            document.forms[0].submit();
         }

      </script>
   </head>
   <body class="rclBody">
      <html:xhtml/>

      <html:form action="/secure/actions/admin/saveSampleParameterValue.do" method="post">
         <html:hidden property="id"/>

         <h3>Edit Sample Parameter Value</h3>


         <table>
            <tr>
               <td>Name</td>
               <td>Package (optional)</td>
               <td>Data Type (optional)</td>
               <td>Sample Value</td>
            </tr>
            <tr>
               <td>
                  <html:text property="parameterName"/>
               </td>
               <td>
                  <html:text property="packagePath" size="50"/>
               </td>
               <td>
                  <html:text property="parameterType"/>
               </td>
               <td>
                  <html:text property="sampleValue"/>
               </td>
            </tr>
         </table>

         <div>
            <input type="button" value="OK" onclick="doSubmit();"/>
            <input type="button" value="Cancel" onclick="doCancel();"/>
         </div>


      </html:form>

   </body>
</html>
