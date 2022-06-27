<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Edit the metadata for a given package...

   ---------------------------
   @author : Lance Hankins
   
   $Id: editMetaData.jsp 6042 2008-11-06 21:30:03Z dpaul $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Manage Metadata</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

      <style type="text/css" xml:space="preserve">
         @import "<%=request.getContextPath()%>/styles/rcl/Tree.css";
         @import "<%=request.getContextPath()%>/styles/rcl/reiContent.css";
         @import "<%=request.getContextPath()%>/styles/rcl/propertyEditor.css";


         #mdTreeContainer {
            height:500px;
            width:440px;
            overflow:auto;
            border : 1px solid gray;

            float:left;
         }


         div.rightHandPanel {
            /*width: 400px;*/
            height: 500px;
            padding:10px;
            float:left;
            padding: 10px;
         }

         #selectedItemDetails {
            display:none;
         }

         #nothingSelected {
         }

         td.label {
            text-align:right;
         }

         #hasRowLevelSecurity {
            width:80px;
         }

         #valuePickerHint {
            width: 240px;
         }

      </style>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Tree.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/CrnMetaData.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/md/LazyCrnMetaDataTree.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/admin/EditMetaDataUi.js"></script>


   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:form action="/secure/actions/admin/editMetaData" method="post">


         <script type="text/javascript">
            var uiController;

            DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
               uiController = new EditMetaDataUiController(document, "<c:out value="${form.jsPackagePath}" escapeXml="false"/>", null);
               uiController.initUi();
            });
         </script>

         <h3>Edit Metadata Details</h3>

         <div id="mdTreeContainer">
            Loading MetaData...
            <!-- TREE WILL BE INSERTED HERE -->
         </div>

         <div id="nothingSelected" class="rightHandPanel">
            Nothing selected...
         </div>

         <div id="selectedItemDetails" class="rightHandPanel">
            <table>
               <tbody>
                  <tr>
                     <td class="label">Name: </td>
                     <td>
                        <span id="selected_name"></span>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">Ref: </td>
                     <td>
                        <span id="selected_ref"></span>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">Data Type: </td>
                     <td>
                        <span id="selected_dataType"></span>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">Display Value Ref: </td>
                     <td>
                        <span id="selected_displayValueRef"></span>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">Customer Data Type: </td>
                     <td>
                        <input id="customerDataType" name="customerDataType" type="text" size="10"/>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">Customer Data Type Modifier: </td>
                     <td>
                        <input id="customerDataTypeModifier" name="customerDataTypeModifier" type="text" size="10"/>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">Has Row Level Security: </td>
                     <td>
                        <select id="hasRowLevelSecurity" name="hasRowLevelSecurity">
                           <option value="false">no</option>
                           <option value="true">yes</option>
                        </select>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">Value Picker Behavior: </td>
                     <td>
                        <select id="valuePickerHint" name="valuePickerHint">
                           <option value="-1">Use System Default For Type</option>
                           <option value="0">Show Distinct Set of Values</option>
                           <option value="1">Raw Input (use for large datasets)</option>
                        </select>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>

      </html:form>

      <div style="clear:both;">
         <a href="<%=request.getContextPath()%>/secure/actions/admin/metaDataMenu.do">Back to MetaData Menu</a>
      </div>
   </body>
</html>
