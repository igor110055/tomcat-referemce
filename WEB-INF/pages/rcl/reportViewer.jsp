<%-- <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> --%>
<%-- commented out because the auto-growing iframe doesn't work in xhtml mode (in firefox) -jj -->

<%--
   This is the RCL ReportViewer.

   ---------------------------
   @author : Lance Hankins

   $Id: reportViewer.jsp 8321 2013-05-08 18:35:08Z sallman $

--%>


<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<html>
<head>


   <%@ include file="/WEB-INF/pages/common/commonExtIncludes.jsp"%>
   <%@ include file="/WEB-INF/pages/common/cache/never.jsp"%>

   <%@ include file="/scripts/rcl/dialogs/RclDialogIncludes.jsp"%>
   <%@ include file="/scripts/rcl/dialogs/DialogIncludes.jsp"%>

   <title><fmt:message key="reportViewer.title"/></title>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/sarissa/sarissa.js"></script>
   <%-- this is only needed for firefox, but doesn't appear to mess up IE...--%>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/sarissa/sarissa_ieemu_xpath.js"></script>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/EmailViewerUi.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/picker/ProfileSaveAsDialog.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/ext-adf/picker/AdfFolderPickerTree.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/FadeMessage.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/BrowserGeometry.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/TabSet.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/domain/ReportInstance.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/ViewerKeyHandler.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/AbstractUiController.js"></script>
   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/reportViewer/ReportViewerUi.js"></script>

   <link rel="StyleSheet" href="<%=request.getContextPath()%>/styles/rcl/tabSet.css" type="text/css" />
   <link rel="StyleSheet" href="<%=request.getContextPath()%>/styles/rcl/reportViewer.css" type="text/css"/>

</head>

<body class="rclBody" onload="initUi();" >

   <html:form action="/secure/actions/launchReportViewer.do">
      <script type="text/javascript">
         var tabbedPanel;
         var uiController;

         function initUi()
         {
            window.onresize = function() {
               uiController.windowResized();
            };
            tabbedPanel = new TabSet("tabbedPanel");
            tabbedPanel.insertIntoDocument(document, document.getElementById("tabbedPanelDiv"));
            uiController = new ReportViewerUiController(document, tabbedPanel);
            if (uiController.tabbedPanel.getNumberOfTabs() > 1)
            {
               uiController.firstTabLoaded = true;
            }

            var rer = null;
            <nested:write property="jsAddTabs" filter="false"/>

            tabbedPanel.selectFirstTab(true);
            uiController.firstTabLoaded = true;
            
         }

      </script>

      <html:hidden property="saveToFolderPath"/>
      <html:hidden property="saveAsNewProfileName"/>
      <html:hidden property="privateProfile"/>

      <div id="toolbarDiv">
         <table border="0" align="right" class="toolbarTable">
            <tr valign="center">
               <td>
                  <div id="rvPagingControls">

                     <img alt="first page" id="paging_firstButton" onclick="javascript:uiController.firstPage();" src="<%=request.getContextPath()%>/images/silkIcons/control_start.png"/>
                     <img alt="previous page" id="paging_previousButton" onclick="javascript:uiController.previousPage();" src="<%=request.getContextPath()%>/images/silkIcons/control_rewind.png"/>

                     <input type="text" value="1" id="paging_currentPageInput" onkeypress="javascript:return uiController.onCurrentPageKeyPress(event);" autocomplete="off" />
                     <span id="paging_pageDescr"></span>

                     <img alt="next page" id="paging_nextButton" onclick="javascript:uiController.nextPage();" src="<%=request.getContextPath()%>/images/silkIcons/control_play.png"/>
                     <img alt="last page" id="paging_lastButton" onclick="javascript:uiController.lastPage();" src="<%=request.getContextPath()%>/images/silkIcons/control_end.png"/>


                     <div style="width:20px; display:inline;">
                        <img id="paging_stillLoading" alt="loading" src="<%=request.getContextPath()%>/images/loading.gif"/>
                     </div>
                  </div>
               </td>
               <td>
                  <div id="reportFormatComboBoxContainer">
                     <!-- format combo box is inserted here -->
                  </div>
               </td>
               <td>
                  <script type="text/javascript">
                     document.write("<img onclick=\"uiController.detachCurrentTab();\" onmouseover=\"uiController.raiseButton(event);\" onmouseout=\"uiController.lowerButton(event);\" class=\"tbButton\" src=\"<%=request.getContextPath()%>/images/btnDetachTab.gif\" alt=\"" + applicationResources.getProperty("reportViewer.button.detatchTab.alt") + "\" title=\"" + applicationResources.getProperty("reportViewer.button.detatchTab.title") + "\"/>");
                  </script>
               </td>
               <td>
                  <script type="text/javascript">
                     document.write("<img onclick=\"uiController.removeCurrentTab();\" onmouseover=\"uiController.raiseButton(event);\" onmouseout=\"uiController.lowerButton(event);\" class=\"tbButton\" src=\"<%=request.getContextPath()%>/images/btnCloseTab.gif\" alt=\"" + applicationResources.getProperty("reportViewer.button.closeTab.alt") + "\" title=\"" + applicationResources.getProperty("reportViewer.button.closeTab.title") + "\"/>");
                  </script>
               </td>

               <td>
                  <script type="text/javascript">
                     document.write("<img onclick=\"uiController.editReportOutput();\" onmouseover=\"uiController.raiseButton(event);\" onmouseout=\"uiController.lowerButton(event);\" class=\"tbButton\" src=\"<%=request.getContextPath()%>/images/btnFilter.gif\" alt=\"" + applicationResources.getProperty("reportViewer.button.edit.alt") + "\" title=\"" + applicationResources.getProperty("reportViewer.button.edit.title") + "\"/>");
                  </script>
               </td>
               <td>
                  <script type="text/javascript">
                     document.write("<img onclick=\"uiController.emailOutput();\" onmouseover=\"uiController.raiseButton(event);\" onmouseout=\"uiController.lowerButton(event);\" class=\"tbButton\" src=\"<%=request.getContextPath()%>/images/bbar_icons/actionEmail.gif\" alt=\"" + applicationResources.getProperty("reportViewer.button.email.alt") + "\" title=\"" + applicationResources.getProperty("reportViewer.button.email.title") + "\"/>");
                  </script>
               </td>
               <td>
                  <script type="text/javascript">
                     document.write("<img onclick=\"uiController.saveAs();\" onmouseover=\"uiController.raiseButton(event);\" onmouseout=\"uiController.lowerButton(event);\" class=\"tbButton\" src=\"<%=request.getContextPath()%>/images/btnSaveAs.gif\" alt=\"" + applicationResources.getProperty("reportViewer.button.saveAs.alt") + "\" title=\"" + applicationResources.getProperty("reportViewer.button.saveAs.title") + "\"/>");
                  </script>
               </td>
               <%-- GO Office button is no longer part of the main ADF ref app --%>
                <%--<td>--%>
                  <%--<script type="text/javascript">--%>
                     <%--document.write("<img onclick=\"uiController.addToContentStore();\" onmouseover=\"uiController.raiseButton(event);\" onmouseout=\"uiController.lowerButton(event);\" class=\"tbButton\" src=\"<%=request.getContextPath()%>/images/btnAddToContentStore.gif\" alt=\"" + applicationResources.getProperty("reportViewer.button.addToContentStore.alt") + "\" title=\"" + applicationResources.getProperty("reportViewer.button.addToContentStore.title") + "\"/>");--%>
                  <%--</script>--%>
               <%--</td>--%>

            </tr>
         </table>
      </div>

      <%-- uncomment this if you want to see the URL used by the tab iframes--%>
      <%-- <span id="debugSpan">debug</span>--%>

      <div id="rvTabbedPanelContainer">
         <div id="tabbedPanelDiv" class="tabbedPanelOuterDiv">
            <!--  Tabbed Panel is Inserted Here... -->
         </div>
      </div>
   </html:form>

</body>
</html>

