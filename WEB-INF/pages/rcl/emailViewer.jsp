<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%--
   This is the RCL EmailOptionsViewer.

   ---------------------------
   @author : Jeremy Siler

   $Id: emailViewer.jsp 7109 2010-01-29 15:27:35Z lhankins $

--%>


<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title>
      <fmt:message key="emailViewer.title"/>
   </title>



   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/TabSet.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/emailViewer/EmailViewerUi.js"></script>

   <link rel="StyleSheet" href="<%=request.getContextPath()%>/styles/rcl/tabSet.css" type="text/css"/>

   <style type="text/css">
      div.pageBanner {
         background-color: #4A7DAD;

         border: 1px solid #333333;

         padding: 5px;
         width: 100%;
         height: 35px;
         margin-bottom: 0px;

         font-family: Arial, Helvetica, sans-serif;
         font-size: 16pt;
         font-weight: bold;
         color: white;
      }

      div.pageBody {
         border: 1px solid #333333;

         padding: 5px;
         width: 100%;
         margin-bottom: 10px;

         font-family: Arial, Helvetica, sans-serif;
         font-weight: bold;
      }

      .bottomButtons {
         width: 100%;
         text-align: center;
         clear: both;
         display: block;
         left: 0px;
      }

      .bottomButtons input {
         width: 100px;
      }
   </style>

</head>

<body class="rclBody" onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

<html:form action="/secure/actions/executeEmailOptions.do">
   <script type="text/javascript">
      var uiController = new EmailViewerUiController(document);

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
      {
         uiController.initUi();
      });
   </script>
   <c:forEach items="${form.rerIds}" var="eachId">
      <html:hidden property="rerIds" value="${eachId}"/>
   </c:forEach>

   <div class="pageBanner">
      <fmt:message key="emailViewer.title"/>
   </div>

   <div class="pageBody">
      <br/>

      <div id="reportName" style="font-size:10pt">
         <c:out value="${form.reportNames}"/>
      </div>
      <div id="validationMessage" style="color:red;">
      </div>

      <br/>

      <table border="0">
         <tr>
            <td class="deliveryPrefDiv">
                  &nbsp;&nbsp;&nbsp;<fmt:message key="emailViewer.to"/>
            </td>
            <td>
               <html:text styleId="emailTo" property="toList" style="width:400px;"/>
            </td>
         </tr>
         <tr>
            <td class="deliveryPrefDiv">
                  &nbsp;&nbsp;&nbsp;<fmt:message key="emailViewer.cc"/>
            </td>
            <td>
               <html:text styleId="emailCc" property="ccList" style="width:400px;"/>
            </td>
         </tr>
         <tr>
            <td class="deliveryPrefDiv">
                  &nbsp;&nbsp;&nbsp;<fmt:message key="emailViewer.bcc"/>
            </td>
            <td>
               <html:text styleId="emailBcc" property="bccList" style="width:400px;"/>
            </td>
         </tr>
         <tr>
            <td class="deliveryPrefDiv">
                  &nbsp;&nbsp;&nbsp;<fmt:message key="emailViewer.subject"/>
            </td>
            <td>
               <html:text styleId="emailSubject" property="subject" style="width:400px;"/>
            </td>
         </tr>
         <tr>
            <td class="deliveryPrefDiv">
                  &nbsp;&nbsp;&nbsp;<fmt:message key="emailViewer.body"/>
            </td>
            <td>
               <html:textarea rows="4" styleId="emailBody" property="body" style="width:400px;"/>
            </td>
         </tr>
         <tr>

            <td class="deliveryPrefDiv">
                  &nbsp;&nbsp;&nbsp;<fmt:message key="emailViewer.availableAttachments"/>
            </td>
            <td>
               <html:checkbox styleId="emailPdf" property="pdfEnabled" disabled="disabled"/><span><fmt:message key="emailViewer.pdf"/></span>
               <html:checkbox styleId="emailXls" property="xlsEnabled" disabled="disabled"/><span><fmt:message key="emailViewer.xls"/></span>
               <html:checkbox styleId="emailXls2007" property="xls2007Enabled" disabled="disabled"/><span><fmt:message key="emailViewer.xls.2007"/></span>
               <html:checkbox styleId="emailXml" property="xmlEnabled" disabled="disabled"/><span><fmt:message key="emailViewer.xml"/></span>
               <html:checkbox styleId="emailCsv" property="csvEnabled" disabled="disabled"/><span><fmt:message key="emailViewer.csv"/></span>
            </td>

         </tr>
         <tr>
            <td class="deliveryPrefDiv">
               &nbsp;&nbsp;<html:checkbox styleId="emailZip" property="zipEnabled"/><span><fmt:message key="emailViewer.zipReports"/></span>
            </td>
         </tr>
      </table>

      <br/>
      <br/>

      <div class="bottomButtons">
         <html:button property="Email" styleId="emailButton" onclick="uiController.emailButton();"
                      altKey="emailViewer.button.email.alt" titleKey="emailViewer.button.email.title" bundle="rcl">
            <fmt:message key="emailViewer.button.email"/>
         </html:button>
         <html:button property="Cancel" onclick="uiController.cancelButton();"
                      altKey="emailViewer.button.cancel.alt" titleKey="emailViewer.button.cancel.title" bundle="rcl">
            <fmt:message key="emailViewer.button.cancel"/>
         </html:button>
      </div>

   </div>
</html:form>
</body>
</html>

