<%@ page import="java.util.Locale"%>
<%@ page import="org.apache.struts.Globals"%>
<%--
  ~ Copyright (c) 2001-2013. Motio, Inc.
  ~ All Rights reserved
  --%>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%--
   Geographic Hierarchy Prompt Screen...


   ---------------------------
   @author : Lance Hankins
   
   $Id: migratedGeographicHierarchyPrompt.jsp 9255 2015-07-07 23:34:09Z sallman $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <title><fmt:message key="prompt.geographicHierarchy.title"/></title>


   <%-- Migration: Include Widget library. --%>
   <%@ include file="/WEB-INF/pages/common/commonPromptIncludes.jsp"%>


   <%-- Migration: Remove the old date parameter widget. --%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar.js"></script>--%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/lang/calendar-properties.js"></script>--%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/jscalendar/calendar-setup.js"></script>--%>

   <%--<style type="text/css" xml:space="preserve">--%>
   <%--@import "<%= request.getContextPath() %>/scripts/rcl/jscalendar/calendar-win2k-1.css";--%>
   <%--@import "<%= request.getContextPath() %>/styles/rcl/DateParameterWidget.css";--%>
   <%--</style>--%>


   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>--%>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/JsListBox.js"></script>--%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/HtmlSelect.js"></script>
   <%--<script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/DateParameterWidget.js"></script>--%>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportExecutionInputs.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractCustomPromptUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/domain/GeographicHierarchy.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/gosl/prompts/MigratedGeographicHierarchyPromptUi.js"></script>



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

   <html:form action="/secure/actions/geographicHierarchyPrompt">


      <script type="text/javascript" xml:space="preserve">

         <c:out value="${form.jsGeographicHierarchy}" escapeXml="false"/>

         var uiModel = new GeographicHierarchyPromptUiModel(geographicHierarchy);
         var uiController = new GeographicHierarchyPromptUiController(document, uiModel);

         // TODO: for some reason I'm having to set this so that the outer frame can find this uiController...
         window.uiController = uiController;

         DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function() {
            uiController.initUi();
         });
      </script>


      <span class="screenTitle"><fmt:message key="prompt.geographicHierarchy.title"/></span>
      <table>
         <tr>
            <td class="label" id="Country_label"><fmt:message key="prompt.geographicHierarchy.country"/></td>
            <td class="label" id="Region_label"><fmt:message key="prompt.geographicHierarchy.region"/></td>
            <td class="label" id="City_label"><fmt:message key="prompt.geographicHierarchy.city"/></td>
            <td class="label" id="Retailer_label"><fmt:message key="prompt.geographicHierarchy.retailer"/></td>
         </tr>
         <tr>
            <td style="width:200px;">
               <select id="countryList" size="20" onchange="uiController.countrySelectionChanged();" multiple="multiple">
               </select>
            </td>
            <td style="width:200px;">
               <select id="regionList" size="20" onchange="uiController.regionSelectionChanged();" multiple="multiple">
               </select>
            </td>
            <td style="width:200px;">
               <select id="cityList" size="20" onchange="uiController.citySelectionChanged();" multiple="multiple">
               </select>
            </td>
            <td style="width:240px;">
               <select id="retailerList" size="20" onchange="uiController.retailerSelectionChanged();" multiple="multiple">
               </select>
            </td>

         </tr>
         <tr>
            <td>
               <html:button property="" onclick="uiController.selectAllCountries();"
                            altKey="prompt.button.selectAll.alt" titleKey="prompt.button.selectAll.title" bundle="rcl">
                  <fmt:message key="prompt.button.selectAll"/>
               </html:button>
               <html:button property="" onclick="uiController.resetCountries();"
                            altKey="prompt.button.reset.alt" titleKey="prompt.button.reset.title" bundle="rcl">
                  <fmt:message key="prompt.button.reset"/>
               </html:button>
            </td>
            <td>
               <html:button property="" onclick="uiController.selectAllRegions();"
                            altKey="prompt.button.selectAll.alt" titleKey="prompt.button.selectAll.title" bundle="rcl">
                  <fmt:message key="prompt.button.selectAll"/>
               </html:button>
               <html:button property="" onclick="uiController.resetRegions();"
                            altKey="prompt.button.reset.alt" titleKey="prompt.button.reset.title" bundle="rcl">
                  <fmt:message key="prompt.button.reset"/>
               </html:button>
            </td>
            <td>
               <html:button property="" onclick="uiController.selectAllCities();"
                            altKey="prompt.button.selectAll.alt" titleKey="prompt.button.selectAll.title" bundle="rcl">
                  <fmt:message key="prompt.button.selectAll"/>
               </html:button>
               <html:button property="" onclick="uiController.resetCities();"
                            altKey="prompt.button.reset.alt" titleKey="prompt.button.reset.title" bundle="rcl">
                  <fmt:message key="prompt.button.reset"/>
               </html:button>
            </td>
            <td>
               <html:button property="" onclick="uiController.selectAllRetailers();"
                            altKey="prompt.button.selectAll.alt" titleKey="prompt.button.selectAll.title" bundle="rcl">
                  <fmt:message key="prompt.button.selectAll"/>
               </html:button>
               <html:button property="" onclick="uiController.resetRetailers();"
                            altKey="prompt.button.reset.alt" titleKey="prompt.button.reset.title" bundle="rcl">
                  <fmt:message key="prompt.button.reset"/>
               </html:button>
            </td>
         </tr>
      </table>

      <br/>

      <div id="dateWidgets">
         <%-- date widgets inserted here --%>
      </div>

   </html:form>

</body>
</html>

