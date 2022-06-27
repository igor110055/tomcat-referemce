<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   QueryItem Value Prompt Picker...

   ---------------------------
   @author : Lance Hankins
   
   $Id: queryItemValuePickerDialog.jsp 4741 2007-10-23 16:07:30Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<html>
   <head>
      <title>Pick Values</title>
      <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
      <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>



      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>

      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
      <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/dialogs/QueryItemValuePickerDialogUi.js"></script>

      <style type="text/css">
         @import "<%=request.getContextPath()%>/styles/rcl/dialogs/queryItemValuePickerDialog.css";
      </style>
   </head>
   <body class="rclBody"
         onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
         onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

      <html:xhtml/>

      <html:form action="/secure/actions/queryItemValuePickerDialog.do" onsubmit="uiController.willSubmit();">
         <html:hidden property="packagePath"/>         
         <html:hidden property="queryItemRef"/>
         <html:hidden property="displayValueRef"/>
         <html:hidden property="itemsPerPage"/>
         <html:hidden property="currentPageNumber"/>
         <html:hidden property="filterType"/>
         <html:hidden property="extraParams"/>
         <html:hidden property="cascadeContextXml"/>
         <html:hidden property="skipToPage" value="0"/>
         <html:hidden property="maxNumberOfSelections"/>

         <!-- set just prior to submission -->
         <html:hidden property="selectedXml" value=""/>


         <div id="filterTop">
            <span class="label">Filter : </span>
            <html:text property="filterBy" styleId="filterBy" style="width:100px;padding:0; margin:0;"/>

            <img src="<%=request.getContextPath()%>/images/md/filter.gif" alt="<fmt:message key="dialogs.qivp.filterImageAlt"/>" onclick="uiController.willSubmit();document.forms[0].submit()" style="cursor:pointer"/>

            <c:if test="${form.paramValueResult.completeSetOfValues == false}">

               <div style="display:inline; margin-left:10px; text-align:right;">
                  <c:out value="${form.paramValueResult.pageNumber+1}"/> of <c:out value="${form.paramValueResult.totalPages}"/>
                  &nbsp;
                  <img src="<%=request.getContextPath()%>/images/firstPage.gif" alt="first page" onclick="javascript:uiController.firstPage();"/>
                  <img src="<%=request.getContextPath()%>/images/previousPage.gif" alt="previous page" onclick="javascript:uiController.previousPage();"/>
                  <img src="<%=request.getContextPath()%>/images/nextPage.gif" alt="next page" onclick="javascript:uiController.nextPage();"/>
                  <img src="<%=request.getContextPath()%>/images/lastPage.gif" alt="last page" onclick="javascript:uiController.lastPage();"/>
               </div>

            </c:if>
         </div>

         <table>
            <tr>
               <td>
                  <span class="label"><fmt:message key="dialogs.qivp.availableValues"/></span>

                  <html:select property="availableValues" multiple="true" styleId="availableValues" size="23" style="width:300px;">
                     <html:optionsCollection property="paramValueResult.values" label="displayText" value="value"/>
                  </html:select>
               </td>
               <td class="centerButtons">
                  <input type="button" value=">>" onclick="uiController.addToSelected();"/>
                  <input type="button" value="<<" onclick="uiController.removeFromSelected();"/>
               </td>
               <td>
                  <span class="label"><fmt:message key="dialogs.qivp.selectedValues"/></span>
                  <html:select property="selectedValues" multiple="true" styleId="selectedValues" size="23" style="width:300px;">
                     <html:optionsCollection property="selectedItems"/>
                  </html:select>
               </td>
            </tr>
         </table>


         <div id="bottomButtons">
            <input type="button" value="OK" onclick="javascript:uiController.onOkButtonPress();"/>
            <input type="button" value="Cancel" onclick="javascript:uiController.onCancelButtonPress();"/>
         </div>


         <script type="text/javascript" xml:space="preserve">

            var uiController = null;
            DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {

               uiController = new QueryItemValuePickerDialogUiController(document, <c:out value="${form.multiSelect}"/>, <c:out value="${form.paramValueResult.pageNumber}"/>,  <c:out value="${form.paramValueResult.totalPages}"/>, <c:out value="${form.maxNumberOfSelections}"/>);

               //--- easier access for someone who wants to access us as an iframe...
               window.dialogUiController = uiController;

               uiController.initUi();
            });

            DocumentLifeCycleMonitor.getInstance().addOnUnLoadListener(function() {
               //--- clean up dialog reference...
               window.dialogUiController = null;
            });
         </script>


      </html:form>




   </body>
</html>
