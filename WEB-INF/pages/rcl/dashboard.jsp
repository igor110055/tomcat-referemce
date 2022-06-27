<!--<?xml version="1.0" encoding="UTF-8"?>-->
<!--<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">-->
<%--
   Describe Page Here...

   ---------------------------
   @author : Lance Hankins

   $Id: dashboard.jsp 9177 2015-04-30 22:30:00Z lhankins $

--%>
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>
   <title>TITLE</title>
   <%@ include file="/WEB-INF/pages/common/commonIncludes.jsp" %>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp" %>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/FadeMessage.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/TabSet.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportInstance.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ViewerKeyHandler.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>

   <link rel="StyleSheet" href="<%=request.getContextPath()%>/styles/rcl/tabSet.css" type="text/css" />

   <script type="text/javascript">
      var tabCount = 1;
      var tab;

      var tabbedPanel;

      var dashboardPageIds = new Array(0);

      <c:if test="${dashboard != null}">
         <c:forEach items="${dashboard.dashboardPages}" var="eachPage" varStatus="pageStatus">
             dashboardPageIds.push('<c:out value="${eachPage.id}"/>')
         </c:forEach>
      </c:if>

      function initUi()
      {
         if (top.rclFrameSetUiController)
            top.rclFrameSetUiController.hidePropertiesPanel();


         tabbedPanel = new TabSet("tabbedPanel");
         tabbedPanel.insertIntoDocument(document, document.getElementById("tabbedPanelDiv"));

         for (var i = 0; i < dashboardPageIds.length; i++)
         {
            var tabId = dashboardPageIds[i];
            var url = ServerEnvironment.baseUrl + "/secure/actions/dashboardTab.do?dashboardPageId=" + tabId;
            tab = this.tabbedPanel.createAndAddTab(tabId, "Dashboard " + tabId, url);
         }

         if (dashboardPageIds.length >= 1)
         {
            tabbedPanel.selectFirstTab(true);
         }

         if (dashboardPageIds.length == 1)
         {
            tab.dom.tabDiv.style.display = 'none';
         }
         //         alert("rows:" + parent.workSpaceFrameSet.rows);
         //         parent.workSpaceFrameSet.rows = "*,6px"
      }


   </script>

   <style type="text/css" xml:space="preserve">
      @import "<%= request.getContextPath() %>/styles/rcl/dashboard.css";

      #dashboardTabbedPanelContainer
      {
         height:100%;
      }

      .settab-pane-wrap {
          position: relative;
          z-index: 9;
          border: 1px solid silver;
          padding: 0px;
          height:100%;
      }
   </style>

</head>

<c:set var="columnNumberStyle" value="twoColumn"/>
<body class="rclBody workspace" style="height:100%;" onload="initUi();">


<div id="dashboardTabbedPanelContainer">
   <div id="tabbedPanelDiv" class="tabbedPanelOuterDiv">
      <!--  Tabbed Panel is Inserted Here... -->
      <!--<iframe scrolling="no" class="reportModuleIframe" style="overflow:hidden;width:100%;height:100%;"-->
                    <!--src="http://ai6/MOMTVolume.aspx"></iframe>-->
   </div>
</div>

</body>
</html>
