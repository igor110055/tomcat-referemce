<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   View / Edit the details on a single data item's metadata

   ---------------------------
   @author : Lance Hankins

   $Id: reportDataItemMetaDataDetails.jsp 4897 2007-12-05 20:54:59Z thopkins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Manage Metadata</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>


      <style type="text/css">
         td.label {
            text-align: right;
            padding-right:10px;
            background-color: #AAAAAA;
         }

         table {
            border: 1px solid gray;
            border-collapse: collapse;
            /*width:100%;*/
         }

         td {
            border: 1px solid gray;
            padding:5px;
         }

         thead td {
            background-color: #AAAAAA;
            font-weight:bold;
         }

      </style>
      <script type="text/javascript">
      </script>
   </head>
   <body class="rclBody" style="overflow:auto;">
      <html:xhtml/>

      <html:form action="/secure/actions/admin/reportMd/dataItem/save.do" method="post">
         <html:hidden property="reportId"/>
         <html:hidden property="reportDataItemMetaDataId"/>


         <div style="margin:10px 0 10px 0;">
            <h2><c:out value="${form.reportDataItemMetaData.name}"/></h2>
            
            <table>
               <tr>
                  <td class="label">
                     Data Type
                  </td>
                  <td>
                     <html:select property="pickDataItem">
                        <html:options property="dataTypeOptions"/>
                     </html:select>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     Value Picker Hint
                  </td>
                  <td>
                     <html:select property="pickValueParamHint">
                        <html:optionsCollection property="valueParamHintOptions" value="value" label="name"/>
                     </html:select>
                  </td>
               </tr>
               <tr>
                  <td class="label">
                     Capabilities
                  </td>
                  <td>
                     <html:checkbox property="supportsRuntimeFilters">Allow Runtime Filters on this Data Item</html:checkbox>
                     <br/>
                     <html:checkbox property="hasRowLevelSecurity">This Data Item has Row Level Security</html:checkbox>
                  </td>
               </tr>
            </table>
         </div>



         <div style="margin:10px 0 10px 0;">
            <html:submit value="save"/>
         </div>


         <div style="margin:10px 0 10px 0;">
            <a href="<%=request.getContextPath()%>/secure/actions/admin/reportMd/edit.do?reportId=<c:out value="${form.reportId}"/>">Back to Parent Report</a>
            <br/>
            <a href="<%=request.getContextPath()%>/secure/actions/admin/reportMd/menu.do">Back To Main Report MetaData Menu</a>
         </div>



      </html:form>


   </body>
</html>
