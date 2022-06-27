<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   This is a custom prompt screen which allows the user to select a single
   Product Line from a drop down list.

   ---------------------------
   @author : Lance Hankins

   $Id: productLinePrompt.jsp 8386 2013-05-24 15:45:32Z jsiler $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>    

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title><fmt:message key="prompt.productLine.title"/></title>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/prompts/ProductLinePromptUi.js"></script>
</head>

<body class="rclBody customPromptIframeBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/productLinePrompt">

      <table>
         <tr>
            <td><fmt:message key="prompt.productLine.subtitle"/></td>
         </tr>
         <tr>
            <td>
               <html:select styleId="productLine" property="productLine">
                  <html:optionsCollection property="allProductLines" label="name" value="name"/>
               </html:select>
            </td>
         </tr>
      </table>

      <script type="text/javascript" xml:space="preserve">
         var uiController = new ProductLinePromptUiController(document);

         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>
   </html:form>
</body>
</html>
