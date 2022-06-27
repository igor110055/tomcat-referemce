
<%@ page import="com.focus.rcl.RclEnvironment"%>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<%@ include file="/WEB-INF/pages/common/fmtSetBundle.jsp" %>

<div class="pageBanner">
   <fmt:message key="reportWizard.title"/> - <span id="rwStageName"><fmt:message key="reportWizard.selectReportType.title"/></span>
</div>

<div id="statusBar">
   <table>
      <tr valign="top">
         <td>
            <table border="0" width="105" cellpadding="0" cellspacing="0">
               <tr valign="top">
                  <td>
                     <a href="javascript:uiController.jumpTo('selectReportType');" style="border:0px">
                        <img id="selectReportTypeImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
                     </a>
                  </td>
               </tr>
               <tr>
                  <td align="center">
                     <img id="selectReportTypeArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
                  </td>
               </tr>
               <tr>
                  <td align="center">
                     <a href="javascript:uiController.jumpTo('selectReportType');" style="border:0px" class="wizardBarText">
                        <div id="selectReportTypeImageText">
                           <fmt:message key="reportWizard.selectType.stageTitle"/>
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
                     <a href="javascript:uiController.jumpTo('columnSelection');" style="border:0px">
                        <%--<img id="columnSelectionImage" src="<%=request.getContextPath()%>/images/reportWizardColumnSelection-off.jpg" alt="" style="border:0px"/>--%>
                        <img id="columnSelectionImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
                     </a>
                  </td>
               </tr>
               <tr>
                  <td align="center">
                     <img id="columnSelectionArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
                  </td>
               </tr>
               <tr>
                  <td align="center">
                     <a href="javascript:uiController.jumpTo('columnSelection');" style="border:0px" class="wizardBarText">
                        <div id="columnSelectionImageText">
                           <fmt:message key="reportWizard.columnSelection.stageTitle"/>
                        </div>
                     </a>
                  </td>
               </tr>
            </table>
         </td>

         <c:if test="<%=RclEnvironment.isWizardPromptEnabled()%>" >
            <td>
               <table border="0" width="105" cellpadding="0" cellspacing="0">
                  <tr valign="top">
                     <td>
                        <a href="javascript:uiController.jumpTo('prompt');" style="border:0px">
                           <img id="promptImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
                        </a>
                     </td>
                  </tr>
                  <tr>
                     <td align="center">
                        <img id="promptArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
                     </td>
                  </tr>
                  <tr>
                     <td align="center">
                        <a href="javascript:uiController.jumpTo('prompt');" style="border:0px" class="wizardBarText">
                           <div id="promptImageText">
                              <fmt:message key="reportWizard.prompt.stageTitle"/>
                           </div>
                        </a>
                     </td>
                  </tr>
               </table>
            </td>

         </c:if>
         <c:if test="<%=RclEnvironment.isWizardCalculationEnabled()%>" >
            <td>
               <table border="0" width="105" cellpadding="0" cellspacing="0">
                  <tr valign="top">
                     <td>
                        <a href="javascript:uiController.jumpTo('calculatedFields');" style="border:0px">
                           <img id="calculatedFieldsImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
                        </a>
                     </td>
                  </tr>
                  <tr>
                     <td align="center">
                        <img id="calculatedFieldsArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
                     </td>
                  </tr>
                  <tr>
                     <td align="center">
                        <a href="javascript:uiController.jumpTo('calculatedFields');" style="border:0px" class="wizardBarText">
                           <div id="calculatedFieldsImageText">
                             <fmt:message key="reportWizard.calculatedFields.stageTitle"/>
                           </div>
                        </a>
                     </td>
                  </tr>
               </table>
            </td>
         </c:if>
         <td>
            <table border="0" width="105" cellpadding="0" cellspacing="0">
               <tr valign="top">
                  <td>
                     <a href="javascript:uiController.jumpTo('filter');" style="border:0px">
                        <%--<img id="filterImage" src="<%=request.getContextPath()%>/images/reportWizardFilters-off.jpg" alt="" style="border:0px"/>--%>
                        <img id="filterImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
                     </a>
                  </td>
               </tr>
               <tr>
                  <td align="center">
                     <img id="filterArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
                  </td>
               </tr>
               <tr>
                  <td align="center">
                     <a href="javascript:uiController.jumpTo('filter');" style="border:0px" class="wizardBarText">
                        <div id="filterImageText">
                           <fmt:message key="reportWizard.filters.stageTitle"/>
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
                     <a href="javascript:uiController.jumpTo('summary');" style="border:0px">
                        <img id="summaryImage" src="<%=request.getContextPath()%>/images/wizardBar_off.png" alt="" style="border:0px; height:15px; width:100%;"/>
                     </a>
                  </td>
               </tr>
               <tr>
                  <td align="center">
                     <img id="summaryArrowImage" src="<%=request.getContextPath()%>/images/arrow_down_trans.gif"/>
                  </td>
               </tr>
               <tr>
                  <td align="center">
                     <a href="javascript:uiController.jumpTo('summary');" style="border:0px" class="wizardBarText">
                        <div id="summaryImageText">
                           <fmt:message key="reportWizard.summary.stageTitle"/>
                        </div>
                     </a>
                  </td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
</div>
