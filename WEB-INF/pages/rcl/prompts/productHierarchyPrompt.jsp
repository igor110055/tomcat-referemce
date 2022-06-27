<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Product Hierarchy Prompt Screen...

   NOTE: This screen is a little more complex to support hiding/showing various
   members of the product hierarchy and to allow you to switch between multi-select
   and single-select mode for each member of the product hierarchy...

   ---------------------------
   @author : Lance Hankins
   
   $Id: productHierarchyPrompt.jsp 8386 2013-05-24 15:45:32Z jsiler $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title><fmt:message key="prompt.productHierarchy.title"/></title>


   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/domain/ProductHierarchy.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/prompts/ProductHierarchyPromptUi.js"></script>

   <style type="text/css" xml:space="preserve">
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

         var uiModel = new ProductHierarchyPromptUiModel(catalog);
         var uiController = new ProductHierarchyPromptUiController(document, uiModel);

         <c:out value="${productHierarchyPromptForm.jsSetUiControllerFlags}" escapeXml="false"/>


         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>

      <!--
      set a few page scoped variables that will control things like :
         - multi-select vs. single-select for each of the three list boxes...
         - whether we should hide any of the three list boxes...
      -->
      <c:if test="${productHierarchyPromptForm.multiSelectProductLine}">
         <c:set var="multiSelectProductLine" value="multiple=\"multiple\""/>
      </c:if>

      <c:if test="${productHierarchyPromptForm.multiSelectProductType}">
         <c:set var="multiSelectProductType" value="multiple=\"multiple\""/>
      </c:if>

      <c:if test="${productHierarchyPromptForm.multiSelectProduct}">
         <c:set var="multiSelectProduct" value="multiple=\"multiple\""/>
      </c:if>

      <c:if test="${productHierarchyPromptForm.hideProductLine}">
         <c:set var="productLineHideShowClass" value="hide"/>
      </c:if>

      <c:if test="${productHierarchyPromptForm.hideProductType}">
         <c:set var="productTypeHideShowClass" value="hide"/>
      </c:if>

      <c:if test="${productHierarchyPromptForm.hideProduct}">
         <c:set var="productHideShowClass" value="hide"/>
      </c:if>



      <span class="screenTitle"><fmt:message key="prompt.productHierarchy.title"/></span>
      <table>
         <tr>
            <td class="<c:out value="${productLineHideShowClass}"/> label" id="ProductLine_label"><fmt:message key="prompt.productHierarchy.productLine"/></td>
            <td class="<c:out value="${productTypeHideShowClass}"/> label" id="ProductType_label"><fmt:message key="prompt.productHierarchy.productType"/></td>
            <td class="<c:out value="${productHideShowClass}"/> label" id="Product_label"><fmt:message key="prompt.productHierarchy.product"/></td>
         </tr>
         <tr>

            <td style="width:200px;" class="<c:out value="${productLineHideShowClass}"/>">
               <select id="productLineList"
                       <c:out value="${multiSelectProductLine}" escapeXml="false"/>
                       class="<c:out value="${productLineListClass}"/>"
                       size="15"
                       onchange="uiController.productLineSelectionChanged();">
               </select>
            </td>

            <td style="width:200px;" class="<c:out value="${productTypeHideShowClass}"/>">
               <select id="productTypeList"
                       <c:out value="${multiSelectProductLine}"/>
                       <c:out value="${productTypeListClass}"/>
                       size="15"
                       onchange="uiController.productTypeSelectionChanged();">
               </select>
            </td>

            <td style="width:250px;" class="<c:out value="${productHideShowClass}"/>">
               <select id="productList"
                       <c:out value="${multiSelectProduct}" escapeXml="false"/>
                       size="15">
               </select>
            </td>
         </tr>
         <tr>
            <td class="<c:out value="${productLineHideShowClass}"/>">
               <c:if test="${productHierarchyPromptForm.multiSelectProductLine}">
                  <html:button property="" onclick="uiController.selectAllProductLines();"
                          altKey="prompt.button.selectAll.alt" titleKey="prompt.button.selectAll.title" bundle="rcl">
                     <fmt:message key="prompt.button.selectAll"/>
                  </html:button>
                  <html:button property="" onclick="uiController.resetProductLines();"
                          altKey="prompt.button.reset.alt" titleKey="prompt.button.reset.title" bundle="rcl">
                     <fmt:message key="prompt.button.reset"/>
                  </html:button>
               </c:if>
            </td>
            <td class="<c:out value="${productTypeHideShowClass}"/>">
               <c:if test="${productHierarchyPromptForm.multiSelectProductType}">
                  <html:button property="" onclick="uiController.selectAllProductTypes();"
                          altKey="prompt.button.selectAll.alt" titleKey="prompt.button.selectAll.title" bundle="rcl">
                     <fmt:message key="prompt.button.selectAll"/>
                  </html:button>
                  <html:button property="" onclick="uiController.resetProductTypes();"
                  altKey="prompt.button.reset.alt" titleKey="prompt.button.reset.title" bundle="rcl">
                     <fmt:message key="prompt.button.reset"/>
                  </html:button>
               </c:if>
            </td>
            <td class="<c:out value="${productHideShowClass}"/>">
               <c:if test="${productHierarchyPromptForm.multiSelectProduct}">
                  <html:button property="" onclick="uiController.selectAllProducts();"
                          altKey="prompt.button.selectAll.alt" titleKey="prompt.button.selectAll.title" bundle="rcl">
                     <fmt:message key="prompt.button.selectAll"/>
                  </html:button>
                  <html:button property="" onclick="uiController.resetProducts();"
                          altKey="prompt.button.reset.alt" titleKey="prompt.button.reset.title" bundle="rcl">
                     <fmt:message key="prompt.button.reset"/>
                  </html:button>
               </c:if>
            </td>
         </tr>
      </table>
   </html:form>

</body>
</html>

