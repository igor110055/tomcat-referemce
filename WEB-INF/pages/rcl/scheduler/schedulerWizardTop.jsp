<%@ include file="/WEB-INF/pages/common/taglibs.jsp"%>
<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>

<div class="pageBanner">
   <fmt:message key="scheduleWizard.banner"/> - <span id="rwStageName"></span>
</div>

<div id="statusBar">
<table>
<tr valign="top">


<td>
   <table border="0" width="105" cellpadding="0" cellspacing="0">
      <tr valign="top">
         <td>
            <a href="javascript:uiController.jumpTo('type');" style="border:0px">
               <img id="typeImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
            </a>
         </td>
      </tr>
      <tr>
         <td align="center">
            <img id="typeArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
         </td>
      </tr>
      <tr>
         <td align="center">
            <a href="javascript:uiController.jumpTo('type');" style="border:0px" class="wizardBarText">
               <div id="typeImageText">
                  <fmt:message key="scheduleWizard.wizardBar.type"/>
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
            <a href="javascript:uiController.jumpTo('timing');" style="border:0px">
               <img id="timingImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
            </a>
         </td>
      </tr>
      <tr>
         <td align="center">
            <img id="timingArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
         </td>
      </tr>
      <tr>
         <td align="center">
            <a href="javascript:uiController.jumpTo('timing');" style="border:0px" class="wizardBarText">
               <div id="timingImageText">
                  <fmt:message key="scheduleWizard.wizardBar.timing"/>
               </div>
            </a>
         </td>
      </tr>
   </table>
</td>


</tr>
</table>
</div>