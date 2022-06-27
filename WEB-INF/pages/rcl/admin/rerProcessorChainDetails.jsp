<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/pages/common/taglibs.jsp" %>
<html>
<head>
<title>Manage Report Details</title>
<%@ include file="/WEB-INF/pages/rcl/admin/commonAdminConsoleIncludes.jsp" %>

   <script type="text/javascript" src="<%=request.getContextPath()%>/scripts/rcl/common/SortUtil.js"></script>
   <script type="text/javascript" xml:space="preserve">
      function clearChainLink()
      {
         document.getElementById("chainLinkId").value = "";
         document.getElementById("chainLinkOldNameId").value = "";
         document.getElementById("chainLinkClassNameId").value = "";
         document.getElementById("chainLinkExtraArgumentsId").value = "";
      }

      function addChainLink(aStyleId)
      {
         var selectBox = document.getElementById(aStyleId);

         var linkOption = new Option();
         linkOption.text = document.getElementById("chainLinkClassNameId").value;
         linkOption.value = "0";
         linkOption.extraArgs = document.getElementById("chainLinkExtraArgumentsId").value;

         try
         {
            selectBox.add(linkOption, null);
         }
         catch(ex)
         {
            selectBox.add(linkOption); // IE only
         }

         for(var i=0; i < selectBox.options.length; i++)
         {
            selectBox.options[i].selected = false;
         }
         linkOption.selected = true;
         document.getElementById("chainLinkId").value = "0";
      }

      function updateChainLinkInformation(aStyleId)
      {
         var selectBox = document.getElementById(aStyleId);

         // Just incase there isn't one
         if(document.getElementById("chainLinkId").value == "")
         {
            var linkOption = new Option();
            linkOption.text = document.getElementById("chainLinkClassNameId").value;
            linkOption.value = "0";
            linkOption.extraArgs = document.getElementById("chainLinkExtraArgumentsId").value;

            try
            {
               selectBox.add(linkOption, null);
            }
            catch(ex)
            {
               selectBox.add(linkOption); // IE only
            }

            for(var i=0; i < selectBox.options.length; i++)
            {
               selectBox.options[i].selected = false;
            }
            linkOption.selected = true;
            document.getElementById("chainLinkId").value = "0";
         }
         else
         {
            var linkIndex = selectBox.selectedIndex;

            selectBox.options[linkIndex].text = document.getElementById("chainLinkClassNameId").value;
            selectBox.options[linkIndex].extraArgs = document.getElementById("chainLinkExtraArgumentsId").value;
//            selectBox.options[linkIndex].selected = true;
         }
      }

      function editChainLink(aStyleId)
      {
         var selectBox = document.getElementById(aStyleId);
         var selectedOption = selectBox[selectBox.selectedIndex];

         document.getElementById("chainLinkId").value = selectedOption.value;
         document.getElementById("chainLinkOldNameId").value = selectedOption.text;
         document.getElementById("chainLinkClassNameId").value = selectedOption.text;
         document.getElementById("chainLinkExtraArgumentsId").value = selectedOption.extraArgs;
      }

      function deleteChainLink(aStyleId)
      {
         var selectBox = document.getElementById(aStyleId);
         var chainOptions = selectBox.options;

         for(var i=0; i < chainOptions.length;)
         {
            if(chainOptions[i].selected)
            {
               selectBox.remove(i);
            }
            else
               i++
         }

         clearChainLink();
      }

      function moveChainLinkUp(aStyleId)
      {
         var selectBox = document.getElementById(aStyleId);
         var chainOptions= selectBox.options;

         for(var i=0; i < chainOptions.length; i++)
         {
            if(i > 0 && chainOptions[i].selected)
            {
               var tempText = chainOptions[i-1].text;
               var tempValue = chainOptions[i-1].value;
               var tempExtra = chainOptions[i-1].extraAurgs;

               chainOptions[i-1].text = chainOptions[i].text;
               chainOptions[i-1].value = chainOptions[i].value;
               chainOptions[i-1].extraAurgs = chainOptions[i].extraAurgs;
               chainOptions[i-1].selected = true;

               chainOptions[i].text = tempText;
               chainOptions[i].value = tempValue;
               chainOptions[i].extraAurgs = tempExtra;
               chainOptions[i].selected = false;
            }
         }
      }

      function moveChainLinkDown(aStyleId)
      {
         var selectBox = document.getElementById(aStyleId);
         var chainOptions= selectBox.options;

         for(var i=chainOptions.length-1; i >= 0; i--)
         {
            if(i < chainOptions.length-1 && chainOptions[i].selected)
            {
               var tempText = chainOptions[i+1].text;
               var tempValue = chainOptions[i+1].value;
               var tempExtra = chainOptions[i+1].extraAurgs;

               chainOptions[i+1].text = chainOptions[i].text;
               chainOptions[i+1].value = chainOptions[i].value;
               chainOptions[i+1].extraAurgs = chainOptions[i].extraAurgs;
               chainOptions[i+1].selected = true;

               chainOptions[i].text = tempText;
               chainOptions[i].value = tempValue;
               chainOptions[i].extraAurgs = tempExtra;
               chainOptions[i].selected = false;
            }
         }
      }

      function submitChainLinks(aStyleId)
      {
         var chainLinkOptions = document.getElementById(aStyleId).options;
         var formChainLinksString = document.forms[0].chainLinksString;

         formChainLinksString.value = "";
         for(var i=0; i < chainLinkOptions.length; i++)
         {
            if(i > 0)
            {
               formChainLinksString.value += "|";
            }

            formChainLinksString.value += chainLinkOptions[i].value + ":" +
                                          chainLinkOptions[i].text + ":" +
                                          chainLinkOptions[i].extraArgs;
         }
      }

      DocumentLifeCycleMonitor.getInstance().addOnLoadListener(function()
         {
            var linkSelect = document.getElementById("chainLinkSelectId");

            var linkOption;
            <c:forEach items="${form.chainLinksList}" var="eachLink">
               linkOption = new Option();
               linkOption.text = "${eachLink.processorClassName}";
               linkOption.value = "${eachLink.id}";
               linkOption.extraArgs = "${eachLink.extraArgs}";

               try
               {
                  linkSelect.add(linkOption, null);
               }
               catch(ex)
               {
                  linkSelect.add(linkOption); // IE only
               }
            </c:forEach>
         });
   </script>
</head>

<body class="rclBody"
      onload="DocumentLifeCycleMonitor.getInstance().documentWasLoaded();"
      onunload="DocumentLifeCycleMonitor.getInstance().documentWasUnLoaded();">

   <html:form action="/secure/actions/admin/saveRerProcessorChain">
      <html:hidden property="chainId"/>
      <html:hidden property="chainLinksString"/>
      <div id="bodyDiv">
         <div id="contentShell">
            <div>
               <div class="pageBanner">
               <%--<c:out value="${form.pageTitle}"/>--%>
               </div>
               <%--<c:if test="${form.operation == 'edit'}">--%>
                  <!--<div class="pageTraverseButtons">-->
                     <%--<html:button style="float:right;" property="" bundle="rcl" titleKey="admin.reports.button.nav.next.title" altKey="admin.reports.button.nav.next.alt"--%>
                                  <%--onclick="saveFragments(); checkNameAndGetAdjacentObject(document.forms[0].parentFolderId.value, document.forms[0].reportName.value, -1, reportSummaries, document.forms[0].reportId.value, '/secure/actions/admin/saveReport.do?reportId=');">--%>
                        <%--<fmt:message key="admin.reports.button.nav.next"/>--%>
                     <%--</html:button>--%>
                     <%--<html:button style="float:right;" property="" bundle="rcl" titleKey="admin.reports.button.nav.previous.title" altKey="admin.reports.button.nav.next.alt"--%>
                                  <%--onclick="saveFragments(); checkNameAndGetAdjacentObject(document.forms[0].parentFolderId.value, document.forms[0].reportName.value, 1, reportSummaries, document.forms[0].reportId.value, '/secure/actions/admin/saveReport.do?reportId=');">--%>
                        <%--<fmt:message key="admin.reports.button.nav.previous"/>--%>
                     <%--</html:button>--%>
                  <!--</div>-->
               <%--</c:if>--%>
            </div>
            <div class="pageBody">
               <table>
                  <tr>
                     <td class="label">
                        <span class="labelText"><fmt:message key="admin.rerProcessorChain.name"/></span>
                     </td>
                     <td>
                        <html:text property="chainName" size="90"/>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">
                        <span class="labelText"><fmt:message key="admin.rerProcessorChain.type"/></span>
                     </td>
                     <td>
                        <html:select property="chainType" style="width:150px;">
                           <html:optionsCollection property="processorChainTypes" label="name" value="type"/>
                        </html:select>
                     </td>
                  </tr>
                  <tr class="invalidForContentNodes">
                     <td class="label" valign="top">
                        <span class="labelText"><fmt:message key="admin.rerProcessorChain.links"/></span>
                     </td>
                     <td>
                        <table>
                           <tr>
                              <td>
                                 <select size="10" multiple="true" style="width:450px"
                                              id="chainLinkSelectId" onchange="editChainLink('chainLinkSelectId');"/>
                              </td>
                              <td valign="top">
                                 <html:button property="" style="width:80px" onclick="moveChainLinkUp('chainLinkSelectId');"
                                     altKey="admin.rerProcessorChain.moveUp" titleKey="admin.rerProcessorChain.moveUp" bundle="rcl">
                                    <fmt:message key="admin.rerProcessorChain.moveUp"/>
                                 </html:button><br/>
                                 <html:button property="" style="width:80px" onclick="moveChainLinkDown('chainLinkSelectId');"
                                     altKey="admin.rerProcessorChain.moveDown" titleKey="admin.rerProcessorChain.moveDown" bundle="rcl">
                                    <fmt:message key="admin.rerProcessorChain.moveDown"/>
                                 </html:button><br/><br/>
                                 <html:button property="" style="width:80px" onclick="deleteChainLink('chainLinkSelectId');"
                                     altKey="admin.rerProcessorChain.delete" titleKey="admin.rerProcessorChain.delete" bundle="rcl">
                                    <fmt:message key="admin.rerProcessorChain.delete"/>
                                 </html:button>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td class="label">
                        <span class="labelText"><fmt:message key="admin.rerProcessorChain.linkDetails"/></span>
                     </td>
                  </tr>
                  <tr>
                     <td/>
                     <td valign="top">
                        <table id="chianLinkTableId">
                           <tr>
                              <td class="label">
                                 <span class="labelText"><fmt:message key="admin.rerProcessorChain.linkClassName"/></span>
                              </td>
                              <td>
                                 <input type="hidden" id="chainLinkId"/>
                                 <input type="hidden" id="chainLinkOldNameId"/>
                                 <input type="text" id="chainLinkClassNameId" size="50"/>
                              </td>
                           </tr>
                           <tr>
                              <td class="label">
                                 <span class="labelText"><fmt:message key="admin.rerProcessorChain.linkExtraArguments"/></span>
                              </td>
                              <td>
                                 <input type="text" id="chainLinkExtraArgumentsId" size="50"/>
                              </td>
                           </tr>
                           <tr>
                              <td align="right" colspan="2">
                                 <html:button property="" style="width:80px" onclick="clearChainLink();"
                                     altKey="admin.rerProcessorChain.clear" titleKey="admin.rerProcessorChain.clear" bundle="rcl">
                                    <fmt:message key="admin.rerProcessorChain.clear"/>
                                 </html:button>
                                 <html:button property="" style="width:80px" onclick="addChainLink('chainLinkSelectId');"
                                     altKey="admin.rerProcessorChain.add" titleKey="admin.rerProcessorChain.add" bundle="rcl">
                                    <fmt:message key="admin.rerProcessorChain.add"/>
                                 </html:button>
                                 <html:button property="" style="width:80px" onclick="updateChainLinkInformation('chainLinkSelectId');"
                                     altKey="admin.rerProcessorChain.update" titleKey="admin.rerProcessorChain.update" bundle="rcl">
                                    <fmt:message key="admin.rerProcessorChain.update"/>
                                 </html:button>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td colspan="2">
                        <html:submit bundle="rcl" altKey="admin.button.ok.alt" titleKey="admin.button.ok.title" onclick="submitChainLinks('chainLinkSelectId')">
                           <fmt:message key="admin.button.ok"/>
                        </html:submit>
                        <html:cancel bundle="rcl" altKey="admin.button.cancel.alt" titleKey="admin.button.cancel.title">
                           <fmt:message key="admin.button.cancel"/>
                        </html:cancel>
                     </td>
                  </tr>
               </table>
            </div>
         </div>
      </div>
   </html:form>
</body>
</html>
