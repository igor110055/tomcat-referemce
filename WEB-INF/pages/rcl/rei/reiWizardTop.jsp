<%@ page import="com.focus.rcl.RclEnvironment" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>

<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>

<div class="pageBanner">
   <fmt:message key="profileWizard.banner"/> - <span id="rwStageName"></span>
</div>

<div id="statusBar">
<table>
<tr valign="top">
<c:if test="${reiForm.hasCustomPrompt}">
   <td>
      <table border="0" width="105" cellpadding="0" cellspacing="0">
         <tr valign="top">
            <td>
               <a href="javascript:uiController.jumpTo('params');" style="border:0px">
                  <img id="paramsImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
               </a>
            </td>
         </tr>
         <tr>
            <td align="center">
               <img id="paramsArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
            </td>
         </tr>
         <tr>
            <td align="center">
               <a href="javascript:uiController.jumpTo('params');" style="border:0px" class="wizardBarText">
                  <div id="paramsImageText">
                     <fmt:message key="profileWizard.wizardBar.parameters"/>
                  </div>
               </a>
            </td>
         </tr>
      </table>
   </td>
</c:if>
<c:if test="${!reiForm.fromDeepLinkAction}">
   <td>
      <table border="0" width="105" cellpadding="0" cellspacing="0">
         <tr valign="top">
            <td>
               <a href="javascript:uiController.jumpTo('outputs');" style="border:0px">
                  <img id="outputsImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
               </a>
            </td>
         </tr>
         <tr>
            <td align="center">
               <img id="outputsArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
            </td>
         </tr>
         <tr>
            <td align="center">
               <a href="javascript:uiController.jumpTo('outputs');" style="border:0px" class="wizardBarText">
                  <div id="outputsImageText">
                     <fmt:message key="profileWizard.wizardBar.outputs"/>
                  </div>
               </a>
            </td>
         </tr>
      </table>
   </td>

   <td>
      <table border="0" width="105" cellpadding="0" cellspacing="0">
         <tr valign="top">
            <td>
               <a href="javascript:uiController.jumpTo('destinations');" style="border:0px">
                  <img id="destinationsImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
               </a>
            </td>
         </tr>
         <tr>
            <td align="center">
               <img id="destinationsArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
            </td>
         </tr>
         <tr>
            <td align="center">
               <a href="javascript:uiController.jumpTo('destinations');" style="border:0px" class="wizardBarText">
                  <div id="destinationsImageText">
                     <fmt:message key="profileWizard.wizardBar.destinations"/>
                  </div>
               </a>
            </td>
         </tr>
      </table>
   </td>

   <td>
      <table border="0" width="105" cellpadding="0" cellspacing="0">
         <tr valign="top">
            <td>
               <a href="javascript:uiController.jumpTo('filters');" style="border:0px">
                  <img id="filtersImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
               </a>
            </td>
         </tr>
         <tr>
            <td align="center">
               <img id="filtersArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
            </td>
         </tr>
         <tr>
            <td align="center">
               <a href="javascript:uiController.jumpTo('filters');" style="border:0px" class="wizardBarText">
                  <div id="filtersImageText">
                     <fmt:message key="profileWizard.wizardBar.filters"/>
                  </div>
               </a>
            </td>
         </tr>
      </table>
   </td>

   <td>
      <table border="0" width="105" cellpadding="0" cellspacing="0">
         <tr valign="top">
            <td>
               <a href="javascript:uiController.jumpTo('sorts');" style="border:0px">
                  <img id="sortsImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
               </a>
            </td>
         </tr>
         <tr>
            <td align="center">
               <img id="sortsArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
            </td>
         </tr>
         <tr>
            <td align="center">
               <a href="javascript:uiController.jumpTo('sorts');" style="border:0px" class="wizardBarText">
                  <div id="sortsImageText">
                     <fmt:message key="profileWizard.wizardBar.sortModifications"/>
                  </div>
               </a>
            </td>
         </tr>
      </table>
   </td>

   <td>
      <table border="0" width="105" cellpadding="0" cellspacing="0">
         <tr valign="top">
            <td>
               <a href="javascript:uiController.jumpTo('content');" style="border:0px">
                  <img id="contentImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
               </a>
            </td>
         </tr>
         <tr>
            <td align="center">
               <img id="contentArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
            </td>
         </tr>
         <tr>
            <td align="center">
               <a href="javascript:uiController.jumpTo('content');" style="border:0px" class="wizardBarText">
                  <div id="contentImageText">
                     <fmt:message key="profileWizard.wizardBar.content"/>
                  </div>
               </a>
            </td>
         </tr>
      </table>
   </td>
    <logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
    <td style="width:60px;">
    </td>
    <td>
        <div id="adminDiv" style="vertical-align:middle;text-align:center;">
           <fieldset>
              <legend>Administrators</legend>
              <a href="#" onclick="editMetadata();" >Edit This Report's Metadata</a>
           </fieldset>
        </div>
    </td>
    </logic:present>

</c:if>
</tr>
</table>
</div>

<logic:present role="<%=RclEnvironment.getRclSecurityAdminGroups()%>">
<script type="text/javascript">
    function editMetadata()
    {
       var url = ServerEnvironment.baseUrl + "/secure/actions/admin/reportMd/edit.do?reportId=<c:out value="${reiForm.targetReport.id}"/>";

       var windowName = ServerEnvironment.windowNamePrefix + "_EditMetadata_<c:out value="${reiForm.targetId}"/>";

       var geom = new BrowserGeometry();
       var win = window.open(url,
               windowName,
               "width=1000,height=705,top=" + geom.top + ",left=" + geom.left + ",menubar=no,toolbar=no,scrollbars=yes,resizable=yes,status=yes");

       win.focus();
    }
</script>
</logic:present>
    