<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Product Hierarchy Prompt Screen (DivList version)

   NOTE: This screen is a little more complex to support hiding/showing various
   members of the product hierarchy and to allow you to switch between multi-select
   and single-select mode for each member of the product hierarchy...

   ---------------------------
   @author : Lance Hankins
   
   $Id:productHierarchyPromptDivList.jsp 4311 2007-05-22 20:41:53Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title><fmt:message key="prompt.productHierarchy.title"/></title>




   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/Observable.js"></script>

   <%@ include file="/scripts/rcl/dialogs/CrnDialogIncludes.jsp" %>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DivList.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/domain/ProductHierarchy.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/prompts/ProductHierarchyPromptDivListUi.js"></script>

   <style type="text/css" xml:space="preserve">
      @import "<%=request.getContextPath()%>/styles/rcl/DivList.css";      
      td select {
         width:100%;
      }

      *.hide{
         display:none;
      }
   </style>
</head>
<body class="rclBody customPromptIframeBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/productHierarchyPrompt">

      <script type="text/javascript" xml:space="preserve">

         <c:out value="${productHierarchyPromptForm.jsProductHierarchy}" escapeXml="false"/>

         var uiModel = new ProductHierarchyPromptDivListUiModel(catalog);
         var uiController = new ProductHierarchyPromptDivListUiController(document, uiModel);

         <c:out value="${productHierarchyPromptForm.jsSetUiControllerFlags}" escapeXml="false"/>


         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>

      <span class="screenTitle"><fmt:message key="prompt.productHierarchy.title"/></span>
      <table>
         <tr>
            <td class="<c:out value="${productLineHideShowClass}"/> label" id="ProductLine_label"><fmt:message key="prompt.productHierarchy.productLine"/></td>
            <td class="<c:out value="${productTypeHideShowClass}"/> label" id="ProductType_label"><fmt:message key="prompt.productHierarchy.productType"/></td>
            <td class="<c:out value="${productHideShowClass}"/> label" id="Product_label"><fmt:message key="prompt.productHierarchy.product"/></td>
         </tr>
         <tr>
            <td style="width:200px;" class="<c:out value="${productLineHideShowClass}"/>">
               <div id="productLineList">
               </div>
            </td>

            <td style="width:200px;" class="<c:out value="${productTypeHideShowClass}"/>">
               <div id="productTypeList">
               </div>
            </td>

            <td style="width:250px;" class="<c:out value="${productHideShowClass}"/>">
               <div id="productList">
               </div>
            </td>
         </tr>
      </table>
   </html:form>

</body>
</html>

